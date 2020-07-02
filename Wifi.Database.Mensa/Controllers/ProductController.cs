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
    public class ProductController : ControllerBase
    {
		[HttpGet()]
		public IEnumerable<Product> Select() => Product.GetList();

		//GetList for Kitchen without additional
		

		[HttpGet("{additional}/{type}")]
		//Liefert Produkte mit dem Produktyp Namen
		public IEnumerable<ProductExt> SelectProductsWithTypeName(bool additional,int type) => ProductExt.GetListWithTypeName(additional, type);

		[HttpGet("{additional}")]
		public IEnumerable<ProductExt> SelectWithTypeName(bool additional) => ProductExt.GetListWithTypeName(additional);


		[HttpGet("{additional}/Filtered/{filter}")]
		public IEnumerable<ProductExt> SelectWithTypeNameFiltered(bool additional, string filter) => ProductExt.GetFilterdListWithTypeName(additional,filter);


		[HttpGet("productsMenue/{type}")]
		//Liefert Produkte in Abhängigkeit vom Menütyp
		public IEnumerable<Product> SelectProductsMenueList(int type) => Product.GetListForNewMenue(type);


		[HttpGet("menueDetail/{menueid}")]
		//Liefert Produkte in Abhängigkeit vom Menütyp
		public IEnumerable<Product> SelectProductsMenueDetailList(int menueid) => Product.GetListForMenueDetail(menueid);


		//[HttpGet("{type}")]
		//public dynamic Check(int type) => Product.Get(type);

		[HttpPost()]
		public IActionResult Insert([FromBody]Product product)
		{
			ObjectResult result = null;
			try
			{
				if (product.Save() == 1) result = new ObjectResult(new { success = true, message = "ok", product = product }) { StatusCode = (int)HttpStatusCode.OK };
				else result = new ObjectResult(new { success = false, message = "product not saved", product = product }) { StatusCode = (int)HttpStatusCode.NotModified };
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
		public IActionResult Update(long id, [FromBody]Product product)
		{
			ObjectResult result = null;
			try
			{				
				if (product.Save() == 1) result = new ObjectResult(new { success = true, message = "ok", product = product }) { StatusCode = (int)HttpStatusCode.OK };
				else result = new ObjectResult(new { success = false, message = "product not saved", product = product }) { StatusCode = (int)HttpStatusCode.NotModified };
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