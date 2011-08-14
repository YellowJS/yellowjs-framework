var oo = (function (oo) {
    
    var listeners = {};
    
    var Events = {};
    
    var global = this;
    
    var buildListenerConf = function (listener, sender) {
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
    
    Events.addListener = function addListener (eventName, listener, sender) {
        if (!listeners[eventName]){
            listeners[eventName] = [];
        }

        var listenerConf = buildListenerConf(listener, sender);

        listeners[eventName].push(listenerConf);
    };
    
    Events.removeListener = function removeLsitener (eventName, listener, sender) {
        if (listeners[eventName]){
            var listenerConf = buildListenerConf(listener, sender);
            
            var index = listeners[eventName].indexOf(listenerConf);
            if (-1 != index) {
                listeners[eventName].splice(index, 1);
            }
        }
    };
    
    Events.triggerEvent = function addListener (eventName, sender, params) {
        if (listeners[eventName]){
            for (var i = 0, len = listeners[eventName].length; i<len; i++) {
                var listener = listeners[eventName][i];
                
                if (undefined === listener.se || listener.se === sender) {
                    listener.fn.apply(listener.sc, params);
                }
            }
        }
        
    };
        
    oo.Events = Events;
    return oo;
    
})(oo || {});