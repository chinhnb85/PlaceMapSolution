using System.Collections.Generic;
using System;

namespace ModelCMS.Statistic
{
	public interface IStatistic
    {			
        List<StatisticEntity> ListStatisticPaging(DateTime startDate, DateTime endDate, int pageIndex, int pageSize, ref int totalRow);	    
	}
}
