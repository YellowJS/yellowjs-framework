/**
 * @namespace oo.view.scroll
 * @class Scroll
 * @requires oo.view.Dom, oo.core.Touch
 */
(function (oo) {

    // shorthand
    var Dom = oo.view.Dom, Touch = oo.core.Touch;
    var scrollRepository = {};
    
    var Scroll = oo.getNS('oo.view.scroll').Scroll = oo.Class(null, oo.core.mixins.Events, {
        STATIC: {
            register: function register (cls, codename) {
                if (scrollRepository[codename])
                    throw 'Already existing codename';

                scrollRepository[codename] = cls;
            },
            get: function get (codename) {
                if (codename in scrollRepository)
                    return scrollRepository[codename];
                else
                    throw 'Invalid codename';
            },
            unregister: function register (codename) {
                delete scrollRepository[codename];
            }
        },
        constructor : function constructor() {
            
        },
        scrollTo : function scrollTo(){
            throw 'Can\'t be called directly from Scroll class';
        },
        refresh : function refresh(){
            throw 'Can\'t be called directly from Scroll class';
        }
    });

})(yellowjs || {});