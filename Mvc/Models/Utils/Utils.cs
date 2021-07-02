using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SitefinityWebApp.Mvc.Models.Utils
{
    public class Utils
    {
        public static string Normalize(string text)
        {

            string from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";

            List<char> ret = new List<char>();

            for (int i = 0, j = text.Length; i < j; i++)
            {

                char c = text[i];

                int index;

                if ((index = from.IndexOf(c)) != -1)
                {
                    ret.Add(to[index]);
                }
                else
                {
                    ret.Add(c);
                }
            }

            return new string(ret.ToArray()).ToLower();

        }
    }
}