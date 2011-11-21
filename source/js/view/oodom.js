var oo = (function (oo) {
    
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
        /**
         *
         *  Secure Hash Algorithm (SHA1)
         *  http://www.webtoolkit.info/
         *
         **/
        _generateId : function _generateId () {
             msg = [this._dom.tagName, (new Date).getTime(), Math.random().toString()].join('');

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
        // setters for internal dom object
        setDomObject : function setDomObject (domNode) {
            this._dom = domNode;

            if (!this._dom.id) {
                this._dom.id = this._generateId();
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
    
})(oo || {});