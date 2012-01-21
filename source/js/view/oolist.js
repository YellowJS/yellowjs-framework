var oo = (function (oo) {

    // shorthand
    var Dom = oo.view.Dom,
        ns = oo.getNS('oo.view');
    
    var List = ns.List = my.Class(oo.view.Element, {
        _tpl : null,
        _model : null,
        _target : null,
        constructor: function constructor(conf) {
            var self = this;
            List.Super.call(this);
            if(conf){
                
                if( conf.hasOwnProperty('model') ){
                    this.setModel(conf.model);
                }

                if( conf.hasOwnProperty('template') ){
                    this.setTemplate(conf.template);
                }

                if( conf.hasOwnProperty('target') ){
                    this.settarget(conf.target);
                }
            }

            if (this._model && (this._model instanceof oo.data.Model)){
                this._model.addListener(oo.data.Model.AFTER_FETCH, oo.createDelegate(this.afterFetch, this));
            }
        },
        _transformToOoDom : function _transformToOoDom(elem){
            return new Dom(elem);
        },
        afterFetch : function afterFetch(datas){
            this._render(datas);
        },
        _render : function render(datas){
            this._target.appendHtml(oo.view.Element.templateEngine.render(datas, this._tpl, this._target));
        },
        setTemplate : function setTemplate(tpl){
            this._tpl = tpl || null;
        },
        setModel : function setModel(model){
            this._model = model || null;
        },
        settarget : function settarget(elem){
            if(!elem) return;

            this._target = this._transformToOoDom(elem) || null;
        }
    });
    
    oo.view.Element.register(List, 'list');

    return oo;
    
})(oo || {});