/**
 * @namespace oo.modules.connect
 * @class Connect

 */
(function (oo) {

    var connectRepository = {};
    
    var Connect = oo.getNS('oo.modules.connect').Connect = oo.Class({
        STATIC: {
            register: function register (cls, codename) {
                if (connectRepository[codename])
                    throw 'Already existing codename';

                connectRepository[codename] = cls;
            },
            get: function get (codename) {
                if (codename in connectRepository)
                    return connectRepository[codename];
                else
                    throw 'Invalid codename';
            },
            unregister: function register (codename) {
                delete connectRepository[codename];
            }
        },
        constructor : function constructor() {
            
        },
        login : function login(){
            throw 'Can\'t be called directly from Scroll class';
        },
        logout : function logout(){
            throw 'Can\'t be called directly from Scroll class';
        }
    });

})(yellowjs || {});