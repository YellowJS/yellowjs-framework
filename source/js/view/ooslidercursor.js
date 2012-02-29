/**
 * Slider with a cursor and an overlay preview (optional)
 *
 * @namespace oo.view
 * @target : domElement or queryString
 * @cursor : domElement or queryString (will be move on touch events)
 * @model : model to show (optional)
 * @overlay : domElement or queryString (optional)
 */
(function () {
    
    var Touch = oo.core.Touch;

    var SliderCursor =  oo.getNS('oo.view').SliderCursor = oo.Class(oo.view.Slider, oo.core.mixins.Events, {
        _tplItems : '{{key}}',
        _tplOverlay : '{{key}}',
        _datas : null,
        _step : null,
        _total : null,
        _overlay : null,
        STATIC : {
            EVT_ONGOTO : 'onGoTo'
        },
        constructor: function constructor(opt) {
            SliderCursor.Super.call(this, opt);

            if(!opt.hasOwnProperty('translate')){
                throw new Error('Missing translate property');
            }

            this._prepareView(opt);
            
        },
        _initEvents : function _initEvents(opt){
            var startPos = null, that = this, isAvailable = false, domNode = this.getDomObject(), sWidth = this.getWidth(), sHeight = this.getHeight(),
                minX = domNode.offsetLeft, minY = this._cursor.getDomObject().offsetTop,
                deltaX = minX + this._cursor.getWidth()/2 + this._cursor.getLeft(), deltaY = minY + this._cursor.getHeight()/2 + this._cursor.getTop(),
                maxX = minX + sWidth, maxY = minY + sHeight, tx = (opt.translate.x) ? true : false, ty = (opt.translate.y) ? true : false,
                newx = null;


                var current;


                if(this._datas){
                    this._step = (sWidth/(that._total-1))/2;
                }

            domNode.addEventListener(Touch.EVENT_START, function(e){
                startPos = Touch.getPosition(e);
                isAvailable = true;
                that._cursor.setWebkitTransitionDuration(0, 'ms');
                if(tx){
                    newx = startPos[0] - deltaX;
                    that._cursor.setTranslateX( newx,'px');
                    if(that._step && that._overlay){
                        that._overlay.setDisplay('block');


                        current = ((Math.ceil(newx/that._step)-1) % 2 !== 0)  ? Math.ceil(newx/(that._step*2)) : Math.ceil(newx/(that._step*2)-1);
                        that._updateOverlay(current);
                    }
                }

                if(ty){
                    that._cursor.setTranslateY(startPos[1] - deltaY,'px');
                }
                
            }, false);

            domNode.addEventListener(Touch.EVENT_MOVE, function(e){
                var pos = Touch.getPosition(e), x = pos[0], y = pos[1];
                var dir = ( ((x - deltaX) - newx) > 0 ) ? 'right': 'left', update = false, newindex;
                
                if(isAvailable ){

                    if(tx && x >= minX && x <= maxX){
                        newx = x - deltaX;
                        that._cursor.setTranslateX(newx,'px');
                        if(that._step && that._overlay){
                            //impaire en montant
                            if( "right" === dir){
                                if ( (Math.ceil(newx/that._step)-1) % 2 !==0){
                                    newindex = Math.ceil(newx/(that._step*2));
                                    update = true;
                                }
                            } else {
                                //pair en descendant
                                if ( (Math.ceil(newx/that._step)-1) % 2 === 0){
                                    newindex = Math.ceil(newx/(that._step*2)-1);
                                    update = true;
                                }
                            }

                            if(update && current !== newindex ){
                                current = newindex;
                                that._updateOverlay(current);
                            }
                        }
                    }

                    if(ty && y >= minY && y <= maxY){
                        that._cursor.setTranslateY(y - deltaY,'px');
                    }
                }
            }, false);

            domNode.addEventListener(Touch.EVENT_END, function(e){
                isAvailable = false;
                if( parseInt(current,10) !== null ) {
                    that.goTo(current);
                    that.triggerEvent(SliderCursor.EVT_ONGOTO, [current]);
                }
                if(that._overlay){
                    that._overlay.setDisplay('none');
                }

            }, false);
        },
        goTo : function goTo(index){
            if(this._cursor){
                this._cursor.setTranslateX((index*(this._step*2))+this._cursor.getLeft()/2, 'px');
                this._cursor.setWebkitTransitionDuration(200, 'ms');
            }
        },
        _prepareView : function _prepareView(opt){
            var that = this;
            var callback = function callback(){
                //createCursor and attach events
                if(opt.hasOwnProperty('cursor')){
                    that._cursor = oo.createElement('node',{target:opt.cursor});
                    that._cursor.getDomObject().style.position = "absolute";
                    //dev to good positionning the cursor
                    that.getDomObject().style.position="relative";
                    that._initEvents(opt);
                }
            };

            
            if(opt.overlay){
                this._overlay = oo.createElement('node', {target:opt.overlay, template: opt.overlayTemplate || this._tplOverlay});
                this._overlay.setDisplay('none');
            }

            if(this._model){
                
                if(opt.items){
                    that._createItems(opt);
                }

                this._model.fetch(function(datas){
                   that._datas = datas;
                   that._total = that._datas.length;
                   if(that.list){
                       that.list.appendHtml(that.list.render(datas));
                   }

                   callback();
                   
                });

            } else {
                callback();
            }
            
        },
        _updateOverlay : function _updateOverlay(index){
            this._overlay.appendHtml(this._overlay.render( this._datas[index]));
        },
        _createItems : function _createItems(opt){
            this.list = oo.createElement('list', { target: opt.items.el, template: opt.items.template || this._tplItems, model: this._model});
        }
    });

    oo.view.Element.register(SliderCursor, 'sliderCursor');

})();