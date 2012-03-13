describe("ooevents.js", function() {

    var Cls = oo.Class({}, oo.core.mixins.Events, {});
    var obj = new Cls();

    var modifiedByListener = null;

    var listener = function () {
        var that = this;
        modifiedByListener = {message: 'Hello World', scope: that};
    };

    describe('add a listener', function () {
        obj.addListener('toto', listener);

        it('should be an object', function () {
            expect(obj._listeners instanceof Object).toBeTruthy();
        });

        it('should have a property named \'toto\'', function () {
            expect(('toto' in obj._listeners)).toBeTruthy();
        });

        it('should be an array', function () {
            expect(obj._listeners.toto instanceof Array).toBeTruthy();
        });

        it('should return the \'listener\' function', function () {
            expect(obj._listeners.toto[0].fn).toBe(listener);
        });
    });

    describe('trigger event', function () {
        obj.triggerEvent('toto');

        it('should not be null', function () {
            expect(null !== modifiedByListener).toBeTruthy();
        });
    });

    describe('remove event listener', function () {
        obj.removeListener('toto', listener);

        it('should not have any more listener', function() {
            expect(obj._listeners.toto.length).toEqual(0);
        });
    });

});