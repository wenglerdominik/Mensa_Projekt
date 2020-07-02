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
    public class AdditionalProductController : ControllerBase
    {
		[HttpGet()]
		public IEnumerable<AdditionalProduct> Select() => AdditionalProduct.GetList();

		//Liste mit Produktinfos und Locationinfos
		[HttpGet("extendedManage/{id}")]
		public IEnumerable<AdditionalProductExt> SelectExt(int id) => AdditionalProductExt.GetListExt(id);

		//List mit Produkten für gewählte Ausgabestelle
		[HttpGet("extended/{id}")]
		public IEnumerable<AdditionalProductExt> SelectExtForLocation(int id) => AdditionalProductExt.GetListExtLocation(id);


		[HttpPost()]
		public IActionResult Insert([FromBody]AdditionalProduct additionalProduct)
		{
			ObjectResult result = null;
			try
			{
				if (additionalProduct.Save() == 1) result = new ObjectResult(new { success = true, message = "ok", additionalProduct = additionalProduct }) { StatusCode = (int)HttpStatusCode.OK };
				else result = new ObjectResult(new { success = false, message = "additionalProduct not saved", additionalProduct = additionalProduct }) { StatusCode = (int)HttpStatusCode.NotModified };
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