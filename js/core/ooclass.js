/** 
 * Contains class for event management
 * 
 * @namespace oo
 * @class Class
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
(function (oo) {
	
    Class = function(parentClass) {
        var fn, fnConstructor = fn = function () { 
            parentClass.apply(this, arguments);
        };
        fn.prototype = new parentClass;

        fn.prototype.constructor = fnConstructor;
        
        fn.superClass = parentClass.prototype;
        // fn.prototype.superClass = function () { return parentClass.prototype; };
        
        return fn;
    }

    var extend = function(base, extension) {
        var prop;
        for (prop in extension)
            if (!(prop in base))
                base[prop] = extension[prop];
            else
                oo.warn([prop, ' already exists in ', base].join(''));
    };


})(oo || {});