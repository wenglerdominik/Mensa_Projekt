using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wifi.Database.Mensa.Modules;

namespace Wifi.Database.Mensa.Controllers
{
	[Route("api/v1/[controller]")]
	[ApiController]
	public class UserController : ControllerBase
	{
		[HttpGet()]
		public IEnumerable<User> Select() => Wifi.Database.Mensa.Modules.User.GetList();

		[HttpGet("{nickname}")]
		public dynamic Check(string nickname) => Wifi.Database.Mensa.Modules.User.GetNickname(nickname);

		[HttpPost()]
		public IActionResult Insert([FromBody]User user)
		{
			ObjectResult result = null;
			try
			{
				if (user.Save() == 1) result = new ObjectResult(new { success = true, message = "ok", user = user }) { StatusCode = (int)HttpStatusCode.OK };
				else result = new ObjectResult(new { success = false, message = "user not saved", user = user }) { StatusCode = (int)HttpStatusCode.NotModified };
			}
			catch (Exception ex)
			{
#if DEBUG
				result = new ObjectResult(new { success = false, message = ex.Message }) { StatusCode = (int)HttpStatusCode.NotModified };
#else
				result = new ObjectResult(new { success = false, message = "Fehler beim Speichern!" }) { StatusCode = (int)HttpStatusCode.NotModified };
#endif
			}

			return result;
		}

		[HttpPost("login")]
		public dynamic CheckUser([FromBody]Dictionary<string, string> loginObject) => Wifi.Database.Mensa.Modules.User.Get(loginObject["nickname"], loginObject["password"]);


		[HttpPut()]
		public IActionResult Update(string id, [FromBody]User user)
		{
			ObjectResult result = null;
			try
			{
				User u = Wifi.Database.Mensa.Modules.User.Get(id); // nicht notwendig
				if (user.Save() == 1) result = new ObjectResult(new { success = true, message = "ok", user = user }) { StatusCode = (int)HttpStatusCode.OK };
				else result = new ObjectResult(new { success = false, message = "user not saved", user = user }) { StatusCode = (int)HttpStatusCode.NotModified };
			}
			catch (Exception ex)
			{
#if DEBUG
				result = new ObjectResult(new { success = false, message = ex.Message }) { StatusCode = (int)HttpStatusCode.NotModified };
#else
				result = new ObjectResult(new { success = false, message = "Fehler beim Speichern!" }) { StatusCode = (int)HttpStatusCode.NotModified };
#endif
			}

			return result;
		}

		[HttpDelete("{id}")]
		public IActionResult Delete(long id)
		{
			return Ok();
		}

	}
}