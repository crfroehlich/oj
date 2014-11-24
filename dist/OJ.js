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
  utilLib = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbnRyeXBvaW50LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcYXN5bmNcXGFqYXguY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxhc3luY1xccHJvbWlzZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXGdyaWQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb21wb25lbnRzXFxpbnB1dGdyb3VwLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGFicy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXHRpbGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb250cm9sc1xcaWNvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGRhdGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxmdW5jdGlvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG51bWJlci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG9iamVjdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXHByb3BlcnR5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxcc3RyaW5nLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxjb21wb25lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGNvbnRyb2wuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGRvbS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZWxlbWVudC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZnJhZ21lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGdlbmVyaWNzLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxpbnB1dC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcbm9kZUZhY3RvcnkuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcYS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxici5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxmb3JtLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXG9sLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHNlbGVjdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0YWJsZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0ZXh0YXJlYS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0aGVhZC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx1bC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcYnV0dG9uaW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGNoZWNrYm94LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxjb2xvci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZXRpbWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGRhdGV0aW1lbG9jYWwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGVtYWlsLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxmaWxlLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxoaWRkZW4uY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGltYWdlaW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXG1vbnRoLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxudW1iZXIuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHBhc3N3b3JkLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxyYWRpby5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xccmFuZ2UuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJlc2V0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxzZWFyY2guY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHN1Ym1pdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdGVsLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx0ZXh0aW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHRpbWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHVybC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcd2Vlay5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXG9qLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcb2pJbml0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGFycmF5MkQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcY29uc29sZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxjb29raWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZGVmZXIuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZWFjaC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlbnVtcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlcnJvci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxoaXN0b3J5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGlzLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXG5vdHkuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xccHVic3ViLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHF1ZXJ5U3RyaW5nLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHJhbmdlcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFx0by5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFx1dWlkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE9BQUEsQ0FBUSxhQUFSLENBQUEsQ0FBQTs7QUFBQSxPQUNBLENBQVEsaUJBQVIsQ0FEQSxDQUFBOztBQUFBLE9BRUEsQ0FBUSxxQkFBUixDQUZBLENBQUE7O0FBQUEsT0FHQSxDQUFRLHdCQUFSLENBSEEsQ0FBQTs7QUFBQSxPQUlBLENBQVEsMEJBQVIsQ0FKQSxDQUFBOztBQUFBLE9BS0EsQ0FBUSxnQ0FBUixDQUxBLENBQUE7O0FBQUEsT0FNQSxDQUFRLDBCQUFSLENBTkEsQ0FBQTs7QUFBQSxPQU9BLENBQVEsMEJBQVIsQ0FQQSxDQUFBOztBQUFBLE9BUUEsQ0FBUSx3QkFBUixDQVJBLENBQUE7O0FBQUEsT0FTQSxDQUFRLG9CQUFSLENBVEEsQ0FBQTs7QUFBQSxPQVVBLENBQVEsd0JBQVIsQ0FWQSxDQUFBOztBQUFBLE9BV0EsQ0FBUSxzQkFBUixDQVhBLENBQUE7O0FBQUEsT0FZQSxDQUFRLHNCQUFSLENBWkEsQ0FBQTs7QUFBQSxPQWFBLENBQVEsd0JBQVIsQ0FiQSxDQUFBOztBQUFBLE9BY0EsQ0FBUSxzQkFBUixDQWRBLENBQUE7O0FBQUEsT0FlQSxDQUFRLHdCQUFSLENBZkEsQ0FBQTs7QUFBQSxPQWdCQSxDQUFRLHNCQUFSLENBaEJBLENBQUE7O0FBQUEsT0FpQkEsQ0FBUSxrQkFBUixDQWpCQSxDQUFBOztBQUFBLE9Ba0JBLENBQVEsc0JBQVIsQ0FsQkEsQ0FBQTs7QUFBQSxP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LFNBYk8sRUFjUCxRQWRPLEVBZVAsTUFmTyxFQWdCUCxNQWhCTyxFQWlCUCxVQWpCTyxFQWtCUCxVQWxCTyxFQW1CUCxJQW5CTyxFQW9CUCxLQXBCTyxFQXFCUCxTQXJCTyxFQXNCUCxLQXRCTyxFQXVCUCxLQXZCTyxFQXdCUCxLQXhCTyxFQXlCUCxJQXpCTyxFQTBCUCxJQTFCTyxFQTJCUCxJQTNCTyxFQTRCUCxVQTVCTyxFQTZCUCxZQTdCTyxFQThCUCxRQTlCTyxFQStCUCxNQS9CTyxFQWdDUCxRQWhDTyxFQWlDUCxJQWpDTyxFQWtDUCxJQWxDTyxFQW1DUCxJQW5DTyxFQW9DUCxJQXBDTyxFQXFDUCxJQXJDTyxFQXNDUCxJQXRDTyxFQXVDUCxNQXZDTyxFQXdDUCxRQXhDTyxFQXlDUCxRQXpDTyxFQTBDUCxNQTFDTyxFQTJDUCxHQTNDTyxFQTRDUCxRQTVDTyxFQTZDUCxLQTdDTyxFQThDUCxLQTlDTyxFQStDUCxPQS9DTyxFQWdEUCxRQWhETyxFQWlEUCxJQWpETyxFQWtEUCxLQWxETyxFQW1EUCxNQW5ETyxFQW9EUCxNQXBETyxFQXFEUCxPQXJETyxFQXNEUCxLQXRETyxFQXVEUCxVQXZETyxFQXdEUCxVQXhETyxFQXlEUCxRQXpETyxFQTBEUCxVQTFETyxFQTJEUCxRQTNETyxFQTREUCxRQTVETyxFQTZEUCxHQTdETyxFQThEUCxLQTlETyxFQStEUCxVQS9ETyxFQWdFUCxHQWhFTyxFQWlFUCxJQWpFTyxFQWtFUCxJQWxFTyxFQW1FUCxNQW5FTyxFQW9FUCxHQXBFTyxFQXFFUCxNQXJFTyxFQXNFUCxTQXRFTyxFQXVFUCxPQXZFTyxFQXdFUCxNQXhFTyxFQXlFUCxRQXpFTyxFQTBFUCxRQTFFTyxFQTJFUCxPQTNFTyxFQTRFUCxLQTVFTyxFQTZFUCxTQTdFTyxFQThFUCxLQTlFTyxFQStFUCxPQS9FTyxFQWdGUCxJQWhGTyxFQWlGUCxPQWpGTyxFQWtGUCxJQWxGTyxFQW1GUCxNQW5GTyxFQW9GUCxPQXBGTyxFQXFGUCxJQXJGTyxFQXNGUCxJQXRGTyxFQXVGUCxHQXZGTyxFQXdGUCxLQXhG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RUFBSSxFQUFKO0FBQUEsTUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLE1BRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxNQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsTUFJQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsSUFEVDtPQUxGO0FBQUEsTUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLE1BU0EsV0FBQSxFQUFhLElBVGI7S0FwTEY7QUFBQSxJQStMQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsTUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLE1BRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxNQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsTUFJQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsSUFEVDtPQUxGO0FBQUEsTUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLE1BU0EsV0FBQSxFQUFhLElBVGI7S0FoTUY7QUFBQSxJQTJNQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsTUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLE1BRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxNQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsTUFJQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsUUFDQSxPQUFBLEVBQVMsSUFEVDtPQUxGO0FBQUEsTUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLE1BU0EsV0FBQSxFQUFhLElBVGI7S0E1TUY7QUFBQSxJQXVOQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsTUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLE1BRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxNQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsTUFJQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsUUFDQSxPQUFB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QUEsQ0FBSCxDQUFTLENBQUksTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdEMsR0FBa0QsTUFBbEQsR0FBOEQsQ0FBSSxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUF0QixHQUF1QyxNQUF2QyxHQUFtRCxJQUFwRCxDQUEvRCxDQUF5SCxDQUFDLEVBQW5JLENBQUEsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlICcuL29qLmNvZmZlZSdcbnJlcXVpcmUgJy4vb2pJbml0LmNvZmZlZSdcbnJlcXVpcmUgJy4vYXN5bmMvYWpheC5jb2ZmZWUnXG5yZXF1aXJlICcuL2FzeW5jL3Byb21pc2UuY29mZmVlJ1xucmVxdWlyZSAnLi9jb21wb25lbnRzL2dyaWQuY29mZmVlJ1xucmVxdWlyZSAnLi9jb21wb25lbnRzL2lucHV0Z3JvdXAuY29mZmVlJ1xucmVxdWlyZSAnLi9jb21wb25lbnRzL3RhYnMuY29mZmVlJ1xucmVxdWlyZSAnLi9jb21wb25lbnRzL3RpbGUuY29mZmVlJ1xucmVxdWlyZSAnLi9jb250cm9scy9pY29uLmNvZmZlZSdcbnJlcXVpcmUgJy4vY29yZS9kYXRlLmNvZmZlZSdcbnJlcXVpcmUgJy4vY29yZS9mdW5jdGlvbi5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvcmUvbnVtYmVyLmNvZmZlZSdcbnJlcXVpcmUgJy4vY29yZS9vYmplY3QuY29mZmVlJ1xucmVxdWlyZSAnLi9jb3JlL3Byb3BlcnR5LmNvZmZlZSdcbnJlcXVpcmUgJy4vY29yZS9zdHJpbmcuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vY29tcG9uZW50LmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2NvbnRyb2wuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vZG9tLmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2VsZW1lbnQuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vZnJhZ21lbnQuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vZ2VuZXJpY3MuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vaW5wdXQuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vbm9kZUZhY3RvcnkuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy9hLmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvYnIuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy9mb3JtLmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvaW5wdXQuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy9vbC5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL3NlbGVjdC5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RhYmxlLmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvdGV4dGFyZWEuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy90aGVhZC5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL3VsLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2J1dHRvbmlucHV0LmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2NoZWNrYm94LmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2NvbG9yLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2RhdGUuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZXRpbWUuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZXRpbWVsb2NhbC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9lbWFpbC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9maWxlLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2hpZGRlbi5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9pbWFnZWlucHV0LmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL21vbnRoLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL251bWJlci5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9wYXNzd29yZC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9yYWRpby5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9yYW5nZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9yZXNldC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9zZWFyY2guY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvc3VibWl0LmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3RlbC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy90ZXh0aW5wdXQuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvdGltZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy91cmwuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvd2Vlay5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2FycmF5MkQuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9jb25zb2xlLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvY29va2llLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvZGVmZXIuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9lYWNoLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvZW51bXMuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9lcnJvci5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2hpc3RvcnkuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9pcy5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL25vdHkuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9wdWJzdWIuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9xdWVyeVN0cmluZy5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL3Jhbmdlcy5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL3RvLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvdXVpZC5jb2ZmZWUnXG4iLCIjICMgYWpheFxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuXHJcbiAgY29uZmlnID0ge31cclxuICBcclxuICAjIGRlZmluZSBhIHN0YW5kYXJkIG9uIHN1Y2Nlc3MgaGFuZGxlciwgd3JpdGUgb3V0IHRoZSByZXF1ZXN0IHN0YXRzIHRvIGEgdGFibGVcclxuICBjb25maWcub25TdWNjZXNzID0gKG9wdHMsIGRhdGEsIHVybCkgLT5cclxuICAgIHJlc3BvbnNlID0ge31cclxuICAgIE9KLmV4dGVuZCByZXNwb25zZSwgZGF0YVxyXG4gICAgb3B0cy5vblN1Y2Nlc3MgcmVzcG9uc2VcclxuICAgIGlmIE9KLkxPR19BTExfQUpBWFxyXG4gICAgICBPSi5jb25zb2xlLnRhYmxlIFtcclxuICAgICAgICBXZWJzZXJ2aWNlOiBvcHRzLmFqYXhPcHRzLnVybFxyXG4gICAgICAgIFN0YXJ0VGltZTogb3B0cy5zdGFydFRpbWVcclxuICAgICAgICBFbmRUaW1lOiBuZXcgRGF0ZSgpXHJcbiAgICAgIF0gXHJcbiAgICByZXR1cm5cclxuICBcclxuICAjIGRlZmluZSBhIHN0YW5kYXJkIG9uIGVycm9yIGhhbmRsZXIsIHdyaXRlIG91dCB0aGUgcmVxdWVzdCBlcnJvciBjb25leHQgdG8gYSB0YWJsZVxyXG4gIGNvbmZpZy5vbkVycm9yID0gKHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzLCBwYXJhbTEsIG9wdHMgPSBPSi5vYmplY3QoKSkgLT5cclxuICAgIGlmIHRleHRTdGF0dXMgaXNudCAnYWJvcnQnXHJcbiAgICAgIGlmIE9KLkxPR19BTExfQUpBWF9FUlJPUlNcclxuICAgICAgICBPSi5jb25zb2xlLnRhYmxlIFtcclxuICAgICAgICAgIFdlYnNlcnZpY2U6IG9wdHMuYWpheE9wdHMudXJsXHJcbiAgICAgICAgICBEYXRhOiBvcHRzLmFqYXhPcHRzLmRhdGFcclxuICAgICAgICAgIEZhaWxlZDogdGV4dFN0YXR1c1xyXG4gICAgICAgICAgU3RhdGU6IHhtbEh0dHBSZXF1ZXN0LnN0YXRlKClcclxuICAgICAgICAgIFN0YXR1czogeG1sSHR0cFJlcXVlc3Quc3RhdHVzXHJcbiAgICAgICAgICBTdGF0dXNUZXh0OiB4bWxIdHRwUmVxdWVzdC5zdGF0dXNUZXh0XHJcbiAgICAgICAgICBSZWFkeVN0YXRlOiB4bWxIdHRwUmVxdWVzdC5yZWFkeVN0YXRlXHJcbiAgICAgICAgICBSZXNwb25zZVRleHQ6IHhtbEh0dHBSZXF1ZXN0LnJlc3BvbnNlVGV4dFxyXG4gICAgICAgIF1cclxuXHJcbiAgICAgIG9wdHMub25FcnJvciB0ZXh0U3RhdHVzXHJcbiAgICByZXR1cm5cclxuICBcclxuICAjIGluIHRoZSBjYXNlIHdoZXJlIGBvcHRzYCBpcyBhIHN0cmluZywgY29udmVydCBpdCB0byBhbiBvYmplY3RcclxuICBvcHRzRnJvbVVybCA9IChvcHRzKSAtPlxyXG4gICAgaWYgT0ouaXMuc3RyaW5nIG9wdHNcclxuICAgICAgdXJsID0gb3B0c1xyXG4gICAgICBvcHRzID0gT0oub2JqZWN0KClcclxuICAgICAgb3B0cy5hZGQgJ2FqYXhPcHRzJywgT0oub2JqZWN0KClcclxuICAgICAgb3B0cy5hamF4T3B0cy5hZGQgJ3VybCcsIHVybFxyXG4gICAgb3B0c1xyXG4gIFxyXG4gICMgZGVmaW5lIGEgc3RhbmRhcmQgYGV4ZWNgIG1ldGhvZCB0byBoYW5kbGUgYWxsIHJlcXVlc3QgdmVyYnMuIFVzZXMgdGhlIFtqUXVlcnkuYWpheF0oaHR0cDovL2FwaS5qcXVlcnkuY29tL2NhdGVnb3J5L2FqYXgvKSBBUEkuXHJcbiAgIyBgZXhlY1JlcXVlc3RgIHJldHVybnMgYSBwcm9taXNlIHJlcHJlc2VudCB0aGUgYWN0dWFsIEFKQVggY2FsbC5cclxuICBcclxuICAjIC0gYHZlcmJgIGRlZmF1bHQgdmFsdWUgPSAnR0VUJ1xyXG4gICMgLSBgb3B0c2Agb2JqZWN0XHJcbiAgIyAtLSBgb3B0cy5hamF4T3B0c2Agb2JqZWN0IGZvciBhbGwgalF1ZXJ5J3MgYWpheC1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCA9ICh2ZXJiID0gJ0dFVCcsIG9wdHMpIC0+XHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIGFqYXhPcHRzOlxyXG4gICAgICAgIHVybDogJydcclxuICAgICAgICBkYXRhOiB7fVxyXG4gICAgICAgIHR5cGU6IHZlcmJcclxuICAgICAgICB4aHJGaWVsZHM6XHJcbiAgICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nXHJcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG4gICAgICAgIFxyXG4gICAgICBvblN1Y2Nlc3M6IE9KLm5vb3BcclxuICAgICAgb25FcnJvcjogT0oubm9vcFxyXG4gICAgICBvbkNvbXBsZXRlOiBPSi5ub29wXHJcbiAgICAgIG92ZXJyaWRlRXJyb3I6IGZhbHNlXHJcbiAgICAgIHdhdGNoR2xvYmFsOiB0cnVlXHJcbiAgICAgIHVzZUNhY2hlOiBmYWxzZVxyXG4gICAgXHJcbiAgICBvcHRzID0gb3B0c0Zyb21Vcmwgb3B0c1xyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRzLCB0cnVlXHJcbiAgICBcclxuICAgIGRlZmF1bHRzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKClcclxuICAgIFxyXG4gICAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgICAjIEdFVCByZXF1ZXN0cyBleHBlY3QgcXVlcnlTdHJpbmcgcGFyYW1ldGVyc1xyXG4gICAgICBpZiBkZWZhdWx0cy5hamF4T3B0cy52ZXJiIGlzICdHRVQnXHJcbiAgICAgICAgZGVmYXVsdHMuYWpheE9wdHMuZGF0YSA9IE9KLnBhcmFtcyBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXHJcbiAgICAgICMgYWxsIG90aGVyIHJlcXVlc3RzIHRha2UgYW4gb2JqZWN0XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBkZWZhdWx0cy5hamF4T3B0cy5kYXRhID0gT0ouc2VyaWFsaXplIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcclxuICAgIFxyXG4gICAgZ2V0SlF1ZXJ5RGVmZXJyZWQgPSAod2F0Y2hHbG9iYWwpIC0+XHJcbiAgICAgIHJldCA9ICQuYWpheCBkZWZhdWx0cy5hamF4T3B0c1xyXG4gICAgICBcclxuICAgICAgcmV0LmRvbmUgKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSAtPlxyXG4gICAgICAgIGNvbmZpZy5vblN1Y2Nlc3MgZGVmYXVsdHMsIGRhdGFcclxuXHJcbiAgICAgIHJldC5mYWlsIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUZXh0KSAtPlxyXG4gICAgICAgIGNvbmZpZy5vbkVycm9yIGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRleHQsIGRlZmF1bHRzXHJcbiAgXHJcbiAgICAgIHJldC5hbHdheXMgKHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzKSAtPlxyXG4gICAgICAgIGRlZmF1bHRzLm9uQ29tcGxldGUgeG1sSHR0cFJlcXVlc3QsIHRleHRTdGF0dXNcclxuXHJcbiAgICAgIE9KLmFzeW5jLmFqYXhQcm9taXNlIHJldFxyXG5cclxuICAgIHByb21pc2UgPSBnZXRKUXVlcnlEZWZlcnJlZChkZWZhdWx0cy53YXRjaEdsb2JhbClcclxuICAgIHByb21pc2VcclxuICBcclxuICBhamF4ID0ge31cclxuICBcclxuICAjICMjIHBvc3RcclxuICAjIFtPSl0ob2ouaHRtbCkuYWpheC5wb3N0OiBpbnNlcnQgYSBuZXcgb2JqZWN0IG9yIGluaXQgYSBmb3JtIHBvc3RcclxuICBcclxuICAjIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4gICMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC4gXHJcbiAgYWpheC5wb3N0ID0gKG9wdHMpIC0+XHJcbiAgICBjb25maWcuZXhlY1JlcXVlc3QgJ1BPU1QnLCBvcHRzXHJcbiAgXHJcbiAgIyAjIyBnZXRcclxuICAjIFtPSl0ob2ouaHRtbCkuYWpheC5nZXQ6IGdldCBhbiBleGlzdGluZyBvYmplY3RcclxuICBcclxuICAjIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4gICMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuICAjXHJcbiAgYWpheC5nZXQgPSAob3B0cykgLT5cclxuICAgIGNvbmZpZy5leGVjUmVxdWVzdCAnR0VUJywgb3B0c1xyXG5cclxuICAjICMjIGRlbGV0ZVxyXG4gICMgW09KXShvai5odG1sKS5hamF4LmRlbGV0ZTogZGVsZXRlIGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4gICMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiAgIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxyXG4gIGFqYXguZGVsZXRlID0gKG9wdHMpIC0+XHJcbiAgICBjb25maWcuZXhlY1JlcXVlc3QgJ0RFTEVURScsIG9wdHNcclxuXHJcbiAgIyAjIyBwdXRcclxuICAjIFtPSl0ob2ouaHRtbCkuYWpheC5wdXQ6IHVwZGF0ZSBhbiBleGlzdGluZyBvYmplY3RcclxuICBcclxuICAjIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4gICMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuICBhamF4LnB1dCA9IChvcHRzKSAtPlxyXG4gICAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdQVVQnLCBvcHRzXHJcblxyXG4gIE9KLmFzeW5jLnJlZ2lzdGVyICdhamF4JywgYWpheFxyXG5cclxuICByZXR1cm5cclxuICBcclxuXHJcbiIsIiMgIyBwcm9taXNlXHJcblxyXG5kbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG5cclxuICAjICMjIGFqYXhQcm9taXNlXHJcbiAgIyBbT0pdKG9qLmh0bWwpLmFzeW5jLmFqYXhQcm9taXNlIGNvbnZlcnRzIGFuIEFKQVggWG1sSHR0cFJlcXVlc3QgaW50byBhIFByb21pc2UuIFxyXG4gICMgU2VlIGFsc28gW1Byb21pc2UucmVzb2x2ZV0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG4gIE9KLmFzeW5jLnJlZ2lzdGVyICdhamF4UHJvbWlzZScsIChhamF4KSAtPiBcclxuICAgIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUgYWpheFxyXG4gICAgcHJvbWlzZS5hYm9ydCA9IGFqYXguYWJvcnRcclxuICAgIHByb21pc2UucmVhZHlTdGF0ZSA9IGFqYXgucmVhZHlTdGF0ZVxyXG4gICAgcHJvbWlzZVxyXG5cclxuICAjICMjIGFsbFxyXG4gICMgW09KXShvai5odG1sKS5hc3luYy5hbGwgdGFrZXMgYW4gYXJyYXkgb2YgZnVuY3Rpb25zIGFuZCByZXR1cm5zIGEgcHJvbWlzZSByZXByZXNlbnRpbmcgdGhlIHN1Y2Nlc3Mgb2YgYWxsIG1ldGhvZHMgb3IgdGhlIGZhaWx1cmUgb2YgYW55IG1ldGhvZC5cclxuICAjIFNlZSBhbHNvIFtQcm9taXNlLmFsbF0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG4gIE9KLmFzeW5jLnJlZ2lzdGVyICdhbGwnLCAoaW5pdEFycmF5KSAtPlxyXG4gICAgcmVxcyA9IGluaXRBcnJheSBvciBbXVxyXG4gICAgcHJvbWlzZSA9IFByb21pc2UuYWxsKHJlcXMpXHJcbiAgICBwcm9taXNlLnB1c2ggPSAoaXRlbSkgLT5cclxuICAgICAgcmVxcy5wdXNoIGl0ZW1cclxuICAgICAgcmV0dXJuXHJcbiAgICBwcm9taXNlXHJcblxyXG4gICMgIyMgZGVmZXJcclxuICAjIFtPSl0ob2ouaHRtbCkuYXN5bmMuZGVmZXIgY29udmVydHMgYSBmdW5jdGlvbiBpbnRvIGEgUHJvbWlzZSB0byBleGVjdXRlIHRoYXQgZnVuY3Rpb24uIFxyXG4gICMgU2VlIGFsc28gW1Byb21pc2UubWV0aG9kXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbiAgT0ouYXN5bmMucmVnaXN0ZXIgJ2RlZmVyJywgKGZ1bmMgPSBPSi5ub29wKSAtPlxyXG4gICAgcmV0ID0gUHJvbWlzZS5tZXRob2QgZnVuY1xyXG4gICAgcmV0XHJcbiAgXHJcbiAgXHJcbiAgcmV0dXJuXHJcbiAgXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIG5vZGVOYW1lID0gJ3gtZ3JpZCdcclxuICBjbGFzc05hbWUgPSAnZ3JpZCdcclxuICBcclxuICBPSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXHJcbiAgT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIChvcHRpb25zLCBvd25lcikgLT5cclxuICAgIGRlZmF1bHRzID0gXHJcbiAgICAgIHRpbGVTaXplczpcclxuICAgICAgICBzbWFsbFNwYW46ICcnXHJcbiAgICAgICAgbWVkaXVtU3BhbjogJydcclxuICAgICAgICBsYXJnZVNwYW46ICcnXHJcbiAgICAgIHByb3BzOiBcclxuICAgICAgICBjbGFzczogJ2dyaWQnXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgcmV0ID0gT0ouY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWUgXHJcbiAgICBcclxuICAgIHJvd3MgPSBbXVxyXG4gICAgdGlsZXMgPSBPSi5hcnJheTJEKClcclxuICAgIFxyXG4gICAgZmlsbE1pc3NpbmcgPSAoKSAtPlxyXG4gICAgICB0aWxlcy5lYWNoIChyb3dObywgY29sTm8sIHZhbCkgLT5cclxuICAgICAgICBpZiBub3QgdmFsXHJcbiAgICAgICAgICByb3cgPSByZXQucm93IHJvd05vXHJcbiAgICAgICAgICByb3cubWFrZSAndGlsZScsIGNvbE5vLCB7fSBcclxuICAgIFxyXG4gICAgcmV0LmFkZCAncm93JywgKHJvd05vID0gcm93cy5sZW5ndGgtMSBvciAxKS0+ICBcclxuICAgICAgbnVSb3cgPSByb3dzW3Jvd05vLTFdXHJcbiAgICAgIGlmIG5vdCBudVJvd1xyXG4gICAgICAgIHdoaWxlIHJvd3MubGVuZ3RoIDwgcm93Tm9cclxuICAgICAgICAgIG51Um93ID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ3JvdydcclxuICAgICAgICAgIHJvd3MucHVzaCBudVJvd1xyXG4gICAgICAgIG51Um93LmFkZCAndGlsZScsIChjb2xObywgb3B0cykgLT5cclxuICAgICAgICAgIG9wdHMgPSBPSi5leHRlbmQgKE9KLmV4dGVuZCB7fSwgZGVmYXVsdHMudGlsZVNpemVzKSwgb3B0c1xyXG4gICAgICAgICAgbnVUaWxlID0gT0ouY29tcG9uZW50cy50aWxlIG9wdHMsIG51Um93XHJcbiAgICAgICAgICB0aWxlcy5zZXQgcm93Tm8sIGNvbE5vLCBudVRpbGVcclxuICAgICAgICAgIG51VGlsZVxyXG4gICAgICBudVJvdyAgXHJcbiAgICAgICAgICAgICAgICAgICAgICBcclxuICAgIHJldC5hZGQgJ3RpbGUnLCAocm93Tm8sIGNvbE5vLCBvcHRzKSAtPlxyXG4gICAgICBpZiBub3Qgcm93Tm8gb3Igcm93Tm8gPCAxIHRoZW4gcm93Tm8gPSAxXHJcbiAgICAgIGlmIG5vdCBjb2xObyBvciBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcclxuICAgICAgXHJcbiAgICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cclxuICAgICAgdGlsZSA9IHRpbGVzLmdldCByb3dObywgY29sTm9cclxuICAgICAgXHJcbiAgICAgIGlmIG5vdCB0aWxlXHJcbiAgICAgICAgaSA9IDBcclxuICAgICAgICB3aGlsZSBpIDwgY29sTm9cclxuICAgICAgICAgIGkgKz0gMVxyXG4gICAgICAgICAgdHJ5VGlsZSA9IHRpbGVzLmdldCByb3dObywgaVxyXG4gICAgICAgICAgaWYgbm90IHRyeVRpbGVcclxuICAgICAgICAgICAgaWYgaSBpcyBjb2xOb1xyXG4gICAgICAgICAgICAgIHRpbGUgPSByb3cubWFrZSAndGlsZScsIG9wdHNcclxuICAgICAgICAgICAgZWxzZSBpZiBub3QgdGlsZVxyXG4gICAgICAgICAgICAgIHJvdy5tYWtlICd0aWxlJ1xyXG4gICAgICAgICAgXHJcbiAgICAgIGZpbGxNaXNzaW5nKClcclxuICAgICAgdGlsZSAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgbm9kZU5hbWUgPSAneC1pbnB1dC1ncm91cCdcclxuICBjbGFzc05hbWUgPSAnaW5wdXRncm91cCdcclxuICBcclxuICBPSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXHJcbiAgXHJcbiAgT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIChvcHRpb25zLCBvd25lcikgLT5cclxuICAgIGZvcklkID0gT0ouY3JlYXRlVVVJRCgpXHJcbiAgICBkZWZhdWx0cyA9IFxyXG4gICAgICBwcm9wczpcclxuICAgICAgICBjbGFzczogJ2Zvcm0tZ3JvdXAnXHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjaGFuZ2U6IE9KLm5vb3BcclxuICAgICAgZm9yOiBmb3JJZFxyXG4gICAgICBsYWJlbFRleHQ6ICcnXHJcbiAgICAgIGlucHV0T3B0czpcclxuICAgICAgICBwcm9wczpcclxuICAgICAgICAgIGlkOiBmb3JJZFxyXG4gICAgICAgICAgdHlwZTogJ3RleHQnXHJcbiAgICAgICAgICBjbGFzczogJydcclxuICAgICAgICAgIHBsYWNlaG9sZGVyOiAnJ1xyXG4gICAgICAgICAgdmFsdWU6ICcnXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgcmV0ID0gT0ouY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWUgXHJcbiAgICBcclxuICAgIGNtcG50ID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ2Zvcm0tZ3JvdXAnXHJcbiAgICBcclxuICAgIHJldC5ncm91cExhYmVsID0gY21wbnQubWFrZSAnbGFiZWwnLCBwcm9wczogeyBmb3I6IGZvcklkIH0sIHRleHQ6IGRlZmF1bHRzLmxhYmVsVGV4dFxyXG4gICAgXHJcbiAgICBkZWZhdWx0cy5pbnB1dE9wdHMucHJvcHMuY2xhc3MgKz0gJyBmb3JtLWNvbnRyb2wnXHJcbiAgICByZXQuZ3JvdXBJbnB1dCA9IGNtcG50Lm1ha2UgJ2lucHV0JywgZGVmYXVsdHMuaW5wdXRPcHRzXHJcbiAgICBcclxuICAgIHJldC5ncm91cFZhbHVlID0gKCkgLT5cclxuICAgICAgcmV0Lmdyb3VwSW5wdXQudmFsKClcclxuICAgICAgXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIG5vZGVOYW1lID0gJ3gtdGFicydcclxuICBjbGFzc05hbWUgPSAndGFicydcclxuICBcclxuICBPSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXHJcbiAgXHJcbiAgT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIChvcHRpb25zLCBvd25lcikgLT5cclxuICAgIGRlZmF1bHRzID0gXHJcbiAgICAgIHRhYnM6IHt9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIGNsYXNzOiAnJ1xyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIHJldCA9IE9KLmNvbXBvbmVudCBkZWZhdWx0cywgb3duZXIsIG5vZGVOYW1lIFxyXG4gICAgXHJcbiAgICB0YWJzID0gcmV0Lm1ha2UgJ3VsJywgcHJvcHM6IGNsYXNzOiAnbmF2IG5hdi10YWJzJ1xyXG4gICAgY29udGVudCA9IHJldC5tYWtlICdkaXYnLCBwcm9wczogY2xhc3M6ICd0YWItY29udGVudCdcclxuICAgIFxyXG4gICAgZmlyc3QgPSB0cnVlXHJcbiAgICBPSi5lYWNoIGRlZmF1bHRzLnRhYnMsICh0YWJWYWwsIHRhYk5hbWUpIC0+XHJcbiAgICAgIHRhYkNsYXNzID0gJydcclxuICAgICAgaWYgZmlyc3RcclxuICAgICAgICBmaXJzdCA9IGZhbHNlXHJcbiAgICAgICAgdGFiQ2xhc3MgPSAnYWN0aXZlJ1xyXG4gICAgICBhID0gdGFicy5tYWtlICdsaScsIHByb3BzOiBjbGFzczogdGFiQ2xhc3NcclxuICAgICAgICAubWFrZSgnYScsIFxyXG4gICAgICAgICAgdGV4dDogdGFiTmFtZVxyXG4gICAgICAgICAgcHJvcHM6IFxyXG4gICAgICAgICAgICBocmVmOiAnIycgKyB0YWJOYW1lXHJcbiAgICAgICAgICAgICdkYXRhLXRvZ2dsZSc6ICd0YWInXHJcbiAgICAgICAgICBldmVudHM6XHJcbiAgICAgICAgICAgIGNsaWNrOiAtPlxyXG4gICAgICAgICAgICAgIGEuJC50YWIgJ3Nob3cnKVxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICB0YWJDb250ZW50Q2xhc3MgPSAndGFiLXBhbmUgJyArIHRhYkNsYXNzXHJcbiAgICAgIHJldC5hZGQgdGFiTmFtZSwgY29udGVudC5tYWtlKCdkaXYnLCBwcm9wczogY2xhc3M6IHRhYkNvbnRlbnRDbGFzcywgaWQ6IHRhYk5hbWUpXHJcbiAgICAgIFxyXG4gICAgICByZXR1cm5cclxuICAgIFxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBub2RlTmFtZSA9ICd4LXRpbGUnXHJcbiAgY2xhc3NOYW1lID0gJ3RpbGUnXHJcbiAgXHJcbiAgT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxyXG4gIE9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCAob3B0aW9ucywgb3duZXIpIC0+XHJcbiAgICBkZWZhdWx0cyA9IFxyXG4gICAgICB3aWR0aDogXHJcbiAgICAgICAgeHM6ICcnXHJcbiAgICAgICAgc206ICcnXHJcbiAgICAgICAgbWQ6ICcnXHJcbiAgICAgICAgbGc6ICcnXHJcbiAgICAgIHByb3BzOiBcclxuICAgICAgICBjbGFzczogJ3RpbGUnXHJcbiAgICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBpZiBkZWZhdWx0cy53aWR0aC54cyB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLXhzLScgKyBkZWZhdWx0cy53aWR0aC54c1xyXG4gICAgaWYgZGVmYXVsdHMud2lkdGguc20gdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1zbS0nICsgZGVmYXVsdHMud2lkdGguc21cclxuICAgIGlmIGRlZmF1bHRzLndpZHRoLm1kIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wtbWQtJyArIGRlZmF1bHRzLndpZHRoLm1kXHJcbiAgICBpZiBkZWZhdWx0cy53aWR0aC5sZyB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLWxnLScgKyBkZWZhdWx0cy53aWR0aC5sZ1xyXG4gICAgXHJcbiAgICByZXQgPSBPSi5jb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZSBcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgY29udHJvbE5hbWUgPSAneS1pY29uJ1xyXG4gIGZyaWVuZGx5TmFtZSA9ICdpY29uJ1xyXG4gIFxyXG4gIE9KLmNvbnRyb2xzLm1lbWJlcnNbZnJpZW5kbHlOYW1lXSA9IGNvbnRyb2xOYW1lXHJcbiAgXHJcbiAgT0ouY29udHJvbHMucmVnaXN0ZXIgZnJpZW5kbHlOYW1lLCAob3B0aW9ucywgb3duZXIpIC0+XHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIGljb25PcHRzOlxyXG4gICAgICAgIG5hbWU6ICcnXHJcbiAgICAgICAgc3RhY2tlZEljb246ICcnXHJcbiAgICAgICAgc3dhcEljb246ICcnXHJcbiAgICAgICAgc2l6ZTogZmFsc2VcclxuICAgICAgICBjb2xvcjogJydcclxuICAgICAgICBsaWJyYXJ5OiAnJ1xyXG4gICAgICAgIGlzRml4ZWRXaWR0aDogZmFsc2VcclxuICAgICAgICBpc0xpc3Q6IGZhbHNlXHJcbiAgICAgICAgaXNTcGlubmVyOiBmYWxzZVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICBjbGFzczogJydcclxuICAgICAgcm9vdE5vZGVUeXBlOiAnc3BhbidcclxuICAgICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnNcclxuICAgIHJldCA9IE9KLmNvbnRyb2wgZGVmYXVsdHMsIG93bmVyLCBjb250cm9sTmFtZVxyXG4gICAgXHJcbiAgICBpc1RvZ2dsZWQgPSBmYWxzZVxyXG4gICAgXHJcbiAgICAjVE9ETzogU3VwcG9ydCBmb3IgcGljdG9pY29uc1xyXG4gICAgI1RPRE86IFN1cHBvcnQgZm9yIG90aGVyIEZvbnRBd2Vzb21lIHByb3BlcnRpZXMgKHN0YWNrLCByb3RhdGUsIHNpemUsIGV0YylcclxuICAgIFxyXG4gICAgY2xhc3NOYW1lQmFzZSA9ICdmYSAnXHJcbiAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc0ZpeGVkV2lkdGggdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1mdyAnXHJcbiAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc0xpc3QgdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1saSAnXHJcbiAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc1NwaW5uZXIgdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1zcGluICdcclxuICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLnNpemUgIFxyXG4gICAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zaXplID4gMSBhbmQgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSA8PSA1XHJcbiAgICAgICAgY2xhc3NOYW1lQmFzZSArPSAnZmEtJyArIGRlZmF1bHRzLmljb25PcHRzLnNpemUgKyAneCAnXHJcbiAgICAgIFxyXG4gICAgY2xhc3NOYW1lID0gY2xhc3NOYW1lQmFzZSArICdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMubmFtZVxyXG4gICAgcmV0Lm15SWNvbiA9IHJldC5tYWtlICdpJywgcHJvcHM6IGNsYXNzOiBjbGFzc05hbWVcclxuXHJcbiAgICAjVG9nZ2xlcyBkaXNwbGF5IGJldHdlZW4gbm9ybWFsIGljb24gYW5kIHN3YXAgaWNvbiwgaWYgYSBzd2FwIGljb24gaGFzIGJlZW4gc3BlY2lmaWVkXHJcbiAgICByZXQudG9nZ2xlSWNvbiA9IC0+XHJcbiAgICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uXHJcbiAgICAgICAgbmV3SWNvbiA9IGRlZmF1bHRzLmljb25PcHRzLm5hbWVcclxuICAgICAgICBcclxuICAgICAgICBpc1RvZ2dsZWQgPSAhaXNUb2dnbGVkXHJcbiAgICAgIFxyXG4gICAgICAgIGlmIGlzVG9nZ2xlZFxyXG4gICAgICAgICAgcmV0Lm15SWNvbi4kLnJlbW92ZUNsYXNzKCdmYS0nICsgbmV3SWNvbilcclxuICAgICAgICAgIG5ld0ljb24gPSBkZWZhdWx0cy5pY29uT3B0cy5zd2FwSWNvblxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHJldC5teUljb24uJC5yZW1vdmVDbGFzcygnZmEtJyArIGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uKVxyXG4gICAgICAgICAgXHJcbiAgICAgICAgcmV0Lm15SWNvbi4kLmFkZENsYXNzKCdmYS0nICsgbmV3SWNvbilcclxuXHJcbiAgICAgIFxyXG4gICAgcmV0IiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBPSi5yZWdpc3RlciBcImdldERhdGVGcm9tRG5Kc29uXCIsIChkbkRhdGUpIC0+XHJcbiAgICBcclxuICAgICMgVHJhbnNmb3JtcyBhIC5ORVQgSlNPTiBkYXRlIGludG8gYSBKYXZhU2NyaXB0IGRhdGUuXHJcbiAgICAjIG5hbWU9XCJvYmpcIiAgT2JqZWN0IHRvIHRlc3RcclxuICAgICMgdHlwZT1cIkJvb2xlYW5cIiAvPlxyXG4gICAgI1xyXG4gICAgIyAgICAgICB2YXIgbWlsbGkgPSBPSi50by5udW1iZXIoRG5EYXRlLnJlcGxhY2UoL1xcL0RhdGVcXCgoXFxkKylcXC0/KFxcZCspXFwpXFwvLywgJyQxJykpO1xyXG4gICAgIyAgICAgICB2YXIgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKERuRGF0ZS5yZXBsYWNlKC9cXC9EYXRlXFwoXFxkKyhbXFwrXFwtXT9cXGQrKVxcKVxcLy8sICckMScpKTtcclxuICAgICMgICAgICAgdmFyIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpO1xyXG4gICAgIyAgICAgICByZXR1cm4gbmV3IERhdGUoKG1pbGxpIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKTtcclxuICAgICMgICAgICAgXHJcbiAgICBcclxuICAgICMgRG4gRGF0ZSB3aWxsIGxvb2sgbGlrZSAvRGF0ZSgxMzM1NzU4NDAwMDAwLTA0MDApLyAgXHJcbiAgICBkbkRhdGVTdHIgPSBPSi50by5zdHJpbmcoZG5EYXRlKVxyXG4gICAgcmV0ID0gdW5kZWZpbmVkXHJcbiAgICB0aWNrcyA9IHVuZGVmaW5lZFxyXG4gICAgb2Zmc2V0ID0gdW5kZWZpbmVkXHJcbiAgICBsb2NhbE9mZnNldCA9IHVuZGVmaW5lZFxyXG4gICAgYXJyID0gdW5kZWZpbmVkXHJcbiAgICByZXQgPSBPSi5kYXRlVGltZU1pblZhbHVlXHJcbiAgICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eShkbkRhdGVTdHIpXHJcbiAgICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKFwiL1wiLCBcIlwiKVxyXG4gICAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZShcIkRhdGVcIiwgXCJcIilcclxuICAgICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoXCIoXCIsIFwiXCIpXHJcbiAgICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKFwiKVwiLCBcIlwiKVxyXG4gICAgICBhcnIgPSBkbkRhdGVTdHIuc3BsaXQoXCItXCIpXHJcbiAgICAgIGlmIGFyci5sZW5ndGggPiAxXHJcbiAgICAgICAgdGlja3MgPSBPSi50by5udW1iZXIoYXJyWzBdKVxyXG4gICAgICAgIG9mZnNldCA9IE9KLnRvLm51bWJlcihhcnJbMV0pXHJcbiAgICAgICAgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KClcclxuICAgICAgICByZXQgPSBuZXcgRGF0ZSgodGlja3MgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpXHJcbiAgICAgIGVsc2UgaWYgYXJyLmxlbmd0aCBpcyAxXHJcbiAgICAgICAgdGlja3MgPSBPSi50by5udW1iZXIoYXJyWzBdKVxyXG4gICAgICAgIHJldCA9IG5ldyBEYXRlKHRpY2tzKVxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG5cclxuICAjIFdyYXAgdGhlIGV4ZWN1dGlvbiBvZiBhIG1ldGhvZCBpbiBhIHRyeS4uY2F0Y2guLmZpbmFsbHkgICAgIFxyXG4gICMgaWdub3JlIGVycm9ycyBmYWlsaW5nIHRvIGV4ZWMgc2VsZi1leGVjdXRpbmcgZnVuY3Rpb25zIFxyXG4gICMgUmV0dXJuIGEgbWV0aG9kIHdyYXBwZWQgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5XHJcbiAgT0oucmVnaXN0ZXIgXCJ0cnlFeGVjXCIsIHRyeUV4ZWMgPSAodHJ5RnVuYykgLT5cclxuICAgICd1c2Ugc3RyaWN0J1xyXG4gICAgcmV0ID0gZmFsc2VcclxuICAgIHRoYXQgPSB0aGlzXHJcbiAgICB0cnlcclxuICAgICAgcmV0ID0gdHJ5RnVuYy5hcHBseSh0aGF0LCBBcnJheTo6c2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKSAgaWYgT0ouaXMubWV0aG9kKHRyeUZ1bmMpXHJcbiAgICBjYXRjaCBleGNlcHRpb25cclxuICAgICAgaWYgKGV4Y2VwdGlvbi5uYW1lIGlzIFwiVHlwZUVycm9yXCIgb3IgZXhjZXB0aW9uLnR5cGUgaXMgXCJjYWxsZWRfbm9uX2NhbGxhYmxlXCIpIGFuZCBleGNlcHRpb24udHlwZSBpcyBcIm5vbl9vYmplY3RfcHJvcGVydHlfbG9hZFwiXHJcbiAgICAgICAgT0ouY29uc29sZS5pbmZvIFwiSWdub3JpbmcgZXhjZXB0aW9uOiBcIiwgZXhjZXB0aW9uXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBPSi5jb25zb2xlLmVycm9yIGV4Y2VwdGlvblxyXG4gICAgZmluYWxseVxyXG5cclxuICAgIHJldFxyXG5cclxuXHJcbiAgT0oucmVnaXN0ZXIgXCJtZXRob2RcIiwgbWV0aG9kID0gKHRyeUZ1bmMpIC0+XHJcbiAgICAndXNlIHN0cmljdCdcclxuICAgIHRoYXQgPSB0aGlzXHJcbiAgICAtPlxyXG4gICAgICBhcmdzID0gQXJyYXk6OnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKVxyXG4gICAgICBhcmdzLnVuc2hpZnQgdHJ5RnVuY1xyXG4gICAgICBPSi50cnlFeGVjLmFwcGx5IHRoYXQsIGFyZ3NcclxuXHJcbiAgcmV0dXJuXHJcbiBcclxuIFxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIG51bWJlciA9IE9iamVjdC5jcmVhdGUobnVsbClcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCBcImlzTmFOXCIsXHJcbiAgICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5pc05hTikgdGhlbiBOdW1iZXIuaXNOYU4gZWxzZSBpc05hTilcclxuXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgXCJpc0Zpbml0ZVwiLFxyXG4gICAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuaXNGaW5pdGUpIHRoZW4gTnVtYmVyLmlzRmluaXRlIGVsc2UgaXNGaW5pdGUpXHJcblxyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsIFwiTUFYX1ZBTFVFXCIsXHJcbiAgICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5NQVhfVkFMVUUpIHRoZW4gTnVtYmVyLk1BWF9WQUxVRSBlbHNlIDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCBcIk1JTl9WQUxVRVwiLFxyXG4gICAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuTUlOX1ZBTFVFKSB0aGVuIE51bWJlci5NSU5fVkFMVUUgZWxzZSA1ZS0zMjQpXHJcblxyXG4gIE9KLnJlZ2lzdGVyIFwibnVtYmVyXCIsIG51bWJlclxyXG4gIHJldHVyblxyXG5cclxuIiwiIyAjIG9iamVjdFxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBcclxuICAjICMjIFtPSl0ob2ouaHRtbCkub2JqZWN0XHJcbiAgIyBjcmVhdGUgYW4gb2JqZWN0IHdpdGggaGVscGVyIGBhZGRgIGFuZCBgZWFjaGAgbWV0aG9kcy5cclxuICBvYmplY3QgPSAtPlxyXG4gICAgb2JqID0ge31cclxuICAgIFxyXG4gICAgIyMjXHJcbiAgICBBZGQgYSBwcm9wZXJ0eSB0byB0aGUgb2JqZWN0IGFuZCByZXR1cm4gaXRcclxuICAgICMjI1xyXG4gICAgb2JqLmFkZCA9IChuYW1lLCB2YWwpIC0+IFxyXG4gICAgICBPSi5wcm9wZXJ0eSBvYmosIG5hbWUsIHZhbFxyXG4gICAgICBvYmpcclxuICAgIFxyXG4gICAgb2JqLmFkZCAnZWFjaCcsIChjYWxsYmFjaykgLT5cclxuICAgICAgT0ouZWFjaCBvYmosICh2YWwsIGtleSkgLT5cclxuICAgICAgICBpZiBrZXkgaXNudCAnZWFjaCcgYW5kIGtleSBpc250ICdhZGQnXHJcbiAgICAgICAgICBjYWxsYmFjayB2YWwsIGtleVxyXG4gICAgICAgIFxyXG4gICAgb2JqXHJcblxyXG4gIE9KLnJlZ2lzdGVyICdvYmplY3QnLCBvYmplY3RcclxuICBcclxuICAjICMjIFtPSl0ob2ouaHRtbCkuaXNJbnN0YW5jZU9mXHJcbiAgIyBkZXRlcm1pbmVzIGlzIGEgdGhpbmcgaXMgYW4gaW5zdGFuY2Ugb2YgYSBUaGluZywgYXNzdW1pbmcgdGhlIHRoaW5ncyB3ZXJlIGFsbCBjcmVhdGVkIGluIE9KXHJcbiAgT0oucmVnaXN0ZXIgJ2lzSW5zdGFuY2VPZicsIChuYW1lLCBvYmopIC0+XHJcbiAgICBPSi5jb250YWlucyhuYW1lLCBvYmopIGFuZCBPSi50by5ib29sKG9ialtuYW1lXSlcclxuICAgXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmNvbnRhaW5zXHJcbiAgIyB0cnVlIGlmIHRoZSBgb2JqZWN0YCBjb250YWlucyB0aGUgdmFsdWUgICBcclxuICBPSi5yZWdpc3RlciAnY29udGFpbnMnLCAob2JqZWN0LCBpbmRleCkgLT5cclxuICAgIHJldCA9IGZhbHNlXHJcbiAgICBpZiBvYmplY3RcclxuICAgICAgcmV0ID0gXy5jb250YWlucyBvYmplY3QsIGluZGV4XHJcbiAgICByZXRcclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmNvbXBhcmVcclxuICAjIGNvbXBhcmUgdHdvIG9iamVjdHMvYXJyYXlzL3ZhbHVlcyBmb3Igc3RyaWN0IGVxdWFsaXR5XHJcbiAgT0oucmVnaXN0ZXIgJ2NvbXBhcmUnLCAob2JqMSwgb2JqMikgLT5cclxuICAgIF8uaXNFcXVhbCBvYmoxLCBvYmoyXHJcbiAgICBcclxuICAjICMjIFtPSl0ob2ouaHRtbCkuY2xvbmVcclxuICAjIGNvcHkgYWxsIG9mIHRoZSB2YWx1ZXMgKHJlY3Vyc2l2ZWx5KSBmcm9tIG9uZSBvYmplY3QgdG8gYW5vdGhlci4gIFxyXG4gIE9KLnJlZ2lzdGVyICdjbG9uZScsIChkYXRhKSAtPlxyXG4gICAgXy5jbG9uZURlZXAgZGF0YSB0cnVlXHJcblxyXG4gICMgIyMgW09KXShvai5odG1sKS5zZXJpYWxpemVcclxuICAjIENvbnZlcnQgYW4gb2JqZWN0IHRvIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgb2JqZWN0XHJcbiAgT0oucmVnaXN0ZXIgJ3NlcmlhbGl6ZScsIChkYXRhKSAtPlxyXG4gICAgcmV0ID0gJydcclxuICAgIE9KLnRyeUV4ZWMgLT5cclxuICAgICAgcmV0ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSlcclxuICAgICAgcmV0dXJuXHJcbiAgICByZXQgb3IgJydcclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmRlc2VyaWFsaXplXHJcbiAgIyBDb252ZXJ0IGEgSlNPTiBzdHJpbmcgdG8gYW4gb2JqZWN0XHJcbiAgT0oucmVnaXN0ZXIgJ2Rlc2VyaWFsaXplJywgKGRhdGEpIC0+XHJcbiAgICByZXQgPSB7fVxyXG4gICAgaWYgZGF0YVxyXG4gICAgICBPSi50cnlFeGVjIC0+XHJcbiAgICAgICAgcmV0ID0gd2luZG93LiQucGFyc2VKU09OKGRhdGEpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICByZXQgPSB7fSAgaWYgT0ouaXMubnVsbE9yRW1wdHkocmV0KVxyXG4gICAgcmV0XHJcblxyXG4gICMgIyMgW09KXShvai5odG1sKS5wYXJhbXNcclxuICAjIENvbnZlcnQgYW4gb2JqZWN0IHRvIGEgZGVsaW1pdGVkIGxpc3Qgb2YgcGFyYW1ldGVycyAobm9ybWFsbHkgcXVlcnktc3RyaW5nIHBhcmFtZXRlcnMpXHJcbiAgT0oucmVnaXN0ZXIgJ3BhcmFtcycsIChkYXRhLCBkZWxpbWl0ZXIgPSAnJicpIC0+XHJcbiAgICByZXQgPSAnJ1xyXG4gICAgaWYgZGVsaW1pdGVyIGlzICcmJ1xyXG4gICAgICBPSi50cnlFeGVjIC0+XHJcbiAgICAgICAgcmV0ID0gJC5wYXJhbShkYXRhKVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgIGVsc2VcclxuICAgICAgT0ouZWFjaCBkYXRhLCAodmFsLCBrZXkpIC0+XHJcbiAgICAgICAgcmV0ICs9IGRlbGltaXRlciAgaWYgcmV0Lmxlbmd0aCA+IDBcclxuICAgICAgICByZXQgKz0ga2V5ICsgJz0nICsgdmFsXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgT0oudG8uc3RyaW5nIHJldFxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuZXh0ZW5kXHJcbiAgIyBjb3B5IHRoZSBwcm9wZXJ0aWVzIG9mIG9uZSBvYmplY3QgdG8gYW5vdGhlciBvYmplY3RcclxuICBPSi5yZWdpc3RlciAnZXh0ZW5kJywgKGRlc3RPYmosIHNyY09iaiwgZGVlcENvcHkgPSBmYWxzZSkgLT5cclxuICAgIHJldCA9IGRlc3RPYmogb3Ige31cclxuICAgIGlmIGRlZXBDb3B5IGlzIHRydWVcclxuICAgICAgcmV0ID0gJC5leHRlbmQoZGVlcENvcHksIHJldCwgc3JjT2JqKVxyXG4gICAgZWxzZVxyXG4gICAgICByZXQgPSAkLmV4dGVuZChyZXQsIHNyY09iailcclxuICAgIHJldFxyXG4gIFxyXG4gIFxyXG4gIFxyXG4gIFxyXG4gIHJldHVyblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBcclxuICAjIyNcclxuICBBZGQgYSBwcm9wZXJ0eSB0byBhbiBvYmplY3RcclxuICBcclxuICAjIyNcclxuICBwcm9wZXJ0eSA9IChvYmosIG5hbWUsIHZhbHVlLCB3cml0YWJsZSwgY29uZmlndXJhYmxlLCBlbnVtZXJhYmxlKSAtPlxyXG4gICAgdGhyb3cgbmV3IEVycm9yIFwiQ2Fubm90IGRlZmluZSBhIHByb3BlcnR5IHdpdGhvdXQgYW4gT2JqZWN0LlwiICB1bmxlc3Mgb2JqXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IgXCJDYW5ub3QgY3JlYXRlIGEgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIHByb3BlcnR5IG5hbWUuXCIgIHVubGVzcyBuYW1lP1xyXG4gICAgb2JqW25hbWVdID0gdmFsdWVcclxuICAgIG9ialxyXG5cclxuICBPSi5yZWdpc3RlciBcInByb3BlcnR5XCIsIHByb3BlcnR5XHJcbiAgcmV0dXJuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIE9KLnJlZ2lzdGVyIFwiZGVsaW1pdGVkU3RyaW5nXCIsIChzdHJpbmcsIG9wdHMpIC0+XHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIG5ld0xpbmVUb0RlbGltaXRlcjogdHJ1ZVxyXG4gICAgICBzcGFjZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICAgIHJlbW92ZUR1cGxpY2F0ZXM6IHRydWVcclxuICAgICAgZGVsaW1pdGVyOiBcIixcIlxyXG4gICAgICBpbml0U3RyaW5nOiBPSi50by5zdHJpbmcgc3RyaW5nXHJcblxyXG4gICAgcmV0T2JqID1cclxuICAgICAgYXJyYXk6IFtdXHJcbiAgICAgIGRlbGltaXRlZDogLT5cclxuICAgICAgICByZXRPYmouYXJyYXkuam9pbiBkZWZhdWx0cy5kZWxpbWl0ZXJcclxuXHJcbiAgICAgIHN0cmluZzogKGRlbGltaXRlciA9IGRlZmF1bHRzLmRlbGltaXRlcikgLT5cclxuICAgICAgICByZXQgPSAnJ1xyXG4gICAgICAgIE9KLmVhY2ggcmV0T2JqLmFycmF5LCAodmFsKSAtPlxyXG4gICAgICAgICAgcmV0ICs9IGRlbGltaXRlciAgaWYgcmV0Lmxlbmd0aCA+IDBcclxuICAgICAgICAgIHJldCArPSB2YWxcclxuICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICByZXRcclxuXHJcbiAgICAgIHRvU3RyaW5nOiAtPlxyXG4gICAgICAgIHJldE9iai5zdHJpbmcoKVxyXG5cclxuICAgICAgYWRkOiAoc3RyKSAtPlxyXG4gICAgICAgIHJldE9iai5hcnJheS5wdXNoIGRlZmF1bHRzLnBhcnNlKHN0cilcclxuICAgICAgICBkZWZhdWx0cy5kZWxldGVEdXBsaWNhdGVzKClcclxuICAgICAgICByZXRPYmpcclxuXHJcbiAgICAgIHJlbW92ZTogKHN0cikgLT5cclxuICAgICAgICByZW1vdmUgPSAoYXJyYXkpIC0+XHJcbiAgICAgICAgICBhcnJheS5maWx0ZXIgKGl0ZW0pIC0+XHJcbiAgICAgICAgICAgIHRydWUgIGlmIGl0ZW0gaXNudCBzdHJcclxuXHJcblxyXG4gICAgICAgIHJldE9iai5hcnJheSA9IHJlbW92ZShyZXRPYmouYXJyYXkpXHJcbiAgICAgICAgcmV0T2JqXHJcblxyXG4gICAgICBjb3VudDogLT5cclxuICAgICAgICByZXRPYmouYXJyYXkubGVuZ3RoXHJcblxyXG4gICAgICBjb250YWluczogKHN0ciwgY2FzZVNlbnNpdGl2ZSkgLT5cclxuICAgICAgICBpc0Nhc2VTZW5zaXRpdmUgPSBPSi50by5ib29sKGNhc2VTZW5zaXRpdmUpXHJcbiAgICAgICAgc3RyID0gT0oudG8uc3RyaW5nKHN0cikudHJpbSgpXHJcbiAgICAgICAgc3RyID0gc3RyLnRvTG93ZXJDYXNlKCkgIGlmIGZhbHNlIGlzIGlzQ2FzZVNlbnNpdGl2ZVxyXG4gICAgICAgIG1hdGNoID0gcmV0T2JqLmFycmF5LmZpbHRlcigobWF0U3RyKSAtPlxyXG4gICAgICAgICAgKGlzQ2FzZVNlbnNpdGl2ZSBhbmQgT0oudG8uc3RyaW5nKG1hdFN0cikudHJpbSgpIGlzIHN0cikgb3IgT0oudG8uc3RyaW5nKG1hdFN0cikudHJpbSgpLnRvTG93ZXJDYXNlKCkgaXMgc3RyXHJcbiAgICAgICAgKVxyXG4gICAgICAgIG1hdGNoLmxlbmd0aCA+IDBcclxuXHJcbiAgICAgIGVhY2g6IChjYWxsQmFjaykgLT5cclxuICAgICAgICByZXRPYmouYXJyYXkuZm9yRWFjaCBjYWxsQmFja1xyXG5cclxuICAgIGRlZmF1bHRzLnBhcnNlID0gKHN0cikgLT5cclxuICAgICAgcmV0ID0gT0oudG8uc3RyaW5nKHN0cilcclxuICAgICAgcmV0ID0gcmV0LnJlcGxhY2UoL1xcbi9nLCBkZWZhdWx0cy5kZWxpbWl0ZXIpICB3aGlsZSByZXQuaW5kZXhPZihcIlxcblwiKSBpc250IC0xICBpZiBkZWZhdWx0cy5uZXdMaW5lVG9EZWxpbWl0ZXJcclxuICAgICAgcmV0ID0gcmV0LnJlcGxhY2UoUmVnRXhwKFwiIFwiLCBcImdcIiksIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiIFwiKSBpc250IC0xICBpZiBkZWZhdWx0cy5zcGFjZVRvRGVsaW1pdGVyXHJcbiAgICAgIHJldCA9IHJldC5yZXBsYWNlKC8sLC9nLCBkZWZhdWx0cy5kZWxpbWl0ZXIpICB3aGlsZSByZXQuaW5kZXhPZihcIiwsXCIpIGlzbnQgLTFcclxuICAgICAgcmV0XHJcblxyXG4gICAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcyA9IC0+XHJcbiAgICAgIGlmIGRlZmF1bHRzLnJlbW92ZUR1cGxpY2F0ZXNcclxuICAgICAgICAoLT5cclxuICAgICAgICAgIHVuaXF1ZSA9IChhcnJheSkgLT5cclxuICAgICAgICAgICAgc2VlbiA9IG5ldyBTZXQoKVxyXG4gICAgICAgICAgICBhcnJheS5maWx0ZXIgKGl0ZW0pIC0+XHJcbiAgICAgICAgICAgICAgaWYgZmFsc2UgaXMgc2Vlbi5oYXMoaXRlbSlcclxuICAgICAgICAgICAgICAgIHNlZW4uYWRkIGl0ZW1cclxuICAgICAgICAgICAgICAgIHRydWVcclxuXHJcblxyXG4gICAgICAgICAgcmV0T2JqLmFycmF5ID0gdW5pcXVlKHJldE9iai5hcnJheSlcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICkoKVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgICAoKGEpIC0+XHJcbiAgICAgIGlmIGEubGVuZ3RoID4gMSBhbmQgZmFsc2UgaXMgT0ouaXMucGxhaW5PYmplY3Qob3B0cylcclxuICAgICAgICBPSi5lYWNoIGEsICh2YWwpIC0+XHJcbiAgICAgICAgICByZXRPYmouYXJyYXkucHVzaCB2YWwgIGlmIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5KHZhbClcclxuICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgZWxzZSBpZiBzdHJpbmcgYW5kIHN0cmluZy5sZW5ndGggPiAwXHJcbiAgICAgICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRzXHJcbiAgICAgICAgZGVsaW1pdGVkU3RyaW5nID0gZGVmYXVsdHMucGFyc2Uoc3RyaW5nKVxyXG4gICAgICAgIGRlZmF1bHRzLmluaXRTdHJpbmcgPSBkZWxpbWl0ZWRTdHJpbmdcclxuICAgICAgICByZXRPYmouYXJyYXkgPSBkZWxpbWl0ZWRTdHJpbmcuc3BsaXQoZGVmYXVsdHMuZGVsaW1pdGVyKVxyXG4gICAgICBkZWZhdWx0cy5kZWxldGVEdXBsaWNhdGVzKClcclxuICAgICAgcmV0dXJuXHJcbiAgICApIGFyZ3VtZW50c1xyXG4gICAgcmV0T2JqXHJcblxyXG4gIHJldHVyblxyXG5cclxuIiwiIyAjIGNvbXBvbmVudFxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuXHJcbiAgIyBDcmVhdGUgYW4gSFRNTCBXZWIgQ29tcG9uZW50IHRocm91Z2ggVGhpbkRvbVxyXG4gIFxyXG4gICMgLSBgb3B0aW9uc2AgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc3RhbmRhcmQgb3B0aW9ucyB0byBiZSBwYXNzZWQgaW50byB0aGUgY29tcG9uZW50XHJcbiAgIyAtLSBgcm9vdE5vZGVUeXBlYDogdGhlIHRhZyBuYW1lIG9mIHRoZSByb290IG5vZGUgdG8gY3JlYXRlLCBkZWZhdWx0ID0gJ2RpdidcclxuICAjIC0tIGBwcm9wc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIERPTSBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXHJcbiAgIyAtLSBgc3R5bGVzYDogYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgQ1NTIGF0dHJpYnV0ZXMgdG8gYXBwZW5kIHRvIHRoZSByb290IG5vZGVcclxuICAjIC0tIGBldmVudHNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBuYW1lZCBET00gZXZlbnRzIChhbmQgY29ycmVzcG9uZGluZyBjYWxsYmFjayBtZXRob2RzKSB0byBiaW5kIHRvIHRoZSByb290IG5vZGUgXHJcbiAgIyAtIGBvd25lcmAgdGhlIHBhcmVudCB0byB3aGljaCB0aGUgY29tcG9uZW50IG5vZGUgd2lsbCBiZSBhcHBlbmRlZFxyXG4gICMgLSBgdGFnTmFtZWAgdGhlIG5hbWUgb2Ygb2YgdGhlIGNvbXBvbmVudCwgd2hpY2ggd2lsbCBhbHdheXMgYmUgcHJlZml4ZWQgd2l0aCAneC0nXHJcbiAgY29tcG9uZW50ID0gKG9wdGlvbnMgPSBPSi5vYmplY3QoKSwgb3duZXIsIHRhZ05hbWUpIC0+XHJcbiAgXHJcbiAgICBpZiBub3QgdGFnTmFtZS5zdGFydHNXaXRoICd4LScgdGhlbiB0YWdOYW1lID0gJ3gtJyArIHRhZ05hbWVcclxuICAgICMgd2ViIGNvbXBvbmVudHMgYXJlIHJlYWxseSBqdXN0IG9yZGluYXJ5IE9KIFtlbGVtZW50XShlbGVtZW50Lmh0bWwpJ3Mgd2l0aCBhIHNwZWNpYWwgbmFtZS5cclxuICAgICMgVW50aWwgSFRNTCBXZWIgQ29tcG9uZW50cyBhcmUgZnVsbHkgc3VwcG9ydGVkIChhbmQgT0ogaXMgcmVmYWN0b3JlZCBhY2NvcmRpbmdseSksIHRoZSBlbGVtZW50IHdpbGwgYmUgdHJlYXRlZCBhcyBhbiB1bmtub3duIGVsZW1lbnQuXHJcbiAgICAjIEluIG1vc3QgY2FzZXMsIHRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHRoZSBicm93c2VyIGlzIGFjY2VwdGFibGUgKHNlZSBhbHNvIFtIVE1MIFNlbWFudGljc10oaHR0cDovL2RpdmVpbnRvaHRtbDUuaW5mby9zZW1hbnRpY3MuaHRtbCkpLCBidXRcclxuICAgICMgaW4gc29tZSBjYXNlcyB0aGlzIGlzIHByb2JsZW1hdGljIChmaXJzdGx5LCBiZWNhdXNlIHRoZXNlIGVsZW1lbnRzIGFyZSBhbHdheXMgcmVuZGVyZWQgaW5saW5lKS5cclxuICAgICMgSW4gc3VjaCBjb25kaXRpb25zLCB0aGUgW2NvbnRyb2xzXShjb250cm9scy5odG1sKSBjbGFzcyBhbmQgbmFtZSBzcGFjZSBpcyBiZXR0ZXIgc3VpdGVkIHRvIGNsYXNzZXMgd2hpY2ggcmVxdWlyZSBjb21wbGV0ZSBjb250cm9sIChlLmcuIFtpY29uXShpY29uLmh0bWwpKS5cclxuICAgIHdpZGdldCA9IE9KLmVsZW1lbnQgdGFnTmFtZSAjLCBvcHRpb25zLnByb3BzLCBvcHRpb25zLnN0eWxlcywgb3B0aW9ucy5ldmVudHMsIG9wdGlvbnMudGV4dFxyXG4gICAgT0oubm9kZXMuZmFjdG9yeSB3aWRnZXQsIG93bmVyXHJcbiAgICBcclxuICAgICMgU2luY2UgdGhlIGJlaGF2aW9yIG9mIHN0eWxpbmcgaXMgbm90IHdlbGwgY29udHJvbGxlZC9jb250cm9sbGFibGUgb24gdW5rbm93biBlbGVtZW50cywgaXQgaXMgbmVjZXNzYXJ5IHRvIGNyZWF0ZSBhIHJvb3Qgbm9kZSBmb3IgdGhlIGNvbXBvbmVudC5cclxuICAgICMgSW4gbW9zdCBjYXNlcywgW2Rpdl0oZGl2Lmh0bWwpIGlzIHBlcmZlY3RseSBhY2NlcHRhYmxlLCBidXQgdGhpcyBpcyBjb25maWd1cmFibGUgYXQgdGhlIG5hbWUgc3BhY2UgbGV2ZWwgb3IgYXQgcnVudGltZS4gXHJcbiAgICByb290Tm9kZVR5cGUgPSBvcHRpb25zLnJvb3ROb2RlVHlwZSBvciBPSlsnREVGQVVMVF9DT01QT05FTlRfUk9PVF9OT0RFVFlQRSddIG9yICdkaXYnXHJcbiAgICBcclxuICAgICMgYHJldGAgaXMgdGhlIHRoZSBpbnN0YW5jZSBvZiB0aGUgcm9vdE5vZGVUeXBlLCBub3QgdGhlIGB3aWRnZXRgIHdyYXBwZWQgaW4gdGhpcyBjbG9zdXJlXHJcbiAgICByZXQgPSB3aWRnZXQubWFrZSByb290Tm9kZVR5cGUsIG9wdGlvbnNcclxuICAgIFxyXG4gICAgIyBmb3IgY29udmVuaWVuY2UgYW5kIGRlYnVnZ2luZywgcGVyc2lzdCB0aGUgdGFnTmFtZVxyXG4gICAgcmV0LmFkZCAnY29tcG9uZW50TmFtZScsIHRhZ05hbWVcclxuICAgIFxyXG4gICAgIyBgcmVtb3ZlYCBkb2VzLCBob3dldmVyLCBiZWhhdmUgYXMgZXhwZWN0ZWQgYnkgcmVtb3ZpbmcgYHdpZGdldGBcclxuICAgIHJldC5hZGQgJ3JlbW92ZScsIHdpZGdldC5yZW1vdmVcclxuICAgIHJldFxyXG4gICAgXHJcbiAgT0oucmVnaXN0ZXIgJ2NvbXBvbmVudCcsIGNvbXBvbmVudFxyXG5cclxuICByZXR1cm5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcblxyXG4gICMjI1xyXG4gIENyZWF0ZSBhIHNldCBvZiBIVE1MIEVsZW1lbnRzIHRocm91Z2ggVGhpbkRvbVxyXG4gICMjI1xyXG4gIGNvbnRyb2wgPSAob3B0aW9ucyA9IE9KLm9iamVjdCgpLCBvd25lciwgdGFnTmFtZSkgLT5cclxuICAgIGlmIG5vdCB0YWdOYW1lLnN0YXJ0c1dpdGggJ3ktJyB0aGVuIHRhZ05hbWUgPSAneS0nICsgdGFnTmFtZVxyXG4gICAgXHJcbiAgICByb290Tm9kZVR5cGUgPSBvcHRpb25zLnJvb3ROb2RlVHlwZSBvciBPSlsnREVGQVVMVF9DT01QT05FTlRfUk9PVF9OT0RFVFlQRSddIG9yICdkaXYnXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmVsZW1lbnQgcm9vdE5vZGVUeXBlLCBvcHRpb25zLnByb3BzLCBvcHRpb25zLnN0eWxlcywgb3B0aW9ucy5ldmVudHMsIG9wdGlvbnMudGV4dFxyXG4gICAgT0oubm9kZXMuZmFjdG9yeSByZXQsIG93bmVyXHJcbiAgICBcclxuICAgIHJldC5hZGQgJ2NvbnRyb2xOYW1lJywgdGFnTmFtZVxyXG4gICAgXHJcbiAgICByZXRcclxuICAgIFxyXG4gIE9KLnJlZ2lzdGVyICdjb250cm9sJywgY29udHJvbFxyXG5cclxuICByZXR1cm5cclxuXHJcbiIsIiMgIyBkb21cclxuXHJcbmRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgXHJcbiAgIyBFeHRlbmQgYW4gb2JqZWN0IHdpdGggT0ogRE9NIG1ldGhvZHMgYW5kIHByb3BlcnRpZXNcclxuICBcclxuICAjIC0gYGVsYCBPYmplY3QgdG8gZXh0ZW5kXHJcbiAgIyAtIGBwYXJlbnRgIHBhcmVudCBvYmplY3QgdG8gd2hpY2ggYGVsYCB3aWxsIGJlIGFwcGVuZGVkXHJcbiAgT0oucmVnaXN0ZXIgJ2RvbScsIChlbCwgcGFyZW50ID0gT0ouYm9keSApIC0+XHJcbiAgICAndXNlIHN0cmljdCdcclxuXHJcbiAgICBlbmFibGVkID0gdHJ1ZVxyXG4gICAgXHJcbiAgICAjICMjIGlzVmFsaWRcclxuICAgIGVsLmFkZCAnaXNWYWxpZCcsIC0+XHJcbiAgICAgICBlbCBhbmQgKGVsLmVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgb3IgZWwuZWwgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KVxyXG4gICAgXHJcbiAgICBpc0NvbnRyb2xTdGlsbFZhbGlkID0gLT5cclxuICAgICAgdmFsaWQgPSBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eShlbCkgYW5kIGVsLmlzVmFsaWQoKVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IgJ2VsIGlzIG51bGwuIEV2ZW50IGJpbmRpbmdzIG1heSBub3QgaGF2ZSBiZWVuIEdDZC4nICBpZiBmYWxzZSBpcyB2YWxpZFxyXG4gICAgICB2YWxpZFxyXG4gICAgXHJcbiAgICAjICMjIGFkZENsYXNzICBcclxuICAgICMgQWRkIGEgQ1NTIGNsYXNzIHRvIGFuIGVsZW1lbnRcclxuICAgIFxyXG4gICAgIyAtIGBuYW1lYCB0aGUgbmFtZSBvZiB0aGUgY2xhc3MgdG8gYWRkXHJcbiAgICBlbC5hZGQgJ2FkZENsYXNzJywgKG5hbWUpIC0+XHJcbiAgICAgIGVsLiQuYWRkQ2xhc3MgbmFtZSBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgZWxcclxuICAgIFxyXG4gICAgIyAjIyBiaW5kXHJcbiAgICAjIEJpbmQgYW4gYWN0aW9uIHRvIGEgalF1ZXJ5IGVsZW1lbnQncyBldmVudC5cclxuICAgIGVsLmFkZCAnYmluZCcsIChldmVudE5hbWUsIGV2ZW50KSAtPlxyXG4gICAgICBlbC5vbiBldmVudE5hbWUsIGV2ZW50XHJcbiAgICBcclxuICAgICMgIyMgb25cclxuICAgIGVsLmFkZCAnb24nLCAoZXZlbnROYW1lLCBldmVudCkgLT5cclxuICAgICAgZWwuJC5vbiBldmVudE5hbWUsIGV2ZW50ICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgZWxcclxuXHJcbiAgICAjICMjIG9mZlxyXG4gICAgZWwuYWRkICdvZmYnLCAoZXZlbnROYW1lLCBldmVudCkgLT5cclxuICAgICAgZWwuJC5vZmYgZXZlbnROYW1lLCBldmVudCAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGVsXHJcbiAgXHJcbiAgICAjICMjIGtleWJvYXJkXHJcbiAgICAjIEJpbmQgYW4gZXZlbnQgdG8gYSBrZXksIHdoZW4gcHJlc3NlZCBpbiB0aGlzIGNvbnRyb2wuXHJcbiAgICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcclxuICAgIGVsLmFkZCAna2V5Ym9hcmQnLCAoa2V5cywgZXZlbnQpIC0+XHJcbiAgICAgIE1vdXNldHJhcC5iaW5kIGtleXMsIGVsW2V2ZW50XSAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGVsXHJcbiAgICBcclxuICAgICMgIyMgZGlzYWJsZVxyXG4gICAgIyBEaXNhYmxlIHRoZSBlbGVtZW50LlxyXG4gICAgIyBUaGUgT0ogb2JqZWN0IChmb3IgY2hhaW5pbmcpXHJcbiAgICBlbC5hZGQgJ2Rpc2FibGUnLCAtPlxyXG4gICAgICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgICBlbmFibGVkID0gZmFsc2VcclxuICAgICAgICBlbC5hdHRyICdkaXNhYmxlZCcsICdkaXNhYmxlZCdcclxuICAgICAgICBlbC5hZGRDbGFzcyAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnXHJcbiAgICAgIGVsXHJcbiAgXHJcbiAgICAjICMjIGVtcHR5XHJcbiAgICAjIEVtcHR5IHRoZSBlbGVtZW50LlxyXG4gICAgIyBUaGUgT0ogb2JqZWN0IChmb3IgY2hhaW5pbmcpIFxyXG4gICAgZWwuYWRkICdlbXB0eScsIC0+XHJcbiAgICAgIGVsLiQuZW1wdHkoKSAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGVsXHJcblxyXG4gICAgIyAjIyBlbmFibGVcclxuICAgICMgRW5hYmxlIHRoZSBlbGVtZW50LlxyXG4gICAgIyBUaGUgT0ogb2JqZWN0IChmb3IgY2hhaW5pbmcpIFxyXG4gICAgZWwuYWRkICdlbmFibGUnLCAtPlxyXG4gICAgICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgICBlbmFibGVkID0gdHJ1ZVxyXG4gICAgICAgIGVsLnJlbW92ZUF0dHIgJ2Rpc2FibGVkJ1xyXG4gICAgICAgIGVsLnJlbW92ZUNsYXNzICdkaXNhYmxlZCdcclxuICAgICAgZWxcclxuXHJcbiAgICAjICMjIGdldElkXHJcbiAgICAjIEdldCB0aGUgRE9NIEVsZW1lbnQgSUQgb2YgdGhpcyBvYmplY3QuXHJcbiAgICBlbC5hZGQgJ2dldElkJywgLT5cclxuICAgICAgaWQgPSBlbFswXS5pZCAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGlkXHJcblxyXG4gICAgIyAjIyBoaWRlXHJcbiAgICAjIE1ha2UgdGhlIGVsZW1lbnQgaW52aXNpYmxlLlxyXG4gICAgZWwuYWRkICdoaWRlJywgLT5cclxuICAgICAgZWwuY3NzICdkaXNwbGF5JywgJ25vbmUnICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgZWxcclxuICAgIFxyXG4gICAgIyAjIyBsZW5ndGhcclxuICAgICMgR2V0IHRoZSBsZW5ndGggb2YgdGhpcyBlbGVtZW50LlxyXG4gICAgZWwuYWRkICdsZW5ndGgnLCAtPlxyXG4gICAgICBsZW4gPSAwXHJcbiAgICAgIGxlbiA9IE9KLnRvLm51bWJlcihlbC4kLmxlbmd0aCkgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBsZW5cclxuXHJcbiAgICAjICMjIHBhcmVudFxyXG4gICAgIyBSZWZlcmVuY2UgdG8gdGhlIHBhcmVudCBhcyBwYXNzZWQgaW5cclxuICAgIGVsLmFkZCAncGFyZW50JywgcGFyZW50XHJcbiAgICBcclxuICAgICMgIyMgcmVtb3ZlXHJcbiAgICAjIFJlbW92ZSB0aGUgbm9kZSBmcm9tIHRoZSBET01cclxuICAgIGVsLmFkZCAncmVtb3ZlJywgLT5cclxuICAgICAgaWYgZWwgYW5kIGVsLiRcclxuICAgICAgICBlbC4kLnJlbW92ZSgpXHJcbiAgICAgICAgXHJcbiAgICAgICAgIyBTZXQgdGhlIHZhbHVlIG9mIGVsIHRvIG51bGwgdG8gZ3VhcmFudGVlIHRoYXQgaXNDb250cm9sU3RpbGxWYWxpZCB3aWxsIGJlIGNvcnJlY3RcclxuICAgICAgICBlbCA9IG51bGxcclxuICAgICAgbnVsbFxyXG4gICAgXHJcbiAgICAjICMjIHJlbW92ZUNsYXNzXHJcbiAgICAjIFJlbW92ZSBhIENTUyBjbGFzcyBmcm9tIGFuIGVsZW1lbnQuXHJcbiAgICBlbC5hZGQgJ3JlbW92ZUNsYXNzJywgKG5hbWUpIC0+XHJcbiAgICAgIGVsLiQucmVtb3ZlQ2xhc3MgbmFtZSAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGVsXHJcblxyXG4gICAgIyAjIyByZW1vdmVQcm9wXHJcbiAgICAjIFJlbW92ZSBhIHByb3BlcnR5IGZyb20gYW4gZWxlbWVudC4galF1ZXJ5IGRpc3Rpbmd1aXNoZXMgYmV0d2VlbiAncHJvcHMnIGFuZCAnYXR0cic7IGhlbmNlIDIgbWV0aG9kcy5cclxuICAgIGVsLmFkZCAncmVtb3ZlUHJvcCcsIChuYW1lKSAtPlxyXG4gICAgICBlbC4kLnJlbW92ZVByb3AgbmFtZSAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGVsXHJcblxyXG4gICAgIyAjIyByZW1vdmVBdHRyXHJcbiAgICAjIFJlbW92ZSBhIHByb3BlcnR5IGZyb20gYW4gZWxlbWVudC4galF1ZXJ5IGRpc3Rpbmd1aXNoZXMgYmV0d2VlbiAncHJvcHMnIGFuZCAnYXR0cic7IGhlbmNlIDIgbWV0aG9kcy5cclxuICAgIGVsLmFkZCAncmVtb3ZlQXR0cicsIChuYW1lKSAtPlxyXG4gICAgICBlbC4kLnJlbW92ZUF0dHIgbmFtZSAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGVsXHJcblxyXG4gICAgIyAjIyByZXF1aXJlZFxyXG4gICAgIyBNYXJrIHRoZSByZXF1aXJlZCBzdGF0dXMgb2YgdGhlIGVsZW1lbnQuXHJcbiAgICBlbC5hZGQgJ3JlcXVpcmVkJywgKHRydXRoeSwgYWRkTGFiZWwpIC0+XHJcbiAgICAgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICAgIHN3aXRjaCBPSi50by5ib29sKHRydXRoeSlcclxuICAgICAgICAgIHdoZW4gdHJ1ZVxyXG4gICAgICAgICAgICBlbC5hdHRyICdyZXF1aXJlZCcsIHRydWVcclxuICAgICAgICAgICAgZWwuYWRkQ2xhc3MgJ3JlcXVpcmVkJ1xyXG4gICAgICAgICAgd2hlbiBmYWxzZVxyXG4gICAgICAgICAgICBlbC5yZW1vdmVQcm9wICdyZXF1aXJlZCdcclxuICAgICAgICAgICAgZWwucmVtb3ZlQ2xhc3MgJ3JlcXVpcmVkJ1xyXG4gICAgICBlbFxyXG5cclxuICAgICMgIyMgcm9vdFxyXG4gICAgIyByZWZlcmVuY2UgdG8gdGhlIHJvb3Qgb2YgdGhlIG5vZGVcclxuICAgIGVsLmFkZCAncm9vdCcsIGVsLnJvb3Qgb3IgcGFyZW50XHJcblxyXG4gICAgIyAjIyBzaG93XHJcbiAgICAjIE1ha2UgdGhlIGVsZW1lbnQgdmlzaWJsZS5cclxuICAgIGVsLmFkZCAnc2hvdycsIC0+XHJcbiAgICAgIGVsLiQuc2hvdygpICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgZWxcclxuXHJcbiAgICAjICMjIHRvZ2dsZVxyXG4gICAgIyBUb2dnbGUgdmlzaWJpbGl0eVxyXG4gICAgZWwuYWRkICd0b2dnbGUnLCAtPlxyXG4gICAgICBlbC4kLnRvZ2dsZSgpICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgZWxcclxuXHJcbiAgICAjICMjIHRvZ2dsZUVuYWJsZVxyXG4gICAgIyBUb2dnbGUgdGhlIGVsZW1lbnQncyBlbmFibGVkIHN0YXRlLlxyXG4gICAgZWwuYWRkICd0b2dnbGVFbmFibGUnLCAtPlxyXG4gICAgICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgICBpZiBlbmFibGVkXHJcbiAgICAgICAgICBlbC5kaXNhYmxlKClcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBlbC5lbmFibGUoKVxyXG4gICAgICBlbFxyXG5cclxuICAgICMgIyMgdHJpZ2dlclxyXG4gICAgIyBUcmlnZ2VyIGFuIGV2ZW50IGJvdW5kIHRvIGEgalF1ZXJ5IGVsZW1lbnQuXHJcbiAgICBlbC5hZGQgJ3RyaWdnZXInLCAoZXZlbnROYW1lLCBldmVudE9wdHMpIC0+XHJcbiAgICAgIGVsLiQudHJpZ2dlciBldmVudE5hbWUsIGV2ZW50T3B0cyAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGVsXHJcblxyXG4gICAgIyAjIyB1bmJpbmRcclxuICAgICMgV3JhcHBlciBhcm91bmQgYG9mZmBcclxuICAgIGVsLmFkZCAndW5iaW5kJywgKGV2ZW50TmFtZSwgZXZlbnQpIC0+XHJcbiAgICAgIGVsLm9mZiBldmVudE5hbWUsIGV2ZW50XHJcbiAgICAgIFxyXG4gICAgIyAjIyB2YWxcclxuICAgICMgR2V0IG9yIHNldCB0aGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQuXHJcbiAgICBlbC5hZGQgJ3ZhbCcsICh2YWx1ZSkgLT5cclxuICAgICAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgICAgaWYgYXJndW1lbnRzLmxlbmd0aCBpcyAxIGFuZCBmYWxzZSBpcyBPSi5pcy5udWxsT3JVbmRlZmluZWQodmFsdWUpXHJcbiAgICAgICAgICBlbC4kLnZhbCB2YWx1ZVxyXG4gICAgICAgICAgZWxcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBlbC4kLnZhbCgpXHJcblxyXG4gICAgIyAjIyB2YWx1ZU9mXHJcbiAgICAjIHdyYXBwZXIgYXJvdW5kIGB2YWxgXHJcbiAgICBlbC5hZGQgJ3ZhbHVlT2YnLCAtPlxyXG4gICAgICBlbC52YWwoKVxyXG5cclxuICAgICMgIyMgdG9TdHJpbmdcclxuICAgICMgd3JhcHBlciBhcm91bmQgYHZhbGBcclxuICAgIGVsLmFkZCAndG9TdHJpbmcnLCAtPlxyXG4gICAgICBlbC52YWwoKVxyXG5cclxuICAgIGVsXHJcblxyXG4gIE9KLnJlZ2lzdGVyICdpc0VsZW1lbnRJbkRvbScsIChlbGVtZW50SWQpIC0+XHJcbiAgICBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSBPSi5nZXRFbGVtZW50IGVsZW1lbnRJZFxyXG5cclxuICBPSi5yZWdpc3RlciAnZ2V0RWxlbWVudCcsIChpZCkgLT5cclxuICAgIGlmIHR5cGVvZiBkb2N1bWVudCBpc250ICd1bmRlZmluZWQnIFxyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgXHJcbiAgXHJcbiAgcmV0dXJuXHJcbiAgXHJcblxyXG5cclxuIiwiIyAjIGVsZW1lbnRcclxuXHJcbmRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcblxyXG4gICMjI1xyXG4gICBCaW5kIGFsbCBldmVudCBoYW5kbGVyc1xyXG4gICMjI1xyXG4gIGJpbmRFdmVudHMgPSAoZWwsIGV2ZW50cykgLT5cclxuICAgIGlmIGVsIHRoZW4gXy5mb3JPd24gZXZlbnRzLCAodmFsLCBrZXkpIC0+XHJcbiAgICAgIGlmIE9KLmlzLm1ldGhvZCB2YWxcclxuICAgICAgICBjYWxsYmFjayA9IChldmVudC4uLikgLT4gdmFsIGV2ZW50Li4uXHJcbiAgICAgICAgZWwuJC5vbiBrZXksIGNhbGxiYWNrXHJcbiAgICAgICAgZWwuYWRkIGtleSwgY2FsbGJhY2tcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgIyMjXHJcbiAgRmluYWxpemUgdGhlIFRoaW1ET00gbm9kZVxyXG4gICMjI1xyXG4gIGZpbmFsaXplID0gKHJldCwgdGFnLCBwcm9wcywgc3R5bGVzLCBldmVudHMsIHRleHQpIC0+XHJcbiAgICByZXQuYWRkICd0YWdOYW1lJywgdGFnXHJcbiAgICByZXQuY3NzIHN0eWxlc1xyXG4gICAgaWYgdGV4dCB0aGVuIHJldC50ZXh0IHRleHRcclxuICAgIHJldC5hZGQgJyQnLCAkKHJldC5nZXQoKSlcclxuICAgIHJldC5hZGQgJzAnLCByZXQuZ2V0KClcclxuXHJcbiAgICByZXQuYWRkICdiaW5kRXZlbnRzJywgXy5vbmNlICgpIC0+IGJpbmRFdmVudHMgcmV0LCBldmVudHNcclxuICAgIHJldFxyXG5cclxuICAjICMjIGVsZW1lbnRcclxuICAjIyNcclxuICBDcmVhdGUgYW4gSFRNTCBFbGVtZW50IHRocm91Z2ggVGhpbkRvbVxyXG4gICMjI1xyXG4gIE9KLnJlZ2lzdGVyICdlbGVtZW50JywgKHRhZywgcHJvcHMsIHN0eWxlcywgZXZlbnRzLCB0ZXh0KSAtPlxyXG4gICAgcmV0ID0gbmV3IFRoaW5ET00gdGFnLCBwcm9wc1xyXG4gICAgZmluYWxpemUgcmV0LCB0YWcsIHByb3BzLCBzdHlsZXMsIGV2ZW50cywgdGV4dFxyXG4gICAgcmV0XHJcblxyXG4gICMgIyMgcmVzdG9yZUVsZW1lbnRcclxuICAjIyNcclxuICBSZXN0b3JlIGFuIEhUTUwgRWxlbWVudCB0aHJvdWdoIFRoaW5Eb21cclxuICAjIyNcclxuICBPSi5yZWdpc3RlciAncmVzdG9yZUVsZW1lbnQnLCAoZWwsIHRhZyA9IGVsLm5vZGVOYW1lKSAtPlxyXG4gICAgcmV0ID0gbmV3IFRoaW5ET00gbnVsbCwgbnVsbCwgZWxcclxuICAgIGZpbmFsaXplIHJldCwgdGFnXHJcbiAgICByZXQuYWRkICdpc0luRE9NJywgdHJ1ZVxyXG4gICAgT0oubm9kZXMuZmFjdG9yeSByZXRcclxuICAgIHJldFxyXG5cclxuXHJcbiAgIyMjXHJcbiAgUGVyc2lzdCBhIGhhbmRsZSBvbiB0aGUgYm9keSBub2RlXHJcbiAgIyMjXHJcbiAgaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiBib2R5ID0gZG9jdW1lbnQuYm9keSBlbHNlIGJvZHkgPSBudWxsXHJcbiAgaW5pdEJvZHkgPSAoZWwpIC0+XHJcbiAgICByZXQgPSBuZXcgVGhpbkRPTSBudWxsLCBpZDogJ2JvZHknLCBlbFxyXG4gICAgcmV0LmlzSW5ET00gPSB0cnVlXHJcbiAgICBmaW5hbGl6ZSByZXQsICdib2R5J1xyXG5cclxuICB0aGluQm9keSA9IGluaXRCb2R5IGJvZHlcclxuICB0aGluQm9keS5nZXRJZCA9IC0+XHJcbiAgICAnYm9keSdcclxuXHJcbiAgT0oucmVnaXN0ZXIgJ2JvZHknLCB0aGluQm9keVxyXG5cclxuICByZXR1cm5cclxuIiwiIyAjIGZyYWdtZW50XHJcbmRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcblxyXG4gICMgQ3JlYXRlIGEgZG9jdW1lbnQgZnJhZ21lbnQgYW5kIHJldHVybiBpdCBhcyBhbiBPSiBub2RlXHJcbiAgT0oucmVnaXN0ZXIgJ2ZyYWdtZW50JywgKCkgLT5cclxuICAgIHJldCA9IG51bGxcclxuICAgIGlmIHR5cGVvZiBkb2N1bWVudCBpc250ICd1bmRlZmluZWQnXHJcbiAgICAgIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXHJcbiAgICAgIHJldCA9IE9KLnJlc3RvcmVFbGVtZW50IGZyYWdtZW50LCAnZnJhZ21lbnQnXHJcbiAgICByZXQgIFxyXG4gIFxyXG4gICAgICAgIFxyXG4gIHJldHVyblxyXG5cclxuIiwiIyAjIGdlbmVyaWMgbm9kZXNcclxuXHJcbmRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgY2xvc2VkID0gW1xyXG4gICAgJ2FiYnInXHJcbiAgICAnYWNyb255bSdcclxuICAgICdhcHBsZXQnXHJcbiAgICAnYXJ0aWNsZSdcclxuICAgICdhc2lkZSdcclxuICAgICdhdWRpbydcclxuICAgICdiJ1xyXG4gICAgJ2JkbydcclxuICAgICdiaWcnXHJcbiAgICAnYmxvY2txdW90ZSdcclxuICAgICdidXR0b24nXHJcbiAgICAnY2FudmFzJ1xyXG4gICAgJ2NhcHRpb24nXHJcbiAgICAnY2VudGVyJ1xyXG4gICAgJ2NpdGUnXHJcbiAgICAnY29kZSdcclxuICAgICdjb2xncm91cCdcclxuICAgICdkYXRhbGlzdCdcclxuICAgICdkZCdcclxuICAgICdkZWwnXHJcbiAgICAnZGV0YWlscydcclxuICAgICdkZm4nXHJcbiAgICAnZGlyJ1xyXG4gICAgJ2RpdidcclxuICAgICdkbCdcclxuICAgICdkdCdcclxuICAgICdlbSdcclxuICAgICdmaWVsZHNldCdcclxuICAgICdmaWdjYXB0aW9uJ1xyXG4gICAgJ2ZpZ3VyZSdcclxuICAgICdmb250J1xyXG4gICAgJ2Zvb3RlcidcclxuICAgICdoMSdcclxuICAgICdoMidcclxuICAgICdoMydcclxuICAgICdoNCdcclxuICAgICdoNSdcclxuICAgICdoNidcclxuICAgICdoZWFkJ1xyXG4gICAgJ2hlYWRlcidcclxuICAgICdoZ3JvdXAnXHJcbiAgICAnaHRtbCdcclxuICAgICdpJ1xyXG4gICAgJ2lmcmFtZSdcclxuICAgICdpbnMnXHJcbiAgICAna2JkJ1xyXG4gICAgJ2xhYmVsJ1xyXG4gICAgJ2xlZ2VuZCdcclxuICAgICdsaSdcclxuICAgICdtYXAnXHJcbiAgICAnbWFyaydcclxuICAgICdtZW51J1xyXG4gICAgJ21ldGVyJ1xyXG4gICAgJ25hdidcclxuICAgICdub2ZyYW1lcydcclxuICAgICdub3NjcmlwdCdcclxuICAgICdvYmplY3QnXHJcbiAgICAnb3B0Z3JvdXAnXHJcbiAgICAnb3B0aW9uJ1xyXG4gICAgJ291dHB1dCdcclxuICAgICdwJ1xyXG4gICAgJ3ByZSdcclxuICAgICdwcm9ncmVzcydcclxuICAgICdxJ1xyXG4gICAgJ3JwJ1xyXG4gICAgJ3J0J1xyXG4gICAgJ3J1YnknXHJcbiAgICAncydcclxuICAgICdzYW1wJ1xyXG4gICAgJ3NlY3Rpb24nXHJcbiAgICAnc21hbGwnXHJcbiAgICAnc3BhbidcclxuICAgICdzdHJpa2UnXHJcbiAgICAnc3Ryb25nJ1xyXG4gICAgJ3N0eWxlJ1xyXG4gICAgJ3N1YidcclxuICAgICdzdW1tYXJ5J1xyXG4gICAgJ3N1cCdcclxuICAgICd0Ym9keSdcclxuICAgICd0ZCdcclxuICAgICd0Zm9vdCdcclxuICAgICd0aCdcclxuICAgICd0aW1lJ1xyXG4gICAgJ3RpdGxlJ1xyXG4gICAgJ3RyJ1xyXG4gICAgJ3R0J1xyXG4gICAgJ3UnXHJcbiAgICAndmFyJ1xyXG4gICAgJ3ZpZGVvJ1xyXG4gICAgJ3htcCdcclxuICBdXHJcbiAgb3BlbiA9ICdhcmVhIGJhc2UgY29sIGNvbW1hbmQgY3NzIGVtYmVkIGhyIGltZyBrZXlnZW4gbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyJy5zcGxpdCAnICdcclxuICBhbGwgPSBjbG9zZWQuY29uY2F0IG9wZW5cclxuICAjIHJlZ2lzdGVyIHNlbWFudGljL3N0cnVjdHVyYWwgYWxpYXNlc1xyXG4gIGZvciBsb29wTmFtZSBpbiBhbGxcclxuICAgIGRvICh0YWcgPSBsb29wTmFtZSkgLT5cclxuICAgICAgT0oubm9kZXMucmVnaXN0ZXIgdGFnLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICAgICAgICBkZWZhdWx0cyA9XHJcbiAgICAgICAgICBwcm9wczoge31cclxuICAgICAgICAgIHN0eWxlczoge31cclxuICAgICAgICAgIGV2ZW50czoge31cclxuICAgICAgICAgIFxyXG4gICAgICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgZmFsc2VcclxuICAgICAgICByZXQgPSBPSi5lbGVtZW50IHRhZywgZGVmYXVsdHMucHJvcHMsIGRlZmF1bHRzLnN0eWxlcywgZGVmYXVsdHMuZXZlbnRzLCBkZWZhdWx0cy50ZXh0XHJcblxyXG5cclxuICAgICAgICBpZiBmYWxzZSBpcyBjYWxsZWRGcm9tRmFjdG9yeSB0aGVuIE9KLm5vZGVzLmZhY3RvcnkgcmV0LCBvd25lclxyXG5cclxuICAgICAgICByZXRcclxuICAgIFxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG5cclxuICAjIyNcclxuICBDcmVhdGUgYW4gT0ogSW5wdXQgT2JqZWN0IHRocm91Z2ggT0oubm9kZXMuaW5wdXRcclxuICAjIyNcclxuICBpbnB1dCA9IChvcHRpb25zID0gT0oub2JqZWN0KCksIG93bmVyKSAtPlxyXG4gICAgaWYgbm90IG93bmVyIHRoZW4gdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIGFuIGlucHV0IHdpdGhvdXQgYSBwYXJlbnQnXHJcbiAgICBpZiBub3Qgb3B0aW9ucy5wcm9wcyBvciBub3Qgb3B0aW9ucy5wcm9wcy50eXBlIHRoZW4gdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIGFuIGlucHV0IHdpdGhvdXQgYW4gaW5wdXQgdHlwZSdcclxuICAgIHJldCA9IG93bmVyLm1ha2UgJ2lucHV0Jywgb3B0aW9uc1xyXG4gICAgcmV0LmFkZCAnaW5wdXROYW1lJywgb3B0aW9ucy5wcm9wcy50eXBlXHJcbiAgICByZXRcclxuICAgIFxyXG4gIE9KLnJlZ2lzdGVyICdpbnB1dCcsIGlucHV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuXHJcbiAgY2xvc2VkID0gJ2EgYWJiciBhY3JvbnltIGFkZHJlc3MgYXBwbGV0IGFydGljbGUgYXNpZGUgYXVkaW8gYiBiZG8gYmlnIGJsb2NrcXVvdGUgYm9keSBidXR0b24gY2FudmFzIGNhcHRpb24gY2VudGVyIGNpdGUgY29kZSBjb2xncm91cCBjb21tYW5kIGRhdGFsaXN0IGRkIGRlbCBkZXRhaWxzIGRmbiBkaXIgZGl2IGRsIGR0IGVtIGVtYmVkIGZpZWxkc2V0IGZpZ2NhcHRpb24gZmlndXJlIGZvbnQgZm9vdGVyIGZvcm0gZnJhbWVzZXQgaDEgaDIgaDMgaDQgaDUgaDYgaGVhZCBoZWFkZXIgaGdyb3VwIGh0bWwgaSBpZnJhbWUgaW5zIGtleWdlbiBrYmQgbGFiZWwgbGVnZW5kIGxpIG1hcCBtYXJrIG1lbnUgbWV0ZXIgbmF2IG5vZnJhbWVzIG5vc2NyaXB0IG9iamVjdCBvbCBvcHRncm91cCBvcHRpb24gb3V0cHV0IHAgcHJlIHByb2dyZXNzIHEgcnAgcnQgcnVieSBzIHNhbXAgc2NyaXB0IHNlY3Rpb24gc2VsZWN0IHNtYWxsIHNvdXJjZSBzcGFuIHN0cmlrZSBzdHJvbmcgc3R5bGUgc3ViIHN1bW1hcnkgc3VwIHRhYmxlIHRib2R5IHRkIHRleHRhcmVhIHRmb290IHRoIHRoZWFkIHRpbWUgdGl0bGUgdHIgdHQgdSB1bCB2YXIgdmlkZW8gd2JyIHhtcCcuc3BsaXQgJyAnXHJcbiAgb3BlbiA9ICdhcmVhIGJhc2UgYnIgY29sIGNvbW1hbmQgY3NzICFET0NUWVBFIGVtYmVkIGhyIGltZyBpbnB1dCBrZXlnZW4gbGluayBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnInLnNwbGl0ICcgJ1xyXG4gIFxyXG4gIG5lc3RhYmxlTm9kZU5hbWVzID0gW1xyXG4gICAgJ2RpdicgXHJcbiAgICAnc3BhbicgXHJcbiAgICAnaDEnIFxyXG4gICAgJ2gyJyBcclxuICAgICdoMycgXHJcbiAgICAnaDQnIFxyXG4gICAgJ2g1JyBcclxuICAgICdoNicgXHJcbiAgICAncCcgXHJcbiAgICAnZmllbGRzZXQnIFxyXG4gICAgJ3NlbGVjdCcgXHJcbiAgICAnb2wnIFxyXG4gICAgJ3VsJyBcclxuICAgICd0YWJsZSdcclxuICBdXHJcbiAgICAgIFxyXG4gICNUaGlzIGxpc3QgaXMgbm90IHlldCBleGhhdXN0aXZlLCBqdXN0IGV4Y2x1ZGUgdGhlIG9idmlvdXNcclxuICBub25OZXN0YWJsZU5vZGVzID0gW1xyXG4gICAgJ2xpJ1xyXG4gICAgJ2xlZ2VuZCdcclxuICAgICd0cidcclxuICAgICd0ZCdcclxuICAgICdvcHRpb24nXHJcbiAgICAnYm9keSdcclxuICAgICdoZWFkJ1xyXG4gICAgJ3NvdXJjZSdcclxuICAgICd0Ym9keSdcclxuICAgICd0Zm9vdCdcclxuICAgICd0aGVhZCdcclxuICAgICdsaW5rJ1xyXG4gICAgJ3NjcmlwdCdcclxuICBdXHJcbiBcclxuICAjIyNcclxuICBGZXRjaCBhIG5vZGUgZnJvbSB0aGUgRE9NIGFuZCByZXR1cm4gYW4gT0onZmllZCBpbnN0YW5jZSBvZiB0aGUgZWxlbWVudFxyXG4gICMjI1xyXG4gIE9KLm5vZGVzLnJlZ2lzdGVyICdnZXQnLCAoaWQsIHRhZ05hbWUgPSAnZGl2JykgLT5cclxuICAgIHJldCA9IG51bGxcclxuICAgIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgaWRcclxuICAgIGlmIGVsXHJcbiAgICAgIHRoaW5FbCA9IE9KLnJlc3RvcmVFbGVtZW50IGVsLCB0YWdOYW1lXHJcbiAgICBpZiB0aGluRWxcclxuICAgICAgcmV0ID0gT0oubm9kZXMuZmFjdG9yeSB0aGluRWwsIG51bGwsIDBcclxuICAgIFxyXG4gICAgcmV0XHJcbiAgXHJcbiAgbm9kZU5hbWVzID0gW1xyXG4gICAgJ2EnXHJcbiAgICAnYidcclxuICAgICdicidcclxuICAgICdidXR0b24nXHJcbiAgICAnZGl2J1xyXG4gICAgJ2VtJ1xyXG4gICAgJ2ZpZWxkc2V0J1xyXG4gICAgJ2Zvcm0nXHJcbiAgICAnaDEnXHJcbiAgICAnaDInXHJcbiAgICAnaDMnXHJcbiAgICAnaDQnXHJcbiAgICAnaDUnXHJcbiAgICAnaDYnXHJcbiAgICAnaSdcclxuICAgICdpbWcnXHJcbiAgICAnaW5wdXQnXHJcbiAgICAnbGFiZWwnXHJcbiAgICAnbGVnZW5kJ1xyXG4gICAgJ2xpJ1xyXG4gICAgJ25hdidcclxuICAgICdvbCdcclxuICAgICdvcHRpb24nXHJcbiAgICAncCdcclxuICAgICdzZWxlY3QnXHJcbiAgICAnc3BhbidcclxuICAgICdzdHJvbmcnXHJcbiAgICAnc3VwJ1xyXG4gICAgJ3N2ZydcclxuICAgICd0YWJsZSdcclxuICAgICd0Ym9keSdcclxuICAgICd0ZCdcclxuICAgICd0ZXh0YXJlYSdcclxuICAgICd0aCdcclxuICAgICd0aGVhZCdcclxuICAgICd0cidcclxuICAgICd1bCdcclxuICBdXHJcbiAgXHJcbiAgbWFrZUFkZCA9ICh0YWdOYW1lLCBlbCwgY291bnQpIC0+XHJcbiAgICAob3B0cykgLT5cclxuICAgICAgbWV0aG9kID0gT0oubm9kZXNbdGFnTmFtZV0gb3IgT0ouY29tcG9uZW50c1t0YWdOYW1lXSBvciBPSi5jb250cm9sc1t0YWdOYW1lXSBvciBPSi5pbnB1dHNbdGFnTmFtZV1cclxuICAgICAgaWYgbWV0aG9kXHJcbiAgICAgICAgbnUgPSBtZXRob2Qgb3B0cywgZWwsIHRydWVcclxuICAgICAgZWxzZSBcclxuICAgICAgICBudSA9IE9KLmNvbXBvbmVudCBudWxsLCBlbCwgdGFnTmFtZSAgICBcclxuICAgICAgT0oubm9kZXMuZmFjdG9yeSBudSwgZWwsIGNvdW50XHJcbiAgXHJcbiAgYWRkTWFrZU1ldGhvZCA9IChlbCwgY291bnQpIC0+XHJcbiAgICBtZXRob2RzID0gT0oub2JqZWN0KClcclxuICAgIGVsLm1ha2UgPSAodGFnTmFtZSwgb3B0cykgLT5cclxuICAgICAgbWV0aG9kID0gbWV0aG9kc1t0YWdOYW1lXVxyXG4gICAgICBpZiBub3QgbWV0aG9kXHJcbiAgICAgICAgbWV0aG9kID0gbWFrZUFkZCB0YWdOYW1lLCBlbCwgY291bnRcclxuICAgICAgICBtZXRob2RzW3RhZ05hbWVdID0gbWV0aG9kXHJcbiAgICAgIG1ldGhvZCBvcHRzXHJcbiAgICBlbFxyXG4gIFxyXG4gIG1ha2VVbmlxdWVJZCA9IChlbCwgcGFyZW50LCBjb3VudCkgLT5cclxuICAgIGlmIE9KLkdFTkVSQVRFX1VOSVFVRV9JRFNcclxuICAgICAgY291bnQgKz0gMVxyXG4gICAgICBpZiBjb3VudCA8PSBwYXJlbnQuY291bnQgdGhlbiBjb3VudCA9IHBhcmVudC5jb3VudCArIDFcclxuICAgICAgcGFyZW50LmNvdW50ID0gY291bnRcclxuICAgICAgXHJcbiAgICAgIGlmIG5vdCBlbC5nZXRJZCgpXHJcbiAgICAgICAgaWQgPSBwYXJlbnQuZ2V0SWQoKSBvciAnJ1xyXG4gICAgICAgIGlkICs9IGVsLnRhZ05hbWUgKyBjb3VudFxyXG4gICAgICAgIGVsLmF0dHIgJ2lkJywgaWRcclxuICAgIHJldHVyblxyXG4gICAgICAgIFxyXG4gICMjI1xyXG4gIEV4dGVuZHMgYSBPSiBDb250cm9sIGNsYXNzIHdpdGggYWxsIHRoZSAocGVybWl0dGVkKSBtZXRob2RzIG9uIHRoZSBmYWN0b3J5XHJcbiAgIyMjXHJcbiAgT0oubm9kZXMucmVnaXN0ZXIgJ2ZhY3RvcnknLCAoZWwsIHBhcmVudCA9IE9KLmJvZHksIGNvdW50ID0gcGFyZW50LmNvdW50IG9yIDApIC0+XHJcbiAgICBcclxuICAgICMgMTogZm9yIGNsYXJpdHksIHdlIGFyZSByZXR1cm5pbmcgdGhlIGV4dGVuZGVkIGVsZW1lbnRcclxuICAgIHJldCA9IGVsXHJcbiAgICBcclxuICAgICMgMjogSWYgdGhlIGVsZW1lbnQgaGFzIG5ldmVyIGJlZW4gaW5pdGlhbGl6ZWQsIGNvbnRpbnVlXHJcbiAgICBpZiBub3QgZWwuaXNGdWxseUluaXRcclxuICAgICAgXHJcbiAgICAgICMgMzogQXMgbG9uZyBhcyB0aGUgZWxlbWVudCBpc24ndCB0aGUgYm9keSBub2RlLCBjb250aW51ZVxyXG4gICAgICBpZiBlbC50YWdOYW1lIGlzbnQgJ2JvZHknIFxyXG4gICAgICAgICMgNDogRXh0ZW5kIHRoZSBlbGVtZW50IHdpdGggc3RhbmRhcmQgalF1ZXJ5IEFQSSBtZXRob2RzXHJcbiAgICAgICAgcmV0ID0gT0ouZG9tIGVsLCBwYXJlbnRcclxuICAgICAgICBcclxuICAgICAgICAjIDU6IElmIHRoZSBub2RlIGlzbid0IGluIHRoZSBET00sIGFwcGVuZCBpdCB0byB0aGUgcGFyZW50XHJcbiAgICAgICAgIyBUaGlzIGFsc28gYWNjb21tb2RhdGVzIGRvY3VtZW50IGZyYWdtZW50cywgd2hpY2ggYXJlIG5vdCBpbiB0aGUgRE9NIGJ1dCBhcmUgcHJlc3VtZWQgdG8gYmUgc291bmQgdW50aWwgcmVhZHkgZm9yIG1hbnVhbCBpbnNlcnRpb25cclxuICAgICAgICBpZiBub3QgcmV0LmlzSW5ET01cclxuICAgICAgICAgIG1ha2VVbmlxdWVJZCBlbCwgcGFyZW50LCBjb3VudFxyXG4gICAgICAgICAgcGFyZW50LmFwcGVuZCByZXRbMF1cclxuICAgICAgICAgICMgNjogQmluZCBhbnkgZGVmaW5lZCBldmVudHMgYWZ0ZXIgdGhlIG5vZGUgaXMgaW4gdGhlIERPTVxyXG4gICAgICAgICAgcmV0LmJpbmRFdmVudHMoKVxyXG4gICAgICAgICAgcmV0LmlzSW5ET00gPSB0cnVlXHJcbiAgICAgICAgXHJcbiAgICAgICAgIyA3OiBDcmVhdGUgdGhlIGFsbCBpbXBvcnRhbnQgJ21ha2UnIG1ldGhvZFxyXG4gICAgICAgIGFkZE1ha2VNZXRob2QgcmV0LCBjb3VudFxyXG4gICAgICAgIFxyXG4gICAgICAgICMgODogUHJldmVudCBkdXBsaWNhdGUgZmFjdG9yeSBleHRlbnNpb24gYnkgc2V0dGluZyBpcyBpbml0ID0gdHJ1ZVxyXG4gICAgICAgIHJldC5pc0Z1bGx5SW5pdCA9IHRydWUgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICMgOTogaWYgdGhlIG5vZGUgc3VwcG9ydHMgaXQsIGNhbGwgZmluYWxpemVcclxuICAgICAgICBmaW5hbGl6ZSA9IF8ub25jZSByZXQuZmluYWxpemUgb3IgT0oubm9vcFxyXG4gICAgICAgIHJldC5maW5hbGl6ZSA9IGZpbmFsaXplXHJcbiAgICAgICAgZmluYWxpemUgcmV0XHJcbiAgICAgICAgXHJcbiAgICAjIDEwOiBSZXR1cm4gdGhlIGV4dGVuZGVkIGVsZW1lbnQgICAgXHJcbiAgICByZXRcclxuXHJcbiAgaW5pdEJvZHkgPSAoIC0+XHJcbiAgICBPSi5ib2R5LmNvdW50ID0gMFxyXG4gICAgT0ouYm9keS5yb290ID0gbnVsbFxyXG4gICAgT0ouZG9tIE9KLmJvZHksIG51bGxcclxuICAgIGFkZE1ha2VNZXRob2QgT0ouYm9keSwgMFxyXG4gICAgT0ouYm9keS5pc0Z1bGx5SW5pdCA9IHRydWVcclxuICApKClcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuIiwiIyAjIGFcclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICAndXNlIHN0cmljdCdcclxuICBcclxuICBub2RlTmFtZSA9ICdhJ1xyXG4gIFxyXG4gIE9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIGlkOiAnJ1xyXG4gICAgICAgIGNsYXNzOiAnJ1xyXG4gICAgICAgIHRleHQ6ICcnXHJcbiAgICAgICAgaHJlZjogJ2phdmFTY3JpcHQ6dm9pZCgwKTsnXHJcbiAgICAgICAgdHlwZTogJydcclxuICAgICAgICB0aXRsZTogJydcclxuICAgICAgICByZWw6ICcnXHJcbiAgICAgICAgbWVkaWE6ICcnXHJcbiAgICAgICAgdGFyZ2V0OiAnJ1xyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHRvZ2dsZVN0YXRlID0gJ29mZidcclxuICAgIFxyXG4gICAgdG9nZ2xlID0gLT5cclxuICAgICAgaWYgdG9nZ2xlU3RhdGUgaXMgJ29uJ1xyXG4gICAgICAgIHRvZ2dsZVN0YXRlID0gJ29mZidcclxuICAgICAgZWxzZSB0b2dnbGVTdGF0ZSA9ICdvbicgIGlmIHRvZ2dsZVN0YXRlIGlzICdvZmYnXHJcbiAgICAgIHJldHVyblxyXG4gICAgXHJcbiAgICAjIENsaWNrIGJpbmRpbmdcclxuICAgIGlmIGRlZmF1bHRzLmV2ZW50cy5jbGljayBpc250IE9KLm5vb3BcclxuICAgICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICAgICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgICAgdG9nZ2xlKClcclxuICAgICAgICByZXRWYWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICAgIGlmIGRlZmF1bHRzLmhyZWYgaXMgJyMnIHRoZW4gcmV0VmFsID0gZmFsc2VcclxuICAgICAgICByZXRWYWxcclxuICAgICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuICAgIGVsc2VcclxuICAgICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gdG9nZ2xlICAgIFxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cy5wcm9wcywgZGVmYXVsdHMuc3R5bGVzLCBkZWZhdWx0cy5ldmVudHMsIGRlZmF1bHRzLnRleHRcclxuICAgIFxyXG5cclxuICAgIGlmIGZhbHNlIGlzIGNhbGxlZEZyb21GYWN0b3J5IHRoZW4gT0oubm9kZXMuZmFjdG9yeSByZXQsIG93bmVyXHJcblxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCIjICMgYnJcclxuXHJcbmRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgXHJcbiAgbm9kZU5hbWUgPSAnYnInXHJcbiAgXHJcbiAgT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6IHt9XHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICAgIG51bWJlcjogMSAgXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgaSA9IDBcclxuICAgIHdoaWxlIGkgPCBPSi50by5udW1iZXIgZGVmYXVsdHMubnVtYmVyXHJcbiAgICAgICMgSW4gdGhlIGNhc2Ugb2YgbXVsdGlwbGUgYnJzLCBpdCBpcyBkZXNpcmFibGUgdG8gb25seSBnZXQgdGhlIGxhc3Qgb25lIG91dFxyXG4gICAgICByZXQgPSBPSi5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cy5wcm9wcywgZGVmYXVsdHMuc3R5bGVzLCBkZWZhdWx0cy5ldmVudHMsIGRlZmF1bHRzLnRleHRcclxuICAgICAgXHJcbiAgICAgIGkgKz0gMVxyXG5cclxuICAgIGlmIGZhbHNlIGlzIGNhbGxlZEZyb21GYWN0b3J5IHRoZW4gT0oubm9kZXMuZmFjdG9yeSByZXQsIG93bmVyXHJcblxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCIjICMgZm9ybVxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICAndXNlIHN0cmljdCdcclxuICBcclxuICBub2RlTmFtZSA9ICdmb3JtJ1xyXG4gIFxyXG4gIE9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOiBcclxuICAgICAgICBhY3Rpb246ICcnXHJcbiAgICAgICAgbWV0aG9kOiAnJ1xyXG4gICAgICAgIG5hbWU6ICcnXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgcmV0ID0gT0ouZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMucHJvcHMsIGRlZmF1bHRzLnN0eWxlcywgZGVmYXVsdHMuZXZlbnRzLCBkZWZhdWx0cy50ZXh0XHJcbiAgICBcclxuICAgIHJldC5hZGQgJ3ZhbGlkYXRvcicsIHJldC4kLnZhbGlkYXRlKFxyXG4gICAgICBoaWdobGlnaHQ6IChlbGVtZW50KSAtPlxyXG4gICAgICAgICRlbG0gPSAkKGVsZW1lbnQpXHJcbiAgICAgICAgJGVsbS5hdHRyICdPSl9pbnZhbGlkJywgJzEnXHJcbiAgICAgICAgJGVsbS5hbmltYXRlIGJhY2tncm91bmRDb2xvcjogJ3JlZCdcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIHVuaGlnaGxpZ2h0OiAoZWxlbWVudCkgLT5cclxuICAgICAgICAkZWxtID0gJChlbGVtZW50KVxyXG4gICAgICAgIGlmICRlbG0uYXR0cignT0pfaW52YWxpZCcpIGlzICcxJ1xyXG4gICAgICAgICAgJGVsbS5jc3MgJ2JhY2tncm91bmQtY29sb3InLCAneWVsbG93J1xyXG4gICAgICAgICAgJGVsbS5hdHRyICdPSl9pbnZhbGlkJywgJzAnXHJcbiAgICAgICAgICBzZXRUaW1lb3V0ICgtPlxyXG4gICAgICAgICAgICAgICRlbG0uYW5pbWF0ZSBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcclxuICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICksIDUwMFxyXG4gICAgICAgIHJldHVyblxyXG4gICAgKVxyXG4gICAgICBcclxuICAgIHJldC5hZGQgJ2lzRm9ybVZhbGlkJywgLT5cclxuICAgICAgcmV0LiQudmFsaWQoKSBhbmQgKG5vdCByZXQudmFsaWRhdG9yLmludmFsaWRFbGVtZW50cygpIG9yIHJldC52YWxpZGF0b3IuaW52YWxpZEVsZW1lbnRzKCkubGVuZ3RoIGlzIDApXHJcbiAgICBcclxuICAgIFxyXG4gICAgXHJcbiAgICBpZiBmYWxzZSBpcyBjYWxsZWRGcm9tRmFjdG9yeSB0aGVuIE9KLm5vZGVzLmZhY3RvcnkgcmV0LCBvd25lclxyXG5cclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuXHJcbiIsIiMgIyBpbnB1dFxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICAndXNlIHN0cmljdCdcclxuICBcclxuICBub2RlTmFtZSA9ICdpbnB1dCdcclxuICBcclxuICBPSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiAndGV4dCdcclxuICAgICAgICB2YWx1ZTogJydcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgICBjaGFuZ2U6IE9KLm5vb3BcclxuICAgICAgICBmb2N1c291dDogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgaWYgbm90IGRlZmF1bHRzLnByb3BzLnR5cGUgb3Igbm90IE9KLmVudW1zLmlucHV0VHlwZXNbZGVmYXVsdHMucHJvcHMudHlwZV1cclxuICAgICAgdGhyb3cgbmV3IEVycm9yICdObyBtYXRjaGluZyBpbnB1dCB0eXBlIGZvciB7JyArIGRlZmF1bHRzLnByb3BzLnR5cGUgKyAnfSBjb3VsZCBiZSBmb3VuZC4nXHJcbiAgICB0aGlzVHlwZSA9IE9KLmVudW1zLmlucHV0VHlwZXNbZGVmYXVsdHMucHJvcHMudHlwZV1cclxuICAgIFxyXG4gICAgc3luY1ZhbHVlID0gLT5cclxuICAgICAgc3dpdGNoIHRoaXNUeXBlXHJcbiAgICAgICAgd2hlbiBPSi5lbnVtcy5pbnB1dFR5cGVzLmNoZWNrYm94XHJcbiAgICAgICAgICByZXQudmFsdWUgPSByZXQuJC5pcyAnOmNoZWNrZWQnXHJcbiAgICAgICAgd2hlbiBPSi5lbnVtcy5pbnB1dFR5cGVzLnJhZGlvXHJcbiAgICAgICAgICByZXQudmFsdWUgPSByZXQuJC5maW5kKCc6Y2hlY2tlZCcpLnZhbCgpXHJcbiAgICAgICAgZWxzZSAgXHJcbiAgICAgICAgICByZXQudmFsdWUgPSByZXQudmFsKClcclxuICAgICAgcmV0LnZhbHVlICAgIFxyXG4gICAgXHJcbiAgICAjIyMgXHJcbiAgICAgIENsaWNrIGJpbmRpbmcuIElmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGNsaWNrIGhhbmRsZXIsIFxyXG4gICAgICB3cmFwIGl0LCBzeW5jIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQgZmlyc3QsIFxyXG4gICAgICB0aGVuIGNhbGwgdGhlIGRlZmluZWQgY2xpY2sgaGFuZGxlciB3aXRoIHRoZSBsYXRlc3QgdmFsdWUuXHJcbiAgICAjIyMgIFxyXG4gICAgb2xkQ2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICAgIGlmIG9sZENsaWNrIGFuZCBvbGRDbGljayBpc250IE9KLm5vb3BcclxuICAgICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgICBvbGRDbGljayByZXQudmFsdWUsIGV2ZW50Li4uXHJcbiAgICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXHJcbiAgICAgICAgICBcclxuICAgICMjIyBcclxuICAgICAgQ2hhbmdlIGJpbmRpbmcuIElmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGNoYW5nZSBoYW5kbGVyLCBcclxuICAgICAgd3JhcCBpdCwgc3luYyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0IGZpcnN0LCBcclxuICAgICAgdGhlbiBjYWxsIHRoZSBkZWZpbmVkIGNoYW5nZSBoYW5kbGVyIHdpdGggdGhlIGxhdGVzdCB2YWx1ZS5cclxuICAgICMjIyBcclxuICAgIG9sZENoYW5nZSA9IGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2VcclxuICAgIGlmIG9sZENoYW5nZSBhbmQgb2xkQ2hhbmdlIGlzbnQgT0oubm9vcFxyXG4gICAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgICBvbGRDaGFuZ2UgcmV0LnZhbHVlLCBldmVudC4uLlxyXG4gICAgICBkZWZhdWx0cy5ldmVudHMuY2hhbmdlID0gbmV3Q2hhbmdlXHJcbiAgICBcclxuICAgICMjIyBcclxuICAgICAgT24gRm9jdXMgT3V0IGJpbmRpbmcuIEFsd2F5cyB1c2UgdGhlIGV2ZW50IHRvIHVwZGF0ZSB0aGUgaW50ZXJuYWxcclxuICAgICAgdmFsdWUgb2YgdGhlIGNvbnRyb2w7IGFuZCBpZiB0aGUgY2FsbGVyIGRlZmluZWQgYSBmb2N1c291dCBldmVudCxcclxuICAgICAgd3JhcCBpdCBhbmQgaW52b2tlIGl0IHdpdGggdGhlIGxhdGVzdCB2YWx1ZVxyXG4gICAgIyMjIFxyXG4gICAgb2xkRm9jdXNvdXQgPSBkZWZhdWx0cy5ldmVudHMuZm9jdXNvdXRcclxuICAgIG5ld0ZvY3Vzb3V0ID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICBpZiBvbGRGb2N1c291dCBhbmQgb2xkRm9jdXNvdXQgaXNudCBPSi5ub29wIFxyXG4gICAgICAgIG9sZEZvY3Vzb3V0IHJldC52YWx1ZSwgZXZlbnQuLi5cclxuICAgICAgICBcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5mb2N1c291dCA9IG5ld0ZvY3Vzb3V0XHJcbiAgICBcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMucHJvcHMsIGRlZmF1bHRzLnN0eWxlcywgZGVmYXVsdHMuZXZlbnRzLCBkZWZhdWx0cy50ZXh0XHJcbiAgICByZXQudmFsdWUgPSBkZWZhdWx0cy5wcm9wcy52YWx1ZVxyXG4gICAgXHJcbiAgICBpZiBmYWxzZSBpcyBjYWxsZWRGcm9tRmFjdG9yeSB0aGVuIE9KLm5vZGVzLmZhY3RvcnkgcmV0LCBvd25lclxyXG5cclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiIyAjIG9sXHJcblxyXG5kbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gICd1c2Ugc3RyaWN0J1xyXG4gIFxyXG4gIG5vZGVOYW1lID0gJ29sJ1xyXG4gIFxyXG4gIE9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOiB7fVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIHJldCA9IE9KLmVsZW1lbnQgbm9kZU5hbWUsIGRlZmF1bHRzLnByb3BzLCBkZWZhdWx0cy5zdHlsZXMsIGRlZmF1bHRzLmV2ZW50cywgZGVmYXVsdHMudGV4dFxyXG4gICAgXHJcbiAgICBcclxuICAgIGlmIGZhbHNlIGlzIGNhbGxlZEZyb21GYWN0b3J5IHRoZW4gT0oubm9kZXMuZmFjdG9yeSByZXQsIG93bmVyXHJcblxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcbiIsIiMgIyBzZWxlY3RcclxuXHJcbmRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgXHJcbiAgbm9kZU5hbWUgPSAnc2VsZWN0J1xyXG4gIFxyXG4gIE9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOiBcclxuICAgICAgICBzZWxlY3RlZDogJydcclxuICAgICAgICBtdWx0aXBsZTogZmFsc2VcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICB2YWx1ZXM6IFtdXHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgICAgIGNoYW5nZTogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgdmFsdWUgPSAnJ1xyXG4gICAgdmFsdWVzID0gW11cclxuICAgIGhhc0VtcHR5ID0gZmFsc2U7XHJcbiAgICBcclxuICAgIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICAgIHZhbHVlID0gcmV0LnZhbCgpXHJcbiAgICBcclxuICAgICMgQ2xpY2sgYmluZGluZ1xyXG4gICAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cclxuICAgICAgICByZXR2YWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgICAgcmV0dmFsXHJcbiAgICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXHJcbiAgICAgICAgICBcclxuICAgICMgQ2hhbmdlIGJpbmRpbmdcclxuICAgIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICAgIGNoYW5nZSA9IGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2VcclxuICAgICAgbmV3Q2hhbmdlID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxyXG4gICAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgICAgcmV0dmFsXHJcbiAgICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMucHJvcHMsIGRlZmF1bHRzLnN0eWxlcywgZGVmYXVsdHMuZXZlbnRzLCBkZWZhdWx0cy50ZXh0XHJcbiAgICBcclxuICAgIHJldC5hZGQgJ3NlbGVjdGVkRGF0YScsIChwcm9wTmFtZSkgLT5cclxuICAgICAgcmV0ID0gJydcclxuICAgICAgaWYgcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykgYW5kIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdXHJcbiAgICAgICAgZGF0YXNldCA9IHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdLmRhdGFzZXRcclxuICAgICAgICByZXQgPSBkYXRhc2V0W3Byb3BOYW1lXSAgaWYgZGF0YXNldFxyXG4gICAgICByZXRcclxuXHJcbiAgICByZXQuYWRkICdzZWxlY3RlZFRleHQnLCAtPlxyXG4gICAgICByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS50ZXh0KClcclxuXHJcbiAgICByZXQuYWRkICdzZWxlY3RlZFZhbCcsIC0+XHJcbiAgICAgIHZhbHVlID0gcmV0LnZhbCgpXHJcbiAgICAgIHZhbHVlXHJcblxyXG4gICAgcmV0LmFkZCAnYWRkT3B0aW9uJywgKHZhbHVlLCB0ZXh0ID0gdmFsdWUsIHNlbGVjdGVkID0gZmFsc2UsIGRpc2FibGVkID0gZmFsc2UpIC0+XHJcbiAgICAgIGlzRW1wdHkgPSBfLmlzRW1wdHkgdmFsdWVcclxuICAgICAgYWRkID0gZmFsc2VcclxuICAgICAgaWYgaXNFbXB0eSBhbmQgZmFsc2UgaXMgaGFzRW1wdHkgXHJcbiAgICAgICAgaGFzRW1wdHkgPSB0cnVlIFxyXG4gICAgICAgIGFkZCA9IHRydWVcclxuICAgICAgaWYgZmFsc2UgaXMgYWRkIGFuZCBmYWxzZSBpcyBpc0VtcHR5IHRoZW4gYWRkID0gdHJ1ZSAgXHJcbiAgICAgIGlmIGFkZFxyXG4gICAgICAgICAgdmFsID0gXHJcbiAgICAgICAgICAgIHRleHQ6IHRleHRcclxuICAgICAgICAgICAgcHJvcHM6XHJcbiAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICBpZiBzZWxlY3RlZFxyXG4gICAgICAgICAgICB2YWwuc2VsZWN0ZWQgPSBzZWxlY3RlZFxyXG4gICAgICAgICAgaWYgZGlzYWJsZWQgIFxyXG4gICAgICAgICAgICB2YWwuZGlzYWJsZWQgPSBkaXNhYmxlZFxyXG4gICAgICAgICAgb3B0aW9uID0gcmV0Lm1ha2UgJ29wdGlvbicsIHZhbFxyXG4gICAgICAgICAgb3B0aW9uXHJcblxyXG4gICAgcmV0LmFkZCAnYWRkT3B0aW9ucycsIChvcHRpb25zKSAtPlxyXG4gICAgICB2YWx1ZXMgPSBfLnVuaW9uIHZhbHVlcywgb3B0aW9uc1xyXG4gICAgICBPSi5lYWNoIG9wdGlvbnMsICgodmFsKSAtPlxyXG4gICAgICAgIHZhbHVlID0gcmV0LmFkZE9wdGlvbih2YWwpXHJcbiAgICAgICAgdmFsdWVzLnB1c2ggdmFsdWVcclxuICAgICAgICByZXR1cm5cclxuICAgICAgKSwgZmFsc2VcclxuICAgICAgdmFsdWVzXHJcblxyXG4gICAgcmV0LmFkZCAncmVzZXRPcHRpb25zJywgKHZhbHVlcykgLT5cclxuICAgICAgcmV0LmVtcHR5KClcclxuICAgICAgdmFsdWVzID0gdmFsdWVzO1xyXG4gICAgICByZXQuYWRkT3B0aW9ucyB2YWx1ZXNcclxuICAgICAgcmV0XHJcblxyXG4gICAgcmV0LmFkZCAncmVtb3ZlT3B0aW9uJywgKHZhbHVlVG9SZW1vdmUpIC0+XHJcbiAgICAgIHZhbHVlcy5zcGxpY2UgdmFsdWVzLmluZGV4T2YodmFsdWVUb1JlbW92ZSksIDEgI3JlbW92ZXMgdGhlIGl0ZW0gZnJvbSB0aGUgbGlzdFxyXG4gICAgICBzZWxlY3RDb250cm9sID0gcmV0WzBdXHJcbiAgICAgIGkgPSAwXHJcblxyXG4gICAgICB3aGlsZSBpIDwgc2VsZWN0Q29udHJvbC5sZW5ndGhcclxuICAgICAgICBzZWxlY3RDb250cm9sLnJlbW92ZSBpICBpZiBzZWxlY3RDb250cm9sLm9wdGlvbnNbaV0udmFsdWUgaXMgdmFsdWVUb1JlbW92ZVxyXG4gICAgICAgIGkrK1xyXG4gICAgICByZXR1cm5cclxuICAgIFxyXG4gICAgXHJcbiAgICBcclxuICAgIGlmIGRlZmF1bHRzLnZhbHVlcy5sZW5ndGggPiAwXHJcbiAgICAgIHJldC5hZGRPcHRpb25zIGRlZmF1bHRzLnZhbHVlc1xyXG4gICAgXHJcbiAgICBpZiBmYWxzZSBpcyBjYWxsZWRGcm9tRmFjdG9yeSB0aGVuIE9KLm5vZGVzLmZhY3RvcnkgcmV0LCBvd25lclxyXG5cclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG4iLCIjICMgdGFibGVcclxuXHJcbmRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgXHJcbiAgbm9kZU5hbWUgPSAndGFibGUnXHJcbiAgXHJcbiAgIyMjXHJcbiAgQ3JlYXRlIGFuIEhUTUwgdGFibGUuIFByb3ZpZGVzIGhlbHBlciBtZXRob2RzIHRvIGNyZWF0ZSBDb2x1bW5zIGFuZCBDZWxscy5cclxuICAjIyNcclxuICB0YWJsZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcbiAgICBcclxuICAgICMgIyMgb3B0aW9uc1xyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICAjICMjIyBkYXRhXHJcbiAgICAgICMgb3B0aW9uYWwgYXJyYXkgb2Ygb2JqZWN0cy4gaWYgcHJvdmlkZWQgd2lsbCBnZW5lcmF0ZSB0YWJsZSBhdXRvbWF0aWNhbGx5LlxyXG4gICAgICBkYXRhOiBudWxsXHJcbiAgICAgICMgIyMjIHByb3BzXHJcbiAgICAgICMgb3B0aW9uYWwgcHJvcGVydGllcyB0byBhcHBseSB0byB0YWJsZSByb290IG5vZGVcclxuICAgICAgcHJvcHM6IFxyXG4gICAgICAgIGNlbGxwYWRkaW5nOiAwXHJcbiAgICAgICAgY2VsbHNwYWNpbmc6IDBcclxuICAgICAgICBhbGlnbjogJydcclxuICAgICAgICB3aWR0aDogJydcclxuICAgICAgICBjZWxsYWxpZ246ICdsZWZ0J1xyXG4gICAgICAgIGNlbGx2YWxpZ246ICd0b3AnXHJcbiAgICAgICAgY2xhc3M6ICcnXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOiB7fVxyXG4gICAgICAjICMjIyBjZWxsc1xyXG4gICAgICAjIG9wdGlvbmFsIHByb3BlcnRpZXMgdG8gYXBwbHkgdG8gaW5kaXZpZHVhbCBjZWxsc1xyXG4gICAgICBjZWxsczpcclxuICAgICAgICBjbGFzczogJydcclxuICAgICAgICBhbGlnbjogJydcclxuICAgICAgICAndmVydGljYWwtYWxpZ24nOiAnJ1xyXG4gICAgICAgIGNlbGxwYWRkaW5nOiAnJ1xyXG4gICAgICAgIG1hcmdpbjogJydcclxuICAgICAgIyAjIyMgdGhlYWRcclxuICAgICAgIyBvcHRpb25hbCBvcHRpb25zIG9iamVjdCB0byBwYXNzIGludG8gdGhlYWQgY3JlYXRpb24gIFxyXG4gICAgICB0aGVhZDoge31cclxuICAgICAgIyAjIyMgdGJvZHlcclxuICAgICAgIyBvcHRpb25hbCBvcHRpb25zIG9iamVjdCB0byBwYXNzIGludG8gdGJvZHkgY3JlYXRpb25cclxuICAgICAgdGJvZHk6IHt9XHJcblxyXG4gICAgICBmaXJzdEFsaWduUmlnaHQ6IGZhbHNlXHJcbiAgICAgIG9kZEFsaWduUmlnaHQ6IGZhbHNlXHJcbiAgICBcclxuICAgIHJvd3MgPSBbXVxyXG4gICAgY2VsbHMgPSBPSi5hcnJheTJEKClcclxuICAgIGNvbHVtbkNvdW50ID0gMFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIHJldCA9IE9KLmVsZW1lbnQgbm9kZU5hbWUsIGRlZmF1bHRzLnByb3BzLCBkZWZhdWx0cy5zdHlsZXMsIGRlZmF1bHRzLmV2ZW50cywgZGVmYXVsdHMudGV4dFxyXG4gICAgaWYgZmFsc2UgaXMgY2FsbGVkRnJvbUZhY3RvcnkgdGhlbiBPSi5ub2Rlcy5mYWN0b3J5IHJldCwgb3duZXJcclxuICAgIFxyXG4gICAgdGJvZHkgPSBudWxsXHJcbiAgICB0aGVhZCA9IG51bGxcclxuICAgIHRoZWFkUm93ID0gbnVsbFxyXG4gICAgXHJcbiAgICAjICMjIyBpbml0XHJcbiAgICAjIGludGVybmFsIG1ldGhvZCBmb3Igb25lIHRpbWUgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHRhYmxlXHJcbiAgICBpbml0ID0gXy5vbmNlIC0+ICBcclxuICAgICAgaWYgZGVmYXVsdHMuZGF0YVxyXG4gICAgICAgIHRibFN0ciA9IENvbnZlcnRKc29uVG9UYWJsZSBkZWZhdWx0cy5kYXRhXHJcbiAgICAgIGlmIHRibFN0clxyXG4gICAgICAgIGpUYmwgPSAkIHRibFN0clxyXG4gICAgICAgIFxyXG4gICAgICAgIGpIZWFkID0galRibC5maW5kICd0aGVhZCdcclxuICAgICAgICByZXQuJC5hcHBlbmQgakhlYWRcclxuICAgICAgICB0aGVhZCA9IE9KLnJlc3RvcmVFbGVtZW50IGpIZWFkWzBdXHJcbiAgICAgICAgdGhlYWRSb3cgPSBPSi5yZXN0b3JlRWxlbWVudCB0aGVhZFswXS5yb3dzWzBdXHJcbiAgICAgICAgXHJcbiAgICAgICAgakJvZHkgPSBqVGJsLmZpbmQgJ3Rib2R5J1xyXG4gICAgICAgIHJldC4kLmFwcGVuZCBqQm9keVxyXG4gICAgICAgIHRib2R5ID0gT0oucmVzdG9yZUVsZW1lbnQgakJvZHlbMF1cclxuICAgICAgICBcclxuICAgICAgICBsb2FkQ2VsbHMoKVxyXG4gICAgICBlbHNlICBcclxuICAgICAgICB0aGVhZCA9IHJldC5tYWtlICd0aGVhZCcsIGRlZmF1bHRzLnRoZWFkXHJcbiAgICAgICAgdGhlYWRSb3cgPSB0aGVhZC5tYWtlICd0cidcclxuICAgICAgICB0Ym9keSA9IHJldC5tYWtlICd0Ym9keScsIGRlZmF1bHRzLnRib2R5XHJcbiAgICAgICAgcm93cy5wdXNoIHRib2R5Lm1ha2UgJ3RyJ1xyXG4gICAgICByZXRcclxuICAgIFxyXG4gICAgIyAjIyMgbG9hZENlbGxzXHJcbiAgICAjIGludGVybmFsIG1ldGhvZCBndWFyYW50ZWVzIHRoYXQgdGFibGVzIGxvYWRlZCBmcm9tIEpTT04gYXJlIGZ1bGx5IGxvYWRlZCBpbnRvIG1lbW9yeVxyXG4gICAgbG9hZENlbGxzID0gKCkgLT5cclxuICAgICAgciA9IDBcclxuICAgICAgd2hpbGUgdGJvZHlbMF0ucm93cy5sZW5ndGggPiByXHJcbiAgICAgICAgYyA9IDBcclxuICAgICAgICBtZW1Sb3cgPSBPSi5yZXN0b3JlRWxlbWVudCB0Ym9keVswXS5yb3dzW3JdXHJcbiAgICAgICAgcm93cy5wdXNoIG1lbVJvd1xyXG4gICAgICAgIHdoaWxlIHRib2R5WzBdLnJvd3Nbcl0uY2VsbHMubGVuZ3RoID4gY1xyXG4gICAgICAgICAgbWVtQ2VsbCA9IGNlbGxzLmdldCByKzEsIGMrMVxyXG4gICAgICAgICAgaWYgbm90IG1lbUNlbGxcclxuICAgICAgICAgICAgbWVtQ2VsbCA9IE9KLnJlc3RvcmVFbGVtZW50IHRib2R5WzBdLnJvd3Nbcl0uY2VsbHNbY11cclxuICAgICAgICAgICAgY2VsbHMuc2V0IHIrMSwgYysxLCBtZW1DZWxsXHJcbiAgICAgICAgICBjICs9IDFcclxuICAgICAgICByICs9IDFcclxuICAgIFxyXG4gICAgIyAjIyMgZmlsbE1pc3NpbmdcclxuICAgICMgaW50ZXJuYWwgbWV0aG9kIGd1YXJhbnRlZXMgdGhhdCBjZWxscyBleGlzdCBmb3IgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIHRhYmxlICAgICAgICBcclxuICAgIGZpbGxNaXNzaW5nID0gKCkgLT5cclxuICAgICAgY2VsbHMuZWFjaCAocm93Tm8sIGNvbE5vLCB2YWwpIC0+XHJcbiAgICAgICAgaWYgbm90IHZhbFxyXG4gICAgICAgICAgcm93ID0gcmV0LnJvdyByb3dOb1xyXG4gICAgICAgICAgcm93LmNlbGwgY29sTm8sIHt9IFxyXG4gICAgXHJcbiAgICAjICMjIGNvbHVtblxyXG4gICAgIyBBZGRzIGEgY29sdW1uIG5hbWUgdG8gdGhlIHRhYmxlIGhlYWRcclxuICAgIHJldC5hZGQgJ2NvbHVtbicsIChjb2xObywgY29sTmFtZSkgLT5cclxuICAgICAgcmV0LmluaXQoKVxyXG4gICAgICBjb2x1bW5Db3VudCArPSAxXHJcbiAgICAgIHRoID0gbnVsbFxyXG4gICAgICBpID0gMFxyXG4gICAgICB3aGlsZSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzLmxlbmd0aCA8IGNvbE5vXHJcbiAgICAgICAgbmF0aXZlVGggPSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzW2ldXHJcbiAgICAgICAgaWYgbm90IG5hdGl2ZVRoXHJcbiAgICAgICAgICB0aCA9IHRoZWFkUm93Lm1ha2UgJ3RoJywge30gIFxyXG4gICAgICAgIGVsc2UgXHJcbiAgICAgICAgICB0aCA9IE9KLnJlc3RvcmVFbGVtZW50IG5hdGl2ZVRoLCAndGgnIFxyXG4gICAgICAgIGkgKz0gMVxyXG4gICAgICBpZiBub3QgdGhcclxuICAgICAgICBuYXRpdmVUaCA9IHRoZWFkWzBdLnJvd3NbMF0uY2VsbHNbY29sTm8tMV1cclxuICAgICAgICB0aCA9IE9KLnJlc3RvcmVFbGVtZW50IG5hdGl2ZVRoLCAndGgnXHJcbiAgICAgIHRoLnRleHQgY29sTmFtZVxyXG4gICAgICB0aFxyXG4gICAgXHJcbiAgICAjICMjIHJvd1xyXG4gICAgIyBBZGRzIGEgbmV3IHJvdyAodHIpIHRvIHRoZSB0YWJsZSBib2R5XHJcbiAgICByZXQuYWRkICdyb3cnLCAocm93Tm8sIG9wdHMpIC0+ICAgICAgICAgICAgICBcclxuICAgICAgcm93ID0gcm93c1tyb3dOby0xXVxyXG4gICAgICBcclxuICAgICAgaWYgbm90IHJvd1xyXG4gICAgICAgIHdoaWxlIHJvd3MubGVuZ3RoIDwgcm93Tm9cclxuICAgICAgICAgIHJvdyA9IHRib2R5Lm1ha2UgJ3RyJywge31cclxuICAgICAgICAgIHJvd3MucHVzaCByb3cgIFxyXG4gICAgICBcclxuICAgICAgaWYgbm90IHJvdy5jZWxsXHJcbiAgICAgICAgcm93LmFkZCAnY2VsbCcsIChjb2xObywgb3B0cykgLT5cclxuICAgICAgICAgIGNlbGwgPSBPSi5ub2Rlcy50ZCBvcHRzLCByb3dcclxuICAgICAgICAgIGNlbGxzLnNldCByb3dObywgY29sTm8sIGNlbGxcclxuICAgICAgICAgIGNlbGxcclxuICAgICAgXHJcbiAgICAgIHJvd1xyXG4gICAgXHJcbiAgICAjICMjIGNlbGwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICMgQWRkcyBhIGNlbGwgKHRyL3RkKSB0byB0aGUgdGFibGUgYm9keVxyXG4gICAgcmV0LmFkZCAnY2VsbCcsIChyb3dObywgY29sTm8sIG9wdHMpIC0+XHJcbiAgICAgIGlmIHJvd05vIDwgMSB0aGVuIHJvd05vID0gMVxyXG4gICAgICBpZiBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcclxuICAgICAgaWYgY29sdW1uQ291bnQgPiAwIGFuZCBjb2xOby0xID4gY29sdW1uQ291bnQgdGhlbiB0aHJvdyBuZXcgRXJyb3IgJ0EgY29sdW1uIG5hbWUgaGFzIG5vdCBiZWVuIGRlZmluZWQgZm9yIHRoaXMgcG9zaXRpb24geycgKyByb3dObyArICd4JyArIGNvbE5vICsgJ30uJyAgICBcclxuICAgICAgICAgIFxyXG4gICAgICByb3cgPSByZXQucm93IHJvd05vXHJcbiAgICAgIFxyXG4gICAgICBjZWxsID0gY2VsbHMuZ2V0IHJvd05vLCBjb2xOb1xyXG4gICAgICBcclxuICAgICAgaWYgbm90IGNlbGxcclxuICAgICAgICBpID0gMFxyXG4gICAgICAgIHdoaWxlIGkgPCBjb2xOb1xyXG4gICAgICAgICAgaSArPSAxXHJcbiAgICAgICAgICBpZiBpIGlzIGNvbE5vXHJcbiAgICAgICAgICAgIG51T3B0cyA9IE9KLmV4dGVuZCB7cHJvcHM6IGRlZmF1bHRzLmNlbGxzfSwgb3B0c1xyXG4gICAgICAgICAgICBjZWxsID0gcm93LmNlbGwgY29sTm8sIG51T3B0c1xyXG4gICAgICAgICAgZWxzZSAgXHJcbiAgICAgICAgICAgIHRyeUNlbGwgPSBjZWxscy5nZXQgcm93Tm8sIGlcclxuICAgICAgICAgICAgaWYgbm90IHRyeUNlbGxcclxuICAgICAgICAgICAgICB0cnlDZWxsID0gIHJvdy5jZWxsIGksIHByb3BzOiBkZWZhdWx0cy5jZWxsc1xyXG4gICAgICAgICAgXHJcbiAgICAgIGNlbGwgIFxyXG4gIFxyXG4gICAgXHJcblxyXG4gICAgIyAjIyBGaW5hbGl6ZVxyXG4gICAgIyBGaW5hbGl6ZSBndWFyYW50ZWVzIHRoYXQgdGhlYWQgYW5kIHRib2R5IGFuZCBjcmVhdGVkIHdoZW4gdGhlIG5vZGUgaXMgZnVsbHkgaW5zdGFudGlhdGVkXHJcbiAgICByZXQuYWRkICdmaW5hbGl6ZScsIC0+XHJcbiAgICAgIGluaXQoKVxyXG4gICAgICBcclxuICAgICAgIyAjIyBUSGVhZFxyXG4gICAgICAjIEV4cG9zZSB0aGUgaW50ZXJuYWwgdGhlYWQgbm9kZVxyXG4gICAgICByZXQuYWRkICd0aGVhZCcsIHRoZWFkXHJcbiAgICBcclxuICAgICAgIyAjIyBUQm9keVxyXG4gICAgICAjIEV4cG9zZSB0aGUgaW50ZXJuYWwgdGJvZHkgbm9kZVxyXG4gICAgICByZXQuYWRkICd0Ym9keScsIHRib2R5XHJcbiAgICAgIFxyXG4gICAgICByZXRcclxuICAgIFxyXG4gICAgcmV0XHJcbiAgXHJcbiAgT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIHRhYmxlXHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgXHJcbiAgbm9kZU5hbWUgPSAndGV4dGFyZWEnXHJcbiAgXHJcbiAgT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgbmFtZTogXCJcIlxyXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcIlwiXHJcbiAgICAgICAgdmFsdWU6IFwiXCJcclxuICAgICAgICB0ZXh0OiBcIlwiXHJcbiAgICAgICAgbWF4bGVuZ3RoOiBcIlwiXHJcbiAgICAgICAgYXV0b2ZvY3VzOiBmYWxzZVxyXG4gICAgICAgIGlzUmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgcm93czogM1xyXG4gICAgICAgIGNvbHM6IDI1XHJcbiAgICAgICAgZGlzYWJsZWQ6IGZhbHNlXHJcbiAgICAgICAgcmVhZG9ubHk6IGZhbHNlXHJcbiAgICAgICAgZm9ybTogXCJcIlxyXG4gICAgICAgIHdyYXA6IFwiXCJcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHZhbHVlID0gZGVmYXVsdHMucHJvcHMudmFsdWVcclxuICAgIFxyXG4gICAgc3luY1ZhbHVlID0gLT5cclxuICAgICAgc3dpdGNoIGRlZmF1bHRzLnByb3BzLnR5cGVcclxuICAgICAgICB3aGVuIE9KLmVudW1zLmlucHV0VHlwZXMuY2hlY2tib3hcclxuICAgICAgICAgIHZhbHVlID0gcmV0LiQuaXMoXCI6Y2hlY2tlZFwiKVxyXG4gICAgICAgIHdoZW4gT0ouZW51bXMuaW5wdXRUeXBlcy5yYWRpb1xyXG4gICAgICAgICAgdmFsdWUgPSByZXQuJC5maW5kKFwiOmNoZWNrZWRcIikudmFsKClcclxuICAgICAgICBlbHNlICBcclxuICAgICAgICAgIHZhbHVlID0gcmV0LnZhbCgpXHJcbiAgICBcclxuICAgICMgQ2xpY2sgYmluZGluZ1xyXG4gICAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cclxuICAgICAgICByZXR2YWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgICAgcmV0dmFsXHJcbiAgICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXHJcbiAgICAgICAgICBcclxuICAgICMgQ2hhbmdlIGJpbmRpbmdcclxuICAgIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICAgIGNoYW5nZSA9IGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2VcclxuICAgICAgbmV3Q2hhbmdlID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxyXG4gICAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgICAgcmV0dmFsXHJcbiAgICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMucHJvcHMsIGRlZmF1bHRzLnN0eWxlcywgZGVmYXVsdHMuZXZlbnRzLCBkZWZhdWx0cy50ZXh0XHJcbiAgICBcclxuICAgIFxyXG4gICAgaWYgZmFsc2UgaXMgY2FsbGVkRnJvbUZhY3RvcnkgdGhlbiBPSi5ub2Rlcy5mYWN0b3J5IHJldCwgb3duZXJcclxuXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICAndXNlIHN0cmljdCdcclxuICBcclxuICBub2RlTmFtZSA9ICd0aGVhZCdcclxuICBcclxuICBPSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuICAgIFxyXG4gICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOiB7fVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgICBudW1iZXI6IDEgIFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMucHJvcHMsIGRlZmF1bHRzLnN0eWxlcywgZGVmYXVsdHMuZXZlbnRzLCBkZWZhdWx0cy50ZXh0XHJcbiAgICBcclxuICAgIGlmIGZhbHNlIGlzIGNhbGxlZEZyb21GYWN0b3J5IHRoZW4gT0oubm9kZXMuZmFjdG9yeSByZXQsIG93bmVyXHJcblxyXG4gICAgcm93cyA9IFtdXHJcbiAgICBjZWxscyA9IHt9XHJcbiAgICByZXQuYWRkICdjZWxsJywgKHJvd05vLCBjb2xObykgLT5cclxuICAgICAgaW5pdCgpXHJcbiAgICAgIFxyXG4gICAgICBpZiByb3dObyA8IDEgdGhlbiByb3dObyA9IDFcclxuICAgICAgaWYgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXHJcbiAgICAgICAgICBcclxuICAgICAgcm93ID0gcm93c1tyb3dOby0xXVxyXG4gICAgICBcclxuICAgICAgaWYgbm90IHJvd1xyXG4gICAgICAgIHdoaWxlIHJvd3MubGVuZ3RoIDwgcm93Tm9cclxuICAgICAgICAgIHJvdyA9IE9KLm5vZGVzLnRyIHt9LCB0Ym9keSwgZmFsc2VcclxuICAgICAgICAgIHJvd3MucHVzaCByb3dcclxuICAgICAgXHJcbiAgICAgIHRkID0gcm93WzBdLmNlbGxzW2NvbE5vXVxyXG4gICAgICBcclxuICAgICAgaWYgdGQgdGhlbiBjZWxsID0gT0oucmVzdG9yZUVsZW1lbnQgdGQsICd0ZCdcclxuICAgICAgaWYgbm90IHRkXHJcbiAgICAgICAgd2hpbGUgcm93WzBdLmNlbGxzLmxlbmd0aCA8IGNvbE5vXHJcbiAgICAgICAgICBpZHggPSByb3dbMF0uY2VsbHMubGVuZ3RoXHJcbiAgICAgICAgICB0ZCA9IHJvd1swXS5jZWxsc1tpZHgtMV1cclxuICAgICAgICAgIGlmIHRkIGFuZCBpZHggaXMgY29sTm8gXHJcbiAgICAgICAgICAgIGNlbGwgPSBPSi5yZXN0b3JlRWxlbWVudCB0ZCwgJ3RkJ1xyXG4gICAgICAgICAgZWxzZSAgXHJcbiAgICAgICAgICAgIGNlbGwgPSBPSi5ub2Rlcy50ZCBwcm9wczogZGVmYXVsdHMuY2VsbHMsIHJvdywgZmFsc2VcclxuICAgICAgXHJcbiAgICAgIGlmIG5vdCBjZWxsLmlzVmFsaWRcclxuICAgICAgICBPSi5ub2Rlcy5mYWN0b3J5IGNlbGwsIHJvdywgcm93Tm8gKyBjb2xOb1xyXG4gICAgICAgICAgICBcclxuICAgICAgY2VsbCAgXHJcblxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gICd1c2Ugc3RyaWN0J1xyXG4gIFxyXG4gIG5vZGVOYW1lID0gJ3VsJ1xyXG4gIFxyXG4gIE9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOiB7fVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIHJldCA9IE9KLmVsZW1lbnQgbm9kZU5hbWUsIGRlZmF1bHRzLnByb3BzLCBkZWZhdWx0cy5zdHlsZXMsIGRlZmF1bHRzLmV2ZW50cywgZGVmYXVsdHMudGV4dFxyXG4gICAgXHJcbiAgICBcclxuICAgIGlmIGZhbHNlIGlzIGNhbGxlZEZyb21GYWN0b3J5IHRoZW4gT0oubm9kZXMuZmFjdG9yeSByZXQsIG93bmVyXHJcblxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ2J1dHRvbmlucHV0J1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogJ2J1dHRvbidcclxuICAgICAgICBzcmM6ICcnXHJcbiAgICAgICAgYWx0OiAnJ1xyXG4gICAgICAgIGhlaWdodDogJydcclxuICAgICAgICB3aWR0aDogJydcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICdjaGVja2JveCdcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIGNoZWNrZWQ6IGZhbHNlXHJcbiAgICAgIGluZGV0ZXJtaW5hdGU6IGZhbHNlXHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICBpZiBkZWZhdWx0cy5jaGVja2VkXHJcbiAgICAgIHJldC5hdHRyICdjaGVja2VkJywgdHJ1ZVxyXG4gICAgZWxzZSBpZiBkZWZhdWx0cy5pbmRldGVybWluYXRlICBcclxuICAgICAgcmV0LmF0dHIgJ2luZGV0ZXJtaW5hdGUnLCB0cnVlXHJcbiAgICAgIFxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICdjb2xvcidcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ2RhdGUnXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICdkYXRldGltZSdcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ2RhdGV0aW1lLWxvY2FsJ1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAnZW1haWwnXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgICBtdWx0aXBsZTogJydcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICdmaWxlJ1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgICAgYWNjZXB0OiAnJyBcclxuICAgICAgICBtdWx0aXBsZTogJydcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICdoaWRkZW4nXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICdpbWFnZWlucHV0J1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogJ2ltYWdlJ1xyXG4gICAgICAgIHNyYzogJydcclxuICAgICAgICBhbHQ6ICcnXHJcbiAgICAgICAgaGVpZ2h0OiAnJ1xyXG4gICAgICAgIHdpZHRoOiAnJ1xyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ21vbnRoJ1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAnbnVtYmVyJ1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAncGFzc3dvcmQnXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgICBtYXhsZW5ndGg6ICcnXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAncmFkaW8nXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgICBuYW1lOiAnJ1xyXG4gICAgICAgIHZhbHVlOiAnJ1xyXG4gICAgICAgIGNoZWNrZWQ6ICcnXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBpbnB1dE5hbWUgPSAncmFuZ2UnXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgICBtaW46IDBcclxuICAgICAgICBtYXg6IDEwMFxyXG4gICAgICAgIHZhbHVlOiA1MFxyXG4gICAgICAgIHN0ZXA6IDFcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICdyZXNldCdcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ3NlYXJjaCdcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ3N1Ym1pdCdcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ3RlbCdcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICAgIHBhdHRlcm46ICcnXHJcbiAgICAgICAgbWF4bGVuZ3RoOiAnJ1xyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ3RleHRpbnB1dCdcclxuICBcclxuICBPSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG4gICAgXHJcbiAgICBkZWZhdWx0cyA9XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIHR5cGU6ICd0ZXh0J1xyXG4gICAgICAgIGF1dG9jb21wbGV0ZTogJ29uJ1xyXG4gICAgICAgIGF1dG9zYXZlOiAnJ1xyXG4gICAgICBzdHlsZXM6IHt9XHJcbiAgICAgIGV2ZW50czpcclxuICAgICAgICBjbGljazogT0oubm9vcFxyXG4gICAgXHJcbiAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICAgIFxyXG4gICAgcmV0ID0gT0ouaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgICByZXRcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgaW5wdXROYW1lID0gJ3RpbWUnXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICd1cmwnXHJcbiAgXHJcbiAgT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuICAgIFxyXG4gICAgZGVmYXVsdHMgPVxyXG4gICAgICBwcm9wczpcclxuICAgICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgICBwYXR0ZXJuOiAnJ1xyXG4gICAgICAgIG1heGxlbmd0aDogJydcclxuICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICBldmVudHM6XHJcbiAgICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICBcclxuICAgIHJldCA9IE9KLmlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gICAgcmV0XHJcblxyXG4gIHJldHVyblxyXG5cclxuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIGlucHV0TmFtZSA9ICd3ZWVrJ1xyXG4gIFxyXG4gIE9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcbiAgICBcclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgcHJvcHM6XHJcbiAgICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIHN0eWxlczoge31cclxuICAgICAgZXZlbnRzOlxyXG4gICAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBcclxuICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gICAgXHJcbiAgICByZXQgPSBPSi5pbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICAgIHJldFxyXG5cclxuICByZXR1cm5cclxuXHJcblxyXG5cclxuIiwiIyAjIE9KXHJcbmRvICh0aGlzR2xvYmFsID0gKGlmICh0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCkgdGhlbiBnbG9iYWwgZWxzZSAoaWYgKHR5cGVvZiBzZWxmIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIHNlbGYpIHRoZW4gc2VsZiBlbHNlIChpZiAodHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIGFuZCB3aW5kb3cpIHRoZW4gd2luZG93IGVsc2UgdGhpcykpKSkgLT5cclxuICBcclxuICB1dGlsTGliID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG4gIG5hbWVTcGFjZU5hbWUgPSAnT0onXHJcblxyXG4gICMjI1xyXG4gIGJvb3Qgc3RyYXAgbmFtZSBtZXRob2QgaW50byBPYmplY3QgcHJvdG90eXBlXHJcbiAgIyMjXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgT2JqZWN0OjosXHJcbiAgICBnZXRJbnN0YW5jZU5hbWU6XHJcbiAgICAgIHZhbHVlOiAtPlxyXG4gICAgICAgIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC57MSx9KVxcKC9cclxuICAgICAgICByZXN1bHRzID0gKGZ1bmNOYW1lUmVnZXgpLmV4ZWMoQGNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpXHJcbiAgICAgICAgKGlmIChyZXN1bHRzIGFuZCByZXN1bHRzLmxlbmd0aCA+IDEpIHRoZW4gcmVzdWx0c1sxXSBlbHNlICcnKVxyXG5cclxuXHJcbiAgIyMjXHJcbiAgQW4gaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5hbWVzcGFjZSB0cmVlXHJcbiAgIyMjXHJcbiAgTnNUcmVlID0ge31cclxuICBtYWtlVGhlSnVpY2UgPSAtPlxyXG4gIFxyXG4gICAgIyMjXHJcbiAgICBJbnRlcm5hbCBuYW1lU3BhY2VOYW1lIG1ldGhvZCB0byBjcmVhdGUgbmV3ICdzdWInIG5hbWVzcGFjZXMgb24gYXJiaXRyYXJ5IGNoaWxkIG9iamVjdHMuXHJcbiAgICAjIyNcclxuICAgIG1ha2VOYW1lU3BhY2UgPSAoc3BhY2VuYW1lLCB0cmVlKSAtPlxyXG4gICAgICAjIyNcclxuICAgICAgVGhlIGRlcml2ZWQgaW5zdGFuY2UgdG8gYmUgY29uc3RydWN0ZWRcclxuICAgICAgIyMjXHJcbiAgICAgIEJhc2UgPSAobnNOYW1lKSAtPlxyXG4gICAgICAgIHByb3RvID0gdGhpc1xyXG4gICAgICAgIHRyZWVbbnNOYW1lXSA9IHRyZWVbbnNOYW1lXSBvciB7fVxyXG4gICAgICAgIG5zVHJlZSA9IHRyZWVbbnNOYW1lXVxyXG4gICAgICAgIG1lbWJlcnMgPSB7fVxyXG4gICAgICBcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgdGhpcywgJ21lbWJlcnMnLCB2YWx1ZTogbWVtYmVyc1xyXG4gICAgICBcclxuICAgICAgICAjIyNcclxuICAgICAgICBSZWdpc3RlciAoZS5nLiAnTGlmdCcpIGFuIE9iamVjdCBpbnRvIHRoZSBwcm90b3R5cGUgb2YgdGhlIG5hbWVzcGFjZS5cclxuICAgICAgICBUaGlzIE9iamVjdCB3aWxsIGJlIHJlYWRhYmxlL2V4ZWN1dGFibGUgYnV0IGlzIG90aGVyd2lzZSBpbW11dGFibGUuXHJcbiAgICAgICAgIyMjXHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoaXMsICdyZWdpc3RlcicsXHJcbiAgICAgICAgICB2YWx1ZTogKG5hbWUsIG9iaiwgZW51bWVyYWJsZSkgLT5cclxuICAgICAgICAgICAgJ3VzZSBzdHJpY3QnXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIG5hbWUuJykgIGlmICh0eXBlb2YgbmFtZSBpc250ICdzdHJpbmcnKSBvciBuYW1lIGlzICcnXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIHByb3BlcnR5IGluc3RhbmNlLicpICB1bmxlc3Mgb2JqXHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgbmFtZWQgJyArIG5hbWUgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKSAgaWYgcHJvdG9bbmFtZV1cclxuICAgICAgICAgIFxyXG4gICAgICAgICAgICBtZW1iZXJzW25hbWVdID0gbWVtYmVyc1tuYW1lXSBvciBuYW1lXHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgI0d1YXJkIGFnYWluc3Qgb2JsaXRlcmF0aW5nIHRoZSB0cmVlIGFzIHRoZSB0cmVlIGlzIHJlY3Vyc2l2ZWx5IGV4dGVuZGVkXHJcbiAgICAgICAgICAgIG5zVHJlZVtuYW1lXSA9IG5zVHJlZVtuYW1lXSBvclxyXG4gICAgICAgICAgICAgIG5hbWU6IG5hbWVcclxuICAgICAgICAgICAgICB0eXBlOiB0eXBlb2Ygb2JqXHJcbiAgICAgICAgICAgICAgaW5zdGFuY2U6IChpZiBvYmouZ2V0SW5zdGFuY2VOYW1lIHRoZW4gb2JqLmdldEluc3RhbmNlTmFtZSgpIGVsc2UgJ3Vua25vd24nKVxyXG5cclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5IHByb3RvLCBuYW1lLFxyXG4gICAgICAgICAgICAgIHZhbHVlOiBvYmpcclxuICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSBpc250IGVudW1lcmFibGVcclxuXHJcbiAgICAgICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHNwYWNlbmFtZSArICcuJyArIG5hbWVcclxuICAgICAgICAgICAgb2JqXHJcblxyXG4gICAgICBcclxuICAgICAgICAjIyNcclxuICAgICAgICBDcmVhdGUgYSBuZXcsIHN0YXRpYyBuYW1lc3BhY2Ugb24gdGhlIGN1cnJlbnQgcGFyZW50IChlLmcuIG5zTmFtZS50by4uLiB8fCBuc05hbWUuaXMuLi4pXHJcbiAgICAgICAgIyMjXHJcbiAgICAgICAgcHJvdG8ucmVnaXN0ZXIgJ21ha2VTdWJOYW1lU3BhY2UnLCAoKHN1Yk5hbWVTcGFjZSkgLT5cclxuICAgICAgICAgICd1c2Ugc3RyaWN0J1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbmV3IHN1YiBuYW1lc3BhY2Ugd2l0aG91dCBhIHZhbGlkIG5hbWUuJykgIGlmICh0eXBlb2Ygc3ViTmFtZVNwYWNlIGlzbnQgJ3N0cmluZycpIG9yIHN1Yk5hbWVTcGFjZSBpcyAnJ1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdWIgbmFtZXNwYWNlIG5hbWVkICcgKyBzdWJOYW1lU3BhY2UgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKSAgaWYgcHJvdG8uc3ViTmFtZVNwYWNlXHJcbiAgICAgICAgICBuc0ludGVybmFsLmFsZXJ0RGVwZW5kZW50cyBuc05hbWUgKyAnLicgKyBzdWJOYW1lU3BhY2VcclxuICAgICAgICAgIG5ld05hbWVTcGFjZSA9IG1ha2VOYW1lU3BhY2Uoc3ViTmFtZVNwYWNlLCBuc1RyZWUpXHJcbiAgICAgICAgICBuZXdOYW1lU3BhY2UucmVnaXN0ZXIgJ2NvbnN0YW50cycsIG1ha2VOYW1lU3BhY2UoJ2NvbnN0YW50cycsIG5zVHJlZSksIGZhbHNlICBpZiBzdWJOYW1lU3BhY2UgaXNudCAnY29uc3RhbnRzJ1xyXG4gICAgICAgICAgcHJvdG8ucmVnaXN0ZXIgc3ViTmFtZVNwYWNlLCBuZXdOYW1lU3BhY2UsIGZhbHNlXHJcbiAgICAgICAgICBuZXdOYW1lU3BhY2VcclxuICAgICAgICApLCBmYWxzZVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgXHJcbiAgICAgICMjI1xyXG4gICAgICBBbiBpbnRlcm5hbCBtZWNoYW5pc20gdG8gcmVwcmVzZW50IHRoZSBpbnN0YW5jZSBvZiB0aGlzIG5hbWVzcGFjZVxyXG4gICAgICBAY29uc3RydWN0b3JcclxuICAgICAgQGludGVybmFsXHJcbiAgICAgIEBtZW1iZXJPZiBtYWtlTmFtZVNwYWNlXHJcbiAgICAgICMjI1xyXG4gICAgICBDbGFzcyA9IG5ldyBGdW5jdGlvbigncmV0dXJuIGZ1bmN0aW9uICcgKyBzcGFjZW5hbWUgKyAnKCl7fScpKClcclxuICAgICAgQ2xhc3M6OiA9IG5ldyBCYXNlKHNwYWNlbmFtZSlcclxuICAgIFxyXG4gICAgICAjQ2xhc3MucHJvdG90eXBlLnBhcmVudCA9IEJhc2UucHJvdG90eXBlO1xyXG4gICAgICBuZXcgQ2xhc3Moc3BhY2VuYW1lKVxyXG4gIFxyXG4gICAgIyMjXHJcbiAgICAnRGVwZW5kJyBhbiBPYmplY3QgdXBvbiBhbm90aGVyIG1lbWJlciBvZiB0aGlzIG5hbWVzcGFjZSwgdXBvbiBhbm90aGVyIG5hbWVzcGFjZSxcclxuICAgIG9yIHVwb24gYSBtZW1iZXIgb2YgYW5vdGhlciBuYW1lc3BhY2VcclxuICAgICMjI1xyXG4gICAgZGVwZW5kc09uID0gKGRlcGVuZGVuY2llcywgY2FsbEJhY2ssIGltcG9ydHMpIC0+XHJcbiAgICAgICd1c2Ugc3RyaWN0J1xyXG4gICAgICByZXQgPSBmYWxzZVxyXG4gICAgICBuc01lbWJlcnMgPSBuc0ludGVybmFsLmdldE5zTWVtYmVycygpXHJcbiAgICAgIGlmIGRlcGVuZGVuY2llcyBhbmQgZGVwZW5kZW5jaWVzLmxlbmd0aCA+IDAgYW5kIGNhbGxCYWNrXHJcbiAgICAgICAgbWlzc2luZyA9IGRlcGVuZGVuY2llcy5maWx0ZXIoKGRlcGVuKSAtPlxyXG4gICAgICAgICAgbnNNZW1iZXJzLmluZGV4T2YoZGVwZW4pIGlzIC0xIGFuZCAobm90IGltcG9ydHMgb3IgaW1wb3J0cyBpc250IGRlcGVuKVxyXG4gICAgICAgIClcclxuICAgICAgICBpZiBtaXNzaW5nLmxlbmd0aCBpcyAwXHJcbiAgICAgICAgICByZXQgPSB0cnVlXHJcbiAgICAgICAgICBjYWxsQmFjaygpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgbnNJbnRlcm5hbC5kZXBlbmRlbnRzLnB1c2ggKGltcG9ydHMpIC0+XHJcbiAgICAgICAgICAgIGRlcGVuZHNPbiBtaXNzaW5nLCBjYWxsQmFjaywgaW1wb3J0c1xyXG5cclxuICAgICAgcmV0XHJcbiAgICBuc0ludGVybmFsID0gZGVwZW5kZW50czogW11cclxuICBcclxuICAgICMjI1xyXG4gICAgRmV0Y2hlcyB0aGUgcmVnaXN0ZXJlZCBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIG9uIHRoZSBuYW1lc3BhY2UgYW5kIGl0cyBjaGlsZCBuYW1lc3BhY2VzXHJcbiAgICAjIyNcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBuc0ludGVybmFsLCAnZ2V0TnNNZW1iZXJzJyxcclxuICAgICAgdmFsdWU6IC0+XHJcbiAgICAgICAgcmVjdXJzZVRyZWUgPSAoa2V5LCBsYXN0S2V5KSAtPlxyXG4gICAgICAgICAgbWVtYmVycy5wdXNoIGxhc3RLZXkgKyAnLicgKyBrZXkgIGlmIHR5cGVvZiAoa2V5KSBpcyAnc3RyaW5nJ1xyXG4gICAgICAgICAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KGtleSlcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoa2V5KS5mb3JFYWNoIChrKSAtPlxyXG4gICAgICAgICAgICAgIG1lbWJlcnMucHVzaCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdHlwZW9mIChrKSBpcyAnc3RyaW5nJ1xyXG4gICAgICAgICAgICAgIHJlY3Vyc2VUcmVlIGtleVtrXSwgbGFzdEtleSArICcuJyArIGsgIGlmIHV0aWxMaWIuaXNQbGFpbk9iamVjdChrZXlba10pXHJcbiAgICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgbWVtYmVycyA9IFtdXHJcbiAgICAgICAgT2JqZWN0LmtleXMoTnNUcmVlW25hbWVTcGFjZU5hbWVdKS5mb3JFYWNoIChrZXkpIC0+XHJcbiAgICAgICAgICByZWN1cnNlVHJlZSBOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSwgbmFtZVNwYWNlTmFtZSAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KE5zVHJlZVtuYW1lU3BhY2VOYW1lXVtrZXldKVxyXG4gICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgIG1lbWJlcnNcclxuXHJcbiAgICAjIyNcclxuICAgIFRvIHN1cHBvcnQgZGVwZW5kZW5jeSBtYW5hZ2VtZW50LCB3aGVuIGEgcHJvcGVydHkgaXMgbGlmdGVkIG9udG8gdGhlIG5hbWVzcGFjZSwgbm90aWZ5IGRlcGVuZGVudHMgdG8gaW5pdGlhbGl6ZVxyXG4gICAgIyMjXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnNJbnRlcm5hbCwgJ2FsZXJ0RGVwZW5kZW50cycsXHJcbiAgICAgIHZhbHVlOiAoaW1wb3J0cykgLT5cclxuICAgICAgICBkZXBzID0gbnNJbnRlcm5hbC5kZXBlbmRlbnRzLmZpbHRlcigoZGVwT24pIC0+XHJcbiAgICAgICAgICBmYWxzZSBpcyBkZXBPbihpbXBvcnRzKVxyXG4gICAgICAgIClcclxuICAgICAgICBuc0ludGVybmFsLmRlcGVuZGVudHMgPSBkZXBzICBpZiBBcnJheS5pc0FycmF5KGRlcHMpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgI0NyZWF0ZSB0aGUgcm9vdCBvZiB0aGUgdHJlZSBhcyB0aGUgY3VycmVudCBuYW1lc3BhY2VcclxuICAgIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSA9IHt9XHJcbiAgICAjRGVmaW5lIHRoZSBjb3JlIG5hbWVzcGFjZSBhbmQgdGhlIHJldHVybiBvZiB0aGlzIGNsYXNzXHJcbiAgICBOc091dCA9IG1ha2VOYW1lU3BhY2UobmFtZVNwYWNlTmFtZSwgTnNUcmVlW25hbWVTcGFjZU5hbWVdKVxyXG4gIFxyXG4gICAgIyMjXHJcbiAgICBDYWNoZSBhIGhhbmRsZSBvbiB0aGUgdmVuZG9yIChwcm9iYWJseSBqUXVlcnkpIG9uIHRoZSByb290IG5hbWVzcGFjZVxyXG4gICAgIyMjXHJcbiAgICBOc091dC5yZWdpc3RlciAnPycsIHV0aWxMaWIsIGZhbHNlXHJcblxyXG4gICAgIyMjXHJcbiAgICBDYWNoZSB0aGUgdHJlZSAodXNlZnVsIGZvciBkb2N1bWVudGF0aW9uL3Zpc3VhbGl6YXRpb24vZGVidWdnaW5nKVxyXG4gICAgIyMjXHJcbiAgICBOc091dC5yZWdpc3RlciAndHJlZScsIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSwgZmFsc2VcclxuICBcclxuICAgICMjI1xyXG4gICAgQ2FjaGUgdGhlIG5hbWUgc3BhY2UgbmFtZVxyXG4gICAgIyMjXHJcbiAgICBOc091dC5yZWdpc3RlciAnbmFtZScsIG5hbWVTcGFjZU5hbWUsIGZhbHNlXHJcbiAgICBOc091dC5yZWdpc3RlciAnZGVwZW5kc09uJywgZGVwZW5kc09uLCBmYWxzZVxyXG4gICAgTnNPdXRcclxuXHJcblxyXG4gICMjI1xyXG4gIEFjdHVhbGx5IGRlZmluZSB0aGUgT0ogTmFtZVNwYWNlXHJcbiAgIyMjXHJcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoaXNHbG9iYWwsIG5hbWVTcGFjZU5hbWUsXHJcbiAgICB2YWx1ZTogbWFrZVRoZUp1aWNlKClcclxuXHJcbiAgT0oucmVnaXN0ZXIgJ2dsb2JhbCcsIHRoaXNHbG9iYWxcclxuXHJcbiAgdGhpc0RvY3VtZW50ID0ge31cclxuICBpZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xyXG4gICAgdGhpc0RvY3VtZW50ID0gZG9jdW1lbnRcclxuICBcclxuICBPSi5yZWdpc3RlciAnZG9jdW1lbnQnLCB0aGlzRG9jdW1lbnRcclxuXHJcbiAgT0oucmVnaXN0ZXIgJ25vb3AnLCAtPiIsIiAjICMgT0ogUG9zdC1Jbml0aWFsaXphdGlvblxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuXHJcbiAgIyBTaW1wbGUgYXJyYXkgb2YgYW50aWNpcGF0ZWQva25vd24gY2hpbGQgbmFtZXNwYWNlc1xyXG4gIFxyXG4gIHN1Yk5hbWVTcGFjZXMgPSBbXHJcbiAgICAnZXJyb3JzJ1xyXG4gICAgJ2VudW1zJ1xyXG4gICAgJ2lzJ1xyXG4gICAgJ2luc3RhbmNlT2YnXHJcbiAgICAndG8nXHJcbiAgICAnbm9kZXMnXHJcbiAgICAnZGInXHJcbiAgICAnY29tcG9uZW50cydcclxuICAgICdjb250cm9scydcclxuICAgICdpbnB1dHMnXHJcbiAgICAnbm90aWZpY2F0aW9ucydcclxuICAgICdoaXN0b3J5J1xyXG4gICAgJ2Nvb2tpZSdcclxuICAgICdhc3luYydcclxuICBdXHJcblxyXG4gICMgIyMgU3ViTmFtZVNwYWNlc1xyXG5cclxuICAjIFByZS1hbGxvY2F0ZSBjZXJ0YWluIGNvbW1vbiBuYW1lc3BhY2VzIHRvIGF2b2lkIGZ1dHVyZSByYWNlIGNvbmRpdGlvbnMuXHJcbiAgIyBUaGlzIGRvZXMgcmVxdWlyZSB0aGF0IHRoZSBvcmRlciBvZiBvcGVyYXRpb25zIGxvYWRzIE9KLmNvZmZlZSBmaXJzdCBhbmQgb0pJbml0LmNvZmZlZSBzZWNvbmRcclxuICBfLmVhY2ggc3ViTmFtZVNwYWNlcywgKG5hbWUpIC0+XHJcbiAgICBPSi5tYWtlU3ViTmFtZVNwYWNlIG5hbWVcclxuICBcclxuICAjICMjIENvbmZpZ3VyYXRpb24gdmFyaWFibGVzXHJcblxyXG4gICMgQXV0b21hdGljYWxseSBnZW5lcmF0ZSB1bmlxdWUgSURzIGZvciBlYWNoIG5vZGUgKGRlZmF1bHQgZmFsc2UpXHJcbiAgT0pbJ0dFTkVSQVRFX1VOSVFVRV9JRFMnXSA9IGZhbHNlXHJcbiAgIyBEZWZhdWx0IHJvb3Qgbm9kZSBmb3IgY29tcG9uZW50cy9jb250cm9scyAoZGVmYXVsdCAnZGl2JylcclxuICBPSlsnREVGQVVMVF9DT01QT05FTlRfUk9PVF9OT0RFVFlQRSddID0gJ2RpdidcclxuICAjIFdoZXRoZXIgdG8gaG9vayBpbnRvIHRoZSBnbG9iYWwgb24gZXJyb3IgZXZlbnQgdG8gd3JpdGUgZXJyb3JzIHRvIGNvbnNvbGUgKGRlZmF1bHQgZmFsc2UpXHJcbiAgT0pbJ1RSQUNLX09OX0VSUk9SJ10gPSBmYWxzZVxyXG4gICNXaGV0aGVyIHRvIGxvZyBhbGwgQUpBWCByZXF1ZXN0c1xyXG4gIE9KWydMT0dfQUxMX0FKQVgnXSA9IGZhbHNlXHJcbiAgI1doZXRoZXIgdG8gbG9nIGFsbCBBSkFYIGVycm9yc1xyXG4gIE9KWydMT0dfQUxMX0FKQVhfRVJST1JTJ10gPSBmYWxzZVxyXG4gIFxyXG4gIHJldHVyblxyXG4gIFxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBcclxuICBhcnJheTJEID0gKGluaXRMZW5ndGgsIGluaXRXaWR0aCkgLT5cclxuICAgIGFycmF5ID0gW11cclxuICAgIG1heExlbmd0aCA9IDBcclxuICAgIG1heFdpZHRoID0gMFxyXG4gICAgXHJcbiAgICByZXQgPSBcclxuICAgICAgZ2V0OiAocm93Tm8sIGNvbE5vKSAtPlxyXG4gICAgICAgIGV4dGVuZCByb3dObywgY29sTm9cclxuICAgICAgc2V0OiAocm93Tm8sIGNvbE5vLCB2YWwpIC0+XHJcbiAgICAgICAgcmV0LmdldCByb3dObywgY29sTm9cclxuICAgICAgICByb3dJZHggPSByb3dOby0xXHJcbiAgICAgICAgY29sSWR4ID0gY29sTm8tMVxyXG4gICAgICAgIGFycmF5W3Jvd0lkeF1bY29sSWR4XSA9IHZhbFxyXG4gICAgICBlYWNoOiAoY2FsbEJhY2spIC0+XHJcbiAgICAgICAgXy5lYWNoIGFycmF5LCAoY29sdW1ucywgcm93KSAtPlxyXG4gICAgICAgICAgXy5lYWNoIGFycmF5W3Jvd10sICh2YWwsIGNvbCkgLT5cclxuICAgICAgICAgICAgcm93SWR4ID0gcm93KzFcclxuICAgICAgICAgICAgY29sSWR4ID0gY29sKzFcclxuICAgICAgICAgICAgY2FsbEJhY2sgcm93SWR4LCBjb2xJZHgsIHZhbFxyXG4gICAgICB3aWR0aDogKCkgLT5cclxuICAgICAgICBtYXhXaWR0aFxyXG4gICAgICBsZW5ndGg6ICgpIC0+XHJcbiAgICAgICAgbWF4TGVuZ3RoXHJcbiAgICAgICAgIFxyXG4gICAgIyMjXHJcbiAgICBHdWFyYW50ZWUgdGhhdCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgYXJyYXkgYXJlIGFsd2F5cyBiYWNrZWQgYnkgdmFsdWVzIGF0IGV2ZXJ5IHBvc2l0aW9uXHJcbiAgICAjIyMgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgZXh0ZW5kID0gKGxlbmd0aCwgd2lkdGgpIC0+ICBcclxuICAgICAgaWYgbm90IGxlbmd0aCBvciBsZW5ndGggPCAxIHRoZW4gbGVuZ3RoID0gMVxyXG4gICAgICBpZiBub3Qgd2lkdGggb3Igd2lkdGggPCAxIHRoZW4gd2lkdGggPSAxXHJcbiAgICAgIFxyXG4gICAgICBpZiBtYXhMZW5ndGggPCBsZW5ndGggdGhlbiBtYXhMZW5ndGggPSBsZW5ndGhcclxuICAgICAgaWYgYXJyYXkubGVuZ3RoID4gbWF4TGVuZ3RoIHRoZW4gbWF4TGVuZ3RoID0gYXJyYXkubGVuZ3RoXHJcbiAgICAgIGlmIG1heFdpZHRoIDwgd2lkdGggdGhlbiBtYXhXaWR0aCA9IHdpZHRoXHJcbiAgICAgIGkgPSAwXHJcbiAgICAgIFxyXG4gICAgICB3aGlsZSBpIDwgbWF4TGVuZ3RoXHJcbiAgICAgICAgdHJ5Um93ID0gYXJyYXlbaV1cclxuICAgICAgICBpZiBub3QgdHJ5Um93XHJcbiAgICAgICAgICB0cnlSb3cgPSBbXVxyXG4gICAgICAgICAgYXJyYXkucHVzaCB0cnlSb3dcclxuICAgICAgICBpZiBtYXhXaWR0aCA8IHRyeVJvdy5sZW5ndGggdGhlbiBtYXhXaWR0aCA9IHRyeVJvdy5sZW5ndGhcclxuICAgICAgICBpZiB0cnlSb3cubGVuZ3RoIDwgbWF4V2lkdGggdGhlbiB0cnlSb3cubGVuZ3RoID0gbWF4V2lkdGhcclxuICAgICAgICBpICs9IDFcclxuICAgICAgXHJcbiAgICAgIGFycmF5W2xlbmd0aC0xXVt3aWR0aC0xXVxyXG4gICAgICAgXHJcbiAgICBleHRlbmQgaW5pdExlbmd0aCwgaW5pdFdpZHRoXHJcbiAgICBcclxuICAgIHJldFxyXG4gIE9KLnJlZ2lzdGVyICdhcnJheTJEJywgYXJyYXkyRFxyXG5cclxuICByZXR1cm5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgbWV0aG9kcyA9IFtcclxuICAgICdhc3NlcnQnXHJcbiAgICAnY2xlYXInXHJcbiAgICAnY291bnQnXHJcbiAgICAnZGVidWcnXHJcbiAgICAnZGlyJ1xyXG4gICAgJ2RpcnhtbCdcclxuICAgICdlcnJvcidcclxuICAgICdleGNlcHRpb24nXHJcbiAgICAnZ3JvdXAnXHJcbiAgICAnZ3JvdXBDb2xsYXBzZWQnXHJcbiAgICAnZ3JvdXBFbmQnXHJcbiAgICAnaW5mbydcclxuICAgICdsb2cnXHJcbiAgICAnbWVtb3J5J1xyXG4gICAgJ3Byb2ZpbGUnXHJcbiAgICAncHJvZmlsZUVuZCdcclxuICAgICd0YWJsZSdcclxuICAgICd0aW1lJ1xyXG4gICAgJ3RpbWVFbmQnXHJcbiAgICAndGltZVN0YW1wJ1xyXG4gICAgJ3RpbWVsaW5lJ1xyXG4gICAgJ3RpbWVsaW5lRW5kJ1xyXG4gICAgJ3RyYWNlJ1xyXG4gICAgJ3dhcm4nXHJcbiAgXVxyXG4gIG1ldGhvZExlbmd0aCA9IG1ldGhvZHMubGVuZ3RoXHJcbiAgY29uc29sZSA9IE9KLmdsb2JhbC5jb25zb2xlIG9yIHt9XHJcbiAgT0oubWFrZVN1Yk5hbWVTcGFjZSAnY29uc29sZSdcclxuICBcclxuICAjIyNcclxuICAxLiBTdHViIG91dCBhbnkgbWlzc2luZyBtZXRob2RzIHdpdGggbm9vcFxyXG4gIDIuIERlZmluZSB0aGUgYXZhaWxhYmxlIG1ldGhvZHMgb24gdGhlIE9KLmNvbnNvbGUgb2JqZWN0XHJcbiAgIyMjXHJcbiAgd2hpbGUgbWV0aG9kTGVuZ3RoLS1cclxuICAgICgtPlxyXG4gICAgICBtZXRob2QgPSBtZXRob2RzW21ldGhvZExlbmd0aF1cclxuICAgIFxyXG4gICAgICAjIE9ubHkgc3R1YiB1bmRlZmluZWQgbWV0aG9kcy5cclxuICAgICAgY29uc29sZVttZXRob2RdID0gT0oubm9vcCB1bmxlc3MgY29uc29sZVttZXRob2RdXHJcbiAgICBcclxuICAgICAgI0RlZmluZSB0aGUgbWV0aG9kIG9uIHRoZSBPSiBjb25zb2xlIG5hbWVzcGFjZVxyXG4gICAgICBPSi5jb25zb2xlLnJlZ2lzdGVyIG1ldGhvZCwgKHBhcmFtcy4uLikgLT5cclxuICAgICAgICBjb25zb2xlW21ldGhvZF0gcGFyYW1zLi4uXHJcbiAgICApKClcclxuXHJcbiAgcmV0dXJuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG4gIFxyXG4gICMjI1xyXG4gIFNldHVwIHNldHRpbmdzXHJcbiAgJC5jb29raWUucmF3ID0gdHJ1ZVxyXG4gICQuY29va2llLmpzb24gPSB0cnVlXHJcbiAgXHJcbiAgU2V0dXAgZGVmYXVsdHNcclxuICBodHRwczovL2dpdGh1Yi5jb20vY2FyaGFydGwvanF1ZXJ5LWNvb2tpZS9cclxuICAkLmNvb2tpZS5kZWZhdWx0cy5leHBpcmVzID0gMzY1XHJcbiAgJC5jb29raWUuZGVmYXVsdHMucGF0aCA9ICcvJ1xyXG4gICQuY29va2llLmRlZmF1bHRzLmRvbWFpbiA9ICdvai5jb20nXHJcbiAgIyMjXHJcbiAgaWYgbm90ICQgb3Igbm90ICQuY29va2llXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IgJ2pRdWVyeSBDb29raWUgaXMgYSByZXF1aXJlZCBkZXBlbmRlbmN5LicgIFxyXG4gICQuY29va2llLmRlZmF1bHRzLnNlY3VyZSA9IGZhbHNlXHJcbiAgXHJcbiAgY29va2llcyA9IHt9XHJcbiAgXHJcbiAgT0ouY29va2llLnJlZ2lzdGVyICdnZXQnLCAoY29va2llTmFtZSwgdHlwZSkgLT5cclxuICAgIHJldCA9ICcnXHJcbiAgICBpZiBjb29raWVOYW1lXHJcbiAgICAgIGlmIHR5cGVcclxuICAgICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lLCB0eXBlXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lICAgIFxyXG4gICAgICBpZiByZXRcclxuICAgICAgICBjb29raWVzW2Nvb2tpZU5hbWVdID0gcmV0XHJcbiAgXHJcbiAgT0ouY29va2llLnJlZ2lzdGVyICdhbGwnLCAoKSAtPlxyXG4gICAgcmV0ID0gJC5jb29raWUoKVxyXG4gICAgcmV0XHJcbiAgICBcclxuICBPSi5jb29raWUucmVnaXN0ZXIgJ3NldCcsIChjb29raWVOYW1lLCB2YWx1ZSwgb3B0cykgLT5cclxuICAgIHJldCA9ICcnXHJcbiAgICBpZiBjb29raWVOYW1lXHJcbiAgICAgIGNvb2tpZXNbY29va2llTmFtZV0gPSB2YWx1ZVxyXG4gICAgICBpZiBvcHRzXHJcbiAgICAgICAgcmV0ID0gJC5jb29raWUgY29va2llTmFtZSwgdmFsdWUsIG9wdHNcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHZhbHVlXHJcbiAgICByZXQgIFxyXG4gIFxyXG4gICBPSi5jb29raWUucmVnaXN0ZXIgJ2RlbGV0ZScsIChjb29raWVOYW1lLCBvcHRzKSAtPlxyXG4gICAgaWYgY29va2llTmFtZVxyXG4gICAgICBpZiBvcHRzXHJcbiAgICAgICAgJC5yZW1vdmVDb29raWUgY29va2llTmFtZSwgb3B0c1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgJC5yZW1vdmVDb29raWUgY29va2llTmFtZSAgICBcclxuICAgICAgZGVsZXRlIGNvb2tpZXNbY29va2llTmFtZV1cclxuICAgIHJldHVyblxyXG4gICAgXHJcbiAgT0ouY29va2llLnJlZ2lzdGVyICdkZWxldGVBbGwnLCAoKSAtPlxyXG4gICAgY29va2llcyA9IHt9XHJcbiAgICBPSi5lYWNoIE9KLmNvb2tpZS5hbGwsICh2YWwsIGtleSkgLT5cclxuICAgICAgT0ouY29va2llLmRlbGV0ZSBrZXkgIFxyXG4gICAgcmV0dXJuXHJcbiAgICBcclxuICByZXR1cm5cclxuICBcclxuICBcclxuICBcclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgXHJcbiAgZGVmZXIgPSAobWV0aG9kLCB3YWl0TXMpIC0+XHJcbiAgICBpZiBzZXRUaW1lb3V0XHJcbiAgICAgIHJldHVybiBzZXRUaW1lb3V0IG1ldGhvZCwgd2FpdE1zXHJcbiAgXHJcbiAgT0oucmVnaXN0ZXIgJ2RlZmVyJywgZGVmZXJcclxuXHJcbiAgcmV0dXJuXHJcblxyXG4iLCIjICMgZWFjaFxyXG5cclxuZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuXHJcbiAgIyAjIyBjYW5FYWNoXHJcbiAgY2FuRWFjaCA9IChvYmopIC0+XHJcbiAgICAjIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgW2lzXShpcy5odG1sKSB0cnVseSBpdGVyYWJsZSAoZS5nLiBhbiBpbnN0YW5jZSBvZiBPYmplY3Qgb3IgQXJyYXkpXHJcbiAgICBPSi5pcy5wbGFpbk9iamVjdChvYmopIG9yIE9KLmlzLm9iamVjdChvYmopIG9yIE9KLmlzLmFycmF5IG9ialxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuZWFjaFxyXG5cclxuICAjIEl0ZXJhdGUgYWxsIG9mIHRoZSBtZW1iZXJzIG9mIGFuIG9iamVjdCAob3IgYW4gYXJyYXkpIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYW5kIHJlY3Vyc2lvbi5cclxuXHJcbiAgIyAtIGBvYmpgOiB0aGUgb2JqZWN0IHRvIGl0ZXJhdGUsXHJcbiAgIyAtIGBvbkVhY2hgOiBhIGNhbGxiYWNrIHRvIGV4ZWN1dGUgZm9yIGVhY2ggaXRlcmF0aW9uLFxyXG4gICMgLSBgcmVjdXJzaXZlYDogaWYgdHJ1ZSwgcmVjdXJzaXZlbHkgaXRlcmF0ZSBhbGwgdmFsaWQgY2hpbGQgb2JqZWN0cy5cclxuICBlYWNoID0gKG9iaiwgb25FYWNoLCByZWN1cnNpdmUpIC0+XHJcbiAgICBpZiBjYW5FYWNoIG9ialxyXG4gICAgICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI2Zvcm93bikncyBgZm9yT3duYCBtZXRob2QgdG8gZW5zdXJlIHRoYXQgb25seSB0aGUgYWN0dWFsIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdCBhcmUgZW51bWVyYXRlZC5cclxuXHJcbiAgICAgICMgLSBgb25FYWNoYCBjYWxsYmFjayB3aWxsIHJlY2VpdmUgMiBwYXJhbWV0ZXJzOlxyXG4gICAgICAjIC0gYHZhbGAgYW5kIGBrZXlgLlxyXG4gICAgICAjIC0gYHZhbGAgaXMgYWx3YXlzIHRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuXHJcbiAgICAgICMgLSBga2V5YCBpcyBlaXRoZXIgdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IG9yIHRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBhcnJheS5cclxuICAgICAgXy5mb3JPd24gb2JqLCAodmFsLCBrZXkpIC0+XHJcbiAgICAgICAgaWYgb25FYWNoIGFuZCAodmFsIG9yIGtleSlcclxuICAgICAgICAgIHF1aXQgPSBvbkVhY2ggdmFsLCBrZXlcclxuICAgICAgICAgIHJldHVybiBmYWxzZSAgaWYgZmFsc2UgaXMgcXVpdFxyXG4gICAgICAgIGVhY2ggdmFsLCBvbkVhY2gsIHRydWUgIGlmIHRydWUgaXMgcmVjdXJzaXZlXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgcmV0dXJuXHJcblxyXG4gICMgIyMgcmVnaXN0ZXJcclxuXHJcbiAgIyByZWdpc3RlciB0aGUgYGVhY2hgIG1ldGhvZCBvbiB0aGUgW09KXShPSi5odG1sKSBuYW1lc3BhY2VcclxuICBPSi5yZWdpc3RlciAnZWFjaCcsIGVhY2hcclxuICByZXR1cm5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgT0ouZW51bXMucmVnaXN0ZXIgJ3Vua25vd24nLCAndW5rbm93bidcclxuXHJcbiAgT0ouZW51bXMucmVnaXN0ZXIgJ2lucHV0VHlwZXMnLFxyXG4gICAgYnV0dG9uOiAjY2hhcmFjdGVyc1xyXG4gICAgICBpZDogMFxyXG4gICAgICBuYW1lOiAnYnV0dG9uJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgY2hlY2tib3g6ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiAxXHJcbiAgICAgIG5hbWU6ICdjaGVja2JveCdcclxuICAgICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgY29sb3I6ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiAyXHJcbiAgICAgIG5hbWU6ICdjb2xvcidcclxuICAgICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgZGF0ZTogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDNcclxuICAgICAgbmFtZTogJ2RhdGUnXHJcbiAgICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgZGF0ZXRpbWU6ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiA0XHJcbiAgICAgIG5hbWU6ICdkYXRldGltZSdcclxuICAgICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgJ2RhdGV0aW1lLWxvY2FsJzogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDVcclxuICAgICAgbmFtZTogJ2RhdGV0aW1lLWxvY2FsJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICAgIGVtYWlsOiAjY2hhcmFjdGVyc1xyXG4gICAgICBpZDogNlxyXG4gICAgICBuYW1lOiAnZW1haWwnXHJcbiAgICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICBmaWxlOiAjY2hhcmFjdGVyc1xyXG4gICAgICBpZDogN1xyXG4gICAgICBuYW1lOiAnZmlsZSdcclxuICAgICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogZmFsc2VcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICBoaWRkZW46ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiA4XHJcbiAgICAgIG5hbWU6ICdoaWRkZW4nXHJcbiAgICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICBpbWFnZTogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDlcclxuICAgICAgbmFtZTogJ2ltYWdlJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgbW9udGg6ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiAxMFxyXG4gICAgICBuYW1lOiAnbW9udGgnXHJcbiAgICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICBudW1iZXI6ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiAxMVxyXG4gICAgICBuYW1lOiAnbnVtYmVyJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICBwYXNzd29yZDogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDEyXHJcbiAgICAgIG5hbWU6ICdwYXNzd29yZCdcclxuICAgICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgcmFkaW86ICNjaGFyYWN0ZXJzXHJcbiAgICAgIGlkOiAxM1xyXG4gICAgICBuYW1lOiAncmFkaW8nXHJcbiAgICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICAgIHJhbmdlOiAjY2hhcmFjdGVyc1xyXG4gICAgICBpZDogMTRcclxuICAgICAgbmFtZTogJ3JhbmdlJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICByZXNldDogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDE1XHJcbiAgICAgIG5hbWU6ICdyZXNldCdcclxuICAgICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICAgIHNlYXJjaDogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDE2XHJcbiAgICAgIG5hbWU6ICdzZWFyY2gnXHJcbiAgICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgc3VibWl0OiAjY2hhcmFjdGVyc1xyXG4gICAgICBpZDogMTdcclxuICAgICAgbmFtZTogJ3N1Ym1pdCdcclxuICAgICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICAgIHRlbDogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDE4XHJcbiAgICAgIG5hbWU6ICdidXR0b24nXHJcbiAgICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgdGV4dDogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDE5XHJcbiAgICAgIG5hbWU6ICd0ZXh0J1xyXG4gICAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgICAgdmFsdWU6XHJcbiAgICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICAgdGltZTogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDIwXHJcbiAgICAgIG5hbWU6ICd0aW1lJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICAgIHVybDogI2NoYXJhY3RlcnNcclxuICAgICAgaWQ6IDIxXHJcbiAgICAgIG5hbWU6ICd1cmwnXHJcbiAgICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgICB2YWx1ZTpcclxuICAgICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgICB3ZWVrOiAjY2hhcmFjdGVyc1xyXG4gICAgICBpZDogMjJcclxuICAgICAgbmFtZTogJ3dlZWsnXHJcbiAgICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICAgIHZhbHVlOlxyXG4gICAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcmV0dXJuXHJcblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBcclxuICBpZiBPSi5UUkFDS19PTl9FUlJPUlxyXG4gICAgb25FcnJvciA9IE9KLmdsb2JhbC5vbmVycm9yXHJcblxyXG4gICAgIyMjXHJcbiAgICBMb2cgZXJyb3JzIHRvIHRoZSBjb25zb2xlXHJcbiAgICAjIyNcclxuICAgIE9KLmdsb2JhbC5vbmVycm9yID0gKG1zZywgdXJsLCBsaW5lTnVtYmVyKSAtPlxyXG4gICAgICByZXQgPSBmYWxzZVxyXG4gICAgICBPSi5jb25zb2xlLndhcm4gXCIlc1xcciB1cmw6ICVzXFxyIGxpbmU6ICVkXCIsIG1zZywgdXJsLCBsaW5lTnVtYmVyXHJcbiAgICAgIHJldCA9IG9uRXJyb3IgbXNnLCB1cmwsIGxpbmVOdW1iZXIgaWYgb25FcnJvclxyXG4gICAgICByZXQgI3RydWUgbWVhbnMgZG9uJ3QgcHJvcGFnYXRlIHRoZSBlcnJvciBcclxuXHJcbiAgcmV0dXJuXHJcblxyXG4iLCJkbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG5cclxuICBpZiBPSi5nbG9iYWwuYWRkRXZlbnRMaXN0ZW5lclxyXG4gICAgZXZlbnROYW1lID0gJ2FkZEV2ZW50TGlzdGVuZXInXHJcbiAgICBldmVudEluZm8gPSAnJ1xyXG4gIGVsc2UgXHJcbiAgICBldmVudE5hbWUgPSAnYXR0YWNoRXZlbnQnXHJcbiAgICBldmVudEluZm8gPSAnb24nXHJcbiAgXHJcbiAgT0ouaGlzdG9yeS5yZWdpc3RlciAncHVzaFN0YXRlJywgKHBhZ2VOYW1lLCBldmVudCkgLT5cclxuICAgIGlmIHBhZ2VOYW1lXHJcbiAgICAgICMga2VlcCB0aGUgbGluayBpbiB0aGUgYnJvd3NlciBoaXN0b3J5XHJcbiAgICAgIGhpc3RvcnkucHVzaFN0YXRlIG51bGwsIG51bGwsICcjJyArIHBhZ2VOYW1lXHJcbiAgICAgIFxyXG4gICAgICAjIGhlcmUgY2FuIGNhdXNlIGRhdGEgbG9hZGluZywgZXRjLlxyXG4gICAgXHJcbiAgICAgIGlmIGV2ZW50ICAgIFxyXG4gICAgICAgICMgZG8gbm90IGdpdmUgYSBkZWZhdWx0IGFjdGlvblxyXG4gICAgICAgIGlmIGV2ZW50LnByZXZlbnREZWZhdWx0XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZVxyXG4gICAgZmFsc2VcclxuICBcclxuICBPSi5oaXN0b3J5LnJlZ2lzdGVyICdyZXN0b3JlU3RhdGUnLCAobG9jYXRpb24pIC0+XHJcbiAgICBwYWdlTmFtZSA9IGxvY2F0aW9uLmhhc2hcclxuICAgIGlmIG5vdCBwYWdlTmFtZVxyXG4gICAgICBwYWdlTmFtZSA9IGxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVsxXVxyXG4gICAgaWYgcGFnZU5hbWVcclxuICAgICAgcGFnZU5hbWUgPSBwYWdlTmFtZS5yZXBsYWNlICcjJywgJydcclxuICAgICAgT0oucHVibGlzaCAncmVzdG9yZVN0YXRlJywgcGFnZU5hbWU6IHBhZ2VOYW1lLCBsb2NhdGlvbjogbG9jYXRpb25cclxuICAgIHJldHVyblxyXG4gIFxyXG4gICMjIyBcclxuICBoYW5nIG9uIHRoZSBldmVudCwgYWxsIHJlZmVyZW5jZXMgaW4gdGhpcyBkb2N1bWVudFxyXG4gICMjI1xyXG4gIFxyXG4gICMjI1xyXG4gICMgVGhpcyBiaW5kcyB0byB0aGUgZG9jdW1lbnQgY2xpY2sgZXZlbnQsIHdoaWNoIGluIHR1cm4gYXR0YWNoZXMgdG8gZXZlcnkgY2xpY2sgZXZlbnQsIGNhdXNpbmcgdW5leHBlY3RlZCBiZWhhdmlvci5cclxuICAjIEZvciBhbnkgY29udHJvbCB3aGljaCB3aXNoZXMgdG8gdHJpZ2dlciBhIHN0YXRlIGNoYW5nZSBpbiByZXNwb25zZSB0byBhbiBldmVudCwgaXQgaXMgYmV0dGVyIGZvciB0aGF0IGNvbnRyb2wgdG8gZGVmaW5lIHRoZSBiZWhhdmlvci5cclxuICBPSi5kb2N1bWVudFtldmVudE5hbWVdIGV2ZW50SW5mbyArICdjbGljaycsICgoZXZlbnQpIC0+XHJcbiAgICBldmVudCA9IGV2ZW50IG9yIHdpbmRvdy5ldmVudFxyXG4gICAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IG9yIGV2ZW50LnNyY0VsZW1lbnRcclxuICAgIFxyXG4gICAgIyBsb29raW5nIGZvciBhbGwgdGhlIGxpbmtzIHdpdGggJ2FqYXgnIGNsYXNzIGZvdW5kXHJcbiAgICBpZiB0YXJnZXQgYW5kIHRhcmdldC5ub2RlTmFtZSBpcyAnQScgYW5kICgnICcgKyB0YXJnZXQuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCdhamF4JykgPj0gMFxyXG4gICAgICBPSi5wdXNoU3RhdGUgdGFyZ2V0LmhyZWYsIGV2ZW50XHJcbiAgICAgIFxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuICApLCBmYWxzZVxyXG4gICMjI1xyXG5cclxuICAjIyNcclxuICBoYW5nIG9uIHBvcHN0YXRlIGV2ZW50IHRyaWdnZXJlZCBieSBwcmVzc2luZyBiYWNrL2ZvcndhcmQgaW4gYnJvd3NlclxyXG4gICMjI1xyXG4gIE9KLmdsb2JhbFtldmVudE5hbWVdIGV2ZW50SW5mbyArICdwb3BzdGF0ZScsICgoZXZlbnQpIC0+XHJcbiAgICBcclxuICAgICMgd2UgZ2V0IGEgbm9ybWFsIExvY2F0aW9uIG9iamVjdFxyXG4gICAgXHJcbiAgICAjIyNcclxuICAgIE5vdGUsIHRoaXMgaXMgdGhlIG9ubHkgZGlmZmVyZW5jZSB3aGVuIHVzaW5nIHRoaXMgbGlicmFyeSxcclxuICAgIGJlY2F1c2UgdGhlIG9iamVjdCBkb2N1bWVudC5sb2NhdGlvbiBjYW5ub3QgYmUgb3ZlcnJpZGVuLFxyXG4gICAgc28gbGlicmFyeSB0aGUgcmV0dXJucyBnZW5lcmF0ZWQgJ2xvY2F0aW9uJyBvYmplY3Qgd2l0aGluXHJcbiAgICBhbiBvYmplY3Qgd2luZG93Lmhpc3RvcnksIHNvIGdldCBpdCBvdXQgb2YgJ2hpc3RvcnkubG9jYXRpb24nLlxyXG4gICAgRm9yIGJyb3dzZXJzIHN1cHBvcnRpbmcgJ2hpc3RvcnkucHVzaFN0YXRlJyBnZXQgZ2VuZXJhdGVkXHJcbiAgICBvYmplY3QgJ2xvY2F0aW9uJyB3aXRoIHRoZSB1c3VhbCAnZG9jdW1lbnQubG9jYXRpb24nLlxyXG4gICAgIyMjICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICByZXR1cm5Mb2NhdGlvbiA9IGhpc3RvcnkubG9jYXRpb24gb3IgZG9jdW1lbnQubG9jYXRpb25cclxuICAgIFxyXG4gICAgIyMjXHJcbiAgICBoZXJlIGNhbiBjYXVzZSBkYXRhIGxvYWRpbmcsIGV0Yy5cclxuICAgICMjI1xyXG4gICAgT0ouaGlzdG9yeS5yZXN0b3JlU3RhdGUgcmV0dXJuTG9jYXRpb25cclxuICAgIFxyXG4gICAgcmV0dXJuXHJcbiAgKSwgZmFsc2UgXHJcbiAgXHJcbiAgcmV0dXJuXHJcbiBcclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBcclxuICBPSi5pcy5yZWdpc3RlciAnYm9vbCcsIChib29sZWFuKSAtPlxyXG4gICAgXy5pc0Jvb2xlYW4gYm9vbGVhblxyXG5cclxuICBPSi5pcy5yZWdpc3RlciAnYXJyYXlOdWxsT3JFbXB0eScsIChhcnIpIC0+XHJcbiAgICBfLmlzRW1wdHkgYXJyXHJcblxyXG4gIE9KLmlzLnJlZ2lzdGVyICdzdHJpbmdOdWxsT3JFbXB0eScsIChzdHIpIC0+XHJcbiAgICBzdHIgYW5kIChub3Qgc3RyLmxlbmd0aCBvciBzdHIubGVuZ3RoIGlzIDAgb3Igbm90IHN0ci50cmltIG9yIG5vdCBzdHIudHJpbSgpKVxyXG5cclxuICBPSi5pcy5yZWdpc3RlciAnbnVtYmVyTnVsbE9yRW1wdHknLCAobnVtKSAtPlxyXG4gICAgbm90IG51bSBvciBpc05hTihudW0pIG9yIG5vdCBudW0udG9QcmVjaXNpb25cclxuXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ2RhdGVOdWxsT3JFbXB0eScsIChkdCkgLT5cclxuICAgIG5vdCBkdCBvciBub3QgZHQuZ2V0VGltZVxyXG5cclxuICBPSi5pcy5yZWdpc3RlciAnb2JqZWN0TnVsbE9yRW1wdHknLCAob2JqKSAtPlxyXG4gICAgXy5pc0VtcHR5IG9iaiBvciBub3QgT2JqZWN0LmtleXMob2JqKSBvciBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCBpcyAwXHJcblxyXG4gIE9KLmlzLnJlZ2lzdGVyICdwbGFpbk9iamVjdCcsIChvYmopIC0+XHJcbiAgICBfLmlzUGxhaW5PYmplY3Qgb2JqIFxyXG4gICAgXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ29iamVjdCcsIChvYmopIC0+XHJcbiAgICBfLmlzT2JqZWN0IG9ialxyXG5cclxuICBPSi5pcy5yZWdpc3RlciAnZGF0ZScsIChkdCkgLT5cclxuICAgIF8uaXNEYXRlIGR0XHJcblxyXG4gIFxyXG4gICMjI1xyXG4gIERldGVybWluZXMgaWYgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiBhIE51bWJlciBhbmQgbm90IE5hTipcclxuICAjIyNcclxuICBPSi5pcy5yZWdpc3RlciAnbnVtYmVyJywgKG51bSkgLT5cclxuICAgIHR5cGVvZiBudW0gaXMgJ251bWJlcicgYW5kIGZhbHNlIGlzIChPSi5udW1iZXIuaXNOYU4obnVtKSBvciBmYWxzZSBpcyBPSi5udW1iZXIuaXNGaW5pdGUobnVtKSBvciBPSi5udW1iZXIuTUFYX1ZBTFVFIGlzIG51bSBvciBPSi5udW1iZXIuTUlOX1ZBTFVFIGlzIG51bSlcclxuXHJcbiAgIyMjXHJcbiAgRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGNvbnZlcnRhYmxlIHRvIGEgTnVtYmVyXHJcbiAgIyMjXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ251bWVyaWMnLCAobnVtKSAtPlxyXG4gICAgcmV0ID0gT0ouaXMubnVtYmVyKG51bSlcclxuICAgIHVubGVzcyByZXRcclxuICAgICAgbnVOdW0gPSBPSi50by5udW1iZXIobnVtKVxyXG4gICAgICByZXQgPSBPSi5pcy5udW1iZXIobnVOdW0pXHJcbiAgICByZXRcclxuXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ3ZlbmRvck9iamVjdCcsIChvYmopIC0+XHJcbiAgICByZXQgPSAob2JqIGluc3RhbmNlb2YgT0pbJz8nXSlcclxuICAgIHJldFxyXG5cclxuICBPSi5pcy5yZWdpc3RlciAnZWxlbWVudEluRG9tJywgKGVsZW1lbnRJZCkgLT5cclxuICAgIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCkpXHJcblxyXG4gIE9KLmlzLnJlZ2lzdGVyICdnZW5lcmljJywgKG9iaikgLT5cclxuICAgIHJldCA9IChmYWxzZSBpcyBPSi5pcy5tZXRob2Qob2JqKSBhbmQgZmFsc2UgaXMgT0ouaGFzTGVuZ3RoKG9iaikgYW5kIGZhbHNlIGlzIE9KLmlzLnBsYWluT2JqZWN0KG9iaikpXHJcbiAgICByZXRcclxuXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ2FycmF5JywgKG9iaikgLT5cclxuICAgIF8uaXNBcnJheSBvYmpcclxuXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ3N0cmluZycsIChzdHIpIC0+XHJcbiAgICBfLmlzU3RyaW5nIHN0clxyXG4gICAgXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ3RydWUnLCAob2JqKSAtPlxyXG4gICAgb2JqIGlzIHRydWUgb3Igb2JqIGlzICd0cnVlJyBvciBvYmogaXMgMSBvciBvYmogaXMgJzEnXHJcblxyXG4gIE9KLmlzLnJlZ2lzdGVyICdmYWxzZScsIChvYmopIC0+XHJcbiAgICBvYmogaXMgZmFsc2Ugb3Igb2JqIGlzICdmYWxzZScgb3Igb2JqIGlzIDAgb3Igb2JqIGlzICcwJ1xyXG5cclxuICBPSi5pcy5yZWdpc3RlciAndHJ1ZU9yRmFsc2UnLCAob2JqKSAtPlxyXG4gICAgT0ouaXMudHJ1ZSBvYmogb3IgT0ouaXMuZmFsc2Ugb2JqXHJcblxyXG4gIE9KLmlzLnJlZ2lzdGVyICdudWxsT3JFbXB0eScsIChvYmosIGNoZWNrTGVuZ3RoKSAtPlxyXG4gICAgXy5pc0VtcHR5KG9iaikgb3IgXy5pc1VuZGVmaW5lZChvYmopIG9yIF8uaXNOdWxsKG9iaikgb3IgXy5pc05hTihvYmopXHJcblxyXG4gIE9KLmlzLnJlZ2lzdGVyICdudWxsT3JVbmRlZmluZWQnLCAob2JqLCBjaGVja0xlbmd0aCkgLT5cclxuICAgIF8uaXNVbmRlZmluZWQob2JqKSBvciBfLmlzTnVsbChvYmopIG9yIF8uaXNOYU4ob2JqKVxyXG5cclxuICBPSi5pcy5yZWdpc3RlciAnaW5zdGFuY2VvZicsIChuYW1lLCBvYmopIC0+XHJcbiAgICBvYmoudHlwZSBpcyBuYW1lIG9yIG9iaiBpbnN0YW5jZW9mIG5hbWVcclxuXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ21ldGhvZCcsIChvYmopIC0+XHJcbiAgICBvYmogaXNudCBPSi5ub29wIGFuZCBfLmlzRnVuY3Rpb24gb2JqXHJcblxyXG4gICMjI1xyXG4gIERlcHJlY2F0ZWQuIExlZnQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LiBVc2UgaXMubWV0aG9kIGluc3RlYWQuXHJcbiAgIyMjXHJcbiAgT0ouaXMucmVnaXN0ZXIgJ2Z1bmMnLCBPSi5pcy5tZXRob2RcclxuICBcclxuICByZXR1cm5cclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgXHJcbiAgZnJpZW5kbHlOYW1lID0gJ25vdHknXHJcbiAgXHJcbiAgT0oubm90aWZpY2F0aW9ucy5yZWdpc3RlciBmcmllbmRseU5hbWUsIChvcHRpb25zLCBvd25lcikgLT5cclxuICAgIGRlZmF1bHRzID1cclxuICAgICAgbGF5b3V0OiAndG9wUmlnaHQnXHJcbiAgICAgIHRoZW1lOiAnZGVmYXVsdFRoZW1lJ1xyXG4gICAgICB0eXBlOiAnYWxlcnQnXHJcbiAgICAgIHRleHQ6ICcnICNjYW4gYmUgaHRtbCBvciBzdHJpbmdcclxuICAgICAgZGlzbWlzc1F1ZXVlOiB0cnVlICNJZiB5b3Ugd2FudCB0byB1c2UgcXVldWUgZmVhdHVyZSBzZXQgdGhpcyB0cnVlXHJcbiAgICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm5vdHlfbWVzc2FnZVwiPjxzcGFuIGNsYXNzPVwibm90eV90ZXh0XCI+PC9zcGFuPjxkaXYgY2xhc3M9XCJub3R5X2Nsb3NlXCI+PC9kaXY+PC9kaXY+JyxcclxuICAgICAgYW5pbWF0aW9uOiBcclxuICAgICAgICAgIG9wZW46IFxyXG4gICAgICAgICAgICBoZWlnaHQ6ICd0b2dnbGUnXHJcbiAgICAgICAgICBjbG9zZTogXHJcbiAgICAgICAgICAgIGhlaWdodDogJ3RvZ2dsZSdcclxuICAgICAgICAgIGVhc2luZzogJ3N3aW5nJ1xyXG4gICAgICAgICAgc3BlZWQ6IDUwMCAjb3BlbmluZyAmIGNsb3NpbmcgYW5pbWF0aW9uIHNwZWVkXHJcbiAgICAgIHRpbWVvdXQ6IDUwMDAgI2RlbGF5IGZvciBjbG9zaW5nIGV2ZW50LiBTZXQgZmFsc2UgZm9yIHN0aWNreSBub3RpZmljYXRpb25zXHJcbiAgICAgIGZvcmNlOiBmYWxzZSAjYWRkcyBub3RpZmljYXRpb24gdG8gdGhlIGJlZ2lubmluZyBvZiBxdWV1ZSB3aGVuIHNldCB0byB0cnVlXHJcbiAgICAgIG1vZGFsOiBmYWxzZVxyXG4gICAgICBtYXhWaXNpYmxlOiA1ICN5b3UgY2FuIHNldCBtYXggdmlzaWJsZSBub3RpZmljYXRpb24gZm9yIGRpc21pc3NRdWV1ZSB0cnVlIG9wdGlvbixcclxuICAgICAga2lsbGVyOiBmYWxzZSAjZm9yIGNsb3NlIGFsbCBub3RpZmljYXRpb25zIGJlZm9yZSBzaG93XHJcbiAgICAgIGNsb3NlV2l0aDogWydjbGljayddICAjWydjbGljaycsICdidXR0b24nLCAnaG92ZXInXVxyXG4gICAgICBjYWxsYmFjazogXHJcbiAgICAgICAgICBvblNob3c6IE9KLm5vb3AsXHJcbiAgICAgICAgICBhZnRlclNob3c6IE9KLm5vb3BcclxuICAgICAgICAgIG9uQ2xvc2U6IE9KLm5vb3BcclxuICAgICAgICAgIGFmdGVyQ2xvc2U6IE9KLm5vb3BcclxuICAgICAgYnV0dG9uczogZmFsc2UgI2FuIGFycmF5IG9mIGJ1dHRvbnNcclxuICAgIFxyXG4gICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgICByZXQgPSBub3R5IGRlZmF1bHRzXHJcbiAgICAgIFxyXG4gICAgcmV0XHJcbiAgICBcclxuICByZXR1cm5cclxuICBcclxuICBcclxuXHJcbiIsImRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgXHJcbiAgdG9rZW5zID0ge31cclxuICBzdWJzY3JpYmVycyA9IFtdXHJcbiAgZXZlbnRzID0ge31cclxuICBcclxuICBnZXRFdmVudE5hbWUgPSAoZXZlbnQpIC0+XHJcbiAgICBldmVudC50b1VwcGVyQ2FzZSgpLnJlcGxhY2UgJyAnLCAnXydcclxuICBcclxuICBzdWJzY3JpYmUgPSAoZXZlbnQsIG1ldGhvZCkgLT5cclxuICAgIGV2ZW50TmFtZSA9IGdldEV2ZW50TmFtZSBldmVudFxyXG4gICAgaWYgbm90IGV2ZW50c1tldmVudE5hbWVdIHRoZW4gZXZlbnRzW2V2ZW50TmFtZV0gPSBbXVxyXG4gICAgXHJcbiAgICB0b2tlbiA9IFB1YlN1Yi5zdWJzY3JpYmUgZXZlbnROYW1lLCBtZXRob2RcclxuICAgIHRva2Vuc1t0b2tlbl0gPSB0b2tlblxyXG4gICAgc3Vic2NyaWJlcnMucHVzaCBtZXRob2RcclxuICAgIGV2ZW50c1tldmVudE5hbWVdLnB1c2ggbWV0aG9kXHJcbiAgICB0b2tlblxyXG4gIFxyXG4gIHB1Ymxpc2ggPSAoZXZlbnQsIGRhdGEpIC0+XHJcbiAgICBldmVudE5hbWUgPSBnZXRFdmVudE5hbWUgZXZlbnRcclxuICAgIGlmIGV2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgIFB1YlN1Yi5wdWJsaXNoIGV2ZW50TmFtZSwgZGF0YVxyXG4gICAgZWxzZVxyXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0V2ZW50IG5hbWVkIHsnICsgZXZlbnQgKyAnfSBpcyBub3QgcmVjb2duaXplZC4nXHJcbiAgICByZXR1cm4gIFxyXG4gIFxyXG4gIHVuc3Vic2NyaWJlID0gKHRva2VuT3JNZXRob2QpIC0+XHJcbiAgICBpZiBPSi5pcy5tZXRob2QgdG9rZW5Pck1ldGhvZFxyXG4gICAgICBpZiAtMSBpc250IHN1YnNjcmliZXJzLmluZGV4T2YgdG9rZW5Pck1ldGhvZFxyXG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSB0b2tlbk9yTWV0aG9kXHJcbiAgICAgICAgc3Vic2NyaWJlcnMgPSBfLnJlbW92ZSBzdWJzY3JpYmVycywgKG1ldGhvZCkgLT4gbWV0aG9kIGlzIHRva2VuT3JNZXRob2RcclxuICAgICAgZWxzZVxyXG4gICAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbWV0aG9kIGlzIG5vdCByZWNvZ25pemVkLicgIFxyXG4gICAgZWxzZVxyXG4gICAgICBpZiB0b2tlbnNbdG9rZW5Pck1ldGhvZF1cclxuICAgICAgICBQdWJTdWIudW5zdWJzY3JpYmUgdG9rZW5Pck1ldGhvZFxyXG4gICAgICAgIGRlbGV0ZSB0b2tlbnNbdG9rZW5Pck1ldGhvZF1cclxuICAgIHJldHVyblxyXG4gIFxyXG4gIHVuc3Vic2NyaWJlQWxsID0gKCkgLT5cclxuICAgIE9KLmVhY2ggdG9rZW5zLCAodG9rZW4pIC0+IHVuc3Vic2NyaWJlIHRva2VuXHJcbiAgICBzdWJzY3JpYmVycyA9IFtdXHJcbiAgICBldmVudHMgPSB7fVxyXG4gICAgcmV0dXJuXHJcbiAgXHJcbiAgdW5zdWJzY3JpYmVFdmVudCA9IChldmVudCkgLT5cclxuICAgIGV2ZW50TmFtZSA9IGdldEV2ZW50TmFtZSBldmVudFxyXG4gICAgaWYgZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgT0ouZWFjaCBldmVudHNbZXZlbnROYW1lXSwgKG1ldGhvZCkgLT4gdW5zdWJzY3JpYmUgbWV0aG9kXHJcbiAgICBlbHNlXHJcbiAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbmFtZWQgeycgKyBldmVudCArICd9IGlzIG5vdCByZWNvZ25pemVkLidcclxuICAgIGRlbGV0ZSBldmVudHNbZXZlbnROYW1lXVxyXG4gICAgcmV0dXJuXHJcbiAgXHJcbiAgT0oucmVnaXN0ZXIgJ3B1Ymxpc2gnLCBwdWJsaXNoICBcclxuICBPSi5yZWdpc3RlciAnc3Vic2NyaWJlJywgc3Vic2NyaWJlICBcclxuICBPSi5yZWdpc3RlciAndW5zdWJzY3JpYmUnLCB1bnN1YnNjcmliZSAgXHJcbiAgT0oucmVnaXN0ZXIgJ3Vuc3Vic2NyaWJlQWxsJywgdW5zdWJzY3JpYmVBbGwgIFxyXG4gIE9KLnJlZ2lzdGVyICd1bnN1YnNjcmliZUV2ZW50JywgdW5zdWJzY3JpYmVFdmVudCAgXHJcblxyXG4gIHJldHVyblxyXG5cclxuIiwiZG8gKE9KID0gKGlmIHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsIHRoZW4gZ2xvYmFsIGVsc2UgKGlmIHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKS5PSikgLT5cclxuICBcclxuICAjIyNcclxuICBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkwMTExNS9ob3ctY2FuLWktZ2V0LXF1ZXJ5LXN0cmluZy12YWx1ZXMtaW4tamF2YXNjcmlwdFxyXG4gICMjI1xyXG4gIE9KLnJlZ2lzdGVyICdxdWVyeVN0cmluZycsIChwYXJhbSkgLT5cclxuICAgIHJldCA9IHt9XHJcbiAgICBcclxuICAgIGlmIE9KLmdsb2JhbC5sb2NhdGlvblxyXG4gICAgICBwYXJhbXMgPSAgT0ouZ2xvYmFsLmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkuc3BsaXQgJyYnXHJcbiAgICAgIGlmIHBhcmFtc1xyXG4gICAgICAgIGkgPSAwXHJcbiAgICAgICAgd2hpbGUgaSA8IHBhcmFtcy5sZW5ndGhcclxuICAgICAgICAgIHBybSA9IHBhcmFtc1tpXS5zcGxpdCAnPSdcclxuICAgICAgICAgIGlmIHBybS5sZW5ndGggaXMgMiBcclxuICAgICAgICAgICAgcmV0W3BybVswXV0gPSBPSi5nbG9iYWwuZGVjb2RlVVJJQ29tcG9uZW50IHBybVsxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpXHJcbiAgICAgICAgICBpICs9IDFcclxuICAgIHJldFxyXG4gICAgXHJcbiAgcmV0dXJuXHJcbiAgXHJcbiAgXHJcblxyXG4iLCIjICMgcmFuZ2VzXHJcblxyXG5kbyAoT0ogPSAoaWYgdHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwgdGhlbiBnbG9iYWwgZWxzZSAoaWYgdHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIHRoZW4gd2luZG93IGVsc2UgdGhpcykpLk9KKSAtPlxyXG5cclxuICAjICMjIHJhbmdlXHJcbiAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNyYW5nZSkncyBgcmFuZ2VgIG1ldGhvZFxyXG4gIE9KLnJlZ2lzdGVyICdyYW5nZScsIChwYXJhbXMuLi4pIC0+XHJcbiAgICBfLnJhbmdlIHBhcmFtcy4uLlxyXG4gIFxyXG4gICMgIyMgcmFuZ2VNaW5cclxuICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI21pbikncyBgbWluYCBtZXRob2RcclxuICBPSi5yZWdpc3RlciAncmFuZ2VNaW4nLCAocGFyYW1zLi4uKSAtPlxyXG4gICAgXy5taW4gcGFyYW1zLi4uXHJcblxyXG4gICMgIyMgcmFuZ2VNYXhcclxuICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI21heCkncyBgbWF4YCBtZXRob2RcclxuICBPSi5yZWdpc3RlciAncmFuZ2VNYXgnLCAocGFyYW1zLi4uKSAtPlxyXG4gICAgXy5tYXggcGFyYW1zLi4uXHJcblxyXG4gICMgIyMgc3RyaW5nUmFuZ2VUb1N1YlJhbmdlc1xyXG4gICMjI1xyXG4gIFRha2UgYW4gYXJyYXkgb2Ygc3RyaW5nIHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXHJcbiAgVXNlcyB0aGUgZmlyc3QgbGV0dGVyIG9mIGVhY2ggc3RyaW5nIHZhbHVlIGluIHRoZSBhcnJheSB0byBjb252ZXJ0IHRvIHVuaXF1ZSBjb2RlIGNoYXJhY3RlciAobG93ZXIgY2FzZSlcclxuICBCdWlsZHMgYSBpbnQgcmFuZ2UgYmFzZWQgb24gdW5pcXVlIGNvZGUgY2hhcnMuXHJcbiAgIyMjXHJcbiAgc3RyaW5nUmFuZ2VUb1N1YlJhbmdlcyA9IChuID0gNiwgcmFuZ2UgPSBbXSkgLT5cclxuICAgIGNoYXJSYW5nZSA9IFtdXHJcblxyXG5cclxuICAgIE9KLmVhY2ggcmFuZ2UsICh2YWwpIC0+XHJcbiAgICAgIGNoYXIgPSB2YWwudHJpbSgpWzBdLnRvTG93ZXJDYXNlKClcclxuICAgICAgaWYgZmFsc2UgaXMgT0ouY29udGFpbnMgY2hhclJhbmdlLCBjaGFyXHJcbiAgICAgICAgY2hhclJhbmdlLnB1c2ggY2hhci5jaGFyQ29kZUF0KClcclxuXHJcbiAgICByZXQgPSByYW5nZVRvU3ViUmFuZ2VzIG4sIGNoYXJSYW5nZVxyXG5cclxuICAgIGkgPSAwXHJcbiAgICB3aGlsZSBpIDwgblxyXG4gICAgICBpICs9IDFcclxuICAgICAgc3ViUmFuZ2UgPSByZXRbaV1cclxuICAgICAgc3ViUmFuZ2UubWFwIFN0cmluZy5mcm9tQ2hhckNvZGVcclxuXHJcbiAgICBvbGRHZXRSYW5nZSA9IHJldC5nZXRSYW5nZVxyXG4gICAgcmV0LmdldFJhbmdlID0gKHZhbCkgLT5cclxuICAgICAgY2hhciA9IHZhbC50cmltKClbMF0udG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KClcclxuICAgICAgaWR4ID0gb2xkR2V0UmFuZ2UgY2hhclxyXG4gICAgICBpZHhcclxuICAgIHJldFxyXG5cclxuICAjICMjIHJhbmdlVG9TdWJSYW5nZXNcclxuICAjIyNcclxuICBUYWtlIGFuIGFycmF5IG9mIGludCB2YWx1ZXMgYW5kIGEgbnVtYmVyIG9mIHBhcnRpdGlvbnMgdG8gY3JlYXRlLlxyXG4gIERpdmlkZXMgdGhlIG9yaWdpbmFsIGFycmF5IGludG8gdGhlIHNwZWNpZmllZCBudW1iZXIgb2Ygc3ViIGFycmF5cy5cclxuICBPdmVyZmxvdyBpcyBwYXNzZWQgdG8gdGhlIGZpbmFsIHBhcnRpdGlvbi5cclxuICAjIyNcclxuICByYW5nZVRvU3ViUmFuZ2VzID0gKG4gPSA2LCByYW5nZSA9IFtdKSAtPlxyXG4gICAgcmV0ID0gT0oub2JqZWN0KClcclxuICAgIHJhbmdlTG93ID0gT0oucmFuZ2VNaW4gcmFuZ2VcclxuICAgIHJhbmdlSGlnaCA9IE9KLnJhbmdlTWF4IHJhbmdlXHJcblxyXG4gICAgZGlzdGFuY2UgPSByYW5nZUhpZ2ggLSByYW5nZUxvd1xyXG4gICAgc3ViUmFuZ2VTaXplID0gZGlzdGFuY2UvblxyXG4gICAgc3ViUmFuZ2VzID0gcmV0LmFkZCAncmFuZ2VzJywgT0oub2JqZWN0KClcclxuICAgIGNodW5rVmFsID0gcmFuZ2VMb3dcclxuXHJcbiAgICBtYXAgPSBPSi5vYmplY3QoKVxyXG5cclxuICAgIGkgPSAwO1xyXG4gICAgd2hpbGUgaSA8IG5cclxuICAgICAgaSArPSAxXHJcbiAgICAgIGlmIGkgPCBuIHRoZW4ganVtcCA9IE1hdGgucm91bmQgc3ViUmFuZ2VTaXplXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBqdW1wID0gTWF0aC5mbG9vciBzdWJSYW5nZVNpemVcclxuICAgICAgICBpZiBjaHVua1ZhbCArIGp1bXAgPD0gcmFuZ2VIaWdoXHJcbiAgICAgICAgICBqdW1wICs9IHJhbmdlSGlnaCAtIGNodW5rVmFsIC0ganVtcCArIDFcclxuXHJcbiAgICAgIHN1YlJhbmdlID0gT0oucmFuZ2UgY2h1bmtWYWwsIGNodW5rVmFsICsganVtcFxyXG4gICAgICBPSi5lYWNoIHN1YlJhbmdlLCAodmFsKSAtPiBtYXAuYWRkIHZhbCwgaVxyXG4gICAgICBzdWJSYW5nZXNbaV0gPSBzdWJSYW5nZVxyXG4gICAgICBjaHVua1ZhbCArPSBqdW1wXHJcblxyXG4gICAgcmV0LmFkZCAnZ2V0UmFuZ2UnLCAodmFsKSAtPlxyXG4gICAgICBtYXBbdmFsXVxyXG5cclxuICAgIHJldFxyXG5cclxuICBPSi5yZWdpc3RlciAnc3RyaW5nUmFuZ2VUb1N1YlJhbmdlcycsIHN0cmluZ1JhbmdlVG9TdWJSYW5nZXNcclxuICBPSi5yZWdpc3RlciAncmFuZ2VUb1N1YlJhbmdlcycsIHJhbmdlVG9TdWJSYW5nZXNcclxuXHJcbiAgcmV0dXJuXHJcblxyXG4iLCIjICMgdG9cclxuXHJcbmRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgXHJcbiAgIyAjIyBib29sXHJcbiAgIyBjb252ZXJ0IGFueSBjb21wYXRpYmxlIG9iamVjdCB0byBhIGJvb2xlYW4uIEluY29tcGF0aWJsZSBvYmplY3RzIGFyZSBmYWxzZS5cclxuICBPSi50by5yZWdpc3RlciAnYm9vbCcsIChzdHIpIC0+XHJcbiAgICByZXRCb29sID0gT0ouaXNbJ3RydWUnXShzdHIpXHJcbiAgICByZXRCb29sID0gZmFsc2UgIGlmIHJldEJvb2wgaXMgZmFsc2Ugb3IgcmV0Qm9vbCBpc250IHRydWVcclxuICAgIHJldEJvb2xcclxuXHJcbiAgIyAjIyBFUzVfVG9Cb29sXHJcbiAgIyAoZGVidWcpIG1ldGhvZCB0byBleHBsaWNpdGx5IGZvcmNlIGFuIGBpZihvYmopYCBldmFsdWF0aW9uIHRvIGZsb3cgdGhyb3VnaCB0aGUgRVM1IHNwZWMgZm9yIHRydXRoaW5lc3NcclxuICBPSi50by5yZWdpc3RlciAnRVM1X1RvQm9vbCcsICh2YWwpIC0+XHJcbiAgICB2YWwgaXNudCBmYWxzZSBhbmQgdmFsIGlzbnQgMCBhbmQgdmFsIGlzbnQgJycgYW5kIHZhbCBpc250IG51bGwgYW5kIHZhbCBpc250IGB1bmRlZmluZWRgIGFuZCAodHlwZW9mIHZhbCBpc250ICdudW1iZXInIG9yIG5vdCBpc05hTih2YWwpKVxyXG5cclxuICAjICMjIGRhdGVGcm9tVGlja3NcclxuICAjIHRha2UgYSBudW1iZXIgcmVwcmVzZW50aW5nIHRpY2tzIGFuZCBjb252ZXJ0IGl0IGludG8gYW4gaW5zdGFuY2Ugb2YgRGF0ZVxyXG4gIE9KLnRvLnJlZ2lzdGVyICdkYXRlRnJvbVRpY2tzJywgKHRpY2tTdHIpIC0+XHJcbiAgICB0aWNzRGF0ZVRpbWUgPSBPSi50by5zdHJpbmcodGlja1N0cilcclxuICAgIHJldCA9IHVuZGVmaW5lZFxyXG4gICAgdGlja3MgPSB1bmRlZmluZWRcclxuICAgIG9mZnNldCA9IHVuZGVmaW5lZFxyXG4gICAgbG9jYWxPZmZzZXQgPSB1bmRlZmluZWRcclxuICAgIGFyciA9IHVuZGVmaW5lZFxyXG4gICAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkodGljc0RhdGVUaW1lKVxyXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnLycsICcnKVxyXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnRGF0ZScsICcnKVxyXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnKCcsICcnKVxyXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnKScsICcnKVxyXG4gICAgICBhcnIgPSB0aWNzRGF0ZVRpbWUuc3BsaXQoJy0nKVxyXG4gICAgICBpZiBhcnIubGVuZ3RoID4gMVxyXG4gICAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcclxuICAgICAgICBvZmZzZXQgPSBPSi50by5udW1iZXIoYXJyWzFdKVxyXG4gICAgICAgIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpXHJcbiAgICAgICAgcmV0ID0gbmV3IERhdGUoKHRpY2tzIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKVxyXG4gICAgICBlbHNlIGlmIGFyci5sZW5ndGggaXMgMVxyXG4gICAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcclxuICAgICAgICByZXQgPSBuZXcgRGF0ZSh0aWNrcylcclxuICAgIHJldFxyXG5cclxuICAjICMjIGJpbmFyeVxyXG4gICMgY29udmVydCBhbiBvYmplY3QgdG8gYmluYXJ5IDAgb3IgMVxyXG4gIE9KLnRvLnJlZ2lzdGVyICdiaW5hcnknLCAob2JqKSAtPlxyXG4gICAgcmV0ID0gTmFOXHJcbiAgICBpZiBvYmogaXMgMCBvciBvYmogaXMgJzAnIG9yIG9iaiBpcyAnJyBvciBvYmogaXMgZmFsc2Ugb3IgT0oudG8uc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgaXMgJ2ZhbHNlJ1xyXG4gICAgICByZXQgPSAwXHJcbiAgICBlbHNlIHJldCA9IDEgIGlmIG9iaiBpcyAxIG9yIG9iaiBpcyAnMScgb3Igb2JqIGlzIHRydWUgb3IgT0oudG8uc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgaXMgJ3RydWUnXHJcbiAgICByZXRcclxuXHJcbiAgXHJcbiAgIyAjIyBudW1iZXJcclxuICAjXHJcbiAgIyBBdHRlbXB0cyB0byBjb252ZXJ0IGFuIGFyYml0cmFyeSB2YWx1ZSB0byBhIE51bWJlci5cclxuICAjIExvb3NlIGZhbHN5IHZhbHVlcyBhcmUgY29udmVydGVkIHRvIDAuXHJcbiAgIyBMb29zZSB0cnV0aHkgdmFsdWVzIGFyZSBjb252ZXJ0ZWQgdG8gMS5cclxuICAjIEFsbCBvdGhlciB2YWx1ZXMgYXJlIHBhcnNlZCBhcyBJbnRlZ2Vycy5cclxuICAjIEZhaWx1cmVzIHJldHVybiBhcyBOYU4uXHJcbiAgIyBcclxuICBPSi50by5yZWdpc3RlciAnbnVtYmVyJywgKGlucHV0TnVtLCBkZWZhdWx0TnVtKSAtPlxyXG4gICAgdHJ5R2V0TnVtYmVyID0gKHZhbCkgLT5cclxuICAgICAgcmV0ID0gTmFOXHJcbiAgICAgICMgaWYgYHZhbGAgYWxyZWFkeSAoaXMpW2lzLmh0bWxdIGEgTnVtYmVyLCByZXR1cm4gaXQgXHJcbiAgICAgIGlmIE9KLmlzLm51bWJlcih2YWwpXHJcbiAgICAgICAgcmV0ID0gdmFsXHJcbiAgICAgICMgZWxzZSBpZiBgdmFsYCBhbHJlYWR5IChpcylbaXMuaHRtbF0gYSBTdHJpbmcgb3IgYSBCb29sZWFuLCBjb252ZXJ0IGl0ICBcclxuICAgICAgZWxzZSBpZiBPSi5pcy5zdHJpbmcodmFsKSBvciBPSi5pcy5ib29sKHZhbClcclxuICAgICAgICB0cnlHZXQgPSAodmFsdWUpIC0+XHJcbiAgICAgICAgICBudW0gPSBPSi50by5iaW5hcnkodmFsdWUpXHJcbiAgICAgICAgICBudW0gPSArdmFsdWUgIGlmIG5vdCBPSi5pcy5udW1iZXIobnVtKSBhbmQgdmFsdWVcclxuICAgICAgICAgIG51bSA9IF8ucGFyc2VJbnQodmFsdWUsIDApIGlmIG5vdCBPSi5pcy5udW1iZXIobnVtKVxyXG4gICAgICAgICAgbnVtXHJcbiAgICAgICAgcmV0ID0gdHJ5R2V0IHZhbFxyXG4gICAgICByZXRcclxuICAgICAgXHJcbiAgICByZXRWYWwgPSB0cnlHZXROdW1iZXIoaW5wdXROdW0pXHJcbiAgICBpZiBub3QgT0ouaXMubnVtYmVyKHJldFZhbClcclxuICAgICAgcmV0VmFsID0gdHJ5R2V0TnVtYmVyKGRlZmF1bHROdW0pXHJcbiAgICAgIHJldFZhbCA9IE51bWJlci5OYU4gaWYgbm90IE9KLmlzLm51bWJlcihyZXRWYWwpXHJcbiAgICByZXRWYWxcclxuXHJcbiAgIyAjIyBzdHJpbmdcclxuICAjIGNvbnZlcnQgYW4gb2JqZWN0IHRvIHN0cmluZ1xyXG4gIE9KLnRvLnJlZ2lzdGVyICdzdHJpbmcnLCAoaW5wdXRTdHIsIGRlZmF1bHRTdHIpIC0+XHJcbiAgICB0cnlHZXRTdHJpbmcgPSAoc3RyKSAtPlxyXG4gICAgICByZXQgPSB1bmRlZmluZWRcclxuICAgICAgaWYgT0ouaXMuc3RyaW5nKHN0cilcclxuICAgICAgICByZXQgPSBzdHJcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldCA9ICcnXHJcbiAgICAgICAgcmV0ID0gc3RyLnRvU3RyaW5nKCkgIGlmIE9KLmlzLmJvb2woc3RyKSBvciBPSi5pcy5udW1iZXIoc3RyKSBvciBPSi5pcy5kYXRlKHN0cilcclxuICAgICAgcmV0XHJcbiAgICByZXQxID0gdHJ5R2V0U3RyaW5nKGlucHV0U3RyKVxyXG4gICAgcmV0MiA9IHRyeUdldFN0cmluZyhkZWZhdWx0U3RyKVxyXG4gICAgcmV0VmFsID0gJydcclxuICAgIGlmIHJldDEubGVuZ3RoIGlzbnQgMFxyXG4gICAgICByZXRWYWwgPSByZXQxXHJcbiAgICBlbHNlIGlmIHJldDEgaXMgcmV0MiBvciByZXQyLmxlbmd0aCBpcyAwXHJcbiAgICAgIHJldFZhbCA9IHJldDFcclxuICAgIGVsc2VcclxuICAgICAgcmV0VmFsID0gcmV0MlxyXG4gICAgcmV0VmFsXHJcblxyXG4gIHJldHVyblxyXG5cclxuIiwiIyAjIGNyZWF0ZVVVSURcclxuXHJcbmRvIChPSiA9IChpZiB0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCB0aGVuIGdsb2JhbCBlbHNlIChpZiB0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkuT0opIC0+XHJcbiAgXHJcbiAgIyMjXHJcbiAgR2VuZXJhdGVzIGEgcmFuZG9tIHN0cmluZyB0aGF0IGNvbXBsaWVzIHRvIHRoZSBSRkMgNDEyMiBzcGVjaWZpY2F0aW9uIGZvciBHVUlEL1VVSUQuXHJcbiAgKGUuZy4gJ0I0MkExNTNGLTFEOUEtNEY5Mi05OTAzLTkyQzExREQ2ODREMicpXHJcbiAgV2hpbGUgbm90IGEgdHJ1ZSBVVUlELCBmb3IgdGhlIHB1cnBvc2VzIG9mIHRoaXMgYXBwbGljYXRpb24sIGl0IHNob3VsZCBiZSBzdWZmaWNpZW50LlxyXG4gICMjI1xyXG4gIGNyZWF0ZUZhdXhVVUlEID0gLT5cclxuICAgIFxyXG4gICAgIyBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmM0MTIyLnR4dFxyXG4gICAgIyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNTAzNC9ob3ctdG8tY3JlYXRlLWEtZ3VpZC11dWlkLWluLWphdmFzY3JpcHRcclxuICAgIHMgPSBbXVxyXG4gICAgcy5sZW5ndGggPSAzNlxyXG4gICAgaGV4RGlnaXRzID0gXCIwMTIzNDU2Nzg5YWJjZGVmXCJcclxuICAgIGkgPSAwXHJcblxyXG4gICAgd2hpbGUgaSA8IDM2XHJcbiAgICAgIHNbaV0gPSBoZXhEaWdpdHMuc3Vic3RyKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDB4MTApLCAxKVxyXG4gICAgICBpICs9IDFcclxuICAgIHNbMTRdID0gXCI0XCIgIyBiaXRzIDEyLTE1IG9mIHRoZSB0aW1lX2hpX2FuZF92ZXJzaW9uIGZpZWxkIHRvIDAwMTBcclxuICAgIHNbMTldID0gaGV4RGlnaXRzLnN1YnN0cigoc1sxOV0gJiAweDMpIHwgMHg4LCAxKSAjIGJpdHMgNi03IG9mIHRoZSBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkIHRvIDAxXHJcbiAgICBzWzhdID0gc1sxM10gPSBzWzE4XSA9IHNbMjNdID0gXCItXCJcclxuICAgIHV1aWQgPSBzLmpvaW4oXCJcIilcclxuICAgIHV1aWRcclxuXHJcbiAgT0oucmVnaXN0ZXIgXCJjcmVhdGVVVUlEXCIsIGNyZWF0ZUZhdXhVVUlEXHJcbiAgcmV0dXJuXHJcblxyXG4iXX0=
