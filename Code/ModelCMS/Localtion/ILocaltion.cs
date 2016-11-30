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
        List<LocaltionEntity> ListAllPaging(int accountId, string keySearch, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow);
		LocaltionEntity ViewDetail(int id);	    
	    LocaltionEntity GetLocaltionByEmail(string email);
	}
}
