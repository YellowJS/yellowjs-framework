describe("oocarousel.js", function() {
    
    var provider = new oo.data.FakeProvider({
        "name" : "fdsfsdf"
    });

    var model = oo.createModel({
        'name' : "test",
        'provider' : provider
    });

    beforeEach(function () {
        document.querySelector('#carousel').innerHTML = '';
    });

    describe('model and templates', function () {
        /*test if model and templates exist*/
        /*it('throw error',function(){
            expect(function(){
                var optCarousel = {
                    model : model
                };

                var carousel = new oo.view.Carousel('#carousel', false, optCarousel);
            }).toThrow('Options passed but missing model or elementCls');

            expect(function(){
                var optCarousel = {
                    elementCls : "templates"
                };

                var carousel = new oo.view.Carousel('#carousel', false, optCarousel);
            }).toThrow('Options passed but missing model or elementCls');

            expect(function(){
                var optCarousel = {
                    model : model,
                    elementCls : 'tesmp'
                };

                var carousel = new oo.view.Carousel('#carousel', false, optCarousel);
            }).toThrow('elementCls must be an object');

            //it('template must be a function',function(){

                expect(function(){
                    var optCarousel = {
                        model : model,
                        elementCls : {'test' : 'test'}
                    };
                    var carousel = new oo.view.Carousel('#carousel', false, optCarousel);
                }).toThrow('element Cls must exist and be a function');
                

                //expect(carousel._elementCls.test).toEqual(fn);
            
        });*/
    });


    describe('adding content to the carousel', function () {

       /* it('elemenCls must be in _elementCls',function(){
            var elementCls = {};
            
            elementCls.elementA = oo.Class(oo.view.Element, {
                constructor : function () {
                    elementCls.elementA.Super.call(this, {
                        target:document.createElement('div'),
                        template:"<div>{{firstname}}</div>"
                    });
                },
                onRendered : function onRendered(){
                    alert('element A');
                }
            });
            var optCarousel = {
                model : model,
                elementCls : elementCls
            };

            var carousel = new oo.view.Carousel('#carousel', false, optCarousel);

            expect(carousel._elementCls.elementA).toEqual(elementCls.elementA);
        });*/
    });

        it('showPanel',function(){
            var elementCls = {};
            
            elementCls.elementA = oo.Class(oo.view.Element, {
                constructor : function () {
                    elementCls.elementA.Super.call(this, {
                        target:document.createElement('div'),
                        template:'<h1>{{title}}</h1><img src="{{picture}}" style=" height:200px; display:block;" />'
                    });
                },
                onEnable : function onEnable(){
                    //console.log('element A');
                }
            });


            /*var list2 = oo.createElement('list', {
                model : model,
                'template' : '<span class="h1">{{firstname}}</span> | <span class="h2">{{nickname}}</span>',
                'target' : '#target'
            });*/
            
            
            var list  = oo.createElement('list', {
                'template' : 'test',
                'target' : '#list'
            });


            var optCarousel = {
                el : "#carousel",
                pager : list,
                model : model,
                elementCls : elementCls
            };

            //window.carousel = new oo.view.Carousel('#carousel', false, optCarousel);
            window.carousel = oo.createElement('carousel',optCarousel);

            /*expect(function(){
                carousel.showPanel();
            }).toThrow("Missing 'id' of the panel");
           
            var lnk = document.querySelector('#showpanel');
            
            lnk.addEventListener('click',function(e){
                e.preventDefault();
                carousel.showPanel(4);
            },false);*/
           
           
            
        });

    });

});