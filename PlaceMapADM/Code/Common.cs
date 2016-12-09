using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace PlaceMapADM.Code
{
    public class Common
    {        
        const double PIx = 3.141592653589793;
        const double RADIO = 6378.16;

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

        public static double Radians(double x)
        {
            return x * PIx / 180;
        }
       
        public static int DistanceBetweenPlaces(
            double lon1,
            double lat1,
            double lon2,
            double lat2)
        {
            double dlon = Radians(lon2 - lon1);
            double dlat = Radians(lat2 - lat1);

            double a = (Math.Sin(dlat / 2) * Math.Sin(dlat / 2)) + Math.Cos(Radians(lat1)) * Math.Cos(Radians(lat2)) * (Math.Sin(dlon / 2) * Math.Sin(dlon / 2));
            double angle = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            //return (angle * RADIO) * 0.62137;//distance in dặm
            //return (angle*RADIO);//distance in km
            return (int)((angle * RADIO) * 1000D);//distance in mét
        }
    }
}