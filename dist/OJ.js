/**
 * ojs: OJ is a framework for writing web components and templates in frothy CoffeeScript or pure JavaScript. OJ provides a mechanism to rapidly build web applications using well encapsulated, modular code that doesn't rely on string templating or partially baked web standards.
 * @version: v0.4.38
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

require('./dom/Node.coffee');

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



},{"./async/ajax.coffee":2,"./async/promise.coffee":3,"./components/grid.coffee":4,"./components/inputgroup.coffee":5,"./components/tabs.coffee":6,"./components/tile.coffee":7,"./controls/icon.coffee":8,"./core/date.coffee":9,"./core/function.coffee":10,"./core/number.coffee":11,"./core/object.coffee":12,"./core/string.coffee":14,"./dom/Node.coffee":15,"./dom/body.coffee":16,"./dom/component.coffee":17,"./dom/control.coffee":18,"./dom/element.coffee":19,"./dom/fragment.coffee":20,"./dom/generics.coffee":21,"./dom/input.coffee":22,"./dom/nodeFactory.coffee":23,"./elements/a.coffee":24,"./elements/br.coffee":25,"./elements/form.coffee":26,"./elements/input.coffee":27,"./elements/ol.coffee":28,"./elements/select.coffee":29,"./elements/table.coffee":30,"./elements/textarea.coffee":31,"./elements/thead.coffee":32,"./elements/ul.coffee":33,"./inputs/buttoninput.coffee":35,"./inputs/checkbox.coffee":36,"./inputs/color.coffee":37,"./inputs/date.coffee":38,"./inputs/datetime.coffee":39,"./inputs/datetimelocal.coffee":40,"./inputs/email.coffee":41,"./inputs/file.coffee":42,"./inputs/hidden.coffee":43,"./inputs/imageinput.coffee":44,"./inputs/month.coffee":45,"./inputs/number.coffee":46,"./inputs/password.coffee":47,"./inputs/radio.coffee":48,"./inputs/range.coffee":49,"./inputs/reset.coffee":50,"./inputs/search.coffee":51,"./inputs/submit.coffee":52,"./inputs/tel.coffee":53,"./inputs/textinput.coffee":54,"./inputs/time.coffee":55,"./inputs/url.coffee":56,"./inputs/week.coffee":57,"./oj.coffee":58,"./ojInit.coffee":59,"./tools/array2D.coffee":61,"./tools/console.coffee":62,"./tools/cookie.coffee":63,"./tools/defer.coffee":64,"./tools/each.coffee":65,"./tools/enums.coffee":66,"./tools/history.coffee":67,"./tools/is.coffee":68,"./tools/noty.coffee":69,"./tools/pubsub.coffee":70,"./tools/queryString.coffee":71,"./tools/ranges.coffee":72,"./tools/to.coffee":73,"./tools/uuid.coffee":74}],2:[function(require,module,exports){
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



},{"../dom/component":17,"../oj":58,"../ojInit":59,"../tools/array2D":61}],5:[function(require,module,exports){
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



},{"../dom/component":17,"../oj":58,"../ojInit":59,"../tools/uuid":74}],6:[function(require,module,exports){
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



},{"../dom/component":17,"../oj":58,"../ojInit":59}],7:[function(require,module,exports){
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



},{"../dom/component":17,"../oj":58,"../ojInit":59}],8:[function(require,module,exports){
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



},{"../dom/control":18,"../oj":58,"../ojInit":59}],9:[function(require,module,exports){
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
var $, OJ, func, isMethod, property, retObj, to, _;

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
var $, Node, OJ,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

Node = (function() {
  function Node(el, parent) {
    var enabled;
    this.el = el;
    this.parent = parent;
    this.disable = __bind(this.disable, this);
    enabled = true;
    this.tagName = this.el.tagName;
    this['$'] = $(this.el.get());
    this['0'] = this.el.get();
  }

  Node.prototype.append = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).append.apply(_ref, params);
  };

  Node.prototype.prepend = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).prepend.apply(_ref, params);
  };

  Node.prototype.remove = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).remove.apply(_ref, params);
  };

  Node.prototype.css = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).css.apply(_ref, params);
  };

  Node.prototype.html = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).html.apply(_ref, params);
  };

  Node.prototype.text = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).text.apply(_ref, params);
  };

  Node.prototype.attr = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).attr.apply(_ref, params);
  };

  Node.prototype.data = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).data.apply(_ref, params);
  };

  Node.prototype.get = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).get.apply(_ref, params);
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
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this['$']).hasClass.apply(_ref, params);
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
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this['$']).prop.apply(_ref, params);
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
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if (this.isControlStillValid()) {
      (_ref = this['$']).toggleClass.apply(_ref, params);
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

},{"../oj":58,"../tools/is":68,"../tools/to":73}],16:[function(require,module,exports){
(function (global){
var OJ, ThinDOM, body, nodeFactory, thinBody, _;

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

},{"../oj":58,"./nodeFactory":23}],17:[function(require,module,exports){
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



},{"../core/object":12,"../oj":58,"./nodeFactory":23}],18:[function(require,module,exports){
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



},{"../core/object":12,"../oj":58,"./nodeFactory":23}],19:[function(require,module,exports){
(function (global){
var $, OJ, ThinDOM, element, _;

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

},{"../oj":58,"./nodeFactory":23}],20:[function(require,module,exports){
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



},{"../oj":58,"./nodeFactory":23}],21:[function(require,module,exports){
var OJ, all, closed, exports, loopName, nodeFactory, obj, open, _fn, _i, _len;

OJ = require('../oj');

require('../ojInit');

obj = require('../core/object');

nodeFactory = require('./nodeFactory');

closed = ['abbr', 'acronym', 'applet', 'article', 'aside', 'audio', 'b', 'bdo', 'big', 'blockquote', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dir', 'div', 'dl', 'dt', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'html', 'i', 'iframe', 'ins', 'kbd', 'label', 'legend', 'li', 'map', 'mark', 'menu', 'meter', 'nav', 'noframes', 'noscript', 'object', 'optgroup', 'option', 'output', 'p', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'section', 'small', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'tbody', 'td', 'tfoot', 'th', 'time', 'title', 'tr', 'tt', 'u', 'var', 'video', 'xmp'];

open = 'area base col command css embed hr img keygen meta param source track wbr'.split(' ');

all = closed.concat(open);

exports = {};

_fn = function(tag) {
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
for (_i = 0, _len = all.length; _i < _len; _i++) {
  loopName = all[_i];
  _fn(loopName);
}

module.exports = exports;



},{"../core/object":12,"../oj":58,"../ojInit":59,"./nodeFactory":23}],22:[function(require,module,exports){
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



},{"../oj":58}],23:[function(require,module,exports){
(function (global){
var Node, NodeFactory, OJ, ThinDOM, getNodeFromFactory, _,
  __slice = [].slice;

OJ = require('../oj');

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

ThinDOM = (typeof window !== "undefined" ? window.ThinDOM : typeof global !== "undefined" ? global.ThinDOM : null);

Node = require('./Node');

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
              event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
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

  function NodeFactory(tag, options, owner, thinNode) {
    this.tag = tag;
    this.options = options;
    this.owner = owner;
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
    var count, finalize, _ref;
    this.ojNode = null;
    if ((_ref = this.thinNode) != null ? _ref.isFullyInit : void 0) {
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

},{"../oj":58,"../tools/is":68,"./Node":15}],24:[function(require,module,exports){
var OJ, node, nodeFactory, nodeName,
  __slice = [].slice;

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
  __slice = [].slice;

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
  __slice = [].slice;

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
var $, JsonToTable, OJ, array2D, node, nodeFactory, nodeName, _;

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
    var c, memCell, memRow, r, _results;
    r = 0;
    _results = [];
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
  __slice = [].slice;

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



},{"../core/object":12,"../dom/input":22,"../oj":58}],36:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../oj":58}],37:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../oj":58}],38:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../oj":58}],39:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],40:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],41:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],42:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],43:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],44:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],45:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],46:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],47:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],48:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],49:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],50:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],51:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],52:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],53:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],54:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],55:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],56:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],57:[function(require,module,exports){
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



},{"../core/object":12,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],58:[function(require,module,exports){
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
var OJ, subNameSpaces, _;

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
  __slice = [].slice;

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
      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
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
var OJ, each, obj, rng, _,
  __slice = [].slice;

OJ = require('../oj');

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

obj = require('../core/object');

each = require('./each');

rng = {
  range: function() {
    var params;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.range.apply(_, params);
  },
  rangeMin: function() {
    var params;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return _.min.apply(_, params);
  },
  rangeMax: function() {
    var params;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbnRyeXBvaW50LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcYXN5bmNcXGFqYXguY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxhc3luY1xccHJvbWlzZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXGdyaWQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb21wb25lbnRzXFxpbnB1dGdyb3VwLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGFicy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXHRpbGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb250cm9sc1xcaWNvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGRhdGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxmdW5jdGlvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG51bWJlci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG9iamVjdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXHByb3BlcnR5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxcc3RyaW5nLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxOb2RlLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxib2R5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxjb21wb25lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGNvbnRyb2wuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGVsZW1lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGZyYWdtZW50LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxnZW5lcmljcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcaW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXG5vZGVGYWN0b3J5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGEuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcYnIuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcZm9ybS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxpbnB1dC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxvbC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxzZWxlY3QuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdGFibGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdGV4dGFyZWEuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdGhlYWQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdWwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxnbG9iYWwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGJ1dHRvbmlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxjaGVja2JveC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcY29sb3IuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGRhdGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGRhdGV0aW1lLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxkYXRldGltZWxvY2FsLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxlbWFpbC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZmlsZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcaGlkZGVuLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxpbWFnZWlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxtb250aC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcbnVtYmVyLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxwYXNzd29yZC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xccmFkaW8uY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJhbmdlLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxyZXNldC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcc2VhcmNoLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxzdWJtaXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHRlbC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdGV4dGlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx0aW1lLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx1cmwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHdlZWsuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxvai5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXG9qSW5pdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxKc29uVG9UYWJsZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxhcnJheTJELmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGNvbnNvbGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcY29va2llLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGRlZmVyLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGVhY2guY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZW51bXMuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcaGlzdG9yeS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxpcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxub3R5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHB1YnN1Yi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxxdWVyeVN0cmluZy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxyYW5nZXMuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcdG8uY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcdXVpZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxPQUFBLENBQVEsYUFBUixDQUFBLENBQUE7O0FBQUEsT0FDQSxDQUFRLGlCQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLENBQVEscUJBQVIsQ0FGQSxDQUFBOztBQUFBLE9BR0EsQ0FBUSx3QkFBUixDQUhBLENBQUE7O0FBQUEsT0FJQSxDQUFRLDBCQUFSLENBSkEsQ0FBQTs7QUFBQSxPQUtBLENBQVEsZ0NBQVIsQ0FMQSxDQUFBOztBQUFBLE9BTUEsQ0FBUSwwQkFBUixDQU5BLENBQUE7O0FBQUEsT0FPQSxDQUFRLDBCQUFSLENBUEEsQ0FBQTs7QUFBQSxPQVFBLENBQVEsd0JBQVIsQ0FSQSxDQUFBOztBQUFBLE9BU0EsQ0FBUSxvQkFBUixDQVRBLENBQUE7O0FBQUEsT0FVQSxDQUFRLHdCQUFSLENBVkEsQ0FBQTs7QUFBQSxPQVdBLENBQVEsc0JBQVIsQ0FYQSxDQUFBOztBQUFBLE9BWUEsQ0FBUSxzQkFBUixDQVpBLENBQUE7O0FBQUEsT0FhQSxDQUFRLHNCQUFSLENBYkEsQ0FBQTs7QUFBQSxPQWNBLENBQVEsMEJBQVIsQ0FkQSxDQUFBOztBQUFBLE9BZUEsQ0FBUSxtQkFBUixDQWZBLENBQUE7O0FBQUEsT0Fn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QUEsSUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0FoTUY7QUFBQSxFQTJNQSxNQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0E1TUY7QUFBQSxFQXVOQSxHQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0F4TkY7QUFBQSxFQW1PQSxJQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sTUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtL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QUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLElBQTNCLENBQWpCLEVBQW1ELENBQW5ELENBQVAsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxJQUFLLENBREwsQ0FERjtFQUFBLENBTEE7QUFBQSxFQVFBLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxHQVJSLENBQUE7QUFBQSxFQVNBLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxTQUFTLENBQUMsTUFBVixDQUFpQixDQUFDLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxHQUFULENBQUEsR0FBZ0IsR0FBakMsRUFBc0MsQ0FBdEMsQ0FUUixDQUFBO0FBQUEsRUFVQSxDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU8sQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsR0FWL0IsQ0FBQTtBQUFBLEVBV0EsSUFBQSxHQUFPLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUCxDQVhQLENBQUE7U0FZQSxLQWhCZTtBQUFBLENBUGpCLENBQUE7O0FBQUEsRUF5QkUsQ0FBQyxRQUFILENBQVksWUFBWixFQUEwQixjQUExQixDQXpCQSxDQUFBOztBQUFBLE1BMEJNLENBQUMsT0FBUCxHQUFpQixjQTFCakIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlICcuL29qLmNvZmZlZSdcclxucmVxdWlyZSAnLi9vakluaXQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2FzeW5jL2FqYXguY29mZmVlJ1xyXG5yZXF1aXJlICcuL2FzeW5jL3Byb21pc2UuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvZ3JpZC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29tcG9uZW50cy9pbnB1dGdyb3VwLmNvZmZlZSdcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL3RhYnMuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvdGlsZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29udHJvbHMvaWNvbi5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29yZS9kYXRlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9jb3JlL2Z1bmN0aW9uLmNvZmZlZSdcclxucmVxdWlyZSAnLi9jb3JlL251bWJlci5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29yZS9vYmplY3QuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvcmUvc3RyaW5nLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vbm9kZUZhY3RvcnkuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RvbS9ib2R5LmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vY29tcG9uZW50LmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vY29udHJvbC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZG9tL05vZGUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RvbS9lbGVtZW50LmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vZnJhZ21lbnQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RvbS9nZW5lcmljcy5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZG9tL2lucHV0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy9hLmNvZmZlZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy9ici5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvZm9ybS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvaW5wdXQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL29sLmNvZmZlZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy9zZWxlY3QuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RhYmxlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy90ZXh0YXJlYS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvdGhlYWQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3VsLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvYnV0dG9uaW5wdXQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9jaGVja2JveC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2NvbG9yLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2RhdGV0aW1lLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZXRpbWVsb2NhbC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2VtYWlsLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvZmlsZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2hpZGRlbi5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2ltYWdlaW5wdXQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9tb250aC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL251bWJlci5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3Bhc3N3b3JkLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvcmFkaW8uY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9yYW5nZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3Jlc2V0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvc2VhcmNoLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvc3VibWl0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvdGVsLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvdGV4dGlucHV0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvdGltZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3VybC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3dlZWsuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2FycmF5MkQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2NvbnNvbGUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2Nvb2tpZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvZGVmZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2VhY2guY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2VudW1zLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9oaXN0b3J5LmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9pcy5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvbm90eS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvcHVic3ViLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9xdWVyeVN0cmluZy5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvcmFuZ2VzLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy90by5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvdXVpZC5jb2ZmZWUnIiwiIyAjIGFqYXhcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG5jb25maWcgPSB7fVxyXG4gIFxyXG4jIGRlZmluZSBhIHN0YW5kYXJkIG9uIHN1Y2Nlc3MgaGFuZGxlciwgd3JpdGUgb3V0IHRoZSByZXF1ZXN0IHN0YXRzIHRvIGEgdGFibGVcclxuY29uZmlnLm9uU3VjY2VzcyA9IChvcHRzLCBkYXRhLCB1cmwpIC0+XHJcbiAgcmVzcG9uc2UgPSB7fVxyXG4gIE9KLmV4dGVuZCByZXNwb25zZSwgZGF0YVxyXG4gIG9wdHMub25TdWNjZXNzIHJlc3BvbnNlXHJcbiAgaWYgT0ouTE9HX0FMTF9BSkFYXHJcbiAgICBPSi5jb25zb2xlLnRhYmxlIFtcclxuICAgICAgV2Vic2VydmljZTogb3B0cy5hamF4T3B0cy51cmxcclxuICAgICAgU3RhcnRUaW1lOiBvcHRzLnN0YXJ0VGltZVxyXG4gICAgICBFbmRUaW1lOiBuZXcgRGF0ZSgpXHJcbiAgICBdIFxyXG4gIHJldHVyblxyXG4gIFxyXG4jIGRlZmluZSBhIHN0YW5kYXJkIG9uIGVycm9yIGhhbmRsZXIsIHdyaXRlIG91dCB0aGUgcmVxdWVzdCBlcnJvciBjb25leHQgdG8gYSB0YWJsZVxyXG5jb25maWcub25FcnJvciA9ICh4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cywgcGFyYW0xLCBvcHRzID0gT0oub2JqZWN0KCkpIC0+XHJcbiAgaWYgdGV4dFN0YXR1cyBpc250ICdhYm9ydCdcclxuICAgIGlmIE9KLkxPR19BTExfQUpBWF9FUlJPUlNcclxuICAgICAgT0ouY29uc29sZS50YWJsZSBbXHJcbiAgICAgICAgV2Vic2VydmljZTogb3B0cy5hamF4T3B0cy51cmxcclxuICAgICAgICBEYXRhOiBvcHRzLmFqYXhPcHRzLmRhdGFcclxuICAgICAgICBGYWlsZWQ6IHRleHRTdGF0dXNcclxuICAgICAgICBTdGF0ZTogeG1sSHR0cFJlcXVlc3Quc3RhdGUoKVxyXG4gICAgICAgIFN0YXR1czogeG1sSHR0cFJlcXVlc3Quc3RhdHVzXHJcbiAgICAgICAgU3RhdHVzVGV4dDogeG1sSHR0cFJlcXVlc3Quc3RhdHVzVGV4dFxyXG4gICAgICAgIFJlYWR5U3RhdGU6IHhtbEh0dHBSZXF1ZXN0LnJlYWR5U3RhdGVcclxuICAgICAgICBSZXNwb25zZVRleHQ6IHhtbEh0dHBSZXF1ZXN0LnJlc3BvbnNlVGV4dFxyXG4gICAgICBdXHJcblxyXG4gICAgb3B0cy5vbkVycm9yIHRleHRTdGF0dXNcclxuICByZXR1cm5cclxuICBcclxuIyBpbiB0aGUgY2FzZSB3aGVyZSBgb3B0c2AgaXMgYSBzdHJpbmcsIGNvbnZlcnQgaXQgdG8gYW4gb2JqZWN0XHJcbm9wdHNGcm9tVXJsID0gKG9wdHMpIC0+XHJcbiAgaWYgT0ouaXMuc3RyaW5nIG9wdHNcclxuICAgIHVybCA9IG9wdHNcclxuICAgIG9wdHMgPSBPSi5vYmplY3QoKVxyXG4gICAgb3B0cy5hZGQgJ2FqYXhPcHRzJywgT0oub2JqZWN0KClcclxuICAgIG9wdHMuYWpheE9wdHMuYWRkICd1cmwnLCB1cmxcclxuICBvcHRzXHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgYGV4ZWNgIG1ldGhvZCB0byBoYW5kbGUgYWxsIHJlcXVlc3QgdmVyYnMuIFVzZXMgdGhlIFtqUXVlcnkuYWpheF0oaHR0cDovL2FwaS5qcXVlcnkuY29tL2NhdGVnb3J5L2FqYXgvKSBBUEkuXHJcbiMgYGV4ZWNSZXF1ZXN0YCByZXR1cm5zIGEgcHJvbWlzZSByZXByZXNlbnQgdGhlIGFjdHVhbCBBSkFYIGNhbGwuXHJcbiAgXHJcbiMgLSBgdmVyYmAgZGVmYXVsdCB2YWx1ZSA9ICdHRVQnXHJcbiMgLSBgb3B0c2Agb2JqZWN0XHJcbiMgLS0gYG9wdHMuYWpheE9wdHNgIG9iamVjdCBmb3IgYWxsIGpRdWVyeSdzIGFqYXgtc3BlY2lmaWMgcHJvcGVydGllcy5cclxuY29uZmlnLmV4ZWNSZXF1ZXN0ID0gKHZlcmIgPSAnR0VUJywgb3B0cykgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBhamF4T3B0czpcclxuICAgICAgdXJsOiAnJ1xyXG4gICAgICBkYXRhOiB7fVxyXG4gICAgICB0eXBlOiB2ZXJiXHJcbiAgICAgIHhockZpZWxkczpcclxuICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgZGF0YVR5cGU6ICdqc29uJ1xyXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcbiAgICAgICAgXHJcbiAgICBvblN1Y2Nlc3M6IE9KLm5vb3BcclxuICAgIG9uRXJyb3I6IE9KLm5vb3BcclxuICAgIG9uQ29tcGxldGU6IE9KLm5vb3BcclxuICAgIG92ZXJyaWRlRXJyb3I6IGZhbHNlXHJcbiAgICB3YXRjaEdsb2JhbDogdHJ1ZVxyXG4gICAgdXNlQ2FjaGU6IGZhbHNlXHJcbiAgICBcclxuICBvcHRzID0gb3B0c0Zyb21Vcmwgb3B0c1xyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0cywgdHJ1ZVxyXG4gICAgXHJcbiAgZGVmYXVsdHMuc3RhcnRUaW1lID0gbmV3IERhdGUoKVxyXG4gICAgXHJcbiAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgIyBHRVQgcmVxdWVzdHMgZXhwZWN0IHF1ZXJ5U3RyaW5nIHBhcmFtZXRlcnNcclxuICAgIGlmIGRlZmF1bHRzLmFqYXhPcHRzLnZlcmIgaXMgJ0dFVCdcclxuICAgICAgZGVmYXVsdHMuYWpheE9wdHMuZGF0YSA9IE9KLnBhcmFtcyBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXHJcbiAgICAjIGFsbCBvdGhlciByZXF1ZXN0cyB0YWtlIGFuIG9iamVjdFxyXG4gICAgZWxzZVxyXG4gICAgICBkZWZhdWx0cy5hamF4T3B0cy5kYXRhID0gT0ouc2VyaWFsaXplIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcclxuICAgIFxyXG4gIGdldEpRdWVyeURlZmVycmVkID0gKHdhdGNoR2xvYmFsKSAtPlxyXG4gICAgcmV0ID0gJC5hamF4IGRlZmF1bHRzLmFqYXhPcHRzXHJcbiAgICAgIFxyXG4gICAgcmV0LmRvbmUgKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSAtPlxyXG4gICAgICBjb25maWcub25TdWNjZXNzIGRlZmF1bHRzLCBkYXRhXHJcblxyXG4gICAgcmV0LmZhaWwgKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRleHQpIC0+XHJcbiAgICAgIGNvbmZpZy5vbkVycm9yIGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRleHQsIGRlZmF1bHRzXHJcbiAgXHJcbiAgICByZXQuYWx3YXlzICh4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cykgLT5cclxuICAgICAgZGVmYXVsdHMub25Db21wbGV0ZSB4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1c1xyXG5cclxuICAgIE9KLmFzeW5jLmFqYXhQcm9taXNlIHJldFxyXG5cclxuICBwcm9taXNlID0gZ2V0SlF1ZXJ5RGVmZXJyZWQoZGVmYXVsdHMud2F0Y2hHbG9iYWwpXHJcbiAgcHJvbWlzZVxyXG4gIFxyXG5hamF4ID0ge31cclxuICBcclxuIyAjIyBwb3N0XHJcbiMgW09KXShvai5odG1sKS5hamF4LnBvc3Q6IGluc2VydCBhIG5ldyBvYmplY3Qgb3IgaW5pdCBhIGZvcm0gcG9zdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuIFxyXG5hamF4LnBvc3QgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ1BPU1QnLCBvcHRzXHJcbiAgXHJcbiMgIyMgZ2V0XHJcbiMgW09KXShvai5odG1sKS5hamF4LmdldDogZ2V0IGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbiNcclxuYWpheC5nZXQgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ0dFVCcsIG9wdHNcclxuXHJcbiMgIyMgZGVsZXRlXHJcbiMgW09KXShvai5odG1sKS5hamF4LmRlbGV0ZTogZGVsZXRlIGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbmFqYXguZGVsZXRlID0gKG9wdHMpIC0+XHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdERUxFVEUnLCBvcHRzXHJcblxyXG4jICMjIHB1dFxyXG4jIFtPSl0ob2ouaHRtbCkuYWpheC5wdXQ6IHVwZGF0ZSBhbiBleGlzdGluZyBvYmplY3RcclxuICBcclxuIyAtIGBvcHRzYCBjYW4gYmUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgcmVxdWVzdC5cclxuIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxyXG5hamF4LnB1dCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnUFVUJywgb3B0c1xyXG5cclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2FqYXgnLCBhamF4XHJcbm1vZHVsZS5leHBvcnRzID0gYWpheCIsIiMgIyBwcm9taXNlXHJcblxyXG5PSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuIyAjIyBhamF4UHJvbWlzZVxyXG4jIFtPSl0ob2ouaHRtbCkuYXN5bmMuYWpheFByb21pc2UgY29udmVydHMgYW4gQUpBWCBYbWxIdHRwUmVxdWVzdCBpbnRvIGEgUHJvbWlzZS4gXHJcbiMgU2VlIGFsc28gW1Byb21pc2UucmVzb2x2ZV0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG5hamF4UHJvbWlzZSA9IChhamF4KSAtPiBcclxuICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlIGFqYXhcclxuICBwcm9taXNlLmFib3J0ID0gYWpheC5hYm9ydFxyXG4gIHByb21pc2UucmVhZHlTdGF0ZSA9IGFqYXgucmVhZHlTdGF0ZVxyXG4gIHByb21pc2VcclxuXHJcbiMgIyMgYWxsXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5hbGwgdGFrZXMgYW4gYXJyYXkgb2YgZnVuY3Rpb25zIGFuZCByZXR1cm5zIGEgcHJvbWlzZSByZXByZXNlbnRpbmcgdGhlIHN1Y2Nlc3Mgb2YgYWxsIG1ldGhvZHMgb3IgdGhlIGZhaWx1cmUgb2YgYW55IG1ldGhvZC5cclxuIyBTZWUgYWxzbyBbUHJvbWlzZS5hbGxdKGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvYmxvYi9tYXN0ZXIvQVBJLm1kKS5cclxuYWxsID0gKGluaXRBcnJheSkgLT5cclxuICByZXFzID0gaW5pdEFycmF5IG9yIFtdXHJcbiAgcHJvbWlzZSA9IFByb21pc2UuYWxsKHJlcXMpXHJcbiAgcHJvbWlzZS5wdXNoID0gKGl0ZW0pIC0+XHJcbiAgICByZXFzLnB1c2ggaXRlbVxyXG4gICAgcmV0dXJuXHJcbiAgcHJvbWlzZVxyXG5cclxuIyAjIyBkZWZlclxyXG4jIFtPSl0ob2ouaHRtbCkuYXN5bmMuZGVmZXIgY29udmVydHMgYSBmdW5jdGlvbiBpbnRvIGEgUHJvbWlzZSB0byBleGVjdXRlIHRoYXQgZnVuY3Rpb24uIFxyXG4jIFNlZSBhbHNvIFtQcm9taXNlLm1ldGhvZF0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG5kZWZyID0gKGZ1bmMgPSBPSi5ub29wKSAtPlxyXG4gIHJldCA9IFByb21pc2UubWV0aG9kIGZ1bmNcclxuICByZXRcclxuICBcclxuICBcclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2RlZmVyJywgZGVmclxyXG5PSi5hc3luYy5yZWdpc3RlciAnYWxsJywgYWxsXHJcbk9KLmFzeW5jLnJlZ2lzdGVyICdhamF4UHJvbWlzZScsIGFqYXhQcm9taXNlXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbiAgZGVmZXI6IGRlZnJcclxuICBhbGw6IGFsbFxyXG4gIGFqYXhQcm9taXNlOiBhamF4UHJvbWlzZVxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vb2pJbml0J1xuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcbmFycmF5MkQgPSByZXF1aXJlICcuLi90b29scy9hcnJheTJEJ1xuXG5ub2RlTmFtZSA9ICd4LWdyaWQnXG5jbGFzc05hbWUgPSAnZ3JpZCdcbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcblxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XG4gIGRlZmF1bHRzID1cbiAgICB0aWxlU2l6ZXM6XG4gICAgICBzbWFsbFNwYW46ICcnXG4gICAgICBtZWRpdW1TcGFuOiAnJ1xuICAgICAgbGFyZ2VTcGFuOiAnJ1xuICAgIHByb3BzOlxuICAgICAgY2xhc3M6ICdncmlkJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuXG4gIHJvd3MgPSBbXVxuICB0aWxlcyA9IGFycmF5MkQoKVxuXG4gIGZpbGxNaXNzaW5nID0gKCkgLT5cbiAgICB0aWxlcy5lYWNoIChyb3dObywgY29sTm8sIHZhbCkgLT5cbiAgICAgIGlmIG5vdCB2YWxcbiAgICAgICAgcm93ID0gcmV0LnJvdyByb3dOb1xuICAgICAgICByb3cubWFrZSAndGlsZScsIGNvbE5vLCB7fVxuXG4gIHJldC5hZGQgJ3JvdycsIChyb3dObyA9IHJvd3MubGVuZ3RoLTEgb3IgMSktPlxuICAgIG51Um93ID0gcm93c1tyb3dOby0xXVxuICAgIGlmIG5vdCBudVJvd1xuICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xuICAgICAgICBudVJvdyA9IHJldC5tYWtlICdkaXYnLCBwcm9wczogY2xhc3M6ICdyb3cnXG4gICAgICAgIHJvd3MucHVzaCBudVJvd1xuICAgICAgbnVSb3cuYWRkICd0aWxlJywgKGNvbE5vLCBvcHRzKSAtPlxuICAgICAgICBvcHRzID0gT0ouZXh0ZW5kIChPSi5leHRlbmQge30sIGRlZmF1bHRzLnRpbGVTaXplcyksIG9wdHNcbiAgICAgICAgbnVUaWxlID0gT0ouY29tcG9uZW50cy50aWxlIG9wdHMsIG51Um93XG4gICAgICAgIHRpbGVzLnNldCByb3dObywgY29sTm8sIG51VGlsZVxuICAgICAgICBudVRpbGVcbiAgICBudVJvd1xuXG4gIHJldC5hZGQgJ3RpbGUnLCAocm93Tm8sIGNvbE5vLCBvcHRzKSAtPlxuICAgIGlmIG5vdCByb3dObyBvciByb3dObyA8IDEgdGhlbiByb3dObyA9IDFcbiAgICBpZiBub3QgY29sTm8gb3IgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXG5cbiAgICByb3cgPSByZXQucm93IHJvd05vXG4gICAgdGlsZSA9IHRpbGVzLmdldCByb3dObywgY29sTm9cblxuICAgIGlmIG5vdCB0aWxlXG4gICAgICBpID0gMFxuICAgICAgd2hpbGUgaSA8IGNvbE5vXG4gICAgICAgIGkgKz0gMVxuICAgICAgICB0cnlUaWxlID0gdGlsZXMuZ2V0IHJvd05vLCBpXG4gICAgICAgIGlmIG5vdCB0cnlUaWxlXG4gICAgICAgICAgaWYgaSBpcyBjb2xOb1xuICAgICAgICAgICAgdGlsZSA9IHJvdy5tYWtlICd0aWxlJywgb3B0c1xuICAgICAgICAgIGVsc2UgaWYgbm90IHRpbGVcbiAgICAgICAgICAgIHJvdy5tYWtlICd0aWxlJ1xuXG4gICAgZmlsbE1pc3NpbmcoKVxuICAgIHRpbGVcblxuICByZXRcblxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbXBvbmVudCA9IHJlcXVpcmUgJy4uL2RvbS9jb21wb25lbnQnXG51dWlkID0gcmVxdWlyZSAnLi4vdG9vbHMvdXVpZCdcblxubm9kZU5hbWUgPSAneC1pbnB1dC1ncm91cCdcbmNsYXNzTmFtZSA9ICdpbnB1dGdyb3VwJ1xuXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXG5cbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBmb3JJZCA9IHV1aWQoKVxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJ2Zvcm0tZ3JvdXAnXG4gICAgZXZlbnRzOlxuICAgICAgY2hhbmdlOiBPSi5ub29wXG4gICAgZm9yOiBmb3JJZFxuICAgIGxhYmVsVGV4dDogJydcbiAgICBpbnB1dE9wdHM6XG4gICAgICBwcm9wczpcbiAgICAgICAgaWQ6IGZvcklkXG4gICAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgICBjbGFzczogJydcbiAgICAgICAgcGxhY2Vob2xkZXI6ICcnXG4gICAgICAgIHZhbHVlOiAnJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuXG4gIGdyb3VwID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ2Zvcm0tZ3JvdXAnXG5cbiAgcmV0Lmdyb3VwTGFiZWwgPSBncm91cC5tYWtlICdsYWJlbCcsIHByb3BzOiB7IGZvcjogZm9ySWQgfSwgdGV4dDogZGVmYXVsdHMubGFiZWxUZXh0XG5cbiAgZGVmYXVsdHMuaW5wdXRPcHRzLnByb3BzLmNsYXNzICs9ICcgZm9ybS1jb250cm9sJ1xuICByZXQuZ3JvdXBJbnB1dCA9IGdyb3VwLm1ha2UgJ2lucHV0JywgZGVmYXVsdHMuaW5wdXRPcHRzXG5cbiAgcmV0Lmdyb3VwVmFsdWUgPSAoKSAtPlxuICAgIHJldC5ncm91cElucHV0LnZhbCgpXG5cbiAgcmV0XG5cbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xuXG5ub2RlTmFtZSA9ICd4LXRhYnMnXG5jbGFzc05hbWUgPSAndGFicydcblxuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxuXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cbiAgZGVmYXVsdHMgPVxuICAgIHRhYnM6IHt9XG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJydcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgcmV0ID0gY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcblxuICB0YWJzID0gcmV0Lm1ha2UgJ3VsJywgcHJvcHM6IGNsYXNzOiAnbmF2IG5hdi10YWJzJ1xuICBjb250ZW50ID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ3RhYi1jb250ZW50J1xuXG4gIGZpcnN0ID0gdHJ1ZVxuICBPSi5lYWNoIGRlZmF1bHRzLnRhYnMsICh0YWJWYWwsIHRhYk5hbWUpIC0+XG4gICAgdGFiQ2xhc3MgPSAnJ1xuICAgIGlmIGZpcnN0XG4gICAgICBmaXJzdCA9IGZhbHNlXG4gICAgICB0YWJDbGFzcyA9ICdhY3RpdmUnXG4gICAgYSA9IHRhYnMubWFrZSAnbGknLCBwcm9wczogY2xhc3M6IHRhYkNsYXNzXG4gICAgICAubWFrZSgnYScsXG4gICAgICAgIHRleHQ6IHRhYk5hbWVcbiAgICAgICAgcHJvcHM6XG4gICAgICAgICAgaHJlZjogJyMnICsgdGFiTmFtZVxuICAgICAgICAgICdkYXRhLXRvZ2dsZSc6ICd0YWInXG4gICAgICAgIGV2ZW50czpcbiAgICAgICAgICBjbGljazogLT5cbiAgICAgICAgICAgIGEuJC50YWIgJ3Nob3cnKVxuXG4gICAgdGFiQ29udGVudENsYXNzID0gJ3RhYi1wYW5lICcgKyB0YWJDbGFzc1xuICAgIHJldC5hZGQgdGFiTmFtZSwgY29udGVudC5tYWtlKCdkaXYnLCBwcm9wczogY2xhc3M6IHRhYkNvbnRlbnRDbGFzcywgaWQ6IHRhYk5hbWUpXG5cbiAgcmV0XG5cbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xuXG5ub2RlTmFtZSA9ICd4LXRpbGUnXG5jbGFzc05hbWUgPSAndGlsZSdcblxuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxuICBcbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBkZWZhdWx0cyA9XG4gICAgd2lkdGg6XG4gICAgICB4czogJydcbiAgICAgIHNtOiAnJ1xuICAgICAgbWQ6ICcnXG4gICAgICBsZzogJydcbiAgICBwcm9wczpcbiAgICAgIGNsYXNzOiAndGlsZSdcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgaWYgZGVmYXVsdHMud2lkdGgueHMgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC14cy0nICsgZGVmYXVsdHMud2lkdGgueHNcbiAgaWYgZGVmYXVsdHMud2lkdGguc20gdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1zbS0nICsgZGVmYXVsdHMud2lkdGguc21cbiAgaWYgZGVmYXVsdHMud2lkdGgubWQgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1tZC0nICsgZGVmYXVsdHMud2lkdGgubWRcbiAgaWYgZGVmYXVsdHMud2lkdGgubGcgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1sZy0nICsgZGVmYXVsdHMud2lkdGgubGdcblxuICByZXQgPSBPSi5jb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuICByZXRcblxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbnRyb2wgPSByZXF1aXJlICcuLi9kb20vY29udHJvbCdcblxuY29udHJvbE5hbWUgPSAneS1pY29uJ1xuZnJpZW5kbHlOYW1lID0gJ2ljb24nXG5cbk9KLmNvbnRyb2xzLm1lbWJlcnNbZnJpZW5kbHlOYW1lXSA9IGNvbnRyb2xOYW1lXG5cbmNudHJsID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBkZWZhdWx0cyA9XG4gICAgaWNvbk9wdHM6XG4gICAgICBuYW1lOiAnJ1xuICAgICAgc3RhY2tlZEljb246ICcnXG4gICAgICBzd2FwSWNvbjogJydcbiAgICAgIHNpemU6IGZhbHNlXG4gICAgICBjb2xvcjogJydcbiAgICAgIGxpYnJhcnk6ICcnXG4gICAgICBpc0ZpeGVkV2lkdGg6IGZhbHNlXG4gICAgICBpc0xpc3Q6IGZhbHNlXG4gICAgICBpc1NwaW5uZXI6IGZhbHNlXG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJydcbiAgICByb290Tm9kZVR5cGU6ICdzcGFuJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9uc1xuICByZXQgPSBjb250cm9sIGRlZmF1bHRzLCBvd25lciwgY29udHJvbE5hbWVcblxuICBpc1RvZ2dsZWQgPSBmYWxzZVxuXG4gICNUT0RPOiBTdXBwb3J0IGZvciBwaWN0b2ljb25zXG4gICNUT0RPOiBTdXBwb3J0IGZvciBvdGhlciBGb250QXdlc29tZSBwcm9wZXJ0aWVzIChzdGFjaywgcm90YXRlLCBzaXplLCBldGMpXG5cbiAgY2xhc3NOYW1lQmFzZSA9ICdmYSAnXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzRml4ZWRXaWR0aCB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLWZ3ICdcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuaXNMaXN0IHRoZW4gY2xhc3NOYW1lQmFzZSArPSAnZmEtbGkgJ1xuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc1NwaW5uZXIgdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1zcGluICdcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZVxuICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLnNpemUgPiAxIGFuZCBkZWZhdWx0cy5pY29uT3B0cy5zaXplIDw9IDVcbiAgICAgIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5zaXplICsgJ3ggJ1xuXG4gIGNsYXNzTmFtZSA9IGNsYXNzTmFtZUJhc2UgKyAnZmEtJyArIGRlZmF1bHRzLmljb25PcHRzLm5hbWVcbiAgcmV0Lm15SWNvbiA9IHJldC5tYWtlICdpJywgcHJvcHM6IGNsYXNzOiBjbGFzc05hbWVcblxuICAjVG9nZ2xlcyBkaXNwbGF5IGJldHdlZW4gbm9ybWFsIGljb24gYW5kIHN3YXAgaWNvbiwgaWYgYSBzd2FwIGljb24gaGFzIGJlZW4gc3BlY2lmaWVkXG4gIHJldC50b2dnbGVJY29uID0gLT5cbiAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zd2FwSWNvblxuICAgICAgbmV3SWNvbiA9IGRlZmF1bHRzLmljb25PcHRzLm5hbWVcblxuICAgICAgaXNUb2dnbGVkID0gIWlzVG9nZ2xlZFxuXG4gICAgICBpZiBpc1RvZ2dsZWRcbiAgICAgICAgcmV0Lm15SWNvbi4kLnJlbW92ZUNsYXNzKCdmYS0nICsgbmV3SWNvbilcbiAgICAgICAgbmV3SWNvbiA9IGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uXG4gICAgICBlbHNlXG4gICAgICAgIHJldC5teUljb24uJC5yZW1vdmVDbGFzcygnZmEtJyArIGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uKVxuXG4gICAgICByZXQubXlJY29uLiQuYWRkQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxuXG5cbiAgcmV0XG5cbk9KLmNvbnRyb2xzLnJlZ2lzdGVyIGZyaWVuZGx5TmFtZSwgY250cmxcbm1vZHVsZS5leHBvcnRzID0gY250cmwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuZ2V0RGF0ZUZyb21Ebkpzb24gPSAoZG5EYXRlKSAtPlxyXG4gICAgXHJcbiAgIyBUcmFuc2Zvcm1zIGEgLk5FVCBKU09OIGRhdGUgaW50byBhIEphdmFTY3JpcHQgZGF0ZS5cclxuICAjIG5hbWU9J29iaicgIE9iamVjdCB0byB0ZXN0XHJcbiAgIyB0eXBlPSdCb29sZWFuJyAvPlxyXG4gICNcclxuICAjICAgICAgIHZhciBtaWxsaSA9IE9KLnRvLm51bWJlcihEbkRhdGUucmVwbGFjZSgvXFwvRGF0ZVxcKChcXGQrKVxcLT8oXFxkKylcXClcXC8vLCAnJDEnKSk7XHJcbiAgIyAgICAgICB2YXIgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKERuRGF0ZS5yZXBsYWNlKC9cXC9EYXRlXFwoXFxkKyhbXFwrXFwtXT9cXGQrKVxcKVxcLy8sICckMScpKTtcclxuICAjICAgICAgIHZhciBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcclxuICAjICAgICAgIHJldHVybiBuZXcgRGF0ZSgobWlsbGkgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpO1xyXG4gICMgICAgICAgXHJcbiAgICBcclxuICAjIERuIERhdGUgd2lsbCBsb29rIGxpa2UgL0RhdGUoMTMzNTc1ODQwMDAwMC0wNDAwKS8gIFxyXG4gIGRuRGF0ZVN0ciA9IE9KLnRvLnN0cmluZyhkbkRhdGUpXHJcbiAgcmV0ID0gdW5kZWZpbmVkXHJcbiAgdGlja3MgPSB1bmRlZmluZWRcclxuICBvZmZzZXQgPSB1bmRlZmluZWRcclxuICBsb2NhbE9mZnNldCA9IHVuZGVmaW5lZFxyXG4gIGFyciA9IHVuZGVmaW5lZFxyXG4gIHJldCA9IE9KLmRhdGVUaW1lTWluVmFsdWVcclxuICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eShkbkRhdGVTdHIpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnLycsICcnKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJ0RhdGUnLCAnJylcclxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCcoJywgJycpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnKScsICcnKVxyXG4gICAgYXJyID0gZG5EYXRlU3RyLnNwbGl0KCctJylcclxuICAgIGlmIGFyci5sZW5ndGggPiAxXHJcbiAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcclxuICAgICAgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKGFyclsxXSlcclxuICAgICAgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KClcclxuICAgICAgcmV0ID0gbmV3IERhdGUoKHRpY2tzIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKVxyXG4gICAgZWxzZSBpZiBhcnIubGVuZ3RoIGlzIDFcclxuICAgICAgdGlja3MgPSBPSi50by5udW1iZXIoYXJyWzBdKVxyXG4gICAgICByZXQgPSBuZXcgRGF0ZSh0aWNrcylcclxuICByZXRcclxuXHJcbiAgT0oucmVnaXN0ZXIgJ2dldERhdGVGcm9tRG5Kc29uJywgZ2V0RGF0ZUZyb21Ebkpzb25cclxuICBtb2R1bGVzLmV4cG9ydHMgPSBnZXREYXRlRnJvbURuSnNvblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuIyBXcmFwIHRoZSBleGVjdXRpb24gb2YgYSBtZXRob2QgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5ICAgICBcclxuIyBpZ25vcmUgZXJyb3JzIGZhaWxpbmcgdG8gZXhlYyBzZWxmLWV4ZWN1dGluZyBmdW5jdGlvbnMgXHJcbiMgUmV0dXJuIGEgbWV0aG9kIHdyYXBwZWQgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5XHJcbnRyeUV4ZWMgPSAodHJ5RnVuYykgLT5cclxuICAndXNlIHN0cmljdCdcclxuICByZXQgPSBmYWxzZVxyXG4gIHRoYXQgPSB0aGlzXHJcbiAgdHJ5XHJcbiAgICByZXQgPSB0cnlGdW5jLmFwcGx5KHRoYXQsIEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpICBpZiBPSi5pcy5tZXRob2QodHJ5RnVuYylcclxuICBjYXRjaCBleGNlcHRpb25cclxuICAgIGlmIChleGNlcHRpb24ubmFtZSBpcyAnVHlwZUVycm9yJyBvciBleGNlcHRpb24udHlwZSBpcyAnY2FsbGVkX25vbl9jYWxsYWJsZScpIGFuZCBleGNlcHRpb24udHlwZSBpcyAnbm9uX29iamVjdF9wcm9wZXJ0eV9sb2FkJ1xyXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0lnbm9yaW5nIGV4Y2VwdGlvbjogJywgZXhjZXB0aW9uXHJcbiAgICBlbHNlXHJcbiAgICAgIE9KLmNvbnNvbGUuZXJyb3IgZXhjZXB0aW9uXHJcbiAgZmluYWxseVxyXG5cclxuICByZXRcclxuXHJcblxyXG4gbWV0aG9kID0gKHRyeUZ1bmMpIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgdGhhdCA9IHRoaXNcclxuICAtPlxyXG4gICAgYXJncyA9IEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cywgMClcclxuICAgIGFyZ3MudW5zaGlmdCB0cnlGdW5jXHJcbiAgICBPSi50cnlFeGVjLmFwcGx5IHRoYXQsIGFyZ3NcclxuXHJcbiAgXHJcbiBcclxuIE9KLnJlZ2lzdGVyICdtZXRob2QnLCBtZXRob2RcclxuIE9KLnJlZ2lzdGVyICd0cnlFeGVjJywgdHJ5RXhlY1xyXG4gbW9kdWxlLmV4cG9ydHMgPVxyXG4gIG1ldGhvZDogbWV0aG9kXHJcbiAgdHJ5RXhlYzogdHJ5RXhlY1xyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxubnVtYmVyID0gT2JqZWN0LmNyZWF0ZShudWxsKVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ2lzTmFOJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5pc05hTikgdGhlbiBOdW1iZXIuaXNOYU4gZWxzZSBpc05hTilcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdpc0Zpbml0ZScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuaXNGaW5pdGUpIHRoZW4gTnVtYmVyLmlzRmluaXRlIGVsc2UgaXNGaW5pdGUpXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnTUFYX1ZBTFVFJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5NQVhfVkFMVUUpIHRoZW4gTnVtYmVyLk1BWF9WQUxVRSBlbHNlIDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ01JTl9WQUxVRScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuTUlOX1ZBTFVFKSB0aGVuIE51bWJlci5NSU5fVkFMVUUgZWxzZSA1ZS0zMjQpXHJcblxyXG5PSi5yZWdpc3RlciAnbnVtYmVyJywgbnVtYmVyXHJcbm1vZHVsZS5leHBvcnRzID0gbnVtYmVyIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbiQgPSByZXF1aXJlICdqcXVlcnknXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcbnByb3BlcnR5ID0gcmVxdWlyZSAnLi9wcm9wZXJ0eSdcbmZ1bmMgPSByZXF1aXJlICcuL2Z1bmN0aW9uJ1xudG8gPSByZXF1aXJlICcuLi90b29scy90bydcblxuIyAjIG9iamVjdFxuXG5yZXRPYmogPSBcblxuICAjICMjIFtPSl0ob2ouaHRtbCkub2JqZWN0XG4gICMgY3JlYXRlIGFuIG9iamVjdCB3aXRoIGhlbHBlciBgYWRkYCBhbmQgYGVhY2hgIG1ldGhvZHMuXG4gIG9iamVjdDogKG9iaiA9IHt9KSAtPlxuICAgIFxuICAgICMjI1xuICAgIEFkZCBhIHByb3BlcnR5IHRvIHRoZSBvYmplY3QgYW5kIHJldHVybiBpdFxuICAgICMjI1xuICAgIG9iai5hZGQgPSAobmFtZSwgdmFsKSAtPlxuICAgICAgcHJvcGVydHkgb2JqLCBuYW1lLCB2YWxcbiAgICAgIG9ialxuXG4gICAgb2JqLmFkZCAnZWFjaCcsIChjYWxsYmFjaykgLT5cclxuICAgICAgZWFjaCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2VhY2gnXG4gICAgICBlYWNoIG9iaiwgKHZhbCwga2V5KSAtPlxuICAgICAgICBpZiBrZXkgaXNudCAnZWFjaCcgYW5kIGtleSBpc250ICdhZGQnXG4gICAgICAgICAgY2FsbGJhY2sgdmFsLCBrZXlcblxuICAgIG9ialxuXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmlzSW5zdGFuY2VPZlxuICAjIGRldGVybWluZXMgaXMgYSB0aGluZyBpcyBhbiBpbnN0YW5jZSBvZiBhIFRoaW5nLCBhc3N1bWluZyB0aGUgdGhpbmdzIHdlcmUgYWxsIGNyZWF0ZWQgaW4gT0pcbiAgaXNJbnN0YW5jZU9mOiAobmFtZSwgb2JqKSAtPlxuICAgIHJldE9iai5jb250YWlucyhuYW1lLCBvYmopIGFuZCB0by5ib29sKG9ialtuYW1lXSlcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuY29udGFpbnNcbiAgIyB0cnVlIGlmIHRoZSBgb2JqZWN0YCBjb250YWlucyB0aGUgdmFsdWVcbiAgY29udGFpbnM6IChvYmplY3QsIGluZGV4KSAtPlxuICAgIHJldCA9IGZhbHNlXG4gICAgaWYgb2JqZWN0XG4gICAgICByZXQgPSBfLmNvbnRhaW5zIG9iamVjdCwgaW5kZXhcbiAgICByZXRcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuY29tcGFyZVxuICAjIGNvbXBhcmUgdHdvIG9iamVjdHMvYXJyYXlzL3ZhbHVlcyBmb3Igc3RyaWN0IGVxdWFsaXR5XG4gIGNvbXBhcmU6IChvYmoxLCBvYmoyKSAtPlxuICAgIF8uaXNFcXVhbCBvYmoxLCBvYmoyXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmNsb25lXG4gICMgY29weSBhbGwgb2YgdGhlIHZhbHVlcyAocmVjdXJzaXZlbHkpIGZyb20gb25lIG9iamVjdCB0byBhbm90aGVyLlxuICBjbG9uZTogKGRhdGEpIC0+XG4gICAgXy5jbG9uZURlZXAgZGF0YSB0cnVlXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLnNlcmlhbGl6ZVxuICAjIENvbnZlcnQgYW4gb2JqZWN0IHRvIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgb2JqZWN0XG4gIHNlcmlhbGl6ZTogKGRhdGEpIC0+XG4gICAgcmV0ID0gJydcbiAgICBmdW5jLnRyeUV4ZWMgLT5cbiAgICAgIHJldCA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgICByZXR1cm5cbiAgICByZXQgb3IgJydcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuZGVzZXJpYWxpemVcbiAgIyBDb252ZXJ0IGEgSlNPTiBzdHJpbmcgdG8gYW4gb2JqZWN0XG4gIGRlc2VyaWFsaXplOiAoZGF0YSkgLT5cbiAgICByZXQgPSB7fVxuICAgIGlmIGRhdGFcbiAgICAgIGZ1bmMudHJ5RXhlYyAtPlxuICAgICAgICByZXQgPSAkLnBhcnNlSlNPTihkYXRhKVxuICAgICAgICByZXR1cm5cblxuICAgICAgcmV0ID0ge30gIGlmIGlzTWV0aG9kLm51bGxPckVtcHR5KHJldClcbiAgICByZXRcblxuICAjICMjIFtPSl0ob2ouaHRtbCkucGFyYW1zXG4gICMgQ29udmVydCBhbiBvYmplY3QgdG8gYSBkZWxpbWl0ZWQgbGlzdCBvZiBwYXJhbWV0ZXJzIChub3JtYWxseSBxdWVyeS1zdHJpbmcgcGFyYW1ldGVycylcbiAgcGFyYW1zOiAoZGF0YSwgZGVsaW1pdGVyID0gJyYnKSAtPlxuICAgIHJldCA9ICcnXG4gICAgaWYgZGVsaW1pdGVyIGlzICcmJ1xuICAgICAgZnVuYy50cnlFeGVjIC0+XG4gICAgICAgIHJldCA9ICQucGFyYW0oZGF0YSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICBlbHNlXHJcbiAgICAgIGVhY2ggPSByZXF1aXJlICcuLi90b29scy9lYWNoJ1xuICAgICAgZWFjaCBkYXRhLCAodmFsLCBrZXkpIC0+XG4gICAgICAgIHJldCArPSBkZWxpbWl0ZXIgIGlmIHJldC5sZW5ndGggPiAwXG4gICAgICAgIHJldCArPSBrZXkgKyAnPScgKyB2YWxcbiAgICAgICAgcmV0dXJuXG5cbiAgICB0by5zdHJpbmcgcmV0XG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmV4dGVuZFxuICAjIGNvcHkgdGhlIHByb3BlcnRpZXMgb2Ygb25lIG9iamVjdCB0byBhbm90aGVyIG9iamVjdFxuICBleHRlbmQ6IChkZXN0T2JqLCBzcmNPYmosIGRlZXBDb3B5ID0gZmFsc2UpIC0+XG4gICAgcmV0ID0gZGVzdE9iaiBvciB7fVxuICAgIGlmIGRlZXBDb3B5IGlzIHRydWVcbiAgICAgIHJldCA9ICQuZXh0ZW5kKGRlZXBDb3B5LCByZXQsIHNyY09iailcbiAgICBlbHNlXG4gICAgICByZXQgPSAkLmV4dGVuZChyZXQsIHNyY09iailcbiAgICByZXRcblxuXG5PSi5yZWdpc3RlciAnb2JqZWN0JywgcmV0T2JqLm9iamVjdFxuT0oucmVnaXN0ZXIgJ2lzSW5zdGFuY2VPZicsIHJldE9iai5pc0luc3RhbmNlT2Zcbk9KLnJlZ2lzdGVyICdjb250YWlucycsIHJldE9iai5jb250YWluc1xuT0oucmVnaXN0ZXIgJ2NvbXBhcmUnLCByZXRPYmouY29tcGFyZVxuT0oucmVnaXN0ZXIgJ2Nsb25lJywgcmV0T2JqLmNsb25lXG5PSi5yZWdpc3RlciAnc2VyaWFsaXplJywgcmV0T2JqLnNlcmlhbGl6ZVxuT0oucmVnaXN0ZXIgJ2Rlc2VyaWFsaXplJywgcmV0T2JqLmRlc2VyaWFsaXplXG5PSi5yZWdpc3RlciAncGFyYW1zJywgcmV0T2JqLnBhcmFtc1xuT0oucmVnaXN0ZXIgJ2V4dGVuZCcsIHJldE9iai5leHRlbmRcblxubW9kdWxlLmV4cG9ydHMgPSByZXRPYmoiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG4jIyNcclxuQWRkIGEgcHJvcGVydHkgdG8gYW4gb2JqZWN0XHJcbiAgXHJcbiMjI1xyXG5wcm9wZXJ0eSA9IChvYmosIG5hbWUsIHZhbHVlLCB3cml0YWJsZSwgY29uZmlndXJhYmxlLCBlbnVtZXJhYmxlKSAtPlxyXG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGRlZmluZSBhIHByb3BlcnR5IHdpdGhvdXQgYW4gT2JqZWN0LicgIHVubGVzcyBvYmpcclxuICB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgYSBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgcHJvcGVydHkgbmFtZS4nICB1bmxlc3MgbmFtZT9cclxuICBvYmpbbmFtZV0gPSB2YWx1ZVxyXG4gIG9ialxyXG5cclxuT0oucmVnaXN0ZXIgJ3Byb3BlcnR5JywgcHJvcGVydHlcclxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmRlbGltaXRlZFN0cmluZyA9IChzdHJpbmcsIG9wdHMpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgbmV3TGluZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICBzcGFjZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICByZW1vdmVEdXBsaWNhdGVzOiB0cnVlXHJcbiAgICBkZWxpbWl0ZXI6IFwiLFwiXHJcbiAgICBpbml0U3RyaW5nOiBPSi50by5zdHJpbmcgc3RyaW5nXHJcblxyXG4gIHJldE9iaiA9XHJcbiAgICBhcnJheTogW11cclxuICAgIGRlbGltaXRlZDogLT5cclxuICAgICAgcmV0T2JqLmFycmF5LmpvaW4gZGVmYXVsdHMuZGVsaW1pdGVyXHJcblxyXG4gICAgc3RyaW5nOiAoZGVsaW1pdGVyID0gZGVmYXVsdHMuZGVsaW1pdGVyKSAtPlxyXG4gICAgICByZXQgPSAnJ1xyXG4gICAgICBPSi5lYWNoIHJldE9iai5hcnJheSwgKHZhbCkgLT5cclxuICAgICAgICByZXQgKz0gZGVsaW1pdGVyICBpZiByZXQubGVuZ3RoID4gMFxyXG4gICAgICAgIHJldCArPSB2YWxcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIHJldFxyXG5cclxuICAgIHRvU3RyaW5nOiAtPlxyXG4gICAgICByZXRPYmouc3RyaW5nKClcclxuXHJcbiAgICBhZGQ6IChzdHIpIC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5wdXNoIGRlZmF1bHRzLnBhcnNlKHN0cilcclxuICAgICAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcygpXHJcbiAgICAgIHJldE9ialxyXG5cclxuICAgIHJlbW92ZTogKHN0cikgLT5cclxuICAgICAgcmVtb3ZlID0gKGFycmF5KSAtPlxyXG4gICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgIHRydWUgIGlmIGl0ZW0gaXNudCBzdHJcclxuXHJcblxyXG4gICAgICByZXRPYmouYXJyYXkgPSByZW1vdmUocmV0T2JqLmFycmF5KVxyXG4gICAgICByZXRPYmpcclxuXHJcbiAgICBjb3VudDogLT5cclxuICAgICAgcmV0T2JqLmFycmF5Lmxlbmd0aFxyXG5cclxuICAgIGNvbnRhaW5zOiAoc3RyLCBjYXNlU2Vuc2l0aXZlKSAtPlxyXG4gICAgICBpc0Nhc2VTZW5zaXRpdmUgPSBPSi50by5ib29sKGNhc2VTZW5zaXRpdmUpXHJcbiAgICAgIHN0ciA9IE9KLnRvLnN0cmluZyhzdHIpLnRyaW0oKVxyXG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKSAgaWYgZmFsc2UgaXMgaXNDYXNlU2Vuc2l0aXZlXHJcbiAgICAgIG1hdGNoID0gcmV0T2JqLmFycmF5LmZpbHRlcigobWF0U3RyKSAtPlxyXG4gICAgICAgIChpc0Nhc2VTZW5zaXRpdmUgYW5kIE9KLnRvLnN0cmluZyhtYXRTdHIpLnRyaW0oKSBpcyBzdHIpIG9yIE9KLnRvLnN0cmluZyhtYXRTdHIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpIGlzIHN0clxyXG4gICAgICApXHJcbiAgICAgIG1hdGNoLmxlbmd0aCA+IDBcclxuXHJcbiAgICBlYWNoOiAoY2FsbEJhY2spIC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5mb3JFYWNoIGNhbGxCYWNrXHJcblxyXG4gIGRlZmF1bHRzLnBhcnNlID0gKHN0cikgLT5cclxuICAgIHJldCA9IE9KLnRvLnN0cmluZyhzdHIpXHJcbiAgICByZXQgPSByZXQucmVwbGFjZSgvXFxuL2csIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiXFxuXCIpIGlzbnQgLTEgIGlmIGRlZmF1bHRzLm5ld0xpbmVUb0RlbGltaXRlclxyXG4gICAgcmV0ID0gcmV0LnJlcGxhY2UoUmVnRXhwKFwiIFwiLCBcImdcIiksIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiIFwiKSBpc250IC0xICBpZiBkZWZhdWx0cy5zcGFjZVRvRGVsaW1pdGVyXHJcbiAgICByZXQgPSByZXQucmVwbGFjZSgvLCwvZywgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCIsLFwiKSBpc250IC0xXHJcbiAgICByZXRcclxuXHJcbiAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcyA9IC0+XHJcbiAgICBpZiBkZWZhdWx0cy5yZW1vdmVEdXBsaWNhdGVzXHJcbiAgICAgICgtPlxyXG4gICAgICAgIHVuaXF1ZSA9IChhcnJheSkgLT5cclxuICAgICAgICAgIHNlZW4gPSBuZXcgU2V0KClcclxuICAgICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgICAgaWYgZmFsc2UgaXMgc2Vlbi5oYXMoaXRlbSlcclxuICAgICAgICAgICAgICBzZWVuLmFkZCBpdGVtXHJcbiAgICAgICAgICAgICAgdHJ1ZVxyXG5cclxuXHJcbiAgICAgICAgcmV0T2JqLmFycmF5ID0gdW5pcXVlKHJldE9iai5hcnJheSlcclxuICAgICAgICByZXR1cm5cclxuICAgICAgKSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgKChhKSAtPlxyXG4gICAgaWYgYS5sZW5ndGggPiAxIGFuZCBmYWxzZSBpcyBPSi5pcy5wbGFpbk9iamVjdChvcHRzKVxyXG4gICAgICBPSi5lYWNoIGEsICh2YWwpIC0+XHJcbiAgICAgICAgcmV0T2JqLmFycmF5LnB1c2ggdmFsICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSh2YWwpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgZWxzZSBpZiBzdHJpbmcgYW5kIHN0cmluZy5sZW5ndGggPiAwXHJcbiAgICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0c1xyXG4gICAgICBkZWxpbWl0ZWRTdHJpbmcgPSBkZWZhdWx0cy5wYXJzZShzdHJpbmcpXHJcbiAgICAgIGRlZmF1bHRzLmluaXRTdHJpbmcgPSBkZWxpbWl0ZWRTdHJpbmdcclxuICAgICAgcmV0T2JqLmFycmF5ID0gZGVsaW1pdGVkU3RyaW5nLnNwbGl0KGRlZmF1bHRzLmRlbGltaXRlcilcclxuICAgIGRlZmF1bHRzLmRlbGV0ZUR1cGxpY2F0ZXMoKVxyXG4gICAgcmV0dXJuXHJcbiAgKSBhcmd1bWVudHNcclxuICByZXRPYmpcclxuXHJcblxyXG5PSi5yZWdpc3RlciAnZGVsaW1pdGVkU3RyaW5nJywgZGVsaW1pdGVkU3RyaW5nXHJcbm1vZHVsZS5leHBvcnRzID0gZGVsaW1pdGVkU3RyaW5nIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcclxuXHJcbiMgIyBkb21cclxuXHJcblxyXG4jIEV4dGVuZCBhbiBvYmplY3Qgd2l0aCBPSiBET00gbWV0aG9kcyBhbmQgcHJvcGVydGllc1xyXG5cclxuIyAtIGBAZWxgIE9iamVjdCB0byBleHRlbmRcclxuIyAtIGBwYXJlbnRgIHBhcmVudCBvYmplY3QgdG8gd2hpY2ggYEBlbGAgd2lsbCBiZSBhcHBlbmRlZFxyXG5jbGFzcyBOb2RlXHJcbiAgXHJcbiAgI3BhcmVudDogcmVxdWlyZSgnLi9ib2R5JylcclxuICBcclxuICBjb25zdHJ1Y3RvcjogKEBlbCwgQHBhcmVudCkgLT5cclxuICAgIGVuYWJsZWQgPSB0cnVlXHJcbiAgICBAdGFnTmFtZSA9IEBlbC50YWdOYW1lXHJcbiAgICBAWyckJ10gPSAkKEBlbC5nZXQoKSlcclxuICAgIEBbJzAnXSA9IEBlbC5nZXQoKVxyXG5cclxuICBhcHBlbmQ6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAZWwuYXBwZW5kIHBhcmFtcy4uLlxyXG5cclxuICBwcmVwZW5kOiAocGFyYW1zLi4uKSAtPlxyXG4gICAgQGVsLnByZXBlbmQgcGFyYW1zLi4uXHJcblxyXG4gIHJlbW92ZTogKHBhcmFtcy4uLikgLT5cclxuICAgIEBlbC5yZW1vdmUgcGFyYW1zLi4uXHJcblxyXG4gIGNzczogKHBhcmFtcy4uLikgLT5cclxuICAgIEBlbC5jc3MgcGFyYW1zLi4uXHJcblxyXG4gIGh0bWw6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAZWwuaHRtbCBwYXJhbXMuLi5cclxuXHJcbiAgdGV4dDogKHBhcmFtcy4uLikgLT5cclxuICAgIEBlbC50ZXh0IHBhcmFtcy4uLlxyXG5cclxuICBhdHRyOiAocGFyYW1zLi4uKSAtPlxyXG4gICAgQGVsLmF0dHIgcGFyYW1zLi4uXHJcblxyXG4gIGRhdGE6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAZWwuZGF0YSBwYXJhbXMuLi5cclxuXHJcbiAgZ2V0OiAocGFyYW1zLi4uKSAtPlxyXG4gICAgQGVsLmdldCBwYXJhbXMuLi5cclxuXHJcbiAgYWRkOiAoa2V5LCB2YWwpIC0+XHJcbiAgICBAW2tleV0gPSB2YWxcclxuXHJcbiAgaXNDb250cm9sU3RpbGxWYWxpZDogLT5cclxuICAgIGlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXHJcbiAgICB2YWxpZCA9IGZhbHNlIGlzIGlzTWV0aG9kLm51bGxPckVtcHR5KEBlbCkgYW5kIEBpc1ZhbGlkKClcclxuICAgIHRocm93IG5ldyBFcnJvciAnZWwgaXMgbnVsbC4gRXZlbnQgYmluZGluZ3MgbWF5IG5vdCBoYXZlIGJlZW4gR0NkLicgIGlmIGZhbHNlIGlzIHZhbGlkXHJcbiAgICB2YWxpZFxyXG5cclxuICAjICMjIGlzVmFsaWRcclxuICBpc1ZhbGlkOiAtPlxyXG4gICAgQGVsIGFuZCAoQGVsLmVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgb3IgQGVsLmVsIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudClcclxuXHJcbiAgIyAjIyBhZGRDbGFzc1xyXG4gICMgQWRkIGEgQ1NTIGNsYXNzIHRvIGFuIGVsZW1lbnRcclxuXHJcbiAgIyAtIGBuYW1lYCB0aGUgbmFtZSBvZiB0aGUgY2xhc3MgdG8gYWRkXHJcbiAgYWRkQ2xhc3M6IChuYW1lKSAtPlxyXG4gICAgQFsnJCddLmFkZENsYXNzIG5hbWUgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgQFxyXG5cclxuICAjICMjIGJpbmRcclxuICAjIEJpbmQgYW4gYWN0aW9uIHRvIGEgalF1ZXJ5IGVsZW1lbnQncyBldmVudC5cclxuICBiaW5kOiAoZXZlbnROYW1lLCBldmVudCkgLT5cclxuICAgIEBvbiBldmVudE5hbWUsIGV2ZW50XHJcblxyXG5cclxuICAjICMjIGtleWJvYXJkXHJcbiAgIyBCaW5kIGFuIGV2ZW50IHRvIGEga2V5LCB3aGVuIHByZXNzZWQgaW4gdGhpcyBjb250cm9sLlxyXG4gICMgVGhlIE9KIG9iamVjdCAoZm9yIGNoYWluaW5nKVxyXG4gIGtleWJvYXJkOiAoa2V5cywgZXZlbnQpIC0+XHJcbiAgICAjTW91c2V0cmFwLmJpbmQga2V5cywgQGVsW2V2ZW50XSAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgQFxyXG5cclxuICAjICMjIGRpc2FibGVcclxuICAjIERpc2FibGUgdGhlIGVsZW1lbnQuXHJcbiAgIyBUaGUgT0ogb2JqZWN0IChmb3IgY2hhaW5pbmcpXHJcbiAgZGlzYWJsZTogPT5cclxuICAgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgZW5hYmxlZCA9IGZhbHNlXHJcbiAgICAgIEBhdHRyICdkaXNhYmxlZCcsICdkaXNhYmxlZCdcclxuICAgICAgQGFkZENsYXNzICdkaXNhYmxlZCcsICdkaXNhYmxlZCdcclxuICAgIEBcclxuXHJcbiAgIyAjIyBlbXB0eVxyXG4gICMgRW1wdHkgdGhlIGVsZW1lbnQuXHJcbiAgIyBUaGUgT0ogb2JqZWN0IChmb3IgY2hhaW5pbmcpXHJcbiAgZW1wdHk6IC0+XHJcbiAgICBAWyckJ10uZW1wdHkoKSBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgZW5hYmxlXHJcbiAgIyBFbmFibGUgdGhlIGVsZW1lbnQuXHJcbiAgIyBUaGUgT0ogb2JqZWN0IChmb3IgY2hhaW5pbmcpXHJcbiAgZW5hYmxlOiAtPlxyXG4gICAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBlbmFibGVkID0gdHJ1ZVxyXG4gICAgICBAcmVtb3ZlQXR0ciAnZGlzYWJsZWQnXHJcbiAgICAgIEByZW1vdmVDbGFzcyAnZGlzYWJsZWQnXHJcbiAgICBAXHJcblxyXG4gICMgIyMgZ2V0SWRcclxuICAjIEdldCB0aGUgRE9NIEVsZW1lbnQgSUQgb2YgdGhpcyBvYmplY3QuXHJcbiAgZ2V0SWQ6IC0+XHJcbiAgICBpZCA9IEBbMF0uaWQgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIGlkXHJcblxyXG4gIGhhc0NsYXNzOiAocGFyYW1zLi4uKSAtPlxyXG4gICAgQFsnJCddLmhhc0NsYXNzIHBhcmFtcy4uLlxyXG5cclxuICAjICMjIGhpZGVcclxuICAjIE1ha2UgdGhlIGVsZW1lbnQgaW52aXNpYmxlLlxyXG4gIGhpZGU6IC0+XHJcbiAgICBAY3NzICdkaXNwbGF5JywgJ25vbmUnICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgbGVuZ3RoXHJcbiAgIyBHZXQgdGhlIGxlbmd0aCBvZiB0aGlzIGVsZW1lbnQuXHJcbiAgbGVuZ3RoOiAtPlxyXG4gICAgdG8gPSByZXF1aXJlICcuLi90b29scy90bydcclxuICAgIGxlbiA9IDBcclxuICAgIGxlbiA9IHRvLm51bWJlcihAWyckJ10ubGVuZ3RoKSAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgbGVuXHJcbiAgXHJcbiAgIyAjIyBvblxyXG4gIG9uOiAoZXZlbnROYW1lLCBldmVudCkgLT5cclxuICAgIEBbJyQnXS5vbiBldmVudE5hbWUsIGV2ZW50ICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgb2ZmXHJcbiAgb2ZmOiAoZXZlbnROYW1lLCBldmVudCkgLT5cclxuICAgIEBbJyQnXS5vZmYgZXZlbnROYW1lLCBldmVudCAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgQGVsXHJcblxyXG4gIHByb3A6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAWyckJ10ucHJvcCBwYXJhbXMuLi5cclxuXHJcbiAgIyAjIyByZW1vdmVcclxuICAjIFJlbW92ZSB0aGUgbm9kZSBmcm9tIHRoZSBET01cclxuICByZW1vdmU6IC0+XHJcbiAgICBpZiBAZWwgYW5kIEBbJyQnXVxyXG4gICAgICBAWyckJ10ucmVtb3ZlKClcclxuXHJcbiAgICAgICMgU2V0IHRoZSB2YWx1ZSBvZiBAZWwgdG8gbnVsbCB0byBndWFyYW50ZWUgdGhhdCBpc0NvbnRyb2xTdGlsbFZhbGlkIHdpbGwgYmUgY29ycmVjdFxyXG4gICAgICBAZWwgPSBudWxsXHJcbiAgICAgIEBbJyQnXSA9IG51bGxcclxuICAgICAgQFswXSA9IG51bGxcclxuICAgIG51bGxcclxuXHJcbiAgIyAjIyByZW1vdmVDbGFzc1xyXG4gICMgUmVtb3ZlIGEgQ1NTIGNsYXNzIGZyb20gYW4gZWxlbWVudC5cclxuICByZW1vdmVDbGFzczogKG5hbWUpIC0+XHJcbiAgICBAWyckJ10ucmVtb3ZlQ2xhc3MgbmFtZSAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgQFxyXG5cclxuICAjICMjIHJlbW92ZVByb3BcclxuICAjIFJlbW92ZSBhIHByb3BlcnR5IGZyb20gYW4gZWxlbWVudC4galF1ZXJ5IGRpc3Rpbmd1aXNoZXMgYmV0d2VlbiAncHJvcHMnIGFuZCAnYXR0cic7IGhlbmNlIDIgbWV0aG9kcy5cclxuICByZW1vdmVQcm9wOiAobmFtZSkgLT5cclxuICAgIEBbJyQnXS5yZW1vdmVQcm9wIG5hbWUgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyByZW1vdmVBdHRyXHJcbiAgIyBSZW1vdmUgYSBwcm9wZXJ0eSBmcm9tIGFuIGVsZW1lbnQuIGpRdWVyeSBkaXN0aW5ndWlzaGVzIGJldHdlZW4gJ3Byb3BzJyBhbmQgJ2F0dHInOyBoZW5jZSAyIG1ldGhvZHMuXHJcbiAgcmVtb3ZlQXR0cjogKG5hbWUpIC0+XHJcbiAgICBAWyckJ10ucmVtb3ZlQXR0ciBuYW1lICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgcmVxdWlyZWRcclxuICAjIE1hcmsgdGhlIHJlcXVpcmVkIHN0YXR1cyBvZiB0aGUgZWxlbWVudC5cclxuICByZXF1aXJlZDogKHRydXRoeSwgYWRkTGFiZWwpIC0+XHJcbiAgICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIHRvID0gcmVxdWlyZSAnLi4vdG9vbHMvdG8nXHJcbiAgICAgIHN3aXRjaCB0by5ib29sKHRydXRoeSlcclxuICAgICAgICB3aGVuIHRydWVcclxuICAgICAgICAgIEBhdHRyICdyZXF1aXJlZCcsIHRydWVcclxuICAgICAgICAgIEBhZGRDbGFzcyAncmVxdWlyZWQnXHJcbiAgICAgICAgd2hlbiBmYWxzZVxyXG4gICAgICAgICAgQHJlbW92ZVByb3AgJ3JlcXVpcmVkJ1xyXG4gICAgICAgICAgQHJlbW92ZUNsYXNzICdyZXF1aXJlZCdcclxuICAgIEBbJyQnXVxyXG4gIFxyXG4gICMgIyMgc2hvd1xyXG4gICMgTWFrZSB0aGUgZWxlbWVudCB2aXNpYmxlLlxyXG4gIHNob3c6IC0+XHJcbiAgICBAWyckJ10uc2hvdygpICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgdG9nZ2xlXHJcbiAgIyBUb2dnbGUgdmlzaWJpbGl0eVxyXG4gIHRvZ2dsZTogLT5cclxuICAgIEBbJyQnXS50b2dnbGUoKSAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgXHJcbiAgQHRvZ2dsZUNsYXNzOiAocGFyYW1zLi4uKS0+XHJcbiAgICBAWyckJ10udG9nZ2xlQ2xhc3MgcGFyYW1zLi4uICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgdG9nZ2xlRW5hYmxlXHJcbiAgIyBUb2dnbGUgdGhlIGVsZW1lbnQncyBlbmFibGVkIHN0YXRlLlxyXG4gIHRvZ2dsZUVuYWJsZTogLT5cclxuICAgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgaWYgZW5hYmxlZFxyXG4gICAgICAgIEBkaXNhYmxlKClcclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBlbmFibGUoKVxyXG4gICAgQFxyXG5cclxuICAjICMjIHRyaWdnZXJcclxuICAjIFRyaWdnZXIgYW4gZXZlbnQgYm91bmQgdG8gYSBqUXVlcnkgZWxlbWVudC5cclxuICB0cmlnZ2VyOiAoZXZlbnROYW1lLCBldmVudE9wdHMpIC0+XHJcbiAgICBAWyckJ10udHJpZ2dlciBldmVudE5hbWUsIGV2ZW50T3B0cyAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgQGVsXHJcblxyXG4gICMgIyMgdW5iaW5kXHJcbiAgIyBXcmFwcGVyIGFyb3VuZCBgb2ZmYFxyXG4gIHVuYmluZDogKGV2ZW50TmFtZSwgZXZlbnQpIC0+XHJcbiAgICBAb2ZmIGV2ZW50TmFtZSwgZXZlbnRcclxuXHJcbiAgIyAjIyB2YWxcclxuICAjIEdldCBvciBzZXQgdGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50LlxyXG4gIHZhbDogKHZhbHVlKSAtPlxyXG4gICAgcmV0ID0gQFxyXG4gICAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBpc01ldGhvZCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2lzJ1xyXG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDEgYW5kIGZhbHNlIGlzIGlzTWV0aG9kLm51bGxPclVuZGVmaW5lZCh2YWx1ZSlcclxuICAgICAgICBAWyckJ10udmFsIHZhbHVlXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXQgPSBAWyckJ10udmFsKClcclxuICAgIHJldFxyXG4gICAgXHJcbiAgIyAjIyB2YWx1ZU9mXHJcbiAgIyB3cmFwcGVyIGFyb3VuZCBgdmFsYFxyXG4gIHZhbHVlT2Y6IC0+XHJcbiAgICBAdmFsKClcclxuXHJcbiAgIyAjIyB0b1N0cmluZ1xyXG4gICMgd3JhcHBlciBhcm91bmQgYHZhbGBcclxuICB0b1N0cmluZzogLT5cclxuICAgIEB2YWwoKVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTm9kZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbl8gPSByZXF1aXJlICdsb2Rhc2gnXHJcblRoaW5ET00gPSByZXF1aXJlICd0aGluZG9tJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcblxyXG5cclxuIyMjXHJcblBlcnNpc3QgYSBoYW5kbGUgb24gdGhlIGJvZHkgbm9kZVxyXG4jIyNcclxuaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCcgdGhlbiBib2R5ID0gZG9jdW1lbnQuYm9keSBlbHNlIGJvZHkgPSBudWxsXHJcbmJvZHkgPSBuZXcgVGhpbkRPTSBudWxsLCBpZDogJ2JvZHknLCBib2R5XHJcbmJvZHkudGFnTmFtZSA9ICdib2R5J1xyXG50aGluQm9keSA9IG5vZGVGYWN0b3J5IGJvZHksIHt9XHJcbiAgXHJcbk9KLnJlZ2lzdGVyICdib2R5JywgdGhpbkJvZHlcclxubW9kdWxlLmV4cG9ydHMgPSB0aGluQm9keSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXHJcblxyXG4jICMgY29tcG9uZW50XHJcblxyXG5cclxuIyBDcmVhdGUgYW4gSFRNTCBXZWIgQ29tcG9uZW50IHRocm91Z2ggVGhpbkRvbVxyXG5cclxuIyAtIGBvcHRpb25zYCBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzdGFuZGFyZCBvcHRpb25zIHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBjb21wb25lbnRcclxuIyAtLSBgcm9vdE5vZGVUeXBlYDogdGhlIHRhZyBuYW1lIG9mIHRoZSByb290IG5vZGUgdG8gY3JlYXRlLCBkZWZhdWx0ID0gJ2RpdidcclxuIyAtLSBgcHJvcHNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBET00gYXR0cmlidXRlcyB0byBhcHBlbmQgdG8gdGhlIHJvb3Qgbm9kZVxyXG4jIC0tIGBzdHlsZXNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBDU1MgYXR0cmlidXRlcyB0byBhcHBlbmQgdG8gdGhlIHJvb3Qgbm9kZVxyXG4jIC0tIGBldmVudHNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBuYW1lZCBET00gZXZlbnRzIChhbmQgY29ycmVzcG9uZGluZyBjYWxsYmFjayBtZXRob2RzKSB0byBiaW5kIHRvIHRoZSByb290IG5vZGVcclxuIyAtIGBvd25lcmAgdGhlIHBhcmVudCB0byB3aGljaCB0aGUgY29tcG9uZW50IG5vZGUgd2lsbCBiZSBhcHBlbmRlZFxyXG4jIC0gYHRhZ05hbWVgIHRoZSBuYW1lIG9mIG9mIHRoZSBjb21wb25lbnQsIHdoaWNoIHdpbGwgYWx3YXlzIGJlIHByZWZpeGVkIHdpdGggJ3gtJ1xyXG5jb21wb25lbnQgPSAob3B0aW9ucyA9IG9iai5vYmplY3QoKSwgb3duZXIsIHRhZ05hbWUpIC0+XHJcblxyXG4gIGlmIG5vdCB0YWdOYW1lLnN0YXJ0c1dpdGggJ3gtJyB0aGVuIHRhZ05hbWUgPSAneC0nICsgdGFnTmFtZVxyXG4gICMgd2ViIGNvbXBvbmVudHMgYXJlIHJlYWxseSBqdXN0IG9yZGluYXJ5IE9KIFtlbGVtZW50XShlbGVtZW50Lmh0bWwpJ3Mgd2l0aCBhIHNwZWNpYWwgbmFtZS5cclxuICAjIFVudGlsIEhUTUwgV2ViIENvbXBvbmVudHMgYXJlIGZ1bGx5IHN1cHBvcnRlZCAoYW5kIE9KIGlzIHJlZmFjdG9yZWQgYWNjb3JkaW5nbHkpLCB0aGUgZWxlbWVudCB3aWxsIGJlIHRyZWF0ZWQgYXMgYW4gdW5rbm93biBlbGVtZW50LlxyXG4gICMgSW4gbW9zdCBjYXNlcywgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgdGhlIGJyb3dzZXIgaXMgYWNjZXB0YWJsZSAoc2VlIGFsc28gW0hUTUwgU2VtYW50aWNzXShodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL3NlbWFudGljcy5odG1sKSksIGJ1dFxyXG4gICMgaW4gc29tZSBjYXNlcyB0aGlzIGlzIHByb2JsZW1hdGljIChmaXJzdGx5LCBiZWNhdXNlIHRoZXNlIGVsZW1lbnRzIGFyZSBhbHdheXMgcmVuZGVyZWQgaW5saW5lKS5cclxuICAjIEluIHN1Y2ggY29uZGl0aW9ucywgdGhlIFtjb250cm9sc10oY29udHJvbHMuaHRtbCkgY2xhc3MgYW5kIG5hbWUgc3BhY2UgaXMgYmV0dGVyIHN1aXRlZCB0byBjbGFzc2VzIHdoaWNoIHJlcXVpcmUgY29tcGxldGUgY29udHJvbCAoZS5nLiBbaWNvbl0oaWNvbi5odG1sKSkuXHJcbiAgd2lkZ2V0ID0gbm9kZUZhY3RvcnkgdGFnTmFtZSwgb2JqLm9iamVjdCgpLCBvd25lciwgZmFsc2UgIywgb3B0aW9ucy5wcm9wcywgb3B0aW9ucy5zdHlsZXMsIG9wdGlvbnMuZXZlbnRzLCBvcHRpb25zLnRleHRcclxuICBcclxuICAjIFNpbmNlIHRoZSBiZWhhdmlvciBvZiBzdHlsaW5nIGlzIG5vdCB3ZWxsIGNvbnRyb2xsZWQvY29udHJvbGxhYmxlIG9uIHVua25vd24gZWxlbWVudHMsIGl0IGlzIG5lY2Vzc2FyeSB0byBjcmVhdGUgYSByb290IG5vZGUgZm9yIHRoZSBjb21wb25lbnQuXHJcbiAgIyBJbiBtb3N0IGNhc2VzLCBbZGl2XShkaXYuaHRtbCkgaXMgcGVyZmVjdGx5IGFjY2VwdGFibGUsIGJ1dCB0aGlzIGlzIGNvbmZpZ3VyYWJsZSBhdCB0aGUgbmFtZSBzcGFjZSBsZXZlbCBvciBhdCBydW50aW1lLlxyXG4gIHJvb3ROb2RlVHlwZSA9IG9wdGlvbnMucm9vdE5vZGVUeXBlIG9yIE9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gb3IgJ2RpdidcclxuXHJcbiAgIyBgcmV0YCBpcyB0aGUgdGhlIGluc3RhbmNlIG9mIHRoZSByb290Tm9kZVR5cGUsIG5vdCB0aGUgYHdpZGdldGAgd3JhcHBlZCBpbiB0aGlzIGNsb3N1cmVcclxuICByZXQgPSB3aWRnZXQubWFrZSByb290Tm9kZVR5cGUsIG9wdGlvbnNcclxuXHJcbiAgIyBmb3IgY29udmVuaWVuY2UgYW5kIGRlYnVnZ2luZywgcGVyc2lzdCB0aGUgdGFnTmFtZVxyXG4gIHJldC5jb21wb25lbnROYW1lID0gdGFnTmFtZVxyXG5cclxuICAjIGByZW1vdmVgIGRvZXMsIGhvd2V2ZXIsIGJlaGF2ZSBhcyBleHBlY3RlZCBieSByZW1vdmluZyBgd2lkZ2V0YFxyXG4gIHJldC5yZW1vdmUgPSB3aWRnZXQucmVtb3ZlXHJcbiAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAnY29tcG9uZW50JywgY29tcG9uZW50XHJcbm1vZHVsZS5leHBvcnRzID0gY29tcG9uZW50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuXHJcbiMjI1xyXG5DcmVhdGUgYSBzZXQgb2YgSFRNTCBFbGVtZW50cyB0aHJvdWdoIFRoaW5Eb21cclxuIyMjXHJcbmNvbnRyb2wgPSAob3B0aW9ucyA9IG9iai5vYmplY3QoKSwgb3duZXIsIHRhZ05hbWUpIC0+XHJcbiAgaWYgbm90IHRhZ05hbWUuc3RhcnRzV2l0aCAneS0nIHRoZW4gdGFnTmFtZSA9ICd5LScgKyB0YWdOYW1lXHJcblxyXG4gIHJvb3ROb2RlVHlwZSA9IG9wdGlvbnMucm9vdE5vZGVUeXBlIG9yIE9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gb3IgJ2RpdidcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgcm9vdE5vZGVUeXBlLCBvcHRpb25zLCBvd25lciwgZmFsc2VcclxuXHJcbiAgcmV0LmFkZCAnY29udHJvbE5hbWUnLCB0YWdOYW1lXHJcblxyXG4gIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ2NvbnRyb2wnLCBjb250cm9sXHJcbm1vZHVsZS5leHBvcnRzID0gY29udHJvbCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiQgPSByZXF1aXJlICdqcXVlcnknXHJcbl8gPSByZXF1aXJlICdsb2Rhc2gnXHJcblxyXG5UaGluRE9NID0gcmVxdWlyZSAndGhpbmRvbSdcclxuXHJcbiMgIyBlbGVtZW50XHJcblxyXG5lbGVtZW50ID0gXHJcbiAgIyAjIyByZXN0b3JlRWxlbWVudFxyXG4gICMjI1xyXG4gIFJlc3RvcmUgYW4gSFRNTCBFbGVtZW50IHRocm91Z2ggVGhpbkRvbVxyXG4gICMjI1xyXG4gIHJlc3RvcmVFbGVtZW50OiAoZWwsIHRhZyA9IGVsLm5vZGVOYW1lKSAtPlxyXG4gICAgbm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG4gICAgdEQgPSBuZXcgVGhpbkRPTSBudWxsLCBudWxsLCBlbFxyXG4gICAgdEQuaXNJbkRPTSA9IHRydWVcclxuICAgIHJldCA9IG5vZGVGYWN0b3J5IHREXHJcbiAgICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdyZXN0b3JlRWxlbWVudCcsIGVsZW1lbnQucmVzdG9yZUVsZW1lbnRcclxuXHJcbk9KLnJlZ2lzdGVyICdpc0VsZW1lbnRJbkRvbScsIChlbGVtZW50SWQpIC0+XHJcbiAgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkgT0ouZ2V0RWxlbWVudCBlbGVtZW50SWRcclxuXHJcbk9KLnJlZ2lzdGVyICdnZXRFbGVtZW50JywgKGlkKSAtPlxyXG4gIGlmIHR5cGVvZiBkb2N1bWVudCBpc250ICd1bmRlZmluZWQnXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVsZW1lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgZnJhZ21lbnRcclxuXHJcbiMgQ3JlYXRlIGEgZG9jdW1lbnQgZnJhZ21lbnQgYW5kIHJldHVybiBpdCBhcyBhbiBPSiBub2RlXHJcbmZyYWdtZW50ID0gLT5cclxuICByZXQgPSBudWxsXHJcbiAgaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCdcclxuICAgIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXHJcbiAgICBcclxuICAgIGZyYWcgPSBuZXcgVGhpbkRPTSBudWxsLCBudWxsLCBmcmFnbWVudFxyXG4gICAgZnJhZy5pc0luRE9NID0gdHJ1ZVxyXG4gICAgcmV0ID0gbm9kZUZhY3RvcnkgZnJhZ1xyXG4gICAgXHJcbiAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAnZnJhZ21lbnQnLCBmcmFnbWVudFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZyYWdtZW50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vb2pJbml0J1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIGdlbmVyaWMgbm9kZXNcclxuXHJcbmNsb3NlZCA9IFtcclxuICAnYWJicidcclxuICAnYWNyb255bSdcclxuICAnYXBwbGV0J1xyXG4gICdhcnRpY2xlJ1xyXG4gICdhc2lkZSdcclxuICAnYXVkaW8nXHJcbiAgJ2InXHJcbiAgJ2JkbydcclxuICAnYmlnJ1xyXG4gICdibG9ja3F1b3RlJ1xyXG4gICdidXR0b24nXHJcbiAgJ2NhbnZhcydcclxuICAnY2FwdGlvbidcclxuICAnY2VudGVyJ1xyXG4gICdjaXRlJ1xyXG4gICdjb2RlJ1xyXG4gICdjb2xncm91cCdcclxuICAnZGF0YWxpc3QnXHJcbiAgJ2RkJ1xyXG4gICdkZWwnXHJcbiAgJ2RldGFpbHMnXHJcbiAgJ2RmbidcclxuICAnZGlyJ1xyXG4gICdkaXYnXHJcbiAgJ2RsJ1xyXG4gICdkdCdcclxuICAnZW0nXHJcbiAgJ2ZpZWxkc2V0J1xyXG4gICdmaWdjYXB0aW9uJ1xyXG4gICdmaWd1cmUnXHJcbiAgJ2ZvbnQnXHJcbiAgJ2Zvb3RlcidcclxuICAnaDEnXHJcbiAgJ2gyJ1xyXG4gICdoMydcclxuICAnaDQnXHJcbiAgJ2g1J1xyXG4gICdoNidcclxuICAnaGVhZCdcclxuICAnaGVhZGVyJ1xyXG4gICdoZ3JvdXAnXHJcbiAgJ2h0bWwnXHJcbiAgJ2knXHJcbiAgJ2lmcmFtZSdcclxuICAnaW5zJ1xyXG4gICdrYmQnXHJcbiAgJ2xhYmVsJ1xyXG4gICdsZWdlbmQnXHJcbiAgJ2xpJ1xyXG4gICdtYXAnXHJcbiAgJ21hcmsnXHJcbiAgJ21lbnUnXHJcbiAgJ21ldGVyJ1xyXG4gICduYXYnXHJcbiAgJ25vZnJhbWVzJ1xyXG4gICdub3NjcmlwdCdcclxuICAnb2JqZWN0J1xyXG4gICdvcHRncm91cCdcclxuICAnb3B0aW9uJ1xyXG4gICdvdXRwdXQnXHJcbiAgJ3AnXHJcbiAgJ3ByZSdcclxuICAncHJvZ3Jlc3MnXHJcbiAgJ3EnXHJcbiAgJ3JwJ1xyXG4gICdydCdcclxuICAncnVieSdcclxuICAncydcclxuICAnc2FtcCdcclxuICAnc2VjdGlvbidcclxuICAnc21hbGwnXHJcbiAgJ3NwYW4nXHJcbiAgJ3N0cmlrZSdcclxuICAnc3Ryb25nJ1xyXG4gICdzdHlsZSdcclxuICAnc3ViJ1xyXG4gICdzdW1tYXJ5J1xyXG4gICdzdXAnXHJcbiAgJ3Rib2R5J1xyXG4gICd0ZCdcclxuICAndGZvb3QnXHJcbiAgJ3RoJ1xyXG4gICd0aW1lJ1xyXG4gICd0aXRsZSdcclxuICAndHInXHJcbiAgJ3R0J1xyXG4gICd1J1xyXG4gICd2YXInXHJcbiAgJ3ZpZGVvJ1xyXG4gICd4bXAnXHJcbl1cclxub3BlbiA9ICdhcmVhIGJhc2UgY29sIGNvbW1hbmQgY3NzIGVtYmVkIGhyIGltZyBrZXlnZW4gbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyJy5zcGxpdCAnICdcclxuYWxsID0gY2xvc2VkLmNvbmNhdCBvcGVuXHJcblxyXG5leHBvcnRzID0ge31cclxuIyByZWdpc3RlciBzZW1hbnRpYy9zdHJ1Y3R1cmFsIGFsaWFzZXNcclxuZm9yIGxvb3BOYW1lIGluIGFsbFxyXG4gIGRvICh0YWcgPSBsb29wTmFtZSkgLT5cclxuICAgIG1ldGhvZCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gICAgICBkZWZhdWx0cyA9XHJcbiAgICAgICAgcHJvcHM6IHt9XHJcbiAgICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICAgIGV2ZW50czoge31cclxuXHJcbiAgICAgIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnNcclxuICAgICAgcmV0ID0gbm9kZUZhY3RvcnkgdGFnLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gICAgICByZXRcclxuICAgIE9KLm5vZGVzLnJlZ2lzdGVyIHRhZywgbWV0aG9kXHJcbiAgICBleHBvcnRzW3RhZ10gPSBtZXRob2RcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jIyNcclxuQ3JlYXRlIGFuIE9KIElucHV0IE9iamVjdCB0aHJvdWdoIE9KLm5vZGVzLmlucHV0XHJcbiMjI1xyXG5pbnB1dCA9IChvcHRpb25zID0gT0oub2JqZWN0KCksIG93bmVyKSAtPlxyXG4gIGlmIG5vdCBvd25lciB0aGVuIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhbiBpbnB1dCB3aXRob3V0IGEgcGFyZW50J1xyXG4gIGlmIG5vdCBvcHRpb25zLnByb3BzIG9yIG5vdCBvcHRpb25zLnByb3BzLnR5cGUgdGhlbiB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgYW4gaW5wdXQgd2l0aG91dCBhbiBpbnB1dCB0eXBlJ1xyXG4gIHJldCA9IG93bmVyLm1ha2UgJ2lucHV0Jywgb3B0aW9uc1xyXG4gIHJldC5hZGQgJ2lucHV0TmFtZScsIG9wdGlvbnMucHJvcHMudHlwZVxyXG4gIHJldFxyXG4gICAgXHJcbk9KLnJlZ2lzdGVyICdpbnB1dCcsIGlucHV0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdXQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xyXG5UaGluRE9NID0gcmVxdWlyZSAndGhpbmRvbSdcclxuTm9kZSA9IHJlcXVpcmUgJy4vTm9kZSdcclxuXHJcbiNjbG9zZWQgPSAnYSBhYmJyIGFjcm9ueW0gYWRkcmVzcyBhcHBsZXQgYXJ0aWNsZSBhc2lkZSBhdWRpbyBiIGJkbyBiaWcgYmxvY2txdW90ZSBib2R5IGJ1dHRvbiBjYW52YXMgY2FwdGlvbiBjZW50ZXIgY2l0ZSBjb2RlIGNvbGdyb3VwIGNvbW1hbmQgZGF0YWxpc3QgZGQgZGVsIGRldGFpbHMgZGZuIGRpciBkaXYgZGwgZHQgZW0gZW1iZWQgZmllbGRzZXQgZmlnY2FwdGlvbiBmaWd1cmUgZm9udCBmb290ZXIgZm9ybSBmcmFtZXNldCBoMSBoMiBoMyBoNCBoNSBoNiBoZWFkIGhlYWRlciBoZ3JvdXAgaHRtbCBpIGlmcmFtZSBpbnMga2V5Z2VuIGtiZCBsYWJlbCBsZWdlbmQgbGkgbWFwIG1hcmsgbWVudSBtZXRlciBuYXYgbm9mcmFtZXMgbm9zY3JpcHQgb2JqZWN0IG9sIG9wdGdyb3VwIG9wdGlvbiBvdXRwdXQgcCBwcmUgcHJvZ3Jlc3MgcSBycCBydCBydWJ5IHMgc2FtcCBzY3JpcHQgc2VjdGlvbiBzZWxlY3Qgc21hbGwgc291cmNlIHNwYW4gc3RyaWtlIHN0cm9uZyBzdHlsZSBzdWIgc3VtbWFyeSBzdXAgdGFibGUgdGJvZHkgdGQgdGV4dGFyZWEgdGZvb3QgdGggdGhlYWQgdGltZSB0aXRsZSB0ciB0dCB1IHVsIHZhciB2aWRlbyB3YnIgeG1wJy5zcGxpdCAnICdcclxuI29wZW4gPSAnYXJlYSBiYXNlIGJyIGNvbCBjb21tYW5kIGNzcyAhRE9DVFlQRSBlbWJlZCBociBpbWcgaW5wdXQga2V5Z2VuIGxpbmsgbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyJy5zcGxpdCAnICdcclxuI1xyXG4jbmVzdGFibGVOb2RlTmFtZXMgPSBbXHJcbiMgICdkaXYnXHJcbiMgICdzcGFuJ1xyXG4jICAnaDEnXHJcbiMgICdoMidcclxuIyAgJ2gzJ1xyXG4jICAnaDQnXHJcbiMgICdoNSdcclxuIyAgJ2g2J1xyXG4jICAncCdcclxuIyAgJ2ZpZWxkc2V0J1xyXG4jICAnc2VsZWN0J1xyXG4jICAnb2wnXHJcbiMgICd1bCdcclxuIyAgJ3RhYmxlJ1xyXG4jXVxyXG4jXHJcbiMjVGhpcyBsaXN0IGlzIG5vdCB5ZXQgZXhoYXVzdGl2ZSwganVzdCBleGNsdWRlIHRoZSBvYnZpb3VzXHJcbiNub25OZXN0YWJsZU5vZGVzID0gW1xyXG4jICAnbGknXHJcbiMgICdsZWdlbmQnXHJcbiMgICd0cidcclxuIyAgJ3RkJ1xyXG4jICAnb3B0aW9uJ1xyXG4jICAnYm9keSdcclxuIyAgJ2hlYWQnXHJcbiMgICdzb3VyY2UnXHJcbiMgICd0Ym9keSdcclxuIyAgJ3Rmb290J1xyXG4jICAndGhlYWQnXHJcbiMgICdsaW5rJ1xyXG4jICAnc2NyaXB0J1xyXG4jXVxyXG4jXHJcbiNub2RlTmFtZXMgPSBbXHJcbiMgICdhJ1xyXG4jICAnYidcclxuIyAgJ2JyJ1xyXG4jICAnYnV0dG9uJ1xyXG4jICAnZGl2J1xyXG4jICAnZW0nXHJcbiMgICdmaWVsZHNldCdcclxuIyAgJ2Zvcm0nXHJcbiMgICdoMSdcclxuIyAgJ2gyJ1xyXG4jICAnaDMnXHJcbiMgICdoNCdcclxuIyAgJ2g1J1xyXG4jICAnaDYnXHJcbiMgICdpJ1xyXG4jICAnaW1nJ1xyXG4jICAnaW5wdXQnXHJcbiMgICdsYWJlbCdcclxuIyAgJ2xlZ2VuZCdcclxuIyAgJ2xpJ1xyXG4jICAnbmF2J1xyXG4jICAnb2wnXHJcbiMgICdvcHRpb24nXHJcbiMgICdwJ1xyXG4jICAnc2VsZWN0J1xyXG4jICAnc3BhbidcclxuIyAgJ3N0cm9uZydcclxuIyAgJ3N1cCdcclxuIyAgJ3N2ZydcclxuIyAgJ3RhYmxlJ1xyXG4jICAndGJvZHknXHJcbiMgICd0ZCdcclxuIyAgJ3RleHRhcmVhJ1xyXG4jICAndGgnXHJcbiMgICd0aGVhZCdcclxuIyAgJ3RyJ1xyXG4jICAndWwnXHJcbiNdXHJcblxyXG5jbGFzcyBOb2RlRmFjdG9yeVxyXG4gIFxyXG4gIG9qTm9kZTogbnVsbFxyXG4gIFxyXG4gIEBnZXQ6IChpZCwgdGFnTmFtZSA9ICdkaXYnKSAtPlxyXG4gICAgcmV0ID0gbnVsbFxyXG4gICAgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCBpZFxyXG4gICAgaWYgZWxcclxuICAgICAgdGhpbkVsID0gT0oucmVzdG9yZUVsZW1lbnQgZWwsIHRhZ05hbWVcclxuICAgIGlmIHRoaW5FbFxyXG4gICAgICByZXQgPSBuZXcgTm9kZUZhY3RvcnkgbnVsbCwgbnVsbCwgbnVsbCwgZmFsc2UsIHRoaW5FbFxyXG5cclxuICAgIHJldFxyXG4gIFxyXG4gIF9tYWtlQWRkOiAodGFnTmFtZSwgY291bnQpIC0+XHJcbiAgICAob3B0cykgPT5cclxuICAgICAgbWV0aG9kID0gT0oubm9kZXNbdGFnTmFtZV0gb3IgT0ouY29tcG9uZW50c1t0YWdOYW1lXSBvciBPSi5jb250cm9sc1t0YWdOYW1lXSBvciBPSi5pbnB1dHNbdGFnTmFtZV1cclxuICAgICAgaWYgbWV0aG9kXHJcbiAgICAgICAgbnUgPSBtZXRob2Qgb3B0cywgQG9qTm9kZVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgbnUgPSBPSi5jb21wb25lbnQgbnVsbCwgQG9qTm9kZSwgdGFnTmFtZVxyXG4gICAgICAjcmV0ID0gbmV3IE5vZGVGYWN0b3J5IG51LCBAdGhpbk5vZGUsIGNvdW50XHJcbiAgICAgIG51XHJcbiAgXHJcbiAgX21ha2VVbmlxdWVJZDogKGNvdW50KSAtPlxyXG4gICAgaWYgT0ouR0VORVJBVEVfVU5JUVVFX0lEU1xyXG4gICAgICBjb3VudCArPSAxXHJcbiAgICAgIGlmIGNvdW50IDw9IEBvd25lci5jb3VudCB0aGVuIGNvdW50ID0gQG93bmVyLmNvdW50ICsgMVxyXG4gICAgICBAb3duZXIuY291bnQgPSBjb3VudFxyXG5cclxuICAgICAgaWYgbm90IEBvak5vZGUuZ2V0SWQoKVxyXG4gICAgICAgIGlkID0gQG93bmVyLmdldElkKCkgb3IgJydcclxuICAgICAgICBpZCArPSBAb2pOb2RlLnRhZ05hbWUgKyBjb3VudFxyXG4gICAgICAgIEBvak5vZGUuYXR0ciAnaWQnLCBpZFxyXG4gICAgcmV0dXJuXHJcbiAgXHJcbiAgX2JpbmRFdmVudHM6IC0+XHJcbiAgICBpZiBAb2pOb2RlIHRoZW4gXy5mb3JPd24gQG9wdGlvbnMuZXZlbnRzLCAodmFsLCBrZXkpID0+XHJcbiAgICAgIGlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXHJcbiAgICAgIGlmIGlzTWV0aG9kLm1ldGhvZCB2YWxcclxuICAgICAgICBjYWxsYmFjayA9IChldmVudC4uLikgLT4gdmFsIGV2ZW50Li4uXHJcbiAgICAgICAgQG9qTm9kZS4kLm9uIGtleSwgY2FsbGJhY2tcclxuICAgICAgICBAb2pOb2RlLmFkZCBrZXksIGNhbGxiYWNrXHJcbiAgICAgICAgbnVsbFxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yOiAoQHRhZywgQG9wdGlvbnMsIEBvd25lciwgQHRoaW5Ob2RlID0gbnVsbCkgLT5cclxuICAgIGlmIEB0YWcgYW5kIG5vdCBAdGhpbk5vZGVcclxuICAgICAgQHRoaW5Ob2RlID0gbmV3IFRoaW5ET00gQHRhZywgQG9wdGlvbnMucHJvcHNcclxuICAgICAgQHRoaW5Ob2RlLmFkZCAndGFnTmFtZScsIEB0YWdcclxuICAgICAgQHRoaW5Ob2RlLmNzcyBAb3B0aW9ucy5zdHlsZXNcclxuICAgICAgaWYgQG9wdGlvbnMudGV4dCB0aGVuIEB0aGluTm9kZS50ZXh0IEBvcHRpb25zLnRleHRcclxuICAgIFxyXG4gICAgaWYgQG93bmVyXHJcbiAgICAgIEBtYWtlKClcclxuICBcclxuICBhZGRNYWtlTWV0aG9kOiAoY291bnQpIC0+XHJcbiAgICBtZXRob2RzID0gT0oub2JqZWN0KClcclxuICAgIEBvak5vZGUubWFrZSA9ICh0YWdOYW1lLCBvcHRzKSA9PlxyXG4gICAgICBtZXRob2QgPSBtZXRob2RzW3RhZ05hbWVdXHJcbiAgICAgIGlmIG5vdCBtZXRob2RcclxuICAgICAgICBtZXRob2QgPSBAX21ha2VBZGQgdGFnTmFtZSwgQG9qTm9kZSwgY291bnRcclxuICAgICAgICBtZXRob2RzW3RhZ05hbWVdID0gbWV0aG9kXHJcbiAgICAgIG1ldGhvZCBvcHRzXHJcbiAgICBAb2pOb2RlXHJcblxyXG4gIG1ha2U6IC0+XHJcblxyXG4gICAgQG9qTm9kZSA9IG51bGxcclxuXHJcbiAgICBpZiBAdGhpbk5vZGU/LmlzRnVsbHlJbml0IHRoZW4gQG9qTm9kZSA9IEB0aGluTm9kZVxyXG4gIFxyXG4gICAgIyAyOiBJZiB0aGUgZWxlbWVudCBoYXMgbmV2ZXIgYmVlbiBpbml0aWFsaXplZCwgY29udGludWVcclxuICAgIGVsc2VcclxuICAgICAgIyAzOiBBcyBsb25nIGFzIHRoZSBlbGVtZW50IGlzbid0IHRoZSBib2R5IG5vZGUsIGNvbnRpbnVlXHJcbiAgICAgICMgaWYgZWwudGFnTmFtZSBpc250ICdib2R5J1xyXG4gICAgICAjIDQ6IEV4dGVuZCB0aGUgZWxlbWVudCB3aXRoIHN0YW5kYXJkIGpRdWVyeSBBUEkgbWV0aG9kc1xyXG4gICAgICBAb2pOb2RlID0gbmV3IE5vZGUgQHRoaW5Ob2RlLCBAb3duZXJcclxuICAgICAgY291bnQgPSAoQG93bmVyLmNvdW50ICsgMSkgfHwgMVxyXG4gICAgICAjIDU6IElmIHRoZSBub2RlIGlzbid0IGluIHRoZSBET00sIGFwcGVuZCBpdCB0byB0aGUgcGFyZW50XHJcbiAgICAgICMgVGhpcyBhbHNvIGFjY29tbW9kYXRlcyBkb2N1bWVudCBmcmFnbWVudHMsIHdoaWNoIGFyZSBub3QgaW4gdGhlIERPTSBidXQgYXJlIHByZXN1bWVkIHRvIGJlIHNvdW5kIHVudGlsIHJlYWR5IGZvciBtYW51YWwgaW5zZXJ0aW9uXHJcbiAgICAgIGlmIEB0aGluTm9kZS50YWdOYW1lIGlzbnQgJ2JvZHknIGFuZCBub3QgQHRoaW5Ob2RlLmlzSW5ET00gYW5kIG5vdCBAb2pOb2RlLmlzSW5ET01cclxuICAgICAgICBAX21ha2VVbmlxdWVJZCBjb3VudFxyXG4gICAgICAgIEBvd25lci5hcHBlbmQgQG9qTm9kZVswXVxyXG4gICAgICAgICMgNjogQmluZCBhbnkgZGVmaW5lZCBldmVudHMgYWZ0ZXIgdGhlIG5vZGUgaXMgaW4gdGhlIERPTVxyXG4gICAgICAgIEBfYmluZEV2ZW50cygpXHJcbiAgICAgICAgXHJcbiAgICAgIEB0aGluTm9kZS5pc0luRE9NID0gdHJ1ZVxyXG4gICAgICBAb2pOb2RlLmlzSW5ET00gPSB0cnVlXHJcblxyXG4gICAgICAjIDc6IENyZWF0ZSB0aGUgYWxsIGltcG9ydGFudCAnbWFrZScgbWV0aG9kXHJcbiAgICAgIEBhZGRNYWtlTWV0aG9kIGNvdW50XHJcblxyXG4gICAgICAjIDg6IFByZXZlbnQgZHVwbGljYXRlIGZhY3RvcnkgZXh0ZW5zaW9uIGJ5IHNldHRpbmcgaXMgaW5pdCA9IHRydWVcclxuICAgICAgQG9qTm9kZS5pc0Z1bGx5SW5pdCA9IHRydWVcclxuXHJcbiAgICAgICMgOTogaWYgdGhlIG5vZGUgc3VwcG9ydHMgaXQsIGNhbGwgZmluYWxpemVcclxuICAgICAgZmluYWxpemUgPSBfLm9uY2UgQG9qTm9kZS5maW5hbGl6ZSBvciBPSi5ub29wXHJcbiAgICAgIEBvak5vZGUuZmluYWxpemUgPSBmaW5hbGl6ZVxyXG4gICAgICBmaW5hbGl6ZSBAb2pOb2RlXHJcbiAgICAjIDEwOiBSZXR1cm4gdGhlIGV4dGVuZGVkIGVsZW1lbnRcclxuICAgIEBvak5vZGVcclxuXHJcbmdldE5vZGVGcm9tRmFjdG9yeSA9ICh0YWcsIG9wdGlvbnMsIG93bmVyLCBpc0NhbGxlZEZyb21GYWN0b3J5LCBub2RlKSAtPlxyXG4gIGlmIE9KLmlzLnN0cmluZyB0YWdcclxuICAgIGZhY3RvcnkgPSBuZXcgTm9kZUZhY3RvcnkgdGFnLCBvcHRpb25zLCBvd25lclxyXG4gIGVsc2VcclxuICAgIGZhY3RvcnkgPSBuZXcgTm9kZUZhY3RvcnkgbnVsbCwgb3B0aW9ucywge30sIHRhZ1xyXG4gIGZhY3Rvcnkub2pOb2RlXHJcblxyXG5cclxuT0oucmVnaXN0ZXIgJ25vZGVGYWN0b3J5JywgZ2V0Tm9kZUZyb21GYWN0b3J5XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGdldE5vZGVGcm9tRmFjdG9yeSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIGFcclxubm9kZU5hbWUgPSAnYSdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgaWQ6ICcnXHJcbiAgICAgIGNsYXNzOiAnJ1xyXG4gICAgICB0ZXh0OiAnJ1xyXG4gICAgICBocmVmOiAnamF2YVNjcmlwdDp2b2lkKDApOydcclxuICAgICAgdHlwZTogJydcclxuICAgICAgdGl0bGU6ICcnXHJcbiAgICAgIHJlbDogJydcclxuICAgICAgbWVkaWE6ICcnXHJcbiAgICAgIHRhcmdldDogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICB0b2dnbGVTdGF0ZSA9ICdvZmYnXHJcblxyXG4gIHRvZ2dsZSA9IC0+XHJcbiAgICBpZiB0b2dnbGVTdGF0ZSBpcyAnb24nXHJcbiAgICAgIHRvZ2dsZVN0YXRlID0gJ29mZidcclxuICAgIGVsc2UgdG9nZ2xlU3RhdGUgPSAnb24nICBpZiB0b2dnbGVTdGF0ZSBpcyAnb2ZmJ1xyXG4gICAgcmV0dXJuXHJcblxyXG4gICMgQ2xpY2sgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jbGljayBpc250IE9KLm5vb3BcclxuICAgIGNsaWNrID0gZGVmYXVsdHMuZXZlbnRzLmNsaWNrXHJcbiAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cclxuICAgICAgdG9nZ2xlKClcclxuICAgICAgcmV0VmFsID0gY2xpY2sgZXZlbnQuLi5cclxuICAgICAgaWYgZGVmYXVsdHMuaHJlZiBpcyAnIycgdGhlbiByZXRWYWwgPSBmYWxzZVxyXG4gICAgICByZXRWYWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXHJcbiAgZWxzZVxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gdG9nZ2xlXHJcblxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcblxyXG5cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbnRvID0gcmVxdWlyZSAnLi4vdG9vbHMvdG8nXHJcbiMgIyBiclxyXG5cclxubm9kZU5hbWUgPSAnYnInXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBudW1iZXI6IDFcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgaSA9IDBcclxuICB3aGlsZSBpIDwgdG8ubnVtYmVyIGRlZmF1bHRzLm51bWJlclxyXG4gICAgIyBJbiB0aGUgY2FzZSBvZiBtdWx0aXBsZSBicnMsIGl0IGlzIGRlc2lyYWJsZSB0byBvbmx5IGdldCB0aGUgbGFzdCBvbmUgb3V0XHJcbiAgICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuICAgIGkgKz0gMVxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG5cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgZm9ybVxyXG5cclxubm9kZU5hbWUgPSAnZm9ybSdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgYWN0aW9uOiAnJ1xyXG4gICAgICBtZXRob2Q6ICcnXHJcbiAgICAgIG5hbWU6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gIHJldC5hZGQgJ3ZhbGlkYXRvcicsIHJldC4kLnZhbGlkYXRlKFxyXG4gICAgaGlnaGxpZ2h0OiAoZWxlbWVudCkgLT5cclxuICAgICAgJGVsbSA9ICQoZWxlbWVudClcclxuICAgICAgJGVsbS5hdHRyICdPSl9pbnZhbGlkJywgJzEnXHJcbiAgICAgICRlbG0uYW5pbWF0ZSBiYWNrZ3JvdW5kQ29sb3I6ICdyZWQnXHJcbiAgICAgIG51bGxcclxuXHJcbiAgICB1bmhpZ2hsaWdodDogKGVsZW1lbnQpIC0+XHJcbiAgICAgICRlbG0gPSAkKGVsZW1lbnQpXHJcbiAgICAgIGlmICRlbG0uYXR0cignT0pfaW52YWxpZCcpIGlzICcxJ1xyXG4gICAgICAgICRlbG0uY3NzICdiYWNrZ3JvdW5kLWNvbG9yJywgJ3llbGxvdydcclxuICAgICAgICAkZWxtLmF0dHIgJ09KX2ludmFsaWQnLCAnMCdcclxuICAgICAgICBzZXRUaW1lb3V0ICgtPlxyXG4gICAgICAgICAgJGVsbS5hbmltYXRlIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50J1xyXG4gICAgICAgICksIDUwMFxyXG4gICAgICBudWxsXHJcbiAgKVxyXG5cclxuICByZXQuYWRkICdpc0Zvcm1WYWxpZCcsIC0+XHJcbiAgICByZXQuJC52YWxpZCgpIGFuZCAobm90IHJldC52YWxpZGF0b3IuaW52YWxpZEVsZW1lbnRzKCkgb3IgcmV0LnZhbGlkYXRvci5pbnZhbGlkRWxlbWVudHMoKS5sZW5ndGggaXMgMClcclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcclxuXHJcblxyXG5cclxuXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5lbnVtcyA9IHJlcXVpcmUgJy4uL3Rvb2xzL2VudW1zJ1xyXG5cclxuIyAjIGlucHV0XHJcblxyXG5ub2RlTmFtZSA9ICdpbnB1dCdcclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICB0eXBlOiAndGV4dCdcclxuICAgICAgdmFsdWU6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICAgIGNoYW5nZTogT0oubm9vcFxyXG4gICAgICBmb2N1c291dDogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgaWYgbm90IGRlZmF1bHRzLnByb3BzLnR5cGUgb3Igbm90IGVudW1zLmlucHV0VHlwZXNbZGVmYXVsdHMucHJvcHMudHlwZV1cclxuICAgIHRocm93IG5ldyBFcnJvciAnTm8gbWF0Y2hpbmcgaW5wdXQgdHlwZSBmb3IgeycgKyBkZWZhdWx0cy5wcm9wcy50eXBlICsgJ30gY291bGQgYmUgZm91bmQuJ1xyXG4gIHRoaXNUeXBlID0gZW51bXMuaW5wdXRUeXBlc1tkZWZhdWx0cy5wcm9wcy50eXBlXVxyXG5cclxuICBzeW5jVmFsdWUgPSAtPlxyXG4gICAgc3dpdGNoIHRoaXNUeXBlXHJcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5jaGVja2JveFxyXG4gICAgICAgIHJldC52YWx1ZSA9IHJldC4kLmlzICc6Y2hlY2tlZCdcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLnJhZGlvXHJcbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LiQuZmluZCgnOmNoZWNrZWQnKS52YWwoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LnZhbCgpXHJcbiAgICBkZWZhdWx0cy5wcm9wcy52YWx1ZSA9IHJldC52YWx1ZSAgICBcclxuICAgIHJldC52YWx1ZVxyXG5cclxuICAjIyNcclxuICAgIENsaWNrIGJpbmRpbmcuIElmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGNsaWNrIGhhbmRsZXIsXHJcbiAgICB3cmFwIGl0LCBzeW5jIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQgZmlyc3QsXHJcbiAgICB0aGVuIGNhbGwgdGhlIGRlZmluZWQgY2xpY2sgaGFuZGxlciB3aXRoIHRoZSBsYXRlc3QgdmFsdWUuXHJcbiAgIyMjXHJcbiAgb2xkQ2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICBpZiBvbGRDbGljayBhbmQgb2xkQ2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cclxuICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgb2xkQ2xpY2sgcmV0LnZhbHVlLCBldmVudC4uLlxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuXHJcbiAgIyMjXHJcbiAgICBDaGFuZ2UgYmluZGluZy4gSWYgdGhlIGNhbGxlciBkZWZpbmVkIGEgY2hhbmdlIGhhbmRsZXIsXHJcbiAgICB3cmFwIGl0LCBzeW5jIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQgZmlyc3QsXHJcbiAgICB0aGVuIGNhbGwgdGhlIGRlZmluZWQgY2hhbmdlIGhhbmRsZXIgd2l0aCB0aGUgbGF0ZXN0IHZhbHVlLlxyXG4gICMjI1xyXG4gIG9sZENoYW5nZSA9IGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2VcclxuICBpZiBvbGRDaGFuZ2UgYW5kIG9sZENoYW5nZSBpc250IE9KLm5vb3BcclxuICAgIG5ld0NoYW5nZSA9IChldmVudC4uLikgLT5cclxuICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgb2xkQ2hhbmdlIHJldC52YWx1ZSwgZXZlbnQuLi5cclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuXHJcbiAgIyMjXHJcbiAgICBPbiBGb2N1cyBPdXQgYmluZGluZy4gQWx3YXlzIHVzZSB0aGUgZXZlbnQgdG8gdXBkYXRlIHRoZSBpbnRlcm5hbFxyXG4gICAgdmFsdWUgb2YgdGhlIGNvbnRyb2w7IGFuZCBpZiB0aGUgY2FsbGVyIGRlZmluZWQgYSBmb2N1c291dCBldmVudCxcclxuICAgIHdyYXAgaXQgYW5kIGludm9rZSBpdCB3aXRoIHRoZSBsYXRlc3QgdmFsdWVcclxuICAjIyNcclxuICBvbGRGb2N1c291dCA9IGRlZmF1bHRzLmV2ZW50cy5mb2N1c291dFxyXG4gIG5ld0ZvY3Vzb3V0ID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgc3luY1ZhbHVlKClcclxuICAgIGlmIG9sZEZvY3Vzb3V0IGFuZCBvbGRGb2N1c291dCBpc250IE9KLm5vb3BcclxuICAgICAgb2xkRm9jdXNvdXQgcmV0LnZhbHVlLCBldmVudC4uLlxyXG5cclxuICBkZWZhdWx0cy5ldmVudHMuZm9jdXNvdXQgPSBuZXdGb2N1c291dFxyXG5cclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuICByZXQudmFsdWUgPSBkZWZhdWx0cy5wcm9wcy52YWx1ZVxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgb2xcclxuXHJcbm5vZGVOYW1lID0gJ29sJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOiB7fVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBzZWxlY3RcclxuXHJcbm5vZGVOYW1lID0gJ3NlbGVjdCdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBzZWxlY3RlZDogJydcclxuICAgICAgbXVsdGlwbGU6IGZhbHNlXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICB2YWx1ZXM6IFtdXHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICAgIGNoYW5nZTogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgdmFsdWUgPSAnJ1xyXG4gIHZhbHVlcyA9IFtdXHJcbiAgaGFzRW1wdHkgPSBmYWxzZVxyXG5cclxuICBzeW5jVmFsdWUgPSAtPlxyXG4gICAgdmFsdWUgPSByZXQudmFsKClcclxuXHJcbiAgIyBDbGljayBiaW5kaW5nXHJcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICByZXR2YWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXHJcblxyXG4gICMgQ2hhbmdlIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2hhbmdlIGlzbnQgT0oubm9vcFxyXG4gICAgY2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gICAgbmV3Q2hhbmdlID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICByZXR2YWwgPSBjaGFuZ2UgZXZlbnQuLi5cclxuICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgcmV0dmFsXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2hhbmdlID0gbmV3Q2hhbmdlXHJcblxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gIHJldC5hZGQgJ3NlbGVjdGVkRGF0YScsIChwcm9wTmFtZSkgLT5cclxuICAgIHJldCA9ICcnXHJcbiAgICBpZiByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKSBhbmQgcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF1cclxuICAgICAgZGF0YXNldCA9IHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdLmRhdGFzZXRcclxuICAgICAgcmV0ID0gZGF0YXNldFtwcm9wTmFtZV0gIGlmIGRhdGFzZXRcclxuICAgIHJldFxyXG5cclxuICByZXQuYWRkICdzZWxlY3RlZFRleHQnLCAtPlxyXG4gICAgcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudGV4dCgpXHJcblxyXG4gIHJldC5hZGQgJ3NlbGVjdGVkVmFsJywgLT5cclxuICAgIHZhbHVlID0gcmV0LnZhbCgpXHJcbiAgICB2YWx1ZVxyXG5cclxuICByZXQuYWRkICdhZGRPcHRpb24nLCAodmFsdWUsIHRleHQgPSB2YWx1ZSwgc2VsZWN0ZWQgPSBmYWxzZSwgZGlzYWJsZWQgPSBmYWxzZSkgLT5cclxuICAgIGlzRW1wdHkgPSBfLmlzRW1wdHkgdmFsdWVcclxuICAgIGFkZCA9IGZhbHNlXHJcbiAgICBpZiBpc0VtcHR5IGFuZCBmYWxzZSBpcyBoYXNFbXB0eVxyXG4gICAgICBoYXNFbXB0eSA9IHRydWVcclxuICAgICAgYWRkID0gdHJ1ZVxyXG4gICAgaWYgZmFsc2UgaXMgYWRkIGFuZCBmYWxzZSBpcyBpc0VtcHR5IHRoZW4gYWRkID0gdHJ1ZVxyXG4gICAgaWYgYWRkXHJcbiAgICAgIHZhbCA9XHJcbiAgICAgICAgdGV4dDogdGV4dFxyXG4gICAgICAgIHByb3BzOlxyXG4gICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgIGlmIHNlbGVjdGVkXHJcbiAgICAgICAgdmFsLnNlbGVjdGVkID0gc2VsZWN0ZWRcclxuICAgICAgaWYgZGlzYWJsZWRcclxuICAgICAgICB2YWwuZGlzYWJsZWQgPSBkaXNhYmxlZFxyXG4gICAgICBvcHRpb24gPSByZXQubWFrZSAnb3B0aW9uJywgdmFsXHJcbiAgICAgIG9wdGlvblxyXG5cclxuICByZXQuYWRkICdhZGRPcHRpb25zJywgKG9wdGlvbnMpIC0+XHJcbiAgICB2YWx1ZXMgPSBfLnVuaW9uIHZhbHVlcywgb3B0aW9uc1xyXG4gICAgT0ouZWFjaCBvcHRpb25zLCAoKHZhbCkgLT5cclxuICAgICAgdmFsdWUgPSByZXQuYWRkT3B0aW9uKHZhbClcclxuICAgICAgdmFsdWVzLnB1c2ggdmFsdWVcclxuICAgICksIGZhbHNlXHJcbiAgICB2YWx1ZXNcclxuXHJcbiAgcmV0LmFkZCAncmVzZXRPcHRpb25zJywgKHZhbHVlcykgLT5cclxuICAgIHJldC5lbXB0eSgpXHJcbiAgICB2YWx1ZXMgPSB2YWx1ZXNcclxuICAgIHJldC5hZGRPcHRpb25zIHZhbHVlc1xyXG4gICAgcmV0XHJcblxyXG4gIHJldC5hZGQgJ3JlbW92ZU9wdGlvbicsICh2YWx1ZVRvUmVtb3ZlKSAtPlxyXG4gICAgdmFsdWVzLnNwbGljZSB2YWx1ZXMuaW5kZXhPZih2YWx1ZVRvUmVtb3ZlKSwgMSAjcmVtb3ZlcyB0aGUgaXRlbSBmcm9tIHRoZSBsaXN0XHJcbiAgICBzZWxlY3RDb250cm9sID0gcmV0WzBdXHJcbiAgICBpID0gMFxyXG5cclxuICAgIHdoaWxlIGkgPCBzZWxlY3RDb250cm9sLmxlbmd0aFxyXG4gICAgICBzZWxlY3RDb250cm9sLnJlbW92ZSBpICBpZiBzZWxlY3RDb250cm9sLm9wdGlvbnNbaV0udmFsdWUgaXMgdmFsdWVUb1JlbW92ZVxyXG4gICAgICBpKytcclxuICAgIG51bGxcclxuXHJcblxyXG5cclxuICBpZiBkZWZhdWx0cy52YWx1ZXMubGVuZ3RoID4gMFxyXG4gICAgcmV0LmFkZE9wdGlvbnMgZGVmYXVsdHMudmFsdWVzXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbl8gPSByZXF1aXJlICdsb2Rhc2gnXHJcbmFycmF5MkQgPSByZXF1aXJlICcuLi90b29scy9hcnJheTJEJ1xyXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG5Kc29uVG9UYWJsZSA9IHJlcXVpcmUgJy4uL3Rvb2xzL0pzb25Ub1RhYmxlJ1xyXG5cclxuIyAjIHRhYmxlXHJcblxyXG5ub2RlTmFtZSA9ICd0YWJsZSdcclxuXHJcbiMjI1xyXG5DcmVhdGUgYW4gSFRNTCB0YWJsZS4gUHJvdmlkZXMgaGVscGVyIG1ldGhvZHMgdG8gY3JlYXRlIENvbHVtbnMgYW5kIENlbGxzLlxyXG4jIyNcclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gICMgIyMgb3B0aW9uc1xyXG4gIGRlZmF1bHRzID1cclxuICAgICMgIyMjIGRhdGFcclxuICAgICMgb3B0aW9uYWwgYXJyYXkgb2Ygb2JqZWN0cy4gaWYgcHJvdmlkZWQgd2lsbCBnZW5lcmF0ZSB0YWJsZSBhdXRvbWF0aWNhbGx5LlxyXG4gICAgZGF0YTogbnVsbFxyXG4gICAgIyAjIyMgcHJvcHNcclxuICAgICMgb3B0aW9uYWwgcHJvcGVydGllcyB0byBhcHBseSB0byB0YWJsZSByb290IG5vZGVcclxuICAgIHByb3BzOlxyXG4gICAgICBjZWxscGFkZGluZzogMFxyXG4gICAgICBjZWxsc3BhY2luZzogMFxyXG4gICAgICBhbGlnbjogJydcclxuICAgICAgd2lkdGg6ICcnXHJcbiAgICAgIGNlbGxhbGlnbjogJ2xlZnQnXHJcbiAgICAgIGNlbGx2YWxpZ246ICd0b3AnXHJcbiAgICAgIGNsYXNzOiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOiB7fVxyXG4gICAgIyAjIyMgY2VsbHNcclxuICAgICMgb3B0aW9uYWwgcHJvcGVydGllcyB0byBhcHBseSB0byBpbmRpdmlkdWFsIGNlbGxzXHJcbiAgICBjZWxsczpcclxuICAgICAgY2xhc3M6ICcnXHJcbiAgICAgIGFsaWduOiAnJ1xyXG4gICAgICAndmVydGljYWwtYWxpZ24nOiAnJ1xyXG4gICAgICBjZWxscGFkZGluZzogJydcclxuICAgICAgbWFyZ2luOiAnJ1xyXG4gICAgIyAjIyMgdGhlYWRcclxuICAgICMgb3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdG8gcGFzcyBpbnRvIHRoZWFkIGNyZWF0aW9uXHJcbiAgICB0aGVhZDoge31cclxuICAgICMgIyMjIHRib2R5XHJcbiAgICAjIG9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRvIHBhc3MgaW50byB0Ym9keSBjcmVhdGlvblxyXG4gICAgdGJvZHk6IHt9XHJcblxyXG4gICAgZmlyc3RBbGlnblJpZ2h0OiBmYWxzZVxyXG4gICAgb2RkQWxpZ25SaWdodDogZmFsc2VcclxuXHJcbiAgcm93cyA9IFtdXHJcbiAgY2VsbHMgPSBhcnJheTJEKClcclxuICBjb2x1bW5Db3VudCA9IDBcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuIFxyXG5cclxuICB0Ym9keSA9IG51bGxcclxuICB0aGVhZCA9IG51bGxcclxuICB0aGVhZFJvdyA9IG51bGxcclxuXHJcbiAgIyAjIyMgaW5pdFxyXG4gICMgaW50ZXJuYWwgbWV0aG9kIGZvciBvbmUgdGltZSBpbml0aWFsaXphdGlvbiBvZiB0aGUgdGFibGVcclxuICBpbml0ID0gXy5vbmNlIC0+XHJcbiAgICBpZiBkZWZhdWx0cy5kYXRhXHJcbiAgICAgIGoydCA9IG5ldyBKc29uVG9UYWJsZSBkZWZhdWx0cy5kYXRhXHJcbiAgICAgIHRibFN0ciA9IGoydC50YWJsZVxyXG4gICAgaWYgdGJsU3RyXHJcbiAgICAgIGpUYmwgPSAkIHRibFN0clxyXG5cclxuICAgICAgakhlYWQgPSBqVGJsLmZpbmQgJ3RoZWFkJ1xyXG4gICAgICByZXQuJC5hcHBlbmQgakhlYWRcclxuICAgICAgdGhlYWQgPSBlbC5yZXN0b3JlRWxlbWVudCBqSGVhZFswXVxyXG4gICAgICB0aGVhZFJvdyA9IGVsLnJlc3RvcmVFbGVtZW50IHRoZWFkWzBdLnJvd3NbMF1cclxuXHJcbiAgICAgIGpCb2R5ID0galRibC5maW5kICd0Ym9keSdcclxuICAgICAgcmV0LiQuYXBwZW5kIGpCb2R5XHJcbiAgICAgIHRib2R5ID0gZWwucmVzdG9yZUVsZW1lbnQgakJvZHlbMF1cclxuXHJcbiAgICAgIGxvYWRDZWxscygpXHJcbiAgICBlbHNlXHJcbiAgICAgIHRoZWFkID0gcmV0Lm1ha2UgJ3RoZWFkJywgZGVmYXVsdHMudGhlYWRcclxuICAgICAgdGhlYWRSb3cgPSB0aGVhZC5tYWtlICd0cidcclxuICAgICAgdGJvZHkgPSByZXQubWFrZSAndGJvZHknLCBkZWZhdWx0cy50Ym9keVxyXG4gICAgICByb3dzLnB1c2ggdGJvZHkubWFrZSAndHInXHJcbiAgICByZXRcclxuXHJcbiAgIyAjIyMgbG9hZENlbGxzXHJcbiAgIyBpbnRlcm5hbCBtZXRob2QgZ3VhcmFudGVlcyB0aGF0IHRhYmxlcyBsb2FkZWQgZnJvbSBKU09OIGFyZSBmdWxseSBsb2FkZWQgaW50byBtZW1vcnlcclxuICBsb2FkQ2VsbHMgPSAoKSAtPlxyXG4gICAgciA9IDBcclxuICAgIHdoaWxlIHRib2R5WzBdLnJvd3MubGVuZ3RoID4gclxyXG4gICAgICBjID0gMFxyXG4gICAgICBtZW1Sb3cgPSBlbC5yZXN0b3JlRWxlbWVudCB0Ym9keVswXS5yb3dzW3JdXHJcbiAgICAgIHJvd3MucHVzaCBtZW1Sb3dcclxuICAgICAgd2hpbGUgdGJvZHlbMF0ucm93c1tyXS5jZWxscy5sZW5ndGggPiBjXHJcbiAgICAgICAgbWVtQ2VsbCA9IGNlbGxzLmdldCByKzEsIGMrMVxyXG4gICAgICAgIGlmIG5vdCBtZW1DZWxsXHJcbiAgICAgICAgICBtZW1DZWxsID0gZWwucmVzdG9yZUVsZW1lbnQgdGJvZHlbMF0ucm93c1tyXS5jZWxsc1tjXVxyXG4gICAgICAgICAgY2VsbHMuc2V0IHIrMSwgYysxLCBtZW1DZWxsXHJcbiAgICAgICAgYyArPSAxXHJcbiAgICAgIHIgKz0gMVxyXG5cclxuICAjICMjIyBmaWxsTWlzc2luZ1xyXG4gICMgaW50ZXJuYWwgbWV0aG9kIGd1YXJhbnRlZXMgdGhhdCBjZWxscyBleGlzdCBmb3IgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIHRhYmxlXHJcbiAgZmlsbE1pc3NpbmcgPSAoKSAtPlxyXG4gICAgY2VsbHMuZWFjaCAocm93Tm8sIGNvbE5vLCB2YWwpIC0+XHJcbiAgICAgIGlmIG5vdCB2YWxcclxuICAgICAgICByb3cgPSByZXQucm93IHJvd05vXHJcbiAgICAgICAgcm93LmNlbGwgY29sTm8sIHt9XHJcblxyXG4gICMgIyMgY29sdW1uXHJcbiAgIyBBZGRzIGEgY29sdW1uIG5hbWUgdG8gdGhlIHRhYmxlIGhlYWRcclxuICByZXQuYWRkICdjb2x1bW4nLCAoY29sTm8sIGNvbE5hbWUpIC0+XHJcbiAgICByZXQuaW5pdCgpXHJcbiAgICBjb2x1bW5Db3VudCArPSAxXHJcbiAgICB0aCA9IG51bGxcclxuICAgIGkgPSAwXHJcbiAgICB3aGlsZSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzLmxlbmd0aCA8IGNvbE5vXHJcbiAgICAgIG5hdGl2ZVRoID0gdGhlYWRbMF0ucm93c1swXS5jZWxsc1tpXVxyXG4gICAgICBpZiBub3QgbmF0aXZlVGhcclxuICAgICAgICB0aCA9IHRoZWFkUm93Lm1ha2UgJ3RoJywge31cclxuICAgICAgZWxzZVxyXG4gICAgICAgIHRoID0gZWwucmVzdG9yZUVsZW1lbnQgbmF0aXZlVGgsICd0aCdcclxuICAgICAgaSArPSAxXHJcbiAgICBpZiBub3QgdGhcclxuICAgICAgbmF0aXZlVGggPSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzW2NvbE5vLTFdXHJcbiAgICAgIHRoID0gZWwucmVzdG9yZUVsZW1lbnQgbmF0aXZlVGgsICd0aCdcclxuICAgIHRoLnRleHQgY29sTmFtZVxyXG4gICAgdGhcclxuXHJcbiAgIyAjIyByb3dcclxuICAjIEFkZHMgYSBuZXcgcm93ICh0cikgdG8gdGhlIHRhYmxlIGJvZHlcclxuICByZXQuYWRkICdyb3cnLCAocm93Tm8sIG9wdHMpIC0+XHJcbiAgICByb3cgPSByb3dzW3Jvd05vLTFdXHJcblxyXG4gICAgaWYgbm90IHJvd1xyXG4gICAgICB3aGlsZSByb3dzLmxlbmd0aCA8IHJvd05vXHJcbiAgICAgICAgcm93ID0gdGJvZHkubWFrZSAndHInLCB7fVxyXG4gICAgICAgIHJvd3MucHVzaCByb3dcclxuXHJcbiAgICBpZiBub3Qgcm93LmNlbGxcclxuICAgICAgcm93LmFkZCAnY2VsbCcsIChjb2xObywgb3B0cykgLT5cclxuICAgICAgICBjZWxsID0gT0oubm9kZXMudGQgb3B0cywgcm93XHJcbiAgICAgICAgY2VsbHMuc2V0IHJvd05vLCBjb2xObywgY2VsbFxyXG4gICAgICAgIGNlbGxcclxuXHJcbiAgICByb3dcclxuXHJcbiAgIyAjIyBjZWxsXHJcbiAgIyBBZGRzIGEgY2VsbCAodHIvdGQpIHRvIHRoZSB0YWJsZSBib2R5XHJcbiAgcmV0LmFkZCAnY2VsbCcsIChyb3dObywgY29sTm8sIG9wdHMpIC0+XHJcbiAgICBpZiByb3dObyA8IDEgdGhlbiByb3dObyA9IDFcclxuICAgIGlmIGNvbE5vIDwgMSB0aGVuIGNvbE5vID0gMVxyXG4gICAgaWYgY29sdW1uQ291bnQgPiAwIGFuZCBjb2xOby0xID4gY29sdW1uQ291bnQgdGhlbiB0aHJvdyBuZXcgRXJyb3IgJ0EgY29sdW1uIG5hbWUgaGFzIG5vdCBiZWVuIGRlZmluZWQgZm9yIHRoaXMgcG9zaXRpb24geycgKyByb3dObyArICd4JyArIGNvbE5vICsgJ30uJ1xyXG5cclxuICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cclxuXHJcbiAgICBjZWxsID0gY2VsbHMuZ2V0IHJvd05vLCBjb2xOb1xyXG5cclxuICAgIGlmIG5vdCBjZWxsXHJcbiAgICAgIGkgPSAwXHJcbiAgICAgIHdoaWxlIGkgPCBjb2xOb1xyXG4gICAgICAgIGkgKz0gMVxyXG4gICAgICAgIGlmIGkgaXMgY29sTm9cclxuICAgICAgICAgIG51T3B0cyA9IE9KLmV4dGVuZCB7cHJvcHM6IGRlZmF1bHRzLmNlbGxzfSwgb3B0c1xyXG4gICAgICAgICAgY2VsbCA9IHJvdy5jZWxsIGNvbE5vLCBudU9wdHNcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICB0cnlDZWxsID0gY2VsbHMuZ2V0IHJvd05vLCBpXHJcbiAgICAgICAgICBpZiBub3QgdHJ5Q2VsbFxyXG4gICAgICAgICAgICB0cnlDZWxsID0gIHJvdy5jZWxsIGksIHByb3BzOiBkZWZhdWx0cy5jZWxsc1xyXG5cclxuICAgIGNlbGxcclxuXHJcbiAgIyAjIyBGaW5hbGl6ZVxyXG4gICMgRmluYWxpemUgZ3VhcmFudGVlcyB0aGF0IHRoZWFkIGFuZCB0Ym9keSBhbmQgY3JlYXRlZCB3aGVuIHRoZSBub2RlIGlzIGZ1bGx5IGluc3RhbnRpYXRlZFxyXG4gIGluaXQoKVxyXG5cclxuICAjICMjIFRIZWFkXHJcbiAgIyBFeHBvc2UgdGhlIGludGVybmFsIHRoZWFkIG5vZGVcclxuICByZXQuYWRkICd0aGVhZCcsIHRoZWFkXHJcblxyXG4gICMgIyMgVEJvZHlcclxuICAjIEV4cG9zZSB0aGUgaW50ZXJuYWwgdGJvZHkgbm9kZVxyXG4gIHJldC5hZGQgJ3Rib2R5JywgdGJvZHlcclxuXHJcbiAgICBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXHJcblxyXG5ub2RlTmFtZSA9ICd0ZXh0YXJlYSdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczpcclxuICAgICAgbmFtZTogJydcclxuICAgICAgcGxhY2Vob2xkZXI6ICcnXHJcbiAgICAgIHZhbHVlOiAnJ1xyXG4gICAgICB0ZXh0OiAnJ1xyXG4gICAgICBtYXhsZW5ndGg6ICcnXHJcbiAgICAgIGF1dG9mb2N1czogZmFsc2VcclxuICAgICAgaXNSZXF1aXJlZDogZmFsc2VcclxuICAgICAgcm93czogM1xyXG4gICAgICBjb2xzOiAyNVxyXG4gICAgICBkaXNhYmxlZDogZmFsc2VcclxuICAgICAgcmVhZG9ubHk6IGZhbHNlXHJcbiAgICAgIGZvcm06ICcnXHJcbiAgICAgIHdyYXA6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICB2YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICBzd2l0Y2ggZGVmYXVsdHMucHJvcHMudHlwZVxyXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMuY2hlY2tib3hcclxuICAgICAgICB2YWx1ZSA9IHJldC4kLmlzKCc6Y2hlY2tlZCcpXHJcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5yYWRpb1xyXG4gICAgICAgIHZhbHVlID0gcmV0LiQuZmluZCgnOmNoZWNrZWQnKS52YWwoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdmFsdWUgPSByZXQudmFsKClcclxuXHJcbiAgIyBDbGljayBiaW5kaW5nXHJcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICByZXR2YWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXHJcblxyXG4gICMgQ2hhbmdlIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2hhbmdlIGlzbnQgT0oubm9vcFxyXG4gICAgY2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gICAgbmV3Q2hhbmdlID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICByZXR2YWwgPSBjaGFuZ2UgZXZlbnQuLi5cclxuICAgICAgc3luY1ZhbHVlKClcclxuICAgICAgcmV0dmFsXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2hhbmdlID0gbmV3Q2hhbmdlXHJcblxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxubm9kZU5hbWUgPSAndGhlYWQnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcbiAgICBudW1iZXI6IDFcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gIHJvd3MgPSBbXVxyXG4gIGNlbGxzID0ge31cclxuICByZXQuYWRkICdjZWxsJywgKHJvd05vLCBjb2xObykgLT5cclxuICAgIGluaXQoKVxyXG5cclxuICAgIGlmIHJvd05vIDwgMSB0aGVuIHJvd05vID0gMVxyXG4gICAgaWYgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXHJcblxyXG4gICAgcm93ID0gcm93c1tyb3dOby0xXVxyXG5cclxuICAgIGlmIG5vdCByb3dcclxuICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xyXG4gICAgICAgIHJvdyA9IE9KLm5vZGVzLnRyIHt9LCB0Ym9keSwgZmFsc2VcclxuICAgICAgICByb3dzLnB1c2ggcm93XHJcblxyXG4gICAgdGQgPSByb3dbMF0uY2VsbHNbY29sTm9dXHJcblxyXG4gICAgaWYgdGQgdGhlbiBjZWxsID0gZWwucmVzdG9yZUVsZW1lbnQgdGQsICd0ZCdcclxuICAgIGlmIG5vdCB0ZFxyXG4gICAgICB3aGlsZSByb3dbMF0uY2VsbHMubGVuZ3RoIDwgY29sTm9cclxuICAgICAgICBpZHggPSByb3dbMF0uY2VsbHMubGVuZ3RoXHJcbiAgICAgICAgdGQgPSByb3dbMF0uY2VsbHNbaWR4LTFdXHJcbiAgICAgICAgaWYgdGQgYW5kIGlkeCBpcyBjb2xOb1xyXG4gICAgICAgICAgY2VsbCA9IGVsLnJlc3RvcmVFbGVtZW50IHRkLCAndGQnXHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgY2VsbCA9IE9KLm5vZGVzLnRkIHByb3BzOiBkZWZhdWx0cy5jZWxscywgcm93LCBmYWxzZVxyXG5cclxuICAgIGlmIG5vdCBjZWxsLmlzVmFsaWRcclxuICAgICAgbm9kZUZhY3RvcnkgY2VsbCwgcm93LCByb3dObyArIGNvbE5vXHJcblxyXG4gICAgY2VsbFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbm5vZGVOYW1lID0gJ3VsJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOiB7fVxyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG5cclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJ0aGlzR2xvYmFsID0gKGlmICh0eXBlb2YgZ2xvYmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIGdsb2JhbCkgdGhlbiBnbG9iYWwgZWxzZSAoaWYgKHR5cGVvZiBzZWxmIGlzbnQgJ3VuZGVmaW5lZCcgYW5kIHNlbGYpIHRoZW4gc2VsZiBlbHNlIChpZiAodHlwZW9mIHdpbmRvdyBpc250ICd1bmRlZmluZWQnIGFuZCB3aW5kb3cpIHRoZW4gd2luZG93IGVsc2UgdGhpcykpKVxubW9kdWxlLmV4cG9ydHMgPSB0aGlzR2xvYmFsIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdidXR0b25pbnB1dCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogJ2J1dHRvbidcbiAgICAgIHNyYzogJydcbiAgICAgIGFsdDogJydcbiAgICAgIGhlaWdodDogJydcbiAgICAgIHdpZHRoOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuXG5cbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnY2hlY2tib3gnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBjaGVja2VkOiBmYWxzZVxuICAgIGluZGV0ZXJtaW5hdGU6IGZhbHNlXG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBvYmouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIGlmIGRlZmF1bHRzLmNoZWNrZWRcbiAgICByZXQuYXR0ciAnY2hlY2tlZCcsIHRydWVcbiAgZWxzZSBpZiBkZWZhdWx0cy5pbmRldGVybWluYXRlXG4gICAgcmV0LmF0dHIgJ2luZGV0ZXJtaW5hdGUnLCB0cnVlXG5cbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnY29sb3InXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnZGF0ZSdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2RhdGV0aW1lJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdkYXRldGltZS1sb2NhbCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnZW1haWwnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgbXVsdGlwbGU6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnZmlsZSdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgICBhY2NlcHQ6ICcnXG4gICAgICBtdWx0aXBsZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdoaWRkZW4nXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2ltYWdlaW5wdXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6ICdpbWFnZSdcbiAgICAgIHNyYzogJydcbiAgICAgIGFsdDogJydcbiAgICAgIGhlaWdodDogJydcbiAgICAgIHdpZHRoOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ21vbnRoJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdudW1iZXInXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3Bhc3N3b3JkJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIG1heGxlbmd0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdyYWRpbydcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgICBuYW1lOiAnJ1xuICAgICAgdmFsdWU6ICcnXG4gICAgICBjaGVja2VkOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3JhbmdlJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIG1pbjogMFxuICAgICAgbWF4OiAxMDBcbiAgICAgIHZhbHVlOiA1MFxuICAgICAgc3RlcDogMVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3Jlc2V0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdzZWFyY2gnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3N1Ym1pdCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAndGVsJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIHBhdHRlcm46ICcnXG4gICAgICBtYXhsZW5ndGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAndGV4dGlucHV0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiAndGV4dCdcbiAgICAgIGF1dG9jb21wbGV0ZTogJ29uJ1xuICAgICAgYXV0b3NhdmU6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAndGltZSdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAndXJsJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIHBhdHRlcm46ICcnXG4gICAgICBtYXhsZW5ndGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnd2VlaydcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIiMgIyBPSlxudGhpc0dsb2JhbCA9IHJlcXVpcmUgJy4vZ2xvYmFsJ1xudXRpbExpYiA9IHJlcXVpcmUgJ2pxdWVyeSdcbm5hbWVTcGFjZU5hbWUgPSAnT0onXG5cbiMjI1xuYm9vdCBzdHJhcCBuYW1lIG1ldGhvZCBpbnRvIE9iamVjdCBwcm90b3R5cGVcbiMjI1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgT2JqZWN0OjosXG4gIGdldEluc3RhbmNlTmFtZTpcbiAgICB2YWx1ZTogLT5cbiAgICAgIGZ1bmNOYW1lUmVnZXggPSAvZnVuY3Rpb24gKC57MSx9KVxcKC9cbiAgICAgIHJlc3VsdHMgPSAoZnVuY05hbWVSZWdleCkuZXhlYyhAY29uc3RydWN0b3IudG9TdHJpbmcoKSlcbiAgICAgIChpZiAocmVzdWx0cyBhbmQgcmVzdWx0cy5sZW5ndGggPiAxKSB0aGVuIHJlc3VsdHNbMV0gZWxzZSAnJylcblxuXG4jIyNcbkFuIGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBuYW1lc3BhY2UgdHJlZVxuIyMjXG5Oc1RyZWUgPSB7fVxubWFrZVRoZUp1aWNlID0gLT5cblxuICAjIyNcbiAgSW50ZXJuYWwgbmFtZVNwYWNlTmFtZSBtZXRob2QgdG8gY3JlYXRlIG5ldyAnc3ViJyBuYW1lc3BhY2VzIG9uIGFyYml0cmFyeSBjaGlsZCBvYmplY3RzLlxuICAjIyNcbiAgbWFrZU5hbWVTcGFjZSA9IChzcGFjZW5hbWUsIHRyZWUpIC0+XG4gICAgIyMjXG4gICAgVGhlIGRlcml2ZWQgaW5zdGFuY2UgdG8gYmUgY29uc3RydWN0ZWRcbiAgICAjIyNcbiAgICBCYXNlID0gKG5zTmFtZSkgLT5cbiAgICAgIHByb3RvID0gdGhpc1xuICAgICAgdHJlZVtuc05hbWVdID0gdHJlZVtuc05hbWVdIG9yIHt9XG4gICAgICBuc1RyZWUgPSB0cmVlW25zTmFtZV1cbiAgICAgIG1lbWJlcnMgPSB7fVxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgdGhpcywgJ21lbWJlcnMnLCB2YWx1ZTogbWVtYmVyc1xuXG4gICAgICAjIyNcbiAgICAgIFJlZ2lzdGVyIChlLmcuICdMaWZ0JykgYW4gT2JqZWN0IGludG8gdGhlIHByb3RvdHlwZSBvZiB0aGUgbmFtZXNwYWNlLlxuICAgICAgVGhpcyBPYmplY3Qgd2lsbCBiZSByZWFkYWJsZS9leGVjdXRhYmxlIGJ1dCBpcyBvdGhlcndpc2UgaW1tdXRhYmxlLlxuICAgICAgIyMjXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgdGhpcywgJ3JlZ2lzdGVyJyxcbiAgICAgICAgdmFsdWU6IChuYW1lLCBvYmosIGVudW1lcmFibGUpIC0+XG4gICAgICAgICAgJ3VzZSBzdHJpY3QnXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbGlmdCBhIG5ldyBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgbmFtZS4nKSAgaWYgKHR5cGVvZiBuYW1lIGlzbnQgJ3N0cmluZycpIG9yIG5hbWUgaXMgJydcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsaWZ0IGEgbmV3IHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBwcm9wZXJ0eSBpbnN0YW5jZS4nKSAgdW5sZXNzIG9ialxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUHJvcGVydHkgbmFtZWQgJyArIG5hbWUgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKSAgaWYgcHJvdG9bbmFtZV1cblxuICAgICAgICAgIG1lbWJlcnNbbmFtZV0gPSBtZW1iZXJzW25hbWVdIG9yIG5hbWVcblxuICAgICAgICAgICNHdWFyZCBhZ2FpbnN0IG9ibGl0ZXJhdGluZyB0aGUgdHJlZSBhcyB0aGUgdHJlZSBpcyByZWN1cnNpdmVseSBleHRlbmRlZFxuICAgICAgICAgIG5zVHJlZVtuYW1lXSA9IG5zVHJlZVtuYW1lXSBvclxuICAgICAgICAgICAgbmFtZTogbmFtZVxuICAgICAgICAgICAgdHlwZTogdHlwZW9mIG9ialxuICAgICAgICAgICAgaW5zdGFuY2U6IChpZiBvYmouZ2V0SW5zdGFuY2VOYW1lIHRoZW4gb2JqLmdldEluc3RhbmNlTmFtZSgpIGVsc2UgJ3Vua25vd24nKVxuXG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5IHByb3RvLCBuYW1lLFxuICAgICAgICAgICAgdmFsdWU6IG9ialxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UgaXNudCBlbnVtZXJhYmxlXG5cbiAgICAgICAgICBuc0ludGVybmFsLmFsZXJ0RGVwZW5kZW50cyBuc05hbWUgKyAnLicgKyBzcGFjZW5hbWUgKyAnLicgKyBuYW1lXG4gICAgICAgICAgb2JqXG5cblxuICAgICAgIyMjXG4gICAgICBDcmVhdGUgYSBuZXcsIHN0YXRpYyBuYW1lc3BhY2Ugb24gdGhlIGN1cnJlbnQgcGFyZW50IChlLmcuIG5zTmFtZS50by4uLiB8fCBuc05hbWUuaXMuLi4pXG4gICAgICAjIyNcbiAgICAgIHByb3RvLnJlZ2lzdGVyICdtYWtlU3ViTmFtZVNwYWNlJywgKChzdWJOYW1lU3BhY2UpIC0+XG4gICAgICAgICd1c2Ugc3RyaWN0J1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgYSBuZXcgc3ViIG5hbWVzcGFjZSB3aXRob3V0IGEgdmFsaWQgbmFtZS4nKSAgaWYgKHR5cGVvZiBzdWJOYW1lU3BhY2UgaXNudCAnc3RyaW5nJykgb3Igc3ViTmFtZVNwYWNlIGlzICcnXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU3ViIG5hbWVzcGFjZSBuYW1lZCAnICsgc3ViTmFtZVNwYWNlICsgJyBpcyBhbHJlYWR5IGRlZmluZWQgb24gJyArIHNwYWNlbmFtZSArICcuJykgIGlmIHByb3RvLnN1Yk5hbWVTcGFjZVxuICAgICAgICBuc0ludGVybmFsLmFsZXJ0RGVwZW5kZW50cyBuc05hbWUgKyAnLicgKyBzdWJOYW1lU3BhY2VcbiAgICAgICAgbmV3TmFtZVNwYWNlID0gbWFrZU5hbWVTcGFjZShzdWJOYW1lU3BhY2UsIG5zVHJlZSlcbiAgICAgICAgbmV3TmFtZVNwYWNlLnJlZ2lzdGVyICdjb25zdGFudHMnLCBtYWtlTmFtZVNwYWNlKCdjb25zdGFudHMnLCBuc1RyZWUpLCBmYWxzZSAgaWYgc3ViTmFtZVNwYWNlIGlzbnQgJ2NvbnN0YW50cydcbiAgICAgICAgcHJvdG8ucmVnaXN0ZXIgc3ViTmFtZVNwYWNlLCBuZXdOYW1lU3BhY2UsIGZhbHNlXG4gICAgICAgIG5ld05hbWVTcGFjZVxuICAgICAgKSwgZmFsc2VcbiAgICAgIHJldHVyblxuXG4gICAgIyMjXG4gICAgQW4gaW50ZXJuYWwgbWVjaGFuaXNtIHRvIHJlcHJlc2VudCB0aGUgaW5zdGFuY2Ugb2YgdGhpcyBuYW1lc3BhY2VcbiAgICBAY29uc3RydWN0b3JcbiAgICBAaW50ZXJuYWxcbiAgICBAbWVtYmVyT2YgbWFrZU5hbWVTcGFjZVxuICAgICMjI1xuICAgIENsYXNzID0gbmV3IEZ1bmN0aW9uKCdyZXR1cm4gZnVuY3Rpb24gJyArIHNwYWNlbmFtZSArICcoKXt9JykoKVxuICAgIENsYXNzOjogPSBuZXcgQmFzZShzcGFjZW5hbWUpXG5cbiAgICAjQ2xhc3MucHJvdG90eXBlLnBhcmVudCA9IEJhc2UucHJvdG90eXBlO1xuICAgIG5ldyBDbGFzcyhzcGFjZW5hbWUpXG5cbiAgIyMjXG4gICdEZXBlbmQnIGFuIE9iamVjdCB1cG9uIGFub3RoZXIgbWVtYmVyIG9mIHRoaXMgbmFtZXNwYWNlLCB1cG9uIGFub3RoZXIgbmFtZXNwYWNlLFxuICBvciB1cG9uIGEgbWVtYmVyIG9mIGFub3RoZXIgbmFtZXNwYWNlXG4gICMjI1xuICBkZXBlbmRzT24gPSAoZGVwZW5kZW5jaWVzLCBjYWxsQmFjaywgaW1wb3J0cykgLT5cbiAgICAndXNlIHN0cmljdCdcbiAgICByZXQgPSBmYWxzZVxuICAgIG5zTWVtYmVycyA9IG5zSW50ZXJuYWwuZ2V0TnNNZW1iZXJzKClcbiAgICBpZiBkZXBlbmRlbmNpZXMgYW5kIGRlcGVuZGVuY2llcy5sZW5ndGggPiAwIGFuZCBjYWxsQmFja1xuICAgICAgbWlzc2luZyA9IGRlcGVuZGVuY2llcy5maWx0ZXIoKGRlcGVuKSAtPlxuICAgICAgICBuc01lbWJlcnMuaW5kZXhPZihkZXBlbikgaXMgLTEgYW5kIChub3QgaW1wb3J0cyBvciBpbXBvcnRzIGlzbnQgZGVwZW4pXG4gICAgICApXG4gICAgICBpZiBtaXNzaW5nLmxlbmd0aCBpcyAwXG4gICAgICAgIHJldCA9IHRydWVcbiAgICAgICAgY2FsbEJhY2soKVxuICAgICAgZWxzZVxuICAgICAgICBuc0ludGVybmFsLmRlcGVuZGVudHMucHVzaCAoaW1wb3J0cykgLT5cbiAgICAgICAgICBkZXBlbmRzT24gbWlzc2luZywgY2FsbEJhY2ssIGltcG9ydHNcblxuICAgIHJldFxuICBuc0ludGVybmFsID0gZGVwZW5kZW50czogW11cblxuICAjIyNcbiAgRmV0Y2hlcyB0aGUgcmVnaXN0ZXJlZCBwcm9wZXJ0aWVzIGFuZCBtZXRob2RzIG9uIHRoZSBuYW1lc3BhY2UgYW5kIGl0cyBjaGlsZCBuYW1lc3BhY2VzXG4gICMjI1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnNJbnRlcm5hbCwgJ2dldE5zTWVtYmVycycsXG4gICAgdmFsdWU6IC0+XG4gICAgICByZWN1cnNlVHJlZSA9IChrZXksIGxhc3RLZXkpIC0+XG4gICAgICAgIG1lbWJlcnMucHVzaCBsYXN0S2V5ICsgJy4nICsga2V5ICBpZiB0eXBlb2YgKGtleSkgaXMgJ3N0cmluZydcbiAgICAgICAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KGtleSlcbiAgICAgICAgICBPYmplY3Qua2V5cyhrZXkpLmZvckVhY2ggKGspIC0+XG4gICAgICAgICAgICBtZW1iZXJzLnB1c2ggbGFzdEtleSArICcuJyArIGsgIGlmIHR5cGVvZiAoaykgaXMgJ3N0cmluZydcbiAgICAgICAgICAgIHJlY3Vyc2VUcmVlIGtleVtrXSwgbGFzdEtleSArICcuJyArIGsgIGlmIHV0aWxMaWIuaXNQbGFpbk9iamVjdChrZXlba10pXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICByZXR1cm5cbiAgICAgIG1lbWJlcnMgPSBbXVxuICAgICAgT2JqZWN0LmtleXMoTnNUcmVlW25hbWVTcGFjZU5hbWVdKS5mb3JFYWNoIChrZXkpIC0+XG4gICAgICAgIHJlY3Vyc2VUcmVlIE5zVHJlZVtuYW1lU3BhY2VOYW1lXVtrZXldLCBuYW1lU3BhY2VOYW1lICBpZiB1dGlsTGliLmlzUGxhaW5PYmplY3QoTnNUcmVlW25hbWVTcGFjZU5hbWVdW2tleV0pXG4gICAgICAgIHJldHVyblxuXG4gICAgICBtZW1iZXJzXG5cbiAgIyMjXG4gIFRvIHN1cHBvcnQgZGVwZW5kZW5jeSBtYW5hZ2VtZW50LCB3aGVuIGEgcHJvcGVydHkgaXMgbGlmdGVkIG9udG8gdGhlIG5hbWVzcGFjZSwgbm90aWZ5IGRlcGVuZGVudHMgdG8gaW5pdGlhbGl6ZVxuICAjIyNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5IG5zSW50ZXJuYWwsICdhbGVydERlcGVuZGVudHMnLFxuICAgIHZhbHVlOiAoaW1wb3J0cykgLT5cbiAgICAgIGRlcHMgPSBuc0ludGVybmFsLmRlcGVuZGVudHMuZmlsdGVyKChkZXBPbikgLT5cbiAgICAgICAgZmFsc2UgaXMgZGVwT24oaW1wb3J0cylcbiAgICAgIClcbiAgICAgIG5zSW50ZXJuYWwuZGVwZW5kZW50cyA9IGRlcHMgIGlmIEFycmF5LmlzQXJyYXkoZGVwcylcblxuICAjQ3JlYXRlIHRoZSByb290IG9mIHRoZSB0cmVlIGFzIHRoZSBjdXJyZW50IG5hbWVzcGFjZVxuICBOc1RyZWVbbmFtZVNwYWNlTmFtZV0gPSB7fVxuICAjRGVmaW5lIHRoZSBjb3JlIG5hbWVzcGFjZSBhbmQgdGhlIHJldHVybiBvZiB0aGlzIGNsYXNzXG4gIE5zT3V0ID0gbWFrZU5hbWVTcGFjZShuYW1lU3BhY2VOYW1lLCBOc1RyZWVbbmFtZVNwYWNlTmFtZV0pXG5cbiAgIyMjXG4gIENhY2hlIGEgaGFuZGxlIG9uIHRoZSB2ZW5kb3IgKHByb2JhYmx5IGpRdWVyeSkgb24gdGhlIHJvb3QgbmFtZXNwYWNlXG4gICMjI1xuICBOc091dC5yZWdpc3RlciAnPycsIHV0aWxMaWIsIGZhbHNlXG5cbiAgIyMjXG4gIENhY2hlIHRoZSB0cmVlICh1c2VmdWwgZm9yIGRvY3VtZW50YXRpb24vdmlzdWFsaXphdGlvbi9kZWJ1Z2dpbmcpXG4gICMjI1xuICBOc091dC5yZWdpc3RlciAndHJlZScsIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSwgZmFsc2VcblxuICAjIyNcbiAgQ2FjaGUgdGhlIG5hbWUgc3BhY2UgbmFtZVxuICAjIyNcbiAgTnNPdXQucmVnaXN0ZXIgJ25hbWUnLCBuYW1lU3BhY2VOYW1lLCBmYWxzZVxuICBOc091dC5yZWdpc3RlciAnZGVwZW5kc09uJywgZGVwZW5kc09uLCBmYWxzZVxuICBOc091dFxuXG5cbiMjI1xuQWN0dWFsbHkgZGVmaW5lIHRoZSBPSiBOYW1lU3BhY2VcbiMjI1xuT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoaXNHbG9iYWwsIG5hbWVTcGFjZU5hbWUsXG4gIHZhbHVlOiBtYWtlVGhlSnVpY2UoKVxuXG5PSi5yZWdpc3RlciAnZ2xvYmFsJywgdGhpc0dsb2JhbFxuXG50aGlzRG9jdW1lbnQgPSB7fVxuaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCdcbiAgdGhpc0RvY3VtZW50ID0gZG9jdW1lbnRcblxuT0oucmVnaXN0ZXIgJ2RvY3VtZW50JywgdGhpc0RvY3VtZW50XG5cbk9KLnJlZ2lzdGVyICdub29wJywgLT5cblxubW9kdWxlLmV4cG9ydHMgPSBPSiIsIiAjICMgT0ogUG9zdC1Jbml0aWFsaXphdGlvblxyXG5cclxuT0ogPSByZXF1aXJlICcuL29qJ1xyXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xyXG5cclxuIyBTaW1wbGUgYXJyYXkgb2YgYW50aWNpcGF0ZWQva25vd24gY2hpbGQgbmFtZXNwYWNlc1xyXG4gIFxyXG5zdWJOYW1lU3BhY2VzID0gW1xyXG4gICdlcnJvcnMnXHJcbiAgJ2VudW1zJ1xyXG4gICdpbnN0YW5jZU9mJ1xyXG4gICdub2RlcydcclxuICAnZGInXHJcbiAgJ2NvbXBvbmVudHMnXHJcbiAgJ2NvbnRyb2xzJ1xyXG4gICdpbnB1dHMnXHJcbiAgJ25vdGlmaWNhdGlvbnMnXHJcbiAgJ2hpc3RvcnknXHJcbiAgJ2Nvb2tpZSdcclxuICAnYXN5bmMnXHJcbl1cclxuXHJcbiMgIyMgU3ViTmFtZVNwYWNlc1xyXG5cclxuIyBQcmUtYWxsb2NhdGUgY2VydGFpbiBjb21tb24gbmFtZXNwYWNlcyB0byBhdm9pZCBmdXR1cmUgcmFjZSBjb25kaXRpb25zLlxyXG4jIFRoaXMgZG9lcyByZXF1aXJlIHRoYXQgdGhlIG9yZGVyIG9mIG9wZXJhdGlvbnMgbG9hZHMgT0ouY29mZmVlIGZpcnN0IGFuZCBvSkluaXQuY29mZmVlIHNlY29uZFxyXG5fLmVhY2ggc3ViTmFtZVNwYWNlcywgKG5hbWUpIC0+XHJcbiAgT0oubWFrZVN1Yk5hbWVTcGFjZSBuYW1lXHJcbiAgXHJcbiMgIyMgQ29uZmlndXJhdGlvbiB2YXJpYWJsZXNcclxuXHJcbiMgQXV0b21hdGljYWxseSBnZW5lcmF0ZSB1bmlxdWUgSURzIGZvciBlYWNoIG5vZGUgKGRlZmF1bHQgZmFsc2UpXHJcbk9KWydHRU5FUkFURV9VTklRVUVfSURTJ10gPSBmYWxzZVxyXG4jIERlZmF1bHQgcm9vdCBub2RlIGZvciBjb21wb25lbnRzL2NvbnRyb2xzIChkZWZhdWx0ICdkaXYnKVxyXG5PSlsnREVGQVVMVF9DT01QT05FTlRfUk9PVF9OT0RFVFlQRSddID0gJ2RpdidcclxuIyBXaGV0aGVyIHRvIGhvb2sgaW50byB0aGUgZ2xvYmFsIG9uIGVycm9yIGV2ZW50IHRvIHdyaXRlIGVycm9ycyB0byBjb25zb2xlIChkZWZhdWx0IGZhbHNlKVxyXG5PSlsnVFJBQ0tfT05fRVJST1InXSA9IGZhbHNlXHJcbiNXaGV0aGVyIHRvIGxvZyBhbGwgQUpBWCByZXF1ZXN0c1xyXG5PSlsnTE9HX0FMTF9BSkFYJ10gPSBmYWxzZVxyXG4jV2hldGhlciB0byBsb2cgYWxsIEFKQVggZXJyb3JzXHJcbk9KWydMT0dfQUxMX0FKQVhfRVJST1JTJ10gPSBmYWxzZSIsIlxyXG4jIyNcclxuUmV0dXJuIGp1c3QgdGhlIGtleXMgZnJvbSB0aGUgaW5wdXQgYXJyYXksIG9wdGlvbmFsbHkgb25seSBmb3IgdGhlIHNwZWNpZmllZCBzZWFyY2hfdmFsdWVcclxudmVyc2lvbjogMTEwOS4yMDE1XHJcbmRpc2N1c3MgYXQ6IGh0dHA6Ly9waHBqcy5vcmcvZnVuY3Rpb25zL2FycmF5X2tleXNcclxuKyAgIG9yaWdpbmFsIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va2V2aW4udmFuem9ubmV2ZWxkLm5ldClcclxuKyAgICAgIGlucHV0IGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxyXG4rICAgYnVnZml4ZWQgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0KVxyXG4rICAgaW1wcm92ZWQgYnk6IGpkXHJcbisgICBpbXByb3ZlZCBieTogQnJldHQgWmFtaXIgKGh0dHA6Ly9icmV0dC16YW1pci5tZSlcclxuKyAgIGlucHV0IGJ5OiBQXHJcbisgICBidWdmaXhlZCBieTogQnJldHQgWmFtaXIgKGh0dHA6Ly9icmV0dC16YW1pci5tZSlcclxuZXhhbXBsZSAxOiBhcnJheV9rZXlzKCB7Zmlyc3RuYW1lOiAnS2V2aW4nLCBzdXJuYW1lOiAndmFuIFpvbm5ldmVsZCd9ICk7XHJcbnJldHVybnMgMTogezA6ICdmaXJzdG5hbWUnLCAxOiAnc3VybmFtZSd9XHJcbiMjI1xyXG5hcnJheV9rZXlzID0gKGlucHV0LCBzZWFyY2hfdmFsdWUsIGFyZ1N0cmljdCkgLT5cclxuICBzZWFyY2ggPSB0eXBlb2Ygc2VhcmNoX3ZhbHVlIGlzbnQgXCJ1bmRlZmluZWRcIlxyXG4gIHRtcF9hcnIgPSBbXVxyXG4gIHN0cmljdCA9ICEhYXJnU3RyaWN0XHJcbiAgaW5jbHVkZSA9IHRydWVcclxuICBrZXkgPSBcIlwiXHJcbiAgIyBEdWNrLXR5cGUgY2hlY2sgZm9yIG91ciBvd24gYXJyYXkoKS1jcmVhdGVkIFBIUEpTX0FycmF5XHJcbiAgcmV0dXJuIGlucHV0LmtleXMoc2VhcmNoX3ZhbHVlLCBhcmdTdHJpY3QpICBpZiBpbnB1dCBhbmQgdHlwZW9mIGlucHV0IGlzIFwib2JqZWN0XCIgYW5kIGlucHV0LmNoYW5nZV9rZXlfY2FzZVxyXG4gIGZvciBrZXkgb2YgaW5wdXRcclxuICAgIGlmIGlucHV0Lmhhc093blByb3BlcnR5KGtleSlcclxuICAgICAgaW5jbHVkZSA9IHRydWVcclxuICAgICAgaWYgc2VhcmNoXHJcbiAgICAgICAgaWYgc3RyaWN0IGFuZCBpbnB1dFtrZXldIGlzbnQgc2VhcmNoX3ZhbHVlXHJcbiAgICAgICAgICBpbmNsdWRlID0gZmFsc2VcclxuICAgICAgICBlbHNlIGluY2x1ZGUgPSBmYWxzZSAgdW5sZXNzIGlucHV0W2tleV0gaXMgc2VhcmNoX3ZhbHVlXHJcbiAgICAgIHRtcF9hcnJbdG1wX2Fyci5sZW5ndGhdID0ga2V5ICBpZiBpbmNsdWRlXHJcbiAgdG1wX2FyclxyXG5cclxuIyMjKlxyXG5Db252ZXJ0IGEgSmF2YXNjcmlwdCBPamVjdCBhcnJheSBvciBTdHJpbmcgYXJyYXkgdG8gYW4gSFRNTCB0YWJsZVxyXG5KU09OIHBhcnNpbmcgaGFzIHRvIGJlIG1hZGUgYmVmb3JlIGZ1bmN0aW9uIGNhbGxcclxuSXQgYWxsb3dzIHVzZSBvZiBvdGhlciBKU09OIHBhcnNpbmcgbWV0aG9kcyBsaWtlIGpRdWVyeS5wYXJzZUpTT05cclxuaHR0cChzKTovLywgZnRwOi8vLCBmaWxlOi8vIGFuZCBqYXZhc2NyaXB0OjsgbGlua3MgYXJlIGF1dG9tYXRpY2FsbHkgY29tcHV0ZWRcclxuXHJcbkpTT04gZGF0YSBzYW1wbGVzIHRoYXQgc2hvdWxkIGJlIHBhcnNlZCBhbmQgdGhlbiBjYW4gYmUgY29udmVydGVkIHRvIGFuIEhUTUwgdGFibGVcclxudmFyIG9iamVjdEFycmF5ID0gJ1t7XCJUb3RhbFwiOlwiMzRcIixcIlZlcnNpb25cIjpcIjEuMC40XCIsXCJPZmZpY2VcIjpcIk5ldyBZb3JrXCJ9LHtcIlRvdGFsXCI6XCI2N1wiLFwiVmVyc2lvblwiOlwiMS4xLjBcIixcIk9mZmljZVwiOlwiUGFyaXNcIn1dJztcclxudmFyIHN0cmluZ0FycmF5ID0gJ1tcIk5ldyBZb3JrXCIsXCJCZXJsaW5cIixcIlBhcmlzXCIsXCJNYXJyYWtlY2hcIixcIk1vc2Nvd1wiXSc7XHJcbnZhciBuZXN0ZWRUYWJsZSA9ICdbeyBrZXkxOiBcInZhbDFcIiwga2V5MjogXCJ2YWwyXCIsIGtleTM6IHsgdGFibGVJZDogXCJ0YmxJZE5lc3RlZDFcIiwgdGFibGVDbGFzc05hbWU6IFwiY2xzTmVzdGVkXCIsIGxpbmtUZXh0OiBcIkRvd25sb2FkXCIsIGRhdGE6IFt7IHN1YmtleTE6IFwic3VidmFsMVwiLCBzdWJrZXkyOiBcInN1YnZhbDJcIiwgc3Via2V5MzogXCJzdWJ2YWwzXCIgfV0gfSB9XSc7XHJcblxyXG5Db2RlIHNhbXBsZSB0byBjcmVhdGUgYSBIVE1MIHRhYmxlIEphdmFzY3JpcHQgU3RyaW5nXHJcbnZhciBqc29uSHRtbFRhYmxlID0gQ29udmVydEpzb25Ub1RhYmxlKGV2YWwoZGF0YVN0cmluZyksICdqc29uVGFibGUnLCBudWxsLCAnRG93bmxvYWQnKTtcclxuXHJcbkNvZGUgc2FtcGxlIGV4cGxhbmVkXHJcbi0gZXZhbCBpcyB1c2VkIHRvIHBhcnNlIGEgSlNPTiBkYXRhU3RyaW5nXHJcbi0gdGFibGUgSFRNTCBpZCBhdHRyaWJ1dGUgd2lsbCBiZSAnanNvblRhYmxlJ1xyXG4tIHRhYmxlIEhUTUwgY2xhc3MgYXR0cmlidXRlIHdpbGwgbm90IGJlIGFkZGVkXHJcbi0gJ0Rvd25sb2FkJyB0ZXh0IHdpbGwgYmUgZGlzcGxheWVkIGluc3RlYWQgb2YgdGhlIGxpbmsgaXRzZWxmXHJcblxyXG5AYXV0aG9yIEFmc2hpbiBNZWhyYWJhbmkgPGFmc2hpbiBkb3QgbWVoIGF0IGdtYWlsIGRvdCBjb20+XHJcblxyXG5AY2xhc3MgQ29udmVydEpzb25Ub1RhYmxlXHJcblxyXG5AbWV0aG9kIENvbnZlcnRKc29uVG9UYWJsZVxyXG5cclxuQHBhcmFtIHBhcnNlZEpzb24gb2JqZWN0IFBhcnNlZCBKU09OIGRhdGFcclxuQHBhcmFtIHRhYmxlSWQgc3RyaW5nIE9wdGlvbmFsIHRhYmxlIGlkXHJcbkBwYXJhbSB0YWJsZUNsYXNzTmFtZSBzdHJpbmcgT3B0aW9uYWwgdGFibGUgY3NzIGNsYXNzIG5hbWVcclxuQHBhcmFtIGxpbmtUZXh0IHN0cmluZyBPcHRpb25hbCB0ZXh0IHJlcGxhY2VtZW50IGZvciBsaW5rIHBhdHRlcm5cclxuXHJcbkByZXR1cm4gc3RyaW5nIENvbnZlcnRlZCBKU09OIHRvIEhUTUwgdGFibGVcclxuIyMjXHJcbmNsYXNzIEpzb25Ub1RhYmxlIFxyXG4gIFxyXG4gIHRhYmxlOiBudWxsXHJcbiAgXHJcbiAgY29uc3RydWN0b3I6IChwYXJzZWRKc29uLCB0YWJsZUlkLCB0YWJsZUNsYXNzTmFtZSwgbGlua1RleHQpIC0+XHJcbiAgICAjUGF0dGVybnMgZm9yIGxpbmtzIGFuZCBOVUxMIHZhbHVlXHJcbiAgICBpdGFsaWMgPSBcIjxpPnswfTwvaT5cIlxyXG4gICAgbGluayA9IChpZiBsaW5rVGV4dCB0aGVuIFwiPGEgaHJlZj1cXFwiezB9XFxcIj5cIiArIGxpbmtUZXh0ICsgXCI8L2E+XCIgZWxzZSBcIjxhIGhyZWY9XFxcInswfVxcXCI+ezB9PC9hPlwiKVxyXG4gIFxyXG4gICAgI1BhdHRlcm4gZm9yIHRhYmxlICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgIGlkTWFya3VwID0gKGlmIHRhYmxlSWQgdGhlbiBcIiBpZD1cXFwiXCIgKyB0YWJsZUlkICsgXCJcXFwiXCIgZWxzZSBcIlwiKVxyXG4gICAgY2xhc3NNYXJrdXAgPSAoaWYgdGFibGVDbGFzc05hbWUgdGhlbiBcIiBjbGFzcz1cXFwiXCIgKyB0YWJsZUNsYXNzTmFtZSArIFwiXFxcIlwiIGVsc2UgXCJcIilcclxuICAgIHRibCA9IFwiPHRhYmxlIGJvcmRlcj1cXFwiMVxcXCIgY2VsbHBhZGRpbmc9XFxcIjFcXFwiIGNlbGxzcGFjaW5nPVxcXCIxXFxcIlwiICsgaWRNYXJrdXAgKyBjbGFzc01hcmt1cCArIFwiPnswfXsxfTwvdGFibGU+XCJcclxuICBcclxuICAgICNQYXR0ZXJucyBmb3IgdGFibGUgY29udGVudFxyXG4gICAgdGggPSBcIjx0aGVhZD57MH08L3RoZWFkPlwiXHJcbiAgICB0YiA9IFwiPHRib2R5PnswfTwvdGJvZHk+XCJcclxuICAgIHRyID0gXCI8dHI+ezB9PC90cj5cIlxyXG4gICAgdGhSb3cgPSBcIjx0aD57MH08L3RoPlwiXHJcbiAgICB0ZFJvdyA9IFwiPHRkPnswfTwvdGQ+XCJcclxuICAgIHRoQ29uID0gXCJcIlxyXG4gICAgdGJDb24gPSBcIlwiXHJcbiAgICB0ckNvbiA9IFwiXCJcclxuICAgIGlmIHBhcnNlZEpzb25cclxuICAgICAgaXNTdHJpbmdBcnJheSA9IHR5cGVvZiAocGFyc2VkSnNvblswXSkgaXMgXCJzdHJpbmdcIlxyXG4gICAgICBoZWFkZXJzID0gdW5kZWZpbmVkXHJcbiAgICBcclxuICAgICAgIyBDcmVhdGUgdGFibGUgaGVhZGVycyBmcm9tIEpTT04gZGF0YVxyXG4gICAgICAjIElmIEpTT04gZGF0YSBpcyBhIHNpbXBsZSBzdHJpbmcgYXJyYXkgd2UgY3JlYXRlIGEgc2luZ2xlIHRhYmxlIGhlYWRlclxyXG4gICAgICBpZiBpc1N0cmluZ0FycmF5XHJcbiAgICAgICAgdGhDb24gKz0gdGhSb3cuZm9ybWF0KFwidmFsdWVcIilcclxuICAgICAgZWxzZVxyXG4gICAgICBcclxuICAgICAgICAjIElmIEpTT04gZGF0YSBpcyBhbiBvYmplY3QgYXJyYXksIGhlYWRlcnMgYXJlIGF1dG9tYXRpY2FsbHkgY29tcHV0ZWRcclxuICAgICAgICBpZiB0eXBlb2YgKHBhcnNlZEpzb25bMF0pIGlzIFwib2JqZWN0XCJcclxuICAgICAgICAgIGhlYWRlcnMgPSBhcnJheV9rZXlzKHBhcnNlZEpzb25bMF0pXHJcbiAgICAgICAgICBpID0gMFxyXG4gICAgICAgICAgd2hpbGUgaSA8IGhlYWRlcnMubGVuZ3RoXHJcbiAgICAgICAgICAgIHRoQ29uICs9IHRoUm93LmZvcm1hdChoZWFkZXJzW2ldKVxyXG4gICAgICAgICAgICBpKytcclxuICAgICAgdGggPSB0aC5mb3JtYXQodHIuZm9ybWF0KHRoQ29uKSlcclxuICAgIFxyXG4gICAgICAjIENyZWF0ZSB0YWJsZSByb3dzIGZyb20gSnNvbiBkYXRhXHJcbiAgICAgIGlmIGlzU3RyaW5nQXJyYXlcclxuICAgICAgICBpID0gMFxyXG4gICAgICAgIHdoaWxlIGkgPCBwYXJzZWRKc29uLmxlbmd0aFxyXG4gICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KHBhcnNlZEpzb25baV0pXHJcbiAgICAgICAgICB0ckNvbiArPSB0ci5mb3JtYXQodGJDb24pXHJcbiAgICAgICAgICB0YkNvbiA9IFwiXCJcclxuICAgICAgICAgIGkrK1xyXG4gICAgICBlbHNlXHJcbiAgICAgICAgaWYgaGVhZGVyc1xyXG4gICAgICAgICAgdXJsUmVnRXhwID0gbmV3IFJlZ0V4cCgvKFxcYihodHRwcz98ZnRwfGZpbGUpOlxcL1xcL1stQS1aMC05KyZAI1xcLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCNcXC8lPX5ffF0pL2cpXHJcbiAgICAgICAgICBqYXZhc2NyaXB0UmVnRXhwID0gbmV3IFJlZ0V4cCgvKF5qYXZhc2NyaXB0OltcXHNcXFNdKjskKS9nKVxyXG4gICAgICAgICAgaSA9IDBcclxuICAgICAgICAgIHdoaWxlIGkgPCBwYXJzZWRKc29uLmxlbmd0aFxyXG4gICAgICAgICAgICBqID0gMFxyXG4gICAgICAgICAgICB3aGlsZSBqIDwgaGVhZGVycy5sZW5ndGhcclxuICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlZEpzb25baV1baGVhZGVyc1tqXV1cclxuICAgICAgICAgICAgICBpc1VybCA9IHVybFJlZ0V4cC50ZXN0KHZhbHVlKSBvciBqYXZhc2NyaXB0UmVnRXhwLnRlc3QodmFsdWUpXHJcbiAgICAgICAgICAgICAgaWYgaXNVcmwgIyBJZiB2YWx1ZSBpcyBVUkwgd2UgYXV0by1jcmVhdGUgYSBsaW5rXHJcbiAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQobGluay5mb3JtYXQodmFsdWUpKVxyXG4gICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGlmIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgIGlmIHR5cGVvZiAodmFsdWUpIGlzIFwib2JqZWN0XCJcclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgI2ZvciBzdXBwb3J0aW5nIG5lc3RlZCB0YWJsZXNcclxuICAgICAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQoQ29udmVydEpzb25Ub1RhYmxlKGV2YWwodmFsdWUuZGF0YSksIHZhbHVlLnRhYmxlSWQsIHZhbHVlLnRhYmxlQ2xhc3NOYW1lLCB2YWx1ZS5saW5rVGV4dCkpXHJcbiAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQodmFsdWUpXHJcbiAgICAgICAgICAgICAgICBlbHNlICMgSWYgdmFsdWUgPT0gbnVsbCB3ZSBmb3JtYXQgaXQgbGlrZSBQaHBNeUFkbWluIE5VTEwgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChpdGFsaWMuZm9ybWF0KHZhbHVlKS50b1VwcGVyQ2FzZSgpKVxyXG4gICAgICAgICAgICAgIGorK1xyXG4gICAgICAgICAgICB0ckNvbiArPSB0ci5mb3JtYXQodGJDb24pXHJcbiAgICAgICAgICAgIHRiQ29uID0gXCJcIlxyXG4gICAgICAgICAgICBpKytcclxuICAgICAgdGIgPSB0Yi5mb3JtYXQodHJDb24pXHJcbiAgICAgIHRibCA9IHRibC5mb3JtYXQodGgsIHRiKVxyXG4gICAgQHRhYmxlID0gdGJsXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEpzb25Ub1RhYmxlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuYXJyYXkyRCA9IChpbml0TGVuZ3RoLCBpbml0V2lkdGgpIC0+XHJcbiAgYXJyYXkgPSBbXVxyXG4gIG1heExlbmd0aCA9IDBcclxuICBtYXhXaWR0aCA9IDBcclxuICAgIFxyXG4gIHJldCA9IFxyXG4gICAgZ2V0OiAocm93Tm8sIGNvbE5vKSAtPlxyXG4gICAgICBleHRlbmQgcm93Tm8sIGNvbE5vXHJcbiAgICBzZXQ6IChyb3dObywgY29sTm8sIHZhbCkgLT5cclxuICAgICAgcmV0LmdldCByb3dObywgY29sTm9cclxuICAgICAgcm93SWR4ID0gcm93Tm8tMVxyXG4gICAgICBjb2xJZHggPSBjb2xOby0xXHJcbiAgICAgIGFycmF5W3Jvd0lkeF1bY29sSWR4XSA9IHZhbFxyXG4gICAgZWFjaDogKGNhbGxCYWNrKSAtPlxyXG4gICAgICBfLmVhY2ggYXJyYXksIChjb2x1bW5zLCByb3cpIC0+XHJcbiAgICAgICAgXy5lYWNoIGFycmF5W3Jvd10sICh2YWwsIGNvbCkgLT5cclxuICAgICAgICAgIHJvd0lkeCA9IHJvdysxXHJcbiAgICAgICAgICBjb2xJZHggPSBjb2wrMVxyXG4gICAgICAgICAgY2FsbEJhY2sgcm93SWR4LCBjb2xJZHgsIHZhbFxyXG4gICAgd2lkdGg6ICgpIC0+XHJcbiAgICAgIG1heFdpZHRoXHJcbiAgICBsZW5ndGg6ICgpIC0+XHJcbiAgICAgIG1heExlbmd0aFxyXG4gICAgICAgICBcclxuICAjIyNcclxuICBHdWFyYW50ZWUgdGhhdCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgYXJyYXkgYXJlIGFsd2F5cyBiYWNrZWQgYnkgdmFsdWVzIGF0IGV2ZXJ5IHBvc2l0aW9uXHJcbiAgIyMjICAgICAgICAgICAgICAgICAgICBcclxuICBleHRlbmQgPSAobGVuZ3RoLCB3aWR0aCkgLT4gIFxyXG4gICAgaWYgbm90IGxlbmd0aCBvciBsZW5ndGggPCAxIHRoZW4gbGVuZ3RoID0gMVxyXG4gICAgaWYgbm90IHdpZHRoIG9yIHdpZHRoIDwgMSB0aGVuIHdpZHRoID0gMVxyXG4gICAgICBcclxuICAgIGlmIG1heExlbmd0aCA8IGxlbmd0aCB0aGVuIG1heExlbmd0aCA9IGxlbmd0aFxyXG4gICAgaWYgYXJyYXkubGVuZ3RoID4gbWF4TGVuZ3RoIHRoZW4gbWF4TGVuZ3RoID0gYXJyYXkubGVuZ3RoXHJcbiAgICBpZiBtYXhXaWR0aCA8IHdpZHRoIHRoZW4gbWF4V2lkdGggPSB3aWR0aFxyXG4gICAgaSA9IDBcclxuICAgICAgXHJcbiAgICB3aGlsZSBpIDwgbWF4TGVuZ3RoXHJcbiAgICAgIHRyeVJvdyA9IGFycmF5W2ldXHJcbiAgICAgIGlmIG5vdCB0cnlSb3dcclxuICAgICAgICB0cnlSb3cgPSBbXVxyXG4gICAgICAgIGFycmF5LnB1c2ggdHJ5Um93XHJcbiAgICAgIGlmIG1heFdpZHRoIDwgdHJ5Um93Lmxlbmd0aCB0aGVuIG1heFdpZHRoID0gdHJ5Um93Lmxlbmd0aFxyXG4gICAgICBpZiB0cnlSb3cubGVuZ3RoIDwgbWF4V2lkdGggdGhlbiB0cnlSb3cubGVuZ3RoID0gbWF4V2lkdGhcclxuICAgICAgaSArPSAxXHJcbiAgICAgIFxyXG4gICAgYXJyYXlbbGVuZ3RoLTFdW3dpZHRoLTFdXHJcbiAgICAgICBcclxuICBleHRlbmQgaW5pdExlbmd0aCwgaW5pdFdpZHRoXHJcbiAgICBcclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdhcnJheTJEJywgYXJyYXkyRFxyXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5MkQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5tZXRob2RzID0gW1xyXG4gICdhc3NlcnQnXHJcbiAgJ2NsZWFyJ1xyXG4gICdjb3VudCdcclxuICAnZGVidWcnXHJcbiAgJ2RpcidcclxuICAnZGlyeG1sJ1xyXG4gICdlcnJvcidcclxuICAnZXhjZXB0aW9uJ1xyXG4gICdncm91cCdcclxuICAnZ3JvdXBDb2xsYXBzZWQnXHJcbiAgJ2dyb3VwRW5kJ1xyXG4gICdpbmZvJ1xyXG4gICdsb2cnXHJcbiAgJ21lbW9yeSdcclxuICAncHJvZmlsZSdcclxuICAncHJvZmlsZUVuZCdcclxuICAndGFibGUnXHJcbiAgJ3RpbWUnXHJcbiAgJ3RpbWVFbmQnXHJcbiAgJ3RpbWVTdGFtcCdcclxuICAndGltZWxpbmUnXHJcbiAgJ3RpbWVsaW5lRW5kJ1xyXG4gICd0cmFjZSdcclxuICAnd2FybidcclxuXVxyXG5tZXRob2RMZW5ndGggPSBtZXRob2RzLmxlbmd0aFxyXG5jb25zb2xlID0gT0ouZ2xvYmFsLmNvbnNvbGUgb3Ige31cclxuT0oubWFrZVN1Yk5hbWVTcGFjZSAnY29uc29sZSdcclxuICBcclxuIyMjXHJcbjEuIFN0dWIgb3V0IGFueSBtaXNzaW5nIG1ldGhvZHMgd2l0aCBub29wXHJcbjIuIERlZmluZSB0aGUgYXZhaWxhYmxlIG1ldGhvZHMgb24gdGhlIE9KLmNvbnNvbGUgb2JqZWN0XHJcbiMjI1xyXG53aGlsZSBtZXRob2RMZW5ndGgtLVxyXG4gICgtPlxyXG4gICAgbWV0aG9kID0gbWV0aG9kc1ttZXRob2RMZW5ndGhdXHJcbiAgICBcclxuICAgICMgT25seSBzdHViIHVuZGVmaW5lZCBtZXRob2RzLlxyXG4gICAgY29uc29sZVttZXRob2RdID0gT0oubm9vcCB1bmxlc3MgY29uc29sZVttZXRob2RdXHJcbiAgICBcclxuICAgICNEZWZpbmUgdGhlIG1ldGhvZCBvbiB0aGUgT0ogY29uc29sZSBuYW1lc3BhY2VcclxuICAgIE9KLmNvbnNvbGUucmVnaXN0ZXIgbWV0aG9kLCAocGFyYW1zLi4uKSAtPlxyXG4gICAgICBjb25zb2xlW21ldGhvZF0gcGFyYW1zLi4uXHJcbiAgKSgpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnNvbGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG4gIFxyXG4jIyNcclxuU2V0dXAgc2V0dGluZ3NcclxuJC5jb29raWUucmF3ID0gdHJ1ZVxyXG4kLmNvb2tpZS5qc29uID0gdHJ1ZVxyXG4gIFxyXG5TZXR1cCBkZWZhdWx0c1xyXG5odHRwczovL2dpdGh1Yi5jb20vY2FyaGFydGwvanF1ZXJ5LWNvb2tpZS9cclxuJC5jb29raWUuZGVmYXVsdHMuZXhwaXJlcyA9IDM2NVxyXG4kLmNvb2tpZS5kZWZhdWx0cy5wYXRoID0gJy8nXHJcbiQuY29va2llLmRlZmF1bHRzLmRvbWFpbiA9ICdvai5jb20nXHJcbiMjI1xyXG5pZiBub3QgJCBvciBub3QgJC5jb29raWVcclxuICB0aHJvdyBuZXcgRXJyb3IgJ2pRdWVyeSBDb29raWUgaXMgYSByZXF1aXJlZCBkZXBlbmRlbmN5LicgIFxyXG4kLmNvb2tpZS5kZWZhdWx0cy5zZWN1cmUgPSBmYWxzZVxyXG4gIFxyXG5jb29raWVzID0ge31cclxuICBcclxuZ2V0ID0gKGNvb2tpZU5hbWUsIHR5cGUpIC0+XHJcbiAgcmV0ID0gJydcclxuICBpZiBjb29raWVOYW1lXHJcbiAgICBpZiB0eXBlXHJcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHR5cGVcclxuICAgIGVsc2VcclxuICAgICAgcmV0ID0gJC5jb29raWUgY29va2llTmFtZSAgICBcclxuICAgIGlmIHJldFxyXG4gICAgICBjb29raWVzW2Nvb2tpZU5hbWVdID0gcmV0XHJcbiAgXHJcbmFsbCA9IC0+XHJcbiAgcmV0ID0gJC5jb29raWUoKVxyXG4gIHJldFxyXG4gICAgXHJcbnNldCA9IChjb29raWVOYW1lLCB2YWx1ZSwgb3B0cykgLT5cclxuICByZXQgPSAnJ1xyXG4gIGlmIGNvb2tpZU5hbWVcclxuICAgIGNvb2tpZXNbY29va2llTmFtZV0gPSB2YWx1ZVxyXG4gICAgaWYgb3B0c1xyXG4gICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lLCB2YWx1ZSwgb3B0c1xyXG4gICAgZWxzZVxyXG4gICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lLCB2YWx1ZVxyXG4gIHJldCAgXHJcbiAgXHJcbmRlbCA9IChjb29raWVOYW1lLCBvcHRzKSAtPlxyXG4gIGlmIGNvb2tpZU5hbWVcclxuICAgIGlmIG9wdHNcclxuICAgICAgJC5yZW1vdmVDb29raWUgY29va2llTmFtZSwgb3B0c1xyXG4gICAgZWxzZVxyXG4gICAgICAkLnJlbW92ZUNvb2tpZSBjb29raWVOYW1lICAgIFxyXG4gICAgZGVsZXRlIGNvb2tpZXNbY29va2llTmFtZV1cclxuICByZXR1cm5cclxuICAgIFxyXG5kZWxldGVBbGwgPSAtPlxyXG4gIGNvb2tpZXMgPSB7fVxyXG4gIE9KLmVhY2ggT0ouY29va2llLmFsbCwgKHZhbCwga2V5KSAtPlxyXG4gICAgT0ouY29va2llLmRlbGV0ZSBrZXkgIFxyXG4gIHJldHVyblxyXG4gICAgXHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2RlbGV0ZUFsbCcsIGRlbGV0ZUFsbFxyXG4gT0ouY29va2llLnJlZ2lzdGVyICdkZWxldGUnLCBkZWxcclxuIE9KLmNvb2tpZS5yZWdpc3RlciAnc2V0Jywgc2V0XHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2dldCcsIGdldFxyXG4gT0ouY29va2llLnJlZ2lzdGVyICdhbGwnLCAgYWxsXHJcbiBcclxuIG1vZHVsZS5leHBvcnRzID0gXHJcbiAgZGVsZXRlQWxsOiBkZWxldGVBbGxcclxuICBkZWxldGU6IGRlbFxyXG4gIHNldDogc2V0XHJcbiAgZ2V0OiBnZXRcclxuICBhbGw6ICBhbGwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5kZWZlciA9IChtZXRob2QsIHdhaXRNcykgLT5cclxuICBpZiBzZXRUaW1lb3V0XHJcbiAgICByZXR1cm4gc2V0VGltZW91dCBtZXRob2QsIHdhaXRNc1xyXG4gIFxyXG5PSi5yZWdpc3RlciAnZGVmZXInLCBkZWZlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmVyIiwiIyAjIGVhY2hcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jICMjIGNhbkVhY2hcclxuY2FuRWFjaCA9IChvYmopIC0+XHJcbiAgIyBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IFtpc10oaXMuaHRtbCkgdHJ1bHkgaXRlcmFibGUgKGUuZy4gYW4gaW5zdGFuY2Ugb2YgT2JqZWN0IG9yIEFycmF5KVxyXG4gIE9KLmlzLnBsYWluT2JqZWN0KG9iaikgb3IgT0ouaXMub2JqZWN0KG9iaikgb3IgT0ouaXMuYXJyYXkgb2JqXHJcblxyXG4jICMjIFtPSl0ob2ouaHRtbCkuZWFjaFxyXG5cclxuIyBJdGVyYXRlIGFsbCBvZiB0aGUgbWVtYmVycyBvZiBhbiBvYmplY3QgKG9yIGFuIGFycmF5KSB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGFuZCByZWN1cnNpb24uXHJcblxyXG4jIC0gYG9iamA6IHRoZSBvYmplY3QgdG8gaXRlcmF0ZSxcclxuIyAtIGBvbkVhY2hgOiBhIGNhbGxiYWNrIHRvIGV4ZWN1dGUgZm9yIGVhY2ggaXRlcmF0aW9uLFxyXG4jIC0gYHJlY3Vyc2l2ZWA6IGlmIHRydWUsIHJlY3Vyc2l2ZWx5IGl0ZXJhdGUgYWxsIHZhbGlkIGNoaWxkIG9iamVjdHMuXHJcbmVhY2ggPSAob2JqLCBvbkVhY2gsIHJlY3Vyc2l2ZSkgLT5cclxuICBpZiBjYW5FYWNoIG9ialxyXG4gICAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNmb3Jvd24pJ3MgYGZvck93bmAgbWV0aG9kIHRvIGVuc3VyZSB0aGF0IG9ubHkgdGhlIGFjdHVhbCBwcm9wZXJ0aWVzIG9mIHRoZSBvYmplY3QgYXJlIGVudW1lcmF0ZWQuXHJcblxyXG4gICAgIyAtIGBvbkVhY2hgIGNhbGxiYWNrIHdpbGwgcmVjZWl2ZSAyIHBhcmFtZXRlcnM6XHJcbiAgICAjIC0gYHZhbGAgYW5kIGBrZXlgLlxyXG4gICAgIyAtIGB2YWxgIGlzIGFsd2F5cyB0aGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5LlxyXG4gICAgIyAtIGBrZXlgIGlzIGVpdGhlciB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb3IgdGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIGFycmF5LlxyXG4gICAgXy5mb3JPd24gb2JqLCAodmFsLCBrZXkpIC0+XHJcbiAgICAgIGlmIG9uRWFjaCBhbmQgKHZhbCBvciBrZXkpXHJcbiAgICAgICAgcXVpdCA9IG9uRWFjaCB2YWwsIGtleVxyXG4gICAgICAgIHJldHVybiBmYWxzZSAgaWYgZmFsc2UgaXMgcXVpdFxyXG4gICAgICBlYWNoIHZhbCwgb25FYWNoLCB0cnVlICBpZiB0cnVlIGlzIHJlY3Vyc2l2ZVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgcmV0dXJuXHJcblxyXG4jICMjIHJlZ2lzdGVyXHJcblxyXG4jIHJlZ2lzdGVyIHRoZSBgZWFjaGAgbWV0aG9kIG9uIHRoZSBbT0pdKE9KLmh0bWwpIG5hbWVzcGFjZVxyXG5PSi5yZWdpc3RlciAnZWFjaCcsIGVhY2hcclxubW9kdWxlLmV4cG9ydHMgPSBlYWNoIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxudW5rbm93biA9ICd1bmtub3duJyAgIFxyXG4gIFxyXG5pbnB1dFR5cGVzID1cclxuICBidXR0b246ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMFxyXG4gICAgbmFtZTogJ2J1dHRvbidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgY2hlY2tib3g6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMVxyXG4gICAgbmFtZTogJ2NoZWNrYm94J1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGNvbG9yOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDJcclxuICAgIG5hbWU6ICdjb2xvcidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBkYXRlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDNcclxuICAgIG5hbWU6ICdkYXRlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgZGF0ZXRpbWU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogNFxyXG4gICAgbmFtZTogJ2RhdGV0aW1lJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICdkYXRldGltZS1sb2NhbCc6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogNVxyXG4gICAgbmFtZTogJ2RhdGV0aW1lLWxvY2FsJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgZW1haWw6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogNlxyXG4gICAgbmFtZTogJ2VtYWlsJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBmaWxlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDdcclxuICAgIG5hbWU6ICdmaWxlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IGZhbHNlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgaGlkZGVuOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDhcclxuICAgIG5hbWU6ICdoaWRkZW4nXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGltYWdlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDlcclxuICAgIG5hbWU6ICdpbWFnZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgbW9udGg6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTBcclxuICAgIG5hbWU6ICdtb250aCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgbnVtYmVyOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDExXHJcbiAgICBuYW1lOiAnbnVtYmVyJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHBhc3N3b3JkOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDEyXHJcbiAgICBuYW1lOiAncGFzc3dvcmQnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICByYWRpbzogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxM1xyXG4gICAgbmFtZTogJ3JhZGlvJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHJhbmdlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE0XHJcbiAgICBuYW1lOiAncmFuZ2UnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcmVzZXQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTVcclxuICAgIG5hbWU6ICdyZXNldCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgc2VhcmNoOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE2XHJcbiAgICBuYW1lOiAnc2VhcmNoJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgc3VibWl0OiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE3XHJcbiAgICBuYW1lOiAnc3VibWl0J1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB0ZWw6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMThcclxuICAgIG5hbWU6ICdidXR0b24nXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB0ZXh0OiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE5XHJcbiAgICBuYW1lOiAndGV4dCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgdGltZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMFxyXG4gICAgbmFtZTogJ3RpbWUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB1cmw6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMjFcclxuICAgIG5hbWU6ICd1cmwnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHdlZWs6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMjJcclxuICAgIG5hbWU6ICd3ZWVrJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuT0ouZW51bXMucmVnaXN0ZXIgJ3Vua25vd24nLCB1bmtub3duXHJcbk9KLmVudW1zLnJlZ2lzdGVyICdpbnB1dFR5cGVzJywgaW5wdXRUeXBlc1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBcclxuICB1bmtub3duOiB1bmtub3duXHJcbiAgaW5wdXRUeXBlczogaW5wdXRUeXBlcyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG5pZiBPSi5nbG9iYWwuYWRkRXZlbnRMaXN0ZW5lclxyXG4gIGV2ZW50TmFtZSA9ICdhZGRFdmVudExpc3RlbmVyJ1xyXG4gIGV2ZW50SW5mbyA9ICcnXHJcbmVsc2UgXHJcbiAgZXZlbnROYW1lID0gJ2F0dGFjaEV2ZW50J1xyXG4gIGV2ZW50SW5mbyA9ICdvbidcclxuICBcclxucHVzaFN0YXRlID0gKHBhZ2VOYW1lLCBldmVudCkgLT5cclxuICBpZiBwYWdlTmFtZVxyXG4gICAgIyBrZWVwIHRoZSBsaW5rIGluIHRoZSBicm93c2VyIGhpc3RvcnlcclxuICAgIGhpc3RvcnkucHVzaFN0YXRlIG51bGwsIG51bGwsICcjJyArIHBhZ2VOYW1lXHJcbiAgICAgIFxyXG4gICAgIyBoZXJlIGNhbiBjYXVzZSBkYXRhIGxvYWRpbmcsIGV0Yy5cclxuICAgIFxyXG4gICAgaWYgZXZlbnQgICAgXHJcbiAgICAgICMgZG8gbm90IGdpdmUgYSBkZWZhdWx0IGFjdGlvblxyXG4gICAgICBpZiBldmVudC5wcmV2ZW50RGVmYXVsdFxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2VcclxuICBmYWxzZVxyXG4gIFxyXG5yZXN0b3JlU3RhdGUgPSAobG9jYXRpb24pIC0+XHJcbiAgcGFnZU5hbWUgPSBsb2NhdGlvbi5oYXNoXHJcbiAgaWYgbm90IHBhZ2VOYW1lXHJcbiAgICBwYWdlTmFtZSA9IGxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVsxXVxyXG4gIGlmIHBhZ2VOYW1lXHJcbiAgICBwYWdlTmFtZSA9IHBhZ2VOYW1lLnJlcGxhY2UgJyMnLCAnJ1xyXG4gICAgT0oucHVibGlzaCAncmVzdG9yZVN0YXRlJywgcGFnZU5hbWU6IHBhZ2VOYW1lLCBsb2NhdGlvbjogbG9jYXRpb25cclxuICByZXR1cm5cclxuICBcclxuIyMjIFxyXG5oYW5nIG9uIHRoZSBldmVudCwgYWxsIHJlZmVyZW5jZXMgaW4gdGhpcyBkb2N1bWVudFxyXG4jIyNcclxuICBcclxuIyMjXHJcbiMgVGhpcyBiaW5kcyB0byB0aGUgZG9jdW1lbnQgY2xpY2sgZXZlbnQsIHdoaWNoIGluIHR1cm4gYXR0YWNoZXMgdG8gZXZlcnkgY2xpY2sgZXZlbnQsIGNhdXNpbmcgdW5leHBlY3RlZCBiZWhhdmlvci5cclxuIyBGb3IgYW55IGNvbnRyb2wgd2hpY2ggd2lzaGVzIHRvIHRyaWdnZXIgYSBzdGF0ZSBjaGFuZ2UgaW4gcmVzcG9uc2UgdG8gYW4gZXZlbnQsIGl0IGlzIGJldHRlciBmb3IgdGhhdCBjb250cm9sIHRvIGRlZmluZSB0aGUgYmVoYXZpb3IuXHJcbk9KLmRvY3VtZW50W2V2ZW50TmFtZV0gZXZlbnRJbmZvICsgJ2NsaWNrJywgKChldmVudCkgLT5cclxuICBldmVudCA9IGV2ZW50IG9yIHdpbmRvdy5ldmVudFxyXG4gIHRhcmdldCA9IGV2ZW50LnRhcmdldCBvciBldmVudC5zcmNFbGVtZW50XHJcbiAgICBcclxuICAjIGxvb2tpbmcgZm9yIGFsbCB0aGUgbGlua3Mgd2l0aCAnYWpheCcgY2xhc3MgZm91bmRcclxuICBpZiB0YXJnZXQgYW5kIHRhcmdldC5ub2RlTmFtZSBpcyAnQScgYW5kICgnICcgKyB0YXJnZXQuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCdhamF4JykgPj0gMFxyXG4gICAgT0oucHVzaFN0YXRlIHRhcmdldC5ocmVmLCBldmVudFxyXG4gICAgICBcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuKSwgZmFsc2VcclxuIyMjXHJcblxyXG4jIyNcclxuaGFuZyBvbiBwb3BzdGF0ZSBldmVudCB0cmlnZ2VyZWQgYnkgcHJlc3NpbmcgYmFjay9mb3J3YXJkIGluIGJyb3dzZXJcclxuIyMjXHJcbk9KLmdsb2JhbFtldmVudE5hbWVdIGV2ZW50SW5mbyArICdwb3BzdGF0ZScsICgoZXZlbnQpIC0+XHJcbiAgICBcclxuICAjIHdlIGdldCBhIG5vcm1hbCBMb2NhdGlvbiBvYmplY3RcclxuICAgIFxyXG4gICMjI1xyXG4gIE5vdGUsIHRoaXMgaXMgdGhlIG9ubHkgZGlmZmVyZW5jZSB3aGVuIHVzaW5nIHRoaXMgbGlicmFyeSxcclxuICBiZWNhdXNlIHRoZSBvYmplY3QgZG9jdW1lbnQubG9jYXRpb24gY2Fubm90IGJlIG92ZXJyaWRlbixcclxuICBzbyBsaWJyYXJ5IHRoZSByZXR1cm5zIGdlbmVyYXRlZCAnbG9jYXRpb24nIG9iamVjdCB3aXRoaW5cclxuICBhbiBvYmplY3Qgd2luZG93Lmhpc3RvcnksIHNvIGdldCBpdCBvdXQgb2YgJ2hpc3RvcnkubG9jYXRpb24nLlxyXG4gIEZvciBicm93c2VycyBzdXBwb3J0aW5nICdoaXN0b3J5LnB1c2hTdGF0ZScgZ2V0IGdlbmVyYXRlZFxyXG4gIG9iamVjdCAnbG9jYXRpb24nIHdpdGggdGhlIHVzdWFsICdkb2N1bWVudC5sb2NhdGlvbicuXHJcbiAgIyMjICAgICAgICAgICAgICAgICAgICAgXHJcbiAgcmV0dXJuTG9jYXRpb24gPSBoaXN0b3J5LmxvY2F0aW9uIG9yIGRvY3VtZW50LmxvY2F0aW9uXHJcbiAgICBcclxuICAjIyNcclxuICBoZXJlIGNhbiBjYXVzZSBkYXRhIGxvYWRpbmcsIGV0Yy5cclxuICAjIyNcclxuICBPSi5oaXN0b3J5LnJlc3RvcmVTdGF0ZSByZXR1cm5Mb2NhdGlvblxyXG4gICAgXHJcbiAgcmV0dXJuXHJcbiksIGZhbHNlIFxyXG4gIFxyXG4gXHJcbk9KLmhpc3RvcnkucmVnaXN0ZXIgJ3Jlc3RvcmVTdGF0ZScsIHJlc3RvcmVTdGF0ZVxyXG5PSi5oaXN0b3J5LnJlZ2lzdGVyICdwdXNoU3RhdGUnLCBwdXNoU3RhdGVcclxuIFxyXG5tb2R1bGUuZXhwb3J0cyA9IFxyXG4gIHJlc3RvcmVTdGF0ZTogcmVzdG9yZVN0YXRlXHJcbiAgcHVzaFN0YXRlOiBwdXNoU3RhdGVcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbiQgPSByZXF1aXJlICdqcXVlcnknXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5jbGFzcyBJU1xuXG4gIEBib29sOiAoYm9vbGVhbikgLT5cbiAgICBfLmlzQm9vbGVhbiBib29sZWFuXG5cbiAgQGFycmF5TnVsbE9yRW1wdHk6IChhcnIpIC0+XG4gICAgXy5pc0VtcHR5IGFyclxuXG4gIEBzdHJpbmdOdWxsT3JFbXB0eTogKHN0cikgLT5cbiAgICBzdHIgYW5kIChub3Qgc3RyLmxlbmd0aCBvciBzdHIubGVuZ3RoIGlzIDAgb3Igbm90IHN0ci50cmltIG9yIG5vdCBzdHIudHJpbSgpKVxuXG4gIEBudW1iZXJOdWxsT3JFbXB0eTogKG51bSkgLT5cbiAgICBub3QgbnVtIG9yIGlzTmFOKG51bSkgb3Igbm90IG51bS50b1ByZWNpc2lvblxuXG4gIEBkYXRlTnVsbE9yRW1wdHk6IChkdCkgLT5cbiAgICBub3QgZHQgb3Igbm90IGR0LmdldFRpbWVcblxuICBAb2JqZWN0TnVsbE9yRW1wdHk6IChvYmopIC0+XG4gICAgXy5pc0VtcHR5IG9iaiBvciBub3QgT2JqZWN0LmtleXMob2JqKSBvciBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCBpcyAwXG5cbiAgQHBsYWluT2JqZWN0OiAob2JqKSAtPlxuICAgIF8uaXNQbGFpbk9iamVjdCBvYmpcblxuICBAb2JqZWN0OiAob2JqKSAtPlxuICAgIF8uaXNPYmplY3Qgb2JqXG5cbiAgQGRhdGU6IChkdCkgLT5cbiAgICBfLmlzRGF0ZSBkdFxuXG5cbiAgIyMjXG4gIERldGVybWluZXMgaWYgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiBhIE51bWJlciBhbmQgbm90IE5hTipcbiAgIyMjXG4gIEBudW1iZXI6IChudW0pIC0+XG4gICAgbnVtYmVyID0gcmVxdWlyZSAnLi4vY29yZS9udW1iZXInXG4gICAgdHlwZW9mIG51bSBpcyAnbnVtYmVyJyBhbmQgZmFsc2UgaXMgKG51bWJlci5pc05hTihudW0pIG9yIGZhbHNlIGlzIG51bWJlci5pc0Zpbml0ZShudW0pIG9yIG51bWJlci5NQVhfVkFMVUUgaXMgbnVtIG9yIG51bWJlci5NSU5fVkFMVUUgaXMgbnVtKVxuXG4gICMjI1xuICBEZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgY29udmVydGlibGUgdG8gYSBOdW1iZXJcbiAgIyMjXG4gIEBudW1lcmljOiAobnVtKSAtPlxuICAgIHJldCA9IEBudW1iZXIobnVtKVxuICAgIHVubGVzcyByZXRcbiAgICAgIHRvID0gcmVxdWlyZSAnLi90bydcbiAgICAgIG51TnVtID0gdG8ubnVtYmVyKG51bSlcbiAgICAgIHJldCA9IEBudW1iZXIobnVOdW0pXG4gICAgcmV0XG5cbiAgQGVsZW1lbnRJbkRvbTogKGVsZW1lbnRJZCkgLT5cbiAgICBmYWxzZSBpcyBAbnVsbE9yRW1wdHkoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKSlcblxuICBAYXJyYXk6IChvYmopIC0+XG4gICAgXy5pc0FycmF5IG9ialxuXG4gIEBzdHJpbmc6IChzdHIpIC0+XG4gICAgXy5pc1N0cmluZyBzdHJcblxuICBAdHJ1ZTogKG9iaikgLT5cbiAgICBvYmogaXMgdHJ1ZSBvciBvYmogaXMgJ3RydWUnIG9yIG9iaiBpcyAxIG9yIG9iaiBpcyAnMSdcblxuICBAZmFsc2U6IChvYmopIC0+XG4gICAgb2JqIGlzIGZhbHNlIG9yIG9iaiBpcyAnZmFsc2UnIG9yIG9iaiBpcyAwIG9yIG9iaiBpcyAnMCdcblxuICBAdHJ1ZU9yRmFsc2U6IChvYmopIC0+XG4gICAgQHRydWUgb2JqIG9yIEBmYWxzZSBvYmpcblxuICBAbnVsbE9yRW1wdHk6IChvYmosIGNoZWNrTGVuZ3RoKSAtPlxuICAgIF8uaXNFbXB0eShvYmopIG9yIF8uaXNVbmRlZmluZWQob2JqKSBvciBfLmlzTnVsbChvYmopIG9yIF8uaXNOYU4ob2JqKVxuXG4gIEBudWxsT3JVbmRlZmluZWQ6IChvYmosIGNoZWNrTGVuZ3RoKSAtPlxuICAgIF8uaXNVbmRlZmluZWQob2JqKSBvciBfLmlzTnVsbChvYmopIG9yIF8uaXNOYU4ob2JqKVxuXG4gIEBpbnN0YW5jZW9mOiAobmFtZSwgb2JqKSAtPlxuICAgIG9iai50eXBlIGlzIG5hbWUgb3Igb2JqIGluc3RhbmNlb2YgbmFtZVxuXG4gIEBtZXRob2Q6IChvYmopIC0+XG4gICAgb2JqIGlzbnQgT0oubm9vcCBhbmQgXy5pc0Z1bmN0aW9uIG9ialxuXG4gICMjI1xuICBEZXByZWNhdGVkLiBMZWZ0IGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4gVXNlIGlzLm1ldGhvZCBpbnN0ZWFkLlxuICAjIyNcbiAgQGZ1bmMgPSBAbWV0aG9kXG5cblxuXG5PSi5yZWdpc3RlciAnaXMnLCBJU1xubW9kdWxlLmV4cG9ydHMgPSBJU1xuXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub3R5ID0gcmVxdWlyZSAnbm90eSdcclxuXHJcbiAgXHJcbm1ha2VOb3R5ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxyXG4gIGRlZmF1bHRzID1cclxuICAgIGxheW91dDogJ3RvcFJpZ2h0J1xyXG4gICAgdGhlbWU6ICdkZWZhdWx0VGhlbWUnXHJcbiAgICB0eXBlOiAnYWxlcnQnXHJcbiAgICB0ZXh0OiAnJyAjY2FuIGJlIGh0bWwgb3Igc3RyaW5nXHJcbiAgICBkaXNtaXNzUXVldWU6IHRydWUgI0lmIHlvdSB3YW50IHRvIHVzZSBxdWV1ZSBmZWF0dXJlIHNldCB0aGlzIHRydWVcclxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm5vdHlfbWVzc2FnZVwiPjxzcGFuIGNsYXNzPVwibm90eV90ZXh0XCI+PC9zcGFuPjxkaXYgY2xhc3M9XCJub3R5X2Nsb3NlXCI+PC9kaXY+PC9kaXY+JyxcclxuICAgIGFuaW1hdGlvbjogXHJcbiAgICAgICAgb3BlbjogXHJcbiAgICAgICAgICBoZWlnaHQ6ICd0b2dnbGUnXHJcbiAgICAgICAgY2xvc2U6IFxyXG4gICAgICAgICAgaGVpZ2h0OiAndG9nZ2xlJ1xyXG4gICAgICAgIGVhc2luZzogJ3N3aW5nJ1xyXG4gICAgICAgIHNwZWVkOiA1MDAgI29wZW5pbmcgJiBjbG9zaW5nIGFuaW1hdGlvbiBzcGVlZFxyXG4gICAgdGltZW91dDogNTAwMCAjZGVsYXkgZm9yIGNsb3NpbmcgZXZlbnQuIFNldCBmYWxzZSBmb3Igc3RpY2t5IG5vdGlmaWNhdGlvbnNcclxuICAgIGZvcmNlOiBmYWxzZSAjYWRkcyBub3RpZmljYXRpb24gdG8gdGhlIGJlZ2lubmluZyBvZiBxdWV1ZSB3aGVuIHNldCB0byB0cnVlXHJcbiAgICBtb2RhbDogZmFsc2VcclxuICAgIG1heFZpc2libGU6IDUgI3lvdSBjYW4gc2V0IG1heCB2aXNpYmxlIG5vdGlmaWNhdGlvbiBmb3IgZGlzbWlzc1F1ZXVlIHRydWUgb3B0aW9uLFxyXG4gICAga2lsbGVyOiBmYWxzZSAjZm9yIGNsb3NlIGFsbCBub3RpZmljYXRpb25zIGJlZm9yZSBzaG93XHJcbiAgICBjbG9zZVdpdGg6IFsnY2xpY2snXSAgI1snY2xpY2snLCAnYnV0dG9uJywgJ2hvdmVyJ11cclxuICAgIGNhbGxiYWNrOiBcclxuICAgICAgICBvblNob3c6IE9KLm5vb3AsXHJcbiAgICAgICAgYWZ0ZXJTaG93OiBPSi5ub29wXHJcbiAgICAgICAgb25DbG9zZTogT0oubm9vcFxyXG4gICAgICAgIGFmdGVyQ2xvc2U6IE9KLm5vb3BcclxuICAgIGJ1dHRvbnM6IGZhbHNlICNhbiBhcnJheSBvZiBidXR0b25zXHJcbiAgICBcclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBub3R5IGRlZmF1bHRzXHJcbiAgICAgIFxyXG4gIHJldFxyXG4gICAgXHJcbk9KLm5vdGlmaWNhdGlvbnMucmVnaXN0ZXIgJ25vdHknLCBtYWtlTm90eVxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2VOb3R5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcblB1YlN1YiA9IHJlcXVpcmUgJ3B1YnN1Yi1qcydcblxudG9rZW5zID0ge31cbnN1YnNjcmliZXJzID0gW11cbmV2ZW50cyA9IHt9XG5cbnBzID0gXG4gIGdldEV2ZW50TmFtZTogKGV2ZW50KSAtPlxuICAgIGV2ZW50LnRvVXBwZXJDYXNlKCkucmVwbGFjZSAnICcsICdfJ1xuXG4gIHN1YnNjcmliZTogKGV2ZW50LCBtZXRob2QpIC0+XG4gICAgZXZlbnROYW1lID0gcHMuZ2V0RXZlbnROYW1lIGV2ZW50XG4gICAgaWYgbm90IGV2ZW50c1tldmVudE5hbWVdIHRoZW4gZXZlbnRzW2V2ZW50TmFtZV0gPSBbXVxuXG4gICAgdG9rZW4gPSBQdWJTdWIuc3Vic2NyaWJlIGV2ZW50TmFtZSwgbWV0aG9kXG4gICAgdG9rZW5zW3Rva2VuXSA9IHRva2VuXG4gICAgc3Vic2NyaWJlcnMucHVzaCBtZXRob2RcbiAgICBldmVudHNbZXZlbnROYW1lXS5wdXNoIG1ldGhvZFxuICAgIHRva2VuXG5cbiAgcHVibGlzaDogKGV2ZW50LCBkYXRhKSAtPlxuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZSBldmVudFxuICAgIGlmIGV2ZW50c1tldmVudE5hbWVdXG4gICAgICBQdWJTdWIucHVibGlzaCBldmVudE5hbWUsIGRhdGFcbiAgICBlbHNlXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0V2ZW50IG5hbWVkIHsnICsgZXZlbnQgKyAnfSBpcyBub3QgcmVjb2duaXplZC4nXG4gICAgcmV0dXJuXG5cbiAgdW5zdWJzY3JpYmU6ICh0b2tlbk9yTWV0aG9kKSAtPlxuICAgIGlmIE9KLmlzLm1ldGhvZCB0b2tlbk9yTWV0aG9kXG4gICAgICBpZiAtMSBpc250IHN1YnNjcmliZXJzLmluZGV4T2YgdG9rZW5Pck1ldGhvZFxuICAgICAgICBQdWJTdWIudW5zdWJzY3JpYmUgdG9rZW5Pck1ldGhvZFxuICAgICAgICBzdWJzY3JpYmVycyA9IF8ucmVtb3ZlIHN1YnNjcmliZXJzLCAobWV0aG9kKSAtPiBtZXRob2QgaXMgdG9rZW5Pck1ldGhvZFxuICAgICAgZWxzZVxuICAgICAgICBPSi5jb25zb2xlLmluZm8gJ0V2ZW50IG1ldGhvZCBpcyBub3QgcmVjb2duaXplZC4nXG4gICAgZWxzZVxuICAgICAgaWYgdG9rZW5zW3Rva2VuT3JNZXRob2RdXG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSB0b2tlbk9yTWV0aG9kXG4gICAgICAgIGRlbGV0ZSB0b2tlbnNbdG9rZW5Pck1ldGhvZF1cbiAgICByZXR1cm5cblxuICB1bnN1YnNjcmliZUFsbDogKCkgLT5cbiAgICBPSi5lYWNoIHRva2VucywgKHRva2VuKSAtPiB1bnN1YnNjcmliZSB0b2tlblxuICAgIHN1YnNjcmliZXJzID0gW11cbiAgICBldmVudHMgPSB7fVxuICAgIHJldHVyblxuXG4gIHVuc3Vic2NyaWJlRXZlbnQ6IChldmVudCkgLT5cbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUgZXZlbnRcbiAgICBpZiBldmVudHNbZXZlbnROYW1lXVxuICAgICAgT0ouZWFjaCBldmVudHNbZXZlbnROYW1lXSwgKG1ldGhvZCkgLT4gdW5zdWJzY3JpYmUgbWV0aG9kXG4gICAgZWxzZVxuICAgICAgT0ouY29uc29sZS5pbmZvICdFdmVudCBuYW1lZCB7JyArIGV2ZW50ICsgJ30gaXMgbm90IHJlY29nbml6ZWQuJ1xuICAgIGRlbGV0ZSBldmVudHNbZXZlbnROYW1lXVxuICAgIHJldHVyblxuXG5PYmplY3Quc2VhbCBwc1xuT2JqZWN0LmZyZWV6ZSBwc1xuXG5PSi5yZWdpc3RlciAnZ2V0RXZlbnROYW1lJywgcHMuZ2V0RXZlbnROYW1lXG5PSi5yZWdpc3RlciAncHVibGlzaCcsIHBzLnB1Ymxpc2hcbk9KLnJlZ2lzdGVyICdzdWJzY3JpYmUnLCBwcy5zdWJzY3JpYmVcbk9KLnJlZ2lzdGVyICd1bnN1YnNjcmliZScsIHBzLnVuc3Vic2NyaWJlXG5PSi5yZWdpc3RlciAndW5zdWJzY3JpYmVBbGwnLCBwcy51bnN1YnNjcmliZUFsbFxuT0oucmVnaXN0ZXIgJ3Vuc3Vic2NyaWJlRXZlbnQnLCBwcy51bnN1YnNjcmliZUV2ZW50XG5cbm1vZHVsZS5leHBvcnRzID0gcHMiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG4jIyNcclxuaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85MDExMTUvaG93LWNhbi1pLWdldC1xdWVyeS1zdHJpbmctdmFsdWVzLWluLWphdmFzY3JpcHRcclxuIyMjXHJcbnF1ZXJ5U3RyaW5nID0gKHBhcmFtKSAtPlxyXG4gIHJldCA9IHt9XHJcbiAgICBcclxuICBpZiBPSi5nbG9iYWwubG9jYXRpb25cclxuICAgIHBhcmFtcyA9ICBPSi5nbG9iYWwubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5zcGxpdCAnJidcclxuICAgIGlmIHBhcmFtc1xyXG4gICAgICBpID0gMFxyXG4gICAgICB3aGlsZSBpIDwgcGFyYW1zLmxlbmd0aFxyXG4gICAgICAgIHBybSA9IHBhcmFtc1tpXS5zcGxpdCAnPSdcclxuICAgICAgICBpZiBwcm0ubGVuZ3RoIGlzIDIgXHJcbiAgICAgICAgICByZXRbcHJtWzBdXSA9IE9KLmdsb2JhbC5kZWNvZGVVUklDb21wb25lbnQgcHJtWzFdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIilcclxuICAgICAgICBpICs9IDFcclxuICByZXRcclxuICAgIFxyXG5PSi5yZWdpc3RlciAncXVlcnlTdHJpbmcnLHF1ZXJ5U3RyaW5nXHJcbm1vZHVsZS5leHBvcnRzID0gcXVlcnlTdHJpbmciLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuZWFjaCA9IHJlcXVpcmUgJy4vZWFjaCdcclxuXHJcbiMgIyByYW5nZXNcclxuXHJcbnJuZyA9XHJcblxyXG4gICMgIyMgcmFuZ2VcclxuICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI3JhbmdlKSdzIGByYW5nZWAgbWV0aG9kXHJcbiAgcmFuZ2U6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBfLnJhbmdlIHBhcmFtcy4uLlxyXG5cclxuICAjICMjIHJhbmdlTWluXHJcbiAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNtaW4pJ3MgYG1pbmAgbWV0aG9kXHJcbiAgcmFuZ2VNaW46IChwYXJhbXMuLi4pIC0+XHJcbiAgICBfLm1pbiBwYXJhbXMuLi5cclxuXHJcbiAgIyAjIyByYW5nZU1heFxyXG4gICMgVXNpbmcgW0xvLURhc2hdKGh0dHA6Ly9sb2Rhc2guY29tL2RvY3MjbWF4KSdzIGBtYXhgIG1ldGhvZFxyXG4gIHJhbmdlTWF4OiAocGFyYW1zLi4uKSAtPlxyXG4gICAgXy5tYXggcGFyYW1zLi4uXHJcblxyXG4gICMgIyMgc3RyaW5nUmFuZ2VUb1N1YlJhbmdlc1xyXG4gICMjI1xyXG4gIFRha2UgYW4gYXJyYXkgb2Ygc3RyaW5nIHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXHJcbiAgVXNlcyB0aGUgZmlyc3QgbGV0dGVyIG9mIGVhY2ggc3RyaW5nIHZhbHVlIGluIHRoZSBhcnJheSB0byBjb252ZXJ0IHRvIHVuaXF1ZSBjb2RlIGNoYXJhY3RlciAobG93ZXIgY2FzZSlcclxuICBCdWlsZHMgYSBpbnQgcmFuZ2UgYmFzZWQgb24gdW5pcXVlIGNvZGUgY2hhcnMuXHJcbiAgIyMjXHJcbiAgc3RyaW5nVG9TdWJSYW5nZXM6IChuID0gNiwgcmFuZ2UgPSBbXSkgLT5cclxuICAgIGNoYXJSYW5nZSA9IFtdXHJcblxyXG5cclxuICAgIGVhY2ggcmFuZ2UsICh2YWwpIC0+XHJcbiAgICAgIGNoYXIgPSB2YWwudHJpbSgpWzBdLnRvTG93ZXJDYXNlKClcclxuICAgICAgaWYgZmFsc2UgaXMgb2JqLmNvbnRhaW5zIGNoYXJSYW5nZSwgY2hhclxyXG4gICAgICAgIGNoYXJSYW5nZS5wdXNoIGNoYXIuY2hhckNvZGVBdCgpXHJcblxyXG4gICAgcmV0ID0gcm5nLnRvU3ViUmFuZ2VzIG4sIGNoYXJSYW5nZVxyXG5cclxuICAgIGkgPSAwXHJcbiAgICB3aGlsZSBpIDwgblxyXG4gICAgICBpICs9IDFcclxuICAgICAgc3ViUmFuZ2UgPSByZXRbaV1cclxuICAgICAgc3ViUmFuZ2UubWFwIFN0cmluZy5mcm9tQ2hhckNvZGVcclxuXHJcbiAgICBvbGRHZXRSYW5nZSA9IHJldC5nZXRSYW5nZVxyXG4gICAgcmV0LmdldFJhbmdlID0gKHZhbCkgLT5cclxuICAgICAgY2hhciA9IHZhbC50cmltKClbMF0udG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KClcclxuICAgICAgaWR4ID0gb2xkR2V0UmFuZ2UgY2hhclxyXG4gICAgICBpZHhcclxuICAgIHJldFxyXG5cclxuICAjICMjIHJhbmdlVG9TdWJSYW5nZXNcclxuICAjIyNcclxuICBUYWtlIGFuIGFycmF5IG9mIGludCB2YWx1ZXMgYW5kIGEgbnVtYmVyIG9mIHBhcnRpdGlvbnMgdG8gY3JlYXRlLlxyXG4gIERpdmlkZXMgdGhlIG9yaWdpbmFsIGFycmF5IGludG8gdGhlIHNwZWNpZmllZCBudW1iZXIgb2Ygc3ViIGFycmF5cy5cclxuICBPdmVyZmxvdyBpcyBwYXNzZWQgdG8gdGhlIGZpbmFsIHBhcnRpdGlvbi5cclxuICAjIyNcclxuICB0b1N1YlJhbmdlczogKG4gPSA2LCByYW5nZSA9IFtdKSAtPlxyXG4gICAgcmV0ID0gb2JqLm9iamVjdCgpXHJcbiAgICByYW5nZUxvdyA9IHJuZy5yYW5nZU1pbiByYW5nZVxyXG4gICAgcmFuZ2VIaWdoID0gcm5nLnJhbmdlTWF4IHJhbmdlXHJcblxyXG4gICAgZGlzdGFuY2UgPSByYW5nZUhpZ2ggLSByYW5nZUxvd1xyXG4gICAgc3ViUmFuZ2VTaXplID0gZGlzdGFuY2UvblxyXG4gICAgc3ViUmFuZ2VzID0gcmV0LmFkZCAncmFuZ2VzJywgb2JqLm9iamVjdCgpXHJcbiAgICBjaHVua1ZhbCA9IHJhbmdlTG93XHJcblxyXG4gICAgbWFwID0gb2JqLm9iamVjdCgpXHJcblxyXG4gICAgaSA9IDBcclxuICAgIHdoaWxlIGkgPCBuXHJcbiAgICAgIGkgKz0gMVxyXG4gICAgICBpZiBpIDwgbiB0aGVuIGp1bXAgPSBNYXRoLnJvdW5kIHN1YlJhbmdlU2l6ZVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAganVtcCA9IE1hdGguZmxvb3Igc3ViUmFuZ2VTaXplXHJcbiAgICAgICAgaWYgY2h1bmtWYWwgKyBqdW1wIDw9IHJhbmdlSGlnaFxyXG4gICAgICAgICAganVtcCArPSByYW5nZUhpZ2ggLSBjaHVua1ZhbCAtIGp1bXAgKyAxXHJcblxyXG4gICAgICBzdWJSYW5nZSA9IHJuZy5yYW5nZSBjaHVua1ZhbCwgY2h1bmtWYWwgKyBqdW1wXHJcbiAgICAgIGVhY2ggc3ViUmFuZ2UsICh2YWwpIC0+IG1hcC5hZGQgdmFsLCBpXHJcbiAgICAgIHN1YlJhbmdlc1tpXSA9IHN1YlJhbmdlXHJcbiAgICAgIGNodW5rVmFsICs9IGp1bXBcclxuXHJcbiAgICByZXQuYWRkICdnZXRSYW5nZScsICh2YWwpIC0+XHJcbiAgICAgIG1hcFt2YWxdXHJcblxyXG4gICAgcmV0XHJcblxyXG5PYmplY3Quc2VhbCBybmdcclxuT2JqZWN0LmZyZWV6ZSBybmdcclxuXHJcbk9KLnJlZ2lzdGVyICdyYW5nZXMnLCBybmdcclxubW9kdWxlLmV4cG9ydHMgPSBybmdcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbiQgPSByZXF1aXJlICdqcXVlcnknXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuSVMgPSByZXF1aXJlICcuL2lzJ1xuXG4jICMgdG9cbmNsYXNzIFRPIFxuICAjICMjIGJvb2xcbiAgIyBjb252ZXJ0IGFueSBjb21wYXRpYmxlIG9iamVjdCB0byBhIGJvb2xlYW4uIEluY29tcGF0aWJsZSBvYmplY3RzIGFyZSBmYWxzZS5cbiAgQGJvb2w6IChzdHIpIC0+XG4gICAgcmV0Qm9vbCA9IElTWyd0cnVlJ10oc3RyKVxuICAgIHJldEJvb2wgPSBmYWxzZSAgaWYgcmV0Qm9vbCBpcyBmYWxzZSBvciByZXRCb29sIGlzbnQgdHJ1ZVxuICAgIHJldEJvb2xcblxuICAjICMjIEVTNV9Ub0Jvb2xcbiAgIyAoZGVidWcpIG1ldGhvZCB0byBleHBsaWNpdGx5IGZvcmNlIGFuIGBpZihvYmopYCBldmFsdWF0aW9uIHRvIGZsb3cgdGhyb3VnaCB0aGUgRVM1IHNwZWMgZm9yIHRydXRoaW5lc3NcbiAgQEVTNV9Ub0Jvb2w6ICh2YWwpIC0+XG4gICAgdmFsIGlzbnQgZmFsc2UgYW5kIHZhbCBpc250IDAgYW5kIHZhbCBpc250ICcnIGFuZCB2YWwgaXNudCBudWxsIGFuZCB0eXBlb2YgdmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kICh0eXBlb2YgdmFsIGlzbnQgJ251bWJlcicgb3Igbm90IGlzTmFOKHZhbCkpXG5cbiAgIyAjIyBkYXRlRnJvbVRpY2tzXG4gICMgdGFrZSBhIG51bWJlciByZXByZXNlbnRpbmcgdGlja3MgYW5kIGNvbnZlcnQgaXQgaW50byBhbiBpbnN0YW5jZSBvZiBEYXRlXG4gIEBkYXRlRnJvbVRpY2tzOiAodGlja1N0cikgLT5cbiAgICB0aWNzRGF0ZVRpbWUgPSBAc3RyaW5nKHRpY2tTdHIpXG4gICAgcmV0ID0gdW5kZWZpbmVkXG4gICAgdGlja3MgPSB1bmRlZmluZWRcbiAgICBvZmZzZXQgPSB1bmRlZmluZWRcbiAgICBsb2NhbE9mZnNldCA9IHVuZGVmaW5lZFxuICAgIGFyciA9IHVuZGVmaW5lZFxuICAgIGlmIGZhbHNlIGlzIElTLm51bGxPckVtcHR5KHRpY3NEYXRlVGltZSlcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcvJywgJycpXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnRGF0ZScsICcnKVxuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJygnLCAnJylcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcpJywgJycpXG4gICAgICBhcnIgPSB0aWNzRGF0ZVRpbWUuc3BsaXQoJy0nKVxuICAgICAgaWYgYXJyLmxlbmd0aCA+IDFcbiAgICAgICAgdGlja3MgPSBAbnVtYmVyKGFyclswXSlcbiAgICAgICAgb2Zmc2V0ID0gQG51bWJlcihhcnJbMV0pXG4gICAgICAgIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpXG4gICAgICAgIHJldCA9IG5ldyBEYXRlKCh0aWNrcyAtICgobG9jYWxPZmZzZXQgKyAob2Zmc2V0IC8gMTAwICogNjApKSAqIDEwMDApKSlcbiAgICAgIGVsc2UgaWYgYXJyLmxlbmd0aCBpcyAxXG4gICAgICAgIHRpY2tzID0gQG51bWJlcihhcnJbMF0pXG4gICAgICAgIHJldCA9IG5ldyBEYXRlKHRpY2tzKVxuICAgIHJldFxuXG4gICMgIyMgYmluYXJ5XG4gICMgY29udmVydCBhbiBvYmplY3QgdG8gYmluYXJ5IDAgb3IgMVxuICBAYmluYXJ5OiAob2JqKSAtPlxuICAgIHJldCA9IE5hTlxuICAgIGlmIG9iaiBpcyAwIG9yIG9iaiBpcyAnMCcgb3Igb2JqIGlzICcnIG9yIG9iaiBpcyBmYWxzZSBvciBAc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgaXMgJ2ZhbHNlJ1xuICAgICAgcmV0ID0gMFxuICAgIGVsc2UgcmV0ID0gMSAgaWYgb2JqIGlzIDEgb3Igb2JqIGlzICcxJyBvciBvYmogaXMgdHJ1ZSBvciBAc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgaXMgJ3RydWUnXG4gICAgcmV0XG5cblxuICAjICMjIG51bWJlclxuICAjXG4gICMgQXR0ZW1wdHMgdG8gY29udmVydCBhbiBhcmJpdHJhcnkgdmFsdWUgdG8gYSBOdW1iZXIuXG4gICMgTG9vc2UgZmFsc3kgdmFsdWVzIGFyZSBjb252ZXJ0ZWQgdG8gMC5cbiAgIyBMb29zZSB0cnV0aHkgdmFsdWVzIGFyZSBjb252ZXJ0ZWQgdG8gMS5cbiAgIyBBbGwgb3RoZXIgdmFsdWVzIGFyZSBwYXJzZWQgYXMgSW50ZWdlcnMuXG4gICMgRmFpbHVyZXMgcmV0dXJuIGFzIE5hTi5cbiAgI1xuICBAbnVtYmVyOiAoaW5wdXROdW0sIGRlZmF1bHROdW0pIC0+XG4gICAgdHJ5R2V0TnVtYmVyID0gKHZhbCkgPT5cbiAgICAgIHJldCA9IE5hTlxuICAgICAgIyBpZiBgdmFsYCBhbHJlYWR5IChpcylbaXMuaHRtbF0gYSBOdW1iZXIsIHJldHVybiBpdFxuICAgICAgaWYgSVMubnVtYmVyKHZhbClcbiAgICAgICAgcmV0ID0gdmFsXG4gICAgICAjIGVsc2UgaWYgYHZhbGAgYWxyZWFkeSAoaXMpW2lzLmh0bWxdIGEgU3RyaW5nIG9yIGEgQm9vbGVhbiwgY29udmVydCBpdFxuICAgICAgZWxzZSBpZiBJUy5zdHJpbmcodmFsKSBvciBJUy5ib29sKHZhbClcbiAgICAgICAgdHJ5R2V0ID0gKHZhbHVlKSA9PlxuICAgICAgICAgIG51bSA9IEBiaW5hcnkodmFsdWUpXG4gICAgICAgICAgbnVtID0gK3ZhbHVlICBpZiBub3QgSVMubnVtYmVyKG51bSkgYW5kIHZhbHVlXG4gICAgICAgICAgbnVtID0gXy5wYXJzZUludCh2YWx1ZSwgMCkgaWYgbm90IElTLm51bWJlcihudW0pXG4gICAgICAgICAgbnVtXG4gICAgICAgIHJldCA9IHRyeUdldCB2YWxcbiAgICAgIHJldFxuXG4gICAgcmV0VmFsID0gdHJ5R2V0TnVtYmVyKGlucHV0TnVtKVxuICAgIGlmIG5vdCBJUy5udW1iZXIocmV0VmFsKVxuICAgICAgcmV0VmFsID0gdHJ5R2V0TnVtYmVyKGRlZmF1bHROdW0pXG4gICAgICByZXRWYWwgPSBOdW1iZXIuTmFOIGlmIG5vdCBJUy5udW1iZXIocmV0VmFsKVxuICAgIHJldFZhbFxuXG4gICMgIyMgc3RyaW5nXG4gICMgY29udmVydCBhbiBvYmplY3QgdG8gc3RyaW5nXG4gIEBzdHJpbmc6IChpbnB1dFN0ciwgZGVmYXVsdFN0cikgLT5cbiAgICB0cnlHZXRTdHJpbmcgPSAoc3RyKSA9PlxuICAgICAgcmV0ID0gdW5kZWZpbmVkXG4gICAgICBpZiBJUy5zdHJpbmcoc3RyKVxuICAgICAgICByZXQgPSBzdHJcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0ID0gJydcbiAgICAgICAgcmV0ID0gc3RyLnRvU3RyaW5nKCkgIGlmIElTLmJvb2woc3RyKSBvciBJUy5udW1iZXIoc3RyKSBvciBJUy5kYXRlKHN0cilcbiAgICAgIHJldFxuICAgIHJldDEgPSB0cnlHZXRTdHJpbmcoaW5wdXRTdHIpXG4gICAgcmV0MiA9IHRyeUdldFN0cmluZyhkZWZhdWx0U3RyKVxuICAgIHJldFZhbCA9ICcnXG4gICAgaWYgcmV0MS5sZW5ndGggaXNudCAwXG4gICAgICByZXRWYWwgPSByZXQxXG4gICAgZWxzZSBpZiByZXQxIGlzIHJldDIgb3IgcmV0Mi5sZW5ndGggaXMgMFxuICAgICAgcmV0VmFsID0gcmV0MVxuICAgIGVsc2VcbiAgICAgIHJldFZhbCA9IHJldDJcbiAgICByZXRWYWxcblxuT0oucmVnaXN0ZXIgJ3RvJywgVE9cbm1vZHVsZS5leHBvcnRzID0gVE8iLCIjICMgY3JlYXRlVVVJRFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuIyMjXHJcbkdlbmVyYXRlcyBhIHJhbmRvbSBzdHJpbmcgdGhhdCBjb21wbGllcyB0byB0aGUgUkZDIDQxMjIgc3BlY2lmaWNhdGlvbiBmb3IgR1VJRC9VVUlELlxyXG4oZS5nLiAnQjQyQTE1M0YtMUQ5QS00RjkyLTk5MDMtOTJDMTFERDY4NEQyJylcclxuV2hpbGUgbm90IGEgdHJ1ZSBVVUlELCBmb3IgdGhlIHB1cnBvc2VzIG9mIHRoaXMgYXBwbGljYXRpb24sIGl0IHNob3VsZCBiZSBzdWZmaWNpZW50LlxyXG4jIyNcclxuY3JlYXRlRmF1eFVVSUQgPSAtPlxyXG4gICAgXHJcbiAgIyBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmM0MTIyLnR4dFxyXG4gICMgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvaG93LXRvLWNyZWF0ZS1hLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0XHJcbiAgcyA9IFtdXHJcbiAgcy5sZW5ndGggPSAzNlxyXG4gIGhleERpZ2l0cyA9ICcwMTIzNDU2Nzg5YWJjZGVmJ1xyXG4gIGkgPSAwXHJcblxyXG4gIHdoaWxlIGkgPCAzNlxyXG4gICAgc1tpXSA9IGhleERpZ2l0cy5zdWJzdHIoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHgxMCksIDEpXHJcbiAgICBpICs9IDFcclxuICBzWzE0XSA9ICc0JyAjIGJpdHMgMTItMTUgb2YgdGhlIHRpbWVfaGlfYW5kX3ZlcnNpb24gZmllbGQgdG8gMDAxMFxyXG4gIHNbMTldID0gaGV4RGlnaXRzLnN1YnN0cigoc1sxOV0gJiAweDMpIHwgMHg4LCAxKSAjIGJpdHMgNi03IG9mIHRoZSBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkIHRvIDAxXHJcbiAgc1s4XSA9IHNbMTNdID0gc1sxOF0gPSBzWzIzXSA9ICctJ1xyXG4gIHV1aWQgPSBzLmpvaW4oJycpXHJcbiAgdXVpZFxyXG5cclxuT0oucmVnaXN0ZXIgJ2NyZWF0ZVVVSUQnLCBjcmVhdGVGYXV4VVVJRFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUZhdXhVVUlEIl19
