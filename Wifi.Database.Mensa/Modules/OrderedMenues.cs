using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class OrderedMenues
    {
        #region Properties
        [JsonPropertyName("orderid")]
        public long OrderId { get; set; }

        [JsonPropertyName("userid")]
        public long UserId { get; set; }

        [JsonPropertyName("firstname")]
        public string FirstName { get; set; }

        [JsonPropertyName("lastname")]
        public string LastName { get; set; }

        [JsonPropertyName("usernumber")]
        public long UserNumber { get; set; }

        [JsonPropertyName("menuetitel")]
        public string MenueTitel { get; set; }
        [JsonPropertyName("locationid")]
        public long LocationId { get; set; }
        [JsonPropertyName("locationname")]
        public string LocationName { get; set; }
        [JsonPropertyName("servedate")]
        public DateTime ServeDate { get; set; }
        [JsonPropertyName("consumed")]
        public bool Consumed { get; set; }

        [JsonPropertyName("addproductname")]
        public string AddProductName { get; set; }

        [JsonPropertyName("listadditional")]
        public List<OrderedMenues> ListAdditional { get; set; }
        #endregion



        public static List<OrderedMenues> GetOrderedMenues(int year, int month, int day, long location, bool consumed)
        {
            List<OrderedMenues> result = new List<OrderedMenues>();

            string queryMonth = "select * from wifi_mensa.orderedmenues " +
                "where serve_date>= :startDate and servedate<= :endDate";
            string queryDay = "select * from wifi_mensa.orderedmenues " +
              "where serve_date= :serve_date and location_id= :location_id and consumed= :consumed";

            if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.Connection;
            try
            {
                if (day == 0)
                {
                    int daysInMonth = DateTime.DaysInMonth(year, month);
                    DateTime startDate = new DateTime(year, month, 1);
                    DateTime endDate = new DateTime(year, month, daysInMonth);
                    command.Parameters.AddWithValue("startDate", startDate);
                    command.Parameters.AddWithValue("endDate", endDate);
                    command.CommandText = queryMonth;
                }
                else
                {
                    DateTime date = new DateTime(year, month, day);
                    command.Parameters.AddWithValue("serve_date", date);
                    command.Parameters.AddWithValue("location_id", location);
                    command.Parameters.AddWithValue("consumed", consumed);

                    command.CommandText = queryDay;
                }

                NpgsqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    result.Add(new OrderedMenues()
                    {
                        OrderId = reader.GetInt32(0),
                        UserId = reader.GetInt32(1),
                        FirstName = reader.GetString(2),
                        LastName = reader.GetString(3),
                        UserNumber = reader.GetInt16(4),
                        MenueTitel = reader.GetString(5),
                        LocationId= reader.GetInt32(6),
                        LocationName= reader.GetString(7),
                        ServeDate= reader.GetDateTime(8),
                        Consumed= reader.GetBoolean(9),

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

            //return result;
            foreach (OrderedMenues item in result)
            {
                item.ListAdditional = GetOrderedAddProducts(year, month, day, location, consumed, item.OrderId);
            }
            return result;

        }

        public static List<OrderedMenues> GetOrderedAddProducts(int year, int month, int day, long location, bool consumed, long orderId)
        {
            List<OrderedMenues> result = new List<OrderedMenues>();

            string queryMonth = "select * from wifi_mensa.orderedaddproducts " +
                "where serve_date>= :startDate and servedate<= :endDate";
            string queryDay = "select * from wifi_mensa.orderedaddproducts " +
              "where serve_date= :serve_date and order_id= :order_id and consumed= :consumed";

            if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.Connection;
            try
            {
                if (day == 0)
                {
                    int daysInMonth = DateTime.DaysInMonth(year, month);
                    DateTime startDate = new DateTime(year, month, 1);
                    DateTime endDate = new DateTime(year, month, daysInMonth);
                    command.Parameters.AddWithValue("startDate", startDate);
                    command.Parameters.AddWithValue("endDate", endDate);
                    command.Parameters.AddWithValue("consumed", consumed);
                    command.Parameters.AddWithValue("order_id", orderId);
                    command.CommandText = queryMonth;
                }
                else
                {
                    DateTime date = new DateTime(year, month, day);
                    command.Parameters.AddWithValue("serve_date", date);
                    command.Parameters.AddWithValue("consumed", consumed);
                    command.Parameters.AddWithValue("order_id", orderId);
                    command.CommandText = queryDay;
                }

                NpgsqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    result.Add(new OrderedMenues()
                    {
                        OrderId = reader.GetInt32(0),
                        UserId = reader.GetInt32(1),
                        FirstName = reader.GetString(2),
                        LastName = reader.GetString(3),
                        UserNumber = reader.GetInt16(4),
                        LocationId = reader.GetInt32(5),
                        LocationName = reader.GetString(6),
                        AddProductName = reader.GetString(7),
                        ServeDate = reader.GetDateTime(8),
                        Consumed = reader.GetBoolean(9),

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
