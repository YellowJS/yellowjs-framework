/** 
 * Class lat's you transform any dom node into button and manage interaction
 * 
 * @namespace oo
 * @class Button
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function (oo) {

    var Dom = oo.View.Dom, Touch = oo.View.Touch; Events = oo.Events;
    
    var Button = my.Class({
        STATIC : {
            EVT_TOUCH : 'touch',
            EVT_RELEASE : 'release'
        },
        constructor : function constructor(selector) {
            this._dom = new Dom(selector);
            this._active = false;

            this._initEvents();
        },
        getDom : function getDom() {
            return this._dom;
        },
        _initEvents : function _initEvents() {
            var that = this;
            this._dom.getDomObject().addEventListener(Touch.EVENT_START, function (e) {
                return that._onTouch.call(that, e);
            });

            this._dom.getDomObject().addEventListener(Touch.EVENT_END, function (e) {
                return that._onRelease.call(that, e);
            });
        },
        _onTouch : function _onTouch(e) {
            if (!this.isActive()) {
                this.setActive(true);            
            }
            Events.triggerEvent(Button.EVT_TOUCH, this, [this, e]);
        },
        _onRelease : function _onRelease(e) {
            this.setActive(false);
            Events.triggerEvent(Button.EVT_RELEASE, this, [this, e]);
        },
        _toogleActive : function _toogleActive(){
            this.setActive(!this._active);
        },
        isActive : function isActive() {
            return this._active;
        },
        /**
         * set the active state of the button
         * @param actice {bool} "true" to set as active "false" to not 
         **/
        setActive : function setActive (active) {
            if (active || undefined === active) {
                this._dom.classList.addClass('active');
                this._active = true;
            } else {
                this._dom.classList.removeClass('active');
                this._active = false;
            }
        }
    });
    
    var exports = oo.core.utils.getNS('oo.View');
    exports.Button = Button;
    
    return oo;    
    
})(oo || {});