describe("ooiscroll.js", function() {
    var list = null;
    beforeEach(function () {
      list = oo.createElement('list', {
        el : "#listscroll"
      });
      list.setScrollable();
    });
    
    describe('setScrollable', function(){
        it('should exist scroll property', function(){
            expect(list.scroll).toBeDefined();
        });
        it('should have the scroll property which be an instance of oo.view.scroll.IScroll', function(){
            expect(list.scroll instanceof oo.view.scroll.IScroll).toBeTruthy();
        });
    });
});