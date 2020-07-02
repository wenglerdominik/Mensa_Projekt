using Npgsql;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Wifi.Database.Mensa
{
	public static class DBConnection
	{

		#region Properties

		public static NpgsqlConnection Connection { get; set; }

		#endregion

		#region Constructor
		/// <summary>
		/// Static cause it could only exist one object at the same time
		/// </summary>
		static DBConnection()
		{
			Connection = new NpgsqlConnection("User ID=wifi_user;Password=wifi;Host=localhost;Port=5432;Database=wifi_db;");
		}

		#endregion
	}
}
