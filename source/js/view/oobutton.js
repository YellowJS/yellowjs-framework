/** 
 * Class let's you transform any dom node into button and manage interaction
 * 
 * @namespace oo
 * @class Button
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function (oo) {
 
    var view = oo.getNS('oo.view'), Touch = oo.core.Touch; 
    //Events = oo.Events;
     
    var Button = my.Class(oo.view.Dom, oo.core.mixins.Events, {
        STATIC : {
            EVT_TOUCH : 'touch',
            EVT_RELEASE : 'release'
        },
        constructor : function constructor(selector) {
            this._active = false;
            Button.Super.call(this, selector);
            this._initEvents();
        },
        _initEvents : function _initEvents() {
            this.getDomObject().addEventListener(Touch.EVENT_START, oo.createDelegate(this._onTouch, this), false);
            this.getDomObject().addEventListener(Touch.EVENT_MOVE, oo.createDelegate(this._onTouchMove, this), false);
            this.getDomObject().addEventListener(Touch.EVENT_END, oo.createDelegate(this._onRelease, this), false);
        },
        _onTouch : function _onTouch(e) {
            this.setActive(true);
            this.triggerEvent(Button.EVT_TOUCH, [this, e]);
        },
        _onTouchMove: function _onTouchMove(e) {
            if (this._active)
                this.setActive(false);
        },
        _onRelease : function _onRelease(e) {
            if (this._active) {
                this.setActive(false);
                this.triggerEvent(Button.EVT_RELEASE, [this, e]);
            }
        },
        isActive : function isActive() {
            return this._active;
        },
        /**
         * set the active state of the button
         * @param actice {bool} "true" to set as active "false" to not
         **/
        setActive : function setActive (active) {
            this._active = !!active;
            this.classList[(this._active ? 'add' : 'remove') + 'Class']('active');
        },
        tap : function tap(){
          this.triggerEvent(Button.EVT_RELEASE, [this]);
        }
    });
     
    view.Button = Button;
    oo.view.Element.register(Button, 'button');
    return oo;
     
})(oo || {});