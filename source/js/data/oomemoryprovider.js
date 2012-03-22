(function (oo) {
    
    var global = this;
    var MemoryProvider = oo.getNS('oo.data').MemoryProvider = oo.Class(oo.data.Provider, {
        _data: {},
        constructor: function contructor (options) {

            MemoryProvider.Super.call(this, options);

            if(options.hasOwnProperty('data')){
                this.setData(options.data);
            }
        },
        save: function save (data, callback) {
            this.setData(data);
            
            if (callback) {
                callback.call(global);
            }
        },
        fetch: function fetch (callback) {
            if (callback && 'success' in callback)
                callback.success.call(global, this._data);
        },
        setData: function setData(data, clearAll){
            if(!data){
                throw new Error('Data missing');
            }

            if (!(data instanceof Array))
                data = [data];

            if (clearAll)
                this.clearAll();

            data.forEach(function (val) {
                this._data[val.key] = val;
            }, this);
        },
        clearAll : function clearAll(){
            this._data = {};
        }
    });

    oo.data.Provider.register(MemoryProvider, 'memory');

})(oo || {});