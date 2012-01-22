var oo = (function (oo) {

    // shorthand
    var Dom = oo.view.Dom,
        ns = oo.getNS('oo.view');
    
    var List = ns.List = my.Class(oo.view.Element, {
        constructor: function constructor(conf) {
            List.Super.call(this, conf);
        }
        // render: function (data, tpl) {
        //     if (!tpl || '' == tpl)
        //         tpl = this._tpl;            

        //     //tpl = 


        // }
    });
    
    oo.view.Element.register(List, 'list');

    return oo;
    
})(oo || {});