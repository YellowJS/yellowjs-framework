/**
 * @namespace oo.view.scroll
 * @class IScroll
 * @requires oo.view.Dom, oo.core.Touch
 */
(function (oo) {

    // shorthand
    var Dom = oo.view.Dom, Touch = oo.core.Touch, Scroll = oo.view.scroll.Scroll;
    
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
            if("string" !== typeof this.el && "undefined" === typeof this.el.nodeType && !(this._isOoDom())){
                throw new Error("el must be a Dom object, a oo.view.Dom or an identifier");
            }

            if(!(this.el instanceof oo.view.Dom)){
                this.el = new oo.view.Dom(this.el);
            }

            IScroll.Super.call(this);

            this._scroll = new iScroll(this.el.getId(), opt);
        },
        _isOoDom : function _isOoDom(){
            return this.el instanceof(oo.view.Dom);
        }
    });

    Scroll.register(IScroll, 'iscroll');

})(oo || {});