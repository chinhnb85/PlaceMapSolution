using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using LibCore.Data;
using LibCore.Helper.Logging;
using ModelCMS.Base;

namespace ModelCMS.Province
{
    public class IplProvince : BaseIpl<ADOProvider>, IProvince
    {
        #region Methods

        /// <summary>
        /// Saves a record to the Province table.
        /// </summary>
        public long Insert(ProvinceEntity obj)
        {
            long res;            
            try
            {
                var p = Param(obj);
                var flag = unitOfWork.ProcedureExecute("Sp_Province_Insert", p);
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
        /// Updates a record in the Province table.
        /// </summary>
        public bool Update(ProvinceEntity obj)
        {
            try
            {
                var p = Param(obj, "edit");                
                var res = unitOfWork.ProcedureExecute("Sp_Province_Update", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Deletes a record from the Province table by its primary key.
        /// </summary>
        public bool Delete(long id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);                
                var res = unitOfWork.ProcedureExecute("Sp_Province_Delete", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }       

        /// <summary>
        /// Selects a single record from the Province table.
        /// </summary>
        public ProvinceEntity ViewDetail(int id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);
                var data = unitOfWork.Procedure<ProvinceEntity>("Sp_Province_ViewDetail", p).SingleOrDefault();
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return null;
            }
        }

        /// <summary>
        /// Selects all records from the Account table.
        /// </summary>
        public List<ProvinceEntity> ListAll()
        {
            try
            {
                var data = unitOfWork.Procedure<ProvinceEntity>("Sp_Province_ListAll");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public List<ProvinceEntity> ListAllDistrictByProvinceId(int provinceId)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@ProvinceId", provinceId);               
                var data = unitOfWork.Procedure<ProvinceEntity>("Sp_Province_ListAllDistrictByProvinceId", p);                
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Saves a record to the Province table.
        /// </summary>
        private DynamicParameters Param(ProvinceEntity obj, string action = "add")
        {
            var p = new DynamicParameters();
            p.Add("@ProvinceId", obj.ProvinceId);
            p.Add("@Type", obj.Type);
            p.Add("@Name", obj.Name);
            p.Add("@Location", obj.Location);
                        
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
