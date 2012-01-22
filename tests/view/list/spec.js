describe("oolist.js", function() {

    describe('render', function(){
        var provider = new oo.data.FakeProvider({
            "name" : "fdsfsdf"
        });

        var model = oo.createModel({
            'id' : "test",
            'provider' : provider
        });

        var list2 = oo.createElement('list', {
            model : model,
            'template' : '<span clss="h1">{{firstname}}</span> | <span clss="h2">{{nickname}}</span>',
            'target' : '#target'
        });

        it("should have a well formated template", function () {
            expect(list2._tpl).toEqual('<ul>{{#data}}<li class="oo-list-item item-{{key}}"><span clss="h1">{{firstname}}</span> | <span clss="h2">{{nickname}}</span></li>{{/data}}</ul>');
        });

        model.fetch(function (data) {
            console.log(data);
        });
    });
});