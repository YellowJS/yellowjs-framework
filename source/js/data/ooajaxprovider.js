(function (oo) {
    
    var global = this, ns = oo.getNS('oo.data');
    var AjaxProvider = ns.AjaxProvider = my.Class(oo.data.Provider, {
        _store: {},
        _cacheProvider: null,
        _url: null,
        constructor: function contructor (options) {

            var defaultConf = {
                cacheProvider: 'local'
            };

            var opt = oo.override(defaultConf, options);

            if (!opt.url || typeof opt.url != 'string')
                throw '\'url\' property must be set';

            this._url = opt.url;

            AjaxProvider.Super.call(this, {name: opt.name});

            if (opt.cacheProvider) {
                this._cacheProvider = new (oo.data.Provider.get(opt.cacheProvider))();
            }
        },
        save: function save (data, config) {
            var method = 'POST';

            var defaultConf = {
                success: oo.emptyFn,
                error: oo.emptyFn
            };

            var conf = oo.override(defaultConf, config);

            var req = this._buildReq(this._url, method, data, conf.success, conf.error);
            req.send();

            this._store.save(data);

            callback.call(global);
        },
        fetch: function fetch (config) {
            this._store.all(function (data) {
                callback.call(global, data);
            });
        },

        _buildReq: function _buildReq (url, method, params, successCallback, errorCallback) {
            var req = this._getRequest();

            req.addEventListener('readystatechange', function (e) {
                if (e.target.readyState==4) {
                    if (e.target.status == 200)
                        successCallback.call(global);
                    else
                        errorCallback.call(global);
                }
            });

            if (method == 'GET') {
                url = url + '?' + this._processParams(params);
            }

            req.open(method, url);
            if ('POST' == method)
                this._setPostHeaders(req);

            that = this;
            return new (function () {
                this.send = function send(params) {
                    var paramsString = that._processParams(params);
                    if (method = 'POST')
                        req.send(paramsString);
                    else
                        req.send();
                };
            })

        },
        _getRequest: function _getRequest () {
            return new XMLHttpRequest();
        },
        _setPostHeaders: function _setPostHeaders (req) {
            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            req.setRequestHeader('Connection', 'close');
        },
        _readyStateChange: function _readyStateChange (e) {
            if (e.target.readyState==4)
                
        }       
    });

    oo.data.Provider.register(AjaxProvider, 'ajax');

})(oo || {});