var oo = (function(oo){

    var registeredControllers = {};

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

    oo.Router = Router
    return oo;

})(oo || {});
