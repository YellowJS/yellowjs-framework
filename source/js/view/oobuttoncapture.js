/**
 * Class let's you open the camera
 *
 * @namespace oo
 * @class ButtonCapture
 *
 */
(function (oo) {
 
     
    var ButtonCapture = oo.getNS('oo.view').ButtonCapture = oo.Class(oo.view.Button, {
        _pictureSource: null,
        _destinationType: null,
        _file : null,
        _conf:null,
        constructor : function constructor(opt) {
            if(!opt || !opt.hasOwnProperty("source")){
                throw new Error('Wrong parameters');
            }

            ButtonCapture.Super.call(this, opt);

            delete opt.el;
            delete opt.onrelease;

            var defaultConf = {
                quality:50,
                destinationType:"DATA_URL",
                pictureSource: opt.source
            };

            this._pictureSource = navigator.camera.PictureSourceType;
            this._destinationType = navigator.camera.DestinationType;

            this._conf = yellowjs.override(defaultConf, opt);
            this._conf.destinationType = this._destinationType[this._conf.destinationType];
            this._conf.sourceType = this._pictureSource[this._conf.pictureSource];

        },
        _onRelease : function _onRelease(e) {
          var self = this;
            if (this.isActive()) {
                this.setActive(false);
                navigator.camera.getPicture(function(response, e){
                  self._success(response,e);
                },function(response,e){
                  self._error(response,e);
                },this._conf);
            }
        },
        _success: function _success(filePath,e){
            var prefix='';
  
            if(0 === this._conf.destinationType) {
                prefix = 'data:image/jpeg;base64,';
            }

            this._file = prefix+filePath;
            this._afterRelease(this._file,e);
        },
        _error: function error(code,e){
            this._afterRelease(code,e);
        },
        _afterRelease: function _afterRelease(response,e){
            this.onRelease(response);
            this.triggerEvent(ButtonCapture.EVT_RELEASE, [this, e]);
        }
    });
     
    oo.view.Element.register(ButtonCapture, 'buttoncapture');
     
})(yellowjs || {});