/**
 * ojs: OJ is a framework for writing web components and templates in frothy CoffeeScript or pure JavaScript. OJ provides a mechanism to rapidly build web applications using well encapsulated, modular code that doesn't rely on string templating or partially baked web standards.
 * @version: v0.4.39
 * @link: http://somecallmechief.github.io/oj/
 * @license: Public Domain, CC0 (http://creativecommons.org/about/pdm)
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./oj');

require('./ojInit');

require('./async/ajax');

require('./async/promise');

require('./components/grid');

require('./components/inputgroup');

require('./components/tabs');

require('./components/tile');

require('./controls/icon');

require('./core/date');

require('./core/function');

require('./core/number');

require('./core/object');

require('./core/string');

require('./dom/nodeFactory');

require('./dom/body');

require('./dom/component');

require('./dom/control');

require('./dom/node');

require('./dom/element');

require('./dom/fragment');

require('./dom/generics');

require('./dom/input');

require('./elements/a');

require('./elements/br');

require('./elements/form');

require('./elements/input');

require('./elements/ol');

require('./elements/select');

require('./elements/table');

require('./elements/textarea');

require('./elements/thead');

require('./elements/ul');

require('./inputs/buttoninput');

require('./inputs/checkbox');

require('./inputs/color');

require('./inputs/date');

require('./inputs/datetime');

require('./inputs/datetimelocal');

require('./inputs/email');

require('./inputs/file');

require('./inputs/hidden');

require('./inputs/imageinput');

require('./inputs/month');

require('./inputs/number');

require('./inputs/password');

require('./inputs/radio');

require('./inputs/range');

require('./inputs/reset');

require('./inputs/search');

require('./inputs/submit');

require('./inputs/tel');

require('./inputs/textinput');

require('./inputs/time');

require('./inputs/url');

require('./inputs/week');

require('./tools/array2D');

require('./tools/console');

require('./tools/cookie');

require('./tools/defer');

require('./tools/each');

require('./tools/enums');

require('./tools/history');

require('./tools/is');

require('./tools/noty');

require('./tools/pubsub');

require('./tools/queryString');

require('./tools/ranges');

require('./tools/to');

require('./tools/uuid');



},{"./async/ajax":2,"./async/promise":3,"./components/grid":4,"./components/inputgroup":5,"./components/tabs":6,"./components/tile":7,"./controls/icon":8,"./core/date":9,"./core/function":10,"./core/number":11,"./core/object":12,"./core/string":14,"./dom/body":15,"./dom/component":16,"./dom/control":17,"./dom/element":18,"./dom/fragment":19,"./dom/generics":20,"./dom/input":21,"./dom/node":22,"./dom/nodeFactory":23,"./elements/a":24,"./elements/br":25,"./elements/form":26,"./elements/input":27,"./elements/ol":28,"./elements/select":29,"./elements/table":30,"./elements/textarea":31,"./elements/thead":32,"./elements/ul":33,"./inputs/buttoninput":35,"./inputs/checkbox":36,"./inputs/color":37,"./inputs/date":38,"./inputs/datetime":39,"./inputs/datetimelocal":40,"./inputs/email":41,"./inputs/file":42,"./inputs/hidden":43,"./inputs/imageinput":44,"./inputs/month":45,"./inputs/number":46,"./inputs/password":47,"./inputs/radio":48,"./inputs/range":49,"./inputs/reset":50,"./inputs/search":51,"./inputs/submit":52,"./inputs/tel":53,"./inputs/textinput":54,"./inputs/time":55,"./inputs/url":56,"./inputs/week":57,"./oj":58,"./ojInit":59,"./tools/array2D":61,"./tools/console":62,"./tools/cookie":63,"./tools/defer":64,"./tools/each":65,"./tools/enums":66,"./tools/history":67,"./tools/is":68,"./tools/noty":69,"./tools/pubsub":70,"./tools/queryString":71,"./tools/ranges":72,"./tools/to":73,"./tools/uuid":74}],2:[function(require,module,exports){
var OJ, ajax, config, optsFromUrl;

OJ = require('../oj');

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

module.exports = ajax;



},{"../oj":58}],3:[function(require,module,exports){
var OJ, ajaxPromise, all, defr;

OJ = require('../oj');

ajaxPromise = function(ajax) {
  var promise;
  promise = Promise.resolve(ajax);
  promise.abort = ajax.abort;
  promise.readyState = ajax.readyState;
  return promise;
};

all = function(initArray) {
  var promise, reqs;
  reqs = initArray || [];
  promise = Promise.all(reqs);
  promise.push = function(item) {
    reqs.push(item);
  };
  return promise;
};

defr = function(func) {
  var ret;
  if (func == null) {
    func = OJ.noop;
  }
  ret = Promise.method(func);
  return ret;
};

OJ.async.register('defer', defr);

OJ.async.register('all', all);

OJ.async.register('ajaxPromise', ajaxPromise);

module.exports = {
  defer: defr,
  all: all,
  ajaxPromise: ajaxPromise
};



},{"../oj":58}],4:[function(require,module,exports){
var OJ, array2D, className, cmpnt, component, nodeName;

OJ = require('../oj');

require('../ojInit');

component = require('../dom/component');

array2D = require('../tools/array2D');

nodeName = 'x-grid';

className = 'grid';

OJ.components.members[className] = nodeName;

cmpnt = function(options, owner) {
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
  ret = component(defaults, owner, nodeName);
  rows = [];
  tiles = array2D();
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
};

OJ.components.register(className, cmpnt);

module.exports = cmpnt;



},{"../dom/component":16,"../oj":58,"../ojInit":59,"../tools/array2D":61}],5:[function(require,module,exports){
var OJ, className, cmpnt, component, nodeName, uuid;

OJ = require('../oj');

require('../ojInit');

component = require('../dom/component');

uuid = require('../tools/uuid');

nodeName = 'x-input-group';

className = 'inputgroup';

OJ.components.members[className] = nodeName;

cmpnt = function(options, owner) {
  var defaults, forId, group, ret;
  forId = uuid();
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
  ret = component(defaults, owner, nodeName);
  group = ret.make('div', {
    props: {
      "class": 'form-group'
    }
  });
  ret.groupLabel = group.make('label', {
    props: {
      "for": forId
    },
    text: defaults.labelText
  });
  defaults.inputOpts.props["class"] += ' form-control';
  ret.groupInput = group.make('input', defaults.inputOpts);
  ret.groupValue = function() {
    return ret.groupInput.val();
  };
  return ret;
};

OJ.components.register(className, cmpnt);

module.exports = cmpnt;



},{"../dom/component":16,"../oj":58,"../ojInit":59,"../tools/uuid":74}],6:[function(require,module,exports){
var OJ, className, cmpnt, component, nodeName;

OJ = require('../oj');

require('../ojInit');

component = require('../dom/component');

nodeName = 'x-tabs';

className = 'tabs';

OJ.components.members[className] = nodeName;

cmpnt = function(options, owner) {
  var content, defaults, first, ret, tabs;
  defaults = {
    tabs: {},
    props: {
      "class": ''
    }
  };
  OJ.extend(defaults, options, true);
  ret = component(defaults, owner, nodeName);
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
    return ret.add(tabName, content.make('div', {
      props: {
        "class": tabContentClass,
        id: tabName
      }
    }));
  });
  return ret;
};

OJ.components.register(className, cmpnt);

module.exports = cmpnt;



},{"../dom/component":16,"../oj":58,"../ojInit":59}],7:[function(require,module,exports){
var OJ, className, cmpnt, component, nodeName;

OJ = require('../oj');

require('../ojInit');

component = require('../dom/component');

nodeName = 'x-tile';

className = 'tile';

OJ.components.members[className] = nodeName;

cmpnt = function(options, owner) {
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
};

OJ.components.register(className, cmpnt);

module.exports = cmpnt;



},{"../dom/component":16,"../oj":58,"../ojInit":59}],8:[function(require,module,exports){
var OJ, cntrl, control, controlName, friendlyName;

OJ = require('../oj');

require('../ojInit');

control = require('../dom/control');

controlName = 'y-icon';

friendlyName = 'icon';

OJ.controls.members[friendlyName] = controlName;

cntrl = function(options, owner) {
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
  ret = control(defaults, owner, controlName);
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
};

OJ.controls.register(friendlyName, cntrl);

module.exports = cntrl;



},{"../dom/control":17,"../oj":58,"../ojInit":59}],9:[function(require,module,exports){
var OJ, getDateFromDnJson;

OJ = require('../oj');

getDateFromDnJson = function(dnDate) {
  var arr, dnDateStr, localOffset, offset, ret, ticks;
  dnDateStr = OJ.to.string(dnDate);
  ret = void 0;
  ticks = void 0;
  offset = void 0;
  localOffset = void 0;
  arr = void 0;
  ret = OJ.dateTimeMinValue;
  if (false === OJ.is.nullOrEmpty(dnDateStr)) {
    dnDateStr = dnDateStr.replace('/', '');
    dnDateStr = dnDateStr.replace('Date', '');
    dnDateStr = dnDateStr.replace('(', '');
    dnDateStr = dnDateStr.replace(')', '');
    arr = dnDateStr.split('-');
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
  ret;
  OJ.register('getDateFromDnJson', getDateFromDnJson);
  return modules.exports = getDateFromDnJson;
};



},{"../oj":58}],10:[function(require,module,exports){
var OJ, method, tryExec;

OJ = require('../oj');

tryExec = function(tryFunc) {
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
    if ((exception.name === 'TypeError' || exception.type === 'called_non_callable') && exception.type === 'non_object_property_load') {
      OJ.console.info('Ignoring exception: ', exception);
    } else {
      OJ.console.error(exception);
    }
  } finally {

  }
  return ret;
};

method = function(tryFunc) {
  'use strict';
  var that;
  that = this;
  return function() {
    var args;
    args = Array.prototype.slice.call(arguments, 0);
    args.unshift(tryFunc);
    return OJ.tryExec.apply(that, args);
  };
};

OJ.register('method', method);

OJ.register('tryExec', tryExec);

module.exports = {
  method: method,
  tryExec: tryExec
};



},{"../oj":58}],11:[function(require,module,exports){
var OJ, number;

OJ = require('../oj');

number = Object.create(null);

Object.defineProperty(number, 'isNaN', {
  value: (Number && Number.isNaN ? Number.isNaN : isNaN)
});

Object.defineProperty(number, 'isFinite', {
  value: (Number && Number.isFinite ? Number.isFinite : isFinite)
});

Object.defineProperty(number, 'MAX_VALUE', {
  value: (Number && Number.MAX_VALUE ? Number.MAX_VALUE : 1.7976931348623157e+308)
});

Object.defineProperty(number, 'MIN_VALUE', {
  value: (Number && Number.MIN_VALUE ? Number.MIN_VALUE : 5e-324)
});

OJ.register('number', number);

module.exports = number;



},{"../oj":58}],12:[function(require,module,exports){
(function (global){
var $, OJ, _, func, isMethod, property, retObj, to;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

_ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

isMethod = require('../tools/is');

property = require('./property');

func = require('./function');

to = require('../tools/to');

retObj = {
  object: function(obj) {
    if (obj == null) {
      obj = {};
    }

    /*
    Add a property to the object and return it
     */
    obj.add = function(name, val) {
      property(obj, name, val);
      return obj;
    };
    obj.add('each', function(callback) {
      var each;
      each = require('../tools/each');
      return each(obj, function(val, key) {
        if (key !== 'each' && key !== 'add') {
          return callback(val, key);
        }
      });
    });
    return obj;
  },
  isInstanceOf: function(name, obj) {
    return retObj.contains(name, obj) && to.bool(obj[name]);
  },
  contains: function(object, index) {
    var ret;
    ret = false;
    if (object) {
      ret = _.contains(object, index);
    }
    return ret;
  },
  compare: function(obj1, obj2) {
    return _.isEqual(obj1, obj2);
  },
  clone: function(data) {
    return _.cloneDeep(data(true));
  },
  serialize: function(data) {
    var ret;
    ret = '';
    func.tryExec(function() {
      ret = JSON.stringify(data);
    });
    return ret || '';
  },
  deserialize: function(data) {
    var ret;
    ret = {};
    if (data) {
      func.tryExec(function() {
        ret = $.parseJSON(data);
      });
      if (isMethod.nullOrEmpty(ret)) {
        ret = {};
      }
    }
    return ret;
  },
  params: function(data, delimiter) {
    var each, ret;
    if (delimiter == null) {
      delimiter = '&';
    }
    ret = '';
    if (delimiter === '&') {
      func.tryExec(function() {
        ret = $.param(data);
      });
    } else {
      each = require('../tools/each');
      each(data, function(val, key) {
        if (ret.length > 0) {
          ret += delimiter;
        }
        ret += key + '=' + val;
      });
    }
    return to.string(ret);
  },
  extend: function(destObj, srcObj, deepCopy) {
    var key, ret, value;
    if (deepCopy == null) {
      deepCopy = false;
    }
    ret = destObj || {};
    for (key in srcObj) {
      value = srcObj[key];
      if (deepCopy && value && $.isPlainObject(value) && $.isPlainObject(ret[key])) {
        this.extend(ret[key], value, true);
      } else {
        ret[key] = value;
      }
    }
    return ret;
  }
};

OJ.register('object', retObj.object);

OJ.register('isInstanceOf', retObj.isInstanceOf);

OJ.register('contains', retObj.contains);

OJ.register('compare', retObj.compare);

OJ.register('clone', retObj.clone);

OJ.register('serialize', retObj.serialize);

OJ.register('deserialize', retObj.deserialize);

OJ.register('params', retObj.params);

OJ.register('extend', retObj.extend);

module.exports = retObj;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxvYmplY3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUNKLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7QUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0FBQ1gsSUFBQSxHQUFPLE9BQUEsQ0FBUSxZQUFSOztBQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsYUFBUjs7QUFJTCxNQUFBLEdBSUU7RUFBQSxNQUFBLEVBQVEsU0FBQyxHQUFEOztNQUFDLE1BQU07OztBQUViOzs7SUFHQSxHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsSUFBRCxFQUFPLEdBQVA7TUFDUixRQUFBLENBQVMsR0FBVCxFQUFjLElBQWQsRUFBb0IsR0FBcEI7YUFDQTtJQUZRO0lBSVYsR0FBRyxDQUFDLEdBQUosQ0FBUSxNQUFSLEVBQWdCLFNBQUMsUUFBRDtBQUNkLFVBQUE7TUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVI7YUFDUCxJQUFBLENBQUssR0FBTCxFQUFVLFNBQUMsR0FBRCxFQUFNLEdBQU47UUFDUixJQUFHLEdBQUEsS0FBUyxNQUFULElBQW9CLEdBQUEsS0FBUyxLQUFoQztpQkFDRSxRQUFBLENBQVMsR0FBVCxFQUFjLEdBQWQsRUFERjs7TUFEUSxDQUFWO0lBRmMsQ0FBaEI7V0FNQTtFQWZNLENBQVI7RUFvQkEsWUFBQSxFQUFjLFNBQUMsSUFBRCxFQUFPLEdBQVA7V0FDWixNQUFNLENBQUMsUUFBUCxDQUFnQixJQUFoQixFQUFzQixHQUF0QixDQUFBLElBQStCLEVBQUUsQ0FBQyxJQUFILENBQVEsR0FBSSxDQUFBLElBQUEsQ0FBWjtFQURuQixDQXBCZDtFQXlCQSxRQUFBLEVBQVUsU0FB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Qzs7QUFDQSxFQUFFLENBQUMsUUFBSCxDQUFZLGFBQVosRUFBMkIsTUFBTSxDQUFDLFdBQWxDOztBQUNBLEVBQUUsQ0FBQyxRQUFILENBQVksUUFBWixFQUFzQixNQUFNLENBQUMsTUFBN0I7O0FBQ0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxRQUFaLEVBQXNCLE1BQU0sQ0FBQyxNQUE3Qjs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiT0ogPSByZXF1aXJlICcuLi9vaidcclxuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcclxucHJvcGVydHkgPSByZXF1aXJlICcuL3Byb3BlcnR5J1xyXG5mdW5jID0gcmVxdWlyZSAnLi9mdW5jdGlvbidcclxudG8gPSByZXF1aXJlICcuLi90b29scy90bydcclxuXHJcbiMgIyBvYmplY3RcclxuXHJcbnJldE9iaiA9IFxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkub2JqZWN0XHJcbiAgIyBjcmVhdGUgYW4gb2JqZWN0IHdpdGggaGVscGVyIGBhZGRgIGFuZCBgZWFjaGAgbWV0aG9kcy5cclxuICBvYmplY3Q6IChvYmogPSB7fSkgLT5cclxuICAgIFxyXG4gICAgIyMjXHJcbiAgICBBZGQgYSBwcm9wZXJ0eSB0byB0aGUgb2JqZWN0IGFuZCByZXR1cm4gaXRcclxuICAgICMjI1xyXG4gICAgb2JqLmFkZCA9IChuYW1lLCB2YWwpIC0+XHJcbiAgICAgIHByb3BlcnR5IG9iaiwgbmFtZSwgdmFsXHJcbiAgICAgIG9ialxyXG5cclxuICAgIG9iai5hZGQgJ2VhY2gnLCAoY2FsbGJhY2spIC0+XHJcbiAgICAgIGVhY2ggPSByZXF1aXJlICcuLi90b29scy9lYWNoJ1xyXG4gICAgICBlYWNoIG9iaiwgKHZhbCwga2V5KSAtPlxyXG4gICAgICAgIGlmIGtleSBpc250ICdlYWNoJyBhbmQga2V5IGlzbnQgJ2FkZCdcclxuICAgICAgICAgIGNhbGxiYWNrIHZhbCwga2V5XHJcblxyXG4gICAgb2JqXHJcblxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuaXNJbnN0YW5jZU9mXHJcbiAgIyBkZXRlcm1pbmVzIGlzIGEgdGhpbmcgaXMgYW4gaW5zdGFuY2Ugb2YgYSBUaGluZywgYXNzdW1pbmcgdGhlIHRoaW5ncyB3ZXJlIGFsbCBjcmVhdGVkIGluIE9KXHJcbiAgaXNJbnN0YW5jZU9mOiAobmFtZSwgb2JqKSAtPlxyXG4gICAgcmV0T2JqLmNvbnRhaW5zKG5hbWUsIG9iaikgYW5kIHRvLmJvb2wob2JqW25hbWVdKVxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuY29udGFpbnNcclxuICAjIHRydWUgaWYgdGhlIGBvYmplY3RgIGNvbnRhaW5zIHRoZSB2YWx1ZVxyXG4gIGNvbnRhaW5zOiAob2JqZWN0LCBpbmRleCkgLT5cclxuICAgIHJldCA9IGZhbHNlXHJcbiAgICBpZiBvYmplY3RcclxuICAgICAgcmV0ID0gXy5jb250YWlucyBvYmplY3QsIGluZGV4XHJcbiAgICByZXRcclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmNvbXBhcmVcclxuICAjIGNvbXBhcmUgdHdvIG9iamVjdHMvYXJyYXlzL3ZhbHVlcyBmb3Igc3RyaWN0IGVxdWFsaXR5XHJcbiAgY29tcGFyZTogKG9iajEsIG9iajIpIC0+XHJcbiAgICBfLmlzRXF1YWwgb2JqMSwgb2JqMlxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuY2xvbmVcclxuICAjIGNvcHkgYWxsIG9mIHRoZSB2YWx1ZXMgKHJlY3Vyc2l2ZWx5KSBmcm9tIG9uZSBvYmplY3QgdG8gYW5vdGhlci5cclxuICBjbG9uZTogKGRhdGEpIC0+XHJcbiAgICBfLmNsb25lRGVlcCBkYXRhIHRydWVcclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLnNlcmlhbGl6ZVxyXG4gICMgQ29udmVydCBhbiBvYmplY3QgdG8gYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBvYmplY3RcclxuICBzZXJpYWxpemU6IChkYXRhKSAtPlxyXG4gICAgcmV0ID0gJydcclxuICAgIGZ1bmMudHJ5RXhlYyAtPlxyXG4gICAgICByZXQgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG4gICAgICByZXR1cm5cclxuICAgIHJldCBvciAnJ1xyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuZGVzZXJpYWxpemVcclxuICAjIENvbnZlcnQgYSBKU09OIHN0cmluZyB0byBhbiBvYmplY3RcclxuICBkZXNlcmlhbGl6ZTogKGRhdGEpIC0+XHJcbiAgICByZXQgPSB7fVxyXG4gICAgaWYgZGF0YVxyXG4gICAgICBmdW5jLnRyeUV4ZWMgLT5cclxuICAgICAgICByZXQgPSAkLnBhcnNlSlNPTihkYXRhKVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgcmV0ID0ge30gIGlmIGlzTWV0aG9kLm51bGxPckVtcHR5KHJldClcclxuICAgIHJldFxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkucGFyYW1zXHJcbiAgIyBDb252ZXJ0IGFuIG9iamVjdCB0byBhIGRlbGltaXRlZCBsaXN0IG9mIHBhcmFtZXRlcnMgKG5vcm1hbGx5IHF1ZXJ5LXN0cmluZyBwYXJhbWV0ZXJzKVxyXG4gIHBhcmFtczogKGRhdGEsIGRlbGltaXRlciA9ICcmJykgLT5cclxuICAgIHJldCA9ICcnXHJcbiAgICBpZiBkZWxpbWl0ZXIgaXMgJyYnXHJcbiAgICAgIGZ1bmMudHJ5RXhlYyAtPlxyXG4gICAgICAgIHJldCA9ICQucGFyYW0oZGF0YSlcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICBlbHNlXHJcbiAgICAgIGVhY2ggPSByZXF1aXJlICcuLi90b29scy9lYWNoJ1xyXG4gICAgICBlYWNoIGRhdGEsICh2YWwsIGtleSkgLT5cclxuICAgICAgICByZXQgKz0gZGVsaW1pdGVyICBpZiByZXQubGVuZ3RoID4gMFxyXG4gICAgICAgIHJldCArPSBrZXkgKyAnPScgKyB2YWxcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICB0by5zdHJpbmcgcmV0XHJcblxyXG4gICMgIyMgW09KXShvai5odG1sKS5leHRlbmRcclxuICAjIGNvcHkgdGhlIHByb3BlcnRpZXMgb2Ygb25lIG9iamVjdCB0byBhbm90aGVyIG9iamVjdFxyXG4gIGV4dGVuZDogKGRlc3RPYmosIHNyY09iaiwgZGVlcENvcHkgPSBmYWxzZSkgLT5cclxuICAgIHJldCA9IGRlc3RPYmogb3Ige31cclxuICAgIGZvciBrZXksIHZhbHVlIG9mIHNyY09ialxyXG4gICAgICBpZiBkZWVwQ29weSBhbmQgdmFsdWUgYW5kICQuaXNQbGFpbk9iamVjdCh2YWx1ZSkgYW5kICQuaXNQbGFpbk9iamVjdChyZXRba2V5XSlcclxuICAgICAgICAjIG1lcmdlIGludG8gZGVzdGluYXRpb24gcHJvcGVydHlcclxuICAgICAgICBAZXh0ZW5kIHJldFtrZXldLCB2YWx1ZSwgdHJ1ZVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0W2tleV0gPSB2YWx1ZVxyXG4gICAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAnb2JqZWN0JywgcmV0T2JqLm9iamVjdFxyXG5PSi5yZWdpc3RlciAnaXNJbnN0YW5jZU9mJywgcmV0T2JqLmlzSW5zdGFuY2VPZlxyXG5PSi5yZWdpc3RlciAnY29udGFpbnMnLCByZXRPYmouY29udGFpbnNcclxuT0oucmVnaXN0ZXIgJ2NvbXBhcmUnLCByZXRPYmouY29tcGFyZVxyXG5PSi5yZWdpc3RlciAnY2xvbmUnLCByZXRPYmouY2xvbmVcclxuT0oucmVnaXN0ZXIgJ3NlcmlhbGl6ZScsIHJldE9iai5zZXJpYWxpemVcclxuT0oucmVnaXN0ZXIgJ2Rlc2VyaWFsaXplJywgcmV0T2JqLmRlc2VyaWFsaXplXHJcbk9KLnJlZ2lzdGVyICdwYXJhbXMnLCByZXRPYmoucGFyYW1zXHJcbk9KLnJlZ2lzdGVyICdleHRlbmQnLCByZXRPYmouZXh0ZW5kXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJldE9iaiJdfQ==
},{"../oj":58,"../tools/each":65,"../tools/is":68,"../tools/to":73,"./function":10,"./property":13}],13:[function(require,module,exports){
var OJ, property;

OJ = require('../oj');


/*
Add a property to an object
 */

property = function(obj, name, value, writable, configurable, enumerable) {
  if (!obj) {
    throw new Error('Cannot define a property without an Object.');
  }
  if (name == null) {
    throw new Error('Cannot create a property without a valid property name.');
  }
  obj[name] = value;
  return obj;
};

OJ.register('property', property);

module.exports = property;



},{"../oj":58}],14:[function(require,module,exports){
var OJ, delimitedString;

OJ = require('../oj');

delimitedString = function(string, opts) {
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
};

OJ.register('delimitedString', delimitedString);

module.exports = delimitedString;



},{"../oj":58}],15:[function(require,module,exports){
(function (global){
var Node, OJ, _, body, ojBody;

OJ = require('../oj');

_ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

Node = require('./node');


/*
Persist a handle on the body node
 */

if (typeof document !== 'undefined') {
  body = document.body;
} else {
  body = null;
}

ojBody = new Node;

ojBody.element = body;

OJ.register('body', ojBody);

module.exports = ojBody;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxkb21cXGJvZHkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOzs7QUFHUDs7OztBQUdBLElBQUcsT0FBTyxRQUFQLEtBQXFCLFdBQXhCO0VBQXlDLElBQUEsR0FBTyxRQUFRLENBQUMsS0FBekQ7Q0FBQSxNQUFBO0VBQW1FLElBQUEsR0FBTyxLQUExRTs7O0FBQ0EsTUFBQSxHQUFTLElBQUk7O0FBQ2IsTUFBTSxDQUFDLE9BQVAsR0FBaUI7O0FBRWpCLEVBQUUsQ0FBQyxRQUFILENBQVksTUFBWixFQUFvQixNQUFwQjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuTm9kZSA9IHJlcXVpcmUgJy4vbm9kZSdcclxuXHJcblxyXG4jIyNcclxuUGVyc2lzdCBhIGhhbmRsZSBvbiB0aGUgYm9keSBub2RlXHJcbiMjI1xyXG5pZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJyB0aGVuIGJvZHkgPSBkb2N1bWVudC5ib2R5IGVsc2UgYm9keSA9IG51bGxcclxub2pCb2R5ID0gbmV3IE5vZGVcclxub2pCb2R5LmVsZW1lbnQgPSBib2R5XHJcbiAgXHJcbk9KLnJlZ2lzdGVyICdib2R5Jywgb2pCb2R5XHJcbm1vZHVsZS5leHBvcnRzID0gb2pCb2R5Il19
},{"../oj":58,"./node":22}],16:[function(require,module,exports){
var OJ, component, nodeFactory, obj;

OJ = require('../oj');

nodeFactory = require('./nodeFactory');

obj = require('../core/object');

component = function(options, owner, tagName) {
  var ret, rootNodeType, widget;
  if (options == null) {
    options = obj.object();
  }
  if (!tagName.startsWith('x-')) {
    tagName = 'x-' + tagName;
  }
  widget = nodeFactory(tagName, obj.object(), owner, false);
  rootNodeType = options.rootNodeType || OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] || 'div';
  ret = widget.make(rootNodeType, options);
  ret.componentName = tagName;
  ret.remove = widget.remove;
  return ret;
};

OJ.register('component', component);

module.exports = component;



},{"../core/object":12,"../oj":58,"./nodeFactory":23}],17:[function(require,module,exports){
var OJ, control, nodeFactory, obj;

OJ = require('../oj');

nodeFactory = require('./nodeFactory');

obj = require('../core/object');


/*
Create a set of HTML Elements through ThinDom
 */

control = function(options, owner, tagName) {
  var ret, rootNodeType;
  if (options == null) {
    options = obj.object();
  }
  if (!tagName.startsWith('y-')) {
    tagName = 'y-' + tagName;
  }
  rootNodeType = options.rootNodeType || OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] || 'div';
  ret = nodeFactory(rootNodeType, options, owner, false);
  ret.add('controlName', tagName);
  return ret;
};

OJ.register('control', control);

module.exports = control;



},{"../core/object":12,"../oj":58,"./nodeFactory":23}],18:[function(require,module,exports){
(function (global){
var $, Node, OJ, ThinDOM, _, element;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

_ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

Node = require('./node');

ThinDOM = (typeof window !== "undefined" ? window['ThinDOM'] : typeof global !== "undefined" ? global['ThinDOM'] : null);

element = {

  /*
  Restore an HTML Element through ThinDom
   */
  restoreElement: function(el, tag) {
    var node;
    if (tag == null) {
      tag = el.nodeName;
    }
    el.ofWrapper || (node = new Node);
    node.element = el;
    return node;
  }
};

OJ.register('restoreElement', element.restoreElement);

OJ.register('isElementInDom', function(elementId) {
  return false === OJ.is.nullOrEmpty(OJ.getElement(elementId));
});

OJ.register('getElement', function(id) {
  if (typeof document !== 'undefined') {
    return document.getElementById(id);
  }
});

module.exports = element;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxkb21cXGVsZW1lbnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUNKLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7QUFFUCxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVI7O0FBSVYsT0FBQSxHQUVFOztBQUFBOzs7RUFHQSxjQUFBLEVBQWdCLFNBQUMsRUFBRCxFQUFLLEdBQUw7QUFDZixRQUFBOztNQURvQixNQUFNLEVBQUUsQ0FBQzs7SUFDN0IsRUFBRSxDQUFDLFNBQUgsSUFDRSxDQUFBLElBQUEsR0FBTyxJQUFJLElBQVg7SUFDQSxJQUFJLENBQUMsT0FBTCxHQUFlO1dBQ2Y7RUFKYSxDQUhoQjs7O0FBU0YsRUFBRSxDQUFDLFFBQUgsQ0FBWSxnQkFBWixFQUE4QixPQUFPLENBQUMsY0FBdEM7O0FBRUEsRUFBRSxDQUFDLFFBQUgsQ0FBWSxnQkFBWixFQUE4QixTQUFDLFNBQUQ7U0FDNUIsS0FBQSxLQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBTixDQUFrQixFQUFFLENBQUMsVUFBSCxDQUFjLFNBQWQsQ0FBbEI7QUFEbUIsQ0FBOUI7O0FBR0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxZQUFaLEVBQTBCLFNBQUMsRUFBRDtFQUN4QixJQUFHLE9BQU8sUUFBUCxLQUFxQixXQUF4QjtXQUNFLFFBQVEsQ0FBQyxjQUFULENBQXdCLEVBQXhCLEVBREY7O0FBRHdCLENBQTFCOztBQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xyXG5Ob2RlID0gcmVxdWlyZSAnLi9ub2RlJ1xyXG5cclxuVGhpbkRPTSA9IHJlcXVpcmUgJ3RoaW5kb20nXHJcblxyXG4jICMgZWxlbWVudFxyXG5cclxuZWxlbWVudCA9IFxyXG4gICMgIyMgcmVzdG9yZUVsZW1lbnRcclxuICAjIyNcclxuICBSZXN0b3JlIGFuIEhUTUwgRWxlbWVudCB0aHJvdWdoIFRoaW5Eb21cclxuICAjIyNcclxuICByZXN0b3JlRWxlbWVudDogKGVsLCB0YWcgPSBlbC5ub2RlTmFtZSkgLT5cclxuICBcdGVsLm9mV3JhcHBlciBvclxyXG5cdCAgICBub2RlID0gbmV3IE5vZGVcclxuXHQgICAgbm9kZS5lbGVtZW50ID0gZWxcclxuXHQgICAgbm9kZVxyXG5cclxuT0oucmVnaXN0ZXIgJ3Jlc3RvcmVFbGVtZW50JywgZWxlbWVudC5yZXN0b3JlRWxlbWVudFxyXG5cclxuT0oucmVnaXN0ZXIgJ2lzRWxlbWVudEluRG9tJywgKGVsZW1lbnRJZCkgLT5cclxuICBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSBPSi5nZXRFbGVtZW50IGVsZW1lbnRJZFxyXG5cclxuT0oucmVnaXN0ZXIgJ2dldEVsZW1lbnQnLCAoaWQpIC0+XHJcbiAgaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCdcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWxlbWVudCJdfQ==
},{"../oj":58,"./node":22}],19:[function(require,module,exports){
var OJ, fragment, nodeFactory;

OJ = require('../oj');

nodeFactory = require('./nodeFactory');

fragment = function() {
  var frag, ret;
  ret = null;
  if (typeof document !== 'undefined') {
    fragment = document.createDocumentFragment();
    frag = new ThinDOM(null, null, fragment);
    frag.isInDOM = true;
    ret = nodeFactory(frag);
  }
  return ret;
};

OJ.register('fragment', fragment);

module.exports = fragment;



},{"../oj":58,"./nodeFactory":23}],20:[function(require,module,exports){
var OJ, all, closed, exports, fn, i, len, loopName, nodeFactory, obj, open;

OJ = require('../oj');

require('../ojInit');

obj = require('../core/object');

nodeFactory = require('./nodeFactory');

closed = ['abbr', 'acronym', 'applet', 'article', 'aside', 'audio', 'b', 'bdo', 'big', 'blockquote', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'html', 'i', 'iframe', 'ins', 'kbd', 'label', 'legend', 'li', 'map', 'mark', 'menu', 'meter', 'nav', 'noframes', 'noscript', 'object', 'optgroup', 'option', 'output', 'p', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'small', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'tbody', 'td', 'tfoot', 'th', 'time', 'title', 'tr', 'tt', 'u', 'var', 'video', 'xmp'];

open = 'area base col command css embed hr img keygen meta param source track wbr'.split(' ');

all = closed.concat(open);

exports = {};

fn = function(tag) {
  var method;
  method = function(options, owner, calledFromFactory) {
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
    obj.extend(defaults, options);
    ret = nodeFactory(tag, defaults, owner, calledFromFactory);
    return ret;
  };
  method.defaultBehavior = true;
  OJ.nodes.register(tag, method);
  return exports[tag] = method;
};
for (i = 0, len = all.length; i < len; i++) {
  loopName = all[i];
  fn(loopName);
}

module.exports = exports;



},{"../core/object":12,"../oj":58,"../ojInit":59,"./nodeFactory":23}],21:[function(require,module,exports){
var OJ, input;

OJ = require('../oj');


/*
Create an OJ Input Object through OJ.nodes.input
 */

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

module.exports = input;



},{"../oj":58}],22:[function(require,module,exports){
(function (global){
var $, Node, OJ, methods;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

methods = {};

Node = (function() {
  function Node(parent) {}

  Node.prototype.make = function(tagName, options) {
    var method, newOJNode;
    if (tagName.make) {
      return tagName.make(this, options);
    } else {
      method = methods[tagName];
      if (method) {
        return method(options);
      } else {
        method = OJ.nodes[tagName] || OJ.components[tagName] || OJ.controls[tagName] || OJ.inputs[tagName];
        if (method && !method.defaultBehavior) {
          return method(options, this);
        } else {
          newOJNode = new Node();
          newOJNode.element = ojCreateElement(this.element, tagName, options);
          return newOJNode;
        }
      }
    }
  };

  Node.prototype.add = function(name, value) {
    this[name] = value;
    return this.element.ojWrapper = this;
  };

  Node.prototype.get = function(name) {
    var parent, value;
    value = this[name];
    if (value === void 0) {
      parent = this.element;
      while (parent = parent.parentNode) {
        if (parent.ojWrapper) {
          return parent.ojWrapper.get(name);
        }
      }
    } else {
      return value;
    }
  };

  Node.prototype.show = function() {
    this.$.show();
    return ojCreateElement.onShow(this.element);
  };

  Node.prototype.disable = function() {
    this.$.attr('disabled', 'disabled');
    return this.$.addClass('disabled', 'disabled');
  };

  Node.prototype.enable = function() {
    this.$.removeAttr('disabled');
    return this.$.removeClass('disabled');
  };

  return Node;

})();

['on', 'empty', 'text', 'removeClass', 'addClass', 'hasClass', 'hide', 'attr', 'removeAttr', 'css', 'remove', 'append', 'val', 'html', 'prop', 'trigger'].forEach(function(method) {
  return Node.prototype[method] = function() {
    var jQueryWrapper;
    jQueryWrapper = this.$;
    return jQueryWrapper[method].apply(jQueryWrapper, arguments);
  };
});

Object.defineProperty(Node.prototype, '$', {
  get: function() {
    var jQueryWrapper;
    jQueryWrapper = $(this.element);
    Object.defineProperty(this, '$', {
      value: jQueryWrapper
    });
    return jQueryWrapper;
  }
});

module.exports = OJ.Node = Node;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxkb21cXG5vZGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBT0osT0FBQSxHQUFVOztBQUtKO0VBSVMsY0FBQyxNQUFELEdBQUE7O2lCQUViLElBQUEsR0FBTSxTQUFDLE9BQUQsRUFBVSxPQUFWO0FBQ0osUUFBQTtJQUFBLElBQUcsT0FBTyxDQUFDLElBQVg7YUFDRSxPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsRUFBbUIsT0FBbkIsRUFERjtLQUFBLE1BQUE7TUFHRSxNQUFBLEdBQVMsT0FBUSxDQUFBLE9BQUE7TUFDakIsSUFBRyxNQUFIO2VBQ0UsTUFBQSxDQUFPLE9BQVAsRUFERjtPQUFBLE1BQUE7UUFHRSxNQUFBLEdBQVMsRUFBRSxDQUFDLEtBQU0sQ0FBQSxPQUFBLENBQVQsSUFBcUIsRUFBRSxDQUFDLFVBQVcsQ0FBQSxPQUFBLENBQW5DLElBQStDLEVBQUUsQ0FBQyxRQUFTLENBQUEsT0FBQSxDQUEzRCxJQUF1RSxFQUFFLENBQUMsTUFBTyxDQUFBLE9BQUE7UUFDMUYsSUFBRyxNQUFBLElBQVUsQ0FBQyxNQUFNLENBQUMsZUFBckI7aUJBQ0UsTUFBQSxDQUFPLE9BQVAsRUFBZ0IsSUFBaEIsRUFERjtTQUFBLE1BQUE7VUFHRSxTQUFBLEdBQWdCLElBQUEsSUFBQSxDQUFBO1VBQ2hCLFNBQVMsQ0FBQyxPQUFWLEdBQW9CLGVBQUEsQ0FBZ0IsSUFBQyxDQUFBLE9BQWpCLEVBQTBCLE9BQTFCLEVBQW1DLE9BQW5DO2lCQUNwQixVQUxGO1NBSkY7T0FKRjs7RUFESTs7aUJBZ0JOLEdBQUEsR0FBSyxTQUFDLElBQUQsRUFBTyxLQUFQO0lBQ0gsSUFBSyxDQUFBLElBQUEsQ0FBTCxHQUFhO1dBRWIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCO0VBSGxCOztpQkFLTCxHQUFBLEdBQUssU0FBQyxJQUFEO0FBQ0gsUUFBQTtJQUFBLEtBQUEsR0FBUSxJQUFLLENBQUEsSUFBQTtJQUNiLElBQUcsS0FBQSxLQUFTLE1BQVo7TUFDRSxNQUFBLEdBQVMsSUFBQyxDQUFBO0FBQ1YsYUFBTSxNQUFBLEdBQVMsTUFBTSxDQUFDLFVBQXRCO1FBQ0UsSUFBRyxNQUFNLENBQUMsU0FBVjtBQUNFLGlCQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBakIsQ0FBcUIsSUFBckIsRUFEVDs7TUFERixDQUZGO0tBQUEsTUFBQTthQU1FLE1BTkY7O0VBRkc7O2lCQVVMLElBQUEsR0FBTSxTQUFBO0lBQ0osSUFBQyxDQUFBLENBQUMsQ0FBQyxJQUFILENBQUE7V0FDQSxlQUFlLENBQUMsTUFBaEIsQ0FBdUIsSUFBQyxDQUFBLE9BQXhCO0VBRkk7O2lCQUlOLE9BQUEsR0FBUyxTQUFBO0lBQ1AsSUFBQyxDQUFBLENBQUMsQ0FBQyxJQUFILENBQVEsVUFBUixFQUFvQixVQUFwQjtXQUNBLElBQUMsQ0FBQSxDQUFDLENBQUMsUUFBSCxDQUFZLFVBQVosRUFBd0IsVUFBeEI7RUFGTzs7aUJBSVQsTUFBQSxHQUFRLFNBQUE7SUFDTixJQUFDLENBQUEsQ0FBQyxDQUFDLFVBQUgsQ0FBZSxVQUFmO1dBQ0EsSUFBQyxDQUFBLENBQUMsQ0FBQyxXQUFILENBQWUsVUFBZjtFQUZNOzs7Ozs7QUFJVixDQUNFLElBREYsRUFFRSxPQUZGLEVBR0UsTUFIRixFQUlFLGFBSkYsRUFLRSxVQUxGLEVBTUUsVUFORixFQU9FLE1BUEYsRUFRRSxNQVJGLEVBU0UsWUFURixFQVVFLEtBVkYsRUFXRSxRQVhGLEVBWUUsUUFaRixFQWFFLEtBYkYsRUFjRSxNQWRGLEVBZUUsTUFmRixFQWdCRSxTQWhCRixDQWlCQyxDQUFDLE9BakJGLENBaUJVLFNBQUMsTUFBRDtTQUNSLElBQUksQ0FBQyxTQUFVLENBQUEsTUFBQSxDQUFmLEdBQXlCLFNBQUE7QUFDdkIsUUFBQTtJQUFBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBO1dBQ2pCLGFBQWMsQ0FBQSxNQUFBLENBQU8sQ0FBQyxLQUF0QixDQUE0QixhQUE1QixFQUEyQyxTQUEzQztFQUZ1QjtBQURqQixDQWpCVjs7QUF1QkEsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsSUFBSSxDQUFDLFNBQTNCLEVBQXNDLEdBQXRDLEVBQ0U7RUFBQSxHQUFBLEVBQUssU0FBQTtBQUNILFFBQUE7SUFBQSxhQUFBLEdBQWdCLENBQUEsQ0FBRSxJQUFJLENBQUMsT0FBUDtJQUNoQixNQUFNLENBQUMsY0FBUCxDQUFzQixJQUF0QixFQUE0QixHQUE1QixFQUNFO01BQUEsS0FBQSxFQUFPLGFBQVA7S0FERjtXQUdBO0VBTEcsQ0FBTDtDQURGOztBQVVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEVBQUUsQ0FBQyxJQUFILEdBQVUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiQgPSByZXF1aXJlICdqcXVlcnknXHJcblxyXG4jICMgZG9tXHJcblxyXG5cclxuIyBFeHRlbmQgYW4gb2JqZWN0IHdpdGggT0ogRE9NIG1ldGhvZHMgYW5kIHByb3BlcnRpZXNcclxuXHJcbm1ldGhvZHMgPSB7fVxyXG5cclxuXHJcbiMgLSBgQGVsYCBPYmplY3QgdG8gZXh0ZW5kXHJcbiMgLSBgcGFyZW50YCBwYXJlbnQgb2JqZWN0IHRvIHdoaWNoIGBAZWxgIHdpbGwgYmUgYXBwZW5kZWRcclxuY2xhc3MgTm9kZVxyXG4gIFxyXG4gICNwYXJlbnQ6IHJlcXVpcmUoJy4vYm9keScpXHJcbiAgXHJcbiAgY29uc3RydWN0b3I6IChwYXJlbnQpIC0+XHJcblxyXG4gIG1ha2U6ICh0YWdOYW1lLCBvcHRpb25zKSAtPlxyXG4gICAgaWYgdGFnTmFtZS5tYWtlICMgcHJvdmlkZWQgYSBjdXN0b20gY29tcG9uZW50IGRpcmVjdGx5XHJcbiAgICAgIHRhZ05hbWUubWFrZSB0aGlzLCBvcHRpb25zXHJcbiAgICBlbHNlXHJcbiAgICAgIG1ldGhvZCA9IG1ldGhvZHNbdGFnTmFtZV1cclxuICAgICAgaWYgbWV0aG9kXHJcbiAgICAgICAgbWV0aG9kIG9wdGlvbnNcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG1ldGhvZCA9IE9KLm5vZGVzW3RhZ05hbWVdIG9yIE9KLmNvbXBvbmVudHNbdGFnTmFtZV0gb3IgT0ouY29udHJvbHNbdGFnTmFtZV0gb3IgT0ouaW5wdXRzW3RhZ05hbWVdXHJcbiAgICAgICAgaWYgbWV0aG9kICYmICFtZXRob2QuZGVmYXVsdEJlaGF2aW9yXHJcbiAgICAgICAgICBtZXRob2Qgb3B0aW9ucywgdGhpc1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIG5ld09KTm9kZSA9IG5ldyBOb2RlKClcclxuICAgICAgICAgIG5ld09KTm9kZS5lbGVtZW50ID0gb2pDcmVhdGVFbGVtZW50IEBlbGVtZW50LCB0YWdOYW1lLCBvcHRpb25zXHJcbiAgICAgICAgICBuZXdPSk5vZGVcclxuXHJcbiAgYWRkOiAobmFtZSwgdmFsdWUpIC0+XHJcbiAgICB0aGlzW25hbWVdID0gdmFsdWVcclxuICAgICMgbWFrZSBzdXJlIHdlIGhhdmUgYSBsaW5rIGJhY2sgdG8gb3Vyc2VsdmVzLCBzbyB3ZSBjYW4gaW5oZXJpdCB2YWx1ZXNcclxuICAgIEBlbGVtZW50Lm9qV3JhcHBlciA9IHRoaXNcclxuXHJcbiAgZ2V0OiAobmFtZSkgLT5cclxuICAgIHZhbHVlID0gdGhpc1tuYW1lXVxyXG4gICAgaWYgdmFsdWUgaXMgdW5kZWZpbmVkXHJcbiAgICAgIHBhcmVudCA9IEBlbGVtZW50XHJcbiAgICAgIHdoaWxlIHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlXHJcbiAgICAgICAgaWYgcGFyZW50Lm9qV3JhcHBlclxyXG4gICAgICAgICAgcmV0dXJuIHBhcmVudC5valdyYXBwZXIuZ2V0IG5hbWVcclxuICAgIGVsc2VcclxuICAgICAgdmFsdWVcclxuXHJcbiAgc2hvdzogKCkgLT5cclxuICAgIEAkLnNob3coKVxyXG4gICAgb2pDcmVhdGVFbGVtZW50Lm9uU2hvdyBAZWxlbWVudFxyXG5cclxuICBkaXNhYmxlOiAoKSAtPlxyXG4gICAgQCQuYXR0ciAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnXHJcbiAgICBAJC5hZGRDbGFzcyAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnXHJcblxyXG4gIGVuYWJsZTogKCkgLT5cclxuICAgIEAkLnJlbW92ZUF0dHIgICdkaXNhYmxlZCdcclxuICAgIEAkLnJlbW92ZUNsYXNzICdkaXNhYmxlZCdcclxuXHJcbltcclxuICAnb24nXHJcbiAgJ2VtcHR5J1xyXG4gICd0ZXh0J1xyXG4gICdyZW1vdmVDbGFzcydcclxuICAnYWRkQ2xhc3MnXHJcbiAgJ2hhc0NsYXNzJ1xyXG4gICdoaWRlJ1xyXG4gICdhdHRyJ1xyXG4gICdyZW1vdmVBdHRyJ1xyXG4gICdjc3MnXHJcbiAgJ3JlbW92ZSdcclxuICAnYXBwZW5kJ1xyXG4gICd2YWwnXHJcbiAgJ2h0bWwnXHJcbiAgJ3Byb3AnXHJcbiAgJ3RyaWdnZXInXHJcbl0uZm9yRWFjaCgobWV0aG9kKSAtPlxyXG4gIE5vZGUucHJvdG90eXBlW21ldGhvZF0gPSAoKSAtPlxyXG4gICAgalF1ZXJ5V3JhcHBlciA9IEAkXHJcbiAgICBqUXVlcnlXcmFwcGVyW21ldGhvZF0uYXBwbHkoalF1ZXJ5V3JhcHBlciwgYXJndW1lbnRzKVxyXG4pXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoTm9kZS5wcm90b3R5cGUsICckJyxcclxuICBnZXQ6ICgpIC0+XHJcbiAgICBqUXVlcnlXcmFwcGVyID0gJCh0aGlzLmVsZW1lbnQpXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJyQnLFxyXG4gICAgICB2YWx1ZTogalF1ZXJ5V3JhcHBlclxyXG4gICAgKVxyXG4gICAgalF1ZXJ5V3JhcHBlclxyXG4pXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBPSi5Ob2RlID0gTm9kZSJdfQ==
},{"../oj":58}],23:[function(require,module,exports){
(function (global){
var Node, NodeFactory, OJ, ThinDOM, _, defaultCreateElement, getNodeFromFactory, make,
  slice = [].slice;

OJ = require('../oj');

_ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

ThinDOM = (typeof window !== "undefined" ? window['ThinDOM'] : typeof global !== "undefined" ? global['ThinDOM'] : null);

Node = require('./node');

NodeFactory = (function() {
  NodeFactory.prototype.ojNode = null;

  NodeFactory.get = function(id, tagName) {
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
      ret = new NodeFactory(null, null, null, false, thinEl);
    }
    return ret;
  };

  NodeFactory.prototype._makeAdd = function(tagName, count) {
    return (function(_this) {
      return function(opts) {
        var method, nu;
        method = OJ.nodes[tagName] || OJ.components[tagName] || OJ.controls[tagName] || OJ.inputs[tagName];
        if (method) {
          nu = method(opts, _this.ojNode);
        } else {
          nu = OJ.component(null, _this.ojNode, tagName);
        }
        return nu;
      };
    })(this);
  };

  NodeFactory.prototype._makeUniqueId = function(count) {
    var id;
    if (OJ.GENERATE_UNIQUE_IDS) {
      count += 1;
      if (count <= this.owner.count) {
        count = this.owner.count + 1;
      }
      this.owner.count = count;
      if (!this.ojNode.getId()) {
        id = this.owner.getId() || '';
        id += this.ojNode.tagName + count;
        this.ojNode.attr('id', id);
      }
    }
  };

  NodeFactory.prototype._bindEvents = function() {
    if (this.ojNode) {
      return _.forOwn(this.options.events, (function(_this) {
        return function(val, key) {
          var callback, isMethod;
          isMethod = require('../tools/is');
          if (isMethod.method(val)) {
            callback = function() {
              var event;
              event = 1 <= arguments.length ? slice.call(arguments, 0) : [];
              return val.apply(null, event);
            };
            _this.ojNode.$.on(key, callback);
            _this.ojNode.add(key, callback);
            return null;
          }
        };
      })(this));
    }
  };

  function NodeFactory(tag1, options1, owner1, thinNode) {
    this.tag = tag1;
    this.options = options1;
    this.owner = owner1;
    this.thinNode = thinNode != null ? thinNode : null;
    if (this.tag && !this.thinNode) {
      this.thinNode = new ThinDOM(this.tag, this.options.props);
      this.thinNode.add('tagName', this.tag);
      this.thinNode.css(this.options.styles);
      if (this.options.text) {
        this.thinNode.text(this.options.text);
      }
    }
    if (this.owner) {
      this.make();
    }
  }

  NodeFactory.prototype.addMakeMethod = function(count) {
    var methods;
    methods = OJ.object();
    this.ojNode.make = (function(_this) {
      return function(tagName, opts) {
        var method;
        method = methods[tagName];
        if (!method) {
          method = _this._makeAdd(tagName, _this.ojNode, count);
          methods[tagName] = method;
        }
        return method(opts);
      };
    })(this);
    return this.ojNode;
  };

  NodeFactory.prototype.make = function() {
    var count, finalize, ref;
    this.ojNode = null;
    if ((ref = this.thinNode) != null ? ref.isFullyInit : void 0) {
      this.ojNode = this.thinNode;
    } else {
      this.ojNode = new Node(this.thinNode, this.owner);
      count = (this.owner.count + 1) || 1;
      if (this.thinNode.tagName !== 'body' && !this.thinNode.isInDOM && !this.ojNode.isInDOM) {
        this._makeUniqueId(count);
        this.owner.append(this.ojNode[0]);
        this._bindEvents();
      }
      this.thinNode.isInDOM = true;
      this.ojNode.isInDOM = true;
      this.addMakeMethod(count);
      this.ojNode.isFullyInit = true;
      finalize = _.once(this.ojNode.finalize || OJ.noop);
      this.ojNode.finalize = finalize;
      finalize(this.ojNode);
    }
    return this.ojNode;
  };

  return NodeFactory;

})();

defaultCreateElement = function(parent, tag, options) {
  var key, newElement, ref, ref1, ref2, value;
  newElement = document.createElement(tag);
  if (options) {
    ref = options.props;
    for (key in ref) {
      value = ref[key];
      newElement.setAttribute(key, value);
    }
    ref1 = options.events;
    for (key in ref1) {
      value = ref1[key];
      $(newElement).on(key, value);
    }
    ref2 = options.styles;
    for (key in ref2) {
      value = ref2[key];
      $(newElement).css(key, value);
    }
    value = options.text;
    if (value !== void 0) {
      $(newElement).text(value);
    }
  }
  return parent != null ? parent.appendChild(newElement) : void 0;
};

getNodeFromFactory = function(tag, options, owner, isCalledFromFactory, node) {
  var newOJNode;
  newOJNode = new Node();
  if (!window.ojCreateElement) {
    window.ojCreateElement = defaultCreateElement;
  }
  newOJNode.element = ojCreateElement(owner.element, tag || 'div', options);
  return newOJNode;
};

OJ.register('nodeFactory', getNodeFromFactory);

make = function(tag, options) {
  var newOJNode;
  newOJNode = new Node();
  newOJNode.element = ojCreateElement(null, tag || 'div', options);
  return newOJNode;
};

OJ.register('make', make);

module.exports = getNodeFromFactory;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxkb21cXG5vZGVGYWN0b3J5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQSxpRkFBQTtFQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSOztBQUNWLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7QUErRUQ7d0JBRUosTUFBQSxHQUFROztFQUVSLFdBQUMsQ0FBQSxHQUFELEdBQU0sU0FBQyxFQUFELEVBQUssT0FBTDtBQUNKLFFBQUE7O01BRFMsVUFBVTs7SUFDbkIsR0FBQSxHQUFNO0lBQ04sRUFBQSxHQUFLLFFBQVEsQ0FBQyxjQUFULENBQXdCLEVBQXhCO0lBQ0wsSUFBRyxFQUFIO01BQ0UsTUFBQSxHQUFTLEVBQUUsQ0FBQyxjQUFILENBQWtCLEVBQWxCLEVBQXNCLE9BQXRCLEVBRFg7O0lBRUEsSUFBRyxNQUFIO01BQ0UsR0FBQSxHQUFVLElBQUEsV0FBQSxDQUFZLElBQVosRUFBa0IsSUFBbEIsRUFBd0IsSUFBeEIsRUFBOEIsS0FBOUIsRUFBcUMsTUFBckMsRUFEWjs7V0FHQTtFQVJJOzt3QkFVTixRQUFBLEdBQVUsU0FBQyxPQUFELEVBQVUsS0FBVjtXQUNSLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxJQUFEO0FBQ0UsWUFBQTtRQUFBLE1BQUEsR0FBUyxFQUFFLENBQUMsS0FBTSxDQUFBLE9BQUEsQ0FBVCxJQUFxQixFQUFFLENBQUMsVUFBVyxDQUFBLE9BQUEsQ0FBbkMsSUFBK0MsRUFBRSxDQUFDLFFBQVMsQ0FBQSxPQUFBLENBQTNELElBQXVFLEVBQUUsQ0FBQyxNQUFPLENBQUEsT0FBQTtRQUMxRixJQUFHLE1BQUg7VUFDRSxFQUFBLEdBQUssTUFBQSxDQUFPLElBQVAsRUFBYSxLQUFDLENBQUEsTUFBZCxFQURQO1NBQUEsTUFB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O1NBQ3BCO0FBTG1COztBQU9yQixFQUFFLENBQUMsUUFBSCxDQUFZLGFBQVosRUFBMkIsa0JBQTNCOztBQUVBLElBQUEsR0FBTyxTQUFDLEdBQUQsRUFBTSxPQUFOO0FBQ0wsTUFBQTtFQUFBLFNBQUEsR0FBZ0IsSUFBQSxJQUFBLENBQUE7RUFDaEIsU0FBUyxDQUFDLE9BQVYsR0FBb0IsZUFBQSxDQUFnQixJQUFoQixFQUFzQixHQUFBLElBQU8sS0FBN0IsRUFBb0MsT0FBcEM7U0FDcEI7QUFISzs7QUFLUCxFQUFFLENBQUMsUUFBSCxDQUFZLE1BQVosRUFBb0IsSUFBcEI7O0FBSUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbl8gPSByZXF1aXJlICdsb2Rhc2gnXHJcblRoaW5ET00gPSByZXF1aXJlICd0aGluZG9tJ1xyXG5Ob2RlID0gcmVxdWlyZSAnLi9ub2RlJ1xyXG5cclxuI2Nsb3NlZCA9ICdhIGFiYnIgYWNyb255bSBhZGRyZXNzIGFwcGxldCBhcnRpY2xlIGFzaWRlIGF1ZGlvIGIgYmRvIGJpZyBibG9ja3F1b3RlIGJvZHkgYnV0dG9uIGNhbnZhcyBjYXB0aW9uIGNlbnRlciBjaXRlIGNvZGUgY29sZ3JvdXAgY29tbWFuZCBkYXRhbGlzdCBkZCBkZWwgZGV0YWlscyBkZm4gZGlyIGRpdiBkbCBkdCBlbSBlbWJlZCBmaWVsZHNldCBmaWdjYXB0aW9uIGZpZ3VyZSBmb250IGZvb3RlciBmb3JtIGZyYW1lc2V0IGgxIGgyIGgzIGg0IGg1IGg2IGhlYWQgaGVhZGVyIGhncm91cCBodG1sIGkgaWZyYW1lIGlucyBrZXlnZW4ga2JkIGxhYmVsIGxlZ2VuZCBsaSBtYXAgbWFyayBtZW51IG1ldGVyIG5hdiBub2ZyYW1lcyBub3NjcmlwdCBvYmplY3Qgb2wgb3B0Z3JvdXAgb3B0aW9uIG91dHB1dCBwIHByZSBwcm9ncmVzcyBxIHJwIHJ0IHJ1YnkgcyBzYW1wIHNjcmlwdCBzZWN0aW9uIHNlbGVjdCBzbWFsbCBzb3VyY2Ugc3BhbiBzdHJpa2Ugc3Ryb25nIHN0eWxlIHN1YiBzdW1tYXJ5IHN1cCB0YWJsZSB0Ym9keSB0ZCB0ZXh0YXJlYSB0Zm9vdCB0aCB0aGVhZCB0aW1lIHRpdGxlIHRyIHR0IHUgdWwgdmFyIHZpZGVvIHdiciB4bXAnLnNwbGl0ICcgJ1xyXG4jb3BlbiA9ICdhcmVhIGJhc2UgYnIgY29sIGNvbW1hbmQgY3NzICFET0NUWVBFIGVtYmVkIGhyIGltZyBpbnB1dCBrZXlnZW4gbGluayBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnInLnNwbGl0ICcgJ1xyXG4jXHJcbiNuZXN0YWJsZU5vZGVOYW1lcyA9IFtcclxuIyAgJ2RpdidcclxuIyAgJ3NwYW4nXHJcbiMgICdoMSdcclxuIyAgJ2gyJ1xyXG4jICAnaDMnXHJcbiMgICdoNCdcclxuIyAgJ2g1J1xyXG4jICAnaDYnXHJcbiMgICdwJ1xyXG4jICAnZmllbGRzZXQnXHJcbiMgICdzZWxlY3QnXHJcbiMgICdvbCdcclxuIyAgJ3VsJ1xyXG4jICAndGFibGUnXHJcbiNdXHJcbiNcclxuIyNUaGlzIGxpc3QgaXMgbm90IHlldCBleGhhdXN0aXZlLCBqdXN0IGV4Y2x1ZGUgdGhlIG9idmlvdXNcclxuI25vbk5lc3RhYmxlTm9kZXMgPSBbXHJcbiMgICdsaSdcclxuIyAgJ2xlZ2VuZCdcclxuIyAgJ3RyJ1xyXG4jICAndGQnXHJcbiMgICdvcHRpb24nXHJcbiMgICdib2R5J1xyXG4jICAnaGVhZCdcclxuIyAgJ3NvdXJjZSdcclxuIyAgJ3Rib2R5J1xyXG4jICAndGZvb3QnXHJcbiMgICd0aGVhZCdcclxuIyAgJ2xpbmsnXHJcbiMgICdzY3JpcHQnXHJcbiNdXHJcbiNcclxuI25vZGVOYW1lcyA9IFtcclxuIyAgJ2EnXHJcbiMgICdiJ1xyXG4jICAnYnInXHJcbiMgICdidXR0b24nXHJcbiMgICdkaXYnXHJcbiMgICdlbSdcclxuIyAgJ2ZpZWxkc2V0J1xyXG4jICAnZm9ybSdcclxuIyAgJ2gxJ1xyXG4jICAnaDInXHJcbiMgICdoMydcclxuIyAgJ2g0J1xyXG4jICAnaDUnXHJcbiMgICdoNidcclxuIyAgJ2knXHJcbiMgICdpbWcnXHJcbiMgICdpbnB1dCdcclxuIyAgJ2xhYmVsJ1xyXG4jICAnbGVnZW5kJ1xyXG4jICAnbGknXHJcbiMgICduYXYnXHJcbiMgICdvbCdcclxuIyAgJ29wdGlvbidcclxuIyAgJ3AnXHJcbiMgICdzZWxlY3QnXHJcbiMgICdzcGFuJ1xyXG4jICAnc3Ryb25nJ1xyXG4jICAnc3VwJ1xyXG4jICAnc3ZnJ1xyXG4jICAndGFibGUnXHJcbiMgICd0Ym9keSdcclxuIyAgJ3RkJ1xyXG4jICAndGV4dGFyZWEnXHJcbiMgICd0aCdcclxuIyAgJ3RoZWFkJ1xyXG4jICAndHInXHJcbiMgICd1bCdcclxuI11cclxuXHJcbmNsYXNzIE5vZGVGYWN0b3J5XHJcbiAgXHJcbiAgb2pOb2RlOiBudWxsXHJcbiAgXHJcbiAgQGdldDogKGlkLCB0YWdOYW1lID0gJ2RpdicpIC0+XHJcbiAgICByZXQgPSBudWxsXHJcbiAgICBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkIGlkXHJcbiAgICBpZiBlbFxyXG4gICAgICB0aGluRWwgPSBPSi5yZXN0b3JlRWxlbWVudCBlbCwgdGFnTmFtZVxyXG4gICAgaWYgdGhpbkVsXHJcbiAgICAgIHJldCA9IG5ldyBOb2RlRmFjdG9yeSBudWxsLCBudWxsLCBudWxsLCBmYWxzZSwgdGhpbkVsXHJcblxyXG4gICAgcmV0XHJcbiAgXHJcbiAgX21ha2VBZGQ6ICh0YWdOYW1lLCBjb3VudCkgLT5cclxuICAgIChvcHRzKSA9PlxyXG4gICAgICBtZXRob2QgPSBPSi5ub2Rlc1t0YWdOYW1lXSBvciBPSi5jb21wb25lbnRzW3RhZ05hbWVdIG9yIE9KLmNvbnRyb2xzW3RhZ05hbWVdIG9yIE9KLmlucHV0c1t0YWdOYW1lXVxyXG4gICAgICBpZiBtZXRob2RcclxuICAgICAgICBudSA9IG1ldGhvZCBvcHRzLCBAb2pOb2RlXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBudSA9IE9KLmNvbXBvbmVudCBudWxsLCBAb2pOb2RlLCB0YWdOYW1lXHJcbiAgICAgICNyZXQgPSBuZXcgTm9kZUZhY3RvcnkgbnUsIEB0aGluTm9kZSwgY291bnRcclxuICAgICAgbnVcclxuICBcclxuICBfbWFrZVVuaXF1ZUlkOiAoY291bnQpIC0+XHJcbiAgICBpZiBPSi5HRU5FUkFURV9VTklRVUVfSURTXHJcbiAgICAgIGNvdW50ICs9IDFcclxuICAgICAgaWYgY291bnQgPD0gQG93bmVyLmNvdW50IHRoZW4gY291bnQgPSBAb3duZXIuY291bnQgKyAxXHJcbiAgICAgIEBvd25lci5jb3VudCA9IGNvdW50XHJcblxyXG4gICAgICBpZiBub3QgQG9qTm9kZS5nZXRJZCgpXHJcbiAgICAgICAgaWQgPSBAb3duZXIuZ2V0SWQoKSBvciAnJ1xyXG4gICAgICAgIGlkICs9IEBvak5vZGUudGFnTmFtZSArIGNvdW50XHJcbiAgICAgICAgQG9qTm9kZS5hdHRyICdpZCcsIGlkXHJcbiAgICByZXR1cm5cclxuICBcclxuICBfYmluZEV2ZW50czogLT5cclxuICAgIGlmIEBvak5vZGUgdGhlbiBfLmZvck93biBAb3B0aW9ucy5ldmVudHMsICh2YWwsIGtleSkgPT5cclxuICAgICAgaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcclxuICAgICAgaWYgaXNNZXRob2QubWV0aG9kIHZhbFxyXG4gICAgICAgIGNhbGxiYWNrID0gKGV2ZW50Li4uKSAtPiB2YWwgZXZlbnQuLi5cclxuICAgICAgICBAb2pOb2RlLiQub24ga2V5LCBjYWxsYmFja1xyXG4gICAgICAgIEBvak5vZGUuYWRkIGtleSwgY2FsbGJhY2tcclxuICAgICAgICBudWxsXHJcbiAgXHJcbiAgY29uc3RydWN0b3I6IChAdGFnLCBAb3B0aW9ucywgQG93bmVyLCBAdGhpbk5vZGUgPSBudWxsKSAtPlxyXG4gICAgaWYgQHRhZyBhbmQgbm90IEB0aGluTm9kZVxyXG4gICAgICBAdGhpbk5vZGUgPSBuZXcgVGhpbkRPTSBAdGFnLCBAb3B0aW9ucy5wcm9wc1xyXG4gICAgICBAdGhpbk5vZGUuYWRkICd0YWdOYW1lJywgQHRhZ1xyXG4gICAgICBAdGhpbk5vZGUuY3NzIEBvcHRpb25zLnN0eWxlc1xyXG4gICAgICBpZiBAb3B0aW9ucy50ZXh0IHRoZW4gQHRoaW5Ob2RlLnRleHQgQG9wdGlvbnMudGV4dFxyXG4gICAgXHJcbiAgICBpZiBAb3duZXJcclxuICAgICAgQG1ha2UoKVxyXG4gIFxyXG4gIGFkZE1ha2VNZXRob2Q6IChjb3VudCkgLT5cclxuICAgIG1ldGhvZHMgPSBPSi5vYmplY3QoKVxyXG4gICAgQG9qTm9kZS5tYWtlID0gKHRhZ05hbWUsIG9wdHMpID0+XHJcbiAgICAgIG1ldGhvZCA9IG1ldGhvZHNbdGFnTmFtZV1cclxuICAgICAgaWYgbm90IG1ldGhvZFxyXG4gICAgICAgIG1ldGhvZCA9IEBfbWFrZUFkZCB0YWdOYW1lLCBAb2pOb2RlLCBjb3VudFxyXG4gICAgICAgIG1ldGhvZHNbdGFnTmFtZV0gPSBtZXRob2RcclxuICAgICAgbWV0aG9kIG9wdHNcclxuICAgIEBvak5vZGVcclxuXHJcbiAgbWFrZTogLT5cclxuXHJcbiAgICBAb2pOb2RlID0gbnVsbFxyXG5cclxuICAgIGlmIEB0aGluTm9kZT8uaXNGdWxseUluaXQgdGhlbiBAb2pOb2RlID0gQHRoaW5Ob2RlXHJcbiAgXHJcbiAgICAjIDI6IElmIHRoZSBlbGVtZW50IGhhcyBuZXZlciBiZWVuIGluaXRpYWxpemVkLCBjb250aW51ZVxyXG4gICAgZWxzZVxyXG4gICAgICAjIDM6IEFzIGxvbmcgYXMgdGhlIGVsZW1lbnQgaXNuJ3QgdGhlIGJvZHkgbm9kZSwgY29udGludWVcclxuICAgICAgIyBpZiBlbC50YWdOYW1lIGlzbnQgJ2JvZHknXHJcbiAgICAgICMgNDogRXh0ZW5kIHRoZSBlbGVtZW50IHdpdGggc3RhbmRhcmQgalF1ZXJ5IEFQSSBtZXRob2RzXHJcbiAgICAgIEBvak5vZGUgPSBuZXcgTm9kZSBAdGhpbk5vZGUsIEBvd25lclxyXG4gICAgICBjb3VudCA9IChAb3duZXIuY291bnQgKyAxKSB8fCAxXHJcbiAgICAgICMgNTogSWYgdGhlIG5vZGUgaXNuJ3QgaW4gdGhlIERPTSwgYXBwZW5kIGl0IHRvIHRoZSBwYXJlbnRcclxuICAgICAgIyBUaGlzIGFsc28gYWNjb21tb2RhdGVzIGRvY3VtZW50IGZyYWdtZW50cywgd2hpY2ggYXJlIG5vdCBpbiB0aGUgRE9NIGJ1dCBhcmUgcHJlc3VtZWQgdG8gYmUgc291bmQgdW50aWwgcmVhZHkgZm9yIG1hbnVhbCBpbnNlcnRpb25cclxuICAgICAgaWYgQHRoaW5Ob2RlLnRhZ05hbWUgaXNudCAnYm9keScgYW5kIG5vdCBAdGhpbk5vZGUuaXNJbkRPTSBhbmQgbm90IEBvak5vZGUuaXNJbkRPTVxyXG4gICAgICAgIEBfbWFrZVVuaXF1ZUlkIGNvdW50XHJcbiAgICAgICAgQG93bmVyLmFwcGVuZCBAb2pOb2RlWzBdXHJcbiAgICAgICAgIyA2OiBCaW5kIGFueSBkZWZpbmVkIGV2ZW50cyBhZnRlciB0aGUgbm9kZSBpcyBpbiB0aGUgRE9NXHJcbiAgICAgICAgQF9iaW5kRXZlbnRzKClcclxuICAgICAgICBcclxuICAgICAgQHRoaW5Ob2RlLmlzSW5ET00gPSB0cnVlXHJcbiAgICAgIEBvak5vZGUuaXNJbkRPTSA9IHRydWVcclxuXHJcbiAgICAgICMgNzogQ3JlYXRlIHRoZSBhbGwgaW1wb3J0YW50ICdtYWtlJyBtZXRob2RcclxuICAgICAgQGFkZE1ha2VNZXRob2QgY291bnRcclxuXHJcbiAgICAgICMgODogUHJldmVudCBkdXBsaWNhdGUgZmFjdG9yeSBleHRlbnNpb24gYnkgc2V0dGluZyBpcyBpbml0ID0gdHJ1ZVxyXG4gICAgICBAb2pOb2RlLmlzRnVsbHlJbml0ID0gdHJ1ZVxyXG5cclxuICAgICAgIyA5OiBpZiB0aGUgbm9kZSBzdXBwb3J0cyBpdCwgY2FsbCBmaW5hbGl6ZVxyXG4gICAgICBmaW5hbGl6ZSA9IF8ub25jZSBAb2pOb2RlLmZpbmFsaXplIG9yIE9KLm5vb3BcclxuICAgICAgQG9qTm9kZS5maW5hbGl6ZSA9IGZpbmFsaXplXHJcbiAgICAgIGZpbmFsaXplIEBvak5vZGVcclxuICAgICMgMTA6IFJldHVybiB0aGUgZXh0ZW5kZWQgZWxlbWVudFxyXG4gICAgQG9qTm9kZVxyXG5cclxuZGVmYXVsdENyZWF0ZUVsZW1lbnQgPSAocGFyZW50LCB0YWcsIG9wdGlvbnMpIC0+XHJcbiAgbmV3RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgdGFnXHJcbiAgaWYgb3B0aW9uc1xyXG4gICAgZm9yIGtleSwgdmFsdWUgb2Ygb3B0aW9ucy5wcm9wc1xyXG4gICAgICBuZXdFbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKVxyXG4gICAgZm9yIGtleSwgdmFsdWUgb2Ygb3B0aW9ucy5ldmVudHNcclxuICAgICAgJChuZXdFbGVtZW50KS5vbihrZXksIHZhbHVlKVxyXG4gICAgZm9yIGtleSwgdmFsdWUgb2Ygb3B0aW9ucy5zdHlsZXNcclxuICAgICAgJChuZXdFbGVtZW50KS5jc3Moa2V5LCB2YWx1ZSlcclxuICAgIHZhbHVlID0gb3B0aW9ucy50ZXh0XHJcbiAgICBpZiB2YWx1ZSBpc250IHVuZGVmaW5lZFxyXG4gICAgICAkKG5ld0VsZW1lbnQpLnRleHQodmFsdWUpXHJcbiAgcGFyZW50Py5hcHBlbmRDaGlsZChuZXdFbGVtZW50KVxyXG5cclxuZ2V0Tm9kZUZyb21GYWN0b3J5ID0gKHRhZywgb3B0aW9ucywgb3duZXIsIGlzQ2FsbGVkRnJvbUZhY3RvcnksIG5vZGUpIC0+XHJcbiAgbmV3T0pOb2RlID0gbmV3IE5vZGUoKVxyXG4gIGlmICF3aW5kb3cub2pDcmVhdGVFbGVtZW50XHJcbiAgICB3aW5kb3cub2pDcmVhdGVFbGVtZW50ID0gZGVmYXVsdENyZWF0ZUVsZW1lbnRcclxuICBuZXdPSk5vZGUuZWxlbWVudCA9IG9qQ3JlYXRlRWxlbWVudChvd25lci5lbGVtZW50LCB0YWcgfHwgJ2RpdicsIG9wdGlvbnMpXHJcbiAgbmV3T0pOb2RlXHJcblxyXG5PSi5yZWdpc3RlciAnbm9kZUZhY3RvcnknLCBnZXROb2RlRnJvbUZhY3RvcnlcclxuXHJcbm1ha2UgPSAodGFnLCBvcHRpb25zKSAtPlxyXG4gIG5ld09KTm9kZSA9IG5ldyBOb2RlKClcclxuICBuZXdPSk5vZGUuZWxlbWVudCA9IG9qQ3JlYXRlRWxlbWVudChudWxsLCB0YWcgfHwgJ2RpdicsIG9wdGlvbnMpXHJcbiAgbmV3T0pOb2RlXHJcblxyXG5PSi5yZWdpc3RlciAnbWFrZScsIG1ha2VcclxuXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnZXROb2RlRnJvbUZhY3RvcnlcclxuIl19
},{"../oj":58,"../tools/is":68,"./node":22}],24:[function(require,module,exports){
var OJ, node, nodeFactory, nodeName,
  slice = [].slice;

OJ = require('../oj');

nodeFactory = require('../dom/nodeFactory');

nodeName = 'a';

node = function(options, owner, calledFromFactory) {
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
      event = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
  ret = nodeFactory(nodeName, defaults, owner, calledFromFactory);
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/nodeFactory":23,"../oj":58}],25:[function(require,module,exports){
var OJ, node, nodeFactory, nodeName, to;

OJ = require('../oj');

nodeFactory = require('../dom/nodeFactory');

to = require('../tools/to');

nodeName = 'br';

node = function(options, owner, calledFromFactory) {
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
  while (i < to.number(defaults.number)) {
    ret = nodeFactory(nodeName, defaults, owner, calledFromFactory);
    i += 1;
  }
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/nodeFactory":23,"../oj":58,"../tools/to":73}],26:[function(require,module,exports){
var OJ, node, nodeFactory, nodeName;

OJ = require('../oj');

nodeFactory = require('../dom/nodeFactory');

nodeName = 'form';

node = function(options, owner, calledFromFactory) {
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
  ret = nodeFactory(nodeName, defaults, owner, calledFromFactory);
  ret.add('validator', ret.$.validate({
    highlight: function(element) {
      var $elm;
      $elm = $(element);
      $elm.attr('OJ_invalid', '1');
      $elm.animate({
        backgroundColor: 'red'
      });
      return null;
    },
    unhighlight: function(element) {
      var $elm;
      $elm = $(element);
      if ($elm.attr('OJ_invalid') === '1') {
        $elm.css('background-color', 'yellow');
        $elm.attr('OJ_invalid', '0');
        setTimeout((function() {
          return $elm.animate({
            backgroundColor: 'transparent'
          });
        }), 500);
      }
      return null;
    }
  }));
  ret.add('isFormValid', function() {
    return ret.$.valid() && (!ret.validator.invalidElements() || ret.validator.invalidElements().length === 0);
  });
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/nodeFactory":23,"../oj":58}],27:[function(require,module,exports){
var OJ, enums, node, nodeFactory, nodeName,
  slice = [].slice;

OJ = require('../oj');

nodeFactory = require('../dom/nodeFactory');

enums = require('../tools/enums');

nodeName = 'input';

node = function(options, owner, calledFromFactory) {
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
  if (!defaults.props.type || !enums.inputTypes[defaults.props.type]) {
    throw new Error('No matching input type for {' + defaults.props.type + '} could be found.');
  }
  thisType = enums.inputTypes[defaults.props.type];
  syncValue = function() {
    switch (thisType) {
      case enums.inputTypes.checkbox:
        ret.value = ret.$.is(':checked');
        break;
      case enums.inputTypes.radio:
        ret.value = ret.$.find(':checked').val();
        break;
      default:
        ret.value = ret.val();
    }
    defaults.props.value = ret.value;
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
      event = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      syncValue();
      return oldClick.apply(null, [ret.value].concat(slice.call(event)));
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
      event = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      syncValue();
      return oldChange.apply(null, [ret.value].concat(slice.call(event)));
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
    event = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    syncValue();
    if (oldFocusout && oldFocusout !== OJ.noop) {
      return oldFocusout.apply(null, [ret.value].concat(slice.call(event)));
    }
  };
  defaults.events.focusout = newFocusout;
  ret = nodeFactory(nodeName, defaults, owner, calledFromFactory);
  ret.value = defaults.props.value;
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/nodeFactory":23,"../oj":58,"../tools/enums":66}],28:[function(require,module,exports){
var OJ, node, nodeFactory, nodeName;

OJ = require('../oj');

nodeFactory = require('../dom/nodeFactory');

nodeName = 'ol';

node = function(options, owner, calledFromFactory) {
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
  ret = nodeFactory(nodeName, defaults, owner, calledFromFactory);
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/nodeFactory":23,"../oj":58}],29:[function(require,module,exports){
var OJ, node, nodeFactory, nodeName,
  slice = [].slice;

OJ = require('../oj');

nodeFactory = require('../dom/nodeFactory');

nodeName = 'select';

node = function(options, owner, calledFromFactory) {
  var change, click, defaults, hasEmpty, newChange, newClick, ret, syncValue, value, values;
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
      event = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
      event = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      retval = change.apply(null, event);
      syncValue();
      return retval;
    };
    defaults.events.change = newChange;
  }
  ret = nodeFactory(nodeName, defaults, owner, calledFromFactory);
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
      return values.push(value);
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
    return null;
  });
  if (defaults.values.length > 0) {
    ret.addOptions(defaults.values);
  }
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/nodeFactory":23,"../oj":58}],30:[function(require,module,exports){
(function (global){
var $, JsonToTable, OJ, _, array2D, node, nodeFactory, nodeName;

OJ = require('../oj');

nodeFactory = require('../dom/nodeFactory');

_ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

array2D = require('../tools/array2D');

$ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

JsonToTable = require('../tools/JsonToTable');

nodeName = 'table';


/*
Create an HTML table. Provides helper methods to create Columns and Cells.
 */

node = function(options, owner, calledFromFactory) {
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
  cells = array2D();
  columnCount = 0;
  OJ.extend(defaults, options, true);
  ret = nodeFactory(nodeName, defaults, owner, calledFromFactory);
  tbody = null;
  thead = null;
  theadRow = null;
  init = _.once(function() {
    var j2t, jBody, jHead, jTbl, tblStr;
    if (defaults.data) {
      j2t = new JsonToTable(defaults.data);
      tblStr = j2t.table;
    }
    if (tblStr) {
      jTbl = $(tblStr);
      jHead = jTbl.find('thead');
      ret.$.append(jHead);
      thead = el.restoreElement(jHead[0]);
      theadRow = el.restoreElement(thead[0].rows[0]);
      jBody = jTbl.find('tbody');
      ret.$.append(jBody);
      tbody = el.restoreElement(jBody[0]);
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
    var c, memCell, memRow, r, results;
    r = 0;
    results = [];
    while (tbody[0].rows.length > r) {
      c = 0;
      memRow = el.restoreElement(tbody[0].rows[r]);
      rows.push(memRow);
      while (tbody[0].rows[r].cells.length > c) {
        memCell = cells.get(r + 1, c + 1);
        if (!memCell) {
          memCell = el.restoreElement(tbody[0].rows[r].cells[c]);
          cells.set(r + 1, c + 1, memCell);
        }
        c += 1;
      }
      results.push(r += 1);
    }
    return results;
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
        th = el.restoreElement(nativeTh, 'th');
      }
      i += 1;
    }
    if (!th) {
      nativeTh = thead[0].rows[0].cells[colNo - 1];
      th = el.restoreElement(nativeTh, 'th');
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
  init();
  ret.add('thead', thead);
  ret.add('tbody', tbody);
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdGFibGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxXQUFBLEdBQWMsT0FBQSxDQUFRLG9CQUFSOztBQUNkLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7QUFDSixPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSOztBQUNWLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7QUFDSixXQUFBLEdBQWMsT0FBQSxDQUFRLHNCQUFSOztBQUlkLFFBQUEsR0FBVzs7O0FBRVg7Ozs7QUFHQSxJQUFBLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixFQUEyQixpQkFBM0I7QUFHTCxNQUFBOztJQUhlLFFBQVEsRUFBRSxDQUFDOzs7SUFBTSxvQkFBb0I7O0VBR3BELFFBQUEsR0FHRTtJQUFBLElBQUEsRUFBTSxJQUFOO0lBR0EsS0FBQSxFQUNFO01BQUEsV0FBQSxFQUFhLENBQWI7TUFDQSxXQUFBLEVBQWEsQ0FEYjtNQUVBLEtBQUEsRUFBTyxFQUZQO01BR0EsS0FBQSxFQUFPLEVBSFA7TUFJQSxTQUFBLEVBQVcsTUFKWDtNQUtBLFVBQUEsRUFBWSxLQUxaO01BTUEsT0FBQSxFQUFPLEVBTlA7S0FKRjtJQVdBLE1BQUEsRUFBUSxFQVhSO0lBWUEsTUFBQSxFQUFRLEVBWlI7SUFlQSxLQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQU8sRUFBUDtNQUNBLEtBQUEsRUFBTyxFQURQO01BRUEsZ0JBQUEsRUFBa0IsRUFGbEI7TUFHQSxXQUFBLEVBQWEsRUFIYjtNQUlBLE1BQUEsRUFBUSxFQUpSO0tBaEJGO0lBdUJBLEtBQUEsRUFBTyxFQXZCUDtJQTBCQSxLQUFBLEVBQU8sRUExQlA7SUE0QkEsZUFBQSxFQUFpQixLQTVCakI7SUE2QkEsYUFBQSxFQUFlLEtBN0JmOztFQStCRixJQUFBLEdBQU87RUFDUCxLQUFB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QUFTLEVBQUUsQ0FBQyxNQUFILENBQVU7WUFBQyxLQUFBLEVBQU8sUUFBUSxDQUFDLEtBQWpCO1dBQVYsRUFBbUMsSUFBbkM7VUFDVCxJQUFBLEdBQU8sR0FBRyxDQUFDLElBQUosQ0FBUyxLQUFULEVBQWdCLE1BQWhCLEVBRlQ7U0FBQSxNQUFBO1VBSUUsT0FBQSxHQUFVLEtBQUssQ0FBQyxHQUFOLENBQVUsS0FBVixFQUFpQixDQUFqQjtVQUNWLElBQUcsQ0FBSSxPQUFQO1lBQ0UsT0FBQSxHQUFXLEdBQUcsQ0FBQyxJQUFKLENBQVMsQ0FBVCxFQUFZO2NBQUEsS0FBQSxFQUFPLFFBQVEsQ0FBQyxLQUFoQjthQUFaLEVBRGI7V0FMRjs7TUFGRixDQUZGOztXQVlBO0VBckJjLENBQWhCO0VBeUJBLElBQUEsQ0FBQTtFQUlBLEdBQUcsQ0FBQyxHQUFKLENBQVEsT0FBUixFQUFpQixLQUFqQjtFQUlBLEdBQUcsQ0FBQyxHQUFKLENBQVEsT0FBUixFQUFpQixLQUFqQjtTQUlBO0FBaExLOztBQWtMUCxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEIsSUFBNUI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xyXG5hcnJheTJEID0gcmVxdWlyZSAnLi4vdG9vbHMvYXJyYXkyRCdcclxuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcclxuSnNvblRvVGFibGUgPSByZXF1aXJlICcuLi90b29scy9Kc29uVG9UYWJsZSdcclxuXHJcbiMgIyB0YWJsZVxyXG5cclxubm9kZU5hbWUgPSAndGFibGUnXHJcblxyXG4jIyNcclxuQ3JlYXRlIGFuIEhUTUwgdGFibGUuIFByb3ZpZGVzIGhlbHBlciBtZXRob2RzIHRvIGNyZWF0ZSBDb2x1bW5zIGFuZCBDZWxscy5cclxuIyMjXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICAjICMjIG9wdGlvbnNcclxuICBkZWZhdWx0cyA9XHJcbiAgICAjICMjIyBkYXRhXHJcbiAgICAjIG9wdGlvbmFsIGFycmF5IG9mIG9iamVjdHMuIGlmIHByb3ZpZGVkIHdpbGwgZ2VuZXJhdGUgdGFibGUgYXV0b21hdGljYWxseS5cclxuICAgIGRhdGE6IG51bGxcclxuICAgICMgIyMjIHByb3BzXHJcbiAgICAjIG9wdGlvbmFsIHByb3BlcnRpZXMgdG8gYXBwbHkgdG8gdGFibGUgcm9vdCBub2RlXHJcbiAgICBwcm9wczpcclxuICAgICAgY2VsbHBhZGRpbmc6IDBcclxuICAgICAgY2VsbHNwYWNpbmc6IDBcclxuICAgICAgYWxpZ246ICcnXHJcbiAgICAgIHdpZHRoOiAnJ1xyXG4gICAgICBjZWxsYWxpZ246ICdsZWZ0J1xyXG4gICAgICBjZWxsdmFsaWduOiAndG9wJ1xyXG4gICAgICBjbGFzczogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czoge31cclxuICAgICMgIyMjIGNlbGxzXHJcbiAgICAjIG9wdGlvbmFsIHByb3BlcnRpZXMgdG8gYXBwbHkgdG8gaW5kaXZpZHVhbCBjZWxsc1xyXG4gICAgY2VsbHM6XHJcbiAgICAgIGNsYXNzOiAnJ1xyXG4gICAgICBhbGlnbjogJydcclxuICAgICAgJ3ZlcnRpY2FsLWFsaWduJzogJydcclxuICAgICAgY2VsbHBhZGRpbmc6ICcnXHJcbiAgICAgIG1hcmdpbjogJydcclxuICAgICMgIyMjIHRoZWFkXHJcbiAgICAjIG9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRvIHBhc3MgaW50byB0aGVhZCBjcmVhdGlvblxyXG4gICAgdGhlYWQ6IHt9XHJcbiAgICAjICMjIyB0Ym9keVxyXG4gICAgIyBvcHRpb25hbCBvcHRpb25zIG9iamVjdCB0byBwYXNzIGludG8gdGJvZHkgY3JlYXRpb25cclxuICAgIHRib2R5OiB7fVxyXG5cclxuICAgIGZpcnN0QWxpZ25SaWdodDogZmFsc2VcclxuICAgIG9kZEFsaWduUmlnaHQ6IGZhbHNlXHJcblxyXG4gIHJvd3MgPSBbXVxyXG4gIGNlbGxzID0gYXJyYXkyRCgpXHJcbiAgY29sdW1uQ291bnQgPSAwXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcbiBcclxuXHJcbiAgdGJvZHkgPSBudWxsXHJcbiAgdGhlYWQgPSBudWxsXHJcbiAgdGhlYWRSb3cgPSBudWxsXHJcblxyXG4gICMgIyMjIGluaXRcclxuICAjIGludGVybmFsIG1ldGhvZCBmb3Igb25lIHRpbWUgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHRhYmxlXHJcbiAgaW5pdCA9IF8ub25jZSAtPlxyXG4gICAgaWYgZGVmYXVsdHMuZGF0YVxyXG4gICAgICBqMnQgPSBuZXcgSnNvblRvVGFibGUgZGVmYXVsdHMuZGF0YVxyXG4gICAgICB0YmxTdHIgPSBqMnQudGFibGVcclxuICAgIGlmIHRibFN0clxyXG4gICAgICBqVGJsID0gJCB0YmxTdHJcclxuXHJcbiAgICAgIGpIZWFkID0galRibC5maW5kICd0aGVhZCdcclxuICAgICAgcmV0LiQuYXBwZW5kIGpIZWFkXHJcbiAgICAgIHRoZWFkID0gZWwucmVzdG9yZUVsZW1lbnQgakhlYWRbMF1cclxuICAgICAgdGhlYWRSb3cgPSBlbC5yZXN0b3JlRWxlbWVudCB0aGVhZFswXS5yb3dzWzBdXHJcblxyXG4gICAgICBqQm9keSA9IGpUYmwuZmluZCAndGJvZHknXHJcbiAgICAgIHJldC4kLmFwcGVuZCBqQm9keVxyXG4gICAgICB0Ym9keSA9IGVsLnJlc3RvcmVFbGVtZW50IGpCb2R5WzBdXHJcblxyXG4gICAgICBsb2FkQ2VsbHMoKVxyXG4gICAgZWxzZVxyXG4gICAgICB0aGVhZCA9IHJldC5tYWtlICd0aGVhZCcsIGRlZmF1bHRzLnRoZWFkXHJcbiAgICAgIHRoZWFkUm93ID0gdGhlYWQubWFrZSAndHInXHJcbiAgICAgIHRib2R5ID0gcmV0Lm1ha2UgJ3Rib2R5JywgZGVmYXVsdHMudGJvZHlcclxuICAgICAgcm93cy5wdXNoIHRib2R5Lm1ha2UgJ3RyJ1xyXG4gICAgcmV0XHJcblxyXG4gICMgIyMjIGxvYWRDZWxsc1xyXG4gICMgaW50ZXJuYWwgbWV0aG9kIGd1YXJhbnRlZXMgdGhhdCB0YWJsZXMgbG9hZGVkIGZyb20gSlNPTiBhcmUgZnVsbHkgbG9hZGVkIGludG8gbWVtb3J5XHJcbiAgbG9hZENlbGxzID0gKCkgLT5cclxuICAgIHIgPSAwXHJcbiAgICB3aGlsZSB0Ym9keVswXS5yb3dzLmxlbmd0aCA+IHJcclxuICAgICAgYyA9IDBcclxuICAgICAgbWVtUm93ID0gZWwucmVzdG9yZUVsZW1lbnQgdGJvZHlbMF0ucm93c1tyXVxyXG4gICAgICByb3dzLnB1c2ggbWVtUm93XHJcbiAgICAgIHdoaWxlIHRib2R5WzBdLnJvd3Nbcl0uY2VsbHMubGVuZ3RoID4gY1xyXG4gICAgICAgIG1lbUNlbGwgPSBjZWxscy5nZXQgcisxLCBjKzFcclxuICAgICAgICBpZiBub3QgbWVtQ2VsbFxyXG4gICAgICAgICAgbWVtQ2VsbCA9IGVsLnJlc3RvcmVFbGVtZW50IHRib2R5WzBdLnJvd3Nbcl0uY2VsbHNbY11cclxuICAgICAgICAgIGNlbGxzLnNldCByKzEsIGMrMSwgbWVtQ2VsbFxyXG4gICAgICAgIGMgKz0gMVxyXG4gICAgICByICs9IDFcclxuXHJcbiAgIyAjIyMgZmlsbE1pc3NpbmdcclxuICAjIGludGVybmFsIG1ldGhvZCBndWFyYW50ZWVzIHRoYXQgY2VsbHMgZXhpc3QgZm9yIHRoZSBkaW1lbnNpb25zIG9mIHRoZSB0YWJsZVxyXG4gIGZpbGxNaXNzaW5nID0gKCkgLT5cclxuICAgIGNlbGxzLmVhY2ggKHJvd05vLCBjb2xObywgdmFsKSAtPlxyXG4gICAgICBpZiBub3QgdmFsXHJcbiAgICAgICAgcm93ID0gcmV0LnJvdyByb3dOb1xyXG4gICAgICAgIHJvdy5jZWxsIGNvbE5vLCB7fVxyXG5cclxuICAjICMjIGNvbHVtblxyXG4gICMgQWRkcyBhIGNvbHVtbiBuYW1lIHRvIHRoZSB0YWJsZSBoZWFkXHJcbiAgcmV0LmFkZCAnY29sdW1uJywgKGNvbE5vLCBjb2xOYW1lKSAtPlxyXG4gICAgcmV0LmluaXQoKVxyXG4gICAgY29sdW1uQ291bnQgKz0gMVxyXG4gICAgdGggPSBudWxsXHJcbiAgICBpID0gMFxyXG4gICAgd2hpbGUgdGhlYWRbMF0ucm93c1swXS5jZWxscy5sZW5ndGggPCBjb2xOb1xyXG4gICAgICBuYXRpdmVUaCA9IHRoZWFkWzBdLnJvd3NbMF0uY2VsbHNbaV1cclxuICAgICAgaWYgbm90IG5hdGl2ZVRoXHJcbiAgICAgICAgdGggPSB0aGVhZFJvdy5tYWtlICd0aCcsIHt9XHJcbiAgICAgIGVsc2VcclxuICAgICAgICB0aCA9IGVsLnJlc3RvcmVFbGVtZW50IG5hdGl2ZVRoLCAndGgnXHJcbiAgICAgIGkgKz0gMVxyXG4gICAgaWYgbm90IHRoXHJcbiAgICAgIG5hdGl2ZVRoID0gdGhlYWRbMF0ucm93c1swXS5jZWxsc1tjb2xOby0xXVxyXG4gICAgICB0aCA9IGVsLnJlc3RvcmVFbGVtZW50IG5hdGl2ZVRoLCAndGgnXHJcbiAgICB0aC50ZXh0IGNvbE5hbWVcclxuICAgIHRoXHJcblxyXG4gICMgIyMgcm93XHJcbiAgIyBBZGRzIGEgbmV3IHJvdyAodHIpIHRvIHRoZSB0YWJsZSBib2R5XHJcbiAgcmV0LmFkZCAncm93JywgKHJvd05vLCBvcHRzKSAtPlxyXG4gICAgcm93ID0gcm93c1tyb3dOby0xXVxyXG5cclxuICAgIGlmIG5vdCByb3dcclxuICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xyXG4gICAgICAgIHJvdyA9IHRib2R5Lm1ha2UgJ3RyJywge31cclxuICAgICAgICByb3dzLnB1c2ggcm93XHJcblxyXG4gICAgaWYgbm90IHJvdy5jZWxsXHJcbiAgICAgIHJvdy5hZGQgJ2NlbGwnLCAoY29sTm8sIG9wdHMpIC0+XHJcbiAgICAgICAgY2VsbCA9IE9KLm5vZGVzLnRkIG9wdHMsIHJvd1xyXG4gICAgICAgIGNlbGxzLnNldCByb3dObywgY29sTm8sIGNlbGxcclxuICAgICAgICBjZWxsXHJcblxyXG4gICAgcm93XHJcblxyXG4gICMgIyMgY2VsbFxyXG4gICMgQWRkcyBhIGNlbGwgKHRyL3RkKSB0byB0aGUgdGFibGUgYm9keVxyXG4gIHJldC5hZGQgJ2NlbGwnLCAocm93Tm8sIGNvbE5vLCBvcHRzKSAtPlxyXG4gICAgaWYgcm93Tm8gPCAxIHRoZW4gcm93Tm8gPSAxXHJcbiAgICBpZiBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcclxuICAgIGlmIGNvbHVtbkNvdW50ID4gMCBhbmQgY29sTm8tMSA+IGNvbHVtbkNvdW50IHRoZW4gdGhyb3cgbmV3IEVycm9yICdBIGNvbHVtbiBuYW1lIGhhcyBub3QgYmVlbiBkZWZpbmVkIGZvciB0aGlzIHBvc2l0aW9uIHsnICsgcm93Tm8gKyAneCcgKyBjb2xObyArICd9LidcclxuXHJcbiAgICByb3cgPSByZXQucm93IHJvd05vXHJcblxyXG4gICAgY2VsbCA9IGNlbGxzLmdldCByb3dObywgY29sTm9cclxuXHJcbiAgICBpZiBub3QgY2VsbFxyXG4gICAgICBpID0gMFxyXG4gICAgICB3aGlsZSBpIDwgY29sTm9cclxuICAgICAgICBpICs9IDFcclxuICAgICAgICBpZiBpIGlzIGNvbE5vXHJcbiAgICAgICAgICBudU9wdHMgPSBPSi5leHRlbmQge3Byb3BzOiBkZWZhdWx0cy5jZWxsc30sIG9wdHNcclxuICAgICAgICAgIGNlbGwgPSByb3cuY2VsbCBjb2xObywgbnVPcHRzXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgdHJ5Q2VsbCA9IGNlbGxzLmdldCByb3dObywgaVxyXG4gICAgICAgICAgaWYgbm90IHRyeUNlbGxcclxuICAgICAgICAgICAgdHJ5Q2VsbCA9ICByb3cuY2VsbCBpLCBwcm9wczogZGVmYXVsdHMuY2VsbHNcclxuXHJcbiAgICBjZWxsXHJcblxyXG4gICMgIyMgRmluYWxpemVcclxuICAjIEZpbmFsaXplIGd1YXJhbnRlZXMgdGhhdCB0aGVhZCBhbmQgdGJvZHkgYW5kIGNyZWF0ZWQgd2hlbiB0aGUgbm9kZSBpcyBmdWxseSBpbnN0YW50aWF0ZWRcclxuICBpbml0KClcclxuXHJcbiAgIyAjIyBUSGVhZFxyXG4gICMgRXhwb3NlIHRoZSBpbnRlcm5hbCB0aGVhZCBub2RlXHJcbiAgcmV0LmFkZCAndGhlYWQnLCB0aGVhZFxyXG5cclxuICAjICMjIFRCb2R5XHJcbiAgIyBFeHBvc2UgdGhlIGludGVybmFsIHRib2R5IG5vZGVcclxuICByZXQuYWRkICd0Ym9keScsIHRib2R5XHJcblxyXG4gICAgXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcbiJdfQ==
},{"../dom/nodeFactory":23,"../oj":58,"../tools/JsonToTable":60,"../tools/array2D":61}],31:[function(require,module,exports){
var OJ, enums, node, nodeFactory, nodeName,
  slice = [].slice;

OJ = require('../oj');

nodeFactory = require('../dom/nodeFactory');

enums = require('../tools/enums');

nodeName = 'textarea';

node = function(options, owner, calledFromFactory) {
  var change, click, defaults, newChange, newClick, ret, syncValue, value;
  if (owner == null) {
    owner = OJ.body;
  }
  if (calledFromFactory == null) {
    calledFromFactory = false;
  }
  defaults = {
    props: {
      name: '',
      placeholder: '',
      value: '',
      text: '',
      maxlength: '',
      autofocus: false,
      isRequired: false,
      rows: 3,
      cols: 25,
      disabled: false,
      readonly: false,
      form: '',
      wrap: ''
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
      case enums.inputTypes.checkbox:
        return value = ret.$.is(':checked');
      case enums.inputTypes.radio:
        return value = ret.$.find(':checked').val();
      default:
        return value = ret.val();
    }
  };
  if (defaults.events.click !== OJ.noop) {
    click = defaults.events.click;
    newClick = function() {
      var event, retval;
      event = 1 <= arguments.length ? slice.call(arguments, 0) : [];
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
      event = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      retval = change.apply(null, event);
      syncValue();
      return retval;
    };
    defaults.events.change = newChange;
  }
  ret = nodeFactory(nodeName, defaults, owner, calledFromFactory);
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/nodeFactory":23,"../oj":58,"../tools/enums":66}],32:[function(require,module,exports){
var OJ, node, nodeFactory, nodeName;

OJ = require('../oj');

nodeFactory = require('../dom/nodeFactory');

nodeName = 'thead';

node = function(options, owner, calledFromFactory) {
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
  ret = nodeFactory(nodeName, defaults, owner, calledFromFactory);
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
      cell = el.restoreElement(td, 'td');
    }
    if (!td) {
      while (row[0].cells.length < colNo) {
        idx = row[0].cells.length;
        td = row[0].cells[idx - 1];
        if (td && idx === colNo) {
          cell = el.restoreElement(td, 'td');
        } else {
          cell = OJ.nodes.td({
            props: defaults.cells
          }, row, false);
        }
      }
    }
    if (!cell.isValid) {
      nodeFactory(cell, row, rowNo + colNo);
    }
    return cell;
  });
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/nodeFactory":23,"../oj":58}],33:[function(require,module,exports){
var OJ, node, nodeFactory, nodeName;

OJ = require('../oj');

nodeFactory = require('../dom/nodeFactory');

nodeName = 'ul';

node = function(options, owner, calledFromFactory) {
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
  ret = nodeFactory(nodeName, defaults, owner, calledFromFactory);
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/nodeFactory":23,"../oj":58}],34:[function(require,module,exports){
(function (global){
var thisGlobal;

thisGlobal = (typeof global !== 'undefined' && global ? global : (typeof self !== 'undefined' && self ? self : (typeof window !== 'undefined' && window ? window : this)));

module.exports = thisGlobal;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxnbG9iYWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLFVBQUEsR0FBYSxDQUFLLE9BQU8sTUFBUCxLQUFtQixXQUFuQixJQUFtQyxNQUF2QyxHQUFvRCxNQUFwRCxHQUFnRSxDQUFLLE9BQU8sSUFBUCxLQUFpQixXQUFqQixJQUFpQyxJQUFyQyxHQUFnRCxJQUFoRCxHQUEwRCxDQUFLLE9BQU8sTUFBUCxLQUFtQixXQUFuQixJQUFtQyxNQUF2QyxHQUFvRCxNQUFwRCxHQUFnRSxJQUFqRSxDQUEzRCxDQUFqRTs7QUFDYixNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidGhpc0dsb2JhbCA9IChpZiAodHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwpIHRoZW4gZ2xvYmFsIGVsc2UgKGlmICh0eXBlb2Ygc2VsZiBpc250ICd1bmRlZmluZWQnIGFuZCBzZWxmKSB0aGVuIHNlbGYgZWxzZSAoaWYgKHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyBhbmQgd2luZG93KSB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKSlcclxubW9kdWxlLmV4cG9ydHMgPSB0aGlzR2xvYmFsIl19
},{}],35:[function(require,module,exports){
var OJ, inpt, input, inputName, obj;

OJ = require('../oj');

obj = require('../core/object');

input = require('../dom/input');

inputName = 'buttoninput';

inpt = function(options, owner) {
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
  obj.extend(defaults, options, true);
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../oj":58}],36:[function(require,module,exports){
var OJ, inpt, input, inputName, obj;

OJ = require('../oj');

obj = require('../core/object');

input = require('../dom/input');

inputName = 'checkbox';

inpt = function(options, owner) {
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
  obj.extend(defaults, options, true);
  ret = input(defaults, owner);
  if (defaults.checked) {
    ret.attr('checked', true);
  } else if (defaults.indeterminate) {
    ret.attr('indeterminate', true);
  }
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../oj":58}],37:[function(require,module,exports){
var OJ, inpt, input, inputName, obj;

OJ = require('../oj');

obj = require('../core/object');

input = require('../dom/input');

inputName = 'color';

inpt = function(options, owner) {
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
  obj.extend(defaults, options, true);
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../oj":58}],38:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

input = require('../dom/input');

inputName = 'date';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../oj":58}],39:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'datetime';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],40:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'datetime-local';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],41:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'email';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],42:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'file';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],43:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'hidden';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],44:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'imageinput';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],45:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'month';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],46:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'number';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],47:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'password';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],48:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'radio';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],49:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'range';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],50:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'reset';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],51:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'search';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],52:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'submit';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],53:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'tel';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],54:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'textinput';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],55:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'time';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],56:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'url';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],57:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'week';

inpt = function(options, owner) {
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
  ret = input(defaults, owner);
  return ret;
};

OJ.inputs.register(inputName, inpt);

module.exports = inpt;



},{"../core/object":12,"../dom/input":21,"../dom/nodeFactory":23,"../oj":58}],58:[function(require,module,exports){
(function (global){
var NsTree, makeTheJuice, nameSpaceName, thisDocument, thisGlobal, utilLib;

thisGlobal = require('./global');

utilLib = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

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

        /*
        Register (e.g. 'Lift') an Object into the prototype of the namespace.
        This Object will be readable/executable but is otherwise immutable.
         */
      });
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

    /*
    Fetches the registered properties and methods on the namespace and its child namespaces
     */
  };
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
        return nsInternal.dependents = deps;
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

OJ.register('noop', function() {});

module.exports = OJ;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxvai5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLElBQUE7O0FBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxVQUFSOztBQUNiLE9BQUEsR0FBVSxPQUFBLENBQVEsUUFBUjs7QUFDVixhQUFBLEdBQWdCOzs7QUFFaEI7Ozs7QUFHQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsTUFBTSxDQUFBLFNBQTlCLEVBQ0U7RUFBQSxlQUFBLEVBQ0U7SUFBQSxLQUFBLEVBQU8sU0FBQTtBQUNMLFVBQUE7TUFBQSxhQUFBLEdBQWdCO01BQ2hCLE9BQUEsR0FBVyxhQUFjLENBQUMsSUFBaEIsQ0FBcUIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxRQUFiLENBQUEsQ0FBckI7TUFDVCxJQUFJLE9BQUEsSUFBWSxPQUFPLENBQUMsTUFBUixHQUFpQixDQUFqQztlQUF5QyxPQUFRLENBQUEsQ0FBQSxFQUFqRDtPQUFBLE1BQUE7ZUFBeUQsR0FBekQ7O0lBSEksQ0FBUDtHQURGO0NBREY7OztBQVFBOzs7O0FBR0EsTUFBQSxHQUFTOztBQUNULFlBQUEsR0FBZSxTQUFBOztBQUViOzs7QUFBQSxNQUFBO0VBR0EsYUFBQSxHQUFnQixTQUFDLFNBQUQsRUFBWSxJQUFaOztBQUNkOzs7QUFBQSxRQUFBO0lBR0EsSUFBQSxHQUFPLFNBQUMsTUFBRDtBQUNMLFVBQUE7TUFBQSxLQUFBLEdBQVE7TUFDUixJQUFLLENBQUEsTUFBQSxDQUFMLEdBQWUsSUFBSyxDQUFBLE1BQUEsQ0FBTCxJQUFnQjtNQUMvQixNQUFBLEdBQVMsSUFBSyxDQUFBLE1BQUE7TUFDZCxPQUFBLEdBQVU7TUFFVixNQUFNLENBQUMsY0FBUCxDQUFzQixJQUF0QixFQUE0QixTQUE1QixFQUF1QztRQUFBLEtBQUEsRUFBTzs7QUFFOUM7OztXQUZ1QztPQUF2QztNQU1BLE1BQU0sQ0FBQyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLFVBQTVCLEVBQ0U7UUFBQSxLQUFBLEVBQU8sU0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLFVBQVo7VUFDTDtVQUNBLElBQXdFLENBQUMsT0FBTyxJQUFQLEtBQWlCLFFBQWxCLENBQUEsSUFBK0IsSUFBQSxLQUFRLEVBQS9HO0FBQUEsa0JBQVUsSUFBQSxLQUFBLENBQU0sa0RBQU4sRUFBVjs7VUFDQSxJQUFBLENBQXlGLEdBQXpGO0FBQUEsa0JBQVUsSUFBQSxLQUFBLENBQU0sK0RBQU4sRUFBVjs7VUFDQSxJQUE0RixLQUFNLENBQUEsSUFBQSxDQUFsRztBQUFBLGtCQUFVLElBQUEsS0FBQSxDQUFNLGlCQUFBLEdBQW9CLElBQXBCLEdBQTJCLHlCQUEzQixHQUF1RCxTQUF2RCxHQUFtRSxHQUF6RSxFQUFWOztVQUVBLE9BQVEsQ0FBQSxJQUFBLENBQVIsR0FBZ0IsT0FBUSxDQUFBLElBQUEsQ0FBUixJQUFpQjtVQUdqQyxNQUFPLENBQUEsSUFBQSxDQUFQLEdBQWUsTUFBTyxDQUFBLElBQUEsQ0FBUCxJQUNiO1lBQUEsSUFBQSxFQUFNLElBQU47WUFDQSxJQUFBLEVBQU0sT0FBTyxHQURiO1lBRUEsUUFBQSxFQUFVLENBQUksR0FBRyxDQUFDLGVBQVAsR0FBNEIsR0FBRyxDQUFDLGVBQUosQ0FBQSxDQUE1QixHQUF1RCxTQUF4RCxDQUZWOztVQUlGLE1BQU0sQ0FBQyxjQUFQLENBQXNCLEtBQXRCLEVBQTZCLElBQTdCLEVBQ0U7WUFBQSxLQUFBLEVBQU8sR0FBUDtZQUNBLFVBQUEsRUFBWSxLQUFBLEtBQVcsVUFEdkI7V0FERjtVQUlBLFVBQVUsQ0FBQyxlQUFYLENBQTJCLE1BQUEsR0FBUyxHQUFULEdBQWUsU0FBZixHQUEyQixHQUEzQixHQUFpQyxJQUE1RDtpQkFDQTtRQW5CSyxDQUFQO09BREY7O0FBdUJBOzs7TUFHQSxLQUFLLENBQUMsUUFBTixDQUFlLGtCQUFmLEVBQW1DLENBQUMsU0FBQyxZQUFEO1FBQ2xDO0FBQUEsWUFBQTtRQUNBLElBQStFLENBQUMsT0FBTyxZQUFQLEtBQXlCLFFBQTFCLENBQUEsSUFBdUMsWUFBQSxLQUFnQixFQUF0STtBQUFBLGdCQUFVLElBQUEsS0FBQSxDQUFNLHlEQUFOLEVBQVY7O1FBQ0EsSUFBeUcsS0FBSyxDQUFDLFlBQS9HO0FBQUEsZ0JBQVUsSUFBQSxLQUFBLENBQU0sc0JBQUEsR0FBeUIsWUFBekIsR0FBd0MseUJBQXhDLEdBQW9FLFNBQXBFLEdBQWdGLEdBQXRGLEVBQVY7O1FBQ0EsVUFBVSxDQUFDLGVBQVgsQ0FBMkIsTUFBQSxHQUFTLEdBQVQsR0FBZSxZQUExQztRQUNBLFlBQUEsR0FBZSxhQUFBLENBQWMsWUFBZCxFQUE0QixNQUE1QjtRQUNmLElBQWlGLFlBQUEsS0FBa0IsV0FBbkc7VUFBQSxZQUFZLENBQUMsUUFBYixDQUFzQixXQUF0QixFQUFtQyxhQUFBLENBQWMsV0FBZCxFQUEyQixNQUEzQixDQUFuQyxFQUF1RSxLQUF2RSxFQUFBOztRQUNBLEtBQUssQ0FBQyxRQUFOLENBQWUsWUFBZixFQUE2QixZQUE3QixFQUEyQyxLQUEzQztlQUNBO01BUmtDLENBQUQsQ0FBbkMsRUFTRyxLQVRIO0lBdENLOztBQWtEUDs7Ozs7O0lBTUEsS0FBQSxHQUFZLElBQUEsUUFBQSxDQUFTLGtCQUFBLEdBQXFCLFNBQXJCLEdBQWlDLE1BQTFDLENBQUEsQ0FBQTtJQUNaLEtBQUssQ0FBQSxTQUFMLEdBQWMsSUFBQSxJQUFBLENBQUssU0FBTDtXQUdWLElBQUEsS0FBQSxDQUFNLFNBQU47RUFoRVU7O0FBa0VoQjs7OztFQUlBLFNBQUEsR0FBWSxTQUFDLFlBQUQsRUFBZSxRQUFmLEVBQXlCLE9BQXpCO0lBQ1Y7QUFBQSxRQUFBO0lBQ0EsR0FBQSxHQUFNO0lBQ04sU0FBQSxHQUFZLFVBQVUsQ0FBQyxZQUFYLENBQUE7SUFDWixJQUFHLFlBQUEsSUFBaUIsWUFBWSxDQUFDLE1BQWIsR0FBc0IsQ0FBdkMsSUFBNkMsUUFBaEQ7TUFDRSxPQUFBLEdBQVUsWUFBWSxDQUFDLE1BQWIsQ0FBb0IsU0FBQyxLQUFEO2VBQzVCLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEtBQWxCLENBQUEsS0FBNEIsQ0FBQyxDQUE3QixJQUFtQyxDQUFDLENBQUksT0FBSixJQUFlLE9BQUEsS0FBYSxLQUE3QjtNQURQLENBQXBCO01BR1YsSUFBRyxPQUFPLENBQUMsTUFBUixLQUFrQixDQUFyQjtRQUNFLEdBQUEsR0FBTTtRQUNOLFFBQUEsQ0FBQSxFQUZGO09BQUEsTUFBQTtRQUlFLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBdEIsQ0FBMkIsU0FBQyxPQUFEO2lCQUN6QixTQUFBLENBQVUsT0FBVixFQUFtQixRQUFuQixFQUE2QixPQUE3QjtRQUR5QixDQUEzQixFQUpGO09BSkY7O1dBV0E7RUFmVTtFQWdCWixVQUFBLEdBQWE7SUFBQSxVQUFBLEVBQVk7O0FBRXpCOztPQUZhOztFQUtiLE1BQU0sQ0FBQyxjQUFQLENBQXNCLFVBQXRCLEVBQWtDLGNBQWxDLEVBQ0U7SUFBQSxLQUFBLEVBQU8sU0FBQTtBQUNMLFVBQUE7TUFBQSxXQUFBLEdBQWMsU0FBQyxHQUFELEVBQU0sT0FBTjtRQUNaLElBQXFDLE9BQVEsR0FBUixLQUFnQixRQUFyRDtVQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsT0FBQSxHQUFVLEdBQVYsR0FBZ0IsR0FBN0IsRUFBQTs7UUFDQSxJQUFHLE9BQU8sQ0FBQyxhQUFSLENBQXNCLEdBQXRCLENBQUg7VUFDRSxNQUFNLENBQUMsSUFBUCxDQUFZLEdBQVosQ0FBZ0IsQ0FBQyxPQUFqQixDQUF5QixTQUFDLENBQUQ7WUFDdkIsSUFBbUMsT0FBUSxDQUFSLEtBQWMsUUFBakQ7Y0FBQSxPQUFPLENBQUMsSUFBUixDQUFhLE9BQUEsR0FBVSxHQUFWLEdBQWdCLENBQTdCLEVBQUE7O1lBQ0EsSUFBMEMsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsR0FBSSxDQUFBLENBQUEsQ0FBMUIsQ0FBMUM7Y0FBQSxXQUFBLENBQVksR0FBSSxDQUFBLENBQUEsQ0FBaEIsRUFBb0IsT0FBQSxHQUFVLEdBQVYsR0FBZ0IsQ0FBcEMsRUFBQTs7VUFGdUIsQ0FBekIsRUFERjs7TUFGWTtNQVNkLE9BQUEsR0FBVTtNQUNWLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBTyxDQUFBLGFBQUEsQ0FBbkIsQ0FBa0MsQ0FBQyxPQUFuQyxDQUEyQyxTQUFDLEdBQUQ7UUFDekMsSUFBMEQsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsTUFBTyxDQUFBLGFBQUEsQ0FBZSxDQUFBLEdBQUEsQ0FBNUMsQ0FBMUQ7VUFBQSxXQUFBLENBQVksTUFBTyxDQUFBLGFBQUEsQ0FBZSxDQUFBLEdBQUEsQ0FBbEMsRUFBd0MsYUFBeEMsRUFBQTs7TUFEeUMsQ0FBM0M7YUFJQTtJQWZLLENBQVA7R0FERjs7QUFrQkE7OztFQUdBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLFVBQXRCLEVBQWtDLGlCQUFsQyxFQUNFO0lBQUEsS0FBQSxFQUFPLFNBQUMsT0FBRDtBQUNMLFVBQUE7TUFBQSxJQUFBLEdBQU8sVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUF0QixDQUE2QixTQUFDLEtBQUQ7ZUFDbEMsS0FBQSxLQUFTLEtBQUEsQ0FBTSxPQUFOO01BRHlCLENBQTdCO01BR1AsSUFBaUMsS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLENBQWpDO2VBQUEsVUFBVSxDQUFDLFVBQVgsR0FBd0IsS0FBeEI7O0lBSkssQ0FBUDtHQURGO0VBUUEsTUFBTyxDQUFBLGFBQUEsQ0FBUCxHQUF3QjtFQUV4QixLQUFBLEdBQVEsYUFBQSxDQUFjLGFBQWQsRUFBNkIsTUFBTyxDQUFBLGFBQUEsQ0FBcEM7O0FBRVI7OztFQUdBLEtBQUssQ0FBQyxRQUFOLENBQWUsR0FBZixFQUFvQixPQUFwQixFQUE2QixLQUE3Qjs7QUFFQTs7O0VBR0EsS0FBSyxDQUFDLFFBQU4sQ0FBZSxNQUFmLEVBQXVCLE1BQU8sQ0FBQSxhQUFBLENBQTlCLEVBQThDLEtBQTlDOztBQUVBOzs7RUFHQSxLQUFLLENBQUMsUUFBTixDQUFlLE1BQWYsRUFBdUIsYUFBdkIsRUFBc0MsS0FBdEM7RUFDQSxLQUFLLENBQUMsUUFBTixDQUFlLFdBQWYsRUFBNEIsU0FBNUIsRUFBdUMsS0FBdkM7U0FDQTtBQWhKYTs7O0FBbUpmOzs7O0FBR0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsVUFBdEIsRUFBa0MsYUFBbEMsRUFDRTtFQUFBLEtBQUEsRUFBTyxZQUFBLENBQUEsQ0FBUDtDQURGOztBQUdBLEVBQUUsQ0FBQyxRQUFILENBQVksUUFBWixFQUFzQixVQUF0Qjs7QUFFQSxZQUFBLEdBQWU7O0FBQ2YsSUFBRyxPQUFPLFFBQVAsS0FBcUIsV0FBeEI7RUFDRSxZQUFBLEdBQWUsU0FEakI7OztBQUdBLEVBQUUsQ0FBQyxRQUFILENBQVksVUFBWixFQUF3QixZQUF4Qjs7QUFFQSxFQUFFLENBQUMsUUFBSCxDQUFZLE1BQVosRUFBb0IsU0FBQSxHQUFBLENBQXBCOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIjICMgT0pcclxudGhpc0dsb2JhbCA9IHJlcXVpcmUgJy4vZ2xvYmFsJ1xyXG51dGlsTGliID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG5uYW1lU3BhY2VOYW1lID0gJ09KJ1xyXG5cclxuIyMjXHJcbmJvb3Qgc3RyYXAgbmFtZSBtZXRob2QgaW50byBPYmplY3QgcHJvdG90eXBlXHJcbiMjI1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBPYmplY3Q6OixcclxuICBnZXRJbnN0YW5jZU5hbWU6XHJcbiAgICB2YWx1ZTogLT5cclxuICAgICAgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLnsxLH0pXFwoL1xyXG4gICAgICByZXN1bHRzID0gKGZ1bmNOYW1lUmVnZXgpLmV4ZWMoQGNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpXHJcbiAgICAgIChpZiAocmVzdWx0cyBhbmQgcmVzdWx0cy5sZW5ndGggPiAxKSB0aGVuIHJlc3VsdHNbMV0gZWxzZSAnJylcclxuXHJcblxyXG4jIyNcclxuQW4gaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5hbWVzcGFjZSB0cmVlXHJcbiMjI1xyXG5Oc1RyZWUgPSB7fVxyXG5tYWtlVGhlSnVpY2UgPSAtPlxyXG5cclxuICAjIyNcclxuICBJbnRlcm5hbCBuYW1lU3BhY2VOYW1lIG1ldGhvZCB0byBjcmVhdGUgbmV3ICdzdWInIG5hbWVzcGFjZXMgb24gYXJiaXRyYXJ5IGNoaWxkIG9iamVjdHMuXHJcbiAgIyMjXHJcbiAgbWFrZU5hbWVTcGFjZSA9IChzcGFjZW5hbWUsIHRyZWUpIC0+XHJcbiAgICAjIyNcclxuICAgIFRoZSBkZXJpdmVkIGluc3RhbmNlIHRvIGJlIGNvbnN0cnVjdGVkXHJcbiAgICAjIyNcclxuICAgIEJhc2UgPSAobnNOYW1lKSAtPlxyXG4gICAgICBwcm90byA9IHRoaXNcclxuICAgICAgdHJlZVtuc05hbWVdID0gdHJlZVtuc05hbWVdIG9yIHt9XHJcbiAgICAgIG5zVHJlZSA9IHRyZWVbbnNOYW1lXVxyXG4gICAgICBtZW1iZXJzID0ge31cclxuXHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAnbWVtYmVycycsIHZhbHVlOiBtZW1iZXJzXHJcblxyXG4gICAgICAjIyNcclxuICAgICAgUmVnaXN0ZXIgKGUuZy4gJ0xpZnQnKSBhbiBPYmplY3QgaW50byB0aGUgcHJvdG90eXBlIG9mIHRoZSBuYW1lc3BhY2UuXHJcbiAgICAgIFRoaXMgT2JqZWN0IHdpbGwgYmUgcmVhZGFibGUvZXhlY3V0YWJsZSBidXQgaXMgb3RoZXJ3aXNlIGltbXV0YWJsZS5cclxuICAgICAgIyMjXHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAncmVnaXN0ZXInLFxyXG4gICAgICAgIHZhbHVlOiAobmFtZSwgb2JqLCBlbnVtZXJhYmxlKSAtPlxyXG4gICAgICAgICAgJ3VzZSBzdHJpY3QnXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsaWZ0IGEgbmV3IHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIG5hbWUgaXNudCAnc3RyaW5nJykgb3IgbmFtZSBpcyAnJ1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbGlmdCBhIG5ldyBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgcHJvcGVydHkgaW5zdGFuY2UuJykgIHVubGVzcyBvYmpcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgbmFtZWQgJyArIG5hbWUgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKSAgaWYgcHJvdG9bbmFtZV1cclxuXHJcbiAgICAgICAgICBtZW1iZXJzW25hbWVdID0gbWVtYmVyc1tuYW1lXSBvciBuYW1lXHJcblxyXG4gICAgICAgICAgI0d1YXJkIGFnYWluc3Qgb2JsaXRlcmF0aW5nIHRoZSB0cmVlIGFzIHRoZSB0cmVlIGlzIHJlY3Vyc2l2ZWx5IGV4dGVuZGVkXHJcbiAgICAgICAgICBuc1RyZWVbbmFtZV0gPSBuc1RyZWVbbmFtZV0gb3JcclxuICAgICAgICAgICAgbmFtZTogbmFtZVxyXG4gICAgICAgICAgICB0eXBlOiB0eXBlb2Ygb2JqXHJcbiAgICAgICAgICAgIGluc3RhbmNlOiAoaWYgb2JqLmdldEluc3RhbmNlTmFtZSB0aGVuIG9iai5nZXRJbnN0YW5jZU5hbWUoKSBlbHNlICd1bmtub3duJylcclxuXHJcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgcHJvdG8sIG5hbWUsXHJcbiAgICAgICAgICAgIHZhbHVlOiBvYmpcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UgaXNudCBlbnVtZXJhYmxlXHJcblxyXG4gICAgICAgICAgbnNJbnRlcm5hbC5hbGVydERlcGVuZGVudHMgbnNOYW1lICsgJy4nICsgc3BhY2VuYW1lICsgJy4nICsgbmFtZVxyXG4gICAgICAgICAgb2JqXHJcblxyXG5cclxuICAgICAgIyMjXHJcbiAgICAgIENyZWF0ZSBhIG5ldywgc3RhdGljIG5hbWVzcGFjZSBvbiB0aGUgY3VycmVudCBwYXJlbnQgKGUuZy4gbnNOYW1lLnRvLi4uIHx8IG5zTmFtZS5pcy4uLilcclxuICAgICAgIyMjXHJcbiAgICAgIHByb3RvLnJlZ2lzdGVyICdtYWtlU3ViTmFtZVNwYWNlJywgKChzdWJOYW1lU3BhY2UpIC0+XHJcbiAgICAgICAgJ3VzZSBzdHJpY3QnXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbmV3IHN1YiBuYW1lc3BhY2Ugd2l0aG91dCBhIHZhbGlkIG5hbWUuJykgIGlmICh0eXBlb2Ygc3ViTmFtZVNwYWNlIGlzbnQgJ3N0cmluZycpIG9yIHN1Yk5hbWVTcGFjZSBpcyAnJ1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU3ViIG5hbWVzcGFjZSBuYW1lZCAnICsgc3ViTmFtZVNwYWNlICsgJyBpcyBhbHJlYWR5IGRlZmluZWQgb24gJyArIHNwYWNlbmFtZSArICcuJykgIGlmIHByb3RvLnN1Yk5hbWVTcGFjZVxyXG4gICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHN1Yk5hbWVTcGFjZVxyXG4gICAgICAgIG5ld05hbWVTcGFjZSA9IG1ha2VOYW1lU3BhY2Uoc3ViTmFtZVNwYWNlLCBuc1RyZWUpXHJcbiAgICAgICAgbmV3TmFtZVNwYWNlLnJlZ2lzdGVyICdjb25zdGFudHMnLCBtYWtlTmFtZVNwYWNlKCdjb25zdGFudHMnLCBuc1RyZWUpLCBmYWxzZSAgaWYgc3ViTmFtZVNwYWNlIGlzbnQgJ2NvbnN0YW50cydcclxuICAgICAgICBwcm90by5yZWdpc3RlciBzdWJOYW1lU3BhY2UsIG5ld05hbWVTcGFjZSwgZmFsc2VcclxuICAgICAgICBuZXdOYW1lU3BhY2VcclxuICAgICAgKSwgZmFsc2VcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgIyMjXHJcbiAgICBBbiBpbnRlcm5hbCBtZWNoYW5pc20gdG8gcmVwcmVzZW50IHRoZSBpbnN0YW5jZSBvZiB0aGlzIG5hbWVzcGFjZVxyXG4gICAgQGNvbnN0cnVjdG9yXHJcbiAgICBAaW50ZXJuYWxcclxuICAgIEBtZW1iZXJPZiBtYWtlTmFtZVNwYWNlXHJcbiAgICAjIyNcclxuICAgIENsYXNzID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gZnVuY3Rpb24gJyArIHNwYWNlbmFtZSArICcoKXt9JykoKVxyXG4gICAgQ2xhc3M6OiA9IG5ldyBCYXNlKHNwYWNlbmFtZSlcclxuXHJcbiAgICAjQ2xhc3MucHJvdG90eXBlLnBhcmVudCA9IEJhc2UucHJvdG90eXBlO1xyXG4gICAgbmV3IENsYXNzKHNwYWNlbmFtZSlcclxuXHJcbiAgIyMjXHJcbiAgJ0RlcGVuZCcgYW4gT2JqZWN0IHVwb24gYW5vdGhlciBtZW1iZXIgb2YgdGhpcyBuYW1lc3BhY2UsIHVwb24gYW5vdGhlciBuYW1lc3BhY2UsXHJcbiAgb3IgdXBvbiBhIG1lbWJlciBvZiBhbm90aGVyIG5hbWVzcGFjZVxyXG4gICMjI1xyXG4gIGRlcGVuZHNPbiA9IChkZXBlbmRlbmNpZXMsIGNhbGxCYWNrLCBpbXBvcnRzKSAtPlxyXG4gICAgJ3VzZSBzdHJpY3QnXHJcbiAgICByZXQgPSBmYWxzZVxyXG4gICAgbnNNZW1iZXJzID0gbnNJbnRlcm5hbC5nZXROc01lbWJlcnMoKVxyXG4gICAgaWYgZGVwZW5kZW5jaWVzIGFuZCBkZXBlbmRlbmNpZXMubGVuZ3RoID4gMCBhbmQgY2FsbEJhY2tcclxuICAgICAgbWlzc2luZyA9IGRlcGVuZGVuY2llcy5maWx0ZXIoKGRlcGVuKSAtPlxyXG4gICAgICAgIG5zTWVtYmVycy5pbmRleE9mKGRlcGVuKSBpcyAtMSBhbmQgKG5vdCBpbXBvcnRzIG9yIGltcG9ydHMgaXNudCBkZXBlbilcclxuICAgICAgKVxyXG4gICAgICBpZiBtaXNzaW5nLmxlbmd0aCBpcyAwXHJcbiAgICAgICAgcmV0ID0gdHJ1ZVxyXG4gICAgICAgIGNhbGxCYWNrKClcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG5zSW50ZXJuYWwuZGVwZW5kZW50cy5wdXNoIChpbXBvcnRzKSAtPlxyXG4gICAgICAgICAgZGVwZW5kc09uIG1pc3NpbmcsIGNhbGxCYWNrLCBpbXBvcnRzXHJcblxyXG4gICAgcmV0XHJcbiAgbnNJbnRlcm5hbCA9IGRlcGVuZGVudHM6IFtdXHJcblxyXG4gICMjI1xyXG4gIEZldGNoZXMgdGhlIHJlZ2lzdGVyZWQgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBvbiB0aGUgbmFtZXNwYWNlIGFuZCBpdHMgY2hpbGQgbmFtZXNwYWNlc1xyXG4gICMjI1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBuc0ludGVybmFsLCAnZ2V0TnNNZW1iZXJzJyxcclxuICAgIHZhbHVlOiAtPlxyXG4gICAgICByZWN1cnNlVHJlZSA9IChrZXksIGxhc3RLZXkpIC0+XHJcbiAgICAgICAgbWVtYmVycy5wdXNoIGxhc3RLZXkgKyAnLicgKyBrZXkgIGlmIHR5cGVvZiAoa2V5KSBpcyAnc3RyaW5nJ1xyXG4gICAgICAgIGlmIHV0aWxMaWIuaXNQbGFpbk9iamVjdChrZXkpXHJcbiAgICAgICAgICBPYmplY3Qua2V5cyhrZXkpLmZvckVhY2ggKGspIC0+XHJcbiAgICAgICAgICAgIG1lbWJlcnMucHVzaCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdHlwZW9mIChrKSBpcyAnc3RyaW5nJ1xyXG4gICAgICAgICAgICByZWN1cnNlVHJlZSBrZXlba10sIGxhc3RLZXkgKyAnLicgKyBrICBpZiB1dGlsTGliLmlzUGxhaW5PYmplY3Qoa2V5W2tdKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIG1lbWJlcnMgPSBbXVxyXG4gICAgICBPYmplY3Qua2V5cyhOc1RyZWVbbmFtZVNwYWNlTmFtZV0pLmZvckVhY2ggKGtleSkgLT5cclxuICAgICAgICByZWN1cnNlVHJlZSBOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSwgbmFtZVNwYWNlTmFtZSAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KE5zVHJlZVtuYW1lU3BhY2VOYW1lXVtrZXldKVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgbWVtYmVyc1xyXG5cclxuICAjIyNcclxuICBUbyBzdXBwb3J0IGRlcGVuZGVuY3kgbWFuYWdlbWVudCwgd2hlbiBhIHByb3BlcnR5IGlzIGxpZnRlZCBvbnRvIHRoZSBuYW1lc3BhY2UsIG5vdGlmeSBkZXBlbmRlbnRzIHRvIGluaXRpYWxpemVcclxuICAjIyNcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnNJbnRlcm5hbCwgJ2FsZXJ0RGVwZW5kZW50cycsXHJcbiAgICB2YWx1ZTogKGltcG9ydHMpIC0+XHJcbiAgICAgIGRlcHMgPSBuc0ludGVybmFsLmRlcGVuZGVudHMuZmlsdGVyKChkZXBPbikgLT5cclxuICAgICAgICBmYWxzZSBpcyBkZXBPbihpbXBvcnRzKVxyXG4gICAgICApXHJcbiAgICAgIG5zSW50ZXJuYWwuZGVwZW5kZW50cyA9IGRlcHMgIGlmIEFycmF5LmlzQXJyYXkoZGVwcylcclxuXHJcbiAgI0NyZWF0ZSB0aGUgcm9vdCBvZiB0aGUgdHJlZSBhcyB0aGUgY3VycmVudCBuYW1lc3BhY2VcclxuICBOc1RyZWVbbmFtZVNwYWNlTmFtZV0gPSB7fVxyXG4gICNEZWZpbmUgdGhlIGNvcmUgbmFtZXNwYWNlIGFuZCB0aGUgcmV0dXJuIG9mIHRoaXMgY2xhc3NcclxuICBOc091dCA9IG1ha2VOYW1lU3BhY2UobmFtZVNwYWNlTmFtZSwgTnNUcmVlW25hbWVTcGFjZU5hbWVdKVxyXG5cclxuICAjIyNcclxuICBDYWNoZSBhIGhhbmRsZSBvbiB0aGUgdmVuZG9yIChwcm9iYWJseSBqUXVlcnkpIG9uIHRoZSByb290IG5hbWVzcGFjZVxyXG4gICMjI1xyXG4gIE5zT3V0LnJlZ2lzdGVyICc/JywgdXRpbExpYiwgZmFsc2VcclxuXHJcbiAgIyMjXHJcbiAgQ2FjaGUgdGhlIHRyZWUgKHVzZWZ1bCBmb3IgZG9jdW1lbnRhdGlvbi92aXN1YWxpemF0aW9uL2RlYnVnZ2luZylcclxuICAjIyNcclxuICBOc091dC5yZWdpc3RlciAndHJlZScsIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSwgZmFsc2VcclxuXHJcbiAgIyMjXHJcbiAgQ2FjaGUgdGhlIG5hbWUgc3BhY2UgbmFtZVxyXG4gICMjI1xyXG4gIE5zT3V0LnJlZ2lzdGVyICduYW1lJywgbmFtZVNwYWNlTmFtZSwgZmFsc2VcclxuICBOc091dC5yZWdpc3RlciAnZGVwZW5kc09uJywgZGVwZW5kc09uLCBmYWxzZVxyXG4gIE5zT3V0XHJcblxyXG5cclxuIyMjXHJcbkFjdHVhbGx5IGRlZmluZSB0aGUgT0ogTmFtZVNwYWNlXHJcbiMjI1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgdGhpc0dsb2JhbCwgbmFtZVNwYWNlTmFtZSxcclxuICB2YWx1ZTogbWFrZVRoZUp1aWNlKClcclxuXHJcbk9KLnJlZ2lzdGVyICdnbG9iYWwnLCB0aGlzR2xvYmFsXHJcblxyXG50aGlzRG9jdW1lbnQgPSB7fVxyXG5pZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xyXG4gIHRoaXNEb2N1bWVudCA9IGRvY3VtZW50XHJcblxyXG5PSi5yZWdpc3RlciAnZG9jdW1lbnQnLCB0aGlzRG9jdW1lbnRcclxuXHJcbk9KLnJlZ2lzdGVyICdub29wJywgLT5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT0oiXX0=
},{"./global":34}],59:[function(require,module,exports){
(function (global){
var OJ, _, subNameSpaces;

OJ = require('./oj');

_ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

subNameSpaces = ['errors', 'enums', 'instanceOf', 'nodes', 'db', 'components', 'controls', 'inputs', 'notifications', 'history', 'cookie', 'async'];

_.each(subNameSpaces, function(name) {
  return OJ.makeSubNameSpace(name);
});

OJ['GENERATE_UNIQUE_IDS'] = false;

OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] = 'div';

OJ['TRACK_ON_ERROR'] = false;

OJ['LOG_ALL_AJAX'] = false;

OJ['LOG_ALL_AJAX_ERRORS'] = false;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxvakluaXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsTUFBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBSUosYUFBQSxHQUFnQixDQUNkLFFBRGMsRUFFZCxPQUZjLEVBR2QsWUFIYyxFQUlkLE9BSmMsRUFLZCxJQUxjLEVBTWQsWUFOYyxFQU9kLFVBUGMsRUFRZCxRQVJjLEVBU2QsZUFUYyxFQVVkLFNBVmMsRUFXZCxRQVhjLEVBWWQsT0FaYzs7QUFtQmhCLENBQUMsQ0FBQyxJQUFGLENBQU8sYUFBUCxFQUFzQixTQUFDLElBQUQ7U0FDcEIsRUFBRSxDQUFDLGdCQUFILENBQW9CLElBQXBCO0FBRG9CLENBQXRCOztBQU1BLEVBQUcsQ0FBQSxxQkFBQSxDQUFILEdBQTRCOztBQUU1QixFQUFHLENBQUEsaUNBQUEsQ0FBSCxHQUF3Qzs7QUFFeEMsRUFBRyxDQUFBLGdCQUFBLENBQUgsR0FBdUI7O0FBRXZCLEVBQUcsQ0FBQSxjQUFBLENBQUgsR0FBcUI7O0FBRXJCLEVBQUcsQ0FBQSxxQkFBQSxDQUFILEdBQTRCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIgIyAjIE9KIFBvc3QtSW5pdGlhbGl6YXRpb25cclxuXHJcbk9KID0gcmVxdWlyZSAnLi9vaidcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuXHJcbiMgU2ltcGxlIGFycmF5IG9mIGFudGljaXBhdGVkL2tub3duIGNoaWxkIG5hbWVzcGFjZXNcclxuICBcclxuc3ViTmFtZVNwYWNlcyA9IFtcclxuICAnZXJyb3JzJ1xyXG4gICdlbnVtcydcclxuICAnaW5zdGFuY2VPZidcclxuICAnbm9kZXMnXHJcbiAgJ2RiJ1xyXG4gICdjb21wb25lbnRzJ1xyXG4gICdjb250cm9scydcclxuICAnaW5wdXRzJ1xyXG4gICdub3RpZmljYXRpb25zJ1xyXG4gICdoaXN0b3J5J1xyXG4gICdjb29raWUnXHJcbiAgJ2FzeW5jJ1xyXG5dXHJcblxyXG4jICMjIFN1Yk5hbWVTcGFjZXNcclxuXHJcbiMgUHJlLWFsbG9jYXRlIGNlcnRhaW4gY29tbW9uIG5hbWVzcGFjZXMgdG8gYXZvaWQgZnV0dXJlIHJhY2UgY29uZGl0aW9ucy5cclxuIyBUaGlzIGRvZXMgcmVxdWlyZSB0aGF0IHRoZSBvcmRlciBvZiBvcGVyYXRpb25zIGxvYWRzIE9KLmNvZmZlZSBmaXJzdCBhbmQgb0pJbml0LmNvZmZlZSBzZWNvbmRcclxuXy5lYWNoIHN1Yk5hbWVTcGFjZXMsIChuYW1lKSAtPlxyXG4gIE9KLm1ha2VTdWJOYW1lU3BhY2UgbmFtZVxyXG4gIFxyXG4jICMjIENvbmZpZ3VyYXRpb24gdmFyaWFibGVzXHJcblxyXG4jIEF1dG9tYXRpY2FsbHkgZ2VuZXJhdGUgdW5pcXVlIElEcyBmb3IgZWFjaCBub2RlIChkZWZhdWx0IGZhbHNlKVxyXG5PSlsnR0VORVJBVEVfVU5JUVVFX0lEUyddID0gZmFsc2VcclxuIyBEZWZhdWx0IHJvb3Qgbm9kZSBmb3IgY29tcG9uZW50cy9jb250cm9scyAoZGVmYXVsdCAnZGl2JylcclxuT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSA9ICdkaXYnXHJcbiMgV2hldGhlciB0byBob29rIGludG8gdGhlIGdsb2JhbCBvbiBlcnJvciBldmVudCB0byB3cml0ZSBlcnJvcnMgdG8gY29uc29sZSAoZGVmYXVsdCBmYWxzZSlcclxuT0pbJ1RSQUNLX09OX0VSUk9SJ10gPSBmYWxzZVxyXG4jV2hldGhlciB0byBsb2cgYWxsIEFKQVggcmVxdWVzdHNcclxuT0pbJ0xPR19BTExfQUpBWCddID0gZmFsc2VcclxuI1doZXRoZXIgdG8gbG9nIGFsbCBBSkFYIGVycm9yc1xyXG5PSlsnTE9HX0FMTF9BSkFYX0VSUk9SUyddID0gZmFsc2UiXX0=
},{"./oj":58}],60:[function(require,module,exports){

/*
Return just the keys from the input array, optionally only for the specified search_value
version: 1109.2015
discuss at: http://phpjs.org/functions/array_keys
+   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
+      input by: Brett Zamir (http://brett-zamir.me)
+   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
+   improved by: jd
+   improved by: Brett Zamir (http://brett-zamir.me)
+   input by: P
+   bugfixed by: Brett Zamir (http://brett-zamir.me)
example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} );
returns 1: {0: 'firstname', 1: 'surname'}
 */
var JsonToTable, array_keys;

array_keys = function(input, search_value, argStrict) {
  var include, key, search, strict, tmp_arr;
  search = typeof search_value !== "undefined";
  tmp_arr = [];
  strict = !!argStrict;
  include = true;
  key = "";
  if (input && typeof input === "object" && input.change_key_case) {
    return input.keys(search_value, argStrict);
  }
  for (key in input) {
    if (input.hasOwnProperty(key)) {
      include = true;
      if (search) {
        if (strict && input[key] !== search_value) {
          include = false;
        } else {
          if (input[key] !== search_value) {
            include = false;
          }
        }
      }
      if (include) {
        tmp_arr[tmp_arr.length] = key;
      }
    }
  }
  return tmp_arr;
};


/**
Convert a Javascript Oject array or String array to an HTML table
JSON parsing has to be made before function call
It allows use of other JSON parsing methods like jQuery.parseJSON
http(s)://, ftp://, file:// and javascript:; links are automatically computed

JSON data samples that should be parsed and then can be converted to an HTML table
var objectArray = '[{"Total":"34","Version":"1.0.4","Office":"New York"},{"Total":"67","Version":"1.1.0","Office":"Paris"}]';
var stringArray = '["New York","Berlin","Paris","Marrakech","Moscow"]';
var nestedTable = '[{ key1: "val1", key2: "val2", key3: { tableId: "tblIdNested1", tableClassName: "clsNested", linkText: "Download", data: [{ subkey1: "subval1", subkey2: "subval2", subkey3: "subval3" }] } }]';

Code sample to create a HTML table Javascript String
var jsonHtmlTable = ConvertJsonToTable(eval(dataString), 'jsonTable', null, 'Download');

Code sample explaned
- eval is used to parse a JSON dataString
- table HTML id attribute will be 'jsonTable'
- table HTML class attribute will not be added
- 'Download' text will be displayed instead of the link itself

@author Afshin Mehrabani <afshin dot meh at gmail dot com>

@class ConvertJsonToTable

@method ConvertJsonToTable

@param parsedJson object Parsed JSON data
@param tableId string Optional table id
@param tableClassName string Optional table css class name
@param linkText string Optional text replacement for link pattern

@return string Converted JSON to HTML table
 */

JsonToTable = (function() {
  JsonToTable.prototype.table = null;

  function JsonToTable(parsedJson, tableId, tableClassName, linkText) {
    var classMarkup, headers, i, idMarkup, isStringArray, isUrl, italic, j, javascriptRegExp, link, tb, tbCon, tbl, tdRow, th, thCon, thRow, tr, trCon, urlRegExp, value;
    italic = "<i>{0}</i>";
    link = (linkText ? "<a href=\"{0}\">" + linkText + "</a>" : "<a href=\"{0}\">{0}</a>");
    idMarkup = (tableId ? " id=\"" + tableId + "\"" : "");
    classMarkup = (tableClassName ? " class=\"" + tableClassName + "\"" : "");
    tbl = "<table border=\"1\" cellpadding=\"1\" cellspacing=\"1\"" + idMarkup + classMarkup + ">{0}{1}</table>";
    th = "<thead>{0}</thead>";
    tb = "<tbody>{0}</tbody>";
    tr = "<tr>{0}</tr>";
    thRow = "<th>{0}</th>";
    tdRow = "<td>{0}</td>";
    thCon = "";
    tbCon = "";
    trCon = "";
    if (parsedJson) {
      isStringArray = typeof parsedJson[0] === "string";
      headers = void 0;
      if (isStringArray) {
        thCon += thRow.format("value");
      } else {
        if (typeof parsedJson[0] === "object") {
          headers = array_keys(parsedJson[0]);
          i = 0;
          while (i < headers.length) {
            thCon += thRow.format(headers[i]);
            i++;
          }
        }
      }
      th = th.format(tr.format(thCon));
      if (isStringArray) {
        i = 0;
        while (i < parsedJson.length) {
          tbCon += tdRow.format(parsedJson[i]);
          trCon += tr.format(tbCon);
          tbCon = "";
          i++;
        }
      } else {
        if (headers) {
          urlRegExp = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/g);
          javascriptRegExp = new RegExp(/(^javascript:[\s\S]*;$)/g);
          i = 0;
          while (i < parsedJson.length) {
            j = 0;
            while (j < headers.length) {
              value = parsedJson[i][headers[j]];
              isUrl = urlRegExp.test(value) || javascriptRegExp.test(value);
              if (isUrl) {
                tbCon += tdRow.format(link.format(value));
              } else {
                if (value) {
                  if (typeof value === "object") {
                    tbCon += tdRow.format(ConvertJsonToTable(eval(value.data), value.tableId, value.tableClassName, value.linkText));
                  } else {
                    tbCon += tdRow.format(value);
                  }
                } else {
                  tbCon += tdRow.format(italic.format(value).toUpperCase());
                }
              }
              j++;
            }
            trCon += tr.format(tbCon);
            tbCon = "";
            i++;
          }
        }
      }
      tb = tb.format(trCon);
      tbl = tbl.format(th, tb);
    }
    this.table = tbl;
  }

  return JsonToTable;

})();

module.exports = JsonToTable;



},{}],61:[function(require,module,exports){
var OJ, array2D;

OJ = require('../oj');

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

module.exports = array2D;



},{"../oj":58}],62:[function(require,module,exports){
var OJ, console, methodLength, methods,
  slice = [].slice;

OJ = require('../oj');

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
      params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return console[method].apply(console, params);
    });
  })();
}

module.exports = console;



},{"../oj":58}],63:[function(require,module,exports){
(function (global){
var $, OJ, all, cookies, del, deleteAll, get, set;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);


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

if (!$ || !$.cookie) {
  throw new Error('jQuery Cookie is a required dependency.');
}

$.cookie.defaults.secure = false;

cookies = {};

get = function(cookieName, type) {
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
};

all = function() {
  var ret;
  ret = $.cookie();
  return ret;
};

set = function(cookieName, value, opts) {
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
};

del = function(cookieName, opts) {
  if (cookieName) {
    if (opts) {
      $.removeCookie(cookieName, opts);
    } else {
      $.removeCookie(cookieName);
    }
    delete cookies[cookieName];
  }
};

deleteAll = function() {
  cookies = {};
  OJ.each(OJ.cookie.all, function(val, key) {
    return OJ.cookie["delete"](key);
  });
};

OJ.cookie.register('deleteAll', deleteAll);

OJ.cookie.register('delete', del);

OJ.cookie.register('set', set);

OJ.cookie.register('get', get);

OJ.cookie.register('all', all);

module.exports = {
  deleteAll: deleteAll,
  "delete": del,
  set: set,
  get: get,
  all: all
};


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcY29va2llLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOzs7QUFFSjs7Ozs7Ozs7Ozs7O0FBV0EsSUFBRyxDQUFJLENBQUosSUFBUyxDQUFJLENBQUMsQ0FBQyxNQUFsQjtBQUNFLFFBQVUsSUFBQSxLQUFBLENBQU0seUNBQU4sRUFEWjs7O0FBRUEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBbEIsR0FBMkI7O0FBRTNCLE9BQUEsR0FBVTs7QUFFVixHQUFBLEdBQU0sU0FBQyxVQUFELEVBQWEsSUFBYjtBQUNKLE1BQUE7RUFBQSxHQUFBLEdBQU07RUFDTixJQUFHLFVBQUg7SUFDRSxJQUFHLElBQUg7TUFDRSxHQUFBLEdBQU0sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxVQUFULEVBQXFCLElBQXJCLEVBRFI7S0FBQSxNQUFBO01BR0UsR0FBQSxHQUFNLENBQUMsQ0FBQyxNQUFGLENBQVMsVUFBVCxFQUhSOztJQUlBLElBQUcsR0FBSDthQUNFLE9BQVEsQ0FBQSxVQUFBLENBQVIsR0FBc0IsSUFEeEI7S0FMRjs7QUFGSTs7QUFVTixHQUFBLEdBQU0sU0FBQTtBQUNKLE1BQUE7RUFBQSxHQUFBLEdBQU0sQ0FBQyxDQUFDLE1BQUYsQ0FBQTtTQUNOO0FBRkk7O0FBSU4sR0FBQSxHQUFNLFNBQUMsVUFBRCxFQUFhLEtBQWIsRUFBb0IsSUFBcEI7QUFDSixNQUFBO0VBQUEsR0FBQSxHQUFNO0VBQ04sSUFBRyxVQUFIO0lBQ0UsT0FBUSxDQUFBLFVBQUEsQ0FBUixHQUFzQjtJQUN0QixJQUFHLElBQUg7TUFDRSxHQUFBLEdBQU0sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxVQUFULEVBQXFCLEtBQXJCLEVBQTRCLElBQTVCLEVBRFI7S0FBQSxNQUFBO01BR0UsR0FBQSxHQUFNLENBQUMsQ0FBQyxNQUFGLENBQVMsVUFBVCxFQUFxQixLQUFyQixFQUhSO0tBRkY7O1NBTUE7QUFSSTs7QUFVTixHQUFBLEdBQU0sU0FBQyxVQUFELEVBQWEsSUFBYjtFQUNKLElBQUcsVUFBSDtJQUNFLElBQUcsSUFBSDtNQUNFLENBQUMsQ0FBQyxZQUFGLENBQWUsVUFBZixFQUEyQixJQUEzQixFQURGO0tBQUEsTUFBQTtNQUdFLENBQUMsQ0FBQyxZQUFGLENBQWUsVUFBZixFQUhGOztJQUlBLE9BQU8sT0FBUSxDQUFBLFVBQUEsRUFMakI7O0FBREk7O0FBU04sU0FBQSxHQUFZLFNBQUE7RUFDVixPQUFBLEdBQVU7RUFDVixFQUFFLENBQUMsSUFBSCxDQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBbEIsRUFBdUIsU0FBQyxHQUFELEVBQU0sR0FBTjtXQUNyQixFQUFFLENBQUMsTUFBTSxDQUFDLFFBQUQsQ0FBVCxDQUFpQixHQUFqQjtFQURxQixDQUF2QjtBQUZVOztBQU1YLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixXQUFuQixFQUFnQyxTQUFoQzs7QUFDQSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsUUFBbkIsRUFBNkIsR0FBN0I7O0FBQ0EsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLEtBQW5CLEVBQTBCLEdBQTFCOztBQUNBLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixLQUFuQixFQUEwQixHQUExQjs7QUFDQSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsS0FBbkIsRUFBMkIsR0FBM0I7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FDQztFQUFBLFNBQUEsRUFBVyxTQUFYO0VBQ0EsUUFBQSxFQUFRLEdBRFI7RUFFQSxHQUFBLEVBQUssR0FGTDtFQUdBLEdBQUEsRUFBSyxHQUhMO0VBSUEsR0FBQSxFQUFNLEdBSk4iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiQgPSByZXF1aXJlICdqcXVlcnknXHJcbiAgXHJcbiMjI1xyXG5TZXR1cCBzZXR0aW5nc1xyXG4kLmNvb2tpZS5yYXcgPSB0cnVlXHJcbiQuY29va2llLmpzb24gPSB0cnVlXHJcbiAgXHJcblNldHVwIGRlZmF1bHRzXHJcbmh0dHBzOi8vZ2l0aHViLmNvbS9jYXJoYXJ0bC9qcXVlcnktY29va2llL1xyXG4kLmNvb2tpZS5kZWZhdWx0cy5leHBpcmVzID0gMzY1XHJcbiQuY29va2llLmRlZmF1bHRzLnBhdGggPSAnLydcclxuJC5jb29raWUuZGVmYXVsdHMuZG9tYWluID0gJ29qLmNvbSdcclxuIyMjXHJcbmlmIG5vdCAkIG9yIG5vdCAkLmNvb2tpZVxyXG4gIHRocm93IG5ldyBFcnJvciAnalF1ZXJ5IENvb2tpZSBpcyBhIHJlcXVpcmVkIGRlcGVuZGVuY3kuJyAgXHJcbiQuY29va2llLmRlZmF1bHRzLnNlY3VyZSA9IGZhbHNlXHJcbiAgXHJcbmNvb2tpZXMgPSB7fVxyXG4gIFxyXG5nZXQgPSAoY29va2llTmFtZSwgdHlwZSkgLT5cclxuICByZXQgPSAnJ1xyXG4gIGlmIGNvb2tpZU5hbWVcclxuICAgIGlmIHR5cGVcclxuICAgICAgcmV0ID0gJC5jb29raWUgY29va2llTmFtZSwgdHlwZVxyXG4gICAgZWxzZVxyXG4gICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lICAgIFxyXG4gICAgaWYgcmV0XHJcbiAgICAgIGNvb2tpZXNbY29va2llTmFtZV0gPSByZXRcclxuICBcclxuYWxsID0gLT5cclxuICByZXQgPSAkLmNvb2tpZSgpXHJcbiAgcmV0XHJcbiAgICBcclxuc2V0ID0gKGNvb2tpZU5hbWUsIHZhbHVlLCBvcHRzKSAtPlxyXG4gIHJldCA9ICcnXHJcbiAgaWYgY29va2llTmFtZVxyXG4gICAgY29va2llc1tjb29raWVOYW1lXSA9IHZhbHVlXHJcbiAgICBpZiBvcHRzXHJcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHZhbHVlLCBvcHRzXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHZhbHVlXHJcbiAgcmV0ICBcclxuICBcclxuZGVsID0gKGNvb2tpZU5hbWUsIG9wdHMpIC0+XHJcbiAgaWYgY29va2llTmFtZVxyXG4gICAgaWYgb3B0c1xyXG4gICAgICAkLnJlbW92ZUNvb2tpZSBjb29raWVOYW1lLCBvcHRzXHJcbiAgICBlbHNlXHJcbiAgICAgICQucmVtb3ZlQ29va2llIGNvb2tpZU5hbWUgICAgXHJcbiAgICBkZWxldGUgY29va2llc1tjb29raWVOYW1lXVxyXG4gIHJldHVyblxyXG4gICAgXHJcbmRlbGV0ZUFsbCA9IC0+XHJcbiAgY29va2llcyA9IHt9XHJcbiAgT0ouZWFjaCBPSi5jb29raWUuYWxsLCAodmFsLCBrZXkpIC0+XHJcbiAgICBPSi5jb29raWUuZGVsZXRlIGtleSAgXHJcbiAgcmV0dXJuXHJcbiAgICBcclxuIE9KLmNvb2tpZS5yZWdpc3RlciAnZGVsZXRlQWxsJywgZGVsZXRlQWxsXHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2RlbGV0ZScsIGRlbFxyXG4gT0ouY29va2llLnJlZ2lzdGVyICdzZXQnLCBzZXRcclxuIE9KLmNvb2tpZS5yZWdpc3RlciAnZ2V0JywgZ2V0XHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2FsbCcsICBhbGxcclxuIFxyXG4gbW9kdWxlLmV4cG9ydHMgPSBcclxuICBkZWxldGVBbGw6IGRlbGV0ZUFsbFxyXG4gIGRlbGV0ZTogZGVsXHJcbiAgc2V0OiBzZXRcclxuICBnZXQ6IGdldFxyXG4gIGFsbDogIGFsbCJdfQ==
},{"../oj":58}],64:[function(require,module,exports){
var OJ, defer;

OJ = require('../oj');

defer = function(method, waitMs) {
  if (waitMs && setTimeout) {
    setTimeout(method, waitMs);
  }
  return (new Promise(function(resolve) {
    return resolve();
  })).then(method);
};

OJ.register('defer', defer);

module.exports = defer;



},{"../oj":58}],65:[function(require,module,exports){
var OJ, canEach, each;

OJ = require('../oj');

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

module.exports = each;



},{"../oj":58}],66:[function(require,module,exports){
var OJ, inputTypes, unknown;

OJ = require('../oj');

unknown = 'unknown';

inputTypes = {
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
};

OJ.enums.register('unknown', unknown);

OJ.enums.register('inputTypes', inputTypes);

module.exports = {
  unknown: unknown,
  inputTypes: inputTypes
};



},{"../oj":58}],67:[function(require,module,exports){
var OJ, eventInfo, eventName, pushState, restoreState;

OJ = require('../oj');

if (OJ.global.addEventListener) {
  eventName = 'addEventListener';
  eventInfo = '';
} else {
  eventName = 'attachEvent';
  eventInfo = 'on';
}

pushState = function(pageName, event) {
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
};

restoreState = function(location) {
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
};


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

OJ.history.register('restoreState', restoreState);

OJ.history.register('pushState', pushState);

module.exports = {
  restoreState: restoreState,
  pushState: pushState
};



},{"../oj":58}],68:[function(require,module,exports){
(function (global){
var $, IS, OJ, _;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

_ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

IS = (function() {
  function IS() {}

  IS.bool = function(boolean) {
    return _.isBoolean(boolean);
  };

  IS.arrayNullOrEmpty = function(arr) {
    return _.isEmpty(arr);
  };

  IS.stringNullOrEmpty = function(str) {
    return str && (!str.length || str.length === 0 || !str.trim || !str.trim());
  };

  IS.numberNullOrEmpty = function(num) {
    return !num || isNaN(num) || !num.toPrecision;
  };

  IS.dateNullOrEmpty = function(dt) {
    return !dt || !dt.getTime;
  };

  IS.objectNullOrEmpty = function(obj) {
    return _.isEmpty(obj || !Object.keys(obj) || Object.keys(obj).length === 0);
  };

  IS.plainObject = function(obj) {
    return _.isPlainObject(obj);
  };

  IS.object = function(obj) {
    return _.isObject(obj);
  };

  IS.date = function(dt) {
    return _.isDate(dt);
  };


  /*
  Determines if a value is an instance of a Number and not NaN*
   */

  IS.number = function(num) {
    var number;
    number = require('../core/number');
    return typeof num === 'number' && false === (number.isNaN(num) || false === number.isFinite(num) || number.MAX_VALUE === num || number.MIN_VALUE === num);
  };


  /*
  Determines if a value is convertible to a Number
   */

  IS.numeric = function(num) {
    var nuNum, ret, to;
    ret = this.number(num);
    if (!ret) {
      to = require('./to');
      nuNum = to.number(num);
      ret = this.number(nuNum);
    }
    return ret;
  };

  IS.elementInDom = function(elementId) {
    return false === this.nullOrEmpty(document.getElementById(elementId));
  };

  IS.array = function(obj) {
    return _.isArray(obj);
  };

  IS.string = function(str) {
    return _.isString(str);
  };

  IS["true"] = function(obj) {
    return obj === true || obj === 'true' || obj === 1 || obj === '1';
  };

  IS["false"] = function(obj) {
    return obj === false || obj === 'false' || obj === 0 || obj === '0';
  };

  IS.trueOrFalse = function(obj) {
    return this["true"](obj || this["false"](obj));
  };

  IS.nullOrEmpty = function(obj, checkLength) {
    return _.isEmpty(obj) || _.isUndefined(obj) || _.isNull(obj) || _.isNaN(obj);
  };

  IS.nullOrUndefined = function(obj, checkLength) {
    return _.isUndefined(obj) || _.isNull(obj) || _.isNaN(obj);
  };

  IS["instanceof"] = function(name, obj) {
    return obj.type === name || obj instanceof name;
  };

  IS.method = function(obj) {
    return obj !== OJ.noop && _.isFunction(obj);
  };


  /*
  Deprecated. Left for backwards compatibility. Use is.method instead.
   */

  IS.func = IS.method;

  return IS;

})();

OJ.register('is', IS);

module.exports = IS;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcaXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUVFOzs7RUFFSixFQUFDLENBQUEsSUFBRCxHQUFPLFNBQUMsT0FBRDtXQUNMLENBQUMsQ0FBQyxTQUFGLENBQVksT0FBWjtFQURLOztFQUdQLEVBQUMsQ0FBQSxnQkFBRCxHQUFtQixTQUFDLEdBQUQ7V0FDakIsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxHQUFWO0VBRGlCOztFQUduQixFQUFDLENBQUEsaUJBQUQsR0FBb0IsU0FBQyxHQUFEO1dBQ2xCLEdBQUEsSUFBUSxDQUFDLENBQUksR0FBRyxDQUFDLE1BQVIsSUFBa0IsR0FBRyxDQUFDLE1BQUosS0FBYyxDQUFoQyxJQUFxQyxDQUFJLEdBQUcsQ0FBQyxJQUE3QyxJQUFxRCxDQUFJLEdBQUcsQ0FBQyxJQUFKLENBQUEsQ0FBMUQ7RUFEVTs7RUFHcEIsRUFBQyxDQUFBLGlCQUFELEdBQW9CLFNBQUMsR0FBRDtXQUNsQixDQUFJLEdBQUosSUFBVyxLQUFBLENBQU0sR0FBTixDQUFYLElBQXlCLENBQUksR0FBRyxDQUFDO0VBRGY7O0VBR3BCLEVBQUMsQ0FBQSxlQUFELEdBQWtCLFNBQUMsRUFBRDtXQUNoQixDQUFJLEVBQUosSUFBVSxDQUFJLEVBQUUsQ0FBQztFQUREOztFQUdsQixFQUFDLENBQUEsaUJBQUQsR0FBb0IsU0FBQyxHQUFEO1dBQ2xCLENBQUMsQ0FBQyxPQUFGLENBQVUsR0FBQSxJQUFPLENBQUksTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLENBQVgsSUFBK0IsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLENBQWdCLENBQUMsTUFBakIsS0FBMkIsQ0FBcEU7RUFEa0I7O0VB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QWU7RUFEeEI7O0VBR2IsRUFBQyxDQUFBLE1BQUQsR0FBUyxTQUFDLEdBQUQ7V0FDUCxHQUFBLEtBQVMsRUFBRSxDQUFDLElBQVosSUFBcUIsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxHQUFiO0VBRGQ7OztBQUdUOzs7O0VBR0EsRUFBQyxDQUFBLElBQUQsR0FBUSxFQUFDLENBQUE7Ozs7OztBQUlYLEVBQUUsQ0FBQyxRQUFILENBQVksSUFBWixFQUFrQixFQUFsQjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiT0ogPSByZXF1aXJlICcuLi9vaidcclxuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuXHJcbmNsYXNzIElTXHJcblxyXG4gIEBib29sOiAoYm9vbGVhbikgLT5cclxuICAgIF8uaXNCb29sZWFuIGJvb2xlYW5cclxuXHJcbiAgQGFycmF5TnVsbE9yRW1wdHk6IChhcnIpIC0+XHJcbiAgICBfLmlzRW1wdHkgYXJyXHJcblxyXG4gIEBzdHJpbmdOdWxsT3JFbXB0eTogKHN0cikgLT5cclxuICAgIHN0ciBhbmQgKG5vdCBzdHIubGVuZ3RoIG9yIHN0ci5sZW5ndGggaXMgMCBvciBub3Qgc3RyLnRyaW0gb3Igbm90IHN0ci50cmltKCkpXHJcblxyXG4gIEBudW1iZXJOdWxsT3JFbXB0eTogKG51bSkgLT5cclxuICAgIG5vdCBudW0gb3IgaXNOYU4obnVtKSBvciBub3QgbnVtLnRvUHJlY2lzaW9uXHJcblxyXG4gIEBkYXRlTnVsbE9yRW1wdHk6IChkdCkgLT5cclxuICAgIG5vdCBkdCBvciBub3QgZHQuZ2V0VGltZVxyXG5cclxuICBAb2JqZWN0TnVsbE9yRW1wdHk6IChvYmopIC0+XHJcbiAgICBfLmlzRW1wdHkgb2JqIG9yIG5vdCBPYmplY3Qua2V5cyhvYmopIG9yIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoIGlzIDBcclxuXHJcbiAgQHBsYWluT2JqZWN0OiAob2JqKSAtPlxyXG4gICAgXy5pc1BsYWluT2JqZWN0IG9ialxyXG5cclxuICBAb2JqZWN0OiAob2JqKSAtPlxyXG4gICAgXy5pc09iamVjdCBvYmpcclxuXHJcbiAgQGRhdGU6IChkdCkgLT5cclxuICAgIF8uaXNEYXRlIGR0XHJcblxyXG5cclxuICAjIyNcclxuICBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgYW4gaW5zdGFuY2Ugb2YgYSBOdW1iZXIgYW5kIG5vdCBOYU4qXHJcbiAgIyMjXHJcbiAgQG51bWJlcjogKG51bSkgLT5cclxuICAgIG51bWJlciA9IHJlcXVpcmUgJy4uL2NvcmUvbnVtYmVyJ1xyXG4gICAgdHlwZW9mIG51bSBpcyAnbnVtYmVyJyBhbmQgZmFsc2UgaXMgKG51bWJlci5pc05hTihudW0pIG9yIGZhbHNlIGlzIG51bWJlci5pc0Zpbml0ZShudW0pIG9yIG51bWJlci5NQVhfVkFMVUUgaXMgbnVtIG9yIG51bWJlci5NSU5fVkFMVUUgaXMgbnVtKVxyXG5cclxuICAjIyNcclxuICBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgY29udmVydGlibGUgdG8gYSBOdW1iZXJcclxuICAjIyNcclxuICBAbnVtZXJpYzogKG51bSkgLT5cclxuICAgIHJldCA9IEBudW1iZXIobnVtKVxyXG4gICAgdW5sZXNzIHJldFxyXG4gICAgICB0byA9IHJlcXVpcmUgJy4vdG8nXHJcbiAgICAgIG51TnVtID0gdG8ubnVtYmVyKG51bSlcclxuICAgICAgcmV0ID0gQG51bWJlcihudU51bSlcclxuICAgIHJldFxyXG5cclxuICBAZWxlbWVudEluRG9tOiAoZWxlbWVudElkKSAtPlxyXG4gICAgZmFsc2UgaXMgQG51bGxPckVtcHR5KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCkpXHJcblxyXG4gIEBhcnJheTogKG9iaikgLT5cclxuICAgIF8uaXNBcnJheSBvYmpcclxuXHJcbiAgQHN0cmluZzogKHN0cikgLT5cclxuICAgIF8uaXNTdHJpbmcgc3RyXHJcblxyXG4gIEB0cnVlOiAob2JqKSAtPlxyXG4gICAgb2JqIGlzIHRydWUgb3Igb2JqIGlzICd0cnVlJyBvciBvYmogaXMgMSBvciBvYmogaXMgJzEnXHJcblxyXG4gIEBmYWxzZTogKG9iaikgLT5cclxuICAgIG9iaiBpcyBmYWxzZSBvciBvYmogaXMgJ2ZhbHNlJyBvciBvYmogaXMgMCBvciBvYmogaXMgJzAnXHJcblxyXG4gIEB0cnVlT3JGYWxzZTogKG9iaikgLT5cclxuICAgIEB0cnVlIG9iaiBvciBAZmFsc2Ugb2JqXHJcblxyXG4gIEBudWxsT3JFbXB0eTogKG9iaiwgY2hlY2tMZW5ndGgpIC0+XHJcbiAgICBfLmlzRW1wdHkob2JqKSBvciBfLmlzVW5kZWZpbmVkKG9iaikgb3IgXy5pc051bGwob2JqKSBvciBfLmlzTmFOKG9iailcclxuXHJcbiAgQG51bGxPclVuZGVmaW5lZDogKG9iaiwgY2hlY2tMZW5ndGgpIC0+XHJcbiAgICBfLmlzVW5kZWZpbmVkKG9iaikgb3IgXy5pc051bGwob2JqKSBvciBfLmlzTmFOKG9iailcclxuXHJcbiAgQGluc3RhbmNlb2Y6IChuYW1lLCBvYmopIC0+XHJcbiAgICBvYmoudHlwZSBpcyBuYW1lIG9yIG9iaiBpbnN0YW5jZW9mIG5hbWVcclxuXHJcbiAgQG1ldGhvZDogKG9iaikgLT5cclxuICAgIG9iaiBpc250IE9KLm5vb3AgYW5kIF8uaXNGdW5jdGlvbiBvYmpcclxuXHJcbiAgIyMjXHJcbiAgRGVwcmVjYXRlZC4gTGVmdCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIFVzZSBpcy5tZXRob2QgaW5zdGVhZC5cclxuICAjIyNcclxuICBAZnVuYyA9IEBtZXRob2RcclxuXHJcblxyXG5cclxuT0oucmVnaXN0ZXIgJ2lzJywgSVNcclxubW9kdWxlLmV4cG9ydHMgPSBJU1xyXG5cclxuIl19
},{"../core/number":11,"../oj":58,"./to":73}],69:[function(require,module,exports){
(function (global){
var OJ, makeNoty, noty;

OJ = require('../oj');

noty = (typeof window !== "undefined" ? window['noty'] : typeof global !== "undefined" ? global['noty'] : null);

makeNoty = function(options, owner) {
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
};

OJ.notifications.register('noty', makeNoty);

module.exports = makeNoty;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcbm90eS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOztBQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7QUFHUCxRQUFBLEdBQVcsU0FBQyxPQUFELEVBQVUsS0FBVjtBQUNULE1BQUE7RUFBQSxRQUFBLEdBQ0U7SUFBQSxNQUFBLEVBQVEsVUFBUjtJQUNBLEtBQUEsRUFBTyxjQURQO0lBRUEsSUFBQSxFQUFNLE9BRk47SUFHQSxJQUFBLEVBQU0sRUFITjtJQUlBLFlBQUEsRUFBYyxJQUpkO0lBS0EsUUFBQSxFQUFVLCtGQUxWO0lBTUEsU0FBQSxFQUNJO01BQUEsSUFBQSxFQUNFO1FBQUEsTUFBQSxFQUFRLFFBQVI7T0FERjtNQUVBLEtBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxRQUFSO09BSEY7TUFJQSxNQUFBLEVBQVEsT0FKUjtNQUtBLEtBQUEsRUFBTyxHQUxQO0tBUEo7SUFhQSxPQUFBLEVBQVMsSUFiVDtJQWNBLEtBQUEsRUFBTyxLQWRQO0lBZUEsS0FBQSxFQUFPLEtBZlA7SUFnQkEsVUFBQSxFQUFZLENBaEJaO0lBaUJBLE1BQUEsRUFBUSxLQWpCUjtJQWtCQSxTQUFBLEVBQVcsQ0FBQyxPQUFELENBbEJYO0lBbUJBLFFBQUEsRUFDSTtNQUFBLE1BQUEsRUFBUSxFQUFFLENBQUMsSUFBWDtNQUNBLFNBQUEsRUFBVyxFQUFFLENBQUMsSUFEZDtNQUVBLE9BQUEsRUFBUyxFQUFFLENBQUMsSUFGWjtNQUdBLFVBQUEsRUFBWSxFQUFFLENBQUMsSUFIZjtLQXBCSjtJQXdCQSxPQUFBLEVBQVMsS0F4QlQ7O0VBMEJGLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QjtFQUNBLEdBQUEsR0FBTSxJQUFBLENBQUssUUFBTDtTQUVOO0FBL0JTOztBQWlDWCxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQWpCLENBQTBCLE1BQTFCLEVBQWtDLFFBQWxDOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub3R5ID0gcmVxdWlyZSAnbm90eSdcclxuXHJcbiAgXHJcbm1ha2VOb3R5ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxyXG4gIGRlZmF1bHRzID1cclxuICAgIGxheW91dDogJ3RvcFJpZ2h0J1xyXG4gICAgdGhlbWU6ICdkZWZhdWx0VGhlbWUnXHJcbiAgICB0eXBlOiAnYWxlcnQnXHJcbiAgICB0ZXh0OiAnJyAjY2FuIGJlIGh0bWwgb3Igc3RyaW5nXHJcbiAgICBkaXNtaXNzUXVldWU6IHRydWUgI0lmIHlvdSB3YW50IHRvIHVzZSBxdWV1ZSBmZWF0dXJlIHNldCB0aGlzIHRydWVcclxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm5vdHlfbWVzc2FnZVwiPjxzcGFuIGNsYXNzPVwibm90eV90ZXh0XCI+PC9zcGFuPjxkaXYgY2xhc3M9XCJub3R5X2Nsb3NlXCI+PC9kaXY+PC9kaXY+JyxcclxuICAgIGFuaW1hdGlvbjogXHJcbiAgICAgICAgb3BlbjogXHJcbiAgICAgICAgICBoZWlnaHQ6ICd0b2dnbGUnXHJcbiAgICAgICAgY2xvc2U6IFxyXG4gICAgICAgICAgaGVpZ2h0OiAndG9nZ2xlJ1xyXG4gICAgICAgIGVhc2luZzogJ3N3aW5nJ1xyXG4gICAgICAgIHNwZWVkOiA1MDAgI29wZW5pbmcgJiBjbG9zaW5nIGFuaW1hdGlvbiBzcGVlZFxyXG4gICAgdGltZW91dDogNTAwMCAjZGVsYXkgZm9yIGNsb3NpbmcgZXZlbnQuIFNldCBmYWxzZSBmb3Igc3RpY2t5IG5vdGlmaWNhdGlvbnNcclxuICAgIGZvcmNlOiBmYWxzZSAjYWRkcyBub3RpZmljYXRpb24gdG8gdGhlIGJlZ2lubmluZyBvZiBxdWV1ZSB3aGVuIHNldCB0byB0cnVlXHJcbiAgICBtb2RhbDogZmFsc2VcclxuICAgIG1heFZpc2libGU6IDUgI3lvdSBjYW4gc2V0IG1heCB2aXNpYmxlIG5vdGlmaWNhdGlvbiBmb3IgZGlzbWlzc1F1ZXVlIHRydWUgb3B0aW9uLFxyXG4gICAga2lsbGVyOiBmYWxzZSAjZm9yIGNsb3NlIGFsbCBub3RpZmljYXRpb25zIGJlZm9yZSBzaG93XHJcbiAgICBjbG9zZVdpdGg6IFsnY2xpY2snXSAgI1snY2xpY2snLCAnYnV0dG9uJywgJ2hvdmVyJ11cclxuICAgIGNhbGxiYWNrOiBcclxuICAgICAgICBvblNob3c6IE9KLm5vb3AsXHJcbiAgICAgICAgYWZ0ZXJTaG93OiBPSi5ub29wXHJcbiAgICAgICAgb25DbG9zZTogT0oubm9vcFxyXG4gICAgICAgIGFmdGVyQ2xvc2U6IE9KLm5vb3BcclxuICAgIGJ1dHRvbnM6IGZhbHNlICNhbiBhcnJheSBvZiBidXR0b25zXHJcbiAgICBcclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBub3R5IGRlZmF1bHRzXHJcbiAgICAgIFxyXG4gIHJldFxyXG4gICAgXHJcbk9KLm5vdGlmaWNhdGlvbnMucmVnaXN0ZXIgJ25vdHknLCBtYWtlTm90eVxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2VOb3R5Il19
},{"../oj":58}],70:[function(require,module,exports){
(function (global){
var OJ, PubSub, events, ps, subscribers, tokens;

OJ = require('../oj');

PubSub = (typeof window !== "undefined" ? window['PubSub'] : typeof global !== "undefined" ? global['PubSub'] : null);

tokens = {};

subscribers = [];

events = {};

ps = {
  getEventName: function(event) {
    return event.toUpperCase().replace(' ', '_');
  },
  subscribe: function(event, method) {
    var eventName, token;
    eventName = ps.getEventName(event);
    if (!events[eventName]) {
      events[eventName] = [];
    }
    token = PubSub.subscribe(eventName, method);
    tokens[token] = token;
    subscribers.push(method);
    events[eventName].push(method);
    return token;
  },
  publish: function(event, data) {
    var eventName;
    eventName = ps.getEventName(event);
    if (events[eventName]) {
      PubSub.publish(eventName, data);
    } else {
      OJ.console.info('Event named {' + event + '} is not recognized.');
    }
  },
  unsubscribe: function(tokenOrMethod) {
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
  },
  unsubscribeAll: function() {
    OJ.each(tokens, function(token) {
      return unsubscribe(token);
    });
    subscribers = [];
    events = {};
  },
  unsubscribeEvent: function(event) {
    var eventName;
    eventName = ps.getEventName(event);
    if (events[eventName]) {
      OJ.each(events[eventName], function(method) {
        return unsubscribe(method);
      });
    } else {
      OJ.console.info('Event named {' + event + '} is not recognized.');
    }
    delete events[eventName];
  }
};

Object.seal(ps);

Object.freeze(ps);

OJ.register('getEventName', ps.getEventName);

OJ.register('publish', ps.publish);

OJ.register('subscribe', ps.subscribe);

OJ.register('unsubscribe', ps.unsubscribe);

OJ.register('unsubscribeAll', ps.unsubscribeAll);

OJ.register('unsubscribeEvent', ps.unsubscribeEvent);

module.exports = ps;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xccHVic3ViLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsTUFBQSxHQUFTLE9BQUEsQ0FBUSxXQUFSOztBQUVULE1BQUEsR0FBUzs7QUFDVCxXQUFBLEdBQWM7O0FBQ2QsTUFBQSxHQUFTOztBQUVULEVBQUEsR0FDRTtFQUFBLFlBQUEsRUFBYyxTQUFDLEtBQUQ7V0FDWixLQUFLLENBQUMsV0FBTixDQUFBLENBQW1CLENBQUMsT0FBcEIsQ0FBNEIsR0FBNUIsRUFBaUMsR0FBakM7RUFEWSxDQUFkO0VBR0EsU0FBQSxFQUFXLFNBQUMsS0FBRCxFQUFRLE1BQVI7QUFDVCxRQUFBO0lBQUEsU0FBQSxHQUFZLEVBQUUsQ0FBQyxZQUFILENBQWdCLEtBQWhCO0lBQ1osSUFBRyxDQUFJLE1BQU8sQ0FBQSxTQUFBLENBQWQ7TUFBOEIsTUFBTyxDQUFBLFNBQUEsQ0FBUCxHQUFvQixHQUFsRDs7SUFFQSxLQUFBLEdBQVEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsU0FBakIsRUFBNEIsTUFBNUI7SUFDUixNQUFPLENBQUEsS0FBQSxDQUFQLEdBQWdCO0lBQ2hCLFdBQVcsQ0FBQyxJQUFaLENBQWlCLE1BQWpCO0lBQ0EsTUFBTyxDQUFBLFNBQUEsQ0FBVSxDQUFDLElBQWxCLENBQXVCLE1BQXZCO1dBQ0E7RUFSUyxDQUhYO0VBYUEsT0FBQSxFQUFTLFNBQUMsS0FBRCxFQUFRLElBQVI7QUFDUCxRQUFBO0lBQUEsU0FBQSxHQUFZLEVBQUUsQ0FBQyxZQUFILENBQWdCLEtBQWhCO0lBQ1osSUFBRyxNQUFPLENBQUEsU0FBQSxDQUFWO01BQ0UsTUFBTSxDQUFDLE9BQVAsQ0FBZSxTQUFmLEVBQTBCLElBQTFCLEVBREY7S0FBQSxNQUFBO01BR0UsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFYLENBQWdCLGVBQUEsR0FBa0IsS0FBbEIsR0FBMEIsc0JBQTFDLEVBSEY7O0VBRk8sQ0FiVDtFQXFCQSxXQUFBLEVBQWEsU0FBQyxhQUFEO0lBQ1gsSUFBRyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU4sQ0FBYSxhQUFiLENBQUg7TUFDRSxJQUFHLENBQUMsQ0FBRCxLQUFRLFdBQVcsQ0FBQyxPQUFaLENBQW9CLGFBQXBCLENBQVg7UUFDRSxNQUFNLENBQUMsV0FBUCxDQUFtQixhQUFuQjtRQUNBLFdBQUEsR0FBYyxDQUFDLENBQUMsTUFBRixDQUFTLFdBQVQsRUFBc0IsU0FBQyxNQUFEO2lCQUFZLE1BQUEsS0FBVTtRQUF0QixDQUF0QixFQUZoQjtPQUFBLE1BQUE7UUFJRSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQVgsQ0FBZ0IsaUNBQWhCLEVBSkY7T0FERjtLQUFBLE1BQUE7TUFPRSxJQUFHLE1BQU8sQ0FBQSxhQUFBLENBQVY7UUFDRSxNQUFNLENBQUMsV0FBUCxDQUFtQixhQUFuQjtRQUNBLE9BQU8sTUFBTyxDQUFBLGFBQUEsRUFGaEI7T0FQRjs7RUFEVyxDQXJCYjtFQWtDQSxjQUFBLEVBQWdCLFNBQUE7SUFDZCxFQUFFLENBQUMsSUFBSCxDQUFRLE1BQVIsRUFBZ0IsU0FBQyxLQUFEO2FBQVcsV0FBQSxDQUFZLEtBQVo7SUFBWCxDQUFoQjtJQUNBLFdBQUEsR0FBYztJQUNkLE1BQUEsR0FBUztFQUhLLENBbENoQjtFQXdDQSxnQkFBQSxFQUFrQixTQUFDLEtBQUQ7QUFDaEIsUUFBQTtJQUFBLFNBQUEsR0FBWSxFQUFFLENBQUMsWUFBSCxDQUFnQixLQUFoQjtJQUNaLElBQUcsTUFBTyxDQUFBLFNBQUEsQ0FBVjtNQUNFLEVBQUUsQ0FBQyxJQUFILENBQVEsTUFBTyxDQUFBLFNBQUEsQ0FBZixFQUEyQixTQUFDLE1BQUQ7ZUFBWSxXQUFBLENBQVksTUFBWjtNQUFaLENBQTNCLEVBREY7S0FBQSxNQUFBO01BR0UsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFYLENBQWdCLGVBQUEsR0FBa0IsS0FBbEIsR0FBMEIsc0JBQTFDLEVBSEY7O0lBSUEsT0FBTyxNQUFPLENBQUEsU0FBQTtFQU5FLENBeENsQjs7O0FBaURGLE1BQU0sQ0FBQyxJQUFQLENBQVksRUFBWjs7QUFDQSxNQUFNLENBQUMsTUFBUCxDQUFjLEVBQWQ7O0FBRUEsRUFBRSxDQUFDLFFBQUgsQ0FBWSxjQUFaLEVBQTRCLEVBQUUsQ0FBQyxZQUEvQjs7QUFDQSxFQUFFLENBQUMsUUFBSCxDQUFZLFNBQVosRUFBdUIsRUFBRSxDQUFDLE9BQTFCOztBQUNBLEVBQUUsQ0FBQyxRQUFILENBQVksV0FBWixFQUF5QixFQUFFLENBQUMsU0FBNUI7O0FBQ0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxhQUFaLEVBQTJCLEVBQUUsQ0FBQyxXQUE5Qjs7QUFDQSxFQUFFLENBQUMsUUFBSCxDQUFZLGdCQUFaLEVBQThCLEVBQUUsQ0FBQyxjQUFqQzs7QUFDQSxFQUFFLENBQUMsUUFBSCxDQUFZLGtCQUFaLEVBQWdDLEVBQUUsQ0FBQyxnQkFBbkM7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblB1YlN1YiA9IHJlcXVpcmUgJ3B1YnN1Yi1qcydcclxuXHJcbnRva2VucyA9IHt9XHJcbnN1YnNjcmliZXJzID0gW11cclxuZXZlbnRzID0ge31cclxuXHJcbnBzID0gXHJcbiAgZ2V0RXZlbnROYW1lOiAoZXZlbnQpIC0+XHJcbiAgICBldmVudC50b1VwcGVyQ2FzZSgpLnJlcGxhY2UgJyAnLCAnXydcclxuXHJcbiAgc3Vic2NyaWJlOiAoZXZlbnQsIG1ldGhvZCkgLT5cclxuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZSBldmVudFxyXG4gICAgaWYgbm90IGV2ZW50c1tldmVudE5hbWVdIHRoZW4gZXZlbnRzW2V2ZW50TmFtZV0gPSBbXVxyXG5cclxuICAgIHRva2VuID0gUHViU3ViLnN1YnNjcmliZSBldmVudE5hbWUsIG1ldGhvZFxyXG4gICAgdG9rZW5zW3Rva2VuXSA9IHRva2VuXHJcbiAgICBzdWJzY3JpYmVycy5wdXNoIG1ldGhvZFxyXG4gICAgZXZlbnRzW2V2ZW50TmFtZV0ucHVzaCBtZXRob2RcclxuICAgIHRva2VuXHJcblxyXG4gIHB1Ymxpc2g6IChldmVudCwgZGF0YSkgLT5cclxuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZSBldmVudFxyXG4gICAgaWYgZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgICAgUHViU3ViLnB1Ymxpc2ggZXZlbnROYW1lLCBkYXRhXHJcbiAgICBlbHNlXHJcbiAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbmFtZWQgeycgKyBldmVudCArICd9IGlzIG5vdCByZWNvZ25pemVkLidcclxuICAgIHJldHVyblxyXG5cclxuICB1bnN1YnNjcmliZTogKHRva2VuT3JNZXRob2QpIC0+XHJcbiAgICBpZiBPSi5pcy5tZXRob2QgdG9rZW5Pck1ldGhvZFxyXG4gICAgICBpZiAtMSBpc250IHN1YnNjcmliZXJzLmluZGV4T2YgdG9rZW5Pck1ldGhvZFxyXG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSB0b2tlbk9yTWV0aG9kXHJcbiAgICAgICAgc3Vic2NyaWJlcnMgPSBfLnJlbW92ZSBzdWJzY3JpYmVycywgKG1ldGhvZCkgLT4gbWV0aG9kIGlzIHRva2VuT3JNZXRob2RcclxuICAgICAgZWxzZVxyXG4gICAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbWV0aG9kIGlzIG5vdCByZWNvZ25pemVkLidcclxuICAgIGVsc2VcclxuICAgICAgaWYgdG9rZW5zW3Rva2VuT3JNZXRob2RdXHJcbiAgICAgICAgUHViU3ViLnVuc3Vic2NyaWJlIHRva2VuT3JNZXRob2RcclxuICAgICAgICBkZWxldGUgdG9rZW5zW3Rva2VuT3JNZXRob2RdXHJcbiAgICByZXR1cm5cclxuXHJcbiAgdW5zdWJzY3JpYmVBbGw6ICgpIC0+XHJcbiAgICBPSi5lYWNoIHRva2VucywgKHRva2VuKSAtPiB1bnN1YnNjcmliZSB0b2tlblxyXG4gICAgc3Vic2NyaWJlcnMgPSBbXVxyXG4gICAgZXZlbnRzID0ge31cclxuICAgIHJldHVyblxyXG5cclxuICB1bnN1YnNjcmliZUV2ZW50OiAoZXZlbnQpIC0+XHJcbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUgZXZlbnRcclxuICAgIGlmIGV2ZW50c1tldmVudE5hbWVdXHJcbiAgICAgIE9KLmVhY2ggZXZlbnRzW2V2ZW50TmFtZV0sIChtZXRob2QpIC0+IHVuc3Vic2NyaWJlIG1ldGhvZFxyXG4gICAgZWxzZVxyXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0V2ZW50IG5hbWVkIHsnICsgZXZlbnQgKyAnfSBpcyBub3QgcmVjb2duaXplZC4nXHJcbiAgICBkZWxldGUgZXZlbnRzW2V2ZW50TmFtZV1cclxuICAgIHJldHVyblxyXG5cclxuT2JqZWN0LnNlYWwgcHNcclxuT2JqZWN0LmZyZWV6ZSBwc1xyXG5cclxuT0oucmVnaXN0ZXIgJ2dldEV2ZW50TmFtZScsIHBzLmdldEV2ZW50TmFtZVxyXG5PSi5yZWdpc3RlciAncHVibGlzaCcsIHBzLnB1Ymxpc2hcclxuT0oucmVnaXN0ZXIgJ3N1YnNjcmliZScsIHBzLnN1YnNjcmliZVxyXG5PSi5yZWdpc3RlciAndW5zdWJzY3JpYmUnLCBwcy51bnN1YnNjcmliZVxyXG5PSi5yZWdpc3RlciAndW5zdWJzY3JpYmVBbGwnLCBwcy51bnN1YnNjcmliZUFsbFxyXG5PSi5yZWdpc3RlciAndW5zdWJzY3JpYmVFdmVudCcsIHBzLnVuc3Vic2NyaWJlRXZlbnRcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcHMiXX0=
},{"../oj":58}],71:[function(require,module,exports){
var OJ, queryString;

OJ = require('../oj');


/*
http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 */

queryString = function(param) {
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
};

OJ.register('queryString', queryString);

module.exports = queryString;



},{"../oj":58}],72:[function(require,module,exports){
(function (global){
var OJ, _, each, obj, rng,
  slice = [].slice;

OJ = require('../oj');

_ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

obj = require('../core/object');

each = require('./each');

rng = {
  range: function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return _.range.apply(_, params);
  },
  rangeMin: function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return _.min.apply(_, params);
  },
  rangeMax: function() {
    var params;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return _.max.apply(_, params);
  },

  /*
  Take an array of string values and a number of partitions to create.
  Uses the first letter of each string value in the array to convert to unique code character (lower case)
  Builds a int range based on unique code chars.
   */
  stringToSubRanges: function(n, range) {
    var charRange, i, oldGetRange, ret, subRange;
    if (n == null) {
      n = 6;
    }
    if (range == null) {
      range = [];
    }
    charRange = [];
    each(range, function(val) {
      var char;
      char = val.trim()[0].toLowerCase();
      if (false === obj.contains(charRange, char)) {
        return charRange.push(char.charCodeAt());
      }
    });
    ret = rng.toSubRanges(n, charRange);
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
  },

  /*
  Take an array of int values and a number of partitions to create.
  Divides the original array into the specified number of sub arrays.
  Overflow is passed to the final partition.
   */
  toSubRanges: function(n, range) {
    var chunkVal, distance, i, jump, map, rangeHigh, rangeLow, ret, subRange, subRangeSize, subRanges;
    if (n == null) {
      n = 6;
    }
    if (range == null) {
      range = [];
    }
    ret = obj.object();
    rangeLow = rng.rangeMin(range);
    rangeHigh = rng.rangeMax(range);
    distance = rangeHigh - rangeLow;
    subRangeSize = distance / n;
    subRanges = ret.add('ranges', obj.object());
    chunkVal = rangeLow;
    map = obj.object();
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
      subRange = rng.range(chunkVal, chunkVal + jump);
      each(subRange, function(val) {
        return map.add(val, i);
      });
      subRanges[i] = subRange;
      chunkVal += jump;
    }
    ret.add('getRange', function(val) {
      return map[val];
    });
    return ret;
  }
};

Object.seal(rng);

Object.freeze(rng);

OJ.register('ranges', rng);

module.exports = rng;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xccmFuZ2VzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQSxxQkFBQTtFQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osR0FBQSxHQUFNLE9BQUEsQ0FBUSxnQkFBUjs7QUFDTixJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0FBSVAsR0FBQSxHQUlFO0VBQUEsS0FBQSxFQUFPLFNBQUE7QUFDTCxRQUFBO0lBRE07V0FDTixDQUFDLENBQUMsS0FBRixVQUFRLE1BQVI7RUFESyxDQUFQO0VBS0EsUUFBQSxFQUFVLFNBQUE7QUFDUixRQUFBO0lBRFM7V0FDVCxDQUFDLENBQUMsR0FBRixVQUFNLE1BQU47RUFEUSxDQUxWO0VBVUEsUUFBQSxFQUFVLFNBQUE7QUFDUixRQUFBO0lBRFM7V0FDVCxDQUFDLENBQUMsR0FBRixVQUFNLE1BQU47RUFEUSxDQVZWOztBQWNBOzs7OztFQUtBLGlCQUFBLEVBQW1CLFNBQUMsQ0FBRCxFQUFRLEtBQVI7QUFDakIsUUFBQTs7TUFEa0IsSUFBSTs7O01BQUcsUUFBUTs7SUFDakMsU0FBQSxHQUFZO0lBR1osSUFBQSxDQUFLLEtBQUwsRUFBWSxTQUFDLEdBQUQ7QUFDVixVQUFBO01BQUEsSUFBQSxHQUFPLEdBQUcsQ0FBQyxJQUFKLENBQUEsQ0FBVyxDQUFBLENBQUEsQ0FBRSxDQUFDLFdBQWQsQ0FBQTtNQUNQLElBQUcsS0FBQSxLQUFTLEdBQUcsQ0FBQyxRQUFKLENBQWEsU0FBYixFQUF3QixJQUF4QixDQUFaO2VBQ0UsU0FBUyxDQUFDLElBQVYsQ0FBZSxJQUFJLENBQUMsVUFBTCxDQUFBLENBQWYsRUFERjs7SUFGVSxDQUFaO0lBS0EsR0FBQSxHQUFNLEdBQUcsQ0FBQyxXQUFKLENBQWdCLENBQWhCLEVBQW1CLFNBQW5CO0lBRU4sQ0FBQSxHQUFJO0FBQ0osV0FBTSxDQUFBLEdBQUksQ0FBVjtNQUNFLENBQUEsSUFBSztNQUNMLFFBQUEsR0FBVyxHQUFJLENBQUEsQ0FBQTtNQUNmLFFBQVEsQ0FBQyxHQUFULENBQWEsTUFBTSxDQUFDLFlBQXBCO0lBSEY7SUFLQSxXQUFBLEdBQWMsR0FBRyxDQUFDO0lBQ2xCLEdBQUcsQ0FBQyxRQUFKLEdBQWUsU0FBQyxHQUFEO0FBQ2IsVUFBQTtNQUFBLElBQUEsR0FBTyxHQUFHLENBQUMsSUFBSixDQUFBLENBQVcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFkLENBQUEsQ0FBMkIsQ0FBQyxVQUE1QixDQUFBO01BQ1AsR0FBQSxHQUFNLFdBQUEsQ0FBWSxJQUFaO2FBQ047SUFIYTtXQUlmO0VBdEJpQixDQW5CbkI7O0FBNENBOzs7OztFQUtBLFdBQUEsRUFBYSxTQUFDLENBQUQsRUFBUSxLQUFSO0FBQ1gsUUFBQTs7TUFEWSxJQUFJOzs7TUFBRyxRQUFROztJQUMzQixHQUFBLEdBQU0sR0FBRyxDQUFDLE1BQUosQ0FBQTtJQUNOLFFBQUEsR0FBVyxHQUFHLENBQUMsUUFBSixDQUFhLEtBQWI7SUFDWCxTQUFBLEdBQVksR0FBRyxDQUFDLFFBQUosQ0FBYSxLQUFiO0lBRVosUUFBQSxHQUFXLFNBQUEsR0FBWTtJQUN2QixZQUFBLEdBQWUsUUFBQSxHQUFTO0lBQ3hCLFNBQUEsR0FBWSxHQUFHLENBQUMsR0FBSixDQUFRLFFBQVIsRUFBa0IsR0FBRyxDQUFDLE1BQUosQ0FBQSxDQUFsQjtJQUNaLFFBQUEsR0FBVztJQUVYLEdBQUEsR0FBTSxHQUFHLENBQUMsTUFBSixDQUFBO0lBRU4sQ0FBQSxHQUFJO0FBQ0osV0FBTSxDQUFBLEdBQUksQ0FBVjtNQUNFLENBQUEsSUFBSztNQUNMLElBQUcsQ0FBQSxHQUFJLENBQVA7UUFBYyxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxZQUFYLEVBQXJCO09BQUEsTUFBQTtRQUVFLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLFlBQVg7UUFDUCxJQUFHLFFBQUEsR0FBVyxJQUFYLElBQW1CLFNBQXRCO1VBQ0UsSUFBQSxJQUFRLFNBQUEsR0FBWSxRQUFaLEdBQXVCLElBQXZCLEdBQThCLEVBRHhDO1NBSEY7O01BTUEsUUFBQSxHQUFXLEdBQUcsQ0FBQyxLQUFKLENBQVUsUUFBVixFQUFvQixRQUFBLEdBQVcsSUFBL0I7TUFDWCxJQUFBLENBQUssUUFBTCxFQUFlLFNBQUMsR0FBRDtlQUFTLEdBQUcsQ0FBQyxHQUFKLENBQVEsR0FBUixFQUFhLENBQWI7TUFBVCxDQUFmO01BQ0EsU0FBVSxDQUFBLENBQUEsQ0FBVixHQUFlO01BQ2YsUUFBQSxJQUFZO0lBWGQ7SUFhQSxHQUFHLENBQUMsR0FBSixDQUFRLFVBQVIsRUFBb0IsU0FBQyxHQUFEO2FBQ2xCLEdBQUksQ0FBQSxHQUFBO0lBRGMsQ0FBcEI7V0FHQTtFQTdCVyxDQWpEYjs7O0FBZ0ZGLE1BQU0sQ0FBQyxJQUFQLENBQVksR0FBWjs7QUFDQSxNQUFNLENBQUMsTUFBUCxDQUFjLEdBQWQ7O0FBRUEsRUFBRSxDQUFDLFFBQUgsQ0FBWSxRQUFaLEVBQXNCLEdBQXRCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuZWFjaCA9IHJlcXVpcmUgJy4vZWFjaCdcclxuXHJcbiMgIyByYW5nZXNcclxuXHJcbnJuZyA9XHJcblxyXG4gICMgIyMgcmFuZ2VcclxuICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI3JhbmdlKSdzIGByYW5nZWAgbWV0aG9kXHJcbiAgcmFuZ2U6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBfLnJhbmdlIHBhcmFtcy4uLlxyXG5cclxuICAjICMjIHJhbmdlTWluXHJcbiAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNtaW4pJ3MgYG1pbmAgbWV0aG9kXHJcbiAgcmFuZ2VNaW46IChwYXJhbXMuLi4pIC0+XHJcbiAgICBfLm1pbiBwYXJhbXMuLi5cclxuXHJcbiAgIyAjIyByYW5nZU1heFxyXG4gICMgVXNpbmcgW0xvLURhc2hdKGh0dHA6Ly9sb2Rhc2guY29tL2RvY3MjbWF4KSdzIGBtYXhgIG1ldGhvZFxyXG4gIHJhbmdlTWF4OiAocGFyYW1zLi4uKSAtPlxyXG4gICAgXy5tYXggcGFyYW1zLi4uXHJcblxyXG4gICMgIyMgc3RyaW5nUmFuZ2VUb1N1YlJhbmdlc1xyXG4gICMjI1xyXG4gIFRha2UgYW4gYXJyYXkgb2Ygc3RyaW5nIHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXHJcbiAgVXNlcyB0aGUgZmlyc3QgbGV0dGVyIG9mIGVhY2ggc3RyaW5nIHZhbHVlIGluIHRoZSBhcnJheSB0byBjb252ZXJ0IHRvIHVuaXF1ZSBjb2RlIGNoYXJhY3RlciAobG93ZXIgY2FzZSlcclxuICBCdWlsZHMgYSBpbnQgcmFuZ2UgYmFzZWQgb24gdW5pcXVlIGNvZGUgY2hhcnMuXHJcbiAgIyMjXHJcbiAgc3RyaW5nVG9TdWJSYW5nZXM6IChuID0gNiwgcmFuZ2UgPSBbXSkgLT5cclxuICAgIGNoYXJSYW5nZSA9IFtdXHJcblxyXG5cclxuICAgIGVhY2ggcmFuZ2UsICh2YWwpIC0+XHJcbiAgICAgIGNoYXIgPSB2YWwudHJpbSgpWzBdLnRvTG93ZXJDYXNlKClcclxuICAgICAgaWYgZmFsc2UgaXMgb2JqLmNvbnRhaW5zIGNoYXJSYW5nZSwgY2hhclxyXG4gICAgICAgIGNoYXJSYW5nZS5wdXNoIGNoYXIuY2hhckNvZGVBdCgpXHJcblxyXG4gICAgcmV0ID0gcm5nLnRvU3ViUmFuZ2VzIG4sIGNoYXJSYW5nZVxyXG5cclxuICAgIGkgPSAwXHJcbiAgICB3aGlsZSBpIDwgblxyXG4gICAgICBpICs9IDFcclxuICAgICAgc3ViUmFuZ2UgPSByZXRbaV1cclxuICAgICAgc3ViUmFuZ2UubWFwIFN0cmluZy5mcm9tQ2hhckNvZGVcclxuXHJcbiAgICBvbGRHZXRSYW5nZSA9IHJldC5nZXRSYW5nZVxyXG4gICAgcmV0LmdldFJhbmdlID0gKHZhbCkgLT5cclxuICAgICAgY2hhciA9IHZhbC50cmltKClbMF0udG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KClcclxuICAgICAgaWR4ID0gb2xkR2V0UmFuZ2UgY2hhclxyXG4gICAgICBpZHhcclxuICAgIHJldFxyXG5cclxuICAjICMjIHJhbmdlVG9TdWJSYW5nZXNcclxuICAjIyNcclxuICBUYWtlIGFuIGFycmF5IG9mIGludCB2YWx1ZXMgYW5kIGEgbnVtYmVyIG9mIHBhcnRpdGlvbnMgdG8gY3JlYXRlLlxyXG4gIERpdmlkZXMgdGhlIG9yaWdpbmFsIGFycmF5IGludG8gdGhlIHNwZWNpZmllZCBudW1iZXIgb2Ygc3ViIGFycmF5cy5cclxuICBPdmVyZmxvdyBpcyBwYXNzZWQgdG8gdGhlIGZpbmFsIHBhcnRpdGlvbi5cclxuICAjIyNcclxuICB0b1N1YlJhbmdlczogKG4gPSA2LCByYW5nZSA9IFtdKSAtPlxyXG4gICAgcmV0ID0gb2JqLm9iamVjdCgpXHJcbiAgICByYW5nZUxvdyA9IHJuZy5yYW5nZU1pbiByYW5nZVxyXG4gICAgcmFuZ2VIaWdoID0gcm5nLnJhbmdlTWF4IHJhbmdlXHJcblxyXG4gICAgZGlzdGFuY2UgPSByYW5nZUhpZ2ggLSByYW5nZUxvd1xyXG4gICAgc3ViUmFuZ2VTaXplID0gZGlzdGFuY2UvblxyXG4gICAgc3ViUmFuZ2VzID0gcmV0LmFkZCAncmFuZ2VzJywgb2JqLm9iamVjdCgpXHJcbiAgICBjaHVua1ZhbCA9IHJhbmdlTG93XHJcblxyXG4gICAgbWFwID0gb2JqLm9iamVjdCgpXHJcblxyXG4gICAgaSA9IDBcclxuICAgIHdoaWxlIGkgPCBuXHJcbiAgICAgIGkgKz0gMVxyXG4gICAgICBpZiBpIDwgbiB0aGVuIGp1bXAgPSBNYXRoLnJvdW5kIHN1YlJhbmdlU2l6ZVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAganVtcCA9IE1hdGguZmxvb3Igc3ViUmFuZ2VTaXplXHJcbiAgICAgICAgaWYgY2h1bmtWYWwgKyBqdW1wIDw9IHJhbmdlSGlnaFxyXG4gICAgICAgICAganVtcCArPSByYW5nZUhpZ2ggLSBjaHVua1ZhbCAtIGp1bXAgKyAxXHJcblxyXG4gICAgICBzdWJSYW5nZSA9IHJuZy5yYW5nZSBjaHVua1ZhbCwgY2h1bmtWYWwgKyBqdW1wXHJcbiAgICAgIGVhY2ggc3ViUmFuZ2UsICh2YWwpIC0+IG1hcC5hZGQgdmFsLCBpXHJcbiAgICAgIHN1YlJhbmdlc1tpXSA9IHN1YlJhbmdlXHJcbiAgICAgIGNodW5rVmFsICs9IGp1bXBcclxuXHJcbiAgICByZXQuYWRkICdnZXRSYW5nZScsICh2YWwpIC0+XHJcbiAgICAgIG1hcFt2YWxdXHJcblxyXG4gICAgcmV0XHJcblxyXG5PYmplY3Quc2VhbCBybmdcclxuT2JqZWN0LmZyZWV6ZSBybmdcclxuXHJcbk9KLnJlZ2lzdGVyICdyYW5nZXMnLCBybmdcclxubW9kdWxlLmV4cG9ydHMgPSBybmdcclxuIl19
},{"../core/object":12,"../oj":58,"./each":65}],73:[function(require,module,exports){
(function (global){
var $, IS, OJ, TO, _;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window['$'] : typeof global !== "undefined" ? global['$'] : null);

_ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

IS = require('./is');

TO = (function() {
  function TO() {}

  TO.bool = function(str) {
    var retBool;
    retBool = IS['true'](str);
    if (retBool === false || retBool !== true) {
      retBool = false;
    }
    return retBool;
  };

  TO.ES5_ToBool = function(val) {
    return val !== false && val !== 0 && val !== '' && val !== null && typeof val !== 'undefined' && (typeof val !== 'number' || !isNaN(val));
  };

  TO.dateFromTicks = function(tickStr) {
    var arr, localOffset, offset, ret, ticks, ticsDateTime;
    ticsDateTime = this.string(tickStr);
    ret = void 0;
    ticks = void 0;
    offset = void 0;
    localOffset = void 0;
    arr = void 0;
    if (false === IS.nullOrEmpty(ticsDateTime)) {
      ticsDateTime = ticsDateTime.replace('/', '');
      ticsDateTime = ticsDateTime.replace('Date', '');
      ticsDateTime = ticsDateTime.replace('(', '');
      ticsDateTime = ticsDateTime.replace(')', '');
      arr = ticsDateTime.split('-');
      if (arr.length > 1) {
        ticks = this.number(arr[0]);
        offset = this.number(arr[1]);
        localOffset = new Date().getTimezoneOffset();
        ret = new Date(ticks - ((localOffset + (offset / 100 * 60)) * 1000));
      } else if (arr.length === 1) {
        ticks = this.number(arr[0]);
        ret = new Date(ticks);
      }
    }
    return ret;
  };

  TO.binary = function(obj) {
    var ret;
    ret = NaN;
    if (obj === 0 || obj === '0' || obj === '' || obj === false || this.string(obj).toLowerCase().trim() === 'false') {
      ret = 0;
    } else {
      if (obj === 1 || obj === '1' || obj === true || this.string(obj).toLowerCase().trim() === 'true') {
        ret = 1;
      }
    }
    return ret;
  };

  TO.number = function(inputNum, defaultNum) {
    var retVal, tryGetNumber;
    tryGetNumber = (function(_this) {
      return function(val) {
        var ret, tryGet;
        ret = NaN;
        if (IS.number(val)) {
          ret = val;
        } else if (IS.string(val) || IS.bool(val)) {
          tryGet = function(value) {
            var num;
            num = _this.binary(value);
            if (!IS.number(num) && value) {
              num = +value;
            }
            if (!IS.number(num)) {
              num = _.parseInt(value, 0);
            }
            return num;
          };
          ret = tryGet(val);
        }
        return ret;
      };
    })(this);
    retVal = tryGetNumber(inputNum);
    if (!IS.number(retVal)) {
      retVal = tryGetNumber(defaultNum);
      if (!IS.number(retVal)) {
        retVal = Number.NaN;
      }
    }
    return retVal;
  };

  TO.string = function(inputStr, defaultStr) {
    var ret1, ret2, retVal, tryGetString;
    tryGetString = (function(_this) {
      return function(str) {
        var ret;
        ret = void 0;
        if (IS.string(str)) {
          ret = str;
        } else {
          ret = '';
          if (IS.bool(str) || IS.number(str) || IS.date(str)) {
            ret = str.toString();
          }
        }
        return ret;
      };
    })(this);
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
  };

  return TO;

})();

OJ.register('to', TO);

module.exports = TO;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcdG8uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUNKLEVBQUEsR0FBSyxPQUFBLENBQVEsTUFBUjs7QUFHQzs7O0VBR0osRUFBQyxDQUFBLElBQUQsR0FBTyxTQUFDLEdBQUQ7QUFDTCxRQUFBO0lBQUEsT0FBQSxHQUFVLEVBQUcsQ0FBQSxNQUFBLENBQUgsQ0FBVyxHQUFYO0lBQ1YsSUFBb0IsT0FBQSxLQUFXLEtBQVgsSUFBb0IsT0FBQSxLQUFhLElBQXJEO01BQUEsT0FBQSxHQUFVLE1BQVY7O1dBQ0E7RUFISzs7RUFPUCxFQUFDLENBQUEsVUFBRCxHQUFhLFNBQUMsR0FBRDtXQUNYLEdBQUEsS0FBUyxLQUFULElBQW1CLEdBQUEsS0FBUyxDQUE1QixJQUFrQyxHQUFBLEtBQVMsRUFBM0MsSUFBa0QsR0FBQSxLQUFTLElBQTNELElBQW9FLE9BQU8sR0FBUCxLQUFnQixXQUFwRixJQUFvRyxDQUFDLE9BQU8sR0FBUCxLQUFnQixRQUFoQixJQUE0QixDQUFJLEtBQUEsQ0FBTSxHQUFOLENBQWpDO0VBRHpGOztFQUtiLEVBQUMsQ0FBQSxhQUFELEdBQWdCLFNBQUMsT0FBRDtBQUNkLFFBQUE7SUFBQSxZQUFBLEdBQWUsSUFBQyxDQUFBLE1BQUQsQ0FBUSxPQUFSO0lBQ2YsR0FBQSxHQUFNO0lBQ04sS0FBQSxHQUFRO0lBQ1IsTUFBQSxHQUFTO0lBQ1QsV0FBQSxHQUFjO0lBQ2QsR0FBQSxHQUFNO0lBQ04sSUFBRyxLQUFBLEtBQVMsRUFBRSxDQUFDLFdBQUgsQ0FBZSxZQUFmLENBQVo7TUFDRSxZQUFBLEdBQWUsWUFBWSxDQUFDLE9BQWIsQ0FBcUIsR0FBckIsRUFBMEIsRUFBMUI7TUFD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ZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xyXG5JUyA9IHJlcXVpcmUgJy4vaXMnXHJcblxyXG4jICMgdG9cclxuY2xhc3MgVE8gXHJcbiAgIyAjIyBib29sXHJcbiAgIyBjb252ZXJ0IGFueSBjb21wYXRpYmxlIG9iamVjdCB0byBhIGJvb2xlYW4uIEluY29tcGF0aWJsZSBvYmplY3RzIGFyZSBmYWxzZS5cclxuICBAYm9vbDogKHN0cikgLT5cclxuICAgIHJldEJvb2wgPSBJU1sndHJ1ZSddKHN0cilcclxuICAgIHJldEJvb2wgPSBmYWxzZSAgaWYgcmV0Qm9vbCBpcyBmYWxzZSBvciByZXRCb29sIGlzbnQgdHJ1ZVxyXG4gICAgcmV0Qm9vbFxyXG5cclxuICAjICMjIEVTNV9Ub0Jvb2xcclxuICAjIChkZWJ1ZykgbWV0aG9kIHRvIGV4cGxpY2l0bHkgZm9yY2UgYW4gYGlmKG9iailgIGV2YWx1YXRpb24gdG8gZmxvdyB0aHJvdWdoIHRoZSBFUzUgc3BlYyBmb3IgdHJ1dGhpbmVzc1xyXG4gIEBFUzVfVG9Cb29sOiAodmFsKSAtPlxyXG4gICAgdmFsIGlzbnQgZmFsc2UgYW5kIHZhbCBpc250IDAgYW5kIHZhbCBpc250ICcnIGFuZCB2YWwgaXNudCBudWxsIGFuZCB0eXBlb2YgdmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kICh0eXBlb2YgdmFsIGlzbnQgJ251bWJlcicgb3Igbm90IGlzTmFOKHZhbCkpXHJcblxyXG4gICMgIyMgZGF0ZUZyb21UaWNrc1xyXG4gICMgdGFrZSBhIG51bWJlciByZXByZXNlbnRpbmcgdGlja3MgYW5kIGNvbnZlcnQgaXQgaW50byBhbiBpbnN0YW5jZSBvZiBEYXRlXHJcbiAgQGRhdGVGcm9tVGlja3M6ICh0aWNrU3RyKSAtPlxyXG4gICAgdGljc0RhdGVUaW1lID0gQHN0cmluZyh0aWNrU3RyKVxyXG4gICAgcmV0ID0gdW5kZWZpbmVkXHJcbiAgICB0aWNrcyA9IHVuZGVmaW5lZFxyXG4gICAgb2Zmc2V0ID0gdW5kZWZpbmVkXHJcbiAgICBsb2NhbE9mZnNldCA9IHVuZGVmaW5lZFxyXG4gICAgYXJyID0gdW5kZWZpbmVkXHJcbiAgICBpZiBmYWxzZSBpcyBJUy5udWxsT3JFbXB0eSh0aWNzRGF0ZVRpbWUpXHJcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcvJywgJycpXHJcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCdEYXRlJywgJycpXHJcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcoJywgJycpXHJcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcpJywgJycpXHJcbiAgICAgIGFyciA9IHRpY3NEYXRlVGltZS5zcGxpdCgnLScpXHJcbiAgICAgIGlmIGFyci5sZW5ndGggPiAxXHJcbiAgICAgICAgdGlja3MgPSBAbnVtYmVyKGFyclswXSlcclxuICAgICAgICBvZmZzZXQgPSBAbnVtYmVyKGFyclsxXSlcclxuICAgICAgICBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKVxyXG4gICAgICAgIHJldCA9IG5ldyBEYXRlKCh0aWNrcyAtICgobG9jYWxPZmZzZXQgKyAob2Zmc2V0IC8gMTAwICogNjApKSAqIDEwMDApKSlcclxuICAgICAgZWxzZSBpZiBhcnIubGVuZ3RoIGlzIDFcclxuICAgICAgICB0aWNrcyA9IEBudW1iZXIoYXJyWzBdKVxyXG4gICAgICAgIHJldCA9IG5ldyBEYXRlKHRpY2tzKVxyXG4gICAgcmV0XHJcblxyXG4gICMgIyMgYmluYXJ5XHJcbiAgIyBjb252ZXJ0IGFuIG9iamVjdCB0byBiaW5hcnkgMCBvciAxXHJcbiAgQGJpbmFyeTogKG9iaikgLT5cclxuICAgIHJldCA9IE5hTlxyXG4gICAgaWYgb2JqIGlzIDAgb3Igb2JqIGlzICcwJyBvciBvYmogaXMgJycgb3Igb2JqIGlzIGZhbHNlIG9yIEBzdHJpbmcob2JqKS50b0xvd2VyQ2FzZSgpLnRyaW0oKSBpcyAnZmFsc2UnXHJcbiAgICAgIHJldCA9IDBcclxuICAgIGVsc2UgcmV0ID0gMSAgaWYgb2JqIGlzIDEgb3Igb2JqIGlzICcxJyBvciBvYmogaXMgdHJ1ZSBvciBAc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgaXMgJ3RydWUnXHJcbiAgICByZXRcclxuXHJcblxyXG4gICMgIyMgbnVtYmVyXHJcbiAgI1xyXG4gICMgQXR0ZW1wdHMgdG8gY29udmVydCBhbiBhcmJpdHJhcnkgdmFsdWUgdG8gYSBOdW1iZXIuXHJcbiAgIyBMb29zZSBmYWxzeSB2YWx1ZXMgYXJlIGNvbnZlcnRlZCB0byAwLlxyXG4gICMgTG9vc2UgdHJ1dGh5IHZhbHVlcyBhcmUgY29udmVydGVkIHRvIDEuXHJcbiAgIyBBbGwgb3RoZXIgdmFsdWVzIGFyZSBwYXJzZWQgYXMgSW50ZWdlcnMuXHJcbiAgIyBGYWlsdXJlcyByZXR1cm4gYXMgTmFOLlxyXG4gICNcclxuICBAbnVtYmVyOiAoaW5wdXROdW0sIGRlZmF1bHROdW0pIC0+XHJcbiAgICB0cnlHZXROdW1iZXIgPSAodmFsKSA9PlxyXG4gICAgICByZXQgPSBOYU5cclxuICAgICAgIyBpZiBgdmFsYCBhbHJlYWR5IChpcylbaXMuaHRtbF0gYSBOdW1iZXIsIHJldHVybiBpdFxyXG4gICAgICBpZiBJUy5udW1iZXIodmFsKVxyXG4gICAgICAgIHJldCA9IHZhbFxyXG4gICAgICAjIGVsc2UgaWYgYHZhbGAgYWxyZWFkeSAoaXMpW2lzLmh0bWxdIGEgU3RyaW5nIG9yIGEgQm9vbGVhbiwgY29udmVydCBpdFxyXG4gICAgICBlbHNlIGlmIElTLnN0cmluZyh2YWwpIG9yIElTLmJvb2wodmFsKVxyXG4gICAgICAgIHRyeUdldCA9ICh2YWx1ZSkgPT5cclxuICAgICAgICAgIG51bSA9IEBiaW5hcnkodmFsdWUpXHJcbiAgICAgICAgICBudW0gPSArdmFsdWUgIGlmIG5vdCBJUy5udW1iZXIobnVtKSBhbmQgdmFsdWVcclxuICAgICAgICAgIG51bSA9IF8ucGFyc2VJbnQodmFsdWUsIDApIGlmIG5vdCBJUy5udW1iZXIobnVtKVxyXG4gICAgICAgICAgbnVtXHJcbiAgICAgICAgcmV0ID0gdHJ5R2V0IHZhbFxyXG4gICAgICByZXRcclxuXHJcbiAgICByZXRWYWwgPSB0cnlHZXROdW1iZXIoaW5wdXROdW0pXHJcbiAgICBpZiBub3QgSVMubnVtYmVyKHJldFZhbClcclxuICAgICAgcmV0VmFsID0gdHJ5R2V0TnVtYmVyKGRlZmF1bHROdW0pXHJcbiAgICAgIHJldFZhbCA9IE51bWJlci5OYU4gaWYgbm90IElTLm51bWJlcihyZXRWYWwpXHJcbiAgICByZXRWYWxcclxuXHJcbiAgIyAjIyBzdHJpbmdcclxuICAjIGNvbnZlcnQgYW4gb2JqZWN0IHRvIHN0cmluZ1xyXG4gIEBzdHJpbmc6IChpbnB1dFN0ciwgZGVmYXVsdFN0cikgLT5cclxuICAgIHRyeUdldFN0cmluZyA9IChzdHIpID0+XHJcbiAgICAgIHJldCA9IHVuZGVmaW5lZFxyXG4gICAgICBpZiBJUy5zdHJpbmcoc3RyKVxyXG4gICAgICAgIHJldCA9IHN0clxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0ID0gJydcclxuICAgICAgICByZXQgPSBzdHIudG9TdHJpbmcoKSAgaWYgSVMuYm9vbChzdHIpIG9yIElTLm51bWJlcihzdHIpIG9yIElTLmRhdGUoc3RyKVxyXG4gICAgICByZXRcclxuICAgIHJldDEgPSB0cnlHZXRTdHJpbmcoaW5wdXRTdHIpXHJcbiAgICByZXQyID0gdHJ5R2V0U3RyaW5nKGRlZmF1bHRTdHIpXHJcbiAgICByZXRWYWwgPSAnJ1xyXG4gICAgaWYgcmV0MS5sZW5ndGggaXNudCAwXHJcbiAgICAgIHJldFZhbCA9IHJldDFcclxuICAgIGVsc2UgaWYgcmV0MSBpcyByZXQyIG9yIHJldDIubGVuZ3RoIGlzIDBcclxuICAgICAgcmV0VmFsID0gcmV0MVxyXG4gICAgZWxzZVxyXG4gICAgICByZXRWYWwgPSByZXQyXHJcbiAgICByZXRWYWxcclxuXHJcbk9KLnJlZ2lzdGVyICd0bycsIFRPXHJcbm1vZHVsZS5leHBvcnRzID0gVE8iXX0=
},{"../oj":58,"./is":68}],74:[function(require,module,exports){
var OJ, createFauxUUID;

OJ = require('../oj');


/*
Generates a random string that complies to the RFC 4122 specification for GUID/UUID.
(e.g. 'B42A153F-1D9A-4F92-9903-92C11DD684D2')
While not a true UUID, for the purposes of this application, it should be sufficient.
 */

createFauxUUID = function() {
  var hexDigits, i, s, uuid;
  s = [];
  s.length = 36;
  hexDigits = '0123456789abcdef';
  i = 0;
  while (i < 36) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    i += 1;
  }
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';
  uuid = s.join('');
  return uuid;
};

OJ.register('createUUID', createFauxUUID);

module.exports = createFauxUUID;



},{"../oj":58}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVudHJ5cG9pbnQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGFzeW5jXFxhamF4LmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxhc3luY1xccHJvbWlzZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcZ3JpZC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcaW5wdXRncm91cC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGFicy5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGlsZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29udHJvbHNcXGljb24uY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGRhdGUuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGZ1bmN0aW9uLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxudW1iZXIuY29mZmVlIiwic3JjL2NvZmZlZS9jb3JlL29iamVjdC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxccHJvcGVydHkuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXHN0cmluZy5jb2ZmZWUiLCJzcmMvY29mZmVlL2RvbS9ib2R5LmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxkb21cXGNvbXBvbmVudC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxjb250cm9sLmNvZmZlZSIsInNyYy9jb2ZmZWUvZG9tL2VsZW1lbnQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZnJhZ21lbnQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZ2VuZXJpY3MuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcaW5wdXQuY29mZmVlIiwic3JjL2NvZmZlZS9kb20vbm9kZS5jb2ZmZWUiLCJzcmMvY29mZmVlL2RvbS9ub2RlRmFjdG9yeS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGEuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxici5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGZvcm0uY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxpbnB1dC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXG9sLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcc2VsZWN0LmNvZmZlZSIsInNyYy9jb2ZmZWUvZWxlbWVudHMvdGFibGUuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0ZXh0YXJlYS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHRoZWFkLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdWwuY29mZmVlIiwic3JjL2NvZmZlZS9nbG9iYWwuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcYnV0dG9uaW5wdXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcY2hlY2tib3guY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcY29sb3IuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxkYXRldGltZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxkYXRldGltZWxvY2FsLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGVtYWlsLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGZpbGUuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcaGlkZGVuLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGltYWdlaW5wdXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcbW9udGguY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcbnVtYmVyLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHBhc3N3b3JkLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJhZGlvLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJhbmdlLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJlc2V0LmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHNlYXJjaC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxzdWJtaXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdGVsLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHRleHRpbnB1dC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx0aW1lLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHVybC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx3ZWVrLmNvZmZlZSIsInNyYy9jb2ZmZWUvb2ouY29mZmVlIiwic3JjL2NvZmZlZS9vakluaXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxKc29uVG9UYWJsZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGFycmF5MkQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxjb25zb2xlLmNvZmZlZSIsInNyYy9jb2ZmZWUvdG9vbHMvY29va2llLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZGVmZXIuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlYWNoLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZW51bXMuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxoaXN0b3J5LmNvZmZlZSIsInNyYy9jb2ZmZWUvdG9vbHMvaXMuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy9ub3R5LmNvZmZlZSIsInNyYy9jb2ZmZWUvdG9vbHMvcHVic3ViLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xccXVlcnlTdHJpbmcuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy9yYW5nZXMuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy90by5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHV1aWQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsT0FBQSxDQUFRLE1BQVI7O0FBQ0EsT0FBQSxDQUFRLFVBQVI7O0FBQ0EsT0FBQSxDQUFRLGNBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEseUJBQVI7O0FBQ0EsT0FBQSxDQUFRLG1CQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGFBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsWUFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGVBQVI7O0FBQ0EsT0FBQSxDQUFRLFlBQVI7O0FBQ0EsT0FBQSxDQUFRLGVBQVI7O0FBQ0EsT0FBQSxDQUFRLGdCQUFSOztBQUNBLE9BQUEsQ0FBUSxnQkFBUjs7QUFDQSxPQUFBLENBQVEsYUFBUjs7QUFDQSxPQUFBLENBQVEsY0FBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGtCQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsa0JBQVI7O0FBQ0EsT0FBQSxDQUFRLHFCQUFSOztBQUNBLE9BQUEsQ0FBUSxr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QXlCUCxJQXpCTyxFQTBCUCxJQTFCTyxFQTJCUCxJQTNCTyxFQTRCUCxVQTVCTyxFQTZCUCxZQTdCTyxFQThCUCxRQTlCTyxFQStCUCxNQS9CTyxFQWdDUCxRQWhDTyxFQWlDUCxJQWpDTyxFQWtDUCxJQWxDTyxFQW1DUCxJQW5DTyxFQW9DUCxJQXBDTyxFQXFDUCxJQXJDTyxFQXNDUCxJQXRDTyxFQXVDUCxNQXZDTyxFQXdDUCxRQXhDTyxFQXlDUCxRQXpDTyxFQTBDUCxNQTFDTyxFQTJDUCxHQTNDTyxFQTRDUCxRQTVDTyxFQTZDUCxLQTdDTyxFQThDUCxLQTlDTyxFQStDUCxPQS9DTyxFQWdEUCxRQWhETyxFQWlEUCxJQWpETyxFQWtEUCxLQWxETyxFQW1EUCxNQW5ETyxFQW9EUCxNQXBETyxFQXFEUCxPQXJETyxFQXNEUCxLQXRETyxFQXVEUCxVQXZETyxFQXdEUCxVQXhETyxFQXlEUCxRQXpETyxFQTBEUCxVQTFETyxFQTJEUCxRQTNETyxFQTREUCxRQTVETyxFQTZEUCxHQTdETyxFQThEUCxLQTlETyxFQStEUCxVQS9ETyxFQWdFUCxHQWhFTyxFQWlFUCxJQWpFTyxFQWtFUCxJQWxFTyxFQW1FUCxNQW5FTyxFQW9FUCxHQXBFTyxFQXFFUCxNQXJFTyxFQXNFUCxTQXRFTyxFQXVFUCxPQXZFTyxFQXdFUCxNQXhFTyxFQXlFUCxRQXpFTyxFQTBFUCxRQTFFTyxFQTJFUCxPQTNFTyxFQTRFUCxLQTVFTyxFQTZFUCxTQTdFTyxFQThFUCxLQTlFTyxFQStFUCxPQS9FTyxFQWdGUCxJQWhGTyxFQWlGUCxPQWpGTyxFQWtGUCxJQWxGTyxFQW1GUCxNQW5GTyxFQW9GUCxPQXBGTyxFQXFGUCxJQXJGTyxFQXNGUCxJQXRGTyxFQXVGUCxHQXZGTyxFQXdGUCxLQXhGTyxFQXlGUCxPQXpGTyxFQTBGUCxLQTFGTzs7QUE0RlQsSUFBQSxHQUFPLDJFQUEyRSxDQUFDLEtBQTVFLENBQWtGLEdBQWxGOztBQUNQLEdBQUEsR0FBTSxNQUFNLENBQUMsTUFBUCxDQUFjLElBQWQ7O0FBRU4sT0FBQSxHQUFVOztLQUdMLFNBQUMsR0FBRDtBQUNELE1BQUE7RUFBQSxNQUFBLEdBQVMsU0FBQyxPQUFELEVBQVUsS0FBVixFQUEyQixpQkFBM0I7QUFFUCxRQUFBOztNQUZpQixRQUFRLEVBQUUsQ0FBQzs7O01BQU0sb0JBQW9COztJQUV0RCxRQUFBLEdBQ0U7TUFBQSxLQUFBLEVBQU8sRUFBUDtNQUNBLE1BQUEsRUFBUSxFQURSO01BRUEsTUFBQSxFQUFRLEVBRlI7O0lBSUYsR0FBRyxDQUFDLE1BQUosQ0FBVyxRQUFYLEVBQXFCLE9BQXJCO0lBQ0EsR0FBQSxHQUFNLFdBQUEsQ0FBWSxHQUFaLEVBQWlCLFFBQWpCLEVBQTJCLEtBQTNCLEVBQWtDLGlCQUFsQztXQUVOO0VBVk87RUFXVCxNQUFNLENBQUMsZUFBUCxHQUF5QjtFQUN6QixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsR0FBbEIsRUFBdUIsTUFBdkI7U0FDQSxPQUFRLENBQUEsR0FBQSxDQUFSLEdBQWU7QUFkZDtBQURMLEtBQUEscUNBQUE7O0tBQ1k7QUFEWjs7QUFpQkEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDekhqQixJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7O0FBRUw7Ozs7QUFHQSxLQUFBLEdBQVEsU0FBQyxPQUFELEVBQXdCLEtBQXhCO0FBQ04sTUFBQTs7SUFETyxVQUFVLEVBQUUsQ0FBQyxNQUFILENBQUE7O0VBQ2pCLElBQUcsQ0FBSSxLQUFQO0FBQWtCLFVBQVUsSUFBQSxLQUFBLENBQU0seUNBQU4sRUFBNUI7O0VBQ0EsSUFBRyxDQUFJLE9BQU8sQ0FBQyxLQUFaLElBQXFCLENBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUExQztBQUFvRCxVQUFVLElBQUEsS0FBQSxDQUFNLDhDQUFOLEVBQTlEOztFQUNBLEdBQUEsR0FBTSxLQUFLLENBQUMsSUFBTixDQUFXLE9BQVgsRUFBb0IsT0FBcEI7RUFDTixHQUFHLENBQUMsR0FBSixDQUFRLFdBQVIsRUFBcUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFuQztTQUNBO0FBTE07O0FBT1IsRUFBRSxDQUFDLFFBQUgsQ0FBWSxPQUFaLEVBQXFCLEtBQXJCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7OztBQ2JqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTUEsSUFBQSxzQ0FBQTtFQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxXQUFBLEdBQWMsT0FBQSxDQUFRLG9CQUFSOztBQUNkLEtBQUEsR0FBUSxPQUFBLENBQVEsZ0JBQVI7O0FBRVIsUUFBQSxHQUFXOztBQUVYLElBQUEsR0FBTyxTQUFDLE9BQUQsRUFBVSxLQUFWLEVBQTJCLGlC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SUFBOUI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDdEJqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0EsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7OztBQUVMOzs7O0FBR0EsV0FBQSxHQUFjLFNBQUMsS0FBRDtBQUNaLE1BQUE7RUFBQSxHQUFBLEdBQU07RUFFTixJQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBYjtJQUNFLE1BQUEsR0FBVSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBMUIsQ0FBaUMsQ0FBakMsQ0FBbUMsQ0FBQyxLQUFwQyxDQUEwQyxHQUExQztJQUNWLElBQUcsTUFBSDtNQUNFLENBQUEsR0FBSTtBQUNKLGFBQU0sQ0FBQSxHQUFJLE1BQU0sQ0FBQyxNQUFqQjtRQUNFLEdBQUEsR0FBTSxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBVixDQUFnQixHQUFoQjtRQUNOLElBQUcsR0FBRyxDQUFDLE1BQUosS0FBYyxDQUFqQjtVQUNFLEdBQUksQ0FBQSxHQUFJLENBQUEsQ0FBQSxDQUFKLENBQUosR0FBYyxFQUFFLENBQUMsTUFBTSxDQUFDLGtCQUFWLENBQTZCLEdBQUksQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFQLENBQWUsS0FBZixFQUFzQixHQUF0QixDQUE3QixFQURoQjs7UUFFQSxDQUFBLElBQUs7TUFKUCxDQUZGO0tBRkY7O1NBU0E7QUFaWTs7QUFjZCxFQUFFLENBQUMsUUFBSCxDQUFZLGFBQVosRUFBMEIsV0FBMUI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDcEJqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7OztBQUVMOzs7Ozs7QUFLQSxjQUFBLEdBQWlCLFNBQUE7QUFJZixNQUFBO0VBQUEsQ0FBQSxHQUFJO0VBQ0osQ0FBQyxDQUFDLE1BQUYsR0FBVztFQUNYLFNBQUEsR0FBWTtFQUNaLENBQUEsR0FBSTtBQUVKLFNBQU0sQ0FBQSxHQUFJLEVBQVY7SUFDRSxDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU8sU0FBUyxDQUFDLE1BQVYsQ0FBaUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsSUFBM0IsQ0FBakIsRUFBbUQsQ0FBbkQ7SUFDUCxDQUFBLElBQUs7RUFGUDtFQUdBLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUTtFQUNSLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxTQUFTLENBQUMsTUFBVixDQUFpQixDQUFDLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxHQUFULENBQUEsR0FBZ0IsR0FBakMsRUFBc0MsQ0FBdEM7RUFDUixDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU8sQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVE7RUFDL0IsSUFBQSxHQUFPLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUDtTQUNQO0FBaEJlOztBQWtCakIsRUFBRSxDQUFDLFFBQUgsQ0FBWSxZQUFaLEVBQTBCLGNBQTFCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUgJy4vb2onXHJcbnJlcXVpcmUgJy4vb2pJbml0J1xyXG5yZXF1aXJlICcuL2FzeW5jL2FqYXgnXHJcbnJlcXVpcmUgJy4vYXN5bmMvcHJvbWlzZSdcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL2dyaWQnXHJcbnJlcXVpcmUgJy4vY29tcG9uZW50cy9pbnB1dGdyb3VwJ1xyXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvdGFicydcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL3RpbGUnXHJcbnJlcXVpcmUgJy4vY29udHJvbHMvaWNvbidcclxucmVxdWlyZSAnLi9jb3JlL2RhdGUnXHJcbnJlcXVpcmUgJy4vY29yZS9mdW5jdGlvbidcclxucmVxdWlyZSAnLi9jb3JlL251bWJlcidcclxucmVxdWlyZSAnLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi9jb3JlL3N0cmluZydcclxucmVxdWlyZSAnLi9kb20vbm9kZUZhY3RvcnknXHJcbnJlcXVpcmUgJy4vZG9tL2JvZHknXHJcbnJlcXVpcmUgJy4vZG9tL2NvbXBvbmVudCdcclxucmVxdWlyZSAnLi9kb20vY29udHJvbCdcclxucmVxdWlyZSAnLi9kb20vbm9kZSdcclxucmVxdWlyZSAnLi9kb20vZWxlbWVudCdcclxucmVxdWlyZSAnLi9kb20vZnJhZ21lbnQnXHJcbnJlcXVpcmUgJy4vZG9tL2dlbmVyaWNzJ1xyXG5yZXF1aXJlICcuL2RvbS9pbnB1dCdcclxucmVxdWlyZSAnLi9lbGVtZW50cy9hJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2JyJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2Zvcm0nXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvaW5wdXQnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvb2wnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvc2VsZWN0J1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RhYmxlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RleHRhcmVhJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RoZWFkJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3VsJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9idXR0b25pbnB1dCdcclxucmVxdWlyZSAnLi9pbnB1dHMvY2hlY2tib3gnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2NvbG9yJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9kYXRlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9kYXRldGltZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZXRpbWVsb2NhbCdcclxucmVxdWlyZSAnLi9pbnB1dHMvZW1haWwnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2ZpbGUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2hpZGRlbidcclxucmVxdWlyZSAnLi9pbnB1dHMvaW1hZ2VpbnB1dCdcclxucmVxdWlyZSAnLi9pbnB1dHMvbW9udGgnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL251bWJlcidcclxucmVxdWlyZSAnLi9pbnB1dHMvcGFzc3dvcmQnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3JhZGlvJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9yYW5nZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvcmVzZXQnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3NlYXJjaCdcclxucmVxdWlyZSAnLi9pbnB1dHMvc3VibWl0J1xyXG5yZXF1aXJlICcuL2lucHV0cy90ZWwnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3RleHRpbnB1dCdcclxucmVxdWlyZSAnLi9pbnB1dHMvdGltZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvdXJsJ1xyXG5yZXF1aXJlICcuL2lucHV0cy93ZWVrJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2FycmF5MkQnXHJcbnJlcXVpcmUgJy4vdG9vbHMvY29uc29sZSdcclxucmVxdWlyZSAnLi90b29scy9jb29raWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvZGVmZXInXHJcbnJlcXVpcmUgJy4vdG9vbHMvZWFjaCdcclxucmVxdWlyZSAnLi90b29scy9lbnVtcydcclxucmVxdWlyZSAnLi90b29scy9oaXN0b3J5J1xyXG5yZXF1aXJlICcuL3Rvb2xzL2lzJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL25vdHknXHJcbnJlcXVpcmUgJy4vdG9vbHMvcHVic3ViJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL3F1ZXJ5U3RyaW5nJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL3JhbmdlcydcclxucmVxdWlyZSAnLi90b29scy90bydcclxucmVxdWlyZSAnLi90b29scy91dWlkJ1xyXG4iLCIjICMgYWpheFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbmNvbmZpZyA9IHt9XHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgb24gc3VjY2VzcyBoYW5kbGVyLCB3cml0ZSBvdXQgdGhlIHJlcXVlc3Qgc3RhdHMgdG8gYSB0YWJsZVxyXG5jb25maWcub25TdWNjZXNzID0gKG9wdHMsIGRhdGEsIHVybCkgLT5cclxuICByZXNwb25zZSA9IHt9XHJcbiAgT0ouZXh0ZW5kIHJlc3BvbnNlLCBkYXRhXHJcbiAgb3B0cy5vblN1Y2Nlc3MgcmVzcG9uc2VcclxuICBpZiBPSi5MT0dfQUxMX0FKQVhcclxuICAgIE9KLmNvbnNvbGUudGFibGUgW1xyXG4gICAgICBXZWJzZXJ2aWNlOiBvcHRzLmFqYXhPcHRzLnVybFxyXG4gICAgICBTdGFydFRpbWU6IG9wdHMuc3RhcnRUaW1lXHJcbiAgICAgIEVuZFRpbWU6IG5ldyBEYXRlKClcclxuICAgIF0gXHJcbiAgcmV0dXJuXHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgb24gZXJyb3IgaGFuZGxlciwgd3JpdGUgb3V0IHRoZSByZXF1ZXN0IGVycm9yIGNvbmV4dCB0byBhIHRhYmxlXHJcbmNvbmZpZy5vbkVycm9yID0gKHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzLCBwYXJhbTEsIG9wdHMgPSBPSi5vYmplY3QoKSkgLT5cclxuICBpZiB0ZXh0U3RhdHVzIGlzbnQgJ2Fib3J0J1xyXG4gICAgaWYgT0ouTE9HX0FMTF9BSkFYX0VSUk9SU1xyXG4gICAgICBPSi5jb25zb2xlLnRhYmxlIFtcclxuICAgICAgICBXZWJzZXJ2aWNlOiBvcHRzLmFqYXhPcHRzLnVybFxyXG4gICAgICAgIERhdGE6IG9wdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgICAgIEZhaWxlZDogdGV4dFN0YXR1c1xyXG4gICAgICAgIFN0YXRlOiB4bWxIdHRwUmVxdWVzdC5zdGF0ZSgpXHJcbiAgICAgICAgU3RhdHVzOiB4bWxIdHRwUmVxdWVzdC5zdGF0dXNcclxuICAgICAgICBTdGF0dXNUZXh0OiB4bWxIdHRwUmVxdWVzdC5zdGF0dXNUZXh0XHJcbiAgICAgICAgUmVhZHlTdGF0ZTogeG1sSHR0cFJlcXVlc3QucmVhZHlTdGF0ZVxyXG4gICAgICAgIFJlc3BvbnNlVGV4dDogeG1sSHR0cFJlcXVlc3QucmVzcG9uc2VUZXh0XHJcbiAgICAgIF1cclxuXHJcbiAgICBvcHRzLm9uRXJyb3IgdGV4dFN0YXR1c1xyXG4gIHJldHVyblxyXG4gIFxyXG4jIGluIHRoZSBjYXNlIHdoZXJlIGBvcHRzYCBpcyBhIHN0cmluZywgY29udmVydCBpdCB0byBhbiBvYmplY3Rcclxub3B0c0Zyb21VcmwgPSAob3B0cykgLT5cclxuICBpZiBPSi5pcy5zdHJpbmcgb3B0c1xyXG4gICAgdXJsID0gb3B0c1xyXG4gICAgb3B0cyA9IE9KLm9iamVjdCgpXHJcbiAgICBvcHRzLmFkZCAnYWpheE9wdHMnLCBPSi5vYmplY3QoKVxyXG4gICAgb3B0cy5hamF4T3B0cy5hZGQgJ3VybCcsIHVybFxyXG4gIG9wdHNcclxuICBcclxuIyBkZWZpbmUgYSBzdGFuZGFyZCBgZXhlY2AgbWV0aG9kIHRvIGhhbmRsZSBhbGwgcmVxdWVzdCB2ZXJicy4gVXNlcyB0aGUgW2pRdWVyeS5hamF4XShodHRwOi8vYXBpLmpxdWVyeS5jb20vY2F0ZWdvcnkvYWpheC8pIEFQSS5cclxuIyBgZXhlY1JlcXVlc3RgIHJldHVybnMgYSBwcm9taXNlIHJlcHJlc2VudCB0aGUgYWN0dWFsIEFKQVggY2FsbC5cclxuICBcclxuIyAtIGB2ZXJiYCBkZWZhdWx0IHZhbHVlID0gJ0dFVCdcclxuIyAtIGBvcHRzYCBvYmplY3RcclxuIyAtLSBgb3B0cy5hamF4T3B0c2Agb2JqZWN0IGZvciBhbGwgalF1ZXJ5J3MgYWpheC1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxyXG5jb25maWcuZXhlY1JlcXVlc3QgPSAodmVyYiA9ICdHRVQnLCBvcHRzKSAtPlxyXG4gIGRlZmF1bHRzID1cclxuICAgIGFqYXhPcHRzOlxyXG4gICAgICB1cmw6ICcnXHJcbiAgICAgIGRhdGE6IHt9XHJcbiAgICAgIHR5cGU6IHZlcmJcclxuICAgICAgeGhyRmllbGRzOlxyXG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICBkYXRhVHlwZTogJ2pzb24nXHJcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuICAgICAgICBcclxuICAgIG9uU3VjY2VzczogT0oubm9vcFxyXG4gICAgb25FcnJvcjogT0oubm9vcFxyXG4gICAgb25Db21wbGV0ZTogT0oubm9vcFxyXG4gICAgb3ZlcnJpZGVFcnJvcjogZmFsc2VcclxuICAgIHdhdGNoR2xvYmFsOiB0cnVlXHJcbiAgICB1c2VDYWNoZTogZmFsc2VcclxuICAgIFxyXG4gIG9wdHMgPSBvcHRzRnJvbVVybCBvcHRzXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRzLCB0cnVlXHJcbiAgICBcclxuICBkZWZhdWx0cy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpXHJcbiAgICBcclxuICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXHJcbiAgICAjIEdFVCByZXF1ZXN0cyBleHBlY3QgcXVlcnlTdHJpbmcgcGFyYW1ldGVyc1xyXG4gICAgaWYgZGVmYXVsdHMuYWpheE9wdHMudmVyYiBpcyAnR0VUJ1xyXG4gICAgICBkZWZhdWx0cy5hamF4T3B0cy5kYXRhID0gT0oucGFyYW1zIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcclxuICAgICMgYWxsIG90aGVyIHJlcXVlc3RzIHRha2UgYW4gb2JqZWN0XHJcbiAgICBlbHNlXHJcbiAgICAgIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGEgPSBPSi5zZXJpYWxpemUgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgXHJcbiAgZ2V0SlF1ZXJ5RGVmZXJyZWQgPSAod2F0Y2hHbG9iYWwpIC0+XHJcbiAgICByZXQgPSAkLmFqYXggZGVmYXVsdHMuYWpheE9wdHNcclxuICAgICAgXHJcbiAgICByZXQuZG9uZSAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIC0+XHJcbiAgICAgIGNvbmZpZy5vblN1Y2Nlc3MgZGVmYXVsdHMsIGRhdGFcclxuXHJcbiAgICByZXQuZmFpbCAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGV4dCkgLT5cclxuICAgICAgY29uZmlnLm9uRXJyb3IganFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGV4dCwgZGVmYXVsdHNcclxuICBcclxuICAgIHJldC5hbHdheXMgKHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzKSAtPlxyXG4gICAgICBkZWZhdWx0cy5vbkNvbXBsZXRlIHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzXHJcblxyXG4gICAgT0ouYXN5bmMuYWpheFByb21pc2UgcmV0XHJcblxyXG4gIHByb21pc2UgPSBnZXRKUXVlcnlEZWZlcnJlZChkZWZhdWx0cy53YXRjaEdsb2JhbClcclxuICBwcm9taXNlXHJcbiAgXHJcbmFqYXggPSB7fVxyXG4gIFxyXG4jICMjIHBvc3RcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXgucG9zdDogaW5zZXJ0IGEgbmV3IG9iamVjdCBvciBpbml0IGEgZm9ybSBwb3N0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC4gXHJcbmFqYXgucG9zdCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnUE9TVCcsIG9wdHNcclxuICBcclxuIyAjIyBnZXRcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXguZ2V0OiBnZXQgYW4gZXhpc3Rpbmcgb2JqZWN0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuI1xyXG5hamF4LmdldCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnR0VUJywgb3B0c1xyXG5cclxuIyAjIyBkZWxldGVcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXguZGVsZXRlOiBkZWxldGUgYW4gZXhpc3Rpbmcgb2JqZWN0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuYWpheC5kZWxldGUgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ0RFTEVURScsIG9wdHNcclxuXHJcbiMgIyMgcHV0XHJcbiMgW09KXShvai5odG1sKS5hamF4LnB1dDogdXBkYXRlIGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbmFqYXgucHV0ID0gKG9wdHMpIC0+XHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdQVVQnLCBvcHRzXHJcblxyXG5PSi5hc3luYy5yZWdpc3RlciAnYWpheCcsIGFqYXhcclxubW9kdWxlLmV4cG9ydHMgPSBhamF4IiwiIyAjIHByb21pc2VcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jICMjIGFqYXhQcm9taXNlXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5hamF4UHJvbWlzZSBjb252ZXJ0cyBhbiBBSkFYIFhtbEh0dHBSZXF1ZXN0IGludG8gYSBQcm9taXNlLiBcclxuIyBTZWUgYWxzbyBbUHJvbWlzZS5yZXNvbHZlXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbmFqYXhQcm9taXNlID0gKGFqYXgpIC0+IFxyXG4gIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUgYWpheFxyXG4gIHByb21pc2UuYWJvcnQgPSBhamF4LmFib3J0XHJcbiAgcHJvbWlzZS5yZWFkeVN0YXRlID0gYWpheC5yZWFkeVN0YXRlXHJcbiAgcHJvbWlzZVxyXG5cclxuIyAjIyBhbGxcclxuIyBbT0pdKG9qLmh0bWwpLmFzeW5jLmFsbCB0YWtlcyBhbiBhcnJheSBvZiBmdW5jdGlvbnMgYW5kIHJldHVybnMgYSBwcm9taXNlIHJlcHJlc2VudGluZyB0aGUgc3VjY2VzcyBvZiBhbGwgbWV0aG9kcyBvciB0aGUgZmFpbHVyZSBvZiBhbnkgbWV0aG9kLlxyXG4jIFNlZSBhbHNvIFtQcm9taXNlLmFsbF0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG5hbGwgPSAoaW5pdEFycmF5KSAtPlxyXG4gIHJlcXMgPSBpbml0QXJyYXkgb3IgW11cclxuICBwcm9taXNlID0gUHJvbWlzZS5hbGwocmVxcylcclxuICBwcm9taXNlLnB1c2ggPSAoaXRlbSkgLT5cclxuICAgIHJlcXMucHVzaCBpdGVtXHJcbiAgICByZXR1cm5cclxuICBwcm9taXNlXHJcblxyXG4jICMjIGRlZmVyXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5kZWZlciBjb252ZXJ0cyBhIGZ1bmN0aW9uIGludG8gYSBQcm9taXNlIHRvIGV4ZWN1dGUgdGhhdCBmdW5jdGlvbi4gXHJcbiMgU2VlIGFsc28gW1Byb21pc2UubWV0aG9kXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbmRlZnIgPSAoZnVuYyA9IE9KLm5vb3ApIC0+XHJcbiAgcmV0ID0gUHJvbWlzZS5tZXRob2QgZnVuY1xyXG4gIHJldFxyXG4gIFxyXG4gIFxyXG5PSi5hc3luYy5yZWdpc3RlciAnZGVmZXInLCBkZWZyXHJcbk9KLmFzeW5jLnJlZ2lzdGVyICdhbGwnLCBhbGxcclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2FqYXhQcm9taXNlJywgYWpheFByb21pc2VcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuICBkZWZlcjogZGVmclxyXG4gIGFsbDogYWxsXHJcbiAgYWpheFByb21pc2U6IGFqYXhQcm9taXNlXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcclxuYXJyYXkyRCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FycmF5MkQnXHJcblxyXG5ub2RlTmFtZSA9ICd4LWdyaWQnXHJcbmNsYXNzTmFtZSA9ICdncmlkJ1xyXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXHJcblxyXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICB0aWxlU2l6ZXM6XHJcbiAgICAgIHNtYWxsU3BhbjogJydcclxuICAgICAgbWVkaXVtU3BhbjogJydcclxuICAgICAgbGFyZ2VTcGFuOiAnJ1xyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAnZ3JpZCdcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcclxuXHJcbiAgcm93cyA9IFtdXHJcbiAgdGlsZXMgPSBhcnJheTJEKClcclxuXHJcbiAgZmlsbE1pc3NpbmcgPSAoKSAtPlxyXG4gICAgdGlsZXMuZWFjaCAocm93Tm8sIGNvbE5vLCB2YWwpIC0+XHJcbiAgICAgIGlmIG5vdCB2YWxcclxuICAgICAgICByb3cgPSByZXQucm93IHJvd05vXHJcbiAgICAgICAgcm93Lm1ha2UgJ3RpbGUnLCBjb2xObywge31cclxuXHJcbiAgcmV0LmFkZCAncm93JywgKHJvd05vID0gcm93cy5sZW5ndGgtMSBvciAxKS0+XHJcbiAgICBudVJvdyA9IHJvd3Nbcm93Tm8tMV1cclxuICAgIGlmIG5vdCBudVJvd1xyXG4gICAgICB3aGlsZSByb3dzLmxlbmd0aCA8IHJvd05vXHJcbiAgICAgICAgbnVSb3cgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAncm93J1xyXG4gICAgICAgIHJvd3MucHVzaCBudVJvd1xyXG4gICAgICBudVJvdy5hZGQgJ3RpbGUnLCAoY29sTm8sIG9wdHMpIC0+XHJcbiAgICAgICAgb3B0cyA9IE9KLmV4dGVuZCAoT0ouZXh0ZW5kIHt9LCBkZWZhdWx0cy50aWxlU2l6ZXMpLCBvcHRzXHJcbiAgICAgICAgbnVUaWxlID0gT0ouY29tcG9uZW50cy50aWxlIG9wdHMsIG51Um93XHJcbiAgICAgICAgdGlsZXMuc2V0IHJvd05vLCBjb2xObywgbnVUaWxlXHJcbiAgICAgICAgbnVUaWxlXHJcbiAgICBudVJvd1xyXG5cclxuICByZXQuYWRkICd0aWxlJywgKHJvd05vLCBjb2xObywgb3B0cykgLT5cclxuICAgIGlmIG5vdCByb3dObyBvciByb3dObyA8IDEgdGhlbiByb3dObyA9IDFcclxuICAgIGlmIG5vdCBjb2xObyBvciBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcclxuXHJcbiAgICByb3cgPSByZXQucm93IHJvd05vXHJcbiAgICB0aWxlID0gdGlsZXMuZ2V0IHJvd05vLCBjb2xOb1xyXG5cclxuICAgIGlmIG5vdCB0aWxlXHJcbiAgICAgIGkgPSAwXHJcbiAgICAgIHdoaWxlIGkgPCBjb2xOb1xyXG4gICAgICAgIGkgKz0gMVxyXG4gICAgICAgIHRyeVRpbGUgPSB0aWxlcy5nZXQgcm93Tm8sIGlcclxuICAgICAgICBpZiBub3QgdHJ5VGlsZVxyXG4gICAgICAgICAgaWYgaSBpcyBjb2xOb1xyXG4gICAgICAgICAgICB0aWxlID0gcm93Lm1ha2UgJ3RpbGUnLCBvcHRzXHJcbiAgICAgICAgICBlbHNlIGlmIG5vdCB0aWxlXHJcbiAgICAgICAgICAgIHJvdy5tYWtlICd0aWxlJ1xyXG5cclxuICAgIGZpbGxNaXNzaW5nKClcclxuICAgIHRpbGVcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcclxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcclxudXVpZCA9IHJlcXVpcmUgJy4uL3Rvb2xzL3V1aWQnXHJcblxyXG5ub2RlTmFtZSA9ICd4LWlucHV0LWdyb3VwJ1xyXG5jbGFzc05hbWUgPSAnaW5wdXRncm91cCdcclxuXHJcbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcclxuXHJcbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxyXG4gIGZvcklkID0gdXVpZCgpXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAnZm9ybS1ncm91cCdcclxuICAgIGV2ZW50czpcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcbiAgICBmb3I6IGZvcklkXHJcbiAgICBsYWJlbFRleHQ6ICcnXHJcbiAgICBpbnB1dE9wdHM6XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIGlkOiBmb3JJZFxyXG4gICAgICAgIHR5cGU6ICd0ZXh0J1xyXG4gICAgICAgIGNsYXNzOiAnJ1xyXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnJ1xyXG4gICAgICAgIHZhbHVlOiAnJ1xyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxyXG5cclxuICBncm91cCA9IHJldC5tYWtlICdkaXYnLCBwcm9wczogY2xhc3M6ICdmb3JtLWdyb3VwJ1xyXG5cclxuICByZXQuZ3JvdXBMYWJlbCA9IGdyb3VwLm1ha2UgJ2xhYmVsJywgcHJvcHM6IHsgZm9yOiBmb3JJZCB9LCB0ZXh0OiBkZWZhdWx0cy5sYWJlbFRleHRcclxuXHJcbiAgZGVmYXVsdHMuaW5wdXRPcHRzLnByb3BzLmNsYXNzICs9ICcgZm9ybS1jb250cm9sJ1xyXG4gIHJldC5ncm91cElucHV0ID0gZ3JvdXAubWFrZSAnaW5wdXQnLCBkZWZhdWx0cy5pbnB1dE9wdHNcclxuXHJcbiAgcmV0Lmdyb3VwVmFsdWUgPSAoKSAtPlxyXG4gICAgcmV0Lmdyb3VwSW5wdXQudmFsKClcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcclxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcclxuXHJcbm5vZGVOYW1lID0gJ3gtdGFicydcclxuY2xhc3NOYW1lID0gJ3RhYnMnXHJcblxyXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXHJcblxyXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICB0YWJzOiB7fVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAnJ1xyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxyXG5cclxuICB0YWJzID0gcmV0Lm1ha2UgJ3VsJywgcHJvcHM6IGNsYXNzOiAnbmF2IG5hdi10YWJzJ1xyXG4gIGNvbnRlbnQgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAndGFiLWNvbnRlbnQnXHJcblxyXG4gIGZpcnN0ID0gdHJ1ZVxyXG4gIE9KLmVhY2ggZGVmYXVsdHMudGFicywgKHRhYlZhbCwgdGFiTmFtZSkgLT5cclxuICAgIHRhYkNsYXNzID0gJydcclxuICAgIGlmIGZpcnN0XHJcbiAgICAgIGZpcnN0ID0gZmFsc2VcclxuICAgICAgdGFiQ2xhc3MgPSAnYWN0aXZlJ1xyXG4gICAgYSA9IHRhYnMubWFrZSAnbGknLCBwcm9wczogY2xhc3M6IHRhYkNsYXNzXHJcbiAgICAgIC5tYWtlKCdhJyxcclxuICAgICAgICB0ZXh0OiB0YWJOYW1lXHJcbiAgICAgICAgcHJvcHM6XHJcbiAgICAgICAgICBocmVmOiAnIycgKyB0YWJOYW1lXHJcbiAgICAgICAgICAnZGF0YS10b2dnbGUnOiAndGFiJ1xyXG4gICAgICAgIGV2ZW50czpcclxuICAgICAgICAgIGNsaWNrOiAtPlxyXG4gICAgICAgICAgICBhLiQudGFiICdzaG93JylcclxuXHJcbiAgICB0YWJDb250ZW50Q2xhc3MgPSAndGFiLXBhbmUgJyArIHRhYkNsYXNzXHJcbiAgICByZXQuYWRkIHRhYk5hbWUsIGNvbnRlbnQubWFrZSgnZGl2JywgcHJvcHM6IGNsYXNzOiB0YWJDb250ZW50Q2xhc3MsIGlkOiB0YWJOYW1lKVxyXG5cclxuICByZXRcclxuXHJcbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vb2pJbml0J1xyXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xyXG5cclxubm9kZU5hbWUgPSAneC10aWxlJ1xyXG5jbGFzc05hbWUgPSAndGlsZSdcclxuXHJcbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcclxuICBcclxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgd2lkdGg6XHJcbiAgICAgIHhzOiAnJ1xyXG4gICAgICBzbTogJydcclxuICAgICAgbWQ6ICcnXHJcbiAgICAgIGxnOiAnJ1xyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAndGlsZSdcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgaWYgZGVmYXVsdHMud2lkdGgueHMgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC14cy0nICsgZGVmYXVsdHMud2lkdGgueHNcclxuICBpZiBkZWZhdWx0cy53aWR0aC5zbSB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLXNtLScgKyBkZWZhdWx0cy53aWR0aC5zbVxyXG4gIGlmIGRlZmF1bHRzLndpZHRoLm1kIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wtbWQtJyArIGRlZmF1bHRzLndpZHRoLm1kXHJcbiAgaWYgZGVmYXVsdHMud2lkdGgubGcgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1sZy0nICsgZGVmYXVsdHMud2lkdGgubGdcclxuXHJcbiAgcmV0ID0gT0ouY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcclxuICByZXRcclxuXHJcbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vb2pJbml0J1xyXG5jb250cm9sID0gcmVxdWlyZSAnLi4vZG9tL2NvbnRyb2wnXHJcblxyXG5jb250cm9sTmFtZSA9ICd5LWljb24nXHJcbmZyaWVuZGx5TmFtZSA9ICdpY29uJ1xyXG5cclxuT0ouY29udHJvbHMubWVtYmVyc1tmcmllbmRseU5hbWVdID0gY29udHJvbE5hbWVcclxuXHJcbmNudHJsID0gKG9wdGlvbnMsIG93bmVyKSAtPlxyXG4gIGRlZmF1bHRzID1cclxuICAgIGljb25PcHRzOlxyXG4gICAgICBuYW1lOiAnJ1xyXG4gICAgICBzdGFja2VkSWNvbjogJydcclxuICAgICAgc3dhcEljb246ICcnXHJcbiAgICAgIHNpemU6IGZhbHNlXHJcbiAgICAgIGNvbG9yOiAnJ1xyXG4gICAgICBsaWJyYXJ5OiAnJ1xyXG4gICAgICBpc0ZpeGVkV2lkdGg6IGZhbHNlXHJcbiAgICAgIGlzTGlzdDogZmFsc2VcclxuICAgICAgaXNTcGlubmVyOiBmYWxzZVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAnJ1xyXG4gICAgcm9vdE5vZGVUeXBlOiAnc3BhbidcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zXHJcbiAgcmV0ID0gY29udHJvbCBkZWZhdWx0cywgb3duZXIsIGNvbnRyb2xOYW1lXHJcblxyXG4gIGlzVG9nZ2xlZCA9IGZhbHNlXHJcblxyXG4gICNUT0RPOiBTdXBwb3J0IGZvciBwaWN0b2ljb25zXHJcbiAgI1RPRE86IFN1cHBvcnQgZm9yIG90aGVyIEZvbnRBd2Vzb21lIHByb3BlcnRpZXMgKHN0YWNrLCByb3RhdGUsIHNpemUsIGV0YylcclxuXHJcbiAgY2xhc3NOYW1lQmFzZSA9ICdmYSAnXHJcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuaXNGaXhlZFdpZHRoIHRoZW4gY2xhc3NOYW1lQmFzZSArPSAnZmEtZncgJ1xyXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzTGlzdCB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLWxpICdcclxuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc1NwaW5uZXIgdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1zcGluICdcclxuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zaXplXHJcbiAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zaXplID4gMSBhbmQgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSA8PSA1XHJcbiAgICAgIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5zaXplICsgJ3ggJ1xyXG5cclxuICBjbGFzc05hbWUgPSBjbGFzc05hbWVCYXNlICsgJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5uYW1lXHJcbiAgcmV0Lm15SWNvbiA9IHJldC5tYWtlICdpJywgcHJvcHM6IGNsYXNzOiBjbGFzc05hbWVcclxuXHJcbiAgI1RvZ2dsZXMgZGlzcGxheSBiZXR3ZWVuIG5vcm1hbCBpY29uIGFuZCBzd2FwIGljb24sIGlmIGEgc3dhcCBpY29uIGhhcyBiZWVuIHNwZWNpZmllZFxyXG4gIHJldC50b2dnbGVJY29uID0gLT5cclxuICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uXHJcbiAgICAgIG5ld0ljb24gPSBkZWZhdWx0cy5pY29uT3B0cy5uYW1lXHJcblxyXG4gICAgICBpc1RvZ2dsZWQgPSAhaXNUb2dnbGVkXHJcblxyXG4gICAgICBpZiBpc1RvZ2dsZWRcclxuICAgICAgICByZXQubXlJY29uLiQucmVtb3ZlQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxyXG4gICAgICAgIG5ld0ljb24gPSBkZWZhdWx0cy5pY29uT3B0cy5zd2FwSWNvblxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0Lm15SWNvbi4kLnJlbW92ZUNsYXNzKCdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMuc3dhcEljb24pXHJcblxyXG4gICAgICByZXQubXlJY29uLiQuYWRkQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxyXG5cclxuXHJcbiAgcmV0XHJcblxyXG5PSi5jb250cm9scy5yZWdpc3RlciBmcmllbmRseU5hbWUsIGNudHJsXHJcbm1vZHVsZS5leHBvcnRzID0gY250cmwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuZ2V0RGF0ZUZyb21Ebkpzb24gPSAoZG5EYXRlKSAtPlxyXG4gICAgXHJcbiAgIyBUcmFuc2Zvcm1zIGEgLk5FVCBKU09OIGRhdGUgaW50byBhIEphdmFTY3JpcHQgZGF0ZS5cclxuICAjIG5hbWU9J29iaicgIE9iamVjdCB0byB0ZXN0XHJcbiAgIyB0eXBlPSdCb29sZWFuJyAvPlxyXG4gICNcclxuICAjICAgICAgIHZhciBtaWxsaSA9IE9KLnRvLm51bWJlcihEbkRhdGUucmVwbGFjZSgvXFwvRGF0ZVxcKChcXGQrKVxcLT8oXFxkKylcXClcXC8vLCAnJDEnKSk7XHJcbiAgIyAgICAgICB2YXIgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKERuRGF0ZS5yZXBsYWNlKC9cXC9EYXRlXFwoXFxkKyhbXFwrXFwtXT9cXGQrKVxcKVxcLy8sICckMScpKTtcclxuICAjICAgICAgIHZhciBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcclxuICAjICAgICAgIHJldHVybiBuZXcgRGF0ZSgobWlsbGkgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpO1xyXG4gICMgICAgICAgXHJcbiAgICBcclxuICAjIERuIERhdGUgd2lsbCBsb29rIGxpa2UgL0RhdGUoMTMzNTc1ODQwMDAwMC0wNDAwKS8gIFxyXG4gIGRuRGF0ZVN0ciA9IE9KLnRvLnN0cmluZyhkbkRhdGUpXHJcbiAgcmV0ID0gdW5kZWZpbmVkXHJcbiAgdGlja3MgPSB1bmRlZmluZWRcclxuICBvZmZzZXQgPSB1bmRlZmluZWRcclxuICBsb2NhbE9mZnNldCA9IHVuZGVmaW5lZFxyXG4gIGFyciA9IHVuZGVmaW5lZFxyXG4gIHJldCA9IE9KLmRhdGVUaW1lTWluVmFsdWVcclxuICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eShkbkRhdGVTdHIpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnLycsICcnKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJ0RhdGUnLCAnJylcclxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCcoJywgJycpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnKScsICcnKVxyXG4gICAgYXJyID0gZG5EYXRlU3RyLnNwbGl0KCctJylcclxuICAgIGlmIGFyci5sZW5ndGggPiAxXHJcbiAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcclxuICAgICAgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKGFyclsxXSlcclxuICAgICAgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KClcclxuICAgICAgcmV0ID0gbmV3IERhdGUoKHRpY2tzIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKVxyXG4gICAgZWxzZSBpZiBhcnIubGVuZ3RoIGlzIDFcclxuICAgICAgdGlja3MgPSBPSi50by5udW1iZXIoYXJyWzBdKVxyXG4gICAgICByZXQgPSBuZXcgRGF0ZSh0aWNrcylcclxuICByZXRcclxuXHJcbiAgT0oucmVnaXN0ZXIgJ2dldERhdGVGcm9tRG5Kc29uJywgZ2V0RGF0ZUZyb21Ebkpzb25cclxuICBtb2R1bGVzLmV4cG9ydHMgPSBnZXREYXRlRnJvbURuSnNvblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuIyBXcmFwIHRoZSBleGVjdXRpb24gb2YgYSBtZXRob2QgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5ICAgICBcclxuIyBpZ25vcmUgZXJyb3JzIGZhaWxpbmcgdG8gZXhlYyBzZWxmLWV4ZWN1dGluZyBmdW5jdGlvbnMgXHJcbiMgUmV0dXJuIGEgbWV0aG9kIHdyYXBwZWQgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5XHJcbnRyeUV4ZWMgPSAodHJ5RnVuYykgLT5cclxuICAndXNlIHN0cmljdCdcclxuICByZXQgPSBmYWxzZVxyXG4gIHRoYXQgPSB0aGlzXHJcbiAgdHJ5XHJcbiAgICByZXQgPSB0cnlGdW5jLmFwcGx5KHRoYXQsIEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpICBpZiBPSi5pcy5tZXRob2QodHJ5RnVuYylcclxuICBjYXRjaCBleGNlcHRpb25cclxuICAgIGlmIChleGNlcHRpb24ubmFtZSBpcyAnVHlwZUVycm9yJyBvciBleGNlcHRpb24udHlwZSBpcyAnY2FsbGVkX25vbl9jYWxsYWJsZScpIGFuZCBleGNlcHRpb24udHlwZSBpcyAnbm9uX29iamVjdF9wcm9wZXJ0eV9sb2FkJ1xyXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0lnbm9yaW5nIGV4Y2VwdGlvbjogJywgZXhjZXB0aW9uXHJcbiAgICBlbHNlXHJcbiAgICAgIE9KLmNvbnNvbGUuZXJyb3IgZXhjZXB0aW9uXHJcbiAgZmluYWxseVxyXG5cclxuICByZXRcclxuXHJcblxyXG4gbWV0aG9kID0gKHRyeUZ1bmMpIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgdGhhdCA9IHRoaXNcclxuICAtPlxyXG4gICAgYXJncyA9IEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cywgMClcclxuICAgIGFyZ3MudW5zaGlmdCB0cnlGdW5jXHJcbiAgICBPSi50cnlFeGVjLmFwcGx5IHRoYXQsIGFyZ3NcclxuXHJcbiAgXHJcbiBcclxuIE9KLnJlZ2lzdGVyICdtZXRob2QnLCBtZXRob2RcclxuIE9KLnJlZ2lzdGVyICd0cnlFeGVjJywgdHJ5RXhlY1xyXG4gbW9kdWxlLmV4cG9ydHMgPVxyXG4gIG1ldGhvZDogbWV0aG9kXHJcbiAgdHJ5RXhlYzogdHJ5RXhlY1xyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxubnVtYmVyID0gT2JqZWN0LmNyZWF0ZShudWxsKVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ2lzTmFOJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5pc05hTikgdGhlbiBOdW1iZXIuaXNOYU4gZWxzZSBpc05hTilcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdpc0Zpbml0ZScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuaXNGaW5pdGUpIHRoZW4gTnVtYmVyLmlzRmluaXRlIGVsc2UgaXNGaW5pdGUpXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnTUFYX1ZBTFVFJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5NQVhfVkFMVUUpIHRoZW4gTnVtYmVyLk1BWF9WQUxVRSBlbHNlIDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ01JTl9WQUxVRScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuTUlOX1ZBTFVFKSB0aGVuIE51bWJlci5NSU5fVkFMVUUgZWxzZSA1ZS0zMjQpXHJcblxyXG5PSi5yZWdpc3RlciAnbnVtYmVyJywgbnVtYmVyXHJcbm1vZHVsZS5leHBvcnRzID0gbnVtYmVyIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyICQsIE9KLCBfLCBmdW5jLCBpc01ldGhvZCwgcHJvcGVydHksIHJldE9iaiwgdG87XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuaXNNZXRob2QgPSByZXF1aXJlKCcuLi90b29scy9pcycpO1xuXG5wcm9wZXJ0eSA9IHJlcXVpcmUoJy4vcHJvcGVydHknKTtcblxuZnVuYyA9IHJlcXVpcmUoJy4vZnVuY3Rpb24nKTtcblxudG8gPSByZXF1aXJlKCcuLi90b29scy90bycpO1xuXG5yZXRPYmogPSB7XG4gIG9iamVjdDogZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICBvYmogPSB7fTtcbiAgICB9XG5cbiAgICAvKlxuICAgIEFkZCBhIHByb3BlcnR5IHRvIHRoZSBvYmplY3QgYW5kIHJldHVybiBpdFxuICAgICAqL1xuICAgIG9iai5hZGQgPSBmdW5jdGlvbihuYW1lLCB2YWwpIHtcbiAgICAgIHByb3BlcnR5KG9iaiwgbmFtZSwgdmFsKTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcbiAgICBvYmouYWRkKCdlYWNoJywgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHZhciBlYWNoO1xuICAgICAgZWFjaCA9IHJlcXVpcmUoJy4uL3Rvb2xzL2VhY2gnKTtcbiAgICAgIHJldHVybiBlYWNoKG9iaiwgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKGtleSAhPT0gJ2VhY2gnICYmIGtleSAhPT0gJ2FkZCcpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sodmFsLCBrZXkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9LFxuICBpc0luc3RhbmNlT2Y6IGZ1bmN0aW9uKG5hbWUsIG9iaikge1xuICAgIHJldHVybiByZXRPYmouY29udGFpbnMobmFtZSwgb2JqKSAmJiB0by5ib29sKG9ialtuYW1lXSk7XG4gIH0sXG4gIGNvbnRhaW5zOiBmdW5jdGlvbihvYmplY3QsIGluZGV4KSB7XG4gICAgdmFyIHJldDtcbiAgICByZXQgPSBmYWxzZTtcbiAgICBpZiAob2JqZWN0KSB7XG4gICAgICByZXQgPSBfLmNvbnRhaW5zKG9iamVjdCwgaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9LFxuICBjb21wYXJlOiBmdW5jdGlvbihvYmoxLCBvYmoyKSB7XG4gICAgcmV0dXJuIF8uaXNFcXVhbChvYmoxLCBvYmoyKTtcbiAgfSxcbiAgY2xvbmU6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gXy5jbG9uZURlZXAoZGF0YSh0cnVlKSk7XG4gIH0sXG4gIHNlcmlhbGl6ZTogZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciByZXQ7XG4gICAgcmV0ID0gJyc7XG4gICAgZnVuYy50cnlFeGVjKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldCB8fCAnJztcbiAgfSxcbiAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgcmV0O1xuICAgIHJldCA9IHt9O1xuICAgIGlmIChkYXRhKSB7XG4gICAgICBmdW5jLnRyeUV4ZWMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldCA9ICQucGFyc2VKU09OKGRhdGEpO1xuICAgICAgfSk7XG4gICAgICBpZiAoaXNNZXRob2QubnVsbE9yRW1wdHkocmV0KSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSxcbiAgcGFyYW1zOiBmdW5jdGlvbihkYXRhLCBkZWxpbWl0ZXIpIHtcbiAgICB2YXIgZWFjaCwgcmV0O1xuICAgIGlmIChkZWxpbWl0ZXIgPT0gbnVsbCkge1xuICAgICAgZGVsaW1pdGVyID0gJyYnO1xuICAgIH1cbiAgICByZXQgPSAnJztcbiAgICBpZiAoZGVsaW1pdGVyID09PSAnJicpIHtcbiAgICAgIGZ1bmMudHJ5RXhlYyhmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0ID0gJC5wYXJhbShkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBlYWNoID0gcmVxdWlyZSgnLi4vdG9vbHMvZWFjaCcpO1xuICAgICAgZWFjaChkYXRhLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICBpZiAocmV0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXQgKz0gZGVsaW1pdGVyO1xuICAgICAgICB9XG4gICAgICAgIHJldCArPSBrZXkgKyAnPScgKyB2YWw7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRvLnN0cmluZyhyZXQpO1xuICB9LFxuICBleHRlbmQ6IGZ1bmN0aW9uKGRlc3RPYmosIHNyY09iaiwgZGVlcENvcHkpIHtcbiAgICB2YXIga2V5LCByZXQsIHZhbHVlO1xuICAgIGlmIChkZWVwQ29weSA9PSBudWxsKSB7XG4gICAgICBkZWVwQ29weSA9IGZhbHNlO1xuICAgIH1cbiAgICByZXQgPSBkZXN0T2JqIHx8IHt9O1xuICAgIGZvciAoa2V5IGluIHNyY09iaikge1xuICAgICAgdmFsdWUgPSBzcmNPYmpba2V5XTtcbiAgICAgIGlmIChkZWVwQ29weSAmJiB2YWx1ZSAmJiAkLmlzUGxhaW5PYmplY3QodmFsdWUpICYmICQuaXNQbGFpbk9iamVjdChyZXRba2V5XSkpIHtcbiAgICAgICAgdGhpcy5leHRlbmQocmV0W2tleV0sIHZhbHVlLCB0cnVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldFtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cbn07XG5cbk9KLnJlZ2lzdGVyKCdvYmplY3QnLCByZXRPYmoub2JqZWN0KTtcblxuT0oucmVnaXN0ZXIoJ2lzSW5zdGFuY2VPZicsIHJldE9iai5pc0luc3RhbmNlT2YpO1xuXG5PSi5yZWdpc3RlcignY29udGFpbnMnLCByZXRPYmouY29udGFpbnMpO1xuXG5PSi5yZWdpc3RlcignY29tcGFyZScsIHJldE9iai5jb21wYXJlKTtcblxuT0oucmVnaXN0ZXIoJ2Nsb25lJywgcmV0T2JqLmNsb25lKTtcblxuT0oucmVnaXN0ZXIoJ3NlcmlhbGl6ZScsIHJldE9iai5zZXJpYWxpemUpO1xuXG5PSi5yZWdpc3RlcignZGVzZXJpYWxpemUnLCByZXRPYmouZGVzZXJpYWxpemUpO1xuXG5PSi5yZWdpc3RlcigncGFyYW1zJywgcmV0T2JqLnBhcmFtcyk7XG5cbk9KLnJlZ2lzdGVyKCdleHRlbmQnLCByZXRPYmouZXh0ZW5kKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXRPYmo7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4amIzSmxYRnh2WW1wbFkzUXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRU3hKUVVGQk96dEJRVUZCTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1QwRkJVanM3UVVGRFRDeERRVUZCTEVkQlFVa3NUMEZCUVN4RFFVRlJMRkZCUVZJN08wRkJRMG9zUTBGQlFTeEhRVUZKTEU5QlFVRXNRMEZCVVN4UlFVRlNPenRCUVVOS0xGRkJRVUVzUjBGQlZ5eFBRVUZCTEVOQlFWRXNZVUZCVWpzN1FVRkRXQ3hSUVVGQkxFZEJRVmNzVDBGQlFTeERRVUZSTEZsQlFWSTdPMEZCUTFnc1NVRkJRU3hIUVVGUExFOUJRVUVzUTBGQlVTeFpRVUZTT3p0QlFVTlFMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzWVVGQlVqczdRVUZKVEN4TlFVRkJMRWRCU1VVN1JVRkJRU3hOUVVGQkxFVkJRVkVzVTBGQlF5eEhRVUZFT3p0TlFVRkRMRTFCUVUwN096dEJRVVZpT3pzN1NVRkhRU3hIUVVGSExFTkJRVU1zUjBGQlNpeEhRVUZWTEZOQlFVTXNTVUZCUkN4RlFVRlBMRWRCUVZBN1RVRkRVaXhSUVVGQkxFTkJRVk1zUjBGQlZDeEZRVUZqTEVsQlFXUXNSVUZCYjBJc1IwRkJjRUk3WVVGRFFUdEpRVVpSTzBsQlNWWXNSMEZCUnl4RFFVRkRMRWRCUVVvc1EwRkJVU3hOUVVGU0xFVkJRV2RDTEZOQlFVTXNVVUZCUkR0QlFVTmtMRlZCUVVFN1RVRkJRU3hKUVVGQkxFZEJRVThzVDBGQlFTeERRVUZSTEdWQlFWSTdZVUZEVUN4SlFVRkJMRU5CUVVzc1IwRkJUQ3hGUVVGVkxGTkJRVU1zUjBGQlJDeEZRVUZOTEVkQlFVNDdVVUZEVWl4SlFVRkhMRWRCUVVFc1MwRkJVeXhOUVVGVUxFbEJRVzlDTEVkQlFVRXNTMEZCVXl4TFFVRm9RenRwUWtGRFJTeFJRVUZCTEVOQlFWTXNSMEZCVkN4RlFVRmpMRWRCUVdRc1JVRkVSanM3VFVGRVVTeERRVUZXTzBsQlJtTXNRMEZCYUVJN1YwRk5RVHRGUVdaTkxFTkJRVkk3UlVGdlFrRXNXVUZCUVN4RlFVRmpMRk5CUVVNc1NVRkJSQ3hGUVVGUExFZEJRVkE3VjBGRFdpeE5RVUZOTEVOQlFVTXNVVUZCVUN4RFFVRm5RaXhKUVVGb1FpeEZRVUZ6UWl4SFFVRjBRaXhEUVVGQkxFbEJRU3RDTEVWQlFVVXNRMEZCUXl4SlFVRklMRU5CUVZFc1IwRkJTU3hEUVVGQkxFbEJRVUVzUTBGQldqdEZRVVJ1UWl4RFFYQkNaRHRGUVhsQ1FTeFJRVUZCTEVWQlFWVXNVMEZCUXl4TlFVRkVMRVZCUVZNc1MwRkJWRHRCUVVOU0xGRkJRVUU3U1VGQlFTeEhRVUZCTEVkQlFVMDdTVUZEVGl4SlFVRkhMRTFCUVVnN1RVRkRSU3hIUVVGQkxFZEJRVTBzUTBGQlF5eERRVUZETEZGQlFVWXNRMEZCVnl4TlFVRllMRVZCUVcxQ0xFdEJRVzVDTEVWQlJGSTdPMWRCUlVFN1JVRktVU3hEUVhwQ1ZqdEZRV2xEUVN4UFFVRkJMRVZCUVZNc1UwRkJReXhKUVVGRUxFVkJRVThzU1VGQlVEdFhRVU5RTEVOQlFVTXNRMEZCUXl4UFFVRkdMRU5CUVZVc1NVRkJWaXhGUVVGblFpeEpRVUZvUWp0RlFVUlBMRU5CYWtOVU8wVkJjME5CTEV0QlFVRXNSVUZCVHl4VFFVRkRMRWxCUVVRN1YwRkRUQ3hEUVVGRExFTkJRVU1zVTBGQlJpeERRVUZaTEVsQlFVRXNRMEZCU3l4SlFVRk1MRU5CUVZvN1JVRkVTeXhEUVhSRFVEdEZRVEpEUVN4VFFVRkJMRVZCUVZjc1UwRkJReXhKUVVGRU8wRkJRMVFzVVVGQlFUdEpRVUZCTEVkQlFVRXNSMEZCVFR0SlFVTk9MRWxCUVVrc1EwRkJReXhQUVVGTUxFTkJRV0VzVTBGQlFUdE5RVU5ZTEVkQlFVRXNSMEZCVFN4SlFVRkpMRU5CUVVNc1UwRkJUQ3hEUVVGbExFbEJRV1k3U1VGRVN5eERRVUZpTzFkQlIwRXNSMEZCUVN4SlFVRlBPMFZCVEVVc1EwRXpRMWc3UlVGdlJFRXNWMEZCUVN4RlFVRmhMRk5CUVVNc1NVRkJSRHRCUVVOWUxGRkJRVUU3U1VGQlFTeEhRVUZCTEVkQlFVMDdTVUZEVGl4SlFVRkhMRWxCUVVnN1RVRkRSU3hKUVVGSkxFTkJRVU1zVDBGQlRDeERRVUZoTEZOQlFVRTdVVUZEV0N4SFFVRkJMRWRCUVUwc1EwRkJReXhEUVVGRExGTkJRVVlzUTBGQldTeEpRVUZhTzAxQlJFc3NRMEZCWWp0TlFVbEJMRWxCUVdFc1VVRkJVU3hEUVVGRExGZEJRVlFzUTBGQmNVSXNSMEZCY2tJc1EwRkJZanRSUVVGQkxFZEJRVUVzUjBGQlRTeEhRVUZPTzA5QlRFWTdPMWRCVFVFN1JVRlNWeXhEUVhCRVlqdEZRV2RGUVN4TlFVRkJMRVZCUVZFc1UwRkJReXhKUVVGRUxFVkJRVThzVTBGQlVEdEJRVU5PTEZGQlFVRTdPMDFCUkdFc1dVRkJXVHM3U1VGRGVrSXNSMEZCUVN4SFFVRk5PMGxCUTA0c1NVRkJSeXhUUVVGQkxFdEJRV0VzUjBGQmFFSTdUVUZEUlN4SlFVRkpMRU5CUVVNc1QwRkJUQ3hEUVVGaExGTkJRVUU3VVVGRFdDeEhRVUZCTEVkQlFVMHNRMEZCUXl4RFFVRkRMRXRCUVVZc1EwRkJVU3hKUVVGU08wMUJSRXNzUTBGQllpeEZRVVJHTzB0QlFVRXNUVUZCUVR0TlFVMUZMRWxCUVVFc1IwRkJUeXhQUVVGQkxFTkJRVkVzWlVGQlVqdE5RVU5RTEVsQlFVRXNRMEZCU3l4SlFVRk1MRVZCUVZjc1UwRkJReXhIUVVGRUxFVkJRVTBzUjBGQlRqdFJRVU5VTEVsQlFYRkNMRWRCUVVjc1EwRkJReXhOUVVGS0xFZEJRV0VzUTBGQmJFTTdWVUZCUVN4SFFVRkJMRWxCUVU4c1ZVRkJVRHM3VVVGRFFTeEhRVUZCTEVsQlFVOHNSMEZCUVN4SFFVRk5MRWRCUVU0c1IwRkJXVHROUVVaV0xFTkJRVmdzUlVGUVJqczdWMEZaUVN4RlFVRkZMRU5CUVVNc1RVRkJTQ3hEUVVGVkxFZEJRVlk3UlVGa1RTeERRV2hGVWp0RlFXdEdRU3hOUVVGQkxFVkJRVkVzVTBGQlF5eFBRVUZFTEVWQlFWVXNUVUZCVml4RlFVRnJRaXhSUVVGc1FqdEJRVU5PTEZGQlFVRTdPMDFCUkhkQ0xGZEJRVmM3TzBsQlEyNURMRWRCUVVFc1IwRkJUU3hQUVVGQkxFbEJRVmM3UVVGRGFrSXNVMEZCUVN4aFFVRkJPenROUVVORkxFbEJRVWNzVVVGQlFTeEpRVUZoTEV0QlFXSXNTVUZCZFVJc1EwRkJReXhEUVVGRExHRkJRVVlzUTBGQlowSXNTMEZCYUVJc1EwRkJka0lzU1VGQmEwUXNRMEZCUXl4RFFVRkRMR0ZCUVVZc1EwRkJaMElzUjBGQlNTeERRVUZCTEVkQlFVRXNRMEZCY0VJc1EwRkJja1E3VVVGRlJTeEpRVUZETEVOQlFVRXNUVUZCUkN4RFFVRlJMRWRCUVVrc1EwRkJRU3hIUVVGQkxFTkJRVm9zUlVGQmEwSXNTMEZCYkVJc1JVRkJlVUlzU1VGQmVrSXNSVUZHUmp0UFFVRkJMRTFCUVVFN1VVRkpSU3hIUVVGSkxFTkJRVUVzUjBGQlFTeERRVUZLTEVkQlFWY3NUVUZLWWpzN1FVRkVSanRYUVUxQk8wVkJVazBzUTBGc1JsSTdPenRCUVRSR1JpeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMRkZCUVZvc1JVRkJjMElzVFVGQlRTeERRVUZETEUxQlFUZENPenRCUVVOQkxFVkJRVVVzUTBGQlF5eFJRVUZJTEVOQlFWa3NZMEZCV2l4RlFVRTBRaXhOUVVGTkxFTkJRVU1zV1VGQmJrTTdPMEZCUTBFc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeFZRVUZhTEVWQlFYZENMRTFCUVUwc1EwRkJReXhSUVVFdlFqczdRVUZEUVN4RlFVRkZMRU5CUVVNc1VVRkJTQ3hEUVVGWkxGTkJRVm9zUlVGQmRVSXNUVUZCVFN4RFFVRkRMRTlCUVRsQ096dEJRVU5CTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1QwRkJXaXhGUVVGeFFpeE5RVUZOTEVOQlFVTXNTMEZCTlVJN08wRkJRMEVzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4WFFVRmFMRVZCUVhsQ0xFMUJRVTBzUTBGQlF5eFRRVUZvUXpzN1FVRkRRU3hGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEdGQlFWb3NSVUZCTWtJc1RVRkJUU3hEUVVGRExGZEJRV3hET3p0QlFVTkJMRVZCUVVVc1EwRkJReXhSUVVGSUxFTkJRVmtzVVVGQldpeEZRVUZ6UWl4TlFVRk5MRU5CUVVNc1RVRkJOMEk3TzBGQlEwRXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3hSUVVGYUxFVkJRWE5DTEUxQlFVMHNRMEZCUXl4TlFVRTNRanM3UVVGRlFTeE5RVUZOTEVOQlFVTXNUMEZCVUN4SFFVRnBRaUlzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVQwb2dQU0J5WlhGMWFYSmxJQ2N1TGk5dmFpZGNjbHh1SkNBOUlISmxjWFZwY21VZ0oycHhkV1Z5ZVNkY2NseHVYeUE5SUhKbGNYVnBjbVVnSjJ4dlpHRnphQ2RjY2x4dWFYTk5aWFJvYjJRZ1BTQnlaWEYxYVhKbElDY3VMaTkwYjI5c2N5OXBjeWRjY2x4dWNISnZjR1Z5ZEhrZ1BTQnlaWEYxYVhKbElDY3VMM0J5YjNCbGNuUjVKMXh5WEc1bWRXNWpJRDBnY21WeGRXbHlaU0FuTGk5bWRXNWpkR2x2YmlkY2NseHVkRzhnUFNCeVpYRjFhWEpsSUNjdUxpOTBiMjlzY3k5MGJ5ZGNjbHh1WEhKY2JpTWdJeUJ2WW1wbFkzUmNjbHh1WEhKY2JuSmxkRTlpYWlBOUlGeHlYRzVjY2x4dUlDQWpJQ01qSUZ0UFNsMG9iMm91YUhSdGJDa3ViMkpxWldOMFhISmNiaUFnSXlCamNtVmhkR1VnWVc0Z2IySnFaV04wSUhkcGRHZ2dhR1ZzY0dWeUlHQmhaR1JnSUdGdVpDQmdaV0ZqYUdBZ2JXVjBhRzlrY3k1Y2NseHVJQ0J2WW1wbFkzUTZJQ2h2WW1vZ1BTQjdmU2tnTFQ1Y2NseHVJQ0FnSUZ4eVhHNGdJQ0FnSXlNalhISmNiaUFnSUNCQlpHUWdZU0J3Y205d1pYSjBlU0IwYnlCMGFHVWdiMkpxWldOMElHRnVaQ0J5WlhSMWNtNGdhWFJjY2x4dUlDQWdJQ01qSTF4eVhHNGdJQ0FnYjJKcUxtRmtaQ0E5SUNodVlXMWxMQ0IyWVd3cElDMCtYSEpjYmlBZ0lDQWdJSEJ5YjNCbGNuUjVJRzlpYWl3Z2JtRnRaU3dnZG1Gc1hISmNiaUFnSUNBZ0lHOWlhbHh5WEc1Y2NseHVJQ0FnSUc5aWFpNWhaR1FnSjJWaFkyZ25MQ0FvWTJGc2JHSmhZMnNwSUMwK1hISmNiaUFnSUNBZ0lHVmhZMmdnUFNCeVpYRjFhWEpsSUNjdUxpOTBiMjlzY3k5bFlXTm9KMXh5WEc0Z0lDQWdJQ0JsWVdOb0lHOWlhaXdnS0haaGJDd2dhMlY1S1NBdFBseHlYRzRnSUNBZ0lDQWdJR2xtSUd0bGVTQnBjMjUwSUNkbFlXTm9KeUJoYm1RZ2EyVjVJR2x6Ym5RZ0oyRmtaQ2RjY2x4dUlDQWdJQ0FnSUNBZ0lHTmhiR3hpWVdOcklIWmhiQ3dnYTJWNVhISmNibHh5WEc0Z0lDQWdiMkpxWEhKY2JseHlYRzVjY2x4dUlDQWpJQ01qSUZ0UFNsMG9iMm91YUhSdGJDa3VhWE5KYm5OMFlXNWpaVTltWEhKY2JpQWdJeUJrWlhSbGNtMXBibVZ6SUdseklHRWdkR2hwYm1jZ2FYTWdZVzRnYVc1emRHRnVZMlVnYjJZZ1lTQlVhR2x1Wnl3Z1lYTnpkVzFwYm1jZ2RHaGxJSFJvYVc1bmN5QjNaWEpsSUdGc2JDQmpjbVZoZEdWa0lHbHVJRTlLWEhKY2JpQWdhWE5KYm5OMFlXNWpaVTltT2lBb2JtRnRaU3dnYjJKcUtTQXRQbHh5WEc0Z0lDQWdjbVYwVDJKcUxtTnZiblJoYVc1ektHNWhiV1VzSUc5aWFpa2dZVzVrSUhSdkxtSnZiMndvYjJKcVcyNWhiV1ZkS1Z4eVhHNWNjbHh1SUNBaklDTWpJRnRQU2wwb2Iyb3VhSFJ0YkNrdVkyOXVkR0ZwYm5OY2NseHVJQ0FqSUhSeWRXVWdhV1lnZEdobElHQnZZbXBsWTNSZ0lHTnZiblJoYVc1eklIUm9aU0IyWVd4MVpWeHlYRzRnSUdOdmJuUmhhVzV6T2lBb2IySnFaV04wTENCcGJtUmxlQ2tnTFQ1Y2NseHVJQ0FnSUhKbGRDQTlJR1poYkhObFhISmNiaUFnSUNCcFppQnZZbXBsWTNSY2NseHVJQ0FnSUNBZ2NtVjBJRDBnWHk1amIyNTBZV2x1Y3lCdlltcGxZM1FzSUdsdVpHVjRYSEpjYmlBZ0lDQnlaWFJjY2x4dVhISmNiaUFnSXlBakl5QmJUMHBkS0c5cUxtaDBiV3dwTG1OdmJYQmhjbVZjY2x4dUlDQWpJR052YlhCaGNtVWdkSGR2SUc5aWFtVmpkSE12WVhKeVlYbHpMM1poYkhWbGN5Qm1iM0lnYzNSeWFXTjBJR1Z4ZFdGc2FYUjVYSEpjYmlBZ1kyOXRjR0Z5WlRvZ0tHOWlhakVzSUc5aWFqSXBJQzArWEhKY2JpQWdJQ0JmTG1selJYRjFZV3dnYjJKcU1Td2diMkpxTWx4eVhHNWNjbHh1SUNBaklDTWpJRnRQU2wwb2Iyb3VhSFJ0YkNrdVkyeHZibVZjY2x4dUlDQWpJR052Y0hrZ1lXeHNJRzltSUhSb1pTQjJZV3gxWlhNZ0tISmxZM1Z5YzJsMlpXeDVLU0JtY205dElHOXVaU0J2WW1wbFkzUWdkRzhnWVc1dmRHaGxjaTVjY2x4dUlDQmpiRzl1WlRvZ0tHUmhkR0VwSUMwK1hISmNiaUFnSUNCZkxtTnNiMjVsUkdWbGNDQmtZWFJoSUhSeWRXVmNjbHh1WEhKY2JpQWdJeUFqSXlCYlQwcGRLRzlxTG1oMGJXd3BMbk5sY21saGJHbDZaVnh5WEc0Z0lDTWdRMjl1ZG1WeWRDQmhiaUJ2WW1wbFkzUWdkRzhnWVNCS1UwOU9JSEpsY0hKbGMyVnVkR0YwYVc5dUlHOW1JSFJvWlNCdlltcGxZM1JjY2x4dUlDQnpaWEpwWVd4cGVtVTZJQ2hrWVhSaEtTQXRQbHh5WEc0Z0lDQWdjbVYwSUQwZ0p5ZGNjbHh1SUNBZ0lHWjFibU11ZEhKNVJYaGxZeUF0UGx4eVhHNGdJQ0FnSUNCeVpYUWdQU0JLVTA5T0xuTjBjbWx1WjJsbWVTaGtZWFJoS1Z4eVhHNGdJQ0FnSUNCeVpYUjFjbTVjY2x4dUlDQWdJSEpsZENCdmNpQW5KMXh5WEc1Y2NseHVJQ0FqSUNNaklGdFBTbDBvYjJvdWFIUnRiQ2t1WkdWelpYSnBZV3hwZW1WY2NseHVJQ0FqSUVOdmJuWmxjblFnWVNCS1UwOU9JSE4wY21sdVp5QjBieUJoYmlCdlltcGxZM1JjY2x4dUlDQmtaWE5sY21saGJHbDZaVG9nS0dSaGRHRXBJQzArWEhKY2JpQWdJQ0J5WlhRZ1BTQjdmVnh5WEc0Z0lDQWdhV1lnWkdGMFlWeHlYRzRnSUNBZ0lDQm1kVzVqTG5SeWVVVjRaV01nTFQ1Y2NseHVJQ0FnSUNBZ0lDQnlaWFFnUFNBa0xuQmhjbk5sU2xOUFRpaGtZWFJoS1Z4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymx4eVhHNWNjbHh1SUNBZ0lDQWdjbVYwSUQwZ2UzMGdJR2xtSUdselRXVjBhRzlrTG01MWJHeFBja1Z0Y0hSNUtISmxkQ2xjY2x4dUlDQWdJSEpsZEZ4eVhHNWNjbHh1SUNBaklDTWpJRnRQU2wwb2Iyb3VhSFJ0YkNrdWNHRnlZVzF6WEhKY2JpQWdJeUJEYjI1MlpYSjBJR0Z1SUc5aWFtVmpkQ0IwYnlCaElHUmxiR2x0YVhSbFpDQnNhWE4wSUc5bUlIQmhjbUZ0WlhSbGNuTWdLRzV2Y20xaGJHeDVJSEYxWlhKNUxYTjBjbWx1WnlCd1lYSmhiV1YwWlhKektWeHlYRzRnSUhCaGNtRnRjem9nS0dSaGRHRXNJR1JsYkdsdGFYUmxjaUE5SUNjbUp5a2dMVDVjY2x4dUlDQWdJSEpsZENBOUlDY25YSEpjYmlBZ0lDQnBaaUJrWld4cGJXbDBaWElnYVhNZ0p5WW5YSEpjYmlBZ0lDQWdJR1oxYm1NdWRISjVSWGhsWXlBdFBseHlYRzRnSUNBZ0lDQWdJSEpsZENBOUlDUXVjR0Z5WVcwb1pHRjBZU2xjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTVjY2x4dVhISmNiaUFnSUNCbGJITmxYSEpjYmlBZ0lDQWdJR1ZoWTJnZ1BTQnlaWEYxYVhKbElDY3VMaTkwYjI5c2N5OWxZV05vSjF4eVhHNGdJQ0FnSUNCbFlXTm9JR1JoZEdFc0lDaDJZV3dzSUd0bGVTa2dMVDVjY2x4dUlDQWdJQ0FnSUNCeVpYUWdLejBnWkdWc2FXMXBkR1Z5SUNCcFppQnlaWFF1YkdWdVozUm9JRDRnTUZ4eVhHNGdJQ0FnSUNBZ0lISmxkQ0FyUFNCclpYa2dLeUFuUFNjZ0t5QjJZV3hjY2x4dUlDQWdJQ0FnSUNCeVpYUjFjbTVjY2x4dVhISmNiaUFnSUNCMGJ5NXpkSEpwYm1jZ2NtVjBYSEpjYmx4eVhHNGdJQ01nSXlNZ1cwOUtYU2h2YWk1b2RHMXNLUzVsZUhSbGJtUmNjbHh1SUNBaklHTnZjSGtnZEdobElIQnliM0JsY25ScFpYTWdiMllnYjI1bElHOWlhbVZqZENCMGJ5QmhibTkwYUdWeUlHOWlhbVZqZEZ4eVhHNGdJR1Y0ZEdWdVpEb2dLR1JsYzNSUFltb3NJSE55WTA5aWFpd2daR1ZsY0VOdmNIa2dQU0JtWVd4elpTa2dMVDVjY2x4dUlDQWdJSEpsZENBOUlHUmxjM1JQWW1vZ2IzSWdlMzFjY2x4dUlDQWdJR1p2Y2lCclpYa3NJSFpoYkhWbElHOW1JSE55WTA5aWFseHlYRzRnSUNBZ0lDQnBaaUJrWldWd1EyOXdlU0JoYm1RZ2RtRnNkV1VnWVc1a0lDUXVhWE5RYkdGcGJrOWlhbVZqZENoMllXeDFaU2tnWVc1a0lDUXVhWE5RYkdGcGJrOWlhbVZqZENoeVpYUmJhMlY1WFNsY2NseHVJQ0FnSUNBZ0lDQWpJRzFsY21kbElHbHVkRzhnWkdWemRHbHVZWFJwYjI0Z2NISnZjR1Z5ZEhsY2NseHVJQ0FnSUNBZ0lDQkFaWGgwWlc1a0lISmxkRnRyWlhsZExDQjJZV3gxWlN3Z2RISjFaVnh5WEc0Z0lDQWdJQ0JsYkhObFhISmNiaUFnSUNBZ0lDQWdjbVYwVzJ0bGVWMGdQU0IyWVd4MVpWeHlYRzRnSUNBZ2NtVjBYSEpjYmx4eVhHNVBTaTV5WldkcGMzUmxjaUFuYjJKcVpXTjBKeXdnY21WMFQySnFMbTlpYW1WamRGeHlYRzVQU2k1eVpXZHBjM1JsY2lBbmFYTkpibk4wWVc1alpVOW1KeXdnY21WMFQySnFMbWx6U1c1emRHRnVZMlZQWmx4eVhHNVBTaTV5WldkcGMzUmxjaUFuWTI5dWRHRnBibk1uTENCeVpYUlBZbW91WTI5dWRHRnBibk5jY2x4dVQwb3VjbVZuYVhOMFpYSWdKMk52YlhCaGNtVW5MQ0J5WlhSUFltb3VZMjl0Y0dGeVpWeHlYRzVQU2k1eVpXZHBjM1JsY2lBblkyeHZibVVuTENCeVpYUlBZbW91WTJ4dmJtVmNjbHh1VDBvdWNtVm5hWE4wWlhJZ0ozTmxjbWxoYkdsNlpTY3NJSEpsZEU5aWFpNXpaWEpwWVd4cGVtVmNjbHh1VDBvdWNtVm5hWE4wWlhJZ0oyUmxjMlZ5YVdGc2FYcGxKeXdnY21WMFQySnFMbVJsYzJWeWFXRnNhWHBsWEhKY2JrOUtMbkpsWjJsemRHVnlJQ2R3WVhKaGJYTW5MQ0J5WlhSUFltb3VjR0Z5WVcxelhISmNiazlLTG5KbFoybHpkR1Z5SUNkbGVIUmxibVFuTENCeVpYUlBZbW91WlhoMFpXNWtYSEpjYmx4eVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlISmxkRTlpYWlKZGZRPT0iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG4jIyNcclxuQWRkIGEgcHJvcGVydHkgdG8gYW4gb2JqZWN0XHJcbiAgXHJcbiMjI1xyXG5wcm9wZXJ0eSA9IChvYmosIG5hbWUsIHZhbHVlLCB3cml0YWJsZSwgY29uZmlndXJhYmxlLCBlbnVtZXJhYmxlKSAtPlxyXG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGRlZmluZSBhIHByb3BlcnR5IHdpdGhvdXQgYW4gT2JqZWN0LicgIHVubGVzcyBvYmpcclxuICB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgYSBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgcHJvcGVydHkgbmFtZS4nICB1bmxlc3MgbmFtZT9cclxuICBvYmpbbmFtZV0gPSB2YWx1ZVxyXG4gIG9ialxyXG5cclxuT0oucmVnaXN0ZXIgJ3Byb3BlcnR5JywgcHJvcGVydHlcclxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmRlbGltaXRlZFN0cmluZyA9IChzdHJpbmcsIG9wdHMpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgbmV3TGluZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICBzcGFjZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICByZW1vdmVEdXBsaWNhdGVzOiB0cnVlXHJcbiAgICBkZWxpbWl0ZXI6IFwiLFwiXHJcbiAgICBpbml0U3RyaW5nOiBPSi50by5zdHJpbmcgc3RyaW5nXHJcblxyXG4gIHJldE9iaiA9XHJcbiAgICBhcnJheTogW11cclxuICAgIGRlbGltaXRlZDogLT5cclxuICAgICAgcmV0T2JqLmFycmF5LmpvaW4gZGVmYXVsdHMuZGVsaW1pdGVyXHJcblxyXG4gICAgc3RyaW5nOiAoZGVsaW1pdGVyID0gZGVmYXVsdHMuZGVsaW1pdGVyKSAtPlxyXG4gICAgICByZXQgPSAnJ1xyXG4gICAgICBPSi5lYWNoIHJldE9iai5hcnJheSwgKHZhbCkgLT5cclxuICAgICAgICByZXQgKz0gZGVsaW1pdGVyICBpZiByZXQubGVuZ3RoID4gMFxyXG4gICAgICAgIHJldCArPSB2YWxcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIHJldFxyXG5cclxuICAgIHRvU3RyaW5nOiAtPlxyXG4gICAgICByZXRPYmouc3RyaW5nKClcclxuXHJcbiAgICBhZGQ6IChzdHIpIC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5wdXNoIGRlZmF1bHRzLnBhcnNlKHN0cilcclxuICAgICAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcygpXHJcbiAgICAgIHJldE9ialxyXG5cclxuICAgIHJlbW92ZTogKHN0cikgLT5cclxuICAgICAgcmVtb3ZlID0gKGFycmF5KSAtPlxyXG4gICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgIHRydWUgIGlmIGl0ZW0gaXNudCBzdHJcclxuXHJcblxyXG4gICAgICByZXRPYmouYXJyYXkgPSByZW1vdmUocmV0T2JqLmFycmF5KVxyXG4gICAgICByZXRPYmpcclxuXHJcbiAgICBjb3VudDogLT5cclxuICAgICAgcmV0T2JqLmFycmF5Lmxlbmd0aFxyXG5cclxuICAgIGNvbnRhaW5zOiAoc3RyLCBjYXNlU2Vuc2l0aXZlKSAtPlxyXG4gICAgICBpc0Nhc2VTZW5zaXRpdmUgPSBPSi50by5ib29sKGNhc2VTZW5zaXRpdmUpXHJcbiAgICAgIHN0ciA9IE9KLnRvLnN0cmluZyhzdHIpLnRyaW0oKVxyXG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKSAgaWYgZmFsc2UgaXMgaXNDYXNlU2Vuc2l0aXZlXHJcbiAgICAgIG1hdGNoID0gcmV0T2JqLmFycmF5LmZpbHRlcigobWF0U3RyKSAtPlxyXG4gICAgICAgIChpc0Nhc2VTZW5zaXRpdmUgYW5kIE9KLnRvLnN0cmluZyhtYXRTdHIpLnRyaW0oKSBpcyBzdHIpIG9yIE9KLnRvLnN0cmluZyhtYXRTdHIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpIGlzIHN0clxyXG4gICAgICApXHJcbiAgICAgIG1hdGNoLmxlbmd0aCA+IDBcclxuXHJcbiAgICBlYWNoOiAoY2FsbEJhY2spIC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5mb3JFYWNoIGNhbGxCYWNrXHJcblxyXG4gIGRlZmF1bHRzLnBhcnNlID0gKHN0cikgLT5cclxuICAgIHJldCA9IE9KLnRvLnN0cmluZyhzdHIpXHJcbiAgICByZXQgPSByZXQucmVwbGFjZSgvXFxuL2csIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiXFxuXCIpIGlzbnQgLTEgIGlmIGRlZmF1bHRzLm5ld0xpbmVUb0RlbGltaXRlclxyXG4gICAgcmV0ID0gcmV0LnJlcGxhY2UoUmVnRXhwKFwiIFwiLCBcImdcIiksIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiIFwiKSBpc250IC0xICBpZiBkZWZhdWx0cy5zcGFjZVRvRGVsaW1pdGVyXHJcbiAgICByZXQgPSByZXQucmVwbGFjZSgvLCwvZywgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCIsLFwiKSBpc250IC0xXHJcbiAgICByZXRcclxuXHJcbiAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcyA9IC0+XHJcbiAgICBpZiBkZWZhdWx0cy5yZW1vdmVEdXBsaWNhdGVzXHJcbiAgICAgICgtPlxyXG4gICAgICAgIHVuaXF1ZSA9IChhcnJheSkgLT5cclxuICAgICAgICAgIHNlZW4gPSBuZXcgU2V0KClcclxuICAgICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgICAgaWYgZmFsc2UgaXMgc2Vlbi5oYXMoaXRlbSlcclxuICAgICAgICAgICAgICBzZWVuLmFkZCBpdGVtXHJcbiAgICAgICAgICAgICAgdHJ1ZVxyXG5cclxuXHJcbiAgICAgICAgcmV0T2JqLmFycmF5ID0gdW5pcXVlKHJldE9iai5hcnJheSlcclxuICAgICAgICByZXR1cm5cclxuICAgICAgKSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgKChhKSAtPlxyXG4gICAgaWYgYS5sZW5ndGggPiAxIGFuZCBmYWxzZSBpcyBPSi5pcy5wbGFpbk9iamVjdChvcHRzKVxyXG4gICAgICBPSi5lYWNoIGEsICh2YWwpIC0+XHJcbiAgICAgICAgcmV0T2JqLmFycmF5LnB1c2ggdmFsICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSh2YWwpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgZWxzZSBpZiBzdHJpbmcgYW5kIHN0cmluZy5sZW5ndGggPiAwXHJcbiAgICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0c1xyXG4gICAgICBkZWxpbWl0ZWRTdHJpbmcgPSBkZWZhdWx0cy5wYXJzZShzdHJpbmcpXHJcbiAgICAgIGRlZmF1bHRzLmluaXRTdHJpbmcgPSBkZWxpbWl0ZWRTdHJpbmdcclxuICAgICAgcmV0T2JqLmFycmF5ID0gZGVsaW1pdGVkU3RyaW5nLnNwbGl0KGRlZmF1bHRzLmRlbGltaXRlcilcclxuICAgIGRlZmF1bHRzLmRlbGV0ZUR1cGxpY2F0ZXMoKVxyXG4gICAgcmV0dXJuXHJcbiAgKSBhcmd1bWVudHNcclxuICByZXRPYmpcclxuXHJcblxyXG5PSi5yZWdpc3RlciAnZGVsaW1pdGVkU3RyaW5nJywgZGVsaW1pdGVkU3RyaW5nXHJcbm1vZHVsZS5leHBvcnRzID0gZGVsaW1pdGVkU3RyaW5nIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE5vZGUsIE9KLCBfLCBib2R5LCBvakJvZHk7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xuXG5cbi8qXG5QZXJzaXN0IGEgaGFuZGxlIG9uIHRoZSBib2R5IG5vZGVcbiAqL1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICBib2R5ID0gZG9jdW1lbnQuYm9keTtcbn0gZWxzZSB7XG4gIGJvZHkgPSBudWxsO1xufVxuXG5vakJvZHkgPSBuZXcgTm9kZTtcblxub2pCb2R5LmVsZW1lbnQgPSBib2R5O1xuXG5PSi5yZWdpc3RlcignYm9keScsIG9qQm9keSk7XG5cbm1vZHVsZS5leHBvcnRzID0gb2pCb2R5O1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeGtiMjFjWEdKdlpIa3VZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRU3hKUVVGQk96dEJRVUZCTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1QwRkJVanM3UVVGRFRDeERRVUZCTEVkQlFVa3NUMEZCUVN4RFFVRlJMRkZCUVZJN08wRkJRMG9zU1VGQlFTeEhRVUZQTEU5QlFVRXNRMEZCVVN4UlFVRlNPenM3UVVGSFVEczdPenRCUVVkQkxFbEJRVWNzVDBGQlR5eFJRVUZRTEV0QlFYRkNMRmRCUVhoQ08wVkJRWGxETEVsQlFVRXNSMEZCVHl4UlFVRlJMRU5CUVVNc1MwRkJla1E3UTBGQlFTeE5RVUZCTzBWQlFXMUZMRWxCUVVFc1IwRkJUeXhMUVVFeFJUczdPMEZCUTBFc1RVRkJRU3hIUVVGVExFbEJRVWs3TzBGQlEySXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUk3TzBGQlJXcENMRVZCUVVVc1EwRkJReXhSUVVGSUxFTkJRVmtzVFVGQldpeEZRVUZ2UWl4TlFVRndRanM3UVVGRFFTeE5RVUZOTEVOQlFVTXNUMEZCVUN4SFFVRnBRaUlzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVQwb2dQU0J5WlhGMWFYSmxJQ2N1TGk5dmFpZGNjbHh1WHlBOUlISmxjWFZwY21VZ0oyeHZaR0Z6YUNkY2NseHVUbTlrWlNBOUlISmxjWFZwY21VZ0p5NHZibTlrWlNkY2NseHVYSEpjYmx4eVhHNGpJeU5jY2x4dVVHVnljMmx6ZENCaElHaGhibVJzWlNCdmJpQjBhR1VnWW05a2VTQnViMlJsWEhKY2JpTWpJMXh5WEc1cFppQjBlWEJsYjJZZ1pHOWpkVzFsYm5RZ2FYTnVkQ0FuZFc1a1pXWnBibVZrSnlCMGFHVnVJR0p2WkhrZ1BTQmtiMk4xYldWdWRDNWliMlI1SUdWc2MyVWdZbTlrZVNBOUlHNTFiR3hjY2x4dWIycENiMlI1SUQwZ2JtVjNJRTV2WkdWY2NseHViMnBDYjJSNUxtVnNaVzFsYm5RZ1BTQmliMlI1WEhKY2JpQWdYSEpjYms5S0xuSmxaMmx6ZEdWeUlDZGliMlI1Snl3Z2IycENiMlI1WEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2IycENiMlI1SWwxOSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcblxyXG4jICMgY29tcG9uZW50XHJcblxyXG5cclxuIyBDcmVhdGUgYW4gSFRNTCBXZWIgQ29tcG9uZW50IHRocm91Z2ggVGhpbkRvbVxyXG5cclxuIyAtIGBvcHRpb25zYCBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzdGFuZGFyZCBvcHRpb25zIHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBjb21wb25lbnRcclxuIyAtLSBgcm9vdE5vZGVUeXBlYDogdGhlIHRhZyBuYW1lIG9mIHRoZSByb290IG5vZGUgdG8gY3JlYXRlLCBkZWZhdWx0ID0gJ2RpdidcclxuIyAtLSBgcHJvcHNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBET00gYXR0cmlidXRlcyB0byBhcHBlbmQgdG8gdGhlIHJvb3Qgbm9kZVxyXG4jIC0tIGBzdHlsZXNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBDU1MgYXR0cmlidXRlcyB0byBhcHBlbmQgdG8gdGhlIHJvb3Qgbm9kZVxyXG4jIC0tIGBldmVudHNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBuYW1lZCBET00gZXZlbnRzIChhbmQgY29ycmVzcG9uZGluZyBjYWxsYmFjayBtZXRob2RzKSB0byBiaW5kIHRvIHRoZSByb290IG5vZGVcclxuIyAtIGBvd25lcmAgdGhlIHBhcmVudCB0byB3aGljaCB0aGUgY29tcG9uZW50IG5vZGUgd2lsbCBiZSBhcHBlbmRlZFxyXG4jIC0gYHRhZ05hbWVgIHRoZSBuYW1lIG9mIG9mIHRoZSBjb21wb25lbnQsIHdoaWNoIHdpbGwgYWx3YXlzIGJlIHByZWZpeGVkIHdpdGggJ3gtJ1xyXG5jb21wb25lbnQgPSAob3B0aW9ucyA9IG9iai5vYmplY3QoKSwgb3duZXIsIHRhZ05hbWUpIC0+XHJcblxyXG4gIGlmIG5vdCB0YWdOYW1lLnN0YXJ0c1dpdGggJ3gtJyB0aGVuIHRhZ05hbWUgPSAneC0nICsgdGFnTmFtZVxyXG4gICMgd2ViIGNvbXBvbmVudHMgYXJlIHJlYWxseSBqdXN0IG9yZGluYXJ5IE9KIFtlbGVtZW50XShlbGVtZW50Lmh0bWwpJ3Mgd2l0aCBhIHNwZWNpYWwgbmFtZS5cclxuICAjIFVudGlsIEhUTUwgV2ViIENvbXBvbmVudHMgYXJlIGZ1bGx5IHN1cHBvcnRlZCAoYW5kIE9KIGlzIHJlZmFjdG9yZWQgYWNjb3JkaW5nbHkpLCB0aGUgZWxlbWVudCB3aWxsIGJlIHRyZWF0ZWQgYXMgYW4gdW5rbm93biBlbGVtZW50LlxyXG4gICMgSW4gbW9zdCBjYXNlcywgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgdGhlIGJyb3dzZXIgaXMgYWNjZXB0YWJsZSAoc2VlIGFsc28gW0hUTUwgU2VtYW50aWNzXShodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL3NlbWFudGljcy5odG1sKSksIGJ1dFxyXG4gICMgaW4gc29tZSBjYXNlcyB0aGlzIGlzIHByb2JsZW1hdGljIChmaXJzdGx5LCBiZWNhdXNlIHRoZXNlIGVsZW1lbnRzIGFyZSBhbHdheXMgcmVuZGVyZWQgaW5saW5lKS5cclxuICAjIEluIHN1Y2ggY29uZGl0aW9ucywgdGhlIFtjb250cm9sc10oY29udHJvbHMuaHRtbCkgY2xhc3MgYW5kIG5hbWUgc3BhY2UgaXMgYmV0dGVyIHN1aXRlZCB0byBjbGFzc2VzIHdoaWNoIHJlcXVpcmUgY29tcGxldGUgY29udHJvbCAoZS5nLiBbaWNvbl0oaWNvbi5odG1sKSkuXHJcbiAgd2lkZ2V0ID0gbm9kZUZhY3RvcnkgdGFnTmFtZSwgb2JqLm9iamVjdCgpLCBvd25lciwgZmFsc2UgIywgb3B0aW9ucy5wcm9wcywgb3B0aW9ucy5zdHlsZXMsIG9wdGlvbnMuZXZlbnRzLCBvcHRpb25zLnRleHRcclxuICBcclxuICAjIFNpbmNlIHRoZSBiZWhhdmlvciBvZiBzdHlsaW5nIGlzIG5vdCB3ZWxsIGNvbnRyb2xsZWQvY29udHJvbGxhYmxlIG9uIHVua25vd24gZWxlbWVudHMsIGl0IGlzIG5lY2Vzc2FyeSB0byBjcmVhdGUgYSByb290IG5vZGUgZm9yIHRoZSBjb21wb25lbnQuXHJcbiAgIyBJbiBtb3N0IGNhc2VzLCBbZGl2XShkaXYuaHRtbCkgaXMgcGVyZmVjdGx5IGFjY2VwdGFibGUsIGJ1dCB0aGlzIGlzIGNvbmZpZ3VyYWJsZSBhdCB0aGUgbmFtZSBzcGFjZSBsZXZlbCBvciBhdCBydW50aW1lLlxyXG4gIHJvb3ROb2RlVHlwZSA9IG9wdGlvbnMucm9vdE5vZGVUeXBlIG9yIE9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gb3IgJ2RpdidcclxuXHJcbiAgIyBgcmV0YCBpcyB0aGUgdGhlIGluc3RhbmNlIG9mIHRoZSByb290Tm9kZVR5cGUsIG5vdCB0aGUgYHdpZGdldGAgd3JhcHBlZCBpbiB0aGlzIGNsb3N1cmVcclxuICByZXQgPSB3aWRnZXQubWFrZSByb290Tm9kZVR5cGUsIG9wdGlvbnNcclxuXHJcbiAgIyBmb3IgY29udmVuaWVuY2UgYW5kIGRlYnVnZ2luZywgcGVyc2lzdCB0aGUgdGFnTmFtZVxyXG4gIHJldC5jb21wb25lbnROYW1lID0gdGFnTmFtZVxyXG5cclxuICAjIGByZW1vdmVgIGRvZXMsIGhvd2V2ZXIsIGJlaGF2ZSBhcyBleHBlY3RlZCBieSByZW1vdmluZyBgd2lkZ2V0YFxyXG4gIHJldC5yZW1vdmUgPSB3aWRnZXQucmVtb3ZlXHJcbiAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAnY29tcG9uZW50JywgY29tcG9uZW50XHJcbm1vZHVsZS5leHBvcnRzID0gY29tcG9uZW50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuXHJcbiMjI1xyXG5DcmVhdGUgYSBzZXQgb2YgSFRNTCBFbGVtZW50cyB0aHJvdWdoIFRoaW5Eb21cclxuIyMjXHJcbmNvbnRyb2wgPSAob3B0aW9ucyA9IG9iai5vYmplY3QoKSwgb3duZXIsIHRhZ05hbWUpIC0+XHJcbiAgaWYgbm90IHRhZ05hbWUuc3RhcnRzV2l0aCAneS0nIHRoZW4gdGFnTmFtZSA9ICd5LScgKyB0YWdOYW1lXHJcblxyXG4gIHJvb3ROb2RlVHlwZSA9IG9wdGlvbnMucm9vdE5vZGVUeXBlIG9yIE9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gb3IgJ2RpdidcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgcm9vdE5vZGVUeXBlLCBvcHRpb25zLCBvd25lciwgZmFsc2VcclxuXHJcbiAgcmV0LmFkZCAnY29udHJvbE5hbWUnLCB0YWdOYW1lXHJcblxyXG4gIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ2NvbnRyb2wnLCBjb250cm9sXHJcbm1vZHVsZS5leHBvcnRzID0gY29udHJvbCIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciAkLCBOb2RlLCBPSiwgVGhpbkRPTSwgXywgZWxlbWVudDtcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG4kID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5Ob2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XG5cblRoaW5ET00gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVGhpbkRPTSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVGhpbkRPTSddIDogbnVsbCk7XG5cbmVsZW1lbnQgPSB7XG5cbiAgLypcbiAgUmVzdG9yZSBhbiBIVE1MIEVsZW1lbnQgdGhyb3VnaCBUaGluRG9tXG4gICAqL1xuICByZXN0b3JlRWxlbWVudDogZnVuY3Rpb24oZWwsIHRhZykge1xuICAgIHZhciBub2RlO1xuICAgIGlmICh0YWcgPT0gbnVsbCkge1xuICAgICAgdGFnID0gZWwubm9kZU5hbWU7XG4gICAgfVxuICAgIGVsLm9mV3JhcHBlciB8fCAobm9kZSA9IG5ldyBOb2RlKTtcbiAgICBub2RlLmVsZW1lbnQgPSBlbDtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxufTtcblxuT0oucmVnaXN0ZXIoJ3Jlc3RvcmVFbGVtZW50JywgZWxlbWVudC5yZXN0b3JlRWxlbWVudCk7XG5cbk9KLnJlZ2lzdGVyKCdpc0VsZW1lbnRJbkRvbScsIGZ1bmN0aW9uKGVsZW1lbnRJZCkge1xuICByZXR1cm4gZmFsc2UgPT09IE9KLmlzLm51bGxPckVtcHR5KE9KLmdldEVsZW1lbnQoZWxlbWVudElkKSk7XG59KTtcblxuT0oucmVnaXN0ZXIoJ2dldEVsZW1lbnQnLCBmdW5jdGlvbihpZCkge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVsZW1lbnQ7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4a2IyMWNYR1ZzWlcxbGJuUXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRU3hKUVVGQk96dEJRVUZCTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1QwRkJVanM3UVVGRFRDeERRVUZCTEVkQlFVa3NUMEZCUVN4RFFVRlJMRkZCUVZJN08wRkJRMG9zUTBGQlFTeEhRVUZKTEU5QlFVRXNRMEZCVVN4UlFVRlNPenRCUVVOS0xFbEJRVUVzUjBGQlR5eFBRVUZCTEVOQlFWRXNVVUZCVWpzN1FVRkZVQ3hQUVVGQkxFZEJRVlVzVDBGQlFTeERRVUZSTEZOQlFWSTdPMEZCU1ZZc1QwRkJRU3hIUVVWRk96dEJRVUZCT3pzN1JVRkhRU3hqUVVGQkxFVkJRV2RDTEZOQlFVTXNSVUZCUkN4RlFVRkxMRWRCUVV3N1FVRkRaaXhSUVVGQk96dE5RVVJ2UWl4TlFVRk5MRVZCUVVVc1EwRkJRenM3U1VGRE4wSXNSVUZCUlN4RFFVRkRMRk5CUVVnc1NVRkRSU3hEUVVGQkxFbEJRVUVzUjBGQlR5eEpRVUZKTEVsQlFWZzdTVUZEUVN4SlFVRkpMRU5CUVVNc1QwRkJUQ3hIUVVGbE8xZEJRMlk3UlVGS1lTeERRVWhvUWpzN08wRkJVMFlzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4blFrRkJXaXhGUVVFNFFpeFBRVUZQTEVOQlFVTXNZMEZCZEVNN08wRkJSVUVzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4blFrRkJXaXhGUVVFNFFpeFRRVUZETEZOQlFVUTdVMEZETlVJc1MwRkJRU3hMUVVGVExFVkJRVVVzUTBGQlF5eEZRVUZGTEVOQlFVTXNWMEZCVGl4RFFVRnJRaXhGUVVGRkxFTkJRVU1zVlVGQlNDeERRVUZqTEZOQlFXUXNRMEZCYkVJN1FVRkViVUlzUTBGQk9VSTdPMEZCUjBFc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeFpRVUZhTEVWQlFUQkNMRk5CUVVNc1JVRkJSRHRGUVVONFFpeEpRVUZITEU5QlFVOHNVVUZCVUN4TFFVRnhRaXhYUVVGNFFqdFhRVU5GTEZGQlFWRXNRMEZCUXl4alFVRlVMRU5CUVhkQ0xFVkJRWGhDTEVWQlJFWTdPMEZCUkhkQ0xFTkJRVEZDT3p0QlFVdEJMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SlBTaUE5SUhKbGNYVnBjbVVnSnk0dUwyOXFKMXh5WEc0a0lEMGdjbVZ4ZFdseVpTQW5hbkYxWlhKNUoxeHlYRzVmSUQwZ2NtVnhkV2x5WlNBbmJHOWtZWE5vSjF4eVhHNU9iMlJsSUQwZ2NtVnhkV2x5WlNBbkxpOXViMlJsSjF4eVhHNWNjbHh1VkdocGJrUlBUU0E5SUhKbGNYVnBjbVVnSjNSb2FXNWtiMjBuWEhKY2JseHlYRzRqSUNNZ1pXeGxiV1Z1ZEZ4eVhHNWNjbHh1Wld4bGJXVnVkQ0E5SUZ4eVhHNGdJQ01nSXlNZ2NtVnpkRzl5WlVWc1pXMWxiblJjY2x4dUlDQWpJeU5jY2x4dUlDQlNaWE4wYjNKbElHRnVJRWhVVFV3Z1JXeGxiV1Z1ZENCMGFISnZkV2RvSUZSb2FXNUViMjFjY2x4dUlDQWpJeU5jY2x4dUlDQnlaWE4wYjNKbFJXeGxiV1Z1ZERvZ0tHVnNMQ0IwWVdjZ1BTQmxiQzV1YjJSbFRtRnRaU2tnTFQ1Y2NseHVJQ0JjZEdWc0xtOW1WM0poY0hCbGNpQnZjbHh5WEc1Y2RDQWdJQ0J1YjJSbElEMGdibVYzSUU1dlpHVmNjbHh1WEhRZ0lDQWdibTlrWlM1bGJHVnRaVzUwSUQwZ1pXeGNjbHh1WEhRZ0lDQWdibTlrWlZ4eVhHNWNjbHh1VDBvdWNtVm5hWE4wWlhJZ0ozSmxjM1J2Y21WRmJHVnRaVzUwSnl3Z1pXeGxiV1Z1ZEM1eVpYTjBiM0psUld4bGJXVnVkRnh5WEc1Y2NseHVUMG91Y21WbmFYTjBaWElnSjJselJXeGxiV1Z1ZEVsdVJHOXRKeXdnS0dWc1pXMWxiblJKWkNrZ0xUNWNjbHh1SUNCbVlXeHpaU0JwY3lCUFNpNXBjeTV1ZFd4c1QzSkZiWEIwZVNCUFNpNW5aWFJGYkdWdFpXNTBJR1ZzWlcxbGJuUkpaRnh5WEc1Y2NseHVUMG91Y21WbmFYTjBaWElnSjJkbGRFVnNaVzFsYm5RbkxDQW9hV1FwSUMwK1hISmNiaUFnYVdZZ2RIbHdaVzltSUdSdlkzVnRaVzUwSUdsemJuUWdKM1Z1WkdWbWFXNWxaQ2RjY2x4dUlDQWdJR1J2WTNWdFpXNTBMbWRsZEVWc1pXMWxiblJDZVVsa0tHbGtLVnh5WEc1Y2NseHVYSEpjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnWld4bGJXVnVkQ0pkZlE9PSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBmcmFnbWVudFxyXG5cclxuIyBDcmVhdGUgYSBkb2N1bWVudCBmcmFnbWVudCBhbmQgcmV0dXJuIGl0IGFzIGFuIE9KIG5vZGVcclxuZnJhZ21lbnQgPSAtPlxyXG4gIHJldCA9IG51bGxcclxuICBpZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xyXG4gICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcclxuICAgIFxyXG4gICAgZnJhZyA9IG5ldyBUaGluRE9NIG51bGwsIG51bGwsIGZyYWdtZW50XHJcbiAgICBmcmFnLmlzSW5ET00gPSB0cnVlXHJcbiAgICByZXQgPSBub2RlRmFjdG9yeSBmcmFnXHJcbiAgICBcclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdmcmFnbWVudCcsIGZyYWdtZW50XHJcbm1vZHVsZS5leHBvcnRzID0gZnJhZ21lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9vakluaXQnXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgZ2VuZXJpYyBub2Rlc1xyXG5cclxuY2xvc2VkID0gW1xyXG4gICdhYmJyJ1xyXG4gICdhY3JvbnltJ1xyXG4gICdhcHBsZXQnXHJcbiAgJ2FydGljbGUnXHJcbiAgJ2FzaWRlJ1xyXG4gICdhdWRpbydcclxuICAnYidcclxuICAnYmRvJ1xyXG4gICdiaWcnXHJcbiAgJ2Jsb2NrcXVvdGUnXHJcbiAgJ2J1dHRvbidcclxuICAnY2FudmFzJ1xyXG4gICdjYXB0aW9uJ1xyXG4gICdjZW50ZXInXHJcbiAgJ2NpdGUnXHJcbiAgJ2NvZGUnXHJcbiAgJ2NvbGdyb3VwJ1xyXG4gICdkYXRhbGlzdCdcclxuICAnZGQnXHJcbiAgJ2RlbCdcclxuICAnZGV0YWlscydcclxuICAnZGZuJ1xyXG4gICdkaXInXHJcbiAgJ2RpdidcclxuICAnZGwnXHJcbiAgJ2R0J1xyXG4gICdlbSdcclxuICAnZmllbGRzZXQnXHJcbiAgJ2ZpZ2NhcHRpb24nXHJcbiAgJ2ZpZ3VyZSdcclxuICAnZm9udCdcclxuICAnZm9vdGVyJ1xyXG4gICdoMSdcclxuICAnaDInXHJcbiAgJ2gzJ1xyXG4gICdoNCdcclxuICAnaDUnXHJcbiAgJ2g2J1xyXG4gICdoZWFkJ1xyXG4gICdoZWFkZXInXHJcbiAgJ2hncm91cCdcclxuICAnaHRtbCdcclxuICAnaSdcclxuICAnaWZyYW1lJ1xyXG4gICdpbnMnXHJcbiAgJ2tiZCdcclxuICAnbGFiZWwnXHJcbiAgJ2xlZ2VuZCdcclxuICAnbGknXHJcbiAgJ21hcCdcclxuICAnbWFyaydcclxuICAnbWVudSdcclxuICAnbWV0ZXInXHJcbiAgJ25hdidcclxuICAnbm9mcmFtZXMnXHJcbiAgJ25vc2NyaXB0J1xyXG4gICdvYmplY3QnXHJcbiAgJ29wdGdyb3VwJ1xyXG4gICdvcHRpb24nXHJcbiAgJ291dHB1dCdcclxuICAncCdcclxuICAncHJlJ1xyXG4gICdwcm9ncmVzcydcclxuICAncSdcclxuICAncnAnXHJcbiAgJ3J0J1xyXG4gICdydWJ5J1xyXG4gICdzJ1xyXG4gICdzYW1wJ1xyXG4gICdzZWN0aW9uJ1xyXG4gICdzbWFsbCdcclxuICAnc3BhbidcclxuICAnc3RyaWtlJ1xyXG4gICdzdHJvbmcnXHJcbiAgJ3N0eWxlJ1xyXG4gICdzdWInXHJcbiAgJ3N1bW1hcnknXHJcbiAgJ3N1cCdcclxuICAndGJvZHknXHJcbiAgJ3RkJ1xyXG4gICd0Zm9vdCdcclxuICAndGgnXHJcbiAgJ3RpbWUnXHJcbiAgJ3RpdGxlJ1xyXG4gICd0cidcclxuICAndHQnXHJcbiAgJ3UnXHJcbiAgJ3ZhcidcclxuICAndmlkZW8nXHJcbiAgJ3htcCdcclxuXVxyXG5vcGVuID0gJ2FyZWEgYmFzZSBjb2wgY29tbWFuZCBjc3MgZW1iZWQgaHIgaW1nIGtleWdlbiBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnInLnNwbGl0ICcgJ1xyXG5hbGwgPSBjbG9zZWQuY29uY2F0IG9wZW5cclxuXHJcbmV4cG9ydHMgPSB7fVxyXG4jIHJlZ2lzdGVyIHNlbWFudGljL3N0cnVjdHVyYWwgYWxpYXNlc1xyXG5mb3IgbG9vcE5hbWUgaW4gYWxsXHJcbiAgZG8gKHRhZyA9IGxvb3BOYW1lKSAtPlxyXG4gICAgbWV0aG9kID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgICAgIGRlZmF1bHRzID1cclxuICAgICAgICBwcm9wczoge31cclxuICAgICAgICBzdHlsZXM6IHt9XHJcbiAgICAgICAgZXZlbnRzOiB7fVxyXG5cclxuICAgICAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9uc1xyXG4gICAgICByZXQgPSBub2RlRmFjdG9yeSB0YWcsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgICAgIHJldFxyXG4gICAgbWV0aG9kLmRlZmF1bHRCZWhhdmlvciA9IHRydWVcclxuICAgIE9KLm5vZGVzLnJlZ2lzdGVyIHRhZywgbWV0aG9kXHJcbiAgICBleHBvcnRzW3RhZ10gPSBtZXRob2RcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jIyNcclxuQ3JlYXRlIGFuIE9KIElucHV0IE9iamVjdCB0aHJvdWdoIE9KLm5vZGVzLmlucHV0XHJcbiMjI1xyXG5pbnB1dCA9IChvcHRpb25zID0gT0oub2JqZWN0KCksIG93bmVyKSAtPlxyXG4gIGlmIG5vdCBvd25lciB0aGVuIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhbiBpbnB1dCB3aXRob3V0IGEgcGFyZW50J1xyXG4gIGlmIG5vdCBvcHRpb25zLnByb3BzIG9yIG5vdCBvcHRpb25zLnByb3BzLnR5cGUgdGhlbiB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgYW4gaW5wdXQgd2l0aG91dCBhbiBpbnB1dCB0eXBlJ1xyXG4gIHJldCA9IG93bmVyLm1ha2UgJ2lucHV0Jywgb3B0aW9uc1xyXG4gIHJldC5hZGQgJ2lucHV0TmFtZScsIG9wdGlvbnMucHJvcHMudHlwZVxyXG4gIHJldFxyXG4gICAgXHJcbk9KLnJlZ2lzdGVyICdpbnB1dCcsIGlucHV0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdXQiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCwgTm9kZSwgT0osIG1ldGhvZHM7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxubWV0aG9kcyA9IHt9O1xuXG5Ob2RlID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBOb2RlKHBhcmVudCkge31cblxuICBOb2RlLnByb3RvdHlwZS5tYWtlID0gZnVuY3Rpb24odGFnTmFtZSwgb3B0aW9ucykge1xuICAgIHZhciBtZXRob2QsIG5ld09KTm9kZTtcbiAgICBpZiAodGFnTmFtZS5tYWtlKSB7XG4gICAgICByZXR1cm4gdGFnTmFtZS5tYWtlKHRoaXMsIG9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXRob2QgPSBtZXRob2RzW3RhZ05hbWVdO1xuICAgICAgaWYgKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gbWV0aG9kKG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWV0aG9kID0gT0oubm9kZXNbdGFnTmFtZV0gfHwgT0ouY29tcG9uZW50c1t0YWdOYW1lXSB8fCBPSi5jb250cm9sc1t0YWdOYW1lXSB8fCBPSi5pbnB1dHNbdGFnTmFtZV07XG4gICAgICAgIGlmIChtZXRob2QgJiYgIW1ldGhvZC5kZWZhdWx0QmVoYXZpb3IpIHtcbiAgICAgICAgICByZXR1cm4gbWV0aG9kKG9wdGlvbnMsIHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld09KTm9kZSA9IG5ldyBOb2RlKCk7XG4gICAgICAgICAgbmV3T0pOb2RlLmVsZW1lbnQgPSBvakNyZWF0ZUVsZW1lbnQodGhpcy5lbGVtZW50LCB0YWdOYW1lLCBvcHRpb25zKTtcbiAgICAgICAgICByZXR1cm4gbmV3T0pOb2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIE5vZGUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XG4gICAgdGhpc1tuYW1lXSA9IHZhbHVlO1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQub2pXcmFwcGVyID0gdGhpcztcbiAgfTtcblxuICBOb2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgdmFyIHBhcmVudCwgdmFsdWU7XG4gICAgdmFsdWUgPSB0aGlzW25hbWVdO1xuICAgIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICBwYXJlbnQgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICB3aGlsZSAocGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgaWYgKHBhcmVudC5valdyYXBwZXIpIHtcbiAgICAgICAgICByZXR1cm4gcGFyZW50Lm9qV3JhcHBlci5nZXQobmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfTtcblxuICBOb2RlLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kLnNob3coKTtcbiAgICByZXR1cm4gb2pDcmVhdGVFbGVtZW50Lm9uU2hvdyh0aGlzLmVsZW1lbnQpO1xuICB9O1xuXG4gIE5vZGUucHJvdG90eXBlLmRpc2FibGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLiQuYXR0cignZGlzYWJsZWQnLCAnZGlzYWJsZWQnKTtcbiAgICByZXR1cm4gdGhpcy4kLmFkZENsYXNzKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICB9O1xuXG4gIE5vZGUucHJvdG90eXBlLmVuYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJC5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpO1xuICAgIHJldHVybiB0aGlzLiQucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gIH07XG5cbiAgcmV0dXJuIE5vZGU7XG5cbn0pKCk7XG5cblsnb24nLCAnZW1wdHknLCAndGV4dCcsICdyZW1vdmVDbGFzcycsICdhZGRDbGFzcycsICdoYXNDbGFzcycsICdoaWRlJywgJ2F0dHInLCAncmVtb3ZlQXR0cicsICdjc3MnLCAncmVtb3ZlJywgJ2FwcGVuZCcsICd2YWwnLCAnaHRtbCcsICdwcm9wJywgJ3RyaWdnZXInXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICByZXR1cm4gTm9kZS5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBqUXVlcnlXcmFwcGVyO1xuICAgIGpRdWVyeVdyYXBwZXIgPSB0aGlzLiQ7XG4gICAgcmV0dXJuIGpRdWVyeVdyYXBwZXJbbWV0aG9kXS5hcHBseShqUXVlcnlXcmFwcGVyLCBhcmd1bWVudHMpO1xuICB9O1xufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb2RlLnByb3RvdHlwZSwgJyQnLCB7XG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGpRdWVyeVdyYXBwZXI7XG4gICAgalF1ZXJ5V3JhcHBlciA9ICQodGhpcy5lbGVtZW50KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJyQnLCB7XG4gICAgICB2YWx1ZTogalF1ZXJ5V3JhcHBlclxuICAgIH0pO1xuICAgIHJldHVybiBqUXVlcnlXcmFwcGVyO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBPSi5Ob2RlID0gTm9kZTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRnhrYjIxY1hHNXZaR1V1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVN4SlFVRkJPenRCUVVGQkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUMEZCVWpzN1FVRkRUQ3hEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCVDBvc1QwRkJRU3hIUVVGVk96dEJRVXRLTzBWQlNWTXNZMEZCUXl4TlFVRkVMRWRCUVVFN08ybENRVVZpTEVsQlFVRXNSMEZCVFN4VFFVRkRMRTlCUVVRc1JVRkJWU3hQUVVGV08wRkJRMG9zVVVGQlFUdEpRVUZCTEVsQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVZnN1lVRkRSU3hQUVVGUExFTkJRVU1zU1VGQlVpeERRVUZoTEVsQlFXSXNSVUZCYlVJc1QwRkJia0lzUlVGRVJqdExRVUZCTEUxQlFVRTdUVUZIUlN4TlFVRkJMRWRCUVZNc1QwRkJVU3hEUVVGQkxFOUJRVUU3VFVGRGFrSXNTVUZCUnl4TlFVRklPMlZCUTBVc1RVRkJRU3hEUVVGUExFOUJRVkFzUlVGRVJqdFBRVUZCTEUxQlFVRTdVVUZIUlN4TlFVRkJMRWRCUVZNc1JVRkJSU3hEUVVGRExFdEJRVTBzUTBGQlFTeFBRVUZCTEVOQlFWUXNTVUZCY1VJc1JVRkJSU3hEUVVGRExGVkJRVmNzUTBGQlFTeFBRVUZCTEVOQlFXNURMRWxCUVN0RExFVkJRVVVzUTBGQlF5eFJRVUZUTEVOQlFVRXNUMEZCUVN4RFFVRXpSQ3hKUVVGMVJTeEZRVUZGTEVOQlFVTXNUVUZCVHl4RFFVRkJMRTlCUVVFN1VVRkRNVVlzU1VGQlJ5eE5RVUZCTEVsQlFWVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1pVRkJja0k3YVVKQlEwVXNUVUZCUVN4RFFVRlBMRTlCUVZBc1JVRkJaMElzU1VGQmFFSXNSVUZFUmp0VFFVRkJMRTFCUVVFN1ZVRkhSU3hUUVVGQkxFZEJRV2RDTEVsQlFVRXNTVUZCUVN4RFFVRkJPMVZCUTJoQ0xGTkJRVk1zUTBGQlF5eFBRVUZXTEVkQlFXOUNMR1ZCUVVFc1EwRkJaMElzU1VGQlF5eERRVUZCTEU5QlFXcENMRVZCUVRCQ0xFOUJRVEZDTEVWQlFXMURMRTlCUVc1RE8ybENRVU53UWl4VlFVeEdPMU5CU2tZN1QwRktSanM3UlVGRVNUczdhVUpCWjBKT0xFZEJRVUVzUjBGQlN5eFRRVUZETEVsQlFVUXNSVUZCVHl4TFFVRlFPMGxCUTBnc1NVRkJTeXhEUVVGQkxFbEJRVUVzUTBGQlRDeEhRVUZoTzFkQlJXSXNTVUZCUXl4RFFVRkJMRTlCUVU4c1EwRkJReXhUUVVGVUxFZEJRWEZDTzBWQlNHeENPenRwUWtGTFRDeEhRVUZCTEVkQlFVc3NVMEZCUXl4SlFVRkVPMEZCUTBnc1VVRkJRVHRKUVVGQkxFdEJRVUVzUjBGQlVTeEpRVUZMTEVOQlFVRXNTVUZCUVR0SlFVTmlMRWxCUVVjc1MwRkJRU3hMUVVGVExFMUJRVm83VFVGRFJTeE5RVUZCTEVkQlFWTXNTVUZCUXl4RFFVRkJPMEZCUTFZc1lVRkJUU3hOUVVGQkxFZEJRVk1zVFVGQlRTeERRVUZETEZWQlFYUkNPMUZCUTBVc1NVRkJSeXhOUVVGTkxFTkJRVU1zVTBGQlZqdEJRVU5GTEdsQ1FVRlBMRTFCUVUwc1EwRkJReXhUUVVGVExFTkJRVU1zUjBGQmFrSXNRMEZCY1VJc1NVRkJja0lzUlVGRVZEczdUVUZFUml4RFFVWkdPMHRCUVVFc1RVRkJRVHRoUVUxRkxFMUJUa1k3TzBWQlJrYzdPMmxDUVZWTUxFbEJRVUVzUjBGQlRTeFRRVUZCTzBsQlEwb3NTVUZCUXl4RFFVRkJMRU5CUVVNc1EwRkJReXhKUVVGSUxFTkJRVUU3VjBGRFFTeGxRVUZsTEVOQlFVTXNUVUZCYUVJc1EwRkJkVUlzU1VGQlF5eERRVUZCTEU5QlFYaENPMFZCUmtrN08ybENRVWxPTEU5QlFVRXNSMEZCVXl4VFFVRkJPMGxCUTFBc1NVRkJReXhEUVVGQkxFTkJRVU1zUTBGQlF5eEpRVUZJTEVOQlFWRXNWVUZCVWl4RlFVRnZRaXhWUVVGd1FqdFhRVU5CTEVsQlFVTXNRMEZCUVN4RFFVRkRMRU5CUVVNc1VVRkJTQ3hEUVVGWkxGVkJRVm9zUlVGQmQwSXNWVUZCZUVJN1JVRkdUenM3YVVKQlNWUXNUVUZCUVN4SFFVRlJMRk5CUVVFN1NVRkRUaXhKUVVGRExFTkJRVUVzUTBGQlF5eERRVUZETEZWQlFVZ3NRMEZCWlN4VlFVRm1PMWRCUTBFc1NVRkJReXhEUVVGQkxFTkJRVU1zUTBGQlF5eFhRVUZJTEVOQlFXVXNWVUZCWmp0RlFVWk5PenM3T3pzN1FVRkpWaXhEUVVORkxFbEJSRVlzUlVGRlJTeFBRVVpHTEVWQlIwVXNUVUZJUml4RlFVbEZMR0ZCU2tZc1JVRkxSU3hWUVV4R0xFVkJUVVVzVlVGT1JpeEZRVTlGTEUxQlVFWXNSVUZSUlN4TlFWSkdMRVZCVTBVc1dVRlVSaXhGUVZWRkxFdEJWa1lzUlVGWFJTeFJRVmhHTEVWQldVVXNVVUZhUml4RlFXRkZMRXRCWWtZc1JVRmpSU3hOUVdSR0xFVkJaVVVzVFVGbVJpeEZRV2RDUlN4VFFXaENSaXhEUVdsQ1F5eERRVUZETEU5QmFrSkdMRU5CYVVKVkxGTkJRVU1zVFVGQlJEdFRRVU5TTEVsQlFVa3NRMEZCUXl4VFFVRlZMRU5CUVVFc1RVRkJRU3hEUVVGbUxFZEJRWGxDTEZOQlFVRTdRVUZEZGtJc1VVRkJRVHRKUVVGQkxHRkJRVUVzUjBGQlowSXNTVUZCUXl4RFFVRkJPMWRCUTJwQ0xHRkJRV01zUTBGQlFTeE5RVUZCTEVOQlFVOHNRMEZCUXl4TFFVRjBRaXhEUVVFMFFpeGhRVUUxUWl4RlFVRXlReXhUUVVFelF6dEZRVVoxUWp0QlFVUnFRaXhEUVdwQ1ZqczdRVUYxUWtFc1RVRkJUU3hEUVVGRExHTkJRVkFzUTBGQmMwSXNTVUZCU1N4RFFVRkRMRk5CUVROQ0xFVkJRWE5ETEVkQlFYUkRMRVZCUTBVN1JVRkJRU3hIUVVGQkxFVkJRVXNzVTBGQlFUdEJRVU5JTEZGQlFVRTdTVUZCUVN4aFFVRkJMRWRCUVdkQ0xFTkJRVUVzUTBGQlJTeEpRVUZKTEVOQlFVTXNUMEZCVUR0SlFVTm9RaXhOUVVGTkxFTkJRVU1zWTBGQlVDeERRVUZ6UWl4SlFVRjBRaXhGUVVFMFFpeEhRVUUxUWl4RlFVTkZPMDFCUVVFc1MwRkJRU3hGUVVGUExHRkJRVkE3UzBGRVJqdFhRVWRCTzBWQlRFY3NRMEZCVER0RFFVUkdPenRCUVZWQkxFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENMRVZCUVVVc1EwRkJReXhKUVVGSUxFZEJRVlVpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklrOUtJRDBnY21WeGRXbHlaU0FuTGk0dmIyb25YSEpjYmlRZ1BTQnlaWEYxYVhKbElDZHFjWFZsY25rblhISmNibHh5WEc0aklDTWdaRzl0WEhKY2JseHlYRzVjY2x4dUl5QkZlSFJsYm1RZ1lXNGdiMkpxWldOMElIZHBkR2dnVDBvZ1JFOU5JRzFsZEdodlpITWdZVzVrSUhCeWIzQmxjblJwWlhOY2NseHVYSEpjYm0xbGRHaHZaSE1nUFNCN2ZWeHlYRzVjY2x4dVhISmNiaU1nTFNCZ1FHVnNZQ0JQWW1wbFkzUWdkRzhnWlhoMFpXNWtYSEpjYmlNZ0xTQmdjR0Z5Wlc1MFlDQndZWEpsYm5RZ2IySnFaV04wSUhSdklIZG9hV05vSUdCQVpXeGdJSGRwYkd3Z1ltVWdZWEJ3Wlc1a1pXUmNjbHh1WTJ4aGMzTWdUbTlrWlZ4eVhHNGdJRnh5WEc0Z0lDTndZWEpsYm5RNklISmxjWFZwY21Vb0p5NHZZbTlrZVNjcFhISmNiaUFnWEhKY2JpQWdZMjl1YzNSeWRXTjBiM0k2SUNod1lYSmxiblFwSUMwK1hISmNibHh5WEc0Z0lHMWhhMlU2SUNoMFlXZE9ZVzFsTENCdmNIUnBiMjV6S1NBdFBseHlYRzRnSUNBZ2FXWWdkR0ZuVG1GdFpTNXRZV3RsSUNNZ2NISnZkbWxrWldRZ1lTQmpkWE4wYjIwZ1kyOXRjRzl1Wlc1MElHUnBjbVZqZEd4NVhISmNiaUFnSUNBZ0lIUmhaMDVoYldVdWJXRnJaU0IwYUdsekxDQnZjSFJwYjI1elhISmNiaUFnSUNCbGJITmxYSEpjYmlBZ0lDQWdJRzFsZEdodlpDQTlJRzFsZEdodlpITmJkR0ZuVG1GdFpWMWNjbHh1SUNBZ0lDQWdhV1lnYldWMGFHOWtYSEpjYmlBZ0lDQWdJQ0FnYldWMGFHOWtJRzl3ZEdsdmJuTmNjbHh1SUNBZ0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNBZ0lHMWxkR2h2WkNBOUlFOUtMbTV2WkdWelczUmhaMDVoYldWZElHOXlJRTlLTG1OdmJYQnZibVZ1ZEhOYmRHRm5UbUZ0WlYwZ2IzSWdUMG91WTI5dWRISnZiSE5iZEdGblRtRnRaVjBnYjNJZ1Qwb3VhVzV3ZFhSelczUmhaMDVoYldWZFhISmNiaUFnSUNBZ0lDQWdhV1lnYldWMGFHOWtJQ1ltSUNGdFpYUm9iMlF1WkdWbVlYVnNkRUpsYUdGMmFXOXlYSEpjYmlBZ0lDQWdJQ0FnSUNCdFpYUm9iMlFnYjNCMGFXOXVjeXdnZEdocGMxeHlYRzRnSUNBZ0lDQWdJR1ZzYzJWY2NseHVJQ0FnSUNBZ0lDQWdJRzVsZDA5S1RtOWtaU0E5SUc1bGR5Qk9iMlJsS0NsY2NseHVJQ0FnSUNBZ0lDQWdJRzVsZDA5S1RtOWtaUzVsYkdWdFpXNTBJRDBnYjJwRGNtVmhkR1ZGYkdWdFpXNTBJRUJsYkdWdFpXNTBMQ0IwWVdkT1lXMWxMQ0J2Y0hScGIyNXpYSEpjYmlBZ0lDQWdJQ0FnSUNCdVpYZFBTazV2WkdWY2NseHVYSEpjYmlBZ1lXUmtPaUFvYm1GdFpTd2dkbUZzZFdVcElDMCtYSEpjYmlBZ0lDQjBhR2x6VzI1aGJXVmRJRDBnZG1Gc2RXVmNjbHh1SUNBZ0lDTWdiV0ZyWlNCemRYSmxJSGRsSUdoaGRtVWdZU0JzYVc1cklHSmhZMnNnZEc4Z2IzVnljMlZzZG1WekxDQnpieUIzWlNCallXNGdhVzVvWlhKcGRDQjJZV3gxWlhOY2NseHVJQ0FnSUVCbGJHVnRaVzUwTG05cVYzSmhjSEJsY2lBOUlIUm9hWE5jY2x4dVhISmNiaUFnWjJWME9pQW9ibUZ0WlNrZ0xUNWNjbHh1SUNBZ0lIWmhiSFZsSUQwZ2RHaHBjMXR1WVcxbFhWeHlYRzRnSUNBZ2FXWWdkbUZzZFdVZ2FYTWdkVzVrWldacGJtVmtYSEpjYmlBZ0lDQWdJSEJoY21WdWRDQTlJRUJsYkdWdFpXNTBYSEpjYmlBZ0lDQWdJSGRvYVd4bElIQmhjbVZ1ZENBOUlIQmhjbVZ1ZEM1d1lYSmxiblJPYjJSbFhISmNiaUFnSUNBZ0lDQWdhV1lnY0dGeVpXNTBMbTlxVjNKaGNIQmxjbHh5WEc0Z0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUhCaGNtVnVkQzV2YWxkeVlYQndaWEl1WjJWMElHNWhiV1ZjY2x4dUlDQWdJR1ZzYzJWY2NseHVJQ0FnSUNBZ2RtRnNkV1ZjY2x4dVhISmNiaUFnYzJodmR6b2dLQ2tnTFQ1Y2NseHVJQ0FnSUVBa0xuTm9iM2NvS1Z4eVhHNGdJQ0FnYjJwRGNtVmhkR1ZGYkdWdFpXNTBMbTl1VTJodmR5QkFaV3hsYldWdWRGeHlYRzVjY2x4dUlDQmthWE5oWW14bE9pQW9LU0F0UGx4eVhHNGdJQ0FnUUNRdVlYUjBjaUFuWkdsellXSnNaV1FuTENBblpHbHpZV0pzWldRblhISmNiaUFnSUNCQUpDNWhaR1JEYkdGemN5QW5aR2x6WVdKc1pXUW5MQ0FuWkdsellXSnNaV1FuWEhKY2JseHlYRzRnSUdWdVlXSnNaVG9nS0NrZ0xUNWNjbHh1SUNBZ0lFQWtMbkpsYlc5MlpVRjBkSElnSUNka2FYTmhZbXhsWkNkY2NseHVJQ0FnSUVBa0xuSmxiVzkyWlVOc1lYTnpJQ2RrYVhOaFlteGxaQ2RjY2x4dVhISmNibHRjY2x4dUlDQW5iMjRuWEhKY2JpQWdKMlZ0Y0hSNUoxeHlYRzRnSUNkMFpYaDBKMXh5WEc0Z0lDZHlaVzF2ZG1WRGJHRnpjeWRjY2x4dUlDQW5ZV1JrUTJ4aGMzTW5YSEpjYmlBZ0oyaGhjME5zWVhOekoxeHlYRzRnSUNkb2FXUmxKMXh5WEc0Z0lDZGhkSFJ5SjF4eVhHNGdJQ2R5WlcxdmRtVkJkSFJ5SjF4eVhHNGdJQ2RqYzNNblhISmNiaUFnSjNKbGJXOTJaU2RjY2x4dUlDQW5ZWEJ3Wlc1a0oxeHlYRzRnSUNkMllXd25YSEpjYmlBZ0oyaDBiV3duWEhKY2JpQWdKM0J5YjNBblhISmNiaUFnSjNSeWFXZG5aWEluWEhKY2JsMHVabTl5UldGamFDZ29iV1YwYUc5a0tTQXRQbHh5WEc0Z0lFNXZaR1V1Y0hKdmRHOTBlWEJsVzIxbGRHaHZaRjBnUFNBb0tTQXRQbHh5WEc0Z0lDQWdhbEYxWlhKNVYzSmhjSEJsY2lBOUlFQWtYSEpjYmlBZ0lDQnFVWFZsY25sWGNtRndjR1Z5VzIxbGRHaHZaRjB1WVhCd2JIa29hbEYxWlhKNVYzSmhjSEJsY2l3Z1lYSm5kVzFsYm5SektWeHlYRzRwWEhKY2JseHlYRzVQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb1RtOWtaUzV3Y205MGIzUjVjR1VzSUNja0p5eGNjbHh1SUNCblpYUTZJQ2dwSUMwK1hISmNiaUFnSUNCcVVYVmxjbmxYY21Gd2NHVnlJRDBnSkNoMGFHbHpMbVZzWlcxbGJuUXBYSEpjYmlBZ0lDQlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtvZEdocGN5d2dKeVFuTEZ4eVhHNGdJQ0FnSUNCMllXeDFaVG9nYWxGMVpYSjVWM0poY0hCbGNseHlYRzRnSUNBZ0tWeHlYRzRnSUNBZ2FsRjFaWEo1VjNKaGNIQmxjbHh5WEc0cFhISmNibHh5WEc1Y2NseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQlBTaTVPYjJSbElEMGdUbTlrWlNKZGZRPT0iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgTm9kZSwgTm9kZUZhY3RvcnksIE9KLCBUaGluRE9NLCBfLCBkZWZhdWx0Q3JlYXRlRWxlbWVudCwgZ2V0Tm9kZUZyb21GYWN0b3J5LCBtYWtlLFxuICBzbGljZSA9IFtdLnNsaWNlO1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbl8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG5cblRoaW5ET00gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVGhpbkRPTSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVGhpbkRPTSddIDogbnVsbCk7XG5cbk5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcblxuTm9kZUZhY3RvcnkgPSAoZnVuY3Rpb24oKSB7XG4gIE5vZGVGYWN0b3J5LnByb3RvdHlwZS5vak5vZGUgPSBudWxsO1xuXG4gIE5vZGVGYWN0b3J5LmdldCA9IGZ1bmN0aW9uKGlkLCB0YWdOYW1lKSB7XG4gICAgdmFyIGVsLCByZXQsIHRoaW5FbDtcbiAgICBpZiAodGFnTmFtZSA9PSBudWxsKSB7XG4gICAgICB0YWdOYW1lID0gJ2Rpdic7XG4gICAgfVxuICAgIHJldCA9IG51bGw7XG4gICAgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgaWYgKGVsKSB7XG4gICAgICB0aGluRWwgPSBPSi5yZXN0b3JlRWxlbWVudChlbCwgdGFnTmFtZSk7XG4gICAgfVxuICAgIGlmICh0aGluRWwpIHtcbiAgICAgIHJldCA9IG5ldyBOb2RlRmFjdG9yeShudWxsLCBudWxsLCBudWxsLCBmYWxzZSwgdGhpbkVsKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBOb2RlRmFjdG9yeS5wcm90b3R5cGUuX21ha2VBZGQgPSBmdW5jdGlvbih0YWdOYW1lLCBjb3VudCkge1xuICAgIHJldHVybiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihvcHRzKSB7XG4gICAgICAgIHZhciBtZXRob2QsIG51O1xuICAgICAgICBtZXRob2QgPSBPSi5ub2Rlc1t0YWdOYW1lXSB8fCBPSi5jb21wb25lbnRzW3RhZ05hbWVdIHx8IE9KLmNvbnRyb2xzW3RhZ05hbWVdIHx8IE9KLmlucHV0c1t0YWdOYW1lXTtcbiAgICAgICAgaWYgKG1ldGhvZCkge1xuICAgICAgICAgIG51ID0gbWV0aG9kKG9wdHMsIF90aGlzLm9qTm9kZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbnUgPSBPSi5jb21wb25lbnQobnVsbCwgX3RoaXMub2pOb2RlLCB0YWdOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnU7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpO1xuICB9O1xuXG4gIE5vZGVGYWN0b3J5LnByb3RvdHlwZS5fbWFrZVVuaXF1ZUlkID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICB2YXIgaWQ7XG4gICAgaWYgKE9KLkdFTkVSQVRFX1VOSVFVRV9JRFMpIHtcbiAgICAgIGNvdW50ICs9IDE7XG4gICAgICBpZiAoY291bnQgPD0gdGhpcy5vd25lci5jb3VudCkge1xuICAgICAgICBjb3VudCA9IHRoaXMub3duZXIuY291bnQgKyAxO1xuICAgICAgfVxuICAgICAgdGhpcy5vd25lci5jb3VudCA9IGNvdW50O1xuICAgICAgaWYgKCF0aGlzLm9qTm9kZS5nZXRJZCgpKSB7XG4gICAgICAgIGlkID0gdGhpcy5vd25lci5nZXRJZCgpIHx8ICcnO1xuICAgICAgICBpZCArPSB0aGlzLm9qTm9kZS50YWdOYW1lICsgY291bnQ7XG4gICAgICAgIHRoaXMub2pOb2RlLmF0dHIoJ2lkJywgaWQpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBOb2RlRmFjdG9yeS5wcm90b3R5cGUuX2JpbmRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5vak5vZGUpIHtcbiAgICAgIHJldHVybiBfLmZvck93bih0aGlzLm9wdGlvbnMuZXZlbnRzLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgICAgdmFyIGNhbGxiYWNrLCBpc01ldGhvZDtcbiAgICAgICAgICBpc01ldGhvZCA9IHJlcXVpcmUoJy4uL3Rvb2xzL2lzJyk7XG4gICAgICAgICAgaWYgKGlzTWV0aG9kLm1ldGhvZCh2YWwpKSB7XG4gICAgICAgICAgICBjYWxsYmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICB2YXIgZXZlbnQ7XG4gICAgICAgICAgICAgIGV2ZW50ID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgICAgICAgICAgIHJldHVybiB2YWwuYXBwbHkobnVsbCwgZXZlbnQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIF90aGlzLm9qTm9kZS4kLm9uKGtleSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgX3RoaXMub2pOb2RlLmFkZChrZXksIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gTm9kZUZhY3RvcnkodGFnMSwgb3B0aW9uczEsIG93bmVyMSwgdGhpbk5vZGUpIHtcbiAgICB0aGlzLnRhZyA9IHRhZzE7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uczE7XG4gICAgdGhpcy5vd25lciA9IG93bmVyMTtcbiAgICB0aGlzLnRoaW5Ob2RlID0gdGhpbk5vZGUgIT0gbnVsbCA/IHRoaW5Ob2RlIDogbnVsbDtcbiAgICBpZiAodGhpcy50YWcgJiYgIXRoaXMudGhpbk5vZGUpIHtcbiAgICAgIHRoaXMudGhpbk5vZGUgPSBuZXcgVGhpbkRPTSh0aGlzLnRhZywgdGhpcy5vcHRpb25zLnByb3BzKTtcbiAgICAgIHRoaXMudGhpbk5vZGUuYWRkKCd0YWdOYW1lJywgdGhpcy50YWcpO1xuICAgICAgdGhpcy50aGluTm9kZS5jc3ModGhpcy5vcHRpb25zLnN0eWxlcyk7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnRleHQpIHtcbiAgICAgICAgdGhpcy50aGluTm9kZS50ZXh0KHRoaXMub3B0aW9ucy50ZXh0KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMub3duZXIpIHtcbiAgICAgIHRoaXMubWFrZSgpO1xuICAgIH1cbiAgfVxuXG4gIE5vZGVGYWN0b3J5LnByb3RvdHlwZS5hZGRNYWtlTWV0aG9kID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICB2YXIgbWV0aG9kcztcbiAgICBtZXRob2RzID0gT0oub2JqZWN0KCk7XG4gICAgdGhpcy5vak5vZGUubWFrZSA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHRhZ05hbWUsIG9wdHMpIHtcbiAgICAgICAgdmFyIG1ldGhvZDtcbiAgICAgICAgbWV0aG9kID0gbWV0aG9kc1t0YWdOYW1lXTtcbiAgICAgICAgaWYgKCFtZXRob2QpIHtcbiAgICAgICAgICBtZXRob2QgPSBfdGhpcy5fbWFrZUFkZCh0YWdOYW1lLCBfdGhpcy5vak5vZGUsIGNvdW50KTtcbiAgICAgICAgICBtZXRob2RzW3RhZ05hbWVdID0gbWV0aG9kO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXRob2Qob3B0cyk7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpO1xuICAgIHJldHVybiB0aGlzLm9qTm9kZTtcbiAgfTtcblxuICBOb2RlRmFjdG9yeS5wcm90b3R5cGUubWFrZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb3VudCwgZmluYWxpemUsIHJlZjtcbiAgICB0aGlzLm9qTm9kZSA9IG51bGw7XG4gICAgaWYgKChyZWYgPSB0aGlzLnRoaW5Ob2RlKSAhPSBudWxsID8gcmVmLmlzRnVsbHlJbml0IDogdm9pZCAwKSB7XG4gICAgICB0aGlzLm9qTm9kZSA9IHRoaXMudGhpbk5vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2pOb2RlID0gbmV3IE5vZGUodGhpcy50aGluTm9kZSwgdGhpcy5vd25lcik7XG4gICAgICBjb3VudCA9ICh0aGlzLm93bmVyLmNvdW50ICsgMSkgfHwgMTtcbiAgICAgIGlmICh0aGlzLnRoaW5Ob2RlLnRhZ05hbWUgIT09ICdib2R5JyAmJiAhdGhpcy50aGluTm9kZS5pc0luRE9NICYmICF0aGlzLm9qTm9kZS5pc0luRE9NKSB7XG4gICAgICAgIHRoaXMuX21ha2VVbmlxdWVJZChjb3VudCk7XG4gICAgICAgIHRoaXMub3duZXIuYXBwZW5kKHRoaXMub2pOb2RlWzBdKTtcbiAgICAgICAgdGhpcy5fYmluZEV2ZW50cygpO1xuICAgICAgfVxuICAgICAgdGhpcy50aGluTm9kZS5pc0luRE9NID0gdHJ1ZTtcbiAgICAgIHRoaXMub2pOb2RlLmlzSW5ET00gPSB0cnVlO1xuICAgICAgdGhpcy5hZGRNYWtlTWV0aG9kKGNvdW50KTtcbiAgICAgIHRoaXMub2pOb2RlLmlzRnVsbHlJbml0ID0gdHJ1ZTtcbiAgICAgIGZpbmFsaXplID0gXy5vbmNlKHRoaXMub2pOb2RlLmZpbmFsaXplIHx8IE9KLm5vb3ApO1xuICAgICAgdGhpcy5vak5vZGUuZmluYWxpemUgPSBmaW5hbGl6ZTtcbiAgICAgIGZpbmFsaXplKHRoaXMub2pOb2RlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMub2pOb2RlO1xuICB9O1xuXG4gIHJldHVybiBOb2RlRmFjdG9yeTtcblxufSkoKTtcblxuZGVmYXVsdENyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbihwYXJlbnQsIHRhZywgb3B0aW9ucykge1xuICB2YXIga2V5LCBuZXdFbGVtZW50LCByZWYsIHJlZjEsIHJlZjIsIHZhbHVlO1xuICBuZXdFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBpZiAob3B0aW9ucykge1xuICAgIHJlZiA9IG9wdGlvbnMucHJvcHM7XG4gICAgZm9yIChrZXkgaW4gcmVmKSB7XG4gICAgICB2YWx1ZSA9IHJlZltrZXldO1xuICAgICAgbmV3RWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgfVxuICAgIHJlZjEgPSBvcHRpb25zLmV2ZW50cztcbiAgICBmb3IgKGtleSBpbiByZWYxKSB7XG4gICAgICB2YWx1ZSA9IHJlZjFba2V5XTtcbiAgICAgICQobmV3RWxlbWVudCkub24oa2V5LCB2YWx1ZSk7XG4gICAgfVxuICAgIHJlZjIgPSBvcHRpb25zLnN0eWxlcztcbiAgICBmb3IgKGtleSBpbiByZWYyKSB7XG4gICAgICB2YWx1ZSA9IHJlZjJba2V5XTtcbiAgICAgICQobmV3RWxlbWVudCkuY3NzKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICB2YWx1ZSA9IG9wdGlvbnMudGV4dDtcbiAgICBpZiAodmFsdWUgIT09IHZvaWQgMCkge1xuICAgICAgJChuZXdFbGVtZW50KS50ZXh0KHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhcmVudCAhPSBudWxsID8gcGFyZW50LmFwcGVuZENoaWxkKG5ld0VsZW1lbnQpIDogdm9pZCAwO1xufTtcblxuZ2V0Tm9kZUZyb21GYWN0b3J5ID0gZnVuY3Rpb24odGFnLCBvcHRpb25zLCBvd25lciwgaXNDYWxsZWRGcm9tRmFjdG9yeSwgbm9kZSkge1xuICB2YXIgbmV3T0pOb2RlO1xuICBuZXdPSk5vZGUgPSBuZXcgTm9kZSgpO1xuICBpZiAoIXdpbmRvdy5vakNyZWF0ZUVsZW1lbnQpIHtcbiAgICB3aW5kb3cub2pDcmVhdGVFbGVtZW50ID0gZGVmYXVsdENyZWF0ZUVsZW1lbnQ7XG4gIH1cbiAgbmV3T0pOb2RlLmVsZW1lbnQgPSBvakNyZWF0ZUVsZW1lbnQob3duZXIuZWxlbWVudCwgdGFnIHx8ICdkaXYnLCBvcHRpb25zKTtcbiAgcmV0dXJuIG5ld09KTm9kZTtcbn07XG5cbk9KLnJlZ2lzdGVyKCdub2RlRmFjdG9yeScsIGdldE5vZGVGcm9tRmFjdG9yeSk7XG5cbm1ha2UgPSBmdW5jdGlvbih0YWcsIG9wdGlvbnMpIHtcbiAgdmFyIG5ld09KTm9kZTtcbiAgbmV3T0pOb2RlID0gbmV3IE5vZGUoKTtcbiAgbmV3T0pOb2RlLmVsZW1lbnQgPSBvakNyZWF0ZUVsZW1lbnQobnVsbCwgdGFnIHx8ICdkaXYnLCBvcHRpb25zKTtcbiAgcmV0dXJuIG5ld09KTm9kZTtcbn07XG5cbk9KLnJlZ2lzdGVyKCdtYWtlJywgbWFrZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0Tm9kZUZyb21GYWN0b3J5O1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeGtiMjFjWEc1dlpHVkdZV04wYjNKNUxtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlFVRXNTVUZCUVN4cFJrRkJRVHRGUVVGQk96dEJRVUZCTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1QwRkJVanM3UVVGRFRDeERRVUZCTEVkQlFVa3NUMEZCUVN4RFFVRlJMRkZCUVZJN08wRkJRMG9zVDBGQlFTeEhRVUZWTEU5QlFVRXNRMEZCVVN4VFFVRlNPenRCUVVOV0xFbEJRVUVzUjBGQlR5eFBRVUZCTEVOQlFWRXNVVUZCVWpzN1FVRXJSVVE3ZDBKQlJVb3NUVUZCUVN4SFFVRlJPenRGUVVWU0xGZEJRVU1zUTBGQlFTeEhRVUZFTEVkQlFVMHNVMEZCUXl4RlFVRkVMRVZCUVVzc1QwRkJURHRCUVVOS0xGRkJRVUU3TzAxQlJGTXNWVUZCVlRzN1NVRkRia0lzUjBGQlFTeEhRVUZOTzBsQlEwNHNSVUZCUVN4SFFVRkxMRkZCUVZFc1EwRkJReXhqUVVGVUxFTkJRWGRDTEVWQlFYaENPMGxCUTB3c1NVRkJSeXhGUVVGSU8wMUJRMFVzVFVGQlFTeEhRVUZUTEVWQlFVVXNRMEZCUXl4alFVRklMRU5CUVd0Q0xFVkJRV3hDTEVWQlFYTkNMRTlCUVhSQ0xFVkJSRmc3TzBsQlJVRXNTVUZCUnl4TlFVRklPMDFCUTBVc1IwRkJRU3hIUVVGVkxFbEJRVUVzVjBGQlFTeERRVUZaTEVsQlFWb3NSVUZCYTBJc1NVRkJiRUlzUlVGQmQwSXNTVUZCZUVJc1JVRkJPRUlzUzBGQk9VSXNSVUZCY1VNc1RVRkJja01zUlVGRVdqczdWMEZIUVR0RlFWSkpPenQzUWtGVlRpeFJRVUZCTEVkQlFWVXNVMEZCUXl4UFFVRkVMRVZCUVZVc1MwRkJWanRYUVVOU0xFTkJRVUVzVTBGQlFTeExRVUZCTzJGQlFVRXNVMEZCUXl4SlFVRkVPMEZCUTBVc1dVRkJRVHRSUVVGQkxFMUJRVUVzUjBGQlV5eEZRVUZGTEVOQlFVTXNTMEZCVFN4RFFVRkJMRTlCUVVFc1EwRkJWQ3hKUVVGeFFpeEZRVUZGTEVOQlFVTXNWVUZCVnl4RFFVRkJMRTlCUVVFc1EwRkJia01zU1VGQkswTXNSVUZCUlN4RFFVRkRMRkZCUVZNc1EwRkJRU3hQUVVGQkxFTkJRVE5FTEVsQlFYVkZMRVZCUVVVc1EwRkJReXhOUVVGUExFTkJRVUVzVDBGQlFUdFJRVU14Uml4SlFVRkhMRTFCUVVnN1ZVRkRSU3hGUVVGQkxFZEJRVXNzVFVGQlFTeERRVUZQTEVsQlFWQXNSVUZCWVN4TFFVRkRMRU5CUVVFc1RVRkJaQ3hGUVVSUU8xTkJRVUVzVFVGQlFUdFZRVWRGTEVWQlFVRXNSMEZCU3l4RlFVRkZMRU5CUVVNc1UwRkJTQ3hEUVVGaExFbEJRV0lzUlVGQmJVSXNTMEZCUXl4RFFVRkJMRTFCUVhCQ0xFVkJRVFJDTEU5QlFUVkNMRVZCU0ZBN08yVkJTMEU3VFVGUVJqdEpRVUZCTEVOQlFVRXNRMEZCUVN4RFFVRkJMRWxCUVVFN1JVRkVVVHM3ZDBKQlZWWXNZVUZCUVN4SFFVRmxMRk5CUVVNc1MwRkJSRHRCUVVOaUxGRkJRVUU3U1VGQlFTeEpRVUZITEVWQlFVVXNRMEZCUXl4dFFrRkJUanROUVVORkxFdEJRVUVzU1VGQlV6dE5RVU5VTEVsQlFVY3NTMEZCUVN4SlFVRlRMRWxCUVVNc1EwRkJRU3hMUVVGTExFTkJRVU1zUzBGQmJrSTdVVUZCT0VJc1MwRkJRU3hIUVVGUkxFbEJRVU1zUTBGQlFTeExRVUZMTEVOQlFVTXNTMEZCVUN4SFFVRmxMRVZCUVhKRU96dE5RVU5CTEVsQlFVTXNRMEZCUVN4TFFVRkxMRU5CUVVNc1MwRkJVQ3hIUVVGbE8wMUJSV1lzU1VGQlJ5eERRVUZKTEVsQlFVTXNRMEZCUVN4TlFVRk5MRU5CUVVNc1MwRkJVaXhEUVVGQkxFTkJRVkE3VVVGRFJTeEZRVUZCTEVkQlFVc3NTVUZCUXl4RFFVRkJMRXRCUVVzc1EwRkJReXhMUVVGUUxFTkJRVUVzUTBGQlFTeEpRVUZyUWp0UlFVTjJRaXhGUVVGQkxFbEJRVTBzU1VGQlF5eERRVUZCTEUxQlFVMHNRMEZCUXl4UFFVRlNMRWRCUVd0Q08xRkJRM2hDTEVsQlFVTXNRMEZCUVN4TlFVRk5MRU5CUVVNc1NVRkJVaXhEUVVGaExFbEJRV0lzUlVGQmJVSXNSVUZCYmtJc1JVRklSanRQUVV4R096dEZRVVJoT3p0M1FrRlpaaXhYUVVGQkxFZEJRV0VzVTBGQlFUdEpRVU5ZTEVsQlFVY3NTVUZCUXl4RFFVRkJMRTFCUVVvN1lVRkJaMElzUTBGQlF5eERRVUZETEUxQlFVWXNRMEZCVXl4SlFVRkRMRU5CUVVFc1QwRkJUeXhEUVVGRExFMUJRV3hDTEVWQlFUQkNMRU5CUVVFc1UwRkJRU3hMUVVGQk8yVkJRVUVzVTBGQlF5eEhRVUZFTEVWQlFVMHNSMEZCVGp0QlFVTjRReXhqUVVGQk8xVkJRVUVzVVVGQlFTeEhRVUZYTEU5QlFVRXNRMEZCVVN4aFFVRlNPMVZCUTFnc1NVRkJSeXhSUVVGUkxFTkJRVU1zVFVGQlZDeERRVUZuUWl4SFFVRm9RaXhEUVVGSU8xbEJRMFVzVVVGQlFTeEhRVUZYTEZOQlFVRTdRVUZCWXl4clFrRkJRVHRqUVVGaU8zRkNRVUZoTEVkQlFVRXNZVUZCU1N4TFFVRktPMWxCUVdRN1dVRkRXQ3hMUVVGRExFTkJRVUVzVFVGQlRTeERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRldMRU5CUVdFc1IwRkJZaXhGUVVGclFpeFJRVUZzUWp0WlFVTkJMRXRCUVVNc1EwRkJRU3hOUVVGTkxFTkJRVU1zUjBGQlVpeERRVUZaTEVkQlFWb3NSVUZCYVVJc1VVRkJha0k3YlVKQlEwRXNTMEZLUmpzN1VVRkdkME03VFVGQlFTeERRVUZCTEVOQlFVRXNRMEZCUVN4SlFVRkJMRU5CUVRGQ0xFVkJRV2hDT3p0RlFVUlhPenRGUVZOQkxIRkNRVUZETEVsQlFVUXNSVUZCVHl4UlFVRlFMRVZCUVdsQ0xFMUJRV3BDTEVWQlFYbENMRkZCUVhwQ08wbEJRVU1zU1VGQlF5eERRVUZCTEUxQlFVUTdTVUZCVFN4SlFVRkRMRU5CUVVFc1ZVRkJSRHRKUVVGVkxFbEJRVU1zUTBGQlFTeFJRVUZFTzBsQlFWRXNTVUZCUXl4RFFVRkJMRGhDUVVGRUxGZEJRVms3U1VGRGFFUXNTVUZCUnl4SlFVRkRMRU5CUVVFc1IwRkJSQ3hKUVVGVExFTkJRVWtzU1VGQlF5eERRVUZCTEZGQlFXcENPMDFCUTBVc1NVRkJReXhEUVVGQkxGRkJRVVFzUjBGQlowSXNTVUZCUVN4UFFVRkJMRU5CUVZFc1NVRkJReXhEUVVGQkxFZEJRVlFzUlVGQll5eEpRVUZETEVOQlFVRXNUMEZCVHl4RFFVRkRMRXRCUVhaQ08wMUJRMmhDTEVsQlFVTXNRMEZCUVN4UlFVRlJMRU5CUVVNc1IwRkJWaXhEUVVGakxGTkJRV1FzUlVGQmVVSXNTVUZCUXl4RFFVRkJMRWRCUVRGQ08wMUJRMEVzU1VGQlF5eERRVUZCTEZGQlFWRXNRMEZCUXl4SFFVRldMRU5CUVdNc1NVRkJReXhEUVVGQkxFOUJRVThzUTBGQlF5eE5RVUYyUWp0TlFVTkJMRWxCUVVjc1NVRkJReXhEUVVGQkxFOUJRVThzUTBGQlF5eEpRVUZhTzFGQlFYTkNMRWxCUVVNc1EwRkJRU3hSUVVGUkxFTkJRVU1zU1VGQlZpeERRVUZsTEVsQlFVTXNRMEZCUVN4UFFVRlBMRU5CUVVNc1NVRkJlRUlzUlVGQmRFSTdUMEZLUmpzN1NVRk5RU3hKUVVGSExFbEJRVU1zUTBGQlFTeExRVUZLTzAxQlEwVXNTVUZCUXl4RFFVRkJMRWxCUVVRc1EwRkJRU3hGUVVSR096dEZRVkJYT3p0M1FrRlZZaXhoUVVGQkxFZEJRV1VzVTBGQlF5eExRVUZFTzBGQlEySXNVVUZCUVR0SlFVRkJMRTlCUVVFc1IwRkJWU3hGUVVGRkxFTkJRVU1zVFVGQlNDeERRVUZCTzBsQlExWXNTVUZCUXl4RFFVRkJMRTFCUVUwc1EwRkJReXhKUVVGU0xFZEJRV1VzUTBGQlFTeFRRVUZCTEV0QlFVRTdZVUZCUVN4VFFVRkRMRTlCUVVRc1JVRkJWU3hKUVVGV08wRkJRMklzV1VGQlFUdFJRVUZCTEUxQlFVRXNSMEZCVXl4UFFVRlJMRU5CUVVFc1QwRkJRVHRSUVVOcVFpeEpRVUZITEVOQlFVa3NUVUZCVUR0VlFVTkZMRTFCUVVFc1IwRkJVeXhMUVVGRExFTkJRVUVzVVVGQlJDeERRVUZWTEU5QlFWWXNSVUZCYlVJc1MwRkJReXhEUVVGQkxFMUJRWEJDTEVWQlFUUkNMRXRCUVRWQ08xVkJRMVFzVDBGQlVTeERRVUZCTEU5QlFVRXNRMEZCVWl4SFFVRnRRaXhQUVVaeVFqczdaVUZIUVN4TlFVRkJMRU5CUVU4c1NVRkJVRHROUVV4aE8wbEJRVUVzUTBGQlFTeERRVUZCTEVOQlFVRXNTVUZCUVR0WFFVMW1MRWxCUVVNc1EwRkJRVHRGUVZKWk96dDNRa0ZWWml4SlFVRkJMRWRCUVUwc1UwRkJRVHRCUVVWS0xGRkJRVUU3U1VGQlFTeEpRVUZETEVOQlFVRXNUVUZCUkN4SFFVRlZPMGxCUlZZc2RVTkJRVmtzUTBGQlJTeHZRa0ZCWkR0TlFVRXJRaXhKUVVGRExFTkJRVUVzVFVGQlJDeEhRVUZWTEVsQlFVTXNRMEZCUVN4VFFVRXhRenRMUVVGQkxFMUJRVUU3VFVGUFJTeEpRVUZETEVOQlFVRXNUVUZCUkN4SFFVRmpMRWxCUVVFc1NVRkJRU3hEUVVGTExFbEJRVU1zUTBGQlFTeFJRVUZPTEVWQlFXZENMRWxCUVVNc1EwRkJRU3hMUVVGcVFqdE5RVU5rTEV0QlFVRXNSMEZCVVN4RFFVRkRMRWxCUVVNc1EwRkJRU3hMUVVGTExFTkJRVU1zUzBGQlVDeEhRVUZsTEVOQlFXaENMRU5CUVVFc1NVRkJjMEk3VFVGSE9VSXNTVUZCUnl4SlFVRkRMRU5CUVVFc1VVRkJVU3hEUVVGRExFOUJRVllzUzBGQmRVSXNUVUZCZGtJc1NVRkJhME1zUTBGQlNTeEpRVUZETEVOQlFVRXNVVUZCVVN4RFFVRkRMRTlCUVdoRUxFbEJRVFJFTEVOQlFVa3NTVUZCUXl4RFFVRkJMRTFCUVUwc1EwRkJReXhQUVVFelJUdFJRVU5GTEVsQlFVTXNRMEZCUVN4aFFVRkVMRU5CUVdVc1MwRkJaanRSUVVOQkxFbEJRVU1zUTBGQlFTeExRVUZMTEVOQlFVTXNUVUZCVUN4RFFVRmpMRWxCUVVNc1EwRkJRU3hOUVVGUExFTkJRVUVzUTBGQlFTeERRVUYwUWp0UlFVVkJMRWxCUVVNc1EwRkJRU3hYUVVGRUxFTkJRVUVzUlVGS1JqczdUVUZOUVN4SlFVRkRMRU5CUVVFc1VVRkJVU3hEUVVGRExFOUJRVllzUjBGQmIwSTdUVUZEY0VJc1NVRkJReXhEUVVGQkxFMUJRVTBzUTBGQlF5eFBRVUZTTEVkQlFXdENPMDFCUjJ4Q0xFbEJRVU1zUTBGQlFTeGhRVUZFTEVOQlFXVXNTMEZCWmp0TlFVZEJMRWxCUVVNc1EwRkJRU3hOUVVGTkxFTkJRVU1zVjBGQlVpeEhRVUZ6UWp0TlFVZDBRaXhSUVVGQkxFZEJRVmNzUTBGQlF5eERRVUZETEVsQlFVWXNRMEZCVHl4SlFVRkRMRU5CUVVFc1RVRkJUU3hEUVVGRExGRkJRVklzU1VGQmIwSXNSVUZCUlN4RFFVRkRMRWxCUVRsQ08wMUJRMWdzU1VGQlF5eERRVUZCTEUxQlFVMHNRMEZCUXl4UlFVRlNMRWRCUVcxQ08wMUJRMjVDTEZGQlFVRXNRMEZCVXl4SlFVRkRMRU5CUVVFc1RVRkJWaXhGUVRkQ1JqczdWMEVyUWtFc1NVRkJReXhEUVVGQk8wVkJia05IT3pzN096czdRVUZ4UTFJc2IwSkJRVUVzUjBGQmRVSXNVMEZCUXl4TlFVRkVMRVZCUVZNc1IwRkJWQ3hGUVVGakxFOUJRV1E3UVVGRGNrSXNUVUZCUVR0RlFVRkJMRlZCUVVFc1IwRkJZU3hSUVVGUkxFTkJRVU1zWVVGQlZDeERRVUYxUWl4SFFVRjJRanRGUVVOaUxFbEJRVWNzVDBGQlNEdEJRVU5GTzBGQlFVRXNVMEZCUVN4VlFVRkJPenROUVVORkxGVkJRVlVzUTBGQlF5eFpRVUZZTEVOQlFYZENMRWRCUVhoQ0xFVkJRVFpDTEV0QlFUZENPMEZCUkVZN1FVRkZRVHRCUVVGQkxGTkJRVUVzVjBGQlFUczdUVUZEUlN4RFFVRkJMRU5CUVVVc1ZVRkJSaXhEUVVGaExFTkJRVU1zUlVGQlpDeERRVUZwUWl4SFFVRnFRaXhGUVVGelFpeExRVUYwUWp0QlFVUkdPMEZCUlVFN1FVRkJRU3hUUVVGQkxGZEJRVUU3TzAxQlEwVXNRMEZCUVN4RFFVRkZMRlZCUVVZc1EwRkJZU3hEUVVGRExFZEJRV1FzUTBGQmEwSXNSMEZCYkVJc1JVRkJkVUlzUzBGQmRrSTdRVUZFUmp0SlFVVkJMRXRCUVVFc1IwRkJVU3hQUVVGUExFTkJRVU03U1VGRGFFSXNTVUZCUnl4TFFVRkJMRXRCUVZjc1RVRkJaRHROUVVORkxFTkJRVUVzUTBGQlJTeFZRVUZHTEVOQlFXRXNRMEZCUXl4SlFVRmtMRU5CUVcxQ0xFdEJRVzVDTEVWQlJFWTdTMEZTUmpzN01FSkJWVUVzVFVGQlRTeERRVUZGTEZkQlFWSXNRMEZCYjBJc1ZVRkJjRUk3UVVGYWNVSTdPMEZCWTNaQ0xHdENRVUZCTEVkQlFYRkNMRk5CUVVNc1IwRkJSQ3hGUVVGTkxFOUJRVTRzUlVGQlpTeExRVUZtTEVWQlFYTkNMRzFDUVVGMFFpeEZRVUV5UXl4SlFVRXpRenRCUVVOdVFpeE5RVUZCTzBWQlFVRXNVMEZCUVN4SFFVRm5RaXhKUVVGQkxFbEJRVUVzUTBGQlFUdEZRVU5vUWl4SlFVRkhMRU5CUVVNc1RVRkJUU3hEUVVGRExHVkJRVmc3U1VGRFJTeE5RVUZOTEVOQlFVTXNaVUZCVUN4SFFVRjVRaXh4UWtGRU0wSTdPMFZCUlVFc1UwRkJVeXhEUVVGRExFOUJRVllzUjBGQmIwSXNaVUZCUVN4RFFVRm5RaXhMUVVGTExFTkJRVU1zVDBGQmRFSXNSVUZCSzBJc1IwRkJRU3hKUVVGUExFdEJRWFJETEVWQlFUWkRMRTlCUVRkRE8xTkJRM0JDTzBGQlRHMUNPenRCUVU5eVFpeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMR0ZCUVZvc1JVRkJNa0lzYTBKQlFUTkNPenRCUVVWQkxFbEJRVUVzUjBGQlR5eFRRVUZETEVkQlFVUXNSVUZCVFN4UFFVRk9PMEZCUTB3c1RVRkJRVHRGUVVGQkxGTkJRVUVzUjBGQlowSXNTVUZCUVN4SlFVRkJMRU5CUVVFN1JVRkRhRUlzVTBGQlV5eERRVUZETEU5QlFWWXNSMEZCYjBJc1pVRkJRU3hEUVVGblFpeEpRVUZvUWl4RlFVRnpRaXhIUVVGQkxFbEJRVThzUzBGQk4wSXNSVUZCYjBNc1QwRkJjRU03VTBGRGNFSTdRVUZJU3pzN1FVRkxVQ3hGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEUxQlFWb3NSVUZCYjBJc1NVRkJjRUk3TzBGQlNVRXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklrOUtJRDBnY21WeGRXbHlaU0FuTGk0dmIyb25YSEpjYmw4Z1BTQnlaWEYxYVhKbElDZHNiMlJoYzJnblhISmNibFJvYVc1RVQwMGdQU0J5WlhGMWFYSmxJQ2QwYUdsdVpHOXRKMXh5WEc1T2IyUmxJRDBnY21WeGRXbHlaU0FuTGk5dWIyUmxKMXh5WEc1Y2NseHVJMk5zYjNObFpDQTlJQ2RoSUdGaVluSWdZV055YjI1NWJTQmhaR1J5WlhOeklHRndjR3hsZENCaGNuUnBZMnhsSUdGemFXUmxJR0YxWkdsdklHSWdZbVJ2SUdKcFp5QmliRzlqYTNGMWIzUmxJR0p2WkhrZ1luVjBkRzl1SUdOaGJuWmhjeUJqWVhCMGFXOXVJR05sYm5SbGNpQmphWFJsSUdOdlpHVWdZMjlzWjNKdmRYQWdZMjl0YldGdVpDQmtZWFJoYkdsemRDQmtaQ0JrWld3Z1pHVjBZV2xzY3lCa1ptNGdaR2x5SUdScGRpQmtiQ0JrZENCbGJTQmxiV0psWkNCbWFXVnNaSE5sZENCbWFXZGpZWEIwYVc5dUlHWnBaM1Z5WlNCbWIyNTBJR1p2YjNSbGNpQm1iM0p0SUdaeVlXMWxjMlYwSUdneElHZ3lJR2d6SUdnMElHZzFJR2cySUdobFlXUWdhR1ZoWkdWeUlHaG5jbTkxY0NCb2RHMXNJR2tnYVdaeVlXMWxJR2x1Y3lCclpYbG5aVzRnYTJKa0lHeGhZbVZzSUd4bFoyVnVaQ0JzYVNCdFlYQWdiV0Z5YXlCdFpXNTFJRzFsZEdWeUlHNWhkaUJ1YjJaeVlXMWxjeUJ1YjNOamNtbHdkQ0J2WW1wbFkzUWdiMndnYjNCMFozSnZkWEFnYjNCMGFXOXVJRzkxZEhCMWRDQndJSEJ5WlNCd2NtOW5jbVZ6Y3lCeElISndJSEowSUhKMVlua2djeUJ6WVcxd0lITmpjbWx3ZENCelpXTjBhVzl1SUhObGJHVmpkQ0J6YldGc2JDQnpiM1Z5WTJVZ2MzQmhiaUJ6ZEhKcGEyVWdjM1J5YjI1bklITjBlV3hsSUhOMVlpQnpkVzF0WVhKNUlITjFjQ0IwWVdKc1pTQjBZbTlrZVNCMFpDQjBaWGgwWVhKbFlTQjBabTl2ZENCMGFDQjBhR1ZoWkNCMGFXMWxJSFJwZEd4bElIUnlJSFIwSUhVZ2RXd2dkbUZ5SUhacFpHVnZJSGRpY2lCNGJYQW5Mbk53YkdsMElDY2dKMXh5WEc0amIzQmxiaUE5SUNkaGNtVmhJR0poYzJVZ1luSWdZMjlzSUdOdmJXMWhibVFnWTNOeklDRkVUME5VV1ZCRklHVnRZbVZrSUdoeUlHbHRaeUJwYm5CMWRDQnJaWGxuWlc0Z2JHbHVheUJ0WlhSaElIQmhjbUZ0SUhOdmRYSmpaU0IwY21GamF5QjNZbkluTG5Od2JHbDBJQ2NnSjF4eVhHNGpYSEpjYmlOdVpYTjBZV0pzWlU1dlpHVk9ZVzFsY3lBOUlGdGNjbHh1SXlBZ0oyUnBkaWRjY2x4dUl5QWdKM053WVc0blhISmNiaU1nSUNkb01TZGNjbHh1SXlBZ0oyZ3lKMXh5WEc0aklDQW5hRE1uWEhKY2JpTWdJQ2RvTkNkY2NseHVJeUFnSjJnMUoxeHlYRzRqSUNBbmFEWW5YSEpjYmlNZ0lDZHdKMXh5WEc0aklDQW5abWxsYkdSelpYUW5YSEpjYmlNZ0lDZHpaV3hsWTNRblhISmNiaU1nSUNkdmJDZGNjbHh1SXlBZ0ozVnNKMXh5WEc0aklDQW5kR0ZpYkdVblhISmNiaU5kWEhKY2JpTmNjbHh1SXlOVWFHbHpJR3hwYzNRZ2FYTWdibTkwSUhsbGRDQmxlR2hoZFhOMGFYWmxMQ0JxZFhOMElHVjRZMngxWkdVZ2RHaGxJRzlpZG1sdmRYTmNjbHh1STI1dmJrNWxjM1JoWW14bFRtOWtaWE1nUFNCYlhISmNiaU1nSUNkc2FTZGNjbHh1SXlBZ0oyeGxaMlZ1WkNkY2NseHVJeUFnSjNSeUoxeHlYRzRqSUNBbmRHUW5YSEpjYmlNZ0lDZHZjSFJwYjI0blhISmNiaU1nSUNkaWIyUjVKMXh5WEc0aklDQW5hR1ZoWkNkY2NseHVJeUFnSjNOdmRYSmpaU2RjY2x4dUl5QWdKM1JpYjJSNUoxeHlYRzRqSUNBbmRHWnZiM1FuWEhKY2JpTWdJQ2QwYUdWaFpDZGNjbHh1SXlBZ0oyeHBibXNuWEhKY2JpTWdJQ2R6WTNKcGNIUW5YSEpjYmlOZFhISmNiaU5jY2x4dUkyNXZaR1ZPWVcxbGN5QTlJRnRjY2x4dUl5QWdKMkVuWEhKY2JpTWdJQ2RpSjF4eVhHNGpJQ0FuWW5JblhISmNiaU1nSUNkaWRYUjBiMjRuWEhKY2JpTWdJQ2RrYVhZblhISmNiaU1nSUNkbGJTZGNjbHh1SXlBZ0oyWnBaV3hrYzJWMEoxeHlYRzRqSUNBblptOXliU2RjY2x4dUl5QWdKMmd4SjF4eVhHNGpJQ0FuYURJblhISmNiaU1nSUNkb015ZGNjbHh1SXlBZ0oyZzBKMXh5WEc0aklDQW5hRFVuWEhKY2JpTWdJQ2RvTmlkY2NseHVJeUFnSjJrblhISmNiaU1nSUNkcGJXY25YSEpjYmlNZ0lDZHBibkIxZENkY2NseHVJeUFnSjJ4aFltVnNKMXh5WEc0aklDQW5iR1ZuWlc1a0oxeHlYRzRqSUNBbmJHa25YSEpjYmlNZ0lDZHVZWFluWEhKY2JpTWdJQ2R2YkNkY2NseHVJeUFnSjI5d2RHbHZiaWRjY2x4dUl5QWdKM0FuWEhKY2JpTWdJQ2R6Wld4bFkzUW5YSEpjYmlNZ0lDZHpjR0Z1SjF4eVhHNGpJQ0FuYzNSeWIyNW5KMXh5WEc0aklDQW5jM1Z3SjF4eVhHNGpJQ0FuYzNabkoxeHlYRzRqSUNBbmRHRmliR1VuWEhKY2JpTWdJQ2QwWW05a2VTZGNjbHh1SXlBZ0ozUmtKMXh5WEc0aklDQW5kR1Y0ZEdGeVpXRW5YSEpjYmlNZ0lDZDBhQ2RjY2x4dUl5QWdKM1JvWldGa0oxeHlYRzRqSUNBbmRISW5YSEpjYmlNZ0lDZDFiQ2RjY2x4dUkxMWNjbHh1WEhKY2JtTnNZWE56SUU1dlpHVkdZV04wYjNKNVhISmNiaUFnWEhKY2JpQWdiMnBPYjJSbE9pQnVkV3hzWEhKY2JpQWdYSEpjYmlBZ1FHZGxkRG9nS0dsa0xDQjBZV2RPWVcxbElEMGdKMlJwZGljcElDMCtYSEpjYmlBZ0lDQnlaWFFnUFNCdWRXeHNYSEpjYmlBZ0lDQmxiQ0E5SUdSdlkzVnRaVzUwTG1kbGRFVnNaVzFsYm5SQ2VVbGtJR2xrWEhKY2JpQWdJQ0JwWmlCbGJGeHlYRzRnSUNBZ0lDQjBhR2x1Uld3Z1BTQlBTaTV5WlhOMGIzSmxSV3hsYldWdWRDQmxiQ3dnZEdGblRtRnRaVnh5WEc0Z0lDQWdhV1lnZEdocGJrVnNYSEpjYmlBZ0lDQWdJSEpsZENBOUlHNWxkeUJPYjJSbFJtRmpkRzl5ZVNCdWRXeHNMQ0J1ZFd4c0xDQnVkV3hzTENCbVlXeHpaU3dnZEdocGJrVnNYSEpjYmx4eVhHNGdJQ0FnY21WMFhISmNiaUFnWEhKY2JpQWdYMjFoYTJWQlpHUTZJQ2gwWVdkT1lXMWxMQ0JqYjNWdWRDa2dMVDVjY2x4dUlDQWdJQ2h2Y0hSektTQTlQbHh5WEc0Z0lDQWdJQ0J0WlhSb2IyUWdQU0JQU2k1dWIyUmxjMXQwWVdkT1lXMWxYU0J2Y2lCUFNpNWpiMjF3YjI1bGJuUnpXM1JoWjA1aGJXVmRJRzl5SUU5S0xtTnZiblJ5YjJ4elczUmhaMDVoYldWZElHOXlJRTlLTG1sdWNIVjBjMXQwWVdkT1lXMWxYVnh5WEc0Z0lDQWdJQ0JwWmlCdFpYUm9iMlJjY2x4dUlDQWdJQ0FnSUNCdWRTQTlJRzFsZEdodlpDQnZjSFJ6TENCQWIycE9iMlJsWEhKY2JpQWdJQ0FnSUdWc2MyVmNjbHh1SUNBZ0lDQWdJQ0J1ZFNBOUlFOUtMbU52YlhCdmJtVnVkQ0J1ZFd4c0xDQkFiMnBPYjJSbExDQjBZV2RPWVcxbFhISmNiaUFnSUNBZ0lDTnlaWFFnUFNCdVpYY2dUbTlrWlVaaFkzUnZjbmtnYm5Vc0lFQjBhR2x1VG05a1pTd2dZMjkxYm5SY2NseHVJQ0FnSUNBZ2JuVmNjbHh1SUNCY2NseHVJQ0JmYldGclpWVnVhWEYxWlVsa09pQW9ZMjkxYm5RcElDMCtYSEpjYmlBZ0lDQnBaaUJQU2k1SFJVNUZVa0ZVUlY5VlRrbFJWVVZmU1VSVFhISmNiaUFnSUNBZ0lHTnZkVzUwSUNzOUlERmNjbHh1SUNBZ0lDQWdhV1lnWTI5MWJuUWdQRDBnUUc5M2JtVnlMbU52ZFc1MElIUm9aVzRnWTI5MWJuUWdQU0JBYjNkdVpYSXVZMjkxYm5RZ0t5QXhYSEpjYmlBZ0lDQWdJRUJ2ZDI1bGNpNWpiM1Z1ZENBOUlHTnZkVzUwWEhKY2JseHlYRzRnSUNBZ0lDQnBaaUJ1YjNRZ1FHOXFUbTlrWlM1blpYUkpaQ2dwWEhKY2JpQWdJQ0FnSUNBZ2FXUWdQU0JBYjNkdVpYSXVaMlYwU1dRb0tTQnZjaUFuSjF4eVhHNGdJQ0FnSUNBZ0lHbGtJQ3M5SUVCdmFrNXZaR1V1ZEdGblRtRnRaU0FySUdOdmRXNTBYSEpjYmlBZ0lDQWdJQ0FnUUc5cVRtOWtaUzVoZEhSeUlDZHBaQ2NzSUdsa1hISmNiaUFnSUNCeVpYUjFjbTVjY2x4dUlDQmNjbHh1SUNCZlltbHVaRVYyWlc1MGN6b2dMVDVjY2x4dUlDQWdJR2xtSUVCdmFrNXZaR1VnZEdobGJpQmZMbVp2Y2s5M2JpQkFiM0IwYVc5dWN5NWxkbVZ1ZEhNc0lDaDJZV3dzSUd0bGVTa2dQVDVjY2x4dUlDQWdJQ0FnYVhOTlpYUm9iMlFnUFNCeVpYRjFhWEpsSUNjdUxpOTBiMjlzY3k5cGN5ZGNjbHh1SUNBZ0lDQWdhV1lnYVhOTlpYUm9iMlF1YldWMGFHOWtJSFpoYkZ4eVhHNGdJQ0FnSUNBZ0lHTmhiR3hpWVdOcklEMGdLR1YyWlc1MExpNHVLU0F0UGlCMllXd2daWFpsYm5RdUxpNWNjbHh1SUNBZ0lDQWdJQ0JBYjJwT2IyUmxMaVF1YjI0Z2EyVjVMQ0JqWVd4c1ltRmphMXh5WEc0Z0lDQWdJQ0FnSUVCdmFrNXZaR1V1WVdSa0lHdGxlU3dnWTJGc2JHSmhZMnRjY2x4dUlDQWdJQ0FnSUNCdWRXeHNYSEpjYmlBZ1hISmNiaUFnWTI5dWMzUnlkV04wYjNJNklDaEFkR0ZuTENCQWIzQjBhVzl1Y3l3Z1FHOTNibVZ5TENCQWRHaHBiazV2WkdVZ1BTQnVkV3hzS1NBdFBseHlYRzRnSUNBZ2FXWWdRSFJoWnlCaGJtUWdibTkwSUVCMGFHbHVUbTlrWlZ4eVhHNGdJQ0FnSUNCQWRHaHBiazV2WkdVZ1BTQnVaWGNnVkdocGJrUlBUU0JBZEdGbkxDQkFiM0IwYVc5dWN5NXdjbTl3YzF4eVhHNGdJQ0FnSUNCQWRHaHBiazV2WkdVdVlXUmtJQ2QwWVdkT1lXMWxKeXdnUUhSaFoxeHlYRzRnSUNBZ0lDQkFkR2hwYms1dlpHVXVZM056SUVCdmNIUnBiMjV6TG5OMGVXeGxjMXh5WEc0Z0lDQWdJQ0JwWmlCQWIzQjBhVzl1Y3k1MFpYaDBJSFJvWlc0Z1FIUm9hVzVPYjJSbExuUmxlSFFnUUc5d2RHbHZibk11ZEdWNGRGeHlYRzRnSUNBZ1hISmNiaUFnSUNCcFppQkFiM2R1WlhKY2NseHVJQ0FnSUNBZ1FHMWhhMlVvS1Z4eVhHNGdJRnh5WEc0Z0lHRmtaRTFoYTJWTlpYUm9iMlE2SUNoamIzVnVkQ2tnTFQ1Y2NseHVJQ0FnSUcxbGRHaHZaSE1nUFNCUFNpNXZZbXBsWTNRb0tWeHlYRzRnSUNBZ1FHOXFUbTlrWlM1dFlXdGxJRDBnS0hSaFowNWhiV1VzSUc5d2RITXBJRDArWEhKY2JpQWdJQ0FnSUcxbGRHaHZaQ0E5SUcxbGRHaHZaSE5iZEdGblRtRnRaVjFjY2x4dUlDQWdJQ0FnYVdZZ2JtOTBJRzFsZEdodlpGeHlYRzRnSUNBZ0lDQWdJRzFsZEdodlpDQTlJRUJmYldGclpVRmtaQ0IwWVdkT1lXMWxMQ0JBYjJwT2IyUmxMQ0JqYjNWdWRGeHlYRzRnSUNBZ0lDQWdJRzFsZEdodlpITmJkR0ZuVG1GdFpWMGdQU0J0WlhSb2IyUmNjbHh1SUNBZ0lDQWdiV1YwYUc5a0lHOXdkSE5jY2x4dUlDQWdJRUJ2YWs1dlpHVmNjbHh1WEhKY2JpQWdiV0ZyWlRvZ0xUNWNjbHh1WEhKY2JpQWdJQ0JBYjJwT2IyUmxJRDBnYm5Wc2JGeHlYRzVjY2x4dUlDQWdJR2xtSUVCMGFHbHVUbTlrWlQ4dWFYTkdkV3hzZVVsdWFYUWdkR2hsYmlCQWIycE9iMlJsSUQwZ1FIUm9hVzVPYjJSbFhISmNiaUFnWEhKY2JpQWdJQ0FqSURJNklFbG1JSFJvWlNCbGJHVnRaVzUwSUdoaGN5QnVaWFpsY2lCaVpXVnVJR2x1YVhScFlXeHBlbVZrTENCamIyNTBhVzUxWlZ4eVhHNGdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQWpJRE02SUVGeklHeHZibWNnWVhNZ2RHaGxJR1ZzWlcxbGJuUWdhWE51SjNRZ2RHaGxJR0p2WkhrZ2JtOWtaU3dnWTI5dWRHbHVkV1ZjY2x4dUlDQWdJQ0FnSXlCcFppQmxiQzUwWVdkT1lXMWxJR2x6Ym5RZ0oySnZaSGtuWEhKY2JpQWdJQ0FnSUNNZ05Eb2dSWGgwWlc1a0lIUm9aU0JsYkdWdFpXNTBJSGRwZEdnZ2MzUmhibVJoY21RZ2FsRjFaWEo1SUVGUVNTQnRaWFJvYjJSelhISmNiaUFnSUNBZ0lFQnZhazV2WkdVZ1BTQnVaWGNnVG05a1pTQkFkR2hwYms1dlpHVXNJRUJ2ZDI1bGNseHlYRzRnSUNBZ0lDQmpiM1Z1ZENBOUlDaEFiM2R1WlhJdVkyOTFiblFnS3lBeEtTQjhmQ0F4WEhKY2JpQWdJQ0FnSUNNZ05Ub2dTV1lnZEdobElHNXZaR1VnYVhOdUozUWdhVzRnZEdobElFUlBUU3dnWVhCd1pXNWtJR2wwSUhSdklIUm9aU0J3WVhKbGJuUmNjbHh1SUNBZ0lDQWdJeUJVYUdseklHRnNjMjhnWVdOamIyMXRiMlJoZEdWeklHUnZZM1Z0Wlc1MElHWnlZV2R0Wlc1MGN5d2dkMmhwWTJnZ1lYSmxJRzV2ZENCcGJpQjBhR1VnUkU5TklHSjFkQ0JoY21VZ2NISmxjM1Z0WldRZ2RHOGdZbVVnYzI5MWJtUWdkVzUwYVd3Z2NtVmhaSGtnWm05eUlHMWhiblZoYkNCcGJuTmxjblJwYjI1Y2NseHVJQ0FnSUNBZ2FXWWdRSFJvYVc1T2IyUmxMblJoWjA1aGJXVWdhWE51ZENBblltOWtlU2NnWVc1a0lHNXZkQ0JBZEdocGJrNXZaR1V1YVhOSmJrUlBUU0JoYm1RZ2JtOTBJRUJ2YWs1dlpHVXVhWE5KYmtSUFRWeHlYRzRnSUNBZ0lDQWdJRUJmYldGclpWVnVhWEYxWlVsa0lHTnZkVzUwWEhKY2JpQWdJQ0FnSUNBZ1FHOTNibVZ5TG1Gd2NHVnVaQ0JBYjJwT2IyUmxXekJkWEhKY2JpQWdJQ0FnSUNBZ0l5QTJPaUJDYVc1a0lHRnVlU0JrWldacGJtVmtJR1YyWlc1MGN5QmhablJsY2lCMGFHVWdibTlrWlNCcGN5QnBiaUIwYUdVZ1JFOU5YSEpjYmlBZ0lDQWdJQ0FnUUY5aWFXNWtSWFpsYm5SektDbGNjbHh1SUNBZ0lDQWdJQ0JjY2x4dUlDQWdJQ0FnUUhSb2FXNU9iMlJsTG1selNXNUVUMDBnUFNCMGNuVmxYSEpjYmlBZ0lDQWdJRUJ2YWs1dlpHVXVhWE5KYmtSUFRTQTlJSFJ5ZFdWY2NseHVYSEpjYmlBZ0lDQWdJQ01nTnpvZ1EzSmxZWFJsSUhSb1pTQmhiR3dnYVcxd2IzSjBZVzUwSUNkdFlXdGxKeUJ0WlhSb2IyUmNjbHh1SUNBZ0lDQWdRR0ZrWkUxaGEyVk5aWFJvYjJRZ1kyOTFiblJjY2x4dVhISmNiaUFnSUNBZ0lDTWdPRG9nVUhKbGRtVnVkQ0JrZFhCc2FXTmhkR1VnWm1GamRHOXllU0JsZUhSbGJuTnBiMjRnWW5rZ2MyVjBkR2x1WnlCcGN5QnBibWwwSUQwZ2RISjFaVnh5WEc0Z0lDQWdJQ0JBYjJwT2IyUmxMbWx6Um5Wc2JIbEpibWwwSUQwZ2RISjFaVnh5WEc1Y2NseHVJQ0FnSUNBZ0l5QTVPaUJwWmlCMGFHVWdibTlrWlNCemRYQndiM0owY3lCcGRDd2dZMkZzYkNCbWFXNWhiR2w2WlZ4eVhHNGdJQ0FnSUNCbWFXNWhiR2w2WlNBOUlGOHViMjVqWlNCQWIycE9iMlJsTG1acGJtRnNhWHBsSUc5eUlFOUtMbTV2YjNCY2NseHVJQ0FnSUNBZ1FHOXFUbTlrWlM1bWFXNWhiR2w2WlNBOUlHWnBibUZzYVhwbFhISmNiaUFnSUNBZ0lHWnBibUZzYVhwbElFQnZhazV2WkdWY2NseHVJQ0FnSUNNZ01UQTZJRkpsZEhWeWJpQjBhR1VnWlhoMFpXNWtaV1FnWld4bGJXVnVkRnh5WEc0Z0lDQWdRRzlxVG05a1pWeHlYRzVjY2x4dVpHVm1ZWFZzZEVOeVpXRjBaVVZzWlcxbGJuUWdQU0FvY0dGeVpXNTBMQ0IwWVdjc0lHOXdkR2x2Ym5NcElDMCtYSEpjYmlBZ2JtVjNSV3hsYldWdWRDQTlJR1J2WTNWdFpXNTBMbU55WldGMFpVVnNaVzFsYm5RZ2RHRm5YSEpjYmlBZ2FXWWdiM0IwYVc5dWMxeHlYRzRnSUNBZ1ptOXlJR3RsZVN3Z2RtRnNkV1VnYjJZZ2IzQjBhVzl1Y3k1d2NtOXdjMXh5WEc0Z0lDQWdJQ0J1WlhkRmJHVnRaVzUwTG5ObGRFRjBkSEpwWW5WMFpTaHJaWGtzSUhaaGJIVmxLVnh5WEc0Z0lDQWdabTl5SUd0bGVTd2dkbUZzZFdVZ2IyWWdiM0IwYVc5dWN5NWxkbVZ1ZEhOY2NseHVJQ0FnSUNBZ0pDaHVaWGRGYkdWdFpXNTBLUzV2YmloclpYa3NJSFpoYkhWbEtWeHlYRzRnSUNBZ1ptOXlJR3RsZVN3Z2RtRnNkV1VnYjJZZ2IzQjBhVzl1Y3k1emRIbHNaWE5jY2x4dUlDQWdJQ0FnSkNodVpYZEZiR1Z0Wlc1MEtTNWpjM01vYTJWNUxDQjJZV3gxWlNsY2NseHVJQ0FnSUhaaGJIVmxJRDBnYjNCMGFXOXVjeTUwWlhoMFhISmNiaUFnSUNCcFppQjJZV3gxWlNCcGMyNTBJSFZ1WkdWbWFXNWxaRnh5WEc0Z0lDQWdJQ0FrS0c1bGQwVnNaVzFsYm5RcExuUmxlSFFvZG1Gc2RXVXBYSEpjYmlBZ2NHRnlaVzUwUHk1aGNIQmxibVJEYUdsc1pDaHVaWGRGYkdWdFpXNTBLVnh5WEc1Y2NseHVaMlYwVG05a1pVWnliMjFHWVdOMGIzSjVJRDBnS0hSaFp5d2diM0IwYVc5dWN5d2diM2R1WlhJc0lHbHpRMkZzYkdWa1JuSnZiVVpoWTNSdmNua3NJRzV2WkdVcElDMCtYSEpjYmlBZ2JtVjNUMHBPYjJSbElEMGdibVYzSUU1dlpHVW9LVnh5WEc0Z0lHbG1JQ0YzYVc1a2IzY3ViMnBEY21WaGRHVkZiR1Z0Wlc1MFhISmNiaUFnSUNCM2FXNWtiM2N1YjJwRGNtVmhkR1ZGYkdWdFpXNTBJRDBnWkdWbVlYVnNkRU55WldGMFpVVnNaVzFsYm5SY2NseHVJQ0J1WlhkUFNrNXZaR1V1Wld4bGJXVnVkQ0E5SUc5cVEzSmxZWFJsUld4bGJXVnVkQ2h2ZDI1bGNpNWxiR1Z0Wlc1MExDQjBZV2NnZkh3Z0oyUnBkaWNzSUc5d2RHbHZibk1wWEhKY2JpQWdibVYzVDBwT2IyUmxYSEpjYmx4eVhHNVBTaTV5WldkcGMzUmxjaUFuYm05a1pVWmhZM1J2Y25rbkxDQm5aWFJPYjJSbFJuSnZiVVpoWTNSdmNubGNjbHh1WEhKY2JtMWhhMlVnUFNBb2RHRm5MQ0J2Y0hScGIyNXpLU0F0UGx4eVhHNGdJRzVsZDA5S1RtOWtaU0E5SUc1bGR5Qk9iMlJsS0NsY2NseHVJQ0J1WlhkUFNrNXZaR1V1Wld4bGJXVnVkQ0E5SUc5cVEzSmxZWFJsUld4bGJXVnVkQ2h1ZFd4c0xDQjBZV2NnZkh3Z0oyUnBkaWNzSUc5d2RHbHZibk1wWEhKY2JpQWdibVYzVDBwT2IyUmxYSEpjYmx4eVhHNVBTaTV5WldkcGMzUmxjaUFuYldGclpTY3NJRzFoYTJWY2NseHVYSEpjYmx4eVhHNWNjbHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JuWlhST2IyUmxSbkp2YlVaaFkzUnZjbmxjY2x4dUlsMTkiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBhXHJcbm5vZGVOYW1lID0gJ2EnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGlkOiAnJ1xyXG4gICAgICBjbGFzczogJydcclxuICAgICAgdGV4dDogJydcclxuICAgICAgaHJlZjogJ2phdmFTY3JpcHQ6dm9pZCgwKTsnXHJcbiAgICAgIHR5cGU6ICcnXHJcbiAgICAgIHRpdGxlOiAnJ1xyXG4gICAgICByZWw6ICcnXHJcbiAgICAgIG1lZGlhOiAnJ1xyXG4gICAgICB0YXJnZXQ6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgdG9nZ2xlU3RhdGUgPSAnb2ZmJ1xyXG5cclxuICB0b2dnbGUgPSAtPlxyXG4gICAgaWYgdG9nZ2xlU3RhdGUgaXMgJ29uJ1xyXG4gICAgICB0b2dnbGVTdGF0ZSA9ICdvZmYnXHJcbiAgICBlbHNlIHRvZ2dsZVN0YXRlID0gJ29uJyAgaWYgdG9nZ2xlU3RhdGUgaXMgJ29mZidcclxuICAgIHJldHVyblxyXG5cclxuICAjIENsaWNrIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHRvZ2dsZSgpXHJcbiAgICAgIHJldFZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgIGlmIGRlZmF1bHRzLmhyZWYgaXMgJyMnIHRoZW4gcmV0VmFsID0gZmFsc2VcclxuICAgICAgcmV0VmFsXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSBuZXdDbGlja1xyXG4gIGVsc2VcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IHRvZ2dsZVxyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG5cclxuXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG50byA9IHJlcXVpcmUgJy4uL3Rvb2xzL3RvJ1xyXG4jICMgYnJcclxuXHJcbm5vZGVOYW1lID0gJ2JyJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOiB7fVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG4gICAgbnVtYmVyOiAxXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIGkgPSAwXHJcbiAgd2hpbGUgaSA8IHRvLm51bWJlciBkZWZhdWx0cy5udW1iZXJcclxuICAgICMgSW4gdGhlIGNhc2Ugb2YgbXVsdGlwbGUgYnJzLCBpdCBpcyBkZXNpcmFibGUgdG8gb25seSBnZXQgdGhlIGxhc3Qgb25lIG91dFxyXG4gICAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgICBpICs9IDFcclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcclxuXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIGZvcm1cclxuXHJcbm5vZGVOYW1lID0gJ2Zvcm0nXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGFjdGlvbjogJydcclxuICAgICAgbWV0aG9kOiAnJ1xyXG4gICAgICBuYW1lOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuICByZXQuYWRkICd2YWxpZGF0b3InLCByZXQuJC52YWxpZGF0ZShcclxuICAgIGhpZ2hsaWdodDogKGVsZW1lbnQpIC0+XHJcbiAgICAgICRlbG0gPSAkKGVsZW1lbnQpXHJcbiAgICAgICRlbG0uYXR0ciAnT0pfaW52YWxpZCcsICcxJ1xyXG4gICAgICAkZWxtLmFuaW1hdGUgYmFja2dyb3VuZENvbG9yOiAncmVkJ1xyXG4gICAgICBudWxsXHJcblxyXG4gICAgdW5oaWdobGlnaHQ6IChlbGVtZW50KSAtPlxyXG4gICAgICAkZWxtID0gJChlbGVtZW50KVxyXG4gICAgICBpZiAkZWxtLmF0dHIoJ09KX2ludmFsaWQnKSBpcyAnMSdcclxuICAgICAgICAkZWxtLmNzcyAnYmFja2dyb3VuZC1jb2xvcicsICd5ZWxsb3cnXHJcbiAgICAgICAgJGVsbS5hdHRyICdPSl9pbnZhbGlkJywgJzAnXHJcbiAgICAgICAgc2V0VGltZW91dCAoLT5cclxuICAgICAgICAgICRlbG0uYW5pbWF0ZSBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcclxuICAgICAgICApLCA1MDBcclxuICAgICAgbnVsbFxyXG4gIClcclxuXHJcbiAgcmV0LmFkZCAnaXNGb3JtVmFsaWQnLCAtPlxyXG4gICAgcmV0LiQudmFsaWQoKSBhbmQgKG5vdCByZXQudmFsaWRhdG9yLmludmFsaWRFbGVtZW50cygpIG9yIHJldC52YWxpZGF0b3IuaW52YWxpZEVsZW1lbnRzKCkubGVuZ3RoIGlzIDApXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcblxyXG5cclxuXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuZW51bXMgPSByZXF1aXJlICcuLi90b29scy9lbnVtcydcclxuXHJcbiMgIyBpbnB1dFxyXG5cclxubm9kZU5hbWUgPSAnaW5wdXQnXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogJ3RleHQnXHJcbiAgICAgIHZhbHVlOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG4gICAgICBjaGFuZ2U6IE9KLm5vb3BcclxuICAgICAgZm9jdXNvdXQ6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIGlmIG5vdCBkZWZhdWx0cy5wcm9wcy50eXBlIG9yIG5vdCBlbnVtcy5pbnB1dFR5cGVzW2RlZmF1bHRzLnByb3BzLnR5cGVdXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IgJ05vIG1hdGNoaW5nIGlucHV0IHR5cGUgZm9yIHsnICsgZGVmYXVsdHMucHJvcHMudHlwZSArICd9IGNvdWxkIGJlIGZvdW5kLidcclxuICB0aGlzVHlwZSA9IGVudW1zLmlucHV0VHlwZXNbZGVmYXVsdHMucHJvcHMudHlwZV1cclxuXHJcbiAgc3luY1ZhbHVlID0gLT5cclxuICAgIHN3aXRjaCB0aGlzVHlwZVxyXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMuY2hlY2tib3hcclxuICAgICAgICByZXQudmFsdWUgPSByZXQuJC5pcyAnOmNoZWNrZWQnXHJcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5yYWRpb1xyXG4gICAgICAgIHJldC52YWx1ZSA9IHJldC4kLmZpbmQoJzpjaGVja2VkJykudmFsKClcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldC52YWx1ZSA9IHJldC52YWwoKVxyXG4gICAgZGVmYXVsdHMucHJvcHMudmFsdWUgPSByZXQudmFsdWUgICAgXHJcbiAgICByZXQudmFsdWVcclxuXHJcbiAgIyMjXHJcbiAgICBDbGljayBiaW5kaW5nLiBJZiB0aGUgY2FsbGVyIGRlZmluZWQgYSBjbGljayBoYW5kbGVyLFxyXG4gICAgd3JhcCBpdCwgc3luYyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0IGZpcnN0LFxyXG4gICAgdGhlbiBjYWxsIHRoZSBkZWZpbmVkIGNsaWNrIGhhbmRsZXIgd2l0aCB0aGUgbGF0ZXN0IHZhbHVlLlxyXG4gICMjI1xyXG4gIG9sZENsaWNrID0gZGVmYXVsdHMuZXZlbnRzLmNsaWNrXHJcbiAgaWYgb2xkQ2xpY2sgYW5kIG9sZENsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIG9sZENsaWNrIHJldC52YWx1ZSwgZXZlbnQuLi5cclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXHJcblxyXG4gICMjI1xyXG4gICAgQ2hhbmdlIGJpbmRpbmcuIElmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGNoYW5nZSBoYW5kbGVyLFxyXG4gICAgd3JhcCBpdCwgc3luYyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0IGZpcnN0LFxyXG4gICAgdGhlbiBjYWxsIHRoZSBkZWZpbmVkIGNoYW5nZSBoYW5kbGVyIHdpdGggdGhlIGxhdGVzdCB2YWx1ZS5cclxuICAjIyNcclxuICBvbGRDaGFuZ2UgPSBkZWZhdWx0cy5ldmVudHMuY2hhbmdlXHJcbiAgaWYgb2xkQ2hhbmdlIGFuZCBvbGRDaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIG9sZENoYW5nZSByZXQudmFsdWUsIGV2ZW50Li4uXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2hhbmdlID0gbmV3Q2hhbmdlXHJcblxyXG4gICMjI1xyXG4gICAgT24gRm9jdXMgT3V0IGJpbmRpbmcuIEFsd2F5cyB1c2UgdGhlIGV2ZW50IHRvIHVwZGF0ZSB0aGUgaW50ZXJuYWxcclxuICAgIHZhbHVlIG9mIHRoZSBjb250cm9sOyBhbmQgaWYgdGhlIGNhbGxlciBkZWZpbmVkIGEgZm9jdXNvdXQgZXZlbnQsXHJcbiAgICB3cmFwIGl0IGFuZCBpbnZva2UgaXQgd2l0aCB0aGUgbGF0ZXN0IHZhbHVlXHJcbiAgIyMjXHJcbiAgb2xkRm9jdXNvdXQgPSBkZWZhdWx0cy5ldmVudHMuZm9jdXNvdXRcclxuICBuZXdGb2N1c291dCA9IChldmVudC4uLikgLT5cclxuICAgIHN5bmNWYWx1ZSgpXHJcbiAgICBpZiBvbGRGb2N1c291dCBhbmQgb2xkRm9jdXNvdXQgaXNudCBPSi5ub29wXHJcbiAgICAgIG9sZEZvY3Vzb3V0IHJldC52YWx1ZSwgZXZlbnQuLi5cclxuXHJcbiAgZGVmYXVsdHMuZXZlbnRzLmZvY3Vzb3V0ID0gbmV3Rm9jdXNvdXRcclxuXHJcblxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcbiAgcmV0LnZhbHVlID0gZGVmYXVsdHMucHJvcHMudmFsdWVcclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIG9sXHJcblxyXG5ub2RlTmFtZSA9ICdvbCdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczoge31cclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgc2VsZWN0XHJcblxyXG5ub2RlTmFtZSA9ICdzZWxlY3QnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgc2VsZWN0ZWQ6ICcnXHJcbiAgICAgIG11bHRpcGxlOiBmYWxzZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgdmFsdWVzOiBbXVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG4gICAgICBjaGFuZ2U6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHZhbHVlID0gJydcclxuICB2YWx1ZXMgPSBbXVxyXG4gIGhhc0VtcHR5ID0gZmFsc2VcclxuXHJcbiAgc3luY1ZhbHVlID0gLT5cclxuICAgIHZhbHVlID0gcmV0LnZhbCgpXHJcblxyXG4gICMgQ2xpY2sgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jbGljayBpc250IE9KLm5vb3BcclxuICAgIGNsaWNrID0gZGVmYXVsdHMuZXZlbnRzLmNsaWNrXHJcbiAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cclxuICAgICAgcmV0dmFsID0gY2xpY2sgZXZlbnQuLi5cclxuICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgcmV0dmFsXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSBuZXdDbGlja1xyXG5cclxuICAjIENoYW5nZSBiaW5kaW5nXHJcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSBpc250IE9KLm5vb3BcclxuICAgIGNoYW5nZSA9IGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2VcclxuICAgIG5ld0NoYW5nZSA9IChldmVudC4uLikgLT5cclxuICAgICAgcmV0dmFsID0gY2hhbmdlIGV2ZW50Li4uXHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIHJldHZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSA9IG5ld0NoYW5nZVxyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuICByZXQuYWRkICdzZWxlY3RlZERhdGEnLCAocHJvcE5hbWUpIC0+XHJcbiAgICByZXQgPSAnJ1xyXG4gICAgaWYgcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykgYW5kIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdXHJcbiAgICAgIGRhdGFzZXQgPSByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVswXS5kYXRhc2V0XHJcbiAgICAgIHJldCA9IGRhdGFzZXRbcHJvcE5hbWVdICBpZiBkYXRhc2V0XHJcbiAgICByZXRcclxuXHJcbiAgcmV0LmFkZCAnc2VsZWN0ZWRUZXh0JywgLT5cclxuICAgIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnRleHQoKVxyXG5cclxuICByZXQuYWRkICdzZWxlY3RlZFZhbCcsIC0+XHJcbiAgICB2YWx1ZSA9IHJldC52YWwoKVxyXG4gICAgdmFsdWVcclxuXHJcbiAgcmV0LmFkZCAnYWRkT3B0aW9uJywgKHZhbHVlLCB0ZXh0ID0gdmFsdWUsIHNlbGVjdGVkID0gZmFsc2UsIGRpc2FibGVkID0gZmFsc2UpIC0+XHJcbiAgICBpc0VtcHR5ID0gXy5pc0VtcHR5IHZhbHVlXHJcbiAgICBhZGQgPSBmYWxzZVxyXG4gICAgaWYgaXNFbXB0eSBhbmQgZmFsc2UgaXMgaGFzRW1wdHlcclxuICAgICAgaGFzRW1wdHkgPSB0cnVlXHJcbiAgICAgIGFkZCA9IHRydWVcclxuICAgIGlmIGZhbHNlIGlzIGFkZCBhbmQgZmFsc2UgaXMgaXNFbXB0eSB0aGVuIGFkZCA9IHRydWVcclxuICAgIGlmIGFkZFxyXG4gICAgICB2YWwgPVxyXG4gICAgICAgIHRleHQ6IHRleHRcclxuICAgICAgICBwcm9wczpcclxuICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICBpZiBzZWxlY3RlZFxyXG4gICAgICAgIHZhbC5zZWxlY3RlZCA9IHNlbGVjdGVkXHJcbiAgICAgIGlmIGRpc2FibGVkXHJcbiAgICAgICAgdmFsLmRpc2FibGVkID0gZGlzYWJsZWRcclxuICAgICAgb3B0aW9uID0gcmV0Lm1ha2UgJ29wdGlvbicsIHZhbFxyXG4gICAgICBvcHRpb25cclxuXHJcbiAgcmV0LmFkZCAnYWRkT3B0aW9ucycsIChvcHRpb25zKSAtPlxyXG4gICAgdmFsdWVzID0gXy51bmlvbiB2YWx1ZXMsIG9wdGlvbnNcclxuICAgIE9KLmVhY2ggb3B0aW9ucywgKCh2YWwpIC0+XHJcbiAgICAgIHZhbHVlID0gcmV0LmFkZE9wdGlvbih2YWwpXHJcbiAgICAgIHZhbHVlcy5wdXNoIHZhbHVlXHJcbiAgICApLCBmYWxzZVxyXG4gICAgdmFsdWVzXHJcblxyXG4gIHJldC5hZGQgJ3Jlc2V0T3B0aW9ucycsICh2YWx1ZXMpIC0+XHJcbiAgICByZXQuZW1wdHkoKVxyXG4gICAgdmFsdWVzID0gdmFsdWVzXHJcbiAgICByZXQuYWRkT3B0aW9ucyB2YWx1ZXNcclxuICAgIHJldFxyXG5cclxuICByZXQuYWRkICdyZW1vdmVPcHRpb24nLCAodmFsdWVUb1JlbW92ZSkgLT5cclxuICAgIHZhbHVlcy5zcGxpY2UgdmFsdWVzLmluZGV4T2YodmFsdWVUb1JlbW92ZSksIDEgI3JlbW92ZXMgdGhlIGl0ZW0gZnJvbSB0aGUgbGlzdFxyXG4gICAgc2VsZWN0Q29udHJvbCA9IHJldFswXVxyXG4gICAgaSA9IDBcclxuXHJcbiAgICB3aGlsZSBpIDwgc2VsZWN0Q29udHJvbC5sZW5ndGhcclxuICAgICAgc2VsZWN0Q29udHJvbC5yZW1vdmUgaSAgaWYgc2VsZWN0Q29udHJvbC5vcHRpb25zW2ldLnZhbHVlIGlzIHZhbHVlVG9SZW1vdmVcclxuICAgICAgaSsrXHJcbiAgICBudWxsXHJcblxyXG5cclxuXHJcbiAgaWYgZGVmYXVsdHMudmFsdWVzLmxlbmd0aCA+IDBcclxuICAgIHJldC5hZGRPcHRpb25zIGRlZmF1bHRzLnZhbHVlc1xyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciAkLCBKc29uVG9UYWJsZSwgT0osIF8sIGFycmF5MkQsIG5vZGUsIG5vZGVGYWN0b3J5LCBub2RlTmFtZTtcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUoJy4uL2RvbS9ub2RlRmFjdG9yeScpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5hcnJheTJEID0gcmVxdWlyZSgnLi4vdG9vbHMvYXJyYXkyRCcpO1xuXG4kID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuXG5Kc29uVG9UYWJsZSA9IHJlcXVpcmUoJy4uL3Rvb2xzL0pzb25Ub1RhYmxlJyk7XG5cbm5vZGVOYW1lID0gJ3RhYmxlJztcblxuXG4vKlxuQ3JlYXRlIGFuIEhUTUwgdGFibGUuIFByb3ZpZGVzIGhlbHBlciBtZXRob2RzIHRvIGNyZWF0ZSBDb2x1bW5zIGFuZCBDZWxscy5cbiAqL1xuXG5ub2RlID0gZnVuY3Rpb24ob3B0aW9ucywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5KSB7XG4gIHZhciBjZWxscywgY29sdW1uQ291bnQsIGRlZmF1bHRzLCBmaWxsTWlzc2luZywgaW5pdCwgbG9hZENlbGxzLCByZXQsIHJvd3MsIHRib2R5LCB0aGVhZCwgdGhlYWRSb3c7XG4gIGlmIChvd25lciA9PSBudWxsKSB7XG4gICAgb3duZXIgPSBPSi5ib2R5O1xuICB9XG4gIGlmIChjYWxsZWRGcm9tRmFjdG9yeSA9PSBudWxsKSB7XG4gICAgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZTtcbiAgfVxuICBkZWZhdWx0cyA9IHtcbiAgICBkYXRhOiBudWxsLFxuICAgIHByb3BzOiB7XG4gICAgICBjZWxscGFkZGluZzogMCxcbiAgICAgIGNlbGxzcGFjaW5nOiAwLFxuICAgICAgYWxpZ246ICcnLFxuICAgICAgd2lkdGg6ICcnLFxuICAgICAgY2VsbGFsaWduOiAnbGVmdCcsXG4gICAgICBjZWxsdmFsaWduOiAndG9wJyxcbiAgICAgIFwiY2xhc3NcIjogJydcbiAgICB9LFxuICAgIHN0eWxlczoge30sXG4gICAgZXZlbnRzOiB7fSxcbiAgICBjZWxsczoge1xuICAgICAgXCJjbGFzc1wiOiAnJyxcbiAgICAgIGFsaWduOiAnJyxcbiAgICAgICd2ZXJ0aWNhbC1hbGlnbic6ICcnLFxuICAgICAgY2VsbHBhZGRpbmc6ICcnLFxuICAgICAgbWFyZ2luOiAnJ1xuICAgIH0sXG4gICAgdGhlYWQ6IHt9LFxuICAgIHRib2R5OiB7fSxcbiAgICBmaXJzdEFsaWduUmlnaHQ6IGZhbHNlLFxuICAgIG9kZEFsaWduUmlnaHQ6IGZhbHNlXG4gIH07XG4gIHJvd3MgPSBbXTtcbiAgY2VsbHMgPSBhcnJheTJEKCk7XG4gIGNvbHVtbkNvdW50ID0gMDtcbiAgT0ouZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlKTtcbiAgcmV0ID0gbm9kZUZhY3Rvcnkobm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnkpO1xuICB0Ym9keSA9IG51bGw7XG4gIHRoZWFkID0gbnVsbDtcbiAgdGhlYWRSb3cgPSBudWxsO1xuICBpbml0ID0gXy5vbmNlKGZ1bmN0aW9uKCkge1xuICAgIHZhciBqMnQsIGpCb2R5LCBqSGVhZCwgalRibCwgdGJsU3RyO1xuICAgIGlmIChkZWZhdWx0cy5kYXRhKSB7XG4gICAgICBqMnQgPSBuZXcgSnNvblRvVGFibGUoZGVmYXVsdHMuZGF0YSk7XG4gICAgICB0YmxTdHIgPSBqMnQudGFibGU7XG4gICAgfVxuICAgIGlmICh0YmxTdHIpIHtcbiAgICAgIGpUYmwgPSAkKHRibFN0cik7XG4gICAgICBqSGVhZCA9IGpUYmwuZmluZCgndGhlYWQnKTtcbiAgICAgIHJldC4kLmFwcGVuZChqSGVhZCk7XG4gICAgICB0aGVhZCA9IGVsLnJlc3RvcmVFbGVtZW50KGpIZWFkWzBdKTtcbiAgICAgIHRoZWFkUm93ID0gZWwucmVzdG9yZUVsZW1lbnQodGhlYWRbMF0ucm93c1swXSk7XG4gICAgICBqQm9keSA9IGpUYmwuZmluZCgndGJvZHknKTtcbiAgICAgIHJldC4kLmFwcGVuZChqQm9keSk7XG4gICAgICB0Ym9keSA9IGVsLnJlc3RvcmVFbGVtZW50KGpCb2R5WzBdKTtcbiAgICAgIGxvYWRDZWxscygpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGVhZCA9IHJldC5tYWtlKCd0aGVhZCcsIGRlZmF1bHRzLnRoZWFkKTtcbiAgICAgIHRoZWFkUm93ID0gdGhlYWQubWFrZSgndHInKTtcbiAgICAgIHRib2R5ID0gcmV0Lm1ha2UoJ3Rib2R5JywgZGVmYXVsdHMudGJvZHkpO1xuICAgICAgcm93cy5wdXNoKHRib2R5Lm1ha2UoJ3RyJykpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcbiAgbG9hZENlbGxzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGMsIG1lbUNlbGwsIG1lbVJvdywgciwgcmVzdWx0cztcbiAgICByID0gMDtcbiAgICByZXN1bHRzID0gW107XG4gICAgd2hpbGUgKHRib2R5WzBdLnJvd3MubGVuZ3RoID4gcikge1xuICAgICAgYyA9IDA7XG4gICAgICBtZW1Sb3cgPSBlbC5yZXN0b3JlRWxlbWVudCh0Ym9keVswXS5yb3dzW3JdKTtcbiAgICAgIHJvd3MucHVzaChtZW1Sb3cpO1xuICAgICAgd2hpbGUgKHRib2R5WzBdLnJvd3Nbcl0uY2VsbHMubGVuZ3RoID4gYykge1xuICAgICAgICBtZW1DZWxsID0gY2VsbHMuZ2V0KHIgKyAxLCBjICsgMSk7XG4gICAgICAgIGlmICghbWVtQ2VsbCkge1xuICAgICAgICAgIG1lbUNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCh0Ym9keVswXS5yb3dzW3JdLmNlbGxzW2NdKTtcbiAgICAgICAgICBjZWxscy5zZXQociArIDEsIGMgKyAxLCBtZW1DZWxsKTtcbiAgICAgICAgfVxuICAgICAgICBjICs9IDE7XG4gICAgICB9XG4gICAgICByZXN1bHRzLnB1c2gociArPSAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHM7XG4gIH07XG4gIGZpbGxNaXNzaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGNlbGxzLmVhY2goZnVuY3Rpb24ocm93Tm8sIGNvbE5vLCB2YWwpIHtcbiAgICAgIHZhciByb3c7XG4gICAgICBpZiAoIXZhbCkge1xuICAgICAgICByb3cgPSByZXQucm93KHJvd05vKTtcbiAgICAgICAgcmV0dXJuIHJvdy5jZWxsKGNvbE5vLCB7fSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIHJldC5hZGQoJ2NvbHVtbicsIGZ1bmN0aW9uKGNvbE5vLCBjb2xOYW1lKSB7XG4gICAgdmFyIGksIG5hdGl2ZVRoLCB0aDtcbiAgICByZXQuaW5pdCgpO1xuICAgIGNvbHVtbkNvdW50ICs9IDE7XG4gICAgdGggPSBudWxsO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlICh0aGVhZFswXS5yb3dzWzBdLmNlbGxzLmxlbmd0aCA8IGNvbE5vKSB7XG4gICAgICBuYXRpdmVUaCA9IHRoZWFkWzBdLnJvd3NbMF0uY2VsbHNbaV07XG4gICAgICBpZiAoIW5hdGl2ZVRoKSB7XG4gICAgICAgIHRoID0gdGhlYWRSb3cubWFrZSgndGgnLCB7fSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aCA9IGVsLnJlc3RvcmVFbGVtZW50KG5hdGl2ZVRoLCAndGgnKTtcbiAgICAgIH1cbiAgICAgIGkgKz0gMTtcbiAgICB9XG4gICAgaWYgKCF0aCkge1xuICAgICAgbmF0aXZlVGggPSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzW2NvbE5vIC0gMV07XG4gICAgICB0aCA9IGVsLnJlc3RvcmVFbGVtZW50KG5hdGl2ZVRoLCAndGgnKTtcbiAgICB9XG4gICAgdGgudGV4dChjb2xOYW1lKTtcbiAgICByZXR1cm4gdGg7XG4gIH0pO1xuICByZXQuYWRkKCdyb3cnLCBmdW5jdGlvbihyb3dObywgb3B0cykge1xuICAgIHZhciByb3c7XG4gICAgcm93ID0gcm93c1tyb3dObyAtIDFdO1xuICAgIGlmICghcm93KSB7XG4gICAgICB3aGlsZSAocm93cy5sZW5ndGggPCByb3dObykge1xuICAgICAgICByb3cgPSB0Ym9keS5tYWtlKCd0cicsIHt9KTtcbiAgICAgICAgcm93cy5wdXNoKHJvdyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghcm93LmNlbGwpIHtcbiAgICAgIHJvdy5hZGQoJ2NlbGwnLCBmdW5jdGlvbihjb2xObywgb3B0cykge1xuICAgICAgICB2YXIgY2VsbDtcbiAgICAgICAgY2VsbCA9IE9KLm5vZGVzLnRkKG9wdHMsIHJvdyk7XG4gICAgICAgIGNlbGxzLnNldChyb3dObywgY29sTm8sIGNlbGwpO1xuICAgICAgICByZXR1cm4gY2VsbDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gcm93O1xuICB9KTtcbiAgcmV0LmFkZCgnY2VsbCcsIGZ1bmN0aW9uKHJvd05vLCBjb2xObywgb3B0cykge1xuICAgIHZhciBjZWxsLCBpLCBudU9wdHMsIHJvdywgdHJ5Q2VsbDtcbiAgICBpZiAocm93Tm8gPCAxKSB7XG4gICAgICByb3dObyA9IDE7XG4gICAgfVxuICAgIGlmIChjb2xObyA8IDEpIHtcbiAgICAgIGNvbE5vID0gMTtcbiAgICB9XG4gICAgaWYgKGNvbHVtbkNvdW50ID4gMCAmJiBjb2xObyAtIDEgPiBjb2x1bW5Db3VudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBIGNvbHVtbiBuYW1lIGhhcyBub3QgYmVlbiBkZWZpbmVkIGZvciB0aGlzIHBvc2l0aW9uIHsnICsgcm93Tm8gKyAneCcgKyBjb2xObyArICd9LicpO1xuICAgIH1cbiAgICByb3cgPSByZXQucm93KHJvd05vKTtcbiAgICBjZWxsID0gY2VsbHMuZ2V0KHJvd05vLCBjb2xObyk7XG4gICAgaWYgKCFjZWxsKSB7XG4gICAgICBpID0gMDtcbiAgICAgIHdoaWxlIChpIDwgY29sTm8pIHtcbiAgICAgICAgaSArPSAxO1xuICAgICAgICBpZiAoaSA9PT0gY29sTm8pIHtcbiAgICAgICAgICBudU9wdHMgPSBPSi5leHRlbmQoe1xuICAgICAgICAgICAgcHJvcHM6IGRlZmF1bHRzLmNlbGxzXG4gICAgICAgICAgfSwgb3B0cyk7XG4gICAgICAgICAgY2VsbCA9IHJvdy5jZWxsKGNvbE5vLCBudU9wdHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRyeUNlbGwgPSBjZWxscy5nZXQocm93Tm8sIGkpO1xuICAgICAgICAgIGlmICghdHJ5Q2VsbCkge1xuICAgICAgICAgICAgdHJ5Q2VsbCA9IHJvdy5jZWxsKGksIHtcbiAgICAgICAgICAgICAgcHJvcHM6IGRlZmF1bHRzLmNlbGxzXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNlbGw7XG4gIH0pO1xuICBpbml0KCk7XG4gIHJldC5hZGQoJ3RoZWFkJywgdGhlYWQpO1xuICByZXQuYWRkKCd0Ym9keScsIHRib2R5KTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbk9KLm5vZGVzLnJlZ2lzdGVyKG5vZGVOYW1lLCBub2RlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeGxiR1Z0Wlc1MGMxeGNkR0ZpYkdVdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFTeEpRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4WFFVRkJMRWRCUVdNc1QwRkJRU3hEUVVGUkxHOUNRVUZTT3p0QlFVTmtMRU5CUVVFc1IwRkJTU3hQUVVGQkxFTkJRVkVzVVVGQlVqczdRVUZEU2l4UFFVRkJMRWRCUVZVc1QwRkJRU3hEUVVGUkxHdENRVUZTT3p0QlFVTldMRU5CUVVFc1IwRkJTU3hQUVVGQkxFTkJRVkVzVVVGQlVqczdRVUZEU2l4WFFVRkJMRWRCUVdNc1QwRkJRU3hEUVVGUkxITkNRVUZTT3p0QlFVbGtMRkZCUVVFc1IwRkJWenM3TzBGQlJWZzdPenM3UVVGSFFTeEpRVUZCTEVkQlFVOHNVMEZCUXl4UFFVRkVMRVZCUVZVc1MwRkJWaXhGUVVFeVFpeHBRa0ZCTTBJN1FVRkhUQ3hOUVVGQk96dEpRVWhsTEZGQlFWRXNSVUZCUlN4RFFVRkRPenM3U1VGQlRTeHZRa0ZCYjBJN08wVkJSM0JFTEZGQlFVRXNSMEZIUlR0SlFVRkJMRWxCUVVFc1JVRkJUU3hKUVVGT08wbEJSMEVzUzBGQlFTeEZRVU5GTzAxQlFVRXNWMEZCUVN4RlFVRmhMRU5CUVdJN1RVRkRRU3hYUVVGQkxFVkJRV0VzUTBGRVlqdE5RVVZCTEV0QlFVRXNSVUZCVHl4RlFVWlFPMDFCUjBFc1MwRkJRU3hGUVVGUExFVkJTRkE3VFVGSlFTeFRRVUZCTEVWQlFWY3NUVUZLV0R0TlFVdEJMRlZCUVVFc1JVRkJXU3hMUVV4YU8wMUJUVUVzVDBGQlFTeEZRVUZQTEVWQlRsQTdTMEZLUmp0SlFWZEJMRTFCUVVFc1JVRkJVU3hGUVZoU08wbEJXVUVzVFVGQlFTeEZRVUZSTEVWQldsSTdTVUZsUVN4TFFVRkJMRVZCUTBVN1RVRkJRU3hQUVVGQkxFVkJRVThzUlVGQlVEdE5RVU5CTEV0QlFVRXNSVUZCVHl4RlFVUlFPMDFCUlVFc1owSkJRVUVzUlVGQmEwSXNSVUZHYkVJN1RVRkhRU3hYUVVGQkxFVkJRV0VzUlVGSVlqdE5RVWxCTEUxQlFVRXNSVUZCVVN4RlFVcFNPMHRCYUVKR08wbEJkVUpCTEV0QlFVRXNSVUZCVHl4RlFYWkNVRHRKUVRCQ1FTeExRVUZCTEVWQlFVOHNSVUV4UWxBN1NVRTBRa0VzWlVGQlFTeEZRVUZwUWl4TFFUVkNha0k3U1VFMlFrRXNZVUZCUVN4RlFVRmxMRXRCTjBKbU96dEZRU3RDUml4SlFVRkJMRWRCUVU4N1JVRkRVQ3hMUVVGQkxFZEJRVkVzVDBGQlFTeERRVUZCTzBWQlExSXNWMEZCUVN4SFFVRmpPMFZCUldRc1JVRkJSU3hEUVVGRExFMUJRVWdzUTBGQlZTeFJRVUZXTEVWQlFXOUNMRTlCUVhCQ0xFVkJRVFpDTEVsQlFUZENPMFZCUTBFc1IwRkJRU3hIUVVGTkxGZEJRVUVzUTBGQldTeFJRVUZhTEVWQlFYTkNMRkZCUVhSQ0xFVkJRV2RETEV0QlFXaERMRVZCUVhWRExHbENRVUYyUXp0RlFVZE9MRXRCUVVFc1IwRkJVVHRGUVVOU0xFdEJRVUVzUjBGQlVUdEZRVU5TTEZGQlFVRXNSMEZCVnp0RlFVbFlMRWxCUVVFc1IwRkJUeXhEUVVGRExFTkJRVU1zU1VGQlJpeERRVUZQTEZOQlFVRTdRVUZEV2l4UlFVRkJPMGxCUVVFc1NVRkJSeXhSUVVGUkxFTkJRVU1zU1VGQldqdE5RVU5GTEVkQlFVRXNSMEZCVlN4SlFVRkJMRmRCUVVFc1EwRkJXU3hSUVVGUkxFTkJRVU1zU1VGQmNrSTdUVUZEVml4TlFVRkJMRWRCUVZNc1IwRkJSeXhEUVVGRExFMUJSbVk3TzBsQlIwRXNTVUZCUnl4TlFVRklPMDFCUTBVc1NVRkJRU3hIUVVGUExFTkJRVUVzUTBGQlJTeE5RVUZHTzAxQlJWQXNTMEZCUVN4SFFVRlJMRWxCUVVrc1EwRkJReXhKUVVGTUxFTkJRVlVzVDBGQlZqdE5RVU5TTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1RVRkJUaXhEUVVGaExFdEJRV0k3VFVGRFFTeExRVUZCTEVkQlFWRXNSVUZCUlN4RFFVRkRMR05CUVVnc1EwRkJhMElzUzBGQlRTeERRVUZCTEVOQlFVRXNRMEZCZUVJN1RVRkRVaXhSUVVGQkxFZEJRVmNzUlVGQlJTeERRVUZETEdOQlFVZ3NRMEZCYTBJc1MwRkJUU3hEUVVGQkxFTkJRVUVzUTBGQlJTeERRVUZETEVsQlFVc3NRMEZCUVN4RFFVRkJMRU5CUVdoRE8wMUJSVmdzUzBGQlFTeEhRVUZSTEVsQlFVa3NRMEZCUXl4SlFVRk1MRU5CUVZVc1QwRkJWanROUVVOU0xFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVGl4RFFVRmhMRXRCUVdJN1RVRkRRU3hMUVVGQkxFZEJRVkVzUlVGQlJTeERRVUZETEdOQlFVZ3NRMEZCYTBJc1MwRkJUU3hEUVVGQkxFTkJRVUVzUTBGQmVFSTdUVUZGVWl4VFFVRkJMRU5CUVVFc1JVRmFSanRMUVVGQkxFMUJRVUU3VFVGalJTeExRVUZCTEVkQlFWRXNSMEZCUnl4RFFVRkRMRWxCUVVvc1EwRkJVeXhQUVVGVUxFVkJRV3RDTEZGQlFWRXNRMEZCUXl4TFFVRXpRanROUVVOU0xGRkJRVUVzUjBGQlZ5eExRVUZMTEVOQlFVTXNTVUZCVGl4RFFVRlhMRWxCUVZnN1RVRkRXQ3hMUVVGQkxFZEJRVkVzUjBGQlJ5eERRVUZETEVsQlFVb3NRMEZCVXl4UFFVRlVMRVZCUVd0Q0xGRkJRVkVzUTBGQlF5eExRVUV6UWp0TlFVTlNMRWxCUVVrc1EwRkJReXhKUVVGTUxFTkJRVlVzUzBGQlN5eERRVUZETEVsQlFVNHNRMEZCVnl4SlFVRllMRU5CUVZZc1JVRnFRa1k3TzFkQmEwSkJPMFZCZEVKWkxFTkJRVkE3UlVFd1FsQXNVMEZCUVN4SFFVRlpMRk5CUVVFN1FVRkRWaXhSUVVGQk8wbEJRVUVzUTBGQlFTeEhRVUZKTzBGQlEwbzdWMEZCVFN4TFFVRk5MRU5CUVVFc1EwRkJRU3hEUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFXUXNSMEZCZFVJc1EwRkJOMEk3VFVGRFJTeERRVUZCTEVkQlFVazdUVUZEU2l4TlFVRkJMRWRCUVZNc1JVRkJSU3hEUVVGRExHTkJRVWdzUTBGQmEwSXNTMEZCVFN4RFFVRkJMRU5CUVVFc1EwRkJSU3hEUVVGRExFbEJRVXNzUTBGQlFTeERRVUZCTEVOQlFXaERPMDFCUTFRc1NVRkJTU3hEUVVGRExFbEJRVXdzUTBGQlZTeE5RVUZXTzBGQlEwRXNZVUZCVFN4TFFVRk5MRU5CUVVFc1EwRkJRU3hEUVVGRkxFTkJRVU1zU1VGQlN5eERRVUZCTEVOQlFVRXNRMEZCUlN4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGMlFpeEhRVUZuUXl4RFFVRjBRenRSUVVORkxFOUJRVUVzUjBGQlZTeExRVUZMTEVOQlFVTXNSMEZCVGl4RFFVRlZMRU5CUVVFc1IwRkJSU3hEUVVGYUxFVkJRV1VzUTBGQlFTeEhRVUZGTEVOQlFXcENPMUZCUTFZc1NVRkJSeXhEUVVGSkxFOUJRVkE3VlVGRFJTeFBRVUZCTEVkQlFWVXNSVUZCUlN4RFFVRkRMR05CUVVnc1EwRkJhMElzUzBGQlRTeERRVUZCTEVOQlFVRXNRMEZCUlN4RFFVRkRMRWxCUVVzc1EwRkJRU3hEUVVGQkxFTkJRVVVzUTBGQlF5eExRVUZOTEVOQlFVRXNRMEZCUVN4RFFVRjZRenRWUVVOV0xFdEJRVXNzUTBGQlF5eEhRVUZPTEVOQlFWVXNRMEZCUVN4SFFVRkZMRU5CUVZvc1JVRkJaU3hEUVVGQkxFZEJRVVVzUTBGQmFrSXNSVUZCYjBJc1QwRkJjRUlzUlVGR1JqczdVVUZIUVN4RFFVRkJMRWxCUVVzN1RVRk1VRHR0UWtGTlFTeERRVUZCTEVsQlFVczdTVUZXVUN4RFFVRkJPenRGUVVaVk8wVkJaMEphTEZkQlFVRXNSMEZCWXl4VFFVRkJPMWRCUTFvc1MwRkJTeXhEUVVGRExFbEJRVTRzUTBGQlZ5eFRRVUZETEV0QlFVUXNSVUZCVVN4TFFVRlNMRVZCUVdVc1IwRkJaanRCUVVOVUxGVkJRVUU3VFVGQlFTeEpRVUZITEVOQlFVa3NSMEZCVUR0UlFVTkZMRWRCUVVFc1IwRkJUU3hIUVVGSExFTkJRVU1zUjBGQlNpeERRVUZSTEV0QlFWSTdaVUZEVGl4SFFVRkhMRU5CUVVNc1NVRkJTaXhEUVVGVExFdEJRVlFzUlVGQlowSXNSVUZCYUVJc1JVRkdSanM3U1VGRVV5eERRVUZZTzBWQlJGazdSVUZSWkN4SFFVRkhMRU5CUVVNc1IwRkJTaXhEUVVGUkxGRkJRVklzUlVGQmEwSXNVMEZCUXl4TFFVRkVMRVZCUVZFc1QwRkJVanRCUVVOb1FpeFJRVUZCTzBsQlFVRXNSMEZCUnl4RFFVRkRMRWxCUVVvc1EwRkJRVHRKUVVOQkxGZEJRVUVzU1VGQlpUdEpRVU5tTEVWQlFVRXNSMEZCU3p0SlFVTk1MRU5CUVVFc1IwRkJTVHRCUVVOS0xGZEJRVTBzUzBGQlRTeERRVUZCTEVOQlFVRXNRMEZCUlN4RFFVRkRMRWxCUVVzc1EwRkJRU3hEUVVGQkxFTkJRVVVzUTBGQlF5eExRVUZMTEVOQlFVTXNUVUZCZGtJc1IwRkJaME1zUzBGQmRFTTdUVUZEUlN4UlFVRkJMRWRCUVZjc1MwRkJUU3hEUVVGQkxFTkJRVUVzUTBGQlJTeERRVUZETEVsQlFVc3NRMEZCUVN4RFFVRkJMRU5CUVVVc1EwRkJReXhMUVVGTkxFTkJRVUVzUTBGQlFUdE5RVU5zUXl4SlFVRkhMRU5CUVVrc1VVRkJVRHRSUVVORkxFVkJRVUVzUjBGQlN5eFJRVUZSTEVOQlFVTXNTVUZCVkN4RFFVRmpMRWxCUVdRc1JVRkJiMElzUlVGQmNFSXNSVUZFVUR0UFFVRkJMRTFCUVVFN1VVRkhSU3hGUVVGQkxFZEJRVXNzUlVGQlJTeERRVUZETEdOQlFVZ3NRMEZCYTBJc1VVRkJiRUlzUlVGQk5FSXNTVUZCTlVJc1JVRklVRHM3VFVGSlFTeERRVUZCTEVsQlFVczdTVUZPVUR0SlFVOUJMRWxCUVVjc1EwRkJTU3hGUVVGUU8wMUJRMFVzVVVGQlFTeEhRVUZYTEV0QlFVMHNRMEZCUVN4RFFVRkJMRU5CUVVVc1EwRkJReXhKUVVGTExFTkJRVUVzUTBGQlFTeERRVUZGTEVOQlFVTXNTMEZCVFN4RFFVRkJMRXRCUVVFc1IwRkJUU3hEUVVGT08wMUJRMnhETEVWQlFVRXNSMEZCU3l4RlFVRkZMRU5CUVVNc1kwRkJTQ3hEUVVGclFpeFJRVUZzUWl4RlFVRTBRaXhKUVVFMVFpeEZRVVpRT3p0SlFVZEJMRVZCUVVVc1EwRkJReXhKUVVGSUxFTkJRVkVzVDBGQlVqdFhRVU5CTzBWQmFFSm5RaXhEUVVGc1FqdEZRVzlDUVN4SFFVRkhMRU5CUVVNc1IwRkJTaXhEUVVGUkxFdEJRVklzUlVGQlpTeFRRVUZETEV0QlFVUXNSVUZCVVN4SlFVRlNPMEZCUTJJc1VVRkJRVHRKUVVGQkxFZEJRVUVzUjBGQlRTeEpRVUZMTEVOQlFVRXNTMEZCUVN4SFFVRk5MRU5CUVU0N1NVRkZXQ3hKUVVGSExFTkJRVWtzUjBGQlVEdEJRVU5GTEdGQlFVMHNTVUZCU1N4RFFVRkRMRTFCUVV3c1IwRkJZeXhMUVVGd1FqdFJRVU5GTEVkQlFVRXNSMEZCVFN4TFFVRkxMRU5CUVVNc1NVRkJUaXhEUVVGWExFbEJRVmdzUlVGQmFVSXNSVUZCYWtJN1VVRkRUaXhKUVVGSkxFTkJRVU1zU1VGQlRDeERRVUZWTEVkQlFWWTdUVUZHUml4RFFVUkdPenRKUVV0QkxFbEJRVWNzUTBGQlNTeEhRVUZITEVOQlFVTXNTVUZCV0R0TlFVTkZMRWRCUVVjc1EwRkJReXhIUVVGS0xFTkJRVkVzVFVGQlVpeEZRVUZuUWl4VFFVRkRMRXRCUVVRc1JVRkJVU3hKUVVGU08wRkJRMlFzV1VGQlFUdFJRVUZCTEVsQlFVRXNSMEZCVHl4RlFVRkZMRU5CUVVNc1MwRkJTeXhEUVVGRExFVkJRVlFzUTBGQldTeEpRVUZhTEVWQlFXdENMRWRCUVd4Q08xRkJRMUFzUzBGQlN5eERRVUZETEVkQlFVNHNRMEZCVlN4TFFVRldMRVZCUVdsQ0xFdEJRV3BDTEVWQlFYZENMRWxCUVhoQ08yVkJRMEU3VFVGSVl5eERRVUZvUWl4RlFVUkdPenRYUVUxQk8wVkJaR0VzUTBGQlpqdEZRV3RDUVN4SFFVRkhMRU5CUVVNc1IwRkJTaXhEUVVGUkxFMUJRVklzUlVGQlowSXNVMEZCUXl4TFFVRkVMRVZCUVZFc1MwRkJVaXhGUVVGbExFbEJRV1k3UVVGRFpDeFJRVUZCTzBsQlFVRXNTVUZCUnl4TFFVRkJMRWRCUVZFc1EwRkJXRHROUVVGclFpeExRVUZCTEVkQlFWRXNSVUZCTVVJN08wbEJRMEVzU1VGQlJ5eExRVUZCTEVkQlFWRXNRMEZCV0R0TlFVRnJRaXhMUVVGQkxFZEJRVkVzUlVGQk1VSTdPMGxCUTBFc1NVRkJSeXhYUVVGQkxFZEJRV01zUTBGQlpDeEpRVUZ2UWl4TFFVRkJMRWRCUVUwc1EwRkJUaXhIUVVGVkxGZEJRV3BETzBGQlFXdEVMRmxCUVZVc1NVRkJRU3hMUVVGQkxFTkJRVTBzZDBSQlFVRXNSMEZCTWtRc1MwRkJNMFFzUjBGQmJVVXNSMEZCYmtVc1IwRkJlVVVzUzBGQmVrVXNSMEZCYVVZc1NVRkJka1lzUlVGQk5VUTdPMGxCUlVFc1IwRkJRU3hIUVVGTkxFZEJRVWNzUTBGQlF5eEhRVUZLTEVOQlFWRXNTMEZCVWp0SlFVVk9MRWxCUVVFc1IwRkJUeXhMUVVGTExFTkJRVU1zUjBGQlRpeERRVUZWTEV0QlFWWXNSVUZCYVVJc1MwRkJha0k3U1VGRlVDeEpRVUZITEVOQlFVa3NTVUZCVUR0TlFVTkZMRU5CUVVFc1IwRkJTVHRCUVVOS0xHRkJRVTBzUTBGQlFTeEhRVUZKTEV0QlFWWTdVVUZEUlN4RFFVRkJMRWxCUVVzN1VVRkRUQ3hKUVVGSExFTkJRVUVzUzBGQlN5eExRVUZTTzFWQlEwVXNUVUZCUVN4SFFVRlRMRVZCUVVVc1EwRkJReXhOUVVGSUxFTkJRVlU3V1VGQlF5eExRVUZCTEVWQlFVOHNVVUZCVVN4RFFVRkRMRXRCUVdwQ08xZEJRVllzUlVGQmJVTXNTVUZCYmtNN1ZVRkRWQ3hKUVVGQkxFZEJRVThzUjBGQlJ5eERRVUZETEVsQlFVb3NRMEZCVXl4TFFVRlVMRVZCUVdkQ0xFMUJRV2hDTEVWQlJsUTdVMEZCUVN4TlFVRkJPMVZCU1VVc1QwRkJRU3hIUVVGVkxFdEJRVXNzUTBGQlF5eEhRVUZPTEVOQlFWVXNTMEZCVml4RlFVRnBRaXhEUVVGcVFqdFZRVU5XTEVsQlFVY3NRMEZCU1N4UFFVRlFPMWxCUTBVc1QwRkJRU3hIUVVGWExFZEJRVWNzUTBGQlF5eEpRVUZLTEVOQlFWTXNRMEZCVkN4RlFVRlpPMk5CUVVFc1MwRkJRU3hGUVVGUExGRkJRVkVzUTBGQlF5eExRVUZvUWp0aFFVRmFMRVZCUkdJN1YwRk1SanM3VFVGR1JpeERRVVpHT3p0WFFWbEJPMFZCY2tKakxFTkJRV2hDTzBWQmVVSkJMRWxCUVVFc1EwRkJRVHRGUVVsQkxFZEJRVWNzUTBGQlF5eEhRVUZLTEVOQlFWRXNUMEZCVWl4RlFVRnBRaXhMUVVGcVFqdEZRVWxCTEVkQlFVY3NRMEZCUXl4SFFVRktMRU5CUVZFc1QwRkJVaXhGUVVGcFFpeExRVUZxUWp0VFFVbEJPMEZCYUV4TE96dEJRV3RNVUN4RlFVRkZMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVlFzUTBGQmEwSXNVVUZCYkVJc1JVRkJORUlzU1VGQk5VSTdPMEZCUTBFc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSWlMQ0ptYVd4bElqb2laMlZ1WlhKaGRHVmtMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWs5S0lEMGdjbVZ4ZFdseVpTQW5MaTR2YjJvblhISmNibTV2WkdWR1lXTjBiM0o1SUQwZ2NtVnhkV2x5WlNBbkxpNHZaRzl0TDI1dlpHVkdZV04wYjNKNUoxeHlYRzVmSUQwZ2NtVnhkV2x5WlNBbmJHOWtZWE5vSjF4eVhHNWhjbkpoZVRKRUlEMGdjbVZ4ZFdseVpTQW5MaTR2ZEc5dmJITXZZWEp5WVhreVJDZGNjbHh1SkNBOUlISmxjWFZwY21VZ0oycHhkV1Z5ZVNkY2NseHVTbk52YmxSdlZHRmliR1VnUFNCeVpYRjFhWEpsSUNjdUxpOTBiMjlzY3k5S2MyOXVWRzlVWVdKc1pTZGNjbHh1WEhKY2JpTWdJeUIwWVdKc1pWeHlYRzVjY2x4dWJtOWtaVTVoYldVZ1BTQW5kR0ZpYkdVblhISmNibHh5WEc0akl5TmNjbHh1UTNKbFlYUmxJR0Z1SUVoVVRVd2dkR0ZpYkdVdUlGQnliM1pwWkdWeklHaGxiSEJsY2lCdFpYUm9iMlJ6SUhSdklHTnlaV0YwWlNCRGIyeDFiVzV6SUdGdVpDQkRaV3hzY3k1Y2NseHVJeU1qWEhKY2JtNXZaR1VnUFNBb2IzQjBhVzl1Y3l3Z2IzZHVaWElnUFNCUFNpNWliMlI1TENCallXeHNaV1JHY205dFJtRmpkRzl5ZVNBOUlHWmhiSE5sS1NBdFBseHlYRzVjY2x4dUlDQWpJQ01qSUc5d2RHbHZibk5jY2x4dUlDQmtaV1poZFd4MGN5QTlYSEpjYmlBZ0lDQWpJQ01qSXlCa1lYUmhYSEpjYmlBZ0lDQWpJRzl3ZEdsdmJtRnNJR0Z5Y21GNUlHOW1JRzlpYW1WamRITXVJR2xtSUhCeWIzWnBaR1ZrSUhkcGJHd2daMlZ1WlhKaGRHVWdkR0ZpYkdVZ1lYVjBiMjFoZEdsallXeHNlUzVjY2x4dUlDQWdJR1JoZEdFNklHNTFiR3hjY2x4dUlDQWdJQ01nSXlNaklIQnliM0J6WEhKY2JpQWdJQ0FqSUc5d2RHbHZibUZzSUhCeWIzQmxjblJwWlhNZ2RHOGdZWEJ3YkhrZ2RHOGdkR0ZpYkdVZ2NtOXZkQ0J1YjJSbFhISmNiaUFnSUNCd2NtOXdjenBjY2x4dUlDQWdJQ0FnWTJWc2JIQmhaR1JwYm1jNklEQmNjbHh1SUNBZ0lDQWdZMlZzYkhOd1lXTnBibWM2SURCY2NseHVJQ0FnSUNBZ1lXeHBaMjQ2SUNjblhISmNiaUFnSUNBZ0lIZHBaSFJvT2lBbkoxeHlYRzRnSUNBZ0lDQmpaV3hzWVd4cFoyNDZJQ2RzWldaMEoxeHlYRzRnSUNBZ0lDQmpaV3hzZG1Gc2FXZHVPaUFuZEc5d0oxeHlYRzRnSUNBZ0lDQmpiR0Z6Y3pvZ0p5ZGNjbHh1SUNBZ0lITjBlV3hsY3pvZ2UzMWNjbHh1SUNBZ0lHVjJaVzUwY3pvZ2UzMWNjbHh1SUNBZ0lDTWdJeU1qSUdObGJHeHpYSEpjYmlBZ0lDQWpJRzl3ZEdsdmJtRnNJSEJ5YjNCbGNuUnBaWE1nZEc4Z1lYQndiSGtnZEc4Z2FXNWthWFpwWkhWaGJDQmpaV3hzYzF4eVhHNGdJQ0FnWTJWc2JITTZYSEpjYmlBZ0lDQWdJR05zWVhOek9pQW5KMXh5WEc0Z0lDQWdJQ0JoYkdsbmJqb2dKeWRjY2x4dUlDQWdJQ0FnSjNabGNuUnBZMkZzTFdGc2FXZHVKem9nSnlkY2NseHVJQ0FnSUNBZ1kyVnNiSEJoWkdScGJtYzZJQ2NuWEhKY2JpQWdJQ0FnSUcxaGNtZHBiam9nSnlkY2NseHVJQ0FnSUNNZ0l5TWpJSFJvWldGa1hISmNiaUFnSUNBaklHOXdkR2x2Ym1Gc0lHOXdkR2x2Ym5NZ2IySnFaV04wSUhSdklIQmhjM01nYVc1MGJ5QjBhR1ZoWkNCamNtVmhkR2x2Ymx4eVhHNGdJQ0FnZEdobFlXUTZJSHQ5WEhKY2JpQWdJQ0FqSUNNakl5QjBZbTlrZVZ4eVhHNGdJQ0FnSXlCdmNIUnBiMjVoYkNCdmNIUnBiMjV6SUc5aWFtVmpkQ0IwYnlCd1lYTnpJR2x1ZEc4Z2RHSnZaSGtnWTNKbFlYUnBiMjVjY2x4dUlDQWdJSFJpYjJSNU9pQjdmVnh5WEc1Y2NseHVJQ0FnSUdacGNuTjBRV3hwWjI1U2FXZG9kRG9nWm1Gc2MyVmNjbHh1SUNBZ0lHOWtaRUZzYVdkdVVtbG5hSFE2SUdaaGJITmxYSEpjYmx4eVhHNGdJSEp2ZDNNZ1BTQmJYVnh5WEc0Z0lHTmxiR3h6SUQwZ1lYSnlZWGt5UkNncFhISmNiaUFnWTI5c2RXMXVRMjkxYm5RZ1BTQXdYSEpjYmx4eVhHNGdJRTlLTG1WNGRHVnVaQ0JrWldaaGRXeDBjeXdnYjNCMGFXOXVjeXdnZEhKMVpWeHlYRzRnSUhKbGRDQTlJRzV2WkdWR1lXTjBiM0o1SUc1dlpHVk9ZVzFsTENCa1pXWmhkV3gwY3l3Z2IzZHVaWElzSUdOaGJHeGxaRVp5YjIxR1lXTjBiM0o1WEhKY2JpQmNjbHh1WEhKY2JpQWdkR0p2WkhrZ1BTQnVkV3hzWEhKY2JpQWdkR2hsWVdRZ1BTQnVkV3hzWEhKY2JpQWdkR2hsWVdSU2IzY2dQU0J1ZFd4c1hISmNibHh5WEc0Z0lDTWdJeU1qSUdsdWFYUmNjbHh1SUNBaklHbHVkR1Z5Ym1Gc0lHMWxkR2h2WkNCbWIzSWdiMjVsSUhScGJXVWdhVzVwZEdsaGJHbDZZWFJwYjI0Z2IyWWdkR2hsSUhSaFlteGxYSEpjYmlBZ2FXNXBkQ0E5SUY4dWIyNWpaU0F0UGx4eVhHNGdJQ0FnYVdZZ1pHVm1ZWFZzZEhNdVpHRjBZVnh5WEc0Z0lDQWdJQ0JxTW5RZ1BTQnVaWGNnU25OdmJsUnZWR0ZpYkdVZ1pHVm1ZWFZzZEhNdVpHRjBZVnh5WEc0Z0lDQWdJQ0IwWW14VGRISWdQU0JxTW5RdWRHRmliR1ZjY2x4dUlDQWdJR2xtSUhSaWJGTjBjbHh5WEc0Z0lDQWdJQ0JxVkdKc0lEMGdKQ0IwWW14VGRISmNjbHh1WEhKY2JpQWdJQ0FnSUdwSVpXRmtJRDBnYWxSaWJDNW1hVzVrSUNkMGFHVmhaQ2RjY2x4dUlDQWdJQ0FnY21WMExpUXVZWEJ3Wlc1a0lHcElaV0ZrWEhKY2JpQWdJQ0FnSUhSb1pXRmtJRDBnWld3dWNtVnpkRzl5WlVWc1pXMWxiblFnYWtobFlXUmJNRjFjY2x4dUlDQWdJQ0FnZEdobFlXUlNiM2NnUFNCbGJDNXlaWE4wYjNKbFJXeGxiV1Z1ZENCMGFHVmhaRnN3WFM1eWIzZHpXekJkWEhKY2JseHlYRzRnSUNBZ0lDQnFRbTlrZVNBOUlHcFVZbXd1Wm1sdVpDQW5kR0p2WkhrblhISmNiaUFnSUNBZ0lISmxkQzRrTG1Gd2NHVnVaQ0JxUW05a2VWeHlYRzRnSUNBZ0lDQjBZbTlrZVNBOUlHVnNMbkpsYzNSdmNtVkZiR1Z0Wlc1MElHcENiMlI1V3pCZFhISmNibHh5WEc0Z0lDQWdJQ0JzYjJGa1EyVnNiSE1vS1Z4eVhHNGdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQjBhR1ZoWkNBOUlISmxkQzV0WVd0bElDZDBhR1ZoWkNjc0lHUmxabUYxYkhSekxuUm9aV0ZrWEhKY2JpQWdJQ0FnSUhSb1pXRmtVbTkzSUQwZ2RHaGxZV1F1YldGclpTQW5kSEluWEhKY2JpQWdJQ0FnSUhSaWIyUjVJRDBnY21WMExtMWhhMlVnSjNSaWIyUjVKeXdnWkdWbVlYVnNkSE11ZEdKdlpIbGNjbHh1SUNBZ0lDQWdjbTkzY3k1d2RYTm9JSFJpYjJSNUxtMWhhMlVnSjNSeUoxeHlYRzRnSUNBZ2NtVjBYSEpjYmx4eVhHNGdJQ01nSXlNaklHeHZZV1JEWld4c2MxeHlYRzRnSUNNZ2FXNTBaWEp1WVd3Z2JXVjBhRzlrSUdkMVlYSmhiblJsWlhNZ2RHaGhkQ0IwWVdKc1pYTWdiRzloWkdWa0lHWnliMjBnU2xOUFRpQmhjbVVnWm5Wc2JIa2diRzloWkdWa0lHbHVkRzhnYldWdGIzSjVYSEpjYmlBZ2JHOWhaRU5sYkd4eklEMGdLQ2tnTFQ1Y2NseHVJQ0FnSUhJZ1BTQXdYSEpjYmlBZ0lDQjNhR2xzWlNCMFltOWtlVnN3WFM1eWIzZHpMbXhsYm1kMGFDQStJSEpjY2x4dUlDQWdJQ0FnWXlBOUlEQmNjbHh1SUNBZ0lDQWdiV1Z0VW05M0lEMGdaV3d1Y21WemRHOXlaVVZzWlcxbGJuUWdkR0p2WkhsYk1GMHVjbTkzYzF0eVhWeHlYRzRnSUNBZ0lDQnliM2R6TG5CMWMyZ2diV1Z0VW05M1hISmNiaUFnSUNBZ0lIZG9hV3hsSUhSaWIyUjVXekJkTG5KdmQzTmJjbDB1WTJWc2JITXViR1Z1WjNSb0lENGdZMXh5WEc0Z0lDQWdJQ0FnSUcxbGJVTmxiR3dnUFNCalpXeHNjeTVuWlhRZ2Npc3hMQ0JqS3pGY2NseHVJQ0FnSUNBZ0lDQnBaaUJ1YjNRZ2JXVnRRMlZzYkZ4eVhHNGdJQ0FnSUNBZ0lDQWdiV1Z0UTJWc2JDQTlJR1ZzTG5KbGMzUnZjbVZGYkdWdFpXNTBJSFJpYjJSNVd6QmRMbkp2ZDNOYmNsMHVZMlZzYkhOYlkxMWNjbHh1SUNBZ0lDQWdJQ0FnSUdObGJHeHpMbk5sZENCeUt6RXNJR01yTVN3Z2JXVnRRMlZzYkZ4eVhHNGdJQ0FnSUNBZ0lHTWdLejBnTVZ4eVhHNGdJQ0FnSUNCeUlDczlJREZjY2x4dVhISmNiaUFnSXlBakl5TWdabWxzYkUxcGMzTnBibWRjY2x4dUlDQWpJR2x1ZEdWeWJtRnNJRzFsZEdodlpDQm5kV0Z5WVc1MFpXVnpJSFJvWVhRZ1kyVnNiSE1nWlhocGMzUWdabTl5SUhSb1pTQmthVzFsYm5OcGIyNXpJRzltSUhSb1pTQjBZV0pzWlZ4eVhHNGdJR1pwYkd4TmFYTnphVzVuSUQwZ0tDa2dMVDVjY2x4dUlDQWdJR05sYkd4ekxtVmhZMmdnS0hKdmQwNXZMQ0JqYjJ4T2J5d2dkbUZzS1NBdFBseHlYRzRnSUNBZ0lDQnBaaUJ1YjNRZ2RtRnNYSEpjYmlBZ0lDQWdJQ0FnY205M0lEMGdjbVYwTG5KdmR5QnliM2RPYjF4eVhHNGdJQ0FnSUNBZ0lISnZkeTVqWld4c0lHTnZiRTV2TENCN2ZWeHlYRzVjY2x4dUlDQWpJQ01qSUdOdmJIVnRibHh5WEc0Z0lDTWdRV1JrY3lCaElHTnZiSFZ0YmlCdVlXMWxJSFJ2SUhSb1pTQjBZV0pzWlNCb1pXRmtYSEpjYmlBZ2NtVjBMbUZrWkNBblkyOXNkVzF1Snl3Z0tHTnZiRTV2TENCamIyeE9ZVzFsS1NBdFBseHlYRzRnSUNBZ2NtVjBMbWx1YVhRb0tWeHlYRzRnSUNBZ1kyOXNkVzF1UTI5MWJuUWdLejBnTVZ4eVhHNGdJQ0FnZEdnZ1BTQnVkV3hzWEhKY2JpQWdJQ0JwSUQwZ01GeHlYRzRnSUNBZ2QyaHBiR1VnZEdobFlXUmJNRjB1Y205M2Mxc3dYUzVqWld4c2N5NXNaVzVuZEdnZ1BDQmpiMnhPYjF4eVhHNGdJQ0FnSUNCdVlYUnBkbVZVYUNBOUlIUm9aV0ZrV3pCZExuSnZkM05iTUYwdVkyVnNiSE5iYVYxY2NseHVJQ0FnSUNBZ2FXWWdibTkwSUc1aGRHbDJaVlJvWEhKY2JpQWdJQ0FnSUNBZ2RHZ2dQU0IwYUdWaFpGSnZkeTV0WVd0bElDZDBhQ2NzSUh0OVhISmNiaUFnSUNBZ0lHVnNjMlZjY2x4dUlDQWdJQ0FnSUNCMGFDQTlJR1ZzTG5KbGMzUnZjbVZGYkdWdFpXNTBJRzVoZEdsMlpWUm9MQ0FuZEdnblhISmNiaUFnSUNBZ0lHa2dLejBnTVZ4eVhHNGdJQ0FnYVdZZ2JtOTBJSFJvWEhKY2JpQWdJQ0FnSUc1aGRHbDJaVlJvSUQwZ2RHaGxZV1JiTUYwdWNtOTNjMXN3WFM1alpXeHNjMXRqYjJ4T2J5MHhYVnh5WEc0Z0lDQWdJQ0IwYUNBOUlHVnNMbkpsYzNSdmNtVkZiR1Z0Wlc1MElHNWhkR2wyWlZSb0xDQW5kR2duWEhKY2JpQWdJQ0IwYUM1MFpYaDBJR052YkU1aGJXVmNjbHh1SUNBZ0lIUm9YSEpjYmx4eVhHNGdJQ01nSXlNZ2NtOTNYSEpjYmlBZ0l5QkJaR1J6SUdFZ2JtVjNJSEp2ZHlBb2RISXBJSFJ2SUhSb1pTQjBZV0pzWlNCaWIyUjVYSEpjYmlBZ2NtVjBMbUZrWkNBbmNtOTNKeXdnS0hKdmQwNXZMQ0J2Y0hSektTQXRQbHh5WEc0Z0lDQWdjbTkzSUQwZ2NtOTNjMXR5YjNkT2J5MHhYVnh5WEc1Y2NseHVJQ0FnSUdsbUlHNXZkQ0J5YjNkY2NseHVJQ0FnSUNBZ2QyaHBiR1VnY205M2N5NXNaVzVuZEdnZ1BDQnliM2RPYjF4eVhHNGdJQ0FnSUNBZ0lISnZkeUE5SUhSaWIyUjVMbTFoYTJVZ0ozUnlKeXdnZTMxY2NseHVJQ0FnSUNBZ0lDQnliM2R6TG5CMWMyZ2djbTkzWEhKY2JseHlYRzRnSUNBZ2FXWWdibTkwSUhKdmR5NWpaV3hzWEhKY2JpQWdJQ0FnSUhKdmR5NWhaR1FnSjJObGJHd25MQ0FvWTI5c1RtOHNJRzl3ZEhNcElDMCtYSEpjYmlBZ0lDQWdJQ0FnWTJWc2JDQTlJRTlLTG01dlpHVnpMblJrSUc5d2RITXNJSEp2ZDF4eVhHNGdJQ0FnSUNBZ0lHTmxiR3h6TG5ObGRDQnliM2RPYnl3Z1kyOXNUbThzSUdObGJHeGNjbHh1SUNBZ0lDQWdJQ0JqWld4c1hISmNibHh5WEc0Z0lDQWdjbTkzWEhKY2JseHlYRzRnSUNNZ0l5TWdZMlZzYkZ4eVhHNGdJQ01nUVdSa2N5QmhJR05sYkd3Z0tIUnlMM1JrS1NCMGJ5QjBhR1VnZEdGaWJHVWdZbTlrZVZ4eVhHNGdJSEpsZEM1aFpHUWdKMk5sYkd3bkxDQW9jbTkzVG04c0lHTnZiRTV2TENCdmNIUnpLU0F0UGx4eVhHNGdJQ0FnYVdZZ2NtOTNUbThnUENBeElIUm9aVzRnY205M1RtOGdQU0F4WEhKY2JpQWdJQ0JwWmlCamIyeE9ieUE4SURFZ2RHaGxiaUJqYjJ4T2J5QTlJREZjY2x4dUlDQWdJR2xtSUdOdmJIVnRia052ZFc1MElENGdNQ0JoYm1RZ1kyOXNUbTh0TVNBK0lHTnZiSFZ0YmtOdmRXNTBJSFJvWlc0Z2RHaHliM2NnYm1WM0lFVnljbTl5SUNkQklHTnZiSFZ0YmlCdVlXMWxJR2hoY3lCdWIzUWdZbVZsYmlCa1pXWnBibVZrSUdadmNpQjBhR2x6SUhCdmMybDBhVzl1SUhzbklDc2djbTkzVG04Z0t5QW5lQ2NnS3lCamIyeE9ieUFySUNkOUxpZGNjbHh1WEhKY2JpQWdJQ0J5YjNjZ1BTQnlaWFF1Y205M0lISnZkMDV2WEhKY2JseHlYRzRnSUNBZ1kyVnNiQ0E5SUdObGJHeHpMbWRsZENCeWIzZE9ieXdnWTI5c1RtOWNjbHh1WEhKY2JpQWdJQ0JwWmlCdWIzUWdZMlZzYkZ4eVhHNGdJQ0FnSUNCcElEMGdNRnh5WEc0Z0lDQWdJQ0IzYUdsc1pTQnBJRHdnWTI5c1RtOWNjbHh1SUNBZ0lDQWdJQ0JwSUNzOUlERmNjbHh1SUNBZ0lDQWdJQ0JwWmlCcElHbHpJR052YkU1dlhISmNiaUFnSUNBZ0lDQWdJQ0J1ZFU5d2RITWdQU0JQU2k1bGVIUmxibVFnZTNCeWIzQnpPaUJrWldaaGRXeDBjeTVqWld4c2MzMHNJRzl3ZEhOY2NseHVJQ0FnSUNBZ0lDQWdJR05sYkd3Z1BTQnliM2N1WTJWc2JDQmpiMnhPYnl3Z2JuVlBjSFJ6WEhKY2JpQWdJQ0FnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0FnSUNBZ2RISjVRMlZzYkNBOUlHTmxiR3h6TG1kbGRDQnliM2RPYnl3Z2FWeHlYRzRnSUNBZ0lDQWdJQ0FnYVdZZ2JtOTBJSFJ5ZVVObGJHeGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2RISjVRMlZzYkNBOUlDQnliM2N1WTJWc2JDQnBMQ0J3Y205d2N6b2daR1ZtWVhWc2RITXVZMlZzYkhOY2NseHVYSEpjYmlBZ0lDQmpaV3hzWEhKY2JseHlYRzRnSUNNZ0l5TWdSbWx1WVd4cGVtVmNjbHh1SUNBaklFWnBibUZzYVhwbElHZDFZWEpoYm5SbFpYTWdkR2hoZENCMGFHVmhaQ0JoYm1RZ2RHSnZaSGtnWVc1a0lHTnlaV0YwWldRZ2QyaGxiaUIwYUdVZ2JtOWtaU0JwY3lCbWRXeHNlU0JwYm5OMFlXNTBhV0YwWldSY2NseHVJQ0JwYm1sMEtDbGNjbHh1WEhKY2JpQWdJeUFqSXlCVVNHVmhaRnh5WEc0Z0lDTWdSWGh3YjNObElIUm9aU0JwYm5SbGNtNWhiQ0IwYUdWaFpDQnViMlJsWEhKY2JpQWdjbVYwTG1Ga1pDQW5kR2hsWVdRbkxDQjBhR1ZoWkZ4eVhHNWNjbHh1SUNBaklDTWpJRlJDYjJSNVhISmNiaUFnSXlCRmVIQnZjMlVnZEdobElHbHVkR1Z5Ym1Gc0lIUmliMlI1SUc1dlpHVmNjbHh1SUNCeVpYUXVZV1JrSUNkMFltOWtlU2NzSUhSaWIyUjVYSEpjYmx4eVhHNGdJQ0FnWEhKY2JseHlYRzRnSUhKbGRGeHlYRzVjY2x4dVQwb3VibTlrWlhNdWNtVm5hWE4wWlhJZ2JtOWtaVTVoYldVc0lHNXZaR1ZjY2x4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCdWIyUmxYSEpjYmlKZGZRPT0iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuZW51bXMgPSByZXF1aXJlICcuLi90b29scy9lbnVtcydcclxuXHJcbm5vZGVOYW1lID0gJ3RleHRhcmVhJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBuYW1lOiAnJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogJydcclxuICAgICAgdmFsdWU6ICcnXHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICAgIG1heGxlbmd0aDogJydcclxuICAgICAgYXV0b2ZvY3VzOiBmYWxzZVxyXG4gICAgICBpc1JlcXVpcmVkOiBmYWxzZVxyXG4gICAgICByb3dzOiAzXHJcbiAgICAgIGNvbHM6IDI1XHJcbiAgICAgIGRpc2FibGVkOiBmYWxzZVxyXG4gICAgICByZWFkb25seTogZmFsc2VcclxuICAgICAgZm9ybTogJydcclxuICAgICAgd3JhcDogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHZhbHVlID0gZGVmYXVsdHMucHJvcHMudmFsdWVcclxuXHJcbiAgc3luY1ZhbHVlID0gLT5cclxuICAgIHN3aXRjaCBkZWZhdWx0cy5wcm9wcy50eXBlXHJcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5jaGVja2JveFxyXG4gICAgICAgIHZhbHVlID0gcmV0LiQuaXMoJzpjaGVja2VkJylcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLnJhZGlvXHJcbiAgICAgICAgdmFsdWUgPSByZXQuJC5maW5kKCc6Y2hlY2tlZCcpLnZhbCgpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICB2YWx1ZSA9IHJldC52YWwoKVxyXG5cclxuICAjIENsaWNrIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIHJldHZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuXHJcbiAgIyBDaGFuZ2UgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICBjaGFuZ2UgPSBkZWZhdWx0cy5ldmVudHMuY2hhbmdlXHJcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG5ub2RlTmFtZSA9ICd0aGVhZCdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczoge31cclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIG51bWJlcjogMVxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcm93cyA9IFtdXHJcbiAgY2VsbHMgPSB7fVxyXG4gIHJldC5hZGQgJ2NlbGwnLCAocm93Tm8sIGNvbE5vKSAtPlxyXG4gICAgaW5pdCgpXHJcblxyXG4gICAgaWYgcm93Tm8gPCAxIHRoZW4gcm93Tm8gPSAxXHJcbiAgICBpZiBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcclxuXHJcbiAgICByb3cgPSByb3dzW3Jvd05vLTFdXHJcblxyXG4gICAgaWYgbm90IHJvd1xyXG4gICAgICB3aGlsZSByb3dzLmxlbmd0aCA8IHJvd05vXHJcbiAgICAgICAgcm93ID0gT0oubm9kZXMudHIge30sIHRib2R5LCBmYWxzZVxyXG4gICAgICAgIHJvd3MucHVzaCByb3dcclxuXHJcbiAgICB0ZCA9IHJvd1swXS5jZWxsc1tjb2xOb11cclxuXHJcbiAgICBpZiB0ZCB0aGVuIGNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCB0ZCwgJ3RkJ1xyXG4gICAgaWYgbm90IHRkXHJcbiAgICAgIHdoaWxlIHJvd1swXS5jZWxscy5sZW5ndGggPCBjb2xOb1xyXG4gICAgICAgIGlkeCA9IHJvd1swXS5jZWxscy5sZW5ndGhcclxuICAgICAgICB0ZCA9IHJvd1swXS5jZWxsc1tpZHgtMV1cclxuICAgICAgICBpZiB0ZCBhbmQgaWR4IGlzIGNvbE5vXHJcbiAgICAgICAgICBjZWxsID0gZWwucmVzdG9yZUVsZW1lbnQgdGQsICd0ZCdcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBjZWxsID0gT0oubm9kZXMudGQgcHJvcHM6IGRlZmF1bHRzLmNlbGxzLCByb3csIGZhbHNlXHJcblxyXG4gICAgaWYgbm90IGNlbGwuaXNWYWxpZFxyXG4gICAgICBub2RlRmFjdG9yeSBjZWxsLCByb3csIHJvd05vICsgY29sTm9cclxuXHJcbiAgICBjZWxsXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxubm9kZU5hbWUgPSAndWwnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciB0aGlzR2xvYmFsO1xuXG50aGlzR2xvYmFsID0gKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnICYmIGdsb2JhbCA/IGdsb2JhbCA6ICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgc2VsZiA/IHNlbGYgOiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93ID8gd2luZG93IDogdGhpcykpKTtcblxubW9kdWxlLmV4cG9ydHMgPSB0aGlzR2xvYmFsO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeG5iRzlpWVd3dVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFTeEpRVUZCT3p0QlFVRkJMRlZCUVVFc1IwRkJZU3hEUVVGTExFOUJRVThzVFVGQlVDeExRVUZ0UWl4WFFVRnVRaXhKUVVGdFF5eE5RVUYyUXl4SFFVRnZSQ3hOUVVGd1JDeEhRVUZuUlN4RFFVRkxMRTlCUVU4c1NVRkJVQ3hMUVVGcFFpeFhRVUZxUWl4SlFVRnBReXhKUVVGeVF5eEhRVUZuUkN4SlFVRm9SQ3hIUVVFd1JDeERRVUZMTEU5QlFVOHNUVUZCVUN4TFFVRnRRaXhYUVVGdVFpeEpRVUZ0UXl4TlFVRjJReXhIUVVGdlJDeE5RVUZ3UkN4SFFVRm5SU3hKUVVGcVJTeERRVUV6UkN4RFFVRnFSVHM3UVVGRFlpeE5RVUZOTEVOQlFVTXNUMEZCVUN4SFFVRnBRaUlzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRHaHBjMGRzYjJKaGJDQTlJQ2hwWmlBb2RIbHdaVzltSUdkc2IySmhiQ0JwYzI1MElDZDFibVJsWm1sdVpXUW5JR0Z1WkNCbmJHOWlZV3dwSUhSb1pXNGdaMnh2WW1Gc0lHVnNjMlVnS0dsbUlDaDBlWEJsYjJZZ2MyVnNaaUJwYzI1MElDZDFibVJsWm1sdVpXUW5JR0Z1WkNCelpXeG1LU0IwYUdWdUlITmxiR1lnWld4elpTQW9hV1lnS0hSNWNHVnZaaUIzYVc1a2IzY2dhWE51ZENBbmRXNWtaV1pwYm1Wa0p5QmhibVFnZDJsdVpHOTNLU0IwYUdWdUlIZHBibVJ2ZHlCbGJITmxJSFJvYVhNcEtTbGNjbHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0IwYUdselIyeHZZbUZzSWwxOSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdidXR0b25pbnB1dCdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogJ2J1dHRvbidcclxuICAgICAgc3JjOiAnJ1xyXG4gICAgICBhbHQ6ICcnXHJcbiAgICAgIGhlaWdodDogJydcclxuICAgICAgd2lkdGg6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG5cclxuXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdjaGVja2JveCdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBjaGVja2VkOiBmYWxzZVxyXG4gICAgaW5kZXRlcm1pbmF0ZTogZmFsc2VcclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICBpZiBkZWZhdWx0cy5jaGVja2VkXHJcbiAgICByZXQuYXR0ciAnY2hlY2tlZCcsIHRydWVcclxuICBlbHNlIGlmIGRlZmF1bHRzLmluZGV0ZXJtaW5hdGVcclxuICAgIHJldC5hdHRyICdpbmRldGVybWluYXRlJywgdHJ1ZVxyXG5cclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ2NvbG9yJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ2RhdGUnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ2RhdGV0aW1lJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnZGF0ZXRpbWUtbG9jYWwnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdlbWFpbCdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIG11bHRpcGxlOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdmaWxlJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgYWNjZXB0OiAnJ1xyXG4gICAgICBtdWx0aXBsZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnaGlkZGVuJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnaW1hZ2VpbnB1dCdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogJ2ltYWdlJ1xyXG4gICAgICBzcmM6ICcnXHJcbiAgICAgIGFsdDogJydcclxuICAgICAgaGVpZ2h0OiAnJ1xyXG4gICAgICB3aWR0aDogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnbW9udGgnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdudW1iZXInXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdwYXNzd29yZCdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIG1heGxlbmd0aDogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAncmFkaW8nXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBuYW1lOiAnJ1xyXG4gICAgICB2YWx1ZTogJydcclxuICAgICAgY2hlY2tlZDogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAncmFuZ2UnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBtaW46IDBcclxuICAgICAgbWF4OiAxMDBcclxuICAgICAgdmFsdWU6IDUwXHJcbiAgICAgIHN0ZXA6IDFcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAncmVzZXQnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdzZWFyY2gnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdzdWJtaXQnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICd0ZWwnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBwYXR0ZXJuOiAnJ1xyXG4gICAgICBtYXhsZW5ndGg6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3RleHRpbnB1dCdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogJ3RleHQnXHJcbiAgICAgIGF1dG9jb21wbGV0ZTogJ29uJ1xyXG4gICAgICBhdXRvc2F2ZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAndGltZSdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3VybCdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIHBhdHRlcm46ICcnXHJcbiAgICAgIG1heGxlbmd0aDogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnd2VlaydcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBOc1RyZWUsIG1ha2VUaGVKdWljZSwgbmFtZVNwYWNlTmFtZSwgdGhpc0RvY3VtZW50LCB0aGlzR2xvYmFsLCB1dGlsTGliO1xuXG50aGlzR2xvYmFsID0gcmVxdWlyZSgnLi9nbG9iYWwnKTtcblxudXRpbExpYiA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxubmFtZVNwYWNlTmFtZSA9ICdPSic7XG5cblxuLypcbmJvb3Qgc3RyYXAgbmFtZSBtZXRob2QgaW50byBPYmplY3QgcHJvdG90eXBlXG4gKi9cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoT2JqZWN0LnByb3RvdHlwZSwge1xuICBnZXRJbnN0YW5jZU5hbWU6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZnVuY05hbWVSZWdleCwgcmVzdWx0cztcbiAgICAgIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC57MSx9KVxcKC87XG4gICAgICByZXN1bHRzID0gZnVuY05hbWVSZWdleC5leGVjKHRoaXMuY29uc3RydWN0b3IudG9TdHJpbmcoKSk7XG4gICAgICBpZiAocmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNbMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuXG4vKlxuQW4gaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5hbWVzcGFjZSB0cmVlXG4gKi9cblxuTnNUcmVlID0ge307XG5cbm1ha2VUaGVKdWljZSA9IGZ1bmN0aW9uKCkge1xuXG4gIC8qXG4gIEludGVybmFsIG5hbWVTcGFjZU5hbWUgbWV0aG9kIHRvIGNyZWF0ZSBuZXcgJ3N1YicgbmFtZXNwYWNlcyBvbiBhcmJpdHJhcnkgY2hpbGQgb2JqZWN0cy5cbiAgICovXG4gIHZhciBOc091dCwgZGVwZW5kc09uLCBtYWtlTmFtZVNwYWNlLCBuc0ludGVybmFsO1xuICBtYWtlTmFtZVNwYWNlID0gZnVuY3Rpb24oc3BhY2VuYW1lLCB0cmVlKSB7XG5cbiAgICAvKlxuICAgIFRoZSBkZXJpdmVkIGluc3RhbmNlIHRvIGJlIGNvbnN0cnVjdGVkXG4gICAgICovXG4gICAgdmFyIEJhc2UsIENsYXNzO1xuICAgIEJhc2UgPSBmdW5jdGlvbihuc05hbWUpIHtcbiAgICAgIHZhciBtZW1iZXJzLCBuc1RyZWUsIHByb3RvO1xuICAgICAgcHJvdG8gPSB0aGlzO1xuICAgICAgdHJlZVtuc05hbWVdID0gdHJlZVtuc05hbWVdIHx8IHt9O1xuICAgICAgbnNUcmVlID0gdHJlZVtuc05hbWVdO1xuICAgICAgbWVtYmVycyA9IHt9O1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtZW1iZXJzJywge1xuICAgICAgICB2YWx1ZTogbWVtYmVyc1xuXG4gICAgICAgIC8qXG4gICAgICAgIFJlZ2lzdGVyIChlLmcuICdMaWZ0JykgYW4gT2JqZWN0IGludG8gdGhlIHByb3RvdHlwZSBvZiB0aGUgbmFtZXNwYWNlLlxuICAgICAgICBUaGlzIE9iamVjdCB3aWxsIGJlIHJlYWRhYmxlL2V4ZWN1dGFibGUgYnV0IGlzIG90aGVyd2lzZSBpbW11dGFibGUuXG4gICAgICAgICAqL1xuICAgICAgfSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3JlZ2lzdGVyJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSwgb2JqLCBlbnVtZXJhYmxlKSB7XG4gICAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICAgIGlmICgodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB8fCBuYW1lID09PSAnJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbGlmdCBhIG5ldyBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgbmFtZS4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIHByb3BlcnR5IGluc3RhbmNlLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocHJvdG9bbmFtZV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgbmFtZWQgJyArIG5hbWUgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWVtYmVyc1tuYW1lXSA9IG1lbWJlcnNbbmFtZV0gfHwgbmFtZTtcbiAgICAgICAgICBuc1RyZWVbbmFtZV0gPSBuc1RyZWVbbmFtZV0gfHwge1xuICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHR5cGVvZiBvYmosXG4gICAgICAgICAgICBpbnN0YW5jZTogKG9iai5nZXRJbnN0YW5jZU5hbWUgPyBvYmouZ2V0SW5zdGFuY2VOYW1lKCkgOiAndW5rbm93bicpXG4gICAgICAgICAgfTtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sIG5hbWUsIHtcbiAgICAgICAgICAgIHZhbHVlOiBvYmosXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSAhPT0gZW51bWVyYWJsZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzKG5zTmFtZSArICcuJyArIHNwYWNlbmFtZSArICcuJyArIG5hbWUpO1xuICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvKlxuICAgICAgQ3JlYXRlIGEgbmV3LCBzdGF0aWMgbmFtZXNwYWNlIG9uIHRoZSBjdXJyZW50IHBhcmVudCAoZS5nLiBuc05hbWUudG8uLi4gfHwgbnNOYW1lLmlzLi4uKVxuICAgICAgICovXG4gICAgICBwcm90by5yZWdpc3RlcignbWFrZVN1Yk5hbWVTcGFjZScsIChmdW5jdGlvbihzdWJOYW1lU3BhY2UpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICB2YXIgbmV3TmFtZVNwYWNlO1xuICAgICAgICBpZiAoKHR5cGVvZiBzdWJOYW1lU3BhY2UgIT09ICdzdHJpbmcnKSB8fCBzdWJOYW1lU3BhY2UgPT09ICcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbmV3IHN1YiBuYW1lc3BhY2Ugd2l0aG91dCBhIHZhbGlkIG5hbWUuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3RvLnN1Yk5hbWVTcGFjZSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3ViIG5hbWVzcGFjZSBuYW1lZCAnICsgc3ViTmFtZVNwYWNlICsgJyBpcyBhbHJlYWR5IGRlZmluZWQgb24gJyArIHNwYWNlbmFtZSArICcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgbnNJbnRlcm5hbC5hbGVydERlcGVuZGVudHMobnNOYW1lICsgJy4nICsgc3ViTmFtZVNwYWNlKTtcbiAgICAgICAgbmV3TmFtZVNwYWNlID0gbWFrZU5hbWVTcGFjZShzdWJOYW1lU3BhY2UsIG5zVHJlZSk7XG4gICAgICAgIGlmIChzdWJOYW1lU3BhY2UgIT09ICdjb25zdGFudHMnKSB7XG4gICAgICAgICAgbmV3TmFtZVNwYWNlLnJlZ2lzdGVyKCdjb25zdGFudHMnLCBtYWtlTmFtZVNwYWNlKCdjb25zdGFudHMnLCBuc1RyZWUpLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdG8ucmVnaXN0ZXIoc3ViTmFtZVNwYWNlLCBuZXdOYW1lU3BhY2UsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIG5ld05hbWVTcGFjZTtcbiAgICAgIH0pLCBmYWxzZSk7XG4gICAgfTtcblxuICAgIC8qXG4gICAgQW4gaW50ZXJuYWwgbWVjaGFuaXNtIHRvIHJlcHJlc2VudCB0aGUgaW5zdGFuY2Ugb2YgdGhpcyBuYW1lc3BhY2VcbiAgICBAY29uc3RydWN0b3JcbiAgICBAaW50ZXJuYWxcbiAgICBAbWVtYmVyT2YgbWFrZU5hbWVTcGFjZVxuICAgICAqL1xuICAgIENsYXNzID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gZnVuY3Rpb24gJyArIHNwYWNlbmFtZSArICcoKXt9JykoKTtcbiAgICBDbGFzcy5wcm90b3R5cGUgPSBuZXcgQmFzZShzcGFjZW5hbWUpO1xuICAgIHJldHVybiBuZXcgQ2xhc3Moc3BhY2VuYW1lKTtcbiAgfTtcblxuICAvKlxuICAnRGVwZW5kJyBhbiBPYmplY3QgdXBvbiBhbm90aGVyIG1lbWJlciBvZiB0aGlzIG5hbWVzcGFjZSwgdXBvbiBhbm90aGVyIG5hbWVzcGFjZSxcbiAgb3IgdXBvbiBhIG1lbWJlciBvZiBhbm90aGVyIG5hbWVzcGFjZVxuICAgKi9cbiAgZGVwZW5kc09uID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzLCBjYWxsQmFjaywgaW1wb3J0cykge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgbWlzc2luZywgbnNNZW1iZXJzLCByZXQ7XG4gICAgcmV0ID0gZmFsc2U7XG4gICAgbnNNZW1iZXJzID0gbnNJbnRlcm5hbC5nZXROc01lbWJlcnMoKTtcbiAgICBpZiAoZGVwZW5kZW5jaWVzICYmIGRlcGVuZGVuY2llcy5sZW5ndGggPiAwICYmIGNhbGxCYWNrKSB7XG4gICAgICBtaXNzaW5nID0gZGVwZW5kZW5jaWVzLmZpbHRlcihmdW5jdGlvbihkZXBlbikge1xuICAgICAgICByZXR1cm4gbnNNZW1iZXJzLmluZGV4T2YoZGVwZW4pID09PSAtMSAmJiAoIWltcG9ydHMgfHwgaW1wb3J0cyAhPT0gZGVwZW4pO1xuICAgICAgfSk7XG4gICAgICBpZiAobWlzc2luZy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgY2FsbEJhY2soKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5zSW50ZXJuYWwuZGVwZW5kZW50cy5wdXNoKGZ1bmN0aW9uKGltcG9ydHMpIHtcbiAgICAgICAgICByZXR1cm4gZGVwZW5kc09uKG1pc3NpbmcsIGNhbGxCYWNrLCBpbXBvcnRzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH07XG4gIG5zSW50ZXJuYWwgPSB7XG4gICAgZGVwZW5kZW50czogW11cblxuICAgIC8qXG4gICAgRmV0Y2hlcyB0aGUgcmVnaXN0ZXJlZCBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIG9uIHRoZSBuYW1lc3BhY2UgYW5kIGl0cyBjaGlsZCBuYW1lc3BhY2VzXG4gICAgICovXG4gIH07XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuc0ludGVybmFsLCAnZ2V0TnNNZW1iZXJzJywge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtZW1iZXJzLCByZWN1cnNlVHJlZTtcbiAgICAgIHJlY3Vyc2VUcmVlID0gZnVuY3Rpb24oa2V5LCBsYXN0S2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIG1lbWJlcnMucHVzaChsYXN0S2V5ICsgJy4nICsga2V5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXRpbExpYi5pc1BsYWluT2JqZWN0KGtleSkpIHtcbiAgICAgICAgICBPYmplY3Qua2V5cyhrZXkpLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBtZW1iZXJzLnB1c2gobGFzdEtleSArICcuJyArIGspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHV0aWxMaWIuaXNQbGFpbk9iamVjdChrZXlba10pKSB7XG4gICAgICAgICAgICAgIHJlY3Vyc2VUcmVlKGtleVtrXSwgbGFzdEtleSArICcuJyArIGspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgbWVtYmVycyA9IFtdO1xuICAgICAgT2JqZWN0LmtleXMoTnNUcmVlW25hbWVTcGFjZU5hbWVdKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAodXRpbExpYi5pc1BsYWluT2JqZWN0KE5zVHJlZVtuYW1lU3BhY2VOYW1lXVtrZXldKSkge1xuICAgICAgICAgIHJlY3Vyc2VUcmVlKE5zVHJlZVtuYW1lU3BhY2VOYW1lXVtrZXldLCBuYW1lU3BhY2VOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbWVtYmVycztcbiAgICB9XG4gIH0pO1xuXG4gIC8qXG4gIFRvIHN1cHBvcnQgZGVwZW5kZW5jeSBtYW5hZ2VtZW50LCB3aGVuIGEgcHJvcGVydHkgaXMgbGlmdGVkIG9udG8gdGhlIG5hbWVzcGFjZSwgbm90aWZ5IGRlcGVuZGVudHMgdG8gaW5pdGlhbGl6ZVxuICAgKi9cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5zSW50ZXJuYWwsICdhbGVydERlcGVuZGVudHMnLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKGltcG9ydHMpIHtcbiAgICAgIHZhciBkZXBzO1xuICAgICAgZGVwcyA9IG5zSW50ZXJuYWwuZGVwZW5kZW50cy5maWx0ZXIoZnVuY3Rpb24oZGVwT24pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlID09PSBkZXBPbihpbXBvcnRzKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGVwcykpIHtcbiAgICAgICAgcmV0dXJuIG5zSW50ZXJuYWwuZGVwZW5kZW50cyA9IGRlcHM7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgTnNUcmVlW25hbWVTcGFjZU5hbWVdID0ge307XG4gIE5zT3V0ID0gbWFrZU5hbWVTcGFjZShuYW1lU3BhY2VOYW1lLCBOc1RyZWVbbmFtZVNwYWNlTmFtZV0pO1xuXG4gIC8qXG4gIENhY2hlIGEgaGFuZGxlIG9uIHRoZSB2ZW5kb3IgKHByb2JhYmx5IGpRdWVyeSkgb24gdGhlIHJvb3QgbmFtZXNwYWNlXG4gICAqL1xuICBOc091dC5yZWdpc3RlcignPycsIHV0aWxMaWIsIGZhbHNlKTtcblxuICAvKlxuICBDYWNoZSB0aGUgdHJlZSAodXNlZnVsIGZvciBkb2N1bWVudGF0aW9uL3Zpc3VhbGl6YXRpb24vZGVidWdnaW5nKVxuICAgKi9cbiAgTnNPdXQucmVnaXN0ZXIoJ3RyZWUnLCBOc1RyZWVbbmFtZVNwYWNlTmFtZV0sIGZhbHNlKTtcblxuICAvKlxuICBDYWNoZSB0aGUgbmFtZSBzcGFjZSBuYW1lXG4gICAqL1xuICBOc091dC5yZWdpc3RlcignbmFtZScsIG5hbWVTcGFjZU5hbWUsIGZhbHNlKTtcbiAgTnNPdXQucmVnaXN0ZXIoJ2RlcGVuZHNPbicsIGRlcGVuZHNPbiwgZmFsc2UpO1xuICByZXR1cm4gTnNPdXQ7XG59O1xuXG5cbi8qXG5BY3R1YWxseSBkZWZpbmUgdGhlIE9KIE5hbWVTcGFjZVxuICovXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzR2xvYmFsLCBuYW1lU3BhY2VOYW1lLCB7XG4gIHZhbHVlOiBtYWtlVGhlSnVpY2UoKVxufSk7XG5cbk9KLnJlZ2lzdGVyKCdnbG9iYWwnLCB0aGlzR2xvYmFsKTtcblxudGhpc0RvY3VtZW50ID0ge307XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gIHRoaXNEb2N1bWVudCA9IGRvY3VtZW50O1xufVxuXG5PSi5yZWdpc3RlcignZG9jdW1lbnQnLCB0aGlzRG9jdW1lbnQpO1xuXG5PSi5yZWdpc3Rlcignbm9vcCcsIGZ1bmN0aW9uKCkge30pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9KO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeHZhaTVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVU5CTEVsQlFVRTdPMEZCUVVFc1ZVRkJRU3hIUVVGaExFOUJRVUVzUTBGQlVTeFZRVUZTT3p0QlFVTmlMRTlCUVVFc1IwRkJWU3hQUVVGQkxFTkJRVkVzVVVGQlVqczdRVUZEVml4aFFVRkJMRWRCUVdkQ096czdRVUZGYUVJN096czdRVUZIUVN4TlFVRk5MRU5CUVVNc1owSkJRVkFzUTBGQmQwSXNUVUZCVFN4RFFVRkJMRk5CUVRsQ0xFVkJRMFU3UlVGQlFTeGxRVUZCTEVWQlEwVTdTVUZCUVN4TFFVRkJMRVZCUVU4c1UwRkJRVHRCUVVOTUxGVkJRVUU3VFVGQlFTeGhRVUZCTEVkQlFXZENPMDFCUTJoQ0xFOUJRVUVzUjBGQlZ5eGhRVUZqTEVOQlFVTXNTVUZCYUVJc1EwRkJjVUlzU1VGQlF5eERRVUZCTEZkQlFWY3NRMEZCUXl4UlFVRmlMRU5CUVVFc1EwRkJja0k3VFVGRFZDeEpRVUZKTEU5QlFVRXNTVUZCV1N4UFFVRlBMRU5CUVVNc1RVRkJVaXhIUVVGcFFpeERRVUZxUXp0bFFVRjVReXhQUVVGUkxFTkJRVUVzUTBGQlFTeEZRVUZxUkR0UFFVRkJMRTFCUVVFN1pVRkJlVVFzUjBGQmVrUTdPMGxCU0Vrc1EwRkJVRHRIUVVSR08wTkJSRVk3T3p0QlFWRkJPenM3TzBGQlIwRXNUVUZCUVN4SFFVRlRPenRCUVVOVUxGbEJRVUVzUjBGQlpTeFRRVUZCT3p0QlFVVmlPenM3UVVGQlFTeE5RVUZCTzBWQlIwRXNZVUZCUVN4SFFVRm5RaXhUUVVGRExGTkJRVVFzUlVGQldTeEpRVUZhT3p0QlFVTmtPenM3UVVGQlFTeFJRVUZCTzBsQlIwRXNTVUZCUVN4SFFVRlBMRk5CUVVNc1RVRkJSRHRCUVVOTUxGVkJRVUU3VFVGQlFTeExRVUZCTEVkQlFWRTdUVUZEVWl4SlFVRkxMRU5CUVVFc1RVRkJRU3hEUVVGTUxFZEJRV1VzU1VGQlN5eERRVUZCTEUxQlFVRXNRMEZCVEN4SlFVRm5RanROUVVNdlFpeE5RVUZCTEVkQlFWTXNTVUZCU3l4RFFVRkJMRTFCUVVFN1RVRkRaQ3hQUVVGQkxFZEJRVlU3VFVGRlZpeE5RVUZOTEVOQlFVTXNZMEZCVUN4RFFVRnpRaXhKUVVGMFFpeEZRVUUwUWl4VFFVRTFRaXhGUVVGMVF6dFJRVUZCTEV0QlFVRXNSVUZCVHpzN1FVRkZPVU03T3p0WFFVWjFRenRQUVVGMlF6dE5RVTFCTEUxQlFVMHNRMEZCUXl4alFVRlFMRU5CUVhOQ0xFbEJRWFJDTEVWQlFUUkNMRlZCUVRWQ0xFVkJRMFU3VVVGQlFTeExRVUZCTEVWQlFVOHNVMEZCUXl4SlFVRkVMRVZCUVU4c1IwRkJVQ3hGUVVGWkxGVkJRVm83VlVGRFREdFZRVU5CTEVsQlFYZEZMRU5CUVVNc1QwRkJUeXhKUVVGUUxFdEJRV2xDTEZGQlFXeENMRU5CUVVFc1NVRkJLMElzU1VGQlFTeExRVUZSTEVWQlFTOUhPMEZCUVVFc2EwSkJRVlVzU1VGQlFTeExRVUZCTEVOQlFVMHNhMFJCUVU0c1JVRkJWanM3VlVGRFFTeEpRVUZCTEVOQlFYbEdMRWRCUVhwR08wRkJRVUVzYTBKQlFWVXNTVUZCUVN4TFFVRkJMRU5CUVUwc0swUkJRVTRzUlVGQlZqczdWVUZEUVN4SlFVRTBSaXhMUVVGTkxFTkJRVUVzU1VGQlFTeERRVUZzUnp0QlFVRkJMR3RDUVVGVkxFbEJRVUVzUzBGQlFTeERRVUZOTEdsQ1FVRkJMRWRCUVc5Q0xFbEJRWEJDTEVkQlFUSkNMSGxDUVVFelFpeEhRVUYxUkN4VFFVRjJSQ3hIUVVGdFJTeEhRVUY2UlN4RlFVRldPenRWUVVWQkxFOUJRVkVzUTBGQlFTeEpRVUZCTEVOQlFWSXNSMEZCWjBJc1QwRkJVU3hEUVVGQkxFbEJRVUVzUTBGQlVpeEpRVUZwUWp0VlFVZHFReXhOUVVGUExFTkJRVUVzU1VGQlFTeERRVUZRTEVkQlFXVXNUVUZCVHl4RFFVRkJMRWxCUVVFc1EwRkJVQ3hKUVVOaU8xbEJRVUVzU1VGQlFTeEZRVUZOTEVsQlFVNDdXVUZEUVN4SlFVRkJMRVZCUVUwc1QwRkJUeXhIUVVSaU8xbEJSVUVzVVVGQlFTeEZRVUZWTEVOQlFVa3NSMEZCUnl4RFFVRkRMR1ZCUVZBc1IwRkJORUlzUjBGQlJ5eERRVUZETEdWQlFVb3NRMEZCUVN4RFFVRTFRaXhIUVVGMVJDeFRRVUY0UkN4RFFVWldPenRWUVVsR0xFMUJRVTBzUTBGQlF5eGpRVUZRTEVOQlFYTkNMRXRCUVhSQ0xFVkJRVFpDTEVsQlFUZENMRVZCUTBVN1dVRkJRU3hMUVVGQkxFVkJRVThzUjBGQlVEdFpRVU5CTEZWQlFVRXNSVUZCV1N4TFFVRkJMRXRCUVZjc1ZVRkVka0k3VjBGRVJqdFZRVWxCTEZWQlFWVXNRMEZCUXl4bFFVRllMRU5CUVRKQ0xFMUJRVUVzUjBGQlV5eEhRVUZVTEVkQlFXVXNVMEZCWml4SFFVRXlRaXhIUVVFelFpeEhRVUZwUXl4SlFVRTFSRHRwUWtGRFFUdFJRVzVDU3l4RFFVRlFPMDlCUkVZN08wRkJkVUpCT3pzN1RVRkhRU3hMUVVGTExFTkJRVU1zVVVGQlRpeERRVUZsTEd0Q1FVRm1MRVZCUVcxRExFTkJRVU1zVTBGQlF5eFpRVUZFTzFGQlEyeERPMEZCUVVFc1dVRkJRVHRSUVVOQkxFbEJRU3RGTEVOQlFVTXNUMEZCVHl4WlFVRlFMRXRCUVhsQ0xGRkJRVEZDTEVOQlFVRXNTVUZCZFVNc1dVRkJRU3hMUVVGblFpeEZRVUYwU1R0QlFVRkJMR2RDUVVGVkxFbEJRVUVzUzBGQlFTeERRVUZOTEhsRVFVRk9MRVZCUVZZN08xRkJRMEVzU1VGQmVVY3NTMEZCU3l4RFFVRkRMRmxCUVM5SE8wRkJRVUVzWjBKQlFWVXNTVUZCUVN4TFFVRkJMRU5CUVUwc2MwSkJRVUVzUjBGQmVVSXNXVUZCZWtJc1IwRkJkME1zZVVKQlFYaERMRWRCUVc5RkxGTkJRWEJGTEVkQlFXZEdMRWRCUVhSR0xFVkJRVlk3TzFGQlEwRXNWVUZCVlN4RFFVRkRMR1ZCUVZnc1EwRkJNa0lzVFVGQlFTeEhRVUZUTEVkQlFWUXNSMEZCWlN4WlFVRXhRenRSUVVOQkxGbEJRVUVzUjBGQlpTeGhRVUZCTEVOQlFXTXNXVUZCWkN4RlFVRTBRaXhOUVVFMVFqdFJRVU5tTEVsQlFXbEdMRmxCUVVFc1MwRkJhMElzVjBGQmJrYzdWVUZCUVN4WlFVRlpMRU5CUVVNc1VVRkJZaXhEUVVGelFpeFhRVUYwUWl4RlFVRnRReXhoUVVGQkxFTkJRV01zVjBGQlpDeEZRVUV5UWl4TlFVRXpRaXhEUVVGdVF5eEZRVUYxUlN4TFFVRjJSU3hGUVVGQk96dFJRVU5CTEV0QlFVc3NRMEZCUXl4UlFVRk9MRU5CUVdVc1dVRkJaaXhGUVVFMlFpeFpRVUUzUWl4RlFVRXlReXhMUVVFelF6dGxRVU5CTzAxQlVtdERMRU5CUVVRc1EwRkJia01zUlVGVFJ5eExRVlJJTzBsQmRFTkxPenRCUVd0RVVEczdPenM3TzBsQlRVRXNTMEZCUVN4SFFVRlpMRWxCUVVFc1VVRkJRU3hEUVVGVExHdENRVUZCTEVkQlFYRkNMRk5CUVhKQ0xFZEJRV2xETEUxQlFURkRMRU5CUVVFc1EwRkJRVHRKUVVOYUxFdEJRVXNzUTBGQlFTeFRRVUZNTEVkQlFXTXNTVUZCUVN4SlFVRkJMRU5CUVVzc1UwRkJURHRYUVVkV0xFbEJRVUVzUzBGQlFTeERRVUZOTEZOQlFVNDdSVUZvUlZVN08wRkJhMFZvUWpzN096dEZRVWxCTEZOQlFVRXNSMEZCV1N4VFFVRkRMRmxCUVVRc1JVRkJaU3hSUVVGbUxFVkJRWGxDTEU5QlFYcENPMGxCUTFZN1FVRkJRU3hSUVVGQk8wbEJRMEVzUjBGQlFTeEhRVUZOTzBsQlEwNHNVMEZCUVN4SFFVRlpMRlZCUVZVc1EwRkJReXhaUVVGWUxFTkJRVUU3U1VGRFdpeEpRVUZITEZsQlFVRXNTVUZCYVVJc1dVRkJXU3hEUVVGRExFMUJRV0lzUjBGQmMwSXNRMEZCZGtNc1NVRkJOa01zVVVGQmFFUTdUVUZEUlN4UFFVRkJMRWRCUVZVc1dVRkJXU3hEUVVGRExFMUJRV0lzUTBGQmIwSXNVMEZCUXl4TFFVRkVPMlZCUXpWQ0xGTkJRVk1zUTBGQlF5eFBRVUZXTEVOQlFXdENMRXRCUVd4Q0xFTkJRVUVzUzBGQk5FSXNRMEZCUXl4RFFVRTNRaXhKUVVGdFF5eERRVUZETEVOQlFVa3NUMEZCU2l4SlFVRmxMRTlCUVVFc1MwRkJZU3hMUVVFM1FqdE5RVVJRTEVOQlFYQkNPMDFCUjFZc1NVRkJSeXhQUVVGUExFTkJRVU1zVFVGQlVpeExRVUZyUWl4RFFVRnlRanRSUVVORkxFZEJRVUVzUjBGQlRUdFJRVU5PTEZGQlFVRXNRMEZCUVN4RlFVWkdPMDlCUVVFc1RVRkJRVHRSUVVsRkxGVkJRVlVzUTBGQlF5eFZRVUZWTEVOQlFVTXNTVUZCZEVJc1EwRkJNa0lzVTBGQlF5eFBRVUZFTzJsQ1FVTjZRaXhUUVVGQkxFTkJRVlVzVDBGQlZpeEZRVUZ0UWl4UlFVRnVRaXhGUVVFMlFpeFBRVUUzUWp0UlFVUjVRaXhEUVVFelFpeEZRVXBHTzA5QlNrWTdPMWRCVjBFN1JVRm1WVHRGUVdkQ1dpeFZRVUZCTEVkQlFXRTdTVUZCUVN4VlFVRkJMRVZCUVZrN08wRkJSWHBDT3p0UFFVWmhPenRGUVV0aUxFMUJRVTBzUTBGQlF5eGpRVUZRTEVOQlFYTkNMRlZCUVhSQ0xFVkJRV3RETEdOQlFXeERMRVZCUTBVN1NVRkJRU3hMUVVGQkxFVkJRVThzVTBGQlFUdEJRVU5NTEZWQlFVRTdUVUZCUVN4WFFVRkJMRWRCUVdNc1UwRkJReXhIUVVGRUxFVkJRVTBzVDBGQlRqdFJRVU5hTEVsQlFYRkRMRTlCUVZFc1IwRkJVaXhMUVVGblFpeFJRVUZ5UkR0VlFVRkJMRTlCUVU4c1EwRkJReXhKUVVGU0xFTkJRV0VzVDBGQlFTeEhRVUZWTEVkQlFWWXNSMEZCWjBJc1IwRkJOMElzUlVGQlFUczdVVUZEUVN4SlFVRkhMRTlCUVU4c1EwRkJReXhoUVVGU0xFTkJRWE5DTEVkQlFYUkNMRU5CUVVnN1ZVRkRSU3hOUVVGTkxFTkJRVU1zU1VGQlVDeERRVUZaTEVkQlFWb3NRMEZCWjBJc1EwRkJReXhQUVVGcVFpeERRVUY1UWl4VFFVRkRMRU5CUVVRN1dVRkRka0lzU1VGQmJVTXNUMEZCVVN4RFFVRlNMRXRCUVdNc1VVRkJha1E3WTBGQlFTeFBRVUZQTEVOQlFVTXNTVUZCVWl4RFFVRmhMRTlCUVVFc1IwRkJWU3hIUVVGV0xFZEJRV2RDTEVOQlFUZENMRVZCUVVFN08xbEJRMEVzU1VGQk1FTXNUMEZCVHl4RFFVRkRMR0ZCUVZJc1EwRkJjMElzUjBGQlNTeERRVUZCTEVOQlFVRXNRMEZCTVVJc1EwRkJNVU03WTBGQlFTeFhRVUZCTEVOQlFWa3NSMEZCU1N4RFFVRkJMRU5CUVVFc1EwRkJhRUlzUlVGQmIwSXNUMEZCUVN4SFFVRlZMRWRCUVZZc1IwRkJaMElzUTBGQmNFTXNSVUZCUVRzN1ZVRkdkVUlzUTBGQmVrSXNSVUZFUmpzN1RVRkdXVHROUVZOa0xFOUJRVUVzUjBGQlZUdE5RVU5XTEUxQlFVMHNRMEZCUXl4SlFVRlFMRU5CUVZrc1RVRkJUeXhEUVVGQkxHRkJRVUVzUTBGQmJrSXNRMEZCYTBNc1EwRkJReXhQUVVGdVF5eERRVUV5UXl4VFFVRkRMRWRCUVVRN1VVRkRla01zU1VGQk1FUXNUMEZCVHl4RFFVRkRMR0ZCUVZJc1EwRkJjMElzVFVGQlR5eERRVUZCTEdGQlFVRXNRMEZCWlN4RFFVRkJMRWRCUVVFc1EwRkJOVU1zUTBGQk1VUTdWVUZCUVN4WFFVRkJMRU5CUVZrc1RVRkJUeXhEUVVGQkxHRkJRVUVzUTBGQlpTeERRVUZCTEVkQlFVRXNRMEZCYkVNc1JVRkJkME1zWVVGQmVFTXNSVUZCUVRzN1RVRkVlVU1zUTBGQk0wTTdZVUZKUVR0SlFXWkxMRU5CUVZBN1IwRkVSanM3UVVGclFrRTdPenRGUVVkQkxFMUJRVTBzUTBGQlF5eGpRVUZRTEVOQlFYTkNMRlZCUVhSQ0xFVkJRV3RETEdsQ1FVRnNReXhGUVVORk8wbEJRVUVzUzBGQlFTeEZRVUZQTEZOQlFVTXNUMEZCUkR0QlFVTk1MRlZCUVVFN1RVRkJRU3hKUVVGQkxFZEJRVThzVlVGQlZTeERRVUZETEZWQlFWVXNRMEZCUXl4TlFVRjBRaXhEUVVFMlFpeFRRVUZETEV0QlFVUTdaVUZEYkVNc1MwRkJRU3hMUVVGVExFdEJRVUVzUTBGQlRTeFBRVUZPTzAxQlJIbENMRU5CUVRkQ08wMUJSMUFzU1VGQmFVTXNTMEZCU3l4RFFVRkRMRTlCUVU0c1EwRkJZeXhKUVVGa0xFTkJRV3BETzJWQlFVRXNWVUZCVlN4RFFVRkRMRlZCUVZnc1IwRkJkMElzUzBGQmVFSTdPMGxCU2tzc1EwRkJVRHRIUVVSR08wVkJVVUVzVFVGQlR5eERRVUZCTEdGQlFVRXNRMEZCVUN4SFFVRjNRanRGUVVWNFFpeExRVUZCTEVkQlFWRXNZVUZCUVN4RFFVRmpMR0ZCUVdRc1JVRkJOa0lzVFVGQlR5eERRVUZCTEdGQlFVRXNRMEZCY0VNN08wRkJSVkk3T3p0RlFVZEJMRXRCUVVzc1EwRkJReXhSUVVGT0xFTkJRV1VzUjBGQlppeEZRVUZ2UWl4UFFVRndRaXhGUVVFMlFpeExRVUUzUWpzN1FVRkZRVHM3TzBWQlIwRXNTMEZCU3l4RFFVRkRMRkZCUVU0c1EwRkJaU3hOUVVGbUxFVkJRWFZDTEUxQlFVOHNRMEZCUVN4aFFVRkJMRU5CUVRsQ0xFVkJRVGhETEV0QlFUbERPenRCUVVWQk96czdSVUZIUVN4TFFVRkxMRU5CUVVNc1VVRkJUaXhEUVVGbExFMUJRV1lzUlVGQmRVSXNZVUZCZGtJc1JVRkJjME1zUzBGQmRFTTdSVUZEUVN4TFFVRkxMRU5CUVVNc1VVRkJUaXhEUVVGbExGZEJRV1lzUlVGQk5FSXNVMEZCTlVJc1JVRkJkVU1zUzBGQmRrTTdVMEZEUVR0QlFXaEtZVHM3TzBGQmJVcG1PenM3TzBGQlIwRXNUVUZCVFN4RFFVRkRMR05CUVZBc1EwRkJjMElzVlVGQmRFSXNSVUZCYTBNc1lVRkJiRU1zUlVGRFJUdEZRVUZCTEV0QlFVRXNSVUZCVHl4WlFVRkJMRU5CUVVFc1EwRkJVRHREUVVSR096dEJRVWRCTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1VVRkJXaXhGUVVGelFpeFZRVUYwUWpzN1FVRkZRU3haUVVGQkxFZEJRV1U3TzBGQlEyWXNTVUZCUnl4UFFVRlBMRkZCUVZBc1MwRkJjVUlzVjBGQmVFSTdSVUZEUlN4WlFVRkJMRWRCUVdVc1UwRkVha0k3T3p0QlFVZEJMRVZCUVVVc1EwRkJReXhSUVVGSUxFTkJRVmtzVlVGQldpeEZRVUYzUWl4WlFVRjRRanM3UVVGRlFTeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMRTFCUVZvc1JVRkJiMElzVTBGQlFTeEhRVUZCTEVOQlFYQkNPenRCUVVWQkxFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJaklDTWdUMHBjY2x4dWRHaHBjMGRzYjJKaGJDQTlJSEpsY1hWcGNtVWdKeTR2WjJ4dlltRnNKMXh5WEc1MWRHbHNUR2xpSUQwZ2NtVnhkV2x5WlNBbmFuRjFaWEo1SjF4eVhHNXVZVzFsVTNCaFkyVk9ZVzFsSUQwZ0owOUtKMXh5WEc1Y2NseHVJeU1qWEhKY2JtSnZiM1FnYzNSeVlYQWdibUZ0WlNCdFpYUm9iMlFnYVc1MGJ5QlBZbXBsWTNRZ2NISnZkRzkwZVhCbFhISmNiaU1qSTF4eVhHNVBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkR2xsY3lCUFltcGxZM1E2T2l4Y2NseHVJQ0JuWlhSSmJuTjBZVzVqWlU1aGJXVTZYSEpjYmlBZ0lDQjJZV3gxWlRvZ0xUNWNjbHh1SUNBZ0lDQWdablZ1WTA1aGJXVlNaV2RsZUNBOUlDOW1kVzVqZEdsdmJpQW9MbnN4TEgwcFhGd29MMXh5WEc0Z0lDQWdJQ0J5WlhOMWJIUnpJRDBnS0daMWJtTk9ZVzFsVW1WblpYZ3BMbVY0WldNb1FHTnZibk4wY25WamRHOXlMblJ2VTNSeWFXNW5LQ2twWEhKY2JpQWdJQ0FnSUNocFppQW9jbVZ6ZFd4MGN5QmhibVFnY21WemRXeDBjeTVzWlc1bmRHZ2dQaUF4S1NCMGFHVnVJSEpsYzNWc2RITmJNVjBnWld4elpTQW5KeWxjY2x4dVhISmNibHh5WEc0akl5TmNjbHh1UVc0Z2FXNTBaWEp1WVd3Z2NtVndjbVZ6Wlc1MFlYUnBiMjRnYjJZZ2RHaGxJRzVoYldWemNHRmpaU0IwY21WbFhISmNiaU1qSTF4eVhHNU9jMVJ5WldVZ1BTQjdmVnh5WEc1dFlXdGxWR2hsU25WcFkyVWdQU0F0UGx4eVhHNWNjbHh1SUNBakl5TmNjbHh1SUNCSmJuUmxjbTVoYkNCdVlXMWxVM0JoWTJWT1lXMWxJRzFsZEdodlpDQjBieUJqY21WaGRHVWdibVYzSUNkemRXSW5JRzVoYldWemNHRmpaWE1nYjI0Z1lYSmlhWFJ5WVhKNUlHTm9hV3hrSUc5aWFtVmpkSE11WEhKY2JpQWdJeU1qWEhKY2JpQWdiV0ZyWlU1aGJXVlRjR0ZqWlNBOUlDaHpjR0ZqWlc1aGJXVXNJSFJ5WldVcElDMCtYSEpjYmlBZ0lDQWpJeU5jY2x4dUlDQWdJRlJvWlNCa1pYSnBkbVZrSUdsdWMzUmhibU5sSUhSdklHSmxJR052Ym5OMGNuVmpkR1ZrWEhKY2JpQWdJQ0FqSXlOY2NseHVJQ0FnSUVKaGMyVWdQU0FvYm5OT1lXMWxLU0F0UGx4eVhHNGdJQ0FnSUNCd2NtOTBieUE5SUhSb2FYTmNjbHh1SUNBZ0lDQWdkSEpsWlZ0dWMwNWhiV1ZkSUQwZ2RISmxaVnR1YzA1aGJXVmRJRzl5SUh0OVhISmNiaUFnSUNBZ0lHNXpWSEpsWlNBOUlIUnlaV1ZiYm5OT1lXMWxYVnh5WEc0Z0lDQWdJQ0J0WlcxaVpYSnpJRDBnZTMxY2NseHVYSEpjYmlBZ0lDQWdJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNCMGFHbHpMQ0FuYldWdFltVnljeWNzSUhaaGJIVmxPaUJ0WlcxaVpYSnpYSEpjYmx4eVhHNGdJQ0FnSUNBakl5TmNjbHh1SUNBZ0lDQWdVbVZuYVhOMFpYSWdLR1V1Wnk0Z0oweHBablFuS1NCaGJpQlBZbXBsWTNRZ2FXNTBieUIwYUdVZ2NISnZkRzkwZVhCbElHOW1JSFJvWlNCdVlXMWxjM0JoWTJVdVhISmNiaUFnSUNBZ0lGUm9hWE1nVDJKcVpXTjBJSGRwYkd3Z1ltVWdjbVZoWkdGaWJHVXZaWGhsWTNWMFlXSnNaU0JpZFhRZ2FYTWdiM1JvWlhKM2FYTmxJR2x0YlhWMFlXSnNaUzVjY2x4dUlDQWdJQ0FnSXlNalhISmNiaUFnSUNBZ0lFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU0IwYUdsekxDQW5jbVZuYVhOMFpYSW5MRnh5WEc0Z0lDQWdJQ0FnSUhaaGJIVmxPaUFvYm1GdFpTd2diMkpxTENCbGJuVnRaWEpoWW14bEtTQXRQbHh5WEc0Z0lDQWdJQ0FnSUNBZ0ozVnpaU0J6ZEhKcFkzUW5YSEpjYmlBZ0lDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjBOaGJtNXZkQ0JzYVdaMElHRWdibVYzSUhCeWIzQmxjblI1SUhkcGRHaHZkWFFnWVNCMllXeHBaQ0J1WVcxbExpY3BJQ0JwWmlBb2RIbHdaVzltSUc1aGJXVWdhWE51ZENBbmMzUnlhVzVuSnlrZ2IzSWdibUZ0WlNCcGN5QW5KMXh5WEc0Z0lDQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkRFlXNXViM1FnYkdsbWRDQmhJRzVsZHlCd2NtOXdaWEowZVNCM2FYUm9iM1YwSUdFZ2RtRnNhV1FnY0hKdmNHVnlkSGtnYVc1emRHRnVZMlV1SnlrZ0lIVnViR1Z6Y3lCdlltcGNjbHh1SUNBZ0lDQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWduVUhKdmNHVnlkSGtnYm1GdFpXUWdKeUFySUc1aGJXVWdLeUFuSUdseklHRnNjbVZoWkhrZ1pHVm1hVzVsWkNCdmJpQW5JQ3NnYzNCaFkyVnVZVzFsSUNzZ0p5NG5LU0FnYVdZZ2NISnZkRzliYm1GdFpWMWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0lDQnRaVzFpWlhKelcyNWhiV1ZkSUQwZ2JXVnRZbVZ5YzF0dVlXMWxYU0J2Y2lCdVlXMWxYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdJMGQxWVhKa0lHRm5ZV2x1YzNRZ2IySnNhWFJsY21GMGFXNW5JSFJvWlNCMGNtVmxJR0Z6SUhSb1pTQjBjbVZsSUdseklISmxZM1Z5YzJsMlpXeDVJR1Y0ZEdWdVpHVmtYSEpjYmlBZ0lDQWdJQ0FnSUNCdWMxUnlaV1ZiYm1GdFpWMGdQU0J1YzFSeVpXVmJibUZ0WlYwZ2IzSmNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ2JtRnRaVG9nYm1GdFpWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCMGVYQmxPaUIwZVhCbGIyWWdiMkpxWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJR2x1YzNSaGJtTmxPaUFvYVdZZ2IySnFMbWRsZEVsdWMzUmhibU5sVG1GdFpTQjBhR1Z1SUc5aWFpNW5aWFJKYm5OMFlXNWpaVTVoYldVb0tTQmxiSE5sSUNkMWJtdHViM2R1SnlsY2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNCUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa2djSEp2ZEc4c0lHNWhiV1VzWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJSFpoYkhWbE9pQnZZbXBjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdaVzUxYldWeVlXSnNaVG9nWm1Gc2MyVWdhWE51ZENCbGJuVnRaWEpoWW14bFhISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ2JuTkpiblJsY201aGJDNWhiR1Z5ZEVSbGNHVnVaR1Z1ZEhNZ2JuTk9ZVzFsSUNzZ0p5NG5JQ3NnYzNCaFkyVnVZVzFsSUNzZ0p5NG5JQ3NnYm1GdFpWeHlYRzRnSUNBZ0lDQWdJQ0FnYjJKcVhISmNibHh5WEc1Y2NseHVJQ0FnSUNBZ0l5TWpYSEpjYmlBZ0lDQWdJRU55WldGMFpTQmhJRzVsZHl3Z2MzUmhkR2xqSUc1aGJXVnpjR0ZqWlNCdmJpQjBhR1VnWTNWeWNtVnVkQ0J3WVhKbGJuUWdLR1V1Wnk0Z2JuTk9ZVzFsTG5SdkxpNHVJSHg4SUc1elRtRnRaUzVwY3k0dUxpbGNjbHh1SUNBZ0lDQWdJeU1qWEhKY2JpQWdJQ0FnSUhCeWIzUnZMbkpsWjJsemRHVnlJQ2R0WVd0bFUzVmlUbUZ0WlZOd1lXTmxKeXdnS0NoemRXSk9ZVzFsVTNCaFkyVXBJQzArWEhKY2JpQWdJQ0FnSUNBZ0ozVnpaU0J6ZEhKcFkzUW5YSEpjYmlBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2REWVc1dWIzUWdZM0psWVhSbElHRWdibVYzSUhOMVlpQnVZVzFsYzNCaFkyVWdkMmwwYUc5MWRDQmhJSFpoYkdsa0lHNWhiV1V1SnlrZ0lHbG1JQ2gwZVhCbGIyWWdjM1ZpVG1GdFpWTndZV05sSUdsemJuUWdKM04wY21sdVp5Y3BJRzl5SUhOMVlrNWhiV1ZUY0dGalpTQnBjeUFuSjF4eVhHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnblUzVmlJRzVoYldWemNHRmpaU0J1WVcxbFpDQW5JQ3NnYzNWaVRtRnRaVk53WVdObElDc2dKeUJwY3lCaGJISmxZV1I1SUdSbFptbHVaV1FnYjI0Z0p5QXJJSE53WVdObGJtRnRaU0FySUNjdUp5a2dJR2xtSUhCeWIzUnZMbk4xWWs1aGJXVlRjR0ZqWlZ4eVhHNGdJQ0FnSUNBZ0lHNXpTVzUwWlhKdVlXd3VZV3hsY25SRVpYQmxibVJsYm5SeklHNXpUbUZ0WlNBcklDY3VKeUFySUhOMVlrNWhiV1ZUY0dGalpWeHlYRzRnSUNBZ0lDQWdJRzVsZDA1aGJXVlRjR0ZqWlNBOUlHMWhhMlZPWVcxbFUzQmhZMlVvYzNWaVRtRnRaVk53WVdObExDQnVjMVJ5WldVcFhISmNiaUFnSUNBZ0lDQWdibVYzVG1GdFpWTndZV05sTG5KbFoybHpkR1Z5SUNkamIyNXpkR0Z1ZEhNbkxDQnRZV3RsVG1GdFpWTndZV05sS0NkamIyNXpkR0Z1ZEhNbkxDQnVjMVJ5WldVcExDQm1ZV3h6WlNBZ2FXWWdjM1ZpVG1GdFpWTndZV05sSUdsemJuUWdKMk52Ym5OMFlXNTBjeWRjY2x4dUlDQWdJQ0FnSUNCd2NtOTBieTV5WldkcGMzUmxjaUJ6ZFdKT1lXMWxVM0JoWTJVc0lHNWxkMDVoYldWVGNHRmpaU3dnWm1Gc2MyVmNjbHh1SUNBZ0lDQWdJQ0J1WlhkT1lXMWxVM0JoWTJWY2NseHVJQ0FnSUNBZ0tTd2dabUZzYzJWY2NseHVJQ0FnSUNBZ2NtVjBkWEp1WEhKY2JseHlYRzRnSUNBZ0l5TWpYSEpjYmlBZ0lDQkJiaUJwYm5SbGNtNWhiQ0J0WldOb1lXNXBjMjBnZEc4Z2NtVndjbVZ6Wlc1MElIUm9aU0JwYm5OMFlXNWpaU0J2WmlCMGFHbHpJRzVoYldWemNHRmpaVnh5WEc0Z0lDQWdRR052Ym5OMGNuVmpkRzl5WEhKY2JpQWdJQ0JBYVc1MFpYSnVZV3hjY2x4dUlDQWdJRUJ0WlcxaVpYSlBaaUJ0WVd0bFRtRnRaVk53WVdObFhISmNiaUFnSUNBakl5TmNjbHh1SUNBZ0lFTnNZWE56SUQwZ2JtVjNJRVoxYm1OMGFXOXVLQ2R5WlhSMWNtNGdablZ1WTNScGIyNGdKeUFySUhOd1lXTmxibUZ0WlNBcklDY29LWHQ5Snlrb0tWeHlYRzRnSUNBZ1EyeGhjM002T2lBOUlHNWxkeUJDWVhObEtITndZV05sYm1GdFpTbGNjbHh1WEhKY2JpQWdJQ0FqUTJ4aGMzTXVjSEp2ZEc5MGVYQmxMbkJoY21WdWRDQTlJRUpoYzJVdWNISnZkRzkwZVhCbE8xeHlYRzRnSUNBZ2JtVjNJRU5zWVhOektITndZV05sYm1GdFpTbGNjbHh1WEhKY2JpQWdJeU1qWEhKY2JpQWdKMFJsY0dWdVpDY2dZVzRnVDJKcVpXTjBJSFZ3YjI0Z1lXNXZkR2hsY2lCdFpXMWlaWElnYjJZZ2RHaHBjeUJ1WVcxbGMzQmhZMlVzSUhWd2IyNGdZVzV2ZEdobGNpQnVZVzFsYzNCaFkyVXNYSEpjYmlBZ2IzSWdkWEJ2YmlCaElHMWxiV0psY2lCdlppQmhibTkwYUdWeUlHNWhiV1Z6Y0dGalpWeHlYRzRnSUNNakkxeHlYRzRnSUdSbGNHVnVaSE5QYmlBOUlDaGtaWEJsYm1SbGJtTnBaWE1zSUdOaGJHeENZV05yTENCcGJYQnZjblJ6S1NBdFBseHlYRzRnSUNBZ0ozVnpaU0J6ZEhKcFkzUW5YSEpjYmlBZ0lDQnlaWFFnUFNCbVlXeHpaVnh5WEc0Z0lDQWdibk5OWlcxaVpYSnpJRDBnYm5OSmJuUmxjbTVoYkM1blpYUk9jMDFsYldKbGNuTW9LVnh5WEc0Z0lDQWdhV1lnWkdWd1pXNWtaVzVqYVdWeklHRnVaQ0JrWlhCbGJtUmxibU5wWlhNdWJHVnVaM1JvSUQ0Z01DQmhibVFnWTJGc2JFSmhZMnRjY2x4dUlDQWdJQ0FnYldsemMybHVaeUE5SUdSbGNHVnVaR1Z1WTJsbGN5NW1hV3gwWlhJb0tHUmxjR1Z1S1NBdFBseHlYRzRnSUNBZ0lDQWdJRzV6VFdWdFltVnljeTVwYm1SbGVFOW1LR1JsY0dWdUtTQnBjeUF0TVNCaGJtUWdLRzV2ZENCcGJYQnZjblJ6SUc5eUlHbHRjRzl5ZEhNZ2FYTnVkQ0JrWlhCbGJpbGNjbHh1SUNBZ0lDQWdLVnh5WEc0Z0lDQWdJQ0JwWmlCdGFYTnphVzVuTG14bGJtZDBhQ0JwY3lBd1hISmNiaUFnSUNBZ0lDQWdjbVYwSUQwZ2RISjFaVnh5WEc0Z0lDQWdJQ0FnSUdOaGJHeENZV05yS0NsY2NseHVJQ0FnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0FnSUc1elNXNTBaWEp1WVd3dVpHVndaVzVrWlc1MGN5NXdkWE5vSUNocGJYQnZjblJ6S1NBdFBseHlYRzRnSUNBZ0lDQWdJQ0FnWkdWd1pXNWtjMDl1SUcxcGMzTnBibWNzSUdOaGJHeENZV05yTENCcGJYQnZjblJ6WEhKY2JseHlYRzRnSUNBZ2NtVjBYSEpjYmlBZ2JuTkpiblJsY201aGJDQTlJR1JsY0dWdVpHVnVkSE02SUZ0ZFhISmNibHh5WEc0Z0lDTWpJMXh5WEc0Z0lFWmxkR05vWlhNZ2RHaGxJSEpsWjJsemRHVnlaV1FnY0hKdmNHVnlkR2xsY3lCaGJtUWdiV1YwYUc5a2N5QnZiaUIwYUdVZ2JtRnRaWE53WVdObElHRnVaQ0JwZEhNZ1kyaHBiR1FnYm1GdFpYTndZV05sYzF4eVhHNGdJQ01qSTF4eVhHNGdJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNCdWMwbHVkR1Z5Ym1Gc0xDQW5aMlYwVG5OTlpXMWlaWEp6Snl4Y2NseHVJQ0FnSUhaaGJIVmxPaUF0UGx4eVhHNGdJQ0FnSUNCeVpXTjFjbk5sVkhKbFpTQTlJQ2hyWlhrc0lHeGhjM1JMWlhrcElDMCtYSEpjYmlBZ0lDQWdJQ0FnYldWdFltVnljeTV3ZFhOb0lHeGhjM1JMWlhrZ0t5QW5MaWNnS3lCclpYa2dJR2xtSUhSNWNHVnZaaUFvYTJWNUtTQnBjeUFuYzNSeWFXNW5KMXh5WEc0Z0lDQWdJQ0FnSUdsbUlIVjBhV3hNYVdJdWFYTlFiR0ZwYms5aWFtVmpkQ2hyWlhrcFhISmNiaUFnSUNBZ0lDQWdJQ0JQWW1wbFkzUXVhMlY1Y3loclpYa3BMbVp2Y2tWaFkyZ2dLR3NwSUMwK1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUcxbGJXSmxjbk11Y0hWemFDQnNZWE4wUzJWNUlDc2dKeTRuSUNzZ2F5QWdhV1lnZEhsd1pXOW1JQ2hyS1NCcGN5QW5jM1J5YVc1bkoxeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpXTjFjbk5sVkhKbFpTQnJaWGxiYTEwc0lHeGhjM1JMWlhrZ0t5QW5MaWNnS3lCcklDQnBaaUIxZEdsc1RHbGlMbWx6VUd4aGFXNVBZbXBsWTNRb2EyVjVXMnRkS1Z4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WlhSMWNtNWNjbHh1WEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1WEhKY2JpQWdJQ0FnSUcxbGJXSmxjbk1nUFNCYlhWeHlYRzRnSUNBZ0lDQlBZbXBsWTNRdWEyVjVjeWhPYzFSeVpXVmJibUZ0WlZOd1lXTmxUbUZ0WlYwcExtWnZja1ZoWTJnZ0tHdGxlU2tnTFQ1Y2NseHVJQ0FnSUNBZ0lDQnlaV04xY25ObFZISmxaU0JPYzFSeVpXVmJibUZ0WlZOd1lXTmxUbUZ0WlYxYmEyVjVYU3dnYm1GdFpWTndZV05sVG1GdFpTQWdhV1lnZFhScGJFeHBZaTVwYzFCc1lXbHVUMkpxWldOMEtFNXpWSEpsWlZ0dVlXMWxVM0JoWTJWT1lXMWxYVnRyWlhsZEtWeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJseHlYRzVjY2x4dUlDQWdJQ0FnYldWdFltVnljMXh5WEc1Y2NseHVJQ0FqSXlOY2NseHVJQ0JVYnlCemRYQndiM0owSUdSbGNHVnVaR1Z1WTNrZ2JXRnVZV2RsYldWdWRDd2dkMmhsYmlCaElIQnliM0JsY25SNUlHbHpJR3hwWm5SbFpDQnZiblJ2SUhSb1pTQnVZVzFsYzNCaFkyVXNJRzV2ZEdsbWVTQmtaWEJsYm1SbGJuUnpJSFJ2SUdsdWFYUnBZV3hwZW1WY2NseHVJQ0FqSXlOY2NseHVJQ0JQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrZ2JuTkpiblJsY201aGJDd2dKMkZzWlhKMFJHVndaVzVrWlc1MGN5Y3NYSEpjYmlBZ0lDQjJZV3gxWlRvZ0tHbHRjRzl5ZEhNcElDMCtYSEpjYmlBZ0lDQWdJR1JsY0hNZ1BTQnVjMGx1ZEdWeWJtRnNMbVJsY0dWdVpHVnVkSE11Wm1sc2RHVnlLQ2hrWlhCUGJpa2dMVDVjY2x4dUlDQWdJQ0FnSUNCbVlXeHpaU0JwY3lCa1pYQlBiaWhwYlhCdmNuUnpLVnh5WEc0Z0lDQWdJQ0FwWEhKY2JpQWdJQ0FnSUc1elNXNTBaWEp1WVd3dVpHVndaVzVrWlc1MGN5QTlJR1JsY0hNZ0lHbG1JRUZ5Y21GNUxtbHpRWEp5WVhrb1pHVndjeWxjY2x4dVhISmNiaUFnSTBOeVpXRjBaU0IwYUdVZ2NtOXZkQ0J2WmlCMGFHVWdkSEpsWlNCaGN5QjBhR1VnWTNWeWNtVnVkQ0J1WVcxbGMzQmhZMlZjY2x4dUlDQk9jMVJ5WldWYmJtRnRaVk53WVdObFRtRnRaVjBnUFNCN2ZWeHlYRzRnSUNORVpXWnBibVVnZEdobElHTnZjbVVnYm1GdFpYTndZV05sSUdGdVpDQjBhR1VnY21WMGRYSnVJRzltSUhSb2FYTWdZMnhoYzNOY2NseHVJQ0JPYzA5MWRDQTlJRzFoYTJWT1lXMWxVM0JoWTJVb2JtRnRaVk53WVdObFRtRnRaU3dnVG5OVWNtVmxXMjVoYldWVGNHRmpaVTVoYldWZEtWeHlYRzVjY2x4dUlDQWpJeU5jY2x4dUlDQkRZV05vWlNCaElHaGhibVJzWlNCdmJpQjBhR1VnZG1WdVpHOXlJQ2h3Y205aVlXSnNlU0JxVVhWbGNua3BJRzl1SUhSb1pTQnliMjkwSUc1aGJXVnpjR0ZqWlZ4eVhHNGdJQ01qSTF4eVhHNGdJRTV6VDNWMExuSmxaMmx6ZEdWeUlDYy9KeXdnZFhScGJFeHBZaXdnWm1Gc2MyVmNjbHh1WEhKY2JpQWdJeU1qWEhKY2JpQWdRMkZqYUdVZ2RHaGxJSFJ5WldVZ0tIVnpaV1oxYkNCbWIzSWdaRzlqZFcxbGJuUmhkR2x2Ymk5MmFYTjFZV3hwZW1GMGFXOXVMMlJsWW5WbloybHVaeWxjY2x4dUlDQWpJeU5jY2x4dUlDQk9jMDkxZEM1eVpXZHBjM1JsY2lBbmRISmxaU2NzSUU1elZISmxaVnR1WVcxbFUzQmhZMlZPWVcxbFhTd2dabUZzYzJWY2NseHVYSEpjYmlBZ0l5TWpYSEpjYmlBZ1EyRmphR1VnZEdobElHNWhiV1VnYzNCaFkyVWdibUZ0WlZ4eVhHNGdJQ01qSTF4eVhHNGdJRTV6VDNWMExuSmxaMmx6ZEdWeUlDZHVZVzFsSnl3Z2JtRnRaVk53WVdObFRtRnRaU3dnWm1Gc2MyVmNjbHh1SUNCT2MwOTFkQzV5WldkcGMzUmxjaUFuWkdWd1pXNWtjMDl1Snl3Z1pHVndaVzVrYzA5dUxDQm1ZV3h6WlZ4eVhHNGdJRTV6VDNWMFhISmNibHh5WEc1Y2NseHVJeU1qWEhKY2JrRmpkSFZoYkd4NUlHUmxabWx1WlNCMGFHVWdUMG9nVG1GdFpWTndZV05sWEhKY2JpTWpJMXh5WEc1UFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa2dkR2hwYzBkc2IySmhiQ3dnYm1GdFpWTndZV05sVG1GdFpTeGNjbHh1SUNCMllXeDFaVG9nYldGclpWUm9aVXAxYVdObEtDbGNjbHh1WEhKY2JrOUtMbkpsWjJsemRHVnlJQ2RuYkc5aVlXd25MQ0IwYUdselIyeHZZbUZzWEhKY2JseHlYRzUwYUdselJHOWpkVzFsYm5RZ1BTQjdmVnh5WEc1cFppQjBlWEJsYjJZZ1pHOWpkVzFsYm5RZ2FYTnVkQ0FuZFc1a1pXWnBibVZrSjF4eVhHNGdJSFJvYVhORWIyTjFiV1Z1ZENBOUlHUnZZM1Z0Wlc1MFhISmNibHh5WEc1UFNpNXlaV2RwYzNSbGNpQW5aRzlqZFcxbGJuUW5MQ0IwYUdselJHOWpkVzFsYm5SY2NseHVYSEpjYms5S0xuSmxaMmx6ZEdWeUlDZHViMjl3Snl3Z0xUNWNjbHh1WEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1Qwb2lYWDA9IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE9KLCBfLCBzdWJOYW1lU3BhY2VzO1xuXG5PSiA9IHJlcXVpcmUoJy4vb2onKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuc3ViTmFtZVNwYWNlcyA9IFsnZXJyb3JzJywgJ2VudW1zJywgJ2luc3RhbmNlT2YnLCAnbm9kZXMnLCAnZGInLCAnY29tcG9uZW50cycsICdjb250cm9scycsICdpbnB1dHMnLCAnbm90aWZpY2F0aW9ucycsICdoaXN0b3J5JywgJ2Nvb2tpZScsICdhc3luYyddO1xuXG5fLmVhY2goc3ViTmFtZVNwYWNlcywgZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gT0oubWFrZVN1Yk5hbWVTcGFjZShuYW1lKTtcbn0pO1xuXG5PSlsnR0VORVJBVEVfVU5JUVVFX0lEUyddID0gZmFsc2U7XG5cbk9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gPSAnZGl2JztcblxuT0pbJ1RSQUNLX09OX0VSUk9SJ10gPSBmYWxzZTtcblxuT0pbJ0xPR19BTExfQUpBWCddID0gZmFsc2U7XG5cbk9KWydMT0dfQUxMX0FKQVhfRVJST1JTJ10gPSBmYWxzZTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRnh2YWtsdWFYUXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkZRU3hKUVVGQk96dEJRVUZCTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1RVRkJVanM3UVVGRFRDeERRVUZCTEVkQlFVa3NUMEZCUVN4RFFVRlJMRkZCUVZJN08wRkJTVW9zWVVGQlFTeEhRVUZuUWl4RFFVTmtMRkZCUkdNc1JVRkZaQ3hQUVVaakxFVkJSMlFzV1VGSVl5eEZRVWxrTEU5QlNtTXNSVUZMWkN4SlFVeGpMRVZCVFdRc1dVRk9ZeXhGUVU5a0xGVkJVR01zUlVGUlpDeFJRVkpqTEVWQlUyUXNaVUZVWXl4RlFWVmtMRk5CVm1Nc1JVRlhaQ3hSUVZoakxFVkJXV1FzVDBGYVl6czdRVUZ0UW1oQ0xFTkJRVU1zUTBGQlF5eEpRVUZHTEVOQlFVOHNZVUZCVUN4RlFVRnpRaXhUUVVGRExFbEJRVVE3VTBGRGNFSXNSVUZCUlN4RFFVRkRMR2RDUVVGSUxFTkJRVzlDTEVsQlFYQkNPMEZCUkc5Q0xFTkJRWFJDT3p0QlFVMUJMRVZCUVVjc1EwRkJRU3h4UWtGQlFTeERRVUZJTEVkQlFUUkNPenRCUVVVMVFpeEZRVUZITEVOQlFVRXNhVU5CUVVFc1EwRkJTQ3hIUVVGM1F6czdRVUZGZUVNc1JVRkJSeXhEUVVGQkxHZENRVUZCTEVOQlFVZ3NSMEZCZFVJN08wRkJSWFpDTEVWQlFVY3NRMEZCUVN4alFVRkJMRU5CUVVnc1IwRkJjVUk3TzBGQlJYSkNMRVZCUVVjc1EwRkJRU3h4UWtGQlFTeERRVUZJTEVkQlFUUkNJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJZ0l5QWpJRTlLSUZCdmMzUXRTVzVwZEdsaGJHbDZZWFJwYjI1Y2NseHVYSEpjYms5S0lEMGdjbVZ4ZFdseVpTQW5MaTl2YWlkY2NseHVYeUE5SUhKbGNYVnBjbVVnSjJ4dlpHRnphQ2RjY2x4dVhISmNiaU1nVTJsdGNHeGxJR0Z5Y21GNUlHOW1JR0Z1ZEdsamFYQmhkR1ZrTDJ0dWIzZHVJR05vYVd4a0lHNWhiV1Z6Y0dGalpYTmNjbHh1SUNCY2NseHVjM1ZpVG1GdFpWTndZV05sY3lBOUlGdGNjbHh1SUNBblpYSnliM0p6SjF4eVhHNGdJQ2RsYm5WdGN5ZGNjbHh1SUNBbmFXNXpkR0Z1WTJWUFppZGNjbHh1SUNBbmJtOWtaWE1uWEhKY2JpQWdKMlJpSjF4eVhHNGdJQ2RqYjIxd2IyNWxiblJ6SjF4eVhHNGdJQ2RqYjI1MGNtOXNjeWRjY2x4dUlDQW5hVzV3ZFhSekoxeHlYRzRnSUNkdWIzUnBabWxqWVhScGIyNXpKMXh5WEc0Z0lDZG9hWE4wYjNKNUoxeHlYRzRnSUNkamIyOXJhV1VuWEhKY2JpQWdKMkZ6ZVc1akoxeHlYRzVkWEhKY2JseHlYRzRqSUNNaklGTjFZazVoYldWVGNHRmpaWE5jY2x4dVhISmNiaU1nVUhKbExXRnNiRzlqWVhSbElHTmxjblJoYVc0Z1kyOXRiVzl1SUc1aGJXVnpjR0ZqWlhNZ2RHOGdZWFp2YVdRZ1puVjBkWEpsSUhKaFkyVWdZMjl1WkdsMGFXOXVjeTVjY2x4dUl5QlVhR2x6SUdSdlpYTWdjbVZ4ZFdseVpTQjBhR0YwSUhSb1pTQnZjbVJsY2lCdlppQnZjR1Z5WVhScGIyNXpJR3h2WVdSeklFOUtMbU52Wm1abFpTQm1hWEp6ZENCaGJtUWdiMHBKYm1sMExtTnZabVpsWlNCelpXTnZibVJjY2x4dVh5NWxZV05vSUhOMVlrNWhiV1ZUY0dGalpYTXNJQ2h1WVcxbEtTQXRQbHh5WEc0Z0lFOUtMbTFoYTJWVGRXSk9ZVzFsVTNCaFkyVWdibUZ0WlZ4eVhHNGdJRnh5WEc0aklDTWpJRU52Ym1acFozVnlZWFJwYjI0Z2RtRnlhV0ZpYkdWelhISmNibHh5WEc0aklFRjFkRzl0WVhScFkyRnNiSGtnWjJWdVpYSmhkR1VnZFc1cGNYVmxJRWxFY3lCbWIzSWdaV0ZqYUNCdWIyUmxJQ2hrWldaaGRXeDBJR1poYkhObEtWeHlYRzVQU2xzblIwVk9SVkpCVkVWZlZVNUpVVlZGWDBsRVV5ZGRJRDBnWm1Gc2MyVmNjbHh1SXlCRVpXWmhkV3gwSUhKdmIzUWdibTlrWlNCbWIzSWdZMjl0Y0c5dVpXNTBjeTlqYjI1MGNtOXNjeUFvWkdWbVlYVnNkQ0FuWkdsMkp5bGNjbHh1VDBwYkowUkZSa0ZWVEZSZlEwOU5VRTlPUlU1VVgxSlBUMVJmVGs5RVJWUlpVRVVuWFNBOUlDZGthWFluWEhKY2JpTWdWMmhsZEdobGNpQjBieUJvYjI5cklHbHVkRzhnZEdobElHZHNiMkpoYkNCdmJpQmxjbkp2Y2lCbGRtVnVkQ0IwYnlCM2NtbDBaU0JsY25KdmNuTWdkRzhnWTI5dWMyOXNaU0FvWkdWbVlYVnNkQ0JtWVd4elpTbGNjbHh1VDBwYkoxUlNRVU5MWDA5T1gwVlNVazlTSjEwZ1BTQm1ZV3h6WlZ4eVhHNGpWMmhsZEdobGNpQjBieUJzYjJjZ1lXeHNJRUZLUVZnZ2NtVnhkV1Z6ZEhOY2NseHVUMHBiSjB4UFIxOUJURXhmUVVwQldDZGRJRDBnWm1Gc2MyVmNjbHh1STFkb1pYUm9aWElnZEc4Z2JHOW5JR0ZzYkNCQlNrRllJR1Z5Y205eWMxeHlYRzVQU2xzblRFOUhYMEZNVEY5QlNrRllYMFZTVWs5U1V5ZGRJRDBnWm1Gc2MyVWlYWDA9IiwiXHJcbiMjI1xyXG5SZXR1cm4ganVzdCB0aGUga2V5cyBmcm9tIHRoZSBpbnB1dCBhcnJheSwgb3B0aW9uYWxseSBvbmx5IGZvciB0aGUgc3BlY2lmaWVkIHNlYXJjaF92YWx1ZVxyXG52ZXJzaW9uOiAxMTA5LjIwMTVcclxuZGlzY3VzcyBhdDogaHR0cDovL3BocGpzLm9yZy9mdW5jdGlvbnMvYXJyYXlfa2V5c1xyXG4rICAgb3JpZ2luYWwgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0KVxyXG4rICAgICAgaW5wdXQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXHJcbisgICBidWdmaXhlZCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2tldmluLnZhbnpvbm5ldmVsZC5uZXQpXHJcbisgICBpbXByb3ZlZCBieTogamRcclxuKyAgIGltcHJvdmVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxyXG4rICAgaW5wdXQgYnk6IFBcclxuKyAgIGJ1Z2ZpeGVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxyXG5leGFtcGxlIDE6IGFycmF5X2tleXMoIHtmaXJzdG5hbWU6ICdLZXZpbicsIHN1cm5hbWU6ICd2YW4gWm9ubmV2ZWxkJ30gKTtcclxucmV0dXJucyAxOiB7MDogJ2ZpcnN0bmFtZScsIDE6ICdzdXJuYW1lJ31cclxuIyMjXHJcbmFycmF5X2tleXMgPSAoaW5wdXQsIHNlYXJjaF92YWx1ZSwgYXJnU3RyaWN0KSAtPlxyXG4gIHNlYXJjaCA9IHR5cGVvZiBzZWFyY2hfdmFsdWUgaXNudCBcInVuZGVmaW5lZFwiXHJcbiAgdG1wX2FyciA9IFtdXHJcbiAgc3RyaWN0ID0gISFhcmdTdHJpY3RcclxuICBpbmNsdWRlID0gdHJ1ZVxyXG4gIGtleSA9IFwiXCJcclxuICAjIER1Y2stdHlwZSBjaGVjayBmb3Igb3VyIG93biBhcnJheSgpLWNyZWF0ZWQgUEhQSlNfQXJyYXlcclxuICByZXR1cm4gaW5wdXQua2V5cyhzZWFyY2hfdmFsdWUsIGFyZ1N0cmljdCkgIGlmIGlucHV0IGFuZCB0eXBlb2YgaW5wdXQgaXMgXCJvYmplY3RcIiBhbmQgaW5wdXQuY2hhbmdlX2tleV9jYXNlXHJcbiAgZm9yIGtleSBvZiBpbnB1dFxyXG4gICAgaWYgaW5wdXQuaGFzT3duUHJvcGVydHkoa2V5KVxyXG4gICAgICBpbmNsdWRlID0gdHJ1ZVxyXG4gICAgICBpZiBzZWFyY2hcclxuICAgICAgICBpZiBzdHJpY3QgYW5kIGlucHV0W2tleV0gaXNudCBzZWFyY2hfdmFsdWVcclxuICAgICAgICAgIGluY2x1ZGUgPSBmYWxzZVxyXG4gICAgICAgIGVsc2UgaW5jbHVkZSA9IGZhbHNlICB1bmxlc3MgaW5wdXRba2V5XSBpcyBzZWFyY2hfdmFsdWVcclxuICAgICAgdG1wX2Fyclt0bXBfYXJyLmxlbmd0aF0gPSBrZXkgIGlmIGluY2x1ZGVcclxuICB0bXBfYXJyXHJcblxyXG4jIyMqXHJcbkNvbnZlcnQgYSBKYXZhc2NyaXB0IE9qZWN0IGFycmF5IG9yIFN0cmluZyBhcnJheSB0byBhbiBIVE1MIHRhYmxlXHJcbkpTT04gcGFyc2luZyBoYXMgdG8gYmUgbWFkZSBiZWZvcmUgZnVuY3Rpb24gY2FsbFxyXG5JdCBhbGxvd3MgdXNlIG9mIG90aGVyIEpTT04gcGFyc2luZyBtZXRob2RzIGxpa2UgalF1ZXJ5LnBhcnNlSlNPTlxyXG5odHRwKHMpOi8vLCBmdHA6Ly8sIGZpbGU6Ly8gYW5kIGphdmFzY3JpcHQ6OyBsaW5rcyBhcmUgYXV0b21hdGljYWxseSBjb21wdXRlZFxyXG5cclxuSlNPTiBkYXRhIHNhbXBsZXMgdGhhdCBzaG91bGQgYmUgcGFyc2VkIGFuZCB0aGVuIGNhbiBiZSBjb252ZXJ0ZWQgdG8gYW4gSFRNTCB0YWJsZVxyXG52YXIgb2JqZWN0QXJyYXkgPSAnW3tcIlRvdGFsXCI6XCIzNFwiLFwiVmVyc2lvblwiOlwiMS4wLjRcIixcIk9mZmljZVwiOlwiTmV3IFlvcmtcIn0se1wiVG90YWxcIjpcIjY3XCIsXCJWZXJzaW9uXCI6XCIxLjEuMFwiLFwiT2ZmaWNlXCI6XCJQYXJpc1wifV0nO1xyXG52YXIgc3RyaW5nQXJyYXkgPSAnW1wiTmV3IFlvcmtcIixcIkJlcmxpblwiLFwiUGFyaXNcIixcIk1hcnJha2VjaFwiLFwiTW9zY293XCJdJztcclxudmFyIG5lc3RlZFRhYmxlID0gJ1t7IGtleTE6IFwidmFsMVwiLCBrZXkyOiBcInZhbDJcIiwga2V5MzogeyB0YWJsZUlkOiBcInRibElkTmVzdGVkMVwiLCB0YWJsZUNsYXNzTmFtZTogXCJjbHNOZXN0ZWRcIiwgbGlua1RleHQ6IFwiRG93bmxvYWRcIiwgZGF0YTogW3sgc3Via2V5MTogXCJzdWJ2YWwxXCIsIHN1YmtleTI6IFwic3VidmFsMlwiLCBzdWJrZXkzOiBcInN1YnZhbDNcIiB9XSB9IH1dJztcclxuXHJcbkNvZGUgc2FtcGxlIHRvIGNyZWF0ZSBhIEhUTUwgdGFibGUgSmF2YXNjcmlwdCBTdHJpbmdcclxudmFyIGpzb25IdG1sVGFibGUgPSBDb252ZXJ0SnNvblRvVGFibGUoZXZhbChkYXRhU3RyaW5nKSwgJ2pzb25UYWJsZScsIG51bGwsICdEb3dubG9hZCcpO1xyXG5cclxuQ29kZSBzYW1wbGUgZXhwbGFuZWRcclxuLSBldmFsIGlzIHVzZWQgdG8gcGFyc2UgYSBKU09OIGRhdGFTdHJpbmdcclxuLSB0YWJsZSBIVE1MIGlkIGF0dHJpYnV0ZSB3aWxsIGJlICdqc29uVGFibGUnXHJcbi0gdGFibGUgSFRNTCBjbGFzcyBhdHRyaWJ1dGUgd2lsbCBub3QgYmUgYWRkZWRcclxuLSAnRG93bmxvYWQnIHRleHQgd2lsbCBiZSBkaXNwbGF5ZWQgaW5zdGVhZCBvZiB0aGUgbGluayBpdHNlbGZcclxuXHJcbkBhdXRob3IgQWZzaGluIE1laHJhYmFuaSA8YWZzaGluIGRvdCBtZWggYXQgZ21haWwgZG90IGNvbT5cclxuXHJcbkBjbGFzcyBDb252ZXJ0SnNvblRvVGFibGVcclxuXHJcbkBtZXRob2QgQ29udmVydEpzb25Ub1RhYmxlXHJcblxyXG5AcGFyYW0gcGFyc2VkSnNvbiBvYmplY3QgUGFyc2VkIEpTT04gZGF0YVxyXG5AcGFyYW0gdGFibGVJZCBzdHJpbmcgT3B0aW9uYWwgdGFibGUgaWRcclxuQHBhcmFtIHRhYmxlQ2xhc3NOYW1lIHN0cmluZyBPcHRpb25hbCB0YWJsZSBjc3MgY2xhc3MgbmFtZVxyXG5AcGFyYW0gbGlua1RleHQgc3RyaW5nIE9wdGlvbmFsIHRleHQgcmVwbGFjZW1lbnQgZm9yIGxpbmsgcGF0dGVyblxyXG5cclxuQHJldHVybiBzdHJpbmcgQ29udmVydGVkIEpTT04gdG8gSFRNTCB0YWJsZVxyXG4jIyNcclxuY2xhc3MgSnNvblRvVGFibGUgXHJcbiAgXHJcbiAgdGFibGU6IG51bGxcclxuICBcclxuICBjb25zdHJ1Y3RvcjogKHBhcnNlZEpzb24sIHRhYmxlSWQsIHRhYmxlQ2xhc3NOYW1lLCBsaW5rVGV4dCkgLT5cclxuICAgICNQYXR0ZXJucyBmb3IgbGlua3MgYW5kIE5VTEwgdmFsdWVcclxuICAgIGl0YWxpYyA9IFwiPGk+ezB9PC9pPlwiXHJcbiAgICBsaW5rID0gKGlmIGxpbmtUZXh0IHRoZW4gXCI8YSBocmVmPVxcXCJ7MH1cXFwiPlwiICsgbGlua1RleHQgKyBcIjwvYT5cIiBlbHNlIFwiPGEgaHJlZj1cXFwiezB9XFxcIj57MH08L2E+XCIpXHJcbiAgXHJcbiAgICAjUGF0dGVybiBmb3IgdGFibGUgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgaWRNYXJrdXAgPSAoaWYgdGFibGVJZCB0aGVuIFwiIGlkPVxcXCJcIiArIHRhYmxlSWQgKyBcIlxcXCJcIiBlbHNlIFwiXCIpXHJcbiAgICBjbGFzc01hcmt1cCA9IChpZiB0YWJsZUNsYXNzTmFtZSB0aGVuIFwiIGNsYXNzPVxcXCJcIiArIHRhYmxlQ2xhc3NOYW1lICsgXCJcXFwiXCIgZWxzZSBcIlwiKVxyXG4gICAgdGJsID0gXCI8dGFibGUgYm9yZGVyPVxcXCIxXFxcIiBjZWxscGFkZGluZz1cXFwiMVxcXCIgY2VsbHNwYWNpbmc9XFxcIjFcXFwiXCIgKyBpZE1hcmt1cCArIGNsYXNzTWFya3VwICsgXCI+ezB9ezF9PC90YWJsZT5cIlxyXG4gIFxyXG4gICAgI1BhdHRlcm5zIGZvciB0YWJsZSBjb250ZW50XHJcbiAgICB0aCA9IFwiPHRoZWFkPnswfTwvdGhlYWQ+XCJcclxuICAgIHRiID0gXCI8dGJvZHk+ezB9PC90Ym9keT5cIlxyXG4gICAgdHIgPSBcIjx0cj57MH08L3RyPlwiXHJcbiAgICB0aFJvdyA9IFwiPHRoPnswfTwvdGg+XCJcclxuICAgIHRkUm93ID0gXCI8dGQ+ezB9PC90ZD5cIlxyXG4gICAgdGhDb24gPSBcIlwiXHJcbiAgICB0YkNvbiA9IFwiXCJcclxuICAgIHRyQ29uID0gXCJcIlxyXG4gICAgaWYgcGFyc2VkSnNvblxyXG4gICAgICBpc1N0cmluZ0FycmF5ID0gdHlwZW9mIChwYXJzZWRKc29uWzBdKSBpcyBcInN0cmluZ1wiXHJcbiAgICAgIGhlYWRlcnMgPSB1bmRlZmluZWRcclxuICAgIFxyXG4gICAgICAjIENyZWF0ZSB0YWJsZSBoZWFkZXJzIGZyb20gSlNPTiBkYXRhXHJcbiAgICAgICMgSWYgSlNPTiBkYXRhIGlzIGEgc2ltcGxlIHN0cmluZyBhcnJheSB3ZSBjcmVhdGUgYSBzaW5nbGUgdGFibGUgaGVhZGVyXHJcbiAgICAgIGlmIGlzU3RyaW5nQXJyYXlcclxuICAgICAgICB0aENvbiArPSB0aFJvdy5mb3JtYXQoXCJ2YWx1ZVwiKVxyXG4gICAgICBlbHNlXHJcbiAgICAgIFxyXG4gICAgICAgICMgSWYgSlNPTiBkYXRhIGlzIGFuIG9iamVjdCBhcnJheSwgaGVhZGVycyBhcmUgYXV0b21hdGljYWxseSBjb21wdXRlZFxyXG4gICAgICAgIGlmIHR5cGVvZiAocGFyc2VkSnNvblswXSkgaXMgXCJvYmplY3RcIlxyXG4gICAgICAgICAgaGVhZGVycyA9IGFycmF5X2tleXMocGFyc2VkSnNvblswXSlcclxuICAgICAgICAgIGkgPSAwXHJcbiAgICAgICAgICB3aGlsZSBpIDwgaGVhZGVycy5sZW5ndGhcclxuICAgICAgICAgICAgdGhDb24gKz0gdGhSb3cuZm9ybWF0KGhlYWRlcnNbaV0pXHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICB0aCA9IHRoLmZvcm1hdCh0ci5mb3JtYXQodGhDb24pKVxyXG4gICAgXHJcbiAgICAgICMgQ3JlYXRlIHRhYmxlIHJvd3MgZnJvbSBKc29uIGRhdGFcclxuICAgICAgaWYgaXNTdHJpbmdBcnJheVxyXG4gICAgICAgIGkgPSAwXHJcbiAgICAgICAgd2hpbGUgaSA8IHBhcnNlZEpzb24ubGVuZ3RoXHJcbiAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQocGFyc2VkSnNvbltpXSlcclxuICAgICAgICAgIHRyQ29uICs9IHRyLmZvcm1hdCh0YkNvbilcclxuICAgICAgICAgIHRiQ29uID0gXCJcIlxyXG4gICAgICAgICAgaSsrXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBpZiBoZWFkZXJzXHJcbiAgICAgICAgICB1cmxSZWdFeHAgPSBuZXcgUmVnRXhwKC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvZylcclxuICAgICAgICAgIGphdmFzY3JpcHRSZWdFeHAgPSBuZXcgUmVnRXhwKC8oXmphdmFzY3JpcHQ6W1xcc1xcU10qOyQpL2cpXHJcbiAgICAgICAgICBpID0gMFxyXG4gICAgICAgICAgd2hpbGUgaSA8IHBhcnNlZEpzb24ubGVuZ3RoXHJcbiAgICAgICAgICAgIGogPSAwXHJcbiAgICAgICAgICAgIHdoaWxlIGogPCBoZWFkZXJzLmxlbmd0aFxyXG4gICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VkSnNvbltpXVtoZWFkZXJzW2pdXVxyXG4gICAgICAgICAgICAgIGlzVXJsID0gdXJsUmVnRXhwLnRlc3QodmFsdWUpIG9yIGphdmFzY3JpcHRSZWdFeHAudGVzdCh2YWx1ZSlcclxuICAgICAgICAgICAgICBpZiBpc1VybCAjIElmIHZhbHVlIGlzIFVSTCB3ZSBhdXRvLWNyZWF0ZSBhIGxpbmtcclxuICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChsaW5rLmZvcm1hdCh2YWx1ZSkpXHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgaWYgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgaWYgdHlwZW9mICh2YWx1ZSkgaXMgXCJvYmplY3RcIlxyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAjZm9yIHN1cHBvcnRpbmcgbmVzdGVkIHRhYmxlc1xyXG4gICAgICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChDb252ZXJ0SnNvblRvVGFibGUoZXZhbCh2YWx1ZS5kYXRhKSwgdmFsdWUudGFibGVJZCwgdmFsdWUudGFibGVDbGFzc05hbWUsIHZhbHVlLmxpbmtUZXh0KSlcclxuICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdCh2YWx1ZSlcclxuICAgICAgICAgICAgICAgIGVsc2UgIyBJZiB2YWx1ZSA9PSBudWxsIHdlIGZvcm1hdCBpdCBsaWtlIFBocE15QWRtaW4gTlVMTCB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KGl0YWxpYy5mb3JtYXQodmFsdWUpLnRvVXBwZXJDYXNlKCkpXHJcbiAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgIHRyQ29uICs9IHRyLmZvcm1hdCh0YkNvbilcclxuICAgICAgICAgICAgdGJDb24gPSBcIlwiXHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICB0YiA9IHRiLmZvcm1hdCh0ckNvbilcclxuICAgICAgdGJsID0gdGJsLmZvcm1hdCh0aCwgdGIpXHJcbiAgICBAdGFibGUgPSB0YmxcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSnNvblRvVGFibGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5hcnJheTJEID0gKGluaXRMZW5ndGgsIGluaXRXaWR0aCkgLT5cclxuICBhcnJheSA9IFtdXHJcbiAgbWF4TGVuZ3RoID0gMFxyXG4gIG1heFdpZHRoID0gMFxyXG4gICAgXHJcbiAgcmV0ID0gXHJcbiAgICBnZXQ6IChyb3dObywgY29sTm8pIC0+XHJcbiAgICAgIGV4dGVuZCByb3dObywgY29sTm9cclxuICAgIHNldDogKHJvd05vLCBjb2xObywgdmFsKSAtPlxyXG4gICAgICByZXQuZ2V0IHJvd05vLCBjb2xOb1xyXG4gICAgICByb3dJZHggPSByb3dOby0xXHJcbiAgICAgIGNvbElkeCA9IGNvbE5vLTFcclxuICAgICAgYXJyYXlbcm93SWR4XVtjb2xJZHhdID0gdmFsXHJcbiAgICBlYWNoOiAoY2FsbEJhY2spIC0+XHJcbiAgICAgIF8uZWFjaCBhcnJheSwgKGNvbHVtbnMsIHJvdykgLT5cclxuICAgICAgICBfLmVhY2ggYXJyYXlbcm93XSwgKHZhbCwgY29sKSAtPlxyXG4gICAgICAgICAgcm93SWR4ID0gcm93KzFcclxuICAgICAgICAgIGNvbElkeCA9IGNvbCsxXHJcbiAgICAgICAgICBjYWxsQmFjayByb3dJZHgsIGNvbElkeCwgdmFsXHJcbiAgICB3aWR0aDogKCkgLT5cclxuICAgICAgbWF4V2lkdGhcclxuICAgIGxlbmd0aDogKCkgLT5cclxuICAgICAgbWF4TGVuZ3RoXHJcbiAgICAgICAgIFxyXG4gICMjI1xyXG4gIEd1YXJhbnRlZSB0aGF0IHRoZSBkaW1lbnNpb25zIG9mIHRoZSBhcnJheSBhcmUgYWx3YXlzIGJhY2tlZCBieSB2YWx1ZXMgYXQgZXZlcnkgcG9zaXRpb25cclxuICAjIyMgICAgICAgICAgICAgICAgICAgIFxyXG4gIGV4dGVuZCA9IChsZW5ndGgsIHdpZHRoKSAtPiAgXHJcbiAgICBpZiBub3QgbGVuZ3RoIG9yIGxlbmd0aCA8IDEgdGhlbiBsZW5ndGggPSAxXHJcbiAgICBpZiBub3Qgd2lkdGggb3Igd2lkdGggPCAxIHRoZW4gd2lkdGggPSAxXHJcbiAgICAgIFxyXG4gICAgaWYgbWF4TGVuZ3RoIDwgbGVuZ3RoIHRoZW4gbWF4TGVuZ3RoID0gbGVuZ3RoXHJcbiAgICBpZiBhcnJheS5sZW5ndGggPiBtYXhMZW5ndGggdGhlbiBtYXhMZW5ndGggPSBhcnJheS5sZW5ndGhcclxuICAgIGlmIG1heFdpZHRoIDwgd2lkdGggdGhlbiBtYXhXaWR0aCA9IHdpZHRoXHJcbiAgICBpID0gMFxyXG4gICAgICBcclxuICAgIHdoaWxlIGkgPCBtYXhMZW5ndGhcclxuICAgICAgdHJ5Um93ID0gYXJyYXlbaV1cclxuICAgICAgaWYgbm90IHRyeVJvd1xyXG4gICAgICAgIHRyeVJvdyA9IFtdXHJcbiAgICAgICAgYXJyYXkucHVzaCB0cnlSb3dcclxuICAgICAgaWYgbWF4V2lkdGggPCB0cnlSb3cubGVuZ3RoIHRoZW4gbWF4V2lkdGggPSB0cnlSb3cubGVuZ3RoXHJcbiAgICAgIGlmIHRyeVJvdy5sZW5ndGggPCBtYXhXaWR0aCB0aGVuIHRyeVJvdy5sZW5ndGggPSBtYXhXaWR0aFxyXG4gICAgICBpICs9IDFcclxuICAgICAgXHJcbiAgICBhcnJheVtsZW5ndGgtMV1bd2lkdGgtMV1cclxuICAgICAgIFxyXG4gIGV4dGVuZCBpbml0TGVuZ3RoLCBpbml0V2lkdGhcclxuICAgIFxyXG4gIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ2FycmF5MkQnLCBhcnJheTJEXHJcbm1vZHVsZS5leHBvcnRzID0gYXJyYXkyRCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbm1ldGhvZHMgPSBbXHJcbiAgJ2Fzc2VydCdcclxuICAnY2xlYXInXHJcbiAgJ2NvdW50J1xyXG4gICdkZWJ1ZydcclxuICAnZGlyJ1xyXG4gICdkaXJ4bWwnXHJcbiAgJ2Vycm9yJ1xyXG4gICdleGNlcHRpb24nXHJcbiAgJ2dyb3VwJ1xyXG4gICdncm91cENvbGxhcHNlZCdcclxuICAnZ3JvdXBFbmQnXHJcbiAgJ2luZm8nXHJcbiAgJ2xvZydcclxuICAnbWVtb3J5J1xyXG4gICdwcm9maWxlJ1xyXG4gICdwcm9maWxlRW5kJ1xyXG4gICd0YWJsZSdcclxuICAndGltZSdcclxuICAndGltZUVuZCdcclxuICAndGltZVN0YW1wJ1xyXG4gICd0aW1lbGluZSdcclxuICAndGltZWxpbmVFbmQnXHJcbiAgJ3RyYWNlJ1xyXG4gICd3YXJuJ1xyXG5dXHJcbm1ldGhvZExlbmd0aCA9IG1ldGhvZHMubGVuZ3RoXHJcbmNvbnNvbGUgPSBPSi5nbG9iYWwuY29uc29sZSBvciB7fVxyXG5PSi5tYWtlU3ViTmFtZVNwYWNlICdjb25zb2xlJ1xyXG4gIFxyXG4jIyNcclxuMS4gU3R1YiBvdXQgYW55IG1pc3NpbmcgbWV0aG9kcyB3aXRoIG5vb3BcclxuMi4gRGVmaW5lIHRoZSBhdmFpbGFibGUgbWV0aG9kcyBvbiB0aGUgT0ouY29uc29sZSBvYmplY3RcclxuIyMjXHJcbndoaWxlIG1ldGhvZExlbmd0aC0tXHJcbiAgKC0+XHJcbiAgICBtZXRob2QgPSBtZXRob2RzW21ldGhvZExlbmd0aF1cclxuICAgIFxyXG4gICAgIyBPbmx5IHN0dWIgdW5kZWZpbmVkIG1ldGhvZHMuXHJcbiAgICBjb25zb2xlW21ldGhvZF0gPSBPSi5ub29wIHVubGVzcyBjb25zb2xlW21ldGhvZF1cclxuICAgIFxyXG4gICAgI0RlZmluZSB0aGUgbWV0aG9kIG9uIHRoZSBPSiBjb25zb2xlIG5hbWVzcGFjZVxyXG4gICAgT0ouY29uc29sZS5yZWdpc3RlciBtZXRob2QsIChwYXJhbXMuLi4pIC0+XHJcbiAgICAgIGNvbnNvbGVbbWV0aG9kXSBwYXJhbXMuLi5cclxuICApKClcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY29uc29sZSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciAkLCBPSiwgYWxsLCBjb29raWVzLCBkZWwsIGRlbGV0ZUFsbCwgZ2V0LCBzZXQ7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxuXG4vKlxuU2V0dXAgc2V0dGluZ3NcbiQuY29va2llLnJhdyA9IHRydWVcbiQuY29va2llLmpzb24gPSB0cnVlXG4gIFxuU2V0dXAgZGVmYXVsdHNcbmh0dHBzOi8vZ2l0aHViLmNvbS9jYXJoYXJ0bC9qcXVlcnktY29va2llL1xuJC5jb29raWUuZGVmYXVsdHMuZXhwaXJlcyA9IDM2NVxuJC5jb29raWUuZGVmYXVsdHMucGF0aCA9ICcvJ1xuJC5jb29raWUuZGVmYXVsdHMuZG9tYWluID0gJ29qLmNvbSdcbiAqL1xuXG5pZiAoISQgfHwgISQuY29va2llKSB7XG4gIHRocm93IG5ldyBFcnJvcignalF1ZXJ5IENvb2tpZSBpcyBhIHJlcXVpcmVkIGRlcGVuZGVuY3kuJyk7XG59XG5cbiQuY29va2llLmRlZmF1bHRzLnNlY3VyZSA9IGZhbHNlO1xuXG5jb29raWVzID0ge307XG5cbmdldCA9IGZ1bmN0aW9uKGNvb2tpZU5hbWUsIHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgcmV0ID0gJyc7XG4gIGlmIChjb29raWVOYW1lKSB7XG4gICAgaWYgKHR5cGUpIHtcbiAgICAgIHJldCA9ICQuY29va2llKGNvb2tpZU5hbWUsIHR5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXQgPSAkLmNvb2tpZShjb29raWVOYW1lKTtcbiAgICB9XG4gICAgaWYgKHJldCkge1xuICAgICAgcmV0dXJuIGNvb2tpZXNbY29va2llTmFtZV0gPSByZXQ7XG4gICAgfVxuICB9XG59O1xuXG5hbGwgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHJldDtcbiAgcmV0ID0gJC5jb29raWUoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbnNldCA9IGZ1bmN0aW9uKGNvb2tpZU5hbWUsIHZhbHVlLCBvcHRzKSB7XG4gIHZhciByZXQ7XG4gIHJldCA9ICcnO1xuICBpZiAoY29va2llTmFtZSkge1xuICAgIGNvb2tpZXNbY29va2llTmFtZV0gPSB2YWx1ZTtcbiAgICBpZiAob3B0cykge1xuICAgICAgcmV0ID0gJC5jb29raWUoY29va2llTmFtZSwgdmFsdWUsIG9wdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXQgPSAkLmNvb2tpZShjb29raWVOYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG5kZWwgPSBmdW5jdGlvbihjb29raWVOYW1lLCBvcHRzKSB7XG4gIGlmIChjb29raWVOYW1lKSB7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgICQucmVtb3ZlQ29va2llKGNvb2tpZU5hbWUsIG9wdHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkLnJlbW92ZUNvb2tpZShjb29raWVOYW1lKTtcbiAgICB9XG4gICAgZGVsZXRlIGNvb2tpZXNbY29va2llTmFtZV07XG4gIH1cbn07XG5cbmRlbGV0ZUFsbCA9IGZ1bmN0aW9uKCkge1xuICBjb29raWVzID0ge307XG4gIE9KLmVhY2goT0ouY29va2llLmFsbCwgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICByZXR1cm4gT0ouY29va2llW1wiZGVsZXRlXCJdKGtleSk7XG4gIH0pO1xufTtcblxuT0ouY29va2llLnJlZ2lzdGVyKCdkZWxldGVBbGwnLCBkZWxldGVBbGwpO1xuXG5PSi5jb29raWUucmVnaXN0ZXIoJ2RlbGV0ZScsIGRlbCk7XG5cbk9KLmNvb2tpZS5yZWdpc3Rlcignc2V0Jywgc2V0KTtcblxuT0ouY29va2llLnJlZ2lzdGVyKCdnZXQnLCBnZXQpO1xuXG5PSi5jb29raWUucmVnaXN0ZXIoJ2FsbCcsIGFsbCk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkZWxldGVBbGw6IGRlbGV0ZUFsbCxcbiAgXCJkZWxldGVcIjogZGVsLFxuICBzZXQ6IHNldCxcbiAgZ2V0OiBnZXQsXG4gIGFsbDogYWxsXG59O1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeDBiMjlzYzF4Y1kyOXZhMmxsTG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPMEZCUVVFc1NVRkJRVHM3UVVGQlFTeEZRVUZCTEVkQlFVc3NUMEZCUVN4RFFVRlJMRTlCUVZJN08wRkJRMHdzUTBGQlFTeEhRVUZKTEU5QlFVRXNRMEZCVVN4UlFVRlNPenM3UVVGRlNqczdPenM3T3pzN096czdPMEZCVjBFc1NVRkJSeXhEUVVGSkxFTkJRVW9zU1VGQlV5eERRVUZKTEVOQlFVTXNRMEZCUXl4TlFVRnNRanRCUVVORkxGRkJRVlVzU1VGQlFTeExRVUZCTEVOQlFVMHNlVU5CUVU0c1JVRkVXanM3TzBGQlJVRXNRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQmJFSXNSMEZCTWtJN08wRkJSVE5DTEU5QlFVRXNSMEZCVlRzN1FVRkZWaXhIUVVGQkxFZEJRVTBzVTBGQlF5eFZRVUZFTEVWQlFXRXNTVUZCWWp0QlFVTktMRTFCUVVFN1JVRkJRU3hIUVVGQkxFZEJRVTA3UlVGRFRpeEpRVUZITEZWQlFVZzdTVUZEUlN4SlFVRkhMRWxCUVVnN1RVRkRSU3hIUVVGQkxFZEJRVTBzUTBGQlF5eERRVUZETEUxQlFVWXNRMEZCVXl4VlFVRlVMRVZCUVhGQ0xFbEJRWEpDTEVWQlJGSTdTMEZCUVN4TlFVRkJPMDFCUjBVc1IwRkJRU3hIUVVGTkxFTkJRVU1zUTBGQlF5eE5RVUZHTEVOQlFWTXNWVUZCVkN4RlFVaFNPenRKUVVsQkxFbEJRVWNzUjBGQlNEdGhRVU5GTEU5QlFWRXNRMEZCUVN4VlFVRkJMRU5CUVZJc1IwRkJjMElzU1VGRWVFSTdTMEZNUmpzN1FVRkdTVHM3UVVGVlRpeEhRVUZCTEVkQlFVMHNVMEZCUVR0QlFVTktMRTFCUVVFN1JVRkJRU3hIUVVGQkxFZEJRVTBzUTBGQlF5eERRVUZETEUxQlFVWXNRMEZCUVR0VFFVTk9PMEZCUmtrN08wRkJTVTRzUjBGQlFTeEhRVUZOTEZOQlFVTXNWVUZCUkN4RlFVRmhMRXRCUVdJc1JVRkJiMElzU1VGQmNFSTdRVUZEU2l4TlFVRkJPMFZCUVVFc1IwRkJRU3hIUVVGTk8wVkJRMDRzU1VGQlJ5eFZRVUZJTzBsQlEwVXNUMEZCVVN4RFFVRkJMRlZCUVVFc1EwRkJVaXhIUVVGelFqdEpRVU4wUWl4SlFVRkhMRWxCUVVnN1RVRkRSU3hIUVVGQkxFZEJRVTBzUTBGQlF5eERRVUZETEUxQlFVWXNRMEZCVXl4VlFVRlVMRVZCUVhGQ0xFdEJRWEpDTEVWQlFUUkNMRWxCUVRWQ0xFVkJSRkk3UzBGQlFTeE5RVUZCTzAxQlIwVXNSMEZCUVN4SFFVRk5MRU5CUVVNc1EwRkJReXhOUVVGR0xFTkJRVk1zVlVGQlZDeEZRVUZ4UWl4TFFVRnlRaXhGUVVoU08wdEJSa1k3TzFOQlRVRTdRVUZTU1RzN1FVRlZUaXhIUVVGQkxFZEJRVTBzVTBGQlF5eFZRVUZFTEVWQlFXRXNTVUZCWWp0RlFVTktMRWxCUVVjc1ZVRkJTRHRKUVVORkxFbEJRVWNzU1VGQlNEdE5RVU5GTEVOQlFVTXNRMEZCUXl4WlFVRkdMRU5CUVdVc1ZVRkJaaXhGUVVFeVFpeEpRVUV6UWl4RlFVUkdPMHRCUVVFc1RVRkJRVHROUVVkRkxFTkJRVU1zUTBGQlF5eFpRVUZHTEVOQlFXVXNWVUZCWml4RlFVaEdPenRKUVVsQkxFOUJRVThzVDBGQlVTeERRVUZCTEZWQlFVRXNSVUZNYWtJN08wRkJSRWs3TzBGQlUwNHNVMEZCUVN4SFFVRlpMRk5CUVVFN1JVRkRWaXhQUVVGQkxFZEJRVlU3UlVGRFZpeEZRVUZGTEVOQlFVTXNTVUZCU0N4RFFVRlJMRVZCUVVVc1EwRkJReXhOUVVGTkxFTkJRVU1zUjBGQmJFSXNSVUZCZFVJc1UwRkJReXhIUVVGRUxFVkJRVTBzUjBGQlRqdFhRVU55UWl4RlFVRkZMRU5CUVVNc1RVRkJUU3hEUVVGRExGRkJRVVFzUTBGQlZDeERRVUZwUWl4SFFVRnFRanRGUVVSeFFpeERRVUYyUWp0QlFVWlZPenRCUVUxWUxFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNVVUZCVml4RFFVRnRRaXhYUVVGdVFpeEZRVUZuUXl4VFFVRm9RenM3UVVGRFFTeEZRVUZGTEVOQlFVTXNUVUZCVFN4RFFVRkRMRkZCUVZZc1EwRkJiVUlzVVVGQmJrSXNSVUZCTmtJc1IwRkJOMEk3TzBGQlEwRXNSVUZCUlN4RFFVRkRMRTFCUVUwc1EwRkJReXhSUVVGV0xFTkJRVzFDTEV0QlFXNUNMRVZCUVRCQ0xFZEJRVEZDT3p0QlFVTkJMRVZCUVVVc1EwRkJReXhOUVVGTkxFTkJRVU1zVVVGQlZpeERRVUZ0UWl4TFFVRnVRaXhGUVVFd1FpeEhRVUV4UWpzN1FVRkRRU3hGUVVGRkxFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWWXNRMEZCYlVJc1MwRkJia0lzUlVGQk1rSXNSMEZCTTBJN08wRkJSVUVzVFVGQlRTeERRVUZETEU5QlFWQXNSMEZEUXp0RlFVRkJMRk5CUVVFc1JVRkJWeXhUUVVGWU8wVkJRMEVzVVVGQlFTeEZRVUZSTEVkQlJGSTdSVUZGUVN4SFFVRkJMRVZCUVVzc1IwRkdURHRGUVVkQkxFZEJRVUVzUlVGQlN5eEhRVWhNTzBWQlNVRXNSMEZCUVN4RlFVRk5MRWRCU2s0aUxDSm1hV3hsSWpvaVoyVnVaWEpoZEdWa0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJazlLSUQwZ2NtVnhkV2x5WlNBbkxpNHZiMm9uWEhKY2JpUWdQU0J5WlhGMWFYSmxJQ2RxY1hWbGNua25YSEpjYmlBZ1hISmNiaU1qSTF4eVhHNVRaWFIxY0NCelpYUjBhVzVuYzF4eVhHNGtMbU52YjJ0cFpTNXlZWGNnUFNCMGNuVmxYSEpjYmlRdVkyOXZhMmxsTG1wemIyNGdQU0IwY25WbFhISmNiaUFnWEhKY2JsTmxkSFZ3SUdSbFptRjFiSFJ6WEhKY2JtaDBkSEJ6T2k4dloybDBhSFZpTG1OdmJTOWpZWEpvWVhKMGJDOXFjWFZsY25rdFkyOXZhMmxsTDF4eVhHNGtMbU52YjJ0cFpTNWtaV1poZFd4MGN5NWxlSEJwY21WeklEMGdNelkxWEhKY2JpUXVZMjl2YTJsbExtUmxabUYxYkhSekxuQmhkR2dnUFNBbkx5ZGNjbHh1SkM1amIyOXJhV1V1WkdWbVlYVnNkSE11Wkc5dFlXbHVJRDBnSjI5cUxtTnZiU2RjY2x4dUl5TWpYSEpjYm1sbUlHNXZkQ0FrSUc5eUlHNXZkQ0FrTG1OdmIydHBaVnh5WEc0Z0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lBbmFsRjFaWEo1SUVOdmIydHBaU0JwY3lCaElISmxjWFZwY21Wa0lHUmxjR1Z1WkdWdVkza3VKeUFnWEhKY2JpUXVZMjl2YTJsbExtUmxabUYxYkhSekxuTmxZM1Z5WlNBOUlHWmhiSE5sWEhKY2JpQWdYSEpjYm1OdmIydHBaWE1nUFNCN2ZWeHlYRzRnSUZ4eVhHNW5aWFFnUFNBb1kyOXZhMmxsVG1GdFpTd2dkSGx3WlNrZ0xUNWNjbHh1SUNCeVpYUWdQU0FuSjF4eVhHNGdJR2xtSUdOdmIydHBaVTVoYldWY2NseHVJQ0FnSUdsbUlIUjVjR1ZjY2x4dUlDQWdJQ0FnY21WMElEMGdKQzVqYjI5cmFXVWdZMjl2YTJsbFRtRnRaU3dnZEhsd1pWeHlYRzRnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0J5WlhRZ1BTQWtMbU52YjJ0cFpTQmpiMjlyYVdWT1lXMWxJQ0FnSUZ4eVhHNGdJQ0FnYVdZZ2NtVjBYSEpjYmlBZ0lDQWdJR052YjJ0cFpYTmJZMjl2YTJsbFRtRnRaVjBnUFNCeVpYUmNjbHh1SUNCY2NseHVZV3hzSUQwZ0xUNWNjbHh1SUNCeVpYUWdQU0FrTG1OdmIydHBaU2dwWEhKY2JpQWdjbVYwWEhKY2JpQWdJQ0JjY2x4dWMyVjBJRDBnS0dOdmIydHBaVTVoYldVc0lIWmhiSFZsTENCdmNIUnpLU0F0UGx4eVhHNGdJSEpsZENBOUlDY25YSEpjYmlBZ2FXWWdZMjl2YTJsbFRtRnRaVnh5WEc0Z0lDQWdZMjl2YTJsbGMxdGpiMjlyYVdWT1lXMWxYU0E5SUhaaGJIVmxYSEpjYmlBZ0lDQnBaaUJ2Y0hSelhISmNiaUFnSUNBZ0lISmxkQ0E5SUNRdVkyOXZhMmxsSUdOdmIydHBaVTVoYldVc0lIWmhiSFZsTENCdmNIUnpYSEpjYmlBZ0lDQmxiSE5sWEhKY2JpQWdJQ0FnSUhKbGRDQTlJQ1F1WTI5dmEybGxJR052YjJ0cFpVNWhiV1VzSUhaaGJIVmxYSEpjYmlBZ2NtVjBJQ0JjY2x4dUlDQmNjbHh1WkdWc0lEMGdLR052YjJ0cFpVNWhiV1VzSUc5d2RITXBJQzArWEhKY2JpQWdhV1lnWTI5dmEybGxUbUZ0WlZ4eVhHNGdJQ0FnYVdZZ2IzQjBjMXh5WEc0Z0lDQWdJQ0FrTG5KbGJXOTJaVU52YjJ0cFpTQmpiMjlyYVdWT1lXMWxMQ0J2Y0hSelhISmNiaUFnSUNCbGJITmxYSEpjYmlBZ0lDQWdJQ1F1Y21WdGIzWmxRMjl2YTJsbElHTnZiMnRwWlU1aGJXVWdJQ0FnWEhKY2JpQWdJQ0JrWld4bGRHVWdZMjl2YTJsbGMxdGpiMjlyYVdWT1lXMWxYVnh5WEc0Z0lISmxkSFZ5Ymx4eVhHNGdJQ0FnWEhKY2JtUmxiR1YwWlVGc2JDQTlJQzArWEhKY2JpQWdZMjl2YTJsbGN5QTlJSHQ5WEhKY2JpQWdUMG91WldGamFDQlBTaTVqYjI5cmFXVXVZV3hzTENBb2RtRnNMQ0JyWlhrcElDMCtYSEpjYmlBZ0lDQlBTaTVqYjI5cmFXVXVaR1ZzWlhSbElHdGxlU0FnWEhKY2JpQWdjbVYwZFhKdVhISmNiaUFnSUNCY2NseHVJRTlLTG1OdmIydHBaUzV5WldkcGMzUmxjaUFuWkdWc1pYUmxRV3hzSnl3Z1pHVnNaWFJsUVd4c1hISmNiaUJQU2k1amIyOXJhV1V1Y21WbmFYTjBaWElnSjJSbGJHVjBaU2NzSUdSbGJGeHlYRzRnVDBvdVkyOXZhMmxsTG5KbFoybHpkR1Z5SUNkelpYUW5MQ0J6WlhSY2NseHVJRTlLTG1OdmIydHBaUzV5WldkcGMzUmxjaUFuWjJWMEp5d2daMlYwWEhKY2JpQlBTaTVqYjI5cmFXVXVjbVZuYVhOMFpYSWdKMkZzYkNjc0lDQmhiR3hjY2x4dUlGeHlYRzRnYlc5a2RXeGxMbVY0Y0c5eWRITWdQU0JjY2x4dUlDQmtaV3hsZEdWQmJHdzZJR1JsYkdWMFpVRnNiRnh5WEc0Z0lHUmxiR1YwWlRvZ1pHVnNYSEpjYmlBZ2MyVjBPaUJ6WlhSY2NseHVJQ0JuWlhRNklHZGxkRnh5WEc0Z0lHRnNiRG9nSUdGc2JDSmRmUT09IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuZGVmZXIgPSAobWV0aG9kLCB3YWl0TXMpIC0+XHJcbiAgaWYgd2FpdE1zIGFuZCBzZXRUaW1lb3V0XHJcbiAgICBzZXRUaW1lb3V0IG1ldGhvZCwgd2FpdE1zXHJcbiAgKG5ldyBQcm9taXNlIChyZXNvbHZlKSAtPlxyXG4gICAgcmVzb2x2ZSgpKS50aGVuIG1ldGhvZFxyXG4gIFxyXG5PSi5yZWdpc3RlciAnZGVmZXInLCBkZWZlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmVyIiwiIyAjIGVhY2hcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jICMjIGNhbkVhY2hcclxuY2FuRWFjaCA9IChvYmopIC0+XHJcbiAgIyBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IFtpc10oaXMuaHRtbCkgdHJ1bHkgaXRlcmFibGUgKGUuZy4gYW4gaW5zdGFuY2Ugb2YgT2JqZWN0IG9yIEFycmF5KVxyXG4gIE9KLmlzLnBsYWluT2JqZWN0KG9iaikgb3IgT0ouaXMub2JqZWN0KG9iaikgb3IgT0ouaXMuYXJyYXkgb2JqXHJcblxyXG4jICMjIFtPSl0ob2ouaHRtbCkuZWFjaFxyXG5cclxuIyBJdGVyYXRlIGFsbCBvZiB0aGUgbWVtYmVycyBvZiBhbiBvYmplY3QgKG9yIGFuIGFycmF5KSB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGFuZCByZWN1cnNpb24uXHJcblxyXG4jIC0gYG9iamA6IHRoZSBvYmplY3QgdG8gaXRlcmF0ZSxcclxuIyAtIGBvbkVhY2hgOiBhIGNhbGxiYWNrIHRvIGV4ZWN1dGUgZm9yIGVhY2ggaXRlcmF0aW9uLFxyXG4jIC0gYHJlY3Vyc2l2ZWA6IGlmIHRydWUsIHJlY3Vyc2l2ZWx5IGl0ZXJhdGUgYWxsIHZhbGlkIGNoaWxkIG9iamVjdHMuXHJcbmVhY2ggPSAob2JqLCBvbkVhY2gsIHJlY3Vyc2l2ZSkgLT5cclxuICBpZiBjYW5FYWNoIG9ialxyXG4gICAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNmb3Jvd24pJ3MgYGZvck93bmAgbWV0aG9kIHRvIGVuc3VyZSB0aGF0IG9ubHkgdGhlIGFjdHVhbCBwcm9wZXJ0aWVzIG9mIHRoZSBvYmplY3QgYXJlIGVudW1lcmF0ZWQuXHJcblxyXG4gICAgIyAtIGBvbkVhY2hgIGNhbGxiYWNrIHdpbGwgcmVjZWl2ZSAyIHBhcmFtZXRlcnM6XHJcbiAgICAjIC0gYHZhbGAgYW5kIGBrZXlgLlxyXG4gICAgIyAtIGB2YWxgIGlzIGFsd2F5cyB0aGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5LlxyXG4gICAgIyAtIGBrZXlgIGlzIGVpdGhlciB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb3IgdGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIGFycmF5LlxyXG4gICAgXy5mb3JPd24gb2JqLCAodmFsLCBrZXkpIC0+XHJcbiAgICAgIGlmIG9uRWFjaCBhbmQgKHZhbCBvciBrZXkpXHJcbiAgICAgICAgcXVpdCA9IG9uRWFjaCB2YWwsIGtleVxyXG4gICAgICAgIHJldHVybiBmYWxzZSAgaWYgZmFsc2UgaXMgcXVpdFxyXG4gICAgICBlYWNoIHZhbCwgb25FYWNoLCB0cnVlICBpZiB0cnVlIGlzIHJlY3Vyc2l2ZVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgcmV0dXJuXHJcblxyXG4jICMjIHJlZ2lzdGVyXHJcblxyXG4jIHJlZ2lzdGVyIHRoZSBgZWFjaGAgbWV0aG9kIG9uIHRoZSBbT0pdKE9KLmh0bWwpIG5hbWVzcGFjZVxyXG5PSi5yZWdpc3RlciAnZWFjaCcsIGVhY2hcclxubW9kdWxlLmV4cG9ydHMgPSBlYWNoIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxudW5rbm93biA9ICd1bmtub3duJyAgIFxyXG4gIFxyXG5pbnB1dFR5cGVzID1cclxuICBidXR0b246ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMFxyXG4gICAgbmFtZTogJ2J1dHRvbidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgY2hlY2tib3g6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMVxyXG4gICAgbmFtZTogJ2NoZWNrYm94J1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGNvbG9yOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDJcclxuICAgIG5hbWU6ICdjb2xvcidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBkYXRlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDNcclxuICAgIG5hbWU6ICdkYXRlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgZGF0ZXRpbWU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogNFxyXG4gICAgbmFtZTogJ2RhdGV0aW1lJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICdkYXRldGltZS1sb2NhbCc6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogNVxyXG4gICAgbmFtZTogJ2RhdGV0aW1lLWxvY2FsJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgZW1haWw6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogNlxyXG4gICAgbmFtZTogJ2VtYWlsJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBmaWxlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDdcclxuICAgIG5hbWU6ICdmaWxlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IGZhbHNlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgaGlkZGVuOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDhcclxuICAgIG5hbWU6ICdoaWRkZW4nXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGltYWdlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDlcclxuICAgIG5hbWU6ICdpbWFnZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgbW9udGg6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTBcclxuICAgIG5hbWU6ICdtb250aCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgbnVtYmVyOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDExXHJcbiAgICBuYW1lOiAnbnVtYmVyJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHBhc3N3b3JkOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDEyXHJcbiAgICBuYW1lOiAncGFzc3dvcmQnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICByYWRpbzogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxM1xyXG4gICAgbmFtZTogJ3JhZGlvJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHJhbmdlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE0XHJcbiAgICBuYW1lOiAncmFuZ2UnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcmVzZXQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTVcclxuICAgIG5hbWU6ICdyZXNldCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgc2VhcmNoOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE2XHJcbiAgICBuYW1lOiAnc2VhcmNoJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgc3VibWl0OiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE3XHJcbiAgICBuYW1lOiAnc3VibWl0J1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB0ZWw6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMThcclxuICAgIG5hbWU6ICdidXR0b24nXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB0ZXh0OiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE5XHJcbiAgICBuYW1lOiAndGV4dCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgdGltZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMFxyXG4gICAgbmFtZTogJ3RpbWUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB1cmw6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMjFcclxuICAgIG5hbWU6ICd1cmwnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHdlZWs6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMjJcclxuICAgIG5hbWU6ICd3ZWVrJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuT0ouZW51bXMucmVnaXN0ZXIgJ3Vua25vd24nLCB1bmtub3duXHJcbk9KLmVudW1zLnJlZ2lzdGVyICdpbnB1dFR5cGVzJywgaW5wdXRUeXBlc1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBcclxuICB1bmtub3duOiB1bmtub3duXHJcbiAgaW5wdXRUeXBlczogaW5wdXRUeXBlcyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG5pZiBPSi5nbG9iYWwuYWRkRXZlbnRMaXN0ZW5lclxyXG4gIGV2ZW50TmFtZSA9ICdhZGRFdmVudExpc3RlbmVyJ1xyXG4gIGV2ZW50SW5mbyA9ICcnXHJcbmVsc2UgXHJcbiAgZXZlbnROYW1lID0gJ2F0dGFjaEV2ZW50J1xyXG4gIGV2ZW50SW5mbyA9ICdvbidcclxuICBcclxucHVzaFN0YXRlID0gKHBhZ2VOYW1lLCBldmVudCkgLT5cclxuICBpZiBwYWdlTmFtZVxyXG4gICAgIyBrZWVwIHRoZSBsaW5rIGluIHRoZSBicm93c2VyIGhpc3RvcnlcclxuICAgIGhpc3RvcnkucHVzaFN0YXRlIG51bGwsIG51bGwsICcjJyArIHBhZ2VOYW1lXHJcbiAgICAgIFxyXG4gICAgIyBoZXJlIGNhbiBjYXVzZSBkYXRhIGxvYWRpbmcsIGV0Yy5cclxuICAgIFxyXG4gICAgaWYgZXZlbnQgICAgXHJcbiAgICAgICMgZG8gbm90IGdpdmUgYSBkZWZhdWx0IGFjdGlvblxyXG4gICAgICBpZiBldmVudC5wcmV2ZW50RGVmYXVsdFxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2VcclxuICBmYWxzZVxyXG4gIFxyXG5yZXN0b3JlU3RhdGUgPSAobG9jYXRpb24pIC0+XHJcbiAgcGFnZU5hbWUgPSBsb2NhdGlvbi5oYXNoXHJcbiAgaWYgbm90IHBhZ2VOYW1lXHJcbiAgICBwYWdlTmFtZSA9IGxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVsxXVxyXG4gIGlmIHBhZ2VOYW1lXHJcbiAgICBwYWdlTmFtZSA9IHBhZ2VOYW1lLnJlcGxhY2UgJyMnLCAnJ1xyXG4gICAgT0oucHVibGlzaCAncmVzdG9yZVN0YXRlJywgcGFnZU5hbWU6IHBhZ2VOYW1lLCBsb2NhdGlvbjogbG9jYXRpb25cclxuICByZXR1cm5cclxuICBcclxuIyMjIFxyXG5oYW5nIG9uIHRoZSBldmVudCwgYWxsIHJlZmVyZW5jZXMgaW4gdGhpcyBkb2N1bWVudFxyXG4jIyNcclxuICBcclxuIyMjXHJcbiMgVGhpcyBiaW5kcyB0byB0aGUgZG9jdW1lbnQgY2xpY2sgZXZlbnQsIHdoaWNoIGluIHR1cm4gYXR0YWNoZXMgdG8gZXZlcnkgY2xpY2sgZXZlbnQsIGNhdXNpbmcgdW5leHBlY3RlZCBiZWhhdmlvci5cclxuIyBGb3IgYW55IGNvbnRyb2wgd2hpY2ggd2lzaGVzIHRvIHRyaWdnZXIgYSBzdGF0ZSBjaGFuZ2UgaW4gcmVzcG9uc2UgdG8gYW4gZXZlbnQsIGl0IGlzIGJldHRlciBmb3IgdGhhdCBjb250cm9sIHRvIGRlZmluZSB0aGUgYmVoYXZpb3IuXHJcbk9KLmRvY3VtZW50W2V2ZW50TmFtZV0gZXZlbnRJbmZvICsgJ2NsaWNrJywgKChldmVudCkgLT5cclxuICBldmVudCA9IGV2ZW50IG9yIHdpbmRvdy5ldmVudFxyXG4gIHRhcmdldCA9IGV2ZW50LnRhcmdldCBvciBldmVudC5zcmNFbGVtZW50XHJcbiAgICBcclxuICAjIGxvb2tpbmcgZm9yIGFsbCB0aGUgbGlua3Mgd2l0aCAnYWpheCcgY2xhc3MgZm91bmRcclxuICBpZiB0YXJnZXQgYW5kIHRhcmdldC5ub2RlTmFtZSBpcyAnQScgYW5kICgnICcgKyB0YXJnZXQuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCdhamF4JykgPj0gMFxyXG4gICAgT0oucHVzaFN0YXRlIHRhcmdldC5ocmVmLCBldmVudFxyXG4gICAgICBcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuKSwgZmFsc2VcclxuIyMjXHJcblxyXG4jIyNcclxuaGFuZyBvbiBwb3BzdGF0ZSBldmVudCB0cmlnZ2VyZWQgYnkgcHJlc3NpbmcgYmFjay9mb3J3YXJkIGluIGJyb3dzZXJcclxuIyMjXHJcbk9KLmdsb2JhbFtldmVudE5hbWVdIGV2ZW50SW5mbyArICdwb3BzdGF0ZScsICgoZXZlbnQpIC0+XHJcbiAgICBcclxuICAjIHdlIGdldCBhIG5vcm1hbCBMb2NhdGlvbiBvYmplY3RcclxuICAgIFxyXG4gICMjI1xyXG4gIE5vdGUsIHRoaXMgaXMgdGhlIG9ubHkgZGlmZmVyZW5jZSB3aGVuIHVzaW5nIHRoaXMgbGlicmFyeSxcclxuICBiZWNhdXNlIHRoZSBvYmplY3QgZG9jdW1lbnQubG9jYXRpb24gY2Fubm90IGJlIG92ZXJyaWRlbixcclxuICBzbyBsaWJyYXJ5IHRoZSByZXR1cm5zIGdlbmVyYXRlZCAnbG9jYXRpb24nIG9iamVjdCB3aXRoaW5cclxuICBhbiBvYmplY3Qgd2luZG93Lmhpc3RvcnksIHNvIGdldCBpdCBvdXQgb2YgJ2hpc3RvcnkubG9jYXRpb24nLlxyXG4gIEZvciBicm93c2VycyBzdXBwb3J0aW5nICdoaXN0b3J5LnB1c2hTdGF0ZScgZ2V0IGdlbmVyYXRlZFxyXG4gIG9iamVjdCAnbG9jYXRpb24nIHdpdGggdGhlIHVzdWFsICdkb2N1bWVudC5sb2NhdGlvbicuXHJcbiAgIyMjICAgICAgICAgICAgICAgICAgICAgXHJcbiAgcmV0dXJuTG9jYXRpb24gPSBoaXN0b3J5LmxvY2F0aW9uIG9yIGRvY3VtZW50LmxvY2F0aW9uXHJcbiAgICBcclxuICAjIyNcclxuICBoZXJlIGNhbiBjYXVzZSBkYXRhIGxvYWRpbmcsIGV0Yy5cclxuICAjIyNcclxuICBPSi5oaXN0b3J5LnJlc3RvcmVTdGF0ZSByZXR1cm5Mb2NhdGlvblxyXG4gICAgXHJcbiAgcmV0dXJuXHJcbiksIGZhbHNlIFxyXG4gIFxyXG4gXHJcbk9KLmhpc3RvcnkucmVnaXN0ZXIgJ3Jlc3RvcmVTdGF0ZScsIHJlc3RvcmVTdGF0ZVxyXG5PSi5oaXN0b3J5LnJlZ2lzdGVyICdwdXNoU3RhdGUnLCBwdXNoU3RhdGVcclxuIFxyXG5tb2R1bGUuZXhwb3J0cyA9IFxyXG4gIHJlc3RvcmVTdGF0ZTogcmVzdG9yZVN0YXRlXHJcbiAgcHVzaFN0YXRlOiBwdXNoU3RhdGVcclxuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyICQsIElTLCBPSiwgXztcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG4kID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5JUyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gSVMoKSB7fVxuXG4gIElTLmJvb2wgPSBmdW5jdGlvbihib29sZWFuKSB7XG4gICAgcmV0dXJuIF8uaXNCb29sZWFuKGJvb2xlYW4pO1xuICB9O1xuXG4gIElTLmFycmF5TnVsbE9yRW1wdHkgPSBmdW5jdGlvbihhcnIpIHtcbiAgICByZXR1cm4gXy5pc0VtcHR5KGFycik7XG4gIH07XG5cbiAgSVMuc3RyaW5nTnVsbE9yRW1wdHkgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gc3RyICYmICghc3RyLmxlbmd0aCB8fCBzdHIubGVuZ3RoID09PSAwIHx8ICFzdHIudHJpbSB8fCAhc3RyLnRyaW0oKSk7XG4gIH07XG5cbiAgSVMubnVtYmVyTnVsbE9yRW1wdHkgPSBmdW5jdGlvbihudW0pIHtcbiAgICByZXR1cm4gIW51bSB8fCBpc05hTihudW0pIHx8ICFudW0udG9QcmVjaXNpb247XG4gIH07XG5cbiAgSVMuZGF0ZU51bGxPckVtcHR5ID0gZnVuY3Rpb24oZHQpIHtcbiAgICByZXR1cm4gIWR0IHx8ICFkdC5nZXRUaW1lO1xuICB9O1xuXG4gIElTLm9iamVjdE51bGxPckVtcHR5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNFbXB0eShvYmogfHwgIU9iamVjdC5rZXlzKG9iaikgfHwgT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDApO1xuICB9O1xuXG4gIElTLnBsYWluT2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNQbGFpbk9iamVjdChvYmopO1xuICB9O1xuXG4gIElTLm9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzT2JqZWN0KG9iaik7XG4gIH07XG5cbiAgSVMuZGF0ZSA9IGZ1bmN0aW9uKGR0KSB7XG4gICAgcmV0dXJuIF8uaXNEYXRlKGR0KTtcbiAgfTtcblxuXG4gIC8qXG4gIERldGVybWluZXMgaWYgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiBhIE51bWJlciBhbmQgbm90IE5hTipcbiAgICovXG5cbiAgSVMubnVtYmVyID0gZnVuY3Rpb24obnVtKSB7XG4gICAgdmFyIG51bWJlcjtcbiAgICBudW1iZXIgPSByZXF1aXJlKCcuLi9jb3JlL251bWJlcicpO1xuICAgIHJldHVybiB0eXBlb2YgbnVtID09PSAnbnVtYmVyJyAmJiBmYWxzZSA9PT0gKG51bWJlci5pc05hTihudW0pIHx8IGZhbHNlID09PSBudW1iZXIuaXNGaW5pdGUobnVtKSB8fCBudW1iZXIuTUFYX1ZBTFVFID09PSBudW0gfHwgbnVtYmVyLk1JTl9WQUxVRSA9PT0gbnVtKTtcbiAgfTtcblxuXG4gIC8qXG4gIERldGVybWluZXMgaWYgYSB2YWx1ZSBpcyBjb252ZXJ0aWJsZSB0byBhIE51bWJlclxuICAgKi9cblxuICBJUy5udW1lcmljID0gZnVuY3Rpb24obnVtKSB7XG4gICAgdmFyIG51TnVtLCByZXQsIHRvO1xuICAgIHJldCA9IHRoaXMubnVtYmVyKG51bSk7XG4gICAgaWYgKCFyZXQpIHtcbiAgICAgIHRvID0gcmVxdWlyZSgnLi90bycpO1xuICAgICAgbnVOdW0gPSB0by5udW1iZXIobnVtKTtcbiAgICAgIHJldCA9IHRoaXMubnVtYmVyKG51TnVtKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBJUy5lbGVtZW50SW5Eb20gPSBmdW5jdGlvbihlbGVtZW50SWQpIHtcbiAgICByZXR1cm4gZmFsc2UgPT09IHRoaXMubnVsbE9yRW1wdHkoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKSk7XG4gIH07XG5cbiAgSVMuYXJyYXkgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc0FycmF5KG9iaik7XG4gIH07XG5cbiAgSVMuc3RyaW5nID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIF8uaXNTdHJpbmcoc3RyKTtcbiAgfTtcblxuICBJU1tcInRydWVcIl0gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB0cnVlIHx8IG9iaiA9PT0gJ3RydWUnIHx8IG9iaiA9PT0gMSB8fCBvYmogPT09ICcxJztcbiAgfTtcblxuICBJU1tcImZhbHNlXCJdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gZmFsc2UgfHwgb2JqID09PSAnZmFsc2UnIHx8IG9iaiA9PT0gMCB8fCBvYmogPT09ICcwJztcbiAgfTtcblxuICBJUy50cnVlT3JGYWxzZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiB0aGlzW1widHJ1ZVwiXShvYmogfHwgdGhpc1tcImZhbHNlXCJdKG9iaikpO1xuICB9O1xuXG4gIElTLm51bGxPckVtcHR5ID0gZnVuY3Rpb24ob2JqLCBjaGVja0xlbmd0aCkge1xuICAgIHJldHVybiBfLmlzRW1wdHkob2JqKSB8fCBfLmlzVW5kZWZpbmVkKG9iaikgfHwgXy5pc051bGwob2JqKSB8fCBfLmlzTmFOKG9iaik7XG4gIH07XG5cbiAgSVMubnVsbE9yVW5kZWZpbmVkID0gZnVuY3Rpb24ob2JqLCBjaGVja0xlbmd0aCkge1xuICAgIHJldHVybiBfLmlzVW5kZWZpbmVkKG9iaikgfHwgXy5pc051bGwob2JqKSB8fCBfLmlzTmFOKG9iaik7XG4gIH07XG5cbiAgSVNbXCJpbnN0YW5jZW9mXCJdID0gZnVuY3Rpb24obmFtZSwgb2JqKSB7XG4gICAgcmV0dXJuIG9iai50eXBlID09PSBuYW1lIHx8IG9iaiBpbnN0YW5jZW9mIG5hbWU7XG4gIH07XG5cbiAgSVMubWV0aG9kID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAhPT0gT0oubm9vcCAmJiBfLmlzRnVuY3Rpb24ob2JqKTtcbiAgfTtcblxuXG4gIC8qXG4gIERlcHJlY2F0ZWQuIExlZnQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LiBVc2UgaXMubWV0aG9kIGluc3RlYWQuXG4gICAqL1xuXG4gIElTLmZ1bmMgPSBJUy5tZXRob2Q7XG5cbiAgcmV0dXJuIElTO1xuXG59KSgpO1xuXG5PSi5yZWdpc3RlcignaXMnLCBJUyk7XG5cbm1vZHVsZS5leHBvcnRzID0gSVM7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4MGIyOXNjMXhjYVhNdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFTeEpRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlEwb3NRMEZCUVN4SFFVRkpMRTlCUVVFc1EwRkJVU3hSUVVGU096dEJRVVZGT3pzN1JVRkZTaXhGUVVGRExFTkJRVUVzU1VGQlJDeEhRVUZQTEZOQlFVTXNUMEZCUkR0WFFVTk1MRU5CUVVNc1EwRkJReXhUUVVGR0xFTkJRVmtzVDBGQldqdEZRVVJMT3p0RlFVZFFMRVZCUVVNc1EwRkJRU3huUWtGQlJDeEhRVUZ0UWl4VFFVRkRMRWRCUVVRN1YwRkRha0lzUTBGQlF5eERRVUZETEU5QlFVWXNRMEZCVlN4SFFVRldPMFZCUkdsQ096dEZRVWR1UWl4RlFVRkRMRU5CUVVFc2FVSkJRVVFzUjBGQmIwSXNVMEZCUXl4SFFVRkVPMWRCUTJ4Q0xFZEJRVUVzU1VGQlVTeERRVUZETEVOQlFVa3NSMEZCUnl4RFFVRkRMRTFCUVZJc1NVRkJhMElzUjBGQlJ5eERRVUZETEUxQlFVb3NTMEZCWXl4RFFVRm9ReXhKUVVGeFF5eERRVUZKTEVkQlFVY3NRMEZCUXl4SlFVRTNReXhKUVVGeFJDeERRVUZKTEVkQlFVY3NRMEZCUXl4SlFVRktMRU5CUVVFc1EwRkJNVVE3UlVGRVZUczdSVUZIY0VJc1JVRkJReXhEUVVGQkxHbENRVUZFTEVkQlFXOUNMRk5CUVVNc1IwRkJSRHRYUVVOc1FpeERRVUZKTEVkQlFVb3NTVUZCVnl4TFFVRkJMRU5CUVUwc1IwRkJUaXhEUVVGWUxFbEJRWGxDTEVOQlFVa3NSMEZCUnl4RFFVRkRPMFZCUkdZN08wVkJSM0JDTEVWQlFVTXNRMEZCUVN4bFFVRkVMRWRCUVd0Q0xGTkJRVU1zUlVGQlJEdFhRVU5vUWl4RFFVRkpMRVZCUVVvc1NVRkJWU3hEUVVGSkxFVkJRVVVzUTBGQlF6dEZRVVJFT3p0RlFVZHNRaXhGUVVGRExFTkJRVUVzYVVKQlFVUXNSMEZCYjBJc1UwRkJReXhIUVVGRU8xZEJRMnhDTEVOQlFVTXNRMEZCUXl4UFFVRkdMRU5CUVZVc1IwRkJRU3hKUVVGUExFTkJRVWtzVFVGQlRTeERRVUZETEVsQlFWQXNRMEZCV1N4SFFVRmFMRU5CUVZnc1NVRkJLMElzVFVGQlRTeERRVUZETEVsQlFWQXNRMEZCV1N4SFFVRmFMRU5CUVdkQ0xFTkJRVU1zVFVGQmFrSXNTMEZCTWtJc1EwRkJjRVU3UlVGRWEwSTdPMFZCUjNCQ0xFVkJRVU1zUTBGQlFTeFhRVUZFTEVkQlFXTXNVMEZCUXl4SFFVRkVPMWRCUTFvc1EwRkJReXhEUVVGRExHRkJRVVlzUTBGQlowSXNSMEZCYUVJN1JVRkVXVHM3UlVGSFpDeEZRVUZETEVOQlFVRXNUVUZCUkN4SFFVRlRMRk5CUVVNc1IwRkJSRHRYUVVOUUxFTkJRVU1zUTBGQlF5eFJRVUZHTEVOQlFWY3NSMEZCV0R0RlFVUlBPenRGUVVkVUxFVkJRVU1zUTBGQlFTeEpRVUZFTEVkQlFVOHNVMEZCUXl4RlFVRkVPMWRCUTB3c1EwRkJReXhEUVVGRExFMUJRVVlzUTBGQlV5eEZRVUZVTzBWQlJFczdPenRCUVVsUU96czdPMFZCUjBFc1JVRkJReXhEUVVGQkxFMUJRVVFzUjBGQlV5eFRRVUZETEVkQlFVUTdRVUZEVUN4UlFVRkJPMGxCUVVFc1RVRkJRU3hIUVVGVExFOUJRVUVzUTBGQlVTeG5Ra0ZCVWp0WFFVTlVMRTlCUVU4c1IwRkJVQ3hMUVVGakxGRkJRV1FzU1VGQk1rSXNTMEZCUVN4TFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRExFdEJRVkFzUTBGQllTeEhRVUZpTEVOQlFVRXNTVUZCY1VJc1MwRkJRU3hMUVVGVExFMUJRVTBzUTBGQlF5eFJRVUZRTEVOQlFXZENMRWRCUVdoQ0xFTkJRVGxDTEVsQlFYTkVMRTFCUVUwc1EwRkJReXhUUVVGUUxFdEJRVzlDTEVkQlFURkZMRWxCUVdsR0xFMUJRVTBzUTBGQlF5eFRRVUZRTEV0QlFXOUNMRWRCUVhSSE8wVkJSamRDT3pzN1FVRkpWRHM3T3p0RlFVZEJMRVZCUVVNc1EwRkJRU3hQUVVGRUxFZEJRVlVzVTBGQlF5eEhRVUZFTzBGQlExSXNVVUZCUVR0SlFVRkJMRWRCUVVFc1IwRkJUU3hKUVVGRExFTkJRVUVzVFVGQlJDeERRVUZSTEVkQlFWSTdTVUZEVGl4SlFVRkJMRU5CUVU4c1IwRkJVRHROUVVORkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUVUZCVWp0TlFVTk1MRXRCUVVFc1IwRkJVU3hGUVVGRkxFTkJRVU1zVFVGQlNDeERRVUZWTEVkQlFWWTdUVUZEVWl4SFFVRkJMRWRCUVUwc1NVRkJReXhEUVVGQkxFMUJRVVFzUTBGQlVTeExRVUZTTEVWQlNGSTdPMWRCU1VFN1JVRk9VVHM3UlVGUlZpeEZRVUZETEVOQlFVRXNXVUZCUkN4SFFVRmxMRk5CUVVNc1UwRkJSRHRYUVVOaUxFdEJRVUVzUzBGQlV5eEpRVUZETEVOQlFVRXNWMEZCUkN4RFFVRmhMRkZCUVZFc1EwRkJReXhqUVVGVUxFTkJRWGRDTEZOQlFYaENMRU5CUVdJN1JVRkVTVHM3UlVGSFppeEZRVUZETEVOQlFVRXNTMEZCUkN4SFFVRlJMRk5CUVVNc1IwRkJSRHRYUVVOT0xFTkJRVU1zUTBGQlF5eFBRVUZHTEVOQlFWVXNSMEZCVmp0RlFVUk5PenRGUVVkU0xFVkJRVU1zUTBGQlFTeE5RVUZFTEVkQlFWTXNVMEZCUXl4SFFVRkVPMWRCUTFBc1EwRkJReXhEUVVGRExGRkJRVVlzUTBGQlZ5eEhRVUZZTzBWQlJFODdPMFZCUjFRc1JVRkJReXhEUVVGQkxFMUJRVUVzUTBGQlJDeEhRVUZQTEZOQlFVTXNSMEZCUkR0WFFVTk1MRWRCUVVFc1MwRkJUeXhKUVVGUUxFbEJRV1VzUjBGQlFTeExRVUZQTEUxQlFYUkNMRWxCUVdkRExFZEJRVUVzUzBGQlR5eERRVUYyUXl4SlFVRTBReXhIUVVGQkxFdEJRVTg3UlVGRU9VTTdPMFZCUjFBc1JVRkJReXhEUVVGQkxFOUJRVUVzUTBGQlJDeEhRVUZSTEZOQlFVTXNSMEZCUkR0WFFVTk9MRWRCUVVFc1MwRkJUeXhMUVVGUUxFbEJRV2RDTEVkQlFVRXNTMEZCVHl4UFFVRjJRaXhKUVVGclF5eEhRVUZCTEV0QlFVOHNRMEZCZWtNc1NVRkJPRU1zUjBGQlFTeExRVUZQTzBWQlJDOURPenRGUVVkU0xFVkJRVU1zUTBGQlFTeFhRVUZFTEVkQlFXTXNVMEZCUXl4SFFVRkVPMWRCUTFvc1NVRkJReXhEUVVGQkxFMUJRVUVzUTBGQlJDeERRVUZOTEVkQlFVRXNTVUZCVHl4SlFVRkRMRU5CUVVFc1QwRkJRU3hEUVVGRUxFTkJRVThzUjBGQlVDeERRVUZpTzBWQlJGazdPMFZCUjJRc1JVRkJReXhEUVVGQkxGZEJRVVFzUjBGQll5eFRRVUZETEVkQlFVUXNSVUZCVFN4WFFVRk9PMWRCUTFvc1EwRkJReXhEUVVGRExFOUJRVVlzUTBGQlZTeEhRVUZXTEVOQlFVRXNTVUZCYTBJc1EwRkJReXhEUVVGRExGZEJRVVlzUTBGQll5eEhRVUZrTEVOQlFXeENMRWxCUVhkRExFTkJRVU1zUTBGQlF5eE5RVUZHTEVOQlFWTXNSMEZCVkN4RFFVRjRReXhKUVVGNVJDeERRVUZETEVOQlFVTXNTMEZCUml4RFFVRlJMRWRCUVZJN1JVRkVOME03TzBWQlIyUXNSVUZCUXl4RFFVRkJMR1ZCUVVRc1IwRkJhMElzVTBGQlF5eEhRVUZFTEVWQlFVMHNWMEZCVGp0WFFVTm9RaXhEUVVGRExFTkJRVU1zVjBGQlJpeERRVUZqTEVkQlFXUXNRMEZCUVN4SlFVRnpRaXhEUVVGRExFTkJRVU1zVFVGQlJpeERRVUZUTEVkQlFWUXNRMEZCZEVJc1NVRkJkVU1zUTBGQlF5eERRVUZETEV0QlFVWXNRMEZCVVN4SFFVRlNPMFZCUkhaQ096dEZRVWRzUWl4RlFVRkRMRU5CUVVFc1dVRkJRU3hEUVVGRUxFZEJRV0VzVTBGQlF5eEpRVUZFTEVWQlFVOHNSMEZCVUR0WFFVTllMRWRCUVVjc1EwRkJReXhKUVVGS0xFdEJRVmtzU1VGQldpeEpRVUZ2UWl4SFFVRkJMRmxCUVdVN1JVRkVlRUk3TzBWQlIySXNSVUZCUXl4RFFVRkJMRTFCUVVRc1IwRkJVeXhUUVVGRExFZEJRVVE3VjBGRFVDeEhRVUZCTEV0QlFWTXNSVUZCUlN4RFFVRkRMRWxCUVZvc1NVRkJjVUlzUTBGQlF5eERRVUZETEZWQlFVWXNRMEZCWVN4SFFVRmlPMFZCUkdRN096dEJRVWRVT3pzN08wVkJSMEVzUlVGQlF5eERRVUZCTEVsQlFVUXNSMEZCVVN4RlFVRkRMRU5CUVVFN096czdPenRCUVVsWUxFVkJRVVVzUTBGQlF5eFJRVUZJTEVOQlFWa3NTVUZCV2l4RlFVRnJRaXhGUVVGc1FqczdRVUZEUVN4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpVDBvZ1BTQnlaWEYxYVhKbElDY3VMaTl2YWlkY2NseHVKQ0E5SUhKbGNYVnBjbVVnSjJweGRXVnllU2RjY2x4dVh5QTlJSEpsY1hWcGNtVWdKMnh2WkdGemFDZGNjbHh1WEhKY2JtTnNZWE56SUVsVFhISmNibHh5WEc0Z0lFQmliMjlzT2lBb1ltOXZiR1ZoYmlrZ0xUNWNjbHh1SUNBZ0lGOHVhWE5DYjI5c1pXRnVJR0p2YjJ4bFlXNWNjbHh1WEhKY2JpQWdRR0Z5Y21GNVRuVnNiRTl5Ulcxd2RIazZJQ2hoY25JcElDMCtYSEpjYmlBZ0lDQmZMbWx6Ulcxd2RIa2dZWEp5WEhKY2JseHlYRzRnSUVCemRISnBibWRPZFd4c1QzSkZiWEIwZVRvZ0tITjBjaWtnTFQ1Y2NseHVJQ0FnSUhOMGNpQmhibVFnS0c1dmRDQnpkSEl1YkdWdVozUm9JRzl5SUhOMGNpNXNaVzVuZEdnZ2FYTWdNQ0J2Y2lCdWIzUWdjM1J5TG5SeWFXMGdiM0lnYm05MElITjBjaTUwY21sdEtDa3BYSEpjYmx4eVhHNGdJRUJ1ZFcxaVpYSk9kV3hzVDNKRmJYQjBlVG9nS0c1MWJTa2dMVDVjY2x4dUlDQWdJRzV2ZENCdWRXMGdiM0lnYVhOT1lVNG9iblZ0S1NCdmNpQnViM1FnYm5WdExuUnZVSEpsWTJsemFXOXVYSEpjYmx4eVhHNGdJRUJrWVhSbFRuVnNiRTl5Ulcxd2RIazZJQ2hrZENrZ0xUNWNjbHh1SUNBZ0lHNXZkQ0JrZENCdmNpQnViM1FnWkhRdVoyVjBWR2x0WlZ4eVhHNWNjbHh1SUNCQWIySnFaV04wVG5Wc2JFOXlSVzF3ZEhrNklDaHZZbW9wSUMwK1hISmNiaUFnSUNCZkxtbHpSVzF3ZEhrZ2IySnFJRzl5SUc1dmRDQlBZbXBsWTNRdWEyVjVjeWh2WW1vcElHOXlJRTlpYW1WamRDNXJaWGx6S0c5aWFpa3ViR1Z1WjNSb0lHbHpJREJjY2x4dVhISmNiaUFnUUhCc1lXbHVUMkpxWldOME9pQW9iMkpxS1NBdFBseHlYRzRnSUNBZ1h5NXBjMUJzWVdsdVQySnFaV04wSUc5aWFseHlYRzVjY2x4dUlDQkFiMkpxWldOME9pQW9iMkpxS1NBdFBseHlYRzRnSUNBZ1h5NXBjMDlpYW1WamRDQnZZbXBjY2x4dVhISmNiaUFnUUdSaGRHVTZJQ2hrZENrZ0xUNWNjbHh1SUNBZ0lGOHVhWE5FWVhSbElHUjBYSEpjYmx4eVhHNWNjbHh1SUNBakl5TmNjbHh1SUNCRVpYUmxjbTFwYm1WeklHbG1JR0VnZG1Gc2RXVWdhWE1nWVc0Z2FXNXpkR0Z1WTJVZ2IyWWdZU0JPZFcxaVpYSWdZVzVrSUc1dmRDQk9ZVTRxWEhKY2JpQWdJeU1qWEhKY2JpQWdRRzUxYldKbGNqb2dLRzUxYlNrZ0xUNWNjbHh1SUNBZ0lHNTFiV0psY2lBOUlISmxjWFZwY21VZ0p5NHVMMk52Y21VdmJuVnRZbVZ5SjF4eVhHNGdJQ0FnZEhsd1pXOW1JRzUxYlNCcGN5QW5iblZ0WW1WeUp5QmhibVFnWm1Gc2MyVWdhWE1nS0c1MWJXSmxjaTVwYzA1aFRpaHVkVzBwSUc5eUlHWmhiSE5sSUdseklHNTFiV0psY2k1cGMwWnBibWwwWlNodWRXMHBJRzl5SUc1MWJXSmxjaTVOUVZoZlZrRk1WVVVnYVhNZ2JuVnRJRzl5SUc1MWJXSmxjaTVOU1U1ZlZrRk1WVVVnYVhNZ2JuVnRLVnh5WEc1Y2NseHVJQ0FqSXlOY2NseHVJQ0JFWlhSbGNtMXBibVZ6SUdsbUlHRWdkbUZzZFdVZ2FYTWdZMjl1ZG1WeWRHbGliR1VnZEc4Z1lTQk9kVzFpWlhKY2NseHVJQ0FqSXlOY2NseHVJQ0JBYm5WdFpYSnBZem9nS0c1MWJTa2dMVDVjY2x4dUlDQWdJSEpsZENBOUlFQnVkVzFpWlhJb2JuVnRLVnh5WEc0Z0lDQWdkVzVzWlhOeklISmxkRnh5WEc0Z0lDQWdJQ0IwYnlBOUlISmxjWFZwY21VZ0p5NHZkRzhuWEhKY2JpQWdJQ0FnSUc1MVRuVnRJRDBnZEc4dWJuVnRZbVZ5S0c1MWJTbGNjbHh1SUNBZ0lDQWdjbVYwSUQwZ1FHNTFiV0psY2lodWRVNTFiU2xjY2x4dUlDQWdJSEpsZEZ4eVhHNWNjbHh1SUNCQVpXeGxiV1Z1ZEVsdVJHOXRPaUFvWld4bGJXVnVkRWxrS1NBdFBseHlYRzRnSUNBZ1ptRnNjMlVnYVhNZ1FHNTFiR3hQY2tWdGNIUjVLR1J2WTNWdFpXNTBMbWRsZEVWc1pXMWxiblJDZVVsa0tHVnNaVzFsYm5SSlpDa3BYSEpjYmx4eVhHNGdJRUJoY25KaGVUb2dLRzlpYWlrZ0xUNWNjbHh1SUNBZ0lGOHVhWE5CY25KaGVTQnZZbXBjY2x4dVhISmNiaUFnUUhOMGNtbHVaem9nS0hOMGNpa2dMVDVjY2x4dUlDQWdJRjh1YVhOVGRISnBibWNnYzNSeVhISmNibHh5WEc0Z0lFQjBjblZsT2lBb2IySnFLU0F0UGx4eVhHNGdJQ0FnYjJKcUlHbHpJSFJ5ZFdVZ2IzSWdiMkpxSUdseklDZDBjblZsSnlCdmNpQnZZbW9nYVhNZ01TQnZjaUJ2WW1vZ2FYTWdKekVuWEhKY2JseHlYRzRnSUVCbVlXeHpaVG9nS0c5aWFpa2dMVDVjY2x4dUlDQWdJRzlpYWlCcGN5Qm1ZV3h6WlNCdmNpQnZZbW9nYVhNZ0oyWmhiSE5sSnlCdmNpQnZZbW9nYVhNZ01DQnZjaUJ2WW1vZ2FYTWdKekFuWEhKY2JseHlYRzRnSUVCMGNuVmxUM0pHWVd4elpUb2dLRzlpYWlrZ0xUNWNjbHh1SUNBZ0lFQjBjblZsSUc5aWFpQnZjaUJBWm1Gc2MyVWdiMkpxWEhKY2JseHlYRzRnSUVCdWRXeHNUM0pGYlhCMGVUb2dLRzlpYWl3Z1kyaGxZMnRNWlc1bmRHZ3BJQzArWEhKY2JpQWdJQ0JmTG1selJXMXdkSGtvYjJKcUtTQnZjaUJmTG1selZXNWtaV1pwYm1Wa0tHOWlhaWtnYjNJZ1h5NXBjMDUxYkd3b2IySnFLU0J2Y2lCZkxtbHpUbUZPS0c5aWFpbGNjbHh1WEhKY2JpQWdRRzUxYkd4UGNsVnVaR1ZtYVc1bFpEb2dLRzlpYWl3Z1kyaGxZMnRNWlc1bmRHZ3BJQzArWEhKY2JpQWdJQ0JmTG1selZXNWtaV1pwYm1Wa0tHOWlhaWtnYjNJZ1h5NXBjMDUxYkd3b2IySnFLU0J2Y2lCZkxtbHpUbUZPS0c5aWFpbGNjbHh1WEhKY2JpQWdRR2x1YzNSaGJtTmxiMlk2SUNodVlXMWxMQ0J2WW1vcElDMCtYSEpjYmlBZ0lDQnZZbW91ZEhsd1pTQnBjeUJ1WVcxbElHOXlJRzlpYWlCcGJuTjBZVzVqWlc5bUlHNWhiV1ZjY2x4dVhISmNiaUFnUUcxbGRHaHZaRG9nS0c5aWFpa2dMVDVjY2x4dUlDQWdJRzlpYWlCcGMyNTBJRTlLTG01dmIzQWdZVzVrSUY4dWFYTkdkVzVqZEdsdmJpQnZZbXBjY2x4dVhISmNiaUFnSXlNalhISmNiaUFnUkdWd2NtVmpZWFJsWkM0Z1RHVm1kQ0JtYjNJZ1ltRmphM2RoY21SeklHTnZiWEJoZEdsaWFXeHBkSGt1SUZWelpTQnBjeTV0WlhSb2IyUWdhVzV6ZEdWaFpDNWNjbHh1SUNBakl5TmNjbHh1SUNCQVpuVnVZeUE5SUVCdFpYUm9iMlJjY2x4dVhISmNibHh5WEc1Y2NseHVUMG91Y21WbmFYTjBaWElnSjJsekp5d2dTVk5jY2x4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCSlUxeHlYRzVjY2x4dUlsMTkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgT0osIG1ha2VOb3R5LCBub3R5O1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbm5vdHkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snbm90eSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnbm90eSddIDogbnVsbCk7XG5cbm1ha2VOb3R5ID0gZnVuY3Rpb24ob3B0aW9ucywgb3duZXIpIHtcbiAgdmFyIGRlZmF1bHRzLCByZXQ7XG4gIGRlZmF1bHRzID0ge1xuICAgIGxheW91dDogJ3RvcFJpZ2h0JyxcbiAgICB0aGVtZTogJ2RlZmF1bHRUaGVtZScsXG4gICAgdHlwZTogJ2FsZXJ0JyxcbiAgICB0ZXh0OiAnJyxcbiAgICBkaXNtaXNzUXVldWU6IHRydWUsXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwibm90eV9tZXNzYWdlXCI+PHNwYW4gY2xhc3M9XCJub3R5X3RleHRcIj48L3NwYW4+PGRpdiBjbGFzcz1cIm5vdHlfY2xvc2VcIj48L2Rpdj48L2Rpdj4nLFxuICAgIGFuaW1hdGlvbjoge1xuICAgICAgb3Blbjoge1xuICAgICAgICBoZWlnaHQ6ICd0b2dnbGUnXG4gICAgICB9LFxuICAgICAgY2xvc2U6IHtcbiAgICAgICAgaGVpZ2h0OiAndG9nZ2xlJ1xuICAgICAgfSxcbiAgICAgIGVhc2luZzogJ3N3aW5nJyxcbiAgICAgIHNwZWVkOiA1MDBcbiAgICB9LFxuICAgIHRpbWVvdXQ6IDUwMDAsXG4gICAgZm9yY2U6IGZhbHNlLFxuICAgIG1vZGFsOiBmYWxzZSxcbiAgICBtYXhWaXNpYmxlOiA1LFxuICAgIGtpbGxlcjogZmFsc2UsXG4gICAgY2xvc2VXaXRoOiBbJ2NsaWNrJ10sXG4gICAgY2FsbGJhY2s6IHtcbiAgICAgIG9uU2hvdzogT0oubm9vcCxcbiAgICAgIGFmdGVyU2hvdzogT0oubm9vcCxcbiAgICAgIG9uQ2xvc2U6IE9KLm5vb3AsXG4gICAgICBhZnRlckNsb3NlOiBPSi5ub29wXG4gICAgfSxcbiAgICBidXR0b25zOiBmYWxzZVxuICB9O1xuICBPSi5leHRlbmQoZGVmYXVsdHMsIG9wdGlvbnMsIHRydWUpO1xuICByZXQgPSBub3R5KGRlZmF1bHRzKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbk9KLm5vdGlmaWNhdGlvbnMucmVnaXN0ZXIoJ25vdHknLCBtYWtlTm90eSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbWFrZU5vdHk7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4MGIyOXNjMXhjYm05MGVTNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWp0QlFVRkJMRWxCUVVFN08wRkJRVUVzUlVGQlFTeEhRVUZMTEU5QlFVRXNRMEZCVVN4UFFVRlNPenRCUVVOTUxFbEJRVUVzUjBGQlR5eFBRVUZCTEVOQlFWRXNUVUZCVWpzN1FVRkhVQ3hSUVVGQkxFZEJRVmNzVTBGQlF5eFBRVUZFTEVWQlFWVXNTMEZCVmp0QlFVTlVMRTFCUVVFN1JVRkJRU3hSUVVGQkxFZEJRMFU3U1VGQlFTeE5RVUZCTEVWQlFWRXNWVUZCVWp0SlFVTkJMRXRCUVVFc1JVRkJUeXhqUVVSUU8wbEJSVUVzU1VGQlFTeEZRVUZOTEU5QlJrNDdTVUZIUVN4SlFVRkJMRVZCUVUwc1JVRklUanRKUVVsQkxGbEJRVUVzUlVGQll5eEpRVXBrTzBsQlMwRXNVVUZCUVN4RlFVRlZMQ3RHUVV4V08wbEJUVUVzVTBGQlFTeEZRVU5KTzAxQlFVRXNTVUZCUVN4RlFVTkZPMUZCUVVFc1RVRkJRU3hGUVVGUkxGRkJRVkk3VDBGRVJqdE5RVVZCTEV0QlFVRXNSVUZEUlR0UlFVRkJMRTFCUVVFc1JVRkJVU3hSUVVGU08wOUJTRVk3VFVGSlFTeE5RVUZCTEVWQlFWRXNUMEZLVWp0TlFVdEJMRXRCUVVFc1JVRkJUeXhIUVV4UU8wdEJVRW83U1VGaFFTeFBRVUZCTEVWQlFWTXNTVUZpVkR0SlFXTkJMRXRCUVVFc1JVRkJUeXhMUVdSUU8wbEJaVUVzUzBGQlFTeEZRVUZQTEV0QlpsQTdTVUZuUWtFc1ZVRkJRU3hGUVVGWkxFTkJhRUphTzBsQmFVSkJMRTFCUVVFc1JVRkJVU3hMUVdwQ1VqdEpRV3RDUVN4VFFVRkJMRVZCUVZjc1EwRkJReXhQUVVGRUxFTkJiRUpZTzBsQmJVSkJMRkZCUVVFc1JVRkRTVHROUVVGQkxFMUJRVUVzUlVGQlVTeEZRVUZGTEVOQlFVTXNTVUZCV0R0TlFVTkJMRk5CUVVFc1JVRkJWeXhGUVVGRkxFTkJRVU1zU1VGRVpEdE5RVVZCTEU5QlFVRXNSVUZCVXl4RlFVRkZMRU5CUVVNc1NVRkdXanROUVVkQkxGVkJRVUVzUlVGQldTeEZRVUZGTEVOQlFVTXNTVUZJWmp0TFFYQkNTanRKUVhkQ1FTeFBRVUZCTEVWQlFWTXNTMEY0UWxRN08wVkJNRUpHTEVWQlFVVXNRMEZCUXl4TlFVRklMRU5CUVZVc1VVRkJWaXhGUVVGdlFpeFBRVUZ3UWl4RlFVRTJRaXhKUVVFM1FqdEZRVU5CTEVkQlFVRXNSMEZCVFN4SlFVRkJMRU5CUVVzc1VVRkJURHRUUVVWT08wRkJMMEpUT3p0QlFXbERXQ3hGUVVGRkxFTkJRVU1zWVVGQllTeERRVUZETEZGQlFXcENMRU5CUVRCQ0xFMUJRVEZDTEVWQlFXdERMRkZCUVd4RE96dEJRVU5CTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0lpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpQU2lBOUlISmxjWFZwY21VZ0p5NHVMMjlxSjF4eVhHNXViM1I1SUQwZ2NtVnhkV2x5WlNBbmJtOTBlU2RjY2x4dVhISmNiaUFnWEhKY2JtMWhhMlZPYjNSNUlEMGdLRzl3ZEdsdmJuTXNJRzkzYm1WeUtTQXRQbHh5WEc0Z0lHUmxabUYxYkhSeklEMWNjbHh1SUNBZ0lHeGhlVzkxZERvZ0ozUnZjRkpwWjJoMEoxeHlYRzRnSUNBZ2RHaGxiV1U2SUNka1pXWmhkV3gwVkdobGJXVW5YSEpjYmlBZ0lDQjBlWEJsT2lBbllXeGxjblFuWEhKY2JpQWdJQ0IwWlhoME9pQW5KeUFqWTJGdUlHSmxJR2gwYld3Z2IzSWdjM1J5YVc1blhISmNiaUFnSUNCa2FYTnRhWE56VVhWbGRXVTZJSFJ5ZFdVZ0kwbG1JSGx2ZFNCM1lXNTBJSFJ2SUhWelpTQnhkV1YxWlNCbVpXRjBkWEpsSUhObGRDQjBhR2x6SUhSeWRXVmNjbHh1SUNBZ0lIUmxiWEJzWVhSbE9pQW5QR1JwZGlCamJHRnpjejFjSW01dmRIbGZiV1Z6YzJGblpWd2lQanh6Y0dGdUlHTnNZWE56UFZ3aWJtOTBlVjkwWlhoMFhDSStQQzl6Y0dGdVBqeGthWFlnWTJ4aGMzTTlYQ0p1YjNSNVgyTnNiM05sWENJK1BDOWthWFkrUEM5a2FYWStKeXhjY2x4dUlDQWdJR0Z1YVcxaGRHbHZiam9nWEhKY2JpQWdJQ0FnSUNBZ2IzQmxiam9nWEhKY2JpQWdJQ0FnSUNBZ0lDQm9aV2xuYUhRNklDZDBiMmRuYkdVblhISmNiaUFnSUNBZ0lDQWdZMnh2YzJVNklGeHlYRzRnSUNBZ0lDQWdJQ0FnYUdWcFoyaDBPaUFuZEc5bloyeGxKMXh5WEc0Z0lDQWdJQ0FnSUdWaGMybHVaem9nSjNOM2FXNW5KMXh5WEc0Z0lDQWdJQ0FnSUhOd1pXVmtPaUExTURBZ0kyOXdaVzVwYm1jZ0ppQmpiRzl6YVc1bklHRnVhVzFoZEdsdmJpQnpjR1ZsWkZ4eVhHNGdJQ0FnZEdsdFpXOTFkRG9nTlRBd01DQWpaR1ZzWVhrZ1ptOXlJR05zYjNOcGJtY2daWFpsYm5RdUlGTmxkQ0JtWVd4elpTQm1iM0lnYzNScFkydDVJRzV2ZEdsbWFXTmhkR2x2Ym5OY2NseHVJQ0FnSUdadmNtTmxPaUJtWVd4elpTQWpZV1JrY3lCdWIzUnBabWxqWVhScGIyNGdkRzhnZEdobElHSmxaMmx1Ym1sdVp5QnZaaUJ4ZFdWMVpTQjNhR1Z1SUhObGRDQjBieUIwY25WbFhISmNiaUFnSUNCdGIyUmhiRG9nWm1Gc2MyVmNjbHh1SUNBZ0lHMWhlRlpwYzJsaWJHVTZJRFVnSTNsdmRTQmpZVzRnYzJWMElHMWhlQ0IyYVhOcFlteGxJRzV2ZEdsbWFXTmhkR2x2YmlCbWIzSWdaR2x6YldsemMxRjFaWFZsSUhSeWRXVWdiM0IwYVc5dUxGeHlYRzRnSUNBZ2EybHNiR1Z5T2lCbVlXeHpaU0FqWm05eUlHTnNiM05sSUdGc2JDQnViM1JwWm1sallYUnBiMjV6SUdKbFptOXlaU0J6YUc5M1hISmNiaUFnSUNCamJHOXpaVmRwZEdnNklGc25ZMnhwWTJzblhTQWdJMXNuWTJ4cFkyc25MQ0FuWW5WMGRHOXVKeXdnSjJodmRtVnlKMTFjY2x4dUlDQWdJR05oYkd4aVlXTnJPaUJjY2x4dUlDQWdJQ0FnSUNCdmJsTm9iM2M2SUU5S0xtNXZiM0FzWEhKY2JpQWdJQ0FnSUNBZ1lXWjBaWEpUYUc5M09pQlBTaTV1YjI5d1hISmNiaUFnSUNBZ0lDQWdiMjVEYkc5elpUb2dUMG91Ym05dmNGeHlYRzRnSUNBZ0lDQWdJR0ZtZEdWeVEyeHZjMlU2SUU5S0xtNXZiM0JjY2x4dUlDQWdJR0oxZEhSdmJuTTZJR1poYkhObElDTmhiaUJoY25KaGVTQnZaaUJpZFhSMGIyNXpYSEpjYmlBZ0lDQmNjbHh1SUNCUFNpNWxlSFJsYm1RZ1pHVm1ZWFZzZEhNc0lHOXdkR2x2Ym5Nc0lIUnlkV1ZjY2x4dUlDQnlaWFFnUFNCdWIzUjVJR1JsWm1GMWJIUnpYSEpjYmlBZ0lDQWdJRnh5WEc0Z0lISmxkRnh5WEc0Z0lDQWdYSEpjYms5S0xtNXZkR2xtYVdOaGRHbHZibk11Y21WbmFYTjBaWElnSjI1dmRIa25MQ0J0WVd0bFRtOTBlVnh5WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUcxaGEyVk9iM1I1SWwxOSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBPSiwgUHViU3ViLCBldmVudHMsIHBzLCBzdWJzY3JpYmVycywgdG9rZW5zO1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cblB1YlN1YiA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydQdWJTdWInXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1B1YlN1YiddIDogbnVsbCk7XG5cbnRva2VucyA9IHt9O1xuXG5zdWJzY3JpYmVycyA9IFtdO1xuXG5ldmVudHMgPSB7fTtcblxucHMgPSB7XG4gIGdldEV2ZW50TmFtZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICByZXR1cm4gZXZlbnQudG9VcHBlckNhc2UoKS5yZXBsYWNlKCcgJywgJ18nKTtcbiAgfSxcbiAgc3Vic2NyaWJlOiBmdW5jdGlvbihldmVudCwgbWV0aG9kKSB7XG4gICAgdmFyIGV2ZW50TmFtZSwgdG9rZW47XG4gICAgZXZlbnROYW1lID0gcHMuZ2V0RXZlbnROYW1lKGV2ZW50KTtcbiAgICBpZiAoIWV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICBldmVudHNbZXZlbnROYW1lXSA9IFtdO1xuICAgIH1cbiAgICB0b2tlbiA9IFB1YlN1Yi5zdWJzY3JpYmUoZXZlbnROYW1lLCBtZXRob2QpO1xuICAgIHRva2Vuc1t0b2tlbl0gPSB0b2tlbjtcbiAgICBzdWJzY3JpYmVycy5wdXNoKG1ldGhvZCk7XG4gICAgZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChtZXRob2QpO1xuICAgIHJldHVybiB0b2tlbjtcbiAgfSxcbiAgcHVibGlzaDogZnVuY3Rpb24oZXZlbnQsIGRhdGEpIHtcbiAgICB2YXIgZXZlbnROYW1lO1xuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZShldmVudCk7XG4gICAgaWYgKGV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICBQdWJTdWIucHVibGlzaChldmVudE5hbWUsIGRhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBPSi5jb25zb2xlLmluZm8oJ0V2ZW50IG5hbWVkIHsnICsgZXZlbnQgKyAnfSBpcyBub3QgcmVjb2duaXplZC4nKTtcbiAgICB9XG4gIH0sXG4gIHVuc3Vic2NyaWJlOiBmdW5jdGlvbih0b2tlbk9yTWV0aG9kKSB7XG4gICAgaWYgKE9KLmlzLm1ldGhvZCh0b2tlbk9yTWV0aG9kKSkge1xuICAgICAgaWYgKC0xICE9PSBzdWJzY3JpYmVycy5pbmRleE9mKHRva2VuT3JNZXRob2QpKSB7XG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSh0b2tlbk9yTWV0aG9kKTtcbiAgICAgICAgc3Vic2NyaWJlcnMgPSBfLnJlbW92ZShzdWJzY3JpYmVycywgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgICAgcmV0dXJuIG1ldGhvZCA9PT0gdG9rZW5Pck1ldGhvZDtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBPSi5jb25zb2xlLmluZm8oJ0V2ZW50IG1ldGhvZCBpcyBub3QgcmVjb2duaXplZC4nKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRva2Vuc1t0b2tlbk9yTWV0aG9kXSkge1xuICAgICAgICBQdWJTdWIudW5zdWJzY3JpYmUodG9rZW5Pck1ldGhvZCk7XG4gICAgICAgIGRlbGV0ZSB0b2tlbnNbdG9rZW5Pck1ldGhvZF07XG4gICAgICB9XG4gICAgfVxuICB9LFxuICB1bnN1YnNjcmliZUFsbDogZnVuY3Rpb24oKSB7XG4gICAgT0ouZWFjaCh0b2tlbnMsIGZ1bmN0aW9uKHRva2VuKSB7XG4gICAgICByZXR1cm4gdW5zdWJzY3JpYmUodG9rZW4pO1xuICAgIH0pO1xuICAgIHN1YnNjcmliZXJzID0gW107XG4gICAgZXZlbnRzID0ge307XG4gIH0sXG4gIHVuc3Vic2NyaWJlRXZlbnQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGV2ZW50TmFtZTtcbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUoZXZlbnQpO1xuICAgIGlmIChldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgT0ouZWFjaChldmVudHNbZXZlbnROYW1lXSwgZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICAgIHJldHVybiB1bnN1YnNjcmliZShtZXRob2QpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE9KLmNvbnNvbGUuaW5mbygnRXZlbnQgbmFtZWQgeycgKyBldmVudCArICd9IGlzIG5vdCByZWNvZ25pemVkLicpO1xuICAgIH1cbiAgICBkZWxldGUgZXZlbnRzW2V2ZW50TmFtZV07XG4gIH1cbn07XG5cbk9iamVjdC5zZWFsKHBzKTtcblxuT2JqZWN0LmZyZWV6ZShwcyk7XG5cbk9KLnJlZ2lzdGVyKCdnZXRFdmVudE5hbWUnLCBwcy5nZXRFdmVudE5hbWUpO1xuXG5PSi5yZWdpc3RlcigncHVibGlzaCcsIHBzLnB1Ymxpc2gpO1xuXG5PSi5yZWdpc3Rlcignc3Vic2NyaWJlJywgcHMuc3Vic2NyaWJlKTtcblxuT0oucmVnaXN0ZXIoJ3Vuc3Vic2NyaWJlJywgcHMudW5zdWJzY3JpYmUpO1xuXG5PSi5yZWdpc3RlcigndW5zdWJzY3JpYmVBbGwnLCBwcy51bnN1YnNjcmliZUFsbCk7XG5cbk9KLnJlZ2lzdGVyKCd1bnN1YnNjcmliZUV2ZW50JywgcHMudW5zdWJzY3JpYmVFdmVudCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcHM7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4MGIyOXNjMXhjY0hWaWMzVmlMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJRVUVzU1VGQlFUczdRVUZCUVN4RlFVRkJMRWRCUVVzc1QwRkJRU3hEUVVGUkxFOUJRVkk3TzBGQlEwd3NUVUZCUVN4SFFVRlRMRTlCUVVFc1EwRkJVU3hYUVVGU096dEJRVVZVTEUxQlFVRXNSMEZCVXpzN1FVRkRWQ3hYUVVGQkxFZEJRV003TzBGQlEyUXNUVUZCUVN4SFFVRlRPenRCUVVWVUxFVkJRVUVzUjBGRFJUdEZRVUZCTEZsQlFVRXNSVUZCWXl4VFFVRkRMRXRCUVVRN1YwRkRXaXhMUVVGTExFTkJRVU1zVjBGQlRpeERRVUZCTEVOQlFXMUNMRU5CUVVNc1QwRkJjRUlzUTBGQk5FSXNSMEZCTlVJc1JVRkJhVU1zUjBGQmFrTTdSVUZFV1N4RFFVRmtPMFZCUjBFc1UwRkJRU3hGUVVGWExGTkJRVU1zUzBGQlJDeEZRVUZSTEUxQlFWSTdRVUZEVkN4UlFVRkJPMGxCUVVFc1UwRkJRU3hIUVVGWkxFVkJRVVVzUTBGQlF5eFpRVUZJTEVOQlFXZENMRXRCUVdoQ08wbEJRMW9zU1VGQlJ5eERRVUZKTEUxQlFVOHNRMEZCUVN4VFFVRkJMRU5CUVdRN1RVRkJPRUlzVFVGQlR5eERRVUZCTEZOQlFVRXNRMEZCVUN4SFFVRnZRaXhIUVVGc1JEczdTVUZGUVN4TFFVRkJMRWRCUVZFc1RVRkJUU3hEUVVGRExGTkJRVkFzUTBGQmFVSXNVMEZCYWtJc1JVRkJORUlzVFVGQk5VSTdTVUZEVWl4TlFVRlBMRU5CUVVFc1MwRkJRU3hEUVVGUUxFZEJRV2RDTzBsQlEyaENMRmRCUVZjc1EwRkJReXhKUVVGYUxFTkJRV2xDTEUxQlFXcENPMGxCUTBFc1RVRkJUeXhEUVVGQkxGTkJRVUVzUTBGQlZTeERRVUZETEVsQlFXeENMRU5CUVhWQ0xFMUJRWFpDTzFkQlEwRTdSVUZTVXl4RFFVaFlPMFZCWVVFc1QwRkJRU3hGUVVGVExGTkJRVU1zUzBGQlJDeEZRVUZSTEVsQlFWSTdRVUZEVUN4UlFVRkJPMGxCUVVFc1UwRkJRU3hIUVVGWkxFVkJRVVVzUTBGQlF5eFpRVUZJTEVOQlFXZENMRXRCUVdoQ08wbEJRMW9zU1VGQlJ5eE5RVUZQTEVOQlFVRXNVMEZCUVN4RFFVRldPMDFCUTBVc1RVRkJUU3hEUVVGRExFOUJRVkFzUTBGQlpTeFRRVUZtTEVWQlFUQkNMRWxCUVRGQ0xFVkJSRVk3UzBGQlFTeE5RVUZCTzAxQlIwVXNSVUZCUlN4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGWUxFTkJRV2RDTEdWQlFVRXNSMEZCYTBJc1MwRkJiRUlzUjBGQk1FSXNjMEpCUVRGRExFVkJTRVk3TzBWQlJrOHNRMEZpVkR0RlFYRkNRU3hYUVVGQkxFVkJRV0VzVTBGQlF5eGhRVUZFTzBsQlExZ3NTVUZCUnl4RlFVRkZMRU5CUVVNc1JVRkJSU3hEUVVGRExFMUJRVTRzUTBGQllTeGhRVUZpTEVOQlFVZzdUVUZEUlN4SlFVRkhMRU5CUVVNc1EwRkJSQ3hMUVVGUkxGZEJRVmNzUTBGQlF5eFBRVUZhTEVOQlFXOUNMR0ZCUVhCQ0xFTkJRVmc3VVVGRFJTeE5RVUZOTEVOQlFVTXNWMEZCVUN4RFFVRnRRaXhoUVVGdVFqdFJRVU5CTEZkQlFVRXNSMEZCWXl4RFFVRkRMRU5CUVVNc1RVRkJSaXhEUVVGVExGZEJRVlFzUlVGQmMwSXNVMEZCUXl4TlFVRkVPMmxDUVVGWkxFMUJRVUVzUzBGQlZUdFJRVUYwUWl4RFFVRjBRaXhGUVVab1FqdFBRVUZCTEUxQlFVRTdVVUZKUlN4RlFVRkZMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVmdzUTBGQlowSXNhVU5CUVdoQ0xFVkJTa1k3VDBGRVJqdExRVUZCTEUxQlFVRTdUVUZQUlN4SlFVRkhMRTFCUVU4c1EwRkJRU3hoUVVGQkxFTkJRVlk3VVVGRFJTeE5RVUZOTEVOQlFVTXNWMEZCVUN4RFFVRnRRaXhoUVVGdVFqdFJRVU5CTEU5QlFVOHNUVUZCVHl4RFFVRkJMR0ZCUVVFc1JVRkdhRUk3VDBGUVJqczdSVUZFVnl4RFFYSkNZanRGUVd0RFFTeGpRVUZCTEVWQlFXZENMRk5CUVVFN1NVRkRaQ3hGUVVGRkxFTkJRVU1zU1VGQlNDeERRVUZSTEUxQlFWSXNSVUZCWjBJc1UwRkJReXhMUVVGRU8yRkJRVmNzVjBGQlFTeERRVUZaTEV0QlFWbzdTVUZCV0N4RFFVRm9RanRKUVVOQkxGZEJRVUVzUjBGQll6dEpRVU5rTEUxQlFVRXNSMEZCVXp0RlFVaExMRU5CYkVOb1FqdEZRWGREUVN4blFrRkJRU3hGUVVGclFpeFRRVUZETEV0QlFVUTdRVUZEYUVJc1VVRkJRVHRKUVVGQkxGTkJRVUVzUjBGQldTeEZRVUZGTEVOQlFVTXNXVUZCU0N4RFFVRm5RaXhMUVVGb1FqdEpRVU5hTEVsQlFVY3NUVUZCVHl4RFFVRkJMRk5CUVVFc1EwRkJWanROUVVORkxFVkJRVVVzUTBGQlF5eEpRVUZJTEVOQlFWRXNUVUZCVHl4RFFVRkJMRk5CUVVFc1EwRkJaaXhGUVVFeVFpeFRRVUZETEUxQlFVUTdaVUZCV1N4WFFVRkJMRU5CUVZrc1RVRkJXanROUVVGYUxFTkJRVE5DTEVWQlJFWTdTMEZCUVN4TlFVRkJPMDFCUjBVc1JVRkJSU3hEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZZTEVOQlFXZENMR1ZCUVVFc1IwRkJhMElzUzBGQmJFSXNSMEZCTUVJc2MwSkJRVEZETEVWQlNFWTdPMGxCU1VFc1QwRkJUeXhOUVVGUExFTkJRVUVzVTBGQlFUdEZRVTVGTEVOQmVFTnNRanM3TzBGQmFVUkdMRTFCUVUwc1EwRkJReXhKUVVGUUxFTkJRVmtzUlVGQldqczdRVUZEUVN4TlFVRk5MRU5CUVVNc1RVRkJVQ3hEUVVGakxFVkJRV1E3TzBGQlJVRXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3hqUVVGYUxFVkJRVFJDTEVWQlFVVXNRMEZCUXl4WlFVRXZRanM3UVVGRFFTeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMRk5CUVZvc1JVRkJkVUlzUlVGQlJTeERRVUZETEU5QlFURkNPenRCUVVOQkxFVkJRVVVzUTBGQlF5eFJRVUZJTEVOQlFWa3NWMEZCV2l4RlFVRjVRaXhGUVVGRkxFTkJRVU1zVTBGQk5VSTdPMEZCUTBFc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeGhRVUZhTEVWQlFUSkNMRVZCUVVVc1EwRkJReXhYUVVFNVFqczdRVUZEUVN4RlFVRkZMRU5CUVVNc1VVRkJTQ3hEUVVGWkxHZENRVUZhTEVWQlFUaENMRVZCUVVVc1EwRkJReXhqUVVGcVF6czdRVUZEUVN4RlFVRkZMRU5CUVVNc1VVRkJTQ3hEUVVGWkxHdENRVUZhTEVWQlFXZERMRVZCUVVVc1EwRkJReXhuUWtGQmJrTTdPMEZCUlVFc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSWlMQ0ptYVd4bElqb2laMlZ1WlhKaGRHVmtMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWs5S0lEMGdjbVZ4ZFdseVpTQW5MaTR2YjJvblhISmNibEIxWWxOMVlpQTlJSEpsY1hWcGNtVWdKM0IxWW5OMVlpMXFjeWRjY2x4dVhISmNiblJ2YTJWdWN5QTlJSHQ5WEhKY2JuTjFZbk5qY21saVpYSnpJRDBnVzExY2NseHVaWFpsYm5SeklEMGdlMzFjY2x4dVhISmNibkJ6SUQwZ1hISmNiaUFnWjJWMFJYWmxiblJPWVcxbE9pQW9aWFpsYm5RcElDMCtYSEpjYmlBZ0lDQmxkbVZ1ZEM1MGIxVndjR1Z5UTJGelpTZ3BMbkpsY0d4aFkyVWdKeUFuTENBblh5ZGNjbHh1WEhKY2JpQWdjM1ZpYzJOeWFXSmxPaUFvWlhabGJuUXNJRzFsZEdodlpDa2dMVDVjY2x4dUlDQWdJR1YyWlc1MFRtRnRaU0E5SUhCekxtZGxkRVYyWlc1MFRtRnRaU0JsZG1WdWRGeHlYRzRnSUNBZ2FXWWdibTkwSUdWMlpXNTBjMXRsZG1WdWRFNWhiV1ZkSUhSb1pXNGdaWFpsYm5SelcyVjJaVzUwVG1GdFpWMGdQU0JiWFZ4eVhHNWNjbHh1SUNBZ0lIUnZhMlZ1SUQwZ1VIVmlVM1ZpTG5OMVluTmpjbWxpWlNCbGRtVnVkRTVoYldVc0lHMWxkR2h2WkZ4eVhHNGdJQ0FnZEc5clpXNXpXM1J2YTJWdVhTQTlJSFJ2YTJWdVhISmNiaUFnSUNCemRXSnpZM0pwWW1WeWN5NXdkWE5vSUcxbGRHaHZaRnh5WEc0Z0lDQWdaWFpsYm5SelcyVjJaVzUwVG1GdFpWMHVjSFZ6YUNCdFpYUm9iMlJjY2x4dUlDQWdJSFJ2YTJWdVhISmNibHh5WEc0Z0lIQjFZbXhwYzJnNklDaGxkbVZ1ZEN3Z1pHRjBZU2tnTFQ1Y2NseHVJQ0FnSUdWMlpXNTBUbUZ0WlNBOUlIQnpMbWRsZEVWMlpXNTBUbUZ0WlNCbGRtVnVkRnh5WEc0Z0lDQWdhV1lnWlhabGJuUnpXMlYyWlc1MFRtRnRaVjFjY2x4dUlDQWdJQ0FnVUhWaVUzVmlMbkIxWW14cGMyZ2daWFpsYm5ST1lXMWxMQ0JrWVhSaFhISmNiaUFnSUNCbGJITmxYSEpjYmlBZ0lDQWdJRTlLTG1OdmJuTnZiR1V1YVc1bWJ5QW5SWFpsYm5RZ2JtRnRaV1FnZXljZ0t5QmxkbVZ1ZENBcklDZDlJR2x6SUc1dmRDQnlaV052WjI1cGVtVmtMaWRjY2x4dUlDQWdJSEpsZEhWeWJseHlYRzVjY2x4dUlDQjFibk4xWW5OamNtbGlaVG9nS0hSdmEyVnVUM0pOWlhSb2IyUXBJQzArWEhKY2JpQWdJQ0JwWmlCUFNpNXBjeTV0WlhSb2IyUWdkRzlyWlc1UGNrMWxkR2h2WkZ4eVhHNGdJQ0FnSUNCcFppQXRNU0JwYzI1MElITjFZbk5qY21saVpYSnpMbWx1WkdWNFQyWWdkRzlyWlc1UGNrMWxkR2h2WkZ4eVhHNGdJQ0FnSUNBZ0lGQjFZbE4xWWk1MWJuTjFZbk5qY21saVpTQjBiMnRsYms5eVRXVjBhRzlrWEhKY2JpQWdJQ0FnSUNBZ2MzVmljMk55YVdKbGNuTWdQU0JmTG5KbGJXOTJaU0J6ZFdKelkzSnBZbVZ5Y3l3Z0tHMWxkR2h2WkNrZ0xUNGdiV1YwYUc5a0lHbHpJSFJ2YTJWdVQzSk5aWFJvYjJSY2NseHVJQ0FnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0FnSUU5S0xtTnZibk52YkdVdWFXNW1ieUFuUlhabGJuUWdiV1YwYUc5a0lHbHpJRzV2ZENCeVpXTnZaMjVwZW1Wa0xpZGNjbHh1SUNBZ0lHVnNjMlZjY2x4dUlDQWdJQ0FnYVdZZ2RHOXJaVzV6VzNSdmEyVnVUM0pOWlhSb2IyUmRYSEpjYmlBZ0lDQWdJQ0FnVUhWaVUzVmlMblZ1YzNWaWMyTnlhV0psSUhSdmEyVnVUM0pOWlhSb2IyUmNjbHh1SUNBZ0lDQWdJQ0JrWld4bGRHVWdkRzlyWlc1elczUnZhMlZ1VDNKTlpYUm9iMlJkWEhKY2JpQWdJQ0J5WlhSMWNtNWNjbHh1WEhKY2JpQWdkVzV6ZFdKelkzSnBZbVZCYkd3NklDZ3BJQzArWEhKY2JpQWdJQ0JQU2k1bFlXTm9JSFJ2YTJWdWN5d2dLSFJ2YTJWdUtTQXRQaUIxYm5OMVluTmpjbWxpWlNCMGIydGxibHh5WEc0Z0lDQWdjM1ZpYzJOeWFXSmxjbk1nUFNCYlhWeHlYRzRnSUNBZ1pYWmxiblJ6SUQwZ2UzMWNjbHh1SUNBZ0lISmxkSFZ5Ymx4eVhHNWNjbHh1SUNCMWJuTjFZbk5qY21saVpVVjJaVzUwT2lBb1pYWmxiblFwSUMwK1hISmNiaUFnSUNCbGRtVnVkRTVoYldVZ1BTQndjeTVuWlhSRmRtVnVkRTVoYldVZ1pYWmxiblJjY2x4dUlDQWdJR2xtSUdWMlpXNTBjMXRsZG1WdWRFNWhiV1ZkWEhKY2JpQWdJQ0FnSUU5S0xtVmhZMmdnWlhabGJuUnpXMlYyWlc1MFRtRnRaVjBzSUNodFpYUm9iMlFwSUMwK0lIVnVjM1ZpYzJOeWFXSmxJRzFsZEdodlpGeHlYRzRnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0JQU2k1amIyNXpiMnhsTG1sdVptOGdKMFYyWlc1MElHNWhiV1ZrSUhzbklDc2daWFpsYm5RZ0t5QW5mU0JwY3lCdWIzUWdjbVZqYjJkdWFYcGxaQzRuWEhKY2JpQWdJQ0JrWld4bGRHVWdaWFpsYm5SelcyVjJaVzUwVG1GdFpWMWNjbHh1SUNBZ0lISmxkSFZ5Ymx4eVhHNWNjbHh1VDJKcVpXTjBMbk5sWVd3Z2NITmNjbHh1VDJKcVpXTjBMbVp5WldWNlpTQndjMXh5WEc1Y2NseHVUMG91Y21WbmFYTjBaWElnSjJkbGRFVjJaVzUwVG1GdFpTY3NJSEJ6TG1kbGRFVjJaVzUwVG1GdFpWeHlYRzVQU2k1eVpXZHBjM1JsY2lBbmNIVmliR2x6YUNjc0lIQnpMbkIxWW14cGMyaGNjbHh1VDBvdWNtVm5hWE4wWlhJZ0ozTjFZbk5qY21saVpTY3NJSEJ6TG5OMVluTmpjbWxpWlZ4eVhHNVBTaTV5WldkcGMzUmxjaUFuZFc1emRXSnpZM0pwWW1VbkxDQndjeTUxYm5OMVluTmpjbWxpWlZ4eVhHNVBTaTV5WldkcGMzUmxjaUFuZFc1emRXSnpZM0pwWW1WQmJHd25MQ0J3Y3k1MWJuTjFZbk5qY21saVpVRnNiRnh5WEc1UFNpNXlaV2RwYzNSbGNpQW5kVzV6ZFdKelkzSnBZbVZGZG1WdWRDY3NJSEJ6TG5WdWMzVmljMk55YVdKbFJYWmxiblJjY2x4dVhISmNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdjSE1pWFgwPSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbiMjI1xyXG5odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkwMTExNS9ob3ctY2FuLWktZ2V0LXF1ZXJ5LXN0cmluZy12YWx1ZXMtaW4tamF2YXNjcmlwdFxyXG4jIyNcclxucXVlcnlTdHJpbmcgPSAocGFyYW0pIC0+XHJcbiAgcmV0ID0ge31cclxuICAgIFxyXG4gIGlmIE9KLmdsb2JhbC5sb2NhdGlvblxyXG4gICAgcGFyYW1zID0gIE9KLmdsb2JhbC5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpLnNwbGl0ICcmJ1xyXG4gICAgaWYgcGFyYW1zXHJcbiAgICAgIGkgPSAwXHJcbiAgICAgIHdoaWxlIGkgPCBwYXJhbXMubGVuZ3RoXHJcbiAgICAgICAgcHJtID0gcGFyYW1zW2ldLnNwbGl0ICc9J1xyXG4gICAgICAgIGlmIHBybS5sZW5ndGggaXMgMiBcclxuICAgICAgICAgIHJldFtwcm1bMF1dID0gT0ouZ2xvYmFsLmRlY29kZVVSSUNvbXBvbmVudCBwcm1bMV0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKVxyXG4gICAgICAgIGkgKz0gMVxyXG4gIHJldFxyXG4gICAgXHJcbk9KLnJlZ2lzdGVyICdxdWVyeVN0cmluZycscXVlcnlTdHJpbmdcclxubW9kdWxlLmV4cG9ydHMgPSBxdWVyeVN0cmluZyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBPSiwgXywgZWFjaCwgb2JqLCBybmcsXG4gIHNsaWNlID0gW10uc2xpY2U7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxub2JqID0gcmVxdWlyZSgnLi4vY29yZS9vYmplY3QnKTtcblxuZWFjaCA9IHJlcXVpcmUoJy4vZWFjaCcpO1xuXG5ybmcgPSB7XG4gIHJhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFyYW1zO1xuICAgIHBhcmFtcyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgIHJldHVybiBfLnJhbmdlLmFwcGx5KF8sIHBhcmFtcyk7XG4gIH0sXG4gIHJhbmdlTWluOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFyYW1zO1xuICAgIHBhcmFtcyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgIHJldHVybiBfLm1pbi5hcHBseShfLCBwYXJhbXMpO1xuICB9LFxuICByYW5nZU1heDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcmFtcztcbiAgICBwYXJhbXMgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICByZXR1cm4gXy5tYXguYXBwbHkoXywgcGFyYW1zKTtcbiAgfSxcblxuICAvKlxuICBUYWtlIGFuIGFycmF5IG9mIHN0cmluZyB2YWx1ZXMgYW5kIGEgbnVtYmVyIG9mIHBhcnRpdGlvbnMgdG8gY3JlYXRlLlxuICBVc2VzIHRoZSBmaXJzdCBsZXR0ZXIgb2YgZWFjaCBzdHJpbmcgdmFsdWUgaW4gdGhlIGFycmF5IHRvIGNvbnZlcnQgdG8gdW5pcXVlIGNvZGUgY2hhcmFjdGVyIChsb3dlciBjYXNlKVxuICBCdWlsZHMgYSBpbnQgcmFuZ2UgYmFzZWQgb24gdW5pcXVlIGNvZGUgY2hhcnMuXG4gICAqL1xuICBzdHJpbmdUb1N1YlJhbmdlczogZnVuY3Rpb24obiwgcmFuZ2UpIHtcbiAgICB2YXIgY2hhclJhbmdlLCBpLCBvbGRHZXRSYW5nZSwgcmV0LCBzdWJSYW5nZTtcbiAgICBpZiAobiA9PSBudWxsKSB7XG4gICAgICBuID0gNjtcbiAgICB9XG4gICAgaWYgKHJhbmdlID09IG51bGwpIHtcbiAgICAgIHJhbmdlID0gW107XG4gICAgfVxuICAgIGNoYXJSYW5nZSA9IFtdO1xuICAgIGVhY2gocmFuZ2UsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgdmFyIGNoYXI7XG4gICAgICBjaGFyID0gdmFsLnRyaW0oKVswXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKGZhbHNlID09PSBvYmouY29udGFpbnMoY2hhclJhbmdlLCBjaGFyKSkge1xuICAgICAgICByZXR1cm4gY2hhclJhbmdlLnB1c2goY2hhci5jaGFyQ29kZUF0KCkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldCA9IHJuZy50b1N1YlJhbmdlcyhuLCBjaGFyUmFuZ2UpO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgbikge1xuICAgICAgaSArPSAxO1xuICAgICAgc3ViUmFuZ2UgPSByZXRbaV07XG4gICAgICBzdWJSYW5nZS5tYXAoU3RyaW5nLmZyb21DaGFyQ29kZSk7XG4gICAgfVxuICAgIG9sZEdldFJhbmdlID0gcmV0LmdldFJhbmdlO1xuICAgIHJldC5nZXRSYW5nZSA9IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgdmFyIGNoYXIsIGlkeDtcbiAgICAgIGNoYXIgPSB2YWwudHJpbSgpWzBdLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgpO1xuICAgICAgaWR4ID0gb2xkR2V0UmFuZ2UoY2hhcik7XG4gICAgICByZXR1cm4gaWR4O1xuICAgIH07XG4gICAgcmV0dXJuIHJldDtcbiAgfSxcblxuICAvKlxuICBUYWtlIGFuIGFycmF5IG9mIGludCB2YWx1ZXMgYW5kIGEgbnVtYmVyIG9mIHBhcnRpdGlvbnMgdG8gY3JlYXRlLlxuICBEaXZpZGVzIHRoZSBvcmlnaW5hbCBhcnJheSBpbnRvIHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIHN1YiBhcnJheXMuXG4gIE92ZXJmbG93IGlzIHBhc3NlZCB0byB0aGUgZmluYWwgcGFydGl0aW9uLlxuICAgKi9cbiAgdG9TdWJSYW5nZXM6IGZ1bmN0aW9uKG4sIHJhbmdlKSB7XG4gICAgdmFyIGNodW5rVmFsLCBkaXN0YW5jZSwgaSwganVtcCwgbWFwLCByYW5nZUhpZ2gsIHJhbmdlTG93LCByZXQsIHN1YlJhbmdlLCBzdWJSYW5nZVNpemUsIHN1YlJhbmdlcztcbiAgICBpZiAobiA9PSBudWxsKSB7XG4gICAgICBuID0gNjtcbiAgICB9XG4gICAgaWYgKHJhbmdlID09IG51bGwpIHtcbiAgICAgIHJhbmdlID0gW107XG4gICAgfVxuICAgIHJldCA9IG9iai5vYmplY3QoKTtcbiAgICByYW5nZUxvdyA9IHJuZy5yYW5nZU1pbihyYW5nZSk7XG4gICAgcmFuZ2VIaWdoID0gcm5nLnJhbmdlTWF4KHJhbmdlKTtcbiAgICBkaXN0YW5jZSA9IHJhbmdlSGlnaCAtIHJhbmdlTG93O1xuICAgIHN1YlJhbmdlU2l6ZSA9IGRpc3RhbmNlIC8gbjtcbiAgICBzdWJSYW5nZXMgPSByZXQuYWRkKCdyYW5nZXMnLCBvYmoub2JqZWN0KCkpO1xuICAgIGNodW5rVmFsID0gcmFuZ2VMb3c7XG4gICAgbWFwID0gb2JqLm9iamVjdCgpO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgbikge1xuICAgICAgaSArPSAxO1xuICAgICAgaWYgKGkgPCBuKSB7XG4gICAgICAgIGp1bXAgPSBNYXRoLnJvdW5kKHN1YlJhbmdlU2l6ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBqdW1wID0gTWF0aC5mbG9vcihzdWJSYW5nZVNpemUpO1xuICAgICAgICBpZiAoY2h1bmtWYWwgKyBqdW1wIDw9IHJhbmdlSGlnaCkge1xuICAgICAgICAgIGp1bXAgKz0gcmFuZ2VIaWdoIC0gY2h1bmtWYWwgLSBqdW1wICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3ViUmFuZ2UgPSBybmcucmFuZ2UoY2h1bmtWYWwsIGNodW5rVmFsICsganVtcCk7XG4gICAgICBlYWNoKHN1YlJhbmdlLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgcmV0dXJuIG1hcC5hZGQodmFsLCBpKTtcbiAgICAgIH0pO1xuICAgICAgc3ViUmFuZ2VzW2ldID0gc3ViUmFuZ2U7XG4gICAgICBjaHVua1ZhbCArPSBqdW1wO1xuICAgIH1cbiAgICByZXQuYWRkKCdnZXRSYW5nZScsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgcmV0dXJuIG1hcFt2YWxdO1xuICAgIH0pO1xuICAgIHJldHVybiByZXQ7XG4gIH1cbn07XG5cbk9iamVjdC5zZWFsKHJuZyk7XG5cbk9iamVjdC5mcmVlemUocm5nKTtcblxuT0oucmVnaXN0ZXIoJ3JhbmdlcycsIHJuZyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcm5nO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeDBiMjlzYzF4Y2NtRnVaMlZ6TG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPMEZCUVVFc1NVRkJRU3h4UWtGQlFUdEZRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlEwb3NSMEZCUVN4SFFVRk5MRTlCUVVFc1EwRkJVU3huUWtGQlVqczdRVUZEVGl4SlFVRkJMRWRCUVU4c1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlNWQXNSMEZCUVN4SFFVbEZPMFZCUVVFc1MwRkJRU3hGUVVGUExGTkJRVUU3UVVGRFRDeFJRVUZCTzBsQlJFMDdWMEZEVGl4RFFVRkRMRU5CUVVNc1MwRkJSaXhWUVVGUkxFMUJRVkk3UlVGRVN5eERRVUZRTzBWQlMwRXNVVUZCUVN4RlFVRlZMRk5CUVVFN1FVRkRVaXhSUVVGQk8wbEJSRk03VjBGRFZDeERRVUZETEVOQlFVTXNSMEZCUml4VlFVRk5MRTFCUVU0N1JVRkVVU3hEUVV4V08wVkJWVUVzVVVGQlFTeEZRVUZWTEZOQlFVRTdRVUZEVWl4UlFVRkJPMGxCUkZNN1YwRkRWQ3hEUVVGRExFTkJRVU1zUjBGQlJpeFZRVUZOTEUxQlFVNDdSVUZFVVN4RFFWWldPenRCUVdOQk96czdPenRGUVV0QkxHbENRVUZCTEVWQlFXMUNMRk5CUVVNc1EwRkJSQ3hGUVVGUkxFdEJRVkk3UVVGRGFrSXNVVUZCUVRzN1RVRkVhMElzU1VGQlNUczdPMDFCUVVjc1VVRkJVVHM3U1VGRGFrTXNVMEZCUVN4SFFVRlpPMGxCUjFvc1NVRkJRU3hEUVVGTExFdEJRVXdzUlVGQldTeFRRVUZETEVkQlFVUTdRVUZEVml4VlFVRkJPMDFCUVVFc1NVRkJRU3hIUVVGUExFZEJRVWNzUTBGQlF5eEpRVUZLTEVOQlFVRXNRMEZCVnl4RFFVRkJMRU5CUVVFc1EwRkJSU3hEUVVGRExGZEJRV1FzUTBGQlFUdE5RVU5RTEVsQlFVY3NTMEZCUVN4TFFVRlRMRWRCUVVjc1EwRkJReXhSUVVGS0xFTkJRV0VzVTBGQllpeEZRVUYzUWl4SlFVRjRRaXhEUVVGYU8yVkJRMFVzVTBGQlV5eERRVUZETEVsQlFWWXNRMEZCWlN4SlFVRkpMRU5CUVVNc1ZVRkJUQ3hEUVVGQkxFTkJRV1lzUlVGRVJqczdTVUZHVlN4RFFVRmFPMGxCUzBFc1IwRkJRU3hIUVVGTkxFZEJRVWNzUTBGQlF5eFhRVUZLTEVOQlFXZENMRU5CUVdoQ0xFVkJRVzFDTEZOQlFXNUNPMGxCUlU0c1EwRkJRU3hIUVVGSk8wRkJRMG9zVjBGQlRTeERRVUZCTEVkQlFVa3NRMEZCVmp0TlFVTkZMRU5CUVVFc1NVRkJTenROUVVOTUxGRkJRVUVzUjBGQlZ5eEhRVUZKTEVOQlFVRXNRMEZCUVR0TlFVTm1MRkZCUVZFc1EwRkJReXhIUVVGVUxFTkJRV0VzVFVGQlRTeERRVUZETEZsQlFYQkNPMGxCU0VZN1NVRkxRU3hYUVVGQkxFZEJRV01zUjBGQlJ5eERRVUZETzBsQlEyeENMRWRCUVVjc1EwRkJReXhSUVVGS0xFZEJRV1VzVTBGQlF5eEhRVUZFTzBGQlEySXNWVUZCUVR0TlFVRkJMRWxCUVVFc1IwRkJUeXhIUVVGSExFTkJRVU1zU1VGQlNpeERRVUZCTEVOQlFWY3NRMEZCUVN4RFFVRkJMRU5CUVVVc1EwRkJReXhYUVVGa0xFTkJRVUVzUTBGQk1rSXNRMEZCUXl4VlFVRTFRaXhEUVVGQk8wMUJRMUFzUjBGQlFTeEhRVUZOTEZkQlFVRXNRMEZCV1N4SlFVRmFPMkZCUTA0N1NVRklZVHRYUVVsbU8wVkJkRUpwUWl4RFFXNUNia0k3TzBGQk5FTkJPenM3T3p0RlFVdEJMRmRCUVVFc1JVRkJZU3hUUVVGRExFTkJRVVFzUlVGQlVTeExRVUZTTzBGQlExZ3NVVUZCUVRzN1RVRkVXU3hKUVVGSk96czdUVUZCUnl4UlFVRlJPenRKUVVNelFpeEhRVUZCTEVkQlFVMHNSMEZCUnl4RFFVRkRMRTFCUVVvc1EwRkJRVHRKUVVOT0xGRkJRVUVzUjBGQlZ5eEhRVUZITEVOQlFVTXNVVUZCU2l4RFFVRmhMRXRCUVdJN1NVRkRXQ3hUUVVGQkxFZEJRVmtzUjBGQlJ5eERRVUZETEZGQlFVb3NRMEZCWVN4TFFVRmlPMGxCUlZvc1VVRkJRU3hIUVVGWExGTkJRVUVzUjBGQldUdEpRVU4yUWl4WlFVRkJMRWRCUVdVc1VVRkJRU3hIUVVGVE8wbEJRM2hDTEZOQlFVRXNSMEZCV1N4SFFVRkhMRU5CUVVNc1IwRkJTaXhEUVVGUkxGRkJRVklzUlVGQmEwSXNSMEZCUnl4RFFVRkRMRTFCUVVvc1EwRkJRU3hEUVVGc1FqdEpRVU5hTEZGQlFVRXNSMEZCVnp0SlFVVllMRWRCUVVFc1IwRkJUU3hIUVVGSExFTkJRVU1zVFVGQlNpeERRVUZCTzBsQlJVNHNRMEZCUVN4SFFVRkpPMEZCUTBvc1YwRkJUU3hEUVVGQkxFZEJRVWtzUTBGQlZqdE5RVU5GTEVOQlFVRXNTVUZCU3p0TlFVTk1MRWxCUVVjc1EwRkJRU3hIUVVGSkxFTkJRVkE3VVVGQll5eEpRVUZCTEVkQlFVOHNTVUZCU1N4RFFVRkRMRXRCUVV3c1EwRkJWeXhaUVVGWUxFVkJRWEpDTzA5QlFVRXNUVUZCUVR0UlFVVkZMRWxCUVVFc1IwRkJUeXhKUVVGSkxFTkJRVU1zUzBGQlRDeERRVUZYTEZsQlFWZzdVVUZEVUN4SlFVRkhMRkZCUVVFc1IwRkJWeXhKUVVGWUxFbEJRVzFDTEZOQlFYUkNPMVZCUTBVc1NVRkJRU3hKUVVGUkxGTkJRVUVzUjBGQldTeFJRVUZhTEVkQlFYVkNMRWxCUVhaQ0xFZEJRVGhDTEVWQlJIaERPMU5CU0VZN08wMUJUVUVzVVVGQlFTeEhRVUZYTEVkQlFVY3NRMEZCUXl4TFFVRktMRU5CUVZVc1VVRkJWaXhGUVVGdlFpeFJRVUZCTEVkQlFWY3NTVUZCTDBJN1RVRkRXQ3hKUVVGQkxFTkJRVXNzVVVGQlRDeEZRVUZsTEZOQlFVTXNSMEZCUkR0bFFVRlRMRWRCUVVjc1EwRkJReXhIUVVGS0xFTkJRVkVzUjBGQlVpeEZRVUZoTEVOQlFXSTdUVUZCVkN4RFFVRm1PMDFCUTBFc1UwRkJWU3hEUVVGQkxFTkJRVUVzUTBGQlZpeEhRVUZsTzAxQlEyWXNVVUZCUVN4SlFVRlpPMGxCV0dRN1NVRmhRU3hIUVVGSExFTkJRVU1zUjBGQlNpeERRVUZSTEZWQlFWSXNSVUZCYjBJc1UwRkJReXhIUVVGRU8yRkJRMnhDTEVkQlFVa3NRMEZCUVN4SFFVRkJPMGxCUkdNc1EwRkJjRUk3VjBGSFFUdEZRVGRDVnl4RFFXcEVZanM3TzBGQlowWkdMRTFCUVUwc1EwRkJReXhKUVVGUUxFTkJRVmtzUjBGQldqczdRVUZEUVN4TlFVRk5MRU5CUVVNc1RVRkJVQ3hEUVVGakxFZEJRV1E3TzBGQlJVRXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3hSUVVGYUxFVkJRWE5DTEVkQlFYUkNPenRCUVVOQkxFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKUFNpQTlJSEpsY1hWcGNtVWdKeTR1TDI5cUoxeHlYRzVmSUQwZ2NtVnhkV2x5WlNBbmJHOWtZWE5vSjF4eVhHNXZZbW9nUFNCeVpYRjFhWEpsSUNjdUxpOWpiM0psTDI5aWFtVmpkQ2RjY2x4dVpXRmphQ0E5SUhKbGNYVnBjbVVnSnk0dlpXRmphQ2RjY2x4dVhISmNiaU1nSXlCeVlXNW5aWE5jY2x4dVhISmNibkp1WnlBOVhISmNibHh5WEc0Z0lDTWdJeU1nY21GdVoyVmNjbHh1SUNBaklGVnphVzVuSUZ0TWJ5MUVZWE5vWFNob2RIUndPaTh2Ykc5a1lYTm9MbU52YlM5a2IyTnpJM0poYm1kbEtTZHpJR0J5WVc1blpXQWdiV1YwYUc5a1hISmNiaUFnY21GdVoyVTZJQ2h3WVhKaGJYTXVMaTRwSUMwK1hISmNiaUFnSUNCZkxuSmhibWRsSUhCaGNtRnRjeTR1TGx4eVhHNWNjbHh1SUNBaklDTWpJSEpoYm1kbFRXbHVYSEpjYmlBZ0l5QlZjMmx1WnlCYlRHOHRSR0Z6YUYwb2FIUjBjRG92TDJ4dlpHRnphQzVqYjIwdlpHOWpjeU50YVc0cEozTWdZRzFwYm1BZ2JXVjBhRzlrWEhKY2JpQWdjbUZ1WjJWTmFXNDZJQ2h3WVhKaGJYTXVMaTRwSUMwK1hISmNiaUFnSUNCZkxtMXBiaUJ3WVhKaGJYTXVMaTVjY2x4dVhISmNiaUFnSXlBakl5QnlZVzVuWlUxaGVGeHlYRzRnSUNNZ1ZYTnBibWNnVzB4dkxVUmhjMmhkS0doMGRIQTZMeTlzYjJSaGMyZ3VZMjl0TDJSdlkzTWpiV0Y0S1NkeklHQnRZWGhnSUcxbGRHaHZaRnh5WEc0Z0lISmhibWRsVFdGNE9pQW9jR0Z5WVcxekxpNHVLU0F0UGx4eVhHNGdJQ0FnWHk1dFlYZ2djR0Z5WVcxekxpNHVYSEpjYmx4eVhHNGdJQ01nSXlNZ2MzUnlhVzVuVW1GdVoyVlViMU4xWWxKaGJtZGxjMXh5WEc0Z0lDTWpJMXh5WEc0Z0lGUmhhMlVnWVc0Z1lYSnlZWGtnYjJZZ2MzUnlhVzVuSUhaaGJIVmxjeUJoYm1RZ1lTQnVkVzFpWlhJZ2IyWWdjR0Z5ZEdsMGFXOXVjeUIwYnlCamNtVmhkR1V1WEhKY2JpQWdWWE5sY3lCMGFHVWdabWx5YzNRZ2JHVjBkR1Z5SUc5bUlHVmhZMmdnYzNSeWFXNW5JSFpoYkhWbElHbHVJSFJvWlNCaGNuSmhlU0IwYnlCamIyNTJaWEowSUhSdklIVnVhWEYxWlNCamIyUmxJR05vWVhKaFkzUmxjaUFvYkc5M1pYSWdZMkZ6WlNsY2NseHVJQ0JDZFdsc1pITWdZU0JwYm5RZ2NtRnVaMlVnWW1GelpXUWdiMjRnZFc1cGNYVmxJR052WkdVZ1kyaGhjbk11WEhKY2JpQWdJeU1qWEhKY2JpQWdjM1J5YVc1blZHOVRkV0pTWVc1blpYTTZJQ2h1SUQwZ05pd2djbUZ1WjJVZ1BTQmJYU2tnTFQ1Y2NseHVJQ0FnSUdOb1lYSlNZVzVuWlNBOUlGdGRYSEpjYmx4eVhHNWNjbHh1SUNBZ0lHVmhZMmdnY21GdVoyVXNJQ2gyWVd3cElDMCtYSEpjYmlBZ0lDQWdJR05vWVhJZ1BTQjJZV3d1ZEhKcGJTZ3BXekJkTG5SdlRHOTNaWEpEWVhObEtDbGNjbHh1SUNBZ0lDQWdhV1lnWm1Gc2MyVWdhWE1nYjJKcUxtTnZiblJoYVc1eklHTm9ZWEpTWVc1blpTd2dZMmhoY2x4eVhHNGdJQ0FnSUNBZ0lHTm9ZWEpTWVc1blpTNXdkWE5vSUdOb1lYSXVZMmhoY2tOdlpHVkJkQ2dwWEhKY2JseHlYRzRnSUNBZ2NtVjBJRDBnY201bkxuUnZVM1ZpVW1GdVoyVnpJRzRzSUdOb1lYSlNZVzVuWlZ4eVhHNWNjbHh1SUNBZ0lHa2dQU0F3WEhKY2JpQWdJQ0IzYUdsc1pTQnBJRHdnYmx4eVhHNGdJQ0FnSUNCcElDczlJREZjY2x4dUlDQWdJQ0FnYzNWaVVtRnVaMlVnUFNCeVpYUmJhVjFjY2x4dUlDQWdJQ0FnYzNWaVVtRnVaMlV1YldGd0lGTjBjbWx1Wnk1bWNtOXRRMmhoY2tOdlpHVmNjbHh1WEhKY2JpQWdJQ0J2YkdSSFpYUlNZVzVuWlNBOUlISmxkQzVuWlhSU1lXNW5aVnh5WEc0Z0lDQWdjbVYwTG1kbGRGSmhibWRsSUQwZ0tIWmhiQ2tnTFQ1Y2NseHVJQ0FnSUNBZ1kyaGhjaUE5SUhaaGJDNTBjbWx0S0NsYk1GMHVkRzlNYjNkbGNrTmhjMlVvS1M1amFHRnlRMjlrWlVGMEtDbGNjbHh1SUNBZ0lDQWdhV1I0SUQwZ2IyeGtSMlYwVW1GdVoyVWdZMmhoY2x4eVhHNGdJQ0FnSUNCcFpIaGNjbHh1SUNBZ0lISmxkRnh5WEc1Y2NseHVJQ0FqSUNNaklISmhibWRsVkc5VGRXSlNZVzVuWlhOY2NseHVJQ0FqSXlOY2NseHVJQ0JVWVd0bElHRnVJR0Z5Y21GNUlHOW1JR2x1ZENCMllXeDFaWE1nWVc1a0lHRWdiblZ0WW1WeUlHOW1JSEJoY25ScGRHbHZibk1nZEc4Z1kzSmxZWFJsTGx4eVhHNGdJRVJwZG1sa1pYTWdkR2hsSUc5eWFXZHBibUZzSUdGeWNtRjVJR2x1ZEc4Z2RHaGxJSE53WldOcFptbGxaQ0J1ZFcxaVpYSWdiMllnYzNWaUlHRnljbUY1Y3k1Y2NseHVJQ0JQZG1WeVpteHZkeUJwY3lCd1lYTnpaV1FnZEc4Z2RHaGxJR1pwYm1Gc0lIQmhjblJwZEdsdmJpNWNjbHh1SUNBakl5TmNjbHh1SUNCMGIxTjFZbEpoYm1kbGN6b2dLRzRnUFNBMkxDQnlZVzVuWlNBOUlGdGRLU0F0UGx4eVhHNGdJQ0FnY21WMElEMGdiMkpxTG05aWFtVmpkQ2dwWEhKY2JpQWdJQ0J5WVc1blpVeHZkeUE5SUhKdVp5NXlZVzVuWlUxcGJpQnlZVzVuWlZ4eVhHNGdJQ0FnY21GdVoyVklhV2RvSUQwZ2NtNW5MbkpoYm1kbFRXRjRJSEpoYm1kbFhISmNibHh5WEc0Z0lDQWdaR2x6ZEdGdVkyVWdQU0J5WVc1blpVaHBaMmdnTFNCeVlXNW5aVXh2ZDF4eVhHNGdJQ0FnYzNWaVVtRnVaMlZUYVhwbElEMGdaR2x6ZEdGdVkyVXZibHh5WEc0Z0lDQWdjM1ZpVW1GdVoyVnpJRDBnY21WMExtRmtaQ0FuY21GdVoyVnpKeXdnYjJKcUxtOWlhbVZqZENncFhISmNiaUFnSUNCamFIVnVhMVpoYkNBOUlISmhibWRsVEc5M1hISmNibHh5WEc0Z0lDQWdiV0Z3SUQwZ2IySnFMbTlpYW1WamRDZ3BYSEpjYmx4eVhHNGdJQ0FnYVNBOUlEQmNjbHh1SUNBZ0lIZG9hV3hsSUdrZ1BDQnVYSEpjYmlBZ0lDQWdJR2tnS3owZ01WeHlYRzRnSUNBZ0lDQnBaaUJwSUR3Z2JpQjBhR1Z1SUdwMWJYQWdQU0JOWVhSb0xuSnZkVzVrSUhOMVlsSmhibWRsVTJsNlpWeHlYRzRnSUNBZ0lDQmxiSE5sWEhKY2JpQWdJQ0FnSUNBZ2FuVnRjQ0E5SUUxaGRHZ3VabXh2YjNJZ2MzVmlVbUZ1WjJWVGFYcGxYSEpjYmlBZ0lDQWdJQ0FnYVdZZ1kyaDFibXRXWVd3Z0t5QnFkVzF3SUR3OUlISmhibWRsU0dsbmFGeHlYRzRnSUNBZ0lDQWdJQ0FnYW5WdGNDQXJQU0J5WVc1blpVaHBaMmdnTFNCamFIVnVhMVpoYkNBdElHcDFiWEFnS3lBeFhISmNibHh5WEc0Z0lDQWdJQ0J6ZFdKU1lXNW5aU0E5SUhKdVp5NXlZVzVuWlNCamFIVnVhMVpoYkN3Z1kyaDFibXRXWVd3Z0t5QnFkVzF3WEhKY2JpQWdJQ0FnSUdWaFkyZ2djM1ZpVW1GdVoyVXNJQ2gyWVd3cElDMCtJRzFoY0M1aFpHUWdkbUZzTENCcFhISmNiaUFnSUNBZ0lITjFZbEpoYm1kbGMxdHBYU0E5SUhOMVlsSmhibWRsWEhKY2JpQWdJQ0FnSUdOb2RXNXJWbUZzSUNzOUlHcDFiWEJjY2x4dVhISmNiaUFnSUNCeVpYUXVZV1JrSUNkblpYUlNZVzVuWlNjc0lDaDJZV3dwSUMwK1hISmNiaUFnSUNBZ0lHMWhjRnQyWVd4ZFhISmNibHh5WEc0Z0lDQWdjbVYwWEhKY2JseHlYRzVQWW1wbFkzUXVjMlZoYkNCeWJtZGNjbHh1VDJKcVpXTjBMbVp5WldWNlpTQnlibWRjY2x4dVhISmNiazlLTG5KbFoybHpkR1Z5SUNkeVlXNW5aWE1uTENCeWJtZGNjbHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0J5Ym1kY2NseHVJbDE5IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyICQsIElTLCBPSiwgVE8sIF87XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuSVMgPSByZXF1aXJlKCcuL2lzJyk7XG5cblRPID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBUTygpIHt9XG5cbiAgVE8uYm9vbCA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciByZXRCb29sO1xuICAgIHJldEJvb2wgPSBJU1sndHJ1ZSddKHN0cik7XG4gICAgaWYgKHJldEJvb2wgPT09IGZhbHNlIHx8IHJldEJvb2wgIT09IHRydWUpIHtcbiAgICAgIHJldEJvb2wgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHJldEJvb2w7XG4gIH07XG5cbiAgVE8uRVM1X1RvQm9vbCA9IGZ1bmN0aW9uKHZhbCkge1xuICAgIHJldHVybiB2YWwgIT09IGZhbHNlICYmIHZhbCAhPT0gMCAmJiB2YWwgIT09ICcnICYmIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJyAmJiAodHlwZW9mIHZhbCAhPT0gJ251bWJlcicgfHwgIWlzTmFOKHZhbCkpO1xuICB9O1xuXG4gIFRPLmRhdGVGcm9tVGlja3MgPSBmdW5jdGlvbih0aWNrU3RyKSB7XG4gICAgdmFyIGFyciwgbG9jYWxPZmZzZXQsIG9mZnNldCwgcmV0LCB0aWNrcywgdGljc0RhdGVUaW1lO1xuICAgIHRpY3NEYXRlVGltZSA9IHRoaXMuc3RyaW5nKHRpY2tTdHIpO1xuICAgIHJldCA9IHZvaWQgMDtcbiAgICB0aWNrcyA9IHZvaWQgMDtcbiAgICBvZmZzZXQgPSB2b2lkIDA7XG4gICAgbG9jYWxPZmZzZXQgPSB2b2lkIDA7XG4gICAgYXJyID0gdm9pZCAwO1xuICAgIGlmIChmYWxzZSA9PT0gSVMubnVsbE9yRW1wdHkodGljc0RhdGVUaW1lKSkge1xuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJy8nLCAnJyk7XG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnRGF0ZScsICcnKTtcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcoJywgJycpO1xuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJyknLCAnJyk7XG4gICAgICBhcnIgPSB0aWNzRGF0ZVRpbWUuc3BsaXQoJy0nKTtcbiAgICAgIGlmIChhcnIubGVuZ3RoID4gMSkge1xuICAgICAgICB0aWNrcyA9IHRoaXMubnVtYmVyKGFyclswXSk7XG4gICAgICAgIG9mZnNldCA9IHRoaXMubnVtYmVyKGFyclsxXSk7XG4gICAgICAgIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgICAgICByZXQgPSBuZXcgRGF0ZSh0aWNrcyAtICgobG9jYWxPZmZzZXQgKyAob2Zmc2V0IC8gMTAwICogNjApKSAqIDEwMDApKTtcbiAgICAgIH0gZWxzZSBpZiAoYXJyLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB0aWNrcyA9IHRoaXMubnVtYmVyKGFyclswXSk7XG4gICAgICAgIHJldCA9IG5ldyBEYXRlKHRpY2tzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBUTy5iaW5hcnkgPSBmdW5jdGlvbihvYmopIHtcbiAgICB2YXIgcmV0O1xuICAgIHJldCA9IE5hTjtcbiAgICBpZiAob2JqID09PSAwIHx8IG9iaiA9PT0gJzAnIHx8IG9iaiA9PT0gJycgfHwgb2JqID09PSBmYWxzZSB8fCB0aGlzLnN0cmluZyhvYmopLnRvTG93ZXJDYXNlKCkudHJpbSgpID09PSAnZmFsc2UnKSB7XG4gICAgICByZXQgPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob2JqID09PSAxIHx8IG9iaiA9PT0gJzEnIHx8IG9iaiA9PT0gdHJ1ZSB8fCB0aGlzLnN0cmluZyhvYmopLnRvTG93ZXJDYXNlKCkudHJpbSgpID09PSAndHJ1ZScpIHtcbiAgICAgICAgcmV0ID0gMTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBUTy5udW1iZXIgPSBmdW5jdGlvbihpbnB1dE51bSwgZGVmYXVsdE51bSkge1xuICAgIHZhciByZXRWYWwsIHRyeUdldE51bWJlcjtcbiAgICB0cnlHZXROdW1iZXIgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgdmFyIHJldCwgdHJ5R2V0O1xuICAgICAgICByZXQgPSBOYU47XG4gICAgICAgIGlmIChJUy5udW1iZXIodmFsKSkge1xuICAgICAgICAgIHJldCA9IHZhbDtcbiAgICAgICAgfSBlbHNlIGlmIChJUy5zdHJpbmcodmFsKSB8fCBJUy5ib29sKHZhbCkpIHtcbiAgICAgICAgICB0cnlHZXQgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIG51bTtcbiAgICAgICAgICAgIG51bSA9IF90aGlzLmJpbmFyeSh2YWx1ZSk7XG4gICAgICAgICAgICBpZiAoIUlTLm51bWJlcihudW0pICYmIHZhbHVlKSB7XG4gICAgICAgICAgICAgIG51bSA9ICt2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghSVMubnVtYmVyKG51bSkpIHtcbiAgICAgICAgICAgICAgbnVtID0gXy5wYXJzZUludCh2YWx1ZSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVtO1xuICAgICAgICAgIH07XG4gICAgICAgICAgcmV0ID0gdHJ5R2V0KHZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH07XG4gICAgfSkodGhpcyk7XG4gICAgcmV0VmFsID0gdHJ5R2V0TnVtYmVyKGlucHV0TnVtKTtcbiAgICBpZiAoIUlTLm51bWJlcihyZXRWYWwpKSB7XG4gICAgICByZXRWYWwgPSB0cnlHZXROdW1iZXIoZGVmYXVsdE51bSk7XG4gICAgICBpZiAoIUlTLm51bWJlcihyZXRWYWwpKSB7XG4gICAgICAgIHJldFZhbCA9IE51bWJlci5OYU47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXRWYWw7XG4gIH07XG5cbiAgVE8uc3RyaW5nID0gZnVuY3Rpb24oaW5wdXRTdHIsIGRlZmF1bHRTdHIpIHtcbiAgICB2YXIgcmV0MSwgcmV0MiwgcmV0VmFsLCB0cnlHZXRTdHJpbmc7XG4gICAgdHJ5R2V0U3RyaW5nID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgIHZhciByZXQ7XG4gICAgICAgIHJldCA9IHZvaWQgMDtcbiAgICAgICAgaWYgKElTLnN0cmluZyhzdHIpKSB7XG4gICAgICAgICAgcmV0ID0gc3RyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldCA9ICcnO1xuICAgICAgICAgIGlmIChJUy5ib29sKHN0cikgfHwgSVMubnVtYmVyKHN0cikgfHwgSVMuZGF0ZShzdHIpKSB7XG4gICAgICAgICAgICByZXQgPSBzdHIudG9TdHJpbmcoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgIH07XG4gICAgfSkodGhpcyk7XG4gICAgcmV0MSA9IHRyeUdldFN0cmluZyhpbnB1dFN0cik7XG4gICAgcmV0MiA9IHRyeUdldFN0cmluZyhkZWZhdWx0U3RyKTtcbiAgICByZXRWYWwgPSAnJztcbiAgICBpZiAocmV0MS5sZW5ndGggIT09IDApIHtcbiAgICAgIHJldFZhbCA9IHJldDE7XG4gICAgfSBlbHNlIGlmIChyZXQxID09PSByZXQyIHx8IHJldDIubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXRWYWwgPSByZXQxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXRWYWwgPSByZXQyO1xuICAgIH1cbiAgICByZXR1cm4gcmV0VmFsO1xuICB9O1xuXG4gIHJldHVybiBUTztcblxufSkoKTtcblxuT0oucmVnaXN0ZXIoJ3RvJywgVE8pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRPO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeDBiMjlzYzF4Y2RHOHVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRU3hKUVVGQk96dEJRVUZCTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1QwRkJVanM3UVVGRFRDeERRVUZCTEVkQlFVa3NUMEZCUVN4RFFVRlJMRkZCUVZJN08wRkJRMG9zUTBGQlFTeEhRVUZKTEU5QlFVRXNRMEZCVVN4UlFVRlNPenRCUVVOS0xFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUVUZCVWpzN1FVRkhRenM3TzBWQlIwb3NSVUZCUXl4RFFVRkJMRWxCUVVRc1IwRkJUeXhUUVVGRExFZEJRVVE3UVVGRFRDeFJRVUZCTzBsQlFVRXNUMEZCUVN4SFFVRlZMRVZCUVVjc1EwRkJRU3hOUVVGQkxFTkJRVWdzUTBGQlZ5eEhRVUZZTzBsQlExWXNTVUZCYjBJc1QwRkJRU3hMUVVGWExFdEJRVmdzU1VGQmIwSXNUMEZCUVN4TFFVRmhMRWxCUVhKRU8wMUJRVUVzVDBGQlFTeEhRVUZWTEUxQlFWWTdPMWRCUTBFN1JVRklTenM3UlVGUFVDeEZRVUZETEVOQlFVRXNWVUZCUkN4SFFVRmhMRk5CUVVNc1IwRkJSRHRYUVVOWUxFZEJRVUVzUzBGQlV5eExRVUZVTEVsQlFXMUNMRWRCUVVFc1MwRkJVeXhEUVVFMVFpeEpRVUZyUXl4SFFVRkJMRXRCUVZNc1JVRkJNME1zU1VGQmEwUXNSMEZCUVN4TFFVRlRMRWxCUVRORUxFbEJRVzlGTEU5QlFVOHNSMEZCVUN4TFFVRm5RaXhYUVVGd1JpeEpRVUZ2Unl4RFFVRkRMRTlCUVU4c1IwRkJVQ3hMUVVGblFpeFJRVUZvUWl4SlFVRTBRaXhEUVVGSkxFdEJRVUVzUTBGQlRTeEhRVUZPTEVOQlFXcERPMFZCUkhwR096dEZRVXRpTEVWQlFVTXNRMEZCUVN4aFFVRkVMRWRCUVdkQ0xGTkJRVU1zVDBGQlJEdEJRVU5rTEZGQlFVRTdTVUZCUVN4WlFVRkJMRWRCUVdVc1NVRkJReXhEUVVGQkxFMUJRVVFzUTBGQlVTeFBRVUZTTzBsQlEyWXNSMEZCUVN4SFFVRk5PMGxCUTA0c1MwRkJRU3hIUVVGUk8wbEJRMUlzVFVGQlFTeEhRVUZUTzBsQlExUXNWMEZCUVN4SFFVRmpPMGxCUTJRc1IwRkJRU3hIUVVGTk8wbEJRMDRzU1VGQlJ5eExRVUZCTEV0QlFWTXNSVUZCUlN4RFFVRkRMRmRCUVVnc1EwRkJaU3haUVVGbUxFTkJRVm83VFVGRFJTeFpRVUZCTEVkQlFXVXNXVUZCV1N4RFFVRkRMRTlCUVdJc1EwRkJjVUlzUjBGQmNrSXNSVUZCTUVJc1JVRkJNVUk3VFVGRFppeFpRVUZCTEVkQlFXVXNXVUZCV1N4RFFVRkRMRTlCUVdJc1EwRkJjVUlzVFVGQmNrSXNSVUZCTmtJc1JVRkJOMEk3VFVGRFppeFpRVUZCTEVkQlFXVXNXVUZCV1N4RFFVRkRMRTlCUVdJc1EwRkJjVUlzUjBGQmNrSXNSVUZCTUVJc1JVRkJNVUk3VFVGRFppeFpRVUZCTEVkQlFXVXNXVUZCV1N4RFFVRkRMRTlCUVdJc1EwRkJjVUlzUjBGQmNrSXNSVUZCTUVJc1JVRkJNVUk3VFVGRFppeEhRVUZCTEVkQlFVMHNXVUZCV1N4RFFVRkRMRXRCUVdJc1EwRkJiVUlzUjBGQmJrSTdUVUZEVGl4SlFVRkhMRWRCUVVjc1EwRkJReXhOUVVGS0xFZEJRV0VzUTBGQmFFSTdVVUZEUlN4TFFVRkJMRWRCUVZFc1NVRkJReXhEUVVGQkxFMUJRVVFzUTBGQlVTeEhRVUZKTEVOQlFVRXNRMEZCUVN4RFFVRmFPMUZCUTFJc1RVRkJRU3hIUVVGVExFbEJRVU1zUTBGQlFTeE5RVUZFTEVOQlFWRXNSMEZCU1N4RFFVRkJMRU5CUVVFc1EwRkJXanRSUVVOVUxGZEJRVUVzUjBGQmEwSXNTVUZCUVN4SlFVRkJMRU5CUVVFc1EwRkJUU3hEUVVGRExHbENRVUZRTEVOQlFVRTdVVUZEYkVJc1IwRkJRU3hIUVVGVkxFbEJRVUVzU1VGQlFTeERRVUZOTEV0QlFVRXNSMEZCVVN4RFFVRkRMRU5CUVVNc1YwRkJRU3hIUVVGakxFTkJRVU1zVFVGQlFTeEhRVUZUTEVkQlFWUXNSMEZCWlN4RlFVRm9RaXhEUVVGbUxFTkJRVUVzUjBGQmMwTXNTVUZCZGtNc1EwRkJaQ3hGUVVwYU8wOUJRVUVzVFVGTFN5eEpRVUZITEVkQlFVY3NRMEZCUXl4TlFVRktMRXRCUVdNc1EwRkJha0k3VVVGRFNDeExRVUZCTEVkQlFWRXNTVUZCUXl4RFFVRkJMRTFCUVVRc1EwRkJVU3hIUVVGSkxFTkJRVUVzUTBGQlFTeERRVUZhTzFGQlExSXNSMEZCUVN4SFFVRlZMRWxCUVVFc1NVRkJRU3hEUVVGTExFdEJRVXdzUlVGR1VEdFBRVmhRT3p0WFFXTkJPMFZCY2tKak96dEZRWGxDYUVJc1JVRkJReXhEUVVGQkxFMUJRVVFzUjBGQlV5eFRRVUZETEVkQlFVUTdRVUZEVUN4UlFVRkJPMGxCUVVFc1IwRkJRU3hIUVVGTk8wbEJRMDRzU1VGQlJ5eEhRVUZCTEV0QlFVOHNRMEZCVUN4SlFVRlpMRWRCUVVFc1MwRkJUeXhIUVVGdVFpeEpRVUV3UWl4SFFVRkJMRXRCUVU4c1JVRkJha01zU1VGQmRVTXNSMEZCUVN4TFFVRlBMRXRCUVRsRExFbEJRWFZFTEVsQlFVTXNRMEZCUVN4TlFVRkVMRU5CUVZFc1IwRkJVaXhEUVVGWkxFTkJRVU1zVjBGQllpeERRVUZCTEVOQlFUQkNMRU5CUVVNc1NVRkJNMElzUTBGQlFTeERRVUZCTEV0QlFYRkRMRTlCUVM5R08wMUJRMFVzUjBGQlFTeEhRVUZOTEVWQlJGSTdTMEZCUVN4TlFVRkJPMDFCUlVzc1NVRkJXU3hIUVVGQkxFdEJRVThzUTBGQlVDeEpRVUZaTEVkQlFVRXNTMEZCVHl4SFFVRnVRaXhKUVVFd1FpeEhRVUZCTEV0QlFVOHNTVUZCYWtNc1NVRkJlVU1zU1VGQlF5eERRVUZCTEUxQlFVUXNRMEZCVVN4SFFVRlNMRU5CUVZrc1EwRkJReXhYUVVGaUxFTkJRVUVzUTBGQk1FSXNRMEZCUXl4SlFVRXpRaXhEUVVGQkxFTkJRVUVzUzBGQmNVTXNUVUZCTVVZN1VVRkJRU3hIUVVGQkxFZEJRVTBzUlVGQlRqdFBRVVpNT3p0WFFVZEJPMFZCVEU4N08wVkJaMEpVTEVWQlFVTXNRMEZCUVN4TlFVRkVMRWRCUVZNc1UwRkJReXhSUVVGRUxFVkJRVmNzVlVGQldEdEJRVU5RTEZGQlFVRTdTVUZCUVN4WlFVRkJMRWRCUVdVc1EwRkJRU3hUUVVGQkxFdEJRVUU3WVVGQlFTeFRRVUZETEVkQlFVUTdRVUZEWWl4WlFVRkJPMUZCUVVFc1IwRkJRU3hIUVVGTk8xRkJSVTRzU1VGQlJ5eEZRVUZGTEVOQlFVTXNUVUZCU0N4RFFVRlZMRWRCUVZZc1EwRkJTRHRWUVVORkxFZEJRVUVzUjBGQlRTeEpRVVJTTzFOQlFVRXNUVUZIU3l4SlFVRkhMRVZCUVVVc1EwRkJReXhOUVVGSUxFTkJRVlVzUjBGQlZpeERRVUZCTEVsQlFXdENMRVZCUVVVc1EwRkJReXhKUVVGSUxFTkJRVkVzUjBGQlVpeERRVUZ5UWp0VlFVTklMRTFCUVVFc1IwRkJVeXhUUVVGRExFdEJRVVE3UVVGRFVDeG5Ra0ZCUVR0WlFVRkJMRWRCUVVFc1IwRkJUU3hMUVVGRExFTkJRVUVzVFVGQlJDeERRVUZSTEV0QlFWSTdXVUZEVGl4SlFVRnBRaXhEUVVGSkxFVkJRVVVzUTBGQlF5eE5RVUZJTEVOQlFWVXNSMEZCVml4RFFVRktMRWxCUVhWQ0xFdEJRWGhETzJOQlFVRXNSMEZCUVN4SFFVRk5MRU5CUVVNc1RVRkJVRHM3V1VGRFFTeEpRVUU0UWl4RFFVRkpMRVZCUVVVc1EwRkJReXhOUVVGSUxFTkJRVlVzUjBGQlZpeERRVUZzUXp0alFVRkJMRWRCUVVFc1IwRkJUU3hEUVVGRExFTkJRVU1zVVVGQlJpeERRVUZYTEV0QlFWZ3NSVUZCYTBJc1EwRkJiRUlzUlVGQlRqczdiVUpCUTBFN1ZVRktUenRWUVV0VUxFZEJRVUVzUjBGQlRTeE5RVUZCTEVOQlFVOHNSMEZCVUN4RlFVNUlPenRsUVU5TU8wMUJZbUU3U1VGQlFTeERRVUZCTEVOQlFVRXNRMEZCUVN4SlFVRkJPMGxCWldZc1RVRkJRU3hIUVVGVExGbEJRVUVzUTBGQllTeFJRVUZpTzBsQlExUXNTVUZCUnl4RFFVRkpMRVZCUVVVc1EwRkJReXhOUVVGSUxFTkJRVlVzVFVGQlZpeERRVUZRTzAxQlEwVXNUVUZCUVN4SFFVRlRMRmxCUVVFc1EwRkJZU3hWUVVGaU8wMUJRMVFzU1VGQmRVSXNRMEZCU1N4RlFVRkZMRU5CUVVNc1RVRkJTQ3hEUVVGVkxFMUJRVllzUTBGQk0wSTdVVUZCUVN4TlFVRkJMRWRCUVZNc1RVRkJUU3hEUVVGRExFbEJRV2hDTzA5QlJrWTdPMWRCUjBFN1JVRndRazg3TzBWQmQwSlVMRVZCUVVNc1EwRkJRU3hOUVVGRUxFZEJRVk1zVTBGQlF5eFJRVUZFTEVWQlFWY3NWVUZCV0R0QlFVTlFMRkZCUVVFN1NVRkJRU3haUVVGQkxFZEJRV1VzUTBGQlFTeFRRVUZCTEV0QlFVRTdZVUZCUVN4VFFVRkRMRWRCUVVRN1FVRkRZaXhaUVVGQk8xRkJRVUVzUjBGQlFTeEhRVUZOTzFGQlEwNHNTVUZCUnl4RlFVRkZMRU5CUVVNc1RVRkJTQ3hEUVVGVkxFZEJRVllzUTBGQlNEdFZRVU5GTEVkQlFVRXNSMEZCVFN4SlFVUlNPMU5CUVVFc1RVRkJRVHRWUVVkRkxFZEJRVUVzUjBGQlRUdFZRVU5PTEVsQlFYbENMRVZCUVVVc1EwRkJReXhKUVVGSUxFTkJRVkVzUjBGQlVpeERRVUZCTEVsQlFXZENMRVZCUVVVc1EwRkJReXhOUVVGSUxFTkJRVlVzUjBGQlZpeERRVUZvUWl4SlFVRnJReXhGUVVGRkxFTkJRVU1zU1VGQlNDeERRVUZSTEVkQlFWSXNRMEZCTTBRN1dVRkJRU3hIUVVGQkxFZEJRVTBzUjBGQlJ5eERRVUZETEZGQlFVb3NRMEZCUVN4RlFVRk9PMWRCU2tZN08yVkJTMEU3VFVGUVlUdEpRVUZCTEVOQlFVRXNRMEZCUVN4RFFVRkJMRWxCUVVFN1NVRlJaaXhKUVVGQkxFZEJRVThzV1VGQlFTeERRVUZoTEZGQlFXSTdTVUZEVUN4SlFVRkJMRWRCUVU4c1dVRkJRU3hEUVVGaExGVkJRV0k3U1VGRFVDeE5RVUZCTEVkQlFWTTdTVUZEVkN4SlFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTUxFdEJRV2xDTEVOQlFYQkNPMDFCUTBVc1RVRkJRU3hIUVVGVExFdEJSRmc3UzBGQlFTeE5RVVZMTEVsQlFVY3NTVUZCUVN4TFFVRlJMRWxCUVZJc1NVRkJaMElzU1VGQlNTeERRVUZETEUxQlFVd3NTMEZCWlN4RFFVRnNRenROUVVOSUxFMUJRVUVzUjBGQlV5eExRVVJPTzB0QlFVRXNUVUZCUVR0TlFVZElMRTFCUVVFc1IwRkJVeXhMUVVoT096dFhRVWxNTzBWQmJFSlBPenM3T3pzN1FVRnZRbGdzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4SlFVRmFMRVZCUVd0Q0xFVkJRV3hDT3p0QlFVTkJMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SlBTaUE5SUhKbGNYVnBjbVVnSnk0dUwyOXFKMXh5WEc0a0lEMGdjbVZ4ZFdseVpTQW5hbkYxWlhKNUoxeHlYRzVmSUQwZ2NtVnhkV2x5WlNBbmJHOWtZWE5vSjF4eVhHNUpVeUE5SUhKbGNYVnBjbVVnSnk0dmFYTW5YSEpjYmx4eVhHNGpJQ01nZEc5Y2NseHVZMnhoYzNNZ1ZFOGdYSEpjYmlBZ0l5QWpJeUJpYjI5c1hISmNiaUFnSXlCamIyNTJaWEowSUdGdWVTQmpiMjF3WVhScFlteGxJRzlpYW1WamRDQjBieUJoSUdKdmIyeGxZVzR1SUVsdVkyOXRjR0YwYVdKc1pTQnZZbXBsWTNSeklHRnlaU0JtWVd4elpTNWNjbHh1SUNCQVltOXZiRG9nS0hOMGNpa2dMVDVjY2x4dUlDQWdJSEpsZEVKdmIyd2dQU0JKVTFzbmRISjFaU2RkS0hOMGNpbGNjbHh1SUNBZ0lISmxkRUp2YjJ3Z1BTQm1ZV3h6WlNBZ2FXWWdjbVYwUW05dmJDQnBjeUJtWVd4elpTQnZjaUJ5WlhSQ2IyOXNJR2x6Ym5RZ2RISjFaVnh5WEc0Z0lDQWdjbVYwUW05dmJGeHlYRzVjY2x4dUlDQWpJQ01qSUVWVE5WOVViMEp2YjJ4Y2NseHVJQ0FqSUNoa1pXSjFaeWtnYldWMGFHOWtJSFJ2SUdWNGNHeHBZMmwwYkhrZ1ptOXlZMlVnWVc0Z1lHbG1LRzlpYWlsZ0lHVjJZV3gxWVhScGIyNGdkRzhnWm14dmR5QjBhSEp2ZFdkb0lIUm9aU0JGVXpVZ2MzQmxZeUJtYjNJZ2RISjFkR2hwYm1WemMxeHlYRzRnSUVCRlV6VmZWRzlDYjI5c09pQW9kbUZzS1NBdFBseHlYRzRnSUNBZ2RtRnNJR2x6Ym5RZ1ptRnNjMlVnWVc1a0lIWmhiQ0JwYzI1MElEQWdZVzVrSUhaaGJDQnBjMjUwSUNjbklHRnVaQ0IyWVd3Z2FYTnVkQ0J1ZFd4c0lHRnVaQ0IwZVhCbGIyWWdkbUZzSUdsemJuUWdKM1Z1WkdWbWFXNWxaQ2NnWVc1a0lDaDBlWEJsYjJZZ2RtRnNJR2x6Ym5RZ0oyNTFiV0psY2ljZ2IzSWdibTkwSUdselRtRk9LSFpoYkNrcFhISmNibHh5WEc0Z0lDTWdJeU1nWkdGMFpVWnliMjFVYVdOcmMxeHlYRzRnSUNNZ2RHRnJaU0JoSUc1MWJXSmxjaUJ5WlhCeVpYTmxiblJwYm1jZ2RHbGphM01nWVc1a0lHTnZiblpsY25RZ2FYUWdhVzUwYnlCaGJpQnBibk4wWVc1alpTQnZaaUJFWVhSbFhISmNiaUFnUUdSaGRHVkdjbTl0VkdsamEzTTZJQ2gwYVdOclUzUnlLU0F0UGx4eVhHNGdJQ0FnZEdsamMwUmhkR1ZVYVcxbElEMGdRSE4wY21sdVp5aDBhV05yVTNSeUtWeHlYRzRnSUNBZ2NtVjBJRDBnZFc1a1pXWnBibVZrWEhKY2JpQWdJQ0IwYVdOcmN5QTlJSFZ1WkdWbWFXNWxaRnh5WEc0Z0lDQWdiMlptYzJWMElEMGdkVzVrWldacGJtVmtYSEpjYmlBZ0lDQnNiMk5oYkU5bVpuTmxkQ0E5SUhWdVpHVm1hVzVsWkZ4eVhHNGdJQ0FnWVhKeUlEMGdkVzVrWldacGJtVmtYSEpjYmlBZ0lDQnBaaUJtWVd4elpTQnBjeUJKVXk1dWRXeHNUM0pGYlhCMGVTaDBhV056UkdGMFpWUnBiV1VwWEhKY2JpQWdJQ0FnSUhScFkzTkVZWFJsVkdsdFpTQTlJSFJwWTNORVlYUmxWR2x0WlM1eVpYQnNZV05sS0Njdkp5d2dKeWNwWEhKY2JpQWdJQ0FnSUhScFkzTkVZWFJsVkdsdFpTQTlJSFJwWTNORVlYUmxWR2x0WlM1eVpYQnNZV05sS0NkRVlYUmxKeXdnSnljcFhISmNiaUFnSUNBZ0lIUnBZM05FWVhSbFZHbHRaU0E5SUhScFkzTkVZWFJsVkdsdFpTNXlaWEJzWVdObEtDY29KeXdnSnljcFhISmNiaUFnSUNBZ0lIUnBZM05FWVhSbFZHbHRaU0E5SUhScFkzTkVZWFJsVkdsdFpTNXlaWEJzWVdObEtDY3BKeXdnSnljcFhISmNiaUFnSUNBZ0lHRnljaUE5SUhScFkzTkVZWFJsVkdsdFpTNXpjR3hwZENnbkxTY3BYSEpjYmlBZ0lDQWdJR2xtSUdGeWNpNXNaVzVuZEdnZ1BpQXhYSEpjYmlBZ0lDQWdJQ0FnZEdsamEzTWdQU0JBYm5WdFltVnlLR0Z5Y2xzd1hTbGNjbHh1SUNBZ0lDQWdJQ0J2Wm1aelpYUWdQU0JBYm5WdFltVnlLR0Z5Y2xzeFhTbGNjbHh1SUNBZ0lDQWdJQ0JzYjJOaGJFOW1abk5sZENBOUlHNWxkeUJFWVhSbEtDa3VaMlYwVkdsdFpYcHZibVZQWm1aelpYUW9LVnh5WEc0Z0lDQWdJQ0FnSUhKbGRDQTlJRzVsZHlCRVlYUmxLQ2gwYVdOcmN5QXRJQ2dvYkc5allXeFBabVp6WlhRZ0t5QW9iMlptYzJWMElDOGdNVEF3SUNvZ05qQXBLU0FxSURFd01EQXBLU2xjY2x4dUlDQWdJQ0FnWld4elpTQnBaaUJoY25JdWJHVnVaM1JvSUdseklERmNjbHh1SUNBZ0lDQWdJQ0IwYVdOcmN5QTlJRUJ1ZFcxaVpYSW9ZWEp5V3pCZEtWeHlYRzRnSUNBZ0lDQWdJSEpsZENBOUlHNWxkeUJFWVhSbEtIUnBZMnR6S1Z4eVhHNGdJQ0FnY21WMFhISmNibHh5WEc0Z0lDTWdJeU1nWW1sdVlYSjVYSEpjYmlBZ0l5QmpiMjUyWlhKMElHRnVJRzlpYW1WamRDQjBieUJpYVc1aGNua2dNQ0J2Y2lBeFhISmNiaUFnUUdKcGJtRnllVG9nS0c5aWFpa2dMVDVjY2x4dUlDQWdJSEpsZENBOUlFNWhUbHh5WEc0Z0lDQWdhV1lnYjJKcUlHbHpJREFnYjNJZ2IySnFJR2x6SUNjd0p5QnZjaUJ2WW1vZ2FYTWdKeWNnYjNJZ2IySnFJR2x6SUdaaGJITmxJRzl5SUVCemRISnBibWNvYjJKcUtTNTBiMHh2ZDJWeVEyRnpaU2dwTG5SeWFXMG9LU0JwY3lBblptRnNjMlVuWEhKY2JpQWdJQ0FnSUhKbGRDQTlJREJjY2x4dUlDQWdJR1ZzYzJVZ2NtVjBJRDBnTVNBZ2FXWWdiMkpxSUdseklERWdiM0lnYjJKcUlHbHpJQ2N4SnlCdmNpQnZZbW9nYVhNZ2RISjFaU0J2Y2lCQWMzUnlhVzVuS0c5aWFpa3VkRzlNYjNkbGNrTmhjMlVvS1M1MGNtbHRLQ2tnYVhNZ0ozUnlkV1VuWEhKY2JpQWdJQ0J5WlhSY2NseHVYSEpjYmx4eVhHNGdJQ01nSXlNZ2JuVnRZbVZ5WEhKY2JpQWdJMXh5WEc0Z0lDTWdRWFIwWlcxd2RITWdkRzhnWTI5dWRtVnlkQ0JoYmlCaGNtSnBkSEpoY25rZ2RtRnNkV1VnZEc4Z1lTQk9kVzFpWlhJdVhISmNiaUFnSXlCTWIyOXpaU0JtWVd4emVTQjJZV3gxWlhNZ1lYSmxJR052Ym5abGNuUmxaQ0IwYnlBd0xseHlYRzRnSUNNZ1RHOXZjMlVnZEhKMWRHaDVJSFpoYkhWbGN5QmhjbVVnWTI5dWRtVnlkR1ZrSUhSdklERXVYSEpjYmlBZ0l5QkJiR3dnYjNSb1pYSWdkbUZzZFdWeklHRnlaU0J3WVhKelpXUWdZWE1nU1c1MFpXZGxjbk11WEhKY2JpQWdJeUJHWVdsc2RYSmxjeUJ5WlhSMWNtNGdZWE1nVG1GT0xseHlYRzRnSUNOY2NseHVJQ0JBYm5WdFltVnlPaUFvYVc1d2RYUk9kVzBzSUdSbFptRjFiSFJPZFcwcElDMCtYSEpjYmlBZ0lDQjBjbmxIWlhST2RXMWlaWElnUFNBb2RtRnNLU0E5UGx4eVhHNGdJQ0FnSUNCeVpYUWdQU0JPWVU1Y2NseHVJQ0FnSUNBZ0l5QnBaaUJnZG1Gc1lDQmhiSEpsWVdSNUlDaHBjeWxiYVhNdWFIUnRiRjBnWVNCT2RXMWlaWElzSUhKbGRIVnliaUJwZEZ4eVhHNGdJQ0FnSUNCcFppQkpVeTV1ZFcxaVpYSW9kbUZzS1Z4eVhHNGdJQ0FnSUNBZ0lISmxkQ0E5SUhaaGJGeHlYRzRnSUNBZ0lDQWpJR1ZzYzJVZ2FXWWdZSFpoYkdBZ1lXeHlaV0ZrZVNBb2FYTXBXMmx6TG1oMGJXeGRJR0VnVTNSeWFXNW5JRzl5SUdFZ1FtOXZiR1ZoYml3Z1kyOXVkbVZ5ZENCcGRGeHlYRzRnSUNBZ0lDQmxiSE5sSUdsbUlFbFRMbk4wY21sdVp5aDJZV3dwSUc5eUlFbFRMbUp2YjJ3b2RtRnNLVnh5WEc0Z0lDQWdJQ0FnSUhSeWVVZGxkQ0E5SUNoMllXeDFaU2tnUFQ1Y2NseHVJQ0FnSUNBZ0lDQWdJRzUxYlNBOUlFQmlhVzVoY25rb2RtRnNkV1VwWEhKY2JpQWdJQ0FnSUNBZ0lDQnVkVzBnUFNBcmRtRnNkV1VnSUdsbUlHNXZkQ0JKVXk1dWRXMWlaWElvYm5WdEtTQmhibVFnZG1Gc2RXVmNjbHh1SUNBZ0lDQWdJQ0FnSUc1MWJTQTlJRjh1Y0dGeWMyVkpiblFvZG1Gc2RXVXNJREFwSUdsbUlHNXZkQ0JKVXk1dWRXMWlaWElvYm5WdEtWeHlYRzRnSUNBZ0lDQWdJQ0FnYm5WdFhISmNiaUFnSUNBZ0lDQWdjbVYwSUQwZ2RISjVSMlYwSUhaaGJGeHlYRzRnSUNBZ0lDQnlaWFJjY2x4dVhISmNiaUFnSUNCeVpYUldZV3dnUFNCMGNubEhaWFJPZFcxaVpYSW9hVzV3ZFhST2RXMHBYSEpjYmlBZ0lDQnBaaUJ1YjNRZ1NWTXViblZ0WW1WeUtISmxkRlpoYkNsY2NseHVJQ0FnSUNBZ2NtVjBWbUZzSUQwZ2RISjVSMlYwVG5WdFltVnlLR1JsWm1GMWJIUk9kVzBwWEhKY2JpQWdJQ0FnSUhKbGRGWmhiQ0E5SUU1MWJXSmxjaTVPWVU0Z2FXWWdibTkwSUVsVExtNTFiV0psY2loeVpYUldZV3dwWEhKY2JpQWdJQ0J5WlhSV1lXeGNjbHh1WEhKY2JpQWdJeUFqSXlCemRISnBibWRjY2x4dUlDQWpJR052Ym5abGNuUWdZVzRnYjJKcVpXTjBJSFJ2SUhOMGNtbHVaMXh5WEc0Z0lFQnpkSEpwYm1jNklDaHBibkIxZEZOMGNpd2daR1ZtWVhWc2RGTjBjaWtnTFQ1Y2NseHVJQ0FnSUhSeWVVZGxkRk4wY21sdVp5QTlJQ2h6ZEhJcElEMCtYSEpjYmlBZ0lDQWdJSEpsZENBOUlIVnVaR1ZtYVc1bFpGeHlYRzRnSUNBZ0lDQnBaaUJKVXk1emRISnBibWNvYzNSeUtWeHlYRzRnSUNBZ0lDQWdJSEpsZENBOUlITjBjbHh5WEc0Z0lDQWdJQ0JsYkhObFhISmNiaUFnSUNBZ0lDQWdjbVYwSUQwZ0p5ZGNjbHh1SUNBZ0lDQWdJQ0J5WlhRZ1BTQnpkSEl1ZEc5VGRISnBibWNvS1NBZ2FXWWdTVk11WW05dmJDaHpkSElwSUc5eUlFbFRMbTUxYldKbGNpaHpkSElwSUc5eUlFbFRMbVJoZEdVb2MzUnlLVnh5WEc0Z0lDQWdJQ0J5WlhSY2NseHVJQ0FnSUhKbGRERWdQU0IwY25sSFpYUlRkSEpwYm1jb2FXNXdkWFJUZEhJcFhISmNiaUFnSUNCeVpYUXlJRDBnZEhKNVIyVjBVM1J5YVc1bktHUmxabUYxYkhSVGRISXBYSEpjYmlBZ0lDQnlaWFJXWVd3Z1BTQW5KMXh5WEc0Z0lDQWdhV1lnY21WME1TNXNaVzVuZEdnZ2FYTnVkQ0F3WEhKY2JpQWdJQ0FnSUhKbGRGWmhiQ0E5SUhKbGRERmNjbHh1SUNBZ0lHVnNjMlVnYVdZZ2NtVjBNU0JwY3lCeVpYUXlJRzl5SUhKbGRESXViR1Z1WjNSb0lHbHpJREJjY2x4dUlDQWdJQ0FnY21WMFZtRnNJRDBnY21WME1WeHlYRzRnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0J5WlhSV1lXd2dQU0J5WlhReVhISmNiaUFnSUNCeVpYUldZV3hjY2x4dVhISmNiazlLTG5KbFoybHpkR1Z5SUNkMGJ5Y3NJRlJQWEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1ZFOGlYWDA9IiwiIyAjIGNyZWF0ZVVVSURcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbiMjI1xyXG5HZW5lcmF0ZXMgYSByYW5kb20gc3RyaW5nIHRoYXQgY29tcGxpZXMgdG8gdGhlIFJGQyA0MTIyIHNwZWNpZmljYXRpb24gZm9yIEdVSUQvVVVJRC5cclxuKGUuZy4gJ0I0MkExNTNGLTFEOUEtNEY5Mi05OTAzLTkyQzExREQ2ODREMicpXHJcbldoaWxlIG5vdCBhIHRydWUgVVVJRCwgZm9yIHRoZSBwdXJwb3NlcyBvZiB0aGlzIGFwcGxpY2F0aW9uLCBpdCBzaG91bGQgYmUgc3VmZmljaWVudC5cclxuIyMjXHJcbmNyZWF0ZUZhdXhVVUlEID0gLT5cclxuICAgIFxyXG4gICMgaHR0cDovL3d3dy5pZXRmLm9yZy9yZmMvcmZjNDEyMi50eHRcclxuICAjIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1MDM0L2hvdy10by1jcmVhdGUtYS1ndWlkLXV1aWQtaW4tamF2YXNjcmlwdFxyXG4gIHMgPSBbXVxyXG4gIHMubGVuZ3RoID0gMzZcclxuICBoZXhEaWdpdHMgPSAnMDEyMzQ1Njc4OWFiY2RlZidcclxuICBpID0gMFxyXG5cclxuICB3aGlsZSBpIDwgMzZcclxuICAgIHNbaV0gPSBoZXhEaWdpdHMuc3Vic3RyKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDB4MTApLCAxKVxyXG4gICAgaSArPSAxXHJcbiAgc1sxNF0gPSAnNCcgIyBiaXRzIDEyLTE1IG9mIHRoZSB0aW1lX2hpX2FuZF92ZXJzaW9uIGZpZWxkIHRvIDAwMTBcclxuICBzWzE5XSA9IGhleERpZ2l0cy5zdWJzdHIoKHNbMTldICYgMHgzKSB8IDB4OCwgMSkgIyBiaXRzIDYtNyBvZiB0aGUgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZCB0byAwMVxyXG4gIHNbOF0gPSBzWzEzXSA9IHNbMThdID0gc1syM10gPSAnLSdcclxuICB1dWlkID0gcy5qb2luKCcnKVxyXG4gIHV1aWRcclxuXHJcbk9KLnJlZ2lzdGVyICdjcmVhdGVVVUlEJywgY3JlYXRlRmF1eFVVSURcclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVGYXV4VVVJRCJdfQ==
