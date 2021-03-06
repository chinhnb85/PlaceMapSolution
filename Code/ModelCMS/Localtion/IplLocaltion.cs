using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using LibCore.Data;
using LibCore.Helper.Logging;
using ModelCMS.Base;

namespace ModelCMS.Localtion
{
    public class IplLocaltion : BaseIpl<ADOProvider>, ILocaltion
    {
        #region Methods

        /// <summary>
        /// Saves a record to the Localtion table.
        /// </summary>
        public long Insert(LocaltionEntity obj)
        {
            long res;            
            try
            {
                var p = Param(obj);
                var flag = unitOfWork.ProcedureExecute("Sp_Localtion_Insert", p);
                res = flag ? p.Get<long>("@Id") : 0;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
            return res;
        }

        /// <summary>
        /// Updates a record in the Localtion table.
        /// </summary>
        public bool Update(LocaltionEntity obj)
        {
            try
            {
                var p = Param(obj, "edit");                
                var res = unitOfWork.ProcedureExecute("Sp_Localtion_Update", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public bool EditLocaltion(LocaltionEntity obj)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", obj.Id);
                p.Add("@AccountId", obj.AccountId);                               
                p.Add("@Lag", obj.Lag);
                p.Add("@Lng", obj.Lng);
                p.Add("@Name", obj.Name);
                p.Add("@Avatar", obj.Avatar);                
                p.Add("@Phone", obj.Phone);
                p.Add("@Address", obj.Address);                
                p.Add("@Code", obj.Code);                

                var res = unitOfWork.ProcedureExecute("Sp_Localtion_EditLocaltion", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Deletes a record from the Localtion table by its primary key.
        /// </summary>
        public bool Delete(long id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);                
                var res = unitOfWork.ProcedureExecute("Sp_Localtion_Delete", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }
        public bool UpdateStatus(long id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);
                var res = unitOfWork.ProcedureExecute("Sp_Localtion_UpdateStatus", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }
        public bool UpdateStatusEdit(long id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);
                var res = unitOfWork.ProcedureExecute("Sp_Localtion_UpdateStatusEdit", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }
        public bool UpdateAvatar(LocaltionEntity obj)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", obj.Id);                
                var res = unitOfWork.ProcedureExecute("Sp_Localtion_UpdateAvatar", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return false;
            }
        }
        public LocaltionEntity GetLocaltionByEmail(string email)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@email", email);
                var data = unitOfWork.Procedure<LocaltionEntity>("Sp_Localtion_GetLocaltionByEmail", p).FirstOrDefault();
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return null;
            }

        }
        
        /// <summary>
        /// Selects a single record from the Localtion table.
        /// </summary>
        public LocaltionEntity ViewDetail(long id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);
                var data = unitOfWork.Procedure<LocaltionEntity>("Sp_Localtion_ViewDetail", p).SingleOrDefault();
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return null;
            }
        }

