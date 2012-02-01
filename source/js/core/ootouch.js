/**
 * Contains static helper for touch management
 *
 * @namespace oo
 * @class Touch
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function (oo) {

//var hasTouch = 'ontouchstart' in window ? true : false;
    var getPosition = function getPosition (e, index) {
        var touch = null;
         
        if (Touch.HAS_TOUCH) {
            index = index || 0;
         
            touch = e.touches[index];
            if (undefined === touch) {
                touch = e.changedTouches[index];
            }
        } else {
            touch = e;
        }
         
        return [parseInt(touch.pageX, 10), parseInt(touch.pageY, 10)];
         
    };
     
    var Touch = my.Class({
        STATIC : {
            getPosition : getPosition,
            getPositionX : function getPositionX(e, index) {
                return getPosition(e, index)[0];
            },
            getPositionY : function getPositionY(e, index){
                return getPosition(e, index)[1];
            },
            getTarget : function getTarget(e, index) {
                return e.touches[index || 0].target;
            },
            HAS_TOUCH : 'ontouchstart' in window ? true : false
        }
    });
     
    if (!Touch.HAS_TOUCH) {
        Touch.EVENT_START = 'mousedown';
        Touch.EVENT_MOVE  = 'mousemove';
        Touch.EVENT_END   = 'mouseup';
    } else {
        Touch.EVENT_START = 'touchstart';
        Touch.EVENT_MOVE  = 'touchmove';
        Touch.EVENT_END   = 'touchend';
    }
     
    var exports = oo.getNS('oo.core');
    exports.Touch = Touch;
     
    return oo;
    
})(oo || {});
