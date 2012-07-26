/**
 * @namespace oo.modules.connect
 * @class FBConnect
 */
(function (oo) {
    var Connect = oo.modules.connect.Connect;

    var FBConnect = oo.getNS('oo.modules.connect').FBConnect = oo.Class(Connect, {
        constructor : function constructor(opts) {
            FBConnect.Super.call(this,opts);
            //init the facebook api
            FB.init(opts);
        },
        login: function login(callback,opts){
            if(!callback){
                callback = oo.emptyFn;
            }
            if(!opts){
                opts = {};
            }

            FB.login(function(response){
                callback(response);
            },opts);
        },
        logout:function logout(callback){
            if(!callback){
                callback = oo.emptyFn;
            }
            FB.logout(function(response){
                callback(response);
            });
        },
        getLoginStatus:function getLoginStatus(callback){
            if(!callback){
                callback = oo.emptyFn;
            }
            FB.getLoginStatus(function(response){
                callback(response);
            });
        }
    });

    Connect.register(FBConnect, 'facebook');

})(yellowjs || {});