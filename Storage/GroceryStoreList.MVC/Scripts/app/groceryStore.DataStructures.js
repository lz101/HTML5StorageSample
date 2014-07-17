(function (ns) {
    
    // Object to store in the list
    ns.GroceryItem = function (productToBuy, productIndex) {
        this.ID = 0;
        this.Key = productIndex;
        this.ProductToBuy = productToBuy;
        this.status = ns.itemStatus.Insert;        
    }

    // consts to hold the status of an item
    ns.itemStatus = {
        None: 0,
        Insert: 1,
        Delete: 2
    };

} (this.ns = this.ns || {}));