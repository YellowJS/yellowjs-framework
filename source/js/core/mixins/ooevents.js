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
    
    var global = this;
    
    /**
     * @internal create an object to wrap infos about the listener
     * @param  {} listener [description]
     * @return {[type]}          [description]
     */
    function buildListenerConf(listener) {
        var listenerConf;
        if (typeof listener == 'object' && listener.sc && listener.fn) {
            listenerConf = {fn:listener.fn, sc: listener.sc};
        } else {
            listenerConf = {fn:listener, sc: global};
        }

        return listenerConf;
    }

    var Events = oo.getNS('oo.core.mixins').Events = oo.Class({

        /**
         * get a singleton instance of the listeners array
         */
        _getListenersArray : function _getListenersArray () {
            if (!this._listeners)
                this._listeners = {};

            return this._listeners;
        },
        /**
         * register a listener for a given event name
         *
         * @param {string} eventName the name of the evant - in almost all cases use a provided constant
         * @param {function} listener  [description]
         */
        addListener : function addListener(eventName, listener){
            var l = this._getListenersArray();
            if (!l[eventName]){
                l[eventName] = [];
            }

            var listenerConf = buildListenerConf(listener);

            l[eventName].push(listenerConf);

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
            var l = this._getListenersArray();

            if (l[eventName]){
                var listenerConf = buildListenerConf(listener);
                var index = l[eventName].indexOf(listenerConf);
                if (-1 != index) {
                    l[eventName].splice(index, 1);
                }
            }
        },
        /**
         * the folowing signature is deprecated - sender is not taken into account anymore
         * trigerEvent(eventName, sender, params)
         *
         * use this one instead
         * trigerEvent(eventName, params)
         */
        triggerEvent : function triggerEvent(eventName, params){
            // backward compatibility
            if ((typeof params != 'array') && 3 == arguments.length) {
                params = arguments[2];
            }

            var l = this._getListenersArray();

            if (l[eventName]){
                for (var i = 0, len = l[eventName].length; i<len; i++) {
                    var listener = l[eventName][i];

                    listener.fn.apply(listener.sc, params);
                }
            }
        }
    });
        
})(oo || {});