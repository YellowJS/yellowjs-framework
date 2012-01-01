/** 
 * Class let's you transform any dom node into button and manage interaction
 * 
 * @namespace oo
 * @class Button
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
(function () {

    var utils = oo.core.utils, View = utils.getNS('oo.View'), Touch = View.Touch; 
    //Events = oo.Events;
    
    var Button = my.Class(oo.View.Dom, oo.core.mixins.Events, {
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
            this._dom.addEventListener(Touch.EVENT_START, utils.createDelegate(this._onTouch, this), false);
            this._dom.addEventListener(Touch.EVENT_END, utils.createDelegate(this._onRelease, this), false);
        },
        _onTouch : function _onTouch(e) {
            this.setActive(true);            
            this.triggerEvent(Button.EVT_TOUCH, this, [this, e]);
        },
        _onRelease : function _onRelease(e) {
            this.setActive(false);
            this.triggerEvent(Button.EVT_RELEASE, this, [this, e]);
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
        }
    });
    
    View.Button = Button;
    
})();