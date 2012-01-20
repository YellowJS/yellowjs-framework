var oo = (function (oo) {

    // shorthand
    var Dom = oo.view.Dom,
        ns = oo.getNS('oo.view');
    
    var List = ns.List = my.Class(oo.view.Element, {
        _tpl : null,
        _model : null,
        _wrapper : null,
        constructor: function constructor(conf) {
            List.Super.call(this);
            if(conf){
                
                if( conf.hasOwnProperty('model') ){
                    this.setModel(conf.model);
                }

                if( conf.hasOwnProperty('template') ){
                    this.setTemplate(conf.template);
                }

                if( conf.hasOwnProperty('wrapper') ){
                    this.setWrapper(conf.wrapper);
                }
            }

            if (this._model && (this._model instanceof oo.data.Model)){
                this._prepareRender();
            }
        },
        _transformToOoDom : function _transformToOoDom(elem){
            return new Dom(elem);
        },
        /*fetch datas from model*/
        _prepareRender : function _prepareRender(){
            var that = this;
            this._model.fetch(function(datas){
                that._render(datas, that._tpl);
            });
        },
        _render : function render(datas,tpl){
            oo.view.Element.templateEngine.render(datas,tpl, this._wrapper);
        },
        setTemplate : function setTemplate(tpl){
            this._tpl = tpl || null;
        },
        setModel : function setModel(model){
            var that = this;
            this._model = model || null;
            /*this._model.addListener(oo.data.Model.AFTER_SAVE, function (success) {
                if (success)
                    that._render();
            });*/
        },
        setWrapper : function setWrapper(elem){
            if(!elem) return;

            this._wrapper = this._transformToOoDom(elem) || null;
        }
    });
    
    oo.view.Element.register(List, 'list');

    return oo;
    
})(oo || {});