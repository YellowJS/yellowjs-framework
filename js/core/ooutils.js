/** 
 * Class providing utils method
 * mainly static method
 * 
 * @namespace oo
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function (oo) {

    var utils = (function () {
        return {
            log: function log (data) {
                if (window.console && window.console.log) {
                    console.log(data || ['', data].join(''));
                }
            }
        }
    })();

    oo.utils = utils;
    return oo;

})(oo || {});