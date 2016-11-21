using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using LibCore.Data;
using LibCore.Helper.Logging;
using ModelCMS.Base;

namespace ModelCMS.Category
{
    public class IplCategory : BaseIpl<ADOProvider>, ICategory
    {
        #region Methods

        /// <summary>
        /// Saves a record to the Category table.
        /// </summary>
        public long Insert(CategoryEntity obj)
        {
            long res;            
            try
            {
                var p = Param(obj);
                var flag = unitOfWork.ProcedureExecute("Sp_Category_Insert", p);
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
        /// Updates a record in the Category table.
        /// </summary>
        public bool Update(CategoryEntity obj)
        {
            try
            {
                var p = Param(obj, "edit");
                var res = unitOfWork.ProcedureExecute("Sp_Category_Update", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Deletes a record from the Category table by its primary key.
        /// </summary>
        public bool Delete(long iD)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", iD);               
                var res = unitOfWork.ProcedureExecute("Sp_Category_Delete", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }
        
        /// <summary>
        /// Selects a single record from the Category table.
        /// </summary>
        public CategoryEntity ViewDetail(string id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);
                var data = unitOfWork.Procedure<CategoryEntity>("Sp_Category_ViewDetail", p).SingleOrDefault();
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return null;
            }
        }
        
        /// <summary>
        /// Selects all records from the Category table.
        /// </summary>
        public List<CategoryEntity> ListAll()
        {
            try
            {
                var data = unitOfWork.Procedure<CategoryEntity>("Sp_Category_ListAll");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Selects all records from the Category table.
        /// </summary>
        public List<CategoryEntity> ListAllPaging(CategoryEntity CategoryInfo, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();                        
                p.Add("@pageIndex", pageIndex);
                p.Add("@pageSize", pageSize);                
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<CategoryEntity>("Sp_Category_ListAllPaging", p);
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
        /// Saves a record to the Category table.
        /// </summary>
        private DynamicParameters Param(CategoryEntity obj, string action = "add")
        {
            var p = new DynamicParameters();
            if (action == "add")
            {
                p.Add("@Name", obj.Name);
                p.Add("@ParentId", obj.ParentId);
                p.Add("@Type", obj.Type);
                p.Add("@Url", obj.Url);
                p.Add("@Position", obj.Position);
                p.Add("@CreatedBy", obj.CreatedBy);
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
