(function _NodeTests() {

	//#region OJ.to.number

	module("OJ.node.getById");

	test( "OJ.node.getById('OjTestingDiv')", function() {
        var node = OJ.node.getById('OjTestingDiv');
        deepEqual( node.getId() === 'OjTestingDiv', true, "OJ node has an element ID.");
	});

}());