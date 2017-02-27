using System.Collections.Generic;

namespace ModelCMS.LocaltionStatus
{
	public interface ILocaltionStatus
    {
		long Insert(LocaltionStatusEntity obj);		
        bool Update(LocaltionStatusEntity obj);	    
        bool Delete(long id);		
        List<LocaltionStatusEntity> ListAll();
        List<LocaltionStatusEntity> ListAllPaging(string keySearch, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow);
        LocaltionStatusEntity ViewDetail(int id);	    
	}
}
