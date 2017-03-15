using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Dapper;
using LibCore.Data;
using LibCore.Helper.Logging;
using ModelCMS.Base;

namespace ModelCMS.Statistic
{
    public class IplStatistic : BaseIpl<ADOProvider>, IStatistic
    {
        #region Methods        

        public List<StatisticEntity> ListStatisticPaging(DateTime startDate, DateTime endDate, int pageIndex, int pageSize, ref int totalRow)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@startDate", startDate);
                p.Add("@endDate", endDate);
                p.Add("@pageIndex", pageIndex);
                p.Add("@pageSize", pageSize);                
                p.Add("@totalRow", dbType: DbType.Int32, direction: ParameterDirection.Output);
                var data = unitOfWork.Procedure<StatisticEntity>("Sp_Statistic_ListStatisticPaging", p);
                totalRow = p.Get<int>("@totalRow");
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        public List<StatisticEntity> GetExportData(DateTime startDate, DateTime endDate)
        {
            try
            {
                var p = new DynamicParameters();
                p.Add("@startDate", startDate);
                p.Add("@endDate", endDate);                
                var data = unitOfWork.Procedure<StatisticEntity>("Sp_Statistic_GetExportData", p);
                return data.ToList();
            }
            catch (Exception ex)
            {
                Logging.PutError(ex.Message, ex);
                throw;
            }
        }

        #endregion
    }
}
