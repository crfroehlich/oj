/*global OJ:true, QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

// It's desirable that these tests not be optimized for pure functional programming,
// because they need to quickly communicate their intention to the reader.
// Unless testing abstraction and encapsulation, it is better to be dundant and verbose,
// as this will make troubleshooting failures easier for anyone who might come behind

// String truthy checks
(function _toString() {

	//#region OJ.is.string

	module("Oj.to.string");
	test( "OJ.to.string(null)", function() {
        deepEqual( OJ.to.string(null) === '', true, "OJ.to.string converts null to string empty.");
	});

    test( "OJ.to.string(null, 'a')", function() {
        deepEqual( OJ.to.string(null, 'a') === 'a', true, "OJ.to.string converts null to 'a'.");
	});

	test( "OJ.to.string(undefined)", function() {
        deepEqual( OJ.to.string(undefined) === '', true, "OJ.to.string converts undefined to string empty.");
	});

	test( "OJ.to.string(undefined, 'a')", function() {
        deepEqual( OJ.to.string(undefined, 'a') === 'a', true, "OJ.to.string converts undefined to 'a'.");
	});

	test( "OJ.to.string(NaN)", function() {
        deepEqual( OJ.to.string(NaN) === '', true, "OJ.to.string converts NaN to ''.");
	});

	test( "OJ.to.string(Infinity)", function() {
        deepEqual( OJ.to.string(Infinity) === '', true, "OJ.to.string converts Infinity to ''.");
	});

	test( "OJ.to.string({})", function() {
        deepEqual( OJ.to.string({}) === '', true, "OJ.to.string converts {} to string empty.");
	});

	test( "OJ.to.string({a: 'a', 1: '1', x: false, y: []})", function() {
        deepEqual( OJ.to.string({a: 'a', 1: '1', x: false, y: []}) === '', true, "OJ.to.string converts {a: 'a', 1: '1', x: false, y: []} to string empty.");
	});

	test( "OJ.to.string({}, 'a')", function() {
        deepEqual( OJ.to.string({}, 'a') === 'a', true, "OJ.to.string converts {} to 'a'.");
	});

	test( "OJ.to.string([])", function() {
        deepEqual( OJ.to.string([]) === '', true, "OJ.to.string converts [] to string empty.");
	});

	test( "OJ.to.string([1, '1', false, {}, []])", function() {
        deepEqual( OJ.to.string([1, '1', false, {}, []]) === '', true, "OJ.to.string converts [1, '1', false, {}, []] to string empty.");
	});

	test( "OJ.to.string([], 'a')", function() {
        deepEqual( OJ.to.string([], 'a') === 'a', true, "OJ.to.string converts [] to 'a'.");
	});

	test( "OJ.to.string(1, 'a')", function() {
        deepEqual( OJ.to.string(1, 'a') === '1', true, "OJ.to.string converts 1 to '1'.");
	});

	test( "OJ.to.string(0, 'a')", function() {
        deepEqual( OJ.to.string(0, 'a') === '0', true, "OJ.to.string converts 0 to '0'.");
	});

	test( "OJ.to.string(true, 'a')", function() {
        deepEqual( OJ.to.string(true, 'a') === 'true', true, "OJ.to.string converts true to 'true'.");
	});

	test( "OJ.to.string(false, 'a')", function() {
        deepEqual( OJ.to.string(false, 'a') === 'false', true, "OJ.to.string converts false to 'false'.");
	});


	//#endregion OJ.is.string

}());

// Boolean truthy checks
(function _isBool() {

	//#region OJ.is.bool

	module("OJ.is.bool");


	//#endregion OJ.is.bool

}());

// Number truthy checks
(function _isNumber() {

	//#region OJ.is.number

	module("OJ.is.number");



	//#endregion OJ.is.number

}());

