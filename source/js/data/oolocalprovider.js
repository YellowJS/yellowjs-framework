(function (oo) {
    
    var global = this, ns = oo.getNS('oo.data');
    var LocalProvider = ns.LocalProvider = my.Class(oo.data.Provider, {
        _store: {},
        constructor: function contructor (options) {
            LocalProvider.Super.call(this, options);

            // gives an empty callback is not the best idea i have never had
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
        }
    });

    oo.data.Provider.register(LocalProvider, 'local');

})(oo || {});