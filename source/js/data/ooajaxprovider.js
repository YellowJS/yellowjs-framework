(function (oo) {
    
    var global = this, ns = oo.getNS('oo.data');
    var AjaxProvider = ns.AjaxProvider = my.Class(oo.data.Provider, {
        _store: {},
        _cacheProvider: null,
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

            if (opt.cacheProvider) {
                this._cacheProvider = new (oo.data.Provider.get(opt.cacheProvider))({name: 'pline-cache__' + opt.name});
            }
        },
        save: function save (data, config) {
            var method = 'POST';

            var defaultConf = {
                success: oo.emptyFn,
                error: oo.emptyFn
            };

            if (typeof config == 'function') {
                config = {success: config}
            }

            var conf = oo.override(defaultConf, config);

            var req = this._buildReq(this._url, method, data, conf.success, conf.error);
            req.send();

            //this._store.save(data);

            //callback.call(global);
        },
        fetch: function fetch (config) {

            var method = 'GET';

            var defaultConf = {
                success: oo.emptyFn,
                error: oo.emptyFn,
                params: {}
            }

            if (typeof config == 'function') {
                config = {success: config}
            }

            var conf = oo.override(defaultConf, config);

            var req = this._buildReq(this._url, method, config.params, conf.success, conf.error);
            req.send();
                        
            // this._store.all(function (data) {
            //     callback.call(global, data);
            // });
        },

        _buildReq: function _buildReq (url, method, params, successCallback, errorCallback) {
            var req = this._getRequest();

            req.addEventListener('readystatechange', function (e) {
                if (e.target.readyState==4) {
                    if (e.target.status == 200) {
                        
                        // check against response content-type header to determine if is JSON formatted response
                        var str = JSON.parse(e.target.responseText);
                        
                        successCallback.call(global, str);
                    }
                    else
                        errorCallback.call(global);
                }
            });

            var paramString = this._processParams(params);
            if (method == 'GET') {
                url = url + '?' + paramString;
            }

            req.open(method, url);
            if ('POST' == method)
                this._setPostHeaders(req);

            return {
                send: function send(params) {
                    if (method = 'POST') {
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
            req.setRequestHeader('Connection', 'close');
        }     
    });

    oo.data.Provider.register(AjaxProvider, 'ajax');

})(oo || {});