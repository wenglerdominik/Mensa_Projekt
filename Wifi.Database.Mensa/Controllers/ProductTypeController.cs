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
	public class ProductTypeController : ControllerBase
	{
		//alle Produkttypen
		[HttpGet()]
		public IEnumerable<ProductType> Select() => ProductType.GetList();

		[HttpGet("{additional}")]
		public IEnumerable<ProductType> SelectKitchen(bool additional) => ProductType.GetListKitchen(additional);

		[HttpGet("menuetype")]
		public IEnumerable<ProductType> SelectMenueTypes() => ProductType.GetListMenue();


		//[HttpGet("{type}")]
		//public dynamic Check(int type) => ProductType.Get(type);



		[HttpPost()]
		public IActionResult Insert([FromBody]ProductType productType)
		{
			ObjectResult result = null;
			try
			{
				if (productType.Save() == 1) result = new ObjectResult(new { success = true, message = "ok", productType = productType }) { StatusCode = (int)HttpStatusCode.OK };
				else result = new ObjectResult(new { success = false, message = "productType not saved", productType = productType }) { StatusCode = (int)HttpStatusCode.NotModified };
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
//		public IActionResult Update(string id, [FromBody]ProductType productType)
//		{
//			ObjectResult result = null;
//			try
//			{
//				ProductType p = ProductType.Get(id); // nicht notwendig
//				if (productType.Save() == 1) result = new ObjectResult(new { success = true, message = "ok", productType = productType }) { StatusCode = (int)HttpStatusCode.OK };
//				else result = new ObjectResult(new { success = false, message = "productType not saved", productType = productType }) { StatusCode = (int)HttpStatusCode.NotModified };
//			}
//			catch (Exception ex)
//			{
//#if DEBUG
//				result = new ObjectResult(new { success = false, message = ex.Message }) { StatusCode = (int)HttpStatusCode.NotModified };
//#else
//				result = new ObjectResult(new { success = false, message = "Fehler beim Speichern!" }) { StatusCode = (int)HttpStatusCode.NotModified };
//#endif
//			}

//			return result;
//		}

		[HttpDelete("{id}")]
		public IActionResult Delete(long id)
		{
			return Ok();
		}

	}
}
