/**
 * Provides utils method
 * via an instance
 *
 * @requires [description]
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var pline, oo;
oo = pline = (function (window) {

    var _globalConfig = {
        templateEngine: 'mustache',
        viewportSelector: 'body',
        pushState : false
    };

    return {
        /**
         * @var {oo.net.Ajax} _ajaxRequestObject instance of oo.net.Ajax class
         */
        _ajaxRequestObject: null,

        /**
         * proxy to the my.Class
         * @see my.Class
         */
        Class: function Class () {
            return my.Class.apply(this, arguments);
        },

        /**
         * use oo.log instead of console.log
         *
         * @param {string} data - the data to log
         *
         * @return void
         */
        log: function log (data) {
            if (window.console && window.console.log) {
                var msg = ('string' !== typeof data && 'toString' in data) ? data.toString() : data;
                console.log(data.toStirng());
            }
        },

        /**
         * use oo.warn instead of console.warn
         *
         * @param {string} data - the data to log
         *
         * @return {void}
         */
        warn: function warn (data) {
            var msg = ('string' !== typeof data && 'toString' in data) ? data.toString() : data;
            if (window.console && window.console.warn) {
                console.warn(msg);
            } else {
                oo.log('/!\\ Warning : ' + msg);
            }
        },

        /**
         * create, if needed, and return a "namespaced object"
         *
         * @todo implement the base parameter
         *
         * @param {string} ns - the namespace name (with dot notation)
         * @param {object} base - the described namesape scope
         * @return {object}
         */
        getNS: function getNS (ns, base) {
            var names = ns.split('.');
            var parent = window;
            for (var i=0, len=names.length; i<len; i++) {
                    if ('object' != typeof(parent[names[i]]) ) {
                            parent[names[i]] = {};
                    }
                    
                    parent = parent[names[i]];
            }
            return parent;
        },

        /**
         * bind a scope to a function
         *
         * @param {function} fn - the function to be scoped
         * @param {object} sopce - the desired scope
         * @return {function}
         */
        createDelegate: function createDelegate (fn, scope) {
            return function () {
                return fn.apply(scope, arguments);
            };
        },

        /**
         * empty function
         * @return {void}
         */
        emptyFn: function emptyFn () { },

        /**
         * returns a unique identifier (by way of Backbone.localStorage.js)
         * @return {string}
         */
        generateId: function generateId (tagName) {
            var S4 = function () {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            };

            return ['id-', S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()].join('');
        },

        /**
         * mix two object in one, the second override the first one
         * @return {object}
         */
        override: function override (obj, ext) {
            for (var prop in ext)
                obj[prop] = ext[prop];

            return obj;
        },

        /**
         * create a controller from the class passed in parameter
         */
        createController: function createController(actions) {
            if(!actions && ( 'object' !== typeof actions)){
                throw new Error('Wrong parameter');
            }

            // force the class contructor to call its parent contrustor
            var Tmp = actions.constructor = function () {
                Tmp.Super.call(this);
            };

            var c = oo.Class(oo.router.Controller, actions);

            return c;
        },

        getRouter: function getRouter() {
            return oo.router.router || ( oo.router.router = new oo.router.Router());
        },

        initViewport: function initViewport(identifier) {
            var ns = this.getNS('oo.view'),
                v = ns.viewport = new ns.Viewport(identifier);
            return v;
        },

        getViewport: function getViewport() {
            var ns = this.getNS('oo.view');
            if (ns.viewport) {
                return ns.viewport;
            } else {
                return this.initViewport();
            }
        },

        createPanel: function createPanel(panel, noRegister) {
            if (!(typeof panel == 'object' && 'id' in panel))
                throw 'Wrong parameter';

            var id = panel.id; delete panel.id;

            // force the class contructor to call its parent contrustor
            var Tmp = panel.constructor = function () {
                Tmp.Super.call(this);
            };
            var p = oo.Class(oo.view.Panel, panel);

            if (noRegister !== true)
                oo.getViewport().register(id, p);

            return p;
        },
        createModel : function createModel(model){
            var m = new oo.data.Model(model);
            oo.data.Model.register(m);
            return m;
        },
        getModel : function getModel(id){
            return oo.data.Model.get(id);
        },
        createElement : function createElement(type, opt){
            return new ( oo.view.Element.get(type))(opt || null);
        },

        /**
         * define values for global configuration
         *
         * @param  {object} opt literal object containing key and associated values
         * @return {void}
         */
        define : function define(opt){
            this.override(_globalConfig, opt);
        },

        /**
         * get the value associated with the given key from the global configuration
         *
         * @param  {string} key the key to match in the global configuration
         * @return {string|number|bool}
         */
        getConfig : function getConfig(key){
            if (key && key in _globalConfig)
                return _globalConfig[key];
            else
                return _globalConfig;
        },

        /**
         * the entry point of your application
         * this method takes as parameter a callback that will be called
         * either when 'phonegapready' event is triggered or if phonegap
         * is not available, when the 'load' event is triggered by the
         * window object
         *
         * @param  {function} fn [description]
         * @return {void}
         */
        bootstrap: function bootstrap (fn) {
            if (typeof fn !== 'function')
                throw "parameter must be a function";

            var _this = this;
            function start () {
                // hide address bar
                window.scroll(0,0);

                // prevent page scrolling
                document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

                fn.call(window, _this);
            }

            if ('PhoneGap' in window && PhoneGap.available)
                document.addEventListener('deviceready', start);
            else
                window.addEventListener('load', start);
        },

        /**
         * provide an easy way to do ajax call
         *
         * @param  {string} url               the target url
         * @param  {string} method            use POST or GET HTTP method
         * @param  {object} params            data to send
         * @param  {function} successCallback callback in case of success
         * @param  {function} errorCallback   callback in case of failure
         * @return {void}
         */
        ajax: function ajax (url, method, params, successCallback, errorCallback) {

            // nicer api
            // if called without argument, it returns an object with
            // get and a post methods that are currying of the current
            // ajax method
            if(0 === arguments.length)
                return {
                    post: function (url, params, successCallback, errorCallback) { oo.ajax(url, 'post', params, successCallback, errorCallback); },
                    get: function (url, params, successCallback, errorCallback) { oo.ajax(url, 'get', params, successCallback, errorCallback); }
                };

            if (null === this._ajaxRequestObject) {
                this._ajaxRequestObject = new oo.core.net.Ajax();
            }

            var req = this._ajaxRequestObject.buildReq(url, method, params, successCallback, errorCallback);
            req.send();

        },
        _convertNodeListToArray : function _convertNodeListToArray(nL){
            return Array.prototype.slice.call(nL, 0);
        }
    };

})(window);
