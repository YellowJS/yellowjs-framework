describe("ooscroll.js", function() {
    describe("add a second scroll with the same code name", function () {
        
        it("should throw an error", function () {
            expect(function () { oo.view.scroll.Scroll.register(oo.view.scroll.IScroll, 'iscroll'); }).toThrow('Already existing codename');
        });

    });

    describe("try to get a scroll", function () {
        
        it("should return a IScroll", function () {
            var cls = oo.view.scroll.Scroll.get('iscroll');
            var obj = new cls();
            expect(obj instanceof oo.view.scroll.IScroll).toBeTruthy();
        });

        it("should throw an error", function () {
            expect(function () { oo.view.scroll.Scroll.get('invalid-scroll'); }).toThrow('Invalid codename');
        });

    });

    

    describe("call forbiden method on Scroll \"interface\"", function () {

        var p = new oo.view.scroll.Scroll();

        describe("call scrollTo method", function () {
        
            it("should throw an error", function () {
                expect(function () { p.scrollTo(); }).toThrow();
            });

        });
    });
});