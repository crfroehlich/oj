/**
 * ojs: OJ is a framework for writing web components and templates in frothy CoffeeScript or pure JavaScript. OJ provides a mechanism to rapidly build web applications using well encapsulated, modular code that doesn't rely on string templating or partially baked web standards.
 * @version: v0.4.39
 * @link: http://somecallmechief.github.io/oj/
 * @license: Puclic Domain, CC0 (http://creativecommons.org/about/pdm)
 */
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

require('./core/string.coffee');

require('./dom/nodeFactory.coffee');

require('./dom/body.coffee');

require('./dom/component.coffee');

require('./dom/control.coffee');

require('./dom/node.coffee');

require('./dom/element.coffee');

require('./dom/fragment.coffee');

require('./dom/generics.coffee');

require('./dom/input.coffee');

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

require('./tools/history.coffee');

require('./tools/is.coffee');

require('./tools/noty.coffee');

require('./tools/pubsub.coffee');

require('./tools/queryString.coffee');

require('./tools/ranges.coffee');

require('./tools/to.coffee');

require('./tools/uuid.coffee');



},{"./async/ajax.coffee":2,"./async/promise.coffee":3,"./components/grid.coffee":4,"./components/inputgroup.coffee":5,"./components/tabs.coffee":6,"./components/tile.coffee":7,"./controls/icon.coffee":8,"./core/date.coffee":9,"./core/function.coffee":10,"./core/number.coffee":11,"./core/object.coffee":12,"./core/string.coffee":14,"./dom/body.coffee":15,"./dom/component.coffee":16,"./dom/control.coffee":17,"./dom/element.coffee":18,"./dom/fragment.coffee":19,"./dom/generics.coffee":20,"./dom/input.coffee":21,"./dom/node.coffee":22,"./dom/nodeFactory.coffee":23,"./elements/a.coffee":24,"./elements/br.coffee":25,"./elements/form.coffee":26,"./elements/input.coffee":27,"./elements/ol.coffee":28,"./elements/select.coffee":29,"./elements/table.coffee":30,"./elements/textarea.coffee":31,"./elements/thead.coffee":32,"./elements/ul.coffee":33,"./inputs/buttoninput.coffee":35,"./inputs/checkbox.coffee":36,"./inputs/color.coffee":37,"./inputs/date.coffee":38,"./inputs/datetime.coffee":39,"./inputs/datetimelocal.coffee":40,"./inputs/email.coffee":41,"./inputs/file.coffee":42,"./inputs/hidden.coffee":43,"./inputs/imageinput.coffee":44,"./inputs/month.coffee":45,"./inputs/number.coffee":46,"./inputs/password.coffee":47,"./inputs/radio.coffee":48,"./inputs/range.coffee":49,"./inputs/reset.coffee":50,"./inputs/search.coffee":51,"./inputs/submit.coffee":52,"./inputs/tel.coffee":53,"./inputs/textinput.coffee":54,"./inputs/time.coffee":55,"./inputs/url.coffee":56,"./inputs/week.coffee":57,"./oj.coffee":58,"./ojInit.coffee":59,"./tools/array2D.coffee":61,"./tools/console.coffee":62,"./tools/cookie.coffee":63,"./tools/defer.coffee":64,"./tools/each.coffee":65,"./tools/enums.coffee":66,"./tools/history.coffee":67,"./tools/is.coffee":68,"./tools/noty.coffee":69,"./tools/pubsub.coffee":70,"./tools/queryString.coffee":71,"./tools/ranges.coffee":72,"./tools/to.coffee":73,"./tools/uuid.coffee":74}],2:[function(require,module,exports){
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

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

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
var OJ, ThinDOM, _, body, nodeFactory, thinBody;

OJ = require('../oj');

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

ThinDOM = (typeof window !== "undefined" ? window.ThinDOM : typeof global !== "undefined" ? global.ThinDOM : null);

nodeFactory = require('./nodeFactory');


/*
Persist a handle on the body node
 */

if (typeof document !== 'undefined') {
  body = document.body;
} else {
  body = null;
}

body = new ThinDOM(null, {
  id: 'body'
}, body);

body.tagName = 'body';

thinBody = nodeFactory(body, {});

OJ.register('body', thinBody);

module.exports = thinBody;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../oj":58,"./nodeFactory":23}],16:[function(require,module,exports){
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
var $, OJ, ThinDOM, _, element;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

ThinDOM = (typeof window !== "undefined" ? window.ThinDOM : typeof global !== "undefined" ? global.ThinDOM : null);

element = {

  /*
  Restore an HTML Element through ThinDom
   */
  restoreElement: function(el, tag) {
    var nodeFactory, ret, tD;
    if (tag == null) {
      tag = el.nodeName;
    }
    nodeFactory = require('./nodeFactory');
    tD = new ThinDOM(null, null, el);
    tD.isInDOM = true;
    ret = nodeFactory(tD);
    return ret;
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

},{"../oj":58,"./nodeFactory":23}],19:[function(require,module,exports){
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
var $, Node, OJ,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

Node = (function() {
  function Node(el, parent) {
    var enabled;
    this.el = el;
    this.parent = parent;
    this.disable = bind(this.disable, this);
    enabled = true;
    this.tagName = this.el.tagName;
    this['$'] = $(this.el.get());
    this['0'] = this.el.get();
  }

  Node.prototype.append = function() {
    var params, ref;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = this.el).append.apply(ref, params);
  };

  Node.prototype.prepend = function() {
    var params, ref;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = this.el).prepend.apply(ref, params);
  };

  Node.prototype.remove = function() {
    var params, ref;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = this.el).remove.apply(ref, params);
  };

  Node.prototype.css = function() {
    var params, ref;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = this.el).css.apply(ref, params);
  };

  Node.prototype.html = function() {
    var params, ref;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = this.el).html.apply(ref, params);
  };

  Node.prototype.text = function() {
    var params, ref;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = this.el).text.apply(ref, params);
  };

  Node.prototype.attr = function() {
    var params, ref;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = this.el).attr.apply(ref, params);
  };

  Node.prototype.data = function() {
    var params, ref;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = this.el).data.apply(ref, params);
  };

  Node.prototype.get = function() {
    var params, ref;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = this.el).get.apply(ref, params);
  };

  Node.prototype.add = function(key, val) {
    return this[key] = val;
  };

  Node.prototype.isControlStillValid = function() {
    var isMethod, valid;
    isMethod = require('../tools/is');
    valid = false === isMethod.nullOrEmpty(this.el) && this.isValid();
    if (false === valid) {
      throw new Error('el is null. Event bindings may not have been GCd.');
    }
    return valid;
  };

  Node.prototype.isValid = function() {
    return this.el && (this.el.el instanceof HTMLElement || this.el.el instanceof DocumentFragment);
  };

  Node.prototype.addClass = function(name) {
    if (this.isControlStillValid()) {
      this['$'].addClass(name);
    }
    return this;
  };

  Node.prototype.bind = function(eventName, event) {
    return this.on(eventName, event);
  };

  Node.prototype.keyboard = function(keys, event) {
    return this;
  };

  Node.prototype.disable = function() {
    var enabled;
    if (this.isControlStillValid()) {
      enabled = false;
      this.attr('disabled', 'disabled');
      this.addClass('disabled', 'disabled');
    }
    return this;
  };

  Node.prototype.empty = function() {
    if (this.isControlStillValid()) {
      this['$'].empty();
    }
    return this;
  };

  Node.prototype.enable = function() {
    var enabled;
    if (this.isControlStillValid()) {
      enabled = true;
      this.removeAttr('disabled');
      this.removeClass('disabled');
    }
    return this;
  };

  Node.prototype.getId = function() {
    var id;
    if (this.isControlStillValid()) {
      id = this[0].id;
    }
    return id;
  };

  Node.prototype.hasClass = function() {
    var params, ref;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = this['$']).hasClass.apply(ref, params);
  };

  Node.prototype.hide = function() {
    if (this.isControlStillValid()) {
      this.css('display', 'none');
    }
    return this;
  };

  Node.prototype.length = function() {
    var len, to;
    to = require('../tools/to');
    len = 0;
    if (this.isControlStillValid()) {
      len = to.number(this['$'].length);
    }
    return len;
  };

  Node.prototype.on = function(eventName, event) {
    if (this.isControlStillValid()) {
      this['$'].on(eventName, event);
    }
    return this;
  };

  Node.prototype.off = function(eventName, event) {
    if (this.isControlStillValid()) {
      this['$'].off(eventName, event);
    }
    return this.el;
  };

  Node.prototype.prop = function() {
    var params, ref;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return (ref = this['$']).prop.apply(ref, params);
  };

  Node.prototype.remove = function() {
    if (this.el && this['$']) {
      this['$'].remove();
      this.el = null;
      this['$'] = null;
      this[0] = null;
    }
    return null;
  };

  Node.prototype.removeClass = function(name) {
    if (this.isControlStillValid()) {
      this['$'].removeClass(name);
    }
    return this;
  };

  Node.prototype.removeProp = function(name) {
    if (this.isControlStillValid()) {
      this['$'].removeProp(name);
    }
    return this;
  };

  Node.prototype.removeAttr = function(name) {
    if (this.isControlStillValid()) {
      this['$'].removeAttr(name);
    }
    return this;
  };

  Node.prototype.required = function(truthy, addLabel) {
    var to;
    if (this.isControlStillValid()) {
      to = require('../tools/to');
      switch (to.bool(truthy)) {
        case true:
          this.attr('required', true);
          this.addClass('required');
          break;
        case false:
          this.removeProp('required');
          this.removeClass('required');
      }
    }
    return this['$'];
  };

  Node.prototype.show = function() {
    if (this.isControlStillValid()) {
      this['$'].show();
    }
    return this;
  };

  Node.prototype.toggle = function() {
    if (this.isControlStillValid()) {
      return this['$'].toggle();
    }
  };

  Node.toggleClass = function() {
    var params, ref;
    params = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (this.isControlStillValid()) {
      (ref = this['$']).toggleClass.apply(ref, params);
    }
    return this;
  };

  Node.prototype.toggleEnable = function() {
    if (this.isControlStillValid()) {
      if (enabled) {
        this.disable();
      } else {
        this.enable();
      }
    }
    return this;
  };

  Node.prototype.trigger = function(eventName, eventOpts) {
    if (this.isControlStillValid()) {
      this['$'].trigger(eventName, eventOpts);
    }
    return this.el;
  };

  Node.prototype.unbind = function(eventName, event) {
    return this.off(eventName, event);
  };

  Node.prototype.val = function(value) {
    var isMethod, ret;
    ret = this;
    if (this.isControlStillValid()) {
      isMethod = require('../tools/is');
      if (arguments.length === 1 && false === isMethod.nullOrUndefined(value)) {
        this['$'].val(value);
      } else {
        ret = this['$'].val();
      }
    }
    return ret;
  };

  Node.prototype.valueOf = function() {
    return this.val();
  };

  Node.prototype.toString = function() {
    return this.val();
  };

  return Node;

})();

