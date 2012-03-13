describe("oomodel.js", function() {

    var provider = new oo.data.FakeProvider({
        "name" : "bar"
    });


    var model = oo.createModel({
        name : 'post-model',
        provider: provider
    });

    //must be changed later due to async
    var dataProvider;

    provider.fetch({success:function(datas){
        dataProvider = datas;
    }});



    describe("constructor", function() {
        it('model._id must be equal to "post-model"',function(){
           expect(model._name).toEqual("post-model");
        });

        it('model._provider must be equal to "provider"',function(){
            expect(model._provider instanceof oo.data.Provider).toBeTruthy();
        });
    });

    describe("fetch", function() {
        var callback = jasmine.createSpy();
        model.fetch(callback);
        it('function callback must be executed',function(){
           expect(callback).toHaveBeenCalled();
        });
    });

    describe("save", function() {
        describe("save with good conf", function() {
            var obj = {
                'title' : 'Mon post',
                'content' : 'Mon article'
            };

            it('obj must be in datas provider',function(){
                var datasP;
                model.save(obj);
                provider.fetch({success:function(datas){
                    dataProvider = datas;
                    expect(dataProvider).toContain(obj);
                }});
            });

            describe("save with callback", function() {
                var callback = jasmine.createSpy();
                model.save(obj, callback);
                it("function callback must be executed", function(){
                    expect(callback).toHaveBeenCalled();
                });
            });
        });

        describe("save with wrong conf", function() {
            it('obj must exit',function(){
                expect(function(){
                    model.save();
                }).toThrow();
            });

            it('obj must be an object',function(){
                expect(function(){
                    model.save("toto");
                }).toThrow();
            });
        });
    });

    describe('get/set ModelName', function(){
        var model2 = oo.createModel({
            name : "modelname",
            provider : {
                type: "fake"
            }
        });

        var name = model2.getModelName();
        it( 'must return the name of the model', function(){
          expect(name).toBe("modelname");
        });

        model2.setModelName('newname');
        it('model name must have been changed', function(){
            var name = model2.getModelName();
            expect(name).toBe('newname');
        });
    });

    describe('get(id)', function(){
        var model = oo.createModel({
            "name" : "modelajax",
            "provider": {
                "type" : "fake"
            },
            "indexes" : ["firstname"]
        });

        //simulate fetch
        model.fetch(function(data){

        });

        it('errors in key', function(){
            expect(function(){
                var item = model.get();
            }).toThrow("Missing key or key must\'t be an object");

            expect(function(){
                var item = model.get({});
            }).toThrow("Missing key or key must\'t be an object");
        });

        it('must return good item', function(){
            var data = model.get(7);
            expect(data.key).toBe(7);
        });
    });

    describe('getBy', function(){
        var model = oo.createModel({
            "name" : "modelajax",
            "provider": {
                "type" : "fake"
            },
            "indexes" : ["firstname"]
        });

        //simulate fetch
        model.fetch(function(data){

        });

        it('params must exist', function(){
            expect(function(){
                var item = model.getBy();
            }).toThrow('Missing params index or key');

            expect(function(){
                var item = model.getBy('ml');
            }).toThrow('Missing params index or key');

            expect(function(){
                var item = model.getBy(undefined, 'ml');
            }).toThrow('Missing params index or key');
        });

        it('first param must be a string', function(){
            expect(function(){
                var item = model.getBy(10, "ok");
            }).toThrow('Param index must be a string');
            expect(function(){
                var item = model.getBy( {}, "ok");
            }).toThrow('Param index must be a string');
        });

        it('must return the good item', function(){
            var item = model.getBy("firstname", "claire");
            expect(item.firstname).toBe("claire");
        });

        it('must return error when index used are not been declared', function(){
            expect(function(){
                var item = model.getBy('title', 'article 10');
            }).toThrow('Index are not been declared');
        });

        it('must return null when no matched', function(){
            expect(model.get(100)).toBe(null);
            expect(model.getBy("firstname", "clairedfkgldfjglkdfj")).toBe(null);
        });
    });

    describe('set', function(){
        var model = oo.createModel({
            "name" : "modelajax",
            "provider": {
                "type" : "fake"
            },
            "indexes" : ["firstname"]
        });

        //simulate fetch
        model.fetch(function(data){});
        it('parameter must exist', function(){
            expect(function(){
                model.set();
            }).toThrow('Parameter must exist and be an object');

            expect(function(){
                model.set("kljlkj");
            }).toThrow('Parameter must exist and be an object');
        });

        it('new item must be saved', function(){
            var nItem = {'key':60, "firstname":"new item", "nickname":"toto"};
            model.set(nItem);
            model.fetch(function(data){});

            var rItem = model.get(60);
            expect(rItem.key).toBe(60);
            expect(rItem.firstname).toBe("new item");
            expect(rItem.nickname).toBe("toto");
        });
    });
});