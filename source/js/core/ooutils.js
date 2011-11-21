/** 
 * Private class providing utils method
 * via a singleton instance
 * 
 * @namespace oo.core
 * @private class
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
(function () {


    var Utils = my.Class({
        /**
         * use oo.core.utils.log instead of console.log
         *
         * @param {String} data - the data to log
         *
         * @return void
         */
        log: function log (data) {
            if (window.console && window.console.log) {
                console.log(data.toStirng());
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
        bind: function bind (fn, scope) {
            return function () {
                return fn.apply(scope, arguments);
            };
        },
        EmptyFn: function EmptyFn () {}
    });

    // export an instance of Utils class on the right namespace
    var utils = new Utils();
    var ns = utils.getNS('oo.core');
    ns.utils = utils;
    return oo;

})();