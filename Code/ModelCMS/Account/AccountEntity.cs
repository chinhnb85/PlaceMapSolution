using System;

namespace ModelCMS.Account
{
	public class AccountEntity
    {
		#region Properties
		
		public long Id { get; set; }

        public int? ParentId { get; set; }

        public int? Type { get; set; }        

        public string DisplayName { get; set; }

        public string UserName { get; set; }
		
		public string Password { get; set; }

        public string Avatar { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Address { get; set; }

        public DateTime? BirthDay { get; set; }

        public string DeviceMobile { get; set; }        

        public DateTime? CreatedDate { get; set; }

        public bool? Status { get; set; }       

        #endregion
    }
}
