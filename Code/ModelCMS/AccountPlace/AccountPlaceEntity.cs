using LibCore.Configuration;
using System;

namespace ModelCMS.AccountPlace
{
	public class AccountPlaceEntity
    {
		#region Properties
		
		public long Id { get; set; }

        public int AccountId { get; set; }        

        public string Lag { get; set; }

        public string Lng { get; set; }                 

        public DateTime? Datetime { get; set; }

        #endregion
    }
}
