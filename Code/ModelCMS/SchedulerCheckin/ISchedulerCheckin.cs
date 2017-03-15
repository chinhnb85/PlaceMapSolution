using System.Collections.Generic;

namespace ModelCMS.SchedulerCheckin
{
	public interface ISchedulerCheckin
    {
		long Insert(SchedulerCheckinEntity obj);		
        bool Update(SchedulerCheckinEntity obj);	    
        bool Delete(int id);		
        List<SchedulerCheckinEntity> ListAll();
        List<SchedulerCheckinEntity> ListAllPaging(string keySearch, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow);
        SchedulerCheckinEntity ViewDetail(int id);	    
	}
}
