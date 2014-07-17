(function (ns) {

    ns.AppCacheUtils = function (statusDivId, onlineCallback) {
        var self = this, 
            statusElmId = statusDivId || "#status";
        this.div = $(statusDivId);
        setAppCacheEvents(self, onlineCallback);
    }

    ns.AppCacheUtils.prototype.isOnLine = function () {
        return navigator.onLine;
    }

    ns.AppCacheUtils.prototype.toggleOnlineDiv = function () {
        var self = this;
        if (self.isOnLine()) {
            self.div.text("Online").removeClass("offline").addClass("online");
        }
        else {
            self.div.text("Offline").removeClass("online").addClass("offline");
        }
    }

    function setAppCacheEvents(self, onlineCallback) {
        if (window.applicationCache) {
            window.applicationCache.onupdateready = function (e) {
                applicationCache.swapCache();
                window.location.reload();
            }

            window.addEventListener("online", function (e) {
                self.toggleOnlineDiv();
                onlineCallback();
            }, false);

            window.addEventListener("offline", function (e) {
                self.toggleOnlineDiv();
            }, false);
        }
    }

} (this.ns = this.ns || {}));