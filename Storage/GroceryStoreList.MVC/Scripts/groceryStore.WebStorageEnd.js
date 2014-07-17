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
        var items = [];
        var len = localStorage.length;
        for (var i = 0; i < len; i += 1) {
            var key = localStorage.key(i);
            var item = JSON.parse(localStorage.getItem(key));
            if (item.status !== ns.itemStatus.Delete) {
                items.push(item);
            }
        }
        return items;
    }

    ns.Storage.prototype.getByKey = function (key) {
        return JSON.parse(localStorage.getItem(key));
    }
} (this.ns = this.ns || {}));