describe("oocarousel.js", function() {
    

    describe('constructor', function(){

        var provider = new oo.data.FakeProvider({
            "name" : "fdsfsdf"
        });

        var model = oo.createModel({
            'name' : "test",
            'provider' : provider
        });

        var slider = oo.createElement('sliderCursor',{
            target:"#slider",
            model : model,
            cursor:"#slider > .cursor",
            items : {el: "#slider > .items", template : '<i></i>'},
            translate:{x:true,y:false},
            overlay : '#overlay'
        });

        var slider2 = oo.createElement('sliderCursor',{target:"#slider2", model : model, cursor:"#slider2 > div", translate:{x:false,y:true}});

    });

});