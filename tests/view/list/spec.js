describe("oolist.js", function() {

    var provider = new oo.data.FakeProvider({
        "name" : "fdsfsdf"
    });

    var model = oo.createModel({
        'name' : "test",
        'provider' : provider
    });

    var list2 = oo.createElement('list', {
        model : model,
        'template' : '<span class="h1">{{firstname}}</span> | <span class="h2">{{nickname}}</span>',
        'target' : '#target'
    });

    describe('prepareData', function(){
        it ("should return a well formatted object", function () {
            var preparedData = list2.prepareData({data: 'toto'});
            expect(preparedData.data.data).toEqual('toto');
        });
    });

    describe('render', function(){

        it("should have a well formated template", function () {
            expect(list2._tpl).toEqual('<ul>{{#data}}<li data-id="{{key}}" class="oo-list-item"><span class="h1">{{firstname}}</span> | <span class="h2">{{nickname}}</span></li>{{/data}}</ul>');
        });

        model.fetch();
    });
});