/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

(function _NodeTests(n$) {



    //#region n$.to.number

    module(n$.name + "node");

    test(n$.name + ".node.make(" + n$.name + "'TestingDiv')", function() {
        expect(3);
        var node = n$.node.make(n$.name + 'TestingDiv');
        deepEqual(node.tagName === 'DIV', true, n$.name + " Node is a DIV");
        deepEqual(node instanceof n$.metadata.Node, true, n$.name + " Node is an instance of an " + n$.name + " Node");
        deepEqual(node.id === n$.name + 'TestingDiv', true, n$.name + " node has an element ID.");
    });

    test(n$.name + " test child node", function() {
        expect(3);
        var node = n$.node.make(n$.name + 'TestingDiv');
        var childDiv = node.div({
            value: 'test'
        });
        deepEqual(document.getElementById(n$.name + 'TestingDiv').childNodes[0].getAttribute('value') === 'test', true, n$.name + " chaning single node works from document. ");
        deepEqual(childDiv[0].getAttribute('value') === 'test', true, n$.name + " chaning single node works from n$.");
        deepEqual(childDiv.value === 'test', true, n$.name + " chaning single node works from n$.");
    });

}(window.$nameSpace$));