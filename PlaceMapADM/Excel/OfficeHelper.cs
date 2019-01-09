using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Aron.Sinoai.OfficeHelper;
using LibCore.EF;
using ModelCMS.Localtion;
using ModelCMS.Statistic;

namespace PlaceMapADM.Excel
{
    public class OfficeHelper:IDisposable
    {        
        public static ResponseEntity CreateGeneratedFile(int accountId, int parentId, int provinceId, string keySearch)
        {
            try
            {
                var templateFileName = HttpContext.Current.Server.MapPath(System.Configuration.ConfigurationManager.AppSettings["TEMPLATE_FILE_NAME"]);
                var fileName= System.Configuration.ConfigurationManager.AppSettings["GENERATED_FILE_NAME"] + "export_" + DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day + ".xlsx";
                var generatedFileName = HttpContext.Current.Server.MapPath(fileName);

                using (var helper = new ExcelHelper(templateFileName, generatedFileName))
                {
                    helper.Direction = ExcelHelper.DirectionType.TOP_TO_DOWN;
                    helper.CurrentSheetName = "Sheet1";
                    helper.CurrentPosition = new CellRef("A1");                    
                    helper.InsertRange("header");  
                                     
                    var sample1 = helper.CreateCellRangeTemplate("export", new List<string> {"id","code", "name", "province", "district", "account","lag","lng","email","phone","address","createddate", "representactive","mincheckin","status","view","note" });
                    helper.InsertRange(sample1, GetExportData(accountId, parentId, provinceId, keySearch));
                                        
                    helper.DeleteSheet("Sheet2");

                    return new ResponseEntity { Status = true, Data = fileName };//"http://"+HttpContext.Current.Request.Url.Authority
                }
            }
            catch (Exception ex)
            {                
                return new ResponseEntity { Status = false, Data = ex.Message};
            }
        }

        private static IEnumerable<List<object>> GetExportData(int accountId, int parentId, int provinceId, string keySearch)
        {                     
            var data = new List<List<object>>();
            try
            {
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
                var res = ipl.GetExportData(accountId, parentId, provinceId, keySearch);

                if (res != null && res.Count > 0)
                {
                    data.AddRange(res.Select(item => item.CreatedDate != null ? new List<object>
                    {
                        item.Id,
                        item.Code ?? "",
                        item.Name ?? "",
                        item.ProvinceName ?? "",
                        item.DistrictName ?? "",
                        item.UserName ?? "",
                        item.Lag ?? "",
                        item.Lng ?? "",
                        item.Email ?? "",
                        item.Phone ?? "",
                        item.Address ?? "",
                        item.CreatedDate.Value.ToString("dd/MM/yyyy"),
                        item.RepresentActive ?? "",
                        item.MinCheckin ?? 0,
                        item.StatusName ?? "",
                        item.CountCheckIn ?? 0,
                        ""
                    } : null));
                }
                return data;
            }
            catch(Exception ex)
            {
                return data;
            }            

        }

        #region statistic

        public static ResponseEntity CreateFileStatistic(DateTime startDate, DateTime endDate)
        {
            try
            {
                var templateFileName = HttpContext.Current.Server.MapPath(System.Configuration.ConfigurationManager.AppSettings["TEMPLATE_FILE_NAME_STATISTIC"]);
                var fileName = System.Configuration.ConfigurationManager.AppSettings["GENERATED_FILE_NAME"] + "statistic_" + DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day + ".xlsx";
                var generatedFileName = HttpContext.Current.Server.MapPath(fileName);

                using (var helper = new ExcelHelper(templateFileName, generatedFileName))
                {
                    helper.Direction = ExcelHelper.DirectionType.TOP_TO_DOWN;
                    helper.CurrentSheetName = "Sheet1";
                    helper.CurrentPosition = new CellRef("A1");
                    helper.InsertRange("header");

                    var sample1 = helper.CreateCellRangeTemplate("export", new List<string> { "id", "username", "fullname", "sumall", "sumcheckinmonth", "fullmincheckinmonth" });
                    helper.InsertRange(sample1, GetExportDataStatistic(startDate, endDate));

                    helper.DeleteSheet("Sheet2");

                    return new ResponseEntity { Status = true, Data = fileName };
                }
            }
            catch (Exception ex)
            {
                return new ResponseEntity { Status = false, Data = ex.Message };
            }
        }
        private static IEnumerable<List<object>> GetExportDataStatistic(DateTime startDate, DateTime endDate)
        {
            var data = new List<List<object>>();
            try
            {
                var ipl = SingletonIpl.GetInstance<IplStatistic>();
                var res = ipl.GetExportData(startDate, endDate);

                if (res != null && res.Count > 0)
                {
                    data.AddRange(res.Select(item => new List<object>
                    {
                        item.Id,
                        item.UserName ?? "",
                        item.FullName ?? "",
                        item.SumAll,
                        item.SumCheckInMonth,
                        item.FullMinCheckInMonth                        
                    }));
                }
                return data;
            }
            catch (Exception ex)
            {
                return data;
            }

        }

        #endregion

        #region all account checkin

        public static ResponseEntity CreateFileAccountCheckin(int accountId, DateTime startDate, DateTime endDate)
        {
            try
            {
                var templateFileName = HttpContext.Current.Server.MapPath(System.Configuration.ConfigurationManager.AppSettings["TEMPLATE_FILE_NAME_ACCOUNT_CHECKIN"]);
                var fileName = System.Configuration.ConfigurationManager.AppSettings["GENERATED_FILE_NAME"] + "account_checkin_" + DateTime.Now.Year + DateTime.Now.Month + DateTime.Now.Day + ".xlsx";
                var generatedFileName = HttpContext.Current.Server.MapPath(fileName);

                using (var helper = new ExcelHelper(templateFileName, generatedFileName))
                {
                    helper.Direction = ExcelHelper.DirectionType.TOP_TO_DOWN;
                    helper.CurrentSheetName = "Sheet1";
                    helper.CurrentPosition = new CellRef("A1");
                    helper.InsertRange("header");

                    var sample1 = helper.CreateCellRangeTemplate("export", new List<string> { "stt", "username", "fullname", "name", "image", "phone","address","datetime","code" });
                    helper.InsertRange(sample1, GetExportDataAccountCheckin(accountId, startDate, endDate));

                    helper.DeleteSheet("Sheet2");

                    return new ResponseEntity { Status = true, Data = fileName };
                }
            }
            catch (Exception ex)
            {
                return new ResponseEntity { Status = false, Data = ex.Message };
            }
        }
        private static IEnumerable<List<object>> GetExportDataAccountCheckin(int accountId, DateTime startDate, DateTime endDate)
        {
            var data = new List<List<object>>();
            try
            {
                var ipl = SingletonIpl.GetInstance<IplLocaltion>();
                var res = ipl.GetExportDataAccountCheckin(accountId, startDate, endDate);

                if (res != null && res.Count > 0)
                {
                    data.AddRange(res.Select(item => item.CheckDate != null ? new List<object>
                    {
                        item.Id,
                        item.UserName ?? "",
                        item.DistrictName ?? "",
                        item.Name??"",
                        item.ImageCheckin??"",
                        item.Phone??"",
                        item.Address??"",
                        item.CheckDate.Value.ToString("dd/MM/yyyy"),
                        item.Code??""
                    } : null));
                }
                return data;
            }
            catch (Exception ex)
            {
                return data;
            }

        }

        #endregion

        public void Dispose()
        {            
        }

    }
}