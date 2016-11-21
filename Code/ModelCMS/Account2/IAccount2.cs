using System.Collections.Generic;
using ModelCMS.Acccount2;

namespace ModelCMS.Account2
{
	public interface IAcccount2
	{
		long Insert(Acccount2Entity Acccount2);		
        bool Update(Acccount2Entity Acccount2);
	    bool UpdateAvatar(Acccount2Entity Acccount2);
        bool Delete(long id, long adminId, int adminType);
		List<Acccount2Entity> ListAll();
        List<Acccount2Entity> ListAllPaging(Acccount2Entity userInfo, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow);
		Acccount2Entity ViewDetail(string id);
	    bool CheckUsernameExist(string username);
	    bool Login(string userName, string password, ref Acccount2Entity Acccount2);
        bool ChangePassword(long id, string oldPassword,string newPassword);
	    bool CheckResetPassword(string oldPass, string email);
	    bool ResetPassword(string email, string password);
	    Acccount2Entity GetAcccount2ByEmail(string email);
	}
}
