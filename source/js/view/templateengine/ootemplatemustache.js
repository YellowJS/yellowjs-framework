var oo = (function (oo){
    var global = this;
    var tplEngine = oo.getNS('oo.view.templateengine');

    var templateEngineMustache = tplEngine.TemplateMustache = my.Class(oo.view.templateengine.Template,{
        _name: '',
        constructor: function (options) {
            templateEngineMustache.Super.call(this, options);
        },
        render: function (datas,tpl, domElem) {
            var output='';
            datas.forEach(function(item){
                output += Mustache.render(tpl, item);
            });

            domElem.appendHtml(output);
        }
    });

    tplEngine.Template.register(templateEngineMustache, 'mustache');
    
    return oo;

})(oo || {});