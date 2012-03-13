var oo = (function (oo){
    var global = this;
    var tplEngine = oo.getNS('oo.view.templateengine');

    var templateEngineHandlebars = tplEngine.TemplateEngineHandlebars = oo.Class(oo.view.templateengine.Template,{
        constructor: function (options) {
            templateEngineHandlebars.Super.call(this, options);
        },
        render: function (tpl, datas) {
            if(!datas && !tpl) {
                throw new Error('datas, tpl and domElem must exist');
            }

            var template = Handlebars.compile(tpl);

            return template(datas);
        }
    });

    tplEngine.Template.register(templateEngineHandlebars, 'handlebars');
    
    return oo;

})(oo || {});