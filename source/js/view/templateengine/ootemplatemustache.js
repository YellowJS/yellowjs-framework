(function (oo){
    var global = this;
    var tplEngine = oo.getNS('oo.view.templateengine');

    var templateEngineMustache = tplEngine.TemplateEngineMustache = oo.Class(oo.view.templateengine.Template,{
        constructor: function (options) {
            templateEngineMustache.Super.call(this, options);
        },
        render: function (tpl, datas) {
            if(!datas && !tpl) {
                throw new Error('datas, tpl and domElem must exist');
            }

            return Mustache.render(tpl, datas);
        }
    });

    tplEngine.Template.register(templateEngineMustache, 'mustache');
    
})(yellowjs || {});