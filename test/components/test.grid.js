// Generated by CoffeeScript 1.7.1
(function() {
  (function(OJ) {
    module('grid', {
      setup: function() {
        OJ['GENERATE_UNIQUE_IDS'] = true;
        if (!OJ.body.make) {
          return OJ.nodes.div();
        }
      }
    });
    test('Test the grid component', function() {
      var dNode, grid, nodeId;
      expect(4);
      grid = OJ.body.make('grid');
      deepEqual(grid.componentName === 'x-grid', true, 'Component is a grid');
      nodeId = grid.getId();
      dNode = document.getElementById(nodeId);
      ok(dNode, 'Node is in the DOM');
      deepEqual(nodeId, dNode.id, 'Element IDs are equal');
      grid.remove();
      equal(undefined, document.getElementById(nodeId, 'grid has been removed'));
    });
    test('Test the tiles component', function() {
      var cNode, childId, grid, i, nodeId, nuDiv, nuDivId, nuNode, tile;
      expect(31);
      grid = OJ.body.make('grid');
      nodeId = grid.getId();
      i = 0;
      while (i < 10) {
        tile = grid.tile(Faker.random.number(99), Faker.random.number(3));
        childId = tile.getId();
        deepEqual(tile.componentName === "x-tile", true, "Component is a tile");
        cNode = document.getElementById(childId);
        deepEqual(cNode.id, childId, 'Element IDs are equal');
        nuDiv = tile.make('div');
        nuDivId = nuDiv.getId();
        nuNode = document.getElementById(nuDivId);
        deepEqual(nuNode.id, nuDivId, 'Element IDs are equal');
        i += 1;
      }
      grid.remove();
      equal(undefined, document.getElementById(nodeId, 'grid has been removed'));
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

//# sourceMappingURL=test.grid.map