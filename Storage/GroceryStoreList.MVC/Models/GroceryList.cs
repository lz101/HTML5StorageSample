using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;

namespace GroceryStoreList.MVC.Models
{
  public class GroceryItem
  {
    public int ID { get; set; }
    public string ProductToBuy { get; set; }
    public int Key { get; set; }
  }

  public class GroceryListContext : DbContext
  {
    public GroceryListContext()
      : base("GroceryStoreList")
    {
    }
    
    public DbSet<GroceryItem> GroceryItems { get; set; }
  } 
}