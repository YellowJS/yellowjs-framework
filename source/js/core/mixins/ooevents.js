/**
 * Contains class for event management
 *
 * @namespace oo.core.mixins
 * @class Events
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 * @author Claire Sosset <claire.sosset@gmail.com> || @Claire_So
 */
var oo = (function (oo) {
    
    //var listeners = {};
    
    //var Events = {};
    
    var global = this;
    
    function buildListenerConf(listener) {
        var listenerConf;
        if (typeof listener == 'object' && listener.sc && listener.fn) {
            listenerConf = {fn:listener.fn, sc: listener.sc};
        } else {
            listenerConf = {fn:listener, sc: global};
        }

        return listenerConf;
    }

    var Events = my.Class({
        _getListenersArray : function _getListenersArray () {
            if (!this._listeners)
                this._listeners = {};

            return this._listeners;
        },
        addListener : function addListener(eventName, listener){
            var l = this._getListenersArray();
            if (!l[eventName]){
                l[eventName] = [];
            }

            var listenerConf = buildListenerConf(listener);

            l[eventName].push(listenerConf);

        },
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
    
    var exports = oo.getNS('oo.core.mixins');
    exports.Events = Events;
    
    return oo;
    
})(oo || {});