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
                if (event.touches.length == 1){
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
              hasMoved : false,
              startPosX : null,
              startPosY : null,
              lastPosX : null,
              lastPosY : null,
              deltaTime : 700
        },
        startGesture : function startGesture(e){
            //first start : touchFlags.startTime
            this.touchFlags.startTime = Date.now();
            
            //console.log(this.touchFlags.startTime - this.touchFlags.startTimePrevious);
            /*if ( (this.touchFlags.startTime - this.touchFlags.startTimePrevious) >= 400){
               this.touchFlags.countTouch = 0; 
            }*/
            this.touchFlags.countTouch++;
            
            this.touchFlags.startPosX = this.getXPos(e);
            this.touchFlags.startPosY = this.getYPos(e);

        },
        moveGesture : function moveGesture(e){
            if (this.touchFlags.startTime){
               // console.log('move');
                this.touchFlags.lastPosX = this.getXPos(e);
                this.touchFlags.lastPosY = this.getYPos(e);
                this.touchFlags.hasMoved = true;
            }
            
            
            //console.log(this.touchFlags.lastPosX);
            
        },                                                                    
        stopGesture : function stopGesture(e){
            //console.log(e);
            
            this.touchFlags.stopTime = Date.now();
            
            // console.log("this.touchFlags.lastPosX" + this.touchFlags.lastPosX);
            //             console.log("this.touchFlags.lastPosY" + this.touchFlags.lastPosY);
            //             console.log(this.touchFlags.countTouch);
            
            if (this.touchFlags.hasMoved){
                var deltaX = this.touchFlags.lastPosX - this.touchFlags.startPosX;
                var deltaY = this.touchFlags.lastPosY - this.touchFlags.startPosY;
                
                if ( (Event.HAS_TOUCH && event.targetTouches.length == 1) || !Event.HAS_TOUCH ){
                    if (Math.abs(deltaX) > 30) {
                        if ( deltaX > 0 ) {
                            this.fireEvent(e, "swipeLeft", true, true);
                        } else {
                            this.fireEvent(e, "swipeRight", true, true);
                        }
                    } 
                }
                 
            } else { 
                
               var that = this;
               console.log(that.touchFlags) 
                window.setTimeout(function(e){ 
                    console.log(that.touchFlags.countTouch);
                    console.log('testdt '+ (that.touchFlags.stopTime - that.touchFlags.startTimePrevious));
                    if ( (2 === that.touchFlags.countTouch && (that.touchFlags.stopTime - that.touchFlags.startTimePrevious) < 400)){
                        console.log("doubletap");

                    } else {  
                        //console.log('test ' + that.touchFlags.startTime);
                        if ( (that.touchFlags.stopTime - that.touchFlags.startTime) < 1000 ) {
                         //this.fireEvent(e, "tap", true, true);
                         //console.log('tap');
                         //that.touchFlags.countTouch = 0;
                         
                        }
                        
                     }
                    
                    
                },200)
                
                
                that.touchFlags.lastPosX = null; 
                that.touchFlags.lastPosY = null; 
                that.touchFlags.startPosX = null;
                that.touchFlags.startPosY = null;
                that.touchFlags.hasMoved = false;
                that.touchFlags.startTimePrevious = that.touchFlags.startTime; 
                that.touchFlags.startTime = null;
                
                //test tap or double tap   
                //alert(this.touchFlags.stopTime - this.touchFlags.startTimePrevious)
                //if ( (2 === this.touchFlags.countTouch) && ((this.touchFlags.stopTime - this.touchFlags.startTimePrevious) < 200) ){
                //   alert("doubletap")  
                //   
                //} else {
                //    if ( (this.touchFlags.stopTime - this.touchFlags.startTime) < 200 ) {
                //        this.fireEvent(e, "tap", true, true);
                //    }
                //} 
                //console.log((this.touchFlags.stopTime - this.touchFlags.startTime) < 150)
                
                
                
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
             
             
        },
        fireEvent : function fireEvent(event, name, bubble, cancelable){
            //create each Time the event ? 
            var evt = document.createEvent('Events');  
            evt.initEvent(name, bubble, cancelable);  
            //evt.customData = "my custom data"
            event.target.dispatchEvent(evt);
        }   
    });
    
    
    var gesture = new Gesture();
    var exports = oo.core.utils.getNS('oo.core');
    exports.Gesture = gesture;
    
    return oo;
    
    
    
  
    
})(oo || {});