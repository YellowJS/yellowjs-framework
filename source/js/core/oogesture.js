/** 
 * Contains class for gesture management
 * 
 * @namespace oo
 * @class Touch
 *
 * @author Claire Sosset <claire.sosset@gmail.com> || @claire_so
 */
var oo = (function (oo) {
    var Touch = oo.View.Touch;

    var Gesture = my.Class({
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
                if (event.targetTouches.length == 1){
                    //one finger 
                    //console.log(event.touches[0].pageX);
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
              countTouch : 0,
              startTime : null,
              startTimePrevious : null,
              stopTime : null,
              isMoved : false,
              startPosX : null,
              startPosY : null,
              lastPosX : null,
              lastPosY : null,
              deltaTime : 700
        },
        startGesture : function startGesture(e){
            //first start : touchFlags.startTime
            this.touchFlags.startTime = Date.now();
            this.touchFlags.countTouch++;
            
            
            this.touchFlags.startPosX = this.getXPos(e);
            this.touchFlags.startPosY = this.getYPos(e);
            
            
            
            
            //alert(this.startPos)
            //console.log(this.touchFlags.startPosX);
            //console.log(this.touchFlags.startPosY);
            
            //console.log(this.touchFlags.startTime);
        },
        moveGesture : function moveGesture(e){
            
            console.log('move');
            this.touchFlags.lastPosX = this.getXPos(e);
            this.touchFlags.lastPosY = this.getYPos(e);
            this.touchFlags.isMoved = true;
            
            //console.log(this.touchFlags.lastPosX);
            
        },                                                                    
        stopGesture : function stopGesture(e){
            //console.log(e);
            
            this.touchFlags.stopTime = Date.now();
            
            console.log("this.touchFlags.lastPosX" + this.touchFlags.lastPosX);
            console.log("this.touchFlags.lastPosY" + this.touchFlags.lastPosY);
            
            
            if (this.touchFlags.isMoved){
                var deltaX = this.touchFlags.lastPosX - this.touchFlags.startPosX;
                var deltaY = this.touchFlags.lastPosY - this.touchFlags.startPosY;

                if (Math.abs(deltaX) > 50) {
                    if ( deltaX > 0 ) {
                        alert('swipe left');
                    } else {
                        alert('swipe right');
                    }
                } 
            } else {
                //test tap or double tap
                
            }
            

            /*
            if (Math.abs(deltaY) > 100) {
                if ( deltaX > 0 ) {
                    alert('swipe top ?')
                } else {
                    alert('swipe bottom ?')
                }
            } */
            
            //alert(deltaX);
            //alert(deltaY);
            //console.log(this.touchFlags.stopTime);
            
            //reset Pos
            this.touchFlags.lastPosX = null; 
            this.touchFlags.lastPosY = null; 
            this.touchFlags.startPosX = null;
            this.touchFlags.startPosY = null;
            this.touchFlags.isMoved = false;
            this.touchFlags.startTimePrevious = this.touchFlags.startTime; 
        }   
    });
    
    
    var gesture = new Gesture();
    var exports = oo.core.utils.getNS('oo.core');
    exports.Gesture = gesture;
    
    return oo;
    
    
    
  
    
})(oo || {});