/*
 * Carousel :
 * @selector : the dom selector of the container
 * @pager : Boolean
 * @items : Array of Panel object
 */

var oo = (function (oo) {
    
    var Dom = oo.view.Dom, Touch = oo.core.Touch, Events = oo.core.mixins.Events, Button = oo.view.Button, ns = oo.getNS('oo.view');

    var PagerPrevNext = ns.PagerPrevNext = my.Class(null, Events, {
        buttonPrev : null,
        buttonNext : null,
        STATIC : {
            goToNext:'goToNext',
            goToPrev:'goToPrev'
        },
        constructor:  function constructor(opt){
            if(!opt){
                throw new Error ('Missing options');
            }

            if(!opt.hasOwnProperty('prev') || !opt.hasOwnProperty('next')){
                throw new Error ('Missing previous or next configuration');
            }

            this.buttonPrev = opt.prev;
            this.buttonNext = opt.next;

            delete opt.buttonPrev;
            delete opt.buttonNext;

            if( !(this.buttonPrev instanceof Button) && ("string" === typeof this.buttonPrev || "object" === typeof this.buttonPrev)){
                this.buttonPrev = oo.createElement('button',this.buttonPrev);
            }

            if(!(this.buttonNext instanceof Button) && ("string" === typeof this.buttonNext || "object" === typeof this.buttonNext)){
                this.buttonNext = oo.createElement('button',this.buttonNext);
            }

            this._attachEvents();

        },
        _attachEvents : function _attachEvents(){
            var that = this;

            
            this.buttonPrev.addListener(Button.EVT_RELEASE, function(){
                that.triggerEvent(PagerPrevNext.goToPrev);
            });

            this.buttonNext.addListener(Button.EVT_RELEASE, function(){
                that.triggerEvent(PagerPrevNext.goToNext);
            });
        }
    });

    oo.view.Element.register(PagerPrevNext, 'pagerPrevNext');

    return oo;
})(oo);