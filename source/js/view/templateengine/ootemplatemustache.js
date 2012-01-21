var oo = (function (oo){
    var global = this;
    var tplEngine = oo.getNS('oo.view.templateengine');

    var templateEngineMustache = tplEngine.TemplateEngineMustache = my.Class(oo.view.templateengine.Template,{
        constructor: function (options) {
            templateEngineMustache.Super.call(this, options);
        },
        render: function (datas, tpl) {
            if(!datas && !tpl && !domElem) {
                throw Error('datas, tpl and domElem must exist');
            }

            var output='';
            datas.forEach(function(item){
                output += Mustache.render(tpl, item);
            });

            return output;
        }
    });

    tplEngine.Template.register(templateEngineMustache, 'mustache');
    
    return oo;

})(oo || {});