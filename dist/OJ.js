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
var Node, OJ, _, body;

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

body = new Node(body);

OJ.register('body', body);

module.exports = body;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxkb21cXGJvZHkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOzs7QUFHUDs7OztBQUdBLElBQUcsT0FBTyxRQUFQLEtBQXFCLFdBQXhCO0VBQXlDLElBQUEsR0FBTyxRQUFRLENBQUMsS0FBekQ7Q0FBQSxNQUFBO0VBQW1FLElBQUEsR0FBTyxLQUExRTs7O0FBQ0EsSUFBQSxHQUFXLElBQUEsSUFBQSxDQUFLLElBQUw7O0FBRVgsRUFBRSxDQUFDLFFBQUgsQ0FBWSxNQUFaLEVBQW9CLElBQXBCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xyXG5Ob2RlID0gcmVxdWlyZSAnLi9ub2RlJ1xyXG5cclxuXHJcbiMjI1xyXG5QZXJzaXN0IGEgaGFuZGxlIG9uIHRoZSBib2R5IG5vZGVcclxuIyMjXHJcbmlmIHR5cGVvZiBkb2N1bWVudCBpc250ICd1bmRlZmluZWQnIHRoZW4gYm9keSA9IGRvY3VtZW50LmJvZHkgZWxzZSBib2R5ID0gbnVsbFxyXG5ib2R5ID0gbmV3IE5vZGUgYm9keVxyXG4gIFxyXG5PSi5yZWdpc3RlciAnYm9keScsIGJvZHlcclxubW9kdWxlLmV4cG9ydHMgPSBib2R5Il19
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
    if (tag == null) {
      tag = el.nodeName;
    }
    return new Node(el);
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxkb21cXGVsZW1lbnQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUNKLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7QUFFUCxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVI7O0FBSVYsT0FBQSxHQUVFOztBQUFBOzs7RUFHQSxjQUFBLEVBQWdCLFNBQUMsRUFBRCxFQUFLLEdBQUw7O01BQUssTUFBTSxFQUFFLENBQUM7O1dBQ3hCLElBQUEsSUFBQSxDQUFLLEVBQUw7RUFEVSxDQUhoQjs7O0FBTUYsRUFBRSxDQUFDLFFBQUgsQ0FBWSxnQkFBWixFQUE4QixPQUFPLENBQUMsY0FBdEM7O0FBRUEsRUFBRSxDQUFDLFFBQUgsQ0FBWSxnQkFBWixFQUE4QixTQUFDLFNBQUQ7U0FDNUIsS0FBQSxLQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBTixDQUFrQixFQUFFLENBQUMsVUFBSCxDQUFjLFNBQWQsQ0FBbEI7QUFEbUIsQ0FBOUI7O0FBR0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxZQUFaLEVBQTBCLFNBQUMsRUFBRDtFQUN4QixJQUFHLE9BQU8sUUFBUCxLQUFxQixXQUF4QjtXQUNFLFFBQVEsQ0FBQyxjQUFULENBQXdCLEVBQXhCLEVBREY7O0FBRHdCLENBQTFCOztBQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xyXG5Ob2RlID0gcmVxdWlyZSAnLi9ub2RlJ1xyXG5cclxuVGhpbkRPTSA9IHJlcXVpcmUgJ3RoaW5kb20nXHJcblxyXG4jICMgZWxlbWVudFxyXG5cclxuZWxlbWVudCA9IFxyXG4gICMgIyMgcmVzdG9yZUVsZW1lbnRcclxuICAjIyNcclxuICBSZXN0b3JlIGFuIEhUTUwgRWxlbWVudCB0aHJvdWdoIFRoaW5Eb21cclxuICAjIyNcclxuICByZXN0b3JlRWxlbWVudDogKGVsLCB0YWcgPSBlbC5ub2RlTmFtZSkgLT5cclxuICAgIG5ldyBOb2RlKGVsKVxyXG5cclxuT0oucmVnaXN0ZXIgJ3Jlc3RvcmVFbGVtZW50JywgZWxlbWVudC5yZXN0b3JlRWxlbWVudFxyXG5cclxuT0oucmVnaXN0ZXIgJ2lzRWxlbWVudEluRG9tJywgKGVsZW1lbnRJZCkgLT5cclxuICBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSBPSi5nZXRFbGVtZW50IGVsZW1lbnRJZFxyXG5cclxuT0oucmVnaXN0ZXIgJ2dldEVsZW1lbnQnLCAoaWQpIC0+XHJcbiAgaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCdcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWxlbWVudCJdfQ==
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
  function Node(element, parent) {
    this.element = element;
  }

  Node.prototype.make = function(tagName, options) {
    var method, newElement;
    if (tagName.make) {
      return tagName.make(this, options);
    } else {
      method = methods[tagName];
      if (method) {
        return method(options);
      } else {
        method = OJ.components[tagName] || OJ.controls[tagName] || OJ.inputs[tagName];
        if (method) {
          return method(options, this);
        } else {
          newElement = createElement(this.element, tagName, options);
          return new Node(newElement);
        }
      }
    }
  };

  Node.prototype.add = function(name, value) {
    return this[name] = value;
  };

  return Node;

})();

['on', 'empty', 'text', 'removeClass', 'addClass', 'hasClass', 'show', 'hide', 'attr', 'css', 'remove', 'append', 'val', 'html'].forEach(function(method) {
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

module.exports = Node;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxkb21cXG5vZGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBT0osT0FBQSxHQUFVOztBQUtKO0VBSVMsY0FBQyxPQUFELEVBQVcsTUFBWDtJQUFDLElBQUMsQ0FBQSxVQUFEO0VBQUQ7O2lCQUViLElBQUEsR0FBTSxTQUFDLE9BQUQsRUFBVSxPQUFWO0FBQ0osUUFBQTtJQUFBLElBQUcsT0FBTyxDQUFDLElBQVg7YUFDRSxPQUFPLENBQUMsSUFBUixDQUFhLElBQWIsRUFBbUIsT0FBbkIsRUFERjtLQUFBLE1BQUE7TUFHRSxNQUFBLEdBQVMsT0FBUSxDQUFBLE9BQUE7TUFDakIsSUFBRyxNQUFIO2VBQ0UsTUFBQSxDQUFPLE9BQVAsRUFERjtPQUFBLE1BQUE7UUFHRSxNQUFBLEdBQVMsRUFBRSxDQUFDLFVBQVcsQ0FBQSxPQUFBLENBQWQsSUFBMEIsRUFBRSxDQUFDLFFBQVMsQ0FBQSxPQUFBLENBQXRDLElBQWtELEVBQUUsQ0FBQyxNQUFPLENBQUEsT0FBQTtRQUNyRSxJQUFHLE1BQUg7aUJBQ0UsTUFBQSxDQUFPLE9BQVAsRUFBZ0IsSUFBaEIsRUFERjtTQUFBLE1BQUE7VUFHRSxVQUFBLEdBQWEsYUFBQSxDQUFjLElBQUksQ0FBQyxPQUFuQixFQUE0QixPQUE1QixFQUFxQyxPQUFyQztpQkFDVCxJQUFBLElBQUEsQ0FBSyxVQUFMLEVBSk47U0FKRjtPQUpGOztFQURJOztpQkFjTixHQUFBLEdBQUssU0FBQyxJQUFELEVBQU8sS0FBUDtXQUNILElBQUssQ0FBQSxJQUFBLENBQUwsR0FBYTtFQURWOzs7Ozs7QUFHUCxDQUFDLElBQUQsRUFBTyxPQUFQLEVBQWdCLE1BQWhCLEVBQXdCLGFBQXhCLEVBQXVDLFVBQXZDLEVBQW1ELFVBQW5ELEVBQStELE1BQS9ELEVBQXVFLE1BQXZFLEVBQStFLE1BQS9FLEVBQXVGLEtBQXZGLEVBQThGLFFBQTlGLEVBQXdHLFFBQXhHLEVBQWtILEtBQWxILEVBQXlILE1BQXpILENBQWdJLENBQUMsT0FBakksQ0FBeUksU0FBQyxNQUFEO1NBQ3ZJLElBQUksQ0FBQyxTQUFVLENBQUEsTUFBQSxDQUFmLEdBQXlCLFNBQUE7QUFDdkIsUUFBQTtJQUFBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBO1dBQ2pCLGFBQWMsQ0FBQSxNQUFBLENBQU8sQ0FBQyxLQUF0QixDQUE0QixhQUE1QixFQUEyQyxTQUEzQztFQUZ1QjtBQUQ4RyxDQUF6STs7QUFNQSxNQUFNLENBQUMsY0FBUCxDQUFzQixJQUFJLENBQUMsU0FBM0IsRUFBc0MsR0FBdEMsRUFDRTtFQUFBLEdBQUEsRUFBSyxTQUFBO0FBQ0gsUUFBQTtJQUFBLGFBQUEsR0FBZ0IsQ0FBQSxDQUFFLElBQUksQ0FBQyxPQUFQO0lBQ2hCLE1BQU0sQ0FBQyxjQUFQLENBQXNCLElBQXRCLEVBQTRCLEdBQTVCLEVBQ0U7TUFBQSxLQUFBLEVBQU8sYUFBUDtLQURGO1dBR0E7RUFMRyxDQUFMO0NBREY7O0FBVUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiQgPSByZXF1aXJlICdqcXVlcnknXHJcblxyXG4jICMgZG9tXHJcblxyXG5cclxuIyBFeHRlbmQgYW4gb2JqZWN0IHdpdGggT0ogRE9NIG1ldGhvZHMgYW5kIHByb3BlcnRpZXNcclxuXHJcbm1ldGhvZHMgPSB7fVxyXG5cclxuXHJcbiMgLSBgQGVsYCBPYmplY3QgdG8gZXh0ZW5kXHJcbiMgLSBgcGFyZW50YCBwYXJlbnQgb2JqZWN0IHRvIHdoaWNoIGBAZWxgIHdpbGwgYmUgYXBwZW5kZWRcclxuY2xhc3MgTm9kZVxyXG4gIFxyXG4gICNwYXJlbnQ6IHJlcXVpcmUoJy4vYm9keScpXHJcbiAgXHJcbiAgY29uc3RydWN0b3I6IChAZWxlbWVudCwgcGFyZW50KSAtPlxyXG5cclxuICBtYWtlOiAodGFnTmFtZSwgb3B0aW9ucykgLT5cclxuICAgIGlmIHRhZ05hbWUubWFrZSAjIHByb3ZpZGVkIGEgY3VzdG9tIGNvbXBvbmVudCBkaXJlY3RseVxyXG4gICAgICB0YWdOYW1lLm1ha2UgdGhpcywgb3B0aW9uc1xyXG4gICAgZWxzZVxyXG4gICAgICBtZXRob2QgPSBtZXRob2RzW3RhZ05hbWVdXHJcbiAgICAgIGlmIG1ldGhvZFxyXG4gICAgICAgIG1ldGhvZCBvcHRpb25zXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBtZXRob2QgPSBPSi5jb21wb25lbnRzW3RhZ05hbWVdIG9yIE9KLmNvbnRyb2xzW3RhZ05hbWVdIG9yIE9KLmlucHV0c1t0YWdOYW1lXVxyXG4gICAgICAgIGlmIG1ldGhvZFxyXG4gICAgICAgICAgbWV0aG9kIG9wdGlvbnMsIHRoaXNcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBuZXdFbGVtZW50ID0gY3JlYXRlRWxlbWVudCB0aGlzLmVsZW1lbnQsIHRhZ05hbWUsIG9wdGlvbnNcclxuICAgICAgICAgIG5ldyBOb2RlKG5ld0VsZW1lbnQpXHJcbiAgYWRkOiAobmFtZSwgdmFsdWUpIC0+XHJcbiAgICB0aGlzW25hbWVdID0gdmFsdWVcclxuXHJcblsnb24nLCAnZW1wdHknLCAndGV4dCcsICdyZW1vdmVDbGFzcycsICdhZGRDbGFzcycsICdoYXNDbGFzcycsICdzaG93JywgJ2hpZGUnLCAnYXR0cicsICdjc3MnLCAncmVtb3ZlJywgJ2FwcGVuZCcsICd2YWwnLCAnaHRtbCddLmZvckVhY2goKG1ldGhvZCkgLT5cclxuICBOb2RlLnByb3RvdHlwZVttZXRob2RdID0gKCkgLT5cclxuICAgIGpRdWVyeVdyYXBwZXIgPSBAJFxyXG4gICAgalF1ZXJ5V3JhcHBlclttZXRob2RdLmFwcGx5KGpRdWVyeVdyYXBwZXIsIGFyZ3VtZW50cylcclxuKVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLCAnJCcsXHJcbiAgZ2V0OiAoKSAtPlxyXG4gICAgalF1ZXJ5V3JhcHBlciA9ICQodGhpcy5lbGVtZW50KVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICckJyxcclxuICAgICAgdmFsdWU6IGpRdWVyeVdyYXBwZXJcclxuICAgIClcclxuICAgIGpRdWVyeVdyYXBwZXJcclxuKVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTm9kZSJdfQ==
},{"../oj":58}],23:[function(require,module,exports){
(function (global){
var Node, NodeFactory, OJ, ThinDOM, _, getNodeFromFactory,
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

getNodeFromFactory = function(tag, options, owner, isCalledFromFactory, node) {
  return new Node(createElement(owner.element, tag || 'div', options));
};

OJ.register('nodeFactory', getNodeFromFactory);

module.exports = getNodeFromFactory;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxkb21cXG5vZGVGYWN0b3J5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQSxxREFBQTtFQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSOztBQUNWLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7QUErRUQ7d0JBRUosTUFBQSxHQUFROztFQUVSLFdBQUMsQ0FBQSxHQUFELEdBQU0sU0FBQyxFQUFELEVBQUssT0FBTDtBQUNKLFFBQUE7O01BRFMsVUFBVTs7SUFDbkIsR0FBQSxHQUFNO0lBQ04sRUFBQSxHQUFLLFFBQVEsQ0FBQyxjQUFULENBQXdCLEVBQXhCO0lBQ0wsSUFBRyxFQUFIO01BQ0UsTUFBQSxHQUFTLEVBQUUsQ0FBQyxjQUFILENBQWtCLEVBQWxCLEVBQXNCLE9BQXRCLEVBRFg7O0lBRUEsSUFBRyxNQUFIO01BQ0UsR0FBQSxHQUFVLElBQUEsV0FBQSxDQUFZLElBQVosRUFBa0IsSUFBbEIsRUFBd0IsSUFBeEIsRUFBOEIsS0FBOUIsRUFBcUMsTUFBckMsRUFEWjs7V0FHQTtFQVJJOzt3QkFVTixRQUFBLEdBQVUsU0FBQyxPQUFELEVBQVUsS0FBVjtXQUNSLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxJQUFEO0FBQ0UsWUFBQTtRQUFBLE1BQUEsR0FBUyxFQUFFLENBQUMsS0FBTSxDQUFBLE9BQUEsQ0FBVCxJQUFxQixFQUFFLENBQUMsVUFBVyxDQUFBLE9BQUEsQ0FBbkMsSUFBK0MsRUFBRSxDQUFDLFFBQVMsQ0FBQSxPQUFBLENBQTNELElBQXVFLEVBQUUsQ0FBQyxNQUFPLENBQUEsT0FBQTtRQUMxRixJQUFHLE1BQUg7VUFDRSxFQUFBLEdBQUssTUFBQSxDQUFPLElBQVAsRUFBYSxLQUFDLENBQUEsTUFBZCxFQURQO1NBQUEsTUFB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LFFBQVIsSUFBb0IsRUFBRSxDQUFDLElBQTlCO01BQ1gsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLEdBQW1CO01BQ25CLFFBQUEsQ0FBUyxJQUFDLENBQUEsTUFBVixFQTdCRjs7V0ErQkEsSUFBQyxDQUFBO0VBbkNHOzs7Ozs7QUFxQ1Isa0JBQUEsR0FBcUIsU0FBQyxHQUFELEVBQU0sT0FBTixFQUFlLEtBQWYsRUFBc0IsbUJBQXRCLEVBQTJDLElBQTNDO1NBQ2YsSUFBQSxJQUFBLENBQUssYUFBQSxDQUFjLEtBQUssQ0FBQyxPQUFwQixFQUE2QixHQUFBLElBQU8sS0FBcEMsRUFBMkMsT0FBM0MsQ0FBTDtBQURlOztBQUlyQixFQUFFLENBQUMsUUFBSCxDQUFZLGFBQVosRUFBMkIsa0JBQTNCOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xyXG5UaGluRE9NID0gcmVxdWlyZSAndGhpbmRvbSdcclxuTm9kZSA9IHJlcXVpcmUgJy4vbm9kZSdcclxuXHJcbiNjbG9zZWQgPSAnYSBhYmJyIGFjcm9ueW0gYWRkcmVzcyBhcHBsZXQgYXJ0aWNsZSBhc2lkZSBhdWRpbyBiIGJkbyBiaWcgYmxvY2txdW90ZSBib2R5IGJ1dHRvbiBjYW52YXMgY2FwdGlvbiBjZW50ZXIgY2l0ZSBjb2RlIGNvbGdyb3VwIGNvbW1hbmQgZGF0YWxpc3QgZGQgZGVsIGRldGFpbHMgZGZuIGRpciBkaXYgZGwgZHQgZW0gZW1iZWQgZmllbGRzZXQgZmlnY2FwdGlvbiBmaWd1cmUgZm9udCBmb290ZXIgZm9ybSBmcmFtZXNldCBoMSBoMiBoMyBoNCBoNSBoNiBoZWFkIGhlYWRlciBoZ3JvdXAgaHRtbCBpIGlmcmFtZSBpbnMga2V5Z2VuIGtiZCBsYWJlbCBsZWdlbmQgbGkgbWFwIG1hcmsgbWVudSBtZXRlciBuYXYgbm9mcmFtZXMgbm9zY3JpcHQgb2JqZWN0IG9sIG9wdGdyb3VwIG9wdGlvbiBvdXRwdXQgcCBwcmUgcHJvZ3Jlc3MgcSBycCBydCBydWJ5IHMgc2FtcCBzY3JpcHQgc2VjdGlvbiBzZWxlY3Qgc21hbGwgc291cmNlIHNwYW4gc3RyaWtlIHN0cm9uZyBzdHlsZSBzdWIgc3VtbWFyeSBzdXAgdGFibGUgdGJvZHkgdGQgdGV4dGFyZWEgdGZvb3QgdGggdGhlYWQgdGltZSB0aXRsZSB0ciB0dCB1IHVsIHZhciB2aWRlbyB3YnIgeG1wJy5zcGxpdCAnICdcclxuI29wZW4gPSAnYXJlYSBiYXNlIGJyIGNvbCBjb21tYW5kIGNzcyAhRE9DVFlQRSBlbWJlZCBociBpbWcgaW5wdXQga2V5Z2VuIGxpbmsgbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyJy5zcGxpdCAnICdcclxuI1xyXG4jbmVzdGFibGVOb2RlTmFtZXMgPSBbXHJcbiMgICdkaXYnXHJcbiMgICdzcGFuJ1xyXG4jICAnaDEnXHJcbiMgICdoMidcclxuIyAgJ2gzJ1xyXG4jICAnaDQnXHJcbiMgICdoNSdcclxuIyAgJ2g2J1xyXG4jICAncCdcclxuIyAgJ2ZpZWxkc2V0J1xyXG4jICAnc2VsZWN0J1xyXG4jICAnb2wnXHJcbiMgICd1bCdcclxuIyAgJ3RhYmxlJ1xyXG4jXVxyXG4jXHJcbiMjVGhpcyBsaXN0IGlzIG5vdCB5ZXQgZXhoYXVzdGl2ZSwganVzdCBleGNsdWRlIHRoZSBvYnZpb3VzXHJcbiNub25OZXN0YWJsZU5vZGVzID0gW1xyXG4jICAnbGknXHJcbiMgICdsZWdlbmQnXHJcbiMgICd0cidcclxuIyAgJ3RkJ1xyXG4jICAnb3B0aW9uJ1xyXG4jICAnYm9keSdcclxuIyAgJ2hlYWQnXHJcbiMgICdzb3VyY2UnXHJcbiMgICd0Ym9keSdcclxuIyAgJ3Rmb290J1xyXG4jICAndGhlYWQnXHJcbiMgICdsaW5rJ1xyXG4jICAnc2NyaXB0J1xyXG4jXVxyXG4jXHJcbiNub2RlTmFtZXMgPSBbXHJcbiMgICdhJ1xyXG4jICAnYidcclxuIyAgJ2JyJ1xyXG4jICAnYnV0dG9uJ1xyXG4jICAnZGl2J1xyXG4jICAnZW0nXHJcbiMgICdmaWVsZHNldCdcclxuIyAgJ2Zvcm0nXHJcbiMgICdoMSdcclxuIyAgJ2gyJ1xyXG4jICAnaDMnXHJcbiMgICdoNCdcclxuIyAgJ2g1J1xyXG4jICAnaDYnXHJcbiMgICdpJ1xyXG4jICAnaW1nJ1xyXG4jICAnaW5wdXQnXHJcbiMgICdsYWJlbCdcclxuIyAgJ2xlZ2VuZCdcclxuIyAgJ2xpJ1xyXG4jICAnbmF2J1xyXG4jICAnb2wnXHJcbiMgICdvcHRpb24nXHJcbiMgICdwJ1xyXG4jICAnc2VsZWN0J1xyXG4jICAnc3BhbidcclxuIyAgJ3N0cm9uZydcclxuIyAgJ3N1cCdcclxuIyAgJ3N2ZydcclxuIyAgJ3RhYmxlJ1xyXG4jICAndGJvZHknXHJcbiMgICd0ZCdcclxuIyAgJ3RleHRhcmVhJ1xyXG4jICAndGgnXHJcbiMgICd0aGVhZCdcclxuIyAgJ3RyJ1xyXG4jICAndWwnXHJcbiNdXHJcblxyXG5jbGFzcyBOb2RlRmFjdG9yeVxyXG4gIFxyXG4gIG9qTm9kZTogbnVsbFxyXG4gIFxyXG4gIEBnZXQ6IChpZCwgdGFnTmFtZSA9ICdkaXYnKSAtPlxyXG4gICAgcmV0ID0gbnVsbFxyXG4gICAgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCBpZFxyXG4gICAgaWYgZWxcclxuICAgICAgdGhpbkVsID0gT0oucmVzdG9yZUVsZW1lbnQgZWwsIHRhZ05hbWVcclxuICAgIGlmIHRoaW5FbFxyXG4gICAgICByZXQgPSBuZXcgTm9kZUZhY3RvcnkgbnVsbCwgbnVsbCwgbnVsbCwgZmFsc2UsIHRoaW5FbFxyXG5cclxuICAgIHJldFxyXG4gIFxyXG4gIF9tYWtlQWRkOiAodGFnTmFtZSwgY291bnQpIC0+XHJcbiAgICAob3B0cykgPT5cclxuICAgICAgbWV0aG9kID0gT0oubm9kZXNbdGFnTmFtZV0gb3IgT0ouY29tcG9uZW50c1t0YWdOYW1lXSBvciBPSi5jb250cm9sc1t0YWdOYW1lXSBvciBPSi5pbnB1dHNbdGFnTmFtZV1cclxuICAgICAgaWYgbWV0aG9kXHJcbiAgICAgICAgbnUgPSBtZXRob2Qgb3B0cywgQG9qTm9kZVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgbnUgPSBPSi5jb21wb25lbnQgbnVsbCwgQG9qTm9kZSwgdGFnTmFtZVxyXG4gICAgICAjcmV0ID0gbmV3IE5vZGVGYWN0b3J5IG51LCBAdGhpbk5vZGUsIGNvdW50XHJcbiAgICAgIG51XHJcbiAgXHJcbiAgX21ha2VVbmlxdWVJZDogKGNvdW50KSAtPlxyXG4gICAgaWYgT0ouR0VORVJBVEVfVU5JUVVFX0lEU1xyXG4gICAgICBjb3VudCArPSAxXHJcbiAgICAgIGlmIGNvdW50IDw9IEBvd25lci5jb3VudCB0aGVuIGNvdW50ID0gQG93bmVyLmNvdW50ICsgMVxyXG4gICAgICBAb3duZXIuY291bnQgPSBjb3VudFxyXG5cclxuICAgICAgaWYgbm90IEBvak5vZGUuZ2V0SWQoKVxyXG4gICAgICAgIGlkID0gQG93bmVyLmdldElkKCkgb3IgJydcclxuICAgICAgICBpZCArPSBAb2pOb2RlLnRhZ05hbWUgKyBjb3VudFxyXG4gICAgICAgIEBvak5vZGUuYXR0ciAnaWQnLCBpZFxyXG4gICAgcmV0dXJuXHJcbiAgXHJcbiAgX2JpbmRFdmVudHM6IC0+XHJcbiAgICBpZiBAb2pOb2RlIHRoZW4gXy5mb3JPd24gQG9wdGlvbnMuZXZlbnRzLCAodmFsLCBrZXkpID0+XHJcbiAgICAgIGlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXHJcbiAgICAgIGlmIGlzTWV0aG9kLm1ldGhvZCB2YWxcclxuICAgICAgICBjYWxsYmFjayA9IChldmVudC4uLikgLT4gdmFsIGV2ZW50Li4uXHJcbiAgICAgICAgQG9qTm9kZS4kLm9uIGtleSwgY2FsbGJhY2tcclxuICAgICAgICBAb2pOb2RlLmFkZCBrZXksIGNhbGxiYWNrXHJcbiAgICAgICAgbnVsbFxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yOiAoQHRhZywgQG9wdGlvbnMsIEBvd25lciwgQHRoaW5Ob2RlID0gbnVsbCkgLT5cclxuICAgIGlmIEB0YWcgYW5kIG5vdCBAdGhpbk5vZGVcclxuICAgICAgQHRoaW5Ob2RlID0gbmV3IFRoaW5ET00gQHRhZywgQG9wdGlvbnMucHJvcHNcclxuICAgICAgQHRoaW5Ob2RlLmFkZCAndGFnTmFtZScsIEB0YWdcclxuICAgICAgQHRoaW5Ob2RlLmNzcyBAb3B0aW9ucy5zdHlsZXNcclxuICAgICAgaWYgQG9wdGlvbnMudGV4dCB0aGVuIEB0aGluTm9kZS50ZXh0IEBvcHRpb25zLnRleHRcclxuICAgIFxyXG4gICAgaWYgQG93bmVyXHJcbiAgICAgIEBtYWtlKClcclxuICBcclxuICBhZGRNYWtlTWV0aG9kOiAoY291bnQpIC0+XHJcbiAgICBtZXRob2RzID0gT0oub2JqZWN0KClcclxuICAgIEBvak5vZGUubWFrZSA9ICh0YWdOYW1lLCBvcHRzKSA9PlxyXG4gICAgICBtZXRob2QgPSBtZXRob2RzW3RhZ05hbWVdXHJcbiAgICAgIGlmIG5vdCBtZXRob2RcclxuICAgICAgICBtZXRob2QgPSBAX21ha2VBZGQgdGFnTmFtZSwgQG9qTm9kZSwgY291bnRcclxuICAgICAgICBtZXRob2RzW3RhZ05hbWVdID0gbWV0aG9kXHJcbiAgICAgIG1ldGhvZCBvcHRzXHJcbiAgICBAb2pOb2RlXHJcblxyXG4gIG1ha2U6IC0+XHJcblxyXG4gICAgQG9qTm9kZSA9IG51bGxcclxuXHJcbiAgICBpZiBAdGhpbk5vZGU/LmlzRnVsbHlJbml0IHRoZW4gQG9qTm9kZSA9IEB0aGluTm9kZVxyXG4gIFxyXG4gICAgIyAyOiBJZiB0aGUgZWxlbWVudCBoYXMgbmV2ZXIgYmVlbiBpbml0aWFsaXplZCwgY29udGludWVcclxuICAgIGVsc2VcclxuICAgICAgIyAzOiBBcyBsb25nIGFzIHRoZSBlbGVtZW50IGlzbid0IHRoZSBib2R5IG5vZGUsIGNvbnRpbnVlXHJcbiAgICAgICMgaWYgZWwudGFnTmFtZSBpc250ICdib2R5J1xyXG4gICAgICAjIDQ6IEV4dGVuZCB0aGUgZWxlbWVudCB3aXRoIHN0YW5kYXJkIGpRdWVyeSBBUEkgbWV0aG9kc1xyXG4gICAgICBAb2pOb2RlID0gbmV3IE5vZGUgQHRoaW5Ob2RlLCBAb3duZXJcclxuICAgICAgY291bnQgPSAoQG93bmVyLmNvdW50ICsgMSkgfHwgMVxyXG4gICAgICAjIDU6IElmIHRoZSBub2RlIGlzbid0IGluIHRoZSBET00sIGFwcGVuZCBpdCB0byB0aGUgcGFyZW50XHJcbiAgICAgICMgVGhpcyBhbHNvIGFjY29tbW9kYXRlcyBkb2N1bWVudCBmcmFnbWVudHMsIHdoaWNoIGFyZSBub3QgaW4gdGhlIERPTSBidXQgYXJlIHByZXN1bWVkIHRvIGJlIHNvdW5kIHVudGlsIHJlYWR5IGZvciBtYW51YWwgaW5zZXJ0aW9uXHJcbiAgICAgIGlmIEB0aGluTm9kZS50YWdOYW1lIGlzbnQgJ2JvZHknIGFuZCBub3QgQHRoaW5Ob2RlLmlzSW5ET00gYW5kIG5vdCBAb2pOb2RlLmlzSW5ET01cclxuICAgICAgICBAX21ha2VVbmlxdWVJZCBjb3VudFxyXG4gICAgICAgIEBvd25lci5hcHBlbmQgQG9qTm9kZVswXVxyXG4gICAgICAgICMgNjogQmluZCBhbnkgZGVmaW5lZCBldmVudHMgYWZ0ZXIgdGhlIG5vZGUgaXMgaW4gdGhlIERPTVxyXG4gICAgICAgIEBfYmluZEV2ZW50cygpXHJcbiAgICAgICAgXHJcbiAgICAgIEB0aGluTm9kZS5pc0luRE9NID0gdHJ1ZVxyXG4gICAgICBAb2pOb2RlLmlzSW5ET00gPSB0cnVlXHJcblxyXG4gICAgICAjIDc6IENyZWF0ZSB0aGUgYWxsIGltcG9ydGFudCAnbWFrZScgbWV0aG9kXHJcbiAgICAgIEBhZGRNYWtlTWV0aG9kIGNvdW50XHJcblxyXG4gICAgICAjIDg6IFByZXZlbnQgZHVwbGljYXRlIGZhY3RvcnkgZXh0ZW5zaW9uIGJ5IHNldHRpbmcgaXMgaW5pdCA9IHRydWVcclxuICAgICAgQG9qTm9kZS5pc0Z1bGx5SW5pdCA9IHRydWVcclxuXHJcbiAgICAgICMgOTogaWYgdGhlIG5vZGUgc3VwcG9ydHMgaXQsIGNhbGwgZmluYWxpemVcclxuICAgICAgZmluYWxpemUgPSBfLm9uY2UgQG9qTm9kZS5maW5hbGl6ZSBvciBPSi5ub29wXHJcbiAgICAgIEBvak5vZGUuZmluYWxpemUgPSBmaW5hbGl6ZVxyXG4gICAgICBmaW5hbGl6ZSBAb2pOb2RlXHJcbiAgICAjIDEwOiBSZXR1cm4gdGhlIGV4dGVuZGVkIGVsZW1lbnRcclxuICAgIEBvak5vZGVcclxuXHJcbmdldE5vZGVGcm9tRmFjdG9yeSA9ICh0YWcsIG9wdGlvbnMsIG93bmVyLCBpc0NhbGxlZEZyb21GYWN0b3J5LCBub2RlKSAtPlxyXG4gIG5ldyBOb2RlKGNyZWF0ZUVsZW1lbnQgb3duZXIuZWxlbWVudCwgdGFnIG9yICdkaXYnLCBvcHRpb25zKVxyXG5cclxuXHJcbk9KLnJlZ2lzdGVyICdub2RlRmFjdG9yeScsIGdldE5vZGVGcm9tRmFjdG9yeVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnZXROb2RlRnJvbUZhY3RvcnlcclxuIl19
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
  if (setTimeout) {
    return setTimeout(method, waitMs);
  }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVudHJ5cG9pbnQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGFzeW5jXFxhamF4LmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxhc3luY1xccHJvbWlzZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcZ3JpZC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcaW5wdXRncm91cC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGFicy5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGlsZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29udHJvbHNcXGljb24uY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGRhdGUuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGZ1bmN0aW9uLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxudW1iZXIuY29mZmVlIiwic3JjL2NvZmZlZS9jb3JlL29iamVjdC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxccHJvcGVydHkuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXHN0cmluZy5jb2ZmZWUiLCJzcmMvY29mZmVlL2RvbS9ib2R5LmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxkb21cXGNvbXBvbmVudC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxjb250cm9sLmNvZmZlZSIsInNyYy9jb2ZmZWUvZG9tL2VsZW1lbnQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZnJhZ21lbnQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZ2VuZXJpY3MuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcaW5wdXQuY29mZmVlIiwic3JjL2NvZmZlZS9kb20vbm9kZS5jb2ZmZWUiLCJzcmMvY29mZmVlL2RvbS9ub2RlRmFjdG9yeS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGEuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxici5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGZvcm0uY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxpbnB1dC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXG9sLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcc2VsZWN0LmNvZmZlZSIsInNyYy9jb2ZmZWUvZWxlbWVudHMvdGFibGUuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0ZXh0YXJlYS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHRoZWFkLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdWwuY29mZmVlIiwic3JjL2NvZmZlZS9nbG9iYWwuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcYnV0dG9uaW5wdXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcY2hlY2tib3guY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcY29sb3IuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxkYXRldGltZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxkYXRldGltZWxvY2FsLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGVtYWlsLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGZpbGUuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcaGlkZGVuLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGltYWdlaW5wdXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcbW9udGguY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcbnVtYmVyLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHBhc3N3b3JkLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJhZGlvLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJhbmdlLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJlc2V0LmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHNlYXJjaC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxzdWJtaXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdGVsLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHRleHRpbnB1dC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx0aW1lLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHVybC5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx3ZWVrLmNvZmZlZSIsInNyYy9jb2ZmZWUvb2ouY29mZmVlIiwic3JjL2NvZmZlZS9vakluaXQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxKc29uVG9UYWJsZS5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGFycmF5MkQuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxjb25zb2xlLmNvZmZlZSIsInNyYy9jb2ZmZWUvdG9vbHMvY29va2llLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZGVmZXIuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlYWNoLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZW51bXMuY29mZmVlIiwiQzpcXHBhY2thZ2VzXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxoaXN0b3J5LmNvZmZlZSIsInNyYy9jb2ZmZWUvdG9vbHMvaXMuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy9ub3R5LmNvZmZlZSIsInNyYy9jb2ZmZWUvdG9vbHMvcHVic3ViLmNvZmZlZSIsIkM6XFxwYWNrYWdlc1xcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xccXVlcnlTdHJpbmcuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy9yYW5nZXMuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy90by5jb2ZmZWUiLCJDOlxccGFja2FnZXNcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHV1aWQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsT0FBQSxDQUFRLE1BQVI7O0FBQ0EsT0FBQSxDQUFRLFVBQVI7O0FBQ0EsT0FBQSxDQUFRLGNBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEseUJBQVI7O0FBQ0EsT0FBQSxDQUFRLG1CQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGFBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsWUFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGVBQVI7O0FBQ0EsT0FBQSxDQUFRLFlBQVI7O0FBQ0EsT0FBQSxDQUFRLGVBQVI7O0FBQ0EsT0FBQSxDQUFRLGdCQUFSOztBQUNBLE9BQUEsQ0FBUSxnQkFBUjs7QUFDQSxPQUFBLENBQVEsYUFBUjs7QUFDQSxPQUFBLENBQVEsY0FBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGtCQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsa0JBQVI7O0FBQ0EsT0FBQSxDQUFRLHFCQUFSOztBQUNBLE9BQUEsQ0FBUSxr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LE9BQVAsR0FBaUI7Ozs7O0FDYmpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOzs7QUFFTDs7OztBQUdBLFdBQUEsR0FBYyxTQUFDLEtBQUQ7QUFDWixNQUFBO0VBQUEsR0FBQSxHQUFNO0VBRU4sSUFBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQWI7SUFDRSxNQUFBLEdBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQTFCLENBQWlDLENBQWpDLENBQW1DLENBQUMsS0FBcEMsQ0FBMEMsR0FBMUM7SUFDVixJQUFHLE1BQUg7TUFDRSxDQUFBLEdBQUk7QUFDSixhQUFNLENBQUEsR0FBSSxNQUFNLENBQUMsTUFBakI7UUFDRSxHQUFBLEdBQU0sTUFBTyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQVYsQ0FBZ0IsR0FBaEI7UUFDTixJQUFHLEdBQUcsQ0FBQyxNQUFKLEtBQWMsQ0FBakI7VUFDRSxHQUFJLENBQUEsR0FBSSxDQUFBLENBQUEsQ0FBSixDQUFKLEdBQWMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBVixDQUE2QixHQUFJLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBUCxDQUFlLEtBQWYsRUFBc0IsR0FBdEIsQ0FBN0IsRUFEaEI7O1FBRUEsQ0FBQSxJQUFLO01BSlAsQ0FGRjtLQUZGOztTQVNBO0FBWlk7O0FBY2QsRUFBRSxDQUFDLFFBQUgsQ0FBWSxhQUFaLEVBQTBCLFdBQTFCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7OztBQ3BCakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOzs7QUFFTDs7Ozs7O0FBS0EsY0FBQSxHQUFpQixTQUFBO0FBSWYsTUFBQTtFQUFBLENBQUEsR0FBSTtFQUNKLENBQUMsQ0FBQyxNQUFGLEdBQVc7RUFDWCxTQUFBLEdBQVk7RUFDWixDQUFBLEdBQUk7QUFFSixTQUFNLENBQUEsR0FBSSxFQUFWO0lBQ0UsQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPLFNBQVMsQ0FBQyxNQUFWLENBQWlCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLElBQTNCLENBQWpCLEVBQW1ELENBQW5EO0lBQ1AsQ0FBQSxJQUFLO0VBRlA7RUFHQSxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVE7RUFDUixDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsQ0FBQyxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsR0FBVCxDQUFBLEdBQWdCLEdBQWpDLEVBQXNDLENBQXRDO0VBQ1IsQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRO0VBQy9CLElBQUEsR0FBTyxDQUFDLENBQUMsSUFBRixDQUFPLEVBQVA7U0FDUDtBQWhCZTs7QUFrQmpCLEVBQUUsQ0FBQyxRQUFILENBQVksWUFBWixFQUEwQixjQUExQjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlICcuL29qJ1xyXG5yZXF1aXJlICcuL29qSW5pdCdcclxucmVxdWlyZSAnLi9hc3luYy9hamF4J1xyXG5yZXF1aXJlICcuL2FzeW5jL3Byb21pc2UnXHJcbnJlcXVpcmUgJy4vY29tcG9uZW50cy9ncmlkJ1xyXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvaW5wdXRncm91cCdcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL3RhYnMnXHJcbnJlcXVpcmUgJy4vY29tcG9uZW50cy90aWxlJ1xyXG5yZXF1aXJlICcuL2NvbnRyb2xzL2ljb24nXHJcbnJlcXVpcmUgJy4vY29yZS9kYXRlJ1xyXG5yZXF1aXJlICcuL2NvcmUvZnVuY3Rpb24nXHJcbnJlcXVpcmUgJy4vY29yZS9udW1iZXInXHJcbnJlcXVpcmUgJy4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4vY29yZS9zdHJpbmcnXHJcbnJlcXVpcmUgJy4vZG9tL25vZGVGYWN0b3J5J1xyXG5yZXF1aXJlICcuL2RvbS9ib2R5J1xyXG5yZXF1aXJlICcuL2RvbS9jb21wb25lbnQnXHJcbnJlcXVpcmUgJy4vZG9tL2NvbnRyb2wnXHJcbnJlcXVpcmUgJy4vZG9tL25vZGUnXHJcbnJlcXVpcmUgJy4vZG9tL2VsZW1lbnQnXHJcbnJlcXVpcmUgJy4vZG9tL2ZyYWdtZW50J1xyXG5yZXF1aXJlICcuL2RvbS9nZW5lcmljcydcclxucmVxdWlyZSAnLi9kb20vaW5wdXQnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvYSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy9icidcclxucmVxdWlyZSAnLi9lbGVtZW50cy9mb3JtJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2lucHV0J1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL29sJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3NlbGVjdCdcclxucmVxdWlyZSAnLi9lbGVtZW50cy90YWJsZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy90ZXh0YXJlYSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy90aGVhZCdcclxucmVxdWlyZSAnLi9lbGVtZW50cy91bCdcclxucmVxdWlyZSAnLi9pbnB1dHMvYnV0dG9uaW5wdXQnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2NoZWNrYm94J1xyXG5yZXF1aXJlICcuL2lucHV0cy9jb2xvcidcclxucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZXRpbWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2RhdGV0aW1lbG9jYWwnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2VtYWlsJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9maWxlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9oaWRkZW4nXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2ltYWdlaW5wdXQnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL21vbnRoJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9udW1iZXInXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3Bhc3N3b3JkJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9yYWRpbydcclxucmVxdWlyZSAnLi9pbnB1dHMvcmFuZ2UnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3Jlc2V0J1xyXG5yZXF1aXJlICcuL2lucHV0cy9zZWFyY2gnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3N1Ym1pdCdcclxucmVxdWlyZSAnLi9pbnB1dHMvdGVsJ1xyXG5yZXF1aXJlICcuL2lucHV0cy90ZXh0aW5wdXQnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3RpbWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3VybCdcclxucmVxdWlyZSAnLi9pbnB1dHMvd2VlaydcclxucmVxdWlyZSAnLi90b29scy9hcnJheTJEJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2NvbnNvbGUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvY29va2llJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2RlZmVyJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2VhY2gnXHJcbnJlcXVpcmUgJy4vdG9vbHMvZW51bXMnXHJcbnJlcXVpcmUgJy4vdG9vbHMvaGlzdG9yeSdcclxucmVxdWlyZSAnLi90b29scy9pcydcclxucmVxdWlyZSAnLi90b29scy9ub3R5J1xyXG5yZXF1aXJlICcuL3Rvb2xzL3B1YnN1YidcclxucmVxdWlyZSAnLi90b29scy9xdWVyeVN0cmluZydcclxucmVxdWlyZSAnLi90b29scy9yYW5nZXMnXHJcbnJlcXVpcmUgJy4vdG9vbHMvdG8nXHJcbnJlcXVpcmUgJy4vdG9vbHMvdXVpZCdcclxuIiwiIyAjIGFqYXhcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG5jb25maWcgPSB7fVxyXG4gIFxyXG4jIGRlZmluZSBhIHN0YW5kYXJkIG9uIHN1Y2Nlc3MgaGFuZGxlciwgd3JpdGUgb3V0IHRoZSByZXF1ZXN0IHN0YXRzIHRvIGEgdGFibGVcclxuY29uZmlnLm9uU3VjY2VzcyA9IChvcHRzLCBkYXRhLCB1cmwpIC0+XHJcbiAgcmVzcG9uc2UgPSB7fVxyXG4gIE9KLmV4dGVuZCByZXNwb25zZSwgZGF0YVxyXG4gIG9wdHMub25TdWNjZXNzIHJlc3BvbnNlXHJcbiAgaWYgT0ouTE9HX0FMTF9BSkFYXHJcbiAgICBPSi5jb25zb2xlLnRhYmxlIFtcclxuICAgICAgV2Vic2VydmljZTogb3B0cy5hamF4T3B0cy51cmxcclxuICAgICAgU3RhcnRUaW1lOiBvcHRzLnN0YXJ0VGltZVxyXG4gICAgICBFbmRUaW1lOiBuZXcgRGF0ZSgpXHJcbiAgICBdIFxyXG4gIHJldHVyblxyXG4gIFxyXG4jIGRlZmluZSBhIHN0YW5kYXJkIG9uIGVycm9yIGhhbmRsZXIsIHdyaXRlIG91dCB0aGUgcmVxdWVzdCBlcnJvciBjb25leHQgdG8gYSB0YWJsZVxyXG5jb25maWcub25FcnJvciA9ICh4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cywgcGFyYW0xLCBvcHRzID0gT0oub2JqZWN0KCkpIC0+XHJcbiAgaWYgdGV4dFN0YXR1cyBpc250ICdhYm9ydCdcclxuICAgIGlmIE9KLkxPR19BTExfQUpBWF9FUlJPUlNcclxuICAgICAgT0ouY29uc29sZS50YWJsZSBbXHJcbiAgICAgICAgV2Vic2VydmljZTogb3B0cy5hamF4T3B0cy51cmxcclxuICAgICAgICBEYXRhOiBvcHRzLmFqYXhPcHRzLmRhdGFcclxuICAgICAgICBGYWlsZWQ6IHRleHRTdGF0dXNcclxuICAgICAgICBTdGF0ZTogeG1sSHR0cFJlcXVlc3Quc3RhdGUoKVxyXG4gICAgICAgIFN0YXR1czogeG1sSHR0cFJlcXVlc3Quc3RhdHVzXHJcbiAgICAgICAgU3RhdHVzVGV4dDogeG1sSHR0cFJlcXVlc3Quc3RhdHVzVGV4dFxyXG4gICAgICAgIFJlYWR5U3RhdGU6IHhtbEh0dHBSZXF1ZXN0LnJlYWR5U3RhdGVcclxuICAgICAgICBSZXNwb25zZVRleHQ6IHhtbEh0dHBSZXF1ZXN0LnJlc3BvbnNlVGV4dFxyXG4gICAgICBdXHJcblxyXG4gICAgb3B0cy5vbkVycm9yIHRleHRTdGF0dXNcclxuICByZXR1cm5cclxuICBcclxuIyBpbiB0aGUgY2FzZSB3aGVyZSBgb3B0c2AgaXMgYSBzdHJpbmcsIGNvbnZlcnQgaXQgdG8gYW4gb2JqZWN0XHJcbm9wdHNGcm9tVXJsID0gKG9wdHMpIC0+XHJcbiAgaWYgT0ouaXMuc3RyaW5nIG9wdHNcclxuICAgIHVybCA9IG9wdHNcclxuICAgIG9wdHMgPSBPSi5vYmplY3QoKVxyXG4gICAgb3B0cy5hZGQgJ2FqYXhPcHRzJywgT0oub2JqZWN0KClcclxuICAgIG9wdHMuYWpheE9wdHMuYWRkICd1cmwnLCB1cmxcclxuICBvcHRzXHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgYGV4ZWNgIG1ldGhvZCB0byBoYW5kbGUgYWxsIHJlcXVlc3QgdmVyYnMuIFVzZXMgdGhlIFtqUXVlcnkuYWpheF0oaHR0cDovL2FwaS5qcXVlcnkuY29tL2NhdGVnb3J5L2FqYXgvKSBBUEkuXHJcbiMgYGV4ZWNSZXF1ZXN0YCByZXR1cm5zIGEgcHJvbWlzZSByZXByZXNlbnQgdGhlIGFjdHVhbCBBSkFYIGNhbGwuXHJcbiAgXHJcbiMgLSBgdmVyYmAgZGVmYXVsdCB2YWx1ZSA9ICdHRVQnXHJcbiMgLSBgb3B0c2Agb2JqZWN0XHJcbiMgLS0gYG9wdHMuYWpheE9wdHNgIG9iamVjdCBmb3IgYWxsIGpRdWVyeSdzIGFqYXgtc3BlY2lmaWMgcHJvcGVydGllcy5cclxuY29uZmlnLmV4ZWNSZXF1ZXN0ID0gKHZlcmIgPSAnR0VUJywgb3B0cykgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBhamF4T3B0czpcclxuICAgICAgdXJsOiAnJ1xyXG4gICAgICBkYXRhOiB7fVxyXG4gICAgICB0eXBlOiB2ZXJiXHJcbiAgICAgIHhockZpZWxkczpcclxuICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgZGF0YVR5cGU6ICdqc29uJ1xyXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcbiAgICAgICAgXHJcbiAgICBvblN1Y2Nlc3M6IE9KLm5vb3BcclxuICAgIG9uRXJyb3I6IE9KLm5vb3BcclxuICAgIG9uQ29tcGxldGU6IE9KLm5vb3BcclxuICAgIG92ZXJyaWRlRXJyb3I6IGZhbHNlXHJcbiAgICB3YXRjaEdsb2JhbDogdHJ1ZVxyXG4gICAgdXNlQ2FjaGU6IGZhbHNlXHJcbiAgICBcclxuICBvcHRzID0gb3B0c0Zyb21Vcmwgb3B0c1xyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0cywgdHJ1ZVxyXG4gICAgXHJcbiAgZGVmYXVsdHMuc3RhcnRUaW1lID0gbmV3IERhdGUoKVxyXG4gICAgXHJcbiAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgIyBHRVQgcmVxdWVzdHMgZXhwZWN0IHF1ZXJ5U3RyaW5nIHBhcmFtZXRlcnNcclxuICAgIGlmIGRlZmF1bHRzLmFqYXhPcHRzLnZlcmIgaXMgJ0dFVCdcclxuICAgICAgZGVmYXVsdHMuYWpheE9wdHMuZGF0YSA9IE9KLnBhcmFtcyBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXHJcbiAgICAjIGFsbCBvdGhlciByZXF1ZXN0cyB0YWtlIGFuIG9iamVjdFxyXG4gICAgZWxzZVxyXG4gICAgICBkZWZhdWx0cy5hamF4T3B0cy5kYXRhID0gT0ouc2VyaWFsaXplIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcclxuICAgIFxyXG4gIGdldEpRdWVyeURlZmVycmVkID0gKHdhdGNoR2xvYmFsKSAtPlxyXG4gICAgcmV0ID0gJC5hamF4IGRlZmF1bHRzLmFqYXhPcHRzXHJcbiAgICAgIFxyXG4gICAgcmV0LmRvbmUgKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSAtPlxyXG4gICAgICBjb25maWcub25TdWNjZXNzIGRlZmF1bHRzLCBkYXRhXHJcblxyXG4gICAgcmV0LmZhaWwgKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRleHQpIC0+XHJcbiAgICAgIGNvbmZpZy5vbkVycm9yIGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRleHQsIGRlZmF1bHRzXHJcbiAgXHJcbiAgICByZXQuYWx3YXlzICh4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cykgLT5cclxuICAgICAgZGVmYXVsdHMub25Db21wbGV0ZSB4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1c1xyXG5cclxuICAgIE9KLmFzeW5jLmFqYXhQcm9taXNlIHJldFxyXG5cclxuICBwcm9taXNlID0gZ2V0SlF1ZXJ5RGVmZXJyZWQoZGVmYXVsdHMud2F0Y2hHbG9iYWwpXHJcbiAgcHJvbWlzZVxyXG4gIFxyXG5hamF4ID0ge31cclxuICBcclxuIyAjIyBwb3N0XHJcbiMgW09KXShvai5odG1sKS5hamF4LnBvc3Q6IGluc2VydCBhIG5ldyBvYmplY3Qgb3IgaW5pdCBhIGZvcm0gcG9zdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuIFxyXG5hamF4LnBvc3QgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ1BPU1QnLCBvcHRzXHJcbiAgXHJcbiMgIyMgZ2V0XHJcbiMgW09KXShvai5odG1sKS5hamF4LmdldDogZ2V0IGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbiNcclxuYWpheC5nZXQgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ0dFVCcsIG9wdHNcclxuXHJcbiMgIyMgZGVsZXRlXHJcbiMgW09KXShvai5odG1sKS5hamF4LmRlbGV0ZTogZGVsZXRlIGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbmFqYXguZGVsZXRlID0gKG9wdHMpIC0+XHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdERUxFVEUnLCBvcHRzXHJcblxyXG4jICMjIHB1dFxyXG4jIFtPSl0ob2ouaHRtbCkuYWpheC5wdXQ6IHVwZGF0ZSBhbiBleGlzdGluZyBvYmplY3RcclxuICBcclxuIyAtIGBvcHRzYCBjYW4gYmUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgcmVxdWVzdC5cclxuIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxyXG5hamF4LnB1dCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnUFVUJywgb3B0c1xyXG5cclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2FqYXgnLCBhamF4XHJcbm1vZHVsZS5leHBvcnRzID0gYWpheCIsIiMgIyBwcm9taXNlXHJcblxyXG5PSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuIyAjIyBhamF4UHJvbWlzZVxyXG4jIFtPSl0ob2ouaHRtbCkuYXN5bmMuYWpheFByb21pc2UgY29udmVydHMgYW4gQUpBWCBYbWxIdHRwUmVxdWVzdCBpbnRvIGEgUHJvbWlzZS4gXHJcbiMgU2VlIGFsc28gW1Byb21pc2UucmVzb2x2ZV0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG5hamF4UHJvbWlzZSA9IChhamF4KSAtPiBcclxuICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlIGFqYXhcclxuICBwcm9taXNlLmFib3J0ID0gYWpheC5hYm9ydFxyXG4gIHByb21pc2UucmVhZHlTdGF0ZSA9IGFqYXgucmVhZHlTdGF0ZVxyXG4gIHByb21pc2VcclxuXHJcbiMgIyMgYWxsXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5hbGwgdGFrZXMgYW4gYXJyYXkgb2YgZnVuY3Rpb25zIGFuZCByZXR1cm5zIGEgcHJvbWlzZSByZXByZXNlbnRpbmcgdGhlIHN1Y2Nlc3Mgb2YgYWxsIG1ldGhvZHMgb3IgdGhlIGZhaWx1cmUgb2YgYW55IG1ldGhvZC5cclxuIyBTZWUgYWxzbyBbUHJvbWlzZS5hbGxdKGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvYmxvYi9tYXN0ZXIvQVBJLm1kKS5cclxuYWxsID0gKGluaXRBcnJheSkgLT5cclxuICByZXFzID0gaW5pdEFycmF5IG9yIFtdXHJcbiAgcHJvbWlzZSA9IFByb21pc2UuYWxsKHJlcXMpXHJcbiAgcHJvbWlzZS5wdXNoID0gKGl0ZW0pIC0+XHJcbiAgICByZXFzLnB1c2ggaXRlbVxyXG4gICAgcmV0dXJuXHJcbiAgcHJvbWlzZVxyXG5cclxuIyAjIyBkZWZlclxyXG4jIFtPSl0ob2ouaHRtbCkuYXN5bmMuZGVmZXIgY29udmVydHMgYSBmdW5jdGlvbiBpbnRvIGEgUHJvbWlzZSB0byBleGVjdXRlIHRoYXQgZnVuY3Rpb24uIFxyXG4jIFNlZSBhbHNvIFtQcm9taXNlLm1ldGhvZF0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG5kZWZyID0gKGZ1bmMgPSBPSi5ub29wKSAtPlxyXG4gIHJldCA9IFByb21pc2UubWV0aG9kIGZ1bmNcclxuICByZXRcclxuICBcclxuICBcclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2RlZmVyJywgZGVmclxyXG5PSi5hc3luYy5yZWdpc3RlciAnYWxsJywgYWxsXHJcbk9KLmFzeW5jLnJlZ2lzdGVyICdhamF4UHJvbWlzZScsIGFqYXhQcm9taXNlXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbiAgZGVmZXI6IGRlZnJcclxuICBhbGw6IGFsbFxyXG4gIGFqYXhQcm9taXNlOiBhamF4UHJvbWlzZVxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9vakluaXQnXHJcbmNvbXBvbmVudCA9IHJlcXVpcmUgJy4uL2RvbS9jb21wb25lbnQnXHJcbmFycmF5MkQgPSByZXF1aXJlICcuLi90b29scy9hcnJheTJEJ1xyXG5cclxubm9kZU5hbWUgPSAneC1ncmlkJ1xyXG5jbGFzc05hbWUgPSAnZ3JpZCdcclxuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxyXG5cclxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgdGlsZVNpemVzOlxyXG4gICAgICBzbWFsbFNwYW46ICcnXHJcbiAgICAgIG1lZGl1bVNwYW46ICcnXHJcbiAgICAgIGxhcmdlU3BhbjogJydcclxuICAgIHByb3BzOlxyXG4gICAgICBjbGFzczogJ2dyaWQnXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IGNvbXBvbmVudCBkZWZhdWx0cywgb3duZXIsIG5vZGVOYW1lXHJcblxyXG4gIHJvd3MgPSBbXVxyXG4gIHRpbGVzID0gYXJyYXkyRCgpXHJcblxyXG4gIGZpbGxNaXNzaW5nID0gKCkgLT5cclxuICAgIHRpbGVzLmVhY2ggKHJvd05vLCBjb2xObywgdmFsKSAtPlxyXG4gICAgICBpZiBub3QgdmFsXHJcbiAgICAgICAgcm93ID0gcmV0LnJvdyByb3dOb1xyXG4gICAgICAgIHJvdy5tYWtlICd0aWxlJywgY29sTm8sIHt9XHJcblxyXG4gIHJldC5hZGQgJ3JvdycsIChyb3dObyA9IHJvd3MubGVuZ3RoLTEgb3IgMSktPlxyXG4gICAgbnVSb3cgPSByb3dzW3Jvd05vLTFdXHJcbiAgICBpZiBub3QgbnVSb3dcclxuICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xyXG4gICAgICAgIG51Um93ID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ3JvdydcclxuICAgICAgICByb3dzLnB1c2ggbnVSb3dcclxuICAgICAgbnVSb3cuYWRkICd0aWxlJywgKGNvbE5vLCBvcHRzKSAtPlxyXG4gICAgICAgIG9wdHMgPSBPSi5leHRlbmQgKE9KLmV4dGVuZCB7fSwgZGVmYXVsdHMudGlsZVNpemVzKSwgb3B0c1xyXG4gICAgICAgIG51VGlsZSA9IE9KLmNvbXBvbmVudHMudGlsZSBvcHRzLCBudVJvd1xyXG4gICAgICAgIHRpbGVzLnNldCByb3dObywgY29sTm8sIG51VGlsZVxyXG4gICAgICAgIG51VGlsZVxyXG4gICAgbnVSb3dcclxuXHJcbiAgcmV0LmFkZCAndGlsZScsIChyb3dObywgY29sTm8sIG9wdHMpIC0+XHJcbiAgICBpZiBub3Qgcm93Tm8gb3Igcm93Tm8gPCAxIHRoZW4gcm93Tm8gPSAxXHJcbiAgICBpZiBub3QgY29sTm8gb3IgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXHJcblxyXG4gICAgcm93ID0gcmV0LnJvdyByb3dOb1xyXG4gICAgdGlsZSA9IHRpbGVzLmdldCByb3dObywgY29sTm9cclxuXHJcbiAgICBpZiBub3QgdGlsZVxyXG4gICAgICBpID0gMFxyXG4gICAgICB3aGlsZSBpIDwgY29sTm9cclxuICAgICAgICBpICs9IDFcclxuICAgICAgICB0cnlUaWxlID0gdGlsZXMuZ2V0IHJvd05vLCBpXHJcbiAgICAgICAgaWYgbm90IHRyeVRpbGVcclxuICAgICAgICAgIGlmIGkgaXMgY29sTm9cclxuICAgICAgICAgICAgdGlsZSA9IHJvdy5tYWtlICd0aWxlJywgb3B0c1xyXG4gICAgICAgICAgZWxzZSBpZiBub3QgdGlsZVxyXG4gICAgICAgICAgICByb3cubWFrZSAndGlsZSdcclxuXHJcbiAgICBmaWxsTWlzc2luZygpXHJcbiAgICB0aWxlXHJcblxyXG4gIHJldFxyXG5cclxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XHJcbm1vZHVsZS5leHBvcnRzID0gY21wbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9vakluaXQnXHJcbmNvbXBvbmVudCA9IHJlcXVpcmUgJy4uL2RvbS9jb21wb25lbnQnXHJcbnV1aWQgPSByZXF1aXJlICcuLi90b29scy91dWlkJ1xyXG5cclxubm9kZU5hbWUgPSAneC1pbnB1dC1ncm91cCdcclxuY2xhc3NOYW1lID0gJ2lucHV0Z3JvdXAnXHJcblxyXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXHJcblxyXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cclxuICBmb3JJZCA9IHV1aWQoKVxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBjbGFzczogJ2Zvcm0tZ3JvdXAnXHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNoYW5nZTogT0oubm9vcFxyXG4gICAgZm9yOiBmb3JJZFxyXG4gICAgbGFiZWxUZXh0OiAnJ1xyXG4gICAgaW5wdXRPcHRzOlxyXG4gICAgICBwcm9wczpcclxuICAgICAgICBpZDogZm9ySWRcclxuICAgICAgICB0eXBlOiAndGV4dCdcclxuICAgICAgICBjbGFzczogJydcclxuICAgICAgICBwbGFjZWhvbGRlcjogJydcclxuICAgICAgICB2YWx1ZTogJydcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcclxuXHJcbiAgZ3JvdXAgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAnZm9ybS1ncm91cCdcclxuXHJcbiAgcmV0Lmdyb3VwTGFiZWwgPSBncm91cC5tYWtlICdsYWJlbCcsIHByb3BzOiB7IGZvcjogZm9ySWQgfSwgdGV4dDogZGVmYXVsdHMubGFiZWxUZXh0XHJcblxyXG4gIGRlZmF1bHRzLmlucHV0T3B0cy5wcm9wcy5jbGFzcyArPSAnIGZvcm0tY29udHJvbCdcclxuICByZXQuZ3JvdXBJbnB1dCA9IGdyb3VwLm1ha2UgJ2lucHV0JywgZGVmYXVsdHMuaW5wdXRPcHRzXHJcblxyXG4gIHJldC5ncm91cFZhbHVlID0gKCkgLT5cclxuICAgIHJldC5ncm91cElucHV0LnZhbCgpXHJcblxyXG4gIHJldFxyXG5cclxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XHJcbm1vZHVsZS5leHBvcnRzID0gY21wbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9vakluaXQnXHJcbmNvbXBvbmVudCA9IHJlcXVpcmUgJy4uL2RvbS9jb21wb25lbnQnXHJcblxyXG5ub2RlTmFtZSA9ICd4LXRhYnMnXHJcbmNsYXNzTmFtZSA9ICd0YWJzJ1xyXG5cclxuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxyXG5cclxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgdGFiczoge31cclxuICAgIHByb3BzOlxyXG4gICAgICBjbGFzczogJydcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcclxuXHJcbiAgdGFicyA9IHJldC5tYWtlICd1bCcsIHByb3BzOiBjbGFzczogJ25hdiBuYXYtdGFicydcclxuICBjb250ZW50ID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ3RhYi1jb250ZW50J1xyXG5cclxuICBmaXJzdCA9IHRydWVcclxuICBPSi5lYWNoIGRlZmF1bHRzLnRhYnMsICh0YWJWYWwsIHRhYk5hbWUpIC0+XHJcbiAgICB0YWJDbGFzcyA9ICcnXHJcbiAgICBpZiBmaXJzdFxyXG4gICAgICBmaXJzdCA9IGZhbHNlXHJcbiAgICAgIHRhYkNsYXNzID0gJ2FjdGl2ZSdcclxuICAgIGEgPSB0YWJzLm1ha2UgJ2xpJywgcHJvcHM6IGNsYXNzOiB0YWJDbGFzc1xyXG4gICAgICAubWFrZSgnYScsXHJcbiAgICAgICAgdGV4dDogdGFiTmFtZVxyXG4gICAgICAgIHByb3BzOlxyXG4gICAgICAgICAgaHJlZjogJyMnICsgdGFiTmFtZVxyXG4gICAgICAgICAgJ2RhdGEtdG9nZ2xlJzogJ3RhYidcclxuICAgICAgICBldmVudHM6XHJcbiAgICAgICAgICBjbGljazogLT5cclxuICAgICAgICAgICAgYS4kLnRhYiAnc2hvdycpXHJcblxyXG4gICAgdGFiQ29udGVudENsYXNzID0gJ3RhYi1wYW5lICcgKyB0YWJDbGFzc1xyXG4gICAgcmV0LmFkZCB0YWJOYW1lLCBjb250ZW50Lm1ha2UoJ2RpdicsIHByb3BzOiBjbGFzczogdGFiQ29udGVudENsYXNzLCBpZDogdGFiTmFtZSlcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcclxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcclxuXHJcbm5vZGVOYW1lID0gJ3gtdGlsZSdcclxuY2xhc3NOYW1lID0gJ3RpbGUnXHJcblxyXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXHJcbiAgXHJcbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxyXG4gIGRlZmF1bHRzID1cclxuICAgIHdpZHRoOlxyXG4gICAgICB4czogJydcclxuICAgICAgc206ICcnXHJcbiAgICAgIG1kOiAnJ1xyXG4gICAgICBsZzogJydcclxuICAgIHByb3BzOlxyXG4gICAgICBjbGFzczogJ3RpbGUnXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIGlmIGRlZmF1bHRzLndpZHRoLnhzIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wteHMtJyArIGRlZmF1bHRzLndpZHRoLnhzXHJcbiAgaWYgZGVmYXVsdHMud2lkdGguc20gdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1zbS0nICsgZGVmYXVsdHMud2lkdGguc21cclxuICBpZiBkZWZhdWx0cy53aWR0aC5tZCB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLW1kLScgKyBkZWZhdWx0cy53aWR0aC5tZFxyXG4gIGlmIGRlZmF1bHRzLndpZHRoLmxnIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wtbGctJyArIGRlZmF1bHRzLndpZHRoLmxnXHJcblxyXG4gIHJldCA9IE9KLmNvbXBvbmVudCBkZWZhdWx0cywgb3duZXIsIG5vZGVOYW1lXHJcbiAgcmV0XHJcblxyXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcclxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxuY29udHJvbCA9IHJlcXVpcmUgJy4uL2RvbS9jb250cm9sJ1xyXG5cclxuY29udHJvbE5hbWUgPSAneS1pY29uJ1xyXG5mcmllbmRseU5hbWUgPSAnaWNvbidcclxuXHJcbk9KLmNvbnRyb2xzLm1lbWJlcnNbZnJpZW5kbHlOYW1lXSA9IGNvbnRyb2xOYW1lXHJcblxyXG5jbnRybCA9IChvcHRpb25zLCBvd25lcikgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBpY29uT3B0czpcclxuICAgICAgbmFtZTogJydcclxuICAgICAgc3RhY2tlZEljb246ICcnXHJcbiAgICAgIHN3YXBJY29uOiAnJ1xyXG4gICAgICBzaXplOiBmYWxzZVxyXG4gICAgICBjb2xvcjogJydcclxuICAgICAgbGlicmFyeTogJydcclxuICAgICAgaXNGaXhlZFdpZHRoOiBmYWxzZVxyXG4gICAgICBpc0xpc3Q6IGZhbHNlXHJcbiAgICAgIGlzU3Bpbm5lcjogZmFsc2VcclxuICAgIHByb3BzOlxyXG4gICAgICBjbGFzczogJydcclxuICAgIHJvb3ROb2RlVHlwZTogJ3NwYW4nXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9uc1xyXG4gIHJldCA9IGNvbnRyb2wgZGVmYXVsdHMsIG93bmVyLCBjb250cm9sTmFtZVxyXG5cclxuICBpc1RvZ2dsZWQgPSBmYWxzZVxyXG5cclxuICAjVE9ETzogU3VwcG9ydCBmb3IgcGljdG9pY29uc1xyXG4gICNUT0RPOiBTdXBwb3J0IGZvciBvdGhlciBGb250QXdlc29tZSBwcm9wZXJ0aWVzIChzdGFjaywgcm90YXRlLCBzaXplLCBldGMpXHJcblxyXG4gIGNsYXNzTmFtZUJhc2UgPSAnZmEgJ1xyXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzRml4ZWRXaWR0aCB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLWZ3ICdcclxuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc0xpc3QgdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1saSAnXHJcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuaXNTcGlubmVyIHRoZW4gY2xhc3NOYW1lQmFzZSArPSAnZmEtc3BpbiAnXHJcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZVxyXG4gICAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSA+IDEgYW5kIGRlZmF1bHRzLmljb25PcHRzLnNpemUgPD0gNVxyXG4gICAgICBjbGFzc05hbWVCYXNlICs9ICdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSArICd4ICdcclxuXHJcbiAgY2xhc3NOYW1lID0gY2xhc3NOYW1lQmFzZSArICdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMubmFtZVxyXG4gIHJldC5teUljb24gPSByZXQubWFrZSAnaScsIHByb3BzOiBjbGFzczogY2xhc3NOYW1lXHJcblxyXG4gICNUb2dnbGVzIGRpc3BsYXkgYmV0d2VlbiBub3JtYWwgaWNvbiBhbmQgc3dhcCBpY29uLCBpZiBhIHN3YXAgaWNvbiBoYXMgYmVlbiBzcGVjaWZpZWRcclxuICByZXQudG9nZ2xlSWNvbiA9IC0+XHJcbiAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zd2FwSWNvblxyXG4gICAgICBuZXdJY29uID0gZGVmYXVsdHMuaWNvbk9wdHMubmFtZVxyXG5cclxuICAgICAgaXNUb2dnbGVkID0gIWlzVG9nZ2xlZFxyXG5cclxuICAgICAgaWYgaXNUb2dnbGVkXHJcbiAgICAgICAgcmV0Lm15SWNvbi4kLnJlbW92ZUNsYXNzKCdmYS0nICsgbmV3SWNvbilcclxuICAgICAgICBuZXdJY29uID0gZGVmYXVsdHMuaWNvbk9wdHMuc3dhcEljb25cclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldC5teUljb24uJC5yZW1vdmVDbGFzcygnZmEtJyArIGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uKVxyXG5cclxuICAgICAgcmV0Lm15SWNvbi4kLmFkZENsYXNzKCdmYS0nICsgbmV3SWNvbilcclxuXHJcblxyXG4gIHJldFxyXG5cclxuT0ouY29udHJvbHMucmVnaXN0ZXIgZnJpZW5kbHlOYW1lLCBjbnRybFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNudHJsIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbmdldERhdGVGcm9tRG5Kc29uID0gKGRuRGF0ZSkgLT5cclxuICAgIFxyXG4gICMgVHJhbnNmb3JtcyBhIC5ORVQgSlNPTiBkYXRlIGludG8gYSBKYXZhU2NyaXB0IGRhdGUuXHJcbiAgIyBuYW1lPSdvYmonICBPYmplY3QgdG8gdGVzdFxyXG4gICMgdHlwZT0nQm9vbGVhbicgLz5cclxuICAjXHJcbiAgIyAgICAgICB2YXIgbWlsbGkgPSBPSi50by5udW1iZXIoRG5EYXRlLnJlcGxhY2UoL1xcL0RhdGVcXCgoXFxkKylcXC0/KFxcZCspXFwpXFwvLywgJyQxJykpO1xyXG4gICMgICAgICAgdmFyIG9mZnNldCA9IE9KLnRvLm51bWJlcihEbkRhdGUucmVwbGFjZSgvXFwvRGF0ZVxcKFxcZCsoW1xcK1xcLV0/XFxkKylcXClcXC8vLCAnJDEnKSk7XHJcbiAgIyAgICAgICB2YXIgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCk7XHJcbiAgIyAgICAgICByZXR1cm4gbmV3IERhdGUoKG1pbGxpIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKTtcclxuICAjICAgICAgIFxyXG4gICAgXHJcbiAgIyBEbiBEYXRlIHdpbGwgbG9vayBsaWtlIC9EYXRlKDEzMzU3NTg0MDAwMDAtMDQwMCkvICBcclxuICBkbkRhdGVTdHIgPSBPSi50by5zdHJpbmcoZG5EYXRlKVxyXG4gIHJldCA9IHVuZGVmaW5lZFxyXG4gIHRpY2tzID0gdW5kZWZpbmVkXHJcbiAgb2Zmc2V0ID0gdW5kZWZpbmVkXHJcbiAgbG9jYWxPZmZzZXQgPSB1bmRlZmluZWRcclxuICBhcnIgPSB1bmRlZmluZWRcclxuICByZXQgPSBPSi5kYXRlVGltZU1pblZhbHVlXHJcbiAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkoZG5EYXRlU3RyKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJy8nLCAnJylcclxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCdEYXRlJywgJycpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnKCcsICcnKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJyknLCAnJylcclxuICAgIGFyciA9IGRuRGF0ZVN0ci5zcGxpdCgnLScpXHJcbiAgICBpZiBhcnIubGVuZ3RoID4gMVxyXG4gICAgICB0aWNrcyA9IE9KLnRvLm51bWJlcihhcnJbMF0pXHJcbiAgICAgIG9mZnNldCA9IE9KLnRvLm51bWJlcihhcnJbMV0pXHJcbiAgICAgIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpXHJcbiAgICAgIHJldCA9IG5ldyBEYXRlKCh0aWNrcyAtICgobG9jYWxPZmZzZXQgKyAob2Zmc2V0IC8gMTAwICogNjApKSAqIDEwMDApKSlcclxuICAgIGVsc2UgaWYgYXJyLmxlbmd0aCBpcyAxXHJcbiAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcclxuICAgICAgcmV0ID0gbmV3IERhdGUodGlja3MpXHJcbiAgcmV0XHJcblxyXG4gIE9KLnJlZ2lzdGVyICdnZXREYXRlRnJvbURuSnNvbicsIGdldERhdGVGcm9tRG5Kc29uXHJcbiAgbW9kdWxlcy5leHBvcnRzID0gZ2V0RGF0ZUZyb21Ebkpzb25cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMgV3JhcCB0aGUgZXhlY3V0aW9uIG9mIGEgbWV0aG9kIGluIGEgdHJ5Li5jYXRjaC4uZmluYWxseSAgICAgXHJcbiMgaWdub3JlIGVycm9ycyBmYWlsaW5nIHRvIGV4ZWMgc2VsZi1leGVjdXRpbmcgZnVuY3Rpb25zIFxyXG4jIFJldHVybiBhIG1ldGhvZCB3cmFwcGVkIGluIGEgdHJ5Li5jYXRjaC4uZmluYWxseVxyXG50cnlFeGVjID0gKHRyeUZ1bmMpIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgcmV0ID0gZmFsc2VcclxuICB0aGF0ID0gdGhpc1xyXG4gIHRyeVxyXG4gICAgcmV0ID0gdHJ5RnVuYy5hcHBseSh0aGF0LCBBcnJheTo6c2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKSAgaWYgT0ouaXMubWV0aG9kKHRyeUZ1bmMpXHJcbiAgY2F0Y2ggZXhjZXB0aW9uXHJcbiAgICBpZiAoZXhjZXB0aW9uLm5hbWUgaXMgJ1R5cGVFcnJvcicgb3IgZXhjZXB0aW9uLnR5cGUgaXMgJ2NhbGxlZF9ub25fY2FsbGFibGUnKSBhbmQgZXhjZXB0aW9uLnR5cGUgaXMgJ25vbl9vYmplY3RfcHJvcGVydHlfbG9hZCdcclxuICAgICAgT0ouY29uc29sZS5pbmZvICdJZ25vcmluZyBleGNlcHRpb246ICcsIGV4Y2VwdGlvblxyXG4gICAgZWxzZVxyXG4gICAgICBPSi5jb25zb2xlLmVycm9yIGV4Y2VwdGlvblxyXG4gIGZpbmFsbHlcclxuXHJcbiAgcmV0XHJcblxyXG5cclxuIG1ldGhvZCA9ICh0cnlGdW5jKSAtPlxyXG4gICd1c2Ugc3RyaWN0J1xyXG4gIHRoYXQgPSB0aGlzXHJcbiAgLT5cclxuICAgIGFyZ3MgPSBBcnJheTo6c2xpY2UuY2FsbChhcmd1bWVudHMsIDApXHJcbiAgICBhcmdzLnVuc2hpZnQgdHJ5RnVuY1xyXG4gICAgT0oudHJ5RXhlYy5hcHBseSB0aGF0LCBhcmdzXHJcblxyXG4gIFxyXG4gXHJcbiBPSi5yZWdpc3RlciAnbWV0aG9kJywgbWV0aG9kXHJcbiBPSi5yZWdpc3RlciAndHJ5RXhlYycsIHRyeUV4ZWNcclxuIG1vZHVsZS5leHBvcnRzID1cclxuICBtZXRob2Q6IG1ldGhvZFxyXG4gIHRyeUV4ZWM6IHRyeUV4ZWNcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbm51bWJlciA9IE9iamVjdC5jcmVhdGUobnVsbClcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdpc05hTicsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuaXNOYU4pIHRoZW4gTnVtYmVyLmlzTmFOIGVsc2UgaXNOYU4pXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnaXNGaW5pdGUnLFxyXG4gIHZhbHVlOiAoaWYgKE51bWJlciBhbmQgTnVtYmVyLmlzRmluaXRlKSB0aGVuIE51bWJlci5pc0Zpbml0ZSBlbHNlIGlzRmluaXRlKVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ01BWF9WQUxVRScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuTUFYX1ZBTFVFKSB0aGVuIE51bWJlci5NQVhfVkFMVUUgZWxzZSAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOClcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdNSU5fVkFMVUUnLFxyXG4gIHZhbHVlOiAoaWYgKE51bWJlciBhbmQgTnVtYmVyLk1JTl9WQUxVRSkgdGhlbiBOdW1iZXIuTUlOX1ZBTFVFIGVsc2UgNWUtMzI0KVxyXG5cclxuT0oucmVnaXN0ZXIgJ251bWJlcicsIG51bWJlclxyXG5tb2R1bGUuZXhwb3J0cyA9IG51bWJlciIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciAkLCBPSiwgXywgZnVuYywgaXNNZXRob2QsIHByb3BlcnR5LCByZXRPYmosIHRvO1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbiQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cbl8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG5cbmlzTWV0aG9kID0gcmVxdWlyZSgnLi4vdG9vbHMvaXMnKTtcblxucHJvcGVydHkgPSByZXF1aXJlKCcuL3Byb3BlcnR5Jyk7XG5cbmZ1bmMgPSByZXF1aXJlKCcuL2Z1bmN0aW9uJyk7XG5cbnRvID0gcmVxdWlyZSgnLi4vdG9vbHMvdG8nKTtcblxucmV0T2JqID0ge1xuICBvYmplY3Q6IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkge1xuICAgICAgb2JqID0ge307XG4gICAgfVxuXG4gICAgLypcbiAgICBBZGQgYSBwcm9wZXJ0eSB0byB0aGUgb2JqZWN0IGFuZCByZXR1cm4gaXRcbiAgICAgKi9cbiAgICBvYmouYWRkID0gZnVuY3Rpb24obmFtZSwgdmFsKSB7XG4gICAgICBwcm9wZXJ0eShvYmosIG5hbWUsIHZhbCk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG4gICAgb2JqLmFkZCgnZWFjaCcsIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgZWFjaDtcbiAgICAgIGVhY2ggPSByZXF1aXJlKCcuLi90b29scy9lYWNoJyk7XG4gICAgICByZXR1cm4gZWFjaChvYmosIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgIGlmIChrZXkgIT09ICdlYWNoJyAmJiBrZXkgIT09ICdhZGQnKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHZhbCwga2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfSxcbiAgaXNJbnN0YW5jZU9mOiBmdW5jdGlvbihuYW1lLCBvYmopIHtcbiAgICByZXR1cm4gcmV0T2JqLmNvbnRhaW5zKG5hbWUsIG9iaikgJiYgdG8uYm9vbChvYmpbbmFtZV0pO1xuICB9LFxuICBjb250YWluczogZnVuY3Rpb24ob2JqZWN0LCBpbmRleCkge1xuICAgIHZhciByZXQ7XG4gICAgcmV0ID0gZmFsc2U7XG4gICAgaWYgKG9iamVjdCkge1xuICAgICAgcmV0ID0gXy5jb250YWlucyhvYmplY3QsIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSxcbiAgY29tcGFyZTogZnVuY3Rpb24ob2JqMSwgb2JqMikge1xuICAgIHJldHVybiBfLmlzRXF1YWwob2JqMSwgb2JqMik7XG4gIH0sXG4gIGNsb25lOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuIF8uY2xvbmVEZWVwKGRhdGEodHJ1ZSkpO1xuICB9LFxuICBzZXJpYWxpemU6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgcmV0O1xuICAgIHJldCA9ICcnO1xuICAgIGZ1bmMudHJ5RXhlYyhmdW5jdGlvbigpIHtcbiAgICAgIHJldCA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXQgfHwgJyc7XG4gIH0sXG4gIGRlc2VyaWFsaXplOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHJldDtcbiAgICByZXQgPSB7fTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgZnVuYy50cnlFeGVjKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXQgPSAkLnBhcnNlSlNPTihkYXRhKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGlzTWV0aG9kLm51bGxPckVtcHR5KHJldCkpIHtcbiAgICAgICAgcmV0ID0ge307XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH0sXG4gIHBhcmFtczogZnVuY3Rpb24oZGF0YSwgZGVsaW1pdGVyKSB7XG4gICAgdmFyIGVhY2gsIHJldDtcbiAgICBpZiAoZGVsaW1pdGVyID09IG51bGwpIHtcbiAgICAgIGRlbGltaXRlciA9ICcmJztcbiAgICB9XG4gICAgcmV0ID0gJyc7XG4gICAgaWYgKGRlbGltaXRlciA9PT0gJyYnKSB7XG4gICAgICBmdW5jLnRyeUV4ZWMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldCA9ICQucGFyYW0oZGF0YSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWFjaCA9IHJlcXVpcmUoJy4uL3Rvb2xzL2VhY2gnKTtcbiAgICAgIGVhY2goZGF0YSwgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHJldC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0ICs9IGRlbGltaXRlcjtcbiAgICAgICAgfVxuICAgICAgICByZXQgKz0ga2V5ICsgJz0nICsgdmFsO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0by5zdHJpbmcocmV0KTtcbiAgfSxcbiAgZXh0ZW5kOiBmdW5jdGlvbihkZXN0T2JqLCBzcmNPYmosIGRlZXBDb3B5KSB7XG4gICAgdmFyIHJldDtcbiAgICBpZiAoZGVlcENvcHkgPT0gbnVsbCkge1xuICAgICAgZGVlcENvcHkgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0ID0gZGVzdE9iaiB8fCB7fTtcbiAgICBpZiAoZGVlcENvcHkgPT09IHRydWUpIHtcbiAgICAgIHJldCA9ICQuZXh0ZW5kKGRlZXBDb3B5LCByZXQsIHNyY09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldCA9ICQuZXh0ZW5kKHJldCwgc3JjT2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxufTtcblxuT0oucmVnaXN0ZXIoJ29iamVjdCcsIHJldE9iai5vYmplY3QpO1xuXG5PSi5yZWdpc3RlcignaXNJbnN0YW5jZU9mJywgcmV0T2JqLmlzSW5zdGFuY2VPZik7XG5cbk9KLnJlZ2lzdGVyKCdjb250YWlucycsIHJldE9iai5jb250YWlucyk7XG5cbk9KLnJlZ2lzdGVyKCdjb21wYXJlJywgcmV0T2JqLmNvbXBhcmUpO1xuXG5PSi5yZWdpc3RlcignY2xvbmUnLCByZXRPYmouY2xvbmUpO1xuXG5PSi5yZWdpc3Rlcignc2VyaWFsaXplJywgcmV0T2JqLnNlcmlhbGl6ZSk7XG5cbk9KLnJlZ2lzdGVyKCdkZXNlcmlhbGl6ZScsIHJldE9iai5kZXNlcmlhbGl6ZSk7XG5cbk9KLnJlZ2lzdGVyKCdwYXJhbXMnLCByZXRPYmoucGFyYW1zKTtcblxuT0oucmVnaXN0ZXIoJ2V4dGVuZCcsIHJldE9iai5leHRlbmQpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJldE9iajtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRnhqYjNKbFhGeHZZbXBsWTNRdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFTeEpRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlEwb3NRMEZCUVN4SFFVRkpMRTlCUVVFc1EwRkJVU3hSUVVGU096dEJRVU5LTEZGQlFVRXNSMEZCVnl4UFFVRkJMRU5CUVZFc1lVRkJVanM3UVVGRFdDeFJRVUZCTEVkQlFWY3NUMEZCUVN4RFFVRlJMRmxCUVZJN08wRkJRMWdzU1VGQlFTeEhRVUZQTEU5QlFVRXNRMEZCVVN4WlFVRlNPenRCUVVOUUxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNZVUZCVWpzN1FVRkpUQ3hOUVVGQkxFZEJTVVU3UlVGQlFTeE5RVUZCTEVWQlFWRXNVMEZCUXl4SFFVRkVPenROUVVGRExFMUJRVTA3T3p0QlFVVmlPenM3U1VGSFFTeEhRVUZITEVOQlFVTXNSMEZCU2l4SFFVRlZMRk5CUVVNc1NVRkJSQ3hGUVVGUExFZEJRVkE3VFVGRFVpeFJRVUZCTEVOQlFWTXNSMEZCVkN4RlFVRmpMRWxCUVdRc1JVRkJiMElzUjBGQmNFSTdZVUZEUVR0SlFVWlJPMGxCU1ZZc1IwRkJSeXhEUVVGRExFZEJRVW9zUTBGQlVTeE5RVUZTTEVWQlFXZENMRk5CUVVNc1VVRkJSRHRCUVVOa0xGVkJRVUU3VFVGQlFTeEpRVUZCTEVkQlFVOHNUMEZCUVN4RFFVRlJMR1ZCUVZJN1lVRkRVQ3hKUVVGQkxFTkJRVXNzUjBGQlRDeEZRVUZWTEZOQlFVTXNSMEZCUkN4RlFVRk5MRWRCUVU0N1VVRkRVaXhKUVVGSExFZEJRVUVzUzBGQlV5eE5RVUZVTEVsQlFXOUNMRWRCUVVFc1MwRkJVeXhMUVVGb1F6dHBRa0ZEUlN4UlFVRkJMRU5CUVZNc1IwRkJWQ3hGUVVGakxFZEJRV1FzUlVGRVJqczdUVUZFVVN4RFFVRldPMGxCUm1Nc1EwRkJhRUk3VjBGTlFUdEZRV1pOTEVOQlFWSTdSVUZ2UWtFc1dVRkJRU3hGUVVGakxGTkJRVU1zU1VGQlJDeEZRVUZQTEVkQlFWQTdWMEZEV2l4TlFVRk5MRU5CUVVNc1VVRkJVQ3hEUVVGblFpeEpRVUZvUWl4RlFVRnpRaXhIUVVGMFFpeERRVUZCTEVsQlFTdENMRVZCUVVVc1EwRkJReXhKUVVGSUxFTkJRVkVzUjBGQlNTeERRVUZCTEVsQlFVRXNRMEZCV2p0RlFVUnVRaXhEUVhCQ1pEdEZRWGxDUVN4UlFVRkJMRVZCUVZVc1UwRkJReXhOUVVGRUxFVkJRVk1zUzBGQlZEdEJRVU5TTEZGQlFVRTdTVUZCUVN4SFFVRkJMRWRCUVUwN1NVRkRUaXhKUVVGSExFMUJRVWc3VFVGRFJTeEhRVUZCTEVkQlFVMHNRMEZCUXl4RFFVRkRMRkZCUVVZc1EwRkJWeXhOUVVGWUxFVkJRVzFDTEV0QlFXNUNMRVZCUkZJN08xZEJSVUU3UlVGS1VTeERRWHBDVmp0RlFXbERRU3hQUVVGQkxFVkJRVk1zVTBGQlF5eEpRVUZFTEVWQlFVOHNTVUZCVUR0WFFVTlFMRU5CUVVNc1EwRkJReXhQUVVGR0xFTkJRVlVzU1VGQlZpeEZRVUZuUWl4SlFVRm9RanRGUVVSUExFTkJha05VTzBWQmMwTkJMRXRCUVVFc1JVRkJUeXhUUVVGRExFbEJRVVE3VjBGRFRDeERRVUZETEVOQlFVTXNVMEZCUml4RFFVRlpMRWxCUVVFc1EwRkJTeXhKUVVGTUxFTkJRVm83UlVGRVN5eERRWFJEVUR0RlFUSkRRU3hUUVVGQkxFVkJRVmNzVTBGQlF5eEpRVUZFTzBGQlExUXNVVUZCUVR0SlFVRkJMRWRCUVVFc1IwRkJUVHRKUVVOT0xFbEJRVWtzUTBGQlF5eFBRVUZNTEVOQlFXRXNVMEZCUVR0TlFVTllMRWRCUVVFc1IwRkJUU3hKUVVGSkxFTkJRVU1zVTBGQlRDeERRVUZsTEVsQlFXWTdTVUZFU3l4RFFVRmlPMWRCUjBFc1IwRkJRU3hKUVVGUE8wVkJURVVzUTBFelExZzdSVUZ2UkVFc1YwRkJRU3hGUVVGaExGTkJRVU1zU1VGQlJEdEJRVU5ZTEZGQlFVRTdTVUZCUVN4SFFVRkJMRWRCUVUwN1NVRkRUaXhKUVVGSExFbEJRVWc3VFVGRFJTeEpRVUZKTEVOQlFVTXNUMEZCVEN4RFFVRmhMRk5CUVVFN1VVRkRXQ3hIUVVGQkxFZEJRVTBzUTBGQlF5eERRVUZETEZOQlFVWXNRMEZCV1N4SlFVRmFPMDFCUkVzc1EwRkJZanROUVVsQkxFbEJRV0VzVVVGQlVTeERRVUZETEZkQlFWUXNRMEZCY1VJc1IwRkJja0lzUTBGQllqdFJRVUZCTEVkQlFVRXNSMEZCVFN4SFFVRk9PMDlCVEVZN08xZEJUVUU3UlVGU1Z5eERRWEJFWWp0RlFXZEZRU3hOUVVGQkxFVkJRVkVzVTBGQlF5eEpRVUZFTEVWQlFVOHNVMEZCVUR0QlFVTk9MRkZCUVVFN08wMUJSR0VzV1VGQldUczdTVUZEZWtJc1IwRkJRU3hIUVVGTk8wbEJRMDRzU1VGQlJ5eFRRVUZCTEV0QlFXRXNSMEZCYUVJN1RVRkRSU3hKUVVGSkxFTkJRVU1zVDBGQlRDeERRVUZoTEZOQlFVRTdVVUZEV0N4SFFVRkJMRWRCUVUwc1EwRkJReXhEUVVGRExFdEJRVVlzUTBGQlVTeEpRVUZTTzAxQlJFc3NRMEZCWWl4RlFVUkdPMHRCUVVFc1RVRkJRVHROUVUxRkxFbEJRVUVzUjBGQlR5eFBRVUZCTEVOQlFWRXNaVUZCVWp0TlFVTlFMRWxCUVVFc1EwRkJTeXhKUVVGTUxFVkJRVmNzVTBGQlF5eEhRVUZFTEVWQlFVMHNSMEZCVGp0UlFVTlVMRWxCUVhGQ0xFZEJRVWNzUTBGQlF5eE5RVUZLTEVkQlFXRXNRMEZCYkVNN1ZVRkJRU3hIUVVGQkxFbEJRVThzVlVGQlVEczdVVUZEUVN4SFFVRkJMRWxCUVU4c1IwRkJRU3hIUVVGTkxFZEJRVTRzUjBGQldUdE5RVVpXTEVOQlFWZ3NSVUZRUmpzN1YwRlpRU3hGUVVGRkxFTkJRVU1zVFVGQlNDeERRVUZWTEVkQlFWWTdSVUZrVFN4RFFXaEZVanRGUVd0R1FTeE5RVUZCTEVWQlFWRXNVMEZCUXl4UFFVRkVMRVZCUVZVc1RVRkJWaXhGUVVGclFpeFJRVUZzUWp0QlFVTk9MRkZCUVVFN08wMUJSSGRDTEZkQlFWYzdPMGxCUTI1RExFZEJRVUVzUjBGQlRTeFBRVUZCTEVsQlFWYzdTVUZEYWtJc1NVRkJSeXhSUVVGQkxFdEJRVmtzU1VGQlpqdE5RVU5GTEVkQlFVRXNSMEZCVFN4RFFVRkRMRU5CUVVNc1RVRkJSaXhEUVVGVExGRkJRVlFzUlVGQmJVSXNSMEZCYmtJc1JVRkJkMElzVFVGQmVFSXNSVUZFVWp0TFFVRkJMRTFCUVVFN1RVRkhSU3hIUVVGQkxFZEJRVTBzUTBGQlF5eERRVUZETEUxQlFVWXNRMEZCVXl4SFFVRlVMRVZCUVdNc1RVRkJaQ3hGUVVoU096dFhRVWxCTzBWQlRrMHNRMEZzUmxJN096dEJRVEpHUml4RlFVRkZMRU5CUVVNc1VVRkJTQ3hEUVVGWkxGRkJRVm9zUlVGQmMwSXNUVUZCVFN4RFFVRkRMRTFCUVRkQ096dEJRVU5CTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1kwRkJXaXhGUVVFMFFpeE5RVUZOTEVOQlFVTXNXVUZCYmtNN08wRkJRMEVzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4VlFVRmFMRVZCUVhkQ0xFMUJRVTBzUTBGQlF5eFJRVUV2UWpzN1FVRkRRU3hGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEZOQlFWb3NSVUZCZFVJc1RVRkJUU3hEUVVGRExFOUJRVGxDT3p0QlFVTkJMRVZCUVVVc1EwRkJReXhSUVVGSUxFTkJRVmtzVDBGQldpeEZRVUZ4UWl4TlFVRk5MRU5CUVVNc1MwRkJOVUk3TzBGQlEwRXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3hYUVVGYUxFVkJRWGxDTEUxQlFVMHNRMEZCUXl4VFFVRm9RenM3UVVGRFFTeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMR0ZCUVZvc1JVRkJNa0lzVFVGQlRTeERRVUZETEZkQlFXeERPenRCUVVOQkxFVkJRVVVzUTBGQlF5eFJRVUZJTEVOQlFWa3NVVUZCV2l4RlFVRnpRaXhOUVVGTkxFTkJRVU1zVFVGQk4wSTdPMEZCUTBFc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeFJRVUZhTEVWQlFYTkNMRTFCUVUwc1EwRkJReXhOUVVFM1FqczdRVUZGUVN4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpVDBvZ1BTQnlaWEYxYVhKbElDY3VMaTl2YWlkY2NseHVKQ0E5SUhKbGNYVnBjbVVnSjJweGRXVnllU2RjY2x4dVh5QTlJSEpsY1hWcGNtVWdKMnh2WkdGemFDZGNjbHh1YVhOTlpYUm9iMlFnUFNCeVpYRjFhWEpsSUNjdUxpOTBiMjlzY3k5cGN5ZGNjbHh1Y0hKdmNHVnlkSGtnUFNCeVpYRjFhWEpsSUNjdUwzQnliM0JsY25SNUoxeHlYRzVtZFc1aklEMGdjbVZ4ZFdseVpTQW5MaTltZFc1amRHbHZiaWRjY2x4dWRHOGdQU0J5WlhGMWFYSmxJQ2N1TGk5MGIyOXNjeTkwYnlkY2NseHVYSEpjYmlNZ0l5QnZZbXBsWTNSY2NseHVYSEpjYm5KbGRFOWlhaUE5SUZ4eVhHNWNjbHh1SUNBaklDTWpJRnRQU2wwb2Iyb3VhSFJ0YkNrdWIySnFaV04wWEhKY2JpQWdJeUJqY21WaGRHVWdZVzRnYjJKcVpXTjBJSGRwZEdnZ2FHVnNjR1Z5SUdCaFpHUmdJR0Z1WkNCZ1pXRmphR0FnYldWMGFHOWtjeTVjY2x4dUlDQnZZbXBsWTNRNklDaHZZbW9nUFNCN2ZTa2dMVDVjY2x4dUlDQWdJRnh5WEc0Z0lDQWdJeU1qWEhKY2JpQWdJQ0JCWkdRZ1lTQndjbTl3WlhKMGVTQjBieUIwYUdVZ2IySnFaV04wSUdGdVpDQnlaWFIxY200Z2FYUmNjbHh1SUNBZ0lDTWpJMXh5WEc0Z0lDQWdiMkpxTG1Ga1pDQTlJQ2h1WVcxbExDQjJZV3dwSUMwK1hISmNiaUFnSUNBZ0lIQnliM0JsY25SNUlHOWlhaXdnYm1GdFpTd2dkbUZzWEhKY2JpQWdJQ0FnSUc5aWFseHlYRzVjY2x4dUlDQWdJRzlpYWk1aFpHUWdKMlZoWTJnbkxDQW9ZMkZzYkdKaFkyc3BJQzArWEhKY2JpQWdJQ0FnSUdWaFkyZ2dQU0J5WlhGMWFYSmxJQ2N1TGk5MGIyOXNjeTlsWVdOb0oxeHlYRzRnSUNBZ0lDQmxZV05vSUc5aWFpd2dLSFpoYkN3Z2EyVjVLU0F0UGx4eVhHNGdJQ0FnSUNBZ0lHbG1JR3RsZVNCcGMyNTBJQ2RsWVdOb0p5QmhibVFnYTJWNUlHbHpiblFnSjJGa1pDZGNjbHh1SUNBZ0lDQWdJQ0FnSUdOaGJHeGlZV05ySUhaaGJDd2dhMlY1WEhKY2JseHlYRzRnSUNBZ2IySnFYSEpjYmx4eVhHNWNjbHh1SUNBaklDTWpJRnRQU2wwb2Iyb3VhSFJ0YkNrdWFYTkpibk4wWVc1alpVOW1YSEpjYmlBZ0l5QmtaWFJsY20xcGJtVnpJR2x6SUdFZ2RHaHBibWNnYVhNZ1lXNGdhVzV6ZEdGdVkyVWdiMllnWVNCVWFHbHVaeXdnWVhOemRXMXBibWNnZEdobElIUm9hVzVuY3lCM1pYSmxJR0ZzYkNCamNtVmhkR1ZrSUdsdUlFOUtYSEpjYmlBZ2FYTkpibk4wWVc1alpVOW1PaUFvYm1GdFpTd2diMkpxS1NBdFBseHlYRzRnSUNBZ2NtVjBUMkpxTG1OdmJuUmhhVzV6S0c1aGJXVXNJRzlpYWlrZ1lXNWtJSFJ2TG1KdmIyd29iMkpxVzI1aGJXVmRLVnh5WEc1Y2NseHVJQ0FqSUNNaklGdFBTbDBvYjJvdWFIUnRiQ2t1WTI5dWRHRnBibk5jY2x4dUlDQWpJSFJ5ZFdVZ2FXWWdkR2hsSUdCdlltcGxZM1JnSUdOdmJuUmhhVzV6SUhSb1pTQjJZV3gxWlZ4eVhHNGdJR052Ym5SaGFXNXpPaUFvYjJKcVpXTjBMQ0JwYm1SbGVDa2dMVDVjY2x4dUlDQWdJSEpsZENBOUlHWmhiSE5sWEhKY2JpQWdJQ0JwWmlCdlltcGxZM1JjY2x4dUlDQWdJQ0FnY21WMElEMGdYeTVqYjI1MFlXbHVjeUJ2WW1wbFkzUXNJR2x1WkdWNFhISmNiaUFnSUNCeVpYUmNjbHh1WEhKY2JpQWdJeUFqSXlCYlQwcGRLRzlxTG1oMGJXd3BMbU52YlhCaGNtVmNjbHh1SUNBaklHTnZiWEJoY21VZ2RIZHZJRzlpYW1WamRITXZZWEp5WVhsekwzWmhiSFZsY3lCbWIzSWdjM1J5YVdOMElHVnhkV0ZzYVhSNVhISmNiaUFnWTI5dGNHRnlaVG9nS0c5aWFqRXNJRzlpYWpJcElDMCtYSEpjYmlBZ0lDQmZMbWx6UlhGMVlXd2diMkpxTVN3Z2IySnFNbHh5WEc1Y2NseHVJQ0FqSUNNaklGdFBTbDBvYjJvdWFIUnRiQ2t1WTJ4dmJtVmNjbHh1SUNBaklHTnZjSGtnWVd4c0lHOW1JSFJvWlNCMllXeDFaWE1nS0hKbFkzVnljMmwyWld4NUtTQm1jbTl0SUc5dVpTQnZZbXBsWTNRZ2RHOGdZVzV2ZEdobGNpNWNjbHh1SUNCamJHOXVaVG9nS0dSaGRHRXBJQzArWEhKY2JpQWdJQ0JmTG1Oc2IyNWxSR1ZsY0NCa1lYUmhJSFJ5ZFdWY2NseHVYSEpjYmlBZ0l5QWpJeUJiVDBwZEtHOXFMbWgwYld3cExuTmxjbWxoYkdsNlpWeHlYRzRnSUNNZ1EyOXVkbVZ5ZENCaGJpQnZZbXBsWTNRZ2RHOGdZU0JLVTA5T0lISmxjSEpsYzJWdWRHRjBhVzl1SUc5bUlIUm9aU0J2WW1wbFkzUmNjbHh1SUNCelpYSnBZV3hwZW1VNklDaGtZWFJoS1NBdFBseHlYRzRnSUNBZ2NtVjBJRDBnSnlkY2NseHVJQ0FnSUdaMWJtTXVkSEo1UlhobFl5QXRQbHh5WEc0Z0lDQWdJQ0J5WlhRZ1BTQktVMDlPTG5OMGNtbHVaMmxtZVNoa1lYUmhLVnh5WEc0Z0lDQWdJQ0J5WlhSMWNtNWNjbHh1SUNBZ0lISmxkQ0J2Y2lBbkoxeHlYRzVjY2x4dUlDQWpJQ01qSUZ0UFNsMG9iMm91YUhSdGJDa3VaR1Z6WlhKcFlXeHBlbVZjY2x4dUlDQWpJRU52Ym5abGNuUWdZU0JLVTA5T0lITjBjbWx1WnlCMGJ5QmhiaUJ2WW1wbFkzUmNjbHh1SUNCa1pYTmxjbWxoYkdsNlpUb2dLR1JoZEdFcElDMCtYSEpjYmlBZ0lDQnlaWFFnUFNCN2ZWeHlYRzRnSUNBZ2FXWWdaR0YwWVZ4eVhHNGdJQ0FnSUNCbWRXNWpMblJ5ZVVWNFpXTWdMVDVjY2x4dUlDQWdJQ0FnSUNCeVpYUWdQU0FrTG5CaGNuTmxTbE5QVGloa1lYUmhLVnh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlibHh5WEc1Y2NseHVJQ0FnSUNBZ2NtVjBJRDBnZTMwZ0lHbG1JR2x6VFdWMGFHOWtMbTUxYkd4UGNrVnRjSFI1S0hKbGRDbGNjbHh1SUNBZ0lISmxkRnh5WEc1Y2NseHVJQ0FqSUNNaklGdFBTbDBvYjJvdWFIUnRiQ2t1Y0dGeVlXMXpYSEpjYmlBZ0l5QkRiMjUyWlhKMElHRnVJRzlpYW1WamRDQjBieUJoSUdSbGJHbHRhWFJsWkNCc2FYTjBJRzltSUhCaGNtRnRaWFJsY25NZ0tHNXZjbTFoYkd4NUlIRjFaWEo1TFhOMGNtbHVaeUJ3WVhKaGJXVjBaWEp6S1Z4eVhHNGdJSEJoY21GdGN6b2dLR1JoZEdFc0lHUmxiR2x0YVhSbGNpQTlJQ2NtSnlrZ0xUNWNjbHh1SUNBZ0lISmxkQ0E5SUNjblhISmNiaUFnSUNCcFppQmtaV3hwYldsMFpYSWdhWE1nSnlZblhISmNiaUFnSUNBZ0lHWjFibU11ZEhKNVJYaGxZeUF0UGx4eVhHNGdJQ0FnSUNBZ0lISmxkQ0E5SUNRdWNHRnlZVzBvWkdGMFlTbGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNjbHh1WEhKY2JpQWdJQ0JsYkhObFhISmNiaUFnSUNBZ0lHVmhZMmdnUFNCeVpYRjFhWEpsSUNjdUxpOTBiMjlzY3k5bFlXTm9KMXh5WEc0Z0lDQWdJQ0JsWVdOb0lHUmhkR0VzSUNoMllXd3NJR3RsZVNrZ0xUNWNjbHh1SUNBZ0lDQWdJQ0J5WlhRZ0t6MGdaR1ZzYVcxcGRHVnlJQ0JwWmlCeVpYUXViR1Z1WjNSb0lENGdNRnh5WEc0Z0lDQWdJQ0FnSUhKbGRDQXJQU0JyWlhrZ0t5QW5QU2NnS3lCMllXeGNjbHh1SUNBZ0lDQWdJQ0J5WlhSMWNtNWNjbHh1WEhKY2JpQWdJQ0IwYnk1emRISnBibWNnY21WMFhISmNibHh5WEc0Z0lDTWdJeU1nVzA5S1hTaHZhaTVvZEcxc0tTNWxlSFJsYm1SY2NseHVJQ0FqSUdOdmNIa2dkR2hsSUhCeWIzQmxjblJwWlhNZ2IyWWdiMjVsSUc5aWFtVmpkQ0IwYnlCaGJtOTBhR1Z5SUc5aWFtVmpkRnh5WEc0Z0lHVjRkR1Z1WkRvZ0tHUmxjM1JQWW1vc0lITnlZMDlpYWl3Z1pHVmxjRU52Y0hrZ1BTQm1ZV3h6WlNrZ0xUNWNjbHh1SUNBZ0lISmxkQ0E5SUdSbGMzUlBZbW9nYjNJZ2UzMWNjbHh1SUNBZ0lHbG1JR1JsWlhCRGIzQjVJR2x6SUhSeWRXVmNjbHh1SUNBZ0lDQWdjbVYwSUQwZ0pDNWxlSFJsYm1Rb1pHVmxjRU52Y0hrc0lISmxkQ3dnYzNKalQySnFLVnh5WEc0Z0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNCeVpYUWdQU0FrTG1WNGRHVnVaQ2h5WlhRc0lITnlZMDlpYWlsY2NseHVJQ0FnSUhKbGRGeHlYRzVjY2x4dVhISmNiazlLTG5KbFoybHpkR1Z5SUNkdlltcGxZM1FuTENCeVpYUlBZbW91YjJKcVpXTjBYSEpjYms5S0xuSmxaMmx6ZEdWeUlDZHBjMGx1YzNSaGJtTmxUMlluTENCeVpYUlBZbW91YVhOSmJuTjBZVzVqWlU5bVhISmNiazlLTG5KbFoybHpkR1Z5SUNkamIyNTBZV2x1Y3ljc0lISmxkRTlpYWk1amIyNTBZV2x1YzF4eVhHNVBTaTV5WldkcGMzUmxjaUFuWTI5dGNHRnlaU2NzSUhKbGRFOWlhaTVqYjIxd1lYSmxYSEpjYms5S0xuSmxaMmx6ZEdWeUlDZGpiRzl1WlNjc0lISmxkRTlpYWk1amJHOXVaVnh5WEc1UFNpNXlaV2RwYzNSbGNpQW5jMlZ5YVdGc2FYcGxKeXdnY21WMFQySnFMbk5sY21saGJHbDZaVnh5WEc1UFNpNXlaV2RwYzNSbGNpQW5aR1Z6WlhKcFlXeHBlbVVuTENCeVpYUlBZbW91WkdWelpYSnBZV3hwZW1WY2NseHVUMG91Y21WbmFYTjBaWElnSjNCaGNtRnRjeWNzSUhKbGRFOWlhaTV3WVhKaGJYTmNjbHh1VDBvdWNtVm5hWE4wWlhJZ0oyVjRkR1Z1WkNjc0lISmxkRTlpYWk1bGVIUmxibVJjY2x4dVhISmNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdjbVYwVDJKcUlsMTkiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG4jIyNcclxuQWRkIGEgcHJvcGVydHkgdG8gYW4gb2JqZWN0XHJcbiAgXHJcbiMjI1xyXG5wcm9wZXJ0eSA9IChvYmosIG5hbWUsIHZhbHVlLCB3cml0YWJsZSwgY29uZmlndXJhYmxlLCBlbnVtZXJhYmxlKSAtPlxyXG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGRlZmluZSBhIHByb3BlcnR5IHdpdGhvdXQgYW4gT2JqZWN0LicgIHVubGVzcyBvYmpcclxuICB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgYSBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgcHJvcGVydHkgbmFtZS4nICB1bmxlc3MgbmFtZT9cclxuICBvYmpbbmFtZV0gPSB2YWx1ZVxyXG4gIG9ialxyXG5cclxuT0oucmVnaXN0ZXIgJ3Byb3BlcnR5JywgcHJvcGVydHlcclxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmRlbGltaXRlZFN0cmluZyA9IChzdHJpbmcsIG9wdHMpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgbmV3TGluZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICBzcGFjZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICByZW1vdmVEdXBsaWNhdGVzOiB0cnVlXHJcbiAgICBkZWxpbWl0ZXI6IFwiLFwiXHJcbiAgICBpbml0U3RyaW5nOiBPSi50by5zdHJpbmcgc3RyaW5nXHJcblxyXG4gIHJldE9iaiA9XHJcbiAgICBhcnJheTogW11cclxuICAgIGRlbGltaXRlZDogLT5cclxuICAgICAgcmV0T2JqLmFycmF5LmpvaW4gZGVmYXVsdHMuZGVsaW1pdGVyXHJcblxyXG4gICAgc3RyaW5nOiAoZGVsaW1pdGVyID0gZGVmYXVsdHMuZGVsaW1pdGVyKSAtPlxyXG4gICAgICByZXQgPSAnJ1xyXG4gICAgICBPSi5lYWNoIHJldE9iai5hcnJheSwgKHZhbCkgLT5cclxuICAgICAgICByZXQgKz0gZGVsaW1pdGVyICBpZiByZXQubGVuZ3RoID4gMFxyXG4gICAgICAgIHJldCArPSB2YWxcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIHJldFxyXG5cclxuICAgIHRvU3RyaW5nOiAtPlxyXG4gICAgICByZXRPYmouc3RyaW5nKClcclxuXHJcbiAgICBhZGQ6IChzdHIpIC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5wdXNoIGRlZmF1bHRzLnBhcnNlKHN0cilcclxuICAgICAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcygpXHJcbiAgICAgIHJldE9ialxyXG5cclxuICAgIHJlbW92ZTogKHN0cikgLT5cclxuICAgICAgcmVtb3ZlID0gKGFycmF5KSAtPlxyXG4gICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgIHRydWUgIGlmIGl0ZW0gaXNudCBzdHJcclxuXHJcblxyXG4gICAgICByZXRPYmouYXJyYXkgPSByZW1vdmUocmV0T2JqLmFycmF5KVxyXG4gICAgICByZXRPYmpcclxuXHJcbiAgICBjb3VudDogLT5cclxuICAgICAgcmV0T2JqLmFycmF5Lmxlbmd0aFxyXG5cclxuICAgIGNvbnRhaW5zOiAoc3RyLCBjYXNlU2Vuc2l0aXZlKSAtPlxyXG4gICAgICBpc0Nhc2VTZW5zaXRpdmUgPSBPSi50by5ib29sKGNhc2VTZW5zaXRpdmUpXHJcbiAgICAgIHN0ciA9IE9KLnRvLnN0cmluZyhzdHIpLnRyaW0oKVxyXG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKSAgaWYgZmFsc2UgaXMgaXNDYXNlU2Vuc2l0aXZlXHJcbiAgICAgIG1hdGNoID0gcmV0T2JqLmFycmF5LmZpbHRlcigobWF0U3RyKSAtPlxyXG4gICAgICAgIChpc0Nhc2VTZW5zaXRpdmUgYW5kIE9KLnRvLnN0cmluZyhtYXRTdHIpLnRyaW0oKSBpcyBzdHIpIG9yIE9KLnRvLnN0cmluZyhtYXRTdHIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpIGlzIHN0clxyXG4gICAgICApXHJcbiAgICAgIG1hdGNoLmxlbmd0aCA+IDBcclxuXHJcbiAgICBlYWNoOiAoY2FsbEJhY2spIC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5mb3JFYWNoIGNhbGxCYWNrXHJcblxyXG4gIGRlZmF1bHRzLnBhcnNlID0gKHN0cikgLT5cclxuICAgIHJldCA9IE9KLnRvLnN0cmluZyhzdHIpXHJcbiAgICByZXQgPSByZXQucmVwbGFjZSgvXFxuL2csIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiXFxuXCIpIGlzbnQgLTEgIGlmIGRlZmF1bHRzLm5ld0xpbmVUb0RlbGltaXRlclxyXG4gICAgcmV0ID0gcmV0LnJlcGxhY2UoUmVnRXhwKFwiIFwiLCBcImdcIiksIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiIFwiKSBpc250IC0xICBpZiBkZWZhdWx0cy5zcGFjZVRvRGVsaW1pdGVyXHJcbiAgICByZXQgPSByZXQucmVwbGFjZSgvLCwvZywgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCIsLFwiKSBpc250IC0xXHJcbiAgICByZXRcclxuXHJcbiAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcyA9IC0+XHJcbiAgICBpZiBkZWZhdWx0cy5yZW1vdmVEdXBsaWNhdGVzXHJcbiAgICAgICgtPlxyXG4gICAgICAgIHVuaXF1ZSA9IChhcnJheSkgLT5cclxuICAgICAgICAgIHNlZW4gPSBuZXcgU2V0KClcclxuICAgICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgICAgaWYgZmFsc2UgaXMgc2Vlbi5oYXMoaXRlbSlcclxuICAgICAgICAgICAgICBzZWVuLmFkZCBpdGVtXHJcbiAgICAgICAgICAgICAgdHJ1ZVxyXG5cclxuXHJcbiAgICAgICAgcmV0T2JqLmFycmF5ID0gdW5pcXVlKHJldE9iai5hcnJheSlcclxuICAgICAgICByZXR1cm5cclxuICAgICAgKSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgKChhKSAtPlxyXG4gICAgaWYgYS5sZW5ndGggPiAxIGFuZCBmYWxzZSBpcyBPSi5pcy5wbGFpbk9iamVjdChvcHRzKVxyXG4gICAgICBPSi5lYWNoIGEsICh2YWwpIC0+XHJcbiAgICAgICAgcmV0T2JqLmFycmF5LnB1c2ggdmFsICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSh2YWwpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgZWxzZSBpZiBzdHJpbmcgYW5kIHN0cmluZy5sZW5ndGggPiAwXHJcbiAgICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0c1xyXG4gICAgICBkZWxpbWl0ZWRTdHJpbmcgPSBkZWZhdWx0cy5wYXJzZShzdHJpbmcpXHJcbiAgICAgIGRlZmF1bHRzLmluaXRTdHJpbmcgPSBkZWxpbWl0ZWRTdHJpbmdcclxuICAgICAgcmV0T2JqLmFycmF5ID0gZGVsaW1pdGVkU3RyaW5nLnNwbGl0KGRlZmF1bHRzLmRlbGltaXRlcilcclxuICAgIGRlZmF1bHRzLmRlbGV0ZUR1cGxpY2F0ZXMoKVxyXG4gICAgcmV0dXJuXHJcbiAgKSBhcmd1bWVudHNcclxuICByZXRPYmpcclxuXHJcblxyXG5PSi5yZWdpc3RlciAnZGVsaW1pdGVkU3RyaW5nJywgZGVsaW1pdGVkU3RyaW5nXHJcbm1vZHVsZS5leHBvcnRzID0gZGVsaW1pdGVkU3RyaW5nIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE5vZGUsIE9KLCBfLCBib2R5O1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbl8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG5cbk5vZGUgPSByZXF1aXJlKCcuL25vZGUnKTtcblxuXG4vKlxuUGVyc2lzdCBhIGhhbmRsZSBvbiB0aGUgYm9keSBub2RlXG4gKi9cblxuaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgYm9keSA9IGRvY3VtZW50LmJvZHk7XG59IGVsc2Uge1xuICBib2R5ID0gbnVsbDtcbn1cblxuYm9keSA9IG5ldyBOb2RlKGJvZHkpO1xuXG5PSi5yZWdpc3RlcignYm9keScsIGJvZHkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGJvZHk7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4a2IyMWNYR0p2WkhrdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFTeEpRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlEwb3NTVUZCUVN4SFFVRlBMRTlCUVVFc1EwRkJVU3hSUVVGU096czdRVUZIVURzN096dEJRVWRCTEVsQlFVY3NUMEZCVHl4UlFVRlFMRXRCUVhGQ0xGZEJRWGhDTzBWQlFYbERMRWxCUVVFc1IwRkJUeXhSUVVGUkxFTkJRVU1zUzBGQmVrUTdRMEZCUVN4TlFVRkJPMFZCUVcxRkxFbEJRVUVzUjBGQlR5eExRVUV4UlRzN08wRkJRMEVzU1VGQlFTeEhRVUZYTEVsQlFVRXNTVUZCUVN4RFFVRkxMRWxCUVV3N08wRkJSVmdzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4TlFVRmFMRVZCUVc5Q0xFbEJRWEJDT3p0QlFVTkJMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SlBTaUE5SUhKbGNYVnBjbVVnSnk0dUwyOXFKMXh5WEc1ZklEMGdjbVZ4ZFdseVpTQW5iRzlrWVhOb0oxeHlYRzVPYjJSbElEMGdjbVZ4ZFdseVpTQW5MaTl1YjJSbEoxeHlYRzVjY2x4dVhISmNiaU1qSTF4eVhHNVFaWEp6YVhOMElHRWdhR0Z1Wkd4bElHOXVJSFJvWlNCaWIyUjVJRzV2WkdWY2NseHVJeU1qWEhKY2JtbG1JSFI1Y0dWdlppQmtiMk4xYldWdWRDQnBjMjUwSUNkMWJtUmxabWx1WldRbklIUm9aVzRnWW05a2VTQTlJR1J2WTNWdFpXNTBMbUp2WkhrZ1pXeHpaU0JpYjJSNUlEMGdiblZzYkZ4eVhHNWliMlI1SUQwZ2JtVjNJRTV2WkdVZ1ltOWtlVnh5WEc0Z0lGeHlYRzVQU2k1eVpXZHBjM1JsY2lBblltOWtlU2NzSUdKdlpIbGNjbHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JpYjJSNUlsMTkiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5cclxuIyAjIGNvbXBvbmVudFxyXG5cclxuXHJcbiMgQ3JlYXRlIGFuIEhUTUwgV2ViIENvbXBvbmVudCB0aHJvdWdoIFRoaW5Eb21cclxuXHJcbiMgLSBgb3B0aW9uc2AgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc3RhbmRhcmQgb3B0aW9ucyB0byBiZSBwYXNzZWQgaW50byB0aGUgY29tcG9uZW50XHJcbiMgLS0gYHJvb3ROb2RlVHlwZWA6IHRoZSB0YWcgbmFtZSBvZiB0aGUgcm9vdCBub2RlIHRvIGNyZWF0ZSwgZGVmYXVsdCA9ICdkaXYnXHJcbiMgLS0gYHByb3BzYDogYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgRE9NIGF0dHJpYnV0ZXMgdG8gYXBwZW5kIHRvIHRoZSByb290IG5vZGVcclxuIyAtLSBgc3R5bGVzYDogYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgQ1NTIGF0dHJpYnV0ZXMgdG8gYXBwZW5kIHRvIHRoZSByb290IG5vZGVcclxuIyAtLSBgZXZlbnRzYDogYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgbmFtZWQgRE9NIGV2ZW50cyAoYW5kIGNvcnJlc3BvbmRpbmcgY2FsbGJhY2sgbWV0aG9kcykgdG8gYmluZCB0byB0aGUgcm9vdCBub2RlXHJcbiMgLSBgb3duZXJgIHRoZSBwYXJlbnQgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBub2RlIHdpbGwgYmUgYXBwZW5kZWRcclxuIyAtIGB0YWdOYW1lYCB0aGUgbmFtZSBvZiBvZiB0aGUgY29tcG9uZW50LCB3aGljaCB3aWxsIGFsd2F5cyBiZSBwcmVmaXhlZCB3aXRoICd4LSdcclxuY29tcG9uZW50ID0gKG9wdGlvbnMgPSBvYmoub2JqZWN0KCksIG93bmVyLCB0YWdOYW1lKSAtPlxyXG5cclxuICBpZiBub3QgdGFnTmFtZS5zdGFydHNXaXRoICd4LScgdGhlbiB0YWdOYW1lID0gJ3gtJyArIHRhZ05hbWVcclxuICAjIHdlYiBjb21wb25lbnRzIGFyZSByZWFsbHkganVzdCBvcmRpbmFyeSBPSiBbZWxlbWVudF0oZWxlbWVudC5odG1sKSdzIHdpdGggYSBzcGVjaWFsIG5hbWUuXHJcbiAgIyBVbnRpbCBIVE1MIFdlYiBDb21wb25lbnRzIGFyZSBmdWxseSBzdXBwb3J0ZWQgKGFuZCBPSiBpcyByZWZhY3RvcmVkIGFjY29yZGluZ2x5KSwgdGhlIGVsZW1lbnQgd2lsbCBiZSB0cmVhdGVkIGFzIGFuIHVua25vd24gZWxlbWVudC5cclxuICAjIEluIG1vc3QgY2FzZXMsIHRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIHRoZSBicm93c2VyIGlzIGFjY2VwdGFibGUgKHNlZSBhbHNvIFtIVE1MIFNlbWFudGljc10oaHR0cDovL2RpdmVpbnRvaHRtbDUuaW5mby9zZW1hbnRpY3MuaHRtbCkpLCBidXRcclxuICAjIGluIHNvbWUgY2FzZXMgdGhpcyBpcyBwcm9ibGVtYXRpYyAoZmlyc3RseSwgYmVjYXVzZSB0aGVzZSBlbGVtZW50cyBhcmUgYWx3YXlzIHJlbmRlcmVkIGlubGluZSkuXHJcbiAgIyBJbiBzdWNoIGNvbmRpdGlvbnMsIHRoZSBbY29udHJvbHNdKGNvbnRyb2xzLmh0bWwpIGNsYXNzIGFuZCBuYW1lIHNwYWNlIGlzIGJldHRlciBzdWl0ZWQgdG8gY2xhc3NlcyB3aGljaCByZXF1aXJlIGNvbXBsZXRlIGNvbnRyb2wgKGUuZy4gW2ljb25dKGljb24uaHRtbCkpLlxyXG4gIHdpZGdldCA9IG5vZGVGYWN0b3J5IHRhZ05hbWUsIG9iai5vYmplY3QoKSwgb3duZXIsIGZhbHNlICMsIG9wdGlvbnMucHJvcHMsIG9wdGlvbnMuc3R5bGVzLCBvcHRpb25zLmV2ZW50cywgb3B0aW9ucy50ZXh0XHJcbiAgXHJcbiAgIyBTaW5jZSB0aGUgYmVoYXZpb3Igb2Ygc3R5bGluZyBpcyBub3Qgd2VsbCBjb250cm9sbGVkL2NvbnRyb2xsYWJsZSBvbiB1bmtub3duIGVsZW1lbnRzLCBpdCBpcyBuZWNlc3NhcnkgdG8gY3JlYXRlIGEgcm9vdCBub2RlIGZvciB0aGUgY29tcG9uZW50LlxyXG4gICMgSW4gbW9zdCBjYXNlcywgW2Rpdl0oZGl2Lmh0bWwpIGlzIHBlcmZlY3RseSBhY2NlcHRhYmxlLCBidXQgdGhpcyBpcyBjb25maWd1cmFibGUgYXQgdGhlIG5hbWUgc3BhY2UgbGV2ZWwgb3IgYXQgcnVudGltZS5cclxuICByb290Tm9kZVR5cGUgPSBvcHRpb25zLnJvb3ROb2RlVHlwZSBvciBPSlsnREVGQVVMVF9DT01QT05FTlRfUk9PVF9OT0RFVFlQRSddIG9yICdkaXYnXHJcblxyXG4gICMgYHJldGAgaXMgdGhlIHRoZSBpbnN0YW5jZSBvZiB0aGUgcm9vdE5vZGVUeXBlLCBub3QgdGhlIGB3aWRnZXRgIHdyYXBwZWQgaW4gdGhpcyBjbG9zdXJlXHJcbiAgcmV0ID0gd2lkZ2V0Lm1ha2Ugcm9vdE5vZGVUeXBlLCBvcHRpb25zXHJcblxyXG4gICMgZm9yIGNvbnZlbmllbmNlIGFuZCBkZWJ1Z2dpbmcsIHBlcnNpc3QgdGhlIHRhZ05hbWVcclxuICByZXQuY29tcG9uZW50TmFtZSA9IHRhZ05hbWVcclxuXHJcbiAgIyBgcmVtb3ZlYCBkb2VzLCBob3dldmVyLCBiZWhhdmUgYXMgZXhwZWN0ZWQgYnkgcmVtb3ZpbmcgYHdpZGdldGBcclxuICByZXQucmVtb3ZlID0gd2lkZ2V0LnJlbW92ZVxyXG4gIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ2NvbXBvbmVudCcsIGNvbXBvbmVudFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvbmVudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcblxyXG4jIyNcclxuQ3JlYXRlIGEgc2V0IG9mIEhUTUwgRWxlbWVudHMgdGhyb3VnaCBUaGluRG9tXHJcbiMjI1xyXG5jb250cm9sID0gKG9wdGlvbnMgPSBvYmoub2JqZWN0KCksIG93bmVyLCB0YWdOYW1lKSAtPlxyXG4gIGlmIG5vdCB0YWdOYW1lLnN0YXJ0c1dpdGggJ3ktJyB0aGVuIHRhZ05hbWUgPSAneS0nICsgdGFnTmFtZVxyXG5cclxuICByb290Tm9kZVR5cGUgPSBvcHRpb25zLnJvb3ROb2RlVHlwZSBvciBPSlsnREVGQVVMVF9DT01QT05FTlRfUk9PVF9OT0RFVFlQRSddIG9yICdkaXYnXHJcblxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IHJvb3ROb2RlVHlwZSwgb3B0aW9ucywgb3duZXIsIGZhbHNlXHJcblxyXG4gIHJldC5hZGQgJ2NvbnRyb2xOYW1lJywgdGFnTmFtZVxyXG5cclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdjb250cm9sJywgY29udHJvbFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRyb2wiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCwgTm9kZSwgT0osIFRoaW5ET00sIF8sIGVsZW1lbnQ7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xuXG5UaGluRE9NID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RoaW5ET00nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RoaW5ET00nXSA6IG51bGwpO1xuXG5lbGVtZW50ID0ge1xuXG4gIC8qXG4gIFJlc3RvcmUgYW4gSFRNTCBFbGVtZW50IHRocm91Z2ggVGhpbkRvbVxuICAgKi9cbiAgcmVzdG9yZUVsZW1lbnQ6IGZ1bmN0aW9uKGVsLCB0YWcpIHtcbiAgICBpZiAodGFnID09IG51bGwpIHtcbiAgICAgIHRhZyA9IGVsLm5vZGVOYW1lO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE5vZGUoZWwpO1xuICB9XG59O1xuXG5PSi5yZWdpc3RlcigncmVzdG9yZUVsZW1lbnQnLCBlbGVtZW50LnJlc3RvcmVFbGVtZW50KTtcblxuT0oucmVnaXN0ZXIoJ2lzRWxlbWVudEluRG9tJywgZnVuY3Rpb24oZWxlbWVudElkKSB7XG4gIHJldHVybiBmYWxzZSA9PT0gT0ouaXMubnVsbE9yRW1wdHkoT0ouZ2V0RWxlbWVudChlbGVtZW50SWQpKTtcbn0pO1xuXG5PSi5yZWdpc3RlcignZ2V0RWxlbWVudCcsIGZ1bmN0aW9uKGlkKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZWxlbWVudDtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRnhrYjIxY1hHVnNaVzFsYm5RdVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFTeEpRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlEwb3NRMEZCUVN4SFFVRkpMRTlCUVVFc1EwRkJVU3hSUVVGU096dEJRVU5LTEVsQlFVRXNSMEZCVHl4UFFVRkJMRU5CUVZFc1VVRkJVanM3UVVGRlVDeFBRVUZCTEVkQlFWVXNUMEZCUVN4RFFVRlJMRk5CUVZJN08wRkJTVllzVDBGQlFTeEhRVVZGT3p0QlFVRkJPenM3UlVGSFFTeGpRVUZCTEVWQlFXZENMRk5CUVVNc1JVRkJSQ3hGUVVGTExFZEJRVXc3TzAxQlFVc3NUVUZCVFN4RlFVRkZMRU5CUVVNN08xZEJRM2hDTEVsQlFVRXNTVUZCUVN4RFFVRkxMRVZCUVV3N1JVRkVWU3hEUVVob1FqczdPMEZCVFVZc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeG5Ra0ZCV2l4RlFVRTRRaXhQUVVGUExFTkJRVU1zWTBGQmRFTTdPMEZCUlVFc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeG5Ra0ZCV2l4RlFVRTRRaXhUUVVGRExGTkJRVVE3VTBGRE5VSXNTMEZCUVN4TFFVRlRMRVZCUVVVc1EwRkJReXhGUVVGRkxFTkJRVU1zVjBGQlRpeERRVUZyUWl4RlFVRkZMRU5CUVVNc1ZVRkJTQ3hEUVVGakxGTkJRV1FzUTBGQmJFSTdRVUZFYlVJc1EwRkJPVUk3TzBGQlIwRXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3haUVVGYUxFVkJRVEJDTEZOQlFVTXNSVUZCUkR0RlFVTjRRaXhKUVVGSExFOUJRVThzVVVGQlVDeExRVUZ4UWl4WFFVRjRRanRYUVVORkxGRkJRVkVzUTBGQlF5eGpRVUZVTEVOQlFYZENMRVZCUVhoQ0xFVkJSRVk3TzBGQlJIZENMRU5CUVRGQ096dEJRVXRCTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0lpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpQU2lBOUlISmxjWFZwY21VZ0p5NHVMMjlxSjF4eVhHNGtJRDBnY21WeGRXbHlaU0FuYW5GMVpYSjVKMXh5WEc1ZklEMGdjbVZ4ZFdseVpTQW5iRzlrWVhOb0oxeHlYRzVPYjJSbElEMGdjbVZ4ZFdseVpTQW5MaTl1YjJSbEoxeHlYRzVjY2x4dVZHaHBia1JQVFNBOUlISmxjWFZwY21VZ0ozUm9hVzVrYjIwblhISmNibHh5WEc0aklDTWdaV3hsYldWdWRGeHlYRzVjY2x4dVpXeGxiV1Z1ZENBOUlGeHlYRzRnSUNNZ0l5TWdjbVZ6ZEc5eVpVVnNaVzFsYm5SY2NseHVJQ0FqSXlOY2NseHVJQ0JTWlhOMGIzSmxJR0Z1SUVoVVRVd2dSV3hsYldWdWRDQjBhSEp2ZFdkb0lGUm9hVzVFYjIxY2NseHVJQ0FqSXlOY2NseHVJQ0J5WlhOMGIzSmxSV3hsYldWdWREb2dLR1ZzTENCMFlXY2dQU0JsYkM1dWIyUmxUbUZ0WlNrZ0xUNWNjbHh1SUNBZ0lHNWxkeUJPYjJSbEtHVnNLVnh5WEc1Y2NseHVUMG91Y21WbmFYTjBaWElnSjNKbGMzUnZjbVZGYkdWdFpXNTBKeXdnWld4bGJXVnVkQzV5WlhOMGIzSmxSV3hsYldWdWRGeHlYRzVjY2x4dVQwb3VjbVZuYVhOMFpYSWdKMmx6Uld4bGJXVnVkRWx1Ukc5dEp5d2dLR1ZzWlcxbGJuUkpaQ2tnTFQ1Y2NseHVJQ0JtWVd4elpTQnBjeUJQU2k1cGN5NXVkV3hzVDNKRmJYQjBlU0JQU2k1blpYUkZiR1Z0Wlc1MElHVnNaVzFsYm5SSlpGeHlYRzVjY2x4dVQwb3VjbVZuYVhOMFpYSWdKMmRsZEVWc1pXMWxiblFuTENBb2FXUXBJQzArWEhKY2JpQWdhV1lnZEhsd1pXOW1JR1J2WTNWdFpXNTBJR2x6Ym5RZ0ozVnVaR1ZtYVc1bFpDZGNjbHh1SUNBZ0lHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0dsa0tWeHlYRzVjY2x4dVhISmNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdaV3hsYldWdWRDSmRmUT09IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIGZyYWdtZW50XHJcblxyXG4jIENyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50IGFuZCByZXR1cm4gaXQgYXMgYW4gT0ogbm9kZVxyXG5mcmFnbWVudCA9IC0+XHJcbiAgcmV0ID0gbnVsbFxyXG4gIGlmIHR5cGVvZiBkb2N1bWVudCBpc250ICd1bmRlZmluZWQnXHJcbiAgICBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxyXG4gICAgXHJcbiAgICBmcmFnID0gbmV3IFRoaW5ET00gbnVsbCwgbnVsbCwgZnJhZ21lbnRcclxuICAgIGZyYWcuaXNJbkRPTSA9IHRydWVcclxuICAgIHJldCA9IG5vZGVGYWN0b3J5IGZyYWdcclxuICAgIFxyXG4gIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ2ZyYWdtZW50JywgZnJhZ21lbnRcclxubW9kdWxlLmV4cG9ydHMgPSBmcmFnbWVudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBnZW5lcmljIG5vZGVzXHJcblxyXG5jbG9zZWQgPSBbXHJcbiAgJ2FiYnInXHJcbiAgJ2Fjcm9ueW0nXHJcbiAgJ2FwcGxldCdcclxuICAnYXJ0aWNsZSdcclxuICAnYXNpZGUnXHJcbiAgJ2F1ZGlvJ1xyXG4gICdiJ1xyXG4gICdiZG8nXHJcbiAgJ2JpZydcclxuICAnYmxvY2txdW90ZSdcclxuICAnYnV0dG9uJ1xyXG4gICdjYW52YXMnXHJcbiAgJ2NhcHRpb24nXHJcbiAgJ2NlbnRlcidcclxuICAnY2l0ZSdcclxuICAnY29kZSdcclxuICAnY29sZ3JvdXAnXHJcbiAgJ2RhdGFsaXN0J1xyXG4gICdkZCdcclxuICAnZGVsJ1xyXG4gICdkZXRhaWxzJ1xyXG4gICdkZm4nXHJcbiAgJ2RpcidcclxuICAnZGl2J1xyXG4gICdkbCdcclxuICAnZHQnXHJcbiAgJ2VtJ1xyXG4gICdmaWVsZHNldCdcclxuICAnZmlnY2FwdGlvbidcclxuICAnZmlndXJlJ1xyXG4gICdmb250J1xyXG4gICdmb290ZXInXHJcbiAgJ2gxJ1xyXG4gICdoMidcclxuICAnaDMnXHJcbiAgJ2g0J1xyXG4gICdoNSdcclxuICAnaDYnXHJcbiAgJ2hlYWQnXHJcbiAgJ2hlYWRlcidcclxuICAnaGdyb3VwJ1xyXG4gICdodG1sJ1xyXG4gICdpJ1xyXG4gICdpZnJhbWUnXHJcbiAgJ2lucydcclxuICAna2JkJ1xyXG4gICdsYWJlbCdcclxuICAnbGVnZW5kJ1xyXG4gICdsaSdcclxuICAnbWFwJ1xyXG4gICdtYXJrJ1xyXG4gICdtZW51J1xyXG4gICdtZXRlcidcclxuICAnbmF2J1xyXG4gICdub2ZyYW1lcydcclxuICAnbm9zY3JpcHQnXHJcbiAgJ29iamVjdCdcclxuICAnb3B0Z3JvdXAnXHJcbiAgJ29wdGlvbidcclxuICAnb3V0cHV0J1xyXG4gICdwJ1xyXG4gICdwcmUnXHJcbiAgJ3Byb2dyZXNzJ1xyXG4gICdxJ1xyXG4gICdycCdcclxuICAncnQnXHJcbiAgJ3J1YnknXHJcbiAgJ3MnXHJcbiAgJ3NhbXAnXHJcbiAgJ3NlY3Rpb24nXHJcbiAgJ3NtYWxsJ1xyXG4gICdzcGFuJ1xyXG4gICdzdHJpa2UnXHJcbiAgJ3N0cm9uZydcclxuICAnc3R5bGUnXHJcbiAgJ3N1YidcclxuICAnc3VtbWFyeSdcclxuICAnc3VwJ1xyXG4gICd0Ym9keSdcclxuICAndGQnXHJcbiAgJ3Rmb290J1xyXG4gICd0aCdcclxuICAndGltZSdcclxuICAndGl0bGUnXHJcbiAgJ3RyJ1xyXG4gICd0dCdcclxuICAndSdcclxuICAndmFyJ1xyXG4gICd2aWRlbydcclxuICAneG1wJ1xyXG5dXHJcbm9wZW4gPSAnYXJlYSBiYXNlIGNvbCBjb21tYW5kIGNzcyBlbWJlZCBociBpbWcga2V5Z2VuIG1ldGEgcGFyYW0gc291cmNlIHRyYWNrIHdicicuc3BsaXQgJyAnXHJcbmFsbCA9IGNsb3NlZC5jb25jYXQgb3BlblxyXG5cclxuZXhwb3J0cyA9IHt9XHJcbiMgcmVnaXN0ZXIgc2VtYW50aWMvc3RydWN0dXJhbCBhbGlhc2VzXHJcbmZvciBsb29wTmFtZSBpbiBhbGxcclxuICBkbyAodGFnID0gbG9vcE5hbWUpIC0+XHJcbiAgICBtZXRob2QgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICAgICAgZGVmYXVsdHMgPVxyXG4gICAgICAgIHByb3BzOiB7fVxyXG4gICAgICAgIHN0eWxlczoge31cclxuICAgICAgICBldmVudHM6IHt9XHJcblxyXG4gICAgICBvYmouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zXHJcbiAgICAgIHJldCA9IG5vZGVGYWN0b3J5IHRhZywgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuICAgICAgcmV0XHJcbiAgICBPSi5ub2Rlcy5yZWdpc3RlciB0YWcsIG1ldGhvZFxyXG4gICAgZXhwb3J0c1t0YWddID0gbWV0aG9kXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuIyMjXHJcbkNyZWF0ZSBhbiBPSiBJbnB1dCBPYmplY3QgdGhyb3VnaCBPSi5ub2Rlcy5pbnB1dFxyXG4jIyNcclxuaW5wdXQgPSAob3B0aW9ucyA9IE9KLm9iamVjdCgpLCBvd25lcikgLT5cclxuICBpZiBub3Qgb3duZXIgdGhlbiB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgYW4gaW5wdXQgd2l0aG91dCBhIHBhcmVudCdcclxuICBpZiBub3Qgb3B0aW9ucy5wcm9wcyBvciBub3Qgb3B0aW9ucy5wcm9wcy50eXBlIHRoZW4gdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIGFuIGlucHV0IHdpdGhvdXQgYW4gaW5wdXQgdHlwZSdcclxuICByZXQgPSBvd25lci5tYWtlICdpbnB1dCcsIG9wdGlvbnNcclxuICByZXQuYWRkICdpbnB1dE5hbWUnLCBvcHRpb25zLnByb3BzLnR5cGVcclxuICByZXRcclxuICAgIFxyXG5PSi5yZWdpc3RlciAnaW5wdXQnLCBpbnB1dFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHV0IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyICQsIE5vZGUsIE9KLCBtZXRob2RzO1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbiQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cbm1ldGhvZHMgPSB7fTtcblxuTm9kZSA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gTm9kZShlbGVtZW50LCBwYXJlbnQpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICB9XG5cbiAgTm9kZS5wcm90b3R5cGUubWFrZSA9IGZ1bmN0aW9uKHRhZ05hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgbWV0aG9kLCBuZXdFbGVtZW50O1xuICAgIGlmICh0YWdOYW1lLm1ha2UpIHtcbiAgICAgIHJldHVybiB0YWdOYW1lLm1ha2UodGhpcywgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1ldGhvZCA9IG1ldGhvZHNbdGFnTmFtZV07XG4gICAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBtZXRob2Qob3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZXRob2QgPSBPSi5jb21wb25lbnRzW3RhZ05hbWVdIHx8IE9KLmNvbnRyb2xzW3RhZ05hbWVdIHx8IE9KLmlucHV0c1t0YWdOYW1lXTtcbiAgICAgICAgaWYgKG1ldGhvZCkge1xuICAgICAgICAgIHJldHVybiBtZXRob2Qob3B0aW9ucywgdGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3RWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQodGhpcy5lbGVtZW50LCB0YWdOYW1lLCBvcHRpb25zKTtcbiAgICAgICAgICByZXR1cm4gbmV3IE5vZGUobmV3RWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgTm9kZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpc1tuYW1lXSA9IHZhbHVlO1xuICB9O1xuXG4gIHJldHVybiBOb2RlO1xuXG59KSgpO1xuXG5bJ29uJywgJ2VtcHR5JywgJ3RleHQnLCAncmVtb3ZlQ2xhc3MnLCAnYWRkQ2xhc3MnLCAnaGFzQ2xhc3MnLCAnc2hvdycsICdoaWRlJywgJ2F0dHInLCAnY3NzJywgJ3JlbW92ZScsICdhcHBlbmQnLCAndmFsJywgJ2h0bWwnXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICByZXR1cm4gTm9kZS5wcm90b3R5cGVbbWV0aG9kXSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBqUXVlcnlXcmFwcGVyO1xuICAgIGpRdWVyeVdyYXBwZXIgPSB0aGlzLiQ7XG4gICAgcmV0dXJuIGpRdWVyeVdyYXBwZXJbbWV0aG9kXS5hcHBseShqUXVlcnlXcmFwcGVyLCBhcmd1bWVudHMpO1xuICB9O1xufSk7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShOb2RlLnByb3RvdHlwZSwgJyQnLCB7XG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGpRdWVyeVdyYXBwZXI7XG4gICAgalF1ZXJ5V3JhcHBlciA9ICQodGhpcy5lbGVtZW50KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJyQnLCB7XG4gICAgICB2YWx1ZTogalF1ZXJ5V3JhcHBlclxuICAgIH0pO1xuICAgIHJldHVybiBqUXVlcnlXcmFwcGVyO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBOb2RlO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWtNNlhGeHdZV05yWVdkbGMxeGNiMnBjWEhOeVkxeGNZMjltWm1WbFhGeGtiMjFjWEc1dlpHVXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRU3hKUVVGQk96dEJRVUZCTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1QwRkJVanM3UVVGRFRDeERRVUZCTEVkQlFVa3NUMEZCUVN4RFFVRlJMRkZCUVZJN08wRkJUMG9zVDBGQlFTeEhRVUZWT3p0QlFVdEtPMFZCU1ZNc1kwRkJReXhQUVVGRUxFVkJRVmNzVFVGQldEdEpRVUZETEVsQlFVTXNRMEZCUVN4VlFVRkVPMFZCUVVRN08ybENRVVZpTEVsQlFVRXNSMEZCVFN4VFFVRkRMRTlCUVVRc1JVRkJWU3hQUVVGV08wRkJRMG9zVVVGQlFUdEpRVUZCTEVsQlFVY3NUMEZCVHl4RFFVRkRMRWxCUVZnN1lVRkRSU3hQUVVGUExFTkJRVU1zU1VGQlVpeERRVUZoTEVsQlFXSXNSVUZCYlVJc1QwRkJia0lzUlVGRVJqdExRVUZCTEUxQlFVRTdUVUZIUlN4TlFVRkJMRWRCUVZNc1QwRkJVU3hEUVVGQkxFOUJRVUU3VFVGRGFrSXNTVUZCUnl4TlFVRklPMlZCUTBVc1RVRkJRU3hEUVVGUExFOUJRVkFzUlVGRVJqdFBRVUZCTEUxQlFVRTdVVUZIUlN4TlFVRkJMRWRCUVZNc1JVRkJSU3hEUVVGRExGVkJRVmNzUTBGQlFTeFBRVUZCTEVOQlFXUXNTVUZCTUVJc1JVRkJSU3hEUVVGRExGRkJRVk1zUTBGQlFTeFBRVUZCTEVOQlFYUkRMRWxCUVd0RUxFVkJRVVVzUTBGQlF5eE5RVUZQTEVOQlFVRXNUMEZCUVR0UlFVTnlSU3hKUVVGSExFMUJRVWc3YVVKQlEwVXNUVUZCUVN4RFFVRlBMRTlCUVZBc1JVRkJaMElzU1VGQmFFSXNSVUZFUmp0VFFVRkJMRTFCUVVFN1ZVRkhSU3hWUVVGQkxFZEJRV0VzWVVGQlFTeERRVUZqTEVsQlFVa3NRMEZCUXl4UFFVRnVRaXhGUVVFMFFpeFBRVUUxUWl4RlFVRnhReXhQUVVGeVF6dHBRa0ZEVkN4SlFVRkJMRWxCUVVFc1EwRkJTeXhWUVVGTUxFVkJTazQ3VTBGS1JqdFBRVXBHT3p0RlFVUkpPenRwUWtGalRpeEhRVUZCTEVkQlFVc3NVMEZCUXl4SlFVRkVMRVZCUVU4c1MwRkJVRHRYUVVOSUxFbEJRVXNzUTBGQlFTeEpRVUZCTEVOQlFVd3NSMEZCWVR0RlFVUldPenM3T3pzN1FVRkhVQ3hEUVVGRExFbEJRVVFzUlVGQlR5eFBRVUZRTEVWQlFXZENMRTFCUVdoQ0xFVkJRWGRDTEdGQlFYaENMRVZCUVhWRExGVkJRWFpETEVWQlFXMUVMRlZCUVc1RUxFVkJRU3RFTEUxQlFTOUVMRVZCUVhWRkxFMUJRWFpGTEVWQlFTdEZMRTFCUVM5RkxFVkJRWFZHTEV0QlFYWkdMRVZCUVRoR0xGRkJRVGxHTEVWQlFYZEhMRkZCUVhoSExFVkJRV3RJTEV0QlFXeElMRVZCUVhsSUxFMUJRWHBJTEVOQlFXZEpMRU5CUVVNc1QwRkJha2tzUTBGQmVVa3NVMEZCUXl4TlFVRkVPMU5CUTNaSkxFbEJRVWtzUTBGQlF5eFRRVUZWTEVOQlFVRXNUVUZCUVN4RFFVRm1MRWRCUVhsQ0xGTkJRVUU3UVVGRGRrSXNVVUZCUVR0SlFVRkJMR0ZCUVVFc1IwRkJaMElzU1VGQlF5eERRVUZCTzFkQlEycENMR0ZCUVdNc1EwRkJRU3hOUVVGQkxFTkJRVThzUTBGQlF5eExRVUYwUWl4RFFVRTBRaXhoUVVFMVFpeEZRVUV5UXl4VFFVRXpRenRGUVVaMVFqdEJRVVE0Unl4RFFVRjZTVHM3UVVGTlFTeE5RVUZOTEVOQlFVTXNZMEZCVUN4RFFVRnpRaXhKUVVGSkxFTkJRVU1zVTBGQk0wSXNSVUZCYzBNc1IwRkJkRU1zUlVGRFJUdEZRVUZCTEVkQlFVRXNSVUZCU3l4VFFVRkJPMEZCUTBnc1VVRkJRVHRKUVVGQkxHRkJRVUVzUjBGQlowSXNRMEZCUVN4RFFVRkZMRWxCUVVrc1EwRkJReXhQUVVGUU8wbEJRMmhDTEUxQlFVMHNRMEZCUXl4alFVRlFMRU5CUVhOQ0xFbEJRWFJDTEVWQlFUUkNMRWRCUVRWQ0xFVkJRMFU3VFVGQlFTeExRVUZCTEVWQlFVOHNZVUZCVUR0TFFVUkdPMWRCUjBFN1JVRk1SeXhEUVVGTU8wTkJSRVk3TzBGQlZVRXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklrOUtJRDBnY21WeGRXbHlaU0FuTGk0dmIyb25YSEpjYmlRZ1BTQnlaWEYxYVhKbElDZHFjWFZsY25rblhISmNibHh5WEc0aklDTWdaRzl0WEhKY2JseHlYRzVjY2x4dUl5QkZlSFJsYm1RZ1lXNGdiMkpxWldOMElIZHBkR2dnVDBvZ1JFOU5JRzFsZEdodlpITWdZVzVrSUhCeWIzQmxjblJwWlhOY2NseHVYSEpjYm0xbGRHaHZaSE1nUFNCN2ZWeHlYRzVjY2x4dVhISmNiaU1nTFNCZ1FHVnNZQ0JQWW1wbFkzUWdkRzhnWlhoMFpXNWtYSEpjYmlNZ0xTQmdjR0Z5Wlc1MFlDQndZWEpsYm5RZ2IySnFaV04wSUhSdklIZG9hV05vSUdCQVpXeGdJSGRwYkd3Z1ltVWdZWEJ3Wlc1a1pXUmNjbHh1WTJ4aGMzTWdUbTlrWlZ4eVhHNGdJRnh5WEc0Z0lDTndZWEpsYm5RNklISmxjWFZwY21Vb0p5NHZZbTlrZVNjcFhISmNiaUFnWEhKY2JpQWdZMjl1YzNSeWRXTjBiM0k2SUNoQVpXeGxiV1Z1ZEN3Z2NHRnlaVzUwS1NBdFBseHlYRzVjY2x4dUlDQnRZV3RsT2lBb2RHRm5UbUZ0WlN3Z2IzQjBhVzl1Y3lrZ0xUNWNjbHh1SUNBZ0lHbG1JSFJoWjA1aGJXVXViV0ZyWlNBaklIQnliM1pwWkdWa0lHRWdZM1Z6ZEc5dElHTnZiWEJ2Ym1WdWRDQmthWEpsWTNSc2VWeHlYRzRnSUNBZ0lDQjBZV2RPWVcxbExtMWhhMlVnZEdocGN5d2diM0IwYVc5dWMxeHlYRzRnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0J0WlhSb2IyUWdQU0J0WlhSb2IyUnpXM1JoWjA1aGJXVmRYSEpjYmlBZ0lDQWdJR2xtSUcxbGRHaHZaRnh5WEc0Z0lDQWdJQ0FnSUcxbGRHaHZaQ0J2Y0hScGIyNXpYSEpjYmlBZ0lDQWdJR1ZzYzJWY2NseHVJQ0FnSUNBZ0lDQnRaWFJvYjJRZ1BTQlBTaTVqYjIxd2IyNWxiblJ6VzNSaFowNWhiV1ZkSUc5eUlFOUtMbU52Ym5SeWIyeHpXM1JoWjA1aGJXVmRJRzl5SUU5S0xtbHVjSFYwYzF0MFlXZE9ZVzFsWFZ4eVhHNGdJQ0FnSUNBZ0lHbG1JRzFsZEdodlpGeHlYRzRnSUNBZ0lDQWdJQ0FnYldWMGFHOWtJRzl3ZEdsdmJuTXNJSFJvYVhOY2NseHVJQ0FnSUNBZ0lDQmxiSE5sWEhKY2JpQWdJQ0FnSUNBZ0lDQnVaWGRGYkdWdFpXNTBJRDBnWTNKbFlYUmxSV3hsYldWdWRDQjBhR2x6TG1Wc1pXMWxiblFzSUhSaFowNWhiV1VzSUc5d2RHbHZibk5jY2x4dUlDQWdJQ0FnSUNBZ0lHNWxkeUJPYjJSbEtHNWxkMFZzWlcxbGJuUXBYSEpjYmlBZ1lXUmtPaUFvYm1GdFpTd2dkbUZzZFdVcElDMCtYSEpjYmlBZ0lDQjBhR2x6VzI1aGJXVmRJRDBnZG1Gc2RXVmNjbHh1WEhKY2Jsc25iMjRuTENBblpXMXdkSGtuTENBbmRHVjRkQ2NzSUNkeVpXMXZkbVZEYkdGemN5Y3NJQ2RoWkdSRGJHRnpjeWNzSUNkb1lYTkRiR0Z6Y3ljc0lDZHphRzkzSnl3Z0oyaHBaR1VuTENBbllYUjBjaWNzSUNkamMzTW5MQ0FuY21WdGIzWmxKeXdnSjJGd2NHVnVaQ2NzSUNkMllXd25MQ0FuYUhSdGJDZGRMbVp2Y2tWaFkyZ29LRzFsZEdodlpDa2dMVDVjY2x4dUlDQk9iMlJsTG5CeWIzUnZkSGx3WlZ0dFpYUm9iMlJkSUQwZ0tDa2dMVDVjY2x4dUlDQWdJR3BSZFdWeWVWZHlZWEJ3WlhJZ1BTQkFKRnh5WEc0Z0lDQWdhbEYxWlhKNVYzSmhjSEJsY2x0dFpYUm9iMlJkTG1Gd2NHeDVLR3BSZFdWeWVWZHlZWEJ3WlhJc0lHRnlaM1Z0Wlc1MGN5bGNjbHh1S1Z4eVhHNWNjbHh1VDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtFNXZaR1V1Y0hKdmRHOTBlWEJsTENBbkpDY3NYSEpjYmlBZ1oyVjBPaUFvS1NBdFBseHlYRzRnSUNBZ2FsRjFaWEo1VjNKaGNIQmxjaUE5SUNRb2RHaHBjeTVsYkdWdFpXNTBLVnh5WEc0Z0lDQWdUMkpxWldOMExtUmxabWx1WlZCeWIzQmxjblI1S0hSb2FYTXNJQ2NrSnl4Y2NseHVJQ0FnSUNBZ2RtRnNkV1U2SUdwUmRXVnllVmR5WVhCd1pYSmNjbHh1SUNBZ0lDbGNjbHh1SUNBZ0lHcFJkV1Z5ZVZkeVlYQndaWEpjY2x4dUtWeHlYRzVjY2x4dVhISmNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdUbTlrWlNKZGZRPT0iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgTm9kZSwgTm9kZUZhY3RvcnksIE9KLCBUaGluRE9NLCBfLCBnZXROb2RlRnJvbUZhY3RvcnksXG4gIHNsaWNlID0gW10uc2xpY2U7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuVGhpbkRPTSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUaGluRE9NJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUaGluRE9NJ10gOiBudWxsKTtcblxuTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xuXG5Ob2RlRmFjdG9yeSA9IChmdW5jdGlvbigpIHtcbiAgTm9kZUZhY3RvcnkucHJvdG90eXBlLm9qTm9kZSA9IG51bGw7XG5cbiAgTm9kZUZhY3RvcnkuZ2V0ID0gZnVuY3Rpb24oaWQsIHRhZ05hbWUpIHtcbiAgICB2YXIgZWwsIHJldCwgdGhpbkVsO1xuICAgIGlmICh0YWdOYW1lID09IG51bGwpIHtcbiAgICAgIHRhZ05hbWUgPSAnZGl2JztcbiAgICB9XG4gICAgcmV0ID0gbnVsbDtcbiAgICBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgIHRoaW5FbCA9IE9KLnJlc3RvcmVFbGVtZW50KGVsLCB0YWdOYW1lKTtcbiAgICB9XG4gICAgaWYgKHRoaW5FbCkge1xuICAgICAgcmV0ID0gbmV3IE5vZGVGYWN0b3J5KG51bGwsIG51bGwsIG51bGwsIGZhbHNlLCB0aGluRWwpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIE5vZGVGYWN0b3J5LnByb3RvdHlwZS5fbWFrZUFkZCA9IGZ1bmN0aW9uKHRhZ05hbWUsIGNvdW50KSB7XG4gICAgcmV0dXJuIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKG9wdHMpIHtcbiAgICAgICAgdmFyIG1ldGhvZCwgbnU7XG4gICAgICAgIG1ldGhvZCA9IE9KLm5vZGVzW3RhZ05hbWVdIHx8IE9KLmNvbXBvbmVudHNbdGFnTmFtZV0gfHwgT0ouY29udHJvbHNbdGFnTmFtZV0gfHwgT0ouaW5wdXRzW3RhZ05hbWVdO1xuICAgICAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgICAgbnUgPSBtZXRob2Qob3B0cywgX3RoaXMub2pOb2RlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBudSA9IE9KLmNvbXBvbmVudChudWxsLCBfdGhpcy5vak5vZGUsIHRhZ05hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudTtcbiAgICAgIH07XG4gICAgfSkodGhpcyk7XG4gIH07XG5cbiAgTm9kZUZhY3RvcnkucHJvdG90eXBlLl9tYWtlVW5pcXVlSWQgPSBmdW5jdGlvbihjb3VudCkge1xuICAgIHZhciBpZDtcbiAgICBpZiAoT0ouR0VORVJBVEVfVU5JUVVFX0lEUykge1xuICAgICAgY291bnQgKz0gMTtcbiAgICAgIGlmIChjb3VudCA8PSB0aGlzLm93bmVyLmNvdW50KSB7XG4gICAgICAgIGNvdW50ID0gdGhpcy5vd25lci5jb3VudCArIDE7XG4gICAgICB9XG4gICAgICB0aGlzLm93bmVyLmNvdW50ID0gY291bnQ7XG4gICAgICBpZiAoIXRoaXMub2pOb2RlLmdldElkKCkpIHtcbiAgICAgICAgaWQgPSB0aGlzLm93bmVyLmdldElkKCkgfHwgJyc7XG4gICAgICAgIGlkICs9IHRoaXMub2pOb2RlLnRhZ05hbWUgKyBjb3VudDtcbiAgICAgICAgdGhpcy5vak5vZGUuYXR0cignaWQnLCBpZCk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIE5vZGVGYWN0b3J5LnByb3RvdHlwZS5fYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLm9qTm9kZSkge1xuICAgICAgcmV0dXJuIF8uZm9yT3duKHRoaXMub3B0aW9ucy5ldmVudHMsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgICB2YXIgY2FsbGJhY2ssIGlzTWV0aG9kO1xuICAgICAgICAgIGlzTWV0aG9kID0gcmVxdWlyZSgnLi4vdG9vbHMvaXMnKTtcbiAgICAgICAgICBpZiAoaXNNZXRob2QubWV0aG9kKHZhbCkpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHZhciBldmVudDtcbiAgICAgICAgICAgICAgZXZlbnQgPSAxIDw9IGFyZ3VtZW50cy5sZW5ndGggPyBzbGljZS5jYWxsKGFyZ3VtZW50cywgMCkgOiBbXTtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbC5hcHBseShudWxsLCBldmVudCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgX3RoaXMub2pOb2RlLiQub24oa2V5LCBjYWxsYmFjayk7XG4gICAgICAgICAgICBfdGhpcy5vak5vZGUuYWRkKGtleSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfSkodGhpcykpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBOb2RlRmFjdG9yeSh0YWcxLCBvcHRpb25zMSwgb3duZXIxLCB0aGluTm9kZSkge1xuICAgIHRoaXMudGFnID0gdGFnMTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zMTtcbiAgICB0aGlzLm93bmVyID0gb3duZXIxO1xuICAgIHRoaXMudGhpbk5vZGUgPSB0aGluTm9kZSAhPSBudWxsID8gdGhpbk5vZGUgOiBudWxsO1xuICAgIGlmICh0aGlzLnRhZyAmJiAhdGhpcy50aGluTm9kZSkge1xuICAgICAgdGhpcy50aGluTm9kZSA9IG5ldyBUaGluRE9NKHRoaXMudGFnLCB0aGlzLm9wdGlvbnMucHJvcHMpO1xuICAgICAgdGhpcy50aGluTm9kZS5hZGQoJ3RhZ05hbWUnLCB0aGlzLnRhZyk7XG4gICAgICB0aGlzLnRoaW5Ob2RlLmNzcyh0aGlzLm9wdGlvbnMuc3R5bGVzKTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGV4dCkge1xuICAgICAgICB0aGlzLnRoaW5Ob2RlLnRleHQodGhpcy5vcHRpb25zLnRleHQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5vd25lcikge1xuICAgICAgdGhpcy5tYWtlKCk7XG4gICAgfVxuICB9XG5cbiAgTm9kZUZhY3RvcnkucHJvdG90eXBlLmFkZE1ha2VNZXRob2QgPSBmdW5jdGlvbihjb3VudCkge1xuICAgIHZhciBtZXRob2RzO1xuICAgIG1ldGhvZHMgPSBPSi5vYmplY3QoKTtcbiAgICB0aGlzLm9qTm9kZS5tYWtlID0gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odGFnTmFtZSwgb3B0cykge1xuICAgICAgICB2YXIgbWV0aG9kO1xuICAgICAgICBtZXRob2QgPSBtZXRob2RzW3RhZ05hbWVdO1xuICAgICAgICBpZiAoIW1ldGhvZCkge1xuICAgICAgICAgIG1ldGhvZCA9IF90aGlzLl9tYWtlQWRkKHRhZ05hbWUsIF90aGlzLm9qTm9kZSwgY291bnQpO1xuICAgICAgICAgIG1ldGhvZHNbdGFnTmFtZV0gPSBtZXRob2Q7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1ldGhvZChvcHRzKTtcbiAgICAgIH07XG4gICAgfSkodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMub2pOb2RlO1xuICB9O1xuXG4gIE5vZGVGYWN0b3J5LnByb3RvdHlwZS5tYWtlID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvdW50LCBmaW5hbGl6ZSwgcmVmO1xuICAgIHRoaXMub2pOb2RlID0gbnVsbDtcbiAgICBpZiAoKHJlZiA9IHRoaXMudGhpbk5vZGUpICE9IG51bGwgPyByZWYuaXNGdWxseUluaXQgOiB2b2lkIDApIHtcbiAgICAgIHRoaXMub2pOb2RlID0gdGhpcy50aGluTm9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vak5vZGUgPSBuZXcgTm9kZSh0aGlzLnRoaW5Ob2RlLCB0aGlzLm93bmVyKTtcbiAgICAgIGNvdW50ID0gKHRoaXMub3duZXIuY291bnQgKyAxKSB8fCAxO1xuICAgICAgaWYgKHRoaXMudGhpbk5vZGUudGFnTmFtZSAhPT0gJ2JvZHknICYmICF0aGlzLnRoaW5Ob2RlLmlzSW5ET00gJiYgIXRoaXMub2pOb2RlLmlzSW5ET00pIHtcbiAgICAgICAgdGhpcy5fbWFrZVVuaXF1ZUlkKGNvdW50KTtcbiAgICAgICAgdGhpcy5vd25lci5hcHBlbmQodGhpcy5vak5vZGVbMF0pO1xuICAgICAgICB0aGlzLl9iaW5kRXZlbnRzKCk7XG4gICAgICB9XG4gICAgICB0aGlzLnRoaW5Ob2RlLmlzSW5ET00gPSB0cnVlO1xuICAgICAgdGhpcy5vak5vZGUuaXNJbkRPTSA9IHRydWU7XG4gICAgICB0aGlzLmFkZE1ha2VNZXRob2QoY291bnQpO1xuICAgICAgdGhpcy5vak5vZGUuaXNGdWxseUluaXQgPSB0cnVlO1xuICAgICAgZmluYWxpemUgPSBfLm9uY2UodGhpcy5vak5vZGUuZmluYWxpemUgfHwgT0oubm9vcCk7XG4gICAgICB0aGlzLm9qTm9kZS5maW5hbGl6ZSA9IGZpbmFsaXplO1xuICAgICAgZmluYWxpemUodGhpcy5vak5vZGUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vak5vZGU7XG4gIH07XG5cbiAgcmV0dXJuIE5vZGVGYWN0b3J5O1xuXG59KSgpO1xuXG5nZXROb2RlRnJvbUZhY3RvcnkgPSBmdW5jdGlvbih0YWcsIG9wdGlvbnMsIG93bmVyLCBpc0NhbGxlZEZyb21GYWN0b3J5LCBub2RlKSB7XG4gIHJldHVybiBuZXcgTm9kZShjcmVhdGVFbGVtZW50KG93bmVyLmVsZW1lbnQsIHRhZyB8fCAnZGl2Jywgb3B0aW9ucykpO1xufTtcblxuT0oucmVnaXN0ZXIoJ25vZGVGYWN0b3J5JywgZ2V0Tm9kZUZyb21GYWN0b3J5KTtcblxubW9kdWxlLmV4cG9ydHMgPSBnZXROb2RlRnJvbUZhY3Rvcnk7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4a2IyMWNYRzV2WkdWR1lXTjBiM0o1TG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPMEZCUVVFc1NVRkJRU3h4UkVGQlFUdEZRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlEwb3NUMEZCUVN4SFFVRlZMRTlCUVVFc1EwRkJVU3hUUVVGU096dEJRVU5XTEVsQlFVRXNSMEZCVHl4UFFVRkJMRU5CUVZFc1VVRkJVanM3UVVFclJVUTdkMEpCUlVvc1RVRkJRU3hIUVVGUk96dEZRVVZTTEZkQlFVTXNRMEZCUVN4SFFVRkVMRWRCUVUwc1UwRkJReXhGUVVGRUxFVkJRVXNzVDBGQlREdEJRVU5LTEZGQlFVRTdPMDFCUkZNc1ZVRkJWVHM3U1VGRGJrSXNSMEZCUVN4SFFVRk5PMGxCUTA0c1JVRkJRU3hIUVVGTExGRkJRVkVzUTBGQlF5eGpRVUZVTEVOQlFYZENMRVZCUVhoQ08wbEJRMHdzU1VGQlJ5eEZRVUZJTzAxQlEwVXNUVUZCUVN4SFFVRlRMRVZCUVVVc1EwRkJReXhqUVVGSUxFTkJRV3RDTEVWQlFXeENMRVZCUVhOQ0xFOUJRWFJDTEVWQlJGZzdPMGxCUlVFc1NVRkJSeXhOUVVGSU8wMUJRMFVzUjBGQlFTeEhRVUZWTEVsQlFVRXNWMEZCUVN4RFFVRlpMRWxCUVZvc1JVRkJhMElzU1VGQmJFSXNSVUZCZDBJc1NVRkJlRUlzUlVGQk9FSXNTMEZCT1VJc1JVRkJjVU1zVFVGQmNrTXNSVUZFV2pzN1YwRkhRVHRGUVZKSk96dDNRa0ZWVGl4UlFVRkJMRWRCUVZVc1UwRkJReXhQUVVGRUxFVkJRVlVzUzBGQlZqdFhRVU5TTEVOQlFVRXNVMEZCUVN4TFFVRkJPMkZCUVVFc1UwRkJReXhKUVVGRU8wRkJRMFVzV1VGQlFUdFJRVUZCTEUxQlFVRXNSMEZCVXl4RlFVRkZMRU5CUVVNc1MwRkJUU3hEUVVGQkxFOUJRVUVzUTBGQlZDeEpRVUZ4UWl4RlFVRkZMRU5CUVVNc1ZVRkJWeXhEUVVGQkxFOUJRVUVzUTBGQmJrTXNTVUZCSzBNc1JVRkJSU3hEUVVGRExGRkJRVk1zUTBGQlFTeFBRVUZCTEVOQlFUTkVMRWxCUVhWRkxFVkJRVVVzUTBGQlF5eE5RVUZQTEVOQlFVRXNUMEZCUVR0UlFVTXhSaXhKUVVGSExFMUJRVWc3VlVGRFJTeEZRVUZCTEVkQlFVc3NUVUZCUVN4RFFVRlBMRWxCUVZBc1JVRkJZU3hMUVVGRExFTkJRVUVzVFVGQlpDeEZRVVJRTzFOQlFVRXNUVUZCUVR0VlFVZEZMRVZCUVVFc1IwRkJTeXhGUVVGRkxFTkJRVU1zVTBGQlNDeERRVUZoTEVsQlFXSXNSVUZCYlVJc1MwRkJReXhEUVVGQkxFMUJRWEJDTEVWQlFUUkNMRTlCUVRWQ0xFVkJTRkE3TzJWQlMwRTdUVUZRUmp0SlFVRkJMRU5CUVVFc1EwRkJRU3hEUVVGQkxFbEJRVUU3UlVGRVVUczdkMEpCVlZZc1lVRkJRU3hIUVVGbExGTkJRVU1zUzBGQlJEdEJRVU5pTEZGQlFVRTdTVUZCUVN4SlFVRkhMRVZCUVVVc1EwRkJReXh0UWtGQlRqdE5RVU5GTEV0QlFVRXNTVUZCVXp0TlFVTlVMRWxCUVVjc1MwRkJRU3hKUVVGVExFbEJRVU1zUTBGQlFTeExRVUZMTEVOQlFVTXNTMEZCYmtJN1VVRkJPRUlzUzBGQlFTeEhRVUZSTEVsQlFVTXNRMEZCUVN4TFFVRkxMRU5CUVVNc1MwRkJVQ3hIUVVGbExFVkJRWEpFT3p0TlFVTkJMRWxCUVVNc1EwRkJRU3hMUVVGTExFTkJRVU1zUzBGQlVDeEhRVUZsTzAxQlJXWXNTVUZCUnl4RFFVRkpMRWxCUVVNc1EwRkJRU3hOUVVGTkxFTkJRVU1zUzBGQlVpeERRVUZCTEVOQlFWQTdVVUZEUlN4RlFVRkJMRWRCUVVzc1NVRkJReXhEUVVGQkxFdEJRVXNzUTBGQlF5eExRVUZRTEVOQlFVRXNRMEZCUVN4SlFVRnJRanRSUVVOMlFpeEZRVUZCTEVsQlFVMHNTVUZCUXl4RFFVRkJMRTFCUVUwc1EwRkJReXhQUVVGU0xFZEJRV3RDTzFGQlEzaENMRWxCUVVNc1EwRkJRU3hOUVVGTkxFTkJRVU1zU1VGQlVpeERRVUZoTEVsQlFXSXNSVUZCYlVJc1JVRkJia0lzUlVGSVJqdFBRVXhHT3p0RlFVUmhPenQzUWtGWlppeFhRVUZCTEVkQlFXRXNVMEZCUVR0SlFVTllMRWxCUVVjc1NVRkJReXhEUVVGQkxFMUJRVW83WVVGQlowSXNRMEZCUXl4RFFVRkRMRTFCUVVZc1EwRkJVeXhKUVVGRExFTkJRVUVzVDBGQlR5eERRVUZETEUxQlFXeENMRVZCUVRCQ0xFTkJRVUVzVTBGQlFTeExRVUZCTzJWQlFVRXNVMEZCUXl4SFFVRkVMRVZCUVUwc1IwRkJUanRCUVVONFF5eGpRVUZCTzFWQlFVRXNVVUZCUVN4SFFVRlhMRTlCUVVFc1EwRkJVU3hoUVVGU08xVkJRMWdzU1VGQlJ5eFJRVUZSTEVOQlFVTXNUVUZCVkN4RFFVRm5RaXhIUVVGb1FpeERRVUZJTzFsQlEwVXNVVUZCUVN4SFFVRlhMRk5CUVVFN1FVRkJZeXhyUWtGQlFUdGpRVUZpTzNGQ1FVRmhMRWRCUVVFc1lVRkJTU3hMUVVGS08xbEJRV1E3V1VGRFdDeExRVUZETEVOQlFVRXNUVUZCVFN4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGV0xFTkJRV0VzUjBGQllpeEZRVUZyUWl4UlFVRnNRanRaUVVOQkxFdEJRVU1zUTBGQlFTeE5RVUZOTEVOQlFVTXNSMEZCVWl4RFFVRlpMRWRCUVZvc1JVRkJhVUlzVVVGQmFrSTdiVUpCUTBFc1MwRktSanM3VVVGR2QwTTdUVUZCUVN4RFFVRkJMRU5CUVVFc1EwRkJRU3hKUVVGQkxFTkJRVEZDTEVWQlFXaENPenRGUVVSWE96dEZRVk5CTEhGQ1FVRkRMRWxCUVVRc1JVRkJUeXhSUVVGUUxFVkJRV2xDTEUxQlFXcENMRVZCUVhsQ0xGRkJRWHBDTzBsQlFVTXNTVUZCUXl4RFFVRkJMRTFCUVVRN1NVRkJUU3hKUVVGRExFTkJRVUVzVlVGQlJEdEpRVUZWTEVsQlFVTXNRMEZCUVN4UlFVRkVPMGxCUVZFc1NVRkJReXhEUVVGQkxEaENRVUZFTEZkQlFWazdTVUZEYUVRc1NVRkJSeXhKUVVGRExFTkJRVUVzUjBGQlJDeEpRVUZUTEVOQlFVa3NTVUZCUXl4RFFVRkJMRkZCUVdwQ08wMUJRMFVzU1VGQlF5eERRVUZCTEZGQlFVUXNSMEZCWjBJc1NVRkJRU3hQUVVGQkxFTkJRVkVzU1VGQlF5eERRVUZCTEVkQlFWUXNSVUZCWXl4SlFVRkRMRU5CUVVFc1QwRkJUeXhEUVVGRExFdEJRWFpDTzAxQlEyaENMRWxCUVVNc1EwRkJRU3hSUVVGUkxFTkJRVU1zUjBGQlZpeERRVUZqTEZOQlFXUXNSVUZCZVVJc1NVRkJReXhEUVVGQkxFZEJRVEZDTzAxQlEwRXNTVUZCUXl4RFFVRkJMRkZCUVZFc1EwRkJReXhIUVVGV0xFTkJRV01zU1VGQlF5eERRVUZCTEU5QlFVOHNRMEZCUXl4TlFVRjJRanROUVVOQkxFbEJRVWNzU1VGQlF5eERRVUZCTEU5QlFVOHNRMEZCUXl4SlFVRmFPMUZCUVhOQ0xFbEJRVU1zUTBGQlFTeFJRVUZSTEVOQlFVTXNTVUZCVml4RFFVRmxMRWxCUVVNc1EwRkJRU3hQUVVGUExFTkJRVU1zU1VGQmVFSXNSVUZCZEVJN1QwRktSanM3U1VGTlFTeEpRVUZITEVsQlFVTXNRMEZCUVN4TFFVRktPMDFCUTBVc1NVRkJReXhEUVVGQkxFbEJRVVFzUTBGQlFTeEZRVVJHT3p0RlFWQlhPenQzUWtGVllpeGhRVUZCTEVkQlFXVXNVMEZCUXl4TFFVRkVPMEZCUTJJc1VVRkJRVHRKUVVGQkxFOUJRVUVzUjBGQlZTeEZRVUZGTEVOQlFVTXNUVUZCU0N4RFFVRkJPMGxCUTFZc1NVRkJReXhEUVVGQkxFMUJRVTBzUTBGQlF5eEpRVUZTTEVkQlFXVXNRMEZCUVN4VFFVRkJMRXRCUVVFN1lVRkJRU3hUUVVGRExFOUJRVVFzUlVGQlZTeEpRVUZXTzBGQlEySXNXVUZCUVR0UlFVRkJMRTFCUVVFc1IwRkJVeXhQUVVGUkxFTkJRVUVzVDBGQlFUdFJRVU5xUWl4SlFVRkhMRU5CUVVrc1RVRkJVRHRWUVVORkxFMUJRVUVzUjBGQlV5eExRVUZETEVOQlFVRXNVVUZCUkN4RFFVRlZMRTlCUVZZc1JVRkJiVUlzUzBGQlF5eERRVUZCTEUxQlFYQkNMRVZCUVRSQ0xFdEJRVFZDTzFWQlExUXNUMEZCVVN4RFFVRkJMRTlCUVVFc1EwRkJVaXhIUVVGdFFpeFBRVVp5UWpzN1pVRkhRU3hOUVVGQkxFTkJRVThzU1VGQlVEdE5RVXhoTzBsQlFVRXNRMEZCUVN4RFFVRkJMRU5CUVVFc1NVRkJRVHRYUVUxbUxFbEJRVU1zUTBGQlFUdEZRVkpaT3p0M1FrRlZaaXhKUVVGQkxFZEJRVTBzVTBGQlFUdEJRVVZLTEZGQlFVRTdTVUZCUVN4SlFVRkRMRU5CUVVFc1RVRkJSQ3hIUVVGVk8wbEJSVllzZFVOQlFWa3NRMEZCUlN4dlFrRkJaRHROUVVFclFpeEpRVUZETEVOQlFVRXNUVUZCUkN4SFFVRlZMRWxCUVVNc1EwRkJRU3hUUVVFeFF6dExRVUZCTEUxQlFVRTdUVUZQUlN4SlFVRkRMRU5CUVVFc1RVRkJSQ3hIUVVGakxFbEJRVUVzU1VGQlFTeERRVUZMTEVsQlFVTXNRMEZCUVN4UlFVRk9MRVZCUVdkQ0xFbEJRVU1zUTBGQlFTeExRVUZxUWp0TlFVTmtMRXRCUVVFc1IwRkJVU3hEUVVGRExFbEJRVU1zUTBGQlFTeExRVUZMTEVOQlFVTXNTMEZCVUN4SFFVRmxMRU5CUVdoQ0xFTkJRVUVzU1VGQmMwSTdUVUZIT1VJc1NVRkJSeXhKUVVGRExFTkJRVUVzVVVGQlVTeERRVUZETEU5QlFWWXNTMEZCZFVJc1RVRkJka0lzU1VGQmEwTXNRMEZCU1N4SlFVRkRMRU5CUVVFc1VVRkJVU3hEUVVGRExFOUJRV2hFTEVsQlFUUkVMRU5CUVVrc1NVRkJReXhEUVVGQkxFMUJRVTBzUTBGQlF5eFBRVUV6UlR0UlFVTkZMRWxCUVVNc1EwRkJRU3hoUVVGRUxFTkJRV1VzUzBGQlpqdFJRVU5CTEVsQlFVTXNRMEZCUVN4TFFVRkxMRU5CUVVNc1RVRkJVQ3hEUVVGakxFbEJRVU1zUTBGQlFTeE5RVUZQTEVOQlFVRXNRMEZCUVN4RFFVRjBRanRSUVVWQkxFbEJRVU1zUTBGQlFTeFhRVUZFTEVOQlFVRXNSVUZLUmpzN1RVRk5RU3hKUVVGRExFTkJRVUVzVVVGQlVTeERRVUZETEU5QlFWWXNSMEZCYjBJN1RVRkRjRUlzU1VGQlF5eERRVUZCTEUxQlFVMHNRMEZCUXl4UFFVRlNMRWRCUVd0Q08wMUJSMnhDTEVsQlFVTXNRMEZCUVN4aFFVRkVMRU5CUVdVc1MwRkJaanROUVVkQkxFbEJRVU1zUTBGQlFTeE5RVUZOTEVOQlFVTXNWMEZCVWl4SFFVRnpRanROUVVkMFFpeFJRVUZCTEVkQlFWY3NRMEZCUXl4RFFVRkRMRWxCUVVZc1EwRkJUeXhKUVVGRExFTkJRVUVzVFVGQlRTeERRVUZETEZGQlFWSXNTVUZCYjBJc1JVRkJSU3hEUVVGRExFbEJRVGxDTzAxQlExZ3NTVUZCUXl4RFFVRkJMRTFCUVUwc1EwRkJReXhSUVVGU0xFZEJRVzFDTzAxQlEyNUNMRkZCUVVFc1EwRkJVeXhKUVVGRExFTkJRVUVzVFVGQlZpeEZRVGRDUmpzN1YwRXJRa0VzU1VGQlF5eERRVUZCTzBWQmJrTkhPenM3T3pzN1FVRnhRMUlzYTBKQlFVRXNSMEZCY1VJc1UwRkJReXhIUVVGRUxFVkJRVTBzVDBGQlRpeEZRVUZsTEV0QlFXWXNSVUZCYzBJc2JVSkJRWFJDTEVWQlFUSkRMRWxCUVRORE8xTkJRMllzU1VGQlFTeEpRVUZCTEVOQlFVc3NZVUZCUVN4RFFVRmpMRXRCUVVzc1EwRkJReXhQUVVGd1FpeEZRVUUyUWl4SFFVRkJMRWxCUVU4c1MwRkJjRU1zUlVGQk1rTXNUMEZCTTBNc1EwRkJURHRCUVVSbE96dEJRVWx5UWl4RlFVRkZMRU5CUVVNc1VVRkJTQ3hEUVVGWkxHRkJRVm9zUlVGQk1rSXNhMEpCUVROQ096dEJRVVZCTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0lpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpQU2lBOUlISmxjWFZwY21VZ0p5NHVMMjlxSjF4eVhHNWZJRDBnY21WeGRXbHlaU0FuYkc5a1lYTm9KMXh5WEc1VWFHbHVSRTlOSUQwZ2NtVnhkV2x5WlNBbmRHaHBibVJ2YlNkY2NseHVUbTlrWlNBOUlISmxjWFZwY21VZ0p5NHZibTlrWlNkY2NseHVYSEpjYmlOamJHOXpaV1FnUFNBbllTQmhZbUp5SUdGamNtOXVlVzBnWVdSa2NtVnpjeUJoY0hCc1pYUWdZWEowYVdOc1pTQmhjMmxrWlNCaGRXUnBieUJpSUdKa2J5QmlhV2NnWW14dlkydHhkVzkwWlNCaWIyUjVJR0oxZEhSdmJpQmpZVzUyWVhNZ1kyRndkR2x2YmlCalpXNTBaWElnWTJsMFpTQmpiMlJsSUdOdmJHZHliM1Z3SUdOdmJXMWhibVFnWkdGMFlXeHBjM1FnWkdRZ1pHVnNJR1JsZEdGcGJITWdaR1p1SUdScGNpQmthWFlnWkd3Z1pIUWdaVzBnWlcxaVpXUWdabWxsYkdSelpYUWdabWxuWTJGd2RHbHZiaUJtYVdkMWNtVWdabTl1ZENCbWIyOTBaWElnWm05eWJTQm1jbUZ0WlhObGRDQm9NU0JvTWlCb015Qm9OQ0JvTlNCb05pQm9aV0ZrSUdobFlXUmxjaUJvWjNKdmRYQWdhSFJ0YkNCcElHbG1jbUZ0WlNCcGJuTWdhMlY1WjJWdUlHdGlaQ0JzWVdKbGJDQnNaV2RsYm1RZ2JHa2diV0Z3SUcxaGNtc2diV1Z1ZFNCdFpYUmxjaUJ1WVhZZ2JtOW1jbUZ0WlhNZ2JtOXpZM0pwY0hRZ2IySnFaV04wSUc5c0lHOXdkR2R5YjNWd0lHOXdkR2x2YmlCdmRYUndkWFFnY0NCd2NtVWdjSEp2WjNKbGMzTWdjU0J5Y0NCeWRDQnlkV0o1SUhNZ2MyRnRjQ0J6WTNKcGNIUWdjMlZqZEdsdmJpQnpaV3hsWTNRZ2MyMWhiR3dnYzI5MWNtTmxJSE53WVc0Z2MzUnlhV3RsSUhOMGNtOXVaeUJ6ZEhsc1pTQnpkV0lnYzNWdGJXRnllU0J6ZFhBZ2RHRmliR1VnZEdKdlpIa2dkR1FnZEdWNGRHRnlaV0VnZEdadmIzUWdkR2dnZEdobFlXUWdkR2x0WlNCMGFYUnNaU0IwY2lCMGRDQjFJSFZzSUhaaGNpQjJhV1JsYnlCM1luSWdlRzF3Snk1emNHeHBkQ0FuSUNkY2NseHVJMjl3Wlc0Z1BTQW5ZWEpsWVNCaVlYTmxJR0p5SUdOdmJDQmpiMjF0WVc1a0lHTnpjeUFoUkU5RFZGbFFSU0JsYldKbFpDQm9jaUJwYldjZ2FXNXdkWFFnYTJWNVoyVnVJR3hwYm1zZ2JXVjBZU0J3WVhKaGJTQnpiM1Z5WTJVZ2RISmhZMnNnZDJKeUp5NXpjR3hwZENBbklDZGNjbHh1STF4eVhHNGpibVZ6ZEdGaWJHVk9iMlJsVG1GdFpYTWdQU0JiWEhKY2JpTWdJQ2RrYVhZblhISmNiaU1nSUNkemNHRnVKMXh5WEc0aklDQW5hREVuWEhKY2JpTWdJQ2RvTWlkY2NseHVJeUFnSjJnekoxeHlYRzRqSUNBbmFEUW5YSEpjYmlNZ0lDZG9OU2RjY2x4dUl5QWdKMmcySjF4eVhHNGpJQ0FuY0NkY2NseHVJeUFnSjJacFpXeGtjMlYwSjF4eVhHNGpJQ0FuYzJWc1pXTjBKMXh5WEc0aklDQW5iMnduWEhKY2JpTWdJQ2QxYkNkY2NseHVJeUFnSjNSaFlteGxKMXh5WEc0alhWeHlYRzRqWEhKY2JpTWpWR2hwY3lCc2FYTjBJR2x6SUc1dmRDQjVaWFFnWlhob1lYVnpkR2wyWlN3Z2FuVnpkQ0JsZUdOc2RXUmxJSFJvWlNCdlluWnBiM1Z6WEhKY2JpTnViMjVPWlhOMFlXSnNaVTV2WkdWeklEMGdXMXh5WEc0aklDQW5iR2tuWEhKY2JpTWdJQ2RzWldkbGJtUW5YSEpjYmlNZ0lDZDBjaWRjY2x4dUl5QWdKM1JrSjF4eVhHNGpJQ0FuYjNCMGFXOXVKMXh5WEc0aklDQW5ZbTlrZVNkY2NseHVJeUFnSjJobFlXUW5YSEpjYmlNZ0lDZHpiM1Z5WTJVblhISmNiaU1nSUNkMFltOWtlU2RjY2x4dUl5QWdKM1JtYjI5MEoxeHlYRzRqSUNBbmRHaGxZV1FuWEhKY2JpTWdJQ2RzYVc1ckoxeHlYRzRqSUNBbmMyTnlhWEIwSjF4eVhHNGpYVnh5WEc0alhISmNiaU51YjJSbFRtRnRaWE1nUFNCYlhISmNiaU1nSUNkaEoxeHlYRzRqSUNBbllpZGNjbHh1SXlBZ0oySnlKMXh5WEc0aklDQW5ZblYwZEc5dUoxeHlYRzRqSUNBblpHbDJKMXh5WEc0aklDQW5aVzBuWEhKY2JpTWdJQ2RtYVdWc1pITmxkQ2RjY2x4dUl5QWdKMlp2Y20wblhISmNiaU1nSUNkb01TZGNjbHh1SXlBZ0oyZ3lKMXh5WEc0aklDQW5hRE1uWEhKY2JpTWdJQ2RvTkNkY2NseHVJeUFnSjJnMUoxeHlYRzRqSUNBbmFEWW5YSEpjYmlNZ0lDZHBKMXh5WEc0aklDQW5hVzFuSjF4eVhHNGpJQ0FuYVc1d2RYUW5YSEpjYmlNZ0lDZHNZV0psYkNkY2NseHVJeUFnSjJ4bFoyVnVaQ2RjY2x4dUl5QWdKMnhwSjF4eVhHNGpJQ0FuYm1GMkoxeHlYRzRqSUNBbmIyd25YSEpjYmlNZ0lDZHZjSFJwYjI0blhISmNiaU1nSUNkd0oxeHlYRzRqSUNBbmMyVnNaV04wSjF4eVhHNGpJQ0FuYzNCaGJpZGNjbHh1SXlBZ0ozTjBjbTl1WnlkY2NseHVJeUFnSjNOMWNDZGNjbHh1SXlBZ0ozTjJaeWRjY2x4dUl5QWdKM1JoWW14bEoxeHlYRzRqSUNBbmRHSnZaSGtuWEhKY2JpTWdJQ2QwWkNkY2NseHVJeUFnSjNSbGVIUmhjbVZoSjF4eVhHNGpJQ0FuZEdnblhISmNiaU1nSUNkMGFHVmhaQ2RjY2x4dUl5QWdKM1J5SjF4eVhHNGpJQ0FuZFd3blhISmNiaU5kWEhKY2JseHlYRzVqYkdGemN5Qk9iMlJsUm1GamRHOXllVnh5WEc0Z0lGeHlYRzRnSUc5cVRtOWtaVG9nYm5Wc2JGeHlYRzRnSUZ4eVhHNGdJRUJuWlhRNklDaHBaQ3dnZEdGblRtRnRaU0E5SUNka2FYWW5LU0F0UGx4eVhHNGdJQ0FnY21WMElEMGdiblZzYkZ4eVhHNGdJQ0FnWld3Z1BTQmtiMk4xYldWdWRDNW5aWFJGYkdWdFpXNTBRbmxKWkNCcFpGeHlYRzRnSUNBZ2FXWWdaV3hjY2x4dUlDQWdJQ0FnZEdocGJrVnNJRDBnVDBvdWNtVnpkRzl5WlVWc1pXMWxiblFnWld3c0lIUmhaMDVoYldWY2NseHVJQ0FnSUdsbUlIUm9hVzVGYkZ4eVhHNGdJQ0FnSUNCeVpYUWdQU0J1WlhjZ1RtOWtaVVpoWTNSdmNua2diblZzYkN3Z2JuVnNiQ3dnYm5Wc2JDd2dabUZzYzJVc0lIUm9hVzVGYkZ4eVhHNWNjbHh1SUNBZ0lISmxkRnh5WEc0Z0lGeHlYRzRnSUY5dFlXdGxRV1JrT2lBb2RHRm5UbUZ0WlN3Z1kyOTFiblFwSUMwK1hISmNiaUFnSUNBb2IzQjBjeWtnUFQ1Y2NseHVJQ0FnSUNBZ2JXVjBhRzlrSUQwZ1Qwb3VibTlrWlhOYmRHRm5UbUZ0WlYwZ2IzSWdUMG91WTI5dGNHOXVaVzUwYzF0MFlXZE9ZVzFsWFNCdmNpQlBTaTVqYjI1MGNtOXNjMXQwWVdkT1lXMWxYU0J2Y2lCUFNpNXBibkIxZEhOYmRHRm5UbUZ0WlYxY2NseHVJQ0FnSUNBZ2FXWWdiV1YwYUc5a1hISmNiaUFnSUNBZ0lDQWdiblVnUFNCdFpYUm9iMlFnYjNCMGN5d2dRRzlxVG05a1pWeHlYRzRnSUNBZ0lDQmxiSE5sWEhKY2JpQWdJQ0FnSUNBZ2JuVWdQU0JQU2k1amIyMXdiMjVsYm5RZ2JuVnNiQ3dnUUc5cVRtOWtaU3dnZEdGblRtRnRaVnh5WEc0Z0lDQWdJQ0FqY21WMElEMGdibVYzSUU1dlpHVkdZV04wYjNKNUlHNTFMQ0JBZEdocGJrNXZaR1VzSUdOdmRXNTBYSEpjYmlBZ0lDQWdJRzUxWEhKY2JpQWdYSEpjYmlBZ1gyMWhhMlZWYm1seGRXVkpaRG9nS0dOdmRXNTBLU0F0UGx4eVhHNGdJQ0FnYVdZZ1Qwb3VSMFZPUlZKQlZFVmZWVTVKVVZWRlgwbEVVMXh5WEc0Z0lDQWdJQ0JqYjNWdWRDQXJQU0F4WEhKY2JpQWdJQ0FnSUdsbUlHTnZkVzUwSUR3OUlFQnZkMjVsY2k1amIzVnVkQ0IwYUdWdUlHTnZkVzUwSUQwZ1FHOTNibVZ5TG1OdmRXNTBJQ3NnTVZ4eVhHNGdJQ0FnSUNCQWIzZHVaWEl1WTI5MWJuUWdQU0JqYjNWdWRGeHlYRzVjY2x4dUlDQWdJQ0FnYVdZZ2JtOTBJRUJ2YWs1dlpHVXVaMlYwU1dRb0tWeHlYRzRnSUNBZ0lDQWdJR2xrSUQwZ1FHOTNibVZ5TG1kbGRFbGtLQ2tnYjNJZ0p5ZGNjbHh1SUNBZ0lDQWdJQ0JwWkNBclBTQkFiMnBPYjJSbExuUmhaMDVoYldVZ0t5QmpiM1Z1ZEZ4eVhHNGdJQ0FnSUNBZ0lFQnZhazV2WkdVdVlYUjBjaUFuYVdRbkxDQnBaRnh5WEc0Z0lDQWdjbVYwZFhKdVhISmNiaUFnWEhKY2JpQWdYMkpwYm1SRmRtVnVkSE02SUMwK1hISmNiaUFnSUNCcFppQkFiMnBPYjJSbElIUm9aVzRnWHk1bWIzSlBkMjRnUUc5d2RHbHZibk11WlhabGJuUnpMQ0FvZG1Gc0xDQnJaWGtwSUQwK1hISmNiaUFnSUNBZ0lHbHpUV1YwYUc5a0lEMGdjbVZ4ZFdseVpTQW5MaTR2ZEc5dmJITXZhWE1uWEhKY2JpQWdJQ0FnSUdsbUlHbHpUV1YwYUc5a0xtMWxkR2h2WkNCMllXeGNjbHh1SUNBZ0lDQWdJQ0JqWVd4c1ltRmpheUE5SUNobGRtVnVkQzR1TGlrZ0xUNGdkbUZzSUdWMlpXNTBMaTR1WEhKY2JpQWdJQ0FnSUNBZ1FHOXFUbTlrWlM0a0xtOXVJR3RsZVN3Z1kyRnNiR0poWTJ0Y2NseHVJQ0FnSUNBZ0lDQkFiMnBPYjJSbExtRmtaQ0JyWlhrc0lHTmhiR3hpWVdOclhISmNiaUFnSUNBZ0lDQWdiblZzYkZ4eVhHNGdJRnh5WEc0Z0lHTnZibk4wY25WamRHOXlPaUFvUUhSaFp5d2dRRzl3ZEdsdmJuTXNJRUJ2ZDI1bGNpd2dRSFJvYVc1T2IyUmxJRDBnYm5Wc2JDa2dMVDVjY2x4dUlDQWdJR2xtSUVCMFlXY2dZVzVrSUc1dmRDQkFkR2hwYms1dlpHVmNjbHh1SUNBZ0lDQWdRSFJvYVc1T2IyUmxJRDBnYm1WM0lGUm9hVzVFVDAwZ1FIUmhaeXdnUUc5d2RHbHZibk11Y0hKdmNITmNjbHh1SUNBZ0lDQWdRSFJvYVc1T2IyUmxMbUZrWkNBbmRHRm5UbUZ0WlNjc0lFQjBZV2RjY2x4dUlDQWdJQ0FnUUhSb2FXNU9iMlJsTG1OemN5QkFiM0IwYVc5dWN5NXpkSGxzWlhOY2NseHVJQ0FnSUNBZ2FXWWdRRzl3ZEdsdmJuTXVkR1Y0ZENCMGFHVnVJRUIwYUdsdVRtOWtaUzUwWlhoMElFQnZjSFJwYjI1ekxuUmxlSFJjY2x4dUlDQWdJRnh5WEc0Z0lDQWdhV1lnUUc5M2JtVnlYSEpjYmlBZ0lDQWdJRUJ0WVd0bEtDbGNjbHh1SUNCY2NseHVJQ0JoWkdSTllXdGxUV1YwYUc5a09pQW9ZMjkxYm5RcElDMCtYSEpjYmlBZ0lDQnRaWFJvYjJSeklEMGdUMG91YjJKcVpXTjBLQ2xjY2x4dUlDQWdJRUJ2YWs1dlpHVXViV0ZyWlNBOUlDaDBZV2RPWVcxbExDQnZjSFJ6S1NBOVBseHlYRzRnSUNBZ0lDQnRaWFJvYjJRZ1BTQnRaWFJvYjJSelczUmhaMDVoYldWZFhISmNiaUFnSUNBZ0lHbG1JRzV2ZENCdFpYUm9iMlJjY2x4dUlDQWdJQ0FnSUNCdFpYUm9iMlFnUFNCQVgyMWhhMlZCWkdRZ2RHRm5UbUZ0WlN3Z1FHOXFUbTlrWlN3Z1kyOTFiblJjY2x4dUlDQWdJQ0FnSUNCdFpYUm9iMlJ6VzNSaFowNWhiV1ZkSUQwZ2JXVjBhRzlrWEhKY2JpQWdJQ0FnSUcxbGRHaHZaQ0J2Y0hSelhISmNiaUFnSUNCQWIycE9iMlJsWEhKY2JseHlYRzRnSUcxaGEyVTZJQzArWEhKY2JseHlYRzRnSUNBZ1FHOXFUbTlrWlNBOUlHNTFiR3hjY2x4dVhISmNiaUFnSUNCcFppQkFkR2hwYms1dlpHVS9MbWx6Um5Wc2JIbEpibWwwSUhSb1pXNGdRRzlxVG05a1pTQTlJRUIwYUdsdVRtOWtaVnh5WEc0Z0lGeHlYRzRnSUNBZ0l5QXlPaUJKWmlCMGFHVWdaV3hsYldWdWRDQm9ZWE1nYm1WMlpYSWdZbVZsYmlCcGJtbDBhV0ZzYVhwbFpDd2dZMjl1ZEdsdWRXVmNjbHh1SUNBZ0lHVnNjMlZjY2x4dUlDQWdJQ0FnSXlBek9pQkJjeUJzYjI1bklHRnpJSFJvWlNCbGJHVnRaVzUwSUdsemJpZDBJSFJvWlNCaWIyUjVJRzV2WkdVc0lHTnZiblJwYm5WbFhISmNiaUFnSUNBZ0lDTWdhV1lnWld3dWRHRm5UbUZ0WlNCcGMyNTBJQ2RpYjJSNUoxeHlYRzRnSUNBZ0lDQWpJRFE2SUVWNGRHVnVaQ0IwYUdVZ1pXeGxiV1Z1ZENCM2FYUm9JSE4wWVc1a1lYSmtJR3BSZFdWeWVTQkJVRWtnYldWMGFHOWtjMXh5WEc0Z0lDQWdJQ0JBYjJwT2IyUmxJRDBnYm1WM0lFNXZaR1VnUUhSb2FXNU9iMlJsTENCQWIzZHVaWEpjY2x4dUlDQWdJQ0FnWTI5MWJuUWdQU0FvUUc5M2JtVnlMbU52ZFc1MElDc2dNU2tnZkh3Z01WeHlYRzRnSUNBZ0lDQWpJRFU2SUVsbUlIUm9aU0J1YjJSbElHbHpiaWQwSUdsdUlIUm9aU0JFVDAwc0lHRndjR1Z1WkNCcGRDQjBieUIwYUdVZ2NHRnlaVzUwWEhKY2JpQWdJQ0FnSUNNZ1ZHaHBjeUJoYkhOdklHRmpZMjl0Ylc5a1lYUmxjeUJrYjJOMWJXVnVkQ0JtY21GbmJXVnVkSE1zSUhkb2FXTm9JR0Z5WlNCdWIzUWdhVzRnZEdobElFUlBUU0JpZFhRZ1lYSmxJSEJ5WlhOMWJXVmtJSFJ2SUdKbElITnZkVzVrSUhWdWRHbHNJSEpsWVdSNUlHWnZjaUJ0WVc1MVlXd2dhVzV6WlhKMGFXOXVYSEpjYmlBZ0lDQWdJR2xtSUVCMGFHbHVUbTlrWlM1MFlXZE9ZVzFsSUdsemJuUWdKMkp2WkhrbklHRnVaQ0J1YjNRZ1FIUm9hVzVPYjJSbExtbHpTVzVFVDAwZ1lXNWtJRzV2ZENCQWIycE9iMlJsTG1selNXNUVUMDFjY2x4dUlDQWdJQ0FnSUNCQVgyMWhhMlZWYm1seGRXVkpaQ0JqYjNWdWRGeHlYRzRnSUNBZ0lDQWdJRUJ2ZDI1bGNpNWhjSEJsYm1RZ1FHOXFUbTlrWlZzd1hWeHlYRzRnSUNBZ0lDQWdJQ01nTmpvZ1FtbHVaQ0JoYm5rZ1pHVm1hVzVsWkNCbGRtVnVkSE1nWVdaMFpYSWdkR2hsSUc1dlpHVWdhWE1nYVc0Z2RHaGxJRVJQVFZ4eVhHNGdJQ0FnSUNBZ0lFQmZZbWx1WkVWMlpXNTBjeWdwWEhKY2JpQWdJQ0FnSUNBZ1hISmNiaUFnSUNBZ0lFQjBhR2x1VG05a1pTNXBjMGx1UkU5TklEMGdkSEoxWlZ4eVhHNGdJQ0FnSUNCQWIycE9iMlJsTG1selNXNUVUMDBnUFNCMGNuVmxYSEpjYmx4eVhHNGdJQ0FnSUNBaklEYzZJRU55WldGMFpTQjBhR1VnWVd4c0lHbHRjRzl5ZEdGdWRDQW5iV0ZyWlNjZ2JXVjBhRzlrWEhKY2JpQWdJQ0FnSUVCaFpHUk5ZV3RsVFdWMGFHOWtJR052ZFc1MFhISmNibHh5WEc0Z0lDQWdJQ0FqSURnNklGQnlaWFpsYm5RZ1pIVndiR2xqWVhSbElHWmhZM1J2Y25rZ1pYaDBaVzV6YVc5dUlHSjVJSE5sZEhScGJtY2dhWE1nYVc1cGRDQTlJSFJ5ZFdWY2NseHVJQ0FnSUNBZ1FHOXFUbTlrWlM1cGMwWjFiR3g1U1c1cGRDQTlJSFJ5ZFdWY2NseHVYSEpjYmlBZ0lDQWdJQ01nT1RvZ2FXWWdkR2hsSUc1dlpHVWdjM1Z3Y0c5eWRITWdhWFFzSUdOaGJHd2dabWx1WVd4cGVtVmNjbHh1SUNBZ0lDQWdabWx1WVd4cGVtVWdQU0JmTG05dVkyVWdRRzlxVG05a1pTNW1hVzVoYkdsNlpTQnZjaUJQU2k1dWIyOXdYSEpjYmlBZ0lDQWdJRUJ2YWs1dlpHVXVabWx1WVd4cGVtVWdQU0JtYVc1aGJHbDZaVnh5WEc0Z0lDQWdJQ0JtYVc1aGJHbDZaU0JBYjJwT2IyUmxYSEpjYmlBZ0lDQWpJREV3T2lCU1pYUjFjbTRnZEdobElHVjRkR1Z1WkdWa0lHVnNaVzFsYm5SY2NseHVJQ0FnSUVCdmFrNXZaR1ZjY2x4dVhISmNibWRsZEU1dlpHVkdjbTl0Um1GamRHOXllU0E5SUNoMFlXY3NJRzl3ZEdsdmJuTXNJRzkzYm1WeUxDQnBjME5oYkd4bFpFWnliMjFHWVdOMGIzSjVMQ0J1YjJSbEtTQXRQbHh5WEc0Z0lHNWxkeUJPYjJSbEtHTnlaV0YwWlVWc1pXMWxiblFnYjNkdVpYSXVaV3hsYldWdWRDd2dkR0ZuSUc5eUlDZGthWFluTENCdmNIUnBiMjV6S1Z4eVhHNWNjbHh1WEhKY2JrOUtMbkpsWjJsemRHVnlJQ2R1YjJSbFJtRmpkRzl5ZVNjc0lHZGxkRTV2WkdWR2NtOXRSbUZqZEc5eWVWeHlYRzVjY2x4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCblpYUk9iMlJsUm5KdmJVWmhZM1J2Y25sY2NseHVJbDE5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgYVxyXG5ub2RlTmFtZSA9ICdhJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBpZDogJydcclxuICAgICAgY2xhc3M6ICcnXHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICAgIGhyZWY6ICdqYXZhU2NyaXB0OnZvaWQoMCk7J1xyXG4gICAgICB0eXBlOiAnJ1xyXG4gICAgICB0aXRsZTogJydcclxuICAgICAgcmVsOiAnJ1xyXG4gICAgICBtZWRpYTogJydcclxuICAgICAgdGFyZ2V0OiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHRvZ2dsZVN0YXRlID0gJ29mZidcclxuXHJcbiAgdG9nZ2xlID0gLT5cclxuICAgIGlmIHRvZ2dsZVN0YXRlIGlzICdvbidcclxuICAgICAgdG9nZ2xlU3RhdGUgPSAnb2ZmJ1xyXG4gICAgZWxzZSB0b2dnbGVTdGF0ZSA9ICdvbicgIGlmIHRvZ2dsZVN0YXRlIGlzICdvZmYnXHJcbiAgICByZXR1cm5cclxuXHJcbiAgIyBDbGljayBiaW5kaW5nXHJcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICB0b2dnbGUoKVxyXG4gICAgICByZXRWYWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICBpZiBkZWZhdWx0cy5ocmVmIGlzICcjJyB0aGVuIHJldFZhbCA9IGZhbHNlXHJcbiAgICAgIHJldFZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuICBlbHNlXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSB0b2dnbGVcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcclxuXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxudG8gPSByZXF1aXJlICcuLi90b29scy90bydcclxuIyAjIGJyXHJcblxyXG5ub2RlTmFtZSA9ICdicidcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczoge31cclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIG51bWJlcjogMVxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICBpID0gMFxyXG4gIHdoaWxlIGkgPCB0by5udW1iZXIgZGVmYXVsdHMubnVtYmVyXHJcbiAgICAjIEluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGJycywgaXQgaXMgZGVzaXJhYmxlIHRvIG9ubHkgZ2V0IHRoZSBsYXN0IG9uZSBvdXRcclxuICAgIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gICAgaSArPSAxXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBmb3JtXHJcblxyXG5ub2RlTmFtZSA9ICdmb3JtJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBhY3Rpb246ICcnXHJcbiAgICAgIG1ldGhvZDogJydcclxuICAgICAgbmFtZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0LmFkZCAndmFsaWRhdG9yJywgcmV0LiQudmFsaWRhdGUoXHJcbiAgICBoaWdobGlnaHQ6IChlbGVtZW50KSAtPlxyXG4gICAgICAkZWxtID0gJChlbGVtZW50KVxyXG4gICAgICAkZWxtLmF0dHIgJ09KX2ludmFsaWQnLCAnMSdcclxuICAgICAgJGVsbS5hbmltYXRlIGJhY2tncm91bmRDb2xvcjogJ3JlZCdcclxuICAgICAgbnVsbFxyXG5cclxuICAgIHVuaGlnaGxpZ2h0OiAoZWxlbWVudCkgLT5cclxuICAgICAgJGVsbSA9ICQoZWxlbWVudClcclxuICAgICAgaWYgJGVsbS5hdHRyKCdPSl9pbnZhbGlkJykgaXMgJzEnXHJcbiAgICAgICAgJGVsbS5jc3MgJ2JhY2tncm91bmQtY29sb3InLCAneWVsbG93J1xyXG4gICAgICAgICRlbG0uYXR0ciAnT0pfaW52YWxpZCcsICcwJ1xyXG4gICAgICAgIHNldFRpbWVvdXQgKC0+XHJcbiAgICAgICAgICAkZWxtLmFuaW1hdGUgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXHJcbiAgICAgICAgKSwgNTAwXHJcbiAgICAgIG51bGxcclxuICApXHJcblxyXG4gIHJldC5hZGQgJ2lzRm9ybVZhbGlkJywgLT5cclxuICAgIHJldC4kLnZhbGlkKCkgYW5kIChub3QgcmV0LnZhbGlkYXRvci5pbnZhbGlkRWxlbWVudHMoKSBvciByZXQudmFsaWRhdG9yLmludmFsaWRFbGVtZW50cygpLmxlbmd0aCBpcyAwKVxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG5cclxuXHJcblxyXG5cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXHJcblxyXG4jICMgaW5wdXRcclxuXHJcbm5vZGVOYW1lID0gJ2lucHV0J1xyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6ICd0ZXh0J1xyXG4gICAgICB2YWx1ZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcbiAgICAgIGZvY3Vzb3V0OiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICBpZiBub3QgZGVmYXVsdHMucHJvcHMudHlwZSBvciBub3QgZW51bXMuaW5wdXRUeXBlc1tkZWZhdWx0cy5wcm9wcy50eXBlXVxyXG4gICAgdGhyb3cgbmV3IEVycm9yICdObyBtYXRjaGluZyBpbnB1dCB0eXBlIGZvciB7JyArIGRlZmF1bHRzLnByb3BzLnR5cGUgKyAnfSBjb3VsZCBiZSBmb3VuZC4nXHJcbiAgdGhpc1R5cGUgPSBlbnVtcy5pbnB1dFR5cGVzW2RlZmF1bHRzLnByb3BzLnR5cGVdXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICBzd2l0Y2ggdGhpc1R5cGVcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLmNoZWNrYm94XHJcbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LiQuaXMgJzpjaGVja2VkJ1xyXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMucmFkaW9cclxuICAgICAgICByZXQudmFsdWUgPSByZXQuJC5maW5kKCc6Y2hlY2tlZCcpLnZhbCgpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXQudmFsdWUgPSByZXQudmFsKClcclxuICAgIGRlZmF1bHRzLnByb3BzLnZhbHVlID0gcmV0LnZhbHVlICAgIFxyXG4gICAgcmV0LnZhbHVlXHJcblxyXG4gICMjI1xyXG4gICAgQ2xpY2sgYmluZGluZy4gSWYgdGhlIGNhbGxlciBkZWZpbmVkIGEgY2xpY2sgaGFuZGxlcixcclxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcclxuICAgIHRoZW4gY2FsbCB0aGUgZGVmaW5lZCBjbGljayBoYW5kbGVyIHdpdGggdGhlIGxhdGVzdCB2YWx1ZS5cclxuICAjIyNcclxuICBvbGRDbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gIGlmIG9sZENsaWNrIGFuZCBvbGRDbGljayBpc250IE9KLm5vb3BcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICBvbGRDbGljayByZXQudmFsdWUsIGV2ZW50Li4uXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSBuZXdDbGlja1xyXG5cclxuICAjIyNcclxuICAgIENoYW5nZSBiaW5kaW5nLiBJZiB0aGUgY2FsbGVyIGRlZmluZWQgYSBjaGFuZ2UgaGFuZGxlcixcclxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcclxuICAgIHRoZW4gY2FsbCB0aGUgZGVmaW5lZCBjaGFuZ2UgaGFuZGxlciB3aXRoIHRoZSBsYXRlc3QgdmFsdWUuXHJcbiAgIyMjXHJcbiAgb2xkQ2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gIGlmIG9sZENoYW5nZSBhbmQgb2xkQ2hhbmdlIGlzbnQgT0oubm9vcFxyXG4gICAgbmV3Q2hhbmdlID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICBvbGRDaGFuZ2UgcmV0LnZhbHVlLCBldmVudC4uLlxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSA9IG5ld0NoYW5nZVxyXG5cclxuICAjIyNcclxuICAgIE9uIEZvY3VzIE91dCBiaW5kaW5nLiBBbHdheXMgdXNlIHRoZSBldmVudCB0byB1cGRhdGUgdGhlIGludGVybmFsXHJcbiAgICB2YWx1ZSBvZiB0aGUgY29udHJvbDsgYW5kIGlmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGZvY3Vzb3V0IGV2ZW50LFxyXG4gICAgd3JhcCBpdCBhbmQgaW52b2tlIGl0IHdpdGggdGhlIGxhdGVzdCB2YWx1ZVxyXG4gICMjI1xyXG4gIG9sZEZvY3Vzb3V0ID0gZGVmYXVsdHMuZXZlbnRzLmZvY3Vzb3V0XHJcbiAgbmV3Rm9jdXNvdXQgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICBzeW5jVmFsdWUoKVxyXG4gICAgaWYgb2xkRm9jdXNvdXQgYW5kIG9sZEZvY3Vzb3V0IGlzbnQgT0oubm9vcFxyXG4gICAgICBvbGRGb2N1c291dCByZXQudmFsdWUsIGV2ZW50Li4uXHJcblxyXG4gIGRlZmF1bHRzLmV2ZW50cy5mb2N1c291dCA9IG5ld0ZvY3Vzb3V0XHJcblxyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG4gIHJldC52YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBvbFxyXG5cclxubm9kZU5hbWUgPSAnb2wnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIHNlbGVjdFxyXG5cclxubm9kZU5hbWUgPSAnc2VsZWN0J1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHNlbGVjdGVkOiAnJ1xyXG4gICAgICBtdWx0aXBsZTogZmFsc2VcclxuICAgIHN0eWxlczoge31cclxuICAgIHZhbHVlczogW11cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICB2YWx1ZSA9ICcnXHJcbiAgdmFsdWVzID0gW11cclxuICBoYXNFbXB0eSA9IGZhbHNlXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICB2YWx1ZSA9IHJldC52YWwoKVxyXG5cclxuICAjIENsaWNrIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIHJldHZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuXHJcbiAgIyBDaGFuZ2UgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICBjaGFuZ2UgPSBkZWZhdWx0cy5ldmVudHMuY2hhbmdlXHJcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0LmFkZCAnc2VsZWN0ZWREYXRhJywgKHByb3BOYW1lKSAtPlxyXG4gICAgcmV0ID0gJydcclxuICAgIGlmIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpIGFuZCByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVswXVxyXG4gICAgICBkYXRhc2V0ID0gcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0uZGF0YXNldFxyXG4gICAgICByZXQgPSBkYXRhc2V0W3Byb3BOYW1lXSAgaWYgZGF0YXNldFxyXG4gICAgcmV0XHJcblxyXG4gIHJldC5hZGQgJ3NlbGVjdGVkVGV4dCcsIC0+XHJcbiAgICByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS50ZXh0KClcclxuXHJcbiAgcmV0LmFkZCAnc2VsZWN0ZWRWYWwnLCAtPlxyXG4gICAgdmFsdWUgPSByZXQudmFsKClcclxuICAgIHZhbHVlXHJcblxyXG4gIHJldC5hZGQgJ2FkZE9wdGlvbicsICh2YWx1ZSwgdGV4dCA9IHZhbHVlLCBzZWxlY3RlZCA9IGZhbHNlLCBkaXNhYmxlZCA9IGZhbHNlKSAtPlxyXG4gICAgaXNFbXB0eSA9IF8uaXNFbXB0eSB2YWx1ZVxyXG4gICAgYWRkID0gZmFsc2VcclxuICAgIGlmIGlzRW1wdHkgYW5kIGZhbHNlIGlzIGhhc0VtcHR5XHJcbiAgICAgIGhhc0VtcHR5ID0gdHJ1ZVxyXG4gICAgICBhZGQgPSB0cnVlXHJcbiAgICBpZiBmYWxzZSBpcyBhZGQgYW5kIGZhbHNlIGlzIGlzRW1wdHkgdGhlbiBhZGQgPSB0cnVlXHJcbiAgICBpZiBhZGRcclxuICAgICAgdmFsID1cclxuICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgcHJvcHM6XHJcbiAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgaWYgc2VsZWN0ZWRcclxuICAgICAgICB2YWwuc2VsZWN0ZWQgPSBzZWxlY3RlZFxyXG4gICAgICBpZiBkaXNhYmxlZFxyXG4gICAgICAgIHZhbC5kaXNhYmxlZCA9IGRpc2FibGVkXHJcbiAgICAgIG9wdGlvbiA9IHJldC5tYWtlICdvcHRpb24nLCB2YWxcclxuICAgICAgb3B0aW9uXHJcblxyXG4gIHJldC5hZGQgJ2FkZE9wdGlvbnMnLCAob3B0aW9ucykgLT5cclxuICAgIHZhbHVlcyA9IF8udW5pb24gdmFsdWVzLCBvcHRpb25zXHJcbiAgICBPSi5lYWNoIG9wdGlvbnMsICgodmFsKSAtPlxyXG4gICAgICB2YWx1ZSA9IHJldC5hZGRPcHRpb24odmFsKVxyXG4gICAgICB2YWx1ZXMucHVzaCB2YWx1ZVxyXG4gICAgKSwgZmFsc2VcclxuICAgIHZhbHVlc1xyXG5cclxuICByZXQuYWRkICdyZXNldE9wdGlvbnMnLCAodmFsdWVzKSAtPlxyXG4gICAgcmV0LmVtcHR5KClcclxuICAgIHZhbHVlcyA9IHZhbHVlc1xyXG4gICAgcmV0LmFkZE9wdGlvbnMgdmFsdWVzXHJcbiAgICByZXRcclxuXHJcbiAgcmV0LmFkZCAncmVtb3ZlT3B0aW9uJywgKHZhbHVlVG9SZW1vdmUpIC0+XHJcbiAgICB2YWx1ZXMuc3BsaWNlIHZhbHVlcy5pbmRleE9mKHZhbHVlVG9SZW1vdmUpLCAxICNyZW1vdmVzIHRoZSBpdGVtIGZyb20gdGhlIGxpc3RcclxuICAgIHNlbGVjdENvbnRyb2wgPSByZXRbMF1cclxuICAgIGkgPSAwXHJcblxyXG4gICAgd2hpbGUgaSA8IHNlbGVjdENvbnRyb2wubGVuZ3RoXHJcbiAgICAgIHNlbGVjdENvbnRyb2wucmVtb3ZlIGkgIGlmIHNlbGVjdENvbnRyb2wub3B0aW9uc1tpXS52YWx1ZSBpcyB2YWx1ZVRvUmVtb3ZlXHJcbiAgICAgIGkrK1xyXG4gICAgbnVsbFxyXG5cclxuXHJcblxyXG4gIGlmIGRlZmF1bHRzLnZhbHVlcy5sZW5ndGggPiAwXHJcbiAgICByZXQuYWRkT3B0aW9ucyBkZWZhdWx0cy52YWx1ZXNcclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCwgSnNvblRvVGFibGUsIE9KLCBfLCBhcnJheTJELCBub2RlLCBub2RlRmFjdG9yeSwgbm9kZU5hbWU7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxubm9kZUZhY3RvcnkgPSByZXF1aXJlKCcuLi9kb20vbm9kZUZhY3RvcnknKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuYXJyYXkyRCA9IHJlcXVpcmUoJy4uL3Rvb2xzL2FycmF5MkQnKTtcblxuJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxuSnNvblRvVGFibGUgPSByZXF1aXJlKCcuLi90b29scy9Kc29uVG9UYWJsZScpO1xuXG5ub2RlTmFtZSA9ICd0YWJsZSc7XG5cblxuLypcbkNyZWF0ZSBhbiBIVE1MIHRhYmxlLiBQcm92aWRlcyBoZWxwZXIgbWV0aG9kcyB0byBjcmVhdGUgQ29sdW1ucyBhbmQgQ2VsbHMuXG4gKi9cblxubm9kZSA9IGZ1bmN0aW9uKG9wdGlvbnMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeSkge1xuICB2YXIgY2VsbHMsIGNvbHVtbkNvdW50LCBkZWZhdWx0cywgZmlsbE1pc3NpbmcsIGluaXQsIGxvYWRDZWxscywgcmV0LCByb3dzLCB0Ym9keSwgdGhlYWQsIHRoZWFkUm93O1xuICBpZiAob3duZXIgPT0gbnVsbCkge1xuICAgIG93bmVyID0gT0ouYm9keTtcbiAgfVxuICBpZiAoY2FsbGVkRnJvbUZhY3RvcnkgPT0gbnVsbCkge1xuICAgIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2U7XG4gIH1cbiAgZGVmYXVsdHMgPSB7XG4gICAgZGF0YTogbnVsbCxcbiAgICBwcm9wczoge1xuICAgICAgY2VsbHBhZGRpbmc6IDAsXG4gICAgICBjZWxsc3BhY2luZzogMCxcbiAgICAgIGFsaWduOiAnJyxcbiAgICAgIHdpZHRoOiAnJyxcbiAgICAgIGNlbGxhbGlnbjogJ2xlZnQnLFxuICAgICAgY2VsbHZhbGlnbjogJ3RvcCcsXG4gICAgICBcImNsYXNzXCI6ICcnXG4gICAgfSxcbiAgICBzdHlsZXM6IHt9LFxuICAgIGV2ZW50czoge30sXG4gICAgY2VsbHM6IHtcbiAgICAgIFwiY2xhc3NcIjogJycsXG4gICAgICBhbGlnbjogJycsXG4gICAgICAndmVydGljYWwtYWxpZ24nOiAnJyxcbiAgICAgIGNlbGxwYWRkaW5nOiAnJyxcbiAgICAgIG1hcmdpbjogJydcbiAgICB9LFxuICAgIHRoZWFkOiB7fSxcbiAgICB0Ym9keToge30sXG4gICAgZmlyc3RBbGlnblJpZ2h0OiBmYWxzZSxcbiAgICBvZGRBbGlnblJpZ2h0OiBmYWxzZVxuICB9O1xuICByb3dzID0gW107XG4gIGNlbGxzID0gYXJyYXkyRCgpO1xuICBjb2x1bW5Db3VudCA9IDA7XG4gIE9KLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZSk7XG4gIHJldCA9IG5vZGVGYWN0b3J5KG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5KTtcbiAgdGJvZHkgPSBudWxsO1xuICB0aGVhZCA9IG51bGw7XG4gIHRoZWFkUm93ID0gbnVsbDtcbiAgaW5pdCA9IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICB2YXIgajJ0LCBqQm9keSwgakhlYWQsIGpUYmwsIHRibFN0cjtcbiAgICBpZiAoZGVmYXVsdHMuZGF0YSkge1xuICAgICAgajJ0ID0gbmV3IEpzb25Ub1RhYmxlKGRlZmF1bHRzLmRhdGEpO1xuICAgICAgdGJsU3RyID0gajJ0LnRhYmxlO1xuICAgIH1cbiAgICBpZiAodGJsU3RyKSB7XG4gICAgICBqVGJsID0gJCh0YmxTdHIpO1xuICAgICAgakhlYWQgPSBqVGJsLmZpbmQoJ3RoZWFkJyk7XG4gICAgICByZXQuJC5hcHBlbmQoakhlYWQpO1xuICAgICAgdGhlYWQgPSBlbC5yZXN0b3JlRWxlbWVudChqSGVhZFswXSk7XG4gICAgICB0aGVhZFJvdyA9IGVsLnJlc3RvcmVFbGVtZW50KHRoZWFkWzBdLnJvd3NbMF0pO1xuICAgICAgakJvZHkgPSBqVGJsLmZpbmQoJ3Rib2R5Jyk7XG4gICAgICByZXQuJC5hcHBlbmQoakJvZHkpO1xuICAgICAgdGJvZHkgPSBlbC5yZXN0b3JlRWxlbWVudChqQm9keVswXSk7XG4gICAgICBsb2FkQ2VsbHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhlYWQgPSByZXQubWFrZSgndGhlYWQnLCBkZWZhdWx0cy50aGVhZCk7XG4gICAgICB0aGVhZFJvdyA9IHRoZWFkLm1ha2UoJ3RyJyk7XG4gICAgICB0Ym9keSA9IHJldC5tYWtlKCd0Ym9keScsIGRlZmF1bHRzLnRib2R5KTtcbiAgICAgIHJvd3MucHVzaCh0Ym9keS5tYWtlKCd0cicpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG4gIGxvYWRDZWxscyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjLCBtZW1DZWxsLCBtZW1Sb3csIHIsIHJlc3VsdHM7XG4gICAgciA9IDA7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIHdoaWxlICh0Ym9keVswXS5yb3dzLmxlbmd0aCA+IHIpIHtcbiAgICAgIGMgPSAwO1xuICAgICAgbWVtUm93ID0gZWwucmVzdG9yZUVsZW1lbnQodGJvZHlbMF0ucm93c1tyXSk7XG4gICAgICByb3dzLnB1c2gobWVtUm93KTtcbiAgICAgIHdoaWxlICh0Ym9keVswXS5yb3dzW3JdLmNlbGxzLmxlbmd0aCA+IGMpIHtcbiAgICAgICAgbWVtQ2VsbCA9IGNlbGxzLmdldChyICsgMSwgYyArIDEpO1xuICAgICAgICBpZiAoIW1lbUNlbGwpIHtcbiAgICAgICAgICBtZW1DZWxsID0gZWwucmVzdG9yZUVsZW1lbnQodGJvZHlbMF0ucm93c1tyXS5jZWxsc1tjXSk7XG4gICAgICAgICAgY2VsbHMuc2V0KHIgKyAxLCBjICsgMSwgbWVtQ2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgYyArPSAxO1xuICAgICAgfVxuICAgICAgcmVzdWx0cy5wdXNoKHIgKz0gMSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuICBmaWxsTWlzc2luZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjZWxscy5lYWNoKGZ1bmN0aW9uKHJvd05vLCBjb2xObywgdmFsKSB7XG4gICAgICB2YXIgcm93O1xuICAgICAgaWYgKCF2YWwpIHtcbiAgICAgICAgcm93ID0gcmV0LnJvdyhyb3dObyk7XG4gICAgICAgIHJldHVybiByb3cuY2VsbChjb2xObywge30pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICByZXQuYWRkKCdjb2x1bW4nLCBmdW5jdGlvbihjb2xObywgY29sTmFtZSkge1xuICAgIHZhciBpLCBuYXRpdmVUaCwgdGg7XG4gICAgcmV0LmluaXQoKTtcbiAgICBjb2x1bW5Db3VudCArPSAxO1xuICAgIHRoID0gbnVsbDtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAodGhlYWRbMF0ucm93c1swXS5jZWxscy5sZW5ndGggPCBjb2xObykge1xuICAgICAgbmF0aXZlVGggPSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzW2ldO1xuICAgICAgaWYgKCFuYXRpdmVUaCkge1xuICAgICAgICB0aCA9IHRoZWFkUm93Lm1ha2UoJ3RoJywge30pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudChuYXRpdmVUaCwgJ3RoJyk7XG4gICAgICB9XG4gICAgICBpICs9IDE7XG4gICAgfVxuICAgIGlmICghdGgpIHtcbiAgICAgIG5hdGl2ZVRoID0gdGhlYWRbMF0ucm93c1swXS5jZWxsc1tjb2xObyAtIDFdO1xuICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudChuYXRpdmVUaCwgJ3RoJyk7XG4gICAgfVxuICAgIHRoLnRleHQoY29sTmFtZSk7XG4gICAgcmV0dXJuIHRoO1xuICB9KTtcbiAgcmV0LmFkZCgncm93JywgZnVuY3Rpb24ocm93Tm8sIG9wdHMpIHtcbiAgICB2YXIgcm93O1xuICAgIHJvdyA9IHJvd3Nbcm93Tm8gLSAxXTtcbiAgICBpZiAoIXJvdykge1xuICAgICAgd2hpbGUgKHJvd3MubGVuZ3RoIDwgcm93Tm8pIHtcbiAgICAgICAgcm93ID0gdGJvZHkubWFrZSgndHInLCB7fSk7XG4gICAgICAgIHJvd3MucHVzaChyb3cpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXJvdy5jZWxsKSB7XG4gICAgICByb3cuYWRkKCdjZWxsJywgZnVuY3Rpb24oY29sTm8sIG9wdHMpIHtcbiAgICAgICAgdmFyIGNlbGw7XG4gICAgICAgIGNlbGwgPSBPSi5ub2Rlcy50ZChvcHRzLCByb3cpO1xuICAgICAgICBjZWxscy5zZXQocm93Tm8sIGNvbE5vLCBjZWxsKTtcbiAgICAgICAgcmV0dXJuIGNlbGw7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJvdztcbiAgfSk7XG4gIHJldC5hZGQoJ2NlbGwnLCBmdW5jdGlvbihyb3dObywgY29sTm8sIG9wdHMpIHtcbiAgICB2YXIgY2VsbCwgaSwgbnVPcHRzLCByb3csIHRyeUNlbGw7XG4gICAgaWYgKHJvd05vIDwgMSkge1xuICAgICAgcm93Tm8gPSAxO1xuICAgIH1cbiAgICBpZiAoY29sTm8gPCAxKSB7XG4gICAgICBjb2xObyA9IDE7XG4gICAgfVxuICAgIGlmIChjb2x1bW5Db3VudCA+IDAgJiYgY29sTm8gLSAxID4gY29sdW1uQ291bnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSBjb2x1bW4gbmFtZSBoYXMgbm90IGJlZW4gZGVmaW5lZCBmb3IgdGhpcyBwb3NpdGlvbiB7JyArIHJvd05vICsgJ3gnICsgY29sTm8gKyAnfS4nKTtcbiAgICB9XG4gICAgcm93ID0gcmV0LnJvdyhyb3dObyk7XG4gICAgY2VsbCA9IGNlbGxzLmdldChyb3dObywgY29sTm8pO1xuICAgIGlmICghY2VsbCkge1xuICAgICAgaSA9IDA7XG4gICAgICB3aGlsZSAoaSA8IGNvbE5vKSB7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgICAgaWYgKGkgPT09IGNvbE5vKSB7XG4gICAgICAgICAgbnVPcHRzID0gT0ouZXh0ZW5kKHtcbiAgICAgICAgICAgIHByb3BzOiBkZWZhdWx0cy5jZWxsc1xuICAgICAgICAgIH0sIG9wdHMpO1xuICAgICAgICAgIGNlbGwgPSByb3cuY2VsbChjb2xObywgbnVPcHRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnlDZWxsID0gY2VsbHMuZ2V0KHJvd05vLCBpKTtcbiAgICAgICAgICBpZiAoIXRyeUNlbGwpIHtcbiAgICAgICAgICAgIHRyeUNlbGwgPSByb3cuY2VsbChpLCB7XG4gICAgICAgICAgICAgIHByb3BzOiBkZWZhdWx0cy5jZWxsc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjZWxsO1xuICB9KTtcbiAgaW5pdCgpO1xuICByZXQuYWRkKCd0aGVhZCcsIHRoZWFkKTtcbiAgcmV0LmFkZCgndGJvZHknLCB0Ym9keSk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5PSi5ub2Rlcy5yZWdpc3Rlcihub2RlTmFtZSwgbm9kZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRnhsYkdWdFpXNTBjMXhjZEdGaWJHVXVZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRU3hKUVVGQk96dEJRVUZCTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1QwRkJVanM3UVVGRFRDeFhRVUZCTEVkQlFXTXNUMEZCUVN4RFFVRlJMRzlDUVVGU096dEJRVU5rTEVOQlFVRXNSMEZCU1N4UFFVRkJMRU5CUVZFc1VVRkJVanM3UVVGRFNpeFBRVUZCTEVkQlFWVXNUMEZCUVN4RFFVRlJMR3RDUVVGU096dEJRVU5XTEVOQlFVRXNSMEZCU1N4UFFVRkJMRU5CUVZFc1VVRkJVanM3UVVGRFNpeFhRVUZCTEVkQlFXTXNUMEZCUVN4RFFVRlJMSE5DUVVGU096dEJRVWxrTEZGQlFVRXNSMEZCVnpzN08wRkJSVmc3T3pzN1FVRkhRU3hKUVVGQkxFZEJRVThzVTBGQlF5eFBRVUZFTEVWQlFWVXNTMEZCVml4RlFVRXlRaXhwUWtGQk0wSTdRVUZIVEN4TlFVRkJPenRKUVVobExGRkJRVkVzUlVGQlJTeERRVUZET3pzN1NVRkJUU3h2UWtGQmIwSTdPMFZCUjNCRUxGRkJRVUVzUjBGSFJUdEpRVUZCTEVsQlFVRXNSVUZCVFN4SlFVRk9PMGxCUjBFc1MwRkJRU3hGUVVORk8wMUJRVUVzVjBGQlFTeEZRVUZoTEVOQlFXSTdUVUZEUVN4WFFVRkJMRVZCUVdFc1EwRkVZanROUVVWQkxFdEJRVUVzUlVGQlR5eEZRVVpRTzAxQlIwRXNTMEZCUVN4RlFVRlBMRVZCU0ZBN1RVRkpRU3hUUVVGQkxFVkJRVmNzVFVGS1dEdE5RVXRCTEZWQlFVRXNSVUZCV1N4TFFVeGFPMDFCVFVFc1QwRkJRU3hGUVVGUExFVkJUbEE3UzBGS1JqdEpRVmRCTEUxQlFVRXNSVUZCVVN4RlFWaFNPMGxCV1VFc1RVRkJRU3hGUVVGUkxFVkJXbEk3U1VGbFFTeExRVUZCTEVWQlEwVTdUVUZCUVN4UFFVRkJMRVZCUVU4c1JVRkJVRHROUVVOQkxFdEJRVUVzUlVGQlR5eEZRVVJRTzAxQlJVRXNaMEpCUVVFc1JVRkJhMElzUlVGR2JFSTdUVUZIUVN4WFFVRkJMRVZCUVdFc1JVRklZanROUVVsQkxFMUJRVUVzUlVGQlVTeEZRVXBTTzB0QmFFSkdPMGxCZFVKQkxFdEJRVUVzUlVGQlR5eEZRWFpDVUR0SlFUQkNRU3hMUVVGQkxFVkJRVThzUlVFeFFsQTdTVUUwUWtFc1pVRkJRU3hGUVVGcFFpeExRVFZDYWtJN1NVRTJRa0VzWVVGQlFTeEZRVUZsTEV0Qk4wSm1PenRGUVN0Q1JpeEpRVUZCTEVkQlFVODdSVUZEVUN4TFFVRkJMRWRCUVZFc1QwRkJRU3hEUVVGQk8wVkJRMUlzVjBGQlFTeEhRVUZqTzBWQlJXUXNSVUZCUlN4RFFVRkRMRTFCUVVnc1EwRkJWU3hSUVVGV0xFVkJRVzlDTEU5QlFYQkNMRVZCUVRaQ0xFbEJRVGRDTzBWQlEwRXNSMEZCUVN4SFFVRk5MRmRCUVVFc1EwRkJXU3hSUVVGYUxFVkJRWE5DTEZGQlFYUkNMRVZCUVdkRExFdEJRV2hETEVWQlFYVkRMR2xDUVVGMlF6dEZRVWRPTEV0QlFVRXNSMEZCVVR0RlFVTlNMRXRCUVVFc1IwRkJVVHRGUVVOU0xGRkJRVUVzUjBGQlZ6dEZRVWxZTEVsQlFVRXNSMEZCVHl4RFFVRkRMRU5CUVVNc1NVRkJSaXhEUVVGUExGTkJRVUU3UVVGRFdpeFJRVUZCTzBsQlFVRXNTVUZCUnl4UlFVRlJMRU5CUVVNc1NVRkJXanROUVVORkxFZEJRVUVzUjBGQlZTeEpRVUZCTEZkQlFVRXNRMEZCV1N4UlFVRlJMRU5CUVVNc1NVRkJja0k3VFVGRFZpeE5RVUZCTEVkQlFWTXNSMEZCUnl4RFFVRkRMRTFCUm1ZN08wbEJSMEVzU1VGQlJ5eE5RVUZJTzAxQlEwVXNTVUZCUVN4SFFVRlBMRU5CUVVFc1EwRkJSU3hOUVVGR08wMUJSVkFzUzBGQlFTeEhRVUZSTEVsQlFVa3NRMEZCUXl4SlFVRk1MRU5CUVZVc1QwRkJWanROUVVOU0xFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTXNUVUZCVGl4RFFVRmhMRXRCUVdJN1RVRkRRU3hMUVVGQkxFZEJRVkVzUlVGQlJTeERRVUZETEdOQlFVZ3NRMEZCYTBJc1MwRkJUU3hEUVVGQkxFTkJRVUVzUTBGQmVFSTdUVUZEVWl4UlFVRkJMRWRCUVZjc1JVRkJSU3hEUVVGRExHTkJRVWdzUTBGQmEwSXNTMEZCVFN4RFFVRkJMRU5CUVVFc1EwRkJSU3hEUVVGRExFbEJRVXNzUTBGQlFTeERRVUZCTEVOQlFXaERPMDFCUlZnc1MwRkJRU3hIUVVGUkxFbEJRVWtzUTBGQlF5eEpRVUZNTEVOQlFWVXNUMEZCVmp0TlFVTlNMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU1zVFVGQlRpeERRVUZoTEV0QlFXSTdUVUZEUVN4TFFVRkJMRWRCUVZFc1JVRkJSU3hEUVVGRExHTkJRVWdzUTBGQmEwSXNTMEZCVFN4RFFVRkJMRU5CUVVFc1EwRkJlRUk3VFVGRlVpeFRRVUZCTEVOQlFVRXNSVUZhUmp0TFFVRkJMRTFCUVVFN1RVRmpSU3hMUVVGQkxFZEJRVkVzUjBGQlJ5eERRVUZETEVsQlFVb3NRMEZCVXl4UFFVRlVMRVZCUVd0Q0xGRkJRVkVzUTBGQlF5eExRVUV6UWp0TlFVTlNMRkZCUVVFc1IwRkJWeXhMUVVGTExFTkJRVU1zU1VGQlRpeERRVUZYTEVsQlFWZzdUVUZEV0N4TFFVRkJMRWRCUVZFc1IwRkJSeXhEUVVGRExFbEJRVW9zUTBGQlV5eFBRVUZVTEVWQlFXdENMRkZCUVZFc1EwRkJReXhMUVVFelFqdE5RVU5TTEVsQlFVa3NRMEZCUXl4SlFVRk1MRU5CUVZVc1MwRkJTeXhEUVVGRExFbEJRVTRzUTBGQlZ5eEpRVUZZTEVOQlFWWXNSVUZxUWtZN08xZEJhMEpCTzBWQmRFSlpMRU5CUVZBN1JVRXdRbEFzVTBGQlFTeEhRVUZaTEZOQlFVRTdRVUZEVml4UlFVRkJPMGxCUVVFc1EwRkJRU3hIUVVGSk8wRkJRMG83VjBGQlRTeExRVUZOTEVOQlFVRXNRMEZCUVN4RFFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRV1FzUjBGQmRVSXNRMEZCTjBJN1RVRkRSU3hEUVVGQkxFZEJRVWs3VFVGRFNpeE5RVUZCTEVkQlFWTXNSVUZCUlN4RFFVRkRMR05CUVVnc1EwRkJhMElzUzBGQlRTeERRVUZCTEVOQlFVRXNRMEZCUlN4RFFVRkRMRWxCUVVzc1EwRkJRU3hEUVVGQkxFTkJRV2hETzAxQlExUXNTVUZCU1N4RFFVRkRMRWxCUVV3c1EwRkJWU3hOUVVGV08wRkJRMEVzWVVGQlRTeExRVUZOTEVOQlFVRXNRMEZCUVN4RFFVRkZMRU5CUVVNc1NVRkJTeXhEUVVGQkxFTkJRVUVzUTBGQlJTeERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRjJRaXhIUVVGblF5eERRVUYwUXp0UlFVTkZMRTlCUVVFc1IwRkJWU3hMUVVGTExFTkJRVU1zUjBGQlRpeERRVUZWTEVOQlFVRXNSMEZCUlN4RFFVRmFMRVZCUVdVc1EwRkJRU3hIUVVGRkxFTkJRV3BDTzFGQlExWXNTVUZCUnl4RFFVRkpMRTlCUVZBN1ZVRkRSU3hQUVVGQkxFZEJRVlVzUlVGQlJTeERRVUZETEdOQlFVZ3NRMEZCYTBJc1MwRkJUU3hEUVVGQkxFTkJRVUVzUTBGQlJTeERRVUZETEVsQlFVc3NRMEZCUVN4RFFVRkJMRU5CUVVVc1EwRkJReXhMUVVGTkxFTkJRVUVzUTBGQlFTeERRVUY2UXp0VlFVTldMRXRCUVVzc1EwRkJReXhIUVVGT0xFTkJRVlVzUTBGQlFTeEhRVUZGTEVOQlFWb3NSVUZCWlN4RFFVRkJMRWRCUVVVc1EwRkJha0lzUlVGQmIwSXNUMEZCY0VJc1JVRkdSanM3VVVGSFFTeERRVUZCTEVsQlFVczdUVUZNVUR0dFFrRk5RU3hEUVVGQkxFbEJRVXM3U1VGV1VDeERRVUZCT3p0RlFVWlZPMFZCWjBKYUxGZEJRVUVzUjBGQll5eFRRVUZCTzFkQlExb3NTMEZCU3l4RFFVRkRMRWxCUVU0c1EwRkJWeXhUUVVGRExFdEJRVVFzUlVGQlVTeExRVUZTTEVWQlFXVXNSMEZCWmp0QlFVTlVMRlZCUVVFN1RVRkJRU3hKUVVGSExFTkJRVWtzUjBGQlVEdFJRVU5GTEVkQlFVRXNSMEZCVFN4SFFVRkhMRU5CUVVNc1IwRkJTaXhEUVVGUkxFdEJRVkk3WlVGRFRpeEhRVUZITEVOQlFVTXNTVUZCU2l4RFFVRlRMRXRCUVZRc1JVRkJaMElzUlVGQmFFSXNSVUZHUmpzN1NVRkVVeXhEUVVGWU8wVkJSRms3UlVGUlpDeEhRVUZITEVOQlFVTXNSMEZCU2l4RFFVRlJMRkZCUVZJc1JVRkJhMElzVTBGQlF5eExRVUZFTEVWQlFWRXNUMEZCVWp0QlFVTm9RaXhSUVVGQk8wbEJRVUVzUjBGQlJ5eERRVUZETEVsQlFVb3NRMEZCUVR0SlFVTkJMRmRCUVVFc1NVRkJaVHRKUVVObUxFVkJRVUVzUjBGQlN6dEpRVU5NTEVOQlFVRXNSMEZCU1R0QlFVTktMRmRCUVUwc1MwRkJUU3hEUVVGQkxFTkJRVUVzUTBGQlJTeERRVUZETEVsQlFVc3NRMEZCUVN4RFFVRkJMRU5CUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQmRrSXNSMEZCWjBNc1MwRkJkRU03VFVGRFJTeFJRVUZCTEVkQlFWY3NTMEZCVFN4RFFVRkJMRU5CUVVFc1EwRkJSU3hEUVVGRExFbEJRVXNzUTBGQlFTeERRVUZCTEVOQlFVVXNRMEZCUXl4TFFVRk5MRU5CUVVFc1EwRkJRVHROUVVOc1F5eEpRVUZITEVOQlFVa3NVVUZCVUR0UlFVTkZMRVZCUVVFc1IwRkJTeXhSUVVGUkxFTkJRVU1zU1VGQlZDeERRVUZqTEVsQlFXUXNSVUZCYjBJc1JVRkJjRUlzUlVGRVVEdFBRVUZCTEUxQlFVRTdVVUZIUlN4RlFVRkJMRWRCUVVzc1JVRkJSU3hEUVVGRExHTkJRVWdzUTBGQmEwSXNVVUZCYkVJc1JVRkJORUlzU1VGQk5VSXNSVUZJVURzN1RVRkpRU3hEUVVGQkxFbEJRVXM3U1VGT1VEdEpRVTlCTEVsQlFVY3NRMEZCU1N4RlFVRlFPMDFCUTBVc1VVRkJRU3hIUVVGWExFdEJRVTBzUTBGQlFTeERRVUZCTEVOQlFVVXNRMEZCUXl4SlFVRkxMRU5CUVVFc1EwRkJRU3hEUVVGRkxFTkJRVU1zUzBGQlRTeERRVUZCTEV0QlFVRXNSMEZCVFN4RFFVRk9PMDFCUTJ4RExFVkJRVUVzUjBGQlN5eEZRVUZGTEVOQlFVTXNZMEZCU0N4RFFVRnJRaXhSUVVGc1FpeEZRVUUwUWl4SlFVRTFRaXhGUVVaUU96dEpRVWRCTEVWQlFVVXNRMEZCUXl4SlFVRklMRU5CUVZFc1QwRkJVanRYUVVOQk8wVkJhRUpuUWl4RFFVRnNRanRGUVc5Q1FTeEhRVUZITEVOQlFVTXNSMEZCU2l4RFFVRlJMRXRCUVZJc1JVRkJaU3hUUVVGRExFdEJRVVFzUlVGQlVTeEpRVUZTTzBGQlEySXNVVUZCUVR0SlFVRkJMRWRCUVVFc1IwRkJUU3hKUVVGTExFTkJRVUVzUzBGQlFTeEhRVUZOTEVOQlFVNDdTVUZGV0N4SlFVRkhMRU5CUVVrc1IwRkJVRHRCUVVORkxHRkJRVTBzU1VGQlNTeERRVUZETEUxQlFVd3NSMEZCWXl4TFFVRndRanRSUVVORkxFZEJRVUVzUjBGQlRTeExRVUZMTEVOQlFVTXNTVUZCVGl4RFFVRlhMRWxCUVZnc1JVRkJhVUlzUlVGQmFrSTdVVUZEVGl4SlFVRkpMRU5CUVVNc1NVRkJUQ3hEUVVGVkxFZEJRVlk3VFVGR1JpeERRVVJHT3p0SlFVdEJMRWxCUVVjc1EwRkJTU3hIUVVGSExFTkJRVU1zU1VGQldEdE5RVU5GTEVkQlFVY3NRMEZCUXl4SFFVRktMRU5CUVZFc1RVRkJVaXhGUVVGblFpeFRRVUZETEV0QlFVUXNSVUZCVVN4SlFVRlNPMEZCUTJRc1dVRkJRVHRSUVVGQkxFbEJRVUVzUjBGQlR5eEZRVUZGTEVOQlFVTXNTMEZCU3l4RFFVRkRMRVZCUVZRc1EwRkJXU3hKUVVGYUxFVkJRV3RDTEVkQlFXeENPMUZCUTFBc1MwRkJTeXhEUVVGRExFZEJRVTRzUTBGQlZTeExRVUZXTEVWQlFXbENMRXRCUVdwQ0xFVkJRWGRDTEVsQlFYaENPMlZCUTBFN1RVRklZeXhEUVVGb1FpeEZRVVJHT3p0WFFVMUJPMFZCWkdFc1EwRkJaanRGUVd0Q1FTeEhRVUZITEVOQlFVTXNSMEZCU2l4RFFVRlJMRTFCUVZJc1JVRkJaMElzVTBGQlF5eExRVUZFTEVWQlFWRXNTMEZCVWl4RlFVRmxMRWxCUVdZN1FVRkRaQ3hSUVVGQk8wbEJRVUVzU1VGQlJ5eExRVUZCTEVkQlFWRXNRMEZCV0R0TlFVRnJRaXhMUVVGQkxFZEJRVkVzUlVGQk1VSTdPMGxCUTBFc1NVRkJSeXhMUVVGQkxFZEJRVkVzUTBGQldEdE5RVUZyUWl4TFFVRkJMRWRCUVZFc1JVRkJNVUk3TzBsQlEwRXNTVUZCUnl4WFFVRkJMRWRCUVdNc1EwRkJaQ3hKUVVGdlFpeExRVUZCTEVkQlFVMHNRMEZCVGl4SFFVRlZMRmRCUVdwRE8wRkJRV3RFTEZsQlFWVXNTVUZCUVN4TFFVRkJMRU5CUVUwc2QwUkJRVUVzUjBGQk1rUXNTMEZCTTBRc1IwRkJiVVVzUjBGQmJrVXNSMEZCZVVVc1MwRkJla1VzUjBGQmFVWXNTVUZCZGtZc1JVRkJOVVE3TzBsQlJVRXNSMEZCUVN4SFFVRk5MRWRCUVVjc1EwRkJReXhIUVVGS0xFTkJRVkVzUzBGQlVqdEpRVVZPTEVsQlFVRXNSMEZCVHl4TFFVRkxMRU5CUVVNc1IwRkJUaXhEUVVGVkxFdEJRVllzUlVGQmFVSXNTMEZCYWtJN1NVRkZVQ3hKUVVGSExFTkJRVWtzU1VGQlVEdE5RVU5GTEVOQlFVRXNSMEZCU1R0QlFVTktMR0ZCUVUwc1EwRkJRU3hIUVVGSkxFdEJRVlk3VVVGRFJTeERRVUZCTEVsQlFVczdVVUZEVEN4SlFVRkhMRU5CUVVFc1MwRkJTeXhMUVVGU08xVkJRMFVzVFVGQlFTeEhRVUZUTEVWQlFVVXNRMEZCUXl4TlFVRklMRU5CUVZVN1dVRkJReXhMUVVGQkxFVkJRVThzVVVGQlVTeERRVUZETEV0QlFXcENPMWRCUVZZc1JVRkJiVU1zU1VGQmJrTTdWVUZEVkN4SlFVRkJMRWRCUVU4c1IwRkJSeXhEUVVGRExFbEJRVW9zUTBGQlV5eExRVUZVTEVWQlFXZENMRTFCUVdoQ0xFVkJSbFE3VTBGQlFTeE5RVUZCTzFWQlNVVXNUMEZCUVN4SFFVRlZMRXRCUVVzc1EwRkJReXhIUVVGT0xFTkJRVlVzUzBGQlZpeEZRVUZwUWl4RFFVRnFRanRWUVVOV0xFbEJRVWNzUTBGQlNTeFBRVUZRTzFsQlEwVXNUMEZCUVN4SFFVRlhMRWRCUVVjc1EwRkJReXhKUVVGS0xFTkJRVk1zUTBGQlZDeEZRVUZaTzJOQlFVRXNTMEZCUVN4RlFVRlBMRkZCUVZFc1EwRkJReXhMUVVGb1FqdGhRVUZhTEVWQlJHSTdWMEZNUmpzN1RVRkdSaXhEUVVaR096dFhRVmxCTzBWQmNrSmpMRU5CUVdoQ08wVkJlVUpCTEVsQlFVRXNRMEZCUVR0RlFVbEJMRWRCUVVjc1EwRkJReXhIUVVGS0xFTkJRVkVzVDBGQlVpeEZRVUZwUWl4TFFVRnFRanRGUVVsQkxFZEJRVWNzUTBGQlF5eEhRVUZLTEVOQlFWRXNUMEZCVWl4RlFVRnBRaXhMUVVGcVFqdFRRVWxCTzBGQmFFeExPenRCUVd0TVVDeEZRVUZGTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZRc1EwRkJhMElzVVVGQmJFSXNSVUZCTkVJc1NVRkJOVUk3TzBGQlEwRXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklrOUtJRDBnY21WeGRXbHlaU0FuTGk0dmIyb25YSEpjYm01dlpHVkdZV04wYjNKNUlEMGdjbVZ4ZFdseVpTQW5MaTR2Wkc5dEwyNXZaR1ZHWVdOMGIzSjVKMXh5WEc1ZklEMGdjbVZ4ZFdseVpTQW5iRzlrWVhOb0oxeHlYRzVoY25KaGVUSkVJRDBnY21WeGRXbHlaU0FuTGk0dmRHOXZiSE12WVhKeVlYa3lSQ2RjY2x4dUpDQTlJSEpsY1hWcGNtVWdKMnB4ZFdWeWVTZGNjbHh1U25OdmJsUnZWR0ZpYkdVZ1BTQnlaWEYxYVhKbElDY3VMaTkwYjI5c2N5OUtjMjl1Vkc5VVlXSnNaU2RjY2x4dVhISmNiaU1nSXlCMFlXSnNaVnh5WEc1Y2NseHVibTlrWlU1aGJXVWdQU0FuZEdGaWJHVW5YSEpjYmx4eVhHNGpJeU5jY2x4dVEzSmxZWFJsSUdGdUlFaFVUVXdnZEdGaWJHVXVJRkJ5YjNacFpHVnpJR2hsYkhCbGNpQnRaWFJvYjJSeklIUnZJR055WldGMFpTQkRiMngxYlc1eklHRnVaQ0JEWld4c2N5NWNjbHh1SXlNalhISmNibTV2WkdVZ1BTQW9iM0IwYVc5dWN5d2diM2R1WlhJZ1BTQlBTaTVpYjJSNUxDQmpZV3hzWldSR2NtOXRSbUZqZEc5eWVTQTlJR1poYkhObEtTQXRQbHh5WEc1Y2NseHVJQ0FqSUNNaklHOXdkR2x2Ym5OY2NseHVJQ0JrWldaaGRXeDBjeUE5WEhKY2JpQWdJQ0FqSUNNakl5QmtZWFJoWEhKY2JpQWdJQ0FqSUc5d2RHbHZibUZzSUdGeWNtRjVJRzltSUc5aWFtVmpkSE11SUdsbUlIQnliM1pwWkdWa0lIZHBiR3dnWjJWdVpYSmhkR1VnZEdGaWJHVWdZWFYwYjIxaGRHbGpZV3hzZVM1Y2NseHVJQ0FnSUdSaGRHRTZJRzUxYkd4Y2NseHVJQ0FnSUNNZ0l5TWpJSEJ5YjNCelhISmNiaUFnSUNBaklHOXdkR2x2Ym1Gc0lIQnliM0JsY25ScFpYTWdkRzhnWVhCd2JIa2dkRzhnZEdGaWJHVWdjbTl2ZENCdWIyUmxYSEpjYmlBZ0lDQndjbTl3Y3pwY2NseHVJQ0FnSUNBZ1kyVnNiSEJoWkdScGJtYzZJREJjY2x4dUlDQWdJQ0FnWTJWc2JITndZV05wYm1jNklEQmNjbHh1SUNBZ0lDQWdZV3hwWjI0NklDY25YSEpjYmlBZ0lDQWdJSGRwWkhSb09pQW5KMXh5WEc0Z0lDQWdJQ0JqWld4c1lXeHBaMjQ2SUNkc1pXWjBKMXh5WEc0Z0lDQWdJQ0JqWld4c2RtRnNhV2R1T2lBbmRHOXdKMXh5WEc0Z0lDQWdJQ0JqYkdGemN6b2dKeWRjY2x4dUlDQWdJSE4wZVd4bGN6b2dlMzFjY2x4dUlDQWdJR1YyWlc1MGN6b2dlMzFjY2x4dUlDQWdJQ01nSXlNaklHTmxiR3h6WEhKY2JpQWdJQ0FqSUc5d2RHbHZibUZzSUhCeWIzQmxjblJwWlhNZ2RHOGdZWEJ3YkhrZ2RHOGdhVzVrYVhacFpIVmhiQ0JqWld4c2MxeHlYRzRnSUNBZ1kyVnNiSE02WEhKY2JpQWdJQ0FnSUdOc1lYTnpPaUFuSjF4eVhHNGdJQ0FnSUNCaGJHbG5iam9nSnlkY2NseHVJQ0FnSUNBZ0ozWmxjblJwWTJGc0xXRnNhV2R1SnpvZ0p5ZGNjbHh1SUNBZ0lDQWdZMlZzYkhCaFpHUnBibWM2SUNjblhISmNiaUFnSUNBZ0lHMWhjbWRwYmpvZ0p5ZGNjbHh1SUNBZ0lDTWdJeU1qSUhSb1pXRmtYSEpjYmlBZ0lDQWpJRzl3ZEdsdmJtRnNJRzl3ZEdsdmJuTWdiMkpxWldOMElIUnZJSEJoYzNNZ2FXNTBieUIwYUdWaFpDQmpjbVZoZEdsdmJseHlYRzRnSUNBZ2RHaGxZV1E2SUh0OVhISmNiaUFnSUNBaklDTWpJeUIwWW05a2VWeHlYRzRnSUNBZ0l5QnZjSFJwYjI1aGJDQnZjSFJwYjI1eklHOWlhbVZqZENCMGJ5QndZWE56SUdsdWRHOGdkR0p2WkhrZ1kzSmxZWFJwYjI1Y2NseHVJQ0FnSUhSaWIyUjVPaUI3ZlZ4eVhHNWNjbHh1SUNBZ0lHWnBjbk4wUVd4cFoyNVNhV2RvZERvZ1ptRnNjMlZjY2x4dUlDQWdJRzlrWkVGc2FXZHVVbWxuYUhRNklHWmhiSE5sWEhKY2JseHlYRzRnSUhKdmQzTWdQU0JiWFZ4eVhHNGdJR05sYkd4eklEMGdZWEp5WVhreVJDZ3BYSEpjYmlBZ1kyOXNkVzF1UTI5MWJuUWdQU0F3WEhKY2JseHlYRzRnSUU5S0xtVjRkR1Z1WkNCa1pXWmhkV3gwY3l3Z2IzQjBhVzl1Y3l3Z2RISjFaVnh5WEc0Z0lISmxkQ0E5SUc1dlpHVkdZV04wYjNKNUlHNXZaR1ZPWVcxbExDQmtaV1poZFd4MGN5d2diM2R1WlhJc0lHTmhiR3hsWkVaeWIyMUdZV04wYjNKNVhISmNiaUJjY2x4dVhISmNiaUFnZEdKdlpIa2dQU0J1ZFd4c1hISmNiaUFnZEdobFlXUWdQU0J1ZFd4c1hISmNiaUFnZEdobFlXUlNiM2NnUFNCdWRXeHNYSEpjYmx4eVhHNGdJQ01nSXlNaklHbHVhWFJjY2x4dUlDQWpJR2x1ZEdWeWJtRnNJRzFsZEdodlpDQm1iM0lnYjI1bElIUnBiV1VnYVc1cGRHbGhiR2w2WVhScGIyNGdiMllnZEdobElIUmhZbXhsWEhKY2JpQWdhVzVwZENBOUlGOHViMjVqWlNBdFBseHlYRzRnSUNBZ2FXWWdaR1ZtWVhWc2RITXVaR0YwWVZ4eVhHNGdJQ0FnSUNCcU1uUWdQU0J1WlhjZ1NuTnZibFJ2VkdGaWJHVWdaR1ZtWVhWc2RITXVaR0YwWVZ4eVhHNGdJQ0FnSUNCMFlteFRkSElnUFNCcU1uUXVkR0ZpYkdWY2NseHVJQ0FnSUdsbUlIUmliRk4wY2x4eVhHNGdJQ0FnSUNCcVZHSnNJRDBnSkNCMFlteFRkSEpjY2x4dVhISmNiaUFnSUNBZ0lHcElaV0ZrSUQwZ2FsUmliQzVtYVc1a0lDZDBhR1ZoWkNkY2NseHVJQ0FnSUNBZ2NtVjBMaVF1WVhCd1pXNWtJR3BJWldGa1hISmNiaUFnSUNBZ0lIUm9aV0ZrSUQwZ1pXd3VjbVZ6ZEc5eVpVVnNaVzFsYm5RZ2FraGxZV1JiTUYxY2NseHVJQ0FnSUNBZ2RHaGxZV1JTYjNjZ1BTQmxiQzV5WlhOMGIzSmxSV3hsYldWdWRDQjBhR1ZoWkZzd1hTNXliM2R6V3pCZFhISmNibHh5WEc0Z0lDQWdJQ0JxUW05a2VTQTlJR3BVWW13dVptbHVaQ0FuZEdKdlpIa25YSEpjYmlBZ0lDQWdJSEpsZEM0a0xtRndjR1Z1WkNCcVFtOWtlVnh5WEc0Z0lDQWdJQ0IwWW05a2VTQTlJR1ZzTG5KbGMzUnZjbVZGYkdWdFpXNTBJR3BDYjJSNVd6QmRYSEpjYmx4eVhHNGdJQ0FnSUNCc2IyRmtRMlZzYkhNb0tWeHlYRzRnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0IwYUdWaFpDQTlJSEpsZEM1dFlXdGxJQ2QwYUdWaFpDY3NJR1JsWm1GMWJIUnpMblJvWldGa1hISmNiaUFnSUNBZ0lIUm9aV0ZrVW05M0lEMGdkR2hsWVdRdWJXRnJaU0FuZEhJblhISmNiaUFnSUNBZ0lIUmliMlI1SUQwZ2NtVjBMbTFoYTJVZ0ozUmliMlI1Snl3Z1pHVm1ZWFZzZEhNdWRHSnZaSGxjY2x4dUlDQWdJQ0FnY205M2N5NXdkWE5vSUhSaWIyUjVMbTFoYTJVZ0ozUnlKMXh5WEc0Z0lDQWdjbVYwWEhKY2JseHlYRzRnSUNNZ0l5TWpJR3h2WVdSRFpXeHNjMXh5WEc0Z0lDTWdhVzUwWlhKdVlXd2diV1YwYUc5a0lHZDFZWEpoYm5SbFpYTWdkR2hoZENCMFlXSnNaWE1nYkc5aFpHVmtJR1p5YjIwZ1NsTlBUaUJoY21VZ1puVnNiSGtnYkc5aFpHVmtJR2x1ZEc4Z2JXVnRiM0o1WEhKY2JpQWdiRzloWkVObGJHeHpJRDBnS0NrZ0xUNWNjbHh1SUNBZ0lISWdQU0F3WEhKY2JpQWdJQ0IzYUdsc1pTQjBZbTlrZVZzd1hTNXliM2R6TG14bGJtZDBhQ0ErSUhKY2NseHVJQ0FnSUNBZ1l5QTlJREJjY2x4dUlDQWdJQ0FnYldWdFVtOTNJRDBnWld3dWNtVnpkRzl5WlVWc1pXMWxiblFnZEdKdlpIbGJNRjB1Y205M2MxdHlYVnh5WEc0Z0lDQWdJQ0J5YjNkekxuQjFjMmdnYldWdFVtOTNYSEpjYmlBZ0lDQWdJSGRvYVd4bElIUmliMlI1V3pCZExuSnZkM05iY2wwdVkyVnNiSE11YkdWdVozUm9JRDRnWTF4eVhHNGdJQ0FnSUNBZ0lHMWxiVU5sYkd3Z1BTQmpaV3hzY3k1blpYUWdjaXN4TENCakt6RmNjbHh1SUNBZ0lDQWdJQ0JwWmlCdWIzUWdiV1Z0UTJWc2JGeHlYRzRnSUNBZ0lDQWdJQ0FnYldWdFEyVnNiQ0E5SUdWc0xuSmxjM1J2Y21WRmJHVnRaVzUwSUhSaWIyUjVXekJkTG5KdmQzTmJjbDB1WTJWc2JITmJZMTFjY2x4dUlDQWdJQ0FnSUNBZ0lHTmxiR3h6TG5ObGRDQnlLekVzSUdNck1Td2diV1Z0UTJWc2JGeHlYRzRnSUNBZ0lDQWdJR01nS3owZ01WeHlYRzRnSUNBZ0lDQnlJQ3M5SURGY2NseHVYSEpjYmlBZ0l5QWpJeU1nWm1sc2JFMXBjM05wYm1kY2NseHVJQ0FqSUdsdWRHVnlibUZzSUcxbGRHaHZaQ0JuZFdGeVlXNTBaV1Z6SUhSb1lYUWdZMlZzYkhNZ1pYaHBjM1FnWm05eUlIUm9aU0JrYVcxbGJuTnBiMjV6SUc5bUlIUm9aU0IwWVdKc1pWeHlYRzRnSUdacGJHeE5hWE56YVc1bklEMGdLQ2tnTFQ1Y2NseHVJQ0FnSUdObGJHeHpMbVZoWTJnZ0tISnZkMDV2TENCamIyeE9ieXdnZG1Gc0tTQXRQbHh5WEc0Z0lDQWdJQ0JwWmlCdWIzUWdkbUZzWEhKY2JpQWdJQ0FnSUNBZ2NtOTNJRDBnY21WMExuSnZkeUJ5YjNkT2IxeHlYRzRnSUNBZ0lDQWdJSEp2ZHk1alpXeHNJR052YkU1dkxDQjdmVnh5WEc1Y2NseHVJQ0FqSUNNaklHTnZiSFZ0Ymx4eVhHNGdJQ01nUVdSa2N5QmhJR052YkhWdGJpQnVZVzFsSUhSdklIUm9aU0IwWVdKc1pTQm9aV0ZrWEhKY2JpQWdjbVYwTG1Ga1pDQW5ZMjlzZFcxdUp5d2dLR052YkU1dkxDQmpiMnhPWVcxbEtTQXRQbHh5WEc0Z0lDQWdjbVYwTG1sdWFYUW9LVnh5WEc0Z0lDQWdZMjlzZFcxdVEyOTFiblFnS3owZ01WeHlYRzRnSUNBZ2RHZ2dQU0J1ZFd4c1hISmNiaUFnSUNCcElEMGdNRnh5WEc0Z0lDQWdkMmhwYkdVZ2RHaGxZV1JiTUYwdWNtOTNjMXN3WFM1alpXeHNjeTVzWlc1bmRHZ2dQQ0JqYjJ4T2IxeHlYRzRnSUNBZ0lDQnVZWFJwZG1WVWFDQTlJSFJvWldGa1d6QmRMbkp2ZDNOYk1GMHVZMlZzYkhOYmFWMWNjbHh1SUNBZ0lDQWdhV1lnYm05MElHNWhkR2wyWlZSb1hISmNiaUFnSUNBZ0lDQWdkR2dnUFNCMGFHVmhaRkp2ZHk1dFlXdGxJQ2QwYUNjc0lIdDlYSEpjYmlBZ0lDQWdJR1ZzYzJWY2NseHVJQ0FnSUNBZ0lDQjBhQ0E5SUdWc0xuSmxjM1J2Y21WRmJHVnRaVzUwSUc1aGRHbDJaVlJvTENBbmRHZ25YSEpjYmlBZ0lDQWdJR2tnS3owZ01WeHlYRzRnSUNBZ2FXWWdibTkwSUhSb1hISmNiaUFnSUNBZ0lHNWhkR2wyWlZSb0lEMGdkR2hsWVdSYk1GMHVjbTkzYzFzd1hTNWpaV3hzYzF0amIyeE9ieTB4WFZ4eVhHNGdJQ0FnSUNCMGFDQTlJR1ZzTG5KbGMzUnZjbVZGYkdWdFpXNTBJRzVoZEdsMlpWUm9MQ0FuZEdnblhISmNiaUFnSUNCMGFDNTBaWGgwSUdOdmJFNWhiV1ZjY2x4dUlDQWdJSFJvWEhKY2JseHlYRzRnSUNNZ0l5TWdjbTkzWEhKY2JpQWdJeUJCWkdSeklHRWdibVYzSUhKdmR5QW9kSElwSUhSdklIUm9aU0IwWVdKc1pTQmliMlI1WEhKY2JpQWdjbVYwTG1Ga1pDQW5jbTkzSnl3Z0tISnZkMDV2TENCdmNIUnpLU0F0UGx4eVhHNGdJQ0FnY205M0lEMGdjbTkzYzF0eWIzZE9ieTB4WFZ4eVhHNWNjbHh1SUNBZ0lHbG1JRzV2ZENCeWIzZGNjbHh1SUNBZ0lDQWdkMmhwYkdVZ2NtOTNjeTVzWlc1bmRHZ2dQQ0J5YjNkT2IxeHlYRzRnSUNBZ0lDQWdJSEp2ZHlBOUlIUmliMlI1TG0xaGEyVWdKM1J5Snl3Z2UzMWNjbHh1SUNBZ0lDQWdJQ0J5YjNkekxuQjFjMmdnY205M1hISmNibHh5WEc0Z0lDQWdhV1lnYm05MElISnZkeTVqWld4c1hISmNiaUFnSUNBZ0lISnZkeTVoWkdRZ0oyTmxiR3duTENBb1kyOXNUbThzSUc5d2RITXBJQzArWEhKY2JpQWdJQ0FnSUNBZ1kyVnNiQ0E5SUU5S0xtNXZaR1Z6TG5Sa0lHOXdkSE1zSUhKdmQxeHlYRzRnSUNBZ0lDQWdJR05sYkd4ekxuTmxkQ0J5YjNkT2J5d2dZMjlzVG04c0lHTmxiR3hjY2x4dUlDQWdJQ0FnSUNCalpXeHNYSEpjYmx4eVhHNGdJQ0FnY205M1hISmNibHh5WEc0Z0lDTWdJeU1nWTJWc2JGeHlYRzRnSUNNZ1FXUmtjeUJoSUdObGJHd2dLSFJ5TDNSa0tTQjBieUIwYUdVZ2RHRmliR1VnWW05a2VWeHlYRzRnSUhKbGRDNWhaR1FnSjJObGJHd25MQ0FvY205M1RtOHNJR052YkU1dkxDQnZjSFJ6S1NBdFBseHlYRzRnSUNBZ2FXWWdjbTkzVG04Z1BDQXhJSFJvWlc0Z2NtOTNUbThnUFNBeFhISmNiaUFnSUNCcFppQmpiMnhPYnlBOElERWdkR2hsYmlCamIyeE9ieUE5SURGY2NseHVJQ0FnSUdsbUlHTnZiSFZ0YmtOdmRXNTBJRDRnTUNCaGJtUWdZMjlzVG04dE1TQStJR052YkhWdGJrTnZkVzUwSUhSb1pXNGdkR2h5YjNjZ2JtVjNJRVZ5Y205eUlDZEJJR052YkhWdGJpQnVZVzFsSUdoaGN5QnViM1FnWW1WbGJpQmtaV1pwYm1Wa0lHWnZjaUIwYUdseklIQnZjMmwwYVc5dUlIc25JQ3NnY205M1RtOGdLeUFuZUNjZ0t5QmpiMnhPYnlBcklDZDlMaWRjY2x4dVhISmNiaUFnSUNCeWIzY2dQU0J5WlhRdWNtOTNJSEp2ZDA1dlhISmNibHh5WEc0Z0lDQWdZMlZzYkNBOUlHTmxiR3h6TG1kbGRDQnliM2RPYnl3Z1kyOXNUbTljY2x4dVhISmNiaUFnSUNCcFppQnViM1FnWTJWc2JGeHlYRzRnSUNBZ0lDQnBJRDBnTUZ4eVhHNGdJQ0FnSUNCM2FHbHNaU0JwSUR3Z1kyOXNUbTljY2x4dUlDQWdJQ0FnSUNCcElDczlJREZjY2x4dUlDQWdJQ0FnSUNCcFppQnBJR2x6SUdOdmJFNXZYSEpjYmlBZ0lDQWdJQ0FnSUNCdWRVOXdkSE1nUFNCUFNpNWxlSFJsYm1RZ2UzQnliM0J6T2lCa1pXWmhkV3gwY3k1alpXeHNjMzBzSUc5d2RITmNjbHh1SUNBZ0lDQWdJQ0FnSUdObGJHd2dQU0J5YjNjdVkyVnNiQ0JqYjJ4T2J5d2diblZQY0hSelhISmNiaUFnSUNBZ0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNBZ0lDQWdkSEo1UTJWc2JDQTlJR05sYkd4ekxtZGxkQ0J5YjNkT2J5d2dhVnh5WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdibTkwSUhSeWVVTmxiR3hjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdkSEo1UTJWc2JDQTlJQ0J5YjNjdVkyVnNiQ0JwTENCd2NtOXdjem9nWkdWbVlYVnNkSE11WTJWc2JITmNjbHh1WEhKY2JpQWdJQ0JqWld4c1hISmNibHh5WEc0Z0lDTWdJeU1nUm1sdVlXeHBlbVZjY2x4dUlDQWpJRVpwYm1Gc2FYcGxJR2QxWVhKaGJuUmxaWE1nZEdoaGRDQjBhR1ZoWkNCaGJtUWdkR0p2WkhrZ1lXNWtJR055WldGMFpXUWdkMmhsYmlCMGFHVWdibTlrWlNCcGN5Qm1kV3hzZVNCcGJuTjBZVzUwYVdGMFpXUmNjbHh1SUNCcGJtbDBLQ2xjY2x4dVhISmNiaUFnSXlBakl5QlVTR1ZoWkZ4eVhHNGdJQ01nUlhod2IzTmxJSFJvWlNCcGJuUmxjbTVoYkNCMGFHVmhaQ0J1YjJSbFhISmNiaUFnY21WMExtRmtaQ0FuZEdobFlXUW5MQ0IwYUdWaFpGeHlYRzVjY2x4dUlDQWpJQ01qSUZSQ2IyUjVYSEpjYmlBZ0l5QkZlSEJ2YzJVZ2RHaGxJR2x1ZEdWeWJtRnNJSFJpYjJSNUlHNXZaR1ZjY2x4dUlDQnlaWFF1WVdSa0lDZDBZbTlrZVNjc0lIUmliMlI1WEhKY2JseHlYRzRnSUNBZ1hISmNibHh5WEc0Z0lISmxkRnh5WEc1Y2NseHVUMG91Ym05a1pYTXVjbVZuYVhOMFpYSWdibTlrWlU1aGJXVXNJRzV2WkdWY2NseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQnViMlJsWEhKY2JpSmRmUT09IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXHJcblxyXG5ub2RlTmFtZSA9ICd0ZXh0YXJlYSdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgbmFtZTogJydcclxuICAgICAgcGxhY2Vob2xkZXI6ICcnXHJcbiAgICAgIHZhbHVlOiAnJ1xyXG4gICAgICB0ZXh0OiAnJ1xyXG4gICAgICBtYXhsZW5ndGg6ICcnXHJcbiAgICAgIGF1dG9mb2N1czogZmFsc2VcclxuICAgICAgaXNSZXF1aXJlZDogZmFsc2VcclxuICAgICAgcm93czogM1xyXG4gICAgICBjb2xzOiAyNVxyXG4gICAgICBkaXNhYmxlZDogZmFsc2VcclxuICAgICAgcmVhZG9ubHk6IGZhbHNlXHJcbiAgICAgIGZvcm06ICcnXHJcbiAgICAgIHdyYXA6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICB2YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICBzd2l0Y2ggZGVmYXVsdHMucHJvcHMudHlwZVxyXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMuY2hlY2tib3hcclxuICAgICAgICB2YWx1ZSA9IHJldC4kLmlzKCc6Y2hlY2tlZCcpXHJcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5yYWRpb1xyXG4gICAgICAgIHZhbHVlID0gcmV0LiQuZmluZCgnOmNoZWNrZWQnKS52YWwoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdmFsdWUgPSByZXQudmFsKClcclxuXHJcbiAgIyBDbGljayBiaW5kaW5nXHJcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICByZXR2YWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXHJcblxyXG4gICMgQ2hhbmdlIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2hhbmdlIGlzbnQgT0oubm9vcFxyXG4gICAgY2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gICAgbmV3Q2hhbmdlID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICByZXR2YWwgPSBjaGFuZ2UgZXZlbnQuLi5cclxuICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgcmV0dmFsXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2hhbmdlID0gbmV3Q2hhbmdlXHJcblxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxubm9kZU5hbWUgPSAndGhlYWQnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBudW1iZXI6IDFcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gIHJvd3MgPSBbXVxyXG4gIGNlbGxzID0ge31cclxuICByZXQuYWRkICdjZWxsJywgKHJvd05vLCBjb2xObykgLT5cclxuICAgIGluaXQoKVxyXG5cclxuICAgIGlmIHJvd05vIDwgMSB0aGVuIHJvd05vID0gMVxyXG4gICAgaWYgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXHJcblxyXG4gICAgcm93ID0gcm93c1tyb3dOby0xXVxyXG5cclxuICAgIGlmIG5vdCByb3dcclxuICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xyXG4gICAgICAgIHJvdyA9IE9KLm5vZGVzLnRyIHt9LCB0Ym9keSwgZmFsc2VcclxuICAgICAgICByb3dzLnB1c2ggcm93XHJcblxyXG4gICAgdGQgPSByb3dbMF0uY2VsbHNbY29sTm9dXHJcblxyXG4gICAgaWYgdGQgdGhlbiBjZWxsID0gZWwucmVzdG9yZUVsZW1lbnQgdGQsICd0ZCdcclxuICAgIGlmIG5vdCB0ZFxyXG4gICAgICB3aGlsZSByb3dbMF0uY2VsbHMubGVuZ3RoIDwgY29sTm9cclxuICAgICAgICBpZHggPSByb3dbMF0uY2VsbHMubGVuZ3RoXHJcbiAgICAgICAgdGQgPSByb3dbMF0uY2VsbHNbaWR4LTFdXHJcbiAgICAgICAgaWYgdGQgYW5kIGlkeCBpcyBjb2xOb1xyXG4gICAgICAgICAgY2VsbCA9IGVsLnJlc3RvcmVFbGVtZW50IHRkLCAndGQnXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgY2VsbCA9IE9KLm5vZGVzLnRkIHByb3BzOiBkZWZhdWx0cy5jZWxscywgcm93LCBmYWxzZVxyXG5cclxuICAgIGlmIG5vdCBjZWxsLmlzVmFsaWRcclxuICAgICAgbm9kZUZhY3RvcnkgY2VsbCwgcm93LCByb3dObyArIGNvbE5vXHJcblxyXG4gICAgY2VsbFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbm5vZGVOYW1lID0gJ3VsJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOiB7fVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgdGhpc0dsb2JhbDtcblxudGhpc0dsb2JhbCA9ICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJyAmJiBnbG9iYWwgPyBnbG9iYWwgOiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmIHNlbGYgPyBzZWxmIDogKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdyA/IHdpbmRvdyA6IHRoaXMpKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gdGhpc0dsb2JhbDtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRnhuYkc5aVlXd3VZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRU3hKUVVGQk96dEJRVUZCTEZWQlFVRXNSMEZCWVN4RFFVRkxMRTlCUVU4c1RVRkJVQ3hMUVVGdFFpeFhRVUZ1UWl4SlFVRnRReXhOUVVGMlF5eEhRVUZ2UkN4TlFVRndSQ3hIUVVGblJTeERRVUZMTEU5QlFVOHNTVUZCVUN4TFFVRnBRaXhYUVVGcVFpeEpRVUZwUXl4SlFVRnlReXhIUVVGblJDeEpRVUZvUkN4SFFVRXdSQ3hEUVVGTExFOUJRVThzVFVGQlVDeExRVUZ0UWl4WFFVRnVRaXhKUVVGdFF5eE5RVUYyUXl4SFFVRnZSQ3hOUVVGd1JDeEhRVUZuUlN4SlFVRnFSU3hEUVVFelJDeERRVUZxUlRzN1FVRkRZaXhOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWlJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lkR2hwYzBkc2IySmhiQ0E5SUNocFppQW9kSGx3Wlc5bUlHZHNiMkpoYkNCcGMyNTBJQ2QxYm1SbFptbHVaV1FuSUdGdVpDQm5iRzlpWVd3cElIUm9aVzRnWjJ4dlltRnNJR1ZzYzJVZ0tHbG1JQ2gwZVhCbGIyWWdjMlZzWmlCcGMyNTBJQ2QxYm1SbFptbHVaV1FuSUdGdVpDQnpaV3htS1NCMGFHVnVJSE5sYkdZZ1pXeHpaU0FvYVdZZ0tIUjVjR1Z2WmlCM2FXNWtiM2NnYVhOdWRDQW5kVzVrWldacGJtVmtKeUJoYm1RZ2QybHVaRzkzS1NCMGFHVnVJSGRwYm1SdmR5QmxiSE5sSUhSb2FYTXBLU2xjY2x4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCMGFHbHpSMnh2WW1Gc0lsMTkiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnYnV0dG9uaW5wdXQnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6ICdidXR0b24nXHJcbiAgICAgIHNyYzogJydcclxuICAgICAgYWx0OiAnJ1xyXG4gICAgICBoZWlnaHQ6ICcnXHJcbiAgICAgIHdpZHRoOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBvYmouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnY2hlY2tib3gnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgY2hlY2tlZDogZmFsc2VcclxuICAgIGluZGV0ZXJtaW5hdGU6IGZhbHNlXHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgaWYgZGVmYXVsdHMuY2hlY2tlZFxyXG4gICAgcmV0LmF0dHIgJ2NoZWNrZWQnLCB0cnVlXHJcbiAgZWxzZSBpZiBkZWZhdWx0cy5pbmRldGVybWluYXRlXHJcbiAgICByZXQuYXR0ciAnaW5kZXRlcm1pbmF0ZScsIHRydWVcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdjb2xvcidcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdkYXRlJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICdkYXRldGltZSdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ2RhdGV0aW1lLWxvY2FsJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnZW1haWwnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBtdWx0aXBsZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnZmlsZSdcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICAgIGFjY2VwdDogJydcclxuICAgICAgbXVsdGlwbGU6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ2hpZGRlbidcclxuXHJcbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgdHlwZTogaW5wdXROYW1lXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ2ltYWdlaW5wdXQnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6ICdpbWFnZSdcclxuICAgICAgc3JjOiAnJ1xyXG4gICAgICBhbHQ6ICcnXHJcbiAgICAgIGhlaWdodDogJydcclxuICAgICAgd2lkdGg6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ21vbnRoJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnbnVtYmVyJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAncGFzc3dvcmQnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBtYXhsZW5ndGg6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3JhZGlvJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgbmFtZTogJydcclxuICAgICAgdmFsdWU6ICcnXHJcbiAgICAgIGNoZWNrZWQ6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3JhbmdlJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgbWluOiAwXHJcbiAgICAgIG1heDogMTAwXHJcbiAgICAgIHZhbHVlOiA1MFxyXG4gICAgICBzdGVwOiAxXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3Jlc2V0J1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnc2VhcmNoJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAnc3VibWl0J1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxyXG4gIHJldFxyXG5cclxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxyXG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXHJcblxyXG5pbnB1dE5hbWUgPSAndGVsJ1xyXG5cclxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiBpbnB1dE5hbWVcclxuICAgICAgcGF0dGVybjogJydcclxuICAgICAgbWF4bGVuZ3RoOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICd0ZXh0aW5wdXQnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6ICd0ZXh0J1xyXG4gICAgICBhdXRvY29tcGxldGU6ICdvbidcclxuICAgICAgYXV0b3NhdmU6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3RpbWUnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcclxuXHJcbmlucHV0TmFtZSA9ICd1cmwnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgICBwYXR0ZXJuOiAnJ1xyXG4gICAgICBtYXhsZW5ndGg6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcclxuICByZXRcclxuXHJcbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xyXG5cclxuaW5wdXROYW1lID0gJ3dlZWsnXHJcblxyXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXHJcbiAgcmV0XHJcblxyXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxyXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgTnNUcmVlLCBtYWtlVGhlSnVpY2UsIG5hbWVTcGFjZU5hbWUsIHRoaXNEb2N1bWVudCwgdGhpc0dsb2JhbCwgdXRpbExpYjtcblxudGhpc0dsb2JhbCA9IHJlcXVpcmUoJy4vZ2xvYmFsJyk7XG5cbnV0aWxMaWIgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cbm5hbWVTcGFjZU5hbWUgPSAnT0onO1xuXG5cbi8qXG5ib290IHN0cmFwIG5hbWUgbWV0aG9kIGludG8gT2JqZWN0IHByb3RvdHlwZVxuICovXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE9iamVjdC5wcm90b3R5cGUsIHtcbiAgZ2V0SW5zdGFuY2VOYW1lOiB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZ1bmNOYW1lUmVnZXgsIHJlc3VsdHM7XG4gICAgICBmdW5jTmFtZVJlZ2V4ID0gL2Z1bmN0aW9uICguezEsfSlcXCgvO1xuICAgICAgcmVzdWx0cyA9IGZ1bmNOYW1lUmVnZXguZXhlYyh0aGlzLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpO1xuICAgICAgaWYgKHJlc3VsdHMgJiYgcmVzdWx0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRzWzFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cblxuLypcbkFuIGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBuYW1lc3BhY2UgdHJlZVxuICovXG5cbk5zVHJlZSA9IHt9O1xuXG5tYWtlVGhlSnVpY2UgPSBmdW5jdGlvbigpIHtcblxuICAvKlxuICBJbnRlcm5hbCBuYW1lU3BhY2VOYW1lIG1ldGhvZCB0byBjcmVhdGUgbmV3ICdzdWInIG5hbWVzcGFjZXMgb24gYXJiaXRyYXJ5IGNoaWxkIG9iamVjdHMuXG4gICAqL1xuICB2YXIgTnNPdXQsIGRlcGVuZHNPbiwgbWFrZU5hbWVTcGFjZSwgbnNJbnRlcm5hbDtcbiAgbWFrZU5hbWVTcGFjZSA9IGZ1bmN0aW9uKHNwYWNlbmFtZSwgdHJlZSkge1xuXG4gICAgLypcbiAgICBUaGUgZGVyaXZlZCBpbnN0YW5jZSB0byBiZSBjb25zdHJ1Y3RlZFxuICAgICAqL1xuICAgIHZhciBCYXNlLCBDbGFzcztcbiAgICBCYXNlID0gZnVuY3Rpb24obnNOYW1lKSB7XG4gICAgICB2YXIgbWVtYmVycywgbnNUcmVlLCBwcm90bztcbiAgICAgIHByb3RvID0gdGhpcztcbiAgICAgIHRyZWVbbnNOYW1lXSA9IHRyZWVbbnNOYW1lXSB8fCB7fTtcbiAgICAgIG5zVHJlZSA9IHRyZWVbbnNOYW1lXTtcbiAgICAgIG1lbWJlcnMgPSB7fTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWVtYmVycycsIHtcbiAgICAgICAgdmFsdWU6IG1lbWJlcnNcblxuICAgICAgICAvKlxuICAgICAgICBSZWdpc3RlciAoZS5nLiAnTGlmdCcpIGFuIE9iamVjdCBpbnRvIHRoZSBwcm90b3R5cGUgb2YgdGhlIG5hbWVzcGFjZS5cbiAgICAgICAgVGhpcyBPYmplY3Qgd2lsbCBiZSByZWFkYWJsZS9leGVjdXRhYmxlIGJ1dCBpcyBvdGhlcndpc2UgaW1tdXRhYmxlLlxuICAgICAgICAgKi9cbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdyZWdpc3RlcicsIHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKG5hbWUsIG9iaiwgZW51bWVyYWJsZSkge1xuICAgICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgICBpZiAoKHR5cGVvZiBuYW1lICE9PSAnc3RyaW5nJykgfHwgbmFtZSA9PT0gJycpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIG5hbWUuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghb2JqKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsaWZ0IGEgbmV3IHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBwcm9wZXJ0eSBpbnN0YW5jZS4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHByb3RvW25hbWVdKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3BlcnR5IG5hbWVkICcgKyBuYW1lICsgJyBpcyBhbHJlYWR5IGRlZmluZWQgb24gJyArIHNwYWNlbmFtZSArICcuJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1lbWJlcnNbbmFtZV0gPSBtZW1iZXJzW25hbWVdIHx8IG5hbWU7XG4gICAgICAgICAgbnNUcmVlW25hbWVdID0gbnNUcmVlW25hbWVdIHx8IHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICB0eXBlOiB0eXBlb2Ygb2JqLFxuICAgICAgICAgICAgaW5zdGFuY2U6IChvYmouZ2V0SW5zdGFuY2VOYW1lID8gb2JqLmdldEluc3RhbmNlTmFtZSgpIDogJ3Vua25vd24nKVxuICAgICAgICAgIH07XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBuYW1lLCB7XG4gICAgICAgICAgICB2YWx1ZTogb2JqLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UgIT09IGVudW1lcmFibGVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBuc0ludGVybmFsLmFsZXJ0RGVwZW5kZW50cyhuc05hbWUgKyAnLicgKyBzcGFjZW5hbWUgKyAnLicgKyBuYW1lKTtcbiAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLypcbiAgICAgIENyZWF0ZSBhIG5ldywgc3RhdGljIG5hbWVzcGFjZSBvbiB0aGUgY3VycmVudCBwYXJlbnQgKGUuZy4gbnNOYW1lLnRvLi4uIHx8IG5zTmFtZS5pcy4uLilcbiAgICAgICAqL1xuICAgICAgcHJvdG8ucmVnaXN0ZXIoJ21ha2VTdWJOYW1lU3BhY2UnLCAoZnVuY3Rpb24oc3ViTmFtZVNwYWNlKSB7XG4gICAgICAgICd1c2Ugc3RyaWN0JztcbiAgICAgICAgdmFyIG5ld05hbWVTcGFjZTtcbiAgICAgICAgaWYgKCh0eXBlb2Ygc3ViTmFtZVNwYWNlICE9PSAnc3RyaW5nJykgfHwgc3ViTmFtZVNwYWNlID09PSAnJykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIG5ldyBzdWIgbmFtZXNwYWNlIHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcm90by5zdWJOYW1lU3BhY2UpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1YiBuYW1lc3BhY2UgbmFtZWQgJyArIHN1Yk5hbWVTcGFjZSArICcgaXMgYWxyZWFkeSBkZWZpbmVkIG9uICcgKyBzcGFjZW5hbWUgKyAnLicpO1xuICAgICAgICB9XG4gICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzKG5zTmFtZSArICcuJyArIHN1Yk5hbWVTcGFjZSk7XG4gICAgICAgIG5ld05hbWVTcGFjZSA9IG1ha2VOYW1lU3BhY2Uoc3ViTmFtZVNwYWNlLCBuc1RyZWUpO1xuICAgICAgICBpZiAoc3ViTmFtZVNwYWNlICE9PSAnY29uc3RhbnRzJykge1xuICAgICAgICAgIG5ld05hbWVTcGFjZS5yZWdpc3RlcignY29uc3RhbnRzJywgbWFrZU5hbWVTcGFjZSgnY29uc3RhbnRzJywgbnNUcmVlKSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHByb3RvLnJlZ2lzdGVyKHN1Yk5hbWVTcGFjZSwgbmV3TmFtZVNwYWNlLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiBuZXdOYW1lU3BhY2U7XG4gICAgICB9KSwgZmFsc2UpO1xuICAgIH07XG5cbiAgICAvKlxuICAgIEFuIGludGVybmFsIG1lY2hhbmlzbSB0byByZXByZXNlbnQgdGhlIGluc3RhbmNlIG9mIHRoaXMgbmFtZXNwYWNlXG4gICAgQGNvbnN0cnVjdG9yXG4gICAgQGludGVybmFsXG4gICAgQG1lbWJlck9mIG1ha2VOYW1lU3BhY2VcbiAgICAgKi9cbiAgICBDbGFzcyA9IG5ldyBGdW5jdGlvbigncmV0dXJuIGZ1bmN0aW9uICcgKyBzcGFjZW5hbWUgKyAnKCl7fScpKCk7XG4gICAgQ2xhc3MucHJvdG90eXBlID0gbmV3IEJhc2Uoc3BhY2VuYW1lKTtcbiAgICByZXR1cm4gbmV3IENsYXNzKHNwYWNlbmFtZSk7XG4gIH07XG5cbiAgLypcbiAgJ0RlcGVuZCcgYW4gT2JqZWN0IHVwb24gYW5vdGhlciBtZW1iZXIgb2YgdGhpcyBuYW1lc3BhY2UsIHVwb24gYW5vdGhlciBuYW1lc3BhY2UsXG4gIG9yIHVwb24gYSBtZW1iZXIgb2YgYW5vdGhlciBuYW1lc3BhY2VcbiAgICovXG4gIGRlcGVuZHNPbiA9IGZ1bmN0aW9uKGRlcGVuZGVuY2llcywgY2FsbEJhY2ssIGltcG9ydHMpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIG1pc3NpbmcsIG5zTWVtYmVycywgcmV0O1xuICAgIHJldCA9IGZhbHNlO1xuICAgIG5zTWVtYmVycyA9IG5zSW50ZXJuYWwuZ2V0TnNNZW1iZXJzKCk7XG4gICAgaWYgKGRlcGVuZGVuY2llcyAmJiBkZXBlbmRlbmNpZXMubGVuZ3RoID4gMCAmJiBjYWxsQmFjaykge1xuICAgICAgbWlzc2luZyA9IGRlcGVuZGVuY2llcy5maWx0ZXIoZnVuY3Rpb24oZGVwZW4pIHtcbiAgICAgICAgcmV0dXJuIG5zTWVtYmVycy5pbmRleE9mKGRlcGVuKSA9PT0gLTEgJiYgKCFpbXBvcnRzIHx8IGltcG9ydHMgIT09IGRlcGVuKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKG1pc3NpbmcubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldCA9IHRydWU7XG4gICAgICAgIGNhbGxCYWNrKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuc0ludGVybmFsLmRlcGVuZGVudHMucHVzaChmdW5jdGlvbihpbXBvcnRzKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcGVuZHNPbihtaXNzaW5nLCBjYWxsQmFjaywgaW1wb3J0cyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xuICBuc0ludGVybmFsID0ge1xuICAgIGRlcGVuZGVudHM6IFtdXG5cbiAgICAvKlxuICAgIEZldGNoZXMgdGhlIHJlZ2lzdGVyZWQgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBvbiB0aGUgbmFtZXNwYWNlIGFuZCBpdHMgY2hpbGQgbmFtZXNwYWNlc1xuICAgICAqL1xuICB9O1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkobnNJbnRlcm5hbCwgJ2dldE5zTWVtYmVycycsIHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgbWVtYmVycywgcmVjdXJzZVRyZWU7XG4gICAgICByZWN1cnNlVHJlZSA9IGZ1bmN0aW9uKGtleSwgbGFzdEtleSkge1xuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBtZW1iZXJzLnB1c2gobGFzdEtleSArICcuJyArIGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHV0aWxMaWIuaXNQbGFpbk9iamVjdChrZXkpKSB7XG4gICAgICAgICAgT2JqZWN0LmtleXMoa2V5KS5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgayA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgbWVtYmVycy5wdXNoKGxhc3RLZXkgKyAnLicgKyBrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh1dGlsTGliLmlzUGxhaW5PYmplY3Qoa2V5W2tdKSkge1xuICAgICAgICAgICAgICByZWN1cnNlVHJlZShrZXlba10sIGxhc3RLZXkgKyAnLicgKyBrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIG1lbWJlcnMgPSBbXTtcbiAgICAgIE9iamVjdC5rZXlzKE5zVHJlZVtuYW1lU3BhY2VOYW1lXSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgaWYgKHV0aWxMaWIuaXNQbGFpbk9iamVjdChOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSkpIHtcbiAgICAgICAgICByZWN1cnNlVHJlZShOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSwgbmFtZVNwYWNlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG1lbWJlcnM7XG4gICAgfVxuICB9KTtcblxuICAvKlxuICBUbyBzdXBwb3J0IGRlcGVuZGVuY3kgbWFuYWdlbWVudCwgd2hlbiBhIHByb3BlcnR5IGlzIGxpZnRlZCBvbnRvIHRoZSBuYW1lc3BhY2UsIG5vdGlmeSBkZXBlbmRlbnRzIHRvIGluaXRpYWxpemVcbiAgICovXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuc0ludGVybmFsLCAnYWxlcnREZXBlbmRlbnRzJywge1xuICAgIHZhbHVlOiBmdW5jdGlvbihpbXBvcnRzKSB7XG4gICAgICB2YXIgZGVwcztcbiAgICAgIGRlcHMgPSBuc0ludGVybmFsLmRlcGVuZGVudHMuZmlsdGVyKGZ1bmN0aW9uKGRlcE9uKSB7XG4gICAgICAgIHJldHVybiBmYWxzZSA9PT0gZGVwT24oaW1wb3J0cyk7XG4gICAgICB9KTtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGRlcHMpKSB7XG4gICAgICAgIHJldHVybiBuc0ludGVybmFsLmRlcGVuZGVudHMgPSBkZXBzO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSA9IHt9O1xuICBOc091dCA9IG1ha2VOYW1lU3BhY2UobmFtZVNwYWNlTmFtZSwgTnNUcmVlW25hbWVTcGFjZU5hbWVdKTtcblxuICAvKlxuICBDYWNoZSBhIGhhbmRsZSBvbiB0aGUgdmVuZG9yIChwcm9iYWJseSBqUXVlcnkpIG9uIHRoZSByb290IG5hbWVzcGFjZVxuICAgKi9cbiAgTnNPdXQucmVnaXN0ZXIoJz8nLCB1dGlsTGliLCBmYWxzZSk7XG5cbiAgLypcbiAgQ2FjaGUgdGhlIHRyZWUgKHVzZWZ1bCBmb3IgZG9jdW1lbnRhdGlvbi92aXN1YWxpemF0aW9uL2RlYnVnZ2luZylcbiAgICovXG4gIE5zT3V0LnJlZ2lzdGVyKCd0cmVlJywgTnNUcmVlW25hbWVTcGFjZU5hbWVdLCBmYWxzZSk7XG5cbiAgLypcbiAgQ2FjaGUgdGhlIG5hbWUgc3BhY2UgbmFtZVxuICAgKi9cbiAgTnNPdXQucmVnaXN0ZXIoJ25hbWUnLCBuYW1lU3BhY2VOYW1lLCBmYWxzZSk7XG4gIE5zT3V0LnJlZ2lzdGVyKCdkZXBlbmRzT24nLCBkZXBlbmRzT24sIGZhbHNlKTtcbiAgcmV0dXJuIE5zT3V0O1xufTtcblxuXG4vKlxuQWN0dWFsbHkgZGVmaW5lIHRoZSBPSiBOYW1lU3BhY2VcbiAqL1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkodGhpc0dsb2JhbCwgbmFtZVNwYWNlTmFtZSwge1xuICB2YWx1ZTogbWFrZVRoZUp1aWNlKClcbn0pO1xuXG5PSi5yZWdpc3RlcignZ2xvYmFsJywgdGhpc0dsb2JhbCk7XG5cbnRoaXNEb2N1bWVudCA9IHt9O1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICB0aGlzRG9jdW1lbnQgPSBkb2N1bWVudDtcbn1cblxuT0oucmVnaXN0ZXIoJ2RvY3VtZW50JywgdGhpc0RvY3VtZW50KTtcblxuT0oucmVnaXN0ZXIoJ25vb3AnLCBmdW5jdGlvbigpIHt9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBPSjtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRnh2YWk1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVOQkxFbEJRVUU3TzBGQlFVRXNWVUZCUVN4SFFVRmhMRTlCUVVFc1EwRkJVU3hWUVVGU096dEJRVU5pTEU5QlFVRXNSMEZCVlN4UFFVRkJMRU5CUVZFc1VVRkJVanM3UVVGRFZpeGhRVUZCTEVkQlFXZENPenM3UVVGRmFFSTdPenM3UVVGSFFTeE5RVUZOTEVOQlFVTXNaMEpCUVZBc1EwRkJkMElzVFVGQlRTeERRVUZCTEZOQlFUbENMRVZCUTBVN1JVRkJRU3hsUVVGQkxFVkJRMFU3U1VGQlFTeExRVUZCTEVWQlFVOHNVMEZCUVR0QlFVTk1MRlZCUVVFN1RVRkJRU3hoUVVGQkxFZEJRV2RDTzAxQlEyaENMRTlCUVVFc1IwRkJWeXhoUVVGakxFTkJRVU1zU1VGQmFFSXNRMEZCY1VJc1NVRkJReXhEUVVGQkxGZEJRVmNzUTBGQlF5eFJRVUZpTEVOQlFVRXNRMEZCY2tJN1RVRkRWQ3hKUVVGSkxFOUJRVUVzU1VGQldTeFBRVUZQTEVOQlFVTXNUVUZCVWl4SFFVRnBRaXhEUVVGcVF6dGxRVUY1UXl4UFFVRlJMRU5CUVVFc1EwRkJRU3hGUVVGcVJEdFBRVUZCTEUxQlFVRTdaVUZCZVVRc1IwRkJla1E3TzBsQlNFa3NRMEZCVUR0SFFVUkdPME5CUkVZN096dEJRVkZCT3pzN08wRkJSMEVzVFVGQlFTeEhRVUZUT3p0QlFVTlVMRmxCUVVFc1IwRkJaU3hUUVVGQk96dEJRVVZpT3pzN1FVRkJRU3hOUVVGQk8wVkJSMEVzWVVGQlFTeEhRVUZuUWl4VFFVRkRMRk5CUVVRc1JVRkJXU3hKUVVGYU96dEJRVU5rT3pzN1FVRkJRU3hSUVVGQk8wbEJSMEVzU1VGQlFTeEhRVUZQTEZOQlFVTXNUVUZCUkR0QlFVTk1MRlZCUVVFN1RVRkJRU3hMUVVGQkxFZEJRVkU3VFVGRFVpeEpRVUZMTEVOQlFVRXNUVUZCUVN4RFFVRk1MRWRCUVdVc1NVRkJTeXhEUVVGQkxFMUJRVUVzUTBGQlRDeEpRVUZuUWp0TlFVTXZRaXhOUVVGQkxFZEJRVk1zU1VGQlN5eERRVUZCTEUxQlFVRTdUVUZEWkN4UFFVRkJMRWRCUVZVN1RVRkZWaXhOUVVGTkxFTkJRVU1zWTBGQlVDeERRVUZ6UWl4SlFVRjBRaXhGUVVFMFFpeFRRVUUxUWl4RlFVRjFRenRSUVVGQkxFdEJRVUVzUlVGQlR6czdRVUZGT1VNN096dFhRVVoxUXp0UFFVRjJRenROUVUxQkxFMUJRVTBzUTBGQlF5eGpRVUZRTEVOQlFYTkNMRWxCUVhSQ0xFVkJRVFJDTEZWQlFUVkNMRVZCUTBVN1VVRkJRU3hMUVVGQkxFVkJRVThzVTBGQlF5eEpRVUZFTEVWQlFVOHNSMEZCVUN4RlFVRlpMRlZCUVZvN1ZVRkRURHRWUVVOQkxFbEJRWGRGTEVOQlFVTXNUMEZCVHl4SlFVRlFMRXRCUVdsQ0xGRkJRV3hDTEVOQlFVRXNTVUZCSzBJc1NVRkJRU3hMUVVGUkxFVkJRUzlITzBGQlFVRXNhMEpCUVZVc1NVRkJRU3hMUVVGQkxFTkJRVTBzYTBSQlFVNHNSVUZCVmpzN1ZVRkRRU3hKUVVGQkxFTkJRWGxHTEVkQlFYcEdPMEZCUVVFc2EwSkJRVlVzU1VGQlFTeExRVUZCTEVOQlFVMHNLMFJCUVU0c1JVRkJWanM3VlVGRFFTeEpRVUUwUml4TFFVRk5MRU5CUVVFc1NVRkJRU3hEUVVGc1J6dEJRVUZCTEd0Q1FVRlZMRWxCUVVFc1MwRkJRU3hEUVVGTkxHbENRVUZCTEVkQlFXOUNMRWxCUVhCQ0xFZEJRVEpDTEhsQ1FVRXpRaXhIUVVGMVJDeFRRVUYyUkN4SFFVRnRSU3hIUVVGNlJTeEZRVUZXT3p0VlFVVkJMRTlCUVZFc1EwRkJRU3hKUVVGQkxFTkJRVklzUjBGQlowSXNUMEZCVVN4RFFVRkJMRWxCUVVFc1EwRkJVaXhKUVVGcFFqdFZRVWRxUXl4TlFVRlBMRU5CUVVFc1NVRkJRU3hEUVVGUUxFZEJRV1VzVFVGQlR5eERRVUZCTEVsQlFVRXNRMEZCVUN4SlFVTmlPMWxCUVVFc1NVRkJRU3hGUVVGTkxFbEJRVTQ3V1VGRFFTeEpRVUZCTEVWQlFVMHNUMEZCVHl4SFFVUmlPMWxCUlVFc1VVRkJRU3hGUVVGVkxFTkJRVWtzUjBGQlJ5eERRVUZETEdWQlFWQXNSMEZCTkVJc1IwRkJSeXhEUVVGRExHVkJRVW9zUTBGQlFTeERRVUUxUWl4SFFVRjFSQ3hUUVVGNFJDeERRVVpXT3p0VlFVbEdMRTFCUVUwc1EwRkJReXhqUVVGUUxFTkJRWE5DTEV0QlFYUkNMRVZCUVRaQ0xFbEJRVGRDTEVWQlEwVTdXVUZCUVN4TFFVRkJMRVZCUVU4c1IwRkJVRHRaUVVOQkxGVkJRVUVzUlVGQldTeExRVUZCTEV0QlFWY3NWVUZFZGtJN1YwRkVSanRWUVVsQkxGVkJRVlVzUTBGQlF5eGxRVUZZTEVOQlFUSkNMRTFCUVVFc1IwRkJVeXhIUVVGVUxFZEJRV1VzVTBGQlppeEhRVUV5UWl4SFFVRXpRaXhIUVVGcFF5eEpRVUUxUkR0cFFrRkRRVHRSUVc1Q1N5eERRVUZRTzA5QlJFWTdPMEZCZFVKQk96czdUVUZIUVN4TFFVRkxMRU5CUVVNc1VVRkJUaXhEUVVGbExHdENRVUZtTEVWQlFXMURMRU5CUVVNc1UwRkJReXhaUVVGRU8xRkJRMnhETzBGQlFVRXNXVUZCUVR0UlFVTkJMRWxCUVN0RkxFTkJRVU1zVDBGQlR5eFpRVUZRTEV0QlFYbENMRkZCUVRGQ0xFTkJRVUVzU1VGQmRVTXNXVUZCUVN4TFFVRm5RaXhGUVVGMFNUdEJRVUZCTEdkQ1FVRlZMRWxCUVVFc1MwRkJRU3hEUVVGTkxIbEVRVUZPTEVWQlFWWTdPMUZCUTBFc1NVRkJlVWNzUzBGQlN5eERRVUZETEZsQlFTOUhPMEZCUVVFc1owSkJRVlVzU1VGQlFTeExRVUZCTEVOQlFVMHNjMEpCUVVFc1IwRkJlVUlzV1VGQmVrSXNSMEZCZDBNc2VVSkJRWGhETEVkQlFXOUZMRk5CUVhCRkxFZEJRV2RHTEVkQlFYUkdMRVZCUVZZN08xRkJRMEVzVlVGQlZTeERRVUZETEdWQlFWZ3NRMEZCTWtJc1RVRkJRU3hIUVVGVExFZEJRVlFzUjBGQlpTeFpRVUV4UXp0UlFVTkJMRmxCUVVFc1IwRkJaU3hoUVVGQkxFTkJRV01zV1VGQlpDeEZRVUUwUWl4TlFVRTFRanRSUVVObUxFbEJRV2xHTEZsQlFVRXNTMEZCYTBJc1YwRkJia2M3VlVGQlFTeFpRVUZaTEVOQlFVTXNVVUZCWWl4RFFVRnpRaXhYUVVGMFFpeEZRVUZ0UXl4aFFVRkJMRU5CUVdNc1YwRkJaQ3hGUVVFeVFpeE5RVUV6UWl4RFFVRnVReXhGUVVGMVJTeExRVUYyUlN4RlFVRkJPenRSUVVOQkxFdEJRVXNzUTBGQlF5eFJRVUZPTEVOQlFXVXNXVUZCWml4RlFVRTJRaXhaUVVFM1FpeEZRVUV5UXl4TFFVRXpRenRsUVVOQk8wMUJVbXRETEVOQlFVUXNRMEZCYmtNc1JVRlRSeXhMUVZSSU8wbEJkRU5MT3p0QlFXdEVVRHM3T3pzN08wbEJUVUVzUzBGQlFTeEhRVUZaTEVsQlFVRXNVVUZCUVN4RFFVRlRMR3RDUVVGQkxFZEJRWEZDTEZOQlFYSkNMRWRCUVdsRExFMUJRVEZETEVOQlFVRXNRMEZCUVR0SlFVTmFMRXRCUVVzc1EwRkJRU3hUUVVGTUxFZEJRV01zU1VGQlFTeEpRVUZCTEVOQlFVc3NVMEZCVER0WFFVZFdMRWxCUVVFc1MwRkJRU3hEUVVGTkxGTkJRVTQ3UlVGb1JWVTdPMEZCYTBWb1FqczdPenRGUVVsQkxGTkJRVUVzUjBGQldTeFRRVUZETEZsQlFVUXNSVUZCWlN4UlFVRm1MRVZCUVhsQ0xFOUJRWHBDTzBsQlExWTdRVUZCUVN4UlFVRkJPMGxCUTBFc1IwRkJRU3hIUVVGTk8wbEJRMDRzVTBGQlFTeEhRVUZaTEZWQlFWVXNRMEZCUXl4WlFVRllMRU5CUVVFN1NVRkRXaXhKUVVGSExGbEJRVUVzU1VGQmFVSXNXVUZCV1N4RFFVRkRMRTFCUVdJc1IwRkJjMElzUTBGQmRrTXNTVUZCTmtNc1VVRkJhRVE3VFVGRFJTeFBRVUZCTEVkQlFWVXNXVUZCV1N4RFFVRkRMRTFCUVdJc1EwRkJiMElzVTBGQlF5eExRVUZFTzJWQlF6VkNMRk5CUVZNc1EwRkJReXhQUVVGV0xFTkJRV3RDTEV0QlFXeENMRU5CUVVFc1MwRkJORUlzUTBGQlF5eERRVUUzUWl4SlFVRnRReXhEUVVGRExFTkJRVWtzVDBGQlNpeEpRVUZsTEU5QlFVRXNTMEZCWVN4TFFVRTNRanROUVVSUUxFTkJRWEJDTzAxQlIxWXNTVUZCUnl4UFFVRlBMRU5CUVVNc1RVRkJVaXhMUVVGclFpeERRVUZ5UWp0UlFVTkZMRWRCUVVFc1IwRkJUVHRSUVVOT0xGRkJRVUVzUTBGQlFTeEZRVVpHTzA5QlFVRXNUVUZCUVR0UlFVbEZMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQmRFSXNRMEZCTWtJc1UwRkJReXhQUVVGRU8ybENRVU42UWl4VFFVRkJMRU5CUVZVc1QwRkJWaXhGUVVGdFFpeFJRVUZ1UWl4RlFVRTJRaXhQUVVFM1FqdFJRVVI1UWl4RFFVRXpRaXhGUVVwR08wOUJTa1k3TzFkQlYwRTdSVUZtVlR0RlFXZENXaXhWUVVGQkxFZEJRV0U3U1VGQlFTeFZRVUZCTEVWQlFWazdPMEZCUlhwQ096dFBRVVpoT3p0RlFVdGlMRTFCUVUwc1EwRkJReXhqUVVGUUxFTkJRWE5DTEZWQlFYUkNMRVZCUVd0RExHTkJRV3hETEVWQlEwVTdTVUZCUVN4TFFVRkJMRVZCUVU4c1UwRkJRVHRCUVVOTUxGVkJRVUU3VFVGQlFTeFhRVUZCTEVkQlFXTXNVMEZCUXl4SFFVRkVMRVZCUVUwc1QwRkJUanRSUVVOYUxFbEJRWEZETEU5QlFWRXNSMEZCVWl4TFFVRm5RaXhSUVVGeVJEdFZRVUZCTEU5QlFVOHNRMEZCUXl4SlFVRlNMRU5CUVdFc1QwRkJRU3hIUVVGVkxFZEJRVllzUjBGQlowSXNSMEZCTjBJc1JVRkJRVHM3VVVGRFFTeEpRVUZITEU5QlFVOHNRMEZCUXl4aFFVRlNMRU5CUVhOQ0xFZEJRWFJDTEVOQlFVZzdWVUZEUlN4TlFVRk5MRU5CUVVNc1NVRkJVQ3hEUVVGWkxFZEJRVm9zUTBGQlowSXNRMEZCUXl4UFFVRnFRaXhEUVVGNVFpeFRRVUZETEVOQlFVUTdXVUZEZGtJc1NVRkJiVU1zVDBGQlVTeERRVUZTTEV0QlFXTXNVVUZCYWtRN1kwRkJRU3hQUVVGUExFTkJRVU1zU1VGQlVpeERRVUZoTEU5QlFVRXNSMEZCVlN4SFFVRldMRWRCUVdkQ0xFTkJRVGRDTEVWQlFVRTdPMWxCUTBFc1NVRkJNRU1zVDBGQlR5eERRVUZETEdGQlFWSXNRMEZCYzBJc1IwRkJTU3hEUVVGQkxFTkJRVUVzUTBGQk1VSXNRMEZCTVVNN1kwRkJRU3hYUVVGQkxFTkJRVmtzUjBGQlNTeERRVUZCTEVOQlFVRXNRMEZCYUVJc1JVRkJiMElzVDBGQlFTeEhRVUZWTEVkQlFWWXNSMEZCWjBJc1EwRkJjRU1zUlVGQlFUczdWVUZHZFVJc1EwRkJla0lzUlVGRVJqczdUVUZHV1R0TlFWTmtMRTlCUVVFc1IwRkJWVHROUVVOV0xFMUJRVTBzUTBGQlF5eEpRVUZRTEVOQlFWa3NUVUZCVHl4RFFVRkJMR0ZCUVVFc1EwRkJia0lzUTBGQmEwTXNRMEZCUXl4UFFVRnVReXhEUVVFeVF5eFRRVUZETEVkQlFVUTdVVUZEZWtNc1NVRkJNRVFzVDBGQlR5eERRVUZETEdGQlFWSXNRMEZCYzBJc1RVRkJUeXhEUVVGQkxHRkJRVUVzUTBGQlpTeERRVUZCTEVkQlFVRXNRMEZCTlVNc1EwRkJNVVE3VlVGQlFTeFhRVUZCTEVOQlFWa3NUVUZCVHl4RFFVRkJMR0ZCUVVFc1EwRkJaU3hEUVVGQkxFZEJRVUVzUTBGQmJFTXNSVUZCZDBNc1lVRkJlRU1zUlVGQlFUczdUVUZFZVVNc1EwRkJNME03WVVGSlFUdEpRV1pMTEVOQlFWQTdSMEZFUmpzN1FVRnJRa0U3T3p0RlFVZEJMRTFCUVUwc1EwRkJReXhqUVVGUUxFTkJRWE5DTEZWQlFYUkNMRVZCUVd0RExHbENRVUZzUXl4RlFVTkZPMGxCUVVFc1MwRkJRU3hGUVVGUExGTkJRVU1zVDBGQlJEdEJRVU5NTEZWQlFVRTdUVUZCUVN4SlFVRkJMRWRCUVU4c1ZVRkJWU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUYwUWl4RFFVRTJRaXhUUVVGRExFdEJRVVE3WlVGRGJFTXNTMEZCUVN4TFFVRlRMRXRCUVVFc1EwRkJUU3hQUVVGT08wMUJSSGxDTEVOQlFUZENPMDFCUjFBc1NVRkJhVU1zUzBGQlN5eERRVUZETEU5QlFVNHNRMEZCWXl4SlFVRmtMRU5CUVdwRE8yVkJRVUVzVlVGQlZTeERRVUZETEZWQlFWZ3NSMEZCZDBJc1MwRkJlRUk3TzBsQlNrc3NRMEZCVUR0SFFVUkdPMFZCVVVFc1RVRkJUeXhEUVVGQkxHRkJRVUVzUTBGQlVDeEhRVUYzUWp0RlFVVjRRaXhMUVVGQkxFZEJRVkVzWVVGQlFTeERRVUZqTEdGQlFXUXNSVUZCTmtJc1RVRkJUeXhEUVVGQkxHRkJRVUVzUTBGQmNFTTdPMEZCUlZJN096dEZRVWRCTEV0QlFVc3NRMEZCUXl4UlFVRk9MRU5CUVdVc1IwRkJaaXhGUVVGdlFpeFBRVUZ3UWl4RlFVRTJRaXhMUVVFM1FqczdRVUZGUVRzN08wVkJSMEVzUzBGQlN5eERRVUZETEZGQlFVNHNRMEZCWlN4TlFVRm1MRVZCUVhWQ0xFMUJRVThzUTBGQlFTeGhRVUZCTEVOQlFUbENMRVZCUVRoRExFdEJRVGxET3p0QlFVVkJPenM3UlVGSFFTeExRVUZMTEVOQlFVTXNVVUZCVGl4RFFVRmxMRTFCUVdZc1JVRkJkVUlzWVVGQmRrSXNSVUZCYzBNc1MwRkJkRU03UlVGRFFTeExRVUZMTEVOQlFVTXNVVUZCVGl4RFFVRmxMRmRCUVdZc1JVRkJORUlzVTBGQk5VSXNSVUZCZFVNc1MwRkJka003VTBGRFFUdEJRV2hLWVRzN08wRkJiVXBtT3pzN08wRkJSMEVzVFVGQlRTeERRVUZETEdOQlFWQXNRMEZCYzBJc1ZVRkJkRUlzUlVGQmEwTXNZVUZCYkVNc1JVRkRSVHRGUVVGQkxFdEJRVUVzUlVGQlR5eFpRVUZCTEVOQlFVRXNRMEZCVUR0RFFVUkdPenRCUVVkQkxFVkJRVVVzUTBGQlF5eFJRVUZJTEVOQlFWa3NVVUZCV2l4RlFVRnpRaXhWUVVGMFFqczdRVUZGUVN4WlFVRkJMRWRCUVdVN08wRkJRMllzU1VGQlJ5eFBRVUZQTEZGQlFWQXNTMEZCY1VJc1YwRkJlRUk3UlVGRFJTeFpRVUZCTEVkQlFXVXNVMEZFYWtJN096dEJRVWRCTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1ZVRkJXaXhGUVVGM1FpeFpRVUY0UWpzN1FVRkZRU3hGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEUxQlFWb3NSVUZCYjBJc1UwRkJRU3hIUVVGQkxFTkJRWEJDT3p0QlFVVkJMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SWpJQ01nVDBwY2NseHVkR2hwYzBkc2IySmhiQ0E5SUhKbGNYVnBjbVVnSnk0dloyeHZZbUZzSjF4eVhHNTFkR2xzVEdsaUlEMGdjbVZ4ZFdseVpTQW5hbkYxWlhKNUoxeHlYRzV1WVcxbFUzQmhZMlZPWVcxbElEMGdKMDlLSjF4eVhHNWNjbHh1SXlNalhISmNibUp2YjNRZ2MzUnlZWEFnYm1GdFpTQnRaWFJvYjJRZ2FXNTBieUJQWW1wbFkzUWdjSEp2ZEc5MGVYQmxYSEpjYmlNakkxeHlYRzVQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEdsbGN5QlBZbXBsWTNRNk9peGNjbHh1SUNCblpYUkpibk4wWVc1alpVNWhiV1U2WEhKY2JpQWdJQ0IyWVd4MVpUb2dMVDVjY2x4dUlDQWdJQ0FnWm5WdVkwNWhiV1ZTWldkbGVDQTlJQzltZFc1amRHbHZiaUFvTG5zeExIMHBYRndvTDF4eVhHNGdJQ0FnSUNCeVpYTjFiSFJ6SUQwZ0tHWjFibU5PWVcxbFVtVm5aWGdwTG1WNFpXTW9RR052Ym5OMGNuVmpkRzl5TG5SdlUzUnlhVzVuS0NrcFhISmNiaUFnSUNBZ0lDaHBaaUFvY21WemRXeDBjeUJoYm1RZ2NtVnpkV3gwY3k1c1pXNW5kR2dnUGlBeEtTQjBhR1Z1SUhKbGMzVnNkSE5iTVYwZ1pXeHpaU0FuSnlsY2NseHVYSEpjYmx4eVhHNGpJeU5jY2x4dVFXNGdhVzUwWlhKdVlXd2djbVZ3Y21WelpXNTBZWFJwYjI0Z2IyWWdkR2hsSUc1aGJXVnpjR0ZqWlNCMGNtVmxYSEpjYmlNakkxeHlYRzVPYzFSeVpXVWdQU0I3ZlZ4eVhHNXRZV3RsVkdobFNuVnBZMlVnUFNBdFBseHlYRzVjY2x4dUlDQWpJeU5jY2x4dUlDQkpiblJsY201aGJDQnVZVzFsVTNCaFkyVk9ZVzFsSUcxbGRHaHZaQ0IwYnlCamNtVmhkR1VnYm1WM0lDZHpkV0luSUc1aGJXVnpjR0ZqWlhNZ2IyNGdZWEppYVhSeVlYSjVJR05vYVd4a0lHOWlhbVZqZEhNdVhISmNiaUFnSXlNalhISmNiaUFnYldGclpVNWhiV1ZUY0dGalpTQTlJQ2h6Y0dGalpXNWhiV1VzSUhSeVpXVXBJQzArWEhKY2JpQWdJQ0FqSXlOY2NseHVJQ0FnSUZSb1pTQmtaWEpwZG1Wa0lHbHVjM1JoYm1ObElIUnZJR0psSUdOdmJuTjBjblZqZEdWa1hISmNiaUFnSUNBakl5TmNjbHh1SUNBZ0lFSmhjMlVnUFNBb2JuTk9ZVzFsS1NBdFBseHlYRzRnSUNBZ0lDQndjbTkwYnlBOUlIUm9hWE5jY2x4dUlDQWdJQ0FnZEhKbFpWdHVjMDVoYldWZElEMGdkSEpsWlZ0dWMwNWhiV1ZkSUc5eUlIdDlYSEpjYmlBZ0lDQWdJRzV6VkhKbFpTQTlJSFJ5WldWYmJuTk9ZVzFsWFZ4eVhHNGdJQ0FnSUNCdFpXMWlaWEp6SUQwZ2UzMWNjbHh1WEhKY2JpQWdJQ0FnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTQjBhR2x6TENBbmJXVnRZbVZ5Y3ljc0lIWmhiSFZsT2lCdFpXMWlaWEp6WEhKY2JseHlYRzRnSUNBZ0lDQWpJeU5jY2x4dUlDQWdJQ0FnVW1WbmFYTjBaWElnS0dVdVp5NGdKMHhwWm5RbktTQmhiaUJQWW1wbFkzUWdhVzUwYnlCMGFHVWdjSEp2ZEc5MGVYQmxJRzltSUhSb1pTQnVZVzFsYzNCaFkyVXVYSEpjYmlBZ0lDQWdJRlJvYVhNZ1QySnFaV04wSUhkcGJHd2dZbVVnY21WaFpHRmliR1V2WlhobFkzVjBZV0pzWlNCaWRYUWdhWE1nYjNSb1pYSjNhWE5sSUdsdGJYVjBZV0pzWlM1Y2NseHVJQ0FnSUNBZ0l5TWpYSEpjYmlBZ0lDQWdJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNCMGFHbHpMQ0FuY21WbmFYTjBaWEluTEZ4eVhHNGdJQ0FnSUNBZ0lIWmhiSFZsT2lBb2JtRnRaU3dnYjJKcUxDQmxiblZ0WlhKaFlteGxLU0F0UGx4eVhHNGdJQ0FnSUNBZ0lDQWdKM1Z6WlNCemRISnBZM1FuWEhKY2JpQWdJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0owTmhibTV2ZENCc2FXWjBJR0VnYm1WM0lIQnliM0JsY25SNUlIZHBkR2h2ZFhRZ1lTQjJZV3hwWkNCdVlXMWxMaWNwSUNCcFppQW9kSGx3Wlc5bUlHNWhiV1VnYVhOdWRDQW5jM1J5YVc1bkp5a2diM0lnYm1GdFpTQnBjeUFuSjF4eVhHNGdJQ0FnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZERZVzV1YjNRZ2JHbG1kQ0JoSUc1bGR5QndjbTl3WlhKMGVTQjNhWFJvYjNWMElHRWdkbUZzYVdRZ2NISnZjR1Z5ZEhrZ2FXNXpkR0Z1WTJVdUp5a2dJSFZ1YkdWemN5QnZZbXBjY2x4dUlDQWdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnblVISnZjR1Z5ZEhrZ2JtRnRaV1FnSnlBcklHNWhiV1VnS3lBbklHbHpJR0ZzY21WaFpIa2daR1ZtYVc1bFpDQnZiaUFuSUNzZ2MzQmhZMlZ1WVcxbElDc2dKeTRuS1NBZ2FXWWdjSEp2ZEc5YmJtRnRaVjFjY2x4dVhISmNiaUFnSUNBZ0lDQWdJQ0J0WlcxaVpYSnpXMjVoYldWZElEMGdiV1Z0WW1WeWMxdHVZVzFsWFNCdmNpQnVZVzFsWEhKY2JseHlYRzRnSUNBZ0lDQWdJQ0FnSTBkMVlYSmtJR0ZuWVdsdWMzUWdiMkpzYVhSbGNtRjBhVzVuSUhSb1pTQjBjbVZsSUdGeklIUm9aU0IwY21WbElHbHpJSEpsWTNWeWMybDJaV3g1SUdWNGRHVnVaR1ZrWEhKY2JpQWdJQ0FnSUNBZ0lDQnVjMVJ5WldWYmJtRnRaVjBnUFNCdWMxUnlaV1ZiYm1GdFpWMGdiM0pjY2x4dUlDQWdJQ0FnSUNBZ0lDQWdibUZ0WlRvZ2JtRnRaVnh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjBlWEJsT2lCMGVYQmxiMllnYjJKcVhISmNiaUFnSUNBZ0lDQWdJQ0FnSUdsdWMzUmhibU5sT2lBb2FXWWdiMkpxTG1kbGRFbHVjM1JoYm1ObFRtRnRaU0IwYUdWdUlHOWlhaTVuWlhSSmJuTjBZVzVqWlU1aGJXVW9LU0JsYkhObElDZDFibXR1YjNkdUp5bGNjbHh1WEhKY2JpQWdJQ0FnSUNBZ0lDQlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtnY0hKdmRHOHNJRzVoYldVc1hISmNiaUFnSUNBZ0lDQWdJQ0FnSUhaaGJIVmxPaUJ2WW1wY2NseHVJQ0FnSUNBZ0lDQWdJQ0FnWlc1MWJXVnlZV0pzWlRvZ1ptRnNjMlVnYVhOdWRDQmxiblZ0WlhKaFlteGxYSEpjYmx4eVhHNGdJQ0FnSUNBZ0lDQWdibk5KYm5SbGNtNWhiQzVoYkdWeWRFUmxjR1Z1WkdWdWRITWdibk5PWVcxbElDc2dKeTRuSUNzZ2MzQmhZMlZ1WVcxbElDc2dKeTRuSUNzZ2JtRnRaVnh5WEc0Z0lDQWdJQ0FnSUNBZ2IySnFYSEpjYmx4eVhHNWNjbHh1SUNBZ0lDQWdJeU1qWEhKY2JpQWdJQ0FnSUVOeVpXRjBaU0JoSUc1bGR5d2djM1JoZEdsaklHNWhiV1Z6Y0dGalpTQnZiaUIwYUdVZ1kzVnljbVZ1ZENCd1lYSmxiblFnS0dVdVp5NGdibk5PWVcxbExuUnZMaTR1SUh4OElHNXpUbUZ0WlM1cGN5NHVMaWxjY2x4dUlDQWdJQ0FnSXlNalhISmNiaUFnSUNBZ0lIQnliM1J2TG5KbFoybHpkR1Z5SUNkdFlXdGxVM1ZpVG1GdFpWTndZV05sSnl3Z0tDaHpkV0pPWVcxbFUzQmhZMlVwSUMwK1hISmNiaUFnSUNBZ0lDQWdKM1Z6WlNCemRISnBZM1FuWEhKY2JpQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkRFlXNXViM1FnWTNKbFlYUmxJR0VnYm1WM0lITjFZaUJ1WVcxbGMzQmhZMlVnZDJsMGFHOTFkQ0JoSUhaaGJHbGtJRzVoYldVdUp5a2dJR2xtSUNoMGVYQmxiMllnYzNWaVRtRnRaVk53WVdObElHbHpiblFnSjNOMGNtbHVaeWNwSUc5eUlITjFZazVoYldWVGNHRmpaU0JwY3lBbkoxeHlYRzRnSUNBZ0lDQWdJSFJvY205M0lHNWxkeUJGY25KdmNpZ25VM1ZpSUc1aGJXVnpjR0ZqWlNCdVlXMWxaQ0FuSUNzZ2MzVmlUbUZ0WlZOd1lXTmxJQ3NnSnlCcGN5QmhiSEpsWVdSNUlHUmxabWx1WldRZ2IyNGdKeUFySUhOd1lXTmxibUZ0WlNBcklDY3VKeWtnSUdsbUlIQnliM1J2TG5OMVlrNWhiV1ZUY0dGalpWeHlYRzRnSUNBZ0lDQWdJRzV6U1c1MFpYSnVZV3d1WVd4bGNuUkVaWEJsYm1SbGJuUnpJRzV6VG1GdFpTQXJJQ2N1SnlBcklITjFZazVoYldWVGNHRmpaVnh5WEc0Z0lDQWdJQ0FnSUc1bGQwNWhiV1ZUY0dGalpTQTlJRzFoYTJWT1lXMWxVM0JoWTJVb2MzVmlUbUZ0WlZOd1lXTmxMQ0J1YzFSeVpXVXBYSEpjYmlBZ0lDQWdJQ0FnYm1WM1RtRnRaVk53WVdObExuSmxaMmx6ZEdWeUlDZGpiMjV6ZEdGdWRITW5MQ0J0WVd0bFRtRnRaVk53WVdObEtDZGpiMjV6ZEdGdWRITW5MQ0J1YzFSeVpXVXBMQ0JtWVd4elpTQWdhV1lnYzNWaVRtRnRaVk53WVdObElHbHpiblFnSjJOdmJuTjBZVzUwY3lkY2NseHVJQ0FnSUNBZ0lDQndjbTkwYnk1eVpXZHBjM1JsY2lCemRXSk9ZVzFsVTNCaFkyVXNJRzVsZDA1aGJXVlRjR0ZqWlN3Z1ptRnNjMlZjY2x4dUlDQWdJQ0FnSUNCdVpYZE9ZVzFsVTNCaFkyVmNjbHh1SUNBZ0lDQWdLU3dnWm1Gc2MyVmNjbHh1SUNBZ0lDQWdjbVYwZFhKdVhISmNibHh5WEc0Z0lDQWdJeU1qWEhKY2JpQWdJQ0JCYmlCcGJuUmxjbTVoYkNCdFpXTm9ZVzVwYzIwZ2RHOGdjbVZ3Y21WelpXNTBJSFJvWlNCcGJuTjBZVzVqWlNCdlppQjBhR2x6SUc1aGJXVnpjR0ZqWlZ4eVhHNGdJQ0FnUUdOdmJuTjBjblZqZEc5eVhISmNiaUFnSUNCQWFXNTBaWEp1WVd4Y2NseHVJQ0FnSUVCdFpXMWlaWEpQWmlCdFlXdGxUbUZ0WlZOd1lXTmxYSEpjYmlBZ0lDQWpJeU5jY2x4dUlDQWdJRU5zWVhOeklEMGdibVYzSUVaMWJtTjBhVzl1S0NkeVpYUjFjbTRnWm5WdVkzUnBiMjRnSnlBcklITndZV05sYm1GdFpTQXJJQ2NvS1h0OUp5a29LVnh5WEc0Z0lDQWdRMnhoYzNNNk9pQTlJRzVsZHlCQ1lYTmxLSE53WVdObGJtRnRaU2xjY2x4dVhISmNiaUFnSUNBalEyeGhjM011Y0hKdmRHOTBlWEJsTG5CaGNtVnVkQ0E5SUVKaGMyVXVjSEp2ZEc5MGVYQmxPMXh5WEc0Z0lDQWdibVYzSUVOc1lYTnpLSE53WVdObGJtRnRaU2xjY2x4dVhISmNiaUFnSXlNalhISmNiaUFnSjBSbGNHVnVaQ2NnWVc0Z1QySnFaV04wSUhWd2IyNGdZVzV2ZEdobGNpQnRaVzFpWlhJZ2IyWWdkR2hwY3lCdVlXMWxjM0JoWTJVc0lIVndiMjRnWVc1dmRHaGxjaUJ1WVcxbGMzQmhZMlVzWEhKY2JpQWdiM0lnZFhCdmJpQmhJRzFsYldKbGNpQnZaaUJoYm05MGFHVnlJRzVoYldWemNHRmpaVnh5WEc0Z0lDTWpJMXh5WEc0Z0lHUmxjR1Z1WkhOUGJpQTlJQ2hrWlhCbGJtUmxibU5wWlhNc0lHTmhiR3hDWVdOckxDQnBiWEJ2Y25SektTQXRQbHh5WEc0Z0lDQWdKM1Z6WlNCemRISnBZM1FuWEhKY2JpQWdJQ0J5WlhRZ1BTQm1ZV3h6WlZ4eVhHNGdJQ0FnYm5OTlpXMWlaWEp6SUQwZ2JuTkpiblJsY201aGJDNW5aWFJPYzAxbGJXSmxjbk1vS1Z4eVhHNGdJQ0FnYVdZZ1pHVndaVzVrWlc1amFXVnpJR0Z1WkNCa1pYQmxibVJsYm1OcFpYTXViR1Z1WjNSb0lENGdNQ0JoYm1RZ1kyRnNiRUpoWTJ0Y2NseHVJQ0FnSUNBZ2JXbHpjMmx1WnlBOUlHUmxjR1Z1WkdWdVkybGxjeTVtYVd4MFpYSW9LR1JsY0dWdUtTQXRQbHh5WEc0Z0lDQWdJQ0FnSUc1elRXVnRZbVZ5Y3k1cGJtUmxlRTltS0dSbGNHVnVLU0JwY3lBdE1TQmhibVFnS0c1dmRDQnBiWEJ2Y25SeklHOXlJR2x0Y0c5eWRITWdhWE51ZENCa1pYQmxiaWxjY2x4dUlDQWdJQ0FnS1Z4eVhHNGdJQ0FnSUNCcFppQnRhWE56YVc1bkxteGxibWQwYUNCcGN5QXdYSEpjYmlBZ0lDQWdJQ0FnY21WMElEMGdkSEoxWlZ4eVhHNGdJQ0FnSUNBZ0lHTmhiR3hDWVdOcktDbGNjbHh1SUNBZ0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNBZ0lHNXpTVzUwWlhKdVlXd3VaR1Z3Wlc1a1pXNTBjeTV3ZFhOb0lDaHBiWEJ2Y25SektTQXRQbHh5WEc0Z0lDQWdJQ0FnSUNBZ1pHVndaVzVrYzA5dUlHMXBjM05wYm1jc0lHTmhiR3hDWVdOckxDQnBiWEJ2Y25SelhISmNibHh5WEc0Z0lDQWdjbVYwWEhKY2JpQWdibk5KYm5SbGNtNWhiQ0E5SUdSbGNHVnVaR1Z1ZEhNNklGdGRYSEpjYmx4eVhHNGdJQ01qSTF4eVhHNGdJRVpsZEdOb1pYTWdkR2hsSUhKbFoybHpkR1Z5WldRZ2NISnZjR1Z5ZEdsbGN5QmhibVFnYldWMGFHOWtjeUJ2YmlCMGFHVWdibUZ0WlhOd1lXTmxJR0Z1WkNCcGRITWdZMmhwYkdRZ2JtRnRaWE53WVdObGMxeHlYRzRnSUNNakkxeHlYRzRnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTQnVjMGx1ZEdWeWJtRnNMQ0FuWjJWMFRuTk5aVzFpWlhKekp5eGNjbHh1SUNBZ0lIWmhiSFZsT2lBdFBseHlYRzRnSUNBZ0lDQnlaV04xY25ObFZISmxaU0E5SUNoclpYa3NJR3hoYzNSTFpYa3BJQzArWEhKY2JpQWdJQ0FnSUNBZ2JXVnRZbVZ5Y3k1d2RYTm9JR3hoYzNSTFpYa2dLeUFuTGljZ0t5QnJaWGtnSUdsbUlIUjVjR1Z2WmlBb2EyVjVLU0JwY3lBbmMzUnlhVzVuSjF4eVhHNGdJQ0FnSUNBZ0lHbG1JSFYwYVd4TWFXSXVhWE5RYkdGcGJrOWlhbVZqZENoclpYa3BYSEpjYmlBZ0lDQWdJQ0FnSUNCUFltcGxZM1F1YTJWNWN5aHJaWGtwTG1admNrVmhZMmdnS0dzcElDMCtYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lHMWxiV0psY25NdWNIVnphQ0JzWVhOMFMyVjVJQ3NnSnk0bklDc2dheUFnYVdZZ2RIbHdaVzltSUNocktTQnBjeUFuYzNSeWFXNW5KMXh5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaV04xY25ObFZISmxaU0JyWlhsYmExMHNJR3hoYzNSTFpYa2dLeUFuTGljZ0t5QnJJQ0JwWmlCMWRHbHNUR2xpTG1selVHeGhhVzVQWW1wbFkzUW9hMlY1VzJ0ZEtWeHlYRzRnSUNBZ0lDQWdJQ0FnSUNCeVpYUjFjbTVjY2x4dVhISmNiaUFnSUNBZ0lDQWdjbVYwZFhKdVhISmNiaUFnSUNBZ0lHMWxiV0psY25NZ1BTQmJYVnh5WEc0Z0lDQWdJQ0JQWW1wbFkzUXVhMlY1Y3loT2MxUnlaV1ZiYm1GdFpWTndZV05sVG1GdFpWMHBMbVp2Y2tWaFkyZ2dLR3RsZVNrZ0xUNWNjbHh1SUNBZ0lDQWdJQ0J5WldOMWNuTmxWSEpsWlNCT2MxUnlaV1ZiYm1GdFpWTndZV05sVG1GdFpWMWJhMlY1WFN3Z2JtRnRaVk53WVdObFRtRnRaU0FnYVdZZ2RYUnBiRXhwWWk1cGMxQnNZV2x1VDJKcVpXTjBLRTV6VkhKbFpWdHVZVzFsVTNCaFkyVk9ZVzFsWFZ0clpYbGRLVnh5WEc0Z0lDQWdJQ0FnSUhKbGRIVnlibHh5WEc1Y2NseHVJQ0FnSUNBZ2JXVnRZbVZ5YzF4eVhHNWNjbHh1SUNBakl5TmNjbHh1SUNCVWJ5QnpkWEJ3YjNKMElHUmxjR1Z1WkdWdVkza2diV0Z1WVdkbGJXVnVkQ3dnZDJobGJpQmhJSEJ5YjNCbGNuUjVJR2x6SUd4cFpuUmxaQ0J2Ym5SdklIUm9aU0J1WVcxbGMzQmhZMlVzSUc1dmRHbG1lU0JrWlhCbGJtUmxiblJ6SUhSdklHbHVhWFJwWVd4cGVtVmNjbHh1SUNBakl5TmNjbHh1SUNCUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa2dibk5KYm5SbGNtNWhiQ3dnSjJGc1pYSjBSR1Z3Wlc1a1pXNTBjeWNzWEhKY2JpQWdJQ0IyWVd4MVpUb2dLR2x0Y0c5eWRITXBJQzArWEhKY2JpQWdJQ0FnSUdSbGNITWdQU0J1YzBsdWRHVnlibUZzTG1SbGNHVnVaR1Z1ZEhNdVptbHNkR1Z5S0Noa1pYQlBiaWtnTFQ1Y2NseHVJQ0FnSUNBZ0lDQm1ZV3h6WlNCcGN5QmtaWEJQYmlocGJYQnZjblJ6S1Z4eVhHNGdJQ0FnSUNBcFhISmNiaUFnSUNBZ0lHNXpTVzUwWlhKdVlXd3VaR1Z3Wlc1a1pXNTBjeUE5SUdSbGNITWdJR2xtSUVGeWNtRjVMbWx6UVhKeVlYa29aR1Z3Y3lsY2NseHVYSEpjYmlBZ0kwTnlaV0YwWlNCMGFHVWdjbTl2ZENCdlppQjBhR1VnZEhKbFpTQmhjeUIwYUdVZ1kzVnljbVZ1ZENCdVlXMWxjM0JoWTJWY2NseHVJQ0JPYzFSeVpXVmJibUZ0WlZOd1lXTmxUbUZ0WlYwZ1BTQjdmVnh5WEc0Z0lDTkVaV1pwYm1VZ2RHaGxJR052Y21VZ2JtRnRaWE53WVdObElHRnVaQ0IwYUdVZ2NtVjBkWEp1SUc5bUlIUm9hWE1nWTJ4aGMzTmNjbHh1SUNCT2MwOTFkQ0E5SUcxaGEyVk9ZVzFsVTNCaFkyVW9ibUZ0WlZOd1lXTmxUbUZ0WlN3Z1RuTlVjbVZsVzI1aGJXVlRjR0ZqWlU1aGJXVmRLVnh5WEc1Y2NseHVJQ0FqSXlOY2NseHVJQ0JEWVdOb1pTQmhJR2hoYm1Sc1pTQnZiaUIwYUdVZ2RtVnVaRzl5SUNod2NtOWlZV0pzZVNCcVVYVmxjbmtwSUc5dUlIUm9aU0J5YjI5MElHNWhiV1Z6Y0dGalpWeHlYRzRnSUNNakkxeHlYRzRnSUU1elQzVjBMbkpsWjJsemRHVnlJQ2MvSnl3Z2RYUnBiRXhwWWl3Z1ptRnNjMlZjY2x4dVhISmNiaUFnSXlNalhISmNiaUFnUTJGamFHVWdkR2hsSUhSeVpXVWdLSFZ6WldaMWJDQm1iM0lnWkc5amRXMWxiblJoZEdsdmJpOTJhWE4xWVd4cGVtRjBhVzl1TDJSbFluVm5aMmx1WnlsY2NseHVJQ0FqSXlOY2NseHVJQ0JPYzA5MWRDNXlaV2RwYzNSbGNpQW5kSEpsWlNjc0lFNXpWSEpsWlZ0dVlXMWxVM0JoWTJWT1lXMWxYU3dnWm1Gc2MyVmNjbHh1WEhKY2JpQWdJeU1qWEhKY2JpQWdRMkZqYUdVZ2RHaGxJRzVoYldVZ2MzQmhZMlVnYm1GdFpWeHlYRzRnSUNNakkxeHlYRzRnSUU1elQzVjBMbkpsWjJsemRHVnlJQ2R1WVcxbEp5d2dibUZ0WlZOd1lXTmxUbUZ0WlN3Z1ptRnNjMlZjY2x4dUlDQk9jMDkxZEM1eVpXZHBjM1JsY2lBblpHVndaVzVrYzA5dUp5d2daR1Z3Wlc1a2MwOXVMQ0JtWVd4elpWeHlYRzRnSUU1elQzVjBYSEpjYmx4eVhHNWNjbHh1SXlNalhISmNia0ZqZEhWaGJHeDVJR1JsWm1sdVpTQjBhR1VnVDBvZ1RtRnRaVk53WVdObFhISmNiaU1qSTF4eVhHNVBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtnZEdocGMwZHNiMkpoYkN3Z2JtRnRaVk53WVdObFRtRnRaU3hjY2x4dUlDQjJZV3gxWlRvZ2JXRnJaVlJvWlVwMWFXTmxLQ2xjY2x4dVhISmNiazlLTG5KbFoybHpkR1Z5SUNkbmJHOWlZV3duTENCMGFHbHpSMnh2WW1Gc1hISmNibHh5WEc1MGFHbHpSRzlqZFcxbGJuUWdQU0I3ZlZ4eVhHNXBaaUIwZVhCbGIyWWdaRzlqZFcxbGJuUWdhWE51ZENBbmRXNWtaV1pwYm1Wa0oxeHlYRzRnSUhSb2FYTkViMk4xYldWdWRDQTlJR1J2WTNWdFpXNTBYSEpjYmx4eVhHNVBTaTV5WldkcGMzUmxjaUFuWkc5amRXMWxiblFuTENCMGFHbHpSRzlqZFcxbGJuUmNjbHh1WEhKY2JrOUtMbkpsWjJsemRHVnlJQ2R1YjI5d0p5d2dMVDVjY2x4dVhISmNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdUMG9pWFgwPSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBPSiwgXywgc3ViTmFtZVNwYWNlcztcblxuT0ogPSByZXF1aXJlKCcuL29qJyk7XG5cbl8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG5cbnN1Yk5hbWVTcGFjZXMgPSBbJ2Vycm9ycycsICdlbnVtcycsICdpbnN0YW5jZU9mJywgJ25vZGVzJywgJ2RiJywgJ2NvbXBvbmVudHMnLCAnY29udHJvbHMnLCAnaW5wdXRzJywgJ25vdGlmaWNhdGlvbnMnLCAnaGlzdG9yeScsICdjb29raWUnLCAnYXN5bmMnXTtcblxuXy5lYWNoKHN1Yk5hbWVTcGFjZXMsIGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIE9KLm1ha2VTdWJOYW1lU3BhY2UobmFtZSk7XG59KTtcblxuT0pbJ0dFTkVSQVRFX1VOSVFVRV9JRFMnXSA9IGZhbHNlO1xuXG5PSlsnREVGQVVMVF9DT01QT05FTlRfUk9PVF9OT0RFVFlQRSddID0gJ2Rpdic7XG5cbk9KWydUUkFDS19PTl9FUlJPUiddID0gZmFsc2U7XG5cbk9KWydMT0dfQUxMX0FKQVgnXSA9IGZhbHNlO1xuXG5PSlsnTE9HX0FMTF9BSkFYX0VSUk9SUyddID0gZmFsc2U7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4dmFrbHVhWFF1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZGUVN4SlFVRkJPenRCUVVGQkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUVUZCVWpzN1FVRkRUQ3hEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCU1Vvc1lVRkJRU3hIUVVGblFpeERRVU5rTEZGQlJHTXNSVUZGWkN4UFFVWmpMRVZCUjJRc1dVRklZeXhGUVVsa0xFOUJTbU1zUlVGTFpDeEpRVXhqTEVWQlRXUXNXVUZPWXl4RlFVOWtMRlZCVUdNc1JVRlJaQ3hSUVZKakxFVkJVMlFzWlVGVVl5eEZRVlZrTEZOQlZtTXNSVUZYWkN4UlFWaGpMRVZCV1dRc1QwRmFZenM3UVVGdFFtaENMRU5CUVVNc1EwRkJReXhKUVVGR0xFTkJRVThzWVVGQlVDeEZRVUZ6UWl4VFFVRkRMRWxCUVVRN1UwRkRjRUlzUlVGQlJTeERRVUZETEdkQ1FVRklMRU5CUVc5Q0xFbEJRWEJDTzBGQlJHOUNMRU5CUVhSQ096dEJRVTFCTEVWQlFVY3NRMEZCUVN4eFFrRkJRU3hEUVVGSUxFZEJRVFJDT3p0QlFVVTFRaXhGUVVGSExFTkJRVUVzYVVOQlFVRXNRMEZCU0N4SFFVRjNRenM3UVVGRmVFTXNSVUZCUnl4RFFVRkJMR2RDUVVGQkxFTkJRVWdzUjBGQmRVSTdPMEZCUlhaQ0xFVkJRVWNzUTBGQlFTeGpRVUZCTEVOQlFVZ3NSMEZCY1VJN08wRkJSWEpDTEVWQlFVY3NRMEZCUVN4eFFrRkJRU3hEUVVGSUxFZEJRVFJDSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SWdJeUFqSUU5S0lGQnZjM1F0U1c1cGRHbGhiR2w2WVhScGIyNWNjbHh1WEhKY2JrOUtJRDBnY21WeGRXbHlaU0FuTGk5dmFpZGNjbHh1WHlBOUlISmxjWFZwY21VZ0oyeHZaR0Z6YUNkY2NseHVYSEpjYmlNZ1UybHRjR3hsSUdGeWNtRjVJRzltSUdGdWRHbGphWEJoZEdWa0wydHViM2R1SUdOb2FXeGtJRzVoYldWemNHRmpaWE5jY2x4dUlDQmNjbHh1YzNWaVRtRnRaVk53WVdObGN5QTlJRnRjY2x4dUlDQW5aWEp5YjNKekoxeHlYRzRnSUNkbGJuVnRjeWRjY2x4dUlDQW5hVzV6ZEdGdVkyVlBaaWRjY2x4dUlDQW5ibTlrWlhNblhISmNiaUFnSjJSaUoxeHlYRzRnSUNkamIyMXdiMjVsYm5SekoxeHlYRzRnSUNkamIyNTBjbTlzY3lkY2NseHVJQ0FuYVc1d2RYUnpKMXh5WEc0Z0lDZHViM1JwWm1sallYUnBiMjV6SjF4eVhHNGdJQ2RvYVhOMGIzSjVKMXh5WEc0Z0lDZGpiMjlyYVdVblhISmNiaUFnSjJGemVXNWpKMXh5WEc1ZFhISmNibHh5WEc0aklDTWpJRk4xWWs1aGJXVlRjR0ZqWlhOY2NseHVYSEpjYmlNZ1VISmxMV0ZzYkc5allYUmxJR05sY25SaGFXNGdZMjl0Ylc5dUlHNWhiV1Z6Y0dGalpYTWdkRzhnWVhadmFXUWdablYwZFhKbElISmhZMlVnWTI5dVpHbDBhVzl1Y3k1Y2NseHVJeUJVYUdseklHUnZaWE1nY21WeGRXbHlaU0IwYUdGMElIUm9aU0J2Y21SbGNpQnZaaUJ2Y0dWeVlYUnBiMjV6SUd4dllXUnpJRTlLTG1OdlptWmxaU0JtYVhKemRDQmhibVFnYjBwSmJtbDBMbU52Wm1abFpTQnpaV052Ym1SY2NseHVYeTVsWVdOb0lITjFZazVoYldWVGNHRmpaWE1zSUNodVlXMWxLU0F0UGx4eVhHNGdJRTlLTG0xaGEyVlRkV0pPWVcxbFUzQmhZMlVnYm1GdFpWeHlYRzRnSUZ4eVhHNGpJQ01qSUVOdmJtWnBaM1Z5WVhScGIyNGdkbUZ5YVdGaWJHVnpYSEpjYmx4eVhHNGpJRUYxZEc5dFlYUnBZMkZzYkhrZ1oyVnVaWEpoZEdVZ2RXNXBjWFZsSUVsRWN5Qm1iM0lnWldGamFDQnViMlJsSUNoa1pXWmhkV3gwSUdaaGJITmxLVnh5WEc1UFNsc25SMFZPUlZKQlZFVmZWVTVKVVZWRlgwbEVVeWRkSUQwZ1ptRnNjMlZjY2x4dUl5QkVaV1poZFd4MElISnZiM1FnYm05a1pTQm1iM0lnWTI5dGNHOXVaVzUwY3k5amIyNTBjbTlzY3lBb1pHVm1ZWFZzZENBblpHbDJKeWxjY2x4dVQwcGJKMFJGUmtGVlRGUmZRMDlOVUU5T1JVNVVYMUpQVDFSZlRrOUVSVlJaVUVVblhTQTlJQ2RrYVhZblhISmNiaU1nVjJobGRHaGxjaUIwYnlCb2IyOXJJR2x1ZEc4Z2RHaGxJR2RzYjJKaGJDQnZiaUJsY25KdmNpQmxkbVZ1ZENCMGJ5QjNjbWwwWlNCbGNuSnZjbk1nZEc4Z1kyOXVjMjlzWlNBb1pHVm1ZWFZzZENCbVlXeHpaU2xjY2x4dVQwcGJKMVJTUVVOTFgwOU9YMFZTVWs5U0oxMGdQU0JtWVd4elpWeHlYRzRqVjJobGRHaGxjaUIwYnlCc2IyY2dZV3hzSUVGS1FWZ2djbVZ4ZFdWemRITmNjbHh1VDBwYkoweFBSMTlCVEV4ZlFVcEJXQ2RkSUQwZ1ptRnNjMlZjY2x4dUkxZG9aWFJvWlhJZ2RHOGdiRzluSUdGc2JDQkJTa0ZZSUdWeWNtOXljMXh5WEc1UFNsc25URTlIWDBGTVRGOUJTa0ZZWDBWU1VrOVNVeWRkSUQwZ1ptRnNjMlVpWFgwPSIsIlxyXG4jIyNcclxuUmV0dXJuIGp1c3QgdGhlIGtleXMgZnJvbSB0aGUgaW5wdXQgYXJyYXksIG9wdGlvbmFsbHkgb25seSBmb3IgdGhlIHNwZWNpZmllZCBzZWFyY2hfdmFsdWVcclxudmVyc2lvbjogMTEwOS4yMDE1XHJcbmRpc2N1c3MgYXQ6IGh0dHA6Ly9waHBqcy5vcmcvZnVuY3Rpb25zL2FycmF5X2tleXNcclxuKyAgIG9yaWdpbmFsIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va2V2aW4udmFuem9ubmV2ZWxkLm5ldClcclxuKyAgICAgIGlucHV0IGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxyXG4rICAgYnVnZml4ZWQgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0KVxyXG4rICAgaW1wcm92ZWQgYnk6IGpkXHJcbisgICBpbXByb3ZlZCBieTogQnJldHQgWmFtaXIgKGh0dHA6Ly9icmV0dC16YW1pci5tZSlcclxuKyAgIGlucHV0IGJ5OiBQXHJcbisgICBidWdmaXhlZCBieTogQnJldHQgWmFtaXIgKGh0dHA6Ly9icmV0dC16YW1pci5tZSlcclxuZXhhbXBsZSAxOiBhcnJheV9rZXlzKCB7Zmlyc3RuYW1lOiAnS2V2aW4nLCBzdXJuYW1lOiAndmFuIFpvbm5ldmVsZCd9ICk7XHJcbnJldHVybnMgMTogezA6ICdmaXJzdG5hbWUnLCAxOiAnc3VybmFtZSd9XHJcbiMjI1xyXG5hcnJheV9rZXlzID0gKGlucHV0LCBzZWFyY2hfdmFsdWUsIGFyZ1N0cmljdCkgLT5cclxuICBzZWFyY2ggPSB0eXBlb2Ygc2VhcmNoX3ZhbHVlIGlzbnQgXCJ1bmRlZmluZWRcIlxyXG4gIHRtcF9hcnIgPSBbXVxyXG4gIHN0cmljdCA9ICEhYXJnU3RyaWN0XHJcbiAgaW5jbHVkZSA9IHRydWVcclxuICBrZXkgPSBcIlwiXHJcbiAgIyBEdWNrLXR5cGUgY2hlY2sgZm9yIG91ciBvd24gYXJyYXkoKS1jcmVhdGVkIFBIUEpTX0FycmF5XHJcbiAgcmV0dXJuIGlucHV0LmtleXMoc2VhcmNoX3ZhbHVlLCBhcmdTdHJpY3QpICBpZiBpbnB1dCBhbmQgdHlwZW9mIGlucHV0IGlzIFwib2JqZWN0XCIgYW5kIGlucHV0LmNoYW5nZV9rZXlfY2FzZVxyXG4gIGZvciBrZXkgb2YgaW5wdXRcclxuICAgIGlmIGlucHV0Lmhhc093blByb3BlcnR5KGtleSlcclxuICAgICAgaW5jbHVkZSA9IHRydWVcclxuICAgICAgaWYgc2VhcmNoXHJcbiAgICAgICAgaWYgc3RyaWN0IGFuZCBpbnB1dFtrZXldIGlzbnQgc2VhcmNoX3ZhbHVlXHJcbiAgICAgICAgICBpbmNsdWRlID0gZmFsc2VcclxuICAgICAgICBlbHNlIGluY2x1ZGUgPSBmYWxzZSAgdW5sZXNzIGlucHV0W2tleV0gaXMgc2VhcmNoX3ZhbHVlXHJcbiAgICAgIHRtcF9hcnJbdG1wX2Fyci5sZW5ndGhdID0ga2V5ICBpZiBpbmNsdWRlXHJcbiAgdG1wX2FyclxyXG5cclxuIyMjKlxyXG5Db252ZXJ0IGEgSmF2YXNjcmlwdCBPamVjdCBhcnJheSBvciBTdHJpbmcgYXJyYXkgdG8gYW4gSFRNTCB0YWJsZVxyXG5KU09OIHBhcnNpbmcgaGFzIHRvIGJlIG1hZGUgYmVmb3JlIGZ1bmN0aW9uIGNhbGxcclxuSXQgYWxsb3dzIHVzZSBvZiBvdGhlciBKU09OIHBhcnNpbmcgbWV0aG9kcyBsaWtlIGpRdWVyeS5wYXJzZUpTT05cclxuaHR0cChzKTovLywgZnRwOi8vLCBmaWxlOi8vIGFuZCBqYXZhc2NyaXB0OjsgbGlua3MgYXJlIGF1dG9tYXRpY2FsbHkgY29tcHV0ZWRcclxuXHJcbkpTT04gZGF0YSBzYW1wbGVzIHRoYXQgc2hvdWxkIGJlIHBhcnNlZCBhbmQgdGhlbiBjYW4gYmUgY29udmVydGVkIHRvIGFuIEhUTUwgdGFibGVcclxudmFyIG9iamVjdEFycmF5ID0gJ1t7XCJUb3RhbFwiOlwiMzRcIixcIlZlcnNpb25cIjpcIjEuMC40XCIsXCJPZmZpY2VcIjpcIk5ldyBZb3JrXCJ9LHtcIlRvdGFsXCI6XCI2N1wiLFwiVmVyc2lvblwiOlwiMS4xLjBcIixcIk9mZmljZVwiOlwiUGFyaXNcIn1dJztcclxudmFyIHN0cmluZ0FycmF5ID0gJ1tcIk5ldyBZb3JrXCIsXCJCZXJsaW5cIixcIlBhcmlzXCIsXCJNYXJyYWtlY2hcIixcIk1vc2Nvd1wiXSc7XHJcbnZhciBuZXN0ZWRUYWJsZSA9ICdbeyBrZXkxOiBcInZhbDFcIiwga2V5MjogXCJ2YWwyXCIsIGtleTM6IHsgdGFibGVJZDogXCJ0YmxJZE5lc3RlZDFcIiwgdGFibGVDbGFzc05hbWU6IFwiY2xzTmVzdGVkXCIsIGxpbmtUZXh0OiBcIkRvd25sb2FkXCIsIGRhdGE6IFt7IHN1YmtleTE6IFwic3VidmFsMVwiLCBzdWJrZXkyOiBcInN1YnZhbDJcIiwgc3Via2V5MzogXCJzdWJ2YWwzXCIgfV0gfSB9XSc7XHJcblxyXG5Db2RlIHNhbXBsZSB0byBjcmVhdGUgYSBIVE1MIHRhYmxlIEphdmFzY3JpcHQgU3RyaW5nXHJcbnZhciBqc29uSHRtbFRhYmxlID0gQ29udmVydEpzb25Ub1RhYmxlKGV2YWwoZGF0YVN0cmluZyksICdqc29uVGFibGUnLCBudWxsLCAnRG93bmxvYWQnKTtcclxuXHJcbkNvZGUgc2FtcGxlIGV4cGxhbmVkXHJcbi0gZXZhbCBpcyB1c2VkIHRvIHBhcnNlIGEgSlNPTiBkYXRhU3RyaW5nXHJcbi0gdGFibGUgSFRNTCBpZCBhdHRyaWJ1dGUgd2lsbCBiZSAnanNvblRhYmxlJ1xyXG4tIHRhYmxlIEhUTUwgY2xhc3MgYXR0cmlidXRlIHdpbGwgbm90IGJlIGFkZGVkXHJcbi0gJ0Rvd25sb2FkJyB0ZXh0IHdpbGwgYmUgZGlzcGxheWVkIGluc3RlYWQgb2YgdGhlIGxpbmsgaXRzZWxmXHJcblxyXG5AYXV0aG9yIEFmc2hpbiBNZWhyYWJhbmkgPGFmc2hpbiBkb3QgbWVoIGF0IGdtYWlsIGRvdCBjb20+XHJcblxyXG5AY2xhc3MgQ29udmVydEpzb25Ub1RhYmxlXHJcblxyXG5AbWV0aG9kIENvbnZlcnRKc29uVG9UYWJsZVxyXG5cclxuQHBhcmFtIHBhcnNlZEpzb24gb2JqZWN0IFBhcnNlZCBKU09OIGRhdGFcclxuQHBhcmFtIHRhYmxlSWQgc3RyaW5nIE9wdGlvbmFsIHRhYmxlIGlkXHJcbkBwYXJhbSB0YWJsZUNsYXNzTmFtZSBzdHJpbmcgT3B0aW9uYWwgdGFibGUgY3NzIGNsYXNzIG5hbWVcclxuQHBhcmFtIGxpbmtUZXh0IHN0cmluZyBPcHRpb25hbCB0ZXh0IHJlcGxhY2VtZW50IGZvciBsaW5rIHBhdHRlcm5cclxuXHJcbkByZXR1cm4gc3RyaW5nIENvbnZlcnRlZCBKU09OIHRvIEhUTUwgdGFibGVcclxuIyMjXHJcbmNsYXNzIEpzb25Ub1RhYmxlIFxyXG4gIFxyXG4gIHRhYmxlOiBudWxsXHJcbiAgXHJcbiAgY29uc3RydWN0b3I6IChwYXJzZWRKc29uLCB0YWJsZUlkLCB0YWJsZUNsYXNzTmFtZSwgbGlua1RleHQpIC0+XHJcbiAgICAjUGF0dGVybnMgZm9yIGxpbmtzIGFuZCBOVUxMIHZhbHVlXHJcbiAgICBpdGFsaWMgPSBcIjxpPnswfTwvaT5cIlxyXG4gICAgbGluayA9IChpZiBsaW5rVGV4dCB0aGVuIFwiPGEgaHJlZj1cXFwiezB9XFxcIj5cIiArIGxpbmtUZXh0ICsgXCI8L2E+XCIgZWxzZSBcIjxhIGhyZWY9XFxcInswfVxcXCI+ezB9PC9hPlwiKVxyXG4gIFxyXG4gICAgI1BhdHRlcm4gZm9yIHRhYmxlICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgIGlkTWFya3VwID0gKGlmIHRhYmxlSWQgdGhlbiBcIiBpZD1cXFwiXCIgKyB0YWJsZUlkICsgXCJcXFwiXCIgZWxzZSBcIlwiKVxyXG4gICAgY2xhc3NNYXJrdXAgPSAoaWYgdGFibGVDbGFzc05hbWUgdGhlbiBcIiBjbGFzcz1cXFwiXCIgKyB0YWJsZUNsYXNzTmFtZSArIFwiXFxcIlwiIGVsc2UgXCJcIilcclxuICAgIHRibCA9IFwiPHRhYmxlIGJvcmRlcj1cXFwiMVxcXCIgY2VsbHBhZGRpbmc9XFxcIjFcXFwiIGNlbGxzcGFjaW5nPVxcXCIxXFxcIlwiICsgaWRNYXJrdXAgKyBjbGFzc01hcmt1cCArIFwiPnswfXsxfTwvdGFibGU+XCJcclxuICBcclxuICAgICNQYXR0ZXJucyBmb3IgdGFibGUgY29udGVudFxyXG4gICAgdGggPSBcIjx0aGVhZD57MH08L3RoZWFkPlwiXHJcbiAgICB0YiA9IFwiPHRib2R5PnswfTwvdGJvZHk+XCJcclxuICAgIHRyID0gXCI8dHI+ezB9PC90cj5cIlxyXG4gICAgdGhSb3cgPSBcIjx0aD57MH08L3RoPlwiXHJcbiAgICB0ZFJvdyA9IFwiPHRkPnswfTwvdGQ+XCJcclxuICAgIHRoQ29uID0gXCJcIlxyXG4gICAgdGJDb24gPSBcIlwiXHJcbiAgICB0ckNvbiA9IFwiXCJcclxuICAgIGlmIHBhcnNlZEpzb25cclxuICAgICAgaXNTdHJpbmdBcnJheSA9IHR5cGVvZiAocGFyc2VkSnNvblswXSkgaXMgXCJzdHJpbmdcIlxyXG4gICAgICBoZWFkZXJzID0gdW5kZWZpbmVkXHJcbiAgICBcclxuICAgICAgIyBDcmVhdGUgdGFibGUgaGVhZGVycyBmcm9tIEpTT04gZGF0YVxyXG4gICAgICAjIElmIEpTT04gZGF0YSBpcyBhIHNpbXBsZSBzdHJpbmcgYXJyYXkgd2UgY3JlYXRlIGEgc2luZ2xlIHRhYmxlIGhlYWRlclxyXG4gICAgICBpZiBpc1N0cmluZ0FycmF5XHJcbiAgICAgICAgdGhDb24gKz0gdGhSb3cuZm9ybWF0KFwidmFsdWVcIilcclxuICAgICAgZWxzZVxyXG4gICAgICBcclxuICAgICAgICAjIElmIEpTT04gZGF0YSBpcyBhbiBvYmplY3QgYXJyYXksIGhlYWRlcnMgYXJlIGF1dG9tYXRpY2FsbHkgY29tcHV0ZWRcclxuICAgICAgICBpZiB0eXBlb2YgKHBhcnNlZEpzb25bMF0pIGlzIFwib2JqZWN0XCJcclxuICAgICAgICAgIGhlYWRlcnMgPSBhcnJheV9rZXlzKHBhcnNlZEpzb25bMF0pXHJcbiAgICAgICAgICBpID0gMFxyXG4gICAgICAgICAgd2hpbGUgaSA8IGhlYWRlcnMubGVuZ3RoXHJcbiAgICAgICAgICAgIHRoQ29uICs9IHRoUm93LmZvcm1hdChoZWFkZXJzW2ldKVxyXG4gICAgICAgICAgICBpKytcclxuICAgICAgdGggPSB0aC5mb3JtYXQodHIuZm9ybWF0KHRoQ29uKSlcclxuICAgIFxyXG4gICAgICAjIENyZWF0ZSB0YWJsZSByb3dzIGZyb20gSnNvbiBkYXRhXHJcbiAgICAgIGlmIGlzU3RyaW5nQXJyYXlcclxuICAgICAgICBpID0gMFxyXG4gICAgICAgIHdoaWxlIGkgPCBwYXJzZWRKc29uLmxlbmd0aFxyXG4gICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KHBhcnNlZEpzb25baV0pXHJcbiAgICAgICAgICB0ckNvbiArPSB0ci5mb3JtYXQodGJDb24pXHJcbiAgICAgICAgICB0YkNvbiA9IFwiXCJcclxuICAgICAgICAgIGkrK1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgaWYgaGVhZGVyc1xyXG4gICAgICAgICAgdXJsUmVnRXhwID0gbmV3IFJlZ0V4cCgvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2cpXHJcbiAgICAgICAgICBqYXZhc2NyaXB0UmVnRXhwID0gbmV3IFJlZ0V4cCgvKF5qYXZhc2NyaXB0OltcXHNcXFNdKjskKS9nKVxyXG4gICAgICAgICAgaSA9IDBcclxuICAgICAgICAgIHdoaWxlIGkgPCBwYXJzZWRKc29uLmxlbmd0aFxyXG4gICAgICAgICAgICBqID0gMFxyXG4gICAgICAgICAgICB3aGlsZSBqIDwgaGVhZGVycy5sZW5ndGhcclxuICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlZEpzb25baV1baGVhZGVyc1tqXV1cclxuICAgICAgICAgICAgICBpc1VybCA9IHVybFJlZ0V4cC50ZXN0KHZhbHVlKSBvciBqYXZhc2NyaXB0UmVnRXhwLnRlc3QodmFsdWUpXHJcbiAgICAgICAgICAgICAgaWYgaXNVcmwgIyBJZiB2YWx1ZSBpcyBVUkwgd2UgYXV0by1jcmVhdGUgYSBsaW5rXHJcbiAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQobGluay5mb3JtYXQodmFsdWUpKVxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGlmIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgIGlmIHR5cGVvZiAodmFsdWUpIGlzIFwib2JqZWN0XCJcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgI2ZvciBzdXBwb3J0aW5nIG5lc3RlZCB0YWJsZXNcclxuICAgICAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQoQ29udmVydEpzb25Ub1RhYmxlKGV2YWwodmFsdWUuZGF0YSksIHZhbHVlLnRhYmxlSWQsIHZhbHVlLnRhYmxlQ2xhc3NOYW1lLCB2YWx1ZS5saW5rVGV4dCkpXHJcbiAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQodmFsdWUpXHJcbiAgICAgICAgICAgICAgICBlbHNlICMgSWYgdmFsdWUgPT0gbnVsbCB3ZSBmb3JtYXQgaXQgbGlrZSBQaHBNeUFkbWluIE5VTEwgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChpdGFsaWMuZm9ybWF0KHZhbHVlKS50b1VwcGVyQ2FzZSgpKVxyXG4gICAgICAgICAgICAgIGorK1xyXG4gICAgICAgICAgICB0ckNvbiArPSB0ci5mb3JtYXQodGJDb24pXHJcbiAgICAgICAgICAgIHRiQ29uID0gXCJcIlxyXG4gICAgICAgICAgICBpKytcclxuICAgICAgdGIgPSB0Yi5mb3JtYXQodHJDb24pXHJcbiAgICAgIHRibCA9IHRibC5mb3JtYXQodGgsIHRiKVxyXG4gICAgQHRhYmxlID0gdGJsXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEpzb25Ub1RhYmxlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuYXJyYXkyRCA9IChpbml0TGVuZ3RoLCBpbml0V2lkdGgpIC0+XHJcbiAgYXJyYXkgPSBbXVxyXG4gIG1heExlbmd0aCA9IDBcclxuICBtYXhXaWR0aCA9IDBcclxuICAgIFxyXG4gIHJldCA9IFxyXG4gICAgZ2V0OiAocm93Tm8sIGNvbE5vKSAtPlxyXG4gICAgICBleHRlbmQgcm93Tm8sIGNvbE5vXHJcbiAgICBzZXQ6IChyb3dObywgY29sTm8sIHZhbCkgLT5cclxuICAgICAgcmV0LmdldCByb3dObywgY29sTm9cclxuICAgICAgcm93SWR4ID0gcm93Tm8tMVxyXG4gICAgICBjb2xJZHggPSBjb2xOby0xXHJcbiAgICAgIGFycmF5W3Jvd0lkeF1bY29sSWR4XSA9IHZhbFxyXG4gICAgZWFjaDogKGNhbGxCYWNrKSAtPlxyXG4gICAgICBfLmVhY2ggYXJyYXksIChjb2x1bW5zLCByb3cpIC0+XHJcbiAgICAgICAgXy5lYWNoIGFycmF5W3Jvd10sICh2YWwsIGNvbCkgLT5cclxuICAgICAgICAgIHJvd0lkeCA9IHJvdysxXHJcbiAgICAgICAgICBjb2xJZHggPSBjb2wrMVxyXG4gICAgICAgICAgY2FsbEJhY2sgcm93SWR4LCBjb2xJZHgsIHZhbFxyXG4gICAgd2lkdGg6ICgpIC0+XHJcbiAgICAgIG1heFdpZHRoXHJcbiAgICBsZW5ndGg6ICgpIC0+XHJcbiAgICAgIG1heExlbmd0aFxyXG4gICAgICAgICBcclxuICAjIyNcclxuICBHdWFyYW50ZWUgdGhhdCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgYXJyYXkgYXJlIGFsd2F5cyBiYWNrZWQgYnkgdmFsdWVzIGF0IGV2ZXJ5IHBvc2l0aW9uXHJcbiAgIyMjICAgICAgICAgICAgICAgICAgICBcclxuICBleHRlbmQgPSAobGVuZ3RoLCB3aWR0aCkgLT4gIFxyXG4gICAgaWYgbm90IGxlbmd0aCBvciBsZW5ndGggPCAxIHRoZW4gbGVuZ3RoID0gMVxyXG4gICAgaWYgbm90IHdpZHRoIG9yIHdpZHRoIDwgMSB0aGVuIHdpZHRoID0gMVxyXG4gICAgICBcclxuICAgIGlmIG1heExlbmd0aCA8IGxlbmd0aCB0aGVuIG1heExlbmd0aCA9IGxlbmd0aFxyXG4gICAgaWYgYXJyYXkubGVuZ3RoID4gbWF4TGVuZ3RoIHRoZW4gbWF4TGVuZ3RoID0gYXJyYXkubGVuZ3RoXHJcbiAgICBpZiBtYXhXaWR0aCA8IHdpZHRoIHRoZW4gbWF4V2lkdGggPSB3aWR0aFxyXG4gICAgaSA9IDBcclxuICAgICAgXHJcbiAgICB3aGlsZSBpIDwgbWF4TGVuZ3RoXHJcbiAgICAgIHRyeVJvdyA9IGFycmF5W2ldXHJcbiAgICAgIGlmIG5vdCB0cnlSb3dcclxuICAgICAgICB0cnlSb3cgPSBbXVxyXG4gICAgICAgIGFycmF5LnB1c2ggdHJ5Um93XHJcbiAgICAgIGlmIG1heFdpZHRoIDwgdHJ5Um93Lmxlbmd0aCB0aGVuIG1heFdpZHRoID0gdHJ5Um93Lmxlbmd0aFxyXG4gICAgICBpZiB0cnlSb3cubGVuZ3RoIDwgbWF4V2lkdGggdGhlbiB0cnlSb3cubGVuZ3RoID0gbWF4V2lkdGhcclxuICAgICAgaSArPSAxXHJcbiAgICAgIFxyXG4gICAgYXJyYXlbbGVuZ3RoLTFdW3dpZHRoLTFdXHJcbiAgICAgICBcclxuICBleHRlbmQgaW5pdExlbmd0aCwgaW5pdFdpZHRoXHJcbiAgICBcclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdhcnJheTJEJywgYXJyYXkyRFxyXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5MkQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5tZXRob2RzID0gW1xyXG4gICdhc3NlcnQnXHJcbiAgJ2NsZWFyJ1xyXG4gICdjb3VudCdcclxuICAnZGVidWcnXHJcbiAgJ2RpcidcclxuICAnZGlyeG1sJ1xyXG4gICdlcnJvcidcclxuICAnZXhjZXB0aW9uJ1xyXG4gICdncm91cCdcclxuICAnZ3JvdXBDb2xsYXBzZWQnXHJcbiAgJ2dyb3VwRW5kJ1xyXG4gICdpbmZvJ1xyXG4gICdsb2cnXHJcbiAgJ21lbW9yeSdcclxuICAncHJvZmlsZSdcclxuICAncHJvZmlsZUVuZCdcclxuICAndGFibGUnXHJcbiAgJ3RpbWUnXHJcbiAgJ3RpbWVFbmQnXHJcbiAgJ3RpbWVTdGFtcCdcclxuICAndGltZWxpbmUnXHJcbiAgJ3RpbWVsaW5lRW5kJ1xyXG4gICd0cmFjZSdcclxuICAnd2FybidcclxuXVxyXG5tZXRob2RMZW5ndGggPSBtZXRob2RzLmxlbmd0aFxyXG5jb25zb2xlID0gT0ouZ2xvYmFsLmNvbnNvbGUgb3Ige31cclxuT0oubWFrZVN1Yk5hbWVTcGFjZSAnY29uc29sZSdcclxuICBcclxuIyMjXHJcbjEuIFN0dWIgb3V0IGFueSBtaXNzaW5nIG1ldGhvZHMgd2l0aCBub29wXHJcbjIuIERlZmluZSB0aGUgYXZhaWxhYmxlIG1ldGhvZHMgb24gdGhlIE9KLmNvbnNvbGUgb2JqZWN0XHJcbiMjI1xyXG53aGlsZSBtZXRob2RMZW5ndGgtLVxyXG4gICgtPlxyXG4gICAgbWV0aG9kID0gbWV0aG9kc1ttZXRob2RMZW5ndGhdXHJcbiAgICBcclxuICAgICMgT25seSBzdHViIHVuZGVmaW5lZCBtZXRob2RzLlxyXG4gICAgY29uc29sZVttZXRob2RdID0gT0oubm9vcCB1bmxlc3MgY29uc29sZVttZXRob2RdXHJcbiAgICBcclxuICAgICNEZWZpbmUgdGhlIG1ldGhvZCBvbiB0aGUgT0ogY29uc29sZSBuYW1lc3BhY2VcclxuICAgIE9KLmNvbnNvbGUucmVnaXN0ZXIgbWV0aG9kLCAocGFyYW1zLi4uKSAtPlxyXG4gICAgICBjb25zb2xlW21ldGhvZF0gcGFyYW1zLi4uXHJcbiAgKSgpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnNvbGUiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCwgT0osIGFsbCwgY29va2llcywgZGVsLCBkZWxldGVBbGwsIGdldCwgc2V0O1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbiQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cblxuLypcblNldHVwIHNldHRpbmdzXG4kLmNvb2tpZS5yYXcgPSB0cnVlXG4kLmNvb2tpZS5qc29uID0gdHJ1ZVxuICBcblNldHVwIGRlZmF1bHRzXG5odHRwczovL2dpdGh1Yi5jb20vY2FyaGFydGwvanF1ZXJ5LWNvb2tpZS9cbiQuY29va2llLmRlZmF1bHRzLmV4cGlyZXMgPSAzNjVcbiQuY29va2llLmRlZmF1bHRzLnBhdGggPSAnLydcbiQuY29va2llLmRlZmF1bHRzLmRvbWFpbiA9ICdvai5jb20nXG4gKi9cblxuaWYgKCEkIHx8ICEkLmNvb2tpZSkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ2pRdWVyeSBDb29raWUgaXMgYSByZXF1aXJlZCBkZXBlbmRlbmN5LicpO1xufVxuXG4kLmNvb2tpZS5kZWZhdWx0cy5zZWN1cmUgPSBmYWxzZTtcblxuY29va2llcyA9IHt9O1xuXG5nZXQgPSBmdW5jdGlvbihjb29raWVOYW1lLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIHJldCA9ICcnO1xuICBpZiAoY29va2llTmFtZSkge1xuICAgIGlmICh0eXBlKSB7XG4gICAgICByZXQgPSAkLmNvb2tpZShjb29raWVOYW1lLCB0eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0ID0gJC5jb29raWUoY29va2llTmFtZSk7XG4gICAgfVxuICAgIGlmIChyZXQpIHtcbiAgICAgIHJldHVybiBjb29raWVzW2Nvb2tpZU5hbWVdID0gcmV0O1xuICAgIH1cbiAgfVxufTtcblxuYWxsID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXQ7XG4gIHJldCA9ICQuY29va2llKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5zZXQgPSBmdW5jdGlvbihjb29raWVOYW1lLCB2YWx1ZSwgb3B0cykge1xuICB2YXIgcmV0O1xuICByZXQgPSAnJztcbiAgaWYgKGNvb2tpZU5hbWUpIHtcbiAgICBjb29raWVzW2Nvb2tpZU5hbWVdID0gdmFsdWU7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgIHJldCA9ICQuY29va2llKGNvb2tpZU5hbWUsIHZhbHVlLCBvcHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0ID0gJC5jb29raWUoY29va2llTmFtZSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxuZGVsID0gZnVuY3Rpb24oY29va2llTmFtZSwgb3B0cykge1xuICBpZiAoY29va2llTmFtZSkge1xuICAgIGlmIChvcHRzKSB7XG4gICAgICAkLnJlbW92ZUNvb2tpZShjb29raWVOYW1lLCBvcHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJC5yZW1vdmVDb29raWUoY29va2llTmFtZSk7XG4gICAgfVxuICAgIGRlbGV0ZSBjb29raWVzW2Nvb2tpZU5hbWVdO1xuICB9XG59O1xuXG5kZWxldGVBbGwgPSBmdW5jdGlvbigpIHtcbiAgY29va2llcyA9IHt9O1xuICBPSi5lYWNoKE9KLmNvb2tpZS5hbGwsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgcmV0dXJuIE9KLmNvb2tpZVtcImRlbGV0ZVwiXShrZXkpO1xuICB9KTtcbn07XG5cbk9KLmNvb2tpZS5yZWdpc3RlcignZGVsZXRlQWxsJywgZGVsZXRlQWxsKTtcblxuT0ouY29va2llLnJlZ2lzdGVyKCdkZWxldGUnLCBkZWwpO1xuXG5PSi5jb29raWUucmVnaXN0ZXIoJ3NldCcsIHNldCk7XG5cbk9KLmNvb2tpZS5yZWdpc3RlcignZ2V0JywgZ2V0KTtcblxuT0ouY29va2llLnJlZ2lzdGVyKCdhbGwnLCBhbGwpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGVsZXRlQWxsOiBkZWxldGVBbGwsXG4gIFwiZGVsZXRlXCI6IGRlbCxcbiAgc2V0OiBzZXQsXG4gIGdldDogZ2V0LFxuICBhbGw6IGFsbFxufTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRngwYjI5c2MxeGNZMjl2YTJsbExtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlFVRXNTVUZCUVRzN1FVRkJRU3hGUVVGQkxFZEJRVXNzVDBGQlFTeERRVUZSTEU5QlFWSTdPMEZCUTB3c1EwRkJRU3hIUVVGSkxFOUJRVUVzUTBGQlVTeFJRVUZTT3pzN1FVRkZTanM3T3pzN096czdPenM3TzBGQlYwRXNTVUZCUnl4RFFVRkpMRU5CUVVvc1NVRkJVeXhEUVVGSkxFTkJRVU1zUTBGQlF5eE5RVUZzUWp0QlFVTkZMRkZCUVZVc1NVRkJRU3hMUVVGQkxFTkJRVTBzZVVOQlFVNHNSVUZFV2pzN08wRkJSVUVzUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1RVRkJiRUlzUjBGQk1rSTdPMEZCUlROQ0xFOUJRVUVzUjBGQlZUczdRVUZGVml4SFFVRkJMRWRCUVUwc1UwRkJReXhWUVVGRUxFVkJRV0VzU1VGQllqdEJRVU5LTEUxQlFVRTdSVUZCUVN4SFFVRkJMRWRCUVUwN1JVRkRUaXhKUVVGSExGVkJRVWc3U1VGRFJTeEpRVUZITEVsQlFVZzdUVUZEUlN4SFFVRkJMRWRCUVUwc1EwRkJReXhEUVVGRExFMUJRVVlzUTBGQlV5eFZRVUZVTEVWQlFYRkNMRWxCUVhKQ0xFVkJSRkk3UzBGQlFTeE5RVUZCTzAxQlIwVXNSMEZCUVN4SFFVRk5MRU5CUVVNc1EwRkJReXhOUVVGR0xFTkJRVk1zVlVGQlZDeEZRVWhTT3p0SlFVbEJMRWxCUVVjc1IwRkJTRHRoUVVORkxFOUJRVkVzUTBGQlFTeFZRVUZCTEVOQlFWSXNSMEZCYzBJc1NVRkVlRUk3UzBGTVJqczdRVUZHU1RzN1FVRlZUaXhIUVVGQkxFZEJRVTBzVTBGQlFUdEJRVU5LTEUxQlFVRTdSVUZCUVN4SFFVRkJMRWRCUVUwc1EwRkJReXhEUVVGRExFMUJRVVlzUTBGQlFUdFRRVU5PTzBGQlJrazdPMEZCU1U0c1IwRkJRU3hIUVVGTkxGTkJRVU1zVlVGQlJDeEZRVUZoTEV0QlFXSXNSVUZCYjBJc1NVRkJjRUk3UVVGRFNpeE5RVUZCTzBWQlFVRXNSMEZCUVN4SFFVRk5PMFZCUTA0c1NVRkJSeXhWUVVGSU8wbEJRMFVzVDBGQlVTeERRVUZCTEZWQlFVRXNRMEZCVWl4SFFVRnpRanRKUVVOMFFpeEpRVUZITEVsQlFVZzdUVUZEUlN4SFFVRkJMRWRCUVUwc1EwRkJReXhEUVVGRExFMUJRVVlzUTBGQlV5eFZRVUZVTEVWQlFYRkNMRXRCUVhKQ0xFVkJRVFJDTEVsQlFUVkNMRVZCUkZJN1MwRkJRU3hOUVVGQk8wMUJSMFVzUjBGQlFTeEhRVUZOTEVOQlFVTXNRMEZCUXl4TlFVRkdMRU5CUVZNc1ZVRkJWQ3hGUVVGeFFpeExRVUZ5UWl4RlFVaFNPMHRCUmtZN08xTkJUVUU3UVVGU1NUczdRVUZWVGl4SFFVRkJMRWRCUVUwc1UwRkJReXhWUVVGRUxFVkJRV0VzU1VGQllqdEZRVU5LTEVsQlFVY3NWVUZCU0R0SlFVTkZMRWxCUVVjc1NVRkJTRHROUVVORkxFTkJRVU1zUTBGQlF5eFpRVUZHTEVOQlFXVXNWVUZCWml4RlFVRXlRaXhKUVVFelFpeEZRVVJHTzB0QlFVRXNUVUZCUVR0TlFVZEZMRU5CUVVNc1EwRkJReXhaUVVGR0xFTkJRV1VzVlVGQlppeEZRVWhHT3p0SlFVbEJMRTlCUVU4c1QwRkJVU3hEUVVGQkxGVkJRVUVzUlVGTWFrSTdPMEZCUkVrN08wRkJVMDRzVTBGQlFTeEhRVUZaTEZOQlFVRTdSVUZEVml4UFFVRkJMRWRCUVZVN1JVRkRWaXhGUVVGRkxFTkJRVU1zU1VGQlNDeERRVUZSTEVWQlFVVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1IwRkJiRUlzUlVGQmRVSXNVMEZCUXl4SFFVRkVMRVZCUVUwc1IwRkJUanRYUVVOeVFpeEZRVUZGTEVOQlFVTXNUVUZCVFN4RFFVRkRMRkZCUVVRc1EwRkJWQ3hEUVVGcFFpeEhRVUZxUWp0RlFVUnhRaXhEUVVGMlFqdEJRVVpWT3p0QlFVMVlMRVZCUVVVc1EwRkJReXhOUVVGTkxFTkJRVU1zVVVGQlZpeERRVUZ0UWl4WFFVRnVRaXhGUVVGblF5eFRRVUZvUXpzN1FVRkRRU3hGUVVGRkxFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWWXNRMEZCYlVJc1VVRkJia0lzUlVGQk5rSXNSMEZCTjBJN08wRkJRMEVzUlVGQlJTeERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRldMRU5CUVcxQ0xFdEJRVzVDTEVWQlFUQkNMRWRCUVRGQ096dEJRVU5CTEVWQlFVVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1VVRkJWaXhEUVVGdFFpeExRVUZ1UWl4RlFVRXdRaXhIUVVFeFFqczdRVUZEUVN4RlFVRkZMRU5CUVVNc1RVRkJUU3hEUVVGRExGRkJRVllzUTBGQmJVSXNTMEZCYmtJc1JVRkJNa0lzUjBGQk0wSTdPMEZCUlVFc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGRFF6dEZRVUZCTEZOQlFVRXNSVUZCVnl4VFFVRllPMFZCUTBFc1VVRkJRU3hGUVVGUkxFZEJSRkk3UlVGRlFTeEhRVUZCTEVWQlFVc3NSMEZHVER0RlFVZEJMRWRCUVVFc1JVRkJTeXhIUVVoTU8wVkJTVUVzUjBGQlFTeEZRVUZOTEVkQlNrNGlMQ0ptYVd4bElqb2laMlZ1WlhKaGRHVmtMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWs5S0lEMGdjbVZ4ZFdseVpTQW5MaTR2YjJvblhISmNiaVFnUFNCeVpYRjFhWEpsSUNkcWNYVmxjbmtuWEhKY2JpQWdYSEpjYmlNakkxeHlYRzVUWlhSMWNDQnpaWFIwYVc1bmMxeHlYRzRrTG1OdmIydHBaUzV5WVhjZ1BTQjBjblZsWEhKY2JpUXVZMjl2YTJsbExtcHpiMjRnUFNCMGNuVmxYSEpjYmlBZ1hISmNibE5sZEhWd0lHUmxabUYxYkhSelhISmNibWgwZEhCek9pOHZaMmwwYUhWaUxtTnZiUzlqWVhKb1lYSjBiQzlxY1hWbGNua3RZMjl2YTJsbEwxeHlYRzRrTG1OdmIydHBaUzVrWldaaGRXeDBjeTVsZUhCcGNtVnpJRDBnTXpZMVhISmNiaVF1WTI5dmEybGxMbVJsWm1GMWJIUnpMbkJoZEdnZ1BTQW5MeWRjY2x4dUpDNWpiMjlyYVdVdVpHVm1ZWFZzZEhNdVpHOXRZV2x1SUQwZ0oyOXFMbU52YlNkY2NseHVJeU1qWEhKY2JtbG1JRzV2ZENBa0lHOXlJRzV2ZENBa0xtTnZiMnRwWlZ4eVhHNGdJSFJvY205M0lHNWxkeUJGY25KdmNpQW5hbEYxWlhKNUlFTnZiMnRwWlNCcGN5QmhJSEpsY1hWcGNtVmtJR1JsY0dWdVpHVnVZM2t1SnlBZ1hISmNiaVF1WTI5dmEybGxMbVJsWm1GMWJIUnpMbk5sWTNWeVpTQTlJR1poYkhObFhISmNiaUFnWEhKY2JtTnZiMnRwWlhNZ1BTQjdmVnh5WEc0Z0lGeHlYRzVuWlhRZ1BTQW9ZMjl2YTJsbFRtRnRaU3dnZEhsd1pTa2dMVDVjY2x4dUlDQnlaWFFnUFNBbkoxeHlYRzRnSUdsbUlHTnZiMnRwWlU1aGJXVmNjbHh1SUNBZ0lHbG1JSFI1Y0dWY2NseHVJQ0FnSUNBZ2NtVjBJRDBnSkM1amIyOXJhV1VnWTI5dmEybGxUbUZ0WlN3Z2RIbHdaVnh5WEc0Z0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNCeVpYUWdQU0FrTG1OdmIydHBaU0JqYjI5cmFXVk9ZVzFsSUNBZ0lGeHlYRzRnSUNBZ2FXWWdjbVYwWEhKY2JpQWdJQ0FnSUdOdmIydHBaWE5iWTI5dmEybGxUbUZ0WlYwZ1BTQnlaWFJjY2x4dUlDQmNjbHh1WVd4c0lEMGdMVDVjY2x4dUlDQnlaWFFnUFNBa0xtTnZiMnRwWlNncFhISmNiaUFnY21WMFhISmNiaUFnSUNCY2NseHVjMlYwSUQwZ0tHTnZiMnRwWlU1aGJXVXNJSFpoYkhWbExDQnZjSFJ6S1NBdFBseHlYRzRnSUhKbGRDQTlJQ2NuWEhKY2JpQWdhV1lnWTI5dmEybGxUbUZ0WlZ4eVhHNGdJQ0FnWTI5dmEybGxjMXRqYjI5cmFXVk9ZVzFsWFNBOUlIWmhiSFZsWEhKY2JpQWdJQ0JwWmlCdmNIUnpYSEpjYmlBZ0lDQWdJSEpsZENBOUlDUXVZMjl2YTJsbElHTnZiMnRwWlU1aGJXVXNJSFpoYkhWbExDQnZjSFJ6WEhKY2JpQWdJQ0JsYkhObFhISmNiaUFnSUNBZ0lISmxkQ0E5SUNRdVkyOXZhMmxsSUdOdmIydHBaVTVoYldVc0lIWmhiSFZsWEhKY2JpQWdjbVYwSUNCY2NseHVJQ0JjY2x4dVpHVnNJRDBnS0dOdmIydHBaVTVoYldVc0lHOXdkSE1wSUMwK1hISmNiaUFnYVdZZ1kyOXZhMmxsVG1GdFpWeHlYRzRnSUNBZ2FXWWdiM0IwYzF4eVhHNGdJQ0FnSUNBa0xuSmxiVzkyWlVOdmIydHBaU0JqYjI5cmFXVk9ZVzFsTENCdmNIUnpYSEpjYmlBZ0lDQmxiSE5sWEhKY2JpQWdJQ0FnSUNRdWNtVnRiM1psUTI5dmEybGxJR052YjJ0cFpVNWhiV1VnSUNBZ1hISmNiaUFnSUNCa1pXeGxkR1VnWTI5dmEybGxjMXRqYjI5cmFXVk9ZVzFsWFZ4eVhHNGdJSEpsZEhWeWJseHlYRzRnSUNBZ1hISmNibVJsYkdWMFpVRnNiQ0E5SUMwK1hISmNiaUFnWTI5dmEybGxjeUE5SUh0OVhISmNiaUFnVDBvdVpXRmphQ0JQU2k1amIyOXJhV1V1WVd4c0xDQW9kbUZzTENCclpYa3BJQzArWEhKY2JpQWdJQ0JQU2k1amIyOXJhV1V1WkdWc1pYUmxJR3RsZVNBZ1hISmNiaUFnY21WMGRYSnVYSEpjYmlBZ0lDQmNjbHh1SUU5S0xtTnZiMnRwWlM1eVpXZHBjM1JsY2lBblpHVnNaWFJsUVd4c0p5d2daR1ZzWlhSbFFXeHNYSEpjYmlCUFNpNWpiMjlyYVdVdWNtVm5hWE4wWlhJZ0oyUmxiR1YwWlNjc0lHUmxiRnh5WEc0Z1Qwb3VZMjl2YTJsbExuSmxaMmx6ZEdWeUlDZHpaWFFuTENCelpYUmNjbHh1SUU5S0xtTnZiMnRwWlM1eVpXZHBjM1JsY2lBbloyVjBKeXdnWjJWMFhISmNiaUJQU2k1amIyOXJhV1V1Y21WbmFYTjBaWElnSjJGc2JDY3NJQ0JoYkd4Y2NseHVJRnh5WEc0Z2JXOWtkV3hsTG1WNGNHOXlkSE1nUFNCY2NseHVJQ0JrWld4bGRHVkJiR3c2SUdSbGJHVjBaVUZzYkZ4eVhHNGdJR1JsYkdWMFpUb2daR1ZzWEhKY2JpQWdjMlYwT2lCelpYUmNjbHh1SUNCblpYUTZJR2RsZEZ4eVhHNGdJR0ZzYkRvZ0lHRnNiQ0pkZlE9PSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmRlZmVyID0gKG1ldGhvZCwgd2FpdE1zKSAtPlxyXG4gIGlmIHNldFRpbWVvdXRcclxuICAgIHJldHVybiBzZXRUaW1lb3V0IG1ldGhvZCwgd2FpdE1zXHJcbiAgXHJcbk9KLnJlZ2lzdGVyICdkZWZlcicsIGRlZmVyXHJcbm1vZHVsZS5leHBvcnRzID0gZGVmZXIiLCIjICMgZWFjaFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMgIyMgY2FuRWFjaFxyXG5jYW5FYWNoID0gKG9iaikgLT5cclxuICAjIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgW2lzXShpcy5odG1sKSB0cnVseSBpdGVyYWJsZSAoZS5nLiBhbiBpbnN0YW5jZSBvZiBPYmplY3Qgb3IgQXJyYXkpXHJcbiAgT0ouaXMucGxhaW5PYmplY3Qob2JqKSBvciBPSi5pcy5vYmplY3Qob2JqKSBvciBPSi5pcy5hcnJheSBvYmpcclxuXHJcbiMgIyMgW09KXShvai5odG1sKS5lYWNoXHJcblxyXG4jIEl0ZXJhdGUgYWxsIG9mIHRoZSBtZW1iZXJzIG9mIGFuIG9iamVjdCAob3IgYW4gYXJyYXkpIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYW5kIHJlY3Vyc2lvbi5cclxuXHJcbiMgLSBgb2JqYDogdGhlIG9iamVjdCB0byBpdGVyYXRlLFxyXG4jIC0gYG9uRWFjaGA6IGEgY2FsbGJhY2sgdG8gZXhlY3V0ZSBmb3IgZWFjaCBpdGVyYXRpb24sXHJcbiMgLSBgcmVjdXJzaXZlYDogaWYgdHJ1ZSwgcmVjdXJzaXZlbHkgaXRlcmF0ZSBhbGwgdmFsaWQgY2hpbGQgb2JqZWN0cy5cclxuZWFjaCA9IChvYmosIG9uRWFjaCwgcmVjdXJzaXZlKSAtPlxyXG4gIGlmIGNhbkVhY2ggb2JqXHJcbiAgICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI2Zvcm93bikncyBgZm9yT3duYCBtZXRob2QgdG8gZW5zdXJlIHRoYXQgb25seSB0aGUgYWN0dWFsIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdCBhcmUgZW51bWVyYXRlZC5cclxuXHJcbiAgICAjIC0gYG9uRWFjaGAgY2FsbGJhY2sgd2lsbCByZWNlaXZlIDIgcGFyYW1ldGVyczpcclxuICAgICMgLSBgdmFsYCBhbmQgYGtleWAuXHJcbiAgICAjIC0gYHZhbGAgaXMgYWx3YXlzIHRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuXHJcbiAgICAjIC0gYGtleWAgaXMgZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBvciB0aGUgY3VycmVudCBpbmRleCBvZiB0aGUgYXJyYXkuXHJcbiAgICBfLmZvck93biBvYmosICh2YWwsIGtleSkgLT5cclxuICAgICAgaWYgb25FYWNoIGFuZCAodmFsIG9yIGtleSlcclxuICAgICAgICBxdWl0ID0gb25FYWNoIHZhbCwga2V5XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlICBpZiBmYWxzZSBpcyBxdWl0XHJcbiAgICAgIGVhY2ggdmFsLCBvbkVhY2gsIHRydWUgIGlmIHRydWUgaXMgcmVjdXJzaXZlXHJcbiAgICAgIHJldHVyblxyXG5cclxuICByZXR1cm5cclxuXHJcbiMgIyMgcmVnaXN0ZXJcclxuXHJcbiMgcmVnaXN0ZXIgdGhlIGBlYWNoYCBtZXRob2Qgb24gdGhlIFtPSl0oT0ouaHRtbCkgbmFtZXNwYWNlXHJcbk9KLnJlZ2lzdGVyICdlYWNoJywgZWFjaFxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhY2giLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG51bmtub3duID0gJ3Vua25vd24nICAgXHJcbiAgXHJcbmlucHV0VHlwZXMgPVxyXG4gIGJ1dHRvbjogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAwXHJcbiAgICBuYW1lOiAnYnV0dG9uJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBjaGVja2JveDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxXHJcbiAgICBuYW1lOiAnY2hlY2tib3gnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgY29sb3I6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMlxyXG4gICAgbmFtZTogJ2NvbG9yJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGRhdGU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogM1xyXG4gICAgbmFtZTogJ2RhdGUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBkYXRldGltZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA0XHJcbiAgICBuYW1lOiAnZGF0ZXRpbWUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgJ2RhdGV0aW1lLWxvY2FsJzogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA1XHJcbiAgICBuYW1lOiAnZGF0ZXRpbWUtbG9jYWwnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBlbWFpbDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA2XHJcbiAgICBuYW1lOiAnZW1haWwnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGZpbGU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogN1xyXG4gICAgbmFtZTogJ2ZpbGUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogZmFsc2VcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBoaWRkZW46ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogOFxyXG4gICAgbmFtZTogJ2hpZGRlbidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgaW1hZ2U6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogOVxyXG4gICAgbmFtZTogJ2ltYWdlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBtb250aDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxMFxyXG4gICAgbmFtZTogJ21vbnRoJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBudW1iZXI6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTFcclxuICAgIG5hbWU6ICdudW1iZXInXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcGFzc3dvcmQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTJcclxuICAgIG5hbWU6ICdwYXNzd29yZCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHJhZGlvOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDEzXHJcbiAgICBuYW1lOiAncmFkaW8nXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcmFuZ2U6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTRcclxuICAgIG5hbWU6ICdyYW5nZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICByZXNldDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxNVxyXG4gICAgbmFtZTogJ3Jlc2V0J1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBzZWFyY2g6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTZcclxuICAgIG5hbWU6ICdzZWFyY2gnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBzdWJtaXQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTdcclxuICAgIG5hbWU6ICdzdWJtaXQnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHRlbDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxOFxyXG4gICAgbmFtZTogJ2J1dHRvbidcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHRleHQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTlcclxuICAgIG5hbWU6ICd0ZXh0J1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB0aW1lOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDIwXHJcbiAgICBuYW1lOiAndGltZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHVybDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMVxyXG4gICAgbmFtZTogJ3VybCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgd2VlazogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMlxyXG4gICAgbmFtZTogJ3dlZWsnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG5PSi5lbnVtcy5yZWdpc3RlciAndW5rbm93bicsIHVua25vd25cclxuT0ouZW51bXMucmVnaXN0ZXIgJ2lucHV0VHlwZXMnLCBpbnB1dFR5cGVzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFxyXG4gIHVua25vd246IHVua25vd25cclxuICBpbnB1dFR5cGVzOiBpbnB1dFR5cGVzIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbmlmIE9KLmdsb2JhbC5hZGRFdmVudExpc3RlbmVyXHJcbiAgZXZlbnROYW1lID0gJ2FkZEV2ZW50TGlzdGVuZXInXHJcbiAgZXZlbnRJbmZvID0gJydcclxuZWxzZSBcclxuICBldmVudE5hbWUgPSAnYXR0YWNoRXZlbnQnXHJcbiAgZXZlbnRJbmZvID0gJ29uJ1xyXG4gIFxyXG5wdXNoU3RhdGUgPSAocGFnZU5hbWUsIGV2ZW50KSAtPlxyXG4gIGlmIHBhZ2VOYW1lXHJcbiAgICAjIGtlZXAgdGhlIGxpbmsgaW4gdGhlIGJyb3dzZXIgaGlzdG9yeVxyXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUgbnVsbCwgbnVsbCwgJyMnICsgcGFnZU5hbWVcclxuICAgICAgXHJcbiAgICAjIGhlcmUgY2FuIGNhdXNlIGRhdGEgbG9hZGluZywgZXRjLlxyXG4gICAgXHJcbiAgICBpZiBldmVudCAgICBcclxuICAgICAgIyBkbyBub3QgZ2l2ZSBhIGRlZmF1bHQgYWN0aW9uXHJcbiAgICAgIGlmIGV2ZW50LnByZXZlbnREZWZhdWx0XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZVxyXG4gIGZhbHNlXHJcbiAgXHJcbnJlc3RvcmVTdGF0ZSA9IChsb2NhdGlvbikgLT5cclxuICBwYWdlTmFtZSA9IGxvY2F0aW9uLmhhc2hcclxuICBpZiBub3QgcGFnZU5hbWVcclxuICAgIHBhZ2VOYW1lID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzFdXHJcbiAgaWYgcGFnZU5hbWVcclxuICAgIHBhZ2VOYW1lID0gcGFnZU5hbWUucmVwbGFjZSAnIycsICcnXHJcbiAgICBPSi5wdWJsaXNoICdyZXN0b3JlU3RhdGUnLCBwYWdlTmFtZTogcGFnZU5hbWUsIGxvY2F0aW9uOiBsb2NhdGlvblxyXG4gIHJldHVyblxyXG4gIFxyXG4jIyMgXHJcbmhhbmcgb24gdGhlIGV2ZW50LCBhbGwgcmVmZXJlbmNlcyBpbiB0aGlzIGRvY3VtZW50XHJcbiMjI1xyXG4gIFxyXG4jIyNcclxuIyBUaGlzIGJpbmRzIHRvIHRoZSBkb2N1bWVudCBjbGljayBldmVudCwgd2hpY2ggaW4gdHVybiBhdHRhY2hlcyB0byBldmVyeSBjbGljayBldmVudCwgY2F1c2luZyB1bmV4cGVjdGVkIGJlaGF2aW9yLlxyXG4jIEZvciBhbnkgY29udHJvbCB3aGljaCB3aXNoZXMgdG8gdHJpZ2dlciBhIHN0YXRlIGNoYW5nZSBpbiByZXNwb25zZSB0byBhbiBldmVudCwgaXQgaXMgYmV0dGVyIGZvciB0aGF0IGNvbnRyb2wgdG8gZGVmaW5lIHRoZSBiZWhhdmlvci5cclxuT0ouZG9jdW1lbnRbZXZlbnROYW1lXSBldmVudEluZm8gKyAnY2xpY2snLCAoKGV2ZW50KSAtPlxyXG4gIGV2ZW50ID0gZXZlbnQgb3Igd2luZG93LmV2ZW50XHJcbiAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IG9yIGV2ZW50LnNyY0VsZW1lbnRcclxuICAgIFxyXG4gICMgbG9va2luZyBmb3IgYWxsIHRoZSBsaW5rcyB3aXRoICdhamF4JyBjbGFzcyBmb3VuZFxyXG4gIGlmIHRhcmdldCBhbmQgdGFyZ2V0Lm5vZGVOYW1lIGlzICdBJyBhbmQgKCcgJyArIHRhcmdldC5jbGFzc05hbWUgKyAnICcpLmluZGV4T2YoJ2FqYXgnKSA+PSAwXHJcbiAgICBPSi5wdXNoU3RhdGUgdGFyZ2V0LmhyZWYsIGV2ZW50XHJcbiAgICAgIFxyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4pLCBmYWxzZVxyXG4jIyNcclxuXHJcbiMjI1xyXG5oYW5nIG9uIHBvcHN0YXRlIGV2ZW50IHRyaWdnZXJlZCBieSBwcmVzc2luZyBiYWNrL2ZvcndhcmQgaW4gYnJvd3NlclxyXG4jIyNcclxuT0ouZ2xvYmFsW2V2ZW50TmFtZV0gZXZlbnRJbmZvICsgJ3BvcHN0YXRlJywgKChldmVudCkgLT5cclxuICAgIFxyXG4gICMgd2UgZ2V0IGEgbm9ybWFsIExvY2F0aW9uIG9iamVjdFxyXG4gICAgXHJcbiAgIyMjXHJcbiAgTm90ZSwgdGhpcyBpcyB0aGUgb25seSBkaWZmZXJlbmNlIHdoZW4gdXNpbmcgdGhpcyBsaWJyYXJ5LFxyXG4gIGJlY2F1c2UgdGhlIG9iamVjdCBkb2N1bWVudC5sb2NhdGlvbiBjYW5ub3QgYmUgb3ZlcnJpZGVuLFxyXG4gIHNvIGxpYnJhcnkgdGhlIHJldHVybnMgZ2VuZXJhdGVkICdsb2NhdGlvbicgb2JqZWN0IHdpdGhpblxyXG4gIGFuIG9iamVjdCB3aW5kb3cuaGlzdG9yeSwgc28gZ2V0IGl0IG91dCBvZiAnaGlzdG9yeS5sb2NhdGlvbicuXHJcbiAgRm9yIGJyb3dzZXJzIHN1cHBvcnRpbmcgJ2hpc3RvcnkucHVzaFN0YXRlJyBnZXQgZ2VuZXJhdGVkXHJcbiAgb2JqZWN0ICdsb2NhdGlvbicgd2l0aCB0aGUgdXN1YWwgJ2RvY3VtZW50LmxvY2F0aW9uJy5cclxuICAjIyMgICAgICAgICAgICAgICAgICAgICBcclxuICByZXR1cm5Mb2NhdGlvbiA9IGhpc3RvcnkubG9jYXRpb24gb3IgZG9jdW1lbnQubG9jYXRpb25cclxuICAgIFxyXG4gICMjI1xyXG4gIGhlcmUgY2FuIGNhdXNlIGRhdGEgbG9hZGluZywgZXRjLlxyXG4gICMjI1xyXG4gIE9KLmhpc3RvcnkucmVzdG9yZVN0YXRlIHJldHVybkxvY2F0aW9uXHJcbiAgICBcclxuICByZXR1cm5cclxuKSwgZmFsc2UgXHJcbiAgXHJcbiBcclxuT0ouaGlzdG9yeS5yZWdpc3RlciAncmVzdG9yZVN0YXRlJywgcmVzdG9yZVN0YXRlXHJcbk9KLmhpc3RvcnkucmVnaXN0ZXIgJ3B1c2hTdGF0ZScsIHB1c2hTdGF0ZVxyXG4gXHJcbm1vZHVsZS5leHBvcnRzID0gXHJcbiAgcmVzdG9yZVN0YXRlOiByZXN0b3JlU3RhdGVcclxuICBwdXNoU3RhdGU6IHB1c2hTdGF0ZVxyXG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCwgSVMsIE9KLCBfO1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbiQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cbl8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG5cbklTID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBJUygpIHt9XG5cbiAgSVMuYm9vbCA9IGZ1bmN0aW9uKGJvb2xlYW4pIHtcbiAgICByZXR1cm4gXy5pc0Jvb2xlYW4oYm9vbGVhbik7XG4gIH07XG5cbiAgSVMuYXJyYXlOdWxsT3JFbXB0eSA9IGZ1bmN0aW9uKGFycikge1xuICAgIHJldHVybiBfLmlzRW1wdHkoYXJyKTtcbiAgfTtcblxuICBJUy5zdHJpbmdOdWxsT3JFbXB0eSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBzdHIgJiYgKCFzdHIubGVuZ3RoIHx8IHN0ci5sZW5ndGggPT09IDAgfHwgIXN0ci50cmltIHx8ICFzdHIudHJpbSgpKTtcbiAgfTtcblxuICBJUy5udW1iZXJOdWxsT3JFbXB0eSA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHJldHVybiAhbnVtIHx8IGlzTmFOKG51bSkgfHwgIW51bS50b1ByZWNpc2lvbjtcbiAgfTtcblxuICBJUy5kYXRlTnVsbE9yRW1wdHkgPSBmdW5jdGlvbihkdCkge1xuICAgIHJldHVybiAhZHQgfHwgIWR0LmdldFRpbWU7XG4gIH07XG5cbiAgSVMub2JqZWN0TnVsbE9yRW1wdHkgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc0VtcHR5KG9iaiB8fCAhT2JqZWN0LmtleXMob2JqKSB8fCBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMCk7XG4gIH07XG5cbiAgSVMucGxhaW5PYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc1BsYWluT2JqZWN0KG9iaik7XG4gIH07XG5cbiAgSVMub2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNPYmplY3Qob2JqKTtcbiAgfTtcblxuICBJUy5kYXRlID0gZnVuY3Rpb24oZHQpIHtcbiAgICByZXR1cm4gXy5pc0RhdGUoZHQpO1xuICB9O1xuXG5cbiAgLypcbiAgRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGFuIGluc3RhbmNlIG9mIGEgTnVtYmVyIGFuZCBub3QgTmFOKlxuICAgKi9cblxuICBJUy5udW1iZXIgPSBmdW5jdGlvbihudW0pIHtcbiAgICB2YXIgbnVtYmVyO1xuICAgIG51bWJlciA9IHJlcXVpcmUoJy4uL2NvcmUvbnVtYmVyJyk7XG4gICAgcmV0dXJuIHR5cGVvZiBudW0gPT09ICdudW1iZXInICYmIGZhbHNlID09PSAobnVtYmVyLmlzTmFOKG51bSkgfHwgZmFsc2UgPT09IG51bWJlci5pc0Zpbml0ZShudW0pIHx8IG51bWJlci5NQVhfVkFMVUUgPT09IG51bSB8fCBudW1iZXIuTUlOX1ZBTFVFID09PSBudW0pO1xuICB9O1xuXG5cbiAgLypcbiAgRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGNvbnZlcnRpYmxlIHRvIGEgTnVtYmVyXG4gICAqL1xuXG4gIElTLm51bWVyaWMgPSBmdW5jdGlvbihudW0pIHtcbiAgICB2YXIgbnVOdW0sIHJldCwgdG87XG4gICAgcmV0ID0gdGhpcy5udW1iZXIobnVtKTtcbiAgICBpZiAoIXJldCkge1xuICAgICAgdG8gPSByZXF1aXJlKCcuL3RvJyk7XG4gICAgICBudU51bSA9IHRvLm51bWJlcihudW0pO1xuICAgICAgcmV0ID0gdGhpcy5udW1iZXIobnVOdW0pO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIElTLmVsZW1lbnRJbkRvbSA9IGZ1bmN0aW9uKGVsZW1lbnRJZCkge1xuICAgIHJldHVybiBmYWxzZSA9PT0gdGhpcy5udWxsT3JFbXB0eShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpKTtcbiAgfTtcblxuICBJUy5hcnJheSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzQXJyYXkob2JqKTtcbiAgfTtcblxuICBJUy5zdHJpbmcgPSBmdW5jdGlvbihzdHIpIHtcbiAgICByZXR1cm4gXy5pc1N0cmluZyhzdHIpO1xuICB9O1xuXG4gIElTW1widHJ1ZVwiXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IHRydWUgfHwgb2JqID09PSAndHJ1ZScgfHwgb2JqID09PSAxIHx8IG9iaiA9PT0gJzEnO1xuICB9O1xuXG4gIElTW1wiZmFsc2VcIl0gPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBmYWxzZSB8fCBvYmogPT09ICdmYWxzZScgfHwgb2JqID09PSAwIHx8IG9iaiA9PT0gJzAnO1xuICB9O1xuXG4gIElTLnRydWVPckZhbHNlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIHRoaXNbXCJ0cnVlXCJdKG9iaiB8fCB0aGlzW1wiZmFsc2VcIl0ob2JqKSk7XG4gIH07XG5cbiAgSVMubnVsbE9yRW1wdHkgPSBmdW5jdGlvbihvYmosIGNoZWNrTGVuZ3RoKSB7XG4gICAgcmV0dXJuIF8uaXNFbXB0eShvYmopIHx8IF8uaXNVbmRlZmluZWQob2JqKSB8fCBfLmlzTnVsbChvYmopIHx8IF8uaXNOYU4ob2JqKTtcbiAgfTtcblxuICBJUy5udWxsT3JVbmRlZmluZWQgPSBmdW5jdGlvbihvYmosIGNoZWNrTGVuZ3RoKSB7XG4gICAgcmV0dXJuIF8uaXNVbmRlZmluZWQob2JqKSB8fCBfLmlzTnVsbChvYmopIHx8IF8uaXNOYU4ob2JqKTtcbiAgfTtcblxuICBJU1tcImluc3RhbmNlb2ZcIl0gPSBmdW5jdGlvbihuYW1lLCBvYmopIHtcbiAgICByZXR1cm4gb2JqLnR5cGUgPT09IG5hbWUgfHwgb2JqIGluc3RhbmNlb2YgbmFtZTtcbiAgfTtcblxuICBJUy5tZXRob2QgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gb2JqICE9PSBPSi5ub29wICYmIF8uaXNGdW5jdGlvbihvYmopO1xuICB9O1xuXG5cbiAgLypcbiAgRGVwcmVjYXRlZC4gTGVmdCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIFVzZSBpcy5tZXRob2QgaW5zdGVhZC5cbiAgICovXG5cbiAgSVMuZnVuYyA9IElTLm1ldGhvZDtcblxuICByZXR1cm4gSVM7XG5cbn0pKCk7XG5cbk9KLnJlZ2lzdGVyKCdpcycsIElTKTtcblxubW9kdWxlLmV4cG9ydHMgPSBJUztcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRngwYjI5c2MxeGNhWE11WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVN4SlFVRkJPenRCUVVGQkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUMEZCVWpzN1FVRkRUQ3hEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCUTBvc1EwRkJRU3hIUVVGSkxFOUJRVUVzUTBGQlVTeFJRVUZTT3p0QlFVVkZPenM3UlVGRlNpeEZRVUZETEVOQlFVRXNTVUZCUkN4SFFVRlBMRk5CUVVNc1QwRkJSRHRYUVVOTUxFTkJRVU1zUTBGQlF5eFRRVUZHTEVOQlFWa3NUMEZCV2p0RlFVUkxPenRGUVVkUUxFVkJRVU1zUTBGQlFTeG5Ra0ZCUkN4SFFVRnRRaXhUUVVGRExFZEJRVVE3VjBGRGFrSXNRMEZCUXl4RFFVRkRMRTlCUVVZc1EwRkJWU3hIUVVGV08wVkJSR2xDT3p0RlFVZHVRaXhGUVVGRExFTkJRVUVzYVVKQlFVUXNSMEZCYjBJc1UwRkJReXhIUVVGRU8xZEJRMnhDTEVkQlFVRXNTVUZCVVN4RFFVRkRMRU5CUVVrc1IwRkJSeXhEUVVGRExFMUJRVklzU1VGQmEwSXNSMEZCUnl4RFFVRkRMRTFCUVVvc1MwRkJZeXhEUVVGb1F5eEpRVUZ4UXl4RFFVRkpMRWRCUVVjc1EwRkJReXhKUVVFM1F5eEpRVUZ4UkN4RFFVRkpMRWRCUVVjc1EwRkJReXhKUVVGS0xFTkJRVUVzUTBGQk1VUTdSVUZFVlRzN1JVRkhjRUlzUlVGQlF5eERRVUZCTEdsQ1FVRkVMRWRCUVc5Q0xGTkJRVU1zUjBGQlJEdFhRVU5zUWl4RFFVRkpMRWRCUVVvc1NVRkJWeXhMUVVGQkxFTkJRVTBzUjBGQlRpeERRVUZZTEVsQlFYbENMRU5CUVVrc1IwRkJSeXhEUVVGRE8wVkJSR1k3TzBWQlIzQkNMRVZCUVVNc1EwRkJRU3hsUVVGRUxFZEJRV3RDTEZOQlFVTXNSVUZCUkR0WFFVTm9RaXhEUVVGSkxFVkJRVW9zU1VGQlZTeERRVUZKTEVWQlFVVXNRMEZCUXp0RlFVUkVPenRGUVVkc1FpeEZRVUZETEVOQlFVRXNhVUpCUVVRc1IwRkJiMElzVTBGQlF5eEhRVUZFTzFkQlEyeENMRU5CUVVNc1EwRkJReXhQUVVGR0xFTkJRVlVzUjBGQlFTeEpRVUZQTEVOQlFVa3NUVUZCVFN4RFFVRkRMRWxCUVZBc1EwRkJXU3hIUVVGYUxFTkJRVmdzU1VGQkswSXNUVUZCVFN4RFFVRkRMRWxCUVZBc1EwRkJXU3hIUVVGYUxFTkJRV2RDTEVOQlFVTXNUVUZCYWtJc1MwRkJNa0lzUTBGQmNFVTdSVUZFYTBJN08wVkJSM0JDTEVWQlFVTXNRMEZCUVN4WFFVRkVMRWRCUVdNc1UwRkJReXhIUVVGRU8xZEJRMW9zUTBGQlF5eERRVUZETEdGQlFVWXNRMEZCWjBJc1IwRkJhRUk3UlVGRVdUczdSVUZIWkN4RlFVRkRMRU5CUVVFc1RVRkJSQ3hIUVVGVExGTkJRVU1zUjBGQlJEdFhRVU5RTEVOQlFVTXNRMEZCUXl4UlFVRkdMRU5CUVZjc1IwRkJXRHRGUVVSUE96dEZRVWRVTEVWQlFVTXNRMEZCUVN4SlFVRkVMRWRCUVU4c1UwRkJReXhGUVVGRU8xZEJRMHdzUTBGQlF5eERRVUZETEUxQlFVWXNRMEZCVXl4RlFVRlVPMFZCUkVzN096dEJRVWxRT3pzN08wVkJSMEVzUlVGQlF5eERRVUZCTEUxQlFVUXNSMEZCVXl4VFFVRkRMRWRCUVVRN1FVRkRVQ3hSUVVGQk8wbEJRVUVzVFVGQlFTeEhRVUZUTEU5QlFVRXNRMEZCVVN4blFrRkJVanRYUVVOVUxFOUJRVThzUjBGQlVDeExRVUZqTEZGQlFXUXNTVUZCTWtJc1MwRkJRU3hMUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFWQXNRMEZCWVN4SFFVRmlMRU5CUVVFc1NVRkJjVUlzUzBGQlFTeExRVUZUTEUxQlFVMHNRMEZCUXl4UlFVRlFMRU5CUVdkQ0xFZEJRV2hDTEVOQlFUbENMRWxCUVhORUxFMUJRVTBzUTBGQlF5eFRRVUZRTEV0QlFXOUNMRWRCUVRGRkxFbEJRV2xHTEUxQlFVMHNRMEZCUXl4VFFVRlFMRXRCUVc5Q0xFZEJRWFJITzBWQlJqZENPenM3UVVGSlZEczdPenRGUVVkQkxFVkJRVU1zUTBGQlFTeFBRVUZFTEVkQlFWVXNVMEZCUXl4SFFVRkVPMEZCUTFJc1VVRkJRVHRKUVVGQkxFZEJRVUVzUjBGQlRTeEpRVUZETEVOQlFVRXNUVUZCUkN4RFFVRlJMRWRCUVZJN1NVRkRUaXhKUVVGQkxFTkJRVThzUjBGQlVEdE5RVU5GTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1RVRkJVanROUVVOTUxFdEJRVUVzUjBGQlVTeEZRVUZGTEVOQlFVTXNUVUZCU0N4RFFVRlZMRWRCUVZZN1RVRkRVaXhIUVVGQkxFZEJRVTBzU1VGQlF5eERRVUZCTEUxQlFVUXNRMEZCVVN4TFFVRlNMRVZCU0ZJN08xZEJTVUU3UlVGT1VUczdSVUZSVml4RlFVRkRMRU5CUVVFc1dVRkJSQ3hIUVVGbExGTkJRVU1zVTBGQlJEdFhRVU5pTEV0QlFVRXNTMEZCVXl4SlFVRkRMRU5CUVVFc1YwRkJSQ3hEUVVGaExGRkJRVkVzUTBGQlF5eGpRVUZVTEVOQlFYZENMRk5CUVhoQ0xFTkJRV0k3UlVGRVNUczdSVUZIWml4RlFVRkRMRU5CUVVFc1MwRkJSQ3hIUVVGUkxGTkJRVU1zUjBGQlJEdFhRVU5PTEVOQlFVTXNRMEZCUXl4UFFVRkdMRU5CUVZVc1IwRkJWanRGUVVSTk96dEZRVWRTTEVWQlFVTXNRMEZCUVN4TlFVRkVMRWRCUVZNc1UwRkJReXhIUVVGRU8xZEJRMUFzUTBGQlF5eERRVUZETEZGQlFVWXNRMEZCVnl4SFFVRllPMFZCUkU4N08wVkJSMVFzUlVGQlF5eERRVUZCTEUxQlFVRXNRMEZCUkN4SFFVRlBMRk5CUVVNc1IwRkJSRHRYUVVOTUxFZEJRVUVzUzBGQlR5eEpRVUZRTEVsQlFXVXNSMEZCUVN4TFFVRlBMRTFCUVhSQ0xFbEJRV2RETEVkQlFVRXNTMEZCVHl4RFFVRjJReXhKUVVFMFF5eEhRVUZCTEV0QlFVODdSVUZFT1VNN08wVkJSMUFzUlVGQlF5eERRVUZCTEU5QlFVRXNRMEZCUkN4SFFVRlJMRk5CUVVNc1IwRkJSRHRYUVVOT0xFZEJRVUVzUzBGQlR5eExRVUZRTEVsQlFXZENMRWRCUVVFc1MwRkJUeXhQUVVGMlFpeEpRVUZyUXl4SFFVRkJMRXRCUVU4c1EwRkJla01zU1VGQk9FTXNSMEZCUVN4TFFVRlBPMFZCUkM5RE96dEZRVWRTTEVWQlFVTXNRMEZCUVN4WFFVRkVMRWRCUVdNc1UwRkJReXhIUVVGRU8xZEJRMW9zU1VGQlF5eERRVUZCTEUxQlFVRXNRMEZCUkN4RFFVRk5MRWRCUVVFc1NVRkJUeXhKUVVGRExFTkJRVUVzVDBGQlFTeERRVUZFTEVOQlFVOHNSMEZCVUN4RFFVRmlPMFZCUkZrN08wVkJSMlFzUlVGQlF5eERRVUZCTEZkQlFVUXNSMEZCWXl4VFFVRkRMRWRCUVVRc1JVRkJUU3hYUVVGT08xZEJRMW9zUTBGQlF5eERRVUZETEU5QlFVWXNRMEZCVlN4SFFVRldMRU5CUVVFc1NVRkJhMElzUTBGQlF5eERRVUZETEZkQlFVWXNRMEZCWXl4SFFVRmtMRU5CUVd4Q0xFbEJRWGRETEVOQlFVTXNRMEZCUXl4TlFVRkdMRU5CUVZNc1IwRkJWQ3hEUVVGNFF5eEpRVUY1UkN4RFFVRkRMRU5CUVVNc1MwRkJSaXhEUVVGUkxFZEJRVkk3UlVGRU4wTTdPMFZCUjJRc1JVRkJReXhEUVVGQkxHVkJRVVFzUjBGQmEwSXNVMEZCUXl4SFFVRkVMRVZCUVUwc1YwRkJUanRYUVVOb1FpeERRVUZETEVOQlFVTXNWMEZCUml4RFFVRmpMRWRCUVdRc1EwRkJRU3hKUVVGelFpeERRVUZETEVOQlFVTXNUVUZCUml4RFFVRlRMRWRCUVZRc1EwRkJkRUlzU1VGQmRVTXNRMEZCUXl4RFFVRkRMRXRCUVVZc1EwRkJVU3hIUVVGU08wVkJSSFpDT3p0RlFVZHNRaXhGUVVGRExFTkJRVUVzV1VGQlFTeERRVUZFTEVkQlFXRXNVMEZCUXl4SlFVRkVMRVZCUVU4c1IwRkJVRHRYUVVOWUxFZEJRVWNzUTBGQlF5eEpRVUZLTEV0QlFWa3NTVUZCV2l4SlFVRnZRaXhIUVVGQkxGbEJRV1U3UlVGRWVFSTdPMFZCUjJJc1JVRkJReXhEUVVGQkxFMUJRVVFzUjBGQlV5eFRRVUZETEVkQlFVUTdWMEZEVUN4SFFVRkJMRXRCUVZNc1JVRkJSU3hEUVVGRExFbEJRVm9zU1VGQmNVSXNRMEZCUXl4RFFVRkRMRlZCUVVZc1EwRkJZU3hIUVVGaU8wVkJSR1E3T3p0QlFVZFVPenM3TzBWQlIwRXNSVUZCUXl4RFFVRkJMRWxCUVVRc1IwRkJVU3hGUVVGRExFTkJRVUU3T3pzN096dEJRVWxZTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1NVRkJXaXhGUVVGclFpeEZRVUZzUWpzN1FVRkRRU3hOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWlJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lUMG9nUFNCeVpYRjFhWEpsSUNjdUxpOXZhaWRjY2x4dUpDQTlJSEpsY1hWcGNtVWdKMnB4ZFdWeWVTZGNjbHh1WHlBOUlISmxjWFZwY21VZ0oyeHZaR0Z6YUNkY2NseHVYSEpjYm1Oc1lYTnpJRWxUWEhKY2JseHlYRzRnSUVCaWIyOXNPaUFvWW05dmJHVmhiaWtnTFQ1Y2NseHVJQ0FnSUY4dWFYTkNiMjlzWldGdUlHSnZiMnhsWVc1Y2NseHVYSEpjYmlBZ1FHRnljbUY1VG5Wc2JFOXlSVzF3ZEhrNklDaGhjbklwSUMwK1hISmNiaUFnSUNCZkxtbHpSVzF3ZEhrZ1lYSnlYSEpjYmx4eVhHNGdJRUJ6ZEhKcGJtZE9kV3hzVDNKRmJYQjBlVG9nS0hOMGNpa2dMVDVjY2x4dUlDQWdJSE4wY2lCaGJtUWdLRzV2ZENCemRISXViR1Z1WjNSb0lHOXlJSE4wY2k1c1pXNW5kR2dnYVhNZ01DQnZjaUJ1YjNRZ2MzUnlMblJ5YVcwZ2IzSWdibTkwSUhOMGNpNTBjbWx0S0NrcFhISmNibHh5WEc0Z0lFQnVkVzFpWlhKT2RXeHNUM0pGYlhCMGVUb2dLRzUxYlNrZ0xUNWNjbHh1SUNBZ0lHNXZkQ0J1ZFcwZ2IzSWdhWE5PWVU0b2JuVnRLU0J2Y2lCdWIzUWdiblZ0TG5SdlVISmxZMmx6YVc5dVhISmNibHh5WEc0Z0lFQmtZWFJsVG5Wc2JFOXlSVzF3ZEhrNklDaGtkQ2tnTFQ1Y2NseHVJQ0FnSUc1dmRDQmtkQ0J2Y2lCdWIzUWdaSFF1WjJWMFZHbHRaVnh5WEc1Y2NseHVJQ0JBYjJKcVpXTjBUblZzYkU5eVJXMXdkSGs2SUNodlltb3BJQzArWEhKY2JpQWdJQ0JmTG1selJXMXdkSGtnYjJKcUlHOXlJRzV2ZENCUFltcGxZM1F1YTJWNWN5aHZZbW9wSUc5eUlFOWlhbVZqZEM1clpYbHpLRzlpYWlrdWJHVnVaM1JvSUdseklEQmNjbHh1WEhKY2JpQWdRSEJzWVdsdVQySnFaV04wT2lBb2IySnFLU0F0UGx4eVhHNGdJQ0FnWHk1cGMxQnNZV2x1VDJKcVpXTjBJRzlpYWx4eVhHNWNjbHh1SUNCQWIySnFaV04wT2lBb2IySnFLU0F0UGx4eVhHNGdJQ0FnWHk1cGMwOWlhbVZqZENCdlltcGNjbHh1WEhKY2JpQWdRR1JoZEdVNklDaGtkQ2tnTFQ1Y2NseHVJQ0FnSUY4dWFYTkVZWFJsSUdSMFhISmNibHh5WEc1Y2NseHVJQ0FqSXlOY2NseHVJQ0JFWlhSbGNtMXBibVZ6SUdsbUlHRWdkbUZzZFdVZ2FYTWdZVzRnYVc1emRHRnVZMlVnYjJZZ1lTQk9kVzFpWlhJZ1lXNWtJRzV2ZENCT1lVNHFYSEpjYmlBZ0l5TWpYSEpjYmlBZ1FHNTFiV0psY2pvZ0tHNTFiU2tnTFQ1Y2NseHVJQ0FnSUc1MWJXSmxjaUE5SUhKbGNYVnBjbVVnSnk0dUwyTnZjbVV2Ym5WdFltVnlKMXh5WEc0Z0lDQWdkSGx3Wlc5bUlHNTFiU0JwY3lBbmJuVnRZbVZ5SnlCaGJtUWdabUZzYzJVZ2FYTWdLRzUxYldKbGNpNXBjMDVoVGlodWRXMHBJRzl5SUdaaGJITmxJR2x6SUc1MWJXSmxjaTVwYzBacGJtbDBaU2h1ZFcwcElHOXlJRzUxYldKbGNpNU5RVmhmVmtGTVZVVWdhWE1nYm5WdElHOXlJRzUxYldKbGNpNU5TVTVmVmtGTVZVVWdhWE1nYm5WdEtWeHlYRzVjY2x4dUlDQWpJeU5jY2x4dUlDQkVaWFJsY20xcGJtVnpJR2xtSUdFZ2RtRnNkV1VnYVhNZ1kyOXVkbVZ5ZEdsaWJHVWdkRzhnWVNCT2RXMWlaWEpjY2x4dUlDQWpJeU5jY2x4dUlDQkFiblZ0WlhKcFl6b2dLRzUxYlNrZ0xUNWNjbHh1SUNBZ0lISmxkQ0E5SUVCdWRXMWlaWElvYm5WdEtWeHlYRzRnSUNBZ2RXNXNaWE56SUhKbGRGeHlYRzRnSUNBZ0lDQjBieUE5SUhKbGNYVnBjbVVnSnk0dmRHOG5YSEpjYmlBZ0lDQWdJRzUxVG5WdElEMGdkRzh1Ym5WdFltVnlLRzUxYlNsY2NseHVJQ0FnSUNBZ2NtVjBJRDBnUUc1MWJXSmxjaWh1ZFU1MWJTbGNjbHh1SUNBZ0lISmxkRnh5WEc1Y2NseHVJQ0JBWld4bGJXVnVkRWx1Ukc5dE9pQW9aV3hsYldWdWRFbGtLU0F0UGx4eVhHNGdJQ0FnWm1Gc2MyVWdhWE1nUUc1MWJHeFBja1Z0Y0hSNUtHUnZZM1Z0Wlc1MExtZGxkRVZzWlcxbGJuUkNlVWxrS0dWc1pXMWxiblJKWkNrcFhISmNibHh5WEc0Z0lFQmhjbkpoZVRvZ0tHOWlhaWtnTFQ1Y2NseHVJQ0FnSUY4dWFYTkJjbkpoZVNCdlltcGNjbHh1WEhKY2JpQWdRSE4wY21sdVp6b2dLSE4wY2lrZ0xUNWNjbHh1SUNBZ0lGOHVhWE5UZEhKcGJtY2djM1J5WEhKY2JseHlYRzRnSUVCMGNuVmxPaUFvYjJKcUtTQXRQbHh5WEc0Z0lDQWdiMkpxSUdseklIUnlkV1VnYjNJZ2IySnFJR2x6SUNkMGNuVmxKeUJ2Y2lCdlltb2dhWE1nTVNCdmNpQnZZbW9nYVhNZ0p6RW5YSEpjYmx4eVhHNGdJRUJtWVd4elpUb2dLRzlpYWlrZ0xUNWNjbHh1SUNBZ0lHOWlhaUJwY3lCbVlXeHpaU0J2Y2lCdlltb2dhWE1nSjJaaGJITmxKeUJ2Y2lCdlltb2dhWE1nTUNCdmNpQnZZbW9nYVhNZ0p6QW5YSEpjYmx4eVhHNGdJRUIwY25WbFQzSkdZV3h6WlRvZ0tHOWlhaWtnTFQ1Y2NseHVJQ0FnSUVCMGNuVmxJRzlpYWlCdmNpQkFabUZzYzJVZ2IySnFYSEpjYmx4eVhHNGdJRUJ1ZFd4c1QzSkZiWEIwZVRvZ0tHOWlhaXdnWTJobFkydE1aVzVuZEdncElDMCtYSEpjYmlBZ0lDQmZMbWx6Ulcxd2RIa29iMkpxS1NCdmNpQmZMbWx6Vlc1a1pXWnBibVZrS0c5aWFpa2diM0lnWHk1cGMwNTFiR3dvYjJKcUtTQnZjaUJmTG1selRtRk9LRzlpYWlsY2NseHVYSEpjYmlBZ1FHNTFiR3hQY2xWdVpHVm1hVzVsWkRvZ0tHOWlhaXdnWTJobFkydE1aVzVuZEdncElDMCtYSEpjYmlBZ0lDQmZMbWx6Vlc1a1pXWnBibVZrS0c5aWFpa2diM0lnWHk1cGMwNTFiR3dvYjJKcUtTQnZjaUJmTG1selRtRk9LRzlpYWlsY2NseHVYSEpjYmlBZ1FHbHVjM1JoYm1ObGIyWTZJQ2h1WVcxbExDQnZZbW9wSUMwK1hISmNiaUFnSUNCdlltb3VkSGx3WlNCcGN5QnVZVzFsSUc5eUlHOWlhaUJwYm5OMFlXNWpaVzltSUc1aGJXVmNjbHh1WEhKY2JpQWdRRzFsZEdodlpEb2dLRzlpYWlrZ0xUNWNjbHh1SUNBZ0lHOWlhaUJwYzI1MElFOUtMbTV2YjNBZ1lXNWtJRjh1YVhOR2RXNWpkR2x2YmlCdlltcGNjbHh1WEhKY2JpQWdJeU1qWEhKY2JpQWdSR1Z3Y21WallYUmxaQzRnVEdWbWRDQm1iM0lnWW1GamEzZGhjbVJ6SUdOdmJYQmhkR2xpYVd4cGRIa3VJRlZ6WlNCcGN5NXRaWFJvYjJRZ2FXNXpkR1ZoWkM1Y2NseHVJQ0FqSXlOY2NseHVJQ0JBWm5WdVl5QTlJRUJ0WlhSb2IyUmNjbHh1WEhKY2JseHlYRzVjY2x4dVQwb3VjbVZuYVhOMFpYSWdKMmx6Snl3Z1NWTmNjbHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JKVTF4eVhHNWNjbHh1SWwxOSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBPSiwgbWFrZU5vdHksIG5vdHk7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxubm90eSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Wydub3R5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydub3R5J10gOiBudWxsKTtcblxubWFrZU5vdHkgPSBmdW5jdGlvbihvcHRpb25zLCBvd25lcikge1xuICB2YXIgZGVmYXVsdHMsIHJldDtcbiAgZGVmYXVsdHMgPSB7XG4gICAgbGF5b3V0OiAndG9wUmlnaHQnLFxuICAgIHRoZW1lOiAnZGVmYXVsdFRoZW1lJyxcbiAgICB0eXBlOiAnYWxlcnQnLFxuICAgIHRleHQ6ICcnLFxuICAgIGRpc21pc3NRdWV1ZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJub3R5X21lc3NhZ2VcIj48c3BhbiBjbGFzcz1cIm5vdHlfdGV4dFwiPjwvc3Bhbj48ZGl2IGNsYXNzPVwibm90eV9jbG9zZVwiPjwvZGl2PjwvZGl2PicsXG4gICAgYW5pbWF0aW9uOiB7XG4gICAgICBvcGVuOiB7XG4gICAgICAgIGhlaWdodDogJ3RvZ2dsZSdcbiAgICAgIH0sXG4gICAgICBjbG9zZToge1xuICAgICAgICBoZWlnaHQ6ICd0b2dnbGUnXG4gICAgICB9LFxuICAgICAgZWFzaW5nOiAnc3dpbmcnLFxuICAgICAgc3BlZWQ6IDUwMFxuICAgIH0sXG4gICAgdGltZW91dDogNTAwMCxcbiAgICBmb3JjZTogZmFsc2UsXG4gICAgbW9kYWw6IGZhbHNlLFxuICAgIG1heFZpc2libGU6IDUsXG4gICAga2lsbGVyOiBmYWxzZSxcbiAgICBjbG9zZVdpdGg6IFsnY2xpY2snXSxcbiAgICBjYWxsYmFjazoge1xuICAgICAgb25TaG93OiBPSi5ub29wLFxuICAgICAgYWZ0ZXJTaG93OiBPSi5ub29wLFxuICAgICAgb25DbG9zZTogT0oubm9vcCxcbiAgICAgIGFmdGVyQ2xvc2U6IE9KLm5vb3BcbiAgICB9LFxuICAgIGJ1dHRvbnM6IGZhbHNlXG4gIH07XG4gIE9KLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZSk7XG4gIHJldCA9IG5vdHkoZGVmYXVsdHMpO1xuICByZXR1cm4gcmV0O1xufTtcblxuT0oubm90aWZpY2F0aW9ucy5yZWdpc3Rlcignbm90eScsIG1ha2VOb3R5KTtcblxubW9kdWxlLmV4cG9ydHMgPSBtYWtlTm90eTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRngwYjI5c2MxeGNibTkwZVM1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVGQkxFbEJRVUU3TzBGQlFVRXNSVUZCUVN4SFFVRkxMRTlCUVVFc1EwRkJVU3hQUVVGU096dEJRVU5NTEVsQlFVRXNSMEZCVHl4UFFVRkJMRU5CUVZFc1RVRkJVanM3UVVGSFVDeFJRVUZCTEVkQlFWY3NVMEZCUXl4UFFVRkVMRVZCUVZVc1MwRkJWanRCUVVOVUxFMUJRVUU3UlVGQlFTeFJRVUZCTEVkQlEwVTdTVUZCUVN4TlFVRkJMRVZCUVZFc1ZVRkJVanRKUVVOQkxFdEJRVUVzUlVGQlR5eGpRVVJRTzBsQlJVRXNTVUZCUVN4RlFVRk5MRTlCUms0N1NVRkhRU3hKUVVGQkxFVkJRVTBzUlVGSVRqdEpRVWxCTEZsQlFVRXNSVUZCWXl4SlFVcGtPMGxCUzBFc1VVRkJRU3hGUVVGVkxDdEdRVXhXTzBsQlRVRXNVMEZCUVN4RlFVTkpPMDFCUVVFc1NVRkJRU3hGUVVORk8xRkJRVUVzVFVGQlFTeEZRVUZSTEZGQlFWSTdUMEZFUmp0TlFVVkJMRXRCUVVFc1JVRkRSVHRSUVVGQkxFMUJRVUVzUlVGQlVTeFJRVUZTTzA5QlNFWTdUVUZKUVN4TlFVRkJMRVZCUVZFc1QwRktVanROUVV0QkxFdEJRVUVzUlVGQlR5eEhRVXhRTzB0QlVFbzdTVUZoUVN4UFFVRkJMRVZCUVZNc1NVRmlWRHRKUVdOQkxFdEJRVUVzUlVGQlR5eExRV1JRTzBsQlpVRXNTMEZCUVN4RlFVRlBMRXRCWmxBN1NVRm5Ra0VzVlVGQlFTeEZRVUZaTEVOQmFFSmFPMGxCYVVKQkxFMUJRVUVzUlVGQlVTeExRV3BDVWp0SlFXdENRU3hUUVVGQkxFVkJRVmNzUTBGQlF5eFBRVUZFTEVOQmJFSllPMGxCYlVKQkxGRkJRVUVzUlVGRFNUdE5RVUZCTEUxQlFVRXNSVUZCVVN4RlFVRkZMRU5CUVVNc1NVRkJXRHROUVVOQkxGTkJRVUVzUlVGQlZ5eEZRVUZGTEVOQlFVTXNTVUZFWkR0TlFVVkJMRTlCUVVFc1JVRkJVeXhGUVVGRkxFTkJRVU1zU1VGR1dqdE5RVWRCTEZWQlFVRXNSVUZCV1N4RlFVRkZMRU5CUVVNc1NVRklaanRMUVhCQ1NqdEpRWGRDUVN4UFFVRkJMRVZCUVZNc1MwRjRRbFE3TzBWQk1FSkdMRVZCUVVVc1EwRkJReXhOUVVGSUxFTkJRVlVzVVVGQlZpeEZRVUZ2UWl4UFFVRndRaXhGUVVFMlFpeEpRVUUzUWp0RlFVTkJMRWRCUVVFc1IwRkJUU3hKUVVGQkxFTkJRVXNzVVVGQlREdFRRVVZPTzBGQkwwSlRPenRCUVdsRFdDeEZRVUZGTEVOQlFVTXNZVUZCWVN4RFFVRkRMRkZCUVdwQ0xFTkJRVEJDTEUxQlFURkNMRVZCUVd0RExGRkJRV3hET3p0QlFVTkJMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SlBTaUE5SUhKbGNYVnBjbVVnSnk0dUwyOXFKMXh5WEc1dWIzUjVJRDBnY21WeGRXbHlaU0FuYm05MGVTZGNjbHh1WEhKY2JpQWdYSEpjYm0xaGEyVk9iM1I1SUQwZ0tHOXdkR2x2Ym5Nc0lHOTNibVZ5S1NBdFBseHlYRzRnSUdSbFptRjFiSFJ6SUQxY2NseHVJQ0FnSUd4aGVXOTFkRG9nSjNSdmNGSnBaMmgwSjF4eVhHNGdJQ0FnZEdobGJXVTZJQ2RrWldaaGRXeDBWR2hsYldVblhISmNiaUFnSUNCMGVYQmxPaUFuWVd4bGNuUW5YSEpjYmlBZ0lDQjBaWGgwT2lBbkp5QWpZMkZ1SUdKbElHaDBiV3dnYjNJZ2MzUnlhVzVuWEhKY2JpQWdJQ0JrYVhOdGFYTnpVWFZsZFdVNklIUnlkV1VnSTBsbUlIbHZkU0IzWVc1MElIUnZJSFZ6WlNCeGRXVjFaU0JtWldGMGRYSmxJSE5sZENCMGFHbHpJSFJ5ZFdWY2NseHVJQ0FnSUhSbGJYQnNZWFJsT2lBblBHUnBkaUJqYkdGemN6MWNJbTV2ZEhsZmJXVnpjMkZuWlZ3aVBqeHpjR0Z1SUdOc1lYTnpQVndpYm05MGVWOTBaWGgwWENJK1BDOXpjR0Z1UGp4a2FYWWdZMnhoYzNNOVhDSnViM1I1WDJOc2IzTmxYQ0krUEM5a2FYWStQQzlrYVhZK0p5eGNjbHh1SUNBZ0lHRnVhVzFoZEdsdmJqb2dYSEpjYmlBZ0lDQWdJQ0FnYjNCbGJqb2dYSEpjYmlBZ0lDQWdJQ0FnSUNCb1pXbG5hSFE2SUNkMGIyZG5iR1VuWEhKY2JpQWdJQ0FnSUNBZ1kyeHZjMlU2SUZ4eVhHNGdJQ0FnSUNBZ0lDQWdhR1ZwWjJoME9pQW5kRzluWjJ4bEoxeHlYRzRnSUNBZ0lDQWdJR1ZoYzJsdVp6b2dKM04zYVc1bkoxeHlYRzRnSUNBZ0lDQWdJSE53WldWa09pQTFNREFnSTI5d1pXNXBibWNnSmlCamJHOXphVzVuSUdGdWFXMWhkR2x2YmlCemNHVmxaRnh5WEc0Z0lDQWdkR2x0Wlc5MWREb2dOVEF3TUNBalpHVnNZWGtnWm05eUlHTnNiM05wYm1jZ1pYWmxiblF1SUZObGRDQm1ZV3h6WlNCbWIzSWdjM1JwWTJ0NUlHNXZkR2xtYVdOaGRHbHZibk5jY2x4dUlDQWdJR1p2Y21ObE9pQm1ZV3h6WlNBallXUmtjeUJ1YjNScFptbGpZWFJwYjI0Z2RHOGdkR2hsSUdKbFoybHVibWx1WnlCdlppQnhkV1YxWlNCM2FHVnVJSE5sZENCMGJ5QjBjblZsWEhKY2JpQWdJQ0J0YjJSaGJEb2dabUZzYzJWY2NseHVJQ0FnSUcxaGVGWnBjMmxpYkdVNklEVWdJM2x2ZFNCallXNGdjMlYwSUcxaGVDQjJhWE5wWW14bElHNXZkR2xtYVdOaGRHbHZiaUJtYjNJZ1pHbHpiV2x6YzFGMVpYVmxJSFJ5ZFdVZ2IzQjBhVzl1TEZ4eVhHNGdJQ0FnYTJsc2JHVnlPaUJtWVd4elpTQWpabTl5SUdOc2IzTmxJR0ZzYkNCdWIzUnBabWxqWVhScGIyNXpJR0psWm05eVpTQnphRzkzWEhKY2JpQWdJQ0JqYkc5elpWZHBkR2c2SUZzblkyeHBZMnNuWFNBZ0kxc25ZMnhwWTJzbkxDQW5ZblYwZEc5dUp5d2dKMmh2ZG1WeUoxMWNjbHh1SUNBZ0lHTmhiR3hpWVdOck9pQmNjbHh1SUNBZ0lDQWdJQ0J2YmxOb2IzYzZJRTlLTG01dmIzQXNYSEpjYmlBZ0lDQWdJQ0FnWVdaMFpYSlRhRzkzT2lCUFNpNXViMjl3WEhKY2JpQWdJQ0FnSUNBZ2IyNURiRzl6WlRvZ1Qwb3VibTl2Y0Z4eVhHNGdJQ0FnSUNBZ0lHRm1kR1Z5UTJ4dmMyVTZJRTlLTG01dmIzQmNjbHh1SUNBZ0lHSjFkSFJ2Ym5NNklHWmhiSE5sSUNOaGJpQmhjbkpoZVNCdlppQmlkWFIwYjI1elhISmNiaUFnSUNCY2NseHVJQ0JQU2k1bGVIUmxibVFnWkdWbVlYVnNkSE1zSUc5d2RHbHZibk1zSUhSeWRXVmNjbHh1SUNCeVpYUWdQU0J1YjNSNUlHUmxabUYxYkhSelhISmNiaUFnSUNBZ0lGeHlYRzRnSUhKbGRGeHlYRzRnSUNBZ1hISmNiazlLTG01dmRHbG1hV05oZEdsdmJuTXVjbVZuYVhOMFpYSWdKMjV2ZEhrbkxDQnRZV3RsVG05MGVWeHlYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRzFoYTJWT2IzUjVJbDE5IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE9KLCBQdWJTdWIsIGV2ZW50cywgcHMsIHN1YnNjcmliZXJzLCB0b2tlbnM7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuUHViU3ViID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1B1YlN1YiddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUHViU3ViJ10gOiBudWxsKTtcblxudG9rZW5zID0ge307XG5cbnN1YnNjcmliZXJzID0gW107XG5cbmV2ZW50cyA9IHt9O1xuXG5wcyA9IHtcbiAgZ2V0RXZlbnROYW1lOiBmdW5jdGlvbihldmVudCkge1xuICAgIHJldHVybiBldmVudC50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoJyAnLCAnXycpO1xuICB9LFxuICBzdWJzY3JpYmU6IGZ1bmN0aW9uKGV2ZW50LCBtZXRob2QpIHtcbiAgICB2YXIgZXZlbnROYW1lLCB0b2tlbjtcbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUoZXZlbnQpO1xuICAgIGlmICghZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIGV2ZW50c1tldmVudE5hbWVdID0gW107XG4gICAgfVxuICAgIHRva2VuID0gUHViU3ViLnN1YnNjcmliZShldmVudE5hbWUsIG1ldGhvZCk7XG4gICAgdG9rZW5zW3Rva2VuXSA9IHRva2VuO1xuICAgIHN1YnNjcmliZXJzLnB1c2gobWV0aG9kKTtcbiAgICBldmVudHNbZXZlbnROYW1lXS5wdXNoKG1ldGhvZCk7XG4gICAgcmV0dXJuIHRva2VuO1xuICB9LFxuICBwdWJsaXNoOiBmdW5jdGlvbihldmVudCwgZGF0YSkge1xuICAgIHZhciBldmVudE5hbWU7XG4gICAgZXZlbnROYW1lID0gcHMuZ2V0RXZlbnROYW1lKGV2ZW50KTtcbiAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIFB1YlN1Yi5wdWJsaXNoKGV2ZW50TmFtZSwgZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE9KLmNvbnNvbGUuaW5mbygnRXZlbnQgbmFtZWQgeycgKyBldmVudCArICd9IGlzIG5vdCByZWNvZ25pemVkLicpO1xuICAgIH1cbiAgfSxcbiAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKHRva2VuT3JNZXRob2QpIHtcbiAgICBpZiAoT0ouaXMubWV0aG9kKHRva2VuT3JNZXRob2QpKSB7XG4gICAgICBpZiAoLTEgIT09IHN1YnNjcmliZXJzLmluZGV4T2YodG9rZW5Pck1ldGhvZCkpIHtcbiAgICAgICAgUHViU3ViLnVuc3Vic2NyaWJlKHRva2VuT3JNZXRob2QpO1xuICAgICAgICBzdWJzY3JpYmVycyA9IF8ucmVtb3ZlKHN1YnNjcmliZXJzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgICByZXR1cm4gbWV0aG9kID09PSB0b2tlbk9yTWV0aG9kO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE9KLmNvbnNvbGUuaW5mbygnRXZlbnQgbWV0aG9kIGlzIG5vdCByZWNvZ25pemVkLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodG9rZW5zW3Rva2VuT3JNZXRob2RdKSB7XG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSh0b2tlbk9yTWV0aG9kKTtcbiAgICAgICAgZGVsZXRlIHRva2Vuc1t0b2tlbk9yTWV0aG9kXTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHVuc3Vic2NyaWJlQWxsOiBmdW5jdGlvbigpIHtcbiAgICBPSi5lYWNoKHRva2VucywgZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgIHJldHVybiB1bnN1YnNjcmliZSh0b2tlbik7XG4gICAgfSk7XG4gICAgc3Vic2NyaWJlcnMgPSBbXTtcbiAgICBldmVudHMgPSB7fTtcbiAgfSxcbiAgdW5zdWJzY3JpYmVFdmVudDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgZXZlbnROYW1lO1xuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZShldmVudCk7XG4gICAgaWYgKGV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICBPSi5lYWNoKGV2ZW50c1tldmVudE5hbWVdLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIHVuc3Vic2NyaWJlKG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgT0ouY29uc29sZS5pbmZvKCdFdmVudCBuYW1lZCB7JyArIGV2ZW50ICsgJ30gaXMgbm90IHJlY29nbml6ZWQuJyk7XG4gICAgfVxuICAgIGRlbGV0ZSBldmVudHNbZXZlbnROYW1lXTtcbiAgfVxufTtcblxuT2JqZWN0LnNlYWwocHMpO1xuXG5PYmplY3QuZnJlZXplKHBzKTtcblxuT0oucmVnaXN0ZXIoJ2dldEV2ZW50TmFtZScsIHBzLmdldEV2ZW50TmFtZSk7XG5cbk9KLnJlZ2lzdGVyKCdwdWJsaXNoJywgcHMucHVibGlzaCk7XG5cbk9KLnJlZ2lzdGVyKCdzdWJzY3JpYmUnLCBwcy5zdWJzY3JpYmUpO1xuXG5PSi5yZWdpc3RlcigndW5zdWJzY3JpYmUnLCBwcy51bnN1YnNjcmliZSk7XG5cbk9KLnJlZ2lzdGVyKCd1bnN1YnNjcmliZUFsbCcsIHBzLnVuc3Vic2NyaWJlQWxsKTtcblxuT0oucmVnaXN0ZXIoJ3Vuc3Vic2NyaWJlRXZlbnQnLCBwcy51bnN1YnNjcmliZUV2ZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSBwcztcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklrTTZYRnh3WVdOcllXZGxjMXhjYjJwY1hITnlZMXhjWTI5bVptVmxYRngwYjI5c2MxeGNjSFZpYzNWaUxtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlFVRXNTVUZCUVRzN1FVRkJRU3hGUVVGQkxFZEJRVXNzVDBGQlFTeERRVUZSTEU5QlFWSTdPMEZCUTB3c1RVRkJRU3hIUVVGVExFOUJRVUVzUTBGQlVTeFhRVUZTT3p0QlFVVlVMRTFCUVVFc1IwRkJVenM3UVVGRFZDeFhRVUZCTEVkQlFXTTdPMEZCUTJRc1RVRkJRU3hIUVVGVE96dEJRVVZVTEVWQlFVRXNSMEZEUlR0RlFVRkJMRmxCUVVFc1JVRkJZeXhUUVVGRExFdEJRVVE3VjBGRFdpeExRVUZMTEVOQlFVTXNWMEZCVGl4RFFVRkJMRU5CUVcxQ0xFTkJRVU1zVDBGQmNFSXNRMEZCTkVJc1IwRkJOVUlzUlVGQmFVTXNSMEZCYWtNN1JVRkVXU3hEUVVGa08wVkJSMEVzVTBGQlFTeEZRVUZYTEZOQlFVTXNTMEZCUkN4RlFVRlJMRTFCUVZJN1FVRkRWQ3hSUVVGQk8wbEJRVUVzVTBGQlFTeEhRVUZaTEVWQlFVVXNRMEZCUXl4WlFVRklMRU5CUVdkQ0xFdEJRV2hDTzBsQlExb3NTVUZCUnl4RFFVRkpMRTFCUVU4c1EwRkJRU3hUUVVGQkxFTkJRV1E3VFVGQk9FSXNUVUZCVHl4RFFVRkJMRk5CUVVFc1EwRkJVQ3hIUVVGdlFpeEhRVUZzUkRzN1NVRkZRU3hMUVVGQkxFZEJRVkVzVFVGQlRTeERRVUZETEZOQlFWQXNRMEZCYVVJc1UwRkJha0lzUlVGQk5FSXNUVUZCTlVJN1NVRkRVaXhOUVVGUExFTkJRVUVzUzBGQlFTeERRVUZRTEVkQlFXZENPMGxCUTJoQ0xGZEJRVmNzUTBGQlF5eEpRVUZhTEVOQlFXbENMRTFCUVdwQ08wbEJRMEVzVFVGQlR5eERRVUZCTEZOQlFVRXNRMEZCVlN4RFFVRkRMRWxCUVd4Q0xFTkJRWFZDTEUxQlFYWkNPMWRCUTBFN1JVRlNVeXhEUVVoWU8wVkJZVUVzVDBGQlFTeEZRVUZUTEZOQlFVTXNTMEZCUkN4RlFVRlJMRWxCUVZJN1FVRkRVQ3hSUVVGQk8wbEJRVUVzVTBGQlFTeEhRVUZaTEVWQlFVVXNRMEZCUXl4WlFVRklMRU5CUVdkQ0xFdEJRV2hDTzBsQlExb3NTVUZCUnl4TlFVRlBMRU5CUVVFc1UwRkJRU3hEUVVGV08wMUJRMFVzVFVGQlRTeERRVUZETEU5QlFWQXNRMEZCWlN4VFFVRm1MRVZCUVRCQ0xFbEJRVEZDTEVWQlJFWTdTMEZCUVN4TlFVRkJPMDFCUjBVc1JVRkJSU3hEUVVGRExFOUJRVThzUTBGQlF5eEpRVUZZTEVOQlFXZENMR1ZCUVVFc1IwRkJhMElzUzBGQmJFSXNSMEZCTUVJc2MwSkJRVEZETEVWQlNFWTdPMFZCUms4c1EwRmlWRHRGUVhGQ1FTeFhRVUZCTEVWQlFXRXNVMEZCUXl4aFFVRkVPMGxCUTFnc1NVRkJSeXhGUVVGRkxFTkJRVU1zUlVGQlJTeERRVUZETEUxQlFVNHNRMEZCWVN4aFFVRmlMRU5CUVVnN1RVRkRSU3hKUVVGSExFTkJRVU1zUTBGQlJDeExRVUZSTEZkQlFWY3NRMEZCUXl4UFFVRmFMRU5CUVc5Q0xHRkJRWEJDTEVOQlFWZzdVVUZEUlN4TlFVRk5MRU5CUVVNc1YwRkJVQ3hEUVVGdFFpeGhRVUZ1UWp0UlFVTkJMRmRCUVVFc1IwRkJZeXhEUVVGRExFTkJRVU1zVFVGQlJpeERRVUZUTEZkQlFWUXNSVUZCYzBJc1UwRkJReXhOUVVGRU8ybENRVUZaTEUxQlFVRXNTMEZCVlR0UlFVRjBRaXhEUVVGMFFpeEZRVVpvUWp0UFFVRkJMRTFCUVVFN1VVRkpSU3hGUVVGRkxFTkJRVU1zVDBGQlR5eERRVUZETEVsQlFWZ3NRMEZCWjBJc2FVTkJRV2hDTEVWQlNrWTdUMEZFUmp0TFFVRkJMRTFCUVVFN1RVRlBSU3hKUVVGSExFMUJRVThzUTBGQlFTeGhRVUZCTEVOQlFWWTdVVUZEUlN4TlFVRk5MRU5CUVVNc1YwRkJVQ3hEUVVGdFFpeGhRVUZ1UWp0UlFVTkJMRTlCUVU4c1RVRkJUeXhEUVVGQkxHRkJRVUVzUlVGR2FFSTdUMEZRUmpzN1JVRkVWeXhEUVhKQ1lqdEZRV3REUVN4alFVRkJMRVZCUVdkQ0xGTkJRVUU3U1VGRFpDeEZRVUZGTEVOQlFVTXNTVUZCU0N4RFFVRlJMRTFCUVZJc1JVRkJaMElzVTBGQlF5eExRVUZFTzJGQlFWY3NWMEZCUVN4RFFVRlpMRXRCUVZvN1NVRkJXQ3hEUVVGb1FqdEpRVU5CTEZkQlFVRXNSMEZCWXp0SlFVTmtMRTFCUVVFc1IwRkJVenRGUVVoTExFTkJiRU5vUWp0RlFYZERRU3huUWtGQlFTeEZRVUZyUWl4VFFVRkRMRXRCUVVRN1FVRkRhRUlzVVVGQlFUdEpRVUZCTEZOQlFVRXNSMEZCV1N4RlFVRkZMRU5CUVVNc1dVRkJTQ3hEUVVGblFpeExRVUZvUWp0SlFVTmFMRWxCUVVjc1RVRkJUeXhEUVVGQkxGTkJRVUVzUTBGQlZqdE5RVU5GTEVWQlFVVXNRMEZCUXl4SlFVRklMRU5CUVZFc1RVRkJUeXhEUVVGQkxGTkJRVUVzUTBGQlppeEZRVUV5UWl4VFFVRkRMRTFCUVVRN1pVRkJXU3hYUVVGQkxFTkJRVmtzVFVGQldqdE5RVUZhTEVOQlFUTkNMRVZCUkVZN1MwRkJRU3hOUVVGQk8wMUJSMFVzUlVGQlJTeERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRllMRU5CUVdkQ0xHVkJRVUVzUjBGQmEwSXNTMEZCYkVJc1IwRkJNRUlzYzBKQlFURkRMRVZCU0VZN08wbEJTVUVzVDBGQlR5eE5RVUZQTEVOQlFVRXNVMEZCUVR0RlFVNUZMRU5CZUVOc1FqczdPMEZCYVVSR0xFMUJRVTBzUTBGQlF5eEpRVUZRTEVOQlFWa3NSVUZCV2pzN1FVRkRRU3hOUVVGTkxFTkJRVU1zVFVGQlVDeERRVUZqTEVWQlFXUTdPMEZCUlVFc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeGpRVUZhTEVWQlFUUkNMRVZCUVVVc1EwRkJReXhaUVVFdlFqczdRVUZEUVN4RlFVRkZMRU5CUVVNc1VVRkJTQ3hEUVVGWkxGTkJRVm9zUlVGQmRVSXNSVUZCUlN4RFFVRkRMRTlCUVRGQ096dEJRVU5CTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1YwRkJXaXhGUVVGNVFpeEZRVUZGTEVOQlFVTXNVMEZCTlVJN08wRkJRMEVzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4aFFVRmFMRVZCUVRKQ0xFVkJRVVVzUTBGQlF5eFhRVUU1UWpzN1FVRkRRU3hGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEdkQ1FVRmFMRVZCUVRoQ0xFVkJRVVVzUTBGQlF5eGpRVUZxUXpzN1FVRkRRU3hGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEd0Q1FVRmFMRVZCUVdkRExFVkJRVVVzUTBGQlF5eG5Ra0ZCYmtNN08wRkJSVUVzVFVGQlRTeERRVUZETEU5QlFWQXNSMEZCYVVJaUxDSm1hV3hsSWpvaVoyVnVaWEpoZEdWa0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJazlLSUQwZ2NtVnhkV2x5WlNBbkxpNHZiMm9uWEhKY2JsQjFZbE4xWWlBOUlISmxjWFZwY21VZ0ozQjFZbk4xWWkxcWN5ZGNjbHh1WEhKY2JuUnZhMlZ1Y3lBOUlIdDlYSEpjYm5OMVluTmpjbWxpWlhKeklEMGdXMTFjY2x4dVpYWmxiblJ6SUQwZ2UzMWNjbHh1WEhKY2JuQnpJRDBnWEhKY2JpQWdaMlYwUlhabGJuUk9ZVzFsT2lBb1pYWmxiblFwSUMwK1hISmNiaUFnSUNCbGRtVnVkQzUwYjFWd2NHVnlRMkZ6WlNncExuSmxjR3hoWTJVZ0p5QW5MQ0FuWHlkY2NseHVYSEpjYmlBZ2MzVmljMk55YVdKbE9pQW9aWFpsYm5Rc0lHMWxkR2h2WkNrZ0xUNWNjbHh1SUNBZ0lHVjJaVzUwVG1GdFpTQTlJSEJ6TG1kbGRFVjJaVzUwVG1GdFpTQmxkbVZ1ZEZ4eVhHNGdJQ0FnYVdZZ2JtOTBJR1YyWlc1MGMxdGxkbVZ1ZEU1aGJXVmRJSFJvWlc0Z1pYWmxiblJ6VzJWMlpXNTBUbUZ0WlYwZ1BTQmJYVnh5WEc1Y2NseHVJQ0FnSUhSdmEyVnVJRDBnVUhWaVUzVmlMbk4xWW5OamNtbGlaU0JsZG1WdWRFNWhiV1VzSUcxbGRHaHZaRnh5WEc0Z0lDQWdkRzlyWlc1elczUnZhMlZ1WFNBOUlIUnZhMlZ1WEhKY2JpQWdJQ0J6ZFdKelkzSnBZbVZ5Y3k1d2RYTm9JRzFsZEdodlpGeHlYRzRnSUNBZ1pYWmxiblJ6VzJWMlpXNTBUbUZ0WlYwdWNIVnphQ0J0WlhSb2IyUmNjbHh1SUNBZ0lIUnZhMlZ1WEhKY2JseHlYRzRnSUhCMVlteHBjMmc2SUNobGRtVnVkQ3dnWkdGMFlTa2dMVDVjY2x4dUlDQWdJR1YyWlc1MFRtRnRaU0E5SUhCekxtZGxkRVYyWlc1MFRtRnRaU0JsZG1WdWRGeHlYRzRnSUNBZ2FXWWdaWFpsYm5SelcyVjJaVzUwVG1GdFpWMWNjbHh1SUNBZ0lDQWdVSFZpVTNWaUxuQjFZbXhwYzJnZ1pYWmxiblJPWVcxbExDQmtZWFJoWEhKY2JpQWdJQ0JsYkhObFhISmNiaUFnSUNBZ0lFOUtMbU52Ym5OdmJHVXVhVzVtYnlBblJYWmxiblFnYm1GdFpXUWdleWNnS3lCbGRtVnVkQ0FySUNkOUlHbHpJRzV2ZENCeVpXTnZaMjVwZW1Wa0xpZGNjbHh1SUNBZ0lISmxkSFZ5Ymx4eVhHNWNjbHh1SUNCMWJuTjFZbk5qY21saVpUb2dLSFJ2YTJWdVQzSk5aWFJvYjJRcElDMCtYSEpjYmlBZ0lDQnBaaUJQU2k1cGN5NXRaWFJvYjJRZ2RHOXJaVzVQY2sxbGRHaHZaRnh5WEc0Z0lDQWdJQ0JwWmlBdE1TQnBjMjUwSUhOMVluTmpjbWxpWlhKekxtbHVaR1Y0VDJZZ2RHOXJaVzVQY2sxbGRHaHZaRnh5WEc0Z0lDQWdJQ0FnSUZCMVlsTjFZaTUxYm5OMVluTmpjbWxpWlNCMGIydGxiazl5VFdWMGFHOWtYSEpjYmlBZ0lDQWdJQ0FnYzNWaWMyTnlhV0psY25NZ1BTQmZMbkpsYlc5MlpTQnpkV0p6WTNKcFltVnljeXdnS0cxbGRHaHZaQ2tnTFQ0Z2JXVjBhRzlrSUdseklIUnZhMlZ1VDNKTlpYUm9iMlJjY2x4dUlDQWdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQWdJRTlLTG1OdmJuTnZiR1V1YVc1bWJ5QW5SWFpsYm5RZ2JXVjBhRzlrSUdseklHNXZkQ0J5WldOdloyNXBlbVZrTGlkY2NseHVJQ0FnSUdWc2MyVmNjbHh1SUNBZ0lDQWdhV1lnZEc5clpXNXpXM1J2YTJWdVQzSk5aWFJvYjJSZFhISmNiaUFnSUNBZ0lDQWdVSFZpVTNWaUxuVnVjM1ZpYzJOeWFXSmxJSFJ2YTJWdVQzSk5aWFJvYjJSY2NseHVJQ0FnSUNBZ0lDQmtaV3hsZEdVZ2RHOXJaVzV6VzNSdmEyVnVUM0pOWlhSb2IyUmRYSEpjYmlBZ0lDQnlaWFIxY201Y2NseHVYSEpjYmlBZ2RXNXpkV0p6WTNKcFltVkJiR3c2SUNncElDMCtYSEpjYmlBZ0lDQlBTaTVsWVdOb0lIUnZhMlZ1Y3l3Z0tIUnZhMlZ1S1NBdFBpQjFibk4xWW5OamNtbGlaU0IwYjJ0bGJseHlYRzRnSUNBZ2MzVmljMk55YVdKbGNuTWdQU0JiWFZ4eVhHNGdJQ0FnWlhabGJuUnpJRDBnZTMxY2NseHVJQ0FnSUhKbGRIVnlibHh5WEc1Y2NseHVJQ0IxYm5OMVluTmpjbWxpWlVWMlpXNTBPaUFvWlhabGJuUXBJQzArWEhKY2JpQWdJQ0JsZG1WdWRFNWhiV1VnUFNCd2N5NW5aWFJGZG1WdWRFNWhiV1VnWlhabGJuUmNjbHh1SUNBZ0lHbG1JR1YyWlc1MGMxdGxkbVZ1ZEU1aGJXVmRYSEpjYmlBZ0lDQWdJRTlLTG1WaFkyZ2daWFpsYm5SelcyVjJaVzUwVG1GdFpWMHNJQ2h0WlhSb2IyUXBJQzArSUhWdWMzVmljMk55YVdKbElHMWxkR2h2WkZ4eVhHNGdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQlBTaTVqYjI1emIyeGxMbWx1Wm04Z0owVjJaVzUwSUc1aGJXVmtJSHNuSUNzZ1pYWmxiblFnS3lBbmZTQnBjeUJ1YjNRZ2NtVmpiMmR1YVhwbFpDNG5YSEpjYmlBZ0lDQmtaV3hsZEdVZ1pYWmxiblJ6VzJWMlpXNTBUbUZ0WlYxY2NseHVJQ0FnSUhKbGRIVnlibHh5WEc1Y2NseHVUMkpxWldOMExuTmxZV3dnY0hOY2NseHVUMkpxWldOMExtWnlaV1Y2WlNCd2MxeHlYRzVjY2x4dVQwb3VjbVZuYVhOMFpYSWdKMmRsZEVWMlpXNTBUbUZ0WlNjc0lIQnpMbWRsZEVWMlpXNTBUbUZ0WlZ4eVhHNVBTaTV5WldkcGMzUmxjaUFuY0hWaWJHbHphQ2NzSUhCekxuQjFZbXhwYzJoY2NseHVUMG91Y21WbmFYTjBaWElnSjNOMVluTmpjbWxpWlNjc0lIQnpMbk4xWW5OamNtbGlaVnh5WEc1UFNpNXlaV2RwYzNSbGNpQW5kVzV6ZFdKelkzSnBZbVVuTENCd2N5NTFibk4xWW5OamNtbGlaVnh5WEc1UFNpNXlaV2RwYzNSbGNpQW5kVzV6ZFdKelkzSnBZbVZCYkd3bkxDQndjeTUxYm5OMVluTmpjbWxpWlVGc2JGeHlYRzVQU2k1eVpXZHBjM1JsY2lBbmRXNXpkV0p6WTNKcFltVkZkbVZ1ZENjc0lIQnpMblZ1YzNWaWMyTnlhV0psUlhabGJuUmNjbHh1WEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2NITWlYWDA9IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuIyMjXHJcbmh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTAxMTE1L2hvdy1jYW4taS1nZXQtcXVlcnktc3RyaW5nLXZhbHVlcy1pbi1qYXZhc2NyaXB0XHJcbiMjI1xyXG5xdWVyeVN0cmluZyA9IChwYXJhbSkgLT5cclxuICByZXQgPSB7fVxyXG4gICAgXHJcbiAgaWYgT0ouZ2xvYmFsLmxvY2F0aW9uXHJcbiAgICBwYXJhbXMgPSAgT0ouZ2xvYmFsLmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkuc3BsaXQgJyYnXHJcbiAgICBpZiBwYXJhbXNcclxuICAgICAgaSA9IDBcclxuICAgICAgd2hpbGUgaSA8IHBhcmFtcy5sZW5ndGhcclxuICAgICAgICBwcm0gPSBwYXJhbXNbaV0uc3BsaXQgJz0nXHJcbiAgICAgICAgaWYgcHJtLmxlbmd0aCBpcyAyIFxyXG4gICAgICAgICAgcmV0W3BybVswXV0gPSBPSi5nbG9iYWwuZGVjb2RlVVJJQ29tcG9uZW50IHBybVsxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpXHJcbiAgICAgICAgaSArPSAxXHJcbiAgcmV0XHJcbiAgICBcclxuT0oucmVnaXN0ZXIgJ3F1ZXJ5U3RyaW5nJyxxdWVyeVN0cmluZ1xyXG5tb2R1bGUuZXhwb3J0cyA9IHF1ZXJ5U3RyaW5nIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE9KLCBfLCBlYWNoLCBvYmosIHJuZyxcbiAgc2xpY2UgPSBbXS5zbGljZTtcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5vYmogPSByZXF1aXJlKCcuLi9jb3JlL29iamVjdCcpO1xuXG5lYWNoID0gcmVxdWlyZSgnLi9lYWNoJyk7XG5cbnJuZyA9IHtcbiAgcmFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJhbXM7XG4gICAgcGFyYW1zID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgcmV0dXJuIF8ucmFuZ2UuYXBwbHkoXywgcGFyYW1zKTtcbiAgfSxcbiAgcmFuZ2VNaW46IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJhbXM7XG4gICAgcGFyYW1zID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgcmV0dXJuIF8ubWluLmFwcGx5KF8sIHBhcmFtcyk7XG4gIH0sXG4gIHJhbmdlTWF4OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFyYW1zO1xuICAgIHBhcmFtcyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgIHJldHVybiBfLm1heC5hcHBseShfLCBwYXJhbXMpO1xuICB9LFxuXG4gIC8qXG4gIFRha2UgYW4gYXJyYXkgb2Ygc3RyaW5nIHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXG4gIFVzZXMgdGhlIGZpcnN0IGxldHRlciBvZiBlYWNoIHN0cmluZyB2YWx1ZSBpbiB0aGUgYXJyYXkgdG8gY29udmVydCB0byB1bmlxdWUgY29kZSBjaGFyYWN0ZXIgKGxvd2VyIGNhc2UpXG4gIEJ1aWxkcyBhIGludCByYW5nZSBiYXNlZCBvbiB1bmlxdWUgY29kZSBjaGFycy5cbiAgICovXG4gIHN0cmluZ1RvU3ViUmFuZ2VzOiBmdW5jdGlvbihuLCByYW5nZSkge1xuICAgIHZhciBjaGFyUmFuZ2UsIGksIG9sZEdldFJhbmdlLCByZXQsIHN1YlJhbmdlO1xuICAgIGlmIChuID09IG51bGwpIHtcbiAgICAgIG4gPSA2O1xuICAgIH1cbiAgICBpZiAocmFuZ2UgPT0gbnVsbCkge1xuICAgICAgcmFuZ2UgPSBbXTtcbiAgICB9XG4gICAgY2hhclJhbmdlID0gW107XG4gICAgZWFjaChyYW5nZSwgZnVuY3Rpb24odmFsKSB7XG4gICAgICB2YXIgY2hhcjtcbiAgICAgIGNoYXIgPSB2YWwudHJpbSgpWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoZmFsc2UgPT09IG9iai5jb250YWlucyhjaGFyUmFuZ2UsIGNoYXIpKSB7XG4gICAgICAgIHJldHVybiBjaGFyUmFuZ2UucHVzaChjaGFyLmNoYXJDb2RlQXQoKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0ID0gcm5nLnRvU3ViUmFuZ2VzKG4sIGNoYXJSYW5nZSk7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBuKSB7XG4gICAgICBpICs9IDE7XG4gICAgICBzdWJSYW5nZSA9IHJldFtpXTtcbiAgICAgIHN1YlJhbmdlLm1hcChTdHJpbmcuZnJvbUNoYXJDb2RlKTtcbiAgICB9XG4gICAgb2xkR2V0UmFuZ2UgPSByZXQuZ2V0UmFuZ2U7XG4gICAgcmV0LmdldFJhbmdlID0gZnVuY3Rpb24odmFsKSB7XG4gICAgICB2YXIgY2hhciwgaWR4O1xuICAgICAgY2hhciA9IHZhbC50cmltKClbMF0udG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KCk7XG4gICAgICBpZHggPSBvbGRHZXRSYW5nZShjaGFyKTtcbiAgICAgIHJldHVybiBpZHg7XG4gICAgfTtcbiAgICByZXR1cm4gcmV0O1xuICB9LFxuXG4gIC8qXG4gIFRha2UgYW4gYXJyYXkgb2YgaW50IHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXG4gIERpdmlkZXMgdGhlIG9yaWdpbmFsIGFycmF5IGludG8gdGhlIHNwZWNpZmllZCBudW1iZXIgb2Ygc3ViIGFycmF5cy5cbiAgT3ZlcmZsb3cgaXMgcGFzc2VkIHRvIHRoZSBmaW5hbCBwYXJ0aXRpb24uXG4gICAqL1xuICB0b1N1YlJhbmdlczogZnVuY3Rpb24obiwgcmFuZ2UpIHtcbiAgICB2YXIgY2h1bmtWYWwsIGRpc3RhbmNlLCBpLCBqdW1wLCBtYXAsIHJhbmdlSGlnaCwgcmFuZ2VMb3csIHJldCwgc3ViUmFuZ2UsIHN1YlJhbmdlU2l6ZSwgc3ViUmFuZ2VzO1xuICAgIGlmIChuID09IG51bGwpIHtcbiAgICAgIG4gPSA2O1xuICAgIH1cbiAgICBpZiAocmFuZ2UgPT0gbnVsbCkge1xuICAgICAgcmFuZ2UgPSBbXTtcbiAgICB9XG4gICAgcmV0ID0gb2JqLm9iamVjdCgpO1xuICAgIHJhbmdlTG93ID0gcm5nLnJhbmdlTWluKHJhbmdlKTtcbiAgICByYW5nZUhpZ2ggPSBybmcucmFuZ2VNYXgocmFuZ2UpO1xuICAgIGRpc3RhbmNlID0gcmFuZ2VIaWdoIC0gcmFuZ2VMb3c7XG4gICAgc3ViUmFuZ2VTaXplID0gZGlzdGFuY2UgLyBuO1xuICAgIHN1YlJhbmdlcyA9IHJldC5hZGQoJ3JhbmdlcycsIG9iai5vYmplY3QoKSk7XG4gICAgY2h1bmtWYWwgPSByYW5nZUxvdztcbiAgICBtYXAgPSBvYmoub2JqZWN0KCk7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBuKSB7XG4gICAgICBpICs9IDE7XG4gICAgICBpZiAoaSA8IG4pIHtcbiAgICAgICAganVtcCA9IE1hdGgucm91bmQoc3ViUmFuZ2VTaXplKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGp1bXAgPSBNYXRoLmZsb29yKHN1YlJhbmdlU2l6ZSk7XG4gICAgICAgIGlmIChjaHVua1ZhbCArIGp1bXAgPD0gcmFuZ2VIaWdoKSB7XG4gICAgICAgICAganVtcCArPSByYW5nZUhpZ2ggLSBjaHVua1ZhbCAtIGp1bXAgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdWJSYW5nZSA9IHJuZy5yYW5nZShjaHVua1ZhbCwgY2h1bmtWYWwgKyBqdW1wKTtcbiAgICAgIGVhY2goc3ViUmFuZ2UsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICByZXR1cm4gbWFwLmFkZCh2YWwsIGkpO1xuICAgICAgfSk7XG4gICAgICBzdWJSYW5nZXNbaV0gPSBzdWJSYW5nZTtcbiAgICAgIGNodW5rVmFsICs9IGp1bXA7XG4gICAgfVxuICAgIHJldC5hZGQoJ2dldFJhbmdlJywgZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4gbWFwW3ZhbF07XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxufTtcblxuT2JqZWN0LnNlYWwocm5nKTtcblxuT2JqZWN0LmZyZWV6ZShybmcpO1xuXG5PSi5yZWdpc3RlcigncmFuZ2VzJywgcm5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBybmc7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4MGIyOXNjMXhjY21GdVoyVnpMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJRVUVzU1VGQlFTeHhRa0ZCUVR0RlFVRkJPenRCUVVGQkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUMEZCVWpzN1FVRkRUQ3hEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCUTBvc1IwRkJRU3hIUVVGTkxFOUJRVUVzUTBGQlVTeG5Ra0ZCVWpzN1FVRkRUaXhKUVVGQkxFZEJRVThzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCU1ZBc1IwRkJRU3hIUVVsRk8wVkJRVUVzUzBGQlFTeEZRVUZQTEZOQlFVRTdRVUZEVEN4UlFVRkJPMGxCUkUwN1YwRkRUaXhEUVVGRExFTkJRVU1zUzBGQlJpeFZRVUZSTEUxQlFWSTdSVUZFU3l4RFFVRlFPMFZCUzBFc1VVRkJRU3hGUVVGVkxGTkJRVUU3UVVGRFVpeFJRVUZCTzBsQlJGTTdWMEZEVkN4RFFVRkRMRU5CUVVNc1IwRkJSaXhWUVVGTkxFMUJRVTQ3UlVGRVVTeERRVXhXTzBWQlZVRXNVVUZCUVN4RlFVRlZMRk5CUVVFN1FVRkRVaXhSUVVGQk8wbEJSRk03VjBGRFZDeERRVUZETEVOQlFVTXNSMEZCUml4VlFVRk5MRTFCUVU0N1JVRkVVU3hEUVZaV096dEJRV05CT3pzN096dEZRVXRCTEdsQ1FVRkJMRVZCUVcxQ0xGTkJRVU1zUTBGQlJDeEZRVUZSTEV0QlFWSTdRVUZEYWtJc1VVRkJRVHM3VFVGRWEwSXNTVUZCU1RzN08wMUJRVWNzVVVGQlVUczdTVUZEYWtNc1UwRkJRU3hIUVVGWk8wbEJSMW9zU1VGQlFTeERRVUZMTEV0QlFVd3NSVUZCV1N4VFFVRkRMRWRCUVVRN1FVRkRWaXhWUVVGQk8wMUJRVUVzU1VGQlFTeEhRVUZQTEVkQlFVY3NRMEZCUXl4SlFVRktMRU5CUVVFc1EwRkJWeXhEUVVGQkxFTkJRVUVzUTBGQlJTeERRVUZETEZkQlFXUXNRMEZCUVR0TlFVTlFMRWxCUVVjc1MwRkJRU3hMUVVGVExFZEJRVWNzUTBGQlF5eFJRVUZLTEVOQlFXRXNVMEZCWWl4RlFVRjNRaXhKUVVGNFFpeERRVUZhTzJWQlEwVXNVMEZCVXl4RFFVRkRMRWxCUVZZc1EwRkJaU3hKUVVGSkxFTkJRVU1zVlVGQlRDeERRVUZCTEVOQlFXWXNSVUZFUmpzN1NVRkdWU3hEUVVGYU8wbEJTMEVzUjBGQlFTeEhRVUZOTEVkQlFVY3NRMEZCUXl4WFFVRktMRU5CUVdkQ0xFTkJRV2hDTEVWQlFXMUNMRk5CUVc1Q08wbEJSVTRzUTBGQlFTeEhRVUZKTzBGQlEwb3NWMEZCVFN4RFFVRkJMRWRCUVVrc1EwRkJWanROUVVORkxFTkJRVUVzU1VGQlN6dE5RVU5NTEZGQlFVRXNSMEZCVnl4SFFVRkpMRU5CUVVFc1EwRkJRVHROUVVObUxGRkJRVkVzUTBGQlF5eEhRVUZVTEVOQlFXRXNUVUZCVFN4RFFVRkRMRmxCUVhCQ08wbEJTRVk3U1VGTFFTeFhRVUZCTEVkQlFXTXNSMEZCUnl4RFFVRkRPMGxCUTJ4Q0xFZEJRVWNzUTBGQlF5eFJRVUZLTEVkQlFXVXNVMEZCUXl4SFFVRkVPMEZCUTJJc1ZVRkJRVHROUVVGQkxFbEJRVUVzUjBGQlR5eEhRVUZITEVOQlFVTXNTVUZCU2l4RFFVRkJMRU5CUVZjc1EwRkJRU3hEUVVGQkxFTkJRVVVzUTBGQlF5eFhRVUZrTEVOQlFVRXNRMEZCTWtJc1EwRkJReXhWUVVFMVFpeERRVUZCTzAxQlExQXNSMEZCUVN4SFFVRk5MRmRCUVVFc1EwRkJXU3hKUVVGYU8yRkJRMDQ3U1VGSVlUdFhRVWxtTzBWQmRFSnBRaXhEUVc1Q2JrSTdPMEZCTkVOQk96czdPenRGUVV0QkxGZEJRVUVzUlVGQllTeFRRVUZETEVOQlFVUXNSVUZCVVN4TFFVRlNPMEZCUTFnc1VVRkJRVHM3VFVGRVdTeEpRVUZKT3pzN1RVRkJSeXhSUVVGUk96dEpRVU16UWl4SFFVRkJMRWRCUVUwc1IwRkJSeXhEUVVGRExFMUJRVW9zUTBGQlFUdEpRVU5PTEZGQlFVRXNSMEZCVnl4SFFVRkhMRU5CUVVNc1VVRkJTaXhEUVVGaExFdEJRV0k3U1VGRFdDeFRRVUZCTEVkQlFWa3NSMEZCUnl4RFFVRkRMRkZCUVVvc1EwRkJZU3hMUVVGaU8wbEJSVm9zVVVGQlFTeEhRVUZYTEZOQlFVRXNSMEZCV1R0SlFVTjJRaXhaUVVGQkxFZEJRV1VzVVVGQlFTeEhRVUZUTzBsQlEzaENMRk5CUVVFc1IwRkJXU3hIUVVGSExFTkJRVU1zUjBGQlNpeERRVUZSTEZGQlFWSXNSVUZCYTBJc1IwRkJSeXhEUVVGRExFMUJRVW9zUTBGQlFTeERRVUZzUWp0SlFVTmFMRkZCUVVFc1IwRkJWenRKUVVWWUxFZEJRVUVzUjBGQlRTeEhRVUZITEVOQlFVTXNUVUZCU2l4RFFVRkJPMGxCUlU0c1EwRkJRU3hIUVVGSk8wRkJRMG9zVjBGQlRTeERRVUZCTEVkQlFVa3NRMEZCVmp0TlFVTkZMRU5CUVVFc1NVRkJTenROUVVOTUxFbEJRVWNzUTBGQlFTeEhRVUZKTEVOQlFWQTdVVUZCWXl4SlFVRkJMRWRCUVU4c1NVRkJTU3hEUVVGRExFdEJRVXdzUTBGQlZ5eFpRVUZZTEVWQlFYSkNPMDlCUVVFc1RVRkJRVHRSUVVWRkxFbEJRVUVzUjBGQlR5eEpRVUZKTEVOQlFVTXNTMEZCVEN4RFFVRlhMRmxCUVZnN1VVRkRVQ3hKUVVGSExGRkJRVUVzUjBGQlZ5eEpRVUZZTEVsQlFXMUNMRk5CUVhSQ08xVkJRMFVzU1VGQlFTeEpRVUZSTEZOQlFVRXNSMEZCV1N4UlFVRmFMRWRCUVhWQ0xFbEJRWFpDTEVkQlFUaENMRVZCUkhoRE8xTkJTRVk3TzAxQlRVRXNVVUZCUVN4SFFVRlhMRWRCUVVjc1EwRkJReXhMUVVGS0xFTkJRVlVzVVVGQlZpeEZRVUZ2UWl4UlFVRkJMRWRCUVZjc1NVRkJMMEk3VFVGRFdDeEpRVUZCTEVOQlFVc3NVVUZCVEN4RlFVRmxMRk5CUVVNc1IwRkJSRHRsUVVGVExFZEJRVWNzUTBGQlF5eEhRVUZLTEVOQlFWRXNSMEZCVWl4RlFVRmhMRU5CUVdJN1RVRkJWQ3hEUVVGbU8wMUJRMEVzVTBGQlZTeERRVUZCTEVOQlFVRXNRMEZCVml4SFFVRmxPMDFCUTJZc1VVRkJRU3hKUVVGWk8wbEJXR1E3U1VGaFFTeEhRVUZITEVOQlFVTXNSMEZCU2l4RFFVRlJMRlZCUVZJc1JVRkJiMElzVTBGQlF5eEhRVUZFTzJGQlEyeENMRWRCUVVrc1EwRkJRU3hIUVVGQk8wbEJSR01zUTBGQmNFSTdWMEZIUVR0RlFUZENWeXhEUVdwRVlqczdPMEZCWjBaR0xFMUJRVTBzUTBGQlF5eEpRVUZRTEVOQlFWa3NSMEZCV2pzN1FVRkRRU3hOUVVGTkxFTkJRVU1zVFVGQlVDeERRVUZqTEVkQlFXUTdPMEZCUlVFc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeFJRVUZhTEVWQlFYTkNMRWRCUVhSQ096dEJRVU5CTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUVdsQ0lpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpQU2lBOUlISmxjWFZwY21VZ0p5NHVMMjlxSjF4eVhHNWZJRDBnY21WeGRXbHlaU0FuYkc5a1lYTm9KMXh5WEc1dlltb2dQU0J5WlhGMWFYSmxJQ2N1TGk5amIzSmxMMjlpYW1WamRDZGNjbHh1WldGamFDQTlJSEpsY1hWcGNtVWdKeTR2WldGamFDZGNjbHh1WEhKY2JpTWdJeUJ5WVc1blpYTmNjbHh1WEhKY2JuSnVaeUE5WEhKY2JseHlYRzRnSUNNZ0l5TWdjbUZ1WjJWY2NseHVJQ0FqSUZWemFXNW5JRnRNYnkxRVlYTm9YU2hvZEhSd09pOHZiRzlrWVhOb0xtTnZiUzlrYjJOekkzSmhibWRsS1NkeklHQnlZVzVuWldBZ2JXVjBhRzlrWEhKY2JpQWdjbUZ1WjJVNklDaHdZWEpoYlhNdUxpNHBJQzArWEhKY2JpQWdJQ0JmTG5KaGJtZGxJSEJoY21GdGN5NHVMbHh5WEc1Y2NseHVJQ0FqSUNNaklISmhibWRsVFdsdVhISmNiaUFnSXlCVmMybHVaeUJiVEc4dFJHRnphRjBvYUhSMGNEb3ZMMnh2WkdGemFDNWpiMjB2Wkc5amN5TnRhVzRwSjNNZ1lHMXBibUFnYldWMGFHOWtYSEpjYmlBZ2NtRnVaMlZOYVc0NklDaHdZWEpoYlhNdUxpNHBJQzArWEhKY2JpQWdJQ0JmTG0xcGJpQndZWEpoYlhNdUxpNWNjbHh1WEhKY2JpQWdJeUFqSXlCeVlXNW5aVTFoZUZ4eVhHNGdJQ01nVlhOcGJtY2dXMHh2TFVSaGMyaGRLR2gwZEhBNkx5OXNiMlJoYzJndVkyOXRMMlJ2WTNNamJXRjRLU2R6SUdCdFlYaGdJRzFsZEdodlpGeHlYRzRnSUhKaGJtZGxUV0Y0T2lBb2NHRnlZVzF6TGk0dUtTQXRQbHh5WEc0Z0lDQWdYeTV0WVhnZ2NHRnlZVzF6TGk0dVhISmNibHh5WEc0Z0lDTWdJeU1nYzNSeWFXNW5VbUZ1WjJWVWIxTjFZbEpoYm1kbGMxeHlYRzRnSUNNakkxeHlYRzRnSUZSaGEyVWdZVzRnWVhKeVlYa2diMllnYzNSeWFXNW5JSFpoYkhWbGN5QmhibVFnWVNCdWRXMWlaWElnYjJZZ2NHRnlkR2wwYVc5dWN5QjBieUJqY21WaGRHVXVYSEpjYmlBZ1ZYTmxjeUIwYUdVZ1ptbHljM1FnYkdWMGRHVnlJRzltSUdWaFkyZ2djM1J5YVc1bklIWmhiSFZsSUdsdUlIUm9aU0JoY25KaGVTQjBieUJqYjI1MlpYSjBJSFJ2SUhWdWFYRjFaU0JqYjJSbElHTm9ZWEpoWTNSbGNpQW9iRzkzWlhJZ1kyRnpaU2xjY2x4dUlDQkNkV2xzWkhNZ1lTQnBiblFnY21GdVoyVWdZbUZ6WldRZ2IyNGdkVzVwY1hWbElHTnZaR1VnWTJoaGNuTXVYSEpjYmlBZ0l5TWpYSEpjYmlBZ2MzUnlhVzVuVkc5VGRXSlNZVzVuWlhNNklDaHVJRDBnTml3Z2NtRnVaMlVnUFNCYlhTa2dMVDVjY2x4dUlDQWdJR05vWVhKU1lXNW5aU0E5SUZ0ZFhISmNibHh5WEc1Y2NseHVJQ0FnSUdWaFkyZ2djbUZ1WjJVc0lDaDJZV3dwSUMwK1hISmNiaUFnSUNBZ0lHTm9ZWElnUFNCMllXd3VkSEpwYlNncFd6QmRMblJ2VEc5M1pYSkRZWE5sS0NsY2NseHVJQ0FnSUNBZ2FXWWdabUZzYzJVZ2FYTWdiMkpxTG1OdmJuUmhhVzV6SUdOb1lYSlNZVzVuWlN3Z1kyaGhjbHh5WEc0Z0lDQWdJQ0FnSUdOb1lYSlNZVzVuWlM1d2RYTm9JR05vWVhJdVkyaGhja052WkdWQmRDZ3BYSEpjYmx4eVhHNGdJQ0FnY21WMElEMGdjbTVuTG5SdlUzVmlVbUZ1WjJWeklHNHNJR05vWVhKU1lXNW5aVnh5WEc1Y2NseHVJQ0FnSUdrZ1BTQXdYSEpjYmlBZ0lDQjNhR2xzWlNCcElEd2dibHh5WEc0Z0lDQWdJQ0JwSUNzOUlERmNjbHh1SUNBZ0lDQWdjM1ZpVW1GdVoyVWdQU0J5WlhSYmFWMWNjbHh1SUNBZ0lDQWdjM1ZpVW1GdVoyVXViV0Z3SUZOMGNtbHVaeTVtY205dFEyaGhja052WkdWY2NseHVYSEpjYmlBZ0lDQnZiR1JIWlhSU1lXNW5aU0E5SUhKbGRDNW5aWFJTWVc1blpWeHlYRzRnSUNBZ2NtVjBMbWRsZEZKaGJtZGxJRDBnS0haaGJDa2dMVDVjY2x4dUlDQWdJQ0FnWTJoaGNpQTlJSFpoYkM1MGNtbHRLQ2xiTUYwdWRHOU1iM2RsY2tOaGMyVW9LUzVqYUdGeVEyOWtaVUYwS0NsY2NseHVJQ0FnSUNBZ2FXUjRJRDBnYjJ4a1IyVjBVbUZ1WjJVZ1kyaGhjbHh5WEc0Z0lDQWdJQ0JwWkhoY2NseHVJQ0FnSUhKbGRGeHlYRzVjY2x4dUlDQWpJQ01qSUhKaGJtZGxWRzlUZFdKU1lXNW5aWE5jY2x4dUlDQWpJeU5jY2x4dUlDQlVZV3RsSUdGdUlHRnljbUY1SUc5bUlHbHVkQ0IyWVd4MVpYTWdZVzVrSUdFZ2JuVnRZbVZ5SUc5bUlIQmhjblJwZEdsdmJuTWdkRzhnWTNKbFlYUmxMbHh5WEc0Z0lFUnBkbWxrWlhNZ2RHaGxJRzl5YVdkcGJtRnNJR0Z5Y21GNUlHbHVkRzhnZEdobElITndaV05wWm1sbFpDQnVkVzFpWlhJZ2IyWWdjM1ZpSUdGeWNtRjVjeTVjY2x4dUlDQlBkbVZ5Wm14dmR5QnBjeUJ3WVhOelpXUWdkRzhnZEdobElHWnBibUZzSUhCaGNuUnBkR2x2Ymk1Y2NseHVJQ0FqSXlOY2NseHVJQ0IwYjFOMVlsSmhibWRsY3pvZ0tHNGdQU0EyTENCeVlXNW5aU0E5SUZ0ZEtTQXRQbHh5WEc0Z0lDQWdjbVYwSUQwZ2IySnFMbTlpYW1WamRDZ3BYSEpjYmlBZ0lDQnlZVzVuWlV4dmR5QTlJSEp1Wnk1eVlXNW5aVTFwYmlCeVlXNW5aVnh5WEc0Z0lDQWdjbUZ1WjJWSWFXZG9JRDBnY201bkxuSmhibWRsVFdGNElISmhibWRsWEhKY2JseHlYRzRnSUNBZ1pHbHpkR0Z1WTJVZ1BTQnlZVzVuWlVocFoyZ2dMU0J5WVc1blpVeHZkMXh5WEc0Z0lDQWdjM1ZpVW1GdVoyVlRhWHBsSUQwZ1pHbHpkR0Z1WTJVdmJseHlYRzRnSUNBZ2MzVmlVbUZ1WjJWeklEMGdjbVYwTG1Ga1pDQW5jbUZ1WjJWekp5d2diMkpxTG05aWFtVmpkQ2dwWEhKY2JpQWdJQ0JqYUhWdWExWmhiQ0E5SUhKaGJtZGxURzkzWEhKY2JseHlYRzRnSUNBZ2JXRndJRDBnYjJKcUxtOWlhbVZqZENncFhISmNibHh5WEc0Z0lDQWdhU0E5SURCY2NseHVJQ0FnSUhkb2FXeGxJR2tnUENCdVhISmNiaUFnSUNBZ0lHa2dLejBnTVZ4eVhHNGdJQ0FnSUNCcFppQnBJRHdnYmlCMGFHVnVJR3AxYlhBZ1BTQk5ZWFJvTG5KdmRXNWtJSE4xWWxKaGJtZGxVMmw2WlZ4eVhHNGdJQ0FnSUNCbGJITmxYSEpjYmlBZ0lDQWdJQ0FnYW5WdGNDQTlJRTFoZEdndVpteHZiM0lnYzNWaVVtRnVaMlZUYVhwbFhISmNiaUFnSUNBZ0lDQWdhV1lnWTJoMWJtdFdZV3dnS3lCcWRXMXdJRHc5SUhKaGJtZGxTR2xuYUZ4eVhHNGdJQ0FnSUNBZ0lDQWdhblZ0Y0NBclBTQnlZVzVuWlVocFoyZ2dMU0JqYUhWdWExWmhiQ0F0SUdwMWJYQWdLeUF4WEhKY2JseHlYRzRnSUNBZ0lDQnpkV0pTWVc1blpTQTlJSEp1Wnk1eVlXNW5aU0JqYUhWdWExWmhiQ3dnWTJoMWJtdFdZV3dnS3lCcWRXMXdYSEpjYmlBZ0lDQWdJR1ZoWTJnZ2MzVmlVbUZ1WjJVc0lDaDJZV3dwSUMwK0lHMWhjQzVoWkdRZ2RtRnNMQ0JwWEhKY2JpQWdJQ0FnSUhOMVlsSmhibWRsYzF0cFhTQTlJSE4xWWxKaGJtZGxYSEpjYmlBZ0lDQWdJR05vZFc1clZtRnNJQ3M5SUdwMWJYQmNjbHh1WEhKY2JpQWdJQ0J5WlhRdVlXUmtJQ2RuWlhSU1lXNW5aU2NzSUNoMllXd3BJQzArWEhKY2JpQWdJQ0FnSUcxaGNGdDJZV3hkWEhKY2JseHlYRzRnSUNBZ2NtVjBYSEpjYmx4eVhHNVBZbXBsWTNRdWMyVmhiQ0J5Ym1kY2NseHVUMkpxWldOMExtWnlaV1Y2WlNCeWJtZGNjbHh1WEhKY2JrOUtMbkpsWjJsemRHVnlJQ2R5WVc1blpYTW5MQ0J5Ym1kY2NseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQnlibWRjY2x4dUlsMTkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCwgSVMsIE9KLCBUTywgXztcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG4kID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5JUyA9IHJlcXVpcmUoJy4vaXMnKTtcblxuVE8gPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFRPKCkge31cblxuICBUTy5ib29sID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHJldEJvb2w7XG4gICAgcmV0Qm9vbCA9IElTWyd0cnVlJ10oc3RyKTtcbiAgICBpZiAocmV0Qm9vbCA9PT0gZmFsc2UgfHwgcmV0Qm9vbCAhPT0gdHJ1ZSkge1xuICAgICAgcmV0Qm9vbCA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gcmV0Qm9vbDtcbiAgfTtcblxuICBUTy5FUzVfVG9Cb29sID0gZnVuY3Rpb24odmFsKSB7XG4gICAgcmV0dXJuIHZhbCAhPT0gZmFsc2UgJiYgdmFsICE9PSAwICYmIHZhbCAhPT0gJycgJiYgdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnICYmICh0eXBlb2YgdmFsICE9PSAnbnVtYmVyJyB8fCAhaXNOYU4odmFsKSk7XG4gIH07XG5cbiAgVE8uZGF0ZUZyb21UaWNrcyA9IGZ1bmN0aW9uKHRpY2tTdHIpIHtcbiAgICB2YXIgYXJyLCBsb2NhbE9mZnNldCwgb2Zmc2V0LCByZXQsIHRpY2tzLCB0aWNzRGF0ZVRpbWU7XG4gICAgdGljc0RhdGVUaW1lID0gdGhpcy5zdHJpbmcodGlja1N0cik7XG4gICAgcmV0ID0gdm9pZCAwO1xuICAgIHRpY2tzID0gdm9pZCAwO1xuICAgIG9mZnNldCA9IHZvaWQgMDtcbiAgICBsb2NhbE9mZnNldCA9IHZvaWQgMDtcbiAgICBhcnIgPSB2b2lkIDA7XG4gICAgaWYgKGZhbHNlID09PSBJUy5udWxsT3JFbXB0eSh0aWNzRGF0ZVRpbWUpKSB7XG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnLycsICcnKTtcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCdEYXRlJywgJycpO1xuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJygnLCAnJyk7XG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnKScsICcnKTtcbiAgICAgIGFyciA9IHRpY3NEYXRlVGltZS5zcGxpdCgnLScpO1xuICAgICAgaWYgKGFyci5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRpY2tzID0gdGhpcy5udW1iZXIoYXJyWzBdKTtcbiAgICAgICAgb2Zmc2V0ID0gdGhpcy5udW1iZXIoYXJyWzFdKTtcbiAgICAgICAgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgICAgIHJldCA9IG5ldyBEYXRlKHRpY2tzIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpO1xuICAgICAgfSBlbHNlIGlmIChhcnIubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRpY2tzID0gdGhpcy5udW1iZXIoYXJyWzBdKTtcbiAgICAgICAgcmV0ID0gbmV3IERhdGUodGlja3MpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIFRPLmJpbmFyeSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXQ7XG4gICAgcmV0ID0gTmFOO1xuICAgIGlmIChvYmogPT09IDAgfHwgb2JqID09PSAnMCcgfHwgb2JqID09PSAnJyB8fCBvYmogPT09IGZhbHNlIHx8IHRoaXMuc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgPT09ICdmYWxzZScpIHtcbiAgICAgIHJldCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvYmogPT09IDEgfHwgb2JqID09PSAnMScgfHwgb2JqID09PSB0cnVlIHx8IHRoaXMuc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgPT09ICd0cnVlJykge1xuICAgICAgICByZXQgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIFRPLm51bWJlciA9IGZ1bmN0aW9uKGlucHV0TnVtLCBkZWZhdWx0TnVtKSB7XG4gICAgdmFyIHJldFZhbCwgdHJ5R2V0TnVtYmVyO1xuICAgIHRyeUdldE51bWJlciA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICB2YXIgcmV0LCB0cnlHZXQ7XG4gICAgICAgIHJldCA9IE5hTjtcbiAgICAgICAgaWYgKElTLm51bWJlcih2YWwpKSB7XG4gICAgICAgICAgcmV0ID0gdmFsO1xuICAgICAgICB9IGVsc2UgaWYgKElTLnN0cmluZyh2YWwpIHx8IElTLmJvb2wodmFsKSkge1xuICAgICAgICAgIHRyeUdldCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgbnVtO1xuICAgICAgICAgICAgbnVtID0gX3RoaXMuYmluYXJ5KHZhbHVlKTtcbiAgICAgICAgICAgIGlmICghSVMubnVtYmVyKG51bSkgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgICAgbnVtID0gK3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFJUy5udW1iZXIobnVtKSkge1xuICAgICAgICAgICAgICBudW0gPSBfLnBhcnNlSW50KHZhbHVlLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudW07XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXQgPSB0cnlHZXQodmFsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgICByZXRWYWwgPSB0cnlHZXROdW1iZXIoaW5wdXROdW0pO1xuICAgIGlmICghSVMubnVtYmVyKHJldFZhbCkpIHtcbiAgICAgIHJldFZhbCA9IHRyeUdldE51bWJlcihkZWZhdWx0TnVtKTtcbiAgICAgIGlmICghSVMubnVtYmVyKHJldFZhbCkpIHtcbiAgICAgICAgcmV0VmFsID0gTnVtYmVyLk5hTjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldFZhbDtcbiAgfTtcblxuICBUTy5zdHJpbmcgPSBmdW5jdGlvbihpbnB1dFN0ciwgZGVmYXVsdFN0cikge1xuICAgIHZhciByZXQxLCByZXQyLCByZXRWYWwsIHRyeUdldFN0cmluZztcbiAgICB0cnlHZXRTdHJpbmcgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgdmFyIHJldDtcbiAgICAgICAgcmV0ID0gdm9pZCAwO1xuICAgICAgICBpZiAoSVMuc3RyaW5nKHN0cikpIHtcbiAgICAgICAgICByZXQgPSBzdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0ID0gJyc7XG4gICAgICAgICAgaWYgKElTLmJvb2woc3RyKSB8fCBJUy5udW1iZXIoc3RyKSB8fCBJUy5kYXRlKHN0cikpIHtcbiAgICAgICAgICAgIHJldCA9IHN0ci50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgICByZXQxID0gdHJ5R2V0U3RyaW5nKGlucHV0U3RyKTtcbiAgICByZXQyID0gdHJ5R2V0U3RyaW5nKGRlZmF1bHRTdHIpO1xuICAgIHJldFZhbCA9ICcnO1xuICAgIGlmIChyZXQxLmxlbmd0aCAhPT0gMCkge1xuICAgICAgcmV0VmFsID0gcmV0MTtcbiAgICB9IGVsc2UgaWYgKHJldDEgPT09IHJldDIgfHwgcmV0Mi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldFZhbCA9IHJldDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldFZhbCA9IHJldDI7XG4gICAgfVxuICAgIHJldHVybiByZXRWYWw7XG4gIH07XG5cbiAgcmV0dXJuIFRPO1xuXG59KSgpO1xuXG5PSi5yZWdpc3RlcigndG8nLCBUTyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVE87XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJa002WEZ4d1lXTnJZV2RsYzF4Y2IycGNYSE55WTF4Y1kyOW1abVZsWEZ4MGIyOXNjMXhjZEc4dVkyOW1abVZsSWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFTeEpRVUZCT3p0QlFVRkJMRVZCUVVFc1IwRkJTeXhQUVVGQkxFTkJRVkVzVDBGQlVqczdRVUZEVEN4RFFVRkJMRWRCUVVrc1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlEwb3NRMEZCUVN4SFFVRkpMRTlCUVVFc1EwRkJVU3hSUVVGU096dEJRVU5LTEVWQlFVRXNSMEZCU3l4UFFVRkJMRU5CUVZFc1RVRkJVanM3UVVGSFF6czdPMFZCUjBvc1JVRkJReXhEUVVGQkxFbEJRVVFzUjBGQlR5eFRRVUZETEVkQlFVUTdRVUZEVEN4UlFVRkJPMGxCUVVFc1QwRkJRU3hIUVVGVkxFVkJRVWNzUTBGQlFTeE5RVUZCTEVOQlFVZ3NRMEZCVnl4SFFVRllPMGxCUTFZc1NVRkJiMElzVDBGQlFTeExRVUZYTEV0QlFWZ3NTVUZCYjBJc1QwRkJRU3hMUVVGaExFbEJRWEpFTzAxQlFVRXNUMEZCUVN4SFFVRlZMRTFCUVZZN08xZEJRMEU3UlVGSVN6czdSVUZQVUN4RlFVRkRMRU5CUVVFc1ZVRkJSQ3hIUVVGaExGTkJRVU1zUjBGQlJEdFhRVU5ZTEVkQlFVRXNTMEZCVXl4TFFVRlVMRWxCUVcxQ0xFZEJRVUVzUzBGQlV5eERRVUUxUWl4SlFVRnJReXhIUVVGQkxFdEJRVk1zUlVGQk0wTXNTVUZCYTBRc1IwRkJRU3hMUVVGVExFbEJRVE5FTEVsQlFXOUZMRTlCUVU4c1IwRkJVQ3hMUVVGblFpeFhRVUZ3Uml4SlFVRnZSeXhEUVVGRExFOUJRVThzUjBGQlVDeExRVUZuUWl4UlFVRm9RaXhKUVVFMFFpeERRVUZKTEV0QlFVRXNRMEZCVFN4SFFVRk9MRU5CUVdwRE8wVkJSSHBHT3p0RlFVdGlMRVZCUVVNc1EwRkJRU3hoUVVGRUxFZEJRV2RDTEZOQlFVTXNUMEZCUkR0QlFVTmtMRkZCUVVFN1NVRkJRU3haUVVGQkxFZEJRV1VzU1VGQlF5eERRVUZCTEUxQlFVUXNRMEZCVVN4UFFVRlNPMGxCUTJZc1IwRkJRU3hIUVVGTk8wbEJRMDRzUzBGQlFTeEhRVUZSTzBsQlExSXNUVUZCUVN4SFFVRlRPMGxCUTFRc1YwRkJRU3hIUVVGak8wbEJRMlFzUjBGQlFTeEhRVUZOTzBsQlEwNHNTVUZCUnl4TFFVRkJMRXRCUVZNc1JVRkJSU3hEUVVGRExGZEJRVWdzUTBGQlpTeFpRVUZtTEVOQlFWbzdUVUZEUlN4WlFVRkJMRWRCUVdVc1dVRkJXU3hEUVVGRExFOUJRV0lzUTBGQmNVSXNSMEZCY2tJc1JVRkJNRUlzUlVGQk1VSTdUVUZEWml4WlFVRkJMRWRCUVdVc1dVRkJXU3hEUVVGRExFOUJRV0lzUTBGQmNVSXNUVUZCY2tJc1JVRkJOa0lzUlVGQk4wSTdUVUZEWml4WlFVRkJMRWRCUVdVc1dVRkJXU3hEUVVGRExFOUJRV0lzUTBGQmNVSXNSMEZCY2tJc1JVRkJNRUlzUlVGQk1VSTdUVUZEWml4WlFVRkJMRWRCUVdVc1dVRkJXU3hEUVVGRExFOUJRV0lzUTBGQmNVSXNSMEZCY2tJc1JVRkJNRUlzUlVGQk1VSTdUVUZEWml4SFFVRkJMRWRCUVUwc1dVRkJXU3hEUVVGRExFdEJRV0lzUTBGQmJVSXNSMEZCYmtJN1RVRkRUaXhKUVVGSExFZEJRVWNzUTBGQlF5eE5RVUZLTEVkQlFXRXNRMEZCYUVJN1VVRkRSU3hMUVVGQkxFZEJRVkVzU1VGQlF5eERRVUZCTEUxQlFVUXNRMEZCVVN4SFFVRkpMRU5CUVVFc1EwRkJRU3hEUVVGYU8xRkJRMUlzVFVGQlFTeEhRVUZUTEVsQlFVTXNRMEZCUVN4TlFVRkVMRU5CUVZFc1IwRkJTU3hEUVVGQkxFTkJRVUVzUTBGQldqdFJRVU5VTEZkQlFVRXNSMEZCYTBJc1NVRkJRU3hKUVVGQkxFTkJRVUVzUTBGQlRTeERRVUZETEdsQ1FVRlFMRU5CUVVFN1VVRkRiRUlzUjBGQlFTeEhRVUZWTEVsQlFVRXNTVUZCUVN4RFFVRk5MRXRCUVVFc1IwRkJVU3hEUVVGRExFTkJRVU1zVjBGQlFTeEhRVUZqTEVOQlFVTXNUVUZCUVN4SFFVRlRMRWRCUVZRc1IwRkJaU3hGUVVGb1FpeERRVUZtTEVOQlFVRXNSMEZCYzBNc1NVRkJka01zUTBGQlpDeEZRVXBhTzA5QlFVRXNUVUZMU3l4SlFVRkhMRWRCUVVjc1EwRkJReXhOUVVGS0xFdEJRV01zUTBGQmFrSTdVVUZEU0N4TFFVRkJMRWRCUVZFc1NVRkJReXhEUVVGQkxFMUJRVVFzUTBGQlVTeEhRVUZKTEVOQlFVRXNRMEZCUVN4RFFVRmFPMUZCUTFJc1IwRkJRU3hIUVVGVkxFbEJRVUVzU1VGQlFTeERRVUZMTEV0QlFVd3NSVUZHVUR0UFFWaFFPenRYUVdOQk8wVkJja0pqT3p0RlFYbENhRUlzUlVGQlF5eERRVUZCTEUxQlFVUXNSMEZCVXl4VFFVRkRMRWRCUVVRN1FVRkRVQ3hSUVVGQk8wbEJRVUVzUjBGQlFTeEhRVUZOTzBsQlEwNHNTVUZCUnl4SFFVRkJMRXRCUVU4c1EwRkJVQ3hKUVVGWkxFZEJRVUVzUzBGQlR5eEhRVUZ1UWl4SlFVRXdRaXhIUVVGQkxFdEJRVThzUlVGQmFrTXNTVUZCZFVNc1IwRkJRU3hMUVVGUExFdEJRVGxETEVsQlFYVkVMRWxCUVVNc1EwRkJRU3hOUVVGRUxFTkJRVkVzUjBGQlVpeERRVUZaTEVOQlFVTXNWMEZCWWl4RFFVRkJMRU5CUVRCQ0xFTkJRVU1zU1VGQk0wSXNRMEZCUVN4RFFVRkJMRXRCUVhGRExFOUJRUzlHTzAxQlEwVXNSMEZCUVN4SFFVRk5MRVZCUkZJN1MwRkJRU3hOUVVGQk8wMUJSVXNzU1VGQldTeEhRVUZCTEV0QlFVOHNRMEZCVUN4SlFVRlpMRWRCUVVFc1MwRkJUeXhIUVVGdVFpeEpRVUV3UWl4SFFVRkJMRXRCUVU4c1NVRkJha01zU1VGQmVVTXNTVUZCUXl4RFFVRkJMRTFCUVVRc1EwRkJVU3hIUVVGU0xFTkJRVmtzUTBGQlF5eFhRVUZpTEVOQlFVRXNRMEZCTUVJc1EwRkJReXhKUVVFelFpeERRVUZCTEVOQlFVRXNTMEZCY1VNc1RVRkJNVVk3VVVGQlFTeEhRVUZCTEVkQlFVMHNSVUZCVGp0UFFVWk1PenRYUVVkQk8wVkJURTg3TzBWQlowSlVMRVZCUVVNc1EwRkJRU3hOUVVGRUxFZEJRVk1zVTBGQlF5eFJRVUZFTEVWQlFWY3NWVUZCV0R0QlFVTlFMRkZCUVVFN1NVRkJRU3haUVVGQkxFZEJRV1VzUTBGQlFTeFRRVUZCTEV0QlFVRTdZVUZCUVN4VFFVRkRMRWRCUVVRN1FVRkRZaXhaUVVGQk8xRkJRVUVzUjBGQlFTeEhRVUZOTzFGQlJVNHNTVUZCUnl4RlFVRkZMRU5CUVVNc1RVRkJTQ3hEUVVGVkxFZEJRVllzUTBGQlNEdFZRVU5GTEVkQlFVRXNSMEZCVFN4SlFVUlNPMU5CUVVFc1RVRkhTeXhKUVVGSExFVkJRVVVzUTBGQlF5eE5RVUZJTEVOQlFWVXNSMEZCVml4RFFVRkJMRWxCUVd0Q0xFVkJRVVVzUTBGQlF5eEpRVUZJTEVOQlFWRXNSMEZCVWl4RFFVRnlRanRWUVVOSUxFMUJRVUVzUjBGQlV5eFRRVUZETEV0QlFVUTdRVUZEVUN4blFrRkJRVHRaUVVGQkxFZEJRVUVzUjBGQlRTeExRVUZETEVOQlFVRXNUVUZCUkN4RFFVRlJMRXRCUVZJN1dVRkRUaXhKUVVGcFFpeERRVUZKTEVWQlFVVXNRMEZCUXl4TlFVRklMRU5CUVZVc1IwRkJWaXhEUVVGS0xFbEJRWFZDTEV0QlFYaERPMk5CUVVFc1IwRkJRU3hIUVVGTkxFTkJRVU1zVFVGQlVEczdXVUZEUVN4SlFVRTRRaXhEUVVGSkxFVkJRVVVzUTBGQlF5eE5RVUZJTEVOQlFWVXNSMEZCVml4RFFVRnNRenRqUVVGQkxFZEJRVUVzUjBGQlRTeERRVUZETEVOQlFVTXNVVUZCUml4RFFVRlhMRXRCUVZnc1JVRkJhMElzUTBGQmJFSXNSVUZCVGpzN2JVSkJRMEU3VlVGS1R6dFZRVXRVTEVkQlFVRXNSMEZCVFN4TlFVRkJMRU5CUVU4c1IwRkJVQ3hGUVU1SU96dGxRVTlNTzAxQlltRTdTVUZCUVN4RFFVRkJMRU5CUVVFc1EwRkJRU3hKUVVGQk8wbEJaV1lzVFVGQlFTeEhRVUZUTEZsQlFVRXNRMEZCWVN4UlFVRmlPMGxCUTFRc1NVRkJSeXhEUVVGSkxFVkJRVVVzUTBGQlF5eE5RVUZJTEVOQlFWVXNUVUZCVml4RFFVRlFPMDFCUTBVc1RVRkJRU3hIUVVGVExGbEJRVUVzUTBGQllTeFZRVUZpTzAxQlExUXNTVUZCZFVJc1EwRkJTU3hGUVVGRkxFTkJRVU1zVFVGQlNDeERRVUZWTEUxQlFWWXNRMEZCTTBJN1VVRkJRU3hOUVVGQkxFZEJRVk1zVFVGQlRTeERRVUZETEVsQlFXaENPMDlCUmtZN08xZEJSMEU3UlVGd1FrODdPMFZCZDBKVUxFVkJRVU1zUTBGQlFTeE5RVUZFTEVkQlFWTXNVMEZCUXl4UlFVRkVMRVZCUVZjc1ZVRkJXRHRCUVVOUUxGRkJRVUU3U1VGQlFTeFpRVUZCTEVkQlFXVXNRMEZCUVN4VFFVRkJMRXRCUVVFN1lVRkJRU3hUUVVGRExFZEJRVVE3UVVGRFlpeFpRVUZCTzFGQlFVRXNSMEZCUVN4SFFVRk5PMUZCUTA0c1NVRkJSeXhGUVVGRkxFTkJRVU1zVFVGQlNDeERRVUZWTEVkQlFWWXNRMEZCU0R0VlFVTkZMRWRCUVVFc1IwRkJUU3hKUVVSU08xTkJRVUVzVFVGQlFUdFZRVWRGTEVkQlFVRXNSMEZCVFR0VlFVTk9MRWxCUVhsQ0xFVkJRVVVzUTBGQlF5eEpRVUZJTEVOQlFWRXNSMEZCVWl4RFFVRkJMRWxCUVdkQ0xFVkJRVVVzUTBGQlF5eE5RVUZJTEVOQlFWVXNSMEZCVml4RFFVRm9RaXhKUVVGclF5eEZRVUZGTEVOQlFVTXNTVUZCU0N4RFFVRlJMRWRCUVZJc1EwRkJNMFE3V1VGQlFTeEhRVUZCTEVkQlFVMHNSMEZCUnl4RFFVRkRMRkZCUVVvc1EwRkJRU3hGUVVGT08xZEJTa1k3TzJWQlMwRTdUVUZRWVR0SlFVRkJMRU5CUVVFc1EwRkJRU3hEUVVGQkxFbEJRVUU3U1VGUlppeEpRVUZCTEVkQlFVOHNXVUZCUVN4RFFVRmhMRkZCUVdJN1NVRkRVQ3hKUVVGQkxFZEJRVThzV1VGQlFTeERRVUZoTEZWQlFXSTdTVUZEVUN4TlFVRkJMRWRCUVZNN1NVRkRWQ3hKUVVGSExFbEJRVWtzUTBGQlF5eE5RVUZNTEV0QlFXbENMRU5CUVhCQ08wMUJRMFVzVFVGQlFTeEhRVUZUTEV0QlJGZzdTMEZCUVN4TlFVVkxMRWxCUVVjc1NVRkJRU3hMUVVGUkxFbEJRVklzU1VGQlowSXNTVUZCU1N4RFFVRkRMRTFCUVV3c1MwRkJaU3hEUVVGc1F6dE5RVU5JTEUxQlFVRXNSMEZCVXl4TFFVUk9PMHRCUVVFc1RVRkJRVHROUVVkSUxFMUJRVUVzUjBGQlV5eExRVWhPT3p0WFFVbE1PMFZCYkVKUE96czdPenM3UVVGdlFsZ3NSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3hKUVVGYUxFVkJRV3RDTEVWQlFXeENPenRCUVVOQkxFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKUFNpQTlJSEpsY1hWcGNtVWdKeTR1TDI5cUoxeHlYRzRrSUQwZ2NtVnhkV2x5WlNBbmFuRjFaWEo1SjF4eVhHNWZJRDBnY21WeGRXbHlaU0FuYkc5a1lYTm9KMXh5WEc1SlV5QTlJSEpsY1hWcGNtVWdKeTR2YVhNblhISmNibHh5WEc0aklDTWdkRzljY2x4dVkyeGhjM01nVkU4Z1hISmNiaUFnSXlBakl5QmliMjlzWEhKY2JpQWdJeUJqYjI1MlpYSjBJR0Z1ZVNCamIyMXdZWFJwWW14bElHOWlhbVZqZENCMGJ5QmhJR0p2YjJ4bFlXNHVJRWx1WTI5dGNHRjBhV0pzWlNCdlltcGxZM1J6SUdGeVpTQm1ZV3h6WlM1Y2NseHVJQ0JBWW05dmJEb2dLSE4wY2lrZ0xUNWNjbHh1SUNBZ0lISmxkRUp2YjJ3Z1BTQkpVMXNuZEhKMVpTZGRLSE4wY2lsY2NseHVJQ0FnSUhKbGRFSnZiMndnUFNCbVlXeHpaU0FnYVdZZ2NtVjBRbTl2YkNCcGN5Qm1ZV3h6WlNCdmNpQnlaWFJDYjI5c0lHbHpiblFnZEhKMVpWeHlYRzRnSUNBZ2NtVjBRbTl2YkZ4eVhHNWNjbHh1SUNBaklDTWpJRVZUTlY5VWIwSnZiMnhjY2x4dUlDQWpJQ2hrWldKMVp5a2diV1YwYUc5a0lIUnZJR1Y0Y0d4cFkybDBiSGtnWm05eVkyVWdZVzRnWUdsbUtHOWlhaWxnSUdWMllXeDFZWFJwYjI0Z2RHOGdabXh2ZHlCMGFISnZkV2RvSUhSb1pTQkZVelVnYzNCbFl5Qm1iM0lnZEhKMWRHaHBibVZ6YzF4eVhHNGdJRUJGVXpWZlZHOUNiMjlzT2lBb2RtRnNLU0F0UGx4eVhHNGdJQ0FnZG1Gc0lHbHpiblFnWm1Gc2MyVWdZVzVrSUhaaGJDQnBjMjUwSURBZ1lXNWtJSFpoYkNCcGMyNTBJQ2NuSUdGdVpDQjJZV3dnYVhOdWRDQnVkV3hzSUdGdVpDQjBlWEJsYjJZZ2RtRnNJR2x6Ym5RZ0ozVnVaR1ZtYVc1bFpDY2dZVzVrSUNoMGVYQmxiMllnZG1Gc0lHbHpiblFnSjI1MWJXSmxjaWNnYjNJZ2JtOTBJR2x6VG1GT0tIWmhiQ2twWEhKY2JseHlYRzRnSUNNZ0l5TWdaR0YwWlVaeWIyMVVhV05yYzF4eVhHNGdJQ01nZEdGclpTQmhJRzUxYldKbGNpQnlaWEJ5WlhObGJuUnBibWNnZEdsamEzTWdZVzVrSUdOdmJuWmxjblFnYVhRZ2FXNTBieUJoYmlCcGJuTjBZVzVqWlNCdlppQkVZWFJsWEhKY2JpQWdRR1JoZEdWR2NtOXRWR2xqYTNNNklDaDBhV05yVTNSeUtTQXRQbHh5WEc0Z0lDQWdkR2xqYzBSaGRHVlVhVzFsSUQwZ1FITjBjbWx1WnloMGFXTnJVM1J5S1Z4eVhHNGdJQ0FnY21WMElEMGdkVzVrWldacGJtVmtYSEpjYmlBZ0lDQjBhV05yY3lBOUlIVnVaR1ZtYVc1bFpGeHlYRzRnSUNBZ2IyWm1jMlYwSUQwZ2RXNWtaV1pwYm1Wa1hISmNiaUFnSUNCc2IyTmhiRTltWm5ObGRDQTlJSFZ1WkdWbWFXNWxaRnh5WEc0Z0lDQWdZWEp5SUQwZ2RXNWtaV1pwYm1Wa1hISmNiaUFnSUNCcFppQm1ZV3h6WlNCcGN5QkpVeTV1ZFd4c1QzSkZiWEIwZVNoMGFXTnpSR0YwWlZScGJXVXBYSEpjYmlBZ0lDQWdJSFJwWTNORVlYUmxWR2x0WlNBOUlIUnBZM05FWVhSbFZHbHRaUzV5WlhCc1lXTmxLQ2N2Snl3Z0p5Y3BYSEpjYmlBZ0lDQWdJSFJwWTNORVlYUmxWR2x0WlNBOUlIUnBZM05FWVhSbFZHbHRaUzV5WlhCc1lXTmxLQ2RFWVhSbEp5d2dKeWNwWEhKY2JpQWdJQ0FnSUhScFkzTkVZWFJsVkdsdFpTQTlJSFJwWTNORVlYUmxWR2x0WlM1eVpYQnNZV05sS0Njb0p5d2dKeWNwWEhKY2JpQWdJQ0FnSUhScFkzTkVZWFJsVkdsdFpTQTlJSFJwWTNORVlYUmxWR2x0WlM1eVpYQnNZV05sS0NjcEp5d2dKeWNwWEhKY2JpQWdJQ0FnSUdGeWNpQTlJSFJwWTNORVlYUmxWR2x0WlM1emNHeHBkQ2duTFNjcFhISmNiaUFnSUNBZ0lHbG1JR0Z5Y2k1c1pXNW5kR2dnUGlBeFhISmNiaUFnSUNBZ0lDQWdkR2xqYTNNZ1BTQkFiblZ0WW1WeUtHRnljbHN3WFNsY2NseHVJQ0FnSUNBZ0lDQnZabVp6WlhRZ1BTQkFiblZ0WW1WeUtHRnljbHN4WFNsY2NseHVJQ0FnSUNBZ0lDQnNiMk5oYkU5bVpuTmxkQ0E5SUc1bGR5QkVZWFJsS0NrdVoyVjBWR2x0WlhwdmJtVlBabVp6WlhRb0tWeHlYRzRnSUNBZ0lDQWdJSEpsZENBOUlHNWxkeUJFWVhSbEtDaDBhV05yY3lBdElDZ29iRzlqWVd4UFptWnpaWFFnS3lBb2IyWm1jMlYwSUM4Z01UQXdJQ29nTmpBcEtTQXFJREV3TURBcEtTbGNjbHh1SUNBZ0lDQWdaV3h6WlNCcFppQmhjbkl1YkdWdVozUm9JR2x6SURGY2NseHVJQ0FnSUNBZ0lDQjBhV05yY3lBOUlFQnVkVzFpWlhJb1lYSnlXekJkS1Z4eVhHNGdJQ0FnSUNBZ0lISmxkQ0E5SUc1bGR5QkVZWFJsS0hScFkydHpLVnh5WEc0Z0lDQWdjbVYwWEhKY2JseHlYRzRnSUNNZ0l5TWdZbWx1WVhKNVhISmNiaUFnSXlCamIyNTJaWEowSUdGdUlHOWlhbVZqZENCMGJ5QmlhVzVoY25rZ01DQnZjaUF4WEhKY2JpQWdRR0pwYm1GeWVUb2dLRzlpYWlrZ0xUNWNjbHh1SUNBZ0lISmxkQ0E5SUU1aFRseHlYRzRnSUNBZ2FXWWdiMkpxSUdseklEQWdiM0lnYjJKcUlHbHpJQ2N3SnlCdmNpQnZZbW9nYVhNZ0p5Y2diM0lnYjJKcUlHbHpJR1poYkhObElHOXlJRUJ6ZEhKcGJtY29iMkpxS1M1MGIweHZkMlZ5UTJGelpTZ3BMblJ5YVcwb0tTQnBjeUFuWm1Gc2MyVW5YSEpjYmlBZ0lDQWdJSEpsZENBOUlEQmNjbHh1SUNBZ0lHVnNjMlVnY21WMElEMGdNU0FnYVdZZ2IySnFJR2x6SURFZ2IzSWdiMkpxSUdseklDY3hKeUJ2Y2lCdlltb2dhWE1nZEhKMVpTQnZjaUJBYzNSeWFXNW5LRzlpYWlrdWRHOU1iM2RsY2tOaGMyVW9LUzUwY21sdEtDa2dhWE1nSjNSeWRXVW5YSEpjYmlBZ0lDQnlaWFJjY2x4dVhISmNibHh5WEc0Z0lDTWdJeU1nYm5WdFltVnlYSEpjYmlBZ0kxeHlYRzRnSUNNZ1FYUjBaVzF3ZEhNZ2RHOGdZMjl1ZG1WeWRDQmhiaUJoY21KcGRISmhjbmtnZG1Gc2RXVWdkRzhnWVNCT2RXMWlaWEl1WEhKY2JpQWdJeUJNYjI5elpTQm1ZV3h6ZVNCMllXeDFaWE1nWVhKbElHTnZiblpsY25SbFpDQjBieUF3TGx4eVhHNGdJQ01nVEc5dmMyVWdkSEoxZEdoNUlIWmhiSFZsY3lCaGNtVWdZMjl1ZG1WeWRHVmtJSFJ2SURFdVhISmNiaUFnSXlCQmJHd2diM1JvWlhJZ2RtRnNkV1Z6SUdGeVpTQndZWEp6WldRZ1lYTWdTVzUwWldkbGNuTXVYSEpjYmlBZ0l5QkdZV2xzZFhKbGN5QnlaWFIxY200Z1lYTWdUbUZPTGx4eVhHNGdJQ05jY2x4dUlDQkFiblZ0WW1WeU9pQW9hVzV3ZFhST2RXMHNJR1JsWm1GMWJIUk9kVzBwSUMwK1hISmNiaUFnSUNCMGNubEhaWFJPZFcxaVpYSWdQU0FvZG1Gc0tTQTlQbHh5WEc0Z0lDQWdJQ0J5WlhRZ1BTQk9ZVTVjY2x4dUlDQWdJQ0FnSXlCcFppQmdkbUZzWUNCaGJISmxZV1I1SUNocGN5bGJhWE11YUhSdGJGMGdZU0JPZFcxaVpYSXNJSEpsZEhWeWJpQnBkRnh5WEc0Z0lDQWdJQ0JwWmlCSlV5NXVkVzFpWlhJb2RtRnNLVnh5WEc0Z0lDQWdJQ0FnSUhKbGRDQTlJSFpoYkZ4eVhHNGdJQ0FnSUNBaklHVnNjMlVnYVdZZ1lIWmhiR0FnWVd4eVpXRmtlU0FvYVhNcFcybHpMbWgwYld4ZElHRWdVM1J5YVc1bklHOXlJR0VnUW05dmJHVmhiaXdnWTI5dWRtVnlkQ0JwZEZ4eVhHNGdJQ0FnSUNCbGJITmxJR2xtSUVsVExuTjBjbWx1WnloMllXd3BJRzl5SUVsVExtSnZiMndvZG1Gc0tWeHlYRzRnSUNBZ0lDQWdJSFJ5ZVVkbGRDQTlJQ2gyWVd4MVpTa2dQVDVjY2x4dUlDQWdJQ0FnSUNBZ0lHNTFiU0E5SUVCaWFXNWhjbmtvZG1Gc2RXVXBYSEpjYmlBZ0lDQWdJQ0FnSUNCdWRXMGdQU0FyZG1Gc2RXVWdJR2xtSUc1dmRDQkpVeTV1ZFcxaVpYSW9iblZ0S1NCaGJtUWdkbUZzZFdWY2NseHVJQ0FnSUNBZ0lDQWdJRzUxYlNBOUlGOHVjR0Z5YzJWSmJuUW9kbUZzZFdVc0lEQXBJR2xtSUc1dmRDQkpVeTV1ZFcxaVpYSW9iblZ0S1Z4eVhHNGdJQ0FnSUNBZ0lDQWdiblZ0WEhKY2JpQWdJQ0FnSUNBZ2NtVjBJRDBnZEhKNVIyVjBJSFpoYkZ4eVhHNGdJQ0FnSUNCeVpYUmNjbHh1WEhKY2JpQWdJQ0J5WlhSV1lXd2dQU0IwY25sSFpYUk9kVzFpWlhJb2FXNXdkWFJPZFcwcFhISmNiaUFnSUNCcFppQnViM1FnU1ZNdWJuVnRZbVZ5S0hKbGRGWmhiQ2xjY2x4dUlDQWdJQ0FnY21WMFZtRnNJRDBnZEhKNVIyVjBUblZ0WW1WeUtHUmxabUYxYkhST2RXMHBYSEpjYmlBZ0lDQWdJSEpsZEZaaGJDQTlJRTUxYldKbGNpNU9ZVTRnYVdZZ2JtOTBJRWxUTG01MWJXSmxjaWh5WlhSV1lXd3BYSEpjYmlBZ0lDQnlaWFJXWVd4Y2NseHVYSEpjYmlBZ0l5QWpJeUJ6ZEhKcGJtZGNjbHh1SUNBaklHTnZiblpsY25RZ1lXNGdiMkpxWldOMElIUnZJSE4wY21sdVoxeHlYRzRnSUVCemRISnBibWM2SUNocGJuQjFkRk4wY2l3Z1pHVm1ZWFZzZEZOMGNpa2dMVDVjY2x4dUlDQWdJSFJ5ZVVkbGRGTjBjbWx1WnlBOUlDaHpkSElwSUQwK1hISmNiaUFnSUNBZ0lISmxkQ0E5SUhWdVpHVm1hVzVsWkZ4eVhHNGdJQ0FnSUNCcFppQkpVeTV6ZEhKcGJtY29jM1J5S1Z4eVhHNGdJQ0FnSUNBZ0lISmxkQ0E5SUhOMGNseHlYRzRnSUNBZ0lDQmxiSE5sWEhKY2JpQWdJQ0FnSUNBZ2NtVjBJRDBnSnlkY2NseHVJQ0FnSUNBZ0lDQnlaWFFnUFNCemRISXVkRzlUZEhKcGJtY29LU0FnYVdZZ1NWTXVZbTl2YkNoemRISXBJRzl5SUVsVExtNTFiV0psY2loemRISXBJRzl5SUVsVExtUmhkR1VvYzNSeUtWeHlYRzRnSUNBZ0lDQnlaWFJjY2x4dUlDQWdJSEpsZERFZ1BTQjBjbmxIWlhSVGRISnBibWNvYVc1d2RYUlRkSElwWEhKY2JpQWdJQ0J5WlhReUlEMGdkSEo1UjJWMFUzUnlhVzVuS0dSbFptRjFiSFJUZEhJcFhISmNiaUFnSUNCeVpYUldZV3dnUFNBbkoxeHlYRzRnSUNBZ2FXWWdjbVYwTVM1c1pXNW5kR2dnYVhOdWRDQXdYSEpjYmlBZ0lDQWdJSEpsZEZaaGJDQTlJSEpsZERGY2NseHVJQ0FnSUdWc2MyVWdhV1lnY21WME1TQnBjeUJ5WlhReUlHOXlJSEpsZERJdWJHVnVaM1JvSUdseklEQmNjbHh1SUNBZ0lDQWdjbVYwVm1Gc0lEMGdjbVYwTVZ4eVhHNGdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQnlaWFJXWVd3Z1BTQnlaWFF5WEhKY2JpQWdJQ0J5WlhSV1lXeGNjbHh1WEhKY2JrOUtMbkpsWjJsemRHVnlJQ2QwYnljc0lGUlBYSEpjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVkU4aVhYMD0iLCIjICMgY3JlYXRlVVVJRFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuIyMjXHJcbkdlbmVyYXRlcyBhIHJhbmRvbSBzdHJpbmcgdGhhdCBjb21wbGllcyB0byB0aGUgUkZDIDQxMjIgc3BlY2lmaWNhdGlvbiBmb3IgR1VJRC9VVUlELlxyXG4oZS5nLiAnQjQyQTE1M0YtMUQ5QS00RjkyLTk5MDMtOTJDMTFERDY4NEQyJylcclxuV2hpbGUgbm90IGEgdHJ1ZSBVVUlELCBmb3IgdGhlIHB1cnBvc2VzIG9mIHRoaXMgYXBwbGljYXRpb24sIGl0IHNob3VsZCBiZSBzdWZmaWNpZW50LlxyXG4jIyNcclxuY3JlYXRlRmF1eFVVSUQgPSAtPlxyXG4gICAgXHJcbiAgIyBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmM0MTIyLnR4dFxyXG4gICMgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvaG93LXRvLWNyZWF0ZS1hLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0XHJcbiAgcyA9IFtdXHJcbiAgcy5sZW5ndGggPSAzNlxyXG4gIGhleERpZ2l0cyA9ICcwMTIzNDU2Nzg5YWJjZGVmJ1xyXG4gIGkgPSAwXHJcblxyXG4gIHdoaWxlIGkgPCAzNlxyXG4gICAgc1tpXSA9IGhleERpZ2l0cy5zdWJzdHIoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHgxMCksIDEpXHJcbiAgICBpICs9IDFcclxuICBzWzE0XSA9ICc0JyAjIGJpdHMgMTItMTUgb2YgdGhlIHRpbWVfaGlfYW5kX3ZlcnNpb24gZmllbGQgdG8gMDAxMFxyXG4gIHNbMTldID0gaGV4RGlnaXRzLnN1YnN0cigoc1sxOV0gJiAweDMpIHwgMHg4LCAxKSAjIGJpdHMgNi03IG9mIHRoZSBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkIHRvIDAxXHJcbiAgc1s4XSA9IHNbMTNdID0gc1sxOF0gPSBzWzIzXSA9ICctJ1xyXG4gIHV1aWQgPSBzLmpvaW4oJycpXHJcbiAgdXVpZFxyXG5cclxuT0oucmVnaXN0ZXIgJ2NyZWF0ZVVVSUQnLCBjcmVhdGVGYXV4VVVJRFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUZhdXhVVUlEIl19
