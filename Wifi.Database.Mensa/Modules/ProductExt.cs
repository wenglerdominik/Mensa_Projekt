using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class ProductExt:Product
    {
        //********************************************************
        #region Fields
        private const string COLUMNS = "product_id, name, description, calorie, image, price, deleted, product_type_id";
        private const string TABLE = "wifi_mensa.product";
        #endregion

        //********************************************************
        #region Properties
      
        [JsonPropertyName("producttypename")]
        public string ProductTypeName { get; set; }


        #endregion

        //********************************************************
        public static List<ProductExt> GetListWithTypeName(bool additional)
        {
            List<ProductExt> result = new List<ProductExt>();
            try
            {
                string query = "select  p.*, pt.name from wifi_mensa.product as p" +
                    " left outer join wifi_mensa.product_type as pt on p.product_type_id = pt.product_type_id where pt.is_additional=:additional";
                    

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = query;
                command.Parameters.AddWithValue("additional", additional);
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new ProductExt()
                    {
                        ProductId = reader.GetInt32(0),
                        Name = (reader.IsDBNull(1) ? string.Empty : reader.GetString(1)),
                        Description = (reader.IsDBNull(2) ? string.Empty : reader.GetString(2)),
                        Calorie = (reader.IsDBNull(3) ? (int?)null : reader.GetInt32(3)),
                        Image = (reader.IsDBNull(4) ? string.Empty : reader.GetString(4)),
                        Price = (reader.IsDBNull(5) ? (decimal?)null : reader.GetDecimal(5)),
                        Deleted = (reader.IsDBNull(6) ? (bool?)null : reader.GetBoolean(6)),
                        ProductTypeId = (reader.IsDBNull(7) ? (int?)null : reader.GetInt32(7)),
                        ProductTypeName = (reader.IsDBNull(8) ? string.Empty : reader.GetString(8)),

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
        //Liefert Produkte mit dem Produktyp Namen
        public static List<ProductExt> GetListWithTypeName(bool additional, int type)
        {
            List<ProductExt> result = new List<ProductExt>();
            try
            {
                string query = "select  p.*, pt.name from wifi_mensa.product as p" +
                    " left outer join wifi_mensa.product_type as pt on p.product_type_id = pt.product_type_id " +
                    " where pt.product_type_id = :producttype and pt.is_additional =:additional";

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                //command.CommandText = $"select {COLUMNS} from {TABLE} order by product_type_id,name asc";
                command.CommandText = query;
                command.Parameters.AddWithValue("producttype", type);
                command.Parameters.AddWithValue("additional", additional);
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new ProductExt()
                    {
                        ProductId = reader.GetInt32(0),
                        Name = (reader.IsDBNull(1) ? string.Empty : reader.GetString(1)),
                        Description = (reader.IsDBNull(2) ? string.Empty : reader.GetString(2)),
                        Calorie = (reader.IsDBNull(3) ? (int?)null : reader.GetInt32(3)),
                        Image = (reader.IsDBNull(4) ? string.Empty : reader.GetString(4)),
                        Price = (reader.IsDBNull(5) ? (decimal?)null : reader.GetDecimal(5)),
                        Deleted = (reader.IsDBNull(6) ? (bool?)null : reader.GetBoolean(6)),
                        ProductTypeId = (reader.IsDBNull(7) ? (int?)null : reader.GetInt32(7)),
                        ProductTypeName = (reader.IsDBNull(8) ? string.Empty : reader.GetString(8)),
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

        //Liste mit Namen des Typs und gefiltert nach Usersuche

        public static List<ProductExt> GetFilterdListWithTypeName(bool additional,string filter)
        {
            List<ProductExt> result = new List<ProductExt>();
            try
            {   
                string query = "select  p.*, pt.name from wifi_mensa.product as p " +
                      "left outer join wifi_mensa.product_type as pt on p.product_type_id = pt.product_type_id " +
                      "where (lower(p.name) like :filter  or upper(p.name) like :filter or " +
                       "lower(p.description) like :filter  or upper(p.description) like :filter) and pt.is_additional=:additional";


                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                //command.CommandText = $"select {COLUMNS} from {TABLE} order by product_type_id,name asc";
                command.CommandText = query;
                command.Parameters.AddWithValue("filter", "%"+filter+"%");
                command.Parameters.AddWithValue("additional", additional);
                
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new ProductExt()
                    {
                        ProductId = reader.GetInt32(0),
                        Name = (reader.IsDBNull(1) ? string.Empty : reader.GetString(1)),
                        Description = (reader.IsDBNull(2) ? string.Empty : reader.GetString(2)),
                        Calorie = (reader.IsDBNull(3) ? (int?)null : reader.GetInt32(3)),
                        Image = (reader.IsDBNull(4) ? string.Empty : reader.GetString(4)),
                        Price = (reader.IsDBNull(5) ? (decimal?)null : reader.GetDecimal(5)),
                        Deleted = (reader.IsDBNull(6) ? (bool?)null : reader.GetBoolean(6)),
                        ProductTypeId = (reader.IsDBNull(7) ? (int?)null : reader.GetInt32(7)),
                        ProductTypeName = (reader.IsDBNull(8) ? string.Empty : reader.GetString(8)),
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

