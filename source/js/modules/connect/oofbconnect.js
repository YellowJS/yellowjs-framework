/**
 * @namespace oo.modules.connect
 * @class FBConnect
 */
(function (oo) {
    var Connect = oo.modules.connect.Connect;

    var FBConnect = oo.getNS('oo.modules.connect').FBConnect = oo.Class(Connect, {
        constructor : function constructor(opts) {
            FBConnect.Super.call(this,opts);
            var self = this;

            FBConnect.Super.call(this,opts);

            this._fbIsInit = false;

            //init the facebook api
            FB.init(opts);


            CDV.FB.getLoginStatus(function () {
                self._fbIsInit = true;
            });
        },
        _ensureInit: function _ensureInit (callback) {
            var self = this;
            if(!this._fbIsInit) {
                setTimeout(function() {self._ensureInit(callback);}, 50);
            } else {
                if(callback) {
                    callback();
                } else {
                    return true;
                }
            }
        },
        login: function login(callback,opts){
            if(!callback){
                callback = oo.emptyFn;
            }
            if(!opts){
                opts = {};
            }
            this._ensureInit(function () {
                FB.login(function(response){
                    callback(response);
                },opts);
            });
        },
        logout:function logout(callback){
            if(!callback){
                callback = oo.emptyFn;
            }
            this._ensureInit(function () {
                FB.logout(function(response){
                    callback(response);
                });
            });
        },
        getLoginStatus:function getLoginStatus(callback){
            if(!callback){
                callback = oo.emptyFn;
            }
            this._ensureInit(function () {
                FB.getLoginStatus(function(response){
                    callback(response);
                });
            });
        },
        getUser: function getUser(callback){
            if(!callback){
                callback = oo.emptyFn;
            }
            this._ensureInit(function () {
                FB.api('/me', function(response) {
                    callback(response);
                });
            });
        }
    });

    Connect.register(FBConnect, 'facebook');

})(yellowjs || {});