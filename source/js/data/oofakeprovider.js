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
            this._datas.push(data);
            
            if(callback){
                callback.call(global);
            }
        },
        fetch: function fetch (callback) {
            callback.call(global, this._datas);
        }
    });

    oo.data.Provider.register(FakeProvider, 'fake');

})(oo || {});