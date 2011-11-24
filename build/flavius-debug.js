(function() {

  my = {};

  //============================================================================
  // @method my.Class
  // @params body:Object
  // @params SuperClass:function, ImplementClasses:function..., body:Object
  // @return function
  my.Class = function() {

    var len = arguments.length;
    var body = arguments[len - 1];
    var SuperClass = len > 1 ? arguments[0] : null;
    var hasImplementClasses = len > 2;
    var Class, SuperClassEmpty;

    if (body.constructor === Object) {
      Class = function() {};
    } else {
      Class = body.constructor;
      delete body.constructor;
    }

    if (SuperClass) {
      SuperClassEmpty = function() {};
      SuperClassEmpty.prototype = SuperClass.prototype;
      Class.prototype = new SuperClassEmpty();
      Class.prototype.constructor = Class;
      Class.Super = SuperClass;
      extend(Class, SuperClass, false);
    }

    if (hasImplementClasses)
      for (var i = 1; i < len - 1; i++)
        extend(Class.prototype, arguments[i].prototype, false);    

    extendClass(Class, body);

    return Class;

  };

  //============================================================================
  // @method my.extendClass
  // @params Class:function, extension:Object, ?override:boolean=true
  var extendClass = my.extendClass = function(Class, extension, override) {
    if (extension.STATIC) {
      extend(Class, extension.STATIC, override);
      delete extension.STATIC;
    }
    extend(Class.prototype, extension, override)
  };

  //============================================================================
  var extend = function(obj, extension, override) {
    var prop;
    if (override === false) {
      for (prop in extension)
        if (!(prop in obj))
          obj[prop] = extension[prop];
    } else {
      for (prop in extension)
        obj[prop] = extension[prop];
      if (extension.toString !== Object.prototype.toString)
        obj.toString = extension.toString;
    }
  };

})();/*
  mustache.js — Logic-less templates in JavaScript

  See http://mustache.github.com/ for more info.
*/

