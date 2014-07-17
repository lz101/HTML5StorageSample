(function (ns) {

        var logger = new ns.Logger('#log');
	var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
	var IDBTransaction = { READ_WRITE: "readwrite", READ_ONLY: "readonly" };
	
	var dbName = "GroceryStoreDB";
	var storeName = "GroceryStore";	

	ns.Storage = function () {		     
		this.db = null;
	}

	ns.Storage.prototype.init = function (callback) { 
		var self = this;
		openIndexedDB(self, callback); 
	}

	ns.Storage.prototype.saveItem = function (item, callback) {
		var trans = this.db.transaction(storeName, IDBTransaction.READ_WRITE);
		var store = trans.objectStore(storeName);
		var request = store.put(item);

		trans.oncomplete = function (evt) {
			callback();
		}
				 
		request.onerror = onError;
		request.onsuccess = function (evt) {
			logger.log("item saved to indexedDB");			
		};		
	}

	ns.Storage.prototype.removeItem = function (key) {
		var trans = this.db.transaction(storeName, IDBTransaction.READ_WRITE);
		var store = trans.objectStore(storeName);
		var request = store.delete(key);

		request.onerror = onError;
		request.onsuccess = function() {
			logger.log("item removed from the indexedDB");
		};
	}

	ns.Storage.prototype.getAllItems = function (callback) {
		var trans = this.db.transaction(storeName, IDBTransaction.READ_ONLY);
		var store = trans.objectStore(storeName);
		var items = [];

		trans.oncomplete = function(evt) {  
			callback(items);
		};

		var request = store.openCursor();

		request.onerror = onError;
		request.onsuccess = function(evt) {					
			var cursor = evt.target.result;
			if (cursor) {
				items.push(cursor.value);
				cursor.continue();
			}
		};
	}

	ns.Storage.prototype.getByKey = function (key, callback) {
		var trans = this.db.transaction(storeName, IDBTransaction.READ_ONLY);
		var store = trans.objectStore(storeName);

		var request = store.get(key);

		request.onerror = onError;
		request.onsuccess = function (evt) {
			 callback(evt.target.result);
		};
	}

	function onError(e) {
		logger.log(e);
	}

	function openIndexedDB(self, callback) {
		var request = indexedDB.open(dbName, 1);

		request.onerror = onError;

		request.onsuccess = function () {
			self.db = request.result;
			callback();
		};

		request.onupgradeneeded = function (e) {
			e.currentTarget.result.createObjectStore(storeName, { keyPath: "Key" });
		};
	}

} (this.ns = this.ns || {}));