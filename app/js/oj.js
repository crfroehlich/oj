(function() {

    /**
        The OJ  NameSpace, an IIFO
        @namespace
        @export
        @return {OJ}
    */
    window.OrangeJuice = window.OJ = (function() {
        ///<summary>Intializes the OJ namespace. Immediately invoked function object.</summary>
        ///<returns type="OJ">The OJ namespace.</returns>

        var prototype = Object.create(null);

        var makeNameSpace = function(proto) {
            proto = proto || Object.create(null);

            var ret = Object.create(proto);

            proto['lift'] = function(name, obj) {
                'use strict';
				if(name && obj) {
					Object.defineProperty(ret, name, {
                        value: obj,
                        writable: false,
                        enumerable: false,
                        configurable: false
                    });
				}
                return obj;
            };

            proto['makeSubNameSpace'] = function(subNameSpace) {
				'use strict';
				return Object.defineProperty(ret, subNameSpace, {
                        value: makeNameSpace(null),
                        writable: false,
                        enumerable: false,
                        configurable: false
                    });
			};
            return ret;
        };

        var OjOut = makeNameSpace(prototype);

        return OjOut;

    }());

}());