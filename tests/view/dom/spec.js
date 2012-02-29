describe("oodom.js", function() {
    var ooDom = new oo.view.Dom('#domtest'); 

    describe("setTranslateX", function () {  
        it('translateX value should be equal to 100', function () {    
            ooDom.setTranslateX(100);
            var matrix = new WebKitCSSMatrix(window.getComputedStyle(ooDom._dom).webkitTransform);
            expect(matrix.e).toEqual(100);
        });
    });
    
    describe("setTranslateY", function () {  
        it('translateY value should be equal to 150', function () {    
            ooDom.setTranslateY(150);
            var matrix = new WebKitCSSMatrix(window.getComputedStyle(ooDom._dom).webkitTransform);
            expect(matrix.f).toEqual(150);
        });
    });
    describe("getTranslateX", function () {  
        it('value should be equal to matrix.e == 100', function () {    
            var val = ooDom.getTranslateX(),
                matrix = new WebKitCSSMatrix(window.getComputedStyle(ooDom._dom).webkitTransform);
            expect(val).toEqual(matrix.e);
        });
    });
    describe("getTranslateY", function () {  
        it('value should be equal to matrix.f == 150', function () {    
            var val = ooDom.getTranslateY(),
                matrix = new WebKitCSSMatrix(window.getComputedStyle(ooDom._dom).webkitTransform);
            expect(val).toEqual(matrix.f);
        });
    }); 
    describe("getTranslations", function(){
        ooDom.setTranslateX(100);
        ooDom.setTranslateX(150);
        var val = ooDom.getTranslations(),
            matrix = new WebKitCSSMatrix(window.getComputedStyle(ooDom._dom).webkitTransform);;
        
        it('value should be an array', function () {    
            expect(val).toBeTruthy(val instanceof Array);
        });
        it('first value should be translateX value', function () {    
            expect(val[0]).toEqual(matrix.e);
        });
        it('second value should be translateY value', function () {    
            expect(val[1]).toEqual(matrix.f);
        }); 
    });
    
    describe("appendHtml", function(){
        it('element should should contain <span.test> DomElement', function () {    
            var txt = '<span class="test"></span>';
            ooDom.appendHtml(txt);
            var test = ooDom._dom.querySelector('.test');
            expect(test).toBeTruthy(jasmine.isDomNode(test));
        });
    });

    describe("addClass", function(){
        var el = new oo.view.Dom(document.querySelector("#testcls"));
        el.classList.addClass('tst');
        el.classList.addClass('tst');
    });
});