(function (ns) {
    ns.Logger = function (logDivId) {
        var id = logDivId || '#log';
        var logDiv = $(id);

        function log(msg) {
            var div = $('<div/>').text(msg);
            logDiv.append(div);
        }

        function clear() {
            logDiv.empty();
        }

        return {
            log: log,
            clear: clear
        }
    }
} (this.ns = this.ns || {}));