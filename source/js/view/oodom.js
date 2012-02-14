(function (oo) {
    // private class
    var ClassList = oo.Class({
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
                var i = that._list.indexOf(element);
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
            var i = this._list.indexOf(clsName);
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

    var Dom = oo.getNS('oo.view').Dom = oo.Class(oo.emptyFn, oo.core.mixins.Events,{
        STATIC: {
            CSSMATRIXPATTERN : /matrix\(1, 0, 0, 1, (-?[0-9.]+), (-?[0-9.]+)\)/,
            
            // wrapper for createElement native function
            createElement: function createElement (tag) { return new Dom(document.createElement(tag)); }
        },
        constructor : function constructor (identifier) {
            /**
             * underlying dom node object
             */
            this._dom = null;

            /**
             * internal cache
             */
            this._cached = {};

            this._template = null;

            this._cacheTpl = null;

            if (typeof identifier == 'string') {
                this._identifier = identifier;
            }
            else if (identifier instanceof Object) {
                this.setDomObject(identifier);
            } else {
                throw "Fatal Error : No identifier !";
            }
            this.generateAccessor();
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
            var p = this, i, len;
            /**
             * generates accessors fonction
             */
            for (i=0, len=prop.readOnly.length; i<len; i++) {
                eval(['p.get', prop.readOnly[i].charAt(0).toUpperCase(), prop.readOnly[i].slice(1), ' = function (unit, noCache) { if (noCache || !this._cached[[\'', prop.readOnly[i], '\',(unit ? \'u\' : \'\')].join(\'\')]) { this._cached[[\'', prop.readOnly[i], '\',(unit ? \'u\' : \'\')].join(\'\')] = (unit ? window.getComputedStyle(this.getDomObject()).', prop.readOnly[i], ' : (window.getComputedStyle(this.getDomObject()).', prop.readOnly[i], ').replace(/s|ms|px|em|pt|%/, \'\')); this._cached[[\'', prop.readOnly[i], '\',(unit ? \'u\' : \'\')].join(\'\')] = parseInt(this._cached[[\'', prop.readOnly[i], '\',(unit ? \'u\' : \'\')].join(\'\')], 10) || this._cached[[\'', prop.readOnly[i], '\',(unit ? \'u\' : \'\')].join(\'\')]; } return this._cached[[\'', prop.readOnly[i], '\', (unit ? \'u\' : \'\')].join(\'\')]; };'].join(''));
            }

            for (i=0, len=prop.readWrite.length; i<len; i++) {
                eval(['p.get', prop.readWrite[i].charAt(0).toUpperCase(), prop.readWrite[i].slice(1), ' = function (unit, noCache) { if (noCache || !this._cached[[\'', prop.readWrite[i], '\',(unit ? \'u\' : \'\')].join(\'\')]) { this._cached[[\'', prop.readWrite[i], '\',(unit ? \'u\' : \'\')].join(\'\')] = (unit ? window.getComputedStyle(this.getDomObject()).', prop.readWrite[i], ' : (window.getComputedStyle(this.getDomObject()).', prop.readWrite[i], ').replace(/s|ms|px|em|pt|%/, \'\')); this._cached[[\'', prop.readWrite[i], '\',(unit ? \'u\' : \'\')].join(\'\')] = parseInt(this._cached[[\'', prop.readWrite[i], '\',(unit ? \'u\' : \'\')].join(\'\')], 10) || this._cached[[\'', prop.readWrite[i], '\',(unit ? \'u\' : \'\')].join(\'\')]; } return this._cached[[\'', prop.readWrite[i], '\', (unit ? \'u\' : \'\')].join(\'\')]; };'].join(''));
                eval(['p.set', prop.readWrite[i].charAt(0).toUpperCase(), prop.readWrite[i].slice(1), ' = function (val, unit) { if (this._cached[\'', prop.readWrite[i], '\'] || this._cached[[\'', prop.readWrite[i], '\', \'u\'].join(\'\')]) { this._cached[\'', prop.readWrite[i], '\'] = this._cached[[\'', prop.readWrite[i], '\', \'u\'].join(\'\')] = null; } this.getDomObject().style.', prop.readWrite[i], ' = [val, (undefined !== unit ? unit : \'\')].join(\'\'); return this };'].join(''));
            }

            // read translation values from dom or from cache
            //var cssMatrixPattern = /matrix\(1, 0, 0, 1, (-?[0-9.]+), (-?[0-9.]+)\)/;
            // var cssMatrixPattern = /translate3d\((-?[0-9.]+)(px|%) *, *(-?[0-9.]+)(px|%) *, 0(px|%)\)/;

        },
        getTranslations : function getTranslations (noCache){
            if (!this._cached.webkitTranslations || noCache) {
                var values = this.getWebkitTransform().match(Dom.CSSMATRIXPATTERN);
                if (null === values) {
                    values = [0, 0, 0];
                }

                this._cached.webkitTranslations = [parseInt(values[1], 10), parseInt(values[2], 10)];
                // this._cached.webkitTranslations = [parseInt(values[1], 10), parseInt(values[3], 10)];
            }
            return this._cached.webkitTranslations;
        },
        getWebkitTransform : function getWebkitTransform (noCache) {
            if (!this._cached.webkitTransform || noCache) {
                this._cached.webkitTransform = window.getComputedStyle(this.getDomObject()).webkitTransform;
            }
            return this._cached.webkitTransform;
        },
        setWebkitTransform : function setWebkitTransform (value) {
            if (this._cached.webkitTransform || this._cached.webkitTranslations) {
                this._cached.webkitTransform = null;
                this._cached.webkitTranslations = null;
            }

            
            this.getDomObject().style.webkitTransform = value;

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

            if (typeof domNode == 'string') {
                var n = document.querySelector(domNode);
                if (null === n)
                    throw "Invalid selector node doesn't exists";

                domNode = n;
            }

            this._dom = domNode;

            if (domNode && (!('id' in domNode) || domNode.id === '')) {
                this._dom.id = oo.generateId(this._dom.tagName);
            }

            this.classList = new ClassList(this.getDomObject());

            return this;
        },
        // getter for internal dom object
        getDomObject : function getDomObject () {
            if (!this._dom) {
                this.setDomObject(this._identifier);
            }

            return this._dom;
        },
        // find a child element of the current node according to the given selector
        find : function find (selector) {
            var n = this.getDomObject().querySelector(selector);
            if (null === n)
                return null;
            else
                return new Dom(n);
        },
        findParentByCls : function findParentByCls (cls) {
            var p = this.getDomObject().parentNode;
            var pattern = new RegExp(cls);
            while (!pattern.test(p.className) && p && (Node.DOCUMENT_NODE !== p.nodeType)) {
                p = p.parentNode;
            }

            if (p && (Node.DOCUMENT_NODE !== p.nodeType)) {
                return new Dom(p);
            } else {
                return false;
            }
        },
        // append a node to the current node children list
        // wrapper for the native API
        appendDomNode : function appendDomNode (domNode) {
            this.getDomObject().appendChild(domNode);

            return this;
        },
        // append a node on top to the current node children list
        // wrapper for the native API
        prependDomNode : function prependDomNode (domNode) {
            //var ref = this..getDomObject().firstChild;
            //console.log(this..getDomObject())
            this.getDomObject().insertBefore(domNode, this.getDomObject().firstChild);

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
        // append a node on top to the current node children list
        // can be a native DOMObject or a oo.Dom object
        prependChild : function prependChild (node) {
            if (node instanceof Dom)
            {
                this.prependDomNode(node.getDomObject());
            } else {
                this.prependDomNode(node);
            }

            return this;
        },
        appendHtml : function appendHtml (html) {
            this.getDomObject().innerHTML = [this.getDomObject().innerHTML, html].join('');

            return this;
        },
        removeChild : function removeChild(node){
            this.getDomObject().removeChild(node);
        },
        clear : function clear () {
            this.getDomObject().innerHTML = '';

            return this;
        },
        // stop animation by setting the duration to 0
        stopAnimation : function stopAnimation () {
            this.setWebkitTransitionDuration(0, 'ms');
            this.getDomObject().removeEventListener('webkitTransitionEnd');

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
                coord.x = 'undefined' !== typeof coord.x ? coord.x : this.getTranslateX();
                coord.y = 'undefined' !== typeof coord.y ? coord.y : this.getTranslateY();
            }



            // getWebkitTransitionDuration() returns a value in seconds
            var currentTransitionDuration = (this.getWebkitTransitionDuration() * 1000);
            duration = duration || 0;
            this.setWebkitTransitionDuration(duration, 'ms');

            var currentTimingFunction = this.getWebkitTransitionTimingFunction();
            if (typeof timingFunction === 'string') {
                this.setWebkitTransitionTimingFunction(timingFunction, '');
            }

            var that = this, endListener = function endListener (e) {
                that.getDomObject().removeEventListener('webkitTransitionEnd', this);
                that.setWebkitTransitionDuration(currentTransitionDuration, 'ms');
                that.setWebkitTransitionTimingFunction(currentTimingFunction, '');
                if (listener) {
                    listener.call(that, e);
                }
            };
            this.getDomObject().addEventListener('webkitTransitionEnd', endListener, false);

            this.setTranslations(coord.x, coord.y);

            return this;
        },
        setId: function setId(id) {
            this.getDomObject().id = id;
        },
        getId: function getId(id) {
            return this.getDomObject().id;
        },
        setTemplate : function setTemplate (tpl) {
            this._template = tpl;

            return this;
        },
        // deprecated
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
    
})(oo);
