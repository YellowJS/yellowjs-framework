var oo = (function (oo) {

    var Touch = function Touch () {
        
    };    

    var hasTouch = undefined !== window.ontouchstart ? true : false

    var p = Touch.prototype;
    
    var getPosition = function getPosition (e, index) {        
        if (hasTouch) {
            index = index || 0;
        
            var touch = e.touches[index];
            if (undefined === touch) {
                touch = e.changedTouches[index];
            }
        } else {
            touch = e;
        }
        
        return [parseInt(touch.pageX, 10), parseInt(touch.pageY, 10)];
        
    };
    
    Touch.getPosition = getPosition;
    
    Touch.getPositionX = function getPositionX (e, index) {
        return getPosition(e, index)[0];
    };
    
    Touch.getPositionY = function getPositionX (e, index) {
        return getPosition(e, index)[1];
    };    
    
    Touch.getTarget = function getTarget (e, index) {
        return e.touches[index || 0].target;
    };

    if (!hasTouch) {
        Touch.EVENT_START = 'mousedown';
        Touch.EVENT_MOVE  = 'mousemove';
        Touch.EVENT_END   = 'mouseup';
    } else {
        Touch.EVENT_START = 'touchstart';
        Touch.EVENT_MOVE  = 'touchmove';
        Touch.EVENT_END   = 'touchend';        
    }
    
    oo.Touch = Touch;
    return oo;

})(oo || {});        