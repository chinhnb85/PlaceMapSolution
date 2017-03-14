using System;

namespace ModelCMS.SchedulerCheckin
{
	public class SchedulerCheckinEntity
    {
		#region Properties
		
		public int Id { get; set; }

        public int AccountId { get; set; }

        public int LocaltionId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string Description { get; set; }
        
        #endregion
    }
}
