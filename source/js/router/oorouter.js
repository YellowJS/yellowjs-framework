/**
 * Class providing url routing logic
 * handle management of history API
 *
 * @namespace oo
 * @class Router
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
(function(oo){

    var Router = oo.getNS('oo.router').Router = oo.Class({
        STATIC: {
            POPSTATE: "popstate"
        },
        constructor : function constructor(){
            this._routes = {};
            this._registeredControllers = {};
            this._controllers = {};
            this._baseUrl = '';

            var that = this;

        },
        _usePushState : function _usePushState(){
          return oo.getConfig('pushState');
        },
        addRoutes : function addRoutes(routes){
            if(!routes || (Object.prototype.toString.call( routes ) !== '[object Object]')){
                throw new Error('Routes must exist and must be an object literal');
            }

            for (var prop in routes){
                this.addRoute(prop, routes[prop]);
            }

            return this;
        },
        addRoute : function addRoute(name, props){
            if(!name || !props.hasOwnProperty('url') || !props.hasOwnProperty('controller') || !props.hasOwnProperty('action')){
                throw new Error('A route must have a name and properties "url", "controller" and "action"');
            }

            if(!this.isValidUrl(props.url)){
                throw new Error('The url property must begun by "/"');
            }

            var r = {};
            r[name] = props;

            this._routes = oo.override(this._routes, r);

            delete r[name];
        },
        isValidUrl : function isValidUrl(url){
            return( '/' === url.slice(0,1));
        },
        /*
         * @name : String
         * @cls : oo.router.Controller
         */
        addController : function addController(name, cls){
            if(!name || ('string' !== typeof name)){
                throw new Error('Wrong "name" parameter : Must exist and be a string');
            }

            if('function' !== typeof cls){
                throw new Error('Wrong "cls" parameter : Must be a function');
            }
            var obj = {};
            obj[name] = cls;
            this._controllers = oo.override(this._controllers,obj);
        },
        addControllers : function addControllers(cList){
            if(!cList || (Object.prototype.toString.call( cList ) !== '[object Object]')){
                throw new Error('Wrong parameter : must exist and be an object');
            }

            for(var prop in cList){
                this.addController(prop, cList[prop]);
            }
        },
        init : function init(){
            var that = this, wl = window.location;

            this._extractBaseUrl();

            var callbackMaker = function(){
                var url;
                if (that._usePushState())
                    propName = 'pathname';
                else
                    propName = 'hash';

                return function (event) {
                    that.dispatch(wl[propName]);
                };
            };

            if( this._usePushState() && window.history && window.history.pushState){
                this.hasHistory = true;
                window.addEventListener("popstate", callbackMaker(Router.POPSTATE), false);
            } else {
                window.addEventListener("hashchange", callbackMaker(), false);

                (callbackMaker())();
            }
        },
        load : function load(route){
            var routeFull = this._addBaseUrl(route);
            if( !this._usePushState() || !this.hasHistory){
                window.location.hash = routeFull;
            } else {
                // var stateCount = history
                history.pushState({},"", routeFull);
                this.dispatch(routeFull);
            }
        },
        _cleanUrl: function _cleanUrl(url) {
            var baseUrl = this._getBaseUrl();
            if(this._usePushState()) {
                return 0 === url.indexOf(baseUrl) ? url.substring(baseUrl.length) : url;
            } else {
                return url.slice(1);
            }
        },
        _addBaseUrl: function _addBaseUrl(url) {
            return this._getBaseUrl() + (url.substring(0, 1) === '/' ? '' : '/') + url;
        },
        _getBaseUrl: function _getBaseUrl() {
            return this._baseUrl;
        },
        _extractBaseUrl: function _extractBaseUrl() {
            this._baseUrl = '';
            if(this._usePushState()) {
                var wl = window.location.pathname;
                this._baseUrl = wl.substring(-1, 1) !== '/' ? wl : wl.substring(0, wl.length - 1);
            }
        },
        dispatch: function dispatch (hash) {
            hash = this._cleanUrl(hash);
            this.parseRoute(hash);
            if (this.requestParams) {
                var ctrlClass   = [this.requestParams.controller.charAt(0).toUpperCase(), this.requestParams.controller.substring(1), 'Controller'].join('');
                var actionMethod = [this.requestParams.action, 'Action'].join('');

                var ctrl;


                if ( (typeof this._registeredControllers[ctrlClass] !== 'function') && ("undefined" !== typeof this._controllers[ctrlClass])) {
                    if ('undefined' === typeof this._registeredControllers[ctrlClass]) {
                        this._registeredControllers[ctrlClass] = new this._controllers[ctrlClass]();
                    }
                    ctrl = this._registeredControllers[ctrlClass];

                    if (typeof ctrl[actionMethod] === 'function') {
                        ctrl[actionMethod](this.requestParams.params);
                    }
                }
            }
        },
        parseRoute: function parseRoute (route) {
            var routes = this._routes;
            var routeObject = null;
            
            for(var keyr in routes) {
               var r = routes[keyr];
                if (r.url == route.substring(0, r.url.length)) {
                    routeObject = {
                        controller: r.controller,
                        action    : r.action
                    };
                    route = route.substring(r.url.length);
                }
            }
            
            if ('/' == route.substring(0,1)) {
                route = route.slice(1);
            }
            
            var parts = route.split('/');

            if (!routeObject) {
                routeObject = {
                    controller: parts[0],
                    action    : parts[1]
                };
                
                if (!routeObject.controller) {
                    routeObject.controller = 'index';
                } else {
                    parts.shift();
                }

                if (!routeObject.action || routeObject.action === undefined) {
                    routeObject.action = 'index';
                } else {
                    parts.shift();
               }
            }

            routeObject.params = {};
            while (parts.length) {
                paramName = parts.shift();
                if (paramName) {
                    paramValue = parts.shift();
                    if (paramValue !== undefined) {
                        routeObject.params[paramName] = paramValue;
                    }
                }
            }

            this.requestParams = routeObject;

            return routeObject;
        },
        url: function url (routeName, params) {
            var route = this._routes[routeName];
            if (!route) {
                throw Error('route name doesn\'t exists');
            }
            
            var paramsUrl = '';
            
            for (var paramName in params) {
                paramsUrl = [paramsUrl, '/', paramName, '/', params[paramName]].join('');
            }
            return [route.url, paramsUrl].join('');
        },
        back : function back(){
            history.back();
        }
        
    });

})(yellowjs || {});
