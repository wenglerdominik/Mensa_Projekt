using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;


namespace Wifi.Database.Mensa.Modules

{
	public class User
	{
		//********************************************************
		#region Fields
		private const string COLUMNS = "user_id, user_number, last_name, first_name, nickname, password, role, deleted";
		private const string TABLE = "wifi_mensa.user";
		#endregion


		//user_id	 numeric(10) not null,
		//user_number NUMERIC(10),
		//last_name varchar(100),
		//first_name varchar(100),
		//mail varchar(100),
		//password varchar(100),
		//role NUMERIC(1),
		//deleted

		//********************************************************
		#region Properties
		[JsonPropertyName("userid")]
		public long? UserId { get; set; }
		//[JsonPropertyName("personuid")]
		//public string PersonUid { get; set; }
		[JsonPropertyName("usernumber")]
		public long? UserNumber { get; set; }
		[JsonPropertyName("lastname")]
		public string LastName { get; set; }
		[JsonPropertyName("firstname")]
		public string FirstName { get; set; }

		[JsonPropertyName("nickname")]
		public string NickName { get; set; }

		[JsonPropertyName("password")]
		public string Password { get; set; }

		[JsonPropertyName("role")]
		public int? Role { get; set; }

		[JsonPropertyName("deleted")]
		public bool? Deleted { get; set; }

		[JsonPropertyName("passwordclear")]
		public string PasswordClear { get; set; }

		#endregion

