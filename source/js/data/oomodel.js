(function(oo){
    
    var Provider = oo.data.Provider,
        global = this;

    var _registry = {};

    var Model = oo.getNS('oo.data').Model = oo.Class(null, oo.core.mixins.Events,{
        STATIC : {
            AFTER_SAVE : 'AFTER_SAVE',
            AFTER_FETCH : 'AFTER_FETCH',
            register : function register (model) {
                if (!_registry.hasOwnProperty(model._name))
                    _registry[model._name] = model;
                else
                    throw "Model already exists in registry";
            },
            unregister : function register (id) {
                if (!_registry.hasOwnProperty(id))
                    throw "No model registred with the given id";
                else {
                    _registry[id] = null;
                    delete _registry[id];
                }
            },
            get: function get (id) {
                if (!_registry.hasOwnProperty(id))
                    throw "No model registred with the given id";
                else
                    return _registry[id];
            }
        },
        _data: [],
        _indexes: {},

        constructor: function constructor(options){
            if(!options || (!options.hasOwnProperty('name') || !options.hasOwnProperty('provider')) )
                throw "Either property \"name\" or \"provider\" is missing in the options given to the Model constructor";

            var defaultConf = {
                indexes : ['key']
            };

            var conf = oo.override(defaultConf, options);

            this.setModelName(conf.name);
            this.setProvider(conf.provider);

            this.setIndexes(conf.indexes);
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

        getModelName : function getModelName(){
            return this._name;
        },
        setModelName : function setModelName(name){
            if(!name || "string" !== typeof name){
                throw new Error('Missing name or name is not a string');
            }

            this._name = name;
        },

        setIndexes : function setIndexes(indexes) {
            indexes.forEach(function (item) {
                this._indexes[item] = {};
            }, this);
            this._buildFullIndexes();
        },
        _resetIndexes: function _resetIndexes() {
            var indexedField = Object.getOwnPropertyNames(this._indexes);
            this.setIndexes(indexedField);
        },
        _buildIndex: function _buildIndex(obj) {
            var indexedField = Object.getOwnPropertyNames(this._indexes);
            indexedField.forEach(function (field) {
                if (obj[field]) {
                    if (!this._indexes[field][obj[field]])
                        this._indexes[field][obj[field]] = [];

                    this._indexes[field][obj[field]].push(obj);
                }
            }, this);
        },
        _removeFromIndex: function _removeFromIndex(obj) {
            var indexedField = Object.getOwnPropertyNames(this._indexes);
            indexedField.forEach(function (field) {
                if (obj[field]) {
                    this._indexes[field][obj[field]].slice(this._indexes[field][obj[field]].indexOf(obj), 1);
                    if (0 === this._indexes[field][obj[field]].length) {
                        this._indexes[field].slice(this._indexes[field].indexOf(obj[field]), 1);
                    }
                }
            }, this);
        },

        /**
         * @deprecated
         * @see _buildFullIndexes
         */
        _createIndexes: function _createIndexes() {
            return _buildFullIndexes();
        },
        _buildFullIndexes : function _buildFullIndexes(){
            this._data.forEach(function (item) {
                this._buildIndex(item);
            }, this);
        },


        fetch : function fetch(callback, append) {

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

            var that = this,
                cb = function cb(data){
                    if (data){
                        if (!append)
                            that.clearAll();
                        that.setData(data);
                    }

                    if (callback.success)
                        callback.success.call(that);

                    that.triggerEvent(Model.AFTER_FETCH, that);
                };

            this._provider.fetch({success: cb, params: callback.params});
        },
        save : function save(callback){
            var that = this;
            callback = callback || oo.emptyFn;
            this._provider.save(this._data, function () {
                that.triggerEvent(Model.AFTER_SAVE);
                callback.call(that);
            });
        },

        getData: function getData () {
            return this._data;
        },
        setData : function setData(data){
            data.forEach(this.set, this);
        },
        clearAll : function clearAll(){
            this._data = [];
            this._resetIndexes();
        },


        filterBy: function filterBy(index, key) {
            if(undefined === index || undefined === key)
                throw new Error('Missing params index or key');

            if('string' !== typeof index)
                throw new Error('Param index must be a string');

            var indexes = this._indexes, values = [], val;

            if(indexes.hasOwnProperty(index))
                val = indexes[index][key];
                if (undefined !== val)
                    values = val;
            else
                this._data.forEach(function (item) {
                    if (item.hasOwnProperty(index))
                        if (item[index] == key)
                            values.push(item);
                });

            return values;
        },
        getBy: function getBy(index, key) {
            var values = this.filterBy(index, key);
            if (values.length)
                return values[0];
            else
                return null;
        },
        get: function get(key) {
            //getBy('key', key);
            if(undefined === key || "object" === typeof key){
                throw new Error('Missing key or key must\'t be an object');
            }

            return this.getBy("key",key);
        },
        set: function set(obj) {
            if(undefined === obj || "object" !== typeof obj ){
                throw new Error("Parameter must exist and be an object");
            }

            var row = null;
            if (obj.hasOwnProperty('key')) {
                row = this.get(obj.key);
            }

            if (null === row) {
                this.add(obj);
            } else {
                this._removeFromIndex(row);
                row = oo.override(row, obj);
                this._buildIndex(row);
            }
        },
        add: function add(obj) {
            if (!obj.hasOwnProperty('key')) {
                obj.key = oo.generateId();
            } else if (null !== this.get(obj.key))
                throw "Trying to add a record with an already existing id";

            this._data.push(obj);
            this._buildIndex(obj);
        }
    });
    
})(oo || {});