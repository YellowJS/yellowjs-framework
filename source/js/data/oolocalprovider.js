(function (oo) {
    
    var global = this;
    var LocalProvider = oo.getNS('oo.data').LocalProvider = oo.Class(oo.data.Provider, {
        _store: {},
        constructor: function contructor (options) {
            LocalProvider.Super.call(this, options);

            // /!\ give an empty callback is not the best idea i have never had
            this._store = Lawnchair({name: this._name, record: 'record'}, function () {});
        },
        save: function save (data, callback) {
            if (!(data instanceof Array))
                data = [data];

            this._store.batch(data);

            if (callback && 'success' in callback)
                callback.success.call(global, data);
        },
        fetch: function fetch (callback) {
            this._store.all(function (data) {
                if (callback && 'success' in callback)
                    callback.success.call(global, data);
            });
        },
        get: function get (cond, callback) {
            this._store.get(cond, callback);
        },
        clearAll: function clearAll () {
            this._store.nuke();
        }
    });

    oo.data.Provider.register(LocalProvider, 'local');

})(oo || {});