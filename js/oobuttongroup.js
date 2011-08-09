var oo = (function (oo) {

    var Dom = oo.Dom, Touch = oo.Touch; Events = oo.Events, Button = oo.Button;
    
    var ButtonGroup = function ButtonGroup (selector, type) {
        this._buttons = [];
        
        type = type || ButtonGroup.TYPE_RADIO;
        
        var buttonList = document.querySelectorAll(selector);
        
        var that = this;
        
        for (var i=0, len=buttonList.length; i<len; i++) {
            btn = new Button(buttonList[i]);
            
            btn._onRelease = function (e) {
                _onRelease.call(btn, e, that);
            };
            
            this._buttons.push(btn);

            if (type == ButtonGroup.TYPE_RADIO) {
                var that = this;                
                Events.addListener(Button.EVT_TOUCH, function (triggerBtn, e) {
                    that.updateActive.apply(that, [triggerBtn, e]);
                }, btn);                
            }
        }        
    };
    
    ButtonGroup.TYPE_RADIO = 'radio';
    ButtonGroup.TYPE_CHECKBOX = 'checkbox';
    
    var p = ButtonGroup.prototype;
    
    p.updateActive = function updateActive (btn, evt) {
        for (var i=0, len=this._buttons.length; i<len; i++) {
            if (this._buttons[i] !== btn) {
                this._buttons[i].setActive(false);
            }
        }
    };
    
    // @todo : it's a little bit dirty :s
    // /!\ is called with the scope of the button clicked
    var _onRelease = function _onRelease (e, group) {
        if (this.isActive()) {
            this.setActive(false);
        }
        Events.triggerEvent('release', group, [e, this]);        
    };
    
    oo.ButtonGroup = ButtonGroup;
    return oo;
    
})(oo || {});