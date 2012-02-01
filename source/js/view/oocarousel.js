/*
 * Carousel :
 * @selector : the dom selector of the container
 * @pager : Boolean
 * @items : Array of Panel object
 */

var oo = (function (oo) {

    // shorthand
    var Dom = oo.view.Dom, Touch = oo.core.Touch;
    
    
    var Carousel = my.Class(oo.view.Element, {
        _datas : null,
        _elementCls : null,
        _items : [],
        constructor : function constructor(selector, pager, opt) {
            this._startX = 0;
            this._startTranslate = 0;

            var conf = {
                target: selector
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
            
            this._nbPanel = this._datas.length || document.querySelectorAll([selector, ' > *'].join('')).length;
            this._panelWidth = (new Dom(this.getDomObject().firstElementChild)).getWidth();
            

            this._activePanel = 0;
            this._displayPager = (pager ? true : false);

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
            });
        },
        _addPanel : function _showPanel(id, before){
            var item = this._items[id];
            if(!item){
                item = this._items[id] = this._prepareItem(id);
            }

            this[(before ? 'prepend': 'appendChild')](item.getDomObject());
        },
        _prepareItem : function _prepareItem(id){
            var item , elementCls = this._datas[id].elementCls;

            if( 'undefined' === this._elementCls[elementCls] || 'function' !== typeof this._elementCls[elementCls]){
                throw new Error('element Cls must exist and be a function');
            }

            //if( this._elementCls[elementCls] && 'function' === typeof this._elementCls[elementCls]){
                item = new this._elementCls[elementCls]();
                item.appendHtml(item.render(this._datas[id]));
            //}

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
                that._startX = Touch.getPositionX(e);
                that._startTranslate = that.getTranslateX();
                touchMoveTempo = 0;
            }, false);

            listNode.addEventListener(Touch.EVENT_MOVE, function (e) {
                var diff = Touch.getPositionX(e) - that._startX;

                that.translateTo({x:(that._startTranslate + diff)}, 0);
                that._moved = true;
            }, false);

            listNode.addEventListener(Touch.EVENT_END, function () {
                that._moved = false;

                var cVal = that.getTranslateX();
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

                that.translateTo({x:tVal}, that._transitionDuration);

                that._updatePager();

                that._startTranslate = tVal;
            }, false);

            //swipe
            
        },
        render : function render(){
            
            // update css if needed
            if (this._pager) {
                (new Dom(this.getDomObject().parentNode)).appendChild(this._pager);
            }

            this._initListeners();
        }
    });
    
    var exports = oo.getNS('oo.view');
    exports.Carousel = Carousel;
    
    return oo;
    
})(oo || {});
