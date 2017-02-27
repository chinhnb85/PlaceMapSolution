using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using LibCore.Data;
using LibCore.Helper.Logging;
using ModelCMS.Base;

namespace ModelCMS.LocaltionStatus
{
    public class IplLocaltionStatus : BaseIpl<ADOProvider>, ILocaltionStatus
    {
        #region Methods

        /// <summary>
        /// Saves a record to the LocaltionStatus table.
        /// </summary>
        public long Insert(LocaltionStatusEntity obj)
        {
            long res;            
            try
            {
                var p = Param(obj);
                var flag = unitOfWork.ProcedureExecute("Sp_LocaltionStatus_Insert", p);
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
        /// Updates a record in the LocaltionStatus table.
        /// </summary>
        public bool Update(LocaltionStatusEntity obj)
        {
            try
            {
                var p = Param(obj, "edit");                
                var res = unitOfWork.ProcedureExecute("Sp_LocaltionStatus_Update", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Deletes a record from the LocaltionStatus table by its primary key.
        /// </summary>
        public bool Delete(long id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);                
                var res = unitOfWork.ProcedureExecute("Sp_LocaltionStatus_Delete", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }       

        /// <summary>
        /// Selects a single record from the LocaltionStatus table.
        /// </summary>
        public LocaltionStatusEntity ViewDetail(int id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);
                var data = unitOfWork.Procedure<LocaltionStatusEntity>("Sp_LocaltionStatus_ViewDetail", p).SingleOrDefault();
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// Selects all records from the LocaltionStatus table.
        /// </summary>
        public List<LocaltionStatusEntity> ListAll()
        {
            try
            {
                var data = unitOfWork.Procedure<LocaltionStatusEntity>("Sp_LocaltionStatus_ListAll");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public List<LocaltionStatusEntity> ListAllPaging(string keySearch, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow)
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
                var data = unitOfWork.Procedure<LocaltionStatusEntity>("Sp_LocaltionStatus_ListAllPaging", p);
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
        /// Saves a record to the LocaltionStatus table.
        /// </summary>
        private DynamicParameters Param(LocaltionStatusEntity obj, string action = "add")
        {
            var p = new DynamicParameters();                        
            p.Add("@Name", obj.Name);           
                        
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
