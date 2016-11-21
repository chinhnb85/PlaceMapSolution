using System;

namespace ModelCMS.Product
{
	public class ProductEntity
    {
		#region Properties
		
		public long Id { get; set; }

        public int? CategoryId { get; set; }

        public int? ManufacturerId { get; set; }

        public string Name { get; set; }

        public string Url { get; set; }

        public string Avatar { get; set; }

        public string Price { get; set; }

        public string PriceKm { get; set; }

        public string Condition { get; set; }

        public string Weigh { get; set; }

        public string Origin { get; set; }

        public string Description { get; set; }

        public string Video { get; set; }

        public int? CountView { get; set; }

        public bool? IsHighlights { get; set; }

        public bool? IsTop { get; set; }

        public string CreatedBy { get; set; }
		
		public DateTime? CreatedDate { get; set; }

        public bool? Status { get; set; }

        #endregion
    }
}
