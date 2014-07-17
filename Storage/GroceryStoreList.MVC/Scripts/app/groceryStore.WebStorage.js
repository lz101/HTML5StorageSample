(function (ns) {
    ns.Storage = function () {
    }

    ns.Storage.prototype.saveItem = function (item) {
        localStorage.setItem(item.Key, JSON.stringify(item));
    }

    ns.Storage.prototype.removeItem = function (key) {
        localStorage.removeItem(key);       
    }

    ns.Storage.prototype.getAllItems = function () {        
        var items = [],
            len = localStorage.length,
            i = 0,
            key,
            item;

        for (; i < len; i += 1) {
            key = localStorage.key(i);
            item = JSON.parse(localStorage.getItem(key));
            items.push(item);
        }
        return items;
        
    }

    ns.Storage.prototype.getByKey = function (key) {
        return JSON.parse(localStorage.getItem(key)); 
    }
} (this.ns = this.ns || {}));