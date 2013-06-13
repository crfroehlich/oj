/* jshint undef: true, unused: true */
/* global OJ:true, window:true, Ext:true, $: true */

(function () {

    var startDrag = function(id) {
        var me = this,
            win, qbTablePanel, xyParentPos, xyChildPos;

        // get a reference to a qbSqlWindow
        win = Ext.getCmp(id);

        // get the main qbTablePanel
        qbTablePanel = Ext.getCmp('qbTablePanel');

        // get the main qbTablePanel position
        xyParentPos = qbTablePanel.el.getXY();

        // get the size of the previously added qbSqlWindow
        xyChildPos = win.el.getXY();

        me.prev = me.surface.transformToViewBox(xyChildPos[0] - xyParentPos[0] + 2, xyChildPos[1] - xyParentPos[1] + 2);
    };

    var onDrag = function(relPosMovement) {
        var me = this,
            newX, newY;
        // move the sprite
        // calculate new x and y position
        newX = me.prev[0] + relPosMovement[0];
        newY = me.prev[1] + relPosMovement[1];
        // set new x and y position and redraw sprite
        me.setAttributes({
            x: newX,
            y: newY
        }, true);
    };

    var spriteDef = OJ.classDefinition({
        name: 'Ext.OJ.SqlTableJoinSprite',
        extend: 'Ext.draw.Sprite',
        alias: ['widget.SqlTableJoinSprite'],
        onDefine: function(classDef) {
            OJ.property(classDef, 'bConnections', false);
            OJ.property(classDef, 'startDrag', startDrag);
            OJ.property(classDef, 'onDrag', onDrag);
        }
    });

    var sprite = spriteDef.init();

    OJ.actions.querybuilder.lift('SqlTableJoinSprite', sprite);

}());
