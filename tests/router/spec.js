describe("oorouter.js", function() {

    describe('addRoutes', function(){
        it('routes parameter must exist', function(){
            expect(function(){
                oo.router.router.addRoutes();
            }).toThrow('Routes must exist and must be an object literal');
        });

        it('routes parameter must be a litral object', function(){
            expect(function(){
                var routes = [];
                oo.router.router.addRoutes(routes);
            }).toThrow('Routes must exist and must be an object literal');

            expect(function(){
                var routes = 'test';
                oo.router.router.addRoutes(routes);
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
                oo.router.router.addRoutes(routes);
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
                oo.router.router.addRoutes(routes);
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
                oo.router.router.addRoutes(routes);
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
                oo.router.router.addRoutes(routes);
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
                oo.router.router.addRoutes(routes);
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
            oo.router.router.addRoutes(routes);
            expect(oo.router.router._routes).toEqual(routes);
        });
    });
});