(function (oo) {

    // shorthand
    var Dom = oo.view.Dom,
        Touch = oo.core.Touch,
        ns = oo.getNS('oo.view');
    
    var Popin = ns.Popin = oo.Class(oo.view.Element, {
        STATIC: {
            CLS_OPENED: 'pl-popin-opened',
            CLS_OPENING: 'pl-popin-is-showing',
            CLS_CLOSING: 'pl-popin-is-hiding',
            CLS_CLOSED: 'pl-popin-closed'
        },
        _isOpened : true,
        onOpen : null,
        onClose : null,
        closeOnTap:false,
        constructor: function constructor(conf) {
            Popin.Super.call(this, conf);

            if(conf.hasOwnProperty('close')){
                this._createButtonClose(conf.close);
            }

            if(conf.hasOwnProperty('closeOnTap')){
                this.closeOnTap = conf.closeOnTap;
            }

            if(!this.classList){
                this.setDomObject();
            }

            this.onOpen = conf.onOpen || oo.emptyFn;
            this.onClose = conf.onClose || oo.emptyFn;

            this._initEvents();

            this._isOpened = (this.classList.hasClass(Popin.CLS_CLOSED)) ? false : true;

            if(this._isOpened && !this.classList.hasClass(Popin.CLS_OPENED)){
                this._setOpened();
            }
        },
        _isClosing : function _isClosing(){
            return this.classList.hasClass(Popin.CLS_CLOSING);
        },
        _isOpening : function _isOpening(){
            return this.classList.hasClass(Popin.CLS_OPENING);
        },
        _opening : function _opening(){
            if(!this._isOpening()){
                this.classList.addClass(Popin.CLS_OPENING);
            }
        },
        _setOpened : function _setOpened(){
            if(this._isOpening()){
                this.classList.removeClass(Popin.CLS_OPENING);
            }
            if(!this.classList.hasClass(Popin.CLS_OPENED)){
                this.classList.addClass(Popin.CLS_OPENED);
            }
        },
        _closing : function _closing(){
            if(!this._isClosing()){
                this.classList.addClass(Popin.CLS_CLOSING);
            }
        },
        _setClosed : function _setClosed(){
            if(this._isClosing()){
                this.classList.removeClass(Popin.CLS_CLOSING);
            }
            if(!this.classList.hasClass(Popin.CLS_CLOSED)){
                this.classList.addClass(Popin.CLS_CLOSED);
            }
        },
        open : function open(){
            this.classList.removeClass(Popin.CLS_CLOSED);
            this.classList.removeClass(Popin.CLS_CLOSING);
            this._opening();
            this._isOpened = true;
            this.onOpen();
        },
        close : function close(){
            this.classList.removeClass(Popin.CLS_OPENED);
            this.classList.removeClass(Popin.CLS_OPENING);
            this._closing();
            this._isOpened = false;
            this.onClose();
        },
        _createButtonClose : function _createButtonClose(button){
            var btn = oo.createElement('button', button), that = this;

            btn.addListener(oo.view.Button.EVT_RELEASE, function(){
                that.close();
            });
        },
        isOpened : function isOpened(){
            return this._isOpened;
        },
        _initEvents : function _initEvents(){
            var that = this;
            this.getDomObject().addEventListener('webkitTransitionEnd',function(){
                that[!that._isOpened ? "_setClosed": "_setOpened"]();
            },false);

            if(this.closeOnTap){
              var touchendHandler = function touchendHandler(){
                that.close();
              };
              this.getDomObject().addEventListener(oo.core.Touch.EVENT_END,touchendHandler,false);
            }
        }

    });
    
    oo.view.Element.register(Popin, 'popin');
    
})(oo || {});

