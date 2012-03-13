/**
 * Contains class for gesture management
 *
 * @namespace oo
 * @class Touch
 *
 * @author Claire Sosset <claire.sosset@gmail.com> || @claire_so
 */
var oo = (function (oo) {
    var Touch = oo.core.Touch;
    var Gesture = oo.Class({
        constructor : function constructor(){
            var that = this;
            //attach events to document
            document.addEventListener(Touch.EVENT_START, function(e){
                that.startGesture.call(that, e);
            }, false);
            
            document.addEventListener(Touch.EVENT_MOVE, function(e){
                e.preventDefault();
                that.moveGesture.call(that, e);
            }, false);
            
            document.addEventListener(Touch.EVENT_END, function(e){
                that.stopGesture.call(that, e);
            }, false);
        },
        getPos : function getPos(e){
            var coords = {
                x : null,
                y : null
            };

            if (Touch.HAS_TOUCH) {
                if (event.touches.length == 1){
                    //one finger
                    coords.x = event.touches[0].pageX;
                    coords.y = event.touches[0].pageY;
                }
            } else {
                coords.x = event.pageX;
                coords.y = event.pageY;
            }

            return coords;
        },
        getXPos : function getXPos(event) {
           var coords = this.getPos(event);

           return coords.x;
        },
        getYPos : function getYPos(event) {
           var coords = this.getPos(event);

           return coords.y;
        },
        touchFlags : {
            el : null, startTime : null, stopTime : null, hasMoved : false, startX : null, startY : null, lastX : null, lastY : null, time : 150, timeout : null, doubleTap : false
        },
        startGesture : function startGesture(e){
            this.touchFlags.el = e.target;
            this.touchFlags.startTime = Date.now();
            this.touchFlags.hasMoved = false;
            this.touchFlags.startX = this.getXPos(e);
            this.touchFlags.startY = this.getYPos(e);
 
            if ( (this.touchFlags.startTime - this.touchFlags.stopTime) < this.touchFlags.time){
                this.touchFlags.doubleTap = true;
                window.clearTimeout(this.touchFlags.timeout);
            } else {
                this.touchFlags.doubleTap = false;
            }
        },
        moveGesture : function moveGesture(e){
            //condition cause mousemove
            if (this.touchFlags.startTime){
                this.touchFlags.lastX = this.getXPos(e);
                this.touchFlags.lastY = this.getYPos(e);
                this.touchFlags.hasMoved = true;
            }
        },
        stopGesture : function stopGesture(e){
            var that = this;

            this.touchFlags.stopTime = Date.now();

            if (this.touchFlags.hasMoved){
                var deltaX = this.touchFlags.lastX - this.touchFlags.startX,
                    deltaY = this.touchFlags.lastY - this.touchFlags.startY;

                if ( (Event.HAS_TOUCH && event.targetTouches.length == 1) || !Event.HAS_TOUCH ){
                    if (Math.abs(deltaX) > 30 && Math.abs(deltaY) < 100 ) {
                        if ( deltaX > 0 ) {
                            this.fireEvent(that.touchFlags.el, "swipeLeft", true, true);
                        } else {
                            this.fireEvent(that.touchFlags.el, "swipeRight", true, true);
                        }
                    }
                }
            } else {
               //https://github.com/madrobby/zepto/blob/master/src/touch.js
               that.touchFlags.timeout = window.setTimeout(function(){
                   that.touchFlags.timeout = null;

                   if ( that.touchFlags.doubleTap){
                       that.fireEvent(that.touchFlags.el, "doubleTap", true, true);
                   } else {
                       that.fireEvent(that.touchFlags.el, "tap", true, true);
                   }
               },this.touchFlags.time);
    
            }
            
            that.touchFlags.lastX = that.touchFlags.lastY = that.touchFlags.startX = that.touchFlags.startY = null;

        },
        fireEvent : function fireEvent(target, name, bubble, cancelable){
            //create each Time the event ?
            var evt = document.createEvent('Events');
            evt.initEvent(name, bubble, cancelable);
            //evt.customData = "my custom data"
            target.dispatchEvent(evt);
        }
    });
    
    
    var gesture = new Gesture();
    var exports = oo.getNS('oo.core');
    exports.Gesture = gesture;
    
    return oo;
    
})(oo || {});