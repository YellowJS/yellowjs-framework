describe("oobutton.js", function() {
    var ooButton = new oo.View.Button('#button'); 
    var dom = ooButton.getDom();
       console.log(dom);
    describe("getDom", function () {  
        it('Should return an instance of oo.View.Dom', function () {
            expect(dom instanceof oo.View.Dom).toBeTruthy();
        });
    }); 
    
    describe("setActive(true)", function () {  
        it('the button should has class active', function () {
            ooButton.setActive(true);
            var cls = dom._dom.getAttribute('class');
            expect(cls.indexOf('active')).toNotBe(-1);
        });
    });
    
    describe("setActive(false)", function () {  
        it('the button shouldn\'t has class active', function () {
            ooButton.setActive(false);
            var cls = dom._dom.getAttribute('class');
            expect(cls.indexOf('active')).toBe(-1);
        });
    });
    
    describe("isActive", function () {  
        it('Should be boolean', function () {
            var res = ooButton.isActive(); 
            expect(res.constructor === Boolean).toBeTruthy();
        });
        
        it('Should be true after setActive(true)', function () {
            ooButton.setActive(true);
            var res = ooButton.isActive(); 
            expect(res).toBeTruthy();
        });
        
        it('Should be false after setActive(false)', function () {
            ooButton.setActive(false);
            var res = ooButton.isActive(); 
            expect(res).toBeFalsy();
        });
    });
    
});