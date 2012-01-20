(function (oo) {
    
    var global = this, ns = oo.getNS('oo.data');
    var Fakeprovider = ns.Fakeprovider = my.Class(oo.data.Provider, {
        _datas: [
            {'title': 'value1'},
            {'title': 'value2'}
        ],
        constructor: function contructor (options) {
            Fakeprovider.Super.call(this, options);
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

    oo.data.Provider.register(Fakeprovider, 'fake');
    
})(oo || {});
