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
        private const string initVector = "tu89geji340t89u2";

        private const int keysize = 256;

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
        
        public static string Encrypt(string Text, string Key="chinhnb")
        {
            byte[] initVectorBytes = Encoding.UTF8.GetBytes(initVector);
            byte[] plainTextBytes = Encoding.UTF8.GetBytes(Text);
            PasswordDeriveBytes password = new PasswordDeriveBytes(Key, null);
            byte[] keyBytes = password.GetBytes(keysize / 8);
            RijndaelManaged symmetricKey = new RijndaelManaged();
            symmetricKey.Mode = CipherMode.CBC;
            ICryptoTransform encryptor = symmetricKey.CreateEncryptor(keyBytes, initVectorBytes);
            MemoryStream memoryStream = new MemoryStream();
            CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write);
            cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
            cryptoStream.FlushFinalBlock();
            byte[] Encrypted = memoryStream.ToArray();
            memoryStream.Close();
            cryptoStream.Close();
            return Convert.ToBase64String(Encrypted);
        }

        public static string Decrypt(string EncryptedText, string Key="chinhnb")
        {
            byte[] initVectorBytes = Encoding.ASCII.GetBytes(initVector);
            byte[] DeEncryptedText = Convert.FromBase64String(EncryptedText);
            PasswordDeriveBytes password = new PasswordDeriveBytes(Key, null);
            byte[] keyBytes = password.GetBytes(keysize / 8);
            RijndaelManaged symmetricKey = new RijndaelManaged();
            symmetricKey.Mode = CipherMode.CBC;
            ICryptoTransform decryptor = symmetricKey.CreateDecryptor(keyBytes, initVectorBytes);
            MemoryStream memoryStream = new MemoryStream(DeEncryptedText);
            CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read);
            byte[] plainTextBytes = new byte[DeEncryptedText.Length];
            int decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
            memoryStream.Close();
            cryptoStream.Close();
            return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount);
        }
    }
}