using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using LibCore.Data;
using LibCore.Helper.Logging;
using ModelCMS.Base;

namespace ModelCMS.Product
{
    public class IplProduct : BaseIpl<ADOProvider>, IProduct
    {
        #region Methods

        /// <summary>
        /// Saves a record to the Product table.
        /// </summary>
        public long Insert(ProductEntity obj)
        {
            long res;            
            try
            {
                var p = Param(obj);
                var flag = unitOfWork.ProcedureExecute("Sp_Product_Insert", p);
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
        /// Updates a record in the Product table.
        /// </summary>
        public bool Update(ProductEntity obj)
        {
            try
            {
                var p = Param(obj, "edit");
                var res = unitOfWork.ProcedureExecute("Sp_Product_Update", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Deletes a record from the Product table by its primary key.
        /// </summary>
        public bool Delete(long iD)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", iD);               
                var res = unitOfWork.ProcedureExecute("Sp_Product_Delete", p);
                return res;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }
        
        /// <summary>
        /// Selects a single record from the Product table.
        /// </summary>
        public ProductEntity ViewDetail(string id)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@Id", id);
                var data = unitOfWork.Procedure<ProductEntity>("Sp_Product_ViewDetail", p).SingleOrDefault();
                return data;
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                return null;
            }
        }
        
        /// <summary>
        /// Selects all records from the Product table.
        /// </summary>
        public List<ProductEntity> ListAll()
        {
            try
            {
                var data = unitOfWork.Procedure<ProductEntity>("Sp_Product_ListAll");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        /// <summary>
        /// Selects all records from the Product table.
        /// </summary>
        public List<ProductEntity> ListAllPaging(ProductEntity productInfo, int pageIndex, int pageSize, string sortColumn, string sortDesc, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();                        
                p.Add("@pageIndex", pageIndex);
                p.Add("@pageSize", pageSize);                
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<ProductEntity>("Sp_Product_ListAllPaging", p);
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
        /// Saves a record to the Product table.
        /// </summary>
        private DynamicParameters Param(ProductEntity obj, string action = "add")
        {
            var p = new DynamicParameters();
            if (action == "add")
            {                
                p.Add("@CategoryId", obj.CategoryId);
                p.Add("@ManufacturerId", obj.ManufacturerId);
                p.Add("@Name", obj.Name);
                p.Add("@Url", obj.Url);
                p.Add("@Avatar", obj.Avatar);
                p.Add("@Price", obj.Price);
                p.Add("@PriceKm", obj.PriceKm);
                p.Add("@Condition", obj.Condition);
                p.Add("@Weigh", obj.Weigh);
                p.Add("@Origin", obj.Origin);
                p.Add("@Description", obj.Description);
                p.Add("@Video", obj.Video);
                p.Add("@IsHighlights", obj.IsHighlights);
                p.Add("@IsTop", obj.IsTop);
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
