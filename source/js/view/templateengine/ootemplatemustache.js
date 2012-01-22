var oo = (function (oo){
    var global = this;
    var tplEngine = oo.getNS('oo.view.templateengine');

    var templateEngineMustache = tplEngine.TemplateEngineMustache = my.Class(oo.view.templateengine.Template,{
        constructor: function (options) {
            templateEngineMustache.Super.call(this, options);
        },
        render: function (datas, tpl) {
            if(!datas && !tpl) {
                throw Error('datas, tpl and domElem must exist');
            }

            return Mustache.render(tpl, datas);
        }
    });

    tplEngine.Template.register(templateEngineMustache, 'mustache');
    
    return oo;

})(oo || {});