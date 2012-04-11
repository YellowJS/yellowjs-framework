describe("ooslider.js", function() {
    

    describe('constructor', function(){

        var provider = new oo.data.FakeProvider({
            "name" : "fdsfsdf"
        });

        var model = oo.createModel({
            'name' : "test",
            'provider' : provider
        });

        var slider = oo.createElement('sliderCursor',{
            el:"#slider",
            model : model,
            cursor:"#slider > .cursor",
            items : {el: "#slider > .items", template : '{{#loop}}<i></i>{{/loop}}'},
            translate:{x:true,y:false},
            overlay : '#overlay'
        });

        var slider2 = oo.createElement('sliderCursor',{el:"#slider2", model : model, cursor:"#slider2 > div", translate:{x:false,y:true}});

    });

});