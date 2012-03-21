(function (oo) {
    
    var global = this, ns = oo.getNS('oo.data');
    var AjaxProvider = ns.AjaxProvider = oo.Class(oo.data.Provider, {
        /**
         * an instance of data provider that will be used as cache
         *
         * @private
         * @type {oo.data.Provider}
         */
        _cacheProvider: null,

        /**
         * flag to determine if the cache has been cleared
         *
         * @private
         * @type {bool}
         */
        
        _cacheCleared: true,
        /**
         * the parameters serialized that has been used when the cache has been stored
         *
         * @private
         * @type {String}
         */
        _cachedParameterString: '',

        /**
         * the ajax request target
         *
         * @private
         * @type {String}
         */
        _url: null,
        constructor: function constructor (options) {

            var defaultConf = {
                cacheProvider: 'local'
            };

            var opt = oo.override(defaultConf, options);

            if (!opt.url || typeof opt.url != 'string')
                throw '\'url\' property must be set';

            this._url = opt.url;

            AjaxProvider.Super.call(this, {name: opt.name});

            this._cacheProvider = new (oo.data.Provider.get(opt.cacheProvider || 'local'))({name: 'flavius-cache__' + opt.name});
        },

        /**
         * perform an ajax POST request
         * @todo  add documentation about options for save method of the ajaxprovider
         *
         * @param  {Array} data      data to store
         * @param  {object|function} config if it is a function, it will be used as the success callback else it should be an object with the properties "success", "error", "params"
         * @return {void}
         */
        save: function save (data, config) {
            var method = 'POST';

            var defaultConf = {
                success: oo.emptyFn,
                error: oo.emptyFn
            };

            if (typeof config == 'function') {
                config = {success: config};
            }

            var conf = oo.override(defaultConf, config);

            oo.ajax().post(this._url, data, oo.createDelegate(function () {
                this._clearCache();
                conf.success.call(global);
            }, this), conf.error);
        },

        /**
         * perform an ajax GET request
         * @todo  add documentation about options for fetch method of the ajaxprovider
         *
         * @param  {object|function} config if it is a function, it will be used as the success callback else it should be an object with the properties "success", "error", "params"
         * @return {void}
         */
        fetch: function fetch (config, clearCache) {

            var method = 'GET';

            var defaultConf = {
                success: oo.emptyFn,
                error: oo.emptyFn,
                params: {}
            };

            config = config || {};
            if (typeof config == 'function') {
                config = {success: config};
            }

            var conf = oo.override(defaultConf, config);

            var callback = oo.createDelegate(function (data) {
                this._clearCache();
                this._saveCache( data, oo.serialize(conf.params), function () {
                    conf.success.call(global, data);
                } );
            }, this);

            if (!this._getCache(oo.serialize(conf.params), callback))
                oo.ajax().get(this._url, conf.params, callback, conf.error);

        },

        /**
         * get a particular value by its key property
         *
         * @param  {int|string}   cond key value
         * @param  {function} callback a callback function
         * @return {void}
         */
        get: function get (cond, callback) {
            var that = this;

            if (!this._getCache(null, function () { that._cacheProvider.get(cond, callback); }))
                throw "please perform a fetch before";
        },

        /**
         * get a particular value by its key property
         *
         * @param  {int|string}   cond key value
         * @param  {function} callback a callback function
         * @return {void}
         */
        clearAll: function clearAll () {
            this._clearCache();
        },

        /**
         * clear the cache
         *
         * @return {void}
         */
        _clearCache: function _clearCache() {
            this._cacheProvider.clearAll();
            this._cachedParameterString = '';
            this._cacheCleared = true;
        },

        /**
         * save data to the cache
         *
         * @param  {Array}    data       to be saved
         * @param  {string}   parameters parameters (as string) used to fetch data
         * @param  {function} callback   callback function
         * @return {void}
         */
        _saveCache: function _saveCache(data, parameters, callback) {
            this._cacheProvider.save(data, callback);
            this._cachedParameterString = parameters;
            this._cacheCleared = false;
        },

        /**
         * get the cache return true, if cache is available, false if not
         * @param  {string}   parameterString specify the paramters we would like to use to ensure the cache is still valid
         * @param  {function} callback        callback function
         * @return {bool}
         */
        _getCache: function _getCache(parameterString, callback) {
            if (!this._cacheCleared && (this._cachedParameterString == parameterString || null === parameterString)) {
                this._cacheProvider.fetch(callback);
                return true;
            }
            else
                return false;
        }
    });

    oo.data.Provider.register(AjaxProvider, 'ajax');

})(oo || {});