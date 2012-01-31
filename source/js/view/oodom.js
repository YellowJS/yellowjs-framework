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
                var n = document.querySelector(identifier);
                if (null === n)
                    throw "Invalid selector node doesn't exists";

                this.setDomObject(n);
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
            var p = this, i, len;
            /**
             * generates accessors fonction
             */
            for (i=0, len=prop.readOnly.length; i<len; i++) {
                eval(['p.get', prop.readOnly[i].charAt(0).toUpperCase(), prop.readOnly[i].slice(1), ' = function (unit, noCache) { if (noCache || !this._cached[[\'', prop.readOnly[i], '\',(unit ? \'u\' : \'\')].join(\'\')]) { this._cached[[\'', prop.readOnly[i], '\',(unit ? \'u\' : \'\')].join(\'\')] = (unit ? window.getComputedStyle(this._dom).', prop.readOnly[i], ' : (window.getComputedStyle(this._dom).', prop.readOnly[i], ').replace(/s|ms|px|em|pt|%/, \'\')); this._cached[[\'', prop.readOnly[i], '\',(unit ? \'u\' : \'\')].join(\'\')] = parseInt(this._cached[[\'', prop.readOnly[i], '\',(unit ? \'u\' : \'\')].join(\'\')], 10) || this._cached[[\'', prop.readOnly[i], '\',(unit ? \'u\' : \'\')].join(\'\')]; } return this._cached[[\'', prop.readOnly[i], '\', (unit ? \'u\' : \'\')].join(\'\')]; };'].join(''));
            }

            for (i=0, len=prop.readWrite.length; i<len; i++) {
                eval(['p.get', prop.readWrite[i].charAt(0).toUpperCase(), prop.readWrite[i].slice(1), ' = function (unit, noCache) { if (noCache || !this._cached[[\'', prop.readWrite[i], '\',(unit ? \'u\' : \'\')].join(\'\')]) { this._cached[[\'', prop.readWrite[i], '\',(unit ? \'u\' : \'\')].join(\'\')] = (unit ? window.getComputedStyle(this._dom).', prop.readWrite[i], ' : (window.getComputedStyle(this._dom).', prop.readWrite[i], ').replace(/s|ms|px|em|pt|%/, \'\')); this._cached[[\'', prop.readWrite[i], '\',(unit ? \'u\' : \'\')].join(\'\')] = parseInt(this._cached[[\'', prop.readWrite[i], '\',(unit ? \'u\' : \'\')].join(\'\')], 10) || this._cached[[\'', prop.readWrite[i], '\',(unit ? \'u\' : \'\')].join(\'\')]; } return this._cached[[\'', prop.readWrite[i], '\', (unit ? \'u\' : \'\')].join(\'\')]; };'].join(''));
                eval(['p.set', prop.readWrite[i].charAt(0).toUpperCase(), prop.readWrite[i].slice(1), ' = function (val, unit) { if (this._cached[\'', prop.readWrite[i], '\'] || this._cached[[\'', prop.readWrite[i], '\', \'u\'].join(\'\')]) { this._cached[\'', prop.readWrite[i], '\'] = this._cached[[\'', prop.readWrite[i], '\', \'u\'].join(\'\')] = null; } this._dom.style.', prop.readWrite[i], ' = [val, (undefined !== unit ? unit : \'\')].join(\'\'); return this };'].join(''));
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
                this._cached.webkitTransform = window.getComputedStyle(this._dom).webkitTransform;
            }
            return this._cached.webkitTransform;
        },
        setWebkitTransform : function setWebkitTransform (value) {
            if (this._cached.webkitTransform || this._cached.webkitTranslations) {
                this._cached.webkitTransform = null;
                this._cached.webkitTranslations = null;
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

            if (this._dom && !('id' in this._dom)) {
                this._dom.id = oo.generateId(this._dom.tagName);
            }

            return this;
        },
        // getter for internal dom object
        getDomObject : function getDomObject () {
            return this._dom;
        },
        // find a child element of the current node according to the given selector
        find : function find (selector) {
            var n = this._dom.querySelector(selector);
            if (null === n)
                return null;
            else
                return new Dom(n);
        },
        findParentByCls : function findParentByCls (cls) {
            var p = this._dom.parentNode;
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
            this._dom.appendChild(domNode);

            return this;
        },
        // append a node on top to the current node children list
        // wrapper for the native API
        prependDomNode : function prependDomNode (domNode) {
            //var ref = this._dom.firstChild;
            //console.log(this._dom)
            this._dom.insertBefore(domNode, this._dom.firstChild);

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
        prepend : function prepend (node) {
            if (node instanceof Dom)
            {
                this.prependDomNode(node.getDomObject());
            } else {
                this.prependDomNode(node);
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
                coord.x = 'undefined' !== typeof coord.x ? coord.x : this.getTranslateX();
                coord.y = 'undefined' !== typeof coord.y ? coord.y : this.getTranslateY();
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
                }
            };
            this._dom.addEventListener('webkitTransitionEnd', endListener, false);

            this.setTranslations(coord.x, coord.y);

            return this;
        },
        setId: function setId(id) {
            this._dom.id = id;
        },
        getId: function getId(id) {
            return this._dom.id;
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
