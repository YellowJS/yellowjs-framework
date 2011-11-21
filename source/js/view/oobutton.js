/** 
 * Class lat's you transform any dom node into button and manage interaction
 * 
 * @namespace oo
 * @class Button
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function (oo) {

    var Dom = oo.Dom, Touch = oo.Touch; Events = oo.Events;
    
    var Button = function Button (selector) {
        this._dom = new Dom(selector);
        this._active = false;
        
        this._initEvents();
    };
    
    Button.EVT_TOUCH = 'touch';
    Button.EVT_RELEASE = 'release';
    
    var p = Button.prototype;
    
    p.getDom = function getDom () {
        return this._dom;
    };
    
    p._initEvents = function _initEvents () {
        var that = this;
        this._dom.getDomObject().addEventListener(Touch.EVENT_START, function (e) {
            return that._onTouch.call(that, e);
        });
        
        this._dom.getDomObject().addEventListener(Touch.EVENT_END, function (e) {
            return that._onRelease.call(that, e);
        });        
    }

    p._onTouch = function _onTouch (e) {
        if (!this.isActive()) {
            this.setActive(true);            
        }
        Events.triggerEvent(Button.EVT_TOUCH, this, [this, e]);
    };
    
    p._onRelease = function _onRelease (e) {
        this.setActive(false);
        Events.triggerEvent(Button.EVT_RELEASE, this, [this, e]);        
    };
    
    p.toogleActive = function _toogleActive () {
        this.setActive(!this._active);
    };
    
    p.isActive = function isActive () {
        return this._active;
    }
    
    /**
     * set the active state of the button
     * @param actice {bool} "true" to set as active "false" to not 
     **/
    p.setActive = function setActive (active) {
        if (active || undefined === active) {
            this._dom.classList.addClass('active');
            this._active = true;
        } else {
            this._dom.classList.removeClass('active');
            this._active = false;
        }
    }
    
    oo.Button = Button;
    return oo;    
    
})(oo || {});