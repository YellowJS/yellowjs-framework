(function (oo) {

    // shorthand
    var Dom = oo.view.Dom,
        Touch = oo.core.Touch,
        ns = oo.getNS('oo.view');
    
    var Popin = ns.Popin = oo.Class(oo.view.Element, {
        STATIC: {
            CLS_OPENED: 'popin-opened',
            CLS_CLOSED: 'popin-closed'
        },
        _isOpened : true,
        constructor: function constructor(conf) {
            Popin.Super.call(this, conf);

            if(conf.hasOwnProperty('close')){
                this._createButtonClose(conf.close);
            }

            if(!this.classList){
                this.setDomObject();
            }

            
            this._isOpened = (this.classList.hasClass(Popin.CLS_CLOSED)) ? false : true;
            if(this._isOpened && !this.classList.hasClass(Popin.CLS_OPENED)){
                this._setOpenCls();
            }

            
        },
        _setOpenCls : function _setOpenCls(){
            if(!this.classList.hasClass(Popin.CLS_OPENED)){
                this.classList.addClass(Popin.CLS_OPENED);
            }
        },
        _setCloseCls : function _setCloseCls(){
            if(!this.classList.hasClass(Popin.CLS_CLOSED)){
                this.classList.addClass(Popin.CLS_CLOSED);
            }
        },
        open : function open(){
            this.classList.removeClass(Popin.CLS_CLOSED);
            this._setOpenCls();
            this._isOpened = true;
        },
        close : function close(){
            this.classList.removeClass(Popin.CLS_OPENED);
            this._setCloseCls();
            this._isOpened = false;
        },
        _createButtonClose : function _createButtonClose(button){
            var btn = oo.createElement('button', button), that = this;

            btn.addListener(oo.view.Button.EVT_RELEASE, function(){
                that.close();
            });
        },
        isOpened : function isOpened(){
            return this._isOpened;
        }

    });
    
    oo.view.Element.register(Popin, 'popin');
    
})(oo || {});