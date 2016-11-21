using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace PlaceMapADM.Code
{
    public class Common
    {
        public static string ConvertTextToUrl(string text)
        {
            try
            {
                for (int i = 32; i < 48; i++)
                {
                    text = text.Replace(((char)i).ToString(), " ");
                }

                text = text.Replace(".", "-");

                text = text.Replace(" ", "-");

                text = text.Replace(",", "-");

                text = text.Replace(";", "-");

                text = text.Replace(":", "-");                

                text = text.Replace("---", "-").Replace("--", "-");

                Regex regex = new Regex("\\p{IsCombiningDiacriticalMarks}+");
                string temp = text.Normalize(NormalizationForm.FormD);
                return regex.Replace(temp, string.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');                
            }
            catch { return string.Empty; }
        }
    }
}