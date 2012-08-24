(function (oo) {
    
    var global = this;

    var FileTransferProvider = oo.getNS('oo.data').FileTransferProvider = oo.Class(oo.data.AjaxProvider, {
        _ft: null,
        _opt:null,
        constructor: function contructor (options) {
            var self = this;
            var defaultConf = {
                fileKey: "file",
                mimeType:"text/plain"
            };

            this._opt = oo.override(defaultConf, options);

            /*if (!options.url || typeof options.url != 'string')
                throw '\'url\' property must be set';

            this._url = options.url;*/

            FileTransferProvider.Super.call(this, this._opt);
            
            if ('PhoneGap' in window || 'Cordova' in window){
                document.addEventListener('deviceready', function(){
                  self._ft = new FileTransfer();
                });
            }

        },
        save: function save (data, config) {
            var self = this;
            if (!(data instanceof Array))
                data = [data];

            var defaultConf = {
                success: oo.emptyFn,
                error: function(){
                    console.log('something wring!');
                }
            };

            if (typeof config == 'function') {
                config = {success: config};
            }

            var conf = oo.override(defaultConf, config),
                resData;

            data.forEach(function(el){
                if(!el.fileURI) return;
                self._opt.fileName=el.fileURI.substr(el.fileURI.lastIndexOf('/')+1);
                var params = {};
                params.id = el.key;
                self._opt.params = params;

                self._ft.upload(el.fileURI, self._url, function(response){
                    resData = self.toJSON(self.decode(response.response));
                    self.onsuccess(resData, conf.success);
                }, function(response){
                    resData = self.toJSON(self.decode(response.response));
                    self.onerror(resData, conf.error);
                }, self._opt);
            });
            //this._ft.upload(fileURI, this._url, conf.success, conf.error, options);
            /*this._store.batch(data);

            conf.success.call(global, data);*/
        },
        onsuccess: function onsuccess(response, callback){
            callback(response);
        },
        onerror: function onerror(response, callback){
            callback(response);
        },
        decode: function decode(data){
          return decodeURIComponent(data);
        },
        toJSON: function toJSON(data){
          return JSON.parse(data);
        }
    });

    oo.data.Provider.register(FileTransferProvider, 'filetransfer');

})(yellowjs || {});