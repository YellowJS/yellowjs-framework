(function (oo) {

    var global = this;

    var ModelElement = oo.getNS('oo.view').ModelElement = oo.Class(oo.view.Element, {
        _model : null,

        constructor: function constructor (options) {
            if( options.hasOwnProperty('model') ){
                this.setModel(options.model);
                delete options.model;
            }

            ModelElement.Super.call(this, options);

        },
        afterFetch : function afterFetch(data){
            var output = this.render(data, this._tpl);
            this.appendHtml(output);
        },
        setModel : function setModel(model){
            if (model instanceof oo.data.Model)
                this._model = model;
            else
                this._model = oo.createModel(model);
        },
        prepareData: function prepareData(data) {
            return data;
        },
        render: function render (data, tpl) {
            if (!data)
                data = {};
            
            return ModelElement.Super.prototype.render.call(this, this.prepareData(data));
            
        }

    });

})(oo);