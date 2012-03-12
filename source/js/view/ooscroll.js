(function (oo) {

    // shorthand
    var Dom = oo.view.Dom, Touch = oo.core.Touch;
    
    var Scroll = oo.getNS('oo.view').Scroll = oo.Class(null, oo.core.mixins.Events, {
        STATIC : {
            VERTICAL : 'v',
            HORIZONTAL : 'h',
            BOTH : 'b',
            NONE : 'none'
        },
        _wrapper: null,
        _content: null,
        _orientation: null,
        _displayScroll: null,
        _maxvScrollTranslate: null,
        _maxhScrollTranslate: null,
        _startY: 0,
        _startX: 0,
        _touchStartY: null,
        _touchInterY: null,
        _touchStartX: null,
        _touchInterX: null,
        _startTime: null,
        _sections: {x:[], y:[]},
        _currentSection: {x:0, y:0},
        constructor : function constructor(identifier, orientation, displayScroll) {
            
            this._wrapper = new Dom(identifier);
            this._content = this._wrapper.find('.content');

            this._wrapper.classList.addClass('oo-list-wrapper');

            this._orientation = orientation || Scroll.VERTICAL;
            this._displayScroll = displayScroll || Scroll.BOTH;

            // due to a bug in the oo.Dom cache management this value couldn't be set in the constructor
            // this._maxVScrollTranslate = (this._wrapper.getHeight() - this._vscrollbar.getHeight());

            this._buildScrollbars();

            this.initSizes();

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
            var stopPropagationX = false;
            var stopPropagationY = false;

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

                that._startTime = (new Date()).getTime();
                that._startY = that._content.getTranslateY(false, true);
                that._startX = that._content.getTranslateX(false, true);

            }, false);

            // move event listener
            listNode.addEventListener(Touch.EVENT_MOVE, function (e) {

                var newPos, currentSection;

                var diffY = Touch.getPositionY(e) - that._touchStartY;
                var diffX = Touch.getPositionX(e) - that._touchStartX;

                if ((Scroll.VERTICAL == that._orientation && (Math.abs(diffX) < 5) || stopPropagationY) || Scroll.BOTH == that._orientation) {
                    diff = Touch.getPositionY(e) - that._touchStartY;
                    newPos = that._startY + diffY;

                    if( !stopPropagationY && Math.abs(diffY) > 2) {
                      stopPropagationY = true;
                    }

                    if(stopPropagationY){
                      e.stopPropagation();
                    }

                    // new pos will mainly be negatve, so the minus prefix force it to positive value (to compare with sections)
                    for (var i=that._sections.y.length - 1 ; i>=0 && -newPos < that._sections.y[i]; i--);

                    currentSection = (i <= 0 ? 0 : i);
                    if (currentSection !== that._currentSection.y)
                        that.triggerEvent('sectionChange', [currentSection, that._currentSection.y]);

                    that._currentSection.y = currentSection;

                    that._content.setTranslateY(newPos);
                    that._vscrollbar.setTranslateY(that._determineScrollbarTranslate(newPos, Scroll.VERTICAL));
                }

                if ((Scroll.HORIZONTAL == that._orientation && (Math.abs(diffY) < 5) || stopPropagationX)  || Scroll.BOTH == that._orientation) {
                    diff = Touch.getPositionX(e) - that._touchStartX;
                    newPos = that._startX + diffX;

                    if( !stopPropagationX && Math.abs(diffX) > 2) {
                      stopPropagationX = true;
                    }

                    if(stopPropagationX){
                      e.stopPropagation();
                    }

                    // new pos will mainly be negatve, so the minus prefix force it to positive value (to compare with sections)
                    for (var j=that._sections.x.length - 1 ; j>=0 && -newPos < that._sections.x[j]; j--);

                    currentSection = (j <= 0 ? 0 : j);
                    if (currentSection !== that._currentSection.x)
                        that.triggerEvent('sectionChange', [currentSection, that._currentSection.x]);

                    that._currentSection.x = currentSection;

                    that._content.setTranslateX(newPos);
                    that._hscrollbar.setTranslateX(that._determineScrollbarTranslate(newPos, Scroll.HORIZONTAL));
                }

                touchMoveTempo++;
                // if (touchMoveTempo > 300) {
                    that._touchInterY = Touch.getPositionY(e);
                    that._touchInterX = Touch.getPositionX(e);
                //     that._startTime = (new Date()).getTime();
                //     touchMoveTempo = 0;
                // }

                e.preventDefault();

            }, false);

            // end event listener
            listNode.addEventListener(Touch.EVENT_END, function (e) {

                var stopTime = (new Date()).getTime();
                var duration = stopTime - that._startTime;
                var deceleration = 0.006;
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
                        that._content.translateTo(coord, newTime, function () { that._content.stopAnimation(); }, 'ease-out');

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

                stopPropagationX = false;
                stopPropagationY = false;

            }, false);
        },
        scrollTo: function scrollTo (val, direction) {
            var coord = {};
            if (2 === arguments.length)
                coord[(Scroll.VERTICAL == direction && (direction == this._orientation || this._orientation == Scroll.BOTH) ? 'y' : 'x')] = - val;
            else if (typeof val === 'object')
                coord = val;

            if ('x' in coord || 'y' in coord) {
                if ('x' in coord)
                    coord.x = Math.max(Math.min(coord.x , 0), this._maxhTranslate);
                if ('y' in coord)
                    coord.y = Math.max(Math.min(coord.y , 0), this._maxvTranslate);

                this._content.translateTo(coord, 1000);
            }

        },
        setSections: function setSections (sectionsX, sectionsY) {
            this._sections = {x:sectionsX, y:sectionsY};
        },
        // render elements of the component
        _render : function _render(){

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

})(oo || {});
