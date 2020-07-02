using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Wifi.Database.Mensa.Modules;

namespace Wifi.Database.Mensa.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class MenueController : ControllerBase
    {
        [HttpGet()]
        public IEnumerable<Menue> Select() => Menue.GetList();

        [HttpGet("{id}")]
        public dynamic Check(int id) => Menue.Get(id);


        [HttpGet("menuedetail/{year}/{month}/{day}")]
        public IEnumerable<MenueExt> SelectMenueDetail(int year, int month, int day) => MenueExt.GetListDay(year, month, day);

        [HttpGet("monthList/{year}/{month}/{day}")]
        public IEnumerable<Menue> SelectMonth(int year, int month, int day) => Menue.GetList(year, month, day);

//        [HttpPost()]
//        public IActionResult Insert([FromBody]Menue menue)
//        {
//            ObjectResult result = null;
//            try
//            {
//                if (menue.Save() == 1) result = new ObjectResult(new { success = true, message = "ok", menue = menue }) { StatusCode = (int)HttpStatusCode.OK };
//                else result = new ObjectResult(new { success = false, message = "menue not saved", menue = menue }) { StatusCode = (int)HttpStatusCode.NotModified };
//            }
//            catch (Exception ex)
//            {
//#if DEBUG
//                result = new ObjectResult(new { success = false, message = ex.Message }) { StatusCode = (int)HttpStatusCode.NotModified };
//#else
//				result = new ObjectResult(new { success = false, message = "Fehler beim Speichern!" }) { StatusCode = (int)HttpStatusCode.NotModified };
//#endif
//            }

//            return result;
        //}

        [HttpPost()]
        public IActionResult Insert([FromBody] List<Dictionary<string, object>> menueObjectList)
        {
            ObjectResult result = null;
            int saveMenues = 0;
            try
            {
                foreach(Dictionary<string, object> menueObject in menueObjectList)
                {
                    Menue menue = JsonConvert.DeserializeObject<Menue>(menueObject["menue"].ToString());

                    List<MenueDetail> menueDetails = JsonConvert.DeserializeObject<List<MenueDetail>>(menueObject["detaillist"].ToString());
                    if (menue.Save() == 1)
                    {
                        foreach(MenueDetail item in menueDetails)
                        {
                            item.MenueId = (long)menue.MenueId;
                            item.Save();
                        }
                    }
                    saveMenues++;
                }
                if (saveMenues == menueObjectList.Count) result = new ObjectResult(new { success = true, message = "ok", }) { StatusCode = (int)HttpStatusCode.OK };
                else return StatusCode((int)HttpStatusCode.NotModified, new { success = false, resultmsg = "Datensatz nicht gespeicert" });

                return result;
            }
            catch (Exception)
            {

                throw;
            }
        }



        [HttpPut()]
        public IActionResult Update(long id, [FromBody]Menue menue)
        {
            ObjectResult result = null;
            try
            {
                if (menue.Save() == 1) result = new ObjectResult(new { success = true, message = "ok", menue = menue }) { StatusCode = (int)HttpStatusCode.OK };
                else result = new ObjectResult(new { success = false, message = "menue not saved", menue = menue }) { StatusCode = (int)HttpStatusCode.NotModified };
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
        //public IActionResult Delete(long id) //=> Menue.Delete(id);
        //{

        //    //    Menue.Delete(id);
        //    if (Menue.Delete(id)) return Ok();
        //}

        [HttpDelete()]
        public IActionResult Delete([FromBody]Menue[] menues)
        {
            ObjectResult result = null;
            try
            {
                int deleted = 0;
                foreach (Menue menue in menues) deleted += menue.Delete();
                if (deleted == menues.Length) result = new ObjectResult(new { success = true, message = "ok", deletedMenues = deleted}) { StatusCode = (int)HttpStatusCode.OK };
                else result = new ObjectResult(new { success = false, message = "menue not deleted", menues = menues }) { StatusCode = (int)HttpStatusCode.NotModified };
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