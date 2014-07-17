/// <reference path="jquery-1.7.1.js" />
(function (ns) {
    var productIndex = 0;
    var storage;

    function contentLoaded() {
        $('#btnAddProduct').click(function () {
            var product = $('#txtProduct').val();
            var newItem = new ns.GroceryItem(product);

            saveItemLocal(newItem);
            saveItemRemote(newItem);
        });

        storage = new ns.Storage();

        showGroceryList();
        saveRemote();
    }

    // Object to store in the list
    ns.GroceryItem = function (productToBuy) {
        this.ID = 0;
        this.Key = productIndex;
        this.ProductToBuy = productToBuy;
        this.status = ns.itemStatus.Insert;

        productIndex += 1;
    }

    // consts to hold the status of an item
    ns.itemStatus = {
        None: 0,
        Insert: 1,
        Delete: 2
    };

    function saveItemLocal(item) {
        addListItem(item);
        storage.saveItem(item);
        log(item.ProductToBuy + ' was saved locally');
    }

    function deleteItemLocal(key, id) {
        storage.removeItem(key);
        log('item ' + id + ' was deleted locally');
    }

    function saveRemote() {
        var items = storage.getAllItems(),
            len = items.length,
            itemsToDelete = [],
            i = 0;

        $(items).each(function () {
            var storedItem = this;
            switch (storedItem.status) {
                case ns.itemStatus.Insert:
                    saveItemRemote(storedItem);
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
            deleteItemLocal(this.Key, this.ID);
            deleteItemRemote(this.ID);
        });
    }

    function saveItemRemote(item) {
        $.post("/home/save", item, function (data) {
            data.status = ns.itemStatus.None;
            storage.saveItem(data);
            log(data.ProductToBuy + ' was saved to the server');
        });
    }

    function deleteItemRemote(id) {
        $.post("/home/delete", { id: id }, function (data) {
            log(data);
        });
    }

    function showGroceryList() {
        var list = storage.getAllItems();

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

    function log(msg) {
        var div = $('<div/>').text(msg);
        $('#log').append(div);
    }

    function clear() {
        $('#log').empty();
        $('#txtProduct').val("");
    }

    function deleteItemFromList(itemKey) {
        var item = storage.getByKey(itemKey);
        var id = item.ID;
        deleteItemLocal(itemKey, id);
        deleteItemRemote(id);
        $('li[data-key=' + itemKey + ']').remove();
    }

    window.addEventListener("DOMContentLoaded", contentLoaded, false);
} (this.ns = this.ns || {}));