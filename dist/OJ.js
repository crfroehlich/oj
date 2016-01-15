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

require('./tools/is');

require('./tools/noty');

require('./tools/pubsub');

require('./tools/queryString');

require('./tools/ranges');

require('./tools/to');

require('./tools/uuid');



},{"./async/ajax":2,"./async/promise":3,"./components/grid":4,"./components/inputgroup":5,"./components/tabs":6,"./components/tile":7,"./controls/icon":8,"./core/date":9,"./core/function":10,"./core/number":11,"./core/object":12,"./core/string":14,"./dom/body":15,"./dom/component":16,"./dom/control":17,"./dom/element":18,"./dom/fragment":19,"./dom/generics":20,"./dom/input":21,"./dom/node":22,"./dom/nodeFactory":23,"./elements/a":24,"./elements/br":25,"./elements/form":26,"./elements/input":27,"./elements/ol":28,"./elements/select":29,"./elements/table":30,"./elements/textarea":31,"./elements/thead":32,"./elements/ul":33,"./inputs/buttoninput":35,"./inputs/checkbox":36,"./inputs/color":37,"./inputs/date":38,"./inputs/datetime":39,"./inputs/datetimelocal":40,"./inputs/email":41,"./inputs/file":42,"./inputs/hidden":43,"./inputs/imageinput":44,"./inputs/month":45,"./inputs/number":46,"./inputs/password":47,"./inputs/radio":48,"./inputs/range":49,"./inputs/reset":50,"./inputs/search":51,"./inputs/submit":52,"./inputs/tel":53,"./inputs/textinput":54,"./inputs/time":55,"./inputs/url":56,"./inputs/week":57,"./oj":58,"./ojInit":59,"./tools/array2D":61,"./tools/console":62,"./tools/cookie":63,"./tools/defer":64,"./tools/each":65,"./tools/enums":66,"./tools/is":67,"./tools/noty":68,"./tools/pubsub":69,"./tools/queryString":70,"./tools/ranges":71,"./tools/to":72,"./tools/uuid":73}],2:[function(require,module,exports){
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



},{"../dom/component":16,"../oj":58,"../ojInit":59,"../tools/uuid":73}],6:[function(require,module,exports){
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
  var error, exception, ret, that;
  ret = false;
  that = this;
  try {
    if (OJ.is.method(tryFunc)) {
      ret = tryFunc.apply(that, Array.prototype.slice.call(arguments, 1));
    }
  } catch (error) {
    exception = error;
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxcb2JqZWN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUNKLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7QUFDSixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0FBQ1gsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztBQUNYLElBQUEsR0FBTyxPQUFBLENBQVEsWUFBUjs7QUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLGFBQVI7O0FBSUwsTUFBQSxHQUlFO0VBQUEsTUFBQSxFQUFRLFNBQUMsR0FBRDs7TUFBQyxNQUFNOzs7QUFFYjs7O0lBR0EsR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLElBQUQsRUFBTyxHQUFQO01BQ1IsUUFBQSxDQUFTLEdBQVQsRUFBYyxJQUFkLEVBQW9CLEdBQXBCO2FBQ0E7SUFGUTtJQUlWLEdBQUcsQ0FBQyxHQUFKLENBQVEsTUFBUixFQUFnQixTQUFDLFFBQUQ7QUFDZCxVQUFBO01BQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSO2FBQ1AsSUFBQSxDQUFLLEdBQUwsRUFBVSxTQUFDLEdBQUQsRUFBTSxHQUFOO1FBQ1IsSUFBRyxHQUFBLEtBQVMsTUFBVCxJQUFvQixHQUFBLEtBQVMsS0FBaEM7aUJBQ0UsUUFBQSxDQUFTLEdBQVQsRUFBYyxHQUFkLEVBREY7O01BRFEsQ0FBVjtJQUZjLENBQWhCO1dBTUE7RUFmTSxDQUFSO0VBb0JBLFlBQUEsRUFBYyxTQUFDLElBQUQsRUFBTyxHQUFQO1dBQ1osTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsSUFBaEIsRUFBc0IsR0FBdEIsQ0FBQSxJQUErQixFQUFFLENBQUMsSUFBSCxDQUFRLEdBQUksQ0FBQSxJQUFBLENBQVo7RUFEbkIsQ0FwQmQ7RUF5QkEsUUFBQSxFQUFVLFNBQUMs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O0FBQ0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxhQUFaLEVBQTJCLE1BQU0sQ0FBQyxXQUFsQzs7QUFDQSxFQUFFLENBQUMsUUFBSCxDQUFZLFFBQVosRUFBc0IsTUFBTSxDQUFDLE1BQTdCOztBQUNBLEVBQUUsQ0FBQyxRQUFILENBQVksUUFBWixFQUFzQixNQUFNLENBQUMsTUFBN0I7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiQgPSByZXF1aXJlICdqcXVlcnknXHJcbl8gPSByZXF1aXJlICdsb2Rhc2gnXHJcbmlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXHJcbnByb3BlcnR5ID0gcmVxdWlyZSAnLi9wcm9wZXJ0eSdcclxuZnVuYyA9IHJlcXVpcmUgJy4vZnVuY3Rpb24nXHJcbnRvID0gcmVxdWlyZSAnLi4vdG9vbHMvdG8nXHJcblxyXG4jICMgb2JqZWN0XHJcblxyXG5yZXRPYmogPSBcclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLm9iamVjdFxyXG4gICMgY3JlYXRlIGFuIG9iamVjdCB3aXRoIGhlbHBlciBgYWRkYCBhbmQgYGVhY2hgIG1ldGhvZHMuXHJcbiAgb2JqZWN0OiAob2JqID0ge30pIC0+XHJcbiAgICBcclxuICAgICMjI1xyXG4gICAgQWRkIGEgcHJvcGVydHkgdG8gdGhlIG9iamVjdCBhbmQgcmV0dXJuIGl0XHJcbiAgICAjIyNcclxuICAgIG9iai5hZGQgPSAobmFtZSwgdmFsKSAtPlxyXG4gICAgICBwcm9wZXJ0eSBvYmosIG5hbWUsIHZhbFxyXG4gICAgICBvYmpcclxuXHJcbiAgICBvYmouYWRkICdlYWNoJywgKGNhbGxiYWNrKSAtPlxyXG4gICAgICBlYWNoID0gcmVxdWlyZSAnLi4vdG9vbHMvZWFjaCdcclxuICAgICAgZWFjaCBvYmosICh2YWwsIGtleSkgLT5cclxuICAgICAgICBpZiBrZXkgaXNudCAnZWFjaCcgYW5kIGtleSBpc250ICdhZGQnXHJcbiAgICAgICAgICBjYWxsYmFjayB2YWwsIGtleVxyXG5cclxuICAgIG9ialxyXG5cclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmlzSW5zdGFuY2VPZlxyXG4gICMgZGV0ZXJtaW5lcyBpcyBhIHRoaW5nIGlzIGFuIGluc3RhbmNlIG9mIGEgVGhpbmcsIGFzc3VtaW5nIHRoZSB0aGluZ3Mgd2VyZSBhbGwgY3JlYXRlZCBpbiBPSlxyXG4gIGlzSW5zdGFuY2VPZjogKG5hbWUsIG9iaikgLT5cclxuICAgIHJldE9iai5jb250YWlucyhuYW1lLCBvYmopIGFuZCB0by5ib29sKG9ialtuYW1lXSlcclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmNvbnRhaW5zXHJcbiAgIyB0cnVlIGlmIHRoZSBgb2JqZWN0YCBjb250YWlucyB0aGUgdmFsdWVcclxuICBjb250YWluczogKG9iamVjdCwgaW5kZXgpIC0+XHJcbiAgICByZXQgPSBmYWxzZVxyXG4gICAgaWYgb2JqZWN0XHJcbiAgICAgIHJldCA9IF8uY29udGFpbnMgb2JqZWN0LCBpbmRleFxyXG4gICAgcmV0XHJcblxyXG4gICMgIyMgW09KXShvai5odG1sKS5jb21wYXJlXHJcbiAgIyBjb21wYXJlIHR3byBvYmplY3RzL2FycmF5cy92YWx1ZXMgZm9yIHN0cmljdCBlcXVhbGl0eVxyXG4gIGNvbXBhcmU6IChvYmoxLCBvYmoyKSAtPlxyXG4gICAgXy5pc0VxdWFsIG9iajEsIG9iajJcclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmNsb25lXHJcbiAgIyBjb3B5IGFsbCBvZiB0aGUgdmFsdWVzIChyZWN1cnNpdmVseSkgZnJvbSBvbmUgb2JqZWN0IHRvIGFub3RoZXIuXHJcbiAgY2xvbmU6IChkYXRhKSAtPlxyXG4gICAgXy5jbG9uZURlZXAgZGF0YSB0cnVlXHJcblxyXG4gICMgIyMgW09KXShvai5odG1sKS5zZXJpYWxpemVcclxuICAjIENvbnZlcnQgYW4gb2JqZWN0IHRvIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgb2JqZWN0XHJcbiAgc2VyaWFsaXplOiAoZGF0YSkgLT5cclxuICAgIHJldCA9ICcnXHJcbiAgICBmdW5jLnRyeUV4ZWMgLT5cclxuICAgICAgcmV0ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSlcclxuICAgICAgcmV0dXJuXHJcbiAgICByZXQgb3IgJydcclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmRlc2VyaWFsaXplXHJcbiAgIyBDb252ZXJ0IGEgSlNPTiBzdHJpbmcgdG8gYW4gb2JqZWN0XHJcbiAgZGVzZXJpYWxpemU6IChkYXRhKSAtPlxyXG4gICAgcmV0ID0ge31cclxuICAgIGlmIGRhdGFcclxuICAgICAgZnVuYy50cnlFeGVjIC0+XHJcbiAgICAgICAgcmV0ID0gJC5wYXJzZUpTT04oZGF0YSlcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIHJldCA9IHt9ICBpZiBpc01ldGhvZC5udWxsT3JFbXB0eShyZXQpXHJcbiAgICByZXRcclxuXHJcbiAgIyAjIyBbT0pdKG9qLmh0bWwpLnBhcmFtc1xyXG4gICMgQ29udmVydCBhbiBvYmplY3QgdG8gYSBkZWxpbWl0ZWQgbGlzdCBvZiBwYXJhbWV0ZXJzIChub3JtYWxseSBxdWVyeS1zdHJpbmcgcGFyYW1ldGVycylcclxuICBwYXJhbXM6IChkYXRhLCBkZWxpbWl0ZXIgPSAnJicpIC0+XHJcbiAgICByZXQgPSAnJ1xyXG4gICAgaWYgZGVsaW1pdGVyIGlzICcmJ1xyXG4gICAgICBmdW5jLnRyeUV4ZWMgLT5cclxuICAgICAgICByZXQgPSAkLnBhcmFtKGRhdGEpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgZWxzZVxyXG4gICAgICBlYWNoID0gcmVxdWlyZSAnLi4vdG9vbHMvZWFjaCdcclxuICAgICAgZWFjaCBkYXRhLCAodmFsLCBrZXkpIC0+XHJcbiAgICAgICAgcmV0ICs9IGRlbGltaXRlciAgaWYgcmV0Lmxlbmd0aCA+IDBcclxuICAgICAgICByZXQgKz0ga2V5ICsgJz0nICsgdmFsXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgdG8uc3RyaW5nIHJldFxyXG5cclxuICAjICMjIFtPSl0ob2ouaHRtbCkuZXh0ZW5kXHJcbiAgIyBjb3B5IHRoZSBwcm9wZXJ0aWVzIG9mIG9uZSBvYmplY3QgdG8gYW5vdGhlciBvYmplY3RcclxuICBleHRlbmQ6IChkZXN0T2JqLCBzcmNPYmosIGRlZXBDb3B5ID0gZmFsc2UpIC0+XHJcbiAgICByZXQgPSBkZXN0T2JqIG9yIHt9XHJcbiAgICBmb3Iga2V5LCB2YWx1ZSBvZiBzcmNPYmpcclxuICAgICAgaWYgZGVlcENvcHkgYW5kIHZhbHVlIGFuZCAkLmlzUGxhaW5PYmplY3QodmFsdWUpIGFuZCAkLmlzUGxhaW5PYmplY3QocmV0W2tleV0pXHJcbiAgICAgICAgIyBtZXJnZSBpbnRvIGRlc3RpbmF0aW9uIHByb3BlcnR5XHJcbiAgICAgICAgQGV4dGVuZCByZXRba2V5XSwgdmFsdWUsIHRydWVcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldFtrZXldID0gdmFsdWVcclxuICAgIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ29iamVjdCcsIHJldE9iai5vYmplY3RcclxuT0oucmVnaXN0ZXIgJ2lzSW5zdGFuY2VPZicsIHJldE9iai5pc0luc3RhbmNlT2ZcclxuT0oucmVnaXN0ZXIgJ2NvbnRhaW5zJywgcmV0T2JqLmNvbnRhaW5zXHJcbk9KLnJlZ2lzdGVyICdjb21wYXJlJywgcmV0T2JqLmNvbXBhcmVcclxuT0oucmVnaXN0ZXIgJ2Nsb25lJywgcmV0T2JqLmNsb25lXHJcbk9KLnJlZ2lzdGVyICdzZXJpYWxpemUnLCByZXRPYmouc2VyaWFsaXplXHJcbk9KLnJlZ2lzdGVyICdkZXNlcmlhbGl6ZScsIHJldE9iai5kZXNlcmlhbGl6ZVxyXG5PSi5yZWdpc3RlciAncGFyYW1zJywgcmV0T2JqLnBhcmFtc1xyXG5PSi5yZWdpc3RlciAnZXh0ZW5kJywgcmV0T2JqLmV4dGVuZFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZXRPYmoiXX0=
},{"../oj":58,"../tools/each":65,"../tools/is":67,"../tools/to":72,"./function":10,"./property":13}],13:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxib2R5LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUNKLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjs7O0FBR1A7Ozs7QUFHQSxJQUFHLE9BQU8sUUFBUCxLQUFxQixXQUF4QjtFQUF5QyxJQUFBLEdBQU8sUUFBUSxDQUFDLEtBQXpEO0NBQUEsTUFBQTtFQUFtRSxJQUFBLEdBQU8sS0FBMUU7OztBQUNBLE1BQUEsR0FBUyxJQUFJOztBQUNiLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOztBQUVqQixFQUFFLENBQUMsUUFBSCxDQUFZLE1BQVosRUFBb0IsTUFBcEI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbl8gPSByZXF1aXJlICdsb2Rhc2gnXHJcbk5vZGUgPSByZXF1aXJlICcuL25vZGUnXHJcblxyXG5cclxuIyMjXHJcblBlcnNpc3QgYSBoYW5kbGUgb24gdGhlIGJvZHkgbm9kZVxyXG4jIyNcclxuaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiBib2R5ID0gZG9jdW1lbnQuYm9keSBlbHNlIGJvZHkgPSBudWxsXHJcbm9qQm9keSA9IG5ldyBOb2RlXHJcbm9qQm9keS5lbGVtZW50ID0gYm9keVxyXG4gIFxyXG5PSi5yZWdpc3RlciAnYm9keScsIG9qQm9keVxyXG5tb2R1bGUuZXhwb3J0cyA9IG9qQm9keSJdfQ==
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxlbGVtZW50LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUNKLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7QUFDSixJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0FBRVAsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSOztBQUlWLE9BQUEsR0FFRTs7QUFBQTs7O0VBR0EsY0FBQSxFQUFnQixTQUFDLEVBQUQsRUFBSyxHQUFMO0FBQ2YsUUFBQTs7TUFEb0IsTUFBTSxFQUFFLENBQUM7O0lBQzdCLEVBQUUsQ0FBQyxTQUFILElBQ0UsQ0FBQSxJQUFBLEdBQU8sSUFBSSxJQUFYO0lBQ0EsSUFBSSxDQUFDLE9BQUwsR0FBZTtXQUNmO0VBSmEsQ0FIaEI7OztBQVNGLEVBQUUsQ0FBQyxRQUFILENBQVksZ0JBQVosRUFBOEIsT0FBTyxDQUFDLGNBQXRDOztBQUVBLEVBQUUsQ0FBQyxRQUFILENBQVksZ0JBQVosRUFBOEIsU0FBQyxTQUFEO1NBQzVCLEtBQUEsS0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQU4sQ0FBa0IsRUFBRSxDQUFDLFVBQUgsQ0FBYyxTQUFkLENBQWxCO0FBRG1CLENBQTlCOztBQUdBLEVBQUUsQ0FBQyxRQUFILENBQVksWUFBWixFQUEwQixTQUFDLEVBQUQ7RUFDeEIsSUFBRyxPQUFPLFFBQVAsS0FBcUIsV0FBeEI7V0FDRSxRQUFRLENBQUMsY0FBVCxDQUF3QixFQUF4QixFQURGOztBQUR3QixDQUExQjs7QUFLQSxNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiT0ogPSByZXF1aXJlICcuLi9vaidcclxuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuTm9kZSA9IHJlcXVpcmUgJy4vbm9kZSdcclxuXHJcblRoaW5ET00gPSByZXF1aXJlICd0aGluZG9tJ1xyXG5cclxuIyAjIGVsZW1lbnRcclxuXHJcbmVsZW1lbnQgPSBcclxuICAjICMjIHJlc3RvcmVFbGVtZW50XHJcbiAgIyMjXHJcbiAgUmVzdG9yZSBhbiBIVE1MIEVsZW1lbnQgdGhyb3VnaCBUaGluRG9tXHJcbiAgIyMjXHJcbiAgcmVzdG9yZUVsZW1lbnQ6IChlbCwgdGFnID0gZWwubm9kZU5hbWUpIC0+XHJcbiAgXHRlbC5vZldyYXBwZXIgb3JcclxuXHQgICAgbm9kZSA9IG5ldyBOb2RlXHJcblx0ICAgIG5vZGUuZWxlbWVudCA9IGVsXHJcblx0ICAgIG5vZGVcclxuXHJcbk9KLnJlZ2lzdGVyICdyZXN0b3JlRWxlbWVudCcsIGVsZW1lbnQucmVzdG9yZUVsZW1lbnRcclxuXHJcbk9KLnJlZ2lzdGVyICdpc0VsZW1lbnRJbkRvbScsIChlbGVtZW50SWQpIC0+XHJcbiAgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkgT0ouZ2V0RWxlbWVudCBlbGVtZW50SWRcclxuXHJcbk9KLnJlZ2lzdGVyICdnZXRFbGVtZW50JywgKGlkKSAtPlxyXG4gIGlmIHR5cGVvZiBkb2N1bWVudCBpc250ICd1bmRlZmluZWQnXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVsZW1lbnQiXX0=
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxub2RlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQU9KLE9BQUEsR0FBVTs7QUFLSjtFQUlTLGNBQUMsTUFBRCxHQUFBOztpQkFFYixJQUFBLEdBQU0sU0FBQyxPQUFELEVBQVUsT0FBVjtBQUNKLFFBQUE7SUFBQSxJQUFHLE9BQU8sQ0FBQyxJQUFYO2FBQ0UsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFiLEVBQW1CLE9BQW5CLEVBREY7S0FBQSxNQUFBO01BR0UsTUFBQSxHQUFTLE9BQVEsQ0FBQSxPQUFBO01BQ2pCLElBQUcsTUFBSDtlQUNFLE1BQUEsQ0FBTyxPQUFQLEVBREY7T0FBQSxNQUFBO1FBR0UsTUFBQSxHQUFTLEVBQUUsQ0FBQyxLQUFNLENBQUEsT0FBQSxDQUFULElBQXFCLEVBQUUsQ0FBQyxVQUFXLENBQUEsT0FBQSxDQUFuQyxJQUErQyxFQUFFLENBQUMsUUFBUyxDQUFBLE9BQUEsQ0FBM0QsSUFBdUUsRUFBRSxDQUFDLE1BQU8sQ0FBQSxPQUFBO1FBQzFGLElBQUcsTUFBQSxJQUFVLENBQUMsTUFBTSxDQUFDLGVBQXJCO2lCQUNFLE1BQUEsQ0FBTyxPQUFQLEVBQWdCLElBQWhCLEVBREY7U0FBQSxNQUFBO1VBR0UsU0FBQSxHQUFnQixJQUFBLElBQUEsQ0FBQTtVQUNoQixTQUFTLENBQUMsT0FBVixHQUFvQixlQUFBLENBQWdCLElBQUMsQ0FBQSxPQUFqQixFQUEwQixPQUExQixFQUFtQyxPQUFuQztpQkFDcEIsVUFMRjtTQUpGO09BSkY7O0VBREk7O2lCQWdCTixHQUFBLEdBQUssU0FBQyxJQUFELEVBQU8sS0FBUDtJQUNILElBQUssQ0FBQSxJQUFBLENBQUwsR0FBYTtXQUViLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBVCxHQUFxQjtFQUhsQjs7aUJBS0wsR0FBQSxHQUFLLFNBQUMsSUFBRDtBQUNILFFBQUE7SUFBQSxLQUFBLEdBQVEsSUFBSyxDQUFBLElBQUE7SUFDYixJQUFHLEtBQUEsS0FBUyxNQUFaO01BQ0UsTUFBQSxHQUFTLElBQUMsQ0FBQTtBQUNWLGFBQU0sTUFBQSxHQUFTLE1BQU0sQ0FBQyxVQUF0QjtRQUNFLElBQUcsTUFBTSxDQUFDLFNBQVY7QUFDRSxpQkFBTyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQWpCLENBQXFCLElBQXJCLEVBRFQ7O01BREYsQ0FGRjtLQUFBLE1BQUE7YUFNRSxNQU5GOztFQUZHOztpQkFVTCxJQUFBLEdBQU0sU0FBQTtJQUNKLElBQUMsQ0FBQSxDQUFDLENBQUMsSUFBSCxDQUFBO1dBQ0EsZUFBZSxDQUFDLE1BQWhCLENBQXVCLElBQUMsQ0FBQSxPQUF4QjtFQUZJOztpQkFJTixPQUFBLEdBQVMsU0FBQTtJQUNQLElBQUMsQ0FBQSxDQUFDLENBQUMsSUFBSCxDQUFRLFVBQVIsRUFBb0IsVUFBcEI7V0FDQSxJQUFDLENBQUEsQ0FBQyxDQUFDLFFBQUgsQ0FBWSxVQUFaLEVBQXdCLFVBQXhCO0VBRk87O2lCQUlULE1BQUEsR0FBUSxTQUFBO0lBQ04sSUFBQyxDQUFBLENBQUMsQ0FBQyxVQUFILENBQWUsVUFBZjtXQUNBLElBQUMsQ0FBQSxDQUFDLENBQUMsV0FBSCxDQUFlLFVBQWY7RUFGTTs7Ozs7O0FBSVYsQ0FDRSxJQURGLEVBRUUsT0FGRixFQUdFLE1BSEYsRUFJRSxhQUpGLEVBS0UsVUFMRixFQU1FLFVBTkYsRUFPRSxNQVBGLEVBUUUsTUFSRixFQVNFLFlBVEYsRUFVRSxLQVZGLEVBV0UsUUFYRixFQVlFLFFBWkYsRUFhRSxLQWJGLEVBY0UsTUFkRixFQWVFLE1BZkYsRUFnQkUsU0FoQkYsQ0FpQkMsQ0FBQyxPQWpCRixDQWlCVSxTQUFDLE1BQUQ7U0FDUixJQUFJLENBQUMsU0FBVSxDQUFBLE1BQUEsQ0FBZixHQUF5QixTQUFBO0FBQ3ZCLFFBQUE7SUFBQSxhQUFBLEdBQWdCLElBQUMsQ0FBQTtXQUNqQixhQUFjLENBQUEsTUFBQSxDQUFPLENBQUMsS0FBdEIsQ0FBNEIsYUFBNUIsRUFBMkMsU0FBM0M7RUFGdUI7QUFEakIsQ0FqQlY7O0FBdUJBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLElBQUksQ0FBQyxTQUEzQixFQUFzQyxHQUF0QyxFQUNFO0VBQUEsR0FBQSxFQUFLLFNBQUE7QUFDSCxRQUFBO0lBQUEsYUFBQSxHQUFnQixDQUFBLENBQUUsSUFBSSxDQUFDLE9BQVA7SUFDaEIsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsSUFBdEIsRUFBNEIsR0FBNUIsRUFDRTtNQUFBLEtBQUEsRUFBTyxhQUFQO0tBREY7V0FHQTtFQUxHLENBQUw7Q0FERjs7QUFVQSxNQUFNLENBQUMsT0FBUCxHQUFpQixFQUFFLENBQUMsSUFBSCxHQUFVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG5cclxuIyAjIGRvbVxyXG5cclxuXHJcbiMgRXh0ZW5kIGFuIG9iamVjdCB3aXRoIE9KIERPTSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXHJcblxyXG5tZXRob2RzID0ge31cclxuXHJcblxyXG4jIC0gYEBlbGAgT2JqZWN0IHRvIGV4dGVuZFxyXG4jIC0gYHBhcmVudGAgcGFyZW50IG9iamVjdCB0byB3aGljaCBgQGVsYCB3aWxsIGJlIGFwcGVuZGVkXHJcbmNsYXNzIE5vZGVcclxuICBcclxuICAjcGFyZW50OiByZXF1aXJlKCcuL2JvZHknKVxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yOiAocGFyZW50KSAtPlxyXG5cclxuICBtYWtlOiAodGFnTmFtZSwgb3B0aW9ucykgLT5cclxuICAgIGlmIHRhZ05hbWUubWFrZSAjIHByb3ZpZGVkIGEgY3VzdG9tIGNvbXBvbmVudCBkaXJlY3RseVxyXG4gICAgICB0YWdOYW1lLm1ha2UgdGhpcywgb3B0aW9uc1xyXG4gICAgZWxzZVxyXG4gICAgICBtZXRob2QgPSBtZXRob2RzW3RhZ05hbWVdXHJcbiAgICAgIGlmIG1ldGhvZFxyXG4gICAgICAgIG1ldGhvZCBvcHRpb25zXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBtZXRob2QgPSBPSi5ub2Rlc1t0YWdOYW1lXSBvciBPSi5jb21wb25lbnRzW3RhZ05hbWVdIG9yIE9KLmNvbnRyb2xzW3RhZ05hbWVdIG9yIE9KLmlucHV0c1t0YWdOYW1lXVxyXG4gICAgICAgIGlmIG1ldGhvZCAmJiAhbWV0aG9kLmRlZmF1bHRCZWhhdmlvclxyXG4gICAgICAgICAgbWV0aG9kIG9wdGlvbnMsIHRoaXNcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBuZXdPSk5vZGUgPSBuZXcgTm9kZSgpXHJcbiAgICAgICAgICBuZXdPSk5vZGUuZWxlbWVudCA9IG9qQ3JlYXRlRWxlbWVudCBAZWxlbWVudCwgdGFnTmFtZSwgb3B0aW9uc1xyXG4gICAgICAgICAgbmV3T0pOb2RlXHJcblxyXG4gIGFkZDogKG5hbWUsIHZhbHVlKSAtPlxyXG4gICAgdGhpc1tuYW1lXSA9IHZhbHVlXHJcbiAgICAjIG1ha2Ugc3VyZSB3ZSBoYXZlIGEgbGluayBiYWNrIHRvIG91cnNlbHZlcywgc28gd2UgY2FuIGluaGVyaXQgdmFsdWVzXHJcbiAgICBAZWxlbWVudC5valdyYXBwZXIgPSB0aGlzXHJcblxyXG4gIGdldDogKG5hbWUpIC0+XHJcbiAgICB2YWx1ZSA9IHRoaXNbbmFtZV1cclxuICAgIGlmIHZhbHVlIGlzIHVuZGVmaW5lZFxyXG4gICAgICBwYXJlbnQgPSBAZWxlbWVudFxyXG4gICAgICB3aGlsZSBwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZVxyXG4gICAgICAgIGlmIHBhcmVudC5valdyYXBwZXJcclxuICAgICAgICAgIHJldHVybiBwYXJlbnQub2pXcmFwcGVyLmdldCBuYW1lXHJcbiAgICBlbHNlXHJcbiAgICAgIHZhbHVlXHJcblxyXG4gIHNob3c6ICgpIC0+XHJcbiAgICBAJC5zaG93KClcclxuICAgIG9qQ3JlYXRlRWxlbWVudC5vblNob3cgQGVsZW1lbnRcclxuXHJcbiAgZGlzYWJsZTogKCkgLT5cclxuICAgIEAkLmF0dHIgJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJ1xyXG4gICAgQCQuYWRkQ2xhc3MgJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJ1xyXG5cclxuICBlbmFibGU6ICgpIC0+XHJcbiAgICBAJC5yZW1vdmVBdHRyICAnZGlzYWJsZWQnXHJcbiAgICBAJC5yZW1vdmVDbGFzcyAnZGlzYWJsZWQnXHJcblxyXG5bXHJcbiAgJ29uJ1xyXG4gICdlbXB0eSdcclxuICAndGV4dCdcclxuICAncmVtb3ZlQ2xhc3MnXHJcbiAgJ2FkZENsYXNzJ1xyXG4gICdoYXNDbGFzcydcclxuICAnaGlkZSdcclxuICAnYXR0cidcclxuICAncmVtb3ZlQXR0cidcclxuICAnY3NzJ1xyXG4gICdyZW1vdmUnXHJcbiAgJ2FwcGVuZCdcclxuICAndmFsJ1xyXG4gICdodG1sJ1xyXG4gICdwcm9wJ1xyXG4gICd0cmlnZ2VyJ1xyXG5dLmZvckVhY2goKG1ldGhvZCkgLT5cclxuICBOb2RlLnByb3RvdHlwZVttZXRob2RdID0gKCkgLT5cclxuICAgIGpRdWVyeVdyYXBwZXIgPSBAJFxyXG4gICAgalF1ZXJ5V3JhcHBlclttZXRob2RdLmFwcGx5KGpRdWVyeVdyYXBwZXIsIGFyZ3VtZW50cylcclxuKVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLCAnJCcsXHJcbiAgZ2V0OiAoKSAtPlxyXG4gICAgalF1ZXJ5V3JhcHBlciA9ICQodGhpcy5lbGVtZW50KVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICckJyxcclxuICAgICAgdmFsdWU6IGpRdWVyeVdyYXBwZXJcclxuICAgIClcclxuICAgIGpRdWVyeVdyYXBwZXJcclxuKVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT0ouTm9kZSA9IE5vZGUiXX0=
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxub2RlRmFjdG9yeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEsaUZBQUE7RUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUNKLE9BQUEsR0FBVSxPQUFBLENBQVEsU0FBUjs7QUFDVixJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0FBK0VEO3dCQUVKLE1BQUEsR0FBUTs7RUFFUixXQUFDLENBQUEsR0FBRCxHQUFNLFNBQUMsRUFBRCxFQUFLLE9BQUw7QUFDSixRQUFBOztNQURTLFVBQVU7O0lBQ25CLEdBQUEsR0FBTTtJQUNOLEVBQUEsR0FBSyxRQUFRLENBQUMsY0FBVCxDQUF3QixFQUF4QjtJQUNMLElBQUcsRUFBSDtNQUNFLE1BQUEsR0FBUyxFQUFFLENBQUMsY0FBSCxDQUFrQixFQUFsQixFQUFzQixPQUF0QixFQURYOztJQUVBLElBQUcsTUFBSDtNQUNFLEdBQUEsR0FBVSxJQUFBLFdBQUEsQ0FBWSxJQUFaLEVBQWtCLElBQWxCLEVBQXdCLElBQXhCLEVBQThCLEtBQTlCLEVBQXFDLE1BQXJDLEVBRFo7O1dBR0E7RUFSSTs7d0JBVU4sUUFBQSxHQUFVLFNBQUMsT0FBRCxFQUFVLEtBQVY7V0FDUixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUMsSUFBRDtBQUNFLFlBQUE7UUFBQSxNQUFBLEdBQVMsRUFBRSxDQUFDLEtBQU0sQ0FBQSxPQUFBLENBQVQsSUFBcUIsRUFBRSxDQUFDLFVBQVcsQ0FBQSxPQUFBLENBQW5DLElBQStDLEVBQUUsQ0FBQyxRQUFTLENBQUEsT0FBQSxDQUEzRCxJQUF1RSxFQUFFLENBQUMsTUFBTyxDQUFBLE9BQUE7UUFDMUYsSUFBRyxNQUFIO1VBQ0UsRUFBQSxHQUFLLE1BQUEsQ0FBTyxJQUFQLEVBQWEsS0FBQyxDQUFBLE1BQWQsRUFEUDtTQUFBLE1BQUE7VUFHRSxFQUFBLEdBQUssRUFBRSxDQUFDLFNBQUgsQ0FBYSxJQUFiLEVBQW1CLEtBQUMsQ0FBQSxNQUFwQixFQUE0QixPQUE1QixFQUhQOztlQUtBO01BUEY7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO0VBRFE7O3dCQVVWLGFBQUEsR0FBZSxTQUFDLEtBQUQ7QUFDYixRQUFBO0lBQUEsSUFBRyxFQUFFLENBQUMsbUJBQU47TUFDRSxLQUFBLElBQVM7TUFDVCxJQUFHLEtBQUEsSUFBUyxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQW5CO1FBQThCLEtBQUEsR0FBUSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsR0FBZSxFQUFyRDs7TUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsR0FBZTtNQUVmLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLEtBQVIsQ0FBQSxDQUFQO1FBQ0UsRUFBQSxHQUFLLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBUCxDQUFBLENBQUEsSUFBa0I7UUFDdkIsRUFBQSxJQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixHQUFrQjtRQUN4QixJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsQ0FBYSxJQUFiLEVBQW1CLEVBQW5CLEVBSEY7T0FMRjs7RUFEYTs7d0JBWWYsV0FBQSxHQUFhLFNBQUE7SUFDWCxJQUFHLElBQUMsQ0FBQSxNQUFKO2FBQWdCLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxNQUFsQixFQUEwQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRCxFQUFNLEdBQU47QUFDeEMsY0FBQTtVQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjtVQUNYLElBQUcsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsR0FBaEIsQ0FBSDtZQUNFLFFBQUEsR0FBVyxTQUFBO0FBQWMsa0JBQUE7Y0FBYjtxQkFBYSxHQUFBLGFBQUksS0FBSjtZQUFkO1lBQ1gsS0FBQyxDQUFBLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBVixDQUFhLEdBQWIsRUFBa0IsUUFBbEI7WUFDQSxLQUFDLENBQUEsTUFBTSxDQUFDLEdBQVIsQ0FBWSxHQUFaLEVBQWlCLFFBQWpCO21CQUNBLEtBSkY7O1FBRndDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQixFQUFoQjs7RUFEVzs7RUFTQSxxQkFBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixNQUFqQixFQUF5QixRQUF6QjtJQUFDLElBQUMsQ0FBQSxNQUFEO0lBQU0sSUFBQyxDQUFBLFVBQUQ7SUFBVSxJQUFDLENBQUEsUUFBRDtJQUFRLElBQUMsQ0FBQSw4QkFBRCxXQUFZO0lBQ2hELElBQUcsSUFBQyxDQUFBLEdBQUQsSUFBUyxDQUFJLElBQUMsQ0FBQSxRQUFqQjtNQUNFLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsT0FBQSxDQUFRLElBQUMsQ0FBQSxHQUFULEVBQWMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxLQUF2QjtNQUNoQixJQUFDLENBQUEsUUFBUSxDQUFDLEdBQVYsQ0FBYyxTQUFkLEVBQXlCLElBQUMsQ0FBQSxHQUExQjtNQUNBLElBQUMsQ0FBQSxRQUFRLENBQUMsR0FBVixDQUFjLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBdkI7TUFDQSxJQUFHLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBWjtRQUFzQixJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBZSxJQUFDLENBQUEsT0FBTyxDQUFDLElBQXhCLEVBQXRCO09BSkY7O0lBTUEsSUFBRyxJQUFDLENBQUEsS0FBSjtNQUNFLElBQUMsQ0FBQSxJQUFELENBQUEsRUFERjs7RUFQVzs7d0JBVWIsYUFBQSxHQUFlLFNBQUMsS0FBRDtBQUNiLFFBQUE7SUFBQSxPQUFBLEdBQVUsRUFBRSxDQUFDLE1BQUgsQ0FBQTtJQUNWLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixHQUFlLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxPQUFELEVBQVUsSUFBVjtBQUNiLFlBQUE7UUFBQSxNQUFBLEdBQVMsT0FBUSxDQUFBLE9BQUE7UUFDakIsSUFBRyxDQUFJLE1BQVA7VUFDRSxNQUFBLEdBQVMsS0FBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLEtBQUMsQ0FBQSxNQUFwQixFQUE0QixLQUE1QjtVQUNULE9BQVEsQ0FBQSxPQUFBLENBQVIsR0FBbUIsT0FGckI7O2VBR0EsTUFBQSxDQUFPLElBQVA7TUFMYTtJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUE7V0FNZixJQUFDLENBQUE7RUFSWTs7d0JBVWYsSUFBQSxHQUFNLFNBQUE7QUFFSixRQUFBO0lBQUEsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUVWLHVDQUFZLENBQUUsb0JBQWQ7TUFBK0IsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsU0FBMUM7S0FBQSxNQUFBO01BT0UsSUFBQyxDQUFBLE1BQUQsR0FBYyxJQUFBLElBQUEsQ0FBSyxJQUFDLENBQUEsUUFBTixFQUFnQixJQUFDLENBQUEsS0FBakI7TUFDZCxLQUFBLEdBQVEsQ0FBQyxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsR0FBZSxDQUFoQixDQUFBLElBQXNCO01BRzlCLElBQUcsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLEtBQXVCLE1BQXZCLElBQWtDLENBQUksSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFoRCxJQUE0RCxDQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBM0U7UUFDRSxJQUFDLENBQUEsYUFBRCxDQUFlLEtBQWY7UUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsQ0FBYyxJQUFDLENBQUEsTUFBTyxDQUFBLENBQUEsQ0FBdEI7UUFFQSxJQUFDLENBQUEsV0FBRCxDQUFBLEVBSkY7O01BTUEsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUFWLEdBQW9CO01BQ3BCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixHQUFrQjtNQUdsQixJQUFDLENBQUEsYUFBRCxDQUFlLEtBQWY7TUFHQSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsR0FBc0I7TUFHdEIsUUFBQSxHQUFXLENBQUMsQ0FBQyxJQUFGLENBQU8sSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFSLElBQW9CLEVBQUUsQ0FBQyxJQUE5QjtNQUNYLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixHQUFtQjtNQUNuQixRQUFBLENBQVMsSUFBQyxDQUFBLE1BQVYsRUE3QkY7O1dBK0JBLElBQUMsQ0FBQTtFQW5DRzs7Ozs7O0FBcUNSLG9CQUFBLEdBQXVCLFNBQUMsTUFBRCxFQUFTLEdBQVQsRUFBYyxPQUFkO0FBQ3JCLE1BQUE7RUFBQSxVQUFBLEdBQWEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsR0FBdkI7RUFDYixJQUFHLE9BQUg7QUFDRTtBQUFBLFNBQUEsVUFBQTs7TUFDRSxVQUFVLENBQUMsWUFBWCxDQUF3QixHQUF4QixFQUE2QixLQUE3QjtBQURGO0FBRUE7QUFBQSxTQUFBLFdBQUE7O01BQ0UsQ0FBQSxDQUFFLFVBQUYsQ0FBYSxDQUFDLEVBQWQsQ0FBaUIsR0FBakIsRUFBc0IsS0FBdEI7QUFERjtBQUVBO0FBQUEsU0FBQSxXQUFBOztNQUNFLENBQUEsQ0FBRSxVQUFGLENBQWEsQ0FBQyxHQUFkLENBQWtCLEdBQWxCLEVBQXVCLEtBQXZCO0FBREY7SUFFQSxLQUFBLEdBQVEsT0FBTyxDQUFDO0lBQ2hCLElBQUcsS0FBQSxLQUFXLE1BQWQ7TUFDRSxDQUFBLENBQUUsVUFBRixDQUFhLENBQUMsSUFBZCxDQUFtQixLQUFuQixFQURGO0tBUkY7OzBCQVVBLE1BQU0sQ0FBRSxXQUFSLENBQW9CLFVBQXBCO0FBWnFCOztBQWN2QixrQkFBQSxHQUFxQixTQUFDLEdBQUQsRUFBTSxPQUFOLEVBQWUsS0FBZixFQUFzQixtQkFBdEIsRUFBMkMsSUFBM0M7QUFDbkIsTUFBQTtFQUFBLFNBQUEsR0FBZ0IsSUFBQSxJQUFBLENBQUE7RUFDaEIsSUFBRyxDQUFDLE1BQU0sQ0FBQyxlQUFYO0lBQ0UsTUFBTSxDQUFDLGVBQVAsR0FBeUIscUJBRDNCOztFQUVBLFNBQVMsQ0FBQyxPQUFWLEdBQW9CLGVBQUEsQ0FBZ0IsS0FBSyxDQUFDLE9BQXRCLEVBQStCLEdBQUEsSUFBTyxLQUF0QyxFQUE2QyxPQUE3QztTQUNwQjtBQUxtQjs7QUFPckIsRUFBRSxDQUFDLFFBQUgsQ0FBWSxhQUFaLEVBQTJCLGtCQUEzQjs7QUFFQSxJQUFBLEdBQU8sU0FBQyxHQUFELEVBQU0sT0FBTjtBQUNMLE1BQUE7RUFBQSxTQUFBLEdBQWdCLElBQUEsSUFBQSxDQUFBO0VBQ2hCLFNBQVMsQ0FBQyxPQUFWLEdBQW9CLGVBQUEsQ0FBZ0IsSUFBaEIsRUFBc0IsR0FBQSxJQUFPLEtBQTdCLEVBQW9DLE9BQXBDO1NBQ3BCO0FBSEs7O0FBS1AsRUFBRSxDQUFDLFFBQUgsQ0FBWSxNQUFaLEVBQW9CLElBQXBCOztBQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xyXG5UaGluRE9NID0gcmVxdWlyZSAndGhpbmRvbSdcclxuTm9kZSA9IHJlcXVpcmUgJy4vbm9kZSdcclxuXHJcbiNjbG9zZWQgPSAnYSBhYmJyIGFjcm9ueW0gYWRkcmVzcyBhcHBsZXQgYXJ0aWNsZSBhc2lkZSBhdWRpbyBiIGJkbyBiaWcgYmxvY2txdW90ZSBib2R5IGJ1dHRvbiBjYW52YXMgY2FwdGlvbiBjZW50ZXIgY2l0ZSBjb2RlIGNvbGdyb3VwIGNvbW1hbmQgZGF0YWxpc3QgZGQgZGVsIGRldGFpbHMgZGZuIGRpciBkaXYgZGwgZHQgZW0gZW1iZWQgZmllbGRzZXQgZmlnY2FwdGlvbiBmaWd1cmUgZm9udCBmb290ZXIgZm9ybSBmcmFtZXNldCBoMSBoMiBoMyBoNCBoNSBoNiBoZWFkIGhlYWRlciBoZ3JvdXAgaHRtbCBpIGlmcmFtZSBpbnMga2V5Z2VuIGtiZCBsYWJlbCBsZWdlbmQgbGkgbWFwIG1hcmsgbWVudSBtZXRlciBuYXYgbm9mcmFtZXMgbm9zY3JpcHQgb2JqZWN0IG9sIG9wdGdyb3VwIG9wdGlvbiBvdXRwdXQgcCBwcmUgcHJvZ3Jlc3MgcSBycCBydCBydWJ5IHMgc2FtcCBzY3JpcHQgc2VjdGlvbiBzZWxlY3Qgc21hbGwgc291cmNlIHNwYW4gc3RyaWtlIHN0cm9uZyBzdHlsZSBzdWIgc3VtbWFyeSBzdXAgdGFibGUgdGJvZHkgdGQgdGV4dGFyZWEgdGZvb3QgdGggdGhlYWQgdGltZSB0aXRsZSB0ciB0dCB1IHVsIHZhciB2aWRlbyB3YnIgeG1wJy5zcGxpdCAnICdcclxuI29wZW4gPSAnYXJlYSBiYXNlIGJyIGNvbCBjb21tYW5kIGNzcyAhRE9DVFlQRSBlbWJlZCBociBpbWcgaW5wdXQga2V5Z2VuIGxpbmsgbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyJy5zcGxpdCAnICdcclxuI1xyXG4jbmVzdGFibGVOb2RlTmFtZXMgPSBbXHJcbiMgICdkaXYnXHJcbiMgICdzcGFuJ1xyXG4jICAnaDEnXHJcbiMgICdoMidcclxuIyAgJ2gzJ1xyXG4jICAnaDQnXHJcbiMgICdoNSdcclxuIyAgJ2g2J1xyXG4jICAncCdcclxuIyAgJ2ZpZWxkc2V0J1xyXG4jICAnc2VsZWN0J1xyXG4jICAnb2wnXHJcbiMgICd1bCdcclxuIyAgJ3RhYmxlJ1xyXG4jXVxyXG4jXHJcbiMjVGhpcyBsaXN0IGlzIG5vdCB5ZXQgZXhoYXVzdGl2ZSwganVzdCBleGNsdWRlIHRoZSBvYnZpb3VzXHJcbiNub25OZXN0YWJsZU5vZGVzID0gW1xyXG4jICAnbGknXHJcbiMgICdsZWdlbmQnXHJcbiMgICd0cidcclxuIyAgJ3RkJ1xyXG4jICAnb3B0aW9uJ1xyXG4jICAnYm9keSdcclxuIyAgJ2hlYWQnXHJcbiMgICdzb3VyY2UnXHJcbiMgICd0Ym9keSdcclxuIyAgJ3Rmb290J1xyXG4jICAndGhlYWQnXHJcbiMgICdsaW5rJ1xyXG4jICAnc2NyaXB0J1xyXG4jXVxyXG4jXHJcbiNub2RlTmFtZXMgPSBbXHJcbiMgICdhJ1xyXG4jICAnYidcclxuIyAgJ2JyJ1xyXG4jICAnYnV0dG9uJ1xyXG4jICAnZGl2J1xyXG4jICAnZW0nXHJcbiMgICdmaWVsZHNldCdcclxuIyAgJ2Zvcm0nXHJcbiMgICdoMSdcclxuIyAgJ2gyJ1xyXG4jICAnaDMnXHJcbiMgICdoNCdcclxuIyAgJ2g1J1xyXG4jICAnaDYnXHJcbiMgICdpJ1xyXG4jICAnaW1nJ1xyXG4jICAnaW5wdXQnXHJcbiMgICdsYWJlbCdcclxuIyAgJ2xlZ2VuZCdcclxuIyAgJ2xpJ1xyXG4jICAnbmF2J1xyXG4jICAnb2wnXHJcbiMgICdvcHRpb24nXHJcbiMgICdwJ1xyXG4jICAnc2VsZWN0J1xyXG4jICAnc3BhbidcclxuIyAgJ3N0cm9uZydcclxuIyAgJ3N1cCdcclxuIyAgJ3N2ZydcclxuIyAgJ3RhYmxlJ1xyXG4jICAndGJvZHknXHJcbiMgICd0ZCdcclxuIyAgJ3RleHRhcmVhJ1xyXG4jICAndGgnXHJcbiMgICd0aGVhZCdcclxuIyAgJ3RyJ1xyXG4jICAndWwnXHJcbiNdXHJcblxyXG5jbGFzcyBOb2RlRmFjdG9yeVxyXG4gIFxyXG4gIG9qTm9kZTogbnVsbFxyXG4gIFxyXG4gIEBnZXQ6IChpZCwgdGFnTmFtZSA9ICdkaXYnKSAtPlxyXG4gICAgcmV0ID0gbnVsbFxyXG4gICAgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCBpZFxyXG4gICAgaWYgZWxcclxuICAgICAgdGhpbkVsID0gT0oucmVzdG9yZUVsZW1lbnQgZWwsIHRhZ05hbWVcclxuICAgIGlmIHRoaW5FbFxyXG4gICAgICByZXQgPSBuZXcgTm9kZUZhY3RvcnkgbnVsbCwgbnVsbCwgbnVsbCwgZmFsc2UsIHRoaW5FbFxyXG5cclxuICAgIHJldFxyXG4gIFxyXG4gIF9tYWtlQWRkOiAodGFnTmFtZSwgY291bnQpIC0+XHJcbiAgICAob3B0cykgPT5cclxuICAgICAgbWV0aG9kID0gT0oubm9kZXNbdGFnTmFtZV0gb3IgT0ouY29tcG9uZW50c1t0YWdOYW1lXSBvciBPSi5jb250cm9sc1t0YWdOYW1lXSBvciBPSi5pbnB1dHNbdGFnTmFtZV1cclxuICAgICAgaWYgbWV0aG9kXHJcbiAgICAgICAgbnUgPSBtZXRob2Qgb3B0cywgQG9qTm9kZVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgbnUgPSBPSi5jb21wb25lbnQgbnVsbCwgQG9qTm9kZSwgdGFnTmFtZVxyXG4gICAgICAjcmV0ID0gbmV3IE5vZGVGYWN0b3J5IG51LCBAdGhpbk5vZGUsIGNvdW50XHJcbiAgICAgIG51XHJcbiAgXHJcbiAgX21ha2VVbmlxdWVJZDogKGNvdW50KSAtPlxyXG4gICAgaWYgT0ouR0VORVJBVEVfVU5JUVVFX0lEU1xyXG4gICAgICBjb3VudCArPSAxXHJcbiAgICAgIGlmIGNvdW50IDw9IEBvd25lci5jb3VudCB0aGVuIGNvdW50ID0gQG93bmVyLmNvdW50ICsgMVxyXG4gICAgICBAb3duZXIuY291bnQgPSBjb3VudFxyXG5cclxuICAgICAgaWYgbm90IEBvak5vZGUuZ2V0SWQoKVxyXG4gICAgICAgIGlkID0gQG93bmVyLmdldElkKCkgb3IgJydcclxuICAgICAgICBpZCArPSBAb2pOb2RlLnRhZ05hbWUgKyBjb3VudFxyXG4gICAgICAgIEBvak5vZGUuYXR0ciAnaWQnLCBpZFxyXG4gICAgcmV0dXJuXHJcbiAgXHJcbiAgX2JpbmRFdmVudHM6IC0+XHJcbiAgICBpZiBAb2pOb2RlIHRoZW4gXy5mb3JPd24gQG9wdGlvbnMuZXZlbnRzLCAodmFsLCBrZXkpID0+XHJcbiAgICAgIGlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXHJcbiAgICAgIGlmIGlzTWV0aG9kLm1ldGhvZCB2YWxcclxuICAgICAgICBjYWxsYmFjayA9IChldmVudC4uLikgLT4gdmFsIGV2ZW50Li4uXHJcbiAgICAgICAgQG9qTm9kZS4kLm9uIGtleSwgY2FsbGJhY2tcclxuICAgICAgICBAb2pOb2RlLmFkZCBrZXksIGNhbGxiYWNrXHJcbiAgICAgICAgbnVsbFxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yOiAoQHRhZywgQG9wdGlvbnMsIEBvd25lciwgQHRoaW5Ob2RlID0gbnVsbCkgLT5cclxuICAgIGlmIEB0YWcgYW5kIG5vdCBAdGhpbk5vZGVcclxuICAgICAgQHRoaW5Ob2RlID0gbmV3IFRoaW5ET00gQHRhZywgQG9wdGlvbnMucHJvcHNcclxuICAgICAgQHRoaW5Ob2RlLmFkZCAndGFnTmFtZScsIEB0YWdcclxuICAgICAgQHRoaW5Ob2RlLmNzcyBAb3B0aW9ucy5zdHlsZXNcclxuICAgICAgaWYgQG9wdGlvbnMudGV4dCB0aGVuIEB0aGluTm9kZS50ZXh0IEBvcHRpb25zLnRleHRcclxuICAgIFxyXG4gICAgaWYgQG93bmVyXHJcbiAgICAgIEBtYWtlKClcclxuICBcclxuICBhZGRNYWtlTWV0aG9kOiAoY291bnQpIC0+XHJcbiAgICBtZXRob2RzID0gT0oub2JqZWN0KClcclxuICAgIEBvak5vZGUubWFrZSA9ICh0YWdOYW1lLCBvcHRzKSA9PlxyXG4gICAgICBtZXRob2QgPSBtZXRob2RzW3RhZ05hbWVdXHJcbiAgICAgIGlmIG5vdCBtZXRob2RcclxuICAgICAgICBtZXRob2QgPSBAX21ha2VBZGQgdGFnTmFtZSwgQG9qTm9kZSwgY291bnRcclxuICAgICAgICBtZXRob2RzW3RhZ05hbWVdID0gbWV0aG9kXHJcbiAgICAgIG1ldGhvZCBvcHRzXHJcbiAgICBAb2pOb2RlXHJcblxyXG4gIG1ha2U6IC0+XHJcblxyXG4gICAgQG9qTm9kZSA9IG51bGxcclxuXHJcbiAgICBpZiBAdGhpbk5vZGU/LmlzRnVsbHlJbml0IHRoZW4gQG9qTm9kZSA9IEB0aGluTm9kZVxyXG4gIFxyXG4gICAgIyAyOiBJZiB0aGUgZWxlbWVudCBoYXMgbmV2ZXIgYmVlbiBpbml0aWFsaXplZCwgY29udGludWVcclxuICAgIGVsc2VcclxuICAgICAgIyAzOiBBcyBsb25nIGFzIHRoZSBlbGVtZW50IGlzbid0IHRoZSBib2R5IG5vZGUsIGNvbnRpbnVlXHJcbiAgICAgICMgaWYgZWwudGFnTmFtZSBpc250ICdib2R5J1xyXG4gICAgICAjIDQ6IEV4dGVuZCB0aGUgZWxlbWVudCB3aXRoIHN0YW5kYXJkIGpRdWVyeSBBUEkgbWV0aG9kc1xyXG4gICAgICBAb2pOb2RlID0gbmV3IE5vZGUgQHRoaW5Ob2RlLCBAb3duZXJcclxuICAgICAgY291bnQgPSAoQG93bmVyLmNvdW50ICsgMSkgfHwgMVxyXG4gICAgICAjIDU6IElmIHRoZSBub2RlIGlzbid0IGluIHRoZSBET00sIGFwcGVuZCBpdCB0byB0aGUgcGFyZW50XHJcbiAgICAgICMgVGhpcyBhbHNvIGFjY29tbW9kYXRlcyBkb2N1bWVudCBmcmFnbWVudHMsIHdoaWNoIGFyZSBub3QgaW4gdGhlIERPTSBidXQgYXJlIHByZXN1bWVkIHRvIGJlIHNvdW5kIHVudGlsIHJlYWR5IGZvciBtYW51YWwgaW5zZXJ0aW9uXHJcbiAgICAgIGlmIEB0aGluTm9kZS50YWdOYW1lIGlzbnQgJ2JvZHknIGFuZCBub3QgQHRoaW5Ob2RlLmlzSW5ET00gYW5kIG5vdCBAb2pOb2RlLmlzSW5ET01cclxuICAgICAgICBAX21ha2VVbmlxdWVJZCBjb3VudFxyXG4gICAgICAgIEBvd25lci5hcHBlbmQgQG9qTm9kZVswXVxyXG4gICAgICAgICMgNjogQmluZCBhbnkgZGVmaW5lZCBldmVudHMgYWZ0ZXIgdGhlIG5vZGUgaXMgaW4gdGhlIERPTVxyXG4gICAgICAgIEBfYmluZEV2ZW50cygpXHJcbiAgICAgICAgXHJcbiAgICAgIEB0aGluTm9kZS5pc0luRE9NID0gdHJ1ZVxyXG4gICAgICBAb2pOb2RlLmlzSW5ET00gPSB0cnVlXHJcblxyXG4gICAgICAjIDc6IENyZWF0ZSB0aGUgYWxsIGltcG9ydGFudCAnbWFrZScgbWV0aG9kXHJcbiAgICAgIEBhZGRNYWtlTWV0aG9kIGNvdW50XHJcblxyXG4gICAgICAjIDg6IFByZXZlbnQgZHVwbGljYXRlIGZhY3RvcnkgZXh0ZW5zaW9uIGJ5IHNldHRpbmcgaXMgaW5pdCA9IHRydWVcclxuICAgICAgQG9qTm9kZS5pc0Z1bGx5SW5pdCA9IHRydWVcclxuXHJcbiAgICAgICMgOTogaWYgdGhlIG5vZGUgc3VwcG9ydHMgaXQsIGNhbGwgZmluYWxpemVcclxuICAgICAgZmluYWxpemUgPSBfLm9uY2UgQG9qTm9kZS5maW5hbGl6ZSBvciBPSi5ub29wXHJcbiAgICAgIEBvak5vZGUuZmluYWxpemUgPSBmaW5hbGl6ZVxyXG4gICAgICBmaW5hbGl6ZSBAb2pOb2RlXHJcbiAgICAjIDEwOiBSZXR1cm4gdGhlIGV4dGVuZGVkIGVsZW1lbnRcclxuICAgIEBvak5vZGVcclxuXHJcbmRlZmF1bHRDcmVhdGVFbGVtZW50ID0gKHBhcmVudCwgdGFnLCBvcHRpb25zKSAtPlxyXG4gIG5ld0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IHRhZ1xyXG4gIGlmIG9wdGlvbnNcclxuICAgIGZvciBrZXksIHZhbHVlIG9mIG9wdGlvbnMucHJvcHNcclxuICAgICAgbmV3RWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSlcclxuICAgIGZvciBrZXksIHZhbHVlIG9mIG9wdGlvbnMuZXZlbnRzXHJcbiAgICAgICQobmV3RWxlbWVudCkub24oa2V5LCB2YWx1ZSlcclxuICAgIGZvciBrZXksIHZhbHVlIG9mIG9wdGlvbnMuc3R5bGVzXHJcbiAgICAgICQobmV3RWxlbWVudCkuY3NzKGtleSwgdmFsdWUpXHJcbiAgICB2YWx1ZSA9IG9wdGlvbnMudGV4dFxyXG4gICAgaWYgdmFsdWUgaXNudCB1bmRlZmluZWRcclxuICAgICAgJChuZXdFbGVtZW50KS50ZXh0KHZhbHVlKVxyXG4gIHBhcmVudD8uYXBwZW5kQ2hpbGQobmV3RWxlbWVudClcclxuXHJcbmdldE5vZGVGcm9tRmFjdG9yeSA9ICh0YWcsIG9wdGlvbnMsIG93bmVyLCBpc0NhbGxlZEZyb21GYWN0b3J5LCBub2RlKSAtPlxyXG4gIG5ld09KTm9kZSA9IG5ldyBOb2RlKClcclxuICBpZiAhd2luZG93Lm9qQ3JlYXRlRWxlbWVudFxyXG4gICAgd2luZG93Lm9qQ3JlYXRlRWxlbWVudCA9IGRlZmF1bHRDcmVhdGVFbGVtZW50XHJcbiAgbmV3T0pOb2RlLmVsZW1lbnQgPSBvakNyZWF0ZUVsZW1lbnQob3duZXIuZWxlbWVudCwgdGFnIHx8ICdkaXYnLCBvcHRpb25zKVxyXG4gIG5ld09KTm9kZVxyXG5cclxuT0oucmVnaXN0ZXIgJ25vZGVGYWN0b3J5JywgZ2V0Tm9kZUZyb21GYWN0b3J5XHJcblxyXG5tYWtlID0gKHRhZywgb3B0aW9ucykgLT5cclxuICBuZXdPSk5vZGUgPSBuZXcgTm9kZSgpXHJcbiAgbmV3T0pOb2RlLmVsZW1lbnQgPSBvakNyZWF0ZUVsZW1lbnQobnVsbCwgdGFnIHx8ICdkaXYnLCBvcHRpb25zKVxyXG4gIG5ld09KTm9kZVxyXG5cclxuT0oucmVnaXN0ZXIgJ21ha2UnLCBtYWtlXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ2V0Tm9kZUZyb21GYWN0b3J5XHJcbiJdfQ==
},{"../oj":58,"../tools/is":67,"./node":22}],24:[function(require,module,exports){
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



},{"../dom/nodeFactory":23,"../oj":58,"../tools/to":72}],26:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHRhYmxlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsV0FBQSxHQUFjLE9BQUEsQ0FBUSxvQkFBUjs7QUFDZCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osT0FBQSxHQUFVLE9BQUEsQ0FBUSxrQkFBUjs7QUFDVixDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0FBQ0osV0FBQSxHQUFjLE9BQUEsQ0FBUSxzQkFBUjs7QUFJZCxRQUFBLEdBQVc7OztBQUVYOzs7O0FBR0EsSUFBQSxHQUFPLFNBQUMsT0FBRCxFQUFVLEtBQVYsRUFBMkIsaUJBQTNCO0FBR0wsTUFBQTs7SUFIZSxRQUFRLEVBQUUsQ0FBQzs7O0lBQU0sb0JBQW9COztFQUdwRCxRQUFBLEdBR0U7SUFBQSxJQUFBLEVBQU0sSUFBTjtJQUdBLEtBQUEsRUFDRTtNQUFBLFdBQUEsRUFBYSxDQUFiO01BQ0EsV0FBQSxFQUFhLENBRGI7TUFFQSxLQUFBLEVBQU8sRUFGUDtNQUdBLEtBQUEsRUFBTyxFQUhQO01BSUEsU0FBQSxFQUFXLE1BSlg7TUFLQSxVQUFBLEVBQVksS0FMWjtNQU1BLE9BQUEsRUFBTyxFQU5QO0tBSkY7SUFXQSxNQUFBLEVBQVEsRUFYUjtJQVlBLE1BQUEsRUFBUSxFQVpSO0lBZUEsS0FBQSxFQUNFO01BQUEsT0FBQSxFQUFPLEVBQVA7TUFDQSxLQUFBLEVBQU8sRUFEUDtNQUVBLGdCQUFBLEVBQWtCLEVBRmxCO01BR0EsV0FBQSxFQUFhLEVBSGI7TUFJQSxNQUFBLEVBQVEsRUFKUjtLQWhCRjtJQXVCQSxLQUFBLEVBQU8sRUF2QlA7SUEwQkEsS0FBQSxFQUFPLEVBMUJQO0lBNEJBLGVBQUEsRUFBaUIsS0E1QmpCO0lBNkJBLGFBQUEsRUFBZSxLQTdCZjs7RUErQkYsSUFBQSxHQUFPO0VBQ1AsS0FBQSxH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UyxFQUFFLENBQUMsTUFBSCxDQUFVO1lBQUMsS0FBQSxFQUFPLFFBQVEsQ0FBQyxLQUFqQjtXQUFWLEVBQW1DLElBQW5DO1VBQ1QsSUFBQSxHQUFPLEdBQUcsQ0FBQyxJQUFKLENBQVMsS0FBVCxFQUFnQixNQUFoQixFQUZUO1NBQUEsTUFBQTtVQUlFLE9BQUEsR0FBVSxLQUFLLENBQUMsR0FBTixDQUFVLEtBQVYsRUFBaUIsQ0FBakI7VUFDVixJQUFHLENBQUksT0FBUDtZQUNFLE9BQUEsR0FBVyxHQUFHLENBQUMsSUFBSixDQUFTLENBQVQsRUFBWTtjQUFBLEtBQUEsRUFBTyxRQUFRLENBQUMsS0FBaEI7YUFBWixFQURiO1dBTEY7O01BRkYsQ0FGRjs7V0FZQTtFQXJCYyxDQUFoQjtFQXlCQSxJQUFBLENBQUE7RUFJQSxHQUFHLENBQUMsR0FBSixDQUFRLE9BQVIsRUFBaUIsS0FBakI7RUFJQSxHQUFHLENBQUMsR0FBSixDQUFRLE9BQVIsRUFBaUIsS0FBakI7U0FJQTtBQWhMSzs7QUFrTFAsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLFFBQWxCLEVBQTRCLElBQTVCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuYXJyYXkyRCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FycmF5MkQnXHJcbiQgPSByZXF1aXJlICdqcXVlcnknXHJcbkpzb25Ub1RhYmxlID0gcmVxdWlyZSAnLi4vdG9vbHMvSnNvblRvVGFibGUnXHJcblxyXG4jICMgdGFibGVcclxuXHJcbm5vZGVOYW1lID0gJ3RhYmxlJ1xyXG5cclxuIyMjXHJcbkNyZWF0ZSBhbiBIVE1MIHRhYmxlLiBQcm92aWRlcyBoZWxwZXIgbWV0aG9kcyB0byBjcmVhdGUgQ29sdW1ucyBhbmQgQ2VsbHMuXHJcbiMjI1xyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgIyAjIyBvcHRpb25zXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgIyAjIyMgZGF0YVxyXG4gICAgIyBvcHRpb25hbCBhcnJheSBvZiBvYmplY3RzLiBpZiBwcm92aWRlZCB3aWxsIGdlbmVyYXRlIHRhYmxlIGF1dG9tYXRpY2FsbHkuXHJcbiAgICBkYXRhOiBudWxsXHJcbiAgICAjICMjIyBwcm9wc1xyXG4gICAgIyBvcHRpb25hbCBwcm9wZXJ0aWVzIHRvIGFwcGx5IHRvIHRhYmxlIHJvb3Qgbm9kZVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNlbGxwYWRkaW5nOiAwXHJcbiAgICAgIGNlbGxzcGFjaW5nOiAwXHJcbiAgICAgIGFsaWduOiAnJ1xyXG4gICAgICB3aWR0aDogJydcclxuICAgICAgY2VsbGFsaWduOiAnbGVmdCdcclxuICAgICAgY2VsbHZhbGlnbjogJ3RvcCdcclxuICAgICAgY2xhc3M6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6IHt9XHJcbiAgICAjICMjIyBjZWxsc1xyXG4gICAgIyBvcHRpb25hbCBwcm9wZXJ0aWVzIHRvIGFwcGx5IHRvIGluZGl2aWR1YWwgY2VsbHNcclxuICAgIGNlbGxzOlxyXG4gICAgICBjbGFzczogJydcclxuICAgICAgYWxpZ246ICcnXHJcbiAgICAgICd2ZXJ0aWNhbC1hbGlnbic6ICcnXHJcbiAgICAgIGNlbGxwYWRkaW5nOiAnJ1xyXG4gICAgICBtYXJnaW46ICcnXHJcbiAgICAjICMjIyB0aGVhZFxyXG4gICAgIyBvcHRpb25hbCBvcHRpb25zIG9iamVjdCB0byBwYXNzIGludG8gdGhlYWQgY3JlYXRpb25cclxuICAgIHRoZWFkOiB7fVxyXG4gICAgIyAjIyMgdGJvZHlcclxuICAgICMgb3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdG8gcGFzcyBpbnRvIHRib2R5IGNyZWF0aW9uXHJcbiAgICB0Ym9keToge31cclxuXHJcbiAgICBmaXJzdEFsaWduUmlnaHQ6IGZhbHNlXHJcbiAgICBvZGRBbGlnblJpZ2h0OiBmYWxzZVxyXG5cclxuICByb3dzID0gW11cclxuICBjZWxscyA9IGFycmF5MkQoKVxyXG4gIGNvbHVtbkNvdW50ID0gMFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG4gXHJcblxyXG4gIHRib2R5ID0gbnVsbFxyXG4gIHRoZWFkID0gbnVsbFxyXG4gIHRoZWFkUm93ID0gbnVsbFxyXG5cclxuICAjICMjIyBpbml0XHJcbiAgIyBpbnRlcm5hbCBtZXRob2QgZm9yIG9uZSB0aW1lIGluaXRpYWxpemF0aW9uIG9mIHRoZSB0YWJsZVxyXG4gIGluaXQgPSBfLm9uY2UgLT5cclxuICAgIGlmIGRlZmF1bHRzLmRhdGFcclxuICAgICAgajJ0ID0gbmV3IEpzb25Ub1RhYmxlIGRlZmF1bHRzLmRhdGFcclxuICAgICAgdGJsU3RyID0gajJ0LnRhYmxlXHJcbiAgICBpZiB0YmxTdHJcclxuICAgICAgalRibCA9ICQgdGJsU3RyXHJcblxyXG4gICAgICBqSGVhZCA9IGpUYmwuZmluZCAndGhlYWQnXHJcbiAgICAgIHJldC4kLmFwcGVuZCBqSGVhZFxyXG4gICAgICB0aGVhZCA9IGVsLnJlc3RvcmVFbGVtZW50IGpIZWFkWzBdXHJcbiAgICAgIHRoZWFkUm93ID0gZWwucmVzdG9yZUVsZW1lbnQgdGhlYWRbMF0ucm93c1swXVxyXG5cclxuICAgICAgakJvZHkgPSBqVGJsLmZpbmQgJ3Rib2R5J1xyXG4gICAgICByZXQuJC5hcHBlbmQgakJvZHlcclxuICAgICAgdGJvZHkgPSBlbC5yZXN0b3JlRWxlbWVudCBqQm9keVswXVxyXG5cclxuICAgICAgbG9hZENlbGxzKClcclxuICAgIGVsc2VcclxuICAgICAgdGhlYWQgPSByZXQubWFrZSAndGhlYWQnLCBkZWZhdWx0cy50aGVhZFxyXG4gICAgICB0aGVhZFJvdyA9IHRoZWFkLm1ha2UgJ3RyJ1xyXG4gICAgICB0Ym9keSA9IHJldC5tYWtlICd0Ym9keScsIGRlZmF1bHRzLnRib2R5XHJcbiAgICAgIHJvd3MucHVzaCB0Ym9keS5tYWtlICd0cidcclxuICAgIHJldFxyXG5cclxuICAjICMjIyBsb2FkQ2VsbHNcclxuICAjIGludGVybmFsIG1ldGhvZCBndWFyYW50ZWVzIHRoYXQgdGFibGVzIGxvYWRlZCBmcm9tIEpTT04gYXJlIGZ1bGx5IGxvYWRlZCBpbnRvIG1lbW9yeVxyXG4gIGxvYWRDZWxscyA9ICgpIC0+XHJcbiAgICByID0gMFxyXG4gICAgd2hpbGUgdGJvZHlbMF0ucm93cy5sZW5ndGggPiByXHJcbiAgICAgIGMgPSAwXHJcbiAgICAgIG1lbVJvdyA9IGVsLnJlc3RvcmVFbGVtZW50IHRib2R5WzBdLnJvd3Nbcl1cclxuICAgICAgcm93cy5wdXNoIG1lbVJvd1xyXG4gICAgICB3aGlsZSB0Ym9keVswXS5yb3dzW3JdLmNlbGxzLmxlbmd0aCA+IGNcclxuICAgICAgICBtZW1DZWxsID0gY2VsbHMuZ2V0IHIrMSwgYysxXHJcbiAgICAgICAgaWYgbm90IG1lbUNlbGxcclxuICAgICAgICAgIG1lbUNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCB0Ym9keVswXS5yb3dzW3JdLmNlbGxzW2NdXHJcbiAgICAgICAgICBjZWxscy5zZXQgcisxLCBjKzEsIG1lbUNlbGxcclxuICAgICAgICBjICs9IDFcclxuICAgICAgciArPSAxXHJcblxyXG4gICMgIyMjIGZpbGxNaXNzaW5nXHJcbiAgIyBpbnRlcm5hbCBtZXRob2QgZ3VhcmFudGVlcyB0aGF0IGNlbGxzIGV4aXN0IGZvciB0aGUgZGltZW5zaW9ucyBvZiB0aGUgdGFibGVcclxuICBmaWxsTWlzc2luZyA9ICgpIC0+XHJcbiAgICBjZWxscy5lYWNoIChyb3dObywgY29sTm8sIHZhbCkgLT5cclxuICAgICAgaWYgbm90IHZhbFxyXG4gICAgICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cclxuICAgICAgICByb3cuY2VsbCBjb2xObywge31cclxuXHJcbiAgIyAjIyBjb2x1bW5cclxuICAjIEFkZHMgYSBjb2x1bW4gbmFtZSB0byB0aGUgdGFibGUgaGVhZFxyXG4gIHJldC5hZGQgJ2NvbHVtbicsIChjb2xObywgY29sTmFtZSkgLT5cclxuICAgIHJldC5pbml0KClcclxuICAgIGNvbHVtbkNvdW50ICs9IDFcclxuICAgIHRoID0gbnVsbFxyXG4gICAgaSA9IDBcclxuICAgIHdoaWxlIHRoZWFkWzBdLnJvd3NbMF0uY2VsbHMubGVuZ3RoIDwgY29sTm9cclxuICAgICAgbmF0aXZlVGggPSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzW2ldXHJcbiAgICAgIGlmIG5vdCBuYXRpdmVUaFxyXG4gICAgICAgIHRoID0gdGhlYWRSb3cubWFrZSAndGgnLCB7fVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudCBuYXRpdmVUaCwgJ3RoJ1xyXG4gICAgICBpICs9IDFcclxuICAgIGlmIG5vdCB0aFxyXG4gICAgICBuYXRpdmVUaCA9IHRoZWFkWzBdLnJvd3NbMF0uY2VsbHNbY29sTm8tMV1cclxuICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudCBuYXRpdmVUaCwgJ3RoJ1xyXG4gICAgdGgudGV4dCBjb2xOYW1lXHJcbiAgICB0aFxyXG5cclxuICAjICMjIHJvd1xyXG4gICMgQWRkcyBhIG5ldyByb3cgKHRyKSB0byB0aGUgdGFibGUgYm9keVxyXG4gIHJldC5hZGQgJ3JvdycsIChyb3dObywgb3B0cykgLT5cclxuICAgIHJvdyA9IHJvd3Nbcm93Tm8tMV1cclxuXHJcbiAgICBpZiBub3Qgcm93XHJcbiAgICAgIHdoaWxlIHJvd3MubGVuZ3RoIDwgcm93Tm9cclxuICAgICAgICByb3cgPSB0Ym9keS5tYWtlICd0cicsIHt9XHJcbiAgICAgICAgcm93cy5wdXNoIHJvd1xyXG5cclxuICAgIGlmIG5vdCByb3cuY2VsbFxyXG4gICAgICByb3cuYWRkICdjZWxsJywgKGNvbE5vLCBvcHRzKSAtPlxyXG4gICAgICAgIGNlbGwgPSBPSi5ub2Rlcy50ZCBvcHRzLCByb3dcclxuICAgICAgICBjZWxscy5zZXQgcm93Tm8sIGNvbE5vLCBjZWxsXHJcbiAgICAgICAgY2VsbFxyXG5cclxuICAgIHJvd1xyXG5cclxuICAjICMjIGNlbGxcclxuICAjIEFkZHMgYSBjZWxsICh0ci90ZCkgdG8gdGhlIHRhYmxlIGJvZHlcclxuICByZXQuYWRkICdjZWxsJywgKHJvd05vLCBjb2xObywgb3B0cykgLT5cclxuICAgIGlmIHJvd05vIDwgMSB0aGVuIHJvd05vID0gMVxyXG4gICAgaWYgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXHJcbiAgICBpZiBjb2x1bW5Db3VudCA+IDAgYW5kIGNvbE5vLTEgPiBjb2x1bW5Db3VudCB0aGVuIHRocm93IG5ldyBFcnJvciAnQSBjb2x1bW4gbmFtZSBoYXMgbm90IGJlZW4gZGVmaW5lZCBmb3IgdGhpcyBwb3NpdGlvbiB7JyArIHJvd05vICsgJ3gnICsgY29sTm8gKyAnfS4nXHJcblxyXG4gICAgcm93ID0gcmV0LnJvdyByb3dOb1xyXG5cclxuICAgIGNlbGwgPSBjZWxscy5nZXQgcm93Tm8sIGNvbE5vXHJcblxyXG4gICAgaWYgbm90IGNlbGxcclxuICAgICAgaSA9IDBcclxuICAgICAgd2hpbGUgaSA8IGNvbE5vXHJcbiAgICAgICAgaSArPSAxXHJcbiAgICAgICAgaWYgaSBpcyBjb2xOb1xyXG4gICAgICAgICAgbnVPcHRzID0gT0ouZXh0ZW5kIHtwcm9wczogZGVmYXVsdHMuY2VsbHN9LCBvcHRzXHJcbiAgICAgICAgICBjZWxsID0gcm93LmNlbGwgY29sTm8sIG51T3B0c1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHRyeUNlbGwgPSBjZWxscy5nZXQgcm93Tm8sIGlcclxuICAgICAgICAgIGlmIG5vdCB0cnlDZWxsXHJcbiAgICAgICAgICAgIHRyeUNlbGwgPSAgcm93LmNlbGwgaSwgcHJvcHM6IGRlZmF1bHRzLmNlbGxzXHJcblxyXG4gICAgY2VsbFxyXG5cclxuICAjICMjIEZpbmFsaXplXHJcbiAgIyBGaW5hbGl6ZSBndWFyYW50ZWVzIHRoYXQgdGhlYWQgYW5kIHRib2R5IGFuZCBjcmVhdGVkIHdoZW4gdGhlIG5vZGUgaXMgZnVsbHkgaW5zdGFudGlhdGVkXHJcbiAgaW5pdCgpXHJcblxyXG4gICMgIyMgVEhlYWRcclxuICAjIEV4cG9zZSB0aGUgaW50ZXJuYWwgdGhlYWQgbm9kZVxyXG4gIHJldC5hZGQgJ3RoZWFkJywgdGhlYWRcclxuXHJcbiAgIyAjIyBUQm9keVxyXG4gICMgRXhwb3NlIHRoZSBpbnRlcm5hbCB0Ym9keSBub2RlXHJcbiAgcmV0LmFkZCAndGJvZHknLCB0Ym9keVxyXG5cclxuICAgIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG4iXX0=
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZ2xvYmFsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxVQUFBLEdBQWEsQ0FBSyxPQUFPLE1BQVAsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdkMsR0FBb0QsTUFBcEQsR0FBZ0UsQ0FBSyxPQUFPLElBQVAsS0FBaUIsV0FBakIsSUFBaUMsSUFBckMsR0FBZ0QsSUFBaEQsR0FBMEQsQ0FBSyxPQUFPLE1BQVAsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdkMsR0FBb0QsTUFBcEQsR0FBZ0UsSUFBakUsQ0FBM0QsQ0FBakU7O0FBQ2IsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInRoaXNHbG9iYWwgPSAoaWYgKHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsKSB0aGVuIGdsb2JhbCBlbHNlIChpZiAodHlwZW9mIHNlbGYgaXNudCAndW5kZWZpbmVkJyBhbmQgc2VsZikgdGhlbiBzZWxmIGVsc2UgKGlmICh0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgYW5kIHdpbmRvdykgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkpXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXNHbG9iYWwiXX0=
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcb2ouY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxJQUFBOztBQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsVUFBUjs7QUFDYixPQUFBLEdBQVUsT0FBQSxDQUFRLFFBQVI7O0FBQ1YsYUFBQSxHQUFnQjs7O0FBRWhCOzs7O0FBR0EsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQU0sQ0FBQSxTQUE5QixFQUNFO0VBQUEsZUFBQSxFQUNFO0lBQUEsS0FBQSxFQUFPLFNBQUE7QUFDTCxVQUFBO01BQUEsYUFBQSxHQUFnQjtNQUNoQixPQUFBLEdBQVcsYUFBYyxDQUFDLElBQWhCLENBQXFCLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBLENBQXJCO01BQ1QsSUFBSSxPQUFBLElBQVksT0FBTyxDQUFDLE1BQVIsR0FBaUIsQ0FBakM7ZUFBeUMsT0FBUSxDQUFBLENBQUEsRUFBakQ7T0FBQSxNQUFBO2VBQXlELEdBQXpEOztJQUhJLENBQVA7R0FERjtDQURGOzs7QUFRQTs7OztBQUdBLE1BQUEsR0FBUzs7QUFDVCxZQUFBLEdBQWUsU0FBQTs7QUFFYjs7O0FBQUEsTUFBQTtFQUdBLGFBQUEsR0FBZ0IsU0FBQyxTQUFELEVBQVksSUFBWjs7QUFDZDs7O0FBQUEsUUFBQTtJQUdBLElBQUEsR0FBTyxTQUFDLE1BQUQ7QUFDTCxVQUFBO01BQUEsS0FBQSxHQUFRO01BQ1IsSUFBSyxDQUFBLE1BQUEsQ0FBTCxHQUFlLElBQUssQ0FBQSxNQUFBLENBQUwsSUFBZ0I7TUFDL0IsTUFBQSxHQUFTLElBQUssQ0FBQSxNQUFBO01BQ2QsT0FBQSxHQUFVO01BRVYsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsSUFBdEIsRUFBNEIsU0FBNUIsRUFBdUM7UUFBQSxLQUFBLEVBQU87O0FBRTlDOzs7V0FGdUM7T0FBdkM7TUFNQSxNQUFNLENBQUMsY0FBUCxDQUFzQixJQUF0QixFQUE0QixVQUE1QixFQUNFO1FBQUEs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LE1BQU0sQ0FBQyxjQUFQLENBQXNCLFVBQXRCLEVBQWtDLGFBQWxDLEVBQ0U7RUFBQSxLQUFBLEVBQU8sWUFBQSxDQUFBLENBQVA7Q0FERjs7QUFHQSxFQUFFLENBQUMsUUFBSCxDQUFZLFFBQVosRUFBc0IsVUFBdEI7O0FBRUEsWUFBQSxHQUFlOztBQUNmLElBQUcsT0FBTyxRQUFQLEtBQXFCLFdBQXhCO0VBQ0UsWUFBQSxHQUFlLFNBRGpCOzs7QUFHQSxFQUFFLENBQUMsUUFBSCxDQUFZLFVBQVosRUFBd0IsWUFBeEI7O0FBRUEsRUFBRSxDQUFDLFFBQUgsQ0FBWSxNQUFaLEVBQW9CLFNBQUEsR0FBQSxDQUFwQjs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiIyAjIE9KXG50aGlzR2xvYmFsID0gcmVxdWlyZSAnLi9nbG9iYWwnXG51dGlsTGliID0gcmVxdWlyZSAnanF1ZXJ5J1xubmFtZVNwYWNlTmFtZSA9ICdPSidcblxuIyMjXG5ib290IHN0cmFwIG5hbWUgbWV0aG9kIGludG8gT2JqZWN0IHByb3RvdHlwZVxuIyMjXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBPYmplY3Q6OixcbiAgZ2V0SW5zdGFuY2VOYW1lOlxuICAgIHZhbHVlOiAtPlxuICAgICAgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLnsxLH0pXFwoL1xuICAgICAgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKEBjb25zdHJ1Y3Rvci50b1N0cmluZygpKVxuICAgICAgKGlmIChyZXN1bHRzIGFuZCByZXN1bHRzLmxlbmd0aCA+IDEpIHRoZW4gcmVzdWx0c1sxXSBlbHNlICcnKVxuXG5cbiMjI1xuQW4gaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5hbWVzcGFjZSB0cmVlXG4jIyNcbk5zVHJlZSA9IHt9XG5tYWtlVGhlSnVpY2UgPSAtPlxuXG4gICMjI1xuICBJbnRlcm5hbCBuYW1lU3BhY2VOYW1lIG1ldGhvZCB0byBjcmVhdGUgbmV3ICdzdWInIG5hbWVzcGFjZXMgb24gYXJiaXRyYXJ5IGNoaWxkIG9iamVjdHMuXG4gICMjI1xuICBtYWtlTmFtZVNwYWNlID0gKHNwYWNlbmFtZSwgdHJlZSkgLT5cbiAgICAjIyNcbiAgICBUaGUgZGVyaXZlZCBpbnN0YW5jZSB0byBiZSBjb25zdHJ1Y3RlZFxuICAgICMjI1xuICAgIEJhc2UgPSAobnNOYW1lKSAtPlxuICAgICAgcHJvdG8gPSB0aGlzXG4gICAgICB0cmVlW25zTmFtZV0gPSB0cmVlW25zTmFtZV0gb3Ige31cbiAgICAgIG5zVHJlZSA9IHRyZWVbbnNOYW1lXVxuICAgICAgbWVtYmVycyA9IHt9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAnbWVtYmVycycsIHZhbHVlOiBtZW1iZXJzXG5cbiAgICAgICMjI1xuICAgICAgUmVnaXN0ZXIgKGUuZy4gJ0xpZnQnKSBhbiBPYmplY3QgaW50byB0aGUgcHJvdG90eXBlIG9mIHRoZSBuYW1lc3BhY2UuXG4gICAgICBUaGlzIE9iamVjdCB3aWxsIGJlIHJlYWRhYmxlL2V4ZWN1dGFibGUgYnV0IGlzIG90aGVyd2lzZSBpbW11dGFibGUuXG4gICAgICAjIyNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAncmVnaXN0ZXInLFxuICAgICAgICB2YWx1ZTogKG5hbWUsIG9iaiwgZW51bWVyYWJsZSkgLT5cbiAgICAgICAgICAndXNlIHN0cmljdCdcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsaWZ0IGEgbmV3IHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIG5hbWUgaXNudCAnc3RyaW5nJykgb3IgbmFtZSBpcyAnJ1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIHByb3BlcnR5IGluc3RhbmNlLicpICB1bmxlc3Mgb2JqXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9wZXJ0eSBuYW1lZCAnICsgbmFtZSArICcgaXMgYWxyZWFkeSBkZWZpbmVkIG9uICcgKyBzcGFjZW5hbWUgKyAnLicpICBpZiBwcm90b1tuYW1lXVxuXG4gICAgICAgICAgbWVtYmVyc1tuYW1lXSA9IG1lbWJlcnNbbmFtZV0gb3IgbmFtZVxuXG4gICAgICAgICAgI0d1YXJkIGFnYWluc3Qgb2JsaXRlcmF0aW5nIHRoZSB0cmVlIGFzIHRoZSB0cmVlIGlzIHJlY3Vyc2l2ZWx5IGV4dGVuZGVkXG4gICAgICAgICAgbnNUcmVlW25hbWVdID0gbnNUcmVlW25hbWVdIG9yXG4gICAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgICAgICB0eXBlOiB0eXBlb2Ygb2JqXG4gICAgICAgICAgICBpbnN0YW5jZTogKGlmIG9iai5nZXRJbnN0YW5jZU5hbWUgdGhlbiBvYmouZ2V0SW5zdGFuY2VOYW1lKCkgZWxzZSAndW5rbm93bicpXG5cbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgcHJvdG8sIG5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogb2JqXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSBpc250IGVudW1lcmFibGVcblxuICAgICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHNwYWNlbmFtZSArICcuJyArIG5hbWVcbiAgICAgICAgICBvYmpcblxuXG4gICAgICAjIyNcbiAgICAgIENyZWF0ZSBhIG5ldywgc3RhdGljIG5hbWVzcGFjZSBvbiB0aGUgY3VycmVudCBwYXJlbnQgKGUuZy4gbnNOYW1lLnRvLi4uIHx8IG5zTmFtZS5pcy4uLilcbiAgICAgICMjI1xuICAgICAgcHJvdG8ucmVnaXN0ZXIgJ21ha2VTdWJOYW1lU3BhY2UnLCAoKHN1Yk5hbWVTcGFjZSkgLT5cbiAgICAgICAgJ3VzZSBzdHJpY3QnXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIG5ldyBzdWIgbmFtZXNwYWNlIHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIHN1Yk5hbWVTcGFjZSBpc250ICdzdHJpbmcnKSBvciBzdWJOYW1lU3BhY2UgaXMgJydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdWIgbmFtZXNwYWNlIG5hbWVkICcgKyBzdWJOYW1lU3BhY2UgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKSAgaWYgcHJvdG8uc3ViTmFtZVNwYWNlXG4gICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHN1Yk5hbWVTcGFjZVxuICAgICAgICBuZXdOYW1lU3BhY2UgPSBtYWtlTmFtZVNwYWNlKHN1Yk5hbWVTcGFjZSwgbnNUcmVlKVxuICAgICAgICBuZXdOYW1lU3BhY2UucmVnaXN0ZXIgJ2NvbnN0YW50cycsIG1ha2VOYW1lU3BhY2UoJ2NvbnN0YW50cycsIG5zVHJlZSksIGZhbHNlICBpZiBzdWJOYW1lU3BhY2UgaXNudCAnY29uc3RhbnRzJ1xuICAgICAgICBwcm90by5yZWdpc3RlciBzdWJOYW1lU3BhY2UsIG5ld05hbWVTcGFjZSwgZmFsc2VcbiAgICAgICAgbmV3TmFtZVNwYWNlXG4gICAgICApLCBmYWxzZVxuICAgICAgcmV0dXJuXG5cbiAgICAjIyNcbiAgICBBbiBpbnRlcm5hbCBtZWNoYW5pc20gdG8gcmVwcmVzZW50IHRoZSBpbnN0YW5jZSBvZiB0aGlzIG5hbWVzcGFjZVxuICAgIEBjb25zdHJ1Y3RvclxuICAgIEBpbnRlcm5hbFxuICAgIEBtZW1iZXJPZiBtYWtlTmFtZVNwYWNlXG4gICAgIyMjXG4gICAgQ2xhc3MgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiBmdW5jdGlvbiAnICsgc3BhY2VuYW1lICsgJygpe30nKSgpXG4gICAgQ2xhc3M6OiA9IG5ldyBCYXNlKHNwYWNlbmFtZSlcblxuICAgICNDbGFzcy5wcm90b3R5cGUucGFyZW50ID0gQmFzZS5wcm90b3R5cGU7XG4gICAgbmV3IENsYXNzKHNwYWNlbmFtZSlcblxuICAjIyNcbiAgJ0RlcGVuZCcgYW4gT2JqZWN0IHVwb24gYW5vdGhlciBtZW1iZXIgb2YgdGhpcyBuYW1lc3BhY2UsIHVwb24gYW5vdGhlciBuYW1lc3BhY2UsXG4gIG9yIHVwb24gYSBtZW1iZXIgb2YgYW5vdGhlciBuYW1lc3BhY2VcbiAgIyMjXG4gIGRlcGVuZHNPbiA9IChkZXBlbmRlbmNpZXMsIGNhbGxCYWNrLCBpbXBvcnRzKSAtPlxuICAgICd1c2Ugc3RyaWN0J1xuICAgIHJldCA9IGZhbHNlXG4gICAgbnNNZW1iZXJzID0gbnNJbnRlcm5hbC5nZXROc01lbWJlcnMoKVxuICAgIGlmIGRlcGVuZGVuY2llcyBhbmQgZGVwZW5kZW5jaWVzLmxlbmd0aCA+IDAgYW5kIGNhbGxCYWNrXG4gICAgICBtaXNzaW5nID0gZGVwZW5kZW5jaWVzLmZpbHRlcigoZGVwZW4pIC0+XG4gICAgICAgIG5zTWVtYmVycy5pbmRleE9mKGRlcGVuKSBpcyAtMSBhbmQgKG5vdCBpbXBvcnRzIG9yIGltcG9ydHMgaXNudCBkZXBlbilcbiAgICAgIClcbiAgICAgIGlmIG1pc3NpbmcubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0ID0gdHJ1ZVxuICAgICAgICBjYWxsQmFjaygpXG4gICAgICBlbHNlXG4gICAgICAgIG5zSW50ZXJuYWwuZGVwZW5kZW50cy5wdXNoIChpbXBvcnRzKSAtPlxuICAgICAgICAgIGRlcGVuZHNPbiBtaXNzaW5nLCBjYWxsQmFjaywgaW1wb3J0c1xuXG4gICAgcmV0XG4gIG5zSW50ZXJuYWwgPSBkZXBlbmRlbnRzOiBbXVxuXG4gICMjI1xuICBGZXRjaGVzIHRoZSByZWdpc3RlcmVkIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgb24gdGhlIG5hbWVzcGFjZSBhbmQgaXRzIGNoaWxkIG5hbWVzcGFjZXNcbiAgIyMjXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBuc0ludGVybmFsLCAnZ2V0TnNNZW1iZXJzJyxcbiAgICB2YWx1ZTogLT5cbiAgICAgIHJlY3Vyc2VUcmVlID0gKGtleSwgbGFzdEtleSkgLT5cbiAgICAgICAgbWVtYmVycy5wdXNoIGxhc3RLZXkgKyAnLicgKyBrZXkgIGlmIHR5cGVvZiAoa2V5KSBpcyAnc3RyaW5nJ1xuICAgICAgICBpZiB1dGlsTGliLmlzUGxhaW5PYmplY3Qoa2V5KVxuICAgICAgICAgIE9iamVjdC5rZXlzKGtleSkuZm9yRWFjaCAoaykgLT5cbiAgICAgICAgICAgIG1lbWJlcnMucHVzaCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdHlwZW9mIChrKSBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgcmVjdXJzZVRyZWUga2V5W2tdLCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KGtleVtrXSlcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJldHVyblxuICAgICAgbWVtYmVycyA9IFtdXG4gICAgICBPYmplY3Qua2V5cyhOc1RyZWVbbmFtZVNwYWNlTmFtZV0pLmZvckVhY2ggKGtleSkgLT5cbiAgICAgICAgcmVjdXJzZVRyZWUgTnNUcmVlW25hbWVTcGFjZU5hbWVdW2tleV0sIG5hbWVTcGFjZU5hbWUgIGlmIHV0aWxMaWIuaXNQbGFpbk9iamVjdChOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG1lbWJlcnNcblxuICAjIyNcbiAgVG8gc3VwcG9ydCBkZXBlbmRlbmN5IG1hbmFnZW1lbnQsIHdoZW4gYSBwcm9wZXJ0eSBpcyBsaWZ0ZWQgb250byB0aGUgbmFtZXNwYWNlLCBub3RpZnkgZGVwZW5kZW50cyB0byBpbml0aWFsaXplXG4gICMjI1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnNJbnRlcm5hbCwgJ2FsZXJ0RGVwZW5kZW50cycsXG4gICAgdmFsdWU6IChpbXBvcnRzKSAtPlxuICAgICAgZGVwcyA9IG5zSW50ZXJuYWwuZGVwZW5kZW50cy5maWx0ZXIoKGRlcE9uKSAtPlxuICAgICAgICBmYWxzZSBpcyBkZXBPbihpbXBvcnRzKVxuICAgICAgKVxuICAgICAgbnNJbnRlcm5hbC5kZXBlbmRlbnRzID0gZGVwcyAgaWYgQXJyYXkuaXNBcnJheShkZXBzKVxuXG4gICNDcmVhdGUgdGhlIHJvb3Qgb2YgdGhlIHRyZWUgYXMgdGhlIGN1cnJlbnQgbmFtZXNwYWNlXG4gIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSA9IHt9XG4gICNEZWZpbmUgdGhlIGNvcmUgbmFtZXNwYWNlIGFuZCB0aGUgcmV0dXJuIG9mIHRoaXMgY2xhc3NcbiAgTnNPdXQgPSBtYWtlTmFtZVNwYWNlKG5hbWVTcGFjZU5hbWUsIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSlcblxuICAjIyNcbiAgQ2FjaGUgYSBoYW5kbGUgb24gdGhlIHZlbmRvciAocHJvYmFibHkgalF1ZXJ5KSBvbiB0aGUgcm9vdCBuYW1lc3BhY2VcbiAgIyMjXG4gIE5zT3V0LnJlZ2lzdGVyICc/JywgdXRpbExpYiwgZmFsc2VcblxuICAjIyNcbiAgQ2FjaGUgdGhlIHRyZWUgKHVzZWZ1bCBmb3IgZG9jdW1lbnRhdGlvbi92aXN1YWxpemF0aW9uL2RlYnVnZ2luZylcbiAgIyMjXG4gIE5zT3V0LnJlZ2lzdGVyICd0cmVlJywgTnNUcmVlW25hbWVTcGFjZU5hbWVdLCBmYWxzZVxuXG4gICMjI1xuICBDYWNoZSB0aGUgbmFtZSBzcGFjZSBuYW1lXG4gICMjI1xuICBOc091dC5yZWdpc3RlciAnbmFtZScsIG5hbWVTcGFjZU5hbWUsIGZhbHNlXG4gIE5zT3V0LnJlZ2lzdGVyICdkZXBlbmRzT24nLCBkZXBlbmRzT24sIGZhbHNlXG4gIE5zT3V0XG5cblxuIyMjXG5BY3R1YWxseSBkZWZpbmUgdGhlIE9KIE5hbWVTcGFjZVxuIyMjXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgdGhpc0dsb2JhbCwgbmFtZVNwYWNlTmFtZSxcbiAgdmFsdWU6IG1ha2VUaGVKdWljZSgpXG5cbk9KLnJlZ2lzdGVyICdnbG9iYWwnLCB0aGlzR2xvYmFsXG5cbnRoaXNEb2N1bWVudCA9IHt9XG5pZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xuICB0aGlzRG9jdW1lbnQgPSBkb2N1bWVudFxuXG5PSi5yZWdpc3RlciAnZG9jdW1lbnQnLCB0aGlzRG9jdW1lbnRcblxuT0oucmVnaXN0ZXIgJ25vb3AnLCAtPlxuXG5tb2R1bGUuZXhwb3J0cyA9IE9KIl19
},{"./global":34}],59:[function(require,module,exports){
(function (global){
var OJ, _, subNameSpaces;

OJ = require('./oj');

_ = (typeof window !== "undefined" ? window['_'] : typeof global !== "undefined" ? global['_'] : null);

subNameSpaces = ['errors', 'enums', 'instanceOf', 'nodes', 'db', 'components', 'controls', 'inputs', 'notifications', 'cookie', 'async'];

_.each(subNameSpaces, function(name) {
  return OJ.makeSubNameSpace(name);
});

OJ['GENERATE_UNIQUE_IDS'] = false;

OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] = 'div';

OJ['TRACK_ON_ERROR'] = false;

OJ['LOG_ALL_AJAX'] = false;

OJ['LOG_ALL_AJAX_ERRORS'] = false;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcb2pJbml0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE1BQVI7O0FBQ0wsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUlKLGFBQUEsR0FBZ0IsQ0FDZCxRQURjLEVBRWQsT0FGYyxFQUdkLFlBSGMsRUFJZCxPQUpjLEVBS2QsSUFMYyxFQU1kLFlBTmMsRUFPZCxVQVBjLEVBUWQsUUFSYyxFQVNkLGVBVGMsRUFVZCxRQVZjLEVBV2QsT0FYYzs7QUFrQmhCLENBQUMsQ0FBQyxJQUFGLENBQU8sYUFBUCxFQUFzQixTQUFDLElBQUQ7U0FDcEIsRUFBRSxDQUFDLGdCQUFILENBQW9CLElBQXBCO0FBRG9CLENBQXRCOztBQU1BLEVBQUcsQ0FBQSxxQkFBQSxDQUFILEdBQTRCOztBQUU1QixFQUFHLENBQUEsaUNBQUEsQ0FBSCxHQUF3Qzs7QUFFeEMsRUFBRyxDQUFBLGdCQUFBLENBQUgsR0FBdUI7O0FBRXZCLEVBQUcsQ0FBQSxjQUFBLENBQUgsR0FBcUI7O0FBRXJCLEVBQUcsQ0FBQSxxQkFBQSxDQUFILEdBQTRCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIgIyAjIE9KIFBvc3QtSW5pdGlhbGl6YXRpb25cclxuXHJcbk9KID0gcmVxdWlyZSAnLi9vaidcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuXHJcbiMgU2ltcGxlIGFycmF5IG9mIGFudGljaXBhdGVkL2tub3duIGNoaWxkIG5hbWVzcGFjZXNcclxuICBcclxuc3ViTmFtZVNwYWNlcyA9IFtcclxuICAnZXJyb3JzJ1xyXG4gICdlbnVtcydcclxuICAnaW5zdGFuY2VPZidcclxuICAnbm9kZXMnXHJcbiAgJ2RiJ1xyXG4gICdjb21wb25lbnRzJ1xyXG4gICdjb250cm9scydcclxuICAnaW5wdXRzJ1xyXG4gICdub3RpZmljYXRpb25zJ1xyXG4gICdjb29raWUnXHJcbiAgJ2FzeW5jJ1xyXG5dXHJcblxyXG4jICMjIFN1Yk5hbWVTcGFjZXNcclxuXHJcbiMgUHJlLWFsbG9jYXRlIGNlcnRhaW4gY29tbW9uIG5hbWVzcGFjZXMgdG8gYXZvaWQgZnV0dXJlIHJhY2UgY29uZGl0aW9ucy5cclxuIyBUaGlzIGRvZXMgcmVxdWlyZSB0aGF0IHRoZSBvcmRlciBvZiBvcGVyYXRpb25zIGxvYWRzIE9KLmNvZmZlZSBmaXJzdCBhbmQgb0pJbml0LmNvZmZlZSBzZWNvbmRcclxuXy5lYWNoIHN1Yk5hbWVTcGFjZXMsIChuYW1lKSAtPlxyXG4gIE9KLm1ha2VTdWJOYW1lU3BhY2UgbmFtZVxyXG4gIFxyXG4jICMjIENvbmZpZ3VyYXRpb24gdmFyaWFibGVzXHJcblxyXG4jIEF1dG9tYXRpY2FsbHkgZ2VuZXJhdGUgdW5pcXVlIElEcyBmb3IgZWFjaCBub2RlIChkZWZhdWx0IGZhbHNlKVxyXG5PSlsnR0VORVJBVEVfVU5JUVVFX0lEUyddID0gZmFsc2VcclxuIyBEZWZhdWx0IHJvb3Qgbm9kZSBmb3IgY29tcG9uZW50cy9jb250cm9scyAoZGVmYXVsdCAnZGl2JylcclxuT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSA9ICdkaXYnXHJcbiMgV2hldGhlciB0byBob29rIGludG8gdGhlIGdsb2JhbCBvbiBlcnJvciBldmVudCB0byB3cml0ZSBlcnJvcnMgdG8gY29uc29sZSAoZGVmYXVsdCBmYWxzZSlcclxuT0pbJ1RSQUNLX09OX0VSUk9SJ10gPSBmYWxzZVxyXG4jV2hldGhlciB0byBsb2cgYWxsIEFKQVggcmVxdWVzdHNcclxuT0pbJ0xPR19BTExfQUpBWCddID0gZmFsc2VcclxuI1doZXRoZXIgdG8gbG9nIGFsbCBBSkFYIGVycm9yc1xyXG5PSlsnTE9HX0FMTF9BSkFYX0VSUk9SUyddID0gZmFsc2UiXX0=
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGNvb2tpZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOztBQUNMLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7O0FBRUo7Ozs7Ozs7Ozs7OztBQVdBLElBQUcsQ0FBSSxDQUFKLElBQVMsQ0FBSSxDQUFDLENBQUMsTUFBbEI7QUFDRSxRQUFVLElBQUEsS0FBQSxDQUFNLHlDQUFOLEVBRFo7OztBQUVBLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQWxCLEdBQTJCOztBQUUzQixPQUFBLEdBQVU7O0FBRVYsR0FBQSxHQUFNLFNBQUMsVUFBRCxFQUFhLElBQWI7QUFDSixNQUFBO0VBQUEsR0FBQSxHQUFNO0VBQ04sSUFBRyxVQUFIO0lBQ0UsSUFBRyxJQUFIO01BQ0UsR0FBQSxHQUFNLENBQUMsQ0FBQyxNQUFGLENBQVMsVUFBVCxFQUFxQixJQUFyQixFQURSO0tBQUEsTUFBQTtNQUdFLEdBQUEsR0FBTSxDQUFDLENBQUMsTUFBRixDQUFTLFVBQVQsRUFIUjs7SUFJQSxJQUFHLEdBQUg7YUFDRSxPQUFRLENBQUEsVUFBQSxDQUFSLEdBQXNCLElBRHhCO0tBTEY7O0FBRkk7O0FBVU4sR0FBQSxHQUFNLFNBQUE7QUFDSixNQUFBO0VBQUEsR0FBQSxHQUFNLENBQUMsQ0FBQyxNQUFGLENBQUE7U0FDTjtBQUZJOztBQUlOLEdBQUEsR0FBTSxTQUFDLFVBQUQsRUFBYSxLQUFiLEVBQW9CLElBQXBCO0FBQ0osTUFBQTtFQUFBLEdBQUEsR0FBTTtFQUNOLElBQUcsVUFBSDtJQUNFLE9BQVEsQ0FBQSxVQUFBLENBQVIsR0FBc0I7SUFDdEIsSUFBRyxJQUFIO01BQ0UsR0FBQSxHQUFNLENBQUMsQ0FBQyxNQUFGLENBQVMsVUFBVCxFQUFxQixLQUFyQixFQUE0QixJQUE1QixFQURSO0tBQUEsTUFBQTtNQUdFLEdBQUEsR0FBTSxDQUFDLENBQUMsTUFBRixDQUFTLFVBQVQsRUFBcUIsS0FBckIsRUFIUjtLQUZGOztTQU1BO0FBUkk7O0FBVU4sR0FBQSxHQUFNLFNBQUMsVUFBRCxFQUFhLElBQWI7RUFDSixJQUFHLFVBQUg7SUFDRSxJQUFHLElBQUg7TUFDRSxDQUFDLENBQUMsWUFBRixDQUFlLFVBQWYsRUFBMkIsSUFBM0IsRUFERjtLQUFBLE1BQUE7TUFHRSxDQUFDLENBQUMsWUFBRixDQUFlLFVBQWYsRUFIRjs7SUFJQSxPQUFPLE9BQVEsQ0FBQSxVQUFBLEVBTGpCOztBQURJOztBQVNOLFNBQUEsR0FBWSxTQUFBO0VBQ1YsT0FBQSxHQUFVO0VBQ1YsRUFBRSxDQUFDLElBQUgsQ0FBUSxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQWxCLEVBQXVCLFNBQUMsR0FBRCxFQUFNLEdBQU47V0FDckIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFELENBQVQsQ0FBaUIsR0FBakI7RUFEcUIsQ0FBdkI7QUFGVTs7QUFNWCxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsV0FBbkIsRUFBZ0MsU0FBaEM7O0FBQ0EsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFFBQW5CLEVBQTZCLEdBQTdCOztBQUNBLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixLQUFuQixFQUEwQixHQUExQjs7QUFDQSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsS0FBbkIsRUFBMEIsR0FBMUI7O0FBQ0EsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLEtBQW5CLEVBQTJCLEdBQTNCOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ0M7RUFBQSxTQUFBLEVBQVcsU0FBWDtFQUNBLFFBQUEsRUFBUSxHQURSO0VBRUEsR0FBQSxFQUFLLEdBRkw7RUFHQSxHQUFBLEVBQUssR0FITDtFQUlBLEdBQUEsRUFBTSxHQUpOIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG4gIFxyXG4jIyNcclxuU2V0dXAgc2V0dGluZ3NcclxuJC5jb29raWUucmF3ID0gdHJ1ZVxyXG4kLmNvb2tpZS5qc29uID0gdHJ1ZVxyXG4gIFxyXG5TZXR1cCBkZWZhdWx0c1xyXG5odHRwczovL2dpdGh1Yi5jb20vY2FyaGFydGwvanF1ZXJ5LWNvb2tpZS9cclxuJC5jb29raWUuZGVmYXVsdHMuZXhwaXJlcyA9IDM2NVxyXG4kLmNvb2tpZS5kZWZhdWx0cy5wYXRoID0gJy8nXHJcbiQuY29va2llLmRlZmF1bHRzLmRvbWFpbiA9ICdvai5jb20nXHJcbiMjI1xyXG5pZiBub3QgJCBvciBub3QgJC5jb29raWVcclxuICB0aHJvdyBuZXcgRXJyb3IgJ2pRdWVyeSBDb29raWUgaXMgYSByZXF1aXJlZCBkZXBlbmRlbmN5LicgIFxyXG4kLmNvb2tpZS5kZWZhdWx0cy5zZWN1cmUgPSBmYWxzZVxyXG4gIFxyXG5jb29raWVzID0ge31cclxuICBcclxuZ2V0ID0gKGNvb2tpZU5hbWUsIHR5cGUpIC0+XHJcbiAgcmV0ID0gJydcclxuICBpZiBjb29raWVOYW1lXHJcbiAgICBpZiB0eXBlXHJcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHR5cGVcclxuICAgIGVsc2VcclxuICAgICAgcmV0ID0gJC5jb29raWUgY29va2llTmFtZSAgICBcclxuICAgIGlmIHJldFxyXG4gICAgICBjb29raWVzW2Nvb2tpZU5hbWVdID0gcmV0XHJcbiAgXHJcbmFsbCA9IC0+XHJcbiAgcmV0ID0gJC5jb29raWUoKVxyXG4gIHJldFxyXG4gICAgXHJcbnNldCA9IChjb29raWVOYW1lLCB2YWx1ZSwgb3B0cykgLT5cclxuICByZXQgPSAnJ1xyXG4gIGlmIGNvb2tpZU5hbWVcclxuICAgIGNvb2tpZXNbY29va2llTmFtZV0gPSB2YWx1ZVxyXG4gICAgaWYgb3B0c1xyXG4gICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lLCB2YWx1ZSwgb3B0c1xyXG4gICAgZWxzZVxyXG4gICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lLCB2YWx1ZVxyXG4gIHJldCAgXHJcbiAgXHJcbmRlbCA9IChjb29raWVOYW1lLCBvcHRzKSAtPlxyXG4gIGlmIGNvb2tpZU5hbWVcclxuICAgIGlmIG9wdHNcclxuICAgICAgJC5yZW1vdmVDb29raWUgY29va2llTmFtZSwgb3B0c1xyXG4gICAgZWxzZVxyXG4gICAgICAkLnJlbW92ZUNvb2tpZSBjb29raWVOYW1lICAgIFxyXG4gICAgZGVsZXRlIGNvb2tpZXNbY29va2llTmFtZV1cclxuICByZXR1cm5cclxuICAgIFxyXG5kZWxldGVBbGwgPSAtPlxyXG4gIGNvb2tpZXMgPSB7fVxyXG4gIE9KLmVhY2ggT0ouY29va2llLmFsbCwgKHZhbCwga2V5KSAtPlxyXG4gICAgT0ouY29va2llLmRlbGV0ZSBrZXkgIFxyXG4gIHJldHVyblxyXG4gICAgXHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2RlbGV0ZUFsbCcsIGRlbGV0ZUFsbFxyXG4gT0ouY29va2llLnJlZ2lzdGVyICdkZWxldGUnLCBkZWxcclxuIE9KLmNvb2tpZS5yZWdpc3RlciAnc2V0Jywgc2V0XHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2dldCcsIGdldFxyXG4gT0ouY29va2llLnJlZ2lzdGVyICdhbGwnLCAgYWxsXHJcbiBcclxuIG1vZHVsZS5leHBvcnRzID0gXHJcbiAgZGVsZXRlQWxsOiBkZWxldGVBbGxcclxuICBkZWxldGU6IGRlbFxyXG4gIHNldDogc2V0XHJcbiAgZ2V0OiBnZXRcclxuICBhbGw6ICBhbGwiXX0=
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGlzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUNKLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7QUFFRTs7O0VBRUosRUFBQyxDQUFBLElBQUQsR0FBTyxTQUFDLE9BQUQ7V0FDTCxDQUFDLENBQUMsU0FBRixDQUFZLE9BQVo7RUFESzs7RUFHUCxFQUFDLENBQUEsZ0JBQUQsR0FBbUIsU0FBQyxHQUFEO1dBQ2pCLENBQUMsQ0FBQyxPQUFGLENBQVUsR0FBVjtFQURpQjs7RUFHbkIsRUFBQyxDQUFBLGlCQUFELEdBQW9CLFNBQUMsR0FBRDtXQUNsQixHQUFBLElBQVEsQ0FBQyxDQUFJLEdBQUcsQ0FBQyxNQUFSLElBQWtCLEdBQUcsQ0FBQyxNQUFKLEtBQWMsQ0FBaEMsSUFBcUMsQ0FBSSxHQUFHLENBQUMsSUFBN0MsSUFBcUQsQ0FBSSxHQUFHLENBQUMsSUFBSixDQUFBLENBQTFEO0VBRFU7O0VBR3BCLEVBQUMsQ0FBQSxpQkFBRCxHQUFvQixTQUFDLEdBQUQ7V0FDbEIsQ0FBSSxHQUFKLElBQVcsS0FBQSxDQUFNLEdBQU4sQ0FBWCxJQUF5QixDQUFJLEdBQUcsQ0FBQztFQURmOztFQUdwQixFQUFDLENBQUEsZUFBRCxHQUFrQixTQUFDLEVBQUQ7V0FDaEIsQ0FBSSxFQUFKLElBQVUsQ0FBSSxFQUFFLENBQUM7RUFERDs7RUFHbEIsRUFBQyxDQUFBLGlCQUFELEdBQW9CLFNBQUMsR0FBRDtXQUNsQixDQUFDLENBQUMsT0FBRixDQUFVLEdBQUEsSUFBTyxDQUFJLE1BQU0sQ0FBQyxJQUFQLENBQVksR0FBWixDQUFYLElBQStCLE1BQU0sQ0FBQyxJQUFQLENBQVksR0FBWixDQUFnQixDQUFDLE1BQWpCLEtBQTJCLENBQXBFO0VBRGtCOztFQUdw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O0VBRHhCOztFQUdiLEVBQUMsQ0FBQSxNQUFELEdBQVMsU0FBQyxHQUFEO1dBQ1AsR0FBQSxLQUFTLEVBQUUsQ0FBQyxJQUFaLElBQXFCLENBQUMsQ0FBQyxVQUFGLENBQWEsR0FBYjtFQURkOzs7QUFHVDs7OztFQUdBLEVBQUMsQ0FBQSxJQUFELEdBQVEsRUFBQyxDQUFBOzs7Ozs7QUFJWCxFQUFFLENBQUMsUUFBSCxDQUFZLElBQVosRUFBa0IsRUFBbEI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIk9KID0gcmVxdWlyZSAnLi4vb2onXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuY2xhc3MgSVNcblxuICBAYm9vbDogKGJvb2xlYW4pIC0+XG4gICAgXy5pc0Jvb2xlYW4gYm9vbGVhblxuXG4gIEBhcnJheU51bGxPckVtcHR5OiAoYXJyKSAtPlxuICAgIF8uaXNFbXB0eSBhcnJcblxuICBAc3RyaW5nTnVsbE9yRW1wdHk6IChzdHIpIC0+XG4gICAgc3RyIGFuZCAobm90IHN0ci5sZW5ndGggb3Igc3RyLmxlbmd0aCBpcyAwIG9yIG5vdCBzdHIudHJpbSBvciBub3Qgc3RyLnRyaW0oKSlcblxuICBAbnVtYmVyTnVsbE9yRW1wdHk6IChudW0pIC0+XG4gICAgbm90IG51bSBvciBpc05hTihudW0pIG9yIG5vdCBudW0udG9QcmVjaXNpb25cblxuICBAZGF0ZU51bGxPckVtcHR5OiAoZHQpIC0+XG4gICAgbm90IGR0IG9yIG5vdCBkdC5nZXRUaW1lXG5cbiAgQG9iamVjdE51bGxPckVtcHR5OiAob2JqKSAtPlxuICAgIF8uaXNFbXB0eSBvYmogb3Igbm90IE9iamVjdC5rZXlzKG9iaikgb3IgT2JqZWN0LmtleXMob2JqKS5sZW5ndGggaXMgMFxuXG4gIEBwbGFpbk9iamVjdDogKG9iaikgLT5cbiAgICBfLmlzUGxhaW5PYmplY3Qgb2JqXG5cbiAgQG9iamVjdDogKG9iaikgLT5cbiAgICBfLmlzT2JqZWN0IG9ialxuXG4gIEBkYXRlOiAoZHQpIC0+XG4gICAgXy5pc0RhdGUgZHRcblxuXG4gICMjI1xuICBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgYW4gaW5zdGFuY2Ugb2YgYSBOdW1iZXIgYW5kIG5vdCBOYU4qXG4gICMjI1xuICBAbnVtYmVyOiAobnVtKSAtPlxuICAgIG51bWJlciA9IHJlcXVpcmUgJy4uL2NvcmUvbnVtYmVyJ1xuICAgIHR5cGVvZiBudW0gaXMgJ251bWJlcicgYW5kIGZhbHNlIGlzIChudW1iZXIuaXNOYU4obnVtKSBvciBmYWxzZSBpcyBudW1iZXIuaXNGaW5pdGUobnVtKSBvciBudW1iZXIuTUFYX1ZBTFVFIGlzIG51bSBvciBudW1iZXIuTUlOX1ZBTFVFIGlzIG51bSlcblxuICAjIyNcbiAgRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGNvbnZlcnRpYmxlIHRvIGEgTnVtYmVyXG4gICMjI1xuICBAbnVtZXJpYzogKG51bSkgLT5cbiAgICByZXQgPSBAbnVtYmVyKG51bSlcbiAgICB1bmxlc3MgcmV0XG4gICAgICB0byA9IHJlcXVpcmUgJy4vdG8nXG4gICAgICBudU51bSA9IHRvLm51bWJlcihudW0pXG4gICAgICByZXQgPSBAbnVtYmVyKG51TnVtKVxuICAgIHJldFxuXG4gIEBlbGVtZW50SW5Eb206IChlbGVtZW50SWQpIC0+XG4gICAgZmFsc2UgaXMgQG51bGxPckVtcHR5KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCkpXG5cbiAgQGFycmF5OiAob2JqKSAtPlxuICAgIF8uaXNBcnJheSBvYmpcblxuICBAc3RyaW5nOiAoc3RyKSAtPlxuICAgIF8uaXNTdHJpbmcgc3RyXG5cbiAgQHRydWU6IChvYmopIC0+XG4gICAgb2JqIGlzIHRydWUgb3Igb2JqIGlzICd0cnVlJyBvciBvYmogaXMgMSBvciBvYmogaXMgJzEnXG5cbiAgQGZhbHNlOiAob2JqKSAtPlxuICAgIG9iaiBpcyBmYWxzZSBvciBvYmogaXMgJ2ZhbHNlJyBvciBvYmogaXMgMCBvciBvYmogaXMgJzAnXG5cbiAgQHRydWVPckZhbHNlOiAob2JqKSAtPlxuICAgIEB0cnVlIG9iaiBvciBAZmFsc2Ugb2JqXG5cbiAgQG51bGxPckVtcHR5OiAob2JqLCBjaGVja0xlbmd0aCkgLT5cbiAgICBfLmlzRW1wdHkob2JqKSBvciBfLmlzVW5kZWZpbmVkKG9iaikgb3IgXy5pc051bGwob2JqKSBvciBfLmlzTmFOKG9iailcblxuICBAbnVsbE9yVW5kZWZpbmVkOiAob2JqLCBjaGVja0xlbmd0aCkgLT5cbiAgICBfLmlzVW5kZWZpbmVkKG9iaikgb3IgXy5pc051bGwob2JqKSBvciBfLmlzTmFOKG9iailcblxuICBAaW5zdGFuY2VvZjogKG5hbWUsIG9iaikgLT5cbiAgICBvYmoudHlwZSBpcyBuYW1lIG9yIG9iaiBpbnN0YW5jZW9mIG5hbWVcblxuICBAbWV0aG9kOiAob2JqKSAtPlxuICAgIG9iaiBpc250IE9KLm5vb3AgYW5kIF8uaXNGdW5jdGlvbiBvYmpcblxuICAjIyNcbiAgRGVwcmVjYXRlZC4gTGVmdCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIFVzZSBpcy5tZXRob2QgaW5zdGVhZC5cbiAgIyMjXG4gIEBmdW5jID0gQG1ldGhvZFxuXG5cblxuT0oucmVnaXN0ZXIgJ2lzJywgSVNcbm1vZHVsZS5leHBvcnRzID0gSVNcblxuIl19
},{"../core/number":11,"../oj":58,"./to":72}],68:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXG5vdHkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0FBR1AsUUFBQSxHQUFXLFNBQUMsT0FBRCxFQUFVLEtBQVY7QUFDVCxNQUFBO0VBQUEsUUFBQSxHQUNFO0lBQUEsTUFBQSxFQUFRLFVBQVI7SUFDQSxLQUFBLEVBQU8sY0FEUDtJQUVBLElBQUEsRUFBTSxPQUZOO0lBR0EsSUFBQSxFQUFNLEVBSE47SUFJQSxZQUFBLEVBQWMsSUFKZDtJQUtBLFFBQUEsRUFBVSwrRkFMVjtJQU1BLFNBQUEsRUFDSTtNQUFBLElBQUEsRUFDRTtRQUFBLE1BQUEsRUFBUSxRQUFSO09BREY7TUFFQSxLQUFBLEVBQ0U7UUFBQSxNQUFBLEVBQVEsUUFBUjtPQUhGO01BSUEsTUFBQSxFQUFRLE9BSlI7TUFLQSxLQUFBLEVBQU8sR0FMUDtLQVBKO0lBYUEsT0FBQSxFQUFTLElBYlQ7SUFjQSxLQUFBLEVBQU8sS0FkUDtJQWVBLEtBQUEsRUFBTyxLQWZQO0lBZ0JBLFVBQUEsRUFBWSxDQWhCWjtJQWlCQSxNQUFBLEVBQVEsS0FqQlI7SUFrQkEsU0FBQSxFQUFXLENBQUMsT0FBRCxDQWxCWDtJQW1CQSxRQUFBLEVBQ0k7TUFBQSxNQUFBLEVBQVEsRUFBRSxDQUFDLElBQVg7TUFDQSxTQUFBLEVBQVcsRUFBRSxDQUFDLElBRGQ7TUFFQSxPQUFBLEVBQVMsRUFBRSxDQUFDLElBRlo7TUFHQSxVQUFBLEVBQVksRUFBRSxDQUFDLElBSGY7S0FwQko7SUF3QkEsT0FBQSxFQUFTLEtBeEJUOztFQTBCRixFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0I7RUFDQSxHQUFBLEdBQU0sSUFBQSxDQUFLLFFBQUw7U0FFTjtBQS9CUzs7QUFpQ1gsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFqQixDQUEwQixNQUExQixFQUFrQyxRQUFsQzs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm90eSA9IHJlcXVpcmUgJ25vdHknXHJcblxyXG4gIFxyXG5tYWtlTm90eSA9IChvcHRpb25zLCBvd25lcikgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBsYXlvdXQ6ICd0b3BSaWdodCdcclxuICAgIHRoZW1lOiAnZGVmYXVsdFRoZW1lJ1xyXG4gICAgdHlwZTogJ2FsZXJ0J1xyXG4gICAgdGV4dDogJycgI2NhbiBiZSBodG1sIG9yIHN0cmluZ1xyXG4gICAgZGlzbWlzc1F1ZXVlOiB0cnVlICNJZiB5b3Ugd2FudCB0byB1c2UgcXVldWUgZmVhdHVyZSBzZXQgdGhpcyB0cnVlXHJcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJub3R5X21lc3NhZ2VcIj48c3BhbiBjbGFzcz1cIm5vdHlfdGV4dFwiPjwvc3Bhbj48ZGl2IGNsYXNzPVwibm90eV9jbG9zZVwiPjwvZGl2PjwvZGl2PicsXHJcbiAgICBhbmltYXRpb246IFxyXG4gICAgICAgIG9wZW46IFxyXG4gICAgICAgICAgaGVpZ2h0OiAndG9nZ2xlJ1xyXG4gICAgICAgIGNsb3NlOiBcclxuICAgICAgICAgIGhlaWdodDogJ3RvZ2dsZSdcclxuICAgICAgICBlYXNpbmc6ICdzd2luZydcclxuICAgICAgICBzcGVlZDogNTAwICNvcGVuaW5nICYgY2xvc2luZyBhbmltYXRpb24gc3BlZWRcclxuICAgIHRpbWVvdXQ6IDUwMDAgI2RlbGF5IGZvciBjbG9zaW5nIGV2ZW50LiBTZXQgZmFsc2UgZm9yIHN0aWNreSBub3RpZmljYXRpb25zXHJcbiAgICBmb3JjZTogZmFsc2UgI2FkZHMgbm90aWZpY2F0aW9uIHRvIHRoZSBiZWdpbm5pbmcgb2YgcXVldWUgd2hlbiBzZXQgdG8gdHJ1ZVxyXG4gICAgbW9kYWw6IGZhbHNlXHJcbiAgICBtYXhWaXNpYmxlOiA1ICN5b3UgY2FuIHNldCBtYXggdmlzaWJsZSBub3RpZmljYXRpb24gZm9yIGRpc21pc3NRdWV1ZSB0cnVlIG9wdGlvbixcclxuICAgIGtpbGxlcjogZmFsc2UgI2ZvciBjbG9zZSBhbGwgbm90aWZpY2F0aW9ucyBiZWZvcmUgc2hvd1xyXG4gICAgY2xvc2VXaXRoOiBbJ2NsaWNrJ10gICNbJ2NsaWNrJywgJ2J1dHRvbicsICdob3ZlciddXHJcbiAgICBjYWxsYmFjazogXHJcbiAgICAgICAgb25TaG93OiBPSi5ub29wLFxyXG4gICAgICAgIGFmdGVyU2hvdzogT0oubm9vcFxyXG4gICAgICAgIG9uQ2xvc2U6IE9KLm5vb3BcclxuICAgICAgICBhZnRlckNsb3NlOiBPSi5ub29wXHJcbiAgICBidXR0b25zOiBmYWxzZSAjYW4gYXJyYXkgb2YgYnV0dG9uc1xyXG4gICAgXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gbm90eSBkZWZhdWx0c1xyXG4gICAgICBcclxuICByZXRcclxuICAgIFxyXG5PSi5ub3RpZmljYXRpb25zLnJlZ2lzdGVyICdub3R5JywgbWFrZU5vdHlcclxubW9kdWxlLmV4cG9ydHMgPSBtYWtlTm90eSJdfQ==
},{"../oj":58}],69:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHB1YnN1Yi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOztBQUNMLE1BQUEsR0FBUyxPQUFBLENBQVEsV0FBUjs7QUFFVCxNQUFBLEdBQVM7O0FBQ1QsV0FBQSxHQUFjOztBQUNkLE1BQUEsR0FBUzs7QUFFVCxFQUFBLEdBQ0U7RUFBQSxZQUFBLEVBQWMsU0FBQyxLQUFEO1dBQ1osS0FBSyxDQUFDLFdBQU4sQ0FBQSxDQUFtQixDQUFDLE9BQXBCLENBQTRCLEdBQTVCLEVBQWlDLEdBQWpDO0VBRFksQ0FBZDtFQUdBLFNBQUEsRUFBVyxTQUFDLEtBQUQsRUFBUSxNQUFSO0FBQ1QsUUFBQTtJQUFBLFNBQUEsR0FBWSxFQUFFLENBQUMsWUFBSCxDQUFnQixLQUFoQjtJQUNaLElBQUcsQ0FBSSxNQUFPLENBQUEsU0FBQSxDQUFkO01BQThCLE1BQU8sQ0FBQSxTQUFBLENBQVAsR0FBb0IsR0FBbEQ7O0lBRUEsS0FBQSxHQUFRLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFNBQWpCLEVBQTRCLE1BQTVCO0lBQ1IsTUFBTyxDQUFBLEtBQUEsQ0FBUCxHQUFnQjtJQUNoQixXQUFXLENBQUMsSUFBWixDQUFpQixNQUFqQjtJQUNBLE1BQU8sQ0FBQSxTQUFBLENBQVUsQ0FBQyxJQUFsQixDQUF1QixNQUF2QjtXQUNBO0VBUlMsQ0FIWDtFQWFBLE9BQUEsRUFBUyxTQUFDLEtBQUQsRUFBUSxJQUFSO0FBQ1AsUUFBQTtJQUFBLFNBQUEsR0FBWSxFQUFFLENBQUMsWUFBSCxDQUFnQixLQUFoQjtJQUNaLElBQUcsTUFBTyxDQUFBLFNBQUEsQ0FBVjtNQUNFLE1BQU0sQ0FBQyxPQUFQLENBQWUsU0FBZixFQUEwQixJQUExQixFQURGO0tBQUEsTUFBQTtNQUdFLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBWCxDQUFnQixlQUFBLEdBQWtCLEtBQWxCLEdBQTBCLHNCQUExQyxFQUhGOztFQUZPLENBYlQ7RUFxQkEsV0FBQSxFQUFhLFNBQUMsYUFBRDtJQUNYLElBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsYUFBYixDQUFIO01BQ0UsSUFBRyxDQUFDLENBQUQsS0FBUSxXQUFXLENBQUMsT0FBWixDQUFvQixhQUFwQixDQUFYO1FBQ0UsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsYUFBbkI7UUFDQSxXQUFBLEdBQWMsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxXQUFULEVBQXNCLFNBQUMsTUFBRDtpQkFBWSxNQUFBLEtBQVU7UUFBdEIsQ0FBdEIsRUFGaEI7T0FBQSxNQUFBO1FBSUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFYLENBQWdCLGlDQUFoQixFQUpGO09BREY7S0FBQSxNQUFBO01BT0UsSUFBRyxNQUFPLENBQUEsYUFBQSxDQUFWO1FBQ0UsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsYUFBbkI7UUFDQSxPQUFPLE1BQU8sQ0FBQSxhQUFBLEVBRmhCO09BUEY7O0VBRFcsQ0FyQmI7RUFrQ0EsY0FBQSxFQUFnQixTQUFBO0lBQ2QsRUFBRSxDQUFDLElBQUgsQ0FBUSxNQUFSLEVBQWdCLFNBQUMsS0FBRDthQUFXLFdBQUEsQ0FBWSxLQUFaO0lBQVgsQ0FBaEI7SUFDQSxXQUFBLEdBQWM7SUFDZCxNQUFBLEdBQVM7RUFISyxDQWxDaEI7RUF3Q0EsZ0JBQUEsRUFBa0IsU0FBQyxLQUFEO0FBQ2hCLFFBQUE7SUFBQSxTQUFBLEdBQVksRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsS0FBaEI7SUFDWixJQUFHLE1BQU8sQ0FBQSxTQUFBLENBQVY7TUFDRSxFQUFFLENBQUMsSUFBSCxDQUFRLE1BQU8sQ0FBQSxTQUFBLENBQWYsRUFBMkIsU0FBQyxNQUFEO2VBQVksV0FBQSxDQUFZLE1BQVo7TUFBWixDQUEzQixFQURGO0tBQUEsTUFBQTtNQUdFLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBWCxDQUFnQixlQUFBLEdBQWtCLEtBQWxCLEdBQTBCLHNCQUExQyxFQUhGOztJQUlBLE9BQU8sTUFBTyxDQUFBLFNBQUE7RUFORSxDQXhDbEI7OztBQWlERixNQUFNLENBQUMsSUFBUCxDQUFZLEVBQVo7O0FBQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxFQUFkOztBQUVBLEVBQUUsQ0FBQyxRQUFILENBQVksY0FBWixFQUE0QixFQUFFLENBQUMsWUFBL0I7O0FBQ0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxTQUFaLEVBQXVCLEVBQUUsQ0FBQyxPQUExQjs7QUFDQSxFQUFFLENBQUMsUUFBSCxDQUFZLFdBQVosRUFBeUIsRUFBRSxDQUFDLFNBQTVCOztBQUNBLEVBQUUsQ0FBQyxRQUFILENBQVksYUFBWixFQUEyQixFQUFFLENBQUMsV0FBOUI7O0FBQ0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxnQkFBWixFQUE4QixFQUFFLENBQUMsY0FBakM7O0FBQ0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxrQkFBWixFQUFnQyxFQUFFLENBQUMsZ0JBQW5DOztBQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuUHViU3ViID0gcmVxdWlyZSAncHVic3ViLWpzJ1xuXG50b2tlbnMgPSB7fVxuc3Vic2NyaWJlcnMgPSBbXVxuZXZlbnRzID0ge31cblxucHMgPSBcbiAgZ2V0RXZlbnROYW1lOiAoZXZlbnQpIC0+XG4gICAgZXZlbnQudG9VcHBlckNhc2UoKS5yZXBsYWNlICcgJywgJ18nXG5cbiAgc3Vic2NyaWJlOiAoZXZlbnQsIG1ldGhvZCkgLT5cbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUgZXZlbnRcbiAgICBpZiBub3QgZXZlbnRzW2V2ZW50TmFtZV0gdGhlbiBldmVudHNbZXZlbnROYW1lXSA9IFtdXG5cbiAgICB0b2tlbiA9IFB1YlN1Yi5zdWJzY3JpYmUgZXZlbnROYW1lLCBtZXRob2RcbiAgICB0b2tlbnNbdG9rZW5dID0gdG9rZW5cbiAgICBzdWJzY3JpYmVycy5wdXNoIG1ldGhvZFxuICAgIGV2ZW50c1tldmVudE5hbWVdLnB1c2ggbWV0aG9kXG4gICAgdG9rZW5cblxuICBwdWJsaXNoOiAoZXZlbnQsIGRhdGEpIC0+XG4gICAgZXZlbnROYW1lID0gcHMuZ2V0RXZlbnROYW1lIGV2ZW50XG4gICAgaWYgZXZlbnRzW2V2ZW50TmFtZV1cbiAgICAgIFB1YlN1Yi5wdWJsaXNoIGV2ZW50TmFtZSwgZGF0YVxuICAgIGVsc2VcbiAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbmFtZWQgeycgKyBldmVudCArICd9IGlzIG5vdCByZWNvZ25pemVkLidcbiAgICByZXR1cm5cblxuICB1bnN1YnNjcmliZTogKHRva2VuT3JNZXRob2QpIC0+XG4gICAgaWYgT0ouaXMubWV0aG9kIHRva2VuT3JNZXRob2RcbiAgICAgIGlmIC0xIGlzbnQgc3Vic2NyaWJlcnMuaW5kZXhPZiB0b2tlbk9yTWV0aG9kXG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSB0b2tlbk9yTWV0aG9kXG4gICAgICAgIHN1YnNjcmliZXJzID0gXy5yZW1vdmUgc3Vic2NyaWJlcnMsIChtZXRob2QpIC0+IG1ldGhvZCBpcyB0b2tlbk9yTWV0aG9kXG4gICAgICBlbHNlXG4gICAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbWV0aG9kIGlzIG5vdCByZWNvZ25pemVkLidcbiAgICBlbHNlXG4gICAgICBpZiB0b2tlbnNbdG9rZW5Pck1ldGhvZF1cbiAgICAgICAgUHViU3ViLnVuc3Vic2NyaWJlIHRva2VuT3JNZXRob2RcbiAgICAgICAgZGVsZXRlIHRva2Vuc1t0b2tlbk9yTWV0aG9kXVxuICAgIHJldHVyblxuXG4gIHVuc3Vic2NyaWJlQWxsOiAoKSAtPlxuICAgIE9KLmVhY2ggdG9rZW5zLCAodG9rZW4pIC0+IHVuc3Vic2NyaWJlIHRva2VuXG4gICAgc3Vic2NyaWJlcnMgPSBbXVxuICAgIGV2ZW50cyA9IHt9XG4gICAgcmV0dXJuXG5cbiAgdW5zdWJzY3JpYmVFdmVudDogKGV2ZW50KSAtPlxuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZSBldmVudFxuICAgIGlmIGV2ZW50c1tldmVudE5hbWVdXG4gICAgICBPSi5lYWNoIGV2ZW50c1tldmVudE5hbWVdLCAobWV0aG9kKSAtPiB1bnN1YnNjcmliZSBtZXRob2RcbiAgICBlbHNlXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0V2ZW50IG5hbWVkIHsnICsgZXZlbnQgKyAnfSBpcyBub3QgcmVjb2duaXplZC4nXG4gICAgZGVsZXRlIGV2ZW50c1tldmVudE5hbWVdXG4gICAgcmV0dXJuXG5cbk9iamVjdC5zZWFsIHBzXG5PYmplY3QuZnJlZXplIHBzXG5cbk9KLnJlZ2lzdGVyICdnZXRFdmVudE5hbWUnLCBwcy5nZXRFdmVudE5hbWVcbk9KLnJlZ2lzdGVyICdwdWJsaXNoJywgcHMucHVibGlzaFxuT0oucmVnaXN0ZXIgJ3N1YnNjcmliZScsIHBzLnN1YnNjcmliZVxuT0oucmVnaXN0ZXIgJ3Vuc3Vic2NyaWJlJywgcHMudW5zdWJzY3JpYmVcbk9KLnJlZ2lzdGVyICd1bnN1YnNjcmliZUFsbCcsIHBzLnVuc3Vic2NyaWJlQWxsXG5PSi5yZWdpc3RlciAndW5zdWJzY3JpYmVFdmVudCcsIHBzLnVuc3Vic2NyaWJlRXZlbnRcblxubW9kdWxlLmV4cG9ydHMgPSBwcyJdfQ==
},{"../oj":58}],70:[function(require,module,exports){
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



},{"../oj":58}],71:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHJhbmdlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQUEscUJBQUE7RUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUNKLEdBQUEsR0FBTSxPQUFBLENBQVEsZ0JBQVI7O0FBQ04sSUFBQSxHQUFPLE9BQUEsQ0FBUSxRQUFSOztBQUlQLEdBQUEsR0FJRTtFQUFBLEtBQUEsRUFBTyxTQUFBO0FBQ0wsUUFBQTtJQURNO1dBQ04sQ0FBQyxDQUFDLEtBQUYsVUFBUSxNQUFSO0VBREssQ0FBUDtFQUtBLFFBQUEsRUFBVSxTQUFBO0FBQ1IsUUFBQTtJQURTO1dBQ1QsQ0FBQyxDQUFDLEdBQUYsVUFBTSxNQUFOO0VBRFEsQ0FMVjtFQVVBLFFBQUEsRUFBVSxTQUFBO0FBQ1IsUUFBQTtJQURTO1dBQ1QsQ0FBQyxDQUFDLEdBQUYsVUFBTSxNQUFOO0VBRFEsQ0FWVjs7QUFjQTs7Ozs7RUFLQSxpQkFBQSxFQUFtQixTQUFDLENBQUQsRUFBUSxLQUFSO0FBQ2pCLFFBQUE7O01BRGtCLElBQUk7OztNQUFHLFFBQVE7O0lBQ2pDLFNBQUEsR0FBWTtJQUdaLElBQUEsQ0FBSyxLQUFMLEVBQVksU0FBQyxHQUFEO0FBQ1YsVUFBQTtNQUFBLElBQUEsR0FBTyxHQUFHLENBQUMsSUFBSixDQUFBLENBQVcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFkLENBQUE7TUFDUCxJQUFHLEtBQUEsS0FBUyxHQUFHLENBQUMsUUFBSixDQUFhLFNBQWIsRUFBd0IsSUFBeEIsQ0FBWjtlQUNFLFNBQVMsQ0FBQyxJQUFWLENBQWUsSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUFmLEVBREY7O0lBRlUsQ0FBWjtJQUtBLEdBQUEsR0FBTSxHQUFHLENBQUMsV0FBSixDQUFnQixDQUFoQixFQUFtQixTQUFuQjtJQUVOLENBQUEsR0FBSTtBQUNKLFdBQU0sQ0FBQSxHQUFJLENBQVY7TUFDRSxDQUFBLElBQUs7TUFDTCxRQUFBLEdBQVcsR0FBSSxDQUFBLENBQUE7TUFDZixRQUFRLENBQUMsR0FBVCxDQUFhLE1BQU0sQ0FBQyxZQUFwQjtJQUhGO0lBS0EsV0FBQSxHQUFjLEdBQUcsQ0FBQztJQUNsQixHQUFHLENBQUMsUUFBSixHQUFlLFNBQUMsR0FBRDtBQUNiLFVBQUE7TUFBQSxJQUFBLEdBQU8sR0FBRyxDQUFDLElBQUosQ0FBQSxDQUFXLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBZCxDQUFBLENBQTJCLENBQUMsVUFBNUIsQ0FBQTtNQUNQLEdBQUEsR0FBTSxXQUFBLENBQVksSUFBWjthQUNOO0lBSGE7V0FJZjtFQXRCaUIsQ0FuQm5COztBQTRDQTs7Ozs7RUFLQSxXQUFBLEVBQWEsU0FBQyxDQUFELEVBQVEsS0FBUjtBQUNYLFFBQUE7O01BRFksSUFBSTs7O01BQUcsUUFBUTs7SUFDM0IsR0FBQSxHQUFNLEdBQUcsQ0FBQyxNQUFKLENBQUE7SUFDTixRQUFBLEdBQVcsR0FBRyxDQUFDLFFBQUosQ0FBYSxLQUFiO0lBQ1gsU0FBQSxHQUFZLEdBQUcsQ0FBQyxRQUFKLENBQWEsS0FBYjtJQUVaLFFBQUEsR0FBVyxTQUFBLEdBQVk7SUFDdkIsWUFBQSxHQUFlLFFBQUEsR0FBUztJQUN4QixTQUFBLEdBQVksR0FBRyxDQUFDLEdBQUosQ0FBUSxRQUFSLEVBQWtCLEdBQUcsQ0FBQyxNQUFKLENBQUEsQ0FBbEI7SUFDWixRQUFBLEdBQVc7SUFFWCxHQUFBLEdBQU0sR0FBRyxDQUFDLE1BQUosQ0FBQTtJQUVOLENBQUEsR0FBSTtBQUNKLFdBQU0sQ0FBQSxHQUFJLENBQVY7TUFDRSxDQUFBLElBQUs7TUFDTCxJQUFHLENBQUEsR0FBSSxDQUFQO1FBQWMsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsWUFBWCxFQUFyQjtPQUFBLE1BQUE7UUFFRSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxZQUFYO1FBQ1AsSUFBRyxRQUFBLEdBQVcsSUFBWCxJQUFtQixTQUF0QjtVQUNFLElBQUEsSUFBUSxTQUFBLEdBQVksUUFBWixHQUF1QixJQUF2QixHQUE4QixFQUR4QztTQUhGOztNQU1BLFFBQUEsR0FBVyxHQUFHLENBQUMsS0FBSixDQUFVLFFBQVYsRUFBb0IsUUFBQSxHQUFXLElBQS9CO01BQ1gsSUFBQSxDQUFLLFFBQUwsRUFBZSxTQUFDLEdBQUQ7ZUFBUyxHQUFHLENBQUMsR0FBSixDQUFRLEdBQVIsRUFBYSxDQUFiO01BQVQsQ0FBZjtNQUNBLFNBQVUsQ0FBQSxDQUFBLENBQVYsR0FBZTtNQUNmLFFBQUEsSUFBWTtJQVhkO0lBYUEsR0FBRyxDQUFDLEdBQUosQ0FBUSxVQUFSLEVBQW9CLFNBQUMsR0FBRDthQUNsQixHQUFJLENBQUEsR0FBQTtJQURjLENBQXBCO1dBR0E7RUE3QlcsQ0FqRGI7OztBQWdGRixNQUFNLENBQUMsSUFBUCxDQUFZLEdBQVo7O0FBQ0EsTUFBTSxDQUFDLE1BQVAsQ0FBYyxHQUFkOztBQUVBLEVBQUUsQ0FBQyxRQUFILENBQVksUUFBWixFQUFzQixHQUF0Qjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbmVhY2ggPSByZXF1aXJlICcuL2VhY2gnXHJcblxyXG4jICMgcmFuZ2VzXHJcblxyXG5ybmcgPVxyXG5cclxuICAjICMjIHJhbmdlXHJcbiAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNyYW5nZSkncyBgcmFuZ2VgIG1ldGhvZFxyXG4gIHJhbmdlOiAocGFyYW1zLi4uKSAtPlxyXG4gICAgXy5yYW5nZSBwYXJhbXMuLi5cclxuXHJcbiAgIyAjIyByYW5nZU1pblxyXG4gICMgVXNpbmcgW0xvLURhc2hdKGh0dHA6Ly9sb2Rhc2guY29tL2RvY3MjbWluKSdzIGBtaW5gIG1ldGhvZFxyXG4gIHJhbmdlTWluOiAocGFyYW1zLi4uKSAtPlxyXG4gICAgXy5taW4gcGFyYW1zLi4uXHJcblxyXG4gICMgIyMgcmFuZ2VNYXhcclxuICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI21heCkncyBgbWF4YCBtZXRob2RcclxuICByYW5nZU1heDogKHBhcmFtcy4uLikgLT5cclxuICAgIF8ubWF4IHBhcmFtcy4uLlxyXG5cclxuICAjICMjIHN0cmluZ1JhbmdlVG9TdWJSYW5nZXNcclxuICAjIyNcclxuICBUYWtlIGFuIGFycmF5IG9mIHN0cmluZyB2YWx1ZXMgYW5kIGEgbnVtYmVyIG9mIHBhcnRpdGlvbnMgdG8gY3JlYXRlLlxyXG4gIFVzZXMgdGhlIGZpcnN0IGxldHRlciBvZiBlYWNoIHN0cmluZyB2YWx1ZSBpbiB0aGUgYXJyYXkgdG8gY29udmVydCB0byB1bmlxdWUgY29kZSBjaGFyYWN0ZXIgKGxvd2VyIGNhc2UpXHJcbiAgQnVpbGRzIGEgaW50IHJhbmdlIGJhc2VkIG9uIHVuaXF1ZSBjb2RlIGNoYXJzLlxyXG4gICMjI1xyXG4gIHN0cmluZ1RvU3ViUmFuZ2VzOiAobiA9IDYsIHJhbmdlID0gW10pIC0+XHJcbiAgICBjaGFyUmFuZ2UgPSBbXVxyXG5cclxuXHJcbiAgICBlYWNoIHJhbmdlLCAodmFsKSAtPlxyXG4gICAgICBjaGFyID0gdmFsLnRyaW0oKVswXS50b0xvd2VyQ2FzZSgpXHJcbiAgICAgIGlmIGZhbHNlIGlzIG9iai5jb250YWlucyBjaGFyUmFuZ2UsIGNoYXJcclxuICAgICAgICBjaGFyUmFuZ2UucHVzaCBjaGFyLmNoYXJDb2RlQXQoKVxyXG5cclxuICAgIHJldCA9IHJuZy50b1N1YlJhbmdlcyBuLCBjaGFyUmFuZ2VcclxuXHJcbiAgICBpID0gMFxyXG4gICAgd2hpbGUgaSA8IG5cclxuICAgICAgaSArPSAxXHJcbiAgICAgIHN1YlJhbmdlID0gcmV0W2ldXHJcbiAgICAgIHN1YlJhbmdlLm1hcCBTdHJpbmcuZnJvbUNoYXJDb2RlXHJcblxyXG4gICAgb2xkR2V0UmFuZ2UgPSByZXQuZ2V0UmFuZ2VcclxuICAgIHJldC5nZXRSYW5nZSA9ICh2YWwpIC0+XHJcbiAgICAgIGNoYXIgPSB2YWwudHJpbSgpWzBdLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgpXHJcbiAgICAgIGlkeCA9IG9sZEdldFJhbmdlIGNoYXJcclxuICAgICAgaWR4XHJcbiAgICByZXRcclxuXHJcbiAgIyAjIyByYW5nZVRvU3ViUmFuZ2VzXHJcbiAgIyMjXHJcbiAgVGFrZSBhbiBhcnJheSBvZiBpbnQgdmFsdWVzIGFuZCBhIG51bWJlciBvZiBwYXJ0aXRpb25zIHRvIGNyZWF0ZS5cclxuICBEaXZpZGVzIHRoZSBvcmlnaW5hbCBhcnJheSBpbnRvIHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIHN1YiBhcnJheXMuXHJcbiAgT3ZlcmZsb3cgaXMgcGFzc2VkIHRvIHRoZSBmaW5hbCBwYXJ0aXRpb24uXHJcbiAgIyMjXHJcbiAgdG9TdWJSYW5nZXM6IChuID0gNiwgcmFuZ2UgPSBbXSkgLT5cclxuICAgIHJldCA9IG9iai5vYmplY3QoKVxyXG4gICAgcmFuZ2VMb3cgPSBybmcucmFuZ2VNaW4gcmFuZ2VcclxuICAgIHJhbmdlSGlnaCA9IHJuZy5yYW5nZU1heCByYW5nZVxyXG5cclxuICAgIGRpc3RhbmNlID0gcmFuZ2VIaWdoIC0gcmFuZ2VMb3dcclxuICAgIHN1YlJhbmdlU2l6ZSA9IGRpc3RhbmNlL25cclxuICAgIHN1YlJhbmdlcyA9IHJldC5hZGQgJ3JhbmdlcycsIG9iai5vYmplY3QoKVxyXG4gICAgY2h1bmtWYWwgPSByYW5nZUxvd1xyXG5cclxuICAgIG1hcCA9IG9iai5vYmplY3QoKVxyXG5cclxuICAgIGkgPSAwXHJcbiAgICB3aGlsZSBpIDwgblxyXG4gICAgICBpICs9IDFcclxuICAgICAgaWYgaSA8IG4gdGhlbiBqdW1wID0gTWF0aC5yb3VuZCBzdWJSYW5nZVNpemVcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGp1bXAgPSBNYXRoLmZsb29yIHN1YlJhbmdlU2l6ZVxyXG4gICAgICAgIGlmIGNodW5rVmFsICsganVtcCA8PSByYW5nZUhpZ2hcclxuICAgICAgICAgIGp1bXAgKz0gcmFuZ2VIaWdoIC0gY2h1bmtWYWwgLSBqdW1wICsgMVxyXG5cclxuICAgICAgc3ViUmFuZ2UgPSBybmcucmFuZ2UgY2h1bmtWYWwsIGNodW5rVmFsICsganVtcFxyXG4gICAgICBlYWNoIHN1YlJhbmdlLCAodmFsKSAtPiBtYXAuYWRkIHZhbCwgaVxyXG4gICAgICBzdWJSYW5nZXNbaV0gPSBzdWJSYW5nZVxyXG4gICAgICBjaHVua1ZhbCArPSBqdW1wXHJcblxyXG4gICAgcmV0LmFkZCAnZ2V0UmFuZ2UnLCAodmFsKSAtPlxyXG4gICAgICBtYXBbdmFsXVxyXG5cclxuICAgIHJldFxyXG5cclxuT2JqZWN0LnNlYWwgcm5nXHJcbk9iamVjdC5mcmVlemUgcm5nXHJcblxyXG5PSi5yZWdpc3RlciAncmFuZ2VzJywgcm5nXHJcbm1vZHVsZS5leHBvcnRzID0gcm5nXHJcbiJdfQ==
},{"../core/object":12,"../oj":58,"./each":65}],72:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHRvLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztBQUNKLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7QUFDSixFQUFBLEdBQUssT0FBQSxDQUFRLE1BQVI7O0FBR0M7OztFQUdKLEVBQUMsQ0FBQSxJQUFELEdBQU8sU0FBQyxHQUFEO0FBQ0wsUUFBQTtJQUFBLE9BQUEsR0FBVSxFQUFHLENBQUEsTUFBQSxDQUFILENBQVcsR0FBWDtJQUNWLElBQW9CLE9BQUEsS0FBVyxLQUFYLElBQW9CLE9BQUEsS0FBYSxJQUFyRDtNQUFBLE9BQUEsR0FBVSxNQUFWOztXQUNBO0VBSEs7O0VBT1AsRUFBQyxDQUFBLFVBQUQsR0FBYSxTQUFDLEdBQUQ7V0FDWCxHQUFBLEtBQVMsS0FBVCxJQUFtQixHQUFBLEtBQVMsQ0FBNUIsSUFBa0MsR0FBQSxLQUFTLEVBQTNDLElBQWtELEdBQUEsS0FBUyxJQUEzRCxJQUFvRSxPQUFPLEdBQVAsS0FBZ0IsV0FBcEYsSUFBb0csQ0FBQyxPQUFPLEdBQVAsS0FBZ0IsUUFBaEIsSUFBNEIsQ0FBSSxLQUFBLENBQU0sR0FBTixDQUFqQztFQUR6Rjs7RUFLYixFQUFDLENBQUEsYUFBRCxHQUFnQixTQUFDLE9BQUQ7QUFDZCxRQUFBO0lBQUEsWUFBQSxHQUFlLElBQUMsQ0FBQSxNQUFELENBQVEsT0FBUjtJQUNmLEdBQUEsR0FBTTtJQUNOLEtBQUEsR0FBUTtJQUNSLE1BQUEsR0FBUztJQUNULFdBQUEsR0FBYztJQUNkLEdBQUEsR0FBTTtJQUNOLElBQUcsS0FBQSxLQUFTLEVBQUUsQ0FBQyxXQUFILENBQWUsWUFBZixDQUFaO01BQ0UsWUFBQSxHQUFlLFlBQVksQ0FBQyxPQUFiLENBQXFCLEdBQXJCLEVBQTBCLEVBQTFCO01BQ2Ys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bGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiT0ogPSByZXF1aXJlICcuLi9vaidcbiQgPSByZXF1aXJlICdqcXVlcnknXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuSVMgPSByZXF1aXJlICcuL2lzJ1xuXG4jICMgdG9cbmNsYXNzIFRPIFxuICAjICMjIGJvb2xcbiAgIyBjb252ZXJ0IGFueSBjb21wYXRpYmxlIG9iamVjdCB0byBhIGJvb2xlYW4uIEluY29tcGF0aWJsZSBvYmplY3RzIGFyZSBmYWxzZS5cbiAgQGJvb2w6IChzdHIpIC0+XG4gICAgcmV0Qm9vbCA9IElTWyd0cnVlJ10oc3RyKVxuICAgIHJldEJvb2wgPSBmYWxzZSAgaWYgcmV0Qm9vbCBpcyBmYWxzZSBvciByZXRCb29sIGlzbnQgdHJ1ZVxuICAgIHJldEJvb2xcblxuICAjICMjIEVTNV9Ub0Jvb2xcbiAgIyAoZGVidWcpIG1ldGhvZCB0byBleHBsaWNpdGx5IGZvcmNlIGFuIGBpZihvYmopYCBldmFsdWF0aW9uIHRvIGZsb3cgdGhyb3VnaCB0aGUgRVM1IHNwZWMgZm9yIHRydXRoaW5lc3NcbiAgQEVTNV9Ub0Jvb2w6ICh2YWwpIC0+XG4gICAgdmFsIGlzbnQgZmFsc2UgYW5kIHZhbCBpc250IDAgYW5kIHZhbCBpc250ICcnIGFuZCB2YWwgaXNudCBudWxsIGFuZCB0eXBlb2YgdmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kICh0eXBlb2YgdmFsIGlzbnQgJ251bWJlcicgb3Igbm90IGlzTmFOKHZhbCkpXG5cbiAgIyAjIyBkYXRlRnJvbVRpY2tzXG4gICMgdGFrZSBhIG51bWJlciByZXByZXNlbnRpbmcgdGlja3MgYW5kIGNvbnZlcnQgaXQgaW50byBhbiBpbnN0YW5jZSBvZiBEYXRlXG4gIEBkYXRlRnJvbVRpY2tzOiAodGlja1N0cikgLT5cbiAgICB0aWNzRGF0ZVRpbWUgPSBAc3RyaW5nKHRpY2tTdHIpXG4gICAgcmV0ID0gdW5kZWZpbmVkXG4gICAgdGlja3MgPSB1bmRlZmluZWRcbiAgICBvZmZzZXQgPSB1bmRlZmluZWRcbiAgICBsb2NhbE9mZnNldCA9IHVuZGVmaW5lZFxuICAgIGFyciA9IHVuZGVmaW5lZFxuICAgIGlmIGZhbHNlIGlzIElTLm51bGxPckVtcHR5KHRpY3NEYXRlVGltZSlcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcvJywgJycpXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnRGF0ZScsICcnKVxuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJygnLCAnJylcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcpJywgJycpXG4gICAgICBhcnIgPSB0aWNzRGF0ZVRpbWUuc3BsaXQoJy0nKVxuICAgICAgaWYgYXJyLmxlbmd0aCA+IDFcbiAgICAgICAgdGlja3MgPSBAbnVtYmVyKGFyclswXSlcbiAgICAgICAgb2Zmc2V0ID0gQG51bWJlcihhcnJbMV0pXG4gICAgICAgIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpXG4gICAgICAgIHJldCA9IG5ldyBEYXRlKCh0aWNrcyAtICgobG9jYWxPZmZzZXQgKyAob2Zmc2V0IC8gMTAwICogNjApKSAqIDEwMDApKSlcbiAgICAgIGVsc2UgaWYgYXJyLmxlbmd0aCBpcyAxXG4gICAgICAgIHRpY2tzID0gQG51bWJlcihhcnJbMF0pXG4gICAgICAgIHJldCA9IG5ldyBEYXRlKHRpY2tzKVxuICAgIHJldFxuXG4gICMgIyMgYmluYXJ5XG4gICMgY29udmVydCBhbiBvYmplY3QgdG8gYmluYXJ5IDAgb3IgMVxuICBAYmluYXJ5OiAob2JqKSAtPlxuICAgIHJldCA9IE5hTlxuICAgIGlmIG9iaiBpcyAwIG9yIG9iaiBpcyAnMCcgb3Igb2JqIGlzICcnIG9yIG9iaiBpcyBmYWxzZSBvciBAc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgaXMgJ2ZhbHNlJ1xuICAgICAgcmV0ID0gMFxuICAgIGVsc2UgcmV0ID0gMSAgaWYgb2JqIGlzIDEgb3Igb2JqIGlzICcxJyBvciBvYmogaXMgdHJ1ZSBvciBAc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgaXMgJ3RydWUnXG4gICAgcmV0XG5cblxuICAjICMjIG51bWJlclxuICAjXG4gICMgQXR0ZW1wdHMgdG8gY29udmVydCBhbiBhcmJpdHJhcnkgdmFsdWUgdG8gYSBOdW1iZXIuXG4gICMgTG9vc2UgZmFsc3kgdmFsdWVzIGFyZSBjb252ZXJ0ZWQgdG8gMC5cbiAgIyBMb29zZSB0cnV0aHkgdmFsdWVzIGFyZSBjb252ZXJ0ZWQgdG8gMS5cbiAgIyBBbGwgb3RoZXIgdmFsdWVzIGFyZSBwYXJzZWQgYXMgSW50ZWdlcnMuXG4gICMgRmFpbHVyZXMgcmV0dXJuIGFzIE5hTi5cbiAgI1xuICBAbnVtYmVyOiAoaW5wdXROdW0sIGRlZmF1bHROdW0pIC0+XG4gICAgdHJ5R2V0TnVtYmVyID0gKHZhbCkgPT5cbiAgICAgIHJldCA9IE5hTlxuICAgICAgIyBpZiBgdmFsYCBhbHJlYWR5IChpcylbaXMuaHRtbF0gYSBOdW1iZXIsIHJldHVybiBpdFxuICAgICAgaWYgSVMubnVtYmVyKHZhbClcbiAgICAgICAgcmV0ID0gdmFsXG4gICAgICAjIGVsc2UgaWYgYHZhbGAgYWxyZWFkeSAoaXMpW2lzLmh0bWxdIGEgU3RyaW5nIG9yIGEgQm9vbGVhbiwgY29udmVydCBpdFxuICAgICAgZWxzZSBpZiBJUy5zdHJpbmcodmFsKSBvciBJUy5ib29sKHZhbClcbiAgICAgICAgdHJ5R2V0ID0gKHZhbHVlKSA9PlxuICAgICAgICAgIG51bSA9IEBiaW5hcnkodmFsdWUpXG4gICAgICAgICAgbnVtID0gK3ZhbHVlICBpZiBub3QgSVMubnVtYmVyKG51bSkgYW5kIHZhbHVlXG4gICAgICAgICAgbnVtID0gXy5wYXJzZUludCh2YWx1ZSwgMCkgaWYgbm90IElTLm51bWJlcihudW0pXG4gICAgICAgICAgbnVtXG4gICAgICAgIHJldCA9IHRyeUdldCB2YWxcbiAgICAgIHJldFxuXG4gICAgcmV0VmFsID0gdHJ5R2V0TnVtYmVyKGlucHV0TnVtKVxuICAgIGlmIG5vdCBJUy5udW1iZXIocmV0VmFsKVxuICAgICAgcmV0VmFsID0gdHJ5R2V0TnVtYmVyKGRlZmF1bHROdW0pXG4gICAgICByZXRWYWwgPSBOdW1iZXIuTmFOIGlmIG5vdCBJUy5udW1iZXIocmV0VmFsKVxuICAgIHJldFZhbFxuXG4gICMgIyMgc3RyaW5nXG4gICMgY29udmVydCBhbiBvYmplY3QgdG8gc3RyaW5nXG4gIEBzdHJpbmc6IChpbnB1dFN0ciwgZGVmYXVsdFN0cikgLT5cbiAgICB0cnlHZXRTdHJpbmcgPSAoc3RyKSA9PlxuICAgICAgcmV0ID0gdW5kZWZpbmVkXG4gICAgICBpZiBJUy5zdHJpbmcoc3RyKVxuICAgICAgICByZXQgPSBzdHJcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0ID0gJydcbiAgICAgICAgcmV0ID0gc3RyLnRvU3RyaW5nKCkgIGlmIElTLmJvb2woc3RyKSBvciBJUy5udW1iZXIoc3RyKSBvciBJUy5kYXRlKHN0cilcbiAgICAgIHJldFxuICAgIHJldDEgPSB0cnlHZXRTdHJpbmcoaW5wdXRTdHIpXG4gICAgcmV0MiA9IHRyeUdldFN0cmluZyhkZWZhdWx0U3RyKVxuICAgIHJldFZhbCA9ICcnXG4gICAgaWYgcmV0MS5sZW5ndGggaXNudCAwXG4gICAgICByZXRWYWwgPSByZXQxXG4gICAgZWxzZSBpZiByZXQxIGlzIHJldDIgb3IgcmV0Mi5sZW5ndGggaXMgMFxuICAgICAgcmV0VmFsID0gcmV0MVxuICAgIGVsc2VcbiAgICAgIHJldFZhbCA9IHJldDJcbiAgICByZXRWYWxcblxuT0oucmVnaXN0ZXIgJ3RvJywgVE9cbm1vZHVsZS5leHBvcnRzID0gVE8iXX0=
},{"../oj":58,"./is":67}],73:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZW50cnlwb2ludC5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGFzeW5jXFxhamF4LmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcYXN5bmNcXHByb21pc2UuY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb21wb25lbnRzXFxncmlkLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcaW5wdXRncm91cC5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXHRhYnMuY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb21wb25lbnRzXFx0aWxlLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29udHJvbHNcXGljb24uY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxkYXRlLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxcZnVuY3Rpb24uY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxudW1iZXIuY29mZmVlIiwic3JjL2NvZmZlZS9jb3JlL29iamVjdC5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXHByb3BlcnR5LmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxcc3RyaW5nLmNvZmZlZSIsInNyYy9jb2ZmZWUvZG9tL2JvZHkuY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGNvbXBvbmVudC5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcY29udHJvbC5jb2ZmZWUiLCJzcmMvY29mZmVlL2RvbS9lbGVtZW50LmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxmcmFnbWVudC5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZ2VuZXJpY3MuY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGlucHV0LmNvZmZlZSIsInNyYy9jb2ZmZWUvZG9tL25vZGUuY29mZmVlIiwic3JjL2NvZmZlZS9kb20vbm9kZUZhY3RvcnkuY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcYS5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxici5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxmb3JtLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGlucHV0LmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXG9sLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHNlbGVjdC5jb2ZmZWUiLCJzcmMvY29mZmVlL2VsZW1lbnRzL3RhYmxlLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHRleHRhcmVhLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHRoZWFkLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHVsLmNvZmZlZSIsInNyYy9jb2ZmZWUvZ2xvYmFsLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxidXR0b25pbnB1dC5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcY2hlY2tib3guY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGNvbG9yLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxkYXRlLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxkYXRldGltZS5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZXRpbWVsb2NhbC5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZW1haWwuY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGZpbGUuY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGhpZGRlbi5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcaW1hZ2VpbnB1dC5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcbW9udGguY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXG51bWJlci5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xccGFzc3dvcmQuY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJhZGlvLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxyYW5nZS5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xccmVzZXQuY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHNlYXJjaC5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcc3VibWl0LmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx0ZWwuY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHRleHRpbnB1dC5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdGltZS5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdXJsLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx3ZWVrLmNvZmZlZSIsInNyYy9jb2ZmZWUvb2ouY29mZmVlIiwic3JjL2NvZmZlZS9vakluaXQuY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcSnNvblRvVGFibGUuY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcYXJyYXkyRC5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxjb25zb2xlLmNvZmZlZSIsInNyYy9jb2ZmZWUvdG9vbHMvY29va2llLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGRlZmVyLmNvZmZlZSIsImQ6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGVhY2guY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZW51bXMuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy9pcy5jb2ZmZWUiLCJzcmMvY29mZmVlL3Rvb2xzL25vdHkuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy9wdWJzdWIuY29mZmVlIiwiZDpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xccXVlcnlTdHJpbmcuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy9yYW5nZXMuY29mZmVlIiwic3JjL2NvZmZlZS90b29scy90by5jb2ZmZWUiLCJkOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFx1dWlkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE9BQUEsQ0FBUSxNQUFSOztBQUNBLE9BQUEsQ0FBUSxVQUFSOztBQUNBLE9BQUEsQ0FBUSxjQUFSOztBQUNBLE9BQUEsQ0FBUSxpQkFBUjs7QUFDQSxPQUFBLENBQVEsbUJBQVI7O0FBQ0EsT0FBQSxDQUFRLHlCQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsbUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxhQUFSOztBQUNBLE9BQUEsQ0FBUSxpQkFBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsbUJBQVI7O0FBQ0EsT0FBQSxDQUFRLFlBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxZQUFSOztBQUNBLE9BQUEsQ0FBUSxlQUFSOztBQUNBLE9BQUEsQ0FBUSxnQkFBUjs7QUFDQSxPQUFBLENBQVEsZ0JBQVI7O0FBQ0EsT0FBQSxDQUFRLGFBQVI7O0FBQ0EsT0FBQSxDQUFRLGNBQVI7O0FBQ0EsT0FBQSxDQUFRLGVBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxrQkFBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsbUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGtCQUFSOztBQUNBLE9BQUEsQ0FBUSxxQkFBUjs7QUFDQSxPQUFBLENBQVEsa0JBQVI7O0FBQ0EsT0FBQSxDQUFRLGVBQVI7O0FBQ0EsT0FBQSxDQUFRLHNCQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsZ0JBQVI7O0FBQ0EsT0FBQSxDQUFRLGVBQVI7O0FBQ0EsT0FBQSxDQUFRLG1CQUFSOztBQUNBLE9BQUEsQ0FBUSx3QkFBUjs7QUFDQSxPQUFBLENBQVEsZ0JBQVI7O0FBQ0EsT0FBQSxDQUFRLGVBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxxQkFBUjs7QUFDQSxPQUFBLENBQVEsZ0JBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxtQkFBUjs7QUFDQSxPQUFBLENBQVEsZ0JBQVI7O0FBQ0EsT0FBQSxDQUFRLGdCQUFSOztBQUNBLE9BQUEsQ0FBUSxnQkFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxjQUFSOztBQUNBLE9BQUEsQ0FBUSxvQkFBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsY0FBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsaUJBQVI7O0FBQ0EsT0FBQSxDQUFRLGlCQUFSOztBQUNBLE9BQUEsQ0FBUSxnQkFBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsY0FBUjs7QUFDQSxPQUFBLENBQVEsZUFBUjs7QUFDQSxPQUFBLENBQVEsWUFBUjs7QUFDQSxPQUFBLENBQVEsY0FBUjs7QUFDQSxPQUFBLENBQVEsZ0JBQVI7O0FBQ0EsT0FBQSxDQUFRLHFCQUFSOztBQUNBLE9BQUEsQ0FBUSxnQkFBUjs7QUFDQSxPQUFBLENBQVEsWUFBUjs7QUFDQSxPQUFBLENBQVEsY0FBUjs7Ozs7QUNsRUEsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBRUwsTUFBQSxHQUFTOztBQUdULE1BQU0sQ0FBQyxTQUFQLEdBQW1CLFNBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxHQUFiO0FBQ2pCLE1BQUE7RUFBQSxRQUFBLEdBQVc7RUFDWCxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsSUFBcEI7RUFDQSxJQUFJLENBQUMsU0FBTCxDQUFlLFFBQWY7RUFDQSxJQUFHLEVBQUUsQ0FBQyxZQUFOO0lBQ0UsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFYLENBQWlCO01BQ2Y7UUFBQSxVQUFBLEVBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUExQjtRQUNBLFNBQUEsRUFBVyxJQUFJLENBQUMsU0FEaEI7UUFFQSxPQUFBLEVBQWEsSUFBQSxJQUFBLENBQUEsQ0FGYjtPQURlO0tBQWpCLEVBREY7O0FBSmlCOztBQWFuQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLGNBQUQsRUFBaUIsVUFBakIsRUFBNkIsTUFBN0IsRUFBcUMsSUFBckM7O0lBQXFDLE9BQU8sRUFBRSxDQUFDLE1BQUgsQ0FBQTs7RUFDM0QsSUFBRyxVQUFBLEtBQWdCLE9BQW5CO0lBQ0UsSUFBRyxFQUFFLENBQUMsbUJBQU47TUFDRSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQVgsQ0FBaUI7UUFDZjtVQUFBLFVBQUEsRUFBWSxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQTFCO1VBQ0EsSUFBQSxFQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsSUFEcEI7VUFFQSxNQUFBLEVBQVEsVUFGUjtVQUdBLEtBQUEsRUFBTyxjQUFjLENBQUMsS0FBZixDQUFBLENBSFA7VUFJQSxNQUFBLEVBQVEsY0FBYyxDQUFDLE1BSnZCO1VBS0EsVUFBQSxFQUFZLGNBQWMsQ0FBQyxVQUwzQjtVQU1BLFVBQUEsRUFBWSxjQUFjLENBQUMsVUFOM0I7VUFPQSxZQUFBLEVBQWMsY0FBYyxDQUFDLFlBUDdCO1NBRGU7T0FBakIsRUFERjs7SUFZQSxJQUFJLENBQUMsT0FBTCxDQUFhLFVBQWIsRUFiRjs7QUFEZTs7QUFrQmpCLFdBQUEsR0FBYyxTQUFDLElBQUQ7QUFDWixNQUFBO0VBQUEsSUFBRyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU4sQ0FBYSxJQUFiLENBQUg7SUFDRSxHQUFBLEdBQU07SUFDTixJQUFBLEdBQU8sRUFBRSxDQUFDLE1BQUgsQ0FBQTtJQUNQLElBQUksQ0FBQyxHQUFMLENBQVMsVUFBVCxFQUFxQixFQUFFLENBQUMsTUFBSCxDQUFBLENBQXJCO0lBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLEtBQWxCLEVBQXlCLEdBQXpCLEVBSkY7O1NBS0E7QUFOWTs7QUFjZCxNQUFNLENBQUMsV0FBUCxHQUFxQixTQUFDLElBQUQsRUFBZSxJQUFmO0FBQ25CLE1BQUE7O0lBRG9CLE9BQU87O0VBQzNCLFFBQUEsR0FDRTtJQUFBLFFBQUEsRUFDRTtNQUFBLEdBQUEsRUFBSyxFQUFMO01BQ0EsSUFBQSxFQUFNLEVBRE47TUFFQSxJQUFBLEVBQU0sSUFGTjtNQUdBLFNBQUEsRUFDRTtRQUFBLGVBQUEsRUFBaUIsSUFBakI7T0FKRjtNQUtBLFFBQUEsRUFBVSxNQUxWO01BTUEsV0FBQSxFQUFhLGlDQU5iO0tBREY7SUFTQSxTQUFBLEVBQVcsRUFBRSxDQUFDLElBVGQ7SUFVQSxPQUFBLEVBQVMsRUFBRSxDQUFDLElBVlo7SUFXQSxVQUFBLEVBQVksRUFBRSxDQUFDLElBWGY7SUFZQSxhQUFBLEVBQWUsS0FaZjtJQWFBLFdBQUEsRUFBYSxJQWJiO0lBY0EsUUFBQSxFQUFVLEtBZFY7O0VBZ0JGLElBQUEsR0FBTyxXQUFBLENBQVksSUFBWjtFQUNQLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixJQUFwQixFQUEwQixJQUExQjtFQUVBLFFBQVEsQ0FBQyxTQUFULEdBQXlCLElBQUEsSUFBQSxDQUFBO0VBRXpCLElBQUcsS0FBQSxLQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBTixDQUFrQixRQUFRLENBQUMsUUFBUSxDQUFDLElBQXBDLENBQVo7SUFFRSxJQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBbEIsS0FBMEIsS0FBN0I7TUFDRSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQWxCLEdBQXlCLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUE1QixFQUQzQjtLQUFBLE1BQUE7TUFJRSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQWxCLEdBQXlCLEVBQUUsQ0FBQyxTQUFILENBQWEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUEvQixFQUozQjtLQUZGOztFQVFBLGlCQUFBLEdBQW9CLFNBQUMsV0FBRDtBQUNsQixRQUFBO0lBQUEsR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sUUFBUSxDQUFDLFFBQWhCO0lBRU4sR0FBRyxDQUFDLElBQUosQ0FBUyxTQUFDLElBQUQsRUFBTyxVQUFQLEVBQW1CLEtBQW5CO2FBQ1AsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsUUFBakIsRUFBMkIsSUFBM0I7SUFETyxDQUFUO0lBR0EsR0FBRyxDQUFDLElBQUosQ0FBUyxTQUFDLEtBQUQsRUFBUSxVQUFSLEVBQW9CLFNBQXBCO2FBQ1AsTUFBTSxDQUFDLE9BQVAsQ0FBZSxLQUFmLEVBQXNCLFVBQXRCLEVBQWtDLFNBQWxDLEVBQTZDLFFBQTdDO0lBRE8sQ0FBVDtJQUdBLEdBQUcsQ0FBQyxNQUFKLENBQVcsU0FBQyxjQUFELEVBQWlCLFVBQWpCO2FBQ1QsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsY0FBcEIsRUFBb0MsVUFBcEM7SUFEUyxDQUFYO1dBR0EsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFULENBQXFCLEdBQXJCO0VBWmtCO0VBY3BCLE9BQUEsR0FBVSxpQkFBQSxDQUFrQixRQUFRLENBQUMsV0FBM0I7U0FDVjtBQTlDbUI7O0FBZ0RyQixJQUFBLEdBQU87O0FBT1AsSUFBSSxDQUFDLElBQUwsR0FBWSxTQUFDLElBQUQ7U0FDVixNQUFNLENBQUMsV0FBUCxDQUFtQixNQUFuQixFQUEyQixJQUEzQjtBQURVOztBQVNaLElBQUksQ0FBQyxHQUFMLEdBQVcsU0FBQyxJQUFEO1NBQ1QsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsS0FBbkIsRUFBMEIsSUFBMUI7QUFEUzs7QUFRWCxJQUFJLENBQUMsUUFBRCxDQUFKLEdBQWMsU0FBQyxJQUFEO1NBQ1osTUFBTSxDQUFDLFdBQVAsQ0FBbUIsUUFBbkIsRUFBNkIsSUFBN0I7QUFEWTs7QUFRZCxJQUFJLENBQUMsR0FBTCxHQUFXLFNBQUMsSUFBRDtTQUNULE1BQU0sQ0FBQyxXQUFQLENBQW1CLEtBQW5CLEVBQTBCLElBQTFCO0FBRFM7O0FBR1gsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLE1BQWxCLEVBQTBCLElBQTFCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7OztBQ3RJakIsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBS0wsV0FBQSxHQUFjLFNBQUMsSUFBRDtBQUNaLE1BQUE7RUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBaEI7RUFDVixPQUFPLENBQUMsS0FBUixHQUFnQixJQUFJLENBQUM7RUFDckIsT0FBTyxDQUFDLFVBQVIsR0FBcUIsSUFBSSxDQUFDO1NBQzFCO0FBSlk7O0FBU2QsR0FBQSxHQUFNLFNBQUMsU0FBRDtBQUNKLE1BQUE7RUFBQSxJQUFBLEdBQU8sU0FBQSxJQUFhO0VBQ3BCLE9BQUEsR0FBVSxPQUFPLENBQUMsR0FBUixDQUFZLElBQVo7RUFDVixPQUFPLENBQUMsSUFBUixHQUFlLFNBQUMsSUFBRDtJQUNiLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVjtFQURhO1NBR2Y7QUFOSTs7QUFXTixJQUFBLEdBQU8sU0FBQyxJQUFEO0FBQ0wsTUFBQTs7SUFETSxPQUFPLEVBQUUsQ0FBQzs7RUFDaEIsR0FBQSxHQUFNLE9BQU8sQ0FBQyxNQUFSLENBQWUsSUFBZjtTQUNOO0FBRks7O0FBS1AsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLE9BQWxCLEVBQTJCLElBQTNCOztBQUNBLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBVCxDQUFrQixLQUFsQixFQUF5QixHQUF6Qjs7QUFDQSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsYUFBbEIsRUFBaUMsV0FBakM7O0FBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtFQUFBLEtBQUEsRUFBTyxJQUFQO0VBQ0EsR0FBQSxFQUFLLEdBREw7RUFFQSxXQUFBLEVBQWEsV0FGYjs7Ozs7O0FDckNGLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOztBQUNMLE9BQUEsQ0FBUSxXQUFSOztBQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsa0JBQVI7O0FBQ1osT0FBQSxHQUFVLE9BQUEsQ0FBUSxrQkFBUjs7QUFFVixRQUFBLEdBQVc7O0FBQ1gsU0FBQSxHQUFZOztBQUNaLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBUSxDQUFBLFNBQUEsQ0FBdEIsR0FBbUM7O0FBRW5DLEtBQUEsR0FBUSxTQUFDLE9BQUQsRUFBVSxLQUFWO0FBQ04sTUFBQTtFQUFBLFFBQUEsR0FDRTtJQUFBLFNBQUEsRUFDRTtNQUFBLFNBQUEsRUFBVyxFQUFYO01BQ0EsVUFBQSxFQUFZLEVBRFo7TUFFQSxTQUFBLEVBQVcsRUFGWDtLQURGO0lBSUEsS0FBQSxFQUNFO01BQUEsT0FBQSxFQUFPLE1BQVA7S0FMRjs7RUFPRixFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0I7RUFDQSxHQUFBLEdBQU0sU0FBQSxDQUFVLFFBQVYsRUFBb0IsS0FBcEIsRUFBMkIsUUFBM0I7RUFFTixJQUFBLEdBQU87RUFDUCxLQUFBLEdBQVEsT0FBQSxDQUFBO0VBRVIsV0FBQSxHQUFjLFNBQUE7V0FDWixLQUFLLENBQUMsSUFBTixDQUFXLFNBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxHQUFmO0FBQ1QsVUFBQTtNQUFBLElBQUcsQ0FBSSxHQUFQO1FBQ0UsR0FBQSxHQUFNLEdBQUcsQ0FBQyxHQUFKLENBQVEsS0FBUjtlQUNOLEdBQUcsQ0FBQyxJQUFKLENBQVMsTUFBVCxFQUFpQixLQUFqQixFQUF3QixFQUF4QixFQUZGOztJQURTLENBQVg7RUFEWTtFQU1kLEdBQUcsQ0FBQyxHQUFKLENBQVEsS0FBUixFQUFlLFNBQUMsS0FBRDtBQUNiLFFBQUE7O01BRGMsUUFBUSxJQUFJLENBQUMsTUFBTCxHQUFZLENBQVosSUFBaUI7O0lBQ3ZDLEtBQUEsR0FBUSxJQUFLLENBQUEsS0FBQSxHQUFNLENBQU47SUFDYixJQUFHLENBQUksS0FBUDtBQUNFLGFBQU0sSUFBSSxDQUFDLE1BQUwsR0FBYyxLQUFwQjtRQUNFLEtBQUEsR0FBUSxHQUFHLENBQUMsSUFBSixDQUFTLEtBQVQsRUFBZ0I7VUFBQSxLQUFBLEVBQU87WUFBQSxPQUFBLEVBQU8sS0FBUDtXQUFQO1NBQWhCO1FBQ1IsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFWO01BRkY7TUFHQSxLQUFLLENBQUMsR0FBTixDQUFVLE1BQVYsRUFBa0IsU0FBQyxLQUFELEVBQVEsSUFBUjtBQUNoQixZQUFBO1FBQUEsSUFBQSxHQUFPLEVBQUUsQ0FBQyxNQUFILENBQVcsRUFBRSxDQUFDLE1BQUgsQ0FBVSxFQUFWLEVBQWMsUUFBUSxDQUFDLFNBQXZCLENBQVgsRUFBOEMsSUFBOUM7UUFDUCxNQUFBLEdBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFkLENBQW1CLElBQW5CLEVBQXlCLEtBQXpCO1FBQ1QsS0FBSyxDQUFDLEdBQU4sQ0FBVSxLQUFWLEVBQWlCLEtBQWpCLEVBQXdCLE1BQXhCO2VBQ0E7TUFKZ0IsQ0FBbEIsRUFKRjs7V0FTQTtFQVhhLENBQWY7RUFhQSxHQUFHLENBQUMsR0FBSixDQUFRLE1BQVIsRUFBZ0IsU0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLElBQWY7QUFDZCxRQUFBO0lBQUEsSUFBRyxDQUFJLEtBQUosSUFBYSxLQUFBLEdBQVEsQ0FBeEI7TUFBK0IsS0FBQSxHQUFRLEVBQXZDOztJQUNBLElBQUcsQ0FBSSxLQUFKLElBQWEsS0FBQSxHQUFRLENBQXhCO01BQStCLEtBQUEsR0FBUSxFQUF2Qzs7SUFFQSxHQUFBLEdBQU0sR0FBRyxDQUFDLEdBQUosQ0FBUSxLQUFSO0lBQ04sSUFBQSxHQUFPLEtBQUssQ0FBQyxHQUFOLENBQVUsS0FBVixFQUFpQixLQUFqQjtJQUVQLElBQUcsQ0FBSSxJQUFQO01BQ0UsQ0FBQSxHQUFJO0FBQ0osYUFBTSxDQUFBLEdBQUksS0FBVjtRQUNFLENBQUEsSUFBSztRQUNMLE9BQUEsR0FBVSxLQUFLLENBQUMsR0FBTixDQUFVLEtBQVYsRUFBaUIsQ0FBakI7UUFDVixJQUFHLENBQUksT0FBUDtVQUNFLElBQUcsQ0FBQSxLQUFLLEtBQVI7WUFDRSxJQUFBLEdBQU8sR0FBRyxDQUFDLElBQUosQ0FBUyxNQUFULEVBQWlCLElBQWpCLEVBRFQ7V0FBQSxNQUVLLElBQUcsQ0FBSSxJQUFQO1lBQ0gsR0FBRyxDQUFDLElBQUosQ0FBUyxNQUFULEVBREc7V0FIUDs7TUFIRixDQUZGOztJQVdBLFdBQUEsQ0FBQTtXQUNBO0VBbkJjLENBQWhCO1NBcUJBO0FBdkRNOztBQXlEUixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQWQsQ0FBdUIsU0FBdkIsRUFBa0MsS0FBbEM7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDbkVqQixJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxPQUFBLENBQVEsV0FBUjs7QUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLGtCQUFSOztBQUNaLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUjs7QUFFUCxRQUFBLEdBQVc7O0FBQ1gsU0FBQSxHQUFZOztBQUVaLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBUSxDQUFBLFNBQUEsQ0FBdEIsR0FBbUM7O0FBRW5DLEtBQUEsR0FBUSxTQUFDLE9BQUQsRUFBVSxLQUFWO0FBQ04sTUFBQTtFQUFBLEtBQUEsR0FBUSxJQUFBLENBQUE7RUFDUixRQUFBLEdBQ0U7SUFBQSxLQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQU8sWUFBUDtLQURGO0lBRUEsTUFBQSxFQUNFO01BQUEsTUFBQSxFQUFRLEVBQUUsQ0FBQyxJQUFYO0tBSEY7SUFJQSxLQUFBLEVBQUssS0FKTDtJQUtBLFNBQUEsRUFBVyxFQUxYO0lBTUEsU0FBQSxFQUNFO01BQUEsS0FBQSxFQUNFO1FBQUEsRUFBQSxFQUFJLEtBQUo7UUFDQSxJQUFBLEVBQU0sTUFETjtRQUVBLE9BQUEsRUFBTyxFQUZQO1FBR0EsV0FBQSxFQUFhLEVBSGI7UUFJQSxLQUFBLEVBQU8sRUFKUDtPQURGO0tBUEY7O0VBY0YsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCO0VBQ0EsR0FBQSxHQUFNLFNBQUEsQ0FBVSxRQUFWLEVBQW9CLEtBQXBCLEVBQTJCLFFBQTNCO0VBRU4sS0FBQSxHQUFRLEdBQUcsQ0FBQyxJQUFKLENBQVMsS0FBVCxFQUFnQjtJQUFBLEtBQUEsRUFBTztNQUFBLE9BQUEsRUFBTyxZQUFQO0tBQVA7R0FBaEI7RUFFUixHQUFHLENBQUMsVUFBSixHQUFpQixLQUFLLENBQUMsSUFBTixDQUFXLE9BQVgsRUFBb0I7SUFBQSxLQUFBLEVBQU87TUFBRSxLQUFBLEVBQUssS0FBUDtLQUFQO0lBQXVCLElBQUEsRUFBTSxRQUFRLENBQUMsU0FBdEM7R0FBcEI7RUFFakIsUUFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBRCxDQUF4QixJQUFrQztFQUNsQyxHQUFHLENBQUMsVUFBSixHQUFpQixLQUFLLENBQUMsSUFBTixDQUFXLE9BQVgsRUFBb0IsUUFBUSxDQUFDLFNBQTdCO0VBRWpCLEdBQUcsQ0FBQyxVQUFKLEdBQWlCLFNBQUE7V0FDZixHQUFHLENBQUMsVUFBVSxDQUFDLEdBQWYsQ0FBQTtFQURlO1NBR2pCO0FBOUJNOztBQWdDUixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQWQsQ0FBdUIsU0FBdkIsRUFBa0MsS0FBbEM7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDM0NqQixJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxPQUFBLENBQVEsV0FBUjs7QUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLGtCQUFSOztBQUVaLFFBQUEsR0FBVzs7QUFDWCxTQUFBLEdBQVk7O0FBRVosRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFRLENBQUEsU0FBQSxDQUF0QixHQUFtQzs7QUFFbkMsS0FBQSxHQUFRLFNBQUMsT0FBRCxFQUFVLEtBQVY7QUFDTixNQUFBO0VBQUEsUUFBQSxHQUNFO0lBQUEsSUFBQSxFQUFNLEVBQU47SUFDQSxLQUFBLEVBQ0U7TUFBQSxPQUFBLEVBQU8sRUFBUDtLQUZGOztFQUlGLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QjtFQUNBLEdBQUEsR0FBTSxTQUFBLENBQVUsUUFBVixFQUFvQixLQUFwQixFQUEyQixRQUEzQjtFQUVOLElBQUEsR0FBTyxHQUFHLENBQUMsSUFBSixDQUFTLElBQVQsRUFBZTtJQUFBLEtBQUEsRUFBTztNQUFBLE9BQUEsRUFBTyxjQUFQO0tBQVA7R0FBZjtFQUNQLE9BQUEsR0FBVSxHQUFHLENBQUMsSUFBSixDQUFTLEtBQVQsRUFBZ0I7SUFBQSxLQUFBLEVBQU87TUFBQSxPQUFBLEVBQU8sYUFBUDtLQUFQO0dBQWhCO0VBRVYsS0FBQSxHQUFRO0VBQ1IsRUFBRSxDQUFDLElBQUgsQ0FBUSxRQUFRLENBQUMsSUFBakIsRUFBdUIsU0FBQyxNQUFELEVBQVMsT0FBVDtBQUNyQixRQUFBO0lBQUEsUUFBQSxHQUFXO0lBQ1gsSUFBRyxLQUFIO01BQ0UsS0FBQSxHQUFRO01BQ1IsUUFBQSxHQUFXLFNBRmI7O0lBR0EsQ0FBQSxHQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBVixFQUFnQjtNQUFBLEtBQUEsRUFBTztRQUFBLE9BQUEsRUFBTyxRQUFQO09BQVA7S0FBaEIsQ0FDRixDQUFDLElBREMsQ0FDSSxHQURKLEVBRUE7TUFBQSxJQUFBLEVBQU0sT0FBTjtNQUNBLEtBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxHQUFBLEdBQU0sT0FBWjtRQUNBLGFBQUEsRUFBZSxLQURmO09BRkY7TUFJQSxNQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sU0FBQTtpQkFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUosQ0FBUSxNQUFSO1FBREssQ0FBUDtPQUxGO0tBRkE7SUFVSixlQUFBLEdBQWtCLFdBQUEsR0FBYztXQUNoQyxHQUFHLENBQUMsR0FBSixDQUFRLE9BQVIsRUFBaUIsT0FBTyxDQUFDLElBQVIsQ0FBYSxLQUFiLEVBQW9CO01BQUEsS0FBQSxFQUFPO1FBQUEsT0FBQSxFQUFPLGVBQVA7UUFBd0IsRUFBQSxFQUFJLE9BQTVCO09BQVA7S0FBcEIsQ0FBakI7RUFoQnFCLENBQXZCO1NBa0JBO0FBL0JNOztBQWlDUixFQUFFLENBQUMsVUFBVSxDQUFDLFFBQWQsQ0FBdUIsU0FBdkIsRUFBa0MsS0FBbEM7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDM0NqQixJQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUjs7QUFDTCxPQUFBLENBQVEsV0FBUjs7QUFDQSxTQUFBLEdBQVksT0FBQSxDQUFRLGtCQUFSOztBQUVaLFFBQUEsR0FBVzs7QUFDWCxTQUFBLEdBQVk7O0FBRVosRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFRLENBQUEsU0FBQSxDQUF0QixHQUFtQzs7QUFFbkMsS0FBQSxHQUFRLFNBQUMsT0FBRCxFQUFVLEtBQVY7QUFDTixNQUFBO0VBQUEsUUFBQSxHQUNFO0lBQUEsS0FBQSxFQUNFO01BQUEsRUFBQSxFQUFJLEVBQUo7TUFDQSxFQUFBLEVBQUksRUFESjtNQUVBLEVBQUEsRUFBSSxFQUZKO01BR0EsRUFBQSxFQUFJLEVBSEo7S0FERjtJQUtBLEtBQUEsRUFDRTtNQUFBLE9BQUEsRUFBTyxNQUFQO0tBTkY7O0VBUUYsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCO0VBQ0EsSUFBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQWxCO0lBQTBCLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBRCxDQUFkLElBQXdCLFVBQUEsR0FBYSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQTlFOztFQUNBLElBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFsQjtJQUEwQixRQUFRLENBQUMsS0FBSyxDQUFDLE9BQUQsQ0FBZCxJQUF3QixVQUFBLEdBQWEsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUE5RTs7RUFDQSxJQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBbEI7SUFBMEIsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFELENBQWQsSUFBd0IsVUFBQSxHQUFhLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBOUU7O0VBQ0EsSUFBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQWxCO0lBQTBCLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBRCxDQUFkLElBQXdCLFVBQUEsR0FBYSxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQTlFOztFQUVBLEdBQUEsR0FBTSxFQUFFLENBQUMsU0FBSCxDQUFhLFFBQWIsRUFBdUIsS0FBdkIsRUFBOEIsUUFBOUI7U0FDTjtBQWpCTTs7QUFtQlIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFkLENBQXVCLFNBQXZCLEVBQWtDLEtBQWxDOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7OztBQzdCakIsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBQ0wsT0FBQSxDQUFRLFdBQVI7O0FBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxnQkFBUjs7QUFFVixXQUFBLEdBQWM7O0FBQ2QsWUFBQSxHQUFlOztBQUVmLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBUSxDQUFBLFlBQUEsQ0FBcEIsR0FBb0M7O0FBRXBDLEtBQUEsR0FBUSxTQUFDLE9BQUQsRUFBVSxLQUFWO0FBQ04sTUFBQTtFQUFBLFFBQUEsR0FDRTtJQUFBLFFBQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxFQUFOO01BQ0EsV0FBQSxFQUFhLEVBRGI7TUFFQSxRQUFBLEVBQVUsRUFGVjtNQUdBLElBQUEsRUFBTSxLQUhOO01BSUEsS0FBQSxFQUFPLEVBSlA7TUFLQSxPQUFBLEVBQVMsRUFMVDtNQU1BLFlBQUEsRUFBYyxLQU5kO01BT0EsTUFBQSxFQUFRLEtBUFI7TUFRQSxTQUFBLEVBQVcsS0FSWDtLQURGO0lBVUEsS0FBQSxFQUNFO01BQUEsT0FBQSxFQUFPLEVBQVA7S0FYRjtJQVlBLFlBQUEsRUFBYyxNQVpkOztFQWNGLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQjtFQUNBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixFQUFrQixLQUFsQixFQUF5QixXQUF6QjtFQUVOLFNBQUEsR0FBWTtFQUtaLGFBQUEsR0FBZ0I7RUFDaEIsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQXJCO0lBQXVDLGFBQUEsSUFBaUIsU0FBeEQ7O0VBQ0EsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQXJCO0lBQWlDLGFBQUEsSUFBaUIsU0FBbEQ7O0VBQ0EsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQXJCO0lBQW9DLGFBQUEsSUFBaUIsV0FBckQ7O0VBQ0EsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQXJCO0lBQ0UsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQWxCLEdBQXlCLENBQXpCLElBQStCLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBbEIsSUFBMEIsQ0FBNUQ7TUFDRSxhQUFBLElBQWlCLEtBQUEsR0FBUSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQTFCLEdBQWlDLEtBRHBEO0tBREY7O0VBSUEsU0FBQSxHQUFZLGFBQUEsR0FBZ0IsS0FBaEIsR0FBd0IsUUFBUSxDQUFDLFFBQVEsQ0FBQztFQUN0RCxHQUFHLENBQUMsTUFBSixHQUFhLEdBQUcsQ0FBQyxJQUFKLENBQVMsR0FBVCxFQUFjO0lBQUEsS0FBQSxFQUFPO01BQUEsT0FBQSxFQUFPLFNBQVA7S0FBUDtHQUFkO0VBR2IsR0FBRyxDQUFDLFVBQUosR0FBaUIsU0FBQTtBQUNmLFFBQUE7SUFBQSxJQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBckI7TUFDRSxPQUFBLEdBQVUsUUFBUSxDQUFDLFFBQVEsQ0FBQztNQUU1QixTQUFBLEdBQVksQ0FBQztNQUViLElBQUcsU0FBSDtRQUNFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQWIsQ0FBeUIsS0FBQSxHQUFRLE9BQWpDO1FBQ0EsT0FBQSxHQUFVLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FGOUI7T0FBQSxNQUFBO1FBSUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBYixDQUF5QixLQUFBLEdBQVEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFuRCxFQUpGOzthQU1BLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQWIsQ0FBc0IsS0FBQSxHQUFRLE9BQTlCLEVBWEY7O0VBRGU7U0FlakI7QUFuRE07O0FBcURSLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBWixDQUFxQixZQUFyQixFQUFtQyxLQUFuQzs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQjs7Ozs7QUMvRGpCLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOztBQUVMLGlCQUFBLEdBQW9CLFNBQUMsTUFBRDtBQWFsQixNQUFBO0VBQUEsU0FBQSxHQUFZLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTixDQUFhLE1BQWI7RUFDWixHQUFBLEdBQU07RUFDTixLQUFBLEdBQVE7RUFDUixNQUFBLEdBQVM7RUFDVCxXQUFBLEdBQWM7RUFDZCxHQUFBLEdBQU07RUFDTixHQUFBLEdBQU0sRUFBRSxDQUFDO0VBQ1QsSUFBRyxLQUFBLEtBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFOLENBQWtCLFNBQWxCLENBQVo7SUFDRSxTQUFBLEdBQVksU0FBUyxDQUFDLE9BQVYsQ0FBa0IsR0FBbEIsRUFBdUIsRUFBdkI7SUFDWixTQUFBLEdBQVksU0FBUyxDQUFDLE9BQVYsQ0FBa0IsTUFBbEIsRUFBMEIsRUFBMUI7SUFDWixTQUFBLEdBQVksU0FBUyxDQUFDLE9BQVYsQ0FBa0IsR0FBbEIsRUFBdUIsRUFBdkI7SUFDWixTQUFBLEdBQVksU0FBUyxDQUFDLE9BQVYsQ0FBa0IsR0FBbEIsRUFBdUIsRUFBdkI7SUFDWixHQUFBLEdBQU0sU0FBUyxDQUFDLEtBQVYsQ0FBZ0IsR0FBaEI7SUFDTixJQUFHLEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FBaEI7TUFDRSxLQUFBLEdBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsR0FBSSxDQUFBLENBQUEsQ0FBakI7TUFDUixNQUFBLEdBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsR0FBSSxDQUFBLENBQUEsQ0FBakI7TUFDVCxXQUFBLEdBQWtCLElBQUEsSUFBQSxDQUFBLENBQU0sQ0FBQyxpQkFBUCxDQUFBO01BQ2xCLEdBQUEsR0FBVSxJQUFBLElBQUEsQ0FBTSxLQUFBLEdBQVEsQ0FBQyxDQUFDLFdBQUEsR0FBYyxDQUFDLE1BQUEsR0FBUyxHQUFULEdBQWUsRUFBaEIsQ0FBZixDQUFBLEdBQXNDLElBQXZDLENBQWQsRUFKWjtLQUFBLE1BS0ssSUFBRyxHQUFHLENBQUMsTUFBSixLQUFjLENBQWpCO01BQ0gsS0FBQSxHQUFRLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTixDQUFhLEdBQUksQ0FBQSxDQUFBLENBQWpCO01BQ1IsR0FBQSxHQUFVLElBQUEsSUFBQSxDQUFLLEtBQUwsRUFGUDtLQVhQOztFQWNBO0VBRUEsRUFBRSxDQUFDLFFBQUgsQ0FBWSxtQkFBWixFQUFpQyxpQkFBakM7U0FDQSxPQUFPLENBQUMsT0FBUixHQUFrQjtBQXJDQTs7Ozs7QUNGcEIsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBS0wsT0FBQSxHQUFVLFNBQUMsT0FBRDtFQUNSO0FBQUEsTUFBQTtFQUNBLEdBQUEsR0FBTTtFQUNOLElBQUEsR0FBTztBQUNQO0lBQ0UsSUFBK0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsT0FBYixDQUEvRDtNQUFBLEdBQUEsR0FBTSxPQUFPLENBQUMsS0FBUixDQUFjLElBQWQsRUFBb0IsS0FBSyxDQUFBLFNBQUUsQ0FBQSxLQUFLLENBQUMsSUFBYixDQUFrQixTQUFsQixFQUE2QixDQUE3QixDQUFwQixFQUFOO0tBREY7R0FBQSxhQUFBO0lBRU07SUFDSixJQUFHLENBQUMsU0FBUyxDQUFDLElBQVYsS0FBa0IsV0FBbEIsSUFBaUMsU0FBUyxDQUFDLElBQVYsS0FBa0IscUJBQXBELENBQUEsSUFBK0UsU0FBUyxDQUFDLElBQVYsS0FBa0IsMEJBQXBHO01BQ0UsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFYLENBQWdCLHNCQUFoQixFQUF3QyxTQUF4QyxFQURGO0tBQUEsTUFBQTtNQUdFLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBWCxDQUFpQixTQUFqQixFQUhGO0tBSEY7R0FBQTtBQUFBOztTQVNBO0FBYlE7O0FBZ0JULE1BQUEsR0FBUyxTQUFDLE9BQUQ7RUFDUjtBQUFBLE1BQUE7RUFDQSxJQUFBLEdBQU87U0FDUCxTQUFBO0FBQ0UsUUFBQTtJQUFBLElBQUEsR0FBTyxLQUFLLENBQUEsU0FBRSxDQUFBLEtBQUssQ0FBQyxJQUFiLENBQWtCLFNBQWxCLEVBQTZCLENBQTdCO0lBQ1AsSUFBSSxDQUFDLE9BQUwsQ0FBYSxPQUFiO1dBQ0EsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFYLENBQWlCLElBQWpCLEVBQXVCLElBQXZCO0VBSEY7QUFIUTs7QUFVVCxFQUFFLENBQUMsUUFBSCxDQUFZLFFBQVosRUFBc0IsTUFBdEI7O0FBQ0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxTQUFaLEVBQXVCLE9BQXZCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQ0M7RUFBQSxNQUFBLEVBQVEsTUFBUjtFQUNBLE9BQUEsRUFBUyxPQURUOzs7Ozs7QUNsQ0YsSUFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVI7O0FBRUwsTUFBQSxHQUFTLE1BQU0sQ0FBQyxNQUFQLENBQWMsSUFBZDs7QUFFVCxNQUFNLENBQUMsY0FBUCxDQUFzQixNQUF0QixFQUE4QixPQUE5QixFQUNFO0VBQUEsS0FBQSxFQUFPLENBQUssTUFBQSxJQUFXLE1BQU0sQ0FBQyxLQUF0QixHQUFrQyxNQUFNLENBQUMsS0FBekMsR0FBb0QsS0FBckQsQ0FBUDtDQURGOztBQUdBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE1BQXRCLEVBQThCLFVBQTlCLEVBQ0U7RUFBQSxLQUFBLEVBQU8sQ0FBSyxNQUFBLElBQVcsTUFBTSxDQUFDLFFBQXRCLEdBQXFDLE1BQU0sQ0FBQyxRQUE1QyxHQUEwRCxRQUEzRCxDQUFQO0NBREY7O0FBR0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsTUFBdEIsRUFBOEIsV0FBOUIsRUFDRTtFQUFBLEtBQUEsRUFBTyxDQUFLLE1BQUEsSUFBVyxNQUFNLENBQUMsU0FBdEIsR0FBc0MsTUFBTSxDQUFDLFNBQTdDLEdBQTRELHVCQUE3RCxDQUFQO0NBREY7O0FBR0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsTUFBdEIsRUFBOEIsV0FBOUIsRUFDRTtFQUFBLEtBQUEsRUFBTyxDQUFLLE1BQUEsSUFBVyxNQUFNLENBQUMsU0FBdEIsR0FBc0MsTUFBTSxDQUFDLFNBQTdDLEdBQTRELE1BQTdELENBQVA7Q0FERjs7QUFHQSxFQUFFLENBQUMsUUFBSCxDQUFZLFFBQVosRUFBc0IsTUFBdEI7O0FBQ0EsTUFBTSxDQUFDLE9BQVAsR0FBaUI7Ozs7O0FDakJqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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RUFSZDtJQVNBLFdBQUEsRUFBYSxJQVRiO0dBeFFGOzs7QUFtUkYsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLFNBQWxCLEVBQTZCLE9BQTdCOztBQUNBLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBVCxDQUFrQixZQUFsQixFQUFnQyxVQUFoQzs7QUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0VBQUEsT0FBQSxFQUFTLE9BQVQ7RUFDQSxVQUFBLEVBQVksVUFEWjs7Ozs7O0FDNVJGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOzs7QUFFTDs7OztBQUdBLFdBQUEsR0FBYyxTQUFDLEtBQUQ7QUFDWixNQUFBO0VBQUEsR0FBQSxHQUFNO0VBRU4sSUFBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQWI7SUFDRSxNQUFBLEdBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQTFCLENBQWlDLENBQWpDLENBQW1DLENBQUMsS0FBcEMsQ0FBMEMsR0FBMUM7SUFDVixJQUFHLE1BQUg7TUFDRSxDQUFBLEdBQUk7QUFDSixhQUFNLENBQUEsR0FBSSxNQUFNLENBQUMsTUFBakI7UUFDRSxHQUFBLEdBQU0sTUFBTyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQVYsQ0FBZ0IsR0FBaEI7UUFDTixJQUFHLEdBQUcsQ0FBQyxNQUFKLEtBQWMsQ0FBakI7VUFDRSxHQUFJLENBQUEsR0FBSSxDQUFBLENBQUEsQ0FBSixDQUFKLEdBQWMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxrQkFBVixDQUE2QixHQUFJLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBUCxDQUFlLEtBQWYsRUFBc0IsR0FBdEIsQ0FBN0IsRUFEaEI7O1FBRUEsQ0FBQSxJQUFLO01BSlAsQ0FGRjtLQUZGOztTQVNBO0FBWlk7O0FBY2QsRUFBRSxDQUFDLFFBQUgsQ0FBWSxhQUFaLEVBQTBCLFdBQTFCOztBQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCOzs7OztBQ3BCakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBLElBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSOzs7QUFFTDs7Ozs7O0FBS0EsY0FBQSxHQUFpQixTQUFBO0FBSWYsTUFBQTtFQUFBLENBQUEsR0FBSTtFQUNKLENBQUMsQ0FBQyxNQUFGLEdBQVc7RUFDWCxTQUFBLEdBQVk7RUFDWixDQUFBLEdBQUk7QUFFSixTQUFNLENBQUEsR0FBSSxFQUFWO0lBQ0UsQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPLFNBQVMsQ0FBQyxNQUFWLENBQWlCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLElBQTNCLENBQWpCLEVBQW1ELENBQW5EO0lBQ1AsQ0FBQSxJQUFLO0VBRlA7RUFHQSxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVE7RUFDUixDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsQ0FBQyxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsR0FBVCxDQUFBLEdBQWdCLEdBQWpDLEVBQXNDLENBQXRDO0VBQ1IsQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRO0VBQy9CLElBQUEsR0FBTyxDQUFDLENBQUMsSUFBRixDQUFPLEVBQVA7U0FDUDtBQWhCZTs7QUFrQmpCLEVBQUUsQ0FBQyxRQUFILENBQVksWUFBWixFQUEwQixjQUExQjs7QUFDQSxNQUFNLENBQUMsT0FBUCxHQUFpQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlICcuL29qJ1xyXG5yZXF1aXJlICcuL29qSW5pdCdcclxucmVxdWlyZSAnLi9hc3luYy9hamF4J1xyXG5yZXF1aXJlICcuL2FzeW5jL3Byb21pc2UnXHJcbnJlcXVpcmUgJy4vY29tcG9uZW50cy9ncmlkJ1xyXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvaW5wdXRncm91cCdcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL3RhYnMnXHJcbnJlcXVpcmUgJy4vY29tcG9uZW50cy90aWxlJ1xyXG5yZXF1aXJlICcuL2NvbnRyb2xzL2ljb24nXHJcbnJlcXVpcmUgJy4vY29yZS9kYXRlJ1xyXG5yZXF1aXJlICcuL2NvcmUvZnVuY3Rpb24nXHJcbnJlcXVpcmUgJy4vY29yZS9udW1iZXInXHJcbnJlcXVpcmUgJy4vY29yZS9vYmplY3QnXHJcbnJlcXVpcmUgJy4vY29yZS9zdHJpbmcnXHJcbnJlcXVpcmUgJy4vZG9tL25vZGVGYWN0b3J5J1xyXG5yZXF1aXJlICcuL2RvbS9ib2R5J1xyXG5yZXF1aXJlICcuL2RvbS9jb21wb25lbnQnXHJcbnJlcXVpcmUgJy4vZG9tL2NvbnRyb2wnXHJcbnJlcXVpcmUgJy4vZG9tL25vZGUnXHJcbnJlcXVpcmUgJy4vZG9tL2VsZW1lbnQnXHJcbnJlcXVpcmUgJy4vZG9tL2ZyYWdtZW50J1xyXG5yZXF1aXJlICcuL2RvbS9nZW5lcmljcydcclxucmVxdWlyZSAnLi9kb20vaW5wdXQnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvYSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy9icidcclxucmVxdWlyZSAnLi9lbGVtZW50cy9mb3JtJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2lucHV0J1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL29sJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3NlbGVjdCdcclxucmVxdWlyZSAnLi9lbGVtZW50cy90YWJsZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy90ZXh0YXJlYSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy90aGVhZCdcclxucmVxdWlyZSAnLi9lbGVtZW50cy91bCdcclxucmVxdWlyZSAnLi9pbnB1dHMvYnV0dG9uaW5wdXQnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2NoZWNrYm94J1xyXG5yZXF1aXJlICcuL2lucHV0cy9jb2xvcidcclxucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZXRpbWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2RhdGV0aW1lbG9jYWwnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2VtYWlsJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9maWxlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9oaWRkZW4nXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2ltYWdlaW5wdXQnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL21vbnRoJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9udW1iZXInXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3Bhc3N3b3JkJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9yYWRpbydcclxucmVxdWlyZSAnLi9pbnB1dHMvcmFuZ2UnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3Jlc2V0J1xyXG5yZXF1aXJlICcuL2lucHV0cy9zZWFyY2gnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3N1Ym1pdCdcclxucmVxdWlyZSAnLi9pbnB1dHMvdGVsJ1xyXG5yZXF1aXJlICcuL2lucHV0cy90ZXh0aW5wdXQnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3RpbWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3VybCdcclxucmVxdWlyZSAnLi9pbnB1dHMvd2VlaydcclxucmVxdWlyZSAnLi90b29scy9hcnJheTJEJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2NvbnNvbGUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvY29va2llJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2RlZmVyJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2VhY2gnXHJcbnJlcXVpcmUgJy4vdG9vbHMvZW51bXMnXHJcbnJlcXVpcmUgJy4vdG9vbHMvaXMnXHJcbnJlcXVpcmUgJy4vdG9vbHMvbm90eSdcclxucmVxdWlyZSAnLi90b29scy9wdWJzdWInXHJcbnJlcXVpcmUgJy4vdG9vbHMvcXVlcnlTdHJpbmcnXHJcbnJlcXVpcmUgJy4vdG9vbHMvcmFuZ2VzJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL3RvJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL3V1aWQnXHJcbiIsIiMgIyBhamF4XHJcblxyXG5PSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuY29uZmlnID0ge31cclxuICBcclxuIyBkZWZpbmUgYSBzdGFuZGFyZCBvbiBzdWNjZXNzIGhhbmRsZXIsIHdyaXRlIG91dCB0aGUgcmVxdWVzdCBzdGF0cyB0byBhIHRhYmxlXHJcbmNvbmZpZy5vblN1Y2Nlc3MgPSAob3B0cywgZGF0YSwgdXJsKSAtPlxyXG4gIHJlc3BvbnNlID0ge31cclxuICBPSi5leHRlbmQgcmVzcG9uc2UsIGRhdGFcclxuICBvcHRzLm9uU3VjY2VzcyByZXNwb25zZVxyXG4gIGlmIE9KLkxPR19BTExfQUpBWFxyXG4gICAgT0ouY29uc29sZS50YWJsZSBbXHJcbiAgICAgIFdlYnNlcnZpY2U6IG9wdHMuYWpheE9wdHMudXJsXHJcbiAgICAgIFN0YXJ0VGltZTogb3B0cy5zdGFydFRpbWVcclxuICAgICAgRW5kVGltZTogbmV3IERhdGUoKVxyXG4gICAgXSBcclxuICByZXR1cm5cclxuICBcclxuIyBkZWZpbmUgYSBzdGFuZGFyZCBvbiBlcnJvciBoYW5kbGVyLCB3cml0ZSBvdXQgdGhlIHJlcXVlc3QgZXJyb3IgY29uZXh0IHRvIGEgdGFibGVcclxuY29uZmlnLm9uRXJyb3IgPSAoeG1sSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMsIHBhcmFtMSwgb3B0cyA9IE9KLm9iamVjdCgpKSAtPlxyXG4gIGlmIHRleHRTdGF0dXMgaXNudCAnYWJvcnQnXHJcbiAgICBpZiBPSi5MT0dfQUxMX0FKQVhfRVJST1JTXHJcbiAgICAgIE9KLmNvbnNvbGUudGFibGUgW1xyXG4gICAgICAgIFdlYnNlcnZpY2U6IG9wdHMuYWpheE9wdHMudXJsXHJcbiAgICAgICAgRGF0YTogb3B0cy5hamF4T3B0cy5kYXRhXHJcbiAgICAgICAgRmFpbGVkOiB0ZXh0U3RhdHVzXHJcbiAgICAgICAgU3RhdGU6IHhtbEh0dHBSZXF1ZXN0LnN0YXRlKClcclxuICAgICAgICBTdGF0dXM6IHhtbEh0dHBSZXF1ZXN0LnN0YXR1c1xyXG4gICAgICAgIFN0YXR1c1RleHQ6IHhtbEh0dHBSZXF1ZXN0LnN0YXR1c1RleHRcclxuICAgICAgICBSZWFkeVN0YXRlOiB4bWxIdHRwUmVxdWVzdC5yZWFkeVN0YXRlXHJcbiAgICAgICAgUmVzcG9uc2VUZXh0OiB4bWxIdHRwUmVxdWVzdC5yZXNwb25zZVRleHRcclxuICAgICAgXVxyXG5cclxuICAgIG9wdHMub25FcnJvciB0ZXh0U3RhdHVzXHJcbiAgcmV0dXJuXHJcbiAgXHJcbiMgaW4gdGhlIGNhc2Ugd2hlcmUgYG9wdHNgIGlzIGEgc3RyaW5nLCBjb252ZXJ0IGl0IHRvIGFuIG9iamVjdFxyXG5vcHRzRnJvbVVybCA9IChvcHRzKSAtPlxyXG4gIGlmIE9KLmlzLnN0cmluZyBvcHRzXHJcbiAgICB1cmwgPSBvcHRzXHJcbiAgICBvcHRzID0gT0oub2JqZWN0KClcclxuICAgIG9wdHMuYWRkICdhamF4T3B0cycsIE9KLm9iamVjdCgpXHJcbiAgICBvcHRzLmFqYXhPcHRzLmFkZCAndXJsJywgdXJsXHJcbiAgb3B0c1xyXG4gIFxyXG4jIGRlZmluZSBhIHN0YW5kYXJkIGBleGVjYCBtZXRob2QgdG8gaGFuZGxlIGFsbCByZXF1ZXN0IHZlcmJzLiBVc2VzIHRoZSBbalF1ZXJ5LmFqYXhdKGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9jYXRlZ29yeS9hamF4LykgQVBJLlxyXG4jIGBleGVjUmVxdWVzdGAgcmV0dXJucyBhIHByb21pc2UgcmVwcmVzZW50IHRoZSBhY3R1YWwgQUpBWCBjYWxsLlxyXG4gIFxyXG4jIC0gYHZlcmJgIGRlZmF1bHQgdmFsdWUgPSAnR0VUJ1xyXG4jIC0gYG9wdHNgIG9iamVjdFxyXG4jIC0tIGBvcHRzLmFqYXhPcHRzYCBvYmplY3QgZm9yIGFsbCBqUXVlcnkncyBhamF4LXNwZWNpZmljIHByb3BlcnRpZXMuXHJcbmNvbmZpZy5leGVjUmVxdWVzdCA9ICh2ZXJiID0gJ0dFVCcsIG9wdHMpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgYWpheE9wdHM6XHJcbiAgICAgIHVybDogJydcclxuICAgICAgZGF0YToge31cclxuICAgICAgdHlwZTogdmVyYlxyXG4gICAgICB4aHJGaWVsZHM6XHJcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXHJcbiAgICAgIGRhdGFUeXBlOiAnanNvbidcclxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG4gICAgICAgIFxyXG4gICAgb25TdWNjZXNzOiBPSi5ub29wXHJcbiAgICBvbkVycm9yOiBPSi5ub29wXHJcbiAgICBvbkNvbXBsZXRlOiBPSi5ub29wXHJcbiAgICBvdmVycmlkZUVycm9yOiBmYWxzZVxyXG4gICAgd2F0Y2hHbG9iYWw6IHRydWVcclxuICAgIHVzZUNhY2hlOiBmYWxzZVxyXG4gICAgXHJcbiAgb3B0cyA9IG9wdHNGcm9tVXJsIG9wdHNcclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdHMsIHRydWVcclxuICAgIFxyXG4gIGRlZmF1bHRzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKClcclxuICAgIFxyXG4gIGlmIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5IGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcclxuICAgICMgR0VUIHJlcXVlc3RzIGV4cGVjdCBxdWVyeVN0cmluZyBwYXJhbWV0ZXJzXHJcbiAgICBpZiBkZWZhdWx0cy5hamF4T3B0cy52ZXJiIGlzICdHRVQnXHJcbiAgICAgIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGEgPSBPSi5wYXJhbXMgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgIyBhbGwgb3RoZXIgcmVxdWVzdHMgdGFrZSBhbiBvYmplY3RcclxuICAgIGVsc2VcclxuICAgICAgZGVmYXVsdHMuYWpheE9wdHMuZGF0YSA9IE9KLnNlcmlhbGl6ZSBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXHJcbiAgICBcclxuICBnZXRKUXVlcnlEZWZlcnJlZCA9ICh3YXRjaEdsb2JhbCkgLT5cclxuICAgIHJldCA9ICQuYWpheCBkZWZhdWx0cy5hamF4T3B0c1xyXG4gICAgICBcclxuICAgIHJldC5kb25lIChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikgLT5cclxuICAgICAgY29uZmlnLm9uU3VjY2VzcyBkZWZhdWx0cywgZGF0YVxyXG5cclxuICAgIHJldC5mYWlsIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUZXh0KSAtPlxyXG4gICAgICBjb25maWcub25FcnJvciBqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUZXh0LCBkZWZhdWx0c1xyXG4gIFxyXG4gICAgcmV0LmFsd2F5cyAoeG1sSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMpIC0+XHJcbiAgICAgIGRlZmF1bHRzLm9uQ29tcGxldGUgeG1sSHR0cFJlcXVlc3QsIHRleHRTdGF0dXNcclxuXHJcbiAgICBPSi5hc3luYy5hamF4UHJvbWlzZSByZXRcclxuXHJcbiAgcHJvbWlzZSA9IGdldEpRdWVyeURlZmVycmVkKGRlZmF1bHRzLndhdGNoR2xvYmFsKVxyXG4gIHByb21pc2VcclxuICBcclxuYWpheCA9IHt9XHJcbiAgXHJcbiMgIyMgcG9zdFxyXG4jIFtPSl0ob2ouaHRtbCkuYWpheC5wb3N0OiBpbnNlcnQgYSBuZXcgb2JqZWN0IG9yIGluaXQgYSBmb3JtIHBvc3RcclxuICBcclxuIyAtIGBvcHRzYCBjYW4gYmUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgcmVxdWVzdC5cclxuIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LiBcclxuYWpheC5wb3N0ID0gKG9wdHMpIC0+XHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdQT1NUJywgb3B0c1xyXG4gIFxyXG4jICMjIGdldFxyXG4jIFtPSl0ob2ouaHRtbCkuYWpheC5nZXQ6IGdldCBhbiBleGlzdGluZyBvYmplY3RcclxuICBcclxuIyAtIGBvcHRzYCBjYW4gYmUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgcmVxdWVzdC5cclxuIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxyXG4jXHJcbmFqYXguZ2V0ID0gKG9wdHMpIC0+XHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdHRVQnLCBvcHRzXHJcblxyXG4jICMjIGRlbGV0ZVxyXG4jIFtPSl0ob2ouaHRtbCkuYWpheC5kZWxldGU6IGRlbGV0ZSBhbiBleGlzdGluZyBvYmplY3RcclxuICBcclxuIyAtIGBvcHRzYCBjYW4gYmUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgcmVxdWVzdC5cclxuIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxyXG5hamF4LmRlbGV0ZSA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnREVMRVRFJywgb3B0c1xyXG5cclxuIyAjIyBwdXRcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXgucHV0OiB1cGRhdGUgYW4gZXhpc3Rpbmcgb2JqZWN0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuYWpheC5wdXQgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ1BVVCcsIG9wdHNcclxuXHJcbk9KLmFzeW5jLnJlZ2lzdGVyICdhamF4JywgYWpheFxyXG5tb2R1bGUuZXhwb3J0cyA9IGFqYXgiLCIjICMgcHJvbWlzZVxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMgIyMgYWpheFByb21pc2VcclxuIyBbT0pdKG9qLmh0bWwpLmFzeW5jLmFqYXhQcm9taXNlIGNvbnZlcnRzIGFuIEFKQVggWG1sSHR0cFJlcXVlc3QgaW50byBhIFByb21pc2UuIFxyXG4jIFNlZSBhbHNvIFtQcm9taXNlLnJlc29sdmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvYmxvYi9tYXN0ZXIvQVBJLm1kKS5cclxuYWpheFByb21pc2UgPSAoYWpheCkgLT4gXHJcbiAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSBhamF4XHJcbiAgcHJvbWlzZS5hYm9ydCA9IGFqYXguYWJvcnRcclxuICBwcm9taXNlLnJlYWR5U3RhdGUgPSBhamF4LnJlYWR5U3RhdGVcclxuICBwcm9taXNlXHJcblxyXG4jICMjIGFsbFxyXG4jIFtPSl0ob2ouaHRtbCkuYXN5bmMuYWxsIHRha2VzIGFuIGFycmF5IG9mIGZ1bmN0aW9ucyBhbmQgcmV0dXJucyBhIHByb21pc2UgcmVwcmVzZW50aW5nIHRoZSBzdWNjZXNzIG9mIGFsbCBtZXRob2RzIG9yIHRoZSBmYWlsdXJlIG9mIGFueSBtZXRob2QuXHJcbiMgU2VlIGFsc28gW1Byb21pc2UuYWxsXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbmFsbCA9IChpbml0QXJyYXkpIC0+XHJcbiAgcmVxcyA9IGluaXRBcnJheSBvciBbXVxyXG4gIHByb21pc2UgPSBQcm9taXNlLmFsbChyZXFzKVxyXG4gIHByb21pc2UucHVzaCA9IChpdGVtKSAtPlxyXG4gICAgcmVxcy5wdXNoIGl0ZW1cclxuICAgIHJldHVyblxyXG4gIHByb21pc2VcclxuXHJcbiMgIyMgZGVmZXJcclxuIyBbT0pdKG9qLmh0bWwpLmFzeW5jLmRlZmVyIGNvbnZlcnRzIGEgZnVuY3Rpb24gaW50byBhIFByb21pc2UgdG8gZXhlY3V0ZSB0aGF0IGZ1bmN0aW9uLiBcclxuIyBTZWUgYWxzbyBbUHJvbWlzZS5tZXRob2RdKGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvYmxvYi9tYXN0ZXIvQVBJLm1kKS5cclxuZGVmciA9IChmdW5jID0gT0oubm9vcCkgLT5cclxuICByZXQgPSBQcm9taXNlLm1ldGhvZCBmdW5jXHJcbiAgcmV0XHJcbiAgXHJcbiAgXHJcbk9KLmFzeW5jLnJlZ2lzdGVyICdkZWZlcicsIGRlZnJcclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2FsbCcsIGFsbFxyXG5PSi5hc3luYy5yZWdpc3RlciAnYWpheFByb21pc2UnLCBhamF4UHJvbWlzZVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPVxyXG4gIGRlZmVyOiBkZWZyXHJcbiAgYWxsOiBhbGxcclxuICBhamF4UHJvbWlzZTogYWpheFByb21pc2VcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbXBvbmVudCA9IHJlcXVpcmUgJy4uL2RvbS9jb21wb25lbnQnXG5hcnJheTJEID0gcmVxdWlyZSAnLi4vdG9vbHMvYXJyYXkyRCdcblxubm9kZU5hbWUgPSAneC1ncmlkJ1xuY2xhc3NOYW1lID0gJ2dyaWQnXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXG5cbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBkZWZhdWx0cyA9XG4gICAgdGlsZVNpemVzOlxuICAgICAgc21hbGxTcGFuOiAnJ1xuICAgICAgbWVkaXVtU3BhbjogJydcbiAgICAgIGxhcmdlU3BhbjogJydcbiAgICBwcm9wczpcbiAgICAgIGNsYXNzOiAnZ3JpZCdcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgcmV0ID0gY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcblxuICByb3dzID0gW11cbiAgdGlsZXMgPSBhcnJheTJEKClcblxuICBmaWxsTWlzc2luZyA9ICgpIC0+XG4gICAgdGlsZXMuZWFjaCAocm93Tm8sIGNvbE5vLCB2YWwpIC0+XG4gICAgICBpZiBub3QgdmFsXG4gICAgICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cbiAgICAgICAgcm93Lm1ha2UgJ3RpbGUnLCBjb2xObywge31cblxuICByZXQuYWRkICdyb3cnLCAocm93Tm8gPSByb3dzLmxlbmd0aC0xIG9yIDEpLT5cbiAgICBudVJvdyA9IHJvd3Nbcm93Tm8tMV1cbiAgICBpZiBub3QgbnVSb3dcbiAgICAgIHdoaWxlIHJvd3MubGVuZ3RoIDwgcm93Tm9cbiAgICAgICAgbnVSb3cgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAncm93J1xuICAgICAgICByb3dzLnB1c2ggbnVSb3dcbiAgICAgIG51Um93LmFkZCAndGlsZScsIChjb2xObywgb3B0cykgLT5cbiAgICAgICAgb3B0cyA9IE9KLmV4dGVuZCAoT0ouZXh0ZW5kIHt9LCBkZWZhdWx0cy50aWxlU2l6ZXMpLCBvcHRzXG4gICAgICAgIG51VGlsZSA9IE9KLmNvbXBvbmVudHMudGlsZSBvcHRzLCBudVJvd1xuICAgICAgICB0aWxlcy5zZXQgcm93Tm8sIGNvbE5vLCBudVRpbGVcbiAgICAgICAgbnVUaWxlXG4gICAgbnVSb3dcblxuICByZXQuYWRkICd0aWxlJywgKHJvd05vLCBjb2xObywgb3B0cykgLT5cbiAgICBpZiBub3Qgcm93Tm8gb3Igcm93Tm8gPCAxIHRoZW4gcm93Tm8gPSAxXG4gICAgaWYgbm90IGNvbE5vIG9yIGNvbE5vIDwgMSB0aGVuIGNvbE5vID0gMVxuXG4gICAgcm93ID0gcmV0LnJvdyByb3dOb1xuICAgIHRpbGUgPSB0aWxlcy5nZXQgcm93Tm8sIGNvbE5vXG5cbiAgICBpZiBub3QgdGlsZVxuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBjb2xOb1xuICAgICAgICBpICs9IDFcbiAgICAgICAgdHJ5VGlsZSA9IHRpbGVzLmdldCByb3dObywgaVxuICAgICAgICBpZiBub3QgdHJ5VGlsZVxuICAgICAgICAgIGlmIGkgaXMgY29sTm9cbiAgICAgICAgICAgIHRpbGUgPSByb3cubWFrZSAndGlsZScsIG9wdHNcbiAgICAgICAgICBlbHNlIGlmIG5vdCB0aWxlXG4gICAgICAgICAgICByb3cubWFrZSAndGlsZSdcblxuICAgIGZpbGxNaXNzaW5nKClcbiAgICB0aWxlXG5cbiAgcmV0XG5cbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xudXVpZCA9IHJlcXVpcmUgJy4uL3Rvb2xzL3V1aWQnXG5cbm5vZGVOYW1lID0gJ3gtaW5wdXQtZ3JvdXAnXG5jbGFzc05hbWUgPSAnaW5wdXRncm91cCdcblxuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxuXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cbiAgZm9ySWQgPSB1dWlkKClcbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgY2xhc3M6ICdmb3JtLWdyb3VwJ1xuICAgIGV2ZW50czpcbiAgICAgIGNoYW5nZTogT0oubm9vcFxuICAgIGZvcjogZm9ySWRcbiAgICBsYWJlbFRleHQ6ICcnXG4gICAgaW5wdXRPcHRzOlxuICAgICAgcHJvcHM6XG4gICAgICAgIGlkOiBmb3JJZFxuICAgICAgICB0eXBlOiAndGV4dCdcbiAgICAgICAgY2xhc3M6ICcnXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnJ1xuICAgICAgICB2YWx1ZTogJydcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgcmV0ID0gY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcblxuICBncm91cCA9IHJldC5tYWtlICdkaXYnLCBwcm9wczogY2xhc3M6ICdmb3JtLWdyb3VwJ1xuXG4gIHJldC5ncm91cExhYmVsID0gZ3JvdXAubWFrZSAnbGFiZWwnLCBwcm9wczogeyBmb3I6IGZvcklkIH0sIHRleHQ6IGRlZmF1bHRzLmxhYmVsVGV4dFxuXG4gIGRlZmF1bHRzLmlucHV0T3B0cy5wcm9wcy5jbGFzcyArPSAnIGZvcm0tY29udHJvbCdcbiAgcmV0Lmdyb3VwSW5wdXQgPSBncm91cC5tYWtlICdpbnB1dCcsIGRlZmF1bHRzLmlucHV0T3B0c1xuXG4gIHJldC5ncm91cFZhbHVlID0gKCkgLT5cbiAgICByZXQuZ3JvdXBJbnB1dC52YWwoKVxuXG4gIHJldFxuXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcbm1vZHVsZS5leHBvcnRzID0gY21wbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vb2pJbml0J1xuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcblxubm9kZU5hbWUgPSAneC10YWJzJ1xuY2xhc3NOYW1lID0gJ3RhYnMnXG5cbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcblxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XG4gIGRlZmF1bHRzID1cbiAgICB0YWJzOiB7fVxuICAgIHByb3BzOlxuICAgICAgY2xhc3M6ICcnXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG4gIHJldCA9IGNvbXBvbmVudCBkZWZhdWx0cywgb3duZXIsIG5vZGVOYW1lXG5cbiAgdGFicyA9IHJldC5tYWtlICd1bCcsIHByb3BzOiBjbGFzczogJ25hdiBuYXYtdGFicydcbiAgY29udGVudCA9IHJldC5tYWtlICdkaXYnLCBwcm9wczogY2xhc3M6ICd0YWItY29udGVudCdcblxuICBmaXJzdCA9IHRydWVcbiAgT0ouZWFjaCBkZWZhdWx0cy50YWJzLCAodGFiVmFsLCB0YWJOYW1lKSAtPlxuICAgIHRhYkNsYXNzID0gJydcbiAgICBpZiBmaXJzdFxuICAgICAgZmlyc3QgPSBmYWxzZVxuICAgICAgdGFiQ2xhc3MgPSAnYWN0aXZlJ1xuICAgIGEgPSB0YWJzLm1ha2UgJ2xpJywgcHJvcHM6IGNsYXNzOiB0YWJDbGFzc1xuICAgICAgLm1ha2UoJ2EnLFxuICAgICAgICB0ZXh0OiB0YWJOYW1lXG4gICAgICAgIHByb3BzOlxuICAgICAgICAgIGhyZWY6ICcjJyArIHRhYk5hbWVcbiAgICAgICAgICAnZGF0YS10b2dnbGUnOiAndGFiJ1xuICAgICAgICBldmVudHM6XG4gICAgICAgICAgY2xpY2s6IC0+XG4gICAgICAgICAgICBhLiQudGFiICdzaG93JylcblxuICAgIHRhYkNvbnRlbnRDbGFzcyA9ICd0YWItcGFuZSAnICsgdGFiQ2xhc3NcbiAgICByZXQuYWRkIHRhYk5hbWUsIGNvbnRlbnQubWFrZSgnZGl2JywgcHJvcHM6IGNsYXNzOiB0YWJDb250ZW50Q2xhc3MsIGlkOiB0YWJOYW1lKVxuXG4gIHJldFxuXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcbm1vZHVsZS5leHBvcnRzID0gY21wbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vb2pJbml0J1xuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcblxubm9kZU5hbWUgPSAneC10aWxlJ1xuY2xhc3NOYW1lID0gJ3RpbGUnXG5cbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcbiAgXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cbiAgZGVmYXVsdHMgPVxuICAgIHdpZHRoOlxuICAgICAgeHM6ICcnXG4gICAgICBzbTogJydcbiAgICAgIG1kOiAnJ1xuICAgICAgbGc6ICcnXG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJ3RpbGUnXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG4gIGlmIGRlZmF1bHRzLndpZHRoLnhzIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wteHMtJyArIGRlZmF1bHRzLndpZHRoLnhzXG4gIGlmIGRlZmF1bHRzLndpZHRoLnNtIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wtc20tJyArIGRlZmF1bHRzLndpZHRoLnNtXG4gIGlmIGRlZmF1bHRzLndpZHRoLm1kIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wtbWQtJyArIGRlZmF1bHRzLndpZHRoLm1kXG4gIGlmIGRlZmF1bHRzLndpZHRoLmxnIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wtbGctJyArIGRlZmF1bHRzLndpZHRoLmxnXG5cbiAgcmV0ID0gT0ouY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcbiAgcmV0XG5cbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb250cm9sID0gcmVxdWlyZSAnLi4vZG9tL2NvbnRyb2wnXG5cbmNvbnRyb2xOYW1lID0gJ3ktaWNvbidcbmZyaWVuZGx5TmFtZSA9ICdpY29uJ1xuXG5PSi5jb250cm9scy5tZW1iZXJzW2ZyaWVuZGx5TmFtZV0gPSBjb250cm9sTmFtZVxuXG5jbnRybCA9IChvcHRpb25zLCBvd25lcikgLT5cbiAgZGVmYXVsdHMgPVxuICAgIGljb25PcHRzOlxuICAgICAgbmFtZTogJydcbiAgICAgIHN0YWNrZWRJY29uOiAnJ1xuICAgICAgc3dhcEljb246ICcnXG4gICAgICBzaXplOiBmYWxzZVxuICAgICAgY29sb3I6ICcnXG4gICAgICBsaWJyYXJ5OiAnJ1xuICAgICAgaXNGaXhlZFdpZHRoOiBmYWxzZVxuICAgICAgaXNMaXN0OiBmYWxzZVxuICAgICAgaXNTcGlubmVyOiBmYWxzZVxuICAgIHByb3BzOlxuICAgICAgY2xhc3M6ICcnXG4gICAgcm9vdE5vZGVUeXBlOiAnc3BhbidcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnNcbiAgcmV0ID0gY29udHJvbCBkZWZhdWx0cywgb3duZXIsIGNvbnRyb2xOYW1lXG5cbiAgaXNUb2dnbGVkID0gZmFsc2VcblxuICAjVE9ETzogU3VwcG9ydCBmb3IgcGljdG9pY29uc1xuICAjVE9ETzogU3VwcG9ydCBmb3Igb3RoZXIgRm9udEF3ZXNvbWUgcHJvcGVydGllcyAoc3RhY2ssIHJvdGF0ZSwgc2l6ZSwgZXRjKVxuXG4gIGNsYXNzTmFtZUJhc2UgPSAnZmEgJ1xuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc0ZpeGVkV2lkdGggdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1mdyAnXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzTGlzdCB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLWxpICdcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuaXNTcGlubmVyIHRoZW4gY2xhc3NOYW1lQmFzZSArPSAnZmEtc3BpbiAnXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLnNpemVcbiAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zaXplID4gMSBhbmQgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSA8PSA1XG4gICAgICBjbGFzc05hbWVCYXNlICs9ICdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSArICd4ICdcblxuICBjbGFzc05hbWUgPSBjbGFzc05hbWVCYXNlICsgJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5uYW1lXG4gIHJldC5teUljb24gPSByZXQubWFrZSAnaScsIHByb3BzOiBjbGFzczogY2xhc3NOYW1lXG5cbiAgI1RvZ2dsZXMgZGlzcGxheSBiZXR3ZWVuIG5vcm1hbCBpY29uIGFuZCBzd2FwIGljb24sIGlmIGEgc3dhcCBpY29uIGhhcyBiZWVuIHNwZWNpZmllZFxuICByZXQudG9nZ2xlSWNvbiA9IC0+XG4gICAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuc3dhcEljb25cbiAgICAgIG5ld0ljb24gPSBkZWZhdWx0cy5pY29uT3B0cy5uYW1lXG5cbiAgICAgIGlzVG9nZ2xlZCA9ICFpc1RvZ2dsZWRcblxuICAgICAgaWYgaXNUb2dnbGVkXG4gICAgICAgIHJldC5teUljb24uJC5yZW1vdmVDbGFzcygnZmEtJyArIG5ld0ljb24pXG4gICAgICAgIG5ld0ljb24gPSBkZWZhdWx0cy5pY29uT3B0cy5zd2FwSWNvblxuICAgICAgZWxzZVxuICAgICAgICByZXQubXlJY29uLiQucmVtb3ZlQ2xhc3MoJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5zd2FwSWNvbilcblxuICAgICAgcmV0Lm15SWNvbi4kLmFkZENsYXNzKCdmYS0nICsgbmV3SWNvbilcblxuXG4gIHJldFxuXG5PSi5jb250cm9scy5yZWdpc3RlciBmcmllbmRseU5hbWUsIGNudHJsXG5tb2R1bGUuZXhwb3J0cyA9IGNudHJsIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbmdldERhdGVGcm9tRG5Kc29uID0gKGRuRGF0ZSkgLT5cclxuICAgIFxyXG4gICMgVHJhbnNmb3JtcyBhIC5ORVQgSlNPTiBkYXRlIGludG8gYSBKYXZhU2NyaXB0IGRhdGUuXHJcbiAgIyBuYW1lPSdvYmonICBPYmplY3QgdG8gdGVzdFxyXG4gICMgdHlwZT0nQm9vbGVhbicgLz5cclxuICAjXHJcbiAgIyAgICAgICB2YXIgbWlsbGkgPSBPSi50by5udW1iZXIoRG5EYXRlLnJlcGxhY2UoL1xcL0RhdGVcXCgoXFxkKylcXC0/KFxcZCspXFwpXFwvLywgJyQxJykpO1xyXG4gICMgICAgICAgdmFyIG9mZnNldCA9IE9KLnRvLm51bWJlcihEbkRhdGUucmVwbGFjZSgvXFwvRGF0ZVxcKFxcZCsoW1xcK1xcLV0/XFxkKylcXClcXC8vLCAnJDEnKSk7XHJcbiAgIyAgICAgICB2YXIgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCk7XHJcbiAgIyAgICAgICByZXR1cm4gbmV3IERhdGUoKG1pbGxpIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKTtcclxuICAjICAgICAgIFxyXG4gICAgXHJcbiAgIyBEbiBEYXRlIHdpbGwgbG9vayBsaWtlIC9EYXRlKDEzMzU3NTg0MDAwMDAtMDQwMCkvICBcclxuICBkbkRhdGVTdHIgPSBPSi50by5zdHJpbmcoZG5EYXRlKVxyXG4gIHJldCA9IHVuZGVmaW5lZFxyXG4gIHRpY2tzID0gdW5kZWZpbmVkXHJcbiAgb2Zmc2V0ID0gdW5kZWZpbmVkXHJcbiAgbG9jYWxPZmZzZXQgPSB1bmRlZmluZWRcclxuICBhcnIgPSB1bmRlZmluZWRcclxuICByZXQgPSBPSi5kYXRlVGltZU1pblZhbHVlXHJcbiAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkoZG5EYXRlU3RyKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJy8nLCAnJylcclxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCdEYXRlJywgJycpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnKCcsICcnKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJyknLCAnJylcclxuICAgIGFyciA9IGRuRGF0ZVN0ci5zcGxpdCgnLScpXHJcbiAgICBpZiBhcnIubGVuZ3RoID4gMVxyXG4gICAgICB0aWNrcyA9IE9KLnRvLm51bWJlcihhcnJbMF0pXHJcbiAgICAgIG9mZnNldCA9IE9KLnRvLm51bWJlcihhcnJbMV0pXHJcbiAgICAgIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpXHJcbiAgICAgIHJldCA9IG5ldyBEYXRlKCh0aWNrcyAtICgobG9jYWxPZmZzZXQgKyAob2Zmc2V0IC8gMTAwICogNjApKSAqIDEwMDApKSlcclxuICAgIGVsc2UgaWYgYXJyLmxlbmd0aCBpcyAxXHJcbiAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcclxuICAgICAgcmV0ID0gbmV3IERhdGUodGlja3MpXHJcbiAgcmV0XHJcblxyXG4gIE9KLnJlZ2lzdGVyICdnZXREYXRlRnJvbURuSnNvbicsIGdldERhdGVGcm9tRG5Kc29uXHJcbiAgbW9kdWxlcy5leHBvcnRzID0gZ2V0RGF0ZUZyb21Ebkpzb25cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMgV3JhcCB0aGUgZXhlY3V0aW9uIG9mIGEgbWV0aG9kIGluIGEgdHJ5Li5jYXRjaC4uZmluYWxseSAgICAgXHJcbiMgaWdub3JlIGVycm9ycyBmYWlsaW5nIHRvIGV4ZWMgc2VsZi1leGVjdXRpbmcgZnVuY3Rpb25zIFxyXG4jIFJldHVybiBhIG1ldGhvZCB3cmFwcGVkIGluIGEgdHJ5Li5jYXRjaC4uZmluYWxseVxyXG50cnlFeGVjID0gKHRyeUZ1bmMpIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgcmV0ID0gZmFsc2VcclxuICB0aGF0ID0gdGhpc1xyXG4gIHRyeVxyXG4gICAgcmV0ID0gdHJ5RnVuYy5hcHBseSh0aGF0LCBBcnJheTo6c2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKSAgaWYgT0ouaXMubWV0aG9kKHRyeUZ1bmMpXHJcbiAgY2F0Y2ggZXhjZXB0aW9uXHJcbiAgICBpZiAoZXhjZXB0aW9uLm5hbWUgaXMgJ1R5cGVFcnJvcicgb3IgZXhjZXB0aW9uLnR5cGUgaXMgJ2NhbGxlZF9ub25fY2FsbGFibGUnKSBhbmQgZXhjZXB0aW9uLnR5cGUgaXMgJ25vbl9vYmplY3RfcHJvcGVydHlfbG9hZCdcclxuICAgICAgT0ouY29uc29sZS5pbmZvICdJZ25vcmluZyBleGNlcHRpb246ICcsIGV4Y2VwdGlvblxyXG4gICAgZWxzZVxyXG4gICAgICBPSi5jb25zb2xlLmVycm9yIGV4Y2VwdGlvblxyXG4gIGZpbmFsbHlcclxuXHJcbiAgcmV0XHJcblxyXG5cclxuIG1ldGhvZCA9ICh0cnlGdW5jKSAtPlxyXG4gICd1c2Ugc3RyaWN0J1xyXG4gIHRoYXQgPSB0aGlzXHJcbiAgLT5cclxuICAgIGFyZ3MgPSBBcnJheTo6c2xpY2UuY2FsbChhcmd1bWVudHMsIDApXHJcbiAgICBhcmdzLnVuc2hpZnQgdHJ5RnVuY1xyXG4gICAgT0oudHJ5RXhlYy5hcHBseSB0aGF0LCBhcmdzXHJcblxyXG4gIFxyXG4gXHJcbiBPSi5yZWdpc3RlciAnbWV0aG9kJywgbWV0aG9kXHJcbiBPSi5yZWdpc3RlciAndHJ5RXhlYycsIHRyeUV4ZWNcclxuIG1vZHVsZS5leHBvcnRzID1cclxuICBtZXRob2Q6IG1ldGhvZFxyXG4gIHRyeUV4ZWM6IHRyeUV4ZWNcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbm51bWJlciA9IE9iamVjdC5jcmVhdGUobnVsbClcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdpc05hTicsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuaXNOYU4pIHRoZW4gTnVtYmVyLmlzTmFOIGVsc2UgaXNOYU4pXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnaXNGaW5pdGUnLFxyXG4gIHZhbHVlOiAoaWYgKE51bWJlciBhbmQgTnVtYmVyLmlzRmluaXRlKSB0aGVuIE51bWJlci5pc0Zpbml0ZSBlbHNlIGlzRmluaXRlKVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ01BWF9WQUxVRScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuTUFYX1ZBTFVFKSB0aGVuIE51bWJlci5NQVhfVkFMVUUgZWxzZSAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOClcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdNSU5fVkFMVUUnLFxyXG4gIHZhbHVlOiAoaWYgKE51bWJlciBhbmQgTnVtYmVyLk1JTl9WQUxVRSkgdGhlbiBOdW1iZXIuTUlOX1ZBTFVFIGVsc2UgNWUtMzI0KVxyXG5cclxuT0oucmVnaXN0ZXIgJ251bWJlcicsIG51bWJlclxyXG5tb2R1bGUuZXhwb3J0cyA9IG51bWJlciIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciAkLCBPSiwgXywgZnVuYywgaXNNZXRob2QsIHByb3BlcnR5LCByZXRPYmosIHRvO1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbiQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cbl8gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snXyddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnXyddIDogbnVsbCk7XG5cbmlzTWV0aG9kID0gcmVxdWlyZSgnLi4vdG9vbHMvaXMnKTtcblxucHJvcGVydHkgPSByZXF1aXJlKCcuL3Byb3BlcnR5Jyk7XG5cbmZ1bmMgPSByZXF1aXJlKCcuL2Z1bmN0aW9uJyk7XG5cbnRvID0gcmVxdWlyZSgnLi4vdG9vbHMvdG8nKTtcblxucmV0T2JqID0ge1xuICBvYmplY3Q6IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkge1xuICAgICAgb2JqID0ge307XG4gICAgfVxuXG4gICAgLypcbiAgICBBZGQgYSBwcm9wZXJ0eSB0byB0aGUgb2JqZWN0IGFuZCByZXR1cm4gaXRcbiAgICAgKi9cbiAgICBvYmouYWRkID0gZnVuY3Rpb24obmFtZSwgdmFsKSB7XG4gICAgICBwcm9wZXJ0eShvYmosIG5hbWUsIHZhbCk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH07XG4gICAgb2JqLmFkZCgnZWFjaCcsIGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgZWFjaDtcbiAgICAgIGVhY2ggPSByZXF1aXJlKCcuLi90b29scy9lYWNoJyk7XG4gICAgICByZXR1cm4gZWFjaChvYmosIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgICAgIGlmIChrZXkgIT09ICdlYWNoJyAmJiBrZXkgIT09ICdhZGQnKSB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHZhbCwga2V5KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfSxcbiAgaXNJbnN0YW5jZU9mOiBmdW5jdGlvbihuYW1lLCBvYmopIHtcbiAgICByZXR1cm4gcmV0T2JqLmNvbnRhaW5zKG5hbWUsIG9iaikgJiYgdG8uYm9vbChvYmpbbmFtZV0pO1xuICB9LFxuICBjb250YWluczogZnVuY3Rpb24ob2JqZWN0LCBpbmRleCkge1xuICAgIHZhciByZXQ7XG4gICAgcmV0ID0gZmFsc2U7XG4gICAgaWYgKG9iamVjdCkge1xuICAgICAgcmV0ID0gXy5jb250YWlucyhvYmplY3QsIGluZGV4KTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSxcbiAgY29tcGFyZTogZnVuY3Rpb24ob2JqMSwgb2JqMikge1xuICAgIHJldHVybiBfLmlzRXF1YWwob2JqMSwgb2JqMik7XG4gIH0sXG4gIGNsb25lOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgcmV0dXJuIF8uY2xvbmVEZWVwKGRhdGEodHJ1ZSkpO1xuICB9LFxuICBzZXJpYWxpemU6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgcmV0O1xuICAgIHJldCA9ICcnO1xuICAgIGZ1bmMudHJ5RXhlYyhmdW5jdGlvbigpIHtcbiAgICAgIHJldCA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXQgfHwgJyc7XG4gIH0sXG4gIGRlc2VyaWFsaXplOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHJldDtcbiAgICByZXQgPSB7fTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgZnVuYy50cnlFeGVjKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXQgPSAkLnBhcnNlSlNPTihkYXRhKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKGlzTWV0aG9kLm51bGxPckVtcHR5KHJldCkpIHtcbiAgICAgICAgcmV0ID0ge307XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH0sXG4gIHBhcmFtczogZnVuY3Rpb24oZGF0YSwgZGVsaW1pdGVyKSB7XG4gICAgdmFyIGVhY2gsIHJldDtcbiAgICBpZiAoZGVsaW1pdGVyID09IG51bGwpIHtcbiAgICAgIGRlbGltaXRlciA9ICcmJztcbiAgICB9XG4gICAgcmV0ID0gJyc7XG4gICAgaWYgKGRlbGltaXRlciA9PT0gJyYnKSB7XG4gICAgICBmdW5jLnRyeUV4ZWMoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldCA9ICQucGFyYW0oZGF0YSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWFjaCA9IHJlcXVpcmUoJy4uL3Rvb2xzL2VhY2gnKTtcbiAgICAgIGVhY2goZGF0YSwgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICAgICAgaWYgKHJldC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0ICs9IGRlbGltaXRlcjtcbiAgICAgICAgfVxuICAgICAgICByZXQgKz0ga2V5ICsgJz0nICsgdmFsO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0by5zdHJpbmcocmV0KTtcbiAgfSxcbiAgZXh0ZW5kOiBmdW5jdGlvbihkZXN0T2JqLCBzcmNPYmosIGRlZXBDb3B5KSB7XG4gICAgdmFyIGtleSwgcmV0LCB2YWx1ZTtcbiAgICBpZiAoZGVlcENvcHkgPT0gbnVsbCkge1xuICAgICAgZGVlcENvcHkgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0ID0gZGVzdE9iaiB8fCB7fTtcbiAgICBmb3IgKGtleSBpbiBzcmNPYmopIHtcbiAgICAgIHZhbHVlID0gc3JjT2JqW2tleV07XG4gICAgICBpZiAoZGVlcENvcHkgJiYgdmFsdWUgJiYgJC5pc1BsYWluT2JqZWN0KHZhbHVlKSAmJiAkLmlzUGxhaW5PYmplY3QocmV0W2tleV0pKSB7XG4gICAgICAgIHRoaXMuZXh0ZW5kKHJldFtrZXldLCB2YWx1ZSwgdHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXRba2V5XSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG59O1xuXG5PSi5yZWdpc3Rlcignb2JqZWN0JywgcmV0T2JqLm9iamVjdCk7XG5cbk9KLnJlZ2lzdGVyKCdpc0luc3RhbmNlT2YnLCByZXRPYmouaXNJbnN0YW5jZU9mKTtcblxuT0oucmVnaXN0ZXIoJ2NvbnRhaW5zJywgcmV0T2JqLmNvbnRhaW5zKTtcblxuT0oucmVnaXN0ZXIoJ2NvbXBhcmUnLCByZXRPYmouY29tcGFyZSk7XG5cbk9KLnJlZ2lzdGVyKCdjbG9uZScsIHJldE9iai5jbG9uZSk7XG5cbk9KLnJlZ2lzdGVyKCdzZXJpYWxpemUnLCByZXRPYmouc2VyaWFsaXplKTtcblxuT0oucmVnaXN0ZXIoJ2Rlc2VyaWFsaXplJywgcmV0T2JqLmRlc2VyaWFsaXplKTtcblxuT0oucmVnaXN0ZXIoJ3BhcmFtcycsIHJldE9iai5wYXJhbXMpO1xuXG5PSi5yZWdpc3RlcignZXh0ZW5kJywgcmV0T2JqLmV4dGVuZCk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmV0T2JqO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1RNlhGeEhhWFJvZFdKY1hHOXFYRnh6Y21OY1hHTnZabVpsWlZ4Y1kyOXlaVnhjYjJKcVpXTjBMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJRVUVzU1VGQlFUczdRVUZCUVN4RlFVRkJMRWRCUVVzc1QwRkJRU3hEUVVGUkxFOUJRVkk3TzBGQlEwd3NRMEZCUVN4SFFVRkpMRTlCUVVFc1EwRkJVU3hSUVVGU096dEJRVU5LTEVOQlFVRXNSMEZCU1N4UFFVRkJMRU5CUVZFc1VVRkJVanM3UVVGRFNpeFJRVUZCTEVkQlFWY3NUMEZCUVN4RFFVRlJMR0ZCUVZJN08wRkJRMWdzVVVGQlFTeEhRVUZYTEU5QlFVRXNRMEZCVVN4WlFVRlNPenRCUVVOWUxFbEJRVUVzUjBGQlR5eFBRVUZCTEVOQlFWRXNXVUZCVWpzN1FVRkRVQ3hGUVVGQkxFZEJRVXNzVDBGQlFTeERRVUZSTEdGQlFWSTdPMEZCU1V3c1RVRkJRU3hIUVVsRk8wVkJRVUVzVFVGQlFTeEZRVUZSTEZOQlFVTXNSMEZCUkRzN1RVRkJReXhOUVVGTk96czdRVUZGWWpzN08wbEJSMEVzUjBGQlJ5eERRVUZETEVkQlFVb3NSMEZCVlN4VFFVRkRMRWxCUVVRc1JVRkJUeXhIUVVGUU8wMUJRMUlzVVVGQlFTeERRVUZUTEVkQlFWUXNSVUZCWXl4SlFVRmtMRVZCUVc5Q0xFZEJRWEJDTzJGQlEwRTdTVUZHVVR0SlFVbFdMRWRCUVVjc1EwRkJReXhIUVVGS0xFTkJRVkVzVFVGQlVpeEZRVUZuUWl4VFFVRkRMRkZCUVVRN1FVRkRaQ3hWUVVGQk8wMUJRVUVzU1VGQlFTeEhRVUZQTEU5QlFVRXNRMEZCVVN4bFFVRlNPMkZCUTFBc1NVRkJRU3hEUVVGTExFZEJRVXdzUlVGQlZTeFRRVUZETEVkQlFVUXNSVUZCVFN4SFFVRk9PMUZCUTFJc1NVRkJSeXhIUVVGQkxFdEJRVk1zVFVGQlZDeEpRVUZ2UWl4SFFVRkJMRXRCUVZNc1MwRkJhRU03YVVKQlEwVXNVVUZCUVN4RFFVRlRMRWRCUVZRc1JVRkJZeXhIUVVGa0xFVkJSRVk3TzAxQlJGRXNRMEZCVmp0SlFVWmpMRU5CUVdoQ08xZEJUVUU3UlVGbVRTeERRVUZTTzBWQmIwSkJMRmxCUVVFc1JVRkJZeXhUUVVGRExFbEJRVVFzUlVGQlR5eEhRVUZRTzFkQlExb3NUVUZCVFN4RFFVRkRMRkZCUVZBc1EwRkJaMElzU1VGQmFFSXNSVUZCYzBJc1IwRkJkRUlzUTBGQlFTeEpRVUVyUWl4RlFVRkZMRU5CUVVNc1NVRkJTQ3hEUVVGUkxFZEJRVWtzUTBGQlFTeEpRVUZCTEVOQlFWbzdSVUZFYmtJc1EwRndRbVE3UlVGNVFrRXNVVUZCUVN4RlFVRlZMRk5CUVVNc1RVRkJSQ3hGUVVGVExFdEJRVlE3UVVGRFVpeFJRVUZCTzBsQlFVRXNSMEZCUVN4SFFVRk5PMGxCUTA0c1NVRkJSeXhOUVVGSU8wMUJRMFVzUjBGQlFTeEhRVUZOTEVOQlFVTXNRMEZCUXl4UlFVRkdMRU5CUVZjc1RVRkJXQ3hGUVVGdFFpeExRVUZ1UWl4RlFVUlNPenRYUVVWQk8wVkJTbEVzUTBGNlFsWTdSVUZwUTBFc1QwRkJRU3hGUVVGVExGTkJRVU1zU1VGQlJDeEZRVUZQTEVsQlFWQTdWMEZEVUN4RFFVRkRMRU5CUVVNc1QwRkJSaXhEUVVGVkxFbEJRVllzUlVGQlowSXNTVUZCYUVJN1JVRkVUeXhEUVdwRFZEdEZRWE5EUVN4TFFVRkJMRVZCUVU4c1UwRkJReXhKUVVGRU8xZEJRMHdzUTBGQlF5eERRVUZETEZOQlFVWXNRMEZCV1N4SlFVRkJMRU5CUVVzc1NVRkJUQ3hEUVVGYU8wVkJSRXNzUTBGMFExQTdSVUV5UTBFc1UwRkJRU3hGUVVGWExGTkJRVU1zU1VGQlJEdEJRVU5VTEZGQlFVRTdTVUZCUVN4SFFVRkJMRWRCUVUwN1NVRkRUaXhKUVVGSkxFTkJRVU1zVDBGQlRDeERRVUZoTEZOQlFVRTdUVUZEV0N4SFFVRkJMRWRCUVUwc1NVRkJTU3hEUVVGRExGTkJRVXdzUTBGQlpTeEpRVUZtTzBsQlJFc3NRMEZCWWp0WFFVZEJMRWRCUVVFc1NVRkJUenRGUVV4RkxFTkJNME5ZTzBWQmIwUkJMRmRCUVVFc1JVRkJZU3hUUVVGRExFbEJRVVE3UVVGRFdDeFJRVUZCTzBsQlFVRXNSMEZCUVN4SFFVRk5PMGxCUTA0c1NVRkJSeXhKUVVGSU8wMUJRMFVzU1VGQlNTeERRVUZETEU5QlFVd3NRMEZCWVN4VFFVRkJPMUZCUTFnc1IwRkJRU3hIUVVGTkxFTkJRVU1zUTBGQlF5eFRRVUZHTEVOQlFWa3NTVUZCV2p0TlFVUkxMRU5CUVdJN1RVRkpRU3hKUVVGaExGRkJRVkVzUTBGQlF5eFhRVUZVTEVOQlFYRkNMRWRCUVhKQ0xFTkJRV0k3VVVGQlFTeEhRVUZCTEVkQlFVMHNSMEZCVGp0UFFVeEdPenRYUVUxQk8wVkJVbGNzUTBGd1JHSTdSVUZuUlVFc1RVRkJRU3hGUVVGUkxGTkJRVU1zU1VGQlJDeEZRVUZQTEZOQlFWQTdRVUZEVGl4UlFVRkJPenROUVVSaExGbEJRVms3TzBsQlEzcENMRWRCUVVFc1IwRkJUVHRKUVVOT0xFbEJRVWNzVTBGQlFTeExRVUZoTEVkQlFXaENPMDFCUTBVc1NVRkJTU3hEUVVGRExFOUJRVXdzUTBGQllTeFRRVUZCTzFGQlExZ3NSMEZCUVN4SFFVRk5MRU5CUVVNc1EwRkJReXhMUVVGR0xFTkJRVkVzU1VGQlVqdE5RVVJMTEVOQlFXSXNSVUZFUmp0TFFVRkJMRTFCUVVFN1RVRk5SU3hKUVVGQkxFZEJRVThzVDBGQlFTeERRVUZSTEdWQlFWSTdUVUZEVUN4SlFVRkJMRU5CUVVzc1NVRkJUQ3hGUVVGWExGTkJRVU1zUjBGQlJDeEZRVUZOTEVkQlFVNDdVVUZEVkN4SlFVRnhRaXhIUVVGSExFTkJRVU1zVFVGQlNpeEhRVUZoTEVOQlFXeERPMVZCUVVFc1IwRkJRU3hKUVVGUExGVkJRVkE3TzFGQlEwRXNSMEZCUVN4SlFVRlBMRWRCUVVFc1IwRkJUU3hIUVVGT0xFZEJRVms3VFVGR1ZpeERRVUZZTEVWQlVFWTdPMWRCV1VFc1JVRkJSU3hEUVVGRExFMUJRVWdzUTBGQlZTeEhRVUZXTzBWQlpFMHNRMEZvUlZJN1JVRnJSa0VzVFVGQlFTeEZRVUZSTEZOQlFVTXNUMEZCUkN4RlFVRlZMRTFCUVZZc1JVRkJhMElzVVVGQmJFSTdRVUZEVGl4UlFVRkJPenROUVVSM1FpeFhRVUZYT3p0SlFVTnVReXhIUVVGQkxFZEJRVTBzVDBGQlFTeEpRVUZYTzBGQlEycENMRk5CUVVFc1lVRkJRVHM3VFVGRFJTeEpRVUZITEZGQlFVRXNTVUZCWVN4TFFVRmlMRWxCUVhWQ0xFTkJRVU1zUTBGQlF5eGhRVUZHTEVOQlFXZENMRXRCUVdoQ0xFTkJRWFpDTEVsQlFXdEVMRU5CUVVNc1EwRkJReXhoUVVGR0xFTkJRV2RDTEVkQlFVa3NRMEZCUVN4SFFVRkJMRU5CUVhCQ0xFTkJRWEpFTzFGQlJVVXNTVUZCUXl4RFFVRkJMRTFCUVVRc1EwRkJVU3hIUVVGSkxFTkJRVUVzUjBGQlFTeERRVUZhTEVWQlFXdENMRXRCUVd4Q0xFVkJRWGxDTEVsQlFYcENMRVZCUmtZN1QwRkJRU3hOUVVGQk8xRkJTVVVzUjBGQlNTeERRVUZCTEVkQlFVRXNRMEZCU2l4SFFVRlhMRTFCU21JN08wRkJSRVk3VjBGTlFUdEZRVkpOTEVOQmJFWlNPenM3UVVFMFJrWXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3hSUVVGYUxFVkJRWE5DTEUxQlFVMHNRMEZCUXl4TlFVRTNRanM3UVVGRFFTeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMR05CUVZvc1JVRkJORUlzVFVGQlRTeERRVUZETEZsQlFXNURPenRCUVVOQkxFVkJRVVVzUTBGQlF5eFJRVUZJTEVOQlFWa3NWVUZCV2l4RlFVRjNRaXhOUVVGTkxFTkJRVU1zVVVGQkwwSTdPMEZCUTBFc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeFRRVUZhTEVWQlFYVkNMRTFCUVUwc1EwRkJReXhQUVVFNVFqczdRVUZEUVN4RlFVRkZMRU5CUVVNc1VVRkJTQ3hEUVVGWkxFOUJRVm9zUlVGQmNVSXNUVUZCVFN4RFFVRkRMRXRCUVRWQ096dEJRVU5CTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1YwRkJXaXhGUVVGNVFpeE5RVUZOTEVOQlFVTXNVMEZCYUVNN08wRkJRMEVzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4aFFVRmFMRVZCUVRKQ0xFMUJRVTBzUTBGQlF5eFhRVUZzUXpzN1FVRkRRU3hGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEZGQlFWb3NSVUZCYzBJc1RVRkJUU3hEUVVGRExFMUJRVGRDT3p0QlFVTkJMRVZCUVVVc1EwRkJReXhSUVVGSUxFTkJRVmtzVVVGQldpeEZRVUZ6UWl4TlFVRk5MRU5CUVVNc1RVRkJOMEk3TzBGQlJVRXNUVUZCVFN4RFFVRkRMRTlCUVZBc1IwRkJhVUlpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklrOUtJRDBnY21WeGRXbHlaU0FuTGk0dmIyb25YSEpjYmlRZ1BTQnlaWEYxYVhKbElDZHFjWFZsY25rblhISmNibDhnUFNCeVpYRjFhWEpsSUNkc2IyUmhjMmduWEhKY2JtbHpUV1YwYUc5a0lEMGdjbVZ4ZFdseVpTQW5MaTR2ZEc5dmJITXZhWE1uWEhKY2JuQnliM0JsY25SNUlEMGdjbVZ4ZFdseVpTQW5MaTl3Y205d1pYSjBlU2RjY2x4dVpuVnVZeUE5SUhKbGNYVnBjbVVnSnk0dlpuVnVZM1JwYjI0blhISmNiblJ2SUQwZ2NtVnhkV2x5WlNBbkxpNHZkRzl2YkhNdmRHOG5YSEpjYmx4eVhHNGpJQ01nYjJKcVpXTjBYSEpjYmx4eVhHNXlaWFJQWW1vZ1BTQmNjbHh1WEhKY2JpQWdJeUFqSXlCYlQwcGRLRzlxTG1oMGJXd3BMbTlpYW1WamRGeHlYRzRnSUNNZ1kzSmxZWFJsSUdGdUlHOWlhbVZqZENCM2FYUm9JR2hsYkhCbGNpQmdZV1JrWUNCaGJtUWdZR1ZoWTJoZ0lHMWxkR2h2WkhNdVhISmNiaUFnYjJKcVpXTjBPaUFvYjJKcUlEMGdlMzBwSUMwK1hISmNiaUFnSUNCY2NseHVJQ0FnSUNNakkxeHlYRzRnSUNBZ1FXUmtJR0VnY0hKdmNHVnlkSGtnZEc4Z2RHaGxJRzlpYW1WamRDQmhibVFnY21WMGRYSnVJR2wwWEhKY2JpQWdJQ0FqSXlOY2NseHVJQ0FnSUc5aWFpNWhaR1FnUFNBb2JtRnRaU3dnZG1Gc0tTQXRQbHh5WEc0Z0lDQWdJQ0J3Y205d1pYSjBlU0J2WW1vc0lHNWhiV1VzSUhaaGJGeHlYRzRnSUNBZ0lDQnZZbXBjY2x4dVhISmNiaUFnSUNCdlltb3VZV1JrSUNkbFlXTm9KeXdnS0dOaGJHeGlZV05yS1NBdFBseHlYRzRnSUNBZ0lDQmxZV05vSUQwZ2NtVnhkV2x5WlNBbkxpNHZkRzl2YkhNdlpXRmphQ2RjY2x4dUlDQWdJQ0FnWldGamFDQnZZbW9zSUNoMllXd3NJR3RsZVNrZ0xUNWNjbHh1SUNBZ0lDQWdJQ0JwWmlCclpYa2dhWE51ZENBblpXRmphQ2NnWVc1a0lHdGxlU0JwYzI1MElDZGhaR1FuWEhKY2JpQWdJQ0FnSUNBZ0lDQmpZV3hzWW1GamF5QjJZV3dzSUd0bGVWeHlYRzVjY2x4dUlDQWdJRzlpYWx4eVhHNWNjbHh1WEhKY2JpQWdJeUFqSXlCYlQwcGRLRzlxTG1oMGJXd3BMbWx6U1c1emRHRnVZMlZQWmx4eVhHNGdJQ01nWkdWMFpYSnRhVzVsY3lCcGN5QmhJSFJvYVc1bklHbHpJR0Z1SUdsdWMzUmhibU5sSUc5bUlHRWdWR2hwYm1jc0lHRnpjM1Z0YVc1bklIUm9aU0IwYUdsdVozTWdkMlZ5WlNCaGJHd2dZM0psWVhSbFpDQnBiaUJQU2x4eVhHNGdJR2x6U1c1emRHRnVZMlZQWmpvZ0tHNWhiV1VzSUc5aWFpa2dMVDVjY2x4dUlDQWdJSEpsZEU5aWFpNWpiMjUwWVdsdWN5aHVZVzFsTENCdlltb3BJR0Z1WkNCMGJ5NWliMjlzS0c5aWFsdHVZVzFsWFNsY2NseHVYSEpjYmlBZ0l5QWpJeUJiVDBwZEtHOXFMbWgwYld3cExtTnZiblJoYVc1elhISmNiaUFnSXlCMGNuVmxJR2xtSUhSb1pTQmdiMkpxWldOMFlDQmpiMjUwWVdsdWN5QjBhR1VnZG1Gc2RXVmNjbHh1SUNCamIyNTBZV2x1Y3pvZ0tHOWlhbVZqZEN3Z2FXNWtaWGdwSUMwK1hISmNiaUFnSUNCeVpYUWdQU0JtWVd4elpWeHlYRzRnSUNBZ2FXWWdiMkpxWldOMFhISmNiaUFnSUNBZ0lISmxkQ0E5SUY4dVkyOXVkR0ZwYm5NZ2IySnFaV04wTENCcGJtUmxlRnh5WEc0Z0lDQWdjbVYwWEhKY2JseHlYRzRnSUNNZ0l5TWdXMDlLWFNodmFpNW9kRzFzS1M1amIyMXdZWEpsWEhKY2JpQWdJeUJqYjIxd1lYSmxJSFIzYnlCdlltcGxZM1J6TDJGeWNtRjVjeTkyWVd4MVpYTWdabTl5SUhOMGNtbGpkQ0JsY1hWaGJHbDBlVnh5WEc0Z0lHTnZiWEJoY21VNklDaHZZbW94TENCdlltb3lLU0F0UGx4eVhHNGdJQ0FnWHk1cGMwVnhkV0ZzSUc5aWFqRXNJRzlpYWpKY2NseHVYSEpjYmlBZ0l5QWpJeUJiVDBwZEtHOXFMbWgwYld3cExtTnNiMjVsWEhKY2JpQWdJeUJqYjNCNUlHRnNiQ0J2WmlCMGFHVWdkbUZzZFdWeklDaHlaV04xY25OcGRtVnNlU2tnWm5KdmJTQnZibVVnYjJKcVpXTjBJSFJ2SUdGdWIzUm9aWEl1WEhKY2JpQWdZMnh2Ym1VNklDaGtZWFJoS1NBdFBseHlYRzRnSUNBZ1h5NWpiRzl1WlVSbFpYQWdaR0YwWVNCMGNuVmxYSEpjYmx4eVhHNGdJQ01nSXlNZ1cwOUtYU2h2YWk1b2RHMXNLUzV6WlhKcFlXeHBlbVZjY2x4dUlDQWpJRU52Ym5abGNuUWdZVzRnYjJKcVpXTjBJSFJ2SUdFZ1NsTlBUaUJ5WlhCeVpYTmxiblJoZEdsdmJpQnZaaUIwYUdVZ2IySnFaV04wWEhKY2JpQWdjMlZ5YVdGc2FYcGxPaUFvWkdGMFlTa2dMVDVjY2x4dUlDQWdJSEpsZENBOUlDY25YSEpjYmlBZ0lDQm1kVzVqTG5SeWVVVjRaV01nTFQ1Y2NseHVJQ0FnSUNBZ2NtVjBJRDBnU2xOUFRpNXpkSEpwYm1kcFpua29aR0YwWVNsY2NseHVJQ0FnSUNBZ2NtVjBkWEp1WEhKY2JpQWdJQ0J5WlhRZ2IzSWdKeWRjY2x4dVhISmNiaUFnSXlBakl5QmJUMHBkS0c5cUxtaDBiV3dwTG1SbGMyVnlhV0ZzYVhwbFhISmNiaUFnSXlCRGIyNTJaWEowSUdFZ1NsTlBUaUJ6ZEhKcGJtY2dkRzhnWVc0Z2IySnFaV04wWEhKY2JpQWdaR1Z6WlhKcFlXeHBlbVU2SUNoa1lYUmhLU0F0UGx4eVhHNGdJQ0FnY21WMElEMGdlMzFjY2x4dUlDQWdJR2xtSUdSaGRHRmNjbHh1SUNBZ0lDQWdablZ1WXk1MGNubEZlR1ZqSUMwK1hISmNiaUFnSUNBZ0lDQWdjbVYwSUQwZ0pDNXdZWEp6WlVwVFQwNG9aR0YwWVNsY2NseHVJQ0FnSUNBZ0lDQnlaWFIxY201Y2NseHVYSEpjYmlBZ0lDQWdJSEpsZENBOUlIdDlJQ0JwWmlCcGMwMWxkR2h2WkM1dWRXeHNUM0pGYlhCMGVTaHlaWFFwWEhKY2JpQWdJQ0J5WlhSY2NseHVYSEpjYmlBZ0l5QWpJeUJiVDBwZEtHOXFMbWgwYld3cExuQmhjbUZ0YzF4eVhHNGdJQ01nUTI5dWRtVnlkQ0JoYmlCdlltcGxZM1FnZEc4Z1lTQmtaV3hwYldsMFpXUWdiR2x6ZENCdlppQndZWEpoYldWMFpYSnpJQ2h1YjNKdFlXeHNlU0J4ZFdWeWVTMXpkSEpwYm1jZ2NHRnlZVzFsZEdWeWN5bGNjbHh1SUNCd1lYSmhiWE02SUNoa1lYUmhMQ0JrWld4cGJXbDBaWElnUFNBbkppY3BJQzArWEhKY2JpQWdJQ0J5WlhRZ1BTQW5KMXh5WEc0Z0lDQWdhV1lnWkdWc2FXMXBkR1Z5SUdseklDY21KMXh5WEc0Z0lDQWdJQ0JtZFc1akxuUnllVVY0WldNZ0xUNWNjbHh1SUNBZ0lDQWdJQ0J5WlhRZ1BTQWtMbkJoY21GdEtHUmhkR0VwWEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1WEhKY2JseHlYRzRnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0JsWVdOb0lEMGdjbVZ4ZFdseVpTQW5MaTR2ZEc5dmJITXZaV0ZqYUNkY2NseHVJQ0FnSUNBZ1pXRmphQ0JrWVhSaExDQW9kbUZzTENCclpYa3BJQzArWEhKY2JpQWdJQ0FnSUNBZ2NtVjBJQ3M5SUdSbGJHbHRhWFJsY2lBZ2FXWWdjbVYwTG14bGJtZDBhQ0ErSURCY2NseHVJQ0FnSUNBZ0lDQnlaWFFnS3owZ2EyVjVJQ3NnSnowbklDc2dkbUZzWEhKY2JpQWdJQ0FnSUNBZ2NtVjBkWEp1WEhKY2JseHlYRzRnSUNBZ2RHOHVjM1J5YVc1bklISmxkRnh5WEc1Y2NseHVJQ0FqSUNNaklGdFBTbDBvYjJvdWFIUnRiQ2t1WlhoMFpXNWtYSEpjYmlBZ0l5QmpiM0I1SUhSb1pTQndjbTl3WlhKMGFXVnpJRzltSUc5dVpTQnZZbXBsWTNRZ2RHOGdZVzV2ZEdobGNpQnZZbXBsWTNSY2NseHVJQ0JsZUhSbGJtUTZJQ2hrWlhOMFQySnFMQ0J6Y21OUFltb3NJR1JsWlhCRGIzQjVJRDBnWm1Gc2MyVXBJQzArWEhKY2JpQWdJQ0J5WlhRZ1BTQmtaWE4wVDJKcUlHOXlJSHQ5WEhKY2JpQWdJQ0JtYjNJZ2EyVjVMQ0IyWVd4MVpTQnZaaUJ6Y21OUFltcGNjbHh1SUNBZ0lDQWdhV1lnWkdWbGNFTnZjSGtnWVc1a0lIWmhiSFZsSUdGdVpDQWtMbWx6VUd4aGFXNVBZbXBsWTNRb2RtRnNkV1VwSUdGdVpDQWtMbWx6VUd4aGFXNVBZbXBsWTNRb2NtVjBXMnRsZVYwcFhISmNiaUFnSUNBZ0lDQWdJeUJ0WlhKblpTQnBiblJ2SUdSbGMzUnBibUYwYVc5dUlIQnliM0JsY25SNVhISmNiaUFnSUNBZ0lDQWdRR1Y0ZEdWdVpDQnlaWFJiYTJWNVhTd2dkbUZzZFdVc0lIUnlkV1ZjY2x4dUlDQWdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQWdJSEpsZEZ0clpYbGRJRDBnZG1Gc2RXVmNjbHh1SUNBZ0lISmxkRnh5WEc1Y2NseHVUMG91Y21WbmFYTjBaWElnSjI5aWFtVmpkQ2NzSUhKbGRFOWlhaTV2WW1wbFkzUmNjbHh1VDBvdWNtVm5hWE4wWlhJZ0oybHpTVzV6ZEdGdVkyVlBaaWNzSUhKbGRFOWlhaTVwYzBsdWMzUmhibU5sVDJaY2NseHVUMG91Y21WbmFYTjBaWElnSjJOdmJuUmhhVzV6Snl3Z2NtVjBUMkpxTG1OdmJuUmhhVzV6WEhKY2JrOUtMbkpsWjJsemRHVnlJQ2RqYjIxd1lYSmxKeXdnY21WMFQySnFMbU52YlhCaGNtVmNjbHh1VDBvdWNtVm5hWE4wWlhJZ0oyTnNiMjVsSnl3Z2NtVjBUMkpxTG1Oc2IyNWxYSEpjYms5S0xuSmxaMmx6ZEdWeUlDZHpaWEpwWVd4cGVtVW5MQ0J5WlhSUFltb3VjMlZ5YVdGc2FYcGxYSEpjYms5S0xuSmxaMmx6ZEdWeUlDZGtaWE5sY21saGJHbDZaU2NzSUhKbGRFOWlhaTVrWlhObGNtbGhiR2w2WlZ4eVhHNVBTaTV5WldkcGMzUmxjaUFuY0dGeVlXMXpKeXdnY21WMFQySnFMbkJoY21GdGMxeHlYRzVQU2k1eVpXZHBjM1JsY2lBblpYaDBaVzVrSnl3Z2NtVjBUMkpxTG1WNGRHVnVaRnh5WEc1Y2NseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQnlaWFJQWW1vaVhYMD0iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG4jIyNcclxuQWRkIGEgcHJvcGVydHkgdG8gYW4gb2JqZWN0XHJcbiAgXHJcbiMjI1xyXG5wcm9wZXJ0eSA9IChvYmosIG5hbWUsIHZhbHVlLCB3cml0YWJsZSwgY29uZmlndXJhYmxlLCBlbnVtZXJhYmxlKSAtPlxyXG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGRlZmluZSBhIHByb3BlcnR5IHdpdGhvdXQgYW4gT2JqZWN0LicgIHVubGVzcyBvYmpcclxuICB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgYSBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgcHJvcGVydHkgbmFtZS4nICB1bmxlc3MgbmFtZT9cclxuICBvYmpbbmFtZV0gPSB2YWx1ZVxyXG4gIG9ialxyXG5cclxuT0oucmVnaXN0ZXIgJ3Byb3BlcnR5JywgcHJvcGVydHlcclxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmRlbGltaXRlZFN0cmluZyA9IChzdHJpbmcsIG9wdHMpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgbmV3TGluZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICBzcGFjZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICByZW1vdmVEdXBsaWNhdGVzOiB0cnVlXHJcbiAgICBkZWxpbWl0ZXI6IFwiLFwiXHJcbiAgICBpbml0U3RyaW5nOiBPSi50by5zdHJpbmcgc3RyaW5nXHJcblxyXG4gIHJldE9iaiA9XHJcbiAgICBhcnJheTogW11cclxuICAgIGRlbGltaXRlZDogLT5cclxuICAgICAgcmV0T2JqLmFycmF5LmpvaW4gZGVmYXVsdHMuZGVsaW1pdGVyXHJcblxyXG4gICAgc3RyaW5nOiAoZGVsaW1pdGVyID0gZGVmYXVsdHMuZGVsaW1pdGVyKSAtPlxyXG4gICAgICByZXQgPSAnJ1xyXG4gICAgICBPSi5lYWNoIHJldE9iai5hcnJheSwgKHZhbCkgLT5cclxuICAgICAgICByZXQgKz0gZGVsaW1pdGVyICBpZiByZXQubGVuZ3RoID4gMFxyXG4gICAgICAgIHJldCArPSB2YWxcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIHJldFxyXG5cclxuICAgIHRvU3RyaW5nOiAtPlxyXG4gICAgICByZXRPYmouc3RyaW5nKClcclxuXHJcbiAgICBhZGQ6IChzdHIpIC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5wdXNoIGRlZmF1bHRzLnBhcnNlKHN0cilcclxuICAgICAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcygpXHJcbiAgICAgIHJldE9ialxyXG5cclxuICAgIHJlbW92ZTogKHN0cikgLT5cclxuICAgICAgcmVtb3ZlID0gKGFycmF5KSAtPlxyXG4gICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgIHRydWUgIGlmIGl0ZW0gaXNudCBzdHJcclxuXHJcblxyXG4gICAgICByZXRPYmouYXJyYXkgPSByZW1vdmUocmV0T2JqLmFycmF5KVxyXG4gICAgICByZXRPYmpcclxuXHJcbiAgICBjb3VudDogLT5cclxuICAgICAgcmV0T2JqLmFycmF5Lmxlbmd0aFxyXG5cclxuICAgIGNvbnRhaW5zOiAoc3RyLCBjYXNlU2Vuc2l0aXZlKSAtPlxyXG4gICAgICBpc0Nhc2VTZW5zaXRpdmUgPSBPSi50by5ib29sKGNhc2VTZW5zaXRpdmUpXHJcbiAgICAgIHN0ciA9IE9KLnRvLnN0cmluZyhzdHIpLnRyaW0oKVxyXG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKSAgaWYgZmFsc2UgaXMgaXNDYXNlU2Vuc2l0aXZlXHJcbiAgICAgIG1hdGNoID0gcmV0T2JqLmFycmF5LmZpbHRlcigobWF0U3RyKSAtPlxyXG4gICAgICAgIChpc0Nhc2VTZW5zaXRpdmUgYW5kIE9KLnRvLnN0cmluZyhtYXRTdHIpLnRyaW0oKSBpcyBzdHIpIG9yIE9KLnRvLnN0cmluZyhtYXRTdHIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpIGlzIHN0clxyXG4gICAgICApXHJcbiAgICAgIG1hdGNoLmxlbmd0aCA+IDBcclxuXHJcbiAgICBlYWNoOiAoY2FsbEJhY2spIC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5mb3JFYWNoIGNhbGxCYWNrXHJcblxyXG4gIGRlZmF1bHRzLnBhcnNlID0gKHN0cikgLT5cclxuICAgIHJldCA9IE9KLnRvLnN0cmluZyhzdHIpXHJcbiAgICByZXQgPSByZXQucmVwbGFjZSgvXFxuL2csIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiXFxuXCIpIGlzbnQgLTEgIGlmIGRlZmF1bHRzLm5ld0xpbmVUb0RlbGltaXRlclxyXG4gICAgcmV0ID0gcmV0LnJlcGxhY2UoUmVnRXhwKFwiIFwiLCBcImdcIiksIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiIFwiKSBpc250IC0xICBpZiBkZWZhdWx0cy5zcGFjZVRvRGVsaW1pdGVyXHJcbiAgICByZXQgPSByZXQucmVwbGFjZSgvLCwvZywgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCIsLFwiKSBpc250IC0xXHJcbiAgICByZXRcclxuXHJcbiAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcyA9IC0+XHJcbiAgICBpZiBkZWZhdWx0cy5yZW1vdmVEdXBsaWNhdGVzXHJcbiAgICAgICgtPlxyXG4gICAgICAgIHVuaXF1ZSA9IChhcnJheSkgLT5cclxuICAgICAgICAgIHNlZW4gPSBuZXcgU2V0KClcclxuICAgICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgICAgaWYgZmFsc2UgaXMgc2Vlbi5oYXMoaXRlbSlcclxuICAgICAgICAgICAgICBzZWVuLmFkZCBpdGVtXHJcbiAgICAgICAgICAgICAgdHJ1ZVxyXG5cclxuXHJcbiAgICAgICAgcmV0T2JqLmFycmF5ID0gdW5pcXVlKHJldE9iai5hcnJheSlcclxuICAgICAgICByZXR1cm5cclxuICAgICAgKSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgKChhKSAtPlxyXG4gICAgaWYgYS5sZW5ndGggPiAxIGFuZCBmYWxzZSBpcyBPSi5pcy5wbGFpbk9iamVjdChvcHRzKVxyXG4gICAgICBPSi5lYWNoIGEsICh2YWwpIC0+XHJcbiAgICAgICAgcmV0T2JqLmFycmF5LnB1c2ggdmFsICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSh2YWwpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgZWxzZSBpZiBzdHJpbmcgYW5kIHN0cmluZy5sZW5ndGggPiAwXHJcbiAgICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0c1xyXG4gICAgICBkZWxpbWl0ZWRTdHJpbmcgPSBkZWZhdWx0cy5wYXJzZShzdHJpbmcpXHJcbiAgICAgIGRlZmF1bHRzLmluaXRTdHJpbmcgPSBkZWxpbWl0ZWRTdHJpbmdcclxuICAgICAgcmV0T2JqLmFycmF5ID0gZGVsaW1pdGVkU3RyaW5nLnNwbGl0KGRlZmF1bHRzLmRlbGltaXRlcilcclxuICAgIGRlZmF1bHRzLmRlbGV0ZUR1cGxpY2F0ZXMoKVxyXG4gICAgcmV0dXJuXHJcbiAgKSBhcmd1bWVudHNcclxuICByZXRPYmpcclxuXHJcblxyXG5PSi5yZWdpc3RlciAnZGVsaW1pdGVkU3RyaW5nJywgZGVsaW1pdGVkU3RyaW5nXHJcbm1vZHVsZS5leHBvcnRzID0gZGVsaW1pdGVkU3RyaW5nIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE5vZGUsIE9KLCBfLCBib2R5LCBvakJvZHk7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuTm9kZSA9IHJlcXVpcmUoJy4vbm9kZScpO1xuXG5cbi8qXG5QZXJzaXN0IGEgaGFuZGxlIG9uIHRoZSBib2R5IG5vZGVcbiAqL1xuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICBib2R5ID0gZG9jdW1lbnQuYm9keTtcbn0gZWxzZSB7XG4gIGJvZHkgPSBudWxsO1xufVxuXG5vakJvZHkgPSBuZXcgTm9kZTtcblxub2pCb2R5LmVsZW1lbnQgPSBib2R5O1xuXG5PSi5yZWdpc3RlcignYm9keScsIG9qQm9keSk7XG5cbm1vZHVsZS5leHBvcnRzID0gb2pCb2R5O1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1RNlhGeEhhWFJvZFdKY1hHOXFYRnh6Y21OY1hHTnZabVpsWlZ4Y1pHOXRYRnhpYjJSNUxtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlFVRXNTVUZCUVRzN1FVRkJRU3hGUVVGQkxFZEJRVXNzVDBGQlFTeERRVUZSTEU5QlFWSTdPMEZCUTB3c1EwRkJRU3hIUVVGSkxFOUJRVUVzUTBGQlVTeFJRVUZTT3p0QlFVTktMRWxCUVVFc1IwRkJUeXhQUVVGQkxFTkJRVkVzVVVGQlVqczdPMEZCUjFBN096czdRVUZIUVN4SlFVRkhMRTlCUVU4c1VVRkJVQ3hMUVVGeFFpeFhRVUY0UWp0RlFVRjVReXhKUVVGQkxFZEJRVThzVVVGQlVTeERRVUZETEV0QlFYcEVPME5CUVVFc1RVRkJRVHRGUVVGdFJTeEpRVUZCTEVkQlFVOHNTMEZCTVVVN096dEJRVU5CTEUxQlFVRXNSMEZCVXl4SlFVRkpPenRCUVVOaUxFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENPenRCUVVWcVFpeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMRTFCUVZvc1JVRkJiMElzVFVGQmNFSTdPMEZCUTBFc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSWlMQ0ptYVd4bElqb2laMlZ1WlhKaGRHVmtMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWs5S0lEMGdjbVZ4ZFdseVpTQW5MaTR2YjJvblhISmNibDhnUFNCeVpYRjFhWEpsSUNkc2IyUmhjMmduWEhKY2JrNXZaR1VnUFNCeVpYRjFhWEpsSUNjdUwyNXZaR1VuWEhKY2JseHlYRzVjY2x4dUl5TWpYSEpjYmxCbGNuTnBjM1FnWVNCb1lXNWtiR1VnYjI0Z2RHaGxJR0p2WkhrZ2JtOWtaVnh5WEc0akl5TmNjbHh1YVdZZ2RIbHdaVzltSUdSdlkzVnRaVzUwSUdsemJuUWdKM1Z1WkdWbWFXNWxaQ2NnZEdobGJpQmliMlI1SUQwZ1pHOWpkVzFsYm5RdVltOWtlU0JsYkhObElHSnZaSGtnUFNCdWRXeHNYSEpjYm05cVFtOWtlU0E5SUc1bGR5Qk9iMlJsWEhKY2JtOXFRbTlrZVM1bGJHVnRaVzUwSUQwZ1ltOWtlVnh5WEc0Z0lGeHlYRzVQU2k1eVpXZHBjM1JsY2lBblltOWtlU2NzSUc5cVFtOWtlVnh5WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUc5cVFtOWtlU0pkZlE9PSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcblxyXG4jICMgY29tcG9uZW50XHJcblxyXG5cclxuIyBDcmVhdGUgYW4gSFRNTCBXZWIgQ29tcG9uZW50IHRocm91Z2ggVGhpbkRvbVxyXG5cclxuIyAtIGBvcHRpb25zYCBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzdGFuZGFyZCBvcHRpb25zIHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBjb21wb25lbnRcclxuIyAtLSBgcm9vdE5vZGVUeXBlYDogdGhlIHRhZyBuYW1lIG9mIHRoZSByb290IG5vZGUgdG8gY3JlYXRlLCBkZWZhdWx0ID0gJ2RpdidcclxuIyAtLSBgcHJvcHNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBET00gYXR0cmlidXRlcyB0byBhcHBlbmQgdG8gdGhlIHJvb3Qgbm9kZVxyXG4jIC0tIGBzdHlsZXNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBDU1MgYXR0cmlidXRlcyB0byBhcHBlbmQgdG8gdGhlIHJvb3Qgbm9kZVxyXG4jIC0tIGBldmVudHNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBuYW1lZCBET00gZXZlbnRzIChhbmQgY29ycmVzcG9uZGluZyBjYWxsYmFjayBtZXRob2RzKSB0byBiaW5kIHRvIHRoZSByb290IG5vZGVcclxuIyAtIGBvd25lcmAgdGhlIHBhcmVudCB0byB3aGljaCB0aGUgY29tcG9uZW50IG5vZGUgd2lsbCBiZSBhcHBlbmRlZFxyXG4jIC0gYHRhZ05hbWVgIHRoZSBuYW1lIG9mIG9mIHRoZSBjb21wb25lbnQsIHdoaWNoIHdpbGwgYWx3YXlzIGJlIHByZWZpeGVkIHdpdGggJ3gtJ1xyXG5jb21wb25lbnQgPSAob3B0aW9ucyA9IG9iai5vYmplY3QoKSwgb3duZXIsIHRhZ05hbWUpIC0+XHJcblxyXG4gIGlmIG5vdCB0YWdOYW1lLnN0YXJ0c1dpdGggJ3gtJyB0aGVuIHRhZ05hbWUgPSAneC0nICsgdGFnTmFtZVxyXG4gICMgd2ViIGNvbXBvbmVudHMgYXJlIHJlYWxseSBqdXN0IG9yZGluYXJ5IE9KIFtlbGVtZW50XShlbGVtZW50Lmh0bWwpJ3Mgd2l0aCBhIHNwZWNpYWwgbmFtZS5cclxuICAjIFVudGlsIEhUTUwgV2ViIENvbXBvbmVudHMgYXJlIGZ1bGx5IHN1cHBvcnRlZCAoYW5kIE9KIGlzIHJlZmFjdG9yZWQgYWNjb3JkaW5nbHkpLCB0aGUgZWxlbWVudCB3aWxsIGJlIHRyZWF0ZWQgYXMgYW4gdW5rbm93biBlbGVtZW50LlxyXG4gICMgSW4gbW9zdCBjYXNlcywgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgdGhlIGJyb3dzZXIgaXMgYWNjZXB0YWJsZSAoc2VlIGFsc28gW0hUTUwgU2VtYW50aWNzXShodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL3NlbWFudGljcy5odG1sKSksIGJ1dFxyXG4gICMgaW4gc29tZSBjYXNlcyB0aGlzIGlzIHByb2JsZW1hdGljIChmaXJzdGx5LCBiZWNhdXNlIHRoZXNlIGVsZW1lbnRzIGFyZSBhbHdheXMgcmVuZGVyZWQgaW5saW5lKS5cclxuICAjIEluIHN1Y2ggY29uZGl0aW9ucywgdGhlIFtjb250cm9sc10oY29udHJvbHMuaHRtbCkgY2xhc3MgYW5kIG5hbWUgc3BhY2UgaXMgYmV0dGVyIHN1aXRlZCB0byBjbGFzc2VzIHdoaWNoIHJlcXVpcmUgY29tcGxldGUgY29udHJvbCAoZS5nLiBbaWNvbl0oaWNvbi5odG1sKSkuXHJcbiAgd2lkZ2V0ID0gbm9kZUZhY3RvcnkgdGFnTmFtZSwgb2JqLm9iamVjdCgpLCBvd25lciwgZmFsc2UgIywgb3B0aW9ucy5wcm9wcywgb3B0aW9ucy5zdHlsZXMsIG9wdGlvbnMuZXZlbnRzLCBvcHRpb25zLnRleHRcclxuICBcclxuICAjIFNpbmNlIHRoZSBiZWhhdmlvciBvZiBzdHlsaW5nIGlzIG5vdCB3ZWxsIGNvbnRyb2xsZWQvY29udHJvbGxhYmxlIG9uIHVua25vd24gZWxlbWVudHMsIGl0IGlzIG5lY2Vzc2FyeSB0byBjcmVhdGUgYSByb290IG5vZGUgZm9yIHRoZSBjb21wb25lbnQuXHJcbiAgIyBJbiBtb3N0IGNhc2VzLCBbZGl2XShkaXYuaHRtbCkgaXMgcGVyZmVjdGx5IGFjY2VwdGFibGUsIGJ1dCB0aGlzIGlzIGNvbmZpZ3VyYWJsZSBhdCB0aGUgbmFtZSBzcGFjZSBsZXZlbCBvciBhdCBydW50aW1lLlxyXG4gIHJvb3ROb2RlVHlwZSA9IG9wdGlvbnMucm9vdE5vZGVUeXBlIG9yIE9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gb3IgJ2RpdidcclxuXHJcbiAgIyBgcmV0YCBpcyB0aGUgdGhlIGluc3RhbmNlIG9mIHRoZSByb290Tm9kZVR5cGUsIG5vdCB0aGUgYHdpZGdldGAgd3JhcHBlZCBpbiB0aGlzIGNsb3N1cmVcclxuICByZXQgPSB3aWRnZXQubWFrZSByb290Tm9kZVR5cGUsIG9wdGlvbnNcclxuXHJcbiAgIyBmb3IgY29udmVuaWVuY2UgYW5kIGRlYnVnZ2luZywgcGVyc2lzdCB0aGUgdGFnTmFtZVxyXG4gIHJldC5jb21wb25lbnROYW1lID0gdGFnTmFtZVxyXG5cclxuICAjIGByZW1vdmVgIGRvZXMsIGhvd2V2ZXIsIGJlaGF2ZSBhcyBleHBlY3RlZCBieSByZW1vdmluZyBgd2lkZ2V0YFxyXG4gIHJldC5yZW1vdmUgPSB3aWRnZXQucmVtb3ZlXHJcbiAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAnY29tcG9uZW50JywgY29tcG9uZW50XHJcbm1vZHVsZS5leHBvcnRzID0gY29tcG9uZW50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuXHJcbiMjI1xyXG5DcmVhdGUgYSBzZXQgb2YgSFRNTCBFbGVtZW50cyB0aHJvdWdoIFRoaW5Eb21cclxuIyMjXHJcbmNvbnRyb2wgPSAob3B0aW9ucyA9IG9iai5vYmplY3QoKSwgb3duZXIsIHRhZ05hbWUpIC0+XHJcbiAgaWYgbm90IHRhZ05hbWUuc3RhcnRzV2l0aCAneS0nIHRoZW4gdGFnTmFtZSA9ICd5LScgKyB0YWdOYW1lXHJcblxyXG4gIHJvb3ROb2RlVHlwZSA9IG9wdGlvbnMucm9vdE5vZGVUeXBlIG9yIE9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gb3IgJ2RpdidcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgcm9vdE5vZGVUeXBlLCBvcHRpb25zLCBvd25lciwgZmFsc2VcclxuXHJcbiAgcmV0LmFkZCAnY29udHJvbE5hbWUnLCB0YWdOYW1lXHJcblxyXG4gIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ2NvbnRyb2wnLCBjb250cm9sXHJcbm1vZHVsZS5leHBvcnRzID0gY29udHJvbCIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciAkLCBOb2RlLCBPSiwgVGhpbkRPTSwgXywgZWxlbWVudDtcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG4kID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5Ob2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XG5cblRoaW5ET00gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVGhpbkRPTSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVGhpbkRPTSddIDogbnVsbCk7XG5cbmVsZW1lbnQgPSB7XG5cbiAgLypcbiAgUmVzdG9yZSBhbiBIVE1MIEVsZW1lbnQgdGhyb3VnaCBUaGluRG9tXG4gICAqL1xuICByZXN0b3JlRWxlbWVudDogZnVuY3Rpb24oZWwsIHRhZykge1xuICAgIHZhciBub2RlO1xuICAgIGlmICh0YWcgPT0gbnVsbCkge1xuICAgICAgdGFnID0gZWwubm9kZU5hbWU7XG4gICAgfVxuICAgIGVsLm9mV3JhcHBlciB8fCAobm9kZSA9IG5ldyBOb2RlKTtcbiAgICBub2RlLmVsZW1lbnQgPSBlbDtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxufTtcblxuT0oucmVnaXN0ZXIoJ3Jlc3RvcmVFbGVtZW50JywgZWxlbWVudC5yZXN0b3JlRWxlbWVudCk7XG5cbk9KLnJlZ2lzdGVyKCdpc0VsZW1lbnRJbkRvbScsIGZ1bmN0aW9uKGVsZW1lbnRJZCkge1xuICByZXR1cm4gZmFsc2UgPT09IE9KLmlzLm51bGxPckVtcHR5KE9KLmdldEVsZW1lbnQoZWxlbWVudElkKSk7XG59KTtcblxuT0oucmVnaXN0ZXIoJ2dldEVsZW1lbnQnLCBmdW5jdGlvbihpZCkge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGVsZW1lbnQ7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVE2WEZ4SGFYUm9kV0pjWEc5cVhGeHpjbU5jWEdOdlptWmxaVnhjWkc5dFhGeGxiR1Z0Wlc1MExtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlFVRXNTVUZCUVRzN1FVRkJRU3hGUVVGQkxFZEJRVXNzVDBGQlFTeERRVUZSTEU5QlFWSTdPMEZCUTB3c1EwRkJRU3hIUVVGSkxFOUJRVUVzUTBGQlVTeFJRVUZTT3p0QlFVTktMRU5CUVVFc1IwRkJTU3hQUVVGQkxFTkJRVkVzVVVGQlVqczdRVUZEU2l4SlFVRkJMRWRCUVU4c1QwRkJRU3hEUVVGUkxGRkJRVkk3TzBGQlJWQXNUMEZCUVN4SFFVRlZMRTlCUVVFc1EwRkJVU3hUUVVGU096dEJRVWxXTEU5QlFVRXNSMEZGUlRzN1FVRkJRVHM3TzBWQlIwRXNZMEZCUVN4RlFVRm5RaXhUUVVGRExFVkJRVVFzUlVGQlN5eEhRVUZNTzBGQlEyWXNVVUZCUVRzN1RVRkViMElzVFVGQlRTeEZRVUZGTEVOQlFVTTdPMGxCUXpkQ0xFVkJRVVVzUTBGQlF5eFRRVUZJTEVsQlEwVXNRMEZCUVN4SlFVRkJMRWRCUVU4c1NVRkJTU3hKUVVGWU8wbEJRMEVzU1VGQlNTeERRVUZETEU5QlFVd3NSMEZCWlR0WFFVTm1PMFZCU21Fc1EwRklhRUk3T3p0QlFWTkdMRVZCUVVVc1EwRkJReXhSUVVGSUxFTkJRVmtzWjBKQlFWb3NSVUZCT0VJc1QwRkJUeXhEUVVGRExHTkJRWFJET3p0QlFVVkJMRVZCUVVVc1EwRkJReXhSUVVGSUxFTkJRVmtzWjBKQlFWb3NSVUZCT0VJc1UwRkJReXhUUVVGRU8xTkJRelZDTEV0QlFVRXNTMEZCVXl4RlFVRkZMRU5CUVVNc1JVRkJSU3hEUVVGRExGZEJRVTRzUTBGQmEwSXNSVUZCUlN4RFFVRkRMRlZCUVVnc1EwRkJZeXhUUVVGa0xFTkJRV3hDTzBGQlJHMUNMRU5CUVRsQ096dEJRVWRCTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1dVRkJXaXhGUVVFd1FpeFRRVUZETEVWQlFVUTdSVUZEZUVJc1NVRkJSeXhQUVVGUExGRkJRVkFzUzBGQmNVSXNWMEZCZUVJN1YwRkRSU3hSUVVGUkxFTkJRVU1zWTBGQlZDeERRVUYzUWl4RlFVRjRRaXhGUVVSR096dEJRVVIzUWl4RFFVRXhRanM3UVVGTFFTeE5RVUZOTEVOQlFVTXNUMEZCVUN4SFFVRnBRaUlzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVQwb2dQU0J5WlhGMWFYSmxJQ2N1TGk5dmFpZGNjbHh1SkNBOUlISmxjWFZwY21VZ0oycHhkV1Z5ZVNkY2NseHVYeUE5SUhKbGNYVnBjbVVnSjJ4dlpHRnphQ2RjY2x4dVRtOWtaU0E5SUhKbGNYVnBjbVVnSnk0dmJtOWtaU2RjY2x4dVhISmNibFJvYVc1RVQwMGdQU0J5WlhGMWFYSmxJQ2QwYUdsdVpHOXRKMXh5WEc1Y2NseHVJeUFqSUdWc1pXMWxiblJjY2x4dVhISmNibVZzWlcxbGJuUWdQU0JjY2x4dUlDQWpJQ01qSUhKbGMzUnZjbVZGYkdWdFpXNTBYSEpjYmlBZ0l5TWpYSEpjYmlBZ1VtVnpkRzl5WlNCaGJpQklWRTFNSUVWc1pXMWxiblFnZEdoeWIzVm5hQ0JVYUdsdVJHOXRYSEpjYmlBZ0l5TWpYSEpjYmlBZ2NtVnpkRzl5WlVWc1pXMWxiblE2SUNobGJDd2dkR0ZuSUQwZ1pXd3VibTlrWlU1aGJXVXBJQzArWEhKY2JpQWdYSFJsYkM1dlpsZHlZWEJ3WlhJZ2IzSmNjbHh1WEhRZ0lDQWdibTlrWlNBOUlHNWxkeUJPYjJSbFhISmNibHgwSUNBZ0lHNXZaR1V1Wld4bGJXVnVkQ0E5SUdWc1hISmNibHgwSUNBZ0lHNXZaR1ZjY2x4dVhISmNiazlLTG5KbFoybHpkR1Z5SUNkeVpYTjBiM0psUld4bGJXVnVkQ2NzSUdWc1pXMWxiblF1Y21WemRHOXlaVVZzWlcxbGJuUmNjbHh1WEhKY2JrOUtMbkpsWjJsemRHVnlJQ2RwYzBWc1pXMWxiblJKYmtSdmJTY3NJQ2hsYkdWdFpXNTBTV1FwSUMwK1hISmNiaUFnWm1Gc2MyVWdhWE1nVDBvdWFYTXViblZzYkU5eVJXMXdkSGtnVDBvdVoyVjBSV3hsYldWdWRDQmxiR1Z0Wlc1MFNXUmNjbHh1WEhKY2JrOUtMbkpsWjJsemRHVnlJQ2RuWlhSRmJHVnRaVzUwSnl3Z0tHbGtLU0F0UGx4eVhHNGdJR2xtSUhSNWNHVnZaaUJrYjJOMWJXVnVkQ0JwYzI1MElDZDFibVJsWm1sdVpXUW5YSEpjYmlBZ0lDQmtiMk4xYldWdWRDNW5aWFJGYkdWdFpXNTBRbmxKWkNocFpDbGNjbHh1WEhKY2JseHlYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJR1ZzWlcxbGJuUWlYWDA9IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIGZyYWdtZW50XHJcblxyXG4jIENyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50IGFuZCByZXR1cm4gaXQgYXMgYW4gT0ogbm9kZVxyXG5mcmFnbWVudCA9IC0+XHJcbiAgcmV0ID0gbnVsbFxyXG4gIGlmIHR5cGVvZiBkb2N1bWVudCBpc250ICd1bmRlZmluZWQnXHJcbiAgICBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxyXG4gICAgXHJcbiAgICBmcmFnID0gbmV3IFRoaW5ET00gbnVsbCwgbnVsbCwgZnJhZ21lbnRcclxuICAgIGZyYWcuaXNJbkRPTSA9IHRydWVcclxuICAgIHJldCA9IG5vZGVGYWN0b3J5IGZyYWdcclxuICAgIFxyXG4gIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ2ZyYWdtZW50JywgZnJhZ21lbnRcclxubW9kdWxlLmV4cG9ydHMgPSBmcmFnbWVudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbnJlcXVpcmUgJy4uL29qSW5pdCdcclxub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBnZW5lcmljIG5vZGVzXHJcblxyXG5jbG9zZWQgPSBbXHJcbiAgJ2FiYnInXHJcbiAgJ2Fjcm9ueW0nXHJcbiAgJ2FwcGxldCdcclxuICAnYXJ0aWNsZSdcclxuICAnYXNpZGUnXHJcbiAgJ2F1ZGlvJ1xyXG4gICdiJ1xyXG4gICdiZG8nXHJcbiAgJ2JpZydcclxuICAnYmxvY2txdW90ZSdcclxuICAnYnV0dG9uJ1xyXG4gICdjYW52YXMnXHJcbiAgJ2NhcHRpb24nXHJcbiAgJ2NlbnRlcidcclxuICAnY2l0ZSdcclxuICAnY29kZSdcclxuICAnY29sZ3JvdXAnXHJcbiAgJ2RhdGFsaXN0J1xyXG4gICdkZCdcclxuICAnZGVsJ1xyXG4gICdkZXRhaWxzJ1xyXG4gICdkZm4nXHJcbiAgJ2RpcidcclxuICAnZGl2J1xyXG4gICdkbCdcclxuICAnZHQnXHJcbiAgJ2VtJ1xyXG4gICdmaWVsZHNldCdcclxuICAnZmlnY2FwdGlvbidcclxuICAnZmlndXJlJ1xyXG4gICdmb250J1xyXG4gICdmb290ZXInXHJcbiAgJ2gxJ1xyXG4gICdoMidcclxuICAnaDMnXHJcbiAgJ2g0J1xyXG4gICdoNSdcclxuICAnaDYnXHJcbiAgJ2hlYWQnXHJcbiAgJ2hlYWRlcidcclxuICAnaGdyb3VwJ1xyXG4gICdodG1sJ1xyXG4gICdpJ1xyXG4gICdpZnJhbWUnXHJcbiAgJ2lucydcclxuICAna2JkJ1xyXG4gICdsYWJlbCdcclxuICAnbGVnZW5kJ1xyXG4gICdsaSdcclxuICAnbWFwJ1xyXG4gICdtYXJrJ1xyXG4gICdtZW51J1xyXG4gICdtZXRlcidcclxuICAnbmF2J1xyXG4gICdub2ZyYW1lcydcclxuICAnbm9zY3JpcHQnXHJcbiAgJ29iamVjdCdcclxuICAnb3B0Z3JvdXAnXHJcbiAgJ29wdGlvbidcclxuICAnb3V0cHV0J1xyXG4gICdwJ1xyXG4gICdwcmUnXHJcbiAgJ3Byb2dyZXNzJ1xyXG4gICdxJ1xyXG4gICdycCdcclxuICAncnQnXHJcbiAgJ3J1YnknXHJcbiAgJ3MnXHJcbiAgJ3NhbXAnXHJcbiAgJ3NlY3Rpb24nXHJcbiAgJ3NtYWxsJ1xyXG4gICdzcGFuJ1xyXG4gICdzdHJpa2UnXHJcbiAgJ3N0cm9uZydcclxuICAnc3R5bGUnXHJcbiAgJ3N1YidcclxuICAnc3VtbWFyeSdcclxuICAnc3VwJ1xyXG4gICd0Ym9keSdcclxuICAndGQnXHJcbiAgJ3Rmb290J1xyXG4gICd0aCdcclxuICAndGltZSdcclxuICAndGl0bGUnXHJcbiAgJ3RyJ1xyXG4gICd0dCdcclxuICAndSdcclxuICAndmFyJ1xyXG4gICd2aWRlbydcclxuICAneG1wJ1xyXG5dXHJcbm9wZW4gPSAnYXJlYSBiYXNlIGNvbCBjb21tYW5kIGNzcyBlbWJlZCBociBpbWcga2V5Z2VuIG1ldGEgcGFyYW0gc291cmNlIHRyYWNrIHdicicuc3BsaXQgJyAnXHJcbmFsbCA9IGNsb3NlZC5jb25jYXQgb3BlblxyXG5cclxuZXhwb3J0cyA9IHt9XHJcbiMgcmVnaXN0ZXIgc2VtYW50aWMvc3RydWN0dXJhbCBhbGlhc2VzXHJcbmZvciBsb29wTmFtZSBpbiBhbGxcclxuICBkbyAodGFnID0gbG9vcE5hbWUpIC0+XHJcbiAgICBtZXRob2QgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICAgICAgZGVmYXVsdHMgPVxyXG4gICAgICAgIHByb3BzOiB7fVxyXG4gICAgICAgIHN0eWxlczoge31cclxuICAgICAgICBldmVudHM6IHt9XHJcblxyXG4gICAgICBvYmouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zXHJcbiAgICAgIHJldCA9IG5vZGVGYWN0b3J5IHRhZywgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuICAgICAgcmV0XHJcbiAgICBtZXRob2QuZGVmYXVsdEJlaGF2aW9yID0gdHJ1ZVxyXG4gICAgT0oubm9kZXMucmVnaXN0ZXIgdGFnLCBtZXRob2RcclxuICAgIGV4cG9ydHNbdGFnXSA9IG1ldGhvZFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMjI1xyXG5DcmVhdGUgYW4gT0ogSW5wdXQgT2JqZWN0IHRocm91Z2ggT0oubm9kZXMuaW5wdXRcclxuIyMjXHJcbmlucHV0ID0gKG9wdGlvbnMgPSBPSi5vYmplY3QoKSwgb3duZXIpIC0+XHJcbiAgaWYgbm90IG93bmVyIHRoZW4gdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIGFuIGlucHV0IHdpdGhvdXQgYSBwYXJlbnQnXHJcbiAgaWYgbm90IG9wdGlvbnMucHJvcHMgb3Igbm90IG9wdGlvbnMucHJvcHMudHlwZSB0aGVuIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhbiBpbnB1dCB3aXRob3V0IGFuIGlucHV0IHR5cGUnXHJcbiAgcmV0ID0gb3duZXIubWFrZSAnaW5wdXQnLCBvcHRpb25zXHJcbiAgcmV0LmFkZCAnaW5wdXROYW1lJywgb3B0aW9ucy5wcm9wcy50eXBlXHJcbiAgcmV0XHJcbiAgICBcclxuT0oucmVnaXN0ZXIgJ2lucHV0JywgaW5wdXRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dCIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciAkLCBOb2RlLCBPSiwgbWV0aG9kcztcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG4kID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuXG5tZXRob2RzID0ge307XG5cbk5vZGUgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIE5vZGUocGFyZW50KSB7fVxuXG4gIE5vZGUucHJvdG90eXBlLm1ha2UgPSBmdW5jdGlvbih0YWdOYW1lLCBvcHRpb25zKSB7XG4gICAgdmFyIG1ldGhvZCwgbmV3T0pOb2RlO1xuICAgIGlmICh0YWdOYW1lLm1ha2UpIHtcbiAgICAgIHJldHVybiB0YWdOYW1lLm1ha2UodGhpcywgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1ldGhvZCA9IG1ldGhvZHNbdGFnTmFtZV07XG4gICAgICBpZiAobWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBtZXRob2Qob3B0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZXRob2QgPSBPSi5ub2Rlc1t0YWdOYW1lXSB8fCBPSi5jb21wb25lbnRzW3RhZ05hbWVdIHx8IE9KLmNvbnRyb2xzW3RhZ05hbWVdIHx8IE9KLmlucHV0c1t0YWdOYW1lXTtcbiAgICAgICAgaWYgKG1ldGhvZCAmJiAhbWV0aG9kLmRlZmF1bHRCZWhhdmlvcikge1xuICAgICAgICAgIHJldHVybiBtZXRob2Qob3B0aW9ucywgdGhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3T0pOb2RlID0gbmV3IE5vZGUoKTtcbiAgICAgICAgICBuZXdPSk5vZGUuZWxlbWVudCA9IG9qQ3JlYXRlRWxlbWVudCh0aGlzLmVsZW1lbnQsIHRhZ05hbWUsIG9wdGlvbnMpO1xuICAgICAgICAgIHJldHVybiBuZXdPSk5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgTm9kZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzW25hbWVdID0gdmFsdWU7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5valdyYXBwZXIgPSB0aGlzO1xuICB9O1xuXG4gIE5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB2YXIgcGFyZW50LCB2YWx1ZTtcbiAgICB2YWx1ZSA9IHRoaXNbbmFtZV07XG4gICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHtcbiAgICAgIHBhcmVudCA9IHRoaXMuZWxlbWVudDtcbiAgICAgIHdoaWxlIChwYXJlbnQgPSBwYXJlbnQucGFyZW50Tm9kZSkge1xuICAgICAgICBpZiAocGFyZW50Lm9qV3JhcHBlcikge1xuICAgICAgICAgIHJldHVybiBwYXJlbnQub2pXcmFwcGVyLmdldChuYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9O1xuXG4gIE5vZGUucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLiQuc2hvdygpO1xuICAgIHJldHVybiBvakNyZWF0ZUVsZW1lbnQub25TaG93KHRoaXMuZWxlbWVudCk7XG4gIH07XG5cbiAgTm9kZS5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuJC5hdHRyKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICAgIHJldHVybiB0aGlzLiQuYWRkQ2xhc3MoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gIH07XG5cbiAgTm9kZS5wcm90b3R5cGUuZW5hYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy4kLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XG4gICAgcmV0dXJuIHRoaXMuJC5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcbiAgfTtcblxuICByZXR1cm4gTm9kZTtcblxufSkoKTtcblxuWydvbicsICdlbXB0eScsICd0ZXh0JywgJ3JlbW92ZUNsYXNzJywgJ2FkZENsYXNzJywgJ2hhc0NsYXNzJywgJ2hpZGUnLCAnYXR0cicsICdyZW1vdmVBdHRyJywgJ2NzcycsICdyZW1vdmUnLCAnYXBwZW5kJywgJ3ZhbCcsICdodG1sJywgJ3Byb3AnLCAndHJpZ2dlciddLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gIHJldHVybiBOb2RlLnByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGpRdWVyeVdyYXBwZXI7XG4gICAgalF1ZXJ5V3JhcHBlciA9IHRoaXMuJDtcbiAgICByZXR1cm4galF1ZXJ5V3JhcHBlclttZXRob2RdLmFwcGx5KGpRdWVyeVdyYXBwZXIsIGFyZ3VtZW50cyk7XG4gIH07XG59KTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KE5vZGUucHJvdG90eXBlLCAnJCcsIHtcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgalF1ZXJ5V3JhcHBlcjtcbiAgICBqUXVlcnlXcmFwcGVyID0gJCh0aGlzLmVsZW1lbnQpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnJCcsIHtcbiAgICAgIHZhbHVlOiBqUXVlcnlXcmFwcGVyXG4gICAgfSk7XG4gICAgcmV0dXJuIGpRdWVyeVdyYXBwZXI7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9KLk5vZGUgPSBOb2RlO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1RNlhGeEhhWFJvZFdKY1hHOXFYRnh6Y21OY1hHTnZabVpsWlZ4Y1pHOXRYRnh1YjJSbExtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlFVRXNTVUZCUVRzN1FVRkJRU3hGUVVGQkxFZEJRVXNzVDBGQlFTeERRVUZSTEU5QlFWSTdPMEZCUTB3c1EwRkJRU3hIUVVGSkxFOUJRVUVzUTBGQlVTeFJRVUZTT3p0QlFVOUtMRTlCUVVFc1IwRkJWVHM3UVVGTFNqdEZRVWxUTEdOQlFVTXNUVUZCUkN4SFFVRkJPenRwUWtGRllpeEpRVUZCTEVkQlFVMHNVMEZCUXl4UFFVRkVMRVZCUVZVc1QwRkJWanRCUVVOS0xGRkJRVUU3U1VGQlFTeEpRVUZITEU5QlFVOHNRMEZCUXl4SlFVRllPMkZCUTBVc1QwRkJUeXhEUVVGRExFbEJRVklzUTBGQllTeEpRVUZpTEVWQlFXMUNMRTlCUVc1Q0xFVkJSRVk3UzBGQlFTeE5RVUZCTzAxQlIwVXNUVUZCUVN4SFFVRlRMRTlCUVZFc1EwRkJRU3hQUVVGQk8wMUJRMnBDTEVsQlFVY3NUVUZCU0R0bFFVTkZMRTFCUVVFc1EwRkJUeXhQUVVGUUxFVkJSRVk3VDBGQlFTeE5RVUZCTzFGQlIwVXNUVUZCUVN4SFFVRlRMRVZCUVVVc1EwRkJReXhMUVVGTkxFTkJRVUVzVDBGQlFTeERRVUZVTEVsQlFYRkNMRVZCUVVVc1EwRkJReXhWUVVGWExFTkJRVUVzVDBGQlFTeERRVUZ1UXl4SlFVRXJReXhGUVVGRkxFTkJRVU1zVVVGQlV5eERRVUZCTEU5QlFVRXNRMEZCTTBRc1NVRkJkVVVzUlVGQlJTeERRVUZETEUxQlFVOHNRMEZCUVN4UFFVRkJPMUZCUXpGR0xFbEJRVWNzVFVGQlFTeEpRVUZWTEVOQlFVTXNUVUZCVFN4RFFVRkRMR1ZCUVhKQ08ybENRVU5GTEUxQlFVRXNRMEZCVHl4UFFVRlFMRVZCUVdkQ0xFbEJRV2hDTEVWQlJFWTdVMEZCUVN4TlFVRkJPMVZCUjBVc1UwRkJRU3hIUVVGblFpeEpRVUZCTEVsQlFVRXNRMEZCUVR0VlFVTm9RaXhUUVVGVExFTkJRVU1zVDBGQlZpeEhRVUZ2UWl4bFFVRkJMRU5CUVdkQ0xFbEJRVU1zUTBGQlFTeFBRVUZxUWl4RlFVRXdRaXhQUVVFeFFpeEZRVUZ0UXl4UFFVRnVRenRwUWtGRGNFSXNWVUZNUmp0VFFVcEdPMDlCU2tZN08wVkJSRWs3TzJsQ1FXZENUaXhIUVVGQkxFZEJRVXNzVTBGQlF5eEpRVUZFTEVWQlFVOHNTMEZCVUR0SlFVTklMRWxCUVVzc1EwRkJRU3hKUVVGQkxFTkJRVXdzUjBGQllUdFhRVVZpTEVsQlFVTXNRMEZCUVN4UFFVRlBMRU5CUVVNc1UwRkJWQ3hIUVVGeFFqdEZRVWhzUWpzN2FVSkJTMHdzUjBGQlFTeEhRVUZMTEZOQlFVTXNTVUZCUkR0QlFVTklMRkZCUVVFN1NVRkJRU3hMUVVGQkxFZEJRVkVzU1VGQlN5eERRVUZCTEVsQlFVRTdTVUZEWWl4SlFVRkhMRXRCUVVFc1MwRkJVeXhOUVVGYU8wMUJRMFVzVFVGQlFTeEhRVUZUTEVsQlFVTXNRMEZCUVR0QlFVTldMR0ZCUVUwc1RVRkJRU3hIUVVGVExFMUJRVTBzUTBGQlF5eFZRVUYwUWp0UlFVTkZMRWxCUVVjc1RVRkJUU3hEUVVGRExGTkJRVlk3UVVGRFJTeHBRa0ZCVHl4TlFVRk5MRU5CUVVNc1UwRkJVeXhEUVVGRExFZEJRV3BDTEVOQlFYRkNMRWxCUVhKQ0xFVkJSRlE3TzAxQlJFWXNRMEZHUmp0TFFVRkJMRTFCUVVFN1lVRk5SU3hOUVU1R096dEZRVVpIT3p0cFFrRlZUQ3hKUVVGQkxFZEJRVTBzVTBGQlFUdEpRVU5LTEVsQlFVTXNRMEZCUVN4RFFVRkRMRU5CUVVNc1NVRkJTQ3hEUVVGQk8xZEJRMEVzWlVGQlpTeERRVUZETEUxQlFXaENMRU5CUVhWQ0xFbEJRVU1zUTBGQlFTeFBRVUY0UWp0RlFVWkpPenRwUWtGSlRpeFBRVUZCTEVkQlFWTXNVMEZCUVR0SlFVTlFMRWxCUVVNc1EwRkJRU3hEUVVGRExFTkJRVU1zU1VGQlNDeERRVUZSTEZWQlFWSXNSVUZCYjBJc1ZVRkJjRUk3VjBGRFFTeEpRVUZETEVOQlFVRXNRMEZCUXl4RFFVRkRMRkZCUVVnc1EwRkJXU3hWUVVGYUxFVkJRWGRDTEZWQlFYaENPMFZCUms4N08ybENRVWxVTEUxQlFVRXNSMEZCVVN4VFFVRkJPMGxCUTA0c1NVRkJReXhEUVVGQkxFTkJRVU1zUTBGQlF5eFZRVUZJTEVOQlFXVXNWVUZCWmp0WFFVTkJMRWxCUVVNc1EwRkJRU3hEUVVGRExFTkJRVU1zVjBGQlNDeERRVUZsTEZWQlFXWTdSVUZHVFRzN096czdPMEZCU1ZZc1EwRkRSU3hKUVVSR0xFVkJSVVVzVDBGR1JpeEZRVWRGTEUxQlNFWXNSVUZKUlN4aFFVcEdMRVZCUzBVc1ZVRk1SaXhGUVUxRkxGVkJUa1lzUlVGUFJTeE5RVkJHTEVWQlVVVXNUVUZTUml4RlFWTkZMRmxCVkVZc1JVRlZSU3hMUVZaR0xFVkJWMFVzVVVGWVJpeEZRVmxGTEZGQldrWXNSVUZoUlN4TFFXSkdMRVZCWTBVc1RVRmtSaXhGUVdWRkxFMUJaa1lzUlVGblFrVXNVMEZvUWtZc1EwRnBRa01zUTBGQlF5eFBRV3BDUml4RFFXbENWU3hUUVVGRExFMUJRVVE3VTBGRFVpeEpRVUZKTEVOQlFVTXNVMEZCVlN4RFFVRkJMRTFCUVVFc1EwRkJaaXhIUVVGNVFpeFRRVUZCTzBGQlEzWkNMRkZCUVVFN1NVRkJRU3hoUVVGQkxFZEJRV2RDTEVsQlFVTXNRMEZCUVR0WFFVTnFRaXhoUVVGakxFTkJRVUVzVFVGQlFTeERRVUZQTEVOQlFVTXNTMEZCZEVJc1EwRkJORUlzWVVGQk5VSXNSVUZCTWtNc1UwRkJNME03UlVGR2RVSTdRVUZFYWtJc1EwRnFRbFk3TzBGQmRVSkJMRTFCUVUwc1EwRkJReXhqUVVGUUxFTkJRWE5DTEVsQlFVa3NRMEZCUXl4VFFVRXpRaXhGUVVGelF5eEhRVUYwUXl4RlFVTkZPMFZCUVVFc1IwRkJRU3hGUVVGTExGTkJRVUU3UVVGRFNDeFJRVUZCTzBsQlFVRXNZVUZCUVN4SFFVRm5RaXhEUVVGQkxFTkJRVVVzU1VGQlNTeERRVUZETEU5QlFWQTdTVUZEYUVJc1RVRkJUU3hEUVVGRExHTkJRVkFzUTBGQmMwSXNTVUZCZEVJc1JVRkJORUlzUjBGQk5VSXNSVUZEUlR0TlFVRkJMRXRCUVVFc1JVRkJUeXhoUVVGUU8wdEJSRVk3VjBGSFFUdEZRVXhITEVOQlFVdzdRMEZFUmpzN1FVRlZRU3hOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWl4RlFVRkZMRU5CUVVNc1NVRkJTQ3hIUVVGVklpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpQU2lBOUlISmxjWFZwY21VZ0p5NHVMMjlxSjF4eVhHNGtJRDBnY21WeGRXbHlaU0FuYW5GMVpYSjVKMXh5WEc1Y2NseHVJeUFqSUdSdmJWeHlYRzVjY2x4dVhISmNiaU1nUlhoMFpXNWtJR0Z1SUc5aWFtVmpkQ0IzYVhSb0lFOUtJRVJQVFNCdFpYUm9iMlJ6SUdGdVpDQndjbTl3WlhKMGFXVnpYSEpjYmx4eVhHNXRaWFJvYjJSeklEMGdlMzFjY2x4dVhISmNibHh5WEc0aklDMGdZRUJsYkdBZ1QySnFaV04wSUhSdklHVjRkR1Z1WkZ4eVhHNGpJQzBnWUhCaGNtVnVkR0FnY0dGeVpXNTBJRzlpYW1WamRDQjBieUIzYUdsamFDQmdRR1ZzWUNCM2FXeHNJR0psSUdGd2NHVnVaR1ZrWEhKY2JtTnNZWE56SUU1dlpHVmNjbHh1SUNCY2NseHVJQ0FqY0dGeVpXNTBPaUJ5WlhGMWFYSmxLQ2N1TDJKdlpIa25LVnh5WEc0Z0lGeHlYRzRnSUdOdmJuTjBjblZqZEc5eU9pQW9jR0Z5Wlc1MEtTQXRQbHh5WEc1Y2NseHVJQ0J0WVd0bE9pQW9kR0ZuVG1GdFpTd2diM0IwYVc5dWN5a2dMVDVjY2x4dUlDQWdJR2xtSUhSaFowNWhiV1V1YldGclpTQWpJSEJ5YjNacFpHVmtJR0VnWTNWemRHOXRJR052YlhCdmJtVnVkQ0JrYVhKbFkzUnNlVnh5WEc0Z0lDQWdJQ0IwWVdkT1lXMWxMbTFoYTJVZ2RHaHBjeXdnYjNCMGFXOXVjMXh5WEc0Z0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNCdFpYUm9iMlFnUFNCdFpYUm9iMlJ6VzNSaFowNWhiV1ZkWEhKY2JpQWdJQ0FnSUdsbUlHMWxkR2h2WkZ4eVhHNGdJQ0FnSUNBZ0lHMWxkR2h2WkNCdmNIUnBiMjV6WEhKY2JpQWdJQ0FnSUdWc2MyVmNjbHh1SUNBZ0lDQWdJQ0J0WlhSb2IyUWdQU0JQU2k1dWIyUmxjMXQwWVdkT1lXMWxYU0J2Y2lCUFNpNWpiMjF3YjI1bGJuUnpXM1JoWjA1aGJXVmRJRzl5SUU5S0xtTnZiblJ5YjJ4elczUmhaMDVoYldWZElHOXlJRTlLTG1sdWNIVjBjMXQwWVdkT1lXMWxYVnh5WEc0Z0lDQWdJQ0FnSUdsbUlHMWxkR2h2WkNBbUppQWhiV1YwYUc5a0xtUmxabUYxYkhSQ1pXaGhkbWx2Y2x4eVhHNGdJQ0FnSUNBZ0lDQWdiV1YwYUc5a0lHOXdkR2x2Ym5Nc0lIUm9hWE5jY2x4dUlDQWdJQ0FnSUNCbGJITmxYSEpjYmlBZ0lDQWdJQ0FnSUNCdVpYZFBTazV2WkdVZ1BTQnVaWGNnVG05a1pTZ3BYSEpjYmlBZ0lDQWdJQ0FnSUNCdVpYZFBTazV2WkdVdVpXeGxiV1Z1ZENBOUlHOXFRM0psWVhSbFJXeGxiV1Z1ZENCQVpXeGxiV1Z1ZEN3Z2RHRm5UbUZ0WlN3Z2IzQjBhVzl1YzF4eVhHNGdJQ0FnSUNBZ0lDQWdibVYzVDBwT2IyUmxYSEpjYmx4eVhHNGdJR0ZrWkRvZ0tHNWhiV1VzSUhaaGJIVmxLU0F0UGx4eVhHNGdJQ0FnZEdocGMxdHVZVzFsWFNBOUlIWmhiSFZsWEhKY2JpQWdJQ0FqSUcxaGEyVWdjM1Z5WlNCM1pTQm9ZWFpsSUdFZ2JHbHVheUJpWVdOcklIUnZJRzkxY25ObGJIWmxjeXdnYzI4Z2QyVWdZMkZ1SUdsdWFHVnlhWFFnZG1Gc2RXVnpYSEpjYmlBZ0lDQkFaV3hsYldWdWRDNXZhbGR5WVhCd1pYSWdQU0IwYUdselhISmNibHh5WEc0Z0lHZGxkRG9nS0c1aGJXVXBJQzArWEhKY2JpQWdJQ0IyWVd4MVpTQTlJSFJvYVhOYmJtRnRaVjFjY2x4dUlDQWdJR2xtSUhaaGJIVmxJR2x6SUhWdVpHVm1hVzVsWkZ4eVhHNGdJQ0FnSUNCd1lYSmxiblFnUFNCQVpXeGxiV1Z1ZEZ4eVhHNGdJQ0FnSUNCM2FHbHNaU0J3WVhKbGJuUWdQU0J3WVhKbGJuUXVjR0Z5Wlc1MFRtOWtaVnh5WEc0Z0lDQWdJQ0FnSUdsbUlIQmhjbVZ1ZEM1dmFsZHlZWEJ3WlhKY2NseHVJQ0FnSUNBZ0lDQWdJSEpsZEhWeWJpQndZWEpsYm5RdWIycFhjbUZ3Y0dWeUxtZGxkQ0J1WVcxbFhISmNiaUFnSUNCbGJITmxYSEpjYmlBZ0lDQWdJSFpoYkhWbFhISmNibHh5WEc0Z0lITm9iM2M2SUNncElDMCtYSEpjYmlBZ0lDQkFKQzV6YUc5M0tDbGNjbHh1SUNBZ0lHOXFRM0psWVhSbFJXeGxiV1Z1ZEM1dmJsTm9iM2NnUUdWc1pXMWxiblJjY2x4dVhISmNiaUFnWkdsellXSnNaVG9nS0NrZ0xUNWNjbHh1SUNBZ0lFQWtMbUYwZEhJZ0oyUnBjMkZpYkdWa0p5d2dKMlJwYzJGaWJHVmtKMXh5WEc0Z0lDQWdRQ1F1WVdSa1EyeGhjM01nSjJScGMyRmliR1ZrSnl3Z0oyUnBjMkZpYkdWa0oxeHlYRzVjY2x4dUlDQmxibUZpYkdVNklDZ3BJQzArWEhKY2JpQWdJQ0JBSkM1eVpXMXZkbVZCZEhSeUlDQW5aR2x6WVdKc1pXUW5YSEpjYmlBZ0lDQkFKQzV5WlcxdmRtVkRiR0Z6Y3lBblpHbHpZV0pzWldRblhISmNibHh5WEc1YlhISmNiaUFnSjI5dUoxeHlYRzRnSUNkbGJYQjBlU2RjY2x4dUlDQW5kR1Y0ZENkY2NseHVJQ0FuY21WdGIzWmxRMnhoYzNNblhISmNiaUFnSjJGa1pFTnNZWE56SjF4eVhHNGdJQ2RvWVhORGJHRnpjeWRjY2x4dUlDQW5hR2xrWlNkY2NseHVJQ0FuWVhSMGNpZGNjbHh1SUNBbmNtVnRiM1psUVhSMGNpZGNjbHh1SUNBblkzTnpKMXh5WEc0Z0lDZHlaVzF2ZG1VblhISmNiaUFnSjJGd2NHVnVaQ2RjY2x4dUlDQW5kbUZzSjF4eVhHNGdJQ2RvZEcxc0oxeHlYRzRnSUNkd2NtOXdKMXh5WEc0Z0lDZDBjbWxuWjJWeUoxeHlYRzVkTG1admNrVmhZMmdvS0cxbGRHaHZaQ2tnTFQ1Y2NseHVJQ0JPYjJSbExuQnliM1J2ZEhsd1pWdHRaWFJvYjJSZElEMGdLQ2tnTFQ1Y2NseHVJQ0FnSUdwUmRXVnllVmR5WVhCd1pYSWdQU0JBSkZ4eVhHNGdJQ0FnYWxGMVpYSjVWM0poY0hCbGNsdHRaWFJvYjJSZExtRndjR3g1S0dwUmRXVnllVmR5WVhCd1pYSXNJR0Z5WjNWdFpXNTBjeWxjY2x4dUtWeHlYRzVjY2x4dVQySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLRTV2WkdVdWNISnZkRzkwZVhCbExDQW5KQ2NzWEhKY2JpQWdaMlYwT2lBb0tTQXRQbHh5WEc0Z0lDQWdhbEYxWlhKNVYzSmhjSEJsY2lBOUlDUW9kR2hwY3k1bGJHVnRaVzUwS1Z4eVhHNGdJQ0FnVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtIUm9hWE1zSUNja0p5eGNjbHh1SUNBZ0lDQWdkbUZzZFdVNklHcFJkV1Z5ZVZkeVlYQndaWEpjY2x4dUlDQWdJQ2xjY2x4dUlDQWdJR3BSZFdWeWVWZHlZWEJ3WlhKY2NseHVLVnh5WEc1Y2NseHVYSEpjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVDBvdVRtOWtaU0E5SUU1dlpHVWlYWDA9IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE5vZGUsIE5vZGVGYWN0b3J5LCBPSiwgVGhpbkRPTSwgXywgZGVmYXVsdENyZWF0ZUVsZW1lbnQsIGdldE5vZGVGcm9tRmFjdG9yeSwgbWFrZSxcbiAgc2xpY2UgPSBbXS5zbGljZTtcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5UaGluRE9NID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RoaW5ET00nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RoaW5ET00nXSA6IG51bGwpO1xuXG5Ob2RlID0gcmVxdWlyZSgnLi9ub2RlJyk7XG5cbk5vZGVGYWN0b3J5ID0gKGZ1bmN0aW9uKCkge1xuICBOb2RlRmFjdG9yeS5wcm90b3R5cGUub2pOb2RlID0gbnVsbDtcblxuICBOb2RlRmFjdG9yeS5nZXQgPSBmdW5jdGlvbihpZCwgdGFnTmFtZSkge1xuICAgIHZhciBlbCwgcmV0LCB0aGluRWw7XG4gICAgaWYgKHRhZ05hbWUgPT0gbnVsbCkge1xuICAgICAgdGFnTmFtZSA9ICdkaXYnO1xuICAgIH1cbiAgICByZXQgPSBudWxsO1xuICAgIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIGlmIChlbCkge1xuICAgICAgdGhpbkVsID0gT0oucmVzdG9yZUVsZW1lbnQoZWwsIHRhZ05hbWUpO1xuICAgIH1cbiAgICBpZiAodGhpbkVsKSB7XG4gICAgICByZXQgPSBuZXcgTm9kZUZhY3RvcnkobnVsbCwgbnVsbCwgbnVsbCwgZmFsc2UsIHRoaW5FbCk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgTm9kZUZhY3RvcnkucHJvdG90eXBlLl9tYWtlQWRkID0gZnVuY3Rpb24odGFnTmFtZSwgY291bnQpIHtcbiAgICByZXR1cm4gKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24ob3B0cykge1xuICAgICAgICB2YXIgbWV0aG9kLCBudTtcbiAgICAgICAgbWV0aG9kID0gT0oubm9kZXNbdGFnTmFtZV0gfHwgT0ouY29tcG9uZW50c1t0YWdOYW1lXSB8fCBPSi5jb250cm9sc1t0YWdOYW1lXSB8fCBPSi5pbnB1dHNbdGFnTmFtZV07XG4gICAgICAgIGlmIChtZXRob2QpIHtcbiAgICAgICAgICBudSA9IG1ldGhvZChvcHRzLCBfdGhpcy5vak5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG51ID0gT0ouY29tcG9uZW50KG51bGwsIF90aGlzLm9qTm9kZSwgdGFnTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51O1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgfTtcblxuICBOb2RlRmFjdG9yeS5wcm90b3R5cGUuX21ha2VVbmlxdWVJZCA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgdmFyIGlkO1xuICAgIGlmIChPSi5HRU5FUkFURV9VTklRVUVfSURTKSB7XG4gICAgICBjb3VudCArPSAxO1xuICAgICAgaWYgKGNvdW50IDw9IHRoaXMub3duZXIuY291bnQpIHtcbiAgICAgICAgY291bnQgPSB0aGlzLm93bmVyLmNvdW50ICsgMTtcbiAgICAgIH1cbiAgICAgIHRoaXMub3duZXIuY291bnQgPSBjb3VudDtcbiAgICAgIGlmICghdGhpcy5vak5vZGUuZ2V0SWQoKSkge1xuICAgICAgICBpZCA9IHRoaXMub3duZXIuZ2V0SWQoKSB8fCAnJztcbiAgICAgICAgaWQgKz0gdGhpcy5vak5vZGUudGFnTmFtZSArIGNvdW50O1xuICAgICAgICB0aGlzLm9qTm9kZS5hdHRyKCdpZCcsIGlkKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgTm9kZUZhY3RvcnkucHJvdG90eXBlLl9iaW5kRXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMub2pOb2RlKSB7XG4gICAgICByZXR1cm4gXy5mb3JPd24odGhpcy5vcHRpb25zLmV2ZW50cywgKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgICAgICAgIHZhciBjYWxsYmFjaywgaXNNZXRob2Q7XG4gICAgICAgICAgaXNNZXRob2QgPSByZXF1aXJlKCcuLi90b29scy9pcycpO1xuICAgICAgICAgIGlmIChpc01ldGhvZC5tZXRob2QodmFsKSkge1xuICAgICAgICAgICAgY2FsbGJhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgdmFyIGV2ZW50O1xuICAgICAgICAgICAgICBldmVudCA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgICAgICAgICAgICByZXR1cm4gdmFsLmFwcGx5KG51bGwsIGV2ZW50KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBfdGhpcy5vak5vZGUuJC5vbihrZXksIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIF90aGlzLm9qTm9kZS5hZGQoa2V5LCBjYWxsYmFjayk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKSk7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIE5vZGVGYWN0b3J5KHRhZzEsIG9wdGlvbnMxLCBvd25lcjEsIHRoaW5Ob2RlKSB7XG4gICAgdGhpcy50YWcgPSB0YWcxO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMxO1xuICAgIHRoaXMub3duZXIgPSBvd25lcjE7XG4gICAgdGhpcy50aGluTm9kZSA9IHRoaW5Ob2RlICE9IG51bGwgPyB0aGluTm9kZSA6IG51bGw7XG4gICAgaWYgKHRoaXMudGFnICYmICF0aGlzLnRoaW5Ob2RlKSB7XG4gICAgICB0aGlzLnRoaW5Ob2RlID0gbmV3IFRoaW5ET00odGhpcy50YWcsIHRoaXMub3B0aW9ucy5wcm9wcyk7XG4gICAgICB0aGlzLnRoaW5Ob2RlLmFkZCgndGFnTmFtZScsIHRoaXMudGFnKTtcbiAgICAgIHRoaXMudGhpbk5vZGUuY3NzKHRoaXMub3B0aW9ucy5zdHlsZXMpO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy50ZXh0KSB7XG4gICAgICAgIHRoaXMudGhpbk5vZGUudGV4dCh0aGlzLm9wdGlvbnMudGV4dCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLm93bmVyKSB7XG4gICAgICB0aGlzLm1ha2UoKTtcbiAgICB9XG4gIH1cblxuICBOb2RlRmFjdG9yeS5wcm90b3R5cGUuYWRkTWFrZU1ldGhvZCA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgdmFyIG1ldGhvZHM7XG4gICAgbWV0aG9kcyA9IE9KLm9iamVjdCgpO1xuICAgIHRoaXMub2pOb2RlLm1ha2UgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbih0YWdOYW1lLCBvcHRzKSB7XG4gICAgICAgIHZhciBtZXRob2Q7XG4gICAgICAgIG1ldGhvZCA9IG1ldGhvZHNbdGFnTmFtZV07XG4gICAgICAgIGlmICghbWV0aG9kKSB7XG4gICAgICAgICAgbWV0aG9kID0gX3RoaXMuX21ha2VBZGQodGFnTmFtZSwgX3RoaXMub2pOb2RlLCBjb3VudCk7XG4gICAgICAgICAgbWV0aG9kc1t0YWdOYW1lXSA9IG1ldGhvZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0aG9kKG9wdHMpO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5vak5vZGU7XG4gIH07XG5cbiAgTm9kZUZhY3RvcnkucHJvdG90eXBlLm1ha2UgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgY291bnQsIGZpbmFsaXplLCByZWY7XG4gICAgdGhpcy5vak5vZGUgPSBudWxsO1xuICAgIGlmICgocmVmID0gdGhpcy50aGluTm9kZSkgIT0gbnVsbCA/IHJlZi5pc0Z1bGx5SW5pdCA6IHZvaWQgMCkge1xuICAgICAgdGhpcy5vak5vZGUgPSB0aGlzLnRoaW5Ob2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9qTm9kZSA9IG5ldyBOb2RlKHRoaXMudGhpbk5vZGUsIHRoaXMub3duZXIpO1xuICAgICAgY291bnQgPSAodGhpcy5vd25lci5jb3VudCArIDEpIHx8IDE7XG4gICAgICBpZiAodGhpcy50aGluTm9kZS50YWdOYW1lICE9PSAnYm9keScgJiYgIXRoaXMudGhpbk5vZGUuaXNJbkRPTSAmJiAhdGhpcy5vak5vZGUuaXNJbkRPTSkge1xuICAgICAgICB0aGlzLl9tYWtlVW5pcXVlSWQoY291bnQpO1xuICAgICAgICB0aGlzLm93bmVyLmFwcGVuZCh0aGlzLm9qTm9kZVswXSk7XG4gICAgICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudGhpbk5vZGUuaXNJbkRPTSA9IHRydWU7XG4gICAgICB0aGlzLm9qTm9kZS5pc0luRE9NID0gdHJ1ZTtcbiAgICAgIHRoaXMuYWRkTWFrZU1ldGhvZChjb3VudCk7XG4gICAgICB0aGlzLm9qTm9kZS5pc0Z1bGx5SW5pdCA9IHRydWU7XG4gICAgICBmaW5hbGl6ZSA9IF8ub25jZSh0aGlzLm9qTm9kZS5maW5hbGl6ZSB8fCBPSi5ub29wKTtcbiAgICAgIHRoaXMub2pOb2RlLmZpbmFsaXplID0gZmluYWxpemU7XG4gICAgICBmaW5hbGl6ZSh0aGlzLm9qTm9kZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm9qTm9kZTtcbiAgfTtcblxuICByZXR1cm4gTm9kZUZhY3Rvcnk7XG5cbn0pKCk7XG5cbmRlZmF1bHRDcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24ocGFyZW50LCB0YWcsIG9wdGlvbnMpIHtcbiAgdmFyIGtleSwgbmV3RWxlbWVudCwgcmVmLCByZWYxLCByZWYyLCB2YWx1ZTtcbiAgbmV3RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbiAgaWYgKG9wdGlvbnMpIHtcbiAgICByZWYgPSBvcHRpb25zLnByb3BzO1xuICAgIGZvciAoa2V5IGluIHJlZikge1xuICAgICAgdmFsdWUgPSByZWZba2V5XTtcbiAgICAgIG5ld0VsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICByZWYxID0gb3B0aW9ucy5ldmVudHM7XG4gICAgZm9yIChrZXkgaW4gcmVmMSkge1xuICAgICAgdmFsdWUgPSByZWYxW2tleV07XG4gICAgICAkKG5ld0VsZW1lbnQpLm9uKGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICByZWYyID0gb3B0aW9ucy5zdHlsZXM7XG4gICAgZm9yIChrZXkgaW4gcmVmMikge1xuICAgICAgdmFsdWUgPSByZWYyW2tleV07XG4gICAgICAkKG5ld0VsZW1lbnQpLmNzcyhrZXksIHZhbHVlKTtcbiAgICB9XG4gICAgdmFsdWUgPSBvcHRpb25zLnRleHQ7XG4gICAgaWYgKHZhbHVlICE9PSB2b2lkIDApIHtcbiAgICAgICQobmV3RWxlbWVudCkudGV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXJlbnQgIT0gbnVsbCA/IHBhcmVudC5hcHBlbmRDaGlsZChuZXdFbGVtZW50KSA6IHZvaWQgMDtcbn07XG5cbmdldE5vZGVGcm9tRmFjdG9yeSA9IGZ1bmN0aW9uKHRhZywgb3B0aW9ucywgb3duZXIsIGlzQ2FsbGVkRnJvbUZhY3RvcnksIG5vZGUpIHtcbiAgdmFyIG5ld09KTm9kZTtcbiAgbmV3T0pOb2RlID0gbmV3IE5vZGUoKTtcbiAgaWYgKCF3aW5kb3cub2pDcmVhdGVFbGVtZW50KSB7XG4gICAgd2luZG93Lm9qQ3JlYXRlRWxlbWVudCA9IGRlZmF1bHRDcmVhdGVFbGVtZW50O1xuICB9XG4gIG5ld09KTm9kZS5lbGVtZW50ID0gb2pDcmVhdGVFbGVtZW50KG93bmVyLmVsZW1lbnQsIHRhZyB8fCAnZGl2Jywgb3B0aW9ucyk7XG4gIHJldHVybiBuZXdPSk5vZGU7XG59O1xuXG5PSi5yZWdpc3Rlcignbm9kZUZhY3RvcnknLCBnZXROb2RlRnJvbUZhY3RvcnkpO1xuXG5tYWtlID0gZnVuY3Rpb24odGFnLCBvcHRpb25zKSB7XG4gIHZhciBuZXdPSk5vZGU7XG4gIG5ld09KTm9kZSA9IG5ldyBOb2RlKCk7XG4gIG5ld09KTm9kZS5lbGVtZW50ID0gb2pDcmVhdGVFbGVtZW50KG51bGwsIHRhZyB8fCAnZGl2Jywgb3B0aW9ucyk7XG4gIHJldHVybiBuZXdPSk5vZGU7XG59O1xuXG5PSi5yZWdpc3RlcignbWFrZScsIG1ha2UpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5vZGVGcm9tRmFjdG9yeTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltUTZYRnhIYVhSb2RXSmNYRzlxWEZ4emNtTmNYR052Wm1abFpWeGNaRzl0WEZ4dWIyUmxSbUZqZEc5eWVTNWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWp0QlFVRkJMRWxCUVVFc2FVWkJRVUU3UlVGQlFUczdRVUZCUVN4RlFVRkJMRWRCUVVzc1QwRkJRU3hEUVVGUkxFOUJRVkk3TzBGQlEwd3NRMEZCUVN4SFFVRkpMRTlCUVVFc1EwRkJVU3hSUVVGU096dEJRVU5LTEU5QlFVRXNSMEZCVlN4UFFVRkJMRU5CUVZFc1UwRkJVanM3UVVGRFZpeEpRVUZCTEVkQlFVOHNUMEZCUVN4RFFVRlJMRkZCUVZJN08wRkJLMFZFTzNkQ1FVVktMRTFCUVVFc1IwRkJVVHM3UlVGRlVpeFhRVUZETEVOQlFVRXNSMEZCUkN4SFFVRk5MRk5CUVVNc1JVRkJSQ3hGUVVGTExFOUJRVXc3UVVGRFNpeFJRVUZCT3p0TlFVUlRMRlZCUVZVN08wbEJRMjVDTEVkQlFVRXNSMEZCVFR0SlFVTk9MRVZCUVVFc1IwRkJTeXhSUVVGUkxFTkJRVU1zWTBGQlZDeERRVUYzUWl4RlFVRjRRanRKUVVOTUxFbEJRVWNzUlVGQlNEdE5RVU5GTEUxQlFVRXNSMEZCVXl4RlFVRkZMRU5CUVVNc1kwRkJTQ3hEUVVGclFpeEZRVUZzUWl4RlFVRnpRaXhQUVVGMFFpeEZRVVJZT3p0SlFVVkJMRWxCUVVjc1RVRkJTRHROUVVORkxFZEJRVUVzUjBGQlZTeEpRVUZCTEZkQlFVRXNRMEZCV1N4SlFVRmFMRVZCUVd0Q0xFbEJRV3hDTEVWQlFYZENMRWxCUVhoQ0xFVkJRVGhDTEV0QlFUbENMRVZCUVhGRExFMUJRWEpETEVWQlJGbzdPMWRCUjBFN1JVRlNTVHM3ZDBKQlZVNHNVVUZCUVN4SFFVRlZMRk5CUVVNc1QwRkJSQ3hGUVVGVkxFdEJRVlk3VjBGRFVpeERRVUZCTEZOQlFVRXNTMEZCUVR0aFFVRkJMRk5CUVVNc1NVRkJSRHRCUVVORkxGbEJRVUU3VVVGQlFTeE5RVUZCTEVkQlFWTXNSVUZCUlN4RFFVRkRMRXRCUVUwc1EwRkJRU3hQUVVGQkxFTkJRVlFzU1VGQmNVSXNSVUZCUlN4RFFVRkRMRlZCUVZjc1EwRkJRU3hQUVVGQkxFTkJRVzVETEVsQlFTdERMRVZCUVVVc1EwRkJReXhSUVVGVExFTkJRVUVzVDBGQlFTeERRVUV6UkN4SlFVRjFSU3hGUVVGRkxFTkJRVU1zVFVGQlR5eERRVUZCTEU5QlFVRTdVVUZETVVZc1NVRkJSeXhOUVVGSU8xVkJRMFVzUlVGQlFTeEhRVUZMTEUxQlFVRXNRMEZCVHl4SlFVRlFMRVZCUVdFc1MwRkJReXhEUVVGQkxFMUJRV1FzUlVGRVVEdFRRVUZCTEUxQlFVRTdWVUZIUlN4RlFVRkJMRWRCUVVzc1JVRkJSU3hEUVVGRExGTkJRVWdzUTBGQllTeEpRVUZpTEVWQlFXMUNMRXRCUVVNc1EwRkJRU3hOUVVGd1FpeEZRVUUwUWl4UFFVRTFRaXhGUVVoUU96dGxRVXRCTzAxQlVFWTdTVUZCUVN4RFFVRkJMRU5CUVVFc1EwRkJRU3hKUVVGQk8wVkJSRkU3TzNkQ1FWVldMR0ZCUVVFc1IwRkJaU3hUUVVGRExFdEJRVVE3UVVGRFlpeFJRVUZCTzBsQlFVRXNTVUZCUnl4RlFVRkZMRU5CUVVNc2JVSkJRVTQ3VFVGRFJTeExRVUZCTEVsQlFWTTdUVUZEVkN4SlFVRkhMRXRCUVVFc1NVRkJVeXhKUVVGRExFTkJRVUVzUzBGQlN5eERRVUZETEV0QlFXNUNPMUZCUVRoQ0xFdEJRVUVzUjBGQlVTeEpRVUZETEVOQlFVRXNTMEZCU3l4RFFVRkRMRXRCUVZBc1IwRkJaU3hGUVVGeVJEczdUVUZEUVN4SlFVRkRMRU5CUVVFc1MwRkJTeXhEUVVGRExFdEJRVkFzUjBGQlpUdE5RVVZtTEVsQlFVY3NRMEZCU1N4SlFVRkRMRU5CUVVFc1RVRkJUU3hEUVVGRExFdEJRVklzUTBGQlFTeERRVUZRTzFGQlEwVXNSVUZCUVN4SFFVRkxMRWxCUVVNc1EwRkJRU3hMUVVGTExFTkJRVU1zUzBGQlVDeERRVUZCTEVOQlFVRXNTVUZCYTBJN1VVRkRka0lzUlVGQlFTeEpRVUZOTEVsQlFVTXNRMEZCUVN4TlFVRk5MRU5CUVVNc1QwRkJVaXhIUVVGclFqdFJRVU40UWl4SlFVRkRMRU5CUVVFc1RVRkJUU3hEUVVGRExFbEJRVklzUTBGQllTeEpRVUZpTEVWQlFXMUNMRVZCUVc1Q0xFVkJTRVk3VDBGTVJqczdSVUZFWVRzN2QwSkJXV1lzVjBGQlFTeEhRVUZoTEZOQlFVRTdTVUZEV0N4SlFVRkhMRWxCUVVNc1EwRkJRU3hOUVVGS08yRkJRV2RDTEVOQlFVTXNRMEZCUXl4TlFVRkdMRU5CUVZNc1NVRkJReXhEUVVGQkxFOUJRVThzUTBGQlF5eE5RVUZzUWl4RlFVRXdRaXhEUVVGQkxGTkJRVUVzUzBGQlFUdGxRVUZCTEZOQlFVTXNSMEZCUkN4RlFVRk5MRWRCUVU0N1FVRkRlRU1zWTBGQlFUdFZRVUZCTEZGQlFVRXNSMEZCVnl4UFFVRkJMRU5CUVZFc1lVRkJVanRWUVVOWUxFbEJRVWNzVVVGQlVTeERRVUZETEUxQlFWUXNRMEZCWjBJc1IwRkJhRUlzUTBGQlNEdFpRVU5GTEZGQlFVRXNSMEZCVnl4VFFVRkJPMEZCUVdNc2EwSkJRVUU3WTBGQllqdHhRa0ZCWVN4SFFVRkJMR0ZCUVVrc1MwRkJTanRaUVVGa08xbEJRMWdzUzBGQlF5eERRVUZCTEUxQlFVMHNRMEZCUXl4RFFVRkRMRU5CUVVNc1JVRkJWaXhEUVVGaExFZEJRV0lzUlVGQmEwSXNVVUZCYkVJN1dVRkRRU3hMUVVGRExFTkJRVUVzVFVGQlRTeERRVUZETEVkQlFWSXNRMEZCV1N4SFFVRmFMRVZCUVdsQ0xGRkJRV3BDTzIxQ1FVTkJMRXRCU2tZN08xRkJSbmRETzAxQlFVRXNRMEZCUVN4RFFVRkJMRU5CUVVFc1NVRkJRU3hEUVVFeFFpeEZRVUZvUWpzN1JVRkVWenM3UlVGVFFTeHhRa0ZCUXl4SlFVRkVMRVZCUVU4c1VVRkJVQ3hGUVVGcFFpeE5RVUZxUWl4RlFVRjVRaXhSUVVGNlFqdEpRVUZETEVsQlFVTXNRMEZCUVN4TlFVRkVPMGxCUVUwc1NVRkJReXhEUVVGQkxGVkJRVVE3U1VGQlZTeEpRVUZETEVOQlFVRXNVVUZCUkR0SlFVRlJMRWxCUVVNc1EwRkJRU3c0UWtGQlJDeFhRVUZaTzBsQlEyaEVMRWxCUVVjc1NVRkJReXhEUVVGQkxFZEJRVVFzU1VGQlV5eERRVUZKTEVsQlFVTXNRMEZCUVN4UlFVRnFRanROUVVORkxFbEJRVU1zUTBGQlFTeFJRVUZFTEVkQlFXZENMRWxCUVVFc1QwRkJRU3hEUVVGUkxFbEJRVU1zUTBGQlFTeEhRVUZVTEVWQlFXTXNTVUZCUXl4RFFVRkJMRTlCUVU4c1EwRkJReXhMUVVGMlFqdE5RVU5vUWl4SlFVRkRMRU5CUVVFc1VVRkJVU3hEUVVGRExFZEJRVllzUTBGQll5eFRRVUZrTEVWQlFYbENMRWxCUVVNc1EwRkJRU3hIUVVFeFFqdE5RVU5CTEVsQlFVTXNRMEZCUVN4UlFVRlJMRU5CUVVNc1IwRkJWaXhEUVVGakxFbEJRVU1zUTBGQlFTeFBRVUZQTEVOQlFVTXNUVUZCZGtJN1RVRkRRU3hKUVVGSExFbEJRVU1zUTBGQlFTeFBRVUZQTEVOQlFVTXNTVUZCV2p0UlFVRnpRaXhKUVVGRExFTkJRVUVzVVVGQlVTeERRVUZETEVsQlFWWXNRMEZCWlN4SlFVRkRMRU5CUVVFc1QwRkJUeXhEUVVGRExFbEJRWGhDTEVWQlFYUkNPMDlCU2tZN08wbEJUVUVzU1VGQlJ5eEpRVUZETEVOQlFVRXNTMEZCU2p0TlFVTkZMRWxCUVVNc1EwRkJRU3hKUVVGRUxFTkJRVUVzUlVGRVJqczdSVUZRVnpzN2QwSkJWV0lzWVVGQlFTeEhRVUZsTEZOQlFVTXNTMEZCUkR0QlFVTmlMRkZCUVVFN1NVRkJRU3hQUVVGQkxFZEJRVlVzUlVGQlJTeERRVUZETEUxQlFVZ3NRMEZCUVR0SlFVTldMRWxCUVVNc1EwRkJRU3hOUVVGTkxFTkJRVU1zU1VGQlVpeEhRVUZsTEVOQlFVRXNVMEZCUVN4TFFVRkJPMkZCUVVFc1UwRkJReXhQUVVGRUxFVkJRVlVzU1VGQlZqdEJRVU5pTEZsQlFVRTdVVUZCUVN4TlFVRkJMRWRCUVZNc1QwRkJVU3hEUVVGQkxFOUJRVUU3VVVGRGFrSXNTVUZCUnl4RFFVRkpMRTFCUVZBN1ZVRkRSU3hOUVVGQkxFZEJRVk1zUzBGQlF5eERRVUZCTEZGQlFVUXNRMEZCVlN4UFFVRldMRVZCUVcxQ0xFdEJRVU1zUTBGQlFTeE5RVUZ3UWl4RlFVRTBRaXhMUVVFMVFqdFZRVU5VTEU5QlFWRXNRMEZCUVN4UFFVRkJMRU5CUVZJc1IwRkJiVUlzVDBGR2NrSTdPMlZCUjBFc1RVRkJRU3hEUVVGUExFbEJRVkE3VFVGTVlUdEpRVUZCTEVOQlFVRXNRMEZCUVN4RFFVRkJMRWxCUVVFN1YwRk5aaXhKUVVGRExFTkJRVUU3UlVGU1dUczdkMEpCVldZc1NVRkJRU3hIUVVGTkxGTkJRVUU3UVVGRlNpeFJRVUZCTzBsQlFVRXNTVUZCUXl4RFFVRkJMRTFCUVVRc1IwRkJWVHRKUVVWV0xIVkRRVUZaTEVOQlFVVXNiMEpCUVdRN1RVRkJLMElzU1VGQlF5eERRVUZCTEUxQlFVUXNSMEZCVlN4SlFVRkRMRU5CUVVFc1UwRkJNVU03UzBGQlFTeE5RVUZCTzAxQlQwVXNTVUZCUXl4RFFVRkJMRTFCUVVRc1IwRkJZeXhKUVVGQkxFbEJRVUVzUTBGQlN5eEpRVUZETEVOQlFVRXNVVUZCVGl4RlFVRm5RaXhKUVVGRExFTkJRVUVzUzBGQmFrSTdUVUZEWkN4TFFVRkJMRWRCUVZFc1EwRkJReXhKUVVGRExFTkJRVUVzUzBGQlN5eERRVUZETEV0QlFWQXNSMEZCWlN4RFFVRm9RaXhEUVVGQkxFbEJRWE5DTzAxQlJ6bENMRWxCUVVjc1NVRkJReXhEUVVGQkxGRkJRVkVzUTBGQlF5eFBRVUZXTEV0QlFYVkNMRTFCUVhaQ0xFbEJRV3RETEVOQlFVa3NTVUZCUXl4RFFVRkJMRkZCUVZFc1EwRkJReXhQUVVGb1JDeEpRVUUwUkN4RFFVRkpMRWxCUVVNc1EwRkJRU3hOUVVGTkxFTkJRVU1zVDBGQk0wVTdVVUZEUlN4SlFVRkRMRU5CUVVFc1lVRkJSQ3hEUVVGbExFdEJRV1k3VVVGRFFTeEpRVUZETEVOQlFVRXNTMEZCU3l4RFFVRkRMRTFCUVZBc1EwRkJZeXhKUVVGRExFTkJRVUVzVFVGQlR5eERRVUZCTEVOQlFVRXNRMEZCZEVJN1VVRkZRU3hKUVVGRExFTkJRVUVzVjBGQlJDeERRVUZCTEVWQlNrWTdPMDFCVFVFc1NVRkJReXhEUVVGQkxGRkJRVkVzUTBGQlF5eFBRVUZXTEVkQlFXOUNPMDFCUTNCQ0xFbEJRVU1zUTBGQlFTeE5RVUZOTEVOQlFVTXNUMEZCVWl4SFFVRnJRanROUVVkc1FpeEpRVUZETEVOQlFVRXNZVUZCUkN4RFFVRmxMRXRCUVdZN1RVRkhRU3hKUVVGRExFTkJRVUVzVFVGQlRTeERRVUZETEZkQlFWSXNSMEZCYzBJN1RVRkhkRUlzVVVGQlFTeEhRVUZYTEVOQlFVTXNRMEZCUXl4SlFVRkdMRU5CUVU4c1NVRkJReXhEUVVGQkxFMUJRVTBzUTBGQlF5eFJRVUZTTEVsQlFXOUNMRVZCUVVVc1EwRkJReXhKUVVFNVFqdE5RVU5ZTEVsQlFVTXNRMEZCUVN4TlFVRk5MRU5CUVVNc1VVRkJVaXhIUVVGdFFqdE5RVU51UWl4UlFVRkJMRU5CUVZNc1NVRkJReXhEUVVGQkxFMUJRVllzUlVFM1FrWTdPMWRCSzBKQkxFbEJRVU1zUTBGQlFUdEZRVzVEUnpzN096czdPMEZCY1VOU0xHOUNRVUZCTEVkQlFYVkNMRk5CUVVNc1RVRkJSQ3hGUVVGVExFZEJRVlFzUlVGQll5eFBRVUZrTzBGQlEzSkNMRTFCUVVFN1JVRkJRU3hWUVVGQkxFZEJRV0VzVVVGQlVTeERRVUZETEdGQlFWUXNRMEZCZFVJc1IwRkJka0k3UlVGRFlpeEpRVUZITEU5QlFVZzdRVUZEUlR0QlFVRkJMRk5CUVVFc1ZVRkJRVHM3VFVGRFJTeFZRVUZWTEVOQlFVTXNXVUZCV0N4RFFVRjNRaXhIUVVGNFFpeEZRVUUyUWl4TFFVRTNRanRCUVVSR08wRkJSVUU3UVVGQlFTeFRRVUZCTEZkQlFVRTdPMDFCUTBVc1EwRkJRU3hEUVVGRkxGVkJRVVlzUTBGQllTeERRVUZETEVWQlFXUXNRMEZCYVVJc1IwRkJha0lzUlVGQmMwSXNTMEZCZEVJN1FVRkVSanRCUVVWQk8wRkJRVUVzVTBGQlFTeFhRVUZCT3p0TlFVTkZMRU5CUVVFc1EwRkJSU3hWUVVGR0xFTkJRV0VzUTBGQlF5eEhRVUZrTEVOQlFXdENMRWRCUVd4Q0xFVkJRWFZDTEV0QlFYWkNPMEZCUkVZN1NVRkZRU3hMUVVGQkxFZEJRVkVzVDBGQlR5eERRVUZETzBsQlEyaENMRWxCUVVjc1MwRkJRU3hMUVVGWExFMUJRV1E3VFVGRFJTeERRVUZCTEVOQlFVVXNWVUZCUml4RFFVRmhMRU5CUVVNc1NVRkJaQ3hEUVVGdFFpeExRVUZ1UWl4RlFVUkdPMHRCVWtZN096QkNRVlZCTEUxQlFVMHNRMEZCUlN4WFFVRlNMRU5CUVc5Q0xGVkJRWEJDTzBGQlduRkNPenRCUVdOMlFpeHJRa0ZCUVN4SFFVRnhRaXhUUVVGRExFZEJRVVFzUlVGQlRTeFBRVUZPTEVWQlFXVXNTMEZCWml4RlFVRnpRaXh0UWtGQmRFSXNSVUZCTWtNc1NVRkJNME03UVVGRGJrSXNUVUZCUVR0RlFVRkJMRk5CUVVFc1IwRkJaMElzU1VGQlFTeEpRVUZCTEVOQlFVRTdSVUZEYUVJc1NVRkJSeXhEUVVGRExFMUJRVTBzUTBGQlF5eGxRVUZZTzBsQlEwVXNUVUZCVFN4RFFVRkRMR1ZCUVZBc1IwRkJlVUlzY1VKQlJETkNPenRGUVVWQkxGTkJRVk1zUTBGQlF5eFBRVUZXTEVkQlFXOUNMR1ZCUVVFc1EwRkJaMElzUzBGQlN5eERRVUZETEU5QlFYUkNMRVZCUVN0Q0xFZEJRVUVzU1VGQlR5eExRVUYwUXl4RlFVRTJReXhQUVVFM1F6dFRRVU53UWp0QlFVeHRRanM3UVVGUGNrSXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3hoUVVGYUxFVkJRVEpDTEd0Q1FVRXpRanM3UVVGRlFTeEpRVUZCTEVkQlFVOHNVMEZCUXl4SFFVRkVMRVZCUVUwc1QwRkJUanRCUVVOTUxFMUJRVUU3UlVGQlFTeFRRVUZCTEVkQlFXZENMRWxCUVVFc1NVRkJRU3hEUVVGQk8wVkJRMmhDTEZOQlFWTXNRMEZCUXl4UFFVRldMRWRCUVc5Q0xHVkJRVUVzUTBGQlowSXNTVUZCYUVJc1JVRkJjMElzUjBGQlFTeEpRVUZQTEV0QlFUZENMRVZCUVc5RExFOUJRWEJETzFOQlEzQkNPMEZCU0VzN08wRkJTMUFzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4TlFVRmFMRVZCUVc5Q0xFbEJRWEJDT3p0QlFVbEJMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SlBTaUE5SUhKbGNYVnBjbVVnSnk0dUwyOXFKMXh5WEc1ZklEMGdjbVZ4ZFdseVpTQW5iRzlrWVhOb0oxeHlYRzVVYUdsdVJFOU5JRDBnY21WeGRXbHlaU0FuZEdocGJtUnZiU2RjY2x4dVRtOWtaU0E5SUhKbGNYVnBjbVVnSnk0dmJtOWtaU2RjY2x4dVhISmNiaU5qYkc5elpXUWdQU0FuWVNCaFltSnlJR0ZqY205dWVXMGdZV1JrY21WemN5QmhjSEJzWlhRZ1lYSjBhV05zWlNCaGMybGtaU0JoZFdScGJ5QmlJR0prYnlCaWFXY2dZbXh2WTJ0eGRXOTBaU0JpYjJSNUlHSjFkSFJ2YmlCallXNTJZWE1nWTJGd2RHbHZiaUJqWlc1MFpYSWdZMmwwWlNCamIyUmxJR052YkdkeWIzVndJR052YlcxaGJtUWdaR0YwWVd4cGMzUWdaR1FnWkdWc0lHUmxkR0ZwYkhNZ1pHWnVJR1JwY2lCa2FYWWdaR3dnWkhRZ1pXMGdaVzFpWldRZ1ptbGxiR1J6WlhRZ1ptbG5ZMkZ3ZEdsdmJpQm1hV2QxY21VZ1ptOXVkQ0JtYjI5MFpYSWdabTl5YlNCbWNtRnRaWE5sZENCb01TQm9NaUJvTXlCb05DQm9OU0JvTmlCb1pXRmtJR2hsWVdSbGNpQm9aM0p2ZFhBZ2FIUnRiQ0JwSUdsbWNtRnRaU0JwYm5NZ2EyVjVaMlZ1SUd0aVpDQnNZV0psYkNCc1pXZGxibVFnYkdrZ2JXRndJRzFoY21zZ2JXVnVkU0J0WlhSbGNpQnVZWFlnYm05bWNtRnRaWE1nYm05elkzSnBjSFFnYjJKcVpXTjBJRzlzSUc5d2RHZHliM1Z3SUc5d2RHbHZiaUJ2ZFhSd2RYUWdjQ0J3Y21VZ2NISnZaM0psYzNNZ2NTQnljQ0J5ZENCeWRXSjVJSE1nYzJGdGNDQnpZM0pwY0hRZ2MyVmpkR2x2YmlCelpXeGxZM1FnYzIxaGJHd2djMjkxY21ObElITndZVzRnYzNSeWFXdGxJSE4wY205dVp5QnpkSGxzWlNCemRXSWdjM1Z0YldGeWVTQnpkWEFnZEdGaWJHVWdkR0p2WkhrZ2RHUWdkR1Y0ZEdGeVpXRWdkR1p2YjNRZ2RHZ2dkR2hsWVdRZ2RHbHRaU0IwYVhSc1pTQjBjaUIwZENCMUlIVnNJSFpoY2lCMmFXUmxieUIzWW5JZ2VHMXdKeTV6Y0d4cGRDQW5JQ2RjY2x4dUkyOXdaVzRnUFNBbllYSmxZU0JpWVhObElHSnlJR052YkNCamIyMXRZVzVrSUdOemN5QWhSRTlEVkZsUVJTQmxiV0psWkNCb2NpQnBiV2NnYVc1d2RYUWdhMlY1WjJWdUlHeHBibXNnYldWMFlTQndZWEpoYlNCemIzVnlZMlVnZEhKaFkyc2dkMkp5Snk1emNHeHBkQ0FuSUNkY2NseHVJMXh5WEc0amJtVnpkR0ZpYkdWT2IyUmxUbUZ0WlhNZ1BTQmJYSEpjYmlNZ0lDZGthWFluWEhKY2JpTWdJQ2R6Y0dGdUoxeHlYRzRqSUNBbmFERW5YSEpjYmlNZ0lDZG9NaWRjY2x4dUl5QWdKMmd6SjF4eVhHNGpJQ0FuYURRblhISmNiaU1nSUNkb05TZGNjbHh1SXlBZ0oyZzJKMXh5WEc0aklDQW5jQ2RjY2x4dUl5QWdKMlpwWld4a2MyVjBKMXh5WEc0aklDQW5jMlZzWldOMEoxeHlYRzRqSUNBbmIyd25YSEpjYmlNZ0lDZDFiQ2RjY2x4dUl5QWdKM1JoWW14bEoxeHlYRzRqWFZ4eVhHNGpYSEpjYmlNalZHaHBjeUJzYVhOMElHbHpJRzV2ZENCNVpYUWdaWGhvWVhWemRHbDJaU3dnYW5WemRDQmxlR05zZFdSbElIUm9aU0J2WW5acGIzVnpYSEpjYmlOdWIyNU9aWE4wWVdKc1pVNXZaR1Z6SUQwZ1cxeHlYRzRqSUNBbmJHa25YSEpjYmlNZ0lDZHNaV2RsYm1RblhISmNiaU1nSUNkMGNpZGNjbHh1SXlBZ0ozUmtKMXh5WEc0aklDQW5iM0IwYVc5dUoxeHlYRzRqSUNBblltOWtlU2RjY2x4dUl5QWdKMmhsWVdRblhISmNiaU1nSUNkemIzVnlZMlVuWEhKY2JpTWdJQ2QwWW05a2VTZGNjbHh1SXlBZ0ozUm1iMjkwSjF4eVhHNGpJQ0FuZEdobFlXUW5YSEpjYmlNZ0lDZHNhVzVySjF4eVhHNGpJQ0FuYzJOeWFYQjBKMXh5WEc0alhWeHlYRzRqWEhKY2JpTnViMlJsVG1GdFpYTWdQU0JiWEhKY2JpTWdJQ2RoSjF4eVhHNGpJQ0FuWWlkY2NseHVJeUFnSjJKeUoxeHlYRzRqSUNBblluVjBkRzl1SjF4eVhHNGpJQ0FuWkdsMkoxeHlYRzRqSUNBblpXMG5YSEpjYmlNZ0lDZG1hV1ZzWkhObGRDZGNjbHh1SXlBZ0oyWnZjbTBuWEhKY2JpTWdJQ2RvTVNkY2NseHVJeUFnSjJneUoxeHlYRzRqSUNBbmFETW5YSEpjYmlNZ0lDZG9OQ2RjY2x4dUl5QWdKMmcxSjF4eVhHNGpJQ0FuYURZblhISmNiaU1nSUNkcEoxeHlYRzRqSUNBbmFXMW5KMXh5WEc0aklDQW5hVzV3ZFhRblhISmNiaU1nSUNkc1lXSmxiQ2RjY2x4dUl5QWdKMnhsWjJWdVpDZGNjbHh1SXlBZ0oyeHBKMXh5WEc0aklDQW5ibUYySjF4eVhHNGpJQ0FuYjJ3blhISmNiaU1nSUNkdmNIUnBiMjRuWEhKY2JpTWdJQ2R3SjF4eVhHNGpJQ0FuYzJWc1pXTjBKMXh5WEc0aklDQW5jM0JoYmlkY2NseHVJeUFnSjNOMGNtOXVaeWRjY2x4dUl5QWdKM04xY0NkY2NseHVJeUFnSjNOMlp5ZGNjbHh1SXlBZ0ozUmhZbXhsSjF4eVhHNGpJQ0FuZEdKdlpIa25YSEpjYmlNZ0lDZDBaQ2RjY2x4dUl5QWdKM1JsZUhSaGNtVmhKMXh5WEc0aklDQW5kR2duWEhKY2JpTWdJQ2QwYUdWaFpDZGNjbHh1SXlBZ0ozUnlKMXh5WEc0aklDQW5kV3duWEhKY2JpTmRYSEpjYmx4eVhHNWpiR0Z6Y3lCT2IyUmxSbUZqZEc5eWVWeHlYRzRnSUZ4eVhHNGdJRzlxVG05a1pUb2diblZzYkZ4eVhHNGdJRnh5WEc0Z0lFQm5aWFE2SUNocFpDd2dkR0ZuVG1GdFpTQTlJQ2RrYVhZbktTQXRQbHh5WEc0Z0lDQWdjbVYwSUQwZ2JuVnNiRnh5WEc0Z0lDQWdaV3dnUFNCa2IyTjFiV1Z1ZEM1blpYUkZiR1Z0Wlc1MFFubEpaQ0JwWkZ4eVhHNGdJQ0FnYVdZZ1pXeGNjbHh1SUNBZ0lDQWdkR2hwYmtWc0lEMGdUMG91Y21WemRHOXlaVVZzWlcxbGJuUWdaV3dzSUhSaFowNWhiV1ZjY2x4dUlDQWdJR2xtSUhSb2FXNUZiRnh5WEc0Z0lDQWdJQ0J5WlhRZ1BTQnVaWGNnVG05a1pVWmhZM1J2Y25rZ2JuVnNiQ3dnYm5Wc2JDd2diblZzYkN3Z1ptRnNjMlVzSUhSb2FXNUZiRnh5WEc1Y2NseHVJQ0FnSUhKbGRGeHlYRzRnSUZ4eVhHNGdJRjl0WVd0bFFXUmtPaUFvZEdGblRtRnRaU3dnWTI5MWJuUXBJQzArWEhKY2JpQWdJQ0FvYjNCMGN5a2dQVDVjY2x4dUlDQWdJQ0FnYldWMGFHOWtJRDBnVDBvdWJtOWtaWE5iZEdGblRtRnRaVjBnYjNJZ1Qwb3VZMjl0Y0c5dVpXNTBjMXQwWVdkT1lXMWxYU0J2Y2lCUFNpNWpiMjUwY205c2MxdDBZV2RPWVcxbFhTQnZjaUJQU2k1cGJuQjFkSE5iZEdGblRtRnRaVjFjY2x4dUlDQWdJQ0FnYVdZZ2JXVjBhRzlrWEhKY2JpQWdJQ0FnSUNBZ2JuVWdQU0J0WlhSb2IyUWdiM0IwY3l3Z1FHOXFUbTlrWlZ4eVhHNGdJQ0FnSUNCbGJITmxYSEpjYmlBZ0lDQWdJQ0FnYm5VZ1BTQlBTaTVqYjIxd2IyNWxiblFnYm5Wc2JDd2dRRzlxVG05a1pTd2dkR0ZuVG1GdFpWeHlYRzRnSUNBZ0lDQWpjbVYwSUQwZ2JtVjNJRTV2WkdWR1lXTjBiM0o1SUc1MUxDQkFkR2hwYms1dlpHVXNJR052ZFc1MFhISmNiaUFnSUNBZ0lHNTFYSEpjYmlBZ1hISmNiaUFnWDIxaGEyVlZibWx4ZFdWSlpEb2dLR052ZFc1MEtTQXRQbHh5WEc0Z0lDQWdhV1lnVDBvdVIwVk9SVkpCVkVWZlZVNUpVVlZGWDBsRVUxeHlYRzRnSUNBZ0lDQmpiM1Z1ZENBclBTQXhYSEpjYmlBZ0lDQWdJR2xtSUdOdmRXNTBJRHc5SUVCdmQyNWxjaTVqYjNWdWRDQjBhR1Z1SUdOdmRXNTBJRDBnUUc5M2JtVnlMbU52ZFc1MElDc2dNVnh5WEc0Z0lDQWdJQ0JBYjNkdVpYSXVZMjkxYm5RZ1BTQmpiM1Z1ZEZ4eVhHNWNjbHh1SUNBZ0lDQWdhV1lnYm05MElFQnZhazV2WkdVdVoyVjBTV1FvS1Z4eVhHNGdJQ0FnSUNBZ0lHbGtJRDBnUUc5M2JtVnlMbWRsZEVsa0tDa2diM0lnSnlkY2NseHVJQ0FnSUNBZ0lDQnBaQ0FyUFNCQWIycE9iMlJsTG5SaFowNWhiV1VnS3lCamIzVnVkRnh5WEc0Z0lDQWdJQ0FnSUVCdmFrNXZaR1V1WVhSMGNpQW5hV1FuTENCcFpGeHlYRzRnSUNBZ2NtVjBkWEp1WEhKY2JpQWdYSEpjYmlBZ1gySnBibVJGZG1WdWRITTZJQzArWEhKY2JpQWdJQ0JwWmlCQWIycE9iMlJsSUhSb1pXNGdYeTVtYjNKUGQyNGdRRzl3ZEdsdmJuTXVaWFpsYm5SekxDQW9kbUZzTENCclpYa3BJRDArWEhKY2JpQWdJQ0FnSUdselRXVjBhRzlrSUQwZ2NtVnhkV2x5WlNBbkxpNHZkRzl2YkhNdmFYTW5YSEpjYmlBZ0lDQWdJR2xtSUdselRXVjBhRzlrTG0xbGRHaHZaQ0IyWVd4Y2NseHVJQ0FnSUNBZ0lDQmpZV3hzWW1GamF5QTlJQ2hsZG1WdWRDNHVMaWtnTFQ0Z2RtRnNJR1YyWlc1MExpNHVYSEpjYmlBZ0lDQWdJQ0FnUUc5cVRtOWtaUzRrTG05dUlHdGxlU3dnWTJGc2JHSmhZMnRjY2x4dUlDQWdJQ0FnSUNCQWIycE9iMlJsTG1Ga1pDQnJaWGtzSUdOaGJHeGlZV05yWEhKY2JpQWdJQ0FnSUNBZ2JuVnNiRnh5WEc0Z0lGeHlYRzRnSUdOdmJuTjBjblZqZEc5eU9pQW9RSFJoWnl3Z1FHOXdkR2x2Ym5Nc0lFQnZkMjVsY2l3Z1FIUm9hVzVPYjJSbElEMGdiblZzYkNrZ0xUNWNjbHh1SUNBZ0lHbG1JRUIwWVdjZ1lXNWtJRzV2ZENCQWRHaHBiazV2WkdWY2NseHVJQ0FnSUNBZ1FIUm9hVzVPYjJSbElEMGdibVYzSUZSb2FXNUVUMDBnUUhSaFp5d2dRRzl3ZEdsdmJuTXVjSEp2Y0hOY2NseHVJQ0FnSUNBZ1FIUm9hVzVPYjJSbExtRmtaQ0FuZEdGblRtRnRaU2NzSUVCMFlXZGNjbHh1SUNBZ0lDQWdRSFJvYVc1T2IyUmxMbU56Y3lCQWIzQjBhVzl1Y3k1emRIbHNaWE5jY2x4dUlDQWdJQ0FnYVdZZ1FHOXdkR2x2Ym5NdWRHVjRkQ0IwYUdWdUlFQjBhR2x1VG05a1pTNTBaWGgwSUVCdmNIUnBiMjV6TG5SbGVIUmNjbHh1SUNBZ0lGeHlYRzRnSUNBZ2FXWWdRRzkzYm1WeVhISmNiaUFnSUNBZ0lFQnRZV3RsS0NsY2NseHVJQ0JjY2x4dUlDQmhaR1JOWVd0bFRXVjBhRzlrT2lBb1kyOTFiblFwSUMwK1hISmNiaUFnSUNCdFpYUm9iMlJ6SUQwZ1Qwb3ViMkpxWldOMEtDbGNjbHh1SUNBZ0lFQnZhazV2WkdVdWJXRnJaU0E5SUNoMFlXZE9ZVzFsTENCdmNIUnpLU0E5UGx4eVhHNGdJQ0FnSUNCdFpYUm9iMlFnUFNCdFpYUm9iMlJ6VzNSaFowNWhiV1ZkWEhKY2JpQWdJQ0FnSUdsbUlHNXZkQ0J0WlhSb2IyUmNjbHh1SUNBZ0lDQWdJQ0J0WlhSb2IyUWdQU0JBWDIxaGEyVkJaR1FnZEdGblRtRnRaU3dnUUc5cVRtOWtaU3dnWTI5MWJuUmNjbHh1SUNBZ0lDQWdJQ0J0WlhSb2IyUnpXM1JoWjA1aGJXVmRJRDBnYldWMGFHOWtYSEpjYmlBZ0lDQWdJRzFsZEdodlpDQnZjSFJ6WEhKY2JpQWdJQ0JBYjJwT2IyUmxYSEpjYmx4eVhHNGdJRzFoYTJVNklDMCtYSEpjYmx4eVhHNGdJQ0FnUUc5cVRtOWtaU0E5SUc1MWJHeGNjbHh1WEhKY2JpQWdJQ0JwWmlCQWRHaHBiazV2WkdVL0xtbHpSblZzYkhsSmJtbDBJSFJvWlc0Z1FHOXFUbTlrWlNBOUlFQjBhR2x1VG05a1pWeHlYRzRnSUZ4eVhHNGdJQ0FnSXlBeU9pQkpaaUIwYUdVZ1pXeGxiV1Z1ZENCb1lYTWdibVYyWlhJZ1ltVmxiaUJwYm1sMGFXRnNhWHBsWkN3Z1kyOXVkR2x1ZFdWY2NseHVJQ0FnSUdWc2MyVmNjbHh1SUNBZ0lDQWdJeUF6T2lCQmN5QnNiMjVuSUdGeklIUm9aU0JsYkdWdFpXNTBJR2x6YmlkMElIUm9aU0JpYjJSNUlHNXZaR1VzSUdOdmJuUnBiblZsWEhKY2JpQWdJQ0FnSUNNZ2FXWWdaV3d1ZEdGblRtRnRaU0JwYzI1MElDZGliMlI1SjF4eVhHNGdJQ0FnSUNBaklEUTZJRVY0ZEdWdVpDQjBhR1VnWld4bGJXVnVkQ0IzYVhSb0lITjBZVzVrWVhKa0lHcFJkV1Z5ZVNCQlVFa2diV1YwYUc5a2MxeHlYRzRnSUNBZ0lDQkFiMnBPYjJSbElEMGdibVYzSUU1dlpHVWdRSFJvYVc1T2IyUmxMQ0JBYjNkdVpYSmNjbHh1SUNBZ0lDQWdZMjkxYm5RZ1BTQW9RRzkzYm1WeUxtTnZkVzUwSUNzZ01Ta2dmSHdnTVZ4eVhHNGdJQ0FnSUNBaklEVTZJRWxtSUhSb1pTQnViMlJsSUdsemJpZDBJR2x1SUhSb1pTQkVUMDBzSUdGd2NHVnVaQ0JwZENCMGJ5QjBhR1VnY0dGeVpXNTBYSEpjYmlBZ0lDQWdJQ01nVkdocGN5QmhiSE52SUdGalkyOXRiVzlrWVhSbGN5QmtiMk4xYldWdWRDQm1jbUZuYldWdWRITXNJSGRvYVdOb0lHRnlaU0J1YjNRZ2FXNGdkR2hsSUVSUFRTQmlkWFFnWVhKbElIQnlaWE4xYldWa0lIUnZJR0psSUhOdmRXNWtJSFZ1ZEdsc0lISmxZV1I1SUdadmNpQnRZVzUxWVd3Z2FXNXpaWEowYVc5dVhISmNiaUFnSUNBZ0lHbG1JRUIwYUdsdVRtOWtaUzUwWVdkT1lXMWxJR2x6Ym5RZ0oySnZaSGtuSUdGdVpDQnViM1FnUUhSb2FXNU9iMlJsTG1selNXNUVUMDBnWVc1a0lHNXZkQ0JBYjJwT2IyUmxMbWx6U1c1RVQwMWNjbHh1SUNBZ0lDQWdJQ0JBWDIxaGEyVlZibWx4ZFdWSlpDQmpiM1Z1ZEZ4eVhHNGdJQ0FnSUNBZ0lFQnZkMjVsY2k1aGNIQmxibVFnUUc5cVRtOWtaVnN3WFZ4eVhHNGdJQ0FnSUNBZ0lDTWdOam9nUW1sdVpDQmhibmtnWkdWbWFXNWxaQ0JsZG1WdWRITWdZV1owWlhJZ2RHaGxJRzV2WkdVZ2FYTWdhVzRnZEdobElFUlBUVnh5WEc0Z0lDQWdJQ0FnSUVCZlltbHVaRVYyWlc1MGN5Z3BYSEpjYmlBZ0lDQWdJQ0FnWEhKY2JpQWdJQ0FnSUVCMGFHbHVUbTlrWlM1cGMwbHVSRTlOSUQwZ2RISjFaVnh5WEc0Z0lDQWdJQ0JBYjJwT2IyUmxMbWx6U1c1RVQwMGdQU0IwY25WbFhISmNibHh5WEc0Z0lDQWdJQ0FqSURjNklFTnlaV0YwWlNCMGFHVWdZV3hzSUdsdGNHOXlkR0Z1ZENBbmJXRnJaU2NnYldWMGFHOWtYSEpjYmlBZ0lDQWdJRUJoWkdSTllXdGxUV1YwYUc5a0lHTnZkVzUwWEhKY2JseHlYRzRnSUNBZ0lDQWpJRGc2SUZCeVpYWmxiblFnWkhWd2JHbGpZWFJsSUdaaFkzUnZjbmtnWlhoMFpXNXphVzl1SUdKNUlITmxkSFJwYm1jZ2FYTWdhVzVwZENBOUlIUnlkV1ZjY2x4dUlDQWdJQ0FnUUc5cVRtOWtaUzVwYzBaMWJHeDVTVzVwZENBOUlIUnlkV1ZjY2x4dVhISmNiaUFnSUNBZ0lDTWdPVG9nYVdZZ2RHaGxJRzV2WkdVZ2MzVndjRzl5ZEhNZ2FYUXNJR05oYkd3Z1ptbHVZV3hwZW1WY2NseHVJQ0FnSUNBZ1ptbHVZV3hwZW1VZ1BTQmZMbTl1WTJVZ1FHOXFUbTlrWlM1bWFXNWhiR2w2WlNCdmNpQlBTaTV1YjI5d1hISmNiaUFnSUNBZ0lFQnZhazV2WkdVdVptbHVZV3hwZW1VZ1BTQm1hVzVoYkdsNlpWeHlYRzRnSUNBZ0lDQm1hVzVoYkdsNlpTQkFiMnBPYjJSbFhISmNiaUFnSUNBaklERXdPaUJTWlhSMWNtNGdkR2hsSUdWNGRHVnVaR1ZrSUdWc1pXMWxiblJjY2x4dUlDQWdJRUJ2YWs1dlpHVmNjbHh1WEhKY2JtUmxabUYxYkhSRGNtVmhkR1ZGYkdWdFpXNTBJRDBnS0hCaGNtVnVkQ3dnZEdGbkxDQnZjSFJwYjI1ektTQXRQbHh5WEc0Z0lHNWxkMFZzWlcxbGJuUWdQU0JrYjJOMWJXVnVkQzVqY21WaGRHVkZiR1Z0Wlc1MElIUmhaMXh5WEc0Z0lHbG1JRzl3ZEdsdmJuTmNjbHh1SUNBZ0lHWnZjaUJyWlhrc0lIWmhiSFZsSUc5bUlHOXdkR2x2Ym5NdWNISnZjSE5jY2x4dUlDQWdJQ0FnYm1WM1JXeGxiV1Z1ZEM1elpYUkJkSFJ5YVdKMWRHVW9hMlY1TENCMllXeDFaU2xjY2x4dUlDQWdJR1p2Y2lCclpYa3NJSFpoYkhWbElHOW1JRzl3ZEdsdmJuTXVaWFpsYm5SelhISmNiaUFnSUNBZ0lDUW9ibVYzUld4bGJXVnVkQ2t1YjI0b2EyVjVMQ0IyWVd4MVpTbGNjbHh1SUNBZ0lHWnZjaUJyWlhrc0lIWmhiSFZsSUc5bUlHOXdkR2x2Ym5NdWMzUjViR1Z6WEhKY2JpQWdJQ0FnSUNRb2JtVjNSV3hsYldWdWRDa3VZM056S0d0bGVTd2dkbUZzZFdVcFhISmNiaUFnSUNCMllXeDFaU0E5SUc5d2RHbHZibk11ZEdWNGRGeHlYRzRnSUNBZ2FXWWdkbUZzZFdVZ2FYTnVkQ0IxYm1SbFptbHVaV1JjY2x4dUlDQWdJQ0FnSkNodVpYZEZiR1Z0Wlc1MEtTNTBaWGgwS0haaGJIVmxLVnh5WEc0Z0lIQmhjbVZ1ZEQ4dVlYQndaVzVrUTJocGJHUW9ibVYzUld4bGJXVnVkQ2xjY2x4dVhISmNibWRsZEU1dlpHVkdjbTl0Um1GamRHOXllU0E5SUNoMFlXY3NJRzl3ZEdsdmJuTXNJRzkzYm1WeUxDQnBjME5oYkd4bFpFWnliMjFHWVdOMGIzSjVMQ0J1YjJSbEtTQXRQbHh5WEc0Z0lHNWxkMDlLVG05a1pTQTlJRzVsZHlCT2IyUmxLQ2xjY2x4dUlDQnBaaUFoZDJsdVpHOTNMbTlxUTNKbFlYUmxSV3hsYldWdWRGeHlYRzRnSUNBZ2QybHVaRzkzTG05cVEzSmxZWFJsUld4bGJXVnVkQ0E5SUdSbFptRjFiSFJEY21WaGRHVkZiR1Z0Wlc1MFhISmNiaUFnYm1WM1QwcE9iMlJsTG1Wc1pXMWxiblFnUFNCdmFrTnlaV0YwWlVWc1pXMWxiblFvYjNkdVpYSXVaV3hsYldWdWRDd2dkR0ZuSUh4OElDZGthWFluTENCdmNIUnBiMjV6S1Z4eVhHNGdJRzVsZDA5S1RtOWtaVnh5WEc1Y2NseHVUMG91Y21WbmFYTjBaWElnSjI1dlpHVkdZV04wYjNKNUp5d2daMlYwVG05a1pVWnliMjFHWVdOMGIzSjVYSEpjYmx4eVhHNXRZV3RsSUQwZ0tIUmhaeXdnYjNCMGFXOXVjeWtnTFQ1Y2NseHVJQ0J1WlhkUFNrNXZaR1VnUFNCdVpYY2dUbTlrWlNncFhISmNiaUFnYm1WM1QwcE9iMlJsTG1Wc1pXMWxiblFnUFNCdmFrTnlaV0YwWlVWc1pXMWxiblFvYm5Wc2JDd2dkR0ZuSUh4OElDZGthWFluTENCdmNIUnBiMjV6S1Z4eVhHNGdJRzVsZDA5S1RtOWtaVnh5WEc1Y2NseHVUMG91Y21WbmFYTjBaWElnSjIxaGEyVW5MQ0J0WVd0bFhISmNibHh5WEc1Y2NseHVYSEpjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnWjJWMFRtOWtaVVp5YjIxR1lXTjBiM0o1WEhKY2JpSmRmUT09IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgYVxyXG5ub2RlTmFtZSA9ICdhJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBpZDogJydcclxuICAgICAgY2xhc3M6ICcnXHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICAgIGhyZWY6ICdqYXZhU2NyaXB0OnZvaWQoMCk7J1xyXG4gICAgICB0eXBlOiAnJ1xyXG4gICAgICB0aXRsZTogJydcclxuICAgICAgcmVsOiAnJ1xyXG4gICAgICBtZWRpYTogJydcclxuICAgICAgdGFyZ2V0OiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHRvZ2dsZVN0YXRlID0gJ29mZidcclxuXHJcbiAgdG9nZ2xlID0gLT5cclxuICAgIGlmIHRvZ2dsZVN0YXRlIGlzICdvbidcclxuICAgICAgdG9nZ2xlU3RhdGUgPSAnb2ZmJ1xyXG4gICAgZWxzZSB0b2dnbGVTdGF0ZSA9ICdvbicgIGlmIHRvZ2dsZVN0YXRlIGlzICdvZmYnXHJcbiAgICByZXR1cm5cclxuXHJcbiAgIyBDbGljayBiaW5kaW5nXHJcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICB0b2dnbGUoKVxyXG4gICAgICByZXRWYWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICBpZiBkZWZhdWx0cy5ocmVmIGlzICcjJyB0aGVuIHJldFZhbCA9IGZhbHNlXHJcbiAgICAgIHJldFZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuICBlbHNlXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSB0b2dnbGVcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcclxuXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxudG8gPSByZXF1aXJlICcuLi90b29scy90bydcclxuIyAjIGJyXHJcblxyXG5ub2RlTmFtZSA9ICdicidcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczoge31cclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIG51bWJlcjogMVxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICBpID0gMFxyXG4gIHdoaWxlIGkgPCB0by5udW1iZXIgZGVmYXVsdHMubnVtYmVyXHJcbiAgICAjIEluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGJycywgaXQgaXMgZGVzaXJhYmxlIHRvIG9ubHkgZ2V0IHRoZSBsYXN0IG9uZSBvdXRcclxuICAgIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gICAgaSArPSAxXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBmb3JtXHJcblxyXG5ub2RlTmFtZSA9ICdmb3JtJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBhY3Rpb246ICcnXHJcbiAgICAgIG1ldGhvZDogJydcclxuICAgICAgbmFtZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0LmFkZCAndmFsaWRhdG9yJywgcmV0LiQudmFsaWRhdGUoXHJcbiAgICBoaWdobGlnaHQ6IChlbGVtZW50KSAtPlxyXG4gICAgICAkZWxtID0gJChlbGVtZW50KVxyXG4gICAgICAkZWxtLmF0dHIgJ09KX2ludmFsaWQnLCAnMSdcclxuICAgICAgJGVsbS5hbmltYXRlIGJhY2tncm91bmRDb2xvcjogJ3JlZCdcclxuICAgICAgbnVsbFxyXG5cclxuICAgIHVuaGlnaGxpZ2h0OiAoZWxlbWVudCkgLT5cclxuICAgICAgJGVsbSA9ICQoZWxlbWVudClcclxuICAgICAgaWYgJGVsbS5hdHRyKCdPSl9pbnZhbGlkJykgaXMgJzEnXHJcbiAgICAgICAgJGVsbS5jc3MgJ2JhY2tncm91bmQtY29sb3InLCAneWVsbG93J1xyXG4gICAgICAgICRlbG0uYXR0ciAnT0pfaW52YWxpZCcsICcwJ1xyXG4gICAgICAgIHNldFRpbWVvdXQgKC0+XHJcbiAgICAgICAgICAkZWxtLmFuaW1hdGUgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXHJcbiAgICAgICAgKSwgNTAwXHJcbiAgICAgIG51bGxcclxuICApXHJcblxyXG4gIHJldC5hZGQgJ2lzRm9ybVZhbGlkJywgLT5cclxuICAgIHJldC4kLnZhbGlkKCkgYW5kIChub3QgcmV0LnZhbGlkYXRvci5pbnZhbGlkRWxlbWVudHMoKSBvciByZXQudmFsaWRhdG9yLmludmFsaWRFbGVtZW50cygpLmxlbmd0aCBpcyAwKVxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG5cclxuXHJcblxyXG5cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXHJcblxyXG4jICMgaW5wdXRcclxuXHJcbm5vZGVOYW1lID0gJ2lucHV0J1xyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6ICd0ZXh0J1xyXG4gICAgICB2YWx1ZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcbiAgICAgIGZvY3Vzb3V0OiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICBpZiBub3QgZGVmYXVsdHMucHJvcHMudHlwZSBvciBub3QgZW51bXMuaW5wdXRUeXBlc1tkZWZhdWx0cy5wcm9wcy50eXBlXVxyXG4gICAgdGhyb3cgbmV3IEVycm9yICdObyBtYXRjaGluZyBpbnB1dCB0eXBlIGZvciB7JyArIGRlZmF1bHRzLnByb3BzLnR5cGUgKyAnfSBjb3VsZCBiZSBmb3VuZC4nXHJcbiAgdGhpc1R5cGUgPSBlbnVtcy5pbnB1dFR5cGVzW2RlZmF1bHRzLnByb3BzLnR5cGVdXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICBzd2l0Y2ggdGhpc1R5cGVcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLmNoZWNrYm94XHJcbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LiQuaXMgJzpjaGVja2VkJ1xyXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMucmFkaW9cclxuICAgICAgICByZXQudmFsdWUgPSByZXQuJC5maW5kKCc6Y2hlY2tlZCcpLnZhbCgpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXQudmFsdWUgPSByZXQudmFsKClcclxuICAgIGRlZmF1bHRzLnByb3BzLnZhbHVlID0gcmV0LnZhbHVlICAgIFxyXG4gICAgcmV0LnZhbHVlXHJcblxyXG4gICMjI1xyXG4gICAgQ2xpY2sgYmluZGluZy4gSWYgdGhlIGNhbGxlciBkZWZpbmVkIGEgY2xpY2sgaGFuZGxlcixcclxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcclxuICAgIHRoZW4gY2FsbCB0aGUgZGVmaW5lZCBjbGljayBoYW5kbGVyIHdpdGggdGhlIGxhdGVzdCB2YWx1ZS5cclxuICAjIyNcclxuICBvbGRDbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gIGlmIG9sZENsaWNrIGFuZCBvbGRDbGljayBpc250IE9KLm5vb3BcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICBvbGRDbGljayByZXQudmFsdWUsIGV2ZW50Li4uXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSBuZXdDbGlja1xyXG5cclxuICAjIyNcclxuICAgIENoYW5nZSBiaW5kaW5nLiBJZiB0aGUgY2FsbGVyIGRlZmluZWQgYSBjaGFuZ2UgaGFuZGxlcixcclxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcclxuICAgIHRoZW4gY2FsbCB0aGUgZGVmaW5lZCBjaGFuZ2UgaGFuZGxlciB3aXRoIHRoZSBsYXRlc3QgdmFsdWUuXHJcbiAgIyMjXHJcbiAgb2xkQ2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gIGlmIG9sZENoYW5nZSBhbmQgb2xkQ2hhbmdlIGlzbnQgT0oubm9vcFxyXG4gICAgbmV3Q2hhbmdlID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICBvbGRDaGFuZ2UgcmV0LnZhbHVlLCBldmVudC4uLlxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSA9IG5ld0NoYW5nZVxyXG5cclxuICAjIyNcclxuICAgIE9uIEZvY3VzIE91dCBiaW5kaW5nLiBBbHdheXMgdXNlIHRoZSBldmVudCB0byB1cGRhdGUgdGhlIGludGVybmFsXHJcbiAgICB2YWx1ZSBvZiB0aGUgY29udHJvbDsgYW5kIGlmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGZvY3Vzb3V0IGV2ZW50LFxyXG4gICAgd3JhcCBpdCBhbmQgaW52b2tlIGl0IHdpdGggdGhlIGxhdGVzdCB2YWx1ZVxyXG4gICMjI1xyXG4gIG9sZEZvY3Vzb3V0ID0gZGVmYXVsdHMuZXZlbnRzLmZvY3Vzb3V0XHJcbiAgbmV3Rm9jdXNvdXQgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICBzeW5jVmFsdWUoKVxyXG4gICAgaWYgb2xkRm9jdXNvdXQgYW5kIG9sZEZvY3Vzb3V0IGlzbnQgT0oubm9vcFxyXG4gICAgICBvbGRGb2N1c291dCByZXQudmFsdWUsIGV2ZW50Li4uXHJcblxyXG4gIGRlZmF1bHRzLmV2ZW50cy5mb2N1c291dCA9IG5ld0ZvY3Vzb3V0XHJcblxyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG4gIHJldC52YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBvbFxyXG5cclxubm9kZU5hbWUgPSAnb2wnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIHNlbGVjdFxyXG5cclxubm9kZU5hbWUgPSAnc2VsZWN0J1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHNlbGVjdGVkOiAnJ1xyXG4gICAgICBtdWx0aXBsZTogZmFsc2VcclxuICAgIHN0eWxlczoge31cclxuICAgIHZhbHVlczogW11cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICB2YWx1ZSA9ICcnXHJcbiAgdmFsdWVzID0gW11cclxuICBoYXNFbXB0eSA9IGZhbHNlXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICB2YWx1ZSA9IHJldC52YWwoKVxyXG5cclxuICAjIENsaWNrIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIHJldHZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuXHJcbiAgIyBDaGFuZ2UgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICBjaGFuZ2UgPSBkZWZhdWx0cy5ldmVudHMuY2hhbmdlXHJcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0LmFkZCAnc2VsZWN0ZWREYXRhJywgKHByb3BOYW1lKSAtPlxyXG4gICAgcmV0ID0gJydcclxuICAgIGlmIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpIGFuZCByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVswXVxyXG4gICAgICBkYXRhc2V0ID0gcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0uZGF0YXNldFxyXG4gICAgICByZXQgPSBkYXRhc2V0W3Byb3BOYW1lXSAgaWYgZGF0YXNldFxyXG4gICAgcmV0XHJcblxyXG4gIHJldC5hZGQgJ3NlbGVjdGVkVGV4dCcsIC0+XHJcbiAgICByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS50ZXh0KClcclxuXHJcbiAgcmV0LmFkZCAnc2VsZWN0ZWRWYWwnLCAtPlxyXG4gICAgdmFsdWUgPSByZXQudmFsKClcclxuICAgIHZhbHVlXHJcblxyXG4gIHJldC5hZGQgJ2FkZE9wdGlvbicsICh2YWx1ZSwgdGV4dCA9IHZhbHVlLCBzZWxlY3RlZCA9IGZhbHNlLCBkaXNhYmxlZCA9IGZhbHNlKSAtPlxyXG4gICAgaXNFbXB0eSA9IF8uaXNFbXB0eSB2YWx1ZVxyXG4gICAgYWRkID0gZmFsc2VcclxuICAgIGlmIGlzRW1wdHkgYW5kIGZhbHNlIGlzIGhhc0VtcHR5XHJcbiAgICAgIGhhc0VtcHR5ID0gdHJ1ZVxyXG4gICAgICBhZGQgPSB0cnVlXHJcbiAgICBpZiBmYWxzZSBpcyBhZGQgYW5kIGZhbHNlIGlzIGlzRW1wdHkgdGhlbiBhZGQgPSB0cnVlXHJcbiAgICBpZiBhZGRcclxuICAgICAgdmFsID1cclxuICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgcHJvcHM6XHJcbiAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgaWYgc2VsZWN0ZWRcclxuICAgICAgICB2YWwuc2VsZWN0ZWQgPSBzZWxlY3RlZFxyXG4gICAgICBpZiBkaXNhYmxlZFxyXG4gICAgICAgIHZhbC5kaXNhYmxlZCA9IGRpc2FibGVkXHJcbiAgICAgIG9wdGlvbiA9IHJldC5tYWtlICdvcHRpb24nLCB2YWxcclxuICAgICAgb3B0aW9uXHJcblxyXG4gIHJldC5hZGQgJ2FkZE9wdGlvbnMnLCAob3B0aW9ucykgLT5cclxuICAgIHZhbHVlcyA9IF8udW5pb24gdmFsdWVzLCBvcHRpb25zXHJcbiAgICBPSi5lYWNoIG9wdGlvbnMsICgodmFsKSAtPlxyXG4gICAgICB2YWx1ZSA9IHJldC5hZGRPcHRpb24odmFsKVxyXG4gICAgICB2YWx1ZXMucHVzaCB2YWx1ZVxyXG4gICAgKSwgZmFsc2VcclxuICAgIHZhbHVlc1xyXG5cclxuICByZXQuYWRkICdyZXNldE9wdGlvbnMnLCAodmFsdWVzKSAtPlxyXG4gICAgcmV0LmVtcHR5KClcclxuICAgIHZhbHVlcyA9IHZhbHVlc1xyXG4gICAgcmV0LmFkZE9wdGlvbnMgdmFsdWVzXHJcbiAgICByZXRcclxuXHJcbiAgcmV0LmFkZCAncmVtb3ZlT3B0aW9uJywgKHZhbHVlVG9SZW1vdmUpIC0+XHJcbiAgICB2YWx1ZXMuc3BsaWNlIHZhbHVlcy5pbmRleE9mKHZhbHVlVG9SZW1vdmUpLCAxICNyZW1vdmVzIHRoZSBpdGVtIGZyb20gdGhlIGxpc3RcclxuICAgIHNlbGVjdENvbnRyb2wgPSByZXRbMF1cclxuICAgIGkgPSAwXHJcblxyXG4gICAgd2hpbGUgaSA8IHNlbGVjdENvbnRyb2wubGVuZ3RoXHJcbiAgICAgIHNlbGVjdENvbnRyb2wucmVtb3ZlIGkgIGlmIHNlbGVjdENvbnRyb2wub3B0aW9uc1tpXS52YWx1ZSBpcyB2YWx1ZVRvUmVtb3ZlXHJcbiAgICAgIGkrK1xyXG4gICAgbnVsbFxyXG5cclxuXHJcblxyXG4gIGlmIGRlZmF1bHRzLnZhbHVlcy5sZW5ndGggPiAwXHJcbiAgICByZXQuYWRkT3B0aW9ucyBkZWZhdWx0cy52YWx1ZXNcclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCwgSnNvblRvVGFibGUsIE9KLCBfLCBhcnJheTJELCBub2RlLCBub2RlRmFjdG9yeSwgbm9kZU5hbWU7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxubm9kZUZhY3RvcnkgPSByZXF1aXJlKCcuLi9kb20vbm9kZUZhY3RvcnknKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuYXJyYXkyRCA9IHJlcXVpcmUoJy4uL3Rvb2xzL2FycmF5MkQnKTtcblxuJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxuSnNvblRvVGFibGUgPSByZXF1aXJlKCcuLi90b29scy9Kc29uVG9UYWJsZScpO1xuXG5ub2RlTmFtZSA9ICd0YWJsZSc7XG5cblxuLypcbkNyZWF0ZSBhbiBIVE1MIHRhYmxlLiBQcm92aWRlcyBoZWxwZXIgbWV0aG9kcyB0byBjcmVhdGUgQ29sdW1ucyBhbmQgQ2VsbHMuXG4gKi9cblxubm9kZSA9IGZ1bmN0aW9uKG9wdGlvbnMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeSkge1xuICB2YXIgY2VsbHMsIGNvbHVtbkNvdW50LCBkZWZhdWx0cywgZmlsbE1pc3NpbmcsIGluaXQsIGxvYWRDZWxscywgcmV0LCByb3dzLCB0Ym9keSwgdGhlYWQsIHRoZWFkUm93O1xuICBpZiAob3duZXIgPT0gbnVsbCkge1xuICAgIG93bmVyID0gT0ouYm9keTtcbiAgfVxuICBpZiAoY2FsbGVkRnJvbUZhY3RvcnkgPT0gbnVsbCkge1xuICAgIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2U7XG4gIH1cbiAgZGVmYXVsdHMgPSB7XG4gICAgZGF0YTogbnVsbCxcbiAgICBwcm9wczoge1xuICAgICAgY2VsbHBhZGRpbmc6IDAsXG4gICAgICBjZWxsc3BhY2luZzogMCxcbiAgICAgIGFsaWduOiAnJyxcbiAgICAgIHdpZHRoOiAnJyxcbiAgICAgIGNlbGxhbGlnbjogJ2xlZnQnLFxuICAgICAgY2VsbHZhbGlnbjogJ3RvcCcsXG4gICAgICBcImNsYXNzXCI6ICcnXG4gICAgfSxcbiAgICBzdHlsZXM6IHt9LFxuICAgIGV2ZW50czoge30sXG4gICAgY2VsbHM6IHtcbiAgICAgIFwiY2xhc3NcIjogJycsXG4gICAgICBhbGlnbjogJycsXG4gICAgICAndmVydGljYWwtYWxpZ24nOiAnJyxcbiAgICAgIGNlbGxwYWRkaW5nOiAnJyxcbiAgICAgIG1hcmdpbjogJydcbiAgICB9LFxuICAgIHRoZWFkOiB7fSxcbiAgICB0Ym9keToge30sXG4gICAgZmlyc3RBbGlnblJpZ2h0OiBmYWxzZSxcbiAgICBvZGRBbGlnblJpZ2h0OiBmYWxzZVxuICB9O1xuICByb3dzID0gW107XG4gIGNlbGxzID0gYXJyYXkyRCgpO1xuICBjb2x1bW5Db3VudCA9IDA7XG4gIE9KLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZSk7XG4gIHJldCA9IG5vZGVGYWN0b3J5KG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5KTtcbiAgdGJvZHkgPSBudWxsO1xuICB0aGVhZCA9IG51bGw7XG4gIHRoZWFkUm93ID0gbnVsbDtcbiAgaW5pdCA9IF8ub25jZShmdW5jdGlvbigpIHtcbiAgICB2YXIgajJ0LCBqQm9keSwgakhlYWQsIGpUYmwsIHRibFN0cjtcbiAgICBpZiAoZGVmYXVsdHMuZGF0YSkge1xuICAgICAgajJ0ID0gbmV3IEpzb25Ub1RhYmxlKGRlZmF1bHRzLmRhdGEpO1xuICAgICAgdGJsU3RyID0gajJ0LnRhYmxlO1xuICAgIH1cbiAgICBpZiAodGJsU3RyKSB7XG4gICAgICBqVGJsID0gJCh0YmxTdHIpO1xuICAgICAgakhlYWQgPSBqVGJsLmZpbmQoJ3RoZWFkJyk7XG4gICAgICByZXQuJC5hcHBlbmQoakhlYWQpO1xuICAgICAgdGhlYWQgPSBlbC5yZXN0b3JlRWxlbWVudChqSGVhZFswXSk7XG4gICAgICB0aGVhZFJvdyA9IGVsLnJlc3RvcmVFbGVtZW50KHRoZWFkWzBdLnJvd3NbMF0pO1xuICAgICAgakJvZHkgPSBqVGJsLmZpbmQoJ3Rib2R5Jyk7XG4gICAgICByZXQuJC5hcHBlbmQoakJvZHkpO1xuICAgICAgdGJvZHkgPSBlbC5yZXN0b3JlRWxlbWVudChqQm9keVswXSk7XG4gICAgICBsb2FkQ2VsbHMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhlYWQgPSByZXQubWFrZSgndGhlYWQnLCBkZWZhdWx0cy50aGVhZCk7XG4gICAgICB0aGVhZFJvdyA9IHRoZWFkLm1ha2UoJ3RyJyk7XG4gICAgICB0Ym9keSA9IHJldC5tYWtlKCd0Ym9keScsIGRlZmF1bHRzLnRib2R5KTtcbiAgICAgIHJvd3MucHVzaCh0Ym9keS5tYWtlKCd0cicpKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG4gIGxvYWRDZWxscyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjLCBtZW1DZWxsLCBtZW1Sb3csIHIsIHJlc3VsdHM7XG4gICAgciA9IDA7XG4gICAgcmVzdWx0cyA9IFtdO1xuICAgIHdoaWxlICh0Ym9keVswXS5yb3dzLmxlbmd0aCA+IHIpIHtcbiAgICAgIGMgPSAwO1xuICAgICAgbWVtUm93ID0gZWwucmVzdG9yZUVsZW1lbnQodGJvZHlbMF0ucm93c1tyXSk7XG4gICAgICByb3dzLnB1c2gobWVtUm93KTtcbiAgICAgIHdoaWxlICh0Ym9keVswXS5yb3dzW3JdLmNlbGxzLmxlbmd0aCA+IGMpIHtcbiAgICAgICAgbWVtQ2VsbCA9IGNlbGxzLmdldChyICsgMSwgYyArIDEpO1xuICAgICAgICBpZiAoIW1lbUNlbGwpIHtcbiAgICAgICAgICBtZW1DZWxsID0gZWwucmVzdG9yZUVsZW1lbnQodGJvZHlbMF0ucm93c1tyXS5jZWxsc1tjXSk7XG4gICAgICAgICAgY2VsbHMuc2V0KHIgKyAxLCBjICsgMSwgbWVtQ2VsbCk7XG4gICAgICAgIH1cbiAgICAgICAgYyArPSAxO1xuICAgICAgfVxuICAgICAgcmVzdWx0cy5wdXNoKHIgKz0gMSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRzO1xuICB9O1xuICBmaWxsTWlzc2luZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBjZWxscy5lYWNoKGZ1bmN0aW9uKHJvd05vLCBjb2xObywgdmFsKSB7XG4gICAgICB2YXIgcm93O1xuICAgICAgaWYgKCF2YWwpIHtcbiAgICAgICAgcm93ID0gcmV0LnJvdyhyb3dObyk7XG4gICAgICAgIHJldHVybiByb3cuY2VsbChjb2xObywge30pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICByZXQuYWRkKCdjb2x1bW4nLCBmdW5jdGlvbihjb2xObywgY29sTmFtZSkge1xuICAgIHZhciBpLCBuYXRpdmVUaCwgdGg7XG4gICAgcmV0LmluaXQoKTtcbiAgICBjb2x1bW5Db3VudCArPSAxO1xuICAgIHRoID0gbnVsbDtcbiAgICBpID0gMDtcbiAgICB3aGlsZSAodGhlYWRbMF0ucm93c1swXS5jZWxscy5sZW5ndGggPCBjb2xObykge1xuICAgICAgbmF0aXZlVGggPSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzW2ldO1xuICAgICAgaWYgKCFuYXRpdmVUaCkge1xuICAgICAgICB0aCA9IHRoZWFkUm93Lm1ha2UoJ3RoJywge30pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudChuYXRpdmVUaCwgJ3RoJyk7XG4gICAgICB9XG4gICAgICBpICs9IDE7XG4gICAgfVxuICAgIGlmICghdGgpIHtcbiAgICAgIG5hdGl2ZVRoID0gdGhlYWRbMF0ucm93c1swXS5jZWxsc1tjb2xObyAtIDFdO1xuICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudChuYXRpdmVUaCwgJ3RoJyk7XG4gICAgfVxuICAgIHRoLnRleHQoY29sTmFtZSk7XG4gICAgcmV0dXJuIHRoO1xuICB9KTtcbiAgcmV0LmFkZCgncm93JywgZnVuY3Rpb24ocm93Tm8sIG9wdHMpIHtcbiAgICB2YXIgcm93O1xuICAgIHJvdyA9IHJvd3Nbcm93Tm8gLSAxXTtcbiAgICBpZiAoIXJvdykge1xuICAgICAgd2hpbGUgKHJvd3MubGVuZ3RoIDwgcm93Tm8pIHtcbiAgICAgICAgcm93ID0gdGJvZHkubWFrZSgndHInLCB7fSk7XG4gICAgICAgIHJvd3MucHVzaChyb3cpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIXJvdy5jZWxsKSB7XG4gICAgICByb3cuYWRkKCdjZWxsJywgZnVuY3Rpb24oY29sTm8sIG9wdHMpIHtcbiAgICAgICAgdmFyIGNlbGw7XG4gICAgICAgIGNlbGwgPSBPSi5ub2Rlcy50ZChvcHRzLCByb3cpO1xuICAgICAgICBjZWxscy5zZXQocm93Tm8sIGNvbE5vLCBjZWxsKTtcbiAgICAgICAgcmV0dXJuIGNlbGw7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJvdztcbiAgfSk7XG4gIHJldC5hZGQoJ2NlbGwnLCBmdW5jdGlvbihyb3dObywgY29sTm8sIG9wdHMpIHtcbiAgICB2YXIgY2VsbCwgaSwgbnVPcHRzLCByb3csIHRyeUNlbGw7XG4gICAgaWYgKHJvd05vIDwgMSkge1xuICAgICAgcm93Tm8gPSAxO1xuICAgIH1cbiAgICBpZiAoY29sTm8gPCAxKSB7XG4gICAgICBjb2xObyA9IDE7XG4gICAgfVxuICAgIGlmIChjb2x1bW5Db3VudCA+IDAgJiYgY29sTm8gLSAxID4gY29sdW1uQ291bnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSBjb2x1bW4gbmFtZSBoYXMgbm90IGJlZW4gZGVmaW5lZCBmb3IgdGhpcyBwb3NpdGlvbiB7JyArIHJvd05vICsgJ3gnICsgY29sTm8gKyAnfS4nKTtcbiAgICB9XG4gICAgcm93ID0gcmV0LnJvdyhyb3dObyk7XG4gICAgY2VsbCA9IGNlbGxzLmdldChyb3dObywgY29sTm8pO1xuICAgIGlmICghY2VsbCkge1xuICAgICAgaSA9IDA7XG4gICAgICB3aGlsZSAoaSA8IGNvbE5vKSB7XG4gICAgICAgIGkgKz0gMTtcbiAgICAgICAgaWYgKGkgPT09IGNvbE5vKSB7XG4gICAgICAgICAgbnVPcHRzID0gT0ouZXh0ZW5kKHtcbiAgICAgICAgICAgIHByb3BzOiBkZWZhdWx0cy5jZWxsc1xuICAgICAgICAgIH0sIG9wdHMpO1xuICAgICAgICAgIGNlbGwgPSByb3cuY2VsbChjb2xObywgbnVPcHRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0cnlDZWxsID0gY2VsbHMuZ2V0KHJvd05vLCBpKTtcbiAgICAgICAgICBpZiAoIXRyeUNlbGwpIHtcbiAgICAgICAgICAgIHRyeUNlbGwgPSByb3cuY2VsbChpLCB7XG4gICAgICAgICAgICAgIHByb3BzOiBkZWZhdWx0cy5jZWxsc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjZWxsO1xuICB9KTtcbiAgaW5pdCgpO1xuICByZXQuYWRkKCd0aGVhZCcsIHRoZWFkKTtcbiAgcmV0LmFkZCgndGJvZHknLCB0Ym9keSk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5PSi5ub2Rlcy5yZWdpc3Rlcihub2RlTmFtZSwgbm9kZSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltUTZYRnhIYVhSb2RXSmNYRzlxWEZ4emNtTmNYR052Wm1abFpWeGNaV3hsYldWdWRITmNYSFJoWW14bExtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlFVRXNTVUZCUVRzN1FVRkJRU3hGUVVGQkxFZEJRVXNzVDBGQlFTeERRVUZSTEU5QlFWSTdPMEZCUTB3c1YwRkJRU3hIUVVGakxFOUJRVUVzUTBGQlVTeHZRa0ZCVWpzN1FVRkRaQ3hEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCUTBvc1QwRkJRU3hIUVVGVkxFOUJRVUVzUTBGQlVTeHJRa0ZCVWpzN1FVRkRWaXhEUVVGQkxFZEJRVWtzVDBGQlFTeERRVUZSTEZGQlFWSTdPMEZCUTBvc1YwRkJRU3hIUVVGakxFOUJRVUVzUTBGQlVTeHpRa0ZCVWpzN1FVRkpaQ3hSUVVGQkxFZEJRVmM3T3p0QlFVVllPenM3TzBGQlIwRXNTVUZCUVN4SFFVRlBMRk5CUVVNc1QwRkJSQ3hGUVVGVkxFdEJRVllzUlVGQk1rSXNhVUpCUVROQ08wRkJSMHdzVFVGQlFUczdTVUZJWlN4UlFVRlJMRVZCUVVVc1EwRkJRenM3TzBsQlFVMHNiMEpCUVc5Q096dEZRVWR3UkN4UlFVRkJMRWRCUjBVN1NVRkJRU3hKUVVGQkxFVkJRVTBzU1VGQlRqdEpRVWRCTEV0QlFVRXNSVUZEUlR0TlFVRkJMRmRCUVVFc1JVRkJZU3hEUVVGaU8wMUJRMEVzVjBGQlFTeEZRVUZoTEVOQlJHSTdUVUZGUVN4TFFVRkJMRVZCUVU4c1JVRkdVRHROUVVkQkxFdEJRVUVzUlVGQlR5eEZRVWhRTzAxQlNVRXNVMEZCUVN4RlFVRlhMRTFCU2xnN1RVRkxRU3hWUVVGQkxFVkJRVmtzUzBGTVdqdE5RVTFCTEU5QlFVRXNSVUZCVHl4RlFVNVFPMHRCU2tZN1NVRlhRU3hOUVVGQkxFVkJRVkVzUlVGWVVqdEpRVmxCTEUxQlFVRXNSVUZCVVN4RlFWcFNPMGxCWlVFc1MwRkJRU3hGUVVORk8wMUJRVUVzVDBGQlFTeEZRVUZQTEVWQlFWQTdUVUZEUVN4TFFVRkJMRVZCUVU4c1JVRkVVRHROUVVWQkxHZENRVUZCTEVWQlFXdENMRVZCUm14Q08wMUJSMEVzVjBGQlFTeEZRVUZoTEVWQlNHSTdUVUZKUVN4TlFVRkJMRVZCUVZFc1JVRktVanRMUVdoQ1JqdEpRWFZDUVN4TFFVRkJMRVZCUVU4c1JVRjJRbEE3U1VFd1FrRXNTMEZCUVN4RlFVRlBMRVZCTVVKUU8wbEJORUpCTEdWQlFVRXNSVUZCYVVJc1MwRTFRbXBDTzBsQk5rSkJMR0ZCUVVFc1JVRkJaU3hMUVRkQ1pqczdSVUVyUWtZc1NVRkJRU3hIUVVGUE8wVkJRMUFzUzBGQlFTeEhRVUZSTEU5QlFVRXNRMEZCUVR0RlFVTlNMRmRCUVVFc1IwRkJZenRGUVVWa0xFVkJRVVVzUTBGQlF5eE5RVUZJTEVOQlFWVXNVVUZCVml4RlFVRnZRaXhQUVVGd1FpeEZRVUUyUWl4SlFVRTNRanRGUVVOQkxFZEJRVUVzUjBGQlRTeFhRVUZCTEVOQlFWa3NVVUZCV2l4RlFVRnpRaXhSUVVGMFFpeEZRVUZuUXl4TFFVRm9ReXhGUVVGMVF5eHBRa0ZCZGtNN1JVRkhUaXhMUVVGQkxFZEJRVkU3UlVGRFVpeExRVUZCTEVkQlFWRTdSVUZEVWl4UlFVRkJMRWRCUVZjN1JVRkpXQ3hKUVVGQkxFZEJRVThzUTBGQlF5eERRVUZETEVsQlFVWXNRMEZCVHl4VFFVRkJPMEZCUTFvc1VVRkJRVHRKUVVGQkxFbEJRVWNzVVVGQlVTeERRVUZETEVsQlFWbzdUVUZEUlN4SFFVRkJMRWRCUVZVc1NVRkJRU3hYUVVGQkxFTkJRVmtzVVVGQlVTeERRVUZETEVsQlFYSkNPMDFCUTFZc1RVRkJRU3hIUVVGVExFZEJRVWNzUTBGQlF5eE5RVVptT3p0SlFVZEJMRWxCUVVjc1RVRkJTRHROUVVORkxFbEJRVUVzUjBGQlR5eERRVUZCTEVOQlFVVXNUVUZCUmp0TlFVVlFMRXRCUVVFc1IwRkJVU3hKUVVGSkxFTkJRVU1zU1VGQlRDeERRVUZWTEU5QlFWWTdUVUZEVWl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRExFMUJRVTRzUTBGQllTeExRVUZpTzAxQlEwRXNTMEZCUVN4SFFVRlJMRVZCUVVVc1EwRkJReXhqUVVGSUxFTkJRV3RDTEV0QlFVMHNRMEZCUVN4RFFVRkJMRU5CUVhoQ08wMUJRMUlzVVVGQlFTeEhRVUZYTEVWQlFVVXNRMEZCUXl4alFVRklMRU5CUVd0Q0xFdEJRVTBzUTBGQlFTeERRVUZCTEVOQlFVVXNRMEZCUXl4SlFVRkxMRU5CUVVFc1EwRkJRU3hEUVVGb1F6dE5RVVZZTEV0QlFVRXNSMEZCVVN4SlFVRkpMRU5CUVVNc1NVRkJUQ3hEUVVGVkxFOUJRVlk3VFVGRFVpeEhRVUZITEVOQlFVTXNRMEZCUXl4RFFVRkRMRTFCUVU0c1EwRkJZU3hMUVVGaU8wMUJRMEVzUzBGQlFTeEhRVUZSTEVWQlFVVXNRMEZCUXl4alFVRklMRU5CUVd0Q0xFdEJRVTBzUTBGQlFTeERRVUZCTEVOQlFYaENPMDFCUlZJc1UwRkJRU3hEUVVGQkxFVkJXa1k3UzBGQlFTeE5RVUZCTzAxQlkwVXNTMEZCUVN4SFFVRlJMRWRCUVVjc1EwRkJReXhKUVVGS0xFTkJRVk1zVDBGQlZDeEZRVUZyUWl4UlFVRlJMRU5CUVVNc1MwRkJNMEk3VFVGRFVpeFJRVUZCTEVkQlFWY3NTMEZCU3l4RFFVRkRMRWxCUVU0c1EwRkJWeXhKUVVGWU8wMUJRMWdzUzBGQlFTeEhRVUZSTEVkQlFVY3NRMEZCUXl4SlFVRktMRU5CUVZNc1QwRkJWQ3hGUVVGclFpeFJRVUZSTEVOQlFVTXNTMEZCTTBJN1RVRkRVaXhKUVVGSkxFTkJRVU1zU1VGQlRDeERRVUZWTEV0QlFVc3NRMEZCUXl4SlFVRk9MRU5CUVZjc1NVRkJXQ3hEUVVGV0xFVkJha0pHT3p0WFFXdENRVHRGUVhSQ1dTeERRVUZRTzBWQk1FSlFMRk5CUVVFc1IwRkJXU3hUUVVGQk8wRkJRMVlzVVVGQlFUdEpRVUZCTEVOQlFVRXNSMEZCU1R0QlFVTktPMWRCUVUwc1MwRkJUU3hEUVVGQkxFTkJRVUVzUTBGQlJTeERRVUZETEVsQlFVa3NRMEZCUXl4TlFVRmtMRWRCUVhWQ0xFTkJRVGRDTzAxQlEwVXNRMEZCUVN4SFFVRkpPMDFCUTBvc1RVRkJRU3hIUVVGVExFVkJRVVVzUTBGQlF5eGpRVUZJTEVOQlFXdENMRXRCUVUwc1EwRkJRU3hEUVVGQkxFTkJRVVVzUTBGQlF5eEpRVUZMTEVOQlFVRXNRMEZCUVN4RFFVRm9RenROUVVOVUxFbEJRVWtzUTBGQlF5eEpRVUZNTEVOQlFWVXNUVUZCVmp0QlFVTkJMR0ZCUVUwc1MwRkJUU3hEUVVGQkxFTkJRVUVzUTBGQlJTeERRVUZETEVsQlFVc3NRMEZCUVN4RFFVRkJMRU5CUVVVc1EwRkJReXhMUVVGTExFTkJRVU1zVFVGQmRrSXNSMEZCWjBNc1EwRkJkRU03VVVGRFJTeFBRVUZCTEVkQlFWVXNTMEZCU3l4RFFVRkRMRWRCUVU0c1EwRkJWU3hEUVVGQkxFZEJRVVVzUTBGQldpeEZRVUZsTEVOQlFVRXNSMEZCUlN4RFFVRnFRanRSUVVOV0xFbEJRVWNzUTBGQlNTeFBRVUZRTzFWQlEwVXNUMEZCUVN4SFFVRlZMRVZCUVVVc1EwRkJReXhqUVVGSUxFTkJRV3RDTEV0QlFVMHNRMEZCUVN4RFFVRkJMRU5CUVVVc1EwRkJReXhKUVVGTExFTkJRVUVzUTBGQlFTeERRVUZGTEVOQlFVTXNTMEZCVFN4RFFVRkJMRU5CUVVFc1EwRkJla003VlVGRFZpeExRVUZMTEVOQlFVTXNSMEZCVGl4RFFVRlZMRU5CUVVFc1IwRkJSU3hEUVVGYUxFVkJRV1VzUTBGQlFTeEhRVUZGTEVOQlFXcENMRVZCUVc5Q0xFOUJRWEJDTEVWQlJrWTdPMUZCUjBFc1EwRkJRU3hKUVVGTE8wMUJURkE3YlVKQlRVRXNRMEZCUVN4SlFVRkxPMGxCVmxBc1EwRkJRVHM3UlVGR1ZUdEZRV2RDV2l4WFFVRkJMRWRCUVdNc1UwRkJRVHRYUVVOYUxFdEJRVXNzUTBGQlF5eEpRVUZPTEVOQlFWY3NVMEZCUXl4TFFVRkVMRVZCUVZFc1MwRkJVaXhGUVVGbExFZEJRV1k3UVVGRFZDeFZRVUZCTzAxQlFVRXNTVUZCUnl4RFFVRkpMRWRCUVZBN1VVRkRSU3hIUVVGQkxFZEJRVTBzUjBGQlJ5eERRVUZETEVkQlFVb3NRMEZCVVN4TFFVRlNPMlZCUTA0c1IwRkJSeXhEUVVGRExFbEJRVW9zUTBGQlV5eExRVUZVTEVWQlFXZENMRVZCUVdoQ0xFVkJSa1k3TzBsQlJGTXNRMEZCV0R0RlFVUlpPMFZCVVdRc1IwRkJSeXhEUVVGRExFZEJRVW9zUTBGQlVTeFJRVUZTTEVWQlFXdENMRk5CUVVNc1MwRkJSQ3hGUVVGUkxFOUJRVkk3UVVGRGFFSXNVVUZCUVR0SlFVRkJMRWRCUVVjc1EwRkJReXhKUVVGS0xFTkJRVUU3U1VGRFFTeFhRVUZCTEVsQlFXVTdTVUZEWml4RlFVRkJMRWRCUVVzN1NVRkRUQ3hEUVVGQkxFZEJRVWs3UVVGRFNpeFhRVUZOTEV0QlFVMHNRMEZCUVN4RFFVRkJMRU5CUVVVc1EwRkJReXhKUVVGTExFTkJRVUVzUTBGQlFTeERRVUZGTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVhaQ0xFZEJRV2RETEV0QlFYUkRPMDFCUTBVc1VVRkJRU3hIUVVGWExFdEJRVTBzUTBGQlFTeERRVUZCTEVOQlFVVXNRMEZCUXl4SlFVRkxMRU5CUVVFc1EwRkJRU3hEUVVGRkxFTkJRVU1zUzBGQlRTeERRVUZCTEVOQlFVRTdUVUZEYkVNc1NVRkJSeXhEUVVGSkxGRkJRVkE3VVVGRFJTeEZRVUZCTEVkQlFVc3NVVUZCVVN4RFFVRkRMRWxCUVZRc1EwRkJZeXhKUVVGa0xFVkJRVzlDTEVWQlFYQkNMRVZCUkZBN1QwRkJRU3hOUVVGQk8xRkJSMFVzUlVGQlFTeEhRVUZMTEVWQlFVVXNRMEZCUXl4alFVRklMRU5CUVd0Q0xGRkJRV3hDTEVWQlFUUkNMRWxCUVRWQ0xFVkJTRkE3TzAxQlNVRXNRMEZCUVN4SlFVRkxPMGxCVGxBN1NVRlBRU3hKUVVGSExFTkJRVWtzUlVGQlVEdE5RVU5GTEZGQlFVRXNSMEZCVnl4TFFVRk5MRU5CUVVFc1EwRkJRU3hEUVVGRkxFTkJRVU1zU1VGQlN5eERRVUZCTEVOQlFVRXNRMEZCUlN4RFFVRkRMRXRCUVUwc1EwRkJRU3hMUVVGQkxFZEJRVTBzUTBGQlRqdE5RVU5zUXl4RlFVRkJMRWRCUVVzc1JVRkJSU3hEUVVGRExHTkJRVWdzUTBGQmEwSXNVVUZCYkVJc1JVRkJORUlzU1VGQk5VSXNSVUZHVURzN1NVRkhRU3hGUVVGRkxFTkJRVU1zU1VGQlNDeERRVUZSTEU5QlFWSTdWMEZEUVR0RlFXaENaMElzUTBGQmJFSTdSVUZ2UWtFc1IwRkJSeXhEUVVGRExFZEJRVW9zUTBGQlVTeExRVUZTTEVWQlFXVXNVMEZCUXl4TFFVRkVMRVZCUVZFc1NVRkJVanRCUVVOaUxGRkJRVUU3U1VGQlFTeEhRVUZCTEVkQlFVMHNTVUZCU3l4RFFVRkJMRXRCUVVFc1IwRkJUU3hEUVVGT08wbEJSVmdzU1VGQlJ5eERRVUZKTEVkQlFWQTdRVUZEUlN4aFFVRk5MRWxCUVVrc1EwRkJReXhOUVVGTUxFZEJRV01zUzBGQmNFSTdVVUZEUlN4SFFVRkJMRWRCUVUwc1MwRkJTeXhEUVVGRExFbEJRVTRzUTBGQlZ5eEpRVUZZTEVWQlFXbENMRVZCUVdwQ08xRkJRMDRzU1VGQlNTeERRVUZETEVsQlFVd3NRMEZCVlN4SFFVRldPMDFCUmtZc1EwRkVSanM3U1VGTFFTeEpRVUZITEVOQlFVa3NSMEZCUnl4RFFVRkRMRWxCUVZnN1RVRkRSU3hIUVVGSExFTkJRVU1zUjBGQlNpeERRVUZSTEUxQlFWSXNSVUZCWjBJc1UwRkJReXhMUVVGRUxFVkJRVkVzU1VGQlVqdEJRVU5rTEZsQlFVRTdVVUZCUVN4SlFVRkJMRWRCUVU4c1JVRkJSU3hEUVVGRExFdEJRVXNzUTBGQlF5eEZRVUZVTEVOQlFWa3NTVUZCV2l4RlFVRnJRaXhIUVVGc1FqdFJRVU5RTEV0QlFVc3NRMEZCUXl4SFFVRk9MRU5CUVZVc1MwRkJWaXhGUVVGcFFpeExRVUZxUWl4RlFVRjNRaXhKUVVGNFFqdGxRVU5CTzAxQlNHTXNRMEZCYUVJc1JVRkVSanM3VjBGTlFUdEZRV1JoTEVOQlFXWTdSVUZyUWtFc1IwRkJSeXhEUVVGRExFZEJRVW9zUTBGQlVTeE5RVUZTTEVWQlFXZENMRk5CUVVNc1MwRkJSQ3hGUVVGUkxFdEJRVklzUlVGQlpTeEpRVUZtTzBGQlEyUXNVVUZCUVR0SlFVRkJMRWxCUVVjc1MwRkJRU3hIUVVGUkxFTkJRVmc3VFVGQmEwSXNTMEZCUVN4SFFVRlJMRVZCUVRGQ096dEpRVU5CTEVsQlFVY3NTMEZCUVN4SFFVRlJMRU5CUVZnN1RVRkJhMElzUzBGQlFTeEhRVUZSTEVWQlFURkNPenRKUVVOQkxFbEJRVWNzVjBGQlFTeEhRVUZqTEVOQlFXUXNTVUZCYjBJc1MwRkJRU3hIUVVGTkxFTkJRVTRzUjBGQlZTeFhRVUZxUXp0QlFVRnJSQ3haUVVGVkxFbEJRVUVzUzBGQlFTeERRVUZOTEhkRVFVRkJMRWRCUVRKRUxFdEJRVE5FTEVkQlFXMUZMRWRCUVc1RkxFZEJRWGxGTEV0QlFYcEZMRWRCUVdsR0xFbEJRWFpHTEVWQlFUVkVPenRKUVVWQkxFZEJRVUVzUjBGQlRTeEhRVUZITEVOQlFVTXNSMEZCU2l4RFFVRlJMRXRCUVZJN1NVRkZUaXhKUVVGQkxFZEJRVThzUzBGQlN5eERRVUZETEVkQlFVNHNRMEZCVlN4TFFVRldMRVZCUVdsQ0xFdEJRV3BDTzBsQlJWQXNTVUZCUnl4RFFVRkpMRWxCUVZBN1RVRkRSU3hEUVVGQkxFZEJRVWs3UVVGRFNpeGhRVUZOTEVOQlFVRXNSMEZCU1N4TFFVRldPMUZCUTBVc1EwRkJRU3hKUVVGTE8xRkJRMHdzU1VGQlJ5eERRVUZCTEV0QlFVc3NTMEZCVWp0VlFVTkZMRTFCUVVFc1IwRkJVeXhGUVVGRkxFTkJRVU1zVFVGQlNDeERRVUZWTzFsQlFVTXNTMEZCUVN4RlFVRlBMRkZCUVZFc1EwRkJReXhMUVVGcVFqdFhRVUZXTEVWQlFXMURMRWxCUVc1RE8xVkJRMVFzU1VGQlFTeEhRVUZQTEVkQlFVY3NRMEZCUXl4SlFVRktMRU5CUVZNc1MwRkJWQ3hGUVVGblFpeE5RVUZvUWl4RlFVWlVPMU5CUVVFc1RVRkJRVHRWUVVsRkxFOUJRVUVzUjBGQlZTeExRVUZMTEVOQlFVTXNSMEZCVGl4RFFVRlZMRXRCUVZZc1JVRkJhVUlzUTBGQmFrSTdWVUZEVml4SlFVRkhMRU5CUVVrc1QwRkJVRHRaUVVORkxFOUJRVUVzUjBGQlZ5eEhRVUZITEVOQlFVTXNTVUZCU2l4RFFVRlRMRU5CUVZRc1JVRkJXVHRqUVVGQkxFdEJRVUVzUlVGQlR5eFJRVUZSTEVOQlFVTXNTMEZCYUVJN1lVRkJXaXhGUVVSaU8xZEJURVk3TzAxQlJrWXNRMEZHUmpzN1YwRlpRVHRGUVhKQ1l5eERRVUZvUWp0RlFYbENRU3hKUVVGQkxFTkJRVUU3UlVGSlFTeEhRVUZITEVOQlFVTXNSMEZCU2l4RFFVRlJMRTlCUVZJc1JVRkJhVUlzUzBGQmFrSTdSVUZKUVN4SFFVRkhMRU5CUVVNc1IwRkJTaXhEUVVGUkxFOUJRVklzUlVGQmFVSXNTMEZCYWtJN1UwRkpRVHRCUVdoTVN6czdRVUZyVEZBc1JVRkJSU3hEUVVGRExFdEJRVXNzUTBGQlF5eFJRVUZVTEVOQlFXdENMRkZCUVd4Q0xFVkJRVFJDTEVsQlFUVkNPenRCUVVOQkxFMUJRVTBzUTBGQlF5eFBRVUZRTEVkQlFXbENJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKUFNpQTlJSEpsY1hWcGNtVWdKeTR1TDI5cUoxeHlYRzV1YjJSbFJtRmpkRzl5ZVNBOUlISmxjWFZwY21VZ0p5NHVMMlJ2YlM5dWIyUmxSbUZqZEc5eWVTZGNjbHh1WHlBOUlISmxjWFZwY21VZ0oyeHZaR0Z6YUNkY2NseHVZWEp5WVhreVJDQTlJSEpsY1hWcGNtVWdKeTR1TDNSdmIyeHpMMkZ5Y21GNU1rUW5YSEpjYmlRZ1BTQnlaWEYxYVhKbElDZHFjWFZsY25rblhISmNia3B6YjI1VWIxUmhZbXhsSUQwZ2NtVnhkV2x5WlNBbkxpNHZkRzl2YkhNdlNuTnZibFJ2VkdGaWJHVW5YSEpjYmx4eVhHNGpJQ01nZEdGaWJHVmNjbHh1WEhKY2JtNXZaR1ZPWVcxbElEMGdKM1JoWW14bEoxeHlYRzVjY2x4dUl5TWpYSEpjYmtOeVpXRjBaU0JoYmlCSVZFMU1JSFJoWW14bExpQlFjbTkyYVdSbGN5Qm9aV3h3WlhJZ2JXVjBhRzlrY3lCMGJ5QmpjbVZoZEdVZ1EyOXNkVzF1Y3lCaGJtUWdRMlZzYkhNdVhISmNiaU1qSTF4eVhHNXViMlJsSUQwZ0tHOXdkR2x2Ym5Nc0lHOTNibVZ5SUQwZ1Qwb3VZbTlrZVN3Z1kyRnNiR1ZrUm5KdmJVWmhZM1J2Y25rZ1BTQm1ZV3h6WlNrZ0xUNWNjbHh1WEhKY2JpQWdJeUFqSXlCdmNIUnBiMjV6WEhKY2JpQWdaR1ZtWVhWc2RITWdQVnh5WEc0Z0lDQWdJeUFqSXlNZ1pHRjBZVnh5WEc0Z0lDQWdJeUJ2Y0hScGIyNWhiQ0JoY25KaGVTQnZaaUJ2WW1wbFkzUnpMaUJwWmlCd2NtOTJhV1JsWkNCM2FXeHNJR2RsYm1WeVlYUmxJSFJoWW14bElHRjFkRzl0WVhScFkyRnNiSGt1WEhKY2JpQWdJQ0JrWVhSaE9pQnVkV3hzWEhKY2JpQWdJQ0FqSUNNakl5QndjbTl3YzF4eVhHNGdJQ0FnSXlCdmNIUnBiMjVoYkNCd2NtOXdaWEowYVdWeklIUnZJR0Z3Y0d4NUlIUnZJSFJoWW14bElISnZiM1FnYm05a1pWeHlYRzRnSUNBZ2NISnZjSE02WEhKY2JpQWdJQ0FnSUdObGJHeHdZV1JrYVc1bk9pQXdYSEpjYmlBZ0lDQWdJR05sYkd4emNHRmphVzVuT2lBd1hISmNiaUFnSUNBZ0lHRnNhV2R1T2lBbkoxeHlYRzRnSUNBZ0lDQjNhV1IwYURvZ0p5ZGNjbHh1SUNBZ0lDQWdZMlZzYkdGc2FXZHVPaUFuYkdWbWRDZGNjbHh1SUNBZ0lDQWdZMlZzYkhaaGJHbG5iam9nSjNSdmNDZGNjbHh1SUNBZ0lDQWdZMnhoYzNNNklDY25YSEpjYmlBZ0lDQnpkSGxzWlhNNklIdDlYSEpjYmlBZ0lDQmxkbVZ1ZEhNNklIdDlYSEpjYmlBZ0lDQWpJQ01qSXlCalpXeHNjMXh5WEc0Z0lDQWdJeUJ2Y0hScGIyNWhiQ0J3Y205d1pYSjBhV1Z6SUhSdklHRndjR3g1SUhSdklHbHVaR2wyYVdSMVlXd2dZMlZzYkhOY2NseHVJQ0FnSUdObGJHeHpPbHh5WEc0Z0lDQWdJQ0JqYkdGemN6b2dKeWRjY2x4dUlDQWdJQ0FnWVd4cFoyNDZJQ2NuWEhKY2JpQWdJQ0FnSUNkMlpYSjBhV05oYkMxaGJHbG5iaWM2SUNjblhISmNiaUFnSUNBZ0lHTmxiR3h3WVdSa2FXNW5PaUFuSjF4eVhHNGdJQ0FnSUNCdFlYSm5hVzQ2SUNjblhISmNiaUFnSUNBaklDTWpJeUIwYUdWaFpGeHlYRzRnSUNBZ0l5QnZjSFJwYjI1aGJDQnZjSFJwYjI1eklHOWlhbVZqZENCMGJ5QndZWE56SUdsdWRHOGdkR2hsWVdRZ1kzSmxZWFJwYjI1Y2NseHVJQ0FnSUhSb1pXRmtPaUI3ZlZ4eVhHNGdJQ0FnSXlBakl5TWdkR0p2WkhsY2NseHVJQ0FnSUNNZ2IzQjBhVzl1WVd3Z2IzQjBhVzl1Y3lCdlltcGxZM1FnZEc4Z2NHRnpjeUJwYm5SdklIUmliMlI1SUdOeVpXRjBhVzl1WEhKY2JpQWdJQ0IwWW05a2VUb2dlMzFjY2x4dVhISmNiaUFnSUNCbWFYSnpkRUZzYVdkdVVtbG5hSFE2SUdaaGJITmxYSEpjYmlBZ0lDQnZaR1JCYkdsbmJsSnBaMmgwT2lCbVlXeHpaVnh5WEc1Y2NseHVJQ0J5YjNkeklEMGdXMTFjY2x4dUlDQmpaV3hzY3lBOUlHRnljbUY1TWtRb0tWeHlYRzRnSUdOdmJIVnRia052ZFc1MElEMGdNRnh5WEc1Y2NseHVJQ0JQU2k1bGVIUmxibVFnWkdWbVlYVnNkSE1zSUc5d2RHbHZibk1zSUhSeWRXVmNjbHh1SUNCeVpYUWdQU0J1YjJSbFJtRmpkRzl5ZVNCdWIyUmxUbUZ0WlN3Z1pHVm1ZWFZzZEhNc0lHOTNibVZ5TENCallXeHNaV1JHY205dFJtRmpkRzl5ZVZ4eVhHNGdYSEpjYmx4eVhHNGdJSFJpYjJSNUlEMGdiblZzYkZ4eVhHNGdJSFJvWldGa0lEMGdiblZzYkZ4eVhHNGdJSFJvWldGa1VtOTNJRDBnYm5Wc2JGeHlYRzVjY2x4dUlDQWpJQ01qSXlCcGJtbDBYSEpjYmlBZ0l5QnBiblJsY201aGJDQnRaWFJvYjJRZ1ptOXlJRzl1WlNCMGFXMWxJR2x1YVhScFlXeHBlbUYwYVc5dUlHOW1JSFJvWlNCMFlXSnNaVnh5WEc0Z0lHbHVhWFFnUFNCZkxtOXVZMlVnTFQ1Y2NseHVJQ0FnSUdsbUlHUmxabUYxYkhSekxtUmhkR0ZjY2x4dUlDQWdJQ0FnYWpKMElEMGdibVYzSUVwemIyNVViMVJoWW14bElHUmxabUYxYkhSekxtUmhkR0ZjY2x4dUlDQWdJQ0FnZEdKc1UzUnlJRDBnYWpKMExuUmhZbXhsWEhKY2JpQWdJQ0JwWmlCMFlteFRkSEpjY2x4dUlDQWdJQ0FnYWxSaWJDQTlJQ1FnZEdKc1UzUnlYSEpjYmx4eVhHNGdJQ0FnSUNCcVNHVmhaQ0E5SUdwVVltd3VabWx1WkNBbmRHaGxZV1FuWEhKY2JpQWdJQ0FnSUhKbGRDNGtMbUZ3Y0dWdVpDQnFTR1ZoWkZ4eVhHNGdJQ0FnSUNCMGFHVmhaQ0E5SUdWc0xuSmxjM1J2Y21WRmJHVnRaVzUwSUdwSVpXRmtXekJkWEhKY2JpQWdJQ0FnSUhSb1pXRmtVbTkzSUQwZ1pXd3VjbVZ6ZEc5eVpVVnNaVzFsYm5RZ2RHaGxZV1JiTUYwdWNtOTNjMXN3WFZ4eVhHNWNjbHh1SUNBZ0lDQWdha0p2WkhrZ1BTQnFWR0pzTG1acGJtUWdKM1JpYjJSNUoxeHlYRzRnSUNBZ0lDQnlaWFF1SkM1aGNIQmxibVFnYWtKdlpIbGNjbHh1SUNBZ0lDQWdkR0p2WkhrZ1BTQmxiQzV5WlhOMGIzSmxSV3hsYldWdWRDQnFRbTlrZVZzd1hWeHlYRzVjY2x4dUlDQWdJQ0FnYkc5aFpFTmxiR3h6S0NsY2NseHVJQ0FnSUdWc2MyVmNjbHh1SUNBZ0lDQWdkR2hsWVdRZ1BTQnlaWFF1YldGclpTQW5kR2hsWVdRbkxDQmtaV1poZFd4MGN5NTBhR1ZoWkZ4eVhHNGdJQ0FnSUNCMGFHVmhaRkp2ZHlBOUlIUm9aV0ZrTG0xaGEyVWdKM1J5SjF4eVhHNGdJQ0FnSUNCMFltOWtlU0E5SUhKbGRDNXRZV3RsSUNkMFltOWtlU2NzSUdSbFptRjFiSFJ6TG5SaWIyUjVYSEpjYmlBZ0lDQWdJSEp2ZDNNdWNIVnphQ0IwWW05a2VTNXRZV3RsSUNkMGNpZGNjbHh1SUNBZ0lISmxkRnh5WEc1Y2NseHVJQ0FqSUNNakl5QnNiMkZrUTJWc2JITmNjbHh1SUNBaklHbHVkR1Z5Ym1Gc0lHMWxkR2h2WkNCbmRXRnlZVzUwWldWeklIUm9ZWFFnZEdGaWJHVnpJR3h2WVdSbFpDQm1jbTl0SUVwVFQwNGdZWEpsSUdaMWJHeDVJR3h2WVdSbFpDQnBiblJ2SUcxbGJXOXllVnh5WEc0Z0lHeHZZV1JEWld4c2N5QTlJQ2dwSUMwK1hISmNiaUFnSUNCeUlEMGdNRnh5WEc0Z0lDQWdkMmhwYkdVZ2RHSnZaSGxiTUYwdWNtOTNjeTVzWlc1bmRHZ2dQaUJ5WEhKY2JpQWdJQ0FnSUdNZ1BTQXdYSEpjYmlBZ0lDQWdJRzFsYlZKdmR5QTlJR1ZzTG5KbGMzUnZjbVZGYkdWdFpXNTBJSFJpYjJSNVd6QmRMbkp2ZDNOYmNsMWNjbHh1SUNBZ0lDQWdjbTkzY3k1d2RYTm9JRzFsYlZKdmQxeHlYRzRnSUNBZ0lDQjNhR2xzWlNCMFltOWtlVnN3WFM1eWIzZHpXM0pkTG1ObGJHeHpMbXhsYm1kMGFDQStJR05jY2x4dUlDQWdJQ0FnSUNCdFpXMURaV3hzSUQwZ1kyVnNiSE11WjJWMElISXJNU3dnWXlzeFhISmNiaUFnSUNBZ0lDQWdhV1lnYm05MElHMWxiVU5sYkd4Y2NseHVJQ0FnSUNBZ0lDQWdJRzFsYlVObGJHd2dQU0JsYkM1eVpYTjBiM0psUld4bGJXVnVkQ0IwWW05a2VWc3dYUzV5YjNkelczSmRMbU5sYkd4elcyTmRYSEpjYmlBZ0lDQWdJQ0FnSUNCalpXeHNjeTV6WlhRZ2Npc3hMQ0JqS3pFc0lHMWxiVU5sYkd4Y2NseHVJQ0FnSUNBZ0lDQmpJQ3M5SURGY2NseHVJQ0FnSUNBZ2NpQXJQU0F4WEhKY2JseHlYRzRnSUNNZ0l5TWpJR1pwYkd4TmFYTnphVzVuWEhKY2JpQWdJeUJwYm5SbGNtNWhiQ0J0WlhSb2IyUWdaM1ZoY21GdWRHVmxjeUIwYUdGMElHTmxiR3h6SUdWNGFYTjBJR1p2Y2lCMGFHVWdaR2x0Wlc1emFXOXVjeUJ2WmlCMGFHVWdkR0ZpYkdWY2NseHVJQ0JtYVd4c1RXbHpjMmx1WnlBOUlDZ3BJQzArWEhKY2JpQWdJQ0JqWld4c2N5NWxZV05vSUNoeWIzZE9ieXdnWTI5c1RtOHNJSFpoYkNrZ0xUNWNjbHh1SUNBZ0lDQWdhV1lnYm05MElIWmhiRnh5WEc0Z0lDQWdJQ0FnSUhKdmR5QTlJSEpsZEM1eWIzY2djbTkzVG05Y2NseHVJQ0FnSUNBZ0lDQnliM2N1WTJWc2JDQmpiMnhPYnl3Z2UzMWNjbHh1WEhKY2JpQWdJeUFqSXlCamIyeDFiVzVjY2x4dUlDQWpJRUZrWkhNZ1lTQmpiMngxYlc0Z2JtRnRaU0IwYnlCMGFHVWdkR0ZpYkdVZ2FHVmhaRnh5WEc0Z0lISmxkQzVoWkdRZ0oyTnZiSFZ0Ymljc0lDaGpiMnhPYnl3Z1kyOXNUbUZ0WlNrZ0xUNWNjbHh1SUNBZ0lISmxkQzVwYm1sMEtDbGNjbHh1SUNBZ0lHTnZiSFZ0YmtOdmRXNTBJQ3M5SURGY2NseHVJQ0FnSUhSb0lEMGdiblZzYkZ4eVhHNGdJQ0FnYVNBOUlEQmNjbHh1SUNBZ0lIZG9hV3hsSUhSb1pXRmtXekJkTG5KdmQzTmJNRjB1WTJWc2JITXViR1Z1WjNSb0lEd2dZMjlzVG05Y2NseHVJQ0FnSUNBZ2JtRjBhWFpsVkdnZ1BTQjBhR1ZoWkZzd1hTNXliM2R6V3pCZExtTmxiR3h6VzJsZFhISmNiaUFnSUNBZ0lHbG1JRzV2ZENCdVlYUnBkbVZVYUZ4eVhHNGdJQ0FnSUNBZ0lIUm9JRDBnZEdobFlXUlNiM2N1YldGclpTQW5kR2duTENCN2ZWeHlYRzRnSUNBZ0lDQmxiSE5sWEhKY2JpQWdJQ0FnSUNBZ2RHZ2dQU0JsYkM1eVpYTjBiM0psUld4bGJXVnVkQ0J1WVhScGRtVlVhQ3dnSjNSb0oxeHlYRzRnSUNBZ0lDQnBJQ3M5SURGY2NseHVJQ0FnSUdsbUlHNXZkQ0IwYUZ4eVhHNGdJQ0FnSUNCdVlYUnBkbVZVYUNBOUlIUm9aV0ZrV3pCZExuSnZkM05iTUYwdVkyVnNiSE5iWTI5c1RtOHRNVjFjY2x4dUlDQWdJQ0FnZEdnZ1BTQmxiQzV5WlhOMGIzSmxSV3hsYldWdWRDQnVZWFJwZG1WVWFDd2dKM1JvSjF4eVhHNGdJQ0FnZEdndWRHVjRkQ0JqYjJ4T1lXMWxYSEpjYmlBZ0lDQjBhRnh5WEc1Y2NseHVJQ0FqSUNNaklISnZkMXh5WEc0Z0lDTWdRV1JrY3lCaElHNWxkeUJ5YjNjZ0tIUnlLU0IwYnlCMGFHVWdkR0ZpYkdVZ1ltOWtlVnh5WEc0Z0lISmxkQzVoWkdRZ0ozSnZkeWNzSUNoeWIzZE9ieXdnYjNCMGN5a2dMVDVjY2x4dUlDQWdJSEp2ZHlBOUlISnZkM05iY205M1RtOHRNVjFjY2x4dVhISmNiaUFnSUNCcFppQnViM1FnY205M1hISmNiaUFnSUNBZ0lIZG9hV3hsSUhKdmQzTXViR1Z1WjNSb0lEd2djbTkzVG05Y2NseHVJQ0FnSUNBZ0lDQnliM2NnUFNCMFltOWtlUzV0WVd0bElDZDBjaWNzSUh0OVhISmNiaUFnSUNBZ0lDQWdjbTkzY3k1d2RYTm9JSEp2ZDF4eVhHNWNjbHh1SUNBZ0lHbG1JRzV2ZENCeWIzY3VZMlZzYkZ4eVhHNGdJQ0FnSUNCeWIzY3VZV1JrSUNkalpXeHNKeXdnS0dOdmJFNXZMQ0J2Y0hSektTQXRQbHh5WEc0Z0lDQWdJQ0FnSUdObGJHd2dQU0JQU2k1dWIyUmxjeTUwWkNCdmNIUnpMQ0J5YjNkY2NseHVJQ0FnSUNBZ0lDQmpaV3hzY3k1elpYUWdjbTkzVG04c0lHTnZiRTV2TENCalpXeHNYSEpjYmlBZ0lDQWdJQ0FnWTJWc2JGeHlYRzVjY2x4dUlDQWdJSEp2ZDF4eVhHNWNjbHh1SUNBaklDTWpJR05sYkd4Y2NseHVJQ0FqSUVGa1pITWdZU0JqWld4c0lDaDBjaTkwWkNrZ2RHOGdkR2hsSUhSaFlteGxJR0p2WkhsY2NseHVJQ0J5WlhRdVlXUmtJQ2RqWld4c0p5d2dLSEp2ZDA1dkxDQmpiMnhPYnl3Z2IzQjBjeWtnTFQ1Y2NseHVJQ0FnSUdsbUlISnZkMDV2SUR3Z01TQjBhR1Z1SUhKdmQwNXZJRDBnTVZ4eVhHNGdJQ0FnYVdZZ1kyOXNUbThnUENBeElIUm9aVzRnWTI5c1RtOGdQU0F4WEhKY2JpQWdJQ0JwWmlCamIyeDFiVzVEYjNWdWRDQStJREFnWVc1a0lHTnZiRTV2TFRFZ1BpQmpiMngxYlc1RGIzVnVkQ0IwYUdWdUlIUm9jbTkzSUc1bGR5QkZjbkp2Y2lBblFTQmpiMngxYlc0Z2JtRnRaU0JvWVhNZ2JtOTBJR0psWlc0Z1pHVm1hVzVsWkNCbWIzSWdkR2hwY3lCd2IzTnBkR2x2YmlCN0p5QXJJSEp2ZDA1dklDc2dKM2duSUNzZ1kyOXNUbThnS3lBbmZTNG5YSEpjYmx4eVhHNGdJQ0FnY205M0lEMGdjbVYwTG5KdmR5QnliM2RPYjF4eVhHNWNjbHh1SUNBZ0lHTmxiR3dnUFNCalpXeHNjeTVuWlhRZ2NtOTNUbThzSUdOdmJFNXZYSEpjYmx4eVhHNGdJQ0FnYVdZZ2JtOTBJR05sYkd4Y2NseHVJQ0FnSUNBZ2FTQTlJREJjY2x4dUlDQWdJQ0FnZDJocGJHVWdhU0E4SUdOdmJFNXZYSEpjYmlBZ0lDQWdJQ0FnYVNBclBTQXhYSEpjYmlBZ0lDQWdJQ0FnYVdZZ2FTQnBjeUJqYjJ4T2IxeHlYRzRnSUNBZ0lDQWdJQ0FnYm5WUGNIUnpJRDBnVDBvdVpYaDBaVzVrSUh0d2NtOXdjem9nWkdWbVlYVnNkSE11WTJWc2JITjlMQ0J2Y0hSelhISmNiaUFnSUNBZ0lDQWdJQ0JqWld4c0lEMGdjbTkzTG1ObGJHd2dZMjlzVG04c0lHNTFUM0IwYzF4eVhHNGdJQ0FnSUNBZ0lHVnNjMlZjY2x4dUlDQWdJQ0FnSUNBZ0lIUnllVU5sYkd3Z1BTQmpaV3hzY3k1blpYUWdjbTkzVG04c0lHbGNjbHh1SUNBZ0lDQWdJQ0FnSUdsbUlHNXZkQ0IwY25sRFpXeHNYSEpjYmlBZ0lDQWdJQ0FnSUNBZ0lIUnllVU5sYkd3Z1BTQWdjbTkzTG1ObGJHd2dhU3dnY0hKdmNITTZJR1JsWm1GMWJIUnpMbU5sYkd4elhISmNibHh5WEc0Z0lDQWdZMlZzYkZ4eVhHNWNjbHh1SUNBaklDTWpJRVpwYm1Gc2FYcGxYSEpjYmlBZ0l5QkdhVzVoYkdsNlpTQm5kV0Z5WVc1MFpXVnpJSFJvWVhRZ2RHaGxZV1FnWVc1a0lIUmliMlI1SUdGdVpDQmpjbVZoZEdWa0lIZG9aVzRnZEdobElHNXZaR1VnYVhNZ1puVnNiSGtnYVc1emRHRnVkR2xoZEdWa1hISmNiaUFnYVc1cGRDZ3BYSEpjYmx4eVhHNGdJQ01nSXlNZ1ZFaGxZV1JjY2x4dUlDQWpJRVY0Y0c5elpTQjBhR1VnYVc1MFpYSnVZV3dnZEdobFlXUWdibTlrWlZ4eVhHNGdJSEpsZEM1aFpHUWdKM1JvWldGa0p5d2dkR2hsWVdSY2NseHVYSEpjYmlBZ0l5QWpJeUJVUW05a2VWeHlYRzRnSUNNZ1JYaHdiM05sSUhSb1pTQnBiblJsY201aGJDQjBZbTlrZVNCdWIyUmxYSEpjYmlBZ2NtVjBMbUZrWkNBbmRHSnZaSGtuTENCMFltOWtlVnh5WEc1Y2NseHVJQ0FnSUZ4eVhHNWNjbHh1SUNCeVpYUmNjbHh1WEhKY2JrOUtMbTV2WkdWekxuSmxaMmx6ZEdWeUlHNXZaR1ZPWVcxbExDQnViMlJsWEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2JtOWtaVnh5WEc0aVhYMD0iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuZW51bXMgPSByZXF1aXJlICcuLi90b29scy9lbnVtcydcclxuXHJcbm5vZGVOYW1lID0gJ3RleHRhcmVhJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBuYW1lOiAnJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogJydcclxuICAgICAgdmFsdWU6ICcnXHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICAgIG1heGxlbmd0aDogJydcclxuICAgICAgYXV0b2ZvY3VzOiBmYWxzZVxyXG4gICAgICBpc1JlcXVpcmVkOiBmYWxzZVxyXG4gICAgICByb3dzOiAzXHJcbiAgICAgIGNvbHM6IDI1XHJcbiAgICAgIGRpc2FibGVkOiBmYWxzZVxyXG4gICAgICByZWFkb25seTogZmFsc2VcclxuICAgICAgZm9ybTogJydcclxuICAgICAgd3JhcDogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHZhbHVlID0gZGVmYXVsdHMucHJvcHMudmFsdWVcclxuXHJcbiAgc3luY1ZhbHVlID0gLT5cclxuICAgIHN3aXRjaCBkZWZhdWx0cy5wcm9wcy50eXBlXHJcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5jaGVja2JveFxyXG4gICAgICAgIHZhbHVlID0gcmV0LiQuaXMoJzpjaGVja2VkJylcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLnJhZGlvXHJcbiAgICAgICAgdmFsdWUgPSByZXQuJC5maW5kKCc6Y2hlY2tlZCcpLnZhbCgpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICB2YWx1ZSA9IHJldC52YWwoKVxyXG5cclxuICAjIENsaWNrIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIHJldHZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuXHJcbiAgIyBDaGFuZ2UgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICBjaGFuZ2UgPSBkZWZhdWx0cy5ldmVudHMuY2hhbmdlXHJcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG5ub2RlTmFtZSA9ICd0aGVhZCdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczoge31cclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIG51bWJlcjogMVxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcm93cyA9IFtdXHJcbiAgY2VsbHMgPSB7fVxyXG4gIHJldC5hZGQgJ2NlbGwnLCAocm93Tm8sIGNvbE5vKSAtPlxyXG4gICAgaW5pdCgpXHJcblxyXG4gICAgaWYgcm93Tm8gPCAxIHRoZW4gcm93Tm8gPSAxXHJcbiAgICBpZiBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcclxuXHJcbiAgICByb3cgPSByb3dzW3Jvd05vLTFdXHJcblxyXG4gICAgaWYgbm90IHJvd1xyXG4gICAgICB3aGlsZSByb3dzLmxlbmd0aCA8IHJvd05vXHJcbiAgICAgICAgcm93ID0gT0oubm9kZXMudHIge30sIHRib2R5LCBmYWxzZVxyXG4gICAgICAgIHJvd3MucHVzaCByb3dcclxuXHJcbiAgICB0ZCA9IHJvd1swXS5jZWxsc1tjb2xOb11cclxuXHJcbiAgICBpZiB0ZCB0aGVuIGNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCB0ZCwgJ3RkJ1xyXG4gICAgaWYgbm90IHRkXHJcbiAgICAgIHdoaWxlIHJvd1swXS5jZWxscy5sZW5ndGggPCBjb2xOb1xyXG4gICAgICAgIGlkeCA9IHJvd1swXS5jZWxscy5sZW5ndGhcclxuICAgICAgICB0ZCA9IHJvd1swXS5jZWxsc1tpZHgtMV1cclxuICAgICAgICBpZiB0ZCBhbmQgaWR4IGlzIGNvbE5vXHJcbiAgICAgICAgICBjZWxsID0gZWwucmVzdG9yZUVsZW1lbnQgdGQsICd0ZCdcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBjZWxsID0gT0oubm9kZXMudGQgcHJvcHM6IGRlZmF1bHRzLmNlbGxzLCByb3csIGZhbHNlXHJcblxyXG4gICAgaWYgbm90IGNlbGwuaXNWYWxpZFxyXG4gICAgICBub2RlRmFjdG9yeSBjZWxsLCByb3csIHJvd05vICsgY29sTm9cclxuXHJcbiAgICBjZWxsXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxubm9kZU5hbWUgPSAndWwnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciB0aGlzR2xvYmFsO1xuXG50aGlzR2xvYmFsID0gKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnICYmIGdsb2JhbCA/IGdsb2JhbCA6ICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgc2VsZiA/IHNlbGYgOiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93ID8gd2luZG93IDogdGhpcykpKTtcblxubW9kdWxlLmV4cG9ydHMgPSB0aGlzR2xvYmFsO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1RNlhGeEhhWFJvZFdKY1hHOXFYRnh6Y21OY1hHTnZabVpsWlZ4Y1oyeHZZbUZzTG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPMEZCUVVFc1NVRkJRVHM3UVVGQlFTeFZRVUZCTEVkQlFXRXNRMEZCU3l4UFFVRlBMRTFCUVZBc1MwRkJiVUlzVjBGQmJrSXNTVUZCYlVNc1RVRkJka01zUjBGQmIwUXNUVUZCY0VRc1IwRkJaMFVzUTBGQlN5eFBRVUZQTEVsQlFWQXNTMEZCYVVJc1YwRkJha0lzU1VGQmFVTXNTVUZCY2tNc1IwRkJaMFFzU1VGQmFFUXNSMEZCTUVRc1EwRkJTeXhQUVVGUExFMUJRVkFzUzBGQmJVSXNWMEZCYmtJc1NVRkJiVU1zVFVGQmRrTXNSMEZCYjBRc1RVRkJjRVFzUjBGQlowVXNTVUZCYWtVc1EwRkJNMFFzUTBGQmFrVTdPMEZCUTJJc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSWlMQ0ptYVd4bElqb2laMlZ1WlhKaGRHVmtMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW5Sb2FYTkhiRzlpWVd3Z1BTQW9hV1lnS0hSNWNHVnZaaUJuYkc5aVlXd2dhWE51ZENBbmRXNWtaV1pwYm1Wa0p5QmhibVFnWjJ4dlltRnNLU0IwYUdWdUlHZHNiMkpoYkNCbGJITmxJQ2hwWmlBb2RIbHdaVzltSUhObGJHWWdhWE51ZENBbmRXNWtaV1pwYm1Wa0p5QmhibVFnYzJWc1ppa2dkR2hsYmlCelpXeG1JR1ZzYzJVZ0tHbG1JQ2gwZVhCbGIyWWdkMmx1Wkc5M0lHbHpiblFnSjNWdVpHVm1hVzVsWkNjZ1lXNWtJSGRwYm1SdmR5a2dkR2hsYmlCM2FXNWtiM2NnWld4elpTQjBhR2x6S1NrcFhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlIUm9hWE5IYkc5aVlXd2lYWDA9IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdidXR0b25pbnB1dCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogJ2J1dHRvbidcbiAgICAgIHNyYzogJydcbiAgICAgIGFsdDogJydcbiAgICAgIGhlaWdodDogJydcbiAgICAgIHdpZHRoOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuXG5cbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnY2hlY2tib3gnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBjaGVja2VkOiBmYWxzZVxuICAgIGluZGV0ZXJtaW5hdGU6IGZhbHNlXG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBvYmouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIGlmIGRlZmF1bHRzLmNoZWNrZWRcbiAgICByZXQuYXR0ciAnY2hlY2tlZCcsIHRydWVcbiAgZWxzZSBpZiBkZWZhdWx0cy5pbmRldGVybWluYXRlXG4gICAgcmV0LmF0dHIgJ2luZGV0ZXJtaW5hdGUnLCB0cnVlXG5cbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnY29sb3InXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnZGF0ZSdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2RhdGV0aW1lJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdkYXRldGltZS1sb2NhbCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnZW1haWwnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgbXVsdGlwbGU6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnZmlsZSdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgICBhY2NlcHQ6ICcnXG4gICAgICBtdWx0aXBsZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdoaWRkZW4nXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2ltYWdlaW5wdXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6ICdpbWFnZSdcbiAgICAgIHNyYzogJydcbiAgICAgIGFsdDogJydcbiAgICAgIGhlaWdodDogJydcbiAgICAgIHdpZHRoOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ21vbnRoJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdudW1iZXInXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3Bhc3N3b3JkJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIG1heGxlbmd0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdyYWRpbydcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgICBuYW1lOiAnJ1xuICAgICAgdmFsdWU6ICcnXG4gICAgICBjaGVja2VkOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3JhbmdlJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIG1pbjogMFxuICAgICAgbWF4OiAxMDBcbiAgICAgIHZhbHVlOiA1MFxuICAgICAgc3RlcDogMVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3Jlc2V0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdzZWFyY2gnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3N1Ym1pdCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAndGVsJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIHBhdHRlcm46ICcnXG4gICAgICBtYXhsZW5ndGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAndGV4dGlucHV0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiAndGV4dCdcbiAgICAgIGF1dG9jb21wbGV0ZTogJ29uJ1xuICAgICAgYXV0b3NhdmU6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAndGltZSdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAndXJsJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIHBhdHRlcm46ICcnXG4gICAgICBtYXhsZW5ndGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnd2VlaydcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBOc1RyZWUsIG1ha2VUaGVKdWljZSwgbmFtZVNwYWNlTmFtZSwgdGhpc0RvY3VtZW50LCB0aGlzR2xvYmFsLCB1dGlsTGliO1xuXG50aGlzR2xvYmFsID0gcmVxdWlyZSgnLi9nbG9iYWwnKTtcblxudXRpbExpYiA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxubmFtZVNwYWNlTmFtZSA9ICdPSic7XG5cblxuLypcbmJvb3Qgc3RyYXAgbmFtZSBtZXRob2QgaW50byBPYmplY3QgcHJvdG90eXBlXG4gKi9cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoT2JqZWN0LnByb3RvdHlwZSwge1xuICBnZXRJbnN0YW5jZU5hbWU6IHtcbiAgICB2YWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZnVuY05hbWVSZWdleCwgcmVzdWx0cztcbiAgICAgIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC57MSx9KVxcKC87XG4gICAgICByZXN1bHRzID0gZnVuY05hbWVSZWdleC5leGVjKHRoaXMuY29uc3RydWN0b3IudG9TdHJpbmcoKSk7XG4gICAgICBpZiAocmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNbMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuXG4vKlxuQW4gaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5hbWVzcGFjZSB0cmVlXG4gKi9cblxuTnNUcmVlID0ge307XG5cbm1ha2VUaGVKdWljZSA9IGZ1bmN0aW9uKCkge1xuXG4gIC8qXG4gIEludGVybmFsIG5hbWVTcGFjZU5hbWUgbWV0aG9kIHRvIGNyZWF0ZSBuZXcgJ3N1YicgbmFtZXNwYWNlcyBvbiBhcmJpdHJhcnkgY2hpbGQgb2JqZWN0cy5cbiAgICovXG4gIHZhciBOc091dCwgZGVwZW5kc09uLCBtYWtlTmFtZVNwYWNlLCBuc0ludGVybmFsO1xuICBtYWtlTmFtZVNwYWNlID0gZnVuY3Rpb24oc3BhY2VuYW1lLCB0cmVlKSB7XG5cbiAgICAvKlxuICAgIFRoZSBkZXJpdmVkIGluc3RhbmNlIHRvIGJlIGNvbnN0cnVjdGVkXG4gICAgICovXG4gICAgdmFyIEJhc2UsIENsYXNzO1xuICAgIEJhc2UgPSBmdW5jdGlvbihuc05hbWUpIHtcbiAgICAgIHZhciBtZW1iZXJzLCBuc1RyZWUsIHByb3RvO1xuICAgICAgcHJvdG8gPSB0aGlzO1xuICAgICAgdHJlZVtuc05hbWVdID0gdHJlZVtuc05hbWVdIHx8IHt9O1xuICAgICAgbnNUcmVlID0gdHJlZVtuc05hbWVdO1xuICAgICAgbWVtYmVycyA9IHt9O1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdtZW1iZXJzJywge1xuICAgICAgICB2YWx1ZTogbWVtYmVyc1xuXG4gICAgICAgIC8qXG4gICAgICAgIFJlZ2lzdGVyIChlLmcuICdMaWZ0JykgYW4gT2JqZWN0IGludG8gdGhlIHByb3RvdHlwZSBvZiB0aGUgbmFtZXNwYWNlLlxuICAgICAgICBUaGlzIE9iamVjdCB3aWxsIGJlIHJlYWRhYmxlL2V4ZWN1dGFibGUgYnV0IGlzIG90aGVyd2lzZSBpbW11dGFibGUuXG4gICAgICAgICAqL1xuICAgICAgfSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3JlZ2lzdGVyJywge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24obmFtZSwgb2JqLCBlbnVtZXJhYmxlKSB7XG4gICAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICAgIGlmICgodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB8fCBuYW1lID09PSAnJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbGlmdCBhIG5ldyBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgbmFtZS4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFvYmopIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIHByb3BlcnR5IGluc3RhbmNlLicpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocHJvdG9bbmFtZV0pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgbmFtZWQgJyArIG5hbWUgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWVtYmVyc1tuYW1lXSA9IG1lbWJlcnNbbmFtZV0gfHwgbmFtZTtcbiAgICAgICAgICBuc1RyZWVbbmFtZV0gPSBuc1RyZWVbbmFtZV0gfHwge1xuICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgIHR5cGU6IHR5cGVvZiBvYmosXG4gICAgICAgICAgICBpbnN0YW5jZTogKG9iai5nZXRJbnN0YW5jZU5hbWUgPyBvYmouZ2V0SW5zdGFuY2VOYW1lKCkgOiAndW5rbm93bicpXG4gICAgICAgICAgfTtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvdG8sIG5hbWUsIHtcbiAgICAgICAgICAgIHZhbHVlOiBvYmosXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSAhPT0gZW51bWVyYWJsZVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzKG5zTmFtZSArICcuJyArIHNwYWNlbmFtZSArICcuJyArIG5hbWUpO1xuICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvKlxuICAgICAgQ3JlYXRlIGEgbmV3LCBzdGF0aWMgbmFtZXNwYWNlIG9uIHRoZSBjdXJyZW50IHBhcmVudCAoZS5nLiBuc05hbWUudG8uLi4gfHwgbnNOYW1lLmlzLi4uKVxuICAgICAgICovXG4gICAgICBwcm90by5yZWdpc3RlcignbWFrZVN1Yk5hbWVTcGFjZScsIChmdW5jdGlvbihzdWJOYW1lU3BhY2UpIHtcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xuICAgICAgICB2YXIgbmV3TmFtZVNwYWNlO1xuICAgICAgICBpZiAoKHR5cGVvZiBzdWJOYW1lU3BhY2UgIT09ICdzdHJpbmcnKSB8fCBzdWJOYW1lU3BhY2UgPT09ICcnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbmV3IHN1YiBuYW1lc3BhY2Ugd2l0aG91dCBhIHZhbGlkIG5hbWUuJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb3RvLnN1Yk5hbWVTcGFjZSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU3ViIG5hbWVzcGFjZSBuYW1lZCAnICsgc3ViTmFtZVNwYWNlICsgJyBpcyBhbHJlYWR5IGRlZmluZWQgb24gJyArIHNwYWNlbmFtZSArICcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgbnNJbnRlcm5hbC5hbGVydERlcGVuZGVudHMobnNOYW1lICsgJy4nICsgc3ViTmFtZVNwYWNlKTtcbiAgICAgICAgbmV3TmFtZVNwYWNlID0gbWFrZU5hbWVTcGFjZShzdWJOYW1lU3BhY2UsIG5zVHJlZSk7XG4gICAgICAgIGlmIChzdWJOYW1lU3BhY2UgIT09ICdjb25zdGFudHMnKSB7XG4gICAgICAgICAgbmV3TmFtZVNwYWNlLnJlZ2lzdGVyKCdjb25zdGFudHMnLCBtYWtlTmFtZVNwYWNlKCdjb25zdGFudHMnLCBuc1RyZWUpLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJvdG8ucmVnaXN0ZXIoc3ViTmFtZVNwYWNlLCBuZXdOYW1lU3BhY2UsIGZhbHNlKTtcbiAgICAgICAgcmV0dXJuIG5ld05hbWVTcGFjZTtcbiAgICAgIH0pLCBmYWxzZSk7XG4gICAgfTtcblxuICAgIC8qXG4gICAgQW4gaW50ZXJuYWwgbWVjaGFuaXNtIHRvIHJlcHJlc2VudCB0aGUgaW5zdGFuY2Ugb2YgdGhpcyBuYW1lc3BhY2VcbiAgICBAY29uc3RydWN0b3JcbiAgICBAaW50ZXJuYWxcbiAgICBAbWVtYmVyT2YgbWFrZU5hbWVTcGFjZVxuICAgICAqL1xuICAgIENsYXNzID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gZnVuY3Rpb24gJyArIHNwYWNlbmFtZSArICcoKXt9JykoKTtcbiAgICBDbGFzcy5wcm90b3R5cGUgPSBuZXcgQmFzZShzcGFjZW5hbWUpO1xuICAgIHJldHVybiBuZXcgQ2xhc3Moc3BhY2VuYW1lKTtcbiAgfTtcblxuICAvKlxuICAnRGVwZW5kJyBhbiBPYmplY3QgdXBvbiBhbm90aGVyIG1lbWJlciBvZiB0aGlzIG5hbWVzcGFjZSwgdXBvbiBhbm90aGVyIG5hbWVzcGFjZSxcbiAgb3IgdXBvbiBhIG1lbWJlciBvZiBhbm90aGVyIG5hbWVzcGFjZVxuICAgKi9cbiAgZGVwZW5kc09uID0gZnVuY3Rpb24oZGVwZW5kZW5jaWVzLCBjYWxsQmFjaywgaW1wb3J0cykge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgbWlzc2luZywgbnNNZW1iZXJzLCByZXQ7XG4gICAgcmV0ID0gZmFsc2U7XG4gICAgbnNNZW1iZXJzID0gbnNJbnRlcm5hbC5nZXROc01lbWJlcnMoKTtcbiAgICBpZiAoZGVwZW5kZW5jaWVzICYmIGRlcGVuZGVuY2llcy5sZW5ndGggPiAwICYmIGNhbGxCYWNrKSB7XG4gICAgICBtaXNzaW5nID0gZGVwZW5kZW5jaWVzLmZpbHRlcihmdW5jdGlvbihkZXBlbikge1xuICAgICAgICByZXR1cm4gbnNNZW1iZXJzLmluZGV4T2YoZGVwZW4pID09PSAtMSAmJiAoIWltcG9ydHMgfHwgaW1wb3J0cyAhPT0gZGVwZW4pO1xuICAgICAgfSk7XG4gICAgICBpZiAobWlzc2luZy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgY2FsbEJhY2soKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5zSW50ZXJuYWwuZGVwZW5kZW50cy5wdXNoKGZ1bmN0aW9uKGltcG9ydHMpIHtcbiAgICAgICAgICByZXR1cm4gZGVwZW5kc09uKG1pc3NpbmcsIGNhbGxCYWNrLCBpbXBvcnRzKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH07XG4gIG5zSW50ZXJuYWwgPSB7XG4gICAgZGVwZW5kZW50czogW11cblxuICAgIC8qXG4gICAgRmV0Y2hlcyB0aGUgcmVnaXN0ZXJlZCBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIG9uIHRoZSBuYW1lc3BhY2UgYW5kIGl0cyBjaGlsZCBuYW1lc3BhY2VzXG4gICAgICovXG4gIH07XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuc0ludGVybmFsLCAnZ2V0TnNNZW1iZXJzJywge1xuICAgIHZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBtZW1iZXJzLCByZWN1cnNlVHJlZTtcbiAgICAgIHJlY3Vyc2VUcmVlID0gZnVuY3Rpb24oa2V5LCBsYXN0S2V5KSB7XG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIG1lbWJlcnMucHVzaChsYXN0S2V5ICsgJy4nICsga2V5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXRpbExpYi5pc1BsYWluT2JqZWN0KGtleSkpIHtcbiAgICAgICAgICBPYmplY3Qua2V5cyhrZXkpLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICBtZW1iZXJzLnB1c2gobGFzdEtleSArICcuJyArIGspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHV0aWxMaWIuaXNQbGFpbk9iamVjdChrZXlba10pKSB7XG4gICAgICAgICAgICAgIHJlY3Vyc2VUcmVlKGtleVtrXSwgbGFzdEtleSArICcuJyArIGspO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgbWVtYmVycyA9IFtdO1xuICAgICAgT2JqZWN0LmtleXMoTnNUcmVlW25hbWVTcGFjZU5hbWVdKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICBpZiAodXRpbExpYi5pc1BsYWluT2JqZWN0KE5zVHJlZVtuYW1lU3BhY2VOYW1lXVtrZXldKSkge1xuICAgICAgICAgIHJlY3Vyc2VUcmVlKE5zVHJlZVtuYW1lU3BhY2VOYW1lXVtrZXldLCBuYW1lU3BhY2VOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gbWVtYmVycztcbiAgICB9XG4gIH0pO1xuXG4gIC8qXG4gIFRvIHN1cHBvcnQgZGVwZW5kZW5jeSBtYW5hZ2VtZW50LCB3aGVuIGEgcHJvcGVydHkgaXMgbGlmdGVkIG9udG8gdGhlIG5hbWVzcGFjZSwgbm90aWZ5IGRlcGVuZGVudHMgdG8gaW5pdGlhbGl6ZVxuICAgKi9cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG5zSW50ZXJuYWwsICdhbGVydERlcGVuZGVudHMnLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKGltcG9ydHMpIHtcbiAgICAgIHZhciBkZXBzO1xuICAgICAgZGVwcyA9IG5zSW50ZXJuYWwuZGVwZW5kZW50cy5maWx0ZXIoZnVuY3Rpb24oZGVwT24pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlID09PSBkZXBPbihpbXBvcnRzKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGVwcykpIHtcbiAgICAgICAgcmV0dXJuIG5zSW50ZXJuYWwuZGVwZW5kZW50cyA9IGRlcHM7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgTnNUcmVlW25hbWVTcGFjZU5hbWVdID0ge307XG4gIE5zT3V0ID0gbWFrZU5hbWVTcGFjZShuYW1lU3BhY2VOYW1lLCBOc1RyZWVbbmFtZVNwYWNlTmFtZV0pO1xuXG4gIC8qXG4gIENhY2hlIGEgaGFuZGxlIG9uIHRoZSB2ZW5kb3IgKHByb2JhYmx5IGpRdWVyeSkgb24gdGhlIHJvb3QgbmFtZXNwYWNlXG4gICAqL1xuICBOc091dC5yZWdpc3RlcignPycsIHV0aWxMaWIsIGZhbHNlKTtcblxuICAvKlxuICBDYWNoZSB0aGUgdHJlZSAodXNlZnVsIGZvciBkb2N1bWVudGF0aW9uL3Zpc3VhbGl6YXRpb24vZGVidWdnaW5nKVxuICAgKi9cbiAgTnNPdXQucmVnaXN0ZXIoJ3RyZWUnLCBOc1RyZWVbbmFtZVNwYWNlTmFtZV0sIGZhbHNlKTtcblxuICAvKlxuICBDYWNoZSB0aGUgbmFtZSBzcGFjZSBuYW1lXG4gICAqL1xuICBOc091dC5yZWdpc3RlcignbmFtZScsIG5hbWVTcGFjZU5hbWUsIGZhbHNlKTtcbiAgTnNPdXQucmVnaXN0ZXIoJ2RlcGVuZHNPbicsIGRlcGVuZHNPbiwgZmFsc2UpO1xuICByZXR1cm4gTnNPdXQ7XG59O1xuXG5cbi8qXG5BY3R1YWxseSBkZWZpbmUgdGhlIE9KIE5hbWVTcGFjZVxuICovXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzR2xvYmFsLCBuYW1lU3BhY2VOYW1lLCB7XG4gIHZhbHVlOiBtYWtlVGhlSnVpY2UoKVxufSk7XG5cbk9KLnJlZ2lzdGVyKCdnbG9iYWwnLCB0aGlzR2xvYmFsKTtcblxudGhpc0RvY3VtZW50ID0ge307XG5cbmlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gIHRoaXNEb2N1bWVudCA9IGRvY3VtZW50O1xufVxuXG5PSi5yZWdpc3RlcignZG9jdW1lbnQnLCB0aGlzRG9jdW1lbnQpO1xuXG5PSi5yZWdpc3Rlcignbm9vcCcsIGZ1bmN0aW9uKCkge30pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9KO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1RNlhGeEhhWFJvZFdKY1hHOXFYRnh6Y21OY1hHTnZabVpsWlZ4Y2Iyb3VZMjltWm1WbElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkRRU3hKUVVGQk96dEJRVUZCTEZWQlFVRXNSMEZCWVN4UFFVRkJMRU5CUVZFc1ZVRkJVanM3UVVGRFlpeFBRVUZCTEVkQlFWVXNUMEZCUVN4RFFVRlJMRkZCUVZJN08wRkJRMVlzWVVGQlFTeEhRVUZuUWpzN08wRkJSV2hDT3pzN08wRkJSMEVzVFVGQlRTeERRVUZETEdkQ1FVRlFMRU5CUVhkQ0xFMUJRVTBzUTBGQlFTeFRRVUU1UWl4RlFVTkZPMFZCUVVFc1pVRkJRU3hGUVVORk8wbEJRVUVzUzBGQlFTeEZRVUZQTEZOQlFVRTdRVUZEVEN4VlFVRkJPMDFCUVVFc1lVRkJRU3hIUVVGblFqdE5RVU5vUWl4UFFVRkJMRWRCUVZjc1lVRkJZeXhEUVVGRExFbEJRV2hDTEVOQlFYRkNMRWxCUVVNc1EwRkJRU3hYUVVGWExFTkJRVU1zVVVGQllpeERRVUZCTEVOQlFYSkNPMDFCUTFRc1NVRkJTU3hQUVVGQkxFbEJRVmtzVDBGQlR5eERRVUZETEUxQlFWSXNSMEZCYVVJc1EwRkJha003WlVGQmVVTXNUMEZCVVN4RFFVRkJMRU5CUVVFc1JVRkJha1E3VDBGQlFTeE5RVUZCTzJWQlFYbEVMRWRCUVhwRU96dEpRVWhKTEVOQlFWQTdSMEZFUmp0RFFVUkdPenM3UVVGUlFUczdPenRCUVVkQkxFMUJRVUVzUjBGQlV6czdRVUZEVkN4WlFVRkJMRWRCUVdVc1UwRkJRVHM3UVVGRllqczdPMEZCUVVFc1RVRkJRVHRGUVVkQkxHRkJRVUVzUjBGQlowSXNVMEZCUXl4VFFVRkVMRVZCUVZrc1NVRkJXanM3UVVGRFpEczdPMEZCUVVFc1VVRkJRVHRKUVVkQkxFbEJRVUVzUjBGQlR5eFRRVUZETEUxQlFVUTdRVUZEVEN4VlFVRkJPMDFCUVVFc1MwRkJRU3hIUVVGUk8wMUJRMUlzU1VGQlN5eERRVUZCTEUxQlFVRXNRMEZCVEN4SFFVRmxMRWxCUVVzc1EwRkJRU3hOUVVGQkxFTkJRVXdzU1VGQlowSTdUVUZETDBJc1RVRkJRU3hIUVVGVExFbEJRVXNzUTBGQlFTeE5RVUZCTzAxQlEyUXNUMEZCUVN4SFFVRlZPMDFCUlZZc1RVRkJUU3hEUVVGRExHTkJRVkFzUTBGQmMwSXNTVUZCZEVJc1JVRkJORUlzVTBGQk5VSXNSVUZCZFVNN1VVRkJRU3hMUVVGQkxFVkJRVTg3TzBGQlJUbERPenM3VjBGR2RVTTdUMEZCZGtNN1RVRk5RU3hOUVVGTkxFTkJRVU1zWTBGQlVDeERRVUZ6UWl4SlFVRjBRaXhGUVVFMFFpeFZRVUUxUWl4RlFVTkZPMUZCUVVFc1MwRkJRU3hGUVVGUExGTkJRVU1zU1VGQlJDeEZRVUZQTEVkQlFWQXNSVUZCV1N4VlFVRmFPMVZCUTB3N1ZVRkRRU3hKUVVGM1JTeERRVUZETEU5QlFVOHNTVUZCVUN4TFFVRnBRaXhSUVVGc1FpeERRVUZCTEVsQlFTdENMRWxCUVVFc1MwRkJVU3hGUVVFdlJ6dEJRVUZCTEd0Q1FVRlZMRWxCUVVFc1MwRkJRU3hEUVVGTkxHdEVRVUZPTEVWQlFWWTdPMVZCUTBFc1NVRkJRU3hEUVVGNVJpeEhRVUY2Ump0QlFVRkJMR3RDUVVGVkxFbEJRVUVzUzBGQlFTeERRVUZOTEN0RVFVRk9MRVZCUVZZN08xVkJRMEVzU1VGQk5FWXNTMEZCVFN4RFFVRkJMRWxCUVVFc1EwRkJiRWM3UVVGQlFTeHJRa0ZCVlN4SlFVRkJMRXRCUVVFc1EwRkJUU3hwUWtGQlFTeEhRVUZ2UWl4SlFVRndRaXhIUVVFeVFpeDVRa0ZCTTBJc1IwRkJkVVFzVTBGQmRrUXNSMEZCYlVVc1IwRkJla1VzUlVGQlZqczdWVUZGUVN4UFFVRlJMRU5CUVVFc1NVRkJRU3hEUVVGU0xFZEJRV2RDTEU5QlFWRXNRMEZCUVN4SlFVRkJMRU5CUVZJc1NVRkJhVUk3VlVGSGFrTXNUVUZCVHl4RFFVRkJMRWxCUVVFc1EwRkJVQ3hIUVVGbExFMUJRVThzUTBGQlFTeEpRVUZCTEVOQlFWQXNTVUZEWWp0WlFVRkJMRWxCUVVFc1JVRkJUU3hKUVVGT08xbEJRMEVzU1VGQlFTeEZRVUZOTEU5QlFVOHNSMEZFWWp0WlFVVkJMRkZCUVVFc1JVRkJWU3hEUVVGSkxFZEJRVWNzUTBGQlF5eGxRVUZRTEVkQlFUUkNMRWRCUVVjc1EwRkJReXhsUVVGS0xFTkJRVUVzUTBGQk5VSXNSMEZCZFVRc1UwRkJlRVFzUTBGR1ZqczdWVUZKUml4TlFVRk5MRU5CUVVNc1kwRkJVQ3hEUVVGelFpeExRVUYwUWl4RlFVRTJRaXhKUVVFM1FpeEZRVU5GTzFsQlFVRXNTMEZCUVN4RlFVRlBMRWRCUVZBN1dVRkRRU3hWUVVGQkxFVkJRVmtzUzBGQlFTeExRVUZYTEZWQlJIWkNPMWRCUkVZN1ZVRkpRU3hWUVVGVkxFTkJRVU1zWlVGQldDeERRVUV5UWl4TlFVRkJMRWRCUVZNc1IwRkJWQ3hIUVVGbExGTkJRV1lzUjBGQk1rSXNSMEZCTTBJc1IwRkJhVU1zU1VGQk5VUTdhVUpCUTBFN1VVRnVRa3NzUTBGQlVEdFBRVVJHT3p0QlFYVkNRVHM3TzAxQlIwRXNTMEZCU3l4RFFVRkRMRkZCUVU0c1EwRkJaU3hyUWtGQlppeEZRVUZ0UXl4RFFVRkRMRk5CUVVNc1dVRkJSRHRSUVVOc1F6dEJRVUZCTEZsQlFVRTdVVUZEUVN4SlFVRXJSU3hEUVVGRExFOUJRVThzV1VGQlVDeExRVUY1UWl4UlFVRXhRaXhEUVVGQkxFbEJRWFZETEZsQlFVRXNTMEZCWjBJc1JVRkJkRWs3UVVGQlFTeG5Ra0ZCVlN4SlFVRkJMRXRCUVVFc1EwRkJUU3g1UkVGQlRpeEZRVUZXT3p0UlFVTkJMRWxCUVhsSExFdEJRVXNzUTBGQlF5eFpRVUV2Unp0QlFVRkJMR2RDUVVGVkxFbEJRVUVzUzBGQlFTeERRVUZOTEhOQ1FVRkJMRWRCUVhsQ0xGbEJRWHBDTEVkQlFYZERMSGxDUVVGNFF5eEhRVUZ2UlN4VFFVRndSU3hIUVVGblJpeEhRVUYwUml4RlFVRldPenRSUVVOQkxGVkJRVlVzUTBGQlF5eGxRVUZZTEVOQlFUSkNMRTFCUVVFc1IwRkJVeXhIUVVGVUxFZEJRV1VzV1VGQk1VTTdVVUZEUVN4WlFVRkJMRWRCUVdVc1lVRkJRU3hEUVVGakxGbEJRV1FzUlVGQk5FSXNUVUZCTlVJN1VVRkRaaXhKUVVGcFJpeFpRVUZCTEV0QlFXdENMRmRCUVc1SE8xVkJRVUVzV1VGQldTeERRVUZETEZGQlFXSXNRMEZCYzBJc1YwRkJkRUlzUlVGQmJVTXNZVUZCUVN4RFFVRmpMRmRCUVdRc1JVRkJNa0lzVFVGQk0wSXNRMEZCYmtNc1JVRkJkVVVzUzBGQmRrVXNSVUZCUVRzN1VVRkRRU3hMUVVGTExFTkJRVU1zVVVGQlRpeERRVUZsTEZsQlFXWXNSVUZCTmtJc1dVRkJOMElzUlVGQk1rTXNTMEZCTTBNN1pVRkRRVHROUVZKclF5eERRVUZFTEVOQlFXNURMRVZCVTBjc1MwRlVTRHRKUVhSRFN6czdRVUZyUkZBN096czdPenRKUVUxQkxFdEJRVUVzUjBGQldTeEpRVUZCTEZGQlFVRXNRMEZCVXl4clFrRkJRU3hIUVVGeFFpeFRRVUZ5UWl4SFFVRnBReXhOUVVFeFF5eERRVUZCTEVOQlFVRTdTVUZEV2l4TFFVRkxMRU5CUVVFc1UwRkJUQ3hIUVVGakxFbEJRVUVzU1VGQlFTeERRVUZMTEZOQlFVdzdWMEZIVml4SlFVRkJMRXRCUVVFc1EwRkJUU3hUUVVGT08wVkJhRVZWT3p0QlFXdEZhRUk3T3pzN1JVRkpRU3hUUVVGQkxFZEJRVmtzVTBGQlF5eFpRVUZFTEVWQlFXVXNVVUZCWml4RlFVRjVRaXhQUVVGNlFqdEpRVU5XTzBGQlFVRXNVVUZCUVR0SlFVTkJMRWRCUVVFc1IwRkJUVHRKUVVOT0xGTkJRVUVzUjBGQldTeFZRVUZWTEVOQlFVTXNXVUZCV0N4RFFVRkJPMGxCUTFvc1NVRkJSeXhaUVVGQkxFbEJRV2xDTEZsQlFWa3NRMEZCUXl4TlFVRmlMRWRCUVhOQ0xFTkJRWFpETEVsQlFUWkRMRkZCUVdoRU8wMUJRMFVzVDBGQlFTeEhRVUZWTEZsQlFWa3NRMEZCUXl4TlFVRmlMRU5CUVc5Q0xGTkJRVU1zUzBGQlJEdGxRVU0xUWl4VFFVRlRMRU5CUVVNc1QwRkJWaXhEUVVGclFpeExRVUZzUWl4RFFVRkJMRXRCUVRSQ0xFTkJRVU1zUTBGQk4wSXNTVUZCYlVNc1EwRkJReXhEUVVGSkxFOUJRVW9zU1VGQlpTeFBRVUZCTEV0QlFXRXNTMEZCTjBJN1RVRkVVQ3hEUVVGd1FqdE5RVWRXTEVsQlFVY3NUMEZCVHl4RFFVRkRMRTFCUVZJc1MwRkJhMElzUTBGQmNrSTdVVUZEUlN4SFFVRkJMRWRCUVUwN1VVRkRUaXhSUVVGQkxFTkJRVUVzUlVGR1JqdFBRVUZCTEUxQlFVRTdVVUZKUlN4VlFVRlZMRU5CUVVNc1ZVRkJWU3hEUVVGRExFbEJRWFJDTEVOQlFUSkNMRk5CUVVNc1QwRkJSRHRwUWtGRGVrSXNVMEZCUVN4RFFVRlZMRTlCUVZZc1JVRkJiVUlzVVVGQmJrSXNSVUZCTmtJc1QwRkJOMEk3VVVGRWVVSXNRMEZCTTBJc1JVRktSanRQUVVwR096dFhRVmRCTzBWQlpsVTdSVUZuUWxvc1ZVRkJRU3hIUVVGaE8wbEJRVUVzVlVGQlFTeEZRVUZaT3p0QlFVVjZRanM3VDBGR1lUczdSVUZMWWl4TlFVRk5MRU5CUVVNc1kwRkJVQ3hEUVVGelFpeFZRVUYwUWl4RlFVRnJReXhqUVVGc1F5eEZRVU5GTzBsQlFVRXNTMEZCUVN4RlFVRlBMRk5CUVVFN1FVRkRUQ3hWUVVGQk8wMUJRVUVzVjBGQlFTeEhRVUZqTEZOQlFVTXNSMEZCUkN4RlFVRk5MRTlCUVU0N1VVRkRXaXhKUVVGeFF5eFBRVUZSTEVkQlFWSXNTMEZCWjBJc1VVRkJja1E3VlVGQlFTeFBRVUZQTEVOQlFVTXNTVUZCVWl4RFFVRmhMRTlCUVVFc1IwRkJWU3hIUVVGV0xFZEJRV2RDTEVkQlFUZENMRVZCUVVFN08xRkJRMEVzU1VGQlJ5eFBRVUZQTEVOQlFVTXNZVUZCVWl4RFFVRnpRaXhIUVVGMFFpeERRVUZJTzFWQlEwVXNUVUZCVFN4RFFVRkRMRWxCUVZBc1EwRkJXU3hIUVVGYUxFTkJRV2RDTEVOQlFVTXNUMEZCYWtJc1EwRkJlVUlzVTBGQlF5eERRVUZFTzFsQlEzWkNMRWxCUVcxRExFOUJRVkVzUTBGQlVpeExRVUZqTEZGQlFXcEVPMk5CUVVFc1QwRkJUeXhEUVVGRExFbEJRVklzUTBGQllTeFBRVUZCTEVkQlFWVXNSMEZCVml4SFFVRm5RaXhEUVVFM1FpeEZRVUZCT3p0WlFVTkJMRWxCUVRCRExFOUJRVThzUTBGQlF5eGhRVUZTTEVOQlFYTkNMRWRCUVVrc1EwRkJRU3hEUVVGQkxFTkJRVEZDTEVOQlFURkRPMk5CUVVFc1YwRkJRU3hEUVVGWkxFZEJRVWtzUTBGQlFTeERRVUZCTEVOQlFXaENMRVZCUVc5Q0xFOUJRVUVzUjBGQlZTeEhRVUZXTEVkQlFXZENMRU5CUVhCRExFVkJRVUU3TzFWQlJuVkNMRU5CUVhwQ0xFVkJSRVk3TzAxQlJsazdUVUZUWkN4UFFVRkJMRWRCUVZVN1RVRkRWaXhOUVVGTkxFTkJRVU1zU1VGQlVDeERRVUZaTEUxQlFVOHNRMEZCUVN4aFFVRkJMRU5CUVc1Q0xFTkJRV3RETEVOQlFVTXNUMEZCYmtNc1EwRkJNa01zVTBGQlF5eEhRVUZFTzFGQlEzcERMRWxCUVRCRUxFOUJRVThzUTBGQlF5eGhRVUZTTEVOQlFYTkNMRTFCUVU4c1EwRkJRU3hoUVVGQkxFTkJRV1VzUTBGQlFTeEhRVUZCTEVOQlFUVkRMRU5CUVRGRU8xVkJRVUVzVjBGQlFTeERRVUZaTEUxQlFVOHNRMEZCUVN4aFFVRkJMRU5CUVdVc1EwRkJRU3hIUVVGQkxFTkJRV3hETEVWQlFYZERMR0ZCUVhoRExFVkJRVUU3TzAxQlJIbERMRU5CUVRORE8yRkJTVUU3U1VGbVN5eERRVUZRTzBkQlJFWTdPMEZCYTBKQk96czdSVUZIUVN4TlFVRk5MRU5CUVVNc1kwRkJVQ3hEUVVGelFpeFZRVUYwUWl4RlFVRnJReXhwUWtGQmJFTXNSVUZEUlR0SlFVRkJMRXRCUVVFc1JVRkJUeXhUUVVGRExFOUJRVVE3UVVGRFRDeFZRVUZCTzAxQlFVRXNTVUZCUVN4SFFVRlBMRlZCUVZVc1EwRkJReXhWUVVGVkxFTkJRVU1zVFVGQmRFSXNRMEZCTmtJc1UwRkJReXhMUVVGRU8yVkJRMnhETEV0QlFVRXNTMEZCVXl4TFFVRkJMRU5CUVUwc1QwRkJUanROUVVSNVFpeERRVUUzUWp0TlFVZFFMRWxCUVdsRExFdEJRVXNzUTBGQlF5eFBRVUZPTEVOQlFXTXNTVUZCWkN4RFFVRnFRenRsUVVGQkxGVkJRVlVzUTBGQlF5eFZRVUZZTEVkQlFYZENMRXRCUVhoQ096dEpRVXBMTEVOQlFWQTdSMEZFUmp0RlFWRkJMRTFCUVU4c1EwRkJRU3hoUVVGQkxFTkJRVkFzUjBGQmQwSTdSVUZGZUVJc1MwRkJRU3hIUVVGUkxHRkJRVUVzUTBGQll5eGhRVUZrTEVWQlFUWkNMRTFCUVU4c1EwRkJRU3hoUVVGQkxFTkJRWEJET3p0QlFVVlNPenM3UlVGSFFTeExRVUZMTEVOQlFVTXNVVUZCVGl4RFFVRmxMRWRCUVdZc1JVRkJiMElzVDBGQmNFSXNSVUZCTmtJc1MwRkJOMEk3TzBGQlJVRTdPenRGUVVkQkxFdEJRVXNzUTBGQlF5eFJRVUZPTEVOQlFXVXNUVUZCWml4RlFVRjFRaXhOUVVGUExFTkJRVUVzWVVGQlFTeERRVUU1UWl4RlFVRTRReXhMUVVFNVF6czdRVUZGUVRzN08wVkJSMEVzUzBGQlN5eERRVUZETEZGQlFVNHNRMEZCWlN4TlFVRm1MRVZCUVhWQ0xHRkJRWFpDTEVWQlFYTkRMRXRCUVhSRE8wVkJRMEVzUzBGQlN5eERRVUZETEZGQlFVNHNRMEZCWlN4WFFVRm1MRVZCUVRSQ0xGTkJRVFZDTEVWQlFYVkRMRXRCUVhaRE8xTkJRMEU3UVVGb1NtRTdPenRCUVcxS1pqczdPenRCUVVkQkxFMUJRVTBzUTBGQlF5eGpRVUZRTEVOQlFYTkNMRlZCUVhSQ0xFVkJRV3RETEdGQlFXeERMRVZCUTBVN1JVRkJRU3hMUVVGQkxFVkJRVThzV1VGQlFTeERRVUZCTEVOQlFWQTdRMEZFUmpzN1FVRkhRU3hGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEZGQlFWb3NSVUZCYzBJc1ZVRkJkRUk3TzBGQlJVRXNXVUZCUVN4SFFVRmxPenRCUVVObUxFbEJRVWNzVDBGQlR5eFJRVUZRTEV0QlFYRkNMRmRCUVhoQ08wVkJRMFVzV1VGQlFTeEhRVUZsTEZOQlJHcENPenM3UVVGSFFTeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMRlZCUVZvc1JVRkJkMElzV1VGQmVFSTdPMEZCUlVFc1JVRkJSU3hEUVVGRExGRkJRVWdzUTBGQldTeE5RVUZhTEVWQlFXOUNMRk5CUVVFc1IwRkJRU3hEUVVGd1FqczdRVUZGUVN4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpSXlBaklFOUtYRzUwYUdselIyeHZZbUZzSUQwZ2NtVnhkV2x5WlNBbkxpOW5iRzlpWVd3blhHNTFkR2xzVEdsaUlEMGdjbVZ4ZFdseVpTQW5hbkYxWlhKNUoxeHVibUZ0WlZOd1lXTmxUbUZ0WlNBOUlDZFBTaWRjYmx4dUl5TWpYRzVpYjI5MElITjBjbUZ3SUc1aGJXVWdiV1YwYUc5a0lHbHVkRzhnVDJKcVpXTjBJSEJ5YjNSdmRIbHdaVnh1SXlNalhHNVBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkR2xsY3lCUFltcGxZM1E2T2l4Y2JpQWdaMlYwU1c1emRHRnVZMlZPWVcxbE9seHVJQ0FnSUhaaGJIVmxPaUF0UGx4dUlDQWdJQ0FnWm5WdVkwNWhiV1ZTWldkbGVDQTlJQzltZFc1amRHbHZiaUFvTG5zeExIMHBYRndvTDF4dUlDQWdJQ0FnY21WemRXeDBjeUE5SUNobWRXNWpUbUZ0WlZKbFoyVjRLUzVsZUdWaktFQmpiMjV6ZEhKMVkzUnZjaTUwYjFOMGNtbHVaeWdwS1Z4dUlDQWdJQ0FnS0dsbUlDaHlaWE4xYkhSeklHRnVaQ0J5WlhOMWJIUnpMbXhsYm1kMGFDQStJREVwSUhSb1pXNGdjbVZ6ZFd4MGMxc3hYU0JsYkhObElDY25LVnh1WEc1Y2JpTWpJMXh1UVc0Z2FXNTBaWEp1WVd3Z2NtVndjbVZ6Wlc1MFlYUnBiMjRnYjJZZ2RHaGxJRzVoYldWemNHRmpaU0IwY21WbFhHNGpJeU5jYms1elZISmxaU0E5SUh0OVhHNXRZV3RsVkdobFNuVnBZMlVnUFNBdFBseHVYRzRnSUNNakkxeHVJQ0JKYm5SbGNtNWhiQ0J1WVcxbFUzQmhZMlZPWVcxbElHMWxkR2h2WkNCMGJ5QmpjbVZoZEdVZ2JtVjNJQ2R6ZFdJbklHNWhiV1Z6Y0dGalpYTWdiMjRnWVhKaWFYUnlZWEo1SUdOb2FXeGtJRzlpYW1WamRITXVYRzRnSUNNakkxeHVJQ0J0WVd0bFRtRnRaVk53WVdObElEMGdLSE53WVdObGJtRnRaU3dnZEhKbFpTa2dMVDVjYmlBZ0lDQWpJeU5jYmlBZ0lDQlVhR1VnWkdWeWFYWmxaQ0JwYm5OMFlXNWpaU0IwYnlCaVpTQmpiMjV6ZEhKMVkzUmxaRnh1SUNBZ0lDTWpJMXh1SUNBZ0lFSmhjMlVnUFNBb2JuTk9ZVzFsS1NBdFBseHVJQ0FnSUNBZ2NISnZkRzhnUFNCMGFHbHpYRzRnSUNBZ0lDQjBjbVZsVzI1elRtRnRaVjBnUFNCMGNtVmxXMjV6VG1GdFpWMGdiM0lnZTMxY2JpQWdJQ0FnSUc1elZISmxaU0E5SUhSeVpXVmJibk5PWVcxbFhWeHVJQ0FnSUNBZ2JXVnRZbVZ5Y3lBOUlIdDlYRzVjYmlBZ0lDQWdJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNCMGFHbHpMQ0FuYldWdFltVnljeWNzSUhaaGJIVmxPaUJ0WlcxaVpYSnpYRzVjYmlBZ0lDQWdJQ01qSTF4dUlDQWdJQ0FnVW1WbmFYTjBaWElnS0dVdVp5NGdKMHhwWm5RbktTQmhiaUJQWW1wbFkzUWdhVzUwYnlCMGFHVWdjSEp2ZEc5MGVYQmxJRzltSUhSb1pTQnVZVzFsYzNCaFkyVXVYRzRnSUNBZ0lDQlVhR2x6SUU5aWFtVmpkQ0IzYVd4c0lHSmxJSEpsWVdSaFlteGxMMlY0WldOMWRHRmliR1VnWW5WMElHbHpJRzkwYUdWeWQybHpaU0JwYlcxMWRHRmliR1V1WEc0Z0lDQWdJQ0FqSXlOY2JpQWdJQ0FnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTQjBhR2x6TENBbmNtVm5hWE4wWlhJbkxGeHVJQ0FnSUNBZ0lDQjJZV3gxWlRvZ0tHNWhiV1VzSUc5aWFpd2daVzUxYldWeVlXSnNaU2tnTFQ1Y2JpQWdJQ0FnSUNBZ0lDQW5kWE5sSUhOMGNtbGpkQ2RjYmlBZ0lDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjBOaGJtNXZkQ0JzYVdaMElHRWdibVYzSUhCeWIzQmxjblI1SUhkcGRHaHZkWFFnWVNCMllXeHBaQ0J1WVcxbExpY3BJQ0JwWmlBb2RIbHdaVzltSUc1aGJXVWdhWE51ZENBbmMzUnlhVzVuSnlrZ2IzSWdibUZ0WlNCcGN5QW5KMXh1SUNBZ0lDQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWduUTJGdWJtOTBJR3hwWm5RZ1lTQnVaWGNnY0hKdmNHVnlkSGtnZDJsMGFHOTFkQ0JoSUhaaGJHbGtJSEJ5YjNCbGNuUjVJR2x1YzNSaGJtTmxMaWNwSUNCMWJteGxjM01nYjJKcVhHNGdJQ0FnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZFFjbTl3WlhKMGVTQnVZVzFsWkNBbklDc2dibUZ0WlNBcklDY2dhWE1nWVd4eVpXRmtlU0JrWldacGJtVmtJRzl1SUNjZ0t5QnpjR0ZqWlc1aGJXVWdLeUFuTGljcElDQnBaaUJ3Y205MGIxdHVZVzFsWFZ4dVhHNGdJQ0FnSUNBZ0lDQWdiV1Z0WW1WeWMxdHVZVzFsWFNBOUlHMWxiV0psY25OYmJtRnRaVjBnYjNJZ2JtRnRaVnh1WEc0Z0lDQWdJQ0FnSUNBZ0kwZDFZWEprSUdGbllXbHVjM1FnYjJKc2FYUmxjbUYwYVc1bklIUm9aU0IwY21WbElHRnpJSFJvWlNCMGNtVmxJR2x6SUhKbFkzVnljMmwyWld4NUlHVjRkR1Z1WkdWa1hHNGdJQ0FnSUNBZ0lDQWdibk5VY21WbFcyNWhiV1ZkSUQwZ2JuTlVjbVZsVzI1aGJXVmRJRzl5WEc0Z0lDQWdJQ0FnSUNBZ0lDQnVZVzFsT2lCdVlXMWxYRzRnSUNBZ0lDQWdJQ0FnSUNCMGVYQmxPaUIwZVhCbGIyWWdiMkpxWEc0Z0lDQWdJQ0FnSUNBZ0lDQnBibk4wWVc1alpUb2dLR2xtSUc5aWFpNW5aWFJKYm5OMFlXNWpaVTVoYldVZ2RHaGxiaUJ2WW1vdVoyVjBTVzV6ZEdGdVkyVk9ZVzFsS0NrZ1pXeHpaU0FuZFc1cmJtOTNiaWNwWEc1Y2JpQWdJQ0FnSUNBZ0lDQlBZbXBsWTNRdVpHVm1hVzVsVUhKdmNHVnlkSGtnY0hKdmRHOHNJRzVoYldVc1hHNGdJQ0FnSUNBZ0lDQWdJQ0IyWVd4MVpUb2diMkpxWEc0Z0lDQWdJQ0FnSUNBZ0lDQmxiblZ0WlhKaFlteGxPaUJtWVd4elpTQnBjMjUwSUdWdWRXMWxjbUZpYkdWY2JseHVJQ0FnSUNBZ0lDQWdJRzV6U1c1MFpYSnVZV3d1WVd4bGNuUkVaWEJsYm1SbGJuUnpJRzV6VG1GdFpTQXJJQ2N1SnlBcklITndZV05sYm1GdFpTQXJJQ2N1SnlBcklHNWhiV1ZjYmlBZ0lDQWdJQ0FnSUNCdlltcGNibHh1WEc0Z0lDQWdJQ0FqSXlOY2JpQWdJQ0FnSUVOeVpXRjBaU0JoSUc1bGR5d2djM1JoZEdsaklHNWhiV1Z6Y0dGalpTQnZiaUIwYUdVZ1kzVnljbVZ1ZENCd1lYSmxiblFnS0dVdVp5NGdibk5PWVcxbExuUnZMaTR1SUh4OElHNXpUbUZ0WlM1cGN5NHVMaWxjYmlBZ0lDQWdJQ01qSTF4dUlDQWdJQ0FnY0hKdmRHOHVjbVZuYVhOMFpYSWdKMjFoYTJWVGRXSk9ZVzFsVTNCaFkyVW5MQ0FvS0hOMVlrNWhiV1ZUY0dGalpTa2dMVDVjYmlBZ0lDQWdJQ0FnSjNWelpTQnpkSEpwWTNRblhHNGdJQ0FnSUNBZ0lIUm9jbTkzSUc1bGR5QkZjbkp2Y2lnblEyRnVibTkwSUdOeVpXRjBaU0JoSUc1bGR5QnpkV0lnYm1GdFpYTndZV05sSUhkcGRHaHZkWFFnWVNCMllXeHBaQ0J1WVcxbExpY3BJQ0JwWmlBb2RIbHdaVzltSUhOMVlrNWhiV1ZUY0dGalpTQnBjMjUwSUNkemRISnBibWNuS1NCdmNpQnpkV0pPWVcxbFUzQmhZMlVnYVhNZ0p5ZGNiaUFnSUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZFRkV0lnYm1GdFpYTndZV05sSUc1aGJXVmtJQ2NnS3lCemRXSk9ZVzFsVTNCaFkyVWdLeUFuSUdseklHRnNjbVZoWkhrZ1pHVm1hVzVsWkNCdmJpQW5JQ3NnYzNCaFkyVnVZVzFsSUNzZ0p5NG5LU0FnYVdZZ2NISnZkRzh1YzNWaVRtRnRaVk53WVdObFhHNGdJQ0FnSUNBZ0lHNXpTVzUwWlhKdVlXd3VZV3hsY25SRVpYQmxibVJsYm5SeklHNXpUbUZ0WlNBcklDY3VKeUFySUhOMVlrNWhiV1ZUY0dGalpWeHVJQ0FnSUNBZ0lDQnVaWGRPWVcxbFUzQmhZMlVnUFNCdFlXdGxUbUZ0WlZOd1lXTmxLSE4xWWs1aGJXVlRjR0ZqWlN3Z2JuTlVjbVZsS1Z4dUlDQWdJQ0FnSUNCdVpYZE9ZVzFsVTNCaFkyVXVjbVZuYVhOMFpYSWdKMk52Ym5OMFlXNTBjeWNzSUcxaGEyVk9ZVzFsVTNCaFkyVW9KMk52Ym5OMFlXNTBjeWNzSUc1elZISmxaU2tzSUdaaGJITmxJQ0JwWmlCemRXSk9ZVzFsVTNCaFkyVWdhWE51ZENBblkyOXVjM1JoYm5SekoxeHVJQ0FnSUNBZ0lDQndjbTkwYnk1eVpXZHBjM1JsY2lCemRXSk9ZVzFsVTNCaFkyVXNJRzVsZDA1aGJXVlRjR0ZqWlN3Z1ptRnNjMlZjYmlBZ0lDQWdJQ0FnYm1WM1RtRnRaVk53WVdObFhHNGdJQ0FnSUNBcExDQm1ZV3h6WlZ4dUlDQWdJQ0FnY21WMGRYSnVYRzVjYmlBZ0lDQWpJeU5jYmlBZ0lDQkJiaUJwYm5SbGNtNWhiQ0J0WldOb1lXNXBjMjBnZEc4Z2NtVndjbVZ6Wlc1MElIUm9aU0JwYm5OMFlXNWpaU0J2WmlCMGFHbHpJRzVoYldWemNHRmpaVnh1SUNBZ0lFQmpiMjV6ZEhKMVkzUnZjbHh1SUNBZ0lFQnBiblJsY201aGJGeHVJQ0FnSUVCdFpXMWlaWEpQWmlCdFlXdGxUbUZ0WlZOd1lXTmxYRzRnSUNBZ0l5TWpYRzRnSUNBZ1EyeGhjM01nUFNCdVpYY2dSblZ1WTNScGIyNG9KM0psZEhWeWJpQm1kVzVqZEdsdmJpQW5JQ3NnYzNCaFkyVnVZVzFsSUNzZ0p5Z3BlMzBuS1NncFhHNGdJQ0FnUTJ4aGMzTTZPaUE5SUc1bGR5QkNZWE5sS0hOd1lXTmxibUZ0WlNsY2JseHVJQ0FnSUNORGJHRnpjeTV3Y205MGIzUjVjR1V1Y0dGeVpXNTBJRDBnUW1GelpTNXdjbTkwYjNSNWNHVTdYRzRnSUNBZ2JtVjNJRU5zWVhOektITndZV05sYm1GdFpTbGNibHh1SUNBakl5TmNiaUFnSjBSbGNHVnVaQ2NnWVc0Z1QySnFaV04wSUhWd2IyNGdZVzV2ZEdobGNpQnRaVzFpWlhJZ2IyWWdkR2hwY3lCdVlXMWxjM0JoWTJVc0lIVndiMjRnWVc1dmRHaGxjaUJ1WVcxbGMzQmhZMlVzWEc0Z0lHOXlJSFZ3YjI0Z1lTQnRaVzFpWlhJZ2IyWWdZVzV2ZEdobGNpQnVZVzFsYzNCaFkyVmNiaUFnSXlNalhHNGdJR1JsY0dWdVpITlBiaUE5SUNoa1pYQmxibVJsYm1OcFpYTXNJR05oYkd4Q1lXTnJMQ0JwYlhCdmNuUnpLU0F0UGx4dUlDQWdJQ2QxYzJVZ2MzUnlhV04wSjF4dUlDQWdJSEpsZENBOUlHWmhiSE5sWEc0Z0lDQWdibk5OWlcxaVpYSnpJRDBnYm5OSmJuUmxjbTVoYkM1blpYUk9jMDFsYldKbGNuTW9LVnh1SUNBZ0lHbG1JR1JsY0dWdVpHVnVZMmxsY3lCaGJtUWdaR1Z3Wlc1a1pXNWphV1Z6TG14bGJtZDBhQ0ErSURBZ1lXNWtJR05oYkd4Q1lXTnJYRzRnSUNBZ0lDQnRhWE56YVc1bklEMGdaR1Z3Wlc1a1pXNWphV1Z6TG1acGJIUmxjaWdvWkdWd1pXNHBJQzArWEc0Z0lDQWdJQ0FnSUc1elRXVnRZbVZ5Y3k1cGJtUmxlRTltS0dSbGNHVnVLU0JwY3lBdE1TQmhibVFnS0c1dmRDQnBiWEJ2Y25SeklHOXlJR2x0Y0c5eWRITWdhWE51ZENCa1pYQmxiaWxjYmlBZ0lDQWdJQ2xjYmlBZ0lDQWdJR2xtSUcxcGMzTnBibWN1YkdWdVozUm9JR2x6SURCY2JpQWdJQ0FnSUNBZ2NtVjBJRDBnZEhKMVpWeHVJQ0FnSUNBZ0lDQmpZV3hzUW1GamF5Z3BYRzRnSUNBZ0lDQmxiSE5sWEc0Z0lDQWdJQ0FnSUc1elNXNTBaWEp1WVd3dVpHVndaVzVrWlc1MGN5NXdkWE5vSUNocGJYQnZjblJ6S1NBdFBseHVJQ0FnSUNBZ0lDQWdJR1JsY0dWdVpITlBiaUJ0YVhOemFXNW5MQ0JqWVd4c1FtRmpheXdnYVcxd2IzSjBjMXh1WEc0Z0lDQWdjbVYwWEc0Z0lHNXpTVzUwWlhKdVlXd2dQU0JrWlhCbGJtUmxiblJ6T2lCYlhWeHVYRzRnSUNNakkxeHVJQ0JHWlhSamFHVnpJSFJvWlNCeVpXZHBjM1JsY21Wa0lIQnliM0JsY25ScFpYTWdZVzVrSUcxbGRHaHZaSE1nYjI0Z2RHaGxJRzVoYldWemNHRmpaU0JoYm1RZ2FYUnpJR05vYVd4a0lHNWhiV1Z6Y0dGalpYTmNiaUFnSXlNalhHNGdJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNCdWMwbHVkR1Z5Ym1Gc0xDQW5aMlYwVG5OTlpXMWlaWEp6Snl4Y2JpQWdJQ0IyWVd4MVpUb2dMVDVjYmlBZ0lDQWdJSEpsWTNWeWMyVlVjbVZsSUQwZ0tHdGxlU3dnYkdGemRFdGxlU2tnTFQ1Y2JpQWdJQ0FnSUNBZ2JXVnRZbVZ5Y3k1d2RYTm9JR3hoYzNSTFpYa2dLeUFuTGljZ0t5QnJaWGtnSUdsbUlIUjVjR1Z2WmlBb2EyVjVLU0JwY3lBbmMzUnlhVzVuSjF4dUlDQWdJQ0FnSUNCcFppQjFkR2xzVEdsaUxtbHpVR3hoYVc1UFltcGxZM1FvYTJWNUtWeHVJQ0FnSUNBZ0lDQWdJRTlpYW1WamRDNXJaWGx6S0d0bGVTa3VabTl5UldGamFDQW9heWtnTFQ1Y2JpQWdJQ0FnSUNBZ0lDQWdJRzFsYldKbGNuTXVjSFZ6YUNCc1lYTjBTMlY1SUNzZ0p5NG5JQ3NnYXlBZ2FXWWdkSGx3Wlc5bUlDaHJLU0JwY3lBbmMzUnlhVzVuSjF4dUlDQWdJQ0FnSUNBZ0lDQWdjbVZqZFhKelpWUnlaV1VnYTJWNVcydGRMQ0JzWVhOMFMyVjVJQ3NnSnk0bklDc2dheUFnYVdZZ2RYUnBiRXhwWWk1cGMxQnNZV2x1VDJKcVpXTjBLR3RsZVZ0clhTbGNiaUFnSUNBZ0lDQWdJQ0FnSUhKbGRIVnlibHh1WEc0Z0lDQWdJQ0FnSUhKbGRIVnlibHh1SUNBZ0lDQWdiV1Z0WW1WeWN5QTlJRnRkWEc0Z0lDQWdJQ0JQWW1wbFkzUXVhMlY1Y3loT2MxUnlaV1ZiYm1GdFpWTndZV05sVG1GdFpWMHBMbVp2Y2tWaFkyZ2dLR3RsZVNrZ0xUNWNiaUFnSUNBZ0lDQWdjbVZqZFhKelpWUnlaV1VnVG5OVWNtVmxXMjVoYldWVGNHRmpaVTVoYldWZFcydGxlVjBzSUc1aGJXVlRjR0ZqWlU1aGJXVWdJR2xtSUhWMGFXeE1hV0l1YVhOUWJHRnBiazlpYW1WamRDaE9jMVJ5WldWYmJtRnRaVk53WVdObFRtRnRaVjFiYTJWNVhTbGNiaUFnSUNBZ0lDQWdjbVYwZFhKdVhHNWNiaUFnSUNBZ0lHMWxiV0psY25OY2JseHVJQ0FqSXlOY2JpQWdWRzhnYzNWd2NHOXlkQ0JrWlhCbGJtUmxibU41SUcxaGJtRm5aVzFsYm5Rc0lIZG9aVzRnWVNCd2NtOXdaWEowZVNCcGN5QnNhV1owWldRZ2IyNTBieUIwYUdVZ2JtRnRaWE53WVdObExDQnViM1JwWm5rZ1pHVndaVzVrWlc1MGN5QjBieUJwYm1sMGFXRnNhWHBsWEc0Z0lDTWpJMXh1SUNCUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa2dibk5KYm5SbGNtNWhiQ3dnSjJGc1pYSjBSR1Z3Wlc1a1pXNTBjeWNzWEc0Z0lDQWdkbUZzZFdVNklDaHBiWEJ2Y25SektTQXRQbHh1SUNBZ0lDQWdaR1Z3Y3lBOUlHNXpTVzUwWlhKdVlXd3VaR1Z3Wlc1a1pXNTBjeTVtYVd4MFpYSW9LR1JsY0U5dUtTQXRQbHh1SUNBZ0lDQWdJQ0JtWVd4elpTQnBjeUJrWlhCUGJpaHBiWEJ2Y25SektWeHVJQ0FnSUNBZ0tWeHVJQ0FnSUNBZ2JuTkpiblJsY201aGJDNWtaWEJsYm1SbGJuUnpJRDBnWkdWd2N5QWdhV1lnUVhKeVlYa3VhWE5CY25KaGVTaGtaWEJ6S1Z4dVhHNGdJQ05EY21WaGRHVWdkR2hsSUhKdmIzUWdiMllnZEdobElIUnlaV1VnWVhNZ2RHaGxJR04xY25KbGJuUWdibUZ0WlhOd1lXTmxYRzRnSUU1elZISmxaVnR1WVcxbFUzQmhZMlZPWVcxbFhTQTlJSHQ5WEc0Z0lDTkVaV1pwYm1VZ2RHaGxJR052Y21VZ2JtRnRaWE53WVdObElHRnVaQ0IwYUdVZ2NtVjBkWEp1SUc5bUlIUm9hWE1nWTJ4aGMzTmNiaUFnVG5OUGRYUWdQU0J0WVd0bFRtRnRaVk53WVdObEtHNWhiV1ZUY0dGalpVNWhiV1VzSUU1elZISmxaVnR1WVcxbFUzQmhZMlZPWVcxbFhTbGNibHh1SUNBakl5TmNiaUFnUTJGamFHVWdZU0JvWVc1a2JHVWdiMjRnZEdobElIWmxibVJ2Y2lBb2NISnZZbUZpYkhrZ2FsRjFaWEo1S1NCdmJpQjBhR1VnY205dmRDQnVZVzFsYzNCaFkyVmNiaUFnSXlNalhHNGdJRTV6VDNWMExuSmxaMmx6ZEdWeUlDYy9KeXdnZFhScGJFeHBZaXdnWm1Gc2MyVmNibHh1SUNBakl5TmNiaUFnUTJGamFHVWdkR2hsSUhSeVpXVWdLSFZ6WldaMWJDQm1iM0lnWkc5amRXMWxiblJoZEdsdmJpOTJhWE4xWVd4cGVtRjBhVzl1TDJSbFluVm5aMmx1WnlsY2JpQWdJeU1qWEc0Z0lFNXpUM1YwTG5KbFoybHpkR1Z5SUNkMGNtVmxKeXdnVG5OVWNtVmxXMjVoYldWVGNHRmpaVTVoYldWZExDQm1ZV3h6WlZ4dVhHNGdJQ01qSTF4dUlDQkRZV05vWlNCMGFHVWdibUZ0WlNCemNHRmpaU0J1WVcxbFhHNGdJQ01qSTF4dUlDQk9jMDkxZEM1eVpXZHBjM1JsY2lBbmJtRnRaU2NzSUc1aGJXVlRjR0ZqWlU1aGJXVXNJR1poYkhObFhHNGdJRTV6VDNWMExuSmxaMmx6ZEdWeUlDZGtaWEJsYm1SelQyNG5MQ0JrWlhCbGJtUnpUMjRzSUdaaGJITmxYRzRnSUU1elQzVjBYRzVjYmx4dUl5TWpYRzVCWTNSMVlXeHNlU0JrWldacGJtVWdkR2hsSUU5S0lFNWhiV1ZUY0dGalpWeHVJeU1qWEc1UFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa2dkR2hwYzBkc2IySmhiQ3dnYm1GdFpWTndZV05sVG1GdFpTeGNiaUFnZG1Gc2RXVTZJRzFoYTJWVWFHVktkV2xqWlNncFhHNWNiazlLTG5KbFoybHpkR1Z5SUNkbmJHOWlZV3duTENCMGFHbHpSMnh2WW1Gc1hHNWNiblJvYVhORWIyTjFiV1Z1ZENBOUlIdDlYRzVwWmlCMGVYQmxiMllnWkc5amRXMWxiblFnYVhOdWRDQW5kVzVrWldacGJtVmtKMXh1SUNCMGFHbHpSRzlqZFcxbGJuUWdQU0JrYjJOMWJXVnVkRnh1WEc1UFNpNXlaV2RwYzNSbGNpQW5aRzlqZFcxbGJuUW5MQ0IwYUdselJHOWpkVzFsYm5SY2JseHVUMG91Y21WbmFYTjBaWElnSjI1dmIzQW5MQ0F0UGx4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFOUtJbDE5IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE9KLCBfLCBzdWJOYW1lU3BhY2VzO1xuXG5PSiA9IHJlcXVpcmUoJy4vb2onKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuc3ViTmFtZVNwYWNlcyA9IFsnZXJyb3JzJywgJ2VudW1zJywgJ2luc3RhbmNlT2YnLCAnbm9kZXMnLCAnZGInLCAnY29tcG9uZW50cycsICdjb250cm9scycsICdpbnB1dHMnLCAnbm90aWZpY2F0aW9ucycsICdjb29raWUnLCAnYXN5bmMnXTtcblxuXy5lYWNoKHN1Yk5hbWVTcGFjZXMsIGZ1bmN0aW9uKG5hbWUpIHtcbiAgcmV0dXJuIE9KLm1ha2VTdWJOYW1lU3BhY2UobmFtZSk7XG59KTtcblxuT0pbJ0dFTkVSQVRFX1VOSVFVRV9JRFMnXSA9IGZhbHNlO1xuXG5PSlsnREVGQVVMVF9DT01QT05FTlRfUk9PVF9OT0RFVFlQRSddID0gJ2Rpdic7XG5cbk9KWydUUkFDS19PTl9FUlJPUiddID0gZmFsc2U7XG5cbk9KWydMT0dfQUxMX0FKQVgnXSA9IGZhbHNlO1xuXG5PSlsnTE9HX0FMTF9BSkFYX0VSUk9SUyddID0gZmFsc2U7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVE2WEZ4SGFYUm9kV0pjWEc5cVhGeHpjbU5jWEdOdlptWmxaVnhjYjJwSmJtbDBMbU52Wm1abFpTSmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJSVUVzU1VGQlFUczdRVUZCUVN4RlFVRkJMRWRCUVVzc1QwRkJRU3hEUVVGUkxFMUJRVkk3TzBGQlEwd3NRMEZCUVN4SFFVRkpMRTlCUVVFc1EwRkJVU3hSUVVGU096dEJRVWxLTEdGQlFVRXNSMEZCWjBJc1EwRkRaQ3hSUVVSakxFVkJSV1FzVDBGR1l5eEZRVWRrTEZsQlNHTXNSVUZKWkN4UFFVcGpMRVZCUzJRc1NVRk1ZeXhGUVUxa0xGbEJUbU1zUlVGUFpDeFZRVkJqTEVWQlVXUXNVVUZTWXl4RlFWTmtMR1ZCVkdNc1JVRlZaQ3hSUVZaakxFVkJWMlFzVDBGWVl6czdRVUZyUW1oQ0xFTkJRVU1zUTBGQlF5eEpRVUZHTEVOQlFVOHNZVUZCVUN4RlFVRnpRaXhUUVVGRExFbEJRVVE3VTBGRGNFSXNSVUZCUlN4RFFVRkRMR2RDUVVGSUxFTkJRVzlDTEVsQlFYQkNPMEZCUkc5Q0xFTkJRWFJDT3p0QlFVMUJMRVZCUVVjc1EwRkJRU3h4UWtGQlFTeERRVUZJTEVkQlFUUkNPenRCUVVVMVFpeEZRVUZITEVOQlFVRXNhVU5CUVVFc1EwRkJTQ3hIUVVGM1F6czdRVUZGZUVNc1JVRkJSeXhEUVVGQkxHZENRVUZCTEVOQlFVZ3NSMEZCZFVJN08wRkJSWFpDTEVWQlFVY3NRMEZCUVN4alFVRkJMRU5CUVVnc1IwRkJjVUk3TzBGQlJYSkNMRVZCUVVjc1EwRkJRU3h4UWtGQlFTeERRVUZJTEVkQlFUUkNJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJZ0l5QWpJRTlLSUZCdmMzUXRTVzVwZEdsaGJHbDZZWFJwYjI1Y2NseHVYSEpjYms5S0lEMGdjbVZ4ZFdseVpTQW5MaTl2YWlkY2NseHVYeUE5SUhKbGNYVnBjbVVnSjJ4dlpHRnphQ2RjY2x4dVhISmNiaU1nVTJsdGNHeGxJR0Z5Y21GNUlHOW1JR0Z1ZEdsamFYQmhkR1ZrTDJ0dWIzZHVJR05vYVd4a0lHNWhiV1Z6Y0dGalpYTmNjbHh1SUNCY2NseHVjM1ZpVG1GdFpWTndZV05sY3lBOUlGdGNjbHh1SUNBblpYSnliM0p6SjF4eVhHNGdJQ2RsYm5WdGN5ZGNjbHh1SUNBbmFXNXpkR0Z1WTJWUFppZGNjbHh1SUNBbmJtOWtaWE1uWEhKY2JpQWdKMlJpSjF4eVhHNGdJQ2RqYjIxd2IyNWxiblJ6SjF4eVhHNGdJQ2RqYjI1MGNtOXNjeWRjY2x4dUlDQW5hVzV3ZFhSekoxeHlYRzRnSUNkdWIzUnBabWxqWVhScGIyNXpKMXh5WEc0Z0lDZGpiMjlyYVdVblhISmNiaUFnSjJGemVXNWpKMXh5WEc1ZFhISmNibHh5WEc0aklDTWpJRk4xWWs1aGJXVlRjR0ZqWlhOY2NseHVYSEpjYmlNZ1VISmxMV0ZzYkc5allYUmxJR05sY25SaGFXNGdZMjl0Ylc5dUlHNWhiV1Z6Y0dGalpYTWdkRzhnWVhadmFXUWdablYwZFhKbElISmhZMlVnWTI5dVpHbDBhVzl1Y3k1Y2NseHVJeUJVYUdseklHUnZaWE1nY21WeGRXbHlaU0IwYUdGMElIUm9aU0J2Y21SbGNpQnZaaUJ2Y0dWeVlYUnBiMjV6SUd4dllXUnpJRTlLTG1OdlptWmxaU0JtYVhKemRDQmhibVFnYjBwSmJtbDBMbU52Wm1abFpTQnpaV052Ym1SY2NseHVYeTVsWVdOb0lITjFZazVoYldWVGNHRmpaWE1zSUNodVlXMWxLU0F0UGx4eVhHNGdJRTlLTG0xaGEyVlRkV0pPWVcxbFUzQmhZMlVnYm1GdFpWeHlYRzRnSUZ4eVhHNGpJQ01qSUVOdmJtWnBaM1Z5WVhScGIyNGdkbUZ5YVdGaWJHVnpYSEpjYmx4eVhHNGpJRUYxZEc5dFlYUnBZMkZzYkhrZ1oyVnVaWEpoZEdVZ2RXNXBjWFZsSUVsRWN5Qm1iM0lnWldGamFDQnViMlJsSUNoa1pXWmhkV3gwSUdaaGJITmxLVnh5WEc1UFNsc25SMFZPUlZKQlZFVmZWVTVKVVZWRlgwbEVVeWRkSUQwZ1ptRnNjMlZjY2x4dUl5QkVaV1poZFd4MElISnZiM1FnYm05a1pTQm1iM0lnWTI5dGNHOXVaVzUwY3k5amIyNTBjbTlzY3lBb1pHVm1ZWFZzZENBblpHbDJKeWxjY2x4dVQwcGJKMFJGUmtGVlRGUmZRMDlOVUU5T1JVNVVYMUpQVDFSZlRrOUVSVlJaVUVVblhTQTlJQ2RrYVhZblhISmNiaU1nVjJobGRHaGxjaUIwYnlCb2IyOXJJR2x1ZEc4Z2RHaGxJR2RzYjJKaGJDQnZiaUJsY25KdmNpQmxkbVZ1ZENCMGJ5QjNjbWwwWlNCbGNuSnZjbk1nZEc4Z1kyOXVjMjlzWlNBb1pHVm1ZWFZzZENCbVlXeHpaU2xjY2x4dVQwcGJKMVJTUVVOTFgwOU9YMFZTVWs5U0oxMGdQU0JtWVd4elpWeHlYRzRqVjJobGRHaGxjaUIwYnlCc2IyY2dZV3hzSUVGS1FWZ2djbVZ4ZFdWemRITmNjbHh1VDBwYkoweFBSMTlCVEV4ZlFVcEJXQ2RkSUQwZ1ptRnNjMlZjY2x4dUkxZG9aWFJvWlhJZ2RHOGdiRzluSUdGc2JDQkJTa0ZZSUdWeWNtOXljMXh5WEc1UFNsc25URTlIWDBGTVRGOUJTa0ZZWDBWU1VrOVNVeWRkSUQwZ1ptRnNjMlVpWFgwPSIsIlxyXG4jIyNcclxuUmV0dXJuIGp1c3QgdGhlIGtleXMgZnJvbSB0aGUgaW5wdXQgYXJyYXksIG9wdGlvbmFsbHkgb25seSBmb3IgdGhlIHNwZWNpZmllZCBzZWFyY2hfdmFsdWVcclxudmVyc2lvbjogMTEwOS4yMDE1XHJcbmRpc2N1c3MgYXQ6IGh0dHA6Ly9waHBqcy5vcmcvZnVuY3Rpb25zL2FycmF5X2tleXNcclxuKyAgIG9yaWdpbmFsIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va2V2aW4udmFuem9ubmV2ZWxkLm5ldClcclxuKyAgICAgIGlucHV0IGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxyXG4rICAgYnVnZml4ZWQgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0KVxyXG4rICAgaW1wcm92ZWQgYnk6IGpkXHJcbisgICBpbXByb3ZlZCBieTogQnJldHQgWmFtaXIgKGh0dHA6Ly9icmV0dC16YW1pci5tZSlcclxuKyAgIGlucHV0IGJ5OiBQXHJcbisgICBidWdmaXhlZCBieTogQnJldHQgWmFtaXIgKGh0dHA6Ly9icmV0dC16YW1pci5tZSlcclxuZXhhbXBsZSAxOiBhcnJheV9rZXlzKCB7Zmlyc3RuYW1lOiAnS2V2aW4nLCBzdXJuYW1lOiAndmFuIFpvbm5ldmVsZCd9ICk7XHJcbnJldHVybnMgMTogezA6ICdmaXJzdG5hbWUnLCAxOiAnc3VybmFtZSd9XHJcbiMjI1xyXG5hcnJheV9rZXlzID0gKGlucHV0LCBzZWFyY2hfdmFsdWUsIGFyZ1N0cmljdCkgLT5cclxuICBzZWFyY2ggPSB0eXBlb2Ygc2VhcmNoX3ZhbHVlIGlzbnQgXCJ1bmRlZmluZWRcIlxyXG4gIHRtcF9hcnIgPSBbXVxyXG4gIHN0cmljdCA9ICEhYXJnU3RyaWN0XHJcbiAgaW5jbHVkZSA9IHRydWVcclxuICBrZXkgPSBcIlwiXHJcbiAgIyBEdWNrLXR5cGUgY2hlY2sgZm9yIG91ciBvd24gYXJyYXkoKS1jcmVhdGVkIFBIUEpTX0FycmF5XHJcbiAgcmV0dXJuIGlucHV0LmtleXMoc2VhcmNoX3ZhbHVlLCBhcmdTdHJpY3QpICBpZiBpbnB1dCBhbmQgdHlwZW9mIGlucHV0IGlzIFwib2JqZWN0XCIgYW5kIGlucHV0LmNoYW5nZV9rZXlfY2FzZVxyXG4gIGZvciBrZXkgb2YgaW5wdXRcclxuICAgIGlmIGlucHV0Lmhhc093blByb3BlcnR5KGtleSlcclxuICAgICAgaW5jbHVkZSA9IHRydWVcclxuICAgICAgaWYgc2VhcmNoXHJcbiAgICAgICAgaWYgc3RyaWN0IGFuZCBpbnB1dFtrZXldIGlzbnQgc2VhcmNoX3ZhbHVlXHJcbiAgICAgICAgICBpbmNsdWRlID0gZmFsc2VcclxuICAgICAgICBlbHNlIGluY2x1ZGUgPSBmYWxzZSAgdW5sZXNzIGlucHV0W2tleV0gaXMgc2VhcmNoX3ZhbHVlXHJcbiAgICAgIHRtcF9hcnJbdG1wX2Fyci5sZW5ndGhdID0ga2V5ICBpZiBpbmNsdWRlXHJcbiAgdG1wX2FyclxyXG5cclxuIyMjKlxyXG5Db252ZXJ0IGEgSmF2YXNjcmlwdCBPamVjdCBhcnJheSBvciBTdHJpbmcgYXJyYXkgdG8gYW4gSFRNTCB0YWJsZVxyXG5KU09OIHBhcnNpbmcgaGFzIHRvIGJlIG1hZGUgYmVmb3JlIGZ1bmN0aW9uIGNhbGxcclxuSXQgYWxsb3dzIHVzZSBvZiBvdGhlciBKU09OIHBhcnNpbmcgbWV0aG9kcyBsaWtlIGpRdWVyeS5wYXJzZUpTT05cclxuaHR0cChzKTovLywgZnRwOi8vLCBmaWxlOi8vIGFuZCBqYXZhc2NyaXB0OjsgbGlua3MgYXJlIGF1dG9tYXRpY2FsbHkgY29tcHV0ZWRcclxuXHJcbkpTT04gZGF0YSBzYW1wbGVzIHRoYXQgc2hvdWxkIGJlIHBhcnNlZCBhbmQgdGhlbiBjYW4gYmUgY29udmVydGVkIHRvIGFuIEhUTUwgdGFibGVcclxudmFyIG9iamVjdEFycmF5ID0gJ1t7XCJUb3RhbFwiOlwiMzRcIixcIlZlcnNpb25cIjpcIjEuMC40XCIsXCJPZmZpY2VcIjpcIk5ldyBZb3JrXCJ9LHtcIlRvdGFsXCI6XCI2N1wiLFwiVmVyc2lvblwiOlwiMS4xLjBcIixcIk9mZmljZVwiOlwiUGFyaXNcIn1dJztcclxudmFyIHN0cmluZ0FycmF5ID0gJ1tcIk5ldyBZb3JrXCIsXCJCZXJsaW5cIixcIlBhcmlzXCIsXCJNYXJyYWtlY2hcIixcIk1vc2Nvd1wiXSc7XHJcbnZhciBuZXN0ZWRUYWJsZSA9ICdbeyBrZXkxOiBcInZhbDFcIiwga2V5MjogXCJ2YWwyXCIsIGtleTM6IHsgdGFibGVJZDogXCJ0YmxJZE5lc3RlZDFcIiwgdGFibGVDbGFzc05hbWU6IFwiY2xzTmVzdGVkXCIsIGxpbmtUZXh0OiBcIkRvd25sb2FkXCIsIGRhdGE6IFt7IHN1YmtleTE6IFwic3VidmFsMVwiLCBzdWJrZXkyOiBcInN1YnZhbDJcIiwgc3Via2V5MzogXCJzdWJ2YWwzXCIgfV0gfSB9XSc7XHJcblxyXG5Db2RlIHNhbXBsZSB0byBjcmVhdGUgYSBIVE1MIHRhYmxlIEphdmFzY3JpcHQgU3RyaW5nXHJcbnZhciBqc29uSHRtbFRhYmxlID0gQ29udmVydEpzb25Ub1RhYmxlKGV2YWwoZGF0YVN0cmluZyksICdqc29uVGFibGUnLCBudWxsLCAnRG93bmxvYWQnKTtcclxuXHJcbkNvZGUgc2FtcGxlIGV4cGxhbmVkXHJcbi0gZXZhbCBpcyB1c2VkIHRvIHBhcnNlIGEgSlNPTiBkYXRhU3RyaW5nXHJcbi0gdGFibGUgSFRNTCBpZCBhdHRyaWJ1dGUgd2lsbCBiZSAnanNvblRhYmxlJ1xyXG4tIHRhYmxlIEhUTUwgY2xhc3MgYXR0cmlidXRlIHdpbGwgbm90IGJlIGFkZGVkXHJcbi0gJ0Rvd25sb2FkJyB0ZXh0IHdpbGwgYmUgZGlzcGxheWVkIGluc3RlYWQgb2YgdGhlIGxpbmsgaXRzZWxmXHJcblxyXG5AYXV0aG9yIEFmc2hpbiBNZWhyYWJhbmkgPGFmc2hpbiBkb3QgbWVoIGF0IGdtYWlsIGRvdCBjb20+XHJcblxyXG5AY2xhc3MgQ29udmVydEpzb25Ub1RhYmxlXHJcblxyXG5AbWV0aG9kIENvbnZlcnRKc29uVG9UYWJsZVxyXG5cclxuQHBhcmFtIHBhcnNlZEpzb24gb2JqZWN0IFBhcnNlZCBKU09OIGRhdGFcclxuQHBhcmFtIHRhYmxlSWQgc3RyaW5nIE9wdGlvbmFsIHRhYmxlIGlkXHJcbkBwYXJhbSB0YWJsZUNsYXNzTmFtZSBzdHJpbmcgT3B0aW9uYWwgdGFibGUgY3NzIGNsYXNzIG5hbWVcclxuQHBhcmFtIGxpbmtUZXh0IHN0cmluZyBPcHRpb25hbCB0ZXh0IHJlcGxhY2VtZW50IGZvciBsaW5rIHBhdHRlcm5cclxuXHJcbkByZXR1cm4gc3RyaW5nIENvbnZlcnRlZCBKU09OIHRvIEhUTUwgdGFibGVcclxuIyMjXHJcbmNsYXNzIEpzb25Ub1RhYmxlIFxyXG4gIFxyXG4gIHRhYmxlOiBudWxsXHJcbiAgXHJcbiAgY29uc3RydWN0b3I6IChwYXJzZWRKc29uLCB0YWJsZUlkLCB0YWJsZUNsYXNzTmFtZSwgbGlua1RleHQpIC0+XHJcbiAgICAjUGF0dGVybnMgZm9yIGxpbmtzIGFuZCBOVUxMIHZhbHVlXHJcbiAgICBpdGFsaWMgPSBcIjxpPnswfTwvaT5cIlxyXG4gICAgbGluayA9IChpZiBsaW5rVGV4dCB0aGVuIFwiPGEgaHJlZj1cXFwiezB9XFxcIj5cIiArIGxpbmtUZXh0ICsgXCI8L2E+XCIgZWxzZSBcIjxhIGhyZWY9XFxcInswfVxcXCI+ezB9PC9hPlwiKVxyXG4gIFxyXG4gICAgI1BhdHRlcm4gZm9yIHRhYmxlICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgIGlkTWFya3VwID0gKGlmIHRhYmxlSWQgdGhlbiBcIiBpZD1cXFwiXCIgKyB0YWJsZUlkICsgXCJcXFwiXCIgZWxzZSBcIlwiKVxyXG4gICAgY2xhc3NNYXJrdXAgPSAoaWYgdGFibGVDbGFzc05hbWUgdGhlbiBcIiBjbGFzcz1cXFwiXCIgKyB0YWJsZUNsYXNzTmFtZSArIFwiXFxcIlwiIGVsc2UgXCJcIilcclxuICAgIHRibCA9IFwiPHRhYmxlIGJvcmRlcj1cXFwiMVxcXCIgY2VsbHBhZGRpbmc9XFxcIjFcXFwiIGNlbGxzcGFjaW5nPVxcXCIxXFxcIlwiICsgaWRNYXJrdXAgKyBjbGFzc01hcmt1cCArIFwiPnswfXsxfTwvdGFibGU+XCJcclxuICBcclxuICAgICNQYXR0ZXJucyBmb3IgdGFibGUgY29udGVudFxyXG4gICAgdGggPSBcIjx0aGVhZD57MH08L3RoZWFkPlwiXHJcbiAgICB0YiA9IFwiPHRib2R5PnswfTwvdGJvZHk+XCJcclxuICAgIHRyID0gXCI8dHI+ezB9PC90cj5cIlxyXG4gICAgdGhSb3cgPSBcIjx0aD57MH08L3RoPlwiXHJcbiAgICB0ZFJvdyA9IFwiPHRkPnswfTwvdGQ+XCJcclxuICAgIHRoQ29uID0gXCJcIlxyXG4gICAgdGJDb24gPSBcIlwiXHJcbiAgICB0ckNvbiA9IFwiXCJcclxuICAgIGlmIHBhcnNlZEpzb25cclxuICAgICAgaXNTdHJpbmdBcnJheSA9IHR5cGVvZiAocGFyc2VkSnNvblswXSkgaXMgXCJzdHJpbmdcIlxyXG4gICAgICBoZWFkZXJzID0gdW5kZWZpbmVkXHJcbiAgICBcclxuICAgICAgIyBDcmVhdGUgdGFibGUgaGVhZGVycyBmcm9tIEpTT04gZGF0YVxyXG4gICAgICAjIElmIEpTT04gZGF0YSBpcyBhIHNpbXBsZSBzdHJpbmcgYXJyYXkgd2UgY3JlYXRlIGEgc2luZ2xlIHRhYmxlIGhlYWRlclxyXG4gICAgICBpZiBpc1N0cmluZ0FycmF5XHJcbiAgICAgICAgdGhDb24gKz0gdGhSb3cuZm9ybWF0KFwidmFsdWVcIilcclxuICAgICAgZWxzZVxyXG4gICAgICBcclxuICAgICAgICAjIElmIEpTT04gZGF0YSBpcyBhbiBvYmplY3QgYXJyYXksIGhlYWRlcnMgYXJlIGF1dG9tYXRpY2FsbHkgY29tcHV0ZWRcclxuICAgICAgICBpZiB0eXBlb2YgKHBhcnNlZEpzb25bMF0pIGlzIFwib2JqZWN0XCJcclxuICAgICAgICAgIGhlYWRlcnMgPSBhcnJheV9rZXlzKHBhcnNlZEpzb25bMF0pXHJcbiAgICAgICAgICBpID0gMFxyXG4gICAgICAgICAgd2hpbGUgaSA8IGhlYWRlcnMubGVuZ3RoXHJcbiAgICAgICAgICAgIHRoQ29uICs9IHRoUm93LmZvcm1hdChoZWFkZXJzW2ldKVxyXG4gICAgICAgICAgICBpKytcclxuICAgICAgdGggPSB0aC5mb3JtYXQodHIuZm9ybWF0KHRoQ29uKSlcclxuICAgIFxyXG4gICAgICAjIENyZWF0ZSB0YWJsZSByb3dzIGZyb20gSnNvbiBkYXRhXHJcbiAgICAgIGlmIGlzU3RyaW5nQXJyYXlcclxuICAgICAgICBpID0gMFxyXG4gICAgICAgIHdoaWxlIGkgPCBwYXJzZWRKc29uLmxlbmd0aFxyXG4gICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KHBhcnNlZEpzb25baV0pXHJcbiAgICAgICAgICB0ckNvbiArPSB0ci5mb3JtYXQodGJDb24pXHJcbiAgICAgICAgICB0YkNvbiA9IFwiXCJcclxuICAgICAgICAgIGkrK1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgaWYgaGVhZGVyc1xyXG4gICAgICAgICAgdXJsUmVnRXhwID0gbmV3IFJlZ0V4cCgvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2cpXHJcbiAgICAgICAgICBqYXZhc2NyaXB0UmVnRXhwID0gbmV3IFJlZ0V4cCgvKF5qYXZhc2NyaXB0OltcXHNcXFNdKjskKS9nKVxyXG4gICAgICAgICAgaSA9IDBcclxuICAgICAgICAgIHdoaWxlIGkgPCBwYXJzZWRKc29uLmxlbmd0aFxyXG4gICAgICAgICAgICBqID0gMFxyXG4gICAgICAgICAgICB3aGlsZSBqIDwgaGVhZGVycy5sZW5ndGhcclxuICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlZEpzb25baV1baGVhZGVyc1tqXV1cclxuICAgICAgICAgICAgICBpc1VybCA9IHVybFJlZ0V4cC50ZXN0KHZhbHVlKSBvciBqYXZhc2NyaXB0UmVnRXhwLnRlc3QodmFsdWUpXHJcbiAgICAgICAgICAgICAgaWYgaXNVcmwgIyBJZiB2YWx1ZSBpcyBVUkwgd2UgYXV0by1jcmVhdGUgYSBsaW5rXHJcbiAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQobGluay5mb3JtYXQodmFsdWUpKVxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGlmIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgIGlmIHR5cGVvZiAodmFsdWUpIGlzIFwib2JqZWN0XCJcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgI2ZvciBzdXBwb3J0aW5nIG5lc3RlZCB0YWJsZXNcclxuICAgICAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQoQ29udmVydEpzb25Ub1RhYmxlKGV2YWwodmFsdWUuZGF0YSksIHZhbHVlLnRhYmxlSWQsIHZhbHVlLnRhYmxlQ2xhc3NOYW1lLCB2YWx1ZS5saW5rVGV4dCkpXHJcbiAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQodmFsdWUpXHJcbiAgICAgICAgICAgICAgICBlbHNlICMgSWYgdmFsdWUgPT0gbnVsbCB3ZSBmb3JtYXQgaXQgbGlrZSBQaHBNeUFkbWluIE5VTEwgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChpdGFsaWMuZm9ybWF0KHZhbHVlKS50b1VwcGVyQ2FzZSgpKVxyXG4gICAgICAgICAgICAgIGorK1xyXG4gICAgICAgICAgICB0ckNvbiArPSB0ci5mb3JtYXQodGJDb24pXHJcbiAgICAgICAgICAgIHRiQ29uID0gXCJcIlxyXG4gICAgICAgICAgICBpKytcclxuICAgICAgdGIgPSB0Yi5mb3JtYXQodHJDb24pXHJcbiAgICAgIHRibCA9IHRibC5mb3JtYXQodGgsIHRiKVxyXG4gICAgQHRhYmxlID0gdGJsXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEpzb25Ub1RhYmxlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuYXJyYXkyRCA9IChpbml0TGVuZ3RoLCBpbml0V2lkdGgpIC0+XHJcbiAgYXJyYXkgPSBbXVxyXG4gIG1heExlbmd0aCA9IDBcclxuICBtYXhXaWR0aCA9IDBcclxuICAgIFxyXG4gIHJldCA9IFxyXG4gICAgZ2V0OiAocm93Tm8sIGNvbE5vKSAtPlxyXG4gICAgICBleHRlbmQgcm93Tm8sIGNvbE5vXHJcbiAgICBzZXQ6IChyb3dObywgY29sTm8sIHZhbCkgLT5cclxuICAgICAgcmV0LmdldCByb3dObywgY29sTm9cclxuICAgICAgcm93SWR4ID0gcm93Tm8tMVxyXG4gICAgICBjb2xJZHggPSBjb2xOby0xXHJcbiAgICAgIGFycmF5W3Jvd0lkeF1bY29sSWR4XSA9IHZhbFxyXG4gICAgZWFjaDogKGNhbGxCYWNrKSAtPlxyXG4gICAgICBfLmVhY2ggYXJyYXksIChjb2x1bW5zLCByb3cpIC0+XHJcbiAgICAgICAgXy5lYWNoIGFycmF5W3Jvd10sICh2YWwsIGNvbCkgLT5cclxuICAgICAgICAgIHJvd0lkeCA9IHJvdysxXHJcbiAgICAgICAgICBjb2xJZHggPSBjb2wrMVxyXG4gICAgICAgICAgY2FsbEJhY2sgcm93SWR4LCBjb2xJZHgsIHZhbFxyXG4gICAgd2lkdGg6ICgpIC0+XHJcbiAgICAgIG1heFdpZHRoXHJcbiAgICBsZW5ndGg6ICgpIC0+XHJcbiAgICAgIG1heExlbmd0aFxyXG4gICAgICAgICBcclxuICAjIyNcclxuICBHdWFyYW50ZWUgdGhhdCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgYXJyYXkgYXJlIGFsd2F5cyBiYWNrZWQgYnkgdmFsdWVzIGF0IGV2ZXJ5IHBvc2l0aW9uXHJcbiAgIyMjICAgICAgICAgICAgICAgICAgICBcclxuICBleHRlbmQgPSAobGVuZ3RoLCB3aWR0aCkgLT4gIFxyXG4gICAgaWYgbm90IGxlbmd0aCBvciBsZW5ndGggPCAxIHRoZW4gbGVuZ3RoID0gMVxyXG4gICAgaWYgbm90IHdpZHRoIG9yIHdpZHRoIDwgMSB0aGVuIHdpZHRoID0gMVxyXG4gICAgICBcclxuICAgIGlmIG1heExlbmd0aCA8IGxlbmd0aCB0aGVuIG1heExlbmd0aCA9IGxlbmd0aFxyXG4gICAgaWYgYXJyYXkubGVuZ3RoID4gbWF4TGVuZ3RoIHRoZW4gbWF4TGVuZ3RoID0gYXJyYXkubGVuZ3RoXHJcbiAgICBpZiBtYXhXaWR0aCA8IHdpZHRoIHRoZW4gbWF4V2lkdGggPSB3aWR0aFxyXG4gICAgaSA9IDBcclxuICAgICAgXHJcbiAgICB3aGlsZSBpIDwgbWF4TGVuZ3RoXHJcbiAgICAgIHRyeVJvdyA9IGFycmF5W2ldXHJcbiAgICAgIGlmIG5vdCB0cnlSb3dcclxuICAgICAgICB0cnlSb3cgPSBbXVxyXG4gICAgICAgIGFycmF5LnB1c2ggdHJ5Um93XHJcbiAgICAgIGlmIG1heFdpZHRoIDwgdHJ5Um93Lmxlbmd0aCB0aGVuIG1heFdpZHRoID0gdHJ5Um93Lmxlbmd0aFxyXG4gICAgICBpZiB0cnlSb3cubGVuZ3RoIDwgbWF4V2lkdGggdGhlbiB0cnlSb3cubGVuZ3RoID0gbWF4V2lkdGhcclxuICAgICAgaSArPSAxXHJcbiAgICAgIFxyXG4gICAgYXJyYXlbbGVuZ3RoLTFdW3dpZHRoLTFdXHJcbiAgICAgICBcclxuICBleHRlbmQgaW5pdExlbmd0aCwgaW5pdFdpZHRoXHJcbiAgICBcclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdhcnJheTJEJywgYXJyYXkyRFxyXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5MkQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5tZXRob2RzID0gW1xyXG4gICdhc3NlcnQnXHJcbiAgJ2NsZWFyJ1xyXG4gICdjb3VudCdcclxuICAnZGVidWcnXHJcbiAgJ2RpcidcclxuICAnZGlyeG1sJ1xyXG4gICdlcnJvcidcclxuICAnZXhjZXB0aW9uJ1xyXG4gICdncm91cCdcclxuICAnZ3JvdXBDb2xsYXBzZWQnXHJcbiAgJ2dyb3VwRW5kJ1xyXG4gICdpbmZvJ1xyXG4gICdsb2cnXHJcbiAgJ21lbW9yeSdcclxuICAncHJvZmlsZSdcclxuICAncHJvZmlsZUVuZCdcclxuICAndGFibGUnXHJcbiAgJ3RpbWUnXHJcbiAgJ3RpbWVFbmQnXHJcbiAgJ3RpbWVTdGFtcCdcclxuICAndGltZWxpbmUnXHJcbiAgJ3RpbWVsaW5lRW5kJ1xyXG4gICd0cmFjZSdcclxuICAnd2FybidcclxuXVxyXG5tZXRob2RMZW5ndGggPSBtZXRob2RzLmxlbmd0aFxyXG5jb25zb2xlID0gT0ouZ2xvYmFsLmNvbnNvbGUgb3Ige31cclxuT0oubWFrZVN1Yk5hbWVTcGFjZSAnY29uc29sZSdcclxuICBcclxuIyMjXHJcbjEuIFN0dWIgb3V0IGFueSBtaXNzaW5nIG1ldGhvZHMgd2l0aCBub29wXHJcbjIuIERlZmluZSB0aGUgYXZhaWxhYmxlIG1ldGhvZHMgb24gdGhlIE9KLmNvbnNvbGUgb2JqZWN0XHJcbiMjI1xyXG53aGlsZSBtZXRob2RMZW5ndGgtLVxyXG4gICgtPlxyXG4gICAgbWV0aG9kID0gbWV0aG9kc1ttZXRob2RMZW5ndGhdXHJcbiAgICBcclxuICAgICMgT25seSBzdHViIHVuZGVmaW5lZCBtZXRob2RzLlxyXG4gICAgY29uc29sZVttZXRob2RdID0gT0oubm9vcCB1bmxlc3MgY29uc29sZVttZXRob2RdXHJcbiAgICBcclxuICAgICNEZWZpbmUgdGhlIG1ldGhvZCBvbiB0aGUgT0ogY29uc29sZSBuYW1lc3BhY2VcclxuICAgIE9KLmNvbnNvbGUucmVnaXN0ZXIgbWV0aG9kLCAocGFyYW1zLi4uKSAtPlxyXG4gICAgICBjb25zb2xlW21ldGhvZF0gcGFyYW1zLi4uXHJcbiAgKSgpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnNvbGUiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCwgT0osIGFsbCwgY29va2llcywgZGVsLCBkZWxldGVBbGwsIGdldCwgc2V0O1xuXG5PSiA9IHJlcXVpcmUoJy4uL29qJyk7XG5cbiQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snJCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnJCddIDogbnVsbCk7XG5cblxuLypcblNldHVwIHNldHRpbmdzXG4kLmNvb2tpZS5yYXcgPSB0cnVlXG4kLmNvb2tpZS5qc29uID0gdHJ1ZVxuICBcblNldHVwIGRlZmF1bHRzXG5odHRwczovL2dpdGh1Yi5jb20vY2FyaGFydGwvanF1ZXJ5LWNvb2tpZS9cbiQuY29va2llLmRlZmF1bHRzLmV4cGlyZXMgPSAzNjVcbiQuY29va2llLmRlZmF1bHRzLnBhdGggPSAnLydcbiQuY29va2llLmRlZmF1bHRzLmRvbWFpbiA9ICdvai5jb20nXG4gKi9cblxuaWYgKCEkIHx8ICEkLmNvb2tpZSkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ2pRdWVyeSBDb29raWUgaXMgYSByZXF1aXJlZCBkZXBlbmRlbmN5LicpO1xufVxuXG4kLmNvb2tpZS5kZWZhdWx0cy5zZWN1cmUgPSBmYWxzZTtcblxuY29va2llcyA9IHt9O1xuXG5nZXQgPSBmdW5jdGlvbihjb29raWVOYW1lLCB0eXBlKSB7XG4gIHZhciByZXQ7XG4gIHJldCA9ICcnO1xuICBpZiAoY29va2llTmFtZSkge1xuICAgIGlmICh0eXBlKSB7XG4gICAgICByZXQgPSAkLmNvb2tpZShjb29raWVOYW1lLCB0eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0ID0gJC5jb29raWUoY29va2llTmFtZSk7XG4gICAgfVxuICAgIGlmIChyZXQpIHtcbiAgICAgIHJldHVybiBjb29raWVzW2Nvb2tpZU5hbWVdID0gcmV0O1xuICAgIH1cbiAgfVxufTtcblxuYWxsID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXQ7XG4gIHJldCA9ICQuY29va2llKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5zZXQgPSBmdW5jdGlvbihjb29raWVOYW1lLCB2YWx1ZSwgb3B0cykge1xuICB2YXIgcmV0O1xuICByZXQgPSAnJztcbiAgaWYgKGNvb2tpZU5hbWUpIHtcbiAgICBjb29raWVzW2Nvb2tpZU5hbWVdID0gdmFsdWU7XG4gICAgaWYgKG9wdHMpIHtcbiAgICAgIHJldCA9ICQuY29va2llKGNvb2tpZU5hbWUsIHZhbHVlLCBvcHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0ID0gJC5jb29raWUoY29va2llTmFtZSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmV0O1xufTtcblxuZGVsID0gZnVuY3Rpb24oY29va2llTmFtZSwgb3B0cykge1xuICBpZiAoY29va2llTmFtZSkge1xuICAgIGlmIChvcHRzKSB7XG4gICAgICAkLnJlbW92ZUNvb2tpZShjb29raWVOYW1lLCBvcHRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJC5yZW1vdmVDb29raWUoY29va2llTmFtZSk7XG4gICAgfVxuICAgIGRlbGV0ZSBjb29raWVzW2Nvb2tpZU5hbWVdO1xuICB9XG59O1xuXG5kZWxldGVBbGwgPSBmdW5jdGlvbigpIHtcbiAgY29va2llcyA9IHt9O1xuICBPSi5lYWNoKE9KLmNvb2tpZS5hbGwsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgcmV0dXJuIE9KLmNvb2tpZVtcImRlbGV0ZVwiXShrZXkpO1xuICB9KTtcbn07XG5cbk9KLmNvb2tpZS5yZWdpc3RlcignZGVsZXRlQWxsJywgZGVsZXRlQWxsKTtcblxuT0ouY29va2llLnJlZ2lzdGVyKCdkZWxldGUnLCBkZWwpO1xuXG5PSi5jb29raWUucmVnaXN0ZXIoJ3NldCcsIHNldCk7XG5cbk9KLmNvb2tpZS5yZWdpc3RlcignZ2V0JywgZ2V0KTtcblxuT0ouY29va2llLnJlZ2lzdGVyKCdhbGwnLCBhbGwpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGVsZXRlQWxsOiBkZWxldGVBbGwsXG4gIFwiZGVsZXRlXCI6IGRlbCxcbiAgc2V0OiBzZXQsXG4gIGdldDogZ2V0LFxuICBhbGw6IGFsbFxufTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltUTZYRnhIYVhSb2RXSmNYRzlxWEZ4emNtTmNYR052Wm1abFpWeGNkRzl2YkhOY1hHTnZiMnRwWlM1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVGQkxFbEJRVUU3TzBGQlFVRXNSVUZCUVN4SFFVRkxMRTlCUVVFc1EwRkJVU3hQUVVGU096dEJRVU5NTEVOQlFVRXNSMEZCU1N4UFFVRkJMRU5CUVZFc1VVRkJVanM3TzBGQlJVbzdPenM3T3pzN096czdPenRCUVZkQkxFbEJRVWNzUTBGQlNTeERRVUZLTEVsQlFWTXNRMEZCU1N4RFFVRkRMRU5CUVVNc1RVRkJiRUk3UVVGRFJTeFJRVUZWTEVsQlFVRXNTMEZCUVN4RFFVRk5MSGxEUVVGT0xFVkJSRm83T3p0QlFVVkJMRU5CUVVNc1EwRkJReXhOUVVGTkxFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFXeENMRWRCUVRKQ096dEJRVVV6UWl4UFFVRkJMRWRCUVZVN08wRkJSVllzUjBGQlFTeEhRVUZOTEZOQlFVTXNWVUZCUkN4RlFVRmhMRWxCUVdJN1FVRkRTaXhOUVVGQk8wVkJRVUVzUjBGQlFTeEhRVUZOTzBWQlEwNHNTVUZCUnl4VlFVRklPMGxCUTBVc1NVRkJSeXhKUVVGSU8wMUJRMFVzUjBGQlFTeEhRVUZOTEVOQlFVTXNRMEZCUXl4TlFVRkdMRU5CUVZNc1ZVRkJWQ3hGUVVGeFFpeEpRVUZ5UWl4RlFVUlNPMHRCUVVFc1RVRkJRVHROUVVkRkxFZEJRVUVzUjBGQlRTeERRVUZETEVOQlFVTXNUVUZCUml4RFFVRlRMRlZCUVZRc1JVRklVanM3U1VGSlFTeEpRVUZITEVkQlFVZzdZVUZEUlN4UFFVRlJMRU5CUVVFc1ZVRkJRU3hEUVVGU0xFZEJRWE5DTEVsQlJIaENPMHRCVEVZN08wRkJSa2s3TzBGQlZVNHNSMEZCUVN4SFFVRk5MRk5CUVVFN1FVRkRTaXhOUVVGQk8wVkJRVUVzUjBGQlFTeEhRVUZOTEVOQlFVTXNRMEZCUXl4TlFVRkdMRU5CUVVFN1UwRkRUanRCUVVaSk96dEJRVWxPTEVkQlFVRXNSMEZCVFN4VFFVRkRMRlZCUVVRc1JVRkJZU3hMUVVGaUxFVkJRVzlDTEVsQlFYQkNPMEZCUTBvc1RVRkJRVHRGUVVGQkxFZEJRVUVzUjBGQlRUdEZRVU5PTEVsQlFVY3NWVUZCU0R0SlFVTkZMRTlCUVZFc1EwRkJRU3hWUVVGQkxFTkJRVklzUjBGQmMwSTdTVUZEZEVJc1NVRkJSeXhKUVVGSU8wMUJRMFVzUjBGQlFTeEhRVUZOTEVOQlFVTXNRMEZCUXl4TlFVRkdMRU5CUVZNc1ZVRkJWQ3hGUVVGeFFpeExRVUZ5UWl4RlFVRTBRaXhKUVVFMVFpeEZRVVJTTzB0QlFVRXNUVUZCUVR0TlFVZEZMRWRCUVVFc1IwRkJUU3hEUVVGRExFTkJRVU1zVFVGQlJpeERRVUZUTEZWQlFWUXNSVUZCY1VJc1MwRkJja0lzUlVGSVVqdExRVVpHT3p0VFFVMUJPMEZCVWtrN08wRkJWVTRzUjBGQlFTeEhRVUZOTEZOQlFVTXNWVUZCUkN4RlFVRmhMRWxCUVdJN1JVRkRTaXhKUVVGSExGVkJRVWc3U1VGRFJTeEpRVUZITEVsQlFVZzdUVUZEUlN4RFFVRkRMRU5CUVVNc1dVRkJSaXhEUVVGbExGVkJRV1lzUlVGQk1rSXNTVUZCTTBJc1JVRkVSanRMUVVGQkxFMUJRVUU3VFVGSFJTeERRVUZETEVOQlFVTXNXVUZCUml4RFFVRmxMRlZCUVdZc1JVRklSanM3U1VGSlFTeFBRVUZQTEU5QlFWRXNRMEZCUVN4VlFVRkJMRVZCVEdwQ096dEJRVVJKT3p0QlFWTk9MRk5CUVVFc1IwRkJXU3hUUVVGQk8wVkJRMVlzVDBGQlFTeEhRVUZWTzBWQlExWXNSVUZCUlN4RFFVRkRMRWxCUVVnc1EwRkJVU3hGUVVGRkxFTkJRVU1zVFVGQlRTeERRVUZETEVkQlFXeENMRVZCUVhWQ0xGTkJRVU1zUjBGQlJDeEZRVUZOTEVkQlFVNDdWMEZEY2tJc1JVRkJSU3hEUVVGRExFMUJRVTBzUTBGQlF5eFJRVUZFTEVOQlFWUXNRMEZCYVVJc1IwRkJha0k3UlVGRWNVSXNRMEZCZGtJN1FVRkdWVHM3UVVGTldDeEZRVUZGTEVOQlFVTXNUVUZCVFN4RFFVRkRMRkZCUVZZc1EwRkJiVUlzVjBGQmJrSXNSVUZCWjBNc1UwRkJhRU03TzBGQlEwRXNSVUZCUlN4RFFVRkRMRTFCUVUwc1EwRkJReXhSUVVGV0xFTkJRVzFDTEZGQlFXNUNMRVZCUVRaQ0xFZEJRVGRDT3p0QlFVTkJMRVZCUVVVc1EwRkJReXhOUVVGTkxFTkJRVU1zVVVGQlZpeERRVUZ0UWl4TFFVRnVRaXhGUVVFd1FpeEhRVUV4UWpzN1FVRkRRU3hGUVVGRkxFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWWXNRMEZCYlVJc1MwRkJia0lzUlVGQk1FSXNSMEZCTVVJN08wRkJRMEVzUlVGQlJTeERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRldMRU5CUVcxQ0xFdEJRVzVDTEVWQlFUSkNMRWRCUVROQ096dEJRVVZCTEUxQlFVMHNRMEZCUXl4UFFVRlFMRWRCUTBNN1JVRkJRU3hUUVVGQkxFVkJRVmNzVTBGQldEdEZRVU5CTEZGQlFVRXNSVUZCVVN4SFFVUlNPMFZCUlVFc1IwRkJRU3hGUVVGTExFZEJSa3c3UlVGSFFTeEhRVUZCTEVWQlFVc3NSMEZJVER0RlFVbEJMRWRCUVVFc1JVRkJUU3hIUVVwT0lpd2labWxzWlNJNkltZGxibVZ5WVhSbFpDNXFjeUlzSW5OdmRYSmpaVkp2YjNRaU9pSWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUpQU2lBOUlISmxjWFZwY21VZ0p5NHVMMjlxSjF4eVhHNGtJRDBnY21WeGRXbHlaU0FuYW5GMVpYSjVKMXh5WEc0Z0lGeHlYRzRqSXlOY2NseHVVMlYwZFhBZ2MyVjBkR2x1WjNOY2NseHVKQzVqYjI5cmFXVXVjbUYzSUQwZ2RISjFaVnh5WEc0a0xtTnZiMnRwWlM1cWMyOXVJRDBnZEhKMVpWeHlYRzRnSUZ4eVhHNVRaWFIxY0NCa1pXWmhkV3gwYzF4eVhHNW9kSFJ3Y3pvdkwyZHBkR2gxWWk1amIyMHZZMkZ5YUdGeWRHd3ZhbkYxWlhKNUxXTnZiMnRwWlM5Y2NseHVKQzVqYjI5cmFXVXVaR1ZtWVhWc2RITXVaWGh3YVhKbGN5QTlJRE0yTlZ4eVhHNGtMbU52YjJ0cFpTNWtaV1poZFd4MGN5NXdZWFJvSUQwZ0p5OG5YSEpjYmlRdVkyOXZhMmxsTG1SbFptRjFiSFJ6TG1SdmJXRnBiaUE5SUNkdmFpNWpiMjBuWEhKY2JpTWpJMXh5WEc1cFppQnViM1FnSkNCdmNpQnViM1FnSkM1amIyOXJhV1ZjY2x4dUlDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJZ0oycFJkV1Z5ZVNCRGIyOXJhV1VnYVhNZ1lTQnlaWEYxYVhKbFpDQmtaWEJsYm1SbGJtTjVMaWNnSUZ4eVhHNGtMbU52YjJ0cFpTNWtaV1poZFd4MGN5NXpaV04xY21VZ1BTQm1ZV3h6WlZ4eVhHNGdJRnh5WEc1amIyOXJhV1Z6SUQwZ2UzMWNjbHh1SUNCY2NseHVaMlYwSUQwZ0tHTnZiMnRwWlU1aGJXVXNJSFI1Y0dVcElDMCtYSEpjYmlBZ2NtVjBJRDBnSnlkY2NseHVJQ0JwWmlCamIyOXJhV1ZPWVcxbFhISmNiaUFnSUNCcFppQjBlWEJsWEhKY2JpQWdJQ0FnSUhKbGRDQTlJQ1F1WTI5dmEybGxJR052YjJ0cFpVNWhiV1VzSUhSNWNHVmNjbHh1SUNBZ0lHVnNjMlZjY2x4dUlDQWdJQ0FnY21WMElEMGdKQzVqYjI5cmFXVWdZMjl2YTJsbFRtRnRaU0FnSUNCY2NseHVJQ0FnSUdsbUlISmxkRnh5WEc0Z0lDQWdJQ0JqYjI5cmFXVnpXMk52YjJ0cFpVNWhiV1ZkSUQwZ2NtVjBYSEpjYmlBZ1hISmNibUZzYkNBOUlDMCtYSEpjYmlBZ2NtVjBJRDBnSkM1amIyOXJhV1VvS1Z4eVhHNGdJSEpsZEZ4eVhHNGdJQ0FnWEhKY2JuTmxkQ0E5SUNoamIyOXJhV1ZPWVcxbExDQjJZV3gxWlN3Z2IzQjBjeWtnTFQ1Y2NseHVJQ0J5WlhRZ1BTQW5KMXh5WEc0Z0lHbG1JR052YjJ0cFpVNWhiV1ZjY2x4dUlDQWdJR052YjJ0cFpYTmJZMjl2YTJsbFRtRnRaVjBnUFNCMllXeDFaVnh5WEc0Z0lDQWdhV1lnYjNCMGMxeHlYRzRnSUNBZ0lDQnlaWFFnUFNBa0xtTnZiMnRwWlNCamIyOXJhV1ZPWVcxbExDQjJZV3gxWlN3Z2IzQjBjMXh5WEc0Z0lDQWdaV3h6WlZ4eVhHNGdJQ0FnSUNCeVpYUWdQU0FrTG1OdmIydHBaU0JqYjI5cmFXVk9ZVzFsTENCMllXeDFaVnh5WEc0Z0lISmxkQ0FnWEhKY2JpQWdYSEpjYm1SbGJDQTlJQ2hqYjI5cmFXVk9ZVzFsTENCdmNIUnpLU0F0UGx4eVhHNGdJR2xtSUdOdmIydHBaVTVoYldWY2NseHVJQ0FnSUdsbUlHOXdkSE5jY2x4dUlDQWdJQ0FnSkM1eVpXMXZkbVZEYjI5cmFXVWdZMjl2YTJsbFRtRnRaU3dnYjNCMGMxeHlYRzRnSUNBZ1pXeHpaVnh5WEc0Z0lDQWdJQ0FrTG5KbGJXOTJaVU52YjJ0cFpTQmpiMjlyYVdWT1lXMWxJQ0FnSUZ4eVhHNGdJQ0FnWkdWc1pYUmxJR052YjJ0cFpYTmJZMjl2YTJsbFRtRnRaVjFjY2x4dUlDQnlaWFIxY201Y2NseHVJQ0FnSUZ4eVhHNWtaV3hsZEdWQmJHd2dQU0F0UGx4eVhHNGdJR052YjJ0cFpYTWdQU0I3ZlZ4eVhHNGdJRTlLTG1WaFkyZ2dUMG91WTI5dmEybGxMbUZzYkN3Z0tIWmhiQ3dnYTJWNUtTQXRQbHh5WEc0Z0lDQWdUMG91WTI5dmEybGxMbVJsYkdWMFpTQnJaWGtnSUZ4eVhHNGdJSEpsZEhWeWJseHlYRzRnSUNBZ1hISmNiaUJQU2k1amIyOXJhV1V1Y21WbmFYTjBaWElnSjJSbGJHVjBaVUZzYkNjc0lHUmxiR1YwWlVGc2JGeHlYRzRnVDBvdVkyOXZhMmxsTG5KbFoybHpkR1Z5SUNka1pXeGxkR1VuTENCa1pXeGNjbHh1SUU5S0xtTnZiMnRwWlM1eVpXZHBjM1JsY2lBbmMyVjBKeXdnYzJWMFhISmNiaUJQU2k1amIyOXJhV1V1Y21WbmFYTjBaWElnSjJkbGRDY3NJR2RsZEZ4eVhHNGdUMG91WTI5dmEybGxMbkpsWjJsemRHVnlJQ2RoYkd3bkxDQWdZV3hzWEhKY2JpQmNjbHh1SUcxdlpIVnNaUzVsZUhCdmNuUnpJRDBnWEhKY2JpQWdaR1ZzWlhSbFFXeHNPaUJrWld4bGRHVkJiR3hjY2x4dUlDQmtaV3hsZEdVNklHUmxiRnh5WEc0Z0lITmxkRG9nYzJWMFhISmNiaUFnWjJWME9pQm5aWFJjY2x4dUlDQmhiR3c2SUNCaGJHd2lYWDA9IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuZGVmZXIgPSAobWV0aG9kLCB3YWl0TXMpIC0+XHJcbiAgaWYgd2FpdE1zIGFuZCBzZXRUaW1lb3V0XHJcbiAgICBzZXRUaW1lb3V0IG1ldGhvZCwgd2FpdE1zXHJcbiAgKG5ldyBQcm9taXNlIChyZXNvbHZlKSAtPlxyXG4gICAgcmVzb2x2ZSgpKS50aGVuIG1ldGhvZFxyXG4gIFxyXG5PSi5yZWdpc3RlciAnZGVmZXInLCBkZWZlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmVyIiwiIyAjIGVhY2hcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jICMjIGNhbkVhY2hcclxuY2FuRWFjaCA9IChvYmopIC0+XHJcbiAgIyBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IFtpc10oaXMuaHRtbCkgdHJ1bHkgaXRlcmFibGUgKGUuZy4gYW4gaW5zdGFuY2Ugb2YgT2JqZWN0IG9yIEFycmF5KVxyXG4gIE9KLmlzLnBsYWluT2JqZWN0KG9iaikgb3IgT0ouaXMub2JqZWN0KG9iaikgb3IgT0ouaXMuYXJyYXkgb2JqXHJcblxyXG4jICMjIFtPSl0ob2ouaHRtbCkuZWFjaFxyXG5cclxuIyBJdGVyYXRlIGFsbCBvZiB0aGUgbWVtYmVycyBvZiBhbiBvYmplY3QgKG9yIGFuIGFycmF5KSB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGFuZCByZWN1cnNpb24uXHJcblxyXG4jIC0gYG9iamA6IHRoZSBvYmplY3QgdG8gaXRlcmF0ZSxcclxuIyAtIGBvbkVhY2hgOiBhIGNhbGxiYWNrIHRvIGV4ZWN1dGUgZm9yIGVhY2ggaXRlcmF0aW9uLFxyXG4jIC0gYHJlY3Vyc2l2ZWA6IGlmIHRydWUsIHJlY3Vyc2l2ZWx5IGl0ZXJhdGUgYWxsIHZhbGlkIGNoaWxkIG9iamVjdHMuXHJcbmVhY2ggPSAob2JqLCBvbkVhY2gsIHJlY3Vyc2l2ZSkgLT5cclxuICBpZiBjYW5FYWNoIG9ialxyXG4gICAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNmb3Jvd24pJ3MgYGZvck93bmAgbWV0aG9kIHRvIGVuc3VyZSB0aGF0IG9ubHkgdGhlIGFjdHVhbCBwcm9wZXJ0aWVzIG9mIHRoZSBvYmplY3QgYXJlIGVudW1lcmF0ZWQuXHJcblxyXG4gICAgIyAtIGBvbkVhY2hgIGNhbGxiYWNrIHdpbGwgcmVjZWl2ZSAyIHBhcmFtZXRlcnM6XHJcbiAgICAjIC0gYHZhbGAgYW5kIGBrZXlgLlxyXG4gICAgIyAtIGB2YWxgIGlzIGFsd2F5cyB0aGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5LlxyXG4gICAgIyAtIGBrZXlgIGlzIGVpdGhlciB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb3IgdGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIGFycmF5LlxyXG4gICAgXy5mb3JPd24gb2JqLCAodmFsLCBrZXkpIC0+XHJcbiAgICAgIGlmIG9uRWFjaCBhbmQgKHZhbCBvciBrZXkpXHJcbiAgICAgICAgcXVpdCA9IG9uRWFjaCB2YWwsIGtleVxyXG4gICAgICAgIHJldHVybiBmYWxzZSAgaWYgZmFsc2UgaXMgcXVpdFxyXG4gICAgICBlYWNoIHZhbCwgb25FYWNoLCB0cnVlICBpZiB0cnVlIGlzIHJlY3Vyc2l2ZVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgcmV0dXJuXHJcblxyXG4jICMjIHJlZ2lzdGVyXHJcblxyXG4jIHJlZ2lzdGVyIHRoZSBgZWFjaGAgbWV0aG9kIG9uIHRoZSBbT0pdKE9KLmh0bWwpIG5hbWVzcGFjZVxyXG5PSi5yZWdpc3RlciAnZWFjaCcsIGVhY2hcclxubW9kdWxlLmV4cG9ydHMgPSBlYWNoIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxudW5rbm93biA9ICd1bmtub3duJyAgIFxyXG4gIFxyXG5pbnB1dFR5cGVzID1cclxuICBidXR0b246ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMFxyXG4gICAgbmFtZTogJ2J1dHRvbidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgY2hlY2tib3g6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMVxyXG4gICAgbmFtZTogJ2NoZWNrYm94J1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGNvbG9yOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDJcclxuICAgIG5hbWU6ICdjb2xvcidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBkYXRlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDNcclxuICAgIG5hbWU6ICdkYXRlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgZGF0ZXRpbWU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogNFxyXG4gICAgbmFtZTogJ2RhdGV0aW1lJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICdkYXRldGltZS1sb2NhbCc6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogNVxyXG4gICAgbmFtZTogJ2RhdGV0aW1lLWxvY2FsJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgZW1haWw6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogNlxyXG4gICAgbmFtZTogJ2VtYWlsJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBmaWxlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDdcclxuICAgIG5hbWU6ICdmaWxlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IGZhbHNlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgaGlkZGVuOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDhcclxuICAgIG5hbWU6ICdoaWRkZW4nXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGltYWdlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDlcclxuICAgIG5hbWU6ICdpbWFnZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgbW9udGg6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTBcclxuICAgIG5hbWU6ICdtb250aCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgbnVtYmVyOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDExXHJcbiAgICBuYW1lOiAnbnVtYmVyJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHBhc3N3b3JkOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDEyXHJcbiAgICBuYW1lOiAncGFzc3dvcmQnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICByYWRpbzogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxM1xyXG4gICAgbmFtZTogJ3JhZGlvJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHJhbmdlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE0XHJcbiAgICBuYW1lOiAncmFuZ2UnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcmVzZXQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTVcclxuICAgIG5hbWU6ICdyZXNldCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgc2VhcmNoOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE2XHJcbiAgICBuYW1lOiAnc2VhcmNoJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgc3VibWl0OiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE3XHJcbiAgICBuYW1lOiAnc3VibWl0J1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB0ZWw6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMThcclxuICAgIG5hbWU6ICdidXR0b24nXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB0ZXh0OiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE5XHJcbiAgICBuYW1lOiAndGV4dCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgdGltZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMFxyXG4gICAgbmFtZTogJ3RpbWUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB1cmw6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMjFcclxuICAgIG5hbWU6ICd1cmwnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHdlZWs6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMjJcclxuICAgIG5hbWU6ICd3ZWVrJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuT0ouZW51bXMucmVnaXN0ZXIgJ3Vua25vd24nLCB1bmtub3duXHJcbk9KLmVudW1zLnJlZ2lzdGVyICdpbnB1dFR5cGVzJywgaW5wdXRUeXBlc1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBcclxuICB1bmtub3duOiB1bmtub3duXHJcbiAgaW5wdXRUeXBlczogaW5wdXRUeXBlcyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciAkLCBJUywgT0osIF87XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WyckJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyckJ10gOiBudWxsKTtcblxuXyA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydfJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydfJ10gOiBudWxsKTtcblxuSVMgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIElTKCkge31cblxuICBJUy5ib29sID0gZnVuY3Rpb24oYm9vbGVhbikge1xuICAgIHJldHVybiBfLmlzQm9vbGVhbihib29sZWFuKTtcbiAgfTtcblxuICBJUy5hcnJheU51bGxPckVtcHR5ID0gZnVuY3Rpb24oYXJyKSB7XG4gICAgcmV0dXJuIF8uaXNFbXB0eShhcnIpO1xuICB9O1xuXG4gIElTLnN0cmluZ051bGxPckVtcHR5ID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgcmV0dXJuIHN0ciAmJiAoIXN0ci5sZW5ndGggfHwgc3RyLmxlbmd0aCA9PT0gMCB8fCAhc3RyLnRyaW0gfHwgIXN0ci50cmltKCkpO1xuICB9O1xuXG4gIElTLm51bWJlck51bGxPckVtcHR5ID0gZnVuY3Rpb24obnVtKSB7XG4gICAgcmV0dXJuICFudW0gfHwgaXNOYU4obnVtKSB8fCAhbnVtLnRvUHJlY2lzaW9uO1xuICB9O1xuXG4gIElTLmRhdGVOdWxsT3JFbXB0eSA9IGZ1bmN0aW9uKGR0KSB7XG4gICAgcmV0dXJuICFkdCB8fCAhZHQuZ2V0VGltZTtcbiAgfTtcblxuICBJUy5vYmplY3ROdWxsT3JFbXB0eSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzRW1wdHkob2JqIHx8ICFPYmplY3Qua2V5cyhvYmopIHx8IE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwKTtcbiAgfTtcblxuICBJUy5wbGFpbk9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBfLmlzUGxhaW5PYmplY3Qob2JqKTtcbiAgfTtcblxuICBJUy5vYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gXy5pc09iamVjdChvYmopO1xuICB9O1xuXG4gIElTLmRhdGUgPSBmdW5jdGlvbihkdCkge1xuICAgIHJldHVybiBfLmlzRGF0ZShkdCk7XG4gIH07XG5cblxuICAvKlxuICBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgYW4gaW5zdGFuY2Ugb2YgYSBOdW1iZXIgYW5kIG5vdCBOYU4qXG4gICAqL1xuXG4gIElTLm51bWJlciA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBudW1iZXI7XG4gICAgbnVtYmVyID0gcmVxdWlyZSgnLi4vY29yZS9udW1iZXInKTtcbiAgICByZXR1cm4gdHlwZW9mIG51bSA9PT0gJ251bWJlcicgJiYgZmFsc2UgPT09IChudW1iZXIuaXNOYU4obnVtKSB8fCBmYWxzZSA9PT0gbnVtYmVyLmlzRmluaXRlKG51bSkgfHwgbnVtYmVyLk1BWF9WQUxVRSA9PT0gbnVtIHx8IG51bWJlci5NSU5fVkFMVUUgPT09IG51bSk7XG4gIH07XG5cblxuICAvKlxuICBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgY29udmVydGlibGUgdG8gYSBOdW1iZXJcbiAgICovXG5cbiAgSVMubnVtZXJpYyA9IGZ1bmN0aW9uKG51bSkge1xuICAgIHZhciBudU51bSwgcmV0LCB0bztcbiAgICByZXQgPSB0aGlzLm51bWJlcihudW0pO1xuICAgIGlmICghcmV0KSB7XG4gICAgICB0byA9IHJlcXVpcmUoJy4vdG8nKTtcbiAgICAgIG51TnVtID0gdG8ubnVtYmVyKG51bSk7XG4gICAgICByZXQgPSB0aGlzLm51bWJlcihudU51bSk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgSVMuZWxlbWVudEluRG9tID0gZnVuY3Rpb24oZWxlbWVudElkKSB7XG4gICAgcmV0dXJuIGZhbHNlID09PSB0aGlzLm51bGxPckVtcHR5KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCkpO1xuICB9O1xuXG4gIElTLmFycmF5ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIF8uaXNBcnJheShvYmopO1xuICB9O1xuXG4gIElTLnN0cmluZyA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHJldHVybiBfLmlzU3RyaW5nKHN0cik7XG4gIH07XG5cbiAgSVNbXCJ0cnVlXCJdID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdHJ1ZSB8fCBvYmogPT09ICd0cnVlJyB8fCBvYmogPT09IDEgfHwgb2JqID09PSAnMSc7XG4gIH07XG5cbiAgSVNbXCJmYWxzZVwiXSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IGZhbHNlIHx8IG9iaiA9PT0gJ2ZhbHNlJyB8fCBvYmogPT09IDAgfHwgb2JqID09PSAnMCc7XG4gIH07XG5cbiAgSVMudHJ1ZU9yRmFsc2UgPSBmdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gdGhpc1tcInRydWVcIl0ob2JqIHx8IHRoaXNbXCJmYWxzZVwiXShvYmopKTtcbiAgfTtcblxuICBJUy5udWxsT3JFbXB0eSA9IGZ1bmN0aW9uKG9iaiwgY2hlY2tMZW5ndGgpIHtcbiAgICByZXR1cm4gXy5pc0VtcHR5KG9iaikgfHwgXy5pc1VuZGVmaW5lZChvYmopIHx8IF8uaXNOdWxsKG9iaikgfHwgXy5pc05hTihvYmopO1xuICB9O1xuXG4gIElTLm51bGxPclVuZGVmaW5lZCA9IGZ1bmN0aW9uKG9iaiwgY2hlY2tMZW5ndGgpIHtcbiAgICByZXR1cm4gXy5pc1VuZGVmaW5lZChvYmopIHx8IF8uaXNOdWxsKG9iaikgfHwgXy5pc05hTihvYmopO1xuICB9O1xuXG4gIElTW1wiaW5zdGFuY2VvZlwiXSA9IGZ1bmN0aW9uKG5hbWUsIG9iaikge1xuICAgIHJldHVybiBvYmoudHlwZSA9PT0gbmFtZSB8fCBvYmogaW5zdGFuY2VvZiBuYW1lO1xuICB9O1xuXG4gIElTLm1ldGhvZCA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBvYmogIT09IE9KLm5vb3AgJiYgXy5pc0Z1bmN0aW9uKG9iaik7XG4gIH07XG5cblxuICAvKlxuICBEZXByZWNhdGVkLiBMZWZ0IGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4gVXNlIGlzLm1ldGhvZCBpbnN0ZWFkLlxuICAgKi9cblxuICBJUy5mdW5jID0gSVMubWV0aG9kO1xuXG4gIHJldHVybiBJUztcblxufSkoKTtcblxuT0oucmVnaXN0ZXIoJ2lzJywgSVMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IElTO1xuXG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1RNlhGeEhhWFJvZFdKY1hHOXFYRnh6Y21OY1hHTnZabVpsWlZ4Y2RHOXZiSE5jWEdsekxtTnZabVpsWlNKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pTzBGQlFVRXNTVUZCUVRzN1FVRkJRU3hGUVVGQkxFZEJRVXNzVDBGQlFTeERRVUZSTEU5QlFWSTdPMEZCUTB3c1EwRkJRU3hIUVVGSkxFOUJRVUVzUTBGQlVTeFJRVUZTT3p0QlFVTktMRU5CUVVFc1IwRkJTU3hQUVVGQkxFTkJRVkVzVVVGQlVqczdRVUZGUlRzN08wVkJSVW9zUlVGQlF5eERRVUZCTEVsQlFVUXNSMEZCVHl4VFFVRkRMRTlCUVVRN1YwRkRUQ3hEUVVGRExFTkJRVU1zVTBGQlJpeERRVUZaTEU5QlFWbzdSVUZFU3pzN1JVRkhVQ3hGUVVGRExFTkJRVUVzWjBKQlFVUXNSMEZCYlVJc1UwRkJReXhIUVVGRU8xZEJRMnBDTEVOQlFVTXNRMEZCUXl4UFFVRkdMRU5CUVZVc1IwRkJWanRGUVVScFFqczdSVUZIYmtJc1JVRkJReXhEUVVGQkxHbENRVUZFTEVkQlFXOUNMRk5CUVVNc1IwRkJSRHRYUVVOc1FpeEhRVUZCTEVsQlFWRXNRMEZCUXl4RFFVRkpMRWRCUVVjc1EwRkJReXhOUVVGU0xFbEJRV3RDTEVkQlFVY3NRMEZCUXl4TlFVRktMRXRCUVdNc1EwRkJhRU1zU1VGQmNVTXNRMEZCU1N4SFFVRkhMRU5CUVVNc1NVRkJOME1zU1VGQmNVUXNRMEZCU1N4SFFVRkhMRU5CUVVNc1NVRkJTaXhEUVVGQkxFTkJRVEZFTzBWQlJGVTdPMFZCUjNCQ0xFVkJRVU1zUTBGQlFTeHBRa0ZCUkN4SFFVRnZRaXhUUVVGRExFZEJRVVE3VjBGRGJFSXNRMEZCU1N4SFFVRktMRWxCUVZjc1MwRkJRU3hEUVVGTkxFZEJRVTRzUTBGQldDeEpRVUY1UWl4RFFVRkpMRWRCUVVjc1EwRkJRenRGUVVSbU96dEZRVWR3UWl4RlFVRkRMRU5CUVVFc1pVRkJSQ3hIUVVGclFpeFRRVUZETEVWQlFVUTdWMEZEYUVJc1EwRkJTU3hGUVVGS0xFbEJRVlVzUTBGQlNTeEZRVUZGTEVOQlFVTTdSVUZFUkRzN1JVRkhiRUlzUlVGQlF5eERRVUZCTEdsQ1FVRkVMRWRCUVc5Q0xGTkJRVU1zUjBGQlJEdFhRVU5zUWl4RFFVRkRMRU5CUVVNc1QwRkJSaXhEUVVGVkxFZEJRVUVzU1VGQlR5eERRVUZKTEUxQlFVMHNRMEZCUXl4SlFVRlFMRU5CUVZrc1IwRkJXaXhEUVVGWUxFbEJRU3RDTEUxQlFVMHNRMEZCUXl4SlFVRlFMRU5CUVZrc1IwRkJXaXhEUVVGblFpeERRVUZETEUxQlFXcENMRXRCUVRKQ0xFTkJRWEJGTzBWQlJHdENPenRGUVVkd1FpeEZRVUZETEVOQlFVRXNWMEZCUkN4SFFVRmpMRk5CUVVNc1IwRkJSRHRYUVVOYUxFTkJRVU1zUTBGQlF5eGhRVUZHTEVOQlFXZENMRWRCUVdoQ08wVkJSRms3TzBWQlIyUXNSVUZCUXl4RFFVRkJMRTFCUVVRc1IwRkJVeXhUUVVGRExFZEJRVVE3VjBGRFVDeERRVUZETEVOQlFVTXNVVUZCUml4RFFVRlhMRWRCUVZnN1JVRkVUenM3UlVGSFZDeEZRVUZETEVOQlFVRXNTVUZCUkN4SFFVRlBMRk5CUVVNc1JVRkJSRHRYUVVOTUxFTkJRVU1zUTBGQlF5eE5RVUZHTEVOQlFWTXNSVUZCVkR0RlFVUkxPenM3UVVGSlVEczdPenRGUVVkQkxFVkJRVU1zUTBGQlFTeE5RVUZFTEVkQlFWTXNVMEZCUXl4SFFVRkVPMEZCUTFBc1VVRkJRVHRKUVVGQkxFMUJRVUVzUjBGQlV5eFBRVUZCTEVOQlFWRXNaMEpCUVZJN1YwRkRWQ3hQUVVGUExFZEJRVkFzUzBGQll5eFJRVUZrTEVsQlFUSkNMRXRCUVVFc1MwRkJVeXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZRTEVOQlFXRXNSMEZCWWl4RFFVRkJMRWxCUVhGQ0xFdEJRVUVzUzBGQlV5eE5RVUZOTEVOQlFVTXNVVUZCVUN4RFFVRm5RaXhIUVVGb1FpeERRVUU1UWl4SlFVRnpSQ3hOUVVGTkxFTkJRVU1zVTBGQlVDeExRVUZ2UWl4SFFVRXhSU3hKUVVGcFJpeE5RVUZOTEVOQlFVTXNVMEZCVUN4TFFVRnZRaXhIUVVGMFJ6dEZRVVkzUWpzN08wRkJTVlE3T3pzN1JVRkhRU3hGUVVGRExFTkJRVUVzVDBGQlJDeEhRVUZWTEZOQlFVTXNSMEZCUkR0QlFVTlNMRkZCUVVFN1NVRkJRU3hIUVVGQkxFZEJRVTBzU1VGQlF5eERRVUZCTEUxQlFVUXNRMEZCVVN4SFFVRlNPMGxCUTA0c1NVRkJRU3hEUVVGUExFZEJRVkE3VFVGRFJTeEZRVUZCTEVkQlFVc3NUMEZCUVN4RFFVRlJMRTFCUVZJN1RVRkRUQ3hMUVVGQkxFZEJRVkVzUlVGQlJTeERRVUZETEUxQlFVZ3NRMEZCVlN4SFFVRldPMDFCUTFJc1IwRkJRU3hIUVVGTkxFbEJRVU1zUTBGQlFTeE5RVUZFTEVOQlFWRXNTMEZCVWl4RlFVaFNPenRYUVVsQk8wVkJUbEU3TzBWQlVWWXNSVUZCUXl4RFFVRkJMRmxCUVVRc1IwRkJaU3hUUVVGRExGTkJRVVE3VjBGRFlpeExRVUZCTEV0QlFWTXNTVUZCUXl4RFFVRkJMRmRCUVVRc1EwRkJZU3hSUVVGUkxFTkJRVU1zWTBGQlZDeERRVUYzUWl4VFFVRjRRaXhEUVVGaU8wVkJSRWs3TzBWQlIyWXNSVUZCUXl4RFFVRkJMRXRCUVVRc1IwRkJVU3hUUVVGRExFZEJRVVE3VjBGRFRpeERRVUZETEVOQlFVTXNUMEZCUml4RFFVRlZMRWRCUVZZN1JVRkVUVHM3UlVGSFVpeEZRVUZETEVOQlFVRXNUVUZCUkN4SFFVRlRMRk5CUVVNc1IwRkJSRHRYUVVOUUxFTkJRVU1zUTBGQlF5eFJRVUZHTEVOQlFWY3NSMEZCV0R0RlFVUlBPenRGUVVkVUxFVkJRVU1zUTBGQlFTeE5RVUZCTEVOQlFVUXNSMEZCVHl4VFFVRkRMRWRCUVVRN1YwRkRUQ3hIUVVGQkxFdEJRVThzU1VGQlVDeEpRVUZsTEVkQlFVRXNTMEZCVHl4TlFVRjBRaXhKUVVGblF5eEhRVUZCTEV0QlFVOHNRMEZCZGtNc1NVRkJORU1zUjBGQlFTeExRVUZQTzBWQlJEbERPenRGUVVkUUxFVkJRVU1zUTBGQlFTeFBRVUZCTEVOQlFVUXNSMEZCVVN4VFFVRkRMRWRCUVVRN1YwRkRUaXhIUVVGQkxFdEJRVThzUzBGQlVDeEpRVUZuUWl4SFFVRkJMRXRCUVU4c1QwRkJka0lzU1VGQmEwTXNSMEZCUVN4TFFVRlBMRU5CUVhwRExFbEJRVGhETEVkQlFVRXNTMEZCVHp0RlFVUXZRenM3UlVGSFVpeEZRVUZETEVOQlFVRXNWMEZCUkN4SFFVRmpMRk5CUVVNc1IwRkJSRHRYUVVOYUxFbEJRVU1zUTBGQlFTeE5RVUZCTEVOQlFVUXNRMEZCVFN4SFFVRkJMRWxCUVU4c1NVRkJReXhEUVVGQkxFOUJRVUVzUTBGQlJDeERRVUZQTEVkQlFWQXNRMEZCWWp0RlFVUlpPenRGUVVka0xFVkJRVU1zUTBGQlFTeFhRVUZFTEVkQlFXTXNVMEZCUXl4SFFVRkVMRVZCUVUwc1YwRkJUanRYUVVOYUxFTkJRVU1zUTBGQlF5eFBRVUZHTEVOQlFWVXNSMEZCVml4RFFVRkJMRWxCUVd0Q0xFTkJRVU1zUTBGQlF5eFhRVUZHTEVOQlFXTXNSMEZCWkN4RFFVRnNRaXhKUVVGM1F5eERRVUZETEVOQlFVTXNUVUZCUml4RFFVRlRMRWRCUVZRc1EwRkJlRU1zU1VGQmVVUXNRMEZCUXl4RFFVRkRMRXRCUVVZc1EwRkJVU3hIUVVGU08wVkJSRGRET3p0RlFVZGtMRVZCUVVNc1EwRkJRU3hsUVVGRUxFZEJRV3RDTEZOQlFVTXNSMEZCUkN4RlFVRk5MRmRCUVU0N1YwRkRhRUlzUTBGQlF5eERRVUZETEZkQlFVWXNRMEZCWXl4SFFVRmtMRU5CUVVFc1NVRkJjMElzUTBGQlF5eERRVUZETEUxQlFVWXNRMEZCVXl4SFFVRlVMRU5CUVhSQ0xFbEJRWFZETEVOQlFVTXNRMEZCUXl4TFFVRkdMRU5CUVZFc1IwRkJVanRGUVVSMlFqczdSVUZIYkVJc1JVRkJReXhEUVVGQkxGbEJRVUVzUTBGQlJDeEhRVUZoTEZOQlFVTXNTVUZCUkN4RlFVRlBMRWRCUVZBN1YwRkRXQ3hIUVVGSExFTkJRVU1zU1VGQlNpeExRVUZaTEVsQlFWb3NTVUZCYjBJc1IwRkJRU3haUVVGbE8wVkJSSGhDT3p0RlFVZGlMRVZCUVVNc1EwRkJRU3hOUVVGRUxFZEJRVk1zVTBGQlF5eEhRVUZFTzFkQlExQXNSMEZCUVN4TFFVRlRMRVZCUVVVc1EwRkJReXhKUVVGYUxFbEJRWEZDTEVOQlFVTXNRMEZCUXl4VlFVRkdMRU5CUVdFc1IwRkJZanRGUVVSa096czdRVUZIVkRzN096dEZRVWRCTEVWQlFVTXNRMEZCUVN4SlFVRkVMRWRCUVZFc1JVRkJReXhEUVVGQk96czdPenM3UVVGSldDeEZRVUZGTEVOQlFVTXNVVUZCU0N4RFFVRlpMRWxCUVZvc1JVRkJhMElzUlVGQmJFSTdPMEZCUTBFc1RVRkJUU3hEUVVGRExFOUJRVkFzUjBGQmFVSWlMQ0ptYVd4bElqb2laMlZ1WlhKaGRHVmtMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWs5S0lEMGdjbVZ4ZFdseVpTQW5MaTR2YjJvblhHNGtJRDBnY21WeGRXbHlaU0FuYW5GMVpYSjVKMXh1WHlBOUlISmxjWFZwY21VZ0oyeHZaR0Z6YUNkY2JseHVZMnhoYzNNZ1NWTmNibHh1SUNCQVltOXZiRG9nS0dKdmIyeGxZVzRwSUMwK1hHNGdJQ0FnWHk1cGMwSnZiMnhsWVc0Z1ltOXZiR1ZoYmx4dVhHNGdJRUJoY25KaGVVNTFiR3hQY2tWdGNIUjVPaUFvWVhKeUtTQXRQbHh1SUNBZ0lGOHVhWE5GYlhCMGVTQmhjbkpjYmx4dUlDQkFjM1J5YVc1blRuVnNiRTl5Ulcxd2RIazZJQ2h6ZEhJcElDMCtYRzRnSUNBZ2MzUnlJR0Z1WkNBb2JtOTBJSE4wY2k1c1pXNW5kR2dnYjNJZ2MzUnlMbXhsYm1kMGFDQnBjeUF3SUc5eUlHNXZkQ0J6ZEhJdWRISnBiU0J2Y2lCdWIzUWdjM1J5TG5SeWFXMG9LU2xjYmx4dUlDQkFiblZ0WW1WeVRuVnNiRTl5Ulcxd2RIazZJQ2h1ZFcwcElDMCtYRzRnSUNBZ2JtOTBJRzUxYlNCdmNpQnBjMDVoVGlodWRXMHBJRzl5SUc1dmRDQnVkVzB1ZEc5UWNtVmphWE5wYjI1Y2JseHVJQ0JBWkdGMFpVNTFiR3hQY2tWdGNIUjVPaUFvWkhRcElDMCtYRzRnSUNBZ2JtOTBJR1IwSUc5eUlHNXZkQ0JrZEM1blpYUlVhVzFsWEc1Y2JpQWdRRzlpYW1WamRFNTFiR3hQY2tWdGNIUjVPaUFvYjJKcUtTQXRQbHh1SUNBZ0lGOHVhWE5GYlhCMGVTQnZZbW9nYjNJZ2JtOTBJRTlpYW1WamRDNXJaWGx6S0c5aWFpa2diM0lnVDJKcVpXTjBMbXRsZVhNb2IySnFLUzVzWlc1bmRHZ2dhWE1nTUZ4dVhHNGdJRUJ3YkdGcGJrOWlhbVZqZERvZ0tHOWlhaWtnTFQ1Y2JpQWdJQ0JmTG1selVHeGhhVzVQWW1wbFkzUWdiMkpxWEc1Y2JpQWdRRzlpYW1WamREb2dLRzlpYWlrZ0xUNWNiaUFnSUNCZkxtbHpUMkpxWldOMElHOWlhbHh1WEc0Z0lFQmtZWFJsT2lBb1pIUXBJQzArWEc0Z0lDQWdYeTVwYzBSaGRHVWdaSFJjYmx4dVhHNGdJQ01qSTF4dUlDQkVaWFJsY20xcGJtVnpJR2xtSUdFZ2RtRnNkV1VnYVhNZ1lXNGdhVzV6ZEdGdVkyVWdiMllnWVNCT2RXMWlaWElnWVc1a0lHNXZkQ0JPWVU0cVhHNGdJQ01qSTF4dUlDQkFiblZ0WW1WeU9pQW9iblZ0S1NBdFBseHVJQ0FnSUc1MWJXSmxjaUE5SUhKbGNYVnBjbVVnSnk0dUwyTnZjbVV2Ym5WdFltVnlKMXh1SUNBZ0lIUjVjR1Z2WmlCdWRXMGdhWE1nSjI1MWJXSmxjaWNnWVc1a0lHWmhiSE5sSUdseklDaHVkVzFpWlhJdWFYTk9ZVTRvYm5WdEtTQnZjaUJtWVd4elpTQnBjeUJ1ZFcxaVpYSXVhWE5HYVc1cGRHVW9iblZ0S1NCdmNpQnVkVzFpWlhJdVRVRllYMVpCVEZWRklHbHpJRzUxYlNCdmNpQnVkVzFpWlhJdVRVbE9YMVpCVEZWRklHbHpJRzUxYlNsY2JseHVJQ0FqSXlOY2JpQWdSR1YwWlhKdGFXNWxjeUJwWmlCaElIWmhiSFZsSUdseklHTnZiblpsY25ScFlteGxJSFJ2SUdFZ1RuVnRZbVZ5WEc0Z0lDTWpJMXh1SUNCQWJuVnRaWEpwWXpvZ0tHNTFiU2tnTFQ1Y2JpQWdJQ0J5WlhRZ1BTQkFiblZ0WW1WeUtHNTFiU2xjYmlBZ0lDQjFibXhsYzNNZ2NtVjBYRzRnSUNBZ0lDQjBieUE5SUhKbGNYVnBjbVVnSnk0dmRHOG5YRzRnSUNBZ0lDQnVkVTUxYlNBOUlIUnZMbTUxYldKbGNpaHVkVzBwWEc0Z0lDQWdJQ0J5WlhRZ1BTQkFiblZ0WW1WeUtHNTFUblZ0S1Z4dUlDQWdJSEpsZEZ4dVhHNGdJRUJsYkdWdFpXNTBTVzVFYjIwNklDaGxiR1Z0Wlc1MFNXUXBJQzArWEc0Z0lDQWdabUZzYzJVZ2FYTWdRRzUxYkd4UGNrVnRjSFI1S0dSdlkzVnRaVzUwTG1kbGRFVnNaVzFsYm5SQ2VVbGtLR1ZzWlcxbGJuUkpaQ2twWEc1Y2JpQWdRR0Z5Y21GNU9pQW9iMkpxS1NBdFBseHVJQ0FnSUY4dWFYTkJjbkpoZVNCdlltcGNibHh1SUNCQWMzUnlhVzVuT2lBb2MzUnlLU0F0UGx4dUlDQWdJRjh1YVhOVGRISnBibWNnYzNSeVhHNWNiaUFnUUhSeWRXVTZJQ2h2WW1vcElDMCtYRzRnSUNBZ2IySnFJR2x6SUhSeWRXVWdiM0lnYjJKcUlHbHpJQ2QwY25WbEp5QnZjaUJ2WW1vZ2FYTWdNU0J2Y2lCdlltb2dhWE1nSnpFblhHNWNiaUFnUUdaaGJITmxPaUFvYjJKcUtTQXRQbHh1SUNBZ0lHOWlhaUJwY3lCbVlXeHpaU0J2Y2lCdlltb2dhWE1nSjJaaGJITmxKeUJ2Y2lCdlltb2dhWE1nTUNCdmNpQnZZbW9nYVhNZ0p6QW5YRzVjYmlBZ1FIUnlkV1ZQY2taaGJITmxPaUFvYjJKcUtTQXRQbHh1SUNBZ0lFQjBjblZsSUc5aWFpQnZjaUJBWm1Gc2MyVWdiMkpxWEc1Y2JpQWdRRzUxYkd4UGNrVnRjSFI1T2lBb2IySnFMQ0JqYUdWamEweGxibWQwYUNrZ0xUNWNiaUFnSUNCZkxtbHpSVzF3ZEhrb2IySnFLU0J2Y2lCZkxtbHpWVzVrWldacGJtVmtLRzlpYWlrZ2IzSWdYeTVwYzA1MWJHd29iMkpxS1NCdmNpQmZMbWx6VG1GT0tHOWlhaWxjYmx4dUlDQkFiblZzYkU5eVZXNWtaV1pwYm1Wa09pQW9iMkpxTENCamFHVmphMHhsYm1kMGFDa2dMVDVjYmlBZ0lDQmZMbWx6Vlc1a1pXWnBibVZrS0c5aWFpa2diM0lnWHk1cGMwNTFiR3dvYjJKcUtTQnZjaUJmTG1selRtRk9LRzlpYWlsY2JseHVJQ0JBYVc1emRHRnVZMlZ2WmpvZ0tHNWhiV1VzSUc5aWFpa2dMVDVjYmlBZ0lDQnZZbW91ZEhsd1pTQnBjeUJ1WVcxbElHOXlJRzlpYWlCcGJuTjBZVzVqWlc5bUlHNWhiV1ZjYmx4dUlDQkFiV1YwYUc5a09pQW9iMkpxS1NBdFBseHVJQ0FnSUc5aWFpQnBjMjUwSUU5S0xtNXZiM0FnWVc1a0lGOHVhWE5HZFc1amRHbHZiaUJ2WW1wY2JseHVJQ0FqSXlOY2JpQWdSR1Z3Y21WallYUmxaQzRnVEdWbWRDQm1iM0lnWW1GamEzZGhjbVJ6SUdOdmJYQmhkR2xpYVd4cGRIa3VJRlZ6WlNCcGN5NXRaWFJvYjJRZ2FXNXpkR1ZoWkM1Y2JpQWdJeU1qWEc0Z0lFQm1kVzVqSUQwZ1FHMWxkR2h2WkZ4dVhHNWNibHh1VDBvdWNtVm5hWE4wWlhJZ0oybHpKeXdnU1ZOY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1NWTmNibHh1SWwxOSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBPSiwgbWFrZU5vdHksIG5vdHk7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxubm90eSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Wydub3R5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydub3R5J10gOiBudWxsKTtcblxubWFrZU5vdHkgPSBmdW5jdGlvbihvcHRpb25zLCBvd25lcikge1xuICB2YXIgZGVmYXVsdHMsIHJldDtcbiAgZGVmYXVsdHMgPSB7XG4gICAgbGF5b3V0OiAndG9wUmlnaHQnLFxuICAgIHRoZW1lOiAnZGVmYXVsdFRoZW1lJyxcbiAgICB0eXBlOiAnYWxlcnQnLFxuICAgIHRleHQ6ICcnLFxuICAgIGRpc21pc3NRdWV1ZTogdHJ1ZSxcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJub3R5X21lc3NhZ2VcIj48c3BhbiBjbGFzcz1cIm5vdHlfdGV4dFwiPjwvc3Bhbj48ZGl2IGNsYXNzPVwibm90eV9jbG9zZVwiPjwvZGl2PjwvZGl2PicsXG4gICAgYW5pbWF0aW9uOiB7XG4gICAgICBvcGVuOiB7XG4gICAgICAgIGhlaWdodDogJ3RvZ2dsZSdcbiAgICAgIH0sXG4gICAgICBjbG9zZToge1xuICAgICAgICBoZWlnaHQ6ICd0b2dnbGUnXG4gICAgICB9LFxuICAgICAgZWFzaW5nOiAnc3dpbmcnLFxuICAgICAgc3BlZWQ6IDUwMFxuICAgIH0sXG4gICAgdGltZW91dDogNTAwMCxcbiAgICBmb3JjZTogZmFsc2UsXG4gICAgbW9kYWw6IGZhbHNlLFxuICAgIG1heFZpc2libGU6IDUsXG4gICAga2lsbGVyOiBmYWxzZSxcbiAgICBjbG9zZVdpdGg6IFsnY2xpY2snXSxcbiAgICBjYWxsYmFjazoge1xuICAgICAgb25TaG93OiBPSi5ub29wLFxuICAgICAgYWZ0ZXJTaG93OiBPSi5ub29wLFxuICAgICAgb25DbG9zZTogT0oubm9vcCxcbiAgICAgIGFmdGVyQ2xvc2U6IE9KLm5vb3BcbiAgICB9LFxuICAgIGJ1dHRvbnM6IGZhbHNlXG4gIH07XG4gIE9KLmV4dGVuZChkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZSk7XG4gIHJldCA9IG5vdHkoZGVmYXVsdHMpO1xuICByZXR1cm4gcmV0O1xufTtcblxuT0oubm90aWZpY2F0aW9ucy5yZWdpc3Rlcignbm90eScsIG1ha2VOb3R5KTtcblxubW9kdWxlLmV4cG9ydHMgPSBtYWtlTm90eTtcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltUTZYRnhIYVhSb2RXSmNYRzlxWEZ4emNtTmNYR052Wm1abFpWeGNkRzl2YkhOY1hHNXZkSGt1WTI5bVptVmxJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVN4SlFVRkJPenRCUVVGQkxFVkJRVUVzUjBGQlN5eFBRVUZCTEVOQlFWRXNUMEZCVWpzN1FVRkRUQ3hKUVVGQkxFZEJRVThzVDBGQlFTeERRVUZSTEUxQlFWSTdPMEZCUjFBc1VVRkJRU3hIUVVGWExGTkJRVU1zVDBGQlJDeEZRVUZWTEV0QlFWWTdRVUZEVkN4TlFVRkJPMFZCUVVFc1VVRkJRU3hIUVVORk8wbEJRVUVzVFVGQlFTeEZRVUZSTEZWQlFWSTdTVUZEUVN4TFFVRkJMRVZCUVU4c1kwRkVVRHRKUVVWQkxFbEJRVUVzUlVGQlRTeFBRVVpPTzBsQlIwRXNTVUZCUVN4RlFVRk5MRVZCU0U0N1NVRkpRU3haUVVGQkxFVkJRV01zU1VGS1pEdEpRVXRCTEZGQlFVRXNSVUZCVlN3clJrRk1WanRKUVUxQkxGTkJRVUVzUlVGRFNUdE5RVUZCTEVsQlFVRXNSVUZEUlR0UlFVRkJMRTFCUVVFc1JVRkJVU3hSUVVGU08wOUJSRVk3VFVGRlFTeExRVUZCTEVWQlEwVTdVVUZCUVN4TlFVRkJMRVZCUVZFc1VVRkJVanRQUVVoR08wMUJTVUVzVFVGQlFTeEZRVUZSTEU5QlNsSTdUVUZMUVN4TFFVRkJMRVZCUVU4c1IwRk1VRHRMUVZCS08wbEJZVUVzVDBGQlFTeEZRVUZUTEVsQllsUTdTVUZqUVN4TFFVRkJMRVZCUVU4c1MwRmtVRHRKUVdWQkxFdEJRVUVzUlVGQlR5eExRV1pRTzBsQlowSkJMRlZCUVVFc1JVRkJXU3hEUVdoQ1dqdEpRV2xDUVN4TlFVRkJMRVZCUVZFc1MwRnFRbEk3U1VGclFrRXNVMEZCUVN4RlFVRlhMRU5CUVVNc1QwRkJSQ3hEUVd4Q1dEdEpRVzFDUVN4UlFVRkJMRVZCUTBrN1RVRkJRU3hOUVVGQkxFVkJRVkVzUlVGQlJTeERRVUZETEVsQlFWZzdUVUZEUVN4VFFVRkJMRVZCUVZjc1JVRkJSU3hEUVVGRExFbEJSR1E3VFVGRlFTeFBRVUZCTEVWQlFWTXNSVUZCUlN4RFFVRkRMRWxCUmxvN1RVRkhRU3hWUVVGQkxFVkJRVmtzUlVGQlJTeERRVUZETEVsQlNHWTdTMEZ3UWtvN1NVRjNRa0VzVDBGQlFTeEZRVUZUTEV0QmVFSlVPenRGUVRCQ1JpeEZRVUZGTEVOQlFVTXNUVUZCU0N4RFFVRlZMRkZCUVZZc1JVRkJiMElzVDBGQmNFSXNSVUZCTmtJc1NVRkJOMEk3UlVGRFFTeEhRVUZCTEVkQlFVMHNTVUZCUVN4RFFVRkxMRkZCUVV3N1UwRkZUanRCUVM5Q1V6czdRVUZwUTFnc1JVRkJSU3hEUVVGRExHRkJRV0VzUTBGQlF5eFJRVUZxUWl4RFFVRXdRaXhOUVVFeFFpeEZRVUZyUXl4UlFVRnNRenM3UVVGRFFTeE5RVUZOTEVOQlFVTXNUMEZCVUN4SFFVRnBRaUlzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaVQwb2dQU0J5WlhGMWFYSmxJQ2N1TGk5dmFpZGNjbHh1Ym05MGVTQTlJSEpsY1hWcGNtVWdKMjV2ZEhrblhISmNibHh5WEc0Z0lGeHlYRzV0WVd0bFRtOTBlU0E5SUNodmNIUnBiMjV6TENCdmQyNWxjaWtnTFQ1Y2NseHVJQ0JrWldaaGRXeDBjeUE5WEhKY2JpQWdJQ0JzWVhsdmRYUTZJQ2QwYjNCU2FXZG9kQ2RjY2x4dUlDQWdJSFJvWlcxbE9pQW5aR1ZtWVhWc2RGUm9aVzFsSjF4eVhHNGdJQ0FnZEhsd1pUb2dKMkZzWlhKMEoxeHlYRzRnSUNBZ2RHVjRkRG9nSnljZ0kyTmhiaUJpWlNCb2RHMXNJRzl5SUhOMGNtbHVaMXh5WEc0Z0lDQWdaR2x6YldsemMxRjFaWFZsT2lCMGNuVmxJQ05KWmlCNWIzVWdkMkZ1ZENCMGJ5QjFjMlVnY1hWbGRXVWdabVZoZEhWeVpTQnpaWFFnZEdocGN5QjBjblZsWEhKY2JpQWdJQ0IwWlcxd2JHRjBaVG9nSnp4a2FYWWdZMnhoYzNNOVhDSnViM1I1WDIxbGMzTmhaMlZjSWo0OGMzQmhiaUJqYkdGemN6MWNJbTV2ZEhsZmRHVjRkRndpUGp3dmMzQmhiajQ4WkdsMklHTnNZWE56UFZ3aWJtOTBlVjlqYkc5elpWd2lQand2WkdsMlBqd3ZaR2wyUGljc1hISmNiaUFnSUNCaGJtbHRZWFJwYjI0NklGeHlYRzRnSUNBZ0lDQWdJRzl3Wlc0NklGeHlYRzRnSUNBZ0lDQWdJQ0FnYUdWcFoyaDBPaUFuZEc5bloyeGxKMXh5WEc0Z0lDQWdJQ0FnSUdOc2IzTmxPaUJjY2x4dUlDQWdJQ0FnSUNBZ0lHaGxhV2RvZERvZ0ozUnZaMmRzWlNkY2NseHVJQ0FnSUNBZ0lDQmxZWE5wYm1jNklDZHpkMmx1WnlkY2NseHVJQ0FnSUNBZ0lDQnpjR1ZsWkRvZ05UQXdJQ052Y0dWdWFXNW5JQ1lnWTJ4dmMybHVaeUJoYm1sdFlYUnBiMjRnYzNCbFpXUmNjbHh1SUNBZ0lIUnBiV1Z2ZFhRNklEVXdNREFnSTJSbGJHRjVJR1p2Y2lCamJHOXphVzVuSUdWMlpXNTBMaUJUWlhRZ1ptRnNjMlVnWm05eUlITjBhV05yZVNCdWIzUnBabWxqWVhScGIyNXpYSEpjYmlBZ0lDQm1iM0pqWlRvZ1ptRnNjMlVnSTJGa1pITWdibTkwYVdacFkyRjBhVzl1SUhSdklIUm9aU0JpWldkcGJtNXBibWNnYjJZZ2NYVmxkV1VnZDJobGJpQnpaWFFnZEc4Z2RISjFaVnh5WEc0Z0lDQWdiVzlrWVd3NklHWmhiSE5sWEhKY2JpQWdJQ0J0WVhoV2FYTnBZbXhsT2lBMUlDTjViM1VnWTJGdUlITmxkQ0J0WVhnZ2RtbHphV0pzWlNCdWIzUnBabWxqWVhScGIyNGdabTl5SUdScGMyMXBjM05SZFdWMVpTQjBjblZsSUc5d2RHbHZiaXhjY2x4dUlDQWdJR3RwYkd4bGNqb2dabUZzYzJVZ0kyWnZjaUJqYkc5elpTQmhiR3dnYm05MGFXWnBZMkYwYVc5dWN5QmlaV1p2Y21VZ2MyaHZkMXh5WEc0Z0lDQWdZMnh2YzJWWGFYUm9PaUJiSjJOc2FXTnJKMTBnSUNOYkoyTnNhV05ySnl3Z0oySjFkSFJ2Ymljc0lDZG9iM1psY2lkZFhISmNiaUFnSUNCallXeHNZbUZqYXpvZ1hISmNiaUFnSUNBZ0lDQWdiMjVUYUc5M09pQlBTaTV1YjI5d0xGeHlYRzRnSUNBZ0lDQWdJR0ZtZEdWeVUyaHZkem9nVDBvdWJtOXZjRnh5WEc0Z0lDQWdJQ0FnSUc5dVEyeHZjMlU2SUU5S0xtNXZiM0JjY2x4dUlDQWdJQ0FnSUNCaFpuUmxja05zYjNObE9pQlBTaTV1YjI5d1hISmNiaUFnSUNCaWRYUjBiMjV6T2lCbVlXeHpaU0FqWVc0Z1lYSnlZWGtnYjJZZ1luVjBkRzl1YzF4eVhHNGdJQ0FnWEhKY2JpQWdUMG91WlhoMFpXNWtJR1JsWm1GMWJIUnpMQ0J2Y0hScGIyNXpMQ0IwY25WbFhISmNiaUFnY21WMElEMGdibTkwZVNCa1pXWmhkV3gwYzF4eVhHNGdJQ0FnSUNCY2NseHVJQ0J5WlhSY2NseHVJQ0FnSUZ4eVhHNVBTaTV1YjNScFptbGpZWFJwYjI1ekxuSmxaMmx6ZEdWeUlDZHViM1I1Snl3Z2JXRnJaVTV2ZEhsY2NseHViVzlrZFd4bExtVjRjRzl5ZEhNZ1BTQnRZV3RsVG05MGVTSmRmUT09IiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE9KLCBQdWJTdWIsIGV2ZW50cywgcHMsIHN1YnNjcmliZXJzLCB0b2tlbnM7XG5cbk9KID0gcmVxdWlyZSgnLi4vb2onKTtcblxuUHViU3ViID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1B1YlN1YiddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnUHViU3ViJ10gOiBudWxsKTtcblxudG9rZW5zID0ge307XG5cbnN1YnNjcmliZXJzID0gW107XG5cbmV2ZW50cyA9IHt9O1xuXG5wcyA9IHtcbiAgZ2V0RXZlbnROYW1lOiBmdW5jdGlvbihldmVudCkge1xuICAgIHJldHVybiBldmVudC50b1VwcGVyQ2FzZSgpLnJlcGxhY2UoJyAnLCAnXycpO1xuICB9LFxuICBzdWJzY3JpYmU6IGZ1bmN0aW9uKGV2ZW50LCBtZXRob2QpIHtcbiAgICB2YXIgZXZlbnROYW1lLCB0b2tlbjtcbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUoZXZlbnQpO1xuICAgIGlmICghZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIGV2ZW50c1tldmVudE5hbWVdID0gW107XG4gICAgfVxuICAgIHRva2VuID0gUHViU3ViLnN1YnNjcmliZShldmVudE5hbWUsIG1ldGhvZCk7XG4gICAgdG9rZW5zW3Rva2VuXSA9IHRva2VuO1xuICAgIHN1YnNjcmliZXJzLnB1c2gobWV0aG9kKTtcbiAgICBldmVudHNbZXZlbnROYW1lXS5wdXNoKG1ldGhvZCk7XG4gICAgcmV0dXJuIHRva2VuO1xuICB9LFxuICBwdWJsaXNoOiBmdW5jdGlvbihldmVudCwgZGF0YSkge1xuICAgIHZhciBldmVudE5hbWU7XG4gICAgZXZlbnROYW1lID0gcHMuZ2V0RXZlbnROYW1lKGV2ZW50KTtcbiAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIFB1YlN1Yi5wdWJsaXNoKGV2ZW50TmFtZSwgZGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIE9KLmNvbnNvbGUuaW5mbygnRXZlbnQgbmFtZWQgeycgKyBldmVudCArICd9IGlzIG5vdCByZWNvZ25pemVkLicpO1xuICAgIH1cbiAgfSxcbiAgdW5zdWJzY3JpYmU6IGZ1bmN0aW9uKHRva2VuT3JNZXRob2QpIHtcbiAgICBpZiAoT0ouaXMubWV0aG9kKHRva2VuT3JNZXRob2QpKSB7XG4gICAgICBpZiAoLTEgIT09IHN1YnNjcmliZXJzLmluZGV4T2YodG9rZW5Pck1ldGhvZCkpIHtcbiAgICAgICAgUHViU3ViLnVuc3Vic2NyaWJlKHRva2VuT3JNZXRob2QpO1xuICAgICAgICBzdWJzY3JpYmVycyA9IF8ucmVtb3ZlKHN1YnNjcmliZXJzLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgICByZXR1cm4gbWV0aG9kID09PSB0b2tlbk9yTWV0aG9kO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE9KLmNvbnNvbGUuaW5mbygnRXZlbnQgbWV0aG9kIGlzIG5vdCByZWNvZ25pemVkLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodG9rZW5zW3Rva2VuT3JNZXRob2RdKSB7XG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSh0b2tlbk9yTWV0aG9kKTtcbiAgICAgICAgZGVsZXRlIHRva2Vuc1t0b2tlbk9yTWV0aG9kXTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHVuc3Vic2NyaWJlQWxsOiBmdW5jdGlvbigpIHtcbiAgICBPSi5lYWNoKHRva2VucywgZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgIHJldHVybiB1bnN1YnNjcmliZSh0b2tlbik7XG4gICAgfSk7XG4gICAgc3Vic2NyaWJlcnMgPSBbXTtcbiAgICBldmVudHMgPSB7fTtcbiAgfSxcbiAgdW5zdWJzY3JpYmVFdmVudDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgZXZlbnROYW1lO1xuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZShldmVudCk7XG4gICAgaWYgKGV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICBPSi5lYWNoKGV2ZW50c1tldmVudE5hbWVdLCBmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIHVuc3Vic2NyaWJlKG1ldGhvZCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgT0ouY29uc29sZS5pbmZvKCdFdmVudCBuYW1lZCB7JyArIGV2ZW50ICsgJ30gaXMgbm90IHJlY29nbml6ZWQuJyk7XG4gICAgfVxuICAgIGRlbGV0ZSBldmVudHNbZXZlbnROYW1lXTtcbiAgfVxufTtcblxuT2JqZWN0LnNlYWwocHMpO1xuXG5PYmplY3QuZnJlZXplKHBzKTtcblxuT0oucmVnaXN0ZXIoJ2dldEV2ZW50TmFtZScsIHBzLmdldEV2ZW50TmFtZSk7XG5cbk9KLnJlZ2lzdGVyKCdwdWJsaXNoJywgcHMucHVibGlzaCk7XG5cbk9KLnJlZ2lzdGVyKCdzdWJzY3JpYmUnLCBwcy5zdWJzY3JpYmUpO1xuXG5PSi5yZWdpc3RlcigndW5zdWJzY3JpYmUnLCBwcy51bnN1YnNjcmliZSk7XG5cbk9KLnJlZ2lzdGVyKCd1bnN1YnNjcmliZUFsbCcsIHBzLnVuc3Vic2NyaWJlQWxsKTtcblxuT0oucmVnaXN0ZXIoJ3Vuc3Vic2NyaWJlRXZlbnQnLCBwcy51bnN1YnNjcmliZUV2ZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSBwcztcblxuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltUTZYRnhIYVhSb2RXSmNYRzlxWEZ4emNtTmNYR052Wm1abFpWeGNkRzl2YkhOY1hIQjFZbk4xWWk1amIyWm1aV1VpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVGQkxFbEJRVUU3TzBGQlFVRXNSVUZCUVN4SFFVRkxMRTlCUVVFc1EwRkJVU3hQUVVGU096dEJRVU5NTEUxQlFVRXNSMEZCVXl4UFFVRkJMRU5CUVZFc1YwRkJVanM3UVVGRlZDeE5RVUZCTEVkQlFWTTdPMEZCUTFRc1YwRkJRU3hIUVVGak96dEJRVU5rTEUxQlFVRXNSMEZCVXpzN1FVRkZWQ3hGUVVGQkxFZEJRMFU3UlVGQlFTeFpRVUZCTEVWQlFXTXNVMEZCUXl4TFFVRkVPMWRCUTFvc1MwRkJTeXhEUVVGRExGZEJRVTRzUTBGQlFTeERRVUZ0UWl4RFFVRkRMRTlCUVhCQ0xFTkJRVFJDTEVkQlFUVkNMRVZCUVdsRExFZEJRV3BETzBWQlJGa3NRMEZCWkR0RlFVZEJMRk5CUVVFc1JVRkJWeXhUUVVGRExFdEJRVVFzUlVGQlVTeE5RVUZTTzBGQlExUXNVVUZCUVR0SlFVRkJMRk5CUVVFc1IwRkJXU3hGUVVGRkxFTkJRVU1zV1VGQlNDeERRVUZuUWl4TFFVRm9RanRKUVVOYUxFbEJRVWNzUTBGQlNTeE5RVUZQTEVOQlFVRXNVMEZCUVN4RFFVRmtPMDFCUVRoQ0xFMUJRVThzUTBGQlFTeFRRVUZCTEVOQlFWQXNSMEZCYjBJc1IwRkJiRVE3TzBsQlJVRXNTMEZCUVN4SFFVRlJMRTFCUVUwc1EwRkJReXhUUVVGUUxFTkJRV2xDTEZOQlFXcENMRVZCUVRSQ0xFMUJRVFZDTzBsQlExSXNUVUZCVHl4RFFVRkJMRXRCUVVFc1EwRkJVQ3hIUVVGblFqdEpRVU5vUWl4WFFVRlhMRU5CUVVNc1NVRkJXaXhEUVVGcFFpeE5RVUZxUWp0SlFVTkJMRTFCUVU4c1EwRkJRU3hUUVVGQkxFTkJRVlVzUTBGQlF5eEpRVUZzUWl4RFFVRjFRaXhOUVVGMlFqdFhRVU5CTzBWQlVsTXNRMEZJV0R0RlFXRkJMRTlCUVVFc1JVRkJVeXhUUVVGRExFdEJRVVFzUlVGQlVTeEpRVUZTTzBGQlExQXNVVUZCUVR0SlFVRkJMRk5CUVVFc1IwRkJXU3hGUVVGRkxFTkJRVU1zV1VGQlNDeERRVUZuUWl4TFFVRm9RanRKUVVOYUxFbEJRVWNzVFVGQlR5eERRVUZCTEZOQlFVRXNRMEZCVmp0TlFVTkZMRTFCUVUwc1EwRkJReXhQUVVGUUxFTkJRV1VzVTBGQlppeEZRVUV3UWl4SlFVRXhRaXhGUVVSR08wdEJRVUVzVFVGQlFUdE5RVWRGTEVWQlFVVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJXQ3hEUVVGblFpeGxRVUZCTEVkQlFXdENMRXRCUVd4Q0xFZEJRVEJDTEhOQ1FVRXhReXhGUVVoR096dEZRVVpQTEVOQllsUTdSVUZ4UWtFc1YwRkJRU3hGUVVGaExGTkJRVU1zWVVGQlJEdEpRVU5ZTEVsQlFVY3NSVUZCUlN4RFFVRkRMRVZCUVVVc1EwRkJReXhOUVVGT0xFTkJRV0VzWVVGQllpeERRVUZJTzAxQlEwVXNTVUZCUnl4RFFVRkRMRU5CUVVRc1MwRkJVU3hYUVVGWExFTkJRVU1zVDBGQldpeERRVUZ2UWl4aFFVRndRaXhEUVVGWU8xRkJRMFVzVFVGQlRTeERRVUZETEZkQlFWQXNRMEZCYlVJc1lVRkJia0k3VVVGRFFTeFhRVUZCTEVkQlFXTXNRMEZCUXl4RFFVRkRMRTFCUVVZc1EwRkJVeXhYUVVGVUxFVkJRWE5DTEZOQlFVTXNUVUZCUkR0cFFrRkJXU3hOUVVGQkxFdEJRVlU3VVVGQmRFSXNRMEZCZEVJc1JVRkdhRUk3VDBGQlFTeE5RVUZCTzFGQlNVVXNSVUZCUlN4RFFVRkRMRTlCUVU4c1EwRkJReXhKUVVGWUxFTkJRV2RDTEdsRFFVRm9RaXhGUVVwR08wOUJSRVk3UzBGQlFTeE5RVUZCTzAxQlQwVXNTVUZCUnl4TlFVRlBMRU5CUVVFc1lVRkJRU3hEUVVGV08xRkJRMFVzVFVGQlRTeERRVUZETEZkQlFWQXNRMEZCYlVJc1lVRkJia0k3VVVGRFFTeFBRVUZQTEUxQlFVOHNRMEZCUVN4aFFVRkJMRVZCUm1oQ08wOUJVRVk3TzBWQlJGY3NRMEZ5UW1JN1JVRnJRMEVzWTBGQlFTeEZRVUZuUWl4VFFVRkJPMGxCUTJRc1JVRkJSU3hEUVVGRExFbEJRVWdzUTBGQlVTeE5RVUZTTEVWQlFXZENMRk5CUVVNc1MwRkJSRHRoUVVGWExGZEJRVUVzUTBGQldTeExRVUZhTzBsQlFWZ3NRMEZCYUVJN1NVRkRRU3hYUVVGQkxFZEJRV003U1VGRFpDeE5RVUZCTEVkQlFWTTdSVUZJU3l4RFFXeERhRUk3UlVGM1EwRXNaMEpCUVVFc1JVRkJhMElzVTBGQlF5eExRVUZFTzBGQlEyaENMRkZCUVVFN1NVRkJRU3hUUVVGQkxFZEJRVmtzUlVGQlJTeERRVUZETEZsQlFVZ3NRMEZCWjBJc1MwRkJhRUk3U1VGRFdpeEpRVUZITEUxQlFVOHNRMEZCUVN4VFFVRkJMRU5CUVZZN1RVRkRSU3hGUVVGRkxFTkJRVU1zU1VGQlNDeERRVUZSTEUxQlFVOHNRMEZCUVN4VFFVRkJMRU5CUVdZc1JVRkJNa0lzVTBGQlF5eE5RVUZFTzJWQlFWa3NWMEZCUVN4RFFVRlpMRTFCUVZvN1RVRkJXaXhEUVVFelFpeEZRVVJHTzB0QlFVRXNUVUZCUVR0TlFVZEZMRVZCUVVVc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQldDeERRVUZuUWl4bFFVRkJMRWRCUVd0Q0xFdEJRV3hDTEVkQlFUQkNMSE5DUVVFeFF5eEZRVWhHT3p0SlFVbEJMRTlCUVU4c1RVRkJUeXhEUVVGQkxGTkJRVUU3UlVGT1JTeERRWGhEYkVJN096dEJRV2xFUml4TlFVRk5MRU5CUVVNc1NVRkJVQ3hEUVVGWkxFVkJRVm83TzBGQlEwRXNUVUZCVFN4RFFVRkRMRTFCUVZBc1EwRkJZeXhGUVVGa096dEJRVVZCTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1kwRkJXaXhGUVVFMFFpeEZRVUZGTEVOQlFVTXNXVUZCTDBJN08wRkJRMEVzUlVGQlJTeERRVUZETEZGQlFVZ3NRMEZCV1N4VFFVRmFMRVZCUVhWQ0xFVkJRVVVzUTBGQlF5eFBRVUV4UWpzN1FVRkRRU3hGUVVGRkxFTkJRVU1zVVVGQlNDeERRVUZaTEZkQlFWb3NSVUZCZVVJc1JVRkJSU3hEUVVGRExGTkJRVFZDT3p0QlFVTkJMRVZCUVVVc1EwRkJReXhSUVVGSUxFTkJRVmtzWVVGQldpeEZRVUV5UWl4RlFVRkZMRU5CUVVNc1YwRkJPVUk3TzBGQlEwRXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3huUWtGQldpeEZRVUU0UWl4RlFVRkZMRU5CUVVNc1kwRkJha003TzBGQlEwRXNSVUZCUlN4RFFVRkRMRkZCUVVnc1EwRkJXU3hyUWtGQldpeEZRVUZuUXl4RlFVRkZMRU5CUVVNc1owSkJRVzVET3p0QlFVVkJMRTFCUVUwc1EwRkJReXhQUVVGUUxFZEJRV2xDSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SlBTaUE5SUhKbGNYVnBjbVVnSnk0dUwyOXFKMXh1VUhWaVUzVmlJRDBnY21WeGRXbHlaU0FuY0hWaWMzVmlMV3B6SjF4dVhHNTBiMnRsYm5NZ1BTQjdmVnh1YzNWaWMyTnlhV0psY25NZ1BTQmJYVnh1WlhabGJuUnpJRDBnZTMxY2JseHVjSE1nUFNCY2JpQWdaMlYwUlhabGJuUk9ZVzFsT2lBb1pYWmxiblFwSUMwK1hHNGdJQ0FnWlhabGJuUXVkRzlWY0hCbGNrTmhjMlVvS1M1eVpYQnNZV05sSUNjZ0p5d2dKMThuWEc1Y2JpQWdjM1ZpYzJOeWFXSmxPaUFvWlhabGJuUXNJRzFsZEdodlpDa2dMVDVjYmlBZ0lDQmxkbVZ1ZEU1aGJXVWdQU0J3Y3k1blpYUkZkbVZ1ZEU1aGJXVWdaWFpsYm5SY2JpQWdJQ0JwWmlCdWIzUWdaWFpsYm5SelcyVjJaVzUwVG1GdFpWMGdkR2hsYmlCbGRtVnVkSE5iWlhabGJuUk9ZVzFsWFNBOUlGdGRYRzVjYmlBZ0lDQjBiMnRsYmlBOUlGQjFZbE4xWWk1emRXSnpZM0pwWW1VZ1pYWmxiblJPWVcxbExDQnRaWFJvYjJSY2JpQWdJQ0IwYjJ0bGJuTmJkRzlyWlc1ZElEMGdkRzlyWlc1Y2JpQWdJQ0J6ZFdKelkzSnBZbVZ5Y3k1d2RYTm9JRzFsZEdodlpGeHVJQ0FnSUdWMlpXNTBjMXRsZG1WdWRFNWhiV1ZkTG5CMWMyZ2diV1YwYUc5a1hHNGdJQ0FnZEc5clpXNWNibHh1SUNCd2RXSnNhWE5vT2lBb1pYWmxiblFzSUdSaGRHRXBJQzArWEc0Z0lDQWdaWFpsYm5ST1lXMWxJRDBnY0hNdVoyVjBSWFpsYm5ST1lXMWxJR1YyWlc1MFhHNGdJQ0FnYVdZZ1pYWmxiblJ6VzJWMlpXNTBUbUZ0WlYxY2JpQWdJQ0FnSUZCMVlsTjFZaTV3ZFdKc2FYTm9JR1YyWlc1MFRtRnRaU3dnWkdGMFlWeHVJQ0FnSUdWc2MyVmNiaUFnSUNBZ0lFOUtMbU52Ym5OdmJHVXVhVzVtYnlBblJYWmxiblFnYm1GdFpXUWdleWNnS3lCbGRtVnVkQ0FySUNkOUlHbHpJRzV2ZENCeVpXTnZaMjVwZW1Wa0xpZGNiaUFnSUNCeVpYUjFjbTVjYmx4dUlDQjFibk4xWW5OamNtbGlaVG9nS0hSdmEyVnVUM0pOWlhSb2IyUXBJQzArWEc0Z0lDQWdhV1lnVDBvdWFYTXViV1YwYUc5a0lIUnZhMlZ1VDNKTlpYUm9iMlJjYmlBZ0lDQWdJR2xtSUMweElHbHpiblFnYzNWaWMyTnlhV0psY25NdWFXNWtaWGhQWmlCMGIydGxiazl5VFdWMGFHOWtYRzRnSUNBZ0lDQWdJRkIxWWxOMVlpNTFibk4xWW5OamNtbGlaU0IwYjJ0bGJrOXlUV1YwYUc5a1hHNGdJQ0FnSUNBZ0lITjFZbk5qY21saVpYSnpJRDBnWHk1eVpXMXZkbVVnYzNWaWMyTnlhV0psY25Nc0lDaHRaWFJvYjJRcElDMCtJRzFsZEdodlpDQnBjeUIwYjJ0bGJrOXlUV1YwYUc5a1hHNGdJQ0FnSUNCbGJITmxYRzRnSUNBZ0lDQWdJRTlLTG1OdmJuTnZiR1V1YVc1bWJ5QW5SWFpsYm5RZ2JXVjBhRzlrSUdseklHNXZkQ0J5WldOdloyNXBlbVZrTGlkY2JpQWdJQ0JsYkhObFhHNGdJQ0FnSUNCcFppQjBiMnRsYm5OYmRHOXJaVzVQY2sxbGRHaHZaRjFjYmlBZ0lDQWdJQ0FnVUhWaVUzVmlMblZ1YzNWaWMyTnlhV0psSUhSdmEyVnVUM0pOWlhSb2IyUmNiaUFnSUNBZ0lDQWdaR1ZzWlhSbElIUnZhMlZ1YzF0MGIydGxiazl5VFdWMGFHOWtYVnh1SUNBZ0lISmxkSFZ5Ymx4dVhHNGdJSFZ1YzNWaWMyTnlhV0psUVd4c09pQW9LU0F0UGx4dUlDQWdJRTlLTG1WaFkyZ2dkRzlyWlc1ekxDQW9kRzlyWlc0cElDMCtJSFZ1YzNWaWMyTnlhV0psSUhSdmEyVnVYRzRnSUNBZ2MzVmljMk55YVdKbGNuTWdQU0JiWFZ4dUlDQWdJR1YyWlc1MGN5QTlJSHQ5WEc0Z0lDQWdjbVYwZFhKdVhHNWNiaUFnZFc1emRXSnpZM0pwWW1WRmRtVnVkRG9nS0dWMlpXNTBLU0F0UGx4dUlDQWdJR1YyWlc1MFRtRnRaU0E5SUhCekxtZGxkRVYyWlc1MFRtRnRaU0JsZG1WdWRGeHVJQ0FnSUdsbUlHVjJaVzUwYzF0bGRtVnVkRTVoYldWZFhHNGdJQ0FnSUNCUFNpNWxZV05vSUdWMlpXNTBjMXRsZG1WdWRFNWhiV1ZkTENBb2JXVjBhRzlrS1NBdFBpQjFibk4xWW5OamNtbGlaU0J0WlhSb2IyUmNiaUFnSUNCbGJITmxYRzRnSUNBZ0lDQlBTaTVqYjI1emIyeGxMbWx1Wm04Z0owVjJaVzUwSUc1aGJXVmtJSHNuSUNzZ1pYWmxiblFnS3lBbmZTQnBjeUJ1YjNRZ2NtVmpiMmR1YVhwbFpDNG5YRzRnSUNBZ1pHVnNaWFJsSUdWMlpXNTBjMXRsZG1WdWRFNWhiV1ZkWEc0Z0lDQWdjbVYwZFhKdVhHNWNiazlpYW1WamRDNXpaV0ZzSUhCelhHNVBZbXBsWTNRdVpuSmxaWHBsSUhCelhHNWNiazlLTG5KbFoybHpkR1Z5SUNkblpYUkZkbVZ1ZEU1aGJXVW5MQ0J3Y3k1blpYUkZkbVZ1ZEU1aGJXVmNiazlLTG5KbFoybHpkR1Z5SUNkd2RXSnNhWE5vSnl3Z2NITXVjSFZpYkdsemFGeHVUMG91Y21WbmFYTjBaWElnSjNOMVluTmpjbWxpWlNjc0lIQnpMbk4xWW5OamNtbGlaVnh1VDBvdWNtVm5hWE4wWlhJZ0ozVnVjM1ZpYzJOeWFXSmxKeXdnY0hNdWRXNXpkV0p6WTNKcFltVmNiazlLTG5KbFoybHpkR1Z5SUNkMWJuTjFZbk5qY21saVpVRnNiQ2NzSUhCekxuVnVjM1ZpYzJOeWFXSmxRV3hzWEc1UFNpNXlaV2RwYzNSbGNpQW5kVzV6ZFdKelkzSnBZbVZGZG1WdWRDY3NJSEJ6TG5WdWMzVmljMk55YVdKbFJYWmxiblJjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCd2N5SmRmUT09IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuIyMjXHJcbmh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTAxMTE1L2hvdy1jYW4taS1nZXQtcXVlcnktc3RyaW5nLXZhbHVlcy1pbi1qYXZhc2NyaXB0XHJcbiMjI1xyXG5xdWVyeVN0cmluZyA9IChwYXJhbSkgLT5cclxuICByZXQgPSB7fVxyXG4gICAgXHJcbiAgaWYgT0ouZ2xvYmFsLmxvY2F0aW9uXHJcbiAgICBwYXJhbXMgPSAgT0ouZ2xvYmFsLmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkuc3BsaXQgJyYnXHJcbiAgICBpZiBwYXJhbXNcclxuICAgICAgaSA9IDBcclxuICAgICAgd2hpbGUgaSA8IHBhcmFtcy5sZW5ndGhcclxuICAgICAgICBwcm0gPSBwYXJhbXNbaV0uc3BsaXQgJz0nXHJcbiAgICAgICAgaWYgcHJtLmxlbmd0aCBpcyAyIFxyXG4gICAgICAgICAgcmV0W3BybVswXV0gPSBPSi5nbG9iYWwuZGVjb2RlVVJJQ29tcG9uZW50IHBybVsxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpXHJcbiAgICAgICAgaSArPSAxXHJcbiAgcmV0XHJcbiAgICBcclxuT0oucmVnaXN0ZXIgJ3F1ZXJ5U3RyaW5nJyxxdWVyeVN0cmluZ1xyXG5tb2R1bGUuZXhwb3J0cyA9IHF1ZXJ5U3RyaW5nIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE9KLCBfLCBlYWNoLCBvYmosIHJuZyxcbiAgc2xpY2UgPSBbXS5zbGljZTtcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5vYmogPSByZXF1aXJlKCcuLi9jb3JlL29iamVjdCcpO1xuXG5lYWNoID0gcmVxdWlyZSgnLi9lYWNoJyk7XG5cbnJuZyA9IHtcbiAgcmFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJhbXM7XG4gICAgcGFyYW1zID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgcmV0dXJuIF8ucmFuZ2UuYXBwbHkoXywgcGFyYW1zKTtcbiAgfSxcbiAgcmFuZ2VNaW46IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXJhbXM7XG4gICAgcGFyYW1zID0gMSA8PSBhcmd1bWVudHMubGVuZ3RoID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDApIDogW107XG4gICAgcmV0dXJuIF8ubWluLmFwcGx5KF8sIHBhcmFtcyk7XG4gIH0sXG4gIHJhbmdlTWF4OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGFyYW1zO1xuICAgIHBhcmFtcyA9IDEgPD0gYXJndW1lbnRzLmxlbmd0aCA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSA6IFtdO1xuICAgIHJldHVybiBfLm1heC5hcHBseShfLCBwYXJhbXMpO1xuICB9LFxuXG4gIC8qXG4gIFRha2UgYW4gYXJyYXkgb2Ygc3RyaW5nIHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXG4gIFVzZXMgdGhlIGZpcnN0IGxldHRlciBvZiBlYWNoIHN0cmluZyB2YWx1ZSBpbiB0aGUgYXJyYXkgdG8gY29udmVydCB0byB1bmlxdWUgY29kZSBjaGFyYWN0ZXIgKGxvd2VyIGNhc2UpXG4gIEJ1aWxkcyBhIGludCByYW5nZSBiYXNlZCBvbiB1bmlxdWUgY29kZSBjaGFycy5cbiAgICovXG4gIHN0cmluZ1RvU3ViUmFuZ2VzOiBmdW5jdGlvbihuLCByYW5nZSkge1xuICAgIHZhciBjaGFyUmFuZ2UsIGksIG9sZEdldFJhbmdlLCByZXQsIHN1YlJhbmdlO1xuICAgIGlmIChuID09IG51bGwpIHtcbiAgICAgIG4gPSA2O1xuICAgIH1cbiAgICBpZiAocmFuZ2UgPT0gbnVsbCkge1xuICAgICAgcmFuZ2UgPSBbXTtcbiAgICB9XG4gICAgY2hhclJhbmdlID0gW107XG4gICAgZWFjaChyYW5nZSwgZnVuY3Rpb24odmFsKSB7XG4gICAgICB2YXIgY2hhcjtcbiAgICAgIGNoYXIgPSB2YWwudHJpbSgpWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICBpZiAoZmFsc2UgPT09IG9iai5jb250YWlucyhjaGFyUmFuZ2UsIGNoYXIpKSB7XG4gICAgICAgIHJldHVybiBjaGFyUmFuZ2UucHVzaChjaGFyLmNoYXJDb2RlQXQoKSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0ID0gcm5nLnRvU3ViUmFuZ2VzKG4sIGNoYXJSYW5nZSk7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBuKSB7XG4gICAgICBpICs9IDE7XG4gICAgICBzdWJSYW5nZSA9IHJldFtpXTtcbiAgICAgIHN1YlJhbmdlLm1hcChTdHJpbmcuZnJvbUNoYXJDb2RlKTtcbiAgICB9XG4gICAgb2xkR2V0UmFuZ2UgPSByZXQuZ2V0UmFuZ2U7XG4gICAgcmV0LmdldFJhbmdlID0gZnVuY3Rpb24odmFsKSB7XG4gICAgICB2YXIgY2hhciwgaWR4O1xuICAgICAgY2hhciA9IHZhbC50cmltKClbMF0udG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KCk7XG4gICAgICBpZHggPSBvbGRHZXRSYW5nZShjaGFyKTtcbiAgICAgIHJldHVybiBpZHg7XG4gICAgfTtcbiAgICByZXR1cm4gcmV0O1xuICB9LFxuXG4gIC8qXG4gIFRha2UgYW4gYXJyYXkgb2YgaW50IHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXG4gIERpdmlkZXMgdGhlIG9yaWdpbmFsIGFycmF5IGludG8gdGhlIHNwZWNpZmllZCBudW1iZXIgb2Ygc3ViIGFycmF5cy5cbiAgT3ZlcmZsb3cgaXMgcGFzc2VkIHRvIHRoZSBmaW5hbCBwYXJ0aXRpb24uXG4gICAqL1xuICB0b1N1YlJhbmdlczogZnVuY3Rpb24obiwgcmFuZ2UpIHtcbiAgICB2YXIgY2h1bmtWYWwsIGRpc3RhbmNlLCBpLCBqdW1wLCBtYXAsIHJhbmdlSGlnaCwgcmFuZ2VMb3csIHJldCwgc3ViUmFuZ2UsIHN1YlJhbmdlU2l6ZSwgc3ViUmFuZ2VzO1xuICAgIGlmIChuID09IG51bGwpIHtcbiAgICAgIG4gPSA2O1xuICAgIH1cbiAgICBpZiAocmFuZ2UgPT0gbnVsbCkge1xuICAgICAgcmFuZ2UgPSBbXTtcbiAgICB9XG4gICAgcmV0ID0gb2JqLm9iamVjdCgpO1xuICAgIHJhbmdlTG93ID0gcm5nLnJhbmdlTWluKHJhbmdlKTtcbiAgICByYW5nZUhpZ2ggPSBybmcucmFuZ2VNYXgocmFuZ2UpO1xuICAgIGRpc3RhbmNlID0gcmFuZ2VIaWdoIC0gcmFuZ2VMb3c7XG4gICAgc3ViUmFuZ2VTaXplID0gZGlzdGFuY2UgLyBuO1xuICAgIHN1YlJhbmdlcyA9IHJldC5hZGQoJ3JhbmdlcycsIG9iai5vYmplY3QoKSk7XG4gICAgY2h1bmtWYWwgPSByYW5nZUxvdztcbiAgICBtYXAgPSBvYmoub2JqZWN0KCk7XG4gICAgaSA9IDA7XG4gICAgd2hpbGUgKGkgPCBuKSB7XG4gICAgICBpICs9IDE7XG4gICAgICBpZiAoaSA8IG4pIHtcbiAgICAgICAganVtcCA9IE1hdGgucm91bmQoc3ViUmFuZ2VTaXplKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGp1bXAgPSBNYXRoLmZsb29yKHN1YlJhbmdlU2l6ZSk7XG4gICAgICAgIGlmIChjaHVua1ZhbCArIGp1bXAgPD0gcmFuZ2VIaWdoKSB7XG4gICAgICAgICAganVtcCArPSByYW5nZUhpZ2ggLSBjaHVua1ZhbCAtIGp1bXAgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdWJSYW5nZSA9IHJuZy5yYW5nZShjaHVua1ZhbCwgY2h1bmtWYWwgKyBqdW1wKTtcbiAgICAgIGVhY2goc3ViUmFuZ2UsIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICByZXR1cm4gbWFwLmFkZCh2YWwsIGkpO1xuICAgICAgfSk7XG4gICAgICBzdWJSYW5nZXNbaV0gPSBzdWJSYW5nZTtcbiAgICAgIGNodW5rVmFsICs9IGp1bXA7XG4gICAgfVxuICAgIHJldC5hZGQoJ2dldFJhbmdlJywgZnVuY3Rpb24odmFsKSB7XG4gICAgICByZXR1cm4gbWFwW3ZhbF07XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxufTtcblxuT2JqZWN0LnNlYWwocm5nKTtcblxuT2JqZWN0LmZyZWV6ZShybmcpO1xuXG5PSi5yZWdpc3RlcigncmFuZ2VzJywgcm5nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBybmc7XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVE2WEZ4SGFYUm9kV0pjWEc5cVhGeHpjbU5jWEdOdlptWmxaVnhjZEc5dmJITmNYSEpoYm1kbGN5NWpiMlptWldVaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWp0QlFVRkJMRWxCUVVFc2NVSkJRVUU3UlVGQlFUczdRVUZCUVN4RlFVRkJMRWRCUVVzc1QwRkJRU3hEUVVGUkxFOUJRVkk3TzBGQlEwd3NRMEZCUVN4SFFVRkpMRTlCUVVFc1EwRkJVU3hSUVVGU096dEJRVU5LTEVkQlFVRXNSMEZCVFN4UFFVRkJMRU5CUVZFc1owSkJRVkk3TzBGQlEwNHNTVUZCUVN4SFFVRlBMRTlCUVVFc1EwRkJVU3hSUVVGU096dEJRVWxRTEVkQlFVRXNSMEZKUlR0RlFVRkJMRXRCUVVFc1JVRkJUeXhUUVVGQk8wRkJRMHdzVVVGQlFUdEpRVVJOTzFkQlEwNHNRMEZCUXl4RFFVRkRMRXRCUVVZc1ZVRkJVU3hOUVVGU08wVkJSRXNzUTBGQlVEdEZRVXRCTEZGQlFVRXNSVUZCVlN4VFFVRkJPMEZCUTFJc1VVRkJRVHRKUVVSVE8xZEJRMVFzUTBGQlF5eERRVUZETEVkQlFVWXNWVUZCVFN4TlFVRk9PMFZCUkZFc1EwRk1WanRGUVZWQkxGRkJRVUVzUlVGQlZTeFRRVUZCTzBGQlExSXNVVUZCUVR0SlFVUlRPMWRCUTFRc1EwRkJReXhEUVVGRExFZEJRVVlzVlVGQlRTeE5RVUZPTzBWQlJGRXNRMEZXVmpzN1FVRmpRVHM3T3pzN1JVRkxRU3hwUWtGQlFTeEZRVUZ0UWl4VFFVRkRMRU5CUVVRc1JVRkJVU3hMUVVGU08wRkJRMnBDTEZGQlFVRTdPMDFCUkd0Q0xFbEJRVWs3T3p0TlFVRkhMRkZCUVZFN08wbEJRMnBETEZOQlFVRXNSMEZCV1R0SlFVZGFMRWxCUVVFc1EwRkJTeXhMUVVGTUxFVkJRVmtzVTBGQlF5eEhRVUZFTzBGQlExWXNWVUZCUVR0TlFVRkJMRWxCUVVFc1IwRkJUeXhIUVVGSExFTkJRVU1zU1VGQlNpeERRVUZCTEVOQlFWY3NRMEZCUVN4RFFVRkJMRU5CUVVVc1EwRkJReXhYUVVGa0xFTkJRVUU3VFVGRFVDeEpRVUZITEV0QlFVRXNTMEZCVXl4SFFVRkhMRU5CUVVNc1VVRkJTaXhEUVVGaExGTkJRV0lzUlVGQmQwSXNTVUZCZUVJc1EwRkJXanRsUVVORkxGTkJRVk1zUTBGQlF5eEpRVUZXTEVOQlFXVXNTVUZCU1N4RFFVRkRMRlZCUVV3c1EwRkJRU3hEUVVGbUxFVkJSRVk3TzBsQlJsVXNRMEZCV2p0SlFVdEJMRWRCUVVFc1IwRkJUU3hIUVVGSExFTkJRVU1zVjBGQlNpeERRVUZuUWl4RFFVRm9RaXhGUVVGdFFpeFRRVUZ1UWp0SlFVVk9MRU5CUVVFc1IwRkJTVHRCUVVOS0xGZEJRVTBzUTBGQlFTeEhRVUZKTEVOQlFWWTdUVUZEUlN4RFFVRkJMRWxCUVVzN1RVRkRUQ3hSUVVGQkxFZEJRVmNzUjBGQlNTeERRVUZCTEVOQlFVRTdUVUZEWml4UlFVRlJMRU5CUVVNc1IwRkJWQ3hEUVVGaExFMUJRVTBzUTBGQlF5eFpRVUZ3UWp0SlFVaEdPMGxCUzBFc1YwRkJRU3hIUVVGakxFZEJRVWNzUTBGQlF6dEpRVU5zUWl4SFFVRkhMRU5CUVVNc1VVRkJTaXhIUVVGbExGTkJRVU1zUjBGQlJEdEJRVU5pTEZWQlFVRTdUVUZCUVN4SlFVRkJMRWRCUVU4c1IwRkJSeXhEUVVGRExFbEJRVW9zUTBGQlFTeERRVUZYTEVOQlFVRXNRMEZCUVN4RFFVRkZMRU5CUVVNc1YwRkJaQ3hEUVVGQkxFTkJRVEpDTEVOQlFVTXNWVUZCTlVJc1EwRkJRVHROUVVOUUxFZEJRVUVzUjBGQlRTeFhRVUZCTEVOQlFWa3NTVUZCV2p0aFFVTk9PMGxCU0dFN1YwRkpaanRGUVhSQ2FVSXNRMEZ1UW01Q096dEJRVFJEUVRzN096czdSVUZMUVN4WFFVRkJMRVZCUVdFc1UwRkJReXhEUVVGRUxFVkJRVkVzUzBGQlVqdEJRVU5ZTEZGQlFVRTdPMDFCUkZrc1NVRkJTVHM3TzAxQlFVY3NVVUZCVVRzN1NVRkRNMElzUjBGQlFTeEhRVUZOTEVkQlFVY3NRMEZCUXl4TlFVRktMRU5CUVVFN1NVRkRUaXhSUVVGQkxFZEJRVmNzUjBGQlJ5eERRVUZETEZGQlFVb3NRMEZCWVN4TFFVRmlPMGxCUTFnc1UwRkJRU3hIUVVGWkxFZEJRVWNzUTBGQlF5eFJRVUZLTEVOQlFXRXNTMEZCWWp0SlFVVmFMRkZCUVVFc1IwRkJWeXhUUVVGQkxFZEJRVms3U1VGRGRrSXNXVUZCUVN4SFFVRmxMRkZCUVVFc1IwRkJVenRKUVVONFFpeFRRVUZCTEVkQlFWa3NSMEZCUnl4RFFVRkRMRWRCUVVvc1EwRkJVU3hSUVVGU0xFVkJRV3RDTEVkQlFVY3NRMEZCUXl4TlFVRktMRU5CUVVFc1EwRkJiRUk3U1VGRFdpeFJRVUZCTEVkQlFWYzdTVUZGV0N4SFFVRkJMRWRCUVUwc1IwRkJSeXhEUVVGRExFMUJRVW9zUTBGQlFUdEpRVVZPTEVOQlFVRXNSMEZCU1R0QlFVTktMRmRCUVUwc1EwRkJRU3hIUVVGSkxFTkJRVlk3VFVGRFJTeERRVUZCTEVsQlFVczdUVUZEVEN4SlFVRkhMRU5CUVVFc1IwRkJTU3hEUVVGUU8xRkJRV01zU1VGQlFTeEhRVUZQTEVsQlFVa3NRMEZCUXl4TFFVRk1MRU5CUVZjc1dVRkJXQ3hGUVVGeVFqdFBRVUZCTEUxQlFVRTdVVUZGUlN4SlFVRkJMRWRCUVU4c1NVRkJTU3hEUVVGRExFdEJRVXdzUTBGQlZ5eFpRVUZZTzFGQlExQXNTVUZCUnl4UlFVRkJMRWRCUVZjc1NVRkJXQ3hKUVVGdFFpeFRRVUYwUWp0VlFVTkZMRWxCUVVFc1NVRkJVU3hUUVVGQkxFZEJRVmtzVVVGQldpeEhRVUYxUWl4SlFVRjJRaXhIUVVFNFFpeEZRVVI0UXp0VFFVaEdPenROUVUxQkxGRkJRVUVzUjBGQlZ5eEhRVUZITEVOQlFVTXNTMEZCU2l4RFFVRlZMRkZCUVZZc1JVRkJiMElzVVVGQlFTeEhRVUZYTEVsQlFTOUNPMDFCUTFnc1NVRkJRU3hEUVVGTExGRkJRVXdzUlVGQlpTeFRRVUZETEVkQlFVUTdaVUZCVXl4SFFVRkhMRU5CUVVNc1IwRkJTaXhEUVVGUkxFZEJRVklzUlVGQllTeERRVUZpTzAxQlFWUXNRMEZCWmp0TlFVTkJMRk5CUVZVc1EwRkJRU3hEUVVGQkxFTkJRVllzUjBGQlpUdE5RVU5tTEZGQlFVRXNTVUZCV1R0SlFWaGtPMGxCWVVFc1IwRkJSeXhEUVVGRExFZEJRVW9zUTBGQlVTeFZRVUZTTEVWQlFXOUNMRk5CUVVNc1IwRkJSRHRoUVVOc1FpeEhRVUZKTEVOQlFVRXNSMEZCUVR0SlFVUmpMRU5CUVhCQ08xZEJSMEU3UlVFM1FsY3NRMEZxUkdJN096dEJRV2RHUml4TlFVRk5MRU5CUVVNc1NVRkJVQ3hEUVVGWkxFZEJRVm83TzBGQlEwRXNUVUZCVFN4RFFVRkRMRTFCUVZBc1EwRkJZeXhIUVVGa096dEJRVVZCTEVWQlFVVXNRMEZCUXl4UlFVRklMRU5CUVZrc1VVRkJXaXhGUVVGelFpeEhRVUYwUWpzN1FVRkRRU3hOUVVGTkxFTkJRVU1zVDBGQlVDeEhRVUZwUWlJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lUMG9nUFNCeVpYRjFhWEpsSUNjdUxpOXZhaWRjY2x4dVh5QTlJSEpsY1hWcGNtVWdKMnh2WkdGemFDZGNjbHh1YjJKcUlEMGdjbVZ4ZFdseVpTQW5MaTR2WTI5eVpTOXZZbXBsWTNRblhISmNibVZoWTJnZ1BTQnlaWEYxYVhKbElDY3VMMlZoWTJnblhISmNibHh5WEc0aklDTWdjbUZ1WjJWelhISmNibHh5WEc1eWJtY2dQVnh5WEc1Y2NseHVJQ0FqSUNNaklISmhibWRsWEhKY2JpQWdJeUJWYzJsdVp5QmJURzh0UkdGemFGMG9hSFIwY0RvdkwyeHZaR0Z6YUM1amIyMHZaRzlqY3lOeVlXNW5aU2tuY3lCZ2NtRnVaMlZnSUcxbGRHaHZaRnh5WEc0Z0lISmhibWRsT2lBb2NHRnlZVzF6TGk0dUtTQXRQbHh5WEc0Z0lDQWdYeTV5WVc1blpTQndZWEpoYlhNdUxpNWNjbHh1WEhKY2JpQWdJeUFqSXlCeVlXNW5aVTFwYmx4eVhHNGdJQ01nVlhOcGJtY2dXMHh2TFVSaGMyaGRLR2gwZEhBNkx5OXNiMlJoYzJndVkyOXRMMlJ2WTNNamJXbHVLU2R6SUdCdGFXNWdJRzFsZEdodlpGeHlYRzRnSUhKaGJtZGxUV2x1T2lBb2NHRnlZVzF6TGk0dUtTQXRQbHh5WEc0Z0lDQWdYeTV0YVc0Z2NHRnlZVzF6TGk0dVhISmNibHh5WEc0Z0lDTWdJeU1nY21GdVoyVk5ZWGhjY2x4dUlDQWpJRlZ6YVc1bklGdE1ieTFFWVhOb1hTaG9kSFJ3T2k4dmJHOWtZWE5vTG1OdmJTOWtiMk56STIxaGVDa25jeUJnYldGNFlDQnRaWFJvYjJSY2NseHVJQ0J5WVc1blpVMWhlRG9nS0hCaGNtRnRjeTR1TGlrZ0xUNWNjbHh1SUNBZ0lGOHViV0Y0SUhCaGNtRnRjeTR1TGx4eVhHNWNjbHh1SUNBaklDTWpJSE4wY21sdVoxSmhibWRsVkc5VGRXSlNZVzVuWlhOY2NseHVJQ0FqSXlOY2NseHVJQ0JVWVd0bElHRnVJR0Z5Y21GNUlHOW1JSE4wY21sdVp5QjJZV3gxWlhNZ1lXNWtJR0VnYm5WdFltVnlJRzltSUhCaGNuUnBkR2x2Ym5NZ2RHOGdZM0psWVhSbExseHlYRzRnSUZWelpYTWdkR2hsSUdacGNuTjBJR3hsZEhSbGNpQnZaaUJsWVdOb0lITjBjbWx1WnlCMllXeDFaU0JwYmlCMGFHVWdZWEp5WVhrZ2RHOGdZMjl1ZG1WeWRDQjBieUIxYm1seGRXVWdZMjlrWlNCamFHRnlZV04wWlhJZ0tHeHZkMlZ5SUdOaGMyVXBYSEpjYmlBZ1FuVnBiR1J6SUdFZ2FXNTBJSEpoYm1kbElHSmhjMlZrSUc5dUlIVnVhWEYxWlNCamIyUmxJR05vWVhKekxseHlYRzRnSUNNakkxeHlYRzRnSUhOMGNtbHVaMVJ2VTNWaVVtRnVaMlZ6T2lBb2JpQTlJRFlzSUhKaGJtZGxJRDBnVzEwcElDMCtYSEpjYmlBZ0lDQmphR0Z5VW1GdVoyVWdQU0JiWFZ4eVhHNWNjbHh1WEhKY2JpQWdJQ0JsWVdOb0lISmhibWRsTENBb2RtRnNLU0F0UGx4eVhHNGdJQ0FnSUNCamFHRnlJRDBnZG1Gc0xuUnlhVzBvS1Zzd1hTNTBiMHh2ZDJWeVEyRnpaU2dwWEhKY2JpQWdJQ0FnSUdsbUlHWmhiSE5sSUdseklHOWlhaTVqYjI1MFlXbHVjeUJqYUdGeVVtRnVaMlVzSUdOb1lYSmNjbHh1SUNBZ0lDQWdJQ0JqYUdGeVVtRnVaMlV1Y0hWemFDQmphR0Z5TG1Ob1lYSkRiMlJsUVhRb0tWeHlYRzVjY2x4dUlDQWdJSEpsZENBOUlISnVaeTUwYjFOMVlsSmhibWRsY3lCdUxDQmphR0Z5VW1GdVoyVmNjbHh1WEhKY2JpQWdJQ0JwSUQwZ01GeHlYRzRnSUNBZ2QyaHBiR1VnYVNBOElHNWNjbHh1SUNBZ0lDQWdhU0FyUFNBeFhISmNiaUFnSUNBZ0lITjFZbEpoYm1kbElEMGdjbVYwVzJsZFhISmNiaUFnSUNBZ0lITjFZbEpoYm1kbExtMWhjQ0JUZEhKcGJtY3Vabkp2YlVOb1lYSkRiMlJsWEhKY2JseHlYRzRnSUNBZ2IyeGtSMlYwVW1GdVoyVWdQU0J5WlhRdVoyVjBVbUZ1WjJWY2NseHVJQ0FnSUhKbGRDNW5aWFJTWVc1blpTQTlJQ2gyWVd3cElDMCtYSEpjYmlBZ0lDQWdJR05vWVhJZ1BTQjJZV3d1ZEhKcGJTZ3BXekJkTG5SdlRHOTNaWEpEWVhObEtDa3VZMmhoY2tOdlpHVkJkQ2dwWEhKY2JpQWdJQ0FnSUdsa2VDQTlJRzlzWkVkbGRGSmhibWRsSUdOb1lYSmNjbHh1SUNBZ0lDQWdhV1I0WEhKY2JpQWdJQ0J5WlhSY2NseHVYSEpjYmlBZ0l5QWpJeUJ5WVc1blpWUnZVM1ZpVW1GdVoyVnpYSEpjYmlBZ0l5TWpYSEpjYmlBZ1ZHRnJaU0JoYmlCaGNuSmhlU0J2WmlCcGJuUWdkbUZzZFdWeklHRnVaQ0JoSUc1MWJXSmxjaUJ2WmlCd1lYSjBhWFJwYjI1eklIUnZJR055WldGMFpTNWNjbHh1SUNCRWFYWnBaR1Z6SUhSb1pTQnZjbWxuYVc1aGJDQmhjbkpoZVNCcGJuUnZJSFJvWlNCemNHVmphV1pwWldRZ2JuVnRZbVZ5SUc5bUlITjFZaUJoY25KaGVYTXVYSEpjYmlBZ1QzWmxjbVpzYjNjZ2FYTWdjR0Z6YzJWa0lIUnZJSFJvWlNCbWFXNWhiQ0J3WVhKMGFYUnBiMjR1WEhKY2JpQWdJeU1qWEhKY2JpQWdkRzlUZFdKU1lXNW5aWE02SUNodUlEMGdOaXdnY21GdVoyVWdQU0JiWFNrZ0xUNWNjbHh1SUNBZ0lISmxkQ0E5SUc5aWFpNXZZbXBsWTNRb0tWeHlYRzRnSUNBZ2NtRnVaMlZNYjNjZ1BTQnlibWN1Y21GdVoyVk5hVzRnY21GdVoyVmNjbHh1SUNBZ0lISmhibWRsU0dsbmFDQTlJSEp1Wnk1eVlXNW5aVTFoZUNCeVlXNW5aVnh5WEc1Y2NseHVJQ0FnSUdScGMzUmhibU5sSUQwZ2NtRnVaMlZJYVdkb0lDMGdjbUZ1WjJWTWIzZGNjbHh1SUNBZ0lITjFZbEpoYm1kbFUybDZaU0E5SUdScGMzUmhibU5sTDI1Y2NseHVJQ0FnSUhOMVlsSmhibWRsY3lBOUlISmxkQzVoWkdRZ0ozSmhibWRsY3ljc0lHOWlhaTV2WW1wbFkzUW9LVnh5WEc0Z0lDQWdZMmgxYm10V1lXd2dQU0J5WVc1blpVeHZkMXh5WEc1Y2NseHVJQ0FnSUcxaGNDQTlJRzlpYWk1dlltcGxZM1FvS1Z4eVhHNWNjbHh1SUNBZ0lHa2dQU0F3WEhKY2JpQWdJQ0IzYUdsc1pTQnBJRHdnYmx4eVhHNGdJQ0FnSUNCcElDczlJREZjY2x4dUlDQWdJQ0FnYVdZZ2FTQThJRzRnZEdobGJpQnFkVzF3SUQwZ1RXRjBhQzV5YjNWdVpDQnpkV0pTWVc1blpWTnBlbVZjY2x4dUlDQWdJQ0FnWld4elpWeHlYRzRnSUNBZ0lDQWdJR3AxYlhBZ1BTQk5ZWFJvTG1ac2IyOXlJSE4xWWxKaGJtZGxVMmw2WlZ4eVhHNGdJQ0FnSUNBZ0lHbG1JR05vZFc1clZtRnNJQ3NnYW5WdGNDQThQU0J5WVc1blpVaHBaMmhjY2x4dUlDQWdJQ0FnSUNBZ0lHcDFiWEFnS3owZ2NtRnVaMlZJYVdkb0lDMGdZMmgxYm10V1lXd2dMU0JxZFcxd0lDc2dNVnh5WEc1Y2NseHVJQ0FnSUNBZ2MzVmlVbUZ1WjJVZ1BTQnlibWN1Y21GdVoyVWdZMmgxYm10V1lXd3NJR05vZFc1clZtRnNJQ3NnYW5WdGNGeHlYRzRnSUNBZ0lDQmxZV05vSUhOMVlsSmhibWRsTENBb2RtRnNLU0F0UGlCdFlYQXVZV1JrSUhaaGJDd2dhVnh5WEc0Z0lDQWdJQ0J6ZFdKU1lXNW5aWE5iYVYwZ1BTQnpkV0pTWVc1blpWeHlYRzRnSUNBZ0lDQmphSFZ1YTFaaGJDQXJQU0JxZFcxd1hISmNibHh5WEc0Z0lDQWdjbVYwTG1Ga1pDQW5aMlYwVW1GdVoyVW5MQ0FvZG1Gc0tTQXRQbHh5WEc0Z0lDQWdJQ0J0WVhCYmRtRnNYVnh5WEc1Y2NseHVJQ0FnSUhKbGRGeHlYRzVjY2x4dVQySnFaV04wTG5ObFlXd2djbTVuWEhKY2JrOWlhbVZqZEM1bWNtVmxlbVVnY201blhISmNibHh5WEc1UFNpNXlaV2RwYzNSbGNpQW5jbUZ1WjJWekp5d2djbTVuWEhKY2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ2NtNW5YSEpjYmlKZGZRPT0iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgJCwgSVMsIE9KLCBUTywgXztcblxuT0ogPSByZXF1aXJlKCcuLi9vaicpO1xuXG4kID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJyQnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJyQnXSA6IG51bGwpO1xuXG5fID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ18nXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ18nXSA6IG51bGwpO1xuXG5JUyA9IHJlcXVpcmUoJy4vaXMnKTtcblxuVE8gPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFRPKCkge31cblxuICBUTy5ib29sID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIHJldEJvb2w7XG4gICAgcmV0Qm9vbCA9IElTWyd0cnVlJ10oc3RyKTtcbiAgICBpZiAocmV0Qm9vbCA9PT0gZmFsc2UgfHwgcmV0Qm9vbCAhPT0gdHJ1ZSkge1xuICAgICAgcmV0Qm9vbCA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gcmV0Qm9vbDtcbiAgfTtcblxuICBUTy5FUzVfVG9Cb29sID0gZnVuY3Rpb24odmFsKSB7XG4gICAgcmV0dXJuIHZhbCAhPT0gZmFsc2UgJiYgdmFsICE9PSAwICYmIHZhbCAhPT0gJycgJiYgdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnICYmICh0eXBlb2YgdmFsICE9PSAnbnVtYmVyJyB8fCAhaXNOYU4odmFsKSk7XG4gIH07XG5cbiAgVE8uZGF0ZUZyb21UaWNrcyA9IGZ1bmN0aW9uKHRpY2tTdHIpIHtcbiAgICB2YXIgYXJyLCBsb2NhbE9mZnNldCwgb2Zmc2V0LCByZXQsIHRpY2tzLCB0aWNzRGF0ZVRpbWU7XG4gICAgdGljc0RhdGVUaW1lID0gdGhpcy5zdHJpbmcodGlja1N0cik7XG4gICAgcmV0ID0gdm9pZCAwO1xuICAgIHRpY2tzID0gdm9pZCAwO1xuICAgIG9mZnNldCA9IHZvaWQgMDtcbiAgICBsb2NhbE9mZnNldCA9IHZvaWQgMDtcbiAgICBhcnIgPSB2b2lkIDA7XG4gICAgaWYgKGZhbHNlID09PSBJUy5udWxsT3JFbXB0eSh0aWNzRGF0ZVRpbWUpKSB7XG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnLycsICcnKTtcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCdEYXRlJywgJycpO1xuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJygnLCAnJyk7XG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnKScsICcnKTtcbiAgICAgIGFyciA9IHRpY3NEYXRlVGltZS5zcGxpdCgnLScpO1xuICAgICAgaWYgKGFyci5sZW5ndGggPiAxKSB7XG4gICAgICAgIHRpY2tzID0gdGhpcy5udW1iZXIoYXJyWzBdKTtcbiAgICAgICAgb2Zmc2V0ID0gdGhpcy5udW1iZXIoYXJyWzFdKTtcbiAgICAgICAgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgICAgIHJldCA9IG5ldyBEYXRlKHRpY2tzIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpO1xuICAgICAgfSBlbHNlIGlmIChhcnIubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHRpY2tzID0gdGhpcy5udW1iZXIoYXJyWzBdKTtcbiAgICAgICAgcmV0ID0gbmV3IERhdGUodGlja3MpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIFRPLmJpbmFyeSA9IGZ1bmN0aW9uKG9iaikge1xuICAgIHZhciByZXQ7XG4gICAgcmV0ID0gTmFOO1xuICAgIGlmIChvYmogPT09IDAgfHwgb2JqID09PSAnMCcgfHwgb2JqID09PSAnJyB8fCBvYmogPT09IGZhbHNlIHx8IHRoaXMuc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgPT09ICdmYWxzZScpIHtcbiAgICAgIHJldCA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChvYmogPT09IDEgfHwgb2JqID09PSAnMScgfHwgb2JqID09PSB0cnVlIHx8IHRoaXMuc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgPT09ICd0cnVlJykge1xuICAgICAgICByZXQgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9O1xuXG4gIFRPLm51bWJlciA9IGZ1bmN0aW9uKGlucHV0TnVtLCBkZWZhdWx0TnVtKSB7XG4gICAgdmFyIHJldFZhbCwgdHJ5R2V0TnVtYmVyO1xuICAgIHRyeUdldE51bWJlciA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICB2YXIgcmV0LCB0cnlHZXQ7XG4gICAgICAgIHJldCA9IE5hTjtcbiAgICAgICAgaWYgKElTLm51bWJlcih2YWwpKSB7XG4gICAgICAgICAgcmV0ID0gdmFsO1xuICAgICAgICB9IGVsc2UgaWYgKElTLnN0cmluZyh2YWwpIHx8IElTLmJvb2wodmFsKSkge1xuICAgICAgICAgIHRyeUdldCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgbnVtO1xuICAgICAgICAgICAgbnVtID0gX3RoaXMuYmluYXJ5KHZhbHVlKTtcbiAgICAgICAgICAgIGlmICghSVMubnVtYmVyKG51bSkgJiYgdmFsdWUpIHtcbiAgICAgICAgICAgICAgbnVtID0gK3ZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFJUy5udW1iZXIobnVtKSkge1xuICAgICAgICAgICAgICBudW0gPSBfLnBhcnNlSW50KHZhbHVlLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudW07XG4gICAgICAgICAgfTtcbiAgICAgICAgICByZXQgPSB0cnlHZXQodmFsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgICByZXRWYWwgPSB0cnlHZXROdW1iZXIoaW5wdXROdW0pO1xuICAgIGlmICghSVMubnVtYmVyKHJldFZhbCkpIHtcbiAgICAgIHJldFZhbCA9IHRyeUdldE51bWJlcihkZWZhdWx0TnVtKTtcbiAgICAgIGlmICghSVMubnVtYmVyKHJldFZhbCkpIHtcbiAgICAgICAgcmV0VmFsID0gTnVtYmVyLk5hTjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldFZhbDtcbiAgfTtcblxuICBUTy5zdHJpbmcgPSBmdW5jdGlvbihpbnB1dFN0ciwgZGVmYXVsdFN0cikge1xuICAgIHZhciByZXQxLCByZXQyLCByZXRWYWwsIHRyeUdldFN0cmluZztcbiAgICB0cnlHZXRTdHJpbmcgPSAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgdmFyIHJldDtcbiAgICAgICAgcmV0ID0gdm9pZCAwO1xuICAgICAgICBpZiAoSVMuc3RyaW5nKHN0cikpIHtcbiAgICAgICAgICByZXQgPSBzdHI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0ID0gJyc7XG4gICAgICAgICAgaWYgKElTLmJvb2woc3RyKSB8fCBJUy5udW1iZXIoc3RyKSB8fCBJUy5kYXRlKHN0cikpIHtcbiAgICAgICAgICAgIHJldCA9IHN0ci50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgfTtcbiAgICB9KSh0aGlzKTtcbiAgICByZXQxID0gdHJ5R2V0U3RyaW5nKGlucHV0U3RyKTtcbiAgICByZXQyID0gdHJ5R2V0U3RyaW5nKGRlZmF1bHRTdHIpO1xuICAgIHJldFZhbCA9ICcnO1xuICAgIGlmIChyZXQxLmxlbmd0aCAhPT0gMCkge1xuICAgICAgcmV0VmFsID0gcmV0MTtcbiAgICB9IGVsc2UgaWYgKHJldDEgPT09IHJldDIgfHwgcmV0Mi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldFZhbCA9IHJldDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldFZhbCA9IHJldDI7XG4gICAgfVxuICAgIHJldHVybiByZXRWYWw7XG4gIH07XG5cbiAgcmV0dXJuIFRPO1xuXG59KSgpO1xuXG5PSi5yZWdpc3RlcigndG8nLCBUTyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVE87XG5cblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVE2WEZ4SGFYUm9kV0pjWEc5cVhGeHpjbU5jWEdOdlptWmxaVnhjZEc5dmJITmNYSFJ2TG1OdlptWmxaU0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPMEZCUVVFc1NVRkJRVHM3UVVGQlFTeEZRVUZCTEVkQlFVc3NUMEZCUVN4RFFVRlJMRTlCUVZJN08wRkJRMHdzUTBGQlFTeEhRVUZKTEU5QlFVRXNRMEZCVVN4UlFVRlNPenRCUVVOS0xFTkJRVUVzUjBGQlNTeFBRVUZCTEVOQlFWRXNVVUZCVWpzN1FVRkRTaXhGUVVGQkxFZEJRVXNzVDBGQlFTeERRVUZSTEUxQlFWSTdPMEZCUjBNN096dEZRVWRLTEVWQlFVTXNRMEZCUVN4SlFVRkVMRWRCUVU4c1UwRkJReXhIUVVGRU8wRkJRMHdzVVVGQlFUdEpRVUZCTEU5QlFVRXNSMEZCVlN4RlFVRkhMRU5CUVVFc1RVRkJRU3hEUVVGSUxFTkJRVmNzUjBGQldEdEpRVU5XTEVsQlFXOUNMRTlCUVVFc1MwRkJWeXhMUVVGWUxFbEJRVzlDTEU5QlFVRXNTMEZCWVN4SlFVRnlSRHROUVVGQkxFOUJRVUVzUjBGQlZTeE5RVUZXT3p0WFFVTkJPMFZCU0VzN08wVkJUMUFzUlVGQlF5eERRVUZCTEZWQlFVUXNSMEZCWVN4VFFVRkRMRWRCUVVRN1YwRkRXQ3hIUVVGQkxFdEJRVk1zUzBGQlZDeEpRVUZ0UWl4SFFVRkJMRXRCUVZNc1EwRkJOVUlzU1VGQmEwTXNSMEZCUVN4TFFVRlRMRVZCUVRORExFbEJRV3RFTEVkQlFVRXNTMEZCVXl4SlFVRXpSQ3hKUVVGdlJTeFBRVUZQTEVkQlFWQXNTMEZCWjBJc1YwRkJjRVlzU1VGQmIwY3NRMEZCUXl4UFFVRlBMRWRCUVZBc1MwRkJaMElzVVVGQmFFSXNTVUZCTkVJc1EwRkJTU3hMUVVGQkxFTkJRVTBzUjBGQlRpeERRVUZxUXp0RlFVUjZSanM3UlVGTFlpeEZRVUZETEVOQlFVRXNZVUZCUkN4SFFVRm5RaXhUUVVGRExFOUJRVVE3UVVGRFpDeFJRVUZCTzBsQlFVRXNXVUZCUVN4SFFVRmxMRWxCUVVNc1EwRkJRU3hOUVVGRUxFTkJRVkVzVDBGQlVqdEpRVU5tTEVkQlFVRXNSMEZCVFR0SlFVTk9MRXRCUVVFc1IwRkJVVHRKUVVOU0xFMUJRVUVzUjBGQlV6dEpRVU5VTEZkQlFVRXNSMEZCWXp0SlFVTmtMRWRCUVVFc1IwRkJUVHRKUVVOT0xFbEJRVWNzUzBGQlFTeExRVUZUTEVWQlFVVXNRMEZCUXl4WFFVRklMRU5CUVdVc1dVRkJaaXhEUVVGYU8wMUJRMFVzV1VGQlFTeEhRVUZsTEZsQlFWa3NRMEZCUXl4UFFVRmlMRU5CUVhGQ0xFZEJRWEpDTEVWQlFUQkNMRVZCUVRGQ08wMUJRMllzV1VGQlFTeEhRVUZsTEZsQlFWa3NRMEZCUXl4UFFVRmlMRU5CUVhGQ0xFMUJRWEpDTEVWQlFUWkNMRVZCUVRkQ08wMUJRMllzV1VGQlFTeEhRVUZsTEZsQlFWa3NRMEZCUXl4UFFVRmlMRU5CUVhGQ0xFZEJRWEpDTEVWQlFUQkNMRVZCUVRGQ08wMUJRMllzV1VGQlFTeEhRVUZsTEZsQlFWa3NRMEZCUXl4UFFVRmlMRU5CUVhGQ0xFZEJRWEpDTEVWQlFUQkNMRVZCUVRGQ08wMUJRMllzUjBGQlFTeEhRVUZOTEZsQlFWa3NRMEZCUXl4TFFVRmlMRU5CUVcxQ0xFZEJRVzVDTzAxQlEwNHNTVUZCUnl4SFFVRkhMRU5CUVVNc1RVRkJTaXhIUVVGaExFTkJRV2hDTzFGQlEwVXNTMEZCUVN4SFFVRlJMRWxCUVVNc1EwRkJRU3hOUVVGRUxFTkJRVkVzUjBGQlNTeERRVUZCTEVOQlFVRXNRMEZCV2p0UlFVTlNMRTFCUVVFc1IwRkJVeXhKUVVGRExFTkJRVUVzVFVGQlJDeERRVUZSTEVkQlFVa3NRMEZCUVN4RFFVRkJMRU5CUVZvN1VVRkRWQ3hYUVVGQkxFZEJRV3RDTEVsQlFVRXNTVUZCUVN4RFFVRkJMRU5CUVUwc1EwRkJReXhwUWtGQlVDeERRVUZCTzFGQlEyeENMRWRCUVVFc1IwRkJWU3hKUVVGQkxFbEJRVUVzUTBGQlRTeExRVUZCTEVkQlFWRXNRMEZCUXl4RFFVRkRMRmRCUVVFc1IwRkJZeXhEUVVGRExFMUJRVUVzUjBGQlV5eEhRVUZVTEVkQlFXVXNSVUZCYUVJc1EwRkJaaXhEUVVGQkxFZEJRWE5ETEVsQlFYWkRMRU5CUVdRc1JVRktXanRQUVVGQkxFMUJTMHNzU1VGQlJ5eEhRVUZITEVOQlFVTXNUVUZCU2l4TFFVRmpMRU5CUVdwQ08xRkJRMGdzUzBGQlFTeEhRVUZSTEVsQlFVTXNRMEZCUVN4TlFVRkVMRU5CUVZFc1IwRkJTU3hEUVVGQkxFTkJRVUVzUTBGQldqdFJRVU5TTEVkQlFVRXNSMEZCVlN4SlFVRkJMRWxCUVVFc1EwRkJTeXhMUVVGTUxFVkJSbEE3VDBGWVVEczdWMEZqUVR0RlFYSkNZenM3UlVGNVFtaENMRVZCUVVNc1EwRkJRU3hOUVVGRUxFZEJRVk1zVTBGQlF5eEhRVUZFTzBGQlExQXNVVUZCUVR0SlFVRkJMRWRCUVVFc1IwRkJUVHRKUVVOT0xFbEJRVWNzUjBGQlFTeExRVUZQTEVOQlFWQXNTVUZCV1N4SFFVRkJMRXRCUVU4c1IwRkJia0lzU1VGQk1FSXNSMEZCUVN4TFFVRlBMRVZCUVdwRExFbEJRWFZETEVkQlFVRXNTMEZCVHl4TFFVRTVReXhKUVVGMVJDeEpRVUZETEVOQlFVRXNUVUZCUkN4RFFVRlJMRWRCUVZJc1EwRkJXU3hEUVVGRExGZEJRV0lzUTBGQlFTeERRVUV3UWl4RFFVRkRMRWxCUVROQ0xFTkJRVUVzUTBGQlFTeExRVUZ4UXl4UFFVRXZSanROUVVORkxFZEJRVUVzUjBGQlRTeEZRVVJTTzB0QlFVRXNUVUZCUVR0TlFVVkxMRWxCUVZrc1IwRkJRU3hMUVVGUExFTkJRVkFzU1VGQldTeEhRVUZCTEV0QlFVOHNSMEZCYmtJc1NVRkJNRUlzUjBGQlFTeExRVUZQTEVsQlFXcERMRWxCUVhsRExFbEJRVU1zUTBGQlFTeE5RVUZFTEVOQlFWRXNSMEZCVWl4RFFVRlpMRU5CUVVNc1YwRkJZaXhEUVVGQkxFTkJRVEJDTEVOQlFVTXNTVUZCTTBJc1EwRkJRU3hEUVVGQkxFdEJRWEZETEUxQlFURkdPMUZCUVVFc1IwRkJRU3hIUVVGTkxFVkJRVTQ3VDBGR1REczdWMEZIUVR0RlFVeFBPenRGUVdkQ1ZDeEZRVUZETEVOQlFVRXNUVUZCUkN4SFFVRlRMRk5CUVVNc1VVRkJSQ3hGUVVGWExGVkJRVmc3UVVGRFVDeFJRVUZCTzBsQlFVRXNXVUZCUVN4SFFVRmxMRU5CUVVFc1UwRkJRU3hMUVVGQk8yRkJRVUVzVTBGQlF5eEhRVUZFTzBGQlEySXNXVUZCUVR0UlFVRkJMRWRCUVVFc1IwRkJUVHRSUVVWT0xFbEJRVWNzUlVGQlJTeERRVUZETEUxQlFVZ3NRMEZCVlN4SFFVRldMRU5CUVVnN1ZVRkRSU3hIUVVGQkxFZEJRVTBzU1VGRVVqdFRRVUZCTEUxQlIwc3NTVUZCUnl4RlFVRkZMRU5CUVVNc1RVRkJTQ3hEUVVGVkxFZEJRVllzUTBGQlFTeEpRVUZyUWl4RlFVRkZMRU5CUVVNc1NVRkJTQ3hEUVVGUkxFZEJRVklzUTBGQmNrSTdWVUZEU0N4TlFVRkJMRWRCUVZNc1UwRkJReXhMUVVGRU8wRkJRMUFzWjBKQlFVRTdXVUZCUVN4SFFVRkJMRWRCUVUwc1MwRkJReXhEUVVGQkxFMUJRVVFzUTBGQlVTeExRVUZTTzFsQlEwNHNTVUZCYVVJc1EwRkJTU3hGUVVGRkxFTkJRVU1zVFVGQlNDeERRVUZWTEVkQlFWWXNRMEZCU2l4SlFVRjFRaXhMUVVGNFF6dGpRVUZCTEVkQlFVRXNSMEZCVFN4RFFVRkRMRTFCUVZBN08xbEJRMEVzU1VGQk9FSXNRMEZCU1N4RlFVRkZMRU5CUVVNc1RVRkJTQ3hEUVVGVkxFZEJRVllzUTBGQmJFTTdZMEZCUVN4SFFVRkJMRWRCUVUwc1EwRkJReXhEUVVGRExGRkJRVVlzUTBGQlZ5eExRVUZZTEVWQlFXdENMRU5CUVd4Q0xFVkJRVTQ3TzIxQ1FVTkJPMVZCU2s4N1ZVRkxWQ3hIUVVGQkxFZEJRVTBzVFVGQlFTeERRVUZQTEVkQlFWQXNSVUZPU0RzN1pVRlBURHROUVdKaE8wbEJRVUVzUTBGQlFTeERRVUZCTEVOQlFVRXNTVUZCUVR0SlFXVm1MRTFCUVVFc1IwRkJVeXhaUVVGQkxFTkJRV0VzVVVGQllqdEpRVU5VTEVsQlFVY3NRMEZCU1N4RlFVRkZMRU5CUVVNc1RVRkJTQ3hEUVVGVkxFMUJRVllzUTBGQlVEdE5RVU5GTEUxQlFVRXNSMEZCVXl4WlFVRkJMRU5CUVdFc1ZVRkJZanROUVVOVUxFbEJRWFZDTEVOQlFVa3NSVUZCUlN4RFFVRkRMRTFCUVVnc1EwRkJWU3hOUVVGV0xFTkJRVE5DTzFGQlFVRXNUVUZCUVN4SFFVRlRMRTFCUVUwc1EwRkJReXhKUVVGb1FqdFBRVVpHT3p0WFFVZEJPMFZCY0VKUE96dEZRWGRDVkN4RlFVRkRMRU5CUVVFc1RVRkJSQ3hIUVVGVExGTkJRVU1zVVVGQlJDeEZRVUZYTEZWQlFWZzdRVUZEVUN4UlFVRkJPMGxCUVVFc1dVRkJRU3hIUVVGbExFTkJRVUVzVTBGQlFTeExRVUZCTzJGQlFVRXNVMEZCUXl4SFFVRkVPMEZCUTJJc1dVRkJRVHRSUVVGQkxFZEJRVUVzUjBGQlRUdFJRVU5PTEVsQlFVY3NSVUZCUlN4RFFVRkRMRTFCUVVnc1EwRkJWU3hIUVVGV0xFTkJRVWc3VlVGRFJTeEhRVUZCTEVkQlFVMHNTVUZFVWp0VFFVRkJMRTFCUVVFN1ZVRkhSU3hIUVVGQkxFZEJRVTA3VlVGRFRpeEpRVUY1UWl4RlFVRkZMRU5CUVVNc1NVRkJTQ3hEUVVGUkxFZEJRVklzUTBGQlFTeEpRVUZuUWl4RlFVRkZMRU5CUVVNc1RVRkJTQ3hEUVVGVkxFZEJRVllzUTBGQmFFSXNTVUZCYTBNc1JVRkJSU3hEUVVGRExFbEJRVWdzUTBGQlVTeEhRVUZTTEVOQlFUTkVPMWxCUVVFc1IwRkJRU3hIUVVGTkxFZEJRVWNzUTBGQlF5eFJRVUZLTEVOQlFVRXNSVUZCVGp0WFFVcEdPenRsUVV0Qk8wMUJVR0U3U1VGQlFTeERRVUZCTEVOQlFVRXNRMEZCUVN4SlFVRkJPMGxCVVdZc1NVRkJRU3hIUVVGUExGbEJRVUVzUTBGQllTeFJRVUZpTzBsQlExQXNTVUZCUVN4SFFVRlBMRmxCUVVFc1EwRkJZU3hWUVVGaU8wbEJRMUFzVFVGQlFTeEhRVUZUTzBsQlExUXNTVUZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUQ3hMUVVGcFFpeERRVUZ3UWp0TlFVTkZMRTFCUVVFc1IwRkJVeXhMUVVSWU8wdEJRVUVzVFVGRlN5eEpRVUZITEVsQlFVRXNTMEZCVVN4SlFVRlNMRWxCUVdkQ0xFbEJRVWtzUTBGQlF5eE5RVUZNTEV0QlFXVXNRMEZCYkVNN1RVRkRTQ3hOUVVGQkxFZEJRVk1zUzBGRVRqdExRVUZCTEUxQlFVRTdUVUZIU0N4TlFVRkJMRWRCUVZNc1MwRklUanM3VjBGSlREdEZRV3hDVHpzN096czdPMEZCYjBKWUxFVkJRVVVzUTBGQlF5eFJRVUZJTEVOQlFWa3NTVUZCV2l4RlFVRnJRaXhGUVVGc1FqczdRVUZEUVN4TlFVRk5MRU5CUVVNc1QwRkJVQ3hIUVVGcFFpSXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpVDBvZ1BTQnlaWEYxYVhKbElDY3VMaTl2YWlkY2JpUWdQU0J5WlhGMWFYSmxJQ2RxY1hWbGNua25YRzVmSUQwZ2NtVnhkV2x5WlNBbmJHOWtZWE5vSjF4dVNWTWdQU0J5WlhGMWFYSmxJQ2N1TDJsekoxeHVYRzRqSUNNZ2RHOWNibU5zWVhOeklGUlBJRnh1SUNBaklDTWpJR0p2YjJ4Y2JpQWdJeUJqYjI1MlpYSjBJR0Z1ZVNCamIyMXdZWFJwWW14bElHOWlhbVZqZENCMGJ5QmhJR0p2YjJ4bFlXNHVJRWx1WTI5dGNHRjBhV0pzWlNCdlltcGxZM1J6SUdGeVpTQm1ZV3h6WlM1Y2JpQWdRR0p2YjJ3NklDaHpkSElwSUMwK1hHNGdJQ0FnY21WMFFtOXZiQ0E5SUVsVFd5ZDBjblZsSjEwb2MzUnlLVnh1SUNBZ0lISmxkRUp2YjJ3Z1BTQm1ZV3h6WlNBZ2FXWWdjbVYwUW05dmJDQnBjeUJtWVd4elpTQnZjaUJ5WlhSQ2IyOXNJR2x6Ym5RZ2RISjFaVnh1SUNBZ0lISmxkRUp2YjJ4Y2JseHVJQ0FqSUNNaklFVlROVjlVYjBKdmIyeGNiaUFnSXlBb1pHVmlkV2NwSUcxbGRHaHZaQ0IwYnlCbGVIQnNhV05wZEd4NUlHWnZjbU5sSUdGdUlHQnBaaWh2WW1vcFlDQmxkbUZzZFdGMGFXOXVJSFJ2SUdac2IzY2dkR2h5YjNWbmFDQjBhR1VnUlZNMUlITndaV01nWm05eUlIUnlkWFJvYVc1bGMzTmNiaUFnUUVWVE5WOVViMEp2YjJ3NklDaDJZV3dwSUMwK1hHNGdJQ0FnZG1Gc0lHbHpiblFnWm1Gc2MyVWdZVzVrSUhaaGJDQnBjMjUwSURBZ1lXNWtJSFpoYkNCcGMyNTBJQ2NuSUdGdVpDQjJZV3dnYVhOdWRDQnVkV3hzSUdGdVpDQjBlWEJsYjJZZ2RtRnNJR2x6Ym5RZ0ozVnVaR1ZtYVc1bFpDY2dZVzVrSUNoMGVYQmxiMllnZG1Gc0lHbHpiblFnSjI1MWJXSmxjaWNnYjNJZ2JtOTBJR2x6VG1GT0tIWmhiQ2twWEc1Y2JpQWdJeUFqSXlCa1lYUmxSbkp2YlZScFkydHpYRzRnSUNNZ2RHRnJaU0JoSUc1MWJXSmxjaUJ5WlhCeVpYTmxiblJwYm1jZ2RHbGphM01nWVc1a0lHTnZiblpsY25RZ2FYUWdhVzUwYnlCaGJpQnBibk4wWVc1alpTQnZaaUJFWVhSbFhHNGdJRUJrWVhSbFJuSnZiVlJwWTJ0ek9pQW9kR2xqYTFOMGNpa2dMVDVjYmlBZ0lDQjBhV056UkdGMFpWUnBiV1VnUFNCQWMzUnlhVzVuS0hScFkydFRkSElwWEc0Z0lDQWdjbVYwSUQwZ2RXNWtaV1pwYm1Wa1hHNGdJQ0FnZEdsamEzTWdQU0IxYm1SbFptbHVaV1JjYmlBZ0lDQnZabVp6WlhRZ1BTQjFibVJsWm1sdVpXUmNiaUFnSUNCc2IyTmhiRTltWm5ObGRDQTlJSFZ1WkdWbWFXNWxaRnh1SUNBZ0lHRnljaUE5SUhWdVpHVm1hVzVsWkZ4dUlDQWdJR2xtSUdaaGJITmxJR2x6SUVsVExtNTFiR3hQY2tWdGNIUjVLSFJwWTNORVlYUmxWR2x0WlNsY2JpQWdJQ0FnSUhScFkzTkVZWFJsVkdsdFpTQTlJSFJwWTNORVlYUmxWR2x0WlM1eVpYQnNZV05sS0Njdkp5d2dKeWNwWEc0Z0lDQWdJQ0IwYVdOelJHRjBaVlJwYldVZ1BTQjBhV056UkdGMFpWUnBiV1V1Y21Wd2JHRmpaU2duUkdGMFpTY3NJQ2NuS1Z4dUlDQWdJQ0FnZEdsamMwUmhkR1ZVYVcxbElEMGdkR2xqYzBSaGRHVlVhVzFsTG5KbGNHeGhZMlVvSnlnbkxDQW5KeWxjYmlBZ0lDQWdJSFJwWTNORVlYUmxWR2x0WlNBOUlIUnBZM05FWVhSbFZHbHRaUzV5WlhCc1lXTmxLQ2NwSnl3Z0p5Y3BYRzRnSUNBZ0lDQmhjbklnUFNCMGFXTnpSR0YwWlZScGJXVXVjM0JzYVhRb0p5MG5LVnh1SUNBZ0lDQWdhV1lnWVhKeUxteGxibWQwYUNBK0lERmNiaUFnSUNBZ0lDQWdkR2xqYTNNZ1BTQkFiblZ0WW1WeUtHRnljbHN3WFNsY2JpQWdJQ0FnSUNBZ2IyWm1jMlYwSUQwZ1FHNTFiV0psY2loaGNuSmJNVjBwWEc0Z0lDQWdJQ0FnSUd4dlkyRnNUMlptYzJWMElEMGdibVYzSUVSaGRHVW9LUzVuWlhSVWFXMWxlbTl1WlU5bVpuTmxkQ2dwWEc0Z0lDQWdJQ0FnSUhKbGRDQTlJRzVsZHlCRVlYUmxLQ2gwYVdOcmN5QXRJQ2dvYkc5allXeFBabVp6WlhRZ0t5QW9iMlptYzJWMElDOGdNVEF3SUNvZ05qQXBLU0FxSURFd01EQXBLU2xjYmlBZ0lDQWdJR1ZzYzJVZ2FXWWdZWEp5TG14bGJtZDBhQ0JwY3lBeFhHNGdJQ0FnSUNBZ0lIUnBZMnR6SUQwZ1FHNTFiV0psY2loaGNuSmJNRjBwWEc0Z0lDQWdJQ0FnSUhKbGRDQTlJRzVsZHlCRVlYUmxLSFJwWTJ0ektWeHVJQ0FnSUhKbGRGeHVYRzRnSUNNZ0l5TWdZbWx1WVhKNVhHNGdJQ01nWTI5dWRtVnlkQ0JoYmlCdlltcGxZM1FnZEc4Z1ltbHVZWEo1SURBZ2IzSWdNVnh1SUNCQVltbHVZWEo1T2lBb2IySnFLU0F0UGx4dUlDQWdJSEpsZENBOUlFNWhUbHh1SUNBZ0lHbG1JRzlpYWlCcGN5QXdJRzl5SUc5aWFpQnBjeUFuTUNjZ2IzSWdiMkpxSUdseklDY25JRzl5SUc5aWFpQnBjeUJtWVd4elpTQnZjaUJBYzNSeWFXNW5LRzlpYWlrdWRHOU1iM2RsY2tOaGMyVW9LUzUwY21sdEtDa2dhWE1nSjJaaGJITmxKMXh1SUNBZ0lDQWdjbVYwSUQwZ01GeHVJQ0FnSUdWc2MyVWdjbVYwSUQwZ01TQWdhV1lnYjJKcUlHbHpJREVnYjNJZ2IySnFJR2x6SUNjeEp5QnZjaUJ2WW1vZ2FYTWdkSEoxWlNCdmNpQkFjM1J5YVc1bktHOWlhaWt1ZEc5TWIzZGxja05oYzJVb0tTNTBjbWx0S0NrZ2FYTWdKM1J5ZFdVblhHNGdJQ0FnY21WMFhHNWNibHh1SUNBaklDTWpJRzUxYldKbGNseHVJQ0FqWEc0Z0lDTWdRWFIwWlcxd2RITWdkRzhnWTI5dWRtVnlkQ0JoYmlCaGNtSnBkSEpoY25rZ2RtRnNkV1VnZEc4Z1lTQk9kVzFpWlhJdVhHNGdJQ01nVEc5dmMyVWdabUZzYzNrZ2RtRnNkV1Z6SUdGeVpTQmpiMjUyWlhKMFpXUWdkRzhnTUM1Y2JpQWdJeUJNYjI5elpTQjBjblYwYUhrZ2RtRnNkV1Z6SUdGeVpTQmpiMjUyWlhKMFpXUWdkRzhnTVM1Y2JpQWdJeUJCYkd3Z2IzUm9aWElnZG1Gc2RXVnpJR0Z5WlNCd1lYSnpaV1FnWVhNZ1NXNTBaV2RsY25NdVhHNGdJQ01nUm1GcGJIVnlaWE1nY21WMGRYSnVJR0Z6SUU1aFRpNWNiaUFnSTF4dUlDQkFiblZ0WW1WeU9pQW9hVzV3ZFhST2RXMHNJR1JsWm1GMWJIUk9kVzBwSUMwK1hHNGdJQ0FnZEhKNVIyVjBUblZ0WW1WeUlEMGdLSFpoYkNrZ1BUNWNiaUFnSUNBZ0lISmxkQ0E5SUU1aFRseHVJQ0FnSUNBZ0l5QnBaaUJnZG1Gc1lDQmhiSEpsWVdSNUlDaHBjeWxiYVhNdWFIUnRiRjBnWVNCT2RXMWlaWElzSUhKbGRIVnliaUJwZEZ4dUlDQWdJQ0FnYVdZZ1NWTXViblZ0WW1WeUtIWmhiQ2xjYmlBZ0lDQWdJQ0FnY21WMElEMGdkbUZzWEc0Z0lDQWdJQ0FqSUdWc2MyVWdhV1lnWUhaaGJHQWdZV3h5WldGa2VTQW9hWE1wVzJsekxtaDBiV3hkSUdFZ1UzUnlhVzVuSUc5eUlHRWdRbTl2YkdWaGJpd2dZMjl1ZG1WeWRDQnBkRnh1SUNBZ0lDQWdaV3h6WlNCcFppQkpVeTV6ZEhKcGJtY29kbUZzS1NCdmNpQkpVeTVpYjI5c0tIWmhiQ2xjYmlBZ0lDQWdJQ0FnZEhKNVIyVjBJRDBnS0haaGJIVmxLU0E5UGx4dUlDQWdJQ0FnSUNBZ0lHNTFiU0E5SUVCaWFXNWhjbmtvZG1Gc2RXVXBYRzRnSUNBZ0lDQWdJQ0FnYm5WdElEMGdLM1poYkhWbElDQnBaaUJ1YjNRZ1NWTXViblZ0WW1WeUtHNTFiU2tnWVc1a0lIWmhiSFZsWEc0Z0lDQWdJQ0FnSUNBZ2JuVnRJRDBnWHk1d1lYSnpaVWx1ZENoMllXeDFaU3dnTUNrZ2FXWWdibTkwSUVsVExtNTFiV0psY2lodWRXMHBYRzRnSUNBZ0lDQWdJQ0FnYm5WdFhHNGdJQ0FnSUNBZ0lISmxkQ0E5SUhSeWVVZGxkQ0IyWVd4Y2JpQWdJQ0FnSUhKbGRGeHVYRzRnSUNBZ2NtVjBWbUZzSUQwZ2RISjVSMlYwVG5WdFltVnlLR2x1Y0hWMFRuVnRLVnh1SUNBZ0lHbG1JRzV2ZENCSlV5NXVkVzFpWlhJb2NtVjBWbUZzS1Z4dUlDQWdJQ0FnY21WMFZtRnNJRDBnZEhKNVIyVjBUblZ0WW1WeUtHUmxabUYxYkhST2RXMHBYRzRnSUNBZ0lDQnlaWFJXWVd3Z1BTQk9kVzFpWlhJdVRtRk9JR2xtSUc1dmRDQkpVeTV1ZFcxaVpYSW9jbVYwVm1Gc0tWeHVJQ0FnSUhKbGRGWmhiRnh1WEc0Z0lDTWdJeU1nYzNSeWFXNW5YRzRnSUNNZ1kyOXVkbVZ5ZENCaGJpQnZZbXBsWTNRZ2RHOGdjM1J5YVc1blhHNGdJRUJ6ZEhKcGJtYzZJQ2hwYm5CMWRGTjBjaXdnWkdWbVlYVnNkRk4wY2lrZ0xUNWNiaUFnSUNCMGNubEhaWFJUZEhKcGJtY2dQU0FvYzNSeUtTQTlQbHh1SUNBZ0lDQWdjbVYwSUQwZ2RXNWtaV1pwYm1Wa1hHNGdJQ0FnSUNCcFppQkpVeTV6ZEhKcGJtY29jM1J5S1Z4dUlDQWdJQ0FnSUNCeVpYUWdQU0J6ZEhKY2JpQWdJQ0FnSUdWc2MyVmNiaUFnSUNBZ0lDQWdjbVYwSUQwZ0p5ZGNiaUFnSUNBZ0lDQWdjbVYwSUQwZ2MzUnlMblJ2VTNSeWFXNW5LQ2tnSUdsbUlFbFRMbUp2YjJ3b2MzUnlLU0J2Y2lCSlV5NXVkVzFpWlhJb2MzUnlLU0J2Y2lCSlV5NWtZWFJsS0hOMGNpbGNiaUFnSUNBZ0lISmxkRnh1SUNBZ0lISmxkREVnUFNCMGNubEhaWFJUZEhKcGJtY29hVzV3ZFhSVGRISXBYRzRnSUNBZ2NtVjBNaUE5SUhSeWVVZGxkRk4wY21sdVp5aGtaV1poZFd4MFUzUnlLVnh1SUNBZ0lISmxkRlpoYkNBOUlDY25YRzRnSUNBZ2FXWWdjbVYwTVM1c1pXNW5kR2dnYVhOdWRDQXdYRzRnSUNBZ0lDQnlaWFJXWVd3Z1BTQnlaWFF4WEc0Z0lDQWdaV3h6WlNCcFppQnlaWFF4SUdseklISmxkRElnYjNJZ2NtVjBNaTVzWlc1bmRHZ2dhWE1nTUZ4dUlDQWdJQ0FnY21WMFZtRnNJRDBnY21WME1WeHVJQ0FnSUdWc2MyVmNiaUFnSUNBZ0lISmxkRlpoYkNBOUlISmxkREpjYmlBZ0lDQnlaWFJXWVd4Y2JseHVUMG91Y21WbmFYTjBaWElnSjNSdkp5d2dWRTljYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnVkU4aVhYMD0iLCIjICMgY3JlYXRlVVVJRFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuIyMjXHJcbkdlbmVyYXRlcyBhIHJhbmRvbSBzdHJpbmcgdGhhdCBjb21wbGllcyB0byB0aGUgUkZDIDQxMjIgc3BlY2lmaWNhdGlvbiBmb3IgR1VJRC9VVUlELlxyXG4oZS5nLiAnQjQyQTE1M0YtMUQ5QS00RjkyLTk5MDMtOTJDMTFERDY4NEQyJylcclxuV2hpbGUgbm90IGEgdHJ1ZSBVVUlELCBmb3IgdGhlIHB1cnBvc2VzIG9mIHRoaXMgYXBwbGljYXRpb24sIGl0IHNob3VsZCBiZSBzdWZmaWNpZW50LlxyXG4jIyNcclxuY3JlYXRlRmF1eFVVSUQgPSAtPlxyXG4gICAgXHJcbiAgIyBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmM0MTIyLnR4dFxyXG4gICMgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvaG93LXRvLWNyZWF0ZS1hLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0XHJcbiAgcyA9IFtdXHJcbiAgcy5sZW5ndGggPSAzNlxyXG4gIGhleERpZ2l0cyA9ICcwMTIzNDU2Nzg5YWJjZGVmJ1xyXG4gIGkgPSAwXHJcblxyXG4gIHdoaWxlIGkgPCAzNlxyXG4gICAgc1tpXSA9IGhleERpZ2l0cy5zdWJzdHIoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHgxMCksIDEpXHJcbiAgICBpICs9IDFcclxuICBzWzE0XSA9ICc0JyAjIGJpdHMgMTItMTUgb2YgdGhlIHRpbWVfaGlfYW5kX3ZlcnNpb24gZmllbGQgdG8gMDAxMFxyXG4gIHNbMTldID0gaGV4RGlnaXRzLnN1YnN0cigoc1sxOV0gJiAweDMpIHwgMHg4LCAxKSAjIGJpdHMgNi03IG9mIHRoZSBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkIHRvIDAxXHJcbiAgc1s4XSA9IHNbMTNdID0gc1sxOF0gPSBzWzIzXSA9ICctJ1xyXG4gIHV1aWQgPSBzLmpvaW4oJycpXHJcbiAgdXVpZFxyXG5cclxuT0oucmVnaXN0ZXIgJ2NyZWF0ZVVVSUQnLCBjcmVhdGVGYXV4VVVJRFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUZhdXhVVUlEIl19
