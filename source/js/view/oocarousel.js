/*
 * Carousel :
 * @selector : the dom selector of the container
 * @pager : Boolean
 * @items : Array of Panel object
 */

var oo = (function (oo) {

    // shorthand
    var Dom = oo.view.Dom, Touch = oo.core.Touch, ns = oo.getNS('oo.view');
    
    
    var Carousel = ns.Carousel = my.Class(oo.view.Element, {
        _datas : null,
        _elementCls : null,
        _items : [],
        _available : true,
        _newPanel : null,
        _upPrev : false,
        _upNext : false,
        _fromLimit:true,
        constructor : function constructor(opt) {
            if(!opt){
                throw new Error('Missing options');
            }

            this._startX = 0;
            this._startTranslate = 0;

            var conf = {
                target: opt.el || (document.createElement('div'))
            };


            Carousel.Super.call(this, conf);
            
            this._transitionDuration = 200;

            if (opt){
                if(!opt.hasOwnProperty('model') || !opt.hasOwnProperty('elementCls')){
                    throw new Error('Options passed but missing model or elementCls');
                }

                if('[object Object]' !== Object.prototype.toString.call(opt.elementCls)){
                    throw new Error('elementCls must be an object');
                }
                
                this._elementCls = opt.elementCls;
                this._prepareView(opt.model);
            }
            
            this._nbPanel = this._datas.length -1 || document.querySelectorAll([opt.el, ' > *'].join('')).length;
            this._panelWidth = (new Dom(this.getDomObject().firstElementChild)).getWidth();
            

            this._activePanel = 0;
            this._displayPager = (opt.pager ? true : false);

            this._pager = null;
            this._buildPager();

            this._moved = false;

            this.render();
        },
        _prepareView : function _prepareView(model){
            var that = this;
            model.fetch(function(datas){
                that._datas = datas;
                that._addPanel(0);
                that._addPanel(1);
                //that._addPanel(2);
            });
        },
        _addPanel : function _addPanel(id, before){
            var item = this._getItem(id);

            this[(before ? 'prependChild': 'appendChild')](item.getDomObject());
        },
        showPanel : function showPanel(id){
            if('undefined' === typeof id){
                throw new Error("Missing 'id' of the panel");
            }

            if(!this._available) return;

            this._available = false;

            //before transition
            if(id > this._activePanel+1){
                this._updateNext(id);
                this._upPrev = true;
            }
            
            if(id < this._activePanel-1){
                this._updatePrev(id);
                this._upNext = true;
            }

            //setTransition
            
            var s = (id < this._activePanel ? +1 : -1 ), nT;


            if(id >= 0 && id <= this._nbPanel){
                nT =  this._startTranslate + s * this._panelWidth;
            } else {
                if(id < 0){
                    nT = 0;
                    id=0;
                } else {
                    nT =  this._startTranslate;
                    id = this._nbPanel;
                }
            }
            this._items[id].onEnable();
            this.translateTo({x:nT}, this._transitionDuration);
            this._startTranslate = nT;
            //store new id for endTransition
            this._newPanel = id;
        },
        _updateNext : function _updateNext(nextId){
            //remove last
            this.removeChild(this.getDomObject().lastChild);

            //appendChild
            this._addPanel(nextId);
        },
        _updatePrev : function _updatePrev(idPrev){
            this.removeChild(this.getDomObject().firstChild);
            this._addPanel(idPrev,true);
        },
        _getItem : function _getItem(id){
            var item = this._items[id];
            if(!item){
                item = this._items[id] = this._prepareItem(id);
            }
            return item;
        },
        _prepareItem : function _prepareItem(id){
            var item , elementCls = this._datas[id].elementCls;

            if( 'undefined' === this._elementCls[elementCls] || 'function' !== typeof this._elementCls[elementCls]){
                throw new Error('element Cls must exist and be a function');
            }

            item = new this._elementCls[elementCls]();
            item.appendHtml(item.render(this._datas[id]));

            return item;
        },
        /*pager*/
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
            if (this._displayPager) {
                var current = this._pager.getDomObject().querySelector('.dot.active');
                if (current) {
                    current.className = current.className.replace(/ *active/, '');
                }
                this._pager.getDomObject().querySelector(['.dot:nth-child(', (this._activePanel + 1), ')'].join('')).className += ' active';
            }
        },
        hasMoved : function hasMoved() {
            return this._moved;
        },
        _initListeners : function _initListeners(){
            var listNode = this.getDomObject();
            var that = this;
            var touchMoveTempo;

            listNode.addEventListener(Touch.EVENT_START, function (e) {
                if(that._available){
                    that._startX = Touch.getPositionX(e);
                    that._startTranslate = that.getTranslateX();
                    touchMoveTempo = 0;
                }
            }, false);

            listNode.addEventListener(Touch.EVENT_MOVE, function (e) {
                if(that._available){
                    var diff = Touch.getPositionX(e) - that._startX;

                    that.translateTo({x:(that._startTranslate + diff)}, 0);
                    that._moved = true;
                }
            }, false);

            listNode.addEventListener(Touch.EVENT_END, function () {
                if(that._available){
                    that._moved = false;

                    var cVal = that.getTranslateX(),
                        diff = cVal - that._startTranslate;

                    if(Math.abs(diff) > 50){
                        if( cVal - that._startTranslate < 0 ){
                            that.onSwipeRight();
                        } else {
                            that.onSwipeLeft();
                        }
                    } else {
                        that.translateTo({x:(that._startTranslate)}, that._transitionDuration);
                    }
                    
                    
                    /*if (cVal < 0) {

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
                    }*/

                    //that._activePanel = Math.abs(tVal / that._panelWidth);

                    that._updatePager();

                    //that.translateTo({x:tVal}, that._transitionDuration);
                    //that._startTranslate = tVal;
                }
            }, false);

            window.addEventListener("orientationchange",function(){
                that.refresh.call(that);
            },false);

            //swipe
            /*listNode.addEventListener('swipeRight',function(e){
                that.onSwipeRight.call(that);
            },false);

            listNode.addEventListener('swipeLeft',function(e){
                that.onSwipeLeft.call(that);
            },false);*/

            listNode.addEventListener('webkitTransitionEnd',function(e){
                that.onEndTransition.apply(that);
                
            },false);
        },
        onSwipeRight : function onSwipeRight(){
            this.showPanel(this._activePanel + 1);
        },
        onSwipeLeft : function onSwipeLeft(){
            this.showPanel(this._activePanel - 1);
        },
        onEndTransition : function onEndTransition(){
            //mmmmmm
            if(this._activePanel == this._newPanel) {
                this._available = true;
                return;
            }

            if(this._newPanel > this._activePanel){
                if(!this._fromLimit){

                    //already 3 items in the carousel
                    this.removeChild(this.getDomObject().firstChild);
                    this.translateTo({x:this._startTranslate + this._panelWidth});
                    this._startTranslate = this._startTranslate + this._panelWidth;
                }

                if(this._newPanel < this._nbPanel){
                    this._addPanel(this._newPanel+1);
                }
            }

            if(this._newPanel < this._activePanel){
                if(!this._fromLimit){
                    this.removeChild(this.getDomObject().lastChild);
                }

                if(this._newPanel > 0){
                    this.translateTo({x:this._startTranslate - this._panelWidth});
                    this._addPanel(this._newPanel-1, true);
                    this._startTranslate = this._startTranslate - this._panelWidth;
                }
            }

            if(this._upPrev){
                this._updatePrev(this._newPanel -1);
                this._upPrev = false;
            }
            if(this._upNext){
                this._updateNext(this._newPanel +1);
                this._upNext = false;
            }
            

            this._fromLimit = (this._newPanel < 1 || this._newPanel == this._nbPanel) ? true : false;

            this._activePanel = this._newPanel;
            this._available = true;
        },
        render : function render(){
            // update css if needed
            if (this._pager) {
                (new Dom(this.getDomObject().parentNode)).appendChild(this._pager);
            }

            this._initListeners();
        },
        refresh : function refresh(){
            //get new with and translate to _startTranslate
            var oldW = this._panelWidth, diff;
            this._panelWidth = (new Dom(this.getDomObject().firstElementChild)).getWidth();

            diff = oldW - this._panelWidth;

            this.translateTo({x:this._startTranslate + diff},0);
            this._startTranslate = this._startTranslate + diff;
        }
    });
    

    oo.view.Element.register(Carousel, 'carousel');
    
    return oo;
    
})(oo || {});
