using Microsoft.CodeAnalysis.CSharp.Syntax;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class OrderReportKitchen
    {
        [JsonPropertyName("count")]
        public int Count { get; set; }

        [JsonPropertyName("menueid")]
        public long MenueId { get; set; }

        [JsonPropertyName("location")]
        public string Location { get; set; }

        [JsonPropertyName("servedate")]
        public DateTime ServeDate { get; set; }

        [JsonPropertyName("orderprice")]
        public decimal Orderprice { get; set; }

        [JsonPropertyName("singleprice")]
        public decimal Singleprice { get; set; }

        [JsonPropertyName("titel")]
        public string Titel { get; set; }


        public static List<OrderReportKitchen> GetListOrderForKitchen(int year, int month, int day)
        {
            List<OrderReportKitchen> result = new List<OrderReportKitchen>();

            string queryDay = "select menue_id, count(menue_id) " +
             "from wifi_mensa.order where serve_date = :serve_date and canceled = false and menue_id is not null " +
             "group by menue_id";

            string queryMonth = "select menue_id, count(menue_id) " +
            "from wifi_mensa.order where serve_date >= :startDate and serve_date <= :endDate and " +
            "canceled = false and menue_id is not null " +
            "group by menue_id";

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
                    command.CommandText = queryDay;
                }

                NpgsqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    result.Add(new OrderReportKitchen()
                    {
                        MenueId = reader.GetInt32(0),
                        Count = reader.GetInt16(1)
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

        public static List<OrderReportKitchen> GetListOrderCountLocation(int year, int month, int day)
        {
            List<OrderReportKitchen> result = new List<OrderReportKitchen>();

            string query = "select * from wifi_mensa.ordercountlocation  where servedate= :serve_date";

            if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = DBConnection.Connection;
            try
            {

                DateTime date = new DateTime(year, month, day);
                command.Parameters.AddWithValue("serve_date", date);
                command.CommandText = query;



                NpgsqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    result.Add(new OrderReportKitchen()
                    {
                        Count = reader.GetInt16(0),
                        Location = reader.GetString(1),
                        MenueId = reader.GetInt32(2),
                        ServeDate = reader.GetDateTime(3),

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


        public static List<OrderReportKitchen> GetMonthBilling(int year, int month, int day)
        {
            List<OrderReportKitchen> result = new List<OrderReportKitchen>();

            string queryMonth = "select * from wifi_mensa.monthbilling2 " +
                "where servedate>= :startDate and servedate<= :endDate";
            string queryDay = "select * from wifi_mensa.monthbilling2 " +
              "where servedate= :serve_date";

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
                    command.CommandText = queryDay;
                }

                NpgsqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    OrderReportKitchen orderReport = new OrderReportKitchen();
                    orderReport.Count = reader.GetInt16(0);
                    orderReport.Location = null;
                    orderReport.MenueId = reader.GetInt32(1);
                    orderReport.ServeDate = reader.GetDateTime(2);
                    orderReport.Orderprice = reader.GetDecimal(3);
                    orderReport.Titel = reader.GetString(4);
                    orderReport.Singleprice = orderReport.Orderprice / orderReport.Count;
                    result.Add(orderReport);
                    //result.Add(new OrderReportKitchen()
                    //{
                    //    Count = reader.GetInt16(0),
                    //    Location = null,
                    //    MenueId = reader.GetInt32(1),
                    //    ServeDate = reader.GetDateTime(2),
                    //    Orderprice = reader.GetDecimal(3),
                    //    Titel = reader.GetString(4),

                    //});
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
