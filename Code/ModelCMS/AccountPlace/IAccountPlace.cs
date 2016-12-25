using System.Collections.Generic;

namespace ModelCMS.AccountPlace
{
	public interface IAccountPlace
    {
		long Insert(AccountPlaceEntity obj);		
        bool Update(AccountPlaceEntity obj);	    
        bool Delete(long id);
		List<AccountPlaceEntity> ListAll();
        List<AccountPlaceEntity> ListAllPaging(int accountId, string keySearch, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow);       
        AccountPlaceEntity ViewDetail(long id);	    	    
        List<AccountPlaceEntity> ListAllByAccountId(long accountId, ref int totalRow);
    }
}
