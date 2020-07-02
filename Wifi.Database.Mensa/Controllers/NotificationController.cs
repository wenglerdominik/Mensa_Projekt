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
    public class NotificationController : ControllerBase
    {

        [HttpGet("{userid}")]
        public IEnumerable<Notification> Select(long userid) => Notification.GetList(userid);

        [HttpPost("{messageid}")]
        public IActionResult Update(long messageid)
        {
            ObjectResult result = null;
            try
            {
                Notification notification = new Notification();
                notification.NotificationId = messageid;
                notification.IsRead = true;
                if (notification.Save() == 1) result = new ObjectResult(new { success = true, message = "ok" }) { StatusCode = (int)HttpStatusCode.OK };
                else result = new ObjectResult(new { success = false, message = "message not updated" }) { StatusCode = (int)HttpStatusCode.NotModified };
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