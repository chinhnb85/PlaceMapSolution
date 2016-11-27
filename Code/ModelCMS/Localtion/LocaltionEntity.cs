using System;

namespace ModelCMS.Localtion
{
	public class LocaltionEntity
    {
		#region Properties
		
		public long Id { get; set; }        

        public string Lag { get; set; }

        public string Lng { get; set; }

        public string Name { get; set; }
        
        public string Avatar { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Address { get; set; }             

        public DateTime? CreatedDate { get; set; }

        public bool? Status { get; set; }

        #endregion
    }
}
