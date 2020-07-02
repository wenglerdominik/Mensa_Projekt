using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class MenueDetail
    {
        //********************************************************
        #region Fields
        private const string COLUMNS = "menue_detail_id, menue_id, product_id";
        private const string TABLE = "wifi_mensa.menue_detail";
        #endregion

        //********************************************************
        #region Properties
        [JsonPropertyName("menuedetailid")]
        public long? MenueDetailId { get; set; }
        [JsonPropertyName("menueid")]
        public long? MenueId { get; set; }
        [JsonPropertyName("productid")]
        public long? ProductId { get; set; }

        #endregion

        //********************************************************
        #region static members
        public static List<MenueDetail> GetList()
        {
            List<MenueDetail> result = new List<MenueDetail>();
            try
            {

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = $"select {COLUMNS} from {TABLE}";
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new MenueDetail()
                    {
                        MenueDetailId = reader.GetInt32(0),
                        MenueId = (reader.IsDBNull(1) ? (long?)null : reader.GetInt32(1)),
                        ProductId = (reader.IsDBNull(2) ? (long?)null : reader.GetInt32(2))

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

        public static MenueDetail Get(int id)
        {
            MenueDetail result = null;
            try
            {

                DBConnection.Connection.Open();

                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = $"select {COLUMNS} from {TABLE} where menue_detail_id = :menue_detail_id";
                command.Parameters.AddWithValue("menue_detail_id", id);


                NpgsqlDataReader reader = command.ExecuteReader();

                if (reader.Read())
                {
                    result = new MenueDetail()
                    {
                        MenueDetailId = reader.GetInt32(0),
                        MenueId = (reader.IsDBNull(1) ? (long?)null : reader.GetInt32(1)),
                        ProductId = (reader.IsDBNull(2) ? (long?)null : reader.GetInt32(2)),

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

        public static bool DeleteForMenueUpdate(long MenueId)
        {
            try
            {
                if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();

                string delete = $"delete from {TABLE} where menue_id = @menue_id";

                NpgsqlCommand cmd = null;
                cmd = new NpgsqlCommand(delete, DBConnection.Connection);

                cmd.Parameters.AddWithValue("@menue_id", MenueId);

                cmd.Prepare();
                cmd.ExecuteScalar();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
                return false;
            }
            
        }

        #endregion

        //********************************************************

        public int Save()
        {
            DBConnection.Connection.Open();
            try
            {
                string insert = $"insert into {TABLE} ({COLUMNS}) values (@{COLUMNS.Replace(", ", ", @")})";
                string update = $"update {TABLE} set product_id = @product_id where menue_detail_id = @menue_detail_id";

                NpgsqlCommand cmd = null;

                if (!this.MenueDetailId.HasValue) // Insert
                {
                    cmd = new NpgsqlCommand($"select nextval('{TABLE}_seq')", DBConnection.Connection);
                    this.MenueDetailId = (long)cmd.ExecuteScalar();
                    //this.PersonUid = Guid.NewGuid().ToString("N");

                    cmd = new NpgsqlCommand(insert, DBConnection.Connection);
                }
                else // Update
                    cmd = new NpgsqlCommand(update, DBConnection.Connection);


                cmd.Parameters.AddWithValue("@menue_detail_id", this.MenueDetailId);
                cmd.Parameters.AddWithValue("@menue_id", this.MenueId ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@product_id", this.ProductId ?? (object)DBNull.Value);


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
            if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();
            try
            {
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
    }
}
