using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
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
                            //file.SaveAs(pathToSave); //anh goc

                            //rezize 600x600
                            Image bm = Image.FromStream(file.InputStream);
                            bm = RezizeImage(bm, 600, 600);
                            bm.Save(pathToSave);

                            //thumb 50x50
                            var pathThumbToSave = dirFullPath + "thumb/" + fileName;
                            Image tb = Image.FromStream(file.InputStream);
                            tb = RezizeImage(tb, 50, 50);
                            tb.Save(pathThumbToSave);
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

        private Image RezizeImage(Image img, int maxWidth, int maxHeight)
        {
            if (img.Height < maxHeight && img.Width < maxWidth) return img;
            using (img)
            {
                Double xRatio = (double)img.Width / maxWidth;
                Double yRatio = (double)img.Height / maxHeight;
                Double ratio = Math.Max(xRatio, yRatio);
                int nnx = (int)Math.Floor(img.Width / ratio);
                int nny = (int)Math.Floor(img.Height / ratio);
                Bitmap cpy = new Bitmap(nnx, nny, PixelFormat.Format32bppArgb);
                using (Graphics gr = Graphics.FromImage(cpy))
                {
                    gr.Clear(Color.Transparent);

                    // This is said to give best quality when resizing images
                    gr.InterpolationMode = InterpolationMode.HighQualityBicubic;

                    gr.DrawImage(img,
                        new Rectangle(0, 0, nnx, nny),
                        new Rectangle(0, 0, img.Width, img.Height),
                        GraphicsUnit.Pixel);
                }
                return cpy;
            }

        }
    }
}