using System;

namespace ModelCMS.Province
{
	public class ProvinceEntity
    {
		#region Properties
		
		public long Id { get; set; }

        public int? ProvinceId { get; set; }       

        public string Name { get; set; }

        public string Type { get; set; }
		
		public string Location { get; set; }           

        #endregion
    }
}
