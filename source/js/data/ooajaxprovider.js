(function (oo) {
    
    var global = this, ns = oo.getNS('oo.data');
    var AjaxProvider = ns.AjaxProvider = oo.Class(oo.data.Provider, {
        _store: {},
        _cacheProvider: null,
        _clearCache: true,
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

            var req = this._buildReq(this._url, method, data, function (rep) {

                this._cacheProvider.save(data, function () {
                    conf.success.call(global, rep);
                });
            }, conf.error);
            req.send();
        },
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

            var req = this._buildReq(this._url, method, conf.params, function (data) {
                var _this = this;
                this._cacheProvider.clearAll();
                this._cacheProvider.save(data, function () {
                    _this._clearCache = false;
                    conf.success.call(global, data);
                });

            }, conf.error);
            req.send();
                        
            // this._store.all(function (data) {
            //     callback.call(global, data);
            // });
        },
        get: function get (cond, callback) {
            var _this = this;
            if (this._clearCache)
                this.fetch(function (data) {
                    _this._cacheProvider.get(cond, callback);
                });
            else
                this._cacheProvider.get(cond, callback);
        },
        clearAll: function clearAll () {
            this._clearCache = true;
        },
        _buildReq: function _buildReq (url, method, params, successCallback, errorCallback) {
            var req = this._getRequest(), _this = this;

            req.addEventListener('readystatechange', function (e) {
                if (e.target.readyState==4) {
                    if (e.target.status == 200) {
                        
                        // @todo : check against response content-type header to determine if is JSON formatted response
                        var str = JSON.parse(e.target.responseText);
                        
                        successCallback.call(_this, str);
                    }
                    else
                        errorCallback.call(_this);
                }
            });

            var paramString = this._processParams(params), targetUrl = "" + url;
            if (method == 'GET') {
                targetUrl = url + '?' + paramString;
            }

            req.open(method, targetUrl);
            if ('POST' == method)
                this._setPostHeaders(req);

            return {
                send: function send(params) {
                    if ('POST' === method) {
                        req.send(paramString);
                    }
                    else
                        req.send();
                }
            };

        },
        _processParams: function _processParams (paramObj) {
            var paramArrayString = [];
            for (var prop in paramObj) {
                paramArrayString.push(prop + '=' + encodeURI(paramObj[prop]));
            }
            return paramArrayString.join('&');
        },
        _getRequest: function _getRequest () {
            return new XMLHttpRequest();
        },
        _setPostHeaders: function _setPostHeaders (req) {
            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            // Unsafe header
            // req.setRequestHeader('Connection', 'close');
        }
    });

    oo.data.Provider.register(AjaxProvider, 'ajax');

})(oo || {});