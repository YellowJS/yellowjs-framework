describe("oomodel.js", function() {

    var provider = new oo.data.Fakeprovider({
        "name" : "bar"
    });


    var model = oo.createModel({
        id : 'post-model',
        provider: provider
    });

    //must be changed later due to async
    var dataProvider;

    provider.fetch(function(datas){
        dataProvider = datas;
    });



    describe("constructor", function() {
        it('model._id must be equal to "post-model"',function(){
           expect(model._id).toEqual("post-model");
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

        it('function callback must be executed with provider datas',function(){
           expect(callback).toHaveBeenCalledWith(dataProvider);
        });
    });

    describe("save", function() {
        describe("save with good conf", function() {
            it('obj must be in datas provider',function(){
                var datasP,
                    obj = {
                        'title' : 'Mon post',
                        'content' : 'Mon article'
                    };

                model.save(obj);
                provider.fetch(function(datas){
                    dataProvider = datas;
                });
                
                expect(dataProvider).toContain(obj);
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

});