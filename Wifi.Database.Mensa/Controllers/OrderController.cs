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
    public class OrderController : ControllerBase
    {

        [HttpGet("{year}/{month}/{day}/{userid}")]
        public IEnumerable<Order> SelectMonth(int year, int month, int day, int userid) => Order.GetList(year, month, day, userid);


        [HttpGet("userReport/{year}/{month}/{userid}/{consumed}")]
        public IEnumerable<OrderReportUser> GetUserOrderMonth(int year, int month, int userid, bool consumed) => OrderReportUser.GetList(year, month, userid, consumed);

        [HttpGet("userReportDetail/{orderid}")]
        public IEnumerable<OrderReportUser> GetUserOrderDetail(long orderid) => OrderReportUser.GetOrderDetails(orderid);


        [HttpGet("countReportKitchen/{year}/{month}/{day}")]
        public IEnumerable<OrderReportKitchen> GetCountOrder(int year, int month, int day) => OrderReportKitchen.GetListOrderForKitchen(year, month, day);

        [HttpGet("countReportLocation/{year}/{month}/{day}")]
        public IEnumerable<OrderReportKitchen> GetCountOrderLocation(int year, int month, int day) => OrderReportKitchen.GetListOrderCountLocation(year, month, day);

        [HttpGet("billingMonth/{year}/{month}/{day}")]
        public IEnumerable<OrderReportKitchen> GetBillingMonth(int year, int month, int day) => OrderReportKitchen.GetMonthBilling(year, month, day);

        [HttpGet("orderedMenues/{year}/{month}/{day}/{location}/{consumed}")]
        public IEnumerable<OrderedMenues> GetOrderedMenues(int year, int month, int day, long location, bool consumed) => OrderedMenues.GetOrderedMenues(year, month, day, location, consumed);

        [HttpGet("orderedAdditional/{year}/{month}/{day}/{location}/{consumed}/{orderid}")]
        public IEnumerable<OrderedMenues> GetOrderedAddProducts(int year, int month, int day, long location, bool consumed, long orderid) => OrderedMenues.GetOrderedAddProducts(year, month, day, location, consumed, orderid);

       //Report für Ausgabe --> Anzahl Menüs incl konsumierter
        [HttpGet("orderReportOutput/{year}/{month}/{day}/{location}")]
        public IEnumerable<OrderReportOutput> GetOrderCount(int year, int month, int day, long location) => OrderReportOutput.GetListOrderCount(year, month, day, location);

        [HttpGet("orderReportOutputMonth/{year}/{month}/{location}")]
        public IEnumerable<OrderReportOutput> GetOrderCountMonth(int year, int month,  long location) => OrderReportOutput.GetListOrderCountMonthSummary(year, month, location);

        [HttpGet("orderReportOutputMonthDetail/{year}/{month}/{location}")]
        public IEnumerable<OrderReportOutput> GetOrderCountMonthDetail(int year, int month, long location) => OrderReportOutput.GetListOrderCountMonthDetail(year, month, location);


        [HttpPost()]
        public IActionResult Insert([FromBody] Dictionary<string, object> orderObject)
        {
            ObjectResult result = null;

            try
            {

                Order order = JsonConvert.DeserializeObject<Order>(orderObject["order"].ToString());

                List<OrderDetail> detailList = JsonConvert.DeserializeObject<List<OrderDetail>>(orderObject["detaillist"].ToString());
                int savedDetail = 0;
                if (order.Save() == 1)
                {

                    foreach (OrderDetail item in detailList)
                    {
                        item.OrderId = (long)order.OrderId;
                        item.Save();
                        savedDetail++;
                    }
                }


                if (savedDetail == detailList.Count) result = new ObjectResult(new { success = true, message = "ok", }) { StatusCode = (int)HttpStatusCode.OK };


                else return StatusCode((int)HttpStatusCode.NotModified, new { success = false, resultmsg = "Datensatz nicht gespeicert" });
                return result;
            }
            catch (Exception ex)
            {
#if DEBUG
                return StatusCode((int)HttpStatusCode.NotModified, new { success = false, resultmsg = $"int. Fehler:  {ex.Message}" });
#else
				return StatusCode((int)HttpStatusCode.NotModified, new { success = false, resultmsg = $"int. Fehler:  {ex.Message}" });
#endif
            }


        }



        [HttpPost("updateOrderConsumed/{id}/{consumed}")]
        public IActionResult Update(long id, bool consumed)
        {
            ObjectResult result = null;
            try
            {
                Order order = new Order();
                order.OrderId = id;
                order.Consumed = consumed;
                if (order.SetOrderConsumed() == 1) result = new ObjectResult(new { success = true, message = "ok", order = order }) { StatusCode = (int)HttpStatusCode.OK };
                else result = new ObjectResult(new { success = false, message = "user not saved", order = order }) { StatusCode = (int)HttpStatusCode.NotModified };
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