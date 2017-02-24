using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Aron.Sinoai.OfficeHelper;

namespace PlaceMapADM.Excel
{
    public class OfficeHelper:IDisposable
    {
        private const string GENERATED_FILE_NAME = @"C:\CHINHNB\PlaceMapSolution\PlaceMapADM\Excel\Generate\generated.xlsx";
        private const string TEMPLATE_FILE_NAME = @"C:\CHINHNB\PlaceMapSolution\PlaceMapADM\Excel\Template\template.xlsx";

        public static void CreateGeneratedFile()
        {
            try
            {
                using (var helper = new ExcelHelper(TEMPLATE_FILE_NAME, GENERATED_FILE_NAME))
                {
                    helper.Direction = ExcelHelper.DirectionType.TOP_TO_DOWN;

                    helper.CurrentSheetName = "Sheet1";

                    helper.CurrentPosition = new CellRef("A1");

                    //the template xlsx should contains the named range "header"; use the command "insert"/"name".
                    helper.InsertRange("header");

                    //the template xlsx should contains the named range "sample1";
                    //inside this range you should have cells with these values:
                    //<name> , <value> and <comment>, which will be replaced by the values from the GetSample()
                    var sample1 = helper.CreateCellRangeTemplate("sample1",
                        new List<string> {"stt", "ten", "view"});

                    helper.InsertRange(sample1, GetSample());

                    //you could use here other named ranges to insert new cells and call InsertRange as many times you want, 
                    //it will be copied one after another;
                    //even you can change direction or the current cell/sheet before you insert

                    //tipically you put all your "template ranges" (the names) on the same sheet and then you just delete it
                    helper.DeleteSheet("Sheet2");
                }
            }
            catch (Exception ex)
            {
                
            }
        }

        private static IEnumerable<List<object>> GetSample()
        {
            var random = new Random();

            for (int loop = 0; loop < 3000; loop++)
            {
                yield return new List<object> { "test", DateTime.Now.AddDays(random.NextDouble() * 100 - 50), loop};
            }

        }

        public void Dispose()
        {
            
        }

    }
}