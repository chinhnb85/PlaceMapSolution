using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Aron.Sinoai.OfficeHelper;
using LibCore.EF;
using ModelCMS.Localtion;

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
                        item.Status ?? false,
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

        public void Dispose()
        {            
        }

    }
}