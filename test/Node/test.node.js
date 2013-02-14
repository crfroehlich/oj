(function _NodeTests() {

	//#region OJ.to.number

	module("OJ.node");

	test( "OJ.node.getById('OjTestingDiv')", function() {
        expect(3);
        var node = OJ.node.getById('OjTestingDiv');
        deepEqual( node.tagName === 'DIV', true, "OJ Node is a DIV");
        deepEqual( node.nodeInstance === 'Node', true, "OJ Node is an instance of an OJ Node");
        deepEqual( node.getId() === 'OjTestingDiv', true, "OJ node has an element ID.");
	});

	test( "OJ test child node", function() {
        expect(3);
        var node = OJ.node.getById('OjTestingDiv');
        var childDiv = node.div({value: 'test'});
        deepEqual( document.getElementById('OjTestingDiv').childNodes[0].getAttribute('value') === 'test', true, "OJ chaning single node works from document. ");
        deepEqual( childDiv[0].getAttribute('value') === 'test', true, "OJ chaning single node works from OJ.");
        deepEqual( childDiv.value() === 'test', true, "OJ chaning single node works from OJ.");
	});


}());