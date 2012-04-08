describe("ooevents.js", function() {

    var Cls = oo.Class({}, oo.core.mixins.Events, {});
    var obj = new Cls();

    var modifiedByListener = null;

    var listener = function () {
        var that = this;
        modifiedByListener = {message: 'Hello World', scope: that};
    };

    obj.addListener('toto', listener);

    describe('add a listener', function () {

        it('should be an object', function () {
            expect(obj._eventListeners instanceof Object).toBeTruthy();
        });

        it('should have a property named \'toto\'', function () {
            expect(('toto' in obj._eventListeners)).toBeTruthy();
        });

        it('should be an array', function () {
            expect(obj._eventListeners.toto instanceof Array).toBeTruthy();
        });

        it('should return the \'listener\' function', function () {
            console.log(obj._eventListeners.toto);
            expect(obj._eventListeners.toto[0]).toBe(listener);
        });
    });

    describe('trigger event', function () {
        beforeEach( function () {
            obj.triggerEvent('toto');
        });

        it('should not be null', function () {
            expect(null !== modifiedByListener).toBeTruthy();
        });
    });

    describe('remove event listener', function () {
        beforeEach( function () {
            obj.removeListener('toto', listener);
        });

        it('should not have any more listener', function() {
            expect(obj._eventListeners.toto.length).toEqual(0);
        });
    });

});