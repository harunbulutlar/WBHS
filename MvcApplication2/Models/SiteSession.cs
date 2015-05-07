using System.Threading;
using System.Globalization;


namespace MvcApplication2.Models
{
    public class SiteSession
    {
        public static int CurrentUICulture
        {
            get
            {
                if(Thread.CurrentThread.CurrentUICulture.Name == "tr-TR")
                {
                    return 1;
                }
                return 0;
            }
            set
            {
                if(value == 1)
                {
                    Thread.CurrentThread.CurrentUICulture = new CultureInfo("tr-TR");
                }
                else
                {
                    Thread.CurrentThread.CurrentUICulture = CultureInfo.InvariantCulture;
                }
                Thread.CurrentThread.CurrentCulture = Thread.CurrentThread.CurrentUICulture;
            }
        }
    }
}