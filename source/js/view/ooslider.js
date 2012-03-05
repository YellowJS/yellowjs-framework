/**
 * Abstract class that should be extended to create slider
 *
 * @namespace oo.view
 * @private class
 *
 */
(function () {
    
    var Touch = oo.core.Touch;

    var Slider =  oo.getNS('oo.view').Slider = oo.Class(oo.view.ModelElement, {
        constructor: function constructor(opt) {
            Slider.Super.call(this, opt);

        },
        goTo : function goTo(){
            throw 'Can\'t be called directly from Slider class';
        }
    });

    oo.view.Element.register(Slider, 'slider');

})();