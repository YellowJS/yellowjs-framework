/**
 * @namespace oo.view.scroll
 * @class IScroll
 * @requires oo.view.Dom
 */
(function (oo) {

    // shorthand
    var Dom = oo.view.Dom, Scroll = oo.view.scroll.Scroll;
    
    var IScroll = oo.getNS('oo.view.scroll').IScroll = oo.Class(Scroll, {
        _scroll : null,
        el : null,
        constructor : function constructor(opt) {
            if(undefined === opt || !opt.hasOwnProperty("el") || "object" !== typeof opt){
                throw new Error('Missing options or missing "el" property in your options or options is not an object');
            }

            this.el = opt.el;
            delete opt.el;
             
            //test if el is an identifier, a dom Node or a oo.view.Dom
            var isNotOoDom = !(this.el instanceof Dom);
            if("string" !== typeof this.el && "undefined" === typeof this.el.nodeType && isNotOoDom){
                throw new Error("el must be a Dom object, a oo.view.Dom or an identifier");
            }

            if(isNotOoDom){
                this.el = new Dom(this.el);
            }

            IScroll.Super.call(this);

            this._scroll = new iScroll(this.el.getId(), opt);
        },
        refresh : function refresh(){
            this._scroll.refresh();
        }
    });

    Scroll.register(IScroll, 'iscroll');

})(yellowjs || {});