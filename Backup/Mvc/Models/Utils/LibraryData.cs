using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SitefinityWebApp.Mvc.Models.Utils
{
    public class LibraryData
    {
        public bool HasChildren { get; set; }
        public Guid Id { get; set; }
        public string ParentId { get; set; }
        public string Path { get; set; }
        public Guid RootId { get; set; }
        public string Title { get; set; }
        public string Url { get; set; }
        public bool IsFolder { get; set; }
        public Object[] items { get; set; }
        public int index { get; set; }
        public string Breadcrumb { get; set; }
        public bool selected { get; set; }
        public string TitlesPath { get; set; }
    }
}