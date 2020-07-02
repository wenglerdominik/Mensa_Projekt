using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class Order
    {
        #region Fields
        private const string COLUMNS = "order_id, user_id, location_id, order_date, consumed, total_cost, barcode, canceled, serve_date, menue_id";
        private const string TABLE = "wifi_mensa.order";
        #endregion

        #region Properties
        [JsonPropertyName("orderid")]
        public long? OrderId { get; set; }

        [JsonPropertyName("userid")]
        public long UserId { get; set; }

        [JsonPropertyName("locationid")]
        public int LocationId { get; set; }

        [JsonPropertyName("orderdate")]
        public DateTime OrderDate { get; set; }

        [JsonPropertyName("consumed")]
        public bool Consumed { get; set; }

        [JsonPropertyName("totalcost")]
        public decimal TotalCost { get; set; }

        [JsonPropertyName("barcode")]
        public string? Barcode { get; set; }

        [JsonPropertyName("canceled")]
        public bool Canceled { get; set; }

        [JsonPropertyName("menueid")]
        public long? MenueId { get; set; }

        [JsonPropertyName("servedate")]
        public DateTime ServeDate { get; set; }

        #endregion


        public static List<Order> GetList(int year, int month, int day, int userid)
        {
            List<Order> result = new List<Order>();
            try
            {
                string queryMonth = "select distinct od.menue_id, o.consumed " +
                    "from wifi_mensa.order as o " +
                    "left join wifi_mensa.order_detail as od on o.order_id = od.order_id " +
                    "left outer join wifi_mensa.menue as m on od.menue_id = m.menue_id " +
                    "where m.serve_date >= :startDate and m.serve_date <= :endDate and o.user_id = :user_id and canceled=false";
                string queryDay = "select distinct od.menue_id, o.consumed " +
                    "from wifi_mensa.order as o " +
                    "left join wifi_mensa.order_detail as od on o.order_id = od.order_id " +
                    "left outer join wifi_mensa.menue as m on od.menue_id = m.menue_id " +
                    "where m.serve_date = :date and o.user_id = :user_id and canceled=false";

                if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;

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
                    command.Parameters.AddWithValue("date", date);
                    command.CommandText = queryDay;
                }
                command.Parameters.AddWithValue("user_id", userid);

                NpgsqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    result.Add(new Order()
                    {
                        MenueId = reader.GetInt32(0),
                        Consumed = reader.GetBoolean(1)
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

        //Hole User mit der MenüID für Notification
        public static List<long> GetUserForNotification(long menueid)
        {
            List<long> result = new List<long>();
            try
            {
            
                string query = "select user_id from wifi_mensa.order " +
                    "where consumed=false and canceled=false and menue_id= :menueid";

                if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;

                
                    command.Parameters.AddWithValue("menueid", menueid);
                    command.CommandText = query;
                
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(reader.GetInt64(0));
                }
               
                reader.Close();
               
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return result;
           
        }




        public int Save()
        {
            DBConnection.Connection.Open();
            try
            {
                string insert = $"insert into {TABLE} ({COLUMNS}) values (@{COLUMNS.Replace(", ", ", @")})";
                string update = $"update {TABLE} set canceled = @canceled, consumed = @consumed where order_id = @order_id";

                NpgsqlCommand cmd = null;

                if (!this.OrderId.HasValue) // Insert
                {
                    cmd = new NpgsqlCommand($"select nextval('{TABLE}_seq')", DBConnection.Connection);
                    this.OrderId = (long)cmd.ExecuteScalar();


                    cmd = new NpgsqlCommand(insert, DBConnection.Connection);
                }
                else // Update
                    cmd = new NpgsqlCommand(update, DBConnection.Connection);


                cmd.Parameters.AddWithValue("@order_id", this.OrderId);
                cmd.Parameters.AddWithValue("@user_id", this.UserId);
                cmd.Parameters.AddWithValue("@location_id", this.LocationId);
                cmd.Parameters.AddWithValue("@order_date", this.OrderDate);
                cmd.Parameters.AddWithValue("@consumed", this.Consumed);
                cmd.Parameters.AddWithValue("@total_cost", this.TotalCost);
                cmd.Parameters.AddWithValue("@barcode", this.Barcode ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@canceled", this.Canceled);
                cmd.Parameters.AddWithValue("@serve_date", this.ServeDate);
                cmd.Parameters.AddWithValue("@menue_id", this.MenueId ?? (object)DBNull.Value);
                cmd.Prepare();
                int result = cmd.ExecuteNonQuery();


                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                DBConnection.Connection.Close();
            }
        }
        public int SetOrderConsumed()
        {
            DBConnection.Connection.Open();
            try
            {
                string update = $"update {TABLE} set consumed = :consumed where order_id = :order_id";

                NpgsqlCommand cmd = null;


                cmd = new NpgsqlCommand(update, DBConnection.Connection);


                cmd.Parameters.AddWithValue(":order_id", this.OrderId);
                cmd.Parameters.AddWithValue(":consumed", this.Consumed);
                cmd.Prepare();
                int result = cmd.ExecuteNonQuery();

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                DBConnection.Connection.Close();
            }
        }

        public static bool SetOrderCanceled(long? menueid)
        {
            if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();
            try
            {
                string update = $"update {TABLE} set canceled = true where menue_id = :menue_id";

                NpgsqlCommand cmd = null;
                cmd = new NpgsqlCommand(update, DBConnection.Connection);
                cmd.Parameters.AddWithValue(":menue_id", menueid);
                cmd.Prepare();
                int result = cmd.ExecuteNonQuery();

                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
           
        }
    }
}
