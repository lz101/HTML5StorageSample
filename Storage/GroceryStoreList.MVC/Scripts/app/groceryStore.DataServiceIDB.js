(function (ns) {

    ns.DataService = function () {
        var logger = new ns.Logger('#log');
        var storage = new ns.Storage();

        function init(callback) {
            storage.init(callback);
        }

        function saveItemLocal(item, callback) {
            storage.saveItem(item, callback);
            logger.log(item.ProductToBuy + ' was saved locally');
        }

        function saveItemRemote(item) {
            $.post("/home/save", item, function (data) {
                data.status = ns.itemStatus.None;
                storage.saveItem(data, function () {
                    logger.log(data.ProductToBuy + ' was saved to the server');
                });
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

        function getAllItems(callback) {
            return storage.getAllItems(callback);
        }

        function getByKey(key, callback) {
            return storage.getByKey(key, callback);
        }

        return {
            init: init,
            saveItemLocal: saveItemLocal,
            saveItemRemote: saveItemRemote,
            deleteItemLocal: deleteItemLocal,
            deleteItemRemote: deleteItemRemote,
            getAllItems: getAllItems,
            getByKey: getByKey
        }
    }

} (this.ns = this.ns || {}));