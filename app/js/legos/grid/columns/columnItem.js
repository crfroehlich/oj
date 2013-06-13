/* global OJ:true, window:true, Ext:true */

(function _columnItemIIFE(){

    /**
     * Private column item class constructor
     * @param icon {String} Relative path to icon file
     * @param tooltip {String} Tooltip to display on hover
     * @param onGetClass {Function} [onGetClass] Method to call when getClass is called
     * @param onHandler {Function} Method to fire in response to action column click
    */
    var ColumnItem = function (icon, tooltip, onGetClass, onHandler) {
        var that = this;
        Object.defineProperties(that, {
           icon: {
               value: icon,
               writable: true,
               configurable: true,
               enumerable: true
           },
           tooltip: {
               value: tooltip,
               writable: true,
               configurable: true,
               enumerable: true
           },
           getClass: {
               value: function(value, metadata, record) {
                    var store, index, ret = 'x-grid-center-icon';
                    store = record.store;
                    index = store.indexOf(record);
                    if(onGetClass && onGetClass(index, store)) {
                        ret = 'x-action-icon-disabled';
                    }
                    return ret;
               },
               writable: true,
               configurable: true,
               enumerable: true
           },
            handler: {
               value: function(grid, rowIndex, colIndex) {
                    if(onHandler) {
                        var slice = Array.prototype.slice;
                        var args = slice.call(arguments, 0);
                        onHandler.apply(this, args);
                    }
               },
               writable: true,
               configurable: true,
               enumerable: true
           }
        });

        return that;
    };

    OJ.instanceOf.lift('ColumnItem', ColumnItem);

    /**
     * Create a column item, usually for inclusion in an ActionColumn
     * @param icon {String} Relative path to icon file
     * @param tooltip {String} Tooltip to display on hover
     * @param onGetClass {Function} [onGetClass] Method to call when getClass is called
     * @param onHandler {Function} Method to fire in response to action column click
    */
    OJ.grids.columns.lift('columnItem', function (icon, tooltip, onGetClass, onHandler){
        if(arguments.length === 0 || !onHandler) {
            throw new Error('Cannot create a column item without parameters');
        }
        icon = icon || '';
        tooltip = tooltip || '';
        onGetClass = onGetClass|| function() {};
        var ret = new ColumnItem(icon, tooltip, onGetClass, onHandler)
        return ret;
    });


    }());