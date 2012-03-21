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
        /**
         * create a ajax request object
         *
         * @param  {string} url               the target url
         * @param  {string} method            the hhtp method 'get' or 'post'
         * @param  {object} params            parameters to send
         * @param  {function} successCallback callback function in case of success
         * @param  {function} errorCallback   callback function in case of error
         * @return {object}                   an object with only one method "send"
         */
        buildReq: function _buildReq (url, method, params, successCallback, errorCallback) {
            var req = this._getRequest();
            method = method.toUpperCase();

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

            var paramString = this._processParams(params), targetUrl = url;
            if (method == 'GET' && '' !== paramString) {
                if (targetUrl.indexOf('?') === -1)
                    targetUrl += ('?' + paramString);
                else
                    targetUrl += ('&' + paramString);
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

        /**
         * get a native XMLHttpRequest
         *
         * @return {XMLHttpRequest}
         */
        _getRequest: function _getRequest () {
            return new XMLHttpRequest();
        },

        /**
         * converts an object to a string http protocol compliant
         *
         * @param  {object} paramObj a key/value object
         * @return {string}
         */
        _processParams: function _processParams (paramObj) {
            return oo.serialize(paramObj);
        },
        
        /**
         * add the http headers needed to build a proper "post request"
         * @param {[type]} req [description]
         */
        _setPostHeaders: function _setPostHeaders (req) {
            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            // Unsafe header
            // req.setRequestHeader('Connection', 'close');
        }
    });

})(oo);