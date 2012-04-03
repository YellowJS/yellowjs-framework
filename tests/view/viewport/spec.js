describe("ooviewport.js", function() {

    describe("constructor", function () {
        var v = oo.getViewport('#viewport');

        it("should be an instance of Viewport", function () {
            expect(v instanceof oo.view.Viewport).toBeTruthy();
        });
    });

    describe("methods", function () {
       
        var v;

        beforeEach(function () {
            v = oo.getViewport('#viewport');
        });

        describe("stage API", function () {
            it ("should create a stage", function () {
                v.createStage('main');

                expect(undefined !== v._stages.main).toBeTruthy();
            });

            it ("should create a nested stages", function () {
                v.createStage('main.posts');

                expect(undefined !== v._stages.main.posts).toBeTruthy();
            });

            it ("should create sibling stages", function () {
                v.createStage('main.posts');
                v.createStage('main.videos');

                expect(undefined !== v._stages.main.posts).toBeTruthy();
                expect(undefined !== v._stages.main.videos).toBeTruthy();
            });

        });

        describe("panel registering/presence", function () {

            beforeEach(function () {

                oo.createPanel({
                    id:'panel-1',
                    init: function init () { },
                    onEnabled: function onEnabled () { }
                });

                oo.createPanel({
                    id:'panel-2',
                    init: function init () { },
                    onEnabled: function onEnabled () { }
                });
            });

            it ("should not have the panel", function () {
                expect(v.hasPanel("panel-test")).toEqual(false);
            });

            it ("should have a panel", function () {
                v.addPanel('panel-1');
                expect(v.hasPanel("panel-1")).toEqual(true);
            });

            it ("should render a dom node and append it", function () {
                v.show('panel-1');
                
                //var s = jasmine.FakeTimer('timeout');

                // let the browser refresh/repaint content
                setTimeout(function () {
                    //expect(document.querySelector('#panel-1') !== null).toBeTruthy();
                    var nodeExists = document.querySelector('#panel-1') !== null;
                    if (!nodeExists)
                        throw "Node not appended";
                        
                    //console.log(nodeExists);
                    //s.call(this, nodeExists);
                }, 10);

                //expect(s).toHaveBeenCalledWith(true);
            });

            it ("should render a dom node and append it", function () {
                v.show('panel-2');
                
                //var s = jasmine.FakeTimer('timeout');

                // let the browser refresh/repaint content
                setTimeout(function () {
                    //expect(document.querySelector('#panel-1') !== null).toBeTruthy();
                    var nodeExists = document.querySelector('#panel-2') !== null;
                    if (!nodeExists)
                        throw "Node not appended";
                        
                    //console.log(nodeExists);
                    //s.call(this, nodeExists);
                }, 10);

                //expect(s).toHaveBeenCalledWith(true);
            });
       });
        
    });
    
});