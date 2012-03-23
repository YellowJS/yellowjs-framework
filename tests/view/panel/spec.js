describe("oopanel.js", function() {

    var  node, p, needToRender = true;

    beforeEach(function () {

        var pClass = new oo.createPanel({
            id: 'dummy-panel',
            init: function () {
                this.setTemplate('<div id="tester"></div>');
            },
            onEnabled: function () {
                node = oo.createElement('node', {el: '#tester', template:'test ok'});

                // for test purpose - not supposed to do that in a real application
                node._needToRender = needToRender;

                this.addEl(node);
            }
        }, true);

        p = new pClass();

    });

    describe("elem management", function () {

        beforeEach(function () {
            p.renderTo(new oo.view.Dom('#test-1'));
        });

        it("should have only one element", function () {
            expect(p._uiElements[ node.getId()]).toBeDefined();
        });

        it("should have  node stored in its _uiElements member var", function () {
            expect(p._uiElements[ node.getId()]).toEqual( node);
        });

        it("should return  node", function () {
            expect(p.getEl( node.getId())).toEqual( node);
        });
    });

    describe("rendering", function () {
        it("should call the render function of the  node object", function () {

            p.renderTo(new oo.view.Dom('#test-2'));

            expect(document.querySelector('#test-2 #tester').innerHTML).toEqual('test ok');
        });

        it("should not call the render function of the  node object", function () {
            
            // overrides for test purpose only
            needToRender = false;

            p.renderTo(new oo.view.Dom('#test-3'));

            expect(document.querySelector('#test-3 #tester').innerHTML).toEqual('');
        });

    });

});
