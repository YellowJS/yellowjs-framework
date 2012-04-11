describe("ooiscroll.js", function() {
    var list;
    var model;
    model = oo.createModel({
        name : "model-list",
        provider : {
            type:"fake"
        }
    });

    beforeEach(function () {
        list = oo.createElement('list', {
            el : "#listscroll",
            model : model,
            template: "<ul>{{#loop}}<li>{{title}}</li>{{/loop}}</ul>"
        });
        model.fetch();
        //list.setScrollable();

    });

    describe('constructor', function(){
        it('should throw error if missing options config', function(){
            expect(function(){
                var iscroll = new oo.view.scroll.IScroll();
            }).toThrow('Missing options or missing "el" property in your options or options is not an object');
        });

        it('should throw error if options config is not an object', function(){
            expect(function(){
                var iscroll = new oo.view.scroll.IScroll("");
            }).toThrow('Missing options or missing "el" property in your options or options is not an object');
        });

        it('should throw error if missing el', function(){
            expect(function(){
                var iscroll = new oo.view.scroll.IScroll({});
            }).toThrow('Missing options or missing "el" property in your options or options is not an object');
        });

        it('should throw error if el is not an identifier, not a dom element and not a ooDom element', function(){
            expect(function(){
                var iscroll = new oo.view.scroll.IScroll({
                    el : []
                });
            }).toThrow('el must be a Dom object, a oo.view.Dom or an identifier');
        });

        it('should have the _identifier of opt.el when opt.el is a string', function(){
            var id = "#listscroll";
            var iscroll = new oo.view.scroll.IScroll({
                    el : id
                });
            expect(iscroll.el.getId()).toEqual( id.substr(1));
        });

        it('should have the _identifier of opt.el when opt.el is a dom element', function(){
            var id = "listscroll";
            var iscroll = new oo.view.scroll.IScroll({
                    el : document.getElementById(id)
                });
            expect(iscroll.el.getId()).toEqual(id);
        });

        it('should have the _identifier of opt.el when opt.el is a ooDom', function(){
            var id = "#listscroll";
            var iscroll = new oo.view.scroll.IScroll({
                    el : new oo.view.Dom(id)
                });
            expect(iscroll.el.getId()).toEqual( id.substr(1));
        });
    });
});