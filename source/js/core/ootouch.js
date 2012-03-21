/**
 * Contains static helper for touch management
 *
 * @namespace oo.core
 * @class Touch
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
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
         
})(oo || {});
