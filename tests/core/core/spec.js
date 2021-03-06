describe("oocore.js", function() {

    describe("scope binding", function () {

        var Obj = {ClsName: 'Cls'};

        var f = function () {
            return this.ClsName;
        };

        var f2 = oo.createDelegate(f, Obj);

        it('should return a function', function () {
            expect(f2).toBeTruthy('function' == typeof f2);
        });

        it('should return the string \'Cls\'', function () {
            expect(f2()).toEqual('Cls');
        });

    });

    describe("override", function () {
        
        var baseObj = {
            'key1':'value1',
            'key2':'value2'
        };

        var overObj = {
            'key1':'new value1',
            'key3':'new value2'
        };

        var resultObj = oo.override(baseObj, overObj);

        it("should have \"new value1\" at \"key1\"", function () {
            expect(resultObj.key1).toEqual("new value1");
        });

        it("should have \"new value2\" at \"key3\"", function () {
            expect(resultObj.key3).toEqual("new value2");
        });

        it("should have \"value2\" at \"key2\"", function () {
            expect(resultObj.key2).toEqual("value2");
        });

    });

    describe("createElement list", function(){
        it('list must be an instance of oo.view.List', function(){
            var list = oo.createElement('list',{'el':'#test'});
            expect(list instanceof oo.view.List).toBeTruthy();
        });
    });

    describe ("class system", function() {
        var Toto = oo.Class({
            toto: function () {}
        });
        var Tata = oo.Class(Toto, {
            tata: function () {}
        });
 
        it("should be a function", function () {
            expect('function' == typeof Toto).toBeTruthy();
        });
 
        describe("test made on an instance", function () {
            it("should have a method called toto", function () {
                var o = new Toto();
                expect('toto' in o).toBeTruthy();
            });
 
            describe("inheritance", function () {
                it("should have a method called toto and another method called titi", function () {
                    var o2 = new Tata();
                    expect('toto' in o2).toBeTruthy();
                    expect('tata' in o2).toBeTruthy();
                });
            });
 
 
            describe("mixins", function () {
                var Tutu = oo.Class(Toto, Tata, {
                    tutu: function () {}
                });
                 
                var o3;
                beforeEach(function () {
                    o3 = new Tutu();
                });
 
                it("should have a methods called toto tata, and tutu", function () {
                    expect('toto' in o3).toBeTruthy();
                    expect('tata' in o3).toBeTruthy();
                    expect('tutu' in o3).toBeTruthy();
                });
 
                it ("should be an instance of Toto but not an instance of Tutu", function () {
                    expect(o3 instanceof Toto).toBeTruthy();
                    expect(o3 instanceof Tata).not.toBeTruthy();
                });
            });
 
 
        });
 
    });

    describe("createController", function(){

        it("test parameter",function(){
            expect(function(){
                var c = oo.createController();
            }).toThrow('Wrong parameter');
        });

        it('must return a function and register the controller', function(){

            var c = oo.createController('index', {
                'indexAction' : function indexAction(){
                }
            });

            expect( 'function' === typeof c).toBeTruthy();
            expect( undefined !== oo.getRouter()._controllers.index ).toBeTruthy();
        });

        it('must return a function but not register the controller', function(){

            var c = oo.createController({
                'indexAction' : function indexAction(){
                }
            });
            
            expect( 'function' === typeof c).toBeTruthy();
        });

    });

    describe("getRouter",function(){
       it('must return the router instance', function(){
           var router = oo.getRouter();
           expect(router instanceof oo.router.Router).toBeTruthy();
       });
    });

    describe('createModel', function(){
        var model = oo.createModel({
          "name" : "test",
          "provider" : {
              "name" : "testprovider",
              "type" : "fake",
              "data" : [{title:"test"}]
          }
        });

        it("model should be an instanceof oo.data.model", function(){
           expect(model instanceof oo.data.Model).toBeTruthy();
        });
    });

    describe('createModelClass', function(){
        var callback = jasmine.createSpy();
        var modelCls = oo.createModelClass({
          "name" : "test2",
          "provider" : {
              "name" : "testprovider",
              "type" : "fake",
              "data" : [{title:"test"}]
          },
          commit : callback
        });

        it("commit must be override",function(){
            modelCls.commit();
            expect(callback).toHaveBeenCalled();
        });
    });


    describe('createConnect',function(){
        it('Must throw error if opts is not an object',function(){
            expect(function(){
                yellowjs.createConnect("test");
            }).toThrow();
        });

        it('Must throw error if opts.account is not a valide codename',function(){
            expect(function(){
                yellowjs.createConnect({type:"test"});
            }).toThrow();
        });

        it('Must be a facebook connect by default',function(){
            expect(yellowjs.createConnect() instanceof oo.modules.connect.FBConnect).toBeTruthy();
        });

        it('Must be a facebook connect',function(){
            expect(yellowjs.createConnect({type:"facebook"}) instanceof oo.modules.connect.FBConnect).toBeTruthy();
        });

        it('Must be a local connect',function(){
            expect(yellowjs.createConnect({type:"local"}) instanceof oo.modules.connect.LocalConnect).toBeTruthy();
        });
        
    });

    describe('getConnect',function(){
        it('must be null if the connect has not been already created', function(){
            //delete reference store
            yellowjs.modules.connect._store = null;
            expect(yellowjs.getConnect()).toBeNull();
        });

        it('must be a facebook connect', function(){
            yellowjs.createConnect({type:'facebook'});
            expect(yellowjs.getConnect() instanceof oo.modules.connect.FBConnect).toBeTruthy();
        });

        it('must be a local connect', function(){
            yellowjs.createConnect({type:'local'});
            expect(yellowjs.getConnect() instanceof oo.modules.connect.LocalConnect).toBeTruthy();
        });
    });

});