/**
 * Private class providing utils method
 * via a singleton instance
 *
 * @namespace oo.core
 * @private class
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function (oo) {

    // bootstrap oo apps

    // var root = this;

    // var previousOo = root.oo;

    // var Flavius;
    // Flavius = root.oo = {};

    // Flavius;

    var _globalConfig = {
        templateEngine: 'mustache'
    };

//    var Core = my.Class({
    return {
        /**
         * proxy to the my.Class
         */
        Class: function Class () {
            return my.Class.apply(this, arguments);
        },
        /**
         * use oo.log instead of console.log
         *
         * @param {String} data - the data to log
         *
         * @return void
         */
        log: function log (data) {
            if (window.console && window.console.log) {
                var msg = ('string' !== typeof data && 'toString' in data) ? data.toString() : data;
                console.log(data.toStirng());
            }
        },
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
         * @param {String} ns - the namespace name (with dot notation)
         * @param {Object} base - the described namesape scope
         * @return {Object}
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
         * @param {Function} fn - the function to be scoped
         * @param {Object} sopce - the desired scope
         * @return {Function}
         */
        createDelegate: function createDelegate (fn, scope) {
            return function () {
                return fn.apply(scope, arguments);
            };
        },
        emptyFn: function emptyFn () { },
        /**
         *
         *  returns a unique identifier (by way of Backbone.localStorage.js)
         *
         **/
        generateId: function generateId (tagName) {
            var S4 = function () {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            };

            return ['id-', S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()].join('');
        },

        /**
         * mix two object in one, the second override the first one
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

            var c = my.Class(oo.router.Controller, actions);

            return c;
        },

        getRouter: function getRouter() {
            return oo.router.router || ( oo.router.router = new oo.router.Router());
        },

        getViewport: function getViewport() {
            return oo.view.viewport;
        },

        createPanel: function createPanel(panel) {
            if (!(typeof panel == 'object' && 'id' in panel))
                throw 'Wrong parameter';

            var id = panel.id; delete panel.id;

            // force the class contructor to call its parent contrustor
            var Tmp = panel.constructor = function () {
                Tmp.Super.call(this);
            };
            var p = my.Class(oo.view.Panel, panel);

            oo.getViewport().register(id, p);

            return p;
        },
        createModel : function createModel(model){
            return new oo.data.Model(model);
        },
        createElement : function createElement(type, opt){
            return new ( oo.view.Element.get(type))(opt || null);
        },
        define : function define(opt){
            oo.override(_globalConfig, opt);
        },
        getConfig : function getConfig(key){
            if (key && key in _globalConfig)
                return _globalConfig[key];
            else
                return _globalConfig;
        }
    };
    // });

    // oo.utils.namespace is now deprecated
    // export an instance of Utils class on the right namespace
    // oo = new Core();
    // var ns = oo.getNS('oo.core');
    // ns.utils = oo;

    // return oo;

})(oo || {});