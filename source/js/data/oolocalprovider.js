(function (oo) {
    
    var global = this, ns = oo.getNS('oo.data');
    var LocalProvider = ns.LocalProvider = my.Class(oo.data.Provider, {
        _store: {},
        constructor: function contructor (options) {
            LocalProvider.Super.call(this, options);

            this._store = Lawnchair({name: this._name, record: 'record'});
        },
        save: function save (data, callback) {
            this._store.save(data);

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