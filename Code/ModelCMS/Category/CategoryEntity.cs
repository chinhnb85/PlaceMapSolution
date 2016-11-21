using System;

namespace ModelCMS.Category
{
	public class CategoryEntity
    {
		#region Properties
		
		public long Id { get; set; }

        public int? ParentId { get; set; }

        public int? Type { get; set; }

        public string Name { get; set; }

        public string Url { get; set; }

        public int? Position { get; set; }

        public string CreatedBy { get; set; }
		
		public DateTime? CreatedDate { get; set; }

        public bool? Status { get; set; }

        #endregion
    }
}
