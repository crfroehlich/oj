/*global OJ:true*/
(function() {

    OJ.delimitedString = OJ.delimitedString ||
        OJ.lift('delimitedString', function (string, opts) {
            var ojInternal = {
                newLineToDelimiter: true,
                spaceToDelimiter: true,
                removeDuplicates: true,
                delimiter: ',',
                initString: OJ.to.string(string)
            };

            var ojReturn = {
                array: [],
                delimited: function () {
                    return ojReturn.array.join(ojInternal.delimiter);
                },
                string: function (delimiter) {
                    delimiter = delimiter || ojInternal.delimiter;
                    var ret = '';
                    OJ.each(ojReturn.array, function (val) {
                        if (ret.length > 0) {
                            ret += delimiter;
                        }
                        ret += val;
                    });
                    return ret;
                },
                toString: function () {
                    return ojReturn.string();
                },
                add: function (str) {
                    ojReturn.array.push(ojInternal.parse(str));
                    ojInternal.deleteDuplicates();
                    return ojReturn;
                },
                remove: function (str) {
                    var remove = function (array) {
                        return array.filter(function (item) {
                            if (item !== str) {
                                return true;
                            }
                        });
                    };
                    ojReturn.array = remove(ojReturn.array);
                    return ojReturn;
                },
                count: function() {
                    return ojReturn.array.length;
                },
                contains: function (str, caseSensitive) {
                    var isCaseSensitive = OJ.to.bool(caseSensitive);
                    str = OJ.string(str).trim();
                    if (false === isCaseSensitive) {
                        str = str.toLowerCase();
                    }
                    var match = ojReturn.array.filter(function (matStr) {
                        return ((isCaseSensitive && OJ.to.string(matStr).trim() === str) || OJ.to.string(matStr).trim().toLowerCase() === str);
                    });
                    return match.length > 0;
                },
                each: function(callBack) {
                    return ojReturn.array.forEach(callBack);
                }
            };

            ojInternal.parse = function (str) {
                var ret = OJ.to.string(str);

                if (ojInternal.newLineToDelimiter) {
                    while (ret.indexOf('\n') !== -1) {
                        ret = ret.replace(/\n/g, ojInternal.delimiter);
                    }
                }
                if (ojInternal.spaceToDelimiter) {
                    while (ret.indexOf(' ') !== -1) {
                        ret = ret.replace(/ /g, ojInternal.delimiter);
                    }
                }
                while (ret.indexOf(',,') !== -1) {
                    ret = ret.replace(/,,/g, ojInternal.delimiter);
                }
                return ret;
            };

            ojInternal.deleteDuplicates = function () {
                if (ojInternal.removeDuplicates) {
                    (function () {

                        var unique = function (array) {
                            var seen = new Set();
                            return array.filter(function (item) {
                                if (false === seen.has(item)) {
                                    seen.add(item);
                                    return true;
                                }
                            });
                        };

                        ojReturn.array = unique(ojReturn.array);
                    }());
                }
            };

            (function (a) {
                if (a.length > 1 && false === OJ.is.plainObject(opts)) {
                    OJ.each(a, function (val) {
                        if (false === OJ.is.nullOrEmpty(val)) {
                            ojReturn.array.push(val);
                        }
                    });
                } else if(string && string.length > 0) {
                    OJ.extend(ojInternal, opts);
                    var delimitedString = ojInternal.parse(string);
                    ojInternal.initString = delimitedString;
                    ojReturn.array = delimitedString.split(ojInternal.delimiter);
                }

                ojInternal.deleteDuplicates();
            }(arguments));
            return ojReturn;
        });
}());