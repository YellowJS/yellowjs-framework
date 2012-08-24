describe("oomodel.js", function() {

    var provider, model;

    beforeEach(function () {

        provider = new oo.data.FakeProvider({
            "name" : "bar"
        });

        model = oo.createModel({
            name : 'post-model',
            provider: provider
        });

    });

    afterEach(function () {
        oo.data.Model.unregister('post-model');
    });

    describe("constructor", function() {
        it('model._id must be equal to "post-model"',function(){
           expect(model._name).toEqual("post-model");
        });

        it('model._provider must be equal to "provider"',function(){
            expect(model._provider instanceof oo.data.Provider).toBeTruthy();
        });
    });

    describe("attribute manipulation method", function () {

        describe("setProvider", function () {
            it ("should update the internal provider", function () {
                var p =  new oo.data.FakeProvider({
                    "name" : "foo"
                });
                model.setProvider(p);

                expect(model._provider._name).toEqual('foo');
            });
        });
        describe("getModelName", function () {
            it("should return the name of the model", function() {
                expect(model.getModelName()).toEqual('post-model');
            });
        });
        describe("setModelName", function () {
            it("should change the model name", function() {
                model.setModelName('model2');
                expect(model.getModelName()).toEqual('model2');
            });
        });

        describe('indexes management methods', function () {
            describe('setIndexes', function () {
                it('should have an index on firstname', function () {
                    model.setIndexes(['firstname']);

                    expect(typeof model._indexes.firstname).toEqual('object');
                });
            });

            describe('_resetIndexes', function () {
                it('should have an empty index on firstname', function () {
                    model.setIndexes(['firstname']);

                    model._indexes.firstname = 'toto';

                    model._resetIndexes();

                    expect(typeof model._indexes.firstname).toEqual('object');
                });
            });

            describe('_buildIndex', function () {
                it('should have an filled index on firstname', function () {
                    model.setIndexes(['firstname']);

                    var content = {'firstname': 'toto'};
                    model._buildIndex(content);

                    expect(typeof model._indexes.firstname).toEqual('object');
                });
            });

            describe('_removeFromIndex', function () {
                it('should have an filled index on firstname', function () {
                    model.setIndexes(['firstname']);

                    var content = {'firstname': 'toto'};
                    model._buildIndex(content);

                    model._removeFromIndex(content);
                    expect(model._indexes.firstname.toto[0]).toEqual(content);
                });
            });

        });

    });

    describe("data manipulation method", function () {
        var callback = jasmine.createSpy();

        describe("fetch", function() {
            it('should execute the callback',function(){
                model.fetch(callback);

                expect(callback).toHaveBeenCalled();
            });

            it('should have the right number of records', function() {
                model.fetch(callback);

                expect(model._data.length).toEqual(114);

                model.fetch(callback, true);

                expect(model._data.length).toEqual(218);
            });

            it ('should trigger the AFTER_FETCH event', function () {
                model.addListener(oo.data.Model.AFTER_FETCH, callback);

                expect(callback).toHaveBeenCalled();
            });
        });

        describe("save", function() {
            it("should have the same data", function () {
                model.fetch();
                model.save();

                for(var i=0, len=model.getData().length; i<len; i++) {
                    expect(model.getData()[i].key).toEqual(model._provider._data[i].key);
                }
            });

            it('should execute the callback', function () {
                model.save(callback);
                expect(callback).toHaveBeenCalled();
            });

            it('should trigger the AFTER_SAVE event', function () {
                model.addListener(oo.data.Model.AFTER_SAVE, callback);
                model.save();
                expect(callback).toHaveBeenCalled();
            });

        });

        describe("filterBy", function () {
            describe("filter on an indexed field", function () {
                it ("should return one record", function() {
                    model.setIndexes(['firstname']);
                    model.fetch();

                    var result = model.filterBy('firstname', 'toto');

                    expect(result.length).toEqual(1);
                });

                it ("should return several records", function() {
                    model.setIndexes(['firstname']);
                    model.fetch();

                    var result = model.filterBy('firstname', 'gg');

                    expect(result.length).toEqual(7);
                });
            });

            describe("filter on a non indexed field", function () {
                it ("should return one record", function() {
                    model.fetch();

                    var result = model.filterBy('firstname', 'toto');

                    expect(result.length).toEqual(1);
                });

                it ("should return several record", function() {
                    model.fetch();

                    var result = model.filterBy('firstname', 'gg');

                    expect(result.length).toEqual(7);
                });

            });
        });

        describe("get", function () {
            it ("should return one record", function() {
                model.fetch();
                var result = model.get(7);
                expect(typeof result).toEqual('object');

                expect(result.key).toEqual(7);
                expect(result.firstname).toEqual('gg');
            });
        });

        describe('at', function(){
            it('should return error', function(){
                expect(function(){
                    model.at();
                }).toThrow("Missing index or index must be a number");
                expect(function(){
                    model.at("test");
                }).toThrow("Missing index or index must be a number");
            });
            it('should return the good data', function(){
                var data = model.at(0);
                expect(data).toBeUndefined();
                model.fetch();

                data = model.at(0);
                expect(data.firstname).toEqual("claire");
            });
        });
    });
});