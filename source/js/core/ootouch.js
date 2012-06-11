/**
 * Contains static helper for touch management
 *
 * @namespace oo.core
 * @class Touch
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 * @author Claire Sosset <claire.sosset@gmail.com> || @claire_so
 *
 */
(function (oo) {

    /**
     * detect if we are on a touch context
     *
     * @private
     * @type {bool}
     */
    var hasTouch = 'ontouchstart' in window ? true : false;

    /**
     * returns an array of two element the first is the horizontal position and the second is the vertical position
     *
     * @private
     * @param  {Event} e   the event object
     * @param  {int} index which finger? ;)
     * @return {array}
     */
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
     
    var Touch = oo.Class({
        STATIC : {
            /**
             * get the touch position
             * @see getPosition()
             *
             * @type {function}
             */
            getPosition : getPosition,

            /**
             * get the touch X position
             *
             * @param  {Event} e   the event object
             * @param  {int} index which finger? ;)
             * @return {int}
             */
            getPositionX : function getPositionX(e, index) {
                return getPosition(e, index)[0];
            },

            /**
             * get the touch Y position
             *
             * @param  {Event} e   the event object
             * @param  {int} index which finger? ;)
             * @return {int}
             */
            getPositionY : function getPositionY(e, index){
                return getPosition(e, index)[1];
            },
            
            /**
             * get the target property
             *
             * @param  {Event} e   the event object
             * @param  {int} index which finger? ;)
             * @return {int}
             */
            getTarget : function getTarget(e, index) {
                return e.touches[index || 0].target;
            },
            
            /**
             * if the context "HAS_TOUCH"
             * @type {bool}
             */
            HAS_TOUCH : 'ontouchstart' in window ? true : false
        }
    });



    // gesture management

    (function () {


        var touchFlags = {
            el : null, startTime : null, stopTime : null, hasMoved : false, startX : null, startY : null, lastX : null, lastY : null, time : 150, timeout : null, doubleTap : false
        };

        var startGesture = function startGesture(e){
            touchFlags.el = e.target;
            touchFlags.startTime = Date.now();
            touchFlags.hasMoved = false;
            touchFlags.startX = Touch.getPositionX(e);
            touchFlags.startY = Touch.getPositionY(e);
 
            if ( (touchFlags.startTime -touchFlags.stopTime) < touchFlags.time) {
                touchFlags.doubleTap = true;
                window.clearTimeout(touchFlags.timeout);
            } else {
                touchFlags.doubleTap = false;
            }
        };

        var moveGesture = function moveGesture(e){
            //condition cause mousemove
            if (touchFlags.startTime){
                touchFlags.lastX = Touch.getPositionX(e);
                touchFlags.lastY = Touch.getPositionY(e);
                touchFlags.hasMoved = true;
            }
        };

        var stopGesture = function stopGesture(e){

            touchFlags.stopTime = Date.now();

            if (touchFlags.hasMoved){
                var deltaX = touchFlags.lastX - touchFlags.startX,
                    deltaY = touchFlags.lastY - touchFlags.startY;

                  // removed because it is useless and breaks the gesture detection
//                if ( (Touch.HAS_TOUCH && e.targetTouches.length == 1) || !Touch.HAS_TOUCH ){
                    if (Math.abs(deltaX) > 30 && Math.abs(deltaY) < 100 ) {
                        if ( deltaX < 0 ) {
                            fireEvent(touchFlags.el, "swipeLeft", true, true);
                        } else {
                            fireEvent(touchFlags.el, "swipeRight", true, true);
                        }
                    }
//                }
            } else {
               //https://github.com/madrobby/zepto/blob/master/src/touch.js
               touchFlags.timeout = window.setTimeout(function(){
                   touchFlags.timeout = null;

                   if ( touchFlags.doubleTap){
                       fireEvent(touchFlags.el, "doubleTap", true, true);
                   } else {
                       fireEvent(touchFlags.el, "tap", true, true);
                   }
               }, touchFlags.time);
    
            }
            
            touchFlags.lastX = touchFlags.lastY = touchFlags.startX = touchFlags.startY = null;

        };

        var fireEvent = function fireEvent(target, name, bubble, cancelable) {
            //create each Time the event ?
            var evt = document.createEvent('Events');
            evt.initEvent(name, bubble, cancelable);
            //evt.customData = "my custom data"
            target.dispatchEvent(evt);
        };


        if (!Touch.HAS_TOUCH) {
            Touch.EVENT_START = 'mousedown';
            Touch.EVENT_MOVE  = 'mousemove';
            Touch.EVENT_END   = 'mouseup';
        } else {
            Touch.EVENT_START = 'touchstart';
            Touch.EVENT_MOVE  = 'touchmove';
            Touch.EVENT_END   = 'touchend';
        }

        //attach events to document
        document.addEventListener(Touch.EVENT_START, function(e){
            startGesture(e);
        }, false);
        
        document.addEventListener(Touch.EVENT_MOVE, function(e){
            e.preventDefault();
            moveGesture(e);
        }, false);
        
        document.addEventListener(Touch.EVENT_END, function(e){
            stopGesture(e);
        }, false);

    })();

     
    var exports = oo.getNS('oo.core');
    exports.Touch = Touch;
         
})(yellowjs || {});
