/*global OJ:true, QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function() {

	module("Oj.is.string");
	test( "OJ.is.string('a')", function() {
		deepEqual( OJ.is.string('a'), true, "'a' is _a_ string");
	});

	test( "OJ.is.string('A')", function() {
		deepEqual( OJ.is.string('A'), true, "'A' is _a_ string");
	});

	test( "OJ.is.string('[]')", function() {
		deepEqual( OJ.is.string('[]'), true, "'[]' is a string");
	});

	test( "OJ.is.string('{}')", function() {
		deepEqual( OJ.is.string('{}'), true, "'{}' is a string");
	});

	test( "OJ.is.string('NaN')", function() {
		deepEqual( OJ.is.string('NaN'), true, "'NaN' is a string");
	});

	test( "OJ.is.string('0')", function() {
		deepEqual( OJ.is.string('0'), true, "'0' is a string");
	});

	test( "OJ.is.string('null')", function() {
		deepEqual( OJ.is.string('null'), true, "'null' is a string");
	});

	test( "OJ.is.string('undefined')", function() {
		deepEqual( OJ.is.string('undefined'), true, "'undefined' is a string");
	});

	test( "OJ.is.string('')", function() {
		deepEqual( OJ.is.string(''), true, "'' is a string");
	});

	test( "OJ.is.string(' ')", function() {
		deepEqual( OJ.is.string(' '), true, "' ' is a string");
	});

	test( "OJ.is.string([])", function() {
		deepEqual( OJ.is.string([]), false, "[] is not a string");
	});

	test( "OJ.is.string({})", function() {
		deepEqual( OJ.is.string({}), false, "{} is not a string");
	});

	test( "OJ.is.string(NaN)", function() {
		deepEqual( OJ.is.string(NaN), false, "NaN is not a string");
	});

	test( "OJ.is.string(0)", function() {
		deepEqual( OJ.is.string(0), false, "0 is not a string");
	});

	test( "OJ.is.string(null)", function() {
		deepEqual( OJ.is.string(null), false, "null is not a string");
	});

	test( "OJ.is.string(undefined)", function() {
		deepEqual( OJ.is.string(undefined), false, "undefined is not a string");
	});

	test( "OJ.is.string()", function() {
		deepEqual( OJ.is.string(), false, "(Empty argument) is not a string");
	});

	test( "OJ.is.string(new Date())", function() {
		deepEqual( OJ.is.string(new Date()), false, "new Date() is not a string");
	});

	test( "OJ.is.string(String)", function() {
		deepEqual( OJ.is.string(String), false, "String is not a string");
	});

}());