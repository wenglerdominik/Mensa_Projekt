using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class AdditionalProduct
    {
        //********************************************************
        #region Fields
        private const string COLUMNS = "additional_product_id, location_id, product_id, available, expiry_date_start, expiry_date_end";
        private const string TABLE = "wifi_mensa.additional_product";
        #endregion

        //********************************************************
        #region Properties
        [JsonPropertyName("additionalproductid")]
        public long? AdditionalProductId { get; set; }

        [JsonPropertyName("locationid")]
        public long LocationId { get; set; }

        [JsonPropertyName("productid")]
        public long ProductId { get; set; }

        [JsonPropertyName("available")]
        public bool? Available { get; set; }

        [JsonPropertyName("expirydatestart")]
        public DateTime ExpiryDateStart { get; set; }

        [JsonPropertyName("expirydateend")]
        public DateTime ExpiryDateEnd { get; set; }

  

        #endregion

        //********************************************************
        #region static members
        public static List<AdditionalProduct> GetList()
        {
            List<AdditionalProduct> result = new List<AdditionalProduct>();
            try
            {

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = $"select {COLUMNS} from {TABLE}";
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new AdditionalProduct()
                    {
                        AdditionalProductId = reader.GetInt32(0),
                        LocationId = reader.GetInt32(1),
                        ProductId = reader.GetInt32(2),
                        Available = (reader.IsDBNull(3) ? (bool?)null : reader.GetBoolean(3)),
                        ExpiryDateStart = reader.GetDateTime(4),
                        ExpiryDateEnd = reader.GetDateTime(5),

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

        #endregion

        public int Save()
        {
            DBConnection.Connection.Open();
            try
            {
                string insert = $"insert into {TABLE} ({COLUMNS}) values (@{COLUMNS.Replace(", ", ", @")})";
                string update = $"update {TABLE} set expiry_date_start = @expiry_date_start, expiry_date_end = @expiry_date_end, available = @available where additional_product_id = @additional_product_id";

                NpgsqlCommand cmd = null;

                if (!this.AdditionalProductId.HasValue) // Insert
                {
                    cmd = new NpgsqlCommand($"select nextval('{TABLE}_seq')", DBConnection.Connection);
                    this.AdditionalProductId = (long)cmd.ExecuteScalar();

                    cmd = new NpgsqlCommand(insert, DBConnection.Connection);
                }
                else // Update
                    cmd = new NpgsqlCommand(update, DBConnection.Connection);

                cmd.Parameters.AddWithValue("@additional_product_id", this.AdditionalProductId);
                cmd.Parameters.AddWithValue("@location_id", this.LocationId);
                cmd.Parameters.AddWithValue("@product_id", this.ProductId);
                cmd.Parameters.AddWithValue("@available", this.Available ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@expiry_date_start", this.ExpiryDateStart);
                cmd.Parameters.AddWithValue("@expiry_date_end", this.ExpiryDateEnd);

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
