/**
 * ojs: OJ is a framework for writing web components and templates in frothy CoffeeScript or pure JavaScript. OJ provides a mechanism to rapidly build web applications using well encapsulated, modular code that doesn't rely on string templating or partially baked web standards.
 * @version: v0.4.39
 * @link: http://somecallmechief.github.io/oj/
 * @license: Puclic Domain, CC0 (http://creativecommons.org/about/pdm)
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

  return Node;

})();

['on', 'empty', 'text', 'removeClass', 'addClass', 'hasClass', 'show', 'hide', 'attr', 'css', 'remove', 'append', 'val', 'html', 'prop', 'trigger'].forEach(function(method) {
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxkb21cXG5vZGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBT0osT0FBQSxHQUFVOztBQUtKO0VBSVMsY0FBQyxNQUFELEdBQUE7O2lCQUViLElBQUEsR0FBTSxTQUFDLE9BQUQsRUFBVSxPQUFWO0FBQ0osUUFBQTtJQUFBLElBQUcsT0FBTyxDQUFDLElBQVg7YUFDRSxPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsRUFBbUIsT0FBbkIsRUFERjtLQUFBLE1BQUE7TUFHRSxNQUFBLEdBQVMsT0FBUSxDQUFBLE9BQUE7TUFDakIsSUFBRyxNQUFIO2VBQ0UsTUFBQSxDQUFPLE9BQVAsRUFERjtPQUFBLE1BQUE7UUFHRSxNQUFBLEdBQVMsRUFBRSxDQUFDLEtBQU0sQ0FBQSxPQUFBLENBQVQsSUFBcUIsRUFBRSxDQUFDLFVBQVcsQ0FBQSxPQUFBLENBQW5DLElBQStDLEVBQUUsQ0FBQyxRQUFTLENBQUEsT0FBQSxDQUEzRCxJQUF1RSxFQUFFLENBQUMsTUFBTyxDQUFBLE9BQUE7UUFDMUYsSUFBRyxNQUFBLElBQVUsQ0FBQyxNQUFNLENBQUMsZUFBckI7aUJBQ0UsTUFBQSxDQUFPLE9BQVAsRUFBZ0IsSUFBaEIsRUFERjtTQUFBLE1BQUE7VUFHRSxTQUFBLEdBQWdCLElBQUEsSUFBQSxDQUFBO1VBQ2hCLFNBQVMsQ0FBQyxPQUFWLEdBQW9CLGVBQUEsQ0FBZ0IsSUFBQyxDQUFBLE9BQWpCLEVBQTBCLE9BQTFCLEVBQW1DLE9BQW5DO2lCQUNwQixVQUxGO1NBSkY7T0FKRjs7RUFESTs7aUJBZ0JOLEdBQUEsR0FBSyxTQUFDLElBQUQsRUFBTyxLQUFQO0lBQ0gsSUFBSyxDQUFBLElBQUEsQ0FBTCxHQUFhO1dBRWIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxTQUFULEdBQXFCO0VBSGxCOztpQkFLTCxHQUFBLEdBQUssU0FBQyxJQUFEO0FBQ0gsUUFBQTtJQUFBLEtBQUEsR0FBUSxJQUFLLENBQUEsSUFBQTtJQUNiLElBQUcsS0FBQSxLQUFTLE1BQVo7TUFDRSxNQUFBLEdBQVMsSUFBQyxDQUFBO0FBQ1YsYUFBTSxNQUFBLEdBQVMsTUFBTSxDQUFDLFVBQXRCO1FBQ0UsSUFBRyxNQUFNLENBQUMsU0FBVjtBQUNFLGlCQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBakIsQ0FBcUIsSUFBckIsRUFEVDs7TUFERixDQUZGO0tBQUEsTUFBQTthQU1FLE1BTkY7O0VBRkc7Ozs7OztBQVVQLENBQ0UsSUFERixFQUVFLE9BRkYsRUFHRSxNQUhGLEVBSUUsYUFKRixFQUtFLFVBTEYsRUFNRSxVQU5GLEVBT0UsTUFQRixFQVFFLE1BUkYsRUFTRSxNQVRGLEVBVUUsS0FWRixFQVdFLFFBWEYsRUFZRSxRQVpGLEVBYUUsS0FiRixFQWNFLE1BZEYsRUFlRSxNQWZGLEVBZ0JFLFNBaEJGLENBaUJDLENBQUMsT0FqQkYsQ0FpQlUsU0FBQyxNQUFEO1NBQ1IsSUFBSSxDQUFDLFNBQVUsQ0FBQSxNQUFBLENBQWYsR0FBeUIsU0FBQTtBQUN2QixRQUFBO0lBQUEsYUFBQSxHQUFnQixJQUFDLENBQUE7V0FDakIsYUFBYyxDQUFBLE1BQUEsQ0FBTyxDQUFDLEtBQXRCLENBQTRCLGFBQTVCLEVBQTJDLFNBQTNDO0VBRnVCO0FBRGpCLENBakJWOztBQXVCQSxNQUFNLENBQUMsY0FBUCxDQUFzQixJQUFJLENBQUMsU0FBM0IsRUFBc0MsR0FBdEMsRUFDRTtFQUFBLEdBQUEsRUFBSyxTQUFBO0FBQ0gsUUFBQTtJQUFBLGFBQUEsR0FBZ0IsQ0FBQSxDQUFFLElBQUksQ0FBQyxPQUFQO0lBQ2hCLE1BQU0sQ0FBQyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLEdBQTVCLEVBQ0U7TUFBQSxLQUFBLEVBQU8sYUFBUDtLQURGO1dBR0E7RUFMRyxDQUFMO0NBREY7O0FBVUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsRUFBRSxDQUFDLElBQUgsR0FBVSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiT0ogPSByZXF1aXJlICcuLi9vaidcclxuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcclxuXHJcbiMgIyBkb21cclxuXHJcblxyXG4jIEV4dGVuZCBhbiBvYmplY3Qgd2l0aCBPSiBET00gbWV0aG9kcyBhbmQgcHJvcGVydGllc1xyXG5cclxubWV0aG9kcyA9IHt9XHJcblxyXG5cclxuIyAtIGBAZWxgIE9iamVjdCB0byBleHRlbmRcclxuIyAtIGBwYXJlbnRgIHBhcmVudCBvYmplY3QgdG8gd2hpY2ggYEBlbGAgd2lsbCBiZSBhcHBlbmRlZFxyXG5jbGFzcyBOb2RlXHJcbiAgXHJcbiAgI3BhcmVudDogcmVxdWlyZSgnLi9ib2R5JylcclxuICBcclxuICBjb25zdHJ1Y3RvcjogKHBhcmVudCkgLT5cclxuXHJcbiAgbWFrZTogKHRhZ05hbWUsIG9wdGlvbnMpIC0+XHJcbiAgICBpZiB0YWdOYW1lLm1ha2UgIyBwcm92aWRlZCBhIGN1c3RvbSBjb21wb25lbnQgZGlyZWN0bHlcclxuICAgICAgdGFnTmFtZS5tYWtlIHRoaXMsIG9wdGlvbnNcclxuICAgIGVsc2VcclxuICAgICAgbWV0aG9kID0gbWV0aG9kc1t0YWdOYW1lXVxyXG4gICAgICBpZiBtZXRob2RcclxuICAgICAgICBtZXRob2Qgb3B0aW9uc1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgbWV0aG9kID0gT0oubm9kZXNbdGFnTmFtZV0gb3IgT0ouY29tcG9uZW50c1t0YWdOYW1lXSBvciBPSi5jb250cm9sc1t0YWdOYW1lXSBvciBPSi5pbnB1dHNbdGFnTmFtZV1cclxuICAgICAgICBpZiBtZXRob2QgJiYgIW1ldGhvZC5kZWZhdWx0QmVoYXZpb3JcclxuICAgICAgICAgIG1ldGhvZCBvcHRpb25zLCB0aGlzXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgbmV3T0pOb2RlID0gbmV3IE5vZGUoKVxyXG4gICAgICAgICAgbmV3T0pOb2RlLmVsZW1lbnQgPSBvakNyZWF0ZUVsZW1lbnQgQGVsZW1lbnQsIHRhZ05hbWUsIG9wdGlvbnNcclxuICAgICAgICAgIG5ld09KTm9kZVxyXG5cclxuICBhZGQ6IChuYW1lLCB2YWx1ZSkgLT5cclxuICAgIHRoaXNbbmFtZV0gPSB2YWx1ZVxyXG4gICAgIyBtYWtlIHN1cmUgd2UgaGF2ZSBhIGxpbmsgYmFjayB0byBvdXJzZWx2ZXMsIHNvIHdlIGNhbiBpbmhlcml0IHZhbHVlc1xyXG4gICAgQGVsZW1lbnQub2pXcmFwcGVyID0gdGhpc1xyXG5cclxuICBnZXQ6IChuYW1lKSAtPlxyXG4gICAgdmFsdWUgPSB0aGlzW25hbWVdXHJcbiAgICBpZiB2YWx1ZSBpcyB1bmRlZmluZWRcclxuICAgICAgcGFyZW50ID0gQGVsZW1lbnRcclxuICAgICAgd2hpbGUgcGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGVcclxuICAgICAgICBpZiBwYXJlbnQub2pXcmFwcGVyXHJcbiAgICAgICAgICByZXR1cm4gcGFyZW50Lm9qV3JhcHBlci5nZXQgbmFtZVxyXG4gICAgZWxzZVxyXG4gICAgICB2YWx1ZVxyXG5cclxuW1xyXG4gICdvbidcclxuICAnZW1wdHknXHJcbiAgJ3RleHQnXHJcbiAgJ3JlbW92ZUNsYXNzJ1xyXG4gICdhZGRDbGFzcydcclxuICAnaGFzQ2xhc3MnXHJcbiAgJ3Nob3cnXHJcbiAgJ2hpZGUnXHJcbiAgJ2F0dHInXHJcbiAgJ2NzcydcclxuICAncmVtb3ZlJ1xyXG4gICdhcHBlbmQnXHJcbiAgJ3ZhbCdcclxuICAnaHRtbCdcclxuICAncHJvcCdcclxuICAndHJpZ2dlcidcclxuXS5mb3JFYWNoKChtZXRob2QpIC0+XHJcbiAgTm9kZS5wcm90b3R5cGVbbWV0aG9kXSA9ICgpIC0+XHJcbiAgICBqUXVlcnlXcmFwcGVyID0gQCRcclxuICAgIGpRdWVyeVdyYXBwZXJbbWV0aG9kXS5hcHBseShqUXVlcnlXcmFwcGVyLCBhcmd1bWVudHMpXHJcbilcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb2RlLnByb3RvdHlwZSwgJyQnLFxyXG4gIGdldDogKCkgLT5cclxuICAgIGpRdWVyeVdyYXBwZXIgPSAkKHRoaXMuZWxlbWVudClcclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnJCcsXHJcbiAgICAgIHZhbHVlOiBqUXVlcnlXcmFwcGVyXHJcbiAgICApXHJcbiAgICBqUXVlcnlXcmFwcGVyXHJcbilcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE9KLk5vZGUgPSBOb2RlIl19
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcaXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUVFOzs7RUFFSixFQUFDLENBQUEsSUFBRCxHQUFPLFNBQUMsT0FBRDtXQUNMLENBQUMsQ0FBQyxTQUFGLENBQVksT0FBWjtFQURLOztFQUdQLEVBQUMsQ0FBQSxnQkFBRCxHQUFtQixTQUFDLEdBQUQ7V0FDakIsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxHQUFWO0VBRGlCOztFQUduQixFQUFDLENBQUEsaUJBQUQsR0FBb0IsU0FBQyxHQUFEO1dBQ2xCLEdBQUEsSUFBUSxDQUFDLENBQUksR0FBRyxDQUFDLE1BQVIsSUFBa0IsR0FBRyxDQUFDLE1BQUosS0FBYyxDQUFoQyxJQUFxQyxDQUFJLEdBQUcsQ0FBQyxJQUE3QyxJQUFxRCxDQUFJLEdBQUcsQ0FBQyxJQUFKLENBQUEsQ0FBMUQ7RUFEVTs7RUFHcEIsRUFBQyxDQUFBLGlCQUFELEdBQW9CLFNBQUMsR0FBRDtXQUNsQixDQUFJLEdBQUosSUFBVyxLQUFBLENBQU0sR0FBTixDQUFYLElBQXlCLENBQUksR0FBRyxDQUFDO0VBRGY7O0VBR3BCLEVBQUMsQ0FBQSxlQUFELEdBQWtCLFNBQUMsRUFBRDtXQUNoQixDQUFJLEVBQUosSUFBVSxDQUFJLEVBQUUsQ0FBQztFQUREOztFQUdsQixFQUFDLENBQUEsaUJBQUQsR0FBb0IsU0FBQyxHQUFEO1dBQ2xCLENBQUMsQ0FBQyxPQUFGLENBQVUsR0FBQSxJQUFPLENBQUksTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLENBQVgsSUFBK0IsTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLENBQWdCLENBQUMsTUFBakIsS0FBMkIsQ0FBcEU7RUFEa0I7O0VBR3BCLEVBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxHQUFEO1dBQ1osQ0FBQyxDQUFDLGFBQUYsQ0FBZ0IsR0FBaEI7RUFEWTs7RUFHZCxFQUFDLENBQUEsTUFBRCxHQUFTLFNBQUMsR0FBRDtXQUNQLENBQUMsQ0FBQyxRQUFGLENBQVcsR0FBWDtFQURPOztFQUdULEVBQUMsQ0FBQSxJQUFELEdBQU8sU0FBQyxFQUFEO1dBQ0wsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxFQUFUO0VBREs7OztBQUlQOzs7O0VBR0EsRUFBQyxDQUFBLE1BQUQsR0FBUyxTQUFDLEdBQUQ7QUFDUCxRQUFBO0lBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxnQkFBUjtXQUNULE9BQU8sR0FBUCxLQUFjLFFBQWQsSUFBMkIsS0FBQSxLQUFTLENBQUMsTUFBTSxDQUFDLEtBQVAsQ0FBYSxHQUFiLENBQUEsSUFBcUIsS0FBQSxLQUFTLE1BQU0sQ0FBQyxRQUFQLENBQWdCLEdBQWhCLENBQTlCLElBQXNELE1BQU0sQ0FBQyxTQUFQLEtBQW9CLEdBQTFFLElBQWlGLE1BQU0sQ0FBQyxTQUFQLEtBQW9CLEdBQXRHO0VBRjdCOzs7QUFJVDs7OztFQUdBLEVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxHQUFEO0FBQ1IsUUFBQTtJQUFBLEdBQUEsR0FBTSxJQUFDLENBQUEsTUFBRCxDQUFRLEdBQVI7SUFDTixJQUFBLENBQU8sR0FBUDtNQUNFLEVBQUEsR0FBSyxPQUFBLENBQVEsTUFBUjtNQUNMLEtBQUEsR0FBUSxFQUFFLENBQUMsTUFBSCxDQUFVLEdBQVY7TUFDUixHQUFBLEdBQU0sSUFBQyxDQUFBLE1BQUQsQ0FBUSxLQUFSLEVBSFI7O1dBSUE7RUFOUTs7RUFRVixFQUFDLENBQUEsWUFBRCxHQUFlLFNBQUMsU0FBRDtXQUNiLEtBQUEsS0FBUyxJQUFDLENBQUEsV0FBRCxDQUFhLFFBQVEsQ0FBQyxjQUFULENBQXdCLFNBQXhCLENBQWI7RUFESTs7RUFHZixFQUFDLENBQUEsS0FBRCxHQUFRLFNBQUMsR0FBRDtXQUNOLENBQUMsQ0FBQyxPQUFGLENBQVUsR0FBVjtFQURNOztFQUdSLEVBQUMsQ0FBQSxNQUFELEdBQVMsU0FBQyxHQUFEO1dBQ1AsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxHQUFYO0VBRE87O0VBR1QsRUFBQyxDQUFBLE1BQUEsQ0FBRCxHQUFPLFNBQUMsR0FBRDtXQUNMLEdBQUEsS0FBTyxJQUFQLElBQWUsR0FBQSxLQUFPLE1BQXRCLElBQWdDLEdBQUEsS0FBTyxDQUF2QyxJQUE0QyxHQUFBLEtBQU87RUFEOUM7O0VBR1AsRUFBQyxDQUFBLE9BQUEsQ0FBRCxHQUFRLFNBQUMsR0FBRDtXQUNOLEdBQUEsS0FBTyxLQUFQLElBQWdCLEdBQUEsS0FBTyxPQUF2QixJQUFrQyxHQUFBLEtBQU8sQ0FBekMsSUFBOEMsR0FBQSxLQUFPO0VBRC9DOztFQUdSLEVBQUMsQ0FBQSxXQUFELEdBQWMsU0FBQyxHQUFEO1dBQ1osSUFBQyxDQUFBLE1BQUEsQ0FBRCxDQUFNLEdBQUEsSUFBTyxJQUFDLENBQUEsT0FBQSxDQUFELENBQU8sR0FBUCxDQUFiO0VBRFk7O0VBR2QsRUFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEdBQUQsRUFBTSxXQUFOO1dBQ1osQ0FBQyxDQUFDLE9BQUYsQ0FBVSxHQUFWLENBQUEsSUFBa0IsQ0FBQyxDQUFDLFdBQUYsQ0FBYyxHQUFkLENBQWxCLElBQXdDLENBQUMsQ0FBQyxNQUFGLENBQVMsR0FBVCxDQUF4QyxJQUF5RCxDQUFDLENBQUMsS0FBRixDQUFRLEdBQVI7RUFEN0M7O0VBR2QsRUFBQyxDQUFBLGVBQUQsR0FBa0IsU0FBQyxHQUFELEVBQU0sV0FBTjtXQUNoQixDQUFDLENBQUMsV0FBRixDQUFjLEdBQWQsQ0FBQSxJQUFzQixDQUFDLENBQUMsTUFBRixDQUFTLEdBQVQsQ0FBdEIsSUFBdUMsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxHQUFSO0VBRHZCOztFQUdsQixFQUFDLENBQUEsWUFBQSxDQUFELEdBQWEsU0FBQyxJQUFELEVBQU8sR0FBUDtXQUNYLEdBQUcsQ0FBQyxJQUFKLEtBQVksSUFBWixJQUFvQixHQUFBLFlBQWU7RUFEeEI7O0VBR2IsRUFBQyxDQUFBLE1BQUQsR0FBUyxTQUFDLEdBQUQ7V0FDUCxHQUFBLEtBQVMsRUFBRSxDQUFDLElBQVosSUFBcUIsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxHQUFiO0VBRGQ7OztBQUdUOzs7O0VBR0EsRUFBQyxDQUFBLElBQUQsR0FBUSxFQUFDLENBQUE7Ozs7OztBQUlYLEVBQUUsQ0FBQyxRQUFILENBQVksSUFBWixFQUFrQixFQUFsQjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiT0ogPSByZXF1aXJlICcuLi9vaidcclxuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuXHJcbmNsYXNzIElTXHJcblxyXG4gIEBib29sOiAoYm9vbGVhbikgLT5cclxuICAgIF8uaXNCb29sZWFuIGJvb2xlYW5cclxuXHJcbiAgQGFycmF5TnVsbE9yRW1wdHk6IChhcnIpIC0+XHJcbiAgICBfLmlzRW1wdHkgYXJyXHJcblxyXG4gIEBzdHJpbmdOdWxsT3JFbXB0eTogKHN0cikgLT5cclxuICAgIHN0ciBhbmQgKG5vdCBzdHIubGVuZ3RoIG9yIHN0ci5sZW5ndGggaXMgMCBvciBub3Qgc3RyLnRyaW0gb3Igbm90IHN0ci50cmltKCkpXHJcblxyXG4gIEBudW1iZXJOdWxsT3JFbXB0eTogKG51bSkgLT5cclxuICAgIG5vdCBudW0gb3IgaXNOYU4obnVtKSBvciBub3QgbnVtLnRvUHJlY2lzaW9uXHJcblxyXG4gIEBkYXRlTnVsbE9yRW1wdHk6IChkdCkgLT5cclxuICAgIG5vdCBkdCBvciBub3QgZHQuZ2V0VGltZVxyXG5cclxuICBAb2JqZWN0TnVsbE9yRW1wdHk6IChvYmopIC0+XHJcbiAgICBfLmlzRW1wdHkgb2JqIG9yIG5vdCBPYmplY3Qua2V5cyhvYmopIG9yIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoIGlzIDBcclxuXHJcbiAgQHBsYWluT2JqZWN0OiAob2JqKSAtPlxyXG4gICAgXy5pc1BsYWluT2JqZWN0IG9ialxyXG5cclxuICBAb2JqZWN0OiAob2JqKSAtPlxyXG4gICAgXy5pc09iamVjdCBvYmpcclxuXHJcbiAgQGRhdGU6IChkdCkgLT5cclxuICAgIF8uaXNEYXRlIGR0XHJcblxyXG5cclxuICAjIyNcclxuICBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgYW4gaW5zdGFuY2Ugb2YgYSBOdW1iZXIgYW5kIG5vdCBOYU4qXHJcbiAgIyMjXHJcbiAgQG51bWJlcjogKG51bSkgLT5cclxuICAgIG51bWJlciA9IHJlcXVpcmUgJy4uL2NvcmUvbnVtYmVyJ1xyXG4gICAgdHlwZW9mIG51bSBpcyAnbnVtYmVyJyBhbmQgZmFsc2UgaXMgKG51bWJlci5pc05hTihudW0pIG9yIGZhbHNlIGlzIG51bWJlci5pc0Zpbml0ZShudW0pIG9yIG51bWJlci5NQVhfVkFMVUUgaXMgbnVtIG9yIG51bWJlci5NSU5fVkFMVUUgaXMgbnVtKVxyXG5cclxuICAjIyNcclxuICBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgY29udmVydGlibGUgdG8gYSBOdW1iZXJcclxuICAjIyNcclxuICBAbnVtZXJpYzogKG51bSkgLT5cclxuICAgIHJldCA9IEBudW1iZXIobnVtKVxyXG4gICAgdW5sZXNzIHJldFxyXG4gICAgICB0byA9IHJlcXVpcmUgJy4vdG8nXHJcbiAgICAgIG51TnVtID0gdG8ubnVtYmVyKG51bSlcclxuICAgICAgcmV0ID0gQG51bWJlcihudU51bSlcclxuICAgIHJldFxyXG5cclxuICBAZWxlbWVudEluRG9tOiAoZWxlbWVudElkKSAtPlxyXG4gICAgZmFsc2UgaXMgQG51bGxPckVtcHR5KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCkpXHJcblxyXG4gIEBhcnJheTogKG9iaikgLT5cclxuICAgIF8uaXNBcnJheSBvYmpcclxuXHJcbiAgQHN0cmluZzogKHN0cikgLT5cclxuICAgIF8uaXNTdHJpbmcgc3RyXHJcblxyXG4gIEB0cnVlOiAob2JqKSAtPlxyXG4gICAgb2JqIGlzIHRydWUgb3Igb2JqIGlzICd0cnVlJyBvciBvYmogaXMgMSBvciBvYmogaXMgJzEnXHJcblxyXG4gIEBmYWxzZTogKG9iaikgLT5cclxuICAgIG9iaiBpcyBmYWxzZSBvciBvYmogaXMgJ2ZhbHNlJyBvciBvYmogaXMgMCBvciBvYmogaXMgJzAnXHJcblxyXG4gIEB0cnVlT3JGYWxzZTogKG9iaikgLT5cclxuICAgIEB0cnVlIG9iaiBvciBAZmFsc2Ugb2JqXHJcblxyXG4gIEBudWxsT3JFbXB0eTogKG9iaiwgY2hlY2tMZW5ndGgpIC0+XHJcbiAgICBfLmlzRW1wdHkob2JqKSBvciBfLmlzVW5kZWZpbmVkKG9iaikgb3IgXy5pc051bGwob2JqKSBvciBfLmlzTmFOKG9iailcclxuXHJcbiAgQG51bGxPclVuZGVmaW5lZDogKG9iaiwgY2hlY2tMZW5ndGgpIC0+XHJcbiAgICBfLmlzVW5kZWZpbmVkKG9iaikgb3IgXy5pc051bGwob2JqKSBvciBfLmlzTmFOKG9iailcclxuXHJcbiAgQGluc3RhbmNlb2Y6IChuYW1lLCBvYmopIC0+XHJcbiAgICBvYmoudHlwZSBpcyBuYW1lIG9yIG9iaiBpbnN0YW5jZW9mIG5hbWVcclxuXHJcbiAgQG1ldGhvZDogKG9iaikgLT5cclxuICAgIG9iaiBpc250IE9KLm5vb3AgYW5kIF8uaXNGdW5jdGlvbiBvYmpcclxuXHJcbiAgIyMjXHJcbiAgRGVwcmVjYXRlZC4gTGVmdCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIFVzZSBpcy5tZXRob2QgaW5zdGVhZC5cclxuICAjIyNcclxuICBAZnVuYyA9IEBtZXRob2RcclxuXHJcblxyXG5cclxuT0oucmVnaXN0ZXIgJ2lzJywgSVNcclxubW9kdWxlLmV4cG9ydHMgPSBJU1xyXG5cclxuIl19
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVudHJ5cG9pbnQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGFzeW5jXFxhamF4LmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxhc3luY1xccHJvbWlzZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcZ3JpZC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcaW5wdXRncm91cC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGFicy5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGlsZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29udHJvbHNcXGljb24uY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGRhdGUuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGZ1bmN0aW9uLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxudW1iZXIuY29mZmVlIiwic3JjL2NvZmZlZS9jb3JlL29iamVjdC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxccHJvcGVydHkuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXHN0cmluZy5jb2ZmZWUiLCJzcmMvY29mZmVlL2RvbS9ib2R5LmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxkb21cXGNvbXBvbmVudC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxjb250cm9sLmNvZmZlZSIsInNyYy9jb2ZmZWUvZG9tL2VsZW1lbnQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZnJhZ21lbnQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZ2VuZXJpY3MuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcaW5wdXQuY29mZmVlIiwic3JjL2NvZmZlZS9kb20vbm9kZS5jb2ZmZWUiLCJzcmMvY29mZmVlL2RvbS9ub2RlRmFjdG9yeS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGEuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxici5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGZvcm0uY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxpbnB1dC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXG9sLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcc2VsZWN0LmNvZmZlZSIsInNyYy9jb2ZmZWUvZWxlbWVudHMvdGFibGUuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0ZXh0YXJlYS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHRoZWFkLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdWwuY29mZmVlIiwic3JjL2NvZmZlZS9nbG9iYWwuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcYnV0dG9uaW5wdXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcY2hlY2tib3guY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcY29sb3IuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxkYXRldGltZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxkYXRldGltZWxvY2FsLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGVtYWlsLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGZpbGUuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcaGlkZGVuLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGltYWdlaW5wdXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcbW9udGguY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcbnVtYmVyLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHBhc3N3b3JkLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJhZGlvLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJhbmdlLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJlc2V0LmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHNlYXJjaC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxzdWJtaXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdGVsLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHRleHRpbnB1dC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx0aW1lLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHVybC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx3ZWVrLmNvZmZlZSIsInNyYy9jb2ZmZWUvb2ouY29mZmVlIiwic3JjL2NvZmZlZS9vakluaXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxKc29uVG9UYWJsZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGFycmF5MkQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxjb25zb2xlLmNvZmZlZSIsInNyYy9jb2ZmZWUvdG9vbHMvY29va2llLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZGVmZXIuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlYWNoLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZW51bXMuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxoaXN0b3J5LmNvZmZlZSIsInNyYy9jb2ZmZWUvdG9vbHMvaXMuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy9ub3R5LmNvZmZlZSIsInNyYy9jb2ZmZWUvdG9vbHMvcHVic3ViLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xccXVlcnlTdHJpbmcuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy9yYW5nZXMuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy90by5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHV1aWQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsT0FBQSxDQUFRLE1BQVI7O0FBQ0EsT0FBQSxDQUFRLFVBQVI7O0FBQ0EsT0FBQSxDQUFRLGNBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEseUJBQVI7O0FBQ0EsT0FBQSxDQUFRLG1CQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGFBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsWUFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGVBQVI7O0FBQ0EsT0FBQSxDQUFRLFlBQVI7O0FBQ0EsT0FBQSxDQUFRLGVBQVI7O0FBQ0EsT0FBQSxDQUFRLGdCQUFSOztBQUNBLE9BQUEsQ0FBUSxnQkFBUjs7QUFDQSxPQUFBLENBQVEsYUFBUjs7QUFDQSxPQUFBLENBQVEsY0FBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGtCQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsa0JBQVI7O0FBQ0EsT0FBQSxDQUFRLHFCQUFSOztBQUNBLE9BQUEsQ0FBUSxr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UCxJQTFCTyxFQTJCUCxJQTNCTyxFQTRCUCxVQTVCTyxFQTZCUCxZQTdCTyxFQThCUCxRQTlCTyxFQStCUCxNQS9CTyxFQWdDUCxRQWhDTyxFQWlDUCxJQWpDTyxFQWtDUCxJQWxDTyxFQW1DUCxJQW5DTyxFQW9DUCxJQXBDTyxFQXFDUCxJQXJDTyxFQXNDUCxJQXRDTyxFQXVDUCxNQXZDTyxFQXdDUCxRQXhDTyxFQXlDUCxRQXpDTyxFQTBDUCxNQTFDTyxFQTJDUCxHQTNDTyxFQTRDUCxRQTVDTyxFQTZDUCxLQTdDTyxFQThDUCxLQTlDTyxFQStDUCxPQS9DTyxFQWdEUCxRQWhETyxFQWlEUCxJQWpETyxFQWtEUCxLQWxETyxFQW1EUCxNQW5ETyxFQW9EUCxNQXBETyxFQXFEUCxPQXJETyxFQXNEUCxLQXRETyxFQXVEUCxVQXZETyxFQXdEUCxVQXhETyxFQXlEUCxRQXpETyxFQTBEUCxVQTFETyxFQTJEUCxRQTNETyxFQTREUCxRQTVETyxFQTZEUCxHQTdETyxFQThEUCxLQTlETyxFQStEUCxVQS9ETyxFQWdFUCxHQWhFTyxFQWlFUCxJQWpFTyxFQWtFUCxJQWxFTyxFQW1FUCxNQW5FTyxFQW9FUCxHQXBFTyxFQXFFUCxNQXJFTyxFQXNFUCxTQXRFTyxFQXVFUCxPQXZFTyxFQXdFUCxNQXhFTyxFQXlFUCxRQXpFTyxFQTBFUCxRQTFFTyxFQTJFUCxPQTNFTyxFQTRFUCxLQTVFTyxFQTZFUCxTQTdFTyxFQThFUCxLQTlFTyxFQStFUCxPQS9FTyxFQWdGUCxJQWhGTyxFQWlGUCxPQWpGTyxFQWtGUCxJQWxGTyxFQW1GUCxNQW5GTyxFQW9GUCxPQXBGTyxFQXFGUCxJQXJGTyxFQXNGUCxJQXRGTyxFQXVGUCxHQXZGTyxFQXdGUCxLQXhGTyxFQXlGUCxPQXpGTyxFQTBGUCxLQTFGTzs7QUE0RlQsSUFBQSxHQUFPLDJFQUEyRSxDQUFDLEtBQTVFLENBQWtGLEdBQWxGOztBQUNQLEdBQUEsR0FBTSxNQUFNLENBQUMsTUFBUCxDQUFjLElBQWQ7O0FBRU4sT0FBQSxHQUFVOztLQUdMLFNBQUMsR0FBRDtBQUNELE1BQUE7RUFBQSxNQUFBLEdBQVMsU0FBQyxPQUFELEVBQVUsS0FBVixFQUEyQixpQkFBM0I7QUFFUCxRQUFBOztNQUZpQixRQUFRLEVBQUUsQ0FBQzs7O01BQU0sb0JBQW9COztJQUV0RCxRQUFBLEdBQ0U7TUFBQSxLQUFBLEVBQU8sRUFBUDtNQUNBLE1BQUEsRUFBUSxFQURSO01BRUEsTUFBQSxFQUFRLEVBRlI7O0lBSUYsR0FBRyxDQUFDLE1BQUosQ0FBVyxRQUFYLEVBQXFCLE9BQXJCO0lBQ0EsR0FBQSxHQUFNLFdBQUEsQ0FBWSxHQUFaLEVBQWlCLFFBQWpCLEVBQTJCLEtBQTNCLEVBQWtDLGlCQUFsQztXQUVOO0VBVk87RUFXVCxNQUFNLENBQUMsZUFBUCxHQUF5QjtFQUN6QixFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsR0FBbEIsRUFBdUIsTUFBdkI7U0FDQSxPQUFRLENBQUEsR0FBQSxDQUFSLEdBQWU7QUFkZDtBQURMLEtBQUEscUNBQUE7O0tBQ1k7QUFEWjs7QUFpQkEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDekhqQixJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7O0FBRUw7Ozs7QUFHQSxLQUFBLEdBQVEsU0FBQyxPQUFELEVBQXdCLEtBQXhCO0FBQ04sTUFBQTs7SUFETyxVQUFVLEVBQUUsQ0FBQyxNQUFILENBQUE7O0VBQ2pCLElBQUcsQ0FBSSxLQUFQO0FBQWtCLFVBQVUsSUFBQSxLQUFBLENBQU0seUNBQU4sRUFBNUI7O0VBQ0EsSUFBRyxDQUFJLE9BQU8sQ0FBQyxLQUFaLElBQXFCLENBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUExQztBQUFvRCxVQUFVLElBQUEsS0FBQSxDQUFNLDhDQUFOLEVBQTlEOztFQUNBLEdBQUEsR0FBTSxLQUFLLENBQUMsSUFBTixDQUFXLE9BQVgsRUFBb0IsT0FBcEI7RUFDTixHQUFHLENBQUMsR0FBSixDQUFRLFdBQVIsRUFBcUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFuQztTQUNBO0FBTE07O0FBT1IsRUFBRSxDQUFDLFFBQUgsQ0FBWSxPQUFaLEVBQXFCLEtBQXJCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7OztBQ2JqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0EsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7OztBQUVMOzs7O0FBR0EsV0FBQSxHQUFjLFNBQUMsS0FBRDtBQUNaLE1BQUE7RUFBQSxHQUFBLEdBQU07RUFFTixJQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBYjtJQUNFLE1BQUEsR0FBVSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBMUIsQ0FBaUMsQ0FBakMsQ0FBbUMsQ0FBQyxLQUFwQyxDQUEwQyxHQUExQztJQUNWLElBQUcsTUFBSDtNQUNFLENBQUEsR0FBSTtBQUNKLGFBQU0sQ0FBQSxHQUFJLE1BQU0sQ0FBQyxNQUFqQjtRQUNFLEdBQUEsR0FBTSxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBVixDQUFnQixHQUFoQjtRQUNOLElBQUcsR0FBRyxDQUFDLE1BQUosS0FBYyxDQUFqQjtVQUNFLEdBQUksQ0FBQSxHQUFJLENBQUEsQ0FBQSxDQUFKLENBQUosR0FBYyxFQUFFLENBQUMsTUFBTSxDQUFDLGtCQUFWLENBQTZCLEdBQUksQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFQLENBQWUsS0FBZixFQUFzQixHQUF0QixDQUE3QixFQURoQjs7UUFFQSxDQUFBLElBQUs7TUFKUCxDQUZGO0tBRkY7O1NBU0E7QUFaWTs7QUFjZCxFQUFFLENBQUMsUUFBSCxDQUFZLGFBQVosRUFBMEIsV0FBMUI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDcEJqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7OztBQUVMOzs7Ozs7QUFLQSxjQUFBLEdBQWlCLFNBQUE7QUFJZixNQUFBO0VBQUEsQ0FBQSxHQUFJO0VBQ0osQ0FBQyxDQUFDLE1BQUYsR0FBVztFQUNYLFNBQUEsR0FBWTtFQUNaLENBQUEsR0FBSTtBQUVKLFNBQU0sQ0FBQSxHQUFJLEVBQVY7SUFDRSxDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU8sU0FBUyxDQUFDLE1BQVYsQ0FBaUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsTUFBTCxDQUFBLENBQUEsR0FBZ0IsSUFBM0IsQ0FBakIsRUFBbUQsQ0FBbkQ7SUFDUCxDQUFBLElBQUs7RUFGUDtFQUdBLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUTtFQUNSLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxTQUFTLENBQUMsTUFBVixDQUFpQixDQUFDLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxHQUFULENBQUEsR0FBZ0IsR0FBakMsRUFBc0MsQ0FBdEM7RUFDUixDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU8sQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVE7RUFDL0IsSUFBQSxHQUFPLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUDtTQUNQO0FBaEJlOztBQWtCakIsRUFBRSxDQUFDLFFBQUgsQ0FBWSxZQUFaLEVBQTBCLGNBQTFCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUgJy4vb2onXHJcbnJlcXVpcmUgJy4vb2pJbml0J1xyXG5yZXF1aXJlICcuL2FzeW5jL2FqYXgnXHJcbnJlcXVpcmUgJy4vYXN5bmMvcHJvbWlzZSdcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL2dyaWQnXHJcbnJlcXVpcmUgJy4vY29tcG9uZW50cy9pbnB1dGdyb3VwJ1xyXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvdGFicydcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL3RpbGUnXHJcbnJlcXVpcmUgJy4vY29udHJvbHMvaWNvbidcclxucmVxdWlyZSAnLi9jb3JlL2RhdGUnXHJcbnJlcXVpcmUgJy4vY29yZS9mdW5jdGlvbidcclxucmVxdWlyZSAnLi9jb3JlL251bWJlcidcclxucmVxdWlyZSAnLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi9jb3JlL3N0cmluZydcclxucmVxdWlyZSAnLi9kb20vbm9kZUZhY3RvcnknXHJcbnJlcXVpcmUgJy4vZG9tL2JvZHknXHJcbnJlcXVpcmUgJy4vZG9tL2NvbXBvbmVudCdcclxucmVxdWlyZSAnLi9kb20vY29udHJvbCdcclxucmVxdWlyZSAnLi9kb20vbm9kZSdcclxucmVxdWlyZSAnLi9kb20vZWxlbWVudCdcclxucmVxdWlyZSAnLi9kb20vZnJhZ21lbnQnXHJcbnJlcXVpcmUgJy4vZG9tL2dlbmVyaWNzJ1xyXG5yZXF1aXJlICcuL2RvbS9pbnB1dCdcclxucmVxdWlyZSAnLi9lbGVtZW50cy9hJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2JyJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2Zvcm0nXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvaW5wdXQnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvb2wnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvc2VsZWN0J1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RhYmxlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RleHRhcmVhJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RoZWFkJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3VsJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9idXR0b25pbnB1dCdcclxucmVxdWlyZSAnLi9pbnB1dHMvY2hlY2tib3gnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2NvbG9yJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9kYXRlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9kYXRldGltZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZXRpbWVsb2NhbCdcclxucmVxdWlyZSAnLi9pbnB1dHMvZW1haWwnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2ZpbGUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2hpZGRlbidcclxucmVxdWlyZSAnLi9pbnB1dHMvaW1hZ2VpbnB1dCdcclxucmVxdWlyZSAnLi9pbnB1dHMvbW9udGgnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL251bWJlcidcclxucmVxdWlyZSAnLi9pbnB1dHMvcGFzc3dvcmQnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3JhZGlvJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9yYW5nZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvcmVzZXQnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3NlYXJjaCdcclxucmVxdWlyZSAnLi9pbnB1dHMvc3VibWl0J1xyXG5yZXF1aXJlICcuL2lucHV0cy90ZWwnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3RleHRpbnB1dCdcclxucmVxdWlyZSAnLi9pbnB1dHMvdGltZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvdXJsJ1xyXG5yZXF1aXJlICcuL2lucHV0cy93ZWVrJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2FycmF5MkQnXHJcbnJlcXVpcmUgJy4vdG9vbHMvY29uc29sZSdcclxucmVxdWlyZSAnLi90b29scy9jb29raWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvZGVmZXInXHJcbnJlcXVpcmUgJy4vdG9vbHMvZWFjaCdcclxucmVxdWlyZSAnLi90b29scy9lbnVtcydcclxucmVxdWlyZSAnLi90b29scy9oaXN0b3J5J1xyXG5yZXF1aXJlICcuL3Rvb2xzL2lzJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL25vdHknXHJcbnJlcXVpcmUgJy4vdG9vbHMvcHVic3ViJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL3F1ZXJ5U3RyaW5nJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL3JhbmdlcydcclxucmVxdWlyZSAnLi90b29scy90bydcclxucmVxdWlyZSAnLi90b29scy91dWlkJ1xyXG4iLCIjICMgYWpheFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbmNvbmZpZyA9IHt9XHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgb24gc3VjY2VzcyBoYW5kbGVyLCB3cml0ZSBvdXQgdGhlIHJlcXVlc3Qgc3RhdHMgdG8gYSB0YWJsZVxyXG5jb25maWcub25TdWNjZXNzID0gKG9wdHMsIGRhdGEsIHVybCkgLT5cclxuICByZXNwb25zZSA9IHt9XHJcbiAgT0ouZXh0ZW5kIHJlc3BvbnNlLCBkYXRhXHJcbiAgb3B0cy5vblN1Y2Nlc3MgcmVzcG9uc2VcclxuICBpZiBPSi5MT0dfQUxMX0FKQVhcclxuICAgIE9KLmNvbnNvbGUudGFibGUgW1xyXG4gICAgICBXZWJzZXJ2aWNlOiBvcHRzLmFqYXhPcHRzLnVybFxyXG4gICAgICBTdGFydFRpbWU6IG9wdHMuc3RhcnRUaW1lXHJcbiAgICAgIEVuZFRpbWU6IG5ldyBEYXRlKClcclxuICAgIF0gXHJcbiAgcmV0dXJuXHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgb24gZXJyb3IgaGFuZGxlciwgd3JpdGUgb3V0IHRoZSByZXF1ZXN0IGVycm9yIGNvbmV4dCB0byBhIHRhYmxlXHJcbmNvbmZpZy5vbkVycm9yID0gKHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzLCBwYXJhbTEsIG9wdHMgPSBPSi5vYmplY3QoKSkgLT5cclxuICBpZiB0ZXh0U3RhdHVzIGlzbnQgJ2Fib3J0J1xyXG4gICAgaWYgT0ouTE9HX0FMTF9BSkFYX0VSUk9SU1xyXG4gICAgICBPSi5jb25zb2xlLnRhYmxlIFtcclxuICAgICAgICBXZWJzZXJ2aWNlOiBvcHRzLmFqYXhPcHRzLnVybFxyXG4gICAgICAgIERhdGE6IG9wdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgICAgIEZhaWxlZDogdGV4dFN0YXR1c1xyXG4gICAgICAgIFN0YXRlOiB4bWxIdHRwUmVxdWVzdC5zdGF0ZSgpXHJcbiAgICAgICAgU3RhdHVzOiB4bWxIdHRwUmVxdWVzdC5zdGF0dXNcclxuICAgICAgICBTdGF0dXNUZXh0OiB4bWxIdHRwUmVxdWVzdC5zdGF0dXNUZXh0XHJcbiAgICAgICAgUmVhZHlTdGF0ZTogeG1sSHR0cFJlcXVlc3QucmVhZHlTdGF0ZVxyXG4gICAgICAgIFJlc3BvbnNlVGV4dDogeG1sSHR0cFJlcXVlc3QucmVzcG9uc2VUZXh0XHJcbiAgICAgIF1cclxuXHJcbiAgICBvcHRzLm9uRXJyb3IgdGV4dFN0YXR1c1xyXG4gIHJldHVyblxyXG4gIFxyXG4jIGluIHRoZSBjYXNlIHdoZXJlIGBvcHRzYCBpcyBhIHN0cmluZywgY29udmVydCBpdCB0byBhbiBvYmplY3Rcclxub3B0c0Zyb21VcmwgPSAob3B0cykgLT5cclxuICBpZiBPSi5pcy5zdHJpbmcgb3B0c1xyXG4gICAgdXJsID0gb3B0c1xyXG4gICAgb3B0cyA9IE9KLm9iamVjdCgpXHJcbiAgICBvcHRzLmFkZCAnYWpheE9wdHMnLCBPSi5vYmplY3QoKVxyXG4gICAgb3B0cy5hamF4T3B0cy5hZGQgJ3VybCcsIHVybFxyXG4gIG9wdHNcclxuICBcclxuIyBkZWZpbmUgYSBzdGFuZGFyZCBgZXhlY2AgbWV0aG9kIHRvIGhhbmRsZSBhbGwgcmVxdWVzdCB2ZXJicy4gVXNlcyB0aGUgW2pRdWVyeS5hamF4XShodHRwOi8vYXBpLmpxdWVyeS5jb20vY2F0ZWdvcnkvYWpheC8pIEFQSS5cclxuIyBgZXhlY1JlcXVlc3RgIHJldHVybnMgYSBwcm9taXNlIHJlcHJlc2VudCB0aGUgYWN0dWFsIEFKQVggY2FsbC5cclxuICBcclxuIyAtIGB2ZXJiYCBkZWZhdWx0IHZhbHVlID0gJ0dFVCdcclxuIyAtIGBvcHRzYCBvYmplY3RcclxuIyAtLSBgb3B0cy5hamF4T3B0c2Agb2JqZWN0IGZvciBhbGwgalF1ZXJ5J3MgYWpheC1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxyXG5jb25maWcuZXhlY1JlcXVlc3QgPSAodmVyYiA9ICdHRVQnLCBvcHRzKSAtPlxyXG4gIGRlZmF1bHRzID1cclxuICAgIGFqYXhPcHRzOlxyXG4gICAgICB1cmw6ICcnXHJcbiAgICAgIGRhdGE6IHt9XHJcbiAgICAgIHR5cGU6IHZlcmJcclxuICAgICAgeGhyRmllbGRzOlxyXG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICBkYXRhVHlwZTogJ2pzb24nXHJcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuICAgICAgICBcclxuICAgIG9uU3VjY2VzczogT0oubm9vcFxyXG4gICAgb25FcnJvcjogT0oubm9vcFxyXG4gICAgb25Db21wbGV0ZTogT0oubm9vcFxyXG4gICAgb3ZlcnJpZGVFcnJvcjogZmFsc2VcclxuICAgIHdhdGNoR2xvYmFsOiB0cnVlXHJcbiAgICB1c2VDYWNoZTogZmFsc2VcclxuICAgIFxyXG4gIG9wdHMgPSBvcHRzRnJvbVVybCBvcHRzXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRzLCB0cnVlXHJcbiAgICBcclxuICBkZWZhdWx0cy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpXHJcbiAgICBcclxuICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXHJcbiAgICAjIEdFVCByZXF1ZXN0cyBleHBlY3QgcXVlcnlTdHJpbmcgcGFyYW1ldGVyc1xyXG4gICAgaWYgZGVmYXVsdHMuYWpheE9wdHMudmVyYiBpcyAnR0VUJ1xyXG4gICAgICBkZWZhdWx0cy5hamF4T3B0cy5kYXRhID0gT0oucGFyYW1zIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcclxuICAgICMgYWxsIG90aGVyIHJlcXVlc3RzIHRha2UgYW4gb2JqZWN0XHJcbiAgICBlbHNlXHJcbiAgICAgIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGEgPSBPSi5zZXJpYWxpemUgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgXHJcbiAgZ2V0SlF1ZXJ5RGVmZXJyZWQgPSAod2F0Y2hHbG9iYWwpIC0+XHJcbiAgICByZXQgPSAkLmFqYXggZGVmYXVsdHMuYWpheE9wdHNcclxuICAgICAgXHJcbiAgICByZXQuZG9uZSAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIC0+XHJcbiAgICAgIGNvbmZpZy5vblN1Y2Nlc3MgZGVmYXVsdHMsIGRhdGFcclxuXHJcbiAgICByZXQuZmFpbCAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGV4dCkgLT5cclxuICAgICAgY29uZmlnLm9uRXJyb3IganFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGV4dCwgZGVmYXVsdHNcclxuICBcclxuICAgIHJldC5hbHdheXMgKHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzKSAtPlxyXG4gICAgICBkZWZhdWx0cy5vbkNvbXBsZXRlIHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzXHJcblxyXG4gICAgT0ouYXN5bmMuYWpheFByb21pc2UgcmV0XHJcblxyXG4gIHByb21pc2UgPSBnZXRKUXVlcnlEZWZlcnJlZChkZWZhdWx0cy53YXRjaEdsb2JhbClcclxuICBwcm9taXNlXHJcbiAgXHJcbmFqYXggPSB7fVxyXG4gIFxyXG4jICMjIHBvc3RcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXgucG9zdDogaW5zZXJ0IGEgbmV3IG9iamVjdCBvciBpbml0IGEgZm9ybSBwb3N0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC4gXHJcbmFqYXgucG9zdCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnUE9TVCcsIG9wdHNcclxuICBcclxuIyAjIyBnZXRcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXguZ2V0OiBnZXQgYW4gZXhpc3Rpbmcgb2JqZWN0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuI1xyXG5hamF4LmdldCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnR0VUJywgb3B0c1xyXG5cclxuIyAjIyBkZWxldGVcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXguZGVsZXRlOiBkZWxldGUgYW4gZXhpc3Rpbmcgb2JqZWN0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuYWpheC5kZWxldGUgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ0RFTEVURScsIG9wdHNcclxuXHJcbiMgIyMgcHV0XHJcbiMgW09KXShvai5odG1sKS5hamF4LnB1dDogdXBkYXRlIGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbmFqYXgucHV0ID0gKG9wdHMpIC0+XHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdQVVQnLCBvcHRzXHJcblxyXG5PSi5hc3luYy5yZWdpc3RlciAnYWpheCcsIGFqYXhcclxubW9kdWxlLmV4cG9ydHMgPSBhamF4IiwiIyAjIHByb21pc2VcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jICMjIGFqYXhQcm9taXNlXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5hamF4UHJvbWlzZSBjb252ZXJ0cyBhbiBBSkFYIFhtbEh0dHBSZXF1ZXN0IGludG8gYSBQcm9taXNlLiBcclxuIyBTZWUgYWxzbyBbUHJvbWlzZS5yZXNvbHZlXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbmFqYXhQcm9taXNlID0gKGFqYXgpIC0+IFxyXG4gIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUgYWpheFxyXG4gIHByb21pc2UuYWJvcnQgPSBhamF4LmFib3J0XHJcbiAgcHJvbWlzZS5yZWFkeVN0YXRlID0gYWpheC5yZWFkeVN0YXRlXHJcbiAgcHJvbWlzZVxyXG5cclxuIyAjIyBhbGxcclxuIyBbT0pdKG9qLmh0bWwpLmFzeW5jLmFsbCB0YWtlcyBhbiBhcnJheSBvZiBmdW5jdGlvbnMgYW5kIHJldHVybnMgYSBwcm9taXNlIHJlcHJlc2VudGluZyB0aGUgc3VjY2VzcyBvZiBhbGwgbWV0aG9kcyBvciB0aGUgZmFpbHVyZSBvZiBhbnkgbWV0aG9kLlxyXG4jIFNlZSBhbHNvIFtQcm9taXNlLmFsbF0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG5hbGwgPSAoaW5pdEFycmF5KSAtPlxyXG4gIHJlcXMgPSBpbml0QXJyYXkgb3IgW11cclxuICBwcm9taXNlID0gUHJvbWlzZS5hbGwocmVxcylcclxuICBwcm9taXNlLnB1c2ggPSAoaXRlbSkgLT5cclxuICAgIHJlcXMucHVzaCBpdGVtXHJcbiAgICByZXR1cm5cclxuICBwcm9taXNlXHJcblxyXG4jICMjIGRlZmVyXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5kZWZlciBjb252ZXJ0cyBhIGZ1bmN0aW9uIGludG8gYSBQcm9taXNlIHRvIGV4ZWN1dGUgdGhhdCBmdW5jdGlvbi4gXHJcbiMgU2VlIGFsc28gW1Byb21pc2UubWV0aG9kXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbmRlZnIgPSAoZnVuYyA9IE9KLm5vb3ApIC0+XHJcbiAgcmV0ID0gUHJvbWlzZS5tZXRob2QgZnVuY1xyXG4gIHJldFxyXG4gIFxyXG4gIFxyXG5PSi5hc3luYy5yZWdpc3RlciAnZGVmZXInLCBkZWZyXHJcbk9KLmFzeW5jLnJlZ2lzdGVyICdhbGwnLCBhbGxcclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2FqYXhQcm9taXNlJywgYWpheFByb21pc2VcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuICBkZWZlcjogZGVmclxyXG4gIGFsbDogYWxsXHJcbiAgYWpheFByb21pc2U6IGFqYXhQcm9taXNlXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcclxuYXJyYXkyRCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FycmF5MkQnXHJcblxyXG5ub2RlTmFtZSA9ICd4LWdyaWQnXHJcbmNsYXNzTmFtZSA9ICdncmlkJ1xyXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXHJcblxyXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICB0aWxlU2l6ZXM6XHJcbiAgICAgIHNtYWxsU3BhbjogJydcclxuICAgICAgbWVkaXVtU3BhbjogJydcclxuICAgICAgbGFyZ2VTcGFuOiAnJ1xyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAnZ3JpZCdcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcclxuXHJcbiAgcm93cyA9IFtdXHJcbiAgdGlsZXMgPSBhcnJheTJEKClcclxuXHJcbiAgZmlsbE1pc3NpbmcgPSAoKSAtPlxyXG4gICAgdGlsZXMuZWFjaCAocm93Tm8sIGNvbE5vLCB2YWwpIC0+XHJcbiAgICAgIGlmIG5vdCB2YWxcclxuICAgICAgICByb3cgPSByZXQucm93IHJvd05vXHJcbiAgICAgICAgcm93Lm1ha2UgJ3RpbGUnLCBjb2xObywge31cclxuXHJcbiAgcmV0LmFkZCAncm93JywgKHJvd05vID0gcm93cy5sZW5ndGgtMSBvciAxKS0+XHJcbiAgICBudVJvdyA9IHJvd3Nbcm93Tm8tMV1cclxuICAgIGlmIG5vdCBudVJvd1xyXG4gICAgICB3aGlsZSByb3dzLmxlbmd0aCA8IHJvd05vXHJcbiAgICAgICAgbnVSb3cgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAncm93J1xyXG4gICAgICAgIHJvd3MucHVzaCBudVJvd1xyXG4gICAgICBudVJvdy5hZGQgJ3RpbGUnLCAoY29sTm8sIG9wdHMpIC0+XHJcbiAgICAgICAgb3B0cyA9IE9KLmV4dGVuZCAoT0ouZXh0ZW5kIHt9LCBkZWZhdWx0cy50aWxlU2l6ZXMpLCBvcHRzXHJcbiAgICAgICAgbnVUaWxlID0gT0ouY29tcG9uZW50cy50aWxlIG9wdHMsIG51Um93XHJcbiAgICAgICAgdGlsZXMuc2V0IHJvd05vLCBjb2xObywgbnVUaWxlXHJcbiAgICAgICAgbnVUaWxlXHJcbiAgICBudVJvd1xyXG5cclxuICByZXQuYWRkICd0aWxlJywgKHJvd05vLCBjb2xObywgb3B0cykgLT5cclxuICAgIGlmIG5vdCByb3dObyBvciByb3dObyA8IDEgdGhlbiByb3dObyA9IDFcclxuICAgIGlmIG5vdCBjb2xObyBvciBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcclxuXHJcbiAgICByb3cgPSByZXQucm93IHJvd05vXHJcbiAgICB0aWxlID0gdGlsZXMuZ2V0IHJvd05vLCBjb2xOb1xyXG5cclxuICAgIGlmIG5vdCB0aWxlXHJcbiAgICAgIGkgPSAwXHJcbiAgICAgIHdoaWxlIGkgPCBjb2xOb1xyXG4gICAgICAgIGkgKz0gMVxyXG4gICAgICAgIHRyeVRpbGUgPSB0aWxlcy5nZXQgcm93Tm8sIGlcclxuICAgICAgICBpZiBub3QgdHJ5VGlsZVxyXG4gICAgICAgICAgaWYgaSBpcyBjb2xOb1xyXG4gICAgICAgICAgICB0aWxlID0gcm93Lm1ha2UgJ3RpbGUnLCBvcHRzXHJcbiAgICAgICAgICBlbHNlIGlmIG5vdCB0aWxlXHJcbiAgICAgICAgICAgIHJvdy5tYWtlICd0aWxlJ1xyXG5cclxuICAgIGZpbGxNaXNzaW5nKClcclxuICAgIHRpbGVcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcclxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcclxudXVpZCA9IHJlcXVpcmUgJy4uL3Rvb2xzL3V1aWQnXHJcblxyXG5ub2RlTmFtZSA9ICd4LWlucHV0LWdyb3VwJ1xyXG5jbGFzc05hbWUgPSAnaW5wdXRncm91cCdcclxuXHJcbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcclxuXHJcbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxyXG4gIGZvcklkID0gdXVpZCgpXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAnZm9ybS1ncm91cCdcclxuICAgIGV2ZW50czpcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcbiAgICBmb3I6IGZvcklkXHJcbiAgICBsYWJlbFRleHQ6ICcnXHJcbiAgICBpbnB1dE9wdHM6XHJcbiAgICAgIHByb3BzOlxyXG4gICAgICAgIGlkOiBmb3JJZFxyXG4gICAgICAgIHR5cGU6ICd0ZXh0J1xyXG4gICAgICAgIGNsYXNzOiAnJ1xyXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnJ1xyXG4gICAgICAgIHZhbHVlOiAnJ1xyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxyXG5cclxuICBncm91cCA9IHJldC5tYWtlICdkaXYnLCBwcm9wczogY2xhc3M6ICdmb3JtLWdyb3VwJ1xyXG5cclxuICByZXQuZ3JvdXBMYWJlbCA9IGdyb3VwLm1ha2UgJ2xhYmVsJywgcHJvcHM6IHsgZm9yOiBmb3JJZCB9LCB0ZXh0OiBkZWZhdWx0cy5sYWJlbFRleHRcclxuXHJcbiAgZGVmYXVsdHMuaW5wdXRPcHRzLnByb3BzLmNsYXNzICs9ICcgZm9ybS1jb250cm9sJ1xyXG4gIHJldC5ncm91cElucHV0ID0gZ3JvdXAubWFrZSAnaW5wdXQnLCBkZWZhdWx0cy5pbnB1dE9wdHNcclxuXHJcbiAgcmV0Lmdyb3VwVmFsdWUgPSAoKSAtPlxyXG4gICAgcmV0Lmdyb3VwSW5wdXQudmFsKClcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcclxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcclxuXHJcbm5vZGVOYW1lID0gJ3gtdGFicydcclxuY2xhc3NOYW1lID0gJ3RhYnMnXHJcblxyXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXHJcblxyXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICB0YWJzOiB7fVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAnJ1xyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxyXG5cclxuICB0YWJzID0gcmV0Lm1ha2UgJ3VsJywgcHJvcHM6IGNsYXNzOiAnbmF2IG5hdi10YWJzJ1xyXG4gIGNvbnRlbnQgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAndGFiLWNvbnRlbnQnXHJcblxyXG4gIGZpcnN0ID0gdHJ1ZVxyXG4gIE9KLmVhY2ggZGVmYXVsdHMudGFicywgKHRhYlZhbCwgdGFiTmFtZSkgLT5cclxuICAgIHRhYkNsYXNzID0gJydcclxuICAgIGlmIGZpcnN0XHJcbiAgICAgIGZpcnN0ID0gZmFsc2VcclxuICAgICAgdGFiQ2xhc3MgPSAnYWN0aXZlJ1xyXG4gICAgYSA9IHRhYnMubWFrZSAnbGknLCBwcm9wczogY2xhc3M6IHRhYkNsYXNzXHJcbiAgICAgIC5tYWtlKCdhJyxcclxuICAgICAgICB0ZXh0OiB0YWJOYW1lXHJcbiAgICAgICAgcHJvcHM6XHJcbiAgICAgICAgICBocmVmOiAnIycgKyB0YWJOYW1lXHJcbiAgICAgICAgICAnZGF0YS10b2dnbGUnOiAndGFiJ1xyXG4gICAgICAgIGV2ZW50czpcclxuICAgICAgICAgIGNsaWNrOiAtPlxyXG4gICAgICAgICAgICBhLiQudGFiICdzaG93JylcclxuXHJcbiAgICB0YWJDb250ZW50Q2xhc3MgPSAndGFiLXBhbmUgJyArIHRhYkNsYXNzXHJcbiAgICByZXQuYWRkIHRhYk5hbWUsIGNvbnRlbnQubWFrZSgnZGl2JywgcHJvcHM6IGNsYXNzOiB0YWJDb250ZW50Q2xhc3MsIGlkOiB0YWJOYW1lKVxyXG5cclxuICByZXRcclxuXHJcbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vb2pJbml0J1xyXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xyXG5cclxubm9kZU5hbWUgPSAneC10aWxlJ1xyXG5jbGFzc05hbWUgPSAndGlsZSdcclxuXHJcbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcclxuICBcclxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgd2lkdGg6XHJcbiAgICAgIHhzOiAnJ1xyXG4gICAgICBzbTogJydcclxuICAgICAgbWQ6ICcnXHJcbiAgICAgIGxnOiAnJ1xyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAndGlsZSdcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgaWYgZGVmYXVsdHMud2lkdGgueHMgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC14cy0nICsgZGVmYXVsdHMud2lkdGgueHNcclxuICBpZiBkZWZhdWx0cy53aWR0aC5zbSB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLXNtLScgKyBkZWZhdWx0cy53aWR0aC5zbVxyXG4gIGlmIGRlZmF1bHRzLndpZHRoLm1kIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wtbWQtJyArIGRlZmF1bHRzLndpZHRoLm1kXHJcbiAgaWYgZGVmYXVsdHMud2lkdGgubGcgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1sZy0nICsgZGVmYXVsdHMud2lkdGgubGdcclxuXHJcbiAgcmV0ID0gT0ouY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcclxuICByZXRcclxuXHJcbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vb2pJbml0J1xyXG5jb250cm9sID0gcmVxdWlyZSAnLi4vZG9tL2NvbnRyb2wnXHJcblxyXG5jb250cm9sTmFtZSA9ICd5LWljb24nXHJcbmZyaWVuZGx5TmFtZSA9ICdpY29uJ1xyXG5cclxuT0ouY29udHJvbHMubWVtYmVyc1tmcmllbmRseU5hbWVdID0gY29udHJvbE5hbWVcclxuXHJcbmNudHJsID0gKG9wdGlvbnMsIG93bmVyKSAtPlxyXG4gIGRlZmF1bHRzID1cclxuICAgIGljb25PcHRzOlxyXG4gICAgICBuYW1lOiAnJ1xyXG4gICAgICBzdGFja2VkSWNvbjogJydcclxuICAgICAgc3dhcEljb246ICcnXHJcbiAgICAgIHNpemU6IGZhbHNlXHJcbiAgICAgIGNvbG9yOiAnJ1xyXG4gICAgICBsaWJyYXJ5OiAnJ1xyXG4gICAgICBpc0ZpeGVkV2lkdGg6IGZhbHNlXHJcbiAgICAgIGlzTGlzdDogZmFsc2VcclxuICAgICAgaXNTcGlubmVyOiBmYWxzZVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNsYXNzOiAnJ1xyXG4gICAgcm9vdE5vZGVUeXBlOiAnc3BhbidcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zXHJcbiAgcmV0ID0gY29udHJvbCBkZWZhdWx0cywgb3duZXIsIGNvbnRyb2xOYW1lXHJcblxyXG4gIGlzVG9nZ2xlZCA9IGZhbHNlXHJcblxyXG4gICNUT0RPOiBTdXBwb3J0IGZvciBwaWN0b2ljb25zXHJcbiAgI1RPRE86IFN1cHBvcnQgZm9yIG90aGVyIEZvbnRBd2Vzb21lIHByb3BlcnRpZXMgKHN0YWNrLCByb3RhdGUsIHNpemUsIGV0YylcclxuXHJcbiAgY2xhc3NOYW1lQmFzZSA9ICdmYSAnXHJcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuaXNGaXhlZFdpZHRoIHRoZW4gY2xhc3NOYW1lQmFzZSArPSAnZmEtZncgJ1xyXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzTGlzdCB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLWxpICdcclxuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc1NwaW5uZXIgdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1zcGluICdcclxuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zaXplXHJcbiAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zaXplID4gMSBhbmQgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSA8PSA1XHJcbiAgICAgIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5zaXplICsgJ3ggJ1xyXG5cclxuICBjbGFzc05hbWUgPSBjbGFzc05hbWVCYXNlICsgJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5uYW1lXHJcbiAgcmV0Lm15SWNvbiA9IHJldC5tYWtlICdpJywgcHJvcHM6IGNsYXNzOiBjbGFzc05hbWVcclxuXHJcbiAgI1RvZ2dsZXMgZGlzcGxheSBiZXR3ZWVuIG5vcm1hbCBpY29uIGFuZCBzd2FwIGljb24sIGlmIGEgc3dhcCBpY29uIGhhcyBiZWVuIHNwZWNpZmllZFxyXG4gIHJldC50b2dnbGVJY29uID0gLT5cclxuICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uXHJcbiAgICAgIG5ld0ljb24gPSBkZWZhdWx0cy5pY29uT3B0cy5uYW1lXHJcblxyXG4gICAgICBpc1RvZ2dsZWQgPSAhaXNUb2dnbGVkXHJcblxyXG4gICAgICBpZiBpc1RvZ2dsZWRcclxuICAgICAgICByZXQubXlJY29uLiQucmVtb3ZlQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxyXG4gICAgICAgIG5ld0ljb24gPSBkZWZhdWx0cy5pY29uT3B0cy5zd2FwSWNvblxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0Lm15SWNvbi4kLnJlbW92ZUNsYXNzKCdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMuc3dhcEljb24pXHJcblxyXG4gICAgICByZXQubXlJY29uLiQuYWRkQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxyXG5cclxuXHJcbiAgcmV0XHJcblxyXG5PSi5jb250cm9scy5yZWdpc3RlciBmcmllbmRseU5hbWUsIGNudHJsXHJcbm1vZHVsZS5leHBvcnRzID0gY250cmwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuZ2V0RGF0ZUZyb21Ebkpzb24gPSAoZG5EYXRlKSAtPlxyXG4gICAgXHJcbiAgIyBUcmFuc2Zvcm1zIGEgLk5FVCBKU09OIGRhdGUgaW50byBhIEphdmFTY3JpcHQgZGF0ZS5cclxuICAjIG5hbWU9J29iaicgIE9iamVjdCB0byB0ZXN0XHJcbiAgIyB0eXBlPSdCb29sZWFuJyAvPlxyXG4gICNcclxuICAjICAgICAgIHZhciBtaWxsaSA9IE9KLnRvLm51bWJlcihEbkRhdGUucmVwbGFjZSgvXFwvRGF0ZVxcKChcXGQrKVxcLT8oXFxkKylcXClcXC8vLCAnJDEnKSk7XHJcbiAgIyAgICAgICB2YXIgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKERuRGF0ZS5yZXBsYWNlKC9cXC9EYXRlXFwoXFxkKyhbXFwrXFwtXT9cXGQrKVxcKVxcLy8sICckMScpKTtcclxuICAjICAgICAgIHZhciBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcclxuICAjICAgICAgIHJldHVybiBuZXcgRGF0ZSgobWlsbGkgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpO1xyXG4gICMgICAgICAgXHJcbiAgICBcclxuICAjIERuIERhdGUgd2lsbCBsb29rIGxpa2UgL0RhdGUoMTMzNTc1ODQwMDAwMC0wNDAwKS8gIFxyXG4gIGRuRGF0ZVN0ciA9IE9KLnRvLnN0cmluZyhkbkRhdGUpXHJcbiAgcmV0ID0gdW5kZWZpbmVkXHJcbiAgdGlja3MgPSB1bmRlZmluZWRcclxuICBvZmZzZXQgPSB1bmRlZmluZWRcclxuICBsb2NhbE9mZnNldCA9IHVuZGVmaW5lZFxyXG4gIGFyciA9IHVuZGVmaW5lZFxyXG4gIHJldCA9IE9KLmRhdGVUaW1lTWluVmFsdWVcclxuICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eShkbkRhdGVTdHIpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnLycsICcnKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJ0RhdGUnLCAnJylcclxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCcoJywgJycpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnKScsICcnKVxyXG4gICAgYXJyID0gZG5EYXRlU3RyLnNwbGl0KCctJylcclxuICAgIGlmIGFyci5sZW5ndGggPiAxXHJcbiAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcclxuICAgICAgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKGFyclsxXSlcclxuICAgICAgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KClcclxuICAgICAgcmV0ID0gbmV3IERhdGUoKHRpY2tzIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKVxyXG4gICAgZWxzZSBpZiBhcnIubGVuZ3RoIGlzIDFcclxuICAgICAgdGlja3MgPSBPSi50by5udW1iZXIoYXJyWzBdKVxyXG4gICAgICByZXQgPSBuZXcgRGF0ZSh0aWNrcylcclxuICByZXRcclxuXHJcbiAgT0oucmVnaXN0ZXIgJ2dldERhdGVGcm9tRG5Kc29uJywgZ2V0RGF0ZUZyb21Ebkpzb25cclxuICBtb2R1bGVzLmV4cG9ydHMgPSBnZXREYXRlRnJvbURuSnNvblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuIyBXcmFwIHRoZSBleGVjdXRpb24gb2YgYSBtZXRob2QgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5ICAgICBcclxuIyBpZ25vcmUgZXJyb3JzIGZhaWxpbmcgdG8gZXhlYyBzZWxmLWV4ZWN1dGluZyBmdW5jdGlvbnMgXHJcbiMgUmV0dXJuIGEgbWV0aG9kIHdyYXBwZWQgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5XHJcbnRyeUV4ZWMgPSAodHJ5RnVuYykgLT5cclxuICAndXNlIHN0cmljdCdcclxuICByZXQgPSBmYWxzZVxyXG4gIHRoYXQgPSB0aGlzXHJcbiAgdHJ5XHJcbiAgICByZXQgPSB0cnlGdW5jLmFwcGx5KHRoYXQsIEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpICBpZiBPSi5pcy5tZXRob2QodHJ5RnVuYylcclxuICBjYXRjaCBleGNlcHRpb25cclxuICAgIGlmIChleGNlcHRpb24ubmFtZSBpcyAnVHlwZUVycm9yJyBvciBleGNlcHRpb24udHlwZSBpcyAnY2FsbGVkX25vbl9jYWxsYWJsZScpIGFuZCBleGNlcHRpb24udHlwZSBpcyAnbm9uX29iamVjdF9wcm9wZXJ0eV9sb2FkJ1xyXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0lnbm9yaW5nIGV4Y2VwdGlvbjogJywgZXhjZXB0aW9uXHJcbiAgICBlbHNlXHJcbiAgICAgIE9KLmNvbnNvbGUuZXJyb3IgZXhjZXB0aW9uXHJcbiAgZmluYWxseVxyXG5cclxuICByZXRcclxuXHJcblxyXG4gbWV0aG9kID0gKHRyeUZ1bmMpIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgdGhhdCA9IHRoaXNcclxuICAtPlxyXG4gICAgYXJncyA9IEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cywgMClcclxuICAgIGFyZ3MudW5zaGlmdCB0cnlGdW5jXHJcbiAgICBPSi50cnlFeGVjLmFwcGx5IHRoYXQsIGFyZ3NcclxuXHJcbiAgXHJcbiBcclxuIE9KLnJlZ2lzdGVyICdtZXRob2QnLCBtZXRob2RcclxuIE9KLnJlZ2lzdGVyICd0cnlFeGVjJywgdHJ5RXhlY1xyXG4gbW9kdWxlLmV4cG9ydHMgPVxyXG4gIG1ldGhvZDogbWV0aG9kXHJcbiAgdHJ5RXhlYzogdHJ5RXhlY1xyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxubnVtYmVyID0gT2JqZWN0LmNyZWF0ZShudWxsKVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ2lzTmFOJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5pc05hTikgdGhlbiBOdW1iZXIuaXNOYU4gZWxzZSBpc05hTilcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdpc0Zpbml0ZScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuaXNGaW5pdGUpIHRoZW4gTnVtYmVyLmlzRmluaXRlIGVsc2UgaXNGaW5pdGUpXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnTUFYX1ZBTFVFJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5NQVhfVkFMVUUpIHRoZW4gTnVtYmVyLk1BWF9WQUxVRSBlbHNlIDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ01JTl9WQUxVRScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuTUlOX1ZBTFVFKSB0aGVuIE51bWJlci5NSU5fVkFMVUUgZWxzZSA1ZS0zMjQpXHJcblxyXG5PSi5yZWdpc3RlciAnbnVtYmVyJywgbnVtYmVyXHJcbm1vZHVsZS5leHBvcnRzID0gbnVtYmVyIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyICQsIE9KLCBfLCBmdW5jLCBpc01ldGhvZCwgcHJvcGVydHksIHJldE9iaiwgdG87XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuaXNNZXRob2QgPSByZXF1aXJlKCcuLi90b29scy9pcycpO1xuXG5wcm9wZXJ0eSA9IHJlcXVpcmUoJy4vcHJvcGVydHknKTtcblxuZnVuYyA9IHJlcXVpcmUoJy4vZnVuY3Rpb24nKTtcblxudG8gPSByZXF1aXJlKCcuLi90b29scy90bycpO1xuXG5yZXRPYmogPSB7XG4gIG9iamVjdDogZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICBvYmogPSB7fTtcbiAgICB9XG5cbiAgICAvKlxuICAgIEFkZCBhIHByb3BlcnR5IHRvIHRoZSBvYmplY3QgYW5kIHJldHVybiBpdFxuICAgICAqL1xuICAgIG9iai5hZGQgPSBmdW5jdGlvbihuYW1lLCB2YWwpIHtcbiAgICAgIHByb3BlcnR5KG9iaiwgbmFtZSwgdmFsKTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfTtcbiAgICBvYmouYWRkKCdlYWNoJywgZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHZhciBlYWNoO1xuICAgICAgZWFjaCA9IHJlcXVpcmUoJy4uL3Rvb2xzL2VhY2gnKTtcbiAgICAgIHJldHVybiBlYWNoKG9iaiwgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKGtleSAhPT0gJ2VhY2gnICYmIGtleSAhPT0gJ2FkZCcpIHtcbiAgICAgICAgICByZXR1cm4gY2FsbGJhY2sodmFsLCBrZXkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9LFxuICBpc0luc3RhbmNlT2Y6IGZ1bmN0aW9uKG5hbWUsIG9iaikge1xuICAgIHJldHVybiByZXRPYmouY29udGFpbnMobmFtZSwgb2JqKSAmJiB0by5ib29sKG9ialtuYW1lXSk7XG4gIH0sXG4gIGNvbnRhaW5zOiBmdW5jdGlvbihvYmplY3QsIGluZGV4KSB7XG4gICAgdmFyIHJldDtcbiAgICByZXQgPSBmYWxzZTtcbiAgICBpZiAob2JqZWN0KSB7XG4gICAgICByZXQgPSBfLmNvbnRhaW5zKG9iamVjdCwgaW5kZXgpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9LFxuICBjb21wYXJlOiBmdW5jdGlvbihvYmoxLCBvYmoyKSB7XG4gICAgcmV0dXJuIF8uaXNFcXVhbChvYmoxLCBvYmoyKTtcbiAgfSxcbiAgY2xvbmU6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICByZXR1cm4gXy5jbG9uZURlZXAoZGF0YSh0cnVlKSk7XG4gIH0sXG4gIHNlcmlhbGl6ZTogZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciByZXQ7XG4gICAgcmV0ID0gJyc7XG4gICAgZnVuYy50cnlFeGVjKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldCB8fCAnJztcbiAgfSxcbiAgZGVzZXJpYWxpemU6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgcmV0O1xuICAgIHJldCA9IHt9O1xuICAgIGlmIChkYXRhKSB7XG4gICAgICBmdW5jLnRyeUV4ZWMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldCA9ICQucGFyc2VKU09OKGRhdGEpO1xuICAgICAgfSk7XG4gICAgICBpZiAoaXNNZXRob2QubnVsbE9yRW1wdHkocmV0KSkge1xuICAgICAgICByZXQgPSB7fTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSxcbiAgcGFyYW1zOiBmdW5jdGlvbihkYXRhLCBkZWxpbWl0ZXIpIHtcbiAgICB2YXIgZWFjaCwgcmV0O1xuICAgIGlmIChkZWxpbWl0ZXIgPT0gbnVsbCkge1xuICAgICAgZGVsaW1pdGVyID0gJyYnO1xuICAgIH1cbiAgICByZXQgPSAnJztcbiAgICBpZiAoZGVsaW1pdGVyID09PSAnJicpIHtcbiAgICAgIGZ1bmMudHJ5RXhlYyhmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0ID0gJC5wYXJhbShkYXRhKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBlYWNoID0gcmVxdWlyZSgnLi4vdG9vbHMvZWFjaCcpO1xuICAgICAgZWFjaChkYXRhLCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICBpZiAocmV0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICByZXQgKz0gZGVsaW1pdGVyO1xuICAgICAgICB9XG4gICAgICAgIHJldCArPSBrZXkgKyAnPScgKyB2YWw7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRvLnN0cmluZyhyZXQpO1xuICB9LFxuICBleHRlbmQ6IGZ1bmN0aW9uKGRlc3RPYmosIHNyY09iaiwgZGVlcENvcHkpIHtcbiAgICB2YXIgcmV0O1xuICAgIGlmIChkZWVwQ29weSA9PSBudWxsKSB7XG4gICAgICBkZWVwQ29weSA9IGZhbHNlO1xuICAgIH1cbiAgICByZXQgPSBkZXN0T2JqIHx8IHt9O1xuICAgIGlmIChkZWVwQ29weSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0ID0gJC5leHRlbmQoZGVlcENvcHksIHJldCwgc3JjT2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0ID0gJC5leHRlbmQocmV0LCBzcmNPYmopO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG59O1xuXG5PSi5yZWdpc3Rlcignb2JqZWN0JywgcmV0T2JqLm9iamVjdCk7XG5cbk9KLnJlZ2lzdGVyKCdpc0luc3RhbmNlT2YnLCByZXRPYmouaXNJbnN0YW5jZU9mKTtcblxuT0oucmVnaXN0ZXIoJ2NvbnRhaW5zJywgcmV0T2JqLmNvbnRhaW5zKTtcblxuT0oucmVnaXN0ZXIoJ2NvbXBhcmUnLCByZXRPYmouY29tcGFyZSk7XG5cbk9KLnJlZ2lzdGVyKCdjbG9uZScsIHJldE9iai5jbG9uZSk7XG5cbk9KLnJlZ2lzdGVyKCdzZXJpYWxpemUnLCByZXRPYmouc2VyaWFsaXplKTtcblxuT0oucmVnaXN0ZXIoJ2Rlc2VyaWFsaXplJywgcmV0T2JqLmRlc2VyaWFsaXplKTtcblxuT0oucmVnaXN0ZXIoJ3BhcmFtcycsIHJldE9iai5wYXJhbXMpO1xuXG5PSi5yZWdpc3RlcignZXh0ZW5kJywgcmV0T2JqLmV4dGVuZCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmV0T2JqO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeGpiM0psWEZ4dlltcGxZM1F1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVN4SlFVRkJPenRCUVVGQkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUMEZCVWpzN1FVRkRUQ3hEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCUTBvc1EwRkJRU3hIUVVGSkxFOUJRVUVzUTBGQlVTeFJRVUZTT3p0QlFVTktMRkZCUVVFc1IwRkJWeXhQUVVGQkxFTkJRVkVzWVVGQlVqczdRVUZEV0N4UlFVRkJMRWRCUVZjc1QwRkJRU3hEUVVGUkxGbEJRVkk3TzBGQlExZ3NTVUZCUVN4SFFVRlBMRTlCUVVFc1EwRkJVU3haUVVGU096dEJRVU5RTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1lVRkJVanM3UVVGSlRDeE5RVUZCTEVkQlNVVTdSVUZCUVN4TlFVRkJMRVZCUVZFc1UwRkJReXhIUVVGRU96dE5RVUZETEUxQlFVMDdPenRCUVVWaU96czdTVUZIUVN4SFFVRkhMRU5CUVVNc1IwRkJTaXhIUVVGVkxGTkJRVU1zU1VGQlJDeEZRVUZQTEVkQlFWQTdUVUZEVWl4UlFVRkJMRU5CUVZNc1IwRkJWQ3hGUVVGakxFbEJRV1FzUlVGQmIwSXNSMEZCY0VJN1lVRkRRVHRKUVVaUk8wbEJTVllzUjBGQlJ5eERRVUZETEVkQlFVb3NRMEZCVVN4TlFVRlNMRVZCUVdkQ0xGTkJRVU1zVVVGQlJEdEJRVU5rTEZWQlFVRTdUVUZCUVN4SlFVRkJMRWRCUVU4c1QwRkJRU3hEUVVGUkxHVkJRVkk3WVVGRFVDeEpRVUZCTEVOQlFVc3NSMEZCVEN4RlFVRlZMRk5CUVVNc1IwRkJSQ3hGUVVGTkxFZEJRVTQ3VVVGRFVpeEpRVUZITEVkQlFVRXNTMEZCVXl4TlFVRlVMRWxCUVc5Q0xFZEJRVUVzUzBGQlV5eExRVUZvUXp0cFFrRkRSU3hSUVVGQkxFTkJRVk1zUjBGQlZDeEZRVUZqTEVkQlFXUXNSVUZFUmpzN1RVRkVVU3hEUVVGV08wbEJSbU1zUTBGQmFFSTdWMEZOUVR0RlFXWk5MRU5CUVZJN1JVRnZRa0VzV1VGQlFTeEZRVUZqTEZOQlFVTXNTVUZCUkN4RlFVRlBMRWRCUVZBN1YwRkRXaXhOUVVGTkxFTkJRVU1zVVVGQlVDeERRVUZuUWl4SlFVRm9RaXhGUVVGelFpeEhRVUYwUWl4RFFVRkJMRWxCUVN0Q0xFVkJRVVVzUTBGQlF5eEpRVUZJTEVOQlFWRXNSMEZCU1N4RFFVRkJMRWxCUVVFc1EwRkJXanRGUVVSdVFpeERRWEJDWkR0RlFYbENRU3hSUVVGQkxFVkJRVlVzVTBGQlF5eE5RVUZFTEVWQlFWTXNTMEZCVkR0QlFVTlNMRkZCUVVFN1NVRkJRU3hIUVVGQkxFZEJRVTA3U1VGRFRpeEpRVUZITEUxQlFVZzdUVUZEUlN4SFFVRkJMRWRCUVUwc1EwRkJReXhEUVVGRExGRkJRVVlzUTBGQlZ5eE5RVUZZTEVWQlFXMUNMRXRCUVc1Q0xFVkJSRkk3TzFkQlJVRTdSVUZLVVN4RFFYcENWanRGUVdsRFFTeFBRVUZCTEVWQlFWTXNVMEZCUXl4SlFVRkVMRVZCUVU4c1NVRkJVRHRYUVVOUUxFTkJRVU1zUTBGQlF5eFBRVUZHTEVOQlFWVXNTVUZCVml4RlFVRm5RaXhKUVVGb1FqdEZRVVJQTEVOQmFrTlVPMFZCYzBOQkxFdEJRVUVzUlVGQlR5eFRRVUZETEVsQlFVUTdWMEZEVEN4RFFVRkRMRU5CUVVNc1UwRkJSaXhEUVVGWkxFbEJRVUVzUTBGQlN5eEpRVUZNTEVOQlFWbzdSVUZFU3l4RFFYUkRVRHRGUVRKRFFTeFRRVUZCTEVWQlFWY3NVMEZCUXl4SlFVRkVPMEZCUTFRc1VVRkJRVHRKUVVGQkxFZEJRVUVzUjBGQlRUdEpRVU5PTEVsQlFVa3NRMEZCUXl4UFFVRk1MRU5CUVdFc1UwRkJRVHROUVVOWUxFZEJRVUVzUjBGQlRTeEpRVUZKTEVOQlFVTXNVMEZCVEN4RFFVRmxMRWxCUVdZN1NVRkVTeXhEUVVGaU8xZEJSMEVzUjBGQlFTeEpRVUZQTzBWQlRFVXNRMEV6UTFnN1JVRnZSRUVzVjBGQlFTeEZRVUZoTEZOQlFVTXNTVUZCUkR0QlFVTllMRkZCUVVFN1NVRkJRU3hIUVVGQkxFZEJRVTA3U1VGRFRpeEpRVUZITEVsQlFVZzdUVUZEUlN4SlFVRkpMRU5CUVVNc1QwRkJUQ3hEUVVGaExGTkJRVUU3VVVGRFdDeEhRVUZCTEVkQlFVMHNRMEZCUXl4RFFVRkRMRk5CUVVZc1EwRkJXU3hKUVVGYU8wMUJSRXNzUTBGQllqdE5RVWxCTEVsQlFXRXNVVUZCVVN4RFFVRkRMRmRCUVZRc1EwRkJjVUlzUjBGQmNrSXNRMEZCWWp0UlFVRkJMRWRCUVVFc1IwRkJUU3hIUVVGT08wOUJURVk3TzFkQlRVRTdSVUZTVnl4RFFYQkVZanRGUVdkRlFTeE5RVUZCTEVWQlFWRXNVMEZCUXl4SlFVRkVMRVZCUVU4c1UwRkJVRHRCUVVOT0xGRkJRVUU3TzAxQlJHRXNXVUZCV1RzN1NVRkRla0lzUjBGQlFTeEhRVUZOTzBsQlEwNHNTVUZCUnl4VFFVRkJMRXRCUVdFc1IwRkJhRUk3VFVGRFJTeEpRVUZKTEVOQlFVTXNUMEZCVEN4RFFVRmhMRk5CUVVFN1VVRkRXQ3hIUVVGQkxFZEJRVTBzUTBGQlF5eERRVUZETEV0QlFVWXNRMEZCVVN4SlFVRlNPMDFCUkVzc1EwRkJZaXhGUVVSR08wdEJRVUVzVFVGQlFUdE5RVTFGTEVsQlFVRXNSMEZCVHl4UFFVRkJMRU5CUVZFc1pVRkJVanROUVVOUUxFbEJRVUVzUTBGQlN5eEpRVUZNTEVWQlFWY3NVMEZCUXl4SFFVRkVMRVZCUVUwc1IwRkJUanRSUVVOVUxFbEJRWEZDTEVkQlFVY3NRMEZCUXl4TlFVRktMRWRCUVdFc1EwRkJiRU03VlVGQlFTeEhRVUZCTEVsQlFVOHNWVUZCVURzN1VVRkRRU3hIUVVGQkxFbEJRVThzUjBGQlFTeEhRVUZOTEVkQlFVNHNSMEZCV1R0TlFVWldMRU5CUVZnc1JVRlFSanM3VjBGWlFTeEZRVUZGTEVOQlFVTXNUVUZCU0N4RFFVRlZMRWRCUVZZN1JVRmtUU3hEUVdoRlVqdEZRV3RHUVN4TlFVRkJMRVZCUVZFc1UwRkJReXhQUVVGRUxFVkJRVlVzVFVGQlZpeEZRVUZyUWl4UlFVRnNRanRCUVVOT0xGRkJRVUU3TzAxQlJIZENMRmRCUVZjN08wbEJRMjVETEVkQlFVRXNSMEZCVFN4UFFVRkJMRWxCUVZjN1NVRkRha0lzU1VGQlJ5eFJRVUZCTEV0QlFWa3NTVUZCWmp0TlFVTkZMRWRCUVVFc1IwRkJUU3hEUVVGRExFTkJRVU1zVFVGQlJpeERRVUZUTEZGQlFWUXNSVUZCYlVJc1IwRkJia0lzUlVGQmQwSXNUVUZCZUVJc1JVRkVVanRMUVVGQkxFMUJRVUU3VFVGSFJTeEhRVUZCTEVkQlFVMHNRMEZCUXl4RFFVRkRMRTFCUVVZc1EwRkJVeXhIUVVGVUxFVkJRV01zVFVGQlpDeEZRVWhTT3p0WFFVbEJPMFZCVGswc1EwRnNSbEk3T3p0QlFUSkdSaXhGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEZGQlFWb3NSVUZCYzBJc1RVRkJUU3hEUVVGRExFMUJRVGRDT3p0QlFVTkJMRVZCUVVVc1EwRkJReXhSUVVGSUxFTkJRVmtzWTBGQldpeEZRVUUwUWl4TlFVRk5MRU5CUVVNc1dVRkJia003TzBGQlEwRXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3hWUVVGYUxFVkJRWGRDTEUxQlFVMHNRMEZCUXl4UlFVRXZRanM3UVVGRFFTeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMRk5CUVZvc1JVRkJkVUlzVFVGQlRTeERRVUZETEU5QlFUbENPenRCUVVOQkxFVkJRVVVzUTBGQlF5eFJRVUZJTEVOQlFWa3NUMEZCV2l4RlFVRnhRaXhOUVVGTkxFTkJRVU1zUzBGQk5VSTdPMEZCUTBFc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeFhRVUZhTEVWQlFYbENMRTFCUVUwc1EwRkJReXhUUVVGb1F6czdRVUZEUVN4RlFVRkZMRU5CUVVNc1VVRkJTQ3hEUVVGWkxHRkJRVm9zUlVGQk1rSXNUVUZCVFN4RFFVRkRMRmRCUVd4RE96dEJRVU5CTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1VVRkJXaXhGUVVGelFpeE5RVUZOTEVOQlFVTXNUVUZCTjBJN08wRkJRMEVzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4UlFVRmFMRVZCUVhOQ0xFMUJRVTBzUTBGQlF5eE5RVUUzUWpzN1FVRkZRU3hOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWlJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lUMG9nUFNCeVpYRjFhWEpsSUNjdUxpOXZhaWRjY2x4dUpDQTlJSEpsY1hWcGNtVWdKMnB4ZFdWeWVTZGNjbHh1WHlBOUlISmxjWFZwY21VZ0oyeHZaR0Z6YUNkY2NseHVhWE5OWlhSb2IyUWdQU0J5WlhGMWFYSmxJQ2N1TGk5MGIyOXNjeTlwY3lkY2NseHVjSEp2Y0dWeWRIa2dQU0J5WlhGMWFYSmxJQ2N1TDNCeWIzQmxjblI1SjF4eVhHNW1kVzVqSUQwZ2NtVnhkV2x5WlNBbkxpOW1kVzVqZEdsdmJpZGNjbHh1ZEc4Z1BTQnlaWEYxYVhKbElDY3VMaTkwYjI5c2N5OTBieWRjY2x4dVhISmNiaU1nSXlCdlltcGxZM1JjY2x4dVhISmNibkpsZEU5aWFpQTlJRnh5WEc1Y2NseHVJQ0FqSUNNaklGdFBTbDBvYjJvdWFIUnRiQ2t1YjJKcVpXTjBYSEpjYmlBZ0l5QmpjbVZoZEdVZ1lXNGdiMkpxWldOMElIZHBkR2dnYUdWc2NHVnlJR0JoWkdSZ0lHRnVaQ0JnWldGamFHQWdiV1YwYUc5a2N5NWNjbHh1SUNCdlltcGxZM1E2SUNodlltb2dQU0I3ZlNrZ0xUNWNjbHh1SUNBZ0lGeHlYRzRnSUNBZ0l5TWpYSEpjYmlBZ0lDQkJaR1FnWVNCd2NtOXdaWEowZVNCMGJ5QjBhR1VnYjJKcVpXTjBJR0Z1WkNCeVpYUjFjbTRnYVhSY2NseHVJQ0FnSUNNakkxeHlYRzRnSUNBZ2IySnFMbUZrWkNBOUlDaHVZVzFsTENCMllXd3BJQzArWEhKY2JpQWdJQ0FnSUhCeWIzQmxjblI1SUc5aWFpd2dibUZ0WlN3Z2RtRnNYSEpjYmlBZ0lDQWdJRzlpYWx4eVhHNWNjbHh1SUNBZ0lHOWlhaTVoWkdRZ0oyVmhZMmduTENBb1kyRnNiR0poWTJzcElDMCtYSEpjYmlBZ0lDQWdJR1ZoWTJnZ1BTQnlaWEYxYVhKbElDY3VMaTkwYjI5c2N5OWxZV05vSjF4eVhHNGdJQ0FnSUNCbFlXTm9JRzlpYWl3Z0tIWmhiQ3dnYTJWNUtTQXRQbHh5WEc0Z0lDQWdJQ0FnSUdsbUlHdGxlU0JwYzI1MElDZGxZV05vSnlCaGJtUWdhMlY1SUdsemJuUWdKMkZrWkNkY2NseHVJQ0FnSUNBZ0lDQWdJR05oYkd4aVlXTnJJSFpoYkN3Z2EyVjVYSEpjYmx4eVhHNGdJQ0FnYjJKcVhISmNibHh5WEc1Y2NseHVJQ0FqSUNNaklGdFBTbDBvYjJvdWFIUnRiQ2t1YVhOSmJuTjBZVzVqWlU5bVhISmNiaUFnSXlCa1pYUmxjbTFwYm1WeklHbHpJR0VnZEdocGJtY2dhWE1nWVc0Z2FXNXpkR0Z1WTJVZ2IyWWdZU0JVYUdsdVp5d2dZWE56ZFcxcGJtY2dkR2hsSUhSb2FXNW5jeUIzWlhKbElHRnNiQ0JqY21WaGRHVmtJR2x1SUU5S1hISmNiaUFnYVhOSmJuTjBZVzVqWlU5bU9pQW9ibUZ0WlN3Z2IySnFLU0F0UGx4eVhHNGdJQ0FnY21WMFQySnFMbU52Ym5SaGFXNXpLRzVoYldVc0lHOWlhaWtnWVc1a0lIUnZMbUp2YjJ3b2IySnFXMjVoYldWZEtWeHlYRzVjY2x4dUlDQWpJQ01qSUZ0UFNsMG9iMm91YUhSdGJDa3VZMjl1ZEdGcGJuTmNjbHh1SUNBaklIUnlkV1VnYVdZZ2RHaGxJR0J2WW1wbFkzUmdJR052Ym5SaGFXNXpJSFJvWlNCMllXeDFaVnh5WEc0Z0lHTnZiblJoYVc1ek9pQW9iMkpxWldOMExDQnBibVJsZUNrZ0xUNWNjbHh1SUNBZ0lISmxkQ0E5SUdaaGJITmxYSEpjYmlBZ0lDQnBaaUJ2WW1wbFkzUmNjbHh1SUNBZ0lDQWdjbVYwSUQwZ1h5NWpiMjUwWVdsdWN5QnZZbXBsWTNRc0lHbHVaR1Y0WEhKY2JpQWdJQ0J5WlhSY2NseHVYSEpjYmlBZ0l5QWpJeUJiVDBwZEtHOXFMbWgwYld3cExtTnZiWEJoY21WY2NseHVJQ0FqSUdOdmJYQmhjbVVnZEhkdklHOWlhbVZqZEhNdllYSnlZWGx6TDNaaGJIVmxjeUJtYjNJZ2MzUnlhV04wSUdWeGRXRnNhWFI1WEhKY2JpQWdZMjl0Y0dGeVpUb2dLRzlpYWpFc0lHOWlhaklwSUMwK1hISmNiaUFnSUNCZkxtbHpSWEYxWVd3Z2IySnFNU3dnYjJKcU1seHlYRzVjY2x4dUlDQWpJQ01qSUZ0UFNsMG9iMm91YUhSdGJDa3VZMnh2Ym1WY2NseHVJQ0FqSUdOdmNIa2dZV3hzSUc5bUlIUm9aU0IyWVd4MVpYTWdLSEpsWTNWeWMybDJaV3g1S1NCbWNtOXRJRzl1WlNCdlltcGxZM1FnZEc4Z1lXNXZkR2hsY2k1Y2NseHVJQ0JqYkc5dVpUb2dLR1JoZEdFcElDMCtYSEpjYmlBZ0lDQmZMbU5zYjI1bFJHVmxjQ0JrWVhSaElIUnlkV1ZjY2x4dVhISmNiaUFnSXlBakl5QmJUMHBkS0c5cUxtaDBiV3dwTG5ObGNtbGhiR2w2WlZ4eVhHNGdJQ01nUTI5dWRtVnlkQ0JoYmlCdlltcGxZM1FnZEc4Z1lTQktVMDlPSUhKbGNISmxjMlZ1ZEdGMGFXOXVJRzltSUhSb1pTQnZZbXBsWTNSY2NseHVJQ0J6WlhKcFlXeHBlbVU2SUNoa1lYUmhLU0F0UGx4eVhHNGdJQ0FnY21WMElEMGdKeWRjY2x4dUlDQWdJR1oxYm1NdWRISjVSWGhsWXlBdFBseHlYRzRnSUNBZ0lDQnlaWFFnUFNCS1UwOU9Mbk4wY21sdVoybG1lU2hrWVhSaEtWeHlYRzRnSUNBZ0lDQnlaWFIxY201Y2NseHVJQ0FnSUhKbGRDQnZjaUFuSjF4eVhHNWNjbHh1SUNBaklDTWpJRnRQU2wwb2Iyb3VhSFJ0YkNrdVpHVnpaWEpwWVd4cGVtVmNjbHh1SUNBaklFTnZiblpsY25RZ1lTQktVMDlPSUhOMGNtbHVaeUIwYnlCaGJpQnZZbXBsWTNSY2NseHVJQ0JrWlhObGNtbGhiR2w2WlRvZ0tHUmhkR0VwSUMwK1hISmNiaUFnSUNCeVpYUWdQU0I3ZlZ4eVhHNGdJQ0FnYVdZZ1pHRjBZVnh5WEc0Z0lDQWdJQ0JtZFc1akxuUnllVVY0WldNZ0xUNWNjbHh1SUNBZ0lDQWdJQ0J5WlhRZ1BTQWtMbkJoY25ObFNsTlBUaWhrWVhSaEtWeHlYRzRnSUNBZ0lDQWdJSEpsZEhWeWJseHlYRzVjY2x4dUlDQWdJQ0FnY21WMElEMGdlMzBnSUdsbUlHbHpUV1YwYUc5a0xtNTFiR3hQY2tWdGNIUjVLSEpsZENsY2NseHVJQ0FnSUhKbGRGeHlYRzVjY2x4dUlDQWpJQ01qSUZ0UFNsMG9iMm91YUhSdGJDa3VjR0Z5WVcxelhISmNiaUFnSXlCRGIyNTJaWEowSUdGdUlHOWlhbVZqZENCMGJ5QmhJR1JsYkdsdGFYUmxaQ0JzYVhOMElHOW1JSEJoY21GdFpYUmxjbk1nS0c1dmNtMWhiR3g1SUhGMVpYSjVMWE4wY21sdVp5QndZWEpoYldWMFpYSnpLVnh5WEc0Z0lIQmhjbUZ0Y3pvZ0tHUmhkR0VzSUdSbGJHbHRhWFJsY2lBOUlDY21KeWtnTFQ1Y2NseHVJQ0FnSUhKbGRDQTlJQ2NuWEhKY2JpQWdJQ0JwWmlCa1pXeHBiV2wwWlhJZ2FYTWdKeVluWEhKY2JpQWdJQ0FnSUdaMWJtTXVkSEo1UlhobFl5QXRQbHh5WEc0Z0lDQWdJQ0FnSUhKbGRDQTlJQ1F1Y0dGeVlXMG9aR0YwWVNsY2NseHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2NseHVYSEpjYmlBZ0lDQmxiSE5sWEhKY2JpQWdJQ0FnSUdWaFkyZ2dQU0J5WlhGMWFYSmxJQ2N1TGk5MGIyOXNjeTlsWVdOb0oxeHlYRzRnSUNBZ0lDQmxZV05vSUdSaGRHRXNJQ2gyWVd3c0lHdGxlU2tnTFQ1Y2NseHVJQ0FnSUNBZ0lDQnlaWFFnS3owZ1pHVnNhVzFwZEdWeUlDQnBaaUJ5WlhRdWJHVnVaM1JvSUQ0Z01GeHlYRzRnSUNBZ0lDQWdJSEpsZENBclBTQnJaWGtnS3lBblBTY2dLeUIyWVd4Y2NseHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2NseHVYSEpjYmlBZ0lDQjBieTV6ZEhKcGJtY2djbVYwWEhKY2JseHlYRzRnSUNNZ0l5TWdXMDlLWFNodmFpNW9kRzFzS1M1bGVIUmxibVJjY2x4dUlDQWpJR052Y0hrZ2RHaGxJSEJ5YjNCbGNuUnBaWE1nYjJZZ2IyNWxJRzlpYW1WamRDQjBieUJoYm05MGFHVnlJRzlpYW1WamRGeHlYRzRnSUdWNGRHVnVaRG9nS0dSbGMzUlBZbW9zSUhOeVkwOWlhaXdnWkdWbGNFTnZjSGtnUFNCbVlXeHpaU2tnTFQ1Y2NseHVJQ0FnSUhKbGRDQTlJR1JsYzNSUFltb2diM0lnZTMxY2NseHVJQ0FnSUdsbUlHUmxaWEJEYjNCNUlHbHpJSFJ5ZFdWY2NseHVJQ0FnSUNBZ2NtVjBJRDBnSkM1bGVIUmxibVFvWkdWbGNFTnZjSGtzSUhKbGRDd2djM0pqVDJKcUtWeHlYRzRnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0J5WlhRZ1BTQWtMbVY0ZEdWdVpDaHlaWFFzSUhOeVkwOWlhaWxjY2x4dUlDQWdJSEpsZEZ4eVhHNWNjbHh1WEhKY2JrOUtMbkpsWjJsemRHVnlJQ2R2WW1wbFkzUW5MQ0J5WlhSUFltb3ViMkpxWldOMFhISmNiazlLTG5KbFoybHpkR1Z5SUNkcGMwbHVjM1JoYm1ObFQyWW5MQ0J5WlhSUFltb3VhWE5KYm5OMFlXNWpaVTltWEhKY2JrOUtMbkpsWjJsemRHVnlJQ2RqYjI1MFlXbHVjeWNzSUhKbGRFOWlhaTVqYjI1MFlXbHVjMXh5WEc1UFNpNXlaV2RwYzNSbGNpQW5ZMjl0Y0dGeVpTY3NJSEpsZEU5aWFpNWpiMjF3WVhKbFhISmNiazlLTG5KbFoybHpkR1Z5SUNkamJHOXVaU2NzSUhKbGRFOWlhaTVqYkc5dVpWeHlYRzVQU2k1eVpXZHBjM1JsY2lBbmMyVnlhV0ZzYVhwbEp5d2djbVYwVDJKcUxuTmxjbWxoYkdsNlpWeHlYRzVQU2k1eVpXZHBjM1JsY2lBblpHVnpaWEpwWVd4cGVtVW5MQ0J5WlhSUFltb3VaR1Z6WlhKcFlXeHBlbVZjY2x4dVQwb3VjbVZuYVhOMFpYSWdKM0JoY21GdGN5Y3NJSEpsZEU5aWFpNXdZWEpoYlhOY2NseHVUMG91Y21WbmFYTjBaWElnSjJWNGRHVnVaQ2NzSUhKbGRFOWlhaTVsZUhSbGJtUmNjbHh1WEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2NtVjBUMkpxSWwxOSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbiMjI1xyXG5BZGQgYSBwcm9wZXJ0eSB0byBhbiBvYmplY3RcclxuICBcclxuIyMjXHJcbnByb3BlcnR5ID0gKG9iaiwgbmFtZSwgdmFsdWUsIHdyaXRhYmxlLCBjb25maWd1cmFibGUsIGVudW1lcmFibGUpIC0+XHJcbiAgdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgZGVmaW5lIGEgcHJvcGVydHkgd2l0aG91dCBhbiBPYmplY3QuJyAgdW5sZXNzIG9ialxyXG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhIHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBwcm9wZXJ0eSBuYW1lLicgIHVubGVzcyBuYW1lP1xyXG4gIG9ialtuYW1lXSA9IHZhbHVlXHJcbiAgb2JqXHJcblxyXG5PSi5yZWdpc3RlciAncHJvcGVydHknLCBwcm9wZXJ0eVxyXG5tb2R1bGUuZXhwb3J0cyA9IHByb3BlcnR5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuZGVsaW1pdGVkU3RyaW5nID0gKHN0cmluZywgb3B0cykgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBuZXdMaW5lVG9EZWxpbWl0ZXI6IHRydWVcclxuICAgIHNwYWNlVG9EZWxpbWl0ZXI6IHRydWVcclxuICAgIHJlbW92ZUR1cGxpY2F0ZXM6IHRydWVcclxuICAgIGRlbGltaXRlcjogXCIsXCJcclxuICAgIGluaXRTdHJpbmc6IE9KLnRvLnN0cmluZyBzdHJpbmdcclxuXHJcbiAgcmV0T2JqID1cclxuICAgIGFycmF5OiBbXVxyXG4gICAgZGVsaW1pdGVkOiAtPlxyXG4gICAgICByZXRPYmouYXJyYXkuam9pbiBkZWZhdWx0cy5kZWxpbWl0ZXJcclxuXHJcbiAgICBzdHJpbmc6IChkZWxpbWl0ZXIgPSBkZWZhdWx0cy5kZWxpbWl0ZXIpIC0+XHJcbiAgICAgIHJldCA9ICcnXHJcbiAgICAgIE9KLmVhY2ggcmV0T2JqLmFycmF5LCAodmFsKSAtPlxyXG4gICAgICAgIHJldCArPSBkZWxpbWl0ZXIgIGlmIHJldC5sZW5ndGggPiAwXHJcbiAgICAgICAgcmV0ICs9IHZhbFxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgcmV0XHJcblxyXG4gICAgdG9TdHJpbmc6IC0+XHJcbiAgICAgIHJldE9iai5zdHJpbmcoKVxyXG5cclxuICAgIGFkZDogKHN0cikgLT5cclxuICAgICAgcmV0T2JqLmFycmF5LnB1c2ggZGVmYXVsdHMucGFyc2Uoc3RyKVxyXG4gICAgICBkZWZhdWx0cy5kZWxldGVEdXBsaWNhdGVzKClcclxuICAgICAgcmV0T2JqXHJcblxyXG4gICAgcmVtb3ZlOiAoc3RyKSAtPlxyXG4gICAgICByZW1vdmUgPSAoYXJyYXkpIC0+XHJcbiAgICAgICAgYXJyYXkuZmlsdGVyIChpdGVtKSAtPlxyXG4gICAgICAgICAgdHJ1ZSAgaWYgaXRlbSBpc250IHN0clxyXG5cclxuXHJcbiAgICAgIHJldE9iai5hcnJheSA9IHJlbW92ZShyZXRPYmouYXJyYXkpXHJcbiAgICAgIHJldE9ialxyXG5cclxuICAgIGNvdW50OiAtPlxyXG4gICAgICByZXRPYmouYXJyYXkubGVuZ3RoXHJcblxyXG4gICAgY29udGFpbnM6IChzdHIsIGNhc2VTZW5zaXRpdmUpIC0+XHJcbiAgICAgIGlzQ2FzZVNlbnNpdGl2ZSA9IE9KLnRvLmJvb2woY2FzZVNlbnNpdGl2ZSlcclxuICAgICAgc3RyID0gT0oudG8uc3RyaW5nKHN0cikudHJpbSgpXHJcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpICBpZiBmYWxzZSBpcyBpc0Nhc2VTZW5zaXRpdmVcclxuICAgICAgbWF0Y2ggPSByZXRPYmouYXJyYXkuZmlsdGVyKChtYXRTdHIpIC0+XHJcbiAgICAgICAgKGlzQ2FzZVNlbnNpdGl2ZSBhbmQgT0oudG8uc3RyaW5nKG1hdFN0cikudHJpbSgpIGlzIHN0cikgb3IgT0oudG8uc3RyaW5nKG1hdFN0cikudHJpbSgpLnRvTG93ZXJDYXNlKCkgaXMgc3RyXHJcbiAgICAgIClcclxuICAgICAgbWF0Y2gubGVuZ3RoID4gMFxyXG5cclxuICAgIGVhY2g6IChjYWxsQmFjaykgLT5cclxuICAgICAgcmV0T2JqLmFycmF5LmZvckVhY2ggY2FsbEJhY2tcclxuXHJcbiAgZGVmYXVsdHMucGFyc2UgPSAoc3RyKSAtPlxyXG4gICAgcmV0ID0gT0oudG8uc3RyaW5nKHN0cilcclxuICAgIHJldCA9IHJldC5yZXBsYWNlKC9cXG4vZywgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCJcXG5cIikgaXNudCAtMSAgaWYgZGVmYXVsdHMubmV3TGluZVRvRGVsaW1pdGVyXHJcbiAgICByZXQgPSByZXQucmVwbGFjZShSZWdFeHAoXCIgXCIsIFwiZ1wiKSwgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCIgXCIpIGlzbnQgLTEgIGlmIGRlZmF1bHRzLnNwYWNlVG9EZWxpbWl0ZXJcclxuICAgIHJldCA9IHJldC5yZXBsYWNlKC8sLC9nLCBkZWZhdWx0cy5kZWxpbWl0ZXIpICB3aGlsZSByZXQuaW5kZXhPZihcIiwsXCIpIGlzbnQgLTFcclxuICAgIHJldFxyXG5cclxuICBkZWZhdWx0cy5kZWxldGVEdXBsaWNhdGVzID0gLT5cclxuICAgIGlmIGRlZmF1bHRzLnJlbW92ZUR1cGxpY2F0ZXNcclxuICAgICAgKC0+XHJcbiAgICAgICAgdW5pcXVlID0gKGFycmF5KSAtPlxyXG4gICAgICAgICAgc2VlbiA9IG5ldyBTZXQoKVxyXG4gICAgICAgICAgYXJyYXkuZmlsdGVyIChpdGVtKSAtPlxyXG4gICAgICAgICAgICBpZiBmYWxzZSBpcyBzZWVuLmhhcyhpdGVtKVxyXG4gICAgICAgICAgICAgIHNlZW4uYWRkIGl0ZW1cclxuICAgICAgICAgICAgICB0cnVlXHJcblxyXG5cclxuICAgICAgICByZXRPYmouYXJyYXkgPSB1bmlxdWUocmV0T2JqLmFycmF5KVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICApKClcclxuICAgIHJldHVyblxyXG5cclxuICAoKGEpIC0+XHJcbiAgICBpZiBhLmxlbmd0aCA+IDEgYW5kIGZhbHNlIGlzIE9KLmlzLnBsYWluT2JqZWN0KG9wdHMpXHJcbiAgICAgIE9KLmVhY2ggYSwgKHZhbCkgLT5cclxuICAgICAgICByZXRPYmouYXJyYXkucHVzaCB2YWwgIGlmIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5KHZhbClcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICBlbHNlIGlmIHN0cmluZyBhbmQgc3RyaW5nLmxlbmd0aCA+IDBcclxuICAgICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRzXHJcbiAgICAgIGRlbGltaXRlZFN0cmluZyA9IGRlZmF1bHRzLnBhcnNlKHN0cmluZylcclxuICAgICAgZGVmYXVsdHMuaW5pdFN0cmluZyA9IGRlbGltaXRlZFN0cmluZ1xyXG4gICAgICByZXRPYmouYXJyYXkgPSBkZWxpbWl0ZWRTdHJpbmcuc3BsaXQoZGVmYXVsdHMuZGVsaW1pdGVyKVxyXG4gICAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcygpXHJcbiAgICByZXR1cm5cclxuICApIGFyZ3VtZW50c1xyXG4gIHJldE9ialxyXG5cclxuXHJcbk9KLnJlZ2lzdGVyICdkZWxpbWl0ZWRTdHJpbmcnLCBkZWxpbWl0ZWRTdHJpbmdcclxubW9kdWxlLmV4cG9ydHMgPSBkZWxpbWl0ZWRTdHJpbmciLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgTm9kZSwgT0osIF8sIGJvZHksIG9qQm9keTtcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5Ob2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XG5cblxuLypcblBlcnNpc3QgYSBoYW5kbGUgb24gdGhlIGJvZHkgbm9kZVxuICovXG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gIGJvZHkgPSBkb2N1bWVudC5ib2R5O1xufSBlbHNlIHtcbiAgYm9keSA9IG51bGw7XG59XG5cbm9qQm9keSA9IG5ldyBOb2RlO1xuXG5vakJvZHkuZWxlbWVudCA9IGJvZHk7XG5cbk9KLnJlZ2lzdGVyKCdib2R5Jywgb2pCb2R5KTtcblxubW9kdWxlLmV4cG9ydHMgPSBvakJvZHk7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4a2IyMWNYR0p2WkhrdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFTeEpRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlEwb3NTVUZCUVN4SFFVRlBMRTlCUVVFc1EwRkJVU3hSUVVGU096czdRVUZIVURzN096dEJRVWRCTEVsQlFVY3NUMEZCVHl4UlFVRlFMRXRCUVhGQ0xGZEJRWGhDTzBWQlFYbERMRWxCUVVFc1IwRkJUeXhSUVVGUkxFTkJRVU1zUzBGQmVrUTdRMEZCUVN4TlFVRkJPMFZCUVcxRkxFbEJRVUVzUjBGQlR5eExRVUV4UlRzN08wRkJRMEVzVFVGQlFTeEhRVUZUTEVsQlFVazdPMEZCUTJJc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSTdPMEZCUldwQ0xFVkJRVVVzUTBGQlF5eFJRVUZJTEVOQlFWa3NUVUZCV2l4RlFVRnZRaXhOUVVGd1FqczdRVUZEUVN4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpVDBvZ1BTQnlaWEYxYVhKbElDY3VMaTl2YWlkY2NseHVYeUE5SUhKbGNYVnBjbVVnSjJ4dlpHRnphQ2RjY2x4dVRtOWtaU0E5SUhKbGNYVnBjbVVnSnk0dmJtOWtaU2RjY2x4dVhISmNibHh5WEc0akl5TmNjbHh1VUdWeWMybHpkQ0JoSUdoaGJtUnNaU0J2YmlCMGFHVWdZbTlrZVNCdWIyUmxYSEpjYmlNakkxeHlYRzVwWmlCMGVYQmxiMllnWkc5amRXMWxiblFnYVhOdWRDQW5kVzVrWldacGJtVmtKeUIwYUdWdUlHSnZaSGtnUFNCa2IyTjFiV1Z1ZEM1aWIyUjVJR1ZzYzJVZ1ltOWtlU0E5SUc1MWJHeGNjbHh1YjJwQ2IyUjVJRDBnYm1WM0lFNXZaR1ZjY2x4dWIycENiMlI1TG1Wc1pXMWxiblFnUFNCaWIyUjVYSEpjYmlBZ1hISmNiazlLTG5KbFoybHpkR1Z5SUNkaWIyUjVKeXdnYjJwQ2IyUjVYSEpjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnYjJwQ2IyUjVJbDE5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuXHJcbiMgIyBjb21wb25lbnRcclxuXHJcblxyXG4jIENyZWF0ZSBhbiBIVE1MIFdlYiBDb21wb25lbnQgdGhyb3VnaCBUaGluRG9tXHJcblxyXG4jIC0gYG9wdGlvbnNgIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHN0YW5kYXJkIG9wdGlvbnMgdG8gYmUgcGFzc2VkIGludG8gdGhlIGNvbXBvbmVudFxyXG4jIC0tIGByb290Tm9kZVR5cGVgOiB0aGUgdGFnIG5hbWUgb2YgdGhlIHJvb3Qgbm9kZSB0byBjcmVhdGUsIGRlZmF1bHQgPSAnZGl2J1xyXG4jIC0tIGBwcm9wc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIERPTSBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXHJcbiMgLS0gYHN0eWxlc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIENTUyBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXHJcbiMgLS0gYGV2ZW50c2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5hbWVkIERPTSBldmVudHMgKGFuZCBjb3JyZXNwb25kaW5nIGNhbGxiYWNrIG1ldGhvZHMpIHRvIGJpbmQgdG8gdGhlIHJvb3Qgbm9kZVxyXG4jIC0gYG93bmVyYCB0aGUgcGFyZW50IHRvIHdoaWNoIHRoZSBjb21wb25lbnQgbm9kZSB3aWxsIGJlIGFwcGVuZGVkXHJcbiMgLSBgdGFnTmFtZWAgdGhlIG5hbWUgb2Ygb2YgdGhlIGNvbXBvbmVudCwgd2hpY2ggd2lsbCBhbHdheXMgYmUgcHJlZml4ZWQgd2l0aCAneC0nXHJcbmNvbXBvbmVudCA9IChvcHRpb25zID0gb2JqLm9iamVjdCgpLCBvd25lciwgdGFnTmFtZSkgLT5cclxuXHJcbiAgaWYgbm90IHRhZ05hbWUuc3RhcnRzV2l0aCAneC0nIHRoZW4gdGFnTmFtZSA9ICd4LScgKyB0YWdOYW1lXHJcbiAgIyB3ZWIgY29tcG9uZW50cyBhcmUgcmVhbGx5IGp1c3Qgb3JkaW5hcnkgT0ogW2VsZW1lbnRdKGVsZW1lbnQuaHRtbCkncyB3aXRoIGEgc3BlY2lhbCBuYW1lLlxyXG4gICMgVW50aWwgSFRNTCBXZWIgQ29tcG9uZW50cyBhcmUgZnVsbHkgc3VwcG9ydGVkIChhbmQgT0ogaXMgcmVmYWN0b3JlZCBhY2NvcmRpbmdseSksIHRoZSBlbGVtZW50IHdpbGwgYmUgdHJlYXRlZCBhcyBhbiB1bmtub3duIGVsZW1lbnQuXHJcbiAgIyBJbiBtb3N0IGNhc2VzLCB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiB0aGUgYnJvd3NlciBpcyBhY2NlcHRhYmxlIChzZWUgYWxzbyBbSFRNTCBTZW1hbnRpY3NdKGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vc2VtYW50aWNzLmh0bWwpKSwgYnV0XHJcbiAgIyBpbiBzb21lIGNhc2VzIHRoaXMgaXMgcHJvYmxlbWF0aWMgKGZpcnN0bHksIGJlY2F1c2UgdGhlc2UgZWxlbWVudHMgYXJlIGFsd2F5cyByZW5kZXJlZCBpbmxpbmUpLlxyXG4gICMgSW4gc3VjaCBjb25kaXRpb25zLCB0aGUgW2NvbnRyb2xzXShjb250cm9scy5odG1sKSBjbGFzcyBhbmQgbmFtZSBzcGFjZSBpcyBiZXR0ZXIgc3VpdGVkIHRvIGNsYXNzZXMgd2hpY2ggcmVxdWlyZSBjb21wbGV0ZSBjb250cm9sIChlLmcuIFtpY29uXShpY29uLmh0bWwpKS5cclxuICB3aWRnZXQgPSBub2RlRmFjdG9yeSB0YWdOYW1lLCBvYmoub2JqZWN0KCksIG93bmVyLCBmYWxzZSAjLCBvcHRpb25zLnByb3BzLCBvcHRpb25zLnN0eWxlcywgb3B0aW9ucy5ldmVudHMsIG9wdGlvbnMudGV4dFxyXG4gIFxyXG4gICMgU2luY2UgdGhlIGJlaGF2aW9yIG9mIHN0eWxpbmcgaXMgbm90IHdlbGwgY29udHJvbGxlZC9jb250cm9sbGFibGUgb24gdW5rbm93biBlbGVtZW50cywgaXQgaXMgbmVjZXNzYXJ5IHRvIGNyZWF0ZSBhIHJvb3Qgbm9kZSBmb3IgdGhlIGNvbXBvbmVudC5cclxuICAjIEluIG1vc3QgY2FzZXMsIFtkaXZdKGRpdi5odG1sKSBpcyBwZXJmZWN0bHkgYWNjZXB0YWJsZSwgYnV0IHRoaXMgaXMgY29uZmlndXJhYmxlIGF0IHRoZSBuYW1lIHNwYWNlIGxldmVsIG9yIGF0IHJ1bnRpbWUuXHJcbiAgcm9vdE5vZGVUeXBlID0gb3B0aW9ucy5yb290Tm9kZVR5cGUgb3IgT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSBvciAnZGl2J1xyXG5cclxuICAjIGByZXRgIGlzIHRoZSB0aGUgaW5zdGFuY2Ugb2YgdGhlIHJvb3ROb2RlVHlwZSwgbm90IHRoZSBgd2lkZ2V0YCB3cmFwcGVkIGluIHRoaXMgY2xvc3VyZVxyXG4gIHJldCA9IHdpZGdldC5tYWtlIHJvb3ROb2RlVHlwZSwgb3B0aW9uc1xyXG5cclxuICAjIGZvciBjb252ZW5pZW5jZSBhbmQgZGVidWdnaW5nLCBwZXJzaXN0IHRoZSB0YWdOYW1lXHJcbiAgcmV0LmNvbXBvbmVudE5hbWUgPSB0YWdOYW1lXHJcblxyXG4gICMgYHJlbW92ZWAgZG9lcywgaG93ZXZlciwgYmVoYXZlIGFzIGV4cGVjdGVkIGJ5IHJlbW92aW5nIGB3aWRnZXRgXHJcbiAgcmV0LnJlbW92ZSA9IHdpZGdldC5yZW1vdmVcclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdjb21wb25lbnQnLCBjb21wb25lbnRcclxubW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5cclxuIyMjXHJcbkNyZWF0ZSBhIHNldCBvZiBIVE1MIEVsZW1lbnRzIHRocm91Z2ggVGhpbkRvbVxyXG4jIyNcclxuY29udHJvbCA9IChvcHRpb25zID0gb2JqLm9iamVjdCgpLCBvd25lciwgdGFnTmFtZSkgLT5cclxuICBpZiBub3QgdGFnTmFtZS5zdGFydHNXaXRoICd5LScgdGhlbiB0YWdOYW1lID0gJ3ktJyArIHRhZ05hbWVcclxuXHJcbiAgcm9vdE5vZGVUeXBlID0gb3B0aW9ucy5yb290Tm9kZVR5cGUgb3IgT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSBvciAnZGl2J1xyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSByb290Tm9kZVR5cGUsIG9wdGlvbnMsIG93bmVyLCBmYWxzZVxyXG5cclxuICByZXQuYWRkICdjb250cm9sTmFtZScsIHRhZ05hbWVcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAnY29udHJvbCcsIGNvbnRyb2xcclxubW9kdWxlLmV4cG9ydHMgPSBjb250cm9sIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyICQsIE5vZGUsIE9KLCBUaGluRE9NLCBfLCBlbGVtZW50O1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbiQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cbl8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG5cbk5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcblxuVGhpbkRPTSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUaGluRE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUaGluRE9NJ10gOiBudWxsKTtcblxuZWxlbWVudCA9IHtcblxuICAvKlxuICBSZXN0b3JlIGFuIEhUTUwgRWxlbWVudCB0aHJvdWdoIFRoaW5Eb21cbiAgICovXG4gIHJlc3RvcmVFbGVtZW50OiBmdW5jdGlvbihlbCwgdGFnKSB7XG4gICAgdmFyIG5vZGU7XG4gICAgaWYgKHRhZyA9PSBudWxsKSB7XG4gICAgICB0YWcgPSBlbC5ub2RlTmFtZTtcbiAgICB9XG4gICAgZWwub2ZXcmFwcGVyIHx8IChub2RlID0gbmV3IE5vZGUpO1xuICAgIG5vZGUuZWxlbWVudCA9IGVsO1xuICAgIHJldHVybiBub2RlO1xuICB9XG59O1xuXG5PSi5yZWdpc3RlcigncmVzdG9yZUVsZW1lbnQnLCBlbGVtZW50LnJlc3RvcmVFbGVtZW50KTtcblxuT0oucmVnaXN0ZXIoJ2lzRWxlbWVudEluRG9tJywgZnVuY3Rpb24oZWxlbWVudElkKSB7XG4gIHJldHVybiBmYWxzZSA9PT0gT0ouaXMubnVsbE9yRW1wdHkoT0ouZ2V0RWxlbWVudChlbGVtZW50SWQpKTtcbn0pO1xuXG5PSi5yZWdpc3RlcignZ2V0RWxlbWVudCcsIGZ1bmN0aW9uKGlkKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZWxlbWVudDtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRnhrYjIxY1hHVnNaVzFsYm5RdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFTeEpRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlEwb3NRMEZCUVN4SFFVRkpMRTlCUVVFc1EwRkJVU3hSUVVGU096dEJRVU5LTEVsQlFVRXNSMEZCVHl4UFFVRkJMRU5CUVZFc1VVRkJVanM3UVVGRlVDeFBRVUZCTEVkQlFWVXNUMEZCUVN4RFFVRlJMRk5CUVZJN08wRkJTVllzVDBGQlFTeEhRVVZGT3p0QlFVRkJPenM3UlVGSFFTeGpRVUZCTEVWQlFXZENMRk5CUVVNc1JVRkJSQ3hGUVVGTExFZEJRVXc3UVVGRFppeFJRVUZCT3p0TlFVUnZRaXhOUVVGTkxFVkJRVVVzUTBGQlF6czdTVUZETjBJc1JVRkJSU3hEUVVGRExGTkJRVWdzU1VGRFJTeERRVUZCTEVsQlFVRXNSMEZCVHl4SlFVRkpMRWxCUVZnN1NVRkRRU3hKUVVGSkxFTkJRVU1zVDBGQlRDeEhRVUZsTzFkQlEyWTdSVUZLWVN4RFFVaG9RanM3TzBGQlUwWXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3huUWtGQldpeEZRVUU0UWl4UFFVRlBMRU5CUVVNc1kwRkJkRU03TzBGQlJVRXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3huUWtGQldpeEZRVUU0UWl4VFFVRkRMRk5CUVVRN1UwRkROVUlzUzBGQlFTeExRVUZUTEVWQlFVVXNRMEZCUXl4RlFVRkZMRU5CUVVNc1YwRkJUaXhEUVVGclFpeEZRVUZGTEVOQlFVTXNWVUZCU0N4RFFVRmpMRk5CUVdRc1EwRkJiRUk3UVVGRWJVSXNRMEZCT1VJN08wRkJSMEVzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4WlFVRmFMRVZCUVRCQ0xGTkJRVU1zUlVGQlJEdEZRVU40UWl4SlFVRkhMRTlCUVU4c1VVRkJVQ3hMUVVGeFFpeFhRVUY0UWp0WFFVTkZMRkZCUVZFc1EwRkJReXhqUVVGVUxFTkJRWGRDTEVWQlFYaENMRVZCUkVZN08wRkJSSGRDTEVOQlFURkNPenRCUVV0QkxFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKUFNpQTlJSEpsY1hWcGNtVWdKeTR1TDI5cUoxeHlYRzRrSUQwZ2NtVnhkV2x5WlNBbmFuRjFaWEo1SjF4eVhHNWZJRDBnY21WeGRXbHlaU0FuYkc5a1lYTm9KMXh5WEc1T2IyUmxJRDBnY21WeGRXbHlaU0FuTGk5dWIyUmxKMXh5WEc1Y2NseHVWR2hwYmtSUFRTQTlJSEpsY1hWcGNtVWdKM1JvYVc1a2IyMG5YSEpjYmx4eVhHNGpJQ01nWld4bGJXVnVkRnh5WEc1Y2NseHVaV3hsYldWdWRDQTlJRnh5WEc0Z0lDTWdJeU1nY21WemRHOXlaVVZzWlcxbGJuUmNjbHh1SUNBakl5TmNjbHh1SUNCU1pYTjBiM0psSUdGdUlFaFVUVXdnUld4bGJXVnVkQ0IwYUhKdmRXZG9JRlJvYVc1RWIyMWNjbHh1SUNBakl5TmNjbHh1SUNCeVpYTjBiM0psUld4bGJXVnVkRG9nS0dWc0xDQjBZV2NnUFNCbGJDNXViMlJsVG1GdFpTa2dMVDVjY2x4dUlDQmNkR1ZzTG05bVYzSmhjSEJsY2lCdmNseHlYRzVjZENBZ0lDQnViMlJsSUQwZ2JtVjNJRTV2WkdWY2NseHVYSFFnSUNBZ2JtOWtaUzVsYkdWdFpXNTBJRDBnWld4Y2NseHVYSFFnSUNBZ2JtOWtaVnh5WEc1Y2NseHVUMG91Y21WbmFYTjBaWElnSjNKbGMzUnZjbVZGYkdWdFpXNTBKeXdnWld4bGJXVnVkQzV5WlhOMGIzSmxSV3hsYldWdWRGeHlYRzVjY2x4dVQwb3VjbVZuYVhOMFpYSWdKMmx6Uld4bGJXVnVkRWx1Ukc5dEp5d2dLR1ZzWlcxbGJuUkpaQ2tnTFQ1Y2NseHVJQ0JtWVd4elpTQnBjeUJQU2k1cGN5NXVkV3hzVDNKRmJYQjBlU0JQU2k1blpYUkZiR1Z0Wlc1MElHVnNaVzFsYm5SSlpGeHlYRzVjY2x4dVQwb3VjbVZuYVhOMFpYSWdKMmRsZEVWc1pXMWxiblFuTENBb2FXUXBJQzArWEhKY2JpQWdhV1lnZEhsd1pXOW1JR1J2WTNWdFpXNTBJR2x6Ym5RZ0ozVnVaR1ZtYVc1bFpDZGNjbHh1SUNBZ0lHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0dsa0tWeHlYRzVjY2x4dVhISmNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdaV3hsYldWdWRDSmRmUT09IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIGZyYWdtZW50XHJcblxyXG4jIENyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50IGFuZCByZXR1cm4gaXQgYXMgYW4gT0ogbm9kZVxyXG5mcmFnbWVudCA9IC0+XHJcbiAgcmV0ID0gbnVsbFxyXG4gIGlmIHR5cGVvZiBkb2N1bWVudCBpc250ICd1bmRlZmluZWQnXHJcbiAgICBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxyXG4gICAgXHJcbiAgICBmcmFnID0gbmV3IFRoaW5ET00gbnVsbCwgbnVsbCwgZnJhZ21lbnRcclxuICAgIGZyYWcuaXNJbkRPTSA9IHRydWVcclxuICAgIHJldCA9IG5vZGVGYWN0b3J5IGZyYWdcclxuICAgIFxyXG4gIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ2ZyYWdtZW50JywgZnJhZ21lbnRcclxubW9kdWxlLmV4cG9ydHMgPSBmcmFnbWVudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBnZW5lcmljIG5vZGVzXHJcblxyXG5jbG9zZWQgPSBbXHJcbiAgJ2FiYnInXHJcbiAgJ2Fjcm9ueW0nXHJcbiAgJ2FwcGxldCdcclxuICAnYXJ0aWNsZSdcclxuICAnYXNpZGUnXHJcbiAgJ2F1ZGlvJ1xyXG4gICdiJ1xyXG4gICdiZG8nXHJcbiAgJ2JpZydcclxuICAnYmxvY2txdW90ZSdcclxuICAnYnV0dG9uJ1xyXG4gICdjYW52YXMnXHJcbiAgJ2NhcHRpb24nXHJcbiAgJ2NlbnRlcidcclxuICAnY2l0ZSdcclxuICAnY29kZSdcclxuICAnY29sZ3JvdXAnXHJcbiAgJ2RhdGFsaXN0J1xyXG4gICdkZCdcclxuICAnZGVsJ1xyXG4gICdkZXRhaWxzJ1xyXG4gICdkZm4nXHJcbiAgJ2RpcidcclxuICAnZGl2J1xyXG4gICdkbCdcclxuICAnZHQnXHJcbiAgJ2VtJ1xyXG4gICdmaWVsZHNldCdcclxuICAnZmlnY2FwdGlvbidcclxuICAnZmlndXJlJ1xyXG4gICdmb250J1xyXG4gICdmb290ZXInXHJcbiAgJ2gxJ1xyXG4gICdoMidcclxuICAnaDMnXHJcbiAgJ2g0J1xyXG4gICdoNSdcclxuICAnaDYnXHJcbiAgJ2hlYWQnXHJcbiAgJ2hlYWRlcidcclxuICAnaGdyb3VwJ1xyXG4gICdodG1sJ1xyXG4gICdpJ1xyXG4gICdpZnJhbWUnXHJcbiAgJ2lucydcclxuICAna2JkJ1xyXG4gICdsYWJlbCdcclxuICAnbGVnZW5kJ1xyXG4gICdsaSdcclxuICAnbWFwJ1xyXG4gICdtYXJrJ1xyXG4gICdtZW51J1xyXG4gICdtZXRlcidcclxuICAnbmF2J1xyXG4gICdub2ZyYW1lcydcclxuICAnbm9zY3JpcHQnXHJcbiAgJ29iamVjdCdcclxuICAnb3B0Z3JvdXAnXHJcbiAgJ29wdGlvbidcclxuICAnb3V0cHV0J1xyXG4gICdwJ1xyXG4gICdwcmUnXHJcbiAgJ3Byb2dyZXNzJ1xyXG4gICdxJ1xyXG4gICdycCdcclxuICAncnQnXHJcbiAgJ3J1YnknXHJcbiAgJ3MnXHJcbiAgJ3NhbXAnXHJcbiAgJ3NlY3Rpb24nXHJcbiAgJ3NtYWxsJ1xyXG4gICdzcGFuJ1xyXG4gICdzdHJpa2UnXHJcbiAgJ3N0cm9uZydcclxuICAnc3R5bGUnXHJcbiAgJ3N1YidcclxuICAnc3VtbWFyeSdcclxuICAnc3VwJ1xyXG4gICd0Ym9keSdcclxuICAndGQnXHJcbiAgJ3Rmb290J1xyXG4gICd0aCdcclxuICAndGltZSdcclxuICAndGl0bGUnXHJcbiAgJ3RyJ1xyXG4gICd0dCdcclxuICAndSdcclxuICAndmFyJ1xyXG4gICd2aWRlbydcclxuICAneG1wJ1xyXG5dXHJcbm9wZW4gPSAnYXJlYSBiYXNlIGNvbCBjb21tYW5kIGNzcyBlbWJlZCBociBpbWcga2V5Z2VuIG1ldGEgcGFyYW0gc291cmNlIHRyYWNrIHdicicuc3BsaXQgJyAnXHJcbmFsbCA9IGNsb3NlZC5jb25jYXQgb3BlblxyXG5cclxuZXhwb3J0cyA9IHt9XHJcbiMgcmVnaXN0ZXIgc2VtYW50aWMvc3RydWN0dXJhbCBhbGlhc2VzXHJcbmZvciBsb29wTmFtZSBpbiBhbGxcclxuICBkbyAodGFnID0gbG9vcE5hbWUpIC0+XHJcbiAgICBtZXRob2QgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICAgICAgZGVmYXVsdHMgPVxyXG4gICAgICAgIHByb3BzOiB7fVxyXG4gICAgICAgIHN0eWxlczoge31cclxuICAgICAgICBldmVudHM6IHt9XHJcblxyXG4gICAgICBvYmouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zXHJcbiAgICAgIHJldCA9IG5vZGVGYWN0b3J5IHRhZywgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuICAgICAgcmV0XHJcbiAgICBtZXRob2QuZGVmYXVsdEJlaGF2aW9yID0gdHJ1ZVxyXG4gICAgT0oubm9kZXMucmVnaXN0ZXIgdGFnLCBtZXRob2RcclxuICAgIGV4cG9ydHNbdGFnXSA9IG1ldGhvZFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMjI1xyXG5DcmVhdGUgYW4gT0ogSW5wdXQgT2JqZWN0IHRocm91Z2ggT0oubm9kZXMuaW5wdXRcclxuIyMjXHJcbmlucHV0ID0gKG9wdGlvbnMgPSBPSi5vYmplY3QoKSwgb3duZXIpIC0+XHJcbiAgaWYgbm90IG93bmVyIHRoZW4gdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIGFuIGlucHV0IHdpdGhvdXQgYSBwYXJlbnQnXHJcbiAgaWYgbm90IG9wdGlvbnMucHJvcHMgb3Igbm90IG9wdGlvbnMucHJvcHMudHlwZSB0aGVuIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhbiBpbnB1dCB3aXRob3V0IGFuIGlucHV0IHR5cGUnXHJcbiAgcmV0ID0gb3duZXIubWFrZSAnaW5wdXQnLCBvcHRpb25zXHJcbiAgcmV0LmFkZCAnaW5wdXROYW1lJywgb3B0aW9ucy5wcm9wcy50eXBlXHJcbiAgcmV0XHJcbiAgICBcclxuT0oucmVnaXN0ZXIgJ2lucHV0JywgaW5wdXRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dCIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciAkLCBOb2RlLCBPSiwgbWV0aG9kcztcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG4kID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuXG5tZXRob2RzID0ge307XG5cbk5vZGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIE5vZGUocGFyZW50KSB7fVxuXG4gIE5vZGUucHJvdG90eXBlLm1ha2UgPSBmdW5jdGlvbih0YWdOYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIG1ldGhvZCwgbmV3T0pOb2RlO1xuICAgIGlmICh0YWdOYW1lLm1ha2UpIHtcbiAgICAgIHJldHVybiB0YWdOYW1lLm1ha2UodGhpcywgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1ldGhvZCA9IG1ldGhvZHNbdGFnTmFtZV07XG4gICAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBtZXRob2Qob3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZXRob2QgPSBPSi5ub2Rlc1t0YWdOYW1lXSB8fCBPSi5jb21wb25lbnRzW3RhZ05hbWVdIHx8IE9KLmNvbnRyb2xzW3RhZ05hbWVdIHx8IE9KLmlucHV0c1t0YWdOYW1lXTtcbiAgICAgICAgaWYgKG1ldGhvZCAmJiAhbWV0aG9kLmRlZmF1bHRCZWhhdmlvcikge1xuICAgICAgICAgIHJldHVybiBtZXRob2Qob3B0aW9ucywgdGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3T0pOb2RlID0gbmV3IE5vZGUoKTtcbiAgICAgICAgICBuZXdPSk5vZGUuZWxlbWVudCA9IG9qQ3JlYXRlRWxlbWVudCh0aGlzLmVsZW1lbnQsIHRhZ05hbWUsIG9wdGlvbnMpO1xuICAgICAgICAgIHJldHVybiBuZXdPSk5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgTm9kZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzW25hbWVdID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5valdyYXBwZXIgPSB0aGlzO1xuICB9O1xuXG4gIE5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgcGFyZW50LCB2YWx1ZTtcbiAgICB2YWx1ZSA9IHRoaXNbbmFtZV07XG4gICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHBhcmVudCA9IHRoaXMuZWxlbWVudDtcbiAgICAgIHdoaWxlIChwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZSkge1xuICAgICAgICBpZiAocGFyZW50Lm9qV3JhcHBlcikge1xuICAgICAgICAgIHJldHVybiBwYXJlbnQub2pXcmFwcGVyLmdldChuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBOb2RlO1xuXG59KSgpO1xuXG5bJ29uJywgJ2VtcHR5JywgJ3RleHQnLCAncmVtb3ZlQ2xhc3MnLCAnYWRkQ2xhc3MnLCAnaGFzQ2xhc3MnLCAnc2hvdycsICdoaWRlJywgJ2F0dHInLCAnY3NzJywgJ3JlbW92ZScsICdhcHBlbmQnLCAndmFsJywgJ2h0bWwnLCAncHJvcCcsICd0cmlnZ2VyJ10uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgcmV0dXJuIE5vZGUucHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgalF1ZXJ5V3JhcHBlcjtcbiAgICBqUXVlcnlXcmFwcGVyID0gdGhpcy4kO1xuICAgIHJldHVybiBqUXVlcnlXcmFwcGVyW21ldGhvZF0uYXBwbHkoalF1ZXJ5V3JhcHBlciwgYXJndW1lbnRzKTtcbiAgfTtcbn0pO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoTm9kZS5wcm90b3R5cGUsICckJywge1xuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBqUXVlcnlXcmFwcGVyO1xuICAgIGpRdWVyeVdyYXBwZXIgPSAkKHRoaXMuZWxlbWVudCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICckJywge1xuICAgICAgdmFsdWU6IGpRdWVyeVdyYXBwZXJcbiAgICB9KTtcbiAgICByZXR1cm4galF1ZXJ5V3JhcHBlcjtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gT0ouTm9kZSA9IE5vZGU7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4a2IyMWNYRzV2WkdVdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFTeEpRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlQwb3NUMEZCUVN4SFFVRlZPenRCUVV0S08wVkJTVk1zWTBGQlF5eE5RVUZFTEVkQlFVRTdPMmxDUVVWaUxFbEJRVUVzUjBGQlRTeFRRVUZETEU5QlFVUXNSVUZCVlN4UFFVRldPMEZCUTBvc1VVRkJRVHRKUVVGQkxFbEJRVWNzVDBGQlR5eERRVUZETEVsQlFWZzdZVUZEUlN4UFFVRlBMRU5CUVVNc1NVRkJVaXhEUVVGaExFbEJRV0lzUlVGQmJVSXNUMEZCYmtJc1JVRkVSanRMUVVGQkxFMUJRVUU3VFVGSFJTeE5RVUZCTEVkQlFWTXNUMEZCVVN4RFFVRkJMRTlCUVVFN1RVRkRha0lzU1VGQlJ5eE5RVUZJTzJWQlEwVXNUVUZCUVN4RFFVRlBMRTlCUVZBc1JVRkVSanRQUVVGQkxFMUJRVUU3VVVGSFJTeE5RVUZCTEVkQlFWTXNSVUZCUlN4RFFVRkRMRXRCUVUwc1EwRkJRU3hQUVVGQkxFTkJRVlFzU1VGQmNVSXNSVUZCUlN4RFFVRkRMRlZCUVZjc1EwRkJRU3hQUVVGQkxFTkJRVzVETEVsQlFTdERMRVZCUVVVc1EwRkJReXhSUVVGVExFTkJRVUVzVDBGQlFTeERRVUV6UkN4SlFVRjFSU3hGUVVGRkxFTkJRVU1zVFVGQlR5eERRVUZCTEU5QlFVRTdVVUZETVVZc1NVRkJSeXhOUVVGQkxFbEJRVlVzUTBGQlF5eE5RVUZOTEVOQlFVTXNaVUZCY2tJN2FVSkJRMFVzVFVGQlFTeERRVUZQTEU5QlFWQXNSVUZCWjBJc1NVRkJhRUlzUlVGRVJqdFRRVUZCTEUxQlFVRTdWVUZIUlN4VFFVRkJMRWRCUVdkQ0xFbEJRVUVzU1VGQlFTeERRVUZCTzFWQlEyaENMRk5CUVZNc1EwRkJReXhQUVVGV0xFZEJRVzlDTEdWQlFVRXNRMEZCWjBJc1NVRkJReXhEUVVGQkxFOUJRV3BDTEVWQlFUQkNMRTlCUVRGQ0xFVkJRVzFETEU5QlFXNURPMmxDUVVOd1FpeFZRVXhHTzFOQlNrWTdUMEZLUmpzN1JVRkVTVHM3YVVKQlowSk9MRWRCUVVFc1IwRkJTeXhUUVVGRExFbEJRVVFzUlVGQlR5eExRVUZRTzBsQlEwZ3NTVUZCU3l4RFFVRkJMRWxCUVVFc1EwRkJUQ3hIUVVGaE8xZEJSV0lzU1VGQlF5eERRVUZCTEU5QlFVOHNRMEZCUXl4VFFVRlVMRWRCUVhGQ08wVkJTR3hDT3p0cFFrRkxUQ3hIUVVGQkxFZEJRVXNzVTBGQlF5eEpRVUZFTzBGQlEwZ3NVVUZCUVR0SlFVRkJMRXRCUVVFc1IwRkJVU3hKUVVGTExFTkJRVUVzU1VGQlFUdEpRVU5pTEVsQlFVY3NTMEZCUVN4TFFVRlRMRTFCUVZvN1RVRkRSU3hOUVVGQkxFZEJRVk1zU1VGQlF5eERRVUZCTzBGQlExWXNZVUZCVFN4TlFVRkJMRWRCUVZNc1RVRkJUU3hEUVVGRExGVkJRWFJDTzFGQlEwVXNTVUZCUnl4TlFVRk5MRU5CUVVNc1UwRkJWanRCUVVORkxHbENRVUZQTEUxQlFVMHNRMEZCUXl4VFFVRlRMRU5CUVVNc1IwRkJha0lzUTBGQmNVSXNTVUZCY2tJc1JVRkVWRHM3VFVGRVJpeERRVVpHTzB0QlFVRXNUVUZCUVR0aFFVMUZMRTFCVGtZN08wVkJSa2M3T3pzN096dEJRVlZRTEVOQlEwVXNTVUZFUml4RlFVVkZMRTlCUmtZc1JVRkhSU3hOUVVoR0xFVkJTVVVzWVVGS1JpeEZRVXRGTEZWQlRFWXNSVUZOUlN4VlFVNUdMRVZCVDBVc1RVRlFSaXhGUVZGRkxFMUJVa1lzUlVGVFJTeE5RVlJHTEVWQlZVVXNTMEZXUml4RlFWZEZMRkZCV0VZc1JVRlpSU3hSUVZwR0xFVkJZVVVzUzBGaVJpeEZRV05GTEUxQlpFWXNSVUZsUlN4TlFXWkdMRVZCWjBKRkxGTkJhRUpHTEVOQmFVSkRMRU5CUVVNc1QwRnFRa1lzUTBGcFFsVXNVMEZCUXl4TlFVRkVPMU5CUTFJc1NVRkJTU3hEUVVGRExGTkJRVlVzUTBGQlFTeE5RVUZCTEVOQlFXWXNSMEZCZVVJc1UwRkJRVHRCUVVOMlFpeFJRVUZCTzBsQlFVRXNZVUZCUVN4SFFVRm5RaXhKUVVGRExFTkJRVUU3VjBGRGFrSXNZVUZCWXl4RFFVRkJMRTFCUVVFc1EwRkJUeXhEUVVGRExFdEJRWFJDTEVOQlFUUkNMR0ZCUVRWQ0xFVkJRVEpETEZOQlFUTkRPMFZCUm5WQ08wRkJSR3BDTEVOQmFrSldPenRCUVhWQ1FTeE5RVUZOTEVOQlFVTXNZMEZCVUN4RFFVRnpRaXhKUVVGSkxFTkJRVU1zVTBGQk0wSXNSVUZCYzBNc1IwRkJkRU1zUlVGRFJUdEZRVUZCTEVkQlFVRXNSVUZCU3l4VFFVRkJPMEZCUTBnc1VVRkJRVHRKUVVGQkxHRkJRVUVzUjBGQlowSXNRMEZCUVN4RFFVRkZMRWxCUVVrc1EwRkJReXhQUVVGUU8wbEJRMmhDTEUxQlFVMHNRMEZCUXl4alFVRlFMRU5CUVhOQ0xFbEJRWFJDTEVWQlFUUkNMRWRCUVRWQ0xFVkJRMFU3VFVGQlFTeExRVUZCTEVWQlFVOHNZVUZCVUR0TFFVUkdPMWRCUjBFN1JVRk1SeXhEUVVGTU8wTkJSRVk3TzBGQlZVRXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlzUlVGQlJTeERRVUZETEVsQlFVZ3NSMEZCVlNJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lUMG9nUFNCeVpYRjFhWEpsSUNjdUxpOXZhaWRjY2x4dUpDQTlJSEpsY1hWcGNtVWdKMnB4ZFdWeWVTZGNjbHh1WEhKY2JpTWdJeUJrYjIxY2NseHVYSEpjYmx4eVhHNGpJRVY0ZEdWdVpDQmhiaUJ2WW1wbFkzUWdkMmwwYUNCUFNpQkVUMDBnYldWMGFHOWtjeUJoYm1RZ2NISnZjR1Z5ZEdsbGMxeHlYRzVjY2x4dWJXVjBhRzlrY3lBOUlIdDlYSEpjYmx4eVhHNWNjbHh1SXlBdElHQkFaV3hnSUU5aWFtVmpkQ0IwYnlCbGVIUmxibVJjY2x4dUl5QXRJR0J3WVhKbGJuUmdJSEJoY21WdWRDQnZZbXBsWTNRZ2RHOGdkMmhwWTJnZ1lFQmxiR0FnZDJsc2JDQmlaU0JoY0hCbGJtUmxaRnh5WEc1amJHRnpjeUJPYjJSbFhISmNiaUFnWEhKY2JpQWdJM0JoY21WdWREb2djbVZ4ZFdseVpTZ25MaTlpYjJSNUp5bGNjbHh1SUNCY2NseHVJQ0JqYjI1emRISjFZM1J2Y2pvZ0tIQmhjbVZ1ZENrZ0xUNWNjbHh1WEhKY2JpQWdiV0ZyWlRvZ0tIUmhaMDVoYldVc0lHOXdkR2x2Ym5NcElDMCtYSEpjYmlBZ0lDQnBaaUIwWVdkT1lXMWxMbTFoYTJVZ0l5QndjbTkyYVdSbFpDQmhJR04xYzNSdmJTQmpiMjF3YjI1bGJuUWdaR2x5WldOMGJIbGNjbHh1SUNBZ0lDQWdkR0ZuVG1GdFpTNXRZV3RsSUhSb2FYTXNJRzl3ZEdsdmJuTmNjbHh1SUNBZ0lHVnNjMlZjY2x4dUlDQWdJQ0FnYldWMGFHOWtJRDBnYldWMGFHOWtjMXQwWVdkT1lXMWxYVnh5WEc0Z0lDQWdJQ0JwWmlCdFpYUm9iMlJjY2x4dUlDQWdJQ0FnSUNCdFpYUm9iMlFnYjNCMGFXOXVjMXh5WEc0Z0lDQWdJQ0JsYkhObFhISmNiaUFnSUNBZ0lDQWdiV1YwYUc5a0lEMGdUMG91Ym05a1pYTmJkR0ZuVG1GdFpWMGdiM0lnVDBvdVkyOXRjRzl1Wlc1MGMxdDBZV2RPWVcxbFhTQnZjaUJQU2k1amIyNTBjbTlzYzF0MFlXZE9ZVzFsWFNCdmNpQlBTaTVwYm5CMWRITmJkR0ZuVG1GdFpWMWNjbHh1SUNBZ0lDQWdJQ0JwWmlCdFpYUm9iMlFnSmlZZ0lXMWxkR2h2WkM1a1pXWmhkV3gwUW1Wb1lYWnBiM0pjY2x4dUlDQWdJQ0FnSUNBZ0lHMWxkR2h2WkNCdmNIUnBiMjV6TENCMGFHbHpYSEpjYmlBZ0lDQWdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQWdJQ0FnYm1WM1QwcE9iMlJsSUQwZ2JtVjNJRTV2WkdVb0tWeHlYRzRnSUNBZ0lDQWdJQ0FnYm1WM1QwcE9iMlJsTG1Wc1pXMWxiblFnUFNCdmFrTnlaV0YwWlVWc1pXMWxiblFnUUdWc1pXMWxiblFzSUhSaFowNWhiV1VzSUc5d2RHbHZibk5jY2x4dUlDQWdJQ0FnSUNBZ0lHNWxkMDlLVG05a1pWeHlYRzVjY2x4dUlDQmhaR1E2SUNodVlXMWxMQ0IyWVd4MVpTa2dMVDVjY2x4dUlDQWdJSFJvYVhOYmJtRnRaVjBnUFNCMllXeDFaVnh5WEc0Z0lDQWdJeUJ0WVd0bElITjFjbVVnZDJVZ2FHRjJaU0JoSUd4cGJtc2dZbUZqYXlCMGJ5QnZkWEp6Wld4MlpYTXNJSE52SUhkbElHTmhiaUJwYm1obGNtbDBJSFpoYkhWbGMxeHlYRzRnSUNBZ1FHVnNaVzFsYm5RdWIycFhjbUZ3Y0dWeUlEMGdkR2hwYzF4eVhHNWNjbHh1SUNCblpYUTZJQ2h1WVcxbEtTQXRQbHh5WEc0Z0lDQWdkbUZzZFdVZ1BTQjBhR2x6VzI1aGJXVmRYSEpjYmlBZ0lDQnBaaUIyWVd4MVpTQnBjeUIxYm1SbFptbHVaV1JjY2x4dUlDQWdJQ0FnY0dGeVpXNTBJRDBnUUdWc1pXMWxiblJjY2x4dUlDQWdJQ0FnZDJocGJHVWdjR0Z5Wlc1MElEMGdjR0Z5Wlc1MExuQmhjbVZ1ZEU1dlpHVmNjbHh1SUNBZ0lDQWdJQ0JwWmlCd1lYSmxiblF1YjJwWGNtRndjR1Z5WEhKY2JpQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z2NHRnlaVzUwTG05cVYzSmhjSEJsY2k1blpYUWdibUZ0WlZ4eVhHNGdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQjJZV3gxWlZ4eVhHNWNjbHh1VzF4eVhHNGdJQ2R2YmlkY2NseHVJQ0FuWlcxd2RIa25YSEpjYmlBZ0ozUmxlSFFuWEhKY2JpQWdKM0psYlc5MlpVTnNZWE56SjF4eVhHNGdJQ2RoWkdSRGJHRnpjeWRjY2x4dUlDQW5hR0Z6UTJ4aGMzTW5YSEpjYmlBZ0ozTm9iM2NuWEhKY2JpQWdKMmhwWkdVblhISmNiaUFnSjJGMGRISW5YSEpjYmlBZ0oyTnpjeWRjY2x4dUlDQW5jbVZ0YjNabEoxeHlYRzRnSUNkaGNIQmxibVFuWEhKY2JpQWdKM1poYkNkY2NseHVJQ0FuYUhSdGJDZGNjbHh1SUNBbmNISnZjQ2RjY2x4dUlDQW5kSEpwWjJkbGNpZGNjbHh1WFM1bWIzSkZZV05vS0NodFpYUm9iMlFwSUMwK1hISmNiaUFnVG05a1pTNXdjbTkwYjNSNWNHVmJiV1YwYUc5a1hTQTlJQ2dwSUMwK1hISmNiaUFnSUNCcVVYVmxjbmxYY21Gd2NHVnlJRDBnUUNSY2NseHVJQ0FnSUdwUmRXVnllVmR5WVhCd1pYSmJiV1YwYUc5a1hTNWhjSEJzZVNocVVYVmxjbmxYY21Gd2NHVnlMQ0JoY21kMWJXVnVkSE1wWEhKY2JpbGNjbHh1WEhKY2JrOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2hPYjJSbExuQnliM1J2ZEhsd1pTd2dKeVFuTEZ4eVhHNGdJR2RsZERvZ0tDa2dMVDVjY2x4dUlDQWdJR3BSZFdWeWVWZHlZWEJ3WlhJZ1BTQWtLSFJvYVhNdVpXeGxiV1Z1ZENsY2NseHVJQ0FnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaDBhR2x6TENBbkpDY3NYSEpjYmlBZ0lDQWdJSFpoYkhWbE9pQnFVWFZsY25sWGNtRndjR1Z5WEhKY2JpQWdJQ0FwWEhKY2JpQWdJQ0JxVVhWbGNubFhjbUZ3Y0dWeVhISmNiaWxjY2x4dVhISmNibHh5WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUU5S0xrNXZaR1VnUFNCT2IyUmxJbDE5IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE5vZGUsIE5vZGVGYWN0b3J5LCBPSiwgVGhpbkRPTSwgXywgZGVmYXVsdENyZWF0ZUVsZW1lbnQsIGdldE5vZGVGcm9tRmFjdG9yeSwgbWFrZSxcbiAgc2xpY2UgPSBbXS5zbGljZTtcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5UaGluRE9NID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RoaW5ET00nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RoaW5ET00nXSA6IG51bGwpO1xuXG5Ob2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XG5cbk5vZGVGYWN0b3J5ID0gKGZ1bmN0aW9uKCkge1xuICBOb2RlRmFjdG9yeS5wcm90b3R5cGUub2pOb2RlID0gbnVsbDtcblxuICBOb2RlRmFjdG9yeS5nZXQgPSBmdW5jdGlvbihpZCwgdGFnTmFtZSkge1xuICAgIHZhciBlbCwgcmV0LCB0aGluRWw7XG4gICAgaWYgKHRhZ05hbWUgPT0gbnVsbCkge1xuICAgICAgdGFnTmFtZSA9ICdkaXYnO1xuICAgIH1cbiAgICByZXQgPSBudWxsO1xuICAgIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIGlmIChlbCkge1xuICAgICAgdGhpbkVsID0gT0oucmVzdG9yZUVsZW1lbnQoZWwsIHRhZ05hbWUpO1xuICAgIH1cbiAgICBpZiAodGhpbkVsKSB7XG4gICAgICByZXQgPSBuZXcgTm9kZUZhY3RvcnkobnVsbCwgbnVsbCwgbnVsbCwgZmFsc2UsIHRoaW5FbCk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgTm9kZUZhY3RvcnkucHJvdG90eXBlLl9tYWtlQWRkID0gZnVuY3Rpb24odGFnTmFtZSwgY291bnQpIHtcbiAgICByZXR1cm4gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24ob3B0cykge1xuICAgICAgICB2YXIgbWV0aG9kLCBudTtcbiAgICAgICAgbWV0aG9kID0gT0oubm9kZXNbdGFnTmFtZV0gfHwgT0ouY29tcG9uZW50c1t0YWdOYW1lXSB8fCBPSi5jb250cm9sc1t0YWdOYW1lXSB8fCBPSi5pbnB1dHNbdGFnTmFtZV07XG4gICAgICAgIGlmIChtZXRob2QpIHtcbiAgICAgICAgICBudSA9IG1ldGhvZChvcHRzLCBfdGhpcy5vak5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG51ID0gT0ouY29tcG9uZW50KG51bGwsIF90aGlzLm9qTm9kZSwgdGFnTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51O1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgfTtcblxuICBOb2RlRmFjdG9yeS5wcm90b3R5cGUuX21ha2VVbmlxdWVJZCA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgdmFyIGlkO1xuICAgIGlmIChPSi5HRU5FUkFURV9VTklRVUVfSURTKSB7XG4gICAgICBjb3VudCArPSAxO1xuICAgICAgaWYgKGNvdW50IDw9IHRoaXMub3duZXIuY291bnQpIHtcbiAgICAgICAgY291bnQgPSB0aGlzLm93bmVyLmNvdW50ICsgMTtcbiAgICAgIH1cbiAgICAgIHRoaXMub3duZXIuY291bnQgPSBjb3VudDtcbiAgICAgIGlmICghdGhpcy5vak5vZGUuZ2V0SWQoKSkge1xuICAgICAgICBpZCA9IHRoaXMub3duZXIuZ2V0SWQoKSB8fCAnJztcbiAgICAgICAgaWQgKz0gdGhpcy5vak5vZGUudGFnTmFtZSArIGNvdW50O1xuICAgICAgICB0aGlzLm9qTm9kZS5hdHRyKCdpZCcsIGlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgTm9kZUZhY3RvcnkucHJvdG90eXBlLl9iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMub2pOb2RlKSB7XG4gICAgICByZXR1cm4gXy5mb3JPd24odGhpcy5vcHRpb25zLmV2ZW50cywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIHZhciBjYWxsYmFjaywgaXNNZXRob2Q7XG4gICAgICAgICAgaXNNZXRob2QgPSByZXF1aXJlKCcuLi90b29scy9pcycpO1xuICAgICAgICAgIGlmIChpc01ldGhvZC5tZXRob2QodmFsKSkge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIGV2ZW50O1xuICAgICAgICAgICAgICBldmVudCA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsLmFwcGx5KG51bGwsIGV2ZW50KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBfdGhpcy5vak5vZGUuJC5vbihrZXksIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIF90aGlzLm9qTm9kZS5hZGQoa2V5LCBjYWxsYmFjayk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIE5vZGVGYWN0b3J5KHRhZzEsIG9wdGlvbnMxLCBvd25lcjEsIHRoaW5Ob2RlKSB7XG4gICAgdGhpcy50YWcgPSB0YWcxO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMxO1xuICAgIHRoaXMub3duZXIgPSBvd25lcjE7XG4gICAgdGhpcy50aGluTm9kZSA9IHRoaW5Ob2RlICE9IG51bGwgPyB0aGluTm9kZSA6IG51bGw7XG4gICAgaWYgKHRoaXMudGFnICYmICF0aGlzLnRoaW5Ob2RlKSB7XG4gICAgICB0aGlzLnRoaW5Ob2RlID0gbmV3IFRoaW5ET00odGhpcy50YWcsIHRoaXMub3B0aW9ucy5wcm9wcyk7XG4gICAgICB0aGlzLnRoaW5Ob2RlLmFkZCgndGFnTmFtZScsIHRoaXMudGFnKTtcbiAgICAgIHRoaXMudGhpbk5vZGUuY3NzKHRoaXMub3B0aW9ucy5zdHlsZXMpO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy50ZXh0KSB7XG4gICAgICAgIHRoaXMudGhpbk5vZGUudGV4dCh0aGlzLm9wdGlvbnMudGV4dCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLm93bmVyKSB7XG4gICAgICB0aGlzLm1ha2UoKTtcbiAgICB9XG4gIH1cblxuICBOb2RlRmFjdG9yeS5wcm90b3R5cGUuYWRkTWFrZU1ldGhvZCA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgdmFyIG1ldGhvZHM7XG4gICAgbWV0aG9kcyA9IE9KLm9iamVjdCgpO1xuICAgIHRoaXMub2pOb2RlLm1ha2UgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih0YWdOYW1lLCBvcHRzKSB7XG4gICAgICAgIHZhciBtZXRob2Q7XG4gICAgICAgIG1ldGhvZCA9IG1ldGhvZHNbdGFnTmFtZV07XG4gICAgICAgIGlmICghbWV0aG9kKSB7XG4gICAgICAgICAgbWV0aG9kID0gX3RoaXMuX21ha2VBZGQodGFnTmFtZSwgX3RoaXMub2pOb2RlLCBjb3VudCk7XG4gICAgICAgICAgbWV0aG9kc1t0YWdOYW1lXSA9IG1ldGhvZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0aG9kKG9wdHMpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5vak5vZGU7XG4gIH07XG5cbiAgTm9kZUZhY3RvcnkucHJvdG90eXBlLm1ha2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY291bnQsIGZpbmFsaXplLCByZWY7XG4gICAgdGhpcy5vak5vZGUgPSBudWxsO1xuICAgIGlmICgocmVmID0gdGhpcy50aGluTm9kZSkgIT0gbnVsbCA/IHJlZi5pc0Z1bGx5SW5pdCA6IHZvaWQgMCkge1xuICAgICAgdGhpcy5vak5vZGUgPSB0aGlzLnRoaW5Ob2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9qTm9kZSA9IG5ldyBOb2RlKHRoaXMudGhpbk5vZGUsIHRoaXMub3duZXIpO1xuICAgICAgY291bnQgPSAodGhpcy5vd25lci5jb3VudCArIDEpIHx8IDE7XG4gICAgICBpZiAodGhpcy50aGluTm9kZS50YWdOYW1lICE9PSAnYm9keScgJiYgIXRoaXMudGhpbk5vZGUuaXNJbkRPTSAmJiAhdGhpcy5vak5vZGUuaXNJbkRPTSkge1xuICAgICAgICB0aGlzLl9tYWtlVW5pcXVlSWQoY291bnQpO1xuICAgICAgICB0aGlzLm93bmVyLmFwcGVuZCh0aGlzLm9qTm9kZVswXSk7XG4gICAgICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudGhpbk5vZGUuaXNJbkRPTSA9IHRydWU7XG4gICAgICB0aGlzLm9qTm9kZS5pc0luRE9NID0gdHJ1ZTtcbiAgICAgIHRoaXMuYWRkTWFrZU1ldGhvZChjb3VudCk7XG4gICAgICB0aGlzLm9qTm9kZS5pc0Z1bGx5SW5pdCA9IHRydWU7XG4gICAgICBmaW5hbGl6ZSA9IF8ub25jZSh0aGlzLm9qTm9kZS5maW5hbGl6ZSB8fCBPSi5ub29wKTtcbiAgICAgIHRoaXMub2pOb2RlLmZpbmFsaXplID0gZmluYWxpemU7XG4gICAgICBmaW5hbGl6ZSh0aGlzLm9qTm9kZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm9qTm9kZTtcbiAgfTtcblxuICByZXR1cm4gTm9kZUZhY3Rvcnk7XG5cbn0pKCk7XG5cbmRlZmF1bHRDcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24ocGFyZW50LCB0YWcsIG9wdGlvbnMpIHtcbiAgdmFyIGtleSwgbmV3RWxlbWVudCwgcmVmLCByZWYxLCByZWYyLCB2YWx1ZTtcbiAgbmV3RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgaWYgKG9wdGlvbnMpIHtcbiAgICByZWYgPSBvcHRpb25zLnByb3BzO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsdWUgPSByZWZba2V5XTtcbiAgICAgIG5ld0VsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICByZWYxID0gb3B0aW9ucy5ldmVudHM7XG4gICAgZm9yIChrZXkgaW4gcmVmMSkge1xuICAgICAgdmFsdWUgPSByZWYxW2tleV07XG4gICAgICAkKG5ld0VsZW1lbnQpLm9uKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICByZWYyID0gb3B0aW9ucy5zdHlsZXM7XG4gICAgZm9yIChrZXkgaW4gcmVmMikge1xuICAgICAgdmFsdWUgPSByZWYyW2tleV07XG4gICAgICAkKG5ld0VsZW1lbnQpLmNzcyhrZXksIHZhbHVlKTtcbiAgICB9XG4gICAgdmFsdWUgPSBvcHRpb25zLnRleHQ7XG4gICAgaWYgKHZhbHVlICE9PSB2b2lkIDApIHtcbiAgICAgICQobmV3RWxlbWVudCkudGV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXJlbnQgIT0gbnVsbCA/IHBhcmVudC5hcHBlbmRDaGlsZChuZXdFbGVtZW50KSA6IHZvaWQgMDtcbn07XG5cbmdldE5vZGVGcm9tRmFjdG9yeSA9IGZ1bmN0aW9uKHRhZywgb3B0aW9ucywgb3duZXIsIGlzQ2FsbGVkRnJvbUZhY3RvcnksIG5vZGUpIHtcbiAgdmFyIG5ld09KTm9kZTtcbiAgbmV3T0pOb2RlID0gbmV3IE5vZGUoKTtcbiAgaWYgKCF3aW5kb3cub2pDcmVhdGVFbGVtZW50KSB7XG4gICAgd2luZG93Lm9qQ3JlYXRlRWxlbWVudCA9IGRlZmF1bHRDcmVhdGVFbGVtZW50O1xuICB9XG4gIG5ld09KTm9kZS5lbGVtZW50ID0gb2pDcmVhdGVFbGVtZW50KG93bmVyLmVsZW1lbnQsIHRhZyB8fCAnZGl2Jywgb3B0aW9ucyk7XG4gIHJldHVybiBuZXdPSk5vZGU7XG59O1xuXG5PSi5yZWdpc3Rlcignbm9kZUZhY3RvcnknLCBnZXROb2RlRnJvbUZhY3RvcnkpO1xuXG5tYWtlID0gZnVuY3Rpb24odGFnLCBvcHRpb25zKSB7XG4gIHZhciBuZXdPSk5vZGU7XG4gIG5ld09KTm9kZSA9IG5ldyBOb2RlKCk7XG4gIG5ld09KTm9kZS5lbGVtZW50ID0gb2pDcmVhdGVFbGVtZW50KG51bGwsIHRhZyB8fCAnZGl2Jywgb3B0aW9ucyk7XG4gIHJldHVybiBuZXdPSk5vZGU7XG59O1xuXG5PSi5yZWdpc3RlcignbWFrZScsIG1ha2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5vZGVGcm9tRmFjdG9yeTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRnhrYjIxY1hHNXZaR1ZHWVdOMGIzSjVMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJRVUVzU1VGQlFTeHBSa0ZCUVR0RlFVRkJPenRCUVVGQkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUMEZCVWpzN1FVRkRUQ3hEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCUTBvc1QwRkJRU3hIUVVGVkxFOUJRVUVzUTBGQlVTeFRRVUZTT3p0QlFVTldMRWxCUVVFc1IwRkJUeXhQUVVGQkxFTkJRVkVzVVVGQlVqczdRVUVyUlVRN2QwSkJSVW9zVFVGQlFTeEhRVUZST3p0RlFVVlNMRmRCUVVNc1EwRkJRU3hIUVVGRUxFZEJRVTBzVTBGQlF5eEZRVUZFTEVWQlFVc3NUMEZCVER0QlFVTktMRkZCUVVFN08wMUJSRk1zVlVGQlZUczdTVUZEYmtJc1IwRkJRU3hIUVVGTk8wbEJRMDRzUlVGQlFTeEhRVUZMTEZGQlFWRXNRMEZCUXl4alFVRlVMRU5CUVhkQ0xFVkJRWGhDTzBsQlEwd3NTVUZCUnl4RlFVRklPMDFCUTBVc1RVRkJRU3hIUVVGVExFVkJRVVVzUTBGQlF5eGpRVUZJTEVOQlFXdENMRVZCUVd4Q0xFVkJRWE5DTEU5QlFYUkNMRVZCUkZnN08wbEJSVUVzU1VGQlJ5eE5RVUZJTzAxQlEwVXNSMEZCUVN4SFFVRlZMRWxCUVVFc1YwRkJRU3hEUVVGWkxFbEJRVm9zUlVGQmEwSXNTVUZCYkVJc1JVRkJkMElzU1VGQmVFSXNSVUZCT0VJc1MwRkJPVUlzUlVGQmNVTXNUVUZCY2tNc1JVRkVXanM3VjBGSFFUdEZRVkpKT3p0M1FrRlZUaXhSUVVGQkxFZEJRVlVzVTBGQlF5eFBRVUZFTEVWQlFWVXNTMEZCVmp0WFFVTlNMRU5CUVVFc1UwRkJRU3hMUVVGQk8yRkJRVUVzVTBGQlF5eEpRVUZFTzBGQlEwVXNXVUZCUVR0UlFVRkJMRTFCUVVFc1IwRkJVeXhGUVVGRkxFTkJRVU1zUzBGQlRTeERRVUZCTEU5QlFVRXNRMEZCVkN4SlFVRnhRaXhGUVVGRkxFTkJRVU1zVlVGQlZ5eERRVUZCTEU5QlFVRXNRMEZCYmtNc1NVRkJLME1zUlVGQlJTeERRVUZETEZGQlFWTXNRMEZCUVN4UFFVRkJMRU5CUVRORUxFbEJRWFZGTEVWQlFVVXNRMEZCUXl4TlFVRlBMRU5CUVVFc1QwRkJRVHRSUVVNeFJpeEpRVUZITEUxQlFVZzdWVUZEUlN4RlFVRkJMRWRCUVVzc1RVRkJRU3hEUVVGUExFbEJRVkFzUlVGQllTeExRVUZETEVOQlFVRXNUVUZCWkN4RlFVUlFPMU5CUVVFc1RVRkJRVHRWUVVkRkxFVkJRVUVzUjBGQlN5eEZRVUZGTEVOQlFVTXNVMEZCU0N4RFFVRmhMRWxCUVdJc1JVRkJiVUlzUzBGQlF5eERRVUZCTEUxQlFYQkNMRVZCUVRSQ0xFOUJRVFZDTEVWQlNGQTdPMlZCUzBFN1RVRlFSanRKUVVGQkxFTkJRVUVzUTBGQlFTeERRVUZCTEVsQlFVRTdSVUZFVVRzN2QwSkJWVllzWVVGQlFTeEhRVUZsTEZOQlFVTXNTMEZCUkR0QlFVTmlMRkZCUVVFN1NVRkJRU3hKUVVGSExFVkJRVVVzUTBGQlF5eHRRa0ZCVGp0TlFVTkZMRXRCUVVFc1NVRkJVenROUVVOVUxFbEJRVWNzUzBGQlFTeEpRVUZUTEVsQlFVTXNRMEZCUVN4TFFVRkxMRU5CUVVNc1MwRkJia0k3VVVGQk9FSXNTMEZCUVN4SFFVRlJMRWxCUVVNc1EwRkJRU3hMUVVGTExFTkJRVU1zUzBGQlVDeEhRVUZsTEVWQlFYSkVPenROUVVOQkxFbEJRVU1zUTBGQlFTeExRVUZMTEVOQlFVTXNTMEZCVUN4SFFVRmxPMDFCUldZc1NVRkJSeXhEUVVGSkxFbEJRVU1zUTBGQlFTeE5RVUZOTEVOQlFVTXNTMEZCVWl4RFFVRkJMRU5CUVZBN1VVRkRSU3hGUVVGQkxFZEJRVXNzU1VGQlF5eERRVUZCTEV0QlFVc3NRMEZCUXl4TFFVRlFMRU5CUVVFc1EwRkJRU3hKUVVGclFqdFJRVU4yUWl4RlFVRkJMRWxCUVUwc1NVRkJReXhEUVVGQkxFMUJRVTBzUTBGQlF5eFBRVUZTTEVkQlFXdENPMUZCUTNoQ0xFbEJRVU1zUTBGQlFTeE5RVUZOTEVOQlFVTXNTVUZCVWl4RFFVRmhMRWxCUVdJc1JVRkJiVUlzUlVGQmJrSXNSVUZJUmp0UFFVeEdPenRGUVVSaE96dDNRa0ZaWml4WFFVRkJMRWRCUVdFc1UwRkJRVHRKUVVOWUxFbEJRVWNzU1VGQlF5eERRVUZCTEUxQlFVbzdZVUZCWjBJc1EwRkJReXhEUVVGRExFMUJRVVlzUTBGQlV5eEpRVUZETEVOQlFVRXNUMEZCVHl4RFFVRkRMRTFCUVd4Q0xFVkJRVEJDTEVOQlFVRXNVMEZCUVN4TFFVRkJPMlZCUVVFc1UwRkJReXhIUVVGRUxFVkJRVTBzUjBGQlRqdEJRVU40UXl4alFVRkJPMVZCUVVFc1VVRkJRU3hIUVVGWExFOUJRVUVzUTBGQlVTeGhRVUZTTzFWQlExZ3NTVUZCUnl4UlFVRlJMRU5CUVVNc1RVRkJWQ3hEUVVGblFpeEhRVUZvUWl4RFFVRklPMWxCUTBVc1VVRkJRU3hIUVVGWExGTkJRVUU3UVVGQll5eHJRa0ZCUVR0alFVRmlPM0ZDUVVGaExFZEJRVUVzWVVGQlNTeExRVUZLTzFsQlFXUTdXVUZEV0N4TFFVRkRMRU5CUVVFc1RVRkJUU3hEUVVGRExFTkJRVU1zUTBGQlF5eEZRVUZXTEVOQlFXRXNSMEZCWWl4RlFVRnJRaXhSUVVGc1FqdFpRVU5CTEV0QlFVTXNRMEZCUVN4TlFVRk5MRU5CUVVNc1IwRkJVaXhEUVVGWkxFZEJRVm9zUlVGQmFVSXNVVUZCYWtJN2JVSkJRMEVzUzBGS1JqczdVVUZHZDBNN1RVRkJRU3hEUVVGQkxFTkJRVUVzUTBGQlFTeEpRVUZCTEVOQlFURkNMRVZCUVdoQ096dEZRVVJYT3p0RlFWTkJMSEZDUVVGRExFbEJRVVFzUlVGQlR5eFJRVUZRTEVWQlFXbENMRTFCUVdwQ0xFVkJRWGxDTEZGQlFYcENPMGxCUVVNc1NVRkJReXhEUVVGQkxFMUJRVVE3U1VGQlRTeEpRVUZETEVOQlFVRXNWVUZCUkR0SlFVRlZMRWxCUVVNc1EwRkJRU3hSUVVGRU8wbEJRVkVzU1VGQlF5eERRVUZCTERoQ1FVRkVMRmRCUVZrN1NVRkRhRVFzU1VGQlJ5eEpRVUZETEVOQlFVRXNSMEZCUkN4SlFVRlRMRU5CUVVrc1NVRkJReXhEUVVGQkxGRkJRV3BDTzAxQlEwVXNTVUZCUXl4RFFVRkJMRkZCUVVRc1IwRkJaMElzU1VGQlFTeFBRVUZCTEVOQlFWRXNTVUZCUXl4RFFVRkJMRWRCUVZRc1JVRkJZeXhKUVVGRExFTkJRVUVzVDBGQlR5eERRVUZETEV0QlFYWkNPMDFCUTJoQ0xFbEJRVU1zUTBGQlFTeFJRVUZSTEVOQlFVTXNSMEZCVml4RFFVRmpMRk5CUVdRc1JVRkJlVUlzU1VGQlF5eERRVUZCTEVkQlFURkNPMDFCUTBFc1NVRkJReXhEUVVGQkxGRkJRVkVzUTBGQlF5eEhRVUZXTEVOQlFXTXNTVUZCUXl4RFFVRkJMRTlCUVU4c1EwRkJReXhOUVVGMlFqdE5RVU5CTEVsQlFVY3NTVUZCUXl4RFFVRkJMRTlCUVU4c1EwRkJReXhKUVVGYU8xRkJRWE5DTEVsQlFVTXNRMEZCUVN4UlFVRlJMRU5CUVVNc1NVRkJWaXhEUVVGbExFbEJRVU1zUTBGQlFTeFBRVUZQTEVOQlFVTXNTVUZCZUVJc1JVRkJkRUk3VDBGS1JqczdTVUZOUVN4SlFVRkhMRWxCUVVNc1EwRkJRU3hMUVVGS08wMUJRMFVzU1VGQlF5eERRVUZCTEVsQlFVUXNRMEZCUVN4RlFVUkdPenRGUVZCWE96dDNRa0ZWWWl4aFFVRkJMRWRCUVdVc1UwRkJReXhMUVVGRU8wRkJRMklzVVVGQlFUdEpRVUZCTEU5QlFVRXNSMEZCVlN4RlFVRkZMRU5CUVVNc1RVRkJTQ3hEUVVGQk8wbEJRMVlzU1VGQlF5eERRVUZCTEUxQlFVMHNRMEZCUXl4SlFVRlNMRWRCUVdVc1EwRkJRU3hUUVVGQkxFdEJRVUU3WVVGQlFTeFRRVUZETEU5QlFVUXNSVUZCVlN4SlFVRldPMEZCUTJJc1dVRkJRVHRSUVVGQkxFMUJRVUVzUjBGQlV5eFBRVUZSTEVOQlFVRXNUMEZCUVR0UlFVTnFRaXhKUVVGSExFTkJRVWtzVFVGQlVEdFZRVU5GTEUxQlFVRXNSMEZCVXl4TFFVRkRMRU5CUVVFc1VVRkJSQ3hEUVVGVkxFOUJRVllzUlVGQmJVSXNTMEZCUXl4RFFVRkJMRTFCUVhCQ0xFVkJRVFJDTEV0QlFUVkNPMVZCUTFRc1QwRkJVU3hEUVVGQkxFOUJRVUVzUTBGQlVpeEhRVUZ0UWl4UFFVWnlRanM3WlVGSFFTeE5RVUZCTEVOQlFVOHNTVUZCVUR0TlFVeGhPMGxCUVVFc1EwRkJRU3hEUVVGQkxFTkJRVUVzU1VGQlFUdFhRVTFtTEVsQlFVTXNRMEZCUVR0RlFWSlpPenQzUWtGVlppeEpRVUZCTEVkQlFVMHNVMEZCUVR0QlFVVktMRkZCUVVFN1NVRkJRU3hKUVVGRExFTkJRVUVzVFVGQlJDeEhRVUZWTzBsQlJWWXNkVU5CUVZrc1EwRkJSU3h2UWtGQlpEdE5RVUVyUWl4SlFVRkRMRU5CUVVFc1RVRkJSQ3hIUVVGVkxFbEJRVU1zUTBGQlFTeFRRVUV4UXp0TFFVRkJMRTFCUVVFN1RVRlBSU3hKUVVGRExFTkJRVUVzVFVGQlJDeEhRVUZqTEVsQlFVRXNTVUZCUVN4RFFVRkxMRWxCUVVNc1EwRkJRU3hSUVVGT0xFVkJRV2RDTEVsQlFVTXNRMEZCUVN4TFFVRnFRanROUVVOa0xFdEJRVUVzUjBGQlVTeERRVUZETEVsQlFVTXNRMEZCUVN4TFFVRkxMRU5CUVVNc1MwRkJVQ3hIUVVGbExFTkJRV2hDTEVOQlFVRXNTVUZCYzBJN1RVRkhPVUlzU1VGQlJ5eEpRVUZETEVOQlFVRXNVVUZCVVN4RFFVRkRMRTlCUVZZc1MwRkJkVUlzVFVGQmRrSXNTVUZCYTBNc1EwRkJTU3hKUVVGRExFTkJRVUVzVVVGQlVTeERRVUZETEU5QlFXaEVMRWxCUVRSRUxFTkJRVWtzU1VGQlF5eERRVUZCTEUxQlFVMHNRMEZCUXl4UFFVRXpSVHRSUVVORkxFbEJRVU1zUTBGQlFTeGhRVUZFTEVOQlFXVXNTMEZCWmp0UlFVTkJMRWxCUVVNc1EwRkJRU3hMUVVGTExFTkJRVU1zVFVGQlVDeERRVUZqTEVsQlFVTXNRMEZCUVN4TlFVRlBMRU5CUVVFc1EwRkJRU3hEUVVGMFFqdFJRVVZCTEVsQlFVTXNRMEZCUVN4WFFVRkVMRU5CUVVFc1JVRktSanM3VFVGTlFTeEpRVUZETEVOQlFVRXNVVUZCVVN4RFFVRkRMRTlCUVZZc1IwRkJiMEk3VFVGRGNFSXNTVUZCUXl4RFFVRkJMRTFCUVUwc1EwRkJReXhQUVVGU0xFZEJRV3RDTzAxQlIyeENMRWxCUVVNc1EwRkJRU3hoUVVGRUxFTkJRV1VzUzBGQlpqdE5RVWRCTEVsQlFVTXNRMEZCUVN4TlFVRk5MRU5CUVVNc1YwRkJVaXhIUVVGelFqdE5RVWQwUWl4UlFVRkJMRWRCUVZjc1EwRkJReXhEUVVGRExFbEJRVVlzUTBGQlR5eEpRVUZETEVOQlFVRXNUVUZCVFN4RFFVRkRMRkZCUVZJc1NVRkJiMElzUlVGQlJTeERRVUZETEVsQlFUbENPMDFCUTFnc1NVRkJReXhEUVVGQkxFMUJRVTBzUTBGQlF5eFJRVUZTTEVkQlFXMUNPMDFCUTI1Q0xGRkJRVUVzUTBGQlV5eEpRVUZETEVOQlFVRXNUVUZCVml4RlFUZENSanM3VjBFclFrRXNTVUZCUXl4RFFVRkJPMFZCYmtOSE96czdPenM3UVVGeFExSXNiMEpCUVVFc1IwRkJkVUlzVTBGQlF5eE5RVUZFTEVWQlFWTXNSMEZCVkN4RlFVRmpMRTlCUVdRN1FVRkRja0lzVFVGQlFUdEZRVUZCTEZWQlFVRXNSMEZCWVN4UlFVRlJMRU5CUVVNc1lVRkJWQ3hEUVVGMVFpeEhRVUYyUWp0RlFVTmlMRWxCUVVjc1QwRkJTRHRCUVVORk8wRkJRVUVzVTBGQlFTeFZRVUZCT3p0TlFVTkZMRlZCUVZVc1EwRkJReXhaUVVGWUxFTkJRWGRDTEVkQlFYaENMRVZCUVRaQ0xFdEJRVGRDTzBGQlJFWTdRVUZGUVR0QlFVRkJMRk5CUVVFc1YwRkJRVHM3VFVGRFJTeERRVUZCTEVOQlFVVXNWVUZCUml4RFFVRmhMRU5CUVVNc1JVRkJaQ3hEUVVGcFFpeEhRVUZxUWl4RlFVRnpRaXhMUVVGMFFqdEJRVVJHTzBGQlJVRTdRVUZCUVN4VFFVRkJMRmRCUVVFN08wMUJRMFVzUTBGQlFTeERRVUZGTEZWQlFVWXNRMEZCWVN4RFFVRkRMRWRCUVdRc1EwRkJhMElzUjBGQmJFSXNSVUZCZFVJc1MwRkJka0k3UVVGRVJqdEpRVVZCTEV0QlFVRXNSMEZCVVN4UFFVRlBMRU5CUVVNN1NVRkRhRUlzU1VGQlJ5eExRVUZCTEV0QlFWY3NUVUZCWkR0TlFVTkZMRU5CUVVFc1EwRkJSU3hWUVVGR0xFTkJRV0VzUTBGQlF5eEpRVUZrTEVOQlFXMUNMRXRCUVc1Q0xFVkJSRVk3UzBGU1JqczdNRUpCVlVFc1RVRkJUU3hEUVVGRkxGZEJRVklzUTBGQmIwSXNWVUZCY0VJN1FVRmFjVUk3TzBGQlkzWkNMR3RDUVVGQkxFZEJRWEZDTEZOQlFVTXNSMEZCUkN4RlFVRk5MRTlCUVU0c1JVRkJaU3hMUVVGbUxFVkJRWE5DTEcxQ1FVRjBRaXhGUVVFeVF5eEpRVUV6UXp0QlFVTnVRaXhOUVVGQk8wVkJRVUVzVTBGQlFTeEhRVUZuUWl4SlFVRkJMRWxCUVVFc1EwRkJRVHRGUVVOb1FpeEpRVUZITEVOQlFVTXNUVUZCVFN4RFFVRkRMR1ZCUVZnN1NVRkRSU3hOUVVGTkxFTkJRVU1zWlVGQlVDeEhRVUY1UWl4eFFrRkVNMEk3TzBWQlJVRXNVMEZCVXl4RFFVRkRMRTlCUVZZc1IwRkJiMElzWlVGQlFTeERRVUZuUWl4TFFVRkxMRU5CUVVNc1QwRkJkRUlzUlVGQkswSXNSMEZCUVN4SlFVRlBMRXRCUVhSRExFVkJRVFpETEU5QlFUZERPMU5CUTNCQ08wRkJURzFDT3p0QlFVOXlRaXhGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEdGQlFWb3NSVUZCTWtJc2EwSkJRVE5DT3p0QlFVVkJMRWxCUVVFc1IwRkJUeXhUUVVGRExFZEJRVVFzUlVGQlRTeFBRVUZPTzBGQlEwd3NUVUZCUVR0RlFVRkJMRk5CUVVFc1IwRkJaMElzU1VGQlFTeEpRVUZCTEVOQlFVRTdSVUZEYUVJc1UwRkJVeXhEUVVGRExFOUJRVllzUjBGQmIwSXNaVUZCUVN4RFFVRm5RaXhKUVVGb1FpeEZRVUZ6UWl4SFFVRkJMRWxCUVU4c1MwRkJOMElzUlVGQmIwTXNUMEZCY0VNN1UwRkRjRUk3UVVGSVN6czdRVUZMVUN4RlFVRkZMRU5CUVVNc1VVRkJTQ3hEUVVGWkxFMUJRVm9zUlVGQmIwSXNTVUZCY0VJN08wRkJTVUVzVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJaUxDSm1hV3hsSWpvaVoyVnVaWEpoZEdWa0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJazlLSUQwZ2NtVnhkV2x5WlNBbkxpNHZiMm9uWEhKY2JsOGdQU0J5WlhGMWFYSmxJQ2RzYjJSaGMyZ25YSEpjYmxSb2FXNUVUMDBnUFNCeVpYRjFhWEpsSUNkMGFHbHVaRzl0SjF4eVhHNU9iMlJsSUQwZ2NtVnhkV2x5WlNBbkxpOXViMlJsSjF4eVhHNWNjbHh1STJOc2IzTmxaQ0E5SUNkaElHRmlZbklnWVdOeWIyNTViU0JoWkdSeVpYTnpJR0Z3Y0d4bGRDQmhjblJwWTJ4bElHRnphV1JsSUdGMVpHbHZJR0lnWW1SdklHSnBaeUJpYkc5amEzRjFiM1JsSUdKdlpIa2dZblYwZEc5dUlHTmhiblpoY3lCallYQjBhVzl1SUdObGJuUmxjaUJqYVhSbElHTnZaR1VnWTI5c1ozSnZkWEFnWTI5dGJXRnVaQ0JrWVhSaGJHbHpkQ0JrWkNCa1pXd2daR1YwWVdsc2N5QmtabTRnWkdseUlHUnBkaUJrYkNCa2RDQmxiU0JsYldKbFpDQm1hV1ZzWkhObGRDQm1hV2RqWVhCMGFXOXVJR1pwWjNWeVpTQm1iMjUwSUdadmIzUmxjaUJtYjNKdElHWnlZVzFsYzJWMElHZ3hJR2d5SUdneklHZzBJR2cxSUdnMklHaGxZV1FnYUdWaFpHVnlJR2huY205MWNDQm9kRzFzSUdrZ2FXWnlZVzFsSUdsdWN5QnJaWGxuWlc0Z2EySmtJR3hoWW1Wc0lHeGxaMlZ1WkNCc2FTQnRZWEFnYldGeWF5QnRaVzUxSUcxbGRHVnlJRzVoZGlCdWIyWnlZVzFsY3lCdWIzTmpjbWx3ZENCdlltcGxZM1FnYjJ3Z2IzQjBaM0p2ZFhBZ2IzQjBhVzl1SUc5MWRIQjFkQ0J3SUhCeVpTQndjbTluY21WemN5QnhJSEp3SUhKMElISjFZbmtnY3lCellXMXdJSE5qY21sd2RDQnpaV04wYVc5dUlITmxiR1ZqZENCemJXRnNiQ0J6YjNWeVkyVWdjM0JoYmlCemRISnBhMlVnYzNSeWIyNW5JSE4wZVd4bElITjFZaUJ6ZFcxdFlYSjVJSE4xY0NCMFlXSnNaU0IwWW05a2VTQjBaQ0IwWlhoMFlYSmxZU0IwWm05dmRDQjBhQ0IwYUdWaFpDQjBhVzFsSUhScGRHeGxJSFJ5SUhSMElIVWdkV3dnZG1GeUlIWnBaR1Z2SUhkaWNpQjRiWEFuTG5Od2JHbDBJQ2NnSjF4eVhHNGpiM0JsYmlBOUlDZGhjbVZoSUdKaGMyVWdZbklnWTI5c0lHTnZiVzFoYm1RZ1kzTnpJQ0ZFVDBOVVdWQkZJR1Z0WW1Wa0lHaHlJR2x0WnlCcGJuQjFkQ0JyWlhsblpXNGdiR2x1YXlCdFpYUmhJSEJoY21GdElITnZkWEpqWlNCMGNtRmpheUIzWW5JbkxuTndiR2wwSUNjZ0oxeHlYRzRqWEhKY2JpTnVaWE4wWVdKc1pVNXZaR1ZPWVcxbGN5QTlJRnRjY2x4dUl5QWdKMlJwZGlkY2NseHVJeUFnSjNOd1lXNG5YSEpjYmlNZ0lDZG9NU2RjY2x4dUl5QWdKMmd5SjF4eVhHNGpJQ0FuYURNblhISmNiaU1nSUNkb05DZGNjbHh1SXlBZ0oyZzFKMXh5WEc0aklDQW5hRFluWEhKY2JpTWdJQ2R3SjF4eVhHNGpJQ0FuWm1sbGJHUnpaWFFuWEhKY2JpTWdJQ2R6Wld4bFkzUW5YSEpjYmlNZ0lDZHZiQ2RjY2x4dUl5QWdKM1ZzSjF4eVhHNGpJQ0FuZEdGaWJHVW5YSEpjYmlOZFhISmNiaU5jY2x4dUl5TlVhR2x6SUd4cGMzUWdhWE1nYm05MElIbGxkQ0JsZUdoaGRYTjBhWFpsTENCcWRYTjBJR1Y0WTJ4MVpHVWdkR2hsSUc5aWRtbHZkWE5jY2x4dUkyNXZiazVsYzNSaFlteGxUbTlrWlhNZ1BTQmJYSEpjYmlNZ0lDZHNhU2RjY2x4dUl5QWdKMnhsWjJWdVpDZGNjbHh1SXlBZ0ozUnlKMXh5WEc0aklDQW5kR1FuWEhKY2JpTWdJQ2R2Y0hScGIyNG5YSEpjYmlNZ0lDZGliMlI1SjF4eVhHNGpJQ0FuYUdWaFpDZGNjbHh1SXlBZ0ozTnZkWEpqWlNkY2NseHVJeUFnSjNSaWIyUjVKMXh5WEc0aklDQW5kR1p2YjNRblhISmNiaU1nSUNkMGFHVmhaQ2RjY2x4dUl5QWdKMnhwYm1zblhISmNiaU1nSUNkelkzSnBjSFFuWEhKY2JpTmRYSEpjYmlOY2NseHVJMjV2WkdWT1lXMWxjeUE5SUZ0Y2NseHVJeUFnSjJFblhISmNiaU1nSUNkaUoxeHlYRzRqSUNBblluSW5YSEpjYmlNZ0lDZGlkWFIwYjI0blhISmNiaU1nSUNka2FYWW5YSEpjYmlNZ0lDZGxiU2RjY2x4dUl5QWdKMlpwWld4a2MyVjBKMXh5WEc0aklDQW5abTl5YlNkY2NseHVJeUFnSjJneEoxeHlYRzRqSUNBbmFESW5YSEpjYmlNZ0lDZG9NeWRjY2x4dUl5QWdKMmcwSjF4eVhHNGpJQ0FuYURVblhISmNiaU1nSUNkb05pZGNjbHh1SXlBZ0oya25YSEpjYmlNZ0lDZHBiV2NuWEhKY2JpTWdJQ2RwYm5CMWRDZGNjbHh1SXlBZ0oyeGhZbVZzSjF4eVhHNGpJQ0FuYkdWblpXNWtKMXh5WEc0aklDQW5iR2tuWEhKY2JpTWdJQ2R1WVhZblhISmNiaU1nSUNkdmJDZGNjbHh1SXlBZ0oyOXdkR2x2YmlkY2NseHVJeUFnSjNBblhISmNiaU1nSUNkelpXeGxZM1FuWEhKY2JpTWdJQ2R6Y0dGdUoxeHlYRzRqSUNBbmMzUnliMjVuSjF4eVhHNGpJQ0FuYzNWd0oxeHlYRzRqSUNBbmMzWm5KMXh5WEc0aklDQW5kR0ZpYkdVblhISmNiaU1nSUNkMFltOWtlU2RjY2x4dUl5QWdKM1JrSjF4eVhHNGpJQ0FuZEdWNGRHRnlaV0VuWEhKY2JpTWdJQ2QwYUNkY2NseHVJeUFnSjNSb1pXRmtKMXh5WEc0aklDQW5kSEluWEhKY2JpTWdJQ2QxYkNkY2NseHVJMTFjY2x4dVhISmNibU5zWVhOeklFNXZaR1ZHWVdOMGIzSjVYSEpjYmlBZ1hISmNiaUFnYjJwT2IyUmxPaUJ1ZFd4c1hISmNiaUFnWEhKY2JpQWdRR2RsZERvZ0tHbGtMQ0IwWVdkT1lXMWxJRDBnSjJScGRpY3BJQzArWEhKY2JpQWdJQ0J5WlhRZ1BTQnVkV3hzWEhKY2JpQWdJQ0JsYkNBOUlHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrSUdsa1hISmNiaUFnSUNCcFppQmxiRnh5WEc0Z0lDQWdJQ0IwYUdsdVJXd2dQU0JQU2k1eVpYTjBiM0psUld4bGJXVnVkQ0JsYkN3Z2RHRm5UbUZ0WlZ4eVhHNGdJQ0FnYVdZZ2RHaHBia1ZzWEhKY2JpQWdJQ0FnSUhKbGRDQTlJRzVsZHlCT2IyUmxSbUZqZEc5eWVTQnVkV3hzTENCdWRXeHNMQ0J1ZFd4c0xDQm1ZV3h6WlN3Z2RHaHBia1ZzWEhKY2JseHlYRzRnSUNBZ2NtVjBYSEpjYmlBZ1hISmNiaUFnWDIxaGEyVkJaR1E2SUNoMFlXZE9ZVzFsTENCamIzVnVkQ2tnTFQ1Y2NseHVJQ0FnSUNodmNIUnpLU0E5UGx4eVhHNGdJQ0FnSUNCdFpYUm9iMlFnUFNCUFNpNXViMlJsYzF0MFlXZE9ZVzFsWFNCdmNpQlBTaTVqYjIxd2IyNWxiblJ6VzNSaFowNWhiV1ZkSUc5eUlFOUtMbU52Ym5SeWIyeHpXM1JoWjA1aGJXVmRJRzl5SUU5S0xtbHVjSFYwYzF0MFlXZE9ZVzFsWFZ4eVhHNGdJQ0FnSUNCcFppQnRaWFJvYjJSY2NseHVJQ0FnSUNBZ0lDQnVkU0E5SUcxbGRHaHZaQ0J2Y0hSekxDQkFiMnBPYjJSbFhISmNiaUFnSUNBZ0lHVnNjMlZjY2x4dUlDQWdJQ0FnSUNCdWRTQTlJRTlLTG1OdmJYQnZibVZ1ZENCdWRXeHNMQ0JBYjJwT2IyUmxMQ0IwWVdkT1lXMWxYSEpjYmlBZ0lDQWdJQ055WlhRZ1BTQnVaWGNnVG05a1pVWmhZM1J2Y25rZ2JuVXNJRUIwYUdsdVRtOWtaU3dnWTI5MWJuUmNjbHh1SUNBZ0lDQWdiblZjY2x4dUlDQmNjbHh1SUNCZmJXRnJaVlZ1YVhGMVpVbGtPaUFvWTI5MWJuUXBJQzArWEhKY2JpQWdJQ0JwWmlCUFNpNUhSVTVGVWtGVVJWOVZUa2xSVlVWZlNVUlRYSEpjYmlBZ0lDQWdJR052ZFc1MElDczlJREZjY2x4dUlDQWdJQ0FnYVdZZ1kyOTFiblFnUEQwZ1FHOTNibVZ5TG1OdmRXNTBJSFJvWlc0Z1kyOTFiblFnUFNCQWIzZHVaWEl1WTI5MWJuUWdLeUF4WEhKY2JpQWdJQ0FnSUVCdmQyNWxjaTVqYjNWdWRDQTlJR052ZFc1MFhISmNibHh5WEc0Z0lDQWdJQ0JwWmlCdWIzUWdRRzlxVG05a1pTNW5aWFJKWkNncFhISmNiaUFnSUNBZ0lDQWdhV1FnUFNCQWIzZHVaWEl1WjJWMFNXUW9LU0J2Y2lBbkoxeHlYRzRnSUNBZ0lDQWdJR2xrSUNzOUlFQnZhazV2WkdVdWRHRm5UbUZ0WlNBcklHTnZkVzUwWEhKY2JpQWdJQ0FnSUNBZ1FHOXFUbTlrWlM1aGRIUnlJQ2RwWkNjc0lHbGtYSEpjYmlBZ0lDQnlaWFIxY201Y2NseHVJQ0JjY2x4dUlDQmZZbWx1WkVWMlpXNTBjem9nTFQ1Y2NseHVJQ0FnSUdsbUlFQnZhazV2WkdVZ2RHaGxiaUJmTG1admNrOTNiaUJBYjNCMGFXOXVjeTVsZG1WdWRITXNJQ2gyWVd3c0lHdGxlU2tnUFQ1Y2NseHVJQ0FnSUNBZ2FYTk5aWFJvYjJRZ1BTQnlaWEYxYVhKbElDY3VMaTkwYjI5c2N5OXBjeWRjY2x4dUlDQWdJQ0FnYVdZZ2FYTk5aWFJvYjJRdWJXVjBhRzlrSUhaaGJGeHlYRzRnSUNBZ0lDQWdJR05oYkd4aVlXTnJJRDBnS0dWMlpXNTBMaTR1S1NBdFBpQjJZV3dnWlhabGJuUXVMaTVjY2x4dUlDQWdJQ0FnSUNCQWIycE9iMlJsTGlRdWIyNGdhMlY1TENCallXeHNZbUZqYTF4eVhHNGdJQ0FnSUNBZ0lFQnZhazV2WkdVdVlXUmtJR3RsZVN3Z1kyRnNiR0poWTJ0Y2NseHVJQ0FnSUNBZ0lDQnVkV3hzWEhKY2JpQWdYSEpjYmlBZ1kyOXVjM1J5ZFdOMGIzSTZJQ2hBZEdGbkxDQkFiM0IwYVc5dWN5d2dRRzkzYm1WeUxDQkFkR2hwYms1dlpHVWdQU0J1ZFd4c0tTQXRQbHh5WEc0Z0lDQWdhV1lnUUhSaFp5QmhibVFnYm05MElFQjBhR2x1VG05a1pWeHlYRzRnSUNBZ0lDQkFkR2hwYms1dlpHVWdQU0J1WlhjZ1ZHaHBia1JQVFNCQWRHRm5MQ0JBYjNCMGFXOXVjeTV3Y205d2MxeHlYRzRnSUNBZ0lDQkFkR2hwYms1dlpHVXVZV1JrSUNkMFlXZE9ZVzFsSnl3Z1FIUmhaMXh5WEc0Z0lDQWdJQ0JBZEdocGJrNXZaR1V1WTNOeklFQnZjSFJwYjI1ekxuTjBlV3hsYzF4eVhHNGdJQ0FnSUNCcFppQkFiM0IwYVc5dWN5NTBaWGgwSUhSb1pXNGdRSFJvYVc1T2IyUmxMblJsZUhRZ1FHOXdkR2x2Ym5NdWRHVjRkRnh5WEc0Z0lDQWdYSEpjYmlBZ0lDQnBaaUJBYjNkdVpYSmNjbHh1SUNBZ0lDQWdRRzFoYTJVb0tWeHlYRzRnSUZ4eVhHNGdJR0ZrWkUxaGEyVk5aWFJvYjJRNklDaGpiM1Z1ZENrZ0xUNWNjbHh1SUNBZ0lHMWxkR2h2WkhNZ1BTQlBTaTV2WW1wbFkzUW9LVnh5WEc0Z0lDQWdRRzlxVG05a1pTNXRZV3RsSUQwZ0tIUmhaMDVoYldVc0lHOXdkSE1wSUQwK1hISmNiaUFnSUNBZ0lHMWxkR2h2WkNBOUlHMWxkR2h2WkhOYmRHRm5UbUZ0WlYxY2NseHVJQ0FnSUNBZ2FXWWdibTkwSUcxbGRHaHZaRnh5WEc0Z0lDQWdJQ0FnSUcxbGRHaHZaQ0E5SUVCZmJXRnJaVUZrWkNCMFlXZE9ZVzFsTENCQWIycE9iMlJsTENCamIzVnVkRnh5WEc0Z0lDQWdJQ0FnSUcxbGRHaHZaSE5iZEdGblRtRnRaVjBnUFNCdFpYUm9iMlJjY2x4dUlDQWdJQ0FnYldWMGFHOWtJRzl3ZEhOY2NseHVJQ0FnSUVCdmFrNXZaR1ZjY2x4dVhISmNiaUFnYldGclpUb2dMVDVjY2x4dVhISmNiaUFnSUNCQWIycE9iMlJsSUQwZ2JuVnNiRnh5WEc1Y2NseHVJQ0FnSUdsbUlFQjBhR2x1VG05a1pUOHVhWE5HZFd4c2VVbHVhWFFnZEdobGJpQkFiMnBPYjJSbElEMGdRSFJvYVc1T2IyUmxYSEpjYmlBZ1hISmNiaUFnSUNBaklESTZJRWxtSUhSb1pTQmxiR1Z0Wlc1MElHaGhjeUJ1WlhabGNpQmlaV1Z1SUdsdWFYUnBZV3hwZW1Wa0xDQmpiMjUwYVc1MVpWeHlYRzRnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0FqSURNNklFRnpJR3h2Ym1jZ1lYTWdkR2hsSUdWc1pXMWxiblFnYVhOdUozUWdkR2hsSUdKdlpIa2dibTlrWlN3Z1kyOXVkR2x1ZFdWY2NseHVJQ0FnSUNBZ0l5QnBaaUJsYkM1MFlXZE9ZVzFsSUdsemJuUWdKMkp2WkhrblhISmNiaUFnSUNBZ0lDTWdORG9nUlhoMFpXNWtJSFJvWlNCbGJHVnRaVzUwSUhkcGRHZ2djM1JoYm1SaGNtUWdhbEYxWlhKNUlFRlFTU0J0WlhSb2IyUnpYSEpjYmlBZ0lDQWdJRUJ2YWs1dlpHVWdQU0J1WlhjZ1RtOWtaU0JBZEdocGJrNXZaR1VzSUVCdmQyNWxjbHh5WEc0Z0lDQWdJQ0JqYjNWdWRDQTlJQ2hBYjNkdVpYSXVZMjkxYm5RZ0t5QXhLU0I4ZkNBeFhISmNiaUFnSUNBZ0lDTWdOVG9nU1dZZ2RHaGxJRzV2WkdVZ2FYTnVKM1FnYVc0Z2RHaGxJRVJQVFN3Z1lYQndaVzVrSUdsMElIUnZJSFJvWlNCd1lYSmxiblJjY2x4dUlDQWdJQ0FnSXlCVWFHbHpJR0ZzYzI4Z1lXTmpiMjF0YjJSaGRHVnpJR1J2WTNWdFpXNTBJR1p5WVdkdFpXNTBjeXdnZDJocFkyZ2dZWEpsSUc1dmRDQnBiaUIwYUdVZ1JFOU5JR0oxZENCaGNtVWdjSEpsYzNWdFpXUWdkRzhnWW1VZ2MyOTFibVFnZFc1MGFXd2djbVZoWkhrZ1ptOXlJRzFoYm5WaGJDQnBibk5sY25ScGIyNWNjbHh1SUNBZ0lDQWdhV1lnUUhSb2FXNU9iMlJsTG5SaFowNWhiV1VnYVhOdWRDQW5ZbTlrZVNjZ1lXNWtJRzV2ZENCQWRHaHBiazV2WkdVdWFYTkpia1JQVFNCaGJtUWdibTkwSUVCdmFrNXZaR1V1YVhOSmJrUlBUVnh5WEc0Z0lDQWdJQ0FnSUVCZmJXRnJaVlZ1YVhGMVpVbGtJR052ZFc1MFhISmNiaUFnSUNBZ0lDQWdRRzkzYm1WeUxtRndjR1Z1WkNCQWIycE9iMlJsV3pCZFhISmNiaUFnSUNBZ0lDQWdJeUEyT2lCQ2FXNWtJR0Z1ZVNCa1pXWnBibVZrSUdWMlpXNTBjeUJoWm5SbGNpQjBhR1VnYm05a1pTQnBjeUJwYmlCMGFHVWdSRTlOWEhKY2JpQWdJQ0FnSUNBZ1FGOWlhVzVrUlhabGJuUnpLQ2xjY2x4dUlDQWdJQ0FnSUNCY2NseHVJQ0FnSUNBZ1FIUm9hVzVPYjJSbExtbHpTVzVFVDAwZ1BTQjBjblZsWEhKY2JpQWdJQ0FnSUVCdmFrNXZaR1V1YVhOSmJrUlBUU0E5SUhSeWRXVmNjbHh1WEhKY2JpQWdJQ0FnSUNNZ056b2dRM0psWVhSbElIUm9aU0JoYkd3Z2FXMXdiM0owWVc1MElDZHRZV3RsSnlCdFpYUm9iMlJjY2x4dUlDQWdJQ0FnUUdGa1pFMWhhMlZOWlhSb2IyUWdZMjkxYm5SY2NseHVYSEpjYmlBZ0lDQWdJQ01nT0RvZ1VISmxkbVZ1ZENCa2RYQnNhV05oZEdVZ1ptRmpkRzl5ZVNCbGVIUmxibk5wYjI0Z1lua2djMlYwZEdsdVp5QnBjeUJwYm1sMElEMGdkSEoxWlZ4eVhHNGdJQ0FnSUNCQWIycE9iMlJsTG1selJuVnNiSGxKYm1sMElEMGdkSEoxWlZ4eVhHNWNjbHh1SUNBZ0lDQWdJeUE1T2lCcFppQjBhR1VnYm05a1pTQnpkWEJ3YjNKMGN5QnBkQ3dnWTJGc2JDQm1hVzVoYkdsNlpWeHlYRzRnSUNBZ0lDQm1hVzVoYkdsNlpTQTlJRjh1YjI1alpTQkFiMnBPYjJSbExtWnBibUZzYVhwbElHOXlJRTlLTG01dmIzQmNjbHh1SUNBZ0lDQWdRRzlxVG05a1pTNW1hVzVoYkdsNlpTQTlJR1pwYm1Gc2FYcGxYSEpjYmlBZ0lDQWdJR1pwYm1Gc2FYcGxJRUJ2YWs1dlpHVmNjbHh1SUNBZ0lDTWdNVEE2SUZKbGRIVnliaUIwYUdVZ1pYaDBaVzVrWldRZ1pXeGxiV1Z1ZEZ4eVhHNGdJQ0FnUUc5cVRtOWtaVnh5WEc1Y2NseHVaR1ZtWVhWc2RFTnlaV0YwWlVWc1pXMWxiblFnUFNBb2NHRnlaVzUwTENCMFlXY3NJRzl3ZEdsdmJuTXBJQzArWEhKY2JpQWdibVYzUld4bGJXVnVkQ0E5SUdSdlkzVnRaVzUwTG1OeVpXRjBaVVZzWlcxbGJuUWdkR0ZuWEhKY2JpQWdhV1lnYjNCMGFXOXVjMXh5WEc0Z0lDQWdabTl5SUd0bGVTd2dkbUZzZFdVZ2IyWWdiM0IwYVc5dWN5NXdjbTl3YzF4eVhHNGdJQ0FnSUNCdVpYZEZiR1Z0Wlc1MExuTmxkRUYwZEhKcFluVjBaU2hyWlhrc0lIWmhiSFZsS1Z4eVhHNGdJQ0FnWm05eUlHdGxlU3dnZG1Gc2RXVWdiMllnYjNCMGFXOXVjeTVsZG1WdWRITmNjbHh1SUNBZ0lDQWdKQ2h1WlhkRmJHVnRaVzUwS1M1dmJpaHJaWGtzSUhaaGJIVmxLVnh5WEc0Z0lDQWdabTl5SUd0bGVTd2dkbUZzZFdVZ2IyWWdiM0IwYVc5dWN5NXpkSGxzWlhOY2NseHVJQ0FnSUNBZ0pDaHVaWGRGYkdWdFpXNTBLUzVqYzNNb2EyVjVMQ0IyWVd4MVpTbGNjbHh1SUNBZ0lIWmhiSFZsSUQwZ2IzQjBhVzl1Y3k1MFpYaDBYSEpjYmlBZ0lDQnBaaUIyWVd4MVpTQnBjMjUwSUhWdVpHVm1hVzVsWkZ4eVhHNGdJQ0FnSUNBa0tHNWxkMFZzWlcxbGJuUXBMblJsZUhRb2RtRnNkV1VwWEhKY2JpQWdjR0Z5Wlc1MFB5NWhjSEJsYm1SRGFHbHNaQ2h1WlhkRmJHVnRaVzUwS1Z4eVhHNWNjbHh1WjJWMFRtOWtaVVp5YjIxR1lXTjBiM0o1SUQwZ0tIUmhaeXdnYjNCMGFXOXVjeXdnYjNkdVpYSXNJR2x6UTJGc2JHVmtSbkp2YlVaaFkzUnZjbmtzSUc1dlpHVXBJQzArWEhKY2JpQWdibVYzVDBwT2IyUmxJRDBnYm1WM0lFNXZaR1VvS1Z4eVhHNGdJR2xtSUNGM2FXNWtiM2N1YjJwRGNtVmhkR1ZGYkdWdFpXNTBYSEpjYmlBZ0lDQjNhVzVrYjNjdWIycERjbVZoZEdWRmJHVnRaVzUwSUQwZ1pHVm1ZWFZzZEVOeVpXRjBaVVZzWlcxbGJuUmNjbHh1SUNCdVpYZFBTazV2WkdVdVpXeGxiV1Z1ZENBOUlHOXFRM0psWVhSbFJXeGxiV1Z1ZENodmQyNWxjaTVsYkdWdFpXNTBMQ0IwWVdjZ2ZId2dKMlJwZGljc0lHOXdkR2x2Ym5NcFhISmNiaUFnYm1WM1QwcE9iMlJsWEhKY2JseHlYRzVQU2k1eVpXZHBjM1JsY2lBbmJtOWtaVVpoWTNSdmNua25MQ0JuWlhST2IyUmxSbkp2YlVaaFkzUnZjbmxjY2x4dVhISmNibTFoYTJVZ1BTQW9kR0ZuTENCdmNIUnBiMjV6S1NBdFBseHlYRzRnSUc1bGQwOUtUbTlrWlNBOUlHNWxkeUJPYjJSbEtDbGNjbHh1SUNCdVpYZFBTazV2WkdVdVpXeGxiV1Z1ZENBOUlHOXFRM0psWVhSbFJXeGxiV1Z1ZENodWRXeHNMQ0IwWVdjZ2ZId2dKMlJwZGljc0lHOXdkR2x2Ym5NcFhISmNiaUFnYm1WM1QwcE9iMlJsWEhKY2JseHlYRzVQU2k1eVpXZHBjM1JsY2lBbmJXRnJaU2NzSUcxaGEyVmNjbHh1WEhKY2JseHlYRzVjY2x4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCblpYUk9iMlJsUm5KdmJVWmhZM1J2Y25sY2NseHVJbDE5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgYVxyXG5ub2RlTmFtZSA9ICdhJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBpZDogJydcclxuICAgICAgY2xhc3M6ICcnXHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICAgIGhyZWY6ICdqYXZhU2NyaXB0OnZvaWQoMCk7J1xyXG4gICAgICB0eXBlOiAnJ1xyXG4gICAgICB0aXRsZTogJydcclxuICAgICAgcmVsOiAnJ1xyXG4gICAgICBtZWRpYTogJydcclxuICAgICAgdGFyZ2V0OiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHRvZ2dsZVN0YXRlID0gJ29mZidcclxuXHJcbiAgdG9nZ2xlID0gLT5cclxuICAgIGlmIHRvZ2dsZVN0YXRlIGlzICdvbidcclxuICAgICAgdG9nZ2xlU3RhdGUgPSAnb2ZmJ1xyXG4gICAgZWxzZSB0b2dnbGVTdGF0ZSA9ICdvbicgIGlmIHRvZ2dsZVN0YXRlIGlzICdvZmYnXHJcbiAgICByZXR1cm5cclxuXHJcbiAgIyBDbGljayBiaW5kaW5nXHJcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICB0b2dnbGUoKVxyXG4gICAgICByZXRWYWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICBpZiBkZWZhdWx0cy5ocmVmIGlzICcjJyB0aGVuIHJldFZhbCA9IGZhbHNlXHJcbiAgICAgIHJldFZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuICBlbHNlXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSB0b2dnbGVcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcclxuXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxudG8gPSByZXF1aXJlICcuLi90b29scy90bydcclxuIyAjIGJyXHJcblxyXG5ub2RlTmFtZSA9ICdicidcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczoge31cclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIG51bWJlcjogMVxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICBpID0gMFxyXG4gIHdoaWxlIGkgPCB0by5udW1iZXIgZGVmYXVsdHMubnVtYmVyXHJcbiAgICAjIEluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGJycywgaXQgaXMgZGVzaXJhYmxlIHRvIG9ubHkgZ2V0IHRoZSBsYXN0IG9uZSBvdXRcclxuICAgIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gICAgaSArPSAxXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBmb3JtXHJcblxyXG5ub2RlTmFtZSA9ICdmb3JtJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBhY3Rpb246ICcnXHJcbiAgICAgIG1ldGhvZDogJydcclxuICAgICAgbmFtZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0LmFkZCAndmFsaWRhdG9yJywgcmV0LiQudmFsaWRhdGUoXHJcbiAgICBoaWdobGlnaHQ6IChlbGVtZW50KSAtPlxyXG4gICAgICAkZWxtID0gJChlbGVtZW50KVxyXG4gICAgICAkZWxtLmF0dHIgJ09KX2ludmFsaWQnLCAnMSdcclxuICAgICAgJGVsbS5hbmltYXRlIGJhY2tncm91bmRDb2xvcjogJ3JlZCdcclxuICAgICAgbnVsbFxyXG5cclxuICAgIHVuaGlnaGxpZ2h0OiAoZWxlbWVudCkgLT5cclxuICAgICAgJGVsbSA9ICQoZWxlbWVudClcclxuICAgICAgaWYgJGVsbS5hdHRyKCdPSl9pbnZhbGlkJykgaXMgJzEnXHJcbiAgICAgICAgJGVsbS5jc3MgJ2JhY2tncm91bmQtY29sb3InLCAneWVsbG93J1xyXG4gICAgICAgICRlbG0uYXR0ciAnT0pfaW52YWxpZCcsICcwJ1xyXG4gICAgICAgIHNldFRpbWVvdXQgKC0+XHJcbiAgICAgICAgICAkZWxtLmFuaW1hdGUgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXHJcbiAgICAgICAgKSwgNTAwXHJcbiAgICAgIG51bGxcclxuICApXHJcblxyXG4gIHJldC5hZGQgJ2lzRm9ybVZhbGlkJywgLT5cclxuICAgIHJldC4kLnZhbGlkKCkgYW5kIChub3QgcmV0LnZhbGlkYXRvci5pbnZhbGlkRWxlbWVudHMoKSBvciByZXQudmFsaWRhdG9yLmludmFsaWRFbGVtZW50cygpLmxlbmd0aCBpcyAwKVxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG5cclxuXHJcblxyXG5cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXHJcblxyXG4jICMgaW5wdXRcclxuXHJcbm5vZGVOYW1lID0gJ2lucHV0J1xyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6ICd0ZXh0J1xyXG4gICAgICB2YWx1ZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcbiAgICAgIGZvY3Vzb3V0OiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICBpZiBub3QgZGVmYXVsdHMucHJvcHMudHlwZSBvciBub3QgZW51bXMuaW5wdXRUeXBlc1tkZWZhdWx0cy5wcm9wcy50eXBlXVxyXG4gICAgdGhyb3cgbmV3IEVycm9yICdObyBtYXRjaGluZyBpbnB1dCB0eXBlIGZvciB7JyArIGRlZmF1bHRzLnByb3BzLnR5cGUgKyAnfSBjb3VsZCBiZSBmb3VuZC4nXHJcbiAgdGhpc1R5cGUgPSBlbnVtcy5pbnB1dFR5cGVzW2RlZmF1bHRzLnByb3BzLnR5cGVdXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICBzd2l0Y2ggdGhpc1R5cGVcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLmNoZWNrYm94XHJcbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LiQuaXMgJzpjaGVja2VkJ1xyXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMucmFkaW9cclxuICAgICAgICByZXQudmFsdWUgPSByZXQuJC5maW5kKCc6Y2hlY2tlZCcpLnZhbCgpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXQudmFsdWUgPSByZXQudmFsKClcclxuICAgIGRlZmF1bHRzLnByb3BzLnZhbHVlID0gcmV0LnZhbHVlICAgIFxyXG4gICAgcmV0LnZhbHVlXHJcblxyXG4gICMjI1xyXG4gICAgQ2xpY2sgYmluZGluZy4gSWYgdGhlIGNhbGxlciBkZWZpbmVkIGEgY2xpY2sgaGFuZGxlcixcclxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcclxuICAgIHRoZW4gY2FsbCB0aGUgZGVmaW5lZCBjbGljayBoYW5kbGVyIHdpdGggdGhlIGxhdGVzdCB2YWx1ZS5cclxuICAjIyNcclxuICBvbGRDbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gIGlmIG9sZENsaWNrIGFuZCBvbGRDbGljayBpc250IE9KLm5vb3BcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICBvbGRDbGljayByZXQudmFsdWUsIGV2ZW50Li4uXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSBuZXdDbGlja1xyXG5cclxuICAjIyNcclxuICAgIENoYW5nZSBiaW5kaW5nLiBJZiB0aGUgY2FsbGVyIGRlZmluZWQgYSBjaGFuZ2UgaGFuZGxlcixcclxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcclxuICAgIHRoZW4gY2FsbCB0aGUgZGVmaW5lZCBjaGFuZ2UgaGFuZGxlciB3aXRoIHRoZSBsYXRlc3QgdmFsdWUuXHJcbiAgIyMjXHJcbiAgb2xkQ2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gIGlmIG9sZENoYW5nZSBhbmQgb2xkQ2hhbmdlIGlzbnQgT0oubm9vcFxyXG4gICAgbmV3Q2hhbmdlID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICBvbGRDaGFuZ2UgcmV0LnZhbHVlLCBldmVudC4uLlxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSA9IG5ld0NoYW5nZVxyXG5cclxuICAjIyNcclxuICAgIE9uIEZvY3VzIE91dCBiaW5kaW5nLiBBbHdheXMgdXNlIHRoZSBldmVudCB0byB1cGRhdGUgdGhlIGludGVybmFsXHJcbiAgICB2YWx1ZSBvZiB0aGUgY29udHJvbDsgYW5kIGlmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGZvY3Vzb3V0IGV2ZW50LFxyXG4gICAgd3JhcCBpdCBhbmQgaW52b2tlIGl0IHdpdGggdGhlIGxhdGVzdCB2YWx1ZVxyXG4gICMjI1xyXG4gIG9sZEZvY3Vzb3V0ID0gZGVmYXVsdHMuZXZlbnRzLmZvY3Vzb3V0XHJcbiAgbmV3Rm9jdXNvdXQgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICBzeW5jVmFsdWUoKVxyXG4gICAgaWYgb2xkRm9jdXNvdXQgYW5kIG9sZEZvY3Vzb3V0IGlzbnQgT0oubm9vcFxyXG4gICAgICBvbGRGb2N1c291dCByZXQudmFsdWUsIGV2ZW50Li4uXHJcblxyXG4gIGRlZmF1bHRzLmV2ZW50cy5mb2N1c291dCA9IG5ld0ZvY3Vzb3V0XHJcblxyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG4gIHJldC52YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBvbFxyXG5cclxubm9kZU5hbWUgPSAnb2wnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIHNlbGVjdFxyXG5cclxubm9kZU5hbWUgPSAnc2VsZWN0J1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHNlbGVjdGVkOiAnJ1xyXG4gICAgICBtdWx0aXBsZTogZmFsc2VcclxuICAgIHN0eWxlczoge31cclxuICAgIHZhbHVlczogW11cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICB2YWx1ZSA9ICcnXHJcbiAgdmFsdWVzID0gW11cclxuICBoYXNFbXB0eSA9IGZhbHNlXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICB2YWx1ZSA9IHJldC52YWwoKVxyXG5cclxuICAjIENsaWNrIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIHJldHZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuXHJcbiAgIyBDaGFuZ2UgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICBjaGFuZ2UgPSBkZWZhdWx0cy5ldmVudHMuY2hhbmdlXHJcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0LmFkZCAnc2VsZWN0ZWREYXRhJywgKHByb3BOYW1lKSAtPlxyXG4gICAgcmV0ID0gJydcclxuICAgIGlmIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpIGFuZCByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVswXVxyXG4gICAgICBkYXRhc2V0ID0gcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0uZGF0YXNldFxyXG4gICAgICByZXQgPSBkYXRhc2V0W3Byb3BOYW1lXSAgaWYgZGF0YXNldFxyXG4gICAgcmV0XHJcblxyXG4gIHJldC5hZGQgJ3NlbGVjdGVkVGV4dCcsIC0+XHJcbiAgICByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS50ZXh0KClcclxuXHJcbiAgcmV0LmFkZCAnc2VsZWN0ZWRWYWwnLCAtPlxyXG4gICAgdmFsdWUgPSByZXQudmFsKClcclxuICAgIHZhbHVlXHJcblxyXG4gIHJldC5hZGQgJ2FkZE9wdGlvbicsICh2YWx1ZSwgdGV4dCA9IHZhbHVlLCBzZWxlY3RlZCA9IGZhbHNlLCBkaXNhYmxlZCA9IGZhbHNlKSAtPlxyXG4gICAgaXNFbXB0eSA9IF8uaXNFbXB0eSB2YWx1ZVxyXG4gICAgYWRkID0gZmFsc2VcclxuICAgIGlmIGlzRW1wdHkgYW5kIGZhbHNlIGlzIGhhc0VtcHR5XHJcbiAgICAgIGhhc0VtcHR5ID0gdHJ1ZVxyXG4gICAgICBhZGQgPSB0cnVlXHJcbiAgICBpZiBmYWxzZSBpcyBhZGQgYW5kIGZhbHNlIGlzIGlzRW1wdHkgdGhlbiBhZGQgPSB0cnVlXHJcbiAgICBpZiBhZGRcclxuICAgICAgdmFsID1cclxuICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgcHJvcHM6XHJcbiAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgaWYgc2VsZWN0ZWRcclxuICAgICAgICB2YWwuc2VsZWN0ZWQgPSBzZWxlY3RlZFxyXG4gICAgICBpZiBkaXNhYmxlZFxyXG4gICAgICAgIHZhbC5kaXNhYmxlZCA9IGRpc2FibGVkXHJcbiAgICAgIG9wdGlvbiA9IHJldC5tYWtlICdvcHRpb24nLCB2YWxcclxuICAgICAgb3B0aW9uXHJcblxyXG4gIHJldC5hZGQgJ2FkZE9wdGlvbnMnLCAob3B0aW9ucykgLT5cclxuICAgIHZhbHVlcyA9IF8udW5pb24gdmFsdWVzLCBvcHRpb25zXHJcbiAgICBPSi5lYWNoIG9wdGlvbnMsICgodmFsKSAtPlxyXG4gICAgICB2YWx1ZSA9IHJldC5hZGRPcHRpb24odmFsKVxyXG4gICAgICB2YWx1ZXMucHVzaCB2YWx1ZVxyXG4gICAgKSwgZmFsc2VcclxuICAgIHZhbHVlc1xyXG5cclxuICByZXQuYWRkICdyZXNldE9wdGlvbnMnLCAodmFsdWVzKSAtPlxyXG4gICAgcmV0LmVtcHR5KClcclxuICAgIHZhbHVlcyA9IHZhbHVlc1xyXG4gICAgcmV0LmFkZE9wdGlvbnMgdmFsdWVzXHJcbiAgICByZXRcclxuXHJcbiAgcmV0LmFkZCAncmVtb3ZlT3B0aW9uJywgKHZhbHVlVG9SZW1vdmUpIC0+XHJcbiAgICB2YWx1ZXMuc3BsaWNlIHZhbHVlcy5pbmRleE9mKHZhbHVlVG9SZW1vdmUpLCAxICNyZW1vdmVzIHRoZSBpdGVtIGZyb20gdGhlIGxpc3RcclxuICAgIHNlbGVjdENvbnRyb2wgPSByZXRbMF1cclxuICAgIGkgPSAwXHJcblxyXG4gICAgd2hpbGUgaSA8IHNlbGVjdENvbnRyb2wubGVuZ3RoXHJcbiAgICAgIHNlbGVjdENvbnRyb2wucmVtb3ZlIGkgIGlmIHNlbGVjdENvbnRyb2wub3B0aW9uc1tpXS52YWx1ZSBpcyB2YWx1ZVRvUmVtb3ZlXHJcbiAgICAgIGkrK1xyXG4gICAgbnVsbFxyXG5cclxuXHJcblxyXG4gIGlmIGRlZmF1bHRzLnZhbHVlcy5sZW5ndGggPiAwXHJcbiAgICByZXQuYWRkT3B0aW9ucyBkZWZhdWx0cy52YWx1ZXNcclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCwgSnNvblRvVGFibGUsIE9KLCBfLCBhcnJheTJELCBub2RlLCBub2RlRmFjdG9yeSwgbm9kZU5hbWU7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxubm9kZUZhY3RvcnkgPSByZXF1aXJlKCcuLi9kb20vbm9kZUZhY3RvcnknKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuYXJyYXkyRCA9IHJlcXVpcmUoJy4uL3Rvb2xzL2FycmF5MkQnKTtcblxuJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxuSnNvblRvVGFibGUgPSByZXF1aXJlKCcuLi90b29scy9Kc29uVG9UYWJsZScpO1xuXG5ub2RlTmFtZSA9ICd0YWJsZSc7XG5cblxuLypcbkNyZWF0ZSBhbiBIVE1MIHRhYmxlLiBQcm92aWRlcyBoZWxwZXIgbWV0aG9kcyB0byBjcmVhdGUgQ29sdW1ucyBhbmQgQ2VsbHMuXG4gKi9cblxubm9kZSA9IGZ1bmN0aW9uKG9wdGlvbnMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeSkge1xuICB2YXIgY2VsbHMsIGNvbHVtbkNvdW50LCBkZWZhdWx0cywgZmlsbE1pc3NpbmcsIGluaXQsIGxvYWRDZWxscywgcmV0LCByb3dzLCB0Ym9keSwgdGhlYWQsIHRoZWFkUm93O1xuICBpZiAob3duZXIgPT0gbnVsbCkge1xuICAgIG93bmVyID0gT0ouYm9keTtcbiAgfVxuICBpZiAoY2FsbGVkRnJvbUZhY3RvcnkgPT0gbnVsbCkge1xuICAgIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2U7XG4gIH1cbiAgZGVmYXVsdHMgPSB7XG4gICAgZGF0YTogbnVsbCxcbiAgICBwcm9wczoge1xuICAgICAgY2VsbHBhZGRpbmc6IDAsXG4gICAgICBjZWxsc3BhY2luZzogMCxcbiAgICAgIGFsaWduOiAnJyxcbiAgICAgIHdpZHRoOiAnJyxcbiAgICAgIGNlbGxhbGlnbjogJ2xlZnQnLFxuICAgICAgY2VsbHZhbGlnbjogJ3RvcCcsXG4gICAgICBcImNsYXNzXCI6ICcnXG4gICAgfSxcbiAgICBzdHlsZXM6IHt9LFxuICAgIGV2ZW50czoge30sXG4gICAgY2VsbHM6IHtcbiAgICAgIFwiY2xhc3NcIjogJycsXG4gICAgICBhbGlnbjogJycsXG4gICAgICAndmVydGljYWwtYWxpZ24nOiAnJyxcbiAgICAgIGNlbGxwYWRkaW5nOiAnJyxcbiAgICAgIG1hcmdpbjogJydcbiAgICB9LFxuICAgIHRoZWFkOiB7fSxcbiAgICB0Ym9keToge30sXG4gICAgZmlyc3RBbGlnblJpZ2h0OiBmYWxzZSxcbiAgICBvZGRBbGlnblJpZ2h0OiBmYWxzZVxuICB9O1xuICByb3dzID0gW107XG4gIGNlbGxzID0gYXJyYXkyRCgpO1xuICBjb2x1bW5Db3VudCA9IDA7XG4gIE9KLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZSk7XG4gIHJldCA9IG5vZGVGYWN0b3J5KG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5KTtcbiAgdGJvZHkgPSBudWxsO1xuICB0aGVhZCA9IG51bGw7XG4gIHRoZWFkUm93ID0gbnVsbDtcbiAgaW5pdCA9IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICB2YXIgajJ0LCBqQm9keSwgakhlYWQsIGpUYmwsIHRibFN0cjtcbiAgICBpZiAoZGVmYXVsdHMuZGF0YSkge1xuICAgICAgajJ0ID0gbmV3IEpzb25Ub1RhYmxlKGRlZmF1bHRzLmRhdGEpO1xuICAgICAgdGJsU3RyID0gajJ0LnRhYmxlO1xuICAgIH1cbiAgICBpZiAodGJsU3RyKSB7XG4gICAgICBqVGJsID0gJCh0YmxTdHIpO1xuICAgICAgakhlYWQgPSBqVGJsLmZpbmQoJ3RoZWFkJyk7XG4gICAgICByZXQuJC5hcHBlbmQoakhlYWQpO1xuICAgICAgdGhlYWQgPSBlbC5yZXN0b3JlRWxlbWVudChqSGVhZFswXSk7XG4gICAgICB0aGVhZFJvdyA9IGVsLnJlc3RvcmVFbGVtZW50KHRoZWFkWzBdLnJvd3NbMF0pO1xuICAgICAgakJvZHkgPSBqVGJsLmZpbmQoJ3Rib2R5Jyk7XG4gICAgICByZXQuJC5hcHBlbmQoakJvZHkpO1xuICAgICAgdGJvZHkgPSBlbC5yZXN0b3JlRWxlbWVudChqQm9keVswXSk7XG4gICAgICBsb2FkQ2VsbHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhlYWQgPSByZXQubWFrZSgndGhlYWQnLCBkZWZhdWx0cy50aGVhZCk7XG4gICAgICB0aGVhZFJvdyA9IHRoZWFkLm1ha2UoJ3RyJyk7XG4gICAgICB0Ym9keSA9IHJldC5tYWtlKCd0Ym9keScsIGRlZmF1bHRzLnRib2R5KTtcbiAgICAgIHJvd3MucHVzaCh0Ym9keS5tYWtlKCd0cicpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG4gIGxvYWRDZWxscyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjLCBtZW1DZWxsLCBtZW1Sb3csIHIsIHJlc3VsdHM7XG4gICAgciA9IDA7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIHdoaWxlICh0Ym9keVswXS5yb3dzLmxlbmd0aCA+IHIpIHtcbiAgICAgIGMgPSAwO1xuICAgICAgbWVtUm93ID0gZWwucmVzdG9yZUVsZW1lbnQodGJvZHlbMF0ucm93c1tyXSk7XG4gICAgICByb3dzLnB1c2gobWVtUm93KTtcbiAgICAgIHdoaWxlICh0Ym9keVswXS5yb3dzW3JdLmNlbGxzLmxlbmd0aCA+IGMpIHtcbiAgICAgICAgbWVtQ2VsbCA9IGNlbGxzLmdldChyICsgMSwgYyArIDEpO1xuICAgICAgICBpZiAoIW1lbUNlbGwpIHtcbiAgICAgICAgICBtZW1DZWxsID0gZWwucmVzdG9yZUVsZW1lbnQodGJvZHlbMF0ucm93c1tyXS5jZWxsc1tjXSk7XG4gICAgICAgICAgY2VsbHMuc2V0KHIgKyAxLCBjICsgMSwgbWVtQ2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgYyArPSAxO1xuICAgICAgfVxuICAgICAgcmVzdWx0cy5wdXNoKHIgKz0gMSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuICBmaWxsTWlzc2luZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjZWxscy5lYWNoKGZ1bmN0aW9uKHJvd05vLCBjb2xObywgdmFsKSB7XG4gICAgICB2YXIgcm93O1xuICAgICAgaWYgKCF2YWwpIHtcbiAgICAgICAgcm93ID0gcmV0LnJvdyhyb3dObyk7XG4gICAgICAgIHJldHVybiByb3cuY2VsbChjb2xObywge30pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICByZXQuYWRkKCdjb2x1bW4nLCBmdW5jdGlvbihjb2xObywgY29sTmFtZSkge1xuICAgIHZhciBpLCBuYXRpdmVUaCwgdGg7XG4gICAgcmV0LmluaXQoKTtcbiAgICBjb2x1bW5Db3VudCArPSAxO1xuICAgIHRoID0gbnVsbDtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAodGhlYWRbMF0ucm93c1swXS5jZWxscy5sZW5ndGggPCBjb2xObykge1xuICAgICAgbmF0aXZlVGggPSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzW2ldO1xuICAgICAgaWYgKCFuYXRpdmVUaCkge1xuICAgICAgICB0aCA9IHRoZWFkUm93Lm1ha2UoJ3RoJywge30pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudChuYXRpdmVUaCwgJ3RoJyk7XG4gICAgICB9XG4gICAgICBpICs9IDE7XG4gICAgfVxuICAgIGlmICghdGgpIHtcbiAgICAgIG5hdGl2ZVRoID0gdGhlYWRbMF0ucm93c1swXS5jZWxsc1tjb2xObyAtIDFdO1xuICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudChuYXRpdmVUaCwgJ3RoJyk7XG4gICAgfVxuICAgIHRoLnRleHQoY29sTmFtZSk7XG4gICAgcmV0dXJuIHRoO1xuICB9KTtcbiAgcmV0LmFkZCgncm93JywgZnVuY3Rpb24ocm93Tm8sIG9wdHMpIHtcbiAgICB2YXIgcm93O1xuICAgIHJvdyA9IHJvd3Nbcm93Tm8gLSAxXTtcbiAgICBpZiAoIXJvdykge1xuICAgICAgd2hpbGUgKHJvd3MubGVuZ3RoIDwgcm93Tm8pIHtcbiAgICAgICAgcm93ID0gdGJvZHkubWFrZSgndHInLCB7fSk7XG4gICAgICAgIHJvd3MucHVzaChyb3cpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXJvdy5jZWxsKSB7XG4gICAgICByb3cuYWRkKCdjZWxsJywgZnVuY3Rpb24oY29sTm8sIG9wdHMpIHtcbiAgICAgICAgdmFyIGNlbGw7XG4gICAgICAgIGNlbGwgPSBPSi5ub2Rlcy50ZChvcHRzLCByb3cpO1xuICAgICAgICBjZWxscy5zZXQocm93Tm8sIGNvbE5vLCBjZWxsKTtcbiAgICAgICAgcmV0dXJuIGNlbGw7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJvdztcbiAgfSk7XG4gIHJldC5hZGQoJ2NlbGwnLCBmdW5jdGlvbihyb3dObywgY29sTm8sIG9wdHMpIHtcbiAgICB2YXIgY2VsbCwgaSwgbnVPcHRzLCByb3csIHRyeUNlbGw7XG4gICAgaWYgKHJvd05vIDwgMSkge1xuICAgICAgcm93Tm8gPSAxO1xuICAgIH1cbiAgICBpZiAoY29sTm8gPCAxKSB7XG4gICAgICBjb2xObyA9IDE7XG4gICAgfVxuICAgIGlmIChjb2x1bW5Db3VudCA+IDAgJiYgY29sTm8gLSAxID4gY29sdW1uQ291bnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSBjb2x1bW4gbmFtZSBoYXMgbm90IGJlZW4gZGVmaW5lZCBmb3IgdGhpcyBwb3NpdGlvbiB7JyArIHJvd05vICsgJ3gnICsgY29sTm8gKyAnfS4nKTtcbiAgICB9XG4gICAgcm93ID0gcmV0LnJvdyhyb3dObyk7XG4gICAgY2VsbCA9IGNlbGxzLmdldChyb3dObywgY29sTm8pO1xuICAgIGlmICghY2VsbCkge1xuICAgICAgaSA9IDA7XG4gICAgICB3aGlsZSAoaSA8IGNvbE5vKSB7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgICAgaWYgKGkgPT09IGNvbE5vKSB7XG4gICAgICAgICAgbnVPcHRzID0gT0ouZXh0ZW5kKHtcbiAgICAgICAgICAgIHByb3BzOiBkZWZhdWx0cy5jZWxsc1xuICAgICAgICAgIH0sIG9wdHMpO1xuICAgICAgICAgIGNlbGwgPSByb3cuY2VsbChjb2xObywgbnVPcHRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnlDZWxsID0gY2VsbHMuZ2V0KHJvd05vLCBpKTtcbiAgICAgICAgICBpZiAoIXRyeUNlbGwpIHtcbiAgICAgICAgICAgIHRyeUNlbGwgPSByb3cuY2VsbChpLCB7XG4gICAgICAgICAgICAgIHByb3BzOiBkZWZhdWx0cy5jZWxsc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjZWxsO1xuICB9KTtcbiAgaW5pdCgpO1xuICByZXQuYWRkKCd0aGVhZCcsIHRoZWFkKTtcbiAgcmV0LmFkZCgndGJvZHknLCB0Ym9keSk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5PSi5ub2Rlcy5yZWdpc3Rlcihub2RlTmFtZSwgbm9kZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRnhsYkdWdFpXNTBjMXhjZEdGaWJHVXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRU3hKUVVGQk96dEJRVUZCTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1QwRkJVanM3UVVGRFRDeFhRVUZCTEVkQlFXTXNUMEZCUVN4RFFVRlJMRzlDUVVGU096dEJRVU5rTEVOQlFVRXNSMEZCU1N4UFFVRkJMRU5CUVZFc1VVRkJVanM3UVVGRFNpeFBRVUZCTEVkQlFWVXNUMEZCUVN4RFFVRlJMR3RDUVVGU096dEJRVU5XTEVOQlFVRXNSMEZCU1N4UFFVRkJMRU5CUVZFc1VVRkJVanM3UVVGRFNpeFhRVUZCTEVkQlFXTXNUMEZCUVN4RFFVRlJMSE5DUVVGU096dEJRVWxrTEZGQlFVRXNSMEZCVnpzN08wRkJSVmc3T3pzN1FVRkhRU3hKUVVGQkxFZEJRVThzVTBGQlF5eFBRVUZFTEVWQlFWVXNTMEZCVml4RlFVRXlRaXhwUWtGQk0wSTdRVUZIVEN4TlFVRkJPenRKUVVobExGRkJRVkVzUlVGQlJTeERRVUZET3pzN1NVRkJUU3h2UWtGQmIwSTdPMFZCUjNCRUxGRkJRVUVzUjBGSFJUdEpRVUZCTEVsQlFVRXNSVUZCVFN4SlFVRk9PMGxCUjBFc1MwRkJRU3hGUVVORk8wMUJRVUVzVjBGQlFTeEZRVUZoTEVOQlFXSTdUVUZEUVN4WFFVRkJMRVZCUVdFc1EwRkVZanROUVVWQkxFdEJRVUVzUlVGQlR5eEZRVVpRTzAxQlIwRXNTMEZCUVN4RlFVRlBMRVZCU0ZBN1RVRkpRU3hUUVVGQkxFVkJRVmNzVFVGS1dEdE5RVXRCTEZWQlFVRXNSVUZCV1N4TFFVeGFPMDFCVFVFc1QwRkJRU3hGUVVGUExFVkJUbEE3UzBGS1JqdEpRVmRCTEUxQlFVRXNSVUZCVVN4RlFWaFNPMGxCV1VFc1RVRkJRU3hGUVVGUkxFVkJXbEk3U1VGbFFTeExRVUZCTEVWQlEwVTdUVUZCUVN4UFFVRkJMRVZCUVU4c1JVRkJVRHROUVVOQkxFdEJRVUVzUlVGQlR5eEZRVVJRTzAxQlJVRXNaMEpCUVVFc1JVRkJhMElzUlVGR2JFSTdUVUZIUVN4WFFVRkJMRVZCUVdFc1JVRklZanROUVVsQkxFMUJRVUVzUlVGQlVTeEZRVXBTTzB0QmFFSkdPMGxCZFVKQkxFdEJRVUVzUlVGQlR5eEZRWFpDVUR0SlFUQkNRU3hMUVVGQkxFVkJRVThzUlVFeFFsQTdTVUUwUWtFc1pVRkJRU3hGUVVGcFFpeExRVFZDYWtJN1NVRTJRa0VzWVVGQlFTeEZRVUZsTEV0Qk4wSm1PenRGUVN0Q1JpeEpRVUZCTEVkQlFVODdSVUZEVUN4TFFVRkJMRWRCUVZFc1QwRkJRU3hEUVVGQk8wVkJRMUlzVjBGQlFTeEhRVUZqTzBWQlJXUXNSVUZCUlN4RFFVRkRMRTFCUVVnc1EwRkJWU3hSUVVGV0xFVkJRVzlDTEU5QlFYQkNMRVZCUVRaQ0xFbEJRVGRDTzBWQlEwRXNSMEZCUVN4SFFVRk5MRmRCUVVFc1EwRkJXU3hSUVVGYUxFVkJRWE5DTEZGQlFYUkNMRVZCUVdkRExFdEJRV2hETEVWQlFYVkRMR2xDUVVGMlF6dEZRVWRPTEV0QlFVRXNSMEZCVVR0RlFVTlNMRXRCUVVFc1IwRkJVVHRGUVVOU0xGRkJRVUVzUjBGQlZ6dEZRVWxZTEVsQlFVRXNSMEZCVHl4RFFVRkRMRU5CUVVNc1NVRkJSaXhEUVVGUExGTkJRVUU3UVVGRFdpeFJRVUZCTzBsQlFVRXNTVUZCUnl4UlFVRlJMRU5CUVVNc1NVRkJXanROUVVORkxFZEJRVUVzUjBGQlZTeEpRVUZCTEZkQlFVRXNRMEZCV1N4UlFVRlJMRU5CUVVNc1NVRkJja0k3VFVGRFZpeE5RVUZCTEVkQlFWTXNSMEZCUnl4RFFVRkRMRTFCUm1ZN08wbEJSMEVzU1VGQlJ5eE5RVUZJTzAxQlEwVXNTVUZCUVN4SFFVRlBMRU5CUVVFc1EwRkJSU3hOUVVGR08wMUJSVkFzUzBGQlFTeEhRVUZSTEVsQlFVa3NRMEZCUXl4SlFVRk1MRU5CUVZVc1QwRkJWanROUVVOU0xFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVGl4RFFVRmhMRXRCUVdJN1RVRkRRU3hMUVVGQkxFZEJRVkVzUlVGQlJTeERRVUZETEdOQlFVZ3NRMEZCYTBJc1MwRkJUU3hEUVVGQkxFTkJRVUVzUTBGQmVFSTdUVUZEVWl4UlFVRkJMRWRCUVZjc1JVRkJSU3hEUVVGRExHTkJRVWdzUTBGQmEwSXNTMEZCVFN4RFFVRkJMRU5CUVVFc1EwRkJSU3hEUVVGRExFbEJRVXNzUTBGQlFTeERRVUZCTEVOQlFXaERPMDFCUlZnc1MwRkJRU3hIUVVGUkxFbEJRVWtzUTBGQlF5eEpRVUZNTEVOQlFWVXNUMEZCVmp0TlFVTlNMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zVFVGQlRpeERRVUZoTEV0QlFXSTdUVUZEUVN4TFFVRkJMRWRCUVZFc1JVRkJSU3hEUVVGRExHTkJRVWdzUTBGQmEwSXNTMEZCVFN4RFFVRkJMRU5CUVVFc1EwRkJlRUk3VFVGRlVpeFRRVUZCTEVOQlFVRXNSVUZhUmp0TFFVRkJMRTFCUVVFN1RVRmpSU3hMUVVGQkxFZEJRVkVzUjBGQlJ5eERRVUZETEVsQlFVb3NRMEZCVXl4UFFVRlVMRVZCUVd0Q0xGRkJRVkVzUTBGQlF5eExRVUV6UWp0TlFVTlNMRkZCUVVFc1IwRkJWeXhMUVVGTExFTkJRVU1zU1VGQlRpeERRVUZYTEVsQlFWZzdUVUZEV0N4TFFVRkJMRWRCUVZFc1IwRkJSeXhEUVVGRExFbEJRVW9zUTBGQlV5eFBRVUZVTEVWQlFXdENMRkZCUVZFc1EwRkJReXhMUVVFelFqdE5RVU5TTEVsQlFVa3NRMEZCUXl4SlFVRk1MRU5CUVZVc1MwRkJTeXhEUVVGRExFbEJRVTRzUTBGQlZ5eEpRVUZZTEVOQlFWWXNSVUZxUWtZN08xZEJhMEpCTzBWQmRFSlpMRU5CUVZBN1JVRXdRbEFzVTBGQlFTeEhRVUZaTEZOQlFVRTdRVUZEVml4UlFVRkJPMGxCUVVFc1EwRkJRU3hIUVVGSk8wRkJRMG83VjBGQlRTeExRVUZOTEVOQlFVRXNRMEZCUVN4RFFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRV1FzUjBGQmRVSXNRMEZCTjBJN1RVRkRSU3hEUVVGQkxFZEJRVWs3VFVGRFNpeE5RVUZCTEVkQlFWTXNSVUZCUlN4RFFVRkRMR05CUVVnc1EwRkJhMElzUzBGQlRTeERRVUZCTEVOQlFVRXNRMEZCUlN4RFFVRkRMRWxCUVVzc1EwRkJRU3hEUVVGQkxFTkJRV2hETzAxQlExUXNTVUZCU1N4RFFVRkRMRWxCUVV3c1EwRkJWU3hOUVVGV08wRkJRMEVzWVVGQlRTeExRVUZOTEVOQlFVRXNRMEZCUVN4RFFVRkZMRU5CUVVNc1NVRkJTeXhEUVVGQkxFTkJRVUVzUTBGQlJTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRjJRaXhIUVVGblF5eERRVUYwUXp0UlFVTkZMRTlCUVVFc1IwRkJWU3hMUVVGTExFTkJRVU1zUjBGQlRpeERRVUZWTEVOQlFVRXNSMEZCUlN4RFFVRmFMRVZCUVdVc1EwRkJRU3hIUVVGRkxFTkJRV3BDTzFGQlExWXNTVUZCUnl4RFFVRkpMRTlCUVZBN1ZVRkRSU3hQUVVGQkxFZEJRVlVzUlVGQlJTeERRVUZETEdOQlFVZ3NRMEZCYTBJc1MwRkJUU3hEUVVGQkxFTkJRVUVzUTBGQlJTeERRVUZETEVsQlFVc3NRMEZCUVN4RFFVRkJMRU5CUVVVc1EwRkJReXhMUVVGTkxFTkJRVUVzUTBGQlFTeERRVUY2UXp0VlFVTldMRXRCUVVzc1EwRkJReXhIUVVGT0xFTkJRVlVzUTBGQlFTeEhRVUZGTEVOQlFWb3NSVUZCWlN4RFFVRkJMRWRCUVVVc1EwRkJha0lzUlVGQmIwSXNUMEZCY0VJc1JVRkdSanM3VVVGSFFTeERRVUZCTEVsQlFVczdUVUZNVUR0dFFrRk5RU3hEUVVGQkxFbEJRVXM3U1VGV1VDeERRVUZCT3p0RlFVWlZPMFZCWjBKYUxGZEJRVUVzUjBGQll5eFRRVUZCTzFkQlExb3NTMEZCU3l4RFFVRkRMRWxCUVU0c1EwRkJWeXhUUVVGRExFdEJRVVFzUlVGQlVTeExRVUZTTEVWQlFXVXNSMEZCWmp0QlFVTlVMRlZCUVVFN1RVRkJRU3hKUVVGSExFTkJRVWtzUjBGQlVEdFJRVU5GTEVkQlFVRXNSMEZCVFN4SFFVRkhMRU5CUVVNc1IwRkJTaXhEUVVGUkxFdEJRVkk3WlVGRFRpeEhRVUZITEVOQlFVTXNTVUZCU2l4RFFVRlRMRXRCUVZRc1JVRkJaMElzUlVGQmFFSXNSVUZHUmpzN1NVRkVVeXhEUVVGWU8wVkJSRms3UlVGUlpDeEhRVUZITEVOQlFVTXNSMEZCU2l4RFFVRlJMRkZCUVZJc1JVRkJhMElzVTBGQlF5eExRVUZFTEVWQlFWRXNUMEZCVWp0QlFVTm9RaXhSUVVGQk8wbEJRVUVzUjBGQlJ5eERRVUZETEVsQlFVb3NRMEZCUVR0SlFVTkJMRmRCUVVFc1NVRkJaVHRKUVVObUxFVkJRVUVzUjBGQlN6dEpRVU5NTEVOQlFVRXNSMEZCU1R0QlFVTktMRmRCUVUwc1MwRkJUU3hEUVVGQkxFTkJRVUVzUTBGQlJTeERRVUZETEVsQlFVc3NRMEZCUVN4RFFVRkJMRU5CUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQmRrSXNSMEZCWjBNc1MwRkJkRU03VFVGRFJTeFJRVUZCTEVkQlFWY3NTMEZCVFN4RFFVRkJMRU5CUVVFc1EwRkJSU3hEUVVGRExFbEJRVXNzUTBGQlFTeERRVUZCTEVOQlFVVXNRMEZCUXl4TFFVRk5MRU5CUVVFc1EwRkJRVHROUVVOc1F5eEpRVUZITEVOQlFVa3NVVUZCVUR0UlFVTkZMRVZCUVVFc1IwRkJTeXhSUVVGUkxFTkJRVU1zU1VGQlZDeERRVUZqTEVsQlFXUXNSVUZCYjBJc1JVRkJjRUlzUlVGRVVEdFBRVUZCTEUxQlFVRTdVVUZIUlN4RlFVRkJMRWRCUVVzc1JVRkJSU3hEUVVGRExHTkJRVWdzUTBGQmEwSXNVVUZCYkVJc1JVRkJORUlzU1VGQk5VSXNSVUZJVURzN1RVRkpRU3hEUVVGQkxFbEJRVXM3U1VGT1VEdEpRVTlCTEVsQlFVY3NRMEZCU1N4RlFVRlFPMDFCUTBVc1VVRkJRU3hIUVVGWExFdEJRVTBzUTBGQlFTeERRVUZCTEVOQlFVVXNRMEZCUXl4SlFVRkxMRU5CUVVFc1EwRkJRU3hEUVVGRkxFTkJRVU1zUzBGQlRTeERRVUZCTEV0QlFVRXNSMEZCVFN4RFFVRk9PMDFCUTJ4RExFVkJRVUVzUjBGQlN5eEZRVUZGTEVOQlFVTXNZMEZCU0N4RFFVRnJRaXhSUVVGc1FpeEZRVUUwUWl4SlFVRTFRaXhGUVVaUU96dEpRVWRCTEVWQlFVVXNRMEZCUXl4SlFVRklMRU5CUVZFc1QwRkJVanRYUVVOQk8wVkJhRUpuUWl4RFFVRnNRanRGUVc5Q1FTeEhRVUZITEVOQlFVTXNSMEZCU2l4RFFVRlJMRXRCUVZJc1JVRkJaU3hUUVVGRExFdEJRVVFzUlVGQlVTeEpRVUZTTzBGQlEySXNVVUZCUVR0SlFVRkJMRWRCUVVFc1IwRkJUU3hKUVVGTExFTkJRVUVzUzBGQlFTeEhRVUZOTEVOQlFVNDdTVUZGV0N4SlFVRkhMRU5CUVVrc1IwRkJVRHRCUVVORkxHRkJRVTBzU1VGQlNTeERRVUZETEUxQlFVd3NSMEZCWXl4TFFVRndRanRSUVVORkxFZEJRVUVzUjBGQlRTeExRVUZMTEVOQlFVTXNTVUZCVGl4RFFVRlhMRWxCUVZnc1JVRkJhVUlzUlVGQmFrSTdVVUZEVGl4SlFVRkpMRU5CUVVNc1NVRkJUQ3hEUVVGVkxFZEJRVlk3VFVGR1JpeERRVVJHT3p0SlFVdEJMRWxCUVVjc1EwRkJTU3hIUVVGSExFTkJRVU1zU1VGQldEdE5RVU5GTEVkQlFVY3NRMEZCUXl4SFFVRktMRU5CUVZFc1RVRkJVaXhGUVVGblFpeFRRVUZETEV0QlFVUXNSVUZCVVN4SlFVRlNPMEZCUTJRc1dVRkJRVHRSUVVGQkxFbEJRVUVzUjBGQlR5eEZRVUZGTEVOQlFVTXNTMEZCU3l4RFFVRkRMRVZCUVZRc1EwRkJXU3hKUVVGYUxFVkJRV3RDTEVkQlFXeENPMUZCUTFBc1MwRkJTeXhEUVVGRExFZEJRVTRzUTBGQlZTeExRVUZXTEVWQlFXbENMRXRCUVdwQ0xFVkJRWGRDTEVsQlFYaENPMlZCUTBFN1RVRklZeXhEUVVGb1FpeEZRVVJHT3p0WFFVMUJPMFZCWkdFc1EwRkJaanRGUVd0Q1FTeEhRVUZITEVOQlFVTXNSMEZCU2l4RFFVRlJMRTFCUVZJc1JVRkJaMElzVTBGQlF5eExRVUZFTEVWQlFWRXNTMEZCVWl4RlFVRmxMRWxCUVdZN1FVRkRaQ3hSUVVGQk8wbEJRVUVzU1VGQlJ5eExRVUZCTEVkQlFWRXNRMEZCV0R0TlFVRnJRaXhMUVVGQkxFZEJRVkVzUlVGQk1VSTdPMGxCUTBFc1NVRkJSeXhMUVVGQkxFZEJRVkVzUTBGQldEdE5RVUZyUWl4TFFVRkJMRWRCUVZFc1JVRkJNVUk3TzBsQlEwRXNTVUZCUnl4WFFVRkJMRWRCUVdNc1EwRkJaQ3hKUVVGdlFpeExRVUZCTEVkQlFVMHNRMEZCVGl4SFFVRlZMRmRCUVdwRE8wRkJRV3RFTEZsQlFWVXNTVUZCUVN4TFFVRkJMRU5CUVUwc2QwUkJRVUVzUjBGQk1rUXNTMEZCTTBRc1IwRkJiVVVzUjBGQmJrVXNSMEZCZVVVc1MwRkJla1VzUjBGQmFVWXNTVUZCZGtZc1JVRkJOVVE3TzBsQlJVRXNSMEZCUVN4SFFVRk5MRWRCUVVjc1EwRkJReXhIUVVGS0xFTkJRVkVzUzBGQlVqdEpRVVZPTEVsQlFVRXNSMEZCVHl4TFFVRkxMRU5CUVVNc1IwRkJUaXhEUVVGVkxFdEJRVllzUlVGQmFVSXNTMEZCYWtJN1NVRkZVQ3hKUVVGSExFTkJRVWtzU1VGQlVEdE5RVU5GTEVOQlFVRXNSMEZCU1R0QlFVTktMR0ZCUVUwc1EwRkJRU3hIUVVGSkxFdEJRVlk3VVVGRFJTeERRVUZCTEVsQlFVczdVVUZEVEN4SlFVRkhMRU5CUVVFc1MwRkJTeXhMUVVGU08xVkJRMFVzVFVGQlFTeEhRVUZUTEVWQlFVVXNRMEZCUXl4TlFVRklMRU5CUVZVN1dVRkJReXhMUVVGQkxFVkJRVThzVVVGQlVTeERRVUZETEV0QlFXcENPMWRCUVZZc1JVRkJiVU1zU1VGQmJrTTdWVUZEVkN4SlFVRkJMRWRCUVU4c1IwRkJSeXhEUVVGRExFbEJRVW9zUTBGQlV5eExRVUZVTEVWQlFXZENMRTFCUVdoQ0xFVkJSbFE3VTBGQlFTeE5RVUZCTzFWQlNVVXNUMEZCUVN4SFFVRlZMRXRCUVVzc1EwRkJReXhIUVVGT0xFTkJRVlVzUzBGQlZpeEZRVUZwUWl4RFFVRnFRanRWUVVOV0xFbEJRVWNzUTBGQlNTeFBRVUZRTzFsQlEwVXNUMEZCUVN4SFFVRlhMRWRCUVVjc1EwRkJReXhKUVVGS0xFTkJRVk1zUTBGQlZDeEZRVUZaTzJOQlFVRXNTMEZCUVN4RlFVRlBMRkZCUVZFc1EwRkJReXhMUVVGb1FqdGhRVUZhTEVWQlJHSTdWMEZNUmpzN1RVRkdSaXhEUVVaR096dFhRVmxCTzBWQmNrSmpMRU5CUVdoQ08wVkJlVUpCTEVsQlFVRXNRMEZCUVR0RlFVbEJMRWRCUVVjc1EwRkJReXhIUVVGS0xFTkJRVkVzVDBGQlVpeEZRVUZwUWl4TFFVRnFRanRGUVVsQkxFZEJRVWNzUTBGQlF5eEhRVUZLTEVOQlFWRXNUMEZCVWl4RlFVRnBRaXhMUVVGcVFqdFRRVWxCTzBGQmFFeExPenRCUVd0TVVDeEZRVUZGTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZRc1EwRkJhMElzVVVGQmJFSXNSVUZCTkVJc1NVRkJOVUk3TzBGQlEwRXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklrOUtJRDBnY21WeGRXbHlaU0FuTGk0dmIyb25YSEpjYm01dlpHVkdZV04wYjNKNUlEMGdjbVZ4ZFdseVpTQW5MaTR2Wkc5dEwyNXZaR1ZHWVdOMGIzSjVKMXh5WEc1ZklEMGdjbVZ4ZFdseVpTQW5iRzlrWVhOb0oxeHlYRzVoY25KaGVUSkVJRDBnY21WeGRXbHlaU0FuTGk0dmRHOXZiSE12WVhKeVlYa3lSQ2RjY2x4dUpDQTlJSEpsY1hWcGNtVWdKMnB4ZFdWeWVTZGNjbHh1U25OdmJsUnZWR0ZpYkdVZ1BTQnlaWEYxYVhKbElDY3VMaTkwYjI5c2N5OUtjMjl1Vkc5VVlXSnNaU2RjY2x4dVhISmNiaU1nSXlCMFlXSnNaVnh5WEc1Y2NseHVibTlrWlU1aGJXVWdQU0FuZEdGaWJHVW5YSEpjYmx4eVhHNGpJeU5jY2x4dVEzSmxZWFJsSUdGdUlFaFVUVXdnZEdGaWJHVXVJRkJ5YjNacFpHVnpJR2hsYkhCbGNpQnRaWFJvYjJSeklIUnZJR055WldGMFpTQkRiMngxYlc1eklHRnVaQ0JEWld4c2N5NWNjbHh1SXlNalhISmNibTV2WkdVZ1BTQW9iM0IwYVc5dWN5d2diM2R1WlhJZ1BTQlBTaTVpYjJSNUxDQmpZV3hzWldSR2NtOXRSbUZqZEc5eWVTQTlJR1poYkhObEtTQXRQbHh5WEc1Y2NseHVJQ0FqSUNNaklHOXdkR2x2Ym5OY2NseHVJQ0JrWldaaGRXeDBjeUE5WEhKY2JpQWdJQ0FqSUNNakl5QmtZWFJoWEhKY2JpQWdJQ0FqSUc5d2RHbHZibUZzSUdGeWNtRjVJRzltSUc5aWFtVmpkSE11SUdsbUlIQnliM1pwWkdWa0lIZHBiR3dnWjJWdVpYSmhkR1VnZEdGaWJHVWdZWFYwYjIxaGRHbGpZV3hzZVM1Y2NseHVJQ0FnSUdSaGRHRTZJRzUxYkd4Y2NseHVJQ0FnSUNNZ0l5TWpJSEJ5YjNCelhISmNiaUFnSUNBaklHOXdkR2x2Ym1Gc0lIQnliM0JsY25ScFpYTWdkRzhnWVhCd2JIa2dkRzhnZEdGaWJHVWdjbTl2ZENCdWIyUmxYSEpjYmlBZ0lDQndjbTl3Y3pwY2NseHVJQ0FnSUNBZ1kyVnNiSEJoWkdScGJtYzZJREJjY2x4dUlDQWdJQ0FnWTJWc2JITndZV05wYm1jNklEQmNjbHh1SUNBZ0lDQWdZV3hwWjI0NklDY25YSEpjYmlBZ0lDQWdJSGRwWkhSb09pQW5KMXh5WEc0Z0lDQWdJQ0JqWld4c1lXeHBaMjQ2SUNkc1pXWjBKMXh5WEc0Z0lDQWdJQ0JqWld4c2RtRnNhV2R1T2lBbmRHOXdKMXh5WEc0Z0lDQWdJQ0JqYkdGemN6b2dKeWRjY2x4dUlDQWdJSE4wZVd4bGN6b2dlMzFjY2x4dUlDQWdJR1YyWlc1MGN6b2dlMzFjY2x4dUlDQWdJQ01nSXlNaklHTmxiR3h6WEhKY2JpQWdJQ0FqSUc5d2RHbHZibUZzSUhCeWIzQmxjblJwWlhNZ2RHOGdZWEJ3YkhrZ2RHOGdhVzVrYVhacFpIVmhiQ0JqWld4c2MxeHlYRzRnSUNBZ1kyVnNiSE02WEhKY2JpQWdJQ0FnSUdOc1lYTnpPaUFuSjF4eVhHNGdJQ0FnSUNCaGJHbG5iam9nSnlkY2NseHVJQ0FnSUNBZ0ozWmxjblJwWTJGc0xXRnNhV2R1SnpvZ0p5ZGNjbHh1SUNBZ0lDQWdZMlZzYkhCaFpHUnBibWM2SUNjblhISmNiaUFnSUNBZ0lHMWhjbWRwYmpvZ0p5ZGNjbHh1SUNBZ0lDTWdJeU1qSUhSb1pXRmtYSEpjYmlBZ0lDQWpJRzl3ZEdsdmJtRnNJRzl3ZEdsdmJuTWdiMkpxWldOMElIUnZJSEJoYzNNZ2FXNTBieUIwYUdWaFpDQmpjbVZoZEdsdmJseHlYRzRnSUNBZ2RHaGxZV1E2SUh0OVhISmNiaUFnSUNBaklDTWpJeUIwWW05a2VWeHlYRzRnSUNBZ0l5QnZjSFJwYjI1aGJDQnZjSFJwYjI1eklHOWlhbVZqZENCMGJ5QndZWE56SUdsdWRHOGdkR0p2WkhrZ1kzSmxZWFJwYjI1Y2NseHVJQ0FnSUhSaWIyUjVPaUI3ZlZ4eVhHNWNjbHh1SUNBZ0lHWnBjbk4wUVd4cFoyNVNhV2RvZERvZ1ptRnNjMlZjY2x4dUlDQWdJRzlrWkVGc2FXZHVVbWxuYUhRNklHWmhiSE5sWEhKY2JseHlYRzRnSUhKdmQzTWdQU0JiWFZ4eVhHNGdJR05sYkd4eklEMGdZWEp5WVhreVJDZ3BYSEpjYmlBZ1kyOXNkVzF1UTI5MWJuUWdQU0F3WEhKY2JseHlYRzRnSUU5S0xtVjRkR1Z1WkNCa1pXWmhkV3gwY3l3Z2IzQjBhVzl1Y3l3Z2RISjFaVnh5WEc0Z0lISmxkQ0E5SUc1dlpHVkdZV04wYjNKNUlHNXZaR1ZPWVcxbExDQmtaV1poZFd4MGN5d2diM2R1WlhJc0lHTmhiR3hsWkVaeWIyMUdZV04wYjNKNVhISmNiaUJjY2x4dVhISmNiaUFnZEdKdlpIa2dQU0J1ZFd4c1hISmNiaUFnZEdobFlXUWdQU0J1ZFd4c1hISmNiaUFnZEdobFlXUlNiM2NnUFNCdWRXeHNYSEpjYmx4eVhHNGdJQ01nSXlNaklHbHVhWFJjY2x4dUlDQWpJR2x1ZEdWeWJtRnNJRzFsZEdodlpDQm1iM0lnYjI1bElIUnBiV1VnYVc1cGRHbGhiR2w2WVhScGIyNGdiMllnZEdobElIUmhZbXhsWEhKY2JpQWdhVzVwZENBOUlGOHViMjVqWlNBdFBseHlYRzRnSUNBZ2FXWWdaR1ZtWVhWc2RITXVaR0YwWVZ4eVhHNGdJQ0FnSUNCcU1uUWdQU0J1WlhjZ1NuTnZibFJ2VkdGaWJHVWdaR1ZtWVhWc2RITXVaR0YwWVZ4eVhHNGdJQ0FnSUNCMFlteFRkSElnUFNCcU1uUXVkR0ZpYkdWY2NseHVJQ0FnSUdsbUlIUmliRk4wY2x4eVhHNGdJQ0FnSUNCcVZHSnNJRDBnSkNCMFlteFRkSEpjY2x4dVhISmNiaUFnSUNBZ0lHcElaV0ZrSUQwZ2FsUmliQzVtYVc1a0lDZDBhR1ZoWkNkY2NseHVJQ0FnSUNBZ2NtVjBMaVF1WVhCd1pXNWtJR3BJWldGa1hISmNiaUFnSUNBZ0lIUm9aV0ZrSUQwZ1pXd3VjbVZ6ZEc5eVpVVnNaVzFsYm5RZ2FraGxZV1JiTUYxY2NseHVJQ0FnSUNBZ2RHaGxZV1JTYjNjZ1BTQmxiQzV5WlhOMGIzSmxSV3hsYldWdWRDQjBhR1ZoWkZzd1hTNXliM2R6V3pCZFhISmNibHh5WEc0Z0lDQWdJQ0JxUW05a2VTQTlJR3BVWW13dVptbHVaQ0FuZEdKdlpIa25YSEpjYmlBZ0lDQWdJSEpsZEM0a0xtRndjR1Z1WkNCcVFtOWtlVnh5WEc0Z0lDQWdJQ0IwWW05a2VTQTlJR1ZzTG5KbGMzUnZjbVZGYkdWdFpXNTBJR3BDYjJSNVd6QmRYSEpjYmx4eVhHNGdJQ0FnSUNCc2IyRmtRMlZzYkhNb0tWeHlYRzRnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0IwYUdWaFpDQTlJSEpsZEM1dFlXdGxJQ2QwYUdWaFpDY3NJR1JsWm1GMWJIUnpMblJvWldGa1hISmNiaUFnSUNBZ0lIUm9aV0ZrVW05M0lEMGdkR2hsWVdRdWJXRnJaU0FuZEhJblhISmNiaUFnSUNBZ0lIUmliMlI1SUQwZ2NtVjBMbTFoYTJVZ0ozUmliMlI1Snl3Z1pHVm1ZWFZzZEhNdWRHSnZaSGxjY2x4dUlDQWdJQ0FnY205M2N5NXdkWE5vSUhSaWIyUjVMbTFoYTJVZ0ozUnlKMXh5WEc0Z0lDQWdjbVYwWEhKY2JseHlYRzRnSUNNZ0l5TWpJR3h2WVdSRFpXeHNjMXh5WEc0Z0lDTWdhVzUwWlhKdVlXd2diV1YwYUc5a0lHZDFZWEpoYm5SbFpYTWdkR2hoZENCMFlXSnNaWE1nYkc5aFpHVmtJR1p5YjIwZ1NsTlBUaUJoY21VZ1puVnNiSGtnYkc5aFpHVmtJR2x1ZEc4Z2JXVnRiM0o1WEhKY2JpQWdiRzloWkVObGJHeHpJRDBnS0NrZ0xUNWNjbHh1SUNBZ0lISWdQU0F3WEhKY2JpQWdJQ0IzYUdsc1pTQjBZbTlrZVZzd1hTNXliM2R6TG14bGJtZDBhQ0ErSUhKY2NseHVJQ0FnSUNBZ1l5QTlJREJjY2x4dUlDQWdJQ0FnYldWdFVtOTNJRDBnWld3dWNtVnpkRzl5WlVWc1pXMWxiblFnZEdKdlpIbGJNRjB1Y205M2MxdHlYVnh5WEc0Z0lDQWdJQ0J5YjNkekxuQjFjMmdnYldWdFVtOTNYSEpjYmlBZ0lDQWdJSGRvYVd4bElIUmliMlI1V3pCZExuSnZkM05iY2wwdVkyVnNiSE11YkdWdVozUm9JRDRnWTF4eVhHNGdJQ0FnSUNBZ0lHMWxiVU5sYkd3Z1BTQmpaV3hzY3k1blpYUWdjaXN4TENCakt6RmNjbHh1SUNBZ0lDQWdJQ0JwWmlCdWIzUWdiV1Z0UTJWc2JGeHlYRzRnSUNBZ0lDQWdJQ0FnYldWdFEyVnNiQ0E5SUdWc0xuSmxjM1J2Y21WRmJHVnRaVzUwSUhSaWIyUjVXekJkTG5KdmQzTmJjbDB1WTJWc2JITmJZMTFjY2x4dUlDQWdJQ0FnSUNBZ0lHTmxiR3h6TG5ObGRDQnlLekVzSUdNck1Td2diV1Z0UTJWc2JGeHlYRzRnSUNBZ0lDQWdJR01nS3owZ01WeHlYRzRnSUNBZ0lDQnlJQ3M5SURGY2NseHVYSEpjYmlBZ0l5QWpJeU1nWm1sc2JFMXBjM05wYm1kY2NseHVJQ0FqSUdsdWRHVnlibUZzSUcxbGRHaHZaQ0JuZFdGeVlXNTBaV1Z6SUhSb1lYUWdZMlZzYkhNZ1pYaHBjM1FnWm05eUlIUm9aU0JrYVcxbGJuTnBiMjV6SUc5bUlIUm9aU0IwWVdKc1pWeHlYRzRnSUdacGJHeE5hWE56YVc1bklEMGdLQ2tnTFQ1Y2NseHVJQ0FnSUdObGJHeHpMbVZoWTJnZ0tISnZkMDV2TENCamIyeE9ieXdnZG1Gc0tTQXRQbHh5WEc0Z0lDQWdJQ0JwWmlCdWIzUWdkbUZzWEhKY2JpQWdJQ0FnSUNBZ2NtOTNJRDBnY21WMExuSnZkeUJ5YjNkT2IxeHlYRzRnSUNBZ0lDQWdJSEp2ZHk1alpXeHNJR052YkU1dkxDQjdmVnh5WEc1Y2NseHVJQ0FqSUNNaklHTnZiSFZ0Ymx4eVhHNGdJQ01nUVdSa2N5QmhJR052YkhWdGJpQnVZVzFsSUhSdklIUm9aU0IwWVdKc1pTQm9aV0ZrWEhKY2JpQWdjbVYwTG1Ga1pDQW5ZMjlzZFcxdUp5d2dLR052YkU1dkxDQmpiMnhPWVcxbEtTQXRQbHh5WEc0Z0lDQWdjbVYwTG1sdWFYUW9LVnh5WEc0Z0lDQWdZMjlzZFcxdVEyOTFiblFnS3owZ01WeHlYRzRnSUNBZ2RHZ2dQU0J1ZFd4c1hISmNiaUFnSUNCcElEMGdNRnh5WEc0Z0lDQWdkMmhwYkdVZ2RHaGxZV1JiTUYwdWNtOTNjMXN3WFM1alpXeHNjeTVzWlc1bmRHZ2dQQ0JqYjJ4T2IxeHlYRzRnSUNBZ0lDQnVZWFJwZG1WVWFDQTlJSFJvWldGa1d6QmRMbkp2ZDNOYk1GMHVZMlZzYkhOYmFWMWNjbHh1SUNBZ0lDQWdhV1lnYm05MElHNWhkR2wyWlZSb1hISmNiaUFnSUNBZ0lDQWdkR2dnUFNCMGFHVmhaRkp2ZHk1dFlXdGxJQ2QwYUNjc0lIdDlYSEpjYmlBZ0lDQWdJR1ZzYzJWY2NseHVJQ0FnSUNBZ0lDQjBhQ0E5SUdWc0xuSmxjM1J2Y21WRmJHVnRaVzUwSUc1aGRHbDJaVlJvTENBbmRHZ25YSEpjYmlBZ0lDQWdJR2tnS3owZ01WeHlYRzRnSUNBZ2FXWWdibTkwSUhSb1hISmNiaUFnSUNBZ0lHNWhkR2wyWlZSb0lEMGdkR2hsWVdSYk1GMHVjbTkzYzFzd1hTNWpaV3hzYzF0amIyeE9ieTB4WFZ4eVhHNGdJQ0FnSUNCMGFDQTlJR1ZzTG5KbGMzUnZjbVZGYkdWdFpXNTBJRzVoZEdsMlpWUm9MQ0FuZEdnblhISmNiaUFnSUNCMGFDNTBaWGgwSUdOdmJFNWhiV1ZjY2x4dUlDQWdJSFJvWEhKY2JseHlYRzRnSUNNZ0l5TWdjbTkzWEhKY2JpQWdJeUJCWkdSeklHRWdibVYzSUhKdmR5QW9kSElwSUhSdklIUm9aU0IwWVdKc1pTQmliMlI1WEhKY2JpQWdjbVYwTG1Ga1pDQW5jbTkzSnl3Z0tISnZkMDV2TENCdmNIUnpLU0F0UGx4eVhHNGdJQ0FnY205M0lEMGdjbTkzYzF0eWIzZE9ieTB4WFZ4eVhHNWNjbHh1SUNBZ0lHbG1JRzV2ZENCeWIzZGNjbHh1SUNBZ0lDQWdkMmhwYkdVZ2NtOTNjeTVzWlc1bmRHZ2dQQ0J5YjNkT2IxeHlYRzRnSUNBZ0lDQWdJSEp2ZHlBOUlIUmliMlI1TG0xaGEyVWdKM1J5Snl3Z2UzMWNjbHh1SUNBZ0lDQWdJQ0J5YjNkekxuQjFjMmdnY205M1hISmNibHh5WEc0Z0lDQWdhV1lnYm05MElISnZkeTVqWld4c1hISmNiaUFnSUNBZ0lISnZkeTVoWkdRZ0oyTmxiR3duTENBb1kyOXNUbThzSUc5d2RITXBJQzArWEhKY2JpQWdJQ0FnSUNBZ1kyVnNiQ0E5SUU5S0xtNXZaR1Z6TG5Sa0lHOXdkSE1zSUhKdmQxeHlYRzRnSUNBZ0lDQWdJR05sYkd4ekxuTmxkQ0J5YjNkT2J5d2dZMjlzVG04c0lHTmxiR3hjY2x4dUlDQWdJQ0FnSUNCalpXeHNYSEpjYmx4eVhHNGdJQ0FnY205M1hISmNibHh5WEc0Z0lDTWdJeU1nWTJWc2JGeHlYRzRnSUNNZ1FXUmtjeUJoSUdObGJHd2dLSFJ5TDNSa0tTQjBieUIwYUdVZ2RHRmliR1VnWW05a2VWeHlYRzRnSUhKbGRDNWhaR1FnSjJObGJHd25MQ0FvY205M1RtOHNJR052YkU1dkxDQnZjSFJ6S1NBdFBseHlYRzRnSUNBZ2FXWWdjbTkzVG04Z1BDQXhJSFJvWlc0Z2NtOTNUbThnUFNBeFhISmNiaUFnSUNCcFppQmpiMnhPYnlBOElERWdkR2hsYmlCamIyeE9ieUE5SURGY2NseHVJQ0FnSUdsbUlHTnZiSFZ0YmtOdmRXNTBJRDRnTUNCaGJtUWdZMjlzVG04dE1TQStJR052YkhWdGJrTnZkVzUwSUhSb1pXNGdkR2h5YjNjZ2JtVjNJRVZ5Y205eUlDZEJJR052YkhWdGJpQnVZVzFsSUdoaGN5QnViM1FnWW1WbGJpQmtaV1pwYm1Wa0lHWnZjaUIwYUdseklIQnZjMmwwYVc5dUlIc25JQ3NnY205M1RtOGdLeUFuZUNjZ0t5QmpiMnhPYnlBcklDZDlMaWRjY2x4dVhISmNiaUFnSUNCeWIzY2dQU0J5WlhRdWNtOTNJSEp2ZDA1dlhISmNibHh5WEc0Z0lDQWdZMlZzYkNBOUlHTmxiR3h6TG1kbGRDQnliM2RPYnl3Z1kyOXNUbTljY2x4dVhISmNiaUFnSUNCcFppQnViM1FnWTJWc2JGeHlYRzRnSUNBZ0lDQnBJRDBnTUZ4eVhHNGdJQ0FnSUNCM2FHbHNaU0JwSUR3Z1kyOXNUbTljY2x4dUlDQWdJQ0FnSUNCcElDczlJREZjY2x4dUlDQWdJQ0FnSUNCcFppQnBJR2x6SUdOdmJFNXZYSEpjYmlBZ0lDQWdJQ0FnSUNCdWRVOXdkSE1nUFNCUFNpNWxlSFJsYm1RZ2UzQnliM0J6T2lCa1pXWmhkV3gwY3k1alpXeHNjMzBzSUc5d2RITmNjbHh1SUNBZ0lDQWdJQ0FnSUdObGJHd2dQU0J5YjNjdVkyVnNiQ0JqYjJ4T2J5d2diblZQY0hSelhISmNiaUFnSUNBZ0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNBZ0lDQWdkSEo1UTJWc2JDQTlJR05sYkd4ekxtZGxkQ0J5YjNkT2J5d2dhVnh5WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdibTkwSUhSeWVVTmxiR3hjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkSEo1UTJWc2JDQTlJQ0J5YjNjdVkyVnNiQ0JwTENCd2NtOXdjem9nWkdWbVlYVnNkSE11WTJWc2JITmNjbHh1WEhKY2JpQWdJQ0JqWld4c1hISmNibHh5WEc0Z0lDTWdJeU1nUm1sdVlXeHBlbVZjY2x4dUlDQWpJRVpwYm1Gc2FYcGxJR2QxWVhKaGJuUmxaWE1nZEdoaGRDQjBhR1ZoWkNCaGJtUWdkR0p2WkhrZ1lXNWtJR055WldGMFpXUWdkMmhsYmlCMGFHVWdibTlrWlNCcGN5Qm1kV3hzZVNCcGJuTjBZVzUwYVdGMFpXUmNjbHh1SUNCcGJtbDBLQ2xjY2x4dVhISmNiaUFnSXlBakl5QlVTR1ZoWkZ4eVhHNGdJQ01nUlhod2IzTmxJSFJvWlNCcGJuUmxjbTVoYkNCMGFHVmhaQ0J1YjJSbFhISmNiaUFnY21WMExtRmtaQ0FuZEdobFlXUW5MQ0IwYUdWaFpGeHlYRzVjY2x4dUlDQWpJQ01qSUZSQ2IyUjVYSEpjYmlBZ0l5QkZlSEJ2YzJVZ2RHaGxJR2x1ZEdWeWJtRnNJSFJpYjJSNUlHNXZaR1ZjY2x4dUlDQnlaWFF1WVdSa0lDZDBZbTlrZVNjc0lIUmliMlI1WEhKY2JseHlYRzRnSUNBZ1hISmNibHh5WEc0Z0lISmxkRnh5WEc1Y2NseHVUMG91Ym05a1pYTXVjbVZuYVhOMFpYSWdibTlrWlU1aGJXVXNJRzV2WkdWY2NseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQnViMlJsWEhKY2JpSmRmUT09IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXHJcblxyXG5ub2RlTmFtZSA9ICd0ZXh0YXJlYSdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgbmFtZTogJydcclxuICAgICAgcGxhY2Vob2xkZXI6ICcnXHJcbiAgICAgIHZhbHVlOiAnJ1xyXG4gICAgICB0ZXh0OiAnJ1xyXG4gICAgICBtYXhsZW5ndGg6ICcnXHJcbiAgICAgIGF1dG9mb2N1czogZmFsc2VcclxuICAgICAgaXNSZXF1aXJlZDogZmFsc2VcclxuICAgICAgcm93czogM1xyXG4gICAgICBjb2xzOiAyNVxyXG4gICAgICBkaXNhYmxlZDogZmFsc2VcclxuICAgICAgcmVhZG9ubHk6IGZhbHNlXHJcbiAgICAgIGZvcm06ICcnXHJcbiAgICAgIHdyYXA6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICB2YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICBzd2l0Y2ggZGVmYXVsdHMucHJvcHMudHlwZVxyXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMuY2hlY2tib3hcclxuICAgICAgICB2YWx1ZSA9IHJldC4kLmlzKCc6Y2hlY2tlZCcpXHJcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5yYWRpb1xyXG4gICAgICAgIHZhbHVlID0gcmV0LiQuZmluZCgnOmNoZWNrZWQnKS52YWwoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdmFsdWUgPSByZXQudmFsKClcclxuXHJcbiAgIyBDbGljayBiaW5kaW5nXHJcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICByZXR2YWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXHJcblxyXG4gICMgQ2hhbmdlIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2hhbmdlIGlzbnQgT0oubm9vcFxyXG4gICAgY2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gICAgbmV3Q2hhbmdlID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICByZXR2YWwgPSBjaGFuZ2UgZXZlbnQuLi5cclxuICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgcmV0dmFsXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2hhbmdlID0gbmV3Q2hhbmdlXHJcblxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxubm9kZU5hbWUgPSAndGhlYWQnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBudW1iZXI6IDFcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gIHJvd3MgPSBbXVxyXG4gIGNlbGxzID0ge31cclxuICByZXQuYWRkICdjZWxsJywgKHJvd05vLCBjb2xObykgLT5cclxuICAgIGluaXQoKVxyXG5cclxuICAgIGlmIHJvd05vIDwgMSB0aGVuIHJvd05vID0gMVxyXG4gICAgaWYgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXHJcblxyXG4gICAgcm93ID0gcm93c1tyb3dOby0xXVxyXG5cclxuICAgIGlmIG5vdCByb3dcclxuICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xyXG4gICAgICAgIHJvdyA9IE9KLm5vZGVzLnRyIHt9LCB0Ym9keSwgZmFsc2VcclxuICAgICAgICByb3dzLnB1c2ggcm93XHJcblxyXG4gICAgdGQgPSByb3dbMF0uY2VsbHNbY29sTm9dXHJcblxyXG4gICAgaWYgdGQgdGhlbiBjZWxsID0gZWwucmVzdG9yZUVsZW1lbnQgdGQsICd0ZCdcclxuICAgIGlmIG5vdCB0ZFxyXG4gICAgICB3aGlsZSByb3dbMF0uY2VsbHMubGVuZ3RoIDwgY29sTm9cclxuICAgICAgICBpZHggPSByb3dbMF0uY2VsbHMubGVuZ3RoXHJcbiAgICAgICAgdGQgPSByb3dbMF0uY2VsbHNbaWR4LTFdXHJcbiAgICAgICAgaWYgdGQgYW5kIGlkeCBpcyBjb2xOb1xyXG4gICAgICAgICAgY2VsbCA9IGVsLnJlc3RvcmVFbGVtZW50IHRkLCAndGQnXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgY2VsbCA9IE9KLm5vZGVzLnRkIHByb3BzOiBkZWZhdWx0cy5jZWxscywgcm93LCBmYWxzZVxyXG5cclxuICAgIGlmIG5vdCBjZWxsLmlzVmFsaWRcclxuICAgICAgbm9kZUZhY3RvcnkgY2VsbCwgcm93LCByb3dObyArIGNvbE5vXHJcblxyXG4gICAgY2VsbFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbm5vZGVOYW1lID0gJ3VsJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOiB7fVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgdGhpc0dsb2JhbDtcblxudGhpc0dsb2JhbCA9ICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyAmJiBnbG9iYWwgPyBnbG9iYWwgOiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmIHNlbGYgPyBzZWxmIDogKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdyA/IHdpbmRvdyA6IHRoaXMpKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGhpc0dsb2JhbDtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRnhuYkc5aVlXd3VZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRU3hKUVVGQk96dEJRVUZCTEZWQlFVRXNSMEZCWVN4RFFVRkxMRTlCUVU4c1RVRkJVQ3hMUVVGdFFpeFhRVUZ1UWl4SlFVRnRReXhOUVVGMlF5eEhRVUZ2UkN4TlFVRndSQ3hIUVVGblJTeERRVUZMTEU5QlFVOHNTVUZCVUN4TFFVRnBRaXhYUVVGcVFpeEpRVUZwUXl4SlFVRnlReXhIUVVGblJDeEpRVUZvUkN4SFFVRXdSQ3hEUVVGTExFOUJRVThzVFVGQlVDeExRVUZ0UWl4WFFVRnVRaXhKUVVGdFF5eE5RVUYyUXl4SFFVRnZSQ3hOUVVGd1JDeEhRVUZuUlN4SlFVRnFSU3hEUVVFelJDeERRVUZxUlRzN1FVRkRZaXhOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWlJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lkR2hwYzBkc2IySmhiQ0E5SUNocFppQW9kSGx3Wlc5bUlHZHNiMkpoYkNCcGMyNTBJQ2QxYm1SbFptbHVaV1FuSUdGdVpDQm5iRzlpWVd3cElIUm9aVzRnWjJ4dlltRnNJR1ZzYzJVZ0tHbG1JQ2gwZVhCbGIyWWdjMlZzWmlCcGMyNTBJQ2QxYm1SbFptbHVaV1FuSUdGdVpDQnpaV3htS1NCMGFHVnVJSE5sYkdZZ1pXeHpaU0FvYVdZZ0tIUjVjR1Z2WmlCM2FXNWtiM2NnYVhOdWRDQW5kVzVrWldacGJtVmtKeUJoYm1RZ2QybHVaRzkzS1NCMGFHVnVJSGRwYm1SdmR5QmxiSE5sSUhSb2FYTXBLU2xjY2x4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCMGFHbHpSMnh2WW1Gc0lsMTkiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnYnV0dG9uaW5wdXQnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6ICdidXR0b24nXHJcbiAgICAgIHNyYzogJydcclxuICAgICAgYWx0OiAnJ1xyXG4gICAgICBoZWlnaHQ6ICcnXHJcbiAgICAgIHdpZHRoOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBvYmouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnY2hlY2tib3gnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgY2hlY2tlZDogZmFsc2VcclxuICAgIGluZGV0ZXJtaW5hdGU6IGZhbHNlXHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgaWYgZGVmYXVsdHMuY2hlY2tlZFxyXG4gICAgcmV0LmF0dHIgJ2NoZWNrZWQnLCB0cnVlXHJcbiAgZWxzZSBpZiBkZWZhdWx0cy5pbmRldGVybWluYXRlXHJcbiAgICByZXQuYXR0ciAnaW5kZXRlcm1pbmF0ZScsIHRydWVcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdjb2xvcidcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdkYXRlJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdkYXRldGltZSdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ2RhdGV0aW1lLWxvY2FsJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnZW1haWwnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBtdWx0aXBsZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnZmlsZSdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIGFjY2VwdDogJydcclxuICAgICAgbXVsdGlwbGU6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ2hpZGRlbidcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ2ltYWdlaW5wdXQnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6ICdpbWFnZSdcclxuICAgICAgc3JjOiAnJ1xyXG4gICAgICBhbHQ6ICcnXHJcbiAgICAgIGhlaWdodDogJydcclxuICAgICAgd2lkdGg6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ21vbnRoJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnbnVtYmVyJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAncGFzc3dvcmQnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBtYXhsZW5ndGg6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3JhZGlvJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgbmFtZTogJydcclxuICAgICAgdmFsdWU6ICcnXHJcbiAgICAgIGNoZWNrZWQ6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3JhbmdlJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgbWluOiAwXHJcbiAgICAgIG1heDogMTAwXHJcbiAgICAgIHZhbHVlOiA1MFxyXG4gICAgICBzdGVwOiAxXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3Jlc2V0J1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnc2VhcmNoJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnc3VibWl0J1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAndGVsJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgcGF0dGVybjogJydcclxuICAgICAgbWF4bGVuZ3RoOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICd0ZXh0aW5wdXQnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6ICd0ZXh0J1xyXG4gICAgICBhdXRvY29tcGxldGU6ICdvbidcclxuICAgICAgYXV0b3NhdmU6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3RpbWUnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICd1cmwnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBwYXR0ZXJuOiAnJ1xyXG4gICAgICBtYXhsZW5ndGg6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3dlZWsnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgTnNUcmVlLCBtYWtlVGhlSnVpY2UsIG5hbWVTcGFjZU5hbWUsIHRoaXNEb2N1bWVudCwgdGhpc0dsb2JhbCwgdXRpbExpYjtcblxudGhpc0dsb2JhbCA9IHJlcXVpcmUoJy4vZ2xvYmFsJyk7XG5cbnV0aWxMaWIgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cbm5hbWVTcGFjZU5hbWUgPSAnT0onO1xuXG5cbi8qXG5ib290IHN0cmFwIG5hbWUgbWV0aG9kIGludG8gT2JqZWN0IHByb3RvdHlwZVxuICovXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE9iamVjdC5wcm90b3R5cGUsIHtcbiAgZ2V0SW5zdGFuY2VOYW1lOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZ1bmNOYW1lUmVnZXgsIHJlc3VsdHM7XG4gICAgICBmdW5jTmFtZVJlZ2V4ID0gL2Z1bmN0aW9uICguezEsfSlcXCgvO1xuICAgICAgcmVzdWx0cyA9IGZ1bmNOYW1lUmVnZXguZXhlYyh0aGlzLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpO1xuICAgICAgaWYgKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRzWzFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cblxuLypcbkFuIGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBuYW1lc3BhY2UgdHJlZVxuICovXG5cbk5zVHJlZSA9IHt9O1xuXG5tYWtlVGhlSnVpY2UgPSBmdW5jdGlvbigpIHtcblxuICAvKlxuICBJbnRlcm5hbCBuYW1lU3BhY2VOYW1lIG1ldGhvZCB0byBjcmVhdGUgbmV3ICdzdWInIG5hbWVzcGFjZXMgb24gYXJiaXRyYXJ5IGNoaWxkIG9iamVjdHMuXG4gICAqL1xuICB2YXIgTnNPdXQsIGRlcGVuZHNPbiwgbWFrZU5hbWVTcGFjZSwgbnNJbnRlcm5hbDtcbiAgbWFrZU5hbWVTcGFjZSA9IGZ1bmN0aW9uKHNwYWNlbmFtZSwgdHJlZSkge1xuXG4gICAgLypcbiAgICBUaGUgZGVyaXZlZCBpbnN0YW5jZSB0byBiZSBjb25zdHJ1Y3RlZFxuICAgICAqL1xuICAgIHZhciBCYXNlLCBDbGFzcztcbiAgICBCYXNlID0gZnVuY3Rpb24obnNOYW1lKSB7XG4gICAgICB2YXIgbWVtYmVycywgbnNUcmVlLCBwcm90bztcbiAgICAgIHByb3RvID0gdGhpcztcbiAgICAgIHRyZWVbbnNOYW1lXSA9IHRyZWVbbnNOYW1lXSB8fCB7fTtcbiAgICAgIG5zVHJlZSA9IHRyZWVbbnNOYW1lXTtcbiAgICAgIG1lbWJlcnMgPSB7fTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWVtYmVycycsIHtcbiAgICAgICAgdmFsdWU6IG1lbWJlcnNcblxuICAgICAgICAvKlxuICAgICAgICBSZWdpc3RlciAoZS5nLiAnTGlmdCcpIGFuIE9iamVjdCBpbnRvIHRoZSBwcm90b3R5cGUgb2YgdGhlIG5hbWVzcGFjZS5cbiAgICAgICAgVGhpcyBPYmplY3Qgd2lsbCBiZSByZWFkYWJsZS9leGVjdXRhYmxlIGJ1dCBpcyBvdGhlcndpc2UgaW1tdXRhYmxlLlxuICAgICAgICAgKi9cbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdyZWdpc3RlcicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKG5hbWUsIG9iaiwgZW51bWVyYWJsZSkge1xuICAgICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgICBpZiAoKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykgfHwgbmFtZSA9PT0gJycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIG5hbWUuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghb2JqKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsaWZ0IGEgbmV3IHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBwcm9wZXJ0eSBpbnN0YW5jZS4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHByb3RvW25hbWVdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3BlcnR5IG5hbWVkICcgKyBuYW1lICsgJyBpcyBhbHJlYWR5IGRlZmluZWQgb24gJyArIHNwYWNlbmFtZSArICcuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1lbWJlcnNbbmFtZV0gPSBtZW1iZXJzW25hbWVdIHx8IG5hbWU7XG4gICAgICAgICAgbnNUcmVlW25hbWVdID0gbnNUcmVlW25hbWVdIHx8IHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0eXBlb2Ygb2JqLFxuICAgICAgICAgICAgaW5zdGFuY2U6IChvYmouZ2V0SW5zdGFuY2VOYW1lID8gb2JqLmdldEluc3RhbmNlTmFtZSgpIDogJ3Vua25vd24nKVxuICAgICAgICAgIH07XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBuYW1lLCB7XG4gICAgICAgICAgICB2YWx1ZTogb2JqLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UgIT09IGVudW1lcmFibGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBuc0ludGVybmFsLmFsZXJ0RGVwZW5kZW50cyhuc05hbWUgKyAnLicgKyBzcGFjZW5hbWUgKyAnLicgKyBuYW1lKTtcbiAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLypcbiAgICAgIENyZWF0ZSBhIG5ldywgc3RhdGljIG5hbWVzcGFjZSBvbiB0aGUgY3VycmVudCBwYXJlbnQgKGUuZy4gbnNOYW1lLnRvLi4uIHx8IG5zTmFtZS5pcy4uLilcbiAgICAgICAqL1xuICAgICAgcHJvdG8ucmVnaXN0ZXIoJ21ha2VTdWJOYW1lU3BhY2UnLCAoZnVuY3Rpb24oc3ViTmFtZVNwYWNlKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgdmFyIG5ld05hbWVTcGFjZTtcbiAgICAgICAgaWYgKCh0eXBlb2Ygc3ViTmFtZVNwYWNlICE9PSAnc3RyaW5nJykgfHwgc3ViTmFtZVNwYWNlID09PSAnJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIG5ldyBzdWIgbmFtZXNwYWNlIHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm90by5zdWJOYW1lU3BhY2UpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1YiBuYW1lc3BhY2UgbmFtZWQgJyArIHN1Yk5hbWVTcGFjZSArICcgaXMgYWxyZWFkeSBkZWZpbmVkIG9uICcgKyBzcGFjZW5hbWUgKyAnLicpO1xuICAgICAgICB9XG4gICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzKG5zTmFtZSArICcuJyArIHN1Yk5hbWVTcGFjZSk7XG4gICAgICAgIG5ld05hbWVTcGFjZSA9IG1ha2VOYW1lU3BhY2Uoc3ViTmFtZVNwYWNlLCBuc1RyZWUpO1xuICAgICAgICBpZiAoc3ViTmFtZVNwYWNlICE9PSAnY29uc3RhbnRzJykge1xuICAgICAgICAgIG5ld05hbWVTcGFjZS5yZWdpc3RlcignY29uc3RhbnRzJywgbWFrZU5hbWVTcGFjZSgnY29uc3RhbnRzJywgbnNUcmVlKSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RvLnJlZ2lzdGVyKHN1Yk5hbWVTcGFjZSwgbmV3TmFtZVNwYWNlLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiBuZXdOYW1lU3BhY2U7XG4gICAgICB9KSwgZmFsc2UpO1xuICAgIH07XG5cbiAgICAvKlxuICAgIEFuIGludGVybmFsIG1lY2hhbmlzbSB0byByZXByZXNlbnQgdGhlIGluc3RhbmNlIG9mIHRoaXMgbmFtZXNwYWNlXG4gICAgQGNvbnN0cnVjdG9yXG4gICAgQGludGVybmFsXG4gICAgQG1lbWJlck9mIG1ha2VOYW1lU3BhY2VcbiAgICAgKi9cbiAgICBDbGFzcyA9IG5ldyBGdW5jdGlvbigncmV0dXJuIGZ1bmN0aW9uICcgKyBzcGFjZW5hbWUgKyAnKCl7fScpKCk7XG4gICAgQ2xhc3MucHJvdG90eXBlID0gbmV3IEJhc2Uoc3BhY2VuYW1lKTtcbiAgICByZXR1cm4gbmV3IENsYXNzKHNwYWNlbmFtZSk7XG4gIH07XG5cbiAgLypcbiAgJ0RlcGVuZCcgYW4gT2JqZWN0IHVwb24gYW5vdGhlciBtZW1iZXIgb2YgdGhpcyBuYW1lc3BhY2UsIHVwb24gYW5vdGhlciBuYW1lc3BhY2UsXG4gIG9yIHVwb24gYSBtZW1iZXIgb2YgYW5vdGhlciBuYW1lc3BhY2VcbiAgICovXG4gIGRlcGVuZHNPbiA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcywgY2FsbEJhY2ssIGltcG9ydHMpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIG1pc3NpbmcsIG5zTWVtYmVycywgcmV0O1xuICAgIHJldCA9IGZhbHNlO1xuICAgIG5zTWVtYmVycyA9IG5zSW50ZXJuYWwuZ2V0TnNNZW1iZXJzKCk7XG4gICAgaWYgKGRlcGVuZGVuY2llcyAmJiBkZXBlbmRlbmNpZXMubGVuZ3RoID4gMCAmJiBjYWxsQmFjaykge1xuICAgICAgbWlzc2luZyA9IGRlcGVuZGVuY2llcy5maWx0ZXIoZnVuY3Rpb24oZGVwZW4pIHtcbiAgICAgICAgcmV0dXJuIG5zTWVtYmVycy5pbmRleE9mKGRlcGVuKSA9PT0gLTEgJiYgKCFpbXBvcnRzIHx8IGltcG9ydHMgIT09IGRlcGVuKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKG1pc3NpbmcubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldCA9IHRydWU7XG4gICAgICAgIGNhbGxCYWNrKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuc0ludGVybmFsLmRlcGVuZGVudHMucHVzaChmdW5jdGlvbihpbXBvcnRzKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcGVuZHNPbihtaXNzaW5nLCBjYWxsQmFjaywgaW1wb3J0cyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xuICBuc0ludGVybmFsID0ge1xuICAgIGRlcGVuZGVudHM6IFtdXG5cbiAgICAvKlxuICAgIEZldGNoZXMgdGhlIHJlZ2lzdGVyZWQgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBvbiB0aGUgbmFtZXNwYWNlIGFuZCBpdHMgY2hpbGQgbmFtZXNwYWNlc1xuICAgICAqL1xuICB9O1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobnNJbnRlcm5hbCwgJ2dldE5zTWVtYmVycycsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbWVtYmVycywgcmVjdXJzZVRyZWU7XG4gICAgICByZWN1cnNlVHJlZSA9IGZ1bmN0aW9uKGtleSwgbGFzdEtleSkge1xuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBtZW1iZXJzLnB1c2gobGFzdEtleSArICcuJyArIGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHV0aWxMaWIuaXNQbGFpbk9iamVjdChrZXkpKSB7XG4gICAgICAgICAgT2JqZWN0LmtleXMoa2V5KS5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgayA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgbWVtYmVycy5wdXNoKGxhc3RLZXkgKyAnLicgKyBrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1dGlsTGliLmlzUGxhaW5PYmplY3Qoa2V5W2tdKSkge1xuICAgICAgICAgICAgICByZWN1cnNlVHJlZShrZXlba10sIGxhc3RLZXkgKyAnLicgKyBrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIG1lbWJlcnMgPSBbXTtcbiAgICAgIE9iamVjdC5rZXlzKE5zVHJlZVtuYW1lU3BhY2VOYW1lXSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKHV0aWxMaWIuaXNQbGFpbk9iamVjdChOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSkpIHtcbiAgICAgICAgICByZWN1cnNlVHJlZShOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSwgbmFtZVNwYWNlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG1lbWJlcnM7XG4gICAgfVxuICB9KTtcblxuICAvKlxuICBUbyBzdXBwb3J0IGRlcGVuZGVuY3kgbWFuYWdlbWVudCwgd2hlbiBhIHByb3BlcnR5IGlzIGxpZnRlZCBvbnRvIHRoZSBuYW1lc3BhY2UsIG5vdGlmeSBkZXBlbmRlbnRzIHRvIGluaXRpYWxpemVcbiAgICovXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuc0ludGVybmFsLCAnYWxlcnREZXBlbmRlbnRzJywge1xuICAgIHZhbHVlOiBmdW5jdGlvbihpbXBvcnRzKSB7XG4gICAgICB2YXIgZGVwcztcbiAgICAgIGRlcHMgPSBuc0ludGVybmFsLmRlcGVuZGVudHMuZmlsdGVyKGZ1bmN0aW9uKGRlcE9uKSB7XG4gICAgICAgIHJldHVybiBmYWxzZSA9PT0gZGVwT24oaW1wb3J0cyk7XG4gICAgICB9KTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGRlcHMpKSB7XG4gICAgICAgIHJldHVybiBuc0ludGVybmFsLmRlcGVuZGVudHMgPSBkZXBzO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSA9IHt9O1xuICBOc091dCA9IG1ha2VOYW1lU3BhY2UobmFtZVNwYWNlTmFtZSwgTnNUcmVlW25hbWVTcGFjZU5hbWVdKTtcblxuICAvKlxuICBDYWNoZSBhIGhhbmRsZSBvbiB0aGUgdmVuZG9yIChwcm9iYWJseSBqUXVlcnkpIG9uIHRoZSByb290IG5hbWVzcGFjZVxuICAgKi9cbiAgTnNPdXQucmVnaXN0ZXIoJz8nLCB1dGlsTGliLCBmYWxzZSk7XG5cbiAgLypcbiAgQ2FjaGUgdGhlIHRyZWUgKHVzZWZ1bCBmb3IgZG9jdW1lbnRhdGlvbi92aXN1YWxpemF0aW9uL2RlYnVnZ2luZylcbiAgICovXG4gIE5zT3V0LnJlZ2lzdGVyKCd0cmVlJywgTnNUcmVlW25hbWVTcGFjZU5hbWVdLCBmYWxzZSk7XG5cbiAgLypcbiAgQ2FjaGUgdGhlIG5hbWUgc3BhY2UgbmFtZVxuICAgKi9cbiAgTnNPdXQucmVnaXN0ZXIoJ25hbWUnLCBuYW1lU3BhY2VOYW1lLCBmYWxzZSk7XG4gIE5zT3V0LnJlZ2lzdGVyKCdkZXBlbmRzT24nLCBkZXBlbmRzT24sIGZhbHNlKTtcbiAgcmV0dXJuIE5zT3V0O1xufTtcblxuXG4vKlxuQWN0dWFsbHkgZGVmaW5lIHRoZSBPSiBOYW1lU3BhY2VcbiAqL1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkodGhpc0dsb2JhbCwgbmFtZVNwYWNlTmFtZSwge1xuICB2YWx1ZTogbWFrZVRoZUp1aWNlKClcbn0pO1xuXG5PSi5yZWdpc3RlcignZ2xvYmFsJywgdGhpc0dsb2JhbCk7XG5cbnRoaXNEb2N1bWVudCA9IHt9O1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICB0aGlzRG9jdW1lbnQgPSBkb2N1bWVudDtcbn1cblxuT0oucmVnaXN0ZXIoJ2RvY3VtZW50JywgdGhpc0RvY3VtZW50KTtcblxuT0oucmVnaXN0ZXIoJ25vb3AnLCBmdW5jdGlvbigpIHt9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBPSjtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRnh2YWk1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVOQkxFbEJRVUU3TzBGQlFVRXNWVUZCUVN4SFFVRmhMRTlCUVVFc1EwRkJVU3hWUVVGU096dEJRVU5pTEU5QlFVRXNSMEZCVlN4UFFVRkJMRU5CUVZFc1VVRkJVanM3UVVGRFZpeGhRVUZCTEVkQlFXZENPenM3UVVGRmFFSTdPenM3UVVGSFFTeE5RVUZOTEVOQlFVTXNaMEpCUVZBc1EwRkJkMElzVFVGQlRTeERRVUZCTEZOQlFUbENMRVZCUTBVN1JVRkJRU3hsUVVGQkxFVkJRMFU3U1VGQlFTeExRVUZCTEVWQlFVOHNVMEZCUVR0QlFVTk1MRlZCUVVFN1RVRkJRU3hoUVVGQkxFZEJRV2RDTzAxQlEyaENMRTlCUVVFc1IwRkJWeXhoUVVGakxFTkJRVU1zU1VGQmFFSXNRMEZCY1VJc1NVRkJReXhEUVVGQkxGZEJRVmNzUTBGQlF5eFJRVUZpTEVOQlFVRXNRMEZCY2tJN1RVRkRWQ3hKUVVGSkxFOUJRVUVzU1VGQldTeFBRVUZQTEVOQlFVTXNUVUZCVWl4SFFVRnBRaXhEUVVGcVF6dGxRVUY1UXl4UFFVRlJMRU5CUVVFc1EwRkJRU3hGUVVGcVJEdFBRVUZCTEUxQlFVRTdaVUZCZVVRc1IwRkJla1E3TzBsQlNFa3NRMEZCVUR0SFFVUkdPME5CUkVZN096dEJRVkZCT3pzN08wRkJSMEVzVFVGQlFTeEhRVUZUT3p0QlFVTlVMRmxCUVVFc1IwRkJaU3hUUVVGQk96dEJRVVZpT3pzN1FVRkJRU3hOUVVGQk8wVkJSMEVzWVVGQlFTeEhRVUZuUWl4VFFVRkRMRk5CUVVRc1JVRkJXU3hKUVVGYU96dEJRVU5rT3pzN1FVRkJRU3hSUVVGQk8wbEJSMEVzU1VGQlFTeEhRVUZQTEZOQlFVTXNUVUZCUkR0QlFVTk1MRlZCUVVFN1RVRkJRU3hMUVVGQkxFZEJRVkU3VFVGRFVpeEpRVUZMTEVOQlFVRXNUVUZCUVN4RFFVRk1MRWRCUVdVc1NVRkJTeXhEUVVGQkxFMUJRVUVzUTBGQlRDeEpRVUZuUWp0TlFVTXZRaXhOUVVGQkxFZEJRVk1zU1VGQlN5eERRVUZCTEUxQlFVRTdUVUZEWkN4UFFVRkJMRWRCUVZVN1RVRkZWaXhOUVVGTkxFTkJRVU1zWTBGQlVDeERRVUZ6UWl4SlFVRjBRaXhGUVVFMFFpeFRRVUUxUWl4RlFVRjFRenRSUVVGQkxFdEJRVUVzUlVGQlR6czdRVUZGT1VNN096dFhRVVoxUXp0UFFVRjJRenROUVUxQkxFMUJRVTBzUTBGQlF5eGpRVUZRTEVOQlFYTkNMRWxCUVhSQ0xFVkJRVFJDTEZWQlFUVkNMRVZCUTBVN1VVRkJRU3hMUVVGQkxFVkJRVThzVTBGQlF5eEpRVUZFTEVWQlFVOHNSMEZCVUN4RlFVRlpMRlZCUVZvN1ZVRkRURHRWUVVOQkxFbEJRWGRGTEVOQlFVTXNUMEZCVHl4SlFVRlFMRXRCUVdsQ0xGRkJRV3hDTEVOQlFVRXNTVUZCSzBJc1NVRkJRU3hMUVVGUkxFVkJRUzlITzBGQlFVRXNhMEpCUVZVc1NVRkJRU3hMUVVGQkxFTkJRVTBzYTBSQlFVNHNSVUZCVmpzN1ZVRkRRU3hKUVVGQkxFTkJRWGxHTEVkQlFYcEdPMEZCUVVFc2EwSkJRVlVzU1VGQlFTeExRVUZCTEVOQlFVMHNLMFJCUVU0c1JVRkJWanM3VlVGRFFTeEpRVUUwUml4TFFVRk5MRU5CUVVFc1NVRkJRU3hEUVVGc1J6dEJRVUZCTEd0Q1FVRlZMRWxCUVVFc1MwRkJRU3hEUVVGTkxHbENRVUZCTEVkQlFXOUNMRWxCUVhCQ0xFZEJRVEpDTEhsQ1FVRXpRaXhIUVVGMVJDeFRRVUYyUkN4SFFVRnRSU3hIUVVGNlJTeEZRVUZXT3p0VlFVVkJMRTlCUVZFc1EwRkJRU3hKUVVGQkxFTkJRVklzUjBGQlowSXNUMEZCVVN4RFFVRkJMRWxCUVVFc1EwRkJVaXhKUVVGcFFqdFZRVWRxUXl4TlFVRlBMRU5CUVVFc1NVRkJRU3hEUVVGUUxFZEJRV1VzVFVGQlR5eERRVUZCTEVsQlFVRXNRMEZCVUN4SlFVTmlPMWxCUVVFc1NVRkJRU3hGUVVGTkxFbEJRVTQ3V1VGRFFTeEpRVUZCTEVWQlFVMHNUMEZCVHl4SFFVUmlPMWxCUlVFc1VVRkJRU3hGUVVGVkxFTkJRVWtzUjBGQlJ5eERRVUZETEdWQlFWQXNSMEZCTkVJc1IwRkJSeXhEUVVGRExHVkJRVW9zUTBGQlFTeERRVUUxUWl4SFFVRjFSQ3hUUVVGNFJDeERRVVpXT3p0VlFVbEdMRTFCUVUwc1EwRkJReXhqUVVGUUxFTkJRWE5DTEV0QlFYUkNMRVZCUVRaQ0xFbEJRVGRDTEVWQlEwVTdXVUZCUVN4TFFVRkJMRVZCUVU4c1IwRkJVRHRaUVVOQkxGVkJRVUVzUlVGQldTeExRVUZCTEV0QlFWY3NWVUZFZGtJN1YwRkVSanRWUVVsQkxGVkJRVlVzUTBGQlF5eGxRVUZZTEVOQlFUSkNMRTFCUVVFc1IwRkJVeXhIUVVGVUxFZEJRV1VzVTBGQlppeEhRVUV5UWl4SFFVRXpRaXhIUVVGcFF5eEpRVUUxUkR0cFFrRkRRVHRSUVc1Q1N5eERRVUZRTzA5QlJFWTdPMEZCZFVKQk96czdUVUZIUVN4TFFVRkxMRU5CUVVNc1VVRkJUaXhEUVVGbExHdENRVUZtTEVWQlFXMURMRU5CUVVNc1UwRkJReXhaUVVGRU8xRkJRMnhETzBGQlFVRXNXVUZCUVR0UlFVTkJMRWxCUVN0RkxFTkJRVU1zVDBGQlR5eFpRVUZRTEV0QlFYbENMRkZCUVRGQ0xFTkJRVUVzU1VGQmRVTXNXVUZCUVN4TFFVRm5RaXhGUVVGMFNUdEJRVUZCTEdkQ1FVRlZMRWxCUVVFc1MwRkJRU3hEUVVGTkxIbEVRVUZPTEVWQlFWWTdPMUZCUTBFc1NVRkJlVWNzUzBGQlN5eERRVUZETEZsQlFTOUhPMEZCUVVFc1owSkJRVlVzU1VGQlFTeExRVUZCTEVOQlFVMHNjMEpCUVVFc1IwRkJlVUlzV1VGQmVrSXNSMEZCZDBNc2VVSkJRWGhETEVkQlFXOUZMRk5CUVhCRkxFZEJRV2RHTEVkQlFYUkdMRVZCUVZZN08xRkJRMEVzVlVGQlZTeERRVUZETEdWQlFWZ3NRMEZCTWtJc1RVRkJRU3hIUVVGVExFZEJRVlFzUjBGQlpTeFpRVUV4UXp0UlFVTkJMRmxCUVVFc1IwRkJaU3hoUVVGQkxFTkJRV01zV1VGQlpDeEZRVUUwUWl4TlFVRTFRanRSUVVObUxFbEJRV2xHTEZsQlFVRXNTMEZCYTBJc1YwRkJia2M3VlVGQlFTeFpRVUZaTEVOQlFVTXNVVUZCWWl4RFFVRnpRaXhYUVVGMFFpeEZRVUZ0UXl4aFFVRkJMRU5CUVdNc1YwRkJaQ3hGUVVFeVFpeE5RVUV6UWl4RFFVRnVReXhGUVVGMVJTeExRVUYyUlN4RlFVRkJPenRSUVVOQkxFdEJRVXNzUTBGQlF5eFJRVUZPTEVOQlFXVXNXVUZCWml4RlFVRTJRaXhaUVVFM1FpeEZRVUV5UXl4TFFVRXpRenRsUVVOQk8wMUJVbXRETEVOQlFVUXNRMEZCYmtNc1JVRlRSeXhMUVZSSU8wbEJkRU5MT3p0QlFXdEVVRHM3T3pzN08wbEJUVUVzUzBGQlFTeEhRVUZaTEVsQlFVRXNVVUZCUVN4RFFVRlRMR3RDUVVGQkxFZEJRWEZDTEZOQlFYSkNMRWRCUVdsRExFMUJRVEZETEVOQlFVRXNRMEZCUVR0SlFVTmFMRXRCUVVzc1EwRkJRU3hUUVVGTUxFZEJRV01zU1VGQlFTeEpRVUZCTEVOQlFVc3NVMEZCVER0WFFVZFdMRWxCUVVFc1MwRkJRU3hEUVVGTkxGTkJRVTQ3UlVGb1JWVTdPMEZCYTBWb1FqczdPenRGUVVsQkxGTkJRVUVzUjBGQldTeFRRVUZETEZsQlFVUXNSVUZCWlN4UlFVRm1MRVZCUVhsQ0xFOUJRWHBDTzBsQlExWTdRVUZCUVN4UlFVRkJPMGxCUTBFc1IwRkJRU3hIUVVGTk8wbEJRMDRzVTBGQlFTeEhRVUZaTEZWQlFWVXNRMEZCUXl4WlFVRllMRU5CUVVFN1NVRkRXaXhKUVVGSExGbEJRVUVzU1VGQmFVSXNXVUZCV1N4RFFVRkRMRTFCUVdJc1IwRkJjMElzUTBGQmRrTXNTVUZCTmtNc1VVRkJhRVE3VFVGRFJTeFBRVUZCTEVkQlFWVXNXVUZCV1N4RFFVRkRMRTFCUVdJc1EwRkJiMElzVTBGQlF5eExRVUZFTzJWQlF6VkNMRk5CUVZNc1EwRkJReXhQUVVGV0xFTkJRV3RDTEV0QlFXeENMRU5CUVVFc1MwRkJORUlzUTBGQlF5eERRVUUzUWl4SlFVRnRReXhEUVVGRExFTkJRVWtzVDBGQlNpeEpRVUZsTEU5QlFVRXNTMEZCWVN4TFFVRTNRanROUVVSUUxFTkJRWEJDTzAxQlIxWXNTVUZCUnl4UFFVRlBMRU5CUVVNc1RVRkJVaXhMUVVGclFpeERRVUZ5UWp0UlFVTkZMRWRCUVVFc1IwRkJUVHRSUVVOT0xGRkJRVUVzUTBGQlFTeEZRVVpHTzA5QlFVRXNUVUZCUVR0UlFVbEZMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQmRFSXNRMEZCTWtJc1UwRkJReXhQUVVGRU8ybENRVU42UWl4VFFVRkJMRU5CUVZVc1QwRkJWaXhGUVVGdFFpeFJRVUZ1UWl4RlFVRTJRaXhQUVVFM1FqdFJRVVI1UWl4RFFVRXpRaXhGUVVwR08wOUJTa1k3TzFkQlYwRTdSVUZtVlR0RlFXZENXaXhWUVVGQkxFZEJRV0U3U1VGQlFTeFZRVUZCTEVWQlFWazdPMEZCUlhwQ096dFBRVVpoT3p0RlFVdGlMRTFCUVUwc1EwRkJReXhqUVVGUUxFTkJRWE5DTEZWQlFYUkNMRVZCUVd0RExHTkJRV3hETEVWQlEwVTdTVUZCUVN4TFFVRkJMRVZCUVU4c1UwRkJRVHRCUVVOTUxGVkJRVUU3VFVGQlFTeFhRVUZCTEVkQlFXTXNVMEZCUXl4SFFVRkVMRVZCUVUwc1QwRkJUanRSUVVOYUxFbEJRWEZETEU5QlFWRXNSMEZCVWl4TFFVRm5RaXhSUVVGeVJEdFZRVUZCTEU5QlFVOHNRMEZCUXl4SlFVRlNMRU5CUVdFc1QwRkJRU3hIUVVGVkxFZEJRVllzUjBGQlowSXNSMEZCTjBJc1JVRkJRVHM3VVVGRFFTeEpRVUZITEU5QlFVOHNRMEZCUXl4aFFVRlNMRU5CUVhOQ0xFZEJRWFJDTEVOQlFVZzdWVUZEUlN4TlFVRk5MRU5CUVVNc1NVRkJVQ3hEUVVGWkxFZEJRVm9zUTBGQlowSXNRMEZCUXl4UFFVRnFRaXhEUVVGNVFpeFRRVUZETEVOQlFVUTdXVUZEZGtJc1NVRkJiVU1zVDBGQlVTeERRVUZTTEV0QlFXTXNVVUZCYWtRN1kwRkJRU3hQUVVGUExFTkJRVU1zU1VGQlVpeERRVUZoTEU5QlFVRXNSMEZCVlN4SFFVRldMRWRCUVdkQ0xFTkJRVGRDTEVWQlFVRTdPMWxCUTBFc1NVRkJNRU1zVDBGQlR5eERRVUZETEdGQlFWSXNRMEZCYzBJc1IwRkJTU3hEUVVGQkxFTkJRVUVzUTBGQk1VSXNRMEZCTVVNN1kwRkJRU3hYUVVGQkxFTkJRVmtzUjBGQlNTeERRVUZCTEVOQlFVRXNRMEZCYUVJc1JVRkJiMElzVDBGQlFTeEhRVUZWTEVkQlFWWXNSMEZCWjBJc1EwRkJjRU1zUlVGQlFUczdWVUZHZFVJc1EwRkJla0lzUlVGRVJqczdUVUZHV1R0TlFWTmtMRTlCUVVFc1IwRkJWVHROUVVOV0xFMUJRVTBzUTBGQlF5eEpRVUZRTEVOQlFWa3NUVUZCVHl4RFFVRkJMR0ZCUVVFc1EwRkJia0lzUTBGQmEwTXNRMEZCUXl4UFFVRnVReXhEUVVFeVF5eFRRVUZETEVkQlFVUTdVVUZEZWtNc1NVRkJNRVFzVDBGQlR5eERRVUZETEdGQlFWSXNRMEZCYzBJc1RVRkJUeXhEUVVGQkxHRkJRVUVzUTBGQlpTeERRVUZCTEVkQlFVRXNRMEZCTlVNc1EwRkJNVVE3VlVGQlFTeFhRVUZCTEVOQlFWa3NUVUZCVHl4RFFVRkJMR0ZCUVVFc1EwRkJaU3hEUVVGQkxFZEJRVUVzUTBGQmJFTXNSVUZCZDBNc1lVRkJlRU1zUlVGQlFUczdUVUZFZVVNc1EwRkJNME03WVVGSlFUdEpRV1pMTEVOQlFWQTdSMEZFUmpzN1FVRnJRa0U3T3p0RlFVZEJMRTFCUVUwc1EwRkJReXhqUVVGUUxFTkJRWE5DTEZWQlFYUkNMRVZCUVd0RExHbENRVUZzUXl4RlFVTkZPMGxCUVVFc1MwRkJRU3hGUVVGUExGTkJRVU1zVDBGQlJEdEJRVU5NTEZWQlFVRTdUVUZCUVN4SlFVRkJMRWRCUVU4c1ZVRkJWU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUYwUWl4RFFVRTJRaXhUUVVGRExFdEJRVVE3WlVGRGJFTXNTMEZCUVN4TFFVRlRMRXRCUVVFc1EwRkJUU3hQUVVGT08wMUJSSGxDTEVOQlFUZENPMDFCUjFBc1NVRkJhVU1zUzBGQlN5eERRVUZETEU5QlFVNHNRMEZCWXl4SlFVRmtMRU5CUVdwRE8yVkJRVUVzVlVGQlZTeERRVUZETEZWQlFWZ3NSMEZCZDBJc1MwRkJlRUk3TzBsQlNrc3NRMEZCVUR0SFFVUkdPMFZCVVVFc1RVRkJUeXhEUVVGQkxHRkJRVUVzUTBGQlVDeEhRVUYzUWp0RlFVVjRRaXhMUVVGQkxFZEJRVkVzWVVGQlFTeERRVUZqTEdGQlFXUXNSVUZCTmtJc1RVRkJUeXhEUVVGQkxHRkJRVUVzUTBGQmNFTTdPMEZCUlZJN096dEZRVWRCTEV0QlFVc3NRMEZCUXl4UlFVRk9MRU5CUVdVc1IwRkJaaXhGUVVGdlFpeFBRVUZ3UWl4RlFVRTJRaXhMUVVFM1FqczdRVUZGUVRzN08wVkJSMEVzUzBGQlN5eERRVUZETEZGQlFVNHNRMEZCWlN4TlFVRm1MRVZCUVhWQ0xFMUJRVThzUTBGQlFTeGhRVUZCTEVOQlFUbENMRVZCUVRoRExFdEJRVGxET3p0QlFVVkJPenM3UlVGSFFTeExRVUZMTEVOQlFVTXNVVUZCVGl4RFFVRmxMRTFCUVdZc1JVRkJkVUlzWVVGQmRrSXNSVUZCYzBNc1MwRkJkRU03UlVGRFFTeExRVUZMTEVOQlFVTXNVVUZCVGl4RFFVRmxMRmRCUVdZc1JVRkJORUlzVTBGQk5VSXNSVUZCZFVNc1MwRkJka003VTBGRFFUdEJRV2hLWVRzN08wRkJiVXBtT3pzN08wRkJSMEVzVFVGQlRTeERRVUZETEdOQlFWQXNRMEZCYzBJc1ZVRkJkRUlzUlVGQmEwTXNZVUZCYkVNc1JVRkRSVHRGUVVGQkxFdEJRVUVzUlVGQlR5eFpRVUZCTEVOQlFVRXNRMEZCVUR0RFFVUkdPenRCUVVkQkxFVkJRVVVzUTBGQlF5eFJRVUZJTEVOQlFWa3NVVUZCV2l4RlFVRnpRaXhWUVVGMFFqczdRVUZGUVN4WlFVRkJMRWRCUVdVN08wRkJRMllzU1VGQlJ5eFBRVUZQTEZGQlFWQXNTMEZCY1VJc1YwRkJlRUk3UlVGRFJTeFpRVUZCTEVkQlFXVXNVMEZFYWtJN096dEJRVWRCTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1ZVRkJXaXhGUVVGM1FpeFpRVUY0UWpzN1FVRkZRU3hGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEUxQlFWb3NSVUZCYjBJc1UwRkJRU3hIUVVGQkxFTkJRWEJDT3p0QlFVVkJMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SWpJQ01nVDBwY2NseHVkR2hwYzBkc2IySmhiQ0E5SUhKbGNYVnBjbVVnSnk0dloyeHZZbUZzSjF4eVhHNTFkR2xzVEdsaUlEMGdjbVZ4ZFdseVpTQW5hbkYxWlhKNUoxeHlYRzV1WVcxbFUzQmhZMlZPWVcxbElEMGdKMDlLSjF4eVhHNWNjbHh1SXlNalhISmNibUp2YjNRZ2MzUnlZWEFnYm1GdFpTQnRaWFJvYjJRZ2FXNTBieUJQWW1wbFkzUWdjSEp2ZEc5MGVYQmxYSEpjYmlNakkxeHlYRzVQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEdsbGN5QlBZbXBsWTNRNk9peGNjbHh1SUNCblpYUkpibk4wWVc1alpVNWhiV1U2WEhKY2JpQWdJQ0IyWVd4MVpUb2dMVDVjY2x4dUlDQWdJQ0FnWm5WdVkwNWhiV1ZTWldkbGVDQTlJQzltZFc1amRHbHZiaUFvTG5zeExIMHBYRndvTDF4eVhHNGdJQ0FnSUNCeVpYTjFiSFJ6SUQwZ0tHWjFibU5PWVcxbFVtVm5aWGdwTG1WNFpXTW9RR052Ym5OMGNuVmpkRzl5TG5SdlUzUnlhVzVuS0NrcFhISmNiaUFnSUNBZ0lDaHBaaUFvY21WemRXeDBjeUJoYm1RZ2NtVnpkV3gwY3k1c1pXNW5kR2dnUGlBeEtTQjBhR1Z1SUhKbGMzVnNkSE5iTVYwZ1pXeHpaU0FuSnlsY2NseHVYSEpjYmx4eVhHNGpJeU5jY2x4dVFXNGdhVzUwWlhKdVlXd2djbVZ3Y21WelpXNTBZWFJwYjI0Z2IyWWdkR2hsSUc1aGJXVnpjR0ZqWlNCMGNtVmxYSEpjYmlNakkxeHlYRzVPYzFSeVpXVWdQU0I3ZlZ4eVhHNXRZV3RsVkdobFNuVnBZMlVnUFNBdFBseHlYRzVjY2x4dUlDQWpJeU5jY2x4dUlDQkpiblJsY201aGJDQnVZVzFsVTNCaFkyVk9ZVzFsSUcxbGRHaHZaQ0IwYnlCamNtVmhkR1VnYm1WM0lDZHpkV0luSUc1aGJXVnpjR0ZqWlhNZ2IyNGdZWEppYVhSeVlYSjVJR05vYVd4a0lHOWlhbVZqZEhNdVhISmNiaUFnSXlNalhISmNiaUFnYldGclpVNWhiV1ZUY0dGalpTQTlJQ2h6Y0dGalpXNWhiV1VzSUhSeVpXVXBJQzArWEhKY2JpQWdJQ0FqSXlOY2NseHVJQ0FnSUZSb1pTQmtaWEpwZG1Wa0lHbHVjM1JoYm1ObElIUnZJR0psSUdOdmJuTjBjblZqZEdWa1hISmNiaUFnSUNBakl5TmNjbHh1SUNBZ0lFSmhjMlVnUFNBb2JuTk9ZVzFsS1NBdFBseHlYRzRnSUNBZ0lDQndjbTkwYnlBOUlIUm9hWE5jY2x4dUlDQWdJQ0FnZEhKbFpWdHVjMDVoYldWZElEMGdkSEpsWlZ0dWMwNWhiV1ZkSUc5eUlIdDlYSEpjYmlBZ0lDQWdJRzV6VkhKbFpTQTlJSFJ5WldWYmJuTk9ZVzFsWFZ4eVhHNGdJQ0FnSUNCdFpXMWlaWEp6SUQwZ2UzMWNjbHh1WEhKY2JpQWdJQ0FnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTQjBhR2x6TENBbmJXVnRZbVZ5Y3ljc0lIWmhiSFZsT2lCdFpXMWlaWEp6WEhKY2JseHlYRzRnSUNBZ0lDQWpJeU5jY2x4dUlDQWdJQ0FnVW1WbmFYTjBaWElnS0dVdVp5NGdKMHhwWm5RbktTQmhiaUJQWW1wbFkzUWdhVzUwYnlCMGFHVWdjSEp2ZEc5MGVYQmxJRzltSUhSb1pTQnVZVzFsYzNCaFkyVXVYSEpjYmlBZ0lDQWdJRlJvYVhNZ1QySnFaV04wSUhkcGJHd2dZbVVnY21WaFpHRmliR1V2WlhobFkzVjBZV0pzWlNCaWRYUWdhWE1nYjNSb1pYSjNhWE5sSUdsdGJYVjBZV0pzWlM1Y2NseHVJQ0FnSUNBZ0l5TWpYSEpjYmlBZ0lDQWdJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNCMGFHbHpMQ0FuY21WbmFYTjBaWEluTEZ4eVhHNGdJQ0FnSUNBZ0lIWmhiSFZsT2lBb2JtRnRaU3dnYjJKcUxDQmxiblZ0WlhKaFlteGxLU0F0UGx4eVhHNGdJQ0FnSUNBZ0lDQWdKM1Z6WlNCemRISnBZM1FuWEhKY2JpQWdJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0owTmhibTV2ZENCc2FXWjBJR0VnYm1WM0lIQnliM0JsY25SNUlIZHBkR2h2ZFhRZ1lTQjJZV3hwWkNCdVlXMWxMaWNwSUNCcFppQW9kSGx3Wlc5bUlHNWhiV1VnYVhOdWRDQW5jM1J5YVc1bkp5a2diM0lnYm1GdFpTQnBjeUFuSjF4eVhHNGdJQ0FnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZERZVzV1YjNRZ2JHbG1kQ0JoSUc1bGR5QndjbTl3WlhKMGVTQjNhWFJvYjNWMElHRWdkbUZzYVdRZ2NISnZjR1Z5ZEhrZ2FXNXpkR0Z1WTJVdUp5a2dJSFZ1YkdWemN5QnZZbXBjY2x4dUlDQWdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnblVISnZjR1Z5ZEhrZ2JtRnRaV1FnSnlBcklHNWhiV1VnS3lBbklHbHpJR0ZzY21WaFpIa2daR1ZtYVc1bFpDQnZiaUFuSUNzZ2MzQmhZMlZ1WVcxbElDc2dKeTRuS1NBZ2FXWWdjSEp2ZEc5YmJtRnRaVjFjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0J0WlcxaVpYSnpXMjVoYldWZElEMGdiV1Z0WW1WeWMxdHVZVzFsWFNCdmNpQnVZVzFsWEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSTBkMVlYSmtJR0ZuWVdsdWMzUWdiMkpzYVhSbGNtRjBhVzVuSUhSb1pTQjBjbVZsSUdGeklIUm9aU0IwY21WbElHbHpJSEpsWTNWeWMybDJaV3g1SUdWNGRHVnVaR1ZrWEhKY2JpQWdJQ0FnSUNBZ0lDQnVjMVJ5WldWYmJtRnRaVjBnUFNCdWMxUnlaV1ZiYm1GdFpWMGdiM0pjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdibUZ0WlRvZ2JtRnRaVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBlWEJsT2lCMGVYQmxiMllnYjJKcVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUdsdWMzUmhibU5sT2lBb2FXWWdiMkpxTG1kbGRFbHVjM1JoYm1ObFRtRnRaU0IwYUdWdUlHOWlhaTVuWlhSSmJuTjBZVzVqWlU1aGJXVW9LU0JsYkhObElDZDFibXR1YjNkdUp5bGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0lDQlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtnY0hKdmRHOHNJRzVoYldVc1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhaaGJIVmxPaUJ2WW1wY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWlc1MWJXVnlZV0pzWlRvZ1ptRnNjMlVnYVhOdWRDQmxiblZ0WlhKaFlteGxYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdibk5KYm5SbGNtNWhiQzVoYkdWeWRFUmxjR1Z1WkdWdWRITWdibk5PWVcxbElDc2dKeTRuSUNzZ2MzQmhZMlZ1WVcxbElDc2dKeTRuSUNzZ2JtRnRaVnh5WEc0Z0lDQWdJQ0FnSUNBZ2IySnFYSEpjYmx4eVhHNWNjbHh1SUNBZ0lDQWdJeU1qWEhKY2JpQWdJQ0FnSUVOeVpXRjBaU0JoSUc1bGR5d2djM1JoZEdsaklHNWhiV1Z6Y0dGalpTQnZiaUIwYUdVZ1kzVnljbVZ1ZENCd1lYSmxiblFnS0dVdVp5NGdibk5PWVcxbExuUnZMaTR1SUh4OElHNXpUbUZ0WlM1cGN5NHVMaWxjY2x4dUlDQWdJQ0FnSXlNalhISmNiaUFnSUNBZ0lIQnliM1J2TG5KbFoybHpkR1Z5SUNkdFlXdGxVM1ZpVG1GdFpWTndZV05sSnl3Z0tDaHpkV0pPWVcxbFUzQmhZMlVwSUMwK1hISmNiaUFnSUNBZ0lDQWdKM1Z6WlNCemRISnBZM1FuWEhKY2JpQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkRFlXNXViM1FnWTNKbFlYUmxJR0VnYm1WM0lITjFZaUJ1WVcxbGMzQmhZMlVnZDJsMGFHOTFkQ0JoSUhaaGJHbGtJRzVoYldVdUp5a2dJR2xtSUNoMGVYQmxiMllnYzNWaVRtRnRaVk53WVdObElHbHpiblFnSjNOMGNtbHVaeWNwSUc5eUlITjFZazVoYldWVGNHRmpaU0JwY3lBbkoxeHlYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpZ25VM1ZpSUc1aGJXVnpjR0ZqWlNCdVlXMWxaQ0FuSUNzZ2MzVmlUbUZ0WlZOd1lXTmxJQ3NnSnlCcGN5QmhiSEpsWVdSNUlHUmxabWx1WldRZ2IyNGdKeUFySUhOd1lXTmxibUZ0WlNBcklDY3VKeWtnSUdsbUlIQnliM1J2TG5OMVlrNWhiV1ZUY0dGalpWeHlYRzRnSUNBZ0lDQWdJRzV6U1c1MFpYSnVZV3d1WVd4bGNuUkVaWEJsYm1SbGJuUnpJRzV6VG1GdFpTQXJJQ2N1SnlBcklITjFZazVoYldWVGNHRmpaVnh5WEc0Z0lDQWdJQ0FnSUc1bGQwNWhiV1ZUY0dGalpTQTlJRzFoYTJWT1lXMWxVM0JoWTJVb2MzVmlUbUZ0WlZOd1lXTmxMQ0J1YzFSeVpXVXBYSEpjYmlBZ0lDQWdJQ0FnYm1WM1RtRnRaVk53WVdObExuSmxaMmx6ZEdWeUlDZGpiMjV6ZEdGdWRITW5MQ0J0WVd0bFRtRnRaVk53WVdObEtDZGpiMjV6ZEdGdWRITW5MQ0J1YzFSeVpXVXBMQ0JtWVd4elpTQWdhV1lnYzNWaVRtRnRaVk53WVdObElHbHpiblFnSjJOdmJuTjBZVzUwY3lkY2NseHVJQ0FnSUNBZ0lDQndjbTkwYnk1eVpXZHBjM1JsY2lCemRXSk9ZVzFsVTNCaFkyVXNJRzVsZDA1aGJXVlRjR0ZqWlN3Z1ptRnNjMlZjY2x4dUlDQWdJQ0FnSUNCdVpYZE9ZVzFsVTNCaFkyVmNjbHh1SUNBZ0lDQWdLU3dnWm1Gc2MyVmNjbHh1SUNBZ0lDQWdjbVYwZFhKdVhISmNibHh5WEc0Z0lDQWdJeU1qWEhKY2JpQWdJQ0JCYmlCcGJuUmxjbTVoYkNCdFpXTm9ZVzVwYzIwZ2RHOGdjbVZ3Y21WelpXNTBJSFJvWlNCcGJuTjBZVzVqWlNCdlppQjBhR2x6SUc1aGJXVnpjR0ZqWlZ4eVhHNGdJQ0FnUUdOdmJuTjBjblZqZEc5eVhISmNiaUFnSUNCQWFXNTBaWEp1WVd4Y2NseHVJQ0FnSUVCdFpXMWlaWEpQWmlCdFlXdGxUbUZ0WlZOd1lXTmxYSEpjYmlBZ0lDQWpJeU5jY2x4dUlDQWdJRU5zWVhOeklEMGdibVYzSUVaMWJtTjBhVzl1S0NkeVpYUjFjbTRnWm5WdVkzUnBiMjRnSnlBcklITndZV05sYm1GdFpTQXJJQ2NvS1h0OUp5a29LVnh5WEc0Z0lDQWdRMnhoYzNNNk9pQTlJRzVsZHlCQ1lYTmxLSE53WVdObGJtRnRaU2xjY2x4dVhISmNiaUFnSUNBalEyeGhjM011Y0hKdmRHOTBlWEJsTG5CaGNtVnVkQ0E5SUVKaGMyVXVjSEp2ZEc5MGVYQmxPMXh5WEc0Z0lDQWdibVYzSUVOc1lYTnpLSE53WVdObGJtRnRaU2xjY2x4dVhISmNiaUFnSXlNalhISmNiaUFnSjBSbGNHVnVaQ2NnWVc0Z1QySnFaV04wSUhWd2IyNGdZVzV2ZEdobGNpQnRaVzFpWlhJZ2IyWWdkR2hwY3lCdVlXMWxjM0JoWTJVc0lIVndiMjRnWVc1dmRHaGxjaUJ1WVcxbGMzQmhZMlVzWEhKY2JpQWdiM0lnZFhCdmJpQmhJRzFsYldKbGNpQnZaaUJoYm05MGFHVnlJRzVoYldWemNHRmpaVnh5WEc0Z0lDTWpJMXh5WEc0Z0lHUmxjR1Z1WkhOUGJpQTlJQ2hrWlhCbGJtUmxibU5wWlhNc0lHTmhiR3hDWVdOckxDQnBiWEJ2Y25SektTQXRQbHh5WEc0Z0lDQWdKM1Z6WlNCemRISnBZM1FuWEhKY2JpQWdJQ0J5WlhRZ1BTQm1ZV3h6WlZ4eVhHNGdJQ0FnYm5OTlpXMWlaWEp6SUQwZ2JuTkpiblJsY201aGJDNW5aWFJPYzAxbGJXSmxjbk1vS1Z4eVhHNGdJQ0FnYVdZZ1pHVndaVzVrWlc1amFXVnpJR0Z1WkNCa1pYQmxibVJsYm1OcFpYTXViR1Z1WjNSb0lENGdNQ0JoYm1RZ1kyRnNiRUpoWTJ0Y2NseHVJQ0FnSUNBZ2JXbHpjMmx1WnlBOUlHUmxjR1Z1WkdWdVkybGxjeTVtYVd4MFpYSW9LR1JsY0dWdUtTQXRQbHh5WEc0Z0lDQWdJQ0FnSUc1elRXVnRZbVZ5Y3k1cGJtUmxlRTltS0dSbGNHVnVLU0JwY3lBdE1TQmhibVFnS0c1dmRDQnBiWEJ2Y25SeklHOXlJR2x0Y0c5eWRITWdhWE51ZENCa1pYQmxiaWxjY2x4dUlDQWdJQ0FnS1Z4eVhHNGdJQ0FnSUNCcFppQnRhWE56YVc1bkxteGxibWQwYUNCcGN5QXdYSEpjYmlBZ0lDQWdJQ0FnY21WMElEMGdkSEoxWlZ4eVhHNGdJQ0FnSUNBZ0lHTmhiR3hDWVdOcktDbGNjbHh1SUNBZ0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNBZ0lHNXpTVzUwWlhKdVlXd3VaR1Z3Wlc1a1pXNTBjeTV3ZFhOb0lDaHBiWEJ2Y25SektTQXRQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1pHVndaVzVrYzA5dUlHMXBjM05wYm1jc0lHTmhiR3hDWVdOckxDQnBiWEJ2Y25SelhISmNibHh5WEc0Z0lDQWdjbVYwWEhKY2JpQWdibk5KYm5SbGNtNWhiQ0E5SUdSbGNHVnVaR1Z1ZEhNNklGdGRYSEpjYmx4eVhHNGdJQ01qSTF4eVhHNGdJRVpsZEdOb1pYTWdkR2hsSUhKbFoybHpkR1Z5WldRZ2NISnZjR1Z5ZEdsbGN5QmhibVFnYldWMGFHOWtjeUJ2YmlCMGFHVWdibUZ0WlhOd1lXTmxJR0Z1WkNCcGRITWdZMmhwYkdRZ2JtRnRaWE53WVdObGMxeHlYRzRnSUNNakkxeHlYRzRnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTQnVjMGx1ZEdWeWJtRnNMQ0FuWjJWMFRuTk5aVzFpWlhKekp5eGNjbHh1SUNBZ0lIWmhiSFZsT2lBdFBseHlYRzRnSUNBZ0lDQnlaV04xY25ObFZISmxaU0E5SUNoclpYa3NJR3hoYzNSTFpYa3BJQzArWEhKY2JpQWdJQ0FnSUNBZ2JXVnRZbVZ5Y3k1d2RYTm9JR3hoYzNSTFpYa2dLeUFuTGljZ0t5QnJaWGtnSUdsbUlIUjVjR1Z2WmlBb2EyVjVLU0JwY3lBbmMzUnlhVzVuSjF4eVhHNGdJQ0FnSUNBZ0lHbG1JSFYwYVd4TWFXSXVhWE5RYkdGcGJrOWlhbVZqZENoclpYa3BYSEpjYmlBZ0lDQWdJQ0FnSUNCUFltcGxZM1F1YTJWNWN5aHJaWGtwTG1admNrVmhZMmdnS0dzcElDMCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHMWxiV0psY25NdWNIVnphQ0JzWVhOMFMyVjVJQ3NnSnk0bklDc2dheUFnYVdZZ2RIbHdaVzltSUNocktTQnBjeUFuYzNSeWFXNW5KMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaV04xY25ObFZISmxaU0JyWlhsYmExMHNJR3hoYzNSTFpYa2dLeUFuTGljZ0t5QnJJQ0JwWmlCMWRHbHNUR2xpTG1selVHeGhhVzVQWW1wbFkzUW9hMlY1VzJ0ZEtWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTVjY2x4dVhISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdVhISmNiaUFnSUNBZ0lHMWxiV0psY25NZ1BTQmJYVnh5WEc0Z0lDQWdJQ0JQWW1wbFkzUXVhMlY1Y3loT2MxUnlaV1ZiYm1GdFpWTndZV05sVG1GdFpWMHBMbVp2Y2tWaFkyZ2dLR3RsZVNrZ0xUNWNjbHh1SUNBZ0lDQWdJQ0J5WldOMWNuTmxWSEpsWlNCT2MxUnlaV1ZiYm1GdFpWTndZV05sVG1GdFpWMWJhMlY1WFN3Z2JtRnRaVk53WVdObFRtRnRaU0FnYVdZZ2RYUnBiRXhwWWk1cGMxQnNZV2x1VDJKcVpXTjBLRTV6VkhKbFpWdHVZVzFsVTNCaFkyVk9ZVzFsWFZ0clpYbGRLVnh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlibHh5WEc1Y2NseHVJQ0FnSUNBZ2JXVnRZbVZ5YzF4eVhHNWNjbHh1SUNBakl5TmNjbHh1SUNCVWJ5QnpkWEJ3YjNKMElHUmxjR1Z1WkdWdVkza2diV0Z1WVdkbGJXVnVkQ3dnZDJobGJpQmhJSEJ5YjNCbGNuUjVJR2x6SUd4cFpuUmxaQ0J2Ym5SdklIUm9aU0J1WVcxbGMzQmhZMlVzSUc1dmRHbG1lU0JrWlhCbGJtUmxiblJ6SUhSdklHbHVhWFJwWVd4cGVtVmNjbHh1SUNBakl5TmNjbHh1SUNCUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa2dibk5KYm5SbGNtNWhiQ3dnSjJGc1pYSjBSR1Z3Wlc1a1pXNTBjeWNzWEhKY2JpQWdJQ0IyWVd4MVpUb2dLR2x0Y0c5eWRITXBJQzArWEhKY2JpQWdJQ0FnSUdSbGNITWdQU0J1YzBsdWRHVnlibUZzTG1SbGNHVnVaR1Z1ZEhNdVptbHNkR1Z5S0Noa1pYQlBiaWtnTFQ1Y2NseHVJQ0FnSUNBZ0lDQm1ZV3h6WlNCcGN5QmtaWEJQYmlocGJYQnZjblJ6S1Z4eVhHNGdJQ0FnSUNBcFhISmNiaUFnSUNBZ0lHNXpTVzUwWlhKdVlXd3VaR1Z3Wlc1a1pXNTBjeUE5SUdSbGNITWdJR2xtSUVGeWNtRjVMbWx6UVhKeVlYa29aR1Z3Y3lsY2NseHVYSEpjYmlBZ0kwTnlaV0YwWlNCMGFHVWdjbTl2ZENCdlppQjBhR1VnZEhKbFpTQmhjeUIwYUdVZ1kzVnljbVZ1ZENCdVlXMWxjM0JoWTJWY2NseHVJQ0JPYzFSeVpXVmJibUZ0WlZOd1lXTmxUbUZ0WlYwZ1BTQjdmVnh5WEc0Z0lDTkVaV1pwYm1VZ2RHaGxJR052Y21VZ2JtRnRaWE53WVdObElHRnVaQ0IwYUdVZ2NtVjBkWEp1SUc5bUlIUm9hWE1nWTJ4aGMzTmNjbHh1SUNCT2MwOTFkQ0E5SUcxaGEyVk9ZVzFsVTNCaFkyVW9ibUZ0WlZOd1lXTmxUbUZ0WlN3Z1RuTlVjbVZsVzI1aGJXVlRjR0ZqWlU1aGJXVmRLVnh5WEc1Y2NseHVJQ0FqSXlOY2NseHVJQ0JEWVdOb1pTQmhJR2hoYm1Sc1pTQnZiaUIwYUdVZ2RtVnVaRzl5SUNod2NtOWlZV0pzZVNCcVVYVmxjbmtwSUc5dUlIUm9aU0J5YjI5MElHNWhiV1Z6Y0dGalpWeHlYRzRnSUNNakkxeHlYRzRnSUU1elQzVjBMbkpsWjJsemRHVnlJQ2MvSnl3Z2RYUnBiRXhwWWl3Z1ptRnNjMlZjY2x4dVhISmNiaUFnSXlNalhISmNiaUFnUTJGamFHVWdkR2hsSUhSeVpXVWdLSFZ6WldaMWJDQm1iM0lnWkc5amRXMWxiblJoZEdsdmJpOTJhWE4xWVd4cGVtRjBhVzl1TDJSbFluVm5aMmx1WnlsY2NseHVJQ0FqSXlOY2NseHVJQ0JPYzA5MWRDNXlaV2RwYzNSbGNpQW5kSEpsWlNjc0lFNXpWSEpsWlZ0dVlXMWxVM0JoWTJWT1lXMWxYU3dnWm1Gc2MyVmNjbHh1WEhKY2JpQWdJeU1qWEhKY2JpQWdRMkZqYUdVZ2RHaGxJRzVoYldVZ2MzQmhZMlVnYm1GdFpWeHlYRzRnSUNNakkxeHlYRzRnSUU1elQzVjBMbkpsWjJsemRHVnlJQ2R1WVcxbEp5d2dibUZ0WlZOd1lXTmxUbUZ0WlN3Z1ptRnNjMlZjY2x4dUlDQk9jMDkxZEM1eVpXZHBjM1JsY2lBblpHVndaVzVrYzA5dUp5d2daR1Z3Wlc1a2MwOXVMQ0JtWVd4elpWeHlYRzRnSUU1elQzVjBYSEpjYmx4eVhHNWNjbHh1SXlNalhISmNia0ZqZEhWaGJHeDVJR1JsWm1sdVpTQjBhR1VnVDBvZ1RtRnRaVk53WVdObFhISmNiaU1qSTF4eVhHNVBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtnZEdocGMwZHNiMkpoYkN3Z2JtRnRaVk53WVdObFRtRnRaU3hjY2x4dUlDQjJZV3gxWlRvZ2JXRnJaVlJvWlVwMWFXTmxLQ2xjY2x4dVhISmNiazlLTG5KbFoybHpkR1Z5SUNkbmJHOWlZV3duTENCMGFHbHpSMnh2WW1Gc1hISmNibHh5WEc1MGFHbHpSRzlqZFcxbGJuUWdQU0I3ZlZ4eVhHNXBaaUIwZVhCbGIyWWdaRzlqZFcxbGJuUWdhWE51ZENBbmRXNWtaV1pwYm1Wa0oxeHlYRzRnSUhSb2FYTkViMk4xYldWdWRDQTlJR1J2WTNWdFpXNTBYSEpjYmx4eVhHNVBTaTV5WldkcGMzUmxjaUFuWkc5amRXMWxiblFuTENCMGFHbHpSRzlqZFcxbGJuUmNjbHh1WEhKY2JrOUtMbkpsWjJsemRHVnlJQ2R1YjI5d0p5d2dMVDVjY2x4dVhISmNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdUMG9pWFgwPSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBPSiwgXywgc3ViTmFtZVNwYWNlcztcblxuT0ogPSByZXF1aXJlKCcuL29qJyk7XG5cbl8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG5cbnN1Yk5hbWVTcGFjZXMgPSBbJ2Vycm9ycycsICdlbnVtcycsICdpbnN0YW5jZU9mJywgJ25vZGVzJywgJ2RiJywgJ2NvbXBvbmVudHMnLCAnY29udHJvbHMnLCAnaW5wdXRzJywgJ25vdGlmaWNhdGlvbnMnLCAnaGlzdG9yeScsICdjb29raWUnLCAnYXN5bmMnXTtcblxuXy5lYWNoKHN1Yk5hbWVTcGFjZXMsIGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIE9KLm1ha2VTdWJOYW1lU3BhY2UobmFtZSk7XG59KTtcblxuT0pbJ0dFTkVSQVRFX1VOSVFVRV9JRFMnXSA9IGZhbHNlO1xuXG5PSlsnREVGQVVMVF9DT01QT05FTlRfUk9PVF9OT0RFVFlQRSddID0gJ2Rpdic7XG5cbk9KWydUUkFDS19PTl9FUlJPUiddID0gZmFsc2U7XG5cbk9KWydMT0dfQUxMX0FKQVgnXSA9IGZhbHNlO1xuXG5PSlsnTE9HX0FMTF9BSkFYX0VSUk9SUyddID0gZmFsc2U7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4dmFrbHVhWFF1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZGUVN4SlFVRkJPenRCUVVGQkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUVUZCVWpzN1FVRkRUQ3hEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCU1Vvc1lVRkJRU3hIUVVGblFpeERRVU5rTEZGQlJHTXNSVUZGWkN4UFFVWmpMRVZCUjJRc1dVRklZeXhGUVVsa0xFOUJTbU1zUlVGTFpDeEpRVXhqTEVWQlRXUXNXVUZPWXl4RlFVOWtMRlZCVUdNc1JVRlJaQ3hSUVZKakxFVkJVMlFzWlVGVVl5eEZRVlZrTEZOQlZtTXNSVUZYWkN4UlFWaGpMRVZCV1dRc1QwRmFZenM3UVVGdFFtaENMRU5CUVVNc1EwRkJReXhKUVVGR0xFTkJRVThzWVVGQlVDeEZRVUZ6UWl4VFFVRkRMRWxCUVVRN1UwRkRjRUlzUlVGQlJTeERRVUZETEdkQ1FVRklMRU5CUVc5Q0xFbEJRWEJDTzBGQlJHOUNMRU5CUVhSQ096dEJRVTFCTEVWQlFVY3NRMEZCUVN4eFFrRkJRU3hEUVVGSUxFZEJRVFJDT3p0QlFVVTFRaXhGUVVGSExFTkJRVUVzYVVOQlFVRXNRMEZCU0N4SFFVRjNRenM3UVVGRmVFTXNSVUZCUnl4RFFVRkJMR2RDUVVGQkxFTkJRVWdzUjBGQmRVSTdPMEZCUlhaQ0xFVkJRVWNzUTBGQlFTeGpRVUZCTEVOQlFVZ3NSMEZCY1VJN08wRkJSWEpDTEVWQlFVY3NRMEZCUVN4eFFrRkJRU3hEUVVGSUxFZEJRVFJDSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SWdJeUFqSUU5S0lGQnZjM1F0U1c1cGRHbGhiR2w2WVhScGIyNWNjbHh1WEhKY2JrOUtJRDBnY21WeGRXbHlaU0FuTGk5dmFpZGNjbHh1WHlBOUlISmxjWFZwY21VZ0oyeHZaR0Z6YUNkY2NseHVYSEpjYmlNZ1UybHRjR3hsSUdGeWNtRjVJRzltSUdGdWRHbGphWEJoZEdWa0wydHViM2R1SUdOb2FXeGtJRzVoYldWemNHRmpaWE5jY2x4dUlDQmNjbHh1YzNWaVRtRnRaVk53WVdObGN5QTlJRnRjY2x4dUlDQW5aWEp5YjNKekoxeHlYRzRnSUNkbGJuVnRjeWRjY2x4dUlDQW5hVzV6ZEdGdVkyVlBaaWRjY2x4dUlDQW5ibTlrWlhNblhISmNiaUFnSjJSaUoxeHlYRzRnSUNkamIyMXdiMjVsYm5SekoxeHlYRzRnSUNkamIyNTBjbTlzY3lkY2NseHVJQ0FuYVc1d2RYUnpKMXh5WEc0Z0lDZHViM1JwWm1sallYUnBiMjV6SjF4eVhHNGdJQ2RvYVhOMGIzSjVKMXh5WEc0Z0lDZGpiMjlyYVdVblhISmNiaUFnSjJGemVXNWpKMXh5WEc1ZFhISmNibHh5WEc0aklDTWpJRk4xWWs1aGJXVlRjR0ZqWlhOY2NseHVYSEpjYmlNZ1VISmxMV0ZzYkc5allYUmxJR05sY25SaGFXNGdZMjl0Ylc5dUlHNWhiV1Z6Y0dGalpYTWdkRzhnWVhadmFXUWdablYwZFhKbElISmhZMlVnWTI5dVpHbDBhVzl1Y3k1Y2NseHVJeUJVYUdseklHUnZaWE1nY21WeGRXbHlaU0IwYUdGMElIUm9aU0J2Y21SbGNpQnZaaUJ2Y0dWeVlYUnBiMjV6SUd4dllXUnpJRTlLTG1OdlptWmxaU0JtYVhKemRDQmhibVFnYjBwSmJtbDBMbU52Wm1abFpTQnpaV052Ym1SY2NseHVYeTVsWVdOb0lITjFZazVoYldWVGNHRmpaWE1zSUNodVlXMWxLU0F0UGx4eVhHNGdJRTlLTG0xaGEyVlRkV0pPWVcxbFUzQmhZMlVnYm1GdFpWeHlYRzRnSUZ4eVhHNGpJQ01qSUVOdmJtWnBaM1Z5WVhScGIyNGdkbUZ5YVdGaWJHVnpYSEpjYmx4eVhHNGpJRUYxZEc5dFlYUnBZMkZzYkhrZ1oyVnVaWEpoZEdVZ2RXNXBjWFZsSUVsRWN5Qm1iM0lnWldGamFDQnViMlJsSUNoa1pXWmhkV3gwSUdaaGJITmxLVnh5WEc1UFNsc25SMFZPUlZKQlZFVmZWVTVKVVZWRlgwbEVVeWRkSUQwZ1ptRnNjMlZjY2x4dUl5QkVaV1poZFd4MElISnZiM1FnYm05a1pTQm1iM0lnWTI5dGNHOXVaVzUwY3k5amIyNTBjbTlzY3lBb1pHVm1ZWFZzZENBblpHbDJKeWxjY2x4dVQwcGJKMFJGUmtGVlRGUmZRMDlOVUU5T1JVNVVYMUpQVDFSZlRrOUVSVlJaVUVVblhTQTlJQ2RrYVhZblhISmNiaU1nVjJobGRHaGxjaUIwYnlCb2IyOXJJR2x1ZEc4Z2RHaGxJR2RzYjJKaGJDQnZiaUJsY25KdmNpQmxkbVZ1ZENCMGJ5QjNjbWwwWlNCbGNuSnZjbk1nZEc4Z1kyOXVjMjlzWlNBb1pHVm1ZWFZzZENCbVlXeHpaU2xjY2x4dVQwcGJKMVJTUVVOTFgwOU9YMFZTVWs5U0oxMGdQU0JtWVd4elpWeHlYRzRqVjJobGRHaGxjaUIwYnlCc2IyY2dZV3hzSUVGS1FWZ2djbVZ4ZFdWemRITmNjbHh1VDBwYkoweFBSMTlCVEV4ZlFVcEJXQ2RkSUQwZ1ptRnNjMlZjY2x4dUkxZG9aWFJvWlhJZ2RHOGdiRzluSUdGc2JDQkJTa0ZZSUdWeWNtOXljMXh5WEc1UFNsc25URTlIWDBGTVRGOUJTa0ZZWDBWU1VrOVNVeWRkSUQwZ1ptRnNjMlVpWFgwPSIsIlxyXG4jIyNcclxuUmV0dXJuIGp1c3QgdGhlIGtleXMgZnJvbSB0aGUgaW5wdXQgYXJyYXksIG9wdGlvbmFsbHkgb25seSBmb3IgdGhlIHNwZWNpZmllZCBzZWFyY2hfdmFsdWVcclxudmVyc2lvbjogMTEwOS4yMDE1XHJcbmRpc2N1c3MgYXQ6IGh0dHA6Ly9waHBqcy5vcmcvZnVuY3Rpb25zL2FycmF5X2tleXNcclxuKyAgIG9yaWdpbmFsIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va2V2aW4udmFuem9ubmV2ZWxkLm5ldClcclxuKyAgICAgIGlucHV0IGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxyXG4rICAgYnVnZml4ZWQgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0KVxyXG4rICAgaW1wcm92ZWQgYnk6IGpkXHJcbisgICBpbXByb3ZlZCBieTogQnJldHQgWmFtaXIgKGh0dHA6Ly9icmV0dC16YW1pci5tZSlcclxuKyAgIGlucHV0IGJ5OiBQXHJcbisgICBidWdmaXhlZCBieTogQnJldHQgWmFtaXIgKGh0dHA6Ly9icmV0dC16YW1pci5tZSlcclxuZXhhbXBsZSAxOiBhcnJheV9rZXlzKCB7Zmlyc3RuYW1lOiAnS2V2aW4nLCBzdXJuYW1lOiAndmFuIFpvbm5ldmVsZCd9ICk7XHJcbnJldHVybnMgMTogezA6ICdmaXJzdG5hbWUnLCAxOiAnc3VybmFtZSd9XHJcbiMjI1xyXG5hcnJheV9rZXlzID0gKGlucHV0LCBzZWFyY2hfdmFsdWUsIGFyZ1N0cmljdCkgLT5cclxuICBzZWFyY2ggPSB0eXBlb2Ygc2VhcmNoX3ZhbHVlIGlzbnQgXCJ1bmRlZmluZWRcIlxyXG4gIHRtcF9hcnIgPSBbXVxyXG4gIHN0cmljdCA9ICEhYXJnU3RyaWN0XHJcbiAgaW5jbHVkZSA9IHRydWVcclxuICBrZXkgPSBcIlwiXHJcbiAgIyBEdWNrLXR5cGUgY2hlY2sgZm9yIG91ciBvd24gYXJyYXkoKS1jcmVhdGVkIFBIUEpTX0FycmF5XHJcbiAgcmV0dXJuIGlucHV0LmtleXMoc2VhcmNoX3ZhbHVlLCBhcmdTdHJpY3QpICBpZiBpbnB1dCBhbmQgdHlwZW9mIGlucHV0IGlzIFwib2JqZWN0XCIgYW5kIGlucHV0LmNoYW5nZV9rZXlfY2FzZVxyXG4gIGZvciBrZXkgb2YgaW5wdXRcclxuICAgIGlmIGlucHV0Lmhhc093blByb3BlcnR5KGtleSlcclxuICAgICAgaW5jbHVkZSA9IHRydWVcclxuICAgICAgaWYgc2VhcmNoXHJcbiAgICAgICAgaWYgc3RyaWN0IGFuZCBpbnB1dFtrZXldIGlzbnQgc2VhcmNoX3ZhbHVlXHJcbiAgICAgICAgICBpbmNsdWRlID0gZmFsc2VcclxuICAgICAgICBlbHNlIGluY2x1ZGUgPSBmYWxzZSAgdW5sZXNzIGlucHV0W2tleV0gaXMgc2VhcmNoX3ZhbHVlXHJcbiAgICAgIHRtcF9hcnJbdG1wX2Fyci5sZW5ndGhdID0ga2V5ICBpZiBpbmNsdWRlXHJcbiAgdG1wX2FyclxyXG5cclxuIyMjKlxyXG5Db252ZXJ0IGEgSmF2YXNjcmlwdCBPamVjdCBhcnJheSBvciBTdHJpbmcgYXJyYXkgdG8gYW4gSFRNTCB0YWJsZVxyXG5KU09OIHBhcnNpbmcgaGFzIHRvIGJlIG1hZGUgYmVmb3JlIGZ1bmN0aW9uIGNhbGxcclxuSXQgYWxsb3dzIHVzZSBvZiBvdGhlciBKU09OIHBhcnNpbmcgbWV0aG9kcyBsaWtlIGpRdWVyeS5wYXJzZUpTT05cclxuaHR0cChzKTovLywgZnRwOi8vLCBmaWxlOi8vIGFuZCBqYXZhc2NyaXB0OjsgbGlua3MgYXJlIGF1dG9tYXRpY2FsbHkgY29tcHV0ZWRcclxuXHJcbkpTT04gZGF0YSBzYW1wbGVzIHRoYXQgc2hvdWxkIGJlIHBhcnNlZCBhbmQgdGhlbiBjYW4gYmUgY29udmVydGVkIHRvIGFuIEhUTUwgdGFibGVcclxudmFyIG9iamVjdEFycmF5ID0gJ1t7XCJUb3RhbFwiOlwiMzRcIixcIlZlcnNpb25cIjpcIjEuMC40XCIsXCJPZmZpY2VcIjpcIk5ldyBZb3JrXCJ9LHtcIlRvdGFsXCI6XCI2N1wiLFwiVmVyc2lvblwiOlwiMS4xLjBcIixcIk9mZmljZVwiOlwiUGFyaXNcIn1dJztcclxudmFyIHN0cmluZ0FycmF5ID0gJ1tcIk5ldyBZb3JrXCIsXCJCZXJsaW5cIixcIlBhcmlzXCIsXCJNYXJyYWtlY2hcIixcIk1vc2Nvd1wiXSc7XHJcbnZhciBuZXN0ZWRUYWJsZSA9ICdbeyBrZXkxOiBcInZhbDFcIiwga2V5MjogXCJ2YWwyXCIsIGtleTM6IHsgdGFibGVJZDogXCJ0YmxJZE5lc3RlZDFcIiwgdGFibGVDbGFzc05hbWU6IFwiY2xzTmVzdGVkXCIsIGxpbmtUZXh0OiBcIkRvd25sb2FkXCIsIGRhdGE6IFt7IHN1YmtleTE6IFwic3VidmFsMVwiLCBzdWJrZXkyOiBcInN1YnZhbDJcIiwgc3Via2V5MzogXCJzdWJ2YWwzXCIgfV0gfSB9XSc7XHJcblxyXG5Db2RlIHNhbXBsZSB0byBjcmVhdGUgYSBIVE1MIHRhYmxlIEphdmFzY3JpcHQgU3RyaW5nXHJcbnZhciBqc29uSHRtbFRhYmxlID0gQ29udmVydEpzb25Ub1RhYmxlKGV2YWwoZGF0YVN0cmluZyksICdqc29uVGFibGUnLCBudWxsLCAnRG93bmxvYWQnKTtcclxuXHJcbkNvZGUgc2FtcGxlIGV4cGxhbmVkXHJcbi0gZXZhbCBpcyB1c2VkIHRvIHBhcnNlIGEgSlNPTiBkYXRhU3RyaW5nXHJcbi0gdGFibGUgSFRNTCBpZCBhdHRyaWJ1dGUgd2lsbCBiZSAnanNvblRhYmxlJ1xyXG4tIHRhYmxlIEhUTUwgY2xhc3MgYXR0cmlidXRlIHdpbGwgbm90IGJlIGFkZGVkXHJcbi0gJ0Rvd25sb2FkJyB0ZXh0IHdpbGwgYmUgZGlzcGxheWVkIGluc3RlYWQgb2YgdGhlIGxpbmsgaXRzZWxmXHJcblxyXG5AYXV0aG9yIEFmc2hpbiBNZWhyYWJhbmkgPGFmc2hpbiBkb3QgbWVoIGF0IGdtYWlsIGRvdCBjb20+XHJcblxyXG5AY2xhc3MgQ29udmVydEpzb25Ub1RhYmxlXHJcblxyXG5AbWV0aG9kIENvbnZlcnRKc29uVG9UYWJsZVxyXG5cclxuQHBhcmFtIHBhcnNlZEpzb24gb2JqZWN0IFBhcnNlZCBKU09OIGRhdGFcclxuQHBhcmFtIHRhYmxlSWQgc3RyaW5nIE9wdGlvbmFsIHRhYmxlIGlkXHJcbkBwYXJhbSB0YWJsZUNsYXNzTmFtZSBzdHJpbmcgT3B0aW9uYWwgdGFibGUgY3NzIGNsYXNzIG5hbWVcclxuQHBhcmFtIGxpbmtUZXh0IHN0cmluZyBPcHRpb25hbCB0ZXh0IHJlcGxhY2VtZW50IGZvciBsaW5rIHBhdHRlcm5cclxuXHJcbkByZXR1cm4gc3RyaW5nIENvbnZlcnRlZCBKU09OIHRvIEhUTUwgdGFibGVcclxuIyMjXHJcbmNsYXNzIEpzb25Ub1RhYmxlIFxyXG4gIFxyXG4gIHRhYmxlOiBudWxsXHJcbiAgXHJcbiAgY29uc3RydWN0b3I6IChwYXJzZWRKc29uLCB0YWJsZUlkLCB0YWJsZUNsYXNzTmFtZSwgbGlua1RleHQpIC0+XHJcbiAgICAjUGF0dGVybnMgZm9yIGxpbmtzIGFuZCBOVUxMIHZhbHVlXHJcbiAgICBpdGFsaWMgPSBcIjxpPnswfTwvaT5cIlxyXG4gICAgbGluayA9IChpZiBsaW5rVGV4dCB0aGVuIFwiPGEgaHJlZj1cXFwiezB9XFxcIj5cIiArIGxpbmtUZXh0ICsgXCI8L2E+XCIgZWxzZSBcIjxhIGhyZWY9XFxcInswfVxcXCI+ezB9PC9hPlwiKVxyXG4gIFxyXG4gICAgI1BhdHRlcm4gZm9yIHRhYmxlICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgIGlkTWFya3VwID0gKGlmIHRhYmxlSWQgdGhlbiBcIiBpZD1cXFwiXCIgKyB0YWJsZUlkICsgXCJcXFwiXCIgZWxzZSBcIlwiKVxyXG4gICAgY2xhc3NNYXJrdXAgPSAoaWYgdGFibGVDbGFzc05hbWUgdGhlbiBcIiBjbGFzcz1cXFwiXCIgKyB0YWJsZUNsYXNzTmFtZSArIFwiXFxcIlwiIGVsc2UgXCJcIilcclxuICAgIHRibCA9IFwiPHRhYmxlIGJvcmRlcj1cXFwiMVxcXCIgY2VsbHBhZGRpbmc9XFxcIjFcXFwiIGNlbGxzcGFjaW5nPVxcXCIxXFxcIlwiICsgaWRNYXJrdXAgKyBjbGFzc01hcmt1cCArIFwiPnswfXsxfTwvdGFibGU+XCJcclxuICBcclxuICAgICNQYXR0ZXJucyBmb3IgdGFibGUgY29udGVudFxyXG4gICAgdGggPSBcIjx0aGVhZD57MH08L3RoZWFkPlwiXHJcbiAgICB0YiA9IFwiPHRib2R5PnswfTwvdGJvZHk+XCJcclxuICAgIHRyID0gXCI8dHI+ezB9PC90cj5cIlxyXG4gICAgdGhSb3cgPSBcIjx0aD57MH08L3RoPlwiXHJcbiAgICB0ZFJvdyA9IFwiPHRkPnswfTwvdGQ+XCJcclxuICAgIHRoQ29uID0gXCJcIlxyXG4gICAgdGJDb24gPSBcIlwiXHJcbiAgICB0ckNvbiA9IFwiXCJcclxuICAgIGlmIHBhcnNlZEpzb25cclxuICAgICAgaXNTdHJpbmdBcnJheSA9IHR5cGVvZiAocGFyc2VkSnNvblswXSkgaXMgXCJzdHJpbmdcIlxyXG4gICAgICBoZWFkZXJzID0gdW5kZWZpbmVkXHJcbiAgICBcclxuICAgICAgIyBDcmVhdGUgdGFibGUgaGVhZGVycyBmcm9tIEpTT04gZGF0YVxyXG4gICAgICAjIElmIEpTT04gZGF0YSBpcyBhIHNpbXBsZSBzdHJpbmcgYXJyYXkgd2UgY3JlYXRlIGEgc2luZ2xlIHRhYmxlIGhlYWRlclxyXG4gICAgICBpZiBpc1N0cmluZ0FycmF5XHJcbiAgICAgICAgdGhDb24gKz0gdGhSb3cuZm9ybWF0KFwidmFsdWVcIilcclxuICAgICAgZWxzZVxyXG4gICAgICBcclxuICAgICAgICAjIElmIEpTT04gZGF0YSBpcyBhbiBvYmplY3QgYXJyYXksIGhlYWRlcnMgYXJlIGF1dG9tYXRpY2FsbHkgY29tcHV0ZWRcclxuICAgICAgICBpZiB0eXBlb2YgKHBhcnNlZEpzb25bMF0pIGlzIFwib2JqZWN0XCJcclxuICAgICAgICAgIGhlYWRlcnMgPSBhcnJheV9rZXlzKHBhcnNlZEpzb25bMF0pXHJcbiAgICAgICAgICBpID0gMFxyXG4gICAgICAgICAgd2hpbGUgaSA8IGhlYWRlcnMubGVuZ3RoXHJcbiAgICAgICAgICAgIHRoQ29uICs9IHRoUm93LmZvcm1hdChoZWFkZXJzW2ldKVxyXG4gICAgICAgICAgICBpKytcclxuICAgICAgdGggPSB0aC5mb3JtYXQodHIuZm9ybWF0KHRoQ29uKSlcclxuICAgIFxyXG4gICAgICAjIENyZWF0ZSB0YWJsZSByb3dzIGZyb20gSnNvbiBkYXRhXHJcbiAgICAgIGlmIGlzU3RyaW5nQXJyYXlcclxuICAgICAgICBpID0gMFxyXG4gICAgICAgIHdoaWxlIGkgPCBwYXJzZWRKc29uLmxlbmd0aFxyXG4gICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KHBhcnNlZEpzb25baV0pXHJcbiAgICAgICAgICB0ckNvbiArPSB0ci5mb3JtYXQodGJDb24pXHJcbiAgICAgICAgICB0YkNvbiA9IFwiXCJcclxuICAgICAgICAgIGkrK1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgaWYgaGVhZGVyc1xyXG4gICAgICAgICAgdXJsUmVnRXhwID0gbmV3IFJlZ0V4cCgvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2cpXHJcbiAgICAgICAgICBqYXZhc2NyaXB0UmVnRXhwID0gbmV3IFJlZ0V4cCgvKF5qYXZhc2NyaXB0OltcXHNcXFNdKjskKS9nKVxyXG4gICAgICAgICAgaSA9IDBcclxuICAgICAgICAgIHdoaWxlIGkgPCBwYXJzZWRKc29uLmxlbmd0aFxyXG4gICAgICAgICAgICBqID0gMFxyXG4gICAgICAgICAgICB3aGlsZSBqIDwgaGVhZGVycy5sZW5ndGhcclxuICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlZEpzb25baV1baGVhZGVyc1tqXV1cclxuICAgICAgICAgICAgICBpc1VybCA9IHVybFJlZ0V4cC50ZXN0KHZhbHVlKSBvciBqYXZhc2NyaXB0UmVnRXhwLnRlc3QodmFsdWUpXHJcbiAgICAgICAgICAgICAgaWYgaXNVcmwgIyBJZiB2YWx1ZSBpcyBVUkwgd2UgYXV0by1jcmVhdGUgYSBsaW5rXHJcbiAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQobGluay5mb3JtYXQodmFsdWUpKVxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGlmIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgIGlmIHR5cGVvZiAodmFsdWUpIGlzIFwib2JqZWN0XCJcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgI2ZvciBzdXBwb3J0aW5nIG5lc3RlZCB0YWJsZXNcclxuICAgICAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQoQ29udmVydEpzb25Ub1RhYmxlKGV2YWwodmFsdWUuZGF0YSksIHZhbHVlLnRhYmxlSWQsIHZhbHVlLnRhYmxlQ2xhc3NOYW1lLCB2YWx1ZS5saW5rVGV4dCkpXHJcbiAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQodmFsdWUpXHJcbiAgICAgICAgICAgICAgICBlbHNlICMgSWYgdmFsdWUgPT0gbnVsbCB3ZSBmb3JtYXQgaXQgbGlrZSBQaHBNeUFkbWluIE5VTEwgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChpdGFsaWMuZm9ybWF0KHZhbHVlKS50b1VwcGVyQ2FzZSgpKVxyXG4gICAgICAgICAgICAgIGorK1xyXG4gICAgICAgICAgICB0ckNvbiArPSB0ci5mb3JtYXQodGJDb24pXHJcbiAgICAgICAgICAgIHRiQ29uID0gXCJcIlxyXG4gICAgICAgICAgICBpKytcclxuICAgICAgdGIgPSB0Yi5mb3JtYXQodHJDb24pXHJcbiAgICAgIHRibCA9IHRibC5mb3JtYXQodGgsIHRiKVxyXG4gICAgQHRhYmxlID0gdGJsXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEpzb25Ub1RhYmxlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuYXJyYXkyRCA9IChpbml0TGVuZ3RoLCBpbml0V2lkdGgpIC0+XHJcbiAgYXJyYXkgPSBbXVxyXG4gIG1heExlbmd0aCA9IDBcclxuICBtYXhXaWR0aCA9IDBcclxuICAgIFxyXG4gIHJldCA9IFxyXG4gICAgZ2V0OiAocm93Tm8sIGNvbE5vKSAtPlxyXG4gICAgICBleHRlbmQgcm93Tm8sIGNvbE5vXHJcbiAgICBzZXQ6IChyb3dObywgY29sTm8sIHZhbCkgLT5cclxuICAgICAgcmV0LmdldCByb3dObywgY29sTm9cclxuICAgICAgcm93SWR4ID0gcm93Tm8tMVxyXG4gICAgICBjb2xJZHggPSBjb2xOby0xXHJcbiAgICAgIGFycmF5W3Jvd0lkeF1bY29sSWR4XSA9IHZhbFxyXG4gICAgZWFjaDogKGNhbGxCYWNrKSAtPlxyXG4gICAgICBfLmVhY2ggYXJyYXksIChjb2x1bW5zLCByb3cpIC0+XHJcbiAgICAgICAgXy5lYWNoIGFycmF5W3Jvd10sICh2YWwsIGNvbCkgLT5cclxuICAgICAgICAgIHJvd0lkeCA9IHJvdysxXHJcbiAgICAgICAgICBjb2xJZHggPSBjb2wrMVxyXG4gICAgICAgICAgY2FsbEJhY2sgcm93SWR4LCBjb2xJZHgsIHZhbFxyXG4gICAgd2lkdGg6ICgpIC0+XHJcbiAgICAgIG1heFdpZHRoXHJcbiAgICBsZW5ndGg6ICgpIC0+XHJcbiAgICAgIG1heExlbmd0aFxyXG4gICAgICAgICBcclxuICAjIyNcclxuICBHdWFyYW50ZWUgdGhhdCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgYXJyYXkgYXJlIGFsd2F5cyBiYWNrZWQgYnkgdmFsdWVzIGF0IGV2ZXJ5IHBvc2l0aW9uXHJcbiAgIyMjICAgICAgICAgICAgICAgICAgICBcclxuICBleHRlbmQgPSAobGVuZ3RoLCB3aWR0aCkgLT4gIFxyXG4gICAgaWYgbm90IGxlbmd0aCBvciBsZW5ndGggPCAxIHRoZW4gbGVuZ3RoID0gMVxyXG4gICAgaWYgbm90IHdpZHRoIG9yIHdpZHRoIDwgMSB0aGVuIHdpZHRoID0gMVxyXG4gICAgICBcclxuICAgIGlmIG1heExlbmd0aCA8IGxlbmd0aCB0aGVuIG1heExlbmd0aCA9IGxlbmd0aFxyXG4gICAgaWYgYXJyYXkubGVuZ3RoID4gbWF4TGVuZ3RoIHRoZW4gbWF4TGVuZ3RoID0gYXJyYXkubGVuZ3RoXHJcbiAgICBpZiBtYXhXaWR0aCA8IHdpZHRoIHRoZW4gbWF4V2lkdGggPSB3aWR0aFxyXG4gICAgaSA9IDBcclxuICAgICAgXHJcbiAgICB3aGlsZSBpIDwgbWF4TGVuZ3RoXHJcbiAgICAgIHRyeVJvdyA9IGFycmF5W2ldXHJcbiAgICAgIGlmIG5vdCB0cnlSb3dcclxuICAgICAgICB0cnlSb3cgPSBbXVxyXG4gICAgICAgIGFycmF5LnB1c2ggdHJ5Um93XHJcbiAgICAgIGlmIG1heFdpZHRoIDwgdHJ5Um93Lmxlbmd0aCB0aGVuIG1heFdpZHRoID0gdHJ5Um93Lmxlbmd0aFxyXG4gICAgICBpZiB0cnlSb3cubGVuZ3RoIDwgbWF4V2lkdGggdGhlbiB0cnlSb3cubGVuZ3RoID0gbWF4V2lkdGhcclxuICAgICAgaSArPSAxXHJcbiAgICAgIFxyXG4gICAgYXJyYXlbbGVuZ3RoLTFdW3dpZHRoLTFdXHJcbiAgICAgICBcclxuICBleHRlbmQgaW5pdExlbmd0aCwgaW5pdFdpZHRoXHJcbiAgICBcclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdhcnJheTJEJywgYXJyYXkyRFxyXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5MkQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5tZXRob2RzID0gW1xyXG4gICdhc3NlcnQnXHJcbiAgJ2NsZWFyJ1xyXG4gICdjb3VudCdcclxuICAnZGVidWcnXHJcbiAgJ2RpcidcclxuICAnZGlyeG1sJ1xyXG4gICdlcnJvcidcclxuICAnZXhjZXB0aW9uJ1xyXG4gICdncm91cCdcclxuICAnZ3JvdXBDb2xsYXBzZWQnXHJcbiAgJ2dyb3VwRW5kJ1xyXG4gICdpbmZvJ1xyXG4gICdsb2cnXHJcbiAgJ21lbW9yeSdcclxuICAncHJvZmlsZSdcclxuICAncHJvZmlsZUVuZCdcclxuICAndGFibGUnXHJcbiAgJ3RpbWUnXHJcbiAgJ3RpbWVFbmQnXHJcbiAgJ3RpbWVTdGFtcCdcclxuICAndGltZWxpbmUnXHJcbiAgJ3RpbWVsaW5lRW5kJ1xyXG4gICd0cmFjZSdcclxuICAnd2FybidcclxuXVxyXG5tZXRob2RMZW5ndGggPSBtZXRob2RzLmxlbmd0aFxyXG5jb25zb2xlID0gT0ouZ2xvYmFsLmNvbnNvbGUgb3Ige31cclxuT0oubWFrZVN1Yk5hbWVTcGFjZSAnY29uc29sZSdcclxuICBcclxuIyMjXHJcbjEuIFN0dWIgb3V0IGFueSBtaXNzaW5nIG1ldGhvZHMgd2l0aCBub29wXHJcbjIuIERlZmluZSB0aGUgYXZhaWxhYmxlIG1ldGhvZHMgb24gdGhlIE9KLmNvbnNvbGUgb2JqZWN0XHJcbiMjI1xyXG53aGlsZSBtZXRob2RMZW5ndGgtLVxyXG4gICgtPlxyXG4gICAgbWV0aG9kID0gbWV0aG9kc1ttZXRob2RMZW5ndGhdXHJcbiAgICBcclxuICAgICMgT25seSBzdHViIHVuZGVmaW5lZCBtZXRob2RzLlxyXG4gICAgY29uc29sZVttZXRob2RdID0gT0oubm9vcCB1bmxlc3MgY29uc29sZVttZXRob2RdXHJcbiAgICBcclxuICAgICNEZWZpbmUgdGhlIG1ldGhvZCBvbiB0aGUgT0ogY29uc29sZSBuYW1lc3BhY2VcclxuICAgIE9KLmNvbnNvbGUucmVnaXN0ZXIgbWV0aG9kLCAocGFyYW1zLi4uKSAtPlxyXG4gICAgICBjb25zb2xlW21ldGhvZF0gcGFyYW1zLi4uXHJcbiAgKSgpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnNvbGUiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCwgT0osIGFsbCwgY29va2llcywgZGVsLCBkZWxldGVBbGwsIGdldCwgc2V0O1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbiQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cblxuLypcblNldHVwIHNldHRpbmdzXG4kLmNvb2tpZS5yYXcgPSB0cnVlXG4kLmNvb2tpZS5qc29uID0gdHJ1ZVxuICBcblNldHVwIGRlZmF1bHRzXG5odHRwczovL2dpdGh1Yi5jb20vY2FyaGFydGwvanF1ZXJ5LWNvb2tpZS9cbiQuY29va2llLmRlZmF1bHRzLmV4cGlyZXMgPSAzNjVcbiQuY29va2llLmRlZmF1bHRzLnBhdGggPSAnLydcbiQuY29va2llLmRlZmF1bHRzLmRvbWFpbiA9ICdvai5jb20nXG4gKi9cblxuaWYgKCEkIHx8ICEkLmNvb2tpZSkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ2pRdWVyeSBDb29raWUgaXMgYSByZXF1aXJlZCBkZXBlbmRlbmN5LicpO1xufVxuXG4kLmNvb2tpZS5kZWZhdWx0cy5zZWN1cmUgPSBmYWxzZTtcblxuY29va2llcyA9IHt9O1xuXG5nZXQgPSBmdW5jdGlvbihjb29raWVOYW1lLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIHJldCA9ICcnO1xuICBpZiAoY29va2llTmFtZSkge1xuICAgIGlmICh0eXBlKSB7XG4gICAgICByZXQgPSAkLmNvb2tpZShjb29raWVOYW1lLCB0eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0ID0gJC5jb29raWUoY29va2llTmFtZSk7XG4gICAgfVxuICAgIGlmIChyZXQpIHtcbiAgICAgIHJldHVybiBjb29raWVzW2Nvb2tpZU5hbWVdID0gcmV0O1xuICAgIH1cbiAgfVxufTtcblxuYWxsID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXQ7XG4gIHJldCA9ICQuY29va2llKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5zZXQgPSBmdW5jdGlvbihjb29raWVOYW1lLCB2YWx1ZSwgb3B0cykge1xuICB2YXIgcmV0O1xuICByZXQgPSAnJztcbiAgaWYgKGNvb2tpZU5hbWUpIHtcbiAgICBjb29raWVzW2Nvb2tpZU5hbWVdID0gdmFsdWU7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgIHJldCA9ICQuY29va2llKGNvb2tpZU5hbWUsIHZhbHVlLCBvcHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0ID0gJC5jb29raWUoY29va2llTmFtZSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxuZGVsID0gZnVuY3Rpb24oY29va2llTmFtZSwgb3B0cykge1xuICBpZiAoY29va2llTmFtZSkge1xuICAgIGlmIChvcHRzKSB7XG4gICAgICAkLnJlbW92ZUNvb2tpZShjb29raWVOYW1lLCBvcHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJC5yZW1vdmVDb29raWUoY29va2llTmFtZSk7XG4gICAgfVxuICAgIGRlbGV0ZSBjb29raWVzW2Nvb2tpZU5hbWVdO1xuICB9XG59O1xuXG5kZWxldGVBbGwgPSBmdW5jdGlvbigpIHtcbiAgY29va2llcyA9IHt9O1xuICBPSi5lYWNoKE9KLmNvb2tpZS5hbGwsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgcmV0dXJuIE9KLmNvb2tpZVtcImRlbGV0ZVwiXShrZXkpO1xuICB9KTtcbn07XG5cbk9KLmNvb2tpZS5yZWdpc3RlcignZGVsZXRlQWxsJywgZGVsZXRlQWxsKTtcblxuT0ouY29va2llLnJlZ2lzdGVyKCdkZWxldGUnLCBkZWwpO1xuXG5PSi5jb29raWUucmVnaXN0ZXIoJ3NldCcsIHNldCk7XG5cbk9KLmNvb2tpZS5yZWdpc3RlcignZ2V0JywgZ2V0KTtcblxuT0ouY29va2llLnJlZ2lzdGVyKCdhbGwnLCBhbGwpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGVsZXRlQWxsOiBkZWxldGVBbGwsXG4gIFwiZGVsZXRlXCI6IGRlbCxcbiAgc2V0OiBzZXQsXG4gIGdldDogZ2V0LFxuICBhbGw6IGFsbFxufTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRngwYjI5c2MxeGNZMjl2YTJsbExtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlFVRXNTVUZCUVRzN1FVRkJRU3hGUVVGQkxFZEJRVXNzVDBGQlFTeERRVUZSTEU5QlFWSTdPMEZCUTB3c1EwRkJRU3hIUVVGSkxFOUJRVUVzUTBGQlVTeFJRVUZTT3pzN1FVRkZTanM3T3pzN096czdPenM3TzBGQlYwRXNTVUZCUnl4RFFVRkpMRU5CUVVvc1NVRkJVeXhEUVVGSkxFTkJRVU1zUTBGQlF5eE5RVUZzUWp0QlFVTkZMRkZCUVZVc1NVRkJRU3hMUVVGQkxFTkJRVTBzZVVOQlFVNHNSVUZFV2pzN08wRkJSVUVzUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJiRUlzUjBGQk1rSTdPMEZCUlROQ0xFOUJRVUVzUjBGQlZUczdRVUZGVml4SFFVRkJMRWRCUVUwc1UwRkJReXhWUVVGRUxFVkJRV0VzU1VGQllqdEJRVU5LTEUxQlFVRTdSVUZCUVN4SFFVRkJMRWRCUVUwN1JVRkRUaXhKUVVGSExGVkJRVWc3U1VGRFJTeEpRVUZITEVsQlFVZzdUVUZEUlN4SFFVRkJMRWRCUVUwc1EwRkJReXhEUVVGRExFMUJRVVlzUTBGQlV5eFZRVUZVTEVWQlFYRkNMRWxCUVhKQ0xFVkJSRkk3UzBGQlFTeE5RVUZCTzAxQlIwVXNSMEZCUVN4SFFVRk5MRU5CUVVNc1EwRkJReXhOUVVGR0xFTkJRVk1zVlVGQlZDeEZRVWhTT3p0SlFVbEJMRWxCUVVjc1IwRkJTRHRoUVVORkxFOUJRVkVzUTBGQlFTeFZRVUZCTEVOQlFWSXNSMEZCYzBJc1NVRkVlRUk3UzBGTVJqczdRVUZHU1RzN1FVRlZUaXhIUVVGQkxFZEJRVTBzVTBGQlFUdEJRVU5LTEUxQlFVRTdSVUZCUVN4SFFVRkJMRWRCUVUwc1EwRkJReXhEUVVGRExFMUJRVVlzUTBGQlFUdFRRVU5PTzBGQlJrazdPMEZCU1U0c1IwRkJRU3hIUVVGTkxGTkJRVU1zVlVGQlJDeEZRVUZoTEV0QlFXSXNSVUZCYjBJc1NVRkJjRUk3UVVGRFNpeE5RVUZCTzBWQlFVRXNSMEZCUVN4SFFVRk5PMFZCUTA0c1NVRkJSeXhWUVVGSU8wbEJRMFVzVDBGQlVTeERRVUZCTEZWQlFVRXNRMEZCVWl4SFFVRnpRanRKUVVOMFFpeEpRVUZITEVsQlFVZzdUVUZEUlN4SFFVRkJMRWRCUVUwc1EwRkJReXhEUVVGRExFMUJRVVlzUTBGQlV5eFZRVUZVTEVWQlFYRkNMRXRCUVhKQ0xFVkJRVFJDTEVsQlFUVkNMRVZCUkZJN1MwRkJRU3hOUVVGQk8wMUJSMFVzUjBGQlFTeEhRVUZOTEVOQlFVTXNRMEZCUXl4TlFVRkdMRU5CUVZNc1ZVRkJWQ3hGUVVGeFFpeExRVUZ5UWl4RlFVaFNPMHRCUmtZN08xTkJUVUU3UVVGU1NUczdRVUZWVGl4SFFVRkJMRWRCUVUwc1UwRkJReXhWUVVGRUxFVkJRV0VzU1VGQllqdEZRVU5LTEVsQlFVY3NWVUZCU0R0SlFVTkZMRWxCUVVjc1NVRkJTRHROUVVORkxFTkJRVU1zUTBGQlF5eFpRVUZHTEVOQlFXVXNWVUZCWml4RlFVRXlRaXhKUVVFelFpeEZRVVJHTzB0QlFVRXNUVUZCUVR0TlFVZEZMRU5CUVVNc1EwRkJReXhaUVVGR0xFTkJRV1VzVlVGQlppeEZRVWhHT3p0SlFVbEJMRTlCUVU4c1QwRkJVU3hEUVVGQkxGVkJRVUVzUlVGTWFrSTdPMEZCUkVrN08wRkJVMDRzVTBGQlFTeEhRVUZaTEZOQlFVRTdSVUZEVml4UFFVRkJMRWRCUVZVN1JVRkRWaXhGUVVGRkxFTkJRVU1zU1VGQlNDeERRVUZSTEVWQlFVVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJiRUlzUlVGQmRVSXNVMEZCUXl4SFFVRkVMRVZCUVUwc1IwRkJUanRYUVVOeVFpeEZRVUZGTEVOQlFVTXNUVUZCVFN4RFFVRkRMRkZCUVVRc1EwRkJWQ3hEUVVGcFFpeEhRVUZxUWp0RlFVUnhRaXhEUVVGMlFqdEJRVVpWT3p0QlFVMVlMRVZCUVVVc1EwRkJReXhOUVVGTkxFTkJRVU1zVVVGQlZpeERRVUZ0UWl4WFFVRnVRaXhGUVVGblF5eFRRVUZvUXpzN1FVRkRRU3hGUVVGRkxFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWWXNRMEZCYlVJc1VVRkJia0lzUlVGQk5rSXNSMEZCTjBJN08wRkJRMEVzUlVGQlJTeERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRldMRU5CUVcxQ0xFdEJRVzVDTEVWQlFUQkNMRWRCUVRGQ096dEJRVU5CTEVWQlFVVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1VVRkJWaXhEUVVGdFFpeExRVUZ1UWl4RlFVRXdRaXhIUVVFeFFqczdRVUZEUVN4RlFVRkZMRU5CUVVNc1RVRkJUU3hEUVVGRExGRkJRVllzUTBGQmJVSXNTMEZCYmtJc1JVRkJNa0lzUjBGQk0wSTdPMEZCUlVFc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGRFF6dEZRVUZCTEZOQlFVRXNSVUZCVnl4VFFVRllPMFZCUTBFc1VVRkJRU3hGUVVGUkxFZEJSRkk3UlVGRlFTeEhRVUZCTEVWQlFVc3NSMEZHVER0RlFVZEJMRWRCUVVFc1JVRkJTeXhIUVVoTU8wVkJTVUVzUjBGQlFTeEZRVUZOTEVkQlNrNGlMQ0ptYVd4bElqb2laMlZ1WlhKaGRHVmtMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWs5S0lEMGdjbVZ4ZFdseVpTQW5MaTR2YjJvblhISmNiaVFnUFNCeVpYRjFhWEpsSUNkcWNYVmxjbmtuWEhKY2JpQWdYSEpjYmlNakkxeHlYRzVUWlhSMWNDQnpaWFIwYVc1bmMxeHlYRzRrTG1OdmIydHBaUzV5WVhjZ1BTQjBjblZsWEhKY2JpUXVZMjl2YTJsbExtcHpiMjRnUFNCMGNuVmxYSEpjYmlBZ1hISmNibE5sZEhWd0lHUmxabUYxYkhSelhISmNibWgwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzlqWVhKb1lYSjBiQzlxY1hWbGNua3RZMjl2YTJsbEwxeHlYRzRrTG1OdmIydHBaUzVrWldaaGRXeDBjeTVsZUhCcGNtVnpJRDBnTXpZMVhISmNiaVF1WTI5dmEybGxMbVJsWm1GMWJIUnpMbkJoZEdnZ1BTQW5MeWRjY2x4dUpDNWpiMjlyYVdVdVpHVm1ZWFZzZEhNdVpHOXRZV2x1SUQwZ0oyOXFMbU52YlNkY2NseHVJeU1qWEhKY2JtbG1JRzV2ZENBa0lHOXlJRzV2ZENBa0xtTnZiMnRwWlZ4eVhHNGdJSFJvY205M0lHNWxkeUJGY25KdmNpQW5hbEYxWlhKNUlFTnZiMnRwWlNCcGN5QmhJSEpsY1hWcGNtVmtJR1JsY0dWdVpHVnVZM2t1SnlBZ1hISmNiaVF1WTI5dmEybGxMbVJsWm1GMWJIUnpMbk5sWTNWeVpTQTlJR1poYkhObFhISmNiaUFnWEhKY2JtTnZiMnRwWlhNZ1BTQjdmVnh5WEc0Z0lGeHlYRzVuWlhRZ1BTQW9ZMjl2YTJsbFRtRnRaU3dnZEhsd1pTa2dMVDVjY2x4dUlDQnlaWFFnUFNBbkoxeHlYRzRnSUdsbUlHTnZiMnRwWlU1aGJXVmNjbHh1SUNBZ0lHbG1JSFI1Y0dWY2NseHVJQ0FnSUNBZ2NtVjBJRDBnSkM1amIyOXJhV1VnWTI5dmEybGxUbUZ0WlN3Z2RIbHdaVnh5WEc0Z0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNCeVpYUWdQU0FrTG1OdmIydHBaU0JqYjI5cmFXVk9ZVzFsSUNBZ0lGeHlYRzRnSUNBZ2FXWWdjbVYwWEhKY2JpQWdJQ0FnSUdOdmIydHBaWE5iWTI5dmEybGxUbUZ0WlYwZ1BTQnlaWFJjY2x4dUlDQmNjbHh1WVd4c0lEMGdMVDVjY2x4dUlDQnlaWFFnUFNBa0xtTnZiMnRwWlNncFhISmNiaUFnY21WMFhISmNiaUFnSUNCY2NseHVjMlYwSUQwZ0tHTnZiMnRwWlU1aGJXVXNJSFpoYkhWbExDQnZjSFJ6S1NBdFBseHlYRzRnSUhKbGRDQTlJQ2NuWEhKY2JpQWdhV1lnWTI5dmEybGxUbUZ0WlZ4eVhHNGdJQ0FnWTI5dmEybGxjMXRqYjI5cmFXVk9ZVzFsWFNBOUlIWmhiSFZsWEhKY2JpQWdJQ0JwWmlCdmNIUnpYSEpjYmlBZ0lDQWdJSEpsZENBOUlDUXVZMjl2YTJsbElHTnZiMnRwWlU1aGJXVXNJSFpoYkhWbExDQnZjSFJ6WEhKY2JpQWdJQ0JsYkhObFhISmNiaUFnSUNBZ0lISmxkQ0E5SUNRdVkyOXZhMmxsSUdOdmIydHBaVTVoYldVc0lIWmhiSFZsWEhKY2JpQWdjbVYwSUNCY2NseHVJQ0JjY2x4dVpHVnNJRDBnS0dOdmIydHBaVTVoYldVc0lHOXdkSE1wSUMwK1hISmNiaUFnYVdZZ1kyOXZhMmxsVG1GdFpWeHlYRzRnSUNBZ2FXWWdiM0IwYzF4eVhHNGdJQ0FnSUNBa0xuSmxiVzkyWlVOdmIydHBaU0JqYjI5cmFXVk9ZVzFsTENCdmNIUnpYSEpjYmlBZ0lDQmxiSE5sWEhKY2JpQWdJQ0FnSUNRdWNtVnRiM1psUTI5dmEybGxJR052YjJ0cFpVNWhiV1VnSUNBZ1hISmNiaUFnSUNCa1pXeGxkR1VnWTI5dmEybGxjMXRqYjI5cmFXVk9ZVzFsWFZ4eVhHNGdJSEpsZEhWeWJseHlYRzRnSUNBZ1hISmNibVJsYkdWMFpVRnNiQ0E5SUMwK1hISmNiaUFnWTI5dmEybGxjeUE5SUh0OVhISmNiaUFnVDBvdVpXRmphQ0JQU2k1amIyOXJhV1V1WVd4c0xDQW9kbUZzTENCclpYa3BJQzArWEhKY2JpQWdJQ0JQU2k1amIyOXJhV1V1WkdWc1pYUmxJR3RsZVNBZ1hISmNiaUFnY21WMGRYSnVYSEpjYmlBZ0lDQmNjbHh1SUU5S0xtTnZiMnRwWlM1eVpXZHBjM1JsY2lBblpHVnNaWFJsUVd4c0p5d2daR1ZzWlhSbFFXeHNYSEpjYmlCUFNpNWpiMjlyYVdVdWNtVm5hWE4wWlhJZ0oyUmxiR1YwWlNjc0lHUmxiRnh5WEc0Z1Qwb3VZMjl2YTJsbExuSmxaMmx6ZEdWeUlDZHpaWFFuTENCelpYUmNjbHh1SUU5S0xtTnZiMnRwWlM1eVpXZHBjM1JsY2lBbloyVjBKeXdnWjJWMFhISmNiaUJQU2k1amIyOXJhV1V1Y21WbmFYTjBaWElnSjJGc2JDY3NJQ0JoYkd4Y2NseHVJRnh5WEc0Z2JXOWtkV3hsTG1WNGNHOXlkSE1nUFNCY2NseHVJQ0JrWld4bGRHVkJiR3c2SUdSbGJHVjBaVUZzYkZ4eVhHNGdJR1JsYkdWMFpUb2daR1ZzWEhKY2JpQWdjMlYwT2lCelpYUmNjbHh1SUNCblpYUTZJR2RsZEZ4eVhHNGdJR0ZzYkRvZ0lHRnNiQ0pkZlE9PSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmRlZmVyID0gKG1ldGhvZCwgd2FpdE1zKSAtPlxyXG4gIGlmIHdhaXRNcyBhbmQgc2V0VGltZW91dFxyXG4gICAgc2V0VGltZW91dCBtZXRob2QsIHdhaXRNc1xyXG4gIChuZXcgUHJvbWlzZSAocmVzb2x2ZSkgLT5cclxuICAgIHJlc29sdmUoKSkudGhlbiBtZXRob2RcclxuICBcclxuT0oucmVnaXN0ZXIgJ2RlZmVyJywgZGVmZXJcclxubW9kdWxlLmV4cG9ydHMgPSBkZWZlciIsIiMgIyBlYWNoXHJcblxyXG5PSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuIyAjIyBjYW5FYWNoXHJcbmNhbkVhY2ggPSAob2JqKSAtPlxyXG4gICMgUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBbaXNdKGlzLmh0bWwpIHRydWx5IGl0ZXJhYmxlIChlLmcuIGFuIGluc3RhbmNlIG9mIE9iamVjdCBvciBBcnJheSlcclxuICBPSi5pcy5wbGFpbk9iamVjdChvYmopIG9yIE9KLmlzLm9iamVjdChvYmopIG9yIE9KLmlzLmFycmF5IG9ialxyXG5cclxuIyAjIyBbT0pdKG9qLmh0bWwpLmVhY2hcclxuXHJcbiMgSXRlcmF0ZSBhbGwgb2YgdGhlIG1lbWJlcnMgb2YgYW4gb2JqZWN0IChvciBhbiBhcnJheSkgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBhbmQgcmVjdXJzaW9uLlxyXG5cclxuIyAtIGBvYmpgOiB0aGUgb2JqZWN0IHRvIGl0ZXJhdGUsXHJcbiMgLSBgb25FYWNoYDogYSBjYWxsYmFjayB0byBleGVjdXRlIGZvciBlYWNoIGl0ZXJhdGlvbixcclxuIyAtIGByZWN1cnNpdmVgOiBpZiB0cnVlLCByZWN1cnNpdmVseSBpdGVyYXRlIGFsbCB2YWxpZCBjaGlsZCBvYmplY3RzLlxyXG5lYWNoID0gKG9iaiwgb25FYWNoLCByZWN1cnNpdmUpIC0+XHJcbiAgaWYgY2FuRWFjaCBvYmpcclxuICAgICMgVXNpbmcgW0xvLURhc2hdKGh0dHA6Ly9sb2Rhc2guY29tL2RvY3MjZm9yb3duKSdzIGBmb3JPd25gIG1ldGhvZCB0byBlbnN1cmUgdGhhdCBvbmx5IHRoZSBhY3R1YWwgcHJvcGVydGllcyBvZiB0aGUgb2JqZWN0IGFyZSBlbnVtZXJhdGVkLlxyXG5cclxuICAgICMgLSBgb25FYWNoYCBjYWxsYmFjayB3aWxsIHJlY2VpdmUgMiBwYXJhbWV0ZXJzOlxyXG4gICAgIyAtIGB2YWxgIGFuZCBga2V5YC5cclxuICAgICMgLSBgdmFsYCBpcyBhbHdheXMgdGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eS5cclxuICAgICMgLSBga2V5YCBpcyBlaXRoZXIgdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IG9yIHRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBhcnJheS5cclxuICAgIF8uZm9yT3duIG9iaiwgKHZhbCwga2V5KSAtPlxyXG4gICAgICBpZiBvbkVhY2ggYW5kICh2YWwgb3Iga2V5KVxyXG4gICAgICAgIHF1aXQgPSBvbkVhY2ggdmFsLCBrZXlcclxuICAgICAgICByZXR1cm4gZmFsc2UgIGlmIGZhbHNlIGlzIHF1aXRcclxuICAgICAgZWFjaCB2YWwsIG9uRWFjaCwgdHJ1ZSAgaWYgdHJ1ZSBpcyByZWN1cnNpdmVcclxuICAgICAgcmV0dXJuXHJcblxyXG4gIHJldHVyblxyXG5cclxuIyAjIyByZWdpc3RlclxyXG5cclxuIyByZWdpc3RlciB0aGUgYGVhY2hgIG1ldGhvZCBvbiB0aGUgW09KXShPSi5odG1sKSBuYW1lc3BhY2VcclxuT0oucmVnaXN0ZXIgJ2VhY2gnLCBlYWNoXHJcbm1vZHVsZS5leHBvcnRzID0gZWFjaCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbnVua25vd24gPSAndW5rbm93bicgICBcclxuICBcclxuaW5wdXRUeXBlcyA9XHJcbiAgYnV0dG9uOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDBcclxuICAgIG5hbWU6ICdidXR0b24nXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGNoZWNrYm94OiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDFcclxuICAgIG5hbWU6ICdjaGVja2JveCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBjb2xvcjogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyXHJcbiAgICBuYW1lOiAnY29sb3InXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgZGF0ZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAzXHJcbiAgICBuYW1lOiAnZGF0ZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGRhdGV0aW1lOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDRcclxuICAgIG5hbWU6ICdkYXRldGltZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICAnZGF0ZXRpbWUtbG9jYWwnOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDVcclxuICAgIG5hbWU6ICdkYXRldGltZS1sb2NhbCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGVtYWlsOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDZcclxuICAgIG5hbWU6ICdlbWFpbCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgZmlsZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA3XHJcbiAgICBuYW1lOiAnZmlsZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiBmYWxzZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGhpZGRlbjogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA4XHJcbiAgICBuYW1lOiAnaGlkZGVuJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBpbWFnZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA5XHJcbiAgICBuYW1lOiAnaW1hZ2UnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIG1vbnRoOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDEwXHJcbiAgICBuYW1lOiAnbW9udGgnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIG51bWJlcjogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxMVxyXG4gICAgbmFtZTogJ251bWJlcidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBwYXNzd29yZDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxMlxyXG4gICAgbmFtZTogJ3Bhc3N3b3JkJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcmFkaW86ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTNcclxuICAgIG5hbWU6ICdyYWRpbydcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICByYW5nZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxNFxyXG4gICAgbmFtZTogJ3JhbmdlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHJlc2V0OiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE1XHJcbiAgICBuYW1lOiAncmVzZXQnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHNlYXJjaDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxNlxyXG4gICAgbmFtZTogJ3NlYXJjaCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHN1Ym1pdDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxN1xyXG4gICAgbmFtZTogJ3N1Ym1pdCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgdGVsOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE4XHJcbiAgICBuYW1lOiAnYnV0dG9uJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgdGV4dDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxOVxyXG4gICAgbmFtZTogJ3RleHQnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHRpbWU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMjBcclxuICAgIG5hbWU6ICd0aW1lJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgdXJsOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDIxXHJcbiAgICBuYW1lOiAndXJsJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB3ZWVrOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDIyXHJcbiAgICBuYW1lOiAnd2VlaydcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbk9KLmVudW1zLnJlZ2lzdGVyICd1bmtub3duJywgdW5rbm93blxyXG5PSi5lbnVtcy5yZWdpc3RlciAnaW5wdXRUeXBlcycsIGlucHV0VHlwZXNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gXHJcbiAgdW5rbm93bjogdW5rbm93blxyXG4gIGlucHV0VHlwZXM6IGlucHV0VHlwZXMiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuaWYgT0ouZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXJcclxuICBldmVudE5hbWUgPSAnYWRkRXZlbnRMaXN0ZW5lcidcclxuICBldmVudEluZm8gPSAnJ1xyXG5lbHNlIFxyXG4gIGV2ZW50TmFtZSA9ICdhdHRhY2hFdmVudCdcclxuICBldmVudEluZm8gPSAnb24nXHJcbiAgXHJcbnB1c2hTdGF0ZSA9IChwYWdlTmFtZSwgZXZlbnQpIC0+XHJcbiAgaWYgcGFnZU5hbWVcclxuICAgICMga2VlcCB0aGUgbGluayBpbiB0aGUgYnJvd3NlciBoaXN0b3J5XHJcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSBudWxsLCBudWxsLCAnIycgKyBwYWdlTmFtZVxyXG4gICAgICBcclxuICAgICMgaGVyZSBjYW4gY2F1c2UgZGF0YSBsb2FkaW5nLCBldGMuXHJcbiAgICBcclxuICAgIGlmIGV2ZW50ICAgIFxyXG4gICAgICAjIGRvIG5vdCBnaXZlIGEgZGVmYXVsdCBhY3Rpb25cclxuICAgICAgaWYgZXZlbnQucHJldmVudERlZmF1bHRcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlXHJcbiAgZmFsc2VcclxuICBcclxucmVzdG9yZVN0YXRlID0gKGxvY2F0aW9uKSAtPlxyXG4gIHBhZ2VOYW1lID0gbG9jYXRpb24uaGFzaFxyXG4gIGlmIG5vdCBwYWdlTmFtZVxyXG4gICAgcGFnZU5hbWUgPSBsb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMV1cclxuICBpZiBwYWdlTmFtZVxyXG4gICAgcGFnZU5hbWUgPSBwYWdlTmFtZS5yZXBsYWNlICcjJywgJydcclxuICAgIE9KLnB1Ymxpc2ggJ3Jlc3RvcmVTdGF0ZScsIHBhZ2VOYW1lOiBwYWdlTmFtZSwgbG9jYXRpb246IGxvY2F0aW9uXHJcbiAgcmV0dXJuXHJcbiAgXHJcbiMjIyBcclxuaGFuZyBvbiB0aGUgZXZlbnQsIGFsbCByZWZlcmVuY2VzIGluIHRoaXMgZG9jdW1lbnRcclxuIyMjXHJcbiAgXHJcbiMjI1xyXG4jIFRoaXMgYmluZHMgdG8gdGhlIGRvY3VtZW50IGNsaWNrIGV2ZW50LCB3aGljaCBpbiB0dXJuIGF0dGFjaGVzIHRvIGV2ZXJ5IGNsaWNrIGV2ZW50LCBjYXVzaW5nIHVuZXhwZWN0ZWQgYmVoYXZpb3IuXHJcbiMgRm9yIGFueSBjb250cm9sIHdoaWNoIHdpc2hlcyB0byB0cmlnZ2VyIGEgc3RhdGUgY2hhbmdlIGluIHJlc3BvbnNlIHRvIGFuIGV2ZW50LCBpdCBpcyBiZXR0ZXIgZm9yIHRoYXQgY29udHJvbCB0byBkZWZpbmUgdGhlIGJlaGF2aW9yLlxyXG5PSi5kb2N1bWVudFtldmVudE5hbWVdIGV2ZW50SW5mbyArICdjbGljaycsICgoZXZlbnQpIC0+XHJcbiAgZXZlbnQgPSBldmVudCBvciB3aW5kb3cuZXZlbnRcclxuICB0YXJnZXQgPSBldmVudC50YXJnZXQgb3IgZXZlbnQuc3JjRWxlbWVudFxyXG4gICAgXHJcbiAgIyBsb29raW5nIGZvciBhbGwgdGhlIGxpbmtzIHdpdGggJ2FqYXgnIGNsYXNzIGZvdW5kXHJcbiAgaWYgdGFyZ2V0IGFuZCB0YXJnZXQubm9kZU5hbWUgaXMgJ0EnIGFuZCAoJyAnICsgdGFyZ2V0LmNsYXNzTmFtZSArICcgJykuaW5kZXhPZignYWpheCcpID49IDBcclxuICAgIE9KLnB1c2hTdGF0ZSB0YXJnZXQuaHJlZiwgZXZlbnRcclxuICAgICAgXHJcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiksIGZhbHNlXHJcbiMjI1xyXG5cclxuIyMjXHJcbmhhbmcgb24gcG9wc3RhdGUgZXZlbnQgdHJpZ2dlcmVkIGJ5IHByZXNzaW5nIGJhY2svZm9yd2FyZCBpbiBicm93c2VyXHJcbiMjI1xyXG5PSi5nbG9iYWxbZXZlbnROYW1lXSBldmVudEluZm8gKyAncG9wc3RhdGUnLCAoKGV2ZW50KSAtPlxyXG4gICAgXHJcbiAgIyB3ZSBnZXQgYSBub3JtYWwgTG9jYXRpb24gb2JqZWN0XHJcbiAgICBcclxuICAjIyNcclxuICBOb3RlLCB0aGlzIGlzIHRoZSBvbmx5IGRpZmZlcmVuY2Ugd2hlbiB1c2luZyB0aGlzIGxpYnJhcnksXHJcbiAgYmVjYXVzZSB0aGUgb2JqZWN0IGRvY3VtZW50LmxvY2F0aW9uIGNhbm5vdCBiZSBvdmVycmlkZW4sXHJcbiAgc28gbGlicmFyeSB0aGUgcmV0dXJucyBnZW5lcmF0ZWQgJ2xvY2F0aW9uJyBvYmplY3Qgd2l0aGluXHJcbiAgYW4gb2JqZWN0IHdpbmRvdy5oaXN0b3J5LCBzbyBnZXQgaXQgb3V0IG9mICdoaXN0b3J5LmxvY2F0aW9uJy5cclxuICBGb3IgYnJvd3NlcnMgc3VwcG9ydGluZyAnaGlzdG9yeS5wdXNoU3RhdGUnIGdldCBnZW5lcmF0ZWRcclxuICBvYmplY3QgJ2xvY2F0aW9uJyB3aXRoIHRoZSB1c3VhbCAnZG9jdW1lbnQubG9jYXRpb24nLlxyXG4gICMjIyAgICAgICAgICAgICAgICAgICAgIFxyXG4gIHJldHVybkxvY2F0aW9uID0gaGlzdG9yeS5sb2NhdGlvbiBvciBkb2N1bWVudC5sb2NhdGlvblxyXG4gICAgXHJcbiAgIyMjXHJcbiAgaGVyZSBjYW4gY2F1c2UgZGF0YSBsb2FkaW5nLCBldGMuXHJcbiAgIyMjXHJcbiAgT0ouaGlzdG9yeS5yZXN0b3JlU3RhdGUgcmV0dXJuTG9jYXRpb25cclxuICAgIFxyXG4gIHJldHVyblxyXG4pLCBmYWxzZSBcclxuICBcclxuIFxyXG5PSi5oaXN0b3J5LnJlZ2lzdGVyICdyZXN0b3JlU3RhdGUnLCByZXN0b3JlU3RhdGVcclxuT0ouaGlzdG9yeS5yZWdpc3RlciAncHVzaFN0YXRlJywgcHVzaFN0YXRlXHJcbiBcclxubW9kdWxlLmV4cG9ydHMgPSBcclxuICByZXN0b3JlU3RhdGU6IHJlc3RvcmVTdGF0ZVxyXG4gIHB1c2hTdGF0ZTogcHVzaFN0YXRlXHJcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciAkLCBJUywgT0osIF87XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuSVMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIElTKCkge31cblxuICBJUy5ib29sID0gZnVuY3Rpb24oYm9vbGVhbikge1xuICAgIHJldHVybiBfLmlzQm9vbGVhbihib29sZWFuKTtcbiAgfTtcblxuICBJUy5hcnJheU51bGxPckVtcHR5ID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgcmV0dXJuIF8uaXNFbXB0eShhcnIpO1xuICB9O1xuXG4gIElTLnN0cmluZ051bGxPckVtcHR5ID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ciAmJiAoIXN0ci5sZW5ndGggfHwgc3RyLmxlbmd0aCA9PT0gMCB8fCAhc3RyLnRyaW0gfHwgIXN0ci50cmltKCkpO1xuICB9O1xuXG4gIElTLm51bWJlck51bGxPckVtcHR5ID0gZnVuY3Rpb24obnVtKSB7XG4gICAgcmV0dXJuICFudW0gfHwgaXNOYU4obnVtKSB8fCAhbnVtLnRvUHJlY2lzaW9uO1xuICB9O1xuXG4gIElTLmRhdGVOdWxsT3JFbXB0eSA9IGZ1bmN0aW9uKGR0KSB7XG4gICAgcmV0dXJuICFkdCB8fCAhZHQuZ2V0VGltZTtcbiAgfTtcblxuICBJUy5vYmplY3ROdWxsT3JFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzRW1wdHkob2JqIHx8ICFPYmplY3Qua2V5cyhvYmopIHx8IE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwKTtcbiAgfTtcblxuICBJUy5wbGFpbk9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzUGxhaW5PYmplY3Qob2JqKTtcbiAgfTtcblxuICBJUy5vYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc09iamVjdChvYmopO1xuICB9O1xuXG4gIElTLmRhdGUgPSBmdW5jdGlvbihkdCkge1xuICAgIHJldHVybiBfLmlzRGF0ZShkdCk7XG4gIH07XG5cblxuICAvKlxuICBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgYW4gaW5zdGFuY2Ugb2YgYSBOdW1iZXIgYW5kIG5vdCBOYU4qXG4gICAqL1xuXG4gIElTLm51bWJlciA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBudW1iZXI7XG4gICAgbnVtYmVyID0gcmVxdWlyZSgnLi4vY29yZS9udW1iZXInKTtcbiAgICByZXR1cm4gdHlwZW9mIG51bSA9PT0gJ251bWJlcicgJiYgZmFsc2UgPT09IChudW1iZXIuaXNOYU4obnVtKSB8fCBmYWxzZSA9PT0gbnVtYmVyLmlzRmluaXRlKG51bSkgfHwgbnVtYmVyLk1BWF9WQUxVRSA9PT0gbnVtIHx8IG51bWJlci5NSU5fVkFMVUUgPT09IG51bSk7XG4gIH07XG5cblxuICAvKlxuICBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgY29udmVydGlibGUgdG8gYSBOdW1iZXJcbiAgICovXG5cbiAgSVMubnVtZXJpYyA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBudU51bSwgcmV0LCB0bztcbiAgICByZXQgPSB0aGlzLm51bWJlcihudW0pO1xuICAgIGlmICghcmV0KSB7XG4gICAgICB0byA9IHJlcXVpcmUoJy4vdG8nKTtcbiAgICAgIG51TnVtID0gdG8ubnVtYmVyKG51bSk7XG4gICAgICByZXQgPSB0aGlzLm51bWJlcihudU51bSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgSVMuZWxlbWVudEluRG9tID0gZnVuY3Rpb24oZWxlbWVudElkKSB7XG4gICAgcmV0dXJuIGZhbHNlID09PSB0aGlzLm51bGxPckVtcHR5KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCkpO1xuICB9O1xuXG4gIElTLmFycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopO1xuICB9O1xuXG4gIElTLnN0cmluZyA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBfLmlzU3RyaW5nKHN0cik7XG4gIH07XG5cbiAgSVNbXCJ0cnVlXCJdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09ICd0cnVlJyB8fCBvYmogPT09IDEgfHwgb2JqID09PSAnMSc7XG4gIH07XG5cbiAgSVNbXCJmYWxzZVwiXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IGZhbHNlIHx8IG9iaiA9PT0gJ2ZhbHNlJyB8fCBvYmogPT09IDAgfHwgb2JqID09PSAnMCc7XG4gIH07XG5cbiAgSVMudHJ1ZU9yRmFsc2UgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdGhpc1tcInRydWVcIl0ob2JqIHx8IHRoaXNbXCJmYWxzZVwiXShvYmopKTtcbiAgfTtcblxuICBJUy5udWxsT3JFbXB0eSA9IGZ1bmN0aW9uKG9iaiwgY2hlY2tMZW5ndGgpIHtcbiAgICByZXR1cm4gXy5pc0VtcHR5KG9iaikgfHwgXy5pc1VuZGVmaW5lZChvYmopIHx8IF8uaXNOdWxsKG9iaikgfHwgXy5pc05hTihvYmopO1xuICB9O1xuXG4gIElTLm51bGxPclVuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaiwgY2hlY2tMZW5ndGgpIHtcbiAgICByZXR1cm4gXy5pc1VuZGVmaW5lZChvYmopIHx8IF8uaXNOdWxsKG9iaikgfHwgXy5pc05hTihvYmopO1xuICB9O1xuXG4gIElTW1wiaW5zdGFuY2VvZlwiXSA9IGZ1bmN0aW9uKG5hbWUsIG9iaikge1xuICAgIHJldHVybiBvYmoudHlwZSA9PT0gbmFtZSB8fCBvYmogaW5zdGFuY2VvZiBuYW1lO1xuICB9O1xuXG4gIElTLm1ldGhvZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogIT09IE9KLm5vb3AgJiYgXy5pc0Z1bmN0aW9uKG9iaik7XG4gIH07XG5cblxuICAvKlxuICBEZXByZWNhdGVkLiBMZWZ0IGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4gVXNlIGlzLm1ldGhvZCBpbnN0ZWFkLlxuICAgKi9cblxuICBJUy5mdW5jID0gSVMubWV0aG9kO1xuXG4gIHJldHVybiBJUztcblxufSkoKTtcblxuT0oucmVnaXN0ZXIoJ2lzJywgSVMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IElTO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeDBiMjlzYzF4Y2FYTXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRU3hKUVVGQk96dEJRVUZCTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1QwRkJVanM3UVVGRFRDeERRVUZCTEVkQlFVa3NUMEZCUVN4RFFVRlJMRkZCUVZJN08wRkJRMG9zUTBGQlFTeEhRVUZKTEU5QlFVRXNRMEZCVVN4UlFVRlNPenRCUVVWRk96czdSVUZGU2l4RlFVRkRMRU5CUVVFc1NVRkJSQ3hIUVVGUExGTkJRVU1zVDBGQlJEdFhRVU5NTEVOQlFVTXNRMEZCUXl4VFFVRkdMRU5CUVZrc1QwRkJXanRGUVVSTE96dEZRVWRRTEVWQlFVTXNRMEZCUVN4blFrRkJSQ3hIUVVGdFFpeFRRVUZETEVkQlFVUTdWMEZEYWtJc1EwRkJReXhEUVVGRExFOUJRVVlzUTBGQlZTeEhRVUZXTzBWQlJHbENPenRGUVVkdVFpeEZRVUZETEVOQlFVRXNhVUpCUVVRc1IwRkJiMElzVTBGQlF5eEhRVUZFTzFkQlEyeENMRWRCUVVFc1NVRkJVU3hEUVVGRExFTkJRVWtzUjBGQlJ5eERRVUZETEUxQlFWSXNTVUZCYTBJc1IwRkJSeXhEUVVGRExFMUJRVW9zUzBGQll5eERRVUZvUXl4SlFVRnhReXhEUVVGSkxFZEJRVWNzUTBGQlF5eEpRVUUzUXl4SlFVRnhSQ3hEUVVGSkxFZEJRVWNzUTBGQlF5eEpRVUZLTEVOQlFVRXNRMEZCTVVRN1JVRkVWVHM3UlVGSGNFSXNSVUZCUXl4RFFVRkJMR2xDUVVGRUxFZEJRVzlDTEZOQlFVTXNSMEZCUkR0WFFVTnNRaXhEUVVGSkxFZEJRVW9zU1VGQlZ5eExRVUZCTEVOQlFVMHNSMEZCVGl4RFFVRllMRWxCUVhsQ0xFTkJRVWtzUjBGQlJ5eERRVUZETzBWQlJHWTdPMFZCUjNCQ0xFVkJRVU1zUTBGQlFTeGxRVUZFTEVkQlFXdENMRk5CUVVNc1JVRkJSRHRYUVVOb1FpeERRVUZKTEVWQlFVb3NTVUZCVlN4RFFVRkpMRVZCUVVVc1EwRkJRenRGUVVSRU96dEZRVWRzUWl4RlFVRkRMRU5CUVVFc2FVSkJRVVFzUjBGQmIwSXNVMEZCUXl4SFFVRkVPMWRCUTJ4Q0xFTkJRVU1zUTBGQlF5eFBRVUZHTEVOQlFWVXNSMEZCUVN4SlFVRlBMRU5CUVVrc1RVRkJUU3hEUVVGRExFbEJRVkFzUTBGQldTeEhRVUZhTEVOQlFWZ3NTVUZCSzBJc1RVRkJUU3hEUVVGRExFbEJRVkFzUTBGQldTeEhRVUZhTEVOQlFXZENMRU5CUVVNc1RVRkJha0lzUzBGQk1rSXNRMEZCY0VVN1JVRkVhMEk3TzBWQlIzQkNMRVZCUVVNc1EwRkJRU3hYUVVGRUxFZEJRV01zVTBGQlF5eEhRVUZFTzFkQlExb3NRMEZCUXl4RFFVRkRMR0ZCUVVZc1EwRkJaMElzUjBGQmFFSTdSVUZFV1RzN1JVRkhaQ3hGUVVGRExFTkJRVUVzVFVGQlJDeEhRVUZUTEZOQlFVTXNSMEZCUkR0WFFVTlFMRU5CUVVNc1EwRkJReXhSUVVGR0xFTkJRVmNzUjBGQldEdEZRVVJQT3p0RlFVZFVMRVZCUVVNc1EwRkJRU3hKUVVGRUxFZEJRVThzVTBGQlF5eEZRVUZFTzFkQlEwd3NRMEZCUXl4RFFVRkRMRTFCUVVZc1EwRkJVeXhGUVVGVU8wVkJSRXM3T3p0QlFVbFFPenM3TzBWQlIwRXNSVUZCUXl4RFFVRkJMRTFCUVVRc1IwRkJVeXhUUVVGRExFZEJRVVE3UVVGRFVDeFJRVUZCTzBsQlFVRXNUVUZCUVN4SFFVRlRMRTlCUVVFc1EwRkJVU3huUWtGQlVqdFhRVU5VTEU5QlFVOHNSMEZCVUN4TFFVRmpMRkZCUVdRc1NVRkJNa0lzUzBGQlFTeExRVUZUTEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVZBc1EwRkJZU3hIUVVGaUxFTkJRVUVzU1VGQmNVSXNTMEZCUVN4TFFVRlRMRTFCUVUwc1EwRkJReXhSUVVGUUxFTkJRV2RDTEVkQlFXaENMRU5CUVRsQ0xFbEJRWE5FTEUxQlFVMHNRMEZCUXl4VFFVRlFMRXRCUVc5Q0xFZEJRVEZGTEVsQlFXbEdMRTFCUVUwc1EwRkJReXhUUVVGUUxFdEJRVzlDTEVkQlFYUkhPMFZCUmpkQ096czdRVUZKVkRzN096dEZRVWRCTEVWQlFVTXNRMEZCUVN4UFFVRkVMRWRCUVZVc1UwRkJReXhIUVVGRU8wRkJRMUlzVVVGQlFUdEpRVUZCTEVkQlFVRXNSMEZCVFN4SlFVRkRMRU5CUVVFc1RVRkJSQ3hEUVVGUkxFZEJRVkk3U1VGRFRpeEpRVUZCTEVOQlFVOHNSMEZCVUR0TlFVTkZMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVFVGQlVqdE5RVU5NTEV0QlFVRXNSMEZCVVN4RlFVRkZMRU5CUVVNc1RVRkJTQ3hEUVVGVkxFZEJRVlk3VFVGRFVpeEhRVUZCTEVkQlFVMHNTVUZCUXl4RFFVRkJMRTFCUVVRc1EwRkJVU3hMUVVGU0xFVkJTRkk3TzFkQlNVRTdSVUZPVVRzN1JVRlJWaXhGUVVGRExFTkJRVUVzV1VGQlJDeEhRVUZsTEZOQlFVTXNVMEZCUkR0WFFVTmlMRXRCUVVFc1MwRkJVeXhKUVVGRExFTkJRVUVzVjBGQlJDeERRVUZoTEZGQlFWRXNRMEZCUXl4alFVRlVMRU5CUVhkQ0xGTkJRWGhDTEVOQlFXSTdSVUZFU1RzN1JVRkhaaXhGUVVGRExFTkJRVUVzUzBGQlJDeEhRVUZSTEZOQlFVTXNSMEZCUkR0WFFVTk9MRU5CUVVNc1EwRkJReXhQUVVGR0xFTkJRVlVzUjBGQlZqdEZRVVJOT3p0RlFVZFNMRVZCUVVNc1EwRkJRU3hOUVVGRUxFZEJRVk1zVTBGQlF5eEhRVUZFTzFkQlExQXNRMEZCUXl4RFFVRkRMRkZCUVVZc1EwRkJWeXhIUVVGWU8wVkJSRTg3TzBWQlIxUXNSVUZCUXl4RFFVRkJMRTFCUVVFc1EwRkJSQ3hIUVVGUExGTkJRVU1zUjBGQlJEdFhRVU5NTEVkQlFVRXNTMEZCVHl4SlFVRlFMRWxCUVdVc1IwRkJRU3hMUVVGUExFMUJRWFJDTEVsQlFXZERMRWRCUVVFc1MwRkJUeXhEUVVGMlF5eEpRVUUwUXl4SFFVRkJMRXRCUVU4N1JVRkVPVU03TzBWQlIxQXNSVUZCUXl4RFFVRkJMRTlCUVVFc1EwRkJSQ3hIUVVGUkxGTkJRVU1zUjBGQlJEdFhRVU5PTEVkQlFVRXNTMEZCVHl4TFFVRlFMRWxCUVdkQ0xFZEJRVUVzUzBGQlR5eFBRVUYyUWl4SlFVRnJReXhIUVVGQkxFdEJRVThzUTBGQmVrTXNTVUZCT0VNc1IwRkJRU3hMUVVGUE8wVkJSQzlET3p0RlFVZFNMRVZCUVVNc1EwRkJRU3hYUVVGRUxFZEJRV01zVTBGQlF5eEhRVUZFTzFkQlExb3NTVUZCUXl4RFFVRkJMRTFCUVVFc1EwRkJSQ3hEUVVGTkxFZEJRVUVzU1VGQlR5eEpRVUZETEVOQlFVRXNUMEZCUVN4RFFVRkVMRU5CUVU4c1IwRkJVQ3hEUVVGaU8wVkJSRms3TzBWQlIyUXNSVUZCUXl4RFFVRkJMRmRCUVVRc1IwRkJZeXhUUVVGRExFZEJRVVFzUlVGQlRTeFhRVUZPTzFkQlExb3NRMEZCUXl4RFFVRkRMRTlCUVVZc1EwRkJWU3hIUVVGV0xFTkJRVUVzU1VGQmEwSXNRMEZCUXl4RFFVRkRMRmRCUVVZc1EwRkJZeXhIUVVGa0xFTkJRV3hDTEVsQlFYZERMRU5CUVVNc1EwRkJReXhOUVVGR0xFTkJRVk1zUjBGQlZDeERRVUY0UXl4SlFVRjVSQ3hEUVVGRExFTkJRVU1zUzBGQlJpeERRVUZSTEVkQlFWSTdSVUZFTjBNN08wVkJSMlFzUlVGQlF5eERRVUZCTEdWQlFVUXNSMEZCYTBJc1UwRkJReXhIUVVGRUxFVkJRVTBzVjBGQlRqdFhRVU5vUWl4RFFVRkRMRU5CUVVNc1YwRkJSaXhEUVVGakxFZEJRV1FzUTBGQlFTeEpRVUZ6UWl4RFFVRkRMRU5CUVVNc1RVRkJSaXhEUVVGVExFZEJRVlFzUTBGQmRFSXNTVUZCZFVNc1EwRkJReXhEUVVGRExFdEJRVVlzUTBGQlVTeEhRVUZTTzBWQlJIWkNPenRGUVVkc1FpeEZRVUZETEVOQlFVRXNXVUZCUVN4RFFVRkVMRWRCUVdFc1UwRkJReXhKUVVGRUxFVkJRVThzUjBGQlVEdFhRVU5ZTEVkQlFVY3NRMEZCUXl4SlFVRktMRXRCUVZrc1NVRkJXaXhKUVVGdlFpeEhRVUZCTEZsQlFXVTdSVUZFZUVJN08wVkJSMklzUlVGQlF5eERRVUZCTEUxQlFVUXNSMEZCVXl4VFFVRkRMRWRCUVVRN1YwRkRVQ3hIUVVGQkxFdEJRVk1zUlVGQlJTeERRVUZETEVsQlFWb3NTVUZCY1VJc1EwRkJReXhEUVVGRExGVkJRVVlzUTBGQllTeEhRVUZpTzBWQlJHUTdPenRCUVVkVU96czdPMFZCUjBFc1JVRkJReXhEUVVGQkxFbEJRVVFzUjBGQlVTeEZRVUZETEVOQlFVRTdPenM3T3p0QlFVbFlMRVZCUVVVc1EwRkJReXhSUVVGSUxFTkJRVmtzU1VGQldpeEZRVUZyUWl4RlFVRnNRanM3UVVGRFFTeE5RVUZOTEVOQlFVTXNUMEZCVUN4SFFVRnBRaUlzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVQwb2dQU0J5WlhGMWFYSmxJQ2N1TGk5dmFpZGNjbHh1SkNBOUlISmxjWFZwY21VZ0oycHhkV1Z5ZVNkY2NseHVYeUE5SUhKbGNYVnBjbVVnSjJ4dlpHRnphQ2RjY2x4dVhISmNibU5zWVhOeklFbFRYSEpjYmx4eVhHNGdJRUJpYjI5c09pQW9ZbTl2YkdWaGJpa2dMVDVjY2x4dUlDQWdJRjh1YVhOQ2IyOXNaV0Z1SUdKdmIyeGxZVzVjY2x4dVhISmNiaUFnUUdGeWNtRjVUblZzYkU5eVJXMXdkSGs2SUNoaGNuSXBJQzArWEhKY2JpQWdJQ0JmTG1selJXMXdkSGtnWVhKeVhISmNibHh5WEc0Z0lFQnpkSEpwYm1kT2RXeHNUM0pGYlhCMGVUb2dLSE4wY2lrZ0xUNWNjbHh1SUNBZ0lITjBjaUJoYm1RZ0tHNXZkQ0J6ZEhJdWJHVnVaM1JvSUc5eUlITjBjaTVzWlc1bmRHZ2dhWE1nTUNCdmNpQnViM1FnYzNSeUxuUnlhVzBnYjNJZ2JtOTBJSE4wY2k1MGNtbHRLQ2twWEhKY2JseHlYRzRnSUVCdWRXMWlaWEpPZFd4c1QzSkZiWEIwZVRvZ0tHNTFiU2tnTFQ1Y2NseHVJQ0FnSUc1dmRDQnVkVzBnYjNJZ2FYTk9ZVTRvYm5WdEtTQnZjaUJ1YjNRZ2JuVnRMblJ2VUhKbFkybHphVzl1WEhKY2JseHlYRzRnSUVCa1lYUmxUblZzYkU5eVJXMXdkSGs2SUNoa2RDa2dMVDVjY2x4dUlDQWdJRzV2ZENCa2RDQnZjaUJ1YjNRZ1pIUXVaMlYwVkdsdFpWeHlYRzVjY2x4dUlDQkFiMkpxWldOMFRuVnNiRTl5Ulcxd2RIazZJQ2h2WW1vcElDMCtYSEpjYmlBZ0lDQmZMbWx6Ulcxd2RIa2diMkpxSUc5eUlHNXZkQ0JQWW1wbFkzUXVhMlY1Y3lodlltb3BJRzl5SUU5aWFtVmpkQzVyWlhsektHOWlhaWt1YkdWdVozUm9JR2x6SURCY2NseHVYSEpjYmlBZ1FIQnNZV2x1VDJKcVpXTjBPaUFvYjJKcUtTQXRQbHh5WEc0Z0lDQWdYeTVwYzFCc1lXbHVUMkpxWldOMElHOWlhbHh5WEc1Y2NseHVJQ0JBYjJKcVpXTjBPaUFvYjJKcUtTQXRQbHh5WEc0Z0lDQWdYeTVwYzA5aWFtVmpkQ0J2WW1wY2NseHVYSEpjYmlBZ1FHUmhkR1U2SUNoa2RDa2dMVDVjY2x4dUlDQWdJRjh1YVhORVlYUmxJR1IwWEhKY2JseHlYRzVjY2x4dUlDQWpJeU5jY2x4dUlDQkVaWFJsY20xcGJtVnpJR2xtSUdFZ2RtRnNkV1VnYVhNZ1lXNGdhVzV6ZEdGdVkyVWdiMllnWVNCT2RXMWlaWElnWVc1a0lHNXZkQ0JPWVU0cVhISmNiaUFnSXlNalhISmNiaUFnUUc1MWJXSmxjam9nS0c1MWJTa2dMVDVjY2x4dUlDQWdJRzUxYldKbGNpQTlJSEpsY1hWcGNtVWdKeTR1TDJOdmNtVXZiblZ0WW1WeUoxeHlYRzRnSUNBZ2RIbHdaVzltSUc1MWJTQnBjeUFuYm5WdFltVnlKeUJoYm1RZ1ptRnNjMlVnYVhNZ0tHNTFiV0psY2k1cGMwNWhUaWh1ZFcwcElHOXlJR1poYkhObElHbHpJRzUxYldKbGNpNXBjMFpwYm1sMFpTaHVkVzBwSUc5eUlHNTFiV0psY2k1TlFWaGZWa0ZNVlVVZ2FYTWdiblZ0SUc5eUlHNTFiV0psY2k1TlNVNWZWa0ZNVlVVZ2FYTWdiblZ0S1Z4eVhHNWNjbHh1SUNBakl5TmNjbHh1SUNCRVpYUmxjbTFwYm1WeklHbG1JR0VnZG1Gc2RXVWdhWE1nWTI5dWRtVnlkR2xpYkdVZ2RHOGdZU0JPZFcxaVpYSmNjbHh1SUNBakl5TmNjbHh1SUNCQWJuVnRaWEpwWXpvZ0tHNTFiU2tnTFQ1Y2NseHVJQ0FnSUhKbGRDQTlJRUJ1ZFcxaVpYSW9iblZ0S1Z4eVhHNGdJQ0FnZFc1c1pYTnpJSEpsZEZ4eVhHNGdJQ0FnSUNCMGJ5QTlJSEpsY1hWcGNtVWdKeTR2ZEc4blhISmNiaUFnSUNBZ0lHNTFUblZ0SUQwZ2RHOHViblZ0WW1WeUtHNTFiU2xjY2x4dUlDQWdJQ0FnY21WMElEMGdRRzUxYldKbGNpaHVkVTUxYlNsY2NseHVJQ0FnSUhKbGRGeHlYRzVjY2x4dUlDQkFaV3hsYldWdWRFbHVSRzl0T2lBb1pXeGxiV1Z1ZEVsa0tTQXRQbHh5WEc0Z0lDQWdabUZzYzJVZ2FYTWdRRzUxYkd4UGNrVnRjSFI1S0dSdlkzVnRaVzUwTG1kbGRFVnNaVzFsYm5SQ2VVbGtLR1ZzWlcxbGJuUkpaQ2twWEhKY2JseHlYRzRnSUVCaGNuSmhlVG9nS0c5aWFpa2dMVDVjY2x4dUlDQWdJRjh1YVhOQmNuSmhlU0J2WW1wY2NseHVYSEpjYmlBZ1FITjBjbWx1WnpvZ0tITjBjaWtnTFQ1Y2NseHVJQ0FnSUY4dWFYTlRkSEpwYm1jZ2MzUnlYSEpjYmx4eVhHNGdJRUIwY25WbE9pQW9iMkpxS1NBdFBseHlYRzRnSUNBZ2IySnFJR2x6SUhSeWRXVWdiM0lnYjJKcUlHbHpJQ2QwY25WbEp5QnZjaUJ2WW1vZ2FYTWdNU0J2Y2lCdlltb2dhWE1nSnpFblhISmNibHh5WEc0Z0lFQm1ZV3h6WlRvZ0tHOWlhaWtnTFQ1Y2NseHVJQ0FnSUc5aWFpQnBjeUJtWVd4elpTQnZjaUJ2WW1vZ2FYTWdKMlpoYkhObEp5QnZjaUJ2WW1vZ2FYTWdNQ0J2Y2lCdlltb2dhWE1nSnpBblhISmNibHh5WEc0Z0lFQjBjblZsVDNKR1lXeHpaVG9nS0c5aWFpa2dMVDVjY2x4dUlDQWdJRUIwY25WbElHOWlhaUJ2Y2lCQVptRnNjMlVnYjJKcVhISmNibHh5WEc0Z0lFQnVkV3hzVDNKRmJYQjBlVG9nS0c5aWFpd2dZMmhsWTJ0TVpXNW5kR2dwSUMwK1hISmNiaUFnSUNCZkxtbHpSVzF3ZEhrb2IySnFLU0J2Y2lCZkxtbHpWVzVrWldacGJtVmtLRzlpYWlrZ2IzSWdYeTVwYzA1MWJHd29iMkpxS1NCdmNpQmZMbWx6VG1GT0tHOWlhaWxjY2x4dVhISmNiaUFnUUc1MWJHeFBjbFZ1WkdWbWFXNWxaRG9nS0c5aWFpd2dZMmhsWTJ0TVpXNW5kR2dwSUMwK1hISmNiaUFnSUNCZkxtbHpWVzVrWldacGJtVmtLRzlpYWlrZ2IzSWdYeTVwYzA1MWJHd29iMkpxS1NCdmNpQmZMbWx6VG1GT0tHOWlhaWxjY2x4dVhISmNiaUFnUUdsdWMzUmhibU5sYjJZNklDaHVZVzFsTENCdlltb3BJQzArWEhKY2JpQWdJQ0J2WW1vdWRIbHdaU0JwY3lCdVlXMWxJRzl5SUc5aWFpQnBibk4wWVc1alpXOW1JRzVoYldWY2NseHVYSEpjYmlBZ1FHMWxkR2h2WkRvZ0tHOWlhaWtnTFQ1Y2NseHVJQ0FnSUc5aWFpQnBjMjUwSUU5S0xtNXZiM0FnWVc1a0lGOHVhWE5HZFc1amRHbHZiaUJ2WW1wY2NseHVYSEpjYmlBZ0l5TWpYSEpjYmlBZ1JHVndjbVZqWVhSbFpDNGdUR1ZtZENCbWIzSWdZbUZqYTNkaGNtUnpJR052YlhCaGRHbGlhV3hwZEhrdUlGVnpaU0JwY3k1dFpYUm9iMlFnYVc1emRHVmhaQzVjY2x4dUlDQWpJeU5jY2x4dUlDQkFablZ1WXlBOUlFQnRaWFJvYjJSY2NseHVYSEpjYmx4eVhHNWNjbHh1VDBvdWNtVm5hWE4wWlhJZ0oybHpKeXdnU1ZOY2NseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQkpVMXh5WEc1Y2NseHVJbDE5IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE9KLCBtYWtlTm90eSwgbm90eTtcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG5ub3R5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ25vdHknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ25vdHknXSA6IG51bGwpO1xuXG5tYWtlTm90eSA9IGZ1bmN0aW9uKG9wdGlvbnMsIG93bmVyKSB7XG4gIHZhciBkZWZhdWx0cywgcmV0O1xuICBkZWZhdWx0cyA9IHtcbiAgICBsYXlvdXQ6ICd0b3BSaWdodCcsXG4gICAgdGhlbWU6ICdkZWZhdWx0VGhlbWUnLFxuICAgIHR5cGU6ICdhbGVydCcsXG4gICAgdGV4dDogJycsXG4gICAgZGlzbWlzc1F1ZXVlOiB0cnVlLFxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm5vdHlfbWVzc2FnZVwiPjxzcGFuIGNsYXNzPVwibm90eV90ZXh0XCI+PC9zcGFuPjxkaXYgY2xhc3M9XCJub3R5X2Nsb3NlXCI+PC9kaXY+PC9kaXY+JyxcbiAgICBhbmltYXRpb246IHtcbiAgICAgIG9wZW46IHtcbiAgICAgICAgaGVpZ2h0OiAndG9nZ2xlJ1xuICAgICAgfSxcbiAgICAgIGNsb3NlOiB7XG4gICAgICAgIGhlaWdodDogJ3RvZ2dsZSdcbiAgICAgIH0sXG4gICAgICBlYXNpbmc6ICdzd2luZycsXG4gICAgICBzcGVlZDogNTAwXG4gICAgfSxcbiAgICB0aW1lb3V0OiA1MDAwLFxuICAgIGZvcmNlOiBmYWxzZSxcbiAgICBtb2RhbDogZmFsc2UsXG4gICAgbWF4VmlzaWJsZTogNSxcbiAgICBraWxsZXI6IGZhbHNlLFxuICAgIGNsb3NlV2l0aDogWydjbGljayddLFxuICAgIGNhbGxiYWNrOiB7XG4gICAgICBvblNob3c6IE9KLm5vb3AsXG4gICAgICBhZnRlclNob3c6IE9KLm5vb3AsXG4gICAgICBvbkNsb3NlOiBPSi5ub29wLFxuICAgICAgYWZ0ZXJDbG9zZTogT0oubm9vcFxuICAgIH0sXG4gICAgYnV0dG9uczogZmFsc2VcbiAgfTtcbiAgT0ouZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlKTtcbiAgcmV0ID0gbm90eShkZWZhdWx0cyk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5PSi5ub3RpZmljYXRpb25zLnJlZ2lzdGVyKCdub3R5JywgbWFrZU5vdHkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2VOb3R5O1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeDBiMjlzYzF4Y2JtOTBlUzVqYjJabVpXVWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVUZCTEVsQlFVRTdPMEZCUVVFc1JVRkJRU3hIUVVGTExFOUJRVUVzUTBGQlVTeFBRVUZTT3p0QlFVTk1MRWxCUVVFc1IwRkJUeXhQUVVGQkxFTkJRVkVzVFVGQlVqczdRVUZIVUN4UlFVRkJMRWRCUVZjc1UwRkJReXhQUVVGRUxFVkJRVlVzUzBGQlZqdEJRVU5VTEUxQlFVRTdSVUZCUVN4UlFVRkJMRWRCUTBVN1NVRkJRU3hOUVVGQkxFVkJRVkVzVlVGQlVqdEpRVU5CTEV0QlFVRXNSVUZCVHl4alFVUlFPMGxCUlVFc1NVRkJRU3hGUVVGTkxFOUJSazQ3U1VGSFFTeEpRVUZCTEVWQlFVMHNSVUZJVGp0SlFVbEJMRmxCUVVFc1JVRkJZeXhKUVVwa08wbEJTMEVzVVVGQlFTeEZRVUZWTEN0R1FVeFdPMGxCVFVFc1UwRkJRU3hGUVVOSk8wMUJRVUVzU1VGQlFTeEZRVU5GTzFGQlFVRXNUVUZCUVN4RlFVRlJMRkZCUVZJN1QwRkVSanROUVVWQkxFdEJRVUVzUlVGRFJUdFJRVUZCTEUxQlFVRXNSVUZCVVN4UlFVRlNPMDlCU0VZN1RVRkpRU3hOUVVGQkxFVkJRVkVzVDBGS1VqdE5RVXRCTEV0QlFVRXNSVUZCVHl4SFFVeFFPMHRCVUVvN1NVRmhRU3hQUVVGQkxFVkJRVk1zU1VGaVZEdEpRV05CTEV0QlFVRXNSVUZCVHl4TFFXUlFPMGxCWlVFc1MwRkJRU3hGUVVGUExFdEJabEE3U1VGblFrRXNWVUZCUVN4RlFVRlpMRU5CYUVKYU8wbEJhVUpCTEUxQlFVRXNSVUZCVVN4TFFXcENVanRKUVd0Q1FTeFRRVUZCTEVWQlFWY3NRMEZCUXl4UFFVRkVMRU5CYkVKWU8wbEJiVUpCTEZGQlFVRXNSVUZEU1R0TlFVRkJMRTFCUVVFc1JVRkJVU3hGUVVGRkxFTkJRVU1zU1VGQldEdE5RVU5CTEZOQlFVRXNSVUZCVnl4RlFVRkZMRU5CUVVNc1NVRkVaRHROUVVWQkxFOUJRVUVzUlVGQlV5eEZRVUZGTEVOQlFVTXNTVUZHV2p0TlFVZEJMRlZCUVVFc1JVRkJXU3hGUVVGRkxFTkJRVU1zU1VGSVpqdExRWEJDU2p0SlFYZENRU3hQUVVGQkxFVkJRVk1zUzBGNFFsUTdPMFZCTUVKR0xFVkJRVVVzUTBGQlF5eE5RVUZJTEVOQlFWVXNVVUZCVml4RlFVRnZRaXhQUVVGd1FpeEZRVUUyUWl4SlFVRTNRanRGUVVOQkxFZEJRVUVzUjBGQlRTeEpRVUZCTEVOQlFVc3NVVUZCVER0VFFVVk9PMEZCTDBKVE96dEJRV2xEV0N4RlFVRkZMRU5CUVVNc1lVRkJZU3hEUVVGRExGRkJRV3BDTEVOQlFUQkNMRTFCUVRGQ0xFVkJRV3RETEZGQlFXeERPenRCUVVOQkxFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKUFNpQTlJSEpsY1hWcGNtVWdKeTR1TDI5cUoxeHlYRzV1YjNSNUlEMGdjbVZ4ZFdseVpTQW5ibTkwZVNkY2NseHVYSEpjYmlBZ1hISmNibTFoYTJWT2IzUjVJRDBnS0c5d2RHbHZibk1zSUc5M2JtVnlLU0F0UGx4eVhHNGdJR1JsWm1GMWJIUnpJRDFjY2x4dUlDQWdJR3hoZVc5MWREb2dKM1J2Y0ZKcFoyaDBKMXh5WEc0Z0lDQWdkR2hsYldVNklDZGtaV1poZFd4MFZHaGxiV1VuWEhKY2JpQWdJQ0IwZVhCbE9pQW5ZV3hsY25RblhISmNiaUFnSUNCMFpYaDBPaUFuSnlBalkyRnVJR0psSUdoMGJXd2diM0lnYzNSeWFXNW5YSEpjYmlBZ0lDQmthWE50YVhOelVYVmxkV1U2SUhSeWRXVWdJMGxtSUhsdmRTQjNZVzUwSUhSdklIVnpaU0J4ZFdWMVpTQm1aV0YwZFhKbElITmxkQ0IwYUdseklIUnlkV1ZjY2x4dUlDQWdJSFJsYlhCc1lYUmxPaUFuUEdScGRpQmpiR0Z6Y3oxY0ltNXZkSGxmYldWemMyRm5aVndpUGp4emNHRnVJR05zWVhOelBWd2libTkwZVY5MFpYaDBYQ0krUEM5emNHRnVQanhrYVhZZ1kyeGhjM005WENKdWIzUjVYMk5zYjNObFhDSStQQzlrYVhZK1BDOWthWFkrSnl4Y2NseHVJQ0FnSUdGdWFXMWhkR2x2YmpvZ1hISmNiaUFnSUNBZ0lDQWdiM0JsYmpvZ1hISmNiaUFnSUNBZ0lDQWdJQ0JvWldsbmFIUTZJQ2QwYjJkbmJHVW5YSEpjYmlBZ0lDQWdJQ0FnWTJ4dmMyVTZJRnh5WEc0Z0lDQWdJQ0FnSUNBZ2FHVnBaMmgwT2lBbmRHOW5aMnhsSjF4eVhHNGdJQ0FnSUNBZ0lHVmhjMmx1WnpvZ0ozTjNhVzVuSjF4eVhHNGdJQ0FnSUNBZ0lITndaV1ZrT2lBMU1EQWdJMjl3Wlc1cGJtY2dKaUJqYkc5emFXNW5JR0Z1YVcxaGRHbHZiaUJ6Y0dWbFpGeHlYRzRnSUNBZ2RHbHRaVzkxZERvZ05UQXdNQ0FqWkdWc1lYa2dabTl5SUdOc2IzTnBibWNnWlhabGJuUXVJRk5sZENCbVlXeHpaU0JtYjNJZ2MzUnBZMnQ1SUc1dmRHbG1hV05oZEdsdmJuTmNjbHh1SUNBZ0lHWnZjbU5sT2lCbVlXeHpaU0FqWVdSa2N5QnViM1JwWm1sallYUnBiMjRnZEc4Z2RHaGxJR0psWjJsdWJtbHVaeUJ2WmlCeGRXVjFaU0IzYUdWdUlITmxkQ0IwYnlCMGNuVmxYSEpjYmlBZ0lDQnRiMlJoYkRvZ1ptRnNjMlZjY2x4dUlDQWdJRzFoZUZacGMybGliR1U2SURVZ0kzbHZkU0JqWVc0Z2MyVjBJRzFoZUNCMmFYTnBZbXhsSUc1dmRHbG1hV05oZEdsdmJpQm1iM0lnWkdsemJXbHpjMUYxWlhWbElIUnlkV1VnYjNCMGFXOXVMRnh5WEc0Z0lDQWdhMmxzYkdWeU9pQm1ZV3h6WlNBalptOXlJR05zYjNObElHRnNiQ0J1YjNScFptbGpZWFJwYjI1eklHSmxabTl5WlNCemFHOTNYSEpjYmlBZ0lDQmpiRzl6WlZkcGRHZzZJRnNuWTJ4cFkyc25YU0FnSTFzblkyeHBZMnNuTENBblluVjBkRzl1Snl3Z0oyaHZkbVZ5SjExY2NseHVJQ0FnSUdOaGJHeGlZV05yT2lCY2NseHVJQ0FnSUNBZ0lDQnZibE5vYjNjNklFOUtMbTV2YjNBc1hISmNiaUFnSUNBZ0lDQWdZV1owWlhKVGFHOTNPaUJQU2k1dWIyOXdYSEpjYmlBZ0lDQWdJQ0FnYjI1RGJHOXpaVG9nVDBvdWJtOXZjRnh5WEc0Z0lDQWdJQ0FnSUdGbWRHVnlRMnh2YzJVNklFOUtMbTV2YjNCY2NseHVJQ0FnSUdKMWRIUnZibk02SUdaaGJITmxJQ05oYmlCaGNuSmhlU0J2WmlCaWRYUjBiMjV6WEhKY2JpQWdJQ0JjY2x4dUlDQlBTaTVsZUhSbGJtUWdaR1ZtWVhWc2RITXNJRzl3ZEdsdmJuTXNJSFJ5ZFdWY2NseHVJQ0J5WlhRZ1BTQnViM1I1SUdSbFptRjFiSFJ6WEhKY2JpQWdJQ0FnSUZ4eVhHNGdJSEpsZEZ4eVhHNGdJQ0FnWEhKY2JrOUtMbTV2ZEdsbWFXTmhkR2x2Ym5NdWNtVm5hWE4wWlhJZ0oyNXZkSGtuTENCdFlXdGxUbTkwZVZ4eVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlHMWhhMlZPYjNSNUlsMTkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgT0osIFB1YlN1YiwgZXZlbnRzLCBwcywgc3Vic2NyaWJlcnMsIHRva2VucztcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG5QdWJTdWIgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snUHViU3ViJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydQdWJTdWInXSA6IG51bGwpO1xuXG50b2tlbnMgPSB7fTtcblxuc3Vic2NyaWJlcnMgPSBbXTtcblxuZXZlbnRzID0ge307XG5cbnBzID0ge1xuICBnZXRFdmVudE5hbWU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgcmV0dXJuIGV2ZW50LnRvVXBwZXJDYXNlKCkucmVwbGFjZSgnICcsICdfJyk7XG4gIH0sXG4gIHN1YnNjcmliZTogZnVuY3Rpb24oZXZlbnQsIG1ldGhvZCkge1xuICAgIHZhciBldmVudE5hbWUsIHRva2VuO1xuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZShldmVudCk7XG4gICAgaWYgKCFldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgZXZlbnRzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICB9XG4gICAgdG9rZW4gPSBQdWJTdWIuc3Vic2NyaWJlKGV2ZW50TmFtZSwgbWV0aG9kKTtcbiAgICB0b2tlbnNbdG9rZW5dID0gdG9rZW47XG4gICAgc3Vic2NyaWJlcnMucHVzaChtZXRob2QpO1xuICAgIGV2ZW50c1tldmVudE5hbWVdLnB1c2gobWV0aG9kKTtcbiAgICByZXR1cm4gdG9rZW47XG4gIH0sXG4gIHB1Ymxpc2g6IGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XG4gICAgdmFyIGV2ZW50TmFtZTtcbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUoZXZlbnQpO1xuICAgIGlmIChldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgUHViU3ViLnB1Ymxpc2goZXZlbnROYW1lLCBkYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgT0ouY29uc29sZS5pbmZvKCdFdmVudCBuYW1lZCB7JyArIGV2ZW50ICsgJ30gaXMgbm90IHJlY29nbml6ZWQuJyk7XG4gICAgfVxuICB9LFxuICB1bnN1YnNjcmliZTogZnVuY3Rpb24odG9rZW5Pck1ldGhvZCkge1xuICAgIGlmIChPSi5pcy5tZXRob2QodG9rZW5Pck1ldGhvZCkpIHtcbiAgICAgIGlmICgtMSAhPT0gc3Vic2NyaWJlcnMuaW5kZXhPZih0b2tlbk9yTWV0aG9kKSkge1xuICAgICAgICBQdWJTdWIudW5zdWJzY3JpYmUodG9rZW5Pck1ldGhvZCk7XG4gICAgICAgIHN1YnNjcmliZXJzID0gXy5yZW1vdmUoc3Vic2NyaWJlcnMsIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICAgIHJldHVybiBtZXRob2QgPT09IHRva2VuT3JNZXRob2Q7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgT0ouY29uc29sZS5pbmZvKCdFdmVudCBtZXRob2QgaXMgbm90IHJlY29nbml6ZWQuJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0b2tlbnNbdG9rZW5Pck1ldGhvZF0pIHtcbiAgICAgICAgUHViU3ViLnVuc3Vic2NyaWJlKHRva2VuT3JNZXRob2QpO1xuICAgICAgICBkZWxldGUgdG9rZW5zW3Rva2VuT3JNZXRob2RdO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgdW5zdWJzY3JpYmVBbGw6IGZ1bmN0aW9uKCkge1xuICAgIE9KLmVhY2godG9rZW5zLCBmdW5jdGlvbih0b2tlbikge1xuICAgICAgcmV0dXJuIHVuc3Vic2NyaWJlKHRva2VuKTtcbiAgICB9KTtcbiAgICBzdWJzY3JpYmVycyA9IFtdO1xuICAgIGV2ZW50cyA9IHt9O1xuICB9LFxuICB1bnN1YnNjcmliZUV2ZW50OiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBldmVudE5hbWU7XG4gICAgZXZlbnROYW1lID0gcHMuZ2V0RXZlbnROYW1lKGV2ZW50KTtcbiAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIE9KLmVhY2goZXZlbnRzW2V2ZW50TmFtZV0sIGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gdW5zdWJzY3JpYmUobWV0aG9kKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBPSi5jb25zb2xlLmluZm8oJ0V2ZW50IG5hbWVkIHsnICsgZXZlbnQgKyAnfSBpcyBub3QgcmVjb2duaXplZC4nKTtcbiAgICB9XG4gICAgZGVsZXRlIGV2ZW50c1tldmVudE5hbWVdO1xuICB9XG59O1xuXG5PYmplY3Quc2VhbChwcyk7XG5cbk9iamVjdC5mcmVlemUocHMpO1xuXG5PSi5yZWdpc3RlcignZ2V0RXZlbnROYW1lJywgcHMuZ2V0RXZlbnROYW1lKTtcblxuT0oucmVnaXN0ZXIoJ3B1Ymxpc2gnLCBwcy5wdWJsaXNoKTtcblxuT0oucmVnaXN0ZXIoJ3N1YnNjcmliZScsIHBzLnN1YnNjcmliZSk7XG5cbk9KLnJlZ2lzdGVyKCd1bnN1YnNjcmliZScsIHBzLnVuc3Vic2NyaWJlKTtcblxuT0oucmVnaXN0ZXIoJ3Vuc3Vic2NyaWJlQWxsJywgcHMudW5zdWJzY3JpYmVBbGwpO1xuXG5PSi5yZWdpc3RlcigndW5zdWJzY3JpYmVFdmVudCcsIHBzLnVuc3Vic2NyaWJlRXZlbnQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBzO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeDBiMjlzYzF4Y2NIVmljM1ZpTG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPMEZCUVVFc1NVRkJRVHM3UVVGQlFTeEZRVUZCTEVkQlFVc3NUMEZCUVN4RFFVRlJMRTlCUVZJN08wRkJRMHdzVFVGQlFTeEhRVUZUTEU5QlFVRXNRMEZCVVN4WFFVRlNPenRCUVVWVUxFMUJRVUVzUjBGQlV6czdRVUZEVkN4WFFVRkJMRWRCUVdNN08wRkJRMlFzVFVGQlFTeEhRVUZUT3p0QlFVVlVMRVZCUVVFc1IwRkRSVHRGUVVGQkxGbEJRVUVzUlVGQll5eFRRVUZETEV0QlFVUTdWMEZEV2l4TFFVRkxMRU5CUVVNc1YwRkJUaXhEUVVGQkxFTkJRVzFDTEVOQlFVTXNUMEZCY0VJc1EwRkJORUlzUjBGQk5VSXNSVUZCYVVNc1IwRkJha003UlVGRVdTeERRVUZrTzBWQlIwRXNVMEZCUVN4RlFVRlhMRk5CUVVNc1MwRkJSQ3hGUVVGUkxFMUJRVkk3UVVGRFZDeFJRVUZCTzBsQlFVRXNVMEZCUVN4SFFVRlpMRVZCUVVVc1EwRkJReXhaUVVGSUxFTkJRV2RDTEV0QlFXaENPMGxCUTFvc1NVRkJSeXhEUVVGSkxFMUJRVThzUTBGQlFTeFRRVUZCTEVOQlFXUTdUVUZCT0VJc1RVRkJUeXhEUVVGQkxGTkJRVUVzUTBGQlVDeEhRVUZ2UWl4SFFVRnNSRHM3U1VGRlFTeExRVUZCTEVkQlFWRXNUVUZCVFN4RFFVRkRMRk5CUVZBc1EwRkJhVUlzVTBGQmFrSXNSVUZCTkVJc1RVRkJOVUk3U1VGRFVpeE5RVUZQTEVOQlFVRXNTMEZCUVN4RFFVRlFMRWRCUVdkQ08wbEJRMmhDTEZkQlFWY3NRMEZCUXl4SlFVRmFMRU5CUVdsQ0xFMUJRV3BDTzBsQlEwRXNUVUZCVHl4RFFVRkJMRk5CUVVFc1EwRkJWU3hEUVVGRExFbEJRV3hDTEVOQlFYVkNMRTFCUVhaQ08xZEJRMEU3UlVGU1V5eERRVWhZTzBWQllVRXNUMEZCUVN4RlFVRlRMRk5CUVVNc1MwRkJSQ3hGUVVGUkxFbEJRVkk3UVVGRFVDeFJRVUZCTzBsQlFVRXNVMEZCUVN4SFFVRlpMRVZCUVVVc1EwRkJReXhaUVVGSUxFTkJRV2RDTEV0QlFXaENPMGxCUTFvc1NVRkJSeXhOUVVGUExFTkJRVUVzVTBGQlFTeERRVUZXTzAxQlEwVXNUVUZCVFN4RFFVRkRMRTlCUVZBc1EwRkJaU3hUUVVGbUxFVkJRVEJDTEVsQlFURkNMRVZCUkVZN1MwRkJRU3hOUVVGQk8wMUJSMFVzUlVGQlJTeERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRllMRU5CUVdkQ0xHVkJRVUVzUjBGQmEwSXNTMEZCYkVJc1IwRkJNRUlzYzBKQlFURkRMRVZCU0VZN08wVkJSazhzUTBGaVZEdEZRWEZDUVN4WFFVRkJMRVZCUVdFc1UwRkJReXhoUVVGRU8wbEJRMWdzU1VGQlJ5eEZRVUZGTEVOQlFVTXNSVUZCUlN4RFFVRkRMRTFCUVU0c1EwRkJZU3hoUVVGaUxFTkJRVWc3VFVGRFJTeEpRVUZITEVOQlFVTXNRMEZCUkN4TFFVRlJMRmRCUVZjc1EwRkJReXhQUVVGYUxFTkJRVzlDTEdGQlFYQkNMRU5CUVZnN1VVRkRSU3hOUVVGTkxFTkJRVU1zVjBGQlVDeERRVUZ0UWl4aFFVRnVRanRSUVVOQkxGZEJRVUVzUjBGQll5eERRVUZETEVOQlFVTXNUVUZCUml4RFFVRlRMRmRCUVZRc1JVRkJjMElzVTBGQlF5eE5RVUZFTzJsQ1FVRlpMRTFCUVVFc1MwRkJWVHRSUVVGMFFpeERRVUYwUWl4RlFVWm9RanRQUVVGQkxFMUJRVUU3VVVGSlJTeEZRVUZGTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVZnc1EwRkJaMElzYVVOQlFXaENMRVZCU2tZN1QwRkVSanRMUVVGQkxFMUJRVUU3VFVGUFJTeEpRVUZITEUxQlFVOHNRMEZCUVN4aFFVRkJMRU5CUVZZN1VVRkRSU3hOUVVGTkxFTkJRVU1zVjBGQlVDeERRVUZ0UWl4aFFVRnVRanRSUVVOQkxFOUJRVThzVFVGQlR5eERRVUZCTEdGQlFVRXNSVUZHYUVJN1QwRlFSanM3UlVGRVZ5eERRWEpDWWp0RlFXdERRU3hqUVVGQkxFVkJRV2RDTEZOQlFVRTdTVUZEWkN4RlFVRkZMRU5CUVVNc1NVRkJTQ3hEUVVGUkxFMUJRVklzUlVGQlowSXNVMEZCUXl4TFFVRkVPMkZCUVZjc1YwRkJRU3hEUVVGWkxFdEJRVm83U1VGQldDeERRVUZvUWp0SlFVTkJMRmRCUVVFc1IwRkJZenRKUVVOa0xFMUJRVUVzUjBGQlV6dEZRVWhMTEVOQmJFTm9RanRGUVhkRFFTeG5Ra0ZCUVN4RlFVRnJRaXhUUVVGRExFdEJRVVE3UVVGRGFFSXNVVUZCUVR0SlFVRkJMRk5CUVVFc1IwRkJXU3hGUVVGRkxFTkJRVU1zV1VGQlNDeERRVUZuUWl4TFFVRm9RanRKUVVOYUxFbEJRVWNzVFVGQlR5eERRVUZCTEZOQlFVRXNRMEZCVmp0TlFVTkZMRVZCUVVVc1EwRkJReXhKUVVGSUxFTkJRVkVzVFVGQlR5eERRVUZCTEZOQlFVRXNRMEZCWml4RlFVRXlRaXhUUVVGRExFMUJRVVE3WlVGQldTeFhRVUZCTEVOQlFWa3NUVUZCV2p0TlFVRmFMRU5CUVROQ0xFVkJSRVk3UzBGQlFTeE5RVUZCTzAxQlIwVXNSVUZCUlN4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGWUxFTkJRV2RDTEdWQlFVRXNSMEZCYTBJc1MwRkJiRUlzUjBGQk1FSXNjMEpCUVRGRExFVkJTRVk3TzBsQlNVRXNUMEZCVHl4TlFVRlBMRU5CUVVFc1UwRkJRVHRGUVU1RkxFTkJlRU5zUWpzN08wRkJhVVJHTEUxQlFVMHNRMEZCUXl4SlFVRlFMRU5CUVZrc1JVRkJXanM3UVVGRFFTeE5RVUZOTEVOQlFVTXNUVUZCVUN4RFFVRmpMRVZCUVdRN08wRkJSVUVzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4alFVRmFMRVZCUVRSQ0xFVkJRVVVzUTBGQlF5eFpRVUV2UWpzN1FVRkRRU3hGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEZOQlFWb3NSVUZCZFVJc1JVRkJSU3hEUVVGRExFOUJRVEZDT3p0QlFVTkJMRVZCUVVVc1EwRkJReXhSUVVGSUxFTkJRVmtzVjBGQldpeEZRVUY1UWl4RlFVRkZMRU5CUVVNc1UwRkJOVUk3TzBGQlEwRXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3hoUVVGYUxFVkJRVEpDTEVWQlFVVXNRMEZCUXl4WFFVRTVRanM3UVVGRFFTeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMR2RDUVVGYUxFVkJRVGhDTEVWQlFVVXNRMEZCUXl4alFVRnFRenM3UVVGRFFTeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMR3RDUVVGYUxFVkJRV2RETEVWQlFVVXNRMEZCUXl4blFrRkJia003TzBGQlJVRXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklrOUtJRDBnY21WeGRXbHlaU0FuTGk0dmIyb25YSEpjYmxCMVlsTjFZaUE5SUhKbGNYVnBjbVVnSjNCMVluTjFZaTFxY3lkY2NseHVYSEpjYm5SdmEyVnVjeUE5SUh0OVhISmNibk4xWW5OamNtbGlaWEp6SUQwZ1cxMWNjbHh1WlhabGJuUnpJRDBnZTMxY2NseHVYSEpjYm5CeklEMGdYSEpjYmlBZ1oyVjBSWFpsYm5ST1lXMWxPaUFvWlhabGJuUXBJQzArWEhKY2JpQWdJQ0JsZG1WdWRDNTBiMVZ3Y0dWeVEyRnpaU2dwTG5KbGNHeGhZMlVnSnlBbkxDQW5YeWRjY2x4dVhISmNiaUFnYzNWaWMyTnlhV0psT2lBb1pYWmxiblFzSUcxbGRHaHZaQ2tnTFQ1Y2NseHVJQ0FnSUdWMlpXNTBUbUZ0WlNBOUlIQnpMbWRsZEVWMlpXNTBUbUZ0WlNCbGRtVnVkRnh5WEc0Z0lDQWdhV1lnYm05MElHVjJaVzUwYzF0bGRtVnVkRTVoYldWZElIUm9aVzRnWlhabGJuUnpXMlYyWlc1MFRtRnRaVjBnUFNCYlhWeHlYRzVjY2x4dUlDQWdJSFJ2YTJWdUlEMGdVSFZpVTNWaUxuTjFZbk5qY21saVpTQmxkbVZ1ZEU1aGJXVXNJRzFsZEdodlpGeHlYRzRnSUNBZ2RHOXJaVzV6VzNSdmEyVnVYU0E5SUhSdmEyVnVYSEpjYmlBZ0lDQnpkV0p6WTNKcFltVnljeTV3ZFhOb0lHMWxkR2h2WkZ4eVhHNGdJQ0FnWlhabGJuUnpXMlYyWlc1MFRtRnRaVjB1Y0hWemFDQnRaWFJvYjJSY2NseHVJQ0FnSUhSdmEyVnVYSEpjYmx4eVhHNGdJSEIxWW14cGMyZzZJQ2hsZG1WdWRDd2daR0YwWVNrZ0xUNWNjbHh1SUNBZ0lHVjJaVzUwVG1GdFpTQTlJSEJ6TG1kbGRFVjJaVzUwVG1GdFpTQmxkbVZ1ZEZ4eVhHNGdJQ0FnYVdZZ1pYWmxiblJ6VzJWMlpXNTBUbUZ0WlYxY2NseHVJQ0FnSUNBZ1VIVmlVM1ZpTG5CMVlteHBjMmdnWlhabGJuUk9ZVzFsTENCa1lYUmhYSEpjYmlBZ0lDQmxiSE5sWEhKY2JpQWdJQ0FnSUU5S0xtTnZibk52YkdVdWFXNW1ieUFuUlhabGJuUWdibUZ0WldRZ2V5Y2dLeUJsZG1WdWRDQXJJQ2Q5SUdseklHNXZkQ0J5WldOdloyNXBlbVZrTGlkY2NseHVJQ0FnSUhKbGRIVnlibHh5WEc1Y2NseHVJQ0IxYm5OMVluTmpjbWxpWlRvZ0tIUnZhMlZ1VDNKTlpYUm9iMlFwSUMwK1hISmNiaUFnSUNCcFppQlBTaTVwY3k1dFpYUm9iMlFnZEc5clpXNVBjazFsZEdodlpGeHlYRzRnSUNBZ0lDQnBaaUF0TVNCcGMyNTBJSE4xWW5OamNtbGlaWEp6TG1sdVpHVjRUMllnZEc5clpXNVBjazFsZEdodlpGeHlYRzRnSUNBZ0lDQWdJRkIxWWxOMVlpNTFibk4xWW5OamNtbGlaU0IwYjJ0bGJrOXlUV1YwYUc5a1hISmNiaUFnSUNBZ0lDQWdjM1ZpYzJOeWFXSmxjbk1nUFNCZkxuSmxiVzkyWlNCemRXSnpZM0pwWW1WeWN5d2dLRzFsZEdodlpDa2dMVDRnYldWMGFHOWtJR2x6SUhSdmEyVnVUM0pOWlhSb2IyUmNjbHh1SUNBZ0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNBZ0lFOUtMbU52Ym5OdmJHVXVhVzVtYnlBblJYWmxiblFnYldWMGFHOWtJR2x6SUc1dmRDQnlaV052WjI1cGVtVmtMaWRjY2x4dUlDQWdJR1ZzYzJWY2NseHVJQ0FnSUNBZ2FXWWdkRzlyWlc1elczUnZhMlZ1VDNKTlpYUm9iMlJkWEhKY2JpQWdJQ0FnSUNBZ1VIVmlVM1ZpTG5WdWMzVmljMk55YVdKbElIUnZhMlZ1VDNKTlpYUm9iMlJjY2x4dUlDQWdJQ0FnSUNCa1pXeGxkR1VnZEc5clpXNXpXM1J2YTJWdVQzSk5aWFJvYjJSZFhISmNiaUFnSUNCeVpYUjFjbTVjY2x4dVhISmNiaUFnZFc1emRXSnpZM0pwWW1WQmJHdzZJQ2dwSUMwK1hISmNiaUFnSUNCUFNpNWxZV05vSUhSdmEyVnVjeXdnS0hSdmEyVnVLU0F0UGlCMWJuTjFZbk5qY21saVpTQjBiMnRsYmx4eVhHNGdJQ0FnYzNWaWMyTnlhV0psY25NZ1BTQmJYVnh5WEc0Z0lDQWdaWFpsYm5SeklEMGdlMzFjY2x4dUlDQWdJSEpsZEhWeWJseHlYRzVjY2x4dUlDQjFibk4xWW5OamNtbGlaVVYyWlc1ME9pQW9aWFpsYm5RcElDMCtYSEpjYmlBZ0lDQmxkbVZ1ZEU1aGJXVWdQU0J3Y3k1blpYUkZkbVZ1ZEU1aGJXVWdaWFpsYm5SY2NseHVJQ0FnSUdsbUlHVjJaVzUwYzF0bGRtVnVkRTVoYldWZFhISmNiaUFnSUNBZ0lFOUtMbVZoWTJnZ1pYWmxiblJ6VzJWMlpXNTBUbUZ0WlYwc0lDaHRaWFJvYjJRcElDMCtJSFZ1YzNWaWMyTnlhV0psSUcxbGRHaHZaRnh5WEc0Z0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNCUFNpNWpiMjV6YjJ4bExtbHVabThnSjBWMlpXNTBJRzVoYldWa0lIc25JQ3NnWlhabGJuUWdLeUFuZlNCcGN5QnViM1FnY21WamIyZHVhWHBsWkM0blhISmNiaUFnSUNCa1pXeGxkR1VnWlhabGJuUnpXMlYyWlc1MFRtRnRaVjFjY2x4dUlDQWdJSEpsZEhWeWJseHlYRzVjY2x4dVQySnFaV04wTG5ObFlXd2djSE5jY2x4dVQySnFaV04wTG1aeVpXVjZaU0J3YzF4eVhHNWNjbHh1VDBvdWNtVm5hWE4wWlhJZ0oyZGxkRVYyWlc1MFRtRnRaU2NzSUhCekxtZGxkRVYyWlc1MFRtRnRaVnh5WEc1UFNpNXlaV2RwYzNSbGNpQW5jSFZpYkdsemFDY3NJSEJ6TG5CMVlteHBjMmhjY2x4dVQwb3VjbVZuYVhOMFpYSWdKM04xWW5OamNtbGlaU2NzSUhCekxuTjFZbk5qY21saVpWeHlYRzVQU2k1eVpXZHBjM1JsY2lBbmRXNXpkV0p6WTNKcFltVW5MQ0J3Y3k1MWJuTjFZbk5qY21saVpWeHlYRzVQU2k1eVpXZHBjM1JsY2lBbmRXNXpkV0p6WTNKcFltVkJiR3duTENCd2N5NTFibk4xWW5OamNtbGlaVUZzYkZ4eVhHNVBTaTV5WldkcGMzUmxjaUFuZFc1emRXSnpZM0pwWW1WRmRtVnVkQ2NzSUhCekxuVnVjM1ZpYzJOeWFXSmxSWFpsYm5SY2NseHVYSEpjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnY0hNaVhYMD0iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG4jIyNcclxuaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85MDExMTUvaG93LWNhbi1pLWdldC1xdWVyeS1zdHJpbmctdmFsdWVzLWluLWphdmFzY3JpcHRcclxuIyMjXHJcbnF1ZXJ5U3RyaW5nID0gKHBhcmFtKSAtPlxyXG4gIHJldCA9IHt9XHJcbiAgICBcclxuICBpZiBPSi5nbG9iYWwubG9jYXRpb25cclxuICAgIHBhcmFtcyA9ICBPSi5nbG9iYWwubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5zcGxpdCAnJidcclxuICAgIGlmIHBhcmFtc1xyXG4gICAgICBpID0gMFxyXG4gICAgICB3aGlsZSBpIDwgcGFyYW1zLmxlbmd0aFxyXG4gICAgICAgIHBybSA9IHBhcmFtc1tpXS5zcGxpdCAnPSdcclxuICAgICAgICBpZiBwcm0ubGVuZ3RoIGlzIDIgXHJcbiAgICAgICAgICByZXRbcHJtWzBdXSA9IE9KLmdsb2JhbC5kZWNvZGVVUklDb21wb25lbnQgcHJtWzFdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIilcclxuICAgICAgICBpICs9IDFcclxuICByZXRcclxuICAgIFxyXG5PSi5yZWdpc3RlciAncXVlcnlTdHJpbmcnLHF1ZXJ5U3RyaW5nXHJcbm1vZHVsZS5leHBvcnRzID0gcXVlcnlTdHJpbmciLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgT0osIF8sIGVhY2gsIG9iaiwgcm5nLFxuICBzbGljZSA9IFtdLnNsaWNlO1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbl8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG5cbm9iaiA9IHJlcXVpcmUoJy4uL2NvcmUvb2JqZWN0Jyk7XG5cbmVhY2ggPSByZXF1aXJlKCcuL2VhY2gnKTtcblxucm5nID0ge1xuICByYW5nZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcmFtcztcbiAgICBwYXJhbXMgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICByZXR1cm4gXy5yYW5nZS5hcHBseShfLCBwYXJhbXMpO1xuICB9LFxuICByYW5nZU1pbjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhcmFtcztcbiAgICBwYXJhbXMgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICByZXR1cm4gXy5taW4uYXBwbHkoXywgcGFyYW1zKTtcbiAgfSxcbiAgcmFuZ2VNYXg6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJhbXM7XG4gICAgcGFyYW1zID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgcmV0dXJuIF8ubWF4LmFwcGx5KF8sIHBhcmFtcyk7XG4gIH0sXG5cbiAgLypcbiAgVGFrZSBhbiBhcnJheSBvZiBzdHJpbmcgdmFsdWVzIGFuZCBhIG51bWJlciBvZiBwYXJ0aXRpb25zIHRvIGNyZWF0ZS5cbiAgVXNlcyB0aGUgZmlyc3QgbGV0dGVyIG9mIGVhY2ggc3RyaW5nIHZhbHVlIGluIHRoZSBhcnJheSB0byBjb252ZXJ0IHRvIHVuaXF1ZSBjb2RlIGNoYXJhY3RlciAobG93ZXIgY2FzZSlcbiAgQnVpbGRzIGEgaW50IHJhbmdlIGJhc2VkIG9uIHVuaXF1ZSBjb2RlIGNoYXJzLlxuICAgKi9cbiAgc3RyaW5nVG9TdWJSYW5nZXM6IGZ1bmN0aW9uKG4sIHJhbmdlKSB7XG4gICAgdmFyIGNoYXJSYW5nZSwgaSwgb2xkR2V0UmFuZ2UsIHJldCwgc3ViUmFuZ2U7XG4gICAgaWYgKG4gPT0gbnVsbCkge1xuICAgICAgbiA9IDY7XG4gICAgfVxuICAgIGlmIChyYW5nZSA9PSBudWxsKSB7XG4gICAgICByYW5nZSA9IFtdO1xuICAgIH1cbiAgICBjaGFyUmFuZ2UgPSBbXTtcbiAgICBlYWNoKHJhbmdlLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHZhciBjaGFyO1xuICAgICAgY2hhciA9IHZhbC50cmltKClbMF0udG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmIChmYWxzZSA9PT0gb2JqLmNvbnRhaW5zKGNoYXJSYW5nZSwgY2hhcikpIHtcbiAgICAgICAgcmV0dXJuIGNoYXJSYW5nZS5wdXNoKGNoYXIuY2hhckNvZGVBdCgpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXQgPSBybmcudG9TdWJSYW5nZXMobiwgY2hhclJhbmdlKTtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IG4pIHtcbiAgICAgIGkgKz0gMTtcbiAgICAgIHN1YlJhbmdlID0gcmV0W2ldO1xuICAgICAgc3ViUmFuZ2UubWFwKFN0cmluZy5mcm9tQ2hhckNvZGUpO1xuICAgIH1cbiAgICBvbGRHZXRSYW5nZSA9IHJldC5nZXRSYW5nZTtcbiAgICByZXQuZ2V0UmFuZ2UgPSBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHZhciBjaGFyLCBpZHg7XG4gICAgICBjaGFyID0gdmFsLnRyaW0oKVswXS50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoKTtcbiAgICAgIGlkeCA9IG9sZEdldFJhbmdlKGNoYXIpO1xuICAgICAgcmV0dXJuIGlkeDtcbiAgICB9O1xuICAgIHJldHVybiByZXQ7XG4gIH0sXG5cbiAgLypcbiAgVGFrZSBhbiBhcnJheSBvZiBpbnQgdmFsdWVzIGFuZCBhIG51bWJlciBvZiBwYXJ0aXRpb25zIHRvIGNyZWF0ZS5cbiAgRGl2aWRlcyB0aGUgb3JpZ2luYWwgYXJyYXkgaW50byB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiBzdWIgYXJyYXlzLlxuICBPdmVyZmxvdyBpcyBwYXNzZWQgdG8gdGhlIGZpbmFsIHBhcnRpdGlvbi5cbiAgICovXG4gIHRvU3ViUmFuZ2VzOiBmdW5jdGlvbihuLCByYW5nZSkge1xuICAgIHZhciBjaHVua1ZhbCwgZGlzdGFuY2UsIGksIGp1bXAsIG1hcCwgcmFuZ2VIaWdoLCByYW5nZUxvdywgcmV0LCBzdWJSYW5nZSwgc3ViUmFuZ2VTaXplLCBzdWJSYW5nZXM7XG4gICAgaWYgKG4gPT0gbnVsbCkge1xuICAgICAgbiA9IDY7XG4gICAgfVxuICAgIGlmIChyYW5nZSA9PSBudWxsKSB7XG4gICAgICByYW5nZSA9IFtdO1xuICAgIH1cbiAgICByZXQgPSBvYmoub2JqZWN0KCk7XG4gICAgcmFuZ2VMb3cgPSBybmcucmFuZ2VNaW4ocmFuZ2UpO1xuICAgIHJhbmdlSGlnaCA9IHJuZy5yYW5nZU1heChyYW5nZSk7XG4gICAgZGlzdGFuY2UgPSByYW5nZUhpZ2ggLSByYW5nZUxvdztcbiAgICBzdWJSYW5nZVNpemUgPSBkaXN0YW5jZSAvIG47XG4gICAgc3ViUmFuZ2VzID0gcmV0LmFkZCgncmFuZ2VzJywgb2JqLm9iamVjdCgpKTtcbiAgICBjaHVua1ZhbCA9IHJhbmdlTG93O1xuICAgIG1hcCA9IG9iai5vYmplY3QoKTtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IG4pIHtcbiAgICAgIGkgKz0gMTtcbiAgICAgIGlmIChpIDwgbikge1xuICAgICAgICBqdW1wID0gTWF0aC5yb3VuZChzdWJSYW5nZVNpemUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAganVtcCA9IE1hdGguZmxvb3Ioc3ViUmFuZ2VTaXplKTtcbiAgICAgICAgaWYgKGNodW5rVmFsICsganVtcCA8PSByYW5nZUhpZ2gpIHtcbiAgICAgICAgICBqdW1wICs9IHJhbmdlSGlnaCAtIGNodW5rVmFsIC0ganVtcCArIDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHN1YlJhbmdlID0gcm5nLnJhbmdlKGNodW5rVmFsLCBjaHVua1ZhbCArIGp1bXApO1xuICAgICAgZWFjaChzdWJSYW5nZSwgZnVuY3Rpb24odmFsKSB7XG4gICAgICAgIHJldHVybiBtYXAuYWRkKHZhbCwgaSk7XG4gICAgICB9KTtcbiAgICAgIHN1YlJhbmdlc1tpXSA9IHN1YlJhbmdlO1xuICAgICAgY2h1bmtWYWwgKz0ganVtcDtcbiAgICB9XG4gICAgcmV0LmFkZCgnZ2V0UmFuZ2UnLCBmdW5jdGlvbih2YWwpIHtcbiAgICAgIHJldHVybiBtYXBbdmFsXTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmV0O1xuICB9XG59O1xuXG5PYmplY3Quc2VhbChybmcpO1xuXG5PYmplY3QuZnJlZXplKHJuZyk7XG5cbk9KLnJlZ2lzdGVyKCdyYW5nZXMnLCBybmcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJuZztcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRngwYjI5c2MxeGNjbUZ1WjJWekxtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlFVRXNTVUZCUVN4eFFrRkJRVHRGUVVGQk96dEJRVUZCTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1QwRkJVanM3UVVGRFRDeERRVUZCTEVkQlFVa3NUMEZCUVN4RFFVRlJMRkZCUVZJN08wRkJRMG9zUjBGQlFTeEhRVUZOTEU5QlFVRXNRMEZCVVN4blFrRkJVanM3UVVGRFRpeEpRVUZCTEVkQlFVOHNUMEZCUVN4RFFVRlJMRkZCUVZJN08wRkJTVkFzUjBGQlFTeEhRVWxGTzBWQlFVRXNTMEZCUVN4RlFVRlBMRk5CUVVFN1FVRkRUQ3hSUVVGQk8wbEJSRTA3VjBGRFRpeERRVUZETEVOQlFVTXNTMEZCUml4VlFVRlJMRTFCUVZJN1JVRkVTeXhEUVVGUU8wVkJTMEVzVVVGQlFTeEZRVUZWTEZOQlFVRTdRVUZEVWl4UlFVRkJPMGxCUkZNN1YwRkRWQ3hEUVVGRExFTkJRVU1zUjBGQlJpeFZRVUZOTEUxQlFVNDdSVUZFVVN4RFFVeFdPMFZCVlVFc1VVRkJRU3hGUVVGVkxGTkJRVUU3UVVGRFVpeFJRVUZCTzBsQlJGTTdWMEZEVkN4RFFVRkRMRU5CUVVNc1IwRkJSaXhWUVVGTkxFMUJRVTQ3UlVGRVVTeERRVlpXT3p0QlFXTkJPenM3T3p0RlFVdEJMR2xDUVVGQkxFVkJRVzFDTEZOQlFVTXNRMEZCUkN4RlFVRlJMRXRCUVZJN1FVRkRha0lzVVVGQlFUczdUVUZFYTBJc1NVRkJTVHM3TzAxQlFVY3NVVUZCVVRzN1NVRkRha01zVTBGQlFTeEhRVUZaTzBsQlIxb3NTVUZCUVN4RFFVRkxMRXRCUVV3c1JVRkJXU3hUUVVGRExFZEJRVVE3UVVGRFZpeFZRVUZCTzAxQlFVRXNTVUZCUVN4SFFVRlBMRWRCUVVjc1EwRkJReXhKUVVGS0xFTkJRVUVzUTBGQlZ5eERRVUZCTEVOQlFVRXNRMEZCUlN4RFFVRkRMRmRCUVdRc1EwRkJRVHROUVVOUUxFbEJRVWNzUzBGQlFTeExRVUZUTEVkQlFVY3NRMEZCUXl4UlFVRktMRU5CUVdFc1UwRkJZaXhGUVVGM1FpeEpRVUY0UWl4RFFVRmFPMlZCUTBVc1UwRkJVeXhEUVVGRExFbEJRVllzUTBGQlpTeEpRVUZKTEVOQlFVTXNWVUZCVEN4RFFVRkJMRU5CUVdZc1JVRkVSanM3U1VGR1ZTeERRVUZhTzBsQlMwRXNSMEZCUVN4SFFVRk5MRWRCUVVjc1EwRkJReXhYUVVGS0xFTkJRV2RDTEVOQlFXaENMRVZCUVcxQ0xGTkJRVzVDTzBsQlJVNHNRMEZCUVN4SFFVRkpPMEZCUTBvc1YwRkJUU3hEUVVGQkxFZEJRVWtzUTBGQlZqdE5RVU5GTEVOQlFVRXNTVUZCU3p0TlFVTk1MRkZCUVVFc1IwRkJWeXhIUVVGSkxFTkJRVUVzUTBGQlFUdE5RVU5tTEZGQlFWRXNRMEZCUXl4SFFVRlVMRU5CUVdFc1RVRkJUU3hEUVVGRExGbEJRWEJDTzBsQlNFWTdTVUZMUVN4WFFVRkJMRWRCUVdNc1IwRkJSeXhEUVVGRE8wbEJRMnhDTEVkQlFVY3NRMEZCUXl4UlFVRktMRWRCUVdVc1UwRkJReXhIUVVGRU8wRkJRMklzVlVGQlFUdE5RVUZCTEVsQlFVRXNSMEZCVHl4SFFVRkhMRU5CUVVNc1NVRkJTaXhEUVVGQkxFTkJRVmNzUTBGQlFTeERRVUZCTEVOQlFVVXNRMEZCUXl4WFFVRmtMRU5CUVVFc1EwRkJNa0lzUTBGQlF5eFZRVUUxUWl4RFFVRkJPMDFCUTFBc1IwRkJRU3hIUVVGTkxGZEJRVUVzUTBGQldTeEpRVUZhTzJGQlEwNDdTVUZJWVR0WFFVbG1PMFZCZEVKcFFpeERRVzVDYmtJN08wRkJORU5CT3pzN096dEZRVXRCTEZkQlFVRXNSVUZCWVN4VFFVRkRMRU5CUVVRc1JVRkJVU3hMUVVGU08wRkJRMWdzVVVGQlFUczdUVUZFV1N4SlFVRkpPenM3VFVGQlJ5eFJRVUZST3p0SlFVTXpRaXhIUVVGQkxFZEJRVTBzUjBGQlJ5eERRVUZETEUxQlFVb3NRMEZCUVR0SlFVTk9MRkZCUVVFc1IwRkJWeXhIUVVGSExFTkJRVU1zVVVGQlNpeERRVUZoTEV0QlFXSTdTVUZEV0N4VFFVRkJMRWRCUVZrc1IwRkJSeXhEUVVGRExGRkJRVW9zUTBGQllTeExRVUZpTzBsQlJWb3NVVUZCUVN4SFFVRlhMRk5CUVVFc1IwRkJXVHRKUVVOMlFpeFpRVUZCTEVkQlFXVXNVVUZCUVN4SFFVRlRPMGxCUTNoQ0xGTkJRVUVzUjBGQldTeEhRVUZITEVOQlFVTXNSMEZCU2l4RFFVRlJMRkZCUVZJc1JVRkJhMElzUjBGQlJ5eERRVUZETEUxQlFVb3NRMEZCUVN4RFFVRnNRanRKUVVOYUxGRkJRVUVzUjBGQlZ6dEpRVVZZTEVkQlFVRXNSMEZCVFN4SFFVRkhMRU5CUVVNc1RVRkJTaXhEUVVGQk8wbEJSVTRzUTBGQlFTeEhRVUZKTzBGQlEwb3NWMEZCVFN4RFFVRkJMRWRCUVVrc1EwRkJWanROUVVORkxFTkJRVUVzU1VGQlN6dE5RVU5NTEVsQlFVY3NRMEZCUVN4SFFVRkpMRU5CUVZBN1VVRkJZeXhKUVVGQkxFZEJRVThzU1VGQlNTeERRVUZETEV0QlFVd3NRMEZCVnl4WlFVRllMRVZCUVhKQ08wOUJRVUVzVFVGQlFUdFJRVVZGTEVsQlFVRXNSMEZCVHl4SlFVRkpMRU5CUVVNc1MwRkJUQ3hEUVVGWExGbEJRVmc3VVVGRFVDeEpRVUZITEZGQlFVRXNSMEZCVnl4SlFVRllMRWxCUVcxQ0xGTkJRWFJDTzFWQlEwVXNTVUZCUVN4SlFVRlJMRk5CUVVFc1IwRkJXU3hSUVVGYUxFZEJRWFZDTEVsQlFYWkNMRWRCUVRoQ0xFVkJSSGhETzFOQlNFWTdPMDFCVFVFc1VVRkJRU3hIUVVGWExFZEJRVWNzUTBGQlF5eExRVUZLTEVOQlFWVXNVVUZCVml4RlFVRnZRaXhSUVVGQkxFZEJRVmNzU1VGQkwwSTdUVUZEV0N4SlFVRkJMRU5CUVVzc1VVRkJUQ3hGUVVGbExGTkJRVU1zUjBGQlJEdGxRVUZUTEVkQlFVY3NRMEZCUXl4SFFVRktMRU5CUVZFc1IwRkJVaXhGUVVGaExFTkJRV0k3VFVGQlZDeERRVUZtTzAxQlEwRXNVMEZCVlN4RFFVRkJMRU5CUVVFc1EwRkJWaXhIUVVGbE8wMUJRMllzVVVGQlFTeEpRVUZaTzBsQldHUTdTVUZoUVN4SFFVRkhMRU5CUVVNc1IwRkJTaXhEUVVGUkxGVkJRVklzUlVGQmIwSXNVMEZCUXl4SFFVRkVPMkZCUTJ4Q0xFZEJRVWtzUTBGQlFTeEhRVUZCTzBsQlJHTXNRMEZCY0VJN1YwRkhRVHRGUVRkQ1Z5eERRV3BFWWpzN08wRkJaMFpHTEUxQlFVMHNRMEZCUXl4SlFVRlFMRU5CUVZrc1IwRkJXanM3UVVGRFFTeE5RVUZOTEVOQlFVTXNUVUZCVUN4RFFVRmpMRWRCUVdRN08wRkJSVUVzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4UlFVRmFMRVZCUVhOQ0xFZEJRWFJDT3p0QlFVTkJMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SlBTaUE5SUhKbGNYVnBjbVVnSnk0dUwyOXFKMXh5WEc1ZklEMGdjbVZ4ZFdseVpTQW5iRzlrWVhOb0oxeHlYRzV2WW1vZ1BTQnlaWEYxYVhKbElDY3VMaTlqYjNKbEwyOWlhbVZqZENkY2NseHVaV0ZqYUNBOUlISmxjWFZwY21VZ0p5NHZaV0ZqYUNkY2NseHVYSEpjYmlNZ0l5QnlZVzVuWlhOY2NseHVYSEpjYm5KdVp5QTlYSEpjYmx4eVhHNGdJQ01nSXlNZ2NtRnVaMlZjY2x4dUlDQWpJRlZ6YVc1bklGdE1ieTFFWVhOb1hTaG9kSFJ3T2k4dmJHOWtZWE5vTG1OdmJTOWtiMk56STNKaGJtZGxLU2R6SUdCeVlXNW5aV0FnYldWMGFHOWtYSEpjYmlBZ2NtRnVaMlU2SUNod1lYSmhiWE11TGk0cElDMCtYSEpjYmlBZ0lDQmZMbkpoYm1kbElIQmhjbUZ0Y3k0dUxseHlYRzVjY2x4dUlDQWpJQ01qSUhKaGJtZGxUV2x1WEhKY2JpQWdJeUJWYzJsdVp5QmJURzh0UkdGemFGMG9hSFIwY0RvdkwyeHZaR0Z6YUM1amIyMHZaRzlqY3lOdGFXNHBKM01nWUcxcGJtQWdiV1YwYUc5a1hISmNiaUFnY21GdVoyVk5hVzQ2SUNod1lYSmhiWE11TGk0cElDMCtYSEpjYmlBZ0lDQmZMbTFwYmlCd1lYSmhiWE11TGk1Y2NseHVYSEpjYmlBZ0l5QWpJeUJ5WVc1blpVMWhlRnh5WEc0Z0lDTWdWWE5wYm1jZ1cweHZMVVJoYzJoZEtHaDBkSEE2THk5c2IyUmhjMmd1WTI5dEwyUnZZM01qYldGNEtTZHpJR0J0WVhoZ0lHMWxkR2h2WkZ4eVhHNGdJSEpoYm1kbFRXRjRPaUFvY0dGeVlXMXpMaTR1S1NBdFBseHlYRzRnSUNBZ1h5NXRZWGdnY0dGeVlXMXpMaTR1WEhKY2JseHlYRzRnSUNNZ0l5TWdjM1J5YVc1blVtRnVaMlZVYjFOMVlsSmhibWRsYzF4eVhHNGdJQ01qSTF4eVhHNGdJRlJoYTJVZ1lXNGdZWEp5WVhrZ2IyWWdjM1J5YVc1bklIWmhiSFZsY3lCaGJtUWdZU0J1ZFcxaVpYSWdiMllnY0dGeWRHbDBhVzl1Y3lCMGJ5QmpjbVZoZEdVdVhISmNiaUFnVlhObGN5QjBhR1VnWm1seWMzUWdiR1YwZEdWeUlHOW1JR1ZoWTJnZ2MzUnlhVzVuSUhaaGJIVmxJR2x1SUhSb1pTQmhjbkpoZVNCMGJ5QmpiMjUyWlhKMElIUnZJSFZ1YVhGMVpTQmpiMlJsSUdOb1lYSmhZM1JsY2lBb2JHOTNaWElnWTJGelpTbGNjbHh1SUNCQ2RXbHNaSE1nWVNCcGJuUWdjbUZ1WjJVZ1ltRnpaV1FnYjI0Z2RXNXBjWFZsSUdOdlpHVWdZMmhoY25NdVhISmNiaUFnSXlNalhISmNiaUFnYzNSeWFXNW5WRzlUZFdKU1lXNW5aWE02SUNodUlEMGdOaXdnY21GdVoyVWdQU0JiWFNrZ0xUNWNjbHh1SUNBZ0lHTm9ZWEpTWVc1blpTQTlJRnRkWEhKY2JseHlYRzVjY2x4dUlDQWdJR1ZoWTJnZ2NtRnVaMlVzSUNoMllXd3BJQzArWEhKY2JpQWdJQ0FnSUdOb1lYSWdQU0IyWVd3dWRISnBiU2dwV3pCZExuUnZURzkzWlhKRFlYTmxLQ2xjY2x4dUlDQWdJQ0FnYVdZZ1ptRnNjMlVnYVhNZ2IySnFMbU52Ym5SaGFXNXpJR05vWVhKU1lXNW5aU3dnWTJoaGNseHlYRzRnSUNBZ0lDQWdJR05vWVhKU1lXNW5aUzV3ZFhOb0lHTm9ZWEl1WTJoaGNrTnZaR1ZCZENncFhISmNibHh5WEc0Z0lDQWdjbVYwSUQwZ2NtNW5MblJ2VTNWaVVtRnVaMlZ6SUc0c0lHTm9ZWEpTWVc1blpWeHlYRzVjY2x4dUlDQWdJR2tnUFNBd1hISmNiaUFnSUNCM2FHbHNaU0JwSUR3Z2JseHlYRzRnSUNBZ0lDQnBJQ3M5SURGY2NseHVJQ0FnSUNBZ2MzVmlVbUZ1WjJVZ1BTQnlaWFJiYVYxY2NseHVJQ0FnSUNBZ2MzVmlVbUZ1WjJVdWJXRndJRk4wY21sdVp5NW1jbTl0UTJoaGNrTnZaR1ZjY2x4dVhISmNiaUFnSUNCdmJHUkhaWFJTWVc1blpTQTlJSEpsZEM1blpYUlNZVzVuWlZ4eVhHNGdJQ0FnY21WMExtZGxkRkpoYm1kbElEMGdLSFpoYkNrZ0xUNWNjbHh1SUNBZ0lDQWdZMmhoY2lBOUlIWmhiQzUwY21sdEtDbGJNRjB1ZEc5TWIzZGxja05oYzJVb0tTNWphR0Z5UTI5a1pVRjBLQ2xjY2x4dUlDQWdJQ0FnYVdSNElEMGdiMnhrUjJWMFVtRnVaMlVnWTJoaGNseHlYRzRnSUNBZ0lDQnBaSGhjY2x4dUlDQWdJSEpsZEZ4eVhHNWNjbHh1SUNBaklDTWpJSEpoYm1kbFZHOVRkV0pTWVc1blpYTmNjbHh1SUNBakl5TmNjbHh1SUNCVVlXdGxJR0Z1SUdGeWNtRjVJRzltSUdsdWRDQjJZV3gxWlhNZ1lXNWtJR0VnYm5WdFltVnlJRzltSUhCaGNuUnBkR2x2Ym5NZ2RHOGdZM0psWVhSbExseHlYRzRnSUVScGRtbGtaWE1nZEdobElHOXlhV2RwYm1Gc0lHRnljbUY1SUdsdWRHOGdkR2hsSUhOd1pXTnBabWxsWkNCdWRXMWlaWElnYjJZZ2MzVmlJR0Z5Y21GNWN5NWNjbHh1SUNCUGRtVnlabXh2ZHlCcGN5QndZWE56WldRZ2RHOGdkR2hsSUdacGJtRnNJSEJoY25ScGRHbHZiaTVjY2x4dUlDQWpJeU5jY2x4dUlDQjBiMU4xWWxKaGJtZGxjem9nS0c0Z1BTQTJMQ0J5WVc1blpTQTlJRnRkS1NBdFBseHlYRzRnSUNBZ2NtVjBJRDBnYjJKcUxtOWlhbVZqZENncFhISmNiaUFnSUNCeVlXNW5aVXh2ZHlBOUlISnVaeTV5WVc1blpVMXBiaUJ5WVc1blpWeHlYRzRnSUNBZ2NtRnVaMlZJYVdkb0lEMGdjbTVuTG5KaGJtZGxUV0Y0SUhKaGJtZGxYSEpjYmx4eVhHNGdJQ0FnWkdsemRHRnVZMlVnUFNCeVlXNW5aVWhwWjJnZ0xTQnlZVzVuWlV4dmQxeHlYRzRnSUNBZ2MzVmlVbUZ1WjJWVGFYcGxJRDBnWkdsemRHRnVZMlV2Ymx4eVhHNGdJQ0FnYzNWaVVtRnVaMlZ6SUQwZ2NtVjBMbUZrWkNBbmNtRnVaMlZ6Snl3Z2IySnFMbTlpYW1WamRDZ3BYSEpjYmlBZ0lDQmphSFZ1YTFaaGJDQTlJSEpoYm1kbFRHOTNYSEpjYmx4eVhHNGdJQ0FnYldGd0lEMGdiMkpxTG05aWFtVmpkQ2dwWEhKY2JseHlYRzRnSUNBZ2FTQTlJREJjY2x4dUlDQWdJSGRvYVd4bElHa2dQQ0J1WEhKY2JpQWdJQ0FnSUdrZ0t6MGdNVnh5WEc0Z0lDQWdJQ0JwWmlCcElEd2diaUIwYUdWdUlHcDFiWEFnUFNCTllYUm9Mbkp2ZFc1a0lITjFZbEpoYm1kbFUybDZaVnh5WEc0Z0lDQWdJQ0JsYkhObFhISmNiaUFnSUNBZ0lDQWdhblZ0Y0NBOUlFMWhkR2d1Wm14dmIzSWdjM1ZpVW1GdVoyVlRhWHBsWEhKY2JpQWdJQ0FnSUNBZ2FXWWdZMmgxYm10V1lXd2dLeUJxZFcxd0lEdzlJSEpoYm1kbFNHbG5hRnh5WEc0Z0lDQWdJQ0FnSUNBZ2FuVnRjQ0FyUFNCeVlXNW5aVWhwWjJnZ0xTQmphSFZ1YTFaaGJDQXRJR3AxYlhBZ0t5QXhYSEpjYmx4eVhHNGdJQ0FnSUNCemRXSlNZVzVuWlNBOUlISnVaeTV5WVc1blpTQmphSFZ1YTFaaGJDd2dZMmgxYm10V1lXd2dLeUJxZFcxd1hISmNiaUFnSUNBZ0lHVmhZMmdnYzNWaVVtRnVaMlVzSUNoMllXd3BJQzArSUcxaGNDNWhaR1FnZG1Gc0xDQnBYSEpjYmlBZ0lDQWdJSE4xWWxKaGJtZGxjMXRwWFNBOUlITjFZbEpoYm1kbFhISmNiaUFnSUNBZ0lHTm9kVzVyVm1Gc0lDczlJR3AxYlhCY2NseHVYSEpjYmlBZ0lDQnlaWFF1WVdSa0lDZG5aWFJTWVc1blpTY3NJQ2gyWVd3cElDMCtYSEpjYmlBZ0lDQWdJRzFoY0Z0MllXeGRYSEpjYmx4eVhHNGdJQ0FnY21WMFhISmNibHh5WEc1UFltcGxZM1F1YzJWaGJDQnlibWRjY2x4dVQySnFaV04wTG1aeVpXVjZaU0J5Ym1kY2NseHVYSEpjYms5S0xuSmxaMmx6ZEdWeUlDZHlZVzVuWlhNbkxDQnlibWRjY2x4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCeWJtZGNjbHh1SWwxOSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciAkLCBJUywgT0osIFRPLCBfO1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbiQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cbl8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG5cbklTID0gcmVxdWlyZSgnLi9pcycpO1xuXG5UTyA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gVE8oKSB7fVxuXG4gIFRPLmJvb2wgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgcmV0Qm9vbDtcbiAgICByZXRCb29sID0gSVNbJ3RydWUnXShzdHIpO1xuICAgIGlmIChyZXRCb29sID09PSBmYWxzZSB8fCByZXRCb29sICE9PSB0cnVlKSB7XG4gICAgICByZXRCb29sID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiByZXRCb29sO1xuICB9O1xuXG4gIFRPLkVTNV9Ub0Jvb2wgPSBmdW5jdGlvbih2YWwpIHtcbiAgICByZXR1cm4gdmFsICE9PSBmYWxzZSAmJiB2YWwgIT09IDAgJiYgdmFsICE9PSAnJyAmJiB2YWwgIT09IG51bGwgJiYgdHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgKHR5cGVvZiB2YWwgIT09ICdudW1iZXInIHx8ICFpc05hTih2YWwpKTtcbiAgfTtcblxuICBUTy5kYXRlRnJvbVRpY2tzID0gZnVuY3Rpb24odGlja1N0cikge1xuICAgIHZhciBhcnIsIGxvY2FsT2Zmc2V0LCBvZmZzZXQsIHJldCwgdGlja3MsIHRpY3NEYXRlVGltZTtcbiAgICB0aWNzRGF0ZVRpbWUgPSB0aGlzLnN0cmluZyh0aWNrU3RyKTtcbiAgICByZXQgPSB2b2lkIDA7XG4gICAgdGlja3MgPSB2b2lkIDA7XG4gICAgb2Zmc2V0ID0gdm9pZCAwO1xuICAgIGxvY2FsT2Zmc2V0ID0gdm9pZCAwO1xuICAgIGFyciA9IHZvaWQgMDtcbiAgICBpZiAoZmFsc2UgPT09IElTLm51bGxPckVtcHR5KHRpY3NEYXRlVGltZSkpIHtcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcvJywgJycpO1xuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJ0RhdGUnLCAnJyk7XG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnKCcsICcnKTtcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcpJywgJycpO1xuICAgICAgYXJyID0gdGljc0RhdGVUaW1lLnNwbGl0KCctJyk7XG4gICAgICBpZiAoYXJyLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdGlja3MgPSB0aGlzLm51bWJlcihhcnJbMF0pO1xuICAgICAgICBvZmZzZXQgPSB0aGlzLm51bWJlcihhcnJbMV0pO1xuICAgICAgICBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICAgICAgcmV0ID0gbmV3IERhdGUodGlja3MgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSk7XG4gICAgICB9IGVsc2UgaWYgKGFyci5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdGlja3MgPSB0aGlzLm51bWJlcihhcnJbMF0pO1xuICAgICAgICByZXQgPSBuZXcgRGF0ZSh0aWNrcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgVE8uYmluYXJ5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgdmFyIHJldDtcbiAgICByZXQgPSBOYU47XG4gICAgaWYgKG9iaiA9PT0gMCB8fCBvYmogPT09ICcwJyB8fCBvYmogPT09ICcnIHx8IG9iaiA9PT0gZmFsc2UgfHwgdGhpcy5zdHJpbmcob2JqKS50b0xvd2VyQ2FzZSgpLnRyaW0oKSA9PT0gJ2ZhbHNlJykge1xuICAgICAgcmV0ID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG9iaiA9PT0gMSB8fCBvYmogPT09ICcxJyB8fCBvYmogPT09IHRydWUgfHwgdGhpcy5zdHJpbmcob2JqKS50b0xvd2VyQ2FzZSgpLnRyaW0oKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIHJldCA9IDE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgVE8ubnVtYmVyID0gZnVuY3Rpb24oaW5wdXROdW0sIGRlZmF1bHROdW0pIHtcbiAgICB2YXIgcmV0VmFsLCB0cnlHZXROdW1iZXI7XG4gICAgdHJ5R2V0TnVtYmVyID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odmFsKSB7XG4gICAgICAgIHZhciByZXQsIHRyeUdldDtcbiAgICAgICAgcmV0ID0gTmFOO1xuICAgICAgICBpZiAoSVMubnVtYmVyKHZhbCkpIHtcbiAgICAgICAgICByZXQgPSB2YWw7XG4gICAgICAgIH0gZWxzZSBpZiAoSVMuc3RyaW5nKHZhbCkgfHwgSVMuYm9vbCh2YWwpKSB7XG4gICAgICAgICAgdHJ5R2V0ID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBudW07XG4gICAgICAgICAgICBudW0gPSBfdGhpcy5iaW5hcnkodmFsdWUpO1xuICAgICAgICAgICAgaWYgKCFJUy5udW1iZXIobnVtKSAmJiB2YWx1ZSkge1xuICAgICAgICAgICAgICBudW0gPSArdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIUlTLm51bWJlcihudW0pKSB7XG4gICAgICAgICAgICAgIG51bSA9IF8ucGFyc2VJbnQodmFsdWUsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG51bTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHJldCA9IHRyeUdldCh2YWwpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpO1xuICAgIHJldFZhbCA9IHRyeUdldE51bWJlcihpbnB1dE51bSk7XG4gICAgaWYgKCFJUy5udW1iZXIocmV0VmFsKSkge1xuICAgICAgcmV0VmFsID0gdHJ5R2V0TnVtYmVyKGRlZmF1bHROdW0pO1xuICAgICAgaWYgKCFJUy5udW1iZXIocmV0VmFsKSkge1xuICAgICAgICByZXRWYWwgPSBOdW1iZXIuTmFOO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0VmFsO1xuICB9O1xuXG4gIFRPLnN0cmluZyA9IGZ1bmN0aW9uKGlucHV0U3RyLCBkZWZhdWx0U3RyKSB7XG4gICAgdmFyIHJldDEsIHJldDIsIHJldFZhbCwgdHJ5R2V0U3RyaW5nO1xuICAgIHRyeUdldFN0cmluZyA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHN0cikge1xuICAgICAgICB2YXIgcmV0O1xuICAgICAgICByZXQgPSB2b2lkIDA7XG4gICAgICAgIGlmIChJUy5zdHJpbmcoc3RyKSkge1xuICAgICAgICAgIHJldCA9IHN0cjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXQgPSAnJztcbiAgICAgICAgICBpZiAoSVMuYm9vbChzdHIpIHx8IElTLm51bWJlcihzdHIpIHx8IElTLmRhdGUoc3RyKSkge1xuICAgICAgICAgICAgcmV0ID0gc3RyLnRvU3RyaW5nKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9O1xuICAgIH0pKHRoaXMpO1xuICAgIHJldDEgPSB0cnlHZXRTdHJpbmcoaW5wdXRTdHIpO1xuICAgIHJldDIgPSB0cnlHZXRTdHJpbmcoZGVmYXVsdFN0cik7XG4gICAgcmV0VmFsID0gJyc7XG4gICAgaWYgKHJldDEubGVuZ3RoICE9PSAwKSB7XG4gICAgICByZXRWYWwgPSByZXQxO1xuICAgIH0gZWxzZSBpZiAocmV0MSA9PT0gcmV0MiB8fCByZXQyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0VmFsID0gcmV0MTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0VmFsID0gcmV0MjtcbiAgICB9XG4gICAgcmV0dXJuIHJldFZhbDtcbiAgfTtcblxuICByZXR1cm4gVE87XG5cbn0pKCk7XG5cbk9KLnJlZ2lzdGVyKCd0bycsIFRPKTtcblxubW9kdWxlLmV4cG9ydHMgPSBUTztcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRngwYjI5c2MxeGNkRzh1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVN4SlFVRkJPenRCUVVGQkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUMEZCVWpzN1FVRkRUQ3hEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCUTBvc1EwRkJRU3hIUVVGSkxFOUJRVUVzUTBGQlVTeFJRVUZTT3p0QlFVTktMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVFVGQlVqczdRVUZIUXpzN08wVkJSMG9zUlVGQlF5eERRVUZCTEVsQlFVUXNSMEZCVHl4VFFVRkRMRWRCUVVRN1FVRkRUQ3hSUVVGQk8wbEJRVUVzVDBGQlFTeEhRVUZWTEVWQlFVY3NRMEZCUVN4TlFVRkJMRU5CUVVnc1EwRkJWeXhIUVVGWU8wbEJRMVlzU1VGQmIwSXNUMEZCUVN4TFFVRlhMRXRCUVZnc1NVRkJiMElzVDBGQlFTeExRVUZoTEVsQlFYSkVPMDFCUVVFc1QwRkJRU3hIUVVGVkxFMUJRVlk3TzFkQlEwRTdSVUZJU3pzN1JVRlBVQ3hGUVVGRExFTkJRVUVzVlVGQlJDeEhRVUZoTEZOQlFVTXNSMEZCUkR0WFFVTllMRWRCUVVFc1MwRkJVeXhMUVVGVUxFbEJRVzFDTEVkQlFVRXNTMEZCVXl4RFFVRTFRaXhKUVVGclF5eEhRVUZCTEV0QlFWTXNSVUZCTTBNc1NVRkJhMFFzUjBGQlFTeExRVUZUTEVsQlFUTkVMRWxCUVc5RkxFOUJRVThzUjBGQlVDeExRVUZuUWl4WFFVRndSaXhKUVVGdlJ5eERRVUZETEU5QlFVOHNSMEZCVUN4TFFVRm5RaXhSUVVGb1FpeEpRVUUwUWl4RFFVRkpMRXRCUVVFc1EwRkJUU3hIUVVGT0xFTkJRV3BETzBWQlJIcEdPenRGUVV0aUxFVkJRVU1zUTBGQlFTeGhRVUZFTEVkQlFXZENMRk5CUVVNc1QwRkJSRHRCUVVOa0xGRkJRVUU3U1VGQlFTeFpRVUZCTEVkQlFXVXNTVUZCUXl4RFFVRkJMRTFCUVVRc1EwRkJVU3hQUVVGU08wbEJRMllzUjBGQlFTeEhRVUZOTzBsQlEwNHNTMEZCUVN4SFFVRlJPMGxCUTFJc1RVRkJRU3hIUVVGVE8wbEJRMVFzVjBGQlFTeEhRVUZqTzBsQlEyUXNSMEZCUVN4SFFVRk5PMGxCUTA0c1NVRkJSeXhMUVVGQkxFdEJRVk1zUlVGQlJTeERRVUZETEZkQlFVZ3NRMEZCWlN4WlFVRm1MRU5CUVZvN1RVRkRSU3haUVVGQkxFZEJRV1VzV1VGQldTeERRVUZETEU5QlFXSXNRMEZCY1VJc1IwRkJja0lzUlVGQk1FSXNSVUZCTVVJN1RVRkRaaXhaUVVGQkxFZEJRV1VzV1VGQldTeERRVUZETEU5QlFXSXNRMEZCY1VJc1RVRkJja0lzUlVGQk5rSXNSVUZCTjBJN1RVRkRaaXhaUVVGQkxFZEJRV1VzV1VGQldTeERRVUZETEU5QlFXSXNRMEZCY1VJc1IwRkJja0lzUlVGQk1FSXNSVUZCTVVJN1RVRkRaaXhaUVVGQkxFZEJRV1VzV1VGQldTeERRVUZETEU5QlFXSXNRMEZCY1VJc1IwRkJja0lzUlVGQk1FSXNSVUZCTVVJN1RVRkRaaXhIUVVGQkxFZEJRVTBzV1VGQldTeERRVUZETEV0QlFXSXNRMEZCYlVJc1IwRkJia0k3VFVGRFRpeEpRVUZITEVkQlFVY3NRMEZCUXl4TlFVRktMRWRCUVdFc1EwRkJhRUk3VVVGRFJTeExRVUZCTEVkQlFWRXNTVUZCUXl4RFFVRkJMRTFCUVVRc1EwRkJVU3hIUVVGSkxFTkJRVUVzUTBGQlFTeERRVUZhTzFGQlExSXNUVUZCUVN4SFFVRlRMRWxCUVVNc1EwRkJRU3hOUVVGRUxFTkJRVkVzUjBGQlNTeERRVUZCTEVOQlFVRXNRMEZCV2p0UlFVTlVMRmRCUVVFc1IwRkJhMElzU1VGQlFTeEpRVUZCTEVOQlFVRXNRMEZCVFN4RFFVRkRMR2xDUVVGUUxFTkJRVUU3VVVGRGJFSXNSMEZCUVN4SFFVRlZMRWxCUVVFc1NVRkJRU3hEUVVGTkxFdEJRVUVzUjBGQlVTeERRVUZETEVOQlFVTXNWMEZCUVN4SFFVRmpMRU5CUVVNc1RVRkJRU3hIUVVGVExFZEJRVlFzUjBGQlpTeEZRVUZvUWl4RFFVRm1MRU5CUVVFc1IwRkJjME1zU1VGQmRrTXNRMEZCWkN4RlFVcGFPMDlCUVVFc1RVRkxTeXhKUVVGSExFZEJRVWNzUTBGQlF5eE5RVUZLTEV0QlFXTXNRMEZCYWtJN1VVRkRTQ3hMUVVGQkxFZEJRVkVzU1VGQlF5eERRVUZCTEUxQlFVUXNRMEZCVVN4SFFVRkpMRU5CUVVFc1EwRkJRU3hEUVVGYU8xRkJRMUlzUjBGQlFTeEhRVUZWTEVsQlFVRXNTVUZCUVN4RFFVRkxMRXRCUVV3c1JVRkdVRHRQUVZoUU96dFhRV05CTzBWQmNrSmpPenRGUVhsQ2FFSXNSVUZCUXl4RFFVRkJMRTFCUVVRc1IwRkJVeXhUUVVGRExFZEJRVVE3UVVGRFVDeFJRVUZCTzBsQlFVRXNSMEZCUVN4SFFVRk5PMGxCUTA0c1NVRkJSeXhIUVVGQkxFdEJRVThzUTBGQlVDeEpRVUZaTEVkQlFVRXNTMEZCVHl4SFFVRnVRaXhKUVVFd1FpeEhRVUZCTEV0QlFVOHNSVUZCYWtNc1NVRkJkVU1zUjBGQlFTeExRVUZQTEV0QlFUbERMRWxCUVhWRUxFbEJRVU1zUTBGQlFTeE5RVUZFTEVOQlFWRXNSMEZCVWl4RFFVRlpMRU5CUVVNc1YwRkJZaXhEUVVGQkxFTkJRVEJDTEVOQlFVTXNTVUZCTTBJc1EwRkJRU3hEUVVGQkxFdEJRWEZETEU5QlFTOUdPMDFCUTBVc1IwRkJRU3hIUVVGTkxFVkJSRkk3UzBGQlFTeE5RVUZCTzAxQlJVc3NTVUZCV1N4SFFVRkJMRXRCUVU4c1EwRkJVQ3hKUVVGWkxFZEJRVUVzUzBGQlR5eEhRVUZ1UWl4SlFVRXdRaXhIUVVGQkxFdEJRVThzU1VGQmFrTXNTVUZCZVVNc1NVRkJReXhEUVVGQkxFMUJRVVFzUTBGQlVTeEhRVUZTTEVOQlFWa3NRMEZCUXl4WFFVRmlMRU5CUVVFc1EwRkJNRUlzUTBGQlF5eEpRVUV6UWl4RFFVRkJMRU5CUVVFc1MwRkJjVU1zVFVGQk1VWTdVVUZCUVN4SFFVRkJMRWRCUVUwc1JVRkJUanRQUVVaTU96dFhRVWRCTzBWQlRFODdPMFZCWjBKVUxFVkJRVU1zUTBGQlFTeE5RVUZFTEVkQlFWTXNVMEZCUXl4UlFVRkVMRVZCUVZjc1ZVRkJXRHRCUVVOUUxGRkJRVUU3U1VGQlFTeFpRVUZCTEVkQlFXVXNRMEZCUVN4VFFVRkJMRXRCUVVFN1lVRkJRU3hUUVVGRExFZEJRVVE3UVVGRFlpeFpRVUZCTzFGQlFVRXNSMEZCUVN4SFFVRk5PMUZCUlU0c1NVRkJSeXhGUVVGRkxFTkJRVU1zVFVGQlNDeERRVUZWTEVkQlFWWXNRMEZCU0R0VlFVTkZMRWRCUVVFc1IwRkJUU3hKUVVSU08xTkJRVUVzVFVGSFN5eEpRVUZITEVWQlFVVXNRMEZCUXl4TlFVRklMRU5CUVZVc1IwRkJWaXhEUVVGQkxFbEJRV3RDTEVWQlFVVXNRMEZCUXl4SlFVRklMRU5CUVZFc1IwRkJVaXhEUVVGeVFqdFZRVU5JTEUxQlFVRXNSMEZCVXl4VFFVRkRMRXRCUVVRN1FVRkRVQ3huUWtGQlFUdFpRVUZCTEVkQlFVRXNSMEZCVFN4TFFVRkRMRU5CUVVFc1RVRkJSQ3hEUVVGUkxFdEJRVkk3V1VGRFRpeEpRVUZwUWl4RFFVRkpMRVZCUVVVc1EwRkJReXhOUVVGSUxFTkJRVlVzUjBGQlZpeERRVUZLTEVsQlFYVkNMRXRCUVhoRE8yTkJRVUVzUjBGQlFTeEhRVUZOTEVOQlFVTXNUVUZCVURzN1dVRkRRU3hKUVVFNFFpeERRVUZKTEVWQlFVVXNRMEZCUXl4TlFVRklMRU5CUVZVc1IwRkJWaXhEUVVGc1F6dGpRVUZCTEVkQlFVRXNSMEZCVFN4RFFVRkRMRU5CUVVNc1VVRkJSaXhEUVVGWExFdEJRVmdzUlVGQmEwSXNRMEZCYkVJc1JVRkJUanM3YlVKQlEwRTdWVUZLVHp0VlFVdFVMRWRCUVVFc1IwRkJUU3hOUVVGQkxFTkJRVThzUjBGQlVDeEZRVTVJT3p0bFFVOU1PMDFCWW1FN1NVRkJRU3hEUVVGQkxFTkJRVUVzUTBGQlFTeEpRVUZCTzBsQlpXWXNUVUZCUVN4SFFVRlRMRmxCUVVFc1EwRkJZU3hSUVVGaU8wbEJRMVFzU1VGQlJ5eERRVUZKTEVWQlFVVXNRMEZCUXl4TlFVRklMRU5CUVZVc1RVRkJWaXhEUVVGUU8wMUJRMFVzVFVGQlFTeEhRVUZUTEZsQlFVRXNRMEZCWVN4VlFVRmlPMDFCUTFRc1NVRkJkVUlzUTBGQlNTeEZRVUZGTEVOQlFVTXNUVUZCU0N4RFFVRlZMRTFCUVZZc1EwRkJNMEk3VVVGQlFTeE5RVUZCTEVkQlFWTXNUVUZCVFN4RFFVRkRMRWxCUVdoQ08wOUJSa1k3TzFkQlIwRTdSVUZ3UWs4N08wVkJkMEpVTEVWQlFVTXNRMEZCUVN4TlFVRkVMRWRCUVZNc1UwRkJReXhSUVVGRUxFVkJRVmNzVlVGQldEdEJRVU5RTEZGQlFVRTdTVUZCUVN4WlFVRkJMRWRCUVdVc1EwRkJRU3hUUVVGQkxFdEJRVUU3WVVGQlFTeFRRVUZETEVkQlFVUTdRVUZEWWl4WlFVRkJPMUZCUVVFc1IwRkJRU3hIUVVGTk8xRkJRMDRzU1VGQlJ5eEZRVUZGTEVOQlFVTXNUVUZCU0N4RFFVRlZMRWRCUVZZc1EwRkJTRHRWUVVORkxFZEJRVUVzUjBGQlRTeEpRVVJTTzFOQlFVRXNUVUZCUVR0VlFVZEZMRWRCUVVFc1IwRkJUVHRWUVVOT0xFbEJRWGxDTEVWQlFVVXNRMEZCUXl4SlFVRklMRU5CUVZFc1IwRkJVaXhEUVVGQkxFbEJRV2RDTEVWQlFVVXNRMEZCUXl4TlFVRklMRU5CUVZVc1IwRkJWaXhEUVVGb1FpeEpRVUZyUXl4RlFVRkZMRU5CUVVNc1NVRkJTQ3hEUVVGUkxFZEJRVklzUTBGQk0wUTdXVUZCUVN4SFFVRkJMRWRCUVUwc1IwRkJSeXhEUVVGRExGRkJRVW9zUTBGQlFTeEZRVUZPTzFkQlNrWTdPMlZCUzBFN1RVRlFZVHRKUVVGQkxFTkJRVUVzUTBGQlFTeERRVUZCTEVsQlFVRTdTVUZSWml4SlFVRkJMRWRCUVU4c1dVRkJRU3hEUVVGaExGRkJRV0k3U1VGRFVDeEpRVUZCTEVkQlFVOHNXVUZCUVN4RFFVRmhMRlZCUVdJN1NVRkRVQ3hOUVVGQkxFZEJRVk03U1VGRFZDeEpRVUZITEVsQlFVa3NRMEZCUXl4TlFVRk1MRXRCUVdsQ0xFTkJRWEJDTzAxQlEwVXNUVUZCUVN4SFFVRlRMRXRCUkZnN1MwRkJRU3hOUVVWTExFbEJRVWNzU1VGQlFTeExRVUZSTEVsQlFWSXNTVUZCWjBJc1NVRkJTU3hEUVVGRExFMUJRVXdzUzBGQlpTeERRVUZzUXp0TlFVTklMRTFCUVVFc1IwRkJVeXhMUVVST08wdEJRVUVzVFVGQlFUdE5RVWRJTEUxQlFVRXNSMEZCVXl4TFFVaE9PenRYUVVsTU8wVkJiRUpQT3pzN096czdRVUZ2UWxnc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeEpRVUZhTEVWQlFXdENMRVZCUVd4Q096dEJRVU5CTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0lpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpQU2lBOUlISmxjWFZwY21VZ0p5NHVMMjlxSjF4eVhHNGtJRDBnY21WeGRXbHlaU0FuYW5GMVpYSjVKMXh5WEc1ZklEMGdjbVZ4ZFdseVpTQW5iRzlrWVhOb0oxeHlYRzVKVXlBOUlISmxjWFZwY21VZ0p5NHZhWE1uWEhKY2JseHlYRzRqSUNNZ2RHOWNjbHh1WTJ4aGMzTWdWRThnWEhKY2JpQWdJeUFqSXlCaWIyOXNYSEpjYmlBZ0l5QmpiMjUyWlhKMElHRnVlU0JqYjIxd1lYUnBZbXhsSUc5aWFtVmpkQ0IwYnlCaElHSnZiMnhsWVc0dUlFbHVZMjl0Y0dGMGFXSnNaU0J2WW1wbFkzUnpJR0Z5WlNCbVlXeHpaUzVjY2x4dUlDQkFZbTl2YkRvZ0tITjBjaWtnTFQ1Y2NseHVJQ0FnSUhKbGRFSnZiMndnUFNCSlUxc25kSEoxWlNkZEtITjBjaWxjY2x4dUlDQWdJSEpsZEVKdmIyd2dQU0JtWVd4elpTQWdhV1lnY21WMFFtOXZiQ0JwY3lCbVlXeHpaU0J2Y2lCeVpYUkNiMjlzSUdsemJuUWdkSEoxWlZ4eVhHNGdJQ0FnY21WMFFtOXZiRnh5WEc1Y2NseHVJQ0FqSUNNaklFVlROVjlVYjBKdmIyeGNjbHh1SUNBaklDaGtaV0oxWnlrZ2JXVjBhRzlrSUhSdklHVjRjR3hwWTJsMGJIa2dabTl5WTJVZ1lXNGdZR2xtS0c5aWFpbGdJR1YyWVd4MVlYUnBiMjRnZEc4Z1pteHZkeUIwYUhKdmRXZG9JSFJvWlNCRlV6VWdjM0JsWXlCbWIzSWdkSEoxZEdocGJtVnpjMXh5WEc0Z0lFQkZVelZmVkc5Q2IyOXNPaUFvZG1Gc0tTQXRQbHh5WEc0Z0lDQWdkbUZzSUdsemJuUWdabUZzYzJVZ1lXNWtJSFpoYkNCcGMyNTBJREFnWVc1a0lIWmhiQ0JwYzI1MElDY25JR0Z1WkNCMllXd2dhWE51ZENCdWRXeHNJR0Z1WkNCMGVYQmxiMllnZG1Gc0lHbHpiblFnSjNWdVpHVm1hVzVsWkNjZ1lXNWtJQ2gwZVhCbGIyWWdkbUZzSUdsemJuUWdKMjUxYldKbGNpY2diM0lnYm05MElHbHpUbUZPS0haaGJDa3BYSEpjYmx4eVhHNGdJQ01nSXlNZ1pHRjBaVVp5YjIxVWFXTnJjMXh5WEc0Z0lDTWdkR0ZyWlNCaElHNTFiV0psY2lCeVpYQnlaWE5sYm5ScGJtY2dkR2xqYTNNZ1lXNWtJR052Ym5abGNuUWdhWFFnYVc1MGJ5QmhiaUJwYm5OMFlXNWpaU0J2WmlCRVlYUmxYSEpjYmlBZ1FHUmhkR1ZHY205dFZHbGphM002SUNoMGFXTnJVM1J5S1NBdFBseHlYRzRnSUNBZ2RHbGpjMFJoZEdWVWFXMWxJRDBnUUhOMGNtbHVaeWgwYVdOclUzUnlLVnh5WEc0Z0lDQWdjbVYwSUQwZ2RXNWtaV1pwYm1Wa1hISmNiaUFnSUNCMGFXTnJjeUE5SUhWdVpHVm1hVzVsWkZ4eVhHNGdJQ0FnYjJabWMyVjBJRDBnZFc1a1pXWnBibVZrWEhKY2JpQWdJQ0JzYjJOaGJFOW1abk5sZENBOUlIVnVaR1ZtYVc1bFpGeHlYRzRnSUNBZ1lYSnlJRDBnZFc1a1pXWnBibVZrWEhKY2JpQWdJQ0JwWmlCbVlXeHpaU0JwY3lCSlV5NXVkV3hzVDNKRmJYQjBlU2gwYVdOelJHRjBaVlJwYldVcFhISmNiaUFnSUNBZ0lIUnBZM05FWVhSbFZHbHRaU0E5SUhScFkzTkVZWFJsVkdsdFpTNXlaWEJzWVdObEtDY3ZKeXdnSnljcFhISmNiaUFnSUNBZ0lIUnBZM05FWVhSbFZHbHRaU0E5SUhScFkzTkVZWFJsVkdsdFpTNXlaWEJzWVdObEtDZEVZWFJsSnl3Z0p5Y3BYSEpjYmlBZ0lDQWdJSFJwWTNORVlYUmxWR2x0WlNBOUlIUnBZM05FWVhSbFZHbHRaUzV5WlhCc1lXTmxLQ2NvSnl3Z0p5Y3BYSEpjYmlBZ0lDQWdJSFJwWTNORVlYUmxWR2x0WlNBOUlIUnBZM05FWVhSbFZHbHRaUzV5WlhCc1lXTmxLQ2NwSnl3Z0p5Y3BYSEpjYmlBZ0lDQWdJR0Z5Y2lBOUlIUnBZM05FWVhSbFZHbHRaUzV6Y0d4cGRDZ25MU2NwWEhKY2JpQWdJQ0FnSUdsbUlHRnljaTVzWlc1bmRHZ2dQaUF4WEhKY2JpQWdJQ0FnSUNBZ2RHbGphM01nUFNCQWJuVnRZbVZ5S0dGeWNsc3dYU2xjY2x4dUlDQWdJQ0FnSUNCdlptWnpaWFFnUFNCQWJuVnRZbVZ5S0dGeWNsc3hYU2xjY2x4dUlDQWdJQ0FnSUNCc2IyTmhiRTltWm5ObGRDQTlJRzVsZHlCRVlYUmxLQ2t1WjJWMFZHbHRaWHB2Ym1WUFptWnpaWFFvS1Z4eVhHNGdJQ0FnSUNBZ0lISmxkQ0E5SUc1bGR5QkVZWFJsS0NoMGFXTnJjeUF0SUNnb2JHOWpZV3hQWm1aelpYUWdLeUFvYjJabWMyVjBJQzhnTVRBd0lDb2dOakFwS1NBcUlERXdNREFwS1NsY2NseHVJQ0FnSUNBZ1pXeHpaU0JwWmlCaGNuSXViR1Z1WjNSb0lHbHpJREZjY2x4dUlDQWdJQ0FnSUNCMGFXTnJjeUE5SUVCdWRXMWlaWElvWVhKeVd6QmRLVnh5WEc0Z0lDQWdJQ0FnSUhKbGRDQTlJRzVsZHlCRVlYUmxLSFJwWTJ0ektWeHlYRzRnSUNBZ2NtVjBYSEpjYmx4eVhHNGdJQ01nSXlNZ1ltbHVZWEo1WEhKY2JpQWdJeUJqYjI1MlpYSjBJR0Z1SUc5aWFtVmpkQ0IwYnlCaWFXNWhjbmtnTUNCdmNpQXhYSEpjYmlBZ1FHSnBibUZ5ZVRvZ0tHOWlhaWtnTFQ1Y2NseHVJQ0FnSUhKbGRDQTlJRTVoVGx4eVhHNGdJQ0FnYVdZZ2IySnFJR2x6SURBZ2IzSWdiMkpxSUdseklDY3dKeUJ2Y2lCdlltb2dhWE1nSnljZ2IzSWdiMkpxSUdseklHWmhiSE5sSUc5eUlFQnpkSEpwYm1jb2IySnFLUzUwYjB4dmQyVnlRMkZ6WlNncExuUnlhVzBvS1NCcGN5QW5abUZzYzJVblhISmNiaUFnSUNBZ0lISmxkQ0E5SURCY2NseHVJQ0FnSUdWc2MyVWdjbVYwSUQwZ01TQWdhV1lnYjJKcUlHbHpJREVnYjNJZ2IySnFJR2x6SUNjeEp5QnZjaUJ2WW1vZ2FYTWdkSEoxWlNCdmNpQkFjM1J5YVc1bktHOWlhaWt1ZEc5TWIzZGxja05oYzJVb0tTNTBjbWx0S0NrZ2FYTWdKM1J5ZFdVblhISmNiaUFnSUNCeVpYUmNjbHh1WEhKY2JseHlYRzRnSUNNZ0l5TWdiblZ0WW1WeVhISmNiaUFnSTF4eVhHNGdJQ01nUVhSMFpXMXdkSE1nZEc4Z1kyOXVkbVZ5ZENCaGJpQmhjbUpwZEhKaGNua2dkbUZzZFdVZ2RHOGdZU0JPZFcxaVpYSXVYSEpjYmlBZ0l5Qk1iMjl6WlNCbVlXeHplU0IyWVd4MVpYTWdZWEpsSUdOdmJuWmxjblJsWkNCMGJ5QXdMbHh5WEc0Z0lDTWdURzl2YzJVZ2RISjFkR2g1SUhaaGJIVmxjeUJoY21VZ1kyOXVkbVZ5ZEdWa0lIUnZJREV1WEhKY2JpQWdJeUJCYkd3Z2IzUm9aWElnZG1Gc2RXVnpJR0Z5WlNCd1lYSnpaV1FnWVhNZ1NXNTBaV2RsY25NdVhISmNiaUFnSXlCR1lXbHNkWEpsY3lCeVpYUjFjbTRnWVhNZ1RtRk9MbHh5WEc0Z0lDTmNjbHh1SUNCQWJuVnRZbVZ5T2lBb2FXNXdkWFJPZFcwc0lHUmxabUYxYkhST2RXMHBJQzArWEhKY2JpQWdJQ0IwY25sSFpYUk9kVzFpWlhJZ1BTQW9kbUZzS1NBOVBseHlYRzRnSUNBZ0lDQnlaWFFnUFNCT1lVNWNjbHh1SUNBZ0lDQWdJeUJwWmlCZ2RtRnNZQ0JoYkhKbFlXUjVJQ2hwY3lsYmFYTXVhSFJ0YkYwZ1lTQk9kVzFpWlhJc0lISmxkSFZ5YmlCcGRGeHlYRzRnSUNBZ0lDQnBaaUJKVXk1dWRXMWlaWElvZG1Gc0tWeHlYRzRnSUNBZ0lDQWdJSEpsZENBOUlIWmhiRnh5WEc0Z0lDQWdJQ0FqSUdWc2MyVWdhV1lnWUhaaGJHQWdZV3h5WldGa2VTQW9hWE1wVzJsekxtaDBiV3hkSUdFZ1UzUnlhVzVuSUc5eUlHRWdRbTl2YkdWaGJpd2dZMjl1ZG1WeWRDQnBkRnh5WEc0Z0lDQWdJQ0JsYkhObElHbG1JRWxUTG5OMGNtbHVaeWgyWVd3cElHOXlJRWxUTG1KdmIyd29kbUZzS1Z4eVhHNGdJQ0FnSUNBZ0lIUnllVWRsZENBOUlDaDJZV3gxWlNrZ1BUNWNjbHh1SUNBZ0lDQWdJQ0FnSUc1MWJTQTlJRUJpYVc1aGNua29kbUZzZFdVcFhISmNiaUFnSUNBZ0lDQWdJQ0J1ZFcwZ1BTQXJkbUZzZFdVZ0lHbG1JRzV2ZENCSlV5NXVkVzFpWlhJb2JuVnRLU0JoYm1RZ2RtRnNkV1ZjY2x4dUlDQWdJQ0FnSUNBZ0lHNTFiU0E5SUY4dWNHRnljMlZKYm5Rb2RtRnNkV1VzSURBcElHbG1JRzV2ZENCSlV5NXVkVzFpWlhJb2JuVnRLVnh5WEc0Z0lDQWdJQ0FnSUNBZ2JuVnRYSEpjYmlBZ0lDQWdJQ0FnY21WMElEMGdkSEo1UjJWMElIWmhiRnh5WEc0Z0lDQWdJQ0J5WlhSY2NseHVYSEpjYmlBZ0lDQnlaWFJXWVd3Z1BTQjBjbmxIWlhST2RXMWlaWElvYVc1d2RYUk9kVzBwWEhKY2JpQWdJQ0JwWmlCdWIzUWdTVk11Ym5WdFltVnlLSEpsZEZaaGJDbGNjbHh1SUNBZ0lDQWdjbVYwVm1Gc0lEMGdkSEo1UjJWMFRuVnRZbVZ5S0dSbFptRjFiSFJPZFcwcFhISmNiaUFnSUNBZ0lISmxkRlpoYkNBOUlFNTFiV0psY2k1T1lVNGdhV1lnYm05MElFbFRMbTUxYldKbGNpaHlaWFJXWVd3cFhISmNiaUFnSUNCeVpYUldZV3hjY2x4dVhISmNiaUFnSXlBakl5QnpkSEpwYm1kY2NseHVJQ0FqSUdOdmJuWmxjblFnWVc0Z2IySnFaV04wSUhSdklITjBjbWx1WjF4eVhHNGdJRUJ6ZEhKcGJtYzZJQ2hwYm5CMWRGTjBjaXdnWkdWbVlYVnNkRk4wY2lrZ0xUNWNjbHh1SUNBZ0lIUnllVWRsZEZOMGNtbHVaeUE5SUNoemRISXBJRDArWEhKY2JpQWdJQ0FnSUhKbGRDQTlJSFZ1WkdWbWFXNWxaRnh5WEc0Z0lDQWdJQ0JwWmlCSlV5NXpkSEpwYm1jb2MzUnlLVnh5WEc0Z0lDQWdJQ0FnSUhKbGRDQTlJSE4wY2x4eVhHNGdJQ0FnSUNCbGJITmxYSEpjYmlBZ0lDQWdJQ0FnY21WMElEMGdKeWRjY2x4dUlDQWdJQ0FnSUNCeVpYUWdQU0J6ZEhJdWRHOVRkSEpwYm1jb0tTQWdhV1lnU1ZNdVltOXZiQ2h6ZEhJcElHOXlJRWxUTG01MWJXSmxjaWh6ZEhJcElHOXlJRWxUTG1SaGRHVW9jM1J5S1Z4eVhHNGdJQ0FnSUNCeVpYUmNjbHh1SUNBZ0lISmxkREVnUFNCMGNubEhaWFJUZEhKcGJtY29hVzV3ZFhSVGRISXBYSEpjYmlBZ0lDQnlaWFF5SUQwZ2RISjVSMlYwVTNSeWFXNW5LR1JsWm1GMWJIUlRkSElwWEhKY2JpQWdJQ0J5WlhSV1lXd2dQU0FuSjF4eVhHNGdJQ0FnYVdZZ2NtVjBNUzVzWlc1bmRHZ2dhWE51ZENBd1hISmNiaUFnSUNBZ0lISmxkRlpoYkNBOUlISmxkREZjY2x4dUlDQWdJR1ZzYzJVZ2FXWWdjbVYwTVNCcGN5QnlaWFF5SUc5eUlISmxkREl1YkdWdVozUm9JR2x6SURCY2NseHVJQ0FnSUNBZ2NtVjBWbUZzSUQwZ2NtVjBNVnh5WEc0Z0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNCeVpYUldZV3dnUFNCeVpYUXlYSEpjYmlBZ0lDQnlaWFJXWVd4Y2NseHVYSEpjYms5S0xuSmxaMmx6ZEdWeUlDZDBieWNzSUZSUFhISmNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdWRThpWFgwPSIsIiMgIyBjcmVhdGVVVUlEXHJcblxyXG5PSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG4jIyNcclxuR2VuZXJhdGVzIGEgcmFuZG9tIHN0cmluZyB0aGF0IGNvbXBsaWVzIHRvIHRoZSBSRkMgNDEyMiBzcGVjaWZpY2F0aW9uIGZvciBHVUlEL1VVSUQuXHJcbihlLmcuICdCNDJBMTUzRi0xRDlBLTRGOTItOTkwMy05MkMxMURENjg0RDInKVxyXG5XaGlsZSBub3QgYSB0cnVlIFVVSUQsIGZvciB0aGUgcHVycG9zZXMgb2YgdGhpcyBhcHBsaWNhdGlvbiwgaXQgc2hvdWxkIGJlIHN1ZmZpY2llbnQuXHJcbiMjI1xyXG5jcmVhdGVGYXV4VVVJRCA9IC0+XHJcbiAgICBcclxuICAjIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQxMjIudHh0XHJcbiAgIyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNTAzNC9ob3ctdG8tY3JlYXRlLWEtZ3VpZC11dWlkLWluLWphdmFzY3JpcHRcclxuICBzID0gW11cclxuICBzLmxlbmd0aCA9IDM2XHJcbiAgaGV4RGlnaXRzID0gJzAxMjM0NTY3ODlhYmNkZWYnXHJcbiAgaSA9IDBcclxuXHJcbiAgd2hpbGUgaSA8IDM2XHJcbiAgICBzW2ldID0gaGV4RGlnaXRzLnN1YnN0cihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAweDEwKSwgMSlcclxuICAgIGkgKz0gMVxyXG4gIHNbMTRdID0gJzQnICMgYml0cyAxMi0xNSBvZiB0aGUgdGltZV9oaV9hbmRfdmVyc2lvbiBmaWVsZCB0byAwMDEwXHJcbiAgc1sxOV0gPSBoZXhEaWdpdHMuc3Vic3RyKChzWzE5XSAmIDB4MykgfCAweDgsIDEpICMgYml0cyA2LTcgb2YgdGhlIGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWQgdG8gMDFcclxuICBzWzhdID0gc1sxM10gPSBzWzE4XSA9IHNbMjNdID0gJy0nXHJcbiAgdXVpZCA9IHMuam9pbignJylcclxuICB1dWlkXHJcblxyXG5PSi5yZWdpc3RlciAnY3JlYXRlVVVJRCcsIGNyZWF0ZUZhdXhVVUlEXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRmF1eFVVSUQiXX0=
