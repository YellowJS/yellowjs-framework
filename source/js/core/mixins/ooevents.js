/**
 * Contains class for event management
 *
 * @namespace oo.core.mixins
 * @class Events
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 * @author Claire Sosset <claire.sosset@gmail.com> || @Claire_So
 */
(function (oo) {
    
    //var listeners = {};
    
    //var Events = {};
    
    var Events = oo.getNS('oo.core.mixins').Events = oo.Class({

        /**
         * get a singleton instance of the listeners array
         */
        _getListenersArray : function _getListenersArray () {
            if (!this._eventListeners)
                this._eventListeners = {};

            return this._eventListeners;
        },
        /**
         * register a listener for a given event name
         *
         * @param {string} eventName the name of the evant - in almost all cases use a provided constant
         * @param {function} listener  [description]
         */
        addListener : function addListener(eventName, listener){

            if ('function' !== typeof listener)
                throw "listener must be a function";

            var l = this._getListenersArray();
            if (!l[eventName]){
                l[eventName] = [];
            }

            l[eventName].push(listener);

        },
        /**
         * unregister a/all listener(s) attached to a given event name
         * @todo : to debug - objects provided can not be strictly equal because each is instanciated seperately.
         *
         * @param  {string} eventName the name of the event - in almost all cases use a provided constant
         * @param  {function|object} listener  a particular listener to remove, if none provided consider all registered listeners for the event
         * @return {void}
         */
        removeListener : function removeListener(eventName, listener) {

            if ('function' !== typeof listener)
                throw "listener must be a function";

            var l = this._getListenersArray();

            if (l[eventName]){
                var index = l[eventName].indexOf(listener);
                if (-1 != index)
                    l[eventName].splice(index, 1);
            }
        },

        /**
         * triggers an event registered listeners will be called
         * @param  {string} eventName the name of the event to trigger
         * @param  {array}  params    params that will be provided to the listeners
         * @return {void}
         */
        triggerEvent : function triggerEvent(eventName, params){

            var l = this._getListenersArray();

            if (l[eventName]){
                for (var i = 0, len = l[eventName].length; i<len; i++) {
                    var listener = l[eventName][i];

                    listener.apply(this, params);
                }
            }
        }
    });
        
})(yellowjs || {});