var Mustache = function() {
  var Renderer = function() {};

  Renderer.prototype = {
    otag: "{{",
    ctag: "}}",
    pragmas: {},
    buffer: [],
    pragmas_implemented: {
      "IMPLICIT-ITERATOR": true
    },
    context: {},

    render: function(template, context, partials, in_recursion) {
      // reset buffer & set context
      if(!in_recursion) {
        this.context = context;
        this.buffer = []; // TODO: make this non-lazy
      }

      // fail fast
      if(!this.includes("", template)) {
        if(in_recursion) {
          return template;
        } else {
          this.send(template);
          return;
        }
      }

      template = this.render_pragmas(template);
      var html = this.render_section(template, context, partials);
      if(in_recursion) {
        return this.render_tags(html, context, partials, in_recursion);
      }

      this.render_tags(html, context, partials, in_recursion);
    },

    /*
      Sends parsed lines
    */
    send: function(line) {
      if(line != "") {
        this.buffer.push(line);
      }
    },

    /*
      Looks for %PRAGMAS
    */
    render_pragmas: function(template) {
      // no pragmas
      if(!this.includes("%", template)) {
        return template;
      }

      var that = this;
      var regex = new RegExp(this.otag + "%([\\w-]+) ?([\\w]+=[\\w]+)?" +
            this.ctag);
      return template.replace(regex, function(match, pragma, options) {
        if(!that.pragmas_implemented[pragma]) {
          throw({message: 
            "This implementation of mustache doesn't understand the '" +
            pragma + "' pragma"});
        }
        that.pragmas[pragma] = {};
        if(options) {
          var opts = options.split("=");
          that.pragmas[pragma][opts[0]] = opts[1];
        }
        return "";
        // ignore unknown pragmas silently
      });
    },

    /*
      Tries to find a partial in the curent scope and render it
    */
    render_partial: function(name, context, partials) {
      name = this.trim(name);
      if(!partials || partials[name] === undefined) {
        throw({message: "unknown_partial '" + name + "'"});
      }
      if(typeof(context[name]) != "object") {
        return this.render(partials[name], context, partials, true);
      }
      return this.render(partials[name], context[name], partials, true);
    },

    /*
      Renders inverted (^) and normal (#) sections
    */
    render_section: function(template, context, partials) {
      if(!this.includes("#", template) && !this.includes("^", template)) {
        return template;
      }

      var that = this;
      // CSW - Added "+?" so it finds the tighest bound, not the widest
      var regex = new RegExp(this.otag + "(\\^|\\#)\\s*(.+)\\s*" + this.ctag +
              "\n*([\\s\\S]+?)" + this.otag + "\\/\\s*\\2\\s*" + this.ctag +
              "\\s*", "mg");

      // for each {{#foo}}{{/foo}} section do...
      return template.replace(regex, function(match, type, name, content) {
        var value = that.find(name, context);
        if(type == "^") { // inverted section
          if(!value || that.is_array(value) && value.length === 0) {
            // false or empty list, render it
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        } else if(type == "#") { // normal section
          if(that.is_array(value)) { // Enumerable, Let's loop!
            return that.map(value, function(row) {
              return that.render(content, that.create_context(row),
                partials, true);
            }).join("");
          } else if(that.is_object(value)) { // Object, Use it as subcontext!
            return that.render(content, that.create_context(value),
              partials, true);
          } else if(typeof value === "function") {
            // higher order section
            return value.call(context, content, function(text) {
              return that.render(text, context, partials, true);
            });
          } else if(value) { // boolean section
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        }
      });
    },

    /*
      Replace {{foo}} and friends with values from our view
    */
    render_tags: function(template, context, partials, in_recursion) {
      // tit for tat
      var that = this;

      var new_regex = function() {
        return new RegExp(that.otag + "(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?" +
          that.ctag + "+", "g");
      };

      var regex = new_regex();
      var tag_replace_callback = function(match, operator, name) {
        switch(operator) {
        case "!": // ignore comments
          return "";
        case "=": // set new delimiters, rebuild the replace regexp
          that.set_delimiters(name);
          regex = new_regex();
          return "";
        case ">": // render partial
          return that.render_partial(name, context, partials);
        case "{": // the triple mustache is unescaped
          return that.find(name, context);
        default: // escape the value
          return that.escape(that.find(name, context));
        }
      };
      var lines = template.split("\n");
      for(var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(regex, tag_replace_callback, this);
        if(!in_recursion) {
          this.send(lines[i]);
        }
      }

      if(in_recursion) {
        return lines.join("\n");
      }
    },

    set_delimiters: function(delimiters) {
      var dels = delimiters.split(" ");
      this.otag = this.escape_regex(dels[0]);
      this.ctag = this.escape_regex(dels[1]);
    },

    escape_regex: function(text) {
      // thank you Simon Willison
      if(!arguments.callee.sRE) {
        var specials = [
          '/', '.', '*', '+', '?', '|',
          '(', ')', '[', ']', '{', '}', '\\'
        ];
        arguments.callee.sRE = new RegExp(
          '(\\' + specials.join('|\\') + ')', 'g'
        );
      }
      return text.replace(arguments.callee.sRE, '\\$1');
    },

    /*
      find `name` in current `context`. That is find me a value
      from the view object
    */
    find: function(name, context) {
      name = this.trim(name);

      // Checks whether a value is thruthy or false or 0
      function is_kinda_truthy(bool) {
        return bool === false || bool === 0 || bool;
      }

      var value;
      if(is_kinda_truthy(context[name])) {
        value = context[name];
      } else if(is_kinda_truthy(this.context[name])) {
        value = this.context[name];
      }

      if(typeof value === "function") {
        return value.apply(context);
      }
      if(value !== undefined) {
        return value;
      }
      // silently ignore unkown variables
      return "";
    },

    // Utility methods

    /* includes tag */
    includes: function(needle, haystack) {
      return haystack.indexOf(this.otag + needle) != -1;
    },

    /*
      Does away with nasty characters
    */
    escape: function(s) {
      s = String(s === null ? "" : s);
      return s.replace(/&(?!\w+;)|["'<>\\]/g, function(s) {
        switch(s) {
        case "&": return "&amp;";
        case "\\": return "\\\\";
        case '"': return '&quot;';
        case "'": return '&#39;';
        case "<": return "&lt;";
        case ">": return "&gt;";
        default: return s;
        }
      });
    },

    // by @langalex, support for arrays of strings
    create_context: function(_context) {
      if(this.is_object(_context)) {
        return _context;
      } else {
        var iterator = ".";
        if(this.pragmas["IMPLICIT-ITERATOR"]) {
          iterator = this.pragmas["IMPLICIT-ITERATOR"].iterator;
        }
        var ctx = {};
        ctx[iterator] = _context;
        return ctx;
      }
    },

    is_object: function(a) {
      return a && typeof a == "object";
    },

    is_array: function(a) {
      return Object.prototype.toString.call(a) === '[object Array]';
    },

    /*
      Gets rid of leading and trailing whitespace
    */
    trim: function(s) {
      return s.replace(/^\s*|\s*$/g, "");
    },

    /*
      Why, why, why? Because IE. Cry, cry cry.
    */
    map: function(array, fn) {
      if (typeof array.map == "function") {
        return array.map(fn);
      } else {
        var r = [];
        var l = array.length;
        for(var i = 0; i < l; i++) {
          r.push(fn(array[i]));
        }
        return r;
      }
    }
  };

  return({
    name: "mustache.js",
    version: "0.3.1-dev",

    /*
      Turns a template and view into HTML
    */
    to_html: function(template, view, partials, send_fun) {
      var renderer = new Renderer();
      if(send_fun) {
        renderer.send = send_fun;
      }
      renderer.render(template, view, partials);
      if(!send_fun) {
        return renderer.buffer.join("\n");
      }
    }
  });
}();
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
        EmptyFn: function EmptyFn () {
            
        },
        /**
         *
         *  Secure Hash Algorithm (SHA1)
         *  http://www.webtoolkit.info/
         *
         **/
        generateId : function generateId (tagName) {
            msg = [tagName, (new Date).getTime(), Math.random().toString()].join('');

            function rotate_left(n,s) {
                var t4 = ( n<<s ) | (n>>>(32-s));
                return t4;
            };

            function lsb_hex(val) {
                var str="";
                var i;
                var vh;
                var vl;

                for( i=0; i<=6; i+=2 ) {
                    vh = (val>>>(i*4+4))&0x0f;
                    vl = (val>>>(i*4))&0x0f;
                    str += vh.toString(16) + vl.toString(16);
                }
                return str;
            };

            function cvt_hex(val) {
                var str="";
                var i;
                var v;

                for( i=7; i>=0; i-- ) {
                    v = (val>>>(i*4))&0x0f;
                    str += v.toString(16);
                }
                return str;
            };


            function Utf8Encode(string) {
                string = string.replace(/\r\n/g,"\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            };

            var blockstart;
            var i, j;
            var W = new Array(80);
            var H0 = 0x67452301;
            var H1 = 0xEFCDAB89;
            var H2 = 0x98BADCFE;
            var H3 = 0x10325476;
            var H4 = 0xC3D2E1F0;
            var A, B, C, D, E;
            var temp;

            msg = Utf8Encode(msg);

            var msg_len = msg.length;

            var word_array = new Array();
            for( i=0; i<msg_len-3; i+=4 ) {
                j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
                msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
                word_array.push( j );
            }

            switch( msg_len % 4 ) {
                case 0:
                    i = 0x080000000;
                break;
                case 1:
                    i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
                break;

                case 2:
                    i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
                break;

                case 3:
                    i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8    | 0x80;
                break;
            }

            word_array.push( i );

            while( (word_array.length % 16) != 14 ) { word_array.push( 0 ); };

            word_array.push( msg_len>>>29 );
            word_array.push( (msg_len<<3)&0x0ffffffff );


            for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {

                for( i=0; i<16; i++ ) { W[i] = word_array[blockstart+i]; };
                for( i=16; i<=79; i++ ) { W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1) };

                A = H0;
                B = H1;
                C = H2;
                D = H3;
                E = H4;

                for( i= 0; i<=19; i++ ) {
                    temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotate_left(B,30);
                    B = A;
                    A = temp;
                }

                for( i=20; i<=39; i++ ) {
                    temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotate_left(B,30);
                    B = A;
                    A = temp;
                }

                for( i=40; i<=59; i++ ) {
                    temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotate_left(B,30);
                    B = A;
                    A = temp;
                }

                for( i=60; i<=79; i++ ) {
                    temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
                    E = D;
                    D = C;
                    C = rotate_left(B,30);
                    B = A;
                    A = temp;
                }

                H0 = (H0 + A) & 0x0ffffffff;
                H1 = (H1 + B) & 0x0ffffffff;
                H2 = (H2 + C) & 0x0ffffffff;
                H3 = (H3 + D) & 0x0ffffffff;
                H4 = (H4 + E) & 0x0ffffffff;

            }

            var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

            return ['id-', temp.toLowerCase()].join('');
        },
        //convert a Nodelist to an array of elements
        collectionToArray: function collectionToArray(collection)  
        {  
            var ary = [];  
            for(var i=0, len = collection.length; i < len; i++)  
            {  
                ary.push(collection[i]);  
            }  
            return ary;  
        }
    });

    // export an instance of Utils class on the right namespace
    var utils = new Utils();
    var ns = utils.getNS('oo.core');
    ns.utils = utils;
    return oo;

})();/** 
 * Contains class for event management
 * 
 * @namespace oo
 * @class Touch
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
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
    
})(oo || {});/** 
 * Contains static helper for touch management
 * 
 * @namespace oo
 * @class Touch
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function (oo) {

    var hasTouch = 'ontouchstart' in window ? true : false;
    var getPosition = function getPosition (e, index) {        
        if (hasTouch) {
            index = index || 0;
        
            var touch = e.touches[index];
            if (undefined === touch) {
                touch = e.changedTouches[index];
            }
        } else {
            touch = e;
        }
        
        return [parseInt(touch.pageX, 10), parseInt(touch.pageY, 10)];
        
    };
    
    var Touch = my.Class({
        STATIC : {
            getPosition : Touch.getPosition,
            getPositionX : function getPositionX(e, index) {
                return getPosition(e, index)[0];
            },
            getPositionY : function getPositionY(e, index){
                return getPosition(e, index)[1];
            },
            getTarget : function getTarget(e, index) {
                return e.touches[index || 0].target;
            }
        }
    });
    
    if (!hasTouch) {
        Touch.EVENT_START = 'mousedown';
        Touch.EVENT_MOVE  = 'mousemove';
        Touch.EVENT_END   = 'mouseup';
    } else {
        Touch.EVENT_START = 'touchstart';
        Touch.EVENT_MOVE  = 'touchmove';
        Touch.EVENT_END   = 'touchend';        
    }
    
    var exports = oo.Core.utils.getNS('oo.View');
    exports.Touch = Touch;
    
    return oo;

})(oo || {});        /** 
 * Class providing url routing logic
 * handle management of history API
 * 
 * @namespace oo
 * @class Router
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
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

})(oo || {});
/** 
 * Class let's you manage data with an single API for all storage managed
 * 
 * @namespace oo
 * @class Store
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function (oo) {

    // shorthand
    var Dom = oo.View.Dom, Touch = oo.Touch, Events = oo.Events;
    
    var Store = my.Class({
        STATIC : {
            EVT_REFRESH : 'refresh'
        },
        constructor : function constructor(data) {
            this._data = data;
            this._snapshot = null;

            this._orderByCol = null;
            this._grouped = null;        
            this._filterFn = null;
        },
        setData : function setData(data) {
            this._data = data;

            this._takeSnapshot();
        },
        setFilter : function setFilter(fn){
            this._filterFn = fn;

            this._takeSnapshot();
        },
        setNoFilter : function setNoFilter(){
            this._filterFn = function () { return true; };

            this._takeSnapshot();
        },
        setOrderCol : function setOrderCol(col, grouped){
            this._orderByCol = col;
            this._grouped = grouped;

            this._takeSnapshot();
        },
        _filter : function _filter(fn){
            if (fn) {
                this._filterFn = fn;
            }
            if (typeof this._filterFn == 'function') {
                this._snapshot = this._data.filter(this._filterFn);
                return true;
            }
            return false;
        },
        _order : function _order() {
            
            if (this._orderByCol) {
                var dest = [];
                var that = this;
                this._snapshot.forEach(function (element, index, array) {
                    var low = 0, high = dest.length;
                    while (low < high) {
                        var mid = (low + high) >> 1;
                        dest[mid][that._orderByCol] < element[that._orderByCol] ? low = mid + 1 : high = mid;
                    }
                    dest.splice(low, 0, element);
                });

                this._snapshot = dest;
                return true;
            }
            return false;

        },
        _takeSnapshot : function _takeSnapshot(){
            var filtered = this._filter();
            var ordered = this._order();

            if (filtered || ordered) {
                Events.triggerEvent(Store.EVT_REFRESH, this);
            } else {
                this._snapshot = this._data;
            }
        },
        getData : function getData(noCache) {
            
            var data = [];
            if (null === this._snapshot || noCache) {
                this._takeSnapshot();
            }

            data = this._snapshot;
            if (this._grouped && this._orderByCol) {
                data = [];

                var prevLetter = '', curLetter = '';            
                for (var i=0, len=this._snapshot.length; i<len; i++) {
                    var el = this._snapshot[i];
                    curLetter = el.nom.substring(0,1);
                    if (prevLetter != curLetter) {
                        data.push({id: 'separator', cropped: curLetter});
                        prevLetter = curLetter;
                    }
                    data.push(el);
                }
            }

            //return this._snapshot;
            return data;
        },
        write : function write(data, where) {
            var that = this;
            var recordsIndex = [];
            this._data.forEach(function (el, index) {
                for (prop in where) {
                    if (el[prop] !== where[prop]) {
                        return false;
                    }
                }
                recordsIndex.push(index);
                return true;
            });

            recordsIndex.forEach(function (i) {
                for (prop in data) {
                    that._data[i][prop] = data[prop];
                }            
            });

            this._takeSnapshot();
        }
    });    
    
    
    var exports = oo.core.utils.getNS('oo.Model');
    exports.Store = Store;
    
    return oo;
    
})(oo || {});/** 
 * Class providing an easy way of doing AJAX query
 * 
 * @namespace oo
 * @class Ajax
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function (oo) {

    /**
     * @var {Array} ajaxPool - internal request pool - used to keep reference to running request 
     **/
    var ajaxPool = [];

    /**
     * insert an element into the pool and reference it with an auto incremented key
     * @param {Mixed} elem - element to insert into the pool
     * @return {Int}
     **/
    ajaxPool.insert = function insert(elem) {
        if (undefined == this.autoIncrementKey) {
            this.autoIncrementKey = 0;
        }

        this.autoIncrementKey++;
        ajaxPool[this.autoIncrementKey] = elem;
        
        return this.autoIncrementKey;
    }

    /**
     * return key that will be used on next insertion
     **/
    ajaxPool.getNextKey = function getNextKey () {
        if (undefined == this.autoIncrementKey) {
            this.autoIncrementKey = 0;
        }

        return this.autoIncrementKey + 1;
    }

    /**
     * the Request class is a wrapper for native XMLHttpRequest object
     * it provide the same interface but osme shortcut are implemented 
     * (no need to open connection before send data, it will be done for you)
     *
     * @constructor
     **/
    Request = function Request (key, isPermanent, defaultParams) {
        
        /**
         * @var {String} url - the target url
         **/
        this.url;
        
        /**
         * @var {String} method - the http method used
         **/
        this.method = Ajax.GET;

        /**
         * @var {object} defaultParams - params that will be used if none are provided when calling send method
         **/
        this.defaultParams = defaultParams;

        /**
         * @var {Integer} key - the key reference into the ajaxPool
         **/
        this.key = key;
        
        /**
         * @var {Boolean} isPermanent - determine if the object is maintained after recieving the response
         **/
        this.isPermanent = isPermanent;
        
        /**
         * @var {XMLHttpRequest} xhr - the native xhr object
         **/
        this.xhr = new XMLHttpRequest();
        
        /**
         * @var {Boolean} isOpen - determine if a connection has already been opened (not sure it's very usefull)
         **/        
        this.isOpen = false;
        
        /**
         * @var {Boolean} isLoading - is the request is running or not
         **/        
        this.isLoading = false;
        var me = this;

        this.xhr.addEventListener('readystatechange', function () {
            if (4 == me.xhr.readyState) {
                me.isOpen = me.isLoading = false
                if (200 == me.xhr.status) {
                    //me.successCallback(me.parseJson(me.xhr.responseText));
                    me.successCallback(JSON.parse(me.xhr.responseText));
                } else {
                    me.errorCallback();
                }
                if (!isPermanent) {
                   me.destroy();
                }
            }

        });
    };
    
    var rp = Request.prototype;

    rp.parseJson = function (text) {
        dataWrapper = '(function () { return %json%; })()';
        var obj = eval(dataWrapper.replace('%json%', text));
        
        return obj;
    }
    
    rp.destroy = function () {
         delete ajaxPool[this.key];
    };    
    
    rp.setUrl = function (url) {
        this.url = url;
    };
    
    rp.setMethod = function (method) {
        this.method = method;
    }
    
    rp.setSuccessCallback = function (callback) {
        this.successCallback = callback;
    }
    
    rp.setErrorCallback = function (callback) {
        this.errorCallback = callback;
    }
    
    rp.open = function () {
        // force asynchrone
        try {
            this.xhr.open(this.method, this.url, true);
            this.isOpen = true;
        } catch (e) {
            throw e;
        }
    };
    
    rp.send = function (params) {

        if (!this.isOpen) {
            this.open();
        }

        var paramsString = this.encodeParams(params || this.defaultParams);
        
        if (Ajax.POST == this.method) {
            this.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }/* else {
            this.urlParams = [this.url, '?', paramsSrting].join('');
            paramsString = '';
            this.isOpen = false;
        }*/

        this.isLoading = true;
        
        this.xhr.send(paramsString);
    };

    rp.encodeParams = function encodeParams (params) {
        var tmpArr = [];
        for(var p in params) {
            tmpArr.push([p, '=', params[p]].join(''));
        }
        return tmpArr.join('&');
    };
    
    rp.abort = function () {
        this.xhr.abort();
    };

    // static class
    var Ajax = {
        // constant
        POST : 'POST',
        GET : 'GET',
        
        /**
         * build a request object stores its reference into the ajaxPool, and send data
         * use this method for one shot ajax call
         * @param {Object} options :
         *                 - url     -> url to request
         *                 - method  -> which HTTP method to use GET / POST
         *                 - params  -> params to embed in the request
         *                 - success -> the success callback
         *                 - error   -> the error callback
         **/
        ajaxCall: function (options) {
            if (undefined == options.url || null == options.url || "" == options.url) {
                throw new Error('no URL parameter given');
            }
            
            options.isPermanent = false;
            
            var key = this.buildRequest(options);
            
            var req = ajaxPool[key];
            
            req.send();
            
            return key;
        },
        
        /**
         * build a request object stores its reference into the ajaxPool
         *
         * @param {Object} options :
         *                 - url     -> url to request
         *                 - method  -> which HTTP method to use GET / POST
         *                 - params  -> params to embed in the request
         *                 - success -> the success callback
         *                 - error   -> the error callback         
         **/
        buildRequest: function (options) {
            if (undefined == options.url || null == options.url || "" == options.url) {
                throw new Error('no URL parameter given');
            }
            
            var method = options.method || this.GET;            
            var params = options.params || {};
            var isPermanent = options.isPermanent || false;
            var success = options.success || function () {};
            var error = options.error || function () {};
            var key = ajaxPool.getNextKey();
            
            var req = new Request(key, isPermanent, params);
            
            req.setUrl(options.url);            
            req.setMethod(method);
            req.setSuccessCallback(success);
            req.setErrorCallback(error);

            ajaxPool.insert(req);
            
            return key;
        },
        
        /**
         * returns the Request object associated with the given id;
         * use this method with caution - the ajax library is designed
         * to be a proxy for all ajax call, it is not recommended to use
         * a request object directly
         *
         * @param {Integer} id - the id of the request
         **/
        getRequest: function (id) {
            return ajaxPool[id];
        },
        
        getRequestStatus: function (id) {
            return ajaxPool[id].isLoading;
        },        
        
        /**
         * abort a previously send request by its key
         *
         * @param {Integer} id - the id of the request
         **/
        abortCall: function (id) {
            if (ajaxPool[id]) {
                ajaxPool[id].abort();
            }
        },

        destroy: function (id) {
            if (ajaxPool[id]) {
                ajaxPool[id].destroy();
            }
        },
        
        send: function (id, params) {
            if (ajaxPool[id]) {
                ajaxPool[id].send(params || {});
            }
        }
    };

    oo.Ajax = Ajax;
    return oo;

})(oo || {});var oo = (function (oo) {
    
    // private class
    var ClassList = my.Class({
        constructor : function constructor (obj){
            this._dom = obj;
            this._list = obj.className.split(' '); 
        },
        destroy : function destroy () {
            this._dom = null;
            this._list.splice(0);
            this._list = null;
        },
        _updateClassList : function _updateClassList (){
            this._dom.className = this._list.join(' ');
        },
        // remove one or more css class
        removeClass : function removeClass (clsName) {
            if (typeof clsName == 'string') {
                clsName = clsName.split(' ');
            }
            var updated = false;
            var that = this;
            clsName.forEach(function (element, index, array) {
                var i = that._list.indexOf(element)
                if (-1 !== i) {
                    that._list.splice(i, 1);
                    updated = true;
                }
            });

            if (updated) {
                this._updateClassList();
            }
        },
        // add one or more css class
        addClass : function addClass (clsName) {
            if (typeof clsName == 'string') {
                clsName = clsName.split(' ');
            }
            if (!this.hasClass(clsName)) {
                clsName.splice(0, 0, 0, 0);
                Array.prototype.splice.apply(this._list, clsName);
                this._updateClassList();
            }
        },
        // set one or more css class (clear all class previously present) 
        setClass : function setClass (clsName) {
            if (typeof clsName == 'string') {
                clsName = clsName.split(' ');
            }        
            this._list = clsName;
            this._updateClassList();
            
        },
        // check if it has the given class
        hasClass : function hasClass(clsName) {
            var i = this._list.indexOf(clsName)
            if (-1 === i) {
                return false;
            } else {
                return true;
            }
        },
        getClasses : function getClasses (){
            return this._list;
        }
    });
    
    // lists of attributes for wich accessors will be generated
    var prop = {
        readOnly: [],
        readWrite: ['width', 'height', 'zIndex', 'display', 'top', 'right', 'bottom', 'left',
                    'webkitTransitionProperty', 'webkitTransitionTimingFunction', 'webkitTransitionDuration']
    };


    var Dom = my.Class({
        STATIC: {
            CSSMATRIXPATTERN : /matrix\(1, 0, 0, 1, (-?[0-9.]+), (-?[0-9.]+)\)/
        },
        constructor : function constructor (identifier) {
            /**
             * underlying dom node object
             */
            this._dom;

            /**
             * internal cache
             */
            this._cached = {};

            this._template;

            this._cacheTpl;

            if (typeof identifier == 'string') {
                this.setDomObject(document.querySelector(identifier));
            }
            else /*if (identifier instanceof DOMNode)*/ {
                this.setDomObject(identifier);
            }
            this.generateAccessor();
            this.classList = new ClassList(this._dom); 
        },
        // destructor
        destroy : function destroy (){
            this.classList.destroy();

            this.classList = null;
            this._cached.splice(0);
            this._cached = null;

            this._dom.removeEventListeners();
            document.removeElement(this._dom);
            this._dom = null;
        },
        generateAccessor : function generateAccessor (){
            var p = this;
            /**
             * generates accessors fonction
             */
            for (var i=0, len=prop['readOnly'].length; i<len; i++) {
                eval(['p.get', prop['readOnly'][i].charAt(0).toUpperCase(), prop['readOnly'][i].slice(1), ' = function (unit, noCache) { if (noCache || !this._cached[[\'', prop['readOnly'][i], '\',(unit ? \'u\' : \'\')].join(\'\')]) { this._cached[[\'', prop['readOnly'][i], '\',(unit ? \'u\' : \'\')].join(\'\')] = (unit ? window.getComputedStyle(this._dom).', prop['readOnly'][i], ' : (window.getComputedStyle(this._dom).', prop['readOnly'][i], ').replace(/s|ms|px|em|pt|%/, \'\')); this._cached[[\'', prop['readOnly'][i], '\',(unit ? \'u\' : \'\')].join(\'\')] = parseInt(this._cached[[\'', prop['readOnly'][i], '\',(unit ? \'u\' : \'\')].join(\'\')], 10) || this._cached[[\'', prop['readOnly'][i], '\',(unit ? \'u\' : \'\')].join(\'\')]; } return this._cached[[\'', prop['readOnly'][i], '\', (unit ? \'u\' : \'\')].join(\'\')]; };'].join(''));
            }

            for (var i=0, len=prop['readWrite'].length; i<len; i++) {
                eval(['p.get', prop['readWrite'][i].charAt(0).toUpperCase(), prop['readWrite'][i].slice(1), ' = function (unit, noCache) { if (noCache || !this._cached[[\'', prop['readWrite'][i], '\',(unit ? \'u\' : \'\')].join(\'\')]) { this._cached[[\'', prop['readWrite'][i], '\',(unit ? \'u\' : \'\')].join(\'\')] = (unit ? window.getComputedStyle(this._dom).', prop['readWrite'][i], ' : (window.getComputedStyle(this._dom).', prop['readWrite'][i], ').replace(/s|ms|px|em|pt|%/, \'\')); this._cached[[\'', prop['readWrite'][i], '\',(unit ? \'u\' : \'\')].join(\'\')] = parseInt(this._cached[[\'', prop['readWrite'][i], '\',(unit ? \'u\' : \'\')].join(\'\')], 10) || this._cached[[\'', prop['readWrite'][i], '\',(unit ? \'u\' : \'\')].join(\'\')]; } return this._cached[[\'', prop['readWrite'][i], '\', (unit ? \'u\' : \'\')].join(\'\')]; };'].join(''));
                eval(['p.set', prop['readWrite'][i].charAt(0).toUpperCase(), prop['readWrite'][i].slice(1), ' = function (val, unit) { if (this._cached[\'', prop['readWrite'][i], '\'] || this._cached[[\'', prop['readWrite'][i], '\', \'u\'].join(\'\')]) { this._cached[\'', prop['readWrite'][i], '\'] = this._cached[[\'', prop['readWrite'][i], '\', \'u\'].join(\'\')] = null; } this._dom.style.', prop['readWrite'][i], ' = [val, (undefined !== unit ? unit : \'\')].join(\'\'); return this };'].join(''));
            }

            // read translation values from dom or from cache
            //var cssMatrixPattern = /matrix\(1, 0, 0, 1, (-?[0-9.]+), (-?[0-9.]+)\)/;
            // var cssMatrixPattern = /translate3d\((-?[0-9.]+)(px|%) *, *(-?[0-9.]+)(px|%) *, 0(px|%)\)/;

        },
        getTranslations : function getTranslations (noCache){
            if (!this._cached['webkitTranslations'] || noCache) {
                var values = this.getWebkitTransform().match(Dom.CSSMATRIXPATTERN);
                if (null === values) {
                    values = [0, 0, 0];
                }
                this._cached['webkitTranslations'] = [parseInt(values[1], 10), parseInt(values[2], 10)];
                // this._cached['webkitTranslations'] = [parseInt(values[1], 10), parseInt(values[3], 10)];
            }
            return this._cached['webkitTranslations'];
        },
        getWebkitTransform : function getWebkitTransform (noCache) {
            if (!this._cached['webkitTransform'] || noCache) {
                this._cached['webkitTransform'] = window.getComputedStyle(this._dom).webkitTransform;
            }        
            return this._cached['webkitTransform'];
        },
        setWebkitTransform : function setWebkitTransform (value) {
            if (this._cached['webkitTransform'] || this._cached['webkitTranslations']) {
                this._cached['webkitTransform'] = null;
                this._cached['webkitTranslations'] = null;
            }

            this._dom.style.webkitTransform = value;

            return this;
        },
        setTranslations : function setTranslations (x, y, unit){
            unit = unit || 'px';

            this.setWebkitTransform(['translate3d(',  x , unit, ', ', y, unit, ', 0)'].join(''));

            return this;
        },
        getTranslateX : function getTranslateX (unit, noCache) {
            return (unit ? [this.getTranslations(noCache)[0],'px'].join('') : this.getTranslations(noCache)[0]); 
        },
        getTranslateY : function getTranslateY (unit, noCache) {
            return (unit ? [this.getTranslations(noCache)[1],'px'].join('') : this.getTranslations(noCache)[1]);    
        },
        setTranslateX : function setTranslateX (val) {
            var valY = this.getTranslateY();
            this.setTranslations(val, valY);

            return this;
        },
        setTranslateY : function setTranslateY (val){
            var valX = this.getTranslateX();
            this.setTranslations(valX, val);

            return this;
        },
        // setters for internal dom object
        setDomObject : function setDomObject (domNode) {
            this._dom = domNode;

            if (!this._dom.id) {
                this._dom.id = oo.core.utils.generateId(this._dom.tagName);
            }

            return this;
        },
        // getter for internal dom object
        getDomObject : function getDomObject () {
            return this._dom;
        },
        // find a child element of the current node according to the given selector
        find : function find (selector) {
            return new Dom(this._dom.querySelector(selector));
        },
        findParentByCls : function findParentByCls (cls) {
            var p = this._dom.parentNode;
            var pattern = new RegExp(cls);
            while (!pattern.test(p.className) && p) {
                p = this._dom.parentNode;
            }
            if (p) {
                return new Dom(p);
            } else {
                return false;
            }      
        },
        // append a node to the current node children list
        // wrapper for the native API
        appendDomNode : function appendDomNode (domNode) {
            this._dom.appendChild(domNode);

            return this;
        },
        // append a node to the current node children list
        // can be a native DOMObject or a oo.Dom object
        appendChild : function appendChild (node) {
            if (node instanceof Dom)
            {
                this.appendDomNode(node.getDomObject());
            } else {
                this.appendDomNode(node);
            }

            return this;
        },
        appendHtml : function appendHtml (html) {
            this._dom.innerHTML = [this._dom.innerHTML, html].join('');

            return this;
        },
        clear : function clear () {
            this._dom.innerHTML = '';

            return this;
        },
        // stop animation by setting the duration to 0
        stopAnimation : function stopAnimation () {
            this.setWebkitTransitionDuration(0, 'ms');
            this._dom.removeEventListener('webkitTransitionEnd');

            return this;
        },
        
        /**
         * apply a translation on an object
         * you may define a set of duration, animation end callback, for one shot
         *
         * @param coord {object}
         * @param duration {int} in ms
         * @param duration {Function}
         * @param timingFunction {String}
         **/
        translateTo : function translateTo (coord, duration, listener, timingFunction) {

            if (typeof coord === 'object') {
                coord.x = undefined !== coord.x ? coord.x : this.getTranslateX();
                coord.y = undefined !== coord.y ? coord.y : this.getTranslateY();
            }

            // getWebkitTransitionDuration() returns a value in seconds
            var currentTransitionDuration = (this.getWebkitTransitionDuration() * 1000);
            duration = duration || 0;
            this.setWebkitTransitionDuration(duration, 'ms');

            var currentTimingFunction = this.getWebkitTransitionTimingFunction();
            if (typeof timmingFunction === 'string') {
                this.setWebkitTransitionTimingFunction(timingFunction, '');            
            }

            var that = this, endListener = function endListener (e) {
                that._dom.removeEventListener('webkitTransitionEnd', this);
                that.setWebkitTransitionDuration(currentTransitionDuration, 'ms');
                that.setWebkitTransitionTimingFunction(currentTimingFunction, '');
                if (listener) {
                    listener.call(that, e);
                };
            }                
            this._dom.addEventListener('webkitTransitionEnd', endListener, false);

            this.setTranslations(coord.x, coord.y);

            return this;
        },
        setTemplate : function setTemplate (tpl) {
            this._template = tpl;

            return this;
        },
        render : function render (data, tpl, resetCache) {
          if (tpl) {
               this.setTemplate(tpl);
           }

           if (!this._cacheTpl || resetCache) {
               data = data || {};
               this._cacheTpl = Mustache.to_html(this._template, data);
           }

           this.appendHtml(this._cacheTpl);

           return this;
       }
    });
    // static method
    
    // wrapper for createElement native functio`n
    Dom.createElement = function createElement (tag) { return new Dom(document.createElement(tag)) };

    //oo.Dom = Dom;
    var exports = oo.core.utils.getNS('oo.View');
    exports.Dom = Dom;
    
    return oo;
    
})(oo || {});var oo = (function (oo) {

    // shorthand
    var Dom = oo.View.Dom, Touch = oo.Touch, utils = oo.Core.utils, Events = oo.Events;
    
    var Viewport = my.Class({
        STATIC : {
            ANIM_RTL : 'rtl',
            ANIM_LTR : 'ltr',
            NO_ANIM : 'none',
            ANIM_DURATION : 500
        },
        constructor : function constructor(root){
            root = root || 'body';

            this._root = new Dom(root);

            // give access to classList of the root node
            this.classList = this._root.classList;

            this._panels = [];
            this._panelsDic = [];
            this._enabledPanels = [];        
            this._focusedStack = [];
        },
        /**
         * return true if the panel has already been added
         * @param panel {String} identifier as string or index
         **/
        hasPanel : function hasPanel(panel) {
           return -1 != this._panelsDic.indexOf(panel) ? true : false; 
        },
        /**
         * add a panel to the viewport
         * @param view {string} a template string
         * @param identifier {string} a name that will be used as reference to the panel
         * @autoShow {bool} will render/show the panel directly after adding it
         * @autoRender {bool|string} will render the panel directly after adding - if the autoShow param is set to true then it is used as animDirection
         * @animDirection {string} define an animation (use constant)
         **/
         addPanel : function addPanel(view, identifier, autoShow, autoRender, animDirection){
             var p = new Dom.createElement('div');
             p.getDomObject().id = identifier;
             p.classList.addClass('oo-panel');

             var template = view;
             var dataTpl = {};
             if (typeof view == 'object' && view.template) {
                 template = view.template;
                 dataTpl = view.data || {};
             }
             p.setTemplate (template);

             this._panels.push(p);
             this._panelsDic.push(identifier);

             if (autoShow) {
                 animDirection = autoRender || animDirection;
                 p.render(dataTpl);
                 this.showPanel(identifier, animDirection);
             } else {
                 if (autoRender) {
                     p.render(dataTpl);
                 }
             }
         },
         _identifierToIndex : function _identifierToIndex(identifier){
             var index = identifier;
             if (typeof index == 'string') {
                 index = this._panelsDic.indexOf(index);
             }
             return index;
         },
         _indexToIdentifier : function _indexToIdentifier(index){
             return index = this._panelsDic[index];
         },
         _enablePanel : function _enablePanel(identifier){
             var index = this._identifierToIndex(identifier);

             this._root.appendChild(this._panels[index]);

             this._enabledPanels.push(index);

             // hook to initialize view components such as vscroll or carousel
             // @todo : change the sender, should not be sent by the panel but the visible API is nicer this way    
             Events.triggerEvent('onEnablePanel', this._panels[index], [{identifier: this._indexToIdentifier(index), panel: this._panels[index]}]);
         },
         getFocusedPanel : function getFocusedPanel(getIndex){
             index = this._focusedStack[this._focusedStack.length - 1];
             if (getIndex) {
                 return undefined !== index ? index : false;
             } else {
                 return this.getPanel(index);
             }
         },
         /**
          * return the Panel as a oo.Dom object 
          **/
         getPanel : function getPanel(identifier) {
             return this._panels[this._identifierToIndex(identifier)] || false;
         },
         panelIsEnable : function panelIsEnable(identifier) {
             return (-1 != this._enabledPanels.indexOf(this._identifierToIndex(identifier)) ? true : false);
         },
         removePanel : function removePanel(panel) {
             var index = this._identifierToIndex(panel);

             // event ?
             this._panels[index].destroy();

             this._panels.slice(index, 1);
             this._panelsDic.slice(index, 1);
         },
         /**
          * show a panel with a optional animation
          * @param {string|int} the panel string identifier or index
          * @param {direction} Right To Left or Left To Right or no anim (use constant)
          **/
         showPanel : function showPanel(panel, direction) {
             var index = this._identifierToIndex(panel);

             direction = direction || Viewport.ANIM_RTL;

             var anim_duration = 0;
             if (direction !== Viewport.NO_ANIM) {
                 // prepare transition
                 var translateDist = this._root.getWidth() * (direction == Viewport.ANIM_RTL ? 1 : -1);
                 this.getPanel(index).setTranslateX(translateDist);
                 // this.getPanel(index).setDisplay('', '');
                 anim_duration = Viewport.ANIM_DURATION;
             }

             if (!this.panelIsEnable(index)) {
                 this._enablePanel(index);
             }

             // transition
             // this.getPanel(index).setZIndex(5, '');
             this.getPanel(index).translateTo({x:0}, anim_duration);

             this._focusedStack.push(index);

             // @todo : change the sender, should not be sent by the panel but the visible API is nicer this way
             Events.triggerEvent('onShowPanel', this._panels[index], [{identifier: this._indexToIdentifier(index), panel: this._panels[index]}]);
         },
         hidePanel : function hidePanel(panel, direction, destroy) {
             var index = this._identifierToIndex(panel);

             direction = direction || Viewport.ANIM_RTL;

             var anim_duration = 0;
             if (direction !== Viewport.NO_ANIM) {
                 anim_duration = Viewport.ANIM_DURATION;
             }

             // transition
             var translateDist = this._root.getWidth() * (direction == Viewport.ANIM_RTL ? -1 : 1);
             // this.getPanel(index).setZIndex(3, '');
             var that = this;
             this.getPanel(index).translateTo({x:translateDist}, Viewport.ANIM_DURATION, function () {
                 // that.getPanel(index).setDisplay('none');
                 that.getPanel(index).stopAnimation();
             });

             if (index == this.getFocusedPanel(true)) {
                 this._focusedStack.pop();
             }

             Events.triggerEvent('onHidePanel', this, [{identifier: this._indexToIdentifier(index), panel: this._panels[index]}]);
         },
         /**
          * show the newPanel and hide the oldPanel
          * this method usualy takes three parameter, you may pass only two (first as the new Panel, and second
          * as the direction of the animation) the current panel will be auto hidden
          * @param oldPanel the panel to hide
          * @param newPanel the panel to show
          * @param define an animation for both hide and show transitions (use constant)
          **/
          switchPanel : function switchPanel(oldPanel, newPanel, direction) {
              var dir, oldP, newP;

              if (typeof arguments[1] == 'string' || 1 == arguments.length) {
                  dir = newPanel;
                  newP = oldPanel;
                  oldP = this.getFocusedPanel(true)
              } else {
                  oldP = oldPanel;
                  newP = newPanel;
                  dir = direction;
              }

              this.showPanel(newP, dir);

              if (false !== oldP) {
                  this.hidePanel(oldP, dir);
              }
          }
    });

    // Viewport.ANIM_RTL_[...] = '...';    
    var exports = oo.core.utils.getNS('oo.View');
    exports.Viewport = Viewport;
    
    return oo;
    
})(oo || {});/** 
 * Class lat's you transform any dom node into button and manage interaction
 * 
 * @namespace oo
 * @class Button
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function (oo) {

    var Dom = oo.View.Dom, Touch = oo.Touch; Events = oo.Events;
    
    var Button = my.Class({
        STATIC : {
            EVT_TOUCH : 'touch',
            EVT_RELEASE : 'release'
        },
        constructor : function constructor(selector) {
            this._dom = new Dom(selector);
            this._active = false;

            this._initEvents();
        },
        getDom : function getDom() {
            return this._dom;
        },
        _initEvents : function _initEvents() {
            var that = this;
            this._dom.getDomObject().addEventListener(Touch.EVENT_START, function (e) {
                return that._onTouch.call(that, e);
            });

            this._dom.getDomObject().addEventListener(Touch.EVENT_END, function (e) {
                return that._onRelease.call(that, e);
            });
        },
        _onTouch : function _onTouch() {
            if (!this.isActive()) {
                this.setActive(true);            
            }
            Events.triggerEvent(Button.EVT_TOUCH, this, [this, e]);
        },
        _onRelease : function _onRelease(e) {
            this.setActive(false);
            Events.triggerEvent(Button.EVT_RELEASE, this, [this, e]);
        },
        _toogleActive : function _toogleActive(){
            this.setActive(!this._active);
        },
        isActive : function isActive() {
            return this._active;
        },
        /**
         * set the active state of the button
         * @param actice {bool} "true" to set as active "false" to not 
         **/
        setActive : function setActive (active) {
            if (active || undefined === active) {
                this._dom.classList.addClass('active');
                this._active = true;
            } else {
                this._dom.classList.removeClass('active');
                this._active = false;
            }
        }
    });
    
    var exports = oo.core.utils.getNS('oo.View');
    exports.Button = Button;
    
    return oo;    
    
})(oo || {});var oo = (function (oo) {

    var Dom = oo.View.Dom, Touch = oo.Touch, Events = oo.Events, Button = oo.View.Button;
    
    var ButtonGroup = my.Class({
        STATIC : {
            TYPE_RADIO : 'radio',
            TYPE_CHECKBOX : 'checkbox'
        },
        contructor : function constructor(selector, type) {
            this._buttons = [];

            type = type || ButtonGroup.TYPE_RADIO;

            var buttonList = document.querySelectorAll(selector);

            var that = this;

            for (var i=0, len=buttonList.length; i<len; i++) {
                btn = new Button(buttonList[i]);

                btn._onRelease = function (e) {
                    _onRelease.call(btn, e, that);
                };

                this._buttons.push(btn);

                if (type == ButtonGroup.TYPE_RADIO) {
                    var that = this;                
                    Events.addListener(Button.EVT_TOUCH, function (triggerBtn, e) {
                        that.updateActive.apply(that, [triggerBtn, e]);
                    }, btn);                
                }
            }
        },
        updateActive : function updateActive(btn, evt){
            for (var i=0, len=this._buttons.length; i<len; i++) {
                if (this._buttons[i] !== btn) {
                    this._buttons[i].setActive(false);
                }
            }
        }
    });

    // @todo : it's a little bit dirty :s
    // /!\ is called with the scope of the button clicked
    var _onRelease = function _onRelease (e, group) {
        if (this.isActive()) {
            this.setActive(false);
        }
        Events.triggerEvent('release', group, [e, this]);        
    };
    
    var exports = oo.core.utils.getNS('oo.View');
    exports.ButtonGroup = ButtonGroup;
    
    return oo;

})(oo || {});var oo = (function (oo) {

    // shorthand
    var Dom = oo.View.Dom, Touch = oo.Touch, utils = oo.Core.utils, Events = oo.Events, Store = oo.Store;
    
    var List = my.Class({
        STATIC : {
            EVT_RENDER : 'render',
            EVT_ITEM_PRESSED : 'item-pressed',
            EVT_ITEM_RELEASED : 'item-released'
        },
        constructor: function constructor(store, tpl, selector) {
            
            this._data = null;

            this._touchedItem = null;

            this._store = store;
            var that = this;
            Events.addListener(Store.EVT_REFRESH, function () { that._refreshList.apply(that, arguments); }, this._store);

            this.setTemplate(tpl || '<li class="oo-list-item item-{{id}}">{{.}}</li>');

            if (selector) {
                this._dom = new Dom(selector);
            } else {
                this._dom = Dom.creataElement('ul');
            }

            this._initEvents();

            this._refreshList();
        },
        _initEvents : function _initEvents(){
            
            function checkTarget (target) {
                var t = new Dom(target);
                var itemId;
                if (t.classList.hasClass('oo-list-item')) {
                    itemId = t.getDomObject().className.match(/item-([0-9]*)/)[1];
                } else {
                    var altTarget = t.findParentByCls('oo-list-item');
                    if (altTarget) {
                        t = altTarget;
                        itemId = t.getDomObject().className.match(/item-([0-9]*)/)[1];
                    }
                }

                if (itemId) {
                    return {id: itemId, dom: t};
                }

                return false;
            }

            var that = this;
            var check;
            this._dom.getDomObject().addEventListener(Touch.EVENT_START, function (e) {
                this._touchedItem = e.target;
                check = checkTarget(e.target);
                if (false !== check) {
                    check.dom.classList.addClass('active');

                    Events.triggerEvent(List.EVT_ITEM_PRESSED, that, [check.dom, check.id]);
                }
            }, false);
            this._dom.getDomObject().addEventListener(Touch.EVENT_MOVE, function (e) {
                if (this._touchedItem) {
                    this._touchedItem = null;
                    that._dom.find('.active').classList.removeClass('active');            
                }
            }, false);        
            this._dom.getDomObject().addEventListener(Touch.EVENT_END, function (e) {
                check = checkTarget(e.target);
                check.dom.classList.removeClass('active');            
                if (false !== check && this._touchedItem == e.target) {
                    Events.triggerEvent(List.EVT_ITEM_RELEASED, that, [check.dom, check.id]);
                }
            }, false);
        },
        getDom : function getDom() {
            return this._dom;
        },
        _refreshList : function _refreshList(){
            this._fetchStoreData();
            this._dom.clear();
            this._dom.render(this._data, this._template, true);
            Events.triggerEvent(List.EVT_RENDER, this);
        },
        _prepareData : function _prepareData(data) {
            return {items: data};
        },
        setData : function setData(data) {
            this._data = this._prepareData(data);
        },
        _fetchStoreData : function _fetchStoreData() {
            this.setData(this._store.getData());
        },
        setTemplate : function setTemplate(tpl){
            this._template = this._prepareTpl(tpl);
        },
        _prepareTpl : function _prepareTpl(tpl){
            return ['{{#items}}', tpl, '{{/items}}'].join('');
        }
    });
    
    var exports = oo.core.utils.getNS('oo.View');
    exports.List = List;
    
    return oo;
    
})(oo || {});var oo = (function (oo) {

    // shorthand
    var Dom = oo.View.Dom, Touch = oo.Touch, utils = oo.Core.utils;
    
    var Scroll =  my.Class({
        STATIC : {
            VERTICAL : 'v',
            HORIZONTAL : 'h',
            BOTH : 'b',
            NONE : 'none'
        },
        constructor : function constructor(identifier, orientation, displayScroll){
            
            this._wrapper = new Dom(identifier);
            this._content = this._wrapper.find('.content');

            this._orientation = orientation || Scroll.VERTICAL;
            this._displayScroll = displayScroll || Scroll.BOTH;

            this._vscrollbarWrapper = null;
            this._vscrollbar = null;       

            this._hscrollbarWrapper = null;
            this._hscrollbar = null;

            // due to a bug in the oo.Dom cache management this value couldn't be set in the constructor
            // this._maxVScrollTranslate = (this._wrapper.getHeight() - this._vscrollbar.getHeight());        
            this._maxvScrollTranslate = null;
            this._maxhScrollTranslate = null;        

            this._buildScrollbars();

            this.initSizes();

            this._startY = 0;
            this._startX = 0;        

            this._touchStartY = null;
            this._touchInterY = null;

            this._touchStartX = null;
            this._touchInterX = null;

            this._startTime = null;

            this._render();
        },
        initSizes : function initSizes(){
            
            // force empty cache
            this._content.getWidth(false, true);
            this._content.getHeight(false, true);

            this._content.translateTo({x: 0, y: 0}, 0);

            this._startY = 0;
            this._startX = 0;

            // for VScroll
            if (Scroll.VERTICAL == this._orientation || Scroll.BOTH == this._orientation) {
                this._vscrollbar.setDisplay('');            
                this._maxvTranslate = (this._wrapper.getHeight() - this._content.getHeight());
                if (this._maxvTranslate > 0) {
                    this._maxvTranslate = 0;
                    this._vscrollbar.setDisplay('none');
                }            
                this._determineScrollbarSize(Scroll.VERTICAL);
                this._vscrollbar.translateTo({y: 0}, 0);
            }

            // for HScroll        
            if (Scroll.HORIZONTAL == this._orientation || Scroll.BOTH == this._orientation) {
                this._hscrollbar.setDisplay('');            
                this._maxhTranslate = (this._content.getWidth() - this._wrapper.getWidth());            
                if (this._maxhTranslate < 0) {
                    this._maxhTranslate = 0;
                    this._hscrollbar.setDisplay('none');
                }            
                this._determineScrollbarSize(Scroll.HORIZONTAL);
                this._hscrollbar.translateTo({x: 0}, 0);
            }
        },
        // create the dom for the scrollbar init some style
        _buildScrollbars : function _buildScrollbars(){
            // VScroll
            if (Scroll.VERTICAL == this._orientation || Scroll.BOTH == this._orientation) {
                this._vscrollbarWrapper = Dom.createElement('div');
                this._vscrollbar = Dom.createElement('div');

                this._vscrollbar.classList.addClass('oo-scrollbar');
                this._vscrollbar.setWidth(100, '%');

                this._vscrollbarWrapper.classList.addClass('oo-scroll-wrapper');
                this._vscrollbarWrapper.classList.addClass('oo-vscroll-wrapper');
                this._vscrollbarWrapper.appendChild(this._vscrollbar);
            }

            // HScroll
            if (Scroll.HORIZONTAL == this._orientation || Scroll.BOTH == this._orientation) {
                this._hscrollbarWrapper = Dom.createElement('div');
                this._hscrollbar = Dom.createElement('div');

                this._hscrollbar.classList.addClass('oo-scrollbar');
                this._hscrollbar.setHeight(100, '%');            

                this._hscrollbarWrapper.classList.addClass('oo-scroll-wrapper');
                this._hscrollbarWrapper.classList.addClass('oo-hscroll-wrapper');            
                this._hscrollbarWrapper.appendChild(this._hscrollbar);
            }
        },
        // add the scroll bar container to the dom
        _renderScrollbars : function _renderScrollbars(){
            if ((this._displayScroll == Scroll.VERTICAL || this._displayScroll == Scroll.BOTH) && (Scroll.VERTICAL == this._orientation || Scroll.BOTH == this._orientation)) {
                this._wrapper.appendChild(this._vscrollbarWrapper);
            }
            if ((this._displayScroll == Scroll.HORIZONTAL || this._displayScroll == Scroll.BOTH) && (Scroll.HORIZONTAL == this._orientation || Scroll.BOTH == this._orientation)) {
                this._wrapper.appendChild(this._hscrollbarWrapper);
            }
        },
        // called when scollbar size need to be calculated (in the constructor for example)
        _determineScrollbarSize : function _determineScrollbarSize(orientation){
            var dim = (Scroll.VERTICAL == orientation ? 'Height' : 'Width');
            var ratio = this._content[['get', dim].join('')]() / this._wrapper[['get', dim].join('')]();
            var sb = parseInt(this._wrapper[['get', dim].join('')]() / ratio, 10);

            this[['_', orientation, 'scrollbar'].join('')][['set', dim].join('')](sb);
            this[['_max', orientation, 'ScrollTranslate'].join('')] = this._wrapper[['get', dim].join('')]() - sb;
        },
        // determine the position of the scrollbar according to the position of the list
        _determineScrollbarTranslate : function _determineScrollbarTranslate(contentPos, orientation){
            var percent = this[['_max', orientation, 'Translate'].join('')] / contentPos;
            return (this[['_max', orientation, 'ScrollTranslate'].join('')] / percent) * (Scroll.HORIZONTAL == orientation ? -1 : 1);
        },
        // add touch listeners
        _initListeners : function _initListeners(){
            var listNode = this._content.getDomObject();
            var that = this;
            var touchMoveTempo;

            // start event listener
            listNode.addEventListener(Touch.EVENT_START, function (e) {
                touchMoveTempo = 0;

                if (Scroll.VERTICAL == this._orientation || Scroll.BOTH == this._orientation) {
                    that._vscrollbar.stopAnimation();
                }

                if (Scroll.HORIZONTAL == this._orientation || Scroll.BOTH == this._orientation) {
                    that._hscrollbar.stopAnimation();
                }

                that._content.stopAnimation();

                that._touchStartY = that._touchInterY = Touch.getPositionY(e);
                that._touchStartX = that._touchInterX = Touch.getPositionX(e);

                that._startTime = (new Date).getTime();
                that._startY = that._content.getTranslateY(false, true);
                that._startX = that._content.getTranslateX(false, true);            
            }, false);

            // move event listener
            listNode.addEventListener(Touch.EVENT_MOVE, function (e) {

                var diff, newPos;

                if (Scroll.VERTICAL == that._orientation || Scroll.BOTH == that._orientation) {
                    diff = Touch.getPositionY(e) - that._touchStartY;
                    newPos = that._startY + diff;

                    that._content.setTranslateY(newPos);
                    that._vscrollbar.setTranslateY(that._determineScrollbarTranslate(newPos, Scroll.VERTICAL));
                }

                if (Scroll.HORIZONTAL == that._orientation || Scroll.BOTH == that._orientation) {
                    diff = Touch.getPositionX(e) - that._touchStartX;
                    newPos = that._startX + diff;

                    that._content.setTranslateX(newPos);
                    that._hscrollbar.setTranslateX(that._determineScrollbarTranslate(newPos, Scroll.HORIZONTAL));
                }

                touchMoveTempo++;
                //if (touchMoveTempo > 7) {
                //     that._touchInterY = Touch.getPositionY(e);
                //     that._startTime = (new Date).getTime();
                //     touchMoveTempo = 0;
                //}

                e.preventDefault();

            }, false);

            // end event listener
            listNode.addEventListener(Touch.EVENT_END, function (e) {

                var stopTime = (new Date).getTime();
                var duration = stopTime - that._startTime;            
                var deceleration = 0.0006;
                var newTime = 500;

                function adjustPos (orientation) {
                    var cVal = that._content[['getTranslate', (Scroll.VERTICAL == orientation ? 'Y' : 'X')].join('')](false, true);
                    var tVal = null;
                    var stop = Touch[['getPosition', (Scroll.VERTICAL == orientation ? 'Y' : 'X')].join('')](e);        

                    var dist = stop - that[['_touchInter', (Scroll.VERTICAL == orientation ? 'Y' : 'X')].join('')];
                    var speed = Math.abs(dist) / duration;
                    var newDist = ((speed * speed) / (2 * deceleration))  * (dist < 0 ? -1 : 1);

                    if ((Scroll.VERTICAL == orientation && cVal > 0) || (Scroll.HORIZONTAL == orientation && cVal > 0)) {
                        tVal = 0;
                    } else if ( (Scroll.VERTICAL == orientation && cVal < that[['_max', orientation, 'Translate'].join('')]) || (Scroll.HORIZONTAL == orientation && Math.abs(cVal) > that[['_max', orientation, 'Translate'].join('')])) {
                        tVal = that[['_max', orientation, 'Translate'].join('')] * (Scroll.HORIZONTAL == orientation ? -1 : 1);
                    } else {
                        tVal = that._content[['getTranslate', (Scroll.VERTICAL == orientation ? 'Y' : 'X')].join('')](false, true) + newDist;
                        tVal = parseInt((tVal > 0 ? 0 : (tVal < that[['_max', orientation, 'Translate'].join('')] ? that[['_max', orientation, 'Translate'].join('')] : tVal)), 10) * (Scroll.HORIZONTAL == orientation ? -1 : 1);
                        newTime = speed / deceleration;
                    }

                    if (tVal !== null) {
                        var coord = {};
                        coord[(Scroll.VERTICAL == orientation ? 'y' : 'x')] = tVal;
                        that._content.translateTo(coord, newTime, function () { that._content.stopAnimation(); });

                        coord[(Scroll.VERTICAL == orientation ? 'y' : 'x')] = that._determineScrollbarTranslate(tVal, orientation);
                        that[['_', orientation, 'scrollbar'].join('')].translateTo(coord, newTime, function () { that[['_', orientation, 'scrollbar'].join('')].stopAnimation(); }, 'ease-out');

                        that[['_start', (Scroll.VERTICAL == orientation ? 'Y' : 'X')].join('')] = tVal;
                    }

                }

                if (Scroll.VERTICAL == that._orientation || Scroll.BOTH == that._orientation) {                
                    adjustPos(Scroll.VERTICAL);
                }

                if (Scroll.HORIZONTAL == that._orientation || Scroll.BOTH == that._orientation) {
                    adjustPos(Scroll.HORIZONTAL);
                }

            }, false);
        },
        // render elements of the component
        _render : function _render(){
            this._wrapper.classList.addClass('oo-list-wrapper');

            this._initListeners();        

            this._renderScrollbars();
        },
        // clean refs
        destroy : function destroy(){
            this._wrapper.destroy();

            // should be done in an event manager ?
            this._content.getDomObject().removeEventListener(Touch.EVENT_START);
            this._content.getDomObject().removeEventListener(Touch.EVENT_MOVE);
            this._content.getDomObject().removeEventListener(Touch.EVENT_END);

            this._content.destroy();
            this._vscrollbarWrapper.destroy();
            this._vscrollbar.destroy();
            this._hscrollbarWrapper.destroy();
            this._hscrollbar.destroy();
        }
    });
              
    var exports = oo.Core.utils.getNS('oo.View');
    exports.Scroll = Scroll;
    
    return oo;

})(oo || {});var oo = (function (oo) {

    // shorthand
    var Dom = oo.Dom, Touch = oo.Touch, utils = oo.utils;
    
    
    var Carousel = my.Class({
        constructor : function constructor(selector, pager) {
            this._startX = 0;
            this._startTranslate = 0;

            this._panelContainer = new Dom(selector);
            this._transitionDuration = 200;

            var domObj = this._panelContainer.getDomObject();

            this._panelWidth = (new Dom(domObj.firstElementChild)).getWidth();
            this._nbPanel = document.querySelectorAll([selector, ' > *'].join('')).length;

            this._activePanel = 0;
            this._displayPager = (pager ? true : false);

            this._pager = null;
            this._buildPager();

            this._moved = false;

            this.render();
        },
        _buildPager : function _buildPager() {
            if (this._displayPager) {
                this._pager = Dom.createElement('div');
                this._pager.classList.addClass('carousel-pager');

                this._pager.setTemplate('{{#bullet}}<i class="dot"></i>{{/bullet}}');

                var data = [];
                for(var i=0; i<this._nbPanel; i++) {
                    data.push(i);
                }

                this._pager.render({bullet: data});
            }

            this._updatePager();
        },
        _updatePager : function _updatePager() {
            var current = this._pager.getDomObject().querySelector('.dot.active');
            if (current) {
                current.className = current.className.replace(/ *active/, '');
            }
            this._pager.getDomObject().querySelector(['.dot:nth-child(', (this._activePanel + 1), ')'].join('')).className += ' active';
        },
        hasMoved : function hasMoved() {
            return this._moved;
        },
        _initListeners : function _initListeners(){
            var listNode = this._panelContainer.getDomObject();
            var that = this;
            var touchMoveTempo;

            listNode.addEventListener(Touch.EVENT_START, function (e) {
                that._startX = Touch.getPositionX(e);
                that._startTranslate = that._panelContainer.getTranslateX();
                touchMoveTempo = 0;
            }, false);

            listNode.addEventListener(Touch.EVENT_MOVE, function (e) {
                var diff = Touch.getPositionX(e) - that._startX;
                that._panelContainer.translateTo({x:(that._startTranslate + diff)}, 0);  
                that._moved = true;
            }, false);

            listNode.addEventListener(Touch.EVENT_END, function () {
                that._moved = false;

                var cVal = that._panelContainer.getTranslateX();
                var tVal;
                
                if (cVal < 0) {

                    cVal = Math.abs(cVal);

                    var min = (that._panelWidth / 2), 
                        max = (that._panelWidth * (that._nbPanel -1) - min);

                    for(var i = min; i <= max; i = i + that._panelWidth) {
                        if (cVal < i) {
                            break;
                        }
                    }

                    
                    if (cVal > max) {
                        tVal = max + min;
                    } else {
                        tVal = i - min;
                    }

                    tVal *= -1;

                } else {
                    tVal = 0;
                }

                that._activePanel = Math.abs(tVal / that._panelWidth);

                that._panelContainer.translateTo({x:tVal}, that._transitionDuration);

                that._updatePager();

                that._startTranslate = tVal;
            }, false);
        },
        render : function render(){
            
            // update css if needed
            if (this._pager) {
                (new Dom(this._panelContainer.getDomObject().parentNode)).appendChild(this._pager);
            }

            this._initListeners();
        }
    });
    
    var exports = oo.Core.utils.getNS('oo.View');
    exports.Carousel = Carousel;
    
    return oo;
    
})(oo || {});
