/*global OJ:true, QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function() {

	window.test( "OJ.to.string", function() {
		deepEqual( OJ.to.string(' a '), 'a', "' a ' is not equal to 'a'");
	});


}());