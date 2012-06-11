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
        save: function save (data, config) {
            this.setData(data);
            
            var defaultConf = {
                success: oo.emptyFn
            };

            config = config || {};
            if (typeof config == 'function') {
                config = {success: config};
            }

            var conf = oo.override(defaultConf, config);

            config.success.call(global, data);
        },
        fetch: function fetch (config) {
            var defaultConf = {
                success: oo.emptyFn
            };

            config = config || {};
            if (typeof config == 'function') {
                config = {success: config};
            }

            var conf = oo.override(defaultConf, config);

            conf.success.call(global, this._data);
        },
        get: function get(key, callback) {
            callback.call(global, this._data[key] || null);
        },
        setData: function setData(data, clearAll){
            if(!data){
                throw new Error('Data missing');
            }

            if (!(data instanceof Array))
                data = [data];

            if (clearAll)
                this.clearAll();

            this._data = data;
        },
        clearAll : function clearAll(){
            this._data = {};
        }
    });

    oo.data.Provider.register(MemoryProvider, 'memory');

})(yellowjs || {});