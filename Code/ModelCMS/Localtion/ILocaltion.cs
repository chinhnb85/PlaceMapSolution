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
        List<LocaltionEntity> ListAllPaging(string keySearch, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow);
		LocaltionEntity ViewDetail(int id);
	    bool CheckUserNameExist(string userName);
	    bool Login(string userName, string password, ref LocaltionEntity obj);
        bool ChangePassword(long id, string oldPassword,string newPassword);
	    bool CheckResetPassword(string oldPass, string email);
	    bool ResetPassword(string email, string password);
	    LocaltionEntity GetLocaltionByEmail(string email);
	}
}
