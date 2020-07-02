using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class MenueExt : Menue
    {

        //********************************************************
        #region Properties

        //[JsonPropertyName("productname")]
        //public string ProductName { get; set; }

        //[JsonPropertyName("productdescription")]
        //public string ProductDesc { get; set; }

        //[JsonPropertyName("productcalorie")]
        //public int ProductCalorie { get; set; }

        //[JsonPropertyName("productimage")]
        //public string? ProductImage { get; set; }

        //[JsonPropertyName("productprice")]
        //public decimal ProductPrice { get; set; }

        [JsonPropertyName("menuetypename")]
        public string MenueTypeName { get; set; }
        [JsonPropertyName ("detaillist")]
        public List<ProductExt> DetailList { get; set; }
        #endregion



        #region static Members

        public static List<MenueExt> GetListDay(int year, int month, int day)
        {


            List<MenueExt> result = new List<MenueExt>();
            try
            {
                string query = "select m.*,pt.name " +
                    "from wifi_mensa.menue as m " +
                    "left outer join wifi_mensa.product_type as pt on m.type = pt.product_type_id where serve_date = :date " +
                    "order by m.menue_id asc";

                if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;

                DateTime date = new DateTime(year, month, day);
                command.CommandText = query;
                command.Parameters.AddWithValue("date", date);



                NpgsqlDataReader reader = command.ExecuteReader();
                while (reader.Read())
                {
                    result.Add(new MenueExt()
                    {

                        MenueId = reader.GetInt32(0),
                        ServeDate = (reader.IsDBNull(1) ? (DateTime?)null : reader.GetDateTime(1)),
                        Type =reader.GetInt16(2),
                        Titel = (reader.IsDBNull(3) ? string.Empty : reader.GetString(3)), 
                        MenueTypeName = reader.GetString(4),
                        DetailList = new List<ProductExt>()
                    }) ;
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

            return MenueExt.GetListDetail(result); 
        }


        public static List<MenueExt> GetListDetail(List<MenueExt> menues)
        {

            try
            {
                string query = "select p.product_id, p.name, p.description, p.calorie, p.image,p.price, pt.name " +
                    "from wifi_mensa.menue as m " +
                    "left outer join wifi_mensa.menue_detail as md on m.menue_id = md.menue_id " +
                    "left outer join wifi_mensa.product as p on md.product_id = p.product_id " +
                    "left outer join wifi_mensa.product_type pt on p.product_type_id = pt.product_type_id " +
                    "where m.menue_id = :menue_id order by md.menue_detail_id asc";
                if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();            

                foreach (MenueExt item in menues)
                {
                    NpgsqlCommand command = new NpgsqlCommand();
                    command.Connection = DBConnection.Connection;
                    command.CommandText = query;
                    command.Parameters.AddWithValue("menue_id", item.MenueId);

                    NpgsqlDataReader reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        item.DetailList.Add(new ProductExt()
                        {
                            ProductId = reader.GetInt32(0),
                            Name = reader.GetString(1),
                            Description = reader.GetString(2),
                            Calorie = reader.GetInt32(3),
                            Image = (reader.IsDBNull(4) ? string.Empty : reader.GetString(4)),
                            Price = reader.GetDecimal(5),
                            ProductTypeName = reader.GetString(6),

                        });
                        
                    }
                    reader.Close();
                }
                   
                }
            catch (Exception ex)
            {

            }
            finally
            {
                DBConnection.Connection.Close();
            }


            return menues;
        }

        #endregion

    }
}