        public LocaltionEntity ViewDetailLocaltionNow(long id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);
                var data = unitOfWork.Procedure<LocaltionEntity>("Sp_Localtion_ViewDetailLocaltionNow", p).SingleOrDefault();
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// Selects all records from the Localtion table.
        /// </summary>
        public List<LocaltionEntity> ListAll()
        {
            try
            {
                var data = unitOfWork.Procedure<LocaltionEntity>("Sp_Localtion_ListAll");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Selects all records from the Localtion table.
        /// </summary>
        public List<LocaltionEntity> ListAllPaging(int accountId, int parentId, int provinceId, string keySearch, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@AccountId", accountId);
                p.Add("@parentId", parentId);
                p.Add("@provinceId", provinceId);
                p.Add("@KeySearch", keySearch);                
                p.Add("@pageIndex", pageIndex);
                p.Add("@pageSize", pageSize);
                p.Add("@sortColumn", sortColumn);
                p.Add("@sortDesc", sortDesc);
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<LocaltionEntity>("Sp_Localtion_ListAllPaging", p);
                totalRow = p.Get<int>("@totalRow");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public List<LocaltionEntity> GetExportData(int accountId, int parentId, int provinceId, string keySearch)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@AccountId", accountId);
                p.Add("@parentId", parentId);
                p.Add("@provinceId", provinceId);
                p.Add("@KeySearch", keySearch);                                
                var data = unitOfWork.Procedure<LocaltionEntity>("Sp_Localtion_GetExportData", p);                
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public List<LocaltionEntity> ListAllPagingByStatus(int accountId, int parentId, int provinceId, string keySearch, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@AccountId", accountId);
                p.Add("@parentId", parentId);
                p.Add("@provinceId", provinceId);
                p.Add("@KeySearch", keySearch);
                p.Add("@pageIndex", pageIndex);
                p.Add("@pageSize", pageSize);
                p.Add("@sortColumn", sortColumn);
                p.Add("@sortDesc", sortDesc);
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<LocaltionEntity>("Sp_Localtion_ListAllPagingByStatus", p);
                totalRow = p.Get<int>("@totalRow");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public List<LocaltionEntity> ListAllByAccountId(long accountId, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@AccountId", accountId);                
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<LocaltionEntity>("Sp_Localtion_ListAllByAccountId", p);
                totalRow = p.Get<int>("@totalRow");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public List<LocaltionEntity> ListAllByAccountIdAndStatus(long accountId, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@AccountId", accountId);
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<LocaltionEntity>("Sp_Localtion_ListAllByAccountIdAndStatus", p);
                totalRow = p.Get<int>("@totalRow");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public List<LocaltionEntity> GetListSchedulerByAccountId(long accountId, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@AccountId", accountId);
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<LocaltionEntity>("Sp_Localtion_GetListSchedulerByAccountId", p);
                totalRow = p.Get<int>("@totalRow");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public bool CheckedLocaltion(LocaltionEntity loc)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", loc.Id);
                p.Add("@AccountId", loc.AccountId);
                p.Add("@PlaceNumberWrong", loc.PlaceNumberWrong);
                p.Add("@ImageCheckin", loc.ImageCheckin);
                var res = unitOfWork.ProcedureExecute("Sp_Localtion_CheckedLocaltion", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public bool GetCountCheckIn(long localtionId, ref int countCheckIn)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@LocaltionId", localtionId);
                p.Add("@countCheckIn", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var res = unitOfWork.ProcedureExecute("Sp_LocaltionAccountCheck_GetCountCheckIn", p);
                countCheckIn = p.Get<int>("@countCheckIn");
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public List<LocaltionEntity> LocaltionAccountCheckListAllByAccountId(int accountId,DateTime startDate,DateTime endDate, int pageIndex, int pageSize, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@AccountId", accountId);
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);
                p.Add("@pageIndex", pageIndex);
                p.Add("@pageSize", pageSize);               
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<LocaltionEntity>("Sp_LocaltionAccountCheck_ListAllByAccountId", p);
                totalRow = p.Get<int>("@totalRow");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }
        public List<LocaltionEntity> GetExportDataAccountCheckin(int accountId, DateTime startDate, DateTime endDate)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@AccountId", accountId);
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);
                var data = unitOfWork.Procedure<LocaltionEntity>("Sp_LocaltionAccountCheck_GetExportData", p);
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public List<LocaltionEntity> LocaltionAccountCheckListAllByLocaltionId(int localtionId, DateTime startDate, DateTime endDate, int pageIndex, int pageSize, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@LocaltionId", localtionId);
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);
                p.Add("@pageIndex", pageIndex);
                p.Add("@pageSize", pageSize);
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<LocaltionEntity>("Sp_LocaltionAccountCheck_ListAllByLocaltionId", p);
                totalRow = p.Get<int>("@totalRow");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public bool UpdateLocaltionByAccountId(bool isAll, int userIdA, int userIdB, string listLocaltionId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@isAll", isAll);
                p.Add("@userIdA", userIdA);
                p.Add("@userIdB", userIdB);
                p.Add("@listLocaltionId", listLocaltionId);
                var res = unitOfWork.ProcedureExecute("Sp_Localtion_UpdateLocaltionByAccountId", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Saves a record to the Localtion table.
        /// </summary>
        private DynamicParameters Param(LocaltionEntity obj, string action = "add")
        {
            var p = new DynamicParameters();
            p.Add("@AccountId", obj.AccountId);
            p.Add("@ProvinceId", obj.ProvinceId);
            p.Add("@DistrictId", obj.DistrictId);
            p.Add("@CustomeType", obj.CustomeType);
            p.Add("@Lag", obj.Lag);
            p.Add("@Lng", obj.Lng);
            p.Add("@Name", obj.Name);
            p.Add("@Avatar", obj.Avatar);
            p.Add("@Email", obj.Email);
            p.Add("@Phone", obj.Phone);
            p.Add("@Address", obj.Address);            
            p.Add("@Status", obj.Status);
            p.Add("@Code", obj.Code);
            p.Add("@RepresentActive", obj.RepresentActive);
            p.Add("@MinCheckin", obj.MinCheckin);
            p.Add("@StatusEdit", obj.StatusEdit);

            if (action == "add")
            {                
                p.Add("@Id", dbType: DbType.Int64, direction: ParameterDirection.Output);
            }
            else if(action == "edit")
            {
                p.Add("@Id", obj.Id);
            }                       

            return p;
        }

        #endregion
    }
}
