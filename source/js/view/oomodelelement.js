(function (oo) {

    var global = this;

    var ModelElement = oo.getNS('oo.view').ModelElement = oo.Class(oo.view.Element, {
        _model : null,

        constructor: function constructor (options) {
            
            if( options.hasOwnProperty('model') ){
                this.setModel(options.model);
                delete options.model;
            }

            if (this._model){
                this._model.addListener(oo.data.Model.AFTER_FETCH, oo.createDelegate(this.afterFetch, this));
            }
            
            ModelElement.Super.call(this, options);

        },
        afterFetch : function afterFetch(data){
            this.render(data);
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

            ModelElement.Super.prototype.render.call(this, this.prepareData(data));

        }

    });

})(oo);