		//********************************************************
		#region static members
		public static List<User> GetList()
		{
			List<User> result = new List<User>();
			try
			{

				DBConnection.Connection.Open();

				NpgsqlCommand command = new NpgsqlCommand();
				command.Connection = DBConnection.Connection;
				command.CommandText = $"select {COLUMNS} from {TABLE} order by last_name, first_name";
				NpgsqlDataReader reader = command.ExecuteReader();

				while (reader.Read())
				{
					result.Add(new User()
					{
						UserId = reader.GetInt32(0),
						UserNumber = (reader.IsDBNull(1) ? (long?)null : reader.GetInt32(1)),
						LastName = (reader.IsDBNull(2) ? string.Empty : reader.GetString(2)),
						FirstName = (reader.IsDBNull(3) ? string.Empty : reader.GetString(3)),
						NickName = (reader.IsDBNull(4) ? string.Empty : reader.GetString(4)),
						Password = (reader.IsDBNull(5) ? string.Empty : reader.GetString(5)),
						Role = (reader.IsDBNull(6) ? (int?)null : reader.GetInt32(6)),
						Deleted = (reader.IsDBNull(7) ? (bool?)null : reader.GetBoolean(7))


						//NickName = (reader.IsDBNull(3) ? string.Empty : reader.GetString(3)),
						//Password = (reader.IsDBNull(4) ? string.Empty : reader.GetString(4)),
						//LastLogin = (reader.IsDBNull(5) ? (DateTime?)null : reader.GetDateTime(5)),
						//StateVal = (reader.IsDBNull(6) ? (int?)null : reader.GetInt32(6)),
						//StateText = (reader.IsDBNull(7) ? string.Empty : reader.GetString(7)),
						//StateDate = (reader.IsDBNull(8) ? (DateTime?)null : reader.GetDateTime(8)),
						//PersonUid = reader.GetString(9)
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

		public static User Get(string nickName, string password)
		{
			User result = null;
			try
			{

				DBConnection.Connection.Open();

				NpgsqlCommand command = new NpgsqlCommand();
				command.Connection = DBConnection.Connection;
				command.CommandText = $"select {COLUMNS} from {TABLE} where lower(nickname) = :nickname and password = :pwd";
				command.Parameters.AddWithValue("nickname", nickName.ToLower());

				MD5 md5 = MD5CryptoServiceProvider.Create();
				string pwd = Convert.ToBase64String(md5.ComputeHash(Encoding.UTF8.GetBytes(password)));
				command.Parameters.AddWithValue("pwd", pwd);
				NpgsqlDataReader reader = command.ExecuteReader();

				if (reader.Read())
				{
					result = new User()
					{
						UserId = reader.GetInt32(0),
						UserNumber = (reader.IsDBNull(1) ? (long?)null : reader.GetInt32(1)),
						LastName = (reader.IsDBNull(2) ? string.Empty : reader.GetString(2)),
						FirstName = (reader.IsDBNull(3) ? string.Empty : reader.GetString(3)),
						NickName = (reader.IsDBNull(4) ? string.Empty : reader.GetString(4)),
						Password = (reader.IsDBNull(5) ? string.Empty : reader.GetString(5)),
						Role = (reader.IsDBNull(6) ? (int?)null : reader.GetInt32(6)),
						Deleted = (reader.IsDBNull(7) ? (bool?)null : reader.GetBoolean(7))

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


		public static User Get(string id)
		{
			User result = null;
			try
			{

				long longId = 0;

				DBConnection.Connection.Open();

				NpgsqlCommand command = new NpgsqlCommand();
				command.Connection = DBConnection.Connection;
				command.CommandText = $"select {COLUMNS} from {TABLE} where ";
				if (long.TryParse(id, out longId))
				{
					command.CommandText += "user_id = :uid";
					command.Parameters.AddWithValue("uid", longId);
				}
				else
				{
					//command.CommandText += "person_uid = :pid";
					//command.Parameters.AddWithValue("pid", id);
				}
				NpgsqlDataReader reader = command.ExecuteReader();
				if (reader.Read())
				{
					result = new User()
					{

						UserId = reader.GetInt32(0),
						UserNumber = (reader.IsDBNull(1) ? (long?)null : reader.GetInt32(1)),
						LastName = (reader.IsDBNull(2) ? string.Empty : reader.GetString(2)),
						FirstName = (reader.IsDBNull(3) ? string.Empty : reader.GetString(3)),
						NickName = (reader.IsDBNull(4) ? string.Empty : reader.GetString(4)),
						Password = (reader.IsDBNull(5) ? string.Empty : reader.GetString(5)),
						Role = (reader.IsDBNull(6) ? (int?)null : reader.GetInt32(6)),
						Deleted = (reader.IsDBNull(7) ? (bool?)null : reader.GetBoolean(7))

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

		public static User GetNickname(string nickname)
		{
			User result = null;
			try
			{

				DBConnection.Connection.Open();

				NpgsqlCommand command = new NpgsqlCommand();
				command.Connection = DBConnection.Connection;
				command.CommandText = $"select {COLUMNS} from {TABLE} where lower(nickname)= :nickname";
				
				command.Parameters.AddWithValue("nickname", nickname.ToLower());
				
				NpgsqlDataReader reader = command.ExecuteReader();
				if (reader.Read())
				{
					result = new User()
					{

						UserId = reader.GetInt32(0),
						UserNumber = (reader.IsDBNull(1) ? (long?)null : reader.GetInt32(1)),
						LastName = (reader.IsDBNull(2) ? string.Empty : reader.GetString(2)),
						FirstName = (reader.IsDBNull(3) ? string.Empty : reader.GetString(3)),
						NickName = (reader.IsDBNull(4) ? string.Empty : reader.GetString(4)),
						Password = (reader.IsDBNull(5) ? string.Empty : reader.GetString(5)),
						Role = (reader.IsDBNull(6) ? (int?)null : reader.GetInt32(6)),
						Deleted = (reader.IsDBNull(7) ? (bool?)null : reader.GetBoolean(7))

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
				string update = $"update {TABLE} set user_number = @user_number, last_name = @last_name, first_name = @first_name, nickname = @nickname, password = @password, role = @role, deleted = @deleted where user_id = @user_id";

				NpgsqlCommand cmd = null;

				if (!this.UserId.HasValue) // Insert
				{
					cmd = new NpgsqlCommand($"select nextval('{TABLE}_seq')", DBConnection.Connection);
					this.UserId = (long)cmd.ExecuteScalar();

					cmd = new NpgsqlCommand($"select nextval('{TABLE}_number_seq')", DBConnection.Connection);
					this.UserNumber = (long)cmd.ExecuteScalar();

					cmd = new NpgsqlCommand(insert, DBConnection.Connection);
				}
				else // Update
					cmd = new NpgsqlCommand(update, DBConnection.Connection);


				if (!String.IsNullOrEmpty(this.PasswordClear))
				{
					MD5 md5 = MD5CryptoServiceProvider.Create();
					this.Password = Convert.ToBase64String(md5.ComputeHash(Encoding.UTF8.GetBytes(this.PasswordClear)));
				}

				cmd.Parameters.AddWithValue("@user_id", this.UserId);
				cmd.Parameters.AddWithValue("@user_number", this.UserNumber ?? (object)DBNull.Value);
				cmd.Parameters.AddWithValue("@last_name", this.LastName ?? (object)DBNull.Value);
				cmd.Parameters.AddWithValue("@first_name", this.FirstName ?? (object)DBNull.Value);
				cmd.Parameters.AddWithValue("@nickname", this.NickName ?? (object)DBNull.Value);
				cmd.Parameters.AddWithValue("@password", this.Password ?? (object)DBNull.Value);
				cmd.Parameters.AddWithValue("@role", this.Role ?? (object)DBNull.Value);
				cmd.Parameters.AddWithValue("@deleted", this.Deleted ?? (object)DBNull.Value);


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
			return $"{this.FirstName} {this.LastName}";
		}





	}
}
