describe("ooLocalProvider.js", function() {

    var Cls = oo.data.LocalProvider;

    describe ("instanciation", function () {
        it('should be an instance of oo.data.Provider', function () {
            var obj = new Cls({name: 'local-test'});
            expect(obj instanceof oo.data.Provider).toBeTruthy();
        });
    });

    describe("methods", function () {

        var toto = Lawnchair({name: 'toto', record: 'record'}, function () {
            
            var p, clb, totoModel = this;
            beforeEach(function () {
                p = new Cls({'name' : 'toto'});
                clb = jasmine.createSpy();

                totoModel.nuke(function () {
                    totoModel.batch([{tata: 'toto', tutu: 'tete'}, 
                                     {tata1: 'toto1', tutu1: 'tete1'}], function() {});
                });

            });

            describe ("fetch", function () {

                it("should call the callback with the data as parameter", function () {

                    p.fetch(clb);

                    expect(clb).wasCalled();
                    
                });
                        
            });

            describe ("save", function () {

                it('should call the callback with the data as parameter', function () {

                    var d = {key:'key3', value:'value3'};

                    p.save(d, clb);

                    expect(clb).wasCalled();
                });

            });

        });

    });

});