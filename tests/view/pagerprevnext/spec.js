describe("oopagerprevnext.js", function() {
   
    describe('constructor', function(){

        it('should throw error Missing options', function(){
            expect(function(){
                var prevNext = oo.createElement("pagerPrevNext");
            }).toThrow("Missing options");
        });

        it('should throw error Missing button previous or button next', function(){
            expect(function(){
                var prevNext = oo.createElement("pagerPrevNext", {});
            }).toThrow("Missing previous or next configuration");
        });

        it('should throw error Missing button previous or button next', function(){
            expect(function(){
                var prevNext = oo.createElement("pagerPrevNext", {next: "#next"});
            }).toThrow("Missing previous or next configuration");

            expect(function(){
                var prevNext2 = oo.createElement("pagerPrevNext", {next: "#prev"});
            }).toThrow("Missing previous or next configuration");
        });

        it('prev should be transform in oo.view.Button', function(){
            var pager = oo.createElement('pagerPrevNext', {
                prev : "#prev",
                next : "#next"
            });

            expect(pager.buttonPrev instanceof oo.view.Button).toBeTruthy();

            var pager2 = oo.createElement('pagerPrevNext', {
                prev : document.querySelector("#prev"),
                next : "#next"
            });

            expect(pager.buttonPrev instanceof oo.view.Button).toBeTruthy();

            var pager3 = oo.createElement('pagerPrevNext', {
                prev : oo.createElement('button', '#prev'),
                next : "#next"
            });

            expect(pager.buttonPrev instanceof oo.view.Button).toBeTruthy();
        });

        it('next should be transform in oo.view.Button', function(){
            var pager = oo.createElement('pagerPrevNext', {
                prev : "#prev",
                next : "#next"
            });

            expect(pager.buttonNext instanceof oo.view.Button).toBeTruthy();

            var pager2 = oo.createElement('pagerPrevNext', {
                prev : '#prev',
                next : document.querySelector("#next")
            });

            expect(pager.buttonNext instanceof oo.view.Button).toBeTruthy();

            var pager3 = oo.createElement('pagerPrevNext', {
                prev : '#prev',
                next : oo.createElement('button', '#next')
            });

            expect(pager.buttonNext instanceof oo.view.Button).toBeTruthy();
        });

        var pagerclick = oo.createElement('pagerPrevNext', {prev: "#prev2", next: "#next2" });
        pagerclick.addListener(oo.view.PagerPrevNext.goToPrev, function(){
            alert('prev');
        });

        pagerclick.addListener(oo.view.PagerPrevNext.goToNext, function(){
            alert('next');
        });
        
    });


});