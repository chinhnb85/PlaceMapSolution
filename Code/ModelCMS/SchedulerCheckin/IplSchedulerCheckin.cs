using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using LibCore.Data;
using LibCore.Helper.Logging;
using ModelCMS.Base;

namespace ModelCMS.SchedulerCheckin
{
    public class IplSchedulerCheckin : BaseIpl<ADOProvider>, ISchedulerCheckin
    {
        #region Methods

        /// <summary>
        /// Saves a record to the SchedulerCheckin table.
        /// </summary>
        public long Insert(SchedulerCheckinEntity obj)
        {
            long res;            
            try
            {
                var p = Param(obj);
                var flag = unitOfWork.ProcedureExecute("Sp_SchedulerCheckin_Insert", p);
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
        /// Updates a record in the SchedulerCheckin table.
        /// </summary>
        public bool Update(SchedulerCheckinEntity obj)
        {
            try
            {
                var p = Param(obj, "edit");                
                var res = unitOfWork.ProcedureExecute("Sp_SchedulerCheckin_Update", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Deletes a record from the SchedulerCheckin table by its primary key.
        /// </summary>
        public bool Delete(int id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);
                var res = unitOfWork.ProcedureExecute("Sp_SchedulerCheckin_Delete", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }       

        /// <summary>
        /// Selects a single record from the SchedulerCheckin table.
        /// </summary>
        public SchedulerCheckinEntity ViewDetail(int id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);
                var data = unitOfWork.Procedure<SchedulerCheckinEntity>("Sp_SchedulerCheckin_ViewDetail", p).SingleOrDefault();
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// Selects all records from the SchedulerCheckin table.
        /// </summary>
        public List<SchedulerCheckinEntity> ListAll()
        {
            try
            {
                var data = unitOfWork.Procedure<SchedulerCheckinEntity>("Sp_SchedulerCheckin_ListAll");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public List<SchedulerCheckinEntity> ListAllPaging(string keySearch, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@KeySearch", keySearch);
                p.Add("@pageIndex", pageIndex);
                p.Add("@pageSize", pageSize);
                p.Add("@sortColumn", sortColumn);
                p.Add("@sortDesc", sortDesc);
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<SchedulerCheckinEntity>("Sp_SchedulerCheckin_ListAllPaging", p);
                totalRow = p.Get<int>("@totalRow");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public List<SchedulerCheckinEntity> GetListScheduleCheckinByUserId(int userId, DateTime startDate, DateTime endDate)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@AccountId", userId);               
                p.Add("@StartDate", startDate);
                p.Add("@EndDate", endDate);                
                var data = unitOfWork.Procedure<SchedulerCheckinEntity>("Sp_SchedulerCheckin_GetListScheduleCheckinByUserId", p);                
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Saves a record to the SchedulerCheckin table.
        /// </summary>
        private DynamicParameters Param(SchedulerCheckinEntity obj, string action = "add")
        {
            var p = new DynamicParameters();
            p.Add("@AccountId", obj.AccountId);
            p.Add("@LocaltionId", obj.LocaltionId);
            p.Add("@StartDate", obj.StartDate);
            p.Add("@EndDate", obj.EndDate);
            p.Add("@Description", obj.Description);           
                        
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
