(function (oo) {
    
    var global = this, ns = oo.getNS('oo.data');
    var AjaxProvider = ns.AjaxProvider = oo.Class(oo.data.Provider, {
        _store: {},
        _cacheProvider: null,
        _cacheCleared: true,
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

            this._cacheProvider = new (oo.data.Provider.get(opt.cacheProvider || 'local'))({name: 'pline-cache__' + opt.name});
        },
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

            var req = oo.ajax().post(this._url, data, oo.createDelegate(function (rep) {

                this._cacheProvider.save(data, function () {
                    conf.success.call(global, rep);
                });
            }, this), conf.error);
        },

        /**
         * perform an ajax GET request
         * @param  {object|function} config if it is a function, it will be used as the success callback else it should be an object with the properties "success", "error", "params"
         * @return {void}
         */
        fetch: function fetch (config) {

            var method = 'GET';

            var defaultConf = {
                success: oo.emptyFn,
                error: oo.emptyFn,
                params: {}
            };

            if (typeof config == 'function') {
                config = {success: config};
            }

            var conf = oo.override(defaultConf, config);

            // conf.params.toString = function () {
            //     var str = '';
            //     for (var p in this)
            //         str += p + '=' + this[p];
            //     return str;
            // };

            var req = oo.ajax().get(this._url, conf.params, oo.createDelegate(function (data) {
                var that = this;
                this._cacheProvider.clearAll();
                this._cacheProvider.save(data, function () {
                    that._cacheCleared = false;
                    conf.success.call(global, data);
                });

            }, this), conf.error);
                        
            // this._store.all(function (data) {
            //     callback.call(global, data);
            // });
        },
        get: function get (cond, callback) {
            var that = this;
            if (this._cacheCleared)
                this.fetch(function (data) {
                    that._cacheProvider.get(cond, callback);
                });
            else
                this._cacheProvider.get(cond, callback);
        },
        clearAll: function clearAll () {
            this._cacheCleared = true;
        }
    });

    oo.data.Provider.register(AjaxProvider, 'ajax');

})(oo || {});