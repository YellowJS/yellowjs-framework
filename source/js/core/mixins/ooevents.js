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
    
    function buildListenerConf(listener, sender) { 
        var listenerConf;
        if (typeof listener == 'object' && listener.sc && listener.fn) {
            listenerConf = {fn:listener.fn, sc: listener.sc};
        } else {
            listenerConf = {fn:listener, sc: global};
        }

        if (sender) {
            listenerConf.se = sender;
        }

        return listenerConf;
    }

    var Events = my.Class({
        listeners : {},
        addListener : function addListener(eventName, listener, sender){
            if (!this.listeners[eventName]){
                this.listeners[eventName] = [];
            }

            var listenerConf = buildListenerConf(listener, sender);

            this.listeners[eventName].push(listenerConf);

        },
        removeListener : function removeListener(eventName, listener, sender) {
            if (this.listeners[eventName]){
                var listenerConf = buildListenerConf(listener, sender);
                var index = this.listeners[eventName].indexOf(listenerConf);
                if (-1 != index) {
                    this.listeners[eventName].splice(index, 1);
                }
            }
        },
        triggerEvent : function triggerEvent(eventName, sender, params){
            if (this.listeners[eventName]){
                for (var i = 0, len = this.listeners[eventName].length; i<len; i++) {
                    var listener = this.listeners[eventName][i];

                    if (undefined === listener.se || listener.se === sender) {
                        listener.fn.apply(listener.sc, params);
                    }
                }
            }
        }
    });
    
    var exports = oo.core.utils.getNS('oo.core.mixins');
    exports.Events = Events;
    
    return oo;
    
})(oo || {});