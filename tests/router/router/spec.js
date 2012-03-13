describe("oorouter.js", function() {

    var router = oo.getRouter();
    
    describe('addRoutes', function(){
        it('routes parameter must exist', function(){
            expect(function(){
                router.addRoutes();
            }).toThrow('Routes must exist and must be an object literal');
        });

        it('routes parameter must be a litral object', function(){
            expect(function(){
                var routes = [];
                router.addRoutes(routes);
            }).toThrow('Routes must exist and must be an object literal');

            expect(function(){
                var routes = 'test';
                router.addRoutes(routes);
            }).toThrow('Routes must exist and must be an object literal');
        });
    });

    describe('addRoute', function(){
        it('A route must have a "url" property', function(){
           var routes = {
                            'index': {
                                //url: '/index',
                                controller: 'index',
                                action: 'index'
                            }
                        };
            
            expect(function(){
                router.addRoutes(routes);
            }).toThrow('A route must have a name and properties "url", "controller" and "action"');

        });

        it('A route must have a "controller" property', function(){
           var routes = {
                            'index': {
                                url: '/index',
                                //controller: 'index',
                                action: 'index'
                            }
                        };
            
            expect(function(){
                router.addRoutes(routes);
            }).toThrow('A route must have a name and properties "url", "controller" and "action"');

        });

        it('A route must have a "action" property', function(){
           var routes = {
                            'index': {
                                url: '/index',
                                controller: 'index'
                                //action: 'index'
                            }
                        };
            
            expect(function(){
                router.addRoutes(routes);
            }).toThrow('A route must have a name and properties "url", "controller" and "action"');

        });

        it('A route must have a name', function(){
           var routes = {
                            '': {
                                url: '/index',
                                controller: 'index',
                                action: 'index'
                            }
                        };
            
            expect(function(){
                router.addRoutes(routes);
            }).toThrow('A route must have a name and properties "url", "controller" and "action"');

        });

        it('Url property format', function(){
           var routes = {
                            'name': {
                                url: 'index',
                                controller: 'index',
                                action: 'index'
                            }
                        };
            
            expect(function(){
                router.addRoutes(routes);
            }).toThrow('The url property must begun by "/"');

        });

        it('Route must be added in _routes', function(){
            var routes = {
                            'index': {
                                url: '/index',
                                controller: 'index',
                                action: 'index'
                            }
                        };
            router.addRoutes(routes);
            expect(router._routes).toEqual(routes);
        });
    });

    describe('addController',function(){
        var fakename = {}, fakecls = {};

        it('verify parameters',function(){
            expect(function(){
                router.addController();
            }).toThrow('Wrong "name" parameter : Must exist and be a string');

            expect(function(){
                router.addController(fakename);
            }).toThrow('Wrong "name" parameter : Must exist and be a string');

            expect(function(){
                router.addController('name', fakecls);
            }).toThrow('Wrong "cls" parameter : Must be a function');
        });

        it('addcontroller in CONTROLLER', function(){
            var c = oo.createController({indexAction:function indexAction(){}});
            
            router.addController('IndexController',c);

            expect(router._controllers.IndexController).toEqual(c);

        });
    });

    describe('addControllers',function(){
        it('verify paramters', function(){
            expect(function(){
                router.addControllers();
            }).toThrow('Wrong parameter : must exist and be an object');

            expect(function(){
                router.addControllers('estt');
            }).toThrow('Wrong parameter : must exist and be an object');
        });

        it('test insertion',function(){
            var controller1 = oo.createController({c1Action:function c1Action(){}});
            var controller2 = oo.createController({c2Action:function c2Action(){}});

            var params = {
              'Ctl1Controller' : controller1,
              'Ctl2Controller' : controller2
            };
            router.addControllers(params);
            
            expect(router._controllers.Ctl1Controller).toEqual(controller1);
            expect(router._controllers.Ctl2Controller).toEqual(controller2);
        });
    });
    
    describe('dispatch',function(){
        var callback = jasmine.createSpy();
        var callback2 = jasmine.createSpy();
        

        /*oo.define({
            'pushState' : true
        });*/


        var newRouter = oo.getRouter();
        


        var controller1 = oo.createController({c11Action: function(){console.log('c1');}});
        var controller2 = oo.createController({c22Action:function(){console.log('c2');}});
        var controller3 = oo.createController({c33Action:function(){ console.log('c3'); newRouter.load('/ctl22/c22');}});
        var c = oo.createController({indexAction:function indexAction(){ }});

        newRouter.addController('IndexController',c);

        var params = {
          'Ctl11Controller' : controller1,
          'Ctl22Controller' : controller2,
          'Ctl33Controller' : controller3
        };

        newRouter.addControllers(params);
        newRouter.init();
        //newRouter.load('/ctl11/c11');
        //newRouter.load('/ctl22/c22');
        oo.getRouter().load('/ctl33/c33');
        
        //expect(callback).toHaveBeenCalled();
        //expect(callback2).toHaveBeenCalled();
    });
});