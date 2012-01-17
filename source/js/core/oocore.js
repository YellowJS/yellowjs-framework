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

    var Core = my.Class({
        /**
         * use oo.log instead of console.log
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
        createDelegate: function createDelegate (fn, scope) {
            return function () {
                return fn.apply(scope, arguments);
            };
        },
        EmptyFn: function EmptyFn () { },
        /**
         *
         *  Secure Hash Algorithm (SHA1)
         *  http://www.webtoolkit.info/
         *
         **/
        generateId: function generateId (tagName) {
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

        /**
         * create a controller from the class passed in parameter
         */
        createController: function createController() {
            // to be implemented
        },

        getRouter: function getRouter() {
            // to be implemented  
        },

        getViewport: function getViewport() {
            return oo.view.viewport;
        },

        createPanel: function createPanel(panel) {
            if (!(typeof panel == 'object' && 'id' in panel))
                throw Error('wrong parameter');

            var id = panel.id; delete panel.id;

            // force the class contructor to call its parent contrustor
            var Tmp = panel.constructor = function () {
                Tmp.Super.call(this);
            };
            var p = my.Class(oo.view.Panel, panel);

            oo.getViewport().register(id, p);

            return p;
        },
        createList : function createList(list){
            var l = new oo.view.List( list || null);

            console.log(l);

            return l;
            
        }

    });

    // oo.utils.namespace is now deprecated
    // export an instance of Utils class on the right namespace
    oo = new Core();
    var ns = oo.getNS('oo.core');
    ns.utils = oo;

    return oo;

})(oo || {});