describe("oopanel.js", function() {

    var fakeEl, p;

    beforeEach(function () {

        p = new oo.view.Panel();

        // mock object
        fakeEl = {
            getId: function () {
                return 2;
            },
            needToRender: function () {
                return this._needToRender;
            },
            _needToRender: true,
            render: oo.emptyFn
        };

        p.addEl(fakeEl);

    });

    describe("elem management", function () {

        it("should have only one element", function () {
            expect(p._uiElements[fakeEl.getId()]).toBeDefined();
        });

        it("should have fakeEl stored in its _uiElements member var", function () {
            expect(p._uiElements[fakeEl.getId()]).toEqual(fakeEl);
        });

        it("should return fakeEl", function () {
            expect(p.getEl(fakeEl.getId())).toEqual(fakeEl);
        });
    });

    describe("rendering", function () {
        it("should call the render function of the fakeEl object", function () {
            spyOn(fakeEl, 'render');

            // override render function for test purpose only
            oo.view.Panel.Super.prototype.render = oo.emptyFn;

            p.render();

            expect(fakeEl.render).toHaveBeenCalled();
        });

        it("should not call the render function of the fakeEl object", function () {
            spyOn(fakeEl, 'render');

            // overrides for test purpose only
            fakeEl._needToRender = false;
            p.render = oo.emptyFn;

            p.render();

            expect(fakeEl.render).not.toHaveBeenCalled();
        });

    });

});
