(function (oo) {

    // shorthand
    var Dom = oo.view.Dom,
        Touch = oo.core.Touch,
        ns = oo.getNS('oo.view');
    
    var Accordion = ns.Accordion = oo.Class(oo.view.Element, {
        STATIC: {
            CLS_OPENED: 'accordion-section-opened',
            CLS_CLOSED: 'accordion-section-closed',
            SELET_HEADER:'[data-accordionheader]',
            SELET_SECTION:'[data-accordioncontent]'
        },
        _isOpened : true,
        constructor: function constructor(conf) {
            Accordion.Super.call(this, conf);
            this._prepareView();
        },
        _prepareView : function _prepareView(){
            var that = this,
            _headerHandler = function _headerHandler(el, sec){
                if(sec.classList.hasClass(Accordion.CLS_OPENED)){
                    that.closeSection(sec);
                } else {
                    that.openSection(sec);
                }
            };
            this.children().forEach(function(item){
                var sec = new oo.view.Dom(item);
                //close each sec
                that.closeSection(sec);
                var btnHeader = oo.createElement('button', {el:sec.find('[data-accordionheader]',true)});
                btnHeader.addListener(oo.view.Button.EVT_RELEASE, function(el){
                    _headerHandler(el, sec);
                });
                
            });
        },
        closeSection : function closeSection(section){
            section.classList.removeClass(Accordion.CLS_OPENED);
            section.classList.addClass(Accordion.CLS_CLOSED);
        },
        openSection : function openSection(section){
            section.classList.removeClass(Accordion.CLS_CLOSED);
            section.classList.addClass(Accordion.CLS_OPENED);
        }
    });
    
    oo.view.Element.register(Accordion, 'accordion');
    
})(oo || {});