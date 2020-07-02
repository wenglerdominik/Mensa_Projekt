using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class AdditionalProductExt : AdditionalProduct
    {

        #region Properties

        [JsonPropertyName("productname")]
        public string ProductName { get; set; }
        [JsonPropertyName("productdescription")]
        public string ProductDescription { get; set; }
        [JsonPropertyName("productcalorie")]
        public int ProductCalorie { get; set; }

        [JsonPropertyName("productimage")]
        public string? ProductImage { get; set; }

        [JsonPropertyName("productprice")]
        public decimal ProductPrice { get; set; }
        [JsonPropertyName("locationname")]
        public string LocationName { get; set; }
        [JsonPropertyName("producttypeid")]
        public int ProductTypeId { get; set; }

        #endregion

        public static List<AdditionalProductExt> GetListExt(int locationid)
        {
            List<AdditionalProductExt> result = new List<AdditionalProductExt>();
            try
            {
                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                if (locationid == 0)
                {
                    string queryAll = "select addP.*," +
                    "p.name,p.description,p.calorie,p.price,p.image,p.product_type_id, " +
                    "l.name " +
                    "from wifi_mensa.additional_product as addP " +
                    "left outer join wifi_mensa.product as p on addP.product_id = p.product_id " +
                    "left outer join wifi_mensa.location as l on addP.location_id = l.location_id";
                    command.CommandText = queryAll;
                }
                else
                {
                    string queryLocation = "select addP.*," +
                    "p.name,p.description,p.calorie,p.price,p.image,p.product_type_id, " +
                    "l.name " +
                    "from wifi_mensa.additional_product as addP " +
                    "left outer join wifi_mensa.product as p on addP.product_id = p.product_id " +
                    "left outer join wifi_mensa.location as l on addP.location_id = l.location_id " +
                    "where l.location_id = :location_id";

                    command.Parameters.AddWithValue("location_id", locationid);
                    command.CommandText = queryLocation;
                }
              
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new AdditionalProductExt()
                    {
                        AdditionalProductId = reader.GetInt32(0),
                        LocationId = reader.GetInt32(1),
                        ProductId = reader.GetInt32(2),
                        Available = (reader.IsDBNull(3) ? (bool?)null : reader.GetBoolean(3)),
                        ExpiryDateStart = reader.GetDateTime(4),
                        ExpiryDateEnd = reader.GetDateTime(5),
                        ProductName = reader.GetString(6),
                        ProductDescription = reader.GetString(7),
                        ProductCalorie = reader.GetInt32(8),
                        ProductPrice = reader.GetDecimal(9),
                        ProductImage = (reader.IsDBNull(10) ?string.Empty: reader.GetString(10)),
                        ProductTypeId = reader.GetInt32(11),
                        LocationName = reader.GetString(12)

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

        public static List<AdditionalProductExt> GetListExtLocation(int id)
        {
            List<AdditionalProductExt> result = new List<AdditionalProductExt>();
            try
            {
               


                string query = "select addP.* , " +
                    "p.name,p.description,p.calorie,p.price,p.image," +
                    "l.name " +
                    "from wifi_mensa.additional_product as addP " +
                    "left outer join wifi_mensa.product as p on addP.product_id = p.product_id " +
                    "left outer join wifi_mensa.location as l on addP.location_id = l.location_id " +
                    "where current_date >= addP.expiry_date_start and current_date <= addP.expiry_date_end "+
                    "and addP.location_id =:location_id"; 

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = query;
                command.Parameters.AddWithValue("location_id", id);
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new AdditionalProductExt()
                    {
                        AdditionalProductId = reader.GetInt32(0),
                        LocationId = reader.GetInt32(1),
                        ProductId = reader.GetInt32(2),
                        Available = (reader.IsDBNull(3) ? (bool?)null : reader.GetBoolean(3)),
                        ExpiryDateStart = reader.GetDateTime(4),
                        ExpiryDateEnd = reader.GetDateTime(5),
                        ProductName = reader.GetString(6),
                        ProductDescription = reader.GetString(7),
                        ProductCalorie = reader.GetInt32(8),
                        ProductPrice = reader.GetDecimal(9),
                        ProductImage = (reader.IsDBNull(10) ? string.Empty : reader.GetString(10)),
                        LocationName = reader.GetString(11)

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
