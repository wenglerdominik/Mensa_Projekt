using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class Notification
    {

        //********************************************************
        #region Fields
        private const string COLUMNS = "notification_id, text, isread, message_date, user_id";
        private const string TABLE = "wifi_mensa.notification";
        #endregion

        //********************************************************
        #region Properties
        [JsonPropertyName("notificationid")]
        public long? NotificationId { get; set; }

        [JsonPropertyName("text")]
        public string Text { get; set; }

        [JsonPropertyName("isread")]
        public bool IsRead { get; set; }

        [JsonPropertyName("messagedate")]
        public DateTime MessageDate { get; set; }

        [JsonPropertyName("userid")]
        public long UserId { get; set; }

        #endregion

        //********************************************************

        public static List<Notification> GetList(long userid)
        {
            List<Notification> result = new List<Notification>();
            try
            {

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = $"select {COLUMNS} from {TABLE} where user_id = :userid and isread=false";
                command.Parameters.AddWithValue("userid", userid);
                NpgsqlDataReader reader = command.ExecuteReader();

               
                while (reader.Read())
                {
                    result.Add(new Notification()
                    {
                        NotificationId = reader.GetInt32(0),
                        Text = reader.GetString(1),
                        IsRead = reader.GetBoolean(2),
                        MessageDate = reader.GetDateTime(3),
                        UserId = reader.GetInt32(4)
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
        
        public int Save()
        {
            if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();

            try
            {
                string insert = $"insert into {TABLE} ({COLUMNS}) values (@{COLUMNS.Replace(", ", ", @")})";
                string update = $"update {TABLE} set isread = :isread where notification_id = :notificationid";

                NpgsqlCommand cmd = null;

                if (!this.NotificationId.HasValue) // Insert
                {
                    cmd = new NpgsqlCommand($"select nextval('{TABLE}_seq')", DBConnection.Connection);
                    this.NotificationId = (long)cmd.ExecuteScalar();
                    this.MessageDate = DateTime.Now;
                    this.IsRead = false;
                    cmd = new NpgsqlCommand(insert, DBConnection.Connection);

                    cmd.Parameters.AddWithValue("@notification_id", this.NotificationId);
                    cmd.Parameters.AddWithValue("@text", this.Text);
                    cmd.Parameters.AddWithValue("@isread", this.IsRead);
                    cmd.Parameters.AddWithValue("@message_date", this.MessageDate);
                    cmd.Parameters.AddWithValue("@user_id", this.UserId);
                    
                }
                else // Update
                {
         
                    cmd = new NpgsqlCommand(update, DBConnection.Connection);
                    cmd.Parameters.AddWithValue("isread", this.IsRead);
                    cmd.Parameters.AddWithValue("notificationid", this.NotificationId);
                }
               
              

                cmd.Prepare();
                int result = cmd.ExecuteNonQuery();


                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
           
        }


    }
}
