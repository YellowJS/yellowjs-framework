/**
 * @namespace oo.view.scroll
 * @class IScroll
 * @requires oo.view.Dom
 */
(function (oo) {
    var Connect = oo.modules.connect.Connect;

    var FBConnect = oo.getNS('oo.modules.connect').FBConnect = oo.Class(Connect, {
        constructor : function constructor(opt) {
           
            FBConnect.Super.call(this);

        }
    });

    Connect.register(FBConnect, 'facebook');

})(yellowjs || {});