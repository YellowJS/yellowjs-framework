describe("oopopin.js", function() {
    var popin = oo.createElement('popin', { el:"#popin"});

    document.querySelector('#open').addEventListener('click', function(){
        popin.open();
    },false);

    document.querySelector('#close').addEventListener('click', function(){
        popin.close();
    },false);

    var popin2 = oo.createElement('popin', { el:"#popin2"});

    document.querySelector('#open2').addEventListener('click', function(){
        popin2.open();
    },false);

    document.querySelector('#close2').addEventListener('click', function(){
        popin2.close();
    },false);

    describe('constructor', function(){
        it('popin must be an instance of oo.view.Popin', function(){
            expect(popin instanceof oo.view.Popin).toBeTruthy();
        });
    });


    describe('open', function(){
        it('popin must have popin-opened cls and not have popin-closed cls', function(){
            popin.open();
            expect(popin.classList.hasClass('pl-popin-is-showing')).toBeTruthy();
            expect(popin.classList.hasClass('pl-popin-closed')).toBeFalsy();
        });

        it('popin isOpened must be true', function(){
            popin.open();
            expect(popin.isOpened()).toBeTruthy();
        });
    });

    describe('close', function(){
        it('popin must have popin-closed cls and not have popin-opend cls', function(){
            popin.close();
            expect(popin.classList.hasClass('pl-popin-is-hiding')).toBeTruthy();
            expect(popin.classList.hasClass('pl-popin-opened')).toBeFalsy();
        });

        it('popin isOpened must be false', function(){
            popin.close();
            expect(popin.isOpened()).toBeFalsy();
        });
    });
});