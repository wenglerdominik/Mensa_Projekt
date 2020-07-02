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
    public class MenueDetailController : ControllerBase
    {
		[HttpGet()]
		public IEnumerable<MenueDetail> Select() => MenueDetail.GetList();

		[HttpGet("{id}")]
		public dynamic Check(int id) => MenueDetail.Get(id);

		[HttpPost()]
		public IActionResult Insert([FromBody]MenueDetail[] menuedetail)
		{
			ObjectResult result = null;
			try
			{
				int saved = 0;
				foreach (MenueDetail menueDetail in menuedetail) saved += menueDetail.Save();
				if (saved == menuedetail.Length) result = new ObjectResult(new { success = true, message = "ok", menuedetail = menuedetail }) { StatusCode = (int)HttpStatusCode.OK };
				else result = new ObjectResult(new { success = false, message = "menuedetail not saved", menuedetail = menuedetail }) { StatusCode = (int)HttpStatusCode.NotModified };
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


		[HttpPut()]
		public IActionResult Update(long id, [FromBody]MenueDetail menuedetail)
		{
			ObjectResult result = null;
			try
			{
				if (menuedetail.Save() == 1) result = new ObjectResult(new { success = true, message = "ok", menuedetail = menuedetail }) { StatusCode = (int)HttpStatusCode.OK };
				else result = new ObjectResult(new { success = false, message = "menuedetail not saved", menmenuedetailue = menuedetail }) { StatusCode = (int)HttpStatusCode.NotModified };
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

		//[HttpDelete("{id}")]
		//public IActionResult Delete(long id)
		//{
		//	return Ok();
		//}

		[HttpDelete]
		public IActionResult Delete([FromBody] MenueDetail[] menueDetailId)
		{
			ObjectResult result = null;
			try
			{
				int deleted = 0;
				foreach (MenueDetail menueDetail in menueDetailId) deleted += menueDetail.Delete();
				if (deleted >0 ) result = new ObjectResult(new { success = true, message = "ok", deletedMenueDetails = deleted }) { StatusCode = (int)HttpStatusCode.OK };
				else result = new ObjectResult(new { success = false, message = "menuedetails not deleted", menueDetailId = menueDetailId }) { StatusCode = (int)HttpStatusCode.NotModified };
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
	}
}