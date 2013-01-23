(function() {

    window.OrangeJuice = window.OJ = (function() {
        'use strict';
        var OjPrivate = {
            methods: ['lift']
        };

        var prototype = Object.create(null);

        function makeNameSpace(proto) {
            'use strict';
            
            proto = proto || Object.create(null);

            var ret = Object.create(proto);
            
            proto['lift'] = function(name, obj) {
                'use strict';
                var succeeded = false;
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