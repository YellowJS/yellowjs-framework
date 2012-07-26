/**
 * @namespace oo.view.scroll
 * @class IScroll
 * @requires oo.view.Dom
 */
(function (oo) {
    var Connect = oo.modules.connect.Connect;

    var LocalConnect = oo.getNS('oo.modules.connect').LocalConnect = oo.Class(Connect, {
        constructor : function constructor(opt) {
           
            LocalConnect.Super.call(this);

        }
    });

    Connect.register(LocalConnect, 'local');

})(yellowjs || {});