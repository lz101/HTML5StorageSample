(function (ns) {

    ns.DataService = function () {
        var logger = new ns.Logger('#log');
        var storage = new ns.Storage();

        function saveItemLocal(item) {
            storage.saveItem(item);
            logger.log(item.ProductToBuy + ' was saved locally');
        }

        function saveItemRemote(item) {
            $.post("/home/save", item, function (data) {
                data.status = ns.itemStatus.None;
                storage.saveItem(data);
                logger.log(data.ProductToBuy + ' was saved to the server');
            });
        }

        function deleteItemLocal(key, id) {
            storage.removeItem(key);
            logger.log('item ' + id + ' was deleted locally');
        }

        function deleteItemRemote(id) {
            $.post("/home/delete", { id: id }, function (data) {
                logger.log(data);
            });
        }

        function getAllItems() {
            return storage.getAllItems();
        }

        function getByKey(key) {
            return storage.getByKey(key);
        }

        return {
            saveItemLocal: saveItemLocal,
            saveItemRemote: saveItemRemote,
            deleteItemLocal: deleteItemLocal,
            deleteItemRemote: deleteItemRemote,
            getAllItems: getAllItems,
            getByKey: getByKey
        }
    }

} (this.ns = this.ns || {}));