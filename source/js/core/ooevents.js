/** 
 * Contains class for event management
 * 
 * @namespace oo
 * @class Touch
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function (oo) {
    
    //var listeners = {};
    
    //var Events = {};
    
    var global = this;
    
    var Events = my.Class({
      listeners : {},
      buildListenerConf: function buildListenerConf(listener, sender) { 
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
      },
      addListener : function addListener(eventName, listener, sender){
          console.log(this);
          if (!this.listeners[eventName]){
              this.listeners[eventName] = [];
          }

          var listenerConf = this.buildListenerConf(listener, sender);

          this.listeners[eventName].push(listenerConf);
          
          
          sender.addEventListener(eventName, listener, false);
          
          
      },
      removeListener : function removeListener(eventName, listener, sender) {
          if (this.listeners[eventName]){
              var listenerConf = this.buildListenerConf(listener, sender);

              var index = this.listeners[eventName].indexOf(listenerConf);
              if (-1 != index) {
                  this.listeners[eventName].splice(index, 1);
              }
          }
      },
      triggerEvent : function triggerEvent(eventName, sender, params){
          console.log(this.listeners);
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
    
    
    var exports = oo.core.utils.getNS('oo.core.Mixins');
    exports.Events = Events;
    
    return oo;
    
    
    
    
  /*  
    
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
    return oo; */
    
})(oo || {});