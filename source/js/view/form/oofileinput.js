/**
 * FileInput class to capture photo or fetch photo from the library
 *
 * @namespace oo.view.form
 * @class FileInput
 *
 */
(function () {
    
    var FileInput =  oo.getNS('oo.view.form').FileInput = oo.Class(oo.view.ModelElement, {
        _pictureSource: null,
        _destinationType: null,
        _file : null,
        constructor: function constructor(opts) {
            FileInput.Super.call(this, opts);
            
            if(opts.type == "picture" && opts.buttons){
                this._pictureSource = navigator.camera.PictureSourceType;
                this._destinationType = navigator.camera.DestinationType;
                this._createButtons(opts.buttons);
            }
        },
        _createButtons: function _createButtons(buttons){
            var self = this;
                for(i in buttons){
                    var s = i.toUpperCase();
                    self._createButton(s,buttons[i]);
                }
        },
        _createButton: function _createButton(source, opt){
            var self = this, el = opt.el;
            delete opt.el;
            yellowjs.createElement('button',{
                el : el,
                onrelease: function onrelease(){
                    self._getPhoto(source, opt);
                }
            });
        },
        _getPhoto: function _getPhoto(source, opt){
            var self = this;
            var defaultConf = {
                quality:50,
                destinationType:"DATA_URL",
                pictureSource: source
            };

            var conf = yellowjs.override(defaultConf, opt);
            conf.destinationType = this._destinationType[conf.destinationType];
            conf.sourceType = this._pictureSource[conf.pictureSource];

            var success = function(filePath){
                var prefix='';
  
                if(0 === conf.destinationType) {
                    prefix = 'data:image/jpeg;base64,';
                }

                self._file = prefix+filePath;

                self.getDomObject().setAttribute("src",prefix+filePath);
                conf.success();
            },
                error = opt.error || oo.emptyFn;

                if(opt.success) 
                    delete opt.success;
                if(opt.error) 
                    delete opt.error;

            navigator.camera.getPicture(success, error, conf);
        },
       upload:function upload(callback){
          callback = callback || yellowjs.emptyFn;

          var data = {"fileURI":this._file};
          
          this._model.set(data);
          this._model.commit(callback);
        }
    });

    oo.view.Element.register(FileInput, 'fileInput');

})();