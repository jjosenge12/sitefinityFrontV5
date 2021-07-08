using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SitefinityWebApp.Mvc.Models.Utils
{
    public class SlideOptions
    {
        public string Text { get; set; }
        public string TextColor { get; set; }
        public string TextSize { get; set; }
        public int HasLink { get; set; }
        public int LinkSrc { get; set; }
        public string Link { get; set; }
        public string SelectedPage { get; set; }
        public string ButtonLabel { get; set; }
        public bool NewTab { get; set; }
    }
}