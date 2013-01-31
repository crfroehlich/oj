/*global OJ:true, QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function _nullChecks() {
	module("null");
	test( "null is not of any OJ supported type", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( OJ.is.string(null), false, "null is not a String");
		deepEqual( OJ.is.bool(null), false, "null is not a Boolean");
		deepEqual( OJ.is.number(null), false, "null is not a Number");
		deepEqual( OJ.is.numeric(null), false, "null is not numeric");
		deepEqual( OJ.is.date(null), false, "null is not a Date");
		deepEqual( OJ.is.func(null), false, "null is not a Function");
		deepEqual( OJ.is.array(null), false, "null is not an Array");
		deepEqual( OJ.is.plainObject(null), false, "null is not an Object");
	});
}());

(function _undefinedChecks() {
	module("undefined");
	test( "undefined is not of any OJ supported type", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( OJ.is.string(undefined), false, "undefined is not a String");
		deepEqual( OJ.is.bool(undefined), false, "undefined is not a Boolean");
		deepEqual( OJ.is.number(undefined), false, "undefined is not a Number");
		deepEqual( OJ.is.numeric(undefined), false, "undefined is not numeric");
		deepEqual( OJ.is.date(undefined), false, "undefined is not a Date");
		deepEqual( OJ.is.func(undefined), false, "undefined is not a Function");
		deepEqual( OJ.is.array(undefined), false, "undefined is not an Array");
		deepEqual( OJ.is.plainObject(undefined), false, "undefined is not an Object");
	});
}());

(function _emptyArgumentsChecks() {
	module("empty arguments");
	test( "Empty arguments are not of any OJ supported type", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( OJ.is.string(), false, "(An empty argument) is not a String");
		deepEqual( OJ.is.bool(), false, "(An empty argument) is not a Boolean");
		deepEqual( OJ.is.number(), false, "(An empty argument) is not a Number");
		deepEqual( OJ.is.numeric(), false, "(An empty argument) is not numeric");
		deepEqual( OJ.is.date(), false, "(An empty argument) is not a Date");
		deepEqual( OJ.is.func(), false, "(An empty argument) is not a Function");
		deepEqual( OJ.is.array(), false, "(An empty argument) is not an Array");
		deepEqual( OJ.is.plainObject(), false, "(An empty argument) is not an Object");
	});
}());

(function _NaNChecks() {
	module("NaN");
	test( "NaN not of any OJ supported type, except Number", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( OJ.is.string(NaN), false, "NaN is not a String");
		deepEqual( OJ.is.bool(NaN), false, "NaN is not a Boolean");
		deepEqual( OJ.is.number(NaN), true, "NaN is (actually) a Number");
		deepEqual( OJ.is.numeric(NaN), false, "NaN is not numeric");
		deepEqual( OJ.is.date(NaN), false, "NaN is not a Date");
		deepEqual( OJ.is.func(NaN), false, "NaN is not a Function");
		deepEqual( OJ.is.array(NaN), false, "NaN is not an Array");
		deepEqual( OJ.is.plainObject(NaN), false, "NaN is not an Object");
	});
}());

(function _emptyStringChecks() {
	module("empty string");
	test( "'' is not of any OJ supported type, except String", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( OJ.is.string(''), true, "'' is (actually) a String");
		deepEqual( OJ.is.bool(''), false, "'' is not a Boolean");
		deepEqual( OJ.is.number(''), false, "'' is (actually) a Number");
		deepEqual( OJ.is.numeric(''), false, "'' is not numeric");
		deepEqual( OJ.is.date(''), false, "'' is not a Date");
		deepEqual( OJ.is.func(''), false, "'' is not a Function");
		deepEqual( OJ.is.array(''), false, "'' is not an Array");
		deepEqual( OJ.is.plainObject(''), false, "'' is not an Object");
	});
}());


(function _isString() {

	//#region OJ.is.string

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

	test( "OJ.is.string(' ')", function() {
		deepEqual( OJ.is.string(' '), true, "' ' is a string");
	});

	test( "OJ.is.string([])", function() {
		deepEqual( OJ.is.string([]), false, "[] is not a string");
	});

	test( "OJ.is.string({})", function() {
		deepEqual( OJ.is.string({}), false, "{} is not a string");
	});

	test( "OJ.is.string(0)", function() {
		deepEqual( OJ.is.string(0), false, "0 is not a string");
	});

	test( "OJ.is.string(new Date())", function() {
		deepEqual( OJ.is.string(new Date()), false, "new Date() is not a string");
	});

	test( "OJ.is.string(String)", function() {
		deepEqual( OJ.is.string(String), false, "String is not a string");
	});

	//#endregion OJ.is.string

}());

(function _isBool() {

	//#region OJ.is.bool

	module("OJ.is.bool");

	test( "OJ.is.bool(true)", function() {
		deepEqual( OJ.is.bool(true), true, "true is a boolean value");
	});

	test( "OJ.is.bool(false)", function() {
		deepEqual( OJ.is.bool(false), true, "false is a boolean value");
	});

	test( "OJ.is.bool(0)", function() {
		deepEqual( OJ.is.bool(0), false, "0 is not a boolean value");
	});

	test( "OJ.is.bool('0')", function() {
		deepEqual( OJ.is.bool('0'), false, "'0' is not a boolean value");
	});

	test( "OJ.is.bool(1)", function() {
		deepEqual( OJ.is.bool(1), false, "1 is not a boolean value");
	});

	test( "OJ.is.bool('1')", function() {
		deepEqual( OJ.is.bool('1'), false, "'1' is not a boolean value");
	});

	test( "OJ.is.bool('true')", function() {
		deepEqual( OJ.is.bool('true'), false, "'true' is not a boolean value");
	});

	test( "OJ.is.bool('false')", function() {
		deepEqual( OJ.is.bool('false'), false, "'false' is not a boolean value");
	});

	//#endregion OJ.is.bool

}());

(function _isNumber() {

	//#region OJ.is.number

	module("OJ.is.number");

	test( "OJ.is.number(1)", function() {
		deepEqual( OJ.is.number(1), true, "1 is a number");
	});

	//#endregion OJ.is.bool

}());
