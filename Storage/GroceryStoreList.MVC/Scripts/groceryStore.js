/// <reference path="jquery-1.7.1.js" />
(function (ns) {
    var productIndex = 0,
        dataService,
        appCache;

    function contentLoaded() {
        appCache = new ns.AppCacheUtils('#status', saveRemote);
        dataService = new ns.DataService();        

        $('#btnAddProduct').click(function () {
            var product = $('#txtProduct').val();
            var newItem = new ns.GroceryItem(product, productIndex);
            productIndex += 1;

            addListItem(newItem);
            dataService.saveItemLocal(newItem);
            if (appCache.isOnLine()) {
                dataService.saveItemRemote(newItem);
            }
        });

        showGroceryList();
        appCache.toggleOnlineDiv();
        if (appCache.isOnLine()) {
            saveRemote();
        }
    }

    function saveRemote() {
        var items = dataService.getAllItems(),
            len = items.length,
            itemsToDelete = [],
            i = 0;

        $(items).each(function () {
            var storedItem = this;
            switch (storedItem.status) {
                case ns.itemStatus.Insert:
                    dataService.saveItemRemote(storedItem);
                    break;
                case ns.itemStatus.Delete:
                    itemsToDelete.push(storedItem);
                    break;
                default:
                    break;
            }
        });

        deleteItems(itemsToDelete);
    }

    function deleteItems(itemsToDelete) {
        $(itemsToDelete).each(function () {
            dataService.deleteItemLocal(this.Key, this.ID);
            dataService.deleteItemRemote(this.ID);
        });
    }

    function showGroceryList() {
        var list = dataService.getAllItems();

        var ul = $('#ulGroceryList').empty();
        $(list).each(function () {
            addListItem(this);
            if (productIndex < this.Key) {
                productIndex = this.Key;
            }
        });
        productIndex += 1;
    }

    function addListItem(item) {
        var itemKey = item.Key;
        var textDiv = $("<div/>").text(item.ProductToBuy);
        var deleteBtn = $("<div/>").addClass("delete").click(function () {
            deleteItemFromList(itemKey);
        });
        $("<li/>").attr("data-key", itemKey).append(textDiv).append(deleteBtn).appendTo($('#ulGroceryList'));
    }

    function deleteItemFromList(itemKey) {
        var item = dataService.getByKey(itemKey);
        if (appCache.isOnLine()) {
            var id = item.ID;
            dataService.deleteItemLocal(itemKey, id);
            dataService.deleteItemRemote(id);
        }
        else {
            // only set the status to deleted and wait for next time we are connected
            item.status = ns.itemStatus.Delete;
            dataService.saveItemLocal(item);
        }
        $('li[data-key=' + itemKey + ']').remove();
    }

    window.addEventListener("DOMContentLoaded", contentLoaded, false);
} (this.ns = this.ns || {}));