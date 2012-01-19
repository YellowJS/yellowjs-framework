(function (oo) {
    
    var global = this, ns = oo.getNS('oo.data');
    var FakeProvider = ns.FakeProvider = my.Class(oo.data.Provider, {
        _data: [{
            'key1': 'value1',
            'key2': 'value2'
        }],
        constructor: function contructor (options) {
            FakeProvider.Super.call(this, options);
        },
        save: function save (data, callback) {
            if (!('key' in data))
                data.key = oo.generateId();

            this._data[data.key] = data.value;

            callback.call(global);
        },
        fetch: function fetch (callback) {
            callback.call(global, this._data);
        }
    });

    oo.data.Provider.register(FakeProvider, 'fake');

})(oo || {});