module.exports = Node;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../oj":58,"../tools/is":68,"../tools/to":73}],23:[function(require,module,exports){
(function (global){
var Node, NodeFactory, OJ, ThinDOM, _, getNodeFromFactory,
  slice = [].slice;

OJ = require('../oj');

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

ThinDOM = (typeof window !== "undefined" ? window.ThinDOM : typeof global !== "undefined" ? global.ThinDOM : null);

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
  var factory;
  if (OJ.is.string(tag)) {
    factory = new NodeFactory(tag, options, owner);
  } else {
    factory = new NodeFactory(null, options, {}, tag);
  }
  return factory.ojNode;
};

OJ.register('nodeFactory', getNodeFromFactory);

module.exports = getNodeFromFactory;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

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

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

array2D = require('../tools/array2D');

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

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

},{"./global":34}],59:[function(require,module,exports){
(function (global){
var OJ, _, subNameSpaces;

OJ = require('./oj');

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

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

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);


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

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

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

},{"../core/number":11,"../oj":58,"./to":73}],69:[function(require,module,exports){
(function (global){
var OJ, makeNoty, noty;

OJ = require('../oj');

noty = (typeof window !== "undefined" ? window.noty : typeof global !== "undefined" ? global.noty : null);

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

},{"../oj":58}],70:[function(require,module,exports){
(function (global){
var OJ, PubSub, events, ps, subscribers, tokens;

OJ = require('../oj');

PubSub = (typeof window !== "undefined" ? window.PubSub : typeof global !== "undefined" ? global.PubSub : null);

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

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

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

},{"../core/object":12,"../oj":58,"./each":65}],73:[function(require,module,exports){
(function (global){
var $, IS, OJ, TO, _;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvZW50cnlwb2ludC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvYXN5bmMvYWpheC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvYXN5bmMvcHJvbWlzZS5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvY29tcG9uZW50cy9ncmlkLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9jb21wb25lbnRzL2lucHV0Z3JvdXAuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2NvbXBvbmVudHMvdGFicy5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvY29tcG9uZW50cy90aWxlLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9jb250cm9scy9pY29uLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9jb3JlL2RhdGUuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2NvcmUvZnVuY3Rpb24uY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2NvcmUvbnVtYmVyLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9jb3JlL29iamVjdC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvY29yZS9wcm9wZXJ0eS5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvY29yZS9zdHJpbmcuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2RvbS9ib2R5LmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9kb20vY29tcG9uZW50LmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9kb20vY29udHJvbC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvZG9tL2VsZW1lbnQuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2RvbS9mcmFnbWVudC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvZG9tL2dlbmVyaWNzLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9kb20vaW5wdXQuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2RvbS9ub2RlLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9kb20vbm9kZUZhY3RvcnkuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2VsZW1lbnRzL2EuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2VsZW1lbnRzL2JyLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9lbGVtZW50cy9mb3JtLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9lbGVtZW50cy9pbnB1dC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvZWxlbWVudHMvb2wuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2VsZW1lbnRzL3NlbGVjdC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvZWxlbWVudHMvdGFibGUuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2VsZW1lbnRzL3RleHRhcmVhLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9lbGVtZW50cy90aGVhZC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvZWxlbWVudHMvdWwuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2dsb2JhbC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvaW5wdXRzL2J1dHRvbmlucHV0LmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9pbnB1dHMvY2hlY2tib3guY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2lucHV0cy9jb2xvci5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvaW5wdXRzL2RhdGUuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2lucHV0cy9kYXRldGltZS5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvaW5wdXRzL2RhdGV0aW1lbG9jYWwuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2lucHV0cy9lbWFpbC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvaW5wdXRzL2ZpbGUuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2lucHV0cy9oaWRkZW4uY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2lucHV0cy9pbWFnZWlucHV0LmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9pbnB1dHMvbW9udGguY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2lucHV0cy9udW1iZXIuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2lucHV0cy9wYXNzd29yZC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvaW5wdXRzL3JhZGlvLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9pbnB1dHMvcmFuZ2UuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2lucHV0cy9yZXNldC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvaW5wdXRzL3NlYXJjaC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvaW5wdXRzL3N1Ym1pdC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvaW5wdXRzL3RlbC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvaW5wdXRzL3RleHRpbnB1dC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvaW5wdXRzL3RpbWUuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2lucHV0cy91cmwuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL2lucHV0cy93ZWVrLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS9vai5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvb2pJbml0LmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS90b29scy9Kc29uVG9UYWJsZS5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvdG9vbHMvYXJyYXkyRC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvdG9vbHMvY29uc29sZS5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvdG9vbHMvY29va2llLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS90b29scy9kZWZlci5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvdG9vbHMvZWFjaC5jb2ZmZWUiLCIvaG9tZS9hYXJvbi93b3Jrc3BhY2UvZHJlL29qL3NyYy9jb2ZmZWUvdG9vbHMvZW51bXMuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL3Rvb2xzL2hpc3RvcnkuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL3Rvb2xzL2lzLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS90b29scy9ub3R5LmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS90b29scy9wdWJzdWIuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL3Rvb2xzL3F1ZXJ5U3RyaW5nLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS90b29scy9yYW5nZXMuY29mZmVlIiwiL2hvbWUvYWFyb24vd29ya3NwYWNlL2RyZS9vai9zcmMvY29mZmVlL3Rvb2xzL3RvLmNvZmZlZSIsIi9ob21lL2Fhcm9uL3dvcmtzcGFjZS9kcmUvb2ovc3JjL2NvZmZlZS90b29scy91dWlkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE9BQUEsQ0FBUSxhQUFSLENBQUEsQ0FBQTs7QUFBQSxPQUNBLENBQVEsaUJBQVIsQ0FEQSxDQUFBOztBQUFBLE9BRUEsQ0FBUSxxQkFBUixDQUZBLENBQUE7O0FBQUEsT0FHQSxDQUFRLHdCQUFSLENBSEEsQ0FBQTs7QUFBQSxPQUlBLENBQVEsMEJBQVIsQ0FKQSxDQUFBOztBQUFBLE9BS0EsQ0FBUSxnQ0FBUixDQUxBLENBQUE7O0FBQUEsT0FNQSxDQUFRLDBCQUFSLENBTkEsQ0FBQTs7QUFBQSxPQU9BLENBQVEsMEJBQVIsQ0FQQSxDQUFBOztBQUFBLE9BUUEsQ0FBUSx3QkFBUixDQVJBLENBQUE7O0FBQUEsT0FTQSxDQUFRLG9CQUFSLENBVEEsQ0FBQTs7QUFBQSxPQVVBLENBQVEsd0JBQVIsQ0FWQSxDQUFBOztBQUFBLE9BV0EsQ0FBUSxzQkFBUixDQVhBLENBQUE7O0FBQUEsT0FZQSxDQUFRLHNCQUFSLENBWkEsQ0FBQTs7QUFBQSxPQWFBLENBQVEsc0JBQVIsQ0FiQSxDQUFBOztBQUFBLE9BY0EsQ0FBUSwwQkFBUixDQWRBLENBQUE7O0FBQUEsT0FlQSxDQUFRLG1CQUFSLENBZkEsQ0FBQTs7QUFBQSxPQWdCQSxDQUFRLHdCQUFSLENBaEJBLENBQUE7O0FBQUEsT0FpQkEsQ0FBUSxzQkFBUixDQWpCQSxDQUFBOztBQUFBLE9Ba0JBLENBQVEsbUJBQVIsQ0FsQkEsQ0FBQTs7QUFBQSxPQW1CQSxDQUFRLHNCQUFSLENBbkJBLENBQUE7O0FBQUEsT0FvQkEsQ0FBUSx1QkFBUixDQXBCQSxDQUFB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QSxFQXdFQSxLQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxDQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLElBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsT0FSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0F6RUY7QUFBQSxFQW9GQSxJQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxDQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sTUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsS0FEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0FyRkY7QUFBQSxFQWdHQSxNQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxDQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0FqR0Y7QUFBQSxFQTRHQSxLQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxDQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0E3R0Y7QUFBQSxFQXdIQSxLQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0F6SEY7QUFBQSxFQW9JQSxNQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsT0FSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0FySUY7QUFBQSxFQWdKQSxRQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sVUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxJQUdBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBSkY7QUFBQSxJQU9BLFlBQUEsRUFBYyxPQVBkO0FBQUEsSUFRQSxXQUFBLEVBQWEsSUFSYjtHQWpKRjtBQUFBLEVBMkpBLEtBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQTVKRjtBQUFBLEVBdUtBLEtBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQXhLRjtBQUFBLEVBbUxBLEtBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQXBMRjtBQUFBLEVBK0xBLE1BQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsSUFGYjtBQUFBLElBR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQWhNRjtBQUFBLEVBMk1BLE1BQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQTVNRjtBQUFBLEVBdU5BLEdBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsSUFGYjtBQUFBLElBR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQXhORjtBQUFBLEVBbU9BLElBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxNQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsSUFGYjtBQUFBLElBR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxPQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQXBPRjtBQUFBLEVBK09BLElBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxNQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFB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UlIsQ0FBQTtBQUFBLEVBU0EsQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLFNBQVMsQ0FBQyxNQUFWLENBQWlCLENBQUMsQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLEdBQVQsQ0FBQSxHQUFnQixHQUFqQyxFQUFzQyxDQUF0QyxDQVRSLENBQUE7QUFBQSxFQVVBLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTyxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxHQVYvQixDQUFBO0FBQUEsRUFXQSxJQUFBLEdBQU8sQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLENBWFAsQ0FBQTtTQVlBLEtBaEJlO0FBQUEsQ0FQakIsQ0FBQTs7QUFBQSxFQXlCRSxDQUFDLFFBQUgsQ0FBWSxZQUFaLEVBQTBCLGNBQTFCLENBekJBLENBQUE7O0FBQUEsTUEwQk0sQ0FBQyxPQUFQLEdBQWlCLGNBMUJqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUgJy4vb2ouY29mZmVlJ1xucmVxdWlyZSAnLi9vakluaXQuY29mZmVlJ1xucmVxdWlyZSAnLi9hc3luYy9hamF4LmNvZmZlZSdcbnJlcXVpcmUgJy4vYXN5bmMvcHJvbWlzZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvZ3JpZC5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvaW5wdXRncm91cC5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvdGFicy5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvdGlsZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbnRyb2xzL2ljb24uY29mZmVlJ1xucmVxdWlyZSAnLi9jb3JlL2RhdGUuY29mZmVlJ1xucmVxdWlyZSAnLi9jb3JlL2Z1bmN0aW9uLmNvZmZlZSdcbnJlcXVpcmUgJy4vY29yZS9udW1iZXIuY29mZmVlJ1xucmVxdWlyZSAnLi9jb3JlL29iamVjdC5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvcmUvc3RyaW5nLmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL25vZGVGYWN0b3J5LmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2JvZHkuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vY29tcG9uZW50LmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2NvbnRyb2wuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vbm9kZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2RvbS9lbGVtZW50LmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2ZyYWdtZW50LmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2dlbmVyaWNzLmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2lucHV0LmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvYS5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL2JyLmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvZm9ybS5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL2lucHV0LmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvb2wuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy9zZWxlY3QuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy90YWJsZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RleHRhcmVhLmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvdGhlYWQuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy91bC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9idXR0b25pbnB1dC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9jaGVja2JveC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9jb2xvci5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9kYXRlLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2RhdGV0aW1lLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2RhdGV0aW1lbG9jYWwuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvZW1haWwuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvZmlsZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9oaWRkZW4uY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvaW1hZ2VpbnB1dC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9tb250aC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9udW1iZXIuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvcGFzc3dvcmQuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvcmFkaW8uY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvcmFuZ2UuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvcmVzZXQuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvc2VhcmNoLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3N1Ym1pdC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy90ZWwuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvdGV4dGlucHV0LmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3RpbWUuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvdXJsLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3dlZWsuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9hcnJheTJELmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvY29uc29sZS5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2Nvb2tpZS5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2RlZmVyLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvZWFjaC5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2VudW1zLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvaGlzdG9yeS5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2lzLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvbm90eS5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL3B1YnN1Yi5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL3F1ZXJ5U3RyaW5nLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvcmFuZ2VzLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvdG8uY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy91dWlkLmNvZmZlZSdcbiIsIiMgIyBhamF4XG5cbk9KID0gcmVxdWlyZSAnLi4vb2onXG5cbmNvbmZpZyA9IHt9XG4gIFxuIyBkZWZpbmUgYSBzdGFuZGFyZCBvbiBzdWNjZXNzIGhhbmRsZXIsIHdyaXRlIG91dCB0aGUgcmVxdWVzdCBzdGF0cyB0byBhIHRhYmxlXG5jb25maWcub25TdWNjZXNzID0gKG9wdHMsIGRhdGEsIHVybCkgLT5cbiAgcmVzcG9uc2UgPSB7fVxuICBPSi5leHRlbmQgcmVzcG9uc2UsIGRhdGFcbiAgb3B0cy5vblN1Y2Nlc3MgcmVzcG9uc2VcbiAgaWYgT0ouTE9HX0FMTF9BSkFYXG4gICAgT0ouY29uc29sZS50YWJsZSBbXG4gICAgICBXZWJzZXJ2aWNlOiBvcHRzLmFqYXhPcHRzLnVybFxuICAgICAgU3RhcnRUaW1lOiBvcHRzLnN0YXJ0VGltZVxuICAgICAgRW5kVGltZTogbmV3IERhdGUoKVxuICAgIF0gXG4gIHJldHVyblxuICBcbiMgZGVmaW5lIGEgc3RhbmRhcmQgb24gZXJyb3IgaGFuZGxlciwgd3JpdGUgb3V0IHRoZSByZXF1ZXN0IGVycm9yIGNvbmV4dCB0byBhIHRhYmxlXG5jb25maWcub25FcnJvciA9ICh4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cywgcGFyYW0xLCBvcHRzID0gT0oub2JqZWN0KCkpIC0+XG4gIGlmIHRleHRTdGF0dXMgaXNudCAnYWJvcnQnXG4gICAgaWYgT0ouTE9HX0FMTF9BSkFYX0VSUk9SU1xuICAgICAgT0ouY29uc29sZS50YWJsZSBbXG4gICAgICAgIFdlYnNlcnZpY2U6IG9wdHMuYWpheE9wdHMudXJsXG4gICAgICAgIERhdGE6IG9wdHMuYWpheE9wdHMuZGF0YVxuICAgICAgICBGYWlsZWQ6IHRleHRTdGF0dXNcbiAgICAgICAgU3RhdGU6IHhtbEh0dHBSZXF1ZXN0LnN0YXRlKClcbiAgICAgICAgU3RhdHVzOiB4bWxIdHRwUmVxdWVzdC5zdGF0dXNcbiAgICAgICAgU3RhdHVzVGV4dDogeG1sSHR0cFJlcXVlc3Quc3RhdHVzVGV4dFxuICAgICAgICBSZWFkeVN0YXRlOiB4bWxIdHRwUmVxdWVzdC5yZWFkeVN0YXRlXG4gICAgICAgIFJlc3BvbnNlVGV4dDogeG1sSHR0cFJlcXVlc3QucmVzcG9uc2VUZXh0XG4gICAgICBdXG5cbiAgICBvcHRzLm9uRXJyb3IgdGV4dFN0YXR1c1xuICByZXR1cm5cbiAgXG4jIGluIHRoZSBjYXNlIHdoZXJlIGBvcHRzYCBpcyBhIHN0cmluZywgY29udmVydCBpdCB0byBhbiBvYmplY3Rcbm9wdHNGcm9tVXJsID0gKG9wdHMpIC0+XG4gIGlmIE9KLmlzLnN0cmluZyBvcHRzXG4gICAgdXJsID0gb3B0c1xuICAgIG9wdHMgPSBPSi5vYmplY3QoKVxuICAgIG9wdHMuYWRkICdhamF4T3B0cycsIE9KLm9iamVjdCgpXG4gICAgb3B0cy5hamF4T3B0cy5hZGQgJ3VybCcsIHVybFxuICBvcHRzXG4gIFxuIyBkZWZpbmUgYSBzdGFuZGFyZCBgZXhlY2AgbWV0aG9kIHRvIGhhbmRsZSBhbGwgcmVxdWVzdCB2ZXJicy4gVXNlcyB0aGUgW2pRdWVyeS5hamF4XShodHRwOi8vYXBpLmpxdWVyeS5jb20vY2F0ZWdvcnkvYWpheC8pIEFQSS5cbiMgYGV4ZWNSZXF1ZXN0YCByZXR1cm5zIGEgcHJvbWlzZSByZXByZXNlbnQgdGhlIGFjdHVhbCBBSkFYIGNhbGwuXG4gIFxuIyAtIGB2ZXJiYCBkZWZhdWx0IHZhbHVlID0gJ0dFVCdcbiMgLSBgb3B0c2Agb2JqZWN0XG4jIC0tIGBvcHRzLmFqYXhPcHRzYCBvYmplY3QgZm9yIGFsbCBqUXVlcnkncyBhamF4LXNwZWNpZmljIHByb3BlcnRpZXMuXG5jb25maWcuZXhlY1JlcXVlc3QgPSAodmVyYiA9ICdHRVQnLCBvcHRzKSAtPlxuICBkZWZhdWx0cyA9XG4gICAgYWpheE9wdHM6XG4gICAgICB1cmw6ICcnXG4gICAgICBkYXRhOiB7fVxuICAgICAgdHlwZTogdmVyYlxuICAgICAgeGhyRmllbGRzOlxuICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcbiAgICAgIGRhdGFUeXBlOiAnanNvbidcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcbiAgICAgICAgXG4gICAgb25TdWNjZXNzOiBPSi5ub29wXG4gICAgb25FcnJvcjogT0oubm9vcFxuICAgIG9uQ29tcGxldGU6IE9KLm5vb3BcbiAgICBvdmVycmlkZUVycm9yOiBmYWxzZVxuICAgIHdhdGNoR2xvYmFsOiB0cnVlXG4gICAgdXNlQ2FjaGU6IGZhbHNlXG4gICAgXG4gIG9wdHMgPSBvcHRzRnJvbVVybCBvcHRzXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0cywgdHJ1ZVxuICAgIFxuICBkZWZhdWx0cy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpXG4gICAgXG4gIGlmIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5IGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcbiAgICAjIEdFVCByZXF1ZXN0cyBleHBlY3QgcXVlcnlTdHJpbmcgcGFyYW1ldGVyc1xuICAgIGlmIGRlZmF1bHRzLmFqYXhPcHRzLnZlcmIgaXMgJ0dFVCdcbiAgICAgIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGEgPSBPSi5wYXJhbXMgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxuICAgICMgYWxsIG90aGVyIHJlcXVlc3RzIHRha2UgYW4gb2JqZWN0XG4gICAgZWxzZVxuICAgICAgZGVmYXVsdHMuYWpheE9wdHMuZGF0YSA9IE9KLnNlcmlhbGl6ZSBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXG4gICAgXG4gIGdldEpRdWVyeURlZmVycmVkID0gKHdhdGNoR2xvYmFsKSAtPlxuICAgIHJldCA9ICQuYWpheCBkZWZhdWx0cy5hamF4T3B0c1xuICAgICAgXG4gICAgcmV0LmRvbmUgKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSAtPlxuICAgICAgY29uZmlnLm9uU3VjY2VzcyBkZWZhdWx0cywgZGF0YVxuXG4gICAgcmV0LmZhaWwgKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRleHQpIC0+XG4gICAgICBjb25maWcub25FcnJvciBqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUZXh0LCBkZWZhdWx0c1xuICBcbiAgICByZXQuYWx3YXlzICh4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cykgLT5cbiAgICAgIGRlZmF1bHRzLm9uQ29tcGxldGUgeG1sSHR0cFJlcXVlc3QsIHRleHRTdGF0dXNcblxuICAgIE9KLmFzeW5jLmFqYXhQcm9taXNlIHJldFxuXG4gIHByb21pc2UgPSBnZXRKUXVlcnlEZWZlcnJlZChkZWZhdWx0cy53YXRjaEdsb2JhbClcbiAgcHJvbWlzZVxuICBcbmFqYXggPSB7fVxuICBcbiMgIyMgcG9zdFxuIyBbT0pdKG9qLmh0bWwpLmFqYXgucG9zdDogaW5zZXJ0IGEgbmV3IG9iamVjdCBvciBpbml0IGEgZm9ybSBwb3N0XG4gIFxuIyAtIGBvcHRzYCBjYW4gYmUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgcmVxdWVzdC5cbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC4gXG5hamF4LnBvc3QgPSAob3B0cykgLT5cbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdQT1NUJywgb3B0c1xuICBcbiMgIyMgZ2V0XG4jIFtPSl0ob2ouaHRtbCkuYWpheC5nZXQ6IGdldCBhbiBleGlzdGluZyBvYmplY3RcbiAgXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxuIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxuI1xuYWpheC5nZXQgPSAob3B0cykgLT5cbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdHRVQnLCBvcHRzXG5cbiMgIyMgZGVsZXRlXG4jIFtPSl0ob2ouaHRtbCkuYWpheC5kZWxldGU6IGRlbGV0ZSBhbiBleGlzdGluZyBvYmplY3RcbiAgXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxuIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxuYWpheC5kZWxldGUgPSAob3B0cykgLT5cbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdERUxFVEUnLCBvcHRzXG5cbiMgIyMgcHV0XG4jIFtPSl0ob2ouaHRtbCkuYWpheC5wdXQ6IHVwZGF0ZSBhbiBleGlzdGluZyBvYmplY3RcbiAgXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxuIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxuYWpheC5wdXQgPSAob3B0cykgLT5cbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdQVVQnLCBvcHRzXG5cbk9KLmFzeW5jLnJlZ2lzdGVyICdhamF4JywgYWpheFxubW9kdWxlLmV4cG9ydHMgPSBhamF4IiwiIyAjIHByb21pc2VcblxuT0ogPSByZXF1aXJlICcuLi9vaidcblxuIyAjIyBhamF4UHJvbWlzZVxuIyBbT0pdKG9qLmh0bWwpLmFzeW5jLmFqYXhQcm9taXNlIGNvbnZlcnRzIGFuIEFKQVggWG1sSHR0cFJlcXVlc3QgaW50byBhIFByb21pc2UuIFxuIyBTZWUgYWxzbyBbUHJvbWlzZS5yZXNvbHZlXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXG5hamF4UHJvbWlzZSA9IChhamF4KSAtPiBcbiAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSBhamF4XG4gIHByb21pc2UuYWJvcnQgPSBhamF4LmFib3J0XG4gIHByb21pc2UucmVhZHlTdGF0ZSA9IGFqYXgucmVhZHlTdGF0ZVxuICBwcm9taXNlXG5cbiMgIyMgYWxsXG4jIFtPSl0ob2ouaHRtbCkuYXN5bmMuYWxsIHRha2VzIGFuIGFycmF5IG9mIGZ1bmN0aW9ucyBhbmQgcmV0dXJucyBhIHByb21pc2UgcmVwcmVzZW50aW5nIHRoZSBzdWNjZXNzIG9mIGFsbCBtZXRob2RzIG9yIHRoZSBmYWlsdXJlIG9mIGFueSBtZXRob2QuXG4jIFNlZSBhbHNvIFtQcm9taXNlLmFsbF0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxuYWxsID0gKGluaXRBcnJheSkgLT5cbiAgcmVxcyA9IGluaXRBcnJheSBvciBbXVxuICBwcm9taXNlID0gUHJvbWlzZS5hbGwocmVxcylcbiAgcHJvbWlzZS5wdXNoID0gKGl0ZW0pIC0+XG4gICAgcmVxcy5wdXNoIGl0ZW1cbiAgICByZXR1cm5cbiAgcHJvbWlzZVxuXG4jICMjIGRlZmVyXG4jIFtPSl0ob2ouaHRtbCkuYXN5bmMuZGVmZXIgY29udmVydHMgYSBmdW5jdGlvbiBpbnRvIGEgUHJvbWlzZSB0byBleGVjdXRlIHRoYXQgZnVuY3Rpb24uIFxuIyBTZWUgYWxzbyBbUHJvbWlzZS5tZXRob2RdKGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvYmxvYi9tYXN0ZXIvQVBJLm1kKS5cbmRlZnIgPSAoZnVuYyA9IE9KLm5vb3ApIC0+XG4gIHJldCA9IFByb21pc2UubWV0aG9kIGZ1bmNcbiAgcmV0XG4gIFxuICBcbk9KLmFzeW5jLnJlZ2lzdGVyICdkZWZlcicsIGRlZnJcbk9KLmFzeW5jLnJlZ2lzdGVyICdhbGwnLCBhbGxcbk9KLmFzeW5jLnJlZ2lzdGVyICdhamF4UHJvbWlzZScsIGFqYXhQcm9taXNlXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgZGVmZXI6IGRlZnJcbiAgYWxsOiBhbGxcbiAgYWpheFByb21pc2U6IGFqYXhQcm9taXNlXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vb2pJbml0J1xuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcbmFycmF5MkQgPSByZXF1aXJlICcuLi90b29scy9hcnJheTJEJ1xuXG5ub2RlTmFtZSA9ICd4LWdyaWQnXG5jbGFzc05hbWUgPSAnZ3JpZCdcbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcblxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XG4gIGRlZmF1bHRzID1cbiAgICB0aWxlU2l6ZXM6XG4gICAgICBzbWFsbFNwYW46ICcnXG4gICAgICBtZWRpdW1TcGFuOiAnJ1xuICAgICAgbGFyZ2VTcGFuOiAnJ1xuICAgIHByb3BzOlxuICAgICAgY2xhc3M6ICdncmlkJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuXG4gIHJvd3MgPSBbXVxuICB0aWxlcyA9IGFycmF5MkQoKVxuXG4gIGZpbGxNaXNzaW5nID0gKCkgLT5cbiAgICB0aWxlcy5lYWNoIChyb3dObywgY29sTm8sIHZhbCkgLT5cbiAgICAgIGlmIG5vdCB2YWxcbiAgICAgICAgcm93ID0gcmV0LnJvdyByb3dOb1xuICAgICAgICByb3cubWFrZSAndGlsZScsIGNvbE5vLCB7fVxuXG4gIHJldC5hZGQgJ3JvdycsIChyb3dObyA9IHJvd3MubGVuZ3RoLTEgb3IgMSktPlxuICAgIG51Um93ID0gcm93c1tyb3dOby0xXVxuICAgIGlmIG5vdCBudVJvd1xuICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xuICAgICAgICBudVJvdyA9IHJldC5tYWtlICdkaXYnLCBwcm9wczogY2xhc3M6ICdyb3cnXG4gICAgICAgIHJvd3MucHVzaCBudVJvd1xuICAgICAgbnVSb3cuYWRkICd0aWxlJywgKGNvbE5vLCBvcHRzKSAtPlxuICAgICAgICBvcHRzID0gT0ouZXh0ZW5kIChPSi5leHRlbmQge30sIGRlZmF1bHRzLnRpbGVTaXplcyksIG9wdHNcbiAgICAgICAgbnVUaWxlID0gT0ouY29tcG9uZW50cy50aWxlIG9wdHMsIG51Um93XG4gICAgICAgIHRpbGVzLnNldCByb3dObywgY29sTm8sIG51VGlsZVxuICAgICAgICBudVRpbGVcbiAgICBudVJvd1xuXG4gIHJldC5hZGQgJ3RpbGUnLCAocm93Tm8sIGNvbE5vLCBvcHRzKSAtPlxuICAgIGlmIG5vdCByb3dObyBvciByb3dObyA8IDEgdGhlbiByb3dObyA9IDFcbiAgICBpZiBub3QgY29sTm8gb3IgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXG5cbiAgICByb3cgPSByZXQucm93IHJvd05vXG4gICAgdGlsZSA9IHRpbGVzLmdldCByb3dObywgY29sTm9cblxuICAgIGlmIG5vdCB0aWxlXG4gICAgICBpID0gMFxuICAgICAgd2hpbGUgaSA8IGNvbE5vXG4gICAgICAgIGkgKz0gMVxuICAgICAgICB0cnlUaWxlID0gdGlsZXMuZ2V0IHJvd05vLCBpXG4gICAgICAgIGlmIG5vdCB0cnlUaWxlXG4gICAgICAgICAgaWYgaSBpcyBjb2xOb1xuICAgICAgICAgICAgdGlsZSA9IHJvdy5tYWtlICd0aWxlJywgb3B0c1xuICAgICAgICAgIGVsc2UgaWYgbm90IHRpbGVcbiAgICAgICAgICAgIHJvdy5tYWtlICd0aWxlJ1xuXG4gICAgZmlsbE1pc3NpbmcoKVxuICAgIHRpbGVcblxuICByZXRcblxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbXBvbmVudCA9IHJlcXVpcmUgJy4uL2RvbS9jb21wb25lbnQnXG51dWlkID0gcmVxdWlyZSAnLi4vdG9vbHMvdXVpZCdcblxubm9kZU5hbWUgPSAneC1pbnB1dC1ncm91cCdcbmNsYXNzTmFtZSA9ICdpbnB1dGdyb3VwJ1xuXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXG5cbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBmb3JJZCA9IHV1aWQoKVxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJ2Zvcm0tZ3JvdXAnXG4gICAgZXZlbnRzOlxuICAgICAgY2hhbmdlOiBPSi5ub29wXG4gICAgZm9yOiBmb3JJZFxuICAgIGxhYmVsVGV4dDogJydcbiAgICBpbnB1dE9wdHM6XG4gICAgICBwcm9wczpcbiAgICAgICAgaWQ6IGZvcklkXG4gICAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgICBjbGFzczogJydcbiAgICAgICAgcGxhY2Vob2xkZXI6ICcnXG4gICAgICAgIHZhbHVlOiAnJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuXG4gIGdyb3VwID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ2Zvcm0tZ3JvdXAnXG5cbiAgcmV0Lmdyb3VwTGFiZWwgPSBncm91cC5tYWtlICdsYWJlbCcsIHByb3BzOiB7IGZvcjogZm9ySWQgfSwgdGV4dDogZGVmYXVsdHMubGFiZWxUZXh0XG5cbiAgZGVmYXVsdHMuaW5wdXRPcHRzLnByb3BzLmNsYXNzICs9ICcgZm9ybS1jb250cm9sJ1xuICByZXQuZ3JvdXBJbnB1dCA9IGdyb3VwLm1ha2UgJ2lucHV0JywgZGVmYXVsdHMuaW5wdXRPcHRzXG5cbiAgcmV0Lmdyb3VwVmFsdWUgPSAoKSAtPlxuICAgIHJldC5ncm91cElucHV0LnZhbCgpXG5cbiAgcmV0XG5cbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xuXG5ub2RlTmFtZSA9ICd4LXRhYnMnXG5jbGFzc05hbWUgPSAndGFicydcblxuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxuXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cbiAgZGVmYXVsdHMgPVxuICAgIHRhYnM6IHt9XG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJydcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgcmV0ID0gY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcblxuICB0YWJzID0gcmV0Lm1ha2UgJ3VsJywgcHJvcHM6IGNsYXNzOiAnbmF2IG5hdi10YWJzJ1xuICBjb250ZW50ID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ3RhYi1jb250ZW50J1xuXG4gIGZpcnN0ID0gdHJ1ZVxuICBPSi5lYWNoIGRlZmF1bHRzLnRhYnMsICh0YWJWYWwsIHRhYk5hbWUpIC0+XG4gICAgdGFiQ2xhc3MgPSAnJ1xuICAgIGlmIGZpcnN0XG4gICAgICBmaXJzdCA9IGZhbHNlXG4gICAgICB0YWJDbGFzcyA9ICdhY3RpdmUnXG4gICAgYSA9IHRhYnMubWFrZSAnbGknLCBwcm9wczogY2xhc3M6IHRhYkNsYXNzXG4gICAgICAubWFrZSgnYScsXG4gICAgICAgIHRleHQ6IHRhYk5hbWVcbiAgICAgICAgcHJvcHM6XG4gICAgICAgICAgaHJlZjogJyMnICsgdGFiTmFtZVxuICAgICAgICAgICdkYXRhLXRvZ2dsZSc6ICd0YWInXG4gICAgICAgIGV2ZW50czpcbiAgICAgICAgICBjbGljazogLT5cbiAgICAgICAgICAgIGEuJC50YWIgJ3Nob3cnKVxuXG4gICAgdGFiQ29udGVudENsYXNzID0gJ3RhYi1wYW5lICcgKyB0YWJDbGFzc1xuICAgIHJldC5hZGQgdGFiTmFtZSwgY29udGVudC5tYWtlKCdkaXYnLCBwcm9wczogY2xhc3M6IHRhYkNvbnRlbnRDbGFzcywgaWQ6IHRhYk5hbWUpXG5cbiAgcmV0XG5cbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xuXG5ub2RlTmFtZSA9ICd4LXRpbGUnXG5jbGFzc05hbWUgPSAndGlsZSdcblxuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxuICBcbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBkZWZhdWx0cyA9XG4gICAgd2lkdGg6XG4gICAgICB4czogJydcbiAgICAgIHNtOiAnJ1xuICAgICAgbWQ6ICcnXG4gICAgICBsZzogJydcbiAgICBwcm9wczpcbiAgICAgIGNsYXNzOiAndGlsZSdcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgaWYgZGVmYXVsdHMud2lkdGgueHMgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC14cy0nICsgZGVmYXVsdHMud2lkdGgueHNcbiAgaWYgZGVmYXVsdHMud2lkdGguc20gdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1zbS0nICsgZGVmYXVsdHMud2lkdGguc21cbiAgaWYgZGVmYXVsdHMud2lkdGgubWQgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1tZC0nICsgZGVmYXVsdHMud2lkdGgubWRcbiAgaWYgZGVmYXVsdHMud2lkdGgubGcgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1sZy0nICsgZGVmYXVsdHMud2lkdGgubGdcblxuICByZXQgPSBPSi5jb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuICByZXRcblxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbnRyb2wgPSByZXF1aXJlICcuLi9kb20vY29udHJvbCdcblxuY29udHJvbE5hbWUgPSAneS1pY29uJ1xuZnJpZW5kbHlOYW1lID0gJ2ljb24nXG5cbk9KLmNvbnRyb2xzLm1lbWJlcnNbZnJpZW5kbHlOYW1lXSA9IGNvbnRyb2xOYW1lXG5cbmNudHJsID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBkZWZhdWx0cyA9XG4gICAgaWNvbk9wdHM6XG4gICAgICBuYW1lOiAnJ1xuICAgICAgc3RhY2tlZEljb246ICcnXG4gICAgICBzd2FwSWNvbjogJydcbiAgICAgIHNpemU6IGZhbHNlXG4gICAgICBjb2xvcjogJydcbiAgICAgIGxpYnJhcnk6ICcnXG4gICAgICBpc0ZpeGVkV2lkdGg6IGZhbHNlXG4gICAgICBpc0xpc3Q6IGZhbHNlXG4gICAgICBpc1NwaW5uZXI6IGZhbHNlXG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJydcbiAgICByb290Tm9kZVR5cGU6ICdzcGFuJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9uc1xuICByZXQgPSBjb250cm9sIGRlZmF1bHRzLCBvd25lciwgY29udHJvbE5hbWVcblxuICBpc1RvZ2dsZWQgPSBmYWxzZVxuXG4gICNUT0RPOiBTdXBwb3J0IGZvciBwaWN0b2ljb25zXG4gICNUT0RPOiBTdXBwb3J0IGZvciBvdGhlciBGb250QXdlc29tZSBwcm9wZXJ0aWVzIChzdGFjaywgcm90YXRlLCBzaXplLCBldGMpXG5cbiAgY2xhc3NOYW1lQmFzZSA9ICdmYSAnXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzRml4ZWRXaWR0aCB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLWZ3ICdcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuaXNMaXN0IHRoZW4gY2xhc3NOYW1lQmFzZSArPSAnZmEtbGkgJ1xuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc1NwaW5uZXIgdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1zcGluICdcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZVxuICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLnNpemUgPiAxIGFuZCBkZWZhdWx0cy5pY29uT3B0cy5zaXplIDw9IDVcbiAgICAgIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5zaXplICsgJ3ggJ1xuXG4gIGNsYXNzTmFtZSA9IGNsYXNzTmFtZUJhc2UgKyAnZmEtJyArIGRlZmF1bHRzLmljb25PcHRzLm5hbWVcbiAgcmV0Lm15SWNvbiA9IHJldC5tYWtlICdpJywgcHJvcHM6IGNsYXNzOiBjbGFzc05hbWVcblxuICAjVG9nZ2xlcyBkaXNwbGF5IGJldHdlZW4gbm9ybWFsIGljb24gYW5kIHN3YXAgaWNvbiwgaWYgYSBzd2FwIGljb24gaGFzIGJlZW4gc3BlY2lmaWVkXG4gIHJldC50b2dnbGVJY29uID0gLT5cbiAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zd2FwSWNvblxuICAgICAgbmV3SWNvbiA9IGRlZmF1bHRzLmljb25PcHRzLm5hbWVcblxuICAgICAgaXNUb2dnbGVkID0gIWlzVG9nZ2xlZFxuXG4gICAgICBpZiBpc1RvZ2dsZWRcbiAgICAgICAgcmV0Lm15SWNvbi4kLnJlbW92ZUNsYXNzKCdmYS0nICsgbmV3SWNvbilcbiAgICAgICAgbmV3SWNvbiA9IGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uXG4gICAgICBlbHNlXG4gICAgICAgIHJldC5teUljb24uJC5yZW1vdmVDbGFzcygnZmEtJyArIGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uKVxuXG4gICAgICByZXQubXlJY29uLiQuYWRkQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxuXG5cbiAgcmV0XG5cbk9KLmNvbnRyb2xzLnJlZ2lzdGVyIGZyaWVuZGx5TmFtZSwgY250cmxcbm1vZHVsZS5leHBvcnRzID0gY250cmwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuXG5nZXREYXRlRnJvbURuSnNvbiA9IChkbkRhdGUpIC0+XG4gICAgXG4gICMgVHJhbnNmb3JtcyBhIC5ORVQgSlNPTiBkYXRlIGludG8gYSBKYXZhU2NyaXB0IGRhdGUuXG4gICMgbmFtZT0nb2JqJyAgT2JqZWN0IHRvIHRlc3RcbiAgIyB0eXBlPSdCb29sZWFuJyAvPlxuICAjXG4gICMgICAgICAgdmFyIG1pbGxpID0gT0oudG8ubnVtYmVyKERuRGF0ZS5yZXBsYWNlKC9cXC9EYXRlXFwoKFxcZCspXFwtPyhcXGQrKVxcKVxcLy8sICckMScpKTtcbiAgIyAgICAgICB2YXIgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKERuRGF0ZS5yZXBsYWNlKC9cXC9EYXRlXFwoXFxkKyhbXFwrXFwtXT9cXGQrKVxcKVxcLy8sICckMScpKTtcbiAgIyAgICAgICB2YXIgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICMgICAgICAgcmV0dXJuIG5ldyBEYXRlKChtaWxsaSAtICgobG9jYWxPZmZzZXQgKyAob2Zmc2V0IC8gMTAwICogNjApKSAqIDEwMDApKSk7XG4gICMgICAgICAgXG4gICAgXG4gICMgRG4gRGF0ZSB3aWxsIGxvb2sgbGlrZSAvRGF0ZSgxMzM1NzU4NDAwMDAwLTA0MDApLyAgXG4gIGRuRGF0ZVN0ciA9IE9KLnRvLnN0cmluZyhkbkRhdGUpXG4gIHJldCA9IHVuZGVmaW5lZFxuICB0aWNrcyA9IHVuZGVmaW5lZFxuICBvZmZzZXQgPSB1bmRlZmluZWRcbiAgbG9jYWxPZmZzZXQgPSB1bmRlZmluZWRcbiAgYXJyID0gdW5kZWZpbmVkXG4gIHJldCA9IE9KLmRhdGVUaW1lTWluVmFsdWVcbiAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkoZG5EYXRlU3RyKVxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCcvJywgJycpXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJ0RhdGUnLCAnJylcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnKCcsICcnKVxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCcpJywgJycpXG4gICAgYXJyID0gZG5EYXRlU3RyLnNwbGl0KCctJylcbiAgICBpZiBhcnIubGVuZ3RoID4gMVxuICAgICAgdGlja3MgPSBPSi50by5udW1iZXIoYXJyWzBdKVxuICAgICAgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKGFyclsxXSlcbiAgICAgIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpXG4gICAgICByZXQgPSBuZXcgRGF0ZSgodGlja3MgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpXG4gICAgZWxzZSBpZiBhcnIubGVuZ3RoIGlzIDFcbiAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcbiAgICAgIHJldCA9IG5ldyBEYXRlKHRpY2tzKVxuICByZXRcblxuICBPSi5yZWdpc3RlciAnZ2V0RGF0ZUZyb21Ebkpzb24nLCBnZXREYXRlRnJvbURuSnNvblxuICBtb2R1bGVzLmV4cG9ydHMgPSBnZXREYXRlRnJvbURuSnNvblxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcblxuIyBXcmFwIHRoZSBleGVjdXRpb24gb2YgYSBtZXRob2QgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5ICAgICBcbiMgaWdub3JlIGVycm9ycyBmYWlsaW5nIHRvIGV4ZWMgc2VsZi1leGVjdXRpbmcgZnVuY3Rpb25zIFxuIyBSZXR1cm4gYSBtZXRob2Qgd3JhcHBlZCBpbiBhIHRyeS4uY2F0Y2guLmZpbmFsbHlcbnRyeUV4ZWMgPSAodHJ5RnVuYykgLT5cbiAgJ3VzZSBzdHJpY3QnXG4gIHJldCA9IGZhbHNlXG4gIHRoYXQgPSB0aGlzXG4gIHRyeVxuICAgIHJldCA9IHRyeUZ1bmMuYXBwbHkodGhhdCwgQXJyYXk6OnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSkgIGlmIE9KLmlzLm1ldGhvZCh0cnlGdW5jKVxuICBjYXRjaCBleGNlcHRpb25cbiAgICBpZiAoZXhjZXB0aW9uLm5hbWUgaXMgJ1R5cGVFcnJvcicgb3IgZXhjZXB0aW9uLnR5cGUgaXMgJ2NhbGxlZF9ub25fY2FsbGFibGUnKSBhbmQgZXhjZXB0aW9uLnR5cGUgaXMgJ25vbl9vYmplY3RfcHJvcGVydHlfbG9hZCdcbiAgICAgIE9KLmNvbnNvbGUuaW5mbyAnSWdub3JpbmcgZXhjZXB0aW9uOiAnLCBleGNlcHRpb25cbiAgICBlbHNlXG4gICAgICBPSi5jb25zb2xlLmVycm9yIGV4Y2VwdGlvblxuICBmaW5hbGx5XG5cbiAgcmV0XG5cblxuIG1ldGhvZCA9ICh0cnlGdW5jKSAtPlxuICAndXNlIHN0cmljdCdcbiAgdGhhdCA9IHRoaXNcbiAgLT5cbiAgICBhcmdzID0gQXJyYXk6OnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKVxuICAgIGFyZ3MudW5zaGlmdCB0cnlGdW5jXG4gICAgT0oudHJ5RXhlYy5hcHBseSB0aGF0LCBhcmdzXG5cbiAgXG4gXG4gT0oucmVnaXN0ZXIgJ21ldGhvZCcsIG1ldGhvZFxuIE9KLnJlZ2lzdGVyICd0cnlFeGVjJywgdHJ5RXhlY1xuIG1vZHVsZS5leHBvcnRzID1cbiAgbWV0aG9kOiBtZXRob2RcbiAgdHJ5RXhlYzogdHJ5RXhlY1xuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcblxubnVtYmVyID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnaXNOYU4nLFxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5pc05hTikgdGhlbiBOdW1iZXIuaXNOYU4gZWxzZSBpc05hTilcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ2lzRmluaXRlJyxcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuaXNGaW5pdGUpIHRoZW4gTnVtYmVyLmlzRmluaXRlIGVsc2UgaXNGaW5pdGUpXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdNQVhfVkFMVUUnLFxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5NQVhfVkFMVUUpIHRoZW4gTnVtYmVyLk1BWF9WQUxVRSBlbHNlIDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnTUlOX1ZBTFVFJyxcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuTUlOX1ZBTFVFKSB0aGVuIE51bWJlci5NSU5fVkFMVUUgZWxzZSA1ZS0zMjQpXG5cbk9KLnJlZ2lzdGVyICdudW1iZXInLCBudW1iZXJcbm1vZHVsZS5leHBvcnRzID0gbnVtYmVyIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbiQgPSByZXF1aXJlICdqcXVlcnknXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcbnByb3BlcnR5ID0gcmVxdWlyZSAnLi9wcm9wZXJ0eSdcbmZ1bmMgPSByZXF1aXJlICcuL2Z1bmN0aW9uJ1xudG8gPSByZXF1aXJlICcuLi90b29scy90bydcblxuIyAjIG9iamVjdFxuXG5yZXRPYmogPSBcblxuICAjICMjIFtPSl0ob2ouaHRtbCkub2JqZWN0XG4gICMgY3JlYXRlIGFuIG9iamVjdCB3aXRoIGhlbHBlciBgYWRkYCBhbmQgYGVhY2hgIG1ldGhvZHMuXG4gIG9iamVjdDogKG9iaiA9IHt9KSAtPlxuICAgIFxuICAgICMjI1xuICAgIEFkZCBhIHByb3BlcnR5IHRvIHRoZSBvYmplY3QgYW5kIHJldHVybiBpdFxuICAgICMjI1xuICAgIG9iai5hZGQgPSAobmFtZSwgdmFsKSAtPlxuICAgICAgcHJvcGVydHkgb2JqLCBuYW1lLCB2YWxcbiAgICAgIG9ialxuXG4gICAgb2JqLmFkZCAnZWFjaCcsIChjYWxsYmFjaykgLT5cbiAgICAgIGVhY2ggPSByZXF1aXJlICcuLi90b29scy9lYWNoJ1xuICAgICAgZWFjaCBvYmosICh2YWwsIGtleSkgLT5cbiAgICAgICAgaWYga2V5IGlzbnQgJ2VhY2gnIGFuZCBrZXkgaXNudCAnYWRkJ1xuICAgICAgICAgIGNhbGxiYWNrIHZhbCwga2V5XG5cbiAgICBvYmpcblxuXG4gICMgIyMgW09KXShvai5odG1sKS5pc0luc3RhbmNlT2ZcbiAgIyBkZXRlcm1pbmVzIGlzIGEgdGhpbmcgaXMgYW4gaW5zdGFuY2Ugb2YgYSBUaGluZywgYXNzdW1pbmcgdGhlIHRoaW5ncyB3ZXJlIGFsbCBjcmVhdGVkIGluIE9KXG4gIGlzSW5zdGFuY2VPZjogKG5hbWUsIG9iaikgLT5cbiAgICByZXRPYmouY29udGFpbnMobmFtZSwgb2JqKSBhbmQgdG8uYm9vbChvYmpbbmFtZV0pXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmNvbnRhaW5zXG4gICMgdHJ1ZSBpZiB0aGUgYG9iamVjdGAgY29udGFpbnMgdGhlIHZhbHVlXG4gIGNvbnRhaW5zOiAob2JqZWN0LCBpbmRleCkgLT5cbiAgICByZXQgPSBmYWxzZVxuICAgIGlmIG9iamVjdFxuICAgICAgcmV0ID0gXy5jb250YWlucyBvYmplY3QsIGluZGV4XG4gICAgcmV0XG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmNvbXBhcmVcbiAgIyBjb21wYXJlIHR3byBvYmplY3RzL2FycmF5cy92YWx1ZXMgZm9yIHN0cmljdCBlcXVhbGl0eVxuICBjb21wYXJlOiAob2JqMSwgb2JqMikgLT5cbiAgICBfLmlzRXF1YWwgb2JqMSwgb2JqMlxuXG4gICMgIyMgW09KXShvai5odG1sKS5jbG9uZVxuICAjIGNvcHkgYWxsIG9mIHRoZSB2YWx1ZXMgKHJlY3Vyc2l2ZWx5KSBmcm9tIG9uZSBvYmplY3QgdG8gYW5vdGhlci5cbiAgY2xvbmU6IChkYXRhKSAtPlxuICAgIF8uY2xvbmVEZWVwIGRhdGEgdHJ1ZVxuXG4gICMgIyMgW09KXShvai5odG1sKS5zZXJpYWxpemVcbiAgIyBDb252ZXJ0IGFuIG9iamVjdCB0byBhIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIG9iamVjdFxuICBzZXJpYWxpemU6IChkYXRhKSAtPlxuICAgIHJldCA9ICcnXG4gICAgZnVuYy50cnlFeGVjIC0+XG4gICAgICByZXQgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxuICAgICAgcmV0dXJuXG4gICAgcmV0IG9yICcnXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmRlc2VyaWFsaXplXG4gICMgQ29udmVydCBhIEpTT04gc3RyaW5nIHRvIGFuIG9iamVjdFxuICBkZXNlcmlhbGl6ZTogKGRhdGEpIC0+XG4gICAgcmV0ID0ge31cbiAgICBpZiBkYXRhXG4gICAgICBmdW5jLnRyeUV4ZWMgLT5cbiAgICAgICAgcmV0ID0gJC5wYXJzZUpTT04oZGF0YSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHJldCA9IHt9ICBpZiBpc01ldGhvZC5udWxsT3JFbXB0eShyZXQpXG4gICAgcmV0XG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLnBhcmFtc1xuICAjIENvbnZlcnQgYW4gb2JqZWN0IHRvIGEgZGVsaW1pdGVkIGxpc3Qgb2YgcGFyYW1ldGVycyAobm9ybWFsbHkgcXVlcnktc3RyaW5nIHBhcmFtZXRlcnMpXG4gIHBhcmFtczogKGRhdGEsIGRlbGltaXRlciA9ICcmJykgLT5cbiAgICByZXQgPSAnJ1xuICAgIGlmIGRlbGltaXRlciBpcyAnJidcbiAgICAgIGZ1bmMudHJ5RXhlYyAtPlxuICAgICAgICByZXQgPSAkLnBhcmFtKGRhdGEpXG4gICAgICAgIHJldHVyblxuXG4gICAgZWxzZVxuICAgICAgZWFjaCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2VhY2gnXG4gICAgICBlYWNoIGRhdGEsICh2YWwsIGtleSkgLT5cbiAgICAgICAgcmV0ICs9IGRlbGltaXRlciAgaWYgcmV0Lmxlbmd0aCA+IDBcbiAgICAgICAgcmV0ICs9IGtleSArICc9JyArIHZhbFxuICAgICAgICByZXR1cm5cblxuICAgIHRvLnN0cmluZyByZXRcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuZXh0ZW5kXG4gICMgY29weSB0aGUgcHJvcGVydGllcyBvZiBvbmUgb2JqZWN0IHRvIGFub3RoZXIgb2JqZWN0XG4gIGV4dGVuZDogKGRlc3RPYmosIHNyY09iaiwgZGVlcENvcHkgPSBmYWxzZSkgLT5cbiAgICByZXQgPSBkZXN0T2JqIG9yIHt9XG4gICAgaWYgZGVlcENvcHkgaXMgdHJ1ZVxuICAgICAgcmV0ID0gJC5leHRlbmQoZGVlcENvcHksIHJldCwgc3JjT2JqKVxuICAgIGVsc2VcbiAgICAgIHJldCA9ICQuZXh0ZW5kKHJldCwgc3JjT2JqKVxuICAgIHJldFxuXG5cbk9KLnJlZ2lzdGVyICdvYmplY3QnLCByZXRPYmoub2JqZWN0XG5PSi5yZWdpc3RlciAnaXNJbnN0YW5jZU9mJywgcmV0T2JqLmlzSW5zdGFuY2VPZlxuT0oucmVnaXN0ZXIgJ2NvbnRhaW5zJywgcmV0T2JqLmNvbnRhaW5zXG5PSi5yZWdpc3RlciAnY29tcGFyZScsIHJldE9iai5jb21wYXJlXG5PSi5yZWdpc3RlciAnY2xvbmUnLCByZXRPYmouY2xvbmVcbk9KLnJlZ2lzdGVyICdzZXJpYWxpemUnLCByZXRPYmouc2VyaWFsaXplXG5PSi5yZWdpc3RlciAnZGVzZXJpYWxpemUnLCByZXRPYmouZGVzZXJpYWxpemVcbk9KLnJlZ2lzdGVyICdwYXJhbXMnLCByZXRPYmoucGFyYW1zXG5PSi5yZWdpc3RlciAnZXh0ZW5kJywgcmV0T2JqLmV4dGVuZFxuXG5tb2R1bGUuZXhwb3J0cyA9IHJldE9iaiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG4gIFxuIyMjXG5BZGQgYSBwcm9wZXJ0eSB0byBhbiBvYmplY3RcbiAgXG4jIyNcbnByb3BlcnR5ID0gKG9iaiwgbmFtZSwgdmFsdWUsIHdyaXRhYmxlLCBjb25maWd1cmFibGUsIGVudW1lcmFibGUpIC0+XG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGRlZmluZSBhIHByb3BlcnR5IHdpdGhvdXQgYW4gT2JqZWN0LicgIHVubGVzcyBvYmpcbiAgdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIGEgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIHByb3BlcnR5IG5hbWUuJyAgdW5sZXNzIG5hbWU/XG4gIG9ialtuYW1lXSA9IHZhbHVlXG4gIG9ialxuXG5PSi5yZWdpc3RlciAncHJvcGVydHknLCBwcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG4gIFxuZGVsaW1pdGVkU3RyaW5nID0gKHN0cmluZywgb3B0cykgLT5cbiAgZGVmYXVsdHMgPVxuICAgIG5ld0xpbmVUb0RlbGltaXRlcjogdHJ1ZVxuICAgIHNwYWNlVG9EZWxpbWl0ZXI6IHRydWVcbiAgICByZW1vdmVEdXBsaWNhdGVzOiB0cnVlXG4gICAgZGVsaW1pdGVyOiBcIixcIlxuICAgIGluaXRTdHJpbmc6IE9KLnRvLnN0cmluZyBzdHJpbmdcblxuICByZXRPYmogPVxuICAgIGFycmF5OiBbXVxuICAgIGRlbGltaXRlZDogLT5cbiAgICAgIHJldE9iai5hcnJheS5qb2luIGRlZmF1bHRzLmRlbGltaXRlclxuXG4gICAgc3RyaW5nOiAoZGVsaW1pdGVyID0gZGVmYXVsdHMuZGVsaW1pdGVyKSAtPlxuICAgICAgcmV0ID0gJydcbiAgICAgIE9KLmVhY2ggcmV0T2JqLmFycmF5LCAodmFsKSAtPlxuICAgICAgICByZXQgKz0gZGVsaW1pdGVyICBpZiByZXQubGVuZ3RoID4gMFxuICAgICAgICByZXQgKz0gdmFsXG4gICAgICAgIHJldHVyblxuXG4gICAgICByZXRcblxuICAgIHRvU3RyaW5nOiAtPlxuICAgICAgcmV0T2JqLnN0cmluZygpXG5cbiAgICBhZGQ6IChzdHIpIC0+XG4gICAgICByZXRPYmouYXJyYXkucHVzaCBkZWZhdWx0cy5wYXJzZShzdHIpXG4gICAgICBkZWZhdWx0cy5kZWxldGVEdXBsaWNhdGVzKClcbiAgICAgIHJldE9ialxuXG4gICAgcmVtb3ZlOiAoc3RyKSAtPlxuICAgICAgcmVtb3ZlID0gKGFycmF5KSAtPlxuICAgICAgICBhcnJheS5maWx0ZXIgKGl0ZW0pIC0+XG4gICAgICAgICAgdHJ1ZSAgaWYgaXRlbSBpc250IHN0clxuXG5cbiAgICAgIHJldE9iai5hcnJheSA9IHJlbW92ZShyZXRPYmouYXJyYXkpXG4gICAgICByZXRPYmpcblxuICAgIGNvdW50OiAtPlxuICAgICAgcmV0T2JqLmFycmF5Lmxlbmd0aFxuXG4gICAgY29udGFpbnM6IChzdHIsIGNhc2VTZW5zaXRpdmUpIC0+XG4gICAgICBpc0Nhc2VTZW5zaXRpdmUgPSBPSi50by5ib29sKGNhc2VTZW5zaXRpdmUpXG4gICAgICBzdHIgPSBPSi50by5zdHJpbmcoc3RyKS50cmltKClcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpICBpZiBmYWxzZSBpcyBpc0Nhc2VTZW5zaXRpdmVcbiAgICAgIG1hdGNoID0gcmV0T2JqLmFycmF5LmZpbHRlcigobWF0U3RyKSAtPlxuICAgICAgICAoaXNDYXNlU2Vuc2l0aXZlIGFuZCBPSi50by5zdHJpbmcobWF0U3RyKS50cmltKCkgaXMgc3RyKSBvciBPSi50by5zdHJpbmcobWF0U3RyKS50cmltKCkudG9Mb3dlckNhc2UoKSBpcyBzdHJcbiAgICAgIClcbiAgICAgIG1hdGNoLmxlbmd0aCA+IDBcblxuICAgIGVhY2g6IChjYWxsQmFjaykgLT5cbiAgICAgIHJldE9iai5hcnJheS5mb3JFYWNoIGNhbGxCYWNrXG5cbiAgZGVmYXVsdHMucGFyc2UgPSAoc3RyKSAtPlxuICAgIHJldCA9IE9KLnRvLnN0cmluZyhzdHIpXG4gICAgcmV0ID0gcmV0LnJlcGxhY2UoL1xcbi9nLCBkZWZhdWx0cy5kZWxpbWl0ZXIpICB3aGlsZSByZXQuaW5kZXhPZihcIlxcblwiKSBpc250IC0xICBpZiBkZWZhdWx0cy5uZXdMaW5lVG9EZWxpbWl0ZXJcbiAgICByZXQgPSByZXQucmVwbGFjZShSZWdFeHAoXCIgXCIsIFwiZ1wiKSwgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCIgXCIpIGlzbnQgLTEgIGlmIGRlZmF1bHRzLnNwYWNlVG9EZWxpbWl0ZXJcbiAgICByZXQgPSByZXQucmVwbGFjZSgvLCwvZywgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCIsLFwiKSBpc250IC0xXG4gICAgcmV0XG5cbiAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcyA9IC0+XG4gICAgaWYgZGVmYXVsdHMucmVtb3ZlRHVwbGljYXRlc1xuICAgICAgKC0+XG4gICAgICAgIHVuaXF1ZSA9IChhcnJheSkgLT5cbiAgICAgICAgICBzZWVuID0gbmV3IFNldCgpXG4gICAgICAgICAgYXJyYXkuZmlsdGVyIChpdGVtKSAtPlxuICAgICAgICAgICAgaWYgZmFsc2UgaXMgc2Vlbi5oYXMoaXRlbSlcbiAgICAgICAgICAgICAgc2Vlbi5hZGQgaXRlbVxuICAgICAgICAgICAgICB0cnVlXG5cblxuICAgICAgICByZXRPYmouYXJyYXkgPSB1bmlxdWUocmV0T2JqLmFycmF5KVxuICAgICAgICByZXR1cm5cbiAgICAgICkoKVxuICAgIHJldHVyblxuXG4gICgoYSkgLT5cbiAgICBpZiBhLmxlbmd0aCA+IDEgYW5kIGZhbHNlIGlzIE9KLmlzLnBsYWluT2JqZWN0KG9wdHMpXG4gICAgICBPSi5lYWNoIGEsICh2YWwpIC0+XG4gICAgICAgIHJldE9iai5hcnJheS5wdXNoIHZhbCAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkodmFsKVxuICAgICAgICByZXR1cm5cblxuICAgIGVsc2UgaWYgc3RyaW5nIGFuZCBzdHJpbmcubGVuZ3RoID4gMFxuICAgICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRzXG4gICAgICBkZWxpbWl0ZWRTdHJpbmcgPSBkZWZhdWx0cy5wYXJzZShzdHJpbmcpXG4gICAgICBkZWZhdWx0cy5pbml0U3RyaW5nID0gZGVsaW1pdGVkU3RyaW5nXG4gICAgICByZXRPYmouYXJyYXkgPSBkZWxpbWl0ZWRTdHJpbmcuc3BsaXQoZGVmYXVsdHMuZGVsaW1pdGVyKVxuICAgIGRlZmF1bHRzLmRlbGV0ZUR1cGxpY2F0ZXMoKVxuICAgIHJldHVyblxuICApIGFyZ3VtZW50c1xuICByZXRPYmpcblxuXG5PSi5yZWdpc3RlciAnZGVsaW1pdGVkU3RyaW5nJywgZGVsaW1pdGVkU3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGRlbGltaXRlZFN0cmluZyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuVGhpbkRPTSA9IHJlcXVpcmUgJ3RoaW5kb20nXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXG5cblxuIyMjXG5QZXJzaXN0IGEgaGFuZGxlIG9uIHRoZSBib2R5IG5vZGVcbiMjI1xuaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiBib2R5ID0gZG9jdW1lbnQuYm9keSBlbHNlIGJvZHkgPSBudWxsXG5ib2R5ID0gbmV3IFRoaW5ET00gbnVsbCwgaWQ6ICdib2R5JywgYm9keVxuYm9keS50YWdOYW1lID0gJ2JvZHknXG50aGluQm9keSA9IG5vZGVGYWN0b3J5IGJvZHksIHt9XG4gIFxuT0oucmVnaXN0ZXIgJ2JvZHknLCB0aGluQm9keVxubW9kdWxlLmV4cG9ydHMgPSB0aGluQm9keSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcblxuIyAjIGNvbXBvbmVudFxuXG5cbiMgQ3JlYXRlIGFuIEhUTUwgV2ViIENvbXBvbmVudCB0aHJvdWdoIFRoaW5Eb21cblxuIyAtIGBvcHRpb25zYCBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzdGFuZGFyZCBvcHRpb25zIHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBjb21wb25lbnRcbiMgLS0gYHJvb3ROb2RlVHlwZWA6IHRoZSB0YWcgbmFtZSBvZiB0aGUgcm9vdCBub2RlIHRvIGNyZWF0ZSwgZGVmYXVsdCA9ICdkaXYnXG4jIC0tIGBwcm9wc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIERPTSBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXG4jIC0tIGBzdHlsZXNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBDU1MgYXR0cmlidXRlcyB0byBhcHBlbmQgdG8gdGhlIHJvb3Qgbm9kZVxuIyAtLSBgZXZlbnRzYDogYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgbmFtZWQgRE9NIGV2ZW50cyAoYW5kIGNvcnJlc3BvbmRpbmcgY2FsbGJhY2sgbWV0aG9kcykgdG8gYmluZCB0byB0aGUgcm9vdCBub2RlXG4jIC0gYG93bmVyYCB0aGUgcGFyZW50IHRvIHdoaWNoIHRoZSBjb21wb25lbnQgbm9kZSB3aWxsIGJlIGFwcGVuZGVkXG4jIC0gYHRhZ05hbWVgIHRoZSBuYW1lIG9mIG9mIHRoZSBjb21wb25lbnQsIHdoaWNoIHdpbGwgYWx3YXlzIGJlIHByZWZpeGVkIHdpdGggJ3gtJ1xuY29tcG9uZW50ID0gKG9wdGlvbnMgPSBvYmoub2JqZWN0KCksIG93bmVyLCB0YWdOYW1lKSAtPlxuXG4gIGlmIG5vdCB0YWdOYW1lLnN0YXJ0c1dpdGggJ3gtJyB0aGVuIHRhZ05hbWUgPSAneC0nICsgdGFnTmFtZVxuICAjIHdlYiBjb21wb25lbnRzIGFyZSByZWFsbHkganVzdCBvcmRpbmFyeSBPSiBbZWxlbWVudF0oZWxlbWVudC5odG1sKSdzIHdpdGggYSBzcGVjaWFsIG5hbWUuXG4gICMgVW50aWwgSFRNTCBXZWIgQ29tcG9uZW50cyBhcmUgZnVsbHkgc3VwcG9ydGVkIChhbmQgT0ogaXMgcmVmYWN0b3JlZCBhY2NvcmRpbmdseSksIHRoZSBlbGVtZW50IHdpbGwgYmUgdHJlYXRlZCBhcyBhbiB1bmtub3duIGVsZW1lbnQuXG4gICMgSW4gbW9zdCBjYXNlcywgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgdGhlIGJyb3dzZXIgaXMgYWNjZXB0YWJsZSAoc2VlIGFsc28gW0hUTUwgU2VtYW50aWNzXShodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL3NlbWFudGljcy5odG1sKSksIGJ1dFxuICAjIGluIHNvbWUgY2FzZXMgdGhpcyBpcyBwcm9ibGVtYXRpYyAoZmlyc3RseSwgYmVjYXVzZSB0aGVzZSBlbGVtZW50cyBhcmUgYWx3YXlzIHJlbmRlcmVkIGlubGluZSkuXG4gICMgSW4gc3VjaCBjb25kaXRpb25zLCB0aGUgW2NvbnRyb2xzXShjb250cm9scy5odG1sKSBjbGFzcyBhbmQgbmFtZSBzcGFjZSBpcyBiZXR0ZXIgc3VpdGVkIHRvIGNsYXNzZXMgd2hpY2ggcmVxdWlyZSBjb21wbGV0ZSBjb250cm9sIChlLmcuIFtpY29uXShpY29uLmh0bWwpKS5cbiAgd2lkZ2V0ID0gbm9kZUZhY3RvcnkgdGFnTmFtZSwgb2JqLm9iamVjdCgpLCBvd25lciwgZmFsc2UgIywgb3B0aW9ucy5wcm9wcywgb3B0aW9ucy5zdHlsZXMsIG9wdGlvbnMuZXZlbnRzLCBvcHRpb25zLnRleHRcbiAgXG4gICMgU2luY2UgdGhlIGJlaGF2aW9yIG9mIHN0eWxpbmcgaXMgbm90IHdlbGwgY29udHJvbGxlZC9jb250cm9sbGFibGUgb24gdW5rbm93biBlbGVtZW50cywgaXQgaXMgbmVjZXNzYXJ5IHRvIGNyZWF0ZSBhIHJvb3Qgbm9kZSBmb3IgdGhlIGNvbXBvbmVudC5cbiAgIyBJbiBtb3N0IGNhc2VzLCBbZGl2XShkaXYuaHRtbCkgaXMgcGVyZmVjdGx5IGFjY2VwdGFibGUsIGJ1dCB0aGlzIGlzIGNvbmZpZ3VyYWJsZSBhdCB0aGUgbmFtZSBzcGFjZSBsZXZlbCBvciBhdCBydW50aW1lLlxuICByb290Tm9kZVR5cGUgPSBvcHRpb25zLnJvb3ROb2RlVHlwZSBvciBPSlsnREVGQVVMVF9DT01QT05FTlRfUk9PVF9OT0RFVFlQRSddIG9yICdkaXYnXG5cbiAgIyBgcmV0YCBpcyB0aGUgdGhlIGluc3RhbmNlIG9mIHRoZSByb290Tm9kZVR5cGUsIG5vdCB0aGUgYHdpZGdldGAgd3JhcHBlZCBpbiB0aGlzIGNsb3N1cmVcbiAgcmV0ID0gd2lkZ2V0Lm1ha2Ugcm9vdE5vZGVUeXBlLCBvcHRpb25zXG5cbiAgIyBmb3IgY29udmVuaWVuY2UgYW5kIGRlYnVnZ2luZywgcGVyc2lzdCB0aGUgdGFnTmFtZVxuICByZXQuY29tcG9uZW50TmFtZSA9IHRhZ05hbWVcblxuICAjIGByZW1vdmVgIGRvZXMsIGhvd2V2ZXIsIGJlaGF2ZSBhcyBleHBlY3RlZCBieSByZW1vdmluZyBgd2lkZ2V0YFxuICByZXQucmVtb3ZlID0gd2lkZ2V0LnJlbW92ZVxuICByZXRcblxuT0oucmVnaXN0ZXIgJ2NvbXBvbmVudCcsIGNvbXBvbmVudFxubW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5cbiMjI1xuQ3JlYXRlIGEgc2V0IG9mIEhUTUwgRWxlbWVudHMgdGhyb3VnaCBUaGluRG9tXG4jIyNcbmNvbnRyb2wgPSAob3B0aW9ucyA9IG9iai5vYmplY3QoKSwgb3duZXIsIHRhZ05hbWUpIC0+XG4gIGlmIG5vdCB0YWdOYW1lLnN0YXJ0c1dpdGggJ3ktJyB0aGVuIHRhZ05hbWUgPSAneS0nICsgdGFnTmFtZVxuXG4gIHJvb3ROb2RlVHlwZSA9IG9wdGlvbnMucm9vdE5vZGVUeXBlIG9yIE9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gb3IgJ2RpdidcblxuICByZXQgPSBub2RlRmFjdG9yeSByb290Tm9kZVR5cGUsIG9wdGlvbnMsIG93bmVyLCBmYWxzZVxuXG4gIHJldC5hZGQgJ2NvbnRyb2xOYW1lJywgdGFnTmFtZVxuXG4gIHJldFxuXG5PSi5yZWdpc3RlciAnY29udHJvbCcsIGNvbnRyb2xcbm1vZHVsZS5leHBvcnRzID0gY29udHJvbCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuVGhpbkRPTSA9IHJlcXVpcmUgJ3RoaW5kb20nXG5cbiMgIyBlbGVtZW50XG5cbmVsZW1lbnQgPSBcbiAgIyAjIyByZXN0b3JlRWxlbWVudFxuICAjIyNcbiAgUmVzdG9yZSBhbiBIVE1MIEVsZW1lbnQgdGhyb3VnaCBUaGluRG9tXG4gICMjI1xuICByZXN0b3JlRWxlbWVudDogKGVsLCB0YWcgPSBlbC5ub2RlTmFtZSkgLT5cbiAgICBub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXG4gICAgdEQgPSBuZXcgVGhpbkRPTSBudWxsLCBudWxsLCBlbFxuICAgIHRELmlzSW5ET00gPSB0cnVlXG4gICAgcmV0ID0gbm9kZUZhY3RvcnkgdERcbiAgICByZXRcblxuT0oucmVnaXN0ZXIgJ3Jlc3RvcmVFbGVtZW50JywgZWxlbWVudC5yZXN0b3JlRWxlbWVudFxuXG5PSi5yZWdpc3RlciAnaXNFbGVtZW50SW5Eb20nLCAoZWxlbWVudElkKSAtPlxuICBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSBPSi5nZXRFbGVtZW50IGVsZW1lbnRJZFxuXG5PSi5yZWdpc3RlciAnZ2V0RWxlbWVudCcsIChpZCkgLT5cbiAgaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCdcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGVsZW1lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xuXG4jICMgZnJhZ21lbnRcblxuIyBDcmVhdGUgYSBkb2N1bWVudCBmcmFnbWVudCBhbmQgcmV0dXJuIGl0IGFzIGFuIE9KIG5vZGVcbmZyYWdtZW50ID0gLT5cbiAgcmV0ID0gbnVsbFxuICBpZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xuICAgIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXG4gICAgXG4gICAgZnJhZyA9IG5ldyBUaGluRE9NIG51bGwsIG51bGwsIGZyYWdtZW50XG4gICAgZnJhZy5pc0luRE9NID0gdHJ1ZVxuICAgIHJldCA9IG5vZGVGYWN0b3J5IGZyYWdcbiAgICBcbiAgcmV0XG5cbk9KLnJlZ2lzdGVyICdmcmFnbWVudCcsIGZyYWdtZW50XG5tb2R1bGUuZXhwb3J0cyA9IGZyYWdtZW50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xuXG4jICMgZ2VuZXJpYyBub2Rlc1xuXG5jbG9zZWQgPSBbXG4gICdhYmJyJ1xuICAnYWNyb255bSdcbiAgJ2FwcGxldCdcbiAgJ2FydGljbGUnXG4gICdhc2lkZSdcbiAgJ2F1ZGlvJ1xuICAnYidcbiAgJ2JkbydcbiAgJ2JpZydcbiAgJ2Jsb2NrcXVvdGUnXG4gICdidXR0b24nXG4gICdjYW52YXMnXG4gICdjYXB0aW9uJ1xuICAnY2VudGVyJ1xuICAnY2l0ZSdcbiAgJ2NvZGUnXG4gICdjb2xncm91cCdcbiAgJ2RhdGFsaXN0J1xuICAnZGQnXG4gICdkZWwnXG4gICdkZXRhaWxzJ1xuICAnZGZuJ1xuICAnZGlyJ1xuICAnZGl2J1xuICAnZGwnXG4gICdkdCdcbiAgJ2VtJ1xuICAnZmllbGRzZXQnXG4gICdmaWdjYXB0aW9uJ1xuICAnZmlndXJlJ1xuICAnZm9udCdcbiAgJ2Zvb3RlcidcbiAgJ2gxJ1xuICAnaDInXG4gICdoMydcbiAgJ2g0J1xuICAnaDUnXG4gICdoNidcbiAgJ2hlYWQnXG4gICdoZWFkZXInXG4gICdoZ3JvdXAnXG4gICdodG1sJ1xuICAnaSdcbiAgJ2lmcmFtZSdcbiAgJ2lucydcbiAgJ2tiZCdcbiAgJ2xhYmVsJ1xuICAnbGVnZW5kJ1xuICAnbGknXG4gICdtYXAnXG4gICdtYXJrJ1xuICAnbWVudSdcbiAgJ21ldGVyJ1xuICAnbmF2J1xuICAnbm9mcmFtZXMnXG4gICdub3NjcmlwdCdcbiAgJ29iamVjdCdcbiAgJ29wdGdyb3VwJ1xuICAnb3B0aW9uJ1xuICAnb3V0cHV0J1xuICAncCdcbiAgJ3ByZSdcbiAgJ3Byb2dyZXNzJ1xuICAncSdcbiAgJ3JwJ1xuICAncnQnXG4gICdydWJ5J1xuICAncydcbiAgJ3NhbXAnXG4gICdzZWN0aW9uJ1xuICAnc21hbGwnXG4gICdzcGFuJ1xuICAnc3RyaWtlJ1xuICAnc3Ryb25nJ1xuICAnc3R5bGUnXG4gICdzdWInXG4gICdzdW1tYXJ5J1xuICAnc3VwJ1xuICAndGJvZHknXG4gICd0ZCdcbiAgJ3Rmb290J1xuICAndGgnXG4gICd0aW1lJ1xuICAndGl0bGUnXG4gICd0cidcbiAgJ3R0J1xuICAndSdcbiAgJ3ZhcidcbiAgJ3ZpZGVvJ1xuICAneG1wJ1xuXVxub3BlbiA9ICdhcmVhIGJhc2UgY29sIGNvbW1hbmQgY3NzIGVtYmVkIGhyIGltZyBrZXlnZW4gbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyJy5zcGxpdCAnICdcbmFsbCA9IGNsb3NlZC5jb25jYXQgb3BlblxuXG5leHBvcnRzID0ge31cbiMgcmVnaXN0ZXIgc2VtYW50aWMvc3RydWN0dXJhbCBhbGlhc2VzXG5mb3IgbG9vcE5hbWUgaW4gYWxsXG4gIGRvICh0YWcgPSBsb29wTmFtZSkgLT5cbiAgICBtZXRob2QgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuXG4gICAgICBkZWZhdWx0cyA9XG4gICAgICAgIHByb3BzOiB7fVxuICAgICAgICBzdHlsZXM6IHt9XG4gICAgICAgIGV2ZW50czoge31cblxuICAgICAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9uc1xuICAgICAgcmV0ID0gbm9kZUZhY3RvcnkgdGFnLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XG5cbiAgICAgIHJldFxuICAgIE9KLm5vZGVzLnJlZ2lzdGVyIHRhZywgbWV0aG9kXG4gICAgZXhwb3J0c1t0YWddID0gbWV0aG9kXG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5cbiMjI1xuQ3JlYXRlIGFuIE9KIElucHV0IE9iamVjdCB0aHJvdWdoIE9KLm5vZGVzLmlucHV0XG4jIyNcbmlucHV0ID0gKG9wdGlvbnMgPSBPSi5vYmplY3QoKSwgb3duZXIpIC0+XG4gIGlmIG5vdCBvd25lciB0aGVuIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhbiBpbnB1dCB3aXRob3V0IGEgcGFyZW50J1xuICBpZiBub3Qgb3B0aW9ucy5wcm9wcyBvciBub3Qgb3B0aW9ucy5wcm9wcy50eXBlIHRoZW4gdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIGFuIGlucHV0IHdpdGhvdXQgYW4gaW5wdXQgdHlwZSdcbiAgcmV0ID0gb3duZXIubWFrZSAnaW5wdXQnLCBvcHRpb25zXG4gIHJldC5hZGQgJ2lucHV0TmFtZScsIG9wdGlvbnMucHJvcHMudHlwZVxuICByZXRcbiAgICBcbk9KLnJlZ2lzdGVyICdpbnB1dCcsIGlucHV0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHV0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbiQgPSByZXF1aXJlICdqcXVlcnknXG5cbiMgIyBkb21cblxuXG4jIEV4dGVuZCBhbiBvYmplY3Qgd2l0aCBPSiBET00gbWV0aG9kcyBhbmQgcHJvcGVydGllc1xuXG4jIC0gYEBlbGAgT2JqZWN0IHRvIGV4dGVuZFxuIyAtIGBwYXJlbnRgIHBhcmVudCBvYmplY3QgdG8gd2hpY2ggYEBlbGAgd2lsbCBiZSBhcHBlbmRlZFxuY2xhc3MgTm9kZVxuICBcbiAgI3BhcmVudDogcmVxdWlyZSgnLi9ib2R5JylcbiAgXG4gIGNvbnN0cnVjdG9yOiAoQGVsLCBAcGFyZW50KSAtPlxuICAgIGVuYWJsZWQgPSB0cnVlXG4gICAgQHRhZ05hbWUgPSBAZWwudGFnTmFtZVxuICAgIEBbJyQnXSA9ICQoQGVsLmdldCgpKVxuICAgIEBbJzAnXSA9IEBlbC5nZXQoKVxuXG4gIGFwcGVuZDogKHBhcmFtcy4uLikgLT5cbiAgICBAZWwuYXBwZW5kIHBhcmFtcy4uLlxuXG4gIHByZXBlbmQ6IChwYXJhbXMuLi4pIC0+XG4gICAgQGVsLnByZXBlbmQgcGFyYW1zLi4uXG5cbiAgcmVtb3ZlOiAocGFyYW1zLi4uKSAtPlxuICAgIEBlbC5yZW1vdmUgcGFyYW1zLi4uXG5cbiAgY3NzOiAocGFyYW1zLi4uKSAtPlxuICAgIEBlbC5jc3MgcGFyYW1zLi4uXG5cbiAgaHRtbDogKHBhcmFtcy4uLikgLT5cbiAgICBAZWwuaHRtbCBwYXJhbXMuLi5cblxuICB0ZXh0OiAocGFyYW1zLi4uKSAtPlxuICAgIEBlbC50ZXh0IHBhcmFtcy4uLlxuXG4gIGF0dHI6IChwYXJhbXMuLi4pIC0+XG4gICAgQGVsLmF0dHIgcGFyYW1zLi4uXG5cbiAgZGF0YTogKHBhcmFtcy4uLikgLT5cbiAgICBAZWwuZGF0YSBwYXJhbXMuLi5cblxuICBnZXQ6IChwYXJhbXMuLi4pIC0+XG4gICAgQGVsLmdldCBwYXJhbXMuLi5cblxuICBhZGQ6IChrZXksIHZhbCkgLT5cbiAgICBAW2tleV0gPSB2YWxcblxuICBpc0NvbnRyb2xTdGlsbFZhbGlkOiAtPlxuICAgIGlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXG4gICAgdmFsaWQgPSBmYWxzZSBpcyBpc01ldGhvZC5udWxsT3JFbXB0eShAZWwpIGFuZCBAaXNWYWxpZCgpXG4gICAgdGhyb3cgbmV3IEVycm9yICdlbCBpcyBudWxsLiBFdmVudCBiaW5kaW5ncyBtYXkgbm90IGhhdmUgYmVlbiBHQ2QuJyAgaWYgZmFsc2UgaXMgdmFsaWRcbiAgICB2YWxpZFxuXG4gICMgIyMgaXNWYWxpZFxuICBpc1ZhbGlkOiAtPlxuICAgIEBlbCBhbmQgKEBlbC5lbCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50IG9yIEBlbC5lbCBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpXG5cbiAgIyAjIyBhZGRDbGFzc1xuICAjIEFkZCBhIENTUyBjbGFzcyB0byBhbiBlbGVtZW50XG5cbiAgIyAtIGBuYW1lYCB0aGUgbmFtZSBvZiB0aGUgY2xhc3MgdG8gYWRkXG4gIGFkZENsYXNzOiAobmFtZSkgLT5cbiAgICBAWyckJ10uYWRkQ2xhc3MgbmFtZSBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgQFxuXG4gICMgIyMgYmluZFxuICAjIEJpbmQgYW4gYWN0aW9uIHRvIGEgalF1ZXJ5IGVsZW1lbnQncyBldmVudC5cbiAgYmluZDogKGV2ZW50TmFtZSwgZXZlbnQpIC0+XG4gICAgQG9uIGV2ZW50TmFtZSwgZXZlbnRcblxuXG4gICMgIyMga2V5Ym9hcmRcbiAgIyBCaW5kIGFuIGV2ZW50IHRvIGEga2V5LCB3aGVuIHByZXNzZWQgaW4gdGhpcyBjb250cm9sLlxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcbiAga2V5Ym9hcmQ6IChrZXlzLCBldmVudCkgLT5cbiAgICAjTW91c2V0cmFwLmJpbmQga2V5cywgQGVsW2V2ZW50XSAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIEBcblxuICAjICMjIGRpc2FibGVcbiAgIyBEaXNhYmxlIHRoZSBlbGVtZW50LlxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcbiAgZGlzYWJsZTogPT5cbiAgICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgICBlbmFibGVkID0gZmFsc2VcbiAgICAgIEBhdHRyICdkaXNhYmxlZCcsICdkaXNhYmxlZCdcbiAgICAgIEBhZGRDbGFzcyAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnXG4gICAgQFxuXG4gICMgIyMgZW1wdHlcbiAgIyBFbXB0eSB0aGUgZWxlbWVudC5cbiAgIyBUaGUgT0ogb2JqZWN0IChmb3IgY2hhaW5pbmcpXG4gIGVtcHR5OiAtPlxuICAgIEBbJyQnXS5lbXB0eSgpIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBAXG5cbiAgIyAjIyBlbmFibGVcbiAgIyBFbmFibGUgdGhlIGVsZW1lbnQuXG4gICMgVGhlIE9KIG9iamVjdCAoZm9yIGNoYWluaW5nKVxuICBlbmFibGU6IC0+XG4gICAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgICAgZW5hYmxlZCA9IHRydWVcbiAgICAgIEByZW1vdmVBdHRyICdkaXNhYmxlZCdcbiAgICAgIEByZW1vdmVDbGFzcyAnZGlzYWJsZWQnXG4gICAgQFxuXG4gICMgIyMgZ2V0SWRcbiAgIyBHZXQgdGhlIERPTSBFbGVtZW50IElEIG9mIHRoaXMgb2JqZWN0LlxuICBnZXRJZDogLT5cbiAgICBpZCA9IEBbMF0uaWQgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBpZFxuXG4gIGhhc0NsYXNzOiAocGFyYW1zLi4uKSAtPlxuICAgIEBbJyQnXS5oYXNDbGFzcyBwYXJhbXMuLi5cblxuICAjICMjIGhpZGVcbiAgIyBNYWtlIHRoZSBlbGVtZW50IGludmlzaWJsZS5cbiAgaGlkZTogLT5cbiAgICBAY3NzICdkaXNwbGF5JywgJ25vbmUnICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgQFxuXG4gICMgIyMgbGVuZ3RoXG4gICMgR2V0IHRoZSBsZW5ndGggb2YgdGhpcyBlbGVtZW50LlxuICBsZW5ndGg6IC0+XG4gICAgdG8gPSByZXF1aXJlICcuLi90b29scy90bydcbiAgICBsZW4gPSAwXG4gICAgbGVuID0gdG8ubnVtYmVyKEBbJyQnXS5sZW5ndGgpICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgbGVuXG4gIFxuICAjICMjIG9uXG4gIG9uOiAoZXZlbnROYW1lLCBldmVudCkgLT5cbiAgICBAWyckJ10ub24gZXZlbnROYW1lLCBldmVudCAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIEBcblxuICAjICMjIG9mZlxuICBvZmY6IChldmVudE5hbWUsIGV2ZW50KSAtPlxuICAgIEBbJyQnXS5vZmYgZXZlbnROYW1lLCBldmVudCAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIEBlbFxuXG4gIHByb3A6IChwYXJhbXMuLi4pIC0+XG4gICAgQFsnJCddLnByb3AgcGFyYW1zLi4uXG5cbiAgIyAjIyByZW1vdmVcbiAgIyBSZW1vdmUgdGhlIG5vZGUgZnJvbSB0aGUgRE9NXG4gIHJlbW92ZTogLT5cbiAgICBpZiBAZWwgYW5kIEBbJyQnXVxuICAgICAgQFsnJCddLnJlbW92ZSgpXG5cbiAgICAgICMgU2V0IHRoZSB2YWx1ZSBvZiBAZWwgdG8gbnVsbCB0byBndWFyYW50ZWUgdGhhdCBpc0NvbnRyb2xTdGlsbFZhbGlkIHdpbGwgYmUgY29ycmVjdFxuICAgICAgQGVsID0gbnVsbFxuICAgICAgQFsnJCddID0gbnVsbFxuICAgICAgQFswXSA9IG51bGxcbiAgICBudWxsXG5cbiAgIyAjIyByZW1vdmVDbGFzc1xuICAjIFJlbW92ZSBhIENTUyBjbGFzcyBmcm9tIGFuIGVsZW1lbnQuXG4gIHJlbW92ZUNsYXNzOiAobmFtZSkgLT5cbiAgICBAWyckJ10ucmVtb3ZlQ2xhc3MgbmFtZSAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIEBcblxuICAjICMjIHJlbW92ZVByb3BcbiAgIyBSZW1vdmUgYSBwcm9wZXJ0eSBmcm9tIGFuIGVsZW1lbnQuIGpRdWVyeSBkaXN0aW5ndWlzaGVzIGJldHdlZW4gJ3Byb3BzJyBhbmQgJ2F0dHInOyBoZW5jZSAyIG1ldGhvZHMuXG4gIHJlbW92ZVByb3A6IChuYW1lKSAtPlxuICAgIEBbJyQnXS5yZW1vdmVQcm9wIG5hbWUgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBAXG5cbiAgIyAjIyByZW1vdmVBdHRyXG4gICMgUmVtb3ZlIGEgcHJvcGVydHkgZnJvbSBhbiBlbGVtZW50LiBqUXVlcnkgZGlzdGluZ3Vpc2hlcyBiZXR3ZWVuICdwcm9wcycgYW5kICdhdHRyJzsgaGVuY2UgMiBtZXRob2RzLlxuICByZW1vdmVBdHRyOiAobmFtZSkgLT5cbiAgICBAWyckJ10ucmVtb3ZlQXR0ciBuYW1lICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgQFxuXG4gICMgIyMgcmVxdWlyZWRcbiAgIyBNYXJrIHRoZSByZXF1aXJlZCBzdGF0dXMgb2YgdGhlIGVsZW1lbnQuXG4gIHJlcXVpcmVkOiAodHJ1dGh5LCBhZGRMYWJlbCkgLT5cbiAgICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgICB0byA9IHJlcXVpcmUgJy4uL3Rvb2xzL3RvJ1xuICAgICAgc3dpdGNoIHRvLmJvb2wodHJ1dGh5KVxuICAgICAgICB3aGVuIHRydWVcbiAgICAgICAgICBAYXR0ciAncmVxdWlyZWQnLCB0cnVlXG4gICAgICAgICAgQGFkZENsYXNzICdyZXF1aXJlZCdcbiAgICAgICAgd2hlbiBmYWxzZVxuICAgICAgICAgIEByZW1vdmVQcm9wICdyZXF1aXJlZCdcbiAgICAgICAgICBAcmVtb3ZlQ2xhc3MgJ3JlcXVpcmVkJ1xuICAgIEBbJyQnXVxuICBcbiAgIyAjIyBzaG93XG4gICMgTWFrZSB0aGUgZWxlbWVudCB2aXNpYmxlLlxuICBzaG93OiAtPlxuICAgIEBbJyQnXS5zaG93KCkgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBAXG5cbiAgIyAjIyB0b2dnbGVcbiAgIyBUb2dnbGUgdmlzaWJpbGl0eVxuICB0b2dnbGU6IC0+XG4gICAgQFsnJCddLnRvZ2dsZSgpICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgXG4gIEB0b2dnbGVDbGFzczogKHBhcmFtcy4uLiktPlxuICAgIEBbJyQnXS50b2dnbGVDbGFzcyBwYXJhbXMuLi4gIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBAXG5cbiAgIyAjIyB0b2dnbGVFbmFibGVcbiAgIyBUb2dnbGUgdGhlIGVsZW1lbnQncyBlbmFibGVkIHN0YXRlLlxuICB0b2dnbGVFbmFibGU6IC0+XG4gICAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgICAgaWYgZW5hYmxlZFxuICAgICAgICBAZGlzYWJsZSgpXG4gICAgICBlbHNlXG4gICAgICAgIEBlbmFibGUoKVxuICAgIEBcblxuICAjICMjIHRyaWdnZXJcbiAgIyBUcmlnZ2VyIGFuIGV2ZW50IGJvdW5kIHRvIGEgalF1ZXJ5IGVsZW1lbnQuXG4gIHRyaWdnZXI6IChldmVudE5hbWUsIGV2ZW50T3B0cykgLT5cbiAgICBAWyckJ10udHJpZ2dlciBldmVudE5hbWUsIGV2ZW50T3B0cyAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIEBlbFxuXG4gICMgIyMgdW5iaW5kXG4gICMgV3JhcHBlciBhcm91bmQgYG9mZmBcbiAgdW5iaW5kOiAoZXZlbnROYW1lLCBldmVudCkgLT5cbiAgICBAb2ZmIGV2ZW50TmFtZSwgZXZlbnRcblxuICAjICMjIHZhbFxuICAjIEdldCBvciBzZXQgdGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50LlxuICB2YWw6ICh2YWx1ZSkgLT5cbiAgICByZXQgPSBAXG4gICAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgICAgaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMSBhbmQgZmFsc2UgaXMgaXNNZXRob2QubnVsbE9yVW5kZWZpbmVkKHZhbHVlKVxuICAgICAgICBAWyckJ10udmFsIHZhbHVlXG4gICAgICBlbHNlXG4gICAgICAgIHJldCA9IEBbJyQnXS52YWwoKVxuICAgIHJldFxuICAgIFxuICAjICMjIHZhbHVlT2ZcbiAgIyB3cmFwcGVyIGFyb3VuZCBgdmFsYFxuICB2YWx1ZU9mOiAtPlxuICAgIEB2YWwoKVxuXG4gICMgIyMgdG9TdHJpbmdcbiAgIyB3cmFwcGVyIGFyb3VuZCBgdmFsYFxuICB0b1N0cmluZzogLT5cbiAgICBAdmFsKClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblRoaW5ET00gPSByZXF1aXJlICd0aGluZG9tJ1xuTm9kZSA9IHJlcXVpcmUgJy4vbm9kZSdcblxuI2Nsb3NlZCA9ICdhIGFiYnIgYWNyb255bSBhZGRyZXNzIGFwcGxldCBhcnRpY2xlIGFzaWRlIGF1ZGlvIGIgYmRvIGJpZyBibG9ja3F1b3RlIGJvZHkgYnV0dG9uIGNhbnZhcyBjYXB0aW9uIGNlbnRlciBjaXRlIGNvZGUgY29sZ3JvdXAgY29tbWFuZCBkYXRhbGlzdCBkZCBkZWwgZGV0YWlscyBkZm4gZGlyIGRpdiBkbCBkdCBlbSBlbWJlZCBmaWVsZHNldCBmaWdjYXB0aW9uIGZpZ3VyZSBmb250IGZvb3RlciBmb3JtIGZyYW1lc2V0IGgxIGgyIGgzIGg0IGg1IGg2IGhlYWQgaGVhZGVyIGhncm91cCBodG1sIGkgaWZyYW1lIGlucyBrZXlnZW4ga2JkIGxhYmVsIGxlZ2VuZCBsaSBtYXAgbWFyayBtZW51IG1ldGVyIG5hdiBub2ZyYW1lcyBub3NjcmlwdCBvYmplY3Qgb2wgb3B0Z3JvdXAgb3B0aW9uIG91dHB1dCBwIHByZSBwcm9ncmVzcyBxIHJwIHJ0IHJ1YnkgcyBzYW1wIHNjcmlwdCBzZWN0aW9uIHNlbGVjdCBzbWFsbCBzb3VyY2Ugc3BhbiBzdHJpa2Ugc3Ryb25nIHN0eWxlIHN1YiBzdW1tYXJ5IHN1cCB0YWJsZSB0Ym9keSB0ZCB0ZXh0YXJlYSB0Zm9vdCB0aCB0aGVhZCB0aW1lIHRpdGxlIHRyIHR0IHUgdWwgdmFyIHZpZGVvIHdiciB4bXAnLnNwbGl0ICcgJ1xuI29wZW4gPSAnYXJlYSBiYXNlIGJyIGNvbCBjb21tYW5kIGNzcyAhRE9DVFlQRSBlbWJlZCBociBpbWcgaW5wdXQga2V5Z2VuIGxpbmsgbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyJy5zcGxpdCAnICdcbiNcbiNuZXN0YWJsZU5vZGVOYW1lcyA9IFtcbiMgICdkaXYnXG4jICAnc3BhbidcbiMgICdoMSdcbiMgICdoMidcbiMgICdoMydcbiMgICdoNCdcbiMgICdoNSdcbiMgICdoNidcbiMgICdwJ1xuIyAgJ2ZpZWxkc2V0J1xuIyAgJ3NlbGVjdCdcbiMgICdvbCdcbiMgICd1bCdcbiMgICd0YWJsZSdcbiNdXG4jXG4jI1RoaXMgbGlzdCBpcyBub3QgeWV0IGV4aGF1c3RpdmUsIGp1c3QgZXhjbHVkZSB0aGUgb2J2aW91c1xuI25vbk5lc3RhYmxlTm9kZXMgPSBbXG4jICAnbGknXG4jICAnbGVnZW5kJ1xuIyAgJ3RyJ1xuIyAgJ3RkJ1xuIyAgJ29wdGlvbidcbiMgICdib2R5J1xuIyAgJ2hlYWQnXG4jICAnc291cmNlJ1xuIyAgJ3Rib2R5J1xuIyAgJ3Rmb290J1xuIyAgJ3RoZWFkJ1xuIyAgJ2xpbmsnXG4jICAnc2NyaXB0J1xuI11cbiNcbiNub2RlTmFtZXMgPSBbXG4jICAnYSdcbiMgICdiJ1xuIyAgJ2JyJ1xuIyAgJ2J1dHRvbidcbiMgICdkaXYnXG4jICAnZW0nXG4jICAnZmllbGRzZXQnXG4jICAnZm9ybSdcbiMgICdoMSdcbiMgICdoMidcbiMgICdoMydcbiMgICdoNCdcbiMgICdoNSdcbiMgICdoNidcbiMgICdpJ1xuIyAgJ2ltZydcbiMgICdpbnB1dCdcbiMgICdsYWJlbCdcbiMgICdsZWdlbmQnXG4jICAnbGknXG4jICAnbmF2J1xuIyAgJ29sJ1xuIyAgJ29wdGlvbidcbiMgICdwJ1xuIyAgJ3NlbGVjdCdcbiMgICdzcGFuJ1xuIyAgJ3N0cm9uZydcbiMgICdzdXAnXG4jICAnc3ZnJ1xuIyAgJ3RhYmxlJ1xuIyAgJ3Rib2R5J1xuIyAgJ3RkJ1xuIyAgJ3RleHRhcmVhJ1xuIyAgJ3RoJ1xuIyAgJ3RoZWFkJ1xuIyAgJ3RyJ1xuIyAgJ3VsJ1xuI11cblxuY2xhc3MgTm9kZUZhY3RvcnlcbiAgXG4gIG9qTm9kZTogbnVsbFxuICBcbiAgQGdldDogKGlkLCB0YWdOYW1lID0gJ2RpdicpIC0+XG4gICAgcmV0ID0gbnVsbFxuICAgIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgaWRcbiAgICBpZiBlbFxuICAgICAgdGhpbkVsID0gT0oucmVzdG9yZUVsZW1lbnQgZWwsIHRhZ05hbWVcbiAgICBpZiB0aGluRWxcbiAgICAgIHJldCA9IG5ldyBOb2RlRmFjdG9yeSBudWxsLCBudWxsLCBudWxsLCBmYWxzZSwgdGhpbkVsXG5cbiAgICByZXRcbiAgXG4gIF9tYWtlQWRkOiAodGFnTmFtZSwgY291bnQpIC0+XG4gICAgKG9wdHMpID0+XG4gICAgICBtZXRob2QgPSBPSi5ub2Rlc1t0YWdOYW1lXSBvciBPSi5jb21wb25lbnRzW3RhZ05hbWVdIG9yIE9KLmNvbnRyb2xzW3RhZ05hbWVdIG9yIE9KLmlucHV0c1t0YWdOYW1lXVxuICAgICAgaWYgbWV0aG9kXG4gICAgICAgIG51ID0gbWV0aG9kIG9wdHMsIEBvak5vZGVcbiAgICAgIGVsc2VcbiAgICAgICAgbnUgPSBPSi5jb21wb25lbnQgbnVsbCwgQG9qTm9kZSwgdGFnTmFtZVxuICAgICAgI3JldCA9IG5ldyBOb2RlRmFjdG9yeSBudSwgQHRoaW5Ob2RlLCBjb3VudFxuICAgICAgbnVcbiAgXG4gIF9tYWtlVW5pcXVlSWQ6IChjb3VudCkgLT5cbiAgICBpZiBPSi5HRU5FUkFURV9VTklRVUVfSURTXG4gICAgICBjb3VudCArPSAxXG4gICAgICBpZiBjb3VudCA8PSBAb3duZXIuY291bnQgdGhlbiBjb3VudCA9IEBvd25lci5jb3VudCArIDFcbiAgICAgIEBvd25lci5jb3VudCA9IGNvdW50XG5cbiAgICAgIGlmIG5vdCBAb2pOb2RlLmdldElkKClcbiAgICAgICAgaWQgPSBAb3duZXIuZ2V0SWQoKSBvciAnJ1xuICAgICAgICBpZCArPSBAb2pOb2RlLnRhZ05hbWUgKyBjb3VudFxuICAgICAgICBAb2pOb2RlLmF0dHIgJ2lkJywgaWRcbiAgICByZXR1cm5cbiAgXG4gIF9iaW5kRXZlbnRzOiAtPlxuICAgIGlmIEBvak5vZGUgdGhlbiBfLmZvck93biBAb3B0aW9ucy5ldmVudHMsICh2YWwsIGtleSkgPT5cbiAgICAgIGlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXG4gICAgICBpZiBpc01ldGhvZC5tZXRob2QgdmFsXG4gICAgICAgIGNhbGxiYWNrID0gKGV2ZW50Li4uKSAtPiB2YWwgZXZlbnQuLi5cbiAgICAgICAgQG9qTm9kZS4kLm9uIGtleSwgY2FsbGJhY2tcbiAgICAgICAgQG9qTm9kZS5hZGQga2V5LCBjYWxsYmFja1xuICAgICAgICBudWxsXG4gIFxuICBjb25zdHJ1Y3RvcjogKEB0YWcsIEBvcHRpb25zLCBAb3duZXIsIEB0aGluTm9kZSA9IG51bGwpIC0+XG4gICAgaWYgQHRhZyBhbmQgbm90IEB0aGluTm9kZVxuICAgICAgQHRoaW5Ob2RlID0gbmV3IFRoaW5ET00gQHRhZywgQG9wdGlvbnMucHJvcHNcbiAgICAgIEB0aGluTm9kZS5hZGQgJ3RhZ05hbWUnLCBAdGFnXG4gICAgICBAdGhpbk5vZGUuY3NzIEBvcHRpb25zLnN0eWxlc1xuICAgICAgaWYgQG9wdGlvbnMudGV4dCB0aGVuIEB0aGluTm9kZS50ZXh0IEBvcHRpb25zLnRleHRcbiAgICBcbiAgICBpZiBAb3duZXJcbiAgICAgIEBtYWtlKClcbiAgXG4gIGFkZE1ha2VNZXRob2Q6IChjb3VudCkgLT5cbiAgICBtZXRob2RzID0gT0oub2JqZWN0KClcbiAgICBAb2pOb2RlLm1ha2UgPSAodGFnTmFtZSwgb3B0cykgPT5cbiAgICAgIG1ldGhvZCA9IG1ldGhvZHNbdGFnTmFtZV1cbiAgICAgIGlmIG5vdCBtZXRob2RcbiAgICAgICAgbWV0aG9kID0gQF9tYWtlQWRkIHRhZ05hbWUsIEBvak5vZGUsIGNvdW50XG4gICAgICAgIG1ldGhvZHNbdGFnTmFtZV0gPSBtZXRob2RcbiAgICAgIG1ldGhvZCBvcHRzXG4gICAgQG9qTm9kZVxuXG4gIG1ha2U6IC0+XG5cbiAgICBAb2pOb2RlID0gbnVsbFxuXG4gICAgaWYgQHRoaW5Ob2RlPy5pc0Z1bGx5SW5pdCB0aGVuIEBvak5vZGUgPSBAdGhpbk5vZGVcbiAgXG4gICAgIyAyOiBJZiB0aGUgZWxlbWVudCBoYXMgbmV2ZXIgYmVlbiBpbml0aWFsaXplZCwgY29udGludWVcbiAgICBlbHNlXG4gICAgICAjIDM6IEFzIGxvbmcgYXMgdGhlIGVsZW1lbnQgaXNuJ3QgdGhlIGJvZHkgbm9kZSwgY29udGludWVcbiAgICAgICMgaWYgZWwudGFnTmFtZSBpc250ICdib2R5J1xuICAgICAgIyA0OiBFeHRlbmQgdGhlIGVsZW1lbnQgd2l0aCBzdGFuZGFyZCBqUXVlcnkgQVBJIG1ldGhvZHNcbiAgICAgIEBvak5vZGUgPSBuZXcgTm9kZSBAdGhpbk5vZGUsIEBvd25lclxuICAgICAgY291bnQgPSAoQG93bmVyLmNvdW50ICsgMSkgfHwgMVxuICAgICAgIyA1OiBJZiB0aGUgbm9kZSBpc24ndCBpbiB0aGUgRE9NLCBhcHBlbmQgaXQgdG8gdGhlIHBhcmVudFxuICAgICAgIyBUaGlzIGFsc28gYWNjb21tb2RhdGVzIGRvY3VtZW50IGZyYWdtZW50cywgd2hpY2ggYXJlIG5vdCBpbiB0aGUgRE9NIGJ1dCBhcmUgcHJlc3VtZWQgdG8gYmUgc291bmQgdW50aWwgcmVhZHkgZm9yIG1hbnVhbCBpbnNlcnRpb25cbiAgICAgIGlmIEB0aGluTm9kZS50YWdOYW1lIGlzbnQgJ2JvZHknIGFuZCBub3QgQHRoaW5Ob2RlLmlzSW5ET00gYW5kIG5vdCBAb2pOb2RlLmlzSW5ET01cbiAgICAgICAgQF9tYWtlVW5pcXVlSWQgY291bnRcbiAgICAgICAgQG93bmVyLmFwcGVuZCBAb2pOb2RlWzBdXG4gICAgICAgICMgNjogQmluZCBhbnkgZGVmaW5lZCBldmVudHMgYWZ0ZXIgdGhlIG5vZGUgaXMgaW4gdGhlIERPTVxuICAgICAgICBAX2JpbmRFdmVudHMoKVxuICAgICAgICBcbiAgICAgIEB0aGluTm9kZS5pc0luRE9NID0gdHJ1ZVxuICAgICAgQG9qTm9kZS5pc0luRE9NID0gdHJ1ZVxuXG4gICAgICAjIDc6IENyZWF0ZSB0aGUgYWxsIGltcG9ydGFudCAnbWFrZScgbWV0aG9kXG4gICAgICBAYWRkTWFrZU1ldGhvZCBjb3VudFxuXG4gICAgICAjIDg6IFByZXZlbnQgZHVwbGljYXRlIGZhY3RvcnkgZXh0ZW5zaW9uIGJ5IHNldHRpbmcgaXMgaW5pdCA9IHRydWVcbiAgICAgIEBvak5vZGUuaXNGdWxseUluaXQgPSB0cnVlXG5cbiAgICAgICMgOTogaWYgdGhlIG5vZGUgc3VwcG9ydHMgaXQsIGNhbGwgZmluYWxpemVcbiAgICAgIGZpbmFsaXplID0gXy5vbmNlIEBvak5vZGUuZmluYWxpemUgb3IgT0oubm9vcFxuICAgICAgQG9qTm9kZS5maW5hbGl6ZSA9IGZpbmFsaXplXG4gICAgICBmaW5hbGl6ZSBAb2pOb2RlXG4gICAgIyAxMDogUmV0dXJuIHRoZSBleHRlbmRlZCBlbGVtZW50XG4gICAgQG9qTm9kZVxuXG5nZXROb2RlRnJvbUZhY3RvcnkgPSAodGFnLCBvcHRpb25zLCBvd25lciwgaXNDYWxsZWRGcm9tRmFjdG9yeSwgbm9kZSkgLT5cbiAgaWYgT0ouaXMuc3RyaW5nIHRhZ1xuICAgIGZhY3RvcnkgPSBuZXcgTm9kZUZhY3RvcnkgdGFnLCBvcHRpb25zLCBvd25lclxuICBlbHNlXG4gICAgZmFjdG9yeSA9IG5ldyBOb2RlRmFjdG9yeSBudWxsLCBvcHRpb25zLCB7fSwgdGFnXG4gIGZhY3Rvcnkub2pOb2RlXG5cblxuT0oucmVnaXN0ZXIgJ25vZGVGYWN0b3J5JywgZ2V0Tm9kZUZyb21GYWN0b3J5XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0Tm9kZUZyb21GYWN0b3J5XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5cbiMgIyBhXG5ub2RlTmFtZSA9ICdhJ1xuXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICBpZDogJydcbiAgICAgIGNsYXNzOiAnJ1xuICAgICAgdGV4dDogJydcbiAgICAgIGhyZWY6ICdqYXZhU2NyaXB0OnZvaWQoMCk7J1xuICAgICAgdHlwZTogJydcbiAgICAgIHRpdGxlOiAnJ1xuICAgICAgcmVsOiAnJ1xuICAgICAgbWVkaWE6ICcnXG4gICAgICB0YXJnZXQ6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICB0b2dnbGVTdGF0ZSA9ICdvZmYnXG5cbiAgdG9nZ2xlID0gLT5cbiAgICBpZiB0b2dnbGVTdGF0ZSBpcyAnb24nXG4gICAgICB0b2dnbGVTdGF0ZSA9ICdvZmYnXG4gICAgZWxzZSB0b2dnbGVTdGF0ZSA9ICdvbicgIGlmIHRvZ2dsZVN0YXRlIGlzICdvZmYnXG4gICAgcmV0dXJuXG5cbiAgIyBDbGljayBiaW5kaW5nXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jbGljayBpc250IE9KLm5vb3BcbiAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxuICAgICAgdG9nZ2xlKClcbiAgICAgIHJldFZhbCA9IGNsaWNrIGV2ZW50Li4uXG4gICAgICBpZiBkZWZhdWx0cy5ocmVmIGlzICcjJyB0aGVuIHJldFZhbCA9IGZhbHNlXG4gICAgICByZXRWYWxcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSBuZXdDbGlja1xuICBlbHNlXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gdG9nZ2xlXG5cbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcblxuICByZXRcblxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxuXG5cbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbnRvID0gcmVxdWlyZSAnLi4vdG9vbHMvdG8nXG4jICMgYnJcblxubm9kZU5hbWUgPSAnYnInXG5cbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczoge31cbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcbiAgICBudW1iZXI6IDFcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgaSA9IDBcbiAgd2hpbGUgaSA8IHRvLm51bWJlciBkZWZhdWx0cy5udW1iZXJcbiAgICAjIEluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGJycywgaXQgaXMgZGVzaXJhYmxlIHRvIG9ubHkgZ2V0IHRoZSBsYXN0IG9uZSBvdXRcbiAgICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxuXG4gICAgaSArPSAxXG5cbiBcblxuICByZXRcblxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxuXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5cbiMgIyBmb3JtXG5cbm5vZGVOYW1lID0gJ2Zvcm0nXG5cbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIGFjdGlvbjogJydcbiAgICAgIG1ldGhvZDogJydcbiAgICAgIG5hbWU6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XG5cbiAgcmV0LmFkZCAndmFsaWRhdG9yJywgcmV0LiQudmFsaWRhdGUoXG4gICAgaGlnaGxpZ2h0OiAoZWxlbWVudCkgLT5cbiAgICAgICRlbG0gPSAkKGVsZW1lbnQpXG4gICAgICAkZWxtLmF0dHIgJ09KX2ludmFsaWQnLCAnMSdcbiAgICAgICRlbG0uYW5pbWF0ZSBiYWNrZ3JvdW5kQ29sb3I6ICdyZWQnXG4gICAgICBudWxsXG5cbiAgICB1bmhpZ2hsaWdodDogKGVsZW1lbnQpIC0+XG4gICAgICAkZWxtID0gJChlbGVtZW50KVxuICAgICAgaWYgJGVsbS5hdHRyKCdPSl9pbnZhbGlkJykgaXMgJzEnXG4gICAgICAgICRlbG0uY3NzICdiYWNrZ3JvdW5kLWNvbG9yJywgJ3llbGxvdydcbiAgICAgICAgJGVsbS5hdHRyICdPSl9pbnZhbGlkJywgJzAnXG4gICAgICAgIHNldFRpbWVvdXQgKC0+XG4gICAgICAgICAgJGVsbS5hbmltYXRlIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50J1xuICAgICAgICApLCA1MDBcbiAgICAgIG51bGxcbiAgKVxuXG4gIHJldC5hZGQgJ2lzRm9ybVZhbGlkJywgLT5cbiAgICByZXQuJC52YWxpZCgpIGFuZCAobm90IHJldC52YWxpZGF0b3IuaW52YWxpZEVsZW1lbnRzKCkgb3IgcmV0LnZhbGlkYXRvci5pbnZhbGlkRWxlbWVudHMoKS5sZW5ndGggaXMgMClcblxuIFxuXG4gIHJldFxuXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxubW9kdWxlLmV4cG9ydHMgPSBub2RlXG5cblxuXG5cbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXG5cbiMgIyBpbnB1dFxuXG5ub2RlTmFtZSA9ICdpbnB1dCdcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgdmFsdWU6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG4gICAgICBjaGFuZ2U6IE9KLm5vb3BcbiAgICAgIGZvY3Vzb3V0OiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgaWYgbm90IGRlZmF1bHRzLnByb3BzLnR5cGUgb3Igbm90IGVudW1zLmlucHV0VHlwZXNbZGVmYXVsdHMucHJvcHMudHlwZV1cbiAgICB0aHJvdyBuZXcgRXJyb3IgJ05vIG1hdGNoaW5nIGlucHV0IHR5cGUgZm9yIHsnICsgZGVmYXVsdHMucHJvcHMudHlwZSArICd9IGNvdWxkIGJlIGZvdW5kLidcbiAgdGhpc1R5cGUgPSBlbnVtcy5pbnB1dFR5cGVzW2RlZmF1bHRzLnByb3BzLnR5cGVdXG5cbiAgc3luY1ZhbHVlID0gLT5cbiAgICBzd2l0Y2ggdGhpc1R5cGVcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5jaGVja2JveFxuICAgICAgICByZXQudmFsdWUgPSByZXQuJC5pcyAnOmNoZWNrZWQnXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMucmFkaW9cbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LiQuZmluZCgnOmNoZWNrZWQnKS52YWwoKVxuICAgICAgZWxzZVxuICAgICAgICByZXQudmFsdWUgPSByZXQudmFsKClcbiAgICBkZWZhdWx0cy5wcm9wcy52YWx1ZSA9IHJldC52YWx1ZSAgICBcbiAgICByZXQudmFsdWVcblxuICAjIyNcbiAgICBDbGljayBiaW5kaW5nLiBJZiB0aGUgY2FsbGVyIGRlZmluZWQgYSBjbGljayBoYW5kbGVyLFxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcbiAgICB0aGVuIGNhbGwgdGhlIGRlZmluZWQgY2xpY2sgaGFuZGxlciB3aXRoIHRoZSBsYXRlc3QgdmFsdWUuXG4gICMjI1xuICBvbGRDbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xuICBpZiBvbGRDbGljayBhbmQgb2xkQ2xpY2sgaXNudCBPSi5ub29wXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XG4gICAgICBzeW5jVmFsdWUoKVxuICAgICAgb2xkQ2xpY2sgcmV0LnZhbHVlLCBldmVudC4uLlxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXG5cbiAgIyMjXG4gICAgQ2hhbmdlIGJpbmRpbmcuIElmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGNoYW5nZSBoYW5kbGVyLFxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcbiAgICB0aGVuIGNhbGwgdGhlIGRlZmluZWQgY2hhbmdlIGhhbmRsZXIgd2l0aCB0aGUgbGF0ZXN0IHZhbHVlLlxuICAjIyNcbiAgb2xkQ2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxuICBpZiBvbGRDaGFuZ2UgYW5kIG9sZENoYW5nZSBpc250IE9KLm5vb3BcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XG4gICAgICBzeW5jVmFsdWUoKVxuICAgICAgb2xkQ2hhbmdlIHJldC52YWx1ZSwgZXZlbnQuLi5cbiAgICBkZWZhdWx0cy5ldmVudHMuY2hhbmdlID0gbmV3Q2hhbmdlXG5cbiAgIyMjXG4gICAgT24gRm9jdXMgT3V0IGJpbmRpbmcuIEFsd2F5cyB1c2UgdGhlIGV2ZW50IHRvIHVwZGF0ZSB0aGUgaW50ZXJuYWxcbiAgICB2YWx1ZSBvZiB0aGUgY29udHJvbDsgYW5kIGlmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGZvY3Vzb3V0IGV2ZW50LFxuICAgIHdyYXAgaXQgYW5kIGludm9rZSBpdCB3aXRoIHRoZSBsYXRlc3QgdmFsdWVcbiAgIyMjXG4gIG9sZEZvY3Vzb3V0ID0gZGVmYXVsdHMuZXZlbnRzLmZvY3Vzb3V0XG4gIG5ld0ZvY3Vzb3V0ID0gKGV2ZW50Li4uKSAtPlxuICAgIHN5bmNWYWx1ZSgpXG4gICAgaWYgb2xkRm9jdXNvdXQgYW5kIG9sZEZvY3Vzb3V0IGlzbnQgT0oubm9vcFxuICAgICAgb2xkRm9jdXNvdXQgcmV0LnZhbHVlLCBldmVudC4uLlxuXG4gIGRlZmF1bHRzLmV2ZW50cy5mb2N1c291dCA9IG5ld0ZvY3Vzb3V0XG5cblxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxuICByZXQudmFsdWUgPSBkZWZhdWx0cy5wcm9wcy52YWx1ZVxuICByZXRcblxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcblxuIyAjIG9sXG5cbm5vZGVOYW1lID0gJ29sJ1xuXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6IHt9XG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XG5cblxuIFxuXG4gIHJldFxuXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuXG4jICMgc2VsZWN0XG5cbm5vZGVOYW1lID0gJ3NlbGVjdCdcblxubm9kZSA9IChvcHRpb25zLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICBzZWxlY3RlZDogJydcbiAgICAgIG11bHRpcGxlOiBmYWxzZVxuICAgIHN0eWxlczoge31cbiAgICB2YWx1ZXM6IFtdXG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcbiAgICAgIGNoYW5nZTogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHZhbHVlID0gJydcbiAgdmFsdWVzID0gW11cbiAgaGFzRW1wdHkgPSBmYWxzZVxuXG4gIHN5bmNWYWx1ZSA9IC0+XG4gICAgdmFsdWUgPSByZXQudmFsKClcblxuICAjIENsaWNrIGJpbmRpbmdcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxuICAgIGNsaWNrID0gZGVmYXVsdHMuZXZlbnRzLmNsaWNrXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XG4gICAgICByZXR2YWwgPSBjbGljayBldmVudC4uLlxuICAgICAgc3luY1ZhbHVlKClcbiAgICAgIHJldHZhbFxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXG5cbiAgIyBDaGFuZ2UgYmluZGluZ1xuICBpZiBkZWZhdWx0cy5ldmVudHMuY2hhbmdlIGlzbnQgT0oubm9vcFxuICAgIGNoYW5nZSA9IGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2VcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XG4gICAgICByZXR2YWwgPSBjaGFuZ2UgZXZlbnQuLi5cbiAgICAgIHN5bmNWYWx1ZSgpXG4gICAgICByZXR2YWxcbiAgICBkZWZhdWx0cy5ldmVudHMuY2hhbmdlID0gbmV3Q2hhbmdlXG5cbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcblxuICByZXQuYWRkICdzZWxlY3RlZERhdGEnLCAocHJvcE5hbWUpIC0+XG4gICAgcmV0ID0gJydcbiAgICBpZiByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKSBhbmQgcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF1cbiAgICAgIGRhdGFzZXQgPSByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVswXS5kYXRhc2V0XG4gICAgICByZXQgPSBkYXRhc2V0W3Byb3BOYW1lXSAgaWYgZGF0YXNldFxuICAgIHJldFxuXG4gIHJldC5hZGQgJ3NlbGVjdGVkVGV4dCcsIC0+XG4gICAgcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudGV4dCgpXG5cbiAgcmV0LmFkZCAnc2VsZWN0ZWRWYWwnLCAtPlxuICAgIHZhbHVlID0gcmV0LnZhbCgpXG4gICAgdmFsdWVcblxuICByZXQuYWRkICdhZGRPcHRpb24nLCAodmFsdWUsIHRleHQgPSB2YWx1ZSwgc2VsZWN0ZWQgPSBmYWxzZSwgZGlzYWJsZWQgPSBmYWxzZSkgLT5cbiAgICBpc0VtcHR5ID0gXy5pc0VtcHR5IHZhbHVlXG4gICAgYWRkID0gZmFsc2VcbiAgICBpZiBpc0VtcHR5IGFuZCBmYWxzZSBpcyBoYXNFbXB0eVxuICAgICAgaGFzRW1wdHkgPSB0cnVlXG4gICAgICBhZGQgPSB0cnVlXG4gICAgaWYgZmFsc2UgaXMgYWRkIGFuZCBmYWxzZSBpcyBpc0VtcHR5IHRoZW4gYWRkID0gdHJ1ZVxuICAgIGlmIGFkZFxuICAgICAgdmFsID1cbiAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICBwcm9wczpcbiAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgIGlmIHNlbGVjdGVkXG4gICAgICAgIHZhbC5zZWxlY3RlZCA9IHNlbGVjdGVkXG4gICAgICBpZiBkaXNhYmxlZFxuICAgICAgICB2YWwuZGlzYWJsZWQgPSBkaXNhYmxlZFxuICAgICAgb3B0aW9uID0gcmV0Lm1ha2UgJ29wdGlvbicsIHZhbFxuICAgICAgb3B0aW9uXG5cbiAgcmV0LmFkZCAnYWRkT3B0aW9ucycsIChvcHRpb25zKSAtPlxuICAgIHZhbHVlcyA9IF8udW5pb24gdmFsdWVzLCBvcHRpb25zXG4gICAgT0ouZWFjaCBvcHRpb25zLCAoKHZhbCkgLT5cbiAgICAgIHZhbHVlID0gcmV0LmFkZE9wdGlvbih2YWwpXG4gICAgICB2YWx1ZXMucHVzaCB2YWx1ZVxuICAgICksIGZhbHNlXG4gICAgdmFsdWVzXG5cbiAgcmV0LmFkZCAncmVzZXRPcHRpb25zJywgKHZhbHVlcykgLT5cbiAgICByZXQuZW1wdHkoKVxuICAgIHZhbHVlcyA9IHZhbHVlc1xuICAgIHJldC5hZGRPcHRpb25zIHZhbHVlc1xuICAgIHJldFxuXG4gIHJldC5hZGQgJ3JlbW92ZU9wdGlvbicsICh2YWx1ZVRvUmVtb3ZlKSAtPlxuICAgIHZhbHVlcy5zcGxpY2UgdmFsdWVzLmluZGV4T2YodmFsdWVUb1JlbW92ZSksIDEgI3JlbW92ZXMgdGhlIGl0ZW0gZnJvbSB0aGUgbGlzdFxuICAgIHNlbGVjdENvbnRyb2wgPSByZXRbMF1cbiAgICBpID0gMFxuXG4gICAgd2hpbGUgaSA8IHNlbGVjdENvbnRyb2wubGVuZ3RoXG4gICAgICBzZWxlY3RDb250cm9sLnJlbW92ZSBpICBpZiBzZWxlY3RDb250cm9sLm9wdGlvbnNbaV0udmFsdWUgaXMgdmFsdWVUb1JlbW92ZVxuICAgICAgaSsrXG4gICAgbnVsbFxuXG5cblxuICBpZiBkZWZhdWx0cy52YWx1ZXMubGVuZ3RoID4gMFxuICAgIHJldC5hZGRPcHRpb25zIGRlZmF1bHRzLnZhbHVlc1xuXG4gXG5cbiAgcmV0XG5cbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuYXJyYXkyRCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FycmF5MkQnXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuSnNvblRvVGFibGUgPSByZXF1aXJlICcuLi90b29scy9Kc29uVG9UYWJsZSdcblxuIyAjIHRhYmxlXG5cbm5vZGVOYW1lID0gJ3RhYmxlJ1xuXG4jIyNcbkNyZWF0ZSBhbiBIVE1MIHRhYmxlLiBQcm92aWRlcyBoZWxwZXIgbWV0aG9kcyB0byBjcmVhdGUgQ29sdW1ucyBhbmQgQ2VsbHMuXG4jIyNcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuXG4gICMgIyMgb3B0aW9uc1xuICBkZWZhdWx0cyA9XG4gICAgIyAjIyMgZGF0YVxuICAgICMgb3B0aW9uYWwgYXJyYXkgb2Ygb2JqZWN0cy4gaWYgcHJvdmlkZWQgd2lsbCBnZW5lcmF0ZSB0YWJsZSBhdXRvbWF0aWNhbGx5LlxuICAgIGRhdGE6IG51bGxcbiAgICAjICMjIyBwcm9wc1xuICAgICMgb3B0aW9uYWwgcHJvcGVydGllcyB0byBhcHBseSB0byB0YWJsZSByb290IG5vZGVcbiAgICBwcm9wczpcbiAgICAgIGNlbGxwYWRkaW5nOiAwXG4gICAgICBjZWxsc3BhY2luZzogMFxuICAgICAgYWxpZ246ICcnXG4gICAgICB3aWR0aDogJydcbiAgICAgIGNlbGxhbGlnbjogJ2xlZnQnXG4gICAgICBjZWxsdmFsaWduOiAndG9wJ1xuICAgICAgY2xhc3M6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czoge31cbiAgICAjICMjIyBjZWxsc1xuICAgICMgb3B0aW9uYWwgcHJvcGVydGllcyB0byBhcHBseSB0byBpbmRpdmlkdWFsIGNlbGxzXG4gICAgY2VsbHM6XG4gICAgICBjbGFzczogJydcbiAgICAgIGFsaWduOiAnJ1xuICAgICAgJ3ZlcnRpY2FsLWFsaWduJzogJydcbiAgICAgIGNlbGxwYWRkaW5nOiAnJ1xuICAgICAgbWFyZ2luOiAnJ1xuICAgICMgIyMjIHRoZWFkXG4gICAgIyBvcHRpb25hbCBvcHRpb25zIG9iamVjdCB0byBwYXNzIGludG8gdGhlYWQgY3JlYXRpb25cbiAgICB0aGVhZDoge31cbiAgICAjICMjIyB0Ym9keVxuICAgICMgb3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdG8gcGFzcyBpbnRvIHRib2R5IGNyZWF0aW9uXG4gICAgdGJvZHk6IHt9XG5cbiAgICBmaXJzdEFsaWduUmlnaHQ6IGZhbHNlXG4gICAgb2RkQWxpZ25SaWdodDogZmFsc2VcblxuICByb3dzID0gW11cbiAgY2VsbHMgPSBhcnJheTJEKClcbiAgY29sdW1uQ291bnQgPSAwXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XG4gXG5cbiAgdGJvZHkgPSBudWxsXG4gIHRoZWFkID0gbnVsbFxuICB0aGVhZFJvdyA9IG51bGxcblxuICAjICMjIyBpbml0XG4gICMgaW50ZXJuYWwgbWV0aG9kIGZvciBvbmUgdGltZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgdGFibGVcbiAgaW5pdCA9IF8ub25jZSAtPlxuICAgIGlmIGRlZmF1bHRzLmRhdGFcbiAgICAgIGoydCA9IG5ldyBKc29uVG9UYWJsZSBkZWZhdWx0cy5kYXRhXG4gICAgICB0YmxTdHIgPSBqMnQudGFibGVcbiAgICBpZiB0YmxTdHJcbiAgICAgIGpUYmwgPSAkIHRibFN0clxuXG4gICAgICBqSGVhZCA9IGpUYmwuZmluZCAndGhlYWQnXG4gICAgICByZXQuJC5hcHBlbmQgakhlYWRcbiAgICAgIHRoZWFkID0gZWwucmVzdG9yZUVsZW1lbnQgakhlYWRbMF1cbiAgICAgIHRoZWFkUm93ID0gZWwucmVzdG9yZUVsZW1lbnQgdGhlYWRbMF0ucm93c1swXVxuXG4gICAgICBqQm9keSA9IGpUYmwuZmluZCAndGJvZHknXG4gICAgICByZXQuJC5hcHBlbmQgakJvZHlcbiAgICAgIHRib2R5ID0gZWwucmVzdG9yZUVsZW1lbnQgakJvZHlbMF1cblxuICAgICAgbG9hZENlbGxzKClcbiAgICBlbHNlXG4gICAgICB0aGVhZCA9IHJldC5tYWtlICd0aGVhZCcsIGRlZmF1bHRzLnRoZWFkXG4gICAgICB0aGVhZFJvdyA9IHRoZWFkLm1ha2UgJ3RyJ1xuICAgICAgdGJvZHkgPSByZXQubWFrZSAndGJvZHknLCBkZWZhdWx0cy50Ym9keVxuICAgICAgcm93cy5wdXNoIHRib2R5Lm1ha2UgJ3RyJ1xuICAgIHJldFxuXG4gICMgIyMjIGxvYWRDZWxsc1xuICAjIGludGVybmFsIG1ldGhvZCBndWFyYW50ZWVzIHRoYXQgdGFibGVzIGxvYWRlZCBmcm9tIEpTT04gYXJlIGZ1bGx5IGxvYWRlZCBpbnRvIG1lbW9yeVxuICBsb2FkQ2VsbHMgPSAoKSAtPlxuICAgIHIgPSAwXG4gICAgd2hpbGUgdGJvZHlbMF0ucm93cy5sZW5ndGggPiByXG4gICAgICBjID0gMFxuICAgICAgbWVtUm93ID0gZWwucmVzdG9yZUVsZW1lbnQgdGJvZHlbMF0ucm93c1tyXVxuICAgICAgcm93cy5wdXNoIG1lbVJvd1xuICAgICAgd2hpbGUgdGJvZHlbMF0ucm93c1tyXS5jZWxscy5sZW5ndGggPiBjXG4gICAgICAgIG1lbUNlbGwgPSBjZWxscy5nZXQgcisxLCBjKzFcbiAgICAgICAgaWYgbm90IG1lbUNlbGxcbiAgICAgICAgICBtZW1DZWxsID0gZWwucmVzdG9yZUVsZW1lbnQgdGJvZHlbMF0ucm93c1tyXS5jZWxsc1tjXVxuICAgICAgICAgIGNlbGxzLnNldCByKzEsIGMrMSwgbWVtQ2VsbFxuICAgICAgICBjICs9IDFcbiAgICAgIHIgKz0gMVxuXG4gICMgIyMjIGZpbGxNaXNzaW5nXG4gICMgaW50ZXJuYWwgbWV0aG9kIGd1YXJhbnRlZXMgdGhhdCBjZWxscyBleGlzdCBmb3IgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIHRhYmxlXG4gIGZpbGxNaXNzaW5nID0gKCkgLT5cbiAgICBjZWxscy5lYWNoIChyb3dObywgY29sTm8sIHZhbCkgLT5cbiAgICAgIGlmIG5vdCB2YWxcbiAgICAgICAgcm93ID0gcmV0LnJvdyByb3dOb1xuICAgICAgICByb3cuY2VsbCBjb2xObywge31cblxuICAjICMjIGNvbHVtblxuICAjIEFkZHMgYSBjb2x1bW4gbmFtZSB0byB0aGUgdGFibGUgaGVhZFxuICByZXQuYWRkICdjb2x1bW4nLCAoY29sTm8sIGNvbE5hbWUpIC0+XG4gICAgcmV0LmluaXQoKVxuICAgIGNvbHVtbkNvdW50ICs9IDFcbiAgICB0aCA9IG51bGxcbiAgICBpID0gMFxuICAgIHdoaWxlIHRoZWFkWzBdLnJvd3NbMF0uY2VsbHMubGVuZ3RoIDwgY29sTm9cbiAgICAgIG5hdGl2ZVRoID0gdGhlYWRbMF0ucm93c1swXS5jZWxsc1tpXVxuICAgICAgaWYgbm90IG5hdGl2ZVRoXG4gICAgICAgIHRoID0gdGhlYWRSb3cubWFrZSAndGgnLCB7fVxuICAgICAgZWxzZVxuICAgICAgICB0aCA9IGVsLnJlc3RvcmVFbGVtZW50IG5hdGl2ZVRoLCAndGgnXG4gICAgICBpICs9IDFcbiAgICBpZiBub3QgdGhcbiAgICAgIG5hdGl2ZVRoID0gdGhlYWRbMF0ucm93c1swXS5jZWxsc1tjb2xOby0xXVxuICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudCBuYXRpdmVUaCwgJ3RoJ1xuICAgIHRoLnRleHQgY29sTmFtZVxuICAgIHRoXG5cbiAgIyAjIyByb3dcbiAgIyBBZGRzIGEgbmV3IHJvdyAodHIpIHRvIHRoZSB0YWJsZSBib2R5XG4gIHJldC5hZGQgJ3JvdycsIChyb3dObywgb3B0cykgLT5cbiAgICByb3cgPSByb3dzW3Jvd05vLTFdXG5cbiAgICBpZiBub3Qgcm93XG4gICAgICB3aGlsZSByb3dzLmxlbmd0aCA8IHJvd05vXG4gICAgICAgIHJvdyA9IHRib2R5Lm1ha2UgJ3RyJywge31cbiAgICAgICAgcm93cy5wdXNoIHJvd1xuXG4gICAgaWYgbm90IHJvdy5jZWxsXG4gICAgICByb3cuYWRkICdjZWxsJywgKGNvbE5vLCBvcHRzKSAtPlxuICAgICAgICBjZWxsID0gT0oubm9kZXMudGQgb3B0cywgcm93XG4gICAgICAgIGNlbGxzLnNldCByb3dObywgY29sTm8sIGNlbGxcbiAgICAgICAgY2VsbFxuXG4gICAgcm93XG5cbiAgIyAjIyBjZWxsXG4gICMgQWRkcyBhIGNlbGwgKHRyL3RkKSB0byB0aGUgdGFibGUgYm9keVxuICByZXQuYWRkICdjZWxsJywgKHJvd05vLCBjb2xObywgb3B0cykgLT5cbiAgICBpZiByb3dObyA8IDEgdGhlbiByb3dObyA9IDFcbiAgICBpZiBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcbiAgICBpZiBjb2x1bW5Db3VudCA+IDAgYW5kIGNvbE5vLTEgPiBjb2x1bW5Db3VudCB0aGVuIHRocm93IG5ldyBFcnJvciAnQSBjb2x1bW4gbmFtZSBoYXMgbm90IGJlZW4gZGVmaW5lZCBmb3IgdGhpcyBwb3NpdGlvbiB7JyArIHJvd05vICsgJ3gnICsgY29sTm8gKyAnfS4nXG5cbiAgICByb3cgPSByZXQucm93IHJvd05vXG5cbiAgICBjZWxsID0gY2VsbHMuZ2V0IHJvd05vLCBjb2xOb1xuXG4gICAgaWYgbm90IGNlbGxcbiAgICAgIGkgPSAwXG4gICAgICB3aGlsZSBpIDwgY29sTm9cbiAgICAgICAgaSArPSAxXG4gICAgICAgIGlmIGkgaXMgY29sTm9cbiAgICAgICAgICBudU9wdHMgPSBPSi5leHRlbmQge3Byb3BzOiBkZWZhdWx0cy5jZWxsc30sIG9wdHNcbiAgICAgICAgICBjZWxsID0gcm93LmNlbGwgY29sTm8sIG51T3B0c1xuICAgICAgICBlbHNlXG4gICAgICAgICAgdHJ5Q2VsbCA9IGNlbGxzLmdldCByb3dObywgaVxuICAgICAgICAgIGlmIG5vdCB0cnlDZWxsXG4gICAgICAgICAgICB0cnlDZWxsID0gIHJvdy5jZWxsIGksIHByb3BzOiBkZWZhdWx0cy5jZWxsc1xuXG4gICAgY2VsbFxuXG4gICMgIyMgRmluYWxpemVcbiAgIyBGaW5hbGl6ZSBndWFyYW50ZWVzIHRoYXQgdGhlYWQgYW5kIHRib2R5IGFuZCBjcmVhdGVkIHdoZW4gdGhlIG5vZGUgaXMgZnVsbHkgaW5zdGFudGlhdGVkXG4gIGluaXQoKVxuXG4gICMgIyMgVEhlYWRcbiAgIyBFeHBvc2UgdGhlIGludGVybmFsIHRoZWFkIG5vZGVcbiAgcmV0LmFkZCAndGhlYWQnLCB0aGVhZFxuXG4gICMgIyMgVEJvZHlcbiAgIyBFeHBvc2UgdGhlIGludGVybmFsIHRib2R5IG5vZGVcbiAgcmV0LmFkZCAndGJvZHknLCB0Ym9keVxuXG4gICAgXG5cbiAgcmV0XG5cbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXG5cbm5vZGVOYW1lID0gJ3RleHRhcmVhJ1xuXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICBuYW1lOiAnJ1xuICAgICAgcGxhY2Vob2xkZXI6ICcnXG4gICAgICB2YWx1ZTogJydcbiAgICAgIHRleHQ6ICcnXG4gICAgICBtYXhsZW5ndGg6ICcnXG4gICAgICBhdXRvZm9jdXM6IGZhbHNlXG4gICAgICBpc1JlcXVpcmVkOiBmYWxzZVxuICAgICAgcm93czogM1xuICAgICAgY29sczogMjVcbiAgICAgIGRpc2FibGVkOiBmYWxzZVxuICAgICAgcmVhZG9ubHk6IGZhbHNlXG4gICAgICBmb3JtOiAnJ1xuICAgICAgd3JhcDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICB2YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXG5cbiAgc3luY1ZhbHVlID0gLT5cbiAgICBzd2l0Y2ggZGVmYXVsdHMucHJvcHMudHlwZVxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLmNoZWNrYm94XG4gICAgICAgIHZhbHVlID0gcmV0LiQuaXMoJzpjaGVja2VkJylcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5yYWRpb1xuICAgICAgICB2YWx1ZSA9IHJldC4kLmZpbmQoJzpjaGVja2VkJykudmFsKClcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsdWUgPSByZXQudmFsKClcblxuICAjIENsaWNrIGJpbmRpbmdcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxuICAgIGNsaWNrID0gZGVmYXVsdHMuZXZlbnRzLmNsaWNrXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XG4gICAgICByZXR2YWwgPSBjbGljayBldmVudC4uLlxuICAgICAgc3luY1ZhbHVlKClcbiAgICAgIHJldHZhbFxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXG5cbiAgIyBDaGFuZ2UgYmluZGluZ1xuICBpZiBkZWZhdWx0cy5ldmVudHMuY2hhbmdlIGlzbnQgT0oubm9vcFxuICAgIGNoYW5nZSA9IGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2VcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XG4gICAgICByZXR2YWwgPSBjaGFuZ2UgZXZlbnQuLi5cbiAgICAgIHN5bmNWYWx1ZSgpXG4gICAgICByZXR2YWxcbiAgICBkZWZhdWx0cy5ldmVudHMuY2hhbmdlID0gbmV3Q2hhbmdlXG5cbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcblxuXG4gXG5cbiAgcmV0XG5cbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5cbm5vZGVOYW1lID0gJ3RoZWFkJ1xuXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6IHt9XG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG4gICAgbnVtYmVyOiAxXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcblxuICByb3dzID0gW11cbiAgY2VsbHMgPSB7fVxuICByZXQuYWRkICdjZWxsJywgKHJvd05vLCBjb2xObykgLT5cbiAgICBpbml0KClcblxuICAgIGlmIHJvd05vIDwgMSB0aGVuIHJvd05vID0gMVxuICAgIGlmIGNvbE5vIDwgMSB0aGVuIGNvbE5vID0gMVxuXG4gICAgcm93ID0gcm93c1tyb3dOby0xXVxuXG4gICAgaWYgbm90IHJvd1xuICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xuICAgICAgICByb3cgPSBPSi5ub2Rlcy50ciB7fSwgdGJvZHksIGZhbHNlXG4gICAgICAgIHJvd3MucHVzaCByb3dcblxuICAgIHRkID0gcm93WzBdLmNlbGxzW2NvbE5vXVxuXG4gICAgaWYgdGQgdGhlbiBjZWxsID0gZWwucmVzdG9yZUVsZW1lbnQgdGQsICd0ZCdcbiAgICBpZiBub3QgdGRcbiAgICAgIHdoaWxlIHJvd1swXS5jZWxscy5sZW5ndGggPCBjb2xOb1xuICAgICAgICBpZHggPSByb3dbMF0uY2VsbHMubGVuZ3RoXG4gICAgICAgIHRkID0gcm93WzBdLmNlbGxzW2lkeC0xXVxuICAgICAgICBpZiB0ZCBhbmQgaWR4IGlzIGNvbE5vXG4gICAgICAgICAgY2VsbCA9IGVsLnJlc3RvcmVFbGVtZW50IHRkLCAndGQnXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBjZWxsID0gT0oubm9kZXMudGQgcHJvcHM6IGRlZmF1bHRzLmNlbGxzLCByb3csIGZhbHNlXG5cbiAgICBpZiBub3QgY2VsbC5pc1ZhbGlkXG4gICAgICBub2RlRmFjdG9yeSBjZWxsLCByb3csIHJvd05vICsgY29sTm9cblxuICAgIGNlbGxcblxuICByZXRcblxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuXG5ub2RlTmFtZSA9ICd1bCdcblxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOiB7fVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxuXG5cbiBcblxuICByZXRcblxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsInRoaXNHbG9iYWwgPSAoaWYgKHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsKSB0aGVuIGdsb2JhbCBlbHNlIChpZiAodHlwZW9mIHNlbGYgaXNudCAndW5kZWZpbmVkJyBhbmQgc2VsZikgdGhlbiBzZWxmIGVsc2UgKGlmICh0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgYW5kIHdpbmRvdykgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkpXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXNHbG9iYWwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2J1dHRvbmlucHV0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuICAgICAgc3JjOiAnJ1xuICAgICAgYWx0OiAnJ1xuICAgICAgaGVpZ2h0OiAnJ1xuICAgICAgd2lkdGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG5cblxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdjaGVja2JveCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIGNoZWNrZWQ6IGZhbHNlXG4gICAgaW5kZXRlcm1pbmF0ZTogZmFsc2VcbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgaWYgZGVmYXVsdHMuY2hlY2tlZFxuICAgIHJldC5hdHRyICdjaGVja2VkJywgdHJ1ZVxuICBlbHNlIGlmIGRlZmF1bHRzLmluZGV0ZXJtaW5hdGVcbiAgICByZXQuYXR0ciAnaW5kZXRlcm1pbmF0ZScsIHRydWVcblxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdjb2xvcidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdkYXRlJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnZGF0ZXRpbWUnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2RhdGV0aW1lLWxvY2FsJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdlbWFpbCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgICBtdWx0aXBsZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdmaWxlJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIGFjY2VwdDogJydcbiAgICAgIG11bHRpcGxlOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2hpZGRlbidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnaW1hZ2VpbnB1dCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogJ2ltYWdlJ1xuICAgICAgc3JjOiAnJ1xuICAgICAgYWx0OiAnJ1xuICAgICAgaGVpZ2h0OiAnJ1xuICAgICAgd2lkdGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnbW9udGgnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ251bWJlcidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncGFzc3dvcmQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgbWF4bGVuZ3RoOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3JhZGlvJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIG5hbWU6ICcnXG4gICAgICB2YWx1ZTogJydcbiAgICAgIGNoZWNrZWQ6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncmFuZ2UnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgbWluOiAwXG4gICAgICBtYXg6IDEwMFxuICAgICAgdmFsdWU6IDUwXG4gICAgICBzdGVwOiAxXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncmVzZXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3NlYXJjaCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnc3VibWl0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0ZWwnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgcGF0dGVybjogJydcbiAgICAgIG1heGxlbmd0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0ZXh0aW5wdXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgYXV0b2NvbXBsZXRlOiAnb24nXG4gICAgICBhdXRvc2F2ZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0aW1lJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd1cmwnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgcGF0dGVybjogJydcbiAgICAgIG1heGxlbmd0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd3ZWVrJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiIyAjIE9KXG50aGlzR2xvYmFsID0gcmVxdWlyZSAnLi9nbG9iYWwnXG51dGlsTGliID0gcmVxdWlyZSAnanF1ZXJ5J1xubmFtZVNwYWNlTmFtZSA9ICdPSidcblxuIyMjXG5ib290IHN0cmFwIG5hbWUgbWV0aG9kIGludG8gT2JqZWN0IHByb3RvdHlwZVxuIyMjXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBPYmplY3Q6OixcbiAgZ2V0SW5zdGFuY2VOYW1lOlxuICAgIHZhbHVlOiAtPlxuICAgICAgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLnsxLH0pXFwoL1xuICAgICAgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKEBjb25zdHJ1Y3Rvci50b1N0cmluZygpKVxuICAgICAgKGlmIChyZXN1bHRzIGFuZCByZXN1bHRzLmxlbmd0aCA+IDEpIHRoZW4gcmVzdWx0c1sxXSBlbHNlICcnKVxuXG5cbiMjI1xuQW4gaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5hbWVzcGFjZSB0cmVlXG4jIyNcbk5zVHJlZSA9IHt9XG5tYWtlVGhlSnVpY2UgPSAtPlxuXG4gICMjI1xuICBJbnRlcm5hbCBuYW1lU3BhY2VOYW1lIG1ldGhvZCB0byBjcmVhdGUgbmV3ICdzdWInIG5hbWVzcGFjZXMgb24gYXJiaXRyYXJ5IGNoaWxkIG9iamVjdHMuXG4gICMjI1xuICBtYWtlTmFtZVNwYWNlID0gKHNwYWNlbmFtZSwgdHJlZSkgLT5cbiAgICAjIyNcbiAgICBUaGUgZGVyaXZlZCBpbnN0YW5jZSB0byBiZSBjb25zdHJ1Y3RlZFxuICAgICMjI1xuICAgIEJhc2UgPSAobnNOYW1lKSAtPlxuICAgICAgcHJvdG8gPSB0aGlzXG4gICAgICB0cmVlW25zTmFtZV0gPSB0cmVlW25zTmFtZV0gb3Ige31cbiAgICAgIG5zVHJlZSA9IHRyZWVbbnNOYW1lXVxuICAgICAgbWVtYmVycyA9IHt9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAnbWVtYmVycycsIHZhbHVlOiBtZW1iZXJzXG5cbiAgICAgICMjI1xuICAgICAgUmVnaXN0ZXIgKGUuZy4gJ0xpZnQnKSBhbiBPYmplY3QgaW50byB0aGUgcHJvdG90eXBlIG9mIHRoZSBuYW1lc3BhY2UuXG4gICAgICBUaGlzIE9iamVjdCB3aWxsIGJlIHJlYWRhYmxlL2V4ZWN1dGFibGUgYnV0IGlzIG90aGVyd2lzZSBpbW11dGFibGUuXG4gICAgICAjIyNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAncmVnaXN0ZXInLFxuICAgICAgICB2YWx1ZTogKG5hbWUsIG9iaiwgZW51bWVyYWJsZSkgLT5cbiAgICAgICAgICAndXNlIHN0cmljdCdcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsaWZ0IGEgbmV3IHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIG5hbWUgaXNudCAnc3RyaW5nJykgb3IgbmFtZSBpcyAnJ1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIHByb3BlcnR5IGluc3RhbmNlLicpICB1bmxlc3Mgb2JqXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9wZXJ0eSBuYW1lZCAnICsgbmFtZSArICcgaXMgYWxyZWFkeSBkZWZpbmVkIG9uICcgKyBzcGFjZW5hbWUgKyAnLicpICBpZiBwcm90b1tuYW1lXVxuXG4gICAgICAgICAgbWVtYmVyc1tuYW1lXSA9IG1lbWJlcnNbbmFtZV0gb3IgbmFtZVxuXG4gICAgICAgICAgI0d1YXJkIGFnYWluc3Qgb2JsaXRlcmF0aW5nIHRoZSB0cmVlIGFzIHRoZSB0cmVlIGlzIHJlY3Vyc2l2ZWx5IGV4dGVuZGVkXG4gICAgICAgICAgbnNUcmVlW25hbWVdID0gbnNUcmVlW25hbWVdIG9yXG4gICAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgICAgICB0eXBlOiB0eXBlb2Ygb2JqXG4gICAgICAgICAgICBpbnN0YW5jZTogKGlmIG9iai5nZXRJbnN0YW5jZU5hbWUgdGhlbiBvYmouZ2V0SW5zdGFuY2VOYW1lKCkgZWxzZSAndW5rbm93bicpXG5cbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgcHJvdG8sIG5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogb2JqXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSBpc250IGVudW1lcmFibGVcblxuICAgICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHNwYWNlbmFtZSArICcuJyArIG5hbWVcbiAgICAgICAgICBvYmpcblxuXG4gICAgICAjIyNcbiAgICAgIENyZWF0ZSBhIG5ldywgc3RhdGljIG5hbWVzcGFjZSBvbiB0aGUgY3VycmVudCBwYXJlbnQgKGUuZy4gbnNOYW1lLnRvLi4uIHx8IG5zTmFtZS5pcy4uLilcbiAgICAgICMjI1xuICAgICAgcHJvdG8ucmVnaXN0ZXIgJ21ha2VTdWJOYW1lU3BhY2UnLCAoKHN1Yk5hbWVTcGFjZSkgLT5cbiAgICAgICAgJ3VzZSBzdHJpY3QnXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIG5ldyBzdWIgbmFtZXNwYWNlIHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIHN1Yk5hbWVTcGFjZSBpc250ICdzdHJpbmcnKSBvciBzdWJOYW1lU3BhY2UgaXMgJydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdWIgbmFtZXNwYWNlIG5hbWVkICcgKyBzdWJOYW1lU3BhY2UgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKSAgaWYgcHJvdG8uc3ViTmFtZVNwYWNlXG4gICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHN1Yk5hbWVTcGFjZVxuICAgICAgICBuZXdOYW1lU3BhY2UgPSBtYWtlTmFtZVNwYWNlKHN1Yk5hbWVTcGFjZSwgbnNUcmVlKVxuICAgICAgICBuZXdOYW1lU3BhY2UucmVnaXN0ZXIgJ2NvbnN0YW50cycsIG1ha2VOYW1lU3BhY2UoJ2NvbnN0YW50cycsIG5zVHJlZSksIGZhbHNlICBpZiBzdWJOYW1lU3BhY2UgaXNudCAnY29uc3RhbnRzJ1xuICAgICAgICBwcm90by5yZWdpc3RlciBzdWJOYW1lU3BhY2UsIG5ld05hbWVTcGFjZSwgZmFsc2VcbiAgICAgICAgbmV3TmFtZVNwYWNlXG4gICAgICApLCBmYWxzZVxuICAgICAgcmV0dXJuXG5cbiAgICAjIyNcbiAgICBBbiBpbnRlcm5hbCBtZWNoYW5pc20gdG8gcmVwcmVzZW50IHRoZSBpbnN0YW5jZSBvZiB0aGlzIG5hbWVzcGFjZVxuICAgIEBjb25zdHJ1Y3RvclxuICAgIEBpbnRlcm5hbFxuICAgIEBtZW1iZXJPZiBtYWtlTmFtZVNwYWNlXG4gICAgIyMjXG4gICAgQ2xhc3MgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiBmdW5jdGlvbiAnICsgc3BhY2VuYW1lICsgJygpe30nKSgpXG4gICAgQ2xhc3M6OiA9IG5ldyBCYXNlKHNwYWNlbmFtZSlcblxuICAgICNDbGFzcy5wcm90b3R5cGUucGFyZW50ID0gQmFzZS5wcm90b3R5cGU7XG4gICAgbmV3IENsYXNzKHNwYWNlbmFtZSlcblxuICAjIyNcbiAgJ0RlcGVuZCcgYW4gT2JqZWN0IHVwb24gYW5vdGhlciBtZW1iZXIgb2YgdGhpcyBuYW1lc3BhY2UsIHVwb24gYW5vdGhlciBuYW1lc3BhY2UsXG4gIG9yIHVwb24gYSBtZW1iZXIgb2YgYW5vdGhlciBuYW1lc3BhY2VcbiAgIyMjXG4gIGRlcGVuZHNPbiA9IChkZXBlbmRlbmNpZXMsIGNhbGxCYWNrLCBpbXBvcnRzKSAtPlxuICAgICd1c2Ugc3RyaWN0J1xuICAgIHJldCA9IGZhbHNlXG4gICAgbnNNZW1iZXJzID0gbnNJbnRlcm5hbC5nZXROc01lbWJlcnMoKVxuICAgIGlmIGRlcGVuZGVuY2llcyBhbmQgZGVwZW5kZW5jaWVzLmxlbmd0aCA+IDAgYW5kIGNhbGxCYWNrXG4gICAgICBtaXNzaW5nID0gZGVwZW5kZW5jaWVzLmZpbHRlcigoZGVwZW4pIC0+XG4gICAgICAgIG5zTWVtYmVycy5pbmRleE9mKGRlcGVuKSBpcyAtMSBhbmQgKG5vdCBpbXBvcnRzIG9yIGltcG9ydHMgaXNudCBkZXBlbilcbiAgICAgIClcbiAgICAgIGlmIG1pc3NpbmcubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0ID0gdHJ1ZVxuICAgICAgICBjYWxsQmFjaygpXG4gICAgICBlbHNlXG4gICAgICAgIG5zSW50ZXJuYWwuZGVwZW5kZW50cy5wdXNoIChpbXBvcnRzKSAtPlxuICAgICAgICAgIGRlcGVuZHNPbiBtaXNzaW5nLCBjYWxsQmFjaywgaW1wb3J0c1xuXG4gICAgcmV0XG4gIG5zSW50ZXJuYWwgPSBkZXBlbmRlbnRzOiBbXVxuXG4gICMjI1xuICBGZXRjaGVzIHRoZSByZWdpc3RlcmVkIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgb24gdGhlIG5hbWVzcGFjZSBhbmQgaXRzIGNoaWxkIG5hbWVzcGFjZXNcbiAgIyMjXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBuc0ludGVybmFsLCAnZ2V0TnNNZW1iZXJzJyxcbiAgICB2YWx1ZTogLT5cbiAgICAgIHJlY3Vyc2VUcmVlID0gKGtleSwgbGFzdEtleSkgLT5cbiAgICAgICAgbWVtYmVycy5wdXNoIGxhc3RLZXkgKyAnLicgKyBrZXkgIGlmIHR5cGVvZiAoa2V5KSBpcyAnc3RyaW5nJ1xuICAgICAgICBpZiB1dGlsTGliLmlzUGxhaW5PYmplY3Qoa2V5KVxuICAgICAgICAgIE9iamVjdC5rZXlzKGtleSkuZm9yRWFjaCAoaykgLT5cbiAgICAgICAgICAgIG1lbWJlcnMucHVzaCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdHlwZW9mIChrKSBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgcmVjdXJzZVRyZWUga2V5W2tdLCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KGtleVtrXSlcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJldHVyblxuICAgICAgbWVtYmVycyA9IFtdXG4gICAgICBPYmplY3Qua2V5cyhOc1RyZWVbbmFtZVNwYWNlTmFtZV0pLmZvckVhY2ggKGtleSkgLT5cbiAgICAgICAgcmVjdXJzZVRyZWUgTnNUcmVlW25hbWVTcGFjZU5hbWVdW2tleV0sIG5hbWVTcGFjZU5hbWUgIGlmIHV0aWxMaWIuaXNQbGFpbk9iamVjdChOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG1lbWJlcnNcblxuICAjIyNcbiAgVG8gc3VwcG9ydCBkZXBlbmRlbmN5IG1hbmFnZW1lbnQsIHdoZW4gYSBwcm9wZXJ0eSBpcyBsaWZ0ZWQgb250byB0aGUgbmFtZXNwYWNlLCBub3RpZnkgZGVwZW5kZW50cyB0byBpbml0aWFsaXplXG4gICMjI1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnNJbnRlcm5hbCwgJ2FsZXJ0RGVwZW5kZW50cycsXG4gICAgdmFsdWU6IChpbXBvcnRzKSAtPlxuICAgICAgZGVwcyA9IG5zSW50ZXJuYWwuZGVwZW5kZW50cy5maWx0ZXIoKGRlcE9uKSAtPlxuICAgICAgICBmYWxzZSBpcyBkZXBPbihpbXBvcnRzKVxuICAgICAgKVxuICAgICAgbnNJbnRlcm5hbC5kZXBlbmRlbnRzID0gZGVwcyAgaWYgQXJyYXkuaXNBcnJheShkZXBzKVxuXG4gICNDcmVhdGUgdGhlIHJvb3Qgb2YgdGhlIHRyZWUgYXMgdGhlIGN1cnJlbnQgbmFtZXNwYWNlXG4gIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSA9IHt9XG4gICNEZWZpbmUgdGhlIGNvcmUgbmFtZXNwYWNlIGFuZCB0aGUgcmV0dXJuIG9mIHRoaXMgY2xhc3NcbiAgTnNPdXQgPSBtYWtlTmFtZVNwYWNlKG5hbWVTcGFjZU5hbWUsIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSlcblxuICAjIyNcbiAgQ2FjaGUgYSBoYW5kbGUgb24gdGhlIHZlbmRvciAocHJvYmFibHkgalF1ZXJ5KSBvbiB0aGUgcm9vdCBuYW1lc3BhY2VcbiAgIyMjXG4gIE5zT3V0LnJlZ2lzdGVyICc/JywgdXRpbExpYiwgZmFsc2VcblxuICAjIyNcbiAgQ2FjaGUgdGhlIHRyZWUgKHVzZWZ1bCBmb3IgZG9jdW1lbnRhdGlvbi92aXN1YWxpemF0aW9uL2RlYnVnZ2luZylcbiAgIyMjXG4gIE5zT3V0LnJlZ2lzdGVyICd0cmVlJywgTnNUcmVlW25hbWVTcGFjZU5hbWVdLCBmYWxzZVxuXG4gICMjI1xuICBDYWNoZSB0aGUgbmFtZSBzcGFjZSBuYW1lXG4gICMjI1xuICBOc091dC5yZWdpc3RlciAnbmFtZScsIG5hbWVTcGFjZU5hbWUsIGZhbHNlXG4gIE5zT3V0LnJlZ2lzdGVyICdkZXBlbmRzT24nLCBkZXBlbmRzT24sIGZhbHNlXG4gIE5zT3V0XG5cblxuIyMjXG5BY3R1YWxseSBkZWZpbmUgdGhlIE9KIE5hbWVTcGFjZVxuIyMjXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgdGhpc0dsb2JhbCwgbmFtZVNwYWNlTmFtZSxcbiAgdmFsdWU6IG1ha2VUaGVKdWljZSgpXG5cbk9KLnJlZ2lzdGVyICdnbG9iYWwnLCB0aGlzR2xvYmFsXG5cbnRoaXNEb2N1bWVudCA9IHt9XG5pZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xuICB0aGlzRG9jdW1lbnQgPSBkb2N1bWVudFxuXG5PSi5yZWdpc3RlciAnZG9jdW1lbnQnLCB0aGlzRG9jdW1lbnRcblxuT0oucmVnaXN0ZXIgJ25vb3AnLCAtPlxuXG5tb2R1bGUuZXhwb3J0cyA9IE9KIiwiICMgIyBPSiBQb3N0LUluaXRpYWxpemF0aW9uXG5cbk9KID0gcmVxdWlyZSAnLi9vaidcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cbiMgU2ltcGxlIGFycmF5IG9mIGFudGljaXBhdGVkL2tub3duIGNoaWxkIG5hbWVzcGFjZXNcbiAgXG5zdWJOYW1lU3BhY2VzID0gW1xuICAnZXJyb3JzJ1xuICAnZW51bXMnXG4gICdpbnN0YW5jZU9mJ1xuICAnbm9kZXMnXG4gICdkYidcbiAgJ2NvbXBvbmVudHMnXG4gICdjb250cm9scydcbiAgJ2lucHV0cydcbiAgJ25vdGlmaWNhdGlvbnMnXG4gICdoaXN0b3J5J1xuICAnY29va2llJ1xuICAnYXN5bmMnXG5dXG5cbiMgIyMgU3ViTmFtZVNwYWNlc1xuXG4jIFByZS1hbGxvY2F0ZSBjZXJ0YWluIGNvbW1vbiBuYW1lc3BhY2VzIHRvIGF2b2lkIGZ1dHVyZSByYWNlIGNvbmRpdGlvbnMuXG4jIFRoaXMgZG9lcyByZXF1aXJlIHRoYXQgdGhlIG9yZGVyIG9mIG9wZXJhdGlvbnMgbG9hZHMgT0ouY29mZmVlIGZpcnN0IGFuZCBvSkluaXQuY29mZmVlIHNlY29uZFxuXy5lYWNoIHN1Yk5hbWVTcGFjZXMsIChuYW1lKSAtPlxuICBPSi5tYWtlU3ViTmFtZVNwYWNlIG5hbWVcbiAgXG4jICMjIENvbmZpZ3VyYXRpb24gdmFyaWFibGVzXG5cbiMgQXV0b21hdGljYWxseSBnZW5lcmF0ZSB1bmlxdWUgSURzIGZvciBlYWNoIG5vZGUgKGRlZmF1bHQgZmFsc2UpXG5PSlsnR0VORVJBVEVfVU5JUVVFX0lEUyddID0gZmFsc2VcbiMgRGVmYXVsdCByb290IG5vZGUgZm9yIGNvbXBvbmVudHMvY29udHJvbHMgKGRlZmF1bHQgJ2RpdicpXG5PSlsnREVGQVVMVF9DT01QT05FTlRfUk9PVF9OT0RFVFlQRSddID0gJ2RpdidcbiMgV2hldGhlciB0byBob29rIGludG8gdGhlIGdsb2JhbCBvbiBlcnJvciBldmVudCB0byB3cml0ZSBlcnJvcnMgdG8gY29uc29sZSAoZGVmYXVsdCBmYWxzZSlcbk9KWydUUkFDS19PTl9FUlJPUiddID0gZmFsc2VcbiNXaGV0aGVyIHRvIGxvZyBhbGwgQUpBWCByZXF1ZXN0c1xuT0pbJ0xPR19BTExfQUpBWCddID0gZmFsc2VcbiNXaGV0aGVyIHRvIGxvZyBhbGwgQUpBWCBlcnJvcnNcbk9KWydMT0dfQUxMX0FKQVhfRVJST1JTJ10gPSBmYWxzZSIsIlxuIyMjXG5SZXR1cm4ganVzdCB0aGUga2V5cyBmcm9tIHRoZSBpbnB1dCBhcnJheSwgb3B0aW9uYWxseSBvbmx5IGZvciB0aGUgc3BlY2lmaWVkIHNlYXJjaF92YWx1ZVxudmVyc2lvbjogMTEwOS4yMDE1XG5kaXNjdXNzIGF0OiBodHRwOi8vcGhwanMub3JnL2Z1bmN0aW9ucy9hcnJheV9rZXlzXG4rICAgb3JpZ2luYWwgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0KVxuKyAgICAgIGlucHV0IGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxuKyAgIGJ1Z2ZpeGVkIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va2V2aW4udmFuem9ubmV2ZWxkLm5ldClcbisgICBpbXByb3ZlZCBieTogamRcbisgICBpbXByb3ZlZCBieTogQnJldHQgWmFtaXIgKGh0dHA6Ly9icmV0dC16YW1pci5tZSlcbisgICBpbnB1dCBieTogUFxuKyAgIGJ1Z2ZpeGVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxuZXhhbXBsZSAxOiBhcnJheV9rZXlzKCB7Zmlyc3RuYW1lOiAnS2V2aW4nLCBzdXJuYW1lOiAndmFuIFpvbm5ldmVsZCd9ICk7XG5yZXR1cm5zIDE6IHswOiAnZmlyc3RuYW1lJywgMTogJ3N1cm5hbWUnfVxuIyMjXG5hcnJheV9rZXlzID0gKGlucHV0LCBzZWFyY2hfdmFsdWUsIGFyZ1N0cmljdCkgLT5cbiAgc2VhcmNoID0gdHlwZW9mIHNlYXJjaF92YWx1ZSBpc250IFwidW5kZWZpbmVkXCJcbiAgdG1wX2FyciA9IFtdXG4gIHN0cmljdCA9ICEhYXJnU3RyaWN0XG4gIGluY2x1ZGUgPSB0cnVlXG4gIGtleSA9IFwiXCJcbiAgIyBEdWNrLXR5cGUgY2hlY2sgZm9yIG91ciBvd24gYXJyYXkoKS1jcmVhdGVkIFBIUEpTX0FycmF5XG4gIHJldHVybiBpbnB1dC5rZXlzKHNlYXJjaF92YWx1ZSwgYXJnU3RyaWN0KSAgaWYgaW5wdXQgYW5kIHR5cGVvZiBpbnB1dCBpcyBcIm9iamVjdFwiIGFuZCBpbnB1dC5jaGFuZ2Vfa2V5X2Nhc2VcbiAgZm9yIGtleSBvZiBpbnB1dFxuICAgIGlmIGlucHV0Lmhhc093blByb3BlcnR5KGtleSlcbiAgICAgIGluY2x1ZGUgPSB0cnVlXG4gICAgICBpZiBzZWFyY2hcbiAgICAgICAgaWYgc3RyaWN0IGFuZCBpbnB1dFtrZXldIGlzbnQgc2VhcmNoX3ZhbHVlXG4gICAgICAgICAgaW5jbHVkZSA9IGZhbHNlXG4gICAgICAgIGVsc2UgaW5jbHVkZSA9IGZhbHNlICB1bmxlc3MgaW5wdXRba2V5XSBpcyBzZWFyY2hfdmFsdWVcbiAgICAgIHRtcF9hcnJbdG1wX2Fyci5sZW5ndGhdID0ga2V5ICBpZiBpbmNsdWRlXG4gIHRtcF9hcnJcblxuIyMjKlxuQ29udmVydCBhIEphdmFzY3JpcHQgT2plY3QgYXJyYXkgb3IgU3RyaW5nIGFycmF5IHRvIGFuIEhUTUwgdGFibGVcbkpTT04gcGFyc2luZyBoYXMgdG8gYmUgbWFkZSBiZWZvcmUgZnVuY3Rpb24gY2FsbFxuSXQgYWxsb3dzIHVzZSBvZiBvdGhlciBKU09OIHBhcnNpbmcgbWV0aG9kcyBsaWtlIGpRdWVyeS5wYXJzZUpTT05cbmh0dHAocyk6Ly8sIGZ0cDovLywgZmlsZTovLyBhbmQgamF2YXNjcmlwdDo7IGxpbmtzIGFyZSBhdXRvbWF0aWNhbGx5IGNvbXB1dGVkXG5cbkpTT04gZGF0YSBzYW1wbGVzIHRoYXQgc2hvdWxkIGJlIHBhcnNlZCBhbmQgdGhlbiBjYW4gYmUgY29udmVydGVkIHRvIGFuIEhUTUwgdGFibGVcbnZhciBvYmplY3RBcnJheSA9ICdbe1wiVG90YWxcIjpcIjM0XCIsXCJWZXJzaW9uXCI6XCIxLjAuNFwiLFwiT2ZmaWNlXCI6XCJOZXcgWW9ya1wifSx7XCJUb3RhbFwiOlwiNjdcIixcIlZlcnNpb25cIjpcIjEuMS4wXCIsXCJPZmZpY2VcIjpcIlBhcmlzXCJ9XSc7XG52YXIgc3RyaW5nQXJyYXkgPSAnW1wiTmV3IFlvcmtcIixcIkJlcmxpblwiLFwiUGFyaXNcIixcIk1hcnJha2VjaFwiLFwiTW9zY293XCJdJztcbnZhciBuZXN0ZWRUYWJsZSA9ICdbeyBrZXkxOiBcInZhbDFcIiwga2V5MjogXCJ2YWwyXCIsIGtleTM6IHsgdGFibGVJZDogXCJ0YmxJZE5lc3RlZDFcIiwgdGFibGVDbGFzc05hbWU6IFwiY2xzTmVzdGVkXCIsIGxpbmtUZXh0OiBcIkRvd25sb2FkXCIsIGRhdGE6IFt7IHN1YmtleTE6IFwic3VidmFsMVwiLCBzdWJrZXkyOiBcInN1YnZhbDJcIiwgc3Via2V5MzogXCJzdWJ2YWwzXCIgfV0gfSB9XSc7XG5cbkNvZGUgc2FtcGxlIHRvIGNyZWF0ZSBhIEhUTUwgdGFibGUgSmF2YXNjcmlwdCBTdHJpbmdcbnZhciBqc29uSHRtbFRhYmxlID0gQ29udmVydEpzb25Ub1RhYmxlKGV2YWwoZGF0YVN0cmluZyksICdqc29uVGFibGUnLCBudWxsLCAnRG93bmxvYWQnKTtcblxuQ29kZSBzYW1wbGUgZXhwbGFuZWRcbi0gZXZhbCBpcyB1c2VkIHRvIHBhcnNlIGEgSlNPTiBkYXRhU3RyaW5nXG4tIHRhYmxlIEhUTUwgaWQgYXR0cmlidXRlIHdpbGwgYmUgJ2pzb25UYWJsZSdcbi0gdGFibGUgSFRNTCBjbGFzcyBhdHRyaWJ1dGUgd2lsbCBub3QgYmUgYWRkZWRcbi0gJ0Rvd25sb2FkJyB0ZXh0IHdpbGwgYmUgZGlzcGxheWVkIGluc3RlYWQgb2YgdGhlIGxpbmsgaXRzZWxmXG5cbkBhdXRob3IgQWZzaGluIE1laHJhYmFuaSA8YWZzaGluIGRvdCBtZWggYXQgZ21haWwgZG90IGNvbT5cblxuQGNsYXNzIENvbnZlcnRKc29uVG9UYWJsZVxuXG5AbWV0aG9kIENvbnZlcnRKc29uVG9UYWJsZVxuXG5AcGFyYW0gcGFyc2VkSnNvbiBvYmplY3QgUGFyc2VkIEpTT04gZGF0YVxuQHBhcmFtIHRhYmxlSWQgc3RyaW5nIE9wdGlvbmFsIHRhYmxlIGlkXG5AcGFyYW0gdGFibGVDbGFzc05hbWUgc3RyaW5nIE9wdGlvbmFsIHRhYmxlIGNzcyBjbGFzcyBuYW1lXG5AcGFyYW0gbGlua1RleHQgc3RyaW5nIE9wdGlvbmFsIHRleHQgcmVwbGFjZW1lbnQgZm9yIGxpbmsgcGF0dGVyblxuXG5AcmV0dXJuIHN0cmluZyBDb252ZXJ0ZWQgSlNPTiB0byBIVE1MIHRhYmxlXG4jIyNcbmNsYXNzIEpzb25Ub1RhYmxlIFxuICBcbiAgdGFibGU6IG51bGxcbiAgXG4gIGNvbnN0cnVjdG9yOiAocGFyc2VkSnNvbiwgdGFibGVJZCwgdGFibGVDbGFzc05hbWUsIGxpbmtUZXh0KSAtPlxuICAgICNQYXR0ZXJucyBmb3IgbGlua3MgYW5kIE5VTEwgdmFsdWVcbiAgICBpdGFsaWMgPSBcIjxpPnswfTwvaT5cIlxuICAgIGxpbmsgPSAoaWYgbGlua1RleHQgdGhlbiBcIjxhIGhyZWY9XFxcInswfVxcXCI+XCIgKyBsaW5rVGV4dCArIFwiPC9hPlwiIGVsc2UgXCI8YSBocmVmPVxcXCJ7MH1cXFwiPnswfTwvYT5cIilcbiAgXG4gICAgI1BhdHRlcm4gZm9yIHRhYmxlICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICBpZE1hcmt1cCA9IChpZiB0YWJsZUlkIHRoZW4gXCIgaWQ9XFxcIlwiICsgdGFibGVJZCArIFwiXFxcIlwiIGVsc2UgXCJcIilcbiAgICBjbGFzc01hcmt1cCA9IChpZiB0YWJsZUNsYXNzTmFtZSB0aGVuIFwiIGNsYXNzPVxcXCJcIiArIHRhYmxlQ2xhc3NOYW1lICsgXCJcXFwiXCIgZWxzZSBcIlwiKVxuICAgIHRibCA9IFwiPHRhYmxlIGJvcmRlcj1cXFwiMVxcXCIgY2VsbHBhZGRpbmc9XFxcIjFcXFwiIGNlbGxzcGFjaW5nPVxcXCIxXFxcIlwiICsgaWRNYXJrdXAgKyBjbGFzc01hcmt1cCArIFwiPnswfXsxfTwvdGFibGU+XCJcbiAgXG4gICAgI1BhdHRlcm5zIGZvciB0YWJsZSBjb250ZW50XG4gICAgdGggPSBcIjx0aGVhZD57MH08L3RoZWFkPlwiXG4gICAgdGIgPSBcIjx0Ym9keT57MH08L3Rib2R5PlwiXG4gICAgdHIgPSBcIjx0cj57MH08L3RyPlwiXG4gICAgdGhSb3cgPSBcIjx0aD57MH08L3RoPlwiXG4gICAgdGRSb3cgPSBcIjx0ZD57MH08L3RkPlwiXG4gICAgdGhDb24gPSBcIlwiXG4gICAgdGJDb24gPSBcIlwiXG4gICAgdHJDb24gPSBcIlwiXG4gICAgaWYgcGFyc2VkSnNvblxuICAgICAgaXNTdHJpbmdBcnJheSA9IHR5cGVvZiAocGFyc2VkSnNvblswXSkgaXMgXCJzdHJpbmdcIlxuICAgICAgaGVhZGVycyA9IHVuZGVmaW5lZFxuICAgIFxuICAgICAgIyBDcmVhdGUgdGFibGUgaGVhZGVycyBmcm9tIEpTT04gZGF0YVxuICAgICAgIyBJZiBKU09OIGRhdGEgaXMgYSBzaW1wbGUgc3RyaW5nIGFycmF5IHdlIGNyZWF0ZSBhIHNpbmdsZSB0YWJsZSBoZWFkZXJcbiAgICAgIGlmIGlzU3RyaW5nQXJyYXlcbiAgICAgICAgdGhDb24gKz0gdGhSb3cuZm9ybWF0KFwidmFsdWVcIilcbiAgICAgIGVsc2VcbiAgICAgIFxuICAgICAgICAjIElmIEpTT04gZGF0YSBpcyBhbiBvYmplY3QgYXJyYXksIGhlYWRlcnMgYXJlIGF1dG9tYXRpY2FsbHkgY29tcHV0ZWRcbiAgICAgICAgaWYgdHlwZW9mIChwYXJzZWRKc29uWzBdKSBpcyBcIm9iamVjdFwiXG4gICAgICAgICAgaGVhZGVycyA9IGFycmF5X2tleXMocGFyc2VkSnNvblswXSlcbiAgICAgICAgICBpID0gMFxuICAgICAgICAgIHdoaWxlIGkgPCBoZWFkZXJzLmxlbmd0aFxuICAgICAgICAgICAgdGhDb24gKz0gdGhSb3cuZm9ybWF0KGhlYWRlcnNbaV0pXG4gICAgICAgICAgICBpKytcbiAgICAgIHRoID0gdGguZm9ybWF0KHRyLmZvcm1hdCh0aENvbikpXG4gICAgXG4gICAgICAjIENyZWF0ZSB0YWJsZSByb3dzIGZyb20gSnNvbiBkYXRhXG4gICAgICBpZiBpc1N0cmluZ0FycmF5XG4gICAgICAgIGkgPSAwXG4gICAgICAgIHdoaWxlIGkgPCBwYXJzZWRKc29uLmxlbmd0aFxuICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChwYXJzZWRKc29uW2ldKVxuICAgICAgICAgIHRyQ29uICs9IHRyLmZvcm1hdCh0YkNvbilcbiAgICAgICAgICB0YkNvbiA9IFwiXCJcbiAgICAgICAgICBpKytcbiAgICAgIGVsc2VcbiAgICAgICAgaWYgaGVhZGVyc1xuICAgICAgICAgIHVybFJlZ0V4cCA9IG5ldyBSZWdFeHAoLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9nKVxuICAgICAgICAgIGphdmFzY3JpcHRSZWdFeHAgPSBuZXcgUmVnRXhwKC8oXmphdmFzY3JpcHQ6W1xcc1xcU10qOyQpL2cpXG4gICAgICAgICAgaSA9IDBcbiAgICAgICAgICB3aGlsZSBpIDwgcGFyc2VkSnNvbi5sZW5ndGhcbiAgICAgICAgICAgIGogPSAwXG4gICAgICAgICAgICB3aGlsZSBqIDwgaGVhZGVycy5sZW5ndGhcbiAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZWRKc29uW2ldW2hlYWRlcnNbal1dXG4gICAgICAgICAgICAgIGlzVXJsID0gdXJsUmVnRXhwLnRlc3QodmFsdWUpIG9yIGphdmFzY3JpcHRSZWdFeHAudGVzdCh2YWx1ZSlcbiAgICAgICAgICAgICAgaWYgaXNVcmwgIyBJZiB2YWx1ZSBpcyBVUkwgd2UgYXV0by1jcmVhdGUgYSBsaW5rXG4gICAgICAgICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KGxpbmsuZm9ybWF0KHZhbHVlKSlcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGlmIHZhbHVlXG4gICAgICAgICAgICAgICAgICBpZiB0eXBlb2YgKHZhbHVlKSBpcyBcIm9iamVjdFwiXG4gICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgI2ZvciBzdXBwb3J0aW5nIG5lc3RlZCB0YWJsZXNcbiAgICAgICAgICAgICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KENvbnZlcnRKc29uVG9UYWJsZShldmFsKHZhbHVlLmRhdGEpLCB2YWx1ZS50YWJsZUlkLCB2YWx1ZS50YWJsZUNsYXNzTmFtZSwgdmFsdWUubGlua1RleHQpKVxuICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQodmFsdWUpXG4gICAgICAgICAgICAgICAgZWxzZSAjIElmIHZhbHVlID09IG51bGwgd2UgZm9ybWF0IGl0IGxpa2UgUGhwTXlBZG1pbiBOVUxMIHZhbHVlc1xuICAgICAgICAgICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KGl0YWxpYy5mb3JtYXQodmFsdWUpLnRvVXBwZXJDYXNlKCkpXG4gICAgICAgICAgICAgIGorK1xuICAgICAgICAgICAgdHJDb24gKz0gdHIuZm9ybWF0KHRiQ29uKVxuICAgICAgICAgICAgdGJDb24gPSBcIlwiXG4gICAgICAgICAgICBpKytcbiAgICAgIHRiID0gdGIuZm9ybWF0KHRyQ29uKVxuICAgICAgdGJsID0gdGJsLmZvcm1hdCh0aCwgdGIpXG4gICAgQHRhYmxlID0gdGJsXG5cbm1vZHVsZS5leHBvcnRzID0gSnNvblRvVGFibGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuICBcbmFycmF5MkQgPSAoaW5pdExlbmd0aCwgaW5pdFdpZHRoKSAtPlxuICBhcnJheSA9IFtdXG4gIG1heExlbmd0aCA9IDBcbiAgbWF4V2lkdGggPSAwXG4gICAgXG4gIHJldCA9IFxuICAgIGdldDogKHJvd05vLCBjb2xObykgLT5cbiAgICAgIGV4dGVuZCByb3dObywgY29sTm9cbiAgICBzZXQ6IChyb3dObywgY29sTm8sIHZhbCkgLT5cbiAgICAgIHJldC5nZXQgcm93Tm8sIGNvbE5vXG4gICAgICByb3dJZHggPSByb3dOby0xXG4gICAgICBjb2xJZHggPSBjb2xOby0xXG4gICAgICBhcnJheVtyb3dJZHhdW2NvbElkeF0gPSB2YWxcbiAgICBlYWNoOiAoY2FsbEJhY2spIC0+XG4gICAgICBfLmVhY2ggYXJyYXksIChjb2x1bW5zLCByb3cpIC0+XG4gICAgICAgIF8uZWFjaCBhcnJheVtyb3ddLCAodmFsLCBjb2wpIC0+XG4gICAgICAgICAgcm93SWR4ID0gcm93KzFcbiAgICAgICAgICBjb2xJZHggPSBjb2wrMVxuICAgICAgICAgIGNhbGxCYWNrIHJvd0lkeCwgY29sSWR4LCB2YWxcbiAgICB3aWR0aDogKCkgLT5cbiAgICAgIG1heFdpZHRoXG4gICAgbGVuZ3RoOiAoKSAtPlxuICAgICAgbWF4TGVuZ3RoXG4gICAgICAgICBcbiAgIyMjXG4gIEd1YXJhbnRlZSB0aGF0IHRoZSBkaW1lbnNpb25zIG9mIHRoZSBhcnJheSBhcmUgYWx3YXlzIGJhY2tlZCBieSB2YWx1ZXMgYXQgZXZlcnkgcG9zaXRpb25cbiAgIyMjICAgICAgICAgICAgICAgICAgICBcbiAgZXh0ZW5kID0gKGxlbmd0aCwgd2lkdGgpIC0+ICBcbiAgICBpZiBub3QgbGVuZ3RoIG9yIGxlbmd0aCA8IDEgdGhlbiBsZW5ndGggPSAxXG4gICAgaWYgbm90IHdpZHRoIG9yIHdpZHRoIDwgMSB0aGVuIHdpZHRoID0gMVxuICAgICAgXG4gICAgaWYgbWF4TGVuZ3RoIDwgbGVuZ3RoIHRoZW4gbWF4TGVuZ3RoID0gbGVuZ3RoXG4gICAgaWYgYXJyYXkubGVuZ3RoID4gbWF4TGVuZ3RoIHRoZW4gbWF4TGVuZ3RoID0gYXJyYXkubGVuZ3RoXG4gICAgaWYgbWF4V2lkdGggPCB3aWR0aCB0aGVuIG1heFdpZHRoID0gd2lkdGhcbiAgICBpID0gMFxuICAgICAgXG4gICAgd2hpbGUgaSA8IG1heExlbmd0aFxuICAgICAgdHJ5Um93ID0gYXJyYXlbaV1cbiAgICAgIGlmIG5vdCB0cnlSb3dcbiAgICAgICAgdHJ5Um93ID0gW11cbiAgICAgICAgYXJyYXkucHVzaCB0cnlSb3dcbiAgICAgIGlmIG1heFdpZHRoIDwgdHJ5Um93Lmxlbmd0aCB0aGVuIG1heFdpZHRoID0gdHJ5Um93Lmxlbmd0aFxuICAgICAgaWYgdHJ5Um93Lmxlbmd0aCA8IG1heFdpZHRoIHRoZW4gdHJ5Um93Lmxlbmd0aCA9IG1heFdpZHRoXG4gICAgICBpICs9IDFcbiAgICAgIFxuICAgIGFycmF5W2xlbmd0aC0xXVt3aWR0aC0xXVxuICAgICAgIFxuICBleHRlbmQgaW5pdExlbmd0aCwgaW5pdFdpZHRoXG4gICAgXG4gIHJldFxuXG5PSi5yZWdpc3RlciAnYXJyYXkyRCcsIGFycmF5MkRcbm1vZHVsZS5leHBvcnRzID0gYXJyYXkyRCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG4gIFxubWV0aG9kcyA9IFtcbiAgJ2Fzc2VydCdcbiAgJ2NsZWFyJ1xuICAnY291bnQnXG4gICdkZWJ1ZydcbiAgJ2RpcidcbiAgJ2RpcnhtbCdcbiAgJ2Vycm9yJ1xuICAnZXhjZXB0aW9uJ1xuICAnZ3JvdXAnXG4gICdncm91cENvbGxhcHNlZCdcbiAgJ2dyb3VwRW5kJ1xuICAnaW5mbydcbiAgJ2xvZydcbiAgJ21lbW9yeSdcbiAgJ3Byb2ZpbGUnXG4gICdwcm9maWxlRW5kJ1xuICAndGFibGUnXG4gICd0aW1lJ1xuICAndGltZUVuZCdcbiAgJ3RpbWVTdGFtcCdcbiAgJ3RpbWVsaW5lJ1xuICAndGltZWxpbmVFbmQnXG4gICd0cmFjZSdcbiAgJ3dhcm4nXG5dXG5tZXRob2RMZW5ndGggPSBtZXRob2RzLmxlbmd0aFxuY29uc29sZSA9IE9KLmdsb2JhbC5jb25zb2xlIG9yIHt9XG5PSi5tYWtlU3ViTmFtZVNwYWNlICdjb25zb2xlJ1xuICBcbiMjI1xuMS4gU3R1YiBvdXQgYW55IG1pc3NpbmcgbWV0aG9kcyB3aXRoIG5vb3BcbjIuIERlZmluZSB0aGUgYXZhaWxhYmxlIG1ldGhvZHMgb24gdGhlIE9KLmNvbnNvbGUgb2JqZWN0XG4jIyNcbndoaWxlIG1ldGhvZExlbmd0aC0tXG4gICgtPlxuICAgIG1ldGhvZCA9IG1ldGhvZHNbbWV0aG9kTGVuZ3RoXVxuICAgIFxuICAgICMgT25seSBzdHViIHVuZGVmaW5lZCBtZXRob2RzLlxuICAgIGNvbnNvbGVbbWV0aG9kXSA9IE9KLm5vb3AgdW5sZXNzIGNvbnNvbGVbbWV0aG9kXVxuICAgIFxuICAgICNEZWZpbmUgdGhlIG1ldGhvZCBvbiB0aGUgT0ogY29uc29sZSBuYW1lc3BhY2VcbiAgICBPSi5jb25zb2xlLnJlZ2lzdGVyIG1ldGhvZCwgKHBhcmFtcy4uLikgLT5cbiAgICAgIGNvbnNvbGVbbWV0aG9kXSBwYXJhbXMuLi5cbiAgKSgpXG5cbm1vZHVsZS5leHBvcnRzID0gY29uc29sZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuICBcbiMjI1xuU2V0dXAgc2V0dGluZ3NcbiQuY29va2llLnJhdyA9IHRydWVcbiQuY29va2llLmpzb24gPSB0cnVlXG4gIFxuU2V0dXAgZGVmYXVsdHNcbmh0dHBzOi8vZ2l0aHViLmNvbS9jYXJoYXJ0bC9qcXVlcnktY29va2llL1xuJC5jb29raWUuZGVmYXVsdHMuZXhwaXJlcyA9IDM2NVxuJC5jb29raWUuZGVmYXVsdHMucGF0aCA9ICcvJ1xuJC5jb29raWUuZGVmYXVsdHMuZG9tYWluID0gJ29qLmNvbSdcbiMjI1xuaWYgbm90ICQgb3Igbm90ICQuY29va2llXG4gIHRocm93IG5ldyBFcnJvciAnalF1ZXJ5IENvb2tpZSBpcyBhIHJlcXVpcmVkIGRlcGVuZGVuY3kuJyAgXG4kLmNvb2tpZS5kZWZhdWx0cy5zZWN1cmUgPSBmYWxzZVxuICBcbmNvb2tpZXMgPSB7fVxuICBcbmdldCA9IChjb29raWVOYW1lLCB0eXBlKSAtPlxuICByZXQgPSAnJ1xuICBpZiBjb29raWVOYW1lXG4gICAgaWYgdHlwZVxuICAgICAgcmV0ID0gJC5jb29raWUgY29va2llTmFtZSwgdHlwZVxuICAgIGVsc2VcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUgICAgXG4gICAgaWYgcmV0XG4gICAgICBjb29raWVzW2Nvb2tpZU5hbWVdID0gcmV0XG4gIFxuYWxsID0gLT5cbiAgcmV0ID0gJC5jb29raWUoKVxuICByZXRcbiAgICBcbnNldCA9IChjb29raWVOYW1lLCB2YWx1ZSwgb3B0cykgLT5cbiAgcmV0ID0gJydcbiAgaWYgY29va2llTmFtZVxuICAgIGNvb2tpZXNbY29va2llTmFtZV0gPSB2YWx1ZVxuICAgIGlmIG9wdHNcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHZhbHVlLCBvcHRzXG4gICAgZWxzZVxuICAgICAgcmV0ID0gJC5jb29raWUgY29va2llTmFtZSwgdmFsdWVcbiAgcmV0ICBcbiAgXG5kZWwgPSAoY29va2llTmFtZSwgb3B0cykgLT5cbiAgaWYgY29va2llTmFtZVxuICAgIGlmIG9wdHNcbiAgICAgICQucmVtb3ZlQ29va2llIGNvb2tpZU5hbWUsIG9wdHNcbiAgICBlbHNlXG4gICAgICAkLnJlbW92ZUNvb2tpZSBjb29raWVOYW1lICAgIFxuICAgIGRlbGV0ZSBjb29raWVzW2Nvb2tpZU5hbWVdXG4gIHJldHVyblxuICAgIFxuZGVsZXRlQWxsID0gLT5cbiAgY29va2llcyA9IHt9XG4gIE9KLmVhY2ggT0ouY29va2llLmFsbCwgKHZhbCwga2V5KSAtPlxuICAgIE9KLmNvb2tpZS5kZWxldGUga2V5ICBcbiAgcmV0dXJuXG4gICAgXG4gT0ouY29va2llLnJlZ2lzdGVyICdkZWxldGVBbGwnLCBkZWxldGVBbGxcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2RlbGV0ZScsIGRlbFxuIE9KLmNvb2tpZS5yZWdpc3RlciAnc2V0Jywgc2V0XG4gT0ouY29va2llLnJlZ2lzdGVyICdnZXQnLCBnZXRcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2FsbCcsICBhbGxcbiBcbiBtb2R1bGUuZXhwb3J0cyA9IFxuICBkZWxldGVBbGw6IGRlbGV0ZUFsbFxuICBkZWxldGU6IGRlbFxuICBzZXQ6IHNldFxuICBnZXQ6IGdldFxuICBhbGw6ICBhbGwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuICBcbmRlZmVyID0gKG1ldGhvZCwgd2FpdE1zKSAtPlxuICBpZiBzZXRUaW1lb3V0XG4gICAgcmV0dXJuIHNldFRpbWVvdXQgbWV0aG9kLCB3YWl0TXNcbiAgXG5PSi5yZWdpc3RlciAnZGVmZXInLCBkZWZlclxubW9kdWxlLmV4cG9ydHMgPSBkZWZlciIsIiMgIyBlYWNoXG5cbk9KID0gcmVxdWlyZSAnLi4vb2onXG5cbiMgIyMgY2FuRWFjaFxuY2FuRWFjaCA9IChvYmopIC0+XG4gICMgUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBbaXNdKGlzLmh0bWwpIHRydWx5IGl0ZXJhYmxlIChlLmcuIGFuIGluc3RhbmNlIG9mIE9iamVjdCBvciBBcnJheSlcbiAgT0ouaXMucGxhaW5PYmplY3Qob2JqKSBvciBPSi5pcy5vYmplY3Qob2JqKSBvciBPSi5pcy5hcnJheSBvYmpcblxuIyAjIyBbT0pdKG9qLmh0bWwpLmVhY2hcblxuIyBJdGVyYXRlIGFsbCBvZiB0aGUgbWVtYmVycyBvZiBhbiBvYmplY3QgKG9yIGFuIGFycmF5KSB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGFuZCByZWN1cnNpb24uXG5cbiMgLSBgb2JqYDogdGhlIG9iamVjdCB0byBpdGVyYXRlLFxuIyAtIGBvbkVhY2hgOiBhIGNhbGxiYWNrIHRvIGV4ZWN1dGUgZm9yIGVhY2ggaXRlcmF0aW9uLFxuIyAtIGByZWN1cnNpdmVgOiBpZiB0cnVlLCByZWN1cnNpdmVseSBpdGVyYXRlIGFsbCB2YWxpZCBjaGlsZCBvYmplY3RzLlxuZWFjaCA9IChvYmosIG9uRWFjaCwgcmVjdXJzaXZlKSAtPlxuICBpZiBjYW5FYWNoIG9ialxuICAgICMgVXNpbmcgW0xvLURhc2hdKGh0dHA6Ly9sb2Rhc2guY29tL2RvY3MjZm9yb3duKSdzIGBmb3JPd25gIG1ldGhvZCB0byBlbnN1cmUgdGhhdCBvbmx5IHRoZSBhY3R1YWwgcHJvcGVydGllcyBvZiB0aGUgb2JqZWN0IGFyZSBlbnVtZXJhdGVkLlxuXG4gICAgIyAtIGBvbkVhY2hgIGNhbGxiYWNrIHdpbGwgcmVjZWl2ZSAyIHBhcmFtZXRlcnM6XG4gICAgIyAtIGB2YWxgIGFuZCBga2V5YC5cbiAgICAjIC0gYHZhbGAgaXMgYWx3YXlzIHRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuXG4gICAgIyAtIGBrZXlgIGlzIGVpdGhlciB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb3IgdGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIGFycmF5LlxuICAgIF8uZm9yT3duIG9iaiwgKHZhbCwga2V5KSAtPlxuICAgICAgaWYgb25FYWNoIGFuZCAodmFsIG9yIGtleSlcbiAgICAgICAgcXVpdCA9IG9uRWFjaCB2YWwsIGtleVxuICAgICAgICByZXR1cm4gZmFsc2UgIGlmIGZhbHNlIGlzIHF1aXRcbiAgICAgIGVhY2ggdmFsLCBvbkVhY2gsIHRydWUgIGlmIHRydWUgaXMgcmVjdXJzaXZlXG4gICAgICByZXR1cm5cblxuICByZXR1cm5cblxuIyAjIyByZWdpc3RlclxuXG4jIHJlZ2lzdGVyIHRoZSBgZWFjaGAgbWV0aG9kIG9uIHRoZSBbT0pdKE9KLmh0bWwpIG5hbWVzcGFjZVxuT0oucmVnaXN0ZXIgJ2VhY2gnLCBlYWNoXG5tb2R1bGUuZXhwb3J0cyA9IGVhY2giLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuICBcbnVua25vd24gPSAndW5rbm93bicgICBcbiAgXG5pbnB1dFR5cGVzID1cbiAgYnV0dG9uOiAjY2hhcmFjdGVyc1xuICAgIGlkOiAwXG4gICAgbmFtZTogJ2J1dHRvbidcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXG4gICAgdmFsdWU6XG4gICAgICByZXF1aXJlZDogZmFsc2VcbiAgICAgIGFsbG93ZWQ6IHRydWVcblxuICAgIGRlZmF1bHR3aWR0aDogJydcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xuXG4gIGNoZWNrYm94OiAjY2hhcmFjdGVyc1xuICAgIGlkOiAxXG4gICAgbmFtZTogJ2NoZWNrYm94J1xuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcbiAgICB2YWx1ZTpcbiAgICAgIHJlcXVpcmVkOiB0cnVlXG4gICAgICBhbGxvd2VkOiB0cnVlXG5cbiAgICBkZWZhdWx0d2lkdGg6ICcnXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcblxuICBjb2xvcjogI2NoYXJhY3RlcnNcbiAgICBpZDogMlxuICAgIG5hbWU6ICdjb2xvcidcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcbiAgICBhdXRvY29tcGxldGU6IHRydWVcbiAgICB2YWx1ZTpcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgYWxsb3dlZDogdHJ1ZVxuXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xuICAgIGRlZmF1bHRzaXplOiAnMjUnXG5cbiAgZGF0ZTogI2NoYXJhY3RlcnNcbiAgICBpZDogM1xuICAgIG5hbWU6ICdkYXRlJ1xuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxuICAgIHZhbHVlOlxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICBhbGxvd2VkOiB0cnVlXG5cbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xuXG4gIGRhdGV0aW1lOiAjY2hhcmFjdGVyc1xuICAgIGlkOiA0XG4gICAgbmFtZTogJ2RhdGV0aW1lJ1xuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcbiAgICB2YWx1ZTpcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgYWxsb3dlZDogdHJ1ZVxuXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcblxuICAnZGF0ZXRpbWUtbG9jYWwnOiAjY2hhcmFjdGVyc1xuICAgIGlkOiA1XG4gICAgbmFtZTogJ2RhdGV0aW1lLWxvY2FsJ1xuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxuICAgIHZhbHVlOlxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICBhbGxvd2VkOiB0cnVlXG5cbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xuXG4gIGVtYWlsOiAjY2hhcmFjdGVyc1xuICAgIGlkOiA2XG4gICAgbmFtZTogJ2VtYWlsJ1xuICAgIHBsYWNlaG9sZGVyOiB0cnVlXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXG4gICAgdmFsdWU6XG4gICAgICByZXF1aXJlZDogZmFsc2VcbiAgICAgIGFsbG93ZWQ6IHRydWVcblxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xuICAgIGRlZmF1bHRzaXplOiAnMjUnXG5cbiAgZmlsZTogI2NoYXJhY3RlcnNcbiAgICBpZDogN1xuICAgIG5hbWU6ICdmaWxlJ1xuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcbiAgICB2YWx1ZTpcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgYWxsb3dlZDogZmFsc2VcblxuICAgIGRlZmF1bHR3aWR0aDogJydcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xuXG4gIGhpZGRlbjogI2NoYXJhY3RlcnNcbiAgICBpZDogOFxuICAgIG5hbWU6ICdoaWRkZW4nXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxuICAgIHZhbHVlOlxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICBhbGxvd2VkOiB0cnVlXG5cbiAgICBkZWZhdWx0d2lkdGg6ICcnXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcblxuICBpbWFnZTogI2NoYXJhY3RlcnNcbiAgICBpZDogOVxuICAgIG5hbWU6ICdpbWFnZSdcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXG4gICAgdmFsdWU6XG4gICAgICByZXF1aXJlZDogZmFsc2VcbiAgICAgIGFsbG93ZWQ6IHRydWVcblxuICAgIGRlZmF1bHR3aWR0aDogJydcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xuXG4gIG1vbnRoOiAjY2hhcmFjdGVyc1xuICAgIGlkOiAxMFxuICAgIG5hbWU6ICdtb250aCdcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXG4gICAgdmFsdWU6XG4gICAgICByZXF1aXJlZDogZmFsc2VcbiAgICAgIGFsbG93ZWQ6IHRydWVcblxuICAgIGRlZmF1bHR3aWR0aDogJydcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xuXG4gIG51bWJlcjogI2NoYXJhY3RlcnNcbiAgICBpZDogMTFcbiAgICBuYW1lOiAnbnVtYmVyJ1xuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcbiAgICB2YWx1ZTpcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgYWxsb3dlZDogdHJ1ZVxuXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcblxuICBwYXNzd29yZDogI2NoYXJhY3RlcnNcbiAgICBpZDogMTJcbiAgICBuYW1lOiAncGFzc3dvcmQnXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcbiAgICB2YWx1ZTpcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgYWxsb3dlZDogdHJ1ZVxuXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcblxuICByYWRpbzogI2NoYXJhY3RlcnNcbiAgICBpZDogMTNcbiAgICBuYW1lOiAncmFkaW8nXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxuICAgIHZhbHVlOlxuICAgICAgcmVxdWlyZWQ6IHRydWVcbiAgICAgIGFsbG93ZWQ6IHRydWVcblxuICAgIGRlZmF1bHR3aWR0aDogJydcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xuXG4gIHJhbmdlOiAjY2hhcmFjdGVyc1xuICAgIGlkOiAxNFxuICAgIG5hbWU6ICdyYW5nZSdcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcbiAgICBhdXRvY29tcGxldGU6IHRydWVcbiAgICB2YWx1ZTpcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgYWxsb3dlZDogdHJ1ZVxuXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xuICAgIGRlZmF1bHRzaXplOiAnMjUnXG5cbiAgcmVzZXQ6ICNjaGFyYWN0ZXJzXG4gICAgaWQ6IDE1XG4gICAgbmFtZTogJ3Jlc2V0J1xuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcbiAgICB2YWx1ZTpcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgYWxsb3dlZDogdHJ1ZVxuXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xuICAgIGRlZmF1bHRzaXplOiAnMjUnXG5cbiAgc2VhcmNoOiAjY2hhcmFjdGVyc1xuICAgIGlkOiAxNlxuICAgIG5hbWU6ICdzZWFyY2gnXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcbiAgICBhdXRvY29tcGxldGU6IHRydWVcbiAgICB2YWx1ZTpcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgYWxsb3dlZDogdHJ1ZVxuXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xuICAgIGRlZmF1bHRzaXplOiAnMjUnXG5cbiAgc3VibWl0OiAjY2hhcmFjdGVyc1xuICAgIGlkOiAxN1xuICAgIG5hbWU6ICdzdWJtaXQnXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxuICAgIHZhbHVlOlxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICBhbGxvd2VkOiB0cnVlXG5cbiAgICBkZWZhdWx0d2lkdGg6ICcnXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcblxuICB0ZWw6ICNjaGFyYWN0ZXJzXG4gICAgaWQ6IDE4XG4gICAgbmFtZTogJ2J1dHRvbidcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxuICAgIHZhbHVlOlxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICBhbGxvd2VkOiB0cnVlXG5cbiAgICBkZWZhdWx0d2lkdGg6ICcnXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcblxuICB0ZXh0OiAjY2hhcmFjdGVyc1xuICAgIGlkOiAxOVxuICAgIG5hbWU6ICd0ZXh0J1xuICAgIHBsYWNlaG9sZGVyOiB0cnVlXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXG4gICAgdmFsdWU6XG4gICAgICByZXF1aXJlZDogZmFsc2VcbiAgICAgIGFsbG93ZWQ6IHRydWVcblxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xuICAgIGRlZmF1bHRzaXplOiAnMjUnXG5cbiAgdGltZTogI2NoYXJhY3RlcnNcbiAgICBpZDogMjBcbiAgICBuYW1lOiAndGltZSdcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcbiAgICBhdXRvY29tcGxldGU6IHRydWVcbiAgICB2YWx1ZTpcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxuICAgICAgYWxsb3dlZDogdHJ1ZVxuXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcblxuICB1cmw6ICNjaGFyYWN0ZXJzXG4gICAgaWQ6IDIxXG4gICAgbmFtZTogJ3VybCdcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxuICAgIHZhbHVlOlxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICBhbGxvd2VkOiB0cnVlXG5cbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xuXG4gIHdlZWs6ICNjaGFyYWN0ZXJzXG4gICAgaWQ6IDIyXG4gICAgbmFtZTogJ3dlZWsnXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxuICAgIHZhbHVlOlxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXG4gICAgICBhbGxvd2VkOiB0cnVlXG5cbiAgICBkZWZhdWx0d2lkdGg6ICcnXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcblxuT0ouZW51bXMucmVnaXN0ZXIgJ3Vua25vd24nLCB1bmtub3duXG5PSi5lbnVtcy5yZWdpc3RlciAnaW5wdXRUeXBlcycsIGlucHV0VHlwZXNcblxubW9kdWxlLmV4cG9ydHMgPSBcbiAgdW5rbm93bjogdW5rbm93blxuICBpbnB1dFR5cGVzOiBpbnB1dFR5cGVzIiwiT0ogPSByZXF1aXJlICcuLi9vaidcblxuaWYgT0ouZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXJcbiAgZXZlbnROYW1lID0gJ2FkZEV2ZW50TGlzdGVuZXInXG4gIGV2ZW50SW5mbyA9ICcnXG5lbHNlIFxuICBldmVudE5hbWUgPSAnYXR0YWNoRXZlbnQnXG4gIGV2ZW50SW5mbyA9ICdvbidcbiAgXG5wdXNoU3RhdGUgPSAocGFnZU5hbWUsIGV2ZW50KSAtPlxuICBpZiBwYWdlTmFtZVxuICAgICMga2VlcCB0aGUgbGluayBpbiB0aGUgYnJvd3NlciBoaXN0b3J5XG4gICAgaGlzdG9yeS5wdXNoU3RhdGUgbnVsbCwgbnVsbCwgJyMnICsgcGFnZU5hbWVcbiAgICAgIFxuICAgICMgaGVyZSBjYW4gY2F1c2UgZGF0YSBsb2FkaW5nLCBldGMuXG4gICAgXG4gICAgaWYgZXZlbnQgICAgXG4gICAgICAjIGRvIG5vdCBnaXZlIGEgZGVmYXVsdCBhY3Rpb25cbiAgICAgIGlmIGV2ZW50LnByZXZlbnREZWZhdWx0XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIGVsc2VcbiAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZVxuICBmYWxzZVxuICBcbnJlc3RvcmVTdGF0ZSA9IChsb2NhdGlvbikgLT5cbiAgcGFnZU5hbWUgPSBsb2NhdGlvbi5oYXNoXG4gIGlmIG5vdCBwYWdlTmFtZVxuICAgIHBhZ2VOYW1lID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzFdXG4gIGlmIHBhZ2VOYW1lXG4gICAgcGFnZU5hbWUgPSBwYWdlTmFtZS5yZXBsYWNlICcjJywgJydcbiAgICBPSi5wdWJsaXNoICdyZXN0b3JlU3RhdGUnLCBwYWdlTmFtZTogcGFnZU5hbWUsIGxvY2F0aW9uOiBsb2NhdGlvblxuICByZXR1cm5cbiAgXG4jIyMgXG5oYW5nIG9uIHRoZSBldmVudCwgYWxsIHJlZmVyZW5jZXMgaW4gdGhpcyBkb2N1bWVudFxuIyMjXG4gIFxuIyMjXG4jIFRoaXMgYmluZHMgdG8gdGhlIGRvY3VtZW50IGNsaWNrIGV2ZW50LCB3aGljaCBpbiB0dXJuIGF0dGFjaGVzIHRvIGV2ZXJ5IGNsaWNrIGV2ZW50LCBjYXVzaW5nIHVuZXhwZWN0ZWQgYmVoYXZpb3IuXG4jIEZvciBhbnkgY29udHJvbCB3aGljaCB3aXNoZXMgdG8gdHJpZ2dlciBhIHN0YXRlIGNoYW5nZSBpbiByZXNwb25zZSB0byBhbiBldmVudCwgaXQgaXMgYmV0dGVyIGZvciB0aGF0IGNvbnRyb2wgdG8gZGVmaW5lIHRoZSBiZWhhdmlvci5cbk9KLmRvY3VtZW50W2V2ZW50TmFtZV0gZXZlbnRJbmZvICsgJ2NsaWNrJywgKChldmVudCkgLT5cbiAgZXZlbnQgPSBldmVudCBvciB3aW5kb3cuZXZlbnRcbiAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IG9yIGV2ZW50LnNyY0VsZW1lbnRcbiAgICBcbiAgIyBsb29raW5nIGZvciBhbGwgdGhlIGxpbmtzIHdpdGggJ2FqYXgnIGNsYXNzIGZvdW5kXG4gIGlmIHRhcmdldCBhbmQgdGFyZ2V0Lm5vZGVOYW1lIGlzICdBJyBhbmQgKCcgJyArIHRhcmdldC5jbGFzc05hbWUgKyAnICcpLmluZGV4T2YoJ2FqYXgnKSA+PSAwXG4gICAgT0oucHVzaFN0YXRlIHRhcmdldC5ocmVmLCBldmVudFxuICAgICAgXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiksIGZhbHNlXG4jIyNcblxuIyMjXG5oYW5nIG9uIHBvcHN0YXRlIGV2ZW50IHRyaWdnZXJlZCBieSBwcmVzc2luZyBiYWNrL2ZvcndhcmQgaW4gYnJvd3NlclxuIyMjXG5PSi5nbG9iYWxbZXZlbnROYW1lXSBldmVudEluZm8gKyAncG9wc3RhdGUnLCAoKGV2ZW50KSAtPlxuICAgIFxuICAjIHdlIGdldCBhIG5vcm1hbCBMb2NhdGlvbiBvYmplY3RcbiAgICBcbiAgIyMjXG4gIE5vdGUsIHRoaXMgaXMgdGhlIG9ubHkgZGlmZmVyZW5jZSB3aGVuIHVzaW5nIHRoaXMgbGlicmFyeSxcbiAgYmVjYXVzZSB0aGUgb2JqZWN0IGRvY3VtZW50LmxvY2F0aW9uIGNhbm5vdCBiZSBvdmVycmlkZW4sXG4gIHNvIGxpYnJhcnkgdGhlIHJldHVybnMgZ2VuZXJhdGVkICdsb2NhdGlvbicgb2JqZWN0IHdpdGhpblxuICBhbiBvYmplY3Qgd2luZG93Lmhpc3RvcnksIHNvIGdldCBpdCBvdXQgb2YgJ2hpc3RvcnkubG9jYXRpb24nLlxuICBGb3IgYnJvd3NlcnMgc3VwcG9ydGluZyAnaGlzdG9yeS5wdXNoU3RhdGUnIGdldCBnZW5lcmF0ZWRcbiAgb2JqZWN0ICdsb2NhdGlvbicgd2l0aCB0aGUgdXN1YWwgJ2RvY3VtZW50LmxvY2F0aW9uJy5cbiAgIyMjICAgICAgICAgICAgICAgICAgICAgXG4gIHJldHVybkxvY2F0aW9uID0gaGlzdG9yeS5sb2NhdGlvbiBvciBkb2N1bWVudC5sb2NhdGlvblxuICAgIFxuICAjIyNcbiAgaGVyZSBjYW4gY2F1c2UgZGF0YSBsb2FkaW5nLCBldGMuXG4gICMjI1xuICBPSi5oaXN0b3J5LnJlc3RvcmVTdGF0ZSByZXR1cm5Mb2NhdGlvblxuICAgIFxuICByZXR1cm5cbiksIGZhbHNlIFxuICBcbiBcbk9KLmhpc3RvcnkucmVnaXN0ZXIgJ3Jlc3RvcmVTdGF0ZScsIHJlc3RvcmVTdGF0ZVxuT0ouaGlzdG9yeS5yZWdpc3RlciAncHVzaFN0YXRlJywgcHVzaFN0YXRlXG4gXG5tb2R1bGUuZXhwb3J0cyA9IFxuICByZXN0b3JlU3RhdGU6IHJlc3RvcmVTdGF0ZVxuICBwdXNoU3RhdGU6IHB1c2hTdGF0ZVxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbiQgPSByZXF1aXJlICdqcXVlcnknXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5jbGFzcyBJU1xuXG4gIEBib29sOiAoYm9vbGVhbikgLT5cbiAgICBfLmlzQm9vbGVhbiBib29sZWFuXG5cbiAgQGFycmF5TnVsbE9yRW1wdHk6IChhcnIpIC0+XG4gICAgXy5pc0VtcHR5IGFyclxuXG4gIEBzdHJpbmdOdWxsT3JFbXB0eTogKHN0cikgLT5cbiAgICBzdHIgYW5kIChub3Qgc3RyLmxlbmd0aCBvciBzdHIubGVuZ3RoIGlzIDAgb3Igbm90IHN0ci50cmltIG9yIG5vdCBzdHIudHJpbSgpKVxuXG4gIEBudW1iZXJOdWxsT3JFbXB0eTogKG51bSkgLT5cbiAgICBub3QgbnVtIG9yIGlzTmFOKG51bSkgb3Igbm90IG51bS50b1ByZWNpc2lvblxuXG4gIEBkYXRlTnVsbE9yRW1wdHk6IChkdCkgLT5cbiAgICBub3QgZHQgb3Igbm90IGR0LmdldFRpbWVcblxuICBAb2JqZWN0TnVsbE9yRW1wdHk6IChvYmopIC0+XG4gICAgXy5pc0VtcHR5IG9iaiBvciBub3QgT2JqZWN0LmtleXMob2JqKSBvciBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCBpcyAwXG5cbiAgQHBsYWluT2JqZWN0OiAob2JqKSAtPlxuICAgIF8uaXNQbGFpbk9iamVjdCBvYmpcblxuICBAb2JqZWN0OiAob2JqKSAtPlxuICAgIF8uaXNPYmplY3Qgb2JqXG5cbiAgQGRhdGU6IChkdCkgLT5cbiAgICBfLmlzRGF0ZSBkdFxuXG5cbiAgIyMjXG4gIERldGVybWluZXMgaWYgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiBhIE51bWJlciBhbmQgbm90IE5hTipcbiAgIyMjXG4gIEBudW1iZXI6IChudW0pIC0+XG4gICAgbnVtYmVyID0gcmVxdWlyZSAnLi4vY29yZS9udW1iZXInXG4gICAgdHlwZW9mIG51bSBpcyAnbnVtYmVyJyBhbmQgZmFsc2UgaXMgKG51bWJlci5pc05hTihudW0pIG9yIGZhbHNlIGlzIG51bWJlci5pc0Zpbml0ZShudW0pIG9yIG51bWJlci5NQVhfVkFMVUUgaXMgbnVtIG9yIG51bWJlci5NSU5fVkFMVUUgaXMgbnVtKVxuXG4gICMjI1xuICBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgY29udmVydGlibGUgdG8gYSBOdW1iZXJcbiAgIyMjXG4gIEBudW1lcmljOiAobnVtKSAtPlxuICAgIHJldCA9IEBudW1iZXIobnVtKVxuICAgIHVubGVzcyByZXRcbiAgICAgIHRvID0gcmVxdWlyZSAnLi90bydcbiAgICAgIG51TnVtID0gdG8ubnVtYmVyKG51bSlcbiAgICAgIHJldCA9IEBudW1iZXIobnVOdW0pXG4gICAgcmV0XG5cbiAgQGVsZW1lbnRJbkRvbTogKGVsZW1lbnRJZCkgLT5cbiAgICBmYWxzZSBpcyBAbnVsbE9yRW1wdHkoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKSlcblxuICBAYXJyYXk6IChvYmopIC0+XG4gICAgXy5pc0FycmF5IG9ialxuXG4gIEBzdHJpbmc6IChzdHIpIC0+XG4gICAgXy5pc1N0cmluZyBzdHJcblxuICBAdHJ1ZTogKG9iaikgLT5cbiAgICBvYmogaXMgdHJ1ZSBvciBvYmogaXMgJ3RydWUnIG9yIG9iaiBpcyAxIG9yIG9iaiBpcyAnMSdcblxuICBAZmFsc2U6IChvYmopIC0+XG4gICAgb2JqIGlzIGZhbHNlIG9yIG9iaiBpcyAnZmFsc2UnIG9yIG9iaiBpcyAwIG9yIG9iaiBpcyAnMCdcblxuICBAdHJ1ZU9yRmFsc2U6IChvYmopIC0+XG4gICAgQHRydWUgb2JqIG9yIEBmYWxzZSBvYmpcblxuICBAbnVsbE9yRW1wdHk6IChvYmosIGNoZWNrTGVuZ3RoKSAtPlxuICAgIF8uaXNFbXB0eShvYmopIG9yIF8uaXNVbmRlZmluZWQob2JqKSBvciBfLmlzTnVsbChvYmopIG9yIF8uaXNOYU4ob2JqKVxuXG4gIEBudWxsT3JVbmRlZmluZWQ6IChvYmosIGNoZWNrTGVuZ3RoKSAtPlxuICAgIF8uaXNVbmRlZmluZWQob2JqKSBvciBfLmlzTnVsbChvYmopIG9yIF8uaXNOYU4ob2JqKVxuXG4gIEBpbnN0YW5jZW9mOiAobmFtZSwgb2JqKSAtPlxuICAgIG9iai50eXBlIGlzIG5hbWUgb3Igb2JqIGluc3RhbmNlb2YgbmFtZVxuXG4gIEBtZXRob2Q6IChvYmopIC0+XG4gICAgb2JqIGlzbnQgT0oubm9vcCBhbmQgXy5pc0Z1bmN0aW9uIG9ialxuXG4gICMjI1xuICBEZXByZWNhdGVkLiBMZWZ0IGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4gVXNlIGlzLm1ldGhvZCBpbnN0ZWFkLlxuICAjIyNcbiAgQGZ1bmMgPSBAbWV0aG9kXG5cblxuXG5PSi5yZWdpc3RlciAnaXMnLCBJU1xubW9kdWxlLmV4cG9ydHMgPSBJU1xuXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xubm90eSA9IHJlcXVpcmUgJ25vdHknXG5cbiAgXG5tYWtlTm90eSA9IChvcHRpb25zLCBvd25lcikgLT5cbiAgZGVmYXVsdHMgPVxuICAgIGxheW91dDogJ3RvcFJpZ2h0J1xuICAgIHRoZW1lOiAnZGVmYXVsdFRoZW1lJ1xuICAgIHR5cGU6ICdhbGVydCdcbiAgICB0ZXh0OiAnJyAjY2FuIGJlIGh0bWwgb3Igc3RyaW5nXG4gICAgZGlzbWlzc1F1ZXVlOiB0cnVlICNJZiB5b3Ugd2FudCB0byB1c2UgcXVldWUgZmVhdHVyZSBzZXQgdGhpcyB0cnVlXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwibm90eV9tZXNzYWdlXCI+PHNwYW4gY2xhc3M9XCJub3R5X3RleHRcIj48L3NwYW4+PGRpdiBjbGFzcz1cIm5vdHlfY2xvc2VcIj48L2Rpdj48L2Rpdj4nLFxuICAgIGFuaW1hdGlvbjogXG4gICAgICAgIG9wZW46IFxuICAgICAgICAgIGhlaWdodDogJ3RvZ2dsZSdcbiAgICAgICAgY2xvc2U6IFxuICAgICAgICAgIGhlaWdodDogJ3RvZ2dsZSdcbiAgICAgICAgZWFzaW5nOiAnc3dpbmcnXG4gICAgICAgIHNwZWVkOiA1MDAgI29wZW5pbmcgJiBjbG9zaW5nIGFuaW1hdGlvbiBzcGVlZFxuICAgIHRpbWVvdXQ6IDUwMDAgI2RlbGF5IGZvciBjbG9zaW5nIGV2ZW50LiBTZXQgZmFsc2UgZm9yIHN0aWNreSBub3RpZmljYXRpb25zXG4gICAgZm9yY2U6IGZhbHNlICNhZGRzIG5vdGlmaWNhdGlvbiB0byB0aGUgYmVnaW5uaW5nIG9mIHF1ZXVlIHdoZW4gc2V0IHRvIHRydWVcbiAgICBtb2RhbDogZmFsc2VcbiAgICBtYXhWaXNpYmxlOiA1ICN5b3UgY2FuIHNldCBtYXggdmlzaWJsZSBub3RpZmljYXRpb24gZm9yIGRpc21pc3NRdWV1ZSB0cnVlIG9wdGlvbixcbiAgICBraWxsZXI6IGZhbHNlICNmb3IgY2xvc2UgYWxsIG5vdGlmaWNhdGlvbnMgYmVmb3JlIHNob3dcbiAgICBjbG9zZVdpdGg6IFsnY2xpY2snXSAgI1snY2xpY2snLCAnYnV0dG9uJywgJ2hvdmVyJ11cbiAgICBjYWxsYmFjazogXG4gICAgICAgIG9uU2hvdzogT0oubm9vcCxcbiAgICAgICAgYWZ0ZXJTaG93OiBPSi5ub29wXG4gICAgICAgIG9uQ2xvc2U6IE9KLm5vb3BcbiAgICAgICAgYWZ0ZXJDbG9zZTogT0oubm9vcFxuICAgIGJ1dHRvbnM6IGZhbHNlICNhbiBhcnJheSBvZiBidXR0b25zXG4gICAgXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBub3R5IGRlZmF1bHRzXG4gICAgICBcbiAgcmV0XG4gICAgXG5PSi5ub3RpZmljYXRpb25zLnJlZ2lzdGVyICdub3R5JywgbWFrZU5vdHlcbm1vZHVsZS5leHBvcnRzID0gbWFrZU5vdHkiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuUHViU3ViID0gcmVxdWlyZSAncHVic3ViLWpzJ1xuXG50b2tlbnMgPSB7fVxuc3Vic2NyaWJlcnMgPSBbXVxuZXZlbnRzID0ge31cblxucHMgPSBcbiAgZ2V0RXZlbnROYW1lOiAoZXZlbnQpIC0+XG4gICAgZXZlbnQudG9VcHBlckNhc2UoKS5yZXBsYWNlICcgJywgJ18nXG5cbiAgc3Vic2NyaWJlOiAoZXZlbnQsIG1ldGhvZCkgLT5cbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUgZXZlbnRcbiAgICBpZiBub3QgZXZlbnRzW2V2ZW50TmFtZV0gdGhlbiBldmVudHNbZXZlbnROYW1lXSA9IFtdXG5cbiAgICB0b2tlbiA9IFB1YlN1Yi5zdWJzY3JpYmUgZXZlbnROYW1lLCBtZXRob2RcbiAgICB0b2tlbnNbdG9rZW5dID0gdG9rZW5cbiAgICBzdWJzY3JpYmVycy5wdXNoIG1ldGhvZFxuICAgIGV2ZW50c1tldmVudE5hbWVdLnB1c2ggbWV0aG9kXG4gICAgdG9rZW5cblxuICBwdWJsaXNoOiAoZXZlbnQsIGRhdGEpIC0+XG4gICAgZXZlbnROYW1lID0gcHMuZ2V0RXZlbnROYW1lIGV2ZW50XG4gICAgaWYgZXZlbnRzW2V2ZW50TmFtZV1cbiAgICAgIFB1YlN1Yi5wdWJsaXNoIGV2ZW50TmFtZSwgZGF0YVxuICAgIGVsc2VcbiAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbmFtZWQgeycgKyBldmVudCArICd9IGlzIG5vdCByZWNvZ25pemVkLidcbiAgICByZXR1cm5cblxuICB1bnN1YnNjcmliZTogKHRva2VuT3JNZXRob2QpIC0+XG4gICAgaWYgT0ouaXMubWV0aG9kIHRva2VuT3JNZXRob2RcbiAgICAgIGlmIC0xIGlzbnQgc3Vic2NyaWJlcnMuaW5kZXhPZiB0b2tlbk9yTWV0aG9kXG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSB0b2tlbk9yTWV0aG9kXG4gICAgICAgIHN1YnNjcmliZXJzID0gXy5yZW1vdmUgc3Vic2NyaWJlcnMsIChtZXRob2QpIC0+IG1ldGhvZCBpcyB0b2tlbk9yTWV0aG9kXG4gICAgICBlbHNlXG4gICAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbWV0aG9kIGlzIG5vdCByZWNvZ25pemVkLidcbiAgICBlbHNlXG4gICAgICBpZiB0b2tlbnNbdG9rZW5Pck1ldGhvZF1cbiAgICAgICAgUHViU3ViLnVuc3Vic2NyaWJlIHRva2VuT3JNZXRob2RcbiAgICAgICAgZGVsZXRlIHRva2Vuc1t0b2tlbk9yTWV0aG9kXVxuICAgIHJldHVyblxuXG4gIHVuc3Vic2NyaWJlQWxsOiAoKSAtPlxuICAgIE9KLmVhY2ggdG9rZW5zLCAodG9rZW4pIC0+IHVuc3Vic2NyaWJlIHRva2VuXG4gICAgc3Vic2NyaWJlcnMgPSBbXVxuICAgIGV2ZW50cyA9IHt9XG4gICAgcmV0dXJuXG5cbiAgdW5zdWJzY3JpYmVFdmVudDogKGV2ZW50KSAtPlxuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZSBldmVudFxuICAgIGlmIGV2ZW50c1tldmVudE5hbWVdXG4gICAgICBPSi5lYWNoIGV2ZW50c1tldmVudE5hbWVdLCAobWV0aG9kKSAtPiB1bnN1YnNjcmliZSBtZXRob2RcbiAgICBlbHNlXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0V2ZW50IG5hbWVkIHsnICsgZXZlbnQgKyAnfSBpcyBub3QgcmVjb2duaXplZC4nXG4gICAgZGVsZXRlIGV2ZW50c1tldmVudE5hbWVdXG4gICAgcmV0dXJuXG5cbk9iamVjdC5zZWFsIHBzXG5PYmplY3QuZnJlZXplIHBzXG5cbk9KLnJlZ2lzdGVyICdnZXRFdmVudE5hbWUnLCBwcy5nZXRFdmVudE5hbWVcbk9KLnJlZ2lzdGVyICdwdWJsaXNoJywgcHMucHVibGlzaFxuT0oucmVnaXN0ZXIgJ3N1YnNjcmliZScsIHBzLnN1YnNjcmliZVxuT0oucmVnaXN0ZXIgJ3Vuc3Vic2NyaWJlJywgcHMudW5zdWJzY3JpYmVcbk9KLnJlZ2lzdGVyICd1bnN1YnNjcmliZUFsbCcsIHBzLnVuc3Vic2NyaWJlQWxsXG5PSi5yZWdpc3RlciAndW5zdWJzY3JpYmVFdmVudCcsIHBzLnVuc3Vic2NyaWJlRXZlbnRcblxubW9kdWxlLmV4cG9ydHMgPSBwcyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG4gIFxuIyMjXG5odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkwMTExNS9ob3ctY2FuLWktZ2V0LXF1ZXJ5LXN0cmluZy12YWx1ZXMtaW4tamF2YXNjcmlwdFxuIyMjXG5xdWVyeVN0cmluZyA9IChwYXJhbSkgLT5cbiAgcmV0ID0ge31cbiAgICBcbiAgaWYgT0ouZ2xvYmFsLmxvY2F0aW9uXG4gICAgcGFyYW1zID0gIE9KLmdsb2JhbC5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpLnNwbGl0ICcmJ1xuICAgIGlmIHBhcmFtc1xuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBwYXJhbXMubGVuZ3RoXG4gICAgICAgIHBybSA9IHBhcmFtc1tpXS5zcGxpdCAnPSdcbiAgICAgICAgaWYgcHJtLmxlbmd0aCBpcyAyIFxuICAgICAgICAgIHJldFtwcm1bMF1dID0gT0ouZ2xvYmFsLmRlY29kZVVSSUNvbXBvbmVudCBwcm1bMV0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKVxuICAgICAgICBpICs9IDFcbiAgcmV0XG4gICAgXG5PSi5yZWdpc3RlciAncXVlcnlTdHJpbmcnLHF1ZXJ5U3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IHF1ZXJ5U3RyaW5nIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbmVhY2ggPSByZXF1aXJlICcuL2VhY2gnXG5cbiMgIyByYW5nZXNcblxucm5nID1cblxuICAjICMjIHJhbmdlXG4gICMgVXNpbmcgW0xvLURhc2hdKGh0dHA6Ly9sb2Rhc2guY29tL2RvY3MjcmFuZ2UpJ3MgYHJhbmdlYCBtZXRob2RcbiAgcmFuZ2U6IChwYXJhbXMuLi4pIC0+XG4gICAgXy5yYW5nZSBwYXJhbXMuLi5cblxuICAjICMjIHJhbmdlTWluXG4gICMgVXNpbmcgW0xvLURhc2hdKGh0dHA6Ly9sb2Rhc2guY29tL2RvY3MjbWluKSdzIGBtaW5gIG1ldGhvZFxuICByYW5nZU1pbjogKHBhcmFtcy4uLikgLT5cbiAgICBfLm1pbiBwYXJhbXMuLi5cblxuICAjICMjIHJhbmdlTWF4XG4gICMgVXNpbmcgW0xvLURhc2hdKGh0dHA6Ly9sb2Rhc2guY29tL2RvY3MjbWF4KSdzIGBtYXhgIG1ldGhvZFxuICByYW5nZU1heDogKHBhcmFtcy4uLikgLT5cbiAgICBfLm1heCBwYXJhbXMuLi5cblxuICAjICMjIHN0cmluZ1JhbmdlVG9TdWJSYW5nZXNcbiAgIyMjXG4gIFRha2UgYW4gYXJyYXkgb2Ygc3RyaW5nIHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXG4gIFVzZXMgdGhlIGZpcnN0IGxldHRlciBvZiBlYWNoIHN0cmluZyB2YWx1ZSBpbiB0aGUgYXJyYXkgdG8gY29udmVydCB0byB1bmlxdWUgY29kZSBjaGFyYWN0ZXIgKGxvd2VyIGNhc2UpXG4gIEJ1aWxkcyBhIGludCByYW5nZSBiYXNlZCBvbiB1bmlxdWUgY29kZSBjaGFycy5cbiAgIyMjXG4gIHN0cmluZ1RvU3ViUmFuZ2VzOiAobiA9IDYsIHJhbmdlID0gW10pIC0+XG4gICAgY2hhclJhbmdlID0gW11cblxuXG4gICAgZWFjaCByYW5nZSwgKHZhbCkgLT5cbiAgICAgIGNoYXIgPSB2YWwudHJpbSgpWzBdLnRvTG93ZXJDYXNlKClcbiAgICAgIGlmIGZhbHNlIGlzIG9iai5jb250YWlucyBjaGFyUmFuZ2UsIGNoYXJcbiAgICAgICAgY2hhclJhbmdlLnB1c2ggY2hhci5jaGFyQ29kZUF0KClcblxuICAgIHJldCA9IHJuZy50b1N1YlJhbmdlcyBuLCBjaGFyUmFuZ2VcblxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IG5cbiAgICAgIGkgKz0gMVxuICAgICAgc3ViUmFuZ2UgPSByZXRbaV1cbiAgICAgIHN1YlJhbmdlLm1hcCBTdHJpbmcuZnJvbUNoYXJDb2RlXG5cbiAgICBvbGRHZXRSYW5nZSA9IHJldC5nZXRSYW5nZVxuICAgIHJldC5nZXRSYW5nZSA9ICh2YWwpIC0+XG4gICAgICBjaGFyID0gdmFsLnRyaW0oKVswXS50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoKVxuICAgICAgaWR4ID0gb2xkR2V0UmFuZ2UgY2hhclxuICAgICAgaWR4XG4gICAgcmV0XG5cbiAgIyAjIyByYW5nZVRvU3ViUmFuZ2VzXG4gICMjI1xuICBUYWtlIGFuIGFycmF5IG9mIGludCB2YWx1ZXMgYW5kIGEgbnVtYmVyIG9mIHBhcnRpdGlvbnMgdG8gY3JlYXRlLlxuICBEaXZpZGVzIHRoZSBvcmlnaW5hbCBhcnJheSBpbnRvIHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIHN1YiBhcnJheXMuXG4gIE92ZXJmbG93IGlzIHBhc3NlZCB0byB0aGUgZmluYWwgcGFydGl0aW9uLlxuICAjIyNcbiAgdG9TdWJSYW5nZXM6IChuID0gNiwgcmFuZ2UgPSBbXSkgLT5cbiAgICByZXQgPSBvYmoub2JqZWN0KClcbiAgICByYW5nZUxvdyA9IHJuZy5yYW5nZU1pbiByYW5nZVxuICAgIHJhbmdlSGlnaCA9IHJuZy5yYW5nZU1heCByYW5nZVxuXG4gICAgZGlzdGFuY2UgPSByYW5nZUhpZ2ggLSByYW5nZUxvd1xuICAgIHN1YlJhbmdlU2l6ZSA9IGRpc3RhbmNlL25cbiAgICBzdWJSYW5nZXMgPSByZXQuYWRkICdyYW5nZXMnLCBvYmoub2JqZWN0KClcbiAgICBjaHVua1ZhbCA9IHJhbmdlTG93XG5cbiAgICBtYXAgPSBvYmoub2JqZWN0KClcblxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IG5cbiAgICAgIGkgKz0gMVxuICAgICAgaWYgaSA8IG4gdGhlbiBqdW1wID0gTWF0aC5yb3VuZCBzdWJSYW5nZVNpemVcbiAgICAgIGVsc2VcbiAgICAgICAganVtcCA9IE1hdGguZmxvb3Igc3ViUmFuZ2VTaXplXG4gICAgICAgIGlmIGNodW5rVmFsICsganVtcCA8PSByYW5nZUhpZ2hcbiAgICAgICAgICBqdW1wICs9IHJhbmdlSGlnaCAtIGNodW5rVmFsIC0ganVtcCArIDFcblxuICAgICAgc3ViUmFuZ2UgPSBybmcucmFuZ2UgY2h1bmtWYWwsIGNodW5rVmFsICsganVtcFxuICAgICAgZWFjaCBzdWJSYW5nZSwgKHZhbCkgLT4gbWFwLmFkZCB2YWwsIGlcbiAgICAgIHN1YlJhbmdlc1tpXSA9IHN1YlJhbmdlXG4gICAgICBjaHVua1ZhbCArPSBqdW1wXG5cbiAgICByZXQuYWRkICdnZXRSYW5nZScsICh2YWwpIC0+XG4gICAgICBtYXBbdmFsXVxuXG4gICAgcmV0XG5cbk9iamVjdC5zZWFsIHJuZ1xuT2JqZWN0LmZyZWV6ZSBybmdcblxuT0oucmVnaXN0ZXIgJ3JhbmdlcycsIHJuZ1xubW9kdWxlLmV4cG9ydHMgPSBybmdcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbklTID0gcmVxdWlyZSAnLi9pcydcblxuIyAjIHRvXG5jbGFzcyBUTyBcbiAgIyAjIyBib29sXG4gICMgY29udmVydCBhbnkgY29tcGF0aWJsZSBvYmplY3QgdG8gYSBib29sZWFuLiBJbmNvbXBhdGlibGUgb2JqZWN0cyBhcmUgZmFsc2UuXG4gIEBib29sOiAoc3RyKSAtPlxuICAgIHJldEJvb2wgPSBJU1sndHJ1ZSddKHN0cilcbiAgICByZXRCb29sID0gZmFsc2UgIGlmIHJldEJvb2wgaXMgZmFsc2Ugb3IgcmV0Qm9vbCBpc250IHRydWVcbiAgICByZXRCb29sXG5cbiAgIyAjIyBFUzVfVG9Cb29sXG4gICMgKGRlYnVnKSBtZXRob2QgdG8gZXhwbGljaXRseSBmb3JjZSBhbiBgaWYob2JqKWAgZXZhbHVhdGlvbiB0byBmbG93IHRocm91Z2ggdGhlIEVTNSBzcGVjIGZvciB0cnV0aGluZXNzXG4gIEBFUzVfVG9Cb29sOiAodmFsKSAtPlxuICAgIHZhbCBpc250IGZhbHNlIGFuZCB2YWwgaXNudCAwIGFuZCB2YWwgaXNudCAnJyBhbmQgdmFsIGlzbnQgbnVsbCBhbmQgdHlwZW9mIHZhbCBpc250ICd1bmRlZmluZWQnIGFuZCAodHlwZW9mIHZhbCBpc250ICdudW1iZXInIG9yIG5vdCBpc05hTih2YWwpKVxuXG4gICMgIyMgZGF0ZUZyb21UaWNrc1xuICAjIHRha2UgYSBudW1iZXIgcmVwcmVzZW50aW5nIHRpY2tzIGFuZCBjb252ZXJ0IGl0IGludG8gYW4gaW5zdGFuY2Ugb2YgRGF0ZVxuICBAZGF0ZUZyb21UaWNrczogKHRpY2tTdHIpIC0+XG4gICAgdGljc0RhdGVUaW1lID0gQHN0cmluZyh0aWNrU3RyKVxuICAgIHJldCA9IHVuZGVmaW5lZFxuICAgIHRpY2tzID0gdW5kZWZpbmVkXG4gICAgb2Zmc2V0ID0gdW5kZWZpbmVkXG4gICAgbG9jYWxPZmZzZXQgPSB1bmRlZmluZWRcbiAgICBhcnIgPSB1bmRlZmluZWRcbiAgICBpZiBmYWxzZSBpcyBJUy5udWxsT3JFbXB0eSh0aWNzRGF0ZVRpbWUpXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnLycsICcnKVxuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJ0RhdGUnLCAnJylcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcoJywgJycpXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnKScsICcnKVxuICAgICAgYXJyID0gdGljc0RhdGVUaW1lLnNwbGl0KCctJylcbiAgICAgIGlmIGFyci5sZW5ndGggPiAxXG4gICAgICAgIHRpY2tzID0gQG51bWJlcihhcnJbMF0pXG4gICAgICAgIG9mZnNldCA9IEBudW1iZXIoYXJyWzFdKVxuICAgICAgICBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKVxuICAgICAgICByZXQgPSBuZXcgRGF0ZSgodGlja3MgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpXG4gICAgICBlbHNlIGlmIGFyci5sZW5ndGggaXMgMVxuICAgICAgICB0aWNrcyA9IEBudW1iZXIoYXJyWzBdKVxuICAgICAgICByZXQgPSBuZXcgRGF0ZSh0aWNrcylcbiAgICByZXRcblxuICAjICMjIGJpbmFyeVxuICAjIGNvbnZlcnQgYW4gb2JqZWN0IHRvIGJpbmFyeSAwIG9yIDFcbiAgQGJpbmFyeTogKG9iaikgLT5cbiAgICByZXQgPSBOYU5cbiAgICBpZiBvYmogaXMgMCBvciBvYmogaXMgJzAnIG9yIG9iaiBpcyAnJyBvciBvYmogaXMgZmFsc2Ugb3IgQHN0cmluZyhvYmopLnRvTG93ZXJDYXNlKCkudHJpbSgpIGlzICdmYWxzZSdcbiAgICAgIHJldCA9IDBcbiAgICBlbHNlIHJldCA9IDEgIGlmIG9iaiBpcyAxIG9yIG9iaiBpcyAnMScgb3Igb2JqIGlzIHRydWUgb3IgQHN0cmluZyhvYmopLnRvTG93ZXJDYXNlKCkudHJpbSgpIGlzICd0cnVlJ1xuICAgIHJldFxuXG5cbiAgIyAjIyBudW1iZXJcbiAgI1xuICAjIEF0dGVtcHRzIHRvIGNvbnZlcnQgYW4gYXJiaXRyYXJ5IHZhbHVlIHRvIGEgTnVtYmVyLlxuICAjIExvb3NlIGZhbHN5IHZhbHVlcyBhcmUgY29udmVydGVkIHRvIDAuXG4gICMgTG9vc2UgdHJ1dGh5IHZhbHVlcyBhcmUgY29udmVydGVkIHRvIDEuXG4gICMgQWxsIG90aGVyIHZhbHVlcyBhcmUgcGFyc2VkIGFzIEludGVnZXJzLlxuICAjIEZhaWx1cmVzIHJldHVybiBhcyBOYU4uXG4gICNcbiAgQG51bWJlcjogKGlucHV0TnVtLCBkZWZhdWx0TnVtKSAtPlxuICAgIHRyeUdldE51bWJlciA9ICh2YWwpID0+XG4gICAgICByZXQgPSBOYU5cbiAgICAgICMgaWYgYHZhbGAgYWxyZWFkeSAoaXMpW2lzLmh0bWxdIGEgTnVtYmVyLCByZXR1cm4gaXRcbiAgICAgIGlmIElTLm51bWJlcih2YWwpXG4gICAgICAgIHJldCA9IHZhbFxuICAgICAgIyBlbHNlIGlmIGB2YWxgIGFscmVhZHkgKGlzKVtpcy5odG1sXSBhIFN0cmluZyBvciBhIEJvb2xlYW4sIGNvbnZlcnQgaXRcbiAgICAgIGVsc2UgaWYgSVMuc3RyaW5nKHZhbCkgb3IgSVMuYm9vbCh2YWwpXG4gICAgICAgIHRyeUdldCA9ICh2YWx1ZSkgPT5cbiAgICAgICAgICBudW0gPSBAYmluYXJ5KHZhbHVlKVxuICAgICAgICAgIG51bSA9ICt2YWx1ZSAgaWYgbm90IElTLm51bWJlcihudW0pIGFuZCB2YWx1ZVxuICAgICAgICAgIG51bSA9IF8ucGFyc2VJbnQodmFsdWUsIDApIGlmIG5vdCBJUy5udW1iZXIobnVtKVxuICAgICAgICAgIG51bVxuICAgICAgICByZXQgPSB0cnlHZXQgdmFsXG4gICAgICByZXRcblxuICAgIHJldFZhbCA9IHRyeUdldE51bWJlcihpbnB1dE51bSlcbiAgICBpZiBub3QgSVMubnVtYmVyKHJldFZhbClcbiAgICAgIHJldFZhbCA9IHRyeUdldE51bWJlcihkZWZhdWx0TnVtKVxuICAgICAgcmV0VmFsID0gTnVtYmVyLk5hTiBpZiBub3QgSVMubnVtYmVyKHJldFZhbClcbiAgICByZXRWYWxcblxuICAjICMjIHN0cmluZ1xuICAjIGNvbnZlcnQgYW4gb2JqZWN0IHRvIHN0cmluZ1xuICBAc3RyaW5nOiAoaW5wdXRTdHIsIGRlZmF1bHRTdHIpIC0+XG4gICAgdHJ5R2V0U3RyaW5nID0gKHN0cikgPT5cbiAgICAgIHJldCA9IHVuZGVmaW5lZFxuICAgICAgaWYgSVMuc3RyaW5nKHN0cilcbiAgICAgICAgcmV0ID0gc3RyXG4gICAgICBlbHNlXG4gICAgICAgIHJldCA9ICcnXG4gICAgICAgIHJldCA9IHN0ci50b1N0cmluZygpICBpZiBJUy5ib29sKHN0cikgb3IgSVMubnVtYmVyKHN0cikgb3IgSVMuZGF0ZShzdHIpXG4gICAgICByZXRcbiAgICByZXQxID0gdHJ5R2V0U3RyaW5nKGlucHV0U3RyKVxuICAgIHJldDIgPSB0cnlHZXRTdHJpbmcoZGVmYXVsdFN0cilcbiAgICByZXRWYWwgPSAnJ1xuICAgIGlmIHJldDEubGVuZ3RoIGlzbnQgMFxuICAgICAgcmV0VmFsID0gcmV0MVxuICAgIGVsc2UgaWYgcmV0MSBpcyByZXQyIG9yIHJldDIubGVuZ3RoIGlzIDBcbiAgICAgIHJldFZhbCA9IHJldDFcbiAgICBlbHNlXG4gICAgICByZXRWYWwgPSByZXQyXG4gICAgcmV0VmFsXG5cbk9KLnJlZ2lzdGVyICd0bycsIFRPXG5tb2R1bGUuZXhwb3J0cyA9IFRPIiwiIyAjIGNyZWF0ZVVVSURcblxuT0ogPSByZXF1aXJlICcuLi9vaidcbiAgXG4jIyNcbkdlbmVyYXRlcyBhIHJhbmRvbSBzdHJpbmcgdGhhdCBjb21wbGllcyB0byB0aGUgUkZDIDQxMjIgc3BlY2lmaWNhdGlvbiBmb3IgR1VJRC9VVUlELlxuKGUuZy4gJ0I0MkExNTNGLTFEOUEtNEY5Mi05OTAzLTkyQzExREQ2ODREMicpXG5XaGlsZSBub3QgYSB0cnVlIFVVSUQsIGZvciB0aGUgcHVycG9zZXMgb2YgdGhpcyBhcHBsaWNhdGlvbiwgaXQgc2hvdWxkIGJlIHN1ZmZpY2llbnQuXG4jIyNcbmNyZWF0ZUZhdXhVVUlEID0gLT5cbiAgICBcbiAgIyBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmM0MTIyLnR4dFxuICAjIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1MDM0L2hvdy10by1jcmVhdGUtYS1ndWlkLXV1aWQtaW4tamF2YXNjcmlwdFxuICBzID0gW11cbiAgcy5sZW5ndGggPSAzNlxuICBoZXhEaWdpdHMgPSAnMDEyMzQ1Njc4OWFiY2RlZidcbiAgaSA9IDBcblxuICB3aGlsZSBpIDwgMzZcbiAgICBzW2ldID0gaGV4RGlnaXRzLnN1YnN0cihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAweDEwKSwgMSlcbiAgICBpICs9IDFcbiAgc1sxNF0gPSAnNCcgIyBiaXRzIDEyLTE1IG9mIHRoZSB0aW1lX2hpX2FuZF92ZXJzaW9uIGZpZWxkIHRvIDAwMTBcbiAgc1sxOV0gPSBoZXhEaWdpdHMuc3Vic3RyKChzWzE5XSAmIDB4MykgfCAweDgsIDEpICMgYml0cyA2LTcgb2YgdGhlIGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWQgdG8gMDFcbiAgc1s4XSA9IHNbMTNdID0gc1sxOF0gPSBzWzIzXSA9ICctJ1xuICB1dWlkID0gcy5qb2luKCcnKVxuICB1dWlkXG5cbk9KLnJlZ2lzdGVyICdjcmVhdGVVVUlEJywgY3JlYXRlRmF1eFVVSURcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRmF1eFVVSUQiXX0=
