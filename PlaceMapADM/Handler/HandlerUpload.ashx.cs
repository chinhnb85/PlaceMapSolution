using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.IO;

namespace PlaceMapADM.Handler
{
    /// <summary>
    /// Summary description for HandlerUpload
    /// </summary>
    public class HandlerUpload : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {                        
            try
            {
                var folder = "/Upload/";
                if (context.Request.Params["folder"] != null && !string.IsNullOrEmpty(context.Request.Params["folder"]))
                {
                    folder = folder + context.Request.Params["folder"] + "/";
                }
                string dirFullPath = HttpContext.Current.Server.MapPath(folder);
                string[] files;
                int numFiles;
                files = Directory.GetFiles(dirFullPath);
                numFiles = files.Length;
                numFiles = numFiles + 1;
                string fileName = "";

                foreach (string s in context.Request.Files)
                {
                    HttpPostedFile file = context.Request.Files[s];
                    fileName = file.FileName;
                    string fileExtension = file.ContentType;

                    if (!string.IsNullOrEmpty(fileName))
                    {
                        //fileExtension = Path.GetExtension(fileName);
                        //fileName = "MyPHOTO_" + numFiles.ToString() + fileExtension;
                        string pathToSave = dirFullPath + fileName;
                        file.SaveAs(pathToSave);
                    }
                }
                context.Response.ContentType = "text/plain";
                context.Response.Write(folder + fileName);
            }
            catch (Exception ex)
            {
                context.Response.Write("error");
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}