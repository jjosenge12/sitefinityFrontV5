#pragma warning disable 1591
//------------------------------------------------------------------------------
// <auto-generated>
//     Este código fue generado por una herramienta.
//     Versión de runtime:4.0.30319.42000
//
//     Los cambios en este archivo podrían causar un comportamiento incorrecto y se perderán si
//     se vuelve a generar el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace ASP
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Text;
    using System.Web;
    using System.Web.Helpers;
    using System.Web.Mvc;
    using System.Web.Mvc.Ajax;
    using System.Web.Mvc.Html;
    using System.Web.Routing;
    using System.Web.Security;
    using System.Web.UI;
    using System.Web.WebPages;
    
    #line 5 "..\..\MVC\Views\Card\Card.Footer.cshtml"
    using SitefinityWebApp.Mvc;
    
    #line default
    #line hidden
    
    #line 4 "..\..\MVC\Views\Card\Card.Footer.cshtml"
    using Telerik.Sitefinity.Frontend.Mvc.Helpers;
    
    #line default
    #line hidden
    
    #line 3 "..\..\MVC\Views\Card\Card.Footer.cshtml"
    using Telerik.Sitefinity.Modules.Pages;
    
    #line default
    #line hidden
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("RazorGenerator", "2.0.0.0")]
    [System.Web.WebPages.PageVirtualPathAttribute("~/MVC/Views/Card/Card.Footer.cshtml")]
    public partial class _MVC_Views_Card_Card_Footer_cshtml : System.Web.Mvc.WebViewPage<Telerik.Sitefinity.Frontend.Card.Mvc.Models.Card.CardViewModel>
    {
        public _MVC_Views_Card_Card_Footer_cshtml()
        {
        }
        public override void Execute()
        {
WriteLiteral("\r\n");

            
            #line 7 "..\..\MVC\Views\Card\Card.Footer.cshtml"
Write(Html.Script(ScriptRef.JQuery, "top", true));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

            
            #line 8 "..\..\MVC\Views\Card\Card.Footer.cshtml"
Write(Html.Script(Url.WidgetContent("~/Content/scripts/bootstrap.min.js"), "top", true));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

            
            #line 9 "..\..\MVC\Views\Card\Card.Footer.cshtml"
Write(Html.Script(Url.WidgetContent("~/Content/scripts/jquery-ui.min.js"), "top", true));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

            
            #line 10 "..\..\MVC\Views\Card\Card.Footer.cshtml"
Write(Html.Script(Url.WidgetContent("~/Content/scripts/jquery.validate.min.js"), "top", true));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

            
            #line 11 "..\..\MVC\Views\Card\Card.Footer.cshtml"
Write(Html.Script(Url.WidgetContent("~/Content/scripts/toastnotify.js"), "top", true));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

            
            #line 12 "..\..\MVC\Views\Card\Card.Footer.cshtml"
Write(Html.Script(Url.WidgetContent("~/Content/scripts/header.js"), "bottom", true));

            
            #line default
            #line hidden
WriteLiteral("\r\n\r\n");

            
            #line 14 "..\..\MVC\Views\Card\Card.Footer.cshtml"
Write(Html.StyleSheet(Url.Content("~/Content/css/jquery-ui.min.css")));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

            
            #line 15 "..\..\MVC\Views\Card\Card.Footer.cshtml"
Write(Html.StyleSheet(Url.Content("~/Content/css/toastnotify.css")));

            
            #line default
            #line hidden
WriteLiteral("\r\n");

            
            #line 16 "..\..\MVC\Views\Card\Card.Footer.cshtml"
Write(Html.StyleSheet(Url.Content("~/Content/css/styles.css")));

            
            #line default
            #line hidden
WriteLiteral("\r\n\r\n\r\n<div");

WriteLiteral(" class=\"footer\"");

WriteLiteral(">\r\n    <div");

WriteLiteral(" class=\"customRow newsletter\"");

WriteLiteral(">\r\n        <div");

WriteLiteral(" class=\"col-12 col-lg-4 mb-4\"");

WriteLiteral(">\r\n            <span");

WriteLiteral(" class=\"newsletterTitle\"");

WriteLiteral(">Recibe contenido exclusivo y nuestras &uacute;ltimas noticias.</span>\r\n         " +
"   <br /><span");

WriteLiteral(" class=\"newsletterTitle\"");

WriteLiteral(">Suscr&iacute;bete a nuestro newsletter.</span>\r\n        </div>\r\n        <div");

WriteLiteral(" class=\"col-12 col-lg-4 mb-4\"");

WriteLiteral(">\r\n            <div");

WriteLiteral(" class=\"newsletterEmail\"");

WriteLiteral(">Correo electr&oacute;nico</div>\r\n            <div");

WriteLiteral(" class=\"sf-form-container\"");

WriteLiteral(" data-id=\"newsletter-form\"");

WriteLiteral(">\r\n                <input");

WriteLiteral(" id=\"nl-email\"");

WriteLiteral(" name=\"nl-email\"");

WriteLiteral(" class=\"form-control text-small\"");

WriteLiteral(" type=\"email\"");

WriteLiteral(" placeholder=\"Ingrese su correo electrónico\"");

WriteLiteral(" required=\"\"");

WriteLiteral(" />\r\n            </div>\r\n            <div");

WriteLiteral(" class=\"termsCheckbox\"");

WriteLiteral(">\r\n                <input");

WriteLiteral(" id=\"termsCheckbox\"");

WriteLiteral(" type=\"checkbox\"");

WriteLiteral(" /><span>\r\n                    <span>Acepto los&nbsp;</span>\r\n                   " +
" <span");

WriteLiteral(" id=\"newsletterTerms\"");

WriteLiteral(" class=\"cursor-pointer color-red\"");

WriteLiteral(">T&eacute;rminos de servicio de TFS</span>\r\n                </span>\r\n            " +
"</div>\r\n        </div>\r\n        <div");

WriteLiteral(" class=\"col-12 col-lg-4 mb-4 justify-content-center d-flex d-lg-block\"");

WriteLiteral(">\r\n            <button");

WriteLiteral(" type=\"button\"");

WriteLiteral("\r\n                    id=\"submit-newsletter\"");

WriteLiteral("\r\n                    class=\"btn btn-primary custom-button text-small g-recaptcha" +
"\"");

WriteLiteral("\r\n                    data-sitekey=\"");

            
            #line 41 "..\..\MVC\Views\Card\Card.Footer.cshtml"
                             Write(System.Configuration.ConfigurationManager.AppSettings["reCaptchaSiteKey"].ToString());

            
            #line default
            #line hidden
WriteLiteral("\"");

WriteLiteral(">\r\n                ENVIAR\r\n            </button>\r\n        </div>\r\n    </div>\r\n   " +
" <hr");

WriteLiteral(" style=\"border-top:1px solid #58595B;\"");

WriteLiteral(" />\r\n    <div");

WriteLiteral(" class=\"customRow\"");

WriteLiteral(">\r\n        <div");

WriteLiteral(" class=\"col-12 col-md-6 col-lg-4\"");

WriteLiteral(">\r\n            <div");

WriteLiteral(" class=\"footerSectionTitle d-none d-md-block\"");

WriteLiteral(">Planes de Financiamiento</div>\r\n            <div");

WriteLiteral(" class=\"footerSectionTitle d-md-none\"");

WriteLiteral(" style=\"cursor:pointer;\"");

WriteLiteral(" id=\"expandPlanes\"");

WriteLiteral(">\r\n                <span");

WriteLiteral(" class=\"material-icons mr-2 pointRight\"");

WriteLiteral(" id=\"planesArrow\"");

WriteLiteral(">chevron_right</span>\r\n                <span>Planes de Financiamiento</span>\r\n   " +
"         </div>\r\n            <ul");

WriteLiteral(" class=\"d-md-block nav-list\"");

WriteLiteral(" style=\"padding:0;display:none;\"");

WriteLiteral(" id=\"listPlanes\"");

WriteLiteral(">\r\n                ");

WriteLiteral("\r\n                <li");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral("><a");

WriteLiteral(" href=\"/nuestros-planes/plan-tradicional\"");

WriteLiteral(">Plan Tradicional</a></li>\r\n                <li");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral("><a");

WriteLiteral(" href=\"/nuestros-planes/plan-balloon\"");

WriteLiteral(">Plan Balloon</a></li>\r\n                <li");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral("><a");

WriteLiteral(" href=\"/nuestros-planes/plan-anualidades\"");

WriteLiteral(">Plan Anualidades</a></li>\r\n                ");

WriteLiteral("\r\n                <li");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral("><a");

WriteLiteral(" href=\"/arrendamientos/arrendamiento-financiero\"");

WriteLiteral(">Arrendamiento Financiero</a></li>\r\n                <li");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral("><a");

WriteLiteral(" href=\"/arrendamientos/arrendamiento-puro\"");

WriteLiteral(">Arrendamiento Puro</a></li>\r\n            </ul>\r\n        </div>\r\n        <div");

WriteLiteral(" class=\"col-12 col-md-6 col-lg-4\"");

WriteLiteral(">\r\n            <div");

WriteLiteral(" class=\"footerSectionTitle d-none d-md-block\"");

WriteLiteral(">Legales</div>\r\n            <div");

WriteLiteral(" class=\"footerSectionTitle d-md-none\"");

WriteLiteral(" style=\"cursor:pointer;\"");

WriteLiteral(" id=\"expandLegales\"");

WriteLiteral(">\r\n                <span");

WriteLiteral(" class=\"material-icons mr-2 pointRight\"");

WriteLiteral(" id=\"legalesArrow\"");

WriteLiteral(">chevron_right</span>\r\n                <span>Legales</span>\r\n            </div>\r\n" +
"            <ul");

WriteLiteral(" class=\"d-md-block nav-list\"");

WriteLiteral(" style=\"padding:0;display:none;\"");

WriteLiteral(" id=\"listLegales\"");

WriteLiteral(">\r\n                <li");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral("><a");

WriteLiteral(" href=\"/legales/aviso-de-privacidad\"");

WriteLiteral(">Aviso de Privacidad</a></li>\r\n                <li");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral("><a");

WriteLiteral(" href=\"/legales/proteccion-de-datos\"");

WriteLiteral(">Pol&iacute;tica de protecci&oacute;n de datos Personales</a></li>\r\n             " +
"   <li");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral("><a");

WriteLiteral(" href=\"/docs/default-source/formato-arco/formato-derechos-arco.pdf\"");

WriteLiteral(" target=\"_blank\"");

WriteLiteral(">Formato ARCO</a></li>\r\n                <li");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral("><a");

WriteLiteral(" class=\"social-network\"");

WriteLiteral(" id=\"terms\"");

WriteLiteral(">T&eacute;rminos y condiciones de uso</a></li>\r\n                <li");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral("><a");

WriteLiteral(" href=\"/legales/estados-financieros\"");

WriteLiteral(">Estados Financieros</a></li>\r\n                <li");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral("><a");

WriteLiteral(" href=\"/legales/informacion-corporativa\"");

WriteLiteral(">Informaci&oacute;n Corporativa</a></li>\r\n                <li");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral("><a");

WriteLiteral(" href=\"/legales/informacion-financiera\"");

WriteLiteral(">Informaci&oacute;n Financiera</a></li>\r\n                <li");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral("><a");

WriteLiteral(" href=\"/legales/politica-de-cookies\"");

WriteLiteral(">Pol&iacute;tica de Cookies</a></li>\r\n            </ul>\r\n        </div>\r\n        " +
"<div");

WriteLiteral(" class=\"col-12 col-lg-4 nav-list\"");

WriteLiteral(">\r\n            <div");

WriteLiteral(" class=\"footerSectionTitle\"");

WriteLiteral(">Toyota Financial Services M&eacute;xico</div>\r\n            <div");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral(">Paseo de Tamarindos No. 400-B Piso 4</div>\r\n            <div");

WriteLiteral(" class=\"footerItem\"");

WriteLiteral(">Bosques de las Lomas, C.P. 05120, Ciudad de M&eacute;xico</div>\r\n            <di" +
"v");

WriteLiteral(" class=\"socialNetworks\"");

WriteLiteral(">\r\n                <img");

WriteLiteral(" id=\"instagram\"");

WriteLiteral(" class=\"social-network\"");

WriteLiteral(" src=\"/images/default-source/tfsm/tfs-networks/instagram.png?sfvrsn=a34d4b81_3\"");

WriteLiteral(" alt=\"\"");

WriteLiteral(" title=\"instagram\"");

WriteLiteral(" data-displaymode=\"Original\"");

WriteLiteral(" sfref=\"[images|OpenAccessDataProvider]dd7065eb-ee84-4144-951a-3d02e8cb523f\"");

WriteLiteral(" />\r\n                <img");

WriteLiteral(" id=\"facebook\"");

WriteLiteral(" class=\"social-network\"");

WriteLiteral(" src=\"/images/default-source/tfsm/tfs-networks/facebook.png?sfvrsn=4059a8c7_3\"");

WriteLiteral(" alt=\"\"");

WriteLiteral(" title=\"facebook\"");

WriteLiteral(" data-displaymode=\"Original\"");

WriteLiteral(" sfref=\"[images|OpenAccessDataProvider]79a089ca-cb65-4679-89d6-fd1f073388bb\"");

WriteLiteral(" />\r\n                <img");

WriteLiteral(" id=\"linkedin\"");

WriteLiteral(" class=\"social-network\"");

WriteLiteral(" src=\"/images/default-source/tfsm/tfs-networks/linkedin.png?sfvrsn=90ce8255_3\"");

WriteLiteral(" alt=\"\"");

WriteLiteral(" title=\"linkedin\"");

WriteLiteral(" data-displaymode=\"Original\"");

WriteLiteral(" sfref=\"[images|OpenAccessDataProvider]86307131-bff4-4dcc-9a3a-6383c0a9660b\"");

WriteLiteral(" />\r\n                <img");

WriteLiteral(" id=\"youtube\"");

WriteLiteral(" class=\"social-network\"");

WriteLiteral(" src=\"/images/default-source/tfsm/tfs-networks/youtube.png?sfvrsn=32519c0d_3\"");

WriteLiteral(" alt=\"\"");

WriteLiteral(" title=\"youtube\"");

WriteLiteral(" data-displaymode=\"Original\"");

WriteLiteral(" sfref=\"[images|OpenAccessDataProvider]e268ac3c-6b0a-4116-9bd3-e2df6e951265\"");

WriteLiteral(" />\r\n                <img");

WriteLiteral(" src=\"Item with ID: &#39;bdce3056-b1de-484b-9913-ce19d601e0cb&#39; was not found!" +
"\"");

WriteLiteral(" alt=\"\"");

WriteLiteral(" title=\"facebook\"");

WriteLiteral(" data-displaymode=\"Original\"");

WriteLiteral(" sfref=\"[images|OpenAccessDataProvider]bdce3056-b1de-484b-9913-ce19d601e0cb\"");

WriteLiteral(" />\r\n                <img");

WriteLiteral(" src=\"Item with ID: &#39;f3917a32-18bd-4bb6-a275-82435609fc6a&#39; was not found!" +
"\"");

WriteLiteral(@"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      alt=""""");

WriteLiteral(" title=\"linkedin\"");

WriteLiteral(" data-displaymode=\"Original\"");

WriteLiteral(" sfref=\"[images|OpenAccessDataProvider]f3917a32-18bd-4bb6-a275-82435609fc6a\"");

WriteLiteral(" /><img");

WriteLiteral(" src=\"Item with ID: &#39;48356baa-ce0b-442d-aacd-134b81bd293f&#39; was not found!" +
"\"");

WriteLiteral(" alt=\"\"");

WriteLiteral(" title=\"youtube\"");

WriteLiteral(@"
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             data-displaymode=""Original""");

WriteLiteral(" sfref=\"[images|OpenAccessDataProvider]48356baa-ce0b-442d-aacd-134b81bd293f\"");

WriteLiteral(" />\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>");

        }
    }
}
#pragma warning restore 1591
