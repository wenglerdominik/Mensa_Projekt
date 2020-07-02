using Microsoft.CodeAnalysis.CSharp.Syntax;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class OrderReportOutput
    {
        #region Properties
        [JsonPropertyName("totalcount")]
        public long TotalCount { get; set; }

        [JsonPropertyName("consumedcount")]
        public long? ConsumedCount { get; set; }

        [JsonPropertyName("menueid")]
        public long? MenueId { get; set; }

        [JsonPropertyName("servedate")]
        public DateTime? ServeDate { get; set; }

        [JsonPropertyName("totalprice")]
        public decimal TotalPrice { get; set; }

        [JsonPropertyName("menuetitel")]
        public string? MenueTitel { get; set; }

        [JsonPropertyName("locationid")]
        public long? LocationId { get; set; }

        [JsonPropertyName("singleprice")]
        public decimal? SinglePrice { get; set; }

        [JsonPropertyName("opencosts")]
        public decimal? OpenCosts { get; set; }

        [JsonPropertyName("type")]
        public string? Type { get; set; }

        #endregion

        public static List<OrderReportOutput> GetListOrderCount(int year, int month, int day, long location_id)
        {
            List<OrderReportOutput> result = new List<OrderReportOutput>();
            string query = "select * from wifi_mensa.outputorderedmenues  where servedate= :serve_date and location_id= :location_id";

            if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();
            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.Connection;
            try
            {
                DateTime date = new DateTime(year, month, day);
                command.Parameters.AddWithValue("serve_date", date);
                command.Parameters.AddWithValue("location_id", location_id);
                command.CommandText = query;
                NpgsqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    
                    OrderReportOutput Order = new OrderReportOutput();

                    // result.Add(new OrderReportOutput()

                    Order.TotalCount = reader.GetInt32(0);
                    Order.ConsumedCount = reader.GetInt32(1);
                    Order.MenueId = reader.GetInt32(2);
                    Order.ServeDate = reader.GetDateTime(3);
                    Order.TotalPrice = reader.GetDecimal(4);
                    Order.MenueTitel = reader.GetString(5);
                    Order.LocationId = reader.GetInt32(6);
                    Order.SinglePrice = Order.TotalPrice / Order.TotalCount;
                    Order.OpenCosts = Order.SinglePrice * (Order.TotalCount - Order.ConsumedCount);

                    result.Add(Order);
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

        public static List<OrderReportOutput> GetListOrderCountMonthSummary(int year, int month,  long location_id)
        {
            List<OrderReportOutput> result = new List<OrderReportOutput>();
            string queryold = "select * from wifi_mensa.outputmonthreport " +
            "where location_id= :location_id and serve_date >= :startDate and serve_date<= :endDate ;";

            string query = "select sum(count) as totalcount, name, sum(sum)as summe, type " +
                "from wifi_mensa.outputmonthreport " +
                "where  serve_date >= :startDate and serve_date<= :endDate and location_id= :location_id " +
                "group by name,type ;";

            string queryCountSummary = "select sum(count) as totalcount, sum(sum)as summe, type " +
                "from wifi_mensa.outputmonthreport " +
                "where serve_date >= :startDate and serve_date<= :endDate and location_id= :location_id " +
                "group by type ;";

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
                command.Parameters.AddWithValue("location_id", location_id);
                command.CommandText = queryCountSummary;
                NpgsqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {

                    OrderReportOutput Order = new OrderReportOutput();

                    // result.Add(new OrderReportOutput()

                    Order.TotalCount = reader.GetInt32(0);
                    Order.TotalPrice = reader.GetDecimal(1);
                    Order.Type = reader.GetString(2);

                    Order.MenueTitel = null;
                    Order.LocationId = null;
                    Order.ServeDate = null;
                    Order.SinglePrice = null;
                    Order.MenueId = null;
                    Order.ConsumedCount = null;
                    Order.OpenCosts = null;

                    result.Add(Order);
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

        public static List<OrderReportOutput> GetListOrderCountMonthDetail(int year, int month, long location_id)
        {
            List<OrderReportOutput> result = new List<OrderReportOutput>();

            string queryMonthDetail = "select * from wifi_mensa.outputmonthreport " +
                "where serve_date >= :startDate and serve_date<= :endDate and location_id= :location_id " +
                "order by location_id,serve_date asc ";

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
                command.Parameters.AddWithValue("location_id", location_id);
                command.CommandText = queryMonthDetail;
                NpgsqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {

                    OrderReportOutput Order = new OrderReportOutput();

                    // result.Add(new OrderReportOutput()

                    Order.TotalCount = reader.GetInt32(0);
                    Order.LocationId = reader.GetInt32(1);
                    Order.MenueTitel = reader.GetString(2);
                    Order.TotalPrice = reader.GetDecimal(3);
                    Order.ServeDate = reader.GetDateTime(4);
                    Order.Type = reader.GetString(5);
                    Order.SinglePrice = Order.TotalPrice/Order.TotalCount;

                    Order.MenueId = null;
                    Order.ConsumedCount = null;
                    Order.OpenCosts = null;

                    result.Add(Order);
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
