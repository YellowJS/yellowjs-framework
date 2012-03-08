(function(oo){
    
    var Provider = oo.data.Provider;

    var Model = oo.getNS('oo.data').Model = oo.Class(null, oo.core.mixins.Events,{
        STATIC : {
            AFTER_SAVE : 'AFTER_SAVE',
            AFTER_FETCH : 'AFTER_FETCH'
        },
        _data: null,
        _indexes: {},
        _previouslyFetched: null,
        constructor: function constructor(options){
            if(!options || (!options.hasOwnProperty('name') || !options.hasOwnProperty('provider')) )
                throw "Either property \"name\" or \"provider\" is missing in the options given to the Model constructor";
            this._name = options.name;

            if (options.hasOwnProperty('indexes'))
                this.setIndexes(options.indexes);

            this.setProvider(options.provider);
        },
        setProvider : function setProvider (providerConf) {
            if (providerConf instanceof Provider) {
                this._provider = providerConf;
            } else if (typeof providerConf == 'object') {
                var Cls = oo.data.Provider.get(providerConf.type);
                delete providerConf.type; providerConf.name = this._name;
                this._provider = new Cls(providerConf);
            }
        },
        setIndexes : function setIndexes(indexes) {
            for(var i = 0, len = indexes.length; i < len; i++) {
                this._indexes[indexes[i]] = {};
            }
        },
        _createIndexes : function _createIndexes(data){
            var i, len = data.length, lenj = this._indexes.length;
            
            for(i=0 ; i<len ; i++){
                for (ind in this._indexes){
                    //this._indexes[ind][i] = data[i][ind];
                    this._indexes[ind][data[i][ind]] = i;
                }
            }
            console.log(this._indexes);
        },
        fetch : function fetch(callback) {

            var defaultConf = {
                success: oo.emptyFn,
                params: {}
            };
    
            callback = callback || {};
            if (typeof callback == 'function') {
                callback = {success: callback};
            }

            if (typeof callback != 'object') {
                throw "Model.fetch() : params must be a function or a config object";
            }

            callback = oo.override(defaultConf, callback);


            var self = this,
                cb = function cb(datas){
                    if (datas){
                        
                        self._previouslyFetched = datas;
                        self._createIndexes(datas);
                        

                        // why do the callback have different params than the event
                        if (callback.success){
                            // here it is the raw result
                            callback.success(datas);
                        }
                        // here the result is wrapped into an array
                        self.triggerEvent(Model.AFTER_FETCH, [datas]);
                    }
                };

            this._provider.fetch({success: cb, params: callback.params});
        },
        getData: function getData () {
            return this._previouslyFetched;
        },
        save : function save(datas, callback){
            if(!datas || ( 'object' !== typeof datas )) {
                throw Error("Data parameter must exist and be an object");
            }

            this._provider.save(datas, callback);
            this.triggerEvent(Model.AFTER_SAVE);
        },
        getModelName : function getModelName(){
            return this._name;
        },
        setModelName : function setModelName(name){
            if(!name || "string" !== typeof name){
                throw new Error('Missing name or name is not a string');
            }

            this._name = name;
        },
        clearAll : function clearAll(){
            this._provider.clearAll();
        },
        setData : function setData(data){
            this._provider.setData(data);
        },
        get : function get(key){
            if(undefined === key || (isNaN(key)) || ('string' === typeof(key))){
                throw new Error('Missing key or key is not a number');
            }

            return this._previouslyFetched[this._indexes["key"][key]];
        }
    });
    
})(oo || {});