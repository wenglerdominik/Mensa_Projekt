using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class Product
    {
        //********************************************************
        #region Fields
        private const string COLUMNS = "product_id, name, description, calorie, image, price, deleted, product_type_id";
        private const string TABLE = "wifi_mensa.product";
        #endregion

        //********************************************************
        #region Properties
        [JsonPropertyName("productid")]
        public long? ProductId { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("description")]
        public string Description { get; set; }
        [JsonPropertyName("calorie")]
        public int? Calorie { get; set; }

        [JsonPropertyName("image")]
        public string Image { get; set; }

        [JsonPropertyName("price")]
        
        public decimal? Price { get; set; }

        [JsonPropertyName("deleted")]
        public bool? Deleted { get; set; }

        [JsonPropertyName("producttypeid")]
        public int? ProductTypeId { get; set; }


        #endregion

        //********************************************************
        #region static members
        public static List<Product> GetList()
        {
            List<Product> result = new List<Product>();
            try
            {

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = $"select {COLUMNS} from {TABLE} order by product_type_id,name asc";
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new Product()
                    {
                        ProductId = reader.GetInt32(0),
                        Name = (reader.IsDBNull(1) ? string.Empty : reader.GetString(1)),
                        Description = (reader.IsDBNull(2) ? string.Empty : reader.GetString(2)),
                        Calorie = (reader.IsDBNull(3) ? (int?)null : reader.GetInt32(3)),
                        Image = (reader.IsDBNull(4) ? string.Empty : reader.GetString(4)),
                        Price = (reader.IsDBNull(5) ? (decimal?)null : reader.GetDecimal(5)),
                        Deleted = (reader.IsDBNull(6) ? (bool?)null : reader.GetBoolean(6)),
                        ProductTypeId = (reader.IsDBNull(7) ? (int?)null : reader.GetInt32(7))

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


        //Liefert Produkte in Abhängigkeit vom Menütyp
        public static List<Product> GetListForNewMenue(int type)
        {
            List<Product> result = new List<Product>();
            try
            {
                string query1 = "select  p.* from wifi_mensa.product as p" +
                      " left outer join wifi_mensa.product_type as pt on p.product_type_id = pt.product_type_id " +
                      " where pt.is_additional=false order by p.name asc";
                string query = "select  p.* from wifi_mensa.product as p" +
                    " left outer join wifi_mensa.product_type as pt on p.product_type_id = pt.product_type_id "+
                    " where pt.product_type_id = :producttype or pt.is_menue_type = false  and pt.is_additional=false";

                if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                //command.CommandText = $"select {COLUMNS} from {TABLE} order by product_type_id,name asc";
                command.CommandText = query1;
                command.Parameters.AddWithValue("producttype", type);
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new Product()
                    {
                        ProductId = reader.GetInt32(0),
                        Name = (reader.IsDBNull(1) ? string.Empty : reader.GetString(1)),
                        Description = (reader.IsDBNull(2) ? string.Empty : reader.GetString(2)),
                        Calorie = (reader.IsDBNull(3) ? (int?)null : reader.GetInt32(3)),
                        Image = (reader.IsDBNull(4) ? string.Empty : reader.GetString(4)),
                        Price = (reader.IsDBNull(5) ? (decimal?)null : reader.GetDecimal(5)),
                        Deleted = (reader.IsDBNull(6) ? (bool?)null : reader.GetBoolean(6)),
                        ProductTypeId = (reader.IsDBNull(7) ? (int?)null : reader.GetInt32(7))

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

        public static List<Product> GetListForMenueDetail(int id)
        {
            List<Product> result = new List<Product>();
            try
            {
                string query = "select p.*from wifi_mensa.product as p " +
                    "left outer join wifi_mensa.menue_detail as md on p.product_id = md.product_id " +
                    "where md.menue_id = :menueid order by menue_detail_id asc";

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                //command.CommandText = $"select {COLUMNS} from {TABLE} order by product_type_id,name asc";
                command.CommandText = query;
                command.Parameters.AddWithValue("menueid", id);
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new Product()
                    {
                        ProductId = reader.GetInt32(0),
                        Name = (reader.IsDBNull(1) ? string.Empty : reader.GetString(1)),
                        Description = (reader.IsDBNull(2) ? string.Empty : reader.GetString(2)),
                        Calorie = (reader.IsDBNull(3) ? (int?)null : reader.GetInt32(3)),
                        Image = (reader.IsDBNull(4) ? string.Empty : reader.GetString(4)),
                        Price = (reader.IsDBNull(5) ? (decimal?)null : reader.GetDecimal(5)),
                        Deleted = (reader.IsDBNull(6) ? (bool?)null : reader.GetBoolean(6)),
                        ProductTypeId = (reader.IsDBNull(7) ? (int?)null : reader.GetInt32(7))

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

        #region USED?
        /*
        public static Product Get(int type)
        {
            Product result = null;
            try
            {

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = $"select {COLUMNS} from {TABLE} where producttypeid = :producttypeid";
                command.Parameters.AddWithValue("producttypeid", type);


                NpgsqlDataReader reader = command.ExecuteReader();

                if (reader.Read())
                {
                    result = new Product()
                    {

                        ProductId = reader.GetInt32(0),
                        Name = (reader.IsDBNull(1) ? string.Empty : reader.GetString(1)),
                        Description = (reader.IsDBNull(2) ? string.Empty : reader.GetString(2)),
                        Calorie = (reader.IsDBNull(3) ? (int?)null : reader.GetInt32(3)),
                        Image = (reader.IsDBNull(4) ? string.Empty : reader.GetString(4)),
                        Price = (reader.IsDBNull(5) ? (decimal?)null : reader.GetDecimal(5)),
                        Deleted = (reader.IsDBNull(6) ? (bool?)null : reader.GetBoolean(6)),
                        ProductTypeId = (reader.IsDBNull(7) ? (int?)null : reader.GetInt32(7))

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
        */
        #endregion

        #endregion

        //********************************************************

        public int Save()
        {
            DBConnection.Connection.Open();
            try
            {
                string insert = $"insert into {TABLE} ({COLUMNS}) values (@{COLUMNS.Replace(", ", ", @")})";
                string update = $"update {TABLE} set name = @name, description = @description, calorie = @calorie, image = @image, price = @price, deleted = @deleted, product_type_id = @product_type_id where product_id = @product_id";

                NpgsqlCommand cmd = null;

                if (!this.ProductId.HasValue) // Insert
                {
                    cmd = new NpgsqlCommand($"select nextval('{TABLE}_seq')", DBConnection.Connection);
                    this.ProductId = (long)cmd.ExecuteScalar();

                    cmd = new NpgsqlCommand(insert, DBConnection.Connection);
                }
                else // Update
                    cmd = new NpgsqlCommand(update, DBConnection.Connection);


                cmd.Parameters.AddWithValue("@product_id", this.ProductId);
                cmd.Parameters.AddWithValue("@name", this.Name ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@description", this.Description ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@calorie", this.Calorie ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@image", this.Image ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@price", this.Price ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@deleted", this.Deleted ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@product_type_id", this.ProductTypeId ?? (object)DBNull.Value);


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
