var oo = (function (oo) {

    // shorthand
    var Dom = oo.view.Dom;
    
    var List = my.Class(/*oo.view.Dom,*/ {
        _tpl : null,
        _model : null,
        _wrapper : null,
        constructor: function constructor(conf) {
            if(conf){
                if( conf.hasOwnProperty('model') ){
                    this.setModel(conf.model);
                }

                if( conf.hasOwnProperty('template') ){
                    this.setTemplate(conf.template);
                }
            }
        },
        setTemplate : function setTemplate(tpl){
            this._tpl = tpl || null;
        },
        setModel : function setModel(model){
            this._model = model || null;
        }
    });
    
    var exports = oo.getNS('oo.view');
    exports.List = List;
    
    return oo;
    
})(oo || {});