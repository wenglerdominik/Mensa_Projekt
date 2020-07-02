using Microsoft.CodeAnalysis.CSharp.Syntax;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class Menue
    {

        //********************************************************
        #region Fields
        private const string COLUMNS = "menue_id, serve_date, type, titel";
        private const string TABLE = "wifi_mensa.menue";
        #endregion

        //********************************************************
        #region Properties
        [JsonPropertyName("menueid")]
        public long? MenueId { get; set; }

        [JsonPropertyName("servedate")]
        public DateTime? ServeDate { get; set; }

        [JsonPropertyName("type")]
        public int? Type { get; set; }
        [JsonPropertyName("titel")]
        public string? Titel { get; set; }

        [JsonPropertyName("titelold")]
        public string? TitelOld { get; set; }
        #endregion

        //********************************************************
        #region static members
        public static List<Menue> GetList()
        {
            List<Menue> result = new List<Menue>();
            try
            {

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = $"select {COLUMNS} from {TABLE}";
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new Menue()
                    {
                        MenueId = reader.GetInt32(0),
                        ServeDate = (reader.IsDBNull(1) ? (DateTime?)null : reader.GetDateTime(1)),
                        Type = (reader.IsDBNull(2) ? (int?)null : reader.GetInt16(2)),
                        Titel = (reader.IsDBNull(2) ? string.Empty : reader.GetString(3)),
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

        public static List<Menue> GetList(int year, int month, int day)
        {
            List<Menue> result = new List<Menue>();
            try
            {
                if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                if (day == 0)
                {
                    int daysInMonth = DateTime.DaysInMonth(year, month);
                    DateTime startDate = new DateTime(year, month, 1);
                    DateTime endDate = new DateTime(year, month, daysInMonth);

                    command.CommandText = $"select {COLUMNS} from {TABLE} where serve_date >= :startDate and serve_date <= :endDate";
                    command.Parameters.AddWithValue("startDate", startDate);
                    command.Parameters.AddWithValue("endDate", endDate);
                }
                else
                {
                    DateTime date = new DateTime(year, month, day);
                    command.CommandText = $"select {COLUMNS} from {TABLE} where serve_date = :date";
                    command.Parameters.AddWithValue("date", date);


                }

                NpgsqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    result.Add(new Menue()
                    {

                        MenueId = reader.GetInt32(0),
                        ServeDate = (reader.IsDBNull(1) ? (DateTime?)null : reader.GetDateTime(1)),
                        Type = (reader.IsDBNull(2) ? (int?)null : reader.GetInt16(2)),
                        Titel = (reader.IsDBNull(3)) ? string.Empty : reader.GetString(3)
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

        public static Menue Get(int id)
        {
            Menue result = null;
            try
            {

                if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();


                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = $"select {COLUMNS} from {TABLE} where menue_id = :menue_id";
                command.Parameters.AddWithValue("menue_id", id);


                NpgsqlDataReader reader = command.ExecuteReader();

                if (reader.Read())
                {
                    result = new Menue()
                    {

                        MenueId = reader.GetInt32(0),
                        ServeDate = (reader.IsDBNull(1) ? (DateTime?)null : reader.GetDateTime(1)),
                        Type = (reader.IsDBNull(2) ? (int?)null : reader.GetInt16(2)),
                        Titel = (reader.IsDBNull(3)) ? string.Empty : reader.GetString(3),
                    };
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


        #endregion

        //********************************************************

        public int Save()
        {
            DBConnection.Connection.Open();
            try
            {

                string insert = $"insert into {TABLE} ({COLUMNS}) values (@{COLUMNS.Replace(", ", ", @")})";
                string update = $"update {TABLE} set serve_date = @serve_date, type= @type, titel = @titel where menue_id = @menue_id";

                NpgsqlCommand cmd = null;

                if (!this.MenueId.HasValue) // Insert
                {
                    cmd = new NpgsqlCommand($"select nextval('{TABLE}_seq')", DBConnection.Connection);
                    this.MenueId = (long)cmd.ExecuteScalar();
                    //this.PersonUid = Guid.NewGuid().ToString("N");

                    cmd = new NpgsqlCommand(insert, DBConnection.Connection);
                }
                else // Update
                {
                    //Set orders with this menueid to canceled when a menue is changed

                   

                    List<long> usersForNotification = null;
                    usersForNotification = Order.GetUserForNotification((long)this.MenueId);
                    foreach (long user in usersForNotification)
                    {
                        Notification notification = new Notification();
                        DateTime date;
                        DateTime.TryParse(this.ServeDate.ToString(), out date);
                        notification.UserId = user;
                        notification.Text = $"Ihre Bestellung {this.TitelOld} für {date.ToShortDateString()} wurde storniert, weil das Menü von der Küche geändert wurde";
                        notification.Save();
                    }


                    if(usersForNotification.Count>0) Order.SetOrderCanceled(this.MenueId);
                    MenueDetail.DeleteForMenueUpdate((long)this.MenueId);
                    cmd = new NpgsqlCommand(update, DBConnection.Connection);
                }



                cmd.Parameters.AddWithValue("@menue_id", this.MenueId);
                cmd.Parameters.AddWithValue("@serve_date", this.ServeDate ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@type", this.Type ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@titel", this.Titel ?? (object)DBNull.Value);

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

        public int Delete()
        {
            DBConnection.Connection.Open();
            try
            {
                //Set orders with this menueid to canceled when a menue is deleted
               

                List<long> usersForNotification = null;
                usersForNotification = Order.GetUserForNotification((long)this.MenueId);
                foreach (long user in usersForNotification)
                {
                    Notification notification = new Notification();
                    notification.UserId = user;
                    DateTime date;
                    DateTime.TryParse(this.ServeDate.ToString(), out date);
                    notification.Text = $"Ihre Bestellung {this.Titel} für {date.ToShortDateString()} wurde storniert, weil das Menü von der Küche gelöscht wurde";
                    notification.Save();
                }
                if (usersForNotification.Count > 0) Order.SetOrderCanceled(this.MenueId);
               
                string delete = $"delete from {TABLE} where menue_id = @menue_id";

                NpgsqlCommand cmd = null;
                cmd = new NpgsqlCommand(delete, DBConnection.Connection);

                cmd.Parameters.AddWithValue("@menue_id", this.MenueId);

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


        //public override string ToString()
        //{
        //    return $"{this.Name} ";
        //}
    }
}
