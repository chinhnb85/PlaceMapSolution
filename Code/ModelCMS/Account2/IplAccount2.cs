using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using Dapper;
using LibCore.Data;
using LibCore.Helper.Extensions;
using LibCore.Helper.Logging;
using ModelCMS.Account2;
using ModelCMS.Base;

namespace ModelCMS.Acccount2
{
    public class IplAcccount2 : BaseIpl<ADOProvider>, IAcccount2
    {
        #region Methods

        /// <summary>
        /// Saves a record to the Acccount2 table.
        /// </summary>
        public long Insert(Acccount2Entity Acccount2)
        {
            long res = 0;
            //bool flag = false;
            try
            {
                var p = Param(Acccount2);
                var flag = unitOfWork.ProcedureExecute("Sp_Acccount2_Insert", p);
                res = flag ? p.Get<long>("@ID") : 0;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
            return res;
        }

        /// <summary>
        /// Updates a record in the Acccount2 table.
        /// </summary>
        public bool Update(Acccount2Entity Acccount2)
        {
            try
            {
                var p = Param(Acccount2, "edit");
                var res = unitOfWork.ProcedureExecute("Sp_Acccount2_Update", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Deletes a record from the Acccount2 table by its primary key.
        /// </summary>
        public bool Delete(long iD, long adminId, int adminType)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@AccID", iD);
                p.Add("@AdminId", adminId);
                p.Add("@AdminType", adminType);
                var res = unitOfWork.ProcedureExecute("Sp_Acccount2_Delete", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }
        public bool UpdateAvatar(Acccount2Entity Acccount2)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@ID", Acccount2.ID);
                p.Add("@Photo", Acccount2.Photo);
                var res = unitOfWork.ProcedureExecute("Sp_Acccount2_UpdateAvatar", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return false;
            }
        }
        public Acccount2Entity GetAcccount2ByEmail(string email)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@email", email);
                var data = unitOfWork.Procedure<Acccount2Entity>("Sp_Acccount2_GetAcccount2ByEmail", p).FirstOrDefault();
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return null;
            }

        }

        /// <summary>
        /// Check username exist
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public bool CheckUsernameExist(string username)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@UserName", username);
                p.Add("@Res", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                unitOfWork.ProcedureExecute("Sp_Acccount2_CheckUsernameExist", p);
                var data = p.Get<bool>("@Res");
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return false;
            }
        }
        public bool CheckEmailExist(string email, long id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Email", email);
                p.Add("@ID", id);
                p.Add("@Res", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                unitOfWork.ProcedureExecute("Sp_Acccount2_CheckEmailExist", p);
                var data = p.Get<bool>("@Res");
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return false;
            }
        }
        public bool CheckResetPassword(string oldPass, string email)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@oldPass", oldPass);
                p.Add("@email", email);
                p.Add("@data", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                unitOfWork.ProcedureExecute("Sp_Acccount2_CheckResetPassword", p);
                var data = p.Get<bool>("@data");
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return false;
            }
        }
        public bool ResetPassword(string email, string password)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@email", email);
                p.Add("@password", password);
                p.Add("@data", dbType: DbType.Boolean, direction: ParameterDirection.Output);
                unitOfWork.ProcedureExecute("Sp_Acccount2_ResetPassword", p);
                var data = p.Get<bool>("@data");
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return false;
            }
        }

        /// <summary>
        /// Selects a single record from the Acccount2 table.
        /// </summary>
        public Acccount2Entity ViewDetail(string id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@ID", id);
                var data = unitOfWork.Procedure<Acccount2Entity>("Sp_Acccount2_ViewDetail", p).SingleOrDefault();
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return null;
            }
        }

        public bool Login(string userName, string password, ref Acccount2Entity Acccount2)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@userName", userName);
                p.Add("@password", password);
                var data = unitOfWork.ProcedureQueryMulti("Sp_Acccount2_Login", p);
                var result = data.Read<string>().SingleOrDefault();
                if (result == "SUCCESS")
                {
                    Acccount2 = data.Read<Acccount2Entity>().SingleOrDefault();
                    return true;
                }
                else
                {
                    Acccount2 = null;
                    return false;
                }

            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public bool ChangePassword(long id, string oldPassword, string newPassword)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);
                p.Add("@OldPassword", oldPassword);
                p.Add("@Password", newPassword);
                var data = unitOfWork.Procedure<string>("Sp_Acccount2_ChangePassword", p).SingleOrDefault();
                return data == "SUCCESS";

            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Selects all records from the Acccount2 table.
        /// </summary>
        public List<Acccount2Entity> ListAll()
        {
            try
            {
                var data = unitOfWork.Procedure<Acccount2Entity>("Sp_Acccount2_ListAll");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Selects all records from the Acccount2 table.
        /// </summary>
        public List<Acccount2Entity> ListAllPaging(Acccount2Entity userInfo, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@username", userInfo.UserName);
                p.Add("@firstname", userInfo.FirstName);
                p.Add("@lastname", userInfo.LastName);
                p.Add("@email", userInfo.Email);
                p.Add("@syndicname", userInfo.SyndicName);
                p.Add("@pageIndex", pageIndex);
                p.Add("@pageSize", pageSize);
                p.Add("@sortColumn", sortColumn);
                p.Add("@sortDesc", sortDesc);
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<Acccount2Entity>("Sp_Acccount2_ListAllPaging", p);
                totalRow = p.Get<int>("@totalRow");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Saves a record to the Acccount2 table.
        /// </summary>
        private DynamicParameters Param(Acccount2Entity Acccount2, string action = "add")
        {
            var p = new DynamicParameters();
            if (action == "add")
            {
                p.Add("@AdminType", Acccount2.AdminType);
                p.Add("@UserName", Acccount2.UserName);
                p.Add("@Password", Acccount2.Password);
                p.Add("@ID", dbType: DbType.Int64, direction: ParameterDirection.Output);
            }
            else if(action == "edit")
            {
                p.Add("@ID", Acccount2.ID);
            }
            
            p.Add("@FirstName", Acccount2.FirstName);
            p.Add("@LastName", Acccount2.LastName);
            p.Add("@Address", Acccount2.Address);
            p.Add("@CodePostal", Acccount2.CodePostal);
            p.Add("@City", Acccount2.City);
            p.Add("@Country", Acccount2.Country);
            //p.Add("@BirthCity", Acccount2.BirthCity);
            //p.Add("@BirthCountry", Acccount2.BirthCountry);
            p.Add("@Phone", Acccount2.Phone);
            p.Add("@Phone2", Acccount2.Phone2);
            p.Add("@Email", Acccount2.Email);
            //p.Add("@DateOfBirth", Acccount2.DateOfBirth);
            //p.Add("@PlaceOfBirth", Acccount2.PlaceOfBirth);
            p.Add("@Gender", Acccount2.Gender);

            return p;
        }


        #endregion
    }
}
