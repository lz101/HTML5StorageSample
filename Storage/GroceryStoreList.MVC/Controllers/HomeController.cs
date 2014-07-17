using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using GroceryStoreList.MVC.Models;

namespace GroceryStoreList.MVC.Controllers
{
  public class HomeController : Controller
  {
    public ActionResult Index()
    {
      Response.Cache.SetCacheability(HttpCacheability.NoCache);
      return View();
    }

    public ActionResult Save(GroceryItem item)
    {
      using (var context = new GroceryListContext())
      {
        context.GroceryItems.Add(item);
        context.SaveChanges();
        return Json(item);  
      }
    }

    public ActionResult Delete(int id)
    {
      using (var context = new GroceryListContext())
      {
        var itemToDelete = context.GroceryItems.FirstOrDefault(gi => gi.ID == id);
        if (itemToDelete != null)
        {
          context.GroceryItems.Remove(itemToDelete);
          context.SaveChanges();
          return Json(itemToDelete.ProductToBuy + " was deleted");
        }
        return Json(null);
      }
    }

    public ActionResult Manifest()
    {
      Response.ContentType = "text/cache-manifest";
      Response.ContentEncoding = Encoding.UTF8;
      Response.Cache.SetCacheability(HttpCacheability.NoCache);
      return View();
    }
  }
}
