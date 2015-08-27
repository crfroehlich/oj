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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxvYmplY3QuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUNKLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7QUFDWCxRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0FBQ1gsSUFBQSxHQUFPLE9BQUEsQ0FBUSxZQUFSOztBQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsYUFBUjs7QUFJTCxNQUFBLEdBSUU7RUFBQSxNQUFBLEVBQVEsU0FBQyxHQUFEOztNQUFDLE1BQU07OztBQUViOzs7SUFHQSxHQUFHLENBQUMsR0FBSixHQUFVLFNBQUMsSUFBRCxFQUFPLEdBQVA7TUFDUixRQUFBLENBQVMsR0FBVCxFQUFjLElBQWQsRUFBb0IsR0FBcEI7YUFDQTtJQUZRO0lBSVYsR0FBRyxDQUFDLEdBQUosQ0FBUSxNQUFSLEVBQWdCLFNBQUMsUUFBRDtBQUNkLFVBQUE7TUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGVBQVI7YUFDUCxJQUFBLENBQUssR0FBTCxFQUFVLFNBQUMsR0FBRCxFQUFNLEdBQU47UUFDUixJQUFHLEdBQUEsS0FBUyxNQUFULElBQW9CLEdBQUEsS0FBUyxLQUFoQztpQkFDRSxRQUFBLENBQVMsR0FBVCxFQUFjLEdBQWQsRUFERjs7TUFEUSxDQUFWO0lBRmMsQ0FBaEI7V0FNQTtFQWZNLENBQVI7RUFvQkEsWUFBQSxFQUFjLFNBQUMsSUFBRCxFQUFPLEdBQVA7V0FDWixNQUFNLENBQUMsUUFBUCxDQUFnQixJQUFoQixFQUFzQixHQUF0QixDQUFBLElBQStCLEVBQUUsQ0FBQyxJQUFILENBQVEsR0FBSSxDQUFBLElBQUEsQ0FBWjtFQURuQixDQXBCZDtFQXlCQSxRQUFBLEVBQVUsU0FB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QUMsTUFBN0I7O0FBQ0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxRQUFaLEVBQXNCLE1BQU0sQ0FBQyxNQUE3Qjs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiT0ogPSByZXF1aXJlICcuLi9vaidcclxuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcclxucHJvcGVydHkgPSByZXF1aXJlICcuL3Byb3BlcnR5J1xyXG5mdW5jID0gcmVxdWlyZSAnLi9mdW5jdGlvbidcclxudG8gPSByZXF1aXJlICcuLi90b29scy90bydcclxuXHJcbiMgIyBvYmplY3RcclxuXHJcbnJldE9iaiA9IFxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkub2JqZWN0XHJcbiAgIyBjcmVhdGUgYW4gb2JqZWN0IHdpdGggaGVscGVyIGBhZGRgIGFuZCBgZWFjaGAgbWV0aG9kcy5cclxuICBvYmplY3Q6IChvYmogPSB7fSkgLT5cclxuICAgIFxyXG4gICAgIyMjXHJcbiAgICBBZGQgYSBwcm9wZXJ0eSB0byB0aGUgb2JqZWN0IGFuZCByZXR1cm4gaXRcclxuICAgICMjI1xyXG4gICAgb2JqLmFkZCA9IChuYW1lLCB2YWwpIC0+XHJcbiAgICAgIHByb3BlcnR5IG9iaiwgbmFtZSwgdmFsXHJcbiAgICAgIG9ialxyXG5cclxuICAgIG9iai5hZGQgJ2VhY2gnLCAoY2FsbGJhY2spIC0+XHJcbiAgICAgIGVhY2ggPSByZXF1aXJlICcuLi90b29scy9lYWNoJ1xyXG4gICAgICBlYWNoIG9iaiwgKHZhbCwga2V5KSAtPlxyXG4gICAgICAgIGlmIGtleSBpc250ICdlYWNoJyBhbmQga2V5IGlzbnQgJ2FkZCdcclxuICAgICAgICAgIGNhbGxiYWNrIHZhbCwga2V5XHJcblxyXG4gICAgb2JqXHJcblxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuaXNJbnN0YW5jZU9mXHJcbiAgIyBkZXRlcm1pbmVzIGlzIGEgdGhpbmcgaXMgYW4gaW5zdGFuY2Ugb2YgYSBUaGluZywgYXNzdW1pbmcgdGhlIHRoaW5ncyB3ZXJlIGFsbCBjcmVhdGVkIGluIE9KXHJcbiAgaXNJbnN0YW5jZU9mOiAobmFtZSwgb2JqKSAtPlxyXG4gICAgcmV0T2JqLmNvbnRhaW5zKG5hbWUsIG9iaikgYW5kIHRvLmJvb2wob2JqW25hbWVdKVxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuY29udGFpbnNcclxuICAjIHRydWUgaWYgdGhlIGBvYmplY3RgIGNvbnRhaW5zIHRoZSB2YWx1ZVxyXG4gIGNvbnRhaW5zOiAob2JqZWN0LCBpbmRleCkgLT5cclxuICAgIHJldCA9IGZhbHNlXHJcbiAgICBpZiBvYmplY3RcclxuICAgICAgcmV0ID0gXy5jb250YWlucyBvYmplY3QsIGluZGV4XHJcbiAgICByZXRcclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmNvbXBhcmVcclxuICAjIGNvbXBhcmUgdHdvIG9iamVjdHMvYXJyYXlzL3ZhbHVlcyBmb3Igc3RyaWN0IGVxdWFsaXR5XHJcbiAgY29tcGFyZTogKG9iajEsIG9iajIpIC0+XHJcbiAgICBfLmlzRXF1YWwgb2JqMSwgb2JqMlxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuY2xvbmVcclxuICAjIGNvcHkgYWxsIG9mIHRoZSB2YWx1ZXMgKHJlY3Vyc2l2ZWx5KSBmcm9tIG9uZSBvYmplY3QgdG8gYW5vdGhlci5cclxuICBjbG9uZTogKGRhdGEpIC0+XHJcbiAgICBfLmNsb25lRGVlcCBkYXRhIHRydWVcclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLnNlcmlhbGl6ZVxyXG4gICMgQ29udmVydCBhbiBvYmplY3QgdG8gYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBvYmplY3RcclxuICBzZXJpYWxpemU6IChkYXRhKSAtPlxyXG4gICAgcmV0ID0gJydcclxuICAgIGZ1bmMudHJ5RXhlYyAtPlxyXG4gICAgICByZXQgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxyXG4gICAgICByZXR1cm5cclxuICAgIHJldCBvciAnJ1xyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuZGVzZXJpYWxpemVcclxuICAjIENvbnZlcnQgYSBKU09OIHN0cmluZyB0byBhbiBvYmplY3RcclxuICBkZXNlcmlhbGl6ZTogKGRhdGEpIC0+XHJcbiAgICByZXQgPSB7fVxyXG4gICAgaWYgZGF0YVxyXG4gICAgICBmdW5jLnRyeUV4ZWMgLT5cclxuICAgICAgICByZXQgPSAkLnBhcnNlSlNPTihkYXRhKVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgcmV0ID0ge30gIGlmIGlzTWV0aG9kLm51bGxPckVtcHR5KHJldClcclxuICAgIHJldFxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkucGFyYW1zXHJcbiAgIyBDb252ZXJ0IGFuIG9iamVjdCB0byBhIGRlbGltaXRlZCBsaXN0IG9mIHBhcmFtZXRlcnMgKG5vcm1hbGx5IHF1ZXJ5LXN0cmluZyBwYXJhbWV0ZXJzKVxyXG4gIHBhcmFtczogKGRhdGEsIGRlbGltaXRlciA9ICcmJykgLT5cclxuICAgIHJldCA9ICcnXHJcbiAgICBpZiBkZWxpbWl0ZXIgaXMgJyYnXHJcbiAgICAgIGZ1bmMudHJ5RXhlYyAtPlxyXG4gICAgICAgIHJldCA9ICQucGFyYW0oZGF0YSlcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICBlbHNlXHJcbiAgICAgIGVhY2ggPSByZXF1aXJlICcuLi90b29scy9lYWNoJ1xyXG4gICAgICBlYWNoIGRhdGEsICh2YWwsIGtleSkgLT5cclxuICAgICAgICByZXQgKz0gZGVsaW1pdGVyICBpZiByZXQubGVuZ3RoID4gMFxyXG4gICAgICAgIHJldCArPSBrZXkgKyAnPScgKyB2YWxcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICB0by5zdHJpbmcgcmV0XHJcblxyXG4gICMgIyMgW09KXShvai5odG1sKS5leHRlbmRcclxuICAjIGNvcHkgdGhlIHByb3BlcnRpZXMgb2Ygb25lIG9iamVjdCB0byBhbm90aGVyIG9iamVjdFxyXG4gIGV4dGVuZDogKGRlc3RPYmosIHNyY09iaiwgZGVlcENvcHkgPSBmYWxzZSkgLT5cclxuICAgIHJldCA9IGRlc3RPYmogb3Ige31cclxuICAgIGlmIGRlZXBDb3B5IGlzIHRydWVcclxuICAgICAgcmV0ID0gJC5leHRlbmQoZGVlcENvcHksIHJldCwgc3JjT2JqKVxyXG4gICAgZWxzZVxyXG4gICAgICByZXQgPSAkLmV4dGVuZChyZXQsIHNyY09iailcclxuICAgIHJldFxyXG5cclxuXHJcbk9KLnJlZ2lzdGVyICdvYmplY3QnLCByZXRPYmoub2JqZWN0XHJcbk9KLnJlZ2lzdGVyICdpc0luc3RhbmNlT2YnLCByZXRPYmouaXNJbnN0YW5jZU9mXHJcbk9KLnJlZ2lzdGVyICdjb250YWlucycsIHJldE9iai5jb250YWluc1xyXG5PSi5yZWdpc3RlciAnY29tcGFyZScsIHJldE9iai5jb21wYXJlXHJcbk9KLnJlZ2lzdGVyICdjbG9uZScsIHJldE9iai5jbG9uZVxyXG5PSi5yZWdpc3RlciAnc2VyaWFsaXplJywgcmV0T2JqLnNlcmlhbGl6ZVxyXG5PSi5yZWdpc3RlciAnZGVzZXJpYWxpemUnLCByZXRPYmouZGVzZXJpYWxpemVcclxuT0oucmVnaXN0ZXIgJ3BhcmFtcycsIHJldE9iai5wYXJhbXNcclxuT0oucmVnaXN0ZXIgJ2V4dGVuZCcsIHJldE9iai5leHRlbmRcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmV0T2JqIl19
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxvai5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLElBQUE7O0FBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxVQUFSOztBQUNiLE9BQUEsR0FBVSxPQUFBLENBQVEsUUFBUjs7QUFDVixhQUFBLEdBQWdCOzs7QUFFaEI7Ozs7QUFHQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsTUFBTSxDQUFBLFNBQTlCLEVBQ0U7RUFBQSxlQUFBLEVBQ0U7SUFBQSxLQUFBLEVBQU8sU0FBQTtBQUNMLFVBQUE7TUFBQSxhQUFBLEdBQWdCO01BQ2hCLE9BQUEsR0FBVyxhQUFjLENBQUMsSUFBaEIsQ0FBcUIsSUFBQyxDQUFBLFdBQVcsQ0FBQyxRQUFiLENBQUEsQ0FBckI7TUFDVCxJQUFJLE9BQUEsSUFBWSxPQUFPLENBQUMsTUFBUixHQUFpQixDQUFqQztlQUF5QyxPQUFRLENBQUEsQ0FBQSxFQUFqRDtPQUFBLE1BQUE7ZUFBeUQsR0FBekQ7O0lBSEksQ0FBUDtHQURGO0NBREY7OztBQVFBOzs7O0FBR0EsTUFBQSxHQUFTOztBQUNULFlBQUEsR0FBZSxTQUFBOztBQUViOzs7QUFBQSxNQUFBO0VBR0EsYUFBQSxHQUFnQixTQUFDLFNBQUQsRUFBWSxJQUFaOztBQUNkOzs7QUFBQSxRQUFBO0lBR0EsSUFBQSxHQUFPLFNBQUMsTUFBRDtBQUNMLFVBQUE7TUFBQSxLQUFBLEdBQVE7TUFDUixJQUFLLENBQUEsTUFBQSxDQUFMLEdBQWUsSUFBSyxDQUFBLE1BQUEsQ0FBTCxJQUFnQjtNQUMvQixNQUFBLEdBQVMsSUFBSyxDQUFBLE1BQUE7TUFDZCxPQUFBLEdBQVU7TUFFVixNQUFNLENBQUMsY0FBUCxDQUFzQixJQUF0QixFQUE0QixTQUE1QixFQUF1QztRQUFBLEtBQUEsRUFBTzs7QUFFOUM7OztXQUZ1QztPQUF2QztNQU1BLE1BQU0sQ0FBQyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLFVBQTVCLEVBQ0U7UUFB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R0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsVUFBdEIsRUFBa0MsYUFBbEMsRUFDRTtFQUFBLEtBQUEsRUFBTyxZQUFBLENBQUEsQ0FBUDtDQURGOztBQUdBLEVBQUUsQ0FBQyxRQUFILENBQVksUUFBWixFQUFzQixVQUF0Qjs7QUFFQSxZQUFBLEdBQWU7O0FBQ2YsSUFBRyxPQUFPLFFBQVAsS0FBcUIsV0FBeEI7RUFDRSxZQUFBLEdBQWUsU0FEakI7OztBQUdBLEVBQUUsQ0FBQyxRQUFILENBQVksVUFBWixFQUF3QixZQUF4Qjs7QUFFQSxFQUFFLENBQUMsUUFBSCxDQUFZLE1BQVosRUFBb0IsU0FBQSxHQUFBLENBQXBCOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIjICMgT0pcclxudGhpc0dsb2JhbCA9IHJlcXVpcmUgJy4vZ2xvYmFsJ1xyXG51dGlsTGliID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG5uYW1lU3BhY2VOYW1lID0gJ09KJ1xyXG5cclxuIyMjXHJcbmJvb3Qgc3RyYXAgbmFtZSBtZXRob2QgaW50byBPYmplY3QgcHJvdG90eXBlXHJcbiMjI1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBPYmplY3Q6OixcclxuICBnZXRJbnN0YW5jZU5hbWU6XHJcbiAgICB2YWx1ZTogLT5cclxuICAgICAgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLnsxLH0pXFwoL1xyXG4gICAgICByZXN1bHRzID0gKGZ1bmNOYW1lUmVnZXgpLmV4ZWMoQGNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpXHJcbiAgICAgIChpZiAocmVzdWx0cyBhbmQgcmVzdWx0cy5sZW5ndGggPiAxKSB0aGVuIHJlc3VsdHNbMV0gZWxzZSAnJylcclxuXHJcblxyXG4jIyNcclxuQW4gaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5hbWVzcGFjZSB0cmVlXHJcbiMjI1xyXG5Oc1RyZWUgPSB7fVxyXG5tYWtlVGhlSnVpY2UgPSAtPlxyXG5cclxuICAjIyNcclxuICBJbnRlcm5hbCBuYW1lU3BhY2VOYW1lIG1ldGhvZCB0byBjcmVhdGUgbmV3ICdzdWInIG5hbWVzcGFjZXMgb24gYXJiaXRyYXJ5IGNoaWxkIG9iamVjdHMuXHJcbiAgIyMjXHJcbiAgbWFrZU5hbWVTcGFjZSA9IChzcGFjZW5hbWUsIHRyZWUpIC0+XHJcbiAgICAjIyNcclxuICAgIFRoZSBkZXJpdmVkIGluc3RhbmNlIHRvIGJlIGNvbnN0cnVjdGVkXHJcbiAgICAjIyNcclxuICAgIEJhc2UgPSAobnNOYW1lKSAtPlxyXG4gICAgICBwcm90byA9IHRoaXNcclxuICAgICAgdHJlZVtuc05hbWVdID0gdHJlZVtuc05hbWVdIG9yIHt9XHJcbiAgICAgIG5zVHJlZSA9IHRyZWVbbnNOYW1lXVxyXG4gICAgICBtZW1iZXJzID0ge31cclxuXHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAnbWVtYmVycycsIHZhbHVlOiBtZW1iZXJzXHJcblxyXG4gICAgICAjIyNcclxuICAgICAgUmVnaXN0ZXIgKGUuZy4gJ0xpZnQnKSBhbiBPYmplY3QgaW50byB0aGUgcHJvdG90eXBlIG9mIHRoZSBuYW1lc3BhY2UuXHJcbiAgICAgIFRoaXMgT2JqZWN0IHdpbGwgYmUgcmVhZGFibGUvZXhlY3V0YWJsZSBidXQgaXMgb3RoZXJ3aXNlIGltbXV0YWJsZS5cclxuICAgICAgIyMjXHJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAncmVnaXN0ZXInLFxyXG4gICAgICAgIHZhbHVlOiAobmFtZSwgb2JqLCBlbnVtZXJhYmxlKSAtPlxyXG4gICAgICAgICAgJ3VzZSBzdHJpY3QnXHJcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsaWZ0IGEgbmV3IHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIG5hbWUgaXNudCAnc3RyaW5nJykgb3IgbmFtZSBpcyAnJ1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbGlmdCBhIG5ldyBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgcHJvcGVydHkgaW5zdGFuY2UuJykgIHVubGVzcyBvYmpcclxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgbmFtZWQgJyArIG5hbWUgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKSAgaWYgcHJvdG9bbmFtZV1cclxuXHJcbiAgICAgICAgICBtZW1iZXJzW25hbWVdID0gbWVtYmVyc1tuYW1lXSBvciBuYW1lXHJcblxyXG4gICAgICAgICAgI0d1YXJkIGFnYWluc3Qgb2JsaXRlcmF0aW5nIHRoZSB0cmVlIGFzIHRoZSB0cmVlIGlzIHJlY3Vyc2l2ZWx5IGV4dGVuZGVkXHJcbiAgICAgICAgICBuc1RyZWVbbmFtZV0gPSBuc1RyZWVbbmFtZV0gb3JcclxuICAgICAgICAgICAgbmFtZTogbmFtZVxyXG4gICAgICAgICAgICB0eXBlOiB0eXBlb2Ygb2JqXHJcbiAgICAgICAgICAgIGluc3RhbmNlOiAoaWYgb2JqLmdldEluc3RhbmNlTmFtZSB0aGVuIG9iai5nZXRJbnN0YW5jZU5hbWUoKSBlbHNlICd1bmtub3duJylcclxuXHJcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgcHJvdG8sIG5hbWUsXHJcbiAgICAgICAgICAgIHZhbHVlOiBvYmpcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UgaXNudCBlbnVtZXJhYmxlXHJcblxyXG4gICAgICAgICAgbnNJbnRlcm5hbC5hbGVydERlcGVuZGVudHMgbnNOYW1lICsgJy4nICsgc3BhY2VuYW1lICsgJy4nICsgbmFtZVxyXG4gICAgICAgICAgb2JqXHJcblxyXG5cclxuICAgICAgIyMjXHJcbiAgICAgIENyZWF0ZSBhIG5ldywgc3RhdGljIG5hbWVzcGFjZSBvbiB0aGUgY3VycmVudCBwYXJlbnQgKGUuZy4gbnNOYW1lLnRvLi4uIHx8IG5zTmFtZS5pcy4uLilcclxuICAgICAgIyMjXHJcbiAgICAgIHByb3RvLnJlZ2lzdGVyICdtYWtlU3ViTmFtZVNwYWNlJywgKChzdWJOYW1lU3BhY2UpIC0+XHJcbiAgICAgICAgJ3VzZSBzdHJpY3QnXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbmV3IHN1YiBuYW1lc3BhY2Ugd2l0aG91dCBhIHZhbGlkIG5hbWUuJykgIGlmICh0eXBlb2Ygc3ViTmFtZVNwYWNlIGlzbnQgJ3N0cmluZycpIG9yIHN1Yk5hbWVTcGFjZSBpcyAnJ1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU3ViIG5hbWVzcGFjZSBuYW1lZCAnICsgc3ViTmFtZVNwYWNlICsgJyBpcyBhbHJlYWR5IGRlZmluZWQgb24gJyArIHNwYWNlbmFtZSArICcuJykgIGlmIHByb3RvLnN1Yk5hbWVTcGFjZVxyXG4gICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHN1Yk5hbWVTcGFjZVxyXG4gICAgICAgIG5ld05hbWVTcGFjZSA9IG1ha2VOYW1lU3BhY2Uoc3ViTmFtZVNwYWNlLCBuc1RyZWUpXHJcbiAgICAgICAgbmV3TmFtZVNwYWNlLnJlZ2lzdGVyICdjb25zdGFudHMnLCBtYWtlTmFtZVNwYWNlKCdjb25zdGFudHMnLCBuc1RyZWUpLCBmYWxzZSAgaWYgc3ViTmFtZVNwYWNlIGlzbnQgJ2NvbnN0YW50cydcclxuICAgICAgICBwcm90by5yZWdpc3RlciBzdWJOYW1lU3BhY2UsIG5ld05hbWVTcGFjZSwgZmFsc2VcclxuICAgICAgICBuZXdOYW1lU3BhY2VcclxuICAgICAgKSwgZmFsc2VcclxuICAgICAgcmV0dXJuXHJcblxyXG4gICAgIyMjXHJcbiAgICBBbiBpbnRlcm5hbCBtZWNoYW5pc20gdG8gcmVwcmVzZW50IHRoZSBpbnN0YW5jZSBvZiB0aGlzIG5hbWVzcGFjZVxyXG4gICAgQGNvbnN0cnVjdG9yXHJcbiAgICBAaW50ZXJuYWxcclxuICAgIEBtZW1iZXJPZiBtYWtlTmFtZVNwYWNlXHJcbiAgICAjIyNcclxuICAgIENsYXNzID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gZnVuY3Rpb24gJyArIHNwYWNlbmFtZSArICcoKXt9JykoKVxyXG4gICAgQ2xhc3M6OiA9IG5ldyBCYXNlKHNwYWNlbmFtZSlcclxuXHJcbiAgICAjQ2xhc3MucHJvdG90eXBlLnBhcmVudCA9IEJhc2UucHJvdG90eXBlO1xyXG4gICAgbmV3IENsYXNzKHNwYWNlbmFtZSlcclxuXHJcbiAgIyMjXHJcbiAgJ0RlcGVuZCcgYW4gT2JqZWN0IHVwb24gYW5vdGhlciBtZW1iZXIgb2YgdGhpcyBuYW1lc3BhY2UsIHVwb24gYW5vdGhlciBuYW1lc3BhY2UsXHJcbiAgb3IgdXBvbiBhIG1lbWJlciBvZiBhbm90aGVyIG5hbWVzcGFjZVxyXG4gICMjI1xyXG4gIGRlcGVuZHNPbiA9IChkZXBlbmRlbmNpZXMsIGNhbGxCYWNrLCBpbXBvcnRzKSAtPlxyXG4gICAgJ3VzZSBzdHJpY3QnXHJcbiAgICByZXQgPSBmYWxzZVxyXG4gICAgbnNNZW1iZXJzID0gbnNJbnRlcm5hbC5nZXROc01lbWJlcnMoKVxyXG4gICAgaWYgZGVwZW5kZW5jaWVzIGFuZCBkZXBlbmRlbmNpZXMubGVuZ3RoID4gMCBhbmQgY2FsbEJhY2tcclxuICAgICAgbWlzc2luZyA9IGRlcGVuZGVuY2llcy5maWx0ZXIoKGRlcGVuKSAtPlxyXG4gICAgICAgIG5zTWVtYmVycy5pbmRleE9mKGRlcGVuKSBpcyAtMSBhbmQgKG5vdCBpbXBvcnRzIG9yIGltcG9ydHMgaXNudCBkZXBlbilcclxuICAgICAgKVxyXG4gICAgICBpZiBtaXNzaW5nLmxlbmd0aCBpcyAwXHJcbiAgICAgICAgcmV0ID0gdHJ1ZVxyXG4gICAgICAgIGNhbGxCYWNrKClcclxuICAgICAgZWxzZVxyXG4gICAgICAgIG5zSW50ZXJuYWwuZGVwZW5kZW50cy5wdXNoIChpbXBvcnRzKSAtPlxyXG4gICAgICAgICAgZGVwZW5kc09uIG1pc3NpbmcsIGNhbGxCYWNrLCBpbXBvcnRzXHJcblxyXG4gICAgcmV0XHJcbiAgbnNJbnRlcm5hbCA9IGRlcGVuZGVudHM6IFtdXHJcblxyXG4gICMjI1xyXG4gIEZldGNoZXMgdGhlIHJlZ2lzdGVyZWQgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBvbiB0aGUgbmFtZXNwYWNlIGFuZCBpdHMgY2hpbGQgbmFtZXNwYWNlc1xyXG4gICMjI1xyXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBuc0ludGVybmFsLCAnZ2V0TnNNZW1iZXJzJyxcclxuICAgIHZhbHVlOiAtPlxyXG4gICAgICByZWN1cnNlVHJlZSA9IChrZXksIGxhc3RLZXkpIC0+XHJcbiAgICAgICAgbWVtYmVycy5wdXNoIGxhc3RLZXkgKyAnLicgKyBrZXkgIGlmIHR5cGVvZiAoa2V5KSBpcyAnc3RyaW5nJ1xyXG4gICAgICAgIGlmIHV0aWxMaWIuaXNQbGFpbk9iamVjdChrZXkpXHJcbiAgICAgICAgICBPYmplY3Qua2V5cyhrZXkpLmZvckVhY2ggKGspIC0+XHJcbiAgICAgICAgICAgIG1lbWJlcnMucHVzaCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdHlwZW9mIChrKSBpcyAnc3RyaW5nJ1xyXG4gICAgICAgICAgICByZWN1cnNlVHJlZSBrZXlba10sIGxhc3RLZXkgKyAnLicgKyBrICBpZiB1dGlsTGliLmlzUGxhaW5PYmplY3Qoa2V5W2tdKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgIG1lbWJlcnMgPSBbXVxyXG4gICAgICBPYmplY3Qua2V5cyhOc1RyZWVbbmFtZVNwYWNlTmFtZV0pLmZvckVhY2ggKGtleSkgLT5cclxuICAgICAgICByZWN1cnNlVHJlZSBOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSwgbmFtZVNwYWNlTmFtZSAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KE5zVHJlZVtuYW1lU3BhY2VOYW1lXVtrZXldKVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgbWVtYmVyc1xyXG5cclxuICAjIyNcclxuICBUbyBzdXBwb3J0IGRlcGVuZGVuY3kgbWFuYWdlbWVudCwgd2hlbiBhIHByb3BlcnR5IGlzIGxpZnRlZCBvbnRvIHRoZSBuYW1lc3BhY2UsIG5vdGlmeSBkZXBlbmRlbnRzIHRvIGluaXRpYWxpemVcclxuICAjIyNcclxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnNJbnRlcm5hbCwgJ2FsZXJ0RGVwZW5kZW50cycsXHJcbiAgICB2YWx1ZTogKGltcG9ydHMpIC0+XHJcbiAgICAgIGRlcHMgPSBuc0ludGVybmFsLmRlcGVuZGVudHMuZmlsdGVyKChkZXBPbikgLT5cclxuICAgICAgICBmYWxzZSBpcyBkZXBPbihpbXBvcnRzKVxyXG4gICAgICApXHJcbiAgICAgIG5zSW50ZXJuYWwuZGVwZW5kZW50cyA9IGRlcHMgIGlmIEFycmF5LmlzQXJyYXkoZGVwcylcclxuXHJcbiAgI0NyZWF0ZSB0aGUgcm9vdCBvZiB0aGUgdHJlZSBhcyB0aGUgY3VycmVudCBuYW1lc3BhY2VcclxuICBOc1RyZWVbbmFtZVNwYWNlTmFtZV0gPSB7fVxyXG4gICNEZWZpbmUgdGhlIGNvcmUgbmFtZXNwYWNlIGFuZCB0aGUgcmV0dXJuIG9mIHRoaXMgY2xhc3NcclxuICBOc091dCA9IG1ha2VOYW1lU3BhY2UobmFtZVNwYWNlTmFtZSwgTnNUcmVlW25hbWVTcGFjZU5hbWVdKVxyXG5cclxuICAjIyNcclxuICBDYWNoZSBhIGhhbmRsZSBvbiB0aGUgdmVuZG9yIChwcm9iYWJseSBqUXVlcnkpIG9uIHRoZSByb290IG5hbWVzcGFjZVxyXG4gICMjI1xyXG4gIE5zT3V0LnJlZ2lzdGVyICc/JywgdXRpbExpYiwgZmFsc2VcclxuXHJcbiAgIyMjXHJcbiAgQ2FjaGUgdGhlIHRyZWUgKHVzZWZ1bCBmb3IgZG9jdW1lbnRhdGlvbi92aXN1YWxpemF0aW9uL2RlYnVnZ2luZylcclxuICAjIyNcclxuICBOc091dC5yZWdpc3RlciAndHJlZScsIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSwgZmFsc2VcclxuXHJcbiAgIyMjXHJcbiAgQ2FjaGUgdGhlIG5hbWUgc3BhY2UgbmFtZVxyXG4gICMjI1xyXG4gIE5zT3V0LnJlZ2lzdGVyICduYW1lJywgbmFtZVNwYWNlTmFtZSwgZmFsc2VcclxuICBOc091dC5yZWdpc3RlciAnZGVwZW5kc09uJywgZGVwZW5kc09uLCBmYWxzZVxyXG4gIE5zT3V0XHJcblxyXG5cclxuIyMjXHJcbkFjdHVhbGx5IGRlZmluZSB0aGUgT0ogTmFtZVNwYWNlXHJcbiMjI1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgdGhpc0dsb2JhbCwgbmFtZVNwYWNlTmFtZSxcclxuICB2YWx1ZTogbWFrZVRoZUp1aWNlKClcclxuXHJcbk9KLnJlZ2lzdGVyICdnbG9iYWwnLCB0aGlzR2xvYmFsXHJcblxyXG50aGlzRG9jdW1lbnQgPSB7fVxyXG5pZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xyXG4gIHRoaXNEb2N1bWVudCA9IGRvY3VtZW50XHJcblxyXG5PSi5yZWdpc3RlciAnZG9jdW1lbnQnLCB0aGlzRG9jdW1lbnRcclxuXHJcbk9KLnJlZ2lzdGVyICdub29wJywgLT5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT0oiXX0=
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVudHJ5cG9pbnQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGFzeW5jXFxhamF4LmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxhc3luY1xccHJvbWlzZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcZ3JpZC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcaW5wdXRncm91cC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGFicy5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGlsZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29udHJvbHNcXGljb24uY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGRhdGUuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGZ1bmN0aW9uLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxudW1iZXIuY29mZmVlIiwic3JjL2NvZmZlZS9jb3JlL29iamVjdC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxccHJvcGVydHkuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXHN0cmluZy5jb2ZmZWUiLCJzcmMvY29mZmVlL2RvbS9ib2R5LmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxkb21cXGNvbXBvbmVudC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxjb250cm9sLmNvZmZlZSIsInNyYy9jb2ZmZWUvZG9tL2VsZW1lbnQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZnJhZ21lbnQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZ2VuZXJpY3MuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcaW5wdXQuY29mZmVlIiwic3JjL2NvZmZlZS9kb20vbm9kZS5jb2ZmZWUiLCJzcmMvY29mZmVlL2RvbS9ub2RlRmFjdG9yeS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGEuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxici5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGZvcm0uY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxpbnB1dC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXG9sLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcc2VsZWN0LmNvZmZlZSIsInNyYy9jb2ZmZWUvZWxlbWVudHMvdGFibGUuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0ZXh0YXJlYS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHRoZWFkLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdWwuY29mZmVlIiwic3JjL2NvZmZlZS9nbG9iYWwuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcYnV0dG9uaW5wdXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcY2hlY2tib3guY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcY29sb3IuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxkYXRldGltZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxkYXRldGltZWxvY2FsLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGVtYWlsLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGZpbGUuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcaGlkZGVuLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGltYWdlaW5wdXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcbW9udGguY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcbnVtYmVyLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHBhc3N3b3JkLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJhZGlvLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJhbmdlLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJlc2V0LmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHNlYXJjaC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxzdWJtaXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdGVsLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHRleHRpbnB1dC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx0aW1lLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHVybC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx3ZWVrLmNvZmZlZSIsInNyYy9jb2ZmZWUvb2ouY29mZmVlIiwic3JjL2NvZmZlZS9vakluaXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxKc29uVG9UYWJsZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGFycmF5MkQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxjb25zb2xlLmNvZmZlZSIsInNyYy9jb2ZmZWUvdG9vbHMvY29va2llLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZGVmZXIuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlYWNoLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZW51bXMuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxoaXN0b3J5LmNvZmZlZSIsInNyYy9jb2ZmZWUvdG9vbHMvaXMuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy9ub3R5LmNvZmZlZSIsInNyYy9jb2ZmZWUvdG9vbHMvcHVic3ViLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xccXVlcnlTdHJpbmcuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy9yYW5nZXMuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy90by5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHV1aWQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsT0FBQSxDQUFRLE1BQVI7O0FBQ0EsT0FBQSxDQUFRLFVBQVI7O0FBQ0EsT0FBQSxDQUFRLGNBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEseUJBQVI7O0FBQ0EsT0FBQSxDQUFRLG1CQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGFBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsWUFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGVBQVI7O0FBQ0EsT0FBQSxDQUFRLFlBQVI7O0FBQ0EsT0FBQSxDQUFRLGVBQVI7O0FBQ0EsT0FBQSxDQUFRLGdCQUFSOztBQUNBLE9BQUEsQ0FBUSxnQkFBUjs7QUFDQSxPQUFBLENBQVEsYUFBUjs7QUFDQSxPQUFBLENBQVEsY0FBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGtCQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsa0JBQVI7O0FBQ0EsT0FBQSxDQUFRLHFCQUFSOztBQUNBLE9BQUEsQ0FBUSxrQkFBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsc0JBQVI7O0FBQ0EsT0FBQSxDQUFRLG1CQUFSOztBQUNBLE9BQUEsQ0FBUSxnQkFBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsbUJBQVI7O0FBQ0EsT0FBQSxDQUFRLHdCQUFSOztBQUNBLE9BQUEsQ0FBUSxnQkFBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLHFCQUFSOztBQUNBLE9BQUEsQ0FBUSxnQkFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLG1CQUFSOztBQUNBLE9BQUEsQ0FBUSxnQkFBUjs7QUFDQSxPQUFBLENBQVEsZ0JBQVI7O0FBQ0EsT0FBQSxDQUFRLGdCQUFSOztBQUNBLE9BQUEsQ0FBUSxpQkFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGNBQVI7O0FBQ0EsT0FBQSxDQUFRLG9CQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxjQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxpQkFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGdCQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxjQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxpQkFBUjs7QUFDQSxPQUFBLENBQVEsWUFBUjs7QUFDQSxPQUFBLENBQVEsY0FBUjs7QUFDQSxPQUFBLENBQVEsZ0JBQVI7O0FBQ0EsT0FBQSxDQUFRLHFCQUFSOztBQUNBLE9BQUEsQ0FBUSxnQkFBUjs7QUFDQSxPQUFBLENBQVEsWUFBUjs7QUFDQSxPQUFBLENBQVEsY0FBUjs7Ozs7QUNuRUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBRUwsTUFBQSxHQUFTOztBQUdULE1BQU0sQ0FBQyxTQUFQLEdBQW1CLFNBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxHQUFiO0FBQ2pCLE1BQUE7RUFBQSxRQUFBLEdBQVc7RUFDWCxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsSUFBcEI7RUFDQSxJQUFJLENBQUMsU0FBTCxDQUFlLFFBQWY7RUFDQSxJQUFHLEVBQUUsQ0FBQyxZQUFOO0lBQ0UsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFYLENBQWlCO01BQ2Y7UUFBQSxVQUFBLEVBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUExQjtRQUNBLFNBQUEsRUFBVyxJQUFJLENBQUMsU0FEaEI7UUFFQSxPQUFBLEVBQWEsSUFBQSxJQUFBLENBQUEsQ0FGYjtPQURlO0tBQWpCLEVBREY7O0FBSmlCOztBQWFuQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLGNBQUQsRUFBaUIsVUFBakIsRUFBNkIsTUFBN0IsRUFBcUMsSUFBckM7O0lBQXFDLE9BQU8sRUFBRSxDQUFDLE1BQUgsQ0FBQTs7RUFDM0QsSUFBRyxVQUFBLEtBQWdCLE9BQW5CO0lBQ0UsSUFBRyxFQUFFLENBQUMsbUJBQU47TUFDRSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQVgsQ0FBaUI7UUFDZjtVQUFBLFVBQUEsRUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQTFCO1VBQ0EsSUFBQSxFQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsSUFEcEI7VUFFQSxNQUFBLEVBQVEsVUFGUjtVQUdBLEtBQUEsRUFBTyxjQUFjLENBQUMsS0FBZixDQUFBLENBSFA7VUFJQSxNQUFBLEVBQVEsY0FBYyxDQUFDLE1BSnZCO1VBS0EsVUFBQSxFQUFZLGNBQWMsQ0FBQyxVQUwzQjtVQU1BLFVBQUEsRUFBWSxjQUFjLENBQUMsVUFOM0I7VUFPQSxZQUFBLEVBQWMsY0FBYyxDQUFDLFlBUDdCO1NBRGU7T0FBakIsRUFERjs7SUFZQSxJQUFJLENBQUMsT0FBTCxDQUFhLFVBQWIsRUFiRjs7QUFEZTs7QUFrQmpCLFdBQUEsR0FBYyxTQUFDLElBQUQ7QUFDWixNQUFBO0VBQUEsSUFBRyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU4sQ0FBYSxJQUFiLENBQUg7SUFDRSxHQUFBLEdBQU07SUFDTixJQUFBLEdBQU8sRUFBRSxDQUFDLE1BQUgsQ0FBQTtJQUNQLElBQUksQ0FBQyxHQUFMLENBQVMsVUFBVCxFQUFxQixFQUFFLENBQUMsTUFBSCxDQUFBLENBQXJCO0lBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLEtBQWxCLEVBQXlCLEdBQXpCLEVBSkY7O1NBS0E7QUFOWTs7QUFjZCxNQUFNLENBQUMsV0FBUCxHQUFxQixTQUFDLElBQUQsRUFBZSxJQUFmO0FBQ25CLE1BQUE7O0lBRG9CLE9BQU87O0VBQzNCLFFBQUEsR0FDRTtJQUFBLFFBQUEsRUFDRTtNQUFBLEdBQUEsRUFBSyxFQUFMO01BQ0EsSUFBQSxFQUFNLEVBRE47TUFFQSxJQUFBLEVBQU0sSUFGTjtNQUdBLFNBQUEsRUFDRTtRQUFBLGVBQUEsRUFBaUIsSUFBakI7T0FKRjtNQUtBLFFBQUEsRUFBVSxNQUxWO01BTUEsV0FBQSxFQUFhLGlDQU5iO0tBREY7SUFTQSxTQUFBLEVBQVcsRUFBRSxDQUFDLElBVGQ7SUFVQSxPQUFBLEVBQVMsRUFBRSxDQUFDLElBVlo7SUFXQSxVQUFBLEVBQVksRUFBRSxDQUFDLElBWGY7SUFZQSxhQUFBLEVBQWUsS0FaZjtJQWFBLFdBQUEsRUFBYSxJQWJiO0lBY0EsUUFBQSxFQUFVLEtBZFY7O0VBZ0JGLElBQUEsR0FBTyxXQUFBLENBQVksSUFBWjtFQUNQLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixJQUFwQixFQUEwQixJQUExQjtFQUVBLFFBQVEsQ0FBQyxTQUFULEdBQXlCLElBQUEsSUFBQSxDQUFBO0VBRXpCLElBQUcsS0FBQSxLQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBTixDQUFrQixRQUFRLENBQUMsUUFBUSxDQUFDLElBQXBDLENBQVo7SUFFRSxJQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBbEIsS0FBMEIsS0FBN0I7TUFDRSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQWxCLEdBQXlCLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUE1QixFQUQzQjtLQUFBLE1BQUE7TUFJRSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQWxCLEdBQXlCLEVBQUUsQ0FBQyxTQUFILENBQWEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUEvQixFQUozQjtLQUZGOztFQVFBLGlCQUFBLEdBQW9CLFNBQUMsV0FBRDtBQUNsQixRQUFBO0lBQUEsR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sUUFBUSxDQUFDLFFBQWhCO0lBRU4sR0FBRyxDQUFDLElBQUosQ0FBUyxTQUFDLElBQUQsRUFBTyxVQUFQLEVBQW1CLEtBQW5CO2FBQ1AsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsUUFBakIsRUFBMkIsSUFBM0I7SUFETyxDQUFUO0lBR0EsR0FBRyxDQUFDLElBQUosQ0FBUyxTQUFDLEtBQUQsRUFBUSxVQUFSLEVBQW9CLFNBQXBCO2FBQ1AsTUFBTSxDQUFDLE9BQVAsQ0FBZSxLQUFmLEVBQXNCLFVBQXRCLEVBQWtDLFNBQWxDLEVBQTZDLFFBQTdDO0lBRE8sQ0FBVDtJQUdBLEdBQUcsQ0FBQyxNQUFKLENBQVcsU0FBQyxjQUFELEVBQWlCLFVBQWpCO2FBQ1QsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsY0FBcEIsRUFBb0MsVUFBcEM7SUFEUyxDQUFYO1dBR0EsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFULENBQXFCLEdBQXJCO0VBWmtCO0VBY3BCLE9BQUEsR0FBVSxpQkFBQSxDQUFrQixRQUFRLENBQUMsV0FBM0I7U0FDVjtBQTlDbUI7O0FBZ0RyQixJQUFBLEdBQU87O0FBT1AsSUFBSSxDQUFDLElBQUwsR0FBWSxTQUFDLElBQUQ7U0FDVixNQUFNLENBQUMsV0FBUCxDQUFtQixNQUFuQixFQUEyQixJQUEzQjtBQURVOztBQVNaLElBQUksQ0FBQyxHQUFMLEdBQVcsU0FBQyxJQUFEO1NBQ1QsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsS0FBbkIsRUFBMEIsSUFBMUI7QUFEUzs7QUFRWCxJQUFJLENBQUMsUUFBRCxDQUFKLEdBQWMsU0FBQyxJQUFEO1NBQ1osTUFBTSxDQUFDLFdBQVAsQ0FBbUIsUUFBbkIsRUFBNkIsSUFBN0I7QUFEWTs7QUFRZCxJQUFJLENBQUMsR0FBTCxHQUFXLFNBQUMsSUFBRDtTQUNULE1BQU0sQ0FBQyxXQUFQLENBQW1CLEtBQW5CLEVBQTBCLElBQTFCO0FBRFM7O0FBR1gsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLE1BQWxCLEVBQTBCLElBQTFCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7OztBQ3RJakIsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBS0wsV0FBQSxHQUFjLFNBQUMsSUFBRDtBQUNaLE1BQUE7RUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBaEI7RUFDVixPQUFPLENBQUMsS0FBUixHQUFnQixJQUFJLENBQUM7RUFDckIsT0FBTyxDQUFDLFVBQVIsR0FBcUIsSUFBSSxDQUFDO1NBQzFCO0FBSlk7O0FBU2QsR0FBQSxHQUFNLFNBQUMsU0FBRDtBQUNKLE1BQUE7RUFBQSxJQUFBLEdBQU8sU0FBQSxJQUFhO0VBQ3BCLE9BQUEsR0FBVSxPQUFPLENBQUMsR0FBUixDQUFZLElBQVo7RUFDVixPQUFPLENBQUMsSUFBUixHQUFlLFNBQUMsSUFBRDtJQUNiLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVjtFQURhO1NBR2Y7QUFOSTs7QUFXTixJQUFBLEdBQU8sU0FBQyxJQUFEO0FBQ0wsTUFBQTs7SUFETSxPQUFPLEVBQUUsQ0FBQzs7RUFDaEIsR0FBQSxHQUFNLE9BQU8sQ0FBQyxNQUFSLENBQWUsSUFBZjtTQUNOO0FBRks7O0FBS1AsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLE9BQWxCLEVBQTJCLElBQTNCOztBQUNBLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBVCxDQUFrQixLQUFsQixFQUF5QixHQUF6Qjs7QUFDQSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsYUFBbEIsRUFBaUMsV0FBakM7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtFQUFBLEtBQUEsRUFBTyxJQUFQO0VBQ0EsR0FBQSxFQUFLLEdBREw7RUFFQSxXQUFBLEVBQWEsV0FGYjs7Ozs7O0FDckNGLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOztBQUNMLE9BQUEsQ0FBUSxXQUFSOztBQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsa0JBQVI7O0FBQ1osT0FBQSxHQUFVLE9BQUEsQ0FBUSxrQkFBUjs7QUFFVixRQUFBLEdBQVc7O0FBQ1gsU0FBQSxHQUFZOztBQUNaLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBUSxDQUFBLFNBQUEsQ0FBdEIsR0FBbUM7O0FBRW5DLEtBQUEsR0FBUSxTQUFDLE9BQUQsRUFBVSxLQUFWO0FBQ04sTUFBQTtFQUFBLFFBQUEsR0FDRTtJQUFBLFNBQUEsRUFDRTtNQUFBLFNBQUEsRUFBVyxFQUFYO01BQ0EsVUFBQSxFQUFZLEVBRFo7TUFFQSxTQUFBLEVBQVcsRUFGWDtLQURGO0lBSUEsS0FBQSxFQUNFO01BQUEsT0FBQSxFQUFPLE1BQVA7S0FMRjs7RUFPRixFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0I7RUFDQSxHQUFBLEdBQU0sU0FBQSxDQUFVLFFBQVYsRUFBb0IsS0FBcEIsRUFBMkIsUUFBM0I7RUFFTixJQUFBLEdBQU87RUFDUCxLQUFBLEdBQVEsT0FBQSxDQUFBO0VBRVIsV0FBQSxHQUFjLFNBQUE7V0FDWixLQUFLLENBQUMsSUFBTixDQUFXLFNBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxHQUFmO0FBQ1QsVUFBQTtNQUFBLElBQUcsQ0FBSSxHQUFQO1FBQ0UsR0FBQSxHQUFNLEdBQUcsQ0FBQyxHQUFKLENBQVEsS0FBUjtlQUNOLEdBQUcsQ0FBQyxJQUFKLENBQVMsTUFBVCxFQUFpQixLQUFqQixFQUF3QixFQUF4QixFQUZGOztJQURTLENBQVg7RUFEWTtFQU1kLEdBQUcsQ0FBQyxHQUFKLENBQVEsS0FBUixFQUFlLFNBQUMsS0FBRDtBQUNiLFFBQUE7O01BRGMsUUFBUSxJQUFJLENBQUMsTUFBTCxHQUFZLENBQVosSUFBaUI7O0lBQ3ZDLEtBQUEsR0FBUSxJQUFLLENBQUEsS0FBQSxHQUFNLENBQU47SUFDYixJQUFHLENBQUksS0FBUDtBQUNFLGFBQU0sSUFBSSxDQUFDLE1BQUwsR0FBYyxLQUFwQjtRQUNFLEtBQUEsR0FBUSxHQUFHLENBQUMsSUFBSixDQUFTLEtBQVQsRUFBZ0I7VUFBQSxLQUFBLEVBQU87WUFBQSxPQUFBLEVBQU8sS0FBUDtXQUFQO1NBQWhCO1FBQ1IsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFWO01BRkY7TUFHQSxLQUFLLENBQUMsR0FBTixDQUFVLE1BQVYsRUFBa0IsU0FBQyxLQUFELEVBQVEsSUFBUjtBQUNoQixZQUFBO1FBQUEsSUFBQSxHQUFPLEVBQUUsQ0FBQyxNQUFILENBQVcsRUFBRSxDQUFDLE1BQUgsQ0FBVSxFQUFWLEVBQWMsUUFBUSxDQUFDLFNBQXZCLENBQVgsRUFBOEMsSUFBOUM7UUFDUCxNQUFBLEdBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFkLENBQW1CLElBQW5CLEVBQXlCLEtBQXpCO1FBQ1QsS0FBSyxDQUFDLEdBQU4sQ0FBVSxLQUFWLEVBQWlCLEtBQWpCLEVBQXdCLE1BQXhCO2VBQ0E7TUFKZ0IsQ0FBbEIsRUFKRjs7V0FTQTtFQVhhLENBQWY7RUFhQSxHQUFHLENBQUMsR0FBSixDQUFRLE1BQVIsRUFBZ0IsU0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLElBQWY7QUFDZCxRQUFBO0lBQUEsSUFBRyxDQUFJLEtBQUosSUFBYSxLQUFBLEdBQVEsQ0FBeEI7TUFBK0IsS0FBQSxHQUFRLEVBQXZDOztJQUNBLElBQUcsQ0FBSSxLQUFKLElBQWEsS0FBQSxHQUFRLENBQXhCO01BQStCLEtBQUEsR0FBUSxFQUF2Qzs7SUFFQSxHQUFBLEdBQU0sR0FBRyxDQUFDLEdBQUosQ0FBUSxLQUFSO0lBQ04sSUFBQSxHQUFPLEtBQUssQ0FBQyxHQUFOLENBQVUsS0FBVixFQUFpQixLQUFqQjtJQUVQLElBQUcsQ0FBSSxJQUFQO01BQ0UsQ0FBQSxHQUFJO0FBQ0osYUFBTSxDQUFBLEdBQUksS0FBVjtRQUNFLENBQUEsSUFBSztRQUNMLE9BQUEsR0FBVSxLQUFLLENBQUMsR0FBTixDQUFVLEtBQVYsRUFBaUIsQ0FBakI7UUFDVixJQUFHLENBQUksT0FBUDtVQUNFLElBQUcsQ0FBQSxLQUFLLEtBQVI7WUFDRSxJQUFBLEdBQU8sR0FBRyxDQUFDLElBQUosQ0FBUyxNQUFULEVBQWlCLElBQWpCLEVBRFQ7V0FBQSxNQUVLLElBQUcsQ0FBSSxJQUFQO1lBQ0gsR0FBRyxDQUFDLElBQUosQ0FBUyxNQUFULEVBREc7V0FIUDs7TUFIRixDQUZGOztJQVdBLFdBQUEsQ0FBQTtXQUNBO0VBbkJjLENBQWhCO1NBcUJBO0FBdkRNOztBQXlEUixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQWQsQ0FBdUIsU0FBdkIsRUFBa0MsS0FBbEM7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDbkVqQixJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxPQUFBLENBQVEsV0FBUjs7QUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLGtCQUFSOztBQUNaLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUjs7QUFFUCxRQUFBLEdBQVc7O0FBQ1gsU0FBQSxHQUFZOztBQUVaLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBUSxDQUFBLFNBQUEsQ0FBdEIsR0FBbUM7O0FBRW5DLEtBQUEsR0FBUSxTQUFDLE9BQUQsRUFBVSxLQUFWO0FBQ04sTUFBQTtFQUFBLEtBQUEsR0FBUSxJQUFBLENBQUE7RUFDUixRQUFBLEdBQ0U7SUFBQSxLQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQU8sWUFBUDtLQURGO0lBRUEsTUFBQSxFQUNFO01BQUEsTUFBQSxFQUFRLEVBQUUsQ0FBQyxJQUFYO0tBSEY7SUFJQSxLQUFBLEVBQUssS0FKTDtJQUtBLFNBQUEsRUFBVyxFQUxYO0lBTUEsU0FBQSxFQUNFO01BQUEsS0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxJQUFBLEVBQU0sTUFETjtRQUVBLE9BQUEsRUFBTyxFQUZQO1FBR0EsV0FBQSxFQUFhLEVBSGI7UUFJQSxLQUFBLEVBQU8sRUFKUDtPQURGO0tBUEY7O0VBY0YsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCO0VBQ0EsR0FBQSxHQUFNLFNBQUEsQ0FBVSxRQUFWLEVBQW9CLEtBQXBCLEVBQTJCLFFBQTNCO0VBRU4sS0FBQSxHQUFRLEdBQUcsQ0FBQyxJQUFKLENBQVMsS0FBVCxFQUFnQjtJQUFBLEtBQUEsRUFBTztNQUFBLE9BQUEsRUFBTyxZQUFQO0tBQVA7R0FBaEI7RUFFUixHQUFHLENBQUMsVUFBSixHQUFpQixLQUFLLENBQUMsSUFBTixDQUFXLE9BQVgsRUFBb0I7SUFBQSxLQUFBLEVBQU87TUFBRSxLQUFBLEVBQUssS0FBUDtLQUFQO0lBQXVCLElBQUEsRUFBTSxRQUFRLENBQUMsU0FBdEM7R0FBcEI7RUFFakIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBRCxDQUF4QixJQUFrQztFQUNsQyxHQUFHLENBQUMsVUFBSixHQUFpQixLQUFLLENBQUMsSUFBTixDQUFXLE9BQVgsRUFBb0IsUUFBUSxDQUFDLFNBQTdCO0VBRWpCLEdBQUcsQ0FBQyxVQUFKLEdBQWlCLFNBQUE7V0FDZixHQUFHLENBQUMsVUFBVSxDQUFDLEdBQWYsQ0FBQTtFQURlO1NBR2pCO0FBOUJNOztBQWdDUixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQWQsQ0FBdUIsU0FBdkIsRUFBa0MsS0FBbEM7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDM0NqQixJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxPQUFBLENBQVEsV0FBUjs7QUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLGtCQUFSOztBQUVaLFFBQUEsR0FBVzs7QUFDWCxTQUFBLEdBQVk7O0FBRVosRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFRLENBQUEsU0FBQSxDQUF0QixHQUFtQzs7QUFFbkMsS0FBQSxHQUFRLFNBQUMsT0FBRCxFQUFVLEtBQVY7QUFDTixNQUFBO0VBQUEsUUFBQSxHQUNFO0lBQUEsSUFBQSxFQUFNLEVBQU47SUFDQSxLQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQU8sRUFBUDtLQUZGOztFQUlGLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QjtFQUNBLEdBQUEsR0FBTSxTQUFBLENBQVUsUUFBVixFQUFvQixLQUFwQixFQUEyQixRQUEzQjtFQUVOLElBQUEsR0FBTyxHQUFHLENBQUMsSUFBSixDQUFTLElBQVQsRUFBZTtJQUFBLEtBQUEsRUFBTztNQUFBLE9BQUEsRUFBTyxjQUFQO0tBQVA7R0FBZjtFQUNQLE9BQUEsR0FBVSxHQUFHLENBQUMsSUFBSixDQUFTLEtBQVQsRUFBZ0I7SUFBQSxLQUFBLEVBQU87TUFBQSxPQUFBLEVBQU8sYUFBUDtLQUFQO0dBQWhCO0VBRVYsS0FBQSxHQUFRO0VBQ1IsRUFBRSxDQUFDLElBQUgsQ0FBUSxRQUFRLENBQUMsSUFBakIsRUFBdUIsU0FBQyxNQUFELEVBQVMsT0FBVDtBQUNyQixRQUFBO0lBQUEsUUFBQSxHQUFXO0lBQ1gsSUFBRyxLQUFIO01BQ0UsS0FBQSxHQUFRO01BQ1IsUUFBQSxHQUFXLFNBRmI7O0lBR0EsQ0FBQSxHQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixFQUFnQjtNQUFBLEtBQUEsRUFBTztRQUFBLE9BQUEsRUFBTyxRQUFQO09BQVA7S0FBaEIsQ0FDRixDQUFDLElBREMsQ0FDSSxHQURKLEVBRUE7TUFBQSxJQUFBLEVBQU0sT0FBTjtNQUNBLEtBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxHQUFBLEdBQU0sT0FBWjtRQUNBLGFBQUEsRUFBZSxLQURmO09BRkY7TUFJQSxNQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sU0FBQTtpQkFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUosQ0FBUSxNQUFSO1FBREssQ0FBUDtPQUxGO0tBRkE7SUFVSixlQUFBLEdBQWtCLFdBQUEsR0FBYztXQUNoQyxHQUFHLENBQUMsR0FBSixDQUFRLE9BQVIsRUFBaUIsT0FBTyxDQUFDLElBQVIsQ0FBYSxLQUFiLEVBQW9CO01BQUEsS0FBQSxFQUFPO1FBQUEsT0FBQSxFQUFPLGVBQVA7UUFBd0IsRUFBQSxFQUFJLE9BQTVCO09BQVA7S0FBcEIsQ0FBakI7RUFoQnFCLENBQXZCO1NBa0JBO0FBL0JNOztBQWlDUixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQWQsQ0FBdUIsU0FBdkIsRUFBa0MsS0FBbEM7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDM0NqQixJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxPQUFBLENBQVEsV0FBUjs7QUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLGtCQUFSOztBQUVaLFFBQUEsR0FBVzs7QUFDWCxTQUFBLEdBQVk7O0FBRVosRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFRLENBQUEsU0FBQSxDQUF0QixHQUFtQzs7QUFFbkMsS0FBQSxHQUFRLFNBQUMsT0FBRCxFQUFVLEtBQVY7QUFDTixNQUFBO0VBQUEsUUFBQSxHQUNFO0lBQUEsS0FBQSxFQUNFO01BQUEsRUFBQSxFQUFJLEVBQUo7TUFDQSxFQUFBLEVBQUksRUFESjtNQUVBLEVBQUEsRUFBSSxFQUZKO01BR0EsRUFBQSxFQUFJLEVBSEo7S0FERjtJQUtBLEtBQUEsRUFDRTtNQUFBLE9BQUEsRUFBTyxNQUFQO0tBTkY7O0VBUUYsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCO0VBQ0EsSUFBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQWxCO0lBQTBCLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBRCxDQUFkLElBQXdCLFVBQUEsR0FBYSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQTlFOztFQUNBLElBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFsQjtJQUEwQixRQUFRLENBQUMsS0FBSyxDQUFDLE9BQUQsQ0FBZCxJQUF3QixVQUFBLEdBQWEsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUE5RTs7RUFDQSxJQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBbEI7SUFBMEIsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFELENBQWQsSUFBd0IsVUFBQSxHQUFhLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBOUU7O0VBQ0EsSUFBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQWxCO0lBQTBCLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBRCxDQUFkLElBQXdCLFVBQUEsR0FBYSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQTlFOztFQUVBLEdBQUEsR0FBTSxFQUFFLENBQUMsU0FBSCxDQUFhLFFBQWIsRUFBdUIsS0FBdkIsRUFBOEIsUUFBOUI7U0FDTjtBQWpCTTs7QUFtQlIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFkLENBQXVCLFNBQXZCLEVBQWtDLEtBQWxDOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7OztBQzdCakIsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsT0FBQSxDQUFRLFdBQVI7O0FBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxnQkFBUjs7QUFFVixXQUFBLEdBQWM7O0FBQ2QsWUFBQSxHQUFlOztBQUVmLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBUSxDQUFBLFlBQUEsQ0FBcEIsR0FBb0M7O0FBRXBDLEtBQUEsR0FBUSxTQUFDLE9BQUQsRUFBVSxLQUFWO0FBQ04sTUFBQTtFQUFBLFFBQUEsR0FDRTtJQUFBLFFBQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxFQUFOO01BQ0EsV0FBQSxFQUFhLEVBRGI7TUFFQSxRQUFBLEVBQVUsRUFGVjtNQUdBLElBQUEsRUFBTSxLQUhOO01BSUEsS0FBQSxFQUFPLEVBSlA7TUFLQSxPQUFBLEVBQVMsRUFMVDtNQU1BLFlBQUEsRUFBYyxLQU5kO01BT0EsTUFBQSxFQUFRLEtBUFI7TUFRQSxTQUFBLEVBQVcsS0FSWDtLQURGO0lBVUEsS0FBQSxFQUNFO01BQUEsT0FBQSxFQUFPLEVBQVA7S0FYRjtJQVlBLFlBQUEsRUFBYyxNQVpkOztFQWNGLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQjtFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixFQUFrQixLQUFsQixFQUF5QixXQUF6QjtFQUVOLFNBQUEsR0FBWTtFQUtaLGFBQUEsR0FBZ0I7RUFDaEIsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQXJCO0lBQXVDLGFBQUEsSUFBaUIsU0FBeEQ7O0VBQ0EsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQXJCO0lBQWlDLGFBQUEsSUFBaUIsU0FBbEQ7O0VBQ0EsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQXJCO0lBQW9DLGFBQUEsSUFBaUIsV0FBckQ7O0VBQ0EsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQXJCO0lBQ0UsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQWxCLEdBQXlCLENBQXpCLElBQStCLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBbEIsSUFBMEIsQ0FBNUQ7TUFDRSxhQUFBLElBQWlCLEtBQUEsR0FBUSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQTFCLEdBQWlDLEtBRHBEO0tBREY7O0VBSUEsU0FBQSxHQUFZLGFBQUEsR0FBZ0IsS0FBaEIsR0FBd0IsUUFBUSxDQUFDLFFBQVEsQ0FBQztFQUN0RCxHQUFHLENBQUMsTUFBSixHQUFhLEdBQUcsQ0FBQyxJQUFKLENBQVMsR0FBVCxFQUFjO0lBQUEsS0FBQSxFQUFPO01BQUEsT0FBQSxFQUFPLFNBQVA7S0FBUDtHQUFkO0VBR2IsR0FBRyxDQUFDLFVBQUosR0FBaUIsU0FBQTtBQUNmLFFBQUE7SUFBQSxJQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBckI7TUFDRSxPQUFBLEdBQVUsUUFBUSxDQUFDLFFBQVEsQ0FBQztNQUU1QixTQUFBLEdBQVksQ0FBQztNQUViLElBQUcsU0FBSDtRQUNFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQWIsQ0FBeUIsS0FBQSxHQUFRLE9BQWpDO1FBQ0EsT0FBQSxHQUFVLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FGOUI7T0FBQSxNQUFBO1FBSUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBYixDQUF5QixLQUFBLEdBQVEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFuRCxFQUpGOzthQU1BLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQWIsQ0FBc0IsS0FBQSxHQUFRLE9BQTlCLEVBWEY7O0VBRGU7U0FlakI7QUFuRE07O0FBcURSLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBWixDQUFxQixZQUFyQixFQUFtQyxLQUFuQzs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7Ozs7QUMvRGpCLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOztBQUVMLGlCQUFBLEdBQW9CLFNBQUMsTUFBRDtBQWFsQixNQUFBO0VBQUEsU0FBQSxHQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTixDQUFhLE1BQWI7RUFDWixHQUFBLEdBQU07RUFDTixLQUFBLEdBQVE7RUFDUixNQUFBLEdBQVM7RUFDVCxXQUFBLEdBQWM7RUFDZCxHQUFBLEdBQU07RUFDTixHQUFBLEdBQU0sRUFBRSxDQUFDO0VBQ1QsSUFBRyxLQUFBLEtBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFOLENBQWtCLFNBQWxCLENBQVo7SUFDRSxTQUFBLEdBQVksU0FBUyxDQUFDLE9BQVYsQ0FBa0IsR0FBbEIsRUFBdUIsRUFBdkI7SUFDWixTQUFBLEdBQVksU0FBUyxDQUFDLE9BQVYsQ0FBa0IsTUFBbEIsRUFBMEIsRUFBMUI7SUFDWixTQUFBLEdBQVksU0FBUyxDQUFDLE9BQVYsQ0FBa0IsR0FBbEIsRUFBdUIsRUFBdkI7SUFDWixTQUFBLEdBQVksU0FBUyxDQUFDLE9BQVYsQ0FBa0IsR0FBbEIsRUFBdUIsRUFBdkI7SUFDWixHQUFBLEdBQU0sU0FBUyxDQUFDLEtBQVYsQ0FBZ0IsR0FBaEI7SUFDTixJQUFHLEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FBaEI7TUFDRSxLQUFBLEdBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsR0FBSSxDQUFBLENBQUEsQ0FBakI7TUFDUixNQUFBLEdBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsR0FBSSxDQUFBLENBQUEsQ0FBakI7TUFDVCxXQUFBLEdBQWtCLElBQUEsSUFBQSxDQUFBLENBQU0sQ0FBQyxpQkFBUCxDQUFBO01BQ2xCLEdBQUEsR0FBVSxJQUFBLElBQUEsQ0FBTSxLQUFBLEdBQVEsQ0FBQyxDQUFDLFdBQUEsR0FBYyxDQUFDLE1BQUEsR0FBUyxHQUFULEdBQWUsRUFBaEIsQ0FBZixDQUFBLEdBQXNDLElBQXZDLENBQWQsRUFKWjtLQUFBLE1BS0ssSUFBRyxHQUFHLENBQUMsTUFBSixLQUFjLENBQWpCO01BQ0gsS0FBQSxHQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTixDQUFhLEdBQUksQ0FBQSxDQUFBLENBQWpCO01BQ1IsR0FBQSxHQUFVLElBQUEsSUFBQSxDQUFLLEtBQUwsRUFGUDtLQVhQOztFQWNBO0VBRUEsRUFBRSxDQUFDLFFBQUgsQ0FBWSxtQkFBWixFQUFpQyxpQkFBakM7U0FDQSxPQUFPLENBQUMsT0FBUixHQUFrQjtBQXJDQTs7Ozs7QUNGcEIsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBS0wsT0FBQSxHQUFVLFNBQUMsT0FBRDtFQUNSO0FBQUEsTUFBQTtFQUNBLEdBQUEsR0FBTTtFQUNOLElBQUEsR0FBTztBQUNQO0lBQ0UsSUFBK0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsT0FBYixDQUEvRDtNQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsS0FBUixDQUFjLElBQWQsRUFBb0IsS0FBSyxDQUFBLFNBQUUsQ0FBQSxLQUFLLENBQUMsSUFBYixDQUFrQixTQUFsQixFQUE2QixDQUE3QixDQUFwQixFQUFOO0tBREY7R0FBQSxjQUFBO0lBRU07SUFDSixJQUFHLENBQUMsU0FBUyxDQUFDLElBQVYsS0FBa0IsV0FBbEIsSUFBaUMsU0FBUyxDQUFDLElBQVYsS0FBa0IscUJBQXBELENBQUEsSUFBK0UsU0FBUyxDQUFDLElBQVYsS0FBa0IsMEJBQXBHO01BQ0UsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFYLENBQWdCLHNCQUFoQixFQUF3QyxTQUF4QyxFQURGO0tBQUEsTUFBQTtNQUdFLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBWCxDQUFpQixTQUFqQixFQUhGO0tBSEY7R0FBQTtBQUFBOztTQVNBO0FBYlE7O0FBZ0JULE1BQUEsR0FBUyxTQUFDLE9BQUQ7RUFDUjtBQUFBLE1BQUE7RUFDQSxJQUFBLEdBQU87U0FDUCxTQUFBO0FBQ0UsUUFBQTtJQUFBLElBQUEsR0FBTyxLQUFLLENBQUEsU0FBRSxDQUFBLEtBQUssQ0FBQyxJQUFiLENBQWtCLFNBQWxCLEVBQTZCLENBQTdCO0lBQ1AsSUFBSSxDQUFDLE9BQUwsQ0FBYSxPQUFiO1dBQ0EsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFYLENBQWlCLElBQWpCLEVBQXVCLElBQXZCO0VBSEY7QUFIUTs7QUFVVCxFQUFFLENBQUMsUUFBSCxDQUFZLFFBQVosRUFBc0IsTUFBdEI7O0FBQ0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxTQUFaLEVBQXVCLE9BQXZCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0M7RUFBQSxNQUFBLEVBQVEsTUFBUjtFQUNBLE9BQUEsRUFBUyxPQURUOzs7Ozs7QUNsQ0YsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBRUwsTUFBQSxHQUFTLE1BQU0sQ0FBQyxNQUFQLENBQWMsSUFBZDs7QUFFVCxNQUFNLENBQUMsY0FBUCxDQUFzQixNQUF0QixFQUE4QixPQUE5QixFQUNFO0VBQUEsS0FBQSxFQUFPLENBQUssTUFBQSxJQUFXLE1BQU0sQ0FBQyxLQUF0QixHQUFrQyxNQUFNLENBQUMsS0FBekMsR0FBb0QsS0FBckQsQ0FBUDtDQURGOztBQUdBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE1BQXRCLEVBQThCLFVBQTlCLEVBQ0U7RUFBQSxLQUFBLEVBQU8sQ0FBSyxNQUFBLElBQVcsTUFBTSxDQUFDLFFBQXRCLEdBQXFDLE1BQU0sQ0FBQyxRQUE1QyxHQUEwRCxRQUEzRCxDQUFQO0NBREY7O0FBR0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsTUFBdEIsRUFBOEIsV0FBOUIsRUFDRTtFQUFBLEtBQUEsRUFBTyxDQUFLLE1BQUEsSUFBVyxNQUFNLENBQUMsU0FBdEIsR0FBc0MsTUFBTSxDQUFDLFNBQTdDLEdBQTRELHVCQUE3RCxDQUFQO0NBREY7O0FBR0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsTUFBdEIsRUFBOEIsV0FBOUIsRUFDRTtFQUFBLEtBQUEsRUFBTyxDQUFLLE1BQUEsSUFBVyxNQUFNLENBQUMsU0FBdEIsR0FBc0MsTUFBTSxDQUFDLFNBQTdDLEdBQTRELE1BQTdELENBQVA7Q0FERjs7QUFHQSxFQUFFLENBQUMsUUFBSCxDQUFZLFFBQVosRUFBc0IsTUFBdEI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDakJqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeklBLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOzs7QUFFTDs7OztBQUlBLFFBQUEsR0FBVyxTQUFDLEdBQUQsRUFBTSxJQUFOLEVBQVksS0FBWixFQUFtQixRQUFuQixFQUE2QixZQUE3QixFQUEyQyxVQUEzQztFQUNULElBQUEsQ0FBc0UsR0FBdEU7QUFBQSxVQUFVLElBQUEsS0FBQSxDQUFNLDZDQUFOLEVBQVY7O0VBQ0EsSUFBa0YsWUFBbEY7QUFBQSxVQUFVLElBQUEsS0FBQSxDQUFNLHlEQUFOLEVBQVY7O0VBQ0EsR0FBSSxDQUFBLElBQUEsQ0FBSixHQUFZO1NBQ1o7QUFKUzs7QUFNWCxFQUFFLENBQUMsUUFBSCxDQUFZLFVBQVosRUFBd0IsUUFBeEI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDYmpCLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOztBQUVMLGVBQUEsR0FBa0IsU0FBQyxNQUFELEVBQVMsSUFBVDtBQUNoQixNQUFBO0VBQUEsUUFBQSxHQUNFO0lBQUEsa0JBQUEsRUFBb0IsSUFBcEI7SUFDQSxnQkFBQSxFQUFrQixJQURsQjtJQUVBLGdCQUFBLEVBQWtCLElBRmxCO0lBR0EsU0FBQSxFQUFXLEdBSFg7SUFJQSxVQUFBLEVBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsTUFBYixDQUpaOztFQU1GLE1BQUEsR0FDRTtJQUFBLEtBQUEsRUFBTyxFQUFQO0lBQ0EsU0FBQSxFQUFXLFNBQUE7YUFDVCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQWIsQ0FBa0IsUUFBUSxDQUFDLFNBQTNCO0lBRFMsQ0FEWDtJQUlBLE1BQUEsRUFBUSxTQUFDLFNBQUQ7QUFDTixVQUFBOztRQURPLFlBQVksUUFBUSxDQUFDOztNQUM1QixHQUFBLEdBQU07TUFDTixFQUFFLENBQUMsSUFBSCxDQUFRLE1BQU0sQ0FBQyxLQUFmLEVBQXNCLFNBQUMsR0FBRDtRQUNwQixJQUFxQixHQUFHLENBQUMsTUFBSixHQUFhLENBQWxDO1VBQUEsR0FBQSxJQUFPLFVBQVA7O1FBQ0EsR0FBQSxJQUFPO01BRmEsQ0FBdEI7YUFLQTtJQVBNLENBSlI7SUFhQSxRQUFBLEVBQVUsU0FBQTthQUNSLE1BQU0sQ0FBQyxNQUFQLENBQUE7SUFEUSxDQWJWO0lBZ0JBLEdBQUEsRUFBSyxTQUFDLEdBQUQ7TUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLElBQWIsQ0FBa0IsUUFBUSxDQUFDLEtBQVQsQ0FBZSxHQUFmLENBQWxCO01BQ0EsUUFBUSxDQUFDLGdCQUFULENBQUE7YUFDQTtJQUhHLENBaEJMO0lBcUJBLE1BQUEsRUFBUSxTQUFDLEdBQUQ7QUFDTixVQUFBO01BQUEsTUFBQSxHQUFTLFNBQUMsS0FBRDtlQUNQLEtBQUssQ0FBQyxNQUFOLENBQWEsU0FBQyxJQUFEO1VBQ1gsSUFBUyxJQUFBLEtBQVUsR0FBbkI7bUJBQUEsS0FBQTs7UUFEVyxDQUFiO01BRE87TUFLVCxNQUFNLENBQUMsS0FBUCxHQUFlLE1BQUEsQ0FBTyxNQUFNLENBQUMsS0FBZDthQUNmO0lBUE0sQ0FyQlI7SUE4QkEsS0FBQSxFQUFPLFNBQUE7YUFDTCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBRFIsQ0E5QlA7SUFpQ0EsUUFBQSxFQUFVLFNBQUMsR0FBRCxFQUFNLGFBQU47QUFDUixVQUFBO01BQUEsZUFBQSxHQUFrQixFQUFFLENBQUMsRUFBRSxDQUFDLElBQU4sQ0FBVyxhQUFYO01BQ2xCLEdBQUEsR0FBTSxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU4sQ0FBYSxHQUFiLENBQWlCLENBQUMsSUFBbEIsQ0FBQTtNQUNOLElBQTRCLEtBQUEsS0FBUyxlQUFyQztRQUFBLEdBQUEsR0FBTSxHQUFHLENBQUMsV0FBSixDQUFBLEVBQU47O01BQ0EsS0FBQSxHQUFRLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBYixDQUFvQixTQUFDLE1BQUQ7ZUFDMUIsQ0FBQyxlQUFBLElBQW9CLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTixDQUFhLE1BQWIsQ0FBb0IsQ0FBQyxJQUFyQixDQUFBLENBQUEsS0FBK0IsR0FBcEQsQ0FBQSxJQUE0RCxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU4sQ0FBYSxNQUFiLENBQW9CLENBQUMsSUFBckIsQ0FBQSxDQUEyQixDQUFDLFdBQTVCLENBQUEsQ0FBQSxLQUE2QztNQUQvRSxDQUFwQjthQUdSLEtBQUssQ0FBQyxNQUFOLEdBQWU7SUFQUCxDQWpDVjtJQTBDQSxJQUFBLEVBQU0sU0FBQyxRQUFEO2FBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFiLENBQXFCLFFBQXJCO0lBREksQ0ExQ047O0VBNkNGLFFBQVEsQ0FBQyxLQUFULEdBQWlCLFNBQUMsR0FBRDtBQUNmLFFBQUE7SUFBQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsR0FBYjtJQUNOLElBQWtGLFFBQVEsQ0FBQyxrQkFBM0Y7QUFBOEMsYUFBTSxHQUFHLENBQUMsT0FBSixDQUFZLElBQVosQ0FBQSxLQUF1QixDQUFDLENBQTlCO1FBQTlDLEdBQUEsR0FBTSxHQUFHLENBQUMsT0FBSixDQUFZLEtBQVosRUFBbUIsUUFBUSxDQUFDLFNBQTVCO01BQXdDLENBQTlDOztJQUNBLElBQTRGLFFBQVEsQ0FBQyxnQkFBckc7QUFBeUQsYUFBTSxHQUFHLENBQUMsT0FBSixDQUFZLEdBQVosQ0FBQSxLQUFzQixDQUFDLENBQTdCO1FBQXpELEdBQUEsR0FBTSxHQUFHLENBQUMsT0FBSixDQUFZLE1BQUEsQ0FBTyxHQUFQLEVBQVksR0FBWixDQUFaLEVBQThCLFFBQVEsQ0FBQyxTQUF2QztNQUFtRCxDQUF6RDs7QUFDOEMsV0FBTSxHQUFHLENBQUMsT0FBSixDQUFZLElBQVosQ0FBQSxLQUF1QixDQUFDLENBQTlCO01BQTlDLEdBQUEsR0FBTSxHQUFHLENBQUMsT0FBSixDQUFZLEtBQVosRUFBbUIsUUFBUSxDQUFDLFNBQTVCO0lBQXdDO1dBQzlDO0VBTGU7RUFPakIsUUFBUSxDQUFDLGdCQUFULEdBQTRCLFNBQUE7SUFDMUIsSUFBRyxRQUFRLENBQUMsZ0JBQVo7TUFDRSxDQUFDLFNBQUE7QUFDQyxZQUFBO1FBQUEsTUFBQSxHQUFTLFNBQUMsS0FBRDtBQUNQLGNBQUE7VUFBQSxJQUFBLEdBQVcsSUFBQSxHQUFBLENBQUE7aUJBQ1gsS0FBSyxDQUFDLE1BQU4sQ0FBYSxTQUFDLElBQUQ7WUFDWCxJQUFHLEtBQUEsS0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLElBQVQsQ0FBWjtjQUNFLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBVDtxQkFDQSxLQUZGOztVQURXLENBQWI7UUFGTztRQVFULE1BQU0sQ0FBQyxLQUFQLEdBQWUsTUFBQSxDQUFPLE1BQU0sQ0FBQyxLQUFkO01BVGhCLENBQUQsQ0FBQSxDQUFBLEVBREY7O0VBRDBCO0VBZ0I1QixDQUFDLFNBQUMsQ0FBRDtJQUNDLElBQUcsQ0FBQyxDQUFDLE1BQUYsR0FBVyxDQUFYLElBQWlCLEtBQUEsS0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQU4sQ0FBa0IsSUFBbEIsQ0FBN0I7TUFDRSxFQUFFLENBQUMsSUFBSCxDQUFRLENBQVIsRUFBVyxTQUFDLEdBQUQ7UUFDVCxJQUEwQixLQUFBLEtBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFOLENBQWtCLEdBQWxCLENBQW5DO1VBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFiLENBQWtCLEdBQWxCLEVBQUE7O01BRFMsQ0FBWCxFQURGO0tBQUEsTUFLSyxJQUFHLE1BQUEsSUFBVyxNQUFNLENBQUMsTUFBUCxHQUFnQixDQUE5QjtNQUNILEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixJQUFwQjtNQUNBLGVBQUEsR0FBa0IsUUFBUSxDQUFDLEtBQVQsQ0FBZSxNQUFmO01BQ2xCLFFBQVEsQ0FBQyxVQUFULEdBQXNCO01BQ3RCLE1BQU0sQ0FBQyxLQUFQLEdBQWUsZUFBZSxDQUFDLEtBQWhCLENBQXNCLFFBQVEsQ0FBQyxTQUEvQixFQUpaOztJQUtMLFFBQVEsQ0FBQyxnQkFBVCxDQUFBO0VBWEQsQ0FBRCxDQUFBLENBYUUsU0FiRjtTQWNBO0FBM0ZnQjs7QUE4RmxCLEVBQUUsQ0FBQyxRQUFILENBQVksaUJBQVosRUFBK0IsZUFBL0I7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDakdqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsV0FBQSxHQUFjLE9BQUEsQ0FBUSxlQUFSOztBQUNkLEdBQUEsR0FBTSxPQUFBLENBQVEsZ0JBQVI7O0FBY04sU0FBQSxHQUFZLFNBQUMsT0FBRCxFQUF5QixLQUF6QixFQUFnQyxPQUFoQztBQUVWLE1BQUE7O0lBRlcsVUFBVSxHQUFHLENBQUMsTUFBSixDQUFBOztFQUVyQixJQUFHLENBQUksT0FBTyxDQUFDLFVBQVIsQ0FBbUIsSUFBbkIsQ0FBUDtJQUFvQyxPQUFBLEdBQVUsSUFBQSxHQUFPLFFBQXJEOztFQU1BLE1BQUEsR0FBUyxXQUFBLENBQVksT0FBWixFQUFxQixHQUFHLENBQUMsTUFBSixDQUFBLENBQXJCLEVBQW1DLEtBQW5DLEVBQTBDLEtBQTFDO0VBSVQsWUFBQSxHQUFlLE9BQU8sQ0FBQyxZQUFSLElBQXdCLEVBQUcsQ0FBQSxpQ0FBQSxDQUEzQixJQUFpRTtFQUdoRixHQUFBLEdBQU0sTUFBTSxDQUFDLElBQVAsQ0FBWSxZQUFaLEVBQTBCLE9BQTFCO0VBR04sR0FBRyxDQUFDLGFBQUosR0FBb0I7RUFHcEIsR0FBRyxDQUFDLE1BQUosR0FBYSxNQUFNLENBQUM7U0FDcEI7QUF0QlU7O0FBd0JaLEVBQUUsQ0FBQyxRQUFILENBQVksV0FBWixFQUF5QixTQUF6Qjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7Ozs7QUN6Q2pCLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOztBQUNMLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUjs7QUFDZCxHQUFBLEdBQU0sT0FBQSxDQUFRLGdCQUFSOzs7QUFFTjs7OztBQUdBLE9BQUEsR0FBVSxTQUFDLE9BQUQsRUFBeUIsS0FBekIsRUFBZ0MsT0FBaEM7QUFDUixNQUFBOztJQURTLFVBQVUsR0FBRyxDQUFDLE1BQUosQ0FBQTs7RUFDbkIsSUFBRyxDQUFJLE9BQU8sQ0FBQyxVQUFSLENBQW1CLElBQW5CLENBQVA7SUFBb0MsT0FBQSxHQUFVLElBQUEsR0FBTyxRQUFyRDs7RUFFQSxZQUFBLEdBQWUsT0FBTyxDQUFDLFlBQVIsSUFBd0IsRUFBRyxDQUFBLGlDQUFBLENBQTNCLElBQWlFO0VBRWhGLEdBQUEsR0FBTSxXQUFBLENBQVksWUFBWixFQUEwQixPQUExQixFQUFtQyxLQUFuQyxFQUEwQyxLQUExQztFQUVOLEdBQUcsQ0FBQyxHQUFKLENBQVEsYUFBUixFQUF1QixPQUF2QjtTQUVBO0FBVFE7O0FBV1YsRUFBRSxDQUFDLFFBQUgsQ0FBWSxTQUFaLEVBQXVCLE9BQXZCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7OztBQ25CakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOztBQUNMLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUjs7QUFLZCxRQUFBLEdBQVcsU0FBQTtBQUNULE1BQUE7RUFBQSxHQUFBLEdBQU07RUFDTixJQUFHLE9BQU8sUUFBUCxLQUFxQixXQUF4QjtJQUNFLFFBQUEsR0FBVyxRQUFRLENBQUMsc0JBQVQsQ0FBQTtJQUVYLElBQUEsR0FBVyxJQUFBLE9BQUEsQ0FBUSxJQUFSLEVBQWMsSUFBZCxFQUFvQixRQUFwQjtJQUNYLElBQUksQ0FBQyxPQUFMLEdBQWU7SUFDZixHQUFBLEdBQU0sV0FBQSxDQUFZLElBQVosRUFMUjs7U0FPQTtBQVRTOztBQVdYLEVBQUUsQ0FBQyxRQUFILENBQVksVUFBWixFQUF3QixRQUF4Qjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7Ozs7QUNsQmpCLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOztBQUNMLE9BQUEsQ0FBUSxXQUFSOztBQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsZ0JBQVI7O0FBQ04sV0FBQSxHQUFjLE9BQUEsQ0FBUSxlQUFSOztBQUlkLE1BQUEsR0FBUyxDQUNQLE1BRE8sRUFFUCxTQUZPLEVBR1AsUUFITyxFQUlQLFNBSk8sRUFLUCxPQUxPLEVBTVAsT0FOTyxFQU9QLEdBUE8sRUFRUCxLQVJPLEVBU1AsS0FUTyxFQVVQLFlBVk8sRUFXUCxRQVhPLEVBWVAsUUFaTyxFQWFQLFNBYk8sRUFjUCxRQWRPLEVBZVAsTUFmTyxFQWdCUCxNQWhCTyxFQWlCUCxVQWpCTyxFQWtCUCxVQWxCTyxFQW1CUCxJQW5CTyxFQW9CUCxLQXBCTyxFQXFCUCxTQXJCTyxFQXNCUCxLQXRCTyxFQXVCUCxLQXZCTyxFQXdCUCxLQXhCTyxFQXlCUCxJQXpCTyxFQTBCUCxJQTFCTyxFQTJCUCxJQTNCTyxFQTRCUCxVQTVCTyxFQTZCUCxZQTdCTyxFQThCUCxRQTlCTyxFQStCUCxNQS9CTyxFQWdDUCxRQWhDTyxFQWlDUCxJQWpDTyxFQWtDUCxJQWxDTyxFQW1DUCxJQW5DTyxFQW9DUCxJQXBDTyxFQXFDUCxJQXJDTyxFQXNDUCxJQXRDTyxFQXVDUCxNQXZDTyxFQXdDUCxRQXhDTyxFQXlDUCxRQXpDTyxFQTBDUCxNQTFDTyxFQTJDUCxHQTNDTyxFQTRDUCxRQTVDTyxFQTZDUCxLQTdDTyxFQThDUCxLQTlDTyxFQStDUCxPQS9DTyxFQWdEUCxRQWhETyxFQWlEUCxJQWpETyxFQWtEUCxLQWxETyxFQW1EUCxNQW5ETyxFQW9EUCxNQXBETyxFQXFEUCxPQXJETyxFQXNEUCxLQXRETyxFQXVEUCxVQXZETyxFQXdEUCxVQXhETyxFQXlEUCxRQXpETyxFQTBEUCxVQTFETyxFQTJEUCxRQTNETyxFQTREUCxRQTVETyxFQTZEUCxHQTdETyxFQThEUCxLQTlETyxFQStEUCxVQS9ETyxFQWdFUCxHQWhFTyxFQWlFUCxJQWpFTyxFQWtFUCxJQWxFTyxFQW1FUCxNQW5FTyxFQW9FUCxHQXBFTyxFQXFFUCxNQXJFTyxFQXNFUCxTQXRFTyxFQXVFUCxPQXZFTyxFQXdFUCxNQXhFTyxFQXlFUCxRQXpFTyxFQTBFUCxRQTFFTyxFQTJFUCxPQTNFTyxFQTRFUCxLQTVFTyxFQTZFUCxTQTdFTyxFQThFUCxLQTlFTyxFQStFUCxPQS9FTyxFQWdGUCxJQWhGTyxFQWlGUCxPQWpGTyxFQWtGUCxJQWxGTyxFQW1GUCxNQW5GTyxFQW9GUCxPQXBGTyxFQXFGUCxJQXJGTyxFQXNGUCxJQXRGTyxFQXVGUCxHQXZGTyxFQXdGUCxLQXhGTyxFQXlGUCxPQXpGTyxFQTBGUCxLQTFGTzs7QUE0RlQsSUFBQSxHQUFPLDJFQUEyRSxDQUFDLEtBQTVFLENBQWtGLEdBQWxGOztBQUNQLEdBQUEsR0FBTSxNQUFNLENBQUMsTUFBUCxDQUFjLElBQWQ7O0FBRU4sT0FBQSxHQUFVOztLQUdMLFNBQUMsR0FBRDtBQUNELE1BQUE7RUFBQSxNQUFBLEdBQVMsU0FBQyxPQUFELEVBQVUsS0FBVixFQUEyQixpQkFBM0I7QUFFUCxRQUFBOztNQUZpQixRQUFRLEVBQUUsQ0FBQzs7O01BQU0sb0JBQW9COztJQUV0RCxRQUFBLEdBQ0U7TUFBQSxLQUFBLEVBQU8sRUFBUDtNQUNBLE1BQUEsRUFBUSxFQURSO01BRUEsTUFBQSxFQUFRLEVBRlI7O0lBSUYsR0FBRyxDQUFDLE1BQUosQ0FBVyxRQUFYLEVBQXFCLE9BQXJCO0lBQ0EsR0FBQSxHQUFNLFdBQUEsQ0FBWSxHQUFaLEVBQWlCLFFBQWpCLEVBQTJCLEtBQTNCLEVBQWtDLGlCQUFsQztXQUVOO0VBVk87RUFXVCxNQUFNLENBQUMsZUFBUCxHQUF5QjtFQUN6QixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsR0FBbEIsRUFBdUIsTUFBdkI7U0FDQSxPQUFRLENBQUEsR0FBQSxDQUFSLEdBQWU7QUFkZDtBQURMLEtBQUEscUNBQUE7O0tBQ1k7QUFEWjs7QUFpQkEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDekhqQixJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7O0FBRUw7Ozs7QUFHQSxLQUFBLEdBQVEsU0FBQyxPQUFELEVBQXdCLEtBQXhCO0FBQ04sTUFBQTs7SUFETyxVQUFVLEVBQUUsQ0FBQyxNQUFILENBQUE7O0VBQ2pCLElBQUcsQ0FBSSxLQUFQO0FBQWtCLFVBQVUsSUFBQSxLQUFBLENBQU0seUNBQU4sRUFBNUI7O0VBQ0EsSUFBRyxDQUFJLE9BQU8sQ0FBQyxLQUFaLElBQXFCLENBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUExQztBQUFvRCxVQUFVLElBQUEsS0FBQSxDQUFNLDhDQUFOLEVBQTlEOztFQUNBLEdBQUEsR0FBTSxLQUFLLENBQUMsSUFBTixDQUFXLE9BQVgsRUFBb0IsT0FBcEI7RUFDTixHQUFHLENBQUMsR0FBSixDQUFRLFdBQVIsRUFBcUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFuQztTQUNBO0FBTE07O0FBT1IsRUFBRSxDQUFDLFFBQUgsQ0FBWSxPQUFaLEVBQXFCLEtBQXJCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7OztBQ2JqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTUEsSUFBQSxzQ0FBQTtFQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxXQUFBLEdBQWMsT0FBQSxDQUFRLG9CQUFSOztBQUNkLEtBQUEsR0FBUSxPQUFBLENBQVEsZ0JBQVI7O0FBRVIsUUFBQSxHQUFXOztBQUVYLElBQUEsR0FBTyxTQUFDLE9BQUQsRUFBVSxLQUFWLEVBQTJCLGlCQUEzQjtBQUVMLE1BQUE7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TSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDdEJqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0EsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7OztBQUVMOzs7O0FBR0EsV0FBQSxHQUFjLFNBQUMsS0FBRDtBQUNaLE1BQUE7RUFBQSxHQUFBLEdBQU07RUFFTixJQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBYjtJQUNFLE1BQUEsR0FBVSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBMUIsQ0FBaUMsQ0FBakMsQ0FBbUMsQ0FBQyxLQUFwQyxDQUEwQyxHQUExQztJQUNWLElBQUcsTUFBSDtNQUNFLENBQUEsR0FBSTtBQUNKLGFBQU0sQ0FBQSxHQUFJLE1BQU0sQ0FBQyxNQUFqQjtRQUNFLEdBQUEsR0FBTSxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBVixDQUFnQixHQUFoQjtRQUNOLElBQUcsR0FBRyxDQUFDLE1BQUosS0FBYyxDQUFqQjtVQUNFLEdBQUksQ0FBQSxHQUFJLENBQUEsQ0FBQSxDQUFKLENBQUosR0FBYyxFQUFFLENBQUMsTUFBTSxDQUFDLGtCQUFWLENBQTZCLEdBQUksQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFQLENBQWUsS0FBZixFQUFzQixHQUF0QixDQUE3QixFQURoQjs7UUFFQSxDQUFBLElBQUs7TUFKUCxDQUZGO0tBRkY7O1NBU0E7QUFaWTs7QUFjZCxFQUFFLENBQUMsUUFBSCxDQUFZLGFBQVosRUFBMEIsV0FBMUI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDcEJqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7OztBQUVMOzs7Ozs7QUFLQSxjQUFBLEdBQWlCLFNBQUE7QUFJZixNQUFBO0VBQUEsQ0FBQSxHQUFJO0VBQ0osQ0FBQyxDQUFDLE1BQUYsR0FBVztFQUNYLFNBQUEsR0FBWTtFQUNaLENBQUEsR0FBSTtBQUVKLFNBQU0sQ0FBQSxHQUFJLEVBQVY7SUFDRSxDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU8sU0FBUyxDQUFDLE1BQVYsQ0FBaUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsSUFBM0IsQ0FBakIsRUFBbUQsQ0FBbkQ7SUFDUCxDQUFBLElBQUs7RUFGUDtFQUdBLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUTtFQUNSLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxTQUFTLENBQUMsTUFBVixDQUFpQixDQUFDLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxHQUFULENBQUEsR0FBZ0IsR0FBakMsRUFBc0MsQ0FBdEM7RUFDUixDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU8sQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVE7RUFDL0IsSUFBQSxHQUFPLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUDtTQUNQO0FBaEJlOztBQWtCakIsRUFBRSxDQUFDLFFBQUgsQ0FBWSxZQUFaLEVBQTBCLGNBQTFCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUgJy4vb2onXHJcbnJlcXVpcmUgJy4vb2pJbml0J1xyXG5yZXF1aXJlICcuL2FzeW5jL2FqYXgnXHJcbnJlcXVpcmUgJy4vYXN5bmMvcHJvbWlzZSdcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL2dyaWQnXHJcbnJlcXVpcmUgJy4vY29tcG9uZW50cy9pbnB1dGdyb3VwJ1xyXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvdGFicydcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL3RpbGUnXHJcbnJlcXVpcmUgJy4vY29udHJvbHMvaWNvbidcclxucmVxdWlyZSAnLi9jb3JlL2RhdGUnXHJcbnJlcXVpcmUgJy4vY29yZS9mdW5jdGlvbidcclxucmVxdWlyZSAnLi9jb3JlL251bWJlcidcclxucmVxdWlyZSAnLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi9jb3JlL3N0cmluZydcclxucmVxdWlyZSAnLi9kb20vbm9kZUZhY3RvcnknXHJcbnJlcXVpcmUgJy4vZG9tL2JvZHknXHJcbnJlcXVpcmUgJy4vZG9tL2NvbXBvbmVudCdcclxucmVxdWlyZSAnLi9kb20vY29udHJvbCdcclxucmVxdWlyZSAnLi9kb20vbm9kZSdcclxucmVxdWlyZSAnLi9kb20vZWxlbWVudCdcclxucmVxdWlyZSAnLi9kb20vZnJhZ21lbnQnXHJcbnJlcXVpcmUgJy4vZG9tL2dlbmVyaWNzJ1xyXG5yZXF1aXJlICcuL2RvbS9pbnB1dCdcclxucmVxdWlyZSAnLi9lbGVtZW50cy9hJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2JyJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2Zvcm0nXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvaW5wdXQnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvb2wnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvc2VsZWN0J1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RhYmxlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RleHRhcmVhJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RoZWFkJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3VsJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9idXR0b25pbnB1dCdcclxucmVxdWlyZSAnLi9pbnB1dHMvY2hlY2tib3gnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2NvbG9yJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9kYXRlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9kYXRldGltZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZXRpbWVsb2NhbCdcclxucmVxdWlyZSAnLi9pbnB1dHMvZW1haWwnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2ZpbGUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2hpZGRlbidcclxucmVxdWlyZSAnLi9pbnB1dHMvaW1hZ2VpbnB1dCdcclxucmVxdWlyZSAnLi9pbnB1dHMvbW9udGgnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL251bWJlcidcclxucmVxdWlyZSAnLi9pbnB1dHMvcGFzc3dvcmQnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3JhZGlvJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9yYW5nZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvcmVzZXQnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3NlYXJjaCdcclxucmVxdWlyZSAnLi9pbnB1dHMvc3VibWl0J1xyXG5yZXF1aXJlICcuL2lucHV0cy90ZWwnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3RleHRpbnB1dCdcclxucmVxdWlyZSAnLi9pbnB1dHMvdGltZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvdXJsJ1xyXG5yZXF1aXJlICcuL2lucHV0cy93ZWVrJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2FycmF5MkQnXHJcbnJlcXVpcmUgJy4vdG9vbHMvY29uc29sZSdcclxucmVxdWlyZSAnLi90b29scy9jb29raWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvZGVmZXInXHJcbnJlcXVpcmUgJy4vdG9vbHMvZWFjaCdcclxucmVxdWlyZSAnLi90b29scy9lbnVtcydcclxucmVxdWlyZSAnLi90b29scy9oaXN0b3J5J1xyXG5yZXF1aXJlICcuL3Rvb2xzL2lzJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL25vdHknXHJcbnJlcXVpcmUgJy4vdG9vbHMvcHVic3ViJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL3F1ZXJ5U3RyaW5nJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL3JhbmdlcydcclxucmVxdWlyZSAnLi90b29scy90bydcclxucmVxdWlyZSAnLi90b29scy91dWlkJ1xyXG4iLCIjICMgYWpheFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbmNvbmZpZyA9IHt9XHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgb24gc3VjY2VzcyBoYW5kbGVyLCB3cml0ZSBvdXQgdGhlIHJlcXVlc3Qgc3RhdHMgdG8gYSB0YWJsZVxyXG5jb25maWcub25TdWNjZXNzID0gKG9wdHMsIGRhdGEsIHVybCkgLT5cclxuICByZXNwb25zZSA9IHt9XHJcbiAgT0ouZXh0ZW5kIHJlc3BvbnNlLCBkYXRhXHJcbiAgb3B0cy5vblN1Y2Nlc3MgcmVzcG9uc2VcclxuICBpZiBPSi5MT0dfQUxMX0FKQVhcclxuICAgIE9KLmNvbnNvbGUudGFibGUgW1xyXG4gICAgICBXZWJzZXJ2aWNlOiBvcHRzLmFqYXhPcHRzLnVybFxyXG4gICAgICBTdGFydFRpbWU6IG9wdHMuc3RhcnRUaW1lXHJcbiAgICAgIEVuZFRpbWU6IG5ldyBEYXRlKClcclxuICAgIF0gXHJcbiAgcmV0dXJuXHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgb24gZXJyb3IgaGFuZGxlciwgd3JpdGUgb3V0IHRoZSByZXF1ZXN0IGVycm9yIGNvbmV4dCB0byBhIHRhYmxlXHJcbmNvbmZpZy5vbkVycm9yID0gKHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzLCBwYXJhbTEsIG9wdHMgPSBPSi5vYmplY3QoKSkgLT5cclxuICBpZiB0ZXh0U3RhdHVzIGlzbnQgJ2Fib3J0J1xyXG4gICAgaWYgT0ouTE9HX0FMTF9BSkFYX0VSUk9SU1xyXG4gICAgICBPSi5jb25zb2xlLnRhYmxlIFtcclxuICAgICAgICBXZWJzZXJ2aWNlOiBvcHRzLmFqYXhPcHRzLnVybFxyXG4gICAgICAgIERhdGE6IG9wdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgICAgIEZhaWxlZDogdGV4dFN0YXR1c1xyXG4gICAgICAgIFN0YXRlOiB4bWxIdHRwUmVxdWVzdC5zdGF0ZSgpXHJcbiAgICAgICAgU3RhdHVzOiB4bWxIdHRwUmVxdWVzdC5zdGF0dXNcclxuICAgICAgICBTdGF0dXNUZXh0OiB4bWxIdHRwUmVxdWVzdC5zdGF0dXNUZXh0XHJcbiAgICAgICAgUmVhZHlTdGF0ZTogeG1sSHR0cFJlcXVlc3QucmVhZHlTdGF0ZVxyXG4gICAgICAgIFJlc3BvbnNlVGV4dDogeG1sSHR0cFJlcXVlc3QucmVzcG9uc2VUZXh0XHJcbiAgICAgIF1cclxuXHJcbiAgICBvcHRzLm9uRXJyb3IgdGV4dFN0YXR1c1xyXG4gIHJldHVyblxyXG4gIFxyXG4jIGluIHRoZSBjYXNlIHdoZXJlIGBvcHRzYCBpcyBhIHN0cmluZywgY29udmVydCBpdCB0byBhbiBvYmplY3Rcclxub3B0c0Zyb21VcmwgPSAob3B0cykgLT5cclxuICBpZiBPSi5pcy5zdHJpbmcgb3B0c1xyXG4gICAgdXJsID0gb3B0c1xyXG4gICAgb3B0cyA9IE9KLm9iamVjdCgpXHJcbiAgICBvcHRzLmFkZCAnYWpheE9wdHMnLCBPSi5vYmplY3QoKVxyXG4gICAgb3B0cy5hamF4T3B0cy5hZGQgJ3VybCcsIHVybFxyXG4gIG9wdHNcclxuICBcclxuIyBkZWZpbmUgYSBzdGFuZGFyZCBgZXhlY2AgbWV0aG9kIHRvIGhhbmRsZSBhbGwgcmVxdWVzdCB2ZXJicy4gVXNlcyB0aGUgW2pRdWVyeS5hamF4XShodHRwOi8vYXBpLmpxdWVyeS5jb20vY2F0ZWdvcnkvYWpheC8pIEFQSS5cclxuIyBgZXhlY1JlcXVlc3RgIHJldHVybnMgYSBwcm9taXNlIHJlcHJlc2VudCB0aGUgYWN0dWFsIEFKQVggY2FsbC5cclxuICBcclxuIyAtIGB2ZXJiYCBkZWZhdWx0IHZhbHVlID0gJ0dFVCdcclxuIyAtIGBvcHRzYCBvYmplY3RcclxuIyAtLSBgb3B0cy5hamF4T3B0c2Agb2JqZWN0IGZvciBhbGwgalF1ZXJ5J3MgYWpheC1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxyXG5jb25maWcuZXhlY1JlcXVlc3QgPSAodmVyYiA9ICdHRVQnLCBvcHRzKSAtPlxyXG4gIGRlZmF1bHRzID1cclxuICAgIGFqYXhPcHRzOlxyXG4gICAgICB1cmw6ICcnXHJcbiAgICAgIGRhdGE6IHt9XHJcbiAgICAgIHR5cGU6IHZlcmJcclxuICAgICAgeGhyRmllbGRzOlxyXG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICBkYXRhVHlwZTogJ2pzb24nXHJcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuICAgICAgICBcclxuICAgIG9uU3VjY2VzczogT0oubm9vcFxyXG4gICAgb25FcnJvcjogT0oubm9vcFxyXG4gICAgb25Db21wbGV0ZTogT0oubm9vcFxyXG4gICAgb3ZlcnJpZGVFcnJvcjogZmFsc2VcclxuICAgIHdhdGNoR2xvYmFsOiB0cnVlXHJcbiAgICB1c2VDYWNoZTogZmFsc2VcclxuICAgIFxyXG4gIG9wdHMgPSBvcHRzRnJvbVVybCBvcHRzXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRzLCB0cnVlXHJcbiAgICBcclxuICBkZWZhdWx0cy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpXHJcbiAgICBcclxuICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXHJcbiAgICAjIEdFVCByZXF1ZXN0cyBleHBlY3QgcXVlcnlTdHJpbmcgcGFyYW1ldGVyc1xyXG4gICAgaWYgZGVmYXVsdHMuYWpheE9wdHMudmVyYiBpcyAnR0VUJ1xyXG4gICAgICBkZWZhdWx0cy5hamF4T3B0cy5kYXRhID0gT0oucGFyYW1zIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcclxuICAgICMgYWxsIG90aGVyIHJlcXVlc3RzIHRha2UgYW4gb2JqZWN0XHJcbiAgICBlbHNlXHJcbiAgICAgIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGEgPSBPSi5zZXJpYWxpemUgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgXHJcbiAgZ2V0SlF1ZXJ5RGVmZXJyZWQgPSAod2F0Y2hHbG9iYWwpIC0+XHJcbiAgICByZXQgPSAkLmFqYXggZGVmYXVsdHMuYWpheE9wdHNcclxuICAgICAgXHJcbiAgICByZXQuZG9uZSAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIC0+XHJcbiAgICAgIGNvbmZpZy5vblN1Y2Nlc3MgZGVmYXVsdHMsIGRhdGFcclxuXHJcbiAgICByZXQuZmFpbCAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGV4dCkgLT5cclxuICAgICAgY29uZmlnLm9uRXJyb3IganFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGV4dCwgZGVmYXVsdHNcclxuICBcclxuICAgIHJldC5hbHdheXMgKHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzKSAtPlxyXG4gICAgICBkZWZhdWx0cy5vbkNvbXBsZXRlIHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzXHJcblxyXG4gICAgT0ouYXN5bmMuYWpheFByb21pc2UgcmV0XHJcblxyXG4gIHByb21pc2UgPSBnZXRKUXVlcnlEZWZlcnJlZChkZWZhdWx0cy53YXRjaEdsb2JhbClcclxuICBwcm9taXNlXHJcbiAgXHJcbmFqYXggPSB7fVxyXG4gIFxyXG4jICMjIHBvc3RcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXgucG9zdDogaW5zZXJ0IGEgbmV3IG9iamVjdCBvciBpbml0IGEgZm9ybSBwb3N0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC4gXHJcbmFqYXgucG9zdCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnUE9TVCcsIG9wdHNcclxuICBcclxuIyAjIyBnZXRcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXguZ2V0OiBnZXQgYW4gZXhpc3Rpbmcgb2JqZWN0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuI1xyXG5hamF4LmdldCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnR0VUJywgb3B0c1xyXG5cclxuIyAjIyBkZWxldGVcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXguZGVsZXRlOiBkZWxldGUgYW4gZXhpc3Rpbmcgb2JqZWN0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuYWpheC5kZWxldGUgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ0RFTEVURScsIG9wdHNcclxuXHJcbiMgIyMgcHV0XHJcbiMgW09KXShvai5odG1sKS5hamF4LnB1dDogdXBkYXRlIGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbmFqYXgucHV0ID0gKG9wdHMpIC0+XHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdQVVQnLCBvcHRzXHJcblxyXG5PSi5hc3luYy5yZWdpc3RlciAnYWpheCcsIGFqYXhcclxubW9kdWxlLmV4cG9ydHMgPSBhamF4IiwiIyAjIHByb21pc2VcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jICMjIGFqYXhQcm9taXNlXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5hamF4UHJvbWlzZSBjb252ZXJ0cyBhbiBBSkFYIFhtbEh0dHBSZXF1ZXN0IGludG8gYSBQcm9taXNlLiBcclxuIyBTZWUgYWxzbyBbUHJvbWlzZS5yZXNvbHZlXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbmFqYXhQcm9taXNlID0gKGFqYXgpIC0+IFxyXG4gIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUgYWpheFxyXG4gIHByb21pc2UuYWJvcnQgPSBhamF4LmFib3J0XHJcbiAgcHJvbWlzZS5yZWFkeVN0YXRlID0gYWpheC5yZWFkeVN0YXRlXHJcbiAgcHJvbWlzZVxyXG5cclxuIyAjIyBhbGxcclxuIyBbT0pdKG9qLmh0bWwpLmFzeW5jLmFsbCB0YWtlcyBhbiBhcnJheSBvZiBmdW5jdGlvbnMgYW5kIHJldHVybnMgYSBwcm9taXNlIHJlcHJlc2VudGluZyB0aGUgc3VjY2VzcyBvZiBhbGwgbWV0aG9kcyBvciB0aGUgZmFpbHVyZSBvZiBhbnkgbWV0aG9kLlxyXG4jIFNlZSBhbHNvIFtQcm9taXNlLmFsbF0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG5hbGwgPSAoaW5pdEFycmF5KSAtPlxyXG4gIHJlcXMgPSBpbml0QXJyYXkgb3IgW11cclxuICBwcm9taXNlID0gUHJvbWlzZS5hbGwocmVxcylcclxuICBwcm9taXNlLnB1c2ggPSAoaXRlbSkgLT5cclxuICAgIHJlcXMucHVzaCBpdGVtXHJcbiAgICByZXR1cm5cclxuICBwcm9taXNlXHJcblxyXG4jICMjIGRlZmVyXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5kZWZlciBjb252ZXJ0cyBhIGZ1bmN0aW9uIGludG8gYSBQcm9taXNlIHRvIGV4ZWN1dGUgdGhhdCBmdW5jdGlvbi4gXHJcbiMgU2VlIGFsc28gW1Byb21pc2UubWV0aG9kXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbmRlZnIgPSAoZnVuYyA9IE9KLm5vb3ApIC0+XHJcbiAgcmV0ID0gUHJvbWlzZS5tZXRob2QgZnVuY1xyXG4gIHJldFxyXG4gIFxyXG4gIFxyXG5PSi5hc3luYy5yZWdpc3RlciAnZGVmZXInLCBkZWZyXHJcbk9KLmFzeW5jLnJlZ2lzdGVyICdhbGwnLCBhbGxcclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2FqYXhQcm9taXNlJywgYWpheFByb21pc2VcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuICBkZWZlcjogZGVmclxyXG4gIGFsbDogYWxsXHJcbiAgYWpheFByb21pc2U6IGFqYXhQcm9taXNlXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcclxuYXJyYXkyRCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FycmF5MkQnXHJcblxyXG5ub2RlTmFtZSA9ICd4LWdyaWQnXHJcbmNsYXNzTmFtZSA9ICdncmlkJ1xyXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXHJcblxyXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICB0aWxlU2l6ZXM6XHJcbiAgICAgIHNtYWxsU3BhbjogJydcclxuICAgICAgbWVkaXVtU3BhbjogJydcclxuICAgICAgbGFyZ2VTcGFuOiAnJ1xyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAnZ3JpZCdcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcclxuXHJcbiAgcm93cyA9IFtdXHJcbiAgdGlsZXMgPSBhcnJheTJEKClcclxuXHJcbiAgZmlsbE1pc3NpbmcgPSAoKSAtPlxyXG4gICAgdGlsZXMuZWFjaCAocm93Tm8sIGNvbE5vLCB2YWwpIC0+XHJcbiAgICAgIGlmIG5vdCB2YWxcclxuICAgICAgICByb3cgPSByZXQucm93IHJvd05vXHJcbiAgICAgICAgcm93Lm1ha2UgJ3RpbGUnLCBjb2xObywge31cclxuXHJcbiAgcmV0LmFkZCAncm93JywgKHJvd05vID0gcm93cy5sZW5ndGgtMSBvciAxKS0+XHJcbiAgICBudVJvdyA9IHJvd3Nbcm93Tm8tMV1cclxuICAgIGlmIG5vdCBudVJvd1xyXG4gICAgICB3aGlsZSByb3dzLmxlbmd0aCA8IHJvd05vXHJcbiAgICAgICAgbnVSb3cgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAncm93J1xyXG4gICAgICAgIHJvd3MucHVzaCBudVJvd1xyXG4gICAgICBudVJvdy5hZGQgJ3RpbGUnLCAoY29sTm8sIG9wdHMpIC0+XHJcbiAgICAgICAgb3B0cyA9IE9KLmV4dGVuZCAoT0ouZXh0ZW5kIHt9LCBkZWZhdWx0cy50aWxlU2l6ZXMpLCBvcHRzXHJcbiAgICAgICAgbnVUaWxlID0gT0ouY29tcG9uZW50cy50aWxlIG9wdHMsIG51Um93XHJcbiAgICAgICAgdGlsZXMuc2V0IHJvd05vLCBjb2xObywgbnVUaWxlXHJcbiAgICAgICAgbnVUaWxlXHJcbiAgICBudVJvd1xyXG5cclxuICByZXQuYWRkICd0aWxlJywgKHJvd05vLCBjb2xObywgb3B0cykgLT5cclxuICAgIGlmIG5vdCByb3dObyBvciByb3dObyA8IDEgdGhlbiByb3dObyA9IDFcclxuICAgIGlmIG5vdCBjb2xObyBvciBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcclxuXHJcbiAgICByb3cgPSByZXQucm93IHJvd05vXHJcbiAgICB0aWxlID0gdGlsZXMuZ2V0IHJvd05vLCBjb2xOb1xyXG5cclxuICAgIGlmIG5vdCB0aWxlXHJcbiAgICAgIGkgPSAwXHJcbiAgICAgIHdoaWxlIGkgPCBjb2xOb1xyXG4gICAgICAgIGkgKz0gMVxyXG4gICAgICAgIHRyeVRpbGUgPSB0aWxlcy5nZXQgcm93Tm8sIGlcclxuICAgICAgICBpZiBub3QgdHJ5VGlsZVxyXG4gICAgICAgICAgaWYgaSBpcyBjb2xOb1xyXG4gICAgICAgICAgICB0aWxlID0gcm93Lm1ha2UgJ3RpbGUnLCBvcHRzXHJcbiAgICAgICAgICBlbHNlIGlmIG5vdCB0aWxlXHJcbiAgICAgICAgICAgIHJvdy5tYWtlICd0aWxlJ1xyXG5cclxuICAgIGZpbGxNaXNzaW5nKClcclxuICAgIHRpbGVcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcclxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcclxudXVpZCA9IHJlcXVpcmUgJy4uL3Rvb2xzL3V1aWQnXHJcblxyXG5ub2RlTmFtZSA9ICd4LWlucHV0LWdyb3VwJ1xyXG5jbGFzc05hbWUgPSAnaW5wdXRncm91cCdcclxuXHJcbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcclxuXHJcbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxyXG4gIGZvcklkID0gdXVpZCgpXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAnZm9ybS1ncm91cCdcclxuICAgIGV2ZW50czpcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcbiAgICBmb3I6IGZvcklkXHJcbiAgICBsYWJlbFRleHQ6ICcnXHJcbiAgICBpbnB1dE9wdHM6XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIGlkOiBmb3JJZFxyXG4gICAgICAgIHR5cGU6ICd0ZXh0J1xyXG4gICAgICAgIGNsYXNzOiAnJ1xyXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnJ1xyXG4gICAgICAgIHZhbHVlOiAnJ1xyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxyXG5cclxuICBncm91cCA9IHJldC5tYWtlICdkaXYnLCBwcm9wczogY2xhc3M6ICdmb3JtLWdyb3VwJ1xyXG5cclxuICByZXQuZ3JvdXBMYWJlbCA9IGdyb3VwLm1ha2UgJ2xhYmVsJywgcHJvcHM6IHsgZm9yOiBmb3JJZCB9LCB0ZXh0OiBkZWZhdWx0cy5sYWJlbFRleHRcclxuXHJcbiAgZGVmYXVsdHMuaW5wdXRPcHRzLnByb3BzLmNsYXNzICs9ICcgZm9ybS1jb250cm9sJ1xyXG4gIHJldC5ncm91cElucHV0ID0gZ3JvdXAubWFrZSAnaW5wdXQnLCBkZWZhdWx0cy5pbnB1dE9wdHNcclxuXHJcbiAgcmV0Lmdyb3VwVmFsdWUgPSAoKSAtPlxyXG4gICAgcmV0Lmdyb3VwSW5wdXQudmFsKClcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcclxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcclxuXHJcbm5vZGVOYW1lID0gJ3gtdGFicydcclxuY2xhc3NOYW1lID0gJ3RhYnMnXHJcblxyXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXHJcblxyXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICB0YWJzOiB7fVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAnJ1xyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxyXG5cclxuICB0YWJzID0gcmV0Lm1ha2UgJ3VsJywgcHJvcHM6IGNsYXNzOiAnbmF2IG5hdi10YWJzJ1xyXG4gIGNvbnRlbnQgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAndGFiLWNvbnRlbnQnXHJcblxyXG4gIGZpcnN0ID0gdHJ1ZVxyXG4gIE9KLmVhY2ggZGVmYXVsdHMudGFicywgKHRhYlZhbCwgdGFiTmFtZSkgLT5cclxuICAgIHRhYkNsYXNzID0gJydcclxuICAgIGlmIGZpcnN0XHJcbiAgICAgIGZpcnN0ID0gZmFsc2VcclxuICAgICAgdGFiQ2xhc3MgPSAnYWN0aXZlJ1xyXG4gICAgYSA9IHRhYnMubWFrZSAnbGknLCBwcm9wczogY2xhc3M6IHRhYkNsYXNzXHJcbiAgICAgIC5tYWtlKCdhJyxcclxuICAgICAgICB0ZXh0OiB0YWJOYW1lXHJcbiAgICAgICAgcHJvcHM6XHJcbiAgICAgICAgICBocmVmOiAnIycgKyB0YWJOYW1lXHJcbiAgICAgICAgICAnZGF0YS10b2dnbGUnOiAndGFiJ1xyXG4gICAgICAgIGV2ZW50czpcclxuICAgICAgICAgIGNsaWNrOiAtPlxyXG4gICAgICAgICAgICBhLiQudGFiICdzaG93JylcclxuXHJcbiAgICB0YWJDb250ZW50Q2xhc3MgPSAndGFiLXBhbmUgJyArIHRhYkNsYXNzXHJcbiAgICByZXQuYWRkIHRhYk5hbWUsIGNvbnRlbnQubWFrZSgnZGl2JywgcHJvcHM6IGNsYXNzOiB0YWJDb250ZW50Q2xhc3MsIGlkOiB0YWJOYW1lKVxyXG5cclxuICByZXRcclxuXHJcbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vb2pJbml0J1xyXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xyXG5cclxubm9kZU5hbWUgPSAneC10aWxlJ1xyXG5jbGFzc05hbWUgPSAndGlsZSdcclxuXHJcbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcclxuICBcclxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgd2lkdGg6XHJcbiAgICAgIHhzOiAnJ1xyXG4gICAgICBzbTogJydcclxuICAgICAgbWQ6ICcnXHJcbiAgICAgIGxnOiAnJ1xyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAndGlsZSdcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgaWYgZGVmYXVsdHMud2lkdGgueHMgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC14cy0nICsgZGVmYXVsdHMud2lkdGgueHNcclxuICBpZiBkZWZhdWx0cy53aWR0aC5zbSB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLXNtLScgKyBkZWZhdWx0cy53aWR0aC5zbVxyXG4gIGlmIGRlZmF1bHRzLndpZHRoLm1kIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wtbWQtJyArIGRlZmF1bHRzLndpZHRoLm1kXHJcbiAgaWYgZGVmYXVsdHMud2lkdGgubGcgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1sZy0nICsgZGVmYXVsdHMud2lkdGgubGdcclxuXHJcbiAgcmV0ID0gT0ouY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcclxuICByZXRcclxuXHJcbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vb2pJbml0J1xyXG5jb250cm9sID0gcmVxdWlyZSAnLi4vZG9tL2NvbnRyb2wnXHJcblxyXG5jb250cm9sTmFtZSA9ICd5LWljb24nXHJcbmZyaWVuZGx5TmFtZSA9ICdpY29uJ1xyXG5cclxuT0ouY29udHJvbHMubWVtYmVyc1tmcmllbmRseU5hbWVdID0gY29udHJvbE5hbWVcclxuXHJcbmNudHJsID0gKG9wdGlvbnMsIG93bmVyKSAtPlxyXG4gIGRlZmF1bHRzID1cclxuICAgIGljb25PcHRzOlxyXG4gICAgICBuYW1lOiAnJ1xyXG4gICAgICBzdGFja2VkSWNvbjogJydcclxuICAgICAgc3dhcEljb246ICcnXHJcbiAgICAgIHNpemU6IGZhbHNlXHJcbiAgICAgIGNvbG9yOiAnJ1xyXG4gICAgICBsaWJyYXJ5OiAnJ1xyXG4gICAgICBpc0ZpeGVkV2lkdGg6IGZhbHNlXHJcbiAgICAgIGlzTGlzdDogZmFsc2VcclxuICAgICAgaXNTcGlubmVyOiBmYWxzZVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAnJ1xyXG4gICAgcm9vdE5vZGVUeXBlOiAnc3BhbidcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zXHJcbiAgcmV0ID0gY29udHJvbCBkZWZhdWx0cywgb3duZXIsIGNvbnRyb2xOYW1lXHJcblxyXG4gIGlzVG9nZ2xlZCA9IGZhbHNlXHJcblxyXG4gICNUT0RPOiBTdXBwb3J0IGZvciBwaWN0b2ljb25zXHJcbiAgI1RPRE86IFN1cHBvcnQgZm9yIG90aGVyIEZvbnRBd2Vzb21lIHByb3BlcnRpZXMgKHN0YWNrLCByb3RhdGUsIHNpemUsIGV0YylcclxuXHJcbiAgY2xhc3NOYW1lQmFzZSA9ICdmYSAnXHJcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuaXNGaXhlZFdpZHRoIHRoZW4gY2xhc3NOYW1lQmFzZSArPSAnZmEtZncgJ1xyXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzTGlzdCB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLWxpICdcclxuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc1NwaW5uZXIgdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1zcGluICdcclxuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zaXplXHJcbiAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zaXplID4gMSBhbmQgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSA8PSA1XHJcbiAgICAgIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5zaXplICsgJ3ggJ1xyXG5cclxuICBjbGFzc05hbWUgPSBjbGFzc05hbWVCYXNlICsgJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5uYW1lXHJcbiAgcmV0Lm15SWNvbiA9IHJldC5tYWtlICdpJywgcHJvcHM6IGNsYXNzOiBjbGFzc05hbWVcclxuXHJcbiAgI1RvZ2dsZXMgZGlzcGxheSBiZXR3ZWVuIG5vcm1hbCBpY29uIGFuZCBzd2FwIGljb24sIGlmIGEgc3dhcCBpY29uIGhhcyBiZWVuIHNwZWNpZmllZFxyXG4gIHJldC50b2dnbGVJY29uID0gLT5cclxuICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uXHJcbiAgICAgIG5ld0ljb24gPSBkZWZhdWx0cy5pY29uT3B0cy5uYW1lXHJcblxyXG4gICAgICBpc1RvZ2dsZWQgPSAhaXNUb2dnbGVkXHJcblxyXG4gICAgICBpZiBpc1RvZ2dsZWRcclxuICAgICAgICByZXQubXlJY29uLiQucmVtb3ZlQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxyXG4gICAgICAgIG5ld0ljb24gPSBkZWZhdWx0cy5pY29uT3B0cy5zd2FwSWNvblxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0Lm15SWNvbi4kLnJlbW92ZUNsYXNzKCdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMuc3dhcEljb24pXHJcblxyXG4gICAgICByZXQubXlJY29uLiQuYWRkQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxyXG5cclxuXHJcbiAgcmV0XHJcblxyXG5PSi5jb250cm9scy5yZWdpc3RlciBmcmllbmRseU5hbWUsIGNudHJsXHJcbm1vZHVsZS5leHBvcnRzID0gY250cmwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuZ2V0RGF0ZUZyb21Ebkpzb24gPSAoZG5EYXRlKSAtPlxyXG4gICAgXHJcbiAgIyBUcmFuc2Zvcm1zIGEgLk5FVCBKU09OIGRhdGUgaW50byBhIEphdmFTY3JpcHQgZGF0ZS5cclxuICAjIG5hbWU9J29iaicgIE9iamVjdCB0byB0ZXN0XHJcbiAgIyB0eXBlPSdCb29sZWFuJyAvPlxyXG4gICNcclxuICAjICAgICAgIHZhciBtaWxsaSA9IE9KLnRvLm51bWJlcihEbkRhdGUucmVwbGFjZSgvXFwvRGF0ZVxcKChcXGQrKVxcLT8oXFxkKylcXClcXC8vLCAnJDEnKSk7XHJcbiAgIyAgICAgICB2YXIgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKERuRGF0ZS5yZXBsYWNlKC9cXC9EYXRlXFwoXFxkKyhbXFwrXFwtXT9cXGQrKVxcKVxcLy8sICckMScpKTtcclxuICAjICAgICAgIHZhciBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcclxuICAjICAgICAgIHJldHVybiBuZXcgRGF0ZSgobWlsbGkgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpO1xyXG4gICMgICAgICAgXHJcbiAgICBcclxuICAjIERuIERhdGUgd2lsbCBsb29rIGxpa2UgL0RhdGUoMTMzNTc1ODQwMDAwMC0wNDAwKS8gIFxyXG4gIGRuRGF0ZVN0ciA9IE9KLnRvLnN0cmluZyhkbkRhdGUpXHJcbiAgcmV0ID0gdW5kZWZpbmVkXHJcbiAgdGlja3MgPSB1bmRlZmluZWRcclxuICBvZmZzZXQgPSB1bmRlZmluZWRcclxuICBsb2NhbE9mZnNldCA9IHVuZGVmaW5lZFxyXG4gIGFyciA9IHVuZGVmaW5lZFxyXG4gIHJldCA9IE9KLmRhdGVUaW1lTWluVmFsdWVcclxuICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eShkbkRhdGVTdHIpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnLycsICcnKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJ0RhdGUnLCAnJylcclxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCcoJywgJycpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnKScsICcnKVxyXG4gICAgYXJyID0gZG5EYXRlU3RyLnNwbGl0KCctJylcclxuICAgIGlmIGFyci5sZW5ndGggPiAxXHJcbiAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcclxuICAgICAgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKGFyclsxXSlcclxuICAgICAgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KClcclxuICAgICAgcmV0ID0gbmV3IERhdGUoKHRpY2tzIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKVxyXG4gICAgZWxzZSBpZiBhcnIubGVuZ3RoIGlzIDFcclxuICAgICAgdGlja3MgPSBPSi50by5udW1iZXIoYXJyWzBdKVxyXG4gICAgICByZXQgPSBuZXcgRGF0ZSh0aWNrcylcclxuICByZXRcclxuXHJcbiAgT0oucmVnaXN0ZXIgJ2dldERhdGVGcm9tRG5Kc29uJywgZ2V0RGF0ZUZyb21Ebkpzb25cclxuICBtb2R1bGVzLmV4cG9ydHMgPSBnZXREYXRlRnJvbURuSnNvblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuIyBXcmFwIHRoZSBleGVjdXRpb24gb2YgYSBtZXRob2QgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5ICAgICBcclxuIyBpZ25vcmUgZXJyb3JzIGZhaWxpbmcgdG8gZXhlYyBzZWxmLWV4ZWN1dGluZyBmdW5jdGlvbnMgXHJcbiMgUmV0dXJuIGEgbWV0aG9kIHdyYXBwZWQgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5XHJcbnRyeUV4ZWMgPSAodHJ5RnVuYykgLT5cclxuICAndXNlIHN0cmljdCdcclxuICByZXQgPSBmYWxzZVxyXG4gIHRoYXQgPSB0aGlzXHJcbiAgdHJ5XHJcbiAgICByZXQgPSB0cnlGdW5jLmFwcGx5KHRoYXQsIEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpICBpZiBPSi5pcy5tZXRob2QodHJ5RnVuYylcclxuICBjYXRjaCBleGNlcHRpb25cclxuICAgIGlmIChleGNlcHRpb24ubmFtZSBpcyAnVHlwZUVycm9yJyBvciBleGNlcHRpb24udHlwZSBpcyAnY2FsbGVkX25vbl9jYWxsYWJsZScpIGFuZCBleGNlcHRpb24udHlwZSBpcyAnbm9uX29iamVjdF9wcm9wZXJ0eV9sb2FkJ1xyXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0lnbm9yaW5nIGV4Y2VwdGlvbjogJywgZXhjZXB0aW9uXHJcbiAgICBlbHNlXHJcbiAgICAgIE9KLmNvbnNvbGUuZXJyb3IgZXhjZXB0aW9uXHJcbiAgZmluYWxseVxyXG5cclxuICByZXRcclxuXHJcblxyXG4gbWV0aG9kID0gKHRyeUZ1bmMpIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgdGhhdCA9IHRoaXNcclxuICAtPlxyXG4gICAgYXJncyA9IEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cywgMClcclxuICAgIGFyZ3MudW5zaGlmdCB0cnlGdW5jXHJcbiAgICBPSi50cnlFeGVjLmFwcGx5IHRoYXQsIGFyZ3NcclxuXHJcbiAgXHJcbiBcclxuIE9KLnJlZ2lzdGVyICdtZXRob2QnLCBtZXRob2RcclxuIE9KLnJlZ2lzdGVyICd0cnlFeGVjJywgdHJ5RXhlY1xyXG4gbW9kdWxlLmV4cG9ydHMgPVxyXG4gIG1ldGhvZDogbWV0aG9kXHJcbiAgdHJ5RXhlYzogdHJ5RXhlY1xyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxubnVtYmVyID0gT2JqZWN0LmNyZWF0ZShudWxsKVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ2lzTmFOJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5pc05hTikgdGhlbiBOdW1iZXIuaXNOYU4gZWxzZSBpc05hTilcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdpc0Zpbml0ZScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuaXNGaW5pdGUpIHRoZW4gTnVtYmVyLmlzRmluaXRlIGVsc2UgaXNGaW5pdGUpXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnTUFYX1ZBTFVFJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5NQVhfVkFMVUUpIHRoZW4gTnVtYmVyLk1BWF9WQUxVRSBlbHNlIDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ01JTl9WQUxVRScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuTUlOX1ZBTFVFKSB0aGVuIE51bWJlci5NSU5fVkFMVUUgZWxzZSA1ZS0zMjQpXHJcblxyXG5PSi5yZWdpc3RlciAnbnVtYmVyJywgbnVtYmVyXHJcbm1vZHVsZS5leHBvcnRzID0gbnVtYmVyIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyICQsIE9KLCBfLCBmdW5jLCBpc01ldGhvZCwgcHJvcGVydHksIHJldE9iaiwgdG87XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuaXNNZXRob2QgPSByZXF1aXJlKCcuLi90b29scy9pcycpO1xuXG5wcm9wZXJ0eSA9IHJlcXVpcmUoJy4vcHJvcGVydHknKTtcblxuZnVuYyA9IHJlcXVpcmUoJy4vZnVuY3Rpb24nKTtcblxudG8gPSByZXF1aXJlKCcuLi90b29scy90bycpO1xuXG5yZXRPYmogPSB7XG4gIG9iamVjdDogZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICBvYmogPSB7fTtcbiAgICB9XG5cbiAgICAvKlxuICAgIEFkZCBhIHByb3BlcnR5IHRvIHRoZSBvYmplY3QgYW5kIHJldHVybiBpdFxuICAgICAqL1xuICAgIG9iai5hZGQgPSBmdW5jdGlvbihuYW1lLCB2YWwpIHtcbiAgICAgIHByb3BlcnR5KG9iaiwgbmFtZSwgdmFsKTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcbiAgICBvYmouYWRkKCdlYWNoJywgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHZhciBlYWNoO1xuICAgICAgZWFjaCA9IHJlcXVpcmUoJy4uL3Rvb2xzL2VhY2gnKTtcbiAgICAgIHJldHVybiBlYWNoKG9iaiwgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKGtleSAhPT0gJ2VhY2gnICYmIGtleSAhPT0gJ2FkZCcpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sodmFsLCBrZXkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9LFxuICBpc0luc3RhbmNlT2Y6IGZ1bmN0aW9uKG5hbWUsIG9iaikge1xuICAgIHJldHVybiByZXRPYmouY29udGFpbnMobmFtZSwgb2JqKSAmJiB0by5ib29sKG9ialtuYW1lXSk7XG4gIH0sXG4gIGNvbnRhaW5zOiBmdW5jdGlvbihvYmplY3QsIGluZGV4KSB7XG4gICAgdmFyIHJldDtcbiAgICByZXQgPSBmYWxzZTtcbiAgICBpZiAob2JqZWN0KSB7XG4gICAgICByZXQgPSBfLmNvbnRhaW5zKG9iamVjdCwgaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9LFxuICBjb21wYXJlOiBmdW5jdGlvbihvYmoxLCBvYmoyKSB7XG4gICAgcmV0dXJuIF8uaXNFcXVhbChvYmoxLCBvYmoyKTtcbiAgfSxcbiAgY2xvbmU6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gXy5jbG9uZURlZXAoZGF0YSh0cnVlKSk7XG4gIH0sXG4gIHNlcmlhbGl6ZTogZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciByZXQ7XG4gICAgcmV0ID0gJyc7XG4gICAgZnVuYy50cnlFeGVjKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldCB8fCAnJztcbiAgfSxcbiAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgcmV0O1xuICAgIHJldCA9IHt9O1xuICAgIGlmIChkYXRhKSB7XG4gICAgICBmdW5jLnRyeUV4ZWMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldCA9ICQucGFyc2VKU09OKGRhdGEpO1xuICAgICAgfSk7XG4gICAgICBpZiAoaXNNZXRob2QubnVsbE9yRW1wdHkocmV0KSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSxcbiAgcGFyYW1zOiBmdW5jdGlvbihkYXRhLCBkZWxpbWl0ZXIpIHtcbiAgICB2YXIgZWFjaCwgcmV0O1xuICAgIGlmIChkZWxpbWl0ZXIgPT0gbnVsbCkge1xuICAgICAgZGVsaW1pdGVyID0gJyYnO1xuICAgIH1cbiAgICByZXQgPSAnJztcbiAgICBpZiAoZGVsaW1pdGVyID09PSAnJicpIHtcbiAgICAgIGZ1bmMudHJ5RXhlYyhmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0ID0gJC5wYXJhbShkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBlYWNoID0gcmVxdWlyZSgnLi4vdG9vbHMvZWFjaCcpO1xuICAgICAgZWFjaChkYXRhLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICBpZiAocmV0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXQgKz0gZGVsaW1pdGVyO1xuICAgICAgICB9XG4gICAgICAgIHJldCArPSBrZXkgKyAnPScgKyB2YWw7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRvLnN0cmluZyhyZXQpO1xuICB9LFxuICBleHRlbmQ6IGZ1bmN0aW9uKGRlc3RPYmosIHNyY09iaiwgZGVlcENvcHkpIHtcbiAgICB2YXIgcmV0O1xuICAgIGlmIChkZWVwQ29weSA9PSBudWxsKSB7XG4gICAgICBkZWVwQ29weSA9IGZhbHNlO1xuICAgIH1cbiAgICByZXQgPSBkZXN0T2JqIHx8IHt9O1xuICAgIGlmIChkZWVwQ29weSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0ID0gJC5leHRlbmQoZGVlcENvcHksIHJldCwgc3JjT2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0ID0gJC5leHRlbmQocmV0LCBzcmNPYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG59O1xuXG5PSi5yZWdpc3Rlcignb2JqZWN0JywgcmV0T2JqLm9iamVjdCk7XG5cbk9KLnJlZ2lzdGVyKCdpc0luc3RhbmNlT2YnLCByZXRPYmouaXNJbnN0YW5jZU9mKTtcblxuT0oucmVnaXN0ZXIoJ2NvbnRhaW5zJywgcmV0T2JqLmNvbnRhaW5zKTtcblxuT0oucmVnaXN0ZXIoJ2NvbXBhcmUnLCByZXRPYmouY29tcGFyZSk7XG5cbk9KLnJlZ2lzdGVyKCdjbG9uZScsIHJldE9iai5jbG9uZSk7XG5cbk9KLnJlZ2lzdGVyKCdzZXJpYWxpemUnLCByZXRPYmouc2VyaWFsaXplKTtcblxuT0oucmVnaXN0ZXIoJ2Rlc2VyaWFsaXplJywgcmV0T2JqLmRlc2VyaWFsaXplKTtcblxuT0oucmVnaXN0ZXIoJ3BhcmFtcycsIHJldE9iai5wYXJhbXMpO1xuXG5PSi5yZWdpc3RlcignZXh0ZW5kJywgcmV0T2JqLmV4dGVuZCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmV0T2JqO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeGpiM0psWEZ4dlltcGxZM1F1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVN4SlFVRkJPenRCUVVGQkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUMEZCVWpzN1FVRkRUQ3hEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCUTBvc1EwRkJRU3hIUVVGSkxFOUJRVUVzUTBGQlVTeFJRVUZTT3p0QlFVTktMRkZCUVVFc1IwRkJWeXhQUVVGQkxFTkJRVkVzWVVGQlVqczdRVUZEV0N4UlFVRkJMRWRCUVZjc1QwRkJRU3hEUVVGUkxGbEJRVkk3TzBGQlExZ3NTVUZCUVN4SFFVRlBMRTlCUVVFc1EwRkJVU3haUVVGU096dEJRVU5RTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1lVRkJVanM3UVVGSlRDeE5RVUZCTEVkQlNVVTdSVUZCUVN4TlFVRkJMRVZCUVZFc1UwRkJReXhIUVVGRU96dE5RVUZETEUxQlFVMDdPenRCUVVWaU96czdTVUZIUVN4SFFVRkhMRU5CUVVNc1IwRkJTaXhIUVVGVkxGTkJRVU1zU1VGQlJDeEZRVUZQTEVkQlFWQTdUVUZEVWl4UlFVRkJMRU5CUVZNc1IwRkJWQ3hGUVVGakxFbEJRV1FzUlVGQmIwSXNSMEZCY0VJN1lVRkRRVHRKUVVaUk8wbEJTVllzUjBGQlJ5eERRVUZETEVkQlFVb3NRMEZCVVN4TlFVRlNMRVZCUVdkQ0xGTkJRVU1zVVVGQlJEdEJRVU5rTEZWQlFVRTdUVUZCUVN4SlFVRkJMRWRCUVU4c1QwRkJRU3hEUVVGUkxHVkJRVkk3WVVGRFVDeEpRVUZCTEVOQlFVc3NSMEZCVEN4RlFVRlZMRk5CUVVNc1IwRkJSQ3hGUVVGTkxFZEJRVTQ3VVVGRFVpeEpRVUZITEVkQlFVRXNTMEZCVXl4TlFVRlVMRWxCUVc5Q0xFZEJRVUVzUzBGQlV5eExRVUZvUXp0cFFrRkRSU3hSUVVGQkxFTkJRVk1zUjBGQlZDeEZRVUZqTEVkQlFXUXNSVUZFUmpzN1RVRkVVU3hEUVVGV08wbEJSbU1zUTBGQmFFSTdWMEZOUVR0RlFXWk5MRU5CUVZJN1JVRnZRa0VzV1VGQlFTeEZRVUZqTEZOQlFVTXNTVUZCUkN4RlFVRlBMRWRCUVZBN1YwRkRXaXhOUVVGTkxFTkJRVU1zVVVGQlVDeERRVUZuUWl4SlFVRm9RaXhGUVVGelFpeEhRVUYwUWl4RFFVRkJMRWxCUVN0Q0xFVkJRVVVzUTBGQlF5eEpRVUZJTEVOQlFWRXNSMEZCU1N4RFFVRkJMRWxCUVVFc1EwRkJXanRGUVVSdVFpeERRWEJDWkR0RlFYbENRU3hSUVVGQkxFVkJRVlVzVTBGQlF5eE5RVUZFTEVWQlFWTXNTMEZCVkR0QlFVTlNMRkZCUVVFN1NVRkJRU3hIUVVGQkxFZEJRVTA3U1VGRFRpeEpRVUZITEUxQlFVZzdUVUZEUlN4SFFVRkJMRWRCUVUwc1EwRkJReXhEUVVGRExGRkJRVVlzUTBGQlZ5eE5RVUZZTEVWQlFXMUNMRXRCUVc1Q0xFVkJSRkk3TzFkQlJVRTdSVUZLVVN4RFFYcENWanRGUVdsRFFTeFBRVUZCTEVWQlFWTXNVMEZCUXl4SlFVRkVMRVZCUVU4c1NVRkJVRHRYUVVOUUxFTkJRVU1zUTBGQlF5eFBRVUZHTEVOQlFWVXNTVUZCVml4RlFVRm5RaXhKUVVGb1FqdEZRVVJQTEVOQmFrTlVPMFZCYzBOQkxFdEJRVUVzUlVGQlR5eFRRVUZETEVsQlFVUTdWMEZEVEN4RFFVRkRMRU5CUVVNc1UwRkJSaXhEUVVGWkxFbEJRVUVzUTBGQlN5eEpRVUZNTEVOQlFWbzdSVUZFU3l4RFFYUkRVRHRGUVRKRFFTeFRRVUZCTEVWQlFWY3NVMEZCUXl4SlFVRkVPMEZCUTFRc1VVRkJRVHRKUVVGQkxFZEJRVUVzUjBGQlRUdEpRVU5PTEVsQlFVa3NRMEZCUXl4UFFVRk1MRU5CUVdFc1UwRkJRVHROUVVOWUxFZEJRVUVzUjBGQlRTeEpRVUZKTEVOQlFVTXNVMEZCVEN4RFFVRmxMRWxCUVdZN1NVRkVTeXhEUVVGaU8xZEJSMEVzUjBGQlFTeEpRVUZQTzBWQlRFVXNRMEV6UTFnN1JVRnZSRUVzVjBGQlFTeEZRVUZoTEZOQlFVTXNTVUZCUkR0QlFVTllMRkZCUVVFN1NVRkJRU3hIUVVGQkxFZEJRVTA3U1VGRFRpeEpRVUZITEVsQlFVZzdUVUZEUlN4SlFVRkpMRU5CUVVNc1QwRkJUQ3hEUVVGaExGTkJRVUU3VVVGRFdDeEhRVUZCTEVkQlFVMHNRMEZCUXl4RFFVRkRMRk5CUVVZc1EwRkJXU3hKUVVGYU8wMUJSRXNzUTBGQllqdE5RVWxCTEVsQlFXRXNVVUZCVVN4RFFVRkRMRmRCUVZRc1EwRkJjVUlzUjBGQmNrSXNRMEZCWWp0UlFVRkJMRWRCUVVFc1IwRkJUU3hIUVVGT08wOUJURVk3TzFkQlRVRTdSVUZTVnl4RFFYQkVZanRGUVdkRlFTeE5RVUZCTEVWQlFWRXNVMEZCUXl4SlFVRkVMRVZCUVU4c1UwRkJVRHRCUVVOT0xGRkJRVUU3TzAxQlJHRXNXVUZCV1RzN1NVRkRla0lzUjBGQlFTeEhRVUZOTzBsQlEwNHNTVUZCUnl4VFFVRkJMRXRCUVdFc1IwRkJhRUk3VFVGRFJTeEpRVUZKTEVOQlFVTXNUMEZCVEN4RFFVRmhMRk5CUVVFN1VVRkRXQ3hIUVVGQkxFZEJRVTBzUTBGQlF5eERRVUZETEV0QlFVWXNRMEZCVVN4SlFVRlNPMDFCUkVzc1EwRkJZaXhGUVVSR08wdEJRVUVzVFVGQlFUdE5RVTFGTEVsQlFVRXNSMEZCVHl4UFFVRkJMRU5CUVZFc1pVRkJVanROUVVOUUxFbEJRVUVzUTBGQlN5eEpRVUZNTEVWQlFWY3NVMEZCUXl4SFFVRkVMRVZCUVUwc1IwRkJUanRSUVVOVUxFbEJRWEZDTEVkQlFVY3NRMEZCUXl4TlFVRktMRWRCUVdFc1EwRkJiRU03VlVGQlFTeEhRVUZCTEVsQlFVOHNWVUZCVURzN1VVRkRRU3hIUVVGQkxFbEJRVThzUjBGQlFTeEhRVUZOTEVkQlFVNHNSMEZCV1R0TlFVWldMRU5CUVZnc1JVRlFSanM3VjBGWlFTeEZRVUZGTEVOQlFVTXNUVUZCU0N4RFFVRlZMRWRCUVZZN1JVRmtUU3hEUVdoRlVqdEZRV3RHUVN4TlFVRkJMRVZCUVZFc1UwRkJReXhQUVVGRUxFVkJRVlVzVFVGQlZpeEZRVUZyUWl4UlFVRnNRanRCUVVOT0xGRkJRVUU3TzAxQlJIZENMRmRCUVZjN08wbEJRMjVETEVkQlFVRXNSMEZCVFN4UFFVRkJMRWxCUVZjN1NVRkRha0lzU1VGQlJ5eFJRVUZCTEV0QlFWa3NTVUZCWmp0TlFVTkZMRWRCUVVFc1IwRkJUU3hEUVVGRExFTkJRVU1zVFVGQlJpeERRVUZUTEZGQlFWUXNSVUZCYlVJc1IwRkJia0lzUlVGQmQwSXNUVUZCZUVJc1JVRkVVanRMUVVGQkxFMUJRVUU3VFVGSFJTeEhRVUZCTEVkQlFVMHNRMEZCUXl4RFFVRkRMRTFCUVVZc1EwRkJVeXhIUVVGVUxFVkJRV01zVFVGQlpDeEZRVWhTT3p0WFFVbEJPMFZCVGswc1EwRnNSbEk3T3p0QlFUSkdSaXhGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEZGQlFWb3NSVUZCYzBJc1RVRkJUU3hEUVVGRExFMUJRVGRDT3p0QlFVTkJMRVZCUVVVc1EwRkJReXhSUVVGSUxFTkJRVmtzWTBGQldpeEZRVUUwUWl4TlFVRk5MRU5CUVVNc1dVRkJia003TzBGQlEwRXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3hWUVVGYUxFVkJRWGRDTEUxQlFVMHNRMEZCUXl4UlFVRXZRanM3UVVGRFFTeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMRk5CUVZvc1JVRkJkVUlzVFVGQlRTeERRVUZETEU5QlFUbENPenRCUVVOQkxFVkJRVVVzUTBGQlF5eFJRVUZJTEVOQlFWa3NUMEZCV2l4RlFVRnhRaXhOUVVGTkxFTkJRVU1zUzBGQk5VSTdPMEZCUTBFc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeFhRVUZhTEVWQlFYbENMRTFCUVUwc1EwRkJReXhUUVVGb1F6czdRVUZEUVN4RlFVRkZMRU5CUVVNc1VVRkJTQ3hEUVVGWkxHRkJRVm9zUlVGQk1rSXNUVUZCVFN4RFFVRkRMRmRCUVd4RE96dEJRVU5CTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1VVRkJXaXhGUVVGelFpeE5RVUZOTEVOQlFVTXNUVUZCTjBJN08wRkJRMEVzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4UlFVRmFMRVZCUVhOQ0xFMUJRVTBzUTBGQlF5eE5RVUUzUWpzN1FVRkZRU3hOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWlJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lUMG9nUFNCeVpYRjFhWEpsSUNjdUxpOXZhaWRjY2x4dUpDQTlJSEpsY1hWcGNtVWdKMnB4ZFdWeWVTZGNjbHh1WHlBOUlISmxjWFZwY21VZ0oyeHZaR0Z6YUNkY2NseHVhWE5OWlhSb2IyUWdQU0J5WlhGMWFYSmxJQ2N1TGk5MGIyOXNjeTlwY3lkY2NseHVjSEp2Y0dWeWRIa2dQU0J5WlhGMWFYSmxJQ2N1TDNCeWIzQmxjblI1SjF4eVhHNW1kVzVqSUQwZ2NtVnhkV2x5WlNBbkxpOW1kVzVqZEdsdmJpZGNjbHh1ZEc4Z1BTQnlaWEYxYVhKbElDY3VMaTkwYjI5c2N5OTBieWRjY2x4dVhISmNiaU1nSXlCdlltcGxZM1JjY2x4dVhISmNibkpsZEU5aWFpQTlJRnh5WEc1Y2NseHVJQ0FqSUNNaklGdFBTbDBvYjJvdWFIUnRiQ2t1YjJKcVpXTjBYSEpjYmlBZ0l5QmpjbVZoZEdVZ1lXNGdiMkpxWldOMElIZHBkR2dnYUdWc2NHVnlJR0JoWkdSZ0lHRnVaQ0JnWldGamFHQWdiV1YwYUc5a2N5NWNjbHh1SUNCdlltcGxZM1E2SUNodlltb2dQU0I3ZlNrZ0xUNWNjbHh1SUNBZ0lGeHlYRzRnSUNBZ0l5TWpYSEpjYmlBZ0lDQkJaR1FnWVNCd2NtOXdaWEowZVNCMGJ5QjBhR1VnYjJKcVpXTjBJR0Z1WkNCeVpYUjFjbTRnYVhSY2NseHVJQ0FnSUNNakkxeHlYRzRnSUNBZ2IySnFMbUZrWkNBOUlDaHVZVzFsTENCMllXd3BJQzArWEhKY2JpQWdJQ0FnSUhCeWIzQmxjblI1SUc5aWFpd2dibUZ0WlN3Z2RtRnNYSEpjYmlBZ0lDQWdJRzlpYWx4eVhHNWNjbHh1SUNBZ0lHOWlhaTVoWkdRZ0oyVmhZMmduTENBb1kyRnNiR0poWTJzcElDMCtYSEpjYmlBZ0lDQWdJR1ZoWTJnZ1BTQnlaWEYxYVhKbElDY3VMaTkwYjI5c2N5OWxZV05vSjF4eVhHNGdJQ0FnSUNCbFlXTm9JRzlpYWl3Z0tIWmhiQ3dnYTJWNUtTQXRQbHh5WEc0Z0lDQWdJQ0FnSUdsbUlHdGxlU0JwYzI1MElDZGxZV05vSnlCaGJtUWdhMlY1SUdsemJuUWdKMkZrWkNkY2NseHVJQ0FnSUNBZ0lDQWdJR05oYkd4aVlXTnJJSFpoYkN3Z2EyVjVYSEpjYmx4eVhHNGdJQ0FnYjJKcVhISmNibHh5WEc1Y2NseHVJQ0FqSUNNaklGdFBTbDBvYjJvdWFIUnRiQ2t1YVhOSmJuTjBZVzVqWlU5bVhISmNiaUFnSXlCa1pYUmxjbTFwYm1WeklHbHpJR0VnZEdocGJtY2dhWE1nWVc0Z2FXNXpkR0Z1WTJVZ2IyWWdZU0JVYUdsdVp5d2dZWE56ZFcxcGJtY2dkR2hsSUhSb2FXNW5jeUIzWlhKbElHRnNiQ0JqY21WaGRHVmtJR2x1SUU5S1hISmNiaUFnYVhOSmJuTjBZVzVqWlU5bU9pQW9ibUZ0WlN3Z2IySnFLU0F0UGx4eVhHNGdJQ0FnY21WMFQySnFMbU52Ym5SaGFXNXpLRzVoYldVc0lHOWlhaWtnWVc1a0lIUnZMbUp2YjJ3b2IySnFXMjVoYldWZEtWeHlYRzVjY2x4dUlDQWpJQ01qSUZ0UFNsMG9iMm91YUhSdGJDa3VZMjl1ZEdGcGJuTmNjbHh1SUNBaklIUnlkV1VnYVdZZ2RHaGxJR0J2WW1wbFkzUmdJR052Ym5SaGFXNXpJSFJvWlNCMllXeDFaVnh5WEc0Z0lHTnZiblJoYVc1ek9pQW9iMkpxWldOMExDQnBibVJsZUNrZ0xUNWNjbHh1SUNBZ0lISmxkQ0E5SUdaaGJITmxYSEpjYmlBZ0lDQnBaaUJ2WW1wbFkzUmNjbHh1SUNBZ0lDQWdjbVYwSUQwZ1h5NWpiMjUwWVdsdWN5QnZZbXBsWTNRc0lHbHVaR1Y0WEhKY2JpQWdJQ0J5WlhSY2NseHVYSEpjYmlBZ0l5QWpJeUJiVDBwZEtHOXFMbWgwYld3cExtTnZiWEJoY21WY2NseHVJQ0FqSUdOdmJYQmhjbVVnZEhkdklHOWlhbVZqZEhNdllYSnlZWGx6TDNaaGJIVmxjeUJtYjNJZ2MzUnlhV04wSUdWeGRXRnNhWFI1WEhKY2JpQWdZMjl0Y0dGeVpUb2dLRzlpYWpFc0lHOWlhaklwSUMwK1hISmNiaUFnSUNCZkxtbHpSWEYxWVd3Z2IySnFNU3dnYjJKcU1seHlYRzVjY2x4dUlDQWpJQ01qSUZ0UFNsMG9iMm91YUhSdGJDa3VZMnh2Ym1WY2NseHVJQ0FqSUdOdmNIa2dZV3hzSUc5bUlIUm9aU0IyWVd4MVpYTWdLSEpsWTNWeWMybDJaV3g1S1NCbWNtOXRJRzl1WlNCdlltcGxZM1FnZEc4Z1lXNXZkR2hsY2k1Y2NseHVJQ0JqYkc5dVpUb2dLR1JoZEdFcElDMCtYSEpjYmlBZ0lDQmZMbU5zYjI1bFJHVmxjQ0JrWVhSaElIUnlkV1ZjY2x4dVhISmNiaUFnSXlBakl5QmJUMHBkS0c5cUxtaDBiV3dwTG5ObGNtbGhiR2w2WlZ4eVhHNGdJQ01nUTI5dWRtVnlkQ0JoYmlCdlltcGxZM1FnZEc4Z1lTQktVMDlPSUhKbGNISmxjMlZ1ZEdGMGFXOXVJRzltSUhSb1pTQnZZbXBsWTNSY2NseHVJQ0J6WlhKcFlXeHBlbVU2SUNoa1lYUmhLU0F0UGx4eVhHNGdJQ0FnY21WMElEMGdKeWRjY2x4dUlDQWdJR1oxYm1NdWRISjVSWGhsWXlBdFBseHlYRzRnSUNBZ0lDQnlaWFFnUFNCS1UwOU9Mbk4wY21sdVoybG1lU2hrWVhSaEtWeHlYRzRnSUNBZ0lDQnlaWFIxY201Y2NseHVJQ0FnSUhKbGRDQnZjaUFuSjF4eVhHNWNjbHh1SUNBaklDTWpJRnRQU2wwb2Iyb3VhSFJ0YkNrdVpHVnpaWEpwWVd4cGVtVmNjbHh1SUNBaklFTnZiblpsY25RZ1lTQktVMDlPSUhOMGNtbHVaeUIwYnlCaGJpQnZZbXBsWTNSY2NseHVJQ0JrWlhObGNtbGhiR2w2WlRvZ0tHUmhkR0VwSUMwK1hISmNiaUFnSUNCeVpYUWdQU0I3ZlZ4eVhHNGdJQ0FnYVdZZ1pHRjBZVnh5WEc0Z0lDQWdJQ0JtZFc1akxuUnllVVY0WldNZ0xUNWNjbHh1SUNBZ0lDQWdJQ0J5WlhRZ1BTQWtMbkJoY25ObFNsTlBUaWhrWVhSaEtWeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJseHlYRzVjY2x4dUlDQWdJQ0FnY21WMElEMGdlMzBnSUdsbUlHbHpUV1YwYUc5a0xtNTFiR3hQY2tWdGNIUjVLSEpsZENsY2NseHVJQ0FnSUhKbGRGeHlYRzVjY2x4dUlDQWpJQ01qSUZ0UFNsMG9iMm91YUhSdGJDa3VjR0Z5WVcxelhISmNiaUFnSXlCRGIyNTJaWEowSUdGdUlHOWlhbVZqZENCMGJ5QmhJR1JsYkdsdGFYUmxaQ0JzYVhOMElHOW1JSEJoY21GdFpYUmxjbk1nS0c1dmNtMWhiR3g1SUhGMVpYSjVMWE4wY21sdVp5QndZWEpoYldWMFpYSnpLVnh5WEc0Z0lIQmhjbUZ0Y3pvZ0tHUmhkR0VzSUdSbGJHbHRhWFJsY2lBOUlDY21KeWtnTFQ1Y2NseHVJQ0FnSUhKbGRDQTlJQ2NuWEhKY2JpQWdJQ0JwWmlCa1pXeHBiV2wwWlhJZ2FYTWdKeVluWEhKY2JpQWdJQ0FnSUdaMWJtTXVkSEo1UlhobFl5QXRQbHh5WEc0Z0lDQWdJQ0FnSUhKbGRDQTlJQ1F1Y0dGeVlXMG9aR0YwWVNsY2NseHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2NseHVYSEpjYmlBZ0lDQmxiSE5sWEhKY2JpQWdJQ0FnSUdWaFkyZ2dQU0J5WlhGMWFYSmxJQ2N1TGk5MGIyOXNjeTlsWVdOb0oxeHlYRzRnSUNBZ0lDQmxZV05vSUdSaGRHRXNJQ2gyWVd3c0lHdGxlU2tnTFQ1Y2NseHVJQ0FnSUNBZ0lDQnlaWFFnS3owZ1pHVnNhVzFwZEdWeUlDQnBaaUJ5WlhRdWJHVnVaM1JvSUQ0Z01GeHlYRzRnSUNBZ0lDQWdJSEpsZENBclBTQnJaWGtnS3lBblBTY2dLeUIyWVd4Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2NseHVYSEpjYmlBZ0lDQjBieTV6ZEhKcGJtY2djbVYwWEhKY2JseHlYRzRnSUNNZ0l5TWdXMDlLWFNodmFpNW9kRzFzS1M1bGVIUmxibVJjY2x4dUlDQWpJR052Y0hrZ2RHaGxJSEJ5YjNCbGNuUnBaWE1nYjJZZ2IyNWxJRzlpYW1WamRDQjBieUJoYm05MGFHVnlJRzlpYW1WamRGeHlYRzRnSUdWNGRHVnVaRG9nS0dSbGMzUlBZbW9zSUhOeVkwOWlhaXdnWkdWbGNFTnZjSGtnUFNCbVlXeHpaU2tnTFQ1Y2NseHVJQ0FnSUhKbGRDQTlJR1JsYzNSUFltb2diM0lnZTMxY2NseHVJQ0FnSUdsbUlHUmxaWEJEYjNCNUlHbHpJSFJ5ZFdWY2NseHVJQ0FnSUNBZ2NtVjBJRDBnSkM1bGVIUmxibVFvWkdWbGNFTnZjSGtzSUhKbGRDd2djM0pqVDJKcUtWeHlYRzRnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0J5WlhRZ1BTQWtMbVY0ZEdWdVpDaHlaWFFzSUhOeVkwOWlhaWxjY2x4dUlDQWdJSEpsZEZ4eVhHNWNjbHh1WEhKY2JrOUtMbkpsWjJsemRHVnlJQ2R2WW1wbFkzUW5MQ0J5WlhSUFltb3ViMkpxWldOMFhISmNiazlLTG5KbFoybHpkR1Z5SUNkcGMwbHVjM1JoYm1ObFQyWW5MQ0J5WlhSUFltb3VhWE5KYm5OMFlXNWpaVTltWEhKY2JrOUtMbkpsWjJsemRHVnlJQ2RqYjI1MFlXbHVjeWNzSUhKbGRFOWlhaTVqYjI1MFlXbHVjMXh5WEc1UFNpNXlaV2RwYzNSbGNpQW5ZMjl0Y0dGeVpTY3NJSEpsZEU5aWFpNWpiMjF3WVhKbFhISmNiazlLTG5KbFoybHpkR1Z5SUNkamJHOXVaU2NzSUhKbGRFOWlhaTVqYkc5dVpWeHlYRzVQU2k1eVpXZHBjM1JsY2lBbmMyVnlhV0ZzYVhwbEp5d2djbVYwVDJKcUxuTmxjbWxoYkdsNlpWeHlYRzVQU2k1eVpXZHBjM1JsY2lBblpHVnpaWEpwWVd4cGVtVW5MQ0J5WlhSUFltb3VaR1Z6WlhKcFlXeHBlbVZjY2x4dVQwb3VjbVZuYVhOMFpYSWdKM0JoY21GdGN5Y3NJSEpsZEU5aWFpNXdZWEpoYlhOY2NseHVUMG91Y21WbmFYTjBaWElnSjJWNGRHVnVaQ2NzSUhKbGRFOWlhaTVsZUhSbGJtUmNjbHh1WEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2NtVjBUMkpxSWwxOSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbiMjI1xyXG5BZGQgYSBwcm9wZXJ0eSB0byBhbiBvYmplY3RcclxuICBcclxuIyMjXHJcbnByb3BlcnR5ID0gKG9iaiwgbmFtZSwgdmFsdWUsIHdyaXRhYmxlLCBjb25maWd1cmFibGUsIGVudW1lcmFibGUpIC0+XHJcbiAgdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgZGVmaW5lIGEgcHJvcGVydHkgd2l0aG91dCBhbiBPYmplY3QuJyAgdW5sZXNzIG9ialxyXG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhIHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBwcm9wZXJ0eSBuYW1lLicgIHVubGVzcyBuYW1lP1xyXG4gIG9ialtuYW1lXSA9IHZhbHVlXHJcbiAgb2JqXHJcblxyXG5PSi5yZWdpc3RlciAncHJvcGVydHknLCBwcm9wZXJ0eVxyXG5tb2R1bGUuZXhwb3J0cyA9IHByb3BlcnR5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuZGVsaW1pdGVkU3RyaW5nID0gKHN0cmluZywgb3B0cykgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBuZXdMaW5lVG9EZWxpbWl0ZXI6IHRydWVcclxuICAgIHNwYWNlVG9EZWxpbWl0ZXI6IHRydWVcclxuICAgIHJlbW92ZUR1cGxpY2F0ZXM6IHRydWVcclxuICAgIGRlbGltaXRlcjogXCIsXCJcclxuICAgIGluaXRTdHJpbmc6IE9KLnRvLnN0cmluZyBzdHJpbmdcclxuXHJcbiAgcmV0T2JqID1cclxuICAgIGFycmF5OiBbXVxyXG4gICAgZGVsaW1pdGVkOiAtPlxyXG4gICAgICByZXRPYmouYXJyYXkuam9pbiBkZWZhdWx0cy5kZWxpbWl0ZXJcclxuXHJcbiAgICBzdHJpbmc6IChkZWxpbWl0ZXIgPSBkZWZhdWx0cy5kZWxpbWl0ZXIpIC0+XHJcbiAgICAgIHJldCA9ICcnXHJcbiAgICAgIE9KLmVhY2ggcmV0T2JqLmFycmF5LCAodmFsKSAtPlxyXG4gICAgICAgIHJldCArPSBkZWxpbWl0ZXIgIGlmIHJldC5sZW5ndGggPiAwXHJcbiAgICAgICAgcmV0ICs9IHZhbFxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgcmV0XHJcblxyXG4gICAgdG9TdHJpbmc6IC0+XHJcbiAgICAgIHJldE9iai5zdHJpbmcoKVxyXG5cclxuICAgIGFkZDogKHN0cikgLT5cclxuICAgICAgcmV0T2JqLmFycmF5LnB1c2ggZGVmYXVsdHMucGFyc2Uoc3RyKVxyXG4gICAgICBkZWZhdWx0cy5kZWxldGVEdXBsaWNhdGVzKClcclxuICAgICAgcmV0T2JqXHJcblxyXG4gICAgcmVtb3ZlOiAoc3RyKSAtPlxyXG4gICAgICByZW1vdmUgPSAoYXJyYXkpIC0+XHJcbiAgICAgICAgYXJyYXkuZmlsdGVyIChpdGVtKSAtPlxyXG4gICAgICAgICAgdHJ1ZSAgaWYgaXRlbSBpc250IHN0clxyXG5cclxuXHJcbiAgICAgIHJldE9iai5hcnJheSA9IHJlbW92ZShyZXRPYmouYXJyYXkpXHJcbiAgICAgIHJldE9ialxyXG5cclxuICAgIGNvdW50OiAtPlxyXG4gICAgICByZXRPYmouYXJyYXkubGVuZ3RoXHJcblxyXG4gICAgY29udGFpbnM6IChzdHIsIGNhc2VTZW5zaXRpdmUpIC0+XHJcbiAgICAgIGlzQ2FzZVNlbnNpdGl2ZSA9IE9KLnRvLmJvb2woY2FzZVNlbnNpdGl2ZSlcclxuICAgICAgc3RyID0gT0oudG8uc3RyaW5nKHN0cikudHJpbSgpXHJcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpICBpZiBmYWxzZSBpcyBpc0Nhc2VTZW5zaXRpdmVcclxuICAgICAgbWF0Y2ggPSByZXRPYmouYXJyYXkuZmlsdGVyKChtYXRTdHIpIC0+XHJcbiAgICAgICAgKGlzQ2FzZVNlbnNpdGl2ZSBhbmQgT0oudG8uc3RyaW5nKG1hdFN0cikudHJpbSgpIGlzIHN0cikgb3IgT0oudG8uc3RyaW5nKG1hdFN0cikudHJpbSgpLnRvTG93ZXJDYXNlKCkgaXMgc3RyXHJcbiAgICAgIClcclxuICAgICAgbWF0Y2gubGVuZ3RoID4gMFxyXG5cclxuICAgIGVhY2g6IChjYWxsQmFjaykgLT5cclxuICAgICAgcmV0T2JqLmFycmF5LmZvckVhY2ggY2FsbEJhY2tcclxuXHJcbiAgZGVmYXVsdHMucGFyc2UgPSAoc3RyKSAtPlxyXG4gICAgcmV0ID0gT0oudG8uc3RyaW5nKHN0cilcclxuICAgIHJldCA9IHJldC5yZXBsYWNlKC9cXG4vZywgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCJcXG5cIikgaXNudCAtMSAgaWYgZGVmYXVsdHMubmV3TGluZVRvRGVsaW1pdGVyXHJcbiAgICByZXQgPSByZXQucmVwbGFjZShSZWdFeHAoXCIgXCIsIFwiZ1wiKSwgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCIgXCIpIGlzbnQgLTEgIGlmIGRlZmF1bHRzLnNwYWNlVG9EZWxpbWl0ZXJcclxuICAgIHJldCA9IHJldC5yZXBsYWNlKC8sLC9nLCBkZWZhdWx0cy5kZWxpbWl0ZXIpICB3aGlsZSByZXQuaW5kZXhPZihcIiwsXCIpIGlzbnQgLTFcclxuICAgIHJldFxyXG5cclxuICBkZWZhdWx0cy5kZWxldGVEdXBsaWNhdGVzID0gLT5cclxuICAgIGlmIGRlZmF1bHRzLnJlbW92ZUR1cGxpY2F0ZXNcclxuICAgICAgKC0+XHJcbiAgICAgICAgdW5pcXVlID0gKGFycmF5KSAtPlxyXG4gICAgICAgICAgc2VlbiA9IG5ldyBTZXQoKVxyXG4gICAgICAgICAgYXJyYXkuZmlsdGVyIChpdGVtKSAtPlxyXG4gICAgICAgICAgICBpZiBmYWxzZSBpcyBzZWVuLmhhcyhpdGVtKVxyXG4gICAgICAgICAgICAgIHNlZW4uYWRkIGl0ZW1cclxuICAgICAgICAgICAgICB0cnVlXHJcblxyXG5cclxuICAgICAgICByZXRPYmouYXJyYXkgPSB1bmlxdWUocmV0T2JqLmFycmF5KVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICApKClcclxuICAgIHJldHVyblxyXG5cclxuICAoKGEpIC0+XHJcbiAgICBpZiBhLmxlbmd0aCA+IDEgYW5kIGZhbHNlIGlzIE9KLmlzLnBsYWluT2JqZWN0KG9wdHMpXHJcbiAgICAgIE9KLmVhY2ggYSwgKHZhbCkgLT5cclxuICAgICAgICByZXRPYmouYXJyYXkucHVzaCB2YWwgIGlmIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5KHZhbClcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICBlbHNlIGlmIHN0cmluZyBhbmQgc3RyaW5nLmxlbmd0aCA+IDBcclxuICAgICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRzXHJcbiAgICAgIGRlbGltaXRlZFN0cmluZyA9IGRlZmF1bHRzLnBhcnNlKHN0cmluZylcclxuICAgICAgZGVmYXVsdHMuaW5pdFN0cmluZyA9IGRlbGltaXRlZFN0cmluZ1xyXG4gICAgICByZXRPYmouYXJyYXkgPSBkZWxpbWl0ZWRTdHJpbmcuc3BsaXQoZGVmYXVsdHMuZGVsaW1pdGVyKVxyXG4gICAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcygpXHJcbiAgICByZXR1cm5cclxuICApIGFyZ3VtZW50c1xyXG4gIHJldE9ialxyXG5cclxuXHJcbk9KLnJlZ2lzdGVyICdkZWxpbWl0ZWRTdHJpbmcnLCBkZWxpbWl0ZWRTdHJpbmdcclxubW9kdWxlLmV4cG9ydHMgPSBkZWxpbWl0ZWRTdHJpbmciLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgTm9kZSwgT0osIF8sIGJvZHksIG9qQm9keTtcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5Ob2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XG5cblxuLypcblBlcnNpc3QgYSBoYW5kbGUgb24gdGhlIGJvZHkgbm9kZVxuICovXG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xufSBlbHNlIHtcbiAgYm9keSA9IG51bGw7XG59XG5cbm9qQm9keSA9IG5ldyBOb2RlO1xuXG5vakJvZHkuZWxlbWVudCA9IGJvZHk7XG5cbk9KLnJlZ2lzdGVyKCdib2R5Jywgb2pCb2R5KTtcblxubW9kdWxlLmV4cG9ydHMgPSBvakJvZHk7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4a2IyMWNYR0p2WkhrdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFTeEpRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlEwb3NTVUZCUVN4SFFVRlBMRTlCUVVFc1EwRkJVU3hSUVVGU096czdRVUZIVURzN096dEJRVWRCTEVsQlFVY3NUMEZCVHl4UlFVRlFMRXRCUVhGQ0xGZEJRWGhDTzBWQlFYbERMRWxCUVVFc1IwRkJUeXhSUVVGUkxFTkJRVU1zUzBGQmVrUTdRMEZCUVN4TlFVRkJPMFZCUVcxRkxFbEJRVUVzUjBGQlR5eExRVUV4UlRzN08wRkJRMEVzVFVGQlFTeEhRVUZUTEVsQlFVazdPMEZCUTJJc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSTdPMEZCUldwQ0xFVkJRVVVzUTBGQlF5eFJRVUZJTEVOQlFWa3NUVUZCV2l4RlFVRnZRaXhOUVVGd1FqczdRVUZEUVN4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpVDBvZ1BTQnlaWEYxYVhKbElDY3VMaTl2YWlkY2NseHVYeUE5SUhKbGNYVnBjbVVnSjJ4dlpHRnphQ2RjY2x4dVRtOWtaU0E5SUhKbGNYVnBjbVVnSnk0dmJtOWtaU2RjY2x4dVhISmNibHh5WEc0akl5TmNjbHh1VUdWeWMybHpkQ0JoSUdoaGJtUnNaU0J2YmlCMGFHVWdZbTlrZVNCdWIyUmxYSEpjYmlNakkxeHlYRzVwWmlCMGVYQmxiMllnWkc5amRXMWxiblFnYVhOdWRDQW5kVzVrWldacGJtVmtKeUIwYUdWdUlHSnZaSGtnUFNCa2IyTjFiV1Z1ZEM1aWIyUjVJR1ZzYzJVZ1ltOWtlU0E5SUc1MWJHeGNjbHh1YjJwQ2IyUjVJRDBnYm1WM0lFNXZaR1ZjY2x4dWIycENiMlI1TG1Wc1pXMWxiblFnUFNCaWIyUjVYSEpjYmlBZ1hISmNiazlLTG5KbFoybHpkR1Z5SUNkaWIyUjVKeXdnYjJwQ2IyUjVYSEpjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnYjJwQ2IyUjVJbDE5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuXHJcbiMgIyBjb21wb25lbnRcclxuXHJcblxyXG4jIENyZWF0ZSBhbiBIVE1MIFdlYiBDb21wb25lbnQgdGhyb3VnaCBUaGluRG9tXHJcblxyXG4jIC0gYG9wdGlvbnNgIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHN0YW5kYXJkIG9wdGlvbnMgdG8gYmUgcGFzc2VkIGludG8gdGhlIGNvbXBvbmVudFxyXG4jIC0tIGByb290Tm9kZVR5cGVgOiB0aGUgdGFnIG5hbWUgb2YgdGhlIHJvb3Qgbm9kZSB0byBjcmVhdGUsIGRlZmF1bHQgPSAnZGl2J1xyXG4jIC0tIGBwcm9wc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIERPTSBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXHJcbiMgLS0gYHN0eWxlc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIENTUyBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXHJcbiMgLS0gYGV2ZW50c2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5hbWVkIERPTSBldmVudHMgKGFuZCBjb3JyZXNwb25kaW5nIGNhbGxiYWNrIG1ldGhvZHMpIHRvIGJpbmQgdG8gdGhlIHJvb3Qgbm9kZVxyXG4jIC0gYG93bmVyYCB0aGUgcGFyZW50IHRvIHdoaWNoIHRoZSBjb21wb25lbnQgbm9kZSB3aWxsIGJlIGFwcGVuZGVkXHJcbiMgLSBgdGFnTmFtZWAgdGhlIG5hbWUgb2Ygb2YgdGhlIGNvbXBvbmVudCwgd2hpY2ggd2lsbCBhbHdheXMgYmUgcHJlZml4ZWQgd2l0aCAneC0nXHJcbmNvbXBvbmVudCA9IChvcHRpb25zID0gb2JqLm9iamVjdCgpLCBvd25lciwgdGFnTmFtZSkgLT5cclxuXHJcbiAgaWYgbm90IHRhZ05hbWUuc3RhcnRzV2l0aCAneC0nIHRoZW4gdGFnTmFtZSA9ICd4LScgKyB0YWdOYW1lXHJcbiAgIyB3ZWIgY29tcG9uZW50cyBhcmUgcmVhbGx5IGp1c3Qgb3JkaW5hcnkgT0ogW2VsZW1lbnRdKGVsZW1lbnQuaHRtbCkncyB3aXRoIGEgc3BlY2lhbCBuYW1lLlxyXG4gICMgVW50aWwgSFRNTCBXZWIgQ29tcG9uZW50cyBhcmUgZnVsbHkgc3VwcG9ydGVkIChhbmQgT0ogaXMgcmVmYWN0b3JlZCBhY2NvcmRpbmdseSksIHRoZSBlbGVtZW50IHdpbGwgYmUgdHJlYXRlZCBhcyBhbiB1bmtub3duIGVsZW1lbnQuXHJcbiAgIyBJbiBtb3N0IGNhc2VzLCB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiB0aGUgYnJvd3NlciBpcyBhY2NlcHRhYmxlIChzZWUgYWxzbyBbSFRNTCBTZW1hbnRpY3NdKGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vc2VtYW50aWNzLmh0bWwpKSwgYnV0XHJcbiAgIyBpbiBzb21lIGNhc2VzIHRoaXMgaXMgcHJvYmxlbWF0aWMgKGZpcnN0bHksIGJlY2F1c2UgdGhlc2UgZWxlbWVudHMgYXJlIGFsd2F5cyByZW5kZXJlZCBpbmxpbmUpLlxyXG4gICMgSW4gc3VjaCBjb25kaXRpb25zLCB0aGUgW2NvbnRyb2xzXShjb250cm9scy5odG1sKSBjbGFzcyBhbmQgbmFtZSBzcGFjZSBpcyBiZXR0ZXIgc3VpdGVkIHRvIGNsYXNzZXMgd2hpY2ggcmVxdWlyZSBjb21wbGV0ZSBjb250cm9sIChlLmcuIFtpY29uXShpY29uLmh0bWwpKS5cclxuICB3aWRnZXQgPSBub2RlRmFjdG9yeSB0YWdOYW1lLCBvYmoub2JqZWN0KCksIG93bmVyLCBmYWxzZSAjLCBvcHRpb25zLnByb3BzLCBvcHRpb25zLnN0eWxlcywgb3B0aW9ucy5ldmVudHMsIG9wdGlvbnMudGV4dFxyXG4gIFxyXG4gICMgU2luY2UgdGhlIGJlaGF2aW9yIG9mIHN0eWxpbmcgaXMgbm90IHdlbGwgY29udHJvbGxlZC9jb250cm9sbGFibGUgb24gdW5rbm93biBlbGVtZW50cywgaXQgaXMgbmVjZXNzYXJ5IHRvIGNyZWF0ZSBhIHJvb3Qgbm9kZSBmb3IgdGhlIGNvbXBvbmVudC5cclxuICAjIEluIG1vc3QgY2FzZXMsIFtkaXZdKGRpdi5odG1sKSBpcyBwZXJmZWN0bHkgYWNjZXB0YWJsZSwgYnV0IHRoaXMgaXMgY29uZmlndXJhYmxlIGF0IHRoZSBuYW1lIHNwYWNlIGxldmVsIG9yIGF0IHJ1bnRpbWUuXHJcbiAgcm9vdE5vZGVUeXBlID0gb3B0aW9ucy5yb290Tm9kZVR5cGUgb3IgT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSBvciAnZGl2J1xyXG5cclxuICAjIGByZXRgIGlzIHRoZSB0aGUgaW5zdGFuY2Ugb2YgdGhlIHJvb3ROb2RlVHlwZSwgbm90IHRoZSBgd2lkZ2V0YCB3cmFwcGVkIGluIHRoaXMgY2xvc3VyZVxyXG4gIHJldCA9IHdpZGdldC5tYWtlIHJvb3ROb2RlVHlwZSwgb3B0aW9uc1xyXG5cclxuICAjIGZvciBjb252ZW5pZW5jZSBhbmQgZGVidWdnaW5nLCBwZXJzaXN0IHRoZSB0YWdOYW1lXHJcbiAgcmV0LmNvbXBvbmVudE5hbWUgPSB0YWdOYW1lXHJcblxyXG4gICMgYHJlbW92ZWAgZG9lcywgaG93ZXZlciwgYmVoYXZlIGFzIGV4cGVjdGVkIGJ5IHJlbW92aW5nIGB3aWRnZXRgXHJcbiAgcmV0LnJlbW92ZSA9IHdpZGdldC5yZW1vdmVcclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdjb21wb25lbnQnLCBjb21wb25lbnRcclxubW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5cclxuIyMjXHJcbkNyZWF0ZSBhIHNldCBvZiBIVE1MIEVsZW1lbnRzIHRocm91Z2ggVGhpbkRvbVxyXG4jIyNcclxuY29udHJvbCA9IChvcHRpb25zID0gb2JqLm9iamVjdCgpLCBvd25lciwgdGFnTmFtZSkgLT5cclxuICBpZiBub3QgdGFnTmFtZS5zdGFydHNXaXRoICd5LScgdGhlbiB0YWdOYW1lID0gJ3ktJyArIHRhZ05hbWVcclxuXHJcbiAgcm9vdE5vZGVUeXBlID0gb3B0aW9ucy5yb290Tm9kZVR5cGUgb3IgT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSBvciAnZGl2J1xyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSByb290Tm9kZVR5cGUsIG9wdGlvbnMsIG93bmVyLCBmYWxzZVxyXG5cclxuICByZXQuYWRkICdjb250cm9sTmFtZScsIHRhZ05hbWVcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAnY29udHJvbCcsIGNvbnRyb2xcclxubW9kdWxlLmV4cG9ydHMgPSBjb250cm9sIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyICQsIE5vZGUsIE9KLCBUaGluRE9NLCBfLCBlbGVtZW50O1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbiQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cbl8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG5cbk5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcblxuVGhpbkRPTSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUaGluRE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUaGluRE9NJ10gOiBudWxsKTtcblxuZWxlbWVudCA9IHtcblxuICAvKlxuICBSZXN0b3JlIGFuIEhUTUwgRWxlbWVudCB0aHJvdWdoIFRoaW5Eb21cbiAgICovXG4gIHJlc3RvcmVFbGVtZW50OiBmdW5jdGlvbihlbCwgdGFnKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgaWYgKHRhZyA9PSBudWxsKSB7XG4gICAgICB0YWcgPSBlbC5ub2RlTmFtZTtcbiAgICB9XG4gICAgZWwub2ZXcmFwcGVyIHx8IChub2RlID0gbmV3IE5vZGUpO1xuICAgIG5vZGUuZWxlbWVudCA9IGVsO1xuICAgIHJldHVybiBub2RlO1xuICB9XG59O1xuXG5PSi5yZWdpc3RlcigncmVzdG9yZUVsZW1lbnQnLCBlbGVtZW50LnJlc3RvcmVFbGVtZW50KTtcblxuT0oucmVnaXN0ZXIoJ2lzRWxlbWVudEluRG9tJywgZnVuY3Rpb24oZWxlbWVudElkKSB7XG4gIHJldHVybiBmYWxzZSA9PT0gT0ouaXMubnVsbE9yRW1wdHkoT0ouZ2V0RWxlbWVudChlbGVtZW50SWQpKTtcbn0pO1xuXG5PSi5yZWdpc3RlcignZ2V0RWxlbWVudCcsIGZ1bmN0aW9uKGlkKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZWxlbWVudDtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRnhrYjIxY1hHVnNaVzFsYm5RdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFTeEpRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlEwb3NRMEZCUVN4SFFVRkpMRTlCUVVFc1EwRkJVU3hSUVVGU096dEJRVU5LTEVsQlFVRXNSMEZCVHl4UFFVRkJMRU5CUVZFc1VVRkJVanM3UVVGRlVDeFBRVUZCTEVkQlFWVXNUMEZCUVN4RFFVRlJMRk5CUVZJN08wRkJTVllzVDBGQlFTeEhRVVZGT3p0QlFVRkJPenM3UlVGSFFTeGpRVUZCTEVWQlFXZENMRk5CUVVNc1JVRkJSQ3hGUVVGTExFZEJRVXc3UVVGRFppeFJRVUZCT3p0TlFVUnZRaXhOUVVGTkxFVkJRVVVzUTBGQlF6czdTVUZETjBJc1JVRkJSU3hEUVVGRExGTkJRVWdzU1VGRFJTeERRVUZCTEVsQlFVRXNSMEZCVHl4SlFVRkpMRWxCUVZnN1NVRkRRU3hKUVVGSkxFTkJRVU1zVDBGQlRDeEhRVUZsTzFkQlEyWTdSVUZLWVN4RFFVaG9RanM3TzBGQlUwWXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3huUWtGQldpeEZRVUU0UWl4UFFVRlBMRU5CUVVNc1kwRkJkRU03TzBGQlJVRXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3huUWtGQldpeEZRVUU0UWl4VFFVRkRMRk5CUVVRN1UwRkROVUlzUzBGQlFTeExRVUZUTEVWQlFVVXNRMEZCUXl4RlFVRkZMRU5CUVVNc1YwRkJUaXhEUVVGclFpeEZRVUZGTEVOQlFVTXNWVUZCU0N4RFFVRmpMRk5CUVdRc1EwRkJiRUk3UVVGRWJVSXNRMEZCT1VJN08wRkJSMEVzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4WlFVRmFMRVZCUVRCQ0xGTkJRVU1zUlVGQlJEdEZRVU40UWl4SlFVRkhMRTlCUVU4c1VVRkJVQ3hMUVVGeFFpeFhRVUY0UWp0WFFVTkZMRkZCUVZFc1EwRkJReXhqUVVGVUxFTkJRWGRDTEVWQlFYaENMRVZCUkVZN08wRkJSSGRDTEVOQlFURkNPenRCUVV0QkxFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKUFNpQTlJSEpsY1hWcGNtVWdKeTR1TDI5cUoxeHlYRzRrSUQwZ2NtVnhkV2x5WlNBbmFuRjFaWEo1SjF4eVhHNWZJRDBnY21WeGRXbHlaU0FuYkc5a1lYTm9KMXh5WEc1T2IyUmxJRDBnY21WeGRXbHlaU0FuTGk5dWIyUmxKMXh5WEc1Y2NseHVWR2hwYmtSUFRTQTlJSEpsY1hWcGNtVWdKM1JvYVc1a2IyMG5YSEpjYmx4eVhHNGpJQ01nWld4bGJXVnVkRnh5WEc1Y2NseHVaV3hsYldWdWRDQTlJRnh5WEc0Z0lDTWdJeU1nY21WemRHOXlaVVZzWlcxbGJuUmNjbHh1SUNBakl5TmNjbHh1SUNCU1pYTjBiM0psSUdGdUlFaFVUVXdnUld4bGJXVnVkQ0IwYUhKdmRXZG9JRlJvYVc1RWIyMWNjbHh1SUNBakl5TmNjbHh1SUNCeVpYTjBiM0psUld4bGJXVnVkRG9nS0dWc0xDQjBZV2NnUFNCbGJDNXViMlJsVG1GdFpTa2dMVDVjY2x4dUlDQmNkR1ZzTG05bVYzSmhjSEJsY2lCdmNseHlYRzVjZENBZ0lDQnViMlJsSUQwZ2JtVjNJRTV2WkdWY2NseHVYSFFnSUNBZ2JtOWtaUzVsYkdWdFpXNTBJRDBnWld4Y2NseHVYSFFnSUNBZ2JtOWtaVnh5WEc1Y2NseHVUMG91Y21WbmFYTjBaWElnSjNKbGMzUnZjbVZGYkdWdFpXNTBKeXdnWld4bGJXVnVkQzV5WlhOMGIzSmxSV3hsYldWdWRGeHlYRzVjY2x4dVQwb3VjbVZuYVhOMFpYSWdKMmx6Uld4bGJXVnVkRWx1Ukc5dEp5d2dLR1ZzWlcxbGJuUkpaQ2tnTFQ1Y2NseHVJQ0JtWVd4elpTQnBjeUJQU2k1cGN5NXVkV3hzVDNKRmJYQjBlU0JQU2k1blpYUkZiR1Z0Wlc1MElHVnNaVzFsYm5SSlpGeHlYRzVjY2x4dVQwb3VjbVZuYVhOMFpYSWdKMmRsZEVWc1pXMWxiblFuTENBb2FXUXBJQzArWEhKY2JpQWdhV1lnZEhsd1pXOW1JR1J2WTNWdFpXNTBJR2x6Ym5RZ0ozVnVaR1ZtYVc1bFpDZGNjbHh1SUNBZ0lHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0dsa0tWeHlYRzVjY2x4dVhISmNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdaV3hsYldWdWRDSmRmUT09IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIGZyYWdtZW50XHJcblxyXG4jIENyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50IGFuZCByZXR1cm4gaXQgYXMgYW4gT0ogbm9kZVxyXG5mcmFnbWVudCA9IC0+XHJcbiAgcmV0ID0gbnVsbFxyXG4gIGlmIHR5cGVvZiBkb2N1bWVudCBpc250ICd1bmRlZmluZWQnXHJcbiAgICBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxyXG4gICAgXHJcbiAgICBmcmFnID0gbmV3IFRoaW5ET00gbnVsbCwgbnVsbCwgZnJhZ21lbnRcclxuICAgIGZyYWcuaXNJbkRPTSA9IHRydWVcclxuICAgIHJldCA9IG5vZGVGYWN0b3J5IGZyYWdcclxuICAgIFxyXG4gIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ2ZyYWdtZW50JywgZnJhZ21lbnRcclxubW9kdWxlLmV4cG9ydHMgPSBmcmFnbWVudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBnZW5lcmljIG5vZGVzXHJcblxyXG5jbG9zZWQgPSBbXHJcbiAgJ2FiYnInXHJcbiAgJ2Fjcm9ueW0nXHJcbiAgJ2FwcGxldCdcclxuICAnYXJ0aWNsZSdcclxuICAnYXNpZGUnXHJcbiAgJ2F1ZGlvJ1xyXG4gICdiJ1xyXG4gICdiZG8nXHJcbiAgJ2JpZydcclxuICAnYmxvY2txdW90ZSdcclxuICAnYnV0dG9uJ1xyXG4gICdjYW52YXMnXHJcbiAgJ2NhcHRpb24nXHJcbiAgJ2NlbnRlcidcclxuICAnY2l0ZSdcclxuICAnY29kZSdcclxuICAnY29sZ3JvdXAnXHJcbiAgJ2RhdGFsaXN0J1xyXG4gICdkZCdcclxuICAnZGVsJ1xyXG4gICdkZXRhaWxzJ1xyXG4gICdkZm4nXHJcbiAgJ2RpcidcclxuICAnZGl2J1xyXG4gICdkbCdcclxuICAnZHQnXHJcbiAgJ2VtJ1xyXG4gICdmaWVsZHNldCdcclxuICAnZmlnY2FwdGlvbidcclxuICAnZmlndXJlJ1xyXG4gICdmb250J1xyXG4gICdmb290ZXInXHJcbiAgJ2gxJ1xyXG4gICdoMidcclxuICAnaDMnXHJcbiAgJ2g0J1xyXG4gICdoNSdcclxuICAnaDYnXHJcbiAgJ2hlYWQnXHJcbiAgJ2hlYWRlcidcclxuICAnaGdyb3VwJ1xyXG4gICdodG1sJ1xyXG4gICdpJ1xyXG4gICdpZnJhbWUnXHJcbiAgJ2lucydcclxuICAna2JkJ1xyXG4gICdsYWJlbCdcclxuICAnbGVnZW5kJ1xyXG4gICdsaSdcclxuICAnbWFwJ1xyXG4gICdtYXJrJ1xyXG4gICdtZW51J1xyXG4gICdtZXRlcidcclxuICAnbmF2J1xyXG4gICdub2ZyYW1lcydcclxuICAnbm9zY3JpcHQnXHJcbiAgJ29iamVjdCdcclxuICAnb3B0Z3JvdXAnXHJcbiAgJ29wdGlvbidcclxuICAnb3V0cHV0J1xyXG4gICdwJ1xyXG4gICdwcmUnXHJcbiAgJ3Byb2dyZXNzJ1xyXG4gICdxJ1xyXG4gICdycCdcclxuICAncnQnXHJcbiAgJ3J1YnknXHJcbiAgJ3MnXHJcbiAgJ3NhbXAnXHJcbiAgJ3NlY3Rpb24nXHJcbiAgJ3NtYWxsJ1xyXG4gICdzcGFuJ1xyXG4gICdzdHJpa2UnXHJcbiAgJ3N0cm9uZydcclxuICAnc3R5bGUnXHJcbiAgJ3N1YidcclxuICAnc3VtbWFyeSdcclxuICAnc3VwJ1xyXG4gICd0Ym9keSdcclxuICAndGQnXHJcbiAgJ3Rmb290J1xyXG4gICd0aCdcclxuICAndGltZSdcclxuICAndGl0bGUnXHJcbiAgJ3RyJ1xyXG4gICd0dCdcclxuICAndSdcclxuICAndmFyJ1xyXG4gICd2aWRlbydcclxuICAneG1wJ1xyXG5dXHJcbm9wZW4gPSAnYXJlYSBiYXNlIGNvbCBjb21tYW5kIGNzcyBlbWJlZCBociBpbWcga2V5Z2VuIG1ldGEgcGFyYW0gc291cmNlIHRyYWNrIHdicicuc3BsaXQgJyAnXHJcbmFsbCA9IGNsb3NlZC5jb25jYXQgb3BlblxyXG5cclxuZXhwb3J0cyA9IHt9XHJcbiMgcmVnaXN0ZXIgc2VtYW50aWMvc3RydWN0dXJhbCBhbGlhc2VzXHJcbmZvciBsb29wTmFtZSBpbiBhbGxcclxuICBkbyAodGFnID0gbG9vcE5hbWUpIC0+XHJcbiAgICBtZXRob2QgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICAgICAgZGVmYXVsdHMgPVxyXG4gICAgICAgIHByb3BzOiB7fVxyXG4gICAgICAgIHN0eWxlczoge31cclxuICAgICAgICBldmVudHM6IHt9XHJcblxyXG4gICAgICBvYmouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zXHJcbiAgICAgIHJldCA9IG5vZGVGYWN0b3J5IHRhZywgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuICAgICAgcmV0XHJcbiAgICBtZXRob2QuZGVmYXVsdEJlaGF2aW9yID0gdHJ1ZVxyXG4gICAgT0oubm9kZXMucmVnaXN0ZXIgdGFnLCBtZXRob2RcclxuICAgIGV4cG9ydHNbdGFnXSA9IG1ldGhvZFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMjI1xyXG5DcmVhdGUgYW4gT0ogSW5wdXQgT2JqZWN0IHRocm91Z2ggT0oubm9kZXMuaW5wdXRcclxuIyMjXHJcbmlucHV0ID0gKG9wdGlvbnMgPSBPSi5vYmplY3QoKSwgb3duZXIpIC0+XHJcbiAgaWYgbm90IG93bmVyIHRoZW4gdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIGFuIGlucHV0IHdpdGhvdXQgYSBwYXJlbnQnXHJcbiAgaWYgbm90IG9wdGlvbnMucHJvcHMgb3Igbm90IG9wdGlvbnMucHJvcHMudHlwZSB0aGVuIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhbiBpbnB1dCB3aXRob3V0IGFuIGlucHV0IHR5cGUnXHJcbiAgcmV0ID0gb3duZXIubWFrZSAnaW5wdXQnLCBvcHRpb25zXHJcbiAgcmV0LmFkZCAnaW5wdXROYW1lJywgb3B0aW9ucy5wcm9wcy50eXBlXHJcbiAgcmV0XHJcbiAgICBcclxuT0oucmVnaXN0ZXIgJ2lucHV0JywgaW5wdXRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dCIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciAkLCBOb2RlLCBPSiwgbWV0aG9kcztcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG4kID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuXG5tZXRob2RzID0ge307XG5cbk5vZGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIE5vZGUocGFyZW50KSB7fVxuXG4gIE5vZGUucHJvdG90eXBlLm1ha2UgPSBmdW5jdGlvbih0YWdOYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIG1ldGhvZCwgbmV3T0pOb2RlO1xuICAgIGlmICh0YWdOYW1lLm1ha2UpIHtcbiAgICAgIHJldHVybiB0YWdOYW1lLm1ha2UodGhpcywgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1ldGhvZCA9IG1ldGhvZHNbdGFnTmFtZV07XG4gICAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBtZXRob2Qob3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZXRob2QgPSBPSi5ub2Rlc1t0YWdOYW1lXSB8fCBPSi5jb21wb25lbnRzW3RhZ05hbWVdIHx8IE9KLmNvbnRyb2xzW3RhZ05hbWVdIHx8IE9KLmlucHV0c1t0YWdOYW1lXTtcbiAgICAgICAgaWYgKG1ldGhvZCAmJiAhbWV0aG9kLmRlZmF1bHRCZWhhdmlvcikge1xuICAgICAgICAgIHJldHVybiBtZXRob2Qob3B0aW9ucywgdGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3T0pOb2RlID0gbmV3IE5vZGUoKTtcbiAgICAgICAgICBuZXdPSk5vZGUuZWxlbWVudCA9IG9qQ3JlYXRlRWxlbWVudCh0aGlzLmVsZW1lbnQsIHRhZ05hbWUsIG9wdGlvbnMpO1xuICAgICAgICAgIHJldHVybiBuZXdPSk5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgTm9kZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzW25hbWVdID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5valdyYXBwZXIgPSB0aGlzO1xuICB9O1xuXG4gIE5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgcGFyZW50LCB2YWx1ZTtcbiAgICB2YWx1ZSA9IHRoaXNbbmFtZV07XG4gICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHBhcmVudCA9IHRoaXMuZWxlbWVudDtcbiAgICAgIHdoaWxlIChwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZSkge1xuICAgICAgICBpZiAocGFyZW50Lm9qV3JhcHBlcikge1xuICAgICAgICAgIHJldHVybiBwYXJlbnQub2pXcmFwcGVyLmdldChuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIE5vZGUucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLiQuc2hvdygpO1xuICAgIHJldHVybiBvakNyZWF0ZUVsZW1lbnQub25TaG93KHRoaXMuZWxlbWVudCk7XG4gIH07XG5cbiAgTm9kZS5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJC5hdHRyKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgIHJldHVybiB0aGlzLiQuYWRkQ2xhc3MoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gIH07XG5cbiAgTm9kZS5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIHRoaXMuJC5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgfTtcblxuICByZXR1cm4gTm9kZTtcblxufSkoKTtcblxuWydvbicsICdlbXB0eScsICd0ZXh0JywgJ3JlbW92ZUNsYXNzJywgJ2FkZENsYXNzJywgJ2hhc0NsYXNzJywgJ2hpZGUnLCAnYXR0cicsICdyZW1vdmVBdHRyJywgJ2NzcycsICdyZW1vdmUnLCAnYXBwZW5kJywgJ3ZhbCcsICdodG1sJywgJ3Byb3AnLCAndHJpZ2dlciddLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gIHJldHVybiBOb2RlLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGpRdWVyeVdyYXBwZXI7XG4gICAgalF1ZXJ5V3JhcHBlciA9IHRoaXMuJDtcbiAgICByZXR1cm4galF1ZXJ5V3JhcHBlclttZXRob2RdLmFwcGx5KGpRdWVyeVdyYXBwZXIsIGFyZ3VtZW50cyk7XG4gIH07XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLCAnJCcsIHtcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgalF1ZXJ5V3JhcHBlcjtcbiAgICBqUXVlcnlXcmFwcGVyID0gJCh0aGlzLmVsZW1lbnQpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnJCcsIHtcbiAgICAgIHZhbHVlOiBqUXVlcnlXcmFwcGVyXG4gICAgfSk7XG4gICAgcmV0dXJuIGpRdWVyeVdyYXBwZXI7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9KLk5vZGUgPSBOb2RlO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeGtiMjFjWEc1dlpHVXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRU3hKUVVGQk96dEJRVUZCTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1QwRkJVanM3UVVGRFRDeERRVUZCTEVkQlFVa3NUMEZCUVN4RFFVRlJMRkZCUVZJN08wRkJUMG9zVDBGQlFTeEhRVUZWT3p0QlFVdEtPMFZCU1ZNc1kwRkJReXhOUVVGRUxFZEJRVUU3TzJsQ1FVVmlMRWxCUVVFc1IwRkJUU3hUUVVGRExFOUJRVVFzUlVGQlZTeFBRVUZXTzBGQlEwb3NVVUZCUVR0SlFVRkJMRWxCUVVjc1QwRkJUeXhEUVVGRExFbEJRVmc3WVVGRFJTeFBRVUZQTEVOQlFVTXNTVUZCVWl4RFFVRmhMRWxCUVdJc1JVRkJiVUlzVDBGQmJrSXNSVUZFUmp0TFFVRkJMRTFCUVVFN1RVRkhSU3hOUVVGQkxFZEJRVk1zVDBGQlVTeERRVUZCTEU5QlFVRTdUVUZEYWtJc1NVRkJSeXhOUVVGSU8yVkJRMFVzVFVGQlFTeERRVUZQTEU5QlFWQXNSVUZFUmp0UFFVRkJMRTFCUVVFN1VVRkhSU3hOUVVGQkxFZEJRVk1zUlVGQlJTeERRVUZETEV0QlFVMHNRMEZCUVN4UFFVRkJMRU5CUVZRc1NVRkJjVUlzUlVGQlJTeERRVUZETEZWQlFWY3NRMEZCUVN4UFFVRkJMRU5CUVc1RExFbEJRU3RETEVWQlFVVXNRMEZCUXl4UlFVRlRMRU5CUVVFc1QwRkJRU3hEUVVFelJDeEpRVUYxUlN4RlFVRkZMRU5CUVVNc1RVRkJUeXhEUVVGQkxFOUJRVUU3VVVGRE1VWXNTVUZCUnl4TlFVRkJMRWxCUVZVc1EwRkJReXhOUVVGTkxFTkJRVU1zWlVGQmNrSTdhVUpCUTBVc1RVRkJRU3hEUVVGUExFOUJRVkFzUlVGQlowSXNTVUZCYUVJc1JVRkVSanRUUVVGQkxFMUJRVUU3VlVGSFJTeFRRVUZCTEVkQlFXZENMRWxCUVVFc1NVRkJRU3hEUVVGQk8xVkJRMmhDTEZOQlFWTXNRMEZCUXl4UFFVRldMRWRCUVc5Q0xHVkJRVUVzUTBGQlowSXNTVUZCUXl4RFFVRkJMRTlCUVdwQ0xFVkJRVEJDTEU5QlFURkNMRVZCUVcxRExFOUJRVzVETzJsQ1FVTndRaXhWUVV4R08xTkJTa1k3VDBGS1JqczdSVUZFU1RzN2FVSkJaMEpPTEVkQlFVRXNSMEZCU3l4VFFVRkRMRWxCUVVRc1JVRkJUeXhMUVVGUU8wbEJRMGdzU1VGQlN5eERRVUZCTEVsQlFVRXNRMEZCVEN4SFFVRmhPMWRCUldJc1NVRkJReXhEUVVGQkxFOUJRVThzUTBGQlF5eFRRVUZVTEVkQlFYRkNPMFZCU0d4Q096dHBRa0ZMVEN4SFFVRkJMRWRCUVVzc1UwRkJReXhKUVVGRU8wRkJRMGdzVVVGQlFUdEpRVUZCTEV0QlFVRXNSMEZCVVN4SlFVRkxMRU5CUVVFc1NVRkJRVHRKUVVOaUxFbEJRVWNzUzBGQlFTeExRVUZUTEUxQlFWbzdUVUZEUlN4TlFVRkJMRWRCUVZNc1NVRkJReXhEUVVGQk8wRkJRMVlzWVVGQlRTeE5RVUZCTEVkQlFWTXNUVUZCVFN4RFFVRkRMRlZCUVhSQ08xRkJRMFVzU1VGQlJ5eE5RVUZOTEVOQlFVTXNVMEZCVmp0QlFVTkZMR2xDUVVGUExFMUJRVTBzUTBGQlF5eFRRVUZUTEVOQlFVTXNSMEZCYWtJc1EwRkJjVUlzU1VGQmNrSXNSVUZFVkRzN1RVRkVSaXhEUVVaR08wdEJRVUVzVFVGQlFUdGhRVTFGTEUxQlRrWTdPMFZCUmtjN08ybENRVlZNTEVsQlFVRXNSMEZCVFN4VFFVRkJPMGxCUTBvc1NVRkJReXhEUVVGQkxFTkJRVU1zUTBGQlF5eEpRVUZJTEVOQlFVRTdWMEZEUVN4bFFVRmxMRU5CUVVNc1RVRkJhRUlzUTBGQmRVSXNTVUZCUXl4RFFVRkJMRTlCUVhoQ08wVkJSa2s3TzJsQ1FVbE9MRTlCUVVFc1IwRkJVeXhUUVVGQk8wbEJRMUFzU1VGQlF5eERRVUZCTEVOQlFVTXNRMEZCUXl4SlFVRklMRU5CUVZFc1ZVRkJVaXhGUVVGdlFpeFZRVUZ3UWp0WFFVTkJMRWxCUVVNc1EwRkJRU3hEUVVGRExFTkJRVU1zVVVGQlNDeERRVUZaTEZWQlFWb3NSVUZCZDBJc1ZVRkJlRUk3UlVGR1R6czdhVUpCU1ZRc1RVRkJRU3hIUVVGUkxGTkJRVUU3U1VGRFRpeEpRVUZETEVOQlFVRXNRMEZCUXl4RFFVRkRMRlZCUVVnc1EwRkJaU3hWUVVGbU8xZEJRMEVzU1VGQlF5eERRVUZCTEVOQlFVTXNRMEZCUXl4WFFVRklMRU5CUVdVc1ZVRkJaanRGUVVaTk96czdPenM3UVVGSlZpeERRVU5GTEVsQlJFWXNSVUZGUlN4UFFVWkdMRVZCUjBVc1RVRklSaXhGUVVsRkxHRkJTa1lzUlVGTFJTeFZRVXhHTEVWQlRVVXNWVUZPUml4RlFVOUZMRTFCVUVZc1JVRlJSU3hOUVZKR0xFVkJVMFVzV1VGVVJpeEZRVlZGTEV0QlZrWXNSVUZYUlN4UlFWaEdMRVZCV1VVc1VVRmFSaXhGUVdGRkxFdEJZa1lzUlVGalJTeE5RV1JHTEVWQlpVVXNUVUZtUml4RlFXZENSU3hUUVdoQ1JpeERRV2xDUXl4RFFVRkRMRTlCYWtKR0xFTkJhVUpWTEZOQlFVTXNUVUZCUkR0VFFVTlNMRWxCUVVrc1EwRkJReXhUUVVGVkxFTkJRVUVzVFVGQlFTeERRVUZtTEVkQlFYbENMRk5CUVVFN1FVRkRka0lzVVVGQlFUdEpRVUZCTEdGQlFVRXNSMEZCWjBJc1NVRkJReXhEUVVGQk8xZEJRMnBDTEdGQlFXTXNRMEZCUVN4TlFVRkJMRU5CUVU4c1EwRkJReXhMUVVGMFFpeERRVUUwUWl4aFFVRTFRaXhGUVVFeVF5eFRRVUV6UXp0RlFVWjFRanRCUVVScVFpeERRV3BDVmpzN1FVRjFRa0VzVFVGQlRTeERRVUZETEdOQlFWQXNRMEZCYzBJc1NVRkJTU3hEUVVGRExGTkJRVE5DTEVWQlFYTkRMRWRCUVhSRExFVkJRMFU3UlVGQlFTeEhRVUZCTEVWQlFVc3NVMEZCUVR0QlFVTklMRkZCUVVFN1NVRkJRU3hoUVVGQkxFZEJRV2RDTEVOQlFVRXNRMEZCUlN4SlFVRkpMRU5CUVVNc1QwRkJVRHRKUVVOb1FpeE5RVUZOTEVOQlFVTXNZMEZCVUN4RFFVRnpRaXhKUVVGMFFpeEZRVUUwUWl4SFFVRTFRaXhGUVVORk8wMUJRVUVzUzBGQlFTeEZRVUZQTEdGQlFWQTdTMEZFUmp0WFFVZEJPMFZCVEVjc1EwRkJURHREUVVSR096dEJRVlZCTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0xFVkJRVVVzUTBGQlF5eEpRVUZJTEVkQlFWVWlMQ0ptYVd4bElqb2laMlZ1WlhKaGRHVmtMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWs5S0lEMGdjbVZ4ZFdseVpTQW5MaTR2YjJvblhISmNiaVFnUFNCeVpYRjFhWEpsSUNkcWNYVmxjbmtuWEhKY2JseHlYRzRqSUNNZ1pHOXRYSEpjYmx4eVhHNWNjbHh1SXlCRmVIUmxibVFnWVc0Z2IySnFaV04wSUhkcGRHZ2dUMG9nUkU5TklHMWxkR2h2WkhNZ1lXNWtJSEJ5YjNCbGNuUnBaWE5jY2x4dVhISmNibTFsZEdodlpITWdQU0I3ZlZ4eVhHNWNjbHh1WEhKY2JpTWdMU0JnUUdWc1lDQlBZbXBsWTNRZ2RHOGdaWGgwWlc1a1hISmNiaU1nTFNCZ2NHRnlaVzUwWUNCd1lYSmxiblFnYjJKcVpXTjBJSFJ2SUhkb2FXTm9JR0JBWld4Z0lIZHBiR3dnWW1VZ1lYQndaVzVrWldSY2NseHVZMnhoYzNNZ1RtOWtaVnh5WEc0Z0lGeHlYRzRnSUNOd1lYSmxiblE2SUhKbGNYVnBjbVVvSnk0dlltOWtlU2NwWEhKY2JpQWdYSEpjYmlBZ1kyOXVjM1J5ZFdOMGIzSTZJQ2h3WVhKbGJuUXBJQzArWEhKY2JseHlYRzRnSUcxaGEyVTZJQ2gwWVdkT1lXMWxMQ0J2Y0hScGIyNXpLU0F0UGx4eVhHNGdJQ0FnYVdZZ2RHRm5UbUZ0WlM1dFlXdGxJQ01nY0hKdmRtbGtaV1FnWVNCamRYTjBiMjBnWTI5dGNHOXVaVzUwSUdScGNtVmpkR3g1WEhKY2JpQWdJQ0FnSUhSaFowNWhiV1V1YldGclpTQjBhR2x6TENCdmNIUnBiMjV6WEhKY2JpQWdJQ0JsYkhObFhISmNiaUFnSUNBZ0lHMWxkR2h2WkNBOUlHMWxkR2h2WkhOYmRHRm5UbUZ0WlYxY2NseHVJQ0FnSUNBZ2FXWWdiV1YwYUc5a1hISmNiaUFnSUNBZ0lDQWdiV1YwYUc5a0lHOXdkR2x2Ym5OY2NseHVJQ0FnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0FnSUcxbGRHaHZaQ0E5SUU5S0xtNXZaR1Z6VzNSaFowNWhiV1ZkSUc5eUlFOUtMbU52YlhCdmJtVnVkSE5iZEdGblRtRnRaVjBnYjNJZ1Qwb3VZMjl1ZEhKdmJITmJkR0ZuVG1GdFpWMGdiM0lnVDBvdWFXNXdkWFJ6VzNSaFowNWhiV1ZkWEhKY2JpQWdJQ0FnSUNBZ2FXWWdiV1YwYUc5a0lDWW1JQ0Z0WlhSb2IyUXVaR1ZtWVhWc2RFSmxhR0YyYVc5eVhISmNiaUFnSUNBZ0lDQWdJQ0J0WlhSb2IyUWdiM0IwYVc5dWN5d2dkR2hwYzF4eVhHNGdJQ0FnSUNBZ0lHVnNjMlZjY2x4dUlDQWdJQ0FnSUNBZ0lHNWxkMDlLVG05a1pTQTlJRzVsZHlCT2IyUmxLQ2xjY2x4dUlDQWdJQ0FnSUNBZ0lHNWxkMDlLVG05a1pTNWxiR1Z0Wlc1MElEMGdiMnBEY21WaGRHVkZiR1Z0Wlc1MElFQmxiR1Z0Wlc1MExDQjBZV2RPWVcxbExDQnZjSFJwYjI1elhISmNiaUFnSUNBZ0lDQWdJQ0J1WlhkUFNrNXZaR1ZjY2x4dVhISmNiaUFnWVdSa09pQW9ibUZ0WlN3Z2RtRnNkV1VwSUMwK1hISmNiaUFnSUNCMGFHbHpXMjVoYldWZElEMGdkbUZzZFdWY2NseHVJQ0FnSUNNZ2JXRnJaU0J6ZFhKbElIZGxJR2hoZG1VZ1lTQnNhVzVySUdKaFkyc2dkRzhnYjNWeWMyVnNkbVZ6TENCemJ5QjNaU0JqWVc0Z2FXNW9aWEpwZENCMllXeDFaWE5jY2x4dUlDQWdJRUJsYkdWdFpXNTBMbTlxVjNKaGNIQmxjaUE5SUhSb2FYTmNjbHh1WEhKY2JpQWdaMlYwT2lBb2JtRnRaU2tnTFQ1Y2NseHVJQ0FnSUhaaGJIVmxJRDBnZEdocGMxdHVZVzFsWFZ4eVhHNGdJQ0FnYVdZZ2RtRnNkV1VnYVhNZ2RXNWtaV1pwYm1Wa1hISmNiaUFnSUNBZ0lIQmhjbVZ1ZENBOUlFQmxiR1Z0Wlc1MFhISmNiaUFnSUNBZ0lIZG9hV3hsSUhCaGNtVnVkQ0E5SUhCaGNtVnVkQzV3WVhKbGJuUk9iMlJsWEhKY2JpQWdJQ0FnSUNBZ2FXWWdjR0Z5Wlc1MExtOXFWM0poY0hCbGNseHlYRzRnSUNBZ0lDQWdJQ0FnY21WMGRYSnVJSEJoY21WdWRDNXZhbGR5WVhCd1pYSXVaMlYwSUc1aGJXVmNjbHh1SUNBZ0lHVnNjMlZjY2x4dUlDQWdJQ0FnZG1Gc2RXVmNjbHh1WEhKY2JpQWdjMmh2ZHpvZ0tDa2dMVDVjY2x4dUlDQWdJRUFrTG5Ob2IzY29LVnh5WEc0Z0lDQWdiMnBEY21WaGRHVkZiR1Z0Wlc1MExtOXVVMmh2ZHlCQVpXeGxiV1Z1ZEZ4eVhHNWNjbHh1SUNCa2FYTmhZbXhsT2lBb0tTQXRQbHh5WEc0Z0lDQWdRQ1F1WVhSMGNpQW5aR2x6WVdKc1pXUW5MQ0FuWkdsellXSnNaV1FuWEhKY2JpQWdJQ0JBSkM1aFpHUkRiR0Z6Y3lBblpHbHpZV0pzWldRbkxDQW5aR2x6WVdKc1pXUW5YSEpjYmx4eVhHNGdJR1Z1WVdKc1pUb2dLQ2tnTFQ1Y2NseHVJQ0FnSUVBa0xuSmxiVzkyWlVGMGRISWdJQ2RrYVhOaFlteGxaQ2RjY2x4dUlDQWdJRUFrTG5KbGJXOTJaVU5zWVhOeklDZGthWE5oWW14bFpDZGNjbHh1WEhKY2JsdGNjbHh1SUNBbmIyNG5YSEpjYmlBZ0oyVnRjSFI1SjF4eVhHNGdJQ2QwWlhoMEoxeHlYRzRnSUNkeVpXMXZkbVZEYkdGemN5ZGNjbHh1SUNBbllXUmtRMnhoYzNNblhISmNiaUFnSjJoaGMwTnNZWE56SjF4eVhHNGdJQ2RvYVdSbEoxeHlYRzRnSUNkaGRIUnlKMXh5WEc0Z0lDZHlaVzF2ZG1WQmRIUnlKMXh5WEc0Z0lDZGpjM01uWEhKY2JpQWdKM0psYlc5MlpTZGNjbHh1SUNBbllYQndaVzVrSjF4eVhHNGdJQ2QyWVd3blhISmNiaUFnSjJoMGJXd25YSEpjYmlBZ0ozQnliM0FuWEhKY2JpQWdKM1J5YVdkblpYSW5YSEpjYmwwdVptOXlSV0ZqYUNnb2JXVjBhRzlrS1NBdFBseHlYRzRnSUU1dlpHVXVjSEp2ZEc5MGVYQmxXMjFsZEdodlpGMGdQU0FvS1NBdFBseHlYRzRnSUNBZ2FsRjFaWEo1VjNKaGNIQmxjaUE5SUVBa1hISmNiaUFnSUNCcVVYVmxjbmxYY21Gd2NHVnlXMjFsZEdodlpGMHVZWEJ3Ykhrb2FsRjFaWEo1VjNKaGNIQmxjaXdnWVhKbmRXMWxiblJ6S1Z4eVhHNHBYSEpjYmx4eVhHNVBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtvVG05a1pTNXdjbTkwYjNSNWNHVXNJQ2NrSnl4Y2NseHVJQ0JuWlhRNklDZ3BJQzArWEhKY2JpQWdJQ0JxVVhWbGNubFhjbUZ3Y0dWeUlEMGdKQ2gwYUdsekxtVnNaVzFsYm5RcFhISmNiaUFnSUNCUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa29kR2hwY3l3Z0p5UW5MRnh5WEc0Z0lDQWdJQ0IyWVd4MVpUb2dhbEYxWlhKNVYzSmhjSEJsY2x4eVhHNGdJQ0FnS1Z4eVhHNGdJQ0FnYWxGMVpYSjVWM0poY0hCbGNseHlYRzRwWEhKY2JseHlYRzVjY2x4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCUFNpNU9iMlJsSUQwZ1RtOWtaU0pkZlE9PSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBOb2RlLCBOb2RlRmFjdG9yeSwgT0osIFRoaW5ET00sIF8sIGRlZmF1bHRDcmVhdGVFbGVtZW50LCBnZXROb2RlRnJvbUZhY3RvcnksIG1ha2UsXG4gIHNsaWNlID0gW10uc2xpY2U7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuVGhpbkRPTSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUaGluRE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUaGluRE9NJ10gOiBudWxsKTtcblxuTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xuXG5Ob2RlRmFjdG9yeSA9IChmdW5jdGlvbigpIHtcbiAgTm9kZUZhY3RvcnkucHJvdG90eXBlLm9qTm9kZSA9IG51bGw7XG5cbiAgTm9kZUZhY3RvcnkuZ2V0ID0gZnVuY3Rpb24oaWQsIHRhZ05hbWUpIHtcbiAgICB2YXIgZWwsIHJldCwgdGhpbkVsO1xuICAgIGlmICh0YWdOYW1lID09IG51bGwpIHtcbiAgICAgIHRhZ05hbWUgPSAnZGl2JztcbiAgICB9XG4gICAgcmV0ID0gbnVsbDtcbiAgICBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgIHRoaW5FbCA9IE9KLnJlc3RvcmVFbGVtZW50KGVsLCB0YWdOYW1lKTtcbiAgICB9XG4gICAgaWYgKHRoaW5FbCkge1xuICAgICAgcmV0ID0gbmV3IE5vZGVGYWN0b3J5KG51bGwsIG51bGwsIG51bGwsIGZhbHNlLCB0aGluRWwpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIE5vZGVGYWN0b3J5LnByb3RvdHlwZS5fbWFrZUFkZCA9IGZ1bmN0aW9uKHRhZ05hbWUsIGNvdW50KSB7XG4gICAgcmV0dXJuIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9wdHMpIHtcbiAgICAgICAgdmFyIG1ldGhvZCwgbnU7XG4gICAgICAgIG1ldGhvZCA9IE9KLm5vZGVzW3RhZ05hbWVdIHx8IE9KLmNvbXBvbmVudHNbdGFnTmFtZV0gfHwgT0ouY29udHJvbHNbdGFnTmFtZV0gfHwgT0ouaW5wdXRzW3RhZ05hbWVdO1xuICAgICAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgICAgbnUgPSBtZXRob2Qob3B0cywgX3RoaXMub2pOb2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBudSA9IE9KLmNvbXBvbmVudChudWxsLCBfdGhpcy5vak5vZGUsIHRhZ05hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudTtcbiAgICAgIH07XG4gICAgfSkodGhpcyk7XG4gIH07XG5cbiAgTm9kZUZhY3RvcnkucHJvdG90eXBlLl9tYWtlVW5pcXVlSWQgPSBmdW5jdGlvbihjb3VudCkge1xuICAgIHZhciBpZDtcbiAgICBpZiAoT0ouR0VORVJBVEVfVU5JUVVFX0lEUykge1xuICAgICAgY291bnQgKz0gMTtcbiAgICAgIGlmIChjb3VudCA8PSB0aGlzLm93bmVyLmNvdW50KSB7XG4gICAgICAgIGNvdW50ID0gdGhpcy5vd25lci5jb3VudCArIDE7XG4gICAgICB9XG4gICAgICB0aGlzLm93bmVyLmNvdW50ID0gY291bnQ7XG4gICAgICBpZiAoIXRoaXMub2pOb2RlLmdldElkKCkpIHtcbiAgICAgICAgaWQgPSB0aGlzLm93bmVyLmdldElkKCkgfHwgJyc7XG4gICAgICAgIGlkICs9IHRoaXMub2pOb2RlLnRhZ05hbWUgKyBjb3VudDtcbiAgICAgICAgdGhpcy5vak5vZGUuYXR0cignaWQnLCBpZCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIE5vZGVGYWN0b3J5LnByb3RvdHlwZS5fYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLm9qTm9kZSkge1xuICAgICAgcmV0dXJuIF8uZm9yT3duKHRoaXMub3B0aW9ucy5ldmVudHMsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICB2YXIgY2FsbGJhY2ssIGlzTWV0aG9kO1xuICAgICAgICAgIGlzTWV0aG9kID0gcmVxdWlyZSgnLi4vdG9vbHMvaXMnKTtcbiAgICAgICAgICBpZiAoaXNNZXRob2QubWV0aG9kKHZhbCkpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHZhciBldmVudDtcbiAgICAgICAgICAgICAgZXZlbnQgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbC5hcHBseShudWxsLCBldmVudCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgX3RoaXMub2pOb2RlLiQub24oa2V5LCBjYWxsYmFjayk7XG4gICAgICAgICAgICBfdGhpcy5vak5vZGUuYWRkKGtleSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBOb2RlRmFjdG9yeSh0YWcxLCBvcHRpb25zMSwgb3duZXIxLCB0aGluTm9kZSkge1xuICAgIHRoaXMudGFnID0gdGFnMTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zMTtcbiAgICB0aGlzLm93bmVyID0gb3duZXIxO1xuICAgIHRoaXMudGhpbk5vZGUgPSB0aGluTm9kZSAhPSBudWxsID8gdGhpbk5vZGUgOiBudWxsO1xuICAgIGlmICh0aGlzLnRhZyAmJiAhdGhpcy50aGluTm9kZSkge1xuICAgICAgdGhpcy50aGluTm9kZSA9IG5ldyBUaGluRE9NKHRoaXMudGFnLCB0aGlzLm9wdGlvbnMucHJvcHMpO1xuICAgICAgdGhpcy50aGluTm9kZS5hZGQoJ3RhZ05hbWUnLCB0aGlzLnRhZyk7XG4gICAgICB0aGlzLnRoaW5Ob2RlLmNzcyh0aGlzLm9wdGlvbnMuc3R5bGVzKTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGV4dCkge1xuICAgICAgICB0aGlzLnRoaW5Ob2RlLnRleHQodGhpcy5vcHRpb25zLnRleHQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5vd25lcikge1xuICAgICAgdGhpcy5tYWtlKCk7XG4gICAgfVxuICB9XG5cbiAgTm9kZUZhY3RvcnkucHJvdG90eXBlLmFkZE1ha2VNZXRob2QgPSBmdW5jdGlvbihjb3VudCkge1xuICAgIHZhciBtZXRob2RzO1xuICAgIG1ldGhvZHMgPSBPSi5vYmplY3QoKTtcbiAgICB0aGlzLm9qTm9kZS5tYWtlID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odGFnTmFtZSwgb3B0cykge1xuICAgICAgICB2YXIgbWV0aG9kO1xuICAgICAgICBtZXRob2QgPSBtZXRob2RzW3RhZ05hbWVdO1xuICAgICAgICBpZiAoIW1ldGhvZCkge1xuICAgICAgICAgIG1ldGhvZCA9IF90aGlzLl9tYWtlQWRkKHRhZ05hbWUsIF90aGlzLm9qTm9kZSwgY291bnQpO1xuICAgICAgICAgIG1ldGhvZHNbdGFnTmFtZV0gPSBtZXRob2Q7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1ldGhvZChvcHRzKTtcbiAgICAgIH07XG4gICAgfSkodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMub2pOb2RlO1xuICB9O1xuXG4gIE5vZGVGYWN0b3J5LnByb3RvdHlwZS5tYWtlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvdW50LCBmaW5hbGl6ZSwgcmVmO1xuICAgIHRoaXMub2pOb2RlID0gbnVsbDtcbiAgICBpZiAoKHJlZiA9IHRoaXMudGhpbk5vZGUpICE9IG51bGwgPyByZWYuaXNGdWxseUluaXQgOiB2b2lkIDApIHtcbiAgICAgIHRoaXMub2pOb2RlID0gdGhpcy50aGluTm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vak5vZGUgPSBuZXcgTm9kZSh0aGlzLnRoaW5Ob2RlLCB0aGlzLm93bmVyKTtcbiAgICAgIGNvdW50ID0gKHRoaXMub3duZXIuY291bnQgKyAxKSB8fCAxO1xuICAgICAgaWYgKHRoaXMudGhpbk5vZGUudGFnTmFtZSAhPT0gJ2JvZHknICYmICF0aGlzLnRoaW5Ob2RlLmlzSW5ET00gJiYgIXRoaXMub2pOb2RlLmlzSW5ET00pIHtcbiAgICAgICAgdGhpcy5fbWFrZVVuaXF1ZUlkKGNvdW50KTtcbiAgICAgICAgdGhpcy5vd25lci5hcHBlbmQodGhpcy5vak5vZGVbMF0pO1xuICAgICAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XG4gICAgICB9XG4gICAgICB0aGlzLnRoaW5Ob2RlLmlzSW5ET00gPSB0cnVlO1xuICAgICAgdGhpcy5vak5vZGUuaXNJbkRPTSA9IHRydWU7XG4gICAgICB0aGlzLmFkZE1ha2VNZXRob2QoY291bnQpO1xuICAgICAgdGhpcy5vak5vZGUuaXNGdWxseUluaXQgPSB0cnVlO1xuICAgICAgZmluYWxpemUgPSBfLm9uY2UodGhpcy5vak5vZGUuZmluYWxpemUgfHwgT0oubm9vcCk7XG4gICAgICB0aGlzLm9qTm9kZS5maW5hbGl6ZSA9IGZpbmFsaXplO1xuICAgICAgZmluYWxpemUodGhpcy5vak5vZGUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vak5vZGU7XG4gIH07XG5cbiAgcmV0dXJuIE5vZGVGYWN0b3J5O1xuXG59KSgpO1xuXG5kZWZhdWx0Q3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKHBhcmVudCwgdGFnLCBvcHRpb25zKSB7XG4gIHZhciBrZXksIG5ld0VsZW1lbnQsIHJlZiwgcmVmMSwgcmVmMiwgdmFsdWU7XG4gIG5ld0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZyk7XG4gIGlmIChvcHRpb25zKSB7XG4gICAgcmVmID0gb3B0aW9ucy5wcm9wcztcbiAgICBmb3IgKGtleSBpbiByZWYpIHtcbiAgICAgIHZhbHVlID0gcmVmW2tleV07XG4gICAgICBuZXdFbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIHZhbHVlKTtcbiAgICB9XG4gICAgcmVmMSA9IG9wdGlvbnMuZXZlbnRzO1xuICAgIGZvciAoa2V5IGluIHJlZjEpIHtcbiAgICAgIHZhbHVlID0gcmVmMVtrZXldO1xuICAgICAgJChuZXdFbGVtZW50KS5vbihrZXksIHZhbHVlKTtcbiAgICB9XG4gICAgcmVmMiA9IG9wdGlvbnMuc3R5bGVzO1xuICAgIGZvciAoa2V5IGluIHJlZjIpIHtcbiAgICAgIHZhbHVlID0gcmVmMltrZXldO1xuICAgICAgJChuZXdFbGVtZW50KS5jc3Moa2V5LCB2YWx1ZSk7XG4gICAgfVxuICAgIHZhbHVlID0gb3B0aW9ucy50ZXh0O1xuICAgIGlmICh2YWx1ZSAhPT0gdm9pZCAwKSB7XG4gICAgICAkKG5ld0VsZW1lbnQpLnRleHQodmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGFyZW50ICE9IG51bGwgPyBwYXJlbnQuYXBwZW5kQ2hpbGQobmV3RWxlbWVudCkgOiB2b2lkIDA7XG59O1xuXG5nZXROb2RlRnJvbUZhY3RvcnkgPSBmdW5jdGlvbih0YWcsIG9wdGlvbnMsIG93bmVyLCBpc0NhbGxlZEZyb21GYWN0b3J5LCBub2RlKSB7XG4gIHZhciBuZXdPSk5vZGU7XG4gIG5ld09KTm9kZSA9IG5ldyBOb2RlKCk7XG4gIGlmICghd2luZG93Lm9qQ3JlYXRlRWxlbWVudCkge1xuICAgIHdpbmRvdy5vakNyZWF0ZUVsZW1lbnQgPSBkZWZhdWx0Q3JlYXRlRWxlbWVudDtcbiAgfVxuICBuZXdPSk5vZGUuZWxlbWVudCA9IG9qQ3JlYXRlRWxlbWVudChvd25lci5lbGVtZW50LCB0YWcgfHwgJ2RpdicsIG9wdGlvbnMpO1xuICByZXR1cm4gbmV3T0pOb2RlO1xufTtcblxuT0oucmVnaXN0ZXIoJ25vZGVGYWN0b3J5JywgZ2V0Tm9kZUZyb21GYWN0b3J5KTtcblxubWFrZSA9IGZ1bmN0aW9uKHRhZywgb3B0aW9ucykge1xuICB2YXIgbmV3T0pOb2RlO1xuICBuZXdPSk5vZGUgPSBuZXcgTm9kZSgpO1xuICBuZXdPSk5vZGUuZWxlbWVudCA9IG9qQ3JlYXRlRWxlbWVudChudWxsLCB0YWcgfHwgJ2RpdicsIG9wdGlvbnMpO1xuICByZXR1cm4gbmV3T0pOb2RlO1xufTtcblxuT0oucmVnaXN0ZXIoJ21ha2UnLCBtYWtlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXROb2RlRnJvbUZhY3Rvcnk7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4a2IyMWNYRzV2WkdWR1lXTjBiM0o1TG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPMEZCUVVFc1NVRkJRU3hwUmtGQlFUdEZRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlEwb3NUMEZCUVN4SFFVRlZMRTlCUVVFc1EwRkJVU3hUUVVGU096dEJRVU5XTEVsQlFVRXNSMEZCVHl4UFFVRkJMRU5CUVZFc1VVRkJVanM3UVVFclJVUTdkMEpCUlVvc1RVRkJRU3hIUVVGUk96dEZRVVZTTEZkQlFVTXNRMEZCUVN4SFFVRkVMRWRCUVUwc1UwRkJReXhGUVVGRUxFVkJRVXNzVDBGQlREdEJRVU5LTEZGQlFVRTdPMDFCUkZNc1ZVRkJWVHM3U1VGRGJrSXNSMEZCUVN4SFFVRk5PMGxCUTA0c1JVRkJRU3hIUVVGTExGRkJRVkVzUTBGQlF5eGpRVUZVTEVOQlFYZENMRVZCUVhoQ08wbEJRMHdzU1VGQlJ5eEZRVUZJTzAxQlEwVXNUVUZCUVN4SFFVRlRMRVZCUVVVc1EwRkJReXhqUVVGSUxFTkJRV3RDTEVWQlFXeENMRVZCUVhOQ0xFOUJRWFJDTEVWQlJGZzdPMGxCUlVFc1NVRkJSeXhOUVVGSU8wMUJRMFVzUjBGQlFTeEhRVUZWTEVsQlFVRXNWMEZCUVN4RFFVRlpMRWxCUVZvc1JVRkJhMElzU1VGQmJFSXNSVUZCZDBJc1NVRkJlRUlzUlVGQk9FSXNTMEZCT1VJc1JVRkJjVU1zVFVGQmNrTXNSVUZFV2pzN1YwRkhRVHRGUVZKSk96dDNRa0ZWVGl4UlFVRkJMRWRCUVZVc1UwRkJReXhQUVVGRUxFVkJRVlVzUzBGQlZqdFhRVU5TTEVOQlFVRXNVMEZCUVN4TFFVRkJPMkZCUVVFc1UwRkJReXhKUVVGRU8wRkJRMFVzV1VGQlFUdFJRVUZCTEUxQlFVRXNSMEZCVXl4RlFVRkZMRU5CUVVNc1MwRkJUU3hEUVVGQkxFOUJRVUVzUTBGQlZDeEpRVUZ4UWl4RlFVRkZMRU5CUVVNc1ZVRkJWeXhEUVVGQkxFOUJRVUVzUTBGQmJrTXNTVUZCSzBNc1JVRkJSU3hEUVVGRExGRkJRVk1zUTBGQlFTeFBRVUZCTEVOQlFUTkVMRWxCUVhWRkxFVkJRVVVzUTBGQlF5eE5RVUZQTEVOQlFVRXNUMEZCUVR0UlFVTXhSaXhKUVVGSExFMUJRVWc3VlVGRFJTeEZRVUZCTEVkQlFVc3NUVUZCUVN4RFFVRlBMRWxCUVZBc1JVRkJZU3hMUVVGRExFTkJRVUVzVFVGQlpDeEZRVVJRTzFOQlFVRXNUVUZCUVR0VlFVZEZMRVZCUVVFc1IwRkJTeXhGUVVGRkxFTkJRVU1zVTBGQlNDeERRVUZoTEVsQlFXSXNSVUZCYlVJc1MwRkJReXhEUVVGQkxFMUJRWEJDTEVWQlFUUkNMRTlCUVRWQ0xFVkJTRkE3TzJWQlMwRTdUVUZRUmp0SlFVRkJMRU5CUVVFc1EwRkJRU3hEUVVGQkxFbEJRVUU3UlVGRVVUczdkMEpCVlZZc1lVRkJRU3hIUVVGbExGTkJRVU1zUzBGQlJEdEJRVU5pTEZGQlFVRTdTVUZCUVN4SlFVRkhMRVZCUVVVc1EwRkJReXh0UWtGQlRqdE5RVU5GTEV0QlFVRXNTVUZCVXp0TlFVTlVMRWxCUVVjc1MwRkJRU3hKUVVGVExFbEJRVU1zUTBGQlFTeExRVUZMTEVOQlFVTXNTMEZCYmtJN1VVRkJPRUlzUzBGQlFTeEhRVUZSTEVsQlFVTXNRMEZCUVN4TFFVRkxMRU5CUVVNc1MwRkJVQ3hIUVVGbExFVkJRWEpFT3p0TlFVTkJMRWxCUVVNc1EwRkJRU3hMUVVGTExFTkJRVU1zUzBGQlVDeEhRVUZsTzAxQlJXWXNTVUZCUnl4RFFVRkpMRWxCUVVNc1EwRkJRU3hOUVVGTkxFTkJRVU1zUzBGQlVpeERRVUZCTEVOQlFWQTdVVUZEUlN4RlFVRkJMRWRCUVVzc1NVRkJReXhEUVVGQkxFdEJRVXNzUTBGQlF5eExRVUZRTEVOQlFVRXNRMEZCUVN4SlFVRnJRanRSUVVOMlFpeEZRVUZCTEVsQlFVMHNTVUZCUXl4RFFVRkJMRTFCUVUwc1EwRkJReXhQUVVGU0xFZEJRV3RDTzFGQlEzaENMRWxCUVVNc1EwRkJRU3hOUVVGTkxFTkJRVU1zU1VGQlVpeERRVUZoTEVsQlFXSXNSVUZCYlVJc1JVRkJia0lzUlVGSVJqdFBRVXhHT3p0RlFVUmhPenQzUWtGWlppeFhRVUZCTEVkQlFXRXNVMEZCUVR0SlFVTllMRWxCUVVjc1NVRkJReXhEUVVGQkxFMUJRVW83WVVGQlowSXNRMEZCUXl4RFFVRkRMRTFCUVVZc1EwRkJVeXhKUVVGRExFTkJRVUVzVDBGQlR5eERRVUZETEUxQlFXeENMRVZCUVRCQ0xFTkJRVUVzVTBGQlFTeExRVUZCTzJWQlFVRXNVMEZCUXl4SFFVRkVMRVZCUVUwc1IwRkJUanRCUVVONFF5eGpRVUZCTzFWQlFVRXNVVUZCUVN4SFFVRlhMRTlCUVVFc1EwRkJVU3hoUVVGU08xVkJRMWdzU1VGQlJ5eFJRVUZSTEVOQlFVTXNUVUZCVkN4RFFVRm5RaXhIUVVGb1FpeERRVUZJTzFsQlEwVXNVVUZCUVN4SFFVRlhMRk5CUVVFN1FVRkJZeXhyUWtGQlFUdGpRVUZpTzNGQ1FVRmhMRWRCUVVFc1lVRkJTU3hMUVVGS08xbEJRV1E3V1VGRFdDeExRVUZETEVOQlFVRXNUVUZCVFN4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGV0xFTkJRV0VzUjBGQllpeEZRVUZyUWl4UlFVRnNRanRaUVVOQkxFdEJRVU1zUTBGQlFTeE5RVUZOTEVOQlFVTXNSMEZCVWl4RFFVRlpMRWRCUVZvc1JVRkJhVUlzVVVGQmFrSTdiVUpCUTBFc1MwRktSanM3VVVGR2QwTTdUVUZCUVN4RFFVRkJMRU5CUVVFc1EwRkJRU3hKUVVGQkxFTkJRVEZDTEVWQlFXaENPenRGUVVSWE96dEZRVk5CTEhGQ1FVRkRMRWxCUVVRc1JVRkJUeXhSUVVGUUxFVkJRV2xDTEUxQlFXcENMRVZCUVhsQ0xGRkJRWHBDTzBsQlFVTXNTVUZCUXl4RFFVRkJMRTFCUVVRN1NVRkJUU3hKUVVGRExFTkJRVUVzVlVGQlJEdEpRVUZWTEVsQlFVTXNRMEZCUVN4UlFVRkVPMGxCUVZFc1NVRkJReXhEUVVGQkxEaENRVUZFTEZkQlFWazdTVUZEYUVRc1NVRkJSeXhKUVVGRExFTkJRVUVzUjBGQlJDeEpRVUZUTEVOQlFVa3NTVUZCUXl4RFFVRkJMRkZCUVdwQ08wMUJRMFVzU1VGQlF5eERRVUZCTEZGQlFVUXNSMEZCWjBJc1NVRkJRU3hQUVVGQkxFTkJRVkVzU1VGQlF5eERRVUZCTEVkQlFWUXNSVUZCWXl4SlFVRkRMRU5CUVVFc1QwRkJUeXhEUVVGRExFdEJRWFpDTzAxQlEyaENMRWxCUVVNc1EwRkJRU3hSUVVGUkxFTkJRVU1zUjBGQlZpeERRVUZqTEZOQlFXUXNSVUZCZVVJc1NVRkJReXhEUVVGQkxFZEJRVEZDTzAxQlEwRXNTVUZCUXl4RFFVRkJMRkZCUVZFc1EwRkJReXhIUVVGV0xFTkJRV01zU1VGQlF5eERRVUZCTEU5QlFVOHNRMEZCUXl4TlFVRjJRanROUVVOQkxFbEJRVWNzU1VGQlF5eERRVUZCTEU5QlFVOHNRMEZCUXl4SlFVRmFPMUZCUVhOQ0xFbEJRVU1zUTBGQlFTeFJRVUZSTEVOQlFVTXNTVUZCVml4RFFVRmxMRWxCUVVNc1EwRkJRU3hQUVVGUExFTkJRVU1zU1VGQmVFSXNSVUZCZEVJN1QwRktSanM3U1VGTlFTeEpRVUZITEVsQlFVTXNRMEZCUVN4TFFVRktPMDFCUTBVc1NVRkJReXhEUVVGQkxFbEJRVVFzUTBGQlFTeEZRVVJHT3p0RlFWQlhPenQzUWtGVllpeGhRVUZCTEVkQlFXVXNVMEZCUXl4TFFVRkVPMEZCUTJJc1VVRkJRVHRKUVVGQkxFOUJRVUVzUjBGQlZTeEZRVUZGTEVOQlFVTXNUVUZCU0N4RFFVRkJPMGxCUTFZc1NVRkJReXhEUVVGQkxFMUJRVTBzUTBGQlF5eEpRVUZTTEVkQlFXVXNRMEZCUVN4VFFVRkJMRXRCUVVFN1lVRkJRU3hUUVVGRExFOUJRVVFzUlVGQlZTeEpRVUZXTzBGQlEySXNXVUZCUVR0UlFVRkJMRTFCUVVFc1IwRkJVeXhQUVVGUkxFTkJRVUVzVDBGQlFUdFJRVU5xUWl4SlFVRkhMRU5CUVVrc1RVRkJVRHRWUVVORkxFMUJRVUVzUjBGQlV5eExRVUZETEVOQlFVRXNVVUZCUkN4RFFVRlZMRTlCUVZZc1JVRkJiVUlzUzBGQlF5eERRVUZCTEUxQlFYQkNMRVZCUVRSQ0xFdEJRVFZDTzFWQlExUXNUMEZCVVN4RFFVRkJMRTlCUVVFc1EwRkJVaXhIUVVGdFFpeFBRVVp5UWpzN1pVRkhRU3hOUVVGQkxFTkJRVThzU1VGQlVEdE5RVXhoTzBsQlFVRXNRMEZCUVN4RFFVRkJMRU5CUVVFc1NVRkJRVHRYUVUxbUxFbEJRVU1zUTBGQlFUdEZRVkpaT3p0M1FrRlZaaXhKUVVGQkxFZEJRVTBzVTBGQlFUdEJRVVZLTEZGQlFVRTdTVUZCUVN4SlFVRkRMRU5CUVVFc1RVRkJSQ3hIUVVGVk8wbEJSVllzZFVOQlFWa3NRMEZCUlN4dlFrRkJaRHROUVVFclFpeEpRVUZETEVOQlFVRXNUVUZCUkN4SFFVRlZMRWxCUVVNc1EwRkJRU3hUUVVFeFF6dExRVUZCTEUxQlFVRTdUVUZQUlN4SlFVRkRMRU5CUVVFc1RVRkJSQ3hIUVVGakxFbEJRVUVzU1VGQlFTeERRVUZMTEVsQlFVTXNRMEZCUVN4UlFVRk9MRVZCUVdkQ0xFbEJRVU1zUTBGQlFTeExRVUZxUWp0TlFVTmtMRXRCUVVFc1IwRkJVU3hEUVVGRExFbEJRVU1zUTBGQlFTeExRVUZMTEVOQlFVTXNTMEZCVUN4SFFVRmxMRU5CUVdoQ0xFTkJRVUVzU1VGQmMwSTdUVUZIT1VJc1NVRkJSeXhKUVVGRExFTkJRVUVzVVVGQlVTeERRVUZETEU5QlFWWXNTMEZCZFVJc1RVRkJka0lzU1VGQmEwTXNRMEZCU1N4SlFVRkRMRU5CUVVFc1VVRkJVU3hEUVVGRExFOUJRV2hFTEVsQlFUUkVMRU5CUVVrc1NVRkJReXhEUVVGQkxFMUJRVTBzUTBGQlF5eFBRVUV6UlR0UlFVTkZMRWxCUVVNc1EwRkJRU3hoUVVGRUxFTkJRV1VzUzBGQlpqdFJRVU5CTEVsQlFVTXNRMEZCUVN4TFFVRkxMRU5CUVVNc1RVRkJVQ3hEUVVGakxFbEJRVU1zUTBGQlFTeE5RVUZQTEVOQlFVRXNRMEZCUVN4RFFVRjBRanRSUVVWQkxFbEJRVU1zUTBGQlFTeFhRVUZFTEVOQlFVRXNSVUZLUmpzN1RVRk5RU3hKUVVGRExFTkJRVUVzVVVGQlVTeERRVUZETEU5QlFWWXNSMEZCYjBJN1RVRkRjRUlzU1VGQlF5eERRVUZCTEUxQlFVMHNRMEZCUXl4UFFVRlNMRWRCUVd0Q08wMUJSMnhDTEVsQlFVTXNRMEZCUVN4aFFVRkVMRU5CUVdVc1MwRkJaanROUVVkQkxFbEJRVU1zUTBGQlFTeE5RVUZOTEVOQlFVTXNWMEZCVWl4SFFVRnpRanROUVVkMFFpeFJRVUZCTEVkQlFWY3NRMEZCUXl4RFFVRkRMRWxCUVVZc1EwRkJUeXhKUVVGRExFTkJRVUVzVFVGQlRTeERRVUZETEZGQlFWSXNTVUZCYjBJc1JVRkJSU3hEUVVGRExFbEJRVGxDTzAxQlExZ3NTVUZCUXl4RFFVRkJMRTFCUVUwc1EwRkJReXhSUVVGU0xFZEJRVzFDTzAxQlEyNUNMRkZCUVVFc1EwRkJVeXhKUVVGRExFTkJRVUVzVFVGQlZpeEZRVGRDUmpzN1YwRXJRa0VzU1VGQlF5eERRVUZCTzBWQmJrTkhPenM3T3pzN1FVRnhRMUlzYjBKQlFVRXNSMEZCZFVJc1UwRkJReXhOUVVGRUxFVkJRVk1zUjBGQlZDeEZRVUZqTEU5QlFXUTdRVUZEY2tJc1RVRkJRVHRGUVVGQkxGVkJRVUVzUjBGQllTeFJRVUZSTEVOQlFVTXNZVUZCVkN4RFFVRjFRaXhIUVVGMlFqdEZRVU5pTEVsQlFVY3NUMEZCU0R0QlFVTkZPMEZCUVVFc1UwRkJRU3hWUVVGQk96dE5RVU5GTEZWQlFWVXNRMEZCUXl4WlFVRllMRU5CUVhkQ0xFZEJRWGhDTEVWQlFUWkNMRXRCUVRkQ08wRkJSRVk3UVVGRlFUdEJRVUZCTEZOQlFVRXNWMEZCUVRzN1RVRkRSU3hEUVVGQkxFTkJRVVVzVlVGQlJpeERRVUZoTEVOQlFVTXNSVUZCWkN4RFFVRnBRaXhIUVVGcVFpeEZRVUZ6UWl4TFFVRjBRanRCUVVSR08wRkJSVUU3UVVGQlFTeFRRVUZCTEZkQlFVRTdPMDFCUTBVc1EwRkJRU3hEUVVGRkxGVkJRVVlzUTBGQllTeERRVUZETEVkQlFXUXNRMEZCYTBJc1IwRkJiRUlzUlVGQmRVSXNTMEZCZGtJN1FVRkVSanRKUVVWQkxFdEJRVUVzUjBGQlVTeFBRVUZQTEVOQlFVTTdTVUZEYUVJc1NVRkJSeXhMUVVGQkxFdEJRVmNzVFVGQlpEdE5RVU5GTEVOQlFVRXNRMEZCUlN4VlFVRkdMRU5CUVdFc1EwRkJReXhKUVVGa0xFTkJRVzFDTEV0QlFXNUNMRVZCUkVZN1MwRlNSanM3TUVKQlZVRXNUVUZCVFN4RFFVRkZMRmRCUVZJc1EwRkJiMElzVlVGQmNFSTdRVUZhY1VJN08wRkJZM1pDTEd0Q1FVRkJMRWRCUVhGQ0xGTkJRVU1zUjBGQlJDeEZRVUZOTEU5QlFVNHNSVUZCWlN4TFFVRm1MRVZCUVhOQ0xHMUNRVUYwUWl4RlFVRXlReXhKUVVFelF6dEJRVU51UWl4TlFVRkJPMFZCUVVFc1UwRkJRU3hIUVVGblFpeEpRVUZCTEVsQlFVRXNRMEZCUVR0RlFVTm9RaXhKUVVGSExFTkJRVU1zVFVGQlRTeERRVUZETEdWQlFWZzdTVUZEUlN4TlFVRk5MRU5CUVVNc1pVRkJVQ3hIUVVGNVFpeHhRa0ZFTTBJN08wVkJSVUVzVTBGQlV5eERRVUZETEU5QlFWWXNSMEZCYjBJc1pVRkJRU3hEUVVGblFpeExRVUZMTEVOQlFVTXNUMEZCZEVJc1JVRkJLMElzUjBGQlFTeEpRVUZQTEV0QlFYUkRMRVZCUVRaRExFOUJRVGRETzFOQlEzQkNPMEZCVEcxQ096dEJRVTl5UWl4RlFVRkZMRU5CUVVNc1VVRkJTQ3hEUVVGWkxHRkJRVm9zUlVGQk1rSXNhMEpCUVROQ096dEJRVVZCTEVsQlFVRXNSMEZCVHl4VFFVRkRMRWRCUVVRc1JVRkJUU3hQUVVGT08wRkJRMHdzVFVGQlFUdEZRVUZCTEZOQlFVRXNSMEZCWjBJc1NVRkJRU3hKUVVGQkxFTkJRVUU3UlVGRGFFSXNVMEZCVXl4RFFVRkRMRTlCUVZZc1IwRkJiMElzWlVGQlFTeERRVUZuUWl4SlFVRm9RaXhGUVVGelFpeEhRVUZCTEVsQlFVOHNTMEZCTjBJc1JVRkJiME1zVDBGQmNFTTdVMEZEY0VJN1FVRklTenM3UVVGTFVDeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMRTFCUVZvc1JVRkJiMElzU1VGQmNFSTdPMEZCU1VFc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSWlMQ0ptYVd4bElqb2laMlZ1WlhKaGRHVmtMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWs5S0lEMGdjbVZ4ZFdseVpTQW5MaTR2YjJvblhISmNibDhnUFNCeVpYRjFhWEpsSUNkc2IyUmhjMmduWEhKY2JsUm9hVzVFVDAwZ1BTQnlaWEYxYVhKbElDZDBhR2x1Wkc5dEoxeHlYRzVPYjJSbElEMGdjbVZ4ZFdseVpTQW5MaTl1YjJSbEoxeHlYRzVjY2x4dUkyTnNiM05sWkNBOUlDZGhJR0ZpWW5JZ1lXTnliMjU1YlNCaFpHUnlaWE56SUdGd2NHeGxkQ0JoY25ScFkyeGxJR0Z6YVdSbElHRjFaR2x2SUdJZ1ltUnZJR0pwWnlCaWJHOWphM0YxYjNSbElHSnZaSGtnWW5WMGRHOXVJR05oYm5aaGN5QmpZWEIwYVc5dUlHTmxiblJsY2lCamFYUmxJR052WkdVZ1kyOXNaM0p2ZFhBZ1kyOXRiV0Z1WkNCa1lYUmhiR2x6ZENCa1pDQmtaV3dnWkdWMFlXbHNjeUJrWm00Z1pHbHlJR1JwZGlCa2JDQmtkQ0JsYlNCbGJXSmxaQ0JtYVdWc1pITmxkQ0JtYVdkallYQjBhVzl1SUdacFozVnlaU0JtYjI1MElHWnZiM1JsY2lCbWIzSnRJR1p5WVcxbGMyVjBJR2d4SUdneUlHZ3pJR2cwSUdnMUlHZzJJR2hsWVdRZ2FHVmhaR1Z5SUdobmNtOTFjQ0JvZEcxc0lHa2dhV1p5WVcxbElHbHVjeUJyWlhsblpXNGdhMkprSUd4aFltVnNJR3hsWjJWdVpDQnNhU0J0WVhBZ2JXRnlheUJ0Wlc1MUlHMWxkR1Z5SUc1aGRpQnViMlp5WVcxbGN5QnViM05qY21sd2RDQnZZbXBsWTNRZ2Iyd2diM0IwWjNKdmRYQWdiM0IwYVc5dUlHOTFkSEIxZENCd0lIQnlaU0J3Y205bmNtVnpjeUJ4SUhKd0lISjBJSEoxWW5rZ2N5QnpZVzF3SUhOamNtbHdkQ0J6WldOMGFXOXVJSE5sYkdWamRDQnpiV0ZzYkNCemIzVnlZMlVnYzNCaGJpQnpkSEpwYTJVZ2MzUnliMjVuSUhOMGVXeGxJSE4xWWlCemRXMXRZWEo1SUhOMWNDQjBZV0pzWlNCMFltOWtlU0IwWkNCMFpYaDBZWEpsWVNCMFptOXZkQ0IwYUNCMGFHVmhaQ0IwYVcxbElIUnBkR3hsSUhSeUlIUjBJSFVnZFd3Z2RtRnlJSFpwWkdWdklIZGljaUI0YlhBbkxuTndiR2wwSUNjZ0oxeHlYRzRqYjNCbGJpQTlJQ2RoY21WaElHSmhjMlVnWW5JZ1kyOXNJR052YlcxaGJtUWdZM056SUNGRVQwTlVXVkJGSUdWdFltVmtJR2h5SUdsdFp5QnBibkIxZENCclpYbG5aVzRnYkdsdWF5QnRaWFJoSUhCaGNtRnRJSE52ZFhKalpTQjBjbUZqYXlCM1luSW5Mbk53YkdsMElDY2dKMXh5WEc0alhISmNiaU51WlhOMFlXSnNaVTV2WkdWT1lXMWxjeUE5SUZ0Y2NseHVJeUFnSjJScGRpZGNjbHh1SXlBZ0ozTndZVzRuWEhKY2JpTWdJQ2RvTVNkY2NseHVJeUFnSjJneUoxeHlYRzRqSUNBbmFETW5YSEpjYmlNZ0lDZG9OQ2RjY2x4dUl5QWdKMmcxSjF4eVhHNGpJQ0FuYURZblhISmNiaU1nSUNkd0oxeHlYRzRqSUNBblptbGxiR1J6WlhRblhISmNiaU1nSUNkelpXeGxZM1FuWEhKY2JpTWdJQ2R2YkNkY2NseHVJeUFnSjNWc0oxeHlYRzRqSUNBbmRHRmliR1VuWEhKY2JpTmRYSEpjYmlOY2NseHVJeU5VYUdseklHeHBjM1FnYVhNZ2JtOTBJSGxsZENCbGVHaGhkWE4wYVhabExDQnFkWE4wSUdWNFkyeDFaR1VnZEdobElHOWlkbWx2ZFhOY2NseHVJMjV2Yms1bGMzUmhZbXhsVG05a1pYTWdQU0JiWEhKY2JpTWdJQ2RzYVNkY2NseHVJeUFnSjJ4bFoyVnVaQ2RjY2x4dUl5QWdKM1J5SjF4eVhHNGpJQ0FuZEdRblhISmNiaU1nSUNkdmNIUnBiMjRuWEhKY2JpTWdJQ2RpYjJSNUoxeHlYRzRqSUNBbmFHVmhaQ2RjY2x4dUl5QWdKM052ZFhKalpTZGNjbHh1SXlBZ0ozUmliMlI1SjF4eVhHNGpJQ0FuZEdadmIzUW5YSEpjYmlNZ0lDZDBhR1ZoWkNkY2NseHVJeUFnSjJ4cGJtc25YSEpjYmlNZ0lDZHpZM0pwY0hRblhISmNiaU5kWEhKY2JpTmNjbHh1STI1dlpHVk9ZVzFsY3lBOUlGdGNjbHh1SXlBZ0oyRW5YSEpjYmlNZ0lDZGlKMXh5WEc0aklDQW5ZbkluWEhKY2JpTWdJQ2RpZFhSMGIyNG5YSEpjYmlNZ0lDZGthWFluWEhKY2JpTWdJQ2RsYlNkY2NseHVJeUFnSjJacFpXeGtjMlYwSjF4eVhHNGpJQ0FuWm05eWJTZGNjbHh1SXlBZ0oyZ3hKMXh5WEc0aklDQW5hREluWEhKY2JpTWdJQ2RvTXlkY2NseHVJeUFnSjJnMEoxeHlYRzRqSUNBbmFEVW5YSEpjYmlNZ0lDZG9OaWRjY2x4dUl5QWdKMmtuWEhKY2JpTWdJQ2RwYldjblhISmNiaU1nSUNkcGJuQjFkQ2RjY2x4dUl5QWdKMnhoWW1Wc0oxeHlYRzRqSUNBbmJHVm5aVzVrSjF4eVhHNGpJQ0FuYkdrblhISmNiaU1nSUNkdVlYWW5YSEpjYmlNZ0lDZHZiQ2RjY2x4dUl5QWdKMjl3ZEdsdmJpZGNjbHh1SXlBZ0ozQW5YSEpjYmlNZ0lDZHpaV3hsWTNRblhISmNiaU1nSUNkemNHRnVKMXh5WEc0aklDQW5jM1J5YjI1bkoxeHlYRzRqSUNBbmMzVndKMXh5WEc0aklDQW5jM1puSjF4eVhHNGpJQ0FuZEdGaWJHVW5YSEpjYmlNZ0lDZDBZbTlrZVNkY2NseHVJeUFnSjNSa0oxeHlYRzRqSUNBbmRHVjRkR0Z5WldFblhISmNiaU1nSUNkMGFDZGNjbHh1SXlBZ0ozUm9aV0ZrSjF4eVhHNGpJQ0FuZEhJblhISmNiaU1nSUNkMWJDZGNjbHh1STExY2NseHVYSEpjYm1Oc1lYTnpJRTV2WkdWR1lXTjBiM0o1WEhKY2JpQWdYSEpjYmlBZ2IycE9iMlJsT2lCdWRXeHNYSEpjYmlBZ1hISmNiaUFnUUdkbGREb2dLR2xrTENCMFlXZE9ZVzFsSUQwZ0oyUnBkaWNwSUMwK1hISmNiaUFnSUNCeVpYUWdQU0J1ZFd4c1hISmNiaUFnSUNCbGJDQTlJR1J2WTNWdFpXNTBMbWRsZEVWc1pXMWxiblJDZVVsa0lHbGtYSEpjYmlBZ0lDQnBaaUJsYkZ4eVhHNGdJQ0FnSUNCMGFHbHVSV3dnUFNCUFNpNXlaWE4wYjNKbFJXeGxiV1Z1ZENCbGJDd2dkR0ZuVG1GdFpWeHlYRzRnSUNBZ2FXWWdkR2hwYmtWc1hISmNiaUFnSUNBZ0lISmxkQ0E5SUc1bGR5Qk9iMlJsUm1GamRHOXllU0J1ZFd4c0xDQnVkV3hzTENCdWRXeHNMQ0JtWVd4elpTd2dkR2hwYmtWc1hISmNibHh5WEc0Z0lDQWdjbVYwWEhKY2JpQWdYSEpjYmlBZ1gyMWhhMlZCWkdRNklDaDBZV2RPWVcxbExDQmpiM1Z1ZENrZ0xUNWNjbHh1SUNBZ0lDaHZjSFJ6S1NBOVBseHlYRzRnSUNBZ0lDQnRaWFJvYjJRZ1BTQlBTaTV1YjJSbGMxdDBZV2RPWVcxbFhTQnZjaUJQU2k1amIyMXdiMjVsYm5SelczUmhaMDVoYldWZElHOXlJRTlLTG1OdmJuUnliMnh6VzNSaFowNWhiV1ZkSUc5eUlFOUtMbWx1Y0hWMGMxdDBZV2RPWVcxbFhWeHlYRzRnSUNBZ0lDQnBaaUJ0WlhSb2IyUmNjbHh1SUNBZ0lDQWdJQ0J1ZFNBOUlHMWxkR2h2WkNCdmNIUnpMQ0JBYjJwT2IyUmxYSEpjYmlBZ0lDQWdJR1ZzYzJWY2NseHVJQ0FnSUNBZ0lDQnVkU0E5SUU5S0xtTnZiWEJ2Ym1WdWRDQnVkV3hzTENCQWIycE9iMlJsTENCMFlXZE9ZVzFsWEhKY2JpQWdJQ0FnSUNOeVpYUWdQU0J1WlhjZ1RtOWtaVVpoWTNSdmNua2diblVzSUVCMGFHbHVUbTlrWlN3Z1kyOTFiblJjY2x4dUlDQWdJQ0FnYm5WY2NseHVJQ0JjY2x4dUlDQmZiV0ZyWlZWdWFYRjFaVWxrT2lBb1kyOTFiblFwSUMwK1hISmNiaUFnSUNCcFppQlBTaTVIUlU1RlVrRlVSVjlWVGtsUlZVVmZTVVJUWEhKY2JpQWdJQ0FnSUdOdmRXNTBJQ3M5SURGY2NseHVJQ0FnSUNBZ2FXWWdZMjkxYm5RZ1BEMGdRRzkzYm1WeUxtTnZkVzUwSUhSb1pXNGdZMjkxYm5RZ1BTQkFiM2R1WlhJdVkyOTFiblFnS3lBeFhISmNiaUFnSUNBZ0lFQnZkMjVsY2k1amIzVnVkQ0E5SUdOdmRXNTBYSEpjYmx4eVhHNGdJQ0FnSUNCcFppQnViM1FnUUc5cVRtOWtaUzVuWlhSSlpDZ3BYSEpjYmlBZ0lDQWdJQ0FnYVdRZ1BTQkFiM2R1WlhJdVoyVjBTV1FvS1NCdmNpQW5KMXh5WEc0Z0lDQWdJQ0FnSUdsa0lDczlJRUJ2YWs1dlpHVXVkR0ZuVG1GdFpTQXJJR052ZFc1MFhISmNiaUFnSUNBZ0lDQWdRRzlxVG05a1pTNWhkSFJ5SUNkcFpDY3NJR2xrWEhKY2JpQWdJQ0J5WlhSMWNtNWNjbHh1SUNCY2NseHVJQ0JmWW1sdVpFVjJaVzUwY3pvZ0xUNWNjbHh1SUNBZ0lHbG1JRUJ2YWs1dlpHVWdkR2hsYmlCZkxtWnZjazkzYmlCQWIzQjBhVzl1Y3k1bGRtVnVkSE1zSUNoMllXd3NJR3RsZVNrZ1BUNWNjbHh1SUNBZ0lDQWdhWE5OWlhSb2IyUWdQU0J5WlhGMWFYSmxJQ2N1TGk5MGIyOXNjeTlwY3lkY2NseHVJQ0FnSUNBZ2FXWWdhWE5OWlhSb2IyUXViV1YwYUc5a0lIWmhiRnh5WEc0Z0lDQWdJQ0FnSUdOaGJHeGlZV05ySUQwZ0tHVjJaVzUwTGk0dUtTQXRQaUIyWVd3Z1pYWmxiblF1TGk1Y2NseHVJQ0FnSUNBZ0lDQkFiMnBPYjJSbExpUXViMjRnYTJWNUxDQmpZV3hzWW1GamExeHlYRzRnSUNBZ0lDQWdJRUJ2YWs1dlpHVXVZV1JrSUd0bGVTd2dZMkZzYkdKaFkydGNjbHh1SUNBZ0lDQWdJQ0J1ZFd4c1hISmNiaUFnWEhKY2JpQWdZMjl1YzNSeWRXTjBiM0k2SUNoQWRHRm5MQ0JBYjNCMGFXOXVjeXdnUUc5M2JtVnlMQ0JBZEdocGJrNXZaR1VnUFNCdWRXeHNLU0F0UGx4eVhHNGdJQ0FnYVdZZ1FIUmhaeUJoYm1RZ2JtOTBJRUIwYUdsdVRtOWtaVnh5WEc0Z0lDQWdJQ0JBZEdocGJrNXZaR1VnUFNCdVpYY2dWR2hwYmtSUFRTQkFkR0ZuTENCQWIzQjBhVzl1Y3k1d2NtOXdjMXh5WEc0Z0lDQWdJQ0JBZEdocGJrNXZaR1V1WVdSa0lDZDBZV2RPWVcxbEp5d2dRSFJoWjF4eVhHNGdJQ0FnSUNCQWRHaHBiazV2WkdVdVkzTnpJRUJ2Y0hScGIyNXpMbk4wZVd4bGMxeHlYRzRnSUNBZ0lDQnBaaUJBYjNCMGFXOXVjeTUwWlhoMElIUm9aVzRnUUhSb2FXNU9iMlJsTG5SbGVIUWdRRzl3ZEdsdmJuTXVkR1Y0ZEZ4eVhHNGdJQ0FnWEhKY2JpQWdJQ0JwWmlCQWIzZHVaWEpjY2x4dUlDQWdJQ0FnUUcxaGEyVW9LVnh5WEc0Z0lGeHlYRzRnSUdGa1pFMWhhMlZOWlhSb2IyUTZJQ2hqYjNWdWRDa2dMVDVjY2x4dUlDQWdJRzFsZEdodlpITWdQU0JQU2k1dlltcGxZM1FvS1Z4eVhHNGdJQ0FnUUc5cVRtOWtaUzV0WVd0bElEMGdLSFJoWjA1aGJXVXNJRzl3ZEhNcElEMCtYSEpjYmlBZ0lDQWdJRzFsZEdodlpDQTlJRzFsZEdodlpITmJkR0ZuVG1GdFpWMWNjbHh1SUNBZ0lDQWdhV1lnYm05MElHMWxkR2h2WkZ4eVhHNGdJQ0FnSUNBZ0lHMWxkR2h2WkNBOUlFQmZiV0ZyWlVGa1pDQjBZV2RPWVcxbExDQkFiMnBPYjJSbExDQmpiM1Z1ZEZ4eVhHNGdJQ0FnSUNBZ0lHMWxkR2h2WkhOYmRHRm5UbUZ0WlYwZ1BTQnRaWFJvYjJSY2NseHVJQ0FnSUNBZ2JXVjBhRzlrSUc5d2RITmNjbHh1SUNBZ0lFQnZhazV2WkdWY2NseHVYSEpjYmlBZ2JXRnJaVG9nTFQ1Y2NseHVYSEpjYmlBZ0lDQkFiMnBPYjJSbElEMGdiblZzYkZ4eVhHNWNjbHh1SUNBZ0lHbG1JRUIwYUdsdVRtOWtaVDh1YVhOR2RXeHNlVWx1YVhRZ2RHaGxiaUJBYjJwT2IyUmxJRDBnUUhSb2FXNU9iMlJsWEhKY2JpQWdYSEpjYmlBZ0lDQWpJREk2SUVsbUlIUm9aU0JsYkdWdFpXNTBJR2hoY3lCdVpYWmxjaUJpWldWdUlHbHVhWFJwWVd4cGVtVmtMQ0JqYjI1MGFXNTFaVnh5WEc0Z0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNBaklETTZJRUZ6SUd4dmJtY2dZWE1nZEdobElHVnNaVzFsYm5RZ2FYTnVKM1FnZEdobElHSnZaSGtnYm05a1pTd2dZMjl1ZEdsdWRXVmNjbHh1SUNBZ0lDQWdJeUJwWmlCbGJDNTBZV2RPWVcxbElHbHpiblFnSjJKdlpIa25YSEpjYmlBZ0lDQWdJQ01nTkRvZ1JYaDBaVzVrSUhSb1pTQmxiR1Z0Wlc1MElIZHBkR2dnYzNSaGJtUmhjbVFnYWxGMVpYSjVJRUZRU1NCdFpYUm9iMlJ6WEhKY2JpQWdJQ0FnSUVCdmFrNXZaR1VnUFNCdVpYY2dUbTlrWlNCQWRHaHBiazV2WkdVc0lFQnZkMjVsY2x4eVhHNGdJQ0FnSUNCamIzVnVkQ0E5SUNoQWIzZHVaWEl1WTI5MWJuUWdLeUF4S1NCOGZDQXhYSEpjYmlBZ0lDQWdJQ01nTlRvZ1NXWWdkR2hsSUc1dlpHVWdhWE51SjNRZ2FXNGdkR2hsSUVSUFRTd2dZWEJ3Wlc1a0lHbDBJSFJ2SUhSb1pTQndZWEpsYm5SY2NseHVJQ0FnSUNBZ0l5QlVhR2x6SUdGc2MyOGdZV05qYjIxdGIyUmhkR1Z6SUdSdlkzVnRaVzUwSUdaeVlXZHRaVzUwY3l3Z2QyaHBZMmdnWVhKbElHNXZkQ0JwYmlCMGFHVWdSRTlOSUdKMWRDQmhjbVVnY0hKbGMzVnRaV1FnZEc4Z1ltVWdjMjkxYm1RZ2RXNTBhV3dnY21WaFpIa2dabTl5SUcxaGJuVmhiQ0JwYm5ObGNuUnBiMjVjY2x4dUlDQWdJQ0FnYVdZZ1FIUm9hVzVPYjJSbExuUmhaMDVoYldVZ2FYTnVkQ0FuWW05a2VTY2dZVzVrSUc1dmRDQkFkR2hwYms1dlpHVXVhWE5KYmtSUFRTQmhibVFnYm05MElFQnZhazV2WkdVdWFYTkpia1JQVFZ4eVhHNGdJQ0FnSUNBZ0lFQmZiV0ZyWlZWdWFYRjFaVWxrSUdOdmRXNTBYSEpjYmlBZ0lDQWdJQ0FnUUc5M2JtVnlMbUZ3Y0dWdVpDQkFiMnBPYjJSbFd6QmRYSEpjYmlBZ0lDQWdJQ0FnSXlBMk9pQkNhVzVrSUdGdWVTQmtaV1pwYm1Wa0lHVjJaVzUwY3lCaFpuUmxjaUIwYUdVZ2JtOWtaU0JwY3lCcGJpQjBhR1VnUkU5TlhISmNiaUFnSUNBZ0lDQWdRRjlpYVc1a1JYWmxiblJ6S0NsY2NseHVJQ0FnSUNBZ0lDQmNjbHh1SUNBZ0lDQWdRSFJvYVc1T2IyUmxMbWx6U1c1RVQwMGdQU0IwY25WbFhISmNiaUFnSUNBZ0lFQnZhazV2WkdVdWFYTkpia1JQVFNBOUlIUnlkV1ZjY2x4dVhISmNiaUFnSUNBZ0lDTWdOem9nUTNKbFlYUmxJSFJvWlNCaGJHd2dhVzF3YjNKMFlXNTBJQ2R0WVd0bEp5QnRaWFJvYjJSY2NseHVJQ0FnSUNBZ1FHRmtaRTFoYTJWTlpYUm9iMlFnWTI5MWJuUmNjbHh1WEhKY2JpQWdJQ0FnSUNNZ09Eb2dVSEpsZG1WdWRDQmtkWEJzYVdOaGRHVWdabUZqZEc5eWVTQmxlSFJsYm5OcGIyNGdZbmtnYzJWMGRHbHVaeUJwY3lCcGJtbDBJRDBnZEhKMVpWeHlYRzRnSUNBZ0lDQkFiMnBPYjJSbExtbHpSblZzYkhsSmJtbDBJRDBnZEhKMVpWeHlYRzVjY2x4dUlDQWdJQ0FnSXlBNU9pQnBaaUIwYUdVZ2JtOWtaU0J6ZFhCd2IzSjBjeUJwZEN3Z1kyRnNiQ0JtYVc1aGJHbDZaVnh5WEc0Z0lDQWdJQ0JtYVc1aGJHbDZaU0E5SUY4dWIyNWpaU0JBYjJwT2IyUmxMbVpwYm1Gc2FYcGxJRzl5SUU5S0xtNXZiM0JjY2x4dUlDQWdJQ0FnUUc5cVRtOWtaUzVtYVc1aGJHbDZaU0E5SUdacGJtRnNhWHBsWEhKY2JpQWdJQ0FnSUdacGJtRnNhWHBsSUVCdmFrNXZaR1ZjY2x4dUlDQWdJQ01nTVRBNklGSmxkSFZ5YmlCMGFHVWdaWGgwWlc1a1pXUWdaV3hsYldWdWRGeHlYRzRnSUNBZ1FHOXFUbTlrWlZ4eVhHNWNjbHh1WkdWbVlYVnNkRU55WldGMFpVVnNaVzFsYm5RZ1BTQW9jR0Z5Wlc1MExDQjBZV2NzSUc5d2RHbHZibk1wSUMwK1hISmNiaUFnYm1WM1JXeGxiV1Z1ZENBOUlHUnZZM1Z0Wlc1MExtTnlaV0YwWlVWc1pXMWxiblFnZEdGblhISmNiaUFnYVdZZ2IzQjBhVzl1YzF4eVhHNGdJQ0FnWm05eUlHdGxlU3dnZG1Gc2RXVWdiMllnYjNCMGFXOXVjeTV3Y205d2MxeHlYRzRnSUNBZ0lDQnVaWGRGYkdWdFpXNTBMbk5sZEVGMGRISnBZblYwWlNoclpYa3NJSFpoYkhWbEtWeHlYRzRnSUNBZ1ptOXlJR3RsZVN3Z2RtRnNkV1VnYjJZZ2IzQjBhVzl1Y3k1bGRtVnVkSE5jY2x4dUlDQWdJQ0FnSkNodVpYZEZiR1Z0Wlc1MEtTNXZiaWhyWlhrc0lIWmhiSFZsS1Z4eVhHNGdJQ0FnWm05eUlHdGxlU3dnZG1Gc2RXVWdiMllnYjNCMGFXOXVjeTV6ZEhsc1pYTmNjbHh1SUNBZ0lDQWdKQ2h1WlhkRmJHVnRaVzUwS1M1amMzTW9hMlY1TENCMllXeDFaU2xjY2x4dUlDQWdJSFpoYkhWbElEMGdiM0IwYVc5dWN5NTBaWGgwWEhKY2JpQWdJQ0JwWmlCMllXeDFaU0JwYzI1MElIVnVaR1ZtYVc1bFpGeHlYRzRnSUNBZ0lDQWtLRzVsZDBWc1pXMWxiblFwTG5SbGVIUW9kbUZzZFdVcFhISmNiaUFnY0dGeVpXNTBQeTVoY0hCbGJtUkRhR2xzWkNodVpYZEZiR1Z0Wlc1MEtWeHlYRzVjY2x4dVoyVjBUbTlrWlVaeWIyMUdZV04wYjNKNUlEMGdLSFJoWnl3Z2IzQjBhVzl1Y3l3Z2IzZHVaWElzSUdselEyRnNiR1ZrUm5KdmJVWmhZM1J2Y25rc0lHNXZaR1VwSUMwK1hISmNiaUFnYm1WM1QwcE9iMlJsSUQwZ2JtVjNJRTV2WkdVb0tWeHlYRzRnSUdsbUlDRjNhVzVrYjNjdWIycERjbVZoZEdWRmJHVnRaVzUwWEhKY2JpQWdJQ0IzYVc1a2IzY3ViMnBEY21WaGRHVkZiR1Z0Wlc1MElEMGdaR1ZtWVhWc2RFTnlaV0YwWlVWc1pXMWxiblJjY2x4dUlDQnVaWGRQU2s1dlpHVXVaV3hsYldWdWRDQTlJRzlxUTNKbFlYUmxSV3hsYldWdWRDaHZkMjVsY2k1bGJHVnRaVzUwTENCMFlXY2dmSHdnSjJScGRpY3NJRzl3ZEdsdmJuTXBYSEpjYmlBZ2JtVjNUMHBPYjJSbFhISmNibHh5WEc1UFNpNXlaV2RwYzNSbGNpQW5ibTlrWlVaaFkzUnZjbmtuTENCblpYUk9iMlJsUm5KdmJVWmhZM1J2Y25sY2NseHVYSEpjYm0xaGEyVWdQU0FvZEdGbkxDQnZjSFJwYjI1ektTQXRQbHh5WEc0Z0lHNWxkMDlLVG05a1pTQTlJRzVsZHlCT2IyUmxLQ2xjY2x4dUlDQnVaWGRQU2s1dlpHVXVaV3hsYldWdWRDQTlJRzlxUTNKbFlYUmxSV3hsYldWdWRDaHVkV3hzTENCMFlXY2dmSHdnSjJScGRpY3NJRzl3ZEdsdmJuTXBYSEpjYmlBZ2JtVjNUMHBPYjJSbFhISmNibHh5WEc1UFNpNXlaV2RwYzNSbGNpQW5iV0ZyWlNjc0lHMWhhMlZjY2x4dVhISmNibHh5WEc1Y2NseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQm5aWFJPYjJSbFJuSnZiVVpoWTNSdmNubGNjbHh1SWwxOSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIGFcclxubm9kZU5hbWUgPSAnYSdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgaWQ6ICcnXHJcbiAgICAgIGNsYXNzOiAnJ1xyXG4gICAgICB0ZXh0OiAnJ1xyXG4gICAgICBocmVmOiAnamF2YVNjcmlwdDp2b2lkKDApOydcclxuICAgICAgdHlwZTogJydcclxuICAgICAgdGl0bGU6ICcnXHJcbiAgICAgIHJlbDogJydcclxuICAgICAgbWVkaWE6ICcnXHJcbiAgICAgIHRhcmdldDogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICB0b2dnbGVTdGF0ZSA9ICdvZmYnXHJcblxyXG4gIHRvZ2dsZSA9IC0+XHJcbiAgICBpZiB0b2dnbGVTdGF0ZSBpcyAnb24nXHJcbiAgICAgIHRvZ2dsZVN0YXRlID0gJ29mZidcclxuICAgIGVsc2UgdG9nZ2xlU3RhdGUgPSAnb24nICBpZiB0b2dnbGVTdGF0ZSBpcyAnb2ZmJ1xyXG4gICAgcmV0dXJuXHJcblxyXG4gICMgQ2xpY2sgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jbGljayBpc250IE9KLm5vb3BcclxuICAgIGNsaWNrID0gZGVmYXVsdHMuZXZlbnRzLmNsaWNrXHJcbiAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cclxuICAgICAgdG9nZ2xlKClcclxuICAgICAgcmV0VmFsID0gY2xpY2sgZXZlbnQuLi5cclxuICAgICAgaWYgZGVmYXVsdHMuaHJlZiBpcyAnIycgdGhlbiByZXRWYWwgPSBmYWxzZVxyXG4gICAgICByZXRWYWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXHJcbiAgZWxzZVxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gdG9nZ2xlXHJcblxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcblxyXG5cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbnRvID0gcmVxdWlyZSAnLi4vdG9vbHMvdG8nXHJcbiMgIyBiclxyXG5cclxubm9kZU5hbWUgPSAnYnInXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBudW1iZXI6IDFcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgaSA9IDBcclxuICB3aGlsZSBpIDwgdG8ubnVtYmVyIGRlZmF1bHRzLm51bWJlclxyXG4gICAgIyBJbiB0aGUgY2FzZSBvZiBtdWx0aXBsZSBicnMsIGl0IGlzIGRlc2lyYWJsZSB0byBvbmx5IGdldCB0aGUgbGFzdCBvbmUgb3V0XHJcbiAgICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuICAgIGkgKz0gMVxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG5cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgZm9ybVxyXG5cclxubm9kZU5hbWUgPSAnZm9ybSdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgYWN0aW9uOiAnJ1xyXG4gICAgICBtZXRob2Q6ICcnXHJcbiAgICAgIG5hbWU6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gIHJldC5hZGQgJ3ZhbGlkYXRvcicsIHJldC4kLnZhbGlkYXRlKFxyXG4gICAgaGlnaGxpZ2h0OiAoZWxlbWVudCkgLT5cclxuICAgICAgJGVsbSA9ICQoZWxlbWVudClcclxuICAgICAgJGVsbS5hdHRyICdPSl9pbnZhbGlkJywgJzEnXHJcbiAgICAgICRlbG0uYW5pbWF0ZSBiYWNrZ3JvdW5kQ29sb3I6ICdyZWQnXHJcbiAgICAgIG51bGxcclxuXHJcbiAgICB1bmhpZ2hsaWdodDogKGVsZW1lbnQpIC0+XHJcbiAgICAgICRlbG0gPSAkKGVsZW1lbnQpXHJcbiAgICAgIGlmICRlbG0uYXR0cignT0pfaW52YWxpZCcpIGlzICcxJ1xyXG4gICAgICAgICRlbG0uY3NzICdiYWNrZ3JvdW5kLWNvbG9yJywgJ3llbGxvdydcclxuICAgICAgICAkZWxtLmF0dHIgJ09KX2ludmFsaWQnLCAnMCdcclxuICAgICAgICBzZXRUaW1lb3V0ICgtPlxyXG4gICAgICAgICAgJGVsbS5hbmltYXRlIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50J1xyXG4gICAgICAgICksIDUwMFxyXG4gICAgICBudWxsXHJcbiAgKVxyXG5cclxuICByZXQuYWRkICdpc0Zvcm1WYWxpZCcsIC0+XHJcbiAgICByZXQuJC52YWxpZCgpIGFuZCAobm90IHJldC52YWxpZGF0b3IuaW52YWxpZEVsZW1lbnRzKCkgb3IgcmV0LnZhbGlkYXRvci5pbnZhbGlkRWxlbWVudHMoKS5sZW5ndGggaXMgMClcclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcclxuXHJcblxyXG5cclxuXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5lbnVtcyA9IHJlcXVpcmUgJy4uL3Rvb2xzL2VudW1zJ1xyXG5cclxuIyAjIGlucHV0XHJcblxyXG5ub2RlTmFtZSA9ICdpbnB1dCdcclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiAndGV4dCdcclxuICAgICAgdmFsdWU6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICAgIGNoYW5nZTogT0oubm9vcFxyXG4gICAgICBmb2N1c291dDogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgaWYgbm90IGRlZmF1bHRzLnByb3BzLnR5cGUgb3Igbm90IGVudW1zLmlucHV0VHlwZXNbZGVmYXVsdHMucHJvcHMudHlwZV1cclxuICAgIHRocm93IG5ldyBFcnJvciAnTm8gbWF0Y2hpbmcgaW5wdXQgdHlwZSBmb3IgeycgKyBkZWZhdWx0cy5wcm9wcy50eXBlICsgJ30gY291bGQgYmUgZm91bmQuJ1xyXG4gIHRoaXNUeXBlID0gZW51bXMuaW5wdXRUeXBlc1tkZWZhdWx0cy5wcm9wcy50eXBlXVxyXG5cclxuICBzeW5jVmFsdWUgPSAtPlxyXG4gICAgc3dpdGNoIHRoaXNUeXBlXHJcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5jaGVja2JveFxyXG4gICAgICAgIHJldC52YWx1ZSA9IHJldC4kLmlzICc6Y2hlY2tlZCdcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLnJhZGlvXHJcbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LiQuZmluZCgnOmNoZWNrZWQnKS52YWwoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LnZhbCgpXHJcbiAgICBkZWZhdWx0cy5wcm9wcy52YWx1ZSA9IHJldC52YWx1ZSAgICBcclxuICAgIHJldC52YWx1ZVxyXG5cclxuICAjIyNcclxuICAgIENsaWNrIGJpbmRpbmcuIElmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGNsaWNrIGhhbmRsZXIsXHJcbiAgICB3cmFwIGl0LCBzeW5jIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQgZmlyc3QsXHJcbiAgICB0aGVuIGNhbGwgdGhlIGRlZmluZWQgY2xpY2sgaGFuZGxlciB3aXRoIHRoZSBsYXRlc3QgdmFsdWUuXHJcbiAgIyMjXHJcbiAgb2xkQ2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICBpZiBvbGRDbGljayBhbmQgb2xkQ2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cclxuICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgb2xkQ2xpY2sgcmV0LnZhbHVlLCBldmVudC4uLlxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuXHJcbiAgIyMjXHJcbiAgICBDaGFuZ2UgYmluZGluZy4gSWYgdGhlIGNhbGxlciBkZWZpbmVkIGEgY2hhbmdlIGhhbmRsZXIsXHJcbiAgICB3cmFwIGl0LCBzeW5jIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQgZmlyc3QsXHJcbiAgICB0aGVuIGNhbGwgdGhlIGRlZmluZWQgY2hhbmdlIGhhbmRsZXIgd2l0aCB0aGUgbGF0ZXN0IHZhbHVlLlxyXG4gICMjI1xyXG4gIG9sZENoYW5nZSA9IGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2VcclxuICBpZiBvbGRDaGFuZ2UgYW5kIG9sZENoYW5nZSBpc250IE9KLm5vb3BcclxuICAgIG5ld0NoYW5nZSA9IChldmVudC4uLikgLT5cclxuICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgb2xkQ2hhbmdlIHJldC52YWx1ZSwgZXZlbnQuLi5cclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuXHJcbiAgIyMjXHJcbiAgICBPbiBGb2N1cyBPdXQgYmluZGluZy4gQWx3YXlzIHVzZSB0aGUgZXZlbnQgdG8gdXBkYXRlIHRoZSBpbnRlcm5hbFxyXG4gICAgdmFsdWUgb2YgdGhlIGNvbnRyb2w7IGFuZCBpZiB0aGUgY2FsbGVyIGRlZmluZWQgYSBmb2N1c291dCBldmVudCxcclxuICAgIHdyYXAgaXQgYW5kIGludm9rZSBpdCB3aXRoIHRoZSBsYXRlc3QgdmFsdWVcclxuICAjIyNcclxuICBvbGRGb2N1c291dCA9IGRlZmF1bHRzLmV2ZW50cy5mb2N1c291dFxyXG4gIG5ld0ZvY3Vzb3V0ID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgc3luY1ZhbHVlKClcclxuICAgIGlmIG9sZEZvY3Vzb3V0IGFuZCBvbGRGb2N1c291dCBpc250IE9KLm5vb3BcclxuICAgICAgb2xkRm9jdXNvdXQgcmV0LnZhbHVlLCBldmVudC4uLlxyXG5cclxuICBkZWZhdWx0cy5ldmVudHMuZm9jdXNvdXQgPSBuZXdGb2N1c291dFxyXG5cclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuICByZXQudmFsdWUgPSBkZWZhdWx0cy5wcm9wcy52YWx1ZVxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgb2xcclxuXHJcbm5vZGVOYW1lID0gJ29sJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOiB7fVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBzZWxlY3RcclxuXHJcbm5vZGVOYW1lID0gJ3NlbGVjdCdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBzZWxlY3RlZDogJydcclxuICAgICAgbXVsdGlwbGU6IGZhbHNlXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICB2YWx1ZXM6IFtdXHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICAgIGNoYW5nZTogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgdmFsdWUgPSAnJ1xyXG4gIHZhbHVlcyA9IFtdXHJcbiAgaGFzRW1wdHkgPSBmYWxzZVxyXG5cclxuICBzeW5jVmFsdWUgPSAtPlxyXG4gICAgdmFsdWUgPSByZXQudmFsKClcclxuXHJcbiAgIyBDbGljayBiaW5kaW5nXHJcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICByZXR2YWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXHJcblxyXG4gICMgQ2hhbmdlIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2hhbmdlIGlzbnQgT0oubm9vcFxyXG4gICAgY2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gICAgbmV3Q2hhbmdlID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICByZXR2YWwgPSBjaGFuZ2UgZXZlbnQuLi5cclxuICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgcmV0dmFsXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2hhbmdlID0gbmV3Q2hhbmdlXHJcblxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gIHJldC5hZGQgJ3NlbGVjdGVkRGF0YScsIChwcm9wTmFtZSkgLT5cclxuICAgIHJldCA9ICcnXHJcbiAgICBpZiByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKSBhbmQgcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF1cclxuICAgICAgZGF0YXNldCA9IHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdLmRhdGFzZXRcclxuICAgICAgcmV0ID0gZGF0YXNldFtwcm9wTmFtZV0gIGlmIGRhdGFzZXRcclxuICAgIHJldFxyXG5cclxuICByZXQuYWRkICdzZWxlY3RlZFRleHQnLCAtPlxyXG4gICAgcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudGV4dCgpXHJcblxyXG4gIHJldC5hZGQgJ3NlbGVjdGVkVmFsJywgLT5cclxuICAgIHZhbHVlID0gcmV0LnZhbCgpXHJcbiAgICB2YWx1ZVxyXG5cclxuICByZXQuYWRkICdhZGRPcHRpb24nLCAodmFsdWUsIHRleHQgPSB2YWx1ZSwgc2VsZWN0ZWQgPSBmYWxzZSwgZGlzYWJsZWQgPSBmYWxzZSkgLT5cclxuICAgIGlzRW1wdHkgPSBfLmlzRW1wdHkgdmFsdWVcclxuICAgIGFkZCA9IGZhbHNlXHJcbiAgICBpZiBpc0VtcHR5IGFuZCBmYWxzZSBpcyBoYXNFbXB0eVxyXG4gICAgICBoYXNFbXB0eSA9IHRydWVcclxuICAgICAgYWRkID0gdHJ1ZVxyXG4gICAgaWYgZmFsc2UgaXMgYWRkIGFuZCBmYWxzZSBpcyBpc0VtcHR5IHRoZW4gYWRkID0gdHJ1ZVxyXG4gICAgaWYgYWRkXHJcbiAgICAgIHZhbCA9XHJcbiAgICAgICAgdGV4dDogdGV4dFxyXG4gICAgICAgIHByb3BzOlxyXG4gICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgIGlmIHNlbGVjdGVkXHJcbiAgICAgICAgdmFsLnNlbGVjdGVkID0gc2VsZWN0ZWRcclxuICAgICAgaWYgZGlzYWJsZWRcclxuICAgICAgICB2YWwuZGlzYWJsZWQgPSBkaXNhYmxlZFxyXG4gICAgICBvcHRpb24gPSByZXQubWFrZSAnb3B0aW9uJywgdmFsXHJcbiAgICAgIG9wdGlvblxyXG5cclxuICByZXQuYWRkICdhZGRPcHRpb25zJywgKG9wdGlvbnMpIC0+XHJcbiAgICB2YWx1ZXMgPSBfLnVuaW9uIHZhbHVlcywgb3B0aW9uc1xyXG4gICAgT0ouZWFjaCBvcHRpb25zLCAoKHZhbCkgLT5cclxuICAgICAgdmFsdWUgPSByZXQuYWRkT3B0aW9uKHZhbClcclxuICAgICAgdmFsdWVzLnB1c2ggdmFsdWVcclxuICAgICksIGZhbHNlXHJcbiAgICB2YWx1ZXNcclxuXHJcbiAgcmV0LmFkZCAncmVzZXRPcHRpb25zJywgKHZhbHVlcykgLT5cclxuICAgIHJldC5lbXB0eSgpXHJcbiAgICB2YWx1ZXMgPSB2YWx1ZXNcclxuICAgIHJldC5hZGRPcHRpb25zIHZhbHVlc1xyXG4gICAgcmV0XHJcblxyXG4gIHJldC5hZGQgJ3JlbW92ZU9wdGlvbicsICh2YWx1ZVRvUmVtb3ZlKSAtPlxyXG4gICAgdmFsdWVzLnNwbGljZSB2YWx1ZXMuaW5kZXhPZih2YWx1ZVRvUmVtb3ZlKSwgMSAjcmVtb3ZlcyB0aGUgaXRlbSBmcm9tIHRoZSBsaXN0XHJcbiAgICBzZWxlY3RDb250cm9sID0gcmV0WzBdXHJcbiAgICBpID0gMFxyXG5cclxuICAgIHdoaWxlIGkgPCBzZWxlY3RDb250cm9sLmxlbmd0aFxyXG4gICAgICBzZWxlY3RDb250cm9sLnJlbW92ZSBpICBpZiBzZWxlY3RDb250cm9sLm9wdGlvbnNbaV0udmFsdWUgaXMgdmFsdWVUb1JlbW92ZVxyXG4gICAgICBpKytcclxuICAgIG51bGxcclxuXHJcblxyXG5cclxuICBpZiBkZWZhdWx0cy52YWx1ZXMubGVuZ3RoID4gMFxyXG4gICAgcmV0LmFkZE9wdGlvbnMgZGVmYXVsdHMudmFsdWVzXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyICQsIEpzb25Ub1RhYmxlLCBPSiwgXywgYXJyYXkyRCwgbm9kZSwgbm9kZUZhY3RvcnksIG5vZGVOYW1lO1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSgnLi4vZG9tL25vZGVGYWN0b3J5Jyk7XG5cbl8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG5cbmFycmF5MkQgPSByZXF1aXJlKCcuLi90b29scy9hcnJheTJEJyk7XG5cbiQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cbkpzb25Ub1RhYmxlID0gcmVxdWlyZSgnLi4vdG9vbHMvSnNvblRvVGFibGUnKTtcblxubm9kZU5hbWUgPSAndGFibGUnO1xuXG5cbi8qXG5DcmVhdGUgYW4gSFRNTCB0YWJsZS4gUHJvdmlkZXMgaGVscGVyIG1ldGhvZHMgdG8gY3JlYXRlIENvbHVtbnMgYW5kIENlbGxzLlxuICovXG5cbm5vZGUgPSBmdW5jdGlvbihvcHRpb25zLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnkpIHtcbiAgdmFyIGNlbGxzLCBjb2x1bW5Db3VudCwgZGVmYXVsdHMsIGZpbGxNaXNzaW5nLCBpbml0LCBsb2FkQ2VsbHMsIHJldCwgcm93cywgdGJvZHksIHRoZWFkLCB0aGVhZFJvdztcbiAgaWYgKG93bmVyID09IG51bGwpIHtcbiAgICBvd25lciA9IE9KLmJvZHk7XG4gIH1cbiAgaWYgKGNhbGxlZEZyb21GYWN0b3J5ID09IG51bGwpIHtcbiAgICBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlO1xuICB9XG4gIGRlZmF1bHRzID0ge1xuICAgIGRhdGE6IG51bGwsXG4gICAgcHJvcHM6IHtcbiAgICAgIGNlbGxwYWRkaW5nOiAwLFxuICAgICAgY2VsbHNwYWNpbmc6IDAsXG4gICAgICBhbGlnbjogJycsXG4gICAgICB3aWR0aDogJycsXG4gICAgICBjZWxsYWxpZ246ICdsZWZ0JyxcbiAgICAgIGNlbGx2YWxpZ246ICd0b3AnLFxuICAgICAgXCJjbGFzc1wiOiAnJ1xuICAgIH0sXG4gICAgc3R5bGVzOiB7fSxcbiAgICBldmVudHM6IHt9LFxuICAgIGNlbGxzOiB7XG4gICAgICBcImNsYXNzXCI6ICcnLFxuICAgICAgYWxpZ246ICcnLFxuICAgICAgJ3ZlcnRpY2FsLWFsaWduJzogJycsXG4gICAgICBjZWxscGFkZGluZzogJycsXG4gICAgICBtYXJnaW46ICcnXG4gICAgfSxcbiAgICB0aGVhZDoge30sXG4gICAgdGJvZHk6IHt9LFxuICAgIGZpcnN0QWxpZ25SaWdodDogZmFsc2UsXG4gICAgb2RkQWxpZ25SaWdodDogZmFsc2VcbiAgfTtcbiAgcm93cyA9IFtdO1xuICBjZWxscyA9IGFycmF5MkQoKTtcbiAgY29sdW1uQ291bnQgPSAwO1xuICBPSi5leHRlbmQoZGVmYXVsdHMsIG9wdGlvbnMsIHRydWUpO1xuICByZXQgPSBub2RlRmFjdG9yeShub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeSk7XG4gIHRib2R5ID0gbnVsbDtcbiAgdGhlYWQgPSBudWxsO1xuICB0aGVhZFJvdyA9IG51bGw7XG4gIGluaXQgPSBfLm9uY2UoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGoydCwgakJvZHksIGpIZWFkLCBqVGJsLCB0YmxTdHI7XG4gICAgaWYgKGRlZmF1bHRzLmRhdGEpIHtcbiAgICAgIGoydCA9IG5ldyBKc29uVG9UYWJsZShkZWZhdWx0cy5kYXRhKTtcbiAgICAgIHRibFN0ciA9IGoydC50YWJsZTtcbiAgICB9XG4gICAgaWYgKHRibFN0cikge1xuICAgICAgalRibCA9ICQodGJsU3RyKTtcbiAgICAgIGpIZWFkID0galRibC5maW5kKCd0aGVhZCcpO1xuICAgICAgcmV0LiQuYXBwZW5kKGpIZWFkKTtcbiAgICAgIHRoZWFkID0gZWwucmVzdG9yZUVsZW1lbnQoakhlYWRbMF0pO1xuICAgICAgdGhlYWRSb3cgPSBlbC5yZXN0b3JlRWxlbWVudCh0aGVhZFswXS5yb3dzWzBdKTtcbiAgICAgIGpCb2R5ID0galRibC5maW5kKCd0Ym9keScpO1xuICAgICAgcmV0LiQuYXBwZW5kKGpCb2R5KTtcbiAgICAgIHRib2R5ID0gZWwucmVzdG9yZUVsZW1lbnQoakJvZHlbMF0pO1xuICAgICAgbG9hZENlbGxzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoZWFkID0gcmV0Lm1ha2UoJ3RoZWFkJywgZGVmYXVsdHMudGhlYWQpO1xuICAgICAgdGhlYWRSb3cgPSB0aGVhZC5tYWtlKCd0cicpO1xuICAgICAgdGJvZHkgPSByZXQubWFrZSgndGJvZHknLCBkZWZhdWx0cy50Ym9keSk7XG4gICAgICByb3dzLnB1c2godGJvZHkubWFrZSgndHInKSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH0pO1xuICBsb2FkQ2VsbHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYywgbWVtQ2VsbCwgbWVtUm93LCByLCByZXN1bHRzO1xuICAgIHIgPSAwO1xuICAgIHJlc3VsdHMgPSBbXTtcbiAgICB3aGlsZSAodGJvZHlbMF0ucm93cy5sZW5ndGggPiByKSB7XG4gICAgICBjID0gMDtcbiAgICAgIG1lbVJvdyA9IGVsLnJlc3RvcmVFbGVtZW50KHRib2R5WzBdLnJvd3Nbcl0pO1xuICAgICAgcm93cy5wdXNoKG1lbVJvdyk7XG4gICAgICB3aGlsZSAodGJvZHlbMF0ucm93c1tyXS5jZWxscy5sZW5ndGggPiBjKSB7XG4gICAgICAgIG1lbUNlbGwgPSBjZWxscy5nZXQociArIDEsIGMgKyAxKTtcbiAgICAgICAgaWYgKCFtZW1DZWxsKSB7XG4gICAgICAgICAgbWVtQ2VsbCA9IGVsLnJlc3RvcmVFbGVtZW50KHRib2R5WzBdLnJvd3Nbcl0uY2VsbHNbY10pO1xuICAgICAgICAgIGNlbGxzLnNldChyICsgMSwgYyArIDEsIG1lbUNlbGwpO1xuICAgICAgICB9XG4gICAgICAgIGMgKz0gMTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdHMucHVzaChyICs9IDEpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfTtcbiAgZmlsbE1pc3NpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gY2VsbHMuZWFjaChmdW5jdGlvbihyb3dObywgY29sTm8sIHZhbCkge1xuICAgICAgdmFyIHJvdztcbiAgICAgIGlmICghdmFsKSB7XG4gICAgICAgIHJvdyA9IHJldC5yb3cocm93Tm8pO1xuICAgICAgICByZXR1cm4gcm93LmNlbGwoY29sTm8sIHt9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgcmV0LmFkZCgnY29sdW1uJywgZnVuY3Rpb24oY29sTm8sIGNvbE5hbWUpIHtcbiAgICB2YXIgaSwgbmF0aXZlVGgsIHRoO1xuICAgIHJldC5pbml0KCk7XG4gICAgY29sdW1uQ291bnQgKz0gMTtcbiAgICB0aCA9IG51bGw7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKHRoZWFkWzBdLnJvd3NbMF0uY2VsbHMubGVuZ3RoIDwgY29sTm8pIHtcbiAgICAgIG5hdGl2ZVRoID0gdGhlYWRbMF0ucm93c1swXS5jZWxsc1tpXTtcbiAgICAgIGlmICghbmF0aXZlVGgpIHtcbiAgICAgICAgdGggPSB0aGVhZFJvdy5tYWtlKCd0aCcsIHt9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoID0gZWwucmVzdG9yZUVsZW1lbnQobmF0aXZlVGgsICd0aCcpO1xuICAgICAgfVxuICAgICAgaSArPSAxO1xuICAgIH1cbiAgICBpZiAoIXRoKSB7XG4gICAgICBuYXRpdmVUaCA9IHRoZWFkWzBdLnJvd3NbMF0uY2VsbHNbY29sTm8gLSAxXTtcbiAgICAgIHRoID0gZWwucmVzdG9yZUVsZW1lbnQobmF0aXZlVGgsICd0aCcpO1xuICAgIH1cbiAgICB0aC50ZXh0KGNvbE5hbWUpO1xuICAgIHJldHVybiB0aDtcbiAgfSk7XG4gIHJldC5hZGQoJ3JvdycsIGZ1bmN0aW9uKHJvd05vLCBvcHRzKSB7XG4gICAgdmFyIHJvdztcbiAgICByb3cgPSByb3dzW3Jvd05vIC0gMV07XG4gICAgaWYgKCFyb3cpIHtcbiAgICAgIHdoaWxlIChyb3dzLmxlbmd0aCA8IHJvd05vKSB7XG4gICAgICAgIHJvdyA9IHRib2R5Lm1ha2UoJ3RyJywge30pO1xuICAgICAgICByb3dzLnB1c2gocm93KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFyb3cuY2VsbCkge1xuICAgICAgcm93LmFkZCgnY2VsbCcsIGZ1bmN0aW9uKGNvbE5vLCBvcHRzKSB7XG4gICAgICAgIHZhciBjZWxsO1xuICAgICAgICBjZWxsID0gT0oubm9kZXMudGQob3B0cywgcm93KTtcbiAgICAgICAgY2VsbHMuc2V0KHJvd05vLCBjb2xObywgY2VsbCk7XG4gICAgICAgIHJldHVybiBjZWxsO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiByb3c7XG4gIH0pO1xuICByZXQuYWRkKCdjZWxsJywgZnVuY3Rpb24ocm93Tm8sIGNvbE5vLCBvcHRzKSB7XG4gICAgdmFyIGNlbGwsIGksIG51T3B0cywgcm93LCB0cnlDZWxsO1xuICAgIGlmIChyb3dObyA8IDEpIHtcbiAgICAgIHJvd05vID0gMTtcbiAgICB9XG4gICAgaWYgKGNvbE5vIDwgMSkge1xuICAgICAgY29sTm8gPSAxO1xuICAgIH1cbiAgICBpZiAoY29sdW1uQ291bnQgPiAwICYmIGNvbE5vIC0gMSA+IGNvbHVtbkNvdW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgY29sdW1uIG5hbWUgaGFzIG5vdCBiZWVuIGRlZmluZWQgZm9yIHRoaXMgcG9zaXRpb24geycgKyByb3dObyArICd4JyArIGNvbE5vICsgJ30uJyk7XG4gICAgfVxuICAgIHJvdyA9IHJldC5yb3cocm93Tm8pO1xuICAgIGNlbGwgPSBjZWxscy5nZXQocm93Tm8sIGNvbE5vKTtcbiAgICBpZiAoIWNlbGwpIHtcbiAgICAgIGkgPSAwO1xuICAgICAgd2hpbGUgKGkgPCBjb2xObykge1xuICAgICAgICBpICs9IDE7XG4gICAgICAgIGlmIChpID09PSBjb2xObykge1xuICAgICAgICAgIG51T3B0cyA9IE9KLmV4dGVuZCh7XG4gICAgICAgICAgICBwcm9wczogZGVmYXVsdHMuY2VsbHNcbiAgICAgICAgICB9LCBvcHRzKTtcbiAgICAgICAgICBjZWxsID0gcm93LmNlbGwoY29sTm8sIG51T3B0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdHJ5Q2VsbCA9IGNlbGxzLmdldChyb3dObywgaSk7XG4gICAgICAgICAgaWYgKCF0cnlDZWxsKSB7XG4gICAgICAgICAgICB0cnlDZWxsID0gcm93LmNlbGwoaSwge1xuICAgICAgICAgICAgICBwcm9wczogZGVmYXVsdHMuY2VsbHNcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2VsbDtcbiAgfSk7XG4gIGluaXQoKTtcbiAgcmV0LmFkZCgndGhlYWQnLCB0aGVhZCk7XG4gIHJldC5hZGQoJ3Rib2R5JywgdGJvZHkpO1xuICByZXR1cm4gcmV0O1xufTtcblxuT0oubm9kZXMucmVnaXN0ZXIobm9kZU5hbWUsIG5vZGUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4bGJHVnRaVzUwYzF4Y2RHRmliR1V1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVN4SlFVRkJPenRCUVVGQkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUMEZCVWpzN1FVRkRUQ3hYUVVGQkxFZEJRV01zVDBGQlFTeERRVUZSTEc5Q1FVRlNPenRCUVVOa0xFTkJRVUVzUjBGQlNTeFBRVUZCTEVOQlFWRXNVVUZCVWpzN1FVRkRTaXhQUVVGQkxFZEJRVlVzVDBGQlFTeERRVUZSTEd0Q1FVRlNPenRCUVVOV0xFTkJRVUVzUjBGQlNTeFBRVUZCTEVOQlFWRXNVVUZCVWpzN1FVRkRTaXhYUVVGQkxFZEJRV01zVDBGQlFTeERRVUZSTEhOQ1FVRlNPenRCUVVsa0xGRkJRVUVzUjBGQlZ6czdPMEZCUlZnN096czdRVUZIUVN4SlFVRkJMRWRCUVU4c1UwRkJReXhQUVVGRUxFVkJRVlVzUzBGQlZpeEZRVUV5UWl4cFFrRkJNMEk3UVVGSFRDeE5RVUZCT3p0SlFVaGxMRkZCUVZFc1JVRkJSU3hEUVVGRE96czdTVUZCVFN4dlFrRkJiMEk3TzBWQlIzQkVMRkZCUVVFc1IwRkhSVHRKUVVGQkxFbEJRVUVzUlVGQlRTeEpRVUZPTzBsQlIwRXNTMEZCUVN4RlFVTkZPMDFCUVVFc1YwRkJRU3hGUVVGaExFTkJRV0k3VFVGRFFTeFhRVUZCTEVWQlFXRXNRMEZFWWp0TlFVVkJMRXRCUVVFc1JVRkJUeXhGUVVaUU8wMUJSMEVzUzBGQlFTeEZRVUZQTEVWQlNGQTdUVUZKUVN4VFFVRkJMRVZCUVZjc1RVRktXRHROUVV0QkxGVkJRVUVzUlVGQldTeExRVXhhTzAxQlRVRXNUMEZCUVN4RlFVRlBMRVZCVGxBN1MwRktSanRKUVZkQkxFMUJRVUVzUlVGQlVTeEZRVmhTTzBsQldVRXNUVUZCUVN4RlFVRlJMRVZCV2xJN1NVRmxRU3hMUVVGQkxFVkJRMFU3VFVGQlFTeFBRVUZCTEVWQlFVOHNSVUZCVUR0TlFVTkJMRXRCUVVFc1JVRkJUeXhGUVVSUU8wMUJSVUVzWjBKQlFVRXNSVUZCYTBJc1JVRkdiRUk3VFVGSFFTeFhRVUZCTEVWQlFXRXNSVUZJWWp0TlFVbEJMRTFCUVVFc1JVRkJVU3hGUVVwU08wdEJhRUpHTzBsQmRVSkJMRXRCUVVFc1JVRkJUeXhGUVhaQ1VEdEpRVEJDUVN4TFFVRkJMRVZCUVU4c1JVRXhRbEE3U1VFMFFrRXNaVUZCUVN4RlFVRnBRaXhMUVRWQ2FrSTdTVUUyUWtFc1lVRkJRU3hGUVVGbExFdEJOMEptT3p0RlFTdENSaXhKUVVGQkxFZEJRVTg3UlVGRFVDeExRVUZCTEVkQlFWRXNUMEZCUVN4RFFVRkJPMFZCUTFJc1YwRkJRU3hIUVVGak8wVkJSV1FzUlVGQlJTeERRVUZETEUxQlFVZ3NRMEZCVlN4UlFVRldMRVZCUVc5Q0xFOUJRWEJDTEVWQlFUWkNMRWxCUVRkQ08wVkJRMEVzUjBGQlFTeEhRVUZOTEZkQlFVRXNRMEZCV1N4UlFVRmFMRVZCUVhOQ0xGRkJRWFJDTEVWQlFXZERMRXRCUVdoRExFVkJRWFZETEdsQ1FVRjJRenRGUVVkT0xFdEJRVUVzUjBGQlVUdEZRVU5TTEV0QlFVRXNSMEZCVVR0RlFVTlNMRkZCUVVFc1IwRkJWenRGUVVsWUxFbEJRVUVzUjBGQlR5eERRVUZETEVOQlFVTXNTVUZCUml4RFFVRlBMRk5CUVVFN1FVRkRXaXhSUVVGQk8wbEJRVUVzU1VGQlJ5eFJRVUZSTEVOQlFVTXNTVUZCV2p0TlFVTkZMRWRCUVVFc1IwRkJWU3hKUVVGQkxGZEJRVUVzUTBGQldTeFJRVUZSTEVOQlFVTXNTVUZCY2tJN1RVRkRWaXhOUVVGQkxFZEJRVk1zUjBGQlJ5eERRVUZETEUxQlJtWTdPMGxCUjBFc1NVRkJSeXhOUVVGSU8wMUJRMFVzU1VGQlFTeEhRVUZQTEVOQlFVRXNRMEZCUlN4TlFVRkdPMDFCUlZBc1MwRkJRU3hIUVVGUkxFbEJRVWtzUTBGQlF5eEpRVUZNTEVOQlFWVXNUMEZCVmp0TlFVTlNMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zVFVGQlRpeERRVUZoTEV0QlFXSTdUVUZEUVN4TFFVRkJMRWRCUVZFc1JVRkJSU3hEUVVGRExHTkJRVWdzUTBGQmEwSXNTMEZCVFN4RFFVRkJMRU5CUVVFc1EwRkJlRUk3VFVGRFVpeFJRVUZCTEVkQlFWY3NSVUZCUlN4RFFVRkRMR05CUVVnc1EwRkJhMElzUzBGQlRTeERRVUZCTEVOQlFVRXNRMEZCUlN4RFFVRkRMRWxCUVVzc1EwRkJRU3hEUVVGQkxFTkJRV2hETzAxQlJWZ3NTMEZCUVN4SFFVRlJMRWxCUVVrc1EwRkJReXhKUVVGTUxFTkJRVlVzVDBGQlZqdE5RVU5TTEVkQlFVY3NRMEZCUXl4RFFVRkRMRU5CUVVNc1RVRkJUaXhEUVVGaExFdEJRV0k3VFVGRFFTeExRVUZCTEVkQlFWRXNSVUZCUlN4RFFVRkRMR05CUVVnc1EwRkJhMElzUzBGQlRTeERRVUZCTEVOQlFVRXNRMEZCZUVJN1RVRkZVaXhUUVVGQkxFTkJRVUVzUlVGYVJqdExRVUZCTEUxQlFVRTdUVUZqUlN4TFFVRkJMRWRCUVZFc1IwRkJSeXhEUVVGRExFbEJRVW9zUTBGQlV5eFBRVUZVTEVWQlFXdENMRkZCUVZFc1EwRkJReXhMUVVFelFqdE5RVU5TTEZGQlFVRXNSMEZCVnl4TFFVRkxMRU5CUVVNc1NVRkJUaXhEUVVGWExFbEJRVmc3VFVGRFdDeExRVUZCTEVkQlFWRXNSMEZCUnl4RFFVRkRMRWxCUVVvc1EwRkJVeXhQUVVGVUxFVkJRV3RDTEZGQlFWRXNRMEZCUXl4TFFVRXpRanROUVVOU0xFbEJRVWtzUTBGQlF5eEpRVUZNTEVOQlFWVXNTMEZCU3l4RFFVRkRMRWxCUVU0c1EwRkJWeXhKUVVGWUxFTkJRVllzUlVGcVFrWTdPMWRCYTBKQk8wVkJkRUpaTEVOQlFWQTdSVUV3UWxBc1UwRkJRU3hIUVVGWkxGTkJRVUU3UVVGRFZpeFJRVUZCTzBsQlFVRXNRMEZCUVN4SFFVRkpPMEZCUTBvN1YwRkJUU3hMUVVGTkxFTkJRVUVzUTBGQlFTeERRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVdRc1IwRkJkVUlzUTBGQk4wSTdUVUZEUlN4RFFVRkJMRWRCUVVrN1RVRkRTaXhOUVVGQkxFZEJRVk1zUlVGQlJTeERRVUZETEdOQlFVZ3NRMEZCYTBJc1MwRkJUU3hEUVVGQkxFTkJRVUVzUTBGQlJTeERRVUZETEVsQlFVc3NRMEZCUVN4RFFVRkJMRU5CUVdoRE8wMUJRMVFzU1VGQlNTeERRVUZETEVsQlFVd3NRMEZCVlN4TlFVRldPMEZCUTBFc1lVRkJUU3hMUVVGTkxFTkJRVUVzUTBGQlFTeERRVUZGTEVOQlFVTXNTVUZCU3l4RFFVRkJMRU5CUVVFc1EwRkJSU3hEUVVGRExFdEJRVXNzUTBGQlF5eE5RVUYyUWl4SFFVRm5ReXhEUVVGMFF6dFJRVU5GTEU5QlFVRXNSMEZCVlN4TFFVRkxMRU5CUVVNc1IwRkJUaXhEUVVGVkxFTkJRVUVzUjBGQlJTeERRVUZhTEVWQlFXVXNRMEZCUVN4SFFVRkZMRU5CUVdwQ08xRkJRMVlzU1VGQlJ5eERRVUZKTEU5QlFWQTdWVUZEUlN4UFFVRkJMRWRCUVZVc1JVRkJSU3hEUVVGRExHTkJRVWdzUTBGQmEwSXNTMEZCVFN4RFFVRkJMRU5CUVVFc1EwRkJSU3hEUVVGRExFbEJRVXNzUTBGQlFTeERRVUZCTEVOQlFVVXNRMEZCUXl4TFFVRk5MRU5CUVVFc1EwRkJRU3hEUVVGNlF6dFZRVU5XTEV0QlFVc3NRMEZCUXl4SFFVRk9MRU5CUVZVc1EwRkJRU3hIUVVGRkxFTkJRVm9zUlVGQlpTeERRVUZCTEVkQlFVVXNRMEZCYWtJc1JVRkJiMElzVDBGQmNFSXNSVUZHUmpzN1VVRkhRU3hEUVVGQkxFbEJRVXM3VFVGTVVEdHRRa0ZOUVN4RFFVRkJMRWxCUVVzN1NVRldVQ3hEUVVGQk96dEZRVVpWTzBWQlowSmFMRmRCUVVFc1IwRkJZeXhUUVVGQk8xZEJRMW9zUzBGQlN5eERRVUZETEVsQlFVNHNRMEZCVnl4VFFVRkRMRXRCUVVRc1JVRkJVU3hMUVVGU0xFVkJRV1VzUjBGQlpqdEJRVU5VTEZWQlFVRTdUVUZCUVN4SlFVRkhMRU5CUVVrc1IwRkJVRHRSUVVORkxFZEJRVUVzUjBGQlRTeEhRVUZITEVOQlFVTXNSMEZCU2l4RFFVRlJMRXRCUVZJN1pVRkRUaXhIUVVGSExFTkJRVU1zU1VGQlNpeERRVUZUTEV0QlFWUXNSVUZCWjBJc1JVRkJhRUlzUlVGR1JqczdTVUZFVXl4RFFVRllPMFZCUkZrN1JVRlJaQ3hIUVVGSExFTkJRVU1zUjBGQlNpeERRVUZSTEZGQlFWSXNSVUZCYTBJc1UwRkJReXhMUVVGRUxFVkJRVkVzVDBGQlVqdEJRVU5vUWl4UlFVRkJPMGxCUVVFc1IwRkJSeXhEUVVGRExFbEJRVW9zUTBGQlFUdEpRVU5CTEZkQlFVRXNTVUZCWlR0SlFVTm1MRVZCUVVFc1IwRkJTenRKUVVOTUxFTkJRVUVzUjBGQlNUdEJRVU5LTEZkQlFVMHNTMEZCVFN4RFFVRkJMRU5CUVVFc1EwRkJSU3hEUVVGRExFbEJRVXNzUTBGQlFTeERRVUZCTEVOQlFVVXNRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJka0lzUjBGQlowTXNTMEZCZEVNN1RVRkRSU3hSUVVGQkxFZEJRVmNzUzBGQlRTeERRVUZCTEVOQlFVRXNRMEZCUlN4RFFVRkRMRWxCUVVzc1EwRkJRU3hEUVVGQkxFTkJRVVVzUTBGQlF5eExRVUZOTEVOQlFVRXNRMEZCUVR0TlFVTnNReXhKUVVGSExFTkJRVWtzVVVGQlVEdFJRVU5GTEVWQlFVRXNSMEZCU3l4UlFVRlJMRU5CUVVNc1NVRkJWQ3hEUVVGakxFbEJRV1FzUlVGQmIwSXNSVUZCY0VJc1JVRkVVRHRQUVVGQkxFMUJRVUU3VVVGSFJTeEZRVUZCTEVkQlFVc3NSVUZCUlN4RFFVRkRMR05CUVVnc1EwRkJhMElzVVVGQmJFSXNSVUZCTkVJc1NVRkJOVUlzUlVGSVVEczdUVUZKUVN4RFFVRkJMRWxCUVVzN1NVRk9VRHRKUVU5QkxFbEJRVWNzUTBGQlNTeEZRVUZRTzAxQlEwVXNVVUZCUVN4SFFVRlhMRXRCUVUwc1EwRkJRU3hEUVVGQkxFTkJRVVVzUTBGQlF5eEpRVUZMTEVOQlFVRXNRMEZCUVN4RFFVRkZMRU5CUVVNc1MwRkJUU3hEUVVGQkxFdEJRVUVzUjBGQlRTeERRVUZPTzAxQlEyeERMRVZCUVVFc1IwRkJTeXhGUVVGRkxFTkJRVU1zWTBGQlNDeERRVUZyUWl4UlFVRnNRaXhGUVVFMFFpeEpRVUUxUWl4RlFVWlFPenRKUVVkQkxFVkJRVVVzUTBGQlF5eEpRVUZJTEVOQlFWRXNUMEZCVWp0WFFVTkJPMFZCYUVKblFpeERRVUZzUWp0RlFXOUNRU3hIUVVGSExFTkJRVU1zUjBGQlNpeERRVUZSTEV0QlFWSXNSVUZCWlN4VFFVRkRMRXRCUVVRc1JVRkJVU3hKUVVGU08wRkJRMklzVVVGQlFUdEpRVUZCTEVkQlFVRXNSMEZCVFN4SlFVRkxMRU5CUVVFc1MwRkJRU3hIUVVGTkxFTkJRVTQ3U1VGRldDeEpRVUZITEVOQlFVa3NSMEZCVUR0QlFVTkZMR0ZCUVUwc1NVRkJTU3hEUVVGRExFMUJRVXdzUjBGQll5eExRVUZ3UWp0UlFVTkZMRWRCUVVFc1IwRkJUU3hMUVVGTExFTkJRVU1zU1VGQlRpeERRVUZYTEVsQlFWZ3NSVUZCYVVJc1JVRkJha0k3VVVGRFRpeEpRVUZKTEVOQlFVTXNTVUZCVEN4RFFVRlZMRWRCUVZZN1RVRkdSaXhEUVVSR096dEpRVXRCTEVsQlFVY3NRMEZCU1N4SFFVRkhMRU5CUVVNc1NVRkJXRHROUVVORkxFZEJRVWNzUTBGQlF5eEhRVUZLTEVOQlFWRXNUVUZCVWl4RlFVRm5RaXhUUVVGRExFdEJRVVFzUlVGQlVTeEpRVUZTTzBGQlEyUXNXVUZCUVR0UlFVRkJMRWxCUVVFc1IwRkJUeXhGUVVGRkxFTkJRVU1zUzBGQlN5eERRVUZETEVWQlFWUXNRMEZCV1N4SlFVRmFMRVZCUVd0Q0xFZEJRV3hDTzFGQlExQXNTMEZCU3l4RFFVRkRMRWRCUVU0c1EwRkJWU3hMUVVGV0xFVkJRV2xDTEV0QlFXcENMRVZCUVhkQ0xFbEJRWGhDTzJWQlEwRTdUVUZJWXl4RFFVRm9RaXhGUVVSR096dFhRVTFCTzBWQlpHRXNRMEZCWmp0RlFXdENRU3hIUVVGSExFTkJRVU1zUjBGQlNpeERRVUZSTEUxQlFWSXNSVUZCWjBJc1UwRkJReXhMUVVGRUxFVkJRVkVzUzBGQlVpeEZRVUZsTEVsQlFXWTdRVUZEWkN4UlFVRkJPMGxCUVVFc1NVRkJSeXhMUVVGQkxFZEJRVkVzUTBGQldEdE5RVUZyUWl4TFFVRkJMRWRCUVZFc1JVRkJNVUk3TzBsQlEwRXNTVUZCUnl4TFFVRkJMRWRCUVZFc1EwRkJXRHROUVVGclFpeExRVUZCTEVkQlFWRXNSVUZCTVVJN08wbEJRMEVzU1VGQlJ5eFhRVUZCTEVkQlFXTXNRMEZCWkN4SlFVRnZRaXhMUVVGQkxFZEJRVTBzUTBGQlRpeEhRVUZWTEZkQlFXcERPMEZCUVd0RUxGbEJRVlVzU1VGQlFTeExRVUZCTEVOQlFVMHNkMFJCUVVFc1IwRkJNa1FzUzBGQk0wUXNSMEZCYlVVc1IwRkJia1VzUjBGQmVVVXNTMEZCZWtVc1IwRkJhVVlzU1VGQmRrWXNSVUZCTlVRN08wbEJSVUVzUjBGQlFTeEhRVUZOTEVkQlFVY3NRMEZCUXl4SFFVRktMRU5CUVZFc1MwRkJVanRKUVVWT0xFbEJRVUVzUjBGQlR5eExRVUZMTEVOQlFVTXNSMEZCVGl4RFFVRlZMRXRCUVZZc1JVRkJhVUlzUzBGQmFrSTdTVUZGVUN4SlFVRkhMRU5CUVVrc1NVRkJVRHROUVVORkxFTkJRVUVzUjBGQlNUdEJRVU5LTEdGQlFVMHNRMEZCUVN4SFFVRkpMRXRCUVZZN1VVRkRSU3hEUVVGQkxFbEJRVXM3VVVGRFRDeEpRVUZITEVOQlFVRXNTMEZCU3l4TFFVRlNPMVZCUTBVc1RVRkJRU3hIUVVGVExFVkJRVVVzUTBGQlF5eE5RVUZJTEVOQlFWVTdXVUZCUXl4TFFVRkJMRVZCUVU4c1VVRkJVU3hEUVVGRExFdEJRV3BDTzFkQlFWWXNSVUZCYlVNc1NVRkJia003VlVGRFZDeEpRVUZCTEVkQlFVOHNSMEZCUnl4RFFVRkRMRWxCUVVvc1EwRkJVeXhMUVVGVUxFVkJRV2RDTEUxQlFXaENMRVZCUmxRN1UwRkJRU3hOUVVGQk8xVkJTVVVzVDBGQlFTeEhRVUZWTEV0QlFVc3NRMEZCUXl4SFFVRk9MRU5CUVZVc1MwRkJWaXhGUVVGcFFpeERRVUZxUWp0VlFVTldMRWxCUVVjc1EwRkJTU3hQUVVGUU8xbEJRMFVzVDBGQlFTeEhRVUZYTEVkQlFVY3NRMEZCUXl4SlFVRktMRU5CUVZNc1EwRkJWQ3hGUVVGWk8yTkJRVUVzUzBGQlFTeEZRVUZQTEZGQlFWRXNRMEZCUXl4TFFVRm9RanRoUVVGYUxFVkJSR0k3VjBGTVJqczdUVUZHUml4RFFVWkdPenRYUVZsQk8wVkJja0pqTEVOQlFXaENPMFZCZVVKQkxFbEJRVUVzUTBGQlFUdEZRVWxCTEVkQlFVY3NRMEZCUXl4SFFVRktMRU5CUVZFc1QwRkJVaXhGUVVGcFFpeExRVUZxUWp0RlFVbEJMRWRCUVVjc1EwRkJReXhIUVVGS0xFTkJRVkVzVDBGQlVpeEZRVUZwUWl4TFFVRnFRanRUUVVsQk8wRkJhRXhMT3p0QlFXdE1VQ3hGUVVGRkxFTkJRVU1zUzBGQlN5eERRVUZETEZGQlFWUXNRMEZCYTBJc1VVRkJiRUlzUlVGQk5FSXNTVUZCTlVJN08wRkJRMEVzVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJaUxDSm1hV3hsSWpvaVoyVnVaWEpoZEdWa0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJazlLSUQwZ2NtVnhkV2x5WlNBbkxpNHZiMm9uWEhKY2JtNXZaR1ZHWVdOMGIzSjVJRDBnY21WeGRXbHlaU0FuTGk0dlpHOXRMMjV2WkdWR1lXTjBiM0o1SjF4eVhHNWZJRDBnY21WeGRXbHlaU0FuYkc5a1lYTm9KMXh5WEc1aGNuSmhlVEpFSUQwZ2NtVnhkV2x5WlNBbkxpNHZkRzl2YkhNdllYSnlZWGt5UkNkY2NseHVKQ0E5SUhKbGNYVnBjbVVnSjJweGRXVnllU2RjY2x4dVNuTnZibFJ2VkdGaWJHVWdQU0J5WlhGMWFYSmxJQ2N1TGk5MGIyOXNjeTlLYzI5dVZHOVVZV0pzWlNkY2NseHVYSEpjYmlNZ0l5QjBZV0pzWlZ4eVhHNWNjbHh1Ym05a1pVNWhiV1VnUFNBbmRHRmliR1VuWEhKY2JseHlYRzRqSXlOY2NseHVRM0psWVhSbElHRnVJRWhVVFV3Z2RHRmliR1V1SUZCeWIzWnBaR1Z6SUdobGJIQmxjaUJ0WlhSb2IyUnpJSFJ2SUdOeVpXRjBaU0JEYjJ4MWJXNXpJR0Z1WkNCRFpXeHNjeTVjY2x4dUl5TWpYSEpjYm01dlpHVWdQU0FvYjNCMGFXOXVjeXdnYjNkdVpYSWdQU0JQU2k1aWIyUjVMQ0JqWVd4c1pXUkdjbTl0Um1GamRHOXllU0E5SUdaaGJITmxLU0F0UGx4eVhHNWNjbHh1SUNBaklDTWpJRzl3ZEdsdmJuTmNjbHh1SUNCa1pXWmhkV3gwY3lBOVhISmNiaUFnSUNBaklDTWpJeUJrWVhSaFhISmNiaUFnSUNBaklHOXdkR2x2Ym1Gc0lHRnljbUY1SUc5bUlHOWlhbVZqZEhNdUlHbG1JSEJ5YjNacFpHVmtJSGRwYkd3Z1oyVnVaWEpoZEdVZ2RHRmliR1VnWVhWMGIyMWhkR2xqWVd4c2VTNWNjbHh1SUNBZ0lHUmhkR0U2SUc1MWJHeGNjbHh1SUNBZ0lDTWdJeU1qSUhCeWIzQnpYSEpjYmlBZ0lDQWpJRzl3ZEdsdmJtRnNJSEJ5YjNCbGNuUnBaWE1nZEc4Z1lYQndiSGtnZEc4Z2RHRmliR1VnY205dmRDQnViMlJsWEhKY2JpQWdJQ0J3Y205d2N6cGNjbHh1SUNBZ0lDQWdZMlZzYkhCaFpHUnBibWM2SURCY2NseHVJQ0FnSUNBZ1kyVnNiSE53WVdOcGJtYzZJREJjY2x4dUlDQWdJQ0FnWVd4cFoyNDZJQ2NuWEhKY2JpQWdJQ0FnSUhkcFpIUm9PaUFuSjF4eVhHNGdJQ0FnSUNCalpXeHNZV3hwWjI0NklDZHNaV1owSjF4eVhHNGdJQ0FnSUNCalpXeHNkbUZzYVdkdU9pQW5kRzl3SjF4eVhHNGdJQ0FnSUNCamJHRnpjem9nSnlkY2NseHVJQ0FnSUhOMGVXeGxjem9nZTMxY2NseHVJQ0FnSUdWMlpXNTBjem9nZTMxY2NseHVJQ0FnSUNNZ0l5TWpJR05sYkd4elhISmNiaUFnSUNBaklHOXdkR2x2Ym1Gc0lIQnliM0JsY25ScFpYTWdkRzhnWVhCd2JIa2dkRzhnYVc1a2FYWnBaSFZoYkNCalpXeHNjMXh5WEc0Z0lDQWdZMlZzYkhNNlhISmNiaUFnSUNBZ0lHTnNZWE56T2lBbkoxeHlYRzRnSUNBZ0lDQmhiR2xuYmpvZ0p5ZGNjbHh1SUNBZ0lDQWdKM1psY25ScFkyRnNMV0ZzYVdkdUp6b2dKeWRjY2x4dUlDQWdJQ0FnWTJWc2JIQmhaR1JwYm1jNklDY25YSEpjYmlBZ0lDQWdJRzFoY21kcGJqb2dKeWRjY2x4dUlDQWdJQ01nSXlNaklIUm9aV0ZrWEhKY2JpQWdJQ0FqSUc5d2RHbHZibUZzSUc5d2RHbHZibk1nYjJKcVpXTjBJSFJ2SUhCaGMzTWdhVzUwYnlCMGFHVmhaQ0JqY21WaGRHbHZibHh5WEc0Z0lDQWdkR2hsWVdRNklIdDlYSEpjYmlBZ0lDQWpJQ01qSXlCMFltOWtlVnh5WEc0Z0lDQWdJeUJ2Y0hScGIyNWhiQ0J2Y0hScGIyNXpJRzlpYW1WamRDQjBieUJ3WVhOeklHbHVkRzhnZEdKdlpIa2dZM0psWVhScGIyNWNjbHh1SUNBZ0lIUmliMlI1T2lCN2ZWeHlYRzVjY2x4dUlDQWdJR1pwY25OMFFXeHBaMjVTYVdkb2REb2dabUZzYzJWY2NseHVJQ0FnSUc5a1pFRnNhV2R1VW1sbmFIUTZJR1poYkhObFhISmNibHh5WEc0Z0lISnZkM01nUFNCYlhWeHlYRzRnSUdObGJHeHpJRDBnWVhKeVlYa3lSQ2dwWEhKY2JpQWdZMjlzZFcxdVEyOTFiblFnUFNBd1hISmNibHh5WEc0Z0lFOUtMbVY0ZEdWdVpDQmtaV1poZFd4MGN5d2diM0IwYVc5dWN5d2dkSEoxWlZ4eVhHNGdJSEpsZENBOUlHNXZaR1ZHWVdOMGIzSjVJRzV2WkdWT1lXMWxMQ0JrWldaaGRXeDBjeXdnYjNkdVpYSXNJR05oYkd4bFpFWnliMjFHWVdOMGIzSjVYSEpjYmlCY2NseHVYSEpjYmlBZ2RHSnZaSGtnUFNCdWRXeHNYSEpjYmlBZ2RHaGxZV1FnUFNCdWRXeHNYSEpjYmlBZ2RHaGxZV1JTYjNjZ1BTQnVkV3hzWEhKY2JseHlYRzRnSUNNZ0l5TWpJR2x1YVhSY2NseHVJQ0FqSUdsdWRHVnlibUZzSUcxbGRHaHZaQ0JtYjNJZ2IyNWxJSFJwYldVZ2FXNXBkR2xoYkdsNllYUnBiMjRnYjJZZ2RHaGxJSFJoWW14bFhISmNiaUFnYVc1cGRDQTlJRjh1YjI1alpTQXRQbHh5WEc0Z0lDQWdhV1lnWkdWbVlYVnNkSE11WkdGMFlWeHlYRzRnSUNBZ0lDQnFNblFnUFNCdVpYY2dTbk52YmxSdlZHRmliR1VnWkdWbVlYVnNkSE11WkdGMFlWeHlYRzRnSUNBZ0lDQjBZbXhUZEhJZ1BTQnFNblF1ZEdGaWJHVmNjbHh1SUNBZ0lHbG1JSFJpYkZOMGNseHlYRzRnSUNBZ0lDQnFWR0pzSUQwZ0pDQjBZbXhUZEhKY2NseHVYSEpjYmlBZ0lDQWdJR3BJWldGa0lEMGdhbFJpYkM1bWFXNWtJQ2QwYUdWaFpDZGNjbHh1SUNBZ0lDQWdjbVYwTGlRdVlYQndaVzVrSUdwSVpXRmtYSEpjYmlBZ0lDQWdJSFJvWldGa0lEMGdaV3d1Y21WemRHOXlaVVZzWlcxbGJuUWdha2hsWVdSYk1GMWNjbHh1SUNBZ0lDQWdkR2hsWVdSU2IzY2dQU0JsYkM1eVpYTjBiM0psUld4bGJXVnVkQ0IwYUdWaFpGc3dYUzV5YjNkeld6QmRYSEpjYmx4eVhHNGdJQ0FnSUNCcVFtOWtlU0E5SUdwVVltd3VabWx1WkNBbmRHSnZaSGtuWEhKY2JpQWdJQ0FnSUhKbGRDNGtMbUZ3Y0dWdVpDQnFRbTlrZVZ4eVhHNGdJQ0FnSUNCMFltOWtlU0E5SUdWc0xuSmxjM1J2Y21WRmJHVnRaVzUwSUdwQ2IyUjVXekJkWEhKY2JseHlYRzRnSUNBZ0lDQnNiMkZrUTJWc2JITW9LVnh5WEc0Z0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNCMGFHVmhaQ0E5SUhKbGRDNXRZV3RsSUNkMGFHVmhaQ2NzSUdSbFptRjFiSFJ6TG5Sb1pXRmtYSEpjYmlBZ0lDQWdJSFJvWldGa1VtOTNJRDBnZEdobFlXUXViV0ZyWlNBbmRISW5YSEpjYmlBZ0lDQWdJSFJpYjJSNUlEMGdjbVYwTG0xaGEyVWdKM1JpYjJSNUp5d2daR1ZtWVhWc2RITXVkR0p2WkhsY2NseHVJQ0FnSUNBZ2NtOTNjeTV3ZFhOb0lIUmliMlI1TG0xaGEyVWdKM1J5SjF4eVhHNGdJQ0FnY21WMFhISmNibHh5WEc0Z0lDTWdJeU1qSUd4dllXUkRaV3hzYzF4eVhHNGdJQ01nYVc1MFpYSnVZV3dnYldWMGFHOWtJR2QxWVhKaGJuUmxaWE1nZEdoaGRDQjBZV0pzWlhNZ2JHOWhaR1ZrSUdaeWIyMGdTbE5QVGlCaGNtVWdablZzYkhrZ2JHOWhaR1ZrSUdsdWRHOGdiV1Z0YjNKNVhISmNiaUFnYkc5aFpFTmxiR3h6SUQwZ0tDa2dMVDVjY2x4dUlDQWdJSElnUFNBd1hISmNiaUFnSUNCM2FHbHNaU0IwWW05a2VWc3dYUzV5YjNkekxteGxibWQwYUNBK0lISmNjbHh1SUNBZ0lDQWdZeUE5SURCY2NseHVJQ0FnSUNBZ2JXVnRVbTkzSUQwZ1pXd3VjbVZ6ZEc5eVpVVnNaVzFsYm5RZ2RHSnZaSGxiTUYwdWNtOTNjMXR5WFZ4eVhHNGdJQ0FnSUNCeWIzZHpMbkIxYzJnZ2JXVnRVbTkzWEhKY2JpQWdJQ0FnSUhkb2FXeGxJSFJpYjJSNVd6QmRMbkp2ZDNOYmNsMHVZMlZzYkhNdWJHVnVaM1JvSUQ0Z1kxeHlYRzRnSUNBZ0lDQWdJRzFsYlVObGJHd2dQU0JqWld4c2N5NW5aWFFnY2lzeExDQmpLekZjY2x4dUlDQWdJQ0FnSUNCcFppQnViM1FnYldWdFEyVnNiRnh5WEc0Z0lDQWdJQ0FnSUNBZ2JXVnRRMlZzYkNBOUlHVnNMbkpsYzNSdmNtVkZiR1Z0Wlc1MElIUmliMlI1V3pCZExuSnZkM05iY2wwdVkyVnNiSE5iWTExY2NseHVJQ0FnSUNBZ0lDQWdJR05sYkd4ekxuTmxkQ0J5S3pFc0lHTXJNU3dnYldWdFEyVnNiRnh5WEc0Z0lDQWdJQ0FnSUdNZ0t6MGdNVnh5WEc0Z0lDQWdJQ0J5SUNzOUlERmNjbHh1WEhKY2JpQWdJeUFqSXlNZ1ptbHNiRTFwYzNOcGJtZGNjbHh1SUNBaklHbHVkR1Z5Ym1Gc0lHMWxkR2h2WkNCbmRXRnlZVzUwWldWeklIUm9ZWFFnWTJWc2JITWdaWGhwYzNRZ1ptOXlJSFJvWlNCa2FXMWxibk5wYjI1eklHOW1JSFJvWlNCMFlXSnNaVnh5WEc0Z0lHWnBiR3hOYVhOemFXNW5JRDBnS0NrZ0xUNWNjbHh1SUNBZ0lHTmxiR3h6TG1WaFkyZ2dLSEp2ZDA1dkxDQmpiMnhPYnl3Z2RtRnNLU0F0UGx4eVhHNGdJQ0FnSUNCcFppQnViM1FnZG1Gc1hISmNiaUFnSUNBZ0lDQWdjbTkzSUQwZ2NtVjBMbkp2ZHlCeWIzZE9iMXh5WEc0Z0lDQWdJQ0FnSUhKdmR5NWpaV3hzSUdOdmJFNXZMQ0I3ZlZ4eVhHNWNjbHh1SUNBaklDTWpJR052YkhWdGJseHlYRzRnSUNNZ1FXUmtjeUJoSUdOdmJIVnRiaUJ1WVcxbElIUnZJSFJvWlNCMFlXSnNaU0JvWldGa1hISmNiaUFnY21WMExtRmtaQ0FuWTI5c2RXMXVKeXdnS0dOdmJFNXZMQ0JqYjJ4T1lXMWxLU0F0UGx4eVhHNGdJQ0FnY21WMExtbHVhWFFvS1Z4eVhHNGdJQ0FnWTI5c2RXMXVRMjkxYm5RZ0t6MGdNVnh5WEc0Z0lDQWdkR2dnUFNCdWRXeHNYSEpjYmlBZ0lDQnBJRDBnTUZ4eVhHNGdJQ0FnZDJocGJHVWdkR2hsWVdSYk1GMHVjbTkzYzFzd1hTNWpaV3hzY3k1c1pXNW5kR2dnUENCamIyeE9iMXh5WEc0Z0lDQWdJQ0J1WVhScGRtVlVhQ0E5SUhSb1pXRmtXekJkTG5KdmQzTmJNRjB1WTJWc2JITmJhVjFjY2x4dUlDQWdJQ0FnYVdZZ2JtOTBJRzVoZEdsMlpWUm9YSEpjYmlBZ0lDQWdJQ0FnZEdnZ1BTQjBhR1ZoWkZKdmR5NXRZV3RsSUNkMGFDY3NJSHQ5WEhKY2JpQWdJQ0FnSUdWc2MyVmNjbHh1SUNBZ0lDQWdJQ0IwYUNBOUlHVnNMbkpsYzNSdmNtVkZiR1Z0Wlc1MElHNWhkR2wyWlZSb0xDQW5kR2duWEhKY2JpQWdJQ0FnSUdrZ0t6MGdNVnh5WEc0Z0lDQWdhV1lnYm05MElIUm9YSEpjYmlBZ0lDQWdJRzVoZEdsMlpWUm9JRDBnZEdobFlXUmJNRjB1Y205M2Mxc3dYUzVqWld4c2MxdGpiMnhPYnkweFhWeHlYRzRnSUNBZ0lDQjBhQ0E5SUdWc0xuSmxjM1J2Y21WRmJHVnRaVzUwSUc1aGRHbDJaVlJvTENBbmRHZ25YSEpjYmlBZ0lDQjBhQzUwWlhoMElHTnZiRTVoYldWY2NseHVJQ0FnSUhSb1hISmNibHh5WEc0Z0lDTWdJeU1nY205M1hISmNiaUFnSXlCQlpHUnpJR0VnYm1WM0lISnZkeUFvZEhJcElIUnZJSFJvWlNCMFlXSnNaU0JpYjJSNVhISmNiaUFnY21WMExtRmtaQ0FuY205M0p5d2dLSEp2ZDA1dkxDQnZjSFJ6S1NBdFBseHlYRzRnSUNBZ2NtOTNJRDBnY205M2MxdHliM2RPYnkweFhWeHlYRzVjY2x4dUlDQWdJR2xtSUc1dmRDQnliM2RjY2x4dUlDQWdJQ0FnZDJocGJHVWdjbTkzY3k1c1pXNW5kR2dnUENCeWIzZE9iMXh5WEc0Z0lDQWdJQ0FnSUhKdmR5QTlJSFJpYjJSNUxtMWhhMlVnSjNSeUp5d2dlMzFjY2x4dUlDQWdJQ0FnSUNCeWIzZHpMbkIxYzJnZ2NtOTNYSEpjYmx4eVhHNGdJQ0FnYVdZZ2JtOTBJSEp2ZHk1alpXeHNYSEpjYmlBZ0lDQWdJSEp2ZHk1aFpHUWdKMk5sYkd3bkxDQW9ZMjlzVG04c0lHOXdkSE1wSUMwK1hISmNiaUFnSUNBZ0lDQWdZMlZzYkNBOUlFOUtMbTV2WkdWekxuUmtJRzl3ZEhNc0lISnZkMXh5WEc0Z0lDQWdJQ0FnSUdObGJHeHpMbk5sZENCeWIzZE9ieXdnWTI5c1RtOHNJR05sYkd4Y2NseHVJQ0FnSUNBZ0lDQmpaV3hzWEhKY2JseHlYRzRnSUNBZ2NtOTNYSEpjYmx4eVhHNGdJQ01nSXlNZ1kyVnNiRnh5WEc0Z0lDTWdRV1JrY3lCaElHTmxiR3dnS0hSeUwzUmtLU0IwYnlCMGFHVWdkR0ZpYkdVZ1ltOWtlVnh5WEc0Z0lISmxkQzVoWkdRZ0oyTmxiR3duTENBb2NtOTNUbThzSUdOdmJFNXZMQ0J2Y0hSektTQXRQbHh5WEc0Z0lDQWdhV1lnY205M1RtOGdQQ0F4SUhSb1pXNGdjbTkzVG04Z1BTQXhYSEpjYmlBZ0lDQnBaaUJqYjJ4T2J5QThJREVnZEdobGJpQmpiMnhPYnlBOUlERmNjbHh1SUNBZ0lHbG1JR052YkhWdGJrTnZkVzUwSUQ0Z01DQmhibVFnWTI5c1RtOHRNU0ErSUdOdmJIVnRia052ZFc1MElIUm9aVzRnZEdoeWIzY2dibVYzSUVWeWNtOXlJQ2RCSUdOdmJIVnRiaUJ1WVcxbElHaGhjeUJ1YjNRZ1ltVmxiaUJrWldacGJtVmtJR1p2Y2lCMGFHbHpJSEJ2YzJsMGFXOXVJSHNuSUNzZ2NtOTNUbThnS3lBbmVDY2dLeUJqYjJ4T2J5QXJJQ2Q5TGlkY2NseHVYSEpjYmlBZ0lDQnliM2NnUFNCeVpYUXVjbTkzSUhKdmQwNXZYSEpjYmx4eVhHNGdJQ0FnWTJWc2JDQTlJR05sYkd4ekxtZGxkQ0J5YjNkT2J5d2dZMjlzVG05Y2NseHVYSEpjYmlBZ0lDQnBaaUJ1YjNRZ1kyVnNiRnh5WEc0Z0lDQWdJQ0JwSUQwZ01GeHlYRzRnSUNBZ0lDQjNhR2xzWlNCcElEd2dZMjlzVG05Y2NseHVJQ0FnSUNBZ0lDQnBJQ3M5SURGY2NseHVJQ0FnSUNBZ0lDQnBaaUJwSUdseklHTnZiRTV2WEhKY2JpQWdJQ0FnSUNBZ0lDQnVkVTl3ZEhNZ1BTQlBTaTVsZUhSbGJtUWdlM0J5YjNCek9pQmtaV1poZFd4MGN5NWpaV3hzYzMwc0lHOXdkSE5jY2x4dUlDQWdJQ0FnSUNBZ0lHTmxiR3dnUFNCeWIzY3VZMlZzYkNCamIyeE9ieXdnYm5WUGNIUnpYSEpjYmlBZ0lDQWdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQWdJQ0FnZEhKNVEyVnNiQ0E5SUdObGJHeHpMbWRsZENCeWIzZE9ieXdnYVZ4eVhHNGdJQ0FnSUNBZ0lDQWdhV1lnYm05MElIUnllVU5sYkd4Y2NseHVJQ0FnSUNBZ0lDQWdJQ0FnZEhKNVEyVnNiQ0E5SUNCeWIzY3VZMlZzYkNCcExDQndjbTl3Y3pvZ1pHVm1ZWFZzZEhNdVkyVnNiSE5jY2x4dVhISmNiaUFnSUNCalpXeHNYSEpjYmx4eVhHNGdJQ01nSXlNZ1JtbHVZV3hwZW1WY2NseHVJQ0FqSUVacGJtRnNhWHBsSUdkMVlYSmhiblJsWlhNZ2RHaGhkQ0IwYUdWaFpDQmhibVFnZEdKdlpIa2dZVzVrSUdOeVpXRjBaV1FnZDJobGJpQjBhR1VnYm05a1pTQnBjeUJtZFd4c2VTQnBibk4wWVc1MGFXRjBaV1JjY2x4dUlDQnBibWwwS0NsY2NseHVYSEpjYmlBZ0l5QWpJeUJVU0dWaFpGeHlYRzRnSUNNZ1JYaHdiM05sSUhSb1pTQnBiblJsY201aGJDQjBhR1ZoWkNCdWIyUmxYSEpjYmlBZ2NtVjBMbUZrWkNBbmRHaGxZV1FuTENCMGFHVmhaRnh5WEc1Y2NseHVJQ0FqSUNNaklGUkNiMlI1WEhKY2JpQWdJeUJGZUhCdmMyVWdkR2hsSUdsdWRHVnlibUZzSUhSaWIyUjVJRzV2WkdWY2NseHVJQ0J5WlhRdVlXUmtJQ2QwWW05a2VTY3NJSFJpYjJSNVhISmNibHh5WEc0Z0lDQWdYSEpjYmx4eVhHNGdJSEpsZEZ4eVhHNWNjbHh1VDBvdWJtOWtaWE11Y21WbmFYTjBaWElnYm05a1pVNWhiV1VzSUc1dlpHVmNjbHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0J1YjJSbFhISmNiaUpkZlE9PSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5lbnVtcyA9IHJlcXVpcmUgJy4uL3Rvb2xzL2VudW1zJ1xyXG5cclxubm9kZU5hbWUgPSAndGV4dGFyZWEnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIG5hbWU6ICcnXHJcbiAgICAgIHBsYWNlaG9sZGVyOiAnJ1xyXG4gICAgICB2YWx1ZTogJydcclxuICAgICAgdGV4dDogJydcclxuICAgICAgbWF4bGVuZ3RoOiAnJ1xyXG4gICAgICBhdXRvZm9jdXM6IGZhbHNlXHJcbiAgICAgIGlzUmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIHJvd3M6IDNcclxuICAgICAgY29sczogMjVcclxuICAgICAgZGlzYWJsZWQ6IGZhbHNlXHJcbiAgICAgIHJlYWRvbmx5OiBmYWxzZVxyXG4gICAgICBmb3JtOiAnJ1xyXG4gICAgICB3cmFwOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgdmFsdWUgPSBkZWZhdWx0cy5wcm9wcy52YWx1ZVxyXG5cclxuICBzeW5jVmFsdWUgPSAtPlxyXG4gICAgc3dpdGNoIGRlZmF1bHRzLnByb3BzLnR5cGVcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLmNoZWNrYm94XHJcbiAgICAgICAgdmFsdWUgPSByZXQuJC5pcygnOmNoZWNrZWQnKVxyXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMucmFkaW9cclxuICAgICAgICB2YWx1ZSA9IHJldC4kLmZpbmQoJzpjaGVja2VkJykudmFsKClcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHZhbHVlID0gcmV0LnZhbCgpXHJcblxyXG4gICMgQ2xpY2sgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jbGljayBpc250IE9KLm5vb3BcclxuICAgIGNsaWNrID0gZGVmYXVsdHMuZXZlbnRzLmNsaWNrXHJcbiAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cclxuICAgICAgcmV0dmFsID0gY2xpY2sgZXZlbnQuLi5cclxuICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgcmV0dmFsXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSBuZXdDbGlja1xyXG5cclxuICAjIENoYW5nZSBiaW5kaW5nXHJcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSBpc250IE9KLm5vb3BcclxuICAgIGNoYW5nZSA9IGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2VcclxuICAgIG5ld0NoYW5nZSA9IChldmVudC4uLikgLT5cclxuICAgICAgcmV0dmFsID0gY2hhbmdlIGV2ZW50Li4uXHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIHJldHZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSA9IG5ld0NoYW5nZVxyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbm5vZGVOYW1lID0gJ3RoZWFkJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOiB7fVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG4gICAgbnVtYmVyOiAxXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuICByb3dzID0gW11cclxuICBjZWxscyA9IHt9XHJcbiAgcmV0LmFkZCAnY2VsbCcsIChyb3dObywgY29sTm8pIC0+XHJcbiAgICBpbml0KClcclxuXHJcbiAgICBpZiByb3dObyA8IDEgdGhlbiByb3dObyA9IDFcclxuICAgIGlmIGNvbE5vIDwgMSB0aGVuIGNvbE5vID0gMVxyXG5cclxuICAgIHJvdyA9IHJvd3Nbcm93Tm8tMV1cclxuXHJcbiAgICBpZiBub3Qgcm93XHJcbiAgICAgIHdoaWxlIHJvd3MubGVuZ3RoIDwgcm93Tm9cclxuICAgICAgICByb3cgPSBPSi5ub2Rlcy50ciB7fSwgdGJvZHksIGZhbHNlXHJcbiAgICAgICAgcm93cy5wdXNoIHJvd1xyXG5cclxuICAgIHRkID0gcm93WzBdLmNlbGxzW2NvbE5vXVxyXG5cclxuICAgIGlmIHRkIHRoZW4gY2VsbCA9IGVsLnJlc3RvcmVFbGVtZW50IHRkLCAndGQnXHJcbiAgICBpZiBub3QgdGRcclxuICAgICAgd2hpbGUgcm93WzBdLmNlbGxzLmxlbmd0aCA8IGNvbE5vXHJcbiAgICAgICAgaWR4ID0gcm93WzBdLmNlbGxzLmxlbmd0aFxyXG4gICAgICAgIHRkID0gcm93WzBdLmNlbGxzW2lkeC0xXVxyXG4gICAgICAgIGlmIHRkIGFuZCBpZHggaXMgY29sTm9cclxuICAgICAgICAgIGNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCB0ZCwgJ3RkJ1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIGNlbGwgPSBPSi5ub2Rlcy50ZCBwcm9wczogZGVmYXVsdHMuY2VsbHMsIHJvdywgZmFsc2VcclxuXHJcbiAgICBpZiBub3QgY2VsbC5pc1ZhbGlkXHJcbiAgICAgIG5vZGVGYWN0b3J5IGNlbGwsIHJvdywgcm93Tm8gKyBjb2xOb1xyXG5cclxuICAgIGNlbGxcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG5ub2RlTmFtZSA9ICd1bCdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczoge31cclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIHRoaXNHbG9iYWw7XG5cbnRoaXNHbG9iYWwgPSAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsID8gZ2xvYmFsIDogKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmID8gc2VsZiA6ICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cgPyB3aW5kb3cgOiB0aGlzKSkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXNHbG9iYWw7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4bmJHOWlZV3d1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVN4SlFVRkJPenRCUVVGQkxGVkJRVUVzUjBGQllTeERRVUZMTEU5QlFVOHNUVUZCVUN4TFFVRnRRaXhYUVVGdVFpeEpRVUZ0UXl4TlFVRjJReXhIUVVGdlJDeE5RVUZ3UkN4SFFVRm5SU3hEUVVGTExFOUJRVThzU1VGQlVDeExRVUZwUWl4WFFVRnFRaXhKUVVGcFF5eEpRVUZ5UXl4SFFVRm5SQ3hKUVVGb1JDeEhRVUV3UkN4RFFVRkxMRTlCUVU4c1RVRkJVQ3hMUVVGdFFpeFhRVUZ1UWl4SlFVRnRReXhOUVVGMlF5eEhRVUZ2UkN4TlFVRndSQ3hIUVVGblJTeEpRVUZxUlN4RFFVRXpSQ3hEUVVGcVJUczdRVUZEWWl4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpZEdocGMwZHNiMkpoYkNBOUlDaHBaaUFvZEhsd1pXOW1JR2RzYjJKaGJDQnBjMjUwSUNkMWJtUmxabWx1WldRbklHRnVaQ0JuYkc5aVlXd3BJSFJvWlc0Z1oyeHZZbUZzSUdWc2MyVWdLR2xtSUNoMGVYQmxiMllnYzJWc1ppQnBjMjUwSUNkMWJtUmxabWx1WldRbklHRnVaQ0J6Wld4bUtTQjBhR1Z1SUhObGJHWWdaV3h6WlNBb2FXWWdLSFI1Y0dWdlppQjNhVzVrYjNjZ2FYTnVkQ0FuZFc1a1pXWnBibVZrSnlCaGJtUWdkMmx1Wkc5M0tTQjBhR1Z1SUhkcGJtUnZkeUJsYkhObElIUm9hWE1wS1NsY2NseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQjBhR2x6UjJ4dlltRnNJbDE5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ2J1dHRvbmlucHV0J1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiAnYnV0dG9uJ1xyXG4gICAgICBzcmM6ICcnXHJcbiAgICAgIGFsdDogJydcclxuICAgICAgaGVpZ2h0OiAnJ1xyXG4gICAgICB3aWR0aDogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcblxyXG5cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ2NoZWNrYm94J1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIGNoZWNrZWQ6IGZhbHNlXHJcbiAgICBpbmRldGVybWluYXRlOiBmYWxzZVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBvYmouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIGlmIGRlZmF1bHRzLmNoZWNrZWRcclxuICAgIHJldC5hdHRyICdjaGVja2VkJywgdHJ1ZVxyXG4gIGVsc2UgaWYgZGVmYXVsdHMuaW5kZXRlcm1pbmF0ZVxyXG4gICAgcmV0LmF0dHIgJ2luZGV0ZXJtaW5hdGUnLCB0cnVlXHJcblxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnY29sb3InXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBvYmouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnZGF0ZSdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnZGF0ZXRpbWUnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdkYXRldGltZS1sb2NhbCdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ2VtYWlsJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgbXVsdGlwbGU6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ2ZpbGUnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBhY2NlcHQ6ICcnXHJcbiAgICAgIG11bHRpcGxlOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdoaWRkZW4nXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdpbWFnZWlucHV0J1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiAnaW1hZ2UnXHJcbiAgICAgIHNyYzogJydcclxuICAgICAgYWx0OiAnJ1xyXG4gICAgICBoZWlnaHQ6ICcnXHJcbiAgICAgIHdpZHRoOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdtb250aCdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ251bWJlcidcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3Bhc3N3b3JkJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgbWF4bGVuZ3RoOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdyYWRpbydcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIG5hbWU6ICcnXHJcbiAgICAgIHZhbHVlOiAnJ1xyXG4gICAgICBjaGVja2VkOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdyYW5nZSdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIG1pbjogMFxyXG4gICAgICBtYXg6IDEwMFxyXG4gICAgICB2YWx1ZTogNTBcclxuICAgICAgc3RlcDogMVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdyZXNldCdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3NlYXJjaCdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3N1Ym1pdCdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3RlbCdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIHBhdHRlcm46ICcnXHJcbiAgICAgIG1heGxlbmd0aDogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAndGV4dGlucHV0J1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiAndGV4dCdcclxuICAgICAgYXV0b2NvbXBsZXRlOiAnb24nXHJcbiAgICAgIGF1dG9zYXZlOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICd0aW1lJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAndXJsJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgcGF0dGVybjogJydcclxuICAgICAgbWF4bGVuZ3RoOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICd3ZWVrJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE5zVHJlZSwgbWFrZVRoZUp1aWNlLCBuYW1lU3BhY2VOYW1lLCB0aGlzRG9jdW1lbnQsIHRoaXNHbG9iYWwsIHV0aWxMaWI7XG5cbnRoaXNHbG9iYWwgPSByZXF1aXJlKCcuL2dsb2JhbCcpO1xuXG51dGlsTGliID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuXG5uYW1lU3BhY2VOYW1lID0gJ09KJztcblxuXG4vKlxuYm9vdCBzdHJhcCBuYW1lIG1ldGhvZCBpbnRvIE9iamVjdCBwcm90b3R5cGVcbiAqL1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhPYmplY3QucHJvdG90eXBlLCB7XG4gIGdldEluc3RhbmNlTmFtZToge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBmdW5jTmFtZVJlZ2V4LCByZXN1bHRzO1xuICAgICAgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLnsxLH0pXFwoLztcbiAgICAgIHJlc3VsdHMgPSBmdW5jTmFtZVJlZ2V4LmV4ZWModGhpcy5jb25zdHJ1Y3Rvci50b1N0cmluZygpKTtcbiAgICAgIGlmIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0c1sxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5cbi8qXG5BbiBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgbmFtZXNwYWNlIHRyZWVcbiAqL1xuXG5Oc1RyZWUgPSB7fTtcblxubWFrZVRoZUp1aWNlID0gZnVuY3Rpb24oKSB7XG5cbiAgLypcbiAgSW50ZXJuYWwgbmFtZVNwYWNlTmFtZSBtZXRob2QgdG8gY3JlYXRlIG5ldyAnc3ViJyBuYW1lc3BhY2VzIG9uIGFyYml0cmFyeSBjaGlsZCBvYmplY3RzLlxuICAgKi9cbiAgdmFyIE5zT3V0LCBkZXBlbmRzT24sIG1ha2VOYW1lU3BhY2UsIG5zSW50ZXJuYWw7XG4gIG1ha2VOYW1lU3BhY2UgPSBmdW5jdGlvbihzcGFjZW5hbWUsIHRyZWUpIHtcblxuICAgIC8qXG4gICAgVGhlIGRlcml2ZWQgaW5zdGFuY2UgdG8gYmUgY29uc3RydWN0ZWRcbiAgICAgKi9cbiAgICB2YXIgQmFzZSwgQ2xhc3M7XG4gICAgQmFzZSA9IGZ1bmN0aW9uKG5zTmFtZSkge1xuICAgICAgdmFyIG1lbWJlcnMsIG5zVHJlZSwgcHJvdG87XG4gICAgICBwcm90byA9IHRoaXM7XG4gICAgICB0cmVlW25zTmFtZV0gPSB0cmVlW25zTmFtZV0gfHwge307XG4gICAgICBuc1RyZWUgPSB0cmVlW25zTmFtZV07XG4gICAgICBtZW1iZXJzID0ge307XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ21lbWJlcnMnLCB7XG4gICAgICAgIHZhbHVlOiBtZW1iZXJzXG5cbiAgICAgICAgLypcbiAgICAgICAgUmVnaXN0ZXIgKGUuZy4gJ0xpZnQnKSBhbiBPYmplY3QgaW50byB0aGUgcHJvdG90eXBlIG9mIHRoZSBuYW1lc3BhY2UuXG4gICAgICAgIFRoaXMgT2JqZWN0IHdpbGwgYmUgcmVhZGFibGUvZXhlY3V0YWJsZSBidXQgaXMgb3RoZXJ3aXNlIGltbXV0YWJsZS5cbiAgICAgICAgICovXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAncmVnaXN0ZXInLCB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbihuYW1lLCBvYmosIGVudW1lcmFibGUpIHtcbiAgICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgICAgaWYgKCh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHx8IG5hbWUgPT09ICcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsaWZ0IGEgbmV3IHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIW9iaikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbGlmdCBhIG5ldyBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgcHJvcGVydHkgaW5zdGFuY2UuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChwcm90b1tuYW1lXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9wZXJ0eSBuYW1lZCAnICsgbmFtZSArICcgaXMgYWxyZWFkeSBkZWZpbmVkIG9uICcgKyBzcGFjZW5hbWUgKyAnLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtZW1iZXJzW25hbWVdID0gbWVtYmVyc1tuYW1lXSB8fCBuYW1lO1xuICAgICAgICAgIG5zVHJlZVtuYW1lXSA9IG5zVHJlZVtuYW1lXSB8fCB7XG4gICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgdHlwZTogdHlwZW9mIG9iaixcbiAgICAgICAgICAgIGluc3RhbmNlOiAob2JqLmdldEluc3RhbmNlTmFtZSA/IG9iai5nZXRJbnN0YW5jZU5hbWUoKSA6ICd1bmtub3duJylcbiAgICAgICAgICB9O1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90bywgbmFtZSwge1xuICAgICAgICAgICAgdmFsdWU6IG9iaixcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlICE9PSBlbnVtZXJhYmxlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbnNJbnRlcm5hbC5hbGVydERlcGVuZGVudHMobnNOYW1lICsgJy4nICsgc3BhY2VuYW1lICsgJy4nICsgbmFtZSk7XG4gICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8qXG4gICAgICBDcmVhdGUgYSBuZXcsIHN0YXRpYyBuYW1lc3BhY2Ugb24gdGhlIGN1cnJlbnQgcGFyZW50IChlLmcuIG5zTmFtZS50by4uLiB8fCBuc05hbWUuaXMuLi4pXG4gICAgICAgKi9cbiAgICAgIHByb3RvLnJlZ2lzdGVyKCdtYWtlU3ViTmFtZVNwYWNlJywgKGZ1bmN0aW9uKHN1Yk5hbWVTcGFjZSkge1xuICAgICAgICAndXNlIHN0cmljdCc7XG4gICAgICAgIHZhciBuZXdOYW1lU3BhY2U7XG4gICAgICAgIGlmICgodHlwZW9mIHN1Yk5hbWVTcGFjZSAhPT0gJ3N0cmluZycpIHx8IHN1Yk5hbWVTcGFjZSA9PT0gJycpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgYSBuZXcgc3ViIG5hbWVzcGFjZSB3aXRob3V0IGEgdmFsaWQgbmFtZS4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvdG8uc3ViTmFtZVNwYWNlKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdWIgbmFtZXNwYWNlIG5hbWVkICcgKyBzdWJOYW1lU3BhY2UgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKTtcbiAgICAgICAgfVxuICAgICAgICBuc0ludGVybmFsLmFsZXJ0RGVwZW5kZW50cyhuc05hbWUgKyAnLicgKyBzdWJOYW1lU3BhY2UpO1xuICAgICAgICBuZXdOYW1lU3BhY2UgPSBtYWtlTmFtZVNwYWNlKHN1Yk5hbWVTcGFjZSwgbnNUcmVlKTtcbiAgICAgICAgaWYgKHN1Yk5hbWVTcGFjZSAhPT0gJ2NvbnN0YW50cycpIHtcbiAgICAgICAgICBuZXdOYW1lU3BhY2UucmVnaXN0ZXIoJ2NvbnN0YW50cycsIG1ha2VOYW1lU3BhY2UoJ2NvbnN0YW50cycsIG5zVHJlZSksIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBwcm90by5yZWdpc3RlcihzdWJOYW1lU3BhY2UsIG5ld05hbWVTcGFjZSwgZmFsc2UpO1xuICAgICAgICByZXR1cm4gbmV3TmFtZVNwYWNlO1xuICAgICAgfSksIGZhbHNlKTtcbiAgICB9O1xuXG4gICAgLypcbiAgICBBbiBpbnRlcm5hbCBtZWNoYW5pc20gdG8gcmVwcmVzZW50IHRoZSBpbnN0YW5jZSBvZiB0aGlzIG5hbWVzcGFjZVxuICAgIEBjb25zdHJ1Y3RvclxuICAgIEBpbnRlcm5hbFxuICAgIEBtZW1iZXJPZiBtYWtlTmFtZVNwYWNlXG4gICAgICovXG4gICAgQ2xhc3MgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiBmdW5jdGlvbiAnICsgc3BhY2VuYW1lICsgJygpe30nKSgpO1xuICAgIENsYXNzLnByb3RvdHlwZSA9IG5ldyBCYXNlKHNwYWNlbmFtZSk7XG4gICAgcmV0dXJuIG5ldyBDbGFzcyhzcGFjZW5hbWUpO1xuICB9O1xuXG4gIC8qXG4gICdEZXBlbmQnIGFuIE9iamVjdCB1cG9uIGFub3RoZXIgbWVtYmVyIG9mIHRoaXMgbmFtZXNwYWNlLCB1cG9uIGFub3RoZXIgbmFtZXNwYWNlLFxuICBvciB1cG9uIGEgbWVtYmVyIG9mIGFub3RoZXIgbmFtZXNwYWNlXG4gICAqL1xuICBkZXBlbmRzT24gPSBmdW5jdGlvbihkZXBlbmRlbmNpZXMsIGNhbGxCYWNrLCBpbXBvcnRzKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBtaXNzaW5nLCBuc01lbWJlcnMsIHJldDtcbiAgICByZXQgPSBmYWxzZTtcbiAgICBuc01lbWJlcnMgPSBuc0ludGVybmFsLmdldE5zTWVtYmVycygpO1xuICAgIGlmIChkZXBlbmRlbmNpZXMgJiYgZGVwZW5kZW5jaWVzLmxlbmd0aCA+IDAgJiYgY2FsbEJhY2spIHtcbiAgICAgIG1pc3NpbmcgPSBkZXBlbmRlbmNpZXMuZmlsdGVyKGZ1bmN0aW9uKGRlcGVuKSB7XG4gICAgICAgIHJldHVybiBuc01lbWJlcnMuaW5kZXhPZihkZXBlbikgPT09IC0xICYmICghaW1wb3J0cyB8fCBpbXBvcnRzICE9PSBkZXBlbik7XG4gICAgICB9KTtcbiAgICAgIGlmIChtaXNzaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICBjYWxsQmFjaygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbnNJbnRlcm5hbC5kZXBlbmRlbnRzLnB1c2goZnVuY3Rpb24oaW1wb3J0cykge1xuICAgICAgICAgIHJldHVybiBkZXBlbmRzT24obWlzc2luZywgY2FsbEJhY2ssIGltcG9ydHMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcbiAgbnNJbnRlcm5hbCA9IHtcbiAgICBkZXBlbmRlbnRzOiBbXVxuXG4gICAgLypcbiAgICBGZXRjaGVzIHRoZSByZWdpc3RlcmVkIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgb24gdGhlIG5hbWVzcGFjZSBhbmQgaXRzIGNoaWxkIG5hbWVzcGFjZXNcbiAgICAgKi9cbiAgfTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5zSW50ZXJuYWwsICdnZXROc01lbWJlcnMnLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG1lbWJlcnMsIHJlY3Vyc2VUcmVlO1xuICAgICAgcmVjdXJzZVRyZWUgPSBmdW5jdGlvbihrZXksIGxhc3RLZXkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBrZXkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgbWVtYmVycy5wdXNoKGxhc3RLZXkgKyAnLicgKyBrZXkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh1dGlsTGliLmlzUGxhaW5PYmplY3Qoa2V5KSkge1xuICAgICAgICAgIE9iamVjdC5rZXlzKGtleSkuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGsgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgIG1lbWJlcnMucHVzaChsYXN0S2V5ICsgJy4nICsgayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodXRpbExpYi5pc1BsYWluT2JqZWN0KGtleVtrXSkpIHtcbiAgICAgICAgICAgICAgcmVjdXJzZVRyZWUoa2V5W2tdLCBsYXN0S2V5ICsgJy4nICsgayk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBtZW1iZXJzID0gW107XG4gICAgICBPYmplY3Qua2V5cyhOc1RyZWVbbmFtZVNwYWNlTmFtZV0pLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmICh1dGlsTGliLmlzUGxhaW5PYmplY3QoTnNUcmVlW25hbWVTcGFjZU5hbWVdW2tleV0pKSB7XG4gICAgICAgICAgcmVjdXJzZVRyZWUoTnNUcmVlW25hbWVTcGFjZU5hbWVdW2tleV0sIG5hbWVTcGFjZU5hbWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBtZW1iZXJzO1xuICAgIH1cbiAgfSk7XG5cbiAgLypcbiAgVG8gc3VwcG9ydCBkZXBlbmRlbmN5IG1hbmFnZW1lbnQsIHdoZW4gYSBwcm9wZXJ0eSBpcyBsaWZ0ZWQgb250byB0aGUgbmFtZXNwYWNlLCBub3RpZnkgZGVwZW5kZW50cyB0byBpbml0aWFsaXplXG4gICAqL1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobnNJbnRlcm5hbCwgJ2FsZXJ0RGVwZW5kZW50cycsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oaW1wb3J0cykge1xuICAgICAgdmFyIGRlcHM7XG4gICAgICBkZXBzID0gbnNJbnRlcm5hbC5kZXBlbmRlbnRzLmZpbHRlcihmdW5jdGlvbihkZXBPbikge1xuICAgICAgICByZXR1cm4gZmFsc2UgPT09IGRlcE9uKGltcG9ydHMpO1xuICAgICAgfSk7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShkZXBzKSkge1xuICAgICAgICByZXR1cm4gbnNJbnRlcm5hbC5kZXBlbmRlbnRzID0gZGVwcztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBOc1RyZWVbbmFtZVNwYWNlTmFtZV0gPSB7fTtcbiAgTnNPdXQgPSBtYWtlTmFtZVNwYWNlKG5hbWVTcGFjZU5hbWUsIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSk7XG5cbiAgLypcbiAgQ2FjaGUgYSBoYW5kbGUgb24gdGhlIHZlbmRvciAocHJvYmFibHkgalF1ZXJ5KSBvbiB0aGUgcm9vdCBuYW1lc3BhY2VcbiAgICovXG4gIE5zT3V0LnJlZ2lzdGVyKCc/JywgdXRpbExpYiwgZmFsc2UpO1xuXG4gIC8qXG4gIENhY2hlIHRoZSB0cmVlICh1c2VmdWwgZm9yIGRvY3VtZW50YXRpb24vdmlzdWFsaXphdGlvbi9kZWJ1Z2dpbmcpXG4gICAqL1xuICBOc091dC5yZWdpc3RlcigndHJlZScsIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSwgZmFsc2UpO1xuXG4gIC8qXG4gIENhY2hlIHRoZSBuYW1lIHNwYWNlIG5hbWVcbiAgICovXG4gIE5zT3V0LnJlZ2lzdGVyKCduYW1lJywgbmFtZVNwYWNlTmFtZSwgZmFsc2UpO1xuICBOc091dC5yZWdpc3RlcignZGVwZW5kc09uJywgZGVwZW5kc09uLCBmYWxzZSk7XG4gIHJldHVybiBOc091dDtcbn07XG5cblxuLypcbkFjdHVhbGx5IGRlZmluZSB0aGUgT0ogTmFtZVNwYWNlXG4gKi9cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXNHbG9iYWwsIG5hbWVTcGFjZU5hbWUsIHtcbiAgdmFsdWU6IG1ha2VUaGVKdWljZSgpXG59KTtcblxuT0oucmVnaXN0ZXIoJ2dsb2JhbCcsIHRoaXNHbG9iYWwpO1xuXG50aGlzRG9jdW1lbnQgPSB7fTtcblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgdGhpc0RvY3VtZW50ID0gZG9jdW1lbnQ7XG59XG5cbk9KLnJlZ2lzdGVyKCdkb2N1bWVudCcsIHRoaXNEb2N1bWVudCk7XG5cbk9KLnJlZ2lzdGVyKCdub29wJywgZnVuY3Rpb24oKSB7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0gT0o7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4dmFpNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWp0QlFVTkJMRWxCUVVFN08wRkJRVUVzVlVGQlFTeEhRVUZoTEU5QlFVRXNRMEZCVVN4VlFVRlNPenRCUVVOaUxFOUJRVUVzUjBGQlZTeFBRVUZCTEVOQlFWRXNVVUZCVWpzN1FVRkRWaXhoUVVGQkxFZEJRV2RDT3pzN1FVRkZhRUk3T3pzN1FVRkhRU3hOUVVGTkxFTkJRVU1zWjBKQlFWQXNRMEZCZDBJc1RVRkJUU3hEUVVGQkxGTkJRVGxDTEVWQlEwVTdSVUZCUVN4bFFVRkJMRVZCUTBVN1NVRkJRU3hMUVVGQkxFVkJRVThzVTBGQlFUdEJRVU5NTEZWQlFVRTdUVUZCUVN4aFFVRkJMRWRCUVdkQ08wMUJRMmhDTEU5QlFVRXNSMEZCVnl4aFFVRmpMRU5CUVVNc1NVRkJhRUlzUTBGQmNVSXNTVUZCUXl4RFFVRkJMRmRCUVZjc1EwRkJReXhSUVVGaUxFTkJRVUVzUTBGQmNrSTdUVUZEVkN4SlFVRkpMRTlCUVVFc1NVRkJXU3hQUVVGUExFTkJRVU1zVFVGQlVpeEhRVUZwUWl4RFFVRnFRenRsUVVGNVF5eFBRVUZSTEVOQlFVRXNRMEZCUVN4RlFVRnFSRHRQUVVGQkxFMUJRVUU3WlVGQmVVUXNSMEZCZWtRN08wbEJTRWtzUTBGQlVEdEhRVVJHTzBOQlJFWTdPenRCUVZGQk96czdPMEZCUjBFc1RVRkJRU3hIUVVGVE96dEJRVU5VTEZsQlFVRXNSMEZCWlN4VFFVRkJPenRCUVVWaU96czdRVUZCUVN4TlFVRkJPMFZCUjBFc1lVRkJRU3hIUVVGblFpeFRRVUZETEZOQlFVUXNSVUZCV1N4SlFVRmFPenRCUVVOa096czdRVUZCUVN4UlFVRkJPMGxCUjBFc1NVRkJRU3hIUVVGUExGTkJRVU1zVFVGQlJEdEJRVU5NTEZWQlFVRTdUVUZCUVN4TFFVRkJMRWRCUVZFN1RVRkRVaXhKUVVGTExFTkJRVUVzVFVGQlFTeERRVUZNTEVkQlFXVXNTVUZCU3l4RFFVRkJMRTFCUVVFc1EwRkJUQ3hKUVVGblFqdE5RVU12UWl4TlFVRkJMRWRCUVZNc1NVRkJTeXhEUVVGQkxFMUJRVUU3VFVGRFpDeFBRVUZCTEVkQlFWVTdUVUZGVml4TlFVRk5MRU5CUVVNc1kwRkJVQ3hEUVVGelFpeEpRVUYwUWl4RlFVRTBRaXhUUVVFMVFpeEZRVUYxUXp0UlFVRkJMRXRCUVVFc1JVRkJUenM3UVVGRk9VTTdPenRYUVVaMVF6dFBRVUYyUXp0TlFVMUJMRTFCUVUwc1EwRkJReXhqUVVGUUxFTkJRWE5DTEVsQlFYUkNMRVZCUVRSQ0xGVkJRVFZDTEVWQlEwVTdVVUZCUVN4TFFVRkJMRVZCUVU4c1UwRkJReXhKUVVGRUxFVkJRVThzUjBGQlVDeEZRVUZaTEZWQlFWbzdWVUZEVER0VlFVTkJMRWxCUVhkRkxFTkJRVU1zVDBGQlR5eEpRVUZRTEV0QlFXbENMRkZCUVd4Q0xFTkJRVUVzU1VGQkswSXNTVUZCUVN4TFFVRlJMRVZCUVM5SE8wRkJRVUVzYTBKQlFWVXNTVUZCUVN4TFFVRkJMRU5CUVUwc2EwUkJRVTRzUlVGQlZqczdWVUZEUVN4SlFVRkJMRU5CUVhsR0xFZEJRWHBHTzBGQlFVRXNhMEpCUVZVc1NVRkJRU3hMUVVGQkxFTkJRVTBzSzBSQlFVNHNSVUZCVmpzN1ZVRkRRU3hKUVVFMFJpeExRVUZOTEVOQlFVRXNTVUZCUVN4RFFVRnNSenRCUVVGQkxHdENRVUZWTEVsQlFVRXNTMEZCUVN4RFFVRk5MR2xDUVVGQkxFZEJRVzlDTEVsQlFYQkNMRWRCUVRKQ0xIbENRVUV6UWl4SFFVRjFSQ3hUUVVGMlJDeEhRVUZ0UlN4SFFVRjZSU3hGUVVGV096dFZRVVZCTEU5QlFWRXNRMEZCUVN4SlFVRkJMRU5CUVZJc1IwRkJaMElzVDBGQlVTeERRVUZCTEVsQlFVRXNRMEZCVWl4SlFVRnBRanRWUVVkcVF5eE5RVUZQTEVOQlFVRXNTVUZCUVN4RFFVRlFMRWRCUVdVc1RVRkJUeXhEUVVGQkxFbEJRVUVzUTBGQlVDeEpRVU5pTzFsQlFVRXNTVUZCUVN4RlFVRk5MRWxCUVU0N1dVRkRRU3hKUVVGQkxFVkJRVTBzVDBGQlR5eEhRVVJpTzFsQlJVRXNVVUZCUVN4RlFVRlZMRU5CUVVrc1IwRkJSeXhEUVVGRExHVkJRVkFzUjBGQk5FSXNSMEZCUnl4RFFVRkRMR1ZCUVVvc1EwRkJRU3hEUVVFMVFpeEhRVUYxUkN4VFFVRjRSQ3hEUVVaV096dFZRVWxHTEUxQlFVMHNRMEZCUXl4alFVRlFMRU5CUVhOQ0xFdEJRWFJDTEVWQlFUWkNMRWxCUVRkQ0xFVkJRMFU3V1VGQlFTeExRVUZCTEVWQlFVOHNSMEZCVUR0WlFVTkJMRlZCUVVFc1JVRkJXU3hMUVVGQkxFdEJRVmNzVlVGRWRrSTdWMEZFUmp0VlFVbEJMRlZCUVZVc1EwRkJReXhsUVVGWUxFTkJRVEpDTEUxQlFVRXNSMEZCVXl4SFFVRlVMRWRCUVdVc1UwRkJaaXhIUVVFeVFpeEhRVUV6UWl4SFFVRnBReXhKUVVFMVJEdHBRa0ZEUVR0UlFXNUNTeXhEUVVGUU8wOUJSRVk3TzBGQmRVSkJPenM3VFVGSFFTeExRVUZMTEVOQlFVTXNVVUZCVGl4RFFVRmxMR3RDUVVGbUxFVkJRVzFETEVOQlFVTXNVMEZCUXl4WlFVRkVPMUZCUTJ4RE8wRkJRVUVzV1VGQlFUdFJRVU5CTEVsQlFTdEZMRU5CUVVNc1QwRkJUeXhaUVVGUUxFdEJRWGxDTEZGQlFURkNMRU5CUVVFc1NVRkJkVU1zV1VGQlFTeExRVUZuUWl4RlFVRjBTVHRCUVVGQkxHZENRVUZWTEVsQlFVRXNTMEZCUVN4RFFVRk5MSGxFUVVGT0xFVkJRVlk3TzFGQlEwRXNTVUZCZVVjc1MwRkJTeXhEUVVGRExGbEJRUzlITzBGQlFVRXNaMEpCUVZVc1NVRkJRU3hMUVVGQkxFTkJRVTBzYzBKQlFVRXNSMEZCZVVJc1dVRkJla0lzUjBGQmQwTXNlVUpCUVhoRExFZEJRVzlGTEZOQlFYQkZMRWRCUVdkR0xFZEJRWFJHTEVWQlFWWTdPMUZCUTBFc1ZVRkJWU3hEUVVGRExHVkJRVmdzUTBGQk1rSXNUVUZCUVN4SFFVRlRMRWRCUVZRc1IwRkJaU3haUVVFeFF6dFJRVU5CTEZsQlFVRXNSMEZCWlN4aFFVRkJMRU5CUVdNc1dVRkJaQ3hGUVVFMFFpeE5RVUUxUWp0UlFVTm1MRWxCUVdsR0xGbEJRVUVzUzBGQmEwSXNWMEZCYmtjN1ZVRkJRU3haUVVGWkxFTkJRVU1zVVVGQllpeERRVUZ6UWl4WFFVRjBRaXhGUVVGdFF5eGhRVUZCTEVOQlFXTXNWMEZCWkN4RlFVRXlRaXhOUVVFelFpeERRVUZ1UXl4RlFVRjFSU3hMUVVGMlJTeEZRVUZCT3p0UlFVTkJMRXRCUVVzc1EwRkJReXhSUVVGT0xFTkJRV1VzV1VGQlppeEZRVUUyUWl4WlFVRTNRaXhGUVVFeVF5eExRVUV6UXp0bFFVTkJPMDFCVW10RExFTkJRVVFzUTBGQmJrTXNSVUZUUnl4TFFWUklPMGxCZEVOTE96dEJRV3RFVURzN096czdPMGxCVFVFc1MwRkJRU3hIUVVGWkxFbEJRVUVzVVVGQlFTeERRVUZUTEd0Q1FVRkJMRWRCUVhGQ0xGTkJRWEpDTEVkQlFXbERMRTFCUVRGRExFTkJRVUVzUTBGQlFUdEpRVU5hTEV0QlFVc3NRMEZCUVN4VFFVRk1MRWRCUVdNc1NVRkJRU3hKUVVGQkxFTkJRVXNzVTBGQlREdFhRVWRXTEVsQlFVRXNTMEZCUVN4RFFVRk5MRk5CUVU0N1JVRm9SVlU3TzBGQmEwVm9RanM3T3p0RlFVbEJMRk5CUVVFc1IwRkJXU3hUUVVGRExGbEJRVVFzUlVGQlpTeFJRVUZtTEVWQlFYbENMRTlCUVhwQ08wbEJRMVk3UVVGQlFTeFJRVUZCTzBsQlEwRXNSMEZCUVN4SFFVRk5PMGxCUTA0c1UwRkJRU3hIUVVGWkxGVkJRVlVzUTBGQlF5eFpRVUZZTEVOQlFVRTdTVUZEV2l4SlFVRkhMRmxCUVVFc1NVRkJhVUlzV1VGQldTeERRVUZETEUxQlFXSXNSMEZCYzBJc1EwRkJka01zU1VGQk5rTXNVVUZCYUVRN1RVRkRSU3hQUVVGQkxFZEJRVlVzV1VGQldTeERRVUZETEUxQlFXSXNRMEZCYjBJc1UwRkJReXhMUVVGRU8yVkJRelZDTEZOQlFWTXNRMEZCUXl4UFFVRldMRU5CUVd0Q0xFdEJRV3hDTEVOQlFVRXNTMEZCTkVJc1EwRkJReXhEUVVFM1FpeEpRVUZ0UXl4RFFVRkRMRU5CUVVrc1QwRkJTaXhKUVVGbExFOUJRVUVzUzBGQllTeExRVUUzUWp0TlFVUlFMRU5CUVhCQ08wMUJSMVlzU1VGQlJ5eFBRVUZQTEVOQlFVTXNUVUZCVWl4TFFVRnJRaXhEUVVGeVFqdFJRVU5GTEVkQlFVRXNSMEZCVFR0UlFVTk9MRkZCUVVFc1EwRkJRU3hGUVVaR08wOUJRVUVzVFVGQlFUdFJRVWxGTEZWQlFWVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJkRUlzUTBGQk1rSXNVMEZCUXl4UFFVRkVPMmxDUVVONlFpeFRRVUZCTEVOQlFWVXNUMEZCVml4RlFVRnRRaXhSUVVGdVFpeEZRVUUyUWl4UFFVRTNRanRSUVVSNVFpeERRVUV6UWl4RlFVcEdPMDlCU2tZN08xZEJWMEU3UlVGbVZUdEZRV2RDV2l4VlFVRkJMRWRCUVdFN1NVRkJRU3hWUVVGQkxFVkJRVms3TzBGQlJYcENPenRQUVVaaE96dEZRVXRpTEUxQlFVMHNRMEZCUXl4alFVRlFMRU5CUVhOQ0xGVkJRWFJDTEVWQlFXdERMR05CUVd4RExFVkJRMFU3U1VGQlFTeExRVUZCTEVWQlFVOHNVMEZCUVR0QlFVTk1MRlZCUVVFN1RVRkJRU3hYUVVGQkxFZEJRV01zVTBGQlF5eEhRVUZFTEVWQlFVMHNUMEZCVGp0UlFVTmFMRWxCUVhGRExFOUJRVkVzUjBGQlVpeExRVUZuUWl4UlFVRnlSRHRWUVVGQkxFOUJRVThzUTBGQlF5eEpRVUZTTEVOQlFXRXNUMEZCUVN4SFFVRlZMRWRCUVZZc1IwRkJaMElzUjBGQk4wSXNSVUZCUVRzN1VVRkRRU3hKUVVGSExFOUJRVThzUTBGQlF5eGhRVUZTTEVOQlFYTkNMRWRCUVhSQ0xFTkJRVWc3VlVGRFJTeE5RVUZOTEVOQlFVTXNTVUZCVUN4RFFVRlpMRWRCUVZvc1EwRkJaMElzUTBGQlF5eFBRVUZxUWl4RFFVRjVRaXhUUVVGRExFTkJRVVE3V1VGRGRrSXNTVUZCYlVNc1QwRkJVU3hEUVVGU0xFdEJRV01zVVVGQmFrUTdZMEZCUVN4UFFVRlBMRU5CUVVNc1NVRkJVaXhEUVVGaExFOUJRVUVzUjBGQlZTeEhRVUZXTEVkQlFXZENMRU5CUVRkQ0xFVkJRVUU3TzFsQlEwRXNTVUZCTUVNc1QwRkJUeXhEUVVGRExHRkJRVklzUTBGQmMwSXNSMEZCU1N4RFFVRkJMRU5CUVVFc1EwRkJNVUlzUTBGQk1VTTdZMEZCUVN4WFFVRkJMRU5CUVZrc1IwRkJTU3hEUVVGQkxFTkJRVUVzUTBGQmFFSXNSVUZCYjBJc1QwRkJRU3hIUVVGVkxFZEJRVllzUjBGQlowSXNRMEZCY0VNc1JVRkJRVHM3VlVGR2RVSXNRMEZCZWtJc1JVRkVSanM3VFVGR1dUdE5RVk5rTEU5QlFVRXNSMEZCVlR0TlFVTldMRTFCUVUwc1EwRkJReXhKUVVGUUxFTkJRVmtzVFVGQlR5eERRVUZCTEdGQlFVRXNRMEZCYmtJc1EwRkJhME1zUTBGQlF5eFBRVUZ1UXl4RFFVRXlReXhUUVVGRExFZEJRVVE3VVVGRGVrTXNTVUZCTUVRc1QwRkJUeXhEUVVGRExHRkJRVklzUTBGQmMwSXNUVUZCVHl4RFFVRkJMR0ZCUVVFc1EwRkJaU3hEUVVGQkxFZEJRVUVzUTBGQk5VTXNRMEZCTVVRN1ZVRkJRU3hYUVVGQkxFTkJRVmtzVFVGQlR5eERRVUZCTEdGQlFVRXNRMEZCWlN4RFFVRkJMRWRCUVVFc1EwRkJiRU1zUlVGQmQwTXNZVUZCZUVNc1JVRkJRVHM3VFVGRWVVTXNRMEZCTTBNN1lVRkpRVHRKUVdaTExFTkJRVkE3UjBGRVJqczdRVUZyUWtFN096dEZRVWRCTEUxQlFVMHNRMEZCUXl4alFVRlFMRU5CUVhOQ0xGVkJRWFJDTEVWQlFXdERMR2xDUVVGc1F5eEZRVU5GTzBsQlFVRXNTMEZCUVN4RlFVRlBMRk5CUVVNc1QwRkJSRHRCUVVOTUxGVkJRVUU3VFVGQlFTeEpRVUZCTEVkQlFVOHNWVUZCVlN4RFFVRkRMRlZCUVZVc1EwRkJReXhOUVVGMFFpeERRVUUyUWl4VFFVRkRMRXRCUVVRN1pVRkRiRU1zUzBGQlFTeExRVUZUTEV0QlFVRXNRMEZCVFN4UFFVRk9PMDFCUkhsQ0xFTkJRVGRDTzAxQlIxQXNTVUZCYVVNc1MwRkJTeXhEUVVGRExFOUJRVTRzUTBGQll5eEpRVUZrTEVOQlFXcERPMlZCUVVFc1ZVRkJWU3hEUVVGRExGVkJRVmdzUjBGQmQwSXNTMEZCZUVJN08wbEJTa3NzUTBGQlVEdEhRVVJHTzBWQlVVRXNUVUZCVHl4RFFVRkJMR0ZCUVVFc1EwRkJVQ3hIUVVGM1FqdEZRVVY0UWl4TFFVRkJMRWRCUVZFc1lVRkJRU3hEUVVGakxHRkJRV1FzUlVGQk5rSXNUVUZCVHl4RFFVRkJMR0ZCUVVFc1EwRkJjRU03TzBGQlJWSTdPenRGUVVkQkxFdEJRVXNzUTBGQlF5eFJRVUZPTEVOQlFXVXNSMEZCWml4RlFVRnZRaXhQUVVGd1FpeEZRVUUyUWl4TFFVRTNRanM3UVVGRlFUczdPMFZCUjBFc1MwRkJTeXhEUVVGRExGRkJRVTRzUTBGQlpTeE5RVUZtTEVWQlFYVkNMRTFCUVU4c1EwRkJRU3hoUVVGQkxFTkJRVGxDTEVWQlFUaERMRXRCUVRsRE96dEJRVVZCT3pzN1JVRkhRU3hMUVVGTExFTkJRVU1zVVVGQlRpeERRVUZsTEUxQlFXWXNSVUZCZFVJc1lVRkJka0lzUlVGQmMwTXNTMEZCZEVNN1JVRkRRU3hMUVVGTExFTkJRVU1zVVVGQlRpeERRVUZsTEZkQlFXWXNSVUZCTkVJc1UwRkJOVUlzUlVGQmRVTXNTMEZCZGtNN1UwRkRRVHRCUVdoS1lUczdPMEZCYlVwbU96czdPMEZCUjBFc1RVRkJUU3hEUVVGRExHTkJRVkFzUTBGQmMwSXNWVUZCZEVJc1JVRkJhME1zWVVGQmJFTXNSVUZEUlR0RlFVRkJMRXRCUVVFc1JVRkJUeXhaUVVGQkxFTkJRVUVzUTBGQlVEdERRVVJHT3p0QlFVZEJMRVZCUVVVc1EwRkJReXhSUVVGSUxFTkJRVmtzVVVGQldpeEZRVUZ6UWl4VlFVRjBRanM3UVVGRlFTeFpRVUZCTEVkQlFXVTdPMEZCUTJZc1NVRkJSeXhQUVVGUExGRkJRVkFzUzBGQmNVSXNWMEZCZUVJN1JVRkRSU3haUVVGQkxFZEJRV1VzVTBGRWFrSTdPenRCUVVkQkxFVkJRVVVzUTBGQlF5eFJRVUZJTEVOQlFWa3NWVUZCV2l4RlFVRjNRaXhaUVVGNFFqczdRVUZGUVN4RlFVRkZMRU5CUVVNc1VVRkJTQ3hEUVVGWkxFMUJRVm9zUlVGQmIwSXNVMEZCUVN4SFFVRkJMRU5CUVhCQ096dEJRVVZCTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0lpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUlqSUNNZ1QwcGNjbHh1ZEdocGMwZHNiMkpoYkNBOUlISmxjWFZwY21VZ0p5NHZaMnh2WW1Gc0oxeHlYRzUxZEdsc1RHbGlJRDBnY21WeGRXbHlaU0FuYW5GMVpYSjVKMXh5WEc1dVlXMWxVM0JoWTJWT1lXMWxJRDBnSjA5S0oxeHlYRzVjY2x4dUl5TWpYSEpjYm1KdmIzUWdjM1J5WVhBZ2JtRnRaU0J0WlhSb2IyUWdhVzUwYnlCUFltcGxZM1FnY0hKdmRHOTBlWEJsWEhKY2JpTWpJMXh5WEc1UFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRHbGxjeUJQWW1wbFkzUTZPaXhjY2x4dUlDQm5aWFJKYm5OMFlXNWpaVTVoYldVNlhISmNiaUFnSUNCMllXeDFaVG9nTFQ1Y2NseHVJQ0FnSUNBZ1puVnVZMDVoYldWU1pXZGxlQ0E5SUM5bWRXNWpkR2x2YmlBb0xuc3hMSDBwWEZ3b0wxeHlYRzRnSUNBZ0lDQnlaWE4xYkhSeklEMGdLR1oxYm1OT1lXMWxVbVZuWlhncExtVjRaV01vUUdOdmJuTjBjblZqZEc5eUxuUnZVM1J5YVc1bktDa3BYSEpjYmlBZ0lDQWdJQ2hwWmlBb2NtVnpkV3gwY3lCaGJtUWdjbVZ6ZFd4MGN5NXNaVzVuZEdnZ1BpQXhLU0IwYUdWdUlISmxjM1ZzZEhOYk1WMGdaV3h6WlNBbkp5bGNjbHh1WEhKY2JseHlYRzRqSXlOY2NseHVRVzRnYVc1MFpYSnVZV3dnY21Wd2NtVnpaVzUwWVhScGIyNGdiMllnZEdobElHNWhiV1Z6Y0dGalpTQjBjbVZsWEhKY2JpTWpJMXh5WEc1T2MxUnlaV1VnUFNCN2ZWeHlYRzV0WVd0bFZHaGxTblZwWTJVZ1BTQXRQbHh5WEc1Y2NseHVJQ0FqSXlOY2NseHVJQ0JKYm5SbGNtNWhiQ0J1WVcxbFUzQmhZMlZPWVcxbElHMWxkR2h2WkNCMGJ5QmpjbVZoZEdVZ2JtVjNJQ2R6ZFdJbklHNWhiV1Z6Y0dGalpYTWdiMjRnWVhKaWFYUnlZWEo1SUdOb2FXeGtJRzlpYW1WamRITXVYSEpjYmlBZ0l5TWpYSEpjYmlBZ2JXRnJaVTVoYldWVGNHRmpaU0E5SUNoemNHRmpaVzVoYldVc0lIUnlaV1VwSUMwK1hISmNiaUFnSUNBakl5TmNjbHh1SUNBZ0lGUm9aU0JrWlhKcGRtVmtJR2x1YzNSaGJtTmxJSFJ2SUdKbElHTnZibk4wY25WamRHVmtYSEpjYmlBZ0lDQWpJeU5jY2x4dUlDQWdJRUpoYzJVZ1BTQW9ibk5PWVcxbEtTQXRQbHh5WEc0Z0lDQWdJQ0J3Y205MGJ5QTlJSFJvYVhOY2NseHVJQ0FnSUNBZ2RISmxaVnR1YzA1aGJXVmRJRDBnZEhKbFpWdHVjMDVoYldWZElHOXlJSHQ5WEhKY2JpQWdJQ0FnSUc1elZISmxaU0E5SUhSeVpXVmJibk5PWVcxbFhWeHlYRzRnSUNBZ0lDQnRaVzFpWlhKeklEMGdlMzFjY2x4dVhISmNiaUFnSUNBZ0lFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU0IwYUdsekxDQW5iV1Z0WW1WeWN5Y3NJSFpoYkhWbE9pQnRaVzFpWlhKelhISmNibHh5WEc0Z0lDQWdJQ0FqSXlOY2NseHVJQ0FnSUNBZ1VtVm5hWE4wWlhJZ0tHVXVaeTRnSjB4cFpuUW5LU0JoYmlCUFltcGxZM1FnYVc1MGJ5QjBhR1VnY0hKdmRHOTBlWEJsSUc5bUlIUm9aU0J1WVcxbGMzQmhZMlV1WEhKY2JpQWdJQ0FnSUZSb2FYTWdUMkpxWldOMElIZHBiR3dnWW1VZ2NtVmhaR0ZpYkdVdlpYaGxZM1YwWVdKc1pTQmlkWFFnYVhNZ2IzUm9aWEozYVhObElHbHRiWFYwWVdKc1pTNWNjbHh1SUNBZ0lDQWdJeU1qWEhKY2JpQWdJQ0FnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTQjBhR2x6TENBbmNtVm5hWE4wWlhJbkxGeHlYRzRnSUNBZ0lDQWdJSFpoYkhWbE9pQW9ibUZ0WlN3Z2IySnFMQ0JsYm5WdFpYSmhZbXhsS1NBdFBseHlYRzRnSUNBZ0lDQWdJQ0FnSjNWelpTQnpkSEpwWTNRblhISmNiaUFnSUNBZ0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KME5oYm01dmRDQnNhV1owSUdFZ2JtVjNJSEJ5YjNCbGNuUjVJSGRwZEdodmRYUWdZU0IyWVd4cFpDQnVZVzFsTGljcElDQnBaaUFvZEhsd1pXOW1JRzVoYldVZ2FYTnVkQ0FuYzNSeWFXNW5KeWtnYjNJZ2JtRnRaU0JwY3lBbkoxeHlYRzRnSUNBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2REWVc1dWIzUWdiR2xtZENCaElHNWxkeUJ3Y205d1pYSjBlU0IzYVhSb2IzVjBJR0VnZG1Gc2FXUWdjSEp2Y0dWeWRIa2dhVzV6ZEdGdVkyVXVKeWtnSUhWdWJHVnpjeUJ2WW1wY2NseHVJQ0FnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpZ25VSEp2Y0dWeWRIa2dibUZ0WldRZ0p5QXJJRzVoYldVZ0t5QW5JR2x6SUdGc2NtVmhaSGtnWkdWbWFXNWxaQ0J2YmlBbklDc2djM0JoWTJWdVlXMWxJQ3NnSnk0bktTQWdhV1lnY0hKdmRHOWJibUZ0WlYxY2NseHVYSEpjYmlBZ0lDQWdJQ0FnSUNCdFpXMWlaWEp6VzI1aGJXVmRJRDBnYldWdFltVnljMXR1WVcxbFhTQnZjaUJ1WVcxbFhISmNibHh5WEc0Z0lDQWdJQ0FnSUNBZ0kwZDFZWEprSUdGbllXbHVjM1FnYjJKc2FYUmxjbUYwYVc1bklIUm9aU0IwY21WbElHRnpJSFJvWlNCMGNtVmxJR2x6SUhKbFkzVnljMmwyWld4NUlHVjRkR1Z1WkdWa1hISmNiaUFnSUNBZ0lDQWdJQ0J1YzFSeVpXVmJibUZ0WlYwZ1BTQnVjMVJ5WldWYmJtRnRaVjBnYjNKY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnYm1GdFpUb2dibUZ0WlZ4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0IwZVhCbE9pQjBlWEJsYjJZZ2IySnFYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHbHVjM1JoYm1ObE9pQW9hV1lnYjJKcUxtZGxkRWx1YzNSaGJtTmxUbUZ0WlNCMGFHVnVJRzlpYWk1blpYUkpibk4wWVc1alpVNWhiV1VvS1NCbGJITmxJQ2QxYm10dWIzZHVKeWxjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0JQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrZ2NISnZkRzhzSUc1aGJXVXNYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIWmhiSFZsT2lCdlltcGNjbHh1SUNBZ0lDQWdJQ0FnSUNBZ1pXNTFiV1Z5WVdKc1pUb2dabUZzYzJVZ2FYTnVkQ0JsYm5WdFpYSmhZbXhsWEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnYm5OSmJuUmxjbTVoYkM1aGJHVnlkRVJsY0dWdVpHVnVkSE1nYm5OT1lXMWxJQ3NnSnk0bklDc2djM0JoWTJWdVlXMWxJQ3NnSnk0bklDc2dibUZ0WlZ4eVhHNGdJQ0FnSUNBZ0lDQWdiMkpxWEhKY2JseHlYRzVjY2x4dUlDQWdJQ0FnSXlNalhISmNiaUFnSUNBZ0lFTnlaV0YwWlNCaElHNWxkeXdnYzNSaGRHbGpJRzVoYldWemNHRmpaU0J2YmlCMGFHVWdZM1Z5Y21WdWRDQndZWEpsYm5RZ0tHVXVaeTRnYm5OT1lXMWxMblJ2TGk0dUlIeDhJRzV6VG1GdFpTNXBjeTR1TGlsY2NseHVJQ0FnSUNBZ0l5TWpYSEpjYmlBZ0lDQWdJSEJ5YjNSdkxuSmxaMmx6ZEdWeUlDZHRZV3RsVTNWaVRtRnRaVk53WVdObEp5d2dLQ2h6ZFdKT1lXMWxVM0JoWTJVcElDMCtYSEpjYmlBZ0lDQWdJQ0FnSjNWelpTQnpkSEpwWTNRblhISmNiaUFnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZERZVzV1YjNRZ1kzSmxZWFJsSUdFZ2JtVjNJSE4xWWlCdVlXMWxjM0JoWTJVZ2QybDBhRzkxZENCaElIWmhiR2xrSUc1aGJXVXVKeWtnSUdsbUlDaDBlWEJsYjJZZ2MzVmlUbUZ0WlZOd1lXTmxJR2x6Ym5RZ0ozTjBjbWx1WnljcElHOXlJSE4xWWs1aGJXVlRjR0ZqWlNCcGN5QW5KMXh5WEc0Z0lDQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWduVTNWaUlHNWhiV1Z6Y0dGalpTQnVZVzFsWkNBbklDc2djM1ZpVG1GdFpWTndZV05sSUNzZ0p5QnBjeUJoYkhKbFlXUjVJR1JsWm1sdVpXUWdiMjRnSnlBcklITndZV05sYm1GdFpTQXJJQ2N1SnlrZ0lHbG1JSEJ5YjNSdkxuTjFZazVoYldWVGNHRmpaVnh5WEc0Z0lDQWdJQ0FnSUc1elNXNTBaWEp1WVd3dVlXeGxjblJFWlhCbGJtUmxiblJ6SUc1elRtRnRaU0FySUNjdUp5QXJJSE4xWWs1aGJXVlRjR0ZqWlZ4eVhHNGdJQ0FnSUNBZ0lHNWxkMDVoYldWVGNHRmpaU0E5SUcxaGEyVk9ZVzFsVTNCaFkyVW9jM1ZpVG1GdFpWTndZV05sTENCdWMxUnlaV1VwWEhKY2JpQWdJQ0FnSUNBZ2JtVjNUbUZ0WlZOd1lXTmxMbkpsWjJsemRHVnlJQ2RqYjI1emRHRnVkSE1uTENCdFlXdGxUbUZ0WlZOd1lXTmxLQ2RqYjI1emRHRnVkSE1uTENCdWMxUnlaV1VwTENCbVlXeHpaU0FnYVdZZ2MzVmlUbUZ0WlZOd1lXTmxJR2x6Ym5RZ0oyTnZibk4wWVc1MGN5ZGNjbHh1SUNBZ0lDQWdJQ0J3Y205MGJ5NXlaV2RwYzNSbGNpQnpkV0pPWVcxbFUzQmhZMlVzSUc1bGQwNWhiV1ZUY0dGalpTd2dabUZzYzJWY2NseHVJQ0FnSUNBZ0lDQnVaWGRPWVcxbFUzQmhZMlZjY2x4dUlDQWdJQ0FnS1N3Z1ptRnNjMlZjY2x4dUlDQWdJQ0FnY21WMGRYSnVYSEpjYmx4eVhHNGdJQ0FnSXlNalhISmNiaUFnSUNCQmJpQnBiblJsY201aGJDQnRaV05vWVc1cGMyMGdkRzhnY21Wd2NtVnpaVzUwSUhSb1pTQnBibk4wWVc1alpTQnZaaUIwYUdseklHNWhiV1Z6Y0dGalpWeHlYRzRnSUNBZ1FHTnZibk4wY25WamRHOXlYSEpjYmlBZ0lDQkFhVzUwWlhKdVlXeGNjbHh1SUNBZ0lFQnRaVzFpWlhKUFppQnRZV3RsVG1GdFpWTndZV05sWEhKY2JpQWdJQ0FqSXlOY2NseHVJQ0FnSUVOc1lYTnpJRDBnYm1WM0lFWjFibU4wYVc5dUtDZHlaWFIxY200Z1puVnVZM1JwYjI0Z0p5QXJJSE53WVdObGJtRnRaU0FySUNjb0tYdDlKeWtvS1Z4eVhHNGdJQ0FnUTJ4aGMzTTZPaUE5SUc1bGR5QkNZWE5sS0hOd1lXTmxibUZ0WlNsY2NseHVYSEpjYmlBZ0lDQWpRMnhoYzNNdWNISnZkRzkwZVhCbExuQmhjbVZ1ZENBOUlFSmhjMlV1Y0hKdmRHOTBlWEJsTzF4eVhHNGdJQ0FnYm1WM0lFTnNZWE56S0hOd1lXTmxibUZ0WlNsY2NseHVYSEpjYmlBZ0l5TWpYSEpjYmlBZ0owUmxjR1Z1WkNjZ1lXNGdUMkpxWldOMElIVndiMjRnWVc1dmRHaGxjaUJ0WlcxaVpYSWdiMllnZEdocGN5QnVZVzFsYzNCaFkyVXNJSFZ3YjI0Z1lXNXZkR2hsY2lCdVlXMWxjM0JoWTJVc1hISmNiaUFnYjNJZ2RYQnZiaUJoSUcxbGJXSmxjaUJ2WmlCaGJtOTBhR1Z5SUc1aGJXVnpjR0ZqWlZ4eVhHNGdJQ01qSTF4eVhHNGdJR1JsY0dWdVpITlBiaUE5SUNoa1pYQmxibVJsYm1OcFpYTXNJR05oYkd4Q1lXTnJMQ0JwYlhCdmNuUnpLU0F0UGx4eVhHNGdJQ0FnSjNWelpTQnpkSEpwWTNRblhISmNiaUFnSUNCeVpYUWdQU0JtWVd4elpWeHlYRzRnSUNBZ2JuTk5aVzFpWlhKeklEMGdibk5KYm5SbGNtNWhiQzVuWlhST2MwMWxiV0psY25Nb0tWeHlYRzRnSUNBZ2FXWWdaR1Z3Wlc1a1pXNWphV1Z6SUdGdVpDQmtaWEJsYm1SbGJtTnBaWE11YkdWdVozUm9JRDRnTUNCaGJtUWdZMkZzYkVKaFkydGNjbHh1SUNBZ0lDQWdiV2x6YzJsdVp5QTlJR1JsY0dWdVpHVnVZMmxsY3k1bWFXeDBaWElvS0dSbGNHVnVLU0F0UGx4eVhHNGdJQ0FnSUNBZ0lHNXpUV1Z0WW1WeWN5NXBibVJsZUU5bUtHUmxjR1Z1S1NCcGN5QXRNU0JoYm1RZ0tHNXZkQ0JwYlhCdmNuUnpJRzl5SUdsdGNHOXlkSE1nYVhOdWRDQmtaWEJsYmlsY2NseHVJQ0FnSUNBZ0tWeHlYRzRnSUNBZ0lDQnBaaUJ0YVhOemFXNW5MbXhsYm1kMGFDQnBjeUF3WEhKY2JpQWdJQ0FnSUNBZ2NtVjBJRDBnZEhKMVpWeHlYRzRnSUNBZ0lDQWdJR05oYkd4Q1lXTnJLQ2xjY2x4dUlDQWdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQWdJRzV6U1c1MFpYSnVZV3d1WkdWd1pXNWtaVzUwY3k1d2RYTm9JQ2hwYlhCdmNuUnpLU0F0UGx4eVhHNGdJQ0FnSUNBZ0lDQWdaR1Z3Wlc1a2MwOXVJRzFwYzNOcGJtY3NJR05oYkd4Q1lXTnJMQ0JwYlhCdmNuUnpYSEpjYmx4eVhHNGdJQ0FnY21WMFhISmNiaUFnYm5OSmJuUmxjbTVoYkNBOUlHUmxjR1Z1WkdWdWRITTZJRnRkWEhKY2JseHlYRzRnSUNNakkxeHlYRzRnSUVabGRHTm9aWE1nZEdobElISmxaMmx6ZEdWeVpXUWdjSEp2Y0dWeWRHbGxjeUJoYm1RZ2JXVjBhRzlrY3lCdmJpQjBhR1VnYm1GdFpYTndZV05sSUdGdVpDQnBkSE1nWTJocGJHUWdibUZ0WlhOd1lXTmxjMXh5WEc0Z0lDTWpJMXh5WEc0Z0lFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU0J1YzBsdWRHVnlibUZzTENBbloyVjBUbk5OWlcxaVpYSnpKeXhjY2x4dUlDQWdJSFpoYkhWbE9pQXRQbHh5WEc0Z0lDQWdJQ0J5WldOMWNuTmxWSEpsWlNBOUlDaHJaWGtzSUd4aGMzUkxaWGtwSUMwK1hISmNiaUFnSUNBZ0lDQWdiV1Z0WW1WeWN5NXdkWE5vSUd4aGMzUkxaWGtnS3lBbkxpY2dLeUJyWlhrZ0lHbG1JSFI1Y0dWdlppQW9hMlY1S1NCcGN5QW5jM1J5YVc1bkoxeHlYRzRnSUNBZ0lDQWdJR2xtSUhWMGFXeE1hV0l1YVhOUWJHRnBiazlpYW1WamRDaHJaWGtwWEhKY2JpQWdJQ0FnSUNBZ0lDQlBZbXBsWTNRdWEyVjVjeWhyWlhrcExtWnZja1ZoWTJnZ0tHc3BJQzArWEhKY2JpQWdJQ0FnSUNBZ0lDQWdJRzFsYldKbGNuTXVjSFZ6YUNCc1lYTjBTMlY1SUNzZ0p5NG5JQ3NnYXlBZ2FXWWdkSGx3Wlc5bUlDaHJLU0JwY3lBbmMzUnlhVzVuSjF4eVhHNGdJQ0FnSUNBZ0lDQWdJQ0J5WldOMWNuTmxWSEpsWlNCclpYbGJhMTBzSUd4aGMzUkxaWGtnS3lBbkxpY2dLeUJySUNCcFppQjFkR2xzVEdsaUxtbHpVR3hoYVc1UFltcGxZM1FvYTJWNVcydGRLVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY201Y2NseHVYSEpjYmlBZ0lDQWdJQ0FnY21WMGRYSnVYSEpjYmlBZ0lDQWdJRzFsYldKbGNuTWdQU0JiWFZ4eVhHNGdJQ0FnSUNCUFltcGxZM1F1YTJWNWN5aE9jMVJ5WldWYmJtRnRaVk53WVdObFRtRnRaVjBwTG1admNrVmhZMmdnS0d0bGVTa2dMVDVjY2x4dUlDQWdJQ0FnSUNCeVpXTjFjbk5sVkhKbFpTQk9jMVJ5WldWYmJtRnRaVk53WVdObFRtRnRaVjFiYTJWNVhTd2dibUZ0WlZOd1lXTmxUbUZ0WlNBZ2FXWWdkWFJwYkV4cFlpNXBjMUJzWVdsdVQySnFaV04wS0U1elZISmxaVnR1WVcxbFUzQmhZMlZPWVcxbFhWdHJaWGxkS1Z4eVhHNGdJQ0FnSUNBZ0lISmxkSFZ5Ymx4eVhHNWNjbHh1SUNBZ0lDQWdiV1Z0WW1WeWMxeHlYRzVjY2x4dUlDQWpJeU5jY2x4dUlDQlVieUJ6ZFhCd2IzSjBJR1JsY0dWdVpHVnVZM2tnYldGdVlXZGxiV1Z1ZEN3Z2QyaGxiaUJoSUhCeWIzQmxjblI1SUdseklHeHBablJsWkNCdmJuUnZJSFJvWlNCdVlXMWxjM0JoWTJVc0lHNXZkR2xtZVNCa1pYQmxibVJsYm5SeklIUnZJR2x1YVhScFlXeHBlbVZjY2x4dUlDQWpJeU5jY2x4dUlDQlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtnYm5OSmJuUmxjbTVoYkN3Z0oyRnNaWEowUkdWd1pXNWtaVzUwY3ljc1hISmNiaUFnSUNCMllXeDFaVG9nS0dsdGNHOXlkSE1wSUMwK1hISmNiaUFnSUNBZ0lHUmxjSE1nUFNCdWMwbHVkR1Z5Ym1Gc0xtUmxjR1Z1WkdWdWRITXVabWxzZEdWeUtDaGtaWEJQYmlrZ0xUNWNjbHh1SUNBZ0lDQWdJQ0JtWVd4elpTQnBjeUJrWlhCUGJpaHBiWEJ2Y25SektWeHlYRzRnSUNBZ0lDQXBYSEpjYmlBZ0lDQWdJRzV6U1c1MFpYSnVZV3d1WkdWd1pXNWtaVzUwY3lBOUlHUmxjSE1nSUdsbUlFRnljbUY1TG1selFYSnlZWGtvWkdWd2N5bGNjbHh1WEhKY2JpQWdJME55WldGMFpTQjBhR1VnY205dmRDQnZaaUIwYUdVZ2RISmxaU0JoY3lCMGFHVWdZM1Z5Y21WdWRDQnVZVzFsYzNCaFkyVmNjbHh1SUNCT2MxUnlaV1ZiYm1GdFpWTndZV05sVG1GdFpWMGdQU0I3ZlZ4eVhHNGdJQ05FWldacGJtVWdkR2hsSUdOdmNtVWdibUZ0WlhOd1lXTmxJR0Z1WkNCMGFHVWdjbVYwZFhKdUlHOW1JSFJvYVhNZ1kyeGhjM05jY2x4dUlDQk9jMDkxZENBOUlHMWhhMlZPWVcxbFUzQmhZMlVvYm1GdFpWTndZV05sVG1GdFpTd2dUbk5VY21WbFcyNWhiV1ZUY0dGalpVNWhiV1ZkS1Z4eVhHNWNjbHh1SUNBakl5TmNjbHh1SUNCRFlXTm9aU0JoSUdoaGJtUnNaU0J2YmlCMGFHVWdkbVZ1Wkc5eUlDaHdjbTlpWVdKc2VTQnFVWFZsY25rcElHOXVJSFJvWlNCeWIyOTBJRzVoYldWemNHRmpaVnh5WEc0Z0lDTWpJMXh5WEc0Z0lFNXpUM1YwTG5KbFoybHpkR1Z5SUNjL0p5d2dkWFJwYkV4cFlpd2dabUZzYzJWY2NseHVYSEpjYmlBZ0l5TWpYSEpjYmlBZ1EyRmphR1VnZEdobElIUnlaV1VnS0hWelpXWjFiQ0JtYjNJZ1pHOWpkVzFsYm5SaGRHbHZiaTkyYVhOMVlXeHBlbUYwYVc5dUwyUmxZblZuWjJsdVp5bGNjbHh1SUNBakl5TmNjbHh1SUNCT2MwOTFkQzV5WldkcGMzUmxjaUFuZEhKbFpTY3NJRTV6VkhKbFpWdHVZVzFsVTNCaFkyVk9ZVzFsWFN3Z1ptRnNjMlZjY2x4dVhISmNiaUFnSXlNalhISmNiaUFnUTJGamFHVWdkR2hsSUc1aGJXVWdjM0JoWTJVZ2JtRnRaVnh5WEc0Z0lDTWpJMXh5WEc0Z0lFNXpUM1YwTG5KbFoybHpkR1Z5SUNkdVlXMWxKeXdnYm1GdFpWTndZV05sVG1GdFpTd2dabUZzYzJWY2NseHVJQ0JPYzA5MWRDNXlaV2RwYzNSbGNpQW5aR1Z3Wlc1a2MwOXVKeXdnWkdWd1pXNWtjMDl1TENCbVlXeHpaVnh5WEc0Z0lFNXpUM1YwWEhKY2JseHlYRzVjY2x4dUl5TWpYSEpjYmtGamRIVmhiR3g1SUdSbFptbHVaU0IwYUdVZ1Qwb2dUbUZ0WlZOd1lXTmxYSEpjYmlNakkxeHlYRzVQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrZ2RHaHBjMGRzYjJKaGJDd2dibUZ0WlZOd1lXTmxUbUZ0WlN4Y2NseHVJQ0IyWVd4MVpUb2diV0ZyWlZSb1pVcDFhV05sS0NsY2NseHVYSEpjYms5S0xuSmxaMmx6ZEdWeUlDZG5iRzlpWVd3bkxDQjBhR2x6UjJ4dlltRnNYSEpjYmx4eVhHNTBhR2x6Ukc5amRXMWxiblFnUFNCN2ZWeHlYRzVwWmlCMGVYQmxiMllnWkc5amRXMWxiblFnYVhOdWRDQW5kVzVrWldacGJtVmtKMXh5WEc0Z0lIUm9hWE5FYjJOMWJXVnVkQ0E5SUdSdlkzVnRaVzUwWEhKY2JseHlYRzVQU2k1eVpXZHBjM1JsY2lBblpHOWpkVzFsYm5RbkxDQjBhR2x6Ukc5amRXMWxiblJjY2x4dVhISmNiazlLTG5KbFoybHpkR1Z5SUNkdWIyOXdKeXdnTFQ1Y2NseHVYSEpjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVDBvaVhYMD0iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgT0osIF8sIHN1Yk5hbWVTcGFjZXM7XG5cbk9KID0gcmVxdWlyZSgnLi9vaicpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5zdWJOYW1lU3BhY2VzID0gWydlcnJvcnMnLCAnZW51bXMnLCAnaW5zdGFuY2VPZicsICdub2RlcycsICdkYicsICdjb21wb25lbnRzJywgJ2NvbnRyb2xzJywgJ2lucHV0cycsICdub3RpZmljYXRpb25zJywgJ2hpc3RvcnknLCAnY29va2llJywgJ2FzeW5jJ107XG5cbl8uZWFjaChzdWJOYW1lU3BhY2VzLCBmdW5jdGlvbihuYW1lKSB7XG4gIHJldHVybiBPSi5tYWtlU3ViTmFtZVNwYWNlKG5hbWUpO1xufSk7XG5cbk9KWydHRU5FUkFURV9VTklRVUVfSURTJ10gPSBmYWxzZTtcblxuT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSA9ICdkaXYnO1xuXG5PSlsnVFJBQ0tfT05fRVJST1InXSA9IGZhbHNlO1xuXG5PSlsnTE9HX0FMTF9BSkFYJ10gPSBmYWxzZTtcblxuT0pbJ0xPR19BTExfQUpBWF9FUlJPUlMnXSA9IGZhbHNlO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeHZha2x1YVhRdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGRlFTeEpRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVFVGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlNVb3NZVUZCUVN4SFFVRm5RaXhEUVVOa0xGRkJSR01zUlVGRlpDeFBRVVpqTEVWQlIyUXNXVUZJWXl4RlFVbGtMRTlCU21Nc1JVRkxaQ3hKUVV4akxFVkJUV1FzV1VGT1l5eEZRVTlrTEZWQlVHTXNSVUZSWkN4UlFWSmpMRVZCVTJRc1pVRlVZeXhGUVZWa0xGTkJWbU1zUlVGWFpDeFJRVmhqTEVWQldXUXNUMEZhWXpzN1FVRnRRbWhDTEVOQlFVTXNRMEZCUXl4SlFVRkdMRU5CUVU4c1lVRkJVQ3hGUVVGelFpeFRRVUZETEVsQlFVUTdVMEZEY0VJc1JVRkJSU3hEUVVGRExHZENRVUZJTEVOQlFXOUNMRWxCUVhCQ08wRkJSRzlDTEVOQlFYUkNPenRCUVUxQkxFVkJRVWNzUTBGQlFTeHhRa0ZCUVN4RFFVRklMRWRCUVRSQ096dEJRVVUxUWl4RlFVRkhMRU5CUVVFc2FVTkJRVUVzUTBGQlNDeEhRVUYzUXpzN1FVRkZlRU1zUlVGQlJ5eERRVUZCTEdkQ1FVRkJMRU5CUVVnc1IwRkJkVUk3TzBGQlJYWkNMRVZCUVVjc1EwRkJRU3hqUVVGQkxFTkJRVWdzUjBGQmNVSTdPMEZCUlhKQ0xFVkJRVWNzUTBGQlFTeHhRa0ZCUVN4RFFVRklMRWRCUVRSQ0lpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUlnSXlBaklFOUtJRkJ2YzNRdFNXNXBkR2xoYkdsNllYUnBiMjVjY2x4dVhISmNiazlLSUQwZ2NtVnhkV2x5WlNBbkxpOXZhaWRjY2x4dVh5QTlJSEpsY1hWcGNtVWdKMnh2WkdGemFDZGNjbHh1WEhKY2JpTWdVMmx0Y0d4bElHRnljbUY1SUc5bUlHRnVkR2xqYVhCaGRHVmtMMnR1YjNkdUlHTm9hV3hrSUc1aGJXVnpjR0ZqWlhOY2NseHVJQ0JjY2x4dWMzVmlUbUZ0WlZOd1lXTmxjeUE5SUZ0Y2NseHVJQ0FuWlhKeWIzSnpKMXh5WEc0Z0lDZGxiblZ0Y3lkY2NseHVJQ0FuYVc1emRHRnVZMlZQWmlkY2NseHVJQ0FuYm05a1pYTW5YSEpjYmlBZ0oyUmlKMXh5WEc0Z0lDZGpiMjF3YjI1bGJuUnpKMXh5WEc0Z0lDZGpiMjUwY205c2N5ZGNjbHh1SUNBbmFXNXdkWFJ6SjF4eVhHNGdJQ2R1YjNScFptbGpZWFJwYjI1ekoxeHlYRzRnSUNkb2FYTjBiM0o1SjF4eVhHNGdJQ2RqYjI5cmFXVW5YSEpjYmlBZ0oyRnplVzVqSjF4eVhHNWRYSEpjYmx4eVhHNGpJQ01qSUZOMVlrNWhiV1ZUY0dGalpYTmNjbHh1WEhKY2JpTWdVSEpsTFdGc2JHOWpZWFJsSUdObGNuUmhhVzRnWTI5dGJXOXVJRzVoYldWemNHRmpaWE1nZEc4Z1lYWnZhV1FnWm5WMGRYSmxJSEpoWTJVZ1kyOXVaR2wwYVc5dWN5NWNjbHh1SXlCVWFHbHpJR1J2WlhNZ2NtVnhkV2x5WlNCMGFHRjBJSFJvWlNCdmNtUmxjaUJ2WmlCdmNHVnlZWFJwYjI1eklHeHZZV1J6SUU5S0xtTnZabVpsWlNCbWFYSnpkQ0JoYm1RZ2IwcEpibWwwTG1OdlptWmxaU0J6WldOdmJtUmNjbHh1WHk1bFlXTm9JSE4xWWs1aGJXVlRjR0ZqWlhNc0lDaHVZVzFsS1NBdFBseHlYRzRnSUU5S0xtMWhhMlZUZFdKT1lXMWxVM0JoWTJVZ2JtRnRaVnh5WEc0Z0lGeHlYRzRqSUNNaklFTnZibVpwWjNWeVlYUnBiMjRnZG1GeWFXRmliR1Z6WEhKY2JseHlYRzRqSUVGMWRHOXRZWFJwWTJGc2JIa2daMlZ1WlhKaGRHVWdkVzVwY1hWbElFbEVjeUJtYjNJZ1pXRmphQ0J1YjJSbElDaGtaV1poZFd4MElHWmhiSE5sS1Z4eVhHNVBTbHNuUjBWT1JWSkJWRVZmVlU1SlVWVkZYMGxFVXlkZElEMGdabUZzYzJWY2NseHVJeUJFWldaaGRXeDBJSEp2YjNRZ2JtOWtaU0JtYjNJZ1kyOXRjRzl1Wlc1MGN5OWpiMjUwY205c2N5QW9aR1ZtWVhWc2RDQW5aR2wySnlsY2NseHVUMHBiSjBSRlJrRlZURlJmUTA5TlVFOU9SVTVVWDFKUFQxUmZUazlFUlZSWlVFVW5YU0E5SUNka2FYWW5YSEpjYmlNZ1YyaGxkR2hsY2lCMGJ5Qm9iMjlySUdsdWRHOGdkR2hsSUdkc2IySmhiQ0J2YmlCbGNuSnZjaUJsZG1WdWRDQjBieUIzY21sMFpTQmxjbkp2Y25NZ2RHOGdZMjl1YzI5c1pTQW9aR1ZtWVhWc2RDQm1ZV3h6WlNsY2NseHVUMHBiSjFSU1FVTkxYMDlPWDBWU1VrOVNKMTBnUFNCbVlXeHpaVnh5WEc0alYyaGxkR2hsY2lCMGJ5QnNiMmNnWVd4c0lFRktRVmdnY21WeGRXVnpkSE5jY2x4dVQwcGJKMHhQUjE5QlRFeGZRVXBCV0NkZElEMGdabUZzYzJWY2NseHVJMWRvWlhSb1pYSWdkRzhnYkc5bklHRnNiQ0JCU2tGWUlHVnljbTl5YzF4eVhHNVBTbHNuVEU5SFgwRk1URjlCU2tGWVgwVlNVazlTVXlkZElEMGdabUZzYzJVaVhYMD0iLCJcclxuIyMjXHJcblJldHVybiBqdXN0IHRoZSBrZXlzIGZyb20gdGhlIGlucHV0IGFycmF5LCBvcHRpb25hbGx5IG9ubHkgZm9yIHRoZSBzcGVjaWZpZWQgc2VhcmNoX3ZhbHVlXHJcbnZlcnNpb246IDExMDkuMjAxNVxyXG5kaXNjdXNzIGF0OiBodHRwOi8vcGhwanMub3JnL2Z1bmN0aW9ucy9hcnJheV9rZXlzXHJcbisgICBvcmlnaW5hbCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2tldmluLnZhbnpvbm5ldmVsZC5uZXQpXHJcbisgICAgICBpbnB1dCBieTogQnJldHQgWmFtaXIgKGh0dHA6Ly9icmV0dC16YW1pci5tZSlcclxuKyAgIGJ1Z2ZpeGVkIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va2V2aW4udmFuem9ubmV2ZWxkLm5ldClcclxuKyAgIGltcHJvdmVkIGJ5OiBqZFxyXG4rICAgaW1wcm92ZWQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXHJcbisgICBpbnB1dCBieTogUFxyXG4rICAgYnVnZml4ZWQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXHJcbmV4YW1wbGUgMTogYXJyYXlfa2V5cygge2ZpcnN0bmFtZTogJ0tldmluJywgc3VybmFtZTogJ3ZhbiBab25uZXZlbGQnfSApO1xyXG5yZXR1cm5zIDE6IHswOiAnZmlyc3RuYW1lJywgMTogJ3N1cm5hbWUnfVxyXG4jIyNcclxuYXJyYXlfa2V5cyA9IChpbnB1dCwgc2VhcmNoX3ZhbHVlLCBhcmdTdHJpY3QpIC0+XHJcbiAgc2VhcmNoID0gdHlwZW9mIHNlYXJjaF92YWx1ZSBpc250IFwidW5kZWZpbmVkXCJcclxuICB0bXBfYXJyID0gW11cclxuICBzdHJpY3QgPSAhIWFyZ1N0cmljdFxyXG4gIGluY2x1ZGUgPSB0cnVlXHJcbiAga2V5ID0gXCJcIlxyXG4gICMgRHVjay10eXBlIGNoZWNrIGZvciBvdXIgb3duIGFycmF5KCktY3JlYXRlZCBQSFBKU19BcnJheVxyXG4gIHJldHVybiBpbnB1dC5rZXlzKHNlYXJjaF92YWx1ZSwgYXJnU3RyaWN0KSAgaWYgaW5wdXQgYW5kIHR5cGVvZiBpbnB1dCBpcyBcIm9iamVjdFwiIGFuZCBpbnB1dC5jaGFuZ2Vfa2V5X2Nhc2VcclxuICBmb3Iga2V5IG9mIGlucHV0XHJcbiAgICBpZiBpbnB1dC5oYXNPd25Qcm9wZXJ0eShrZXkpXHJcbiAgICAgIGluY2x1ZGUgPSB0cnVlXHJcbiAgICAgIGlmIHNlYXJjaFxyXG4gICAgICAgIGlmIHN0cmljdCBhbmQgaW5wdXRba2V5XSBpc250IHNlYXJjaF92YWx1ZVxyXG4gICAgICAgICAgaW5jbHVkZSA9IGZhbHNlXHJcbiAgICAgICAgZWxzZSBpbmNsdWRlID0gZmFsc2UgIHVubGVzcyBpbnB1dFtrZXldIGlzIHNlYXJjaF92YWx1ZVxyXG4gICAgICB0bXBfYXJyW3RtcF9hcnIubGVuZ3RoXSA9IGtleSAgaWYgaW5jbHVkZVxyXG4gIHRtcF9hcnJcclxuXHJcbiMjIypcclxuQ29udmVydCBhIEphdmFzY3JpcHQgT2plY3QgYXJyYXkgb3IgU3RyaW5nIGFycmF5IHRvIGFuIEhUTUwgdGFibGVcclxuSlNPTiBwYXJzaW5nIGhhcyB0byBiZSBtYWRlIGJlZm9yZSBmdW5jdGlvbiBjYWxsXHJcbkl0IGFsbG93cyB1c2Ugb2Ygb3RoZXIgSlNPTiBwYXJzaW5nIG1ldGhvZHMgbGlrZSBqUXVlcnkucGFyc2VKU09OXHJcbmh0dHAocyk6Ly8sIGZ0cDovLywgZmlsZTovLyBhbmQgamF2YXNjcmlwdDo7IGxpbmtzIGFyZSBhdXRvbWF0aWNhbGx5IGNvbXB1dGVkXHJcblxyXG5KU09OIGRhdGEgc2FtcGxlcyB0aGF0IHNob3VsZCBiZSBwYXJzZWQgYW5kIHRoZW4gY2FuIGJlIGNvbnZlcnRlZCB0byBhbiBIVE1MIHRhYmxlXHJcbnZhciBvYmplY3RBcnJheSA9ICdbe1wiVG90YWxcIjpcIjM0XCIsXCJWZXJzaW9uXCI6XCIxLjAuNFwiLFwiT2ZmaWNlXCI6XCJOZXcgWW9ya1wifSx7XCJUb3RhbFwiOlwiNjdcIixcIlZlcnNpb25cIjpcIjEuMS4wXCIsXCJPZmZpY2VcIjpcIlBhcmlzXCJ9XSc7XHJcbnZhciBzdHJpbmdBcnJheSA9ICdbXCJOZXcgWW9ya1wiLFwiQmVybGluXCIsXCJQYXJpc1wiLFwiTWFycmFrZWNoXCIsXCJNb3Njb3dcIl0nO1xyXG52YXIgbmVzdGVkVGFibGUgPSAnW3sga2V5MTogXCJ2YWwxXCIsIGtleTI6IFwidmFsMlwiLCBrZXkzOiB7IHRhYmxlSWQ6IFwidGJsSWROZXN0ZWQxXCIsIHRhYmxlQ2xhc3NOYW1lOiBcImNsc05lc3RlZFwiLCBsaW5rVGV4dDogXCJEb3dubG9hZFwiLCBkYXRhOiBbeyBzdWJrZXkxOiBcInN1YnZhbDFcIiwgc3Via2V5MjogXCJzdWJ2YWwyXCIsIHN1YmtleTM6IFwic3VidmFsM1wiIH1dIH0gfV0nO1xyXG5cclxuQ29kZSBzYW1wbGUgdG8gY3JlYXRlIGEgSFRNTCB0YWJsZSBKYXZhc2NyaXB0IFN0cmluZ1xyXG52YXIganNvbkh0bWxUYWJsZSA9IENvbnZlcnRKc29uVG9UYWJsZShldmFsKGRhdGFTdHJpbmcpLCAnanNvblRhYmxlJywgbnVsbCwgJ0Rvd25sb2FkJyk7XHJcblxyXG5Db2RlIHNhbXBsZSBleHBsYW5lZFxyXG4tIGV2YWwgaXMgdXNlZCB0byBwYXJzZSBhIEpTT04gZGF0YVN0cmluZ1xyXG4tIHRhYmxlIEhUTUwgaWQgYXR0cmlidXRlIHdpbGwgYmUgJ2pzb25UYWJsZSdcclxuLSB0YWJsZSBIVE1MIGNsYXNzIGF0dHJpYnV0ZSB3aWxsIG5vdCBiZSBhZGRlZFxyXG4tICdEb3dubG9hZCcgdGV4dCB3aWxsIGJlIGRpc3BsYXllZCBpbnN0ZWFkIG9mIHRoZSBsaW5rIGl0c2VsZlxyXG5cclxuQGF1dGhvciBBZnNoaW4gTWVocmFiYW5pIDxhZnNoaW4gZG90IG1laCBhdCBnbWFpbCBkb3QgY29tPlxyXG5cclxuQGNsYXNzIENvbnZlcnRKc29uVG9UYWJsZVxyXG5cclxuQG1ldGhvZCBDb252ZXJ0SnNvblRvVGFibGVcclxuXHJcbkBwYXJhbSBwYXJzZWRKc29uIG9iamVjdCBQYXJzZWQgSlNPTiBkYXRhXHJcbkBwYXJhbSB0YWJsZUlkIHN0cmluZyBPcHRpb25hbCB0YWJsZSBpZFxyXG5AcGFyYW0gdGFibGVDbGFzc05hbWUgc3RyaW5nIE9wdGlvbmFsIHRhYmxlIGNzcyBjbGFzcyBuYW1lXHJcbkBwYXJhbSBsaW5rVGV4dCBzdHJpbmcgT3B0aW9uYWwgdGV4dCByZXBsYWNlbWVudCBmb3IgbGluayBwYXR0ZXJuXHJcblxyXG5AcmV0dXJuIHN0cmluZyBDb252ZXJ0ZWQgSlNPTiB0byBIVE1MIHRhYmxlXHJcbiMjI1xyXG5jbGFzcyBKc29uVG9UYWJsZSBcclxuICBcclxuICB0YWJsZTogbnVsbFxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yOiAocGFyc2VkSnNvbiwgdGFibGVJZCwgdGFibGVDbGFzc05hbWUsIGxpbmtUZXh0KSAtPlxyXG4gICAgI1BhdHRlcm5zIGZvciBsaW5rcyBhbmQgTlVMTCB2YWx1ZVxyXG4gICAgaXRhbGljID0gXCI8aT57MH08L2k+XCJcclxuICAgIGxpbmsgPSAoaWYgbGlua1RleHQgdGhlbiBcIjxhIGhyZWY9XFxcInswfVxcXCI+XCIgKyBsaW5rVGV4dCArIFwiPC9hPlwiIGVsc2UgXCI8YSBocmVmPVxcXCJ7MH1cXFwiPnswfTwvYT5cIilcclxuICBcclxuICAgICNQYXR0ZXJuIGZvciB0YWJsZSAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICBpZE1hcmt1cCA9IChpZiB0YWJsZUlkIHRoZW4gXCIgaWQ9XFxcIlwiICsgdGFibGVJZCArIFwiXFxcIlwiIGVsc2UgXCJcIilcclxuICAgIGNsYXNzTWFya3VwID0gKGlmIHRhYmxlQ2xhc3NOYW1lIHRoZW4gXCIgY2xhc3M9XFxcIlwiICsgdGFibGVDbGFzc05hbWUgKyBcIlxcXCJcIiBlbHNlIFwiXCIpXHJcbiAgICB0YmwgPSBcIjx0YWJsZSBib3JkZXI9XFxcIjFcXFwiIGNlbGxwYWRkaW5nPVxcXCIxXFxcIiBjZWxsc3BhY2luZz1cXFwiMVxcXCJcIiArIGlkTWFya3VwICsgY2xhc3NNYXJrdXAgKyBcIj57MH17MX08L3RhYmxlPlwiXHJcbiAgXHJcbiAgICAjUGF0dGVybnMgZm9yIHRhYmxlIGNvbnRlbnRcclxuICAgIHRoID0gXCI8dGhlYWQ+ezB9PC90aGVhZD5cIlxyXG4gICAgdGIgPSBcIjx0Ym9keT57MH08L3Rib2R5PlwiXHJcbiAgICB0ciA9IFwiPHRyPnswfTwvdHI+XCJcclxuICAgIHRoUm93ID0gXCI8dGg+ezB9PC90aD5cIlxyXG4gICAgdGRSb3cgPSBcIjx0ZD57MH08L3RkPlwiXHJcbiAgICB0aENvbiA9IFwiXCJcclxuICAgIHRiQ29uID0gXCJcIlxyXG4gICAgdHJDb24gPSBcIlwiXHJcbiAgICBpZiBwYXJzZWRKc29uXHJcbiAgICAgIGlzU3RyaW5nQXJyYXkgPSB0eXBlb2YgKHBhcnNlZEpzb25bMF0pIGlzIFwic3RyaW5nXCJcclxuICAgICAgaGVhZGVycyA9IHVuZGVmaW5lZFxyXG4gICAgXHJcbiAgICAgICMgQ3JlYXRlIHRhYmxlIGhlYWRlcnMgZnJvbSBKU09OIGRhdGFcclxuICAgICAgIyBJZiBKU09OIGRhdGEgaXMgYSBzaW1wbGUgc3RyaW5nIGFycmF5IHdlIGNyZWF0ZSBhIHNpbmdsZSB0YWJsZSBoZWFkZXJcclxuICAgICAgaWYgaXNTdHJpbmdBcnJheVxyXG4gICAgICAgIHRoQ29uICs9IHRoUm93LmZvcm1hdChcInZhbHVlXCIpXHJcbiAgICAgIGVsc2VcclxuICAgICAgXHJcbiAgICAgICAgIyBJZiBKU09OIGRhdGEgaXMgYW4gb2JqZWN0IGFycmF5LCBoZWFkZXJzIGFyZSBhdXRvbWF0aWNhbGx5IGNvbXB1dGVkXHJcbiAgICAgICAgaWYgdHlwZW9mIChwYXJzZWRKc29uWzBdKSBpcyBcIm9iamVjdFwiXHJcbiAgICAgICAgICBoZWFkZXJzID0gYXJyYXlfa2V5cyhwYXJzZWRKc29uWzBdKVxyXG4gICAgICAgICAgaSA9IDBcclxuICAgICAgICAgIHdoaWxlIGkgPCBoZWFkZXJzLmxlbmd0aFxyXG4gICAgICAgICAgICB0aENvbiArPSB0aFJvdy5mb3JtYXQoaGVhZGVyc1tpXSlcclxuICAgICAgICAgICAgaSsrXHJcbiAgICAgIHRoID0gdGguZm9ybWF0KHRyLmZvcm1hdCh0aENvbikpXHJcbiAgICBcclxuICAgICAgIyBDcmVhdGUgdGFibGUgcm93cyBmcm9tIEpzb24gZGF0YVxyXG4gICAgICBpZiBpc1N0cmluZ0FycmF5XHJcbiAgICAgICAgaSA9IDBcclxuICAgICAgICB3aGlsZSBpIDwgcGFyc2VkSnNvbi5sZW5ndGhcclxuICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChwYXJzZWRKc29uW2ldKVxyXG4gICAgICAgICAgdHJDb24gKz0gdHIuZm9ybWF0KHRiQ29uKVxyXG4gICAgICAgICAgdGJDb24gPSBcIlwiXHJcbiAgICAgICAgICBpKytcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGlmIGhlYWRlcnNcclxuICAgICAgICAgIHVybFJlZ0V4cCA9IG5ldyBSZWdFeHAoLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9nKVxyXG4gICAgICAgICAgamF2YXNjcmlwdFJlZ0V4cCA9IG5ldyBSZWdFeHAoLyheamF2YXNjcmlwdDpbXFxzXFxTXSo7JCkvZylcclxuICAgICAgICAgIGkgPSAwXHJcbiAgICAgICAgICB3aGlsZSBpIDwgcGFyc2VkSnNvbi5sZW5ndGhcclxuICAgICAgICAgICAgaiA9IDBcclxuICAgICAgICAgICAgd2hpbGUgaiA8IGhlYWRlcnMubGVuZ3RoXHJcbiAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZWRKc29uW2ldW2hlYWRlcnNbal1dXHJcbiAgICAgICAgICAgICAgaXNVcmwgPSB1cmxSZWdFeHAudGVzdCh2YWx1ZSkgb3IgamF2YXNjcmlwdFJlZ0V4cC50ZXN0KHZhbHVlKVxyXG4gICAgICAgICAgICAgIGlmIGlzVXJsICMgSWYgdmFsdWUgaXMgVVJMIHdlIGF1dG8tY3JlYXRlIGEgbGlua1xyXG4gICAgICAgICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KGxpbmsuZm9ybWF0KHZhbHVlKSlcclxuICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBpZiB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICBpZiB0eXBlb2YgKHZhbHVlKSBpcyBcIm9iamVjdFwiXHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICNmb3Igc3VwcG9ydGluZyBuZXN0ZWQgdGFibGVzXHJcbiAgICAgICAgICAgICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KENvbnZlcnRKc29uVG9UYWJsZShldmFsKHZhbHVlLmRhdGEpLCB2YWx1ZS50YWJsZUlkLCB2YWx1ZS50YWJsZUNsYXNzTmFtZSwgdmFsdWUubGlua1RleHQpKVxyXG4gICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgZWxzZSAjIElmIHZhbHVlID09IG51bGwgd2UgZm9ybWF0IGl0IGxpa2UgUGhwTXlBZG1pbiBOVUxMIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQoaXRhbGljLmZvcm1hdCh2YWx1ZSkudG9VcHBlckNhc2UoKSlcclxuICAgICAgICAgICAgICBqKytcclxuICAgICAgICAgICAgdHJDb24gKz0gdHIuZm9ybWF0KHRiQ29uKVxyXG4gICAgICAgICAgICB0YkNvbiA9IFwiXCJcclxuICAgICAgICAgICAgaSsrXHJcbiAgICAgIHRiID0gdGIuZm9ybWF0KHRyQ29uKVxyXG4gICAgICB0YmwgPSB0YmwuZm9ybWF0KHRoLCB0YilcclxuICAgIEB0YWJsZSA9IHRibFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBKc29uVG9UYWJsZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmFycmF5MkQgPSAoaW5pdExlbmd0aCwgaW5pdFdpZHRoKSAtPlxyXG4gIGFycmF5ID0gW11cclxuICBtYXhMZW5ndGggPSAwXHJcbiAgbWF4V2lkdGggPSAwXHJcbiAgICBcclxuICByZXQgPSBcclxuICAgIGdldDogKHJvd05vLCBjb2xObykgLT5cclxuICAgICAgZXh0ZW5kIHJvd05vLCBjb2xOb1xyXG4gICAgc2V0OiAocm93Tm8sIGNvbE5vLCB2YWwpIC0+XHJcbiAgICAgIHJldC5nZXQgcm93Tm8sIGNvbE5vXHJcbiAgICAgIHJvd0lkeCA9IHJvd05vLTFcclxuICAgICAgY29sSWR4ID0gY29sTm8tMVxyXG4gICAgICBhcnJheVtyb3dJZHhdW2NvbElkeF0gPSB2YWxcclxuICAgIGVhY2g6IChjYWxsQmFjaykgLT5cclxuICAgICAgXy5lYWNoIGFycmF5LCAoY29sdW1ucywgcm93KSAtPlxyXG4gICAgICAgIF8uZWFjaCBhcnJheVtyb3ddLCAodmFsLCBjb2wpIC0+XHJcbiAgICAgICAgICByb3dJZHggPSByb3crMVxyXG4gICAgICAgICAgY29sSWR4ID0gY29sKzFcclxuICAgICAgICAgIGNhbGxCYWNrIHJvd0lkeCwgY29sSWR4LCB2YWxcclxuICAgIHdpZHRoOiAoKSAtPlxyXG4gICAgICBtYXhXaWR0aFxyXG4gICAgbGVuZ3RoOiAoKSAtPlxyXG4gICAgICBtYXhMZW5ndGhcclxuICAgICAgICAgXHJcbiAgIyMjXHJcbiAgR3VhcmFudGVlIHRoYXQgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGFycmF5IGFyZSBhbHdheXMgYmFja2VkIGJ5IHZhbHVlcyBhdCBldmVyeSBwb3NpdGlvblxyXG4gICMjIyAgICAgICAgICAgICAgICAgICAgXHJcbiAgZXh0ZW5kID0gKGxlbmd0aCwgd2lkdGgpIC0+ICBcclxuICAgIGlmIG5vdCBsZW5ndGggb3IgbGVuZ3RoIDwgMSB0aGVuIGxlbmd0aCA9IDFcclxuICAgIGlmIG5vdCB3aWR0aCBvciB3aWR0aCA8IDEgdGhlbiB3aWR0aCA9IDFcclxuICAgICAgXHJcbiAgICBpZiBtYXhMZW5ndGggPCBsZW5ndGggdGhlbiBtYXhMZW5ndGggPSBsZW5ndGhcclxuICAgIGlmIGFycmF5Lmxlbmd0aCA+IG1heExlbmd0aCB0aGVuIG1heExlbmd0aCA9IGFycmF5Lmxlbmd0aFxyXG4gICAgaWYgbWF4V2lkdGggPCB3aWR0aCB0aGVuIG1heFdpZHRoID0gd2lkdGhcclxuICAgIGkgPSAwXHJcbiAgICAgIFxyXG4gICAgd2hpbGUgaSA8IG1heExlbmd0aFxyXG4gICAgICB0cnlSb3cgPSBhcnJheVtpXVxyXG4gICAgICBpZiBub3QgdHJ5Um93XHJcbiAgICAgICAgdHJ5Um93ID0gW11cclxuICAgICAgICBhcnJheS5wdXNoIHRyeVJvd1xyXG4gICAgICBpZiBtYXhXaWR0aCA8IHRyeVJvdy5sZW5ndGggdGhlbiBtYXhXaWR0aCA9IHRyeVJvdy5sZW5ndGhcclxuICAgICAgaWYgdHJ5Um93Lmxlbmd0aCA8IG1heFdpZHRoIHRoZW4gdHJ5Um93Lmxlbmd0aCA9IG1heFdpZHRoXHJcbiAgICAgIGkgKz0gMVxyXG4gICAgICBcclxuICAgIGFycmF5W2xlbmd0aC0xXVt3aWR0aC0xXVxyXG4gICAgICAgXHJcbiAgZXh0ZW5kIGluaXRMZW5ndGgsIGluaXRXaWR0aFxyXG4gICAgXHJcbiAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAnYXJyYXkyRCcsIGFycmF5MkRcclxubW9kdWxlLmV4cG9ydHMgPSBhcnJheTJEIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxubWV0aG9kcyA9IFtcclxuICAnYXNzZXJ0J1xyXG4gICdjbGVhcidcclxuICAnY291bnQnXHJcbiAgJ2RlYnVnJ1xyXG4gICdkaXInXHJcbiAgJ2RpcnhtbCdcclxuICAnZXJyb3InXHJcbiAgJ2V4Y2VwdGlvbidcclxuICAnZ3JvdXAnXHJcbiAgJ2dyb3VwQ29sbGFwc2VkJ1xyXG4gICdncm91cEVuZCdcclxuICAnaW5mbydcclxuICAnbG9nJ1xyXG4gICdtZW1vcnknXHJcbiAgJ3Byb2ZpbGUnXHJcbiAgJ3Byb2ZpbGVFbmQnXHJcbiAgJ3RhYmxlJ1xyXG4gICd0aW1lJ1xyXG4gICd0aW1lRW5kJ1xyXG4gICd0aW1lU3RhbXAnXHJcbiAgJ3RpbWVsaW5lJ1xyXG4gICd0aW1lbGluZUVuZCdcclxuICAndHJhY2UnXHJcbiAgJ3dhcm4nXHJcbl1cclxubWV0aG9kTGVuZ3RoID0gbWV0aG9kcy5sZW5ndGhcclxuY29uc29sZSA9IE9KLmdsb2JhbC5jb25zb2xlIG9yIHt9XHJcbk9KLm1ha2VTdWJOYW1lU3BhY2UgJ2NvbnNvbGUnXHJcbiAgXHJcbiMjI1xyXG4xLiBTdHViIG91dCBhbnkgbWlzc2luZyBtZXRob2RzIHdpdGggbm9vcFxyXG4yLiBEZWZpbmUgdGhlIGF2YWlsYWJsZSBtZXRob2RzIG9uIHRoZSBPSi5jb25zb2xlIG9iamVjdFxyXG4jIyNcclxud2hpbGUgbWV0aG9kTGVuZ3RoLS1cclxuICAoLT5cclxuICAgIG1ldGhvZCA9IG1ldGhvZHNbbWV0aG9kTGVuZ3RoXVxyXG4gICAgXHJcbiAgICAjIE9ubHkgc3R1YiB1bmRlZmluZWQgbWV0aG9kcy5cclxuICAgIGNvbnNvbGVbbWV0aG9kXSA9IE9KLm5vb3AgdW5sZXNzIGNvbnNvbGVbbWV0aG9kXVxyXG4gICAgXHJcbiAgICAjRGVmaW5lIHRoZSBtZXRob2Qgb24gdGhlIE9KIGNvbnNvbGUgbmFtZXNwYWNlXHJcbiAgICBPSi5jb25zb2xlLnJlZ2lzdGVyIG1ldGhvZCwgKHBhcmFtcy4uLikgLT5cclxuICAgICAgY29uc29sZVttZXRob2RdIHBhcmFtcy4uLlxyXG4gICkoKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25zb2xlIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyICQsIE9KLCBhbGwsIGNvb2tpZXMsIGRlbCwgZGVsZXRlQWxsLCBnZXQsIHNldDtcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG4kID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuXG5cbi8qXG5TZXR1cCBzZXR0aW5nc1xuJC5jb29raWUucmF3ID0gdHJ1ZVxuJC5jb29raWUuanNvbiA9IHRydWVcbiAgXG5TZXR1cCBkZWZhdWx0c1xuaHR0cHM6Ly9naXRodWIuY29tL2NhcmhhcnRsL2pxdWVyeS1jb29raWUvXG4kLmNvb2tpZS5kZWZhdWx0cy5leHBpcmVzID0gMzY1XG4kLmNvb2tpZS5kZWZhdWx0cy5wYXRoID0gJy8nXG4kLmNvb2tpZS5kZWZhdWx0cy5kb21haW4gPSAnb2ouY29tJ1xuICovXG5cbmlmICghJCB8fCAhJC5jb29raWUpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdqUXVlcnkgQ29va2llIGlzIGEgcmVxdWlyZWQgZGVwZW5kZW5jeS4nKTtcbn1cblxuJC5jb29raWUuZGVmYXVsdHMuc2VjdXJlID0gZmFsc2U7XG5cbmNvb2tpZXMgPSB7fTtcblxuZ2V0ID0gZnVuY3Rpb24oY29va2llTmFtZSwgdHlwZSkge1xuICB2YXIgcmV0O1xuICByZXQgPSAnJztcbiAgaWYgKGNvb2tpZU5hbWUpIHtcbiAgICBpZiAodHlwZSkge1xuICAgICAgcmV0ID0gJC5jb29raWUoY29va2llTmFtZSwgdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldCA9ICQuY29va2llKGNvb2tpZU5hbWUpO1xuICAgIH1cbiAgICBpZiAocmV0KSB7XG4gICAgICByZXR1cm4gY29va2llc1tjb29raWVOYW1lXSA9IHJldDtcbiAgICB9XG4gIH1cbn07XG5cbmFsbCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcmV0O1xuICByZXQgPSAkLmNvb2tpZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuc2V0ID0gZnVuY3Rpb24oY29va2llTmFtZSwgdmFsdWUsIG9wdHMpIHtcbiAgdmFyIHJldDtcbiAgcmV0ID0gJyc7XG4gIGlmIChjb29raWVOYW1lKSB7XG4gICAgY29va2llc1tjb29raWVOYW1lXSA9IHZhbHVlO1xuICAgIGlmIChvcHRzKSB7XG4gICAgICByZXQgPSAkLmNvb2tpZShjb29raWVOYW1lLCB2YWx1ZSwgb3B0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldCA9ICQuY29va2llKGNvb2tpZU5hbWUsIHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbmRlbCA9IGZ1bmN0aW9uKGNvb2tpZU5hbWUsIG9wdHMpIHtcbiAgaWYgKGNvb2tpZU5hbWUpIHtcbiAgICBpZiAob3B0cykge1xuICAgICAgJC5yZW1vdmVDb29raWUoY29va2llTmFtZSwgb3B0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQucmVtb3ZlQ29va2llKGNvb2tpZU5hbWUpO1xuICAgIH1cbiAgICBkZWxldGUgY29va2llc1tjb29raWVOYW1lXTtcbiAgfVxufTtcblxuZGVsZXRlQWxsID0gZnVuY3Rpb24oKSB7XG4gIGNvb2tpZXMgPSB7fTtcbiAgT0ouZWFjaChPSi5jb29raWUuYWxsLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgIHJldHVybiBPSi5jb29raWVbXCJkZWxldGVcIl0oa2V5KTtcbiAgfSk7XG59O1xuXG5PSi5jb29raWUucmVnaXN0ZXIoJ2RlbGV0ZUFsbCcsIGRlbGV0ZUFsbCk7XG5cbk9KLmNvb2tpZS5yZWdpc3RlcignZGVsZXRlJywgZGVsKTtcblxuT0ouY29va2llLnJlZ2lzdGVyKCdzZXQnLCBzZXQpO1xuXG5PSi5jb29raWUucmVnaXN0ZXIoJ2dldCcsIGdldCk7XG5cbk9KLmNvb2tpZS5yZWdpc3RlcignYWxsJywgYWxsKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlbGV0ZUFsbDogZGVsZXRlQWxsLFxuICBcImRlbGV0ZVwiOiBkZWwsXG4gIHNldDogc2V0LFxuICBnZXQ6IGdldCxcbiAgYWxsOiBhbGxcbn07XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4MGIyOXNjMXhjWTI5dmEybGxMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJRVUVzU1VGQlFUczdRVUZCUVN4RlFVRkJMRWRCUVVzc1QwRkJRU3hEUVVGUkxFOUJRVkk3TzBGQlEwd3NRMEZCUVN4SFFVRkpMRTlCUVVFc1EwRkJVU3hSUVVGU096czdRVUZGU2pzN096czdPenM3T3pzN08wRkJWMEVzU1VGQlJ5eERRVUZKTEVOQlFVb3NTVUZCVXl4RFFVRkpMRU5CUVVNc1EwRkJReXhOUVVGc1FqdEJRVU5GTEZGQlFWVXNTVUZCUVN4TFFVRkJMRU5CUVUwc2VVTkJRVTRzUlVGRVdqczdPMEZCUlVFc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCYkVJc1IwRkJNa0k3TzBGQlJUTkNMRTlCUVVFc1IwRkJWVHM3UVVGRlZpeEhRVUZCTEVkQlFVMHNVMEZCUXl4VlFVRkVMRVZCUVdFc1NVRkJZanRCUVVOS0xFMUJRVUU3UlVGQlFTeEhRVUZCTEVkQlFVMDdSVUZEVGl4SlFVRkhMRlZCUVVnN1NVRkRSU3hKUVVGSExFbEJRVWc3VFVGRFJTeEhRVUZCTEVkQlFVMHNRMEZCUXl4RFFVRkRMRTFCUVVZc1EwRkJVeXhWUVVGVUxFVkJRWEZDTEVsQlFYSkNMRVZCUkZJN1MwRkJRU3hOUVVGQk8wMUJSMFVzUjBGQlFTeEhRVUZOTEVOQlFVTXNRMEZCUXl4TlFVRkdMRU5CUVZNc1ZVRkJWQ3hGUVVoU096dEpRVWxCTEVsQlFVY3NSMEZCU0R0aFFVTkZMRTlCUVZFc1EwRkJRU3hWUVVGQkxFTkJRVklzUjBGQmMwSXNTVUZFZUVJN1MwRk1SanM3UVVGR1NUczdRVUZWVGl4SFFVRkJMRWRCUVUwc1UwRkJRVHRCUVVOS0xFMUJRVUU3UlVGQlFTeEhRVUZCTEVkQlFVMHNRMEZCUXl4RFFVRkRMRTFCUVVZc1EwRkJRVHRUUVVOT08wRkJSa2s3TzBGQlNVNHNSMEZCUVN4SFFVRk5MRk5CUVVNc1ZVRkJSQ3hGUVVGaExFdEJRV0lzUlVGQmIwSXNTVUZCY0VJN1FVRkRTaXhOUVVGQk8wVkJRVUVzUjBGQlFTeEhRVUZOTzBWQlEwNHNTVUZCUnl4VlFVRklPMGxCUTBVc1QwRkJVU3hEUVVGQkxGVkJRVUVzUTBGQlVpeEhRVUZ6UWp0SlFVTjBRaXhKUVVGSExFbEJRVWc3VFVGRFJTeEhRVUZCTEVkQlFVMHNRMEZCUXl4RFFVRkRMRTFCUVVZc1EwRkJVeXhWUVVGVUxFVkJRWEZDTEV0QlFYSkNMRVZCUVRSQ0xFbEJRVFZDTEVWQlJGSTdTMEZCUVN4TlFVRkJPMDFCUjBVc1IwRkJRU3hIUVVGTkxFTkJRVU1zUTBGQlF5eE5RVUZHTEVOQlFWTXNWVUZCVkN4RlFVRnhRaXhMUVVGeVFpeEZRVWhTTzB0QlJrWTdPMU5CVFVFN1FVRlNTVHM3UVVGVlRpeEhRVUZCTEVkQlFVMHNVMEZCUXl4VlFVRkVMRVZCUVdFc1NVRkJZanRGUVVOS0xFbEJRVWNzVlVGQlNEdEpRVU5GTEVsQlFVY3NTVUZCU0R0TlFVTkZMRU5CUVVNc1EwRkJReXhaUVVGR0xFTkJRV1VzVlVGQlppeEZRVUV5UWl4SlFVRXpRaXhGUVVSR08wdEJRVUVzVFVGQlFUdE5RVWRGTEVOQlFVTXNRMEZCUXl4WlFVRkdMRU5CUVdVc1ZVRkJaaXhGUVVoR096dEpRVWxCTEU5QlFVOHNUMEZCVVN4RFFVRkJMRlZCUVVFc1JVRk1ha0k3TzBGQlJFazdPMEZCVTA0c1UwRkJRU3hIUVVGWkxGTkJRVUU3UlVGRFZpeFBRVUZCTEVkQlFWVTdSVUZEVml4RlFVRkZMRU5CUVVNc1NVRkJTQ3hEUVVGUkxFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNSMEZCYkVJc1JVRkJkVUlzVTBGQlF5eEhRVUZFTEVWQlFVMHNSMEZCVGp0WFFVTnlRaXhGUVVGRkxFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFVUXNRMEZCVkN4RFFVRnBRaXhIUVVGcVFqdEZRVVJ4UWl4RFFVRjJRanRCUVVaVk96dEJRVTFZTEVWQlFVVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1VVRkJWaXhEUVVGdFFpeFhRVUZ1UWl4RlFVRm5ReXhUUVVGb1F6czdRVUZEUVN4RlFVRkZMRU5CUVVNc1RVRkJUU3hEUVVGRExGRkJRVllzUTBGQmJVSXNVVUZCYmtJc1JVRkJOa0lzUjBGQk4wSTdPMEZCUTBFc1JVRkJSU3hEUVVGRExFMUJRVTBzUTBGQlF5eFJRVUZXTEVOQlFXMUNMRXRCUVc1Q0xFVkJRVEJDTEVkQlFURkNPenRCUVVOQkxFVkJRVVVzUTBGQlF5eE5RVUZOTEVOQlFVTXNVVUZCVml4RFFVRnRRaXhMUVVGdVFpeEZRVUV3UWl4SFFVRXhRanM3UVVGRFFTeEZRVUZGTEVOQlFVTXNUVUZCVFN4RFFVRkRMRkZCUVZZc1EwRkJiVUlzUzBGQmJrSXNSVUZCTWtJc1IwRkJNMEk3TzBGQlJVRXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkRRenRGUVVGQkxGTkJRVUVzUlVGQlZ5eFRRVUZZTzBWQlEwRXNVVUZCUVN4RlFVRlJMRWRCUkZJN1JVRkZRU3hIUVVGQkxFVkJRVXNzUjBGR1REdEZRVWRCTEVkQlFVRXNSVUZCU3l4SFFVaE1PMFZCU1VFc1IwRkJRU3hGUVVGTkxFZEJTazRpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklrOUtJRDBnY21WeGRXbHlaU0FuTGk0dmIyb25YSEpjYmlRZ1BTQnlaWEYxYVhKbElDZHFjWFZsY25rblhISmNiaUFnWEhKY2JpTWpJMXh5WEc1VFpYUjFjQ0J6WlhSMGFXNW5jMXh5WEc0a0xtTnZiMnRwWlM1eVlYY2dQU0IwY25WbFhISmNiaVF1WTI5dmEybGxMbXB6YjI0Z1BTQjBjblZsWEhKY2JpQWdYSEpjYmxObGRIVndJR1JsWm1GMWJIUnpYSEpjYm1oMGRIQnpPaTh2WjJsMGFIVmlMbU52YlM5allYSm9ZWEowYkM5cWNYVmxjbmt0WTI5dmEybGxMMXh5WEc0a0xtTnZiMnRwWlM1a1pXWmhkV3gwY3k1bGVIQnBjbVZ6SUQwZ016WTFYSEpjYmlRdVkyOXZhMmxsTG1SbFptRjFiSFJ6TG5CaGRHZ2dQU0FuTHlkY2NseHVKQzVqYjI5cmFXVXVaR1ZtWVhWc2RITXVaRzl0WVdsdUlEMGdKMjlxTG1OdmJTZGNjbHh1SXlNalhISmNibWxtSUc1dmRDQWtJRzl5SUc1dmRDQWtMbU52YjJ0cFpWeHlYRzRnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaUFuYWxGMVpYSjVJRU52YjJ0cFpTQnBjeUJoSUhKbGNYVnBjbVZrSUdSbGNHVnVaR1Z1WTNrdUp5QWdYSEpjYmlRdVkyOXZhMmxsTG1SbFptRjFiSFJ6TG5ObFkzVnlaU0E5SUdaaGJITmxYSEpjYmlBZ1hISmNibU52YjJ0cFpYTWdQU0I3ZlZ4eVhHNGdJRnh5WEc1blpYUWdQU0FvWTI5dmEybGxUbUZ0WlN3Z2RIbHdaU2tnTFQ1Y2NseHVJQ0J5WlhRZ1BTQW5KMXh5WEc0Z0lHbG1JR052YjJ0cFpVNWhiV1ZjY2x4dUlDQWdJR2xtSUhSNWNHVmNjbHh1SUNBZ0lDQWdjbVYwSUQwZ0pDNWpiMjlyYVdVZ1kyOXZhMmxsVG1GdFpTd2dkSGx3WlZ4eVhHNGdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQnlaWFFnUFNBa0xtTnZiMnRwWlNCamIyOXJhV1ZPWVcxbElDQWdJRnh5WEc0Z0lDQWdhV1lnY21WMFhISmNiaUFnSUNBZ0lHTnZiMnRwWlhOYlkyOXZhMmxsVG1GdFpWMGdQU0J5WlhSY2NseHVJQ0JjY2x4dVlXeHNJRDBnTFQ1Y2NseHVJQ0J5WlhRZ1BTQWtMbU52YjJ0cFpTZ3BYSEpjYmlBZ2NtVjBYSEpjYmlBZ0lDQmNjbHh1YzJWMElEMGdLR052YjJ0cFpVNWhiV1VzSUhaaGJIVmxMQ0J2Y0hSektTQXRQbHh5WEc0Z0lISmxkQ0E5SUNjblhISmNiaUFnYVdZZ1kyOXZhMmxsVG1GdFpWeHlYRzRnSUNBZ1kyOXZhMmxsYzF0amIyOXJhV1ZPWVcxbFhTQTlJSFpoYkhWbFhISmNiaUFnSUNCcFppQnZjSFJ6WEhKY2JpQWdJQ0FnSUhKbGRDQTlJQ1F1WTI5dmEybGxJR052YjJ0cFpVNWhiV1VzSUhaaGJIVmxMQ0J2Y0hSelhISmNiaUFnSUNCbGJITmxYSEpjYmlBZ0lDQWdJSEpsZENBOUlDUXVZMjl2YTJsbElHTnZiMnRwWlU1aGJXVXNJSFpoYkhWbFhISmNiaUFnY21WMElDQmNjbHh1SUNCY2NseHVaR1ZzSUQwZ0tHTnZiMnRwWlU1aGJXVXNJRzl3ZEhNcElDMCtYSEpjYmlBZ2FXWWdZMjl2YTJsbFRtRnRaVnh5WEc0Z0lDQWdhV1lnYjNCMGMxeHlYRzRnSUNBZ0lDQWtMbkpsYlc5MlpVTnZiMnRwWlNCamIyOXJhV1ZPWVcxbExDQnZjSFJ6WEhKY2JpQWdJQ0JsYkhObFhISmNiaUFnSUNBZ0lDUXVjbVZ0YjNabFEyOXZhMmxsSUdOdmIydHBaVTVoYldVZ0lDQWdYSEpjYmlBZ0lDQmtaV3hsZEdVZ1kyOXZhMmxsYzF0amIyOXJhV1ZPWVcxbFhWeHlYRzRnSUhKbGRIVnlibHh5WEc0Z0lDQWdYSEpjYm1SbGJHVjBaVUZzYkNBOUlDMCtYSEpjYmlBZ1kyOXZhMmxsY3lBOUlIdDlYSEpjYmlBZ1Qwb3VaV0ZqYUNCUFNpNWpiMjlyYVdVdVlXeHNMQ0FvZG1Gc0xDQnJaWGtwSUMwK1hISmNiaUFnSUNCUFNpNWpiMjlyYVdVdVpHVnNaWFJsSUd0bGVTQWdYSEpjYmlBZ2NtVjBkWEp1WEhKY2JpQWdJQ0JjY2x4dUlFOUtMbU52YjJ0cFpTNXlaV2RwYzNSbGNpQW5aR1ZzWlhSbFFXeHNKeXdnWkdWc1pYUmxRV3hzWEhKY2JpQlBTaTVqYjI5cmFXVXVjbVZuYVhOMFpYSWdKMlJsYkdWMFpTY3NJR1JsYkZ4eVhHNGdUMG91WTI5dmEybGxMbkpsWjJsemRHVnlJQ2R6WlhRbkxDQnpaWFJjY2x4dUlFOUtMbU52YjJ0cFpTNXlaV2RwYzNSbGNpQW5aMlYwSnl3Z1oyVjBYSEpjYmlCUFNpNWpiMjlyYVdVdWNtVm5hWE4wWlhJZ0oyRnNiQ2NzSUNCaGJHeGNjbHh1SUZ4eVhHNGdiVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQmNjbHh1SUNCa1pXeGxkR1ZCYkd3NklHUmxiR1YwWlVGc2JGeHlYRzRnSUdSbGJHVjBaVG9nWkdWc1hISmNiaUFnYzJWME9pQnpaWFJjY2x4dUlDQm5aWFE2SUdkbGRGeHlYRzRnSUdGc2JEb2dJR0ZzYkNKZGZRPT0iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5kZWZlciA9IChtZXRob2QsIHdhaXRNcykgLT5cclxuICBpZiB3YWl0TXMgYW5kIHNldFRpbWVvdXRcclxuICAgIHNldFRpbWVvdXQgbWV0aG9kLCB3YWl0TXNcclxuICAobmV3IFByb21pc2UgKHJlc29sdmUpIC0+XHJcbiAgICByZXNvbHZlKCkpLnRoZW4gbWV0aG9kXHJcbiAgXHJcbk9KLnJlZ2lzdGVyICdkZWZlcicsIGRlZmVyXHJcbm1vZHVsZS5leHBvcnRzID0gZGVmZXIiLCIjICMgZWFjaFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMgIyMgY2FuRWFjaFxyXG5jYW5FYWNoID0gKG9iaikgLT5cclxuICAjIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgW2lzXShpcy5odG1sKSB0cnVseSBpdGVyYWJsZSAoZS5nLiBhbiBpbnN0YW5jZSBvZiBPYmplY3Qgb3IgQXJyYXkpXHJcbiAgT0ouaXMucGxhaW5PYmplY3Qob2JqKSBvciBPSi5pcy5vYmplY3Qob2JqKSBvciBPSi5pcy5hcnJheSBvYmpcclxuXHJcbiMgIyMgW09KXShvai5odG1sKS5lYWNoXHJcblxyXG4jIEl0ZXJhdGUgYWxsIG9mIHRoZSBtZW1iZXJzIG9mIGFuIG9iamVjdCAob3IgYW4gYXJyYXkpIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYW5kIHJlY3Vyc2lvbi5cclxuXHJcbiMgLSBgb2JqYDogdGhlIG9iamVjdCB0byBpdGVyYXRlLFxyXG4jIC0gYG9uRWFjaGA6IGEgY2FsbGJhY2sgdG8gZXhlY3V0ZSBmb3IgZWFjaCBpdGVyYXRpb24sXHJcbiMgLSBgcmVjdXJzaXZlYDogaWYgdHJ1ZSwgcmVjdXJzaXZlbHkgaXRlcmF0ZSBhbGwgdmFsaWQgY2hpbGQgb2JqZWN0cy5cclxuZWFjaCA9IChvYmosIG9uRWFjaCwgcmVjdXJzaXZlKSAtPlxyXG4gIGlmIGNhbkVhY2ggb2JqXHJcbiAgICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI2Zvcm93bikncyBgZm9yT3duYCBtZXRob2QgdG8gZW5zdXJlIHRoYXQgb25seSB0aGUgYWN0dWFsIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdCBhcmUgZW51bWVyYXRlZC5cclxuXHJcbiAgICAjIC0gYG9uRWFjaGAgY2FsbGJhY2sgd2lsbCByZWNlaXZlIDIgcGFyYW1ldGVyczpcclxuICAgICMgLSBgdmFsYCBhbmQgYGtleWAuXHJcbiAgICAjIC0gYHZhbGAgaXMgYWx3YXlzIHRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuXHJcbiAgICAjIC0gYGtleWAgaXMgZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBvciB0aGUgY3VycmVudCBpbmRleCBvZiB0aGUgYXJyYXkuXHJcbiAgICBfLmZvck93biBvYmosICh2YWwsIGtleSkgLT5cclxuICAgICAgaWYgb25FYWNoIGFuZCAodmFsIG9yIGtleSlcclxuICAgICAgICBxdWl0ID0gb25FYWNoIHZhbCwga2V5XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlICBpZiBmYWxzZSBpcyBxdWl0XHJcbiAgICAgIGVhY2ggdmFsLCBvbkVhY2gsIHRydWUgIGlmIHRydWUgaXMgcmVjdXJzaXZlXHJcbiAgICAgIHJldHVyblxyXG5cclxuICByZXR1cm5cclxuXHJcbiMgIyMgcmVnaXN0ZXJcclxuXHJcbiMgcmVnaXN0ZXIgdGhlIGBlYWNoYCBtZXRob2Qgb24gdGhlIFtPSl0oT0ouaHRtbCkgbmFtZXNwYWNlXHJcbk9KLnJlZ2lzdGVyICdlYWNoJywgZWFjaFxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhY2giLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG51bmtub3duID0gJ3Vua25vd24nICAgXHJcbiAgXHJcbmlucHV0VHlwZXMgPVxyXG4gIGJ1dHRvbjogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAwXHJcbiAgICBuYW1lOiAnYnV0dG9uJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBjaGVja2JveDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxXHJcbiAgICBuYW1lOiAnY2hlY2tib3gnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgY29sb3I6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMlxyXG4gICAgbmFtZTogJ2NvbG9yJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGRhdGU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogM1xyXG4gICAgbmFtZTogJ2RhdGUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBkYXRldGltZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA0XHJcbiAgICBuYW1lOiAnZGF0ZXRpbWUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgJ2RhdGV0aW1lLWxvY2FsJzogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA1XHJcbiAgICBuYW1lOiAnZGF0ZXRpbWUtbG9jYWwnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBlbWFpbDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA2XHJcbiAgICBuYW1lOiAnZW1haWwnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGZpbGU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogN1xyXG4gICAgbmFtZTogJ2ZpbGUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogZmFsc2VcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBoaWRkZW46ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogOFxyXG4gICAgbmFtZTogJ2hpZGRlbidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgaW1hZ2U6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogOVxyXG4gICAgbmFtZTogJ2ltYWdlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBtb250aDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxMFxyXG4gICAgbmFtZTogJ21vbnRoJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBudW1iZXI6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTFcclxuICAgIG5hbWU6ICdudW1iZXInXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcGFzc3dvcmQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTJcclxuICAgIG5hbWU6ICdwYXNzd29yZCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHJhZGlvOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDEzXHJcbiAgICBuYW1lOiAncmFkaW8nXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcmFuZ2U6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTRcclxuICAgIG5hbWU6ICdyYW5nZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICByZXNldDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxNVxyXG4gICAgbmFtZTogJ3Jlc2V0J1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBzZWFyY2g6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTZcclxuICAgIG5hbWU6ICdzZWFyY2gnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBzdWJtaXQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTdcclxuICAgIG5hbWU6ICdzdWJtaXQnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHRlbDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxOFxyXG4gICAgbmFtZTogJ2J1dHRvbidcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHRleHQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTlcclxuICAgIG5hbWU6ICd0ZXh0J1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB0aW1lOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDIwXHJcbiAgICBuYW1lOiAndGltZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHVybDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMVxyXG4gICAgbmFtZTogJ3VybCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgd2VlazogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMlxyXG4gICAgbmFtZTogJ3dlZWsnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG5PSi5lbnVtcy5yZWdpc3RlciAndW5rbm93bicsIHVua25vd25cclxuT0ouZW51bXMucmVnaXN0ZXIgJ2lucHV0VHlwZXMnLCBpbnB1dFR5cGVzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFxyXG4gIHVua25vd246IHVua25vd25cclxuICBpbnB1dFR5cGVzOiBpbnB1dFR5cGVzIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbmlmIE9KLmdsb2JhbC5hZGRFdmVudExpc3RlbmVyXHJcbiAgZXZlbnROYW1lID0gJ2FkZEV2ZW50TGlzdGVuZXInXHJcbiAgZXZlbnRJbmZvID0gJydcclxuZWxzZSBcclxuICBldmVudE5hbWUgPSAnYXR0YWNoRXZlbnQnXHJcbiAgZXZlbnRJbmZvID0gJ29uJ1xyXG4gIFxyXG5wdXNoU3RhdGUgPSAocGFnZU5hbWUsIGV2ZW50KSAtPlxyXG4gIGlmIHBhZ2VOYW1lXHJcbiAgICAjIGtlZXAgdGhlIGxpbmsgaW4gdGhlIGJyb3dzZXIgaGlzdG9yeVxyXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUgbnVsbCwgbnVsbCwgJyMnICsgcGFnZU5hbWVcclxuICAgICAgXHJcbiAgICAjIGhlcmUgY2FuIGNhdXNlIGRhdGEgbG9hZGluZywgZXRjLlxyXG4gICAgXHJcbiAgICBpZiBldmVudCAgICBcclxuICAgICAgIyBkbyBub3QgZ2l2ZSBhIGRlZmF1bHQgYWN0aW9uXHJcbiAgICAgIGlmIGV2ZW50LnByZXZlbnREZWZhdWx0XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZVxyXG4gIGZhbHNlXHJcbiAgXHJcbnJlc3RvcmVTdGF0ZSA9IChsb2NhdGlvbikgLT5cclxuICBwYWdlTmFtZSA9IGxvY2F0aW9uLmhhc2hcclxuICBpZiBub3QgcGFnZU5hbWVcclxuICAgIHBhZ2VOYW1lID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzFdXHJcbiAgaWYgcGFnZU5hbWVcclxuICAgIHBhZ2VOYW1lID0gcGFnZU5hbWUucmVwbGFjZSAnIycsICcnXHJcbiAgICBPSi5wdWJsaXNoICdyZXN0b3JlU3RhdGUnLCBwYWdlTmFtZTogcGFnZU5hbWUsIGxvY2F0aW9uOiBsb2NhdGlvblxyXG4gIHJldHVyblxyXG4gIFxyXG4jIyMgXHJcbmhhbmcgb24gdGhlIGV2ZW50LCBhbGwgcmVmZXJlbmNlcyBpbiB0aGlzIGRvY3VtZW50XHJcbiMjI1xyXG4gIFxyXG4jIyNcclxuIyBUaGlzIGJpbmRzIHRvIHRoZSBkb2N1bWVudCBjbGljayBldmVudCwgd2hpY2ggaW4gdHVybiBhdHRhY2hlcyB0byBldmVyeSBjbGljayBldmVudCwgY2F1c2luZyB1bmV4cGVjdGVkIGJlaGF2aW9yLlxyXG4jIEZvciBhbnkgY29udHJvbCB3aGljaCB3aXNoZXMgdG8gdHJpZ2dlciBhIHN0YXRlIGNoYW5nZSBpbiByZXNwb25zZSB0byBhbiBldmVudCwgaXQgaXMgYmV0dGVyIGZvciB0aGF0IGNvbnRyb2wgdG8gZGVmaW5lIHRoZSBiZWhhdmlvci5cclxuT0ouZG9jdW1lbnRbZXZlbnROYW1lXSBldmVudEluZm8gKyAnY2xpY2snLCAoKGV2ZW50KSAtPlxyXG4gIGV2ZW50ID0gZXZlbnQgb3Igd2luZG93LmV2ZW50XHJcbiAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IG9yIGV2ZW50LnNyY0VsZW1lbnRcclxuICAgIFxyXG4gICMgbG9va2luZyBmb3IgYWxsIHRoZSBsaW5rcyB3aXRoICdhamF4JyBjbGFzcyBmb3VuZFxyXG4gIGlmIHRhcmdldCBhbmQgdGFyZ2V0Lm5vZGVOYW1lIGlzICdBJyBhbmQgKCcgJyArIHRhcmdldC5jbGFzc05hbWUgKyAnICcpLmluZGV4T2YoJ2FqYXgnKSA+PSAwXHJcbiAgICBPSi5wdXNoU3RhdGUgdGFyZ2V0LmhyZWYsIGV2ZW50XHJcbiAgICAgIFxyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4pLCBmYWxzZVxyXG4jIyNcclxuXHJcbiMjI1xyXG5oYW5nIG9uIHBvcHN0YXRlIGV2ZW50IHRyaWdnZXJlZCBieSBwcmVzc2luZyBiYWNrL2ZvcndhcmQgaW4gYnJvd3NlclxyXG4jIyNcclxuT0ouZ2xvYmFsW2V2ZW50TmFtZV0gZXZlbnRJbmZvICsgJ3BvcHN0YXRlJywgKChldmVudCkgLT5cclxuICAgIFxyXG4gICMgd2UgZ2V0IGEgbm9ybWFsIExvY2F0aW9uIG9iamVjdFxyXG4gICAgXHJcbiAgIyMjXHJcbiAgTm90ZSwgdGhpcyBpcyB0aGUgb25seSBkaWZmZXJlbmNlIHdoZW4gdXNpbmcgdGhpcyBsaWJyYXJ5LFxyXG4gIGJlY2F1c2UgdGhlIG9iamVjdCBkb2N1bWVudC5sb2NhdGlvbiBjYW5ub3QgYmUgb3ZlcnJpZGVuLFxyXG4gIHNvIGxpYnJhcnkgdGhlIHJldHVybnMgZ2VuZXJhdGVkICdsb2NhdGlvbicgb2JqZWN0IHdpdGhpblxyXG4gIGFuIG9iamVjdCB3aW5kb3cuaGlzdG9yeSwgc28gZ2V0IGl0IG91dCBvZiAnaGlzdG9yeS5sb2NhdGlvbicuXHJcbiAgRm9yIGJyb3dzZXJzIHN1cHBvcnRpbmcgJ2hpc3RvcnkucHVzaFN0YXRlJyBnZXQgZ2VuZXJhdGVkXHJcbiAgb2JqZWN0ICdsb2NhdGlvbicgd2l0aCB0aGUgdXN1YWwgJ2RvY3VtZW50LmxvY2F0aW9uJy5cclxuICAjIyMgICAgICAgICAgICAgICAgICAgICBcclxuICByZXR1cm5Mb2NhdGlvbiA9IGhpc3RvcnkubG9jYXRpb24gb3IgZG9jdW1lbnQubG9jYXRpb25cclxuICAgIFxyXG4gICMjI1xyXG4gIGhlcmUgY2FuIGNhdXNlIGRhdGEgbG9hZGluZywgZXRjLlxyXG4gICMjI1xyXG4gIE9KLmhpc3RvcnkucmVzdG9yZVN0YXRlIHJldHVybkxvY2F0aW9uXHJcbiAgICBcclxuICByZXR1cm5cclxuKSwgZmFsc2UgXHJcbiAgXHJcbiBcclxuT0ouaGlzdG9yeS5yZWdpc3RlciAncmVzdG9yZVN0YXRlJywgcmVzdG9yZVN0YXRlXHJcbk9KLmhpc3RvcnkucmVnaXN0ZXIgJ3B1c2hTdGF0ZScsIHB1c2hTdGF0ZVxyXG4gXHJcbm1vZHVsZS5leHBvcnRzID0gXHJcbiAgcmVzdG9yZVN0YXRlOiByZXN0b3JlU3RhdGVcclxuICBwdXNoU3RhdGU6IHB1c2hTdGF0ZVxyXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCwgSVMsIE9KLCBfO1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbiQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cbl8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG5cbklTID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBJUygpIHt9XG5cbiAgSVMuYm9vbCA9IGZ1bmN0aW9uKGJvb2xlYW4pIHtcbiAgICByZXR1cm4gXy5pc0Jvb2xlYW4oYm9vbGVhbik7XG4gIH07XG5cbiAgSVMuYXJyYXlOdWxsT3JFbXB0eSA9IGZ1bmN0aW9uKGFycikge1xuICAgIHJldHVybiBfLmlzRW1wdHkoYXJyKTtcbiAgfTtcblxuICBJUy5zdHJpbmdOdWxsT3JFbXB0eSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIgJiYgKCFzdHIubGVuZ3RoIHx8IHN0ci5sZW5ndGggPT09IDAgfHwgIXN0ci50cmltIHx8ICFzdHIudHJpbSgpKTtcbiAgfTtcblxuICBJUy5udW1iZXJOdWxsT3JFbXB0eSA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHJldHVybiAhbnVtIHx8IGlzTmFOKG51bSkgfHwgIW51bS50b1ByZWNpc2lvbjtcbiAgfTtcblxuICBJUy5kYXRlTnVsbE9yRW1wdHkgPSBmdW5jdGlvbihkdCkge1xuICAgIHJldHVybiAhZHQgfHwgIWR0LmdldFRpbWU7XG4gIH07XG5cbiAgSVMub2JqZWN0TnVsbE9yRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc0VtcHR5KG9iaiB8fCAhT2JqZWN0LmtleXMob2JqKSB8fCBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMCk7XG4gIH07XG5cbiAgSVMucGxhaW5PYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc1BsYWluT2JqZWN0KG9iaik7XG4gIH07XG5cbiAgSVMub2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNPYmplY3Qob2JqKTtcbiAgfTtcblxuICBJUy5kYXRlID0gZnVuY3Rpb24oZHQpIHtcbiAgICByZXR1cm4gXy5pc0RhdGUoZHQpO1xuICB9O1xuXG5cbiAgLypcbiAgRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGFuIGluc3RhbmNlIG9mIGEgTnVtYmVyIGFuZCBub3QgTmFOKlxuICAgKi9cblxuICBJUy5udW1iZXIgPSBmdW5jdGlvbihudW0pIHtcbiAgICB2YXIgbnVtYmVyO1xuICAgIG51bWJlciA9IHJlcXVpcmUoJy4uL2NvcmUvbnVtYmVyJyk7XG4gICAgcmV0dXJuIHR5cGVvZiBudW0gPT09ICdudW1iZXInICYmIGZhbHNlID09PSAobnVtYmVyLmlzTmFOKG51bSkgfHwgZmFsc2UgPT09IG51bWJlci5pc0Zpbml0ZShudW0pIHx8IG51bWJlci5NQVhfVkFMVUUgPT09IG51bSB8fCBudW1iZXIuTUlOX1ZBTFVFID09PSBudW0pO1xuICB9O1xuXG5cbiAgLypcbiAgRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGNvbnZlcnRpYmxlIHRvIGEgTnVtYmVyXG4gICAqL1xuXG4gIElTLm51bWVyaWMgPSBmdW5jdGlvbihudW0pIHtcbiAgICB2YXIgbnVOdW0sIHJldCwgdG87XG4gICAgcmV0ID0gdGhpcy5udW1iZXIobnVtKTtcbiAgICBpZiAoIXJldCkge1xuICAgICAgdG8gPSByZXF1aXJlKCcuL3RvJyk7XG4gICAgICBudU51bSA9IHRvLm51bWJlcihudW0pO1xuICAgICAgcmV0ID0gdGhpcy5udW1iZXIobnVOdW0pO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIElTLmVsZW1lbnRJbkRvbSA9IGZ1bmN0aW9uKGVsZW1lbnRJZCkge1xuICAgIHJldHVybiBmYWxzZSA9PT0gdGhpcy5udWxsT3JFbXB0eShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpKTtcbiAgfTtcblxuICBJUy5hcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKTtcbiAgfTtcblxuICBJUy5zdHJpbmcgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gXy5pc1N0cmluZyhzdHIpO1xuICB9O1xuXG4gIElTW1widHJ1ZVwiXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSAndHJ1ZScgfHwgb2JqID09PSAxIHx8IG9iaiA9PT0gJzEnO1xuICB9O1xuXG4gIElTW1wiZmFsc2VcIl0gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBmYWxzZSB8fCBvYmogPT09ICdmYWxzZScgfHwgb2JqID09PSAwIHx8IG9iaiA9PT0gJzAnO1xuICB9O1xuXG4gIElTLnRydWVPckZhbHNlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRoaXNbXCJ0cnVlXCJdKG9iaiB8fCB0aGlzW1wiZmFsc2VcIl0ob2JqKSk7XG4gIH07XG5cbiAgSVMubnVsbE9yRW1wdHkgPSBmdW5jdGlvbihvYmosIGNoZWNrTGVuZ3RoKSB7XG4gICAgcmV0dXJuIF8uaXNFbXB0eShvYmopIHx8IF8uaXNVbmRlZmluZWQob2JqKSB8fCBfLmlzTnVsbChvYmopIHx8IF8uaXNOYU4ob2JqKTtcbiAgfTtcblxuICBJUy5udWxsT3JVbmRlZmluZWQgPSBmdW5jdGlvbihvYmosIGNoZWNrTGVuZ3RoKSB7XG4gICAgcmV0dXJuIF8uaXNVbmRlZmluZWQob2JqKSB8fCBfLmlzTnVsbChvYmopIHx8IF8uaXNOYU4ob2JqKTtcbiAgfTtcblxuICBJU1tcImluc3RhbmNlb2ZcIl0gPSBmdW5jdGlvbihuYW1lLCBvYmopIHtcbiAgICByZXR1cm4gb2JqLnR5cGUgPT09IG5hbWUgfHwgb2JqIGluc3RhbmNlb2YgbmFtZTtcbiAgfTtcblxuICBJUy5tZXRob2QgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqICE9PSBPSi5ub29wICYmIF8uaXNGdW5jdGlvbihvYmopO1xuICB9O1xuXG5cbiAgLypcbiAgRGVwcmVjYXRlZC4gTGVmdCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIFVzZSBpcy5tZXRob2QgaW5zdGVhZC5cbiAgICovXG5cbiAgSVMuZnVuYyA9IElTLm1ldGhvZDtcblxuICByZXR1cm4gSVM7XG5cbn0pKCk7XG5cbk9KLnJlZ2lzdGVyKCdpcycsIElTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBJUztcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRngwYjI5c2MxeGNhWE11WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVN4SlFVRkJPenRCUVVGQkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUMEZCVWpzN1FVRkRUQ3hEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCUTBvc1EwRkJRU3hIUVVGSkxFOUJRVUVzUTBGQlVTeFJRVUZTT3p0QlFVVkZPenM3UlVGRlNpeEZRVUZETEVOQlFVRXNTVUZCUkN4SFFVRlBMRk5CUVVNc1QwRkJSRHRYUVVOTUxFTkJRVU1zUTBGQlF5eFRRVUZHTEVOQlFWa3NUMEZCV2p0RlFVUkxPenRGUVVkUUxFVkJRVU1zUTBGQlFTeG5Ra0ZCUkN4SFFVRnRRaXhUUVVGRExFZEJRVVE3VjBGRGFrSXNRMEZCUXl4RFFVRkRMRTlCUVVZc1EwRkJWU3hIUVVGV08wVkJSR2xDT3p0RlFVZHVRaXhGUVVGRExFTkJRVUVzYVVKQlFVUXNSMEZCYjBJc1UwRkJReXhIUVVGRU8xZEJRMnhDTEVkQlFVRXNTVUZCVVN4RFFVRkRMRU5CUVVrc1IwRkJSeXhEUVVGRExFMUJRVklzU1VGQmEwSXNSMEZCUnl4RFFVRkRMRTFCUVVvc1MwRkJZeXhEUVVGb1F5eEpRVUZ4UXl4RFFVRkpMRWRCUVVjc1EwRkJReXhKUVVFM1F5eEpRVUZ4UkN4RFFVRkpMRWRCUVVjc1EwRkJReXhKUVVGS0xFTkJRVUVzUTBGQk1VUTdSVUZFVlRzN1JVRkhjRUlzUlVGQlF5eERRVUZCTEdsQ1FVRkVMRWRCUVc5Q0xGTkJRVU1zUjBGQlJEdFhRVU5zUWl4RFFVRkpMRWRCUVVvc1NVRkJWeXhMUVVGQkxFTkJRVTBzUjBGQlRpeERRVUZZTEVsQlFYbENMRU5CUVVrc1IwRkJSeXhEUVVGRE8wVkJSR1k3TzBWQlIzQkNMRVZCUVVNc1EwRkJRU3hsUVVGRUxFZEJRV3RDTEZOQlFVTXNSVUZCUkR0WFFVTm9RaXhEUVVGSkxFVkJRVW9zU1VGQlZTeERRVUZKTEVWQlFVVXNRMEZCUXp0RlFVUkVPenRGUVVkc1FpeEZRVUZETEVOQlFVRXNhVUpCUVVRc1IwRkJiMElzVTBGQlF5eEhRVUZFTzFkQlEyeENMRU5CUVVNc1EwRkJReXhQUVVGR0xFTkJRVlVzUjBGQlFTeEpRVUZQTEVOQlFVa3NUVUZCVFN4RFFVRkRMRWxCUVZBc1EwRkJXU3hIUVVGYUxFTkJRVmdzU1VGQkswSXNUVUZCVFN4RFFVRkRMRWxCUVZBc1EwRkJXU3hIUVVGYUxFTkJRV2RDTEVOQlFVTXNUVUZCYWtJc1MwRkJNa0lzUTBGQmNFVTdSVUZFYTBJN08wVkJSM0JDTEVWQlFVTXNRMEZCUVN4WFFVRkVMRWRCUVdNc1UwRkJReXhIUVVGRU8xZEJRMW9zUTBGQlF5eERRVUZETEdGQlFVWXNRMEZCWjBJc1IwRkJhRUk3UlVGRVdUczdSVUZIWkN4RlFVRkRMRU5CUVVFc1RVRkJSQ3hIUVVGVExGTkJRVU1zUjBGQlJEdFhRVU5RTEVOQlFVTXNRMEZCUXl4UlFVRkdMRU5CUVZjc1IwRkJXRHRGUVVSUE96dEZRVWRVTEVWQlFVTXNRMEZCUVN4SlFVRkVMRWRCUVU4c1UwRkJReXhGUVVGRU8xZEJRMHdzUTBGQlF5eERRVUZETEUxQlFVWXNRMEZCVXl4RlFVRlVPMFZCUkVzN096dEJRVWxRT3pzN08wVkJSMEVzUlVGQlF5eERRVUZCTEUxQlFVUXNSMEZCVXl4VFFVRkRMRWRCUVVRN1FVRkRVQ3hSUVVGQk8wbEJRVUVzVFVGQlFTeEhRVUZUTEU5QlFVRXNRMEZCVVN4blFrRkJVanRYUVVOVUxFOUJRVThzUjBGQlVDeExRVUZqTEZGQlFXUXNTVUZCTWtJc1MwRkJRU3hMUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFWQXNRMEZCWVN4SFFVRmlMRU5CUVVFc1NVRkJjVUlzUzBGQlFTeExRVUZUTEUxQlFVMHNRMEZCUXl4UlFVRlFMRU5CUVdkQ0xFZEJRV2hDTEVOQlFUbENMRWxCUVhORUxFMUJRVTBzUTBGQlF5eFRRVUZRTEV0QlFXOUNMRWRCUVRGRkxFbEJRV2xHTEUxQlFVMHNRMEZCUXl4VFFVRlFMRXRCUVc5Q0xFZEJRWFJITzBWQlJqZENPenM3UVVGSlZEczdPenRGUVVkQkxFVkJRVU1zUTBGQlFTeFBRVUZFTEVkQlFWVXNVMEZCUXl4SFFVRkVPMEZCUTFJc1VVRkJRVHRKUVVGQkxFZEJRVUVzUjBGQlRTeEpRVUZETEVOQlFVRXNUVUZCUkN4RFFVRlJMRWRCUVZJN1NVRkRUaXhKUVVGQkxFTkJRVThzUjBGQlVEdE5RVU5GTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1RVRkJVanROUVVOTUxFdEJRVUVzUjBGQlVTeEZRVUZGTEVOQlFVTXNUVUZCU0N4RFFVRlZMRWRCUVZZN1RVRkRVaXhIUVVGQkxFZEJRVTBzU1VGQlF5eERRVUZCTEUxQlFVUXNRMEZCVVN4TFFVRlNMRVZCU0ZJN08xZEJTVUU3UlVGT1VUczdSVUZSVml4RlFVRkRMRU5CUVVFc1dVRkJSQ3hIUVVGbExGTkJRVU1zVTBGQlJEdFhRVU5pTEV0QlFVRXNTMEZCVXl4SlFVRkRMRU5CUVVFc1YwRkJSQ3hEUVVGaExGRkJRVkVzUTBGQlF5eGpRVUZVTEVOQlFYZENMRk5CUVhoQ0xFTkJRV0k3UlVGRVNUczdSVUZIWml4RlFVRkRMRU5CUVVFc1MwRkJSQ3hIUVVGUkxGTkJRVU1zUjBGQlJEdFhRVU5PTEVOQlFVTXNRMEZCUXl4UFFVRkdMRU5CUVZVc1IwRkJWanRGUVVSTk96dEZRVWRTTEVWQlFVTXNRMEZCUVN4TlFVRkVMRWRCUVZNc1UwRkJReXhIUVVGRU8xZEJRMUFzUTBGQlF5eERRVUZETEZGQlFVWXNRMEZCVnl4SFFVRllPMFZCUkU4N08wVkJSMVFzUlVGQlF5eERRVUZCTEUxQlFVRXNRMEZCUkN4SFFVRlBMRk5CUVVNc1IwRkJSRHRYUVVOTUxFZEJRVUVzUzBGQlR5eEpRVUZRTEVsQlFXVXNSMEZCUVN4TFFVRlBMRTFCUVhSQ0xFbEJRV2RETEVkQlFVRXNTMEZCVHl4RFFVRjJReXhKUVVFMFF5eEhRVUZCTEV0QlFVODdSVUZFT1VNN08wVkJSMUFzUlVGQlF5eERRVUZCTEU5QlFVRXNRMEZCUkN4SFFVRlJMRk5CUVVNc1IwRkJSRHRYUVVOT0xFZEJRVUVzUzBGQlR5eExRVUZRTEVsQlFXZENMRWRCUVVFc1MwRkJUeXhQUVVGMlFpeEpRVUZyUXl4SFFVRkJMRXRCUVU4c1EwRkJla01zU1VGQk9FTXNSMEZCUVN4TFFVRlBPMFZCUkM5RE96dEZRVWRTTEVWQlFVTXNRMEZCUVN4WFFVRkVMRWRCUVdNc1UwRkJReXhIUVVGRU8xZEJRMW9zU1VGQlF5eERRVUZCTEUxQlFVRXNRMEZCUkN4RFFVRk5MRWRCUVVFc1NVRkJUeXhKUVVGRExFTkJRVUVzVDBGQlFTeERRVUZFTEVOQlFVOHNSMEZCVUN4RFFVRmlPMFZCUkZrN08wVkJSMlFzUlVGQlF5eERRVUZCTEZkQlFVUXNSMEZCWXl4VFFVRkRMRWRCUVVRc1JVRkJUU3hYUVVGT08xZEJRMW9zUTBGQlF5eERRVUZETEU5QlFVWXNRMEZCVlN4SFFVRldMRU5CUVVFc1NVRkJhMElzUTBGQlF5eERRVUZETEZkQlFVWXNRMEZCWXl4SFFVRmtMRU5CUVd4Q0xFbEJRWGRETEVOQlFVTXNRMEZCUXl4TlFVRkdMRU5CUVZNc1IwRkJWQ3hEUVVGNFF5eEpRVUY1UkN4RFFVRkRMRU5CUVVNc1MwRkJSaXhEUVVGUkxFZEJRVkk3UlVGRU4wTTdPMFZCUjJRc1JVRkJReXhEUVVGQkxHVkJRVVFzUjBGQmEwSXNVMEZCUXl4SFFVRkVMRVZCUVUwc1YwRkJUanRYUVVOb1FpeERRVUZETEVOQlFVTXNWMEZCUml4RFFVRmpMRWRCUVdRc1EwRkJRU3hKUVVGelFpeERRVUZETEVOQlFVTXNUVUZCUml4RFFVRlRMRWRCUVZRc1EwRkJkRUlzU1VGQmRVTXNRMEZCUXl4RFFVRkRMRXRCUVVZc1EwRkJVU3hIUVVGU08wVkJSSFpDT3p0RlFVZHNRaXhGUVVGRExFTkJRVUVzV1VGQlFTeERRVUZFTEVkQlFXRXNVMEZCUXl4SlFVRkVMRVZCUVU4c1IwRkJVRHRYUVVOWUxFZEJRVWNzUTBGQlF5eEpRVUZLTEV0QlFWa3NTVUZCV2l4SlFVRnZRaXhIUVVGQkxGbEJRV1U3UlVGRWVFSTdPMFZCUjJJc1JVRkJReXhEUVVGQkxFMUJRVVFzUjBGQlV5eFRRVUZETEVkQlFVUTdWMEZEVUN4SFFVRkJMRXRCUVZNc1JVRkJSU3hEUVVGRExFbEJRVm9zU1VGQmNVSXNRMEZCUXl4RFFVRkRMRlZCUVVZc1EwRkJZU3hIUVVGaU8wVkJSR1E3T3p0QlFVZFVPenM3TzBWQlIwRXNSVUZCUXl4RFFVRkJMRWxCUVVRc1IwRkJVU3hGUVVGRExFTkJRVUU3T3pzN096dEJRVWxZTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1NVRkJXaXhGUVVGclFpeEZRVUZzUWpzN1FVRkRRU3hOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWlJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lUMG9nUFNCeVpYRjFhWEpsSUNjdUxpOXZhaWRjY2x4dUpDQTlJSEpsY1hWcGNtVWdKMnB4ZFdWeWVTZGNjbHh1WHlBOUlISmxjWFZwY21VZ0oyeHZaR0Z6YUNkY2NseHVYSEpjYm1Oc1lYTnpJRWxUWEhKY2JseHlYRzRnSUVCaWIyOXNPaUFvWW05dmJHVmhiaWtnTFQ1Y2NseHVJQ0FnSUY4dWFYTkNiMjlzWldGdUlHSnZiMnhsWVc1Y2NseHVYSEpjYmlBZ1FHRnljbUY1VG5Wc2JFOXlSVzF3ZEhrNklDaGhjbklwSUMwK1hISmNiaUFnSUNCZkxtbHpSVzF3ZEhrZ1lYSnlYSEpjYmx4eVhHNGdJRUJ6ZEhKcGJtZE9kV3hzVDNKRmJYQjBlVG9nS0hOMGNpa2dMVDVjY2x4dUlDQWdJSE4wY2lCaGJtUWdLRzV2ZENCemRISXViR1Z1WjNSb0lHOXlJSE4wY2k1c1pXNW5kR2dnYVhNZ01DQnZjaUJ1YjNRZ2MzUnlMblJ5YVcwZ2IzSWdibTkwSUhOMGNpNTBjbWx0S0NrcFhISmNibHh5WEc0Z0lFQnVkVzFpWlhKT2RXeHNUM0pGYlhCMGVUb2dLRzUxYlNrZ0xUNWNjbHh1SUNBZ0lHNXZkQ0J1ZFcwZ2IzSWdhWE5PWVU0b2JuVnRLU0J2Y2lCdWIzUWdiblZ0TG5SdlVISmxZMmx6YVc5dVhISmNibHh5WEc0Z0lFQmtZWFJsVG5Wc2JFOXlSVzF3ZEhrNklDaGtkQ2tnTFQ1Y2NseHVJQ0FnSUc1dmRDQmtkQ0J2Y2lCdWIzUWdaSFF1WjJWMFZHbHRaVnh5WEc1Y2NseHVJQ0JBYjJKcVpXTjBUblZzYkU5eVJXMXdkSGs2SUNodlltb3BJQzArWEhKY2JpQWdJQ0JmTG1selJXMXdkSGtnYjJKcUlHOXlJRzV2ZENCUFltcGxZM1F1YTJWNWN5aHZZbW9wSUc5eUlFOWlhbVZqZEM1clpYbHpLRzlpYWlrdWJHVnVaM1JvSUdseklEQmNjbHh1WEhKY2JpQWdRSEJzWVdsdVQySnFaV04wT2lBb2IySnFLU0F0UGx4eVhHNGdJQ0FnWHk1cGMxQnNZV2x1VDJKcVpXTjBJRzlpYWx4eVhHNWNjbHh1SUNCQWIySnFaV04wT2lBb2IySnFLU0F0UGx4eVhHNGdJQ0FnWHk1cGMwOWlhbVZqZENCdlltcGNjbHh1WEhKY2JpQWdRR1JoZEdVNklDaGtkQ2tnTFQ1Y2NseHVJQ0FnSUY4dWFYTkVZWFJsSUdSMFhISmNibHh5WEc1Y2NseHVJQ0FqSXlOY2NseHVJQ0JFWlhSbGNtMXBibVZ6SUdsbUlHRWdkbUZzZFdVZ2FYTWdZVzRnYVc1emRHRnVZMlVnYjJZZ1lTQk9kVzFpWlhJZ1lXNWtJRzV2ZENCT1lVNHFYSEpjYmlBZ0l5TWpYSEpjYmlBZ1FHNTFiV0psY2pvZ0tHNTFiU2tnTFQ1Y2NseHVJQ0FnSUc1MWJXSmxjaUE5SUhKbGNYVnBjbVVnSnk0dUwyTnZjbVV2Ym5WdFltVnlKMXh5WEc0Z0lDQWdkSGx3Wlc5bUlHNTFiU0JwY3lBbmJuVnRZbVZ5SnlCaGJtUWdabUZzYzJVZ2FYTWdLRzUxYldKbGNpNXBjMDVoVGlodWRXMHBJRzl5SUdaaGJITmxJR2x6SUc1MWJXSmxjaTVwYzBacGJtbDBaU2h1ZFcwcElHOXlJRzUxYldKbGNpNU5RVmhmVmtGTVZVVWdhWE1nYm5WdElHOXlJRzUxYldKbGNpNU5TVTVmVmtGTVZVVWdhWE1nYm5WdEtWeHlYRzVjY2x4dUlDQWpJeU5jY2x4dUlDQkVaWFJsY20xcGJtVnpJR2xtSUdFZ2RtRnNkV1VnYVhNZ1kyOXVkbVZ5ZEdsaWJHVWdkRzhnWVNCT2RXMWlaWEpjY2x4dUlDQWpJeU5jY2x4dUlDQkFiblZ0WlhKcFl6b2dLRzUxYlNrZ0xUNWNjbHh1SUNBZ0lISmxkQ0E5SUVCdWRXMWlaWElvYm5WdEtWeHlYRzRnSUNBZ2RXNXNaWE56SUhKbGRGeHlYRzRnSUNBZ0lDQjBieUE5SUhKbGNYVnBjbVVnSnk0dmRHOG5YSEpjYmlBZ0lDQWdJRzUxVG5WdElEMGdkRzh1Ym5WdFltVnlLRzUxYlNsY2NseHVJQ0FnSUNBZ2NtVjBJRDBnUUc1MWJXSmxjaWh1ZFU1MWJTbGNjbHh1SUNBZ0lISmxkRnh5WEc1Y2NseHVJQ0JBWld4bGJXVnVkRWx1Ukc5dE9pQW9aV3hsYldWdWRFbGtLU0F0UGx4eVhHNGdJQ0FnWm1Gc2MyVWdhWE1nUUc1MWJHeFBja1Z0Y0hSNUtHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0dWc1pXMWxiblJKWkNrcFhISmNibHh5WEc0Z0lFQmhjbkpoZVRvZ0tHOWlhaWtnTFQ1Y2NseHVJQ0FnSUY4dWFYTkJjbkpoZVNCdlltcGNjbHh1WEhKY2JpQWdRSE4wY21sdVp6b2dLSE4wY2lrZ0xUNWNjbHh1SUNBZ0lGOHVhWE5UZEhKcGJtY2djM1J5WEhKY2JseHlYRzRnSUVCMGNuVmxPaUFvYjJKcUtTQXRQbHh5WEc0Z0lDQWdiMkpxSUdseklIUnlkV1VnYjNJZ2IySnFJR2x6SUNkMGNuVmxKeUJ2Y2lCdlltb2dhWE1nTVNCdmNpQnZZbW9nYVhNZ0p6RW5YSEpjYmx4eVhHNGdJRUJtWVd4elpUb2dLRzlpYWlrZ0xUNWNjbHh1SUNBZ0lHOWlhaUJwY3lCbVlXeHpaU0J2Y2lCdlltb2dhWE1nSjJaaGJITmxKeUJ2Y2lCdlltb2dhWE1nTUNCdmNpQnZZbW9nYVhNZ0p6QW5YSEpjYmx4eVhHNGdJRUIwY25WbFQzSkdZV3h6WlRvZ0tHOWlhaWtnTFQ1Y2NseHVJQ0FnSUVCMGNuVmxJRzlpYWlCdmNpQkFabUZzYzJVZ2IySnFYSEpjYmx4eVhHNGdJRUJ1ZFd4c1QzSkZiWEIwZVRvZ0tHOWlhaXdnWTJobFkydE1aVzVuZEdncElDMCtYSEpjYmlBZ0lDQmZMbWx6Ulcxd2RIa29iMkpxS1NCdmNpQmZMbWx6Vlc1a1pXWnBibVZrS0c5aWFpa2diM0lnWHk1cGMwNTFiR3dvYjJKcUtTQnZjaUJmTG1selRtRk9LRzlpYWlsY2NseHVYSEpjYmlBZ1FHNTFiR3hQY2xWdVpHVm1hVzVsWkRvZ0tHOWlhaXdnWTJobFkydE1aVzVuZEdncElDMCtYSEpjYmlBZ0lDQmZMbWx6Vlc1a1pXWnBibVZrS0c5aWFpa2diM0lnWHk1cGMwNTFiR3dvYjJKcUtTQnZjaUJmTG1selRtRk9LRzlpYWlsY2NseHVYSEpjYmlBZ1FHbHVjM1JoYm1ObGIyWTZJQ2h1WVcxbExDQnZZbW9wSUMwK1hISmNiaUFnSUNCdlltb3VkSGx3WlNCcGN5QnVZVzFsSUc5eUlHOWlhaUJwYm5OMFlXNWpaVzltSUc1aGJXVmNjbHh1WEhKY2JpQWdRRzFsZEdodlpEb2dLRzlpYWlrZ0xUNWNjbHh1SUNBZ0lHOWlhaUJwYzI1MElFOUtMbTV2YjNBZ1lXNWtJRjh1YVhOR2RXNWpkR2x2YmlCdlltcGNjbHh1WEhKY2JpQWdJeU1qWEhKY2JpQWdSR1Z3Y21WallYUmxaQzRnVEdWbWRDQm1iM0lnWW1GamEzZGhjbVJ6SUdOdmJYQmhkR2xpYVd4cGRIa3VJRlZ6WlNCcGN5NXRaWFJvYjJRZ2FXNXpkR1ZoWkM1Y2NseHVJQ0FqSXlOY2NseHVJQ0JBWm5WdVl5QTlJRUJ0WlhSb2IyUmNjbHh1WEhKY2JseHlYRzVjY2x4dVQwb3VjbVZuYVhOMFpYSWdKMmx6Snl3Z1NWTmNjbHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JKVTF4eVhHNWNjbHh1SWwxOSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBPSiwgbWFrZU5vdHksIG5vdHk7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxubm90eSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Wydub3R5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydub3R5J10gOiBudWxsKTtcblxubWFrZU5vdHkgPSBmdW5jdGlvbihvcHRpb25zLCBvd25lcikge1xuICB2YXIgZGVmYXVsdHMsIHJldDtcbiAgZGVmYXVsdHMgPSB7XG4gICAgbGF5b3V0OiAndG9wUmlnaHQnLFxuICAgIHRoZW1lOiAnZGVmYXVsdFRoZW1lJyxcbiAgICB0eXBlOiAnYWxlcnQnLFxuICAgIHRleHQ6ICcnLFxuICAgIGRpc21pc3NRdWV1ZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJub3R5X21lc3NhZ2VcIj48c3BhbiBjbGFzcz1cIm5vdHlfdGV4dFwiPjwvc3Bhbj48ZGl2IGNsYXNzPVwibm90eV9jbG9zZVwiPjwvZGl2PjwvZGl2PicsXG4gICAgYW5pbWF0aW9uOiB7XG4gICAgICBvcGVuOiB7XG4gICAgICAgIGhlaWdodDogJ3RvZ2dsZSdcbiAgICAgIH0sXG4gICAgICBjbG9zZToge1xuICAgICAgICBoZWlnaHQ6ICd0b2dnbGUnXG4gICAgICB9LFxuICAgICAgZWFzaW5nOiAnc3dpbmcnLFxuICAgICAgc3BlZWQ6IDUwMFxuICAgIH0sXG4gICAgdGltZW91dDogNTAwMCxcbiAgICBmb3JjZTogZmFsc2UsXG4gICAgbW9kYWw6IGZhbHNlLFxuICAgIG1heFZpc2libGU6IDUsXG4gICAga2lsbGVyOiBmYWxzZSxcbiAgICBjbG9zZVdpdGg6IFsnY2xpY2snXSxcbiAgICBjYWxsYmFjazoge1xuICAgICAgb25TaG93OiBPSi5ub29wLFxuICAgICAgYWZ0ZXJTaG93OiBPSi5ub29wLFxuICAgICAgb25DbG9zZTogT0oubm9vcCxcbiAgICAgIGFmdGVyQ2xvc2U6IE9KLm5vb3BcbiAgICB9LFxuICAgIGJ1dHRvbnM6IGZhbHNlXG4gIH07XG4gIE9KLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZSk7XG4gIHJldCA9IG5vdHkoZGVmYXVsdHMpO1xuICByZXR1cm4gcmV0O1xufTtcblxuT0oubm90aWZpY2F0aW9ucy5yZWdpc3Rlcignbm90eScsIG1ha2VOb3R5KTtcblxubW9kdWxlLmV4cG9ydHMgPSBtYWtlTm90eTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRngwYjI5c2MxeGNibTkwZVM1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVGQkxFbEJRVUU3TzBGQlFVRXNSVUZCUVN4SFFVRkxMRTlCUVVFc1EwRkJVU3hQUVVGU096dEJRVU5NTEVsQlFVRXNSMEZCVHl4UFFVRkJMRU5CUVZFc1RVRkJVanM3UVVGSFVDeFJRVUZCTEVkQlFWY3NVMEZCUXl4UFFVRkVMRVZCUVZVc1MwRkJWanRCUVVOVUxFMUJRVUU3UlVGQlFTeFJRVUZCTEVkQlEwVTdTVUZCUVN4TlFVRkJMRVZCUVZFc1ZVRkJVanRKUVVOQkxFdEJRVUVzUlVGQlR5eGpRVVJRTzBsQlJVRXNTVUZCUVN4RlFVRk5MRTlCUms0N1NVRkhRU3hKUVVGQkxFVkJRVTBzUlVGSVRqdEpRVWxCTEZsQlFVRXNSVUZCWXl4SlFVcGtPMGxCUzBFc1VVRkJRU3hGUVVGVkxDdEdRVXhXTzBsQlRVRXNVMEZCUVN4RlFVTkpPMDFCUVVFc1NVRkJRU3hGUVVORk8xRkJRVUVzVFVGQlFTeEZRVUZSTEZGQlFWSTdUMEZFUmp0TlFVVkJMRXRCUVVFc1JVRkRSVHRSUVVGQkxFMUJRVUVzUlVGQlVTeFJRVUZTTzA5QlNFWTdUVUZKUVN4TlFVRkJMRVZCUVZFc1QwRktVanROUVV0QkxFdEJRVUVzUlVGQlR5eEhRVXhRTzB0QlVFbzdTVUZoUVN4UFFVRkJMRVZCUVZNc1NVRmlWRHRKUVdOQkxFdEJRVUVzUlVGQlR5eExRV1JRTzBsQlpVRXNTMEZCUVN4RlFVRlBMRXRCWmxBN1NVRm5Ra0VzVlVGQlFTeEZRVUZaTEVOQmFFSmFPMGxCYVVKQkxFMUJRVUVzUlVGQlVTeExRV3BDVWp0SlFXdENRU3hUUVVGQkxFVkJRVmNzUTBGQlF5eFBRVUZFTEVOQmJFSllPMGxCYlVKQkxGRkJRVUVzUlVGRFNUdE5RVUZCTEUxQlFVRXNSVUZCVVN4RlFVRkZMRU5CUVVNc1NVRkJXRHROUVVOQkxGTkJRVUVzUlVGQlZ5eEZRVUZGTEVOQlFVTXNTVUZFWkR0TlFVVkJMRTlCUVVFc1JVRkJVeXhGUVVGRkxFTkJRVU1zU1VGR1dqdE5RVWRCTEZWQlFVRXNSVUZCV1N4RlFVRkZMRU5CUVVNc1NVRklaanRMUVhCQ1NqdEpRWGRDUVN4UFFVRkJMRVZCUVZNc1MwRjRRbFE3TzBWQk1FSkdMRVZCUVVVc1EwRkJReXhOUVVGSUxFTkJRVlVzVVVGQlZpeEZRVUZ2UWl4UFFVRndRaXhGUVVFMlFpeEpRVUUzUWp0RlFVTkJMRWRCUVVFc1IwRkJUU3hKUVVGQkxFTkJRVXNzVVVGQlREdFRRVVZPTzBGQkwwSlRPenRCUVdsRFdDeEZRVUZGTEVOQlFVTXNZVUZCWVN4RFFVRkRMRkZCUVdwQ0xFTkJRVEJDTEUxQlFURkNMRVZCUVd0RExGRkJRV3hET3p0QlFVTkJMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SlBTaUE5SUhKbGNYVnBjbVVnSnk0dUwyOXFKMXh5WEc1dWIzUjVJRDBnY21WeGRXbHlaU0FuYm05MGVTZGNjbHh1WEhKY2JpQWdYSEpjYm0xaGEyVk9iM1I1SUQwZ0tHOXdkR2x2Ym5Nc0lHOTNibVZ5S1NBdFBseHlYRzRnSUdSbFptRjFiSFJ6SUQxY2NseHVJQ0FnSUd4aGVXOTFkRG9nSjNSdmNGSnBaMmgwSjF4eVhHNGdJQ0FnZEdobGJXVTZJQ2RrWldaaGRXeDBWR2hsYldVblhISmNiaUFnSUNCMGVYQmxPaUFuWVd4bGNuUW5YSEpjYmlBZ0lDQjBaWGgwT2lBbkp5QWpZMkZ1SUdKbElHaDBiV3dnYjNJZ2MzUnlhVzVuWEhKY2JpQWdJQ0JrYVhOdGFYTnpVWFZsZFdVNklIUnlkV1VnSTBsbUlIbHZkU0IzWVc1MElIUnZJSFZ6WlNCeGRXVjFaU0JtWldGMGRYSmxJSE5sZENCMGFHbHpJSFJ5ZFdWY2NseHVJQ0FnSUhSbGJYQnNZWFJsT2lBblBHUnBkaUJqYkdGemN6MWNJbTV2ZEhsZmJXVnpjMkZuWlZ3aVBqeHpjR0Z1SUdOc1lYTnpQVndpYm05MGVWOTBaWGgwWENJK1BDOXpjR0Z1UGp4a2FYWWdZMnhoYzNNOVhDSnViM1I1WDJOc2IzTmxYQ0krUEM5a2FYWStQQzlrYVhZK0p5eGNjbHh1SUNBZ0lHRnVhVzFoZEdsdmJqb2dYSEpjYmlBZ0lDQWdJQ0FnYjNCbGJqb2dYSEpjYmlBZ0lDQWdJQ0FnSUNCb1pXbG5hSFE2SUNkMGIyZG5iR1VuWEhKY2JpQWdJQ0FnSUNBZ1kyeHZjMlU2SUZ4eVhHNGdJQ0FnSUNBZ0lDQWdhR1ZwWjJoME9pQW5kRzluWjJ4bEoxeHlYRzRnSUNBZ0lDQWdJR1ZoYzJsdVp6b2dKM04zYVc1bkoxeHlYRzRnSUNBZ0lDQWdJSE53WldWa09pQTFNREFnSTI5d1pXNXBibWNnSmlCamJHOXphVzVuSUdGdWFXMWhkR2x2YmlCemNHVmxaRnh5WEc0Z0lDQWdkR2x0Wlc5MWREb2dOVEF3TUNBalpHVnNZWGtnWm05eUlHTnNiM05wYm1jZ1pYWmxiblF1SUZObGRDQm1ZV3h6WlNCbWIzSWdjM1JwWTJ0NUlHNXZkR2xtYVdOaGRHbHZibk5jY2x4dUlDQWdJR1p2Y21ObE9pQm1ZV3h6WlNBallXUmtjeUJ1YjNScFptbGpZWFJwYjI0Z2RHOGdkR2hsSUdKbFoybHVibWx1WnlCdlppQnhkV1YxWlNCM2FHVnVJSE5sZENCMGJ5QjBjblZsWEhKY2JpQWdJQ0J0YjJSaGJEb2dabUZzYzJWY2NseHVJQ0FnSUcxaGVGWnBjMmxpYkdVNklEVWdJM2x2ZFNCallXNGdjMlYwSUcxaGVDQjJhWE5wWW14bElHNXZkR2xtYVdOaGRHbHZiaUJtYjNJZ1pHbHpiV2x6YzFGMVpYVmxJSFJ5ZFdVZ2IzQjBhVzl1TEZ4eVhHNGdJQ0FnYTJsc2JHVnlPaUJtWVd4elpTQWpabTl5SUdOc2IzTmxJR0ZzYkNCdWIzUnBabWxqWVhScGIyNXpJR0psWm05eVpTQnphRzkzWEhKY2JpQWdJQ0JqYkc5elpWZHBkR2c2SUZzblkyeHBZMnNuWFNBZ0kxc25ZMnhwWTJzbkxDQW5ZblYwZEc5dUp5d2dKMmh2ZG1WeUoxMWNjbHh1SUNBZ0lHTmhiR3hpWVdOck9pQmNjbHh1SUNBZ0lDQWdJQ0J2YmxOb2IzYzZJRTlLTG01dmIzQXNYSEpjYmlBZ0lDQWdJQ0FnWVdaMFpYSlRhRzkzT2lCUFNpNXViMjl3WEhKY2JpQWdJQ0FnSUNBZ2IyNURiRzl6WlRvZ1Qwb3VibTl2Y0Z4eVhHNGdJQ0FnSUNBZ0lHRm1kR1Z5UTJ4dmMyVTZJRTlLTG01dmIzQmNjbHh1SUNBZ0lHSjFkSFJ2Ym5NNklHWmhiSE5sSUNOaGJpQmhjbkpoZVNCdlppQmlkWFIwYjI1elhISmNiaUFnSUNCY2NseHVJQ0JQU2k1bGVIUmxibVFnWkdWbVlYVnNkSE1zSUc5d2RHbHZibk1zSUhSeWRXVmNjbHh1SUNCeVpYUWdQU0J1YjNSNUlHUmxabUYxYkhSelhISmNiaUFnSUNBZ0lGeHlYRzRnSUhKbGRGeHlYRzRnSUNBZ1hISmNiazlLTG01dmRHbG1hV05oZEdsdmJuTXVjbVZuYVhOMFpYSWdKMjV2ZEhrbkxDQnRZV3RsVG05MGVWeHlYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRzFoYTJWT2IzUjVJbDE5IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE9KLCBQdWJTdWIsIGV2ZW50cywgcHMsIHN1YnNjcmliZXJzLCB0b2tlbnM7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuUHViU3ViID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1B1YlN1YiddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUHViU3ViJ10gOiBudWxsKTtcblxudG9rZW5zID0ge307XG5cbnN1YnNjcmliZXJzID0gW107XG5cbmV2ZW50cyA9IHt9O1xuXG5wcyA9IHtcbiAgZ2V0RXZlbnROYW1lOiBmdW5jdGlvbihldmVudCkge1xuICAgIHJldHVybiBldmVudC50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoJyAnLCAnXycpO1xuICB9LFxuICBzdWJzY3JpYmU6IGZ1bmN0aW9uKGV2ZW50LCBtZXRob2QpIHtcbiAgICB2YXIgZXZlbnROYW1lLCB0b2tlbjtcbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUoZXZlbnQpO1xuICAgIGlmICghZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIGV2ZW50c1tldmVudE5hbWVdID0gW107XG4gICAgfVxuICAgIHRva2VuID0gUHViU3ViLnN1YnNjcmliZShldmVudE5hbWUsIG1ldGhvZCk7XG4gICAgdG9rZW5zW3Rva2VuXSA9IHRva2VuO1xuICAgIHN1YnNjcmliZXJzLnB1c2gobWV0aG9kKTtcbiAgICBldmVudHNbZXZlbnROYW1lXS5wdXNoKG1ldGhvZCk7XG4gICAgcmV0dXJuIHRva2VuO1xuICB9LFxuICBwdWJsaXNoOiBmdW5jdGlvbihldmVudCwgZGF0YSkge1xuICAgIHZhciBldmVudE5hbWU7XG4gICAgZXZlbnROYW1lID0gcHMuZ2V0RXZlbnROYW1lKGV2ZW50KTtcbiAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIFB1YlN1Yi5wdWJsaXNoKGV2ZW50TmFtZSwgZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE9KLmNvbnNvbGUuaW5mbygnRXZlbnQgbmFtZWQgeycgKyBldmVudCArICd9IGlzIG5vdCByZWNvZ25pemVkLicpO1xuICAgIH1cbiAgfSxcbiAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKHRva2VuT3JNZXRob2QpIHtcbiAgICBpZiAoT0ouaXMubWV0aG9kKHRva2VuT3JNZXRob2QpKSB7XG4gICAgICBpZiAoLTEgIT09IHN1YnNjcmliZXJzLmluZGV4T2YodG9rZW5Pck1ldGhvZCkpIHtcbiAgICAgICAgUHViU3ViLnVuc3Vic2NyaWJlKHRva2VuT3JNZXRob2QpO1xuICAgICAgICBzdWJzY3JpYmVycyA9IF8ucmVtb3ZlKHN1YnNjcmliZXJzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgICByZXR1cm4gbWV0aG9kID09PSB0b2tlbk9yTWV0aG9kO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE9KLmNvbnNvbGUuaW5mbygnRXZlbnQgbWV0aG9kIGlzIG5vdCByZWNvZ25pemVkLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodG9rZW5zW3Rva2VuT3JNZXRob2RdKSB7XG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSh0b2tlbk9yTWV0aG9kKTtcbiAgICAgICAgZGVsZXRlIHRva2Vuc1t0b2tlbk9yTWV0aG9kXTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHVuc3Vic2NyaWJlQWxsOiBmdW5jdGlvbigpIHtcbiAgICBPSi5lYWNoKHRva2VucywgZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgIHJldHVybiB1bnN1YnNjcmliZSh0b2tlbik7XG4gICAgfSk7XG4gICAgc3Vic2NyaWJlcnMgPSBbXTtcbiAgICBldmVudHMgPSB7fTtcbiAgfSxcbiAgdW5zdWJzY3JpYmVFdmVudDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgZXZlbnROYW1lO1xuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZShldmVudCk7XG4gICAgaWYgKGV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICBPSi5lYWNoKGV2ZW50c1tldmVudE5hbWVdLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIHVuc3Vic2NyaWJlKG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgT0ouY29uc29sZS5pbmZvKCdFdmVudCBuYW1lZCB7JyArIGV2ZW50ICsgJ30gaXMgbm90IHJlY29nbml6ZWQuJyk7XG4gICAgfVxuICAgIGRlbGV0ZSBldmVudHNbZXZlbnROYW1lXTtcbiAgfVxufTtcblxuT2JqZWN0LnNlYWwocHMpO1xuXG5PYmplY3QuZnJlZXplKHBzKTtcblxuT0oucmVnaXN0ZXIoJ2dldEV2ZW50TmFtZScsIHBzLmdldEV2ZW50TmFtZSk7XG5cbk9KLnJlZ2lzdGVyKCdwdWJsaXNoJywgcHMucHVibGlzaCk7XG5cbk9KLnJlZ2lzdGVyKCdzdWJzY3JpYmUnLCBwcy5zdWJzY3JpYmUpO1xuXG5PSi5yZWdpc3RlcigndW5zdWJzY3JpYmUnLCBwcy51bnN1YnNjcmliZSk7XG5cbk9KLnJlZ2lzdGVyKCd1bnN1YnNjcmliZUFsbCcsIHBzLnVuc3Vic2NyaWJlQWxsKTtcblxuT0oucmVnaXN0ZXIoJ3Vuc3Vic2NyaWJlRXZlbnQnLCBwcy51bnN1YnNjcmliZUV2ZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSBwcztcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRngwYjI5c2MxeGNjSFZpYzNWaUxtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlFVRXNTVUZCUVRzN1FVRkJRU3hGUVVGQkxFZEJRVXNzVDBGQlFTeERRVUZSTEU5QlFWSTdPMEZCUTB3c1RVRkJRU3hIUVVGVExFOUJRVUVzUTBGQlVTeFhRVUZTT3p0QlFVVlVMRTFCUVVFc1IwRkJVenM3UVVGRFZDeFhRVUZCTEVkQlFXTTdPMEZCUTJRc1RVRkJRU3hIUVVGVE96dEJRVVZVTEVWQlFVRXNSMEZEUlR0RlFVRkJMRmxCUVVFc1JVRkJZeXhUUVVGRExFdEJRVVE3VjBGRFdpeExRVUZMTEVOQlFVTXNWMEZCVGl4RFFVRkJMRU5CUVcxQ0xFTkJRVU1zVDBGQmNFSXNRMEZCTkVJc1IwRkJOVUlzUlVGQmFVTXNSMEZCYWtNN1JVRkVXU3hEUVVGa08wVkJSMEVzVTBGQlFTeEZRVUZYTEZOQlFVTXNTMEZCUkN4RlFVRlJMRTFCUVZJN1FVRkRWQ3hSUVVGQk8wbEJRVUVzVTBGQlFTeEhRVUZaTEVWQlFVVXNRMEZCUXl4WlFVRklMRU5CUVdkQ0xFdEJRV2hDTzBsQlExb3NTVUZCUnl4RFFVRkpMRTFCUVU4c1EwRkJRU3hUUVVGQkxFTkJRV1E3VFVGQk9FSXNUVUZCVHl4RFFVRkJMRk5CUVVFc1EwRkJVQ3hIUVVGdlFpeEhRVUZzUkRzN1NVRkZRU3hMUVVGQkxFZEJRVkVzVFVGQlRTeERRVUZETEZOQlFWQXNRMEZCYVVJc1UwRkJha0lzUlVGQk5FSXNUVUZCTlVJN1NVRkRVaXhOUVVGUExFTkJRVUVzUzBGQlFTeERRVUZRTEVkQlFXZENPMGxCUTJoQ0xGZEJRVmNzUTBGQlF5eEpRVUZhTEVOQlFXbENMRTFCUVdwQ08wbEJRMEVzVFVGQlR5eERRVUZCTEZOQlFVRXNRMEZCVlN4RFFVRkRMRWxCUVd4Q0xFTkJRWFZDTEUxQlFYWkNPMWRCUTBFN1JVRlNVeXhEUVVoWU8wVkJZVUVzVDBGQlFTeEZRVUZUTEZOQlFVTXNTMEZCUkN4RlFVRlJMRWxCUVZJN1FVRkRVQ3hSUVVGQk8wbEJRVUVzVTBGQlFTeEhRVUZaTEVWQlFVVXNRMEZCUXl4WlFVRklMRU5CUVdkQ0xFdEJRV2hDTzBsQlExb3NTVUZCUnl4TlFVRlBMRU5CUVVFc1UwRkJRU3hEUVVGV08wMUJRMFVzVFVGQlRTeERRVUZETEU5QlFWQXNRMEZCWlN4VFFVRm1MRVZCUVRCQ0xFbEJRVEZDTEVWQlJFWTdTMEZCUVN4TlFVRkJPMDFCUjBVc1JVRkJSU3hEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZZTEVOQlFXZENMR1ZCUVVFc1IwRkJhMElzUzBGQmJFSXNSMEZCTUVJc2MwSkJRVEZETEVWQlNFWTdPMFZCUms4c1EwRmlWRHRGUVhGQ1FTeFhRVUZCTEVWQlFXRXNVMEZCUXl4aFFVRkVPMGxCUTFnc1NVRkJSeXhGUVVGRkxFTkJRVU1zUlVGQlJTeERRVUZETEUxQlFVNHNRMEZCWVN4aFFVRmlMRU5CUVVnN1RVRkRSU3hKUVVGSExFTkJRVU1zUTBGQlJDeExRVUZSTEZkQlFWY3NRMEZCUXl4UFFVRmFMRU5CUVc5Q0xHRkJRWEJDTEVOQlFWZzdVVUZEUlN4TlFVRk5MRU5CUVVNc1YwRkJVQ3hEUVVGdFFpeGhRVUZ1UWp0UlFVTkJMRmRCUVVFc1IwRkJZeXhEUVVGRExFTkJRVU1zVFVGQlJpeERRVUZUTEZkQlFWUXNSVUZCYzBJc1UwRkJReXhOUVVGRU8ybENRVUZaTEUxQlFVRXNTMEZCVlR0UlFVRjBRaXhEUVVGMFFpeEZRVVpvUWp0UFFVRkJMRTFCUVVFN1VVRkpSU3hGUVVGRkxFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFWZ3NRMEZCWjBJc2FVTkJRV2hDTEVWQlNrWTdUMEZFUmp0TFFVRkJMRTFCUVVFN1RVRlBSU3hKUVVGSExFMUJRVThzUTBGQlFTeGhRVUZCTEVOQlFWWTdVVUZEUlN4TlFVRk5MRU5CUVVNc1YwRkJVQ3hEUVVGdFFpeGhRVUZ1UWp0UlFVTkJMRTlCUVU4c1RVRkJUeXhEUVVGQkxHRkJRVUVzUlVGR2FFSTdUMEZRUmpzN1JVRkVWeXhEUVhKQ1lqdEZRV3REUVN4alFVRkJMRVZCUVdkQ0xGTkJRVUU3U1VGRFpDeEZRVUZGTEVOQlFVTXNTVUZCU0N4RFFVRlJMRTFCUVZJc1JVRkJaMElzVTBGQlF5eExRVUZFTzJGQlFWY3NWMEZCUVN4RFFVRlpMRXRCUVZvN1NVRkJXQ3hEUVVGb1FqdEpRVU5CTEZkQlFVRXNSMEZCWXp0SlFVTmtMRTFCUVVFc1IwRkJVenRGUVVoTExFTkJiRU5vUWp0RlFYZERRU3huUWtGQlFTeEZRVUZyUWl4VFFVRkRMRXRCUVVRN1FVRkRhRUlzVVVGQlFUdEpRVUZCTEZOQlFVRXNSMEZCV1N4RlFVRkZMRU5CUVVNc1dVRkJTQ3hEUVVGblFpeExRVUZvUWp0SlFVTmFMRWxCUVVjc1RVRkJUeXhEUVVGQkxGTkJRVUVzUTBGQlZqdE5RVU5GTEVWQlFVVXNRMEZCUXl4SlFVRklMRU5CUVZFc1RVRkJUeXhEUVVGQkxGTkJRVUVzUTBGQlppeEZRVUV5UWl4VFFVRkRMRTFCUVVRN1pVRkJXU3hYUVVGQkxFTkJRVmtzVFVGQldqdE5RVUZhTEVOQlFUTkNMRVZCUkVZN1MwRkJRU3hOUVVGQk8wMUJSMFVzUlVGQlJTeERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRllMRU5CUVdkQ0xHVkJRVUVzUjBGQmEwSXNTMEZCYkVJc1IwRkJNRUlzYzBKQlFURkRMRVZCU0VZN08wbEJTVUVzVDBGQlR5eE5RVUZQTEVOQlFVRXNVMEZCUVR0RlFVNUZMRU5CZUVOc1FqczdPMEZCYVVSR0xFMUJRVTBzUTBGQlF5eEpRVUZRTEVOQlFWa3NSVUZCV2pzN1FVRkRRU3hOUVVGTkxFTkJRVU1zVFVGQlVDeERRVUZqTEVWQlFXUTdPMEZCUlVFc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeGpRVUZhTEVWQlFUUkNMRVZCUVVVc1EwRkJReXhaUVVFdlFqczdRVUZEUVN4RlFVRkZMRU5CUVVNc1VVRkJTQ3hEUVVGWkxGTkJRVm9zUlVGQmRVSXNSVUZCUlN4RFFVRkRMRTlCUVRGQ096dEJRVU5CTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1YwRkJXaXhGUVVGNVFpeEZRVUZGTEVOQlFVTXNVMEZCTlVJN08wRkJRMEVzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4aFFVRmFMRVZCUVRKQ0xFVkJRVVVzUTBGQlF5eFhRVUU1UWpzN1FVRkRRU3hGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEdkQ1FVRmFMRVZCUVRoQ0xFVkJRVVVzUTBGQlF5eGpRVUZxUXpzN1FVRkRRU3hGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEd0Q1FVRmFMRVZCUVdkRExFVkJRVVVzUTBGQlF5eG5Ra0ZCYmtNN08wRkJSVUVzVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJaUxDSm1hV3hsSWpvaVoyVnVaWEpoZEdWa0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJazlLSUQwZ2NtVnhkV2x5WlNBbkxpNHZiMm9uWEhKY2JsQjFZbE4xWWlBOUlISmxjWFZwY21VZ0ozQjFZbk4xWWkxcWN5ZGNjbHh1WEhKY2JuUnZhMlZ1Y3lBOUlIdDlYSEpjYm5OMVluTmpjbWxpWlhKeklEMGdXMTFjY2x4dVpYWmxiblJ6SUQwZ2UzMWNjbHh1WEhKY2JuQnpJRDBnWEhKY2JpQWdaMlYwUlhabGJuUk9ZVzFsT2lBb1pYWmxiblFwSUMwK1hISmNiaUFnSUNCbGRtVnVkQzUwYjFWd2NHVnlRMkZ6WlNncExuSmxjR3hoWTJVZ0p5QW5MQ0FuWHlkY2NseHVYSEpjYmlBZ2MzVmljMk55YVdKbE9pQW9aWFpsYm5Rc0lHMWxkR2h2WkNrZ0xUNWNjbHh1SUNBZ0lHVjJaVzUwVG1GdFpTQTlJSEJ6TG1kbGRFVjJaVzUwVG1GdFpTQmxkbVZ1ZEZ4eVhHNGdJQ0FnYVdZZ2JtOTBJR1YyWlc1MGMxdGxkbVZ1ZEU1aGJXVmRJSFJvWlc0Z1pYWmxiblJ6VzJWMlpXNTBUbUZ0WlYwZ1BTQmJYVnh5WEc1Y2NseHVJQ0FnSUhSdmEyVnVJRDBnVUhWaVUzVmlMbk4xWW5OamNtbGlaU0JsZG1WdWRFNWhiV1VzSUcxbGRHaHZaRnh5WEc0Z0lDQWdkRzlyWlc1elczUnZhMlZ1WFNBOUlIUnZhMlZ1WEhKY2JpQWdJQ0J6ZFdKelkzSnBZbVZ5Y3k1d2RYTm9JRzFsZEdodlpGeHlYRzRnSUNBZ1pYWmxiblJ6VzJWMlpXNTBUbUZ0WlYwdWNIVnphQ0J0WlhSb2IyUmNjbHh1SUNBZ0lIUnZhMlZ1WEhKY2JseHlYRzRnSUhCMVlteHBjMmc2SUNobGRtVnVkQ3dnWkdGMFlTa2dMVDVjY2x4dUlDQWdJR1YyWlc1MFRtRnRaU0E5SUhCekxtZGxkRVYyWlc1MFRtRnRaU0JsZG1WdWRGeHlYRzRnSUNBZ2FXWWdaWFpsYm5SelcyVjJaVzUwVG1GdFpWMWNjbHh1SUNBZ0lDQWdVSFZpVTNWaUxuQjFZbXhwYzJnZ1pYWmxiblJPWVcxbExDQmtZWFJoWEhKY2JpQWdJQ0JsYkhObFhISmNiaUFnSUNBZ0lFOUtMbU52Ym5OdmJHVXVhVzVtYnlBblJYWmxiblFnYm1GdFpXUWdleWNnS3lCbGRtVnVkQ0FySUNkOUlHbHpJRzV2ZENCeVpXTnZaMjVwZW1Wa0xpZGNjbHh1SUNBZ0lISmxkSFZ5Ymx4eVhHNWNjbHh1SUNCMWJuTjFZbk5qY21saVpUb2dLSFJ2YTJWdVQzSk5aWFJvYjJRcElDMCtYSEpjYmlBZ0lDQnBaaUJQU2k1cGN5NXRaWFJvYjJRZ2RHOXJaVzVQY2sxbGRHaHZaRnh5WEc0Z0lDQWdJQ0JwWmlBdE1TQnBjMjUwSUhOMVluTmpjbWxpWlhKekxtbHVaR1Y0VDJZZ2RHOXJaVzVQY2sxbGRHaHZaRnh5WEc0Z0lDQWdJQ0FnSUZCMVlsTjFZaTUxYm5OMVluTmpjbWxpWlNCMGIydGxiazl5VFdWMGFHOWtYSEpjYmlBZ0lDQWdJQ0FnYzNWaWMyTnlhV0psY25NZ1BTQmZMbkpsYlc5MlpTQnpkV0p6WTNKcFltVnljeXdnS0cxbGRHaHZaQ2tnTFQ0Z2JXVjBhRzlrSUdseklIUnZhMlZ1VDNKTlpYUm9iMlJjY2x4dUlDQWdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQWdJRTlLTG1OdmJuTnZiR1V1YVc1bWJ5QW5SWFpsYm5RZ2JXVjBhRzlrSUdseklHNXZkQ0J5WldOdloyNXBlbVZrTGlkY2NseHVJQ0FnSUdWc2MyVmNjbHh1SUNBZ0lDQWdhV1lnZEc5clpXNXpXM1J2YTJWdVQzSk5aWFJvYjJSZFhISmNiaUFnSUNBZ0lDQWdVSFZpVTNWaUxuVnVjM1ZpYzJOeWFXSmxJSFJ2YTJWdVQzSk5aWFJvYjJSY2NseHVJQ0FnSUNBZ0lDQmtaV3hsZEdVZ2RHOXJaVzV6VzNSdmEyVnVUM0pOWlhSb2IyUmRYSEpjYmlBZ0lDQnlaWFIxY201Y2NseHVYSEpjYmlBZ2RXNXpkV0p6WTNKcFltVkJiR3c2SUNncElDMCtYSEpjYmlBZ0lDQlBTaTVsWVdOb0lIUnZhMlZ1Y3l3Z0tIUnZhMlZ1S1NBdFBpQjFibk4xWW5OamNtbGlaU0IwYjJ0bGJseHlYRzRnSUNBZ2MzVmljMk55YVdKbGNuTWdQU0JiWFZ4eVhHNGdJQ0FnWlhabGJuUnpJRDBnZTMxY2NseHVJQ0FnSUhKbGRIVnlibHh5WEc1Y2NseHVJQ0IxYm5OMVluTmpjbWxpWlVWMlpXNTBPaUFvWlhabGJuUXBJQzArWEhKY2JpQWdJQ0JsZG1WdWRFNWhiV1VnUFNCd2N5NW5aWFJGZG1WdWRFNWhiV1VnWlhabGJuUmNjbHh1SUNBZ0lHbG1JR1YyWlc1MGMxdGxkbVZ1ZEU1aGJXVmRYSEpjYmlBZ0lDQWdJRTlLTG1WaFkyZ2daWFpsYm5SelcyVjJaVzUwVG1GdFpWMHNJQ2h0WlhSb2IyUXBJQzArSUhWdWMzVmljMk55YVdKbElHMWxkR2h2WkZ4eVhHNGdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQlBTaTVqYjI1emIyeGxMbWx1Wm04Z0owVjJaVzUwSUc1aGJXVmtJSHNuSUNzZ1pYWmxiblFnS3lBbmZTQnBjeUJ1YjNRZ2NtVmpiMmR1YVhwbFpDNG5YSEpjYmlBZ0lDQmtaV3hsZEdVZ1pYWmxiblJ6VzJWMlpXNTBUbUZ0WlYxY2NseHVJQ0FnSUhKbGRIVnlibHh5WEc1Y2NseHVUMkpxWldOMExuTmxZV3dnY0hOY2NseHVUMkpxWldOMExtWnlaV1Y2WlNCd2MxeHlYRzVjY2x4dVQwb3VjbVZuYVhOMFpYSWdKMmRsZEVWMlpXNTBUbUZ0WlNjc0lIQnpMbWRsZEVWMlpXNTBUbUZ0WlZ4eVhHNVBTaTV5WldkcGMzUmxjaUFuY0hWaWJHbHphQ2NzSUhCekxuQjFZbXhwYzJoY2NseHVUMG91Y21WbmFYTjBaWElnSjNOMVluTmpjbWxpWlNjc0lIQnpMbk4xWW5OamNtbGlaVnh5WEc1UFNpNXlaV2RwYzNSbGNpQW5kVzV6ZFdKelkzSnBZbVVuTENCd2N5NTFibk4xWW5OamNtbGlaVnh5WEc1UFNpNXlaV2RwYzNSbGNpQW5kVzV6ZFdKelkzSnBZbVZCYkd3bkxDQndjeTUxYm5OMVluTmpjbWxpWlVGc2JGeHlYRzVQU2k1eVpXZHBjM1JsY2lBbmRXNXpkV0p6WTNKcFltVkZkbVZ1ZENjc0lIQnpMblZ1YzNWaWMyTnlhV0psUlhabGJuUmNjbHh1WEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2NITWlYWDA9IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuIyMjXHJcbmh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTAxMTE1L2hvdy1jYW4taS1nZXQtcXVlcnktc3RyaW5nLXZhbHVlcy1pbi1qYXZhc2NyaXB0XHJcbiMjI1xyXG5xdWVyeVN0cmluZyA9IChwYXJhbSkgLT5cclxuICByZXQgPSB7fVxyXG4gICAgXHJcbiAgaWYgT0ouZ2xvYmFsLmxvY2F0aW9uXHJcbiAgICBwYXJhbXMgPSAgT0ouZ2xvYmFsLmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkuc3BsaXQgJyYnXHJcbiAgICBpZiBwYXJhbXNcclxuICAgICAgaSA9IDBcclxuICAgICAgd2hpbGUgaSA8IHBhcmFtcy5sZW5ndGhcclxuICAgICAgICBwcm0gPSBwYXJhbXNbaV0uc3BsaXQgJz0nXHJcbiAgICAgICAgaWYgcHJtLmxlbmd0aCBpcyAyIFxyXG4gICAgICAgICAgcmV0W3BybVswXV0gPSBPSi5nbG9iYWwuZGVjb2RlVVJJQ29tcG9uZW50IHBybVsxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpXHJcbiAgICAgICAgaSArPSAxXHJcbiAgcmV0XHJcbiAgICBcclxuT0oucmVnaXN0ZXIgJ3F1ZXJ5U3RyaW5nJyxxdWVyeVN0cmluZ1xyXG5tb2R1bGUuZXhwb3J0cyA9IHF1ZXJ5U3RyaW5nIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE9KLCBfLCBlYWNoLCBvYmosIHJuZyxcbiAgc2xpY2UgPSBbXS5zbGljZTtcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5vYmogPSByZXF1aXJlKCcuLi9jb3JlL29iamVjdCcpO1xuXG5lYWNoID0gcmVxdWlyZSgnLi9lYWNoJyk7XG5cbnJuZyA9IHtcbiAgcmFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJhbXM7XG4gICAgcGFyYW1zID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgcmV0dXJuIF8ucmFuZ2UuYXBwbHkoXywgcGFyYW1zKTtcbiAgfSxcbiAgcmFuZ2VNaW46IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJhbXM7XG4gICAgcGFyYW1zID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgcmV0dXJuIF8ubWluLmFwcGx5KF8sIHBhcmFtcyk7XG4gIH0sXG4gIHJhbmdlTWF4OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFyYW1zO1xuICAgIHBhcmFtcyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgIHJldHVybiBfLm1heC5hcHBseShfLCBwYXJhbXMpO1xuICB9LFxuXG4gIC8qXG4gIFRha2UgYW4gYXJyYXkgb2Ygc3RyaW5nIHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXG4gIFVzZXMgdGhlIGZpcnN0IGxldHRlciBvZiBlYWNoIHN0cmluZyB2YWx1ZSBpbiB0aGUgYXJyYXkgdG8gY29udmVydCB0byB1bmlxdWUgY29kZSBjaGFyYWN0ZXIgKGxvd2VyIGNhc2UpXG4gIEJ1aWxkcyBhIGludCByYW5nZSBiYXNlZCBvbiB1bmlxdWUgY29kZSBjaGFycy5cbiAgICovXG4gIHN0cmluZ1RvU3ViUmFuZ2VzOiBmdW5jdGlvbihuLCByYW5nZSkge1xuICAgIHZhciBjaGFyUmFuZ2UsIGksIG9sZEdldFJhbmdlLCByZXQsIHN1YlJhbmdlO1xuICAgIGlmIChuID09IG51bGwpIHtcbiAgICAgIG4gPSA2O1xuICAgIH1cbiAgICBpZiAocmFuZ2UgPT0gbnVsbCkge1xuICAgICAgcmFuZ2UgPSBbXTtcbiAgICB9XG4gICAgY2hhclJhbmdlID0gW107XG4gICAgZWFjaChyYW5nZSwgZnVuY3Rpb24odmFsKSB7XG4gICAgICB2YXIgY2hhcjtcbiAgICAgIGNoYXIgPSB2YWwudHJpbSgpWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoZmFsc2UgPT09IG9iai5jb250YWlucyhjaGFyUmFuZ2UsIGNoYXIpKSB7XG4gICAgICAgIHJldHVybiBjaGFyUmFuZ2UucHVzaChjaGFyLmNoYXJDb2RlQXQoKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0ID0gcm5nLnRvU3ViUmFuZ2VzKG4sIGNoYXJSYW5nZSk7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBuKSB7XG4gICAgICBpICs9IDE7XG4gICAgICBzdWJSYW5nZSA9IHJldFtpXTtcbiAgICAgIHN1YlJhbmdlLm1hcChTdHJpbmcuZnJvbUNoYXJDb2RlKTtcbiAgICB9XG4gICAgb2xkR2V0UmFuZ2UgPSByZXQuZ2V0UmFuZ2U7XG4gICAgcmV0LmdldFJhbmdlID0gZnVuY3Rpb24odmFsKSB7XG4gICAgICB2YXIgY2hhciwgaWR4O1xuICAgICAgY2hhciA9IHZhbC50cmltKClbMF0udG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KCk7XG4gICAgICBpZHggPSBvbGRHZXRSYW5nZShjaGFyKTtcbiAgICAgIHJldHVybiBpZHg7XG4gICAgfTtcbiAgICByZXR1cm4gcmV0O1xuICB9LFxuXG4gIC8qXG4gIFRha2UgYW4gYXJyYXkgb2YgaW50IHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXG4gIERpdmlkZXMgdGhlIG9yaWdpbmFsIGFycmF5IGludG8gdGhlIHNwZWNpZmllZCBudW1iZXIgb2Ygc3ViIGFycmF5cy5cbiAgT3ZlcmZsb3cgaXMgcGFzc2VkIHRvIHRoZSBmaW5hbCBwYXJ0aXRpb24uXG4gICAqL1xuICB0b1N1YlJhbmdlczogZnVuY3Rpb24obiwgcmFuZ2UpIHtcbiAgICB2YXIgY2h1bmtWYWwsIGRpc3RhbmNlLCBpLCBqdW1wLCBtYXAsIHJhbmdlSGlnaCwgcmFuZ2VMb3csIHJldCwgc3ViUmFuZ2UsIHN1YlJhbmdlU2l6ZSwgc3ViUmFuZ2VzO1xuICAgIGlmIChuID09IG51bGwpIHtcbiAgICAgIG4gPSA2O1xuICAgIH1cbiAgICBpZiAocmFuZ2UgPT0gbnVsbCkge1xuICAgICAgcmFuZ2UgPSBbXTtcbiAgICB9XG4gICAgcmV0ID0gb2JqLm9iamVjdCgpO1xuICAgIHJhbmdlTG93ID0gcm5nLnJhbmdlTWluKHJhbmdlKTtcbiAgICByYW5nZUhpZ2ggPSBybmcucmFuZ2VNYXgocmFuZ2UpO1xuICAgIGRpc3RhbmNlID0gcmFuZ2VIaWdoIC0gcmFuZ2VMb3c7XG4gICAgc3ViUmFuZ2VTaXplID0gZGlzdGFuY2UgLyBuO1xuICAgIHN1YlJhbmdlcyA9IHJldC5hZGQoJ3JhbmdlcycsIG9iai5vYmplY3QoKSk7XG4gICAgY2h1bmtWYWwgPSByYW5nZUxvdztcbiAgICBtYXAgPSBvYmoub2JqZWN0KCk7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBuKSB7XG4gICAgICBpICs9IDE7XG4gICAgICBpZiAoaSA8IG4pIHtcbiAgICAgICAganVtcCA9IE1hdGgucm91bmQoc3ViUmFuZ2VTaXplKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGp1bXAgPSBNYXRoLmZsb29yKHN1YlJhbmdlU2l6ZSk7XG4gICAgICAgIGlmIChjaHVua1ZhbCArIGp1bXAgPD0gcmFuZ2VIaWdoKSB7XG4gICAgICAgICAganVtcCArPSByYW5nZUhpZ2ggLSBjaHVua1ZhbCAtIGp1bXAgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdWJSYW5nZSA9IHJuZy5yYW5nZShjaHVua1ZhbCwgY2h1bmtWYWwgKyBqdW1wKTtcbiAgICAgIGVhY2goc3ViUmFuZ2UsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICByZXR1cm4gbWFwLmFkZCh2YWwsIGkpO1xuICAgICAgfSk7XG4gICAgICBzdWJSYW5nZXNbaV0gPSBzdWJSYW5nZTtcbiAgICAgIGNodW5rVmFsICs9IGp1bXA7XG4gICAgfVxuICAgIHJldC5hZGQoJ2dldFJhbmdlJywgZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4gbWFwW3ZhbF07XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxufTtcblxuT2JqZWN0LnNlYWwocm5nKTtcblxuT2JqZWN0LmZyZWV6ZShybmcpO1xuXG5PSi5yZWdpc3RlcigncmFuZ2VzJywgcm5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBybmc7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4MGIyOXNjMXhjY21GdVoyVnpMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJRVUVzU1VGQlFTeHhRa0ZCUVR0RlFVRkJPenRCUVVGQkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUMEZCVWpzN1FVRkRUQ3hEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCUTBvc1IwRkJRU3hIUVVGTkxFOUJRVUVzUTBGQlVTeG5Ra0ZCVWpzN1FVRkRUaXhKUVVGQkxFZEJRVThzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCU1ZBc1IwRkJRU3hIUVVsRk8wVkJRVUVzUzBGQlFTeEZRVUZQTEZOQlFVRTdRVUZEVEN4UlFVRkJPMGxCUkUwN1YwRkRUaXhEUVVGRExFTkJRVU1zUzBGQlJpeFZRVUZSTEUxQlFWSTdSVUZFU3l4RFFVRlFPMFZCUzBFc1VVRkJRU3hGUVVGVkxGTkJRVUU3UVVGRFVpeFJRVUZCTzBsQlJGTTdWMEZEVkN4RFFVRkRMRU5CUVVNc1IwRkJSaXhWUVVGTkxFMUJRVTQ3UlVGRVVTeERRVXhXTzBWQlZVRXNVVUZCUVN4RlFVRlZMRk5CUVVFN1FVRkRVaXhSUVVGQk8wbEJSRk03VjBGRFZDeERRVUZETEVOQlFVTXNSMEZCUml4VlFVRk5MRTFCUVU0N1JVRkVVU3hEUVZaV096dEJRV05CT3pzN096dEZRVXRCTEdsQ1FVRkJMRVZCUVcxQ0xGTkJRVU1zUTBGQlJDeEZRVUZSTEV0QlFWSTdRVUZEYWtJc1VVRkJRVHM3VFVGRWEwSXNTVUZCU1RzN08wMUJRVWNzVVVGQlVUczdTVUZEYWtNc1UwRkJRU3hIUVVGWk8wbEJSMW9zU1VGQlFTeERRVUZMTEV0QlFVd3NSVUZCV1N4VFFVRkRMRWRCUVVRN1FVRkRWaXhWUVVGQk8wMUJRVUVzU1VGQlFTeEhRVUZQTEVkQlFVY3NRMEZCUXl4SlFVRktMRU5CUVVFc1EwRkJWeXhEUVVGQkxFTkJRVUVzUTBGQlJTeERRVUZETEZkQlFXUXNRMEZCUVR0TlFVTlFMRWxCUVVjc1MwRkJRU3hMUVVGVExFZEJRVWNzUTBGQlF5eFJRVUZLTEVOQlFXRXNVMEZCWWl4RlFVRjNRaXhKUVVGNFFpeERRVUZhTzJWQlEwVXNVMEZCVXl4RFFVRkRMRWxCUVZZc1EwRkJaU3hKUVVGSkxFTkJRVU1zVlVGQlRDeERRVUZCTEVOQlFXWXNSVUZFUmpzN1NVRkdWU3hEUVVGYU8wbEJTMEVzUjBGQlFTeEhRVUZOTEVkQlFVY3NRMEZCUXl4WFFVRktMRU5CUVdkQ0xFTkJRV2hDTEVWQlFXMUNMRk5CUVc1Q08wbEJSVTRzUTBGQlFTeEhRVUZKTzBGQlEwb3NWMEZCVFN4RFFVRkJMRWRCUVVrc1EwRkJWanROUVVORkxFTkJRVUVzU1VGQlN6dE5RVU5NTEZGQlFVRXNSMEZCVnl4SFFVRkpMRU5CUVVFc1EwRkJRVHROUVVObUxGRkJRVkVzUTBGQlF5eEhRVUZVTEVOQlFXRXNUVUZCVFN4RFFVRkRMRmxCUVhCQ08wbEJTRVk3U1VGTFFTeFhRVUZCTEVkQlFXTXNSMEZCUnl4RFFVRkRPMGxCUTJ4Q0xFZEJRVWNzUTBGQlF5eFJRVUZLTEVkQlFXVXNVMEZCUXl4SFFVRkVPMEZCUTJJc1ZVRkJRVHROUVVGQkxFbEJRVUVzUjBGQlR5eEhRVUZITEVOQlFVTXNTVUZCU2l4RFFVRkJMRU5CUVZjc1EwRkJRU3hEUVVGQkxFTkJRVVVzUTBGQlF5eFhRVUZrTEVOQlFVRXNRMEZCTWtJc1EwRkJReXhWUVVFMVFpeERRVUZCTzAxQlExQXNSMEZCUVN4SFFVRk5MRmRCUVVFc1EwRkJXU3hKUVVGYU8yRkJRMDQ3U1VGSVlUdFhRVWxtTzBWQmRFSnBRaXhEUVc1Q2JrSTdPMEZCTkVOQk96czdPenRGUVV0QkxGZEJRVUVzUlVGQllTeFRRVUZETEVOQlFVUXNSVUZCVVN4TFFVRlNPMEZCUTFnc1VVRkJRVHM3VFVGRVdTeEpRVUZKT3pzN1RVRkJSeXhSUVVGUk96dEpRVU16UWl4SFFVRkJMRWRCUVUwc1IwRkJSeXhEUVVGRExFMUJRVW9zUTBGQlFUdEpRVU5PTEZGQlFVRXNSMEZCVnl4SFFVRkhMRU5CUVVNc1VVRkJTaXhEUVVGaExFdEJRV0k3U1VGRFdDeFRRVUZCTEVkQlFWa3NSMEZCUnl4RFFVRkRMRkZCUVVvc1EwRkJZU3hMUVVGaU8wbEJSVm9zVVVGQlFTeEhRVUZYTEZOQlFVRXNSMEZCV1R0SlFVTjJRaXhaUVVGQkxFZEJRV1VzVVVGQlFTeEhRVUZUTzBsQlEzaENMRk5CUVVFc1IwRkJXU3hIUVVGSExFTkJRVU1zUjBGQlNpeERRVUZSTEZGQlFWSXNSVUZCYTBJc1IwRkJSeXhEUVVGRExFMUJRVW9zUTBGQlFTeERRVUZzUWp0SlFVTmFMRkZCUVVFc1IwRkJWenRKUVVWWUxFZEJRVUVzUjBGQlRTeEhRVUZITEVOQlFVTXNUVUZCU2l4RFFVRkJPMGxCUlU0c1EwRkJRU3hIUVVGSk8wRkJRMG9zVjBGQlRTeERRVUZCTEVkQlFVa3NRMEZCVmp0TlFVTkZMRU5CUVVFc1NVRkJTenROUVVOTUxFbEJRVWNzUTBGQlFTeEhRVUZKTEVOQlFWQTdVVUZCWXl4SlFVRkJMRWRCUVU4c1NVRkJTU3hEUVVGRExFdEJRVXdzUTBGQlZ5eFpRVUZZTEVWQlFYSkNPMDlCUVVFc1RVRkJRVHRSUVVWRkxFbEJRVUVzUjBGQlR5eEpRVUZKTEVOQlFVTXNTMEZCVEN4RFFVRlhMRmxCUVZnN1VVRkRVQ3hKUVVGSExGRkJRVUVzUjBGQlZ5eEpRVUZZTEVsQlFXMUNMRk5CUVhSQ08xVkJRMFVzU1VGQlFTeEpRVUZSTEZOQlFVRXNSMEZCV1N4UlFVRmFMRWRCUVhWQ0xFbEJRWFpDTEVkQlFUaENMRVZCUkhoRE8xTkJTRVk3TzAxQlRVRXNVVUZCUVN4SFFVRlhMRWRCUVVjc1EwRkJReXhMUVVGS0xFTkJRVlVzVVVGQlZpeEZRVUZ2UWl4UlFVRkJMRWRCUVZjc1NVRkJMMEk3VFVGRFdDeEpRVUZCTEVOQlFVc3NVVUZCVEN4RlFVRmxMRk5CUVVNc1IwRkJSRHRsUVVGVExFZEJRVWNzUTBGQlF5eEhRVUZLTEVOQlFWRXNSMEZCVWl4RlFVRmhMRU5CUVdJN1RVRkJWQ3hEUVVGbU8wMUJRMEVzVTBGQlZTeERRVUZCTEVOQlFVRXNRMEZCVml4SFFVRmxPMDFCUTJZc1VVRkJRU3hKUVVGWk8wbEJXR1E3U1VGaFFTeEhRVUZITEVOQlFVTXNSMEZCU2l4RFFVRlJMRlZCUVZJc1JVRkJiMElzVTBGQlF5eEhRVUZFTzJGQlEyeENMRWRCUVVrc1EwRkJRU3hIUVVGQk8wbEJSR01zUTBGQmNFSTdWMEZIUVR0RlFUZENWeXhEUVdwRVlqczdPMEZCWjBaR0xFMUJRVTBzUTBGQlF5eEpRVUZRTEVOQlFWa3NSMEZCV2pzN1FVRkRRU3hOUVVGTkxFTkJRVU1zVFVGQlVDeERRVUZqTEVkQlFXUTdPMEZCUlVFc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeFJRVUZhTEVWQlFYTkNMRWRCUVhSQ096dEJRVU5CTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0lpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpQU2lBOUlISmxjWFZwY21VZ0p5NHVMMjlxSjF4eVhHNWZJRDBnY21WeGRXbHlaU0FuYkc5a1lYTm9KMXh5WEc1dlltb2dQU0J5WlhGMWFYSmxJQ2N1TGk5amIzSmxMMjlpYW1WamRDZGNjbHh1WldGamFDQTlJSEpsY1hWcGNtVWdKeTR2WldGamFDZGNjbHh1WEhKY2JpTWdJeUJ5WVc1blpYTmNjbHh1WEhKY2JuSnVaeUE5WEhKY2JseHlYRzRnSUNNZ0l5TWdjbUZ1WjJWY2NseHVJQ0FqSUZWemFXNW5JRnRNYnkxRVlYTm9YU2hvZEhSd09pOHZiRzlrWVhOb0xtTnZiUzlrYjJOekkzSmhibWRsS1NkeklHQnlZVzVuWldBZ2JXVjBhRzlrWEhKY2JpQWdjbUZ1WjJVNklDaHdZWEpoYlhNdUxpNHBJQzArWEhKY2JpQWdJQ0JmTG5KaGJtZGxJSEJoY21GdGN5NHVMbHh5WEc1Y2NseHVJQ0FqSUNNaklISmhibWRsVFdsdVhISmNiaUFnSXlCVmMybHVaeUJiVEc4dFJHRnphRjBvYUhSMGNEb3ZMMnh2WkdGemFDNWpiMjB2Wkc5amN5TnRhVzRwSjNNZ1lHMXBibUFnYldWMGFHOWtYSEpjYmlBZ2NtRnVaMlZOYVc0NklDaHdZWEpoYlhNdUxpNHBJQzArWEhKY2JpQWdJQ0JmTG0xcGJpQndZWEpoYlhNdUxpNWNjbHh1WEhKY2JpQWdJeUFqSXlCeVlXNW5aVTFoZUZ4eVhHNGdJQ01nVlhOcGJtY2dXMHh2TFVSaGMyaGRLR2gwZEhBNkx5OXNiMlJoYzJndVkyOXRMMlJ2WTNNamJXRjRLU2R6SUdCdFlYaGdJRzFsZEdodlpGeHlYRzRnSUhKaGJtZGxUV0Y0T2lBb2NHRnlZVzF6TGk0dUtTQXRQbHh5WEc0Z0lDQWdYeTV0WVhnZ2NHRnlZVzF6TGk0dVhISmNibHh5WEc0Z0lDTWdJeU1nYzNSeWFXNW5VbUZ1WjJWVWIxTjFZbEpoYm1kbGMxeHlYRzRnSUNNakkxeHlYRzRnSUZSaGEyVWdZVzRnWVhKeVlYa2diMllnYzNSeWFXNW5JSFpoYkhWbGN5QmhibVFnWVNCdWRXMWlaWElnYjJZZ2NHRnlkR2wwYVc5dWN5QjBieUJqY21WaGRHVXVYSEpjYmlBZ1ZYTmxjeUIwYUdVZ1ptbHljM1FnYkdWMGRHVnlJRzltSUdWaFkyZ2djM1J5YVc1bklIWmhiSFZsSUdsdUlIUm9aU0JoY25KaGVTQjBieUJqYjI1MlpYSjBJSFJ2SUhWdWFYRjFaU0JqYjJSbElHTm9ZWEpoWTNSbGNpQW9iRzkzWlhJZ1kyRnpaU2xjY2x4dUlDQkNkV2xzWkhNZ1lTQnBiblFnY21GdVoyVWdZbUZ6WldRZ2IyNGdkVzVwY1hWbElHTnZaR1VnWTJoaGNuTXVYSEpjYmlBZ0l5TWpYSEpjYmlBZ2MzUnlhVzVuVkc5VGRXSlNZVzVuWlhNNklDaHVJRDBnTml3Z2NtRnVaMlVnUFNCYlhTa2dMVDVjY2x4dUlDQWdJR05vWVhKU1lXNW5aU0E5SUZ0ZFhISmNibHh5WEc1Y2NseHVJQ0FnSUdWaFkyZ2djbUZ1WjJVc0lDaDJZV3dwSUMwK1hISmNiaUFnSUNBZ0lHTm9ZWElnUFNCMllXd3VkSEpwYlNncFd6QmRMblJ2VEc5M1pYSkRZWE5sS0NsY2NseHVJQ0FnSUNBZ2FXWWdabUZzYzJVZ2FYTWdiMkpxTG1OdmJuUmhhVzV6SUdOb1lYSlNZVzVuWlN3Z1kyaGhjbHh5WEc0Z0lDQWdJQ0FnSUdOb1lYSlNZVzVuWlM1d2RYTm9JR05vWVhJdVkyaGhja052WkdWQmRDZ3BYSEpjYmx4eVhHNGdJQ0FnY21WMElEMGdjbTVuTG5SdlUzVmlVbUZ1WjJWeklHNHNJR05vWVhKU1lXNW5aVnh5WEc1Y2NseHVJQ0FnSUdrZ1BTQXdYSEpjYmlBZ0lDQjNhR2xzWlNCcElEd2dibHh5WEc0Z0lDQWdJQ0JwSUNzOUlERmNjbHh1SUNBZ0lDQWdjM1ZpVW1GdVoyVWdQU0J5WlhSYmFWMWNjbHh1SUNBZ0lDQWdjM1ZpVW1GdVoyVXViV0Z3SUZOMGNtbHVaeTVtY205dFEyaGhja052WkdWY2NseHVYSEpjYmlBZ0lDQnZiR1JIWlhSU1lXNW5aU0E5SUhKbGRDNW5aWFJTWVc1blpWeHlYRzRnSUNBZ2NtVjBMbWRsZEZKaGJtZGxJRDBnS0haaGJDa2dMVDVjY2x4dUlDQWdJQ0FnWTJoaGNpQTlJSFpoYkM1MGNtbHRLQ2xiTUYwdWRHOU1iM2RsY2tOaGMyVW9LUzVqYUdGeVEyOWtaVUYwS0NsY2NseHVJQ0FnSUNBZ2FXUjRJRDBnYjJ4a1IyVjBVbUZ1WjJVZ1kyaGhjbHh5WEc0Z0lDQWdJQ0JwWkhoY2NseHVJQ0FnSUhKbGRGeHlYRzVjY2x4dUlDQWpJQ01qSUhKaGJtZGxWRzlUZFdKU1lXNW5aWE5jY2x4dUlDQWpJeU5jY2x4dUlDQlVZV3RsSUdGdUlHRnljbUY1SUc5bUlHbHVkQ0IyWVd4MVpYTWdZVzVrSUdFZ2JuVnRZbVZ5SUc5bUlIQmhjblJwZEdsdmJuTWdkRzhnWTNKbFlYUmxMbHh5WEc0Z0lFUnBkbWxrWlhNZ2RHaGxJRzl5YVdkcGJtRnNJR0Z5Y21GNUlHbHVkRzhnZEdobElITndaV05wWm1sbFpDQnVkVzFpWlhJZ2IyWWdjM1ZpSUdGeWNtRjVjeTVjY2x4dUlDQlBkbVZ5Wm14dmR5QnBjeUJ3WVhOelpXUWdkRzhnZEdobElHWnBibUZzSUhCaGNuUnBkR2x2Ymk1Y2NseHVJQ0FqSXlOY2NseHVJQ0IwYjFOMVlsSmhibWRsY3pvZ0tHNGdQU0EyTENCeVlXNW5aU0E5SUZ0ZEtTQXRQbHh5WEc0Z0lDQWdjbVYwSUQwZ2IySnFMbTlpYW1WamRDZ3BYSEpjYmlBZ0lDQnlZVzVuWlV4dmR5QTlJSEp1Wnk1eVlXNW5aVTFwYmlCeVlXNW5aVnh5WEc0Z0lDQWdjbUZ1WjJWSWFXZG9JRDBnY201bkxuSmhibWRsVFdGNElISmhibWRsWEhKY2JseHlYRzRnSUNBZ1pHbHpkR0Z1WTJVZ1BTQnlZVzVuWlVocFoyZ2dMU0J5WVc1blpVeHZkMXh5WEc0Z0lDQWdjM1ZpVW1GdVoyVlRhWHBsSUQwZ1pHbHpkR0Z1WTJVdmJseHlYRzRnSUNBZ2MzVmlVbUZ1WjJWeklEMGdjbVYwTG1Ga1pDQW5jbUZ1WjJWekp5d2diMkpxTG05aWFtVmpkQ2dwWEhKY2JpQWdJQ0JqYUhWdWExWmhiQ0E5SUhKaGJtZGxURzkzWEhKY2JseHlYRzRnSUNBZ2JXRndJRDBnYjJKcUxtOWlhbVZqZENncFhISmNibHh5WEc0Z0lDQWdhU0E5SURCY2NseHVJQ0FnSUhkb2FXeGxJR2tnUENCdVhISmNiaUFnSUNBZ0lHa2dLejBnTVZ4eVhHNGdJQ0FnSUNCcFppQnBJRHdnYmlCMGFHVnVJR3AxYlhBZ1BTQk5ZWFJvTG5KdmRXNWtJSE4xWWxKaGJtZGxVMmw2WlZ4eVhHNGdJQ0FnSUNCbGJITmxYSEpjYmlBZ0lDQWdJQ0FnYW5WdGNDQTlJRTFoZEdndVpteHZiM0lnYzNWaVVtRnVaMlZUYVhwbFhISmNiaUFnSUNBZ0lDQWdhV1lnWTJoMWJtdFdZV3dnS3lCcWRXMXdJRHc5SUhKaGJtZGxTR2xuYUZ4eVhHNGdJQ0FnSUNBZ0lDQWdhblZ0Y0NBclBTQnlZVzVuWlVocFoyZ2dMU0JqYUhWdWExWmhiQ0F0SUdwMWJYQWdLeUF4WEhKY2JseHlYRzRnSUNBZ0lDQnpkV0pTWVc1blpTQTlJSEp1Wnk1eVlXNW5aU0JqYUhWdWExWmhiQ3dnWTJoMWJtdFdZV3dnS3lCcWRXMXdYSEpjYmlBZ0lDQWdJR1ZoWTJnZ2MzVmlVbUZ1WjJVc0lDaDJZV3dwSUMwK0lHMWhjQzVoWkdRZ2RtRnNMQ0JwWEhKY2JpQWdJQ0FnSUhOMVlsSmhibWRsYzF0cFhTQTlJSE4xWWxKaGJtZGxYSEpjYmlBZ0lDQWdJR05vZFc1clZtRnNJQ3M5SUdwMWJYQmNjbHh1WEhKY2JpQWdJQ0J5WlhRdVlXUmtJQ2RuWlhSU1lXNW5aU2NzSUNoMllXd3BJQzArWEhKY2JpQWdJQ0FnSUcxaGNGdDJZV3hkWEhKY2JseHlYRzRnSUNBZ2NtVjBYSEpjYmx4eVhHNVBZbXBsWTNRdWMyVmhiQ0J5Ym1kY2NseHVUMkpxWldOMExtWnlaV1Y2WlNCeWJtZGNjbHh1WEhKY2JrOUtMbkpsWjJsemRHVnlJQ2R5WVc1blpYTW5MQ0J5Ym1kY2NseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQnlibWRjY2x4dUlsMTkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCwgSVMsIE9KLCBUTywgXztcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG4kID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5JUyA9IHJlcXVpcmUoJy4vaXMnKTtcblxuVE8gPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFRPKCkge31cblxuICBUTy5ib29sID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHJldEJvb2w7XG4gICAgcmV0Qm9vbCA9IElTWyd0cnVlJ10oc3RyKTtcbiAgICBpZiAocmV0Qm9vbCA9PT0gZmFsc2UgfHwgcmV0Qm9vbCAhPT0gdHJ1ZSkge1xuICAgICAgcmV0Qm9vbCA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gcmV0Qm9vbDtcbiAgfTtcblxuICBUTy5FUzVfVG9Cb29sID0gZnVuY3Rpb24odmFsKSB7XG4gICAgcmV0dXJuIHZhbCAhPT0gZmFsc2UgJiYgdmFsICE9PSAwICYmIHZhbCAhPT0gJycgJiYgdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnICYmICh0eXBlb2YgdmFsICE9PSAnbnVtYmVyJyB8fCAhaXNOYU4odmFsKSk7XG4gIH07XG5cbiAgVE8uZGF0ZUZyb21UaWNrcyA9IGZ1bmN0aW9uKHRpY2tTdHIpIHtcbiAgICB2YXIgYXJyLCBsb2NhbE9mZnNldCwgb2Zmc2V0LCByZXQsIHRpY2tzLCB0aWNzRGF0ZVRpbWU7XG4gICAgdGljc0RhdGVUaW1lID0gdGhpcy5zdHJpbmcodGlja1N0cik7XG4gICAgcmV0ID0gdm9pZCAwO1xuICAgIHRpY2tzID0gdm9pZCAwO1xuICAgIG9mZnNldCA9IHZvaWQgMDtcbiAgICBsb2NhbE9mZnNldCA9IHZvaWQgMDtcbiAgICBhcnIgPSB2b2lkIDA7XG4gICAgaWYgKGZhbHNlID09PSBJUy5udWxsT3JFbXB0eSh0aWNzRGF0ZVRpbWUpKSB7XG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnLycsICcnKTtcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCdEYXRlJywgJycpO1xuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJygnLCAnJyk7XG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnKScsICcnKTtcbiAgICAgIGFyciA9IHRpY3NEYXRlVGltZS5zcGxpdCgnLScpO1xuICAgICAgaWYgKGFyci5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRpY2tzID0gdGhpcy5udW1iZXIoYXJyWzBdKTtcbiAgICAgICAgb2Zmc2V0ID0gdGhpcy5udW1iZXIoYXJyWzFdKTtcbiAgICAgICAgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgICAgIHJldCA9IG5ldyBEYXRlKHRpY2tzIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpO1xuICAgICAgfSBlbHNlIGlmIChhcnIubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRpY2tzID0gdGhpcy5udW1iZXIoYXJyWzBdKTtcbiAgICAgICAgcmV0ID0gbmV3IERhdGUodGlja3MpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIFRPLmJpbmFyeSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXQ7XG4gICAgcmV0ID0gTmFOO1xuICAgIGlmIChvYmogPT09IDAgfHwgb2JqID09PSAnMCcgfHwgb2JqID09PSAnJyB8fCBvYmogPT09IGZhbHNlIHx8IHRoaXMuc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgPT09ICdmYWxzZScpIHtcbiAgICAgIHJldCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvYmogPT09IDEgfHwgb2JqID09PSAnMScgfHwgb2JqID09PSB0cnVlIHx8IHRoaXMuc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgPT09ICd0cnVlJykge1xuICAgICAgICByZXQgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIFRPLm51bWJlciA9IGZ1bmN0aW9uKGlucHV0TnVtLCBkZWZhdWx0TnVtKSB7XG4gICAgdmFyIHJldFZhbCwgdHJ5R2V0TnVtYmVyO1xuICAgIHRyeUdldE51bWJlciA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICB2YXIgcmV0LCB0cnlHZXQ7XG4gICAgICAgIHJldCA9IE5hTjtcbiAgICAgICAgaWYgKElTLm51bWJlcih2YWwpKSB7XG4gICAgICAgICAgcmV0ID0gdmFsO1xuICAgICAgICB9IGVsc2UgaWYgKElTLnN0cmluZyh2YWwpIHx8IElTLmJvb2wodmFsKSkge1xuICAgICAgICAgIHRyeUdldCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgbnVtO1xuICAgICAgICAgICAgbnVtID0gX3RoaXMuYmluYXJ5KHZhbHVlKTtcbiAgICAgICAgICAgIGlmICghSVMubnVtYmVyKG51bSkgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgICAgbnVtID0gK3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFJUy5udW1iZXIobnVtKSkge1xuICAgICAgICAgICAgICBudW0gPSBfLnBhcnNlSW50KHZhbHVlLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudW07XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXQgPSB0cnlHZXQodmFsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgICByZXRWYWwgPSB0cnlHZXROdW1iZXIoaW5wdXROdW0pO1xuICAgIGlmICghSVMubnVtYmVyKHJldFZhbCkpIHtcbiAgICAgIHJldFZhbCA9IHRyeUdldE51bWJlcihkZWZhdWx0TnVtKTtcbiAgICAgIGlmICghSVMubnVtYmVyKHJldFZhbCkpIHtcbiAgICAgICAgcmV0VmFsID0gTnVtYmVyLk5hTjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldFZhbDtcbiAgfTtcblxuICBUTy5zdHJpbmcgPSBmdW5jdGlvbihpbnB1dFN0ciwgZGVmYXVsdFN0cikge1xuICAgIHZhciByZXQxLCByZXQyLCByZXRWYWwsIHRyeUdldFN0cmluZztcbiAgICB0cnlHZXRTdHJpbmcgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgdmFyIHJldDtcbiAgICAgICAgcmV0ID0gdm9pZCAwO1xuICAgICAgICBpZiAoSVMuc3RyaW5nKHN0cikpIHtcbiAgICAgICAgICByZXQgPSBzdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0ID0gJyc7XG4gICAgICAgICAgaWYgKElTLmJvb2woc3RyKSB8fCBJUy5udW1iZXIoc3RyKSB8fCBJUy5kYXRlKHN0cikpIHtcbiAgICAgICAgICAgIHJldCA9IHN0ci50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgICByZXQxID0gdHJ5R2V0U3RyaW5nKGlucHV0U3RyKTtcbiAgICByZXQyID0gdHJ5R2V0U3RyaW5nKGRlZmF1bHRTdHIpO1xuICAgIHJldFZhbCA9ICcnO1xuICAgIGlmIChyZXQxLmxlbmd0aCAhPT0gMCkge1xuICAgICAgcmV0VmFsID0gcmV0MTtcbiAgICB9IGVsc2UgaWYgKHJldDEgPT09IHJldDIgfHwgcmV0Mi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldFZhbCA9IHJldDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldFZhbCA9IHJldDI7XG4gICAgfVxuICAgIHJldHVybiByZXRWYWw7XG4gIH07XG5cbiAgcmV0dXJuIFRPO1xuXG59KSgpO1xuXG5PSi5yZWdpc3RlcigndG8nLCBUTyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVE87XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4MGIyOXNjMXhjZEc4dVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFTeEpRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlEwb3NRMEZCUVN4SFFVRkpMRTlCUVVFc1EwRkJVU3hSUVVGU096dEJRVU5LTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1RVRkJVanM3UVVGSFF6czdPMFZCUjBvc1JVRkJReXhEUVVGQkxFbEJRVVFzUjBGQlR5eFRRVUZETEVkQlFVUTdRVUZEVEN4UlFVRkJPMGxCUVVFc1QwRkJRU3hIUVVGVkxFVkJRVWNzUTBGQlFTeE5RVUZCTEVOQlFVZ3NRMEZCVnl4SFFVRllPMGxCUTFZc1NVRkJiMElzVDBGQlFTeExRVUZYTEV0QlFWZ3NTVUZCYjBJc1QwRkJRU3hMUVVGaExFbEJRWEpFTzAxQlFVRXNUMEZCUVN4SFFVRlZMRTFCUVZZN08xZEJRMEU3UlVGSVN6czdSVUZQVUN4RlFVRkRMRU5CUVVFc1ZVRkJSQ3hIUVVGaExGTkJRVU1zUjBGQlJEdFhRVU5ZTEVkQlFVRXNTMEZCVXl4TFFVRlVMRWxCUVcxQ0xFZEJRVUVzUzBGQlV5eERRVUUxUWl4SlFVRnJReXhIUVVGQkxFdEJRVk1zUlVGQk0wTXNTVUZCYTBRc1IwRkJRU3hMUVVGVExFbEJRVE5FTEVsQlFXOUZMRTlCUVU4c1IwRkJVQ3hMUVVGblFpeFhRVUZ3Uml4SlFVRnZSeXhEUVVGRExFOUJRVThzUjBGQlVDeExRVUZuUWl4UlFVRm9RaXhKUVVFMFFpeERRVUZKTEV0QlFVRXNRMEZCVFN4SFFVRk9MRU5CUVdwRE8wVkJSSHBHT3p0RlFVdGlMRVZCUVVNc1EwRkJRU3hoUVVGRUxFZEJRV2RDTEZOQlFVTXNUMEZCUkR0QlFVTmtMRkZCUVVFN1NVRkJRU3haUVVGQkxFZEJRV1VzU1VGQlF5eERRVUZCTEUxQlFVUXNRMEZCVVN4UFFVRlNPMGxCUTJZc1IwRkJRU3hIUVVGTk8wbEJRMDRzUzBGQlFTeEhRVUZSTzBsQlExSXNUVUZCUVN4SFFVRlRPMGxCUTFRc1YwRkJRU3hIUVVGak8wbEJRMlFzUjBGQlFTeEhRVUZOTzBsQlEwNHNTVUZCUnl4TFFVRkJMRXRCUVZNc1JVRkJSU3hEUVVGRExGZEJRVWdzUTBGQlpTeFpRVUZtTEVOQlFWbzdUVUZEUlN4WlFVRkJMRWRCUVdVc1dVRkJXU3hEUVVGRExFOUJRV0lzUTBGQmNVSXNSMEZCY2tJc1JVRkJNRUlzUlVGQk1VSTdUVUZEWml4WlFVRkJMRWRCUVdVc1dVRkJXU3hEUVVGRExFOUJRV0lzUTBGQmNVSXNUVUZCY2tJc1JVRkJOa0lzUlVGQk4wSTdUVUZEWml4WlFVRkJMRWRCUVdVc1dVRkJXU3hEUVVGRExFOUJRV0lzUTBGQmNVSXNSMEZCY2tJc1JVRkJNRUlzUlVGQk1VSTdUVUZEWml4WlFVRkJMRWRCUVdVc1dVRkJXU3hEUVVGRExFOUJRV0lzUTBGQmNVSXNSMEZCY2tJc1JVRkJNRUlzUlVGQk1VSTdUVUZEWml4SFFVRkJMRWRCUVUwc1dVRkJXU3hEUVVGRExFdEJRV0lzUTBGQmJVSXNSMEZCYmtJN1RVRkRUaXhKUVVGSExFZEJRVWNzUTBGQlF5eE5RVUZLTEVkQlFXRXNRMEZCYUVJN1VVRkRSU3hMUVVGQkxFZEJRVkVzU1VGQlF5eERRVUZCTEUxQlFVUXNRMEZCVVN4SFFVRkpMRU5CUVVFc1EwRkJRU3hEUVVGYU8xRkJRMUlzVFVGQlFTeEhRVUZUTEVsQlFVTXNRMEZCUVN4TlFVRkVMRU5CUVZFc1IwRkJTU3hEUVVGQkxFTkJRVUVzUTBGQldqdFJRVU5VTEZkQlFVRXNSMEZCYTBJc1NVRkJRU3hKUVVGQkxFTkJRVUVzUTBGQlRTeERRVUZETEdsQ1FVRlFMRU5CUVVFN1VVRkRiRUlzUjBGQlFTeEhRVUZWTEVsQlFVRXNTVUZCUVN4RFFVRk5MRXRCUVVFc1IwRkJVU3hEUVVGRExFTkJRVU1zVjBGQlFTeEhRVUZqTEVOQlFVTXNUVUZCUVN4SFFVRlRMRWRCUVZRc1IwRkJaU3hGUVVGb1FpeERRVUZtTEVOQlFVRXNSMEZCYzBNc1NVRkJka01zUTBGQlpDeEZRVXBhTzA5QlFVRXNUVUZMU3l4SlFVRkhMRWRCUVVjc1EwRkJReXhOUVVGS0xFdEJRV01zUTBGQmFrSTdVVUZEU0N4TFFVRkJMRWRCUVZFc1NVRkJReXhEUVVGQkxFMUJRVVFzUTBGQlVTeEhRVUZKTEVOQlFVRXNRMEZCUVN4RFFVRmFPMUZCUTFJc1IwRkJRU3hIUVVGVkxFbEJRVUVzU1VGQlFTeERRVUZMTEV0QlFVd3NSVUZHVUR0UFFWaFFPenRYUVdOQk8wVkJja0pqT3p0RlFYbENhRUlzUlVGQlF5eERRVUZCTEUxQlFVUXNSMEZCVXl4VFFVRkRMRWRCUVVRN1FVRkRVQ3hSUVVGQk8wbEJRVUVzUjBGQlFTeEhRVUZOTzBsQlEwNHNTVUZCUnl4SFFVRkJMRXRCUVU4c1EwRkJVQ3hKUVVGWkxFZEJRVUVzUzBGQlR5eEhRVUZ1UWl4SlFVRXdRaXhIUVVGQkxFdEJRVThzUlVGQmFrTXNTVUZCZFVNc1IwRkJRU3hMUVVGUExFdEJRVGxETEVsQlFYVkVMRWxCUVVNc1EwRkJRU3hOUVVGRUxFTkJRVkVzUjBGQlVpeERRVUZaTEVOQlFVTXNWMEZCWWl4RFFVRkJMRU5CUVRCQ0xFTkJRVU1zU1VGQk0wSXNRMEZCUVN4RFFVRkJMRXRCUVhGRExFOUJRUzlHTzAxQlEwVXNSMEZCUVN4SFFVRk5MRVZCUkZJN1MwRkJRU3hOUVVGQk8wMUJSVXNzU1VGQldTeEhRVUZCTEV0QlFVOHNRMEZCVUN4SlFVRlpMRWRCUVVFc1MwRkJUeXhIUVVGdVFpeEpRVUV3UWl4SFFVRkJMRXRCUVU4c1NVRkJha01zU1VGQmVVTXNTVUZCUXl4RFFVRkJMRTFCUVVRc1EwRkJVU3hIUVVGU0xFTkJRVmtzUTBGQlF5eFhRVUZpTEVOQlFVRXNRMEZCTUVJc1EwRkJReXhKUVVFelFpeERRVUZCTEVOQlFVRXNTMEZCY1VNc1RVRkJNVVk3VVVGQlFTeEhRVUZCTEVkQlFVMHNSVUZCVGp0UFFVWk1PenRYUVVkQk8wVkJURTg3TzBWQlowSlVMRVZCUVVNc1EwRkJRU3hOUVVGRUxFZEJRVk1zVTBGQlF5eFJRVUZFTEVWQlFWY3NWVUZCV0R0QlFVTlFMRkZCUVVFN1NVRkJRU3haUVVGQkxFZEJRV1VzUTBGQlFTeFRRVUZCTEV0QlFVRTdZVUZCUVN4VFFVRkRMRWRCUVVRN1FVRkRZaXhaUVVGQk8xRkJRVUVzUjBGQlFTeEhRVUZOTzFGQlJVNHNTVUZCUnl4RlFVRkZMRU5CUVVNc1RVRkJTQ3hEUVVGVkxFZEJRVllzUTBGQlNEdFZRVU5GTEVkQlFVRXNSMEZCVFN4SlFVUlNPMU5CUVVFc1RVRkhTeXhKUVVGSExFVkJRVVVzUTBGQlF5eE5RVUZJTEVOQlFWVXNSMEZCVml4RFFVRkJMRWxCUVd0Q0xFVkJRVVVzUTBGQlF5eEpRVUZJTEVOQlFWRXNSMEZCVWl4RFFVRnlRanRWUVVOSUxFMUJRVUVzUjBGQlV5eFRRVUZETEV0QlFVUTdRVUZEVUN4blFrRkJRVHRaUVVGQkxFZEJRVUVzUjBGQlRTeExRVUZETEVOQlFVRXNUVUZCUkN4RFFVRlJMRXRCUVZJN1dVRkRUaXhKUVVGcFFpeERRVUZKTEVWQlFVVXNRMEZCUXl4TlFVRklMRU5CUVZVc1IwRkJWaXhEUVVGS0xFbEJRWFZDTEV0QlFYaERPMk5CUVVFc1IwRkJRU3hIUVVGTkxFTkJRVU1zVFVGQlVEczdXVUZEUVN4SlFVRTRRaXhEUVVGSkxFVkJRVVVzUTBGQlF5eE5RVUZJTEVOQlFWVXNSMEZCVml4RFFVRnNRenRqUVVGQkxFZEJRVUVzUjBGQlRTeERRVUZETEVOQlFVTXNVVUZCUml4RFFVRlhMRXRCUVZnc1JVRkJhMElzUTBGQmJFSXNSVUZCVGpzN2JVSkJRMEU3VlVGS1R6dFZRVXRVTEVkQlFVRXNSMEZCVFN4TlFVRkJMRU5CUVU4c1IwRkJVQ3hGUVU1SU96dGxRVTlNTzAxQlltRTdTVUZCUVN4RFFVRkJMRU5CUVVFc1EwRkJRU3hKUVVGQk8wbEJaV1lzVFVGQlFTeEhRVUZUTEZsQlFVRXNRMEZCWVN4UlFVRmlPMGxCUTFRc1NVRkJSeXhEUVVGSkxFVkJRVVVzUTBGQlF5eE5RVUZJTEVOQlFWVXNUVUZCVml4RFFVRlFPMDFCUTBVc1RVRkJRU3hIUVVGVExGbEJRVUVzUTBGQllTeFZRVUZpTzAxQlExUXNTVUZCZFVJc1EwRkJTU3hGUVVGRkxFTkJRVU1zVFVGQlNDeERRVUZWTEUxQlFWWXNRMEZCTTBJN1VVRkJRU3hOUVVGQkxFZEJRVk1zVFVGQlRTeERRVUZETEVsQlFXaENPMDlCUmtZN08xZEJSMEU3UlVGd1FrODdPMFZCZDBKVUxFVkJRVU1zUTBGQlFTeE5RVUZFTEVkQlFWTXNVMEZCUXl4UlFVRkVMRVZCUVZjc1ZVRkJXRHRCUVVOUUxGRkJRVUU3U1VGQlFTeFpRVUZCTEVkQlFXVXNRMEZCUVN4VFFVRkJMRXRCUVVFN1lVRkJRU3hUUVVGRExFZEJRVVE3UVVGRFlpeFpRVUZCTzFGQlFVRXNSMEZCUVN4SFFVRk5PMUZCUTA0c1NVRkJSeXhGUVVGRkxFTkJRVU1zVFVGQlNDeERRVUZWTEVkQlFWWXNRMEZCU0R0VlFVTkZMRWRCUVVFc1IwRkJUU3hKUVVSU08xTkJRVUVzVFVGQlFUdFZRVWRGTEVkQlFVRXNSMEZCVFR0VlFVTk9MRWxCUVhsQ0xFVkJRVVVzUTBGQlF5eEpRVUZJTEVOQlFWRXNSMEZCVWl4RFFVRkJMRWxCUVdkQ0xFVkJRVVVzUTBGQlF5eE5RVUZJTEVOQlFWVXNSMEZCVml4RFFVRm9RaXhKUVVGclF5eEZRVUZGTEVOQlFVTXNTVUZCU0N4RFFVRlJMRWRCUVZJc1EwRkJNMFE3V1VGQlFTeEhRVUZCTEVkQlFVMHNSMEZCUnl4RFFVRkRMRkZCUVVvc1EwRkJRU3hGUVVGT08xZEJTa1k3TzJWQlMwRTdUVUZRWVR0SlFVRkJMRU5CUVVFc1EwRkJRU3hEUVVGQkxFbEJRVUU3U1VGUlppeEpRVUZCTEVkQlFVOHNXVUZCUVN4RFFVRmhMRkZCUVdJN1NVRkRVQ3hKUVVGQkxFZEJRVThzV1VGQlFTeERRVUZoTEZWQlFXSTdTVUZEVUN4TlFVRkJMRWRCUVZNN1NVRkRWQ3hKUVVGSExFbEJRVWtzUTBGQlF5eE5RVUZNTEV0QlFXbENMRU5CUVhCQ08wMUJRMFVzVFVGQlFTeEhRVUZUTEV0QlJGZzdTMEZCUVN4TlFVVkxMRWxCUVVjc1NVRkJRU3hMUVVGUkxFbEJRVklzU1VGQlowSXNTVUZCU1N4RFFVRkRMRTFCUVV3c1MwRkJaU3hEUVVGc1F6dE5RVU5JTEUxQlFVRXNSMEZCVXl4TFFVUk9PMHRCUVVFc1RVRkJRVHROUVVkSUxFMUJRVUVzUjBGQlV5eExRVWhPT3p0WFFVbE1PMFZCYkVKUE96czdPenM3UVVGdlFsZ3NSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3hKUVVGYUxFVkJRV3RDTEVWQlFXeENPenRCUVVOQkxFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKUFNpQTlJSEpsY1hWcGNtVWdKeTR1TDI5cUoxeHlYRzRrSUQwZ2NtVnhkV2x5WlNBbmFuRjFaWEo1SjF4eVhHNWZJRDBnY21WeGRXbHlaU0FuYkc5a1lYTm9KMXh5WEc1SlV5QTlJSEpsY1hWcGNtVWdKeTR2YVhNblhISmNibHh5WEc0aklDTWdkRzljY2x4dVkyeGhjM01nVkU4Z1hISmNiaUFnSXlBakl5QmliMjlzWEhKY2JpQWdJeUJqYjI1MlpYSjBJR0Z1ZVNCamIyMXdZWFJwWW14bElHOWlhbVZqZENCMGJ5QmhJR0p2YjJ4bFlXNHVJRWx1WTI5dGNHRjBhV0pzWlNCdlltcGxZM1J6SUdGeVpTQm1ZV3h6WlM1Y2NseHVJQ0JBWW05dmJEb2dLSE4wY2lrZ0xUNWNjbHh1SUNBZ0lISmxkRUp2YjJ3Z1BTQkpVMXNuZEhKMVpTZGRLSE4wY2lsY2NseHVJQ0FnSUhKbGRFSnZiMndnUFNCbVlXeHpaU0FnYVdZZ2NtVjBRbTl2YkNCcGN5Qm1ZV3h6WlNCdmNpQnlaWFJDYjI5c0lHbHpiblFnZEhKMVpWeHlYRzRnSUNBZ2NtVjBRbTl2YkZ4eVhHNWNjbHh1SUNBaklDTWpJRVZUTlY5VWIwSnZiMnhjY2x4dUlDQWpJQ2hrWldKMVp5a2diV1YwYUc5a0lIUnZJR1Y0Y0d4cFkybDBiSGtnWm05eVkyVWdZVzRnWUdsbUtHOWlhaWxnSUdWMllXeDFZWFJwYjI0Z2RHOGdabXh2ZHlCMGFISnZkV2RvSUhSb1pTQkZVelVnYzNCbFl5Qm1iM0lnZEhKMWRHaHBibVZ6YzF4eVhHNGdJRUJGVXpWZlZHOUNiMjlzT2lBb2RtRnNLU0F0UGx4eVhHNGdJQ0FnZG1Gc0lHbHpiblFnWm1Gc2MyVWdZVzVrSUhaaGJDQnBjMjUwSURBZ1lXNWtJSFpoYkNCcGMyNTBJQ2NuSUdGdVpDQjJZV3dnYVhOdWRDQnVkV3hzSUdGdVpDQjBlWEJsYjJZZ2RtRnNJR2x6Ym5RZ0ozVnVaR1ZtYVc1bFpDY2dZVzVrSUNoMGVYQmxiMllnZG1Gc0lHbHpiblFnSjI1MWJXSmxjaWNnYjNJZ2JtOTBJR2x6VG1GT0tIWmhiQ2twWEhKY2JseHlYRzRnSUNNZ0l5TWdaR0YwWlVaeWIyMVVhV05yYzF4eVhHNGdJQ01nZEdGclpTQmhJRzUxYldKbGNpQnlaWEJ5WlhObGJuUnBibWNnZEdsamEzTWdZVzVrSUdOdmJuWmxjblFnYVhRZ2FXNTBieUJoYmlCcGJuTjBZVzVqWlNCdlppQkVZWFJsWEhKY2JpQWdRR1JoZEdWR2NtOXRWR2xqYTNNNklDaDBhV05yVTNSeUtTQXRQbHh5WEc0Z0lDQWdkR2xqYzBSaGRHVlVhVzFsSUQwZ1FITjBjbWx1WnloMGFXTnJVM1J5S1Z4eVhHNGdJQ0FnY21WMElEMGdkVzVrWldacGJtVmtYSEpjYmlBZ0lDQjBhV05yY3lBOUlIVnVaR1ZtYVc1bFpGeHlYRzRnSUNBZ2IyWm1jMlYwSUQwZ2RXNWtaV1pwYm1Wa1hISmNiaUFnSUNCc2IyTmhiRTltWm5ObGRDQTlJSFZ1WkdWbWFXNWxaRnh5WEc0Z0lDQWdZWEp5SUQwZ2RXNWtaV1pwYm1Wa1hISmNiaUFnSUNCcFppQm1ZV3h6WlNCcGN5QkpVeTV1ZFd4c1QzSkZiWEIwZVNoMGFXTnpSR0YwWlZScGJXVXBYSEpjYmlBZ0lDQWdJSFJwWTNORVlYUmxWR2x0WlNBOUlIUnBZM05FWVhSbFZHbHRaUzV5WlhCc1lXTmxLQ2N2Snl3Z0p5Y3BYSEpjYmlBZ0lDQWdJSFJwWTNORVlYUmxWR2x0WlNBOUlIUnBZM05FWVhSbFZHbHRaUzV5WlhCc1lXTmxLQ2RFWVhSbEp5d2dKeWNwWEhKY2JpQWdJQ0FnSUhScFkzTkVZWFJsVkdsdFpTQTlJSFJwWTNORVlYUmxWR2x0WlM1eVpYQnNZV05sS0Njb0p5d2dKeWNwWEhKY2JpQWdJQ0FnSUhScFkzTkVZWFJsVkdsdFpTQTlJSFJwWTNORVlYUmxWR2x0WlM1eVpYQnNZV05sS0NjcEp5d2dKeWNwWEhKY2JpQWdJQ0FnSUdGeWNpQTlJSFJwWTNORVlYUmxWR2x0WlM1emNHeHBkQ2duTFNjcFhISmNiaUFnSUNBZ0lHbG1JR0Z5Y2k1c1pXNW5kR2dnUGlBeFhISmNiaUFnSUNBZ0lDQWdkR2xqYTNNZ1BTQkFiblZ0WW1WeUtHRnljbHN3WFNsY2NseHVJQ0FnSUNBZ0lDQnZabVp6WlhRZ1BTQkFiblZ0WW1WeUtHRnljbHN4WFNsY2NseHVJQ0FnSUNBZ0lDQnNiMk5oYkU5bVpuTmxkQ0E5SUc1bGR5QkVZWFJsS0NrdVoyVjBWR2x0WlhwdmJtVlBabVp6WlhRb0tWeHlYRzRnSUNBZ0lDQWdJSEpsZENBOUlHNWxkeUJFWVhSbEtDaDBhV05yY3lBdElDZ29iRzlqWVd4UFptWnpaWFFnS3lBb2IyWm1jMlYwSUM4Z01UQXdJQ29nTmpBcEtTQXFJREV3TURBcEtTbGNjbHh1SUNBZ0lDQWdaV3h6WlNCcFppQmhjbkl1YkdWdVozUm9JR2x6SURGY2NseHVJQ0FnSUNBZ0lDQjBhV05yY3lBOUlFQnVkVzFpWlhJb1lYSnlXekJkS1Z4eVhHNGdJQ0FnSUNBZ0lISmxkQ0E5SUc1bGR5QkVZWFJsS0hScFkydHpLVnh5WEc0Z0lDQWdjbVYwWEhKY2JseHlYRzRnSUNNZ0l5TWdZbWx1WVhKNVhISmNiaUFnSXlCamIyNTJaWEowSUdGdUlHOWlhbVZqZENCMGJ5QmlhVzVoY25rZ01DQnZjaUF4WEhKY2JpQWdRR0pwYm1GeWVUb2dLRzlpYWlrZ0xUNWNjbHh1SUNBZ0lISmxkQ0E5SUU1aFRseHlYRzRnSUNBZ2FXWWdiMkpxSUdseklEQWdiM0lnYjJKcUlHbHpJQ2N3SnlCdmNpQnZZbW9nYVhNZ0p5Y2diM0lnYjJKcUlHbHpJR1poYkhObElHOXlJRUJ6ZEhKcGJtY29iMkpxS1M1MGIweHZkMlZ5UTJGelpTZ3BMblJ5YVcwb0tTQnBjeUFuWm1Gc2MyVW5YSEpjYmlBZ0lDQWdJSEpsZENBOUlEQmNjbHh1SUNBZ0lHVnNjMlVnY21WMElEMGdNU0FnYVdZZ2IySnFJR2x6SURFZ2IzSWdiMkpxSUdseklDY3hKeUJ2Y2lCdlltb2dhWE1nZEhKMVpTQnZjaUJBYzNSeWFXNW5LRzlpYWlrdWRHOU1iM2RsY2tOaGMyVW9LUzUwY21sdEtDa2dhWE1nSjNSeWRXVW5YSEpjYmlBZ0lDQnlaWFJjY2x4dVhISmNibHh5WEc0Z0lDTWdJeU1nYm5WdFltVnlYSEpjYmlBZ0kxeHlYRzRnSUNNZ1FYUjBaVzF3ZEhNZ2RHOGdZMjl1ZG1WeWRDQmhiaUJoY21KcGRISmhjbmtnZG1Gc2RXVWdkRzhnWVNCT2RXMWlaWEl1WEhKY2JpQWdJeUJNYjI5elpTQm1ZV3h6ZVNCMllXeDFaWE1nWVhKbElHTnZiblpsY25SbFpDQjBieUF3TGx4eVhHNGdJQ01nVEc5dmMyVWdkSEoxZEdoNUlIWmhiSFZsY3lCaGNtVWdZMjl1ZG1WeWRHVmtJSFJ2SURFdVhISmNiaUFnSXlCQmJHd2diM1JvWlhJZ2RtRnNkV1Z6SUdGeVpTQndZWEp6WldRZ1lYTWdTVzUwWldkbGNuTXVYSEpjYmlBZ0l5QkdZV2xzZFhKbGN5QnlaWFIxY200Z1lYTWdUbUZPTGx4eVhHNGdJQ05jY2x4dUlDQkFiblZ0WW1WeU9pQW9hVzV3ZFhST2RXMHNJR1JsWm1GMWJIUk9kVzBwSUMwK1hISmNiaUFnSUNCMGNubEhaWFJPZFcxaVpYSWdQU0FvZG1Gc0tTQTlQbHh5WEc0Z0lDQWdJQ0J5WlhRZ1BTQk9ZVTVjY2x4dUlDQWdJQ0FnSXlCcFppQmdkbUZzWUNCaGJISmxZV1I1SUNocGN5bGJhWE11YUhSdGJGMGdZU0JPZFcxaVpYSXNJSEpsZEhWeWJpQnBkRnh5WEc0Z0lDQWdJQ0JwWmlCSlV5NXVkVzFpWlhJb2RtRnNLVnh5WEc0Z0lDQWdJQ0FnSUhKbGRDQTlJSFpoYkZ4eVhHNGdJQ0FnSUNBaklHVnNjMlVnYVdZZ1lIWmhiR0FnWVd4eVpXRmtlU0FvYVhNcFcybHpMbWgwYld4ZElHRWdVM1J5YVc1bklHOXlJR0VnUW05dmJHVmhiaXdnWTI5dWRtVnlkQ0JwZEZ4eVhHNGdJQ0FnSUNCbGJITmxJR2xtSUVsVExuTjBjbWx1WnloMllXd3BJRzl5SUVsVExtSnZiMndvZG1Gc0tWeHlYRzRnSUNBZ0lDQWdJSFJ5ZVVkbGRDQTlJQ2gyWVd4MVpTa2dQVDVjY2x4dUlDQWdJQ0FnSUNBZ0lHNTFiU0E5SUVCaWFXNWhjbmtvZG1Gc2RXVXBYSEpjYmlBZ0lDQWdJQ0FnSUNCdWRXMGdQU0FyZG1Gc2RXVWdJR2xtSUc1dmRDQkpVeTV1ZFcxaVpYSW9iblZ0S1NCaGJtUWdkbUZzZFdWY2NseHVJQ0FnSUNBZ0lDQWdJRzUxYlNBOUlGOHVjR0Z5YzJWSmJuUW9kbUZzZFdVc0lEQXBJR2xtSUc1dmRDQkpVeTV1ZFcxaVpYSW9iblZ0S1Z4eVhHNGdJQ0FnSUNBZ0lDQWdiblZ0WEhKY2JpQWdJQ0FnSUNBZ2NtVjBJRDBnZEhKNVIyVjBJSFpoYkZ4eVhHNGdJQ0FnSUNCeVpYUmNjbHh1WEhKY2JpQWdJQ0J5WlhSV1lXd2dQU0IwY25sSFpYUk9kVzFpWlhJb2FXNXdkWFJPZFcwcFhISmNiaUFnSUNCcFppQnViM1FnU1ZNdWJuVnRZbVZ5S0hKbGRGWmhiQ2xjY2x4dUlDQWdJQ0FnY21WMFZtRnNJRDBnZEhKNVIyVjBUblZ0WW1WeUtHUmxabUYxYkhST2RXMHBYSEpjYmlBZ0lDQWdJSEpsZEZaaGJDQTlJRTUxYldKbGNpNU9ZVTRnYVdZZ2JtOTBJRWxUTG01MWJXSmxjaWh5WlhSV1lXd3BYSEpjYmlBZ0lDQnlaWFJXWVd4Y2NseHVYSEpjYmlBZ0l5QWpJeUJ6ZEhKcGJtZGNjbHh1SUNBaklHTnZiblpsY25RZ1lXNGdiMkpxWldOMElIUnZJSE4wY21sdVoxeHlYRzRnSUVCemRISnBibWM2SUNocGJuQjFkRk4wY2l3Z1pHVm1ZWFZzZEZOMGNpa2dMVDVjY2x4dUlDQWdJSFJ5ZVVkbGRGTjBjbWx1WnlBOUlDaHpkSElwSUQwK1hISmNiaUFnSUNBZ0lISmxkQ0E5SUhWdVpHVm1hVzVsWkZ4eVhHNGdJQ0FnSUNCcFppQkpVeTV6ZEhKcGJtY29jM1J5S1Z4eVhHNGdJQ0FnSUNBZ0lISmxkQ0E5SUhOMGNseHlYRzRnSUNBZ0lDQmxiSE5sWEhKY2JpQWdJQ0FnSUNBZ2NtVjBJRDBnSnlkY2NseHVJQ0FnSUNBZ0lDQnlaWFFnUFNCemRISXVkRzlUZEhKcGJtY29LU0FnYVdZZ1NWTXVZbTl2YkNoemRISXBJRzl5SUVsVExtNTFiV0psY2loemRISXBJRzl5SUVsVExtUmhkR1VvYzNSeUtWeHlYRzRnSUNBZ0lDQnlaWFJjY2x4dUlDQWdJSEpsZERFZ1BTQjBjbmxIWlhSVGRISnBibWNvYVc1d2RYUlRkSElwWEhKY2JpQWdJQ0J5WlhReUlEMGdkSEo1UjJWMFUzUnlhVzVuS0dSbFptRjFiSFJUZEhJcFhISmNiaUFnSUNCeVpYUldZV3dnUFNBbkoxeHlYRzRnSUNBZ2FXWWdjbVYwTVM1c1pXNW5kR2dnYVhOdWRDQXdYSEpjYmlBZ0lDQWdJSEpsZEZaaGJDQTlJSEpsZERGY2NseHVJQ0FnSUdWc2MyVWdhV1lnY21WME1TQnBjeUJ5WlhReUlHOXlJSEpsZERJdWJHVnVaM1JvSUdseklEQmNjbHh1SUNBZ0lDQWdjbVYwVm1Gc0lEMGdjbVYwTVZ4eVhHNGdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQnlaWFJXWVd3Z1BTQnlaWFF5WEhKY2JpQWdJQ0J5WlhSV1lXeGNjbHh1WEhKY2JrOUtMbkpsWjJsemRHVnlJQ2QwYnljc0lGUlBYSEpjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVkU4aVhYMD0iLCIjICMgY3JlYXRlVVVJRFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuIyMjXHJcbkdlbmVyYXRlcyBhIHJhbmRvbSBzdHJpbmcgdGhhdCBjb21wbGllcyB0byB0aGUgUkZDIDQxMjIgc3BlY2lmaWNhdGlvbiBmb3IgR1VJRC9VVUlELlxyXG4oZS5nLiAnQjQyQTE1M0YtMUQ5QS00RjkyLTk5MDMtOTJDMTFERDY4NEQyJylcclxuV2hpbGUgbm90IGEgdHJ1ZSBVVUlELCBmb3IgdGhlIHB1cnBvc2VzIG9mIHRoaXMgYXBwbGljYXRpb24sIGl0IHNob3VsZCBiZSBzdWZmaWNpZW50LlxyXG4jIyNcclxuY3JlYXRlRmF1eFVVSUQgPSAtPlxyXG4gICAgXHJcbiAgIyBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmM0MTIyLnR4dFxyXG4gICMgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvaG93LXRvLWNyZWF0ZS1hLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0XHJcbiAgcyA9IFtdXHJcbiAgcy5sZW5ndGggPSAzNlxyXG4gIGhleERpZ2l0cyA9ICcwMTIzNDU2Nzg5YWJjZGVmJ1xyXG4gIGkgPSAwXHJcblxyXG4gIHdoaWxlIGkgPCAzNlxyXG4gICAgc1tpXSA9IGhleERpZ2l0cy5zdWJzdHIoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHgxMCksIDEpXHJcbiAgICBpICs9IDFcclxuICBzWzE0XSA9ICc0JyAjIGJpdHMgMTItMTUgb2YgdGhlIHRpbWVfaGlfYW5kX3ZlcnNpb24gZmllbGQgdG8gMDAxMFxyXG4gIHNbMTldID0gaGV4RGlnaXRzLnN1YnN0cigoc1sxOV0gJiAweDMpIHwgMHg4LCAxKSAjIGJpdHMgNi03IG9mIHRoZSBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkIHRvIDAxXHJcbiAgc1s4XSA9IHNbMTNdID0gc1sxOF0gPSBzWzIzXSA9ICctJ1xyXG4gIHV1aWQgPSBzLmpvaW4oJycpXHJcbiAgdXVpZFxyXG5cclxuT0oucmVnaXN0ZXIgJ2NyZWF0ZVVVSUQnLCBjcmVhdGVGYXV4VVVJRFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUZhdXhVVUlEIl19
