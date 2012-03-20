/**
 * Helper for ajax request
 *
 * @class Ajax
 * @namespace oo.core.net
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 * @author Claire Sosset <claire.sosset@gmail.com> || @Claire_So
 */
(function (oo) {
    
    var global = this;
    
    var Ajax = oo.getNS('oo.core.net').Ajax = oo.Class({
        buildReq: function _buildReq (url, method, params, successCallback, errorCallback) {
            var req = this._getRequest();

            req.addEventListener('readystatechange', function (e) {
                if (e.target.readyState==4) {
                    if (e.target.status == 200) {
                        
                        // @todo : check against response content-type header to determine if is JSON formatted response
                        var str = JSON.parse(e.target.responseText);
                        
                        successCallback.call(global, str);
                    }
                    else
                        errorCallback.call(global);
                }
            });

            var paramString = this._processParams(params), targetUrl = "" + url;
            if (method == 'GET') {
                if (targetUrl.indexOf('?') === -1)
                    targetUrl = url + '?' + paramString;
                else
                    targetUrl = url + '&' + paramString;
            }

            req.open(method, targetUrl);
            if ('POST' == method)
                this._setPostHeaders(req);

            return {
                send: function send() {
                    if ('POST' === method) {
                        req.send(paramString);
                    }
                    else
                        req.send();
                }
            };
        },
        _getRequest: function _getRequest () {
            return new XMLHttpRequest();
        },
        _processParams: function _processParams (paramObj) {
            var paramArrayString = [];
            for (var prop in paramObj) {
                paramArrayString.push(prop + '=' + encodeURI(paramObj[prop]));
            }
            return paramArrayString.join('&');
        },
        _setPostHeaders: function _setPostHeaders (req) {
            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            // Unsafe header
            // req.setRequestHeader('Connection', 'close');
        }
    });

})(oo);