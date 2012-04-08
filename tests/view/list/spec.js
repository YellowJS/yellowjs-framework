describe("oolist.js", function() {


    var model, provider;

    beforeEach(function () {
        provider = new oo.data.FakeProvider({
            "name" : "fdsfsdf"//,
            // "data" : [{
            //     "firstname" : "Mathias"
            // }, {
            //     "firstname" : "Claire"
            // }]
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
                'model' : model,
                'template' : '<div>{{#loop}}{{firstname}}{{/loop}}</div>',
                'el' : '#target'
            });

            expect(list._tpl).toEqual('<div>{{#loop}}{{firstname}}{{/loop}}</div>');
        });


        it("should not have a structure tpl", function () {

            var list = oo.createElement('list', {
                'model' : model,
                'template' : '<div>{{#loop}}{{firstname}}{{/loop}}</div>',
                'el' : '#target'
            });

            expect(list._noStructure).toBeTruthy();
            expect(list._structTpl).toEqual('');
        });

        it("should have a structure tpl", function () {

            var list = oo.createElement('list', {
                'model' : model,
                'noStructure': false,
                'template' : '<div>{{firstname}}</div>',
                'el' : '#target'
            });

            expect(list._noStructure).toBeFalsy();
            expect(list._structTpl).toEqual('<ul>{{#loop}}<li ' + list._listItemDataAttrib + '="{{' + list._identityField + '}}" class="' + list._listItemCls + '">{{tpl}}</li>{{/loop}}</ul>');
            expect(list._tpl).toEqual('<ul>{{#loop}}<li ' + list._listItemDataAttrib + '="{{' + list._identityField + '}}" class="' + list._listItemCls + '"><div>{{firstname}}</div></li>{{/loop}}</ul>');

        });

        it("should reject my bad formatted template", function () {

            var list = oo.createElement('list', {
                'model' : model,
                'template' : '<div>{{#loop}}{{firstname}}{{/loop}}</div>',
                'el' : '#target'
            });

            expect(function () {list.setTemplate('<div>{{tutu}}</div><div></div>'); }).toThrow('Invalid template - template should have a "loop" pattern');
        });

    });

    describe('prepareData', function(){
        it ("should return a well formatted object", function () {

            var list = oo.createElement('list', {
                model : model,
                'template' : '<div>{{#loop}}{{firstname}}{{/loop}}</div>',
                'el' : '#target'
            });

            var preparedData = list.prepareData({data: 'toto'});
            expect(preparedData.loop.data).toEqual('toto');
        });
    });

    describe('renderTo', function(){

        it("should make something good :)", function () {

            runs(function () {
                this.list = oo.createElement('list', {
                    model : model,
                    'template' : '<ul class="my-list">{{#loop}}<li>{{firstname}}</li>{{/loop}}</ul>',
                    'el' : '#target'
                });

                model.fetch();
            });

            waits(500);

            runs(function () {
                expect(document.querySelector(".my-list").childNodes.length).toEqual(114);
            });

        });

    });
});