/** 
 * Class providing url routing logic
 * handle management of history API
 * 
 * @namespace oo
 * @class Router
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function(oo){


    var ns = oo.getNS('oo.router');

    var Router = ns.Router= my.Class({
        constructor : function constructor(){
            this._routes = {};
            this._registeredControllers = {};
            this._controllers = {};
        },
        addRoutes : function addRoutes(routes){
            if(!routes || (Object.prototype.toString.call( routes ) !== '[object Object]')){
                throw new Error('Routes must exist and must be an object literal');
            }

            for (var prop in routes){
                this.addRoute(prop, routes[prop]);
            }
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
            var that = this;
            window.addEventListener("hashchange", function(e) {
                that.dispatch(window.location.hash.slice(1));
            }, false);

            this.dispatch(window.location.hash.slice(1));
        },
        load : function load(route){
            window.location.hash = route;
        },
        dispatch: function dispatch (hash) {
            this.parseRoute(hash);
            if (this.requestParams) {
                var ctrlClass   = [this.requestParams.controller.charAt(0).toUpperCase(), this.requestParams.controller.substring(1), 'Controller'].join('');
                var actionMethod = [this.requestParams.action, 'Action'].join('');

                var ctrl;


                if (typeof this._registeredControllers[ctrlClass] !== 'function') {
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
            var routeObject = null, r;
            
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

                if (!routeObject.action || routeObject.action == undefined) {
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
                throw Error('route name doesn’t exists');
            }
            
            var paramsUrl = '';
            
            for (var paramName in params) {
                paramsUrl = [paramsUrl, '/', paramName, '/', params[paramName]].join('');
            }
            return [route.url, paramsUrl].join('');

        }
        
    });
 


    /*var registeredControllers = {};

    var Router = {
        requestParams : {},
        dispatch: function dispatch (hash) {            
            Router.parseRoute(hash);
            if (Router.requestParams) {
                var ctrlClass   = [Router.requestParams.controller.charAt(0).toUpperCase(), Router.requestParams.controller.substring(1), 'Controller'].join('');
                var actionMethod = [Router.requestParams.action, 'Action'].join('');

                var ctrl;

                if (typeof registeredControllers[ctrlClass] !== 'function') {
                    if (undefined === registeredControllers[ctrlClass]) {
                        registeredControllers[ctrlClass] = CONTROLLERS[ctrlClass];
                    }
                    ctrl = registeredControllers[ctrlClass];

                    if (typeof ctrl[actionMethod] === 'function') {
                        return ctrl[actionMethod](Router.requestParams.params);
                    }
                }
            }
        },
        parseRoute: function parseRoute (route) {
            var routes = Router.routes;
            var routeObject = null, r;
            
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

                if (!routeObject.action || routeObject.action == undefined) {
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

            Router.requestParams = routeObject;

            return routeObject;
        },
        url: function url (routeName, params) {
            var route = Router.routes[routeName];
            if (!route) {
                throw Error('route name doesn’t exists');
            }
            
            var paramsUrl = '';
            
            for (var paramName in params) {
                paramsUrl = [paramsUrl, '/', paramName, '/', params[paramName]].join('');
            }
            return [route.url, paramsUrl].join('');

        },
        load : function load(route){
            window.location.hash = route;
        },
        init : function init(callback){ 
            window.addEventListener("hashchange", function(e) {
                Router.dispatch(window.location.hash.slice(1));
            }, false);
            Router.dispatch(window.location.hash.slice(1));
        }
    };

    oo.Router = Router*/
    return oo;

})(oo || {});
