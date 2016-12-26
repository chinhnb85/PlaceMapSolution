using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using LibCore.Data;
using LibCore.Helper.Logging;
using ModelCMS.Base;

namespace ModelCMS.AccountPlace
{
    public class IplAccountPlace : BaseIpl<ADOProvider>, IAccountPlace
    {
        #region Methods

        /// <summary>
        /// Saves a record to the AccountPlace table.
        /// </summary>
        public long Insert(AccountPlaceEntity obj)
        {
            long res;            
            try
            {
                var p = Param(obj);
                var flag = unitOfWork.ProcedureExecute("Sp_AccountPlace_Insert", p);
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
        /// Updates a record in the AccountPlace table.
        /// </summary>
        public bool Update(AccountPlaceEntity obj)
        {
            try
            {
                var p = Param(obj, "edit");                
                var res = unitOfWork.ProcedureExecute("Sp_AccountPlace_Update", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Deletes a record from the AccountPlace table by its primary key.
        /// </summary>
        public bool Delete(long id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);                
                var res = unitOfWork.ProcedureExecute("Sp_AccountPlace_Delete", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }        
        
        /// <summary>
        /// Selects a single record from the AccountPlace table.
        /// </summary>
        public AccountPlaceEntity ViewDetail(long id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);
                var data = unitOfWork.Procedure<AccountPlaceEntity>("Sp_AccountPlace_ViewDetail", p).SingleOrDefault();
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return null;
            }
        }
        
        /// <summary>
        /// Selects all records from the AccountPlace table.
        /// </summary>
        public List<AccountPlaceEntity> ListAll()
        {
            try
            {
                var data = unitOfWork.Procedure<AccountPlaceEntity>("Sp_AccountPlace_ListAll");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Selects all records from the AccountPlace table.
        /// </summary>
        public List<AccountPlaceEntity> ListAllPaging(int accountId, string keySearch, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@AccountId", accountId);
                p.Add("@KeySearch", keySearch);                
                p.Add("@pageIndex", pageIndex);
                p.Add("@pageSize", pageSize);
                p.Add("@sortColumn", sortColumn);
                p.Add("@sortDesc", sortDesc);
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<AccountPlaceEntity>("Sp_AccountPlace_ListAllPaging", p);
                totalRow = p.Get<int>("@totalRow");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }
        
        public List<AccountPlaceEntity> ListAllByAccountId(long accountId, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@AccountId", accountId);                
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<AccountPlaceEntity>("Sp_AccountPlace_ListAllByAccountId", p);
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
        /// Saves a record to the AccountPlace table.
        /// </summary>
        private DynamicParameters Param(AccountPlaceEntity obj, string action = "add")
        {
            var p = new DynamicParameters();
            p.Add("@AccountId", obj.AccountId);            
            p.Add("@Lag", obj.Lag);
            p.Add("@Lng", obj.Lng);                   

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
