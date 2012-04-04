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

            describe ("creating/deleting stages", function () {
                it ("should create a stage", function () {
                    v.createStage('main');

                    expect(undefined !== v._stages.main).toBeTruthy();
                });

                it ("should create a nested stages", function () {
                    v.createStage('main.posts');

                    expect(undefined !== v._stages.main.posts).toBeTruthy();
                });

                it ("should delete a stage", function () {
                    v.createStage('main.posts');
                    v.removeStage('main.posts');

                    console.log(v._stages.main.posts);
                    expect(undefined === v._stages.main.posts).toBeTruthy();
                });

                it ("should create sibling stages", function () {
                    v.createStage('main.posts');
                    v.createStage('main.videos');

                    expect(undefined !== v._stages.main.posts).toBeTruthy();
                    expect(undefined !== v._stages.main.videos).toBeTruthy();
                });
            });

            describe ("adding/removing panel to/from stages", function () {
                it("should add the panel toto to the stage \"main\"", function() {
                    v.addToStage('toto', 'main');
                    expect(v._stages.main.panels.length).toEqual(1);
                });

                it("should remove the panel from the stage it is registered", function() {
                    v.removeFromStage('toto');
                    expect(v._stages.main.panels.length).toEqual(0);
                });
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

            afterEach(function () {
                v.removeFromStage('panel-1');
                v.removeFromStage('panel-2');
            });

            it ("should not have the panel", function () {
                expect(v.hasPanel("panel-test")).toEqual(false);
            });

            it ("should have a panel", function () {
                v.addPanel('panel-1');
                expect(v.hasPanel("panel-1")).toEqual(true);
            });

            it ("should render a dom node and append it", function () {
                v.showPanel('panel-1');
                
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
                v.showPanel('panel-2');
                
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