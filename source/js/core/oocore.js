/**
 * Provides utils method
 * via an instance
 *
 * @requires [description]
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var yellowjs = (function (window) {

    var _globalConfig = {
        templateEngine: 'mustache',
        viewportSelector: 'body',
        pushState : false,
        scroll : 'iscroll'
    };

    var _oo = window.oo;
    var oo, _yellowjs, _noConflict = false;

    _yellowjs = oo = {
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
            if (_noConflict && 'oo' == names[0])
                names[0] = 'yellowjs';
            
            for (var i=0, len=names.length; i<len; i++) {
                    if ('object' != typeof(parent[names[i]]) ) {
                            parent[names[i]] = {};
                    }
                    
                    parent = parent[names[i]];
            }
            return parent;
        },

        getLocal: function getLocal(){
            var lang;
            // PhoneGap on Android would always return EN in navigator.*language.
            // Parse userAgent instead
            // Mozilla/5.0 (Linux; U; Android 2.2; de-ch; HTC Desire Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
            if ( navigator && navigator.userAgent &&
                 (lang = navigator.userAgent.match(/android.*\W(\w\w)-(\w\w)\W/i))
            ) {
                lang = lang[1];
            }
            
            if (!lang && navigator) {
                if (navigator.language) {
                    lang = navigator.language;
                } else if (navigator.browserLanguage) {
                    lang = navigator.browserLanguage;
                } else if (navigator.systemLanguage) {
                    lang = navigator.systemLanguage;
                } else if (navigator.userLanguage) {
                    lang = navigator.userLanguage;
                }
                lang = lang.substr(0, 2);
            }
            
            return lang;
        }

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
            var propNames = Object.getOwnPropertyNames(ext);
            propNames.forEach(function(name){
                var desc = Object.getOwnPropertyDescriptor(ext, name);
                Object.defineProperty(obj, name, desc);
            });

            return obj;
        },

        /**
         * create a controller from the class passed in parameter
         */
        createControllerClass: function createControllerClass(identifier, actions) {

            if (1 === arguments.length) {
                actions = identifier;
                identifier = null;
            }

            if(!actions && ( 'object' !== typeof actions)){
                throw new Error('Wrong parameter');
            }

            // force the class contructor to call its parent contrustor
            var Tmp = actions.constructor = function () {
                Tmp.Super.call(this);
            };

            var c = oo.Class(oo.router.Controller, actions);

            if (identifier)
                this.getRouter().addController(identifier, c);

            return c;
        },

        // deprecated - use createControllerClass instead
        createController: function createController() {
            return this.createControllerClass.apply(this, arguments);
        },

        /**
         * make the router singleton instance accessible from anywhere
         * @return {oo.router.Router}
         */
        getRouter: function getRouter() {
            return oo.router.router || ( oo.router.router = new oo.router.Router());
        },

        /**
         * should not be called without a good reason ;)
         * instanciate the singleton viewport's instance
         *
         * @param  {string} identifier css query qelector to define the root node of the viewport
         * @return {oo.view.Viewport}
         */
        initViewport: function initViewport(identifier) {
            var ns = this.getNS('oo.view'),
                v = ns.viewport = new ns.Viewport(identifier);
            return v;
        },
        /**
         * get the singleton instance of the Viewport class
         *
         * @return {oo.view.Viewport}
         */
        getViewport: function getViewport() {
            var ns = this.getNS('oo.view');
            if (ns.viewport) {
                return ns.viewport;
            } else {
                return this.initViewport();
            }
        },

        /**
         * create a panel class and register it into the viewport registry
         * @todo  change the name of this method for a more consistent api - addPanel?
         *
         * @param  {object} panel      a litteral object that describe your panel class
         * @param  {bool} noRegister   disable auto registering into the viewport
         * @return {function}          the class of your panel - should not be used without a good reason ;)
         */
        createPanelClass: function createPanelClass(panel, noRegisterOrConf) {
            if (!(typeof panel == 'object' && 'id' in panel))
                throw 'Wrong parameter';

            var id = panel.id; delete panel.id;

            // force the class contructor to call its parent contrustor
            var Tmp = panel.constructor = function () {
                Tmp.Super.call(this);
            };
            var p = oo.Class(oo.view.Panel, panel);

            if (noRegisterOrConf !== false) {
                noRegisterOrConf || (noRegisterOrConf = {});
                oo.getViewport().register(id, p, noRegisterOrConf.stage || null, noRegisterOrConf.pos || null);
            }
                
            
            return p;
            
        },

        /**
         * @deprecated
         * @see  createPanelClass
         */
        createPanel: function createPanel(panel, noRegister) {
            console.warn('This method is deprecated, use oo.createPanelClass() instead');
            return this.createPanelClass.apply(this, arguments);
        },

        /**
         * create a model object and register it, the return value should not be used directly
         * @todo  add Model's config object documentation
         *
         * @param  {object} model key/value pair object to configure your model
         * @return {oo.data.Model}
         */
        createModel : function createModel(model){
            var m = new oo.data.Model(model);
            oo.data.Model.register(m);
            return m;
        },

        /**
         * get a model instance with ite registration id
         *
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        getModel : function getModel(id){
            return oo.data.Model.get(id);
        },

        /**
         * create any UI element
         *
         * @param  {string} type the type of UI component you want to create
         * @param  {object} opt  key/value pair to configure your UI component
         * @return {oo.view.Element} an instance of the desired UI component class
         */
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

            // workaround to avoid bug when JSON.parse is called with an empty argument
            // decribed here : http://code.google.com/p/android/issues/detail?id=11973
            JSON.originalParse = JSON.parse;

            JSON.parse = function(text){
                if (text) {
                    return JSON.originalParse(text);
                } else {
                    // no longer crashing on null value but just returning null
                    return null;
                }
            };

            if ('PhoneGap' in window && PhoneGap.available)
                document.addEventListener('deviceready', start);
            else
                window.addEventListener('load', start);
        },

        dom: function dom (selector) {
            if (!selector) {
                return oo.view.Dom;
            } else {
                return new oo.view.Dom(selector.toString());
            }
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
                    post: function (url, parameters, successCallback, errorCallback) { oo.ajax(url, 'post', parameters, successCallback, errorCallback); },
                    get: function (url, parameters, successCallback, errorCallback) { oo.ajax(url, 'get', parameters, successCallback, errorCallback); }
                };

            if (null === this._ajaxRequestObject) {
                this._ajaxRequestObject = new oo.core.net.Ajax();
            }

            var req = this._ajaxRequestObject.buildReq(url, method, params, successCallback, errorCallback);
            req.send();

        },
        
        _convertNodeListToArray : function _convertNodeListToArray(nL){
            return Array.prototype.slice.call(nL, 0);
        },

        /**
         * utility method that converts an object to a string (http protocol compliant)
         *
         * @param  {object} paramObj a key/value object
         * @return {string}
         */
        serialize: function _processParams (paramObj) {
            var paramArrayString = [];
            for (var prop in paramObj) {
                paramArrayString.push(prop + '=' + encodeURI( (typeof paramObj[prop] == 'object' ? paramObj[prop].toString() : paramObj[prop]) ));
            }
            return paramArrayString.join('&');
        },

        /**
         * utility method with fallback to test if a given object is an array
         * @param  {[type]}  param [description]
         * @return {Boolean}       [description]
         */
        isArray: function isArray (obj) {
            var _isArray = Array.isArray;
            if (_isArray) {
                return _isArray(obj);
            } else {
                return obj.prototype.toString() === "[object Array]";
            }
        },
        noConflict: function noConflict () {
            window.oo = _oo;

            window.yellowjs = _yellowjs;

            _noConflict = true;
        }

    };

    return (window.oo = _yellowjs);

})(window);
