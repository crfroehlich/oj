(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./oj.coffee');

require('./ojInit.coffee');

require('./async/ajax.coffee');

require('./async/promise.coffee');

require('./components/grid.coffee');

require('./components/inputgroup.coffee');

require('./components/tabs.coffee');

require('./components/tile.coffee');

require('./controls/icon.coffee');

require('./core/date.coffee');

require('./core/function.coffee');

require('./core/number.coffee');

require('./core/object.coffee');

require('./core/property.coffee');

require('./core/string.coffee');

require('./dom/component.coffee');

require('./dom/control.coffee');

require('./dom/dom.coffee');

require('./dom/element.coffee');

require('./dom/fragment.coffee');

require('./dom/generics.coffee');

require('./dom/input.coffee');

require('./dom/nodeFactory.coffee');

require('./elements/a.coffee');

require('./elements/br.coffee');

require('./elements/form.coffee');

require('./elements/input.coffee');

require('./elements/ol.coffee');

require('./elements/select.coffee');

require('./elements/table.coffee');

require('./elements/textarea.coffee');

require('./elements/thead.coffee');

require('./elements/ul.coffee');

require('./inputs/buttoninput.coffee');

require('./inputs/checkbox.coffee');

require('./inputs/color.coffee');

require('./inputs/date.coffee');

require('./inputs/datetime.coffee');

require('./inputs/datetimelocal.coffee');

require('./inputs/email.coffee');

require('./inputs/file.coffee');

require('./inputs/hidden.coffee');

require('./inputs/imageinput.coffee');

require('./inputs/month.coffee');

require('./inputs/number.coffee');

require('./inputs/password.coffee');

require('./inputs/radio.coffee');

require('./inputs/range.coffee');

require('./inputs/reset.coffee');

require('./inputs/search.coffee');

require('./inputs/submit.coffee');

require('./inputs/tel.coffee');

require('./inputs/textinput.coffee');

require('./inputs/time.coffee');

require('./inputs/url.coffee');

require('./inputs/week.coffee');

require('./tools/array2D.coffee');

require('./tools/console.coffee');

require('./tools/cookie.coffee');

require('./tools/defer.coffee');

require('./tools/each.coffee');

require('./tools/enums.coffee');

require('./tools/error.coffee');

require('./tools/history.coffee');

require('./tools/is.coffee');

require('./tools/noty.coffee');

require('./tools/pubsub.coffee');

require('./tools/queryString.coffee');

require('./tools/ranges.coffee');

require('./tools/to.coffee');

require('./tools/uuid.coffee');



},{"./async/ajax.coffee":2,"./async/promise.coffee":3,"./components/grid.coffee":4,"./components/inputgroup.coffee":5,"./components/tabs.coffee":6,"./components/tile.coffee":7,"./controls/icon.coffee":8,"./core/date.coffee":9,"./core/function.coffee":10,"./core/number.coffee":11,"./core/object.coffee":12,"./core/property.coffee":13,"./core/string.coffee":14,"./dom/component.coffee":15,"./dom/control.coffee":16,"./dom/dom.coffee":17,"./dom/element.coffee":18,"./dom/fragment.coffee":19,"./dom/generics.coffee":20,"./dom/input.coffee":21,"./dom/nodeFactory.coffee":22,"./elements/a.coffee":23,"./elements/br.coffee":24,"./elements/form.coffee":25,"./elements/input.coffee":26,"./elements/ol.coffee":27,"./elements/select.coffee":28,"./elements/table.coffee":29,"./elements/textarea.coffee":30,"./elements/thead.coffee":31,"./elements/ul.coffee":32,"./inputs/buttoninput.coffee":33,"./inputs/checkbox.coffee":34,"./inputs/color.coffee":35,"./inputs/date.coffee":36,"./inputs/datetime.coffee":37,"./inputs/datetimelocal.coffee":38,"./inputs/email.coffee":39,"./inputs/file.coffee":40,"./inputs/hidden.coffee":41,"./inputs/imageinput.coffee":42,"./inputs/month.coffee":43,"./inputs/number.coffee":44,"./inputs/password.coffee":45,"./inputs/radio.coffee":46,"./inputs/range.coffee":47,"./inputs/reset.coffee":48,"./inputs/search.coffee":49,"./inputs/submit.coffee":50,"./inputs/tel.coffee":51,"./inputs/textinput.coffee":52,"./inputs/time.coffee":53,"./inputs/url.coffee":54,"./inputs/week.coffee":55,"./oj.coffee":56,"./ojInit.coffee":57,"./tools/array2D.coffee":58,"./tools/console.coffee":59,"./tools/cookie.coffee":60,"./tools/defer.coffee":61,"./tools/each.coffee":62,"./tools/enums.coffee":63,"./tools/error.coffee":64,"./tools/history.coffee":65,"./tools/is.coffee":66,"./tools/noty.coffee":67,"./tools/pubsub.coffee":68,"./tools/queryString.coffee":69,"./tools/ranges.coffee":70,"./tools/to.coffee":71,"./tools/uuid.coffee":72}],2:[function(require,module,exports){
(function (global){
(function(OJ) {
  var ajax, config, optsFromUrl;
  config = {};
  config.onSuccess = function(opts, data, url) {
    var response;
    response = {};
    OJ.extend(response, data);
    opts.onSuccess(response);
    if (OJ.LOG_ALL_AJAX) {
      OJ.console.table([
        {
          Webservice: opts.ajaxOpts.url,
          StartTime: opts.startTime,
          EndTime: new Date()
        }
      ]);
    }
  };
  config.onError = function(xmlHttpRequest, textStatus, param1, opts) {
    if (opts == null) {
      opts = OJ.object();
    }
    if (textStatus !== 'abort') {
      if (OJ.LOG_ALL_AJAX_ERRORS) {
        OJ.console.table([
          {
            Webservice: opts.ajaxOpts.url,
            Data: opts.ajaxOpts.data,
            Failed: textStatus,
            State: xmlHttpRequest.state(),
            Status: xmlHttpRequest.status,
            StatusText: xmlHttpRequest.statusText,
            ReadyState: xmlHttpRequest.readyState,
            ResponseText: xmlHttpRequest.responseText
          }
        ]);
      }
      opts.onError(textStatus);
    }
  };
  optsFromUrl = function(opts) {
    var url;
    if (OJ.is.string(opts)) {
      url = opts;
      opts = OJ.object();
      opts.add('ajaxOpts', OJ.object());
      opts.ajaxOpts.add('url', url);
    }
    return opts;
  };
  config.execRequest = function(verb, opts) {
    var defaults, getJQueryDeferred, promise;
    if (verb == null) {
      verb = 'GET';
    }
    defaults = {
      ajaxOpts: {
        url: '',
        data: {},
        type: verb,
        xhrFields: {
          withCredentials: true
        },
        dataType: 'json',
        contentType: 'application/json; charset=utf-8'
      },
      onSuccess: OJ.noop,
      onError: OJ.noop,
      onComplete: OJ.noop,
      overrideError: false,
      watchGlobal: true,
      useCache: false
    };
    opts = optsFromUrl(opts);
    OJ.extend(defaults, opts, true);
    defaults.startTime = new Date();
    if (false === OJ.is.nullOrEmpty(defaults.ajaxOpts.data)) {
      if (defaults.ajaxOpts.verb === 'GET') {
        defaults.ajaxOpts.data = OJ.params(defaults.ajaxOpts.data);
      } else {
        defaults.ajaxOpts.data = OJ.serialize(defaults.ajaxOpts.data);
      }
    }
    getJQueryDeferred = function(watchGlobal) {
      var ret;
      ret = $.ajax(defaults.ajaxOpts);
      ret.done(function(data, textStatus, jqXHR) {
        return config.onSuccess(defaults, data);
      });
      ret.fail(function(jqXHR, textStatus, errorText) {
        return config.onError(jqXHR, textStatus, errorText, defaults);
      });
      ret.always(function(xmlHttpRequest, textStatus) {
        return defaults.onComplete(xmlHttpRequest, textStatus);
      });
      return OJ.async.ajaxPromise(ret);
    };
    promise = getJQueryDeferred(defaults.watchGlobal);
    return promise;
  };
  ajax = {};
  ajax.post = function(opts) {
    return config.execRequest('POST', opts);
  };
  ajax.get = function(opts) {
    return config.execRequest('GET', opts);
  };
  ajax["delete"] = function(opts) {
    return config.execRequest('DELETE', opts);
  };
  ajax.put = function(opts) {
    return config.execRequest('PUT', opts);
  };
  OJ.async.register('ajax', ajax);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
(function(OJ) {
  OJ.async.register('ajaxPromise', function(ajax) {
    var promise;
    promise = Promise.resolve(ajax);
    promise.abort = ajax.abort;
    promise.readyState = ajax.readyState;
    return promise;
  });
  OJ.async.register('all', function(initArray) {
    var promise, reqs;
    reqs = initArray || [];
    promise = Promise.all(reqs);
    promise.push = function(item) {
      reqs.push(item);
    };
    return promise;
  });
  OJ.async.register('defer', function(func) {
    var ret;
    if (func == null) {
      func = OJ.noop;
    }
    ret = Promise.method(func);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
(function (global){
(function(OJ) {
  var className, nodeName;
  nodeName = 'x-grid';
  className = 'grid';
  OJ.components.members[className] = nodeName;
  OJ.components.register(className, function(options, owner) {
    var defaults, fillMissing, ret, rows, tiles;
    defaults = {
      tileSizes: {
        smallSpan: '',
        mediumSpan: '',
        largeSpan: ''
      },
      props: {
        "class": 'grid'
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.component(defaults, owner, nodeName);
    rows = [];
    tiles = OJ.array2D();
    fillMissing = function() {
      return tiles.each(function(rowNo, colNo, val) {
        var row;
        if (!val) {
          row = ret.row(rowNo);
          return row.make('tile', colNo, {});
        }
      });
    };
    ret.add('row', function(rowNo) {
      var nuRow;
      if (rowNo == null) {
        rowNo = rows.length - 1 || 1;
      }
      nuRow = rows[rowNo - 1];
      if (!nuRow) {
        while (rows.length < rowNo) {
          nuRow = ret.make('div', {
            props: {
              "class": 'row'
            }
          });
          rows.push(nuRow);
        }
        nuRow.add('tile', function(colNo, opts) {
          var nuTile;
          opts = OJ.extend(OJ.extend({}, defaults.tileSizes), opts);
          nuTile = OJ.components.tile(opts, nuRow);
          tiles.set(rowNo, colNo, nuTile);
          return nuTile;
        });
      }
      return nuRow;
    });
    ret.add('tile', function(rowNo, colNo, opts) {
      var i, row, tile, tryTile;
      if (!rowNo || rowNo < 1) {
        rowNo = 1;
      }
      if (!colNo || colNo < 1) {
        colNo = 1;
      }
      row = ret.row(rowNo);
      tile = tiles.get(rowNo, colNo);
      if (!tile) {
        i = 0;
        while (i < colNo) {
          i += 1;
          tryTile = tiles.get(rowNo, i);
          if (!tryTile) {
            if (i === colNo) {
              tile = row.make('tile', opts);
            } else if (!tile) {
              row.make('tile');
            }
          }
        }
      }
      fillMissing();
      return tile;
    });
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
(function (global){
(function(OJ) {
  var className, nodeName;
  nodeName = 'x-input-group';
  className = 'inputgroup';
  OJ.components.members[className] = nodeName;
  OJ.components.register(className, function(options, owner) {
    var cmpnt, defaults, forId, ret;
    forId = OJ.createUUID();
    defaults = {
      props: {
        "class": 'form-group'
      },
      events: {
        change: OJ.noop
      },
      "for": forId,
      labelText: '',
      inputOpts: {
        props: {
          id: forId,
          type: 'text',
          "class": '',
          placeholder: '',
          value: ''
        }
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.component(defaults, owner, nodeName);
    cmpnt = ret.make('div', {
      props: {
        "class": 'form-group'
      }
    });
    ret.groupLabel = cmpnt.make('label', {
      props: {
        "for": forId
      },
      text: defaults.labelText
    });
    defaults.inputOpts.props["class"] += ' form-control';
    ret.groupInput = cmpnt.make('input', defaults.inputOpts);
    ret.groupValue = function() {
      return ret.groupInput.val();
    };
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
(function (global){
(function(OJ) {
  var className, nodeName;
  nodeName = 'x-tabs';
  className = 'tabs';
  OJ.components.members[className] = nodeName;
  OJ.components.register(className, function(options, owner) {
    var content, defaults, first, ret, tabs;
    defaults = {
      tabs: {},
      props: {
        "class": ''
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.component(defaults, owner, nodeName);
    tabs = ret.make('ul', {
      props: {
        "class": 'nav nav-tabs'
      }
    });
    content = ret.make('div', {
      props: {
        "class": 'tab-content'
      }
    });
    first = true;
    OJ.each(defaults.tabs, function(tabVal, tabName) {
      var a, tabClass, tabContentClass;
      tabClass = '';
      if (first) {
        first = false;
        tabClass = 'active';
      }
      a = tabs.make('li', {
        props: {
          "class": tabClass
        }
      }).make('a', {
        text: tabName,
        props: {
          href: '#' + tabName,
          'data-toggle': 'tab'
        },
        events: {
          click: function() {
            return a.$.tab('show');
          }
        }
      });
      tabContentClass = 'tab-pane ' + tabClass;
      ret.add(tabName, content.make('div', {
        props: {
          "class": tabContentClass,
          id: tabName
        }
      }));
    });
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
(function (global){
(function(OJ) {
  var className, nodeName;
  nodeName = 'x-tile';
  className = 'tile';
  OJ.components.members[className] = nodeName;
  OJ.components.register(className, function(options, owner) {
    var defaults, ret;
    defaults = {
      width: {
        xs: '',
        sm: '',
        md: '',
        lg: ''
      },
      props: {
        "class": 'tile'
      }
    };
    OJ.extend(defaults, options, true);
    if (defaults.width.xs) {
      defaults.props["class"] += ' col-xs-' + defaults.width.xs;
    }
    if (defaults.width.sm) {
      defaults.props["class"] += ' col-sm-' + defaults.width.sm;
    }
    if (defaults.width.md) {
      defaults.props["class"] += ' col-md-' + defaults.width.md;
    }
    if (defaults.width.lg) {
      defaults.props["class"] += ' col-lg-' + defaults.width.lg;
    }
    ret = OJ.component(defaults, owner, nodeName);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],8:[function(require,module,exports){
(function (global){
(function(OJ) {
  var controlName, friendlyName;
  controlName = 'y-icon';
  friendlyName = 'icon';
  OJ.controls.members[friendlyName] = controlName;
  return OJ.controls.register(friendlyName, function(options, owner) {
    var className, classNameBase, defaults, isToggled, ret;
    defaults = {
      iconOpts: {
        name: '',
        stackedIcon: '',
        swapIcon: '',
        size: false,
        color: '',
        library: '',
        isFixedWidth: false,
        isList: false,
        isSpinner: false
      },
      props: {
        "class": ''
      },
      rootNodeType: 'span'
    };
    OJ.extend(defaults, options);
    ret = OJ.control(defaults, owner, controlName);
    isToggled = false;
    classNameBase = 'fa ';
    if (defaults.iconOpts.isFixedWidth) {
      classNameBase += 'fa-fw ';
    }
    if (defaults.iconOpts.isList) {
      classNameBase += 'fa-li ';
    }
    if (defaults.iconOpts.isSpinner) {
      classNameBase += 'fa-spin ';
    }
    if (defaults.iconOpts.size) {
      if (defaults.iconOpts.size > 1 && defaults.iconOpts.size <= 5) {
        classNameBase += 'fa-' + defaults.iconOpts.size + 'x ';
      }
    }
    className = classNameBase + 'fa-' + defaults.iconOpts.name;
    ret.myIcon = ret.make('i', {
      props: {
        "class": className
      }
    });
    ret.toggleIcon = function() {
      var newIcon;
      if (defaults.iconOpts.swapIcon) {
        newIcon = defaults.iconOpts.name;
        isToggled = !isToggled;
        if (isToggled) {
          ret.myIcon.$.removeClass('fa-' + newIcon);
          newIcon = defaults.iconOpts.swapIcon;
        } else {
          ret.myIcon.$.removeClass('fa-' + defaults.iconOpts.swapIcon);
        }
        return ret.myIcon.$.addClass('fa-' + newIcon);
      }
    };
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],9:[function(require,module,exports){
(function (global){
(function(OJ) {
  OJ.register("getDateFromDnJson", function(dnDate) {
    var arr, dnDateStr, localOffset, offset, ret, ticks;
    dnDateStr = OJ.to.string(dnDate);
    ret = void 0;
    ticks = void 0;
    offset = void 0;
    localOffset = void 0;
    arr = void 0;
    ret = OJ.dateTimeMinValue;
    if (false === OJ.is.nullOrEmpty(dnDateStr)) {
      dnDateStr = dnDateStr.replace("/", "");
      dnDateStr = dnDateStr.replace("Date", "");
      dnDateStr = dnDateStr.replace("(", "");
      dnDateStr = dnDateStr.replace(")", "");
      arr = dnDateStr.split("-");
      if (arr.length > 1) {
        ticks = OJ.to.number(arr[0]);
        offset = OJ.to.number(arr[1]);
        localOffset = new Date().getTimezoneOffset();
        ret = new Date(ticks - ((localOffset + (offset / 100 * 60)) * 1000));
      } else if (arr.length === 1) {
        ticks = OJ.to.number(arr[0]);
        ret = new Date(ticks);
      }
    }
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
(function (global){
(function(OJ) {
  var method, tryExec;
  OJ.register("tryExec", tryExec = function(tryFunc) {
    'use strict';
    var exception, ret, that;
    ret = false;
    that = this;
    try {
      if (OJ.is.method(tryFunc)) {
        ret = tryFunc.apply(that, Array.prototype.slice.call(arguments, 1));
      }
    } catch (_error) {
      exception = _error;
      if ((exception.name === "TypeError" || exception.type === "called_non_callable") && exception.type === "non_object_property_load") {
        OJ.console.info("Ignoring exception: ", exception);
      } else {
        OJ.console.error(exception);
      }
    } finally {

    }
    return ret;
  });
  OJ.register("method", method = function(tryFunc) {
    'use strict';
    var that;
    that = this;
    return function() {
      var args;
      args = Array.prototype.slice.call(arguments, 0);
      args.unshift(tryFunc);
      return OJ.tryExec.apply(that, args);
    };
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],11:[function(require,module,exports){
(function (global){
(function(OJ) {
  var number;
  number = Object.create(null);
  Object.defineProperty(number, "isNaN", {
    value: (Number && Number.isNaN ? Number.isNaN : isNaN)
  });
  Object.defineProperty(number, "isFinite", {
    value: (Number && Number.isFinite ? Number.isFinite : isFinite)
  });
  Object.defineProperty(number, "MAX_VALUE", {
    value: (Number && Number.MAX_VALUE ? Number.MAX_VALUE : 1.7976931348623157e+308)
  });
  Object.defineProperty(number, "MIN_VALUE", {
    value: (Number && Number.MIN_VALUE ? Number.MIN_VALUE : 5e-324)
  });
  OJ.register("number", number);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(require,module,exports){
(function (global){
(function(OJ) {
  var object;
  object = function() {
    var obj;
    obj = {};

    /*
    Add a property to the object and return it
     */
    obj.add = function(name, val) {
      OJ.property(obj, name, val);
      return obj;
    };
    obj.add('each', function(callback) {
      return OJ.each(obj, function(val, key) {
        if (key !== 'each' && key !== 'add') {
          return callback(val, key);
        }
      });
    });
    return obj;
  };
  OJ.register('object', object);
  OJ.register('isInstanceOf', function(name, obj) {
    return OJ.contains(name, obj) && OJ.to.bool(obj[name]);
  });
  OJ.register('contains', function(object, index) {
    var ret;
    ret = false;
    if (object) {
      ret = _.contains(object, index);
    }
    return ret;
  });
  OJ.register('compare', function(obj1, obj2) {
    return _.isEqual(obj1, obj2);
  });
  OJ.register('clone', function(data) {
    return _.cloneDeep(data(true));
  });
  OJ.register('serialize', function(data) {
    var ret;
    ret = '';
    OJ.tryExec(function() {
      ret = JSON.stringify(data);
    });
    return ret || '';
  });
  OJ.register('deserialize', function(data) {
    var ret;
    ret = {};
    if (data) {
      OJ.tryExec(function() {
        ret = window.$.parseJSON(data);
      });
      if (OJ.is.nullOrEmpty(ret)) {
        ret = {};
      }
    }
    return ret;
  });
  OJ.register('params', function(data, delimiter) {
    var ret;
    if (delimiter == null) {
      delimiter = '&';
    }
    ret = '';
    if (delimiter === '&') {
      OJ.tryExec(function() {
        ret = $.param(data);
      });
    } else {
      OJ.each(data, function(val, key) {
        if (ret.length > 0) {
          ret += delimiter;
        }
        ret += key + '=' + val;
      });
    }
    return OJ.to.string(ret);
  });
  OJ.register('extend', function(destObj, srcObj, deepCopy) {
    var ret;
    if (deepCopy == null) {
      deepCopy = false;
    }
    ret = destObj || {};
    if (deepCopy === true) {
      ret = $.extend(deepCopy, ret, srcObj);
    } else {
      ret = $.extend(ret, srcObj);
    }
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(require,module,exports){
(function (global){
(function(OJ) {

  /*
  Add a property to an object
   */
  var property;
  property = function(obj, name, value, writable, configurable, enumerable) {
    if (!obj) {
      throw new Error("Cannot define a property without an Object.");
    }
    if (name == null) {
      throw new Error("Cannot create a property without a valid property name.");
    }
    obj[name] = value;
    return obj;
  };
  OJ.register("property", property);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],14:[function(require,module,exports){
(function (global){
(function(OJ) {
  OJ.register("delimitedString", function(string, opts) {
    var defaults, retObj;
    defaults = {
      newLineToDelimiter: true,
      spaceToDelimiter: true,
      removeDuplicates: true,
      delimiter: ",",
      initString: OJ.to.string(string)
    };
    retObj = {
      array: [],
      delimited: function() {
        return retObj.array.join(defaults.delimiter);
      },
      string: function(delimiter) {
        var ret;
        if (delimiter == null) {
          delimiter = defaults.delimiter;
        }
        ret = '';
        OJ.each(retObj.array, function(val) {
          if (ret.length > 0) {
            ret += delimiter;
          }
          ret += val;
        });
        return ret;
      },
      toString: function() {
        return retObj.string();
      },
      add: function(str) {
        retObj.array.push(defaults.parse(str));
        defaults.deleteDuplicates();
        return retObj;
      },
      remove: function(str) {
        var remove;
        remove = function(array) {
          return array.filter(function(item) {
            if (item !== str) {
              return true;
            }
          });
        };
        retObj.array = remove(retObj.array);
        return retObj;
      },
      count: function() {
        return retObj.array.length;
      },
      contains: function(str, caseSensitive) {
        var isCaseSensitive, match;
        isCaseSensitive = OJ.to.bool(caseSensitive);
        str = OJ.to.string(str).trim();
        if (false === isCaseSensitive) {
          str = str.toLowerCase();
        }
        match = retObj.array.filter(function(matStr) {
          return (isCaseSensitive && OJ.to.string(matStr).trim() === str) || OJ.to.string(matStr).trim().toLowerCase() === str;
        });
        return match.length > 0;
      },
      each: function(callBack) {
        return retObj.array.forEach(callBack);
      }
    };
    defaults.parse = function(str) {
      var ret;
      ret = OJ.to.string(str);
      if (defaults.newLineToDelimiter) {
        while (ret.indexOf("\n") !== -1) {
          ret = ret.replace(/\n/g, defaults.delimiter);
        }
      }
      if (defaults.spaceToDelimiter) {
        while (ret.indexOf(" ") !== -1) {
          ret = ret.replace(RegExp(" ", "g"), defaults.delimiter);
        }
      }
      while (ret.indexOf(",,") !== -1) {
        ret = ret.replace(/,,/g, defaults.delimiter);
      }
      return ret;
    };
    defaults.deleteDuplicates = function() {
      if (defaults.removeDuplicates) {
        (function() {
          var unique;
          unique = function(array) {
            var seen;
            seen = new Set();
            return array.filter(function(item) {
              if (false === seen.has(item)) {
                seen.add(item);
                return true;
              }
            });
          };
          retObj.array = unique(retObj.array);
        })();
      }
    };
    (function(a) {
      var delimitedString;
      if (a.length > 1 && false === OJ.is.plainObject(opts)) {
        OJ.each(a, function(val) {
          if (false === OJ.is.nullOrEmpty(val)) {
            retObj.array.push(val);
          }
        });
      } else if (string && string.length > 0) {
        OJ.extend(defaults, opts);
        delimitedString = defaults.parse(string);
        defaults.initString = delimitedString;
        retObj.array = delimitedString.split(defaults.delimiter);
      }
      defaults.deleteDuplicates();
    })(arguments);
    return retObj;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(require,module,exports){
(function (global){
(function(OJ) {
  var component;
  component = function(options, owner, tagName) {
    var ret, rootNodeType, widget;
    if (options == null) {
      options = OJ.object();
    }
    if (!tagName.startsWith('x-')) {
      tagName = 'x-' + tagName;
    }
    widget = OJ.element(tagName);
    OJ.nodes.factory(widget, owner);
    rootNodeType = options.rootNodeType || OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] || 'div';
    ret = widget.make(rootNodeType, options);
    ret.add('componentName', tagName);
    ret.add('remove', widget.remove);
    return ret;
  };
  OJ.register('component', component);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
(function (global){
(function(OJ) {

  /*
  Create a set of HTML Elements through ThinDom
   */
  var control;
  control = function(options, owner, tagName) {
    var ret, rootNodeType;
    if (options == null) {
      options = OJ.object();
    }
    if (!tagName.startsWith('y-')) {
      tagName = 'y-' + tagName;
    }
    rootNodeType = options.rootNodeType || OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] || 'div';
    ret = OJ.element(rootNodeType, options.props, options.styles, options.events, options.text);
    OJ.nodes.factory(ret, owner);
    ret.add('controlName', tagName);
    return ret;
  };
  OJ.register('control', control);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],17:[function(require,module,exports){
(function (global){
(function(OJ) {
  OJ.register('dom', function(el, parent) {
    var enabled, isControlStillValid;
    if (parent == null) {
      parent = OJ.body;
    }
    'use strict';
    enabled = true;
    el.add('isValid', function() {
      return el && (el.el instanceof HTMLElement || el.el instanceof DocumentFragment);
    });
    isControlStillValid = function() {
      var valid;
      valid = false === OJ.is.nullOrEmpty(el) && el.isValid();
      if (false === valid) {
        throw new Error('el is null. Event bindings may not have been GCd.');
      }
      return valid;
    };
    el.add('addClass', function(name) {
      if (isControlStillValid()) {
        el.$.addClass(name);
      }
      return el;
    });
    el.add('bind', function(eventName, event) {
      return el.on(eventName, event);
    });
    el.add('on', function(eventName, event) {
      if (isControlStillValid()) {
        el.$.on(eventName, event);
      }
      return el;
    });
    el.add('off', function(eventName, event) {
      if (isControlStillValid()) {
        el.$.off(eventName, event);
      }
      return el;
    });
    el.add('keyboard', function(keys, event) {
      if (isControlStillValid()) {
        Mousetrap.bind(keys, el[event]);
      }
      return el;
    });
    el.add('disable', function() {
      if (isControlStillValid()) {
        enabled = false;
        el.attr('disabled', 'disabled');
        el.addClass('disabled', 'disabled');
      }
      return el;
    });
    el.add('empty', function() {
      if (isControlStillValid()) {
        el.$.empty();
      }
      return el;
    });
    el.add('enable', function() {
      if (isControlStillValid()) {
        enabled = true;
        el.removeAttr('disabled');
        el.removeClass('disabled');
      }
      return el;
    });
    el.add('getId', function() {
      var id;
      if (isControlStillValid()) {
        id = el[0].id;
      }
      return id;
    });
    el.add('hide', function() {
      if (isControlStillValid()) {
        el.css('display', 'none');
      }
      return el;
    });
    el.add('length', function() {
      var len;
      len = 0;
      if (isControlStillValid()) {
        len = OJ.to.number(el.$.length);
      }
      return len;
    });
    el.add('parent', parent);
    el.add('remove', function() {
      if (el && el.$) {
        el.$.remove();
        el = null;
      }
      return null;
    });
    el.add('removeClass', function(name) {
      if (isControlStillValid()) {
        el.$.removeClass(name);
      }
      return el;
    });
    el.add('removeProp', function(name) {
      if (isControlStillValid()) {
        el.$.removeProp(name);
      }
      return el;
    });
    el.add('removeAttr', function(name) {
      if (isControlStillValid()) {
        el.$.removeAttr(name);
      }
      return el;
    });
    el.add('required', function(truthy, addLabel) {
      if (isControlStillValid()) {
        switch (OJ.to.bool(truthy)) {
          case true:
            el.attr('required', true);
            el.addClass('required');
            break;
          case false:
            el.removeProp('required');
            el.removeClass('required');
        }
      }
      return el;
    });
    el.add('root', el.root || parent);
    el.add('show', function() {
      if (isControlStillValid()) {
        el.$.show();
      }
      return el;
    });
    el.add('toggle', function() {
      if (isControlStillValid()) {
        el.$.toggle();
      }
      return el;
    });
    el.add('toggleEnable', function() {
      if (isControlStillValid()) {
        if (enabled) {
          el.disable();
        } else {
          el.enable();
        }
      }
      return el;
    });
    el.add('trigger', function(eventName, eventOpts) {
      if (isControlStillValid()) {
        el.$.trigger(eventName, eventOpts);
      }
      return el;
    });
    el.add('unbind', function(eventName, event) {
      return el.off(eventName, event);
    });
    el.add('val', function(value) {
      if (isControlStillValid()) {
        if (arguments.length === 1 && false === OJ.is.nullOrUndefined(value)) {
          el.$.val(value);
          return el;
        } else {
          return el.$.val();
        }
      }
    });
    el.add('valueOf', function() {
      return el.val();
    });
    el.add('toString', function() {
      return el.val();
    });
    return el;
  });
  OJ.register('isElementInDom', function(elementId) {
    return false === OJ.is.nullOrEmpty(OJ.getElement(elementId));
  });
  OJ.register('getElement', function(id) {
    if (typeof document !== 'undefined') {
      return document.getElementById(id);
    }
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],18:[function(require,module,exports){
(function (global){
var __slice = [].slice;

(function(OJ) {

  /*
   Bind all event handlers
   */
  var bindEvents, body, finalize, initBody, thinBody;
  bindEvents = function(el, events) {
    if (el) {
      return _.forOwn(events, function(val, key) {
        var callback;
        if (OJ.is.method(val)) {
          callback = function() {
            var event;
            event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return val.apply(null, event);
          };
          el.$.on(key, callback);
          el.add(key, callback);
        }
      });
    }
  };

  /*
  Finalize the ThimDOM node
   */
  finalize = function(ret, tag, props, styles, events, text) {
    ret.add('tagName', tag);
    ret.css(styles);
    if (text) {
      ret.text(text);
    }
    ret.add('$', $(ret.get()));
    ret.add('0', ret.get());
    ret.add('bindEvents', _.once(function() {
      return bindEvents(ret, events);
    }));
    return ret;
  };

  /*
  Create an HTML Element through ThinDom
   */
  OJ.register('element', function(tag, props, styles, events, text) {
    var ret;
    ret = new ThinDOM(tag, props);
    finalize(ret, tag, props, styles, events, text);
    return ret;
  });

  /*
  Restore an HTML Element through ThinDom
   */
  OJ.register('restoreElement', function(el, tag) {
    var ret;
    if (tag == null) {
      tag = el.nodeName;
    }
    ret = new ThinDOM(null, null, el);
    finalize(ret, tag);
    ret.add('isInDOM', true);
    OJ.nodes.factory(ret);
    return ret;
  });

  /*
  Persist a handle on the body node
   */
  if (typeof document !== 'undefined') {
    body = document.body;
  } else {
    body = null;
  }
  initBody = function(el) {
    var ret;
    ret = new ThinDOM(null, {
      id: 'body'
    }, el);
    ret.isInDOM = true;
    return finalize(ret, 'body');
  };
  thinBody = initBody(body);
  thinBody.getId = function() {
    return 'body';
  };
  OJ.register('body', thinBody);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],19:[function(require,module,exports){
(function (global){
(function(OJ) {
  OJ.register('fragment', function() {
    var fragment, ret;
    ret = null;
    if (typeof document !== 'undefined') {
      fragment = document.createDocumentFragment();
      ret = OJ.restoreElement(fragment, 'fragment');
    }
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],20:[function(require,module,exports){
(function (global){
(function(OJ) {
  var all, closed, loopName, open, _fn, _i, _len;
  closed = ['abbr', 'acronym', 'applet', 'article', 'aside', 'audio', 'b', 'bdo', 'big', 'blockquote', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'html', 'i', 'iframe', 'ins', 'kbd', 'label', 'legend', 'li', 'map', 'mark', 'menu', 'meter', 'nav', 'noframes', 'noscript', 'object', 'optgroup', 'option', 'output', 'p', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'small', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'tbody', 'td', 'tfoot', 'th', 'time', 'title', 'tr', 'tt', 'u', 'var', 'video', 'xmp'];
  open = 'area base col command css embed hr img keygen meta param source track wbr'.split(' ');
  all = closed.concat(open);
  _fn = function(tag) {
    return OJ.nodes.register(tag, function(options, owner, calledFromFactory) {
      var defaults, ret;
      if (owner == null) {
        owner = OJ.body;
      }
      if (calledFromFactory == null) {
        calledFromFactory = false;
      }
      defaults = {
        props: {},
        styles: {},
        events: {}
      };
      OJ.extend(defaults, options, false);
      ret = OJ.element(tag, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  };
  for (_i = 0, _len = all.length; _i < _len; _i++) {
    loopName = all[_i];
    _fn(loopName);
  }
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],21:[function(require,module,exports){
(function (global){
(function(OJ) {

  /*
  Create an OJ Input Object through OJ.nodes.input
   */
  var input;
  input = function(options, owner) {
    var ret;
    if (options == null) {
      options = OJ.object();
    }
    if (!owner) {
      throw new Error('Cannot create an input without a parent');
    }
    if (!options.props || !options.props.type) {
      throw new Error('Cannot create an input without an input type');
    }
    ret = owner.make('input', options);
    ret.add('inputName', options.props.type);
    return ret;
  };
  OJ.register('input', input);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],22:[function(require,module,exports){
(function (global){
(function(OJ) {
  var addMakeMethod, closed, initBody, makeAdd, makeUniqueId, nestableNodeNames, nodeNames, nonNestableNodes, open;
  closed = 'a abbr acronym address applet article aside audio b bdo big blockquote body button canvas caption center cite code colgroup command datalist dd del details dfn dir div dl dt em embed fieldset figcaption figure font footer form frameset h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins keygen kbd label legend li map mark menu meter nav noframes noscript object ol optgroup option output p pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr tt u ul var video wbr xmp'.split(' ');
  open = 'area base br col command css !DOCTYPE embed hr img input keygen link meta param source track wbr'.split(' ');
  nestableNodeNames = ['div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'fieldset', 'select', 'ol', 'ul', 'table'];
  nonNestableNodes = ['li', 'legend', 'tr', 'td', 'option', 'body', 'head', 'source', 'tbody', 'tfoot', 'thead', 'link', 'script'];

  /*
  Fetch a node from the DOM and return an OJ'fied instance of the element
   */
  OJ.nodes.register('get', function(id, tagName) {
    var el, ret, thinEl;
    if (tagName == null) {
      tagName = 'div';
    }
    ret = null;
    el = document.getElementById(id);
    if (el) {
      thinEl = OJ.restoreElement(el, tagName);
    }
    if (thinEl) {
      ret = OJ.nodes.factory(thinEl, null, 0);
    }
    return ret;
  });
  nodeNames = ['a', 'b', 'br', 'button', 'div', 'em', 'fieldset', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'img', 'input', 'label', 'legend', 'li', 'nav', 'ol', 'option', 'p', 'select', 'span', 'strong', 'sup', 'svg', 'table', 'tbody', 'td', 'textarea', 'th', 'thead', 'tr', 'ul'];
  makeAdd = function(tagName, el, count) {
    return function(opts) {
      var method, nu;
      method = OJ.nodes[tagName] || OJ.components[tagName] || OJ.controls[tagName] || OJ.inputs[tagName];
      if (method) {
        nu = method(opts, el, true);
      } else {
        nu = OJ.component(null, el, tagName);
      }
      return OJ.nodes.factory(nu, el, count);
    };
  };
  addMakeMethod = function(el, count) {
    var methods;
    methods = OJ.object();
    el.make = function(tagName, opts) {
      var method;
      method = methods[tagName];
      if (!method) {
        method = makeAdd(tagName, el, count);
        methods[tagName] = method;
      }
      return method(opts);
    };
    return el;
  };
  makeUniqueId = function(el, parent, count) {
    var id;
    if (OJ.GENERATE_UNIQUE_IDS) {
      count += 1;
      if (count <= parent.count) {
        count = parent.count + 1;
      }
      parent.count = count;
      if (!el.getId()) {
        id = parent.getId() || '';
        id += el.tagName + count;
        el.attr('id', id);
      }
    }
  };

  /*
  Extends a OJ Control class with all the (permitted) methods on the factory
   */
  OJ.nodes.register('factory', function(el, parent, count) {
    var finalize, ret;
    if (parent == null) {
      parent = OJ.body;
    }
    if (count == null) {
      count = parent.count || 0;
    }
    ret = el;
    if (!el.isFullyInit) {
      if (el.tagName !== 'body') {
        ret = OJ.dom(el, parent);
        if (!ret.isInDOM) {
          makeUniqueId(el, parent, count);
          parent.append(ret[0]);
          ret.bindEvents();
          ret.isInDOM = true;
        }
        addMakeMethod(ret, count);
        ret.isFullyInit = true;
        finalize = _.once(ret.finalize || OJ.noop);
        ret.finalize = finalize;
        finalize(ret);
      }
    }
    return ret;
  });
  initBody = (function() {
    OJ.body.count = 0;
    OJ.body.root = null;
    OJ.dom(OJ.body, null);
    addMakeMethod(OJ.body, 0);
    return OJ.body.isFullyInit = true;
  })();
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],23:[function(require,module,exports){
(function (global){
var __slice = [].slice;

(function(OJ) {
  'use strict';
  var nodeName;
  nodeName = 'a';
  OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
    var click, defaults, newClick, ret, toggle, toggleState;
    if (owner == null) {
      owner = OJ.body;
    }
    if (calledFromFactory == null) {
      calledFromFactory = false;
    }
    defaults = {
      props: {
        id: '',
        "class": '',
        text: '',
        href: 'javaScript:void(0);',
        type: '',
        title: '',
        rel: '',
        media: '',
        target: ''
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    toggleState = 'off';
    toggle = function() {
      if (toggleState === 'on') {
        toggleState = 'off';
      } else {
        if (toggleState === 'off') {
          toggleState = 'on';
        }
      }
    };
    if (defaults.events.click !== OJ.noop) {
      click = defaults.events.click;
      newClick = function() {
        var event, retVal;
        event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        toggle();
        retVal = click.apply(null, event);
        if (defaults.href === '#') {
          retVal = false;
        }
        return retVal;
      };
      defaults.events.click = newClick;
    } else {
      defaults.events.click = toggle;
    }
    ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
    if (false === calledFromFactory) {
      OJ.nodes.factory(ret, owner);
    }
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
(function (global){
(function(OJ) {
  'use strict';
  var nodeName;
  nodeName = 'br';
  OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
    var defaults, i, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    if (calledFromFactory == null) {
      calledFromFactory = false;
    }
    defaults = {
      props: {},
      styles: {},
      events: {
        click: OJ.noop
      },
      number: 1
    };
    OJ.extend(defaults, options, true);
    i = 0;
    while (i < OJ.to.number(defaults.number)) {
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      i += 1;
    }
    if (false === calledFromFactory) {
      OJ.nodes.factory(ret, owner);
    }
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],25:[function(require,module,exports){
(function (global){
(function(OJ) {
  'use strict';
  var nodeName;
  nodeName = 'form';
  OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    if (calledFromFactory == null) {
      calledFromFactory = false;
    }
    defaults = {
      props: {
        action: '',
        method: '',
        name: ''
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
    ret.add('validator', ret.$.validate({
      highlight: function(element) {
        var $elm;
        $elm = $(element);
        $elm.attr('OJ_invalid', '1');
        $elm.animate({
          backgroundColor: 'red'
        });
      },
      unhighlight: function(element) {
        var $elm;
        $elm = $(element);
        if ($elm.attr('OJ_invalid') === '1') {
          $elm.css('background-color', 'yellow');
          $elm.attr('OJ_invalid', '0');
          setTimeout((function() {
            $elm.animate({
              backgroundColor: 'transparent'
            });
          }), 500);
        }
      }
    }));
    ret.add('isFormValid', function() {
      return ret.$.valid() && (!ret.validator.invalidElements() || ret.validator.invalidElements().length === 0);
    });
    if (false === calledFromFactory) {
      OJ.nodes.factory(ret, owner);
    }
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],26:[function(require,module,exports){
(function (global){
var __slice = [].slice;

(function(OJ) {
  'use strict';
  var nodeName;
  nodeName = 'input';
  OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
    var defaults, newChange, newClick, newFocusout, oldChange, oldClick, oldFocusout, ret, syncValue, thisType;
    if (owner == null) {
      owner = OJ.body;
    }
    if (calledFromFactory == null) {
      calledFromFactory = false;
    }
    defaults = {
      props: {
        type: 'text',
        value: ''
      },
      styles: {},
      events: {
        click: OJ.noop,
        change: OJ.noop,
        focusout: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    if (!defaults.props.type || !OJ.enums.inputTypes[defaults.props.type]) {
      throw new Error('No matching input type for {' + defaults.props.type + '} could be found.');
    }
    thisType = OJ.enums.inputTypes[defaults.props.type];
    syncValue = function() {
      switch (thisType) {
        case OJ.enums.inputTypes.checkbox:
          ret.value = ret.$.is(':checked');
          break;
        case OJ.enums.inputTypes.radio:
          ret.value = ret.$.find(':checked').val();
          break;
        default:
          ret.value = ret.val();
      }
      return ret.value;
    };

    /* 
      Click binding. If the caller defined a click handler, 
      wrap it, sync the value of the input first, 
      then call the defined click handler with the latest value.
     */
    oldClick = defaults.events.click;
    if (oldClick && oldClick !== OJ.noop) {
      newClick = function() {
        var event;
        event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        syncValue();
        return oldClick.apply(null, [ret.value].concat(__slice.call(event)));
      };
      defaults.events.click = newClick;
    }

    /* 
      Change binding. If the caller defined a change handler, 
      wrap it, sync the value of the input first, 
      then call the defined change handler with the latest value.
     */
    oldChange = defaults.events.change;
    if (oldChange && oldChange !== OJ.noop) {
      newChange = function() {
        var event;
        event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        syncValue();
        return oldChange.apply(null, [ret.value].concat(__slice.call(event)));
      };
      defaults.events.change = newChange;
    }

    /* 
      On Focus Out binding. Always use the event to update the internal
      value of the control; and if the caller defined a focusout event,
      wrap it and invoke it with the latest value
     */
    oldFocusout = defaults.events.focusout;
    newFocusout = function() {
      var event;
      event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      syncValue();
      if (oldFocusout && oldFocusout !== OJ.noop) {
        return oldFocusout.apply(null, [ret.value].concat(__slice.call(event)));
      }
    };
    defaults.events.focusout = newFocusout;
    ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
    ret.value = defaults.props.value;
    if (false === calledFromFactory) {
      OJ.nodes.factory(ret, owner);
    }
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],27:[function(require,module,exports){
(function (global){
(function(OJ) {
  'use strict';
  var nodeName;
  nodeName = 'ol';
  OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    if (calledFromFactory == null) {
      calledFromFactory = false;
    }
    defaults = {
      props: {},
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
    if (false === calledFromFactory) {
      OJ.nodes.factory(ret, owner);
    }
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],28:[function(require,module,exports){
(function (global){
var __slice = [].slice;

(function(OJ) {
  'use strict';
  var nodeName;
  nodeName = 'select';
  OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
    var change, click, defaults, hasEmpty, newChange, newClick, ret, syncValue, value, values;
    if (owner == null) {
      owner = OJ.body;
    }
    if (calledFromFactory == null) {
      calledFromFactory = false;
    }
    defaults = {
      props: {
        selected: '',
        multiple: false
      },
      styles: {},
      values: [],
      events: {
        click: OJ.noop,
        change: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    value = '';
    values = [];
    hasEmpty = false;
    syncValue = function() {
      return value = ret.val();
    };
    if (defaults.events.click !== OJ.noop) {
      click = defaults.events.click;
      newClick = function() {
        var event, retval;
        event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        retval = click.apply(null, event);
        syncValue();
        return retval;
      };
      defaults.events.click = newClick;
    }
    if (defaults.events.change !== OJ.noop) {
      change = defaults.events.change;
      newChange = function() {
        var event, retval;
        event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        retval = change.apply(null, event);
        syncValue();
        return retval;
      };
      defaults.events.change = newChange;
    }
    ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
    ret.add('selectedData', function(propName) {
      var dataset;
      ret = '';
      if (ret.$.find('option:selected') && ret.$.find('option:selected')[0]) {
        dataset = ret.$.find('option:selected')[0].dataset;
        if (dataset) {
          ret = dataset[propName];
        }
      }
      return ret;
    });
    ret.add('selectedText', function() {
      return ret.$.find('option:selected').text();
    });
    ret.add('selectedVal', function() {
      value = ret.val();
      return value;
    });
    ret.add('addOption', function(value, text, selected, disabled) {
      var add, isEmpty, option, val;
      if (text == null) {
        text = value;
      }
      if (selected == null) {
        selected = false;
      }
      if (disabled == null) {
        disabled = false;
      }
      isEmpty = _.isEmpty(value);
      add = false;
      if (isEmpty && false === hasEmpty) {
        hasEmpty = true;
        add = true;
      }
      if (false === add && false === isEmpty) {
        add = true;
      }
      if (add) {
        val = {
          text: text,
          props: {
            value: value
          }
        };
        if (selected) {
          val.selected = selected;
        }
        if (disabled) {
          val.disabled = disabled;
        }
        option = ret.make('option', val);
        return option;
      }
    });
    ret.add('addOptions', function(options) {
      values = _.union(values, options);
      OJ.each(options, (function(val) {
        value = ret.addOption(val);
        values.push(value);
      }), false);
      return values;
    });
    ret.add('resetOptions', function(values) {
      ret.empty();
      values = values;
      ret.addOptions(values);
      return ret;
    });
    ret.add('removeOption', function(valueToRemove) {
      var i, selectControl;
      values.splice(values.indexOf(valueToRemove), 1);
      selectControl = ret[0];
      i = 0;
      while (i < selectControl.length) {
        if (selectControl.options[i].value === valueToRemove) {
          selectControl.remove(i);
        }
        i++;
      }
    });
    if (defaults.values.length > 0) {
      ret.addOptions(defaults.values);
    }
    if (false === calledFromFactory) {
      OJ.nodes.factory(ret, owner);
    }
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],29:[function(require,module,exports){
(function (global){
(function(OJ) {
  var nodeName, table;
  nodeName = 'table';

  /*
  Create an HTML table. Provides helper methods to create Columns and Cells.
   */
  table = function(options, owner, calledFromFactory) {
    var cells, columnCount, defaults, fillMissing, init, loadCells, ret, rows, tbody, thead, theadRow;
    if (owner == null) {
      owner = OJ.body;
    }
    if (calledFromFactory == null) {
      calledFromFactory = false;
    }
    defaults = {
      data: null,
      props: {
        cellpadding: 0,
        cellspacing: 0,
        align: '',
        width: '',
        cellalign: 'left',
        cellvalign: 'top',
        "class": ''
      },
      styles: {},
      events: {},
      cells: {
        "class": '',
        align: '',
        'vertical-align': '',
        cellpadding: '',
        margin: ''
      },
      thead: {},
      tbody: {},
      firstAlignRight: false,
      oddAlignRight: false
    };
    rows = [];
    cells = OJ.array2D();
    columnCount = 0;
    OJ.extend(defaults, options, true);
    ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
    if (false === calledFromFactory) {
      OJ.nodes.factory(ret, owner);
    }
    tbody = null;
    thead = null;
    theadRow = null;
    init = _.once(function() {
      var jBody, jHead, jTbl, tblStr;
      if (defaults.data) {
        tblStr = ConvertJsonToTable(defaults.data);
      }
      if (tblStr) {
        jTbl = $(tblStr);
        jHead = jTbl.find('thead');
        ret.$.append(jHead);
        thead = OJ.restoreElement(jHead[0]);
        theadRow = OJ.restoreElement(thead[0].rows[0]);
        jBody = jTbl.find('tbody');
        ret.$.append(jBody);
        tbody = OJ.restoreElement(jBody[0]);
        loadCells();
      } else {
        thead = ret.make('thead', defaults.thead);
        theadRow = thead.make('tr');
        tbody = ret.make('tbody', defaults.tbody);
        rows.push(tbody.make('tr'));
      }
      return ret;
    });
    loadCells = function() {
      var c, memCell, memRow, r, _results;
      r = 0;
      _results = [];
      while (tbody[0].rows.length > r) {
        c = 0;
        memRow = OJ.restoreElement(tbody[0].rows[r]);
        rows.push(memRow);
        while (tbody[0].rows[r].cells.length > c) {
          memCell = cells.get(r + 1, c + 1);
          if (!memCell) {
            memCell = OJ.restoreElement(tbody[0].rows[r].cells[c]);
            cells.set(r + 1, c + 1, memCell);
          }
          c += 1;
        }
        _results.push(r += 1);
      }
      return _results;
    };
    fillMissing = function() {
      return cells.each(function(rowNo, colNo, val) {
        var row;
        if (!val) {
          row = ret.row(rowNo);
          return row.cell(colNo, {});
        }
      });
    };
    ret.add('column', function(colNo, colName) {
      var i, nativeTh, th;
      ret.init();
      columnCount += 1;
      th = null;
      i = 0;
      while (thead[0].rows[0].cells.length < colNo) {
        nativeTh = thead[0].rows[0].cells[i];
        if (!nativeTh) {
          th = theadRow.make('th', {});
        } else {
          th = OJ.restoreElement(nativeTh, 'th');
        }
        i += 1;
      }
      if (!th) {
        nativeTh = thead[0].rows[0].cells[colNo - 1];
        th = OJ.restoreElement(nativeTh, 'th');
      }
      th.text(colName);
      return th;
    });
    ret.add('row', function(rowNo, opts) {
      var row;
      row = rows[rowNo - 1];
      if (!row) {
        while (rows.length < rowNo) {
          row = tbody.make('tr', {});
          rows.push(row);
        }
      }
      if (!row.cell) {
        row.add('cell', function(colNo, opts) {
          var cell;
          cell = OJ.nodes.td(opts, row);
          cells.set(rowNo, colNo, cell);
          return cell;
        });
      }
      return row;
    });
    ret.add('cell', function(rowNo, colNo, opts) {
      var cell, i, nuOpts, row, tryCell;
      if (rowNo < 1) {
        rowNo = 1;
      }
      if (colNo < 1) {
        colNo = 1;
      }
      if (columnCount > 0 && colNo - 1 > columnCount) {
        throw new Error('A column name has not been defined for this position {' + rowNo + 'x' + colNo + '}.');
      }
      row = ret.row(rowNo);
      cell = cells.get(rowNo, colNo);
      if (!cell) {
        i = 0;
        while (i < colNo) {
          i += 1;
          if (i === colNo) {
            nuOpts = OJ.extend({
              props: defaults.cells
            }, opts);
            cell = row.cell(colNo, nuOpts);
          } else {
            tryCell = cells.get(rowNo, i);
            if (!tryCell) {
              tryCell = row.cell(i, {
                props: defaults.cells
              });
            }
          }
        }
      }
      return cell;
    });
    ret.add('finalize', function() {
      init();
      ret.add('thead', thead);
      ret.add('tbody', tbody);
      return ret;
    });
    return ret;
  };
  OJ.nodes.register(nodeName, table);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],30:[function(require,module,exports){
(function (global){
var __slice = [].slice;

(function(OJ) {
  'use strict';
  var nodeName;
  nodeName = 'textarea';
  OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
    var change, click, defaults, newChange, newClick, ret, syncValue, value;
    if (owner == null) {
      owner = OJ.body;
    }
    if (calledFromFactory == null) {
      calledFromFactory = false;
    }
    defaults = {
      props: {
        name: "",
        placeholder: "",
        value: "",
        text: "",
        maxlength: "",
        autofocus: false,
        isRequired: false,
        rows: 3,
        cols: 25,
        disabled: false,
        readonly: false,
        form: "",
        wrap: ""
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    value = defaults.props.value;
    syncValue = function() {
      switch (defaults.props.type) {
        case OJ.enums.inputTypes.checkbox:
          return value = ret.$.is(":checked");
        case OJ.enums.inputTypes.radio:
          return value = ret.$.find(":checked").val();
        default:
          return value = ret.val();
      }
    };
    if (defaults.events.click !== OJ.noop) {
      click = defaults.events.click;
      newClick = function() {
        var event, retval;
        event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        retval = click.apply(null, event);
        syncValue();
        return retval;
      };
      defaults.events.click = newClick;
    }
    if (defaults.events.change !== OJ.noop) {
      change = defaults.events.change;
      newChange = function() {
        var event, retval;
        event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        retval = change.apply(null, event);
        syncValue();
        return retval;
      };
      defaults.events.change = newChange;
    }
    ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
    if (false === calledFromFactory) {
      OJ.nodes.factory(ret, owner);
    }
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],31:[function(require,module,exports){
(function (global){
(function(OJ) {
  'use strict';
  var nodeName;
  nodeName = 'thead';
  OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
    var cells, defaults, ret, rows;
    if (owner == null) {
      owner = OJ.body;
    }
    if (calledFromFactory == null) {
      calledFromFactory = false;
    }
    defaults = {
      props: {},
      styles: {},
      events: {
        click: OJ.noop
      },
      number: 1
    };
    OJ.extend(defaults, options, true);
    ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
    if (false === calledFromFactory) {
      OJ.nodes.factory(ret, owner);
    }
    rows = [];
    cells = {};
    ret.add('cell', function(rowNo, colNo) {
      var cell, idx, row, td;
      init();
      if (rowNo < 1) {
        rowNo = 1;
      }
      if (colNo < 1) {
        colNo = 1;
      }
      row = rows[rowNo - 1];
      if (!row) {
        while (rows.length < rowNo) {
          row = OJ.nodes.tr({}, tbody, false);
          rows.push(row);
        }
      }
      td = row[0].cells[colNo];
      if (td) {
        cell = OJ.restoreElement(td, 'td');
      }
      if (!td) {
        while (row[0].cells.length < colNo) {
          idx = row[0].cells.length;
          td = row[0].cells[idx - 1];
          if (td && idx === colNo) {
            cell = OJ.restoreElement(td, 'td');
          } else {
            cell = OJ.nodes.td({
              props: defaults.cells
            }, row, false);
          }
        }
      }
      if (!cell.isValid) {
        OJ.nodes.factory(cell, row, rowNo + colNo);
      }
      return cell;
    });
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],32:[function(require,module,exports){
(function (global){
(function(OJ) {
  'use strict';
  var nodeName;
  nodeName = 'ul';
  OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    if (calledFromFactory == null) {
      calledFromFactory = false;
    }
    defaults = {
      props: {},
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
    if (false === calledFromFactory) {
      OJ.nodes.factory(ret, owner);
    }
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],33:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'buttoninput';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: 'button',
        src: '',
        alt: '',
        height: '',
        width: ''
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],34:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'checkbox';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      checked: false,
      indeterminate: false,
      props: {
        type: inputName
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    if (defaults.checked) {
      ret.attr('checked', true);
    } else if (defaults.indeterminate) {
      ret.attr('indeterminate', true);
    }
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],35:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'color';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],36:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'date';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],37:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'datetime';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],38:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'datetime-local';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],39:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'email';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName,
        multiple: ''
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],40:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'file';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName,
        accept: '',
        multiple: ''
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],41:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'hidden';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],42:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'imageinput';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: 'image',
        src: '',
        alt: '',
        height: '',
        width: ''
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],43:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'month';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],44:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'number';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],45:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'password';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName,
        maxlength: ''
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],46:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'radio';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName,
        name: '',
        value: '',
        checked: ''
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],47:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'range';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName,
        min: 0,
        max: 100,
        value: 50,
        step: 1
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],48:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'reset';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],49:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'search';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],50:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'submit';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],51:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'tel';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName,
        pattern: '',
        maxlength: ''
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],52:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'textinput';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: 'text',
        autocomplete: 'on',
        autosave: ''
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],53:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'time';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],54:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'url';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName,
        pattern: '',
        maxlength: ''
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],55:[function(require,module,exports){
(function (global){
(function(OJ) {
  var inputName;
  inputName = 'week';
  OJ.inputs.register(inputName, function(options, owner) {
    var defaults, ret;
    if (owner == null) {
      owner = OJ.body;
    }
    defaults = {
      props: {
        type: inputName
      },
      styles: {},
      events: {
        click: OJ.noop
      }
    };
    OJ.extend(defaults, options, true);
    ret = OJ.input(defaults, owner);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],56:[function(require,module,exports){
(function (global){
(function(thisGlobal) {
  var NsTree, makeTheJuice, nameSpaceName, thisDocument, utilLib;
  utilLib = thisGlobal.jQuery;
  nameSpaceName = 'OJ';

  /*
  boot strap name method into Object prototype
   */
  Object.defineProperties(Object.prototype, {
    getInstanceName: {
      value: function() {
        var funcNameRegex, results;
        funcNameRegex = /function (.{1,})\(/;
        results = funcNameRegex.exec(this.constructor.toString());
        if (results && results.length > 1) {
          return results[1];
        } else {
          return '';
        }
      }
    }
  });

  /*
  An internal representation of the namespace tree
   */
  NsTree = {};
  makeTheJuice = function() {

    /*
    Internal nameSpaceName method to create new 'sub' namespaces on arbitrary child objects.
     */
    var NsOut, dependsOn, makeNameSpace, nsInternal;
    makeNameSpace = function(spacename, tree) {

      /*
      The derived instance to be constructed
       */
      var Base, Class;
      Base = function(nsName) {
        var members, nsTree, proto;
        proto = this;
        tree[nsName] = tree[nsName] || {};
        nsTree = tree[nsName];
        members = {};
        Object.defineProperty(this, 'members', {
          value: members
        });

        /*
        Register (e.g. 'Lift') an Object into the prototype of the namespace.
        This Object will be readable/executable but is otherwise immutable.
         */
        Object.defineProperty(this, 'register', {
          value: function(name, obj, enumerable) {
            'use strict';
            if ((typeof name !== 'string') || name === '') {
              throw new Error('Cannot lift a new property without a valid name.');
            }
            if (!obj) {
              throw new Error('Cannot lift a new property without a valid property instance.');
            }
            if (proto[name]) {
              throw new Error('Property named ' + name + ' is already defined on ' + spacename + '.');
            }
            members[name] = members[name] || name;
            nsTree[name] = nsTree[name] || {
              name: name,
              type: typeof obj,
              instance: (obj.getInstanceName ? obj.getInstanceName() : 'unknown')
            };
            Object.defineProperty(proto, name, {
              value: obj,
              enumerable: false !== enumerable
            });
            nsInternal.alertDependents(nsName + '.' + spacename + '.' + name);
            return obj;
          }
        });

        /*
        Create a new, static namespace on the current parent (e.g. nsName.to... || nsName.is...)
         */
        proto.register('makeSubNameSpace', (function(subNameSpace) {
          'use strict';
          var newNameSpace;
          if ((typeof subNameSpace !== 'string') || subNameSpace === '') {
            throw new Error('Cannot create a new sub namespace without a valid name.');
          }
          if (proto.subNameSpace) {
            throw new Error('Sub namespace named ' + subNameSpace + ' is already defined on ' + spacename + '.');
          }
          nsInternal.alertDependents(nsName + '.' + subNameSpace);
          newNameSpace = makeNameSpace(subNameSpace, nsTree);
          if (subNameSpace !== 'constants') {
            newNameSpace.register('constants', makeNameSpace('constants', nsTree), false);
          }
          proto.register(subNameSpace, newNameSpace, false);
          return newNameSpace;
        }), false);
      };

      /*
      An internal mechanism to represent the instance of this namespace
      @constructor
      @internal
      @memberOf makeNameSpace
       */
      Class = new Function('return function ' + spacename + '(){}')();
      Class.prototype = new Base(spacename);
      return new Class(spacename);
    };

    /*
    'Depend' an Object upon another member of this namespace, upon another namespace,
    or upon a member of another namespace
     */
    dependsOn = function(dependencies, callBack, imports) {
      'use strict';
      var missing, nsMembers, ret;
      ret = false;
      nsMembers = nsInternal.getNsMembers();
      if (dependencies && dependencies.length > 0 && callBack) {
        missing = dependencies.filter(function(depen) {
          return nsMembers.indexOf(depen) === -1 && (!imports || imports !== depen);
        });
        if (missing.length === 0) {
          ret = true;
          callBack();
        } else {
          nsInternal.dependents.push(function(imports) {
            return dependsOn(missing, callBack, imports);
          });
        }
      }
      return ret;
    };
    nsInternal = {
      dependents: []
    };

    /*
    Fetches the registered properties and methods on the namespace and its child namespaces
     */
    Object.defineProperty(nsInternal, 'getNsMembers', {
      value: function() {
        var members, recurseTree;
        recurseTree = function(key, lastKey) {
          if (typeof key === 'string') {
            members.push(lastKey + '.' + key);
          }
          if (utilLib.isPlainObject(key)) {
            Object.keys(key).forEach(function(k) {
              if (typeof k === 'string') {
                members.push(lastKey + '.' + k);
              }
              if (utilLib.isPlainObject(key[k])) {
                recurseTree(key[k], lastKey + '.' + k);
              }
            });
          }
        };
        members = [];
        Object.keys(NsTree[nameSpaceName]).forEach(function(key) {
          if (utilLib.isPlainObject(NsTree[nameSpaceName][key])) {
            recurseTree(NsTree[nameSpaceName][key], nameSpaceName);
          }
        });
        return members;
      }
    });

    /*
    To support dependency management, when a property is lifted onto the namespace, notify dependents to initialize
     */
    Object.defineProperty(nsInternal, 'alertDependents', {
      value: function(imports) {
        var deps;
        deps = nsInternal.dependents.filter(function(depOn) {
          return false === depOn(imports);
        });
        if (Array.isArray(deps)) {
          nsInternal.dependents = deps;
        }
      }
    });
    NsTree[nameSpaceName] = {};
    NsOut = makeNameSpace(nameSpaceName, NsTree[nameSpaceName]);

    /*
    Cache a handle on the vendor (probably jQuery) on the root namespace
     */
    NsOut.register('?', utilLib, false);

    /*
    Cache the tree (useful for documentation/visualization/debugging)
     */
    NsOut.register('tree', NsTree[nameSpaceName], false);

    /*
    Cache the name space name
     */
    NsOut.register('name', nameSpaceName, false);
    NsOut.register('dependsOn', dependsOn, false);
    return NsOut;
  };

  /*
  Actually define the OJ NameSpace
   */
  Object.defineProperty(thisGlobal, nameSpaceName, {
    value: makeTheJuice()
  });
  OJ.register('global', thisGlobal);
  thisDocument = {};
  if (typeof document !== 'undefined') {
    thisDocument = document;
  }
  OJ.register('document', thisDocument);
  return OJ.register('noop', function() {});
})((typeof global !== 'undefined' && global ? global : (typeof self !== 'undefined' && self ? self : (typeof window !== 'undefined' && window ? window : this))));



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],57:[function(require,module,exports){
(function (global){
(function(OJ) {
  var subNameSpaces;
  subNameSpaces = ['errors', 'enums', 'is', 'instanceOf', 'to', 'nodes', 'db', 'components', 'controls', 'inputs', 'notifications', 'history', 'cookie', 'async'];
  _.each(subNameSpaces, function(name) {
    return OJ.makeSubNameSpace(name);
  });
  OJ['GENERATE_UNIQUE_IDS'] = false;
  OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] = 'div';
  OJ['TRACK_ON_ERROR'] = false;
  OJ['LOG_ALL_AJAX'] = false;
  OJ['LOG_ALL_AJAX_ERRORS'] = false;
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],58:[function(require,module,exports){
(function (global){
(function(OJ) {
  var array2D;
  array2D = function(initLength, initWidth) {
    var array, extend, maxLength, maxWidth, ret;
    array = [];
    maxLength = 0;
    maxWidth = 0;
    ret = {
      get: function(rowNo, colNo) {
        return extend(rowNo, colNo);
      },
      set: function(rowNo, colNo, val) {
        var colIdx, rowIdx;
        ret.get(rowNo, colNo);
        rowIdx = rowNo - 1;
        colIdx = colNo - 1;
        return array[rowIdx][colIdx] = val;
      },
      each: function(callBack) {
        return _.each(array, function(columns, row) {
          return _.each(array[row], function(val, col) {
            var colIdx, rowIdx;
            rowIdx = row + 1;
            colIdx = col + 1;
            return callBack(rowIdx, colIdx, val);
          });
        });
      },
      width: function() {
        return maxWidth;
      },
      length: function() {
        return maxLength;
      }
    };

    /*
    Guarantee that the dimensions of the array are always backed by values at every position
     */
    extend = function(length, width) {
      var i, tryRow;
      if (!length || length < 1) {
        length = 1;
      }
      if (!width || width < 1) {
        width = 1;
      }
      if (maxLength < length) {
        maxLength = length;
      }
      if (array.length > maxLength) {
        maxLength = array.length;
      }
      if (maxWidth < width) {
        maxWidth = width;
      }
      i = 0;
      while (i < maxLength) {
        tryRow = array[i];
        if (!tryRow) {
          tryRow = [];
          array.push(tryRow);
        }
        if (maxWidth < tryRow.length) {
          maxWidth = tryRow.length;
        }
        if (tryRow.length < maxWidth) {
          tryRow.length = maxWidth;
        }
        i += 1;
      }
      return array[length - 1][width - 1];
    };
    extend(initLength, initWidth);
    return ret;
  };
  OJ.register('array2D', array2D);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],59:[function(require,module,exports){
(function (global){
var __slice = [].slice;

(function(OJ) {
  var console, methodLength, methods;
  methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'memory', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'timeline', 'timelineEnd', 'trace', 'warn'];
  methodLength = methods.length;
  console = OJ.global.console || {};
  OJ.makeSubNameSpace('console');

  /*
  1. Stub out any missing methods with noop
  2. Define the available methods on the OJ.console object
   */
  while (methodLength--) {
    (function() {
      var method;
      method = methods[methodLength];
      if (!console[method]) {
        console[method] = OJ.noop;
      }
      return OJ.console.register(method, function() {
        var params;
        params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return console[method].apply(console, params);
      });
    })();
  }
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],60:[function(require,module,exports){
(function (global){
(function(OJ) {

  /*
  Setup settings
  $.cookie.raw = true
  $.cookie.json = true
  
  Setup defaults
  https://github.com/carhartl/jquery-cookie/
  $.cookie.defaults.expires = 365
  $.cookie.defaults.path = '/'
  $.cookie.defaults.domain = 'oj.com'
   */
  var cookies;
  if (!$ || !$.cookie) {
    throw new Error('jQuery Cookie is a required dependency.');
  }
  $.cookie.defaults.secure = false;
  cookies = {};
  OJ.cookie.register('get', function(cookieName, type) {
    var ret;
    ret = '';
    if (cookieName) {
      if (type) {
        ret = $.cookie(cookieName, type);
      } else {
        ret = $.cookie(cookieName);
      }
      if (ret) {
        return cookies[cookieName] = ret;
      }
    }
  });
  OJ.cookie.register('all', function() {
    var ret;
    ret = $.cookie();
    return ret;
  });
  OJ.cookie.register('set', function(cookieName, value, opts) {
    var ret;
    ret = '';
    if (cookieName) {
      cookies[cookieName] = value;
      if (opts) {
        ret = $.cookie(cookieName, value, opts);
      } else {
        ret = $.cookie(cookieName, value);
      }
    }
    return ret;
  });
  OJ.cookie.register('delete', function(cookieName, opts) {
    if (cookieName) {
      if (opts) {
        $.removeCookie(cookieName, opts);
      } else {
        $.removeCookie(cookieName);
      }
      delete cookies[cookieName];
    }
  });
  OJ.cookie.register('deleteAll', function() {
    cookies = {};
    OJ.each(OJ.cookie.all, function(val, key) {
      return OJ.cookie["delete"](key);
    });
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],61:[function(require,module,exports){
(function (global){
(function(OJ) {
  var defer;
  defer = function(method, waitMs) {
    if (setTimeout) {
      return setTimeout(method, waitMs);
    }
  };
  OJ.register('defer', defer);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],62:[function(require,module,exports){
(function (global){
(function(OJ) {
  var canEach, each;
  canEach = function(obj) {
    return OJ.is.plainObject(obj) || OJ.is.object(obj) || OJ.is.array(obj);
  };
  each = function(obj, onEach, recursive) {
    if (canEach(obj)) {
      _.forOwn(obj, function(val, key) {
        var quit;
        if (onEach && (val || key)) {
          quit = onEach(val, key);
          if (false === quit) {
            return false;
          }
        }
        if (true === recursive) {
          each(val, onEach, true);
        }
      });
    }
  };
  OJ.register('each', each);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],63:[function(require,module,exports){
(function (global){
(function(OJ) {
  'use strict';
  OJ.enums.register('unknown', 'unknown');
  OJ.enums.register('inputTypes', {
    button: {
      id: 0,
      name: 'button',
      placeholder: false,
      autocomplete: false,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '',
      defaultsize: '25'
    },
    checkbox: {
      id: 1,
      name: 'checkbox',
      placeholder: false,
      autocomplete: false,
      value: {
        required: true,
        allowed: true
      },
      defaultwidth: '',
      defaultsize: '25'
    },
    color: {
      id: 2,
      name: 'color',
      placeholder: false,
      autocomplete: true,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '',
      defaultsize: '25'
    },
    date: {
      id: 3,
      name: 'date',
      placeholder: false,
      autocomplete: true,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '200px',
      defaultsize: '25'
    },
    datetime: {
      id: 4,
      name: 'datetime',
      placeholder: false,
      autocomplete: false,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '200px',
      defaultsize: '25'
    },
    'datetime-local': {
      id: 5,
      name: 'datetime-local',
      placeholder: false,
      autocomplete: true,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '200px',
      defaultsize: '25'
    },
    email: {
      id: 6,
      name: 'email',
      placeholder: true,
      autocomplete: true,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '200px',
      defaultsize: '25'
    },
    file: {
      id: 7,
      name: 'file',
      placeholder: false,
      autocomplete: false,
      value: {
        required: false,
        allowed: false
      },
      defaultwidth: '',
      defaultsize: '25'
    },
    hidden: {
      id: 8,
      name: 'hidden',
      placeholder: false,
      autocomplete: false,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '',
      defaultsize: '25'
    },
    image: {
      id: 9,
      name: 'image',
      placeholder: false,
      autocomplete: false,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '',
      defaultsize: '25'
    },
    month: {
      id: 10,
      name: 'month',
      placeholder: false,
      autocomplete: false,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '',
      defaultsize: '25'
    },
    number: {
      id: 11,
      name: 'number',
      placeholder: false,
      autocomplete: false,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '200px',
      defaultsize: '25'
    },
    password: {
      id: 12,
      name: 'password',
      placeholder: true,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '200px',
      defaultsize: '25'
    },
    radio: {
      id: 13,
      name: 'radio',
      placeholder: false,
      autocomplete: false,
      value: {
        required: true,
        allowed: true
      },
      defaultwidth: '',
      defaultsize: '25'
    },
    range: {
      id: 14,
      name: 'range',
      placeholder: false,
      autocomplete: true,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '',
      defaultsize: '25'
    },
    reset: {
      id: 15,
      name: 'reset',
      placeholder: false,
      autocomplete: false,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '',
      defaultsize: '25'
    },
    search: {
      id: 16,
      name: 'search',
      placeholder: true,
      autocomplete: true,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '',
      defaultsize: '25'
    },
    submit: {
      id: 17,
      name: 'submit',
      placeholder: false,
      autocomplete: false,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '',
      defaultsize: '25'
    },
    tel: {
      id: 18,
      name: 'button',
      placeholder: true,
      autocomplete: true,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '',
      defaultsize: '25'
    },
    text: {
      id: 19,
      name: 'text',
      placeholder: true,
      autocomplete: true,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '200px',
      defaultsize: '25'
    },
    time: {
      id: 20,
      name: 'time',
      placeholder: false,
      autocomplete: true,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '200px',
      defaultsize: '25'
    },
    url: {
      id: 21,
      name: 'url',
      placeholder: true,
      autocomplete: true,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '200px',
      defaultsize: '25'
    },
    week: {
      id: 22,
      name: 'week',
      placeholder: false,
      autocomplete: false,
      value: {
        required: false,
        allowed: true
      },
      defaultwidth: '',
      defaultsize: '25'
    }
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],64:[function(require,module,exports){
(function (global){
(function(OJ) {
  var onError;
  if (OJ.TRACK_ON_ERROR) {
    onError = OJ.global.onerror;

    /*
    Log errors to the console
     */
    OJ.global.onerror = function(msg, url, lineNumber) {
      var ret;
      ret = false;
      OJ.console.warn("%s\r url: %s\r line: %d", msg, url, lineNumber);
      if (onError) {
        ret = onError(msg, url, lineNumber);
      }
      return ret;
    };
  }
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],65:[function(require,module,exports){
(function (global){
(function(OJ) {
  var eventInfo, eventName;
  if (OJ.global.addEventListener) {
    eventName = 'addEventListener';
    eventInfo = '';
  } else {
    eventName = 'attachEvent';
    eventInfo = 'on';
  }
  OJ.history.register('pushState', function(pageName, event) {
    if (pageName) {
      history.pushState(null, null, '#' + pageName);
      if (event) {
        if (event.preventDefault) {
          event.preventDefault();
        } else {
          event.returnValue = false;
        }
      }
    }
    return false;
  });
  OJ.history.register('restoreState', function(location) {
    var pageName;
    pageName = location.hash;
    if (!pageName) {
      pageName = location.href.split('#')[1];
    }
    if (pageName) {
      pageName = pageName.replace('#', '');
      OJ.publish('restoreState', {
        pageName: pageName,
        location: location
      });
    }
  });

  /* 
  hang on the event, all references in this document
   */

  /*
   * This binds to the document click event, which in turn attaches to every click event, causing unexpected behavior.
   * For any control which wishes to trigger a state change in response to an event, it is better for that control to define the behavior.
  OJ.document[eventName] eventInfo + 'click', ((event) ->
    event = event or window.event
    target = event.target or event.srcElement
    
     * looking for all the links with 'ajax' class found
    if target and target.nodeName is 'A' and (' ' + target.className + ' ').indexOf('ajax') >= 0
      OJ.pushState target.href, event
      
    event.preventDefault()
    event.stopPropagation()
  ), false
   */

  /*
  hang on popstate event triggered by pressing back/forward in browser
   */
  OJ.global[eventName](eventInfo + 'popstate', (function(event) {

    /*
    Note, this is the only difference when using this library,
    because the object document.location cannot be overriden,
    so library the returns generated 'location' object within
    an object window.history, so get it out of 'history.location'.
    For browsers supporting 'history.pushState' get generated
    object 'location' with the usual 'document.location'.
     */
    var returnLocation;
    returnLocation = history.location || document.location;

    /*
    here can cause data loading, etc.
     */
    OJ.history.restoreState(returnLocation);
  }), false);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],66:[function(require,module,exports){
(function (global){
(function(OJ) {
  OJ.is.register('bool', function(boolean) {
    return _.isBoolean(boolean);
  });
  OJ.is.register('arrayNullOrEmpty', function(arr) {
    return _.isEmpty(arr);
  });
  OJ.is.register('stringNullOrEmpty', function(str) {
    return str && (!str.length || str.length === 0 || !str.trim || !str.trim());
  });
  OJ.is.register('numberNullOrEmpty', function(num) {
    return !num || isNaN(num) || !num.toPrecision;
  });
  OJ.is.register('dateNullOrEmpty', function(dt) {
    return !dt || !dt.getTime;
  });
  OJ.is.register('objectNullOrEmpty', function(obj) {
    return _.isEmpty(obj || !Object.keys(obj) || Object.keys(obj).length === 0);
  });
  OJ.is.register('plainObject', function(obj) {
    return _.isPlainObject(obj);
  });
  OJ.is.register('object', function(obj) {
    return _.isObject(obj);
  });
  OJ.is.register('date', function(dt) {
    return _.isDate(dt);
  });

  /*
  Determines if a value is an instance of a Number and not NaN*
   */
  OJ.is.register('number', function(num) {
    return typeof num === 'number' && false === (OJ.number.isNaN(num) || false === OJ.number.isFinite(num) || OJ.number.MAX_VALUE === num || OJ.number.MIN_VALUE === num);
  });

  /*
  Determines if a value is convertable to a Number
   */
  OJ.is.register('numeric', function(num) {
    var nuNum, ret;
    ret = OJ.is.number(num);
    if (!ret) {
      nuNum = OJ.to.number(num);
      ret = OJ.is.number(nuNum);
    }
    return ret;
  });
  OJ.is.register('vendorObject', function(obj) {
    var ret;
    ret = obj instanceof OJ['?'];
    return ret;
  });
  OJ.is.register('elementInDom', function(elementId) {
    return false === OJ.is.nullOrEmpty(document.getElementById(elementId));
  });
  OJ.is.register('generic', function(obj) {
    var ret;
    ret = false === OJ.is.method(obj) && false === OJ.hasLength(obj) && false === OJ.is.plainObject(obj);
    return ret;
  });
  OJ.is.register('array', function(obj) {
    return _.isArray(obj);
  });
  OJ.is.register('string', function(str) {
    return _.isString(str);
  });
  OJ.is.register('true', function(obj) {
    return obj === true || obj === 'true' || obj === 1 || obj === '1';
  });
  OJ.is.register('false', function(obj) {
    return obj === false || obj === 'false' || obj === 0 || obj === '0';
  });
  OJ.is.register('trueOrFalse', function(obj) {
    return OJ.is["true"](obj || OJ.is["false"](obj));
  });
  OJ.is.register('nullOrEmpty', function(obj, checkLength) {
    return _.isEmpty(obj) || _.isUndefined(obj) || _.isNull(obj) || _.isNaN(obj);
  });
  OJ.is.register('nullOrUndefined', function(obj, checkLength) {
    return _.isUndefined(obj) || _.isNull(obj) || _.isNaN(obj);
  });
  OJ.is.register('instanceof', function(name, obj) {
    return obj.type === name || obj instanceof name;
  });
  OJ.is.register('method', function(obj) {
    return obj !== OJ.noop && _.isFunction(obj);
  });

  /*
  Deprecated. Left for backwards compatibility. Use is.method instead.
   */
  OJ.is.register('func', OJ.is.method);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],67:[function(require,module,exports){
(function (global){
(function(OJ) {
  var friendlyName;
  friendlyName = 'noty';
  OJ.notifications.register(friendlyName, function(options, owner) {
    var defaults, ret;
    defaults = {
      layout: 'topRight',
      theme: 'defaultTheme',
      type: 'alert',
      text: '',
      dismissQueue: true,
      template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
      animation: {
        open: {
          height: 'toggle'
        },
        close: {
          height: 'toggle'
        },
        easing: 'swing',
        speed: 500
      },
      timeout: 5000,
      force: false,
      modal: false,
      maxVisible: 5,
      killer: false,
      closeWith: ['click'],
      callback: {
        onShow: OJ.noop,
        afterShow: OJ.noop,
        onClose: OJ.noop,
        afterClose: OJ.noop
      },
      buttons: false
    };
    OJ.extend(defaults, options, true);
    ret = noty(defaults);
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],68:[function(require,module,exports){
(function (global){
(function(OJ) {
  var events, getEventName, publish, subscribe, subscribers, tokens, unsubscribe, unsubscribeAll, unsubscribeEvent;
  tokens = {};
  subscribers = [];
  events = {};
  getEventName = function(event) {
    return event.toUpperCase().replace(' ', '_');
  };
  subscribe = function(event, method) {
    var eventName, token;
    eventName = getEventName(event);
    if (!events[eventName]) {
      events[eventName] = [];
    }
    token = PubSub.subscribe(eventName, method);
    tokens[token] = token;
    subscribers.push(method);
    events[eventName].push(method);
    return token;
  };
  publish = function(event, data) {
    var eventName;
    eventName = getEventName(event);
    if (events[eventName]) {
      PubSub.publish(eventName, data);
    } else {
      OJ.console.info('Event named {' + event + '} is not recognized.');
    }
  };
  unsubscribe = function(tokenOrMethod) {
    if (OJ.is.method(tokenOrMethod)) {
      if (-1 !== subscribers.indexOf(tokenOrMethod)) {
        PubSub.unsubscribe(tokenOrMethod);
        subscribers = _.remove(subscribers, function(method) {
          return method === tokenOrMethod;
        });
      } else {
        OJ.console.info('Event method is not recognized.');
      }
    } else {
      if (tokens[tokenOrMethod]) {
        PubSub.unsubscribe(tokenOrMethod);
        delete tokens[tokenOrMethod];
      }
    }
  };
  unsubscribeAll = function() {
    OJ.each(tokens, function(token) {
      return unsubscribe(token);
    });
    subscribers = [];
    events = {};
  };
  unsubscribeEvent = function(event) {
    var eventName;
    eventName = getEventName(event);
    if (events[eventName]) {
      OJ.each(events[eventName], function(method) {
        return unsubscribe(method);
      });
    } else {
      OJ.console.info('Event named {' + event + '} is not recognized.');
    }
    delete events[eventName];
  };
  OJ.register('publish', publish);
  OJ.register('subscribe', subscribe);
  OJ.register('unsubscribe', unsubscribe);
  OJ.register('unsubscribeAll', unsubscribeAll);
  OJ.register('unsubscribeEvent', unsubscribeEvent);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],69:[function(require,module,exports){
(function (global){
(function(OJ) {

  /*
  http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
   */
  OJ.register('queryString', function(param) {
    var i, params, prm, ret;
    ret = {};
    if (OJ.global.location) {
      params = OJ.global.location.search.substr(1).split('&');
      if (params) {
        i = 0;
        while (i < params.length) {
          prm = params[i].split('=');
          if (prm.length === 2) {
            ret[prm[0]] = OJ.global.decodeURIComponent(prm[1].replace(/\+/g, " "));
          }
          i += 1;
        }
      }
    }
    return ret;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],70:[function(require,module,exports){
(function (global){
var __slice = [].slice;

(function(OJ) {
  var rangeToSubRanges, stringRangeToSubRanges;
  OJ.register('range', function() {
    var params;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.range.apply(_, params);
  });
  OJ.register('rangeMin', function() {
    var params;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.min.apply(_, params);
  });
  OJ.register('rangeMax', function() {
    var params;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.max.apply(_, params);
  });

  /*
  Take an array of string values and a number of partitions to create.
  Uses the first letter of each string value in the array to convert to unique code character (lower case)
  Builds a int range based on unique code chars.
   */
  stringRangeToSubRanges = function(n, range) {
    var charRange, i, oldGetRange, ret, subRange;
    if (n == null) {
      n = 6;
    }
    if (range == null) {
      range = [];
    }
    charRange = [];
    OJ.each(range, function(val) {
      var char;
      char = val.trim()[0].toLowerCase();
      if (false === OJ.contains(charRange, char)) {
        return charRange.push(char.charCodeAt());
      }
    });
    ret = rangeToSubRanges(n, charRange);
    i = 0;
    while (i < n) {
      i += 1;
      subRange = ret[i];
      subRange.map(String.fromCharCode);
    }
    oldGetRange = ret.getRange;
    ret.getRange = function(val) {
      var char, idx;
      char = val.trim()[0].toLowerCase().charCodeAt();
      idx = oldGetRange(char);
      return idx;
    };
    return ret;
  };

  /*
  Take an array of int values and a number of partitions to create.
  Divides the original array into the specified number of sub arrays.
  Overflow is passed to the final partition.
   */
  rangeToSubRanges = function(n, range) {
    var chunkVal, distance, i, jump, map, rangeHigh, rangeLow, ret, subRange, subRangeSize, subRanges;
    if (n == null) {
      n = 6;
    }
    if (range == null) {
      range = [];
    }
    ret = OJ.object();
    rangeLow = OJ.rangeMin(range);
    rangeHigh = OJ.rangeMax(range);
    distance = rangeHigh - rangeLow;
    subRangeSize = distance / n;
    subRanges = ret.add('ranges', OJ.object());
    chunkVal = rangeLow;
    map = OJ.object();
    i = 0;
    while (i < n) {
      i += 1;
      if (i < n) {
        jump = Math.round(subRangeSize);
      } else {
        jump = Math.floor(subRangeSize);
        if (chunkVal + jump <= rangeHigh) {
          jump += rangeHigh - chunkVal - jump + 1;
        }
      }
      subRange = OJ.range(chunkVal, chunkVal + jump);
      OJ.each(subRange, function(val) {
        return map.add(val, i);
      });
      subRanges[i] = subRange;
      chunkVal += jump;
    }
    ret.add('getRange', function(val) {
      return map[val];
    });
    return ret;
  };
  OJ.register('stringRangeToSubRanges', stringRangeToSubRanges);
  OJ.register('rangeToSubRanges', rangeToSubRanges);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],71:[function(require,module,exports){
(function (global){
(function(OJ) {
  OJ.to.register('bool', function(str) {
    var retBool;
    retBool = OJ.is['true'](str);
    if (retBool === false || retBool !== true) {
      retBool = false;
    }
    return retBool;
  });
  OJ.to.register('ES5_ToBool', function(val) {
    return val !== false && val !== 0 && val !== '' && val !== null && val !== undefined && (typeof val !== 'number' || !isNaN(val));
  });
  OJ.to.register('dateFromTicks', function(tickStr) {
    var arr, localOffset, offset, ret, ticks, ticsDateTime;
    ticsDateTime = OJ.to.string(tickStr);
    ret = void 0;
    ticks = void 0;
    offset = void 0;
    localOffset = void 0;
    arr = void 0;
    if (false === OJ.is.nullOrEmpty(ticsDateTime)) {
      ticsDateTime = ticsDateTime.replace('/', '');
      ticsDateTime = ticsDateTime.replace('Date', '');
      ticsDateTime = ticsDateTime.replace('(', '');
      ticsDateTime = ticsDateTime.replace(')', '');
      arr = ticsDateTime.split('-');
      if (arr.length > 1) {
        ticks = OJ.to.number(arr[0]);
        offset = OJ.to.number(arr[1]);
        localOffset = new Date().getTimezoneOffset();
        ret = new Date(ticks - ((localOffset + (offset / 100 * 60)) * 1000));
      } else if (arr.length === 1) {
        ticks = OJ.to.number(arr[0]);
        ret = new Date(ticks);
      }
    }
    return ret;
  });
  OJ.to.register('binary', function(obj) {
    var ret;
    ret = NaN;
    if (obj === 0 || obj === '0' || obj === '' || obj === false || OJ.to.string(obj).toLowerCase().trim() === 'false') {
      ret = 0;
    } else {
      if (obj === 1 || obj === '1' || obj === true || OJ.to.string(obj).toLowerCase().trim() === 'true') {
        ret = 1;
      }
    }
    return ret;
  });
  OJ.to.register('number', function(inputNum, defaultNum) {
    var retVal, tryGetNumber;
    tryGetNumber = function(val) {
      var ret, tryGet;
      ret = NaN;
      if (OJ.is.number(val)) {
        ret = val;
      } else if (OJ.is.string(val) || OJ.is.bool(val)) {
        tryGet = function(value) {
          var num;
          num = OJ.to.binary(value);
          if (!OJ.is.number(num) && value) {
            num = +value;
          }
          if (!OJ.is.number(num)) {
            num = _.parseInt(value, 0);
          }
          return num;
        };
        ret = tryGet(val);
      }
      return ret;
    };
    retVal = tryGetNumber(inputNum);
    if (!OJ.is.number(retVal)) {
      retVal = tryGetNumber(defaultNum);
      if (!OJ.is.number(retVal)) {
        retVal = Number.NaN;
      }
    }
    return retVal;
  });
  OJ.to.register('string', function(inputStr, defaultStr) {
    var ret1, ret2, retVal, tryGetString;
    tryGetString = function(str) {
      var ret;
      ret = void 0;
      if (OJ.is.string(str)) {
        ret = str;
      } else {
        ret = '';
        if (OJ.is.bool(str) || OJ.is.number(str) || OJ.is.date(str)) {
          ret = str.toString();
        }
      }
      return ret;
    };
    ret1 = tryGetString(inputStr);
    ret2 = tryGetString(defaultStr);
    retVal = '';
    if (ret1.length !== 0) {
      retVal = ret1;
    } else if (ret1 === ret2 || ret2.length === 0) {
      retVal = ret1;
    } else {
      retVal = ret2;
    }
    return retVal;
  });
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],72:[function(require,module,exports){
(function (global){
(function(OJ) {

  /*
  Generates a random string that complies to the RFC 4122 specification for GUID/UUID.
  (e.g. 'B42A153F-1D9A-4F92-9903-92C11DD684D2')
  While not a true UUID, for the purposes of this application, it should be sufficient.
   */
  var createFauxUUID;
  createFauxUUID = function() {
    var hexDigits, i, s, uuid;
    s = [];
    s.length = 36;
    hexDigits = "0123456789abcdef";
    i = 0;
    while (i < 36) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      i += 1;
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    uuid = s.join("");
    return uuid;
  };
  OJ.register("createUUID", createFauxUUID);
})((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbnRyeXBvaW50LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcYXN5bmNcXGFqYXguY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxhc3luY1xccHJvbWlzZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXGdyaWQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb21wb25lbnRzXFxpbnB1dGdyb3VwLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGFicy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXHRpbGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb250cm9sc1xcaWNvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGRhdGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxmdW5jdGlvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG51bWJlci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG9iamVjdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXHByb3BlcnR5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxcc3RyaW5nLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxjb21wb25lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGNvbnRyb2wuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGRvbS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZWxlbWVudC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZnJhZ21lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGdlbmVyaWNzLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxpbnB1dC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcbm9kZUZhY3RvcnkuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcYS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxici5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxmb3JtLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXG9sLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHNlbGVjdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0YWJsZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0ZXh0YXJlYS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0aGVhZC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx1bC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcYnV0dG9uaW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGNoZWNrYm94LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxjb2xvci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZXRpbWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGRhdGV0aW1lbG9jYWwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGVtYWlsLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxmaWxlLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxoaWRkZW4uY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGltYWdlaW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXG1vbnRoLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxudW1iZXIuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHBhc3N3b3JkLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxyYWRpby5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xccmFuZ2UuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJlc2V0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxzZWFyY2guY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHN1Ym1pdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdGVsLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx0ZXh0aW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHRpbWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHVybC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcd2Vlay5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXG9qLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcb2pJbml0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGFycmF5MkQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcY29uc29sZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxjb29raWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZGVmZXIuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZWFjaC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlbnVtcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlcnJvci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxoaXN0b3J5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGlzLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXG5vdHkuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xccHVic3ViLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHF1ZXJ5U3RyaW5nLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHJhbmdlcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFx0by5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFx1dWlkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE9BQUEsQ0FBUSxhQUFSLENBQUEsQ0FBQTs7QUFBQSxPQUNBLENBQVEsaUJBQVIsQ0FEQSxDQUFBOztBQUFBLE9BRUEsQ0FBUSxxQkFBUixDQUZBLENBQUE7O0FBQUEsT0FHQSxDQUFRLHdCQUFSLENBSEEsQ0FBQTs7QUFBQSxPQUlBLENBQVEsMEJBQVIsQ0FKQSxDQUFBOztBQUFBLE9BS0EsQ0FBUSxnQ0FBUixDQUxBLENBQUE7O0FBQUEsT0FNQSxDQUFRLDBCQUFSLENBTkEsQ0FBQTs7QUFBQSxPQU9BLENBQVEsMEJBQVIsQ0FQQSxDQUFBOztBQUFBLE9BUUEsQ0FBUSx3QkFBUixDQVJBLENBQUE7O0FBQUEsT0FTQSxDQUFRLG9CQUFSLENBVEEsQ0FBQTs7QUFBQSxPQVVBLENBQVEsd0JBQVIsQ0FWQSxDQUFBOztBQUFBLE9BV0EsQ0FBUSxzQkFBUixDQVhBLENBQUE7O0FBQUEsT0FZQSxDQUFRLHNCQUFSLENBWkEsQ0FBQTs7QUFBQSxPQWFBLENBQVEsd0JBQVIsQ0FiQSxDQUFBOztBQUFBLE9BY0EsQ0FBUSxzQkFBUixDQWRBLENBQUE7O0FBQUEsT0FlQSxDQUFRLHdCQUFSLENBZkEsQ0FBQTs7QUFBQSxPQWdCQSxDQUFRLHNCQUFSLENBaEJBLENBQUE7O0FBQUEsT0FpQkEsQ0FBUSxrQkFBUixDQWpCQSxDQUFBOztBQUFBLE9Ba0JBLENBQVEsc0JBQVIsQ0FsQkEsQ0FBQTs7QUFBQSxP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LFNBYk8sRUFjUCxRQWRPLEVBZVAsTUFmTyxFQWdCUCxNQWhCTyxFQWlCUCxVQWpCTyxFQWtCUCxVQWxCTyxFQW1CUCxJQW5CTyxFQW9CUCxLQXBCTyxFQXFCUCxTQXJCTyxFQXNCUCxLQXRCTyxFQXVCUCxLQXZCTyxFQXdCUCxLQXhCTyxFQXlCUCxJQXpCTyxFQTBCUCxJQTFCTyxFQTJCUCxJQTNCTyxFQTRCUCxVQTVCTyxFQTZCUCxZQTdCTyxFQThCUCxRQTlCTyxFQStCUCxNQS9CTyxFQWdDUCxRQWhDTyxFQWlDUCxJQWpDTyxFQWtDUCxJQWxDTyxFQW1DUCxJQW5DTyxFQW9DUCxJQXBDTyxFQXFDUCxJQXJDTyxFQXNDUCxJQXRDTyxFQXVDUCxNQXZDTyxFQXdDUCxRQXhDTyxFQXlDUCxRQXpDTyxFQTBDUCxNQTFDTyxFQTJDUCxHQTNDTyxFQTRDUCxRQTVDTyxFQTZDUCxLQTdDTyxFQThDUCxLQTlDTyxFQStDUCxPQS9DTyxFQWdEUCxRQWhETyxFQWlEUCxJQWpETyxFQWtEUCxLQWxETyxFQW1EUCxNQW5ETyxFQW9EUCxNQXBETyxFQXFEUCxPQXJETyxFQXNEUCxLQXRETyxFQXVEUCxVQXZETyxFQXdEUCxVQXhETyxFQXlEUCxRQXpETyxFQTBEUCxVQTFETyxFQTJEUCxRQTNETyxFQTREUCxRQTVETyxFQTZEUCxHQTdETyxFQThEUCxLQTlETyxFQStEUCxVQS9ETyxFQWdFUCxHQWhFTyxFQWlFUCxJQWpFTyxFQWtFUCxJQWxFTyxFQW1FUCxNQW5FTyxFQW9FUCxHQXBFTyxFQXFFUCxNQXJFTyxFQXNFUCxTQXRFTyxFQXVFUCxPQXZFTyxFQXdFUCxNQXhFTyxFQXlFUCxRQXpFTyxFQTBFUCxRQTFFTyxFQTJFUCxPQTNFTyxFQTRFUCxLQTVFTyxFQTZFUCxTQTdFTyxFQThFUCxLQTlFTyxFQStFUCxPQS9FTyxFQWdGUCxJQWhGTyxFQWlGUCxPQWpGTyxFQWtGUCxJQWxGTyxFQW1GUCxNQW5GTyxFQW9GUCxPQXBGTyxFQXFGUCxJQXJGTyxFQXNGUCxJQXRGTyxFQXVGUCxHQXZGTyxFQXdGUCxLQXhGTyxFQXlGUCxPQXpGTyxFQTBGUCxLQTFGTyxDQUFULENBQUE7QUFBQSxFQTRGQSxJQUFBLEdBQU8sMkVBQTJFLENBQUMsS0FBNUUsQ0FBa0YsR0FBbEYsQ0E1RlAsQ0FBQTtBQUFBLEVBNkZBLEdBQUEsR0FBTSxNQUFNLENBQUMsTUFBUCxDQUFjLElBQWQsQ0E3Rk4sQ0FBQTtBQStGQSxRQUNLLFNBQUMsR0FBRCxHQUFBO1dBQ0QsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLEdBQWxCLEVBQXVCLFNBQUMsT0FBRCxFQUFVLEtBQVYsRUFBMkIsaUJBQTNCLEdBQUE7QUFFckIsVUFBQSxhQUFBOztRQUYrQixRQUFRLEVBQUUsQ0FBQztPQUUxQzs7UUFGZ0Qsb0JBQW9CO09BRXBFO0FBQUEsTUFBQSxRQUFBLEdBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsUUFDQSxNQUFBLEVBQVEsRUFEUjtBQUFBLFFBRUEsTUFBQSxFQUFRLEVBRlI7T0FERixDQUFBO0FBQUEsTUFLQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsS0FBN0IsQ0FMQSxDQUFBO0FBQUEsTUFNQSxHQUFBLEdBQU0sRUFBRSxDQUFDLE9BQUgsQ0FBVyxHQUFYLEVBQWdCLFFBQVEsQ0FBQyxLQUF6QixFQUFnQyxRQUFRLENBQUMsTUFBekMsRUFBaUQsUUFBUSxDQUFDLE1BQTFELEVBQWtFLFFBQVEsQ0FBQyxJQUEzRSxDQU5OLENBQUE7QUFTQSxNQUFBLElBQUcsS0FBQSxLQUFTLGlCQUFaO0FBQW1DLFFBQUEsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFULENBQWlCLEdBQWpCLEVBQXNCLEtBQXRCLENBQUEsQ0FBbkM7T0FUQTthQVdBLElBYnFCO0lBQUEsQ0FBdkIsRUFEQztFQUFBLENBREw7QUFBQSxPQUFBLDBDQUFBO3VCQUFBO0FBQ0UsUUFBVSxTQUFWLENBREY7QUFBQSxHQWhHQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0ZBLENBQUcsU0FBQyxFQUFELEdBQUE7QUFFRDtBQUFBOztLQUFBO0FBQUEsTUFBQSxLQUFBO0FBQUEsRUFHQSxLQUFBLEdBQVEsU0FBQyxPQUFELEVBQXdCLEtBQXhCLEdBQUE7QUFDTixRQUFBLEdBQUE7O01BRE8sVUFBVSxFQUFFLENBQUMsTUFBSCxDQUFBO0tBQ2pCO0FBQUEsSUFBQSxJQUFHLENBQUEsS0FBSDtBQUFrQixZQUFVLElBQUEsS0FBQSxDQUFNLHlDQUFOLENBQVYsQ0FBbEI7S0FBQTtBQUNBLElBQUEsSUFBRyxDQUFBLE9BQVcsQ0FBQyxLQUFaLElBQXFCLENBQUEsT0FBVyxDQUFDLEtBQUssQ0FBQyxJQUExQztBQUFvRCxZQUFVLElBQUEsS0FBQSxDQUFNLDhDQUFOLENBQVYsQ0FBcEQ7S0FEQTtBQUFBLElBRUEsR0FBQSxHQUFNLEtBQUssQ0FBQyxJQUFOLENBQVcsT0FBWCxFQUFvQixPQUFwQixDQUZOLENBQUE7QUFBQSxJQUdBLEdBQUcsQ0FBQyxHQUFKLENBQVEsV0FBUixFQUFxQixPQUFPLENBQUMsS0FBSyxDQUFDLElBQW5DLENBSEEsQ0FBQTtXQUlBLElBTE07RUFBQSxDQUhSLENBQUE7QUFBQSxFQVVBLEVBQUUsQ0FBQyxRQUFILENBQVksT0FBWixFQUFxQixLQUFyQixDQVZBLENBRkM7QUFBQSxDQUFBLENBQUgsQ0FBUyxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQW5CLElBQW1DLE1BQXRDLEdBQWtELE1BQWxELEdBQThELENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBdEIsR0FBdUMsTUFBdkMsR0FBbUQsSUFBcEQsQ0FBL0QsQ0FBeUgsQ0FBQyxFQUFuSSxDQUFBLENBQUE7Ozs7Ozs7QUNBQSxDQUFHLFNBQUMsRUFBRCxHQUFBO0FBRUQsTUFBQSw0R0FBQTtBQUFBLEVBQUEsTUFBQSxHQUFTLHdrQkFBd2tCLENBQUMsS0FBemtCLENBQStrQixHQUEva0IsQ0FBVCxDQUFBO0FBQUEsRUFDQSxJQUFBLEdBQU8sa0dBQWtHLENBQUMsS0FBbkcsQ0FBeUcsR0FBekcsQ0FEUCxDQUFBO0FBQUEsRUFHQSxpQkFBQSxHQUFvQixDQUNsQixLQURrQixFQUVsQixNQUZrQixFQUdsQixJQUhrQixFQUlsQixJQUprQixFQUtsQixJQUxrQixFQU1sQixJQU5rQixFQU9sQixJQVBrQixFQVFsQixJQVJrQixFQVNsQixHQVRrQixFQVVsQixVQVZrQixFQVdsQixRQVhrQixFQVlsQixJQVprQixFQWFsQixJQWJrQixFQWNsQixPQWRrQixDQUhwQixDQUFBO0FBQUEsRUFxQkEsZ0JBQUEsR0FBbUIsQ0FDakIsSUFEaUIsRUFFakIsUUFGaUIsRUFHakIsSUFIaUIsRUFJakIsSUFKaUIsRUFLakIsUUFMaUIsRUFNakIsTUFOaUIsRUFPakIsTUFQaUIsRUFRakIsUUFSaUIsRUFTakIsT0FUaUIsRUFVakIsT0FWaUIsRUFXakIsT0FYaUIsRUFZakIsTUFaaUIsRUFhakIsUUFiaUIsQ0FyQm5CLENBQUE7QUFxQ0E7QUFBQTs7S0FyQ0E7QUFBQSxFQXdDQSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsS0FBbEIsRUFBeUIsU0FBQyxFQUFELEVBQUssT0FBTCxHQUFBO0FBQ3ZCLFFBQUEsZUFBQTs7TUFENEIsVUFBVTtLQUN0QztBQUFBLElBQUEsR0FBQSxHQUFNLElBQU4sQ0FBQTtBQUFBLElBQ0EsRUFBQSxHQUFLLFFBQVEsQ0FBQyxjQUFULENBQXdCLEVBQXhCLENBREwsQ0FBQTtBQUVBLElBQUEsSUFBRyxFQUFIO0FBQ0UsTUFBQSxNQUFBLEdBQVMsRUFBRSxDQUFDLGNBQUgsQ0FBa0IsRUFBbEIsRUFBc0IsT0FBdEIsQ0FBVCxDQURGO0tBRkE7QUFJQSxJQUFBLElBQUcsTUFBSDtBQUNFLE1BQUEsR0FBQSxHQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBVCxDQUFpQixNQUFqQixFQUF5QixJQUF6QixFQUErQixDQUEvQixDQUFOLENBREY7S0FKQTtXQU9BLElBUnVCO0VBQUEsQ0FBekIsQ0F4Q0EsQ0FBQTtBQUFBLEVBa0RBLFNBQUEsR0FBWSxDQUNWLEdBRFUsRUFFVixHQUZVLEVBR1YsSUFIVSxFQUlWLFFBSlUsRUFLVixLQUxVLEVBTVYsSUFOVSxFQU9WLFVBUFUsRUFRVixNQVJVLEVBU1YsSUFUVSxFQVVWLElBVlUsRUFXVixJQVhVLEVBWVYsSUFaVSxFQWFWLElBYlUsRUFjVixJQWRVLEVBZVYsR0FmVSxFQWdCVixLQWhCVSxFQWlCVixPQWpCVSxFQWtCVixPQWxCVSxFQW1CVixRQW5CVSxFQW9CVixJQXBCVSxFQXFCVixLQXJCVSxFQXNCVixJQXRCVSxFQXVCVixRQXZCVSxFQXdCVixHQXhCVSxFQXlCVixRQXpCVSxFQTBCVixNQTFCVSxFQTJCVixRQTNCVSxFQTRCVixLQTVCVSxFQTZCVixLQTdCVSxFQThCVixPQTlCVSxFQStCVixPQS9CVSxFQWdDVixJQWhDVSxFQWlDVixVQWpDVSxFQWtDVixJQWxDVSxFQW1DVixPQW5DVSxFQW9DVixJQXBDVSxFQXFDVixJQXJDVSxDQWxEWixDQUFBO0FBQUEsRUEwRkEsT0FBQSxHQUFVLFNBQUMsT0FBRCxFQUFVLEVBQVYsRUFBYyxLQUFkLEdBQUE7V0FDUixTQUFDLElBQUQsR0FBQTtBQUNFLFVBQUEsVUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLEVBQUUsQ0FBQyxLQUFNLENBQUEsT0FBQSxDQUFULElBQXFCLEVBQUUsQ0FBQyxVQUFXLENBQUEsT0FBQSxDQUFuQyxJQUErQyxFQUFFLENBQUMsUUFBUyxDQUFBLE9BQUEsQ0FBM0QsSUFBdUUsRUFBRSxDQUFDLE1BQU8sQ0FBQSxPQUFBLENBQTFGLENBQUE7QUFDQSxNQUFBLElBQUcsTUFBSDtBQUNFLFFBQUEsRUFBQSxHQUFLLE1BQUEsQ0FBTyxJQUFQLEVBQWEsRUFBYixFQUFpQixJQUFqQixDQUFMLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxFQUFBLEdBQUssRUFBRSxDQUFDLFNBQUgsQ0FBYSxJQUFiLEVBQW1CLEVBQW5CLEVBQXVCLE9BQXZCLENBQUwsQ0FIRjtPQURBO2FBS0EsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFULENBQWlCLEVBQWpCLEVBQXFCLEVBQXJCLEVBQXlCLEtBQXpCLEVBTkY7SUFBQSxFQURRO0VBQUEsQ0ExRlYsQ0FBQTtBQUFBLEVBbUdBLGFBQUEsR0FBZ0IsU0FBQyxFQUFELEVBQUssS0FBTCxHQUFBO0FBQ2QsUUFBQSxPQUFBO0FBQUEsSUFBQSxPQUFBLEdBQVUsRUFBRSxDQUFDLE1BQUgsQ0FBQSxDQUFWLENBQUE7QUFBQSxJQUNBLEVBQUUsQ0FBQyxJQUFILEdBQVUsU0FBQyxPQUFELEVBQVUsSUFBVixHQUFBO0FBQ1IsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsT0FBUSxDQUFBLE9BQUEsQ0FBakIsQ0FBQTtBQUNBLE1BQUEsSUFBRyxDQUFBLE1BQUg7QUFDRSxRQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsT0FBUixFQUFpQixFQUFqQixFQUFxQixLQUFyQixDQUFULENBQUE7QUFBQSxRQUNBLE9BQVEsQ0FBQSxPQUFBLENBQVIsR0FBbUIsTUFEbkIsQ0FERjtPQURBO2FBSUEsTUFBQSxDQUFPLElBQVAsRUFMUTtJQUFBLENBRFYsQ0FBQTtXQU9BLEdBUmM7RUFBQSxDQW5HaEIsQ0FBQTtBQUFBLEVBNkdBLFlBQUEsR0FBZSxTQUFDLEVBQUQsRUFBSyxNQUFMLEVBQWEsS0FBYixHQUFBO0FBQ2IsUUFBQSxFQUFBO0FBQUEsSUFBQSxJQUFHLEVBQUUsQ0FBQyxtQkFBTjtBQUNFLE1BQUEsS0FBQSxJQUFTLENBQVQsQ0FBQTtBQUNBLE1BQUEsSUFBRyxLQUFBLElBQVMsTUFBTSxDQUFDLEtBQW5CO0FBQThCLFFBQUEsS0FBQSxHQUFRLE1BQU0sQ0FBQyxLQUFQLEdBQWUsQ0FBdkIsQ0FBOUI7T0FEQTtBQUFBLE1BRUEsTUFBTSxDQUFDLEtBQVAsR0FBZSxLQUZmLENBQUE7QUFJQSxNQUFBLElBQUcsQ0FBQSxFQUFNLENBQUMsS0FBSCxDQUFBLENBQVA7QUFDRSxRQUFBLEVBQUEsR0FBSyxNQUFNLENBQUMsS0FBUCxDQUFBLENBQUEsSUFBa0IsRUFBdkIsQ0FBQTtBQUFBLFFBQ0EsRUFBQSxJQUFNLEVBQUUsQ0FBQyxPQUFILEdBQWEsS0FEbkIsQ0FBQTtBQUFBLFFBRUEsRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSLEVBQWMsRUFBZCxDQUZBLENBREY7T0FMRjtLQURhO0VBQUEsQ0E3R2YsQ0FBQTtBQXlIQTtBQUFBOztLQXpIQTtBQUFBLEVBNEhBLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBVCxDQUFrQixTQUFsQixFQUE2QixTQUFDLEVBQUQsRUFBSyxNQUFMLEVBQXVCLEtBQXZCLEdBQUE7QUFHM0IsUUFBQSxhQUFBOztNQUhnQyxTQUFTLEVBQUUsQ0FBQztLQUc1Qzs7TUFIa0QsUUFBUSxNQUFNLENBQUMsS0FBUCxJQUFnQjtLQUcxRTtBQUFBLElBQUEsR0FBQSxHQUFNLEVBQU4sQ0FBQTtBQUdBLElBQUEsSUFBRyxDQUFBLEVBQU0sQ0FBQyxXQUFWO0FBR0UsTUFBQSxJQUFHLEVBQUUsQ0FBQyxPQUFILEtBQWdCLE1BQW5CO0FBRUUsUUFBQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEdBQUgsQ0FBTyxFQUFQLEVBQVcsTUFBWCxDQUFOLENBQUE7QUFJQSxRQUFBLElBQUcsQ0FBQSxHQUFPLENBQUMsT0FBWDtBQUNFLFVBQUEsWUFBQSxDQUFhLEVBQWIsRUFBaUIsTUFBakIsRUFBeUIsS0FBekIsQ0FBQSxDQUFBO0FBQUEsVUFDQSxNQUFNLENBQUMsTUFBUCxDQUFjLEdBQUksQ0FBQSxDQUFBLENBQWxCLENBREEsQ0FBQTtBQUFBLFVBR0EsR0FBRyxDQUFDLFVBQUosQ0FBQSxDQUhBLENBQUE7QUFBQSxVQUlBLEdBQUcsQ0FBQyxPQUFKLEdBQWMsSUFKZCxDQURGO1NBSkE7QUFBQSxRQVlBLGFBQUEsQ0FBYyxHQUFkLEVBQW1CLEtBQW5CLENBWkEsQ0FBQTtBQUFBLFFBZUEsR0FBRyxDQUFDLFdBQUosR0FBa0IsSUFmbEIsQ0FBQTtBQUFBLFFBa0JBLFFBQUEsR0FBVyxDQUFDLENBQUMsSUFBRixDQUFPLEdBQUcsQ0FBQyxRQUFKLElBQWdCLEVBQUUsQ0FBQyxJQUExQixDQWxCWCxDQUFBO0FBQUEsUUFtQkEsR0FBRyxDQUFDLFFBQUosR0FBZSxRQW5CZixDQUFBO0FBQUEsUUFvQkEsUUFBQSxDQUFTLEdBQVQsQ0FwQkEsQ0FGRjtPQUhGO0tBSEE7V0ErQkEsSUFsQzJCO0VBQUEsQ0FBN0IsQ0E1SEEsQ0FBQTtBQUFBLEVBZ0tBLFFBQUEsR0FBVyxDQUFFLFNBQUEsR0FBQTtBQUNYLElBQUEsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFSLEdBQWdCLENBQWhCLENBQUE7QUFBQSxJQUNBLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBUixHQUFlLElBRGYsQ0FBQTtBQUFBLElBRUEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxFQUFFLENBQUMsSUFBVixFQUFnQixJQUFoQixDQUZBLENBQUE7QUFBQSxJQUdBLGFBQUEsQ0FBYyxFQUFFLENBQUMsSUFBakIsRUFBdUIsQ0FBdkIsQ0FIQSxDQUFBO1dBSUEsRUFBRSxDQUFDLElBQUksQ0FBQyxXQUFSLEdBQXNCLEtBTFg7RUFBQSxDQUFGLENBQUEsQ0FBQSxDQWhLWCxDQUZDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQ0EsSUFBQSxrQkFBQTs7QUFBQSxDQUFHLFNBQUMsRUFBRCxHQUFBO0FBQ0QsRUFBQSxZQUFBLENBQUE7QUFBQSxNQUFBLFFBQUE7QUFBQSxFQUVBLFFBQUEsR0FBVyxHQUZYLENBQUE7QUFBQSxFQUlBLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBVCxDQUFrQixRQUFsQixFQUE0QixTQUFDLE9BQUQsRUFBVSxLQUFWLEVBQTJCLGlCQUEzQixHQUFBO0FBRTFCLFFBQUEsbURBQUE7O01BRm9DLFFBQVEsRUFBRSxDQUFDO0tBRS9DOztNQUZxRCxvQkFBb0I7S0FFekU7QUFBQSxJQUFBLFFBQUEsR0FDRTtBQUFBLE1BQUEsS0FBQSxFQUNFO0FBQUEsUUFBQSxFQUFBLEVBQUksRUFBSjtBQUFBLFFBQ0EsT0FBQSxFQUFPLEVBRFA7QUFBQSxRQUVBLElBQUEsRUFBTSxFQUZOO0FBQUEsUUFHQSxJQUFBLEVBQU0scUJBSE47QUFBQSxRQUlBLElBQUEsRUFBTSxFQUpOO0FBQUEsUUFLQSxLQUFBLEVBQU8sRUFMUDtBQUFBLFFBTUEsR0FBQSxFQUFLLEVBTkw7QUFBQSxRQU9BLEtBQUEsRUFBTyxFQVBQO0FBQUEsUUFRQSxNQUFBLEVBQVEsRUFSUjtPQURGO0FBQUEsTUFVQSxNQUFBLEVBQVEsRUFWUjtBQUFBLE1BV0EsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7T0FaRjtLQURGLENBQUE7QUFBQSxJQWdCQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FoQkEsQ0FBQTtBQUFBLElBa0JBLFdBQUEsR0FBYyxLQWxCZCxDQUFBO0FBQUEsSUFvQkEsTUFBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsSUFBRyxXQUFBLEtBQWUsSUFBbEI7QUFDRSxRQUFBLFdBQUEsR0FBYyxLQUFkLENBREY7T0FBQSxNQUFBO0FBRUssUUFBQSxJQUF1QixXQUFBLEtBQWUsS0FBdEM7QUFBQSxVQUFBLFdBQUEsR0FBYyxJQUFkLENBQUE7U0FGTDtPQURPO0lBQUEsQ0FwQlQsQ0FBQTtBQTJCQSxJQUFBLElBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFoQixLQUEyQixFQUFFLENBQUMsSUFBakM7QUFDRSxNQUFBLEtBQUEsR0FBUSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQXhCLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxZQUFBLGFBQUE7QUFBQSxRQURVLCtEQUNWLENBQUE7QUFBQSxRQUFBLE1BQUEsQ0FBQSxDQUFBLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxLQUFBLGFBQU0sS0FBTixDQURULENBQUE7QUFFQSxRQUFBLElBQUcsUUFBUSxDQUFDLElBQVQsS0FBaUIsR0FBcEI7QUFBNkIsVUFBQSxNQUFBLEdBQVMsS0FBVCxDQUE3QjtTQUZBO2VBR0EsT0FKUztNQUFBLENBRFgsQ0FBQTtBQUFBLE1BTUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFoQixHQUF3QixRQU54QixDQURGO0tBQUEsTUFBQTtBQVNFLE1BQUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFoQixHQUF3QixNQUF4QixDQVRGO0tBM0JBO0FBQUEsSUFzQ0EsR0FBQSxHQUFNLEVBQUUsQ0FBQyxPQUFILENBQVcsUUFBWCxFQUFxQixRQUFRLENBQUMsS0FBOUIsRUFBcUMsUUFBUSxDQUFDLE1BQTlDLEVBQXNELFFBQVEsQ0FBQyxNQUEvRCxFQUF1RSxRQUFRLENBQUMsSUFBaEYsQ0F0Q04sQ0FBQTtBQXlDQSxJQUFBLElBQUcsS0FBQSxLQUFTLGlCQUFaO0FBQW1DLE1BQUEsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFULENBQWlCLEdBQWpCLEVBQXNCLEtBQXRCLENBQUEsQ0FBbkM7S0F6Q0E7V0EyQ0EsSUE3QzBCO0VBQUEsQ0FBNUIsQ0FKQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQ0EsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxRQUFBO0FBQUEsRUFFQSxRQUFBLEdBQVcsSUFGWCxDQUFBO0FBQUEsRUFJQSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEIsU0FBQyxPQUFELEVBQVUsS0FBVixFQUEyQixpQkFBM0IsR0FBQTtBQUUxQixRQUFBLGdCQUFBOztNQUZvQyxRQUFRLEVBQUUsQ0FBQztLQUUvQzs7TUFGcUQsb0JBQW9CO0tBRXpFO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsTUFDQSxNQUFBLEVBQVEsRUFEUjtBQUFBLE1BRUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7T0FIRjtBQUFBLE1BSUEsTUFBQSxFQUFRLENBSlI7S0FERixDQUFBO0FBQUEsSUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsSUFRQSxDQUFBLEdBQUksQ0FSSixDQUFBO0FBU0EsV0FBTSxDQUFBLEdBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsUUFBUSxDQUFDLE1BQXRCLENBQVYsR0FBQTtBQUVFLE1BQUEsR0FBQSxHQUFNLEVBQUUsQ0FBQyxPQUFILENBQVcsUUFBWCxFQUFxQixRQUFRLENBQUMsS0FBOUIsRUFBcUMsUUFBUSxDQUFDLE1BQTlDLEVBQXNELFFBQVEsQ0FBQyxNQUEvRCxFQUF1RSxRQUFRLENBQUMsSUFBaEYsQ0FBTixDQUFBO0FBQUEsTUFFQSxDQUFBLElBQUssQ0FGTCxDQUZGO0lBQUEsQ0FUQTtBQWVBLElBQUEsSUFBRyxLQUFBLEtBQVMsaUJBQVo7QUFBbUMsTUFBQSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0IsS0FBdEIsQ0FBQSxDQUFuQztLQWZBO1dBaUJBLElBbkIwQjtFQUFBLENBQTVCLENBSkEsQ0FEQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0FBLENBQUcsU0FBQyxFQUFELEdBQUE7QUFDRCxFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsUUFBQTtBQUFBLEVBRUEsUUFBQSxHQUFXLE1BRlgsQ0FBQTtBQUFBLEVBSUEsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLFFBQWxCLEVBQTRCLFNBQUMsT0FBRCxFQUFVLEtBQVYsRUFBMkIsaUJBQTNCLEdBQUE7QUFFMUIsUUFBQSxhQUFBOztNQUZvQyxRQUFRLEVBQUUsQ0FBQztLQUUvQzs7TUFGcUQsb0JBQW9CO0tBRXpFO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsTUFBQSxFQUFRLEVBQVI7QUFBQSxRQUNBLE1BQUEsRUFBUSxFQURSO0FBQUEsUUFFQSxJQUFBLEVBQU0sRUFGTjtPQURGO0FBQUEsTUFJQSxNQUFBLEVBQVEsRUFKUjtBQUFBLE1BS0EsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7T0FORjtLQURGLENBQUE7QUFBQSxJQVNBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVRBLENBQUE7QUFBQSxJQVVBLEdBQUEsR0FBTSxFQUFFLENBQUMsT0FBSCxDQUFXLFFBQVgsRUFBcUIsUUFBUSxDQUFDLEtBQTlCLEVBQXFDLFFBQVEsQ0FBQyxNQUE5QyxFQUFzRCxRQUFRLENBQUMsTUFBL0QsRUFBdUUsUUFBUSxDQUFDLElBQWhGLENBVk4sQ0FBQTtBQUFBLElBWUEsR0FBRyxDQUFDLEdBQUosQ0FBUSxXQUFSLEVBQXFCLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBTixDQUNuQjtBQUFBLE1BQUEsU0FBQSxFQUFXLFNBQUMsT0FBRCxHQUFBO0FBQ1QsWUFBQSxJQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sQ0FBQSxDQUFFLE9BQUYsQ0FBUCxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQVYsRUFBd0IsR0FBeEIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFJLENBQUMsT0FBTCxDQUFhO0FBQUEsVUFBQSxlQUFBLEVBQWlCLEtBQWpCO1NBQWIsQ0FGQSxDQURTO01BQUEsQ0FBWDtBQUFBLE1BTUEsV0FBQSxFQUFhLFNBQUMsT0FBRCxHQUFBO0FBQ1gsWUFBQSxJQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sQ0FBQSxDQUFFLE9BQUYsQ0FBUCxDQUFBO0FBQ0EsUUFBQSxJQUFHLElBQUksQ0FBQyxJQUFMLENBQVUsWUFBVixDQUFBLEtBQTJCLEdBQTlCO0FBQ0UsVUFBQSxJQUFJLENBQUMsR0FBTCxDQUFTLGtCQUFULEVBQTZCLFFBQTdCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxZQUFWLEVBQXdCLEdBQXhCLENBREEsQ0FBQTtBQUFBLFVBRUEsVUFBQSxDQUFXLENBQUMsU0FBQSxHQUFBO0FBQ1IsWUFBQSxJQUFJLENBQUMsT0FBTCxDQUFhO0FBQUEsY0FBQSxlQUFBLEVBQWlCLGFBQWpCO2FBQWIsQ0FBQSxDQURRO1VBQUEsQ0FBRCxDQUFYLEVBR0csR0FISCxDQUZBLENBREY7U0FGVztNQUFBLENBTmI7S0FEbUIsQ0FBckIsQ0FaQSxDQUFBO0FBQUEsSUErQkEsR0FBRyxDQUFDLEdBQUosQ0FBUSxhQUFSLEVBQXVCLFNBQUEsR0FBQTthQUNyQixHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQU4sQ0FBQSxDQUFBLElBQWtCLENBQUMsQ0FBQSxHQUFPLENBQUMsU0FBUyxDQUFDLGVBQWQsQ0FBQSxDQUFKLElBQXVDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZUFBZCxDQUFBLENBQStCLENBQUMsTUFBaEMsS0FBMEMsQ0FBbEYsRUFERztJQUFBLENBQXZCLENBL0JBLENBQUE7QUFvQ0EsSUFBQSxJQUFHLEtBQUEsS0FBUyxpQkFBWjtBQUFtQyxNQUFBLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBVCxDQUFpQixHQUFqQixFQUFzQixLQUF0QixDQUFBLENBQW5DO0tBcENBO1dBc0NBLElBeEMwQjtFQUFBLENBQTVCLENBSkEsQ0FEQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0FBLElBQUEsa0JBQUE7O0FBQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxRQUFBO0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FGWCxDQUFBO0FBQUEsRUFJQSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEIsU0FBQyxPQUFELEVBQVUsS0FBVixFQUEyQixpQkFBM0IsR0FBQTtBQUUxQixRQUFBLHNHQUFBOztNQUZvQyxRQUFRLEVBQUUsQ0FBQztLQUUvQzs7TUFGcUQsb0JBQW9CO0tBRXpFO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxRQUNBLEtBQUEsRUFBTyxFQURQO09BREY7QUFBQSxNQUdBLE1BQUEsRUFBUSxFQUhSO0FBQUEsTUFJQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtBQUFBLFFBQ0EsTUFBQSxFQUFRLEVBQUUsQ0FBQyxJQURYO0FBQUEsUUFFQSxRQUFBLEVBQVUsRUFBRSxDQUFDLElBRmI7T0FMRjtLQURGLENBQUE7QUFBQSxJQVVBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVZBLENBQUE7QUFZQSxJQUFBLElBQUcsQ0FBQSxRQUFZLENBQUMsS0FBSyxDQUFDLElBQW5CLElBQTJCLENBQUEsRUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFXLENBQUEsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFmLENBQXREO0FBQ0UsWUFBVSxJQUFBLEtBQUEsQ0FBTSw4QkFBQSxHQUFpQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQWhELEdBQXVELG1CQUE3RCxDQUFWLENBREY7S0FaQTtBQUFBLElBY0EsUUFBQSxHQUFXLEVBQUUsQ0FBQyxLQUFLLENBQUMsVUFBVyxDQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBZixDQWQvQixDQUFBO0FBQUEsSUFnQkEsU0FBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLGNBQU8sUUFBUDtBQUFBLGFBQ08sRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFEM0I7QUFFSSxVQUFBLEdBQUcsQ0FBQyxLQUFKLEdBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFOLENBQVMsVUFBVCxDQUFaLENBRko7QUFDTztBQURQLGFBR08sRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FIM0I7QUFJSSxVQUFBLEdBQUcsQ0FBQyxLQUFKLEdBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFOLENBQVcsVUFBWCxDQUFzQixDQUFDLEdBQXZCLENBQUEsQ0FBWixDQUpKO0FBR087QUFIUDtBQU1JLFVBQUEsR0FBRyxDQUFDLEtBQUosR0FBWSxHQUFHLENBQUMsR0FBSixDQUFBLENBQVosQ0FOSjtBQUFBLE9BQUE7YUFPQSxHQUFHLENBQUMsTUFSTTtJQUFBLENBaEJaLENBQUE7QUEwQkE7QUFBQTs7OztPQTFCQTtBQUFBLElBK0JBLFFBQUEsR0FBVyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBL0IzQixDQUFBO0FBZ0NBLElBQUEsSUFBRyxRQUFBLElBQWEsUUFBQSxLQUFjLEVBQUUsQ0FBQyxJQUFqQztBQUNFLE1BQUEsUUFBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFlBQUEsS0FBQTtBQUFBLFFBRFUsK0RBQ1YsQ0FBQTtBQUFBLFFBQUEsU0FBQSxDQUFBLENBQUEsQ0FBQTtlQUNBLFFBQUEsYUFBUyxDQUFBLEdBQUcsQ0FBQyxLQUFPLFNBQUEsYUFBQSxLQUFBLENBQUEsQ0FBcEIsRUFGUztNQUFBLENBQVgsQ0FBQTtBQUFBLE1BR0EsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFoQixHQUF3QixRQUh4QixDQURGO0tBaENBO0FBc0NBO0FBQUE7Ozs7T0F0Q0E7QUFBQSxJQTJDQSxTQUFBLEdBQVksUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQTNDNUIsQ0FBQTtBQTRDQSxJQUFBLElBQUcsU0FBQSxJQUFjLFNBQUEsS0FBZSxFQUFFLENBQUMsSUFBbkM7QUFDRSxNQUFBLFNBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixZQUFBLEtBQUE7QUFBQSxRQURXLCtEQUNYLENBQUE7QUFBQSxRQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUE7ZUFDQSxTQUFBLGFBQVUsQ0FBQSxHQUFHLENBQUMsS0FBTyxTQUFBLGFBQUEsS0FBQSxDQUFBLENBQXJCLEVBRlU7TUFBQSxDQUFaLENBQUE7QUFBQSxNQUdBLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBaEIsR0FBeUIsU0FIekIsQ0FERjtLQTVDQTtBQWtEQTtBQUFBOzs7O09BbERBO0FBQUEsSUF1REEsV0FBQSxHQUFjLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUF2RDlCLENBQUE7QUFBQSxJQXdEQSxXQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSxLQUFBO0FBQUEsTUFEYSwrREFDYixDQUFBO0FBQUEsTUFBQSxTQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsTUFBQSxJQUFHLFdBQUEsSUFBZ0IsV0FBQSxLQUFpQixFQUFFLENBQUMsSUFBdkM7ZUFDRSxXQUFBLGFBQVksQ0FBQSxHQUFHLENBQUMsS0FBTyxTQUFBLGFBQUEsS0FBQSxDQUFBLENBQXZCLEVBREY7T0FGWTtJQUFBLENBeERkLENBQUE7QUFBQSxJQTZEQSxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQWhCLEdBQTJCLFdBN0QzQixDQUFBO0FBQUEsSUFnRUEsR0FBQSxHQUFNLEVBQUUsQ0FBQyxPQUFILENBQVcsUUFBWCxFQUFxQixRQUFRLENBQUMsS0FBOUIsRUFBcUMsUUFBUSxDQUFDLE1BQTlDLEVBQXNELFFBQVEsQ0FBQyxNQUEvRCxFQUF1RSxRQUFRLENBQUMsSUFBaEYsQ0FoRU4sQ0FBQTtBQUFBLElBaUVBLEdBQUcsQ0FBQyxLQUFKLEdBQVksUUFBUSxDQUFDLEtBQUssQ0FBQyxLQWpFM0IsQ0FBQTtBQW1FQSxJQUFBLElBQUcsS0FBQSxLQUFTLGlCQUFaO0FBQW1DLE1BQUEsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFULENBQWlCLEdBQWpCLEVBQXNCLEtBQXRCLENBQUEsQ0FBbkM7S0FuRUE7V0FxRUEsSUF2RTBCO0VBQUEsQ0FBNUIsQ0FKQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxRQUFBO0FBQUEsRUFFQSxRQUFBLEdBQVcsSUFGWCxDQUFBO0FBQUEsRUFJQSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEIsU0FBQyxPQUFELEVBQVUsS0FBVixFQUEyQixpQkFBM0IsR0FBQTtBQUUxQixRQUFBLGFBQUE7O01BRm9DLFFBQVEsRUFBRSxDQUFDO0tBRS9DOztNQUZxRCxvQkFBb0I7S0FFekU7QUFBQSxJQUFBLFFBQUEsR0FDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQVA7QUFBQSxNQUNBLE1BQUEsRUFBUSxFQURSO0FBQUEsTUFFQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtPQUhGO0tBREYsQ0FBQTtBQUFBLElBTUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBTkEsQ0FBQTtBQUFBLElBT0EsR0FBQSxHQUFNLEVBQUUsQ0FBQyxPQUFILENBQVcsUUFBWCxFQUFxQixRQUFRLENBQUMsS0FBOUIsRUFBcUMsUUFBUSxDQUFDLE1BQTlDLEVBQXNELFFBQVEsQ0FBQyxNQUEvRCxFQUF1RSxRQUFRLENBQUMsSUFBaEYsQ0FQTixDQUFBO0FBVUEsSUFBQSxJQUFHLEtBQUEsS0FBUyxpQkFBWjtBQUFtQyxNQUFBLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBVCxDQUFpQixHQUFqQixFQUFzQixLQUF0QixDQUFBLENBQW5DO0tBVkE7V0FZQSxJQWQwQjtFQUFBLENBQTVCLENBSkEsQ0FEQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0FBLElBQUEsa0JBQUE7O0FBQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxRQUFBO0FBQUEsRUFFQSxRQUFBLEdBQVcsUUFGWCxDQUFBO0FBQUEsRUFJQSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEIsU0FBQyxPQUFELEVBQVUsS0FBVixFQUEyQixpQkFBM0IsR0FBQTtBQUUxQixRQUFBLHFGQUFBOztNQUZvQyxRQUFRLEVBQUUsQ0FBQztLQUUvQzs7TUFGcUQsb0JBQW9CO0tBRXpFO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLEVBQVY7QUFBQSxRQUNBLFFBQUEsRUFBVSxLQURWO09BREY7QUFBQSxNQUdBLE1BQUEsRUFBUSxFQUhSO0FBQUEsTUFJQSxNQUFBLEVBQVEsRUFKUjtBQUFBLE1BS0EsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7QUFBQSxRQUNBLE1BQUEsRUFBUSxFQUFFLENBQUMsSUFEWDtPQU5GO0tBREYsQ0FBQTtBQUFBLElBVUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBVkEsQ0FBQTtBQUFBLElBWUEsS0FBQSxHQUFRLEVBWlIsQ0FBQTtBQUFBLElBYUEsTUFBQSxHQUFTLEVBYlQsQ0FBQTtBQUFBLElBY0EsUUFBQSxHQUFXLEtBZFgsQ0FBQTtBQUFBLElBZ0JBLFNBQUEsR0FBWSxTQUFBLEdBQUE7YUFDVixLQUFBLEdBQVEsR0FBRyxDQUFDLEdBQUosQ0FBQSxFQURFO0lBQUEsQ0FoQlosQ0FBQTtBQW9CQSxJQUFBLElBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFoQixLQUEyQixFQUFFLENBQUMsSUFBakM7QUFDRSxNQUFBLEtBQUEsR0FBUSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQXhCLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxZQUFBLGFBQUE7QUFBQSxRQURVLCtEQUNWLENBQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxLQUFBLGFBQU0sS0FBTixDQUFULENBQUE7QUFBQSxRQUNBLFNBQUEsQ0FBQSxDQURBLENBQUE7ZUFFQSxPQUhTO01BQUEsQ0FEWCxDQUFBO0FBQUEsTUFLQSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQWhCLEdBQXdCLFFBTHhCLENBREY7S0FwQkE7QUE2QkEsSUFBQSxJQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBaEIsS0FBNEIsRUFBRSxDQUFDLElBQWxDO0FBQ0UsTUFBQSxNQUFBLEdBQVMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUF6QixDQUFBO0FBQUEsTUFDQSxTQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsWUFBQSxhQUFBO0FBQUEsUUFEVywrREFDWCxDQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsTUFBQSxhQUFPLEtBQVAsQ0FBVCxDQUFBO0FBQUEsUUFDQSxTQUFBLENBQUEsQ0FEQSxDQUFBO2VBRUEsT0FIVTtNQUFBLENBRFosQ0FBQTtBQUFBLE1BS0EsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFoQixHQUF5QixTQUx6QixDQURGO0tBN0JBO0FBQUEsSUFxQ0EsR0FBQSxHQUFNLEVBQUUsQ0FBQyxPQUFILENBQVcsUUFBWCxFQUFxQixRQUFRLENBQUMsS0FBOUIsRUFBcUMsUUFBUSxDQUFDLE1BQTlDLEVBQXNELFFBQVEsQ0FBQyxNQUEvRCxFQUF1RSxRQUFRLENBQUMsSUFBaEYsQ0FyQ04sQ0FBQTtBQUFBLElBdUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsY0FBUixFQUF3QixTQUFDLFFBQUQsR0FBQTtBQUN0QixVQUFBLE9BQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxFQUFOLENBQUE7QUFDQSxNQUFBLElBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFOLENBQVcsaUJBQVgsQ0FBQSxJQUFrQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQU4sQ0FBVyxpQkFBWCxDQUE4QixDQUFBLENBQUEsQ0FBbkU7QUFDRSxRQUFBLE9BQUEsR0FBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQU4sQ0FBVyxpQkFBWCxDQUE4QixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQTNDLENBQUE7QUFDQSxRQUFBLElBQTRCLE9BQTVCO0FBQUEsVUFBQSxHQUFBLEdBQU0sT0FBUSxDQUFBLFFBQUEsQ0FBZCxDQUFBO1NBRkY7T0FEQTthQUlBLElBTHNCO0lBQUEsQ0FBeEIsQ0F2Q0EsQ0FBQTtBQUFBLElBOENBLEdBQUcsQ0FBQyxHQUFKLENBQVEsY0FBUixFQUF3QixTQUFBLEdBQUE7YUFDdEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFOLENBQVcsaUJBQVgsQ0FBNkIsQ0FBQyxJQUE5QixDQUFBLEVBRHNCO0lBQUEsQ0FBeEIsQ0E5Q0EsQ0FBQTtBQUFBLElBaURBLEdBQUcsQ0FBQyxHQUFKLENBQVEsYUFBUixFQUF1QixTQUFBLEdBQUE7QUFDckIsTUFBQSxLQUFBLEdBQVEsR0FBRyxDQUFDLEdBQUosQ0FBQSxDQUFSLENBQUE7YUFDQSxNQUZxQjtJQUFBLENBQXZCLENBakRBLENBQUE7QUFBQSxJQXFEQSxHQUFHLENBQUMsR0FBSixDQUFRLFdBQVIsRUFBcUIsU0FBQyxLQUFELEVBQVEsSUFBUixFQUFzQixRQUF0QixFQUF3QyxRQUF4QyxHQUFBO0FBQ25CLFVBQUEseUJBQUE7O1FBRDJCLE9BQU87T0FDbEM7O1FBRHlDLFdBQVc7T0FDcEQ7O1FBRDJELFdBQVc7T0FDdEU7QUFBQSxNQUFBLE9BQUEsR0FBVSxDQUFDLENBQUMsT0FBRixDQUFVLEtBQVYsQ0FBVixDQUFBO0FBQUEsTUFDQSxHQUFBLEdBQU0sS0FETixDQUFBO0FBRUEsTUFBQSxJQUFHLE9BQUEsSUFBWSxLQUFBLEtBQVMsUUFBeEI7QUFDRSxRQUFBLFFBQUEsR0FBVyxJQUFYLENBQUE7QUFBQSxRQUNBLEdBQUEsR0FBTSxJQUROLENBREY7T0FGQTtBQUtBLE1BQUEsSUFBRyxLQUFBLEtBQVMsR0FBVCxJQUFpQixLQUFBLEtBQVMsT0FBN0I7QUFBMEMsUUFBQSxHQUFBLEdBQU0sSUFBTixDQUExQztPQUxBO0FBTUEsTUFBQSxJQUFHLEdBQUg7QUFDSSxRQUFBLEdBQUEsR0FDRTtBQUFBLFVBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxVQUNBLEtBQUEsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLEtBQVA7V0FGRjtTQURGLENBQUE7QUFJQSxRQUFBLElBQUcsUUFBSDtBQUNFLFVBQUEsR0FBRyxDQUFDLFFBQUosR0FBZSxRQUFmLENBREY7U0FKQTtBQU1BLFFBQUEsSUFBRyxRQUFIO0FBQ0UsVUFBQSxHQUFHLENBQUMsUUFBSixHQUFlLFFBQWYsQ0FERjtTQU5BO0FBQUEsUUFRQSxNQUFBLEdBQVMsR0FBRyxDQUFDLElBQUosQ0FBUyxRQUFULEVBQW1CLEdBQW5CLENBUlQsQ0FBQTtlQVNBLE9BVko7T0FQbUI7SUFBQSxDQUFyQixDQXJEQSxDQUFBO0FBQUEsSUF3RUEsR0FBRyxDQUFDLEdBQUosQ0FBUSxZQUFSLEVBQXNCLFNBQUMsT0FBRCxHQUFBO0FBQ3BCLE1BQUEsTUFBQSxHQUFTLENBQUMsQ0FBQyxLQUFGLENBQVEsTUFBUixFQUFnQixPQUFoQixDQUFULENBQUE7QUFBQSxNQUNBLEVBQUUsQ0FBQyxJQUFILENBQVEsT0FBUixFQUFpQixDQUFDLFNBQUMsR0FBRCxHQUFBO0FBQ2hCLFFBQUEsS0FBQSxHQUFRLEdBQUcsQ0FBQyxTQUFKLENBQWMsR0FBZCxDQUFSLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyxJQUFQLENBQVksS0FBWixDQURBLENBRGdCO01BQUEsQ0FBRCxDQUFqQixFQUlHLEtBSkgsQ0FEQSxDQUFBO2FBTUEsT0FQb0I7SUFBQSxDQUF0QixDQXhFQSxDQUFBO0FBQUEsSUFpRkEsR0FBRyxDQUFDLEdBQUosQ0FBUSxjQUFSLEVBQXdCLFNBQUMsTUFBRCxHQUFBO0FBQ3RCLE1BQUEsR0FBRyxDQUFDLEtBQUosQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxNQURULENBQUE7QUFBQSxNQUVBLEdBQUcsQ0FBQyxVQUFKLENBQWUsTUFBZixDQUZBLENBQUE7YUFHQSxJQUpzQjtJQUFBLENBQXhCLENBakZBLENBQUE7QUFBQSxJQXVGQSxHQUFHLENBQUMsR0FBSixDQUFRLGNBQVIsRUFBd0IsU0FBQyxhQUFELEdBQUE7QUFDdEIsVUFBQSxnQkFBQTtBQUFBLE1BQUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxNQUFNLENBQUMsT0FBUCxDQUFlLGFBQWYsQ0FBZCxFQUE2QyxDQUE3QyxDQUFBLENBQUE7QUFBQSxNQUNBLGFBQUEsR0FBZ0IsR0FBSSxDQUFBLENBQUEsQ0FEcEIsQ0FBQTtBQUFBLE1BRUEsQ0FBQSxHQUFJLENBRkosQ0FBQTtBQUlBLGFBQU0sQ0FBQSxHQUFJLGFBQWEsQ0FBQyxNQUF4QixHQUFBO0FBQ0UsUUFBQSxJQUEyQixhQUFhLENBQUMsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQXpCLEtBQWtDLGFBQTdEO0FBQUEsVUFBQSxhQUFhLENBQUMsTUFBZCxDQUFxQixDQUFyQixDQUFBLENBQUE7U0FBQTtBQUFBLFFBQ0EsQ0FBQSxFQURBLENBREY7TUFBQSxDQUxzQjtJQUFBLENBQXhCLENBdkZBLENBQUE7QUFtR0EsSUFBQSxJQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBaEIsR0FBeUIsQ0FBNUI7QUFDRSxNQUFBLEdBQUcsQ0FBQyxVQUFKLENBQWUsUUFBUSxDQUFDLE1BQXhCLENBQUEsQ0FERjtLQW5HQTtBQXNHQSxJQUFBLElBQUcsS0FBQSxLQUFTLGlCQUFaO0FBQW1DLE1BQUEsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFULENBQWlCLEdBQWpCLEVBQXNCLEtBQXRCLENBQUEsQ0FBbkM7S0F0R0E7V0F3R0EsSUExRzBCO0VBQUEsQ0FBNUIsQ0FKQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUVELE1BQUEsZUFBQTtBQUFBLEVBQUEsUUFBQSxHQUFXLE9BQVgsQ0FBQTtBQUVBO0FBQUE7O0tBRkE7QUFBQSxFQUtBLEtBQUEsR0FBUSxTQUFDLE9BQUQsRUFBVSxLQUFWLEVBQTJCLGlCQUEzQixHQUFBO0FBR04sUUFBQSw2RkFBQTs7TUFIZ0IsUUFBUSxFQUFFLENBQUM7S0FHM0I7O01BSGlDLG9CQUFvQjtLQUdyRDtBQUFBLElBQUEsUUFBQSxHQUdFO0FBQUEsTUFBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLE1BR0EsS0FBQSxFQUNFO0FBQUEsUUFBQSxXQUFBLEVBQWEsQ0FBYjtBQUFBLFFBQ0EsV0FBQSxFQUFhLENBRGI7QUFBQSxRQUVBLEtBQUEsRUFBTyxFQUZQO0FBQUEsUUFHQSxLQUFBLEVBQU8sRUFIUDtBQUFBLFFBSUEsU0FBQSxFQUFXLE1BSlg7QUFBQSxRQUtBLFVBQUEsRUFBWSxLQUxaO0FBQUEsUUFNQSxPQUFBLEVBQU8sRUFOUDtPQUpGO0FBQUEsTUFXQSxNQUFBLEVBQVEsRUFYUjtBQUFBLE1BWUEsTUFBQSxFQUFRLEVBWlI7QUFBQSxNQWVBLEtBQUEsRUFDRTtBQUFBLFFBQUEsT0FBQSxFQUFPLEVBQVA7QUFBQSxRQUNBLEtBQUEsRUFBTyxFQURQO0FBQUEsUUFFQSxnQkFBQSxFQUFrQixFQUZsQjtBQUFBLFFBR0EsV0FBQSxFQUFhLEVBSGI7QUFBQSxRQUlBLE1BQUEsRUFBUSxFQUpSO09BaEJGO0FBQUEsTUF1QkEsS0FBQSxFQUFPLEVBdkJQO0FBQUEsTUEwQkEsS0FBQSxFQUFPLEVBMUJQO0FBQUEsTUE0QkEsZUFBQSxFQUFpQixLQTVCakI7QUFBQSxNQTZCQSxhQUFBLEVBQWUsS0E3QmY7S0FIRixDQUFBO0FBQUEsSUFrQ0EsSUFBQSxHQUFPLEVBbENQLENBQUE7QUFBQSxJQW1DQSxLQUFBLEdBQVEsRUFBRSxDQUFDLE9BQUgsQ0FBQSxDQW5DUixDQUFBO0FBQUEsSUFvQ0EsV0FBQSxHQUFjLENBcENkLENBQUE7QUFBQSxJQXNDQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0F0Q0EsQ0FBQTtBQUFBLElBdUNBLEdBQUEsR0FBTSxFQUFFLENBQUMsT0FBSCxDQUFXLFFBQVgsRUFBcUIsUUFBUSxDQUFDLEtBQTlCLEVBQXFDLFFBQVEsQ0FBQyxNQUE5QyxFQUFzRCxRQUFRLENBQUMsTUFBL0QsRUFBdUUsUUFBUSxDQUFDLElBQWhGLENBdkNOLENBQUE7QUF3Q0EsSUFBQSxJQUFHLEtBQUEsS0FBUyxpQkFBWjtBQUFtQyxNQUFBLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBVCxDQUFpQixHQUFqQixFQUFzQixLQUF0QixDQUFBLENBQW5DO0tBeENBO0FBQUEsSUEwQ0EsS0FBQSxHQUFRLElBMUNSLENBQUE7QUFBQSxJQTJDQSxLQUFBLEdBQVEsSUEzQ1IsQ0FBQTtBQUFBLElBNENBLFFBQUEsR0FBVyxJQTVDWCxDQUFBO0FBQUEsSUFnREEsSUFBQSxHQUFPLENBQUMsQ0FBQyxJQUFGLENBQU8sU0FBQSxHQUFBO0FBQ1osVUFBQSwwQkFBQTtBQUFBLE1BQUEsSUFBRyxRQUFRLENBQUMsSUFBWjtBQUNFLFFBQUEsTUFBQSxHQUFTLGtCQUFBLENBQW1CLFFBQVEsQ0FBQyxJQUE1QixDQUFULENBREY7T0FBQTtBQUVBLE1BQUEsSUFBRyxNQUFIO0FBQ0UsUUFBQSxJQUFBLEdBQU8sQ0FBQSxDQUFFLE1BQUYsQ0FBUCxDQUFBO0FBQUEsUUFFQSxLQUFBLEdBQVEsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLENBRlIsQ0FBQTtBQUFBLFFBR0EsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFOLENBQWEsS0FBYixDQUhBLENBQUE7QUFBQSxRQUlBLEtBQUEsR0FBUSxFQUFFLENBQUMsY0FBSCxDQUFrQixLQUFNLENBQUEsQ0FBQSxDQUF4QixDQUpSLENBQUE7QUFBQSxRQUtBLFFBQUEsR0FBVyxFQUFFLENBQUMsY0FBSCxDQUFrQixLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBaEMsQ0FMWCxDQUFBO0FBQUEsUUFPQSxLQUFBLEdBQVEsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLENBUFIsQ0FBQTtBQUFBLFFBUUEsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFOLENBQWEsS0FBYixDQVJBLENBQUE7QUFBQSxRQVNBLEtBQUEsR0FBUSxFQUFFLENBQUMsY0FBSCxDQUFrQixLQUFNLENBQUEsQ0FBQSxDQUF4QixDQVRSLENBQUE7QUFBQSxRQVdBLFNBQUEsQ0FBQSxDQVhBLENBREY7T0FBQSxNQUFBO0FBY0UsUUFBQSxLQUFBLEdBQVEsR0FBRyxDQUFDLElBQUosQ0FBUyxPQUFULEVBQWtCLFFBQVEsQ0FBQyxLQUEzQixDQUFSLENBQUE7QUFBQSxRQUNBLFFBQUEsR0FBVyxLQUFLLENBQUMsSUFBTixDQUFXLElBQVgsQ0FEWCxDQUFBO0FBQUEsUUFFQSxLQUFBLEdBQVEsR0FBRyxDQUFDLElBQUosQ0FBUyxPQUFULEVBQWtCLFFBQVEsQ0FBQyxLQUEzQixDQUZSLENBQUE7QUFBQSxRQUdBLElBQUksQ0FBQyxJQUFMLENBQVUsS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYLENBQVYsQ0FIQSxDQWRGO09BRkE7YUFvQkEsSUFyQlk7SUFBQSxDQUFQLENBaERQLENBQUE7QUFBQSxJQXlFQSxTQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSwrQkFBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLENBQUosQ0FBQTtBQUNBO2FBQU0sS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUksQ0FBQyxNQUFkLEdBQXVCLENBQTdCLEdBQUE7QUFDRSxRQUFBLENBQUEsR0FBSSxDQUFKLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxFQUFFLENBQUMsY0FBSCxDQUFrQixLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBaEMsQ0FEVCxDQUFBO0FBQUEsUUFFQSxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQVYsQ0FGQSxDQUFBO0FBR0EsZUFBTSxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQUssQ0FBQyxNQUF2QixHQUFnQyxDQUF0QyxHQUFBO0FBQ0UsVUFBQSxPQUFBLEdBQVUsS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFBLEdBQUUsQ0FBWixFQUFlLENBQUEsR0FBRSxDQUFqQixDQUFWLENBQUE7QUFDQSxVQUFBLElBQUcsQ0FBQSxPQUFIO0FBQ0UsWUFBQSxPQUFBLEdBQVUsRUFBRSxDQUFDLGNBQUgsQ0FBa0IsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUF6QyxDQUFWLENBQUE7QUFBQSxZQUNBLEtBQUssQ0FBQyxHQUFOLENBQVUsQ0FBQSxHQUFFLENBQVosRUFBZSxDQUFBLEdBQUUsQ0FBakIsRUFBb0IsT0FBcEIsQ0FEQSxDQURGO1dBREE7QUFBQSxVQUlBLENBQUEsSUFBSyxDQUpMLENBREY7UUFBQSxDQUhBO0FBQUEsc0JBU0EsQ0FBQSxJQUFLLEVBVEwsQ0FERjtNQUFBLENBQUE7c0JBRlU7SUFBQSxDQXpFWixDQUFBO0FBQUEsSUF5RkEsV0FBQSxHQUFjLFNBQUEsR0FBQTthQUNaLEtBQUssQ0FBQyxJQUFOLENBQVcsU0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEdBQWYsR0FBQTtBQUNULFlBQUEsR0FBQTtBQUFBLFFBQUEsSUFBRyxDQUFBLEdBQUg7QUFDRSxVQUFBLEdBQUEsR0FBTSxHQUFHLENBQUMsR0FBSixDQUFRLEtBQVIsQ0FBTixDQUFBO2lCQUNBLEdBQUcsQ0FBQyxJQUFKLENBQVMsS0FBVCxFQUFnQixFQUFoQixFQUZGO1NBRFM7TUFBQSxDQUFYLEVBRFk7SUFBQSxDQXpGZCxDQUFBO0FBQUEsSUFpR0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxRQUFSLEVBQWtCLFNBQUMsS0FBRCxFQUFRLE9BQVIsR0FBQTtBQUNoQixVQUFBLGVBQUE7QUFBQSxNQUFBLEdBQUcsQ0FBQyxJQUFKLENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxXQUFBLElBQWUsQ0FEZixDQUFBO0FBQUEsTUFFQSxFQUFBLEdBQUssSUFGTCxDQUFBO0FBQUEsTUFHQSxDQUFBLEdBQUksQ0FISixDQUFBO0FBSUEsYUFBTSxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQUssQ0FBQyxNQUF2QixHQUFnQyxLQUF0QyxHQUFBO0FBQ0UsUUFBQSxRQUFBLEdBQVcsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFsQyxDQUFBO0FBQ0EsUUFBQSxJQUFHLENBQUEsUUFBSDtBQUNFLFVBQUEsRUFBQSxHQUFLLFFBQVEsQ0FBQyxJQUFULENBQWMsSUFBZCxFQUFvQixFQUFwQixDQUFMLENBREY7U0FBQSxNQUFBO0FBR0UsVUFBQSxFQUFBLEdBQUssRUFBRSxDQUFDLGNBQUgsQ0FBa0IsUUFBbEIsRUFBNEIsSUFBNUIsQ0FBTCxDQUhGO1NBREE7QUFBQSxRQUtBLENBQUEsSUFBSyxDQUxMLENBREY7TUFBQSxDQUpBO0FBV0EsTUFBQSxJQUFHLENBQUEsRUFBSDtBQUNFLFFBQUEsUUFBQSxHQUFXLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBTSxDQUFBLEtBQUEsR0FBTSxDQUFOLENBQWxDLENBQUE7QUFBQSxRQUNBLEVBQUEsR0FBSyxFQUFFLENBQUMsY0FBSCxDQUFrQixRQUFsQixFQUE0QixJQUE1QixDQURMLENBREY7T0FYQTtBQUFBLE1BY0EsRUFBRSxDQUFDLElBQUgsQ0FBUSxPQUFSLENBZEEsQ0FBQTthQWVBLEdBaEJnQjtJQUFBLENBQWxCLENBakdBLENBQUE7QUFBQSxJQXFIQSxHQUFHLENBQUMsR0FBSixDQUFRLEtBQVIsRUFBZSxTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDYixVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxJQUFLLENBQUEsS0FBQSxHQUFNLENBQU4sQ0FBWCxDQUFBO0FBRUEsTUFBQSxJQUFHLENBQUEsR0FBSDtBQUNFLGVBQU0sSUFBSSxDQUFDLE1BQUwsR0FBYyxLQUFwQixHQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sS0FBSyxDQUFDLElBQU4sQ0FBVyxJQUFYLEVBQWlCLEVBQWpCLENBQU4sQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLENBREEsQ0FERjtRQUFBLENBREY7T0FGQTtBQU9BLE1BQUEsSUFBRyxDQUFBLEdBQU8sQ0FBQyxJQUFYO0FBQ0UsUUFBQSxHQUFHLENBQUMsR0FBSixDQUFRLE1BQVIsRUFBZ0IsU0FBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQ2QsY0FBQSxJQUFBO0FBQUEsVUFBQSxJQUFBLEdBQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFULENBQVksSUFBWixFQUFrQixHQUFsQixDQUFQLENBQUE7QUFBQSxVQUNBLEtBQUssQ0FBQyxHQUFOLENBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QixJQUF4QixDQURBLENBQUE7aUJBRUEsS0FIYztRQUFBLENBQWhCLENBQUEsQ0FERjtPQVBBO2FBYUEsSUFkYTtJQUFBLENBQWYsQ0FySEEsQ0FBQTtBQUFBLElBdUlBLEdBQUcsQ0FBQyxHQUFKLENBQVEsTUFBUixFQUFnQixTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsSUFBZixHQUFBO0FBQ2QsVUFBQSw2QkFBQTtBQUFBLE1BQUEsSUFBRyxLQUFBLEdBQVEsQ0FBWDtBQUFrQixRQUFBLEtBQUEsR0FBUSxDQUFSLENBQWxCO09BQUE7QUFDQSxNQUFBLElBQUcsS0FBQSxHQUFRLENBQVg7QUFBa0IsUUFBQSxLQUFBLEdBQVEsQ0FBUixDQUFsQjtPQURBO0FBRUEsTUFBQSxJQUFHLFdBQUEsR0FBYyxDQUFkLElBQW9CLEtBQUEsR0FBTSxDQUFOLEdBQVUsV0FBakM7QUFBa0QsY0FBVSxJQUFBLEtBQUEsQ0FBTSx3REFBQSxHQUEyRCxLQUEzRCxHQUFtRSxHQUFuRSxHQUF5RSxLQUF6RSxHQUFpRixJQUF2RixDQUFWLENBQWxEO09BRkE7QUFBQSxNQUlBLEdBQUEsR0FBTSxHQUFHLENBQUMsR0FBSixDQUFRLEtBQVIsQ0FKTixDQUFBO0FBQUEsTUFNQSxJQUFBLEdBQU8sS0FBSyxDQUFDLEdBQU4sQ0FBVSxLQUFWLEVBQWlCLEtBQWpCLENBTlAsQ0FBQTtBQVFBLE1BQUEsSUFBRyxDQUFBLElBQUg7QUFDRSxRQUFBLENBQUEsR0FBSSxDQUFKLENBQUE7QUFDQSxlQUFNLENBQUEsR0FBSSxLQUFWLEdBQUE7QUFDRSxVQUFBLENBQUEsSUFBSyxDQUFMLENBQUE7QUFDQSxVQUFBLElBQUcsQ0FBQSxLQUFLLEtBQVI7QUFDRSxZQUFBLE1BQUEsR0FBUyxFQUFFLENBQUMsTUFBSCxDQUFVO0FBQUEsY0FBQyxLQUFBLEVBQU8sUUFBUSxDQUFDLEtBQWpCO2FBQVYsRUFBbUMsSUFBbkMsQ0FBVCxDQUFBO0FBQUEsWUFDQSxJQUFBLEdBQU8sR0FBRyxDQUFDLElBQUosQ0FBUyxLQUFULEVBQWdCLE1BQWhCLENBRFAsQ0FERjtXQUFBLE1BQUE7QUFJRSxZQUFBLE9BQUEsR0FBVSxLQUFLLENBQUMsR0FBTixDQUFVLEtBQVYsRUFBaUIsQ0FBakIsQ0FBVixDQUFBO0FBQ0EsWUFBQSxJQUFHLENBQUEsT0FBSDtBQUNFLGNBQUEsT0FBQSxHQUFXLEdBQUcsQ0FBQyxJQUFKLENBQVMsQ0FBVCxFQUFZO0FBQUEsZ0JBQUEsS0FBQSxFQUFPLFFBQVEsQ0FBQyxLQUFoQjtlQUFaLENBQVgsQ0FERjthQUxGO1dBRkY7UUFBQSxDQUZGO09BUkE7YUFvQkEsS0FyQmM7SUFBQSxDQUFoQixDQXZJQSxDQUFBO0FBQUEsSUFrS0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxVQUFSLEVBQW9CLFNBQUEsR0FBQTtBQUNsQixNQUFBLElBQUEsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUlBLEdBQUcsQ0FBQyxHQUFKLENBQVEsT0FBUixFQUFpQixLQUFqQixDQUpBLENBQUE7QUFBQSxNQVFBLEdBQUcsQ0FBQyxHQUFKLENBQVEsT0FBUixFQUFpQixLQUFqQixDQVJBLENBQUE7YUFVQSxJQVhrQjtJQUFBLENBQXBCLENBbEtBLENBQUE7V0ErS0EsSUFsTE07RUFBQSxDQUxSLENBQUE7QUFBQSxFQXlMQSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEIsS0FBNUIsQ0F6TEEsQ0FGQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0ZBLElBQUEsa0JBQUE7O0FBQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxRQUFBO0FBQUEsRUFFQSxRQUFBLEdBQVcsVUFGWCxDQUFBO0FBQUEsRUFJQSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEIsU0FBQyxPQUFELEVBQVUsS0FBVixFQUEyQixpQkFBM0IsR0FBQTtBQUUxQixRQUFBLG1FQUFBOztNQUZvQyxRQUFRLEVBQUUsQ0FBQztLQUUvQzs7TUFGcUQsb0JBQW9CO0tBRXpFO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLEVBQU47QUFBQSxRQUNBLFdBQUEsRUFBYSxFQURiO0FBQUEsUUFFQSxLQUFBLEVBQU8sRUFGUDtBQUFBLFFBR0EsSUFBQSxFQUFNLEVBSE47QUFBQSxRQUlBLFNBQUEsRUFBVyxFQUpYO0FBQUEsUUFLQSxTQUFBLEVBQVcsS0FMWDtBQUFBLFFBTUEsVUFBQSxFQUFZLEtBTlo7QUFBQSxRQU9BLElBQUEsRUFBTSxDQVBOO0FBQUEsUUFRQSxJQUFBLEVBQU0sRUFSTjtBQUFBLFFBU0EsUUFBQSxFQUFVLEtBVFY7QUFBQSxRQVVBLFFBQUEsRUFBVSxLQVZWO0FBQUEsUUFXQSxJQUFBLEVBQU0sRUFYTjtBQUFBLFFBWUEsSUFBQSxFQUFNLEVBWk47T0FERjtBQUFBLE1BY0EsTUFBQSxFQUFRLEVBZFI7QUFBQSxNQWVBLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO09BaEJGO0tBREYsQ0FBQTtBQUFBLElBbUJBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQW5CQSxDQUFBO0FBQUEsSUFxQkEsS0FBQSxHQUFRLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FyQnZCLENBQUE7QUFBQSxJQXVCQSxTQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsY0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQXRCO0FBQUEsYUFDTyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUQzQjtpQkFFSSxLQUFBLEdBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFOLENBQVMsVUFBVCxFQUZaO0FBQUEsYUFHTyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUgzQjtpQkFJSSxLQUFBLEdBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFOLENBQVcsVUFBWCxDQUFzQixDQUFDLEdBQXZCLENBQUEsRUFKWjtBQUFBO2lCQU1JLEtBQUEsR0FBUSxHQUFHLENBQUMsR0FBSixDQUFBLEVBTlo7QUFBQSxPQURVO0lBQUEsQ0F2QlosQ0FBQTtBQWlDQSxJQUFBLElBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFoQixLQUEyQixFQUFFLENBQUMsSUFBakM7QUFDRSxNQUFBLEtBQUEsR0FBUSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQXhCLENBQUE7QUFBQSxNQUNBLFFBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxZQUFBLGFBQUE7QUFBQSxRQURVLCtEQUNWLENBQUE7QUFBQSxRQUFBLE1BQUEsR0FBUyxLQUFBLGFBQU0sS0FBTixDQUFULENBQUE7QUFBQSxRQUNBLFNBQUEsQ0FBQSxDQURBLENBQUE7ZUFFQSxPQUhTO01BQUEsQ0FEWCxDQUFBO0FBQUEsTUFLQSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQWhCLEdBQXdCLFFBTHhCLENBREY7S0FqQ0E7QUEwQ0EsSUFBQSxJQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBaEIsS0FBNEIsRUFBRSxDQUFDLElBQWxDO0FBQ0UsTUFBQSxNQUFBLEdBQVMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUF6QixDQUFBO0FBQUEsTUFDQSxTQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsWUFBQSxhQUFBO0FBQUEsUUFEVywrREFDWCxDQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsTUFBQSxhQUFPLEtBQVAsQ0FBVCxDQUFBO0FBQUEsUUFDQSxTQUFBLENBQUEsQ0FEQSxDQUFBO2VBRUEsT0FIVTtNQUFBLENBRFosQ0FBQTtBQUFBLE1BS0EsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFoQixHQUF5QixTQUx6QixDQURGO0tBMUNBO0FBQUEsSUFrREEsR0FBQSxHQUFNLEVBQUUsQ0FBQyxPQUFILENBQVcsUUFBWCxFQUFxQixRQUFRLENBQUMsS0FBOUIsRUFBcUMsUUFBUSxDQUFDLE1BQTlDLEVBQXNELFFBQVEsQ0FBQyxNQUEvRCxFQUF1RSxRQUFRLENBQUMsSUFBaEYsQ0FsRE4sQ0FBQTtBQXFEQSxJQUFBLElBQUcsS0FBQSxLQUFTLGlCQUFaO0FBQW1DLE1BQUEsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFULENBQWlCLEdBQWpCLEVBQXNCLEtBQXRCLENBQUEsQ0FBbkM7S0FyREE7V0F1REEsSUF6RDBCO0VBQUEsQ0FBNUIsQ0FKQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxRQUFBO0FBQUEsRUFFQSxRQUFBLEdBQVcsT0FGWCxDQUFBO0FBQUEsRUFJQSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEIsU0FBQyxPQUFELEVBQVUsS0FBVixFQUEyQixpQkFBM0IsR0FBQTtBQUUzQixRQUFBLDBCQUFBOztNQUZxQyxRQUFRLEVBQUUsQ0FBQztLQUVoRDs7TUFGc0Qsb0JBQW9CO0tBRTFFO0FBQUEsSUFBQSxRQUFBLEdBQ0c7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsTUFDQSxNQUFBLEVBQVEsRUFEUjtBQUFBLE1BRUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7T0FIRjtBQUFBLE1BSUEsTUFBQSxFQUFRLENBSlI7S0FESCxDQUFBO0FBQUEsSUFPQyxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQRCxDQUFBO0FBQUEsSUFTQyxHQUFBLEdBQU0sRUFBRSxDQUFDLE9BQUgsQ0FBVyxRQUFYLEVBQXFCLFFBQVEsQ0FBQyxLQUE5QixFQUFxQyxRQUFRLENBQUMsTUFBOUMsRUFBc0QsUUFBUSxDQUFDLE1BQS9ELEVBQXVFLFFBQVEsQ0FBQyxJQUFoRixDQVRQLENBQUE7QUFXQyxJQUFBLElBQUcsS0FBQSxLQUFTLGlCQUFaO0FBQW1DLE1BQUEsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFULENBQWlCLEdBQWpCLEVBQXNCLEtBQXRCLENBQUEsQ0FBbkM7S0FYRDtBQUFBLElBYUMsSUFBQSxHQUFPLEVBYlIsQ0FBQTtBQUFBLElBY0MsS0FBQSxHQUFRLEVBZFQsQ0FBQTtBQUFBLElBZUMsR0FBRyxDQUFDLEdBQUosQ0FBUSxNQUFSLEVBQWdCLFNBQUMsS0FBRCxFQUFRLEtBQVIsR0FBQTtBQUNkLFVBQUEsa0JBQUE7QUFBQSxNQUFBLElBQUEsQ0FBQSxDQUFBLENBQUE7QUFFQSxNQUFBLElBQUcsS0FBQSxHQUFRLENBQVg7QUFBa0IsUUFBQSxLQUFBLEdBQVEsQ0FBUixDQUFsQjtPQUZBO0FBR0EsTUFBQSxJQUFHLEtBQUEsR0FBUSxDQUFYO0FBQWtCLFFBQUEsS0FBQSxHQUFRLENBQVIsQ0FBbEI7T0FIQTtBQUFBLE1BS0EsR0FBQSxHQUFNLElBQUssQ0FBQSxLQUFBLEdBQU0sQ0FBTixDQUxYLENBQUE7QUFPQSxNQUFBLElBQUcsQ0FBQSxHQUFIO0FBQ0UsZUFBTSxJQUFJLENBQUMsTUFBTCxHQUFjLEtBQXBCLEdBQUE7QUFDRSxVQUFBLEdBQUEsR0FBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQVQsQ0FBWSxFQUFaLEVBQWdCLEtBQWhCLEVBQXVCLEtBQXZCLENBQU4sQ0FBQTtBQUFBLFVBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLENBREEsQ0FERjtRQUFBLENBREY7T0FQQTtBQUFBLE1BWUEsRUFBQSxHQUFLLEdBQUksQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFNLENBQUEsS0FBQSxDQVpsQixDQUFBO0FBY0EsTUFBQSxJQUFHLEVBQUg7QUFBVyxRQUFBLElBQUEsR0FBTyxFQUFFLENBQUMsY0FBSCxDQUFrQixFQUFsQixFQUFzQixJQUF0QixDQUFQLENBQVg7T0FkQTtBQWVBLE1BQUEsSUFBRyxDQUFBLEVBQUg7QUFDRSxlQUFNLEdBQUksQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFLLENBQUMsTUFBYixHQUFzQixLQUE1QixHQUFBO0FBQ0UsVUFBQSxHQUFBLEdBQU0sR0FBSSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQUssQ0FBQyxNQUFuQixDQUFBO0FBQUEsVUFDQSxFQUFBLEdBQUssR0FBSSxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQU0sQ0FBQSxHQUFBLEdBQUksQ0FBSixDQURsQixDQUFBO0FBRUEsVUFBQSxJQUFHLEVBQUEsSUFBTyxHQUFBLEtBQU8sS0FBakI7QUFDRSxZQUFBLElBQUEsR0FBTyxFQUFFLENBQUMsY0FBSCxDQUFrQixFQUFsQixFQUFzQixJQUF0QixDQUFQLENBREY7V0FBQSxNQUFBO0FBR0UsWUFBQSxJQUFBLEdBQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFULENBQVk7QUFBQSxjQUFBLEtBQUEsRUFBTyxRQUFRLENBQUMsS0FBaEI7YUFBWixFQUFtQyxHQUFuQyxFQUF3QyxLQUF4QyxDQUFQLENBSEY7V0FIRjtRQUFBLENBREY7T0FmQTtBQXdCQSxNQUFBLElBQUcsQ0FBQSxJQUFRLENBQUMsT0FBWjtBQUNFLFFBQUEsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFULENBQWlCLElBQWpCLEVBQXVCLEdBQXZCLEVBQTRCLEtBQUEsR0FBUSxLQUFwQyxDQUFBLENBREY7T0F4QkE7YUEyQkEsS0E1QmM7SUFBQSxDQUFoQixDQWZELENBQUE7V0E2Q0MsSUEvQzBCO0VBQUEsQ0FBNUIsQ0FKQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELEVBQUEsWUFBQSxDQUFBO0FBQUEsTUFBQSxRQUFBO0FBQUEsRUFFQSxRQUFBLEdBQVcsSUFGWCxDQUFBO0FBQUEsRUFJQSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEIsU0FBQyxPQUFELEVBQVUsS0FBVixFQUEyQixpQkFBM0IsR0FBQTtBQUUxQixRQUFBLGFBQUE7O01BRm9DLFFBQVEsRUFBRSxDQUFDO0tBRS9DOztNQUZxRCxvQkFBb0I7S0FFekU7QUFBQSxJQUFBLFFBQUEsR0FDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQVA7QUFBQSxNQUNBLE1BQUEsRUFBUSxFQURSO0FBQUEsTUFFQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtPQUhGO0tBREYsQ0FBQTtBQUFBLElBTUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBTkEsQ0FBQTtBQUFBLElBT0EsR0FBQSxHQUFNLEVBQUUsQ0FBQyxPQUFILENBQVcsUUFBWCxFQUFxQixRQUFRLENBQUMsS0FBOUIsRUFBcUMsUUFBUSxDQUFDLE1BQTlDLEVBQXNELFFBQVEsQ0FBQyxNQUEvRCxFQUF1RSxRQUFRLENBQUMsSUFBaEYsQ0FQTixDQUFBO0FBVUEsSUFBQSxJQUFHLEtBQUEsS0FBUyxpQkFBWjtBQUFtQyxNQUFBLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBVCxDQUFpQixHQUFqQixFQUFzQixLQUF0QixDQUFBLENBQW5DO0tBVkE7V0FZQSxJQWQwQjtFQUFBLENBQTVCLENBSkEsQ0FEQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0FBLENBQUcsU0FBQyxFQUFELEdBQUE7QUFDRCxNQUFBLFNBQUE7QUFBQSxFQUFBLFNBQUEsR0FBWSxhQUFaLENBQUE7QUFBQSxFQUVBLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFFNUIsUUFBQSxhQUFBOztNQUZzQyxRQUFRLEVBQUUsQ0FBQztLQUVqRDtBQUFBLElBQUEsUUFBQSxHQUNFO0FBQUEsTUFBQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxHQUFBLEVBQUssRUFETDtBQUFBLFFBRUEsR0FBQSxFQUFLLEVBRkw7QUFBQSxRQUdBLE1BQUEsRUFBUSxFQUhSO0FBQUEsUUFJQSxLQUFBLEVBQU8sRUFKUDtPQURGO0FBQUEsTUFNQSxNQUFBLEVBQVEsRUFOUjtBQUFBLE1BT0EsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7T0FSRjtLQURGLENBQUE7QUFBQSxJQVdBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVhBLENBQUE7QUFBQSxJQWFBLEdBQUEsR0FBTSxFQUFFLENBQUMsS0FBSCxDQUFTLFFBQVQsRUFBbUIsS0FBbkIsQ0FiTixDQUFBO1dBY0EsSUFoQjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELE1BQUEsU0FBQTtBQUFBLEVBQUEsU0FBQSxHQUFZLFVBQVosQ0FBQTtBQUFBLEVBRUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUU1QixRQUFBLGFBQUE7O01BRnNDLFFBQVEsRUFBRSxDQUFDO0tBRWpEO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLE9BQUEsRUFBUyxLQUFUO0FBQUEsTUFDQSxhQUFBLEVBQWUsS0FEZjtBQUFBLE1BRUEsS0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtPQUhGO0FBQUEsTUFJQSxNQUFBLEVBQVEsRUFKUjtBQUFBLE1BS0EsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7T0FORjtLQURGLENBQUE7QUFBQSxJQVNBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVRBLENBQUE7QUFBQSxJQVdBLEdBQUEsR0FBTSxFQUFFLENBQUMsS0FBSCxDQUFTLFFBQVQsRUFBbUIsS0FBbkIsQ0FYTixDQUFBO0FBWUEsSUFBQSxJQUFHLFFBQVEsQ0FBQyxPQUFaO0FBQ0UsTUFBQSxHQUFHLENBQUMsSUFBSixDQUFTLFNBQVQsRUFBb0IsSUFBcEIsQ0FBQSxDQURGO0tBQUEsTUFFSyxJQUFHLFFBQVEsQ0FBQyxhQUFaO0FBQ0gsTUFBQSxHQUFHLENBQUMsSUFBSixDQUFTLGVBQVQsRUFBMEIsSUFBMUIsQ0FBQSxDQURHO0tBZEw7V0FpQkEsSUFuQjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELE1BQUEsU0FBQTtBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQVosQ0FBQTtBQUFBLEVBRUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUU1QixRQUFBLGFBQUE7O01BRnNDLFFBQVEsRUFBRSxDQUFDO0tBRWpEO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47T0FERjtBQUFBLE1BRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxNQUdBLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO09BSkY7S0FERixDQUFBO0FBQUEsSUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsSUFTQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEtBQUgsQ0FBUyxRQUFULEVBQW1CLEtBQW5CLENBVE4sQ0FBQTtXQVVBLElBWjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELE1BQUEsU0FBQTtBQUFBLEVBQUEsU0FBQSxHQUFZLE1BQVosQ0FBQTtBQUFBLEVBRUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUU1QixRQUFBLGFBQUE7O01BRnNDLFFBQVEsRUFBRSxDQUFDO0tBRWpEO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47T0FERjtBQUFBLE1BRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxNQUdBLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO09BSkY7S0FERixDQUFBO0FBQUEsSUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsSUFTQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEtBQUgsQ0FBUyxRQUFULEVBQW1CLEtBQW5CLENBVE4sQ0FBQTtXQVVBLElBWjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELE1BQUEsU0FBQTtBQUFBLEVBQUEsU0FBQSxHQUFZLFVBQVosQ0FBQTtBQUFBLEVBRUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUU1QixRQUFBLGFBQUE7O01BRnNDLFFBQVEsRUFBRSxDQUFDO0tBRWpEO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47T0FERjtBQUFBLE1BRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxNQUdBLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO09BSkY7S0FERixDQUFBO0FBQUEsSUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsSUFTQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEtBQUgsQ0FBUyxRQUFULEVBQW1CLEtBQW5CLENBVE4sQ0FBQTtXQVVBLElBWjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELE1BQUEsU0FBQTtBQUFBLEVBQUEsU0FBQSxHQUFZLGdCQUFaLENBQUE7QUFBQSxFQUVBLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFFNUIsUUFBQSxhQUFBOztNQUZzQyxRQUFRLEVBQUUsQ0FBQztLQUVqRDtBQUFBLElBQUEsUUFBQSxHQUNFO0FBQUEsTUFBQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO09BREY7QUFBQSxNQUVBLE1BQUEsRUFBUSxFQUZSO0FBQUEsTUFHQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtPQUpGO0tBREYsQ0FBQTtBQUFBLElBT0EsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBUEEsQ0FBQTtBQUFBLElBU0EsR0FBQSxHQUFNLEVBQUUsQ0FBQyxLQUFILENBQVMsUUFBVCxFQUFtQixLQUFuQixDQVROLENBQUE7V0FVQSxJQVo0QjtFQUFBLENBQTlCLENBRkEsQ0FEQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0FBLENBQUcsU0FBQyxFQUFELEdBQUE7QUFDRCxNQUFBLFNBQUE7QUFBQSxFQUFBLFNBQUEsR0FBWSxPQUFaLENBQUE7QUFBQSxFQUVBLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFFNUIsUUFBQSxhQUFBOztNQUZzQyxRQUFRLEVBQUUsQ0FBQztLQUVqRDtBQUFBLElBQUEsUUFBQSxHQUNFO0FBQUEsTUFBQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxRQUFBLEVBQVUsRUFEVjtPQURGO0FBQUEsTUFHQSxNQUFBLEVBQVEsRUFIUjtBQUFBLE1BSUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7T0FMRjtLQURGLENBQUE7QUFBQSxJQVFBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVJBLENBQUE7QUFBQSxJQVVBLEdBQUEsR0FBTSxFQUFFLENBQUMsS0FBSCxDQUFTLFFBQVQsRUFBbUIsS0FBbkIsQ0FWTixDQUFBO1dBV0EsSUFiNEI7RUFBQSxDQUE5QixDQUZBLENBREM7QUFBQSxDQUFBLENBQUgsQ0FBUyxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQW5CLElBQW1DLE1BQXRDLEdBQWtELE1BQWxELEdBQThELENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBdEIsR0FBdUMsTUFBdkMsR0FBbUQsSUFBcEQsQ0FBL0QsQ0FBeUgsQ0FBQyxFQUFuSSxDQUFBLENBQUE7Ozs7Ozs7QUNBQSxDQUFHLFNBQUMsRUFBRCxHQUFBO0FBQ0QsTUFBQSxTQUFBO0FBQUEsRUFBQSxTQUFBLEdBQVksTUFBWixDQUFBO0FBQUEsRUFFQSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsU0FBbkIsRUFBOEIsU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBRTVCLFFBQUEsYUFBQTs7TUFGc0MsUUFBUSxFQUFFLENBQUM7S0FFakQ7QUFBQSxJQUFBLFFBQUEsR0FDRTtBQUFBLE1BQUEsS0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsTUFBQSxFQUFRLEVBRFI7QUFBQSxRQUVBLFFBQUEsRUFBVSxFQUZWO09BREY7QUFBQSxNQUlBLE1BQUEsRUFBUSxFQUpSO0FBQUEsTUFLQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtPQU5GO0tBREYsQ0FBQTtBQUFBLElBU0EsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBVEEsQ0FBQTtBQUFBLElBV0EsR0FBQSxHQUFNLEVBQUUsQ0FBQyxLQUFILENBQVMsUUFBVCxFQUFtQixLQUFuQixDQVhOLENBQUE7V0FZQSxJQWQ0QjtFQUFBLENBQTlCLENBRkEsQ0FEQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0FBLENBQUcsU0FBQyxFQUFELEdBQUE7QUFDRCxNQUFBLFNBQUE7QUFBQSxFQUFBLFNBQUEsR0FBWSxRQUFaLENBQUE7QUFBQSxFQUVBLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFFNUIsUUFBQSxhQUFBOztNQUZzQyxRQUFRLEVBQUUsQ0FBQztLQUVqRDtBQUFBLElBQUEsUUFBQSxHQUNFO0FBQUEsTUFBQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO09BREY7QUFBQSxNQUVBLE1BQUEsRUFBUSxFQUZSO0FBQUEsTUFHQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtPQUpGO0tBREYsQ0FBQTtBQUFBLElBT0EsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBUEEsQ0FBQTtBQUFBLElBU0EsR0FBQSxHQUFNLEVBQUUsQ0FBQyxLQUFILENBQVMsUUFBVCxFQUFtQixLQUFuQixDQVROLENBQUE7V0FVQSxJQVo0QjtFQUFBLENBQTlCLENBRkEsQ0FEQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0FBLENBQUcsU0FBQyxFQUFELEdBQUE7QUFDRCxNQUFBLFNBQUE7QUFBQSxFQUFBLFNBQUEsR0FBWSxZQUFaLENBQUE7QUFBQSxFQUVBLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFFNUIsUUFBQSxhQUFBOztNQUZzQyxRQUFRLEVBQUUsQ0FBQztLQUVqRDtBQUFBLElBQUEsUUFBQSxHQUNFO0FBQUEsTUFBQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsUUFDQSxHQUFBLEVBQUssRUFETDtBQUFBLFFBRUEsR0FBQSxFQUFLLEVBRkw7QUFBQSxRQUdBLE1BQUEsRUFBUSxFQUhSO0FBQUEsUUFJQSxLQUFBLEVBQU8sRUFKUDtPQURGO0FBQUEsTUFNQSxNQUFBLEVBQVEsRUFOUjtBQUFBLE1BT0EsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7T0FSRjtLQURGLENBQUE7QUFBQSxJQVdBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVhBLENBQUE7QUFBQSxJQWFBLEdBQUEsR0FBTSxFQUFFLENBQUMsS0FBSCxDQUFTLFFBQVQsRUFBbUIsS0FBbkIsQ0FiTixDQUFBO1dBY0EsSUFoQjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELE1BQUEsU0FBQTtBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQVosQ0FBQTtBQUFBLEVBRUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUU1QixRQUFBLGFBQUE7O01BRnNDLFFBQVEsRUFBRSxDQUFDO0tBRWpEO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47T0FERjtBQUFBLE1BRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxNQUdBLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO09BSkY7S0FERixDQUFBO0FBQUEsSUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsSUFTQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEtBQUgsQ0FBUyxRQUFULEVBQW1CLEtBQW5CLENBVE4sQ0FBQTtXQVVBLElBWjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELE1BQUEsU0FBQTtBQUFBLEVBQUEsU0FBQSxHQUFZLFFBQVosQ0FBQTtBQUFBLEVBRUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUU1QixRQUFBLGFBQUE7O01BRnNDLFFBQVEsRUFBRSxDQUFDO0tBRWpEO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47T0FERjtBQUFBLE1BRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxNQUdBLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO09BSkY7S0FERixDQUFBO0FBQUEsSUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsSUFTQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEtBQUgsQ0FBUyxRQUFULEVBQW1CLEtBQW5CLENBVE4sQ0FBQTtXQVVBLElBWjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELE1BQUEsU0FBQTtBQUFBLEVBQUEsU0FBQSxHQUFZLFVBQVosQ0FBQTtBQUFBLEVBRUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUU1QixRQUFBLGFBQUE7O01BRnNDLFFBQVEsRUFBRSxDQUFDO0tBRWpEO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBVyxFQURYO09BREY7QUFBQSxNQUdBLE1BQUEsRUFBUSxFQUhSO0FBQUEsTUFJQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtPQUxGO0tBREYsQ0FBQTtBQUFBLElBUUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBUkEsQ0FBQTtBQUFBLElBVUEsR0FBQSxHQUFNLEVBQUUsQ0FBQyxLQUFILENBQVMsUUFBVCxFQUFtQixLQUFuQixDQVZOLENBQUE7V0FXQSxJQWI0QjtFQUFBLENBQTlCLENBRkEsQ0FEQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0FBLENBQUcsU0FBQyxFQUFELEdBQUE7QUFDRCxNQUFBLFNBQUE7QUFBQSxFQUFBLFNBQUEsR0FBWSxPQUFaLENBQUE7QUFBQSxFQUVBLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFFNUIsUUFBQSxhQUFBOztNQUZzQyxRQUFRLEVBQUUsQ0FBQztLQUVqRDtBQUFBLElBQUEsUUFBQSxHQUNFO0FBQUEsTUFBQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxJQUFBLEVBQU0sRUFETjtBQUFBLFFBRUEsS0FBQSxFQUFPLEVBRlA7QUFBQSxRQUdBLE9BQUEsRUFBUyxFQUhUO09BREY7QUFBQSxNQUtBLE1BQUEsRUFBUSxFQUxSO0FBQUEsTUFNQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtPQVBGO0tBREYsQ0FBQTtBQUFBLElBVUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBVkEsQ0FBQTtBQUFBLElBWUEsR0FBQSxHQUFNLEVBQUUsQ0FBQyxLQUFILENBQVMsUUFBVCxFQUFtQixLQUFuQixDQVpOLENBQUE7V0FhQSxJQWY0QjtFQUFBLENBQTlCLENBRkEsQ0FEQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0FBLENBQUcsU0FBQyxFQUFELEdBQUE7QUFDRCxNQUFBLFNBQUE7QUFBQSxFQUFBLFNBQUEsR0FBWSxPQUFaLENBQUE7QUFBQSxFQUVBLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFFNUIsUUFBQSxhQUFBOztNQUZzQyxRQUFRLEVBQUUsQ0FBQztLQUVqRDtBQUFBLElBQUEsUUFBQSxHQUNFO0FBQUEsTUFBQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxHQUFBLEVBQUssQ0FETDtBQUFBLFFBRUEsR0FBQSxFQUFLLEdBRkw7QUFBQSxRQUdBLEtBQUEsRUFBTyxFQUhQO0FBQUEsUUFJQSxJQUFBLEVBQU0sQ0FKTjtPQURGO0FBQUEsTUFNQSxNQUFBLEVBQVEsRUFOUjtBQUFBLE1BT0EsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7T0FSRjtLQURGLENBQUE7QUFBQSxJQVdBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVhBLENBQUE7QUFBQSxJQWFBLEdBQUEsR0FBTSxFQUFFLENBQUMsS0FBSCxDQUFTLFFBQVQsRUFBbUIsS0FBbkIsQ0FiTixDQUFBO1dBY0EsSUFoQjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELE1BQUEsU0FBQTtBQUFBLEVBQUEsU0FBQSxHQUFZLE9BQVosQ0FBQTtBQUFBLEVBRUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUU1QixRQUFBLGFBQUE7O01BRnNDLFFBQVEsRUFBRSxDQUFDO0tBRWpEO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47T0FERjtBQUFBLE1BRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxNQUdBLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO09BSkY7S0FERixDQUFBO0FBQUEsSUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsSUFTQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEtBQUgsQ0FBUyxRQUFULEVBQW1CLEtBQW5CLENBVE4sQ0FBQTtXQVVBLElBWjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELE1BQUEsU0FBQTtBQUFBLEVBQUEsU0FBQSxHQUFZLFFBQVosQ0FBQTtBQUFBLEVBRUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUU1QixRQUFBLGFBQUE7O01BRnNDLFFBQVEsRUFBRSxDQUFDO0tBRWpEO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47T0FERjtBQUFBLE1BRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxNQUdBLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO09BSkY7S0FERixDQUFBO0FBQUEsSUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsSUFTQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEtBQUgsQ0FBUyxRQUFULEVBQW1CLEtBQW5CLENBVE4sQ0FBQTtXQVVBLElBWjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELE1BQUEsU0FBQTtBQUFBLEVBQUEsU0FBQSxHQUFZLFFBQVosQ0FBQTtBQUFBLEVBRUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUU1QixRQUFBLGFBQUE7O01BRnNDLFFBQVEsRUFBRSxDQUFDO0tBRWpEO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47T0FERjtBQUFBLE1BRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxNQUdBLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO09BSkY7S0FERixDQUFBO0FBQUEsSUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsSUFTQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEtBQUgsQ0FBUyxRQUFULEVBQW1CLEtBQW5CLENBVE4sQ0FBQTtXQVVBLElBWjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELE1BQUEsU0FBQTtBQUFBLEVBQUEsU0FBQSxHQUFZLEtBQVosQ0FBQTtBQUFBLEVBRUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUU1QixRQUFBLGFBQUE7O01BRnNDLFFBQVEsRUFBRSxDQUFDO0tBRWpEO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLE9BQUEsRUFBUyxFQURUO0FBQUEsUUFFQSxTQUFBLEVBQVcsRUFGWDtPQURGO0FBQUEsTUFJQSxNQUFBLEVBQVEsRUFKUjtBQUFBLE1BS0EsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7T0FORjtLQURGLENBQUE7QUFBQSxJQVNBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVRBLENBQUE7QUFBQSxJQVdBLEdBQUEsR0FBTSxFQUFFLENBQUMsS0FBSCxDQUFTLFFBQVQsRUFBbUIsS0FBbkIsQ0FYTixDQUFBO1dBWUEsSUFkNEI7RUFBQSxDQUE5QixDQUZBLENBREM7QUFBQSxDQUFBLENBQUgsQ0FBUyxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQW5CLElBQW1DLE1BQXRDLEdBQWtELE1BQWxELEdBQThELENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBdEIsR0FBdUMsTUFBdkMsR0FBbUQsSUFBcEQsQ0FBL0QsQ0FBeUgsQ0FBQyxFQUFuSSxDQUFBLENBQUE7Ozs7Ozs7QUNBQSxDQUFHLFNBQUMsRUFBRCxHQUFBO0FBQ0QsTUFBQSxTQUFBO0FBQUEsRUFBQSxTQUFBLEdBQVksV0FBWixDQUFBO0FBQUEsRUFFQSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsU0FBbkIsRUFBOEIsU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBRTVCLFFBQUEsYUFBQTs7TUFGc0MsUUFBUSxFQUFFLENBQUM7S0FFakQ7QUFBQSxJQUFBLFFBQUEsR0FDRTtBQUFBLE1BQUEsS0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sTUFBTjtBQUFBLFFBQ0EsWUFBQSxFQUFjLElBRGQ7QUFBQSxRQUVBLFFBQUEsRUFBVSxFQUZWO09BREY7QUFBQSxNQUlBLE1BQUEsRUFBUSxFQUpSO0FBQUEsTUFLQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtPQU5GO0tBREYsQ0FBQTtBQUFBLElBU0EsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBVEEsQ0FBQTtBQUFBLElBV0EsR0FBQSxHQUFNLEVBQUUsQ0FBQyxLQUFILENBQVMsUUFBVCxFQUFtQixLQUFuQixDQVhOLENBQUE7V0FZQSxJQWQ0QjtFQUFBLENBQTlCLENBRkEsQ0FEQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0FBLENBQUcsU0FBQyxFQUFELEdBQUE7QUFDRCxNQUFBLFNBQUE7QUFBQSxFQUFBLFNBQUEsR0FBWSxNQUFaLENBQUE7QUFBQSxFQUVBLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFFNUIsUUFBQSxhQUFBOztNQUZzQyxRQUFRLEVBQUUsQ0FBQztLQUVqRDtBQUFBLElBQUEsUUFBQSxHQUNFO0FBQUEsTUFBQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO09BREY7QUFBQSxNQUVBLE1BQUEsRUFBUSxFQUZSO0FBQUEsTUFHQSxNQUFBLEVBQ0U7QUFBQSxRQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtPQUpGO0tBREYsQ0FBQTtBQUFBLElBT0EsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBUEEsQ0FBQTtBQUFBLElBU0EsR0FBQSxHQUFNLEVBQUUsQ0FBQyxLQUFILENBQVMsUUFBVCxFQUFtQixLQUFuQixDQVROLENBQUE7V0FVQSxJQVo0QjtFQUFBLENBQTlCLENBRkEsQ0FEQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0FBLENBQUcsU0FBQyxFQUFELEdBQUE7QUFDRCxNQUFBLFNBQUE7QUFBQSxFQUFBLFNBQUEsR0FBWSxLQUFaLENBQUE7QUFBQSxFQUVBLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFFNUIsUUFBQSxhQUFBOztNQUZzQyxRQUFRLEVBQUUsQ0FBQztLQUVqRDtBQUFBLElBQUEsUUFBQSxHQUNFO0FBQUEsTUFBQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxPQUFBLEVBQVMsRUFEVDtBQUFBLFFBRUEsU0FBQSxFQUFXLEVBRlg7T0FERjtBQUFBLE1BSUEsTUFBQSxFQUFRLEVBSlI7QUFBQSxNQUtBLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO09BTkY7S0FERixDQUFBO0FBQUEsSUFTQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FUQSxDQUFBO0FBQUEsSUFXQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEtBQUgsQ0FBUyxRQUFULEVBQW1CLEtBQW5CLENBWE4sQ0FBQTtXQVlBLElBZDRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELE1BQUEsU0FBQTtBQUFBLEVBQUEsU0FBQSxHQUFZLE1BQVosQ0FBQTtBQUFBLEVBRUEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUU1QixRQUFBLGFBQUE7O01BRnNDLFFBQVEsRUFBRSxDQUFDO0tBRWpEO0FBQUEsSUFBQSxRQUFBLEdBQ0U7QUFBQSxNQUFBLEtBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47T0FERjtBQUFBLE1BRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxNQUdBLE1BQUEsRUFDRTtBQUFBLFFBQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO09BSkY7S0FERixDQUFBO0FBQUEsSUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsSUFTQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEtBQUgsQ0FBUyxRQUFULEVBQW1CLEtBQW5CLENBVE4sQ0FBQTtXQVVBLElBWjRCO0VBQUEsQ0FBOUIsQ0FGQSxDQURDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQ0EsQ0FBRyxTQUFDLFVBQUQsR0FBQTtBQUVELE1BQUEsMERBQUE7QUFBQSxFQUFBLE9BQUEsR0FBVSxVQUFVLENBQUMsTUFBckIsQ0FBQTtBQUFBLEVBQ0EsYUFBQSxHQUFnQixJQURoQixDQUFBO0FBR0E7QUFBQTs7S0FIQTtBQUFBLEVBTUEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQU0sQ0FBQSxTQUE5QixFQUNFO0FBQUEsSUFBQSxlQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxTQUFBLEdBQUE7QUFDTCxZQUFBLHNCQUFBO0FBQUEsUUFBQSxhQUFBLEdBQWdCLG9CQUFoQixDQUFBO0FBQUEsUUFDQSxPQUFBLEdBQVcsYUFBYyxDQUFDLElBQWhCLENBQXFCLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBLENBQXJCLENBRFYsQ0FBQTtBQUVDLFFBQUEsSUFBSSxPQUFBLElBQVksT0FBTyxDQUFDLE1BQVIsR0FBaUIsQ0FBakM7aUJBQXlDLE9BQVEsQ0FBQSxDQUFBLEVBQWpEO1NBQUEsTUFBQTtpQkFBeUQsR0FBekQ7U0FISTtNQUFBLENBQVA7S0FERjtHQURGLENBTkEsQ0FBQTtBQWNBO0FBQUE7O0tBZEE7QUFBQSxFQWlCQSxNQUFBLEdBQVMsRUFqQlQsQ0FBQTtBQUFBLEVBa0JBLFlBQUEsR0FBZSxTQUFBLEdBQUE7QUFFYjtBQUFBOztPQUFBO0FBQUEsUUFBQSwyQ0FBQTtBQUFBLElBR0EsYUFBQSxHQUFnQixTQUFDLFNBQUQsRUFBWSxJQUFaLEdBQUE7QUFDZDtBQUFBOztTQUFBO0FBQUEsVUFBQSxXQUFBO0FBQUEsTUFHQSxJQUFBLEdBQU8sU0FBQyxNQUFELEdBQUE7QUFDTCxZQUFBLHNCQUFBO0FBQUEsUUFBQSxLQUFBLEdBQVEsSUFBUixDQUFBO0FBQUEsUUFDQSxJQUFLLENBQUEsTUFBQSxDQUFMLEdBQWUsSUFBSyxDQUFBLE1BQUEsQ0FBTCxJQUFnQixFQUQvQixDQUFBO0FBQUEsUUFFQSxNQUFBLEdBQVMsSUFBSyxDQUFBLE1BQUEsQ0FGZCxDQUFBO0FBQUEsUUFHQSxPQUFBLEdBQVUsRUFIVixDQUFBO0FBQUEsUUFLQSxNQUFNLENBQUMsY0FBUCxDQUFzQixJQUF0QixFQUE0QixTQUE1QixFQUF1QztBQUFBLFVBQUEsS0FBQSxFQUFPLE9BQVA7U0FBdkMsQ0FMQSxDQUFBO0FBT0E7QUFBQTs7O1dBUEE7QUFBQSxRQVdBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLFVBQTVCLEVBQ0U7QUFBQSxVQUFBLEtBQUEsRUFBTyxTQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksVUFBWixHQUFBO0FBQ0wsWUFBQSxZQUFBLENBQUE7QUFDQSxZQUFBLElBQXdFLENBQUMsTUFBQSxDQUFBLElBQUEsS0FBaUIsUUFBbEIsQ0FBQSxJQUErQixJQUFBLEtBQVEsRUFBL0c7QUFBQSxvQkFBVSxJQUFBLEtBQUEsQ0FBTSxrREFBTixDQUFWLENBQUE7YUFEQTtBQUVBLFlBQUEsSUFBQSxDQUFBLEdBQUE7QUFBQSxvQkFBVSxJQUFBLEtBQUEsQ0FBTSwrREFBTixDQUFWLENBQUE7YUFGQTtBQUdBLFlBQUEsSUFBNEYsS0FBTSxDQUFBLElBQUEsQ0FBbEc7QUFBQSxvQkFBVSxJQUFBLEtBQUEsQ0FBTSxpQkFBQSxHQUFvQixJQUFwQixHQUEyQix5QkFBM0IsR0FBdUQsU0FBdkQsR0FBbUUsR0FBekUsQ0FBVixDQUFBO2FBSEE7QUFBQSxZQUtBLE9BQVEsQ0FBQSxJQUFBLENBQVIsR0FBZ0IsT0FBUSxDQUFBLElBQUEsQ0FBUixJQUFpQixJQUxqQyxDQUFBO0FBQUEsWUFRQSxNQUFPLENBQUEsSUFBQSxDQUFQLEdBQWUsTUFBTyxDQUFBLElBQUEsQ0FBUCxJQUNiO0FBQUEsY0FBQSxJQUFBLEVBQU0sSUFBTjtBQUFBLGNBQ0EsSUFBQSxFQUFNLE1BQUEsQ0FBQSxHQUROO0FBQUEsY0FFQSxRQUFBLEVBQVUsQ0FBSSxHQUFHLENBQUMsZUFBUCxHQUE0QixHQUFHLENBQUMsZUFBSixDQUFBLENBQTVCLEdBQXVELFNBQXhELENBRlY7YUFURixDQUFBO0FBQUEsWUFhQSxNQUFNLENBQUMsY0FBUCxDQUFzQixLQUF0QixFQUE2QixJQUE3QixFQUNFO0FBQUEsY0FBQSxLQUFBLEVBQU8sR0FBUDtBQUFBLGNBQ0EsVUFBQSxFQUFZLEtBQUEsS0FBVyxVQUR2QjthQURGLENBYkEsQ0FBQTtBQUFBLFlBaUJBLFVBQVUsQ0FBQyxlQUFYLENBQTJCLE1BQUEsR0FBUyxHQUFULEdBQWUsU0FBZixHQUEyQixHQUEzQixHQUFpQyxJQUE1RCxDQWpCQSxDQUFBO21CQWtCQSxJQW5CSztVQUFBLENBQVA7U0FERixDQVhBLENBQUE7QUFrQ0E7QUFBQTs7V0FsQ0E7QUFBQSxRQXFDQSxLQUFLLENBQUMsUUFBTixDQUFlLGtCQUFmLEVBQW1DLENBQUMsU0FBQyxZQUFELEdBQUE7QUFDbEMsVUFBQSxZQUFBLENBQUE7QUFBQSxjQUFBLFlBQUE7QUFDQSxVQUFBLElBQStFLENBQUMsTUFBQSxDQUFBLFlBQUEsS0FBeUIsUUFBMUIsQ0FBQSxJQUF1QyxZQUFBLEtBQWdCLEVBQXRJO0FBQUEsa0JBQVUsSUFBQSxLQUFBLENBQU0seURBQU4sQ0FBVixDQUFBO1dBREE7QUFFQSxVQUFBLElBQXlHLEtBQUssQ0FBQyxZQUEvRztBQUFBLGtCQUFVLElBQUEsS0FBQSxDQUFNLHNCQUFBLEdBQXlCLFlBQXpCLEdBQXdDLHlCQUF4QyxHQUFvRSxTQUFwRSxHQUFnRixHQUF0RixDQUFWLENBQUE7V0FGQTtBQUFBLFVBR0EsVUFBVSxDQUFDLGVBQVgsQ0FBMkIsTUFBQSxHQUFTLEdBQVQsR0FBZSxZQUExQyxDQUhBLENBQUE7QUFBQSxVQUlBLFlBQUEsR0FBZSxhQUFBLENBQWMsWUFBZCxFQUE0QixNQUE1QixDQUpmLENBQUE7QUFLQSxVQUFBLElBQWlGLFlBQUEsS0FBa0IsV0FBbkc7QUFBQSxZQUFBLFlBQVksQ0FBQyxRQUFiLENBQXNCLFdBQXRCLEVBQW1DLGFBQUEsQ0FBYyxXQUFkLEVBQTJCLE1BQTNCLENBQW5DLEVBQXVFLEtBQXZFLENBQUEsQ0FBQTtXQUxBO0FBQUEsVUFNQSxLQUFLLENBQUMsUUFBTixDQUFlLFlBQWYsRUFBNkIsWUFBN0IsRUFBMkMsS0FBM0MsQ0FOQSxDQUFBO2lCQU9BLGFBUmtDO1FBQUEsQ0FBRCxDQUFuQyxFQVNHLEtBVEgsQ0FyQ0EsQ0FESztNQUFBLENBSFAsQ0FBQTtBQXFEQTtBQUFBOzs7OztTQXJEQTtBQUFBLE1BMkRBLEtBQUEsR0FBWSxJQUFBLFFBQUEsQ0FBUyxrQkFBQSxHQUFxQixTQUFyQixHQUFpQyxNQUExQyxDQUFBLENBQUEsQ0EzRFosQ0FBQTtBQUFBLE1BNERBLEtBQUssQ0FBQSxTQUFMLEdBQWMsSUFBQSxJQUFBLENBQUssU0FBTCxDQTVEZCxDQUFBO2FBK0RJLElBQUEsS0FBQSxDQUFNLFNBQU4sRUFoRVU7SUFBQSxDQUhoQixDQUFBO0FBcUVBO0FBQUE7OztPQXJFQTtBQUFBLElBeUVBLFNBQUEsR0FBWSxTQUFDLFlBQUQsRUFBZSxRQUFmLEVBQXlCLE9BQXpCLEdBQUE7QUFDVixNQUFBLFlBQUEsQ0FBQTtBQUFBLFVBQUEsdUJBQUE7QUFBQSxNQUNBLEdBQUEsR0FBTSxLQUROLENBQUE7QUFBQSxNQUVBLFNBQUEsR0FBWSxVQUFVLENBQUMsWUFBWCxDQUFBLENBRlosQ0FBQTtBQUdBLE1BQUEsSUFBRyxZQUFBLElBQWlCLFlBQVksQ0FBQyxNQUFiLEdBQXNCLENBQXZDLElBQTZDLFFBQWhEO0FBQ0UsUUFBQSxPQUFBLEdBQVUsWUFBWSxDQUFDLE1BQWIsQ0FBb0IsU0FBQyxLQUFELEdBQUE7aUJBQzVCLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEtBQWxCLENBQUEsS0FBNEIsQ0FBQSxDQUE1QixJQUFtQyxDQUFDLENBQUEsT0FBQSxJQUFlLE9BQUEsS0FBYSxLQUE3QixFQURQO1FBQUEsQ0FBcEIsQ0FBVixDQUFBO0FBR0EsUUFBQSxJQUFHLE9BQU8sQ0FBQyxNQUFSLEtBQWtCLENBQXJCO0FBQ0UsVUFBQSxHQUFBLEdBQU0sSUFBTixDQUFBO0FBQUEsVUFDQSxRQUFBLENBQUEsQ0FEQSxDQURGO1NBQUEsTUFBQTtBQUlFLFVBQUEsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUF0QixDQUEyQixTQUFDLE9BQUQsR0FBQTttQkFDekIsU0FBQSxDQUFVLE9BQVYsRUFBbUIsUUFBbkIsRUFBNkIsT0FBN0IsRUFEeUI7VUFBQSxDQUEzQixDQUFBLENBSkY7U0FKRjtPQUhBO2FBY0EsSUFmVTtJQUFBLENBekVaLENBQUE7QUFBQSxJQXlGQSxVQUFBLEdBQWE7QUFBQSxNQUFBLFVBQUEsRUFBWSxFQUFaO0tBekZiLENBQUE7QUEyRkE7QUFBQTs7T0EzRkE7QUFBQSxJQThGQSxNQUFNLENBQUMsY0FBUCxDQUFzQixVQUF0QixFQUFrQyxjQUFsQyxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sU0FBQSxHQUFBO0FBQ0wsWUFBQSxvQkFBQTtBQUFBLFFBQUEsV0FBQSxHQUFjLFNBQUMsR0FBRCxFQUFNLE9BQU4sR0FBQTtBQUNaLFVBQUEsSUFBcUMsTUFBQSxDQUFBLEdBQUEsS0FBZ0IsUUFBckQ7QUFBQSxZQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsT0FBQSxHQUFVLEdBQVYsR0FBZ0IsR0FBN0IsQ0FBQSxDQUFBO1dBQUE7QUFDQSxVQUFBLElBQUcsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsR0FBdEIsQ0FBSDtBQUNFLFlBQUEsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLENBQWdCLENBQUMsT0FBakIsQ0FBeUIsU0FBQyxDQUFELEdBQUE7QUFDdkIsY0FBQSxJQUFtQyxNQUFBLENBQUEsQ0FBQSxLQUFjLFFBQWpEO0FBQUEsZ0JBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxPQUFBLEdBQVUsR0FBVixHQUFnQixDQUE3QixDQUFBLENBQUE7ZUFBQTtBQUNBLGNBQUEsSUFBMEMsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsR0FBSSxDQUFBLENBQUEsQ0FBMUIsQ0FBMUM7QUFBQSxnQkFBQSxXQUFBLENBQVksR0FBSSxDQUFBLENBQUEsQ0FBaEIsRUFBb0IsT0FBQSxHQUFVLEdBQVYsR0FBZ0IsQ0FBcEMsQ0FBQSxDQUFBO2VBRnVCO1lBQUEsQ0FBekIsQ0FBQSxDQURGO1dBRlk7UUFBQSxDQUFkLENBQUE7QUFBQSxRQVNBLE9BQUEsR0FBVSxFQVRWLENBQUE7QUFBQSxRQVVBLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBTyxDQUFBLGFBQUEsQ0FBbkIsQ0FBa0MsQ0FBQyxPQUFuQyxDQUEyQyxTQUFDLEdBQUQsR0FBQTtBQUN6QyxVQUFBLElBQTBELE9BQU8sQ0FBQyxhQUFSLENBQXNCLE1BQU8sQ0FBQSxhQUFBLENBQWUsQ0FBQSxHQUFBLENBQTVDLENBQTFEO0FBQUEsWUFBQSxXQUFBLENBQVksTUFBTyxDQUFBLGFBQUEsQ0FBZSxDQUFBLEdBQUEsQ0FBbEMsRUFBd0MsYUFBeEMsQ0FBQSxDQUFBO1dBRHlDO1FBQUEsQ0FBM0MsQ0FWQSxDQUFBO2VBY0EsUUFmSztNQUFBLENBQVA7S0FERixDQTlGQSxDQUFBO0FBZ0hBO0FBQUE7O09BaEhBO0FBQUEsSUFtSEEsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsVUFBdEIsRUFBa0MsaUJBQWxDLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxTQUFDLE9BQUQsR0FBQTtBQUNMLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBdEIsQ0FBNkIsU0FBQyxLQUFELEdBQUE7aUJBQ2xDLEtBQUEsS0FBUyxLQUFBLENBQU0sT0FBTixFQUR5QjtRQUFBLENBQTdCLENBQVAsQ0FBQTtBQUdBLFFBQUEsSUFBaUMsS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLENBQWpDO0FBQUEsVUFBQSxVQUFVLENBQUMsVUFBWCxHQUF3QixJQUF4QixDQUFBO1NBSks7TUFBQSxDQUFQO0tBREYsQ0FuSEEsQ0FBQTtBQUFBLElBNEhBLE1BQU8sQ0FBQSxhQUFBLENBQVAsR0FBd0IsRUE1SHhCLENBQUE7QUFBQSxJQThIQSxLQUFBLEdBQVEsYUFBQSxDQUFjLGFBQWQsRUFBNkIsTUFBTyxDQUFBLGFBQUEsQ0FBcEMsQ0E5SFIsQ0FBQTtBQWdJQTtBQUFBOztPQWhJQTtBQUFBLElBbUlBLEtBQUssQ0FBQyxRQUFOLENBQWUsR0FBZixFQUFvQixPQUFwQixFQUE2QixLQUE3QixDQW5JQSxDQUFBO0FBcUlBO0FBQUE7O09BcklBO0FBQUEsSUF3SUEsS0FBSyxDQUFDLFFBQU4sQ0FBZSxNQUFmLEVBQXVCLE1BQU8sQ0FBQSxhQUFBLENBQTlCLEVBQThDLEtBQTlDLENBeElBLENBQUE7QUEwSUE7QUFBQTs7T0ExSUE7QUFBQSxJQTZJQSxLQUFLLENBQUMsUUFBTixDQUFlLE1BQWYsRUFBdUIsYUFBdkIsRUFBc0MsS0FBdEMsQ0E3SUEsQ0FBQTtBQUFBLElBOElBLEtBQUssQ0FBQyxRQUFOLENBQWUsV0FBZixFQUE0QixTQUE1QixFQUF1QyxLQUF2QyxDQTlJQSxDQUFBO1dBK0lBLE1BakphO0VBQUEsQ0FsQmYsQ0FBQTtBQXNLQTtBQUFBOztLQXRLQTtBQUFBLEVBeUtBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLFVBQXRCLEVBQWtDLGFBQWxDLEVBQ0U7QUFBQSxJQUFBLEtBQUEsRUFBTyxZQUFBLENBQUEsQ0FBUDtHQURGLENBektBLENBQUE7QUFBQSxFQTRLQSxFQUFFLENBQUMsUUFBSCxDQUFZLFFBQVosRUFBc0IsVUFBdEIsQ0E1S0EsQ0FBQTtBQUFBLEVBOEtBLFlBQUEsR0FBZSxFQTlLZixDQUFBO0FBK0tBLEVBQUEsSUFBRyxNQUFBLENBQUEsUUFBQSxLQUFxQixXQUF4QjtBQUNFLElBQUEsWUFBQSxHQUFlLFFBQWYsQ0FERjtHQS9LQTtBQUFBLEVBa0xBLEVBQUUsQ0FBQyxRQUFILENBQVksVUFBWixFQUF3QixZQUF4QixDQWxMQSxDQUFBO1NBb0xBLEVBQUUsQ0FBQyxRQUFILENBQVksTUFBWixFQUFvQixTQUFBLEdBQUEsQ0FBcEIsRUF0TEM7QUFBQSxDQUFBLENBQUgsQ0FBaUIsQ0FBSyxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF2QyxHQUFvRCxNQUFwRCxHQUFnRSxDQUFLLE1BQUEsQ0FBQSxJQUFBLEtBQWlCLFdBQWpCLElBQWlDLElBQXJDLEdBQWdELElBQWhELEdBQTBELENBQUssTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdkMsR0FBb0QsTUFBcEQsR0FBZ0UsSUFBakUsQ0FBM0QsQ0FBakUsQ0FBakIsQ0FBQSxDQUFBOzs7Ozs7O0FDQ0EsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUlELE1BQUEsYUFBQTtBQUFBLEVBQUEsYUFBQSxHQUFnQixDQUNkLFFBRGMsRUFFZCxPQUZjLEVBR2QsSUFIYyxFQUlkLFlBSmMsRUFLZCxJQUxjLEVBTWQsT0FOYyxFQU9kLElBUGMsRUFRZCxZQVJjLEVBU2QsVUFUYyxFQVVkLFFBVmMsRUFXZCxlQVhjLEVBWWQsU0FaYyxFQWFkLFFBYmMsRUFjZCxPQWRjLENBQWhCLENBQUE7QUFBQSxFQXFCQSxDQUFDLENBQUMsSUFBRixDQUFPLGFBQVAsRUFBc0IsU0FBQyxJQUFELEdBQUE7V0FDcEIsRUFBRSxDQUFDLGdCQUFILENBQW9CLElBQXBCLEVBRG9CO0VBQUEsQ0FBdEIsQ0FyQkEsQ0FBQTtBQUFBLEVBMkJBLEVBQUcsQ0FBQSxxQkFBQSxDQUFILEdBQTRCLEtBM0I1QixDQUFBO0FBQUEsRUE2QkEsRUFBRyxDQUFBLGlDQUFBLENBQUgsR0FBd0MsS0E3QnhDLENBQUE7QUFBQSxFQStCQSxFQUFHLENBQUEsZ0JBQUEsQ0FBSCxHQUF1QixLQS9CdkIsQ0FBQTtBQUFBLEVBaUNBLEVBQUcsQ0FBQSxjQUFBLENBQUgsR0FBcUIsS0FqQ3JCLENBQUE7QUFBQSxFQW1DQSxFQUFHLENBQUEscUJBQUEsQ0FBSCxHQUE0QixLQW5DNUIsQ0FKQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0ZBLENBQUcsU0FBQyxFQUFELEdBQUE7QUFFRCxNQUFBLE9BQUE7QUFBQSxFQUFBLE9BQUEsR0FBVSxTQUFDLFVBQUQsRUFBYSxTQUFiLEdBQUE7QUFDUixRQUFBLHVDQUFBO0FBQUEsSUFBQSxLQUFBLEdBQVEsRUFBUixDQUFBO0FBQUEsSUFDQSxTQUFBLEdBQVksQ0FEWixDQUFBO0FBQUEsSUFFQSxRQUFBLEdBQVcsQ0FGWCxDQUFBO0FBQUEsSUFJQSxHQUFBLEdBQ0U7QUFBQSxNQUFBLEdBQUEsRUFBSyxTQUFDLEtBQUQsRUFBUSxLQUFSLEdBQUE7ZUFDSCxNQUFBLENBQU8sS0FBUCxFQUFjLEtBQWQsRUFERztNQUFBLENBQUw7QUFBQSxNQUVBLEdBQUEsRUFBSyxTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsR0FBZixHQUFBO0FBQ0gsWUFBQSxjQUFBO0FBQUEsUUFBQSxHQUFHLENBQUMsR0FBSixDQUFRLEtBQVIsRUFBZSxLQUFmLENBQUEsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLEtBQUEsR0FBTSxDQURmLENBQUE7QUFBQSxRQUVBLE1BQUEsR0FBUyxLQUFBLEdBQU0sQ0FGZixDQUFBO2VBR0EsS0FBTSxDQUFBLE1BQUEsQ0FBUSxDQUFBLE1BQUEsQ0FBZCxHQUF3QixJQUpyQjtNQUFBLENBRkw7QUFBQSxNQU9BLElBQUEsRUFBTSxTQUFDLFFBQUQsR0FBQTtlQUNKLENBQUMsQ0FBQyxJQUFGLENBQU8sS0FBUCxFQUFjLFNBQUMsT0FBRCxFQUFVLEdBQVYsR0FBQTtpQkFDWixDQUFDLENBQUMsSUFBRixDQUFPLEtBQU0sQ0FBQSxHQUFBLENBQWIsRUFBbUIsU0FBQyxHQUFELEVBQU0sR0FBTixHQUFBO0FBQ2pCLGdCQUFBLGNBQUE7QUFBQSxZQUFBLE1BQUEsR0FBUyxHQUFBLEdBQUksQ0FBYixDQUFBO0FBQUEsWUFDQSxNQUFBLEdBQVMsR0FBQSxHQUFJLENBRGIsQ0FBQTttQkFFQSxRQUFBLENBQVMsTUFBVCxFQUFpQixNQUFqQixFQUF5QixHQUF6QixFQUhpQjtVQUFBLENBQW5CLEVBRFk7UUFBQSxDQUFkLEVBREk7TUFBQSxDQVBOO0FBQUEsTUFhQSxLQUFBLEVBQU8sU0FBQSxHQUFBO2VBQ0wsU0FESztNQUFBLENBYlA7QUFBQSxNQWVBLE1BQUEsRUFBUSxTQUFBLEdBQUE7ZUFDTixVQURNO01BQUEsQ0FmUjtLQUxGLENBQUE7QUF1QkE7QUFBQTs7T0F2QkE7QUFBQSxJQTBCQSxNQUFBLEdBQVMsU0FBQyxNQUFELEVBQVMsS0FBVCxHQUFBO0FBQ1AsVUFBQSxTQUFBO0FBQUEsTUFBQSxJQUFHLENBQUEsTUFBQSxJQUFjLE1BQUEsR0FBUyxDQUExQjtBQUFpQyxRQUFBLE1BQUEsR0FBUyxDQUFULENBQWpDO09BQUE7QUFDQSxNQUFBLElBQUcsQ0FBQSxLQUFBLElBQWEsS0FBQSxHQUFRLENBQXhCO0FBQStCLFFBQUEsS0FBQSxHQUFRLENBQVIsQ0FBL0I7T0FEQTtBQUdBLE1BQUEsSUFBRyxTQUFBLEdBQVksTUFBZjtBQUEyQixRQUFBLFNBQUEsR0FBWSxNQUFaLENBQTNCO09BSEE7QUFJQSxNQUFBLElBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxTQUFsQjtBQUFpQyxRQUFBLFNBQUEsR0FBWSxLQUFLLENBQUMsTUFBbEIsQ0FBakM7T0FKQTtBQUtBLE1BQUEsSUFBRyxRQUFBLEdBQVcsS0FBZDtBQUF5QixRQUFBLFFBQUEsR0FBVyxLQUFYLENBQXpCO09BTEE7QUFBQSxNQU1BLENBQUEsR0FBSSxDQU5KLENBQUE7QUFRQSxhQUFNLENBQUEsR0FBSSxTQUFWLEdBQUE7QUFDRSxRQUFBLE1BQUEsR0FBUyxLQUFNLENBQUEsQ0FBQSxDQUFmLENBQUE7QUFDQSxRQUFBLElBQUcsQ0FBQSxNQUFIO0FBQ0UsVUFBQSxNQUFBLEdBQVMsRUFBVCxDQUFBO0FBQUEsVUFDQSxLQUFLLENBQUMsSUFBTixDQUFXLE1BQVgsQ0FEQSxDQURGO1NBREE7QUFJQSxRQUFBLElBQUcsUUFBQSxHQUFXLE1BQU0sQ0FBQyxNQUFyQjtBQUFpQyxVQUFBLFFBQUEsR0FBVyxNQUFNLENBQUMsTUFBbEIsQ0FBakM7U0FKQTtBQUtBLFFBQUEsSUFBRyxNQUFNLENBQUMsTUFBUCxHQUFnQixRQUFuQjtBQUFpQyxVQUFBLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLFFBQWhCLENBQWpDO1NBTEE7QUFBQSxRQU1BLENBQUEsSUFBSyxDQU5MLENBREY7TUFBQSxDQVJBO2FBaUJBLEtBQU0sQ0FBQSxNQUFBLEdBQU8sQ0FBUCxDQUFVLENBQUEsS0FBQSxHQUFNLENBQU4sRUFsQlQ7SUFBQSxDQTFCVCxDQUFBO0FBQUEsSUE4Q0EsTUFBQSxDQUFPLFVBQVAsRUFBbUIsU0FBbkIsQ0E5Q0EsQ0FBQTtXQWdEQSxJQWpEUTtFQUFBLENBQVYsQ0FBQTtBQUFBLEVBa0RBLEVBQUUsQ0FBQyxRQUFILENBQVksU0FBWixFQUF1QixPQUF2QixDQWxEQSxDQUZDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDQUEsSUFBQSxrQkFBQTs7QUFBQSxDQUFHLFNBQUMsRUFBRCxHQUFBO0FBQ0QsTUFBQSw4QkFBQTtBQUFBLEVBQUEsT0FBQSxHQUFVLENBQ1IsUUFEUSxFQUVSLE9BRlEsRUFHUixPQUhRLEVBSVIsT0FKUSxFQUtSLEtBTFEsRUFNUixRQU5RLEVBT1IsT0FQUSxFQVFSLFdBUlEsRUFTUixPQVRRLEVBVVIsZ0JBVlEsRUFXUixVQVhRLEVBWVIsTUFaUSxFQWFSLEtBYlEsRUFjUixRQWRRLEVBZVIsU0FmUSxFQWdCUixZQWhCUSxFQWlCUixPQWpCUSxFQWtCUixNQWxCUSxFQW1CUixTQW5CUSxFQW9CUixXQXBCUSxFQXFCUixVQXJCUSxFQXNCUixhQXRCUSxFQXVCUixPQXZCUSxFQXdCUixNQXhCUSxDQUFWLENBQUE7QUFBQSxFQTBCQSxZQUFBLEdBQWUsT0FBTyxDQUFDLE1BMUJ2QixDQUFBO0FBQUEsRUEyQkEsT0FBQSxHQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBVixJQUFxQixFQTNCL0IsQ0FBQTtBQUFBLEVBNEJBLEVBQUUsQ0FBQyxnQkFBSCxDQUFvQixTQUFwQixDQTVCQSxDQUFBO0FBOEJBO0FBQUE7OztLQTlCQTtBQWtDQSxTQUFNLFlBQUEsRUFBTixHQUFBO0FBQ0UsSUFBQSxDQUFDLFNBQUEsR0FBQTtBQUNDLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLE9BQVEsQ0FBQSxZQUFBLENBQWpCLENBQUE7QUFHQSxNQUFBLElBQUEsQ0FBQSxPQUF5QyxDQUFBLE1BQUEsQ0FBekM7QUFBQSxRQUFBLE9BQVEsQ0FBQSxNQUFBLENBQVIsR0FBa0IsRUFBRSxDQUFDLElBQXJCLENBQUE7T0FIQTthQU1BLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBWCxDQUFvQixNQUFwQixFQUE0QixTQUFBLEdBQUE7QUFDMUIsWUFBQSxNQUFBO0FBQUEsUUFEMkIsZ0VBQzNCLENBQUE7ZUFBQSxPQUFRLENBQUEsTUFBQSxDQUFSLGdCQUFnQixNQUFoQixFQUQwQjtNQUFBLENBQTVCLEVBUEQ7SUFBQSxDQUFELENBQUEsQ0FBQSxDQUFBLENBREY7RUFBQSxDQW5DQztBQUFBLENBQUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQTs7Ozs7OztBQ0FBLENBQUcsU0FBQyxFQUFELEdBQUE7QUFFRDtBQUFBOzs7Ozs7Ozs7O0tBQUE7QUFBQSxNQUFBLE9BQUE7QUFXQSxFQUFBLElBQUcsQ0FBQSxDQUFBLElBQVMsQ0FBQSxDQUFLLENBQUMsTUFBbEI7QUFDRSxVQUFVLElBQUEsS0FBQSxDQUFNLHlDQUFOLENBQVYsQ0FERjtHQVhBO0FBQUEsRUFhQSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFsQixHQUEyQixLQWIzQixDQUFBO0FBQUEsRUFlQSxPQUFBLEdBQVUsRUFmVixDQUFBO0FBQUEsRUFpQkEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLEtBQW5CLEVBQTBCLFNBQUMsVUFBRCxFQUFhLElBQWIsR0FBQTtBQUN4QixRQUFBLEdBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxFQUFOLENBQUE7QUFDQSxJQUFBLElBQUcsVUFBSDtBQUNFLE1BQUEsSUFBRyxJQUFIO0FBQ0UsUUFBQSxHQUFBLEdBQU0sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxVQUFULEVBQXFCLElBQXJCLENBQU4sQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLEdBQUEsR0FBTSxDQUFDLENBQUMsTUFBRixDQUFTLFVBQVQsQ0FBTixDQUhGO09BQUE7QUFJQSxNQUFBLElBQUcsR0FBSDtlQUNFLE9BQVEsQ0FBQSxVQUFBLENBQVIsR0FBc0IsSUFEeEI7T0FMRjtLQUZ3QjtFQUFBLENBQTFCLENBakJBLENBQUE7QUFBQSxFQTJCQSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsS0FBbkIsRUFBMEIsU0FBQSxHQUFBO0FBQ3hCLFFBQUEsR0FBQTtBQUFBLElBQUEsR0FBQSxHQUFNLENBQUMsQ0FBQyxNQUFGLENBQUEsQ0FBTixDQUFBO1dBQ0EsSUFGd0I7RUFBQSxDQUExQixDQTNCQSxDQUFBO0FBQUEsRUErQkEsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLEtBQW5CLEVBQTBCLFNBQUMsVUFBRCxFQUFhLEtBQWIsRUFBb0IsSUFBcEIsR0FBQTtBQUN4QixRQUFBLEdBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxFQUFOLENBQUE7QUFDQSxJQUFBLElBQUcsVUFBSDtBQUNFLE1BQUEsT0FBUSxDQUFBLFVBQUEsQ0FBUixHQUFzQixLQUF0QixDQUFBO0FBQ0EsTUFBQSxJQUFHLElBQUg7QUFDRSxRQUFBLEdBQUEsR0FBTSxDQUFDLENBQUMsTUFBRixDQUFTLFVBQVQsRUFBcUIsS0FBckIsRUFBNEIsSUFBNUIsQ0FBTixDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsR0FBQSxHQUFNLENBQUMsQ0FBQyxNQUFGLENBQVMsVUFBVCxFQUFxQixLQUFyQixDQUFOLENBSEY7T0FGRjtLQURBO1dBT0EsSUFSd0I7RUFBQSxDQUExQixDQS9CQSxDQUFBO0FBQUEsRUF5Q0MsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFFBQW5CLEVBQTZCLFNBQUMsVUFBRCxFQUFhLElBQWIsR0FBQTtBQUM1QixJQUFBLElBQUcsVUFBSDtBQUNFLE1BQUEsSUFBRyxJQUFIO0FBQ0UsUUFBQSxDQUFDLENBQUMsWUFBRixDQUFlLFVBQWYsRUFBMkIsSUFBM0IsQ0FBQSxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsQ0FBQyxDQUFDLFlBQUYsQ0FBZSxVQUFmLENBQUEsQ0FIRjtPQUFBO0FBQUEsTUFJQSxNQUFBLENBQUEsT0FBZSxDQUFBLFVBQUEsQ0FKZixDQURGO0tBRDRCO0VBQUEsQ0FBN0IsQ0F6Q0QsQ0FBQTtBQUFBLEVBa0RBLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixXQUFuQixFQUFnQyxTQUFBLEdBQUE7QUFDOUIsSUFBQSxPQUFBLEdBQVUsRUFBVixDQUFBO0FBQUEsSUFDQSxFQUFFLENBQUMsSUFBSCxDQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBbEIsRUFBdUIsU0FBQyxHQUFELEVBQU0sR0FBTixHQUFBO2FBQ3JCLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBRCxDQUFULENBQWlCLEdBQWpCLEVBRHFCO0lBQUEsQ0FBdkIsQ0FEQSxDQUQ4QjtFQUFBLENBQWhDLENBbERBLENBRkM7QUFBQSxDQUFBLENBQUgsQ0FBUyxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQW5CLElBQW1DLE1BQXRDLEdBQWtELE1BQWxELEdBQThELENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBdEIsR0FBdUMsTUFBdkMsR0FBbUQsSUFBcEQsQ0FBL0QsQ0FBeUgsQ0FBQyxFQUFuSSxDQUFBLENBQUE7Ozs7Ozs7QUNBQSxDQUFHLFNBQUMsRUFBRCxHQUFBO0FBRUQsTUFBQSxLQUFBO0FBQUEsRUFBQSxLQUFBLEdBQVEsU0FBQyxNQUFELEVBQVMsTUFBVCxHQUFBO0FBQ04sSUFBQSxJQUFHLFVBQUg7QUFDRSxhQUFPLFVBQUEsQ0FBVyxNQUFYLEVBQW1CLE1BQW5CLENBQVAsQ0FERjtLQURNO0VBQUEsQ0FBUixDQUFBO0FBQUEsRUFJQSxFQUFFLENBQUMsUUFBSCxDQUFZLE9BQVosRUFBcUIsS0FBckIsQ0FKQSxDQUZDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDRUEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUdELE1BQUEsYUFBQTtBQUFBLEVBQUEsT0FBQSxHQUFVLFNBQUMsR0FBRCxHQUFBO1dBRVIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFOLENBQWtCLEdBQWxCLENBQUEsSUFBMEIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsR0FBYixDQUExQixJQUErQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQU4sQ0FBWSxHQUFaLEVBRnZDO0VBQUEsQ0FBVixDQUFBO0FBQUEsRUFXQSxJQUFBLEdBQU8sU0FBQyxHQUFELEVBQU0sTUFBTixFQUFjLFNBQWQsR0FBQTtBQUNMLElBQUEsSUFBRyxPQUFBLENBQVEsR0FBUixDQUFIO0FBT0UsTUFBQSxDQUFDLENBQUMsTUFBRixDQUFTLEdBQVQsRUFBYyxTQUFDLEdBQUQsRUFBTSxHQUFOLEdBQUE7QUFDWixZQUFBLElBQUE7QUFBQSxRQUFBLElBQUcsTUFBQSxJQUFXLENBQUMsR0FBQSxJQUFPLEdBQVIsQ0FBZDtBQUNFLFVBQUEsSUFBQSxHQUFPLE1BQUEsQ0FBTyxHQUFQLEVBQVksR0FBWixDQUFQLENBQUE7QUFDQSxVQUFBLElBQWlCLEtBQUEsS0FBUyxJQUExQjtBQUFBLG1CQUFPLEtBQVAsQ0FBQTtXQUZGO1NBQUE7QUFHQSxRQUFBLElBQTJCLElBQUEsS0FBUSxTQUFuQztBQUFBLFVBQUEsSUFBQSxDQUFLLEdBQUwsRUFBVSxNQUFWLEVBQWtCLElBQWxCLENBQUEsQ0FBQTtTQUpZO01BQUEsQ0FBZCxDQUFBLENBUEY7S0FESztFQUFBLENBWFAsQ0FBQTtBQUFBLEVBK0JBLEVBQUUsQ0FBQyxRQUFILENBQVksTUFBWixFQUFvQixJQUFwQixDQS9CQSxDQUhDO0FBQUEsQ0FBQSxDQUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBOzs7Ozs7O0FDRkEsQ0FBRyxTQUFDLEVBQUQsR0FBQTtBQUNELEVBQUEsWUFBQSxDQUFBO0FBQUEsRUFDQSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsU0FBbEIsRUFBNkIsU0FBN0IsQ0FEQSxDQUFBO0FBQUEsRUFHQSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsWUFBbEIsRUFDRTtBQUFBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxFQUFBLEVBQUksQ0FBSjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxNQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsTUFHQSxZQUFBLEVBQWMsS0FIZDtBQUFBLE1BSUEsS0FBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLFFBQ0EsT0FBQSxFQUFTLElBRFQ7T0FMRjtBQUFBLE1BUUEsWUFBQSxFQUFjLEVBUmQ7QUFBQSxNQVNBLFdBQUEsRUFBYSxJQVRiO0tBREY7QUFBQSxJQVlBLFFBQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFJLENBQUo7QUFBQSxNQUNBLElBQUEsRUFBTSxVQUROO0FBQUEsTUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLE1BR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxNQUlBLEtBQUEsRUFDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxJQURUO09BTEY7QUFBQSxNQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsTUFTQSxXQUFBLEVBQWEsSUFUYjtLQWJGO0FBQUEsSUF3QkEsS0FBQSxFQUNFO0FBQUEsTUFBQSxFQUFBLEVBQUksQ0FBSjtBQUFBLE1BQ0EsSUFBQSxFQUFNLE9BRE47QUFBQSxNQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsTUFHQSxZQUFBLEVBQWMsSUFIZDtBQUFBLE1BSUEsS0FBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLFFBQ0EsT0FBQSxFQUFTLElBRFQ7T0FMRjtBQUFBLE1BUUEsWUFBQSxFQUFjLEVBUmQ7QUFBQSxNQVNBLFdBQUEsRUFBYSxJQVRiO0tBekJGO0FBQUEsSUFvQ0EsSUFBQSxFQUNFO0FBQUEsTUFBQSxFQUFBLEVBQUksQ0FBSjtBQUFBLE1BQ0EsSUFBQSxFQUFNLE1BRE47QUFBQSxNQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsTUFHQSxZQUFBLEVBQWMsSUFIZDtBQUFBLE1BSUEsS0FBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLFFBQ0EsT0FBQSxFQUFTLElBRFQ7T0FMRjtBQUFBLE1BUUEsWUFBQSxFQUFjLE9BUmQ7QUFBQSxNQVNBLFdBQUEsRUFBYSxJQVRiO0tBckNGO0FBQUEsSUFnREEsUUFBQSxFQUNFO0FBQUEsTUFBQSxFQUFBLEVBQUksQ0FBSjtBQUFBLE1BQ0EsSUFBQSxFQUFNLFVBRE47QUFBQSxNQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsTUFHQSxZQUFBLEVBQWMsS0FIZDtBQUFBLE1BSUEsS0FBQSxFQUNFO0FBQUEsUUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLFFBQ0EsT0FBQSxFQUFTLElBRFQ7T0FMRjtBQUFBLE1BUUEsWUFBQSxFQUFjLE9BUmQ7QUFBQSxNQVNBLFdBQUEsRUFBYSxJQVRiO0tBakRGO0FBQUEsSUE0REEsZ0JBQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFJLENBQUo7QUFBQSxNQUNBLElBQUEsRUFBTSxnQkFETjtBQUFBLE1BRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxNQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsTUFJQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsSUFEVDtPQUxGO0FBQUEsTUFRQSxZQUFBLEVBQWMsT0FSZDtBQUFBLE1BU0EsV0FBQSxFQUFhLElBVGI7S0E3REY7QUFBQSxJQXdFQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLEVBQUEsRUFBSSxDQUFKO0FBQUEsTUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLE1BRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxNQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsTUFJQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsSUFEVDtPQUxGO0FBQUEsTUFRQSxZQUFBLEVBQWMsT0FSZDtBQUFBLE1BU0EsV0FBQSxFQUFhLElBVGI7S0F6RUY7QUFBQSxJQW9GQSxJQUFBLEVBQ0U7QUFBQSxNQUFBLEVBQUEsRUFBSSxDQUFKO0FBQUEsTUFDQSxJQUFBLEVBQU0sTUFETjtBQUFBLE1BRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxNQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsTUFJQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsS0FEVDtPQUxGO0FBQUEsTUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLE1BU0EsV0FBQSxFQUFhLElBVGI7S0FyRkY7QUFBQSxJQWdHQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEVBQUEsRUFBSSxDQUFKO0FBQUEsTUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLE1BRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxNQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsTUFJQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsSUFEVDtPQUxGO0FBQUEsTUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLE1BU0EsV0FBQSxFQUFhLElBVGI7S0FqR0Y7QUFBQSxJQTRHQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLEVBQUEsRUFBSSxDQUFKO0FBQUEsTUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLE1BRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxNQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsTUFJQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsSUFEVDtPQUxGO0FBQUEsTUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLE1BU0EsV0FBQSxFQUFhLElBVGI7S0E3R0Y7QUFBQSxJQXdIQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsTUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLE1BRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxNQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsTUFJQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsSUFEVDtPQUxGO0FBQUEsTUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLE1BU0EsV0FBQSxFQUFhLElBVGI7S0F6SEY7QUFBQSxJQW9JQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsTUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLE1BRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxNQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsTUFJQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsSUFEVDtPQUxGO0FBQUEsTUFRQSxZQUFBLEVBQWMsT0FSZDtBQUFBLE1BU0EsV0FBQSxFQUFhLElBVGI7S0FySUY7QUFBQSxJQWdKQSxRQUFBLEVBQ0U7QUFBQSxNQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsTUFDQSxJQUFBLEVBQU0sVUFETjtBQUFBLE1BRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxNQUdBLEtBQUEsRUFDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxJQURUO09BSkY7QUFBQSxNQU9BLFlBQUEsRUFBYyxPQVBkO0FBQUEsTUFRQSxXQUFBLEVBQWEsSUFSYjtLQWpKRjtBQUFBLElBMkpBLEtBQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxNQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsTUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLE1BR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxNQUlBLEtBQUEsRUFDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxJQURUO09BTEY7QUFBQSxNQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsTUFTQSxXQUFBLEVBQWEsSUFUYjtLQTVKRjtBQUFBLElBdUtBLEtBQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxNQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsTUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLE1BR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxNQUlBLEtBQUEsRUFDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxJQURUO09BTEY7QUFBQSxNQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsTUFTQSxXQUFBLEVBQWEsSUFUYjtLQXhLRjtBQUFBLElBbUxBLEtBQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxNQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsTUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLE1BR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxNQUlBLEtBQUEsRUFDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxJQURUO09BTEY7QUFBQSxNQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsTUFTQSxXQUFBLEVBQWEsSUFUYjtLQXBMRjtBQUFBLElBK0xBLE1BQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxNQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsTUFFQSxXQUFBLEVBQWEsSUFGYjtBQUFBLE1BR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxNQUlBLEtBQUEsRUFDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxJQURUO09BTEY7QUFBQSxNQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsTUFTQSxXQUFBLEVBQWEsSUFUYjtLQWhNRjtBQUFBLElBMk1BLE1BQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxNQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsTUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLE1BR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxNQUlBLEtBQUEsRUFDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxJQURUO09BTEY7QUFBQSxNQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsTUFTQSxXQUFBLEVBQWEsSUFUYjtLQTVNRjtBQUFBLElBdU5BLEdBQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxNQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsTUFFQSxXQUFBLEVBQWEsSUFGYjtBQUFBLE1BR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxNQUlBLEtBQUEsRUFDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxJQURUO09BTEY7QUFBQSxNQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsTUFTQSxXQUFBLEVBQWEsSUFUYjtLQXhORjtBQUFBLElBbU9BLElBQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxNQUNBLElBQUEsRUFBTSxNQUROO0FBQUEsTUFFQSxXQUFBLEVBQWEsSUFGYjtBQUFBLE1BR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxNQUlBLEtBQUEsRUFDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxJQURUO09BTEY7QUFBQSxNQVFBLFlBQUEsRUFBYyxPQVJkO0FBQUEsTUFTQSxXQUFBLEVBQWEsSUFUYjtLQXBPRjtBQUFBLElBK09BLElBQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxNQUNBLElBQUEsRUFBTSxNQUROO0FBQUEsTUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLE1BR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxNQUlBLEtBQUEsRUFDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxJQURUO09BTEY7QUFBQSxNQVFBLFlBQUEsRUFBYyxPQVJkO0FBQUEsTUFTQSxXQUFBLEVBQWEsSUFUYjtLQWhQRjtBQUFBLElBMlBBLEdBQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxNQUNBLElBQUEsRUFBTSxLQUROO0FBQUEsTUFFQSxXQUFBLEVBQWEsSUFGYjtBQUFBLE1BR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxNQUlBLEtBQUEsRUFDRTtBQUFBLFFBQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxRQUNBLE9BQUEsRUFBUyxJQURUO09BTEY7QUFBQSxNQVFBLFlBQUEsRUFBYyxPQVJkO0FBQUEsTUFTQSxXQUFBLEVBQWEsSUFUYjtLQTVQRjtBQUFBLElBdVFBLElBQUEsRUFDRTtBQUFBLE1BQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxNQUNBLElBQUEsRUFBTSxNQUROO0FBQUEs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QUFILENBQVMsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF0QyxHQUFrRCxNQUFsRCxHQUE4RCxDQUFJLE1BQUEsQ0FBQSxNQUFBLEtBQW1CLFdBQXRCLEdBQXVDLE1BQXZDLEdBQW1ELElBQXBELENBQS9ELENBQXlILENBQUMsRUFBbkksQ0FBQSxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUgJy4vb2ouY29mZmVlJ1xucmVxdWlyZSAnLi9vakluaXQuY29mZmVlJ1xucmVxdWlyZSAnLi9hc3luYy9hamF4LmNvZmZlZSdcbnJlcXVpcmUgJy4vYXN5bmMvcHJvbWlzZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvZ3JpZC5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvaW5wdXRncm91cC5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvdGFicy5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvdGlsZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbnRyb2xzL2ljb24uY29mZmVlJ1xucmVxdWlyZSAnLi9jb3JlL2RhdGUuY29mZmVlJ1xucmVxdWlyZSAnLi9jb3JlL2Z1bmN0aW9uLmNvZmZlZSdcbnJlcXVpcmUgJy4vY29yZS9udW1iZXIuY29mZmVlJ1xucmVxdWlyZSAnLi9jb3JlL29iamVjdC5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvcmUvcHJvcGVydHkuY29mZmVlJ1xucmVxdWlyZSAnLi9jb3JlL3N0cmluZy5jb2ZmZWUnXG5yZXF1aXJlICcuL2RvbS9jb21wb25lbnQuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vY29udHJvbC5jb2ZmZWUnXG5yZXF1aXJlICcuL2RvbS9kb20uY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vZWxlbWVudC5jb2ZmZWUnXG5yZXF1aXJlICcuL2RvbS9mcmFnbWVudC5jb2ZmZWUnXG5yZXF1aXJlICcuL2RvbS9nZW5lcmljcy5jb2ZmZWUnXG5yZXF1aXJlICcuL2RvbS9pbnB1dC5jb2ZmZWUnXG5yZXF1aXJlICcuL2RvbS9ub2RlRmFjdG9yeS5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL2EuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy9ici5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL2Zvcm0uY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy9pbnB1dC5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL29sLmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvc2VsZWN0LmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvdGFibGUuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy90ZXh0YXJlYS5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RoZWFkLmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvdWwuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvYnV0dG9uaW5wdXQuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvY2hlY2tib3guY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvY29sb3IuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9kYXRldGltZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9kYXRldGltZWxvY2FsLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2VtYWlsLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2ZpbGUuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvaGlkZGVuLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2ltYWdlaW5wdXQuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvbW9udGguY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvbnVtYmVyLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3Bhc3N3b3JkLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3JhZGlvLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3JhbmdlLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3Jlc2V0LmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3NlYXJjaC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9zdWJtaXQuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvdGVsLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3RleHRpbnB1dC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy90aW1lLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3VybC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy93ZWVrLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvYXJyYXkyRC5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2NvbnNvbGUuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9jb29raWUuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9kZWZlci5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2VhY2guY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9lbnVtcy5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2Vycm9yLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvaGlzdG9yeS5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2lzLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvbm90eS5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL3B1YnN1Yi5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL3F1ZXJ5U3RyaW5nLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvcmFuZ2VzLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvdG8uY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy91dWlkLmNvZmZlZSdcbiIsIiMgIyBhamF4XHJcblxyXG5kbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG5cclxuICBjb25maWcgPSB7fVxyXG4gIFxyXG4gICMgZGVmaW5lIGEgc3RhbmRhcmQgb24gc3VjY2VzcyBoYW5kbGVyLCB3cml0ZSBvdXQgdGhlIHJlcXVlc3Qgc3RhdHMgdG8gYSB0YWJsZVxyXG4gIGNvbmZpZy5vblN1Y2Nlc3MgPSAob3B0cywgZGF0YSwgdXJsKSAtPlxyXG4gICAgcmVzcG9uc2UgPSB7fVxyXG4gICAgT0ouZXh0ZW5kIHJlc3BvbnNlLCBkYXRhXHJcbiAgICBvcHRzLm9uU3VjY2VzcyByZXNwb25zZVxyXG4gICAgaWYgT0ouTE9HX0FMTF9BSkFYXHJcbiAgICAgIE9KLmNvbnNvbGUudGFibGUgW1xyXG4gICAgICAgIFdlYnNlcnZpY2U6IG9wdHMuYWpheE9wdHMudXJsXHJcbiAgICAgICAgU3RhcnRUaW1lOiBvcHRzLnN0YXJ0VGltZVxyXG4gICAgICAgIEVuZFRpbWU6IG5ldyBEYXRlKClcclxuICAgICAgXSBcclxuICAgIHJldHVyblxyXG4gIFxyXG4gICMgZGVmaW5lIGEgc3RhbmRhcmQgb24gZXJyb3IgaGFuZGxlciwgd3JpdGUgb3V0IHRoZSByZXF1ZXN0IGVycm9yIGNvbmV4dCB0byBhIHRhYmxlXHJcbiAgY29uZmlnLm9uRXJyb3IgPSAoeG1sSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMsIHBhcmFtMSwgb3B0cyA9IE9KLm9iamVjdCgpKSAtPlxyXG4gICAgaWYgdGV4dFN0YXR1cyBpc250ICdhYm9ydCdcclxuICAgICAgaWYgT0ouTE9HX0FMTF9BSkFYX0VSUk9SU1xyXG4gICAgICAgIE9KLmNvbnNvbGUudGFibGUgW1xyXG4gICAgICAgICAgV2Vic2VydmljZTogb3B0cy5hamF4T3B0cy51cmxcclxuICAgICAgICAgIERhdGE6IG9wdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgICAgICAgRmFpbGVkOiB0ZXh0U3RhdHVzXHJcbiAgICAgICAgICBTdGF0ZTogeG1sSHR0cFJlcXVlc3Quc3RhdGUoKVxyXG4gICAgICAgICAgU3RhdHVzOiB4bWxIdHRwUmVxdWVzdC5zdGF0dXNcclxuICAgICAgICAgIFN0YXR1c1RleHQ6IHhtbEh0dHBSZXF1ZXN0LnN0YXR1c1RleHRcclxuICAgICAgICAgIFJlYWR5U3RhdGU6IHhtbEh0dHBSZXF1ZXN0LnJlYWR5U3RhdGVcclxuICAgICAgICAgIFJlc3BvbnNlVGV4dDogeG1sSHR0cFJlcXVlc3QucmVzcG9uc2VUZXh0XHJcbiAgICAgICAgXVxyXG5cclxuICAgICAgb3B0cy5vbkVycm9yIHRleHRTdGF0dXNcclxuICAgIHJldHVyblxyXG4gIFxyXG4gICMgaW4gdGhlIGNhc2Ugd2hlcmUgYG9wdHNgIGlzIGEgc3RyaW5nLCBjb252ZXJ0IGl0IHRvIGFuIG9iamVjdFxyXG4gIG9wdHNGcm9tVXJsID0gKG9wdHMpIC0+XHJcbiAgICBpZiBPSi5pcy5zdHJpbmcgb3B0c1xyXG4gICAgICB1cmwgPSBvcHRzXHJcbiAgICAgIG9wdHMgPSBPSi5vYmplY3QoKVxyXG4gICAgICBvcHRzLmFkZCAnYWpheE9wdHMnLCBPSi5vYmplY3QoKVxyXG4gICAgICBvcHRzLmFqYXhPcHRzLmFkZCAndXJsJywgdXJsXHJcbiAgICBvcHRzXHJcbiAgXHJcbiAgIyBkZWZpbmUgYSBzdGFuZGFyZCBgZXhlY2AgbWV0aG9kIHRvIGhhbmRsZSBhbGwgcmVxdWVzdCB2ZXJicy4gVXNlcyB0aGUgW2pRdWVyeS5hamF4XShodHRwOi8vYXBpLmpxdWVyeS5jb20vY2F0ZWdvcnkvYWpheC8pIEFQSS5cclxuICAjIGBleGVjUmVxdWVzdGAgcmV0dXJucyBhIHByb21pc2UgcmVwcmVzZW50IHRoZSBhY3R1YWwgQUpBWCBjYWxsLlxyXG4gIFxyXG4gICMgLSBgdmVyYmAgZGVmYXVsdCB2YWx1ZSA9ICdHRVQnXHJcbiAgIyAtIGBvcHRzYCBvYmplY3RcclxuICAjIC0tIGBvcHRzLmFqYXhPcHRzYCBvYmplY3QgZm9yIGFsbCBqUXVlcnkncyBhamF4LXNwZWNpZmljIHByb3BlcnRpZXMuXHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ID0gKHZlcmIgPSAnR0VUJywgb3B0cykgLT5cclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgYWpheE9wdHM6XHJcbiAgICAgICAgdXJsOiAnJ1xyXG4gICAgICAgIGRhdGE6IHt9XHJcbiAgICAgICAgdHlwZTogdmVyYlxyXG4gICAgICAgIHhockZpZWxkczpcclxuICAgICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbidcclxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcbiAgICAgICAgXHJcbiAgICAgIG9uU3VjY2VzczogT0oubm9vcFxyXG4gICAgICBvbkVycm9yOiBPSi5ub29wXHJcbiAgICAgIG9uQ29tcGxldGU6IE9KLm5vb3BcclxuICAgICAgb3ZlcnJpZGVFcnJvcjogZmFsc2VcclxuICAgICAgd2F0Y2hHbG9iYWw6IHRydWVcclxuICAgICAgdXNlQ2FjaGU6IGZhbHNlXHJcbiAgICBcclxuICAgIG9wdHMgPSBvcHRzRnJvbVVybCBvcHRzXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdHMsIHRydWVcclxuICAgIFxyXG4gICAgZGVmYXVsdHMuc3RhcnRUaW1lID0gbmV3IERhdGUoKVxyXG4gICAgXHJcbiAgICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXHJcbiAgICAgICMgR0VUIHJlcXVlc3RzIGV4cGVjdCBxdWVyeVN0cmluZyBwYXJhbWV0ZXJzXHJcbiAgICAgIGlmIGRlZmF1bHRzLmFqYXhPcHRzLnZlcmIgaXMgJ0dFVCdcclxuICAgICAgICBkZWZhdWx0cy5hamF4T3B0cy5kYXRhID0gT0oucGFyYW1zIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcclxuICAgICAgIyBhbGwgb3RoZXIgcmVxdWVzdHMgdGFrZSBhbiBvYmplY3RcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGEgPSBPSi5zZXJpYWxpemUgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgXHJcbiAgICBnZXRKUXVlcnlEZWZlcnJlZCA9ICh3YXRjaEdsb2JhbCkgLT5cclxuICAgICAgcmV0ID0gJC5hamF4IGRlZmF1bHRzLmFqYXhPcHRzXHJcbiAgICAgIFxyXG4gICAgICByZXQuZG9uZSAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIC0+XHJcbiAgICAgICAgY29uZmlnLm9uU3VjY2VzcyBkZWZhdWx0cywgZGF0YVxyXG5cclxuICAgICAgcmV0LmZhaWwgKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRleHQpIC0+XHJcbiAgICAgICAgY29uZmlnLm9uRXJyb3IganFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGV4dCwgZGVmYXVsdHNcclxuICBcclxuICAgICAgcmV0LmFsd2F5cyAoeG1sSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMpIC0+XHJcbiAgICAgICAgZGVmYXVsdHMub25Db21wbGV0ZSB4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1c1xyXG5cclxuICAgICAgT0ouYXN5bmMuYWpheFByb21pc2UgcmV0XHJcblxyXG4gICAgcHJvbWlzZSA9IGdldEpRdWVyeURlZmVycmVkKGRlZmF1bHRzLndhdGNoR2xvYmFsKVxyXG4gICAgcHJvbWlzZVxyXG4gIFxyXG4gIGFqYXggPSB7fVxyXG4gIFxyXG4gICMgIyMgcG9zdFxyXG4gICMgW09KXShvai5odG1sKS5hamF4LnBvc3Q6IGluc2VydCBhIG5ldyBvYmplY3Qgb3IgaW5pdCBhIGZvcm0gcG9zdFxyXG4gIFxyXG4gICMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiAgIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LiBcclxuICBhamF4LnBvc3QgPSAob3B0cykgLT5cclxuICAgIGNvbmZpZy5leGVjUmVxdWVzdCAnUE9TVCcsIG9wdHNcclxuICBcclxuICAjICMjIGdldFxyXG4gICMgW09KXShvai5odG1sKS5hamF4LmdldDogZ2V0IGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4gICMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiAgIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxyXG4gICNcclxuICBhamF4LmdldCA9IChvcHRzKSAtPlxyXG4gICAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdHRVQnLCBvcHRzXHJcblxyXG4gICMgIyMgZGVsZXRlXHJcbiAgIyBbT0pdKG9qLmh0bWwpLmFqYXguZGVsZXRlOiBkZWxldGUgYW4gZXhpc3Rpbmcgb2JqZWN0XHJcbiAgXHJcbiAgIyAtIGBvcHRzYCBjYW4gYmUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgcmVxdWVzdC5cclxuICAjIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbiAgYWpheC5kZWxldGUgPSAob3B0cykgLT5cclxuICAgIGNvbmZpZy5leGVjUmVxdWVzdCAnREVMRVRFJywgb3B0c1xyXG5cclxuICAjICMjIHB1dFxyXG4gICMgW09KXShvai5odG1sKS5hamF4LnB1dDogdXBkYXRlIGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4gICMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiAgIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxyXG4gIGFqYXgucHV0ID0gKG9wdHMpIC0+XHJcbiAgICBjb25maWcuZXhlY1JlcXVlc3QgJ1BVVCcsIG9wdHNcclxuXHJcbiAgT0ouYXN5bmMucmVnaXN0ZXIgJ2FqYXgnLCBhamF4XHJcblxyXG4gIHJldHVyblxyXG4gIFxyXG5cclxuIiwiIyAjIHByb21pc2VcclxuXHJcbmRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcblxyXG4gICMgIyMgYWpheFByb21pc2VcclxuICAjIFtPSl0ob2ouaHRtbCkuYXN5bmMuYWpheFByb21pc2UgY29udmVydHMgYW4gQUpBWCBYbWxIdHRwUmVxdWVzdCBpbnRvIGEgUHJvbWlzZS4gXHJcbiAgIyBTZWUgYWxzbyBbUHJvbWlzZS5yZXNvbHZlXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbiAgT0ouYXN5bmMucmVnaXN0ZXIgJ2FqYXhQcm9taXNlJywgKGFqYXgpIC0+IFxyXG4gICAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSBhamF4XHJcbiAgICBwcm9taXNlLmFib3J0ID0gYWpheC5hYm9ydFxyXG4gICAgcHJvbWlzZS5yZWFkeVN0YXRlID0gYWpheC5yZWFkeVN0YXRlXHJcbiAgICBwcm9taXNlXHJcblxyXG4gICMgIyMgYWxsXHJcbiAgIyBbT0pdKG9qLmh0bWwpLmFzeW5jLmFsbCB0YWtlcyBhbiBhcnJheSBvZiBmdW5jdGlvbnMgYW5kIHJldHVybnMgYSBwcm9taXNlIHJlcHJlc2VudGluZyB0aGUgc3VjY2VzcyBvZiBhbGwgbWV0aG9kcyBvciB0aGUgZmFpbHVyZSBvZiBhbnkgbWV0aG9kLlxyXG4gICMgU2VlIGFsc28gW1Byb21pc2UuYWxsXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbiAgT0ouYXN5bmMucmVnaXN0ZXIgJ2FsbCcsIChpbml0QXJyYXkpIC0+XHJcbiAgICByZXFzID0gaW5pdEFycmF5IG9yIFtdXHJcbiAgICBwcm9taXNlID0gUHJvbWlzZS5hbGwocmVxcylcclxuICAgIHByb21pc2UucHVzaCA9IChpdGVtKSAtPlxyXG4gICAgICByZXFzLnB1c2ggaXRlbVxyXG4gICAgICByZXR1cm5cclxuICAgIHByb21pc2VcclxuXHJcbiAgIyAjIyBkZWZlclxyXG4gICMgW09KXShvai5odG1sKS5hc3luYy5kZWZlciBjb252ZXJ0cyBhIGZ1bmN0aW9uIGludG8gYSBQcm9taXNlIHRvIGV4ZWN1dGUgdGhhdCBmdW5jdGlvbi4gXHJcbiAgIyBTZWUgYWxzbyBbUHJvbWlzZS5tZXRob2RdKGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvYmxvYi9tYXN0ZXIvQVBJLm1kKS5cclxuICBPSi5hc3luYy5yZWdpc3RlciAnZGVmZXInLCAoZnVuYyA9IE9KLm5vb3ApIC0+XHJcbiAgICByZXQgPSBQcm9taXNlLm1ldGhvZCBmdW5jXHJcbiAgICByZXRcclxuICBcclxuICBcclxuICByZXR1cm5cclxuICBcclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgbm9kZU5hbWUgPSAneC1ncmlkJ1xyXG4gIGNsYXNzTmFtZSA9ICdncmlkJ1xyXG4gIFxyXG4gIE9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcclxuICBPSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgKG9wdGlvbnMsIG93bmVyKSAtPlxyXG4gICAgZGVmYXVsdHMgPSBcclxuICAgICAgdGlsZVNpemVzOlxyXG4gICAgICAgIHNtYWxsU3BhbjogJydcclxuICAgICAgICBtZWRpdW1TcGFuOiAnJ1xyXG4gICAgICAgIGxhcmdlU3BhbjogJydcclxuICAgICAgcHJvcHM6IFxyXG4gICAgICAgIGNsYXNzOiAnZ3JpZCdcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICByZXQgPSBPSi5jb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZSBcclxuICAgIFxyXG4gICAgcm93cyA9IFtdXHJcbiAgICB0aWxlcyA9IE9KLmFycmF5MkQoKVxyXG4gICAgXHJcbiAgICBmaWxsTWlzc2luZyA9ICgpIC0+XHJcbiAgICAgIHRpbGVzLmVhY2ggKHJvd05vLCBjb2xObywgdmFsKSAtPlxyXG4gICAgICAgIGlmIG5vdCB2YWxcclxuICAgICAgICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cclxuICAgICAgICAgIHJvdy5tYWtlICd0aWxlJywgY29sTm8sIHt9IFxyXG4gICAgXHJcbiAgICByZXQuYWRkICdyb3cnLCAocm93Tm8gPSByb3dzLmxlbmd0aC0xIG9yIDEpLT4gIFxyXG4gICAgICBudVJvdyA9IHJvd3Nbcm93Tm8tMV1cclxuICAgICAgaWYgbm90IG51Um93XHJcbiAgICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xyXG4gICAgICAgICAgbnVSb3cgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAncm93J1xyXG4gICAgICAgICAgcm93cy5wdXNoIG51Um93XHJcbiAgICAgICAgbnVSb3cuYWRkICd0aWxlJywgKGNvbE5vLCBvcHRzKSAtPlxyXG4gICAgICAgICAgb3B0cyA9IE9KLmV4dGVuZCAoT0ouZXh0ZW5kIHt9LCBkZWZhdWx0cy50aWxlU2l6ZXMpLCBvcHRzXHJcbiAgICAgICAgICBudVRpbGUgPSBPSi5jb21wb25lbnRzLnRpbGUgb3B0cywgbnVSb3dcclxuICAgICAgICAgIHRpbGVzLnNldCByb3dObywgY29sTm8sIG51VGlsZVxyXG4gICAgICAgICAgbnVUaWxlXHJcbiAgICAgIG51Um93ICBcclxuICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgcmV0LmFkZCAndGlsZScsIChyb3dObywgY29sTm8sIG9wdHMpIC0+XHJcbiAgICAgIGlmIG5vdCByb3dObyBvciByb3dObyA8IDEgdGhlbiByb3dObyA9IDFcclxuICAgICAgaWYgbm90IGNvbE5vIG9yIGNvbE5vIDwgMSB0aGVuIGNvbE5vID0gMVxyXG4gICAgICBcclxuICAgICAgcm93ID0gcmV0LnJvdyByb3dOb1xyXG4gICAgICB0aWxlID0gdGlsZXMuZ2V0IHJvd05vLCBjb2xOb1xyXG4gICAgICBcclxuICAgICAgaWYgbm90IHRpbGVcclxuICAgICAgICBpID0gMFxyXG4gICAgICAgIHdoaWxlIGkgPCBjb2xOb1xyXG4gICAgICAgICAgaSArPSAxXHJcbiAgICAgICAgICB0cnlUaWxlID0gdGlsZXMuZ2V0IHJvd05vLCBpXHJcbiAgICAgICAgICBpZiBub3QgdHJ5VGlsZVxyXG4gICAgICAgICAgICBpZiBpIGlzIGNvbE5vXHJcbiAgICAgICAgICAgICAgdGlsZSA9IHJvdy5tYWtlICd0aWxlJywgb3B0c1xyXG4gICAgICAgICAgICBlbHNlIGlmIG5vdCB0aWxlXHJcbiAgICAgICAgICAgICAgcm93Lm1ha2UgJ3RpbGUnXHJcbiAgICAgICAgICBcclxuICAgICAgZmlsbE1pc3NpbmcoKVxyXG4gICAgICB0aWxlICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBub2RlTmFtZSA9ICd4LWlucHV0LWdyb3VwJ1xyXG4gIGNsYXNzTmFtZSA9ICdpbnB1dGdyb3VwJ1xyXG4gIFxyXG4gIE9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcclxuICBcclxuICBPSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgKG9wdGlvbnMsIG93bmVyKSAtPlxyXG4gICAgZm9ySWQgPSBPSi5jcmVhdGVVVUlEKClcclxuICAgIGRlZmF1bHRzID0gXHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIGNsYXNzOiAnZm9ybS1ncm91cCdcclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNoYW5nZTogT0oubm9vcFxyXG4gICAgICBmb3I6IGZvcklkXHJcbiAgICAgIGxhYmVsVGV4dDogJydcclxuICAgICAgaW5wdXRPcHRzOlxyXG4gICAgICAgIHByb3BzOlxyXG4gICAgICAgICAgaWQ6IGZvcklkXHJcbiAgICAgICAgICB0eXBlOiAndGV4dCdcclxuICAgICAgICAgIGNsYXNzOiAnJ1xyXG4gICAgICAgICAgcGxhY2Vob2xkZXI6ICcnXHJcbiAgICAgICAgICB2YWx1ZTogJydcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICByZXQgPSBPSi5jb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZSBcclxuICAgIFxyXG4gICAgY21wbnQgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAnZm9ybS1ncm91cCdcclxuICAgIFxyXG4gICAgcmV0Lmdyb3VwTGFiZWwgPSBjbXBudC5tYWtlICdsYWJlbCcsIHByb3BzOiB7IGZvcjogZm9ySWQgfSwgdGV4dDogZGVmYXVsdHMubGFiZWxUZXh0XHJcbiAgICBcclxuICAgIGRlZmF1bHRzLmlucHV0T3B0cy5wcm9wcy5jbGFzcyArPSAnIGZvcm0tY29udHJvbCdcclxuICAgIHJldC5ncm91cElucHV0ID0gY21wbnQubWFrZSAnaW5wdXQnLCBkZWZhdWx0cy5pbnB1dE9wdHNcclxuICAgIFxyXG4gICAgcmV0Lmdyb3VwVmFsdWUgPSAoKSAtPlxyXG4gICAgICByZXQuZ3JvdXBJbnB1dC52YWwoKVxyXG4gICAgICBcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgbm9kZU5hbWUgPSAneC10YWJzJ1xyXG4gIGNsYXNzTmFtZSA9ICd0YWJzJ1xyXG4gIFxyXG4gIE9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcclxuICBcclxuICBPSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgKG9wdGlvbnMsIG93bmVyKSAtPlxyXG4gICAgZGVmYXVsdHMgPSBcclxuICAgICAgdGFiczoge31cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgY2xhc3M6ICcnXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgcmV0ID0gT0ouY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWUgXHJcbiAgICBcclxuICAgIHRhYnMgPSByZXQubWFrZSAndWwnLCBwcm9wczogY2xhc3M6ICduYXYgbmF2LXRhYnMnXHJcbiAgICBjb250ZW50ID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ3RhYi1jb250ZW50J1xyXG4gICAgXHJcbiAgICBmaXJzdCA9IHRydWVcclxuICAgIE9KLmVhY2ggZGVmYXVsdHMudGFicywgKHRhYlZhbCwgdGFiTmFtZSkgLT5cclxuICAgICAgdGFiQ2xhc3MgPSAnJ1xyXG4gICAgICBpZiBmaXJzdFxyXG4gICAgICAgIGZpcnN0ID0gZmFsc2VcclxuICAgICAgICB0YWJDbGFzcyA9ICdhY3RpdmUnXHJcbiAgICAgIGEgPSB0YWJzLm1ha2UgJ2xpJywgcHJvcHM6IGNsYXNzOiB0YWJDbGFzc1xyXG4gICAgICAgIC5tYWtlKCdhJywgXHJcbiAgICAgICAgICB0ZXh0OiB0YWJOYW1lXHJcbiAgICAgICAgICBwcm9wczogXHJcbiAgICAgICAgICAgIGhyZWY6ICcjJyArIHRhYk5hbWVcclxuICAgICAgICAgICAgJ2RhdGEtdG9nZ2xlJzogJ3RhYidcclxuICAgICAgICAgIGV2ZW50czpcclxuICAgICAgICAgICAgY2xpY2s6IC0+XHJcbiAgICAgICAgICAgICAgYS4kLnRhYiAnc2hvdycpXHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgIHRhYkNvbnRlbnRDbGFzcyA9ICd0YWItcGFuZSAnICsgdGFiQ2xhc3NcclxuICAgICAgcmV0LmFkZCB0YWJOYW1lLCBjb250ZW50Lm1ha2UoJ2RpdicsIHByb3BzOiBjbGFzczogdGFiQ29udGVudENsYXNzLCBpZDogdGFiTmFtZSlcclxuICAgICAgXHJcbiAgICAgIHJldHVyblxyXG4gICAgXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIG5vZGVOYW1lID0gJ3gtdGlsZSdcclxuICBjbGFzc05hbWUgPSAndGlsZSdcclxuICBcclxuICBPSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXHJcbiAgT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIChvcHRpb25zLCBvd25lcikgLT5cclxuICAgIGRlZmF1bHRzID0gXHJcbiAgICAgIHdpZHRoOiBcclxuICAgICAgICB4czogJydcclxuICAgICAgICBzbTogJydcclxuICAgICAgICBtZDogJydcclxuICAgICAgICBsZzogJydcclxuICAgICAgcHJvcHM6IFxyXG4gICAgICAgIGNsYXNzOiAndGlsZSdcclxuICAgICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIGlmIGRlZmF1bHRzLndpZHRoLnhzIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wteHMtJyArIGRlZmF1bHRzLndpZHRoLnhzXHJcbiAgICBpZiBkZWZhdWx0cy53aWR0aC5zbSB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLXNtLScgKyBkZWZhdWx0cy53aWR0aC5zbVxyXG4gICAgaWYgZGVmYXVsdHMud2lkdGgubWQgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1tZC0nICsgZGVmYXVsdHMud2lkdGgubWRcclxuICAgIGlmIGRlZmF1bHRzLndpZHRoLmxnIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wtbGctJyArIGRlZmF1bHRzLndpZHRoLmxnXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmNvbXBvbmVudCBkZWZhdWx0cywgb3duZXIsIG5vZGVOYW1lIFxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBjb250cm9sTmFtZSA9ICd5LWljb24nXHJcbiAgZnJpZW5kbHlOYW1lID0gJ2ljb24nXHJcbiAgXHJcbiAgT0ouY29udHJvbHMubWVtYmVyc1tmcmllbmRseU5hbWVdID0gY29udHJvbE5hbWVcclxuICBcclxuICBPSi5jb250cm9scy5yZWdpc3RlciBmcmllbmRseU5hbWUsIChvcHRpb25zLCBvd25lcikgLT5cclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgaWNvbk9wdHM6XHJcbiAgICAgICAgbmFtZTogJydcclxuICAgICAgICBzdGFja2VkSWNvbjogJydcclxuICAgICAgICBzd2FwSWNvbjogJydcclxuICAgICAgICBzaXplOiBmYWxzZVxyXG4gICAgICAgIGNvbG9yOiAnJ1xyXG4gICAgICAgIGxpYnJhcnk6ICcnXHJcbiAgICAgICAgaXNGaXhlZFdpZHRoOiBmYWxzZVxyXG4gICAgICAgIGlzTGlzdDogZmFsc2VcclxuICAgICAgICBpc1NwaW5uZXI6IGZhbHNlXHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIGNsYXNzOiAnJ1xyXG4gICAgICByb290Tm9kZVR5cGU6ICdzcGFuJ1xyXG4gICAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9uc1xyXG4gICAgcmV0ID0gT0ouY29udHJvbCBkZWZhdWx0cywgb3duZXIsIGNvbnRyb2xOYW1lXHJcbiAgICBcclxuICAgIGlzVG9nZ2xlZCA9IGZhbHNlXHJcbiAgICBcclxuICAgICNUT0RPOiBTdXBwb3J0IGZvciBwaWN0b2ljb25zXHJcbiAgICAjVE9ETzogU3VwcG9ydCBmb3Igb3RoZXIgRm9udEF3ZXNvbWUgcHJvcGVydGllcyAoc3RhY2ssIHJvdGF0ZSwgc2l6ZSwgZXRjKVxyXG4gICAgXHJcbiAgICBjbGFzc05hbWVCYXNlID0gJ2ZhICdcclxuICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzRml4ZWRXaWR0aCB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLWZ3ICdcclxuICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzTGlzdCB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLWxpICdcclxuICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzU3Bpbm5lciB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLXNwaW4gJ1xyXG4gICAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSAgXHJcbiAgICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLnNpemUgPiAxIGFuZCBkZWZhdWx0cy5pY29uT3B0cy5zaXplIDw9IDVcclxuICAgICAgICBjbGFzc05hbWVCYXNlICs9ICdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSArICd4ICdcclxuICAgICAgXHJcbiAgICBjbGFzc05hbWUgPSBjbGFzc05hbWVCYXNlICsgJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5uYW1lXHJcbiAgICByZXQubXlJY29uID0gcmV0Lm1ha2UgJ2knLCBwcm9wczogY2xhc3M6IGNsYXNzTmFtZVxyXG5cclxuICAgICNUb2dnbGVzIGRpc3BsYXkgYmV0d2VlbiBub3JtYWwgaWNvbiBhbmQgc3dhcCBpY29uLCBpZiBhIHN3YXAgaWNvbiBoYXMgYmVlbiBzcGVjaWZpZWRcclxuICAgIHJldC50b2dnbGVJY29uID0gLT5cclxuICAgICAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuc3dhcEljb25cclxuICAgICAgICBuZXdJY29uID0gZGVmYXVsdHMuaWNvbk9wdHMubmFtZVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlzVG9nZ2xlZCA9ICFpc1RvZ2dsZWRcclxuICAgICAgXHJcbiAgICAgICAgaWYgaXNUb2dnbGVkXHJcbiAgICAgICAgICByZXQubXlJY29uLiQucmVtb3ZlQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxyXG4gICAgICAgICAgbmV3SWNvbiA9IGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgcmV0Lm15SWNvbi4kLnJlbW92ZUNsYXNzKCdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMuc3dhcEljb24pXHJcbiAgICAgICAgICBcclxuICAgICAgICByZXQubXlJY29uLiQuYWRkQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxyXG5cclxuICAgICAgXHJcbiAgICByZXQiLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIE9KLnJlZ2lzdGVyIFwiZ2V0RGF0ZUZyb21Ebkpzb25cIiwgKGRuRGF0ZSkgLT5cclxuICAgIFxyXG4gICAgIyBUcmFuc2Zvcm1zIGEgLk5FVCBKU09OIGRhdGUgaW50byBhIEphdmFTY3JpcHQgZGF0ZS5cclxuICAgICMgbmFtZT1cIm9ialwiICBPYmplY3QgdG8gdGVzdFxyXG4gICAgIyB0eXBlPVwiQm9vbGVhblwiIC8+XHJcbiAgICAjXHJcbiAgICAjICAgICAgIHZhciBtaWxsaSA9IE9KLnRvLm51bWJlcihEbkRhdGUucmVwbGFjZSgvXFwvRGF0ZVxcKChcXGQrKVxcLT8oXFxkKylcXClcXC8vLCAnJDEnKSk7XHJcbiAgICAjICAgICAgIHZhciBvZmZzZXQgPSBPSi50by5udW1iZXIoRG5EYXRlLnJlcGxhY2UoL1xcL0RhdGVcXChcXGQrKFtcXCtcXC1dP1xcZCspXFwpXFwvLywgJyQxJykpO1xyXG4gICAgIyAgICAgICB2YXIgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCk7XHJcbiAgICAjICAgICAgIHJldHVybiBuZXcgRGF0ZSgobWlsbGkgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpO1xyXG4gICAgIyAgICAgICBcclxuICAgIFxyXG4gICAgIyBEbiBEYXRlIHdpbGwgbG9vayBsaWtlIC9EYXRlKDEzMzU3NTg0MDAwMDAtMDQwMCkvICBcclxuICAgIGRuRGF0ZVN0ciA9IE9KLnRvLnN0cmluZyhkbkRhdGUpXHJcbiAgICByZXQgPSB1bmRlZmluZWRcclxuICAgIHRpY2tzID0gdW5kZWZpbmVkXHJcbiAgICBvZmZzZXQgPSB1bmRlZmluZWRcclxuICAgIGxvY2FsT2Zmc2V0ID0gdW5kZWZpbmVkXHJcbiAgICBhcnIgPSB1bmRlZmluZWRcclxuICAgIHJldCA9IE9KLmRhdGVUaW1lTWluVmFsdWVcclxuICAgIGlmIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5KGRuRGF0ZVN0cilcclxuICAgICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoXCIvXCIsIFwiXCIpXHJcbiAgICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKFwiRGF0ZVwiLCBcIlwiKVxyXG4gICAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZShcIihcIiwgXCJcIilcclxuICAgICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoXCIpXCIsIFwiXCIpXHJcbiAgICAgIGFyciA9IGRuRGF0ZVN0ci5zcGxpdChcIi1cIilcclxuICAgICAgaWYgYXJyLmxlbmd0aCA+IDFcclxuICAgICAgICB0aWNrcyA9IE9KLnRvLm51bWJlcihhcnJbMF0pXHJcbiAgICAgICAgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKGFyclsxXSlcclxuICAgICAgICBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKVxyXG4gICAgICAgIHJldCA9IG5ldyBEYXRlKCh0aWNrcyAtICgobG9jYWxPZmZzZXQgKyAob2Zmc2V0IC8gMTAwICogNjApKSAqIDEwMDApKSlcclxuICAgICAgZWxzZSBpZiBhcnIubGVuZ3RoIGlzIDFcclxuICAgICAgICB0aWNrcyA9IE9KLnRvLm51bWJlcihhcnJbMF0pXHJcbiAgICAgICAgcmV0ID0gbmV3IERhdGUodGlja3MpXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcblxyXG4gICMgV3JhcCB0aGUgZXhlY3V0aW9uIG9mIGEgbWV0aG9kIGluIGEgdHJ5Li5jYXRjaC4uZmluYWxseSAgICAgXHJcbiAgIyBpZ25vcmUgZXJyb3JzIGZhaWxpbmcgdG8gZXhlYyBzZWxmLWV4ZWN1dGluZyBmdW5jdGlvbnMgXHJcbiAgIyBSZXR1cm4gYSBtZXRob2Qgd3JhcHBlZCBpbiBhIHRyeS4uY2F0Y2guLmZpbmFsbHlcclxuICBPSi5yZWdpc3RlciBcInRyeUV4ZWNcIiwgdHJ5RXhlYyA9ICh0cnlGdW5jKSAtPlxyXG4gICAgJ3VzZSBzdHJpY3QnXHJcbiAgICByZXQgPSBmYWxzZVxyXG4gICAgdGhhdCA9IHRoaXNcclxuICAgIHRyeVxyXG4gICAgICByZXQgPSB0cnlGdW5jLmFwcGx5KHRoYXQsIEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpICBpZiBPSi5pcy5tZXRob2QodHJ5RnVuYylcclxuICAgIGNhdGNoIGV4Y2VwdGlvblxyXG4gICAgICBpZiAoZXhjZXB0aW9uLm5hbWUgaXMgXCJUeXBlRXJyb3JcIiBvciBleGNlcHRpb24udHlwZSBpcyBcImNhbGxlZF9ub25fY2FsbGFibGVcIikgYW5kIGV4Y2VwdGlvbi50eXBlIGlzIFwibm9uX29iamVjdF9wcm9wZXJ0eV9sb2FkXCJcclxuICAgICAgICBPSi5jb25zb2xlLmluZm8gXCJJZ25vcmluZyBleGNlcHRpb246IFwiLCBleGNlcHRpb25cclxuICAgICAgZWxzZVxyXG4gICAgICAgIE9KLmNvbnNvbGUuZXJyb3IgZXhjZXB0aW9uXHJcbiAgICBmaW5hbGx5XHJcblxyXG4gICAgcmV0XHJcblxyXG5cclxuICBPSi5yZWdpc3RlciBcIm1ldGhvZFwiLCBtZXRob2QgPSAodHJ5RnVuYykgLT5cclxuICAgICd1c2Ugc3RyaWN0J1xyXG4gICAgdGhhdCA9IHRoaXNcclxuICAgIC0+XHJcbiAgICAgIGFyZ3MgPSBBcnJheTo6c2xpY2UuY2FsbChhcmd1bWVudHMsIDApXHJcbiAgICAgIGFyZ3MudW5zaGlmdCB0cnlGdW5jXHJcbiAgICAgIE9KLnRyeUV4ZWMuYXBwbHkgdGhhdCwgYXJnc1xyXG5cclxuICByZXR1cm5cclxuIFxyXG4gXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgbnVtYmVyID0gT2JqZWN0LmNyZWF0ZShudWxsKVxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsIFwiaXNOYU5cIixcclxuICAgIHZhbHVlOiAoaWYgKE51bWJlciBhbmQgTnVtYmVyLmlzTmFOKSB0aGVuIE51bWJlci5pc05hTiBlbHNlIGlzTmFOKVxyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCBcImlzRmluaXRlXCIsXHJcbiAgICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5pc0Zpbml0ZSkgdGhlbiBOdW1iZXIuaXNGaW5pdGUgZWxzZSBpc0Zpbml0ZSlcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgXCJNQVhfVkFMVUVcIixcclxuICAgIHZhbHVlOiAoaWYgKE51bWJlciBhbmQgTnVtYmVyLk1BWF9WQUxVRSkgdGhlbiBOdW1iZXIuTUFYX1ZBTFVFIGVsc2UgMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDgpXHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsIFwiTUlOX1ZBTFVFXCIsXHJcbiAgICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5NSU5fVkFMVUUpIHRoZW4gTnVtYmVyLk1JTl9WQUxVRSBlbHNlIDVlLTMyNClcclxuXHJcbiAgT0oucmVnaXN0ZXIgXCJudW1iZXJcIiwgbnVtYmVyXHJcbiAgcmV0dXJuXHJcblxyXG4iLCIjICMgb2JqZWN0XHJcblxyXG5kbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIFxyXG4gICMgIyMgW09KXShvai5odG1sKS5vYmplY3RcclxuICAjIGNyZWF0ZSBhbiBvYmplY3Qgd2l0aCBoZWxwZXIgYGFkZGAgYW5kIGBlYWNoYCBtZXRob2RzLlxyXG4gIG9iamVjdCA9IC0+XHJcbiAgICBvYmogPSB7fVxyXG4gICAgXHJcbiAgICAjIyNcclxuICAgIEFkZCBhIHByb3BlcnR5IHRvIHRoZSBvYmplY3QgYW5kIHJldHVybiBpdFxyXG4gICAgIyMjXHJcbiAgICBvYmouYWRkID0gKG5hbWUsIHZhbCkgLT4gXHJcbiAgICAgIE9KLnByb3BlcnR5IG9iaiwgbmFtZSwgdmFsXHJcbiAgICAgIG9ialxyXG4gICAgXHJcbiAgICBvYmouYWRkICdlYWNoJywgKGNhbGxiYWNrKSAtPlxyXG4gICAgICBPSi5lYWNoIG9iaiwgKHZhbCwga2V5KSAtPlxyXG4gICAgICAgIGlmIGtleSBpc250ICdlYWNoJyBhbmQga2V5IGlzbnQgJ2FkZCdcclxuICAgICAgICAgIGNhbGxiYWNrIHZhbCwga2V5XHJcbiAgICAgICAgXHJcbiAgICBvYmpcclxuXHJcbiAgT0oucmVnaXN0ZXIgJ29iamVjdCcsIG9iamVjdFxyXG4gIFxyXG4gICMgIyMgW09KXShvai5odG1sKS5pc0luc3RhbmNlT2ZcclxuICAjIGRldGVybWluZXMgaXMgYSB0aGluZyBpcyBhbiBpbnN0YW5jZSBvZiBhIFRoaW5nLCBhc3N1bWluZyB0aGUgdGhpbmdzIHdlcmUgYWxsIGNyZWF0ZWQgaW4gT0pcclxuICBPSi5yZWdpc3RlciAnaXNJbnN0YW5jZU9mJywgKG5hbWUsIG9iaikgLT5cclxuICAgIE9KLmNvbnRhaW5zKG5hbWUsIG9iaikgYW5kIE9KLnRvLmJvb2wob2JqW25hbWVdKVxyXG4gICBcclxuICAjICMjIFtPSl0ob2ouaHRtbCkuY29udGFpbnNcclxuICAjIHRydWUgaWYgdGhlIGBvYmplY3RgIGNvbnRhaW5zIHRoZSB2YWx1ZSAgIFxyXG4gIE9KLnJlZ2lzdGVyICdjb250YWlucycsIChvYmplY3QsIGluZGV4KSAtPlxyXG4gICAgcmV0ID0gZmFsc2VcclxuICAgIGlmIG9iamVjdFxyXG4gICAgICByZXQgPSBfLmNvbnRhaW5zIG9iamVjdCwgaW5kZXhcclxuICAgIHJldFxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuY29tcGFyZVxyXG4gICMgY29tcGFyZSB0d28gb2JqZWN0cy9hcnJheXMvdmFsdWVzIGZvciBzdHJpY3QgZXF1YWxpdHlcclxuICBPSi5yZWdpc3RlciAnY29tcGFyZScsIChvYmoxLCBvYmoyKSAtPlxyXG4gICAgXy5pc0VxdWFsIG9iajEsIG9iajJcclxuICAgIFxyXG4gICMgIyMgW09KXShvai5odG1sKS5jbG9uZVxyXG4gICMgY29weSBhbGwgb2YgdGhlIHZhbHVlcyAocmVjdXJzaXZlbHkpIGZyb20gb25lIG9iamVjdCB0byBhbm90aGVyLiAgXHJcbiAgT0oucmVnaXN0ZXIgJ2Nsb25lJywgKGRhdGEpIC0+XHJcbiAgICBfLmNsb25lRGVlcCBkYXRhIHRydWVcclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLnNlcmlhbGl6ZVxyXG4gICMgQ29udmVydCBhbiBvYmplY3QgdG8gYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBvYmplY3RcclxuICBPSi5yZWdpc3RlciAnc2VyaWFsaXplJywgKGRhdGEpIC0+XHJcbiAgICByZXQgPSAnJ1xyXG4gICAgT0oudHJ5RXhlYyAtPlxyXG4gICAgICByZXQgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG4gICAgICByZXR1cm5cclxuICAgIHJldCBvciAnJ1xyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuZGVzZXJpYWxpemVcclxuICAjIENvbnZlcnQgYSBKU09OIHN0cmluZyB0byBhbiBvYmplY3RcclxuICBPSi5yZWdpc3RlciAnZGVzZXJpYWxpemUnLCAoZGF0YSkgLT5cclxuICAgIHJldCA9IHt9XHJcbiAgICBpZiBkYXRhXHJcbiAgICAgIE9KLnRyeUV4ZWMgLT5cclxuICAgICAgICByZXQgPSB3aW5kb3cuJC5wYXJzZUpTT04oZGF0YSlcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIHJldCA9IHt9ICBpZiBPSi5pcy5udWxsT3JFbXB0eShyZXQpXHJcbiAgICByZXRcclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLnBhcmFtc1xyXG4gICMgQ29udmVydCBhbiBvYmplY3QgdG8gYSBkZWxpbWl0ZWQgbGlzdCBvZiBwYXJhbWV0ZXJzIChub3JtYWxseSBxdWVyeS1zdHJpbmcgcGFyYW1ldGVycylcclxuICBPSi5yZWdpc3RlciAncGFyYW1zJywgKGRhdGEsIGRlbGltaXRlciA9ICcmJykgLT5cclxuICAgIHJldCA9ICcnXHJcbiAgICBpZiBkZWxpbWl0ZXIgaXMgJyYnXHJcbiAgICAgIE9KLnRyeUV4ZWMgLT5cclxuICAgICAgICByZXQgPSAkLnBhcmFtKGRhdGEpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgZWxzZVxyXG4gICAgICBPSi5lYWNoIGRhdGEsICh2YWwsIGtleSkgLT5cclxuICAgICAgICByZXQgKz0gZGVsaW1pdGVyICBpZiByZXQubGVuZ3RoID4gMFxyXG4gICAgICAgIHJldCArPSBrZXkgKyAnPScgKyB2YWxcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICBPSi50by5zdHJpbmcgcmV0XHJcblxyXG4gICMgIyMgW09KXShvai5odG1sKS5leHRlbmRcclxuICAjIGNvcHkgdGhlIHByb3BlcnRpZXMgb2Ygb25lIG9iamVjdCB0byBhbm90aGVyIG9iamVjdFxyXG4gIE9KLnJlZ2lzdGVyICdleHRlbmQnLCAoZGVzdE9iaiwgc3JjT2JqLCBkZWVwQ29weSA9IGZhbHNlKSAtPlxyXG4gICAgcmV0ID0gZGVzdE9iaiBvciB7fVxyXG4gICAgaWYgZGVlcENvcHkgaXMgdHJ1ZVxyXG4gICAgICByZXQgPSAkLmV4dGVuZChkZWVwQ29weSwgcmV0LCBzcmNPYmopXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldCA9ICQuZXh0ZW5kKHJldCwgc3JjT2JqKVxyXG4gICAgcmV0XHJcbiAgXHJcbiAgXHJcbiAgXHJcbiAgXHJcbiAgcmV0dXJuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIFxyXG4gICMjI1xyXG4gIEFkZCBhIHByb3BlcnR5IHRvIGFuIG9iamVjdFxyXG4gIFxyXG4gICMjI1xyXG4gIHByb3BlcnR5ID0gKG9iaiwgbmFtZSwgdmFsdWUsIHdyaXRhYmxlLCBjb25maWd1cmFibGUsIGVudW1lcmFibGUpIC0+XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgZGVmaW5lIGEgcHJvcGVydHkgd2l0aG91dCBhbiBPYmplY3QuXCIgIHVubGVzcyBvYmpcclxuICAgIHRocm93IG5ldyBFcnJvciBcIkNhbm5vdCBjcmVhdGUgYSBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgcHJvcGVydHkgbmFtZS5cIiAgdW5sZXNzIG5hbWU/XHJcbiAgICBvYmpbbmFtZV0gPSB2YWx1ZVxyXG4gICAgb2JqXHJcblxyXG4gIE9KLnJlZ2lzdGVyIFwicHJvcGVydHlcIiwgcHJvcGVydHlcclxuICByZXR1cm5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgT0oucmVnaXN0ZXIgXCJkZWxpbWl0ZWRTdHJpbmdcIiwgKHN0cmluZywgb3B0cykgLT5cclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgbmV3TGluZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICAgIHNwYWNlVG9EZWxpbWl0ZXI6IHRydWVcclxuICAgICAgcmVtb3ZlRHVwbGljYXRlczogdHJ1ZVxyXG4gICAgICBkZWxpbWl0ZXI6IFwiLFwiXHJcbiAgICAgIGluaXRTdHJpbmc6IE9KLnRvLnN0cmluZyBzdHJpbmdcclxuXHJcbiAgICByZXRPYmogPVxyXG4gICAgICBhcnJheTogW11cclxuICAgICAgZGVsaW1pdGVkOiAtPlxyXG4gICAgICAgIHJldE9iai5hcnJheS5qb2luIGRlZmF1bHRzLmRlbGltaXRlclxyXG5cclxuICAgICAgc3RyaW5nOiAoZGVsaW1pdGVyID0gZGVmYXVsdHMuZGVsaW1pdGVyKSAtPlxyXG4gICAgICAgIHJldCA9ICcnXHJcbiAgICAgICAgT0ouZWFjaCByZXRPYmouYXJyYXksICh2YWwpIC0+XHJcbiAgICAgICAgICByZXQgKz0gZGVsaW1pdGVyICBpZiByZXQubGVuZ3RoID4gMFxyXG4gICAgICAgICAgcmV0ICs9IHZhbFxyXG4gICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgIHJldFxyXG5cclxuICAgICAgdG9TdHJpbmc6IC0+XHJcbiAgICAgICAgcmV0T2JqLnN0cmluZygpXHJcblxyXG4gICAgICBhZGQ6IChzdHIpIC0+XHJcbiAgICAgICAgcmV0T2JqLmFycmF5LnB1c2ggZGVmYXVsdHMucGFyc2Uoc3RyKVxyXG4gICAgICAgIGRlZmF1bHRzLmRlbGV0ZUR1cGxpY2F0ZXMoKVxyXG4gICAgICAgIHJldE9ialxyXG5cclxuICAgICAgcmVtb3ZlOiAoc3RyKSAtPlxyXG4gICAgICAgIHJlbW92ZSA9IChhcnJheSkgLT5cclxuICAgICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgICAgdHJ1ZSAgaWYgaXRlbSBpc250IHN0clxyXG5cclxuXHJcbiAgICAgICAgcmV0T2JqLmFycmF5ID0gcmVtb3ZlKHJldE9iai5hcnJheSlcclxuICAgICAgICByZXRPYmpcclxuXHJcbiAgICAgIGNvdW50OiAtPlxyXG4gICAgICAgIHJldE9iai5hcnJheS5sZW5ndGhcclxuXHJcbiAgICAgIGNvbnRhaW5zOiAoc3RyLCBjYXNlU2Vuc2l0aXZlKSAtPlxyXG4gICAgICAgIGlzQ2FzZVNlbnNpdGl2ZSA9IE9KLnRvLmJvb2woY2FzZVNlbnNpdGl2ZSlcclxuICAgICAgICBzdHIgPSBPSi50by5zdHJpbmcoc3RyKS50cmltKClcclxuICAgICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKSAgaWYgZmFsc2UgaXMgaXNDYXNlU2Vuc2l0aXZlXHJcbiAgICAgICAgbWF0Y2ggPSByZXRPYmouYXJyYXkuZmlsdGVyKChtYXRTdHIpIC0+XHJcbiAgICAgICAgICAoaXNDYXNlU2Vuc2l0aXZlIGFuZCBPSi50by5zdHJpbmcobWF0U3RyKS50cmltKCkgaXMgc3RyKSBvciBPSi50by5zdHJpbmcobWF0U3RyKS50cmltKCkudG9Mb3dlckNhc2UoKSBpcyBzdHJcclxuICAgICAgICApXHJcbiAgICAgICAgbWF0Y2gubGVuZ3RoID4gMFxyXG5cclxuICAgICAgZWFjaDogKGNhbGxCYWNrKSAtPlxyXG4gICAgICAgIHJldE9iai5hcnJheS5mb3JFYWNoIGNhbGxCYWNrXHJcblxyXG4gICAgZGVmYXVsdHMucGFyc2UgPSAoc3RyKSAtPlxyXG4gICAgICByZXQgPSBPSi50by5zdHJpbmcoc3RyKVxyXG4gICAgICByZXQgPSByZXQucmVwbGFjZSgvXFxuL2csIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiXFxuXCIpIGlzbnQgLTEgIGlmIGRlZmF1bHRzLm5ld0xpbmVUb0RlbGltaXRlclxyXG4gICAgICByZXQgPSByZXQucmVwbGFjZShSZWdFeHAoXCIgXCIsIFwiZ1wiKSwgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCIgXCIpIGlzbnQgLTEgIGlmIGRlZmF1bHRzLnNwYWNlVG9EZWxpbWl0ZXJcclxuICAgICAgcmV0ID0gcmV0LnJlcGxhY2UoLywsL2csIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiLCxcIikgaXNudCAtMVxyXG4gICAgICByZXRcclxuXHJcbiAgICBkZWZhdWx0cy5kZWxldGVEdXBsaWNhdGVzID0gLT5cclxuICAgICAgaWYgZGVmYXVsdHMucmVtb3ZlRHVwbGljYXRlc1xyXG4gICAgICAgICgtPlxyXG4gICAgICAgICAgdW5pcXVlID0gKGFycmF5KSAtPlxyXG4gICAgICAgICAgICBzZWVuID0gbmV3IFNldCgpXHJcbiAgICAgICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgICAgICBpZiBmYWxzZSBpcyBzZWVuLmhhcyhpdGVtKVxyXG4gICAgICAgICAgICAgICAgc2Vlbi5hZGQgaXRlbVxyXG4gICAgICAgICAgICAgICAgdHJ1ZVxyXG5cclxuXHJcbiAgICAgICAgICByZXRPYmouYXJyYXkgPSB1bmlxdWUocmV0T2JqLmFycmF5KVxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgKSgpXHJcbiAgICAgIHJldHVyblxyXG5cclxuICAgICgoYSkgLT5cclxuICAgICAgaWYgYS5sZW5ndGggPiAxIGFuZCBmYWxzZSBpcyBPSi5pcy5wbGFpbk9iamVjdChvcHRzKVxyXG4gICAgICAgIE9KLmVhY2ggYSwgKHZhbCkgLT5cclxuICAgICAgICAgIHJldE9iai5hcnJheS5wdXNoIHZhbCAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkodmFsKVxyXG4gICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICBlbHNlIGlmIHN0cmluZyBhbmQgc3RyaW5nLmxlbmd0aCA+IDBcclxuICAgICAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdHNcclxuICAgICAgICBkZWxpbWl0ZWRTdHJpbmcgPSBkZWZhdWx0cy5wYXJzZShzdHJpbmcpXHJcbiAgICAgICAgZGVmYXVsdHMuaW5pdFN0cmluZyA9IGRlbGltaXRlZFN0cmluZ1xyXG4gICAgICAgIHJldE9iai5hcnJheSA9IGRlbGltaXRlZFN0cmluZy5zcGxpdChkZWZhdWx0cy5kZWxpbWl0ZXIpXHJcbiAgICAgIGRlZmF1bHRzLmRlbGV0ZUR1cGxpY2F0ZXMoKVxyXG4gICAgICByZXR1cm5cclxuICAgICkgYXJndW1lbnRzXHJcbiAgICByZXRPYmpcclxuXHJcbiAgcmV0dXJuXHJcblxyXG4iLCIjICMgY29tcG9uZW50XHJcblxyXG5kbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG5cclxuICAjIENyZWF0ZSBhbiBIVE1MIFdlYiBDb21wb25lbnQgdGhyb3VnaCBUaGluRG9tXHJcbiAgXHJcbiAgIyAtIGBvcHRpb25zYCBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzdGFuZGFyZCBvcHRpb25zIHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBjb21wb25lbnRcclxuICAjIC0tIGByb290Tm9kZVR5cGVgOiB0aGUgdGFnIG5hbWUgb2YgdGhlIHJvb3Qgbm9kZSB0byBjcmVhdGUsIGRlZmF1bHQgPSAnZGl2J1xyXG4gICMgLS0gYHByb3BzYDogYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgRE9NIGF0dHJpYnV0ZXMgdG8gYXBwZW5kIHRvIHRoZSByb290IG5vZGVcclxuICAjIC0tIGBzdHlsZXNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBDU1MgYXR0cmlidXRlcyB0byBhcHBlbmQgdG8gdGhlIHJvb3Qgbm9kZVxyXG4gICMgLS0gYGV2ZW50c2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5hbWVkIERPTSBldmVudHMgKGFuZCBjb3JyZXNwb25kaW5nIGNhbGxiYWNrIG1ldGhvZHMpIHRvIGJpbmQgdG8gdGhlIHJvb3Qgbm9kZSBcclxuICAjIC0gYG93bmVyYCB0aGUgcGFyZW50IHRvIHdoaWNoIHRoZSBjb21wb25lbnQgbm9kZSB3aWxsIGJlIGFwcGVuZGVkXHJcbiAgIyAtIGB0YWdOYW1lYCB0aGUgbmFtZSBvZiBvZiB0aGUgY29tcG9uZW50LCB3aGljaCB3aWxsIGFsd2F5cyBiZSBwcmVmaXhlZCB3aXRoICd4LSdcclxuICBjb21wb25lbnQgPSAob3B0aW9ucyA9IE9KLm9iamVjdCgpLCBvd25lciwgdGFnTmFtZSkgLT5cclxuICBcclxuICAgIGlmIG5vdCB0YWdOYW1lLnN0YXJ0c1dpdGggJ3gtJyB0aGVuIHRhZ05hbWUgPSAneC0nICsgdGFnTmFtZVxyXG4gICAgIyB3ZWIgY29tcG9uZW50cyBhcmUgcmVhbGx5IGp1c3Qgb3JkaW5hcnkgT0ogW2VsZW1lbnRdKGVsZW1lbnQuaHRtbCkncyB3aXRoIGEgc3BlY2lhbCBuYW1lLlxyXG4gICAgIyBVbnRpbCBIVE1MIFdlYiBDb21wb25lbnRzIGFyZSBmdWxseSBzdXBwb3J0ZWQgKGFuZCBPSiBpcyByZWZhY3RvcmVkIGFjY29yZGluZ2x5KSwgdGhlIGVsZW1lbnQgd2lsbCBiZSB0cmVhdGVkIGFzIGFuIHVua25vd24gZWxlbWVudC5cclxuICAgICMgSW4gbW9zdCBjYXNlcywgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgdGhlIGJyb3dzZXIgaXMgYWNjZXB0YWJsZSAoc2VlIGFsc28gW0hUTUwgU2VtYW50aWNzXShodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL3NlbWFudGljcy5odG1sKSksIGJ1dFxyXG4gICAgIyBpbiBzb21lIGNhc2VzIHRoaXMgaXMgcHJvYmxlbWF0aWMgKGZpcnN0bHksIGJlY2F1c2UgdGhlc2UgZWxlbWVudHMgYXJlIGFsd2F5cyByZW5kZXJlZCBpbmxpbmUpLlxyXG4gICAgIyBJbiBzdWNoIGNvbmRpdGlvbnMsIHRoZSBbY29udHJvbHNdKGNvbnRyb2xzLmh0bWwpIGNsYXNzIGFuZCBuYW1lIHNwYWNlIGlzIGJldHRlciBzdWl0ZWQgdG8gY2xhc3NlcyB3aGljaCByZXF1aXJlIGNvbXBsZXRlIGNvbnRyb2wgKGUuZy4gW2ljb25dKGljb24uaHRtbCkpLlxyXG4gICAgd2lkZ2V0ID0gT0ouZWxlbWVudCB0YWdOYW1lICMsIG9wdGlvbnMucHJvcHMsIG9wdGlvbnMuc3R5bGVzLCBvcHRpb25zLmV2ZW50cywgb3B0aW9ucy50ZXh0XHJcbiAgICBPSi5ub2Rlcy5mYWN0b3J5IHdpZGdldCwgb3duZXJcclxuICAgIFxyXG4gICAgIyBTaW5jZSB0aGUgYmVoYXZpb3Igb2Ygc3R5bGluZyBpcyBub3Qgd2VsbCBjb250cm9sbGVkL2NvbnRyb2xsYWJsZSBvbiB1bmtub3duIGVsZW1lbnRzLCBpdCBpcyBuZWNlc3NhcnkgdG8gY3JlYXRlIGEgcm9vdCBub2RlIGZvciB0aGUgY29tcG9uZW50LlxyXG4gICAgIyBJbiBtb3N0IGNhc2VzLCBbZGl2XShkaXYuaHRtbCkgaXMgcGVyZmVjdGx5IGFjY2VwdGFibGUsIGJ1dCB0aGlzIGlzIGNvbmZpZ3VyYWJsZSBhdCB0aGUgbmFtZSBzcGFjZSBsZXZlbCBvciBhdCBydW50aW1lLiBcclxuICAgIHJvb3ROb2RlVHlwZSA9IG9wdGlvbnMucm9vdE5vZGVUeXBlIG9yIE9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gb3IgJ2RpdidcclxuICAgIFxyXG4gICAgIyBgcmV0YCBpcyB0aGUgdGhlIGluc3RhbmNlIG9mIHRoZSByb290Tm9kZVR5cGUsIG5vdCB0aGUgYHdpZGdldGAgd3JhcHBlZCBpbiB0aGlzIGNsb3N1cmVcclxuICAgIHJldCA9IHdpZGdldC5tYWtlIHJvb3ROb2RlVHlwZSwgb3B0aW9uc1xyXG4gICAgXHJcbiAgICAjIGZvciBjb252ZW5pZW5jZSBhbmQgZGVidWdnaW5nLCBwZXJzaXN0IHRoZSB0YWdOYW1lXHJcbiAgICByZXQuYWRkICdjb21wb25lbnROYW1lJywgdGFnTmFtZVxyXG4gICAgXHJcbiAgICAjIGByZW1vdmVgIGRvZXMsIGhvd2V2ZXIsIGJlaGF2ZSBhcyBleHBlY3RlZCBieSByZW1vdmluZyBgd2lkZ2V0YFxyXG4gICAgcmV0LmFkZCAncmVtb3ZlJywgd2lkZ2V0LnJlbW92ZVxyXG4gICAgcmV0XHJcbiAgICBcclxuICBPSi5yZWdpc3RlciAnY29tcG9uZW50JywgY29tcG9uZW50XHJcblxyXG4gIHJldHVyblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuXHJcbiAgIyMjXHJcbiAgQ3JlYXRlIGEgc2V0IG9mIEhUTUwgRWxlbWVudHMgdGhyb3VnaCBUaGluRG9tXHJcbiAgIyMjXHJcbiAgY29udHJvbCA9IChvcHRpb25zID0gT0oub2JqZWN0KCksIG93bmVyLCB0YWdOYW1lKSAtPlxyXG4gICAgaWYgbm90IHRhZ05hbWUuc3RhcnRzV2l0aCAneS0nIHRoZW4gdGFnTmFtZSA9ICd5LScgKyB0YWdOYW1lXHJcbiAgICBcclxuICAgIHJvb3ROb2RlVHlwZSA9IG9wdGlvbnMucm9vdE5vZGVUeXBlIG9yIE9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gb3IgJ2RpdidcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouZWxlbWVudCByb290Tm9kZVR5cGUsIG9wdGlvbnMucHJvcHMsIG9wdGlvbnMuc3R5bGVzLCBvcHRpb25zLmV2ZW50cywgb3B0aW9ucy50ZXh0XHJcbiAgICBPSi5ub2Rlcy5mYWN0b3J5IHJldCwgb3duZXJcclxuICAgIFxyXG4gICAgcmV0LmFkZCAnY29udHJvbE5hbWUnLCB0YWdOYW1lXHJcbiAgICBcclxuICAgIHJldFxyXG4gICAgXHJcbiAgT0oucmVnaXN0ZXIgJ2NvbnRyb2wnLCBjb250cm9sXHJcblxyXG4gIHJldHVyblxyXG5cclxuIiwiIyAjIGRvbVxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBcclxuICAjIEV4dGVuZCBhbiBvYmplY3Qgd2l0aCBPSiBET00gbWV0aG9kcyBhbmQgcHJvcGVydGllc1xyXG4gIFxyXG4gICMgLSBgZWxgIE9iamVjdCB0byBleHRlbmRcclxuICAjIC0gYHBhcmVudGAgcGFyZW50IG9iamVjdCB0byB3aGljaCBgZWxgIHdpbGwgYmUgYXBwZW5kZWRcclxuICBPSi5yZWdpc3RlciAnZG9tJywgKGVsLCBwYXJlbnQgPSBPSi5ib2R5ICkgLT5cclxuICAgICd1c2Ugc3RyaWN0J1xyXG5cclxuICAgIGVuYWJsZWQgPSB0cnVlXHJcbiAgICBcclxuICAgICMgIyMgaXNWYWxpZFxyXG4gICAgZWwuYWRkICdpc1ZhbGlkJywgLT5cclxuICAgICAgIGVsIGFuZCAoZWwuZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCBvciBlbC5lbCBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpXHJcbiAgICBcclxuICAgIGlzQ29udHJvbFN0aWxsVmFsaWQgPSAtPlxyXG4gICAgICB2YWxpZCA9IGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5KGVsKSBhbmQgZWwuaXNWYWxpZCgpXHJcbiAgICAgIHRocm93IG5ldyBFcnJvciAnZWwgaXMgbnVsbC4gRXZlbnQgYmluZGluZ3MgbWF5IG5vdCBoYXZlIGJlZW4gR0NkLicgIGlmIGZhbHNlIGlzIHZhbGlkXHJcbiAgICAgIHZhbGlkXHJcbiAgICBcclxuICAgICMgIyMgYWRkQ2xhc3MgIFxyXG4gICAgIyBBZGQgYSBDU1MgY2xhc3MgdG8gYW4gZWxlbWVudFxyXG4gICAgXHJcbiAgICAjIC0gYG5hbWVgIHRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0byBhZGRcclxuICAgIGVsLmFkZCAnYWRkQ2xhc3MnLCAobmFtZSkgLT5cclxuICAgICAgZWwuJC5hZGRDbGFzcyBuYW1lIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBlbFxyXG4gICAgXHJcbiAgICAjICMjIGJpbmRcclxuICAgICMgQmluZCBhbiBhY3Rpb24gdG8gYSBqUXVlcnkgZWxlbWVudCdzIGV2ZW50LlxyXG4gICAgZWwuYWRkICdiaW5kJywgKGV2ZW50TmFtZSwgZXZlbnQpIC0+XHJcbiAgICAgIGVsLm9uIGV2ZW50TmFtZSwgZXZlbnRcclxuICAgIFxyXG4gICAgIyAjIyBvblxyXG4gICAgZWwuYWRkICdvbicsIChldmVudE5hbWUsIGV2ZW50KSAtPlxyXG4gICAgICBlbC4kLm9uIGV2ZW50TmFtZSwgZXZlbnQgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBlbFxyXG5cclxuICAgICMgIyMgb2ZmXHJcbiAgICBlbC5hZGQgJ29mZicsIChldmVudE5hbWUsIGV2ZW50KSAtPlxyXG4gICAgICBlbC4kLm9mZiBldmVudE5hbWUsIGV2ZW50ICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgZWxcclxuICBcclxuICAgICMgIyMga2V5Ym9hcmRcclxuICAgICMgQmluZCBhbiBldmVudCB0byBhIGtleSwgd2hlbiBwcmVzc2VkIGluIHRoaXMgY29udHJvbC5cclxuICAgICMgVGhlIE9KIG9iamVjdCAoZm9yIGNoYWluaW5nKVxyXG4gICAgZWwuYWRkICdrZXlib2FyZCcsIChrZXlzLCBldmVudCkgLT5cclxuICAgICAgTW91c2V0cmFwLmJpbmQga2V5cywgZWxbZXZlbnRdICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgZWxcclxuICAgIFxyXG4gICAgIyAjIyBkaXNhYmxlXHJcbiAgICAjIERpc2FibGUgdGhlIGVsZW1lbnQuXHJcbiAgICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcclxuICAgIGVsLmFkZCAnZGlzYWJsZScsIC0+XHJcbiAgICAgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICAgIGVuYWJsZWQgPSBmYWxzZVxyXG4gICAgICAgIGVsLmF0dHIgJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJ1xyXG4gICAgICAgIGVsLmFkZENsYXNzICdkaXNhYmxlZCcsICdkaXNhYmxlZCdcclxuICAgICAgZWxcclxuICBcclxuICAgICMgIyMgZW1wdHlcclxuICAgICMgRW1wdHkgdGhlIGVsZW1lbnQuXHJcbiAgICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZykgXHJcbiAgICBlbC5hZGQgJ2VtcHR5JywgLT5cclxuICAgICAgZWwuJC5lbXB0eSgpICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgZWxcclxuXHJcbiAgICAjICMjIGVuYWJsZVxyXG4gICAgIyBFbmFibGUgdGhlIGVsZW1lbnQuXHJcbiAgICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZykgXHJcbiAgICBlbC5hZGQgJ2VuYWJsZScsIC0+XHJcbiAgICAgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICAgIGVuYWJsZWQgPSB0cnVlXHJcbiAgICAgICAgZWwucmVtb3ZlQXR0ciAnZGlzYWJsZWQnXHJcbiAgICAgICAgZWwucmVtb3ZlQ2xhc3MgJ2Rpc2FibGVkJ1xyXG4gICAgICBlbFxyXG5cclxuICAgICMgIyMgZ2V0SWRcclxuICAgICMgR2V0IHRoZSBET00gRWxlbWVudCBJRCBvZiB0aGlzIG9iamVjdC5cclxuICAgIGVsLmFkZCAnZ2V0SWQnLCAtPlxyXG4gICAgICBpZCA9IGVsWzBdLmlkICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgaWRcclxuXHJcbiAgICAjICMjIGhpZGVcclxuICAgICMgTWFrZSB0aGUgZWxlbWVudCBpbnZpc2libGUuXHJcbiAgICBlbC5hZGQgJ2hpZGUnLCAtPlxyXG4gICAgICBlbC5jc3MgJ2Rpc3BsYXknLCAnbm9uZScgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBlbFxyXG4gICAgXHJcbiAgICAjICMjIGxlbmd0aFxyXG4gICAgIyBHZXQgdGhlIGxlbmd0aCBvZiB0aGlzIGVsZW1lbnQuXHJcbiAgICBlbC5hZGQgJ2xlbmd0aCcsIC0+XHJcbiAgICAgIGxlbiA9IDBcclxuICAgICAgbGVuID0gT0oudG8ubnVtYmVyKGVsLiQubGVuZ3RoKSAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGxlblxyXG5cclxuICAgICMgIyMgcGFyZW50XHJcbiAgICAjIFJlZmVyZW5jZSB0byB0aGUgcGFyZW50IGFzIHBhc3NlZCBpblxyXG4gICAgZWwuYWRkICdwYXJlbnQnLCBwYXJlbnRcclxuICAgIFxyXG4gICAgIyAjIyByZW1vdmVcclxuICAgICMgUmVtb3ZlIHRoZSBub2RlIGZyb20gdGhlIERPTVxyXG4gICAgZWwuYWRkICdyZW1vdmUnLCAtPlxyXG4gICAgICBpZiBlbCBhbmQgZWwuJFxyXG4gICAgICAgIGVsLiQucmVtb3ZlKClcclxuICAgICAgICBcclxuICAgICAgICAjIFNldCB0aGUgdmFsdWUgb2YgZWwgdG8gbnVsbCB0byBndWFyYW50ZWUgdGhhdCBpc0NvbnRyb2xTdGlsbFZhbGlkIHdpbGwgYmUgY29ycmVjdFxyXG4gICAgICAgIGVsID0gbnVsbFxyXG4gICAgICBudWxsXHJcbiAgICBcclxuICAgICMgIyMgcmVtb3ZlQ2xhc3NcclxuICAgICMgUmVtb3ZlIGEgQ1NTIGNsYXNzIGZyb20gYW4gZWxlbWVudC5cclxuICAgIGVsLmFkZCAncmVtb3ZlQ2xhc3MnLCAobmFtZSkgLT5cclxuICAgICAgZWwuJC5yZW1vdmVDbGFzcyBuYW1lICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgZWxcclxuXHJcbiAgICAjICMjIHJlbW92ZVByb3BcclxuICAgICMgUmVtb3ZlIGEgcHJvcGVydHkgZnJvbSBhbiBlbGVtZW50LiBqUXVlcnkgZGlzdGluZ3Vpc2hlcyBiZXR3ZWVuICdwcm9wcycgYW5kICdhdHRyJzsgaGVuY2UgMiBtZXRob2RzLlxyXG4gICAgZWwuYWRkICdyZW1vdmVQcm9wJywgKG5hbWUpIC0+XHJcbiAgICAgIGVsLiQucmVtb3ZlUHJvcCBuYW1lICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgZWxcclxuXHJcbiAgICAjICMjIHJlbW92ZUF0dHJcclxuICAgICMgUmVtb3ZlIGEgcHJvcGVydHkgZnJvbSBhbiBlbGVtZW50LiBqUXVlcnkgZGlzdGluZ3Vpc2hlcyBiZXR3ZWVuICdwcm9wcycgYW5kICdhdHRyJzsgaGVuY2UgMiBtZXRob2RzLlxyXG4gICAgZWwuYWRkICdyZW1vdmVBdHRyJywgKG5hbWUpIC0+XHJcbiAgICAgIGVsLiQucmVtb3ZlQXR0ciBuYW1lICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgZWxcclxuXHJcbiAgICAjICMjIHJlcXVpcmVkXHJcbiAgICAjIE1hcmsgdGhlIHJlcXVpcmVkIHN0YXR1cyBvZiB0aGUgZWxlbWVudC5cclxuICAgIGVsLmFkZCAncmVxdWlyZWQnLCAodHJ1dGh5LCBhZGRMYWJlbCkgLT5cclxuICAgICAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgICAgc3dpdGNoIE9KLnRvLmJvb2wodHJ1dGh5KVxyXG4gICAgICAgICAgd2hlbiB0cnVlXHJcbiAgICAgICAgICAgIGVsLmF0dHIgJ3JlcXVpcmVkJywgdHJ1ZVxyXG4gICAgICAgICAgICBlbC5hZGRDbGFzcyAncmVxdWlyZWQnXHJcbiAgICAgICAgICB3aGVuIGZhbHNlXHJcbiAgICAgICAgICAgIGVsLnJlbW92ZVByb3AgJ3JlcXVpcmVkJ1xyXG4gICAgICAgICAgICBlbC5yZW1vdmVDbGFzcyAncmVxdWlyZWQnXHJcbiAgICAgIGVsXHJcblxyXG4gICAgIyAjIyByb290XHJcbiAgICAjIHJlZmVyZW5jZSB0byB0aGUgcm9vdCBvZiB0aGUgbm9kZVxyXG4gICAgZWwuYWRkICdyb290JywgZWwucm9vdCBvciBwYXJlbnRcclxuXHJcbiAgICAjICMjIHNob3dcclxuICAgICMgTWFrZSB0aGUgZWxlbWVudCB2aXNpYmxlLlxyXG4gICAgZWwuYWRkICdzaG93JywgLT5cclxuICAgICAgZWwuJC5zaG93KCkgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBlbFxyXG5cclxuICAgICMgIyMgdG9nZ2xlXHJcbiAgICAjIFRvZ2dsZSB2aXNpYmlsaXR5XHJcbiAgICBlbC5hZGQgJ3RvZ2dsZScsIC0+XHJcbiAgICAgIGVsLiQudG9nZ2xlKCkgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBlbFxyXG5cclxuICAgICMgIyMgdG9nZ2xlRW5hYmxlXHJcbiAgICAjIFRvZ2dsZSB0aGUgZWxlbWVudCdzIGVuYWJsZWQgc3RhdGUuXHJcbiAgICBlbC5hZGQgJ3RvZ2dsZUVuYWJsZScsIC0+XHJcbiAgICAgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICAgIGlmIGVuYWJsZWRcclxuICAgICAgICAgIGVsLmRpc2FibGUoKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGVsLmVuYWJsZSgpXHJcbiAgICAgIGVsXHJcblxyXG4gICAgIyAjIyB0cmlnZ2VyXHJcbiAgICAjIFRyaWdnZXIgYW4gZXZlbnQgYm91bmQgdG8gYSBqUXVlcnkgZWxlbWVudC5cclxuICAgIGVsLmFkZCAndHJpZ2dlcicsIChldmVudE5hbWUsIGV2ZW50T3B0cykgLT5cclxuICAgICAgZWwuJC50cmlnZ2VyIGV2ZW50TmFtZSwgZXZlbnRPcHRzICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgZWxcclxuXHJcbiAgICAjICMjIHVuYmluZFxyXG4gICAgIyBXcmFwcGVyIGFyb3VuZCBgb2ZmYFxyXG4gICAgZWwuYWRkICd1bmJpbmQnLCAoZXZlbnROYW1lLCBldmVudCkgLT5cclxuICAgICAgZWwub2ZmIGV2ZW50TmFtZSwgZXZlbnRcclxuICAgICAgXHJcbiAgICAjICMjIHZhbFxyXG4gICAgIyBHZXQgb3Igc2V0IHRoZSB2YWx1ZSBvZiB0aGUgZWxlbWVudC5cclxuICAgIGVsLmFkZCAndmFsJywgKHZhbHVlKSAtPlxyXG4gICAgICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDEgYW5kIGZhbHNlIGlzIE9KLmlzLm51bGxPclVuZGVmaW5lZCh2YWx1ZSlcclxuICAgICAgICAgIGVsLiQudmFsIHZhbHVlXHJcbiAgICAgICAgICBlbFxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGVsLiQudmFsKClcclxuXHJcbiAgICAjICMjIHZhbHVlT2ZcclxuICAgICMgd3JhcHBlciBhcm91bmQgYHZhbGBcclxuICAgIGVsLmFkZCAndmFsdWVPZicsIC0+XHJcbiAgICAgIGVsLnZhbCgpXHJcblxyXG4gICAgIyAjIyB0b1N0cmluZ1xyXG4gICAgIyB3cmFwcGVyIGFyb3VuZCBgdmFsYFxyXG4gICAgZWwuYWRkICd0b1N0cmluZycsIC0+XHJcbiAgICAgIGVsLnZhbCgpXHJcblxyXG4gICAgZWxcclxuXHJcbiAgT0oucmVnaXN0ZXIgJ2lzRWxlbWVudEluRG9tJywgKGVsZW1lbnRJZCkgLT5cclxuICAgIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5IE9KLmdldEVsZW1lbnQgZWxlbWVudElkXHJcblxyXG4gIE9KLnJlZ2lzdGVyICdnZXRFbGVtZW50JywgKGlkKSAtPlxyXG4gICAgaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCcgXHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSBcclxuICBcclxuICByZXR1cm5cclxuICBcclxuXHJcblxyXG4iLCIjICMgZWxlbWVudFxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuXHJcbiAgIyMjXHJcbiAgIEJpbmQgYWxsIGV2ZW50IGhhbmRsZXJzXHJcbiAgIyMjXHJcbiAgYmluZEV2ZW50cyA9IChlbCwgZXZlbnRzKSAtPlxyXG4gICAgaWYgZWwgdGhlbiBfLmZvck93biBldmVudHMsICh2YWwsIGtleSkgLT5cclxuICAgICAgaWYgT0ouaXMubWV0aG9kIHZhbFxyXG4gICAgICAgIGNhbGxiYWNrID0gKGV2ZW50Li4uKSAtPiB2YWwgZXZlbnQuLi5cclxuICAgICAgICBlbC4kLm9uIGtleSwgY2FsbGJhY2tcclxuICAgICAgICBlbC5hZGQga2V5LCBjYWxsYmFja1xyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAjIyNcclxuICBGaW5hbGl6ZSB0aGUgVGhpbURPTSBub2RlXHJcbiAgIyMjXHJcbiAgZmluYWxpemUgPSAocmV0LCB0YWcsIHByb3BzLCBzdHlsZXMsIGV2ZW50cywgdGV4dCkgLT5cclxuICAgIHJldC5hZGQgJ3RhZ05hbWUnLCB0YWdcclxuICAgIHJldC5jc3Mgc3R5bGVzXHJcbiAgICBpZiB0ZXh0IHRoZW4gcmV0LnRleHQgdGV4dFxyXG4gICAgcmV0LmFkZCAnJCcsICQocmV0LmdldCgpKVxyXG4gICAgcmV0LmFkZCAnMCcsIHJldC5nZXQoKVxyXG5cclxuICAgIHJldC5hZGQgJ2JpbmRFdmVudHMnLCBfLm9uY2UgKCkgLT4gYmluZEV2ZW50cyByZXQsIGV2ZW50c1xyXG4gICAgcmV0XHJcblxyXG4gICMgIyMgZWxlbWVudFxyXG4gICMjI1xyXG4gIENyZWF0ZSBhbiBIVE1MIEVsZW1lbnQgdGhyb3VnaCBUaGluRG9tXHJcbiAgIyMjXHJcbiAgT0oucmVnaXN0ZXIgJ2VsZW1lbnQnLCAodGFnLCBwcm9wcywgc3R5bGVzLCBldmVudHMsIHRleHQpIC0+XHJcbiAgICByZXQgPSBuZXcgVGhpbkRPTSB0YWcsIHByb3BzXHJcbiAgICBmaW5hbGl6ZSByZXQsIHRhZywgcHJvcHMsIHN0eWxlcywgZXZlbnRzLCB0ZXh0XHJcbiAgICByZXRcclxuXHJcbiAgIyAjIyByZXN0b3JlRWxlbWVudFxyXG4gICMjI1xyXG4gIFJlc3RvcmUgYW4gSFRNTCBFbGVtZW50IHRocm91Z2ggVGhpbkRvbVxyXG4gICMjI1xyXG4gIE9KLnJlZ2lzdGVyICdyZXN0b3JlRWxlbWVudCcsIChlbCwgdGFnID0gZWwubm9kZU5hbWUpIC0+XHJcbiAgICByZXQgPSBuZXcgVGhpbkRPTSBudWxsLCBudWxsLCBlbFxyXG4gICAgZmluYWxpemUgcmV0LCB0YWdcclxuICAgIHJldC5hZGQgJ2lzSW5ET00nLCB0cnVlXHJcbiAgICBPSi5ub2Rlcy5mYWN0b3J5IHJldFxyXG4gICAgcmV0XHJcblxyXG5cclxuICAjIyNcclxuICBQZXJzaXN0IGEgaGFuZGxlIG9uIHRoZSBib2R5IG5vZGVcclxuICAjIyNcclxuICBpZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJyB0aGVuIGJvZHkgPSBkb2N1bWVudC5ib2R5IGVsc2UgYm9keSA9IG51bGxcclxuICBpbml0Qm9keSA9IChlbCkgLT5cclxuICAgIHJldCA9IG5ldyBUaGluRE9NIG51bGwsIGlkOiAnYm9keScsIGVsXHJcbiAgICByZXQuaXNJbkRPTSA9IHRydWVcclxuICAgIGZpbmFsaXplIHJldCwgJ2JvZHknXHJcblxyXG4gIHRoaW5Cb2R5ID0gaW5pdEJvZHkgYm9keVxyXG4gIHRoaW5Cb2R5LmdldElkID0gLT5cclxuICAgICdib2R5J1xyXG5cclxuICBPSi5yZWdpc3RlciAnYm9keScsIHRoaW5Cb2R5XHJcblxyXG4gIHJldHVyblxyXG4iLCIjICMgZnJhZ21lbnRcclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuXHJcbiAgIyBDcmVhdGUgYSBkb2N1bWVudCBmcmFnbWVudCBhbmQgcmV0dXJuIGl0IGFzIGFuIE9KIG5vZGVcclxuICBPSi5yZWdpc3RlciAnZnJhZ21lbnQnLCAoKSAtPlxyXG4gICAgcmV0ID0gbnVsbFxyXG4gICAgaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCdcclxuICAgICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcclxuICAgICAgcmV0ID0gT0oucmVzdG9yZUVsZW1lbnQgZnJhZ21lbnQsICdmcmFnbWVudCdcclxuICAgIHJldCAgXHJcbiAgXHJcbiAgICAgICAgXHJcbiAgcmV0dXJuXHJcblxyXG4iLCIjICMgZ2VuZXJpYyBub2Rlc1xyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBjbG9zZWQgPSBbXHJcbiAgICAnYWJicidcclxuICAgICdhY3JvbnltJ1xyXG4gICAgJ2FwcGxldCdcclxuICAgICdhcnRpY2xlJ1xyXG4gICAgJ2FzaWRlJ1xyXG4gICAgJ2F1ZGlvJ1xyXG4gICAgJ2InXHJcbiAgICAnYmRvJ1xyXG4gICAgJ2JpZydcclxuICAgICdibG9ja3F1b3RlJ1xyXG4gICAgJ2J1dHRvbidcclxuICAgICdjYW52YXMnXHJcbiAgICAnY2FwdGlvbidcclxuICAgICdjZW50ZXInXHJcbiAgICAnY2l0ZSdcclxuICAgICdjb2RlJ1xyXG4gICAgJ2NvbGdyb3VwJ1xyXG4gICAgJ2RhdGFsaXN0J1xyXG4gICAgJ2RkJ1xyXG4gICAgJ2RlbCdcclxuICAgICdkZXRhaWxzJ1xyXG4gICAgJ2RmbidcclxuICAgICdkaXInXHJcbiAgICAnZGl2J1xyXG4gICAgJ2RsJ1xyXG4gICAgJ2R0J1xyXG4gICAgJ2VtJ1xyXG4gICAgJ2ZpZWxkc2V0J1xyXG4gICAgJ2ZpZ2NhcHRpb24nXHJcbiAgICAnZmlndXJlJ1xyXG4gICAgJ2ZvbnQnXHJcbiAgICAnZm9vdGVyJ1xyXG4gICAgJ2gxJ1xyXG4gICAgJ2gyJ1xyXG4gICAgJ2gzJ1xyXG4gICAgJ2g0J1xyXG4gICAgJ2g1J1xyXG4gICAgJ2g2J1xyXG4gICAgJ2hlYWQnXHJcbiAgICAnaGVhZGVyJ1xyXG4gICAgJ2hncm91cCdcclxuICAgICdodG1sJ1xyXG4gICAgJ2knXHJcbiAgICAnaWZyYW1lJ1xyXG4gICAgJ2lucydcclxuICAgICdrYmQnXHJcbiAgICAnbGFiZWwnXHJcbiAgICAnbGVnZW5kJ1xyXG4gICAgJ2xpJ1xyXG4gICAgJ21hcCdcclxuICAgICdtYXJrJ1xyXG4gICAgJ21lbnUnXHJcbiAgICAnbWV0ZXInXHJcbiAgICAnbmF2J1xyXG4gICAgJ25vZnJhbWVzJ1xyXG4gICAgJ25vc2NyaXB0J1xyXG4gICAgJ29iamVjdCdcclxuICAgICdvcHRncm91cCdcclxuICAgICdvcHRpb24nXHJcbiAgICAnb3V0cHV0J1xyXG4gICAgJ3AnXHJcbiAgICAncHJlJ1xyXG4gICAgJ3Byb2dyZXNzJ1xyXG4gICAgJ3EnXHJcbiAgICAncnAnXHJcbiAgICAncnQnXHJcbiAgICAncnVieSdcclxuICAgICdzJ1xyXG4gICAgJ3NhbXAnXHJcbiAgICAnc2VjdGlvbidcclxuICAgICdzbWFsbCdcclxuICAgICdzcGFuJ1xyXG4gICAgJ3N0cmlrZSdcclxuICAgICdzdHJvbmcnXHJcbiAgICAnc3R5bGUnXHJcbiAgICAnc3ViJ1xyXG4gICAgJ3N1bW1hcnknXHJcbiAgICAnc3VwJ1xyXG4gICAgJ3Rib2R5J1xyXG4gICAgJ3RkJ1xyXG4gICAgJ3Rmb290J1xyXG4gICAgJ3RoJ1xyXG4gICAgJ3RpbWUnXHJcbiAgICAndGl0bGUnXHJcbiAgICAndHInXHJcbiAgICAndHQnXHJcbiAgICAndSdcclxuICAgICd2YXInXHJcbiAgICAndmlkZW8nXHJcbiAgICAneG1wJ1xyXG4gIF1cclxuICBvcGVuID0gJ2FyZWEgYmFzZSBjb2wgY29tbWFuZCBjc3MgZW1iZWQgaHIgaW1nIGtleWdlbiBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnInLnNwbGl0ICcgJ1xyXG4gIGFsbCA9IGNsb3NlZC5jb25jYXQgb3BlblxyXG4gICMgcmVnaXN0ZXIgc2VtYW50aWMvc3RydWN0dXJhbCBhbGlhc2VzXHJcbiAgZm9yIGxvb3BOYW1lIGluIGFsbFxyXG4gICAgZG8gKHRhZyA9IGxvb3BOYW1lKSAtPlxyXG4gICAgICBPSi5ub2Rlcy5yZWdpc3RlciB0YWcsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gICAgICAgIGRlZmF1bHRzID1cclxuICAgICAgICAgIHByb3BzOiB7fVxyXG4gICAgICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICAgICAgZXZlbnRzOiB7fVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCBmYWxzZVxyXG4gICAgICAgIHJldCA9IE9KLmVsZW1lbnQgdGFnLCBkZWZhdWx0cy5wcm9wcywgZGVmYXVsdHMuc3R5bGVzLCBkZWZhdWx0cy5ldmVudHMsIGRlZmF1bHRzLnRleHRcclxuXHJcblxyXG4gICAgICAgIGlmIGZhbHNlIGlzIGNhbGxlZEZyb21GYWN0b3J5IHRoZW4gT0oubm9kZXMuZmFjdG9yeSByZXQsIG93bmVyXHJcblxyXG4gICAgICAgIHJldFxyXG4gICAgXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcblxyXG4gICMjI1xyXG4gIENyZWF0ZSBhbiBPSiBJbnB1dCBPYmplY3QgdGhyb3VnaCBPSi5ub2Rlcy5pbnB1dFxyXG4gICMjI1xyXG4gIGlucHV0ID0gKG9wdGlvbnMgPSBPSi5vYmplY3QoKSwgb3duZXIpIC0+XHJcbiAgICBpZiBub3Qgb3duZXIgdGhlbiB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgYW4gaW5wdXQgd2l0aG91dCBhIHBhcmVudCdcclxuICAgIGlmIG5vdCBvcHRpb25zLnByb3BzIG9yIG5vdCBvcHRpb25zLnByb3BzLnR5cGUgdGhlbiB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgYW4gaW5wdXQgd2l0aG91dCBhbiBpbnB1dCB0eXBlJ1xyXG4gICAgcmV0ID0gb3duZXIubWFrZSAnaW5wdXQnLCBvcHRpb25zXHJcbiAgICByZXQuYWRkICdpbnB1dE5hbWUnLCBvcHRpb25zLnByb3BzLnR5cGVcclxuICAgIHJldFxyXG4gICAgXHJcbiAgT0oucmVnaXN0ZXIgJ2lucHV0JywgaW5wdXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG5cclxuICBjbG9zZWQgPSAnYSBhYmJyIGFjcm9ueW0gYWRkcmVzcyBhcHBsZXQgYXJ0aWNsZSBhc2lkZSBhdWRpbyBiIGJkbyBiaWcgYmxvY2txdW90ZSBib2R5IGJ1dHRvbiBjYW52YXMgY2FwdGlvbiBjZW50ZXIgY2l0ZSBjb2RlIGNvbGdyb3VwIGNvbW1hbmQgZGF0YWxpc3QgZGQgZGVsIGRldGFpbHMgZGZuIGRpciBkaXYgZGwgZHQgZW0gZW1iZWQgZmllbGRzZXQgZmlnY2FwdGlvbiBmaWd1cmUgZm9udCBmb290ZXIgZm9ybSBmcmFtZXNldCBoMSBoMiBoMyBoNCBoNSBoNiBoZWFkIGhlYWRlciBoZ3JvdXAgaHRtbCBpIGlmcmFtZSBpbnMga2V5Z2VuIGtiZCBsYWJlbCBsZWdlbmQgbGkgbWFwIG1hcmsgbWVudSBtZXRlciBuYXYgbm9mcmFtZXMgbm9zY3JpcHQgb2JqZWN0IG9sIG9wdGdyb3VwIG9wdGlvbiBvdXRwdXQgcCBwcmUgcHJvZ3Jlc3MgcSBycCBydCBydWJ5IHMgc2FtcCBzY3JpcHQgc2VjdGlvbiBzZWxlY3Qgc21hbGwgc291cmNlIHNwYW4gc3RyaWtlIHN0cm9uZyBzdHlsZSBzdWIgc3VtbWFyeSBzdXAgdGFibGUgdGJvZHkgdGQgdGV4dGFyZWEgdGZvb3QgdGggdGhlYWQgdGltZSB0aXRsZSB0ciB0dCB1IHVsIHZhciB2aWRlbyB3YnIgeG1wJy5zcGxpdCAnICdcclxuICBvcGVuID0gJ2FyZWEgYmFzZSBiciBjb2wgY29tbWFuZCBjc3MgIURPQ1RZUEUgZW1iZWQgaHIgaW1nIGlucHV0IGtleWdlbiBsaW5rIG1ldGEgcGFyYW0gc291cmNlIHRyYWNrIHdicicuc3BsaXQgJyAnXHJcbiAgXHJcbiAgbmVzdGFibGVOb2RlTmFtZXMgPSBbXHJcbiAgICAnZGl2JyBcclxuICAgICdzcGFuJyBcclxuICAgICdoMScgXHJcbiAgICAnaDInIFxyXG4gICAgJ2gzJyBcclxuICAgICdoNCcgXHJcbiAgICAnaDUnIFxyXG4gICAgJ2g2JyBcclxuICAgICdwJyBcclxuICAgICdmaWVsZHNldCcgXHJcbiAgICAnc2VsZWN0JyBcclxuICAgICdvbCcgXHJcbiAgICAndWwnIFxyXG4gICAgJ3RhYmxlJ1xyXG4gIF1cclxuICAgICAgXHJcbiAgI1RoaXMgbGlzdCBpcyBub3QgeWV0IGV4aGF1c3RpdmUsIGp1c3QgZXhjbHVkZSB0aGUgb2J2aW91c1xyXG4gIG5vbk5lc3RhYmxlTm9kZXMgPSBbXHJcbiAgICAnbGknXHJcbiAgICAnbGVnZW5kJ1xyXG4gICAgJ3RyJ1xyXG4gICAgJ3RkJ1xyXG4gICAgJ29wdGlvbidcclxuICAgICdib2R5J1xyXG4gICAgJ2hlYWQnXHJcbiAgICAnc291cmNlJ1xyXG4gICAgJ3Rib2R5J1xyXG4gICAgJ3Rmb290J1xyXG4gICAgJ3RoZWFkJ1xyXG4gICAgJ2xpbmsnXHJcbiAgICAnc2NyaXB0J1xyXG4gIF1cclxuIFxyXG4gICMjI1xyXG4gIEZldGNoIGEgbm9kZSBmcm9tIHRoZSBET00gYW5kIHJldHVybiBhbiBPSidmaWVkIGluc3RhbmNlIG9mIHRoZSBlbGVtZW50XHJcbiAgIyMjXHJcbiAgT0oubm9kZXMucmVnaXN0ZXIgJ2dldCcsIChpZCwgdGFnTmFtZSA9ICdkaXYnKSAtPlxyXG4gICAgcmV0ID0gbnVsbFxyXG4gICAgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCBpZFxyXG4gICAgaWYgZWxcclxuICAgICAgdGhpbkVsID0gT0oucmVzdG9yZUVsZW1lbnQgZWwsIHRhZ05hbWVcclxuICAgIGlmIHRoaW5FbFxyXG4gICAgICByZXQgPSBPSi5ub2Rlcy5mYWN0b3J5IHRoaW5FbCwgbnVsbCwgMFxyXG4gICAgXHJcbiAgICByZXRcclxuICBcclxuICBub2RlTmFtZXMgPSBbXHJcbiAgICAnYSdcclxuICAgICdiJ1xyXG4gICAgJ2JyJ1xyXG4gICAgJ2J1dHRvbidcclxuICAgICdkaXYnXHJcbiAgICAnZW0nXHJcbiAgICAnZmllbGRzZXQnXHJcbiAgICAnZm9ybSdcclxuICAgICdoMSdcclxuICAgICdoMidcclxuICAgICdoMydcclxuICAgICdoNCdcclxuICAgICdoNSdcclxuICAgICdoNidcclxuICAgICdpJ1xyXG4gICAgJ2ltZydcclxuICAgICdpbnB1dCdcclxuICAgICdsYWJlbCdcclxuICAgICdsZWdlbmQnXHJcbiAgICAnbGknXHJcbiAgICAnbmF2J1xyXG4gICAgJ29sJ1xyXG4gICAgJ29wdGlvbidcclxuICAgICdwJ1xyXG4gICAgJ3NlbGVjdCdcclxuICAgICdzcGFuJ1xyXG4gICAgJ3N0cm9uZydcclxuICAgICdzdXAnXHJcbiAgICAnc3ZnJ1xyXG4gICAgJ3RhYmxlJ1xyXG4gICAgJ3Rib2R5J1xyXG4gICAgJ3RkJ1xyXG4gICAgJ3RleHRhcmVhJ1xyXG4gICAgJ3RoJ1xyXG4gICAgJ3RoZWFkJ1xyXG4gICAgJ3RyJ1xyXG4gICAgJ3VsJ1xyXG4gIF1cclxuICBcclxuICBtYWtlQWRkID0gKHRhZ05hbWUsIGVsLCBjb3VudCkgLT5cclxuICAgIChvcHRzKSAtPlxyXG4gICAgICBtZXRob2QgPSBPSi5ub2Rlc1t0YWdOYW1lXSBvciBPSi5jb21wb25lbnRzW3RhZ05hbWVdIG9yIE9KLmNvbnRyb2xzW3RhZ05hbWVdIG9yIE9KLmlucHV0c1t0YWdOYW1lXVxyXG4gICAgICBpZiBtZXRob2RcclxuICAgICAgICBudSA9IG1ldGhvZCBvcHRzLCBlbCwgdHJ1ZVxyXG4gICAgICBlbHNlIFxyXG4gICAgICAgIG51ID0gT0ouY29tcG9uZW50IG51bGwsIGVsLCB0YWdOYW1lICAgIFxyXG4gICAgICBPSi5ub2Rlcy5mYWN0b3J5IG51LCBlbCwgY291bnRcclxuICBcclxuICBhZGRNYWtlTWV0aG9kID0gKGVsLCBjb3VudCkgLT5cclxuICAgIG1ldGhvZHMgPSBPSi5vYmplY3QoKVxyXG4gICAgZWwubWFrZSA9ICh0YWdOYW1lLCBvcHRzKSAtPlxyXG4gICAgICBtZXRob2QgPSBtZXRob2RzW3RhZ05hbWVdXHJcbiAgICAgIGlmIG5vdCBtZXRob2RcclxuICAgICAgICBtZXRob2QgPSBtYWtlQWRkIHRhZ05hbWUsIGVsLCBjb3VudFxyXG4gICAgICAgIG1ldGhvZHNbdGFnTmFtZV0gPSBtZXRob2RcclxuICAgICAgbWV0aG9kIG9wdHNcclxuICAgIGVsXHJcbiAgXHJcbiAgbWFrZVVuaXF1ZUlkID0gKGVsLCBwYXJlbnQsIGNvdW50KSAtPlxyXG4gICAgaWYgT0ouR0VORVJBVEVfVU5JUVVFX0lEU1xyXG4gICAgICBjb3VudCArPSAxXHJcbiAgICAgIGlmIGNvdW50IDw9IHBhcmVudC5jb3VudCB0aGVuIGNvdW50ID0gcGFyZW50LmNvdW50ICsgMVxyXG4gICAgICBwYXJlbnQuY291bnQgPSBjb3VudFxyXG4gICAgICBcclxuICAgICAgaWYgbm90IGVsLmdldElkKClcclxuICAgICAgICBpZCA9IHBhcmVudC5nZXRJZCgpIG9yICcnXHJcbiAgICAgICAgaWQgKz0gZWwudGFnTmFtZSArIGNvdW50XHJcbiAgICAgICAgZWwuYXR0ciAnaWQnLCBpZFxyXG4gICAgcmV0dXJuXHJcbiAgICAgICAgXHJcbiAgIyMjXHJcbiAgRXh0ZW5kcyBhIE9KIENvbnRyb2wgY2xhc3Mgd2l0aCBhbGwgdGhlIChwZXJtaXR0ZWQpIG1ldGhvZHMgb24gdGhlIGZhY3RvcnlcclxuICAjIyNcclxuICBPSi5ub2Rlcy5yZWdpc3RlciAnZmFjdG9yeScsIChlbCwgcGFyZW50ID0gT0ouYm9keSwgY291bnQgPSBwYXJlbnQuY291bnQgb3IgMCkgLT5cclxuICAgIFxyXG4gICAgIyAxOiBmb3IgY2xhcml0eSwgd2UgYXJlIHJldHVybmluZyB0aGUgZXh0ZW5kZWQgZWxlbWVudFxyXG4gICAgcmV0ID0gZWxcclxuICAgIFxyXG4gICAgIyAyOiBJZiB0aGUgZWxlbWVudCBoYXMgbmV2ZXIgYmVlbiBpbml0aWFsaXplZCwgY29udGludWVcclxuICAgIGlmIG5vdCBlbC5pc0Z1bGx5SW5pdFxyXG4gICAgICBcclxuICAgICAgIyAzOiBBcyBsb25nIGFzIHRoZSBlbGVtZW50IGlzbid0IHRoZSBib2R5IG5vZGUsIGNvbnRpbnVlXHJcbiAgICAgIGlmIGVsLnRhZ05hbWUgaXNudCAnYm9keScgXHJcbiAgICAgICAgIyA0OiBFeHRlbmQgdGhlIGVsZW1lbnQgd2l0aCBzdGFuZGFyZCBqUXVlcnkgQVBJIG1ldGhvZHNcclxuICAgICAgICByZXQgPSBPSi5kb20gZWwsIHBhcmVudFxyXG4gICAgICAgIFxyXG4gICAgICAgICMgNTogSWYgdGhlIG5vZGUgaXNuJ3QgaW4gdGhlIERPTSwgYXBwZW5kIGl0IHRvIHRoZSBwYXJlbnRcclxuICAgICAgICAjIFRoaXMgYWxzbyBhY2NvbW1vZGF0ZXMgZG9jdW1lbnQgZnJhZ21lbnRzLCB3aGljaCBhcmUgbm90IGluIHRoZSBET00gYnV0IGFyZSBwcmVzdW1lZCB0byBiZSBzb3VuZCB1bnRpbCByZWFkeSBmb3IgbWFudWFsIGluc2VydGlvblxyXG4gICAgICAgIGlmIG5vdCByZXQuaXNJbkRPTVxyXG4gICAgICAgICAgbWFrZVVuaXF1ZUlkIGVsLCBwYXJlbnQsIGNvdW50XHJcbiAgICAgICAgICBwYXJlbnQuYXBwZW5kIHJldFswXVxyXG4gICAgICAgICAgIyA2OiBCaW5kIGFueSBkZWZpbmVkIGV2ZW50cyBhZnRlciB0aGUgbm9kZSBpcyBpbiB0aGUgRE9NXHJcbiAgICAgICAgICByZXQuYmluZEV2ZW50cygpXHJcbiAgICAgICAgICByZXQuaXNJbkRPTSA9IHRydWVcclxuICAgICAgICBcclxuICAgICAgICAjIDc6IENyZWF0ZSB0aGUgYWxsIGltcG9ydGFudCAnbWFrZScgbWV0aG9kXHJcbiAgICAgICAgYWRkTWFrZU1ldGhvZCByZXQsIGNvdW50XHJcbiAgICAgICAgXHJcbiAgICAgICAgIyA4OiBQcmV2ZW50IGR1cGxpY2F0ZSBmYWN0b3J5IGV4dGVuc2lvbiBieSBzZXR0aW5nIGlzIGluaXQgPSB0cnVlXHJcbiAgICAgICAgcmV0LmlzRnVsbHlJbml0ID0gdHJ1ZSAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgIyA5OiBpZiB0aGUgbm9kZSBzdXBwb3J0cyBpdCwgY2FsbCBmaW5hbGl6ZVxyXG4gICAgICAgIGZpbmFsaXplID0gXy5vbmNlIHJldC5maW5hbGl6ZSBvciBPSi5ub29wXHJcbiAgICAgICAgcmV0LmZpbmFsaXplID0gZmluYWxpemVcclxuICAgICAgICBmaW5hbGl6ZSByZXRcclxuICAgICAgICBcclxuICAgICMgMTA6IFJldHVybiB0aGUgZXh0ZW5kZWQgZWxlbWVudCAgICBcclxuICAgIHJldFxyXG5cclxuICBpbml0Qm9keSA9ICggLT5cclxuICAgIE9KLmJvZHkuY291bnQgPSAwXHJcbiAgICBPSi5ib2R5LnJvb3QgPSBudWxsXHJcbiAgICBPSi5kb20gT0ouYm9keSwgbnVsbFxyXG4gICAgYWRkTWFrZU1ldGhvZCBPSi5ib2R5LCAwXHJcbiAgICBPSi5ib2R5LmlzRnVsbHlJbml0ID0gdHJ1ZVxyXG4gICkoKVxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG4iLCIjICMgYVxyXG5kbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gICd1c2Ugc3RyaWN0J1xyXG4gIFxyXG4gIG5vZGVOYW1lID0gJ2EnXHJcbiAgXHJcbiAgT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgaWQ6ICcnXHJcbiAgICAgICAgY2xhc3M6ICcnXHJcbiAgICAgICAgdGV4dDogJydcclxuICAgICAgICBocmVmOiAnamF2YVNjcmlwdDp2b2lkKDApOydcclxuICAgICAgICB0eXBlOiAnJ1xyXG4gICAgICAgIHRpdGxlOiAnJ1xyXG4gICAgICAgIHJlbDogJydcclxuICAgICAgICBtZWRpYTogJydcclxuICAgICAgICB0YXJnZXQ6ICcnXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgdG9nZ2xlU3RhdGUgPSAnb2ZmJ1xyXG4gICAgXHJcbiAgICB0b2dnbGUgPSAtPlxyXG4gICAgICBpZiB0b2dnbGVTdGF0ZSBpcyAnb24nXHJcbiAgICAgICAgdG9nZ2xlU3RhdGUgPSAnb2ZmJ1xyXG4gICAgICBlbHNlIHRvZ2dsZVN0YXRlID0gJ29uJyAgaWYgdG9nZ2xlU3RhdGUgaXMgJ29mZidcclxuICAgICAgcmV0dXJuXHJcbiAgICBcclxuICAgICMgQ2xpY2sgYmluZGluZ1xyXG4gICAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cclxuICAgICAgICB0b2dnbGUoKVxyXG4gICAgICAgIHJldFZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgICAgaWYgZGVmYXVsdHMuaHJlZiBpcyAnIycgdGhlbiByZXRWYWwgPSBmYWxzZVxyXG4gICAgICAgIHJldFZhbFxyXG4gICAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSBuZXdDbGlja1xyXG4gICAgZWxzZVxyXG4gICAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSB0b2dnbGUgICAgXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmVsZW1lbnQgbm9kZU5hbWUsIGRlZmF1bHRzLnByb3BzLCBkZWZhdWx0cy5zdHlsZXMsIGRlZmF1bHRzLmV2ZW50cywgZGVmYXVsdHMudGV4dFxyXG4gICAgXHJcblxyXG4gICAgaWYgZmFsc2UgaXMgY2FsbGVkRnJvbUZhY3RvcnkgdGhlbiBPSi5ub2Rlcy5mYWN0b3J5IHJldCwgb3duZXJcclxuXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsIiMgIyBiclxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICAndXNlIHN0cmljdCdcclxuICBcclxuICBub2RlTmFtZSA9ICdicidcclxuICBcclxuICBPSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczoge31cclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgbnVtYmVyOiAxICBcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBpID0gMFxyXG4gICAgd2hpbGUgaSA8IE9KLnRvLm51bWJlciBkZWZhdWx0cy5udW1iZXJcclxuICAgICAgIyBJbiB0aGUgY2FzZSBvZiBtdWx0aXBsZSBicnMsIGl0IGlzIGRlc2lyYWJsZSB0byBvbmx5IGdldCB0aGUgbGFzdCBvbmUgb3V0XHJcbiAgICAgIHJldCA9IE9KLmVsZW1lbnQgbm9kZU5hbWUsIGRlZmF1bHRzLnByb3BzLCBkZWZhdWx0cy5zdHlsZXMsIGRlZmF1bHRzLmV2ZW50cywgZGVmYXVsdHMudGV4dFxyXG4gICAgICBcclxuICAgICAgaSArPSAxXHJcblxyXG4gICAgaWYgZmFsc2UgaXMgY2FsbGVkRnJvbUZhY3RvcnkgdGhlbiBPSi5ub2Rlcy5mYWN0b3J5IHJldCwgb3duZXJcclxuXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsIiMgIyBmb3JtXHJcblxyXG5kbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gICd1c2Ugc3RyaWN0J1xyXG4gIFxyXG4gIG5vZGVOYW1lID0gJ2Zvcm0nXHJcbiAgXHJcbiAgT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6IFxyXG4gICAgICAgIGFjdGlvbjogJydcclxuICAgICAgICBtZXRob2Q6ICcnXHJcbiAgICAgICAgbmFtZTogJydcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICByZXQgPSBPSi5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cy5wcm9wcywgZGVmYXVsdHMuc3R5bGVzLCBkZWZhdWx0cy5ldmVudHMsIGRlZmF1bHRzLnRleHRcclxuICAgIFxyXG4gICAgcmV0LmFkZCAndmFsaWRhdG9yJywgcmV0LiQudmFsaWRhdGUoXHJcbiAgICAgIGhpZ2hsaWdodDogKGVsZW1lbnQpIC0+XHJcbiAgICAgICAgJGVsbSA9ICQoZWxlbWVudClcclxuICAgICAgICAkZWxtLmF0dHIgJ09KX2ludmFsaWQnLCAnMSdcclxuICAgICAgICAkZWxtLmFuaW1hdGUgYmFja2dyb3VuZENvbG9yOiAncmVkJ1xyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgdW5oaWdobGlnaHQ6IChlbGVtZW50KSAtPlxyXG4gICAgICAgICRlbG0gPSAkKGVsZW1lbnQpXHJcbiAgICAgICAgaWYgJGVsbS5hdHRyKCdPSl9pbnZhbGlkJykgaXMgJzEnXHJcbiAgICAgICAgICAkZWxtLmNzcyAnYmFja2dyb3VuZC1jb2xvcicsICd5ZWxsb3cnXHJcbiAgICAgICAgICAkZWxtLmF0dHIgJ09KX2ludmFsaWQnLCAnMCdcclxuICAgICAgICAgIHNldFRpbWVvdXQgKC0+XHJcbiAgICAgICAgICAgICAgJGVsbS5hbmltYXRlIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50J1xyXG4gICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgKSwgNTAwXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICApXHJcbiAgICAgIFxyXG4gICAgcmV0LmFkZCAnaXNGb3JtVmFsaWQnLCAtPlxyXG4gICAgICByZXQuJC52YWxpZCgpIGFuZCAobm90IHJldC52YWxpZGF0b3IuaW52YWxpZEVsZW1lbnRzKCkgb3IgcmV0LnZhbGlkYXRvci5pbnZhbGlkRWxlbWVudHMoKS5sZW5ndGggaXMgMClcclxuICAgIFxyXG4gICAgXHJcbiAgICBcclxuICAgIGlmIGZhbHNlIGlzIGNhbGxlZEZyb21GYWN0b3J5IHRoZW4gT0oubm9kZXMuZmFjdG9yeSByZXQsIG93bmVyXHJcblxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG5cclxuIiwiIyAjIGlucHV0XHJcblxyXG5kbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gICd1c2Ugc3RyaWN0J1xyXG4gIFxyXG4gIG5vZGVOYW1lID0gJ2lucHV0J1xyXG4gIFxyXG4gIE9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6ICd0ZXh0J1xyXG4gICAgICAgIHZhbHVlOiAnJ1xyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgICAgIGNoYW5nZTogT0oubm9vcFxyXG4gICAgICAgIGZvY3Vzb3V0OiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICBpZiBub3QgZGVmYXVsdHMucHJvcHMudHlwZSBvciBub3QgT0ouZW51bXMuaW5wdXRUeXBlc1tkZWZhdWx0cy5wcm9wcy50eXBlXVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgJ05vIG1hdGNoaW5nIGlucHV0IHR5cGUgZm9yIHsnICsgZGVmYXVsdHMucHJvcHMudHlwZSArICd9IGNvdWxkIGJlIGZvdW5kLidcclxuICAgIHRoaXNUeXBlID0gT0ouZW51bXMuaW5wdXRUeXBlc1tkZWZhdWx0cy5wcm9wcy50eXBlXVxyXG4gICAgXHJcbiAgICBzeW5jVmFsdWUgPSAtPlxyXG4gICAgICBzd2l0Y2ggdGhpc1R5cGVcclxuICAgICAgICB3aGVuIE9KLmVudW1zLmlucHV0VHlwZXMuY2hlY2tib3hcclxuICAgICAgICAgIHJldC52YWx1ZSA9IHJldC4kLmlzICc6Y2hlY2tlZCdcclxuICAgICAgICB3aGVuIE9KLmVudW1zLmlucHV0VHlwZXMucmFkaW9cclxuICAgICAgICAgIHJldC52YWx1ZSA9IHJldC4kLmZpbmQoJzpjaGVja2VkJykudmFsKClcclxuICAgICAgICBlbHNlICBcclxuICAgICAgICAgIHJldC52YWx1ZSA9IHJldC52YWwoKVxyXG4gICAgICByZXQudmFsdWUgICAgXHJcbiAgICBcclxuICAgICMjIyBcclxuICAgICAgQ2xpY2sgYmluZGluZy4gSWYgdGhlIGNhbGxlciBkZWZpbmVkIGEgY2xpY2sgaGFuZGxlciwgXHJcbiAgICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCwgXHJcbiAgICAgIHRoZW4gY2FsbCB0aGUgZGVmaW5lZCBjbGljayBoYW5kbGVyIHdpdGggdGhlIGxhdGVzdCB2YWx1ZS5cclxuICAgICMjIyAgXHJcbiAgICBvbGRDbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgaWYgb2xkQ2xpY2sgYW5kIG9sZENsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cclxuICAgICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICAgIG9sZENsaWNrIHJldC52YWx1ZSwgZXZlbnQuLi5cclxuICAgICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuICAgICAgICAgIFxyXG4gICAgIyMjIFxyXG4gICAgICBDaGFuZ2UgYmluZGluZy4gSWYgdGhlIGNhbGxlciBkZWZpbmVkIGEgY2hhbmdlIGhhbmRsZXIsIFxyXG4gICAgICB3cmFwIGl0LCBzeW5jIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQgZmlyc3QsIFxyXG4gICAgICB0aGVuIGNhbGwgdGhlIGRlZmluZWQgY2hhbmdlIGhhbmRsZXIgd2l0aCB0aGUgbGF0ZXN0IHZhbHVlLlxyXG4gICAgIyMjIFxyXG4gICAgb2xkQ2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gICAgaWYgb2xkQ2hhbmdlIGFuZCBvbGRDaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICAgIG5ld0NoYW5nZSA9IChldmVudC4uLikgLT5cclxuICAgICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICAgIG9sZENoYW5nZSByZXQudmFsdWUsIGV2ZW50Li4uXHJcbiAgICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuICAgIFxyXG4gICAgIyMjIFxyXG4gICAgICBPbiBGb2N1cyBPdXQgYmluZGluZy4gQWx3YXlzIHVzZSB0aGUgZXZlbnQgdG8gdXBkYXRlIHRoZSBpbnRlcm5hbFxyXG4gICAgICB2YWx1ZSBvZiB0aGUgY29udHJvbDsgYW5kIGlmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGZvY3Vzb3V0IGV2ZW50LFxyXG4gICAgICB3cmFwIGl0IGFuZCBpbnZva2UgaXQgd2l0aCB0aGUgbGF0ZXN0IHZhbHVlXHJcbiAgICAjIyMgXHJcbiAgICBvbGRGb2N1c291dCA9IGRlZmF1bHRzLmV2ZW50cy5mb2N1c291dFxyXG4gICAgbmV3Rm9jdXNvdXQgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIGlmIG9sZEZvY3Vzb3V0IGFuZCBvbGRGb2N1c291dCBpc250IE9KLm5vb3AgXHJcbiAgICAgICAgb2xkRm9jdXNvdXQgcmV0LnZhbHVlLCBldmVudC4uLlxyXG4gICAgICAgIFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmZvY3Vzb3V0ID0gbmV3Rm9jdXNvdXRcclxuICAgIFxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cy5wcm9wcywgZGVmYXVsdHMuc3R5bGVzLCBkZWZhdWx0cy5ldmVudHMsIGRlZmF1bHRzLnRleHRcclxuICAgIHJldC52YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXHJcbiAgICBcclxuICAgIGlmIGZhbHNlIGlzIGNhbGxlZEZyb21GYWN0b3J5IHRoZW4gT0oubm9kZXMuZmFjdG9yeSByZXQsIG93bmVyXHJcblxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCIjICMgb2xcclxuXHJcbmRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgXHJcbiAgbm9kZU5hbWUgPSAnb2wnXHJcbiAgXHJcbiAgT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6IHt9XHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgcmV0ID0gT0ouZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMucHJvcHMsIGRlZmF1bHRzLnN0eWxlcywgZGVmYXVsdHMuZXZlbnRzLCBkZWZhdWx0cy50ZXh0XHJcbiAgICBcclxuICAgIFxyXG4gICAgaWYgZmFsc2UgaXMgY2FsbGVkRnJvbUZhY3RvcnkgdGhlbiBPSi5ub2Rlcy5mYWN0b3J5IHJldCwgb3duZXJcclxuXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuIiwiIyAjIHNlbGVjdFxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICAndXNlIHN0cmljdCdcclxuICBcclxuICBub2RlTmFtZSA9ICdzZWxlY3QnXHJcbiAgXHJcbiAgT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6IFxyXG4gICAgICAgIHNlbGVjdGVkOiAnJ1xyXG4gICAgICAgIG11bHRpcGxlOiBmYWxzZVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIHZhbHVlczogW11cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICAgICAgY2hhbmdlOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICB2YWx1ZSA9ICcnXHJcbiAgICB2YWx1ZXMgPSBbXVxyXG4gICAgaGFzRW1wdHkgPSBmYWxzZTtcclxuICAgIFxyXG4gICAgc3luY1ZhbHVlID0gLT5cclxuICAgICAgdmFsdWUgPSByZXQudmFsKClcclxuICAgIFxyXG4gICAgIyBDbGljayBiaW5kaW5nXHJcbiAgICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICAgIGNsaWNrID0gZGVmYXVsdHMuZXZlbnRzLmNsaWNrXHJcbiAgICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgICByZXR2YWxcclxuICAgICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuICAgICAgICAgIFxyXG4gICAgIyBDaGFuZ2UgYmluZGluZ1xyXG4gICAgaWYgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSBpc250IE9KLm5vb3BcclxuICAgICAgY2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gICAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgICAgcmV0dmFsID0gY2hhbmdlIGV2ZW50Li4uXHJcbiAgICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgICByZXR2YWxcclxuICAgICAgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSA9IG5ld0NoYW5nZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cy5wcm9wcywgZGVmYXVsdHMuc3R5bGVzLCBkZWZhdWx0cy5ldmVudHMsIGRlZmF1bHRzLnRleHRcclxuICAgIFxyXG4gICAgcmV0LmFkZCAnc2VsZWN0ZWREYXRhJywgKHByb3BOYW1lKSAtPlxyXG4gICAgICByZXQgPSAnJ1xyXG4gICAgICBpZiByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKSBhbmQgcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF1cclxuICAgICAgICBkYXRhc2V0ID0gcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0uZGF0YXNldFxyXG4gICAgICAgIHJldCA9IGRhdGFzZXRbcHJvcE5hbWVdICBpZiBkYXRhc2V0XHJcbiAgICAgIHJldFxyXG5cclxuICAgIHJldC5hZGQgJ3NlbGVjdGVkVGV4dCcsIC0+XHJcbiAgICAgIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnRleHQoKVxyXG5cclxuICAgIHJldC5hZGQgJ3NlbGVjdGVkVmFsJywgLT5cclxuICAgICAgdmFsdWUgPSByZXQudmFsKClcclxuICAgICAgdmFsdWVcclxuXHJcbiAgICByZXQuYWRkICdhZGRPcHRpb24nLCAodmFsdWUsIHRleHQgPSB2YWx1ZSwgc2VsZWN0ZWQgPSBmYWxzZSwgZGlzYWJsZWQgPSBmYWxzZSkgLT5cclxuICAgICAgaXNFbXB0eSA9IF8uaXNFbXB0eSB2YWx1ZVxyXG4gICAgICBhZGQgPSBmYWxzZVxyXG4gICAgICBpZiBpc0VtcHR5IGFuZCBmYWxzZSBpcyBoYXNFbXB0eSBcclxuICAgICAgICBoYXNFbXB0eSA9IHRydWUgXHJcbiAgICAgICAgYWRkID0gdHJ1ZVxyXG4gICAgICBpZiBmYWxzZSBpcyBhZGQgYW5kIGZhbHNlIGlzIGlzRW1wdHkgdGhlbiBhZGQgPSB0cnVlICBcclxuICAgICAgaWYgYWRkXHJcbiAgICAgICAgICB2YWwgPSBcclxuICAgICAgICAgICAgdGV4dDogdGV4dFxyXG4gICAgICAgICAgICBwcm9wczpcclxuICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgIGlmIHNlbGVjdGVkXHJcbiAgICAgICAgICAgIHZhbC5zZWxlY3RlZCA9IHNlbGVjdGVkXHJcbiAgICAgICAgICBpZiBkaXNhYmxlZCAgXHJcbiAgICAgICAgICAgIHZhbC5kaXNhYmxlZCA9IGRpc2FibGVkXHJcbiAgICAgICAgICBvcHRpb24gPSByZXQubWFrZSAnb3B0aW9uJywgdmFsXHJcbiAgICAgICAgICBvcHRpb25cclxuXHJcbiAgICByZXQuYWRkICdhZGRPcHRpb25zJywgKG9wdGlvbnMpIC0+XHJcbiAgICAgIHZhbHVlcyA9IF8udW5pb24gdmFsdWVzLCBvcHRpb25zXHJcbiAgICAgIE9KLmVhY2ggb3B0aW9ucywgKCh2YWwpIC0+XHJcbiAgICAgICAgdmFsdWUgPSByZXQuYWRkT3B0aW9uKHZhbClcclxuICAgICAgICB2YWx1ZXMucHVzaCB2YWx1ZVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICApLCBmYWxzZVxyXG4gICAgICB2YWx1ZXNcclxuXHJcbiAgICByZXQuYWRkICdyZXNldE9wdGlvbnMnLCAodmFsdWVzKSAtPlxyXG4gICAgICByZXQuZW1wdHkoKVxyXG4gICAgICB2YWx1ZXMgPSB2YWx1ZXM7XHJcbiAgICAgIHJldC5hZGRPcHRpb25zIHZhbHVlc1xyXG4gICAgICByZXRcclxuXHJcbiAgICByZXQuYWRkICdyZW1vdmVPcHRpb24nLCAodmFsdWVUb1JlbW92ZSkgLT5cclxuICAgICAgdmFsdWVzLnNwbGljZSB2YWx1ZXMuaW5kZXhPZih2YWx1ZVRvUmVtb3ZlKSwgMSAjcmVtb3ZlcyB0aGUgaXRlbSBmcm9tIHRoZSBsaXN0XHJcbiAgICAgIHNlbGVjdENvbnRyb2wgPSByZXRbMF1cclxuICAgICAgaSA9IDBcclxuXHJcbiAgICAgIHdoaWxlIGkgPCBzZWxlY3RDb250cm9sLmxlbmd0aFxyXG4gICAgICAgIHNlbGVjdENvbnRyb2wucmVtb3ZlIGkgIGlmIHNlbGVjdENvbnRyb2wub3B0aW9uc1tpXS52YWx1ZSBpcyB2YWx1ZVRvUmVtb3ZlXHJcbiAgICAgICAgaSsrXHJcbiAgICAgIHJldHVyblxyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG4gICAgaWYgZGVmYXVsdHMudmFsdWVzLmxlbmd0aCA+IDBcclxuICAgICAgcmV0LmFkZE9wdGlvbnMgZGVmYXVsdHMudmFsdWVzXHJcbiAgICBcclxuICAgIGlmIGZhbHNlIGlzIGNhbGxlZEZyb21GYWN0b3J5IHRoZW4gT0oubm9kZXMuZmFjdG9yeSByZXQsIG93bmVyXHJcblxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcbiIsIiMgIyB0YWJsZVxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBcclxuICBub2RlTmFtZSA9ICd0YWJsZSdcclxuICBcclxuICAjIyNcclxuICBDcmVhdGUgYW4gSFRNTCB0YWJsZS4gUHJvdmlkZXMgaGVscGVyIG1ldGhvZHMgdG8gY3JlYXRlIENvbHVtbnMgYW5kIENlbGxzLlxyXG4gICMjI1xyXG4gIHRhYmxlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuICAgIFxyXG4gICAgIyAjIyBvcHRpb25zXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgICMgIyMjIGRhdGFcclxuICAgICAgIyBvcHRpb25hbCBhcnJheSBvZiBvYmplY3RzLiBpZiBwcm92aWRlZCB3aWxsIGdlbmVyYXRlIHRhYmxlIGF1dG9tYXRpY2FsbHkuXHJcbiAgICAgIGRhdGE6IG51bGxcclxuICAgICAgIyAjIyMgcHJvcHNcclxuICAgICAgIyBvcHRpb25hbCBwcm9wZXJ0aWVzIHRvIGFwcGx5IHRvIHRhYmxlIHJvb3Qgbm9kZVxyXG4gICAgICBwcm9wczogXHJcbiAgICAgICAgY2VsbHBhZGRpbmc6IDBcclxuICAgICAgICBjZWxsc3BhY2luZzogMFxyXG4gICAgICAgIGFsaWduOiAnJ1xyXG4gICAgICAgIHdpZHRoOiAnJ1xyXG4gICAgICAgIGNlbGxhbGlnbjogJ2xlZnQnXHJcbiAgICAgICAgY2VsbHZhbGlnbjogJ3RvcCdcclxuICAgICAgICBjbGFzczogJydcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6IHt9XHJcbiAgICAgICMgIyMjIGNlbGxzXHJcbiAgICAgICMgb3B0aW9uYWwgcHJvcGVydGllcyB0byBhcHBseSB0byBpbmRpdmlkdWFsIGNlbGxzXHJcbiAgICAgIGNlbGxzOlxyXG4gICAgICAgIGNsYXNzOiAnJ1xyXG4gICAgICAgIGFsaWduOiAnJ1xyXG4gICAgICAgICd2ZXJ0aWNhbC1hbGlnbic6ICcnXHJcbiAgICAgICAgY2VsbHBhZGRpbmc6ICcnXHJcbiAgICAgICAgbWFyZ2luOiAnJ1xyXG4gICAgICAjICMjIyB0aGVhZFxyXG4gICAgICAjIG9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRvIHBhc3MgaW50byB0aGVhZCBjcmVhdGlvbiAgXHJcbiAgICAgIHRoZWFkOiB7fVxyXG4gICAgICAjICMjIyB0Ym9keVxyXG4gICAgICAjIG9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRvIHBhc3MgaW50byB0Ym9keSBjcmVhdGlvblxyXG4gICAgICB0Ym9keToge31cclxuXHJcbiAgICAgIGZpcnN0QWxpZ25SaWdodDogZmFsc2VcclxuICAgICAgb2RkQWxpZ25SaWdodDogZmFsc2VcclxuICAgIFxyXG4gICAgcm93cyA9IFtdXHJcbiAgICBjZWxscyA9IE9KLmFycmF5MkQoKVxyXG4gICAgY29sdW1uQ291bnQgPSAwXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgcmV0ID0gT0ouZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMucHJvcHMsIGRlZmF1bHRzLnN0eWxlcywgZGVmYXVsdHMuZXZlbnRzLCBkZWZhdWx0cy50ZXh0XHJcbiAgICBpZiBmYWxzZSBpcyBjYWxsZWRGcm9tRmFjdG9yeSB0aGVuIE9KLm5vZGVzLmZhY3RvcnkgcmV0LCBvd25lclxyXG4gICAgXHJcbiAgICB0Ym9keSA9IG51bGxcclxuICAgIHRoZWFkID0gbnVsbFxyXG4gICAgdGhlYWRSb3cgPSBudWxsXHJcbiAgICBcclxuICAgICMgIyMjIGluaXRcclxuICAgICMgaW50ZXJuYWwgbWV0aG9kIGZvciBvbmUgdGltZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgdGFibGVcclxuICAgIGluaXQgPSBfLm9uY2UgLT4gIFxyXG4gICAgICBpZiBkZWZhdWx0cy5kYXRhXHJcbiAgICAgICAgdGJsU3RyID0gQ29udmVydEpzb25Ub1RhYmxlIGRlZmF1bHRzLmRhdGFcclxuICAgICAgaWYgdGJsU3RyXHJcbiAgICAgICAgalRibCA9ICQgdGJsU3RyXHJcbiAgICAgICAgXHJcbiAgICAgICAgakhlYWQgPSBqVGJsLmZpbmQgJ3RoZWFkJ1xyXG4gICAgICAgIHJldC4kLmFwcGVuZCBqSGVhZFxyXG4gICAgICAgIHRoZWFkID0gT0oucmVzdG9yZUVsZW1lbnQgakhlYWRbMF1cclxuICAgICAgICB0aGVhZFJvdyA9IE9KLnJlc3RvcmVFbGVtZW50IHRoZWFkWzBdLnJvd3NbMF1cclxuICAgICAgICBcclxuICAgICAgICBqQm9keSA9IGpUYmwuZmluZCAndGJvZHknXHJcbiAgICAgICAgcmV0LiQuYXBwZW5kIGpCb2R5XHJcbiAgICAgICAgdGJvZHkgPSBPSi5yZXN0b3JlRWxlbWVudCBqQm9keVswXVxyXG4gICAgICAgIFxyXG4gICAgICAgIGxvYWRDZWxscygpXHJcbiAgICAgIGVsc2UgIFxyXG4gICAgICAgIHRoZWFkID0gcmV0Lm1ha2UgJ3RoZWFkJywgZGVmYXVsdHMudGhlYWRcclxuICAgICAgICB0aGVhZFJvdyA9IHRoZWFkLm1ha2UgJ3RyJ1xyXG4gICAgICAgIHRib2R5ID0gcmV0Lm1ha2UgJ3Rib2R5JywgZGVmYXVsdHMudGJvZHlcclxuICAgICAgICByb3dzLnB1c2ggdGJvZHkubWFrZSAndHInXHJcbiAgICAgIHJldFxyXG4gICAgXHJcbiAgICAjICMjIyBsb2FkQ2VsbHNcclxuICAgICMgaW50ZXJuYWwgbWV0aG9kIGd1YXJhbnRlZXMgdGhhdCB0YWJsZXMgbG9hZGVkIGZyb20gSlNPTiBhcmUgZnVsbHkgbG9hZGVkIGludG8gbWVtb3J5XHJcbiAgICBsb2FkQ2VsbHMgPSAoKSAtPlxyXG4gICAgICByID0gMFxyXG4gICAgICB3aGlsZSB0Ym9keVswXS5yb3dzLmxlbmd0aCA+IHJcclxuICAgICAgICBjID0gMFxyXG4gICAgICAgIG1lbVJvdyA9IE9KLnJlc3RvcmVFbGVtZW50IHRib2R5WzBdLnJvd3Nbcl1cclxuICAgICAgICByb3dzLnB1c2ggbWVtUm93XHJcbiAgICAgICAgd2hpbGUgdGJvZHlbMF0ucm93c1tyXS5jZWxscy5sZW5ndGggPiBjXHJcbiAgICAgICAgICBtZW1DZWxsID0gY2VsbHMuZ2V0IHIrMSwgYysxXHJcbiAgICAgICAgICBpZiBub3QgbWVtQ2VsbFxyXG4gICAgICAgICAgICBtZW1DZWxsID0gT0oucmVzdG9yZUVsZW1lbnQgdGJvZHlbMF0ucm93c1tyXS5jZWxsc1tjXVxyXG4gICAgICAgICAgICBjZWxscy5zZXQgcisxLCBjKzEsIG1lbUNlbGxcclxuICAgICAgICAgIGMgKz0gMVxyXG4gICAgICAgIHIgKz0gMVxyXG4gICAgXHJcbiAgICAjICMjIyBmaWxsTWlzc2luZ1xyXG4gICAgIyBpbnRlcm5hbCBtZXRob2QgZ3VhcmFudGVlcyB0aGF0IGNlbGxzIGV4aXN0IGZvciB0aGUgZGltZW5zaW9ucyBvZiB0aGUgdGFibGUgICAgICAgIFxyXG4gICAgZmlsbE1pc3NpbmcgPSAoKSAtPlxyXG4gICAgICBjZWxscy5lYWNoIChyb3dObywgY29sTm8sIHZhbCkgLT5cclxuICAgICAgICBpZiBub3QgdmFsXHJcbiAgICAgICAgICByb3cgPSByZXQucm93IHJvd05vXHJcbiAgICAgICAgICByb3cuY2VsbCBjb2xObywge30gXHJcbiAgICBcclxuICAgICMgIyMgY29sdW1uXHJcbiAgICAjIEFkZHMgYSBjb2x1bW4gbmFtZSB0byB0aGUgdGFibGUgaGVhZFxyXG4gICAgcmV0LmFkZCAnY29sdW1uJywgKGNvbE5vLCBjb2xOYW1lKSAtPlxyXG4gICAgICByZXQuaW5pdCgpXHJcbiAgICAgIGNvbHVtbkNvdW50ICs9IDFcclxuICAgICAgdGggPSBudWxsXHJcbiAgICAgIGkgPSAwXHJcbiAgICAgIHdoaWxlIHRoZWFkWzBdLnJvd3NbMF0uY2VsbHMubGVuZ3RoIDwgY29sTm9cclxuICAgICAgICBuYXRpdmVUaCA9IHRoZWFkWzBdLnJvd3NbMF0uY2VsbHNbaV1cclxuICAgICAgICBpZiBub3QgbmF0aXZlVGhcclxuICAgICAgICAgIHRoID0gdGhlYWRSb3cubWFrZSAndGgnLCB7fSAgXHJcbiAgICAgICAgZWxzZSBcclxuICAgICAgICAgIHRoID0gT0oucmVzdG9yZUVsZW1lbnQgbmF0aXZlVGgsICd0aCcgXHJcbiAgICAgICAgaSArPSAxXHJcbiAgICAgIGlmIG5vdCB0aFxyXG4gICAgICAgIG5hdGl2ZVRoID0gdGhlYWRbMF0ucm93c1swXS5jZWxsc1tjb2xOby0xXVxyXG4gICAgICAgIHRoID0gT0oucmVzdG9yZUVsZW1lbnQgbmF0aXZlVGgsICd0aCdcclxuICAgICAgdGgudGV4dCBjb2xOYW1lXHJcbiAgICAgIHRoXHJcbiAgICBcclxuICAgICMgIyMgcm93XHJcbiAgICAjIEFkZHMgYSBuZXcgcm93ICh0cikgdG8gdGhlIHRhYmxlIGJvZHlcclxuICAgIHJldC5hZGQgJ3JvdycsIChyb3dObywgb3B0cykgLT4gICAgICAgICAgICAgIFxyXG4gICAgICByb3cgPSByb3dzW3Jvd05vLTFdXHJcbiAgICAgIFxyXG4gICAgICBpZiBub3Qgcm93XHJcbiAgICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xyXG4gICAgICAgICAgcm93ID0gdGJvZHkubWFrZSAndHInLCB7fVxyXG4gICAgICAgICAgcm93cy5wdXNoIHJvdyAgXHJcbiAgICAgIFxyXG4gICAgICBpZiBub3Qgcm93LmNlbGxcclxuICAgICAgICByb3cuYWRkICdjZWxsJywgKGNvbE5vLCBvcHRzKSAtPlxyXG4gICAgICAgICAgY2VsbCA9IE9KLm5vZGVzLnRkIG9wdHMsIHJvd1xyXG4gICAgICAgICAgY2VsbHMuc2V0IHJvd05vLCBjb2xObywgY2VsbFxyXG4gICAgICAgICAgY2VsbFxyXG4gICAgICBcclxuICAgICAgcm93XHJcbiAgICBcclxuICAgICMgIyMgY2VsbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgIyBBZGRzIGEgY2VsbCAodHIvdGQpIHRvIHRoZSB0YWJsZSBib2R5XHJcbiAgICByZXQuYWRkICdjZWxsJywgKHJvd05vLCBjb2xObywgb3B0cykgLT5cclxuICAgICAgaWYgcm93Tm8gPCAxIHRoZW4gcm93Tm8gPSAxXHJcbiAgICAgIGlmIGNvbE5vIDwgMSB0aGVuIGNvbE5vID0gMVxyXG4gICAgICBpZiBjb2x1bW5Db3VudCA+IDAgYW5kIGNvbE5vLTEgPiBjb2x1bW5Db3VudCB0aGVuIHRocm93IG5ldyBFcnJvciAnQSBjb2x1bW4gbmFtZSBoYXMgbm90IGJlZW4gZGVmaW5lZCBmb3IgdGhpcyBwb3NpdGlvbiB7JyArIHJvd05vICsgJ3gnICsgY29sTm8gKyAnfS4nICAgIFxyXG4gICAgICAgICAgXHJcbiAgICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cclxuICAgICAgXHJcbiAgICAgIGNlbGwgPSBjZWxscy5nZXQgcm93Tm8sIGNvbE5vXHJcbiAgICAgIFxyXG4gICAgICBpZiBub3QgY2VsbFxyXG4gICAgICAgIGkgPSAwXHJcbiAgICAgICAgd2hpbGUgaSA8IGNvbE5vXHJcbiAgICAgICAgICBpICs9IDFcclxuICAgICAgICAgIGlmIGkgaXMgY29sTm9cclxuICAgICAgICAgICAgbnVPcHRzID0gT0ouZXh0ZW5kIHtwcm9wczogZGVmYXVsdHMuY2VsbHN9LCBvcHRzXHJcbiAgICAgICAgICAgIGNlbGwgPSByb3cuY2VsbCBjb2xObywgbnVPcHRzXHJcbiAgICAgICAgICBlbHNlICBcclxuICAgICAgICAgICAgdHJ5Q2VsbCA9IGNlbGxzLmdldCByb3dObywgaVxyXG4gICAgICAgICAgICBpZiBub3QgdHJ5Q2VsbFxyXG4gICAgICAgICAgICAgIHRyeUNlbGwgPSAgcm93LmNlbGwgaSwgcHJvcHM6IGRlZmF1bHRzLmNlbGxzXHJcbiAgICAgICAgICBcclxuICAgICAgY2VsbCAgXHJcbiAgXHJcbiAgICBcclxuXHJcbiAgICAjICMjIEZpbmFsaXplXHJcbiAgICAjIEZpbmFsaXplIGd1YXJhbnRlZXMgdGhhdCB0aGVhZCBhbmQgdGJvZHkgYW5kIGNyZWF0ZWQgd2hlbiB0aGUgbm9kZSBpcyBmdWxseSBpbnN0YW50aWF0ZWRcclxuICAgIHJldC5hZGQgJ2ZpbmFsaXplJywgLT5cclxuICAgICAgaW5pdCgpXHJcbiAgICAgIFxyXG4gICAgICAjICMjIFRIZWFkXHJcbiAgICAgICMgRXhwb3NlIHRoZSBpbnRlcm5hbCB0aGVhZCBub2RlXHJcbiAgICAgIHJldC5hZGQgJ3RoZWFkJywgdGhlYWRcclxuICAgIFxyXG4gICAgICAjICMjIFRCb2R5XHJcbiAgICAgICMgRXhwb3NlIHRoZSBpbnRlcm5hbCB0Ym9keSBub2RlXHJcbiAgICAgIHJldC5hZGQgJ3Rib2R5JywgdGJvZHlcclxuICAgICAgXHJcbiAgICAgIHJldFxyXG4gICAgXHJcbiAgICByZXRcclxuICBcclxuICBPSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgdGFibGVcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICAndXNlIHN0cmljdCdcclxuICBcclxuICBub2RlTmFtZSA9ICd0ZXh0YXJlYSdcclxuICBcclxuICBPSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICBuYW1lOiBcIlwiXHJcbiAgICAgICAgcGxhY2Vob2xkZXI6IFwiXCJcclxuICAgICAgICB2YWx1ZTogXCJcIlxyXG4gICAgICAgIHRleHQ6IFwiXCJcclxuICAgICAgICBtYXhsZW5ndGg6IFwiXCJcclxuICAgICAgICBhdXRvZm9jdXM6IGZhbHNlXHJcbiAgICAgICAgaXNSZXF1aXJlZDogZmFsc2VcclxuICAgICAgICByb3dzOiAzXHJcbiAgICAgICAgY29sczogMjVcclxuICAgICAgICBkaXNhYmxlZDogZmFsc2VcclxuICAgICAgICByZWFkb25seTogZmFsc2VcclxuICAgICAgICBmb3JtOiBcIlwiXHJcbiAgICAgICAgd3JhcDogXCJcIlxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgdmFsdWUgPSBkZWZhdWx0cy5wcm9wcy52YWx1ZVxyXG4gICAgXHJcbiAgICBzeW5jVmFsdWUgPSAtPlxyXG4gICAgICBzd2l0Y2ggZGVmYXVsdHMucHJvcHMudHlwZVxyXG4gICAgICAgIHdoZW4gT0ouZW51bXMuaW5wdXRUeXBlcy5jaGVja2JveFxyXG4gICAgICAgICAgdmFsdWUgPSByZXQuJC5pcyhcIjpjaGVja2VkXCIpXHJcbiAgICAgICAgd2hlbiBPSi5lbnVtcy5pbnB1dFR5cGVzLnJhZGlvXHJcbiAgICAgICAgICB2YWx1ZSA9IHJldC4kLmZpbmQoXCI6Y2hlY2tlZFwiKS52YWwoKVxyXG4gICAgICAgIGVsc2UgIFxyXG4gICAgICAgICAgdmFsdWUgPSByZXQudmFsKClcclxuICAgIFxyXG4gICAgIyBDbGljayBiaW5kaW5nXHJcbiAgICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICAgIGNsaWNrID0gZGVmYXVsdHMuZXZlbnRzLmNsaWNrXHJcbiAgICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgICByZXR2YWxcclxuICAgICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuICAgICAgICAgIFxyXG4gICAgIyBDaGFuZ2UgYmluZGluZ1xyXG4gICAgaWYgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSBpc250IE9KLm5vb3BcclxuICAgICAgY2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gICAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgICAgcmV0dmFsID0gY2hhbmdlIGV2ZW50Li4uXHJcbiAgICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgICByZXR2YWxcclxuICAgICAgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSA9IG5ld0NoYW5nZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cy5wcm9wcywgZGVmYXVsdHMuc3R5bGVzLCBkZWZhdWx0cy5ldmVudHMsIGRlZmF1bHRzLnRleHRcclxuICAgIFxyXG4gICAgXHJcbiAgICBpZiBmYWxzZSBpcyBjYWxsZWRGcm9tRmFjdG9yeSB0aGVuIE9KLm5vZGVzLmZhY3RvcnkgcmV0LCBvd25lclxyXG5cclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gICd1c2Ugc3RyaWN0J1xyXG4gIFxyXG4gIG5vZGVOYW1lID0gJ3RoZWFkJ1xyXG4gIFxyXG4gIE9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG4gICAgXHJcbiAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6IHt9XHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICAgIG51bWJlcjogMSAgXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cy5wcm9wcywgZGVmYXVsdHMuc3R5bGVzLCBkZWZhdWx0cy5ldmVudHMsIGRlZmF1bHRzLnRleHRcclxuICAgIFxyXG4gICAgaWYgZmFsc2UgaXMgY2FsbGVkRnJvbUZhY3RvcnkgdGhlbiBPSi5ub2Rlcy5mYWN0b3J5IHJldCwgb3duZXJcclxuXHJcbiAgICByb3dzID0gW11cclxuICAgIGNlbGxzID0ge31cclxuICAgIHJldC5hZGQgJ2NlbGwnLCAocm93Tm8sIGNvbE5vKSAtPlxyXG4gICAgICBpbml0KClcclxuICAgICAgXHJcbiAgICAgIGlmIHJvd05vIDwgMSB0aGVuIHJvd05vID0gMVxyXG4gICAgICBpZiBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcclxuICAgICAgICAgIFxyXG4gICAgICByb3cgPSByb3dzW3Jvd05vLTFdXHJcbiAgICAgIFxyXG4gICAgICBpZiBub3Qgcm93XHJcbiAgICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xyXG4gICAgICAgICAgcm93ID0gT0oubm9kZXMudHIge30sIHRib2R5LCBmYWxzZVxyXG4gICAgICAgICAgcm93cy5wdXNoIHJvd1xyXG4gICAgICBcclxuICAgICAgdGQgPSByb3dbMF0uY2VsbHNbY29sTm9dXHJcbiAgICAgIFxyXG4gICAgICBpZiB0ZCB0aGVuIGNlbGwgPSBPSi5yZXN0b3JlRWxlbWVudCB0ZCwgJ3RkJ1xyXG4gICAgICBpZiBub3QgdGRcclxuICAgICAgICB3aGlsZSByb3dbMF0uY2VsbHMubGVuZ3RoIDwgY29sTm9cclxuICAgICAgICAgIGlkeCA9IHJvd1swXS5jZWxscy5sZW5ndGhcclxuICAgICAgICAgIHRkID0gcm93WzBdLmNlbGxzW2lkeC0xXVxyXG4gICAgICAgICAgaWYgdGQgYW5kIGlkeCBpcyBjb2xObyBcclxuICAgICAgICAgICAgY2VsbCA9IE9KLnJlc3RvcmVFbGVtZW50IHRkLCAndGQnXHJcbiAgICAgICAgICBlbHNlICBcclxuICAgICAgICAgICAgY2VsbCA9IE9KLm5vZGVzLnRkIHByb3BzOiBkZWZhdWx0cy5jZWxscywgcm93LCBmYWxzZVxyXG4gICAgICBcclxuICAgICAgaWYgbm90IGNlbGwuaXNWYWxpZFxyXG4gICAgICAgIE9KLm5vZGVzLmZhY3RvcnkgY2VsbCwgcm93LCByb3dObyArIGNvbE5vXHJcbiAgICAgICAgICAgIFxyXG4gICAgICBjZWxsICBcclxuXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgXHJcbiAgbm9kZU5hbWUgPSAndWwnXHJcbiAgXHJcbiAgT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6IHt9XHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgcmV0ID0gT0ouZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMucHJvcHMsIGRlZmF1bHRzLnN0eWxlcywgZGVmYXVsdHMuZXZlbnRzLCBkZWZhdWx0cy50ZXh0XHJcbiAgICBcclxuICAgIFxyXG4gICAgaWYgZmFsc2UgaXMgY2FsbGVkRnJvbUZhY3RvcnkgdGhlbiBPSi5ub2Rlcy5mYWN0b3J5IHJldCwgb3duZXJcclxuXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAnYnV0dG9uaW5wdXQnXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiAnYnV0dG9uJ1xyXG4gICAgICAgIHNyYzogJydcclxuICAgICAgICBhbHQ6ICcnXHJcbiAgICAgICAgaGVpZ2h0OiAnJ1xyXG4gICAgICAgIHdpZHRoOiAnJ1xyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ2NoZWNrYm94J1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgY2hlY2tlZDogZmFsc2VcclxuICAgICAgaW5kZXRlcm1pbmF0ZTogZmFsc2VcclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIGlmIGRlZmF1bHRzLmNoZWNrZWRcclxuICAgICAgcmV0LmF0dHIgJ2NoZWNrZWQnLCB0cnVlXHJcbiAgICBlbHNlIGlmIGRlZmF1bHRzLmluZGV0ZXJtaW5hdGUgIFxyXG4gICAgICByZXQuYXR0ciAnaW5kZXRlcm1pbmF0ZScsIHRydWVcclxuICAgICAgXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ2NvbG9yJ1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAnZGF0ZSdcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ2RhdGV0aW1lJ1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAnZGF0ZXRpbWUtbG9jYWwnXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICdlbWFpbCdcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICAgIG11bHRpcGxlOiAnJ1xyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ2ZpbGUnXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgICBhY2NlcHQ6ICcnIFxyXG4gICAgICAgIG11bHRpcGxlOiAnJ1xyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ2hpZGRlbidcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ2ltYWdlaW5wdXQnXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiAnaW1hZ2UnXHJcbiAgICAgICAgc3JjOiAnJ1xyXG4gICAgICAgIGFsdDogJydcclxuICAgICAgICBoZWlnaHQ6ICcnXHJcbiAgICAgICAgd2lkdGg6ICcnXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAnbW9udGgnXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICdudW1iZXInXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICdwYXNzd29yZCdcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICAgIG1heGxlbmd0aDogJydcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICdyYWRpbydcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICAgIG5hbWU6ICcnXHJcbiAgICAgICAgdmFsdWU6ICcnXHJcbiAgICAgICAgY2hlY2tlZDogJydcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICdyYW5nZSdcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICAgIG1pbjogMFxyXG4gICAgICAgIG1heDogMTAwXHJcbiAgICAgICAgdmFsdWU6IDUwXHJcbiAgICAgICAgc3RlcDogMVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ3Jlc2V0J1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAnc2VhcmNoJ1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAnc3VibWl0J1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAndGVsJ1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgICAgcGF0dGVybjogJydcclxuICAgICAgICBtYXhsZW5ndGg6ICcnXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAndGV4dGlucHV0J1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogJ3RleHQnXHJcbiAgICAgICAgYXV0b2NvbXBsZXRlOiAnb24nXHJcbiAgICAgICAgYXV0b3NhdmU6ICcnXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAndGltZSdcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ3VybCdcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICAgIHBhdHRlcm46ICcnXHJcbiAgICAgICAgbWF4bGVuZ3RoOiAnJ1xyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ3dlZWsnXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCIjICMgT0pcclxuZG8gKHRoaXNHbG9iYWwgPSAoaWYgKHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsKSB0aGVuIGdsb2JhbCBlbHNlIChpZiAodHlwZW9mIHNlbGYgaXNudCAndW5kZWZpbmVkJyBhbmQgc2VsZikgdGhlbiBzZWxmIGVsc2UgKGlmICh0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgYW5kIHdpbmRvdykgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkpKSAtPlxyXG4gIFxyXG4gIHV0aWxMaWIgPSB0aGlzR2xvYmFsLmpRdWVyeVxyXG4gIG5hbWVTcGFjZU5hbWUgPSAnT0onXHJcblxyXG4gICMjI1xyXG4gIGJvb3Qgc3RyYXAgbmFtZSBtZXRob2QgaW50byBPYmplY3QgcHJvdG90eXBlXHJcbiAgIyMjXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgT2JqZWN0OjosXHJcbiAgICBnZXRJbnN0YW5jZU5hbWU6XHJcbiAgICAgIHZhbHVlOiAtPlxyXG4gICAgICAgIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC57MSx9KVxcKC9cclxuICAgICAgICByZXN1bHRzID0gKGZ1bmNOYW1lUmVnZXgpLmV4ZWMoQGNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpXHJcbiAgICAgICAgKGlmIChyZXN1bHRzIGFuZCByZXN1bHRzLmxlbmd0aCA+IDEpIHRoZW4gcmVzdWx0c1sxXSBlbHNlICcnKVxyXG5cclxuXHJcbiAgIyMjXHJcbiAgQW4gaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5hbWVzcGFjZSB0cmVlXHJcbiAgIyMjXHJcbiAgTnNUcmVlID0ge31cclxuICBtYWtlVGhlSnVpY2UgPSAtPlxyXG4gIFxyXG4gICAgIyMjXHJcbiAgICBJbnRlcm5hbCBuYW1lU3BhY2VOYW1lIG1ldGhvZCB0byBjcmVhdGUgbmV3ICdzdWInIG5hbWVzcGFjZXMgb24gYXJiaXRyYXJ5IGNoaWxkIG9iamVjdHMuXHJcbiAgICAjIyNcclxuICAgIG1ha2VOYW1lU3BhY2UgPSAoc3BhY2VuYW1lLCB0cmVlKSAtPlxyXG4gICAgICAjIyNcclxuICAgICAgVGhlIGRlcml2ZWQgaW5zdGFuY2UgdG8gYmUgY29uc3RydWN0ZWRcclxuICAgICAgIyMjXHJcbiAgICAgIEJhc2UgPSAobnNOYW1lKSAtPlxyXG4gICAgICAgIHByb3RvID0gdGhpc1xyXG4gICAgICAgIHRyZWVbbnNOYW1lXSA9IHRyZWVbbnNOYW1lXSBvciB7fVxyXG4gICAgICAgIG5zVHJlZSA9IHRyZWVbbnNOYW1lXVxyXG4gICAgICAgIG1lbWJlcnMgPSB7fVxyXG4gICAgICBcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgdGhpcywgJ21lbWJlcnMnLCB2YWx1ZTogbWVtYmVyc1xyXG4gICAgICBcclxuICAgICAgICAjIyNcclxuICAgICAgICBSZWdpc3RlciAoZS5nLiAnTGlmdCcpIGFuIE9iamVjdCBpbnRvIHRoZSBwcm90b3R5cGUgb2YgdGhlIG5hbWVzcGFjZS5cclxuICAgICAgICBUaGlzIE9iamVjdCB3aWxsIGJlIHJlYWRhYmxlL2V4ZWN1dGFibGUgYnV0IGlzIG90aGVyd2lzZSBpbW11dGFibGUuXHJcbiAgICAgICAgIyMjXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoaXMsICdyZWdpc3RlcicsXHJcbiAgICAgICAgICB2YWx1ZTogKG5hbWUsIG9iaiwgZW51bWVyYWJsZSkgLT5cclxuICAgICAgICAgICAgJ3VzZSBzdHJpY3QnXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIG5hbWUuJykgIGlmICh0eXBlb2YgbmFtZSBpc250ICdzdHJpbmcnKSBvciBuYW1lIGlzICcnXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIHByb3BlcnR5IGluc3RhbmNlLicpICB1bmxlc3Mgb2JqXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgbmFtZWQgJyArIG5hbWUgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKSAgaWYgcHJvdG9bbmFtZV1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgICBtZW1iZXJzW25hbWVdID0gbWVtYmVyc1tuYW1lXSBvciBuYW1lXHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgI0d1YXJkIGFnYWluc3Qgb2JsaXRlcmF0aW5nIHRoZSB0cmVlIGFzIHRoZSB0cmVlIGlzIHJlY3Vyc2l2ZWx5IGV4dGVuZGVkXHJcbiAgICAgICAgICAgIG5zVHJlZVtuYW1lXSA9IG5zVHJlZVtuYW1lXSBvclxyXG4gICAgICAgICAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgICAgICAgICB0eXBlOiB0eXBlb2Ygb2JqXHJcbiAgICAgICAgICAgICAgaW5zdGFuY2U6IChpZiBvYmouZ2V0SW5zdGFuY2VOYW1lIHRoZW4gb2JqLmdldEluc3RhbmNlTmFtZSgpIGVsc2UgJ3Vua25vd24nKVxyXG5cclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5IHByb3RvLCBuYW1lLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBvYmpcclxuICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSBpc250IGVudW1lcmFibGVcclxuXHJcbiAgICAgICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHNwYWNlbmFtZSArICcuJyArIG5hbWVcclxuICAgICAgICAgICAgb2JqXHJcblxyXG4gICAgICBcclxuICAgICAgICAjIyNcclxuICAgICAgICBDcmVhdGUgYSBuZXcsIHN0YXRpYyBuYW1lc3BhY2Ugb24gdGhlIGN1cnJlbnQgcGFyZW50IChlLmcuIG5zTmFtZS50by4uLiB8fCBuc05hbWUuaXMuLi4pXHJcbiAgICAgICAgIyMjXHJcbiAgICAgICAgcHJvdG8ucmVnaXN0ZXIgJ21ha2VTdWJOYW1lU3BhY2UnLCAoKHN1Yk5hbWVTcGFjZSkgLT5cclxuICAgICAgICAgICd1c2Ugc3RyaWN0J1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbmV3IHN1YiBuYW1lc3BhY2Ugd2l0aG91dCBhIHZhbGlkIG5hbWUuJykgIGlmICh0eXBlb2Ygc3ViTmFtZVNwYWNlIGlzbnQgJ3N0cmluZycpIG9yIHN1Yk5hbWVTcGFjZSBpcyAnJ1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdWIgbmFtZXNwYWNlIG5hbWVkICcgKyBzdWJOYW1lU3BhY2UgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKSAgaWYgcHJvdG8uc3ViTmFtZVNwYWNlXHJcbiAgICAgICAgICBuc0ludGVybmFsLmFsZXJ0RGVwZW5kZW50cyBuc05hbWUgKyAnLicgKyBzdWJOYW1lU3BhY2VcclxuICAgICAgICAgIG5ld05hbWVTcGFjZSA9IG1ha2VOYW1lU3BhY2Uoc3ViTmFtZVNwYWNlLCBuc1RyZWUpXHJcbiAgICAgICAgICBuZXdOYW1lU3BhY2UucmVnaXN0ZXIgJ2NvbnN0YW50cycsIG1ha2VOYW1lU3BhY2UoJ2NvbnN0YW50cycsIG5zVHJlZSksIGZhbHNlICBpZiBzdWJOYW1lU3BhY2UgaXNudCAnY29uc3RhbnRzJ1xyXG4gICAgICAgICAgcHJvdG8ucmVnaXN0ZXIgc3ViTmFtZVNwYWNlLCBuZXdOYW1lU3BhY2UsIGZhbHNlXHJcbiAgICAgICAgICBuZXdOYW1lU3BhY2VcclxuICAgICAgICApLCBmYWxzZVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgXHJcbiAgICAgICMjI1xyXG4gICAgICBBbiBpbnRlcm5hbCBtZWNoYW5pc20gdG8gcmVwcmVzZW50IHRoZSBpbnN0YW5jZSBvZiB0aGlzIG5hbWVzcGFjZVxyXG4gICAgICBAY29uc3RydWN0b3JcclxuICAgICAgQGludGVybmFsXHJcbiAgICAgIEBtZW1iZXJPZiBtYWtlTmFtZVNwYWNlXHJcbiAgICAgICMjI1xyXG4gICAgICBDbGFzcyA9IG5ldyBGdW5jdGlvbigncmV0dXJuIGZ1bmN0aW9uICcgKyBzcGFjZW5hbWUgKyAnKCl7fScpKClcclxuICAgICAgQ2xhc3M6OiA9IG5ldyBCYXNlKHNwYWNlbmFtZSlcclxuICAgIFxyXG4gICAgICAjQ2xhc3MucHJvdG90eXBlLnBhcmVudCA9IEJhc2UucHJvdG90eXBlO1xyXG4gICAgICBuZXcgQ2xhc3Moc3BhY2VuYW1lKVxyXG4gIFxyXG4gICAgIyMjXHJcbiAgICAnRGVwZW5kJyBhbiBPYmplY3QgdXBvbiBhbm90aGVyIG1lbWJlciBvZiB0aGlzIG5hbWVzcGFjZSwgdXBvbiBhbm90aGVyIG5hbWVzcGFjZSxcclxuICAgIG9yIHVwb24gYSBtZW1iZXIgb2YgYW5vdGhlciBuYW1lc3BhY2VcclxuICAgICMjI1xyXG4gICAgZGVwZW5kc09uID0gKGRlcGVuZGVuY2llcywgY2FsbEJhY2ssIGltcG9ydHMpIC0+XHJcbiAgICAgICd1c2Ugc3RyaWN0J1xyXG4gICAgICByZXQgPSBmYWxzZVxyXG4gICAgICBuc01lbWJlcnMgPSBuc0ludGVybmFsLmdldE5zTWVtYmVycygpXHJcbiAgICAgIGlmIGRlcGVuZGVuY2llcyBhbmQgZGVwZW5kZW5jaWVzLmxlbmd0aCA+IDAgYW5kIGNhbGxCYWNrXHJcbiAgICAgICAgbWlzc2luZyA9IGRlcGVuZGVuY2llcy5maWx0ZXIoKGRlcGVuKSAtPlxyXG4gICAgICAgICAgbnNNZW1iZXJzLmluZGV4T2YoZGVwZW4pIGlzIC0xIGFuZCAobm90IGltcG9ydHMgb3IgaW1wb3J0cyBpc250IGRlcGVuKVxyXG4gICAgICAgIClcclxuICAgICAgICBpZiBtaXNzaW5nLmxlbmd0aCBpcyAwXHJcbiAgICAgICAgICByZXQgPSB0cnVlXHJcbiAgICAgICAgICBjYWxsQmFjaygpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgbnNJbnRlcm5hbC5kZXBlbmRlbnRzLnB1c2ggKGltcG9ydHMpIC0+XHJcbiAgICAgICAgICAgIGRlcGVuZHNPbiBtaXNzaW5nLCBjYWxsQmFjaywgaW1wb3J0c1xyXG5cclxuICAgICAgcmV0XHJcbiAgICBuc0ludGVybmFsID0gZGVwZW5kZW50czogW11cclxuICBcclxuICAgICMjI1xyXG4gICAgRmV0Y2hlcyB0aGUgcmVnaXN0ZXJlZCBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIG9uIHRoZSBuYW1lc3BhY2UgYW5kIGl0cyBjaGlsZCBuYW1lc3BhY2VzXHJcbiAgICAjIyNcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBuc0ludGVybmFsLCAnZ2V0TnNNZW1iZXJzJyxcclxuICAgICAgdmFsdWU6IC0+XHJcbiAgICAgICAgcmVjdXJzZVRyZWUgPSAoa2V5LCBsYXN0S2V5KSAtPlxyXG4gICAgICAgICAgbWVtYmVycy5wdXNoIGxhc3RLZXkgKyAnLicgKyBrZXkgIGlmIHR5cGVvZiAoa2V5KSBpcyAnc3RyaW5nJ1xyXG4gICAgICAgICAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KGtleSlcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoa2V5KS5mb3JFYWNoIChrKSAtPlxyXG4gICAgICAgICAgICAgIG1lbWJlcnMucHVzaCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdHlwZW9mIChrKSBpcyAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgIHJlY3Vyc2VUcmVlIGtleVtrXSwgbGFzdEtleSArICcuJyArIGsgIGlmIHV0aWxMaWIuaXNQbGFpbk9iamVjdChrZXlba10pXHJcbiAgICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgbWVtYmVycyA9IFtdXHJcbiAgICAgICAgT2JqZWN0LmtleXMoTnNUcmVlW25hbWVTcGFjZU5hbWVdKS5mb3JFYWNoIChrZXkpIC0+XHJcbiAgICAgICAgICByZWN1cnNlVHJlZSBOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSwgbmFtZVNwYWNlTmFtZSAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KE5zVHJlZVtuYW1lU3BhY2VOYW1lXVtrZXldKVxyXG4gICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgIG1lbWJlcnNcclxuXHJcbiAgICAjIyNcclxuICAgIFRvIHN1cHBvcnQgZGVwZW5kZW5jeSBtYW5hZ2VtZW50LCB3aGVuIGEgcHJvcGVydHkgaXMgbGlmdGVkIG9udG8gdGhlIG5hbWVzcGFjZSwgbm90aWZ5IGRlcGVuZGVudHMgdG8gaW5pdGlhbGl6ZVxyXG4gICAgIyMjXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnNJbnRlcm5hbCwgJ2FsZXJ0RGVwZW5kZW50cycsXHJcbiAgICAgIHZhbHVlOiAoaW1wb3J0cykgLT5cclxuICAgICAgICBkZXBzID0gbnNJbnRlcm5hbC5kZXBlbmRlbnRzLmZpbHRlcigoZGVwT24pIC0+XHJcbiAgICAgICAgICBmYWxzZSBpcyBkZXBPbihpbXBvcnRzKVxyXG4gICAgICAgIClcclxuICAgICAgICBuc0ludGVybmFsLmRlcGVuZGVudHMgPSBkZXBzICBpZiBBcnJheS5pc0FycmF5KGRlcHMpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgI0NyZWF0ZSB0aGUgcm9vdCBvZiB0aGUgdHJlZSBhcyB0aGUgY3VycmVudCBuYW1lc3BhY2VcclxuICAgIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSA9IHt9XHJcbiAgICAjRGVmaW5lIHRoZSBjb3JlIG5hbWVzcGFjZSBhbmQgdGhlIHJldHVybiBvZiB0aGlzIGNsYXNzXHJcbiAgICBOc091dCA9IG1ha2VOYW1lU3BhY2UobmFtZVNwYWNlTmFtZSwgTnNUcmVlW25hbWVTcGFjZU5hbWVdKVxyXG4gIFxyXG4gICAgIyMjXHJcbiAgICBDYWNoZSBhIGhhbmRsZSBvbiB0aGUgdmVuZG9yIChwcm9iYWJseSBqUXVlcnkpIG9uIHRoZSByb290IG5hbWVzcGFjZVxyXG4gICAgIyMjXHJcbiAgICBOc091dC5yZWdpc3RlciAnPycsIHV0aWxMaWIsIGZhbHNlXHJcblxyXG4gICAgIyMjXHJcbiAgICBDYWNoZSB0aGUgdHJlZSAodXNlZnVsIGZvciBkb2N1bWVudGF0aW9uL3Zpc3VhbGl6YXRpb24vZGVidWdnaW5nKVxyXG4gICAgIyMjXHJcbiAgICBOc091dC5yZWdpc3RlciAndHJlZScsIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSwgZmFsc2VcclxuICBcclxuICAgICMjI1xyXG4gICAgQ2FjaGUgdGhlIG5hbWUgc3BhY2UgbmFtZVxyXG4gICAgIyMjXHJcbiAgICBOc091dC5yZWdpc3RlciAnbmFtZScsIG5hbWVTcGFjZU5hbWUsIGZhbHNlXHJcbiAgICBOc091dC5yZWdpc3RlciAnZGVwZW5kc09uJywgZGVwZW5kc09uLCBmYWxzZVxyXG4gICAgTnNPdXRcclxuXHJcblxyXG4gICMjI1xyXG4gIEFjdHVhbGx5IGRlZmluZSB0aGUgT0ogTmFtZVNwYWNlXHJcbiAgIyMjXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoaXNHbG9iYWwsIG5hbWVTcGFjZU5hbWUsXHJcbiAgICB2YWx1ZTogbWFrZVRoZUp1aWNlKClcclxuXHJcbiAgT0oucmVnaXN0ZXIgJ2dsb2JhbCcsIHRoaXNHbG9iYWxcclxuXHJcbiAgdGhpc0RvY3VtZW50ID0ge31cclxuICBpZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xyXG4gICAgdGhpc0RvY3VtZW50ID0gZG9jdW1lbnRcclxuICBcclxuICBPSi5yZWdpc3RlciAnZG9jdW1lbnQnLCB0aGlzRG9jdW1lbnRcclxuXHJcbiAgT0oucmVnaXN0ZXIgJ25vb3AnLCAtPiIsIiAjICMgT0ogUG9zdC1Jbml0aWFsaXphdGlvblxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuXHJcbiAgIyBTaW1wbGUgYXJyYXkgb2YgYW50aWNpcGF0ZWQva25vd24gY2hpbGQgbmFtZXNwYWNlc1xyXG4gIFxyXG4gIHN1Yk5hbWVTcGFjZXMgPSBbXHJcbiAgICAnZXJyb3JzJ1xyXG4gICAgJ2VudW1zJ1xyXG4gICAgJ2lzJ1xyXG4gICAgJ2luc3RhbmNlT2YnXHJcbiAgICAndG8nXHJcbiAgICAnbm9kZXMnXHJcbiAgICAnZGInXHJcbiAgICAnY29tcG9uZW50cydcclxuICAgICdjb250cm9scydcclxuICAgICdpbnB1dHMnXHJcbiAgICAnbm90aWZpY2F0aW9ucydcclxuICAgICdoaXN0b3J5J1xyXG4gICAgJ2Nvb2tpZSdcclxuICAgICdhc3luYydcclxuICBdXHJcblxyXG4gICMgIyMgU3ViTmFtZVNwYWNlc1xyXG5cclxuICAjIFByZS1hbGxvY2F0ZSBjZXJ0YWluIGNvbW1vbiBuYW1lc3BhY2VzIHRvIGF2b2lkIGZ1dHVyZSByYWNlIGNvbmRpdGlvbnMuXHJcbiAgIyBUaGlzIGRvZXMgcmVxdWlyZSB0aGF0IHRoZSBvcmRlciBvZiBvcGVyYXRpb25zIGxvYWRzIE9KLmNvZmZlZSBmaXJzdCBhbmQgb0pJbml0LmNvZmZlZSBzZWNvbmRcclxuICBfLmVhY2ggc3ViTmFtZVNwYWNlcywgKG5hbWUpIC0+XHJcbiAgICBPSi5tYWtlU3ViTmFtZVNwYWNlIG5hbWVcclxuICBcclxuICAjICMjIENvbmZpZ3VyYXRpb24gdmFyaWFibGVzXHJcblxyXG4gICMgQXV0b21hdGljYWxseSBnZW5lcmF0ZSB1bmlxdWUgSURzIGZvciBlYWNoIG5vZGUgKGRlZmF1bHQgZmFsc2UpXHJcbiAgT0pbJ0dFTkVSQVRFX1VOSVFVRV9JRFMnXSA9IGZhbHNlXHJcbiAgIyBEZWZhdWx0IHJvb3Qgbm9kZSBmb3IgY29tcG9uZW50cy9jb250cm9scyAoZGVmYXVsdCAnZGl2JylcclxuICBPSlsnREVGQVVMVF9DT01QT05FTlRfUk9PVF9OT0RFVFlQRSddID0gJ2RpdidcclxuICAjIFdoZXRoZXIgdG8gaG9vayBpbnRvIHRoZSBnbG9iYWwgb24gZXJyb3IgZXZlbnQgdG8gd3JpdGUgZXJyb3JzIHRvIGNvbnNvbGUgKGRlZmF1bHQgZmFsc2UpXHJcbiAgT0pbJ1RSQUNLX09OX0VSUk9SJ10gPSBmYWxzZVxyXG4gICNXaGV0aGVyIHRvIGxvZyBhbGwgQUpBWCByZXF1ZXN0c1xyXG4gIE9KWydMT0dfQUxMX0FKQVgnXSA9IGZhbHNlXHJcbiAgI1doZXRoZXIgdG8gbG9nIGFsbCBBSkFYIGVycm9yc1xyXG4gIE9KWydMT0dfQUxMX0FKQVhfRVJST1JTJ10gPSBmYWxzZVxyXG4gIFxyXG4gIHJldHVyblxyXG4gIFxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBcclxuICBhcnJheTJEID0gKGluaXRMZW5ndGgsIGluaXRXaWR0aCkgLT5cclxuICAgIGFycmF5ID0gW11cclxuICAgIG1heExlbmd0aCA9IDBcclxuICAgIG1heFdpZHRoID0gMFxyXG4gICAgXHJcbiAgICByZXQgPSBcclxuICAgICAgZ2V0OiAocm93Tm8sIGNvbE5vKSAtPlxyXG4gICAgICAgIGV4dGVuZCByb3dObywgY29sTm9cclxuICAgICAgc2V0OiAocm93Tm8sIGNvbE5vLCB2YWwpIC0+XHJcbiAgICAgICAgcmV0LmdldCByb3dObywgY29sTm9cclxuICAgICAgICByb3dJZHggPSByb3dOby0xXHJcbiAgICAgICAgY29sSWR4ID0gY29sTm8tMVxyXG4gICAgICAgIGFycmF5W3Jvd0lkeF1bY29sSWR4XSA9IHZhbFxyXG4gICAgICBlYWNoOiAoY2FsbEJhY2spIC0+XHJcbiAgICAgICAgXy5lYWNoIGFycmF5LCAoY29sdW1ucywgcm93KSAtPlxyXG4gICAgICAgICAgXy5lYWNoIGFycmF5W3Jvd10sICh2YWwsIGNvbCkgLT5cclxuICAgICAgICAgICAgcm93SWR4ID0gcm93KzFcclxuICAgICAgICAgICAgY29sSWR4ID0gY29sKzFcclxuICAgICAgICAgICAgY2FsbEJhY2sgcm93SWR4LCBjb2xJZHgsIHZhbFxyXG4gICAgICB3aWR0aDogKCkgLT5cclxuICAgICAgICBtYXhXaWR0aFxyXG4gICAgICBsZW5ndGg6ICgpIC0+XHJcbiAgICAgICAgbWF4TGVuZ3RoXHJcbiAgICAgICAgIFxyXG4gICAgIyMjXHJcbiAgICBHdWFyYW50ZWUgdGhhdCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgYXJyYXkgYXJlIGFsd2F5cyBiYWNrZWQgYnkgdmFsdWVzIGF0IGV2ZXJ5IHBvc2l0aW9uXHJcbiAgICAjIyMgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgZXh0ZW5kID0gKGxlbmd0aCwgd2lkdGgpIC0+ICBcclxuICAgICAgaWYgbm90IGxlbmd0aCBvciBsZW5ndGggPCAxIHRoZW4gbGVuZ3RoID0gMVxyXG4gICAgICBpZiBub3Qgd2lkdGggb3Igd2lkdGggPCAxIHRoZW4gd2lkdGggPSAxXHJcbiAgICAgIFxyXG4gICAgICBpZiBtYXhMZW5ndGggPCBsZW5ndGggdGhlbiBtYXhMZW5ndGggPSBsZW5ndGhcclxuICAgICAgaWYgYXJyYXkubGVuZ3RoID4gbWF4TGVuZ3RoIHRoZW4gbWF4TGVuZ3RoID0gYXJyYXkubGVuZ3RoXHJcbiAgICAgIGlmIG1heFdpZHRoIDwgd2lkdGggdGhlbiBtYXhXaWR0aCA9IHdpZHRoXHJcbiAgICAgIGkgPSAwXHJcbiAgICAgIFxyXG4gICAgICB3aGlsZSBpIDwgbWF4TGVuZ3RoXHJcbiAgICAgICAgdHJ5Um93ID0gYXJyYXlbaV1cclxuICAgICAgICBpZiBub3QgdHJ5Um93XHJcbiAgICAgICAgICB0cnlSb3cgPSBbXVxyXG4gICAgICAgICAgYXJyYXkucHVzaCB0cnlSb3dcclxuICAgICAgICBpZiBtYXhXaWR0aCA8IHRyeVJvdy5sZW5ndGggdGhlbiBtYXhXaWR0aCA9IHRyeVJvdy5sZW5ndGhcclxuICAgICAgICBpZiB0cnlSb3cubGVuZ3RoIDwgbWF4V2lkdGggdGhlbiB0cnlSb3cubGVuZ3RoID0gbWF4V2lkdGhcclxuICAgICAgICBpICs9IDFcclxuICAgICAgXHJcbiAgICAgIGFycmF5W2xlbmd0aC0xXVt3aWR0aC0xXVxyXG4gICAgICAgXHJcbiAgICBleHRlbmQgaW5pdExlbmd0aCwgaW5pdFdpZHRoXHJcbiAgICBcclxuICAgIHJldFxyXG4gIE9KLnJlZ2lzdGVyICdhcnJheTJEJywgYXJyYXkyRFxyXG5cclxuICByZXR1cm5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgbWV0aG9kcyA9IFtcclxuICAgICdhc3NlcnQnXHJcbiAgICAnY2xlYXInXHJcbiAgICAnY291bnQnXHJcbiAgICAnZGVidWcnXHJcbiAgICAnZGlyJ1xyXG4gICAgJ2RpcnhtbCdcclxuICAgICdlcnJvcidcclxuICAgICdleGNlcHRpb24nXHJcbiAgICAnZ3JvdXAnXHJcbiAgICAnZ3JvdXBDb2xsYXBzZWQnXHJcbiAgICAnZ3JvdXBFbmQnXHJcbiAgICAnaW5mbydcclxuICAgICdsb2cnXHJcbiAgICAnbWVtb3J5J1xyXG4gICAgJ3Byb2ZpbGUnXHJcbiAgICAncHJvZmlsZUVuZCdcclxuICAgICd0YWJsZSdcclxuICAgICd0aW1lJ1xyXG4gICAgJ3RpbWVFbmQnXHJcbiAgICAndGltZVN0YW1wJ1xyXG4gICAgJ3RpbWVsaW5lJ1xyXG4gICAgJ3RpbWVsaW5lRW5kJ1xyXG4gICAgJ3RyYWNlJ1xyXG4gICAgJ3dhcm4nXHJcbiAgXVxyXG4gIG1ldGhvZExlbmd0aCA9IG1ldGhvZHMubGVuZ3RoXHJcbiAgY29uc29sZSA9IE9KLmdsb2JhbC5jb25zb2xlIG9yIHt9XHJcbiAgT0oubWFrZVN1Yk5hbWVTcGFjZSAnY29uc29sZSdcclxuICBcclxuICAjIyNcclxuICAxLiBTdHViIG91dCBhbnkgbWlzc2luZyBtZXRob2RzIHdpdGggbm9vcFxyXG4gIDIuIERlZmluZSB0aGUgYXZhaWxhYmxlIG1ldGhvZHMgb24gdGhlIE9KLmNvbnNvbGUgb2JqZWN0XHJcbiAgIyMjXHJcbiAgd2hpbGUgbWV0aG9kTGVuZ3RoLS1cclxuICAgICgtPlxyXG4gICAgICBtZXRob2QgPSBtZXRob2RzW21ldGhvZExlbmd0aF1cclxuICAgIFxyXG4gICAgICAjIE9ubHkgc3R1YiB1bmRlZmluZWQgbWV0aG9kcy5cclxuICAgICAgY29uc29sZVttZXRob2RdID0gT0oubm9vcCB1bmxlc3MgY29uc29sZVttZXRob2RdXHJcbiAgICBcclxuICAgICAgI0RlZmluZSB0aGUgbWV0aG9kIG9uIHRoZSBPSiBjb25zb2xlIG5hbWVzcGFjZVxyXG4gICAgICBPSi5jb25zb2xlLnJlZ2lzdGVyIG1ldGhvZCwgKHBhcmFtcy4uLikgLT5cclxuICAgICAgICBjb25zb2xlW21ldGhvZF0gcGFyYW1zLi4uXHJcbiAgICApKClcclxuXHJcbiAgcmV0dXJuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIFxyXG4gICMjI1xyXG4gIFNldHVwIHNldHRpbmdzXHJcbiAgJC5jb29raWUucmF3ID0gdHJ1ZVxyXG4gICQuY29va2llLmpzb24gPSB0cnVlXHJcbiAgXHJcbiAgU2V0dXAgZGVmYXVsdHNcclxuICBodHRwczovL2dpdGh1Yi5jb20vY2FyaGFydGwvanF1ZXJ5LWNvb2tpZS9cclxuICAkLmNvb2tpZS5kZWZhdWx0cy5leHBpcmVzID0gMzY1XHJcbiAgJC5jb29raWUuZGVmYXVsdHMucGF0aCA9ICcvJ1xyXG4gICQuY29va2llLmRlZmF1bHRzLmRvbWFpbiA9ICdvai5jb20nXHJcbiAgIyMjXHJcbiAgaWYgbm90ICQgb3Igbm90ICQuY29va2llXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IgJ2pRdWVyeSBDb29raWUgaXMgYSByZXF1aXJlZCBkZXBlbmRlbmN5LicgIFxyXG4gICQuY29va2llLmRlZmF1bHRzLnNlY3VyZSA9IGZhbHNlXHJcbiAgXHJcbiAgY29va2llcyA9IHt9XHJcbiAgXHJcbiAgT0ouY29va2llLnJlZ2lzdGVyICdnZXQnLCAoY29va2llTmFtZSwgdHlwZSkgLT5cclxuICAgIHJldCA9ICcnXHJcbiAgICBpZiBjb29raWVOYW1lXHJcbiAgICAgIGlmIHR5cGVcclxuICAgICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lLCB0eXBlXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lICAgIFxyXG4gICAgICBpZiByZXRcclxuICAgICAgICBjb29raWVzW2Nvb2tpZU5hbWVdID0gcmV0XHJcbiAgXHJcbiAgT0ouY29va2llLnJlZ2lzdGVyICdhbGwnLCAoKSAtPlxyXG4gICAgcmV0ID0gJC5jb29raWUoKVxyXG4gICAgcmV0XHJcbiAgICBcclxuICBPSi5jb29raWUucmVnaXN0ZXIgJ3NldCcsIChjb29raWVOYW1lLCB2YWx1ZSwgb3B0cykgLT5cclxuICAgIHJldCA9ICcnXHJcbiAgICBpZiBjb29raWVOYW1lXHJcbiAgICAgIGNvb2tpZXNbY29va2llTmFtZV0gPSB2YWx1ZVxyXG4gICAgICBpZiBvcHRzXHJcbiAgICAgICAgcmV0ID0gJC5jb29raWUgY29va2llTmFtZSwgdmFsdWUsIG9wdHNcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHZhbHVlXHJcbiAgICByZXQgIFxyXG4gIFxyXG4gICBPSi5jb29raWUucmVnaXN0ZXIgJ2RlbGV0ZScsIChjb29raWVOYW1lLCBvcHRzKSAtPlxyXG4gICAgaWYgY29va2llTmFtZVxyXG4gICAgICBpZiBvcHRzXHJcbiAgICAgICAgJC5yZW1vdmVDb29raWUgY29va2llTmFtZSwgb3B0c1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgJC5yZW1vdmVDb29raWUgY29va2llTmFtZSAgICBcclxuICAgICAgZGVsZXRlIGNvb2tpZXNbY29va2llTmFtZV1cclxuICAgIHJldHVyblxyXG4gICAgXHJcbiAgT0ouY29va2llLnJlZ2lzdGVyICdkZWxldGVBbGwnLCAoKSAtPlxyXG4gICAgY29va2llcyA9IHt9XHJcbiAgICBPSi5lYWNoIE9KLmNvb2tpZS5hbGwsICh2YWwsIGtleSkgLT5cclxuICAgICAgT0ouY29va2llLmRlbGV0ZSBrZXkgIFxyXG4gICAgcmV0dXJuXHJcbiAgICBcclxuICByZXR1cm5cclxuICBcclxuICBcclxuICBcclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgXHJcbiAgZGVmZXIgPSAobWV0aG9kLCB3YWl0TXMpIC0+XHJcbiAgICBpZiBzZXRUaW1lb3V0XHJcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0IG1ldGhvZCwgd2FpdE1zXHJcbiAgXHJcbiAgT0oucmVnaXN0ZXIgJ2RlZmVyJywgZGVmZXJcclxuXHJcbiAgcmV0dXJuXHJcblxyXG4iLCIjICMgZWFjaFxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuXHJcbiAgIyAjIyBjYW5FYWNoXHJcbiAgY2FuRWFjaCA9IChvYmopIC0+XHJcbiAgICAjIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgW2lzXShpcy5odG1sKSB0cnVseSBpdGVyYWJsZSAoZS5nLiBhbiBpbnN0YW5jZSBvZiBPYmplY3Qgb3IgQXJyYXkpXHJcbiAgICBPSi5pcy5wbGFpbk9iamVjdChvYmopIG9yIE9KLmlzLm9iamVjdChvYmopIG9yIE9KLmlzLmFycmF5IG9ialxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuZWFjaFxyXG5cclxuICAjIEl0ZXJhdGUgYWxsIG9mIHRoZSBtZW1iZXJzIG9mIGFuIG9iamVjdCAob3IgYW4gYXJyYXkpIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYW5kIHJlY3Vyc2lvbi5cclxuXHJcbiAgIyAtIGBvYmpgOiB0aGUgb2JqZWN0IHRvIGl0ZXJhdGUsXHJcbiAgIyAtIGBvbkVhY2hgOiBhIGNhbGxiYWNrIHRvIGV4ZWN1dGUgZm9yIGVhY2ggaXRlcmF0aW9uLFxyXG4gICMgLSBgcmVjdXJzaXZlYDogaWYgdHJ1ZSwgcmVjdXJzaXZlbHkgaXRlcmF0ZSBhbGwgdmFsaWQgY2hpbGQgb2JqZWN0cy5cclxuICBlYWNoID0gKG9iaiwgb25FYWNoLCByZWN1cnNpdmUpIC0+XHJcbiAgICBpZiBjYW5FYWNoIG9ialxyXG4gICAgICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI2Zvcm93bikncyBgZm9yT3duYCBtZXRob2QgdG8gZW5zdXJlIHRoYXQgb25seSB0aGUgYWN0dWFsIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdCBhcmUgZW51bWVyYXRlZC5cclxuXHJcbiAgICAgICMgLSBgb25FYWNoYCBjYWxsYmFjayB3aWxsIHJlY2VpdmUgMiBwYXJhbWV0ZXJzOlxyXG4gICAgICAjIC0gYHZhbGAgYW5kIGBrZXlgLlxyXG4gICAgICAjIC0gYHZhbGAgaXMgYWx3YXlzIHRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuXHJcbiAgICAgICMgLSBga2V5YCBpcyBlaXRoZXIgdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IG9yIHRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBhcnJheS5cclxuICAgICAgXy5mb3JPd24gb2JqLCAodmFsLCBrZXkpIC0+XHJcbiAgICAgICAgaWYgb25FYWNoIGFuZCAodmFsIG9yIGtleSlcclxuICAgICAgICAgIHF1aXQgPSBvbkVhY2ggdmFsLCBrZXlcclxuICAgICAgICAgIHJldHVybiBmYWxzZSAgaWYgZmFsc2UgaXMgcXVpdFxyXG4gICAgICAgIGVhY2ggdmFsLCBvbkVhY2gsIHRydWUgIGlmIHRydWUgaXMgcmVjdXJzaXZlXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgcmV0dXJuXHJcblxyXG4gICMgIyMgcmVnaXN0ZXJcclxuXHJcbiAgIyByZWdpc3RlciB0aGUgYGVhY2hgIG1ldGhvZCBvbiB0aGUgW09KXShPSi5odG1sKSBuYW1lc3BhY2VcclxuICBPSi5yZWdpc3RlciAnZWFjaCcsIGVhY2hcclxuICByZXR1cm5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgT0ouZW51bXMucmVnaXN0ZXIgJ3Vua25vd24nLCAndW5rbm93bidcclxuXHJcbiAgT0ouZW51bXMucmVnaXN0ZXIgJ2lucHV0VHlwZXMnLFxyXG4gICAgYnV0dG9uOiAjY2hhcmFjdGVyc1xyXG4gICAgICBpZDogMFxyXG4gICAgICBuYW1lOiAnYnV0dG9uJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgY2hlY2tib3g6ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiAxXHJcbiAgICAgIG5hbWU6ICdjaGVja2JveCdcclxuICAgICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgY29sb3I6ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiAyXHJcbiAgICAgIG5hbWU6ICdjb2xvcidcclxuICAgICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgZGF0ZTogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDNcclxuICAgICAgbmFtZTogJ2RhdGUnXHJcbiAgICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgZGF0ZXRpbWU6ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiA0XHJcbiAgICAgIG5hbWU6ICdkYXRldGltZSdcclxuICAgICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgJ2RhdGV0aW1lLWxvY2FsJzogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDVcclxuICAgICAgbmFtZTogJ2RhdGV0aW1lLWxvY2FsJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICAgIGVtYWlsOiAjY2hhcmFjdGVyc1xyXG4gICAgICBpZDogNlxyXG4gICAgICBuYW1lOiAnZW1haWwnXHJcbiAgICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICBmaWxlOiAjY2hhcmFjdGVyc1xyXG4gICAgICBpZDogN1xyXG4gICAgICBuYW1lOiAnZmlsZSdcclxuICAgICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogZmFsc2VcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICBoaWRkZW46ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiA4XHJcbiAgICAgIG5hbWU6ICdoaWRkZW4nXHJcbiAgICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICBpbWFnZTogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDlcclxuICAgICAgbmFtZTogJ2ltYWdlJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgbW9udGg6ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiAxMFxyXG4gICAgICBuYW1lOiAnbW9udGgnXHJcbiAgICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICBudW1iZXI6ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiAxMVxyXG4gICAgICBuYW1lOiAnbnVtYmVyJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICBwYXNzd29yZDogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDEyXHJcbiAgICAgIG5hbWU6ICdwYXNzd29yZCdcclxuICAgICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgcmFkaW86ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiAxM1xyXG4gICAgICBuYW1lOiAncmFkaW8nXHJcbiAgICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICAgIHJhbmdlOiAjY2hhcmFjdGVyc1xyXG4gICAgICBpZDogMTRcclxuICAgICAgbmFtZTogJ3JhbmdlJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICByZXNldDogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDE1XHJcbiAgICAgIG5hbWU6ICdyZXNldCdcclxuICAgICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICAgIHNlYXJjaDogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDE2XHJcbiAgICAgIG5hbWU6ICdzZWFyY2gnXHJcbiAgICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgc3VibWl0OiAjY2hhcmFjdGVyc1xyXG4gICAgICBpZDogMTdcclxuICAgICAgbmFtZTogJ3N1Ym1pdCdcclxuICAgICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICAgIHRlbDogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDE4XHJcbiAgICAgIG5hbWU6ICdidXR0b24nXHJcbiAgICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgdGV4dDogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDE5XHJcbiAgICAgIG5hbWU6ICd0ZXh0J1xyXG4gICAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgdGltZTogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDIwXHJcbiAgICAgIG5hbWU6ICd0aW1lJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICAgIHVybDogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDIxXHJcbiAgICAgIG5hbWU6ICd1cmwnXHJcbiAgICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICB3ZWVrOiAjY2hhcmFjdGVyc1xyXG4gICAgICBpZDogMjJcclxuICAgICAgbmFtZTogJ3dlZWsnXHJcbiAgICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBcclxuICBpZiBPSi5UUkFDS19PTl9FUlJPUlxyXG4gICAgb25FcnJvciA9IE9KLmdsb2JhbC5vbmVycm9yXHJcblxyXG4gICAgIyMjXHJcbiAgICBMb2cgZXJyb3JzIHRvIHRoZSBjb25zb2xlXHJcbiAgICAjIyNcclxuICAgIE9KLmdsb2JhbC5vbmVycm9yID0gKG1zZywgdXJsLCBsaW5lTnVtYmVyKSAtPlxyXG4gICAgICByZXQgPSBmYWxzZVxyXG4gICAgICBPSi5jb25zb2xlLndhcm4gXCIlc1xcciB1cmw6ICVzXFxyIGxpbmU6ICVkXCIsIG1zZywgdXJsLCBsaW5lTnVtYmVyXHJcbiAgICAgIHJldCA9IG9uRXJyb3IgbXNnLCB1cmwsIGxpbmVOdW1iZXIgaWYgb25FcnJvclxyXG4gICAgICByZXQgI3RydWUgbWVhbnMgZG9uJ3QgcHJvcGFnYXRlIHRoZSBlcnJvciBcclxuXHJcbiAgcmV0dXJuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG5cclxuICBpZiBPSi5nbG9iYWwuYWRkRXZlbnRMaXN0ZW5lclxyXG4gICAgZXZlbnROYW1lID0gJ2FkZEV2ZW50TGlzdGVuZXInXHJcbiAgICBldmVudEluZm8gPSAnJ1xyXG4gIGVsc2UgXHJcbiAgICBldmVudE5hbWUgPSAnYXR0YWNoRXZlbnQnXHJcbiAgICBldmVudEluZm8gPSAnb24nXHJcbiAgXHJcbiAgT0ouaGlzdG9yeS5yZWdpc3RlciAncHVzaFN0YXRlJywgKHBhZ2VOYW1lLCBldmVudCkgLT5cclxuICAgIGlmIHBhZ2VOYW1lXHJcbiAgICAgICMga2VlcCB0aGUgbGluayBpbiB0aGUgYnJvd3NlciBoaXN0b3J5XHJcbiAgICAgIGhpc3RvcnkucHVzaFN0YXRlIG51bGwsIG51bGwsICcjJyArIHBhZ2VOYW1lXHJcbiAgICAgIFxyXG4gICAgICAjIGhlcmUgY2FuIGNhdXNlIGRhdGEgbG9hZGluZywgZXRjLlxyXG4gICAgXHJcbiAgICAgIGlmIGV2ZW50ICAgIFxyXG4gICAgICAgICMgZG8gbm90IGdpdmUgYSBkZWZhdWx0IGFjdGlvblxyXG4gICAgICAgIGlmIGV2ZW50LnByZXZlbnREZWZhdWx0XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZVxyXG4gICAgZmFsc2VcclxuICBcclxuICBPSi5oaXN0b3J5LnJlZ2lzdGVyICdyZXN0b3JlU3RhdGUnLCAobG9jYXRpb24pIC0+XHJcbiAgICBwYWdlTmFtZSA9IGxvY2F0aW9uLmhhc2hcclxuICAgIGlmIG5vdCBwYWdlTmFtZVxyXG4gICAgICBwYWdlTmFtZSA9IGxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVsxXVxyXG4gICAgaWYgcGFnZU5hbWVcclxuICAgICAgcGFnZU5hbWUgPSBwYWdlTmFtZS5yZXBsYWNlICcjJywgJydcclxuICAgICAgT0oucHVibGlzaCAncmVzdG9yZVN0YXRlJywgcGFnZU5hbWU6IHBhZ2VOYW1lLCBsb2NhdGlvbjogbG9jYXRpb25cclxuICAgIHJldHVyblxyXG4gIFxyXG4gICMjIyBcclxuICBoYW5nIG9uIHRoZSBldmVudCwgYWxsIHJlZmVyZW5jZXMgaW4gdGhpcyBkb2N1bWVudFxyXG4gICMjI1xyXG4gIFxyXG4gICMjI1xyXG4gICMgVGhpcyBiaW5kcyB0byB0aGUgZG9jdW1lbnQgY2xpY2sgZXZlbnQsIHdoaWNoIGluIHR1cm4gYXR0YWNoZXMgdG8gZXZlcnkgY2xpY2sgZXZlbnQsIGNhdXNpbmcgdW5leHBlY3RlZCBiZWhhdmlvci5cclxuICAjIEZvciBhbnkgY29udHJvbCB3aGljaCB3aXNoZXMgdG8gdHJpZ2dlciBhIHN0YXRlIGNoYW5nZSBpbiByZXNwb25zZSB0byBhbiBldmVudCwgaXQgaXMgYmV0dGVyIGZvciB0aGF0IGNvbnRyb2wgdG8gZGVmaW5lIHRoZSBiZWhhdmlvci5cclxuICBPSi5kb2N1bWVudFtldmVudE5hbWVdIGV2ZW50SW5mbyArICdjbGljaycsICgoZXZlbnQpIC0+XHJcbiAgICBldmVudCA9IGV2ZW50IG9yIHdpbmRvdy5ldmVudFxyXG4gICAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IG9yIGV2ZW50LnNyY0VsZW1lbnRcclxuICAgIFxyXG4gICAgIyBsb29raW5nIGZvciBhbGwgdGhlIGxpbmtzIHdpdGggJ2FqYXgnIGNsYXNzIGZvdW5kXHJcbiAgICBpZiB0YXJnZXQgYW5kIHRhcmdldC5ub2RlTmFtZSBpcyAnQScgYW5kICgnICcgKyB0YXJnZXQuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCdhamF4JykgPj0gMFxyXG4gICAgICBPSi5wdXNoU3RhdGUgdGFyZ2V0LmhyZWYsIGV2ZW50XHJcbiAgICAgIFxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICApLCBmYWxzZVxyXG4gICMjI1xyXG5cclxuICAjIyNcclxuICBoYW5nIG9uIHBvcHN0YXRlIGV2ZW50IHRyaWdnZXJlZCBieSBwcmVzc2luZyBiYWNrL2ZvcndhcmQgaW4gYnJvd3NlclxyXG4gICMjI1xyXG4gIE9KLmdsb2JhbFtldmVudE5hbWVdIGV2ZW50SW5mbyArICdwb3BzdGF0ZScsICgoZXZlbnQpIC0+XHJcbiAgICBcclxuICAgICMgd2UgZ2V0IGEgbm9ybWFsIExvY2F0aW9uIG9iamVjdFxyXG4gICAgXHJcbiAgICAjIyNcclxuICAgIE5vdGUsIHRoaXMgaXMgdGhlIG9ubHkgZGlmZmVyZW5jZSB3aGVuIHVzaW5nIHRoaXMgbGlicmFyeSxcclxuICAgIGJlY2F1c2UgdGhlIG9iamVjdCBkb2N1bWVudC5sb2NhdGlvbiBjYW5ub3QgYmUgb3ZlcnJpZGVuLFxyXG4gICAgc28gbGlicmFyeSB0aGUgcmV0dXJucyBnZW5lcmF0ZWQgJ2xvY2F0aW9uJyBvYmplY3Qgd2l0aGluXHJcbiAgICBhbiBvYmplY3Qgd2luZG93Lmhpc3RvcnksIHNvIGdldCBpdCBvdXQgb2YgJ2hpc3RvcnkubG9jYXRpb24nLlxyXG4gICAgRm9yIGJyb3dzZXJzIHN1cHBvcnRpbmcgJ2hpc3RvcnkucHVzaFN0YXRlJyBnZXQgZ2VuZXJhdGVkXHJcbiAgICBvYmplY3QgJ2xvY2F0aW9uJyB3aXRoIHRoZSB1c3VhbCAnZG9jdW1lbnQubG9jYXRpb24nLlxyXG4gICAgIyMjICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICByZXR1cm5Mb2NhdGlvbiA9IGhpc3RvcnkubG9jYXRpb24gb3IgZG9jdW1lbnQubG9jYXRpb25cclxuICAgIFxyXG4gICAgIyMjXHJcbiAgICBoZXJlIGNhbiBjYXVzZSBkYXRhIGxvYWRpbmcsIGV0Yy5cclxuICAgICMjI1xyXG4gICAgT0ouaGlzdG9yeS5yZXN0b3JlU3RhdGUgcmV0dXJuTG9jYXRpb25cclxuICAgIFxyXG4gICAgcmV0dXJuXHJcbiAgKSwgZmFsc2UgXHJcbiAgXHJcbiAgcmV0dXJuXHJcbiBcclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBcclxuICBPSi5pcy5yZWdpc3RlciAnYm9vbCcsIChib29sZWFuKSAtPlxyXG4gICAgXy5pc0Jvb2xlYW4gYm9vbGVhblxyXG5cclxuICBPSi5pcy5yZWdpc3RlciAnYXJyYXlOdWxsT3JFbXB0eScsIChhcnIpIC0+XHJcbiAgICBfLmlzRW1wdHkgYXJyXHJcblxyXG4gIE9KLmlzLnJlZ2lzdGVyICdzdHJpbmdOdWxsT3JFbXB0eScsIChzdHIpIC0+XHJcbiAgICBzdHIgYW5kIChub3Qgc3RyLmxlbmd0aCBvciBzdHIubGVuZ3RoIGlzIDAgb3Igbm90IHN0ci50cmltIG9yIG5vdCBzdHIudHJpbSgpKVxyXG5cclxuICBPSi5pcy5yZWdpc3RlciAnbnVtYmVyTnVsbE9yRW1wdHknLCAobnVtKSAtPlxyXG4gICAgbm90IG51bSBvciBpc05hTihudW0pIG9yIG5vdCBudW0udG9QcmVjaXNpb25cclxuXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ2RhdGVOdWxsT3JFbXB0eScsIChkdCkgLT5cclxuICAgIG5vdCBkdCBvciBub3QgZHQuZ2V0VGltZVxyXG5cclxuICBPSi5pcy5yZWdpc3RlciAnb2JqZWN0TnVsbE9yRW1wdHknLCAob2JqKSAtPlxyXG4gICAgXy5pc0VtcHR5IG9iaiBvciBub3QgT2JqZWN0LmtleXMob2JqKSBvciBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCBpcyAwXHJcblxyXG4gIE9KLmlzLnJlZ2lzdGVyICdwbGFpbk9iamVjdCcsIChvYmopIC0+XHJcbiAgICBfLmlzUGxhaW5PYmplY3Qgb2JqIFxyXG4gICAgXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ29iamVjdCcsIChvYmopIC0+XHJcbiAgICBfLmlzT2JqZWN0IG9ialxyXG5cclxuICBPSi5pcy5yZWdpc3RlciAnZGF0ZScsIChkdCkgLT5cclxuICAgIF8uaXNEYXRlIGR0XHJcblxyXG4gIFxyXG4gICMjI1xyXG4gIERldGVybWluZXMgaWYgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiBhIE51bWJlciBhbmQgbm90IE5hTipcclxuICAjIyNcclxuICBPSi5pcy5yZWdpc3RlciAnbnVtYmVyJywgKG51bSkgLT5cclxuICAgIHR5cGVvZiBudW0gaXMgJ251bWJlcicgYW5kIGZhbHNlIGlzIChPSi5udW1iZXIuaXNOYU4obnVtKSBvciBmYWxzZSBpcyBPSi5udW1iZXIuaXNGaW5pdGUobnVtKSBvciBPSi5udW1iZXIuTUFYX1ZBTFVFIGlzIG51bSBvciBPSi5udW1iZXIuTUlOX1ZBTFVFIGlzIG51bSlcclxuXHJcbiAgIyMjXHJcbiAgRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGNvbnZlcnRhYmxlIHRvIGEgTnVtYmVyXHJcbiAgIyMjXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ251bWVyaWMnLCAobnVtKSAtPlxyXG4gICAgcmV0ID0gT0ouaXMubnVtYmVyKG51bSlcclxuICAgIHVubGVzcyByZXRcclxuICAgICAgbnVOdW0gPSBPSi50by5udW1iZXIobnVtKVxyXG4gICAgICByZXQgPSBPSi5pcy5udW1iZXIobnVOdW0pXHJcbiAgICByZXRcclxuXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ3ZlbmRvck9iamVjdCcsIChvYmopIC0+XHJcbiAgICByZXQgPSAob2JqIGluc3RhbmNlb2YgT0pbJz8nXSlcclxuICAgIHJldFxyXG5cclxuICBPSi5pcy5yZWdpc3RlciAnZWxlbWVudEluRG9tJywgKGVsZW1lbnRJZCkgLT5cclxuICAgIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCkpXHJcblxyXG4gIE9KLmlzLnJlZ2lzdGVyICdnZW5lcmljJywgKG9iaikgLT5cclxuICAgIHJldCA9IChmYWxzZSBpcyBPSi5pcy5tZXRob2Qob2JqKSBhbmQgZmFsc2UgaXMgT0ouaGFzTGVuZ3RoKG9iaikgYW5kIGZhbHNlIGlzIE9KLmlzLnBsYWluT2JqZWN0KG9iaikpXHJcbiAgICByZXRcclxuXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ2FycmF5JywgKG9iaikgLT5cclxuICAgIF8uaXNBcnJheSBvYmpcclxuXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ3N0cmluZycsIChzdHIpIC0+XHJcbiAgICBfLmlzU3RyaW5nIHN0clxyXG4gICAgXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ3RydWUnLCAob2JqKSAtPlxyXG4gICAgb2JqIGlzIHRydWUgb3Igb2JqIGlzICd0cnVlJyBvciBvYmogaXMgMSBvciBvYmogaXMgJzEnXHJcblxyXG4gIE9KLmlzLnJlZ2lzdGVyICdmYWxzZScsIChvYmopIC0+XHJcbiAgICBvYmogaXMgZmFsc2Ugb3Igb2JqIGlzICdmYWxzZScgb3Igb2JqIGlzIDAgb3Igb2JqIGlzICcwJ1xyXG5cclxuICBPSi5pcy5yZWdpc3RlciAndHJ1ZU9yRmFsc2UnLCAob2JqKSAtPlxyXG4gICAgT0ouaXMudHJ1ZSBvYmogb3IgT0ouaXMuZmFsc2Ugb2JqXHJcblxyXG4gIE9KLmlzLnJlZ2lzdGVyICdudWxsT3JFbXB0eScsIChvYmosIGNoZWNrTGVuZ3RoKSAtPlxyXG4gICAgXy5pc0VtcHR5KG9iaikgb3IgXy5pc1VuZGVmaW5lZChvYmopIG9yIF8uaXNOdWxsKG9iaikgb3IgXy5pc05hTihvYmopXHJcblxyXG4gIE9KLmlzLnJlZ2lzdGVyICdudWxsT3JVbmRlZmluZWQnLCAob2JqLCBjaGVja0xlbmd0aCkgLT5cclxuICAgIF8uaXNVbmRlZmluZWQob2JqKSBvciBfLmlzTnVsbChvYmopIG9yIF8uaXNOYU4ob2JqKVxyXG5cclxuICBPSi5pcy5yZWdpc3RlciAnaW5zdGFuY2VvZicsIChuYW1lLCBvYmopIC0+XHJcbiAgICBvYmoudHlwZSBpcyBuYW1lIG9yIG9iaiBpbnN0YW5jZW9mIG5hbWVcclxuXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ21ldGhvZCcsIChvYmopIC0+XHJcbiAgICBvYmogaXNudCBPSi5ub29wIGFuZCBfLmlzRnVuY3Rpb24gb2JqXHJcblxyXG4gICMjI1xyXG4gIERlcHJlY2F0ZWQuIExlZnQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LiBVc2UgaXMubWV0aG9kIGluc3RlYWQuXHJcbiAgIyMjXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ2Z1bmMnLCBPSi5pcy5tZXRob2RcclxuICBcclxuICByZXR1cm5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgXHJcbiAgZnJpZW5kbHlOYW1lID0gJ25vdHknXHJcbiAgXHJcbiAgT0oubm90aWZpY2F0aW9ucy5yZWdpc3RlciBmcmllbmRseU5hbWUsIChvcHRpb25zLCBvd25lcikgLT5cclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgbGF5b3V0OiAndG9wUmlnaHQnXHJcbiAgICAgIHRoZW1lOiAnZGVmYXVsdFRoZW1lJ1xyXG4gICAgICB0eXBlOiAnYWxlcnQnXHJcbiAgICAgIHRleHQ6ICcnICNjYW4gYmUgaHRtbCBvciBzdHJpbmdcclxuICAgICAgZGlzbWlzc1F1ZXVlOiB0cnVlICNJZiB5b3Ugd2FudCB0byB1c2UgcXVldWUgZmVhdHVyZSBzZXQgdGhpcyB0cnVlXHJcbiAgICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm5vdHlfbWVzc2FnZVwiPjxzcGFuIGNsYXNzPVwibm90eV90ZXh0XCI+PC9zcGFuPjxkaXYgY2xhc3M9XCJub3R5X2Nsb3NlXCI+PC9kaXY+PC9kaXY+JyxcclxuICAgICAgYW5pbWF0aW9uOiBcclxuICAgICAgICAgIG9wZW46IFxyXG4gICAgICAgICAgICBoZWlnaHQ6ICd0b2dnbGUnXHJcbiAgICAgICAgICBjbG9zZTogXHJcbiAgICAgICAgICAgIGhlaWdodDogJ3RvZ2dsZSdcclxuICAgICAgICAgIGVhc2luZzogJ3N3aW5nJ1xyXG4gICAgICAgICAgc3BlZWQ6IDUwMCAjb3BlbmluZyAmIGNsb3NpbmcgYW5pbWF0aW9uIHNwZWVkXHJcbiAgICAgIHRpbWVvdXQ6IDUwMDAgI2RlbGF5IGZvciBjbG9zaW5nIGV2ZW50LiBTZXQgZmFsc2UgZm9yIHN0aWNreSBub3RpZmljYXRpb25zXHJcbiAgICAgIGZvcmNlOiBmYWxzZSAjYWRkcyBub3RpZmljYXRpb24gdG8gdGhlIGJlZ2lubmluZyBvZiBxdWV1ZSB3aGVuIHNldCB0byB0cnVlXHJcbiAgICAgIG1vZGFsOiBmYWxzZVxyXG4gICAgICBtYXhWaXNpYmxlOiA1ICN5b3UgY2FuIHNldCBtYXggdmlzaWJsZSBub3RpZmljYXRpb24gZm9yIGRpc21pc3NRdWV1ZSB0cnVlIG9wdGlvbixcclxuICAgICAga2lsbGVyOiBmYWxzZSAjZm9yIGNsb3NlIGFsbCBub3RpZmljYXRpb25zIGJlZm9yZSBzaG93XHJcbiAgICAgIGNsb3NlV2l0aDogWydjbGljayddICAjWydjbGljaycsICdidXR0b24nLCAnaG92ZXInXVxyXG4gICAgICBjYWxsYmFjazogXHJcbiAgICAgICAgICBvblNob3c6IE9KLm5vb3AsXHJcbiAgICAgICAgICBhZnRlclNob3c6IE9KLm5vb3BcclxuICAgICAgICAgIG9uQ2xvc2U6IE9KLm5vb3BcclxuICAgICAgICAgIGFmdGVyQ2xvc2U6IE9KLm5vb3BcclxuICAgICAgYnV0dG9uczogZmFsc2UgI2FuIGFycmF5IG9mIGJ1dHRvbnNcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICByZXQgPSBub3R5IGRlZmF1bHRzXHJcbiAgICAgIFxyXG4gICAgcmV0XHJcbiAgICBcclxuICByZXR1cm5cclxuICBcclxuICBcclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgXHJcbiAgdG9rZW5zID0ge31cclxuICBzdWJzY3JpYmVycyA9IFtdXHJcbiAgZXZlbnRzID0ge31cclxuICBcclxuICBnZXRFdmVudE5hbWUgPSAoZXZlbnQpIC0+XHJcbiAgICBldmVudC50b1VwcGVyQ2FzZSgpLnJlcGxhY2UgJyAnLCAnXydcclxuICBcclxuICBzdWJzY3JpYmUgPSAoZXZlbnQsIG1ldGhvZCkgLT5cclxuICAgIGV2ZW50TmFtZSA9IGdldEV2ZW50TmFtZSBldmVudFxyXG4gICAgaWYgbm90IGV2ZW50c1tldmVudE5hbWVdIHRoZW4gZXZlbnRzW2V2ZW50TmFtZV0gPSBbXVxyXG4gICAgXHJcbiAgICB0b2tlbiA9IFB1YlN1Yi5zdWJzY3JpYmUgZXZlbnROYW1lLCBtZXRob2RcclxuICAgIHRva2Vuc1t0b2tlbl0gPSB0b2tlblxyXG4gICAgc3Vic2NyaWJlcnMucHVzaCBtZXRob2RcclxuICAgIGV2ZW50c1tldmVudE5hbWVdLnB1c2ggbWV0aG9kXHJcbiAgICB0b2tlblxyXG4gIFxyXG4gIHB1Ymxpc2ggPSAoZXZlbnQsIGRhdGEpIC0+XHJcbiAgICBldmVudE5hbWUgPSBnZXRFdmVudE5hbWUgZXZlbnRcclxuICAgIGlmIGV2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgIFB1YlN1Yi5wdWJsaXNoIGV2ZW50TmFtZSwgZGF0YVxyXG4gICAgZWxzZVxyXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0V2ZW50IG5hbWVkIHsnICsgZXZlbnQgKyAnfSBpcyBub3QgcmVjb2duaXplZC4nXHJcbiAgICByZXR1cm4gIFxyXG4gIFxyXG4gIHVuc3Vic2NyaWJlID0gKHRva2VuT3JNZXRob2QpIC0+XHJcbiAgICBpZiBPSi5pcy5tZXRob2QgdG9rZW5Pck1ldGhvZFxyXG4gICAgICBpZiAtMSBpc250IHN1YnNjcmliZXJzLmluZGV4T2YgdG9rZW5Pck1ldGhvZFxyXG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSB0b2tlbk9yTWV0aG9kXHJcbiAgICAgICAgc3Vic2NyaWJlcnMgPSBfLnJlbW92ZSBzdWJzY3JpYmVycywgKG1ldGhvZCkgLT4gbWV0aG9kIGlzIHRva2VuT3JNZXRob2RcclxuICAgICAgZWxzZVxyXG4gICAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbWV0aG9kIGlzIG5vdCByZWNvZ25pemVkLicgIFxyXG4gICAgZWxzZVxyXG4gICAgICBpZiB0b2tlbnNbdG9rZW5Pck1ldGhvZF1cclxuICAgICAgICBQdWJTdWIudW5zdWJzY3JpYmUgdG9rZW5Pck1ldGhvZFxyXG4gICAgICAgIGRlbGV0ZSB0b2tlbnNbdG9rZW5Pck1ldGhvZF1cclxuICAgIHJldHVyblxyXG4gIFxyXG4gIHVuc3Vic2NyaWJlQWxsID0gKCkgLT5cclxuICAgIE9KLmVhY2ggdG9rZW5zLCAodG9rZW4pIC0+IHVuc3Vic2NyaWJlIHRva2VuXHJcbiAgICBzdWJzY3JpYmVycyA9IFtdXHJcbiAgICBldmVudHMgPSB7fVxyXG4gICAgcmV0dXJuXHJcbiAgXHJcbiAgdW5zdWJzY3JpYmVFdmVudCA9IChldmVudCkgLT5cclxuICAgIGV2ZW50TmFtZSA9IGdldEV2ZW50TmFtZSBldmVudFxyXG4gICAgaWYgZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgT0ouZWFjaCBldmVudHNbZXZlbnROYW1lXSwgKG1ldGhvZCkgLT4gdW5zdWJzY3JpYmUgbWV0aG9kXHJcbiAgICBlbHNlXHJcbiAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbmFtZWQgeycgKyBldmVudCArICd9IGlzIG5vdCByZWNvZ25pemVkLidcclxuICAgIGRlbGV0ZSBldmVudHNbZXZlbnROYW1lXVxyXG4gICAgcmV0dXJuXHJcbiAgXHJcbiAgT0oucmVnaXN0ZXIgJ3B1Ymxpc2gnLCBwdWJsaXNoICBcclxuICBPSi5yZWdpc3RlciAnc3Vic2NyaWJlJywgc3Vic2NyaWJlICBcclxuICBPSi5yZWdpc3RlciAndW5zdWJzY3JpYmUnLCB1bnN1YnNjcmliZSAgXHJcbiAgT0oucmVnaXN0ZXIgJ3Vuc3Vic2NyaWJlQWxsJywgdW5zdWJzY3JpYmVBbGwgIFxyXG4gIE9KLnJlZ2lzdGVyICd1bnN1YnNjcmliZUV2ZW50JywgdW5zdWJzY3JpYmVFdmVudCAgXHJcblxyXG4gIHJldHVyblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBcclxuICAjIyNcclxuICBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkwMTExNS9ob3ctY2FuLWktZ2V0LXF1ZXJ5LXN0cmluZy12YWx1ZXMtaW4tamF2YXNjcmlwdFxyXG4gICMjI1xyXG4gIE9KLnJlZ2lzdGVyICdxdWVyeVN0cmluZycsIChwYXJhbSkgLT5cclxuICAgIHJldCA9IHt9XHJcbiAgICBcclxuICAgIGlmIE9KLmdsb2JhbC5sb2NhdGlvblxyXG4gICAgICBwYXJhbXMgPSAgT0ouZ2xvYmFsLmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkuc3BsaXQgJyYnXHJcbiAgICAgIGlmIHBhcmFtc1xyXG4gICAgICAgIGkgPSAwXHJcbiAgICAgICAgd2hpbGUgaSA8IHBhcmFtcy5sZW5ndGhcclxuICAgICAgICAgIHBybSA9IHBhcmFtc1tpXS5zcGxpdCAnPSdcclxuICAgICAgICAgIGlmIHBybS5sZW5ndGggaXMgMiBcclxuICAgICAgICAgICAgcmV0W3BybVswXV0gPSBPSi5nbG9iYWwuZGVjb2RlVVJJQ29tcG9uZW50IHBybVsxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpXHJcbiAgICAgICAgICBpICs9IDFcclxuICAgIHJldFxyXG4gICAgXHJcbiAgcmV0dXJuXHJcbiAgXHJcbiAgXHJcblxyXG4iLCIjICMgcmFuZ2VzXHJcblxyXG5kbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG5cclxuICAjICMjIHJhbmdlXHJcbiAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNyYW5nZSkncyBgcmFuZ2VgIG1ldGhvZFxyXG4gIE9KLnJlZ2lzdGVyICdyYW5nZScsIChwYXJhbXMuLi4pIC0+XHJcbiAgICBfLnJhbmdlIHBhcmFtcy4uLlxyXG4gIFxyXG4gICMgIyMgcmFuZ2VNaW5cclxuICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI21pbikncyBgbWluYCBtZXRob2RcclxuICBPSi5yZWdpc3RlciAncmFuZ2VNaW4nLCAocGFyYW1zLi4uKSAtPlxyXG4gICAgXy5taW4gcGFyYW1zLi4uXHJcblxyXG4gICMgIyMgcmFuZ2VNYXhcclxuICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI21heCkncyBgbWF4YCBtZXRob2RcclxuICBPSi5yZWdpc3RlciAncmFuZ2VNYXgnLCAocGFyYW1zLi4uKSAtPlxyXG4gICAgXy5tYXggcGFyYW1zLi4uXHJcblxyXG4gICMgIyMgc3RyaW5nUmFuZ2VUb1N1YlJhbmdlc1xyXG4gICMjI1xyXG4gIFRha2UgYW4gYXJyYXkgb2Ygc3RyaW5nIHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXHJcbiAgVXNlcyB0aGUgZmlyc3QgbGV0dGVyIG9mIGVhY2ggc3RyaW5nIHZhbHVlIGluIHRoZSBhcnJheSB0byBjb252ZXJ0IHRvIHVuaXF1ZSBjb2RlIGNoYXJhY3RlciAobG93ZXIgY2FzZSlcclxuICBCdWlsZHMgYSBpbnQgcmFuZ2UgYmFzZWQgb24gdW5pcXVlIGNvZGUgY2hhcnMuXHJcbiAgIyMjXHJcbiAgc3RyaW5nUmFuZ2VUb1N1YlJhbmdlcyA9IChuID0gNiwgcmFuZ2UgPSBbXSkgLT5cclxuICAgIGNoYXJSYW5nZSA9IFtdXHJcblxyXG5cclxuICAgIE9KLmVhY2ggcmFuZ2UsICh2YWwpIC0+XHJcbiAgICAgIGNoYXIgPSB2YWwudHJpbSgpWzBdLnRvTG93ZXJDYXNlKClcclxuICAgICAgaWYgZmFsc2UgaXMgT0ouY29udGFpbnMgY2hhclJhbmdlLCBjaGFyXHJcbiAgICAgICAgY2hhclJhbmdlLnB1c2ggY2hhci5jaGFyQ29kZUF0KClcclxuXHJcbiAgICByZXQgPSByYW5nZVRvU3ViUmFuZ2VzIG4sIGNoYXJSYW5nZVxyXG5cclxuICAgIGkgPSAwXHJcbiAgICB3aGlsZSBpIDwgblxyXG4gICAgICBpICs9IDFcclxuICAgICAgc3ViUmFuZ2UgPSByZXRbaV1cclxuICAgICAgc3ViUmFuZ2UubWFwIFN0cmluZy5mcm9tQ2hhckNvZGVcclxuXHJcbiAgICBvbGRHZXRSYW5nZSA9IHJldC5nZXRSYW5nZVxyXG4gICAgcmV0LmdldFJhbmdlID0gKHZhbCkgLT5cclxuICAgICAgY2hhciA9IHZhbC50cmltKClbMF0udG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KClcclxuICAgICAgaWR4ID0gb2xkR2V0UmFuZ2UgY2hhclxyXG4gICAgICBpZHhcclxuICAgIHJldFxyXG5cclxuICAjICMjIHJhbmdlVG9TdWJSYW5nZXNcclxuICAjIyNcclxuICBUYWtlIGFuIGFycmF5IG9mIGludCB2YWx1ZXMgYW5kIGEgbnVtYmVyIG9mIHBhcnRpdGlvbnMgdG8gY3JlYXRlLlxyXG4gIERpdmlkZXMgdGhlIG9yaWdpbmFsIGFycmF5IGludG8gdGhlIHNwZWNpZmllZCBudW1iZXIgb2Ygc3ViIGFycmF5cy5cclxuICBPdmVyZmxvdyBpcyBwYXNzZWQgdG8gdGhlIGZpbmFsIHBhcnRpdGlvbi5cclxuICAjIyNcclxuICByYW5nZVRvU3ViUmFuZ2VzID0gKG4gPSA2LCByYW5nZSA9IFtdKSAtPlxyXG4gICAgcmV0ID0gT0oub2JqZWN0KClcclxuICAgIHJhbmdlTG93ID0gT0oucmFuZ2VNaW4gcmFuZ2VcclxuICAgIHJhbmdlSGlnaCA9IE9KLnJhbmdlTWF4IHJhbmdlXHJcblxyXG4gICAgZGlzdGFuY2UgPSByYW5nZUhpZ2ggLSByYW5nZUxvd1xyXG4gICAgc3ViUmFuZ2VTaXplID0gZGlzdGFuY2UvblxyXG4gICAgc3ViUmFuZ2VzID0gcmV0LmFkZCAncmFuZ2VzJywgT0oub2JqZWN0KClcclxuICAgIGNodW5rVmFsID0gcmFuZ2VMb3dcclxuXHJcbiAgICBtYXAgPSBPSi5vYmplY3QoKVxyXG5cclxuICAgIGkgPSAwO1xyXG4gICAgd2hpbGUgaSA8IG5cclxuICAgICAgaSArPSAxXHJcbiAgICAgIGlmIGkgPCBuIHRoZW4ganVtcCA9IE1hdGgucm91bmQgc3ViUmFuZ2VTaXplXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBqdW1wID0gTWF0aC5mbG9vciBzdWJSYW5nZVNpemVcclxuICAgICAgICBpZiBjaHVua1ZhbCArIGp1bXAgPD0gcmFuZ2VIaWdoXHJcbiAgICAgICAgICBqdW1wICs9IHJhbmdlSGlnaCAtIGNodW5rVmFsIC0ganVtcCArIDFcclxuXHJcbiAgICAgIHN1YlJhbmdlID0gT0oucmFuZ2UgY2h1bmtWYWwsIGNodW5rVmFsICsganVtcFxyXG4gICAgICBPSi5lYWNoIHN1YlJhbmdlLCAodmFsKSAtPiBtYXAuYWRkIHZhbCwgaVxyXG4gICAgICBzdWJSYW5nZXNbaV0gPSBzdWJSYW5nZVxyXG4gICAgICBjaHVua1ZhbCArPSBqdW1wXHJcblxyXG4gICAgcmV0LmFkZCAnZ2V0UmFuZ2UnLCAodmFsKSAtPlxyXG4gICAgICBtYXBbdmFsXVxyXG5cclxuICAgIHJldFxyXG5cclxuICBPSi5yZWdpc3RlciAnc3RyaW5nUmFuZ2VUb1N1YlJhbmdlcycsIHN0cmluZ1JhbmdlVG9TdWJSYW5nZXNcclxuICBPSi5yZWdpc3RlciAncmFuZ2VUb1N1YlJhbmdlcycsIHJhbmdlVG9TdWJSYW5nZXNcclxuXHJcbiAgcmV0dXJuXHJcblxyXG4iLCIjICMgdG9cclxuXHJcbmRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgXHJcbiAgIyAjIyBib29sXHJcbiAgIyBjb252ZXJ0IGFueSBjb21wYXRpYmxlIG9iamVjdCB0byBhIGJvb2xlYW4uIEluY29tcGF0aWJsZSBvYmplY3RzIGFyZSBmYWxzZS5cclxuICBPSi50by5yZWdpc3RlciAnYm9vbCcsIChzdHIpIC0+XHJcbiAgICByZXRCb29sID0gT0ouaXNbJ3RydWUnXShzdHIpXHJcbiAgICByZXRCb29sID0gZmFsc2UgIGlmIHJldEJvb2wgaXMgZmFsc2Ugb3IgcmV0Qm9vbCBpc250IHRydWVcclxuICAgIHJldEJvb2xcclxuXHJcbiAgIyAjIyBFUzVfVG9Cb29sXHJcbiAgIyAoZGVidWcpIG1ldGhvZCB0byBleHBsaWNpdGx5IGZvcmNlIGFuIGBpZihvYmopYCBldmFsdWF0aW9uIHRvIGZsb3cgdGhyb3VnaCB0aGUgRVM1IHNwZWMgZm9yIHRydXRoaW5lc3NcclxuICBPSi50by5yZWdpc3RlciAnRVM1X1RvQm9vbCcsICh2YWwpIC0+XHJcbiAgICB2YWwgaXNudCBmYWxzZSBhbmQgdmFsIGlzbnQgMCBhbmQgdmFsIGlzbnQgJycgYW5kIHZhbCBpc250IG51bGwgYW5kIHZhbCBpc250IGB1bmRlZmluZWRgIGFuZCAodHlwZW9mIHZhbCBpc250ICdudW1iZXInIG9yIG5vdCBpc05hTih2YWwpKVxyXG5cclxuICAjICMjIGRhdGVGcm9tVGlja3NcclxuICAjIHRha2UgYSBudW1iZXIgcmVwcmVzZW50aW5nIHRpY2tzIGFuZCBjb252ZXJ0IGl0IGludG8gYW4gaW5zdGFuY2Ugb2YgRGF0ZVxyXG4gIE9KLnRvLnJlZ2lzdGVyICdkYXRlRnJvbVRpY2tzJywgKHRpY2tTdHIpIC0+XHJcbiAgICB0aWNzRGF0ZVRpbWUgPSBPSi50by5zdHJpbmcodGlja1N0cilcclxuICAgIHJldCA9IHVuZGVmaW5lZFxyXG4gICAgdGlja3MgPSB1bmRlZmluZWRcclxuICAgIG9mZnNldCA9IHVuZGVmaW5lZFxyXG4gICAgbG9jYWxPZmZzZXQgPSB1bmRlZmluZWRcclxuICAgIGFyciA9IHVuZGVmaW5lZFxyXG4gICAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkodGljc0RhdGVUaW1lKVxyXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnLycsICcnKVxyXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnRGF0ZScsICcnKVxyXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnKCcsICcnKVxyXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnKScsICcnKVxyXG4gICAgICBhcnIgPSB0aWNzRGF0ZVRpbWUuc3BsaXQoJy0nKVxyXG4gICAgICBpZiBhcnIubGVuZ3RoID4gMVxyXG4gICAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcclxuICAgICAgICBvZmZzZXQgPSBPSi50by5udW1iZXIoYXJyWzFdKVxyXG4gICAgICAgIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpXHJcbiAgICAgICAgcmV0ID0gbmV3IERhdGUoKHRpY2tzIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKVxyXG4gICAgICBlbHNlIGlmIGFyci5sZW5ndGggaXMgMVxyXG4gICAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcclxuICAgICAgICByZXQgPSBuZXcgRGF0ZSh0aWNrcylcclxuICAgIHJldFxyXG5cclxuICAjICMjIGJpbmFyeVxyXG4gICMgY29udmVydCBhbiBvYmplY3QgdG8gYmluYXJ5IDAgb3IgMVxyXG4gIE9KLnRvLnJlZ2lzdGVyICdiaW5hcnknLCAob2JqKSAtPlxyXG4gICAgcmV0ID0gTmFOXHJcbiAgICBpZiBvYmogaXMgMCBvciBvYmogaXMgJzAnIG9yIG9iaiBpcyAnJyBvciBvYmogaXMgZmFsc2Ugb3IgT0oudG8uc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgaXMgJ2ZhbHNlJ1xyXG4gICAgICByZXQgPSAwXHJcbiAgICBlbHNlIHJldCA9IDEgIGlmIG9iaiBpcyAxIG9yIG9iaiBpcyAnMScgb3Igb2JqIGlzIHRydWUgb3IgT0oudG8uc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgaXMgJ3RydWUnXHJcbiAgICByZXRcclxuXHJcbiAgXHJcbiAgIyAjIyBudW1iZXJcclxuICAjXHJcbiAgIyBBdHRlbXB0cyB0byBjb252ZXJ0IGFuIGFyYml0cmFyeSB2YWx1ZSB0byBhIE51bWJlci5cclxuICAjIExvb3NlIGZhbHN5IHZhbHVlcyBhcmUgY29udmVydGVkIHRvIDAuXHJcbiAgIyBMb29zZSB0cnV0aHkgdmFsdWVzIGFyZSBjb252ZXJ0ZWQgdG8gMS5cclxuICAjIEFsbCBvdGhlciB2YWx1ZXMgYXJlIHBhcnNlZCBhcyBJbnRlZ2Vycy5cclxuICAjIEZhaWx1cmVzIHJldHVybiBhcyBOYU4uXHJcbiAgIyBcclxuICBPSi50by5yZWdpc3RlciAnbnVtYmVyJywgKGlucHV0TnVtLCBkZWZhdWx0TnVtKSAtPlxyXG4gICAgdHJ5R2V0TnVtYmVyID0gKHZhbCkgLT5cclxuICAgICAgcmV0ID0gTmFOXHJcbiAgICAgICMgaWYgYHZhbGAgYWxyZWFkeSAoaXMpW2lzLmh0bWxdIGEgTnVtYmVyLCByZXR1cm4gaXQgXHJcbiAgICAgIGlmIE9KLmlzLm51bWJlcih2YWwpXHJcbiAgICAgICAgcmV0ID0gdmFsXHJcbiAgICAgICMgZWxzZSBpZiBgdmFsYCBhbHJlYWR5IChpcylbaXMuaHRtbF0gYSBTdHJpbmcgb3IgYSBCb29sZWFuLCBjb252ZXJ0IGl0ICBcclxuICAgICAgZWxzZSBpZiBPSi5pcy5zdHJpbmcodmFsKSBvciBPSi5pcy5ib29sKHZhbClcclxuICAgICAgICB0cnlHZXQgPSAodmFsdWUpIC0+XHJcbiAgICAgICAgICBudW0gPSBPSi50by5iaW5hcnkodmFsdWUpXHJcbiAgICAgICAgICBudW0gPSArdmFsdWUgIGlmIG5vdCBPSi5pcy5udW1iZXIobnVtKSBhbmQgdmFsdWVcclxuICAgICAgICAgIG51bSA9IF8ucGFyc2VJbnQodmFsdWUsIDApIGlmIG5vdCBPSi5pcy5udW1iZXIobnVtKVxyXG4gICAgICAgICAgbnVtXHJcbiAgICAgICAgcmV0ID0gdHJ5R2V0IHZhbFxyXG4gICAgICByZXRcclxuICAgICAgXHJcbiAgICByZXRWYWwgPSB0cnlHZXROdW1iZXIoaW5wdXROdW0pXHJcbiAgICBpZiBub3QgT0ouaXMubnVtYmVyKHJldFZhbClcclxuICAgICAgcmV0VmFsID0gdHJ5R2V0TnVtYmVyKGRlZmF1bHROdW0pXHJcbiAgICAgIHJldFZhbCA9IE51bWJlci5OYU4gaWYgbm90IE9KLmlzLm51bWJlcihyZXRWYWwpXHJcbiAgICByZXRWYWxcclxuXHJcbiAgIyAjIyBzdHJpbmdcclxuICAjIGNvbnZlcnQgYW4gb2JqZWN0IHRvIHN0cmluZ1xyXG4gIE9KLnRvLnJlZ2lzdGVyICdzdHJpbmcnLCAoaW5wdXRTdHIsIGRlZmF1bHRTdHIpIC0+XHJcbiAgICB0cnlHZXRTdHJpbmcgPSAoc3RyKSAtPlxyXG4gICAgICByZXQgPSB1bmRlZmluZWRcclxuICAgICAgaWYgT0ouaXMuc3RyaW5nKHN0cilcclxuICAgICAgICByZXQgPSBzdHJcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldCA9ICcnXHJcbiAgICAgICAgcmV0ID0gc3RyLnRvU3RyaW5nKCkgIGlmIE9KLmlzLmJvb2woc3RyKSBvciBPSi5pcy5udW1iZXIoc3RyKSBvciBPSi5pcy5kYXRlKHN0cilcclxuICAgICAgcmV0XHJcbiAgICByZXQxID0gdHJ5R2V0U3RyaW5nKGlucHV0U3RyKVxyXG4gICAgcmV0MiA9IHRyeUdldFN0cmluZyhkZWZhdWx0U3RyKVxyXG4gICAgcmV0VmFsID0gJydcclxuICAgIGlmIHJldDEubGVuZ3RoIGlzbnQgMFxyXG4gICAgICByZXRWYWwgPSByZXQxXHJcbiAgICBlbHNlIGlmIHJldDEgaXMgcmV0MiBvciByZXQyLmxlbmd0aCBpcyAwXHJcbiAgICAgIHJldFZhbCA9IHJldDFcclxuICAgIGVsc2VcclxuICAgICAgcmV0VmFsID0gcmV0MlxyXG4gICAgcmV0VmFsXHJcblxyXG4gIHJldHVyblxyXG5cclxuIiwiIyAjIGNyZWF0ZVVVSURcclxuXHJcbmRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgXHJcbiAgIyMjXHJcbiAgR2VuZXJhdGVzIGEgcmFuZG9tIHN0cmluZyB0aGF0IGNvbXBsaWVzIHRvIHRoZSBSRkMgNDEyMiBzcGVjaWZpY2F0aW9uIGZvciBHVUlEL1VVSUQuXHJcbiAgKGUuZy4gJ0I0MkExNTNGLTFEOUEtNEY5Mi05OTAzLTkyQzExREQ2ODREMicpXHJcbiAgV2hpbGUgbm90IGEgdHJ1ZSBVVUlELCBmb3IgdGhlIHB1cnBvc2VzIG9mIHRoaXMgYXBwbGljYXRpb24sIGl0IHNob3VsZCBiZSBzdWZmaWNpZW50LlxyXG4gICMjI1xyXG4gIGNyZWF0ZUZhdXhVVUlEID0gLT5cclxuICAgIFxyXG4gICAgIyBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmM0MTIyLnR4dFxyXG4gICAgIyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNTAzNC9ob3ctdG8tY3JlYXRlLWEtZ3VpZC11dWlkLWluLWphdmFzY3JpcHRcclxuICAgIHMgPSBbXVxyXG4gICAgcy5sZW5ndGggPSAzNlxyXG4gICAgaGV4RGlnaXRzID0gXCIwMTIzNDU2Nzg5YWJjZGVmXCJcclxuICAgIGkgPSAwXHJcblxyXG4gICAgd2hpbGUgaSA8IDM2XHJcbiAgICAgIHNbaV0gPSBoZXhEaWdpdHMuc3Vic3RyKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDB4MTApLCAxKVxyXG4gICAgICBpICs9IDFcclxuICAgIHNbMTRdID0gXCI0XCIgIyBiaXRzIDEyLTE1IG9mIHRoZSB0aW1lX2hpX2FuZF92ZXJzaW9uIGZpZWxkIHRvIDAwMTBcclxuICAgIHNbMTldID0gaGV4RGlnaXRzLnN1YnN0cigoc1sxOV0gJiAweDMpIHwgMHg4LCAxKSAjIGJpdHMgNi03IG9mIHRoZSBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkIHRvIDAxXHJcbiAgICBzWzhdID0gc1sxM10gPSBzWzE4XSA9IHNbMjNdID0gXCItXCJcclxuICAgIHV1aWQgPSBzLmpvaW4oXCJcIilcclxuICAgIHV1aWRcclxuXHJcbiAgT0oucmVnaXN0ZXIgXCJjcmVhdGVVVUlEXCIsIGNyZWF0ZUZhdXhVVUlEXHJcbiAgcmV0dXJuXHJcblxyXG4iXX0=
