/** 
 * Class let's you manage data with an single API for all storage managed
 * 
 * @namespace oo
 * @class Store
 *
 * @author Mathias Desloges <m.desloges@gmail.com> || @freakdev
 */
var oo = (function (oo) {

    // shorthand
    var Dom = oo.View.Dom, Touch = oo.Touch, Events = oo.Events;
    
    var Store = my.Class({
        STATIC : {
            EVT_REFRESH : 'refresh'
        },
        constructor : function constructor(data) {
            this._data = data;
            this._snapshot = null;

            this._orderByCol = null;
            this._grouped = null;        
            this._filterFn = null;
        },
        setData : function setData(data) {
            this._data = data;

            this._takeSnapshot();
        },
        setFilter : function setFilter(fn){
            this._filterFn = fn;

            this._takeSnapshot();
        },
        setNoFilter : function setNoFilter(){
            this._filterFn = function () { return true; };

            this._takeSnapshot();
        },
        setOrderCol : function setOrderCol(col, grouped){
            this._orderByCol = col;
            this._grouped = grouped;

            this._takeSnapshot();
        },
        _filter : function _filter(fn){
            if (fn) {
                this._filterFn = fn;
            }
            if (typeof this._filterFn == 'function') {
                this._snapshot = this._data.filter(this._filterFn);
                return true;
            }
            return false;
        },
        _order : function _order() {
            
            if (this._orderByCol) {
                var dest = [];
                var that = this;
                this._snapshot.forEach(function (element, index, array) {
                    var low = 0, high = dest.length;
                    while (low < high) {
                        var mid = (low + high) >> 1;
                        dest[mid][that._orderByCol] < element[that._orderByCol] ? low = mid + 1 : high = mid;
                    }
                    dest.splice(low, 0, element);
                });

                this._snapshot = dest;
                return true;
            }
            return false;

        },
        _takeSnapshot : function _takeSnapshot(){
            var filtered = this._filter();
            var ordered = this._order();

            if (filtered || ordered) {
                Events.triggerEvent(Store.EVT_REFRESH, this);
            } else {
                this._snapshot = this._data;
            }
        },
        getData : function getData(noCache) {
            
            var data = [];
            if (null === this._snapshot || noCache) {
                this._takeSnapshot();
            }

            data = this._snapshot;
            if (this._grouped && this._orderByCol) {
                data = [];

                var prevLetter = '', curLetter = '';            
                for (var i=0, len=this._snapshot.length; i<len; i++) {
                    var el = this._snapshot[i];
                    curLetter = el.nom.substring(0,1);
                    if (prevLetter != curLetter) {
                        data.push({id: 'separator', cropped: curLetter});
                        prevLetter = curLetter;
                    }
                    data.push(el);
                }
            }

            //return this._snapshot;
            return data;
        },
        write : function write(data, where) {
            var that = this;
            var recordsIndex = [];
            this._data.forEach(function (el, index) {
                for (prop in where) {
                    if (el[prop] !== where[prop]) {
                        return false;
                    }
                }
                recordsIndex.push(index);
                return true;
            });

            recordsIndex.forEach(function (i) {
                for (prop in data) {
                    that._data[i][prop] = data[prop];
                }            
            });

            this._takeSnapshot();
        }
    });    
    
    
    var exports = oo.core.utils.getNS('oo.Model');
    exports.Store = Store;
    
    return oo;
    
})(oo || {});