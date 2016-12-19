using LibCore.Configuration;
using System;

namespace ModelCMS.Localtion
{
	public class LocaltionEntity
    {
		#region Properties
		
		public long Id { get; set; }

        public int AccountId { get; set; }

        public int ProvinceId { get; set; }

        public int DistrictId { get; set; }

        public int CustomeType { get; set; }

        public string Lag { get; set; }

        public string Lng { get; set; }

        public string Name { get; set; }
        
        public string Avatar { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Address { get; set; }             

        public DateTime? CreatedDate { get; set; }

        public bool? Status { get; set; }

        public string UserName { get; set; }

        public bool? IsCheck { get; set; }

        public int? PlaceNumberWrong { get; set; }

        public DateTime? CheckDate { get; set; }
        #endregion
    }
}
