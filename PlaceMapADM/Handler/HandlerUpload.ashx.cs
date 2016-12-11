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
                if (!string.IsNullOrEmpty(context.Request.Params["folder"]))
                {
                    folder = folder + context.Request.Params["folder"] + "/";
                }
                var dirFullPath = HttpContext.Current.Server.MapPath(folder);
                var files = Directory.GetFiles(dirFullPath);
                var numFiles = files.Length;
                numFiles = numFiles + 1;
                var fileName = string.Empty;

                foreach (string s in context.Request.Files)
                {
                    HttpPostedFile file = context.Request.Files[s];
                    if (file != null)
                    {
                        fileName = file.FileName;

                        if (!string.IsNullOrEmpty(fileName))
                        {
                            var fileExtension = Path.GetExtension(fileName);
                            fileName = fileName.Replace(fileExtension,"") + "_" + numFiles + fileExtension;
                            var pathToSave = dirFullPath + fileName;
                            file.SaveAs(pathToSave);
                        }
                    }
                }
                context.Response.ContentType = "text/plain";
                context.Response.Write(folder + fileName);
            }
            catch (Exception ex)
            {
                context.Response.Write("error: "+ ex.Message);
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