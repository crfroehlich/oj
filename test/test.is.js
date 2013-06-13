/*global nameSpace:true, QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

// It's desirable that these tests not be optimized for pure functional programming,
// because they need to quickly communicate their intention to the reader.
// Unless testing abstraction and encapsulation, it is better to be dundant and verbose,
// as this will make troubleshooting failures easier for anyone who might come behind

// Test the truthiness of the null Type
(function _nullChecks(nameSpace) {
	module("null");
	test( "null is not of any nameSpace supported type", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( nameSpace.is.string(null), false, "null is not a String");
		deepEqual( nameSpace.is.bool(null), false, "null is not a Boolean");
		deepEqual( nameSpace.is.number(null), false, "null is not a Number");
		deepEqual( nameSpace.is.numeric(null), false, "null is not numeric");
		deepEqual( nameSpace.is.date(null), false, "null is not a Date");
		deepEqual( nameSpace.is.func(null), false, "null is not a Function");
		deepEqual( nameSpace.is.array(null), false, "null is not an Array");
		deepEqual( nameSpace.is.plainObject(null), false, "null is not an Object");
	});
//}());
//
//// Test the truthiness of the undefined value of the undefined type, when undefined is explicitly undefined (Only required in < ES5 envs.)
//(function _undefinedChecks(undefined) {
	module("undefined");
	test( "undefined is not of any nameSpace supported type", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( nameSpace.is.string(undefined), false, "undefined is not a String");
		deepEqual( nameSpace.is.bool(undefined), false, "undefined is not a Boolean");
		deepEqual( nameSpace.is.number(undefined), false, "undefined is not a Number");
		deepEqual( nameSpace.is.numeric(undefined), false, "undefined is not numeric");
		deepEqual( nameSpace.is.date(undefined), false, "undefined is not a Date");
		deepEqual( nameSpace.is.func(undefined), false, "undefined is not a Function");
		deepEqual( nameSpace.is.array(undefined), false, "undefined is not an Array");
		deepEqual( nameSpace.is.plainObject(undefined), false, "undefined is not an Object");
	});
//}());
//
//// Test the truthiness of implicitly pass undefined, by passing no arguments
//(function _emptyArgumentsChecks() {
	module("empty arguments");
	test( "Empty arguments are not of any nameSpace supported type", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( nameSpace.is.string(), false, "(An empty argument) is not a String");
		deepEqual( nameSpace.is.bool(), false, "(An empty argument) is not a Boolean");
		deepEqual( nameSpace.is.number(), false, "(An empty argument) is not a Number");
		deepEqual( nameSpace.is.numeric(), false, "(An empty argument) is not numeric");
		deepEqual( nameSpace.is.date(), false, "(An empty argument) is not a Date");
		deepEqual( nameSpace.is.func(), false, "(An empty argument) is not a Function");
		deepEqual( nameSpace.is.array(), false, "(An empty argument) is not an Array");
		deepEqual( nameSpace.is.plainObject(), false, "(An empty argument) is not an Object");
	});
//}());
//
//// Test the truthiness of NaN
//(function _NaNChecks() {
	module("NaN");
	test( "NaN not of any nameSpace supported type, except Number", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( nameSpace.is.string(NaN), false, "NaN is not a String");
		deepEqual( nameSpace.is.bool(NaN), false, "NaN is not a Boolean");
		deepEqual( nameSpace.is.number(NaN), false, "NaN is not a Number");
		deepEqual( nameSpace.is.numeric(NaN), false, "NaN is not numeric");
		deepEqual( nameSpace.is.date(NaN), false, "NaN is not a Date");
		deepEqual( nameSpace.is.func(NaN), false, "NaN is not a Function");
		deepEqual( nameSpace.is.array(NaN), false, "NaN is not an Array");
		deepEqual( nameSpace.is.plainObject(NaN), false, "NaN is not an Object");
	});
//}());
//
//// Test the truthiness of -Infinity
//(function _InfinityChecks() {
	module("-Infinity");
	test( "-Infinity not of any nameSpace supported type, except Number", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( nameSpace.is.string(-Infinity), false, "-Infinity is not a String");
		deepEqual( nameSpace.is.bool(-Infinity), false, "-Infinity is not a Boolean");
		deepEqual( nameSpace.is.number(-Infinity), false, "-Infinity is not a Number");
		deepEqual( nameSpace.is.numeric(-Infinity), false, "-Infinity is not numeric");
		deepEqual( nameSpace.is.date(-Infinity), false, "-Infinity is not a Date");
		deepEqual( nameSpace.is.func(-Infinity), false, "-Infinity is not a Function");
		deepEqual( nameSpace.is.array(-Infinity), false, "-Infinity is not an Array");
		deepEqual( nameSpace.is.plainObject(-Infinity), false, "-Infinity is not an Object");
	});
//}());
//
//// Test the truthiness of ''
//(function _emptyStringChecks() {
	module("empty string");
	test( "'' is not of any nameSpace supported type, except String", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( nameSpace.is.string(''), true, "'' is (actually) a String!");
		deepEqual( nameSpace.is.bool(''), false, "'' is not a Boolean");
		deepEqual( nameSpace.is.number(''), false, "'' is not a Number");
		deepEqual( nameSpace.is.numeric(''), true, "'' is binary 0 and is numeric");
		deepEqual( nameSpace.is.date(''), false, "'' is not a Date");
		deepEqual( nameSpace.is.func(''), false, "'' is not a Function");
		deepEqual( nameSpace.is.array(''), false, "'' is not an Array");
		deepEqual( nameSpace.is.plainObject(''), false, "'' is not an Object");
	});
//}());
//
//// Test the truthiness of String 'false'
//(function _stringFalseChecks() {
	module("string 'false'");
	test( "'false' is a String and only a String", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( nameSpace.is.string('false'), true, "'false' is (actually) a String!");
		deepEqual( nameSpace.is.bool('false'), false, "'false' is not a Boolean");
		deepEqual( nameSpace.is.number('false'), false, "'false' is not a Number");
		deepEqual( nameSpace.is.numeric('false'), true, "'false' is binary 0 is numeric");
		deepEqual( nameSpace.is.date('false'), false, "'false' is not a Date");
		deepEqual( nameSpace.is.func('false'), false, "'false' is not a Function");
		deepEqual( nameSpace.is.array('false'), false, "'false' is not an Array");
		deepEqual( nameSpace.is.plainObject('false'), false, "'false' is not an Object");
	});
//}());
//
//// Test the truthiness of String 'true'
//(function _stringTrueChecks() {
	module("string 'true'");
	test( "'true' is a String and only a String", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( nameSpace.is.string('true'), true, "'true' is (actually) a String!");
		deepEqual( nameSpace.is.bool('true'), false, "'true' is not a Boolean");
		deepEqual( nameSpace.is.number('true'), false, "'true' is not a Number");
		deepEqual( nameSpace.is.numeric('true'), true, "'true' is binary 1 and is numeric");
		deepEqual( nameSpace.is.date('true'), false, "'true' is not a Date");
		deepEqual( nameSpace.is.func('true'), false, "'true' is not a Function");
		deepEqual( nameSpace.is.array('true'), false, "'true' is not an Array");
		deepEqual( nameSpace.is.plainObject('true'), false, "'true' is not an Object");
	});
//}());
//
//// Test the truthiness of Boolean false
//(function _falseChecks() {
	module("boolean false");
	test( "false is a Boolean and only a Boolean", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( nameSpace.is.string(false), false, "false is not a String");
		deepEqual( nameSpace.is.bool(false), true, "false is (actuall) a Boolean!");
		deepEqual( nameSpace.is.number(false), false, "false is not a Number");
		deepEqual( nameSpace.is.numeric(false), true, "false converts to 0 is numeric");
		deepEqual( nameSpace.is.date(false), false, "false is not a Date");
		deepEqual( nameSpace.is.func(false), false, "false is not a Function");
		deepEqual( nameSpace.is.array(false), false, "false is not an Array");
		deepEqual( nameSpace.is.plainObject(false), false, "false is not an Object");
	});
//}());
//
//// Test the truthiness of Boolean true
//(function _trueChecks() {
	module("boolean true");
	test( "true is a Boolean and only a Boolean", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( nameSpace.is.string(true), false, "true is not a String");
		deepEqual( nameSpace.is.bool(true), true, "true is (actuall) a Boolean!");
		deepEqual( nameSpace.is.number(true), false, "true is not a Number");
		deepEqual( nameSpace.is.numeric(true), true, "true converts to 1 is numeric");
		deepEqual( nameSpace.is.date(true), false, "true is not a Date");
		deepEqual( nameSpace.is.func(true), false, "true is not a Function");
		deepEqual( nameSpace.is.array(true), false, "true is not an Array");
		deepEqual( nameSpace.is.plainObject(true), false, "true is not an Object");
	});
//}());
//
//// Test the truthiness of empty Array []
//(function _arrayChecks() {
	module("Array []");
	test( "[] is an Array", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( nameSpace.is.string([]), false, "[] is not a String");
		deepEqual( nameSpace.is.bool([]), false, "[] is not a Boolean");
		deepEqual( nameSpace.is.number([]), false, "[] is not a Number");
		deepEqual( nameSpace.is.numeric([]), false, "[] is not numeric");
		deepEqual( nameSpace.is.date([]), false, "[] is not a Date");
		deepEqual( nameSpace.is.func([]), false, "[] is not a Function");
		deepEqual( nameSpace.is.array([]), true, "[] is (actually) an Array!");
		deepEqual( nameSpace.is.plainObject([]), false, "[] is not an Object");
	});
//}());
//
//// Test the truthiness of empty Object  {}
//(function _objectChecks() {
	module("Object {}");
	test( "{} is an Object", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( nameSpace.is.string({}), false, "{} is not a String");
		deepEqual( nameSpace.is.bool({}), false, "{} is not a Boolean");
		deepEqual( nameSpace.is.number({}), false, "{} is not a Number");
		deepEqual( nameSpace.is.numeric({}), false, "{} is not numeric");
		deepEqual( nameSpace.is.date({}), false, "{} is not a Date");
		deepEqual( nameSpace.is.func({}), false, "{} is not a Function");
		deepEqual( nameSpace.is.array({}), false, "{} is not an Array");
		deepEqual( nameSpace.is.plainObject({}), true, "{} is (actually) an Object!");
	});
//}());
//
//// Test the truthiness of 'empty' Function function() {}
//(function _functionChecks() {
	module("Function() {}");
	test( "function() {} is a Function", function() {
		expect(8); //all 8 assertions must pass
		deepEqual( nameSpace.is.string(function() {}), false, "function() {} is not a String");
		deepEqual( nameSpace.is.bool(function() {}), false, "function() {} is not a Boolean");
		deepEqual( nameSpace.is.number(function() {}), false, "function() {} is not a Number");
		deepEqual( nameSpace.is.numeric(function() {}), false, "function() {} is not numeric");
		deepEqual( nameSpace.is.date(function() {}), false, "function() {} is not a Date");
		deepEqual( nameSpace.is.func(function() {}), true, "function() {} is (actually) a Function!");
		deepEqual( nameSpace.is.array(function() {}), false, "function() {} is not an Array");
		deepEqual( nameSpace.is.plainObject(function() {}), false, "function() {} is not an Object");
	});
//}());
//
//// String truthy checks
//(function _isString() {

	//#region nameSpace.is.string

	module("nameSpace.is.string");
	test( "nameSpace.is.string('a')", function() {
		deepEqual( nameSpace.is.string('a'), true, "'a' is _a_ string");
	});

	test( "nameSpace.is.string('A')", function() {
		deepEqual( nameSpace.is.string('A'), true, "'A' is _a_ string");
	});

	test( "nameSpace.is.string('[]')", function() {
		deepEqual( nameSpace.is.string('[]'), true, "'[]' is a string");
	});

	test( "nameSpace.is.string('{}')", function() {
		deepEqual( nameSpace.is.string('{}'), true, "'{}' is a string");
	});

	test( "nameSpace.is.string('NaN')", function() {
		deepEqual( nameSpace.is.string('NaN'), true, "'NaN' is a string");
	});

	test( "nameSpace.is.string('0')", function() {
		deepEqual( nameSpace.is.string('0'), true, "'0' is a string");
	});

	test( "nameSpace.is.string('null')", function() {
		deepEqual( nameSpace.is.string('null'), true, "'null' is a string");
	});

	test( "nameSpace.is.string('undefined')", function() {
		deepEqual( nameSpace.is.string('undefined'), true, "'undefined' is a string");
	});

	test( "nameSpace.is.string(' ')", function() {
		deepEqual( nameSpace.is.string(' '), true, "' ' is a string");
	});

	test( "nameSpace.is.string(0)", function() {
		deepEqual( nameSpace.is.string(0), false, "0 is not a string");
	});

	test( "nameSpace.is.string(new Date())", function() {
		deepEqual( nameSpace.is.string(new Date()), false, "new Date() is not a string");
	});

	test( "nameSpace.is.string(String)", function() {
		deepEqual( nameSpace.is.string(String), false, "String is not a string");
	});

	//#endregion nameSpace.is.string

//}());
//
//// Boolean truthy checks
//(function _isBool() {

	//#region nameSpace.is.bool

	module("nameSpace.is.bool");

	test( "nameSpace.is.bool(0)", function() {
		deepEqual( nameSpace.is.bool(0), false, "0 is not a boolean value");
	});

	test( "nameSpace.is.bool('0')", function() {
		deepEqual( nameSpace.is.bool('0'), false, "'0' is not a boolean value");
	});

	test( "nameSpace.is.bool(1)", function() {
		deepEqual( nameSpace.is.bool(1), false, "1 is not a boolean value");
	});

	test( "nameSpace.is.bool('1')", function() {
		deepEqual( nameSpace.is.bool('1'), false, "'1' is not a boolean value");
	});

	//#endregion nameSpace.is.bool

//}());
//
//// Number truthy checks
//(function _isNumber() {

	//#region nameSpace.is.number

	module("nameSpace.is.number");

	test( "nameSpace.is.number(1)", function() {
		deepEqual( nameSpace.is.number(1), true, "1 is a number");
	});

	test( "nameSpace.is.number(-1)", function() {
		deepEqual( nameSpace.is.number(-1), true, "-1 is a number");
	});

	test( "nameSpace.is.number(0)", function() {
		deepEqual( nameSpace.is.number(0), true, "0 is a number");
	});

	test( "nameSpace.is.number(-0)", function() {
		deepEqual( nameSpace.is.number(-0), true, "-0 is a number");
	});

	test( "nameSpace.is.number(Infinity)", function() {
		deepEqual( nameSpace.is.number(Infinity), false, "Infinity is not a number");
	});

	test( "nameSpace.is.number(-Infinity)", function() {
		deepEqual( nameSpace.is.number(-Infinity), false, "-Infinity is not a number");
	});

	test( "nameSpace.is.number(0.000000000000000000000000001)", function() {
		deepEqual( nameSpace.is.number(0.000000000000000000000000001), true, "0.000000000000000000000000001 is a number");
	});

	test( "nameSpace.is.number(-0.000000000000000000000000001)", function() {
		deepEqual( nameSpace.is.number(-0.000000000000000000000000001), true, "-0.000000000000000000000000001 is a number");
	});

	test( "nameSpace.is.number(1e+20)", function() {
		deepEqual( nameSpace.is.number(1e+20), true, "1e+20 is a number");
	});

	test( "nameSpace.is.number(-1e+20)", function() {
		deepEqual( nameSpace.is.number(1e+20), true, "1e+20 is a number");
	});

	test( "nameSpace.is.number(0xA)", function() {
		deepEqual( nameSpace.is.number(0xA), true, "0xA a number");
	});

	test( "nameSpace.is.number(-0xA)", function() {
		deepEqual( nameSpace.is.number(0xA), true, "0xA a number");
	});

	test( "nameSpace.is.number('-')", function() {
		deepEqual( nameSpace.is.number('-'), false, "'-' is not a number");
	});


	//#endregion nameSpace.is.number

}(window.$nameSpace$));

