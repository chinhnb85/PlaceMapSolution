using System;

namespace ModelCMS.Statistic
{
	public class StatisticEntity
    {
		#region Properties
		
		public int Id { get; set; }

        public string UserName { get; set; }

        public string FullName { get; set; }

        public int SumAll { get; set; }

        public int SumCheckInMonth { get; set; }

        public int FullMinCheckInMonth { get; set; }
        
        #endregion
    }
}
