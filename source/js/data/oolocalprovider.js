(function (oo) {
    
    var global = this, ns = oo.getNS('oo.data');
    var LocalProvider = ns.LocalProvider = oo.Class(oo.data.Provider, {
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

            callback.call(global);
        },
        fetch: function fetch (callback) {
            this._store.all(function (data) {
                callback.call(global, data);
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