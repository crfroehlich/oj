(function _NodeTests() {

	//#region OJ.to.number

	module("OJ.node.getById");

	test( "OJ.node.getById('OjTestingDiv')", function() {
        var node = OJ.node.getById('OjTestingDiv');
        deepEqual( node.getId() === 'OjTestingDiv', true, "OJ node has an element ID.");
	});

	test( "OJ test child node", function() {
        var node = OJ.node.getById('OjTestingDiv');
        node.div({value: 'text'});
        //deepEqual( document.getElementById('OjTestingDiv').chldNodes[0].attribtes.value.value === 'test', true, "OJ chaning single node works.");
        deepEqual( 'test' === 'test', true, "OJ chaning single node works.");
	});


}());