using System.Collections.Generic;

namespace ModelCMS.Account
{
	public interface IAccount
    {
		long Insert(AccountEntity obj);		
        bool Update(AccountEntity obj);
	    bool UpdateAvatar(int id, string avatar);
        bool Delete(long id);
		List<AccountEntity> ListAll();
        List<AccountEntity> ListAllPaging(string keySearch, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow);
		AccountEntity ViewDetail(int id);
	    bool CheckUserNameExist(string userName);
	    bool Login(string userName, string password, ref AccountEntity obj);
        bool ChangePassword(long id, string oldPassword,string newPassword);
	    bool CheckResetPassword(string oldPass, string email);
	    bool ResetPassword(string email, string password);
	    AccountEntity GetAccountByEmail(string email);
	}
}
