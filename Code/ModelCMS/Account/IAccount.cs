using System.Collections.Generic;

namespace ModelCMS.Account
{
	public interface IAccount
    {
		long Insert(AccountEntity obj);		
        bool Update(AccountEntity obj);
	    bool UpdateAvatar(AccountEntity obj);
        bool Delete(long id, long accountId, int type);
		List<AccountEntity> ListAll();
        List<AccountEntity> ListAllPaging(AccountEntity accountInfo, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow);
		AccountEntity ViewDetail(string id);
	    bool CheckUserNameExist(string userName);
	    bool Login(string userName, string password, ref AccountEntity obj);
        bool ChangePassword(long id, string oldPassword,string newPassword);
	    bool CheckResetPassword(string oldPass, string email);
	    bool ResetPassword(string email, string password);
	    AccountEntity GetAccountByEmail(string email);
	}
}
