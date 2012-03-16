describe("mixin ooScroll.js", function() {
    var list;
    var model;
    model = oo.createModel({
        name : "model-list",
        provider : {
            type:"fake"
        }
    });

    beforeEach(function () {
        document.getElementById('listscroll').innerHTML = '';
        list = oo.createElement('list', {
            el : "#listscroll",
            model : model,
            template: "{{title}}"
        });
        model.fetch();
        
        list.setScrollable({
            hScroll : false
        });
    });
    
    describe('setScrollable', function(){
        it('should exist scroll property', function(){
            expect(list.scroll).toBeDefined();
        });

        it('should have the scroll property which be an instance of oo.view.scroll.IScroll', function(){
            expect(list.scroll instanceof oo.view.scroll.IScroll).toBeTruthy();
        });

        it('should pass options to the scroll class', function() {
            document.getElementById('listscroll').innerHTML = '';
            list = oo.createElement('list', {
                el : "#listscroll",
                model : model,
                template: "{{title}}"
            });
            model.fetch();
            list.setScrollable({
                hScroll : false,
                vScrollbar : false
            });

            expect(document.getElementById('listscroll').children.length).toEqual(1);
        });
    });
});