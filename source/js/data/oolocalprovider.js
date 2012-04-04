(function (oo) {
    
    var global = this;
    var LocalProvider = oo.getNS('oo.data').LocalProvider = oo.Class(oo.data.Provider, {
        _store: {},
        constructor: function contructor (options) {
            LocalProvider.Super.call(this, options);

            // /!\ give an empty callback is probably not the best idea
            this._store = Lawnchair({name: this._name, record: 'record'}, function () {});
        },
        save: function save (data, config) {
            if (!(data instanceof Array))
                data = [data];

            var defaultConf = {
                success: oo.emptyFn
            };

            if (typeof config == 'function') {
                config = {success: config};
            }

            var conf = oo.override(defaultConf, config);

            this._store.batch(data);

            conf.success.call(global, data);
        },
        fetch: function fetch (config) {
            var defaultConf = {
                success: oo.emptyFn
            };

            if (typeof config == 'function') {
                config = {success: config};
            }

            var conf = oo.override(defaultConf, config);

            this._store.all(function (data) {
                conf.success.call(global, data);
            });
        },
        get: function get (cond, callback) {
            this._store.get(cond, callback);
        },
        remove: function remove (key, callback) {
            if (!oo.isArray(key))
                key = [key];

            var that = this, removedCount = 0, toRemoveLength = key.length, cb = function () {
                removedCount++;
                if (removedCount == toRemoveLength)
                    callback();
            };

            key.forEach(function (item) {
                that._store.remove(item, cb);
            });
        },
        clearAll: function clearAll () {
            this._store.nuke();
        }
    });

    oo.data.Provider.register(LocalProvider, 'local');

})(oo || {});