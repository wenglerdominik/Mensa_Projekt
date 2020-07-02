using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Wifi.Database.Mensa.Modules;

namespace Wifi.Database.Mensa.Modules
{
    public class OrderDetail
    {
        #region Fields
        private const string COLUMNS = "order_detail_id, order_id, name, description, calorie, image, price, menue_id";
        private const string TABLE = "wifi_mensa.order_detail";
        #endregion

        #region Properties
        [JsonPropertyName("orderdetailid")]
        public long? OrderDetailId { get; set; }

        [JsonPropertyName("orderid")]
        public long? OrderId { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("calorie")]
        public int Calorie { get; set; }

        [JsonPropertyName("image")]
        public string? Image { get; set; }

        [JsonPropertyName("price")]
        public decimal Price { get; set; }

        [JsonPropertyName("menueid")]
        public long? MenueId { get; set; }

        #endregion



        public int Save()
        {
            DBConnection.Connection.Open();
            try
            {
                string insert = $"insert into {TABLE} ({COLUMNS}) values (@{COLUMNS.Replace(", ", ", @")})";
                string update = $"update {TABLE} set canceled = @canceled, where order_id = @order_id";

                NpgsqlCommand cmd = null;

                if (!this.OrderDetailId.HasValue) // Insert
                {
                    cmd = new NpgsqlCommand($"select nextval('{TABLE}_seq')", DBConnection.Connection);
                    this.OrderDetailId = (long)cmd.ExecuteScalar();


                    cmd = new NpgsqlCommand(insert, DBConnection.Connection);
                }
                else // Update
                    cmd = new NpgsqlCommand(update, DBConnection.Connection);


                cmd.Parameters.AddWithValue("@order_detail_id", this.OrderDetailId);
                cmd.Parameters.AddWithValue("@order_id", this.OrderId);
                cmd.Parameters.AddWithValue("@name", this.Name);
                cmd.Parameters.AddWithValue("@description", this.Description);
                cmd.Parameters.AddWithValue("@calorie", this.Calorie);
                cmd.Parameters.AddWithValue("@image", this.Image ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@price", this.Price);
                cmd.Parameters.AddWithValue("@menue_id", this.MenueId?? (object)DBNull.Value);

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
    }
}


