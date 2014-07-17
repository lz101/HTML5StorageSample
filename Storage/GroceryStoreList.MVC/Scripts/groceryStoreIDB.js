/// <reference path="jquery-1.7.1.js" />
(function (ns) {
    var productIndex = 0,
        appCache,
        dataService;

    function contentLoaded() {
        appCache = new ns.AppCacheUtils('#status', saveRemote);
        dataService = new ns.DataService();

        $('#btnAddProduct').click(function () {
            var product = $('#txtProduct').val();
            var newItem = new ns.GroceryItem(product, productIndex);
            productIndex += 1;

            addListItem(newItem);
            dataService.saveItemLocal(newItem, function () {
                if (appCache.isOnLine()) {
                    dataService.saveItemRemote(newItem);
                }
            });
        });

        dataService.init(function () {
            showGroceryList();
            appCache.toggleOnlineDiv();
            if (appCache.isOnLine()) {
                saveRemote();
            }
        });
    }

    function saveRemote() {
        dataService.getAllItems(function (items) {
            var len = items.length,
                itemsToDelete = [];

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
        });
    }

    function deleteItems(itemsToDelete) {
        $(itemsToDelete).each(function () {
            dataService.deleteItemLocal(this.Key, this.ID);
            dataService.deleteItemRemote(this.ID);
        });
    }

    function showGroceryList() {
        dataService.getAllItems(function (list) {
            var ul = $('#ulGroceryList').empty();
            $(list).each(function () {
                addListItem(this);
                if (productIndex < this.Key) {
                    productIndex = this.Key;
                }
            });
            productIndex += 1;
        });
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
        dataService.getByKey(itemKey, function (item) {
            if (appCache.isOnLine()) {
                var id = item.ID;
                dataService.deleteItemLocal(itemKey, id);
                dataService.deleteItemRemote(id);
            }
            else {
                // only set the status to deleted and wait for next time we are connected
                item.status = ns.itemStatus.Delete;
                dataService.saveItemLocal(item, function () { });
            }
            $('li[data-key=' + itemKey + ']').remove();
        });
    }

    window.addEventListener("DOMContentLoaded", contentLoaded, false);
} (this.ns = this.ns || {}));