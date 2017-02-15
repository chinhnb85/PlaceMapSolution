using System;
using System.Collections.Generic;

namespace ModelCMS.Localtion
{
	public interface ILocaltion
    {
		long Insert(LocaltionEntity obj);		
        bool Update(LocaltionEntity obj);
	    bool UpdateAvatar(LocaltionEntity obj);
        bool Delete(long id);
		List<LocaltionEntity> ListAll();
        List<LocaltionEntity> ListAllPaging(int accountId, int parentId, int provinceId, string keySearch, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow);
        List<LocaltionEntity> ListAllPagingByStatus(int accountId, int parentId, int provinceId, string keySearch, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow);
        LocaltionEntity ViewDetail(long id);	    
	    LocaltionEntity GetLocaltionByEmail(string email);
        List<LocaltionEntity> ListAllByAccountId(long accountId, ref int totalRow);
        List<LocaltionEntity> LocaltionAccountCheckListAllByAccountId(int accountId,DateTime startDate,DateTime endDate, int pageIndex, int pageSize, ref int totalRow);
    }
}
