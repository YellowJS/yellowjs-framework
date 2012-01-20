describe("ootemplate.js", function() {
    describe("add a second template with the same code name", function () {
        
        it("should throw an error", function () {
            expect(function () { oo.view.templateengine.Template.register(oo.view.templateengine.TemplateEngineMustache, 'mustache'); }).toThrow('Already existing codename');
        });

    });

    describe("try to get a template", function () {
        
        it("should return a templateEngineMustache", function () {
            var cls = oo.view.templateengine.Template.get('mustache');
            var obj = new cls();
            console.log(oo.view.templateengine.TemplateEngineMustache)
            expect(obj instanceof oo.view.templateengine.TemplateEngineMustache).toBeTruthy();
        });

        it("should throw an error", function () {
            expect(function () { oo.view.templateengine.Template.get('invalid-fake'); }).toThrow('Invalid codename');
        });

    });

    

    describe("call forbiden method on Provider \"interface\"", function () {

        var p = new oo.view.templateengine.Template();

        describe("call render method", function () {
        
            it("should throw an error", function () {
                expect(function () { p.render(); }).toThrow();
            });

        });
    });
});