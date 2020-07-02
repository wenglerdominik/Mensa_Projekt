using Microsoft.CodeAnalysis.CSharp.Syntax;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class OrderReportUser
    {
        #region Properties
        //[JsonPropertyName("servedate")]
        //public DateTime ServeDate { get; set; }

        //[JsonPropertyName("menuetype")]
        //public string? MenueType { get; set; }

        //[JsonPropertyName("productname")]
        //public string ProductName { get; set; }

        //[JsonPropertyName("productdescription")]
        //public string ProductDescription { get; set; }

        //[JsonPropertyName("productprice")]
        //public decimal ProductPrice { get; set; }

        //[JsonPropertyName("menueid")]
        //public long? MenueId { get; set; }

        //[JsonPropertyName("orderid")]
        //public long OrderId { get; set; }

        //[JsonPropertyName("menuetitel")]
        //public string? MenueTitel { get; set; }

        //[JsonPropertyName("userid")]
        //public long? UserId { get; set; }
        //[JsonPropertyName("consumed")]
        //public bool Consumed { get; set; }

        #endregion

        #region Properties New
        [JsonPropertyName("orderid")]
        public long OrderId { get; set; }

        [JsonPropertyName("menuetitel")]
        public string? MenueTitel { get; set; }

        [JsonPropertyName("additionaltext")]
        public string? AdditionalText { get; set; }

        [JsonPropertyName("menueid")]
        public long? MenueId { get; set; }

        [JsonPropertyName("orderprice")]
        public decimal Orderprice { get; set; }

        [JsonPropertyName("servedate")]
        public DateTime ServeDate { get; set; }

        [JsonPropertyName("userid")]
        public long? UserId { get; set; }
        [JsonPropertyName("consumed")]
        public bool Consumed { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("productname")]
        public string ProductName { get; set; }
        #endregion

        public static List<OrderReportUser> GetList(int year, int month, int userid, bool consumed)
        {
            List<OrderReportUser> result = new List<OrderReportUser>();
            //string query = "select * from wifi_mensa.orderreportuser " +
            //   "where userid= :user_id and serve_date>= :startDate and serve_date<= :endDate and consumed= :consumed";
            string query = "select * from wifi_mensa.userreport " +
              "where user_id= :user_id and serve_date>= :startDate and serve_date<= :endDate and consumed= :consumed";
            if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.Connection;
            try
            {
                int daysInMonth = DateTime.DaysInMonth(year, month);
                DateTime startDate = new DateTime(year, month, 1);
                DateTime endDate = new DateTime(year, month, daysInMonth);
                command.Parameters.AddWithValue("startDate", startDate);
                command.Parameters.AddWithValue("endDate", endDate);
                command.Parameters.AddWithValue("user_id", userid);
                command.Parameters.AddWithValue("consumed", consumed);
                command.CommandText = query;

                NpgsqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    result.Add(new OrderReportUser()
                    {
                        OrderId = reader.GetInt32(0),
                        MenueTitel = (reader.IsDBNull(1)) ? string.Empty : reader.GetString(1),
                        AdditionalText = (reader.IsDBNull(2)) ? string.Empty : reader.GetString(2),
                        MenueId = (reader.IsDBNull(3) ? (long?)null : reader.GetInt32(3)),
                        Orderprice = reader.GetDecimal(4),
                        ServeDate = reader.GetDateTime(5),
                        Consumed = reader.GetBoolean(6),
                        UserId = reader.GetInt32(7),

                        //UserId = reader.GetInt32(0),
                        //ServeDate = reader.GetDateTime(1),
                        //ProductName = reader.GetString(2),
                        //ProductDescription = reader.GetString(3),
                        //ProductPrice = reader.GetDecimal(4),
                        //MenueId = (reader.IsDBNull(5) ? (long?)null : reader.GetInt32(5)),
                        //OrderId = reader.GetInt32(6),
                        //MenueTitel = (reader.IsDBNull(7))? string.Empty: reader.GetString(7),

                    });
                }
                reader.Close();
            }
            catch (Exception ex)
            {

      
            }
            finally
            {
                DBConnection.Connection.Close();
            }

            return result;

        }

       

        public static List<OrderReportUser> GetOrderDetails(long orderid)
        {
            List<OrderReportUser> result = new List<OrderReportUser>();
            string queryDetail = "select name, description, price from wifi_mensa.order_detail " +
            "where order_id=:order_id order by menue_id, order_detail_id asc";
            if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.Connection;
            try
            {
                command.Parameters.AddWithValue("order_id", orderid);
              
                command.CommandText = queryDetail;

                NpgsqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    result.Add(new OrderReportUser()
                    {
                        ProductName = (reader.IsDBNull(0)) ? string.Empty : reader.GetString(0),
                        Description = (reader.IsDBNull(1)) ? string.Empty : reader.GetString(1),
                        Orderprice = reader.GetDecimal(2)
                    });
                }
                reader.Close();
            }
            catch (Exception ex)
            {


            }
            finally
            {
                DBConnection.Connection.Close();
            }

            return result;

        }
    }
}
