describe("oolist.js", function() {


    var model, provider;

    beforeEach(function () {
        provider = new oo.data.FakeProvider({
            "name" : "fdsfsdf"
        });

        model = oo.createModel({
            'name' : "test",
            'provider' : provider
        });

    });

    afterEach(function () {
        oo.data.Model.unregister('test');
        model = null;
    });

    describe ('contructor', function () {
        it("should have a well formated template", function () {

            var list = oo.createElement('list', {
                model : model,
                'template' : '<div>{{firstname}}</div>',
                'el' : '#target'
            });

            expect(list._tpl).toEqual('{{#data}}<div>{{firstname}}</div>{{/data}}');
        });


        it("should not have a structure tpl", function () {

            var list = oo.createElement('list', {
                model : model,
                'template' : '<div>{{firstname}}</div>',
                'el' : '#target'
            });

            expect(list._noStructure).toBeTruthy();
            expect(list._structTpl).toEqual('');
        });

        it("should have a structure tpl", function () {

            var list = oo.createElement('list', {
                model : model,
                noStructure: false,
                'template' : '<div>{{firstname}}</div>',
                'el' : '#target'
            });

            expect(list._noStructure).toBeFalsy();
            expect(list._structTpl).toEqual('<ul>{{#data}}<li data-id="{{key}}" class="oo-list-item">{{tpl}}</li>{{/data}}</ul>');
            expect(list._tpl).toEqual('<ul>{{#data}}<li data-id="{{key}}" class="oo-list-item"><div>{{firstname}}</div></li>{{/data}}</ul>');

        });

        it("should reject my bad formatted template", function () {

            var list = oo.createElement('list', {
                model : model,
                'template' : '<div>{{firstname}}</div>',
                'el' : '#target'
            });

            expect(function () {list.setTemplate('<div>{{tutu}}</div><div></div>'); }).toThrow('Invalid template - the template must have a single root node');
        });

    });

    describe('prepareData', function(){
        it ("should return a well formatted object", function () {

            var list = oo.createElement('list', {
                model : model,
                'template' : '<div>{{firstname}}</div>',
                'el' : '#target'
            });

            var preparedData = list.prepareData({data: 'toto'});
            expect(preparedData.data.data).toEqual('toto');
        });
    });

    describe('renderTo', function(){

        it("should make something good :)", function () {

            runs(function () {
                this.list = oo.createElement('list', {
                    model : model,
                    'template' : '<div>{{firstname}}</div>',
                    'el' : '#target'
                });

                model.fetch();
            });

            waits(500);

            runs(function () {
                expect(this.list.children().length).toEqual(114);
            });

        });

    });
});