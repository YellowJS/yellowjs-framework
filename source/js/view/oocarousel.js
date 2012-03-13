/*
 * Carousel :
 * @selector : the dom selector of the container
 * @pager : Boolean
 * @items : Array of Panel object
 * 
 */
var oo = (function (oo) {

    // shorthand
    var Dom = oo.view.Dom, Touch = oo.core.Touch, ns = oo.getNS('oo.view');
    
    var Carousel = ns.Carousel = oo.Class(oo.view.ModelElement, oo.core.mixins.Events, {
        STATIC : {
            EVENT_ON : "EVENT_ON",
            EVENT_GOTO : "EVENT_GOTO",
            EVENT_PRESS:"EVENT_PRESS",
            CLS_SHOWING : "is-showing",
            CLS_ACTIVE : "item-active"
        },
        _datas : null,
        _elementCls : null,
        _items : null,
        _available : true,
        _newPanel : null,
        _upPrev : false,
        _upNext : false,
        _fromLimit:true,
        _activePanel: null,
        _transitionType : "Slide",
        _swipe : false,
        _pagerOpt : false,
        _startX : null,
        _currentTranslate : null,
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
            this._transitionDuration = opt.duration || 200;
            this._items = [];

            //todo default option with override
            if(opt && opt.hasOwnProperty('transitionType')){
                this._transitionType = opt.transitionType.charAt(0).toUpperCase() + opt.transitionType.slice(1);
                delete opt.transitionType;
            }

            if(opt && opt.hasOwnProperty('swipe')){
                this._swipe = true;
                delete opt.swipe;
            }

            if(opt && opt.hasOwnProperty('pager')){
                this._pagerOpt = opt.pager;
                delete opt.pager;
            }
            if (opt && opt.hasOwnProperty('model')){
                if(!opt.hasOwnProperty('elementCls')){
                    throw new Error('Options passed but missing elementCls');
                }

                if('[object Object]' !== Object.prototype.toString.call(opt.elementCls)){
                    throw new Error('elementCls must be an object');
                }
                
                this._elementCls = opt.elementCls;
                delete opt.elementCls;
                this._prepareModel(opt.model);
            } else {
              this._prepareView();
            }
            
        },
        _prepareModel : function _prepareModel(model){
          var that = this;
            this.setModel(model);
            //this.after
            this._model.fetch(function(datas){
                that._datas = datas;
                that._addPanel(0);
                that._addPanel(1);
                that._prepareView();
            });
        },
        updateModel : function updateModel(model){
            this.clear();
            this._items = [];
            this._available = true;
            this._datas = null;
            this._available = true;
            this._newPanel = null;
            this._upPrev = false;
            this._upNext = false;
            this._fromLimit = true;
            this._activePanel = null;
            this._prepareModel(model);
        },
        _prepareView : function _prepareView(){
            this._nbPanel = this._datas.length -1 || document.querySelectorAll([this._identifier, ' > *'].join('')).length;
            this._panelWidth = (new Dom(this.getDomObject().firstElementChild)).getWidth();
            var c = this.getDomObject().children, i = 0, len = c.length;

            for ( i ; i < len; i++){
              c[i].style.width = this._panelWidth + 'px';
            }

            this._activePanel = 0;
            this['_prepareView'+this._transitionType]();

            this._displayPager = this._pagerOpt;

            this._pager = null;
            this._buildPager();

            this._moved = false;

            this.render();
        },
        _prepareViewSlide : function _prepareViewSlide(){
            this.setWidth( (this._model) ? this._panelWidth*3 : this._panelWidth*this._nbPanel ,'px' );
        },
        _prepareViewCustom : function _prepareViewCustom(){
            //put current elem on top
            this._items[this._activePanel].classList.addClass(Carousel.CLS_ACTIVE);
        },
        _addPanel : function _addPanel(id, before){
            var item = this._getItem(id);
            if(this._panelWidth){
              item.setWidth(this._panelWidth,'px');
            }

            this[(before ? 'prependChild': 'appendChild')](item.getDomObject());
            item.onEnable();

        },
        isAvailable : function isAvailable(){
          return this._available;
        },
        showPanel : function showPanel(id){
            if('undefined' === typeof id){
                throw new Error("Missing 'id' of the panel");
            }

            //disable pager slider
            if(this._pager && this._pager instanceof oo.view.Slider){
                this._pager.setDisabled();
            }

            if( id !== this._activePanel && this._datas[id] && this._available){
                //before transition add the new panel if it not in the dom
                if(id > this._activePanel+1){
                    this._updateNext(id);
                    this._upPrev = true;
                }
                
                if(id < this._activePanel-1){
                    this._updatePrev(id);
                    this._upNext = true;
                }
            }
            
            this._available = false;
            
            
            var s = (id < this._activePanel ? +1 : -1 );
            this["_setTransition"+this._transitionType](id, s);
            
            this.triggerEvent(Carousel.EVENT_GOTO, [this._newPanel]);
            this._updatePager(this._newPanel);

            if (this._newPanel === this._activePanel) {
              this._available = true;
                  if (this._pager && this._pager instanceof oo.view.Slider){
                    //enable pager slider
                    this._pager.setEnabled();
                }
            }

        },
        _setTransitionSlide: function _setTransitionSlide(id, s){
            var nT;
            if(id >= 0 && id <= this._nbPanel && id !== this._activePanel){
                //nT =  this._startTranslate + s * this._panelWidth;
                nT =  this._currentTranslate + s * this._panelWidth;
                
            } else {
                if( id === this._activePanel) {
                    nT =  this._currentTranslate;
                } else {
                   if(id < 0){
                        nT = 0;
                        id = 0;
                    } else {
                        nT =  this._currentTranslate;
                        id = this._nbPanel;
                    }
                }
            }

            this.translateTo({x:nT}, this._transitionDuration);
            this._currentTranslate = nT;

            //store new id for endTransition
            this._newPanel = id;
        },
        _setTransitionCustom: function _setTransitionCustom(id, s){
            var that = this;
            //limite
            if(id < 0){
                id = 0;
            } else {
                if(id > this._nbPanel){
                    id = this._nbPanel;
                }
            }
            
            if(id !== this._activePanel && !this._items[id].classList.hasClass(Carousel.CLS_SHOWING)) {
                if(!this._items[id].isInit){
                    this._items[id].getDomObject().addEventListener('webkitTransitionEnd',function(){
                        that.onEndTransition.apply(that);
                    },false);

                    this._items[id].isInit = true;
                }

                setTimeout(function(){
                    that._items[id].classList.addClass(Carousel.CLS_SHOWING);
                },1);
                
                //store new id for endTransition
            } else {
                //no transition
                this._available = true;
            }
            
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
            var items = this._items;
            if (!items[id]) {
                items[id] = this._prepareItem(id);
            }

            return items[id];
        },
        _prepareItem : function _prepareItem(id){
            var item , elementCls = this._datas[id].elementCls, that = this;

            if( 'undefined' === this._elementCls[elementCls] || 'function' !== typeof this._elementCls[elementCls]){
                throw new Error('element Cls must exist and be a function');
            }

            item = new this._elementCls[elementCls]();


            
            item.data = this._datas[id];

            item.appendHtml(item.render(item.data));
            

            return item;
        },
        /*pager*/
        _buildPager : function _buildPager() {
            if (this._displayPager) {
                if( 'boolean' === typeof this._displayPager) {
                  this._buildPagerItem();
                } else {
                    this._pager = this._displayPager;
                    if (this._displayPager instanceof oo.view.List){
                        this._buildPagerList();
                    }

                    if (this._displayPager instanceof oo.view.Slider){
                        this._buildPagerSlider();
                    }
                  
                    if(this._displayPager instanceof oo.view.PagerPrevNext){
                        this._buildPagerPrevNext();
                    }
                }
            }

            //this._updatePager(this._activePanel);
        },
        _buildPagerItem : function _buildPagerItem(){
          this._pager = Dom.createElement('div');
          this._pager.classList.addClass('carousel-pager');

          this._pager.setTemplate('{{#bullet}}<i class="dot"></i>{{/bullet}}');

          var data = [];
          for(var i=0; i<this._nbPanel; i++) {
              data.push(i);
          }

          this._pager.render({bullet: data});
        },
        _buildPagerList : function _buildPagerList(){
          var that = this;
          this._pager.addListener(oo.view.List.EVT_ITEM_RELEASED, function(dom, id){
            if(parseInt(id,10) === that._activePanel || !that._available) return;

            that.showPanel(parseInt(id,10));
          });
        },
        _buildPagerSlider : function _buildPagerSlider(){
            var that = this;
            this._pager.addListener(oo.view.SliderCursor.EVT_ONGOTO, function(key){
                if(that.isAvailable()){
                    that.showPanel(key);
                }
            });
        },
        _buildPagerPrevNext : function _buildPagerPrevNext(){
            var that = this;
            this._pager.addListener(oo.view.PagerPrevNext.goToNext, function(){
                that.goToNext.call(that);
            });

            this._pager.addListener(oo.view.PagerPrevNext.goToPrev, function(){
                that.goToPrev.call(that);
            });
        },
        _updatePager : function _updatePager(id) {
          
            if (this._displayPager) {
                if( 'boolean' === typeof this._displayPager) {
                  var current = this._pager.getDomObject().querySelector('.dot.active');
                  if (current) {
                      current.className = current.className.replace(/ *active/, '');
                  }
                  this._pager.getDomObject().querySelector(['.dot:nth-child(', (this._activePanel + 1), ')'].join('')).className += ' active';
                } else {
                    
                    /*if (this._pager instanceof oo.view.List){
                    
                    }*/

                    if (this._pager instanceof oo.view.Slider){
                        this._pager.goTo(id);
                    }
                  
                    if(this._pager instanceof oo.view.PagerPrevNext){
                        if(0 === id){
                            this._pager.buttonPrev.classList.addClass(oo.view.PagerPrevNext.CLS_DISABLE);
                        } else {
                            this._pager.buttonPrev.classList.removeClass(oo.view.PagerPrevNext.CLS_DISABLE);
                        }

                        if(this._nbPanel === id){
                            this._pager.buttonNext.classList.addClass(oo.view.PagerPrevNext.CLS_DISABLE);
                        } else {
                            this._pager.buttonNext.classList.removeClass(oo.view.PagerPrevNext.CLS_DISABLE);
                        }
                    }
                }
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
                    that['_transitionStart'+that._transitionType]();
                    touchMoveTempo = 0;
                    that.triggerEvent(Carousel.EVENT_PRESS);
                }
            }, false);

            listNode.addEventListener(Touch.EVENT_MOVE, function (e) {
                if(e.type == "mousemove") return;
                if(that._available){
                    var diff = Touch.getPositionX(e) - that._startX;
                    that['_transitionMove'+that._transitionType](diff);
                    
                    that._moved = true;
                }
            }, false);

            listNode.addEventListener(Touch.EVENT_END, function () {
                if(that._available){
                    that._moved = false;
                    var cVal = that.getTranslateX(),
                        diff = cVal - that._startTranslate;
                        that['_transitionEnd'+that._transitionType](cVal, diff);
                    
                    
                    
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
                    

                    //that.translateTo({x:tVal}, that._transitionDuration);
                    //that._startTranslate = tVal;
                }

            }, false);

            window.addEventListener("orientationchange",function(){
                that.refresh.call(that);
            },false);

            //swipe
            if(this._swipe){
                listNode.addEventListener('swipeRight',function(e){
                    that.goToNext();
                },false);

                listNode.addEventListener('swipeLeft',function(e){
                    that.goToPrev();
                },false);
            }
            
            if(this._transitionType !== "Custom"){
                listNode.addEventListener('webkitTransitionEnd',function(e){
                    that.onEndTransition.apply(that);
                },false);
            }
            /*listNode.addEventListener('webkitTransitionEnd',function(e){
                that.onEndTransition.apply(that);
            },false);*/
        },
        _transitionStartSlide : function _transitionStartSlide(){
            this._startTranslate = this.getTranslateX();
        },
        _transitionMoveSlide : function _transitionMoveSlide(diff){
            this.translateTo({x:(this._startTranslate + diff)}, 0);
        },

        _transitionEndSlide : function _transitionEndSlide(cVal,diff){
            if(Math.abs(diff) > 50){
                if( cVal - this._startTranslate < 0 ){
                    this.goToNext();
                } else {
                    this.goToPrev();
                }
            } else {
                this.translateTo({x:(null !== this._currentTranslate) ? this._currentTranslate : (this._currentTranslate = this._startTranslate)}, this._transitionDuration);
                
            }
        },
        _transitionStartCustom : function _transitionStartCustom(){
        },
        _transitionMoveCustom : function _transitionMoveCustom(){
        },
        _transitionEndCustom : function _transitionEndCustom(){
        },
        goToNext : function goToNext(){
            if(this._available){
                this.showPanel(this._activePanel + 1);
            }
        },
        goToPrev : function goToPrev(){
            if(this._available){
                this.showPanel(this._activePanel - 1);
            }
        },
        onEndTransition : function onEndTransition(){
            //mmmmmm
            if(this._activePanel == this._newPanel) {
                this._available = true;
                return;
            }

            this['_endTransition' + this._transitionType](this._newPanel);

            if(this._newPanel > this._activePanel){
                if(!this._fromLimit){

                    //already 3 items in the carousel
                    this.removeChild(this.getDomObject().firstChild);
                    if(this._transitionType == "Slide"){
                        this.translateTo({x:this._currentTranslate + this._panelWidth});
                        this._currentTranslate = this._currentTranslate + this._panelWidth;
                    }
                    
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
                    
                    
                    if(this._transitionType == "Slide"){
                        this.translateTo({x:this._currentTranslate - this._panelWidth});
                    }
                    this._addPanel(this._newPanel-1, true);
                    if(this._transitionType == "Slide"){
                        this._currentTranslate = this._currentTranslate - this._panelWidth;
                    }
                    
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
            
            if (this._pager && this._pager instanceof oo.view.Slider){
                //enable pager slider
                this._pager.setEnabled();
            }

            this.triggerEvent(Carousel.EVENT_ON, [this._activePanel]);
        },
        _endTransitionSlide : function _endTransitionSlide(id){

        },
        _endTransitionCustom : function _endTransitionCustom(id){
            this._items[id].classList.removeClass(Carousel.CLS_SHOWING);
            this._items[this._activePanel].classList.removeClass(Carousel.CLS_ACTIVE);
            this._items[id].classList.addClass(Carousel.CLS_ACTIVE);
        },
        render : function render(){
            // update css if needed
            if (this._pager ) {
                if('boolean' === typeof this._displayPager){
                    (new Dom(this.getDomObject().parentNode)).appendChild(this._pager);
                } else {
                    //render list
                    if (this._pager instanceof oo.view.List){
                        this._pager.appendHtml(this._pager.render(this._datas));
                    }
                    
                }
                
            }

            this._initListeners();
        },
        refresh : function refresh(){
            //get new with and translate to _startTranslate
            var oldW = this._panelWidth, diff;
            this._panelWidth = (new Dom(this.getDomObject().firstElementChild)).getWidth();

            diff = oldW - this._panelWidth;

            this.translateTo({x:this._currentTranslate + diff},0);
            this._startTranslate = this._currentTranslate + diff;
        },
        getPanel : function getActivePanel(id){
            if( undefined === id){
                throw new Error('Missing id');
            }
            if(!this._items) return;

            return this._items[id];
        }
    });
    

    oo.view.Element.register(Carousel, 'carousel');
    
    return oo;
    
})(oo || {});
