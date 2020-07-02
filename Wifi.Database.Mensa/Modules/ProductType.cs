using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class ProductType
    {
        //********************************************************
        #region Fields
        private const string COLUMNS = "product_type_id, name, is_menue_type, is_additional";
        private const string TABLE = "wifi_mensa.product_type";
        #endregion

        //********************************************************
        #region Properties
        [JsonPropertyName("producttypeid")]
        public long? ProductTypeId { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("ismenuetype")]
        public bool? IsMenueType { get; set; }
        [JsonPropertyName("isadditional")]
        public bool? IsAdditional { get; set; }

        #endregion

        //********************************************************
        #region static members
        public static List<ProductType> GetList()
        {
            List<ProductType> result = new List<ProductType>();
            try
            {

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = $"select {COLUMNS} from {TABLE}";
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new ProductType()
                    {
                        ProductTypeId = reader.GetInt32(0),
                        Name = (reader.IsDBNull(1) ? string.Empty : reader.GetString(1)),
                        IsMenueType = (reader.IsDBNull(2) ? (bool?)null : reader.GetBoolean(2)),
                        IsAdditional = (reader.IsDBNull(3) ? (bool?)null : reader.GetBoolean(3)),

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

        public static List<ProductType> GetListKitchen(bool additional)
        {
            List<ProductType> result = new List<ProductType>();
            try
            {

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.Parameters.AddWithValue("additional", additional);
                command.CommandText = $"select {COLUMNS} from {TABLE} where is_additional=:additional";
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new ProductType()
                    {
                        ProductTypeId = reader.GetInt32(0),
                        Name = (reader.IsDBNull(1) ? string.Empty : reader.GetString(1)),
                        IsMenueType = (reader.IsDBNull(2) ? (bool?)null : reader.GetBoolean(2)),
                        IsAdditional = (reader.IsDBNull(3) ? (bool?)null : reader.GetBoolean(3)),

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

        public static List<ProductType> GetListMenue()
        {
            List<ProductType> result = new List<ProductType>();
            try
            {

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = $"select {COLUMNS} from {TABLE} where is_menue_type=true";
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new ProductType()
                    {
                        ProductTypeId = reader.GetInt32(0),
                        Name = (reader.IsDBNull(1) ? string.Empty : reader.GetString(1)),
                        IsMenueType = (reader.IsDBNull(2) ? (bool?)null : reader.GetBoolean(2)),
                        IsAdditional = (reader.IsDBNull(3) ? (bool?)null : reader.GetBoolean(3)),

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

        public static ProductType Get(int type)
        {
            ProductType result = null;
            try
            {

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = $"select {COLUMNS} from {TABLE} where type = :type";
                command.Parameters.AddWithValue("type", type);


                NpgsqlDataReader reader = command.ExecuteReader();

                if (reader.Read())
                {
                    result = new ProductType()
                    {

                        ProductTypeId = reader.GetInt32(0),
                        Name = (reader.IsDBNull(1) ? string.Empty : reader.GetString(1)),
                        IsMenueType = (reader.IsDBNull(2) ? (bool?)null : reader.GetBoolean(2)),
                        IsAdditional = (reader.IsDBNull(3) ? (bool?)null : reader.GetBoolean(3)),

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
                string update = $"update {TABLE} set name = @name, is_menue_type = @is_menue_type, is_additional = @is_additional where product_type_id = @product_type_id";

                NpgsqlCommand cmd = null;
                                                               
                if (!this.ProductTypeId.HasValue) // Insert
                {
                    cmd = new NpgsqlCommand($"select nextval('{TABLE}_seq')", DBConnection.Connection);
                    this.ProductTypeId = (long)cmd.ExecuteScalar();
                    //this.PersonUid = Guid.NewGuid().ToString("N");

                     cmd = new NpgsqlCommand(insert, DBConnection.Connection);
                }
                else // Update
                    cmd = new NpgsqlCommand(update, DBConnection.Connection);


                cmd.Parameters.AddWithValue("@product_type_id", this.ProductTypeId);    
                cmd.Parameters.AddWithValue("@name", this.Name ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@is_menue_type", this.IsMenueType ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@is_additional", this.IsAdditional ?? (object)DBNull.Value);

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

        public override string ToString()
        {
            return $"{this.Name} ";
        }

    }
}
