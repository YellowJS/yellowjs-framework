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
        _type:null,
        constructor : function constructor(opts) {
            this._type = opts.type;
        },
        getType: function getType(){
            return this._type;
        },
        login : function login(){
            throw 'Can\'t be called directly from Connect class';
        },
        logout : function logout(){
            throw 'Can\'t be called directly from Connect class';
        },
        getLoginStatus:function getLoginStatus(){
           throw 'Can\'t be called directly from Connect class';
        }
    });

})(yellowjs || {});