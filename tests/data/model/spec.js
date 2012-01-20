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
                provider.fetch(function(datas){
                    dataProvider = datas;
                });
                expect(dataProvider).toContain(obj);
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

    /*describe('listeners', function(){
       var model2 = oo.createModel({
            id : 'post-model2',
            provider : provider
       });

       model2.addListener(oo.data.Model.AFTER_SAVE, function(){
          alert('opdfkgpodfkg');
       });

       model2.fetch(function(datas){
           console.log(datas);
       });
    });*/
});