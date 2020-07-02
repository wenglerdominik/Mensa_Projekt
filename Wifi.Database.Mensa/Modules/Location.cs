using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa.Modules
{
    public class Location
    {
        //********************************************************
        #region Fields
        private const string COLUMNS = "location_id, name, street, post_code, deleted, longitude, latitude";
        private const string TABLE = "wifi_mensa.location";
        #endregion

        //********************************************************
        #region Properties
        [JsonPropertyName("locationid")]
        public long? LocationId { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [JsonPropertyName("street")]
        public string Street { get; set; }

        [JsonPropertyName("postcode")]
        public int? PostCode { get; set; }
        [JsonPropertyName("deleted")]
        public bool? Deleted { get; set; }

        [JsonPropertyName("longitude")]
        public decimal? Longitude { get; set; }

        [JsonPropertyName("latitude")]
        public decimal? Latitude { get; set; }

        #endregion

        //********************************************************
        #region static members
        public static List<Location> GetList()
        {
            List<Location> result = new List<Location>();
            try
            {

                if (DBConnection.Connection.State.ToString() == "Closed") DBConnection.Connection.Open();


                NpgsqlCommand command = new NpgsqlCommand();
                command.Connection = DBConnection.Connection;
                command.CommandText = $"select {COLUMNS} from {TABLE}";
                NpgsqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    result.Add(new Location()
                    {
                        LocationId = reader.GetInt32(0),
                        Name = (reader.IsDBNull(1) ? string.Empty : reader.GetString(1)),
                        Street = (reader.IsDBNull(2) ? string.Empty : reader.GetString(2)),
                        PostCode = (reader.IsDBNull(3) ? (int?)null : reader.GetInt32(3)),
                        Deleted = (reader.IsDBNull(4) ? (bool?)null : reader.GetBoolean(4)),
                        Longitude = (reader.IsDBNull(5) ? (decimal?)null : reader.GetDecimal(5)),
                        Latitude = (reader.IsDBNull(6) ? (decimal?)null : reader.GetDecimal(6)),

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
                string update = $"update {TABLE} set name = @name, street = @street, post_code = @post_code, deleted = @deleted, longitude = @longitude, latitude = @latitude " +
                    $"where location_id = @location_id";

                NpgsqlCommand cmd = null;

                if (!this.LocationId.HasValue) // Insert
                {
                    cmd = new NpgsqlCommand($"select nextval('{TABLE}_seq')", DBConnection.Connection);
                    this.LocationId = (long)cmd.ExecuteScalar();
                    //this.PersonUid = Guid.NewGuid().ToString("N");

                    cmd = new NpgsqlCommand(insert, DBConnection.Connection);
                }
                else // Update
                    cmd = new NpgsqlCommand(update, DBConnection.Connection);


                cmd.Parameters.AddWithValue("@location_id", this.LocationId);
                cmd.Parameters.AddWithValue("@name", this.Name ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@street", this.Street ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@post_code", this.PostCode ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@deleted", this.Deleted ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@longitude", this.Longitude ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@latitude", this.Latitude ?? (object)DBNull.Value);

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
