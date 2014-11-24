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

require('./dom/body.coffee');

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



},{"./async/ajax.coffee":2,"./async/promise.coffee":3,"./components/grid.coffee":4,"./components/inputgroup.coffee":5,"./components/tabs.coffee":6,"./components/tile.coffee":7,"./controls/icon.coffee":8,"./core/date.coffee":9,"./core/function.coffee":10,"./core/number.coffee":11,"./core/object.coffee":12,"./core/string.coffee":14,"./dom/body.coffee":15,"./dom/component.coffee":16,"./dom/control.coffee":17,"./dom/dom.coffee":18,"./dom/element.coffee":19,"./dom/fragment.coffee":20,"./dom/generics.coffee":21,"./dom/input.coffee":22,"./dom/nodeFactory.coffee":23,"./elements/a.coffee":24,"./elements/br.coffee":25,"./elements/form.coffee":26,"./elements/input.coffee":27,"./elements/ol.coffee":28,"./elements/select.coffee":29,"./elements/table.coffee":30,"./elements/textarea.coffee":31,"./elements/thead.coffee":32,"./elements/ul.coffee":33,"./inputs/buttoninput.coffee":35,"./inputs/checkbox.coffee":36,"./inputs/color.coffee":37,"./inputs/date.coffee":38,"./inputs/datetime.coffee":39,"./inputs/datetimelocal.coffee":40,"./inputs/email.coffee":41,"./inputs/file.coffee":42,"./inputs/hidden.coffee":43,"./inputs/imageinput.coffee":44,"./inputs/month.coffee":45,"./inputs/number.coffee":46,"./inputs/password.coffee":47,"./inputs/radio.coffee":48,"./inputs/range.coffee":49,"./inputs/reset.coffee":50,"./inputs/search.coffee":51,"./inputs/submit.coffee":52,"./inputs/tel.coffee":53,"./inputs/textinput.coffee":54,"./inputs/time.coffee":55,"./inputs/url.coffee":56,"./inputs/week.coffee":57,"./oj.coffee":58,"./ojInit.coffee":59,"./tools/array2D.coffee":61,"./tools/console.coffee":62,"./tools/cookie.coffee":63,"./tools/defer.coffee":64,"./tools/each.coffee":65,"./tools/enums.coffee":66,"./tools/error.coffee":67,"./tools/history.coffee":68,"./tools/is.coffee":69,"./tools/noty.coffee":70,"./tools/pubsub.coffee":71,"./tools/queryString.coffee":72,"./tools/ranges.coffee":73,"./tools/to.coffee":74,"./tools/uuid.coffee":75}],2:[function(require,module,exports){
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



},{"../dom/component":16,"../oj":58,"../ojInit":59,"../tools/uuid":75}],6:[function(require,module,exports){
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
var $, OJ, func, isMethod, property, retObj, _;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

isMethod = require('../tools/is');

property = require('./property');

func = require('./function');

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
    var to;
    to = require('../tools/to');
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
},{"../oj":58,"../tools/each":65,"../tools/is":69,"../tools/to":74,"./function":10,"./property":13}],13:[function(require,module,exports){
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
var OJ, body, dom, element, nodeFactory, thinBody, _;

OJ = require('../oj');

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

(typeof window !== "undefined" ? window.ThinDOM : typeof global !== "undefined" ? global.ThinDOM : null);

nodeFactory = require('./nodeFactory');

element = require('./element');

dom = require('./dom');


/*
Persist a handle on the body node
 */

if (typeof document !== 'undefined') {
  body = document.body;
} else {
  body = null;
}

thinBody = new ThinDOM(null, {
  id: 'body'
}, body);

thinBody.isInDOM = true;

thinBody.getId = function() {
  return 'body';
};

element.finalize(thinBody, 'body');

thinBody.count = 0;

thinBody.root = null;

dom(thinBody, null);

nodeFactory.addMakeMethod(thinBody, 0);

thinBody.isFullyInit = true;

OJ.register('body', thinBody);

module.exports = thinBody;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../oj":58,"./dom":18,"./element":19,"./nodeFactory":23}],16:[function(require,module,exports){
var OJ, component, el, obj;

OJ = require('../oj');

el = require('./element');

obj = require('../core/object');

component = function(options, owner, tagName) {
  var ret, rootNodeType, widget;
  if (options == null) {
    options = obj.object();
  }
  if (!tagName.startsWith('x-')) {
    tagName = 'x-' + tagName;
  }
  widget = el.element(tagName, obj.object(), owner, false);
  rootNodeType = options.rootNodeType || OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] || 'div';
  ret = widget.make(rootNodeType, options);
  ret.add('componentName', tagName);
  ret.add('remove', widget.remove);
  return ret;
};

OJ.register('component', component);

module.exports = component;



},{"../core/object":12,"../oj":58,"./element":19}],17:[function(require,module,exports){
var OJ, control, el, obj;

OJ = require('../oj');

el = require('./element');

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
  ret = el.element(rootNodeType, options, owner, false);
  ret.add('controlName', tagName);
  return ret;
};

OJ.register('control', control);

module.exports = control;



},{"../core/object":12,"../oj":58,"./element":19}],18:[function(require,module,exports){
(function (global){
var $, OJ, dom;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

dom = function(el, parent) {
  var enabled, isControlStillValid;
  if (parent == null) {
    parent = require('./body');
  }
  enabled = true;
  el.add('isValid', function() {
    return el && (el.el instanceof HTMLElement || el.el instanceof DocumentFragment);
  });
  isControlStillValid = function() {
    var isMethod, valid;
    isMethod = require('../tools/is');
    valid = false === isMethod.nullOrEmpty(el) && el.isValid();
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
    var len, to;
    to = require('../tools/to');
    len = 0;
    if (isControlStillValid()) {
      len = to.number(el.$.length);
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
    var to;
    if (isControlStillValid()) {
      to = require('../tools/to');
      switch (to.bool(truthy)) {
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
    var isMethod;
    if (isControlStillValid()) {
      isMethod = require('../tools/is');
      if (arguments.length === 1 && false === isMethod.nullOrUndefined(value)) {
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
};

OJ.register('isElementInDom', function(elementId) {
  return false === OJ.is.nullOrEmpty(OJ.getElement(elementId));
});

OJ.register('getElement', function(id) {
  if (typeof document !== 'undefined') {
    return document.getElementById(id);
  }
});

OJ.register('dom', dom);

module.exports = dom;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../oj":58,"../tools/is":69,"../tools/to":74,"./body":15}],19:[function(require,module,exports){
(function (global){
var $, OJ, element, _,
  __slice = [].slice;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

(typeof window !== "undefined" ? window.ThinDOM : typeof global !== "undefined" ? global.ThinDOM : null);

element = {

  /*
    Bind all event handlers
   */
  bindEvents: function(el, events) {
    if (el) {
      return _.forOwn(events, function(val, key) {
        var callback, isMethod;
        isMethod = require('../tools/is');
        if (isMethod.method(val)) {
          callback = function() {
            var event;
            event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            return val.apply(null, event);
          };
          el.$.on(key, callback);
          el.add(key, callback);
          return null;
        }
      });
    }
  },

  /*
  Finalize the ThimDOM node
   */
  finalize: function(ret, tag, props, styles, events, text) {
    ret.add('tagName', tag);
    ret.css(styles);
    if (text) {
      ret.text(text);
    }
    ret.add('$', $(ret.get()));
    ret.add('0', ret.get());
    ret.add('bindEvents', _.once(function() {
      return element.bindEvents(ret, events);
    }));
    return ret;
  },

  /*
  Restore an HTML Element through ThinDom
   */
  restoreElement: function(el, tag) {
    var nodeFactory, ret;
    if (tag == null) {
      tag = el.nodeName;
    }
    nodeFactory = require('./nodeFactory');
    ret = new ThinDOM(null, null, el);
    element.finalize(ret, tag);
    ret.add('isInDOM', true);
    nodeFactory.make(ret);
    return ret;
  },

  /*
  Create an HTML Element through ThinDom
   */
  element: function(tag, options, owner, isCalledFromFactory) {
    var nodeFactory, ret;
    if (isCalledFromFactory == null) {
      isCalledFromFactory = false;
    }
    ret = new ThinDOM(tag, options.props);
    element.finalize(ret, tag, options.props, options.styles, options.events, options.text);
    if (owner && false === isCalledFromFactory) {
      nodeFactory = require('./nodeFactory');
      nodeFactory.make(ret, owner);
    }
    return ret;
  }
};

OJ.register('restoreElement', element.restoreElement);

OJ.register('element', element.element);

module.exports = element;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../oj":58,"../tools/is":69,"./nodeFactory":23}],20:[function(require,module,exports){
var OJ, el, fragment;

OJ = require('../oj');

el = require('./element');

fragment = function() {
  var ret;
  ret = null;
  if (typeof document !== 'undefined') {
    fragment = document.createDocumentFragment();
    ret = el.restoreElement(fragment, 'fragment');
  }
  return ret;
};

OJ.register('fragment', fragment);

module.exports = fragment;



},{"../oj":58,"./element":19}],21:[function(require,module,exports){
var OJ, all, closed, el, exports, loopName, obj, open, _fn, _i, _len;

OJ = require('../oj');

el = require('./element');

require('../ojInit');

obj = require('../core/object');

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
    ret = el.element(tag, defaults, owner, calledFromFactory);
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



},{"../core/object":12,"../oj":58,"../ojInit":59,"./element":19}],22:[function(require,module,exports){
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
var OJ, closed, exports, makeAdd, makeUniqueId, nestableNodeNames, nodeNames, nonNestableNodes, open, _;

OJ = require('../oj');

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

closed = 'a abbr acronym address applet article aside audio b bdo big blockquote body button canvas caption center cite code colgroup command datalist dd del details dfn dir div dl dt em embed fieldset figcaption figure font footer form frameset h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins keygen kbd label legend li map mark menu meter nav noframes noscript object ol optgroup option output p pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr tt u ul var video wbr xmp'.split(' ');

open = 'area base br col command css !DOCTYPE embed hr img input keygen link meta param source track wbr'.split(' ');

nestableNodeNames = ['div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'fieldset', 'select', 'ol', 'ul', 'table'];

nonNestableNodes = ['li', 'legend', 'tr', 'td', 'option', 'body', 'head', 'source', 'tbody', 'tfoot', 'thead', 'link', 'script'];

exports = {};


/*
Fetch a node from the DOM and return an OJ'fied instance of the element
 */

exports.get = function(id, tagName) {
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
};

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

exports.addMakeMethod = function(el, count) {
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

exports.make = function(el, parent, count) {
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
      exports.addMakeMethod(ret, count);
      ret.isFullyInit = true;
      finalize = _.once(ret.finalize || OJ.noop);
      ret.finalize = finalize;
      finalize(ret);
    }
  }
  return ret;
};

OJ.nodes.register('factory', exports.make);

OJ.nodes.register('get', exports.get);

module.exports = exports;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../oj":58}],24:[function(require,module,exports){
var OJ, el, node, nodeName,
  __slice = [].slice;

OJ = require('../oj');

el = require('../dom/element');

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
  ret = el.element(nodeName, defaults, owner, calledFromFactory);
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/element":19,"../oj":58}],25:[function(require,module,exports){
var OJ, el, node, nodeName, to;

OJ = require('../oj');

el = require('../dom/element');

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
    ret = el.element(nodeName, defaults, owner, calledFromFactory);
    i += 1;
  }
  if (false === calledFromFactory) {
    nodesFactory(ret, owner);
  }
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/element":19,"../oj":58,"../tools/to":74}],26:[function(require,module,exports){
var OJ, el, node, nodeName;

OJ = require('../oj');

el = require('../dom/element');

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
  ret = el.element(nodeName, defaults, owner, calledFromFactory);
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



},{"../dom/element":19,"../oj":58}],27:[function(require,module,exports){
var OJ, el, enums, node, nodeName,
  __slice = [].slice;

OJ = require('../oj');

el = require('../dom/element');

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
  ret = el.element(nodeName, defaults, owner, calledFromFactory);
  ret.value = defaults.props.value;
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/element":19,"../oj":58,"../tools/enums":66}],28:[function(require,module,exports){
var OJ, el, node, nodeName;

OJ = require('../oj');

el = require('../dom/element');

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
  ret = el.element(nodeName, defaults, owner, calledFromFactory);
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/element":19,"../oj":58}],29:[function(require,module,exports){
var OJ, el, node, nodeName,
  __slice = [].slice;

OJ = require('../oj');

el = require('../dom/element');

nodeName = 'select';

node = function(options, owner) {
  var calledFromFactory, change, click, defaults, hasEmpty, newChange, newClick, ret, syncValue, value, values;
  if (owner == null) {
    owner = require('../dom/body', calledFromFactory = false);
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
  ret = el.element(nodeName, defaults, owner, calledFromFactory);
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



},{"../dom/body":15,"../dom/element":19,"../oj":58}],30:[function(require,module,exports){
(function (global){
var $, JsonToTable, OJ, array2D, el, node, nodeName, _;

OJ = require('../oj');

el = require('../dom/element');

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
  ret = el.element(nodeName, defaults, owner, calledFromFactory);
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
  ret.add('finalize', function() {
    init();
    ret.add('thead', thead);
    ret.add('tbody', tbody);
    return ret;
  });
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../dom/element":19,"../oj":58,"../tools/JsonToTable":60,"../tools/array2D":61}],31:[function(require,module,exports){
var OJ, el, enums, node, nodeName,
  __slice = [].slice;

OJ = require('../oj');

el = require('../dom/element');

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
  ret = el.element(nodeName, defaults, owner, calledFromFactory);
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/element":19,"../oj":58,"../tools/enums":66}],32:[function(require,module,exports){
var OJ, el, node, nodeName;

OJ = require('../oj');

el = require('../dom/element');

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
  ret = el.element(nodeName, defaults, owner, calledFromFactory);
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



},{"../dom/element":19,"../oj":58}],33:[function(require,module,exports){
var OJ, el, node, nodeName;

OJ = require('../oj');

el = require('../dom/element');

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
  ret = el.element(nodeName, defaults, owner, calledFromFactory);
  return ret;
};

OJ.nodes.register(nodeName, node);

module.exports = node;



},{"../dom/element":19,"../oj":58}],34:[function(require,module,exports){
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
var OJ, all, cookies, del, deleteAll, get, set;

OJ = require('../oj');


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
var OJ, onError;

OJ = require('../oj');

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



},{"../oj":58}],68:[function(require,module,exports){
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



},{"../oj":58}],69:[function(require,module,exports){
(function (global){
var $, OJ, each, isMethod, _;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

each = require('./each');

isMethod = {};

isMethod.bool = function(boolean) {
  return _.isBoolean(boolean);
};

isMethod.arrayNullOrEmpty = function(arr) {
  return _.isEmpty(arr);
};

isMethod.stringNullOrEmpty = function(str) {
  return str && (!str.length || str.length === 0 || !str.trim || !str.trim());
};

isMethod.numberNullOrEmpty = function(num) {
  return !num || isNaN(num) || !num.toPrecision;
};

isMethod.dateNullOrEmpty = function(dt) {
  return !dt || !dt.getTime;
};

isMethod.objectNullOrEmpty = function(obj) {
  return _.isEmpty(obj || !Object.keys(obj) || Object.keys(obj).length === 0);
};

isMethod.plainObject = function(obj) {
  return _.isPlainObject(obj);
};

isMethod.object = function(obj) {
  return _.isObject(obj);
};

isMethod.date = function(dt) {
  return _.isDate(dt);
};


/*
Determines if a value is an instance of a Number and not NaN*
 */

isMethod.number = function(num) {
  var number;
  number = require('../core/number');
  return typeof num === 'number' && false === (number.isNaN(num) || false === number.isFinite(num) || number.MAX_VALUE === num || number.MIN_VALUE === num);
};


/*
Determines if a value is convertible to a Number
 */

isMethod.numeric = function(num) {
  var nuNum, ret, to;
  ret = isMethod.number(num);
  if (!ret) {
    to = require('./to');
    nuNum = to.number(num);
    ret = isMethod.number(nuNum);
  }
  return ret;
};

isMethod.vendorObject = function(obj) {
  var ret;
  ret = obj instanceof OJ['?'];
  return ret;
};

isMethod.elementInDom = function(elementId) {
  return false === isMethod.nullOrEmpty(document.getElementById(elementId));
};

isMethod.array = function(obj) {
  return _.isArray(obj);
};

isMethod.string = function(str) {
  return _.isString(str);
};

isMethod["true"] = function(obj) {
  return obj === true || obj === 'true' || obj === 1 || obj === '1';
};

isMethod["false"] = function(obj) {
  return obj === false || obj === 'false' || obj === 0 || obj === '0';
};

isMethod.trueOrFalse = function(obj) {
  return isMethod["true"](obj || isMethod["false"](obj));
};

isMethod.nullOrEmpty = function(obj, checkLength) {
  return _.isEmpty(obj) || _.isUndefined(obj) || _.isNull(obj) || _.isNaN(obj);
};

isMethod.nullOrUndefined = function(obj, checkLength) {
  return _.isUndefined(obj) || _.isNull(obj) || _.isNaN(obj);
};

isMethod["instanceof"] = function(name, obj) {
  return obj.type === name || obj instanceof name;
};

isMethod.method = function(obj) {
  return obj !== OJ.noop && _.isFunction(obj);
};


/*
Deprecated. Left for backwards compatibility. Use is.method instead.
 */

isMethod.func = isMethod.method;

Object.seal(isMethod);

Object.freeze(isMethod);

OJ.register('is', isMethod);

module.exports = isMethod;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../core/number":11,"../oj":58,"./each":65,"./to":74}],70:[function(require,module,exports){
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
},{"../oj":58}],71:[function(require,module,exports){
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
},{"../oj":58}],72:[function(require,module,exports){
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



},{"../oj":58}],73:[function(require,module,exports){
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
},{"../core/object":12,"../oj":58,"./each":65}],74:[function(require,module,exports){
(function (global){
var $, OJ, each, isMethod, obj, to, _;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

isMethod = require('./is');

obj = require('../core/object');

each = require('./each');

to = {
  bool: function(str) {
    var retBool;
    retBool = isMethod['true'](str);
    if (retBool === false || retBool !== true) {
      retBool = false;
    }
    return retBool;
  },
  'ES5_ToBool': function(val) {
    return val !== false && val !== 0 && val !== '' && val !== null && typeof val !== 'undefined' && (typeof val !== 'number' || !isNaN(val));
  },
  dateFromTicks: function(tickStr) {
    var arr, localOffset, offset, ret, ticks, ticsDateTime;
    ticsDateTime = to.string(tickStr);
    ret = void 0;
    ticks = void 0;
    offset = void 0;
    localOffset = void 0;
    arr = void 0;
    if (false === isMethod.nullOrEmpty(ticsDateTime)) {
      ticsDateTime = ticsDateTime.replace('/', '');
      ticsDateTime = ticsDateTime.replace('Date', '');
      ticsDateTime = ticsDateTime.replace('(', '');
      ticsDateTime = ticsDateTime.replace(')', '');
      arr = ticsDateTime.split('-');
      if (arr.length > 1) {
        ticks = to.number(arr[0]);
        offset = to.number(arr[1]);
        localOffset = new Date().getTimezoneOffset();
        ret = new Date(ticks - ((localOffset + (offset / 100 * 60)) * 1000));
      } else if (arr.length === 1) {
        ticks = to.number(arr[0]);
        ret = new Date(ticks);
      }
    }
    return ret;
  },
  binary: function(obj) {
    var ret;
    ret = NaN;
    if (obj === 0 || obj === '0' || obj === '' || obj === false || to.string(obj).toLowerCase().trim() === 'false') {
      ret = 0;
    } else {
      if (obj === 1 || obj === '1' || obj === true || to.string(obj).toLowerCase().trim() === 'true') {
        ret = 1;
      }
    }
    return ret;
  },
  number: function(inputNum, defaultNum) {
    var retVal, tryGetNumber;
    tryGetNumber = function(val) {
      var ret, tryGet;
      ret = NaN;
      if (isMethod.number(val)) {
        ret = val;
      } else if (isMethod.string(val) || isMethod.bool(val)) {
        tryGet = function(value) {
          var num;
          num = to.binary(value);
          if (!isMethod.number(num) && value) {
            num = +value;
          }
          if (!isMethod.number(num)) {
            num = _.parseInt(value, 0);
          }
          return num;
        };
        ret = tryGet(val);
      }
      return ret;
    };
    retVal = tryGetNumber(inputNum);
    if (!isMethod.number(retVal)) {
      retVal = tryGetNumber(defaultNum);
      if (!isMethod.number(retVal)) {
        retVal = Number.NaN;
      }
    }
    return retVal;
  },
  string: function(inputStr, defaultStr) {
    var ret1, ret2, retVal, tryGetString;
    tryGetString = function(str) {
      var ret;
      ret = void 0;
      if (isMethod.string(str)) {
        ret = str;
      } else {
        ret = '';
        if (isMethod.bool(str) || isMethod.number(str) || isMethod.date(str)) {
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
  }
};

Object.seal(to);

Object.freeze(to);

OJ.register('to', to);

module.exports = to;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../core/object":12,"../oj":58,"./each":65,"./is":69}],75:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbnRyeXBvaW50LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcYXN5bmNcXGFqYXguY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxhc3luY1xccHJvbWlzZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXGdyaWQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb21wb25lbnRzXFxpbnB1dGdyb3VwLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGFicy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXHRpbGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb250cm9sc1xcaWNvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGRhdGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxmdW5jdGlvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG51bWJlci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG9iamVjdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXHByb3BlcnR5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxcc3RyaW5nLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxib2R5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxjb21wb25lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGNvbnRyb2wuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGRvbS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZWxlbWVudC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZnJhZ21lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGdlbmVyaWNzLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxpbnB1dC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcbm9kZUZhY3RvcnkuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcYS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxici5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxmb3JtLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXG9sLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHNlbGVjdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0YWJsZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0ZXh0YXJlYS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0aGVhZC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx1bC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGdsb2JhbC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcYnV0dG9uaW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGNoZWNrYm94LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxjb2xvci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZXRpbWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGRhdGV0aW1lbG9jYWwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGVtYWlsLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxmaWxlLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxoaWRkZW4uY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGltYWdlaW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXG1vbnRoLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxudW1iZXIuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHBhc3N3b3JkLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxyYWRpby5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xccmFuZ2UuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJlc2V0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxzZWFyY2guY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHN1Ym1pdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdGVsLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx0ZXh0aW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHRpbWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHVybC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcd2Vlay5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXG9qLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcb2pJbml0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXEpzb25Ub1RhYmxlLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGFycmF5MkQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcY29uc29sZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxjb29raWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZGVmZXIuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZWFjaC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlbnVtcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlcnJvci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxoaXN0b3J5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGlzLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXG5vdHkuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xccHVic3ViLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHF1ZXJ5U3RyaW5nLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHJhbmdlcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFx0by5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFx1dWlkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE9BQUEsQ0FBUSxhQUFSLENBQUEsQ0FBQTs7QUFBQSxPQUNBLENBQVEsaUJBQVIsQ0FEQSxDQUFBOztBQUFBLE9BRUEsQ0FBUSxxQkFBUixDQUZBLENBQUE7O0FBQUEsT0FHQSxDQUFRLHdCQUFSLENBSEEsQ0FBQTs7QUFBQSxPQUlBLENBQVEsMEJBQVIsQ0FKQSxDQUFBOztBQUFBLE9BS0EsQ0FBUSxnQ0FBUixDQUxBLENBQUE7O0FBQUEsT0FNQSxDQUFRLDBCQUFSLENBTkEsQ0FBQTs7QUFBQSxPQU9BLENBQVEsMEJBQVIsQ0FQQSxDQUFBOztBQUFBLE9BUUEsQ0FBUSx3QkFBUixDQVJBLENBQUE7O0FBQUEsT0FTQSxDQUFRLG9CQUFSLENBVEEsQ0FBQTs7QUFBQSxPQVVBLENBQVEsd0JBQVIsQ0FWQSxDQUFBOztBQUFBLE9BV0EsQ0FBUSxzQkFBUixDQVhBLENBQUE7O0FBQUEsT0FZQSxDQUFRLHNCQUFSLENBWkEsQ0FBQTs7QUFBQSxPQWFBLENBQVEsc0JBQVIsQ0FiQSxDQUFBOztBQUFBLE9BY0EsQ0FBUSxtQkFBUixD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O0FBQUEsSUFHQSxZQUFBLEVBQWMsS0FIZDtBQUFBLElBSUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsT0FBQSxFQUFTLEtBRFQ7S0FMRjtBQUFBLElBUUEsWUFBQSxFQUFjLEVBUmQ7QUFBQSxJQVNBLFdBQUEsRUFBYSxJQVRiO0dBckZGO0FBQUEsRUFnR0EsTUFBQSxFQUNFO0FBQUEsSUFBQSxFQUFBLEVBQUksQ0FBSjtBQUFBLElBQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxJQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsSUFHQSxZQUFBLEVBQWMsS0FIZDtBQUFBLElBSUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsT0FBQSxFQUFTLElBRFQ7S0FMRjtBQUFBLElBUUEsWUFBQSxFQUFjLEVBUmQ7QUFBQSxJQVNBLFdBQUEsRUFBYSxJQVRiO0dBakdGO0FBQUEsRUE0R0EsS0FBQSxFQUNFO0FBQUEsSUFBQSxFQUFBLEVBQUksQ0FBSjtBQUFBLElBQ0EsSUFBQSxFQUFNLE9BRE47QUFBQSxJQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsSUFHQSxZQUFBLEVBQWMsS0FIZDtBQUFBLElBSUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsT0FBQSxFQUFTLElBRFQ7S0FMRjtBQUFBLElBUUEsWUFBQSxFQUFjLEVBUmQ7QUFBQSxJQVNBLFdBQUEsRUFBYSxJQVRiO0dBN0dGO0FBQUEsRUF3SEEsS0FBQSxFQUNFO0FBQUEsSUFBQSxFQUFBLEVBQUksRUFBSjtBQUFBLElBQ0EsSUFBQSxFQUFNLE9BRE47QUFBQSxJQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsSUFHQSxZQUFBLEVBQWMsS0FIZDtBQUFBLElBSUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsT0FBQSxFQUFTLElBRFQ7S0FMRjtBQUFBLElBUUEsWUFBQSxFQUFjLEVBUmQ7QUFBQSxJQVNBLFdBQUEsRUFB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QUEsSUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0F4TkY7QUFBQSxFQW1PQSxJQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sTUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsT0FSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0FwT0Y7QUFBQSxFQStPQSxJQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sTUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsT0FSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0FoUEY7QUFBQSxFQTJQQSxHQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sS0FETjtBQUFBLElBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtL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QyxNQUFGLEdBQVcsRUFEWCxDQUFBO0FBQUEsRUFFQSxTQUFBLEdBQVksa0JBRlosQ0FBQTtBQUFBLEVBR0EsQ0FBQSxHQUFJLENBSEosQ0FBQTtBQUtBLFNBQU0sQ0FBQSxHQUFJLEVBQVYsR0FBQTtBQUNFLElBQUEsQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPLFNBQVMsQ0FBQyxNQUFWLENBQWlCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLEdBQWdCLElBQTNCLENBQWpCLEVBQW1ELENBQW5ELENBQVAsQ0FBQTtBQUFBLElBQ0EsQ0FBQSxJQUFLLENBREwsQ0FERjtFQUFBLENBTEE7QUFBQSxFQVFBLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxHQVJSLENBQUE7QUFBQSxFQVNBLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxTQUFTLENBQUMsTUFBVixDQUFpQixDQUFDLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxHQUFULENBQUEsR0FBZ0IsR0FBakMsRUFBc0MsQ0FBdEMsQ0FUUixDQUFBO0FBQUEsRUFVQSxDQUFFLENBQUEsQ0FBQSxDQUFGLEdBQU8sQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsR0FWL0IsQ0FBQTtBQUFBLEVBV0EsSUFBQSxHQUFPLENBQUMsQ0FBQyxJQUFGLENBQU8sRUFBUCxDQVhQLENBQUE7U0FZQSxLQWhCZTtBQUFBLENBUGpCLENBQUE7O0FBQUEsRUF5QkUsQ0FBQyxRQUFILENBQVksWUFBWixFQUEwQixjQUExQixDQXpCQSxDQUFBOztBQUFBLE1BMEJNLENBQUMsT0FBUCxHQUFpQixjQTFCakIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlICcuL29qLmNvZmZlZSdcbnJlcXVpcmUgJy4vb2pJbml0LmNvZmZlZSdcbnJlcXVpcmUgJy4vYXN5bmMvYWpheC5jb2ZmZWUnXG5yZXF1aXJlICcuL2FzeW5jL3Byb21pc2UuY29mZmVlJ1xucmVxdWlyZSAnLi9jb21wb25lbnRzL2dyaWQuY29mZmVlJ1xucmVxdWlyZSAnLi9jb21wb25lbnRzL2lucHV0Z3JvdXAuY29mZmVlJ1xucmVxdWlyZSAnLi9jb21wb25lbnRzL3RhYnMuY29mZmVlJ1xucmVxdWlyZSAnLi9jb21wb25lbnRzL3RpbGUuY29mZmVlJ1xucmVxdWlyZSAnLi9jb250cm9scy9pY29uLmNvZmZlZSdcbnJlcXVpcmUgJy4vY29yZS9kYXRlLmNvZmZlZSdcbnJlcXVpcmUgJy4vY29yZS9mdW5jdGlvbi5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvcmUvbnVtYmVyLmNvZmZlZSdcbnJlcXVpcmUgJy4vY29yZS9vYmplY3QuY29mZmVlJ1xucmVxdWlyZSAnLi9jb3JlL3N0cmluZy5jb2ZmZWUnXG5yZXF1aXJlICcuL2RvbS9ib2R5LmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2NvbXBvbmVudC5jb2ZmZWUnXG5yZXF1aXJlICcuL2RvbS9jb250cm9sLmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2RvbS5jb2ZmZWUnXG5yZXF1aXJlICcuL2RvbS9lbGVtZW50LmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2ZyYWdtZW50LmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2dlbmVyaWNzLmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2lucHV0LmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL25vZGVGYWN0b3J5LmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvYS5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL2JyLmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvZm9ybS5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL2lucHV0LmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvb2wuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy9zZWxlY3QuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy90YWJsZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RleHRhcmVhLmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvdGhlYWQuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy91bC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9idXR0b25pbnB1dC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9jaGVja2JveC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9jb2xvci5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9kYXRlLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2RhdGV0aW1lLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2RhdGV0aW1lbG9jYWwuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvZW1haWwuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvZmlsZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9oaWRkZW4uY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvaW1hZ2VpbnB1dC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9tb250aC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9udW1iZXIuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvcGFzc3dvcmQuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvcmFkaW8uY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvcmFuZ2UuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvcmVzZXQuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvc2VhcmNoLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3N1Ym1pdC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy90ZWwuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvdGV4dGlucHV0LmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3RpbWUuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvdXJsLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3dlZWsuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9hcnJheTJELmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvY29uc29sZS5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2Nvb2tpZS5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2RlZmVyLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvZWFjaC5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2VudW1zLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvZXJyb3IuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9oaXN0b3J5LmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvaXMuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9ub3R5LmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvcHVic3ViLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvcXVlcnlTdHJpbmcuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9yYW5nZXMuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy90by5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL3V1aWQuY29mZmVlJyIsIiMgIyBhamF4XHJcblxyXG5PSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuY29uZmlnID0ge31cclxuICBcclxuIyBkZWZpbmUgYSBzdGFuZGFyZCBvbiBzdWNjZXNzIGhhbmRsZXIsIHdyaXRlIG91dCB0aGUgcmVxdWVzdCBzdGF0cyB0byBhIHRhYmxlXHJcbmNvbmZpZy5vblN1Y2Nlc3MgPSAob3B0cywgZGF0YSwgdXJsKSAtPlxyXG4gIHJlc3BvbnNlID0ge31cclxuICBPSi5leHRlbmQgcmVzcG9uc2UsIGRhdGFcclxuICBvcHRzLm9uU3VjY2VzcyByZXNwb25zZVxyXG4gIGlmIE9KLkxPR19BTExfQUpBWFxyXG4gICAgT0ouY29uc29sZS50YWJsZSBbXHJcbiAgICAgIFdlYnNlcnZpY2U6IG9wdHMuYWpheE9wdHMudXJsXHJcbiAgICAgIFN0YXJ0VGltZTogb3B0cy5zdGFydFRpbWVcclxuICAgICAgRW5kVGltZTogbmV3IERhdGUoKVxyXG4gICAgXSBcclxuICByZXR1cm5cclxuICBcclxuIyBkZWZpbmUgYSBzdGFuZGFyZCBvbiBlcnJvciBoYW5kbGVyLCB3cml0ZSBvdXQgdGhlIHJlcXVlc3QgZXJyb3IgY29uZXh0IHRvIGEgdGFibGVcclxuY29uZmlnLm9uRXJyb3IgPSAoeG1sSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMsIHBhcmFtMSwgb3B0cyA9IE9KLm9iamVjdCgpKSAtPlxyXG4gIGlmIHRleHRTdGF0dXMgaXNudCAnYWJvcnQnXHJcbiAgICBpZiBPSi5MT0dfQUxMX0FKQVhfRVJST1JTXHJcbiAgICAgIE9KLmNvbnNvbGUudGFibGUgW1xyXG4gICAgICAgIFdlYnNlcnZpY2U6IG9wdHMuYWpheE9wdHMudXJsXHJcbiAgICAgICAgRGF0YTogb3B0cy5hamF4T3B0cy5kYXRhXHJcbiAgICAgICAgRmFpbGVkOiB0ZXh0U3RhdHVzXHJcbiAgICAgICAgU3RhdGU6IHhtbEh0dHBSZXF1ZXN0LnN0YXRlKClcclxuICAgICAgICBTdGF0dXM6IHhtbEh0dHBSZXF1ZXN0LnN0YXR1c1xyXG4gICAgICAgIFN0YXR1c1RleHQ6IHhtbEh0dHBSZXF1ZXN0LnN0YXR1c1RleHRcclxuICAgICAgICBSZWFkeVN0YXRlOiB4bWxIdHRwUmVxdWVzdC5yZWFkeVN0YXRlXHJcbiAgICAgICAgUmVzcG9uc2VUZXh0OiB4bWxIdHRwUmVxdWVzdC5yZXNwb25zZVRleHRcclxuICAgICAgXVxyXG5cclxuICAgIG9wdHMub25FcnJvciB0ZXh0U3RhdHVzXHJcbiAgcmV0dXJuXHJcbiAgXHJcbiMgaW4gdGhlIGNhc2Ugd2hlcmUgYG9wdHNgIGlzIGEgc3RyaW5nLCBjb252ZXJ0IGl0IHRvIGFuIG9iamVjdFxyXG5vcHRzRnJvbVVybCA9IChvcHRzKSAtPlxyXG4gIGlmIE9KLmlzLnN0cmluZyBvcHRzXHJcbiAgICB1cmwgPSBvcHRzXHJcbiAgICBvcHRzID0gT0oub2JqZWN0KClcclxuICAgIG9wdHMuYWRkICdhamF4T3B0cycsIE9KLm9iamVjdCgpXHJcbiAgICBvcHRzLmFqYXhPcHRzLmFkZCAndXJsJywgdXJsXHJcbiAgb3B0c1xyXG4gIFxyXG4jIGRlZmluZSBhIHN0YW5kYXJkIGBleGVjYCBtZXRob2QgdG8gaGFuZGxlIGFsbCByZXF1ZXN0IHZlcmJzLiBVc2VzIHRoZSBbalF1ZXJ5LmFqYXhdKGh0dHA6Ly9hcGkuanF1ZXJ5LmNvbS9jYXRlZ29yeS9hamF4LykgQVBJLlxyXG4jIGBleGVjUmVxdWVzdGAgcmV0dXJucyBhIHByb21pc2UgcmVwcmVzZW50IHRoZSBhY3R1YWwgQUpBWCBjYWxsLlxyXG4gIFxyXG4jIC0gYHZlcmJgIGRlZmF1bHQgdmFsdWUgPSAnR0VUJ1xyXG4jIC0gYG9wdHNgIG9iamVjdFxyXG4jIC0tIGBvcHRzLmFqYXhPcHRzYCBvYmplY3QgZm9yIGFsbCBqUXVlcnkncyBhamF4LXNwZWNpZmljIHByb3BlcnRpZXMuXHJcbmNvbmZpZy5leGVjUmVxdWVzdCA9ICh2ZXJiID0gJ0dFVCcsIG9wdHMpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgYWpheE9wdHM6XHJcbiAgICAgIHVybDogJydcclxuICAgICAgZGF0YToge31cclxuICAgICAgdHlwZTogdmVyYlxyXG4gICAgICB4aHJGaWVsZHM6XHJcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXHJcbiAgICAgIGRhdGFUeXBlOiAnanNvbidcclxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG4gICAgICAgIFxyXG4gICAgb25TdWNjZXNzOiBPSi5ub29wXHJcbiAgICBvbkVycm9yOiBPSi5ub29wXHJcbiAgICBvbkNvbXBsZXRlOiBPSi5ub29wXHJcbiAgICBvdmVycmlkZUVycm9yOiBmYWxzZVxyXG4gICAgd2F0Y2hHbG9iYWw6IHRydWVcclxuICAgIHVzZUNhY2hlOiBmYWxzZVxyXG4gICAgXHJcbiAgb3B0cyA9IG9wdHNGcm9tVXJsIG9wdHNcclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdHMsIHRydWVcclxuICAgIFxyXG4gIGRlZmF1bHRzLnN0YXJ0VGltZSA9IG5ldyBEYXRlKClcclxuICAgIFxyXG4gIGlmIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5IGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcclxuICAgICMgR0VUIHJlcXVlc3RzIGV4cGVjdCBxdWVyeVN0cmluZyBwYXJhbWV0ZXJzXHJcbiAgICBpZiBkZWZhdWx0cy5hamF4T3B0cy52ZXJiIGlzICdHRVQnXHJcbiAgICAgIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGEgPSBPSi5wYXJhbXMgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgIyBhbGwgb3RoZXIgcmVxdWVzdHMgdGFrZSBhbiBvYmplY3RcclxuICAgIGVsc2VcclxuICAgICAgZGVmYXVsdHMuYWpheE9wdHMuZGF0YSA9IE9KLnNlcmlhbGl6ZSBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXHJcbiAgICBcclxuICBnZXRKUXVlcnlEZWZlcnJlZCA9ICh3YXRjaEdsb2JhbCkgLT5cclxuICAgIHJldCA9ICQuYWpheCBkZWZhdWx0cy5hamF4T3B0c1xyXG4gICAgICBcclxuICAgIHJldC5kb25lIChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikgLT5cclxuICAgICAgY29uZmlnLm9uU3VjY2VzcyBkZWZhdWx0cywgZGF0YVxyXG5cclxuICAgIHJldC5mYWlsIChqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUZXh0KSAtPlxyXG4gICAgICBjb25maWcub25FcnJvciBqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUZXh0LCBkZWZhdWx0c1xyXG4gIFxyXG4gICAgcmV0LmFsd2F5cyAoeG1sSHR0cFJlcXVlc3QsIHRleHRTdGF0dXMpIC0+XHJcbiAgICAgIGRlZmF1bHRzLm9uQ29tcGxldGUgeG1sSHR0cFJlcXVlc3QsIHRleHRTdGF0dXNcclxuXHJcbiAgICBPSi5hc3luYy5hamF4UHJvbWlzZSByZXRcclxuXHJcbiAgcHJvbWlzZSA9IGdldEpRdWVyeURlZmVycmVkKGRlZmF1bHRzLndhdGNoR2xvYmFsKVxyXG4gIHByb21pc2VcclxuICBcclxuYWpheCA9IHt9XHJcbiAgXHJcbiMgIyMgcG9zdFxyXG4jIFtPSl0ob2ouaHRtbCkuYWpheC5wb3N0OiBpbnNlcnQgYSBuZXcgb2JqZWN0IG9yIGluaXQgYSBmb3JtIHBvc3RcclxuICBcclxuIyAtIGBvcHRzYCBjYW4gYmUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgcmVxdWVzdC5cclxuIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LiBcclxuYWpheC5wb3N0ID0gKG9wdHMpIC0+XHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdQT1NUJywgb3B0c1xyXG4gIFxyXG4jICMjIGdldFxyXG4jIFtPSl0ob2ouaHRtbCkuYWpheC5nZXQ6IGdldCBhbiBleGlzdGluZyBvYmplY3RcclxuICBcclxuIyAtIGBvcHRzYCBjYW4gYmUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgcmVxdWVzdC5cclxuIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxyXG4jXHJcbmFqYXguZ2V0ID0gKG9wdHMpIC0+XHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdHRVQnLCBvcHRzXHJcblxyXG4jICMjIGRlbGV0ZVxyXG4jIFtPSl0ob2ouaHRtbCkuYWpheC5kZWxldGU6IGRlbGV0ZSBhbiBleGlzdGluZyBvYmplY3RcclxuICBcclxuIyAtIGBvcHRzYCBjYW4gYmUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgcmVxdWVzdC5cclxuIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxyXG5hamF4LmRlbGV0ZSA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnREVMRVRFJywgb3B0c1xyXG5cclxuIyAjIyBwdXRcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXgucHV0OiB1cGRhdGUgYW4gZXhpc3Rpbmcgb2JqZWN0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuYWpheC5wdXQgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ1BVVCcsIG9wdHNcclxuXHJcbk9KLmFzeW5jLnJlZ2lzdGVyICdhamF4JywgYWpheFxyXG5tb2R1bGUuZXhwb3J0cyA9IGFqYXgiLCIjICMgcHJvbWlzZVxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMgIyMgYWpheFByb21pc2VcclxuIyBbT0pdKG9qLmh0bWwpLmFzeW5jLmFqYXhQcm9taXNlIGNvbnZlcnRzIGFuIEFKQVggWG1sSHR0cFJlcXVlc3QgaW50byBhIFByb21pc2UuIFxyXG4jIFNlZSBhbHNvIFtQcm9taXNlLnJlc29sdmVdKGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvYmxvYi9tYXN0ZXIvQVBJLm1kKS5cclxuYWpheFByb21pc2UgPSAoYWpheCkgLT4gXHJcbiAgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSBhamF4XHJcbiAgcHJvbWlzZS5hYm9ydCA9IGFqYXguYWJvcnRcclxuICBwcm9taXNlLnJlYWR5U3RhdGUgPSBhamF4LnJlYWR5U3RhdGVcclxuICBwcm9taXNlXHJcblxyXG4jICMjIGFsbFxyXG4jIFtPSl0ob2ouaHRtbCkuYXN5bmMuYWxsIHRha2VzIGFuIGFycmF5IG9mIGZ1bmN0aW9ucyBhbmQgcmV0dXJucyBhIHByb21pc2UgcmVwcmVzZW50aW5nIHRoZSBzdWNjZXNzIG9mIGFsbCBtZXRob2RzIG9yIHRoZSBmYWlsdXJlIG9mIGFueSBtZXRob2QuXHJcbiMgU2VlIGFsc28gW1Byb21pc2UuYWxsXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbmFsbCA9IChpbml0QXJyYXkpIC0+XHJcbiAgcmVxcyA9IGluaXRBcnJheSBvciBbXVxyXG4gIHByb21pc2UgPSBQcm9taXNlLmFsbChyZXFzKVxyXG4gIHByb21pc2UucHVzaCA9IChpdGVtKSAtPlxyXG4gICAgcmVxcy5wdXNoIGl0ZW1cclxuICAgIHJldHVyblxyXG4gIHByb21pc2VcclxuXHJcbiMgIyMgZGVmZXJcclxuIyBbT0pdKG9qLmh0bWwpLmFzeW5jLmRlZmVyIGNvbnZlcnRzIGEgZnVuY3Rpb24gaW50byBhIFByb21pc2UgdG8gZXhlY3V0ZSB0aGF0IGZ1bmN0aW9uLiBcclxuIyBTZWUgYWxzbyBbUHJvbWlzZS5tZXRob2RdKGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvYmxvYi9tYXN0ZXIvQVBJLm1kKS5cclxuZGVmciA9IChmdW5jID0gT0oubm9vcCkgLT5cclxuICByZXQgPSBQcm9taXNlLm1ldGhvZCBmdW5jXHJcbiAgcmV0XHJcbiAgXHJcbiAgXHJcbk9KLmFzeW5jLnJlZ2lzdGVyICdkZWZlcicsIGRlZnJcclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2FsbCcsIGFsbFxyXG5PSi5hc3luYy5yZWdpc3RlciAnYWpheFByb21pc2UnLCBhamF4UHJvbWlzZVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPVxyXG4gIGRlZmVyOiBkZWZyXHJcbiAgYWxsOiBhbGxcclxuICBhamF4UHJvbWlzZTogYWpheFByb21pc2VcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbXBvbmVudCA9IHJlcXVpcmUgJy4uL2RvbS9jb21wb25lbnQnXG5hcnJheTJEID0gcmVxdWlyZSAnLi4vdG9vbHMvYXJyYXkyRCdcblxubm9kZU5hbWUgPSAneC1ncmlkJ1xuY2xhc3NOYW1lID0gJ2dyaWQnXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXG5cbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBkZWZhdWx0cyA9XG4gICAgdGlsZVNpemVzOlxuICAgICAgc21hbGxTcGFuOiAnJ1xuICAgICAgbWVkaXVtU3BhbjogJydcbiAgICAgIGxhcmdlU3BhbjogJydcbiAgICBwcm9wczpcbiAgICAgIGNsYXNzOiAnZ3JpZCdcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgcmV0ID0gY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcblxuICByb3dzID0gW11cbiAgdGlsZXMgPSBhcnJheTJEKClcblxuICBmaWxsTWlzc2luZyA9ICgpIC0+XG4gICAgdGlsZXMuZWFjaCAocm93Tm8sIGNvbE5vLCB2YWwpIC0+XG4gICAgICBpZiBub3QgdmFsXG4gICAgICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cbiAgICAgICAgcm93Lm1ha2UgJ3RpbGUnLCBjb2xObywge31cblxuICByZXQuYWRkICdyb3cnLCAocm93Tm8gPSByb3dzLmxlbmd0aC0xIG9yIDEpLT5cbiAgICBudVJvdyA9IHJvd3Nbcm93Tm8tMV1cbiAgICBpZiBub3QgbnVSb3dcbiAgICAgIHdoaWxlIHJvd3MubGVuZ3RoIDwgcm93Tm9cbiAgICAgICAgbnVSb3cgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAncm93J1xuICAgICAgICByb3dzLnB1c2ggbnVSb3dcbiAgICAgIG51Um93LmFkZCAndGlsZScsIChjb2xObywgb3B0cykgLT5cbiAgICAgICAgb3B0cyA9IE9KLmV4dGVuZCAoT0ouZXh0ZW5kIHt9LCBkZWZhdWx0cy50aWxlU2l6ZXMpLCBvcHRzXG4gICAgICAgIG51VGlsZSA9IE9KLmNvbXBvbmVudHMudGlsZSBvcHRzLCBudVJvd1xuICAgICAgICB0aWxlcy5zZXQgcm93Tm8sIGNvbE5vLCBudVRpbGVcbiAgICAgICAgbnVUaWxlXG4gICAgbnVSb3dcblxuICByZXQuYWRkICd0aWxlJywgKHJvd05vLCBjb2xObywgb3B0cykgLT5cbiAgICBpZiBub3Qgcm93Tm8gb3Igcm93Tm8gPCAxIHRoZW4gcm93Tm8gPSAxXG4gICAgaWYgbm90IGNvbE5vIG9yIGNvbE5vIDwgMSB0aGVuIGNvbE5vID0gMVxuXG4gICAgcm93ID0gcmV0LnJvdyByb3dOb1xuICAgIHRpbGUgPSB0aWxlcy5nZXQgcm93Tm8sIGNvbE5vXG5cbiAgICBpZiBub3QgdGlsZVxuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBjb2xOb1xuICAgICAgICBpICs9IDFcbiAgICAgICAgdHJ5VGlsZSA9IHRpbGVzLmdldCByb3dObywgaVxuICAgICAgICBpZiBub3QgdHJ5VGlsZVxuICAgICAgICAgIGlmIGkgaXMgY29sTm9cbiAgICAgICAgICAgIHRpbGUgPSByb3cubWFrZSAndGlsZScsIG9wdHNcbiAgICAgICAgICBlbHNlIGlmIG5vdCB0aWxlXG4gICAgICAgICAgICByb3cubWFrZSAndGlsZSdcblxuICAgIGZpbGxNaXNzaW5nKClcbiAgICB0aWxlXG5cbiAgcmV0XG5cbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xudXVpZCA9IHJlcXVpcmUgJy4uL3Rvb2xzL3V1aWQnXG5cbm5vZGVOYW1lID0gJ3gtaW5wdXQtZ3JvdXAnXG5jbGFzc05hbWUgPSAnaW5wdXRncm91cCdcblxuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxuXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cbiAgZm9ySWQgPSB1dWlkKClcbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgY2xhc3M6ICdmb3JtLWdyb3VwJ1xuICAgIGV2ZW50czpcbiAgICAgIGNoYW5nZTogT0oubm9vcFxuICAgIGZvcjogZm9ySWRcbiAgICBsYWJlbFRleHQ6ICcnXG4gICAgaW5wdXRPcHRzOlxuICAgICAgcHJvcHM6XG4gICAgICAgIGlkOiBmb3JJZFxuICAgICAgICB0eXBlOiAndGV4dCdcbiAgICAgICAgY2xhc3M6ICcnXG4gICAgICAgIHBsYWNlaG9sZGVyOiAnJ1xuICAgICAgICB2YWx1ZTogJydcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgcmV0ID0gY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcblxuICBncm91cCA9IHJldC5tYWtlICdkaXYnLCBwcm9wczogY2xhc3M6ICdmb3JtLWdyb3VwJ1xuXG4gIHJldC5ncm91cExhYmVsID0gZ3JvdXAubWFrZSAnbGFiZWwnLCBwcm9wczogeyBmb3I6IGZvcklkIH0sIHRleHQ6IGRlZmF1bHRzLmxhYmVsVGV4dFxuXG4gIGRlZmF1bHRzLmlucHV0T3B0cy5wcm9wcy5jbGFzcyArPSAnIGZvcm0tY29udHJvbCdcbiAgcmV0Lmdyb3VwSW5wdXQgPSBncm91cC5tYWtlICdpbnB1dCcsIGRlZmF1bHRzLmlucHV0T3B0c1xuXG4gIHJldC5ncm91cFZhbHVlID0gKCkgLT5cbiAgICByZXQuZ3JvdXBJbnB1dC52YWwoKVxuXG4gIHJldFxuXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcbm1vZHVsZS5leHBvcnRzID0gY21wbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vb2pJbml0J1xuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcblxubm9kZU5hbWUgPSAneC10YWJzJ1xuY2xhc3NOYW1lID0gJ3RhYnMnXG5cbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcblxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XG4gIGRlZmF1bHRzID1cbiAgICB0YWJzOiB7fVxuICAgIHByb3BzOlxuICAgICAgY2xhc3M6ICcnXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG4gIHJldCA9IGNvbXBvbmVudCBkZWZhdWx0cywgb3duZXIsIG5vZGVOYW1lXG5cbiAgdGFicyA9IHJldC5tYWtlICd1bCcsIHByb3BzOiBjbGFzczogJ25hdiBuYXYtdGFicydcbiAgY29udGVudCA9IHJldC5tYWtlICdkaXYnLCBwcm9wczogY2xhc3M6ICd0YWItY29udGVudCdcblxuICBmaXJzdCA9IHRydWVcbiAgT0ouZWFjaCBkZWZhdWx0cy50YWJzLCAodGFiVmFsLCB0YWJOYW1lKSAtPlxuICAgIHRhYkNsYXNzID0gJydcbiAgICBpZiBmaXJzdFxuICAgICAgZmlyc3QgPSBmYWxzZVxuICAgICAgdGFiQ2xhc3MgPSAnYWN0aXZlJ1xuICAgIGEgPSB0YWJzLm1ha2UgJ2xpJywgcHJvcHM6IGNsYXNzOiB0YWJDbGFzc1xuICAgICAgLm1ha2UoJ2EnLFxuICAgICAgICB0ZXh0OiB0YWJOYW1lXG4gICAgICAgIHByb3BzOlxuICAgICAgICAgIGhyZWY6ICcjJyArIHRhYk5hbWVcbiAgICAgICAgICAnZGF0YS10b2dnbGUnOiAndGFiJ1xuICAgICAgICBldmVudHM6XG4gICAgICAgICAgY2xpY2s6IC0+XG4gICAgICAgICAgICBhLiQudGFiICdzaG93JylcblxuICAgIHRhYkNvbnRlbnRDbGFzcyA9ICd0YWItcGFuZSAnICsgdGFiQ2xhc3NcbiAgICByZXQuYWRkIHRhYk5hbWUsIGNvbnRlbnQubWFrZSgnZGl2JywgcHJvcHM6IGNsYXNzOiB0YWJDb250ZW50Q2xhc3MsIGlkOiB0YWJOYW1lKVxuXG4gIHJldFxuXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcbm1vZHVsZS5leHBvcnRzID0gY21wbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vb2pJbml0J1xuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcblxubm9kZU5hbWUgPSAneC10aWxlJ1xuY2xhc3NOYW1lID0gJ3RpbGUnXG5cbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcbiAgXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cbiAgZGVmYXVsdHMgPVxuICAgIHdpZHRoOlxuICAgICAgeHM6ICcnXG4gICAgICBzbTogJydcbiAgICAgIG1kOiAnJ1xuICAgICAgbGc6ICcnXG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJ3RpbGUnXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG4gIGlmIGRlZmF1bHRzLndpZHRoLnhzIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wteHMtJyArIGRlZmF1bHRzLndpZHRoLnhzXG4gIGlmIGRlZmF1bHRzLndpZHRoLnNtIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wtc20tJyArIGRlZmF1bHRzLndpZHRoLnNtXG4gIGlmIGRlZmF1bHRzLndpZHRoLm1kIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wtbWQtJyArIGRlZmF1bHRzLndpZHRoLm1kXG4gIGlmIGRlZmF1bHRzLndpZHRoLmxnIHRoZW4gZGVmYXVsdHMucHJvcHMuY2xhc3MgKz0gJyBjb2wtbGctJyArIGRlZmF1bHRzLndpZHRoLmxnXG5cbiAgcmV0ID0gT0ouY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcbiAgcmV0XG5cbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb250cm9sID0gcmVxdWlyZSAnLi4vZG9tL2NvbnRyb2wnXG5cbmNvbnRyb2xOYW1lID0gJ3ktaWNvbidcbmZyaWVuZGx5TmFtZSA9ICdpY29uJ1xuXG5PSi5jb250cm9scy5tZW1iZXJzW2ZyaWVuZGx5TmFtZV0gPSBjb250cm9sTmFtZVxuXG5jbnRybCA9IChvcHRpb25zLCBvd25lcikgLT5cbiAgZGVmYXVsdHMgPVxuICAgIGljb25PcHRzOlxuICAgICAgbmFtZTogJydcbiAgICAgIHN0YWNrZWRJY29uOiAnJ1xuICAgICAgc3dhcEljb246ICcnXG4gICAgICBzaXplOiBmYWxzZVxuICAgICAgY29sb3I6ICcnXG4gICAgICBsaWJyYXJ5OiAnJ1xuICAgICAgaXNGaXhlZFdpZHRoOiBmYWxzZVxuICAgICAgaXNMaXN0OiBmYWxzZVxuICAgICAgaXNTcGlubmVyOiBmYWxzZVxuICAgIHByb3BzOlxuICAgICAgY2xhc3M6ICcnXG4gICAgcm9vdE5vZGVUeXBlOiAnc3BhbidcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnNcbiAgcmV0ID0gY29udHJvbCBkZWZhdWx0cywgb3duZXIsIGNvbnRyb2xOYW1lXG5cbiAgaXNUb2dnbGVkID0gZmFsc2VcblxuICAjVE9ETzogU3VwcG9ydCBmb3IgcGljdG9pY29uc1xuICAjVE9ETzogU3VwcG9ydCBmb3Igb3RoZXIgRm9udEF3ZXNvbWUgcHJvcGVydGllcyAoc3RhY2ssIHJvdGF0ZSwgc2l6ZSwgZXRjKVxuXG4gIGNsYXNzTmFtZUJhc2UgPSAnZmEgJ1xuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc0ZpeGVkV2lkdGggdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1mdyAnXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzTGlzdCB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLWxpICdcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuaXNTcGlubmVyIHRoZW4gY2xhc3NOYW1lQmFzZSArPSAnZmEtc3BpbiAnXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLnNpemVcbiAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zaXplID4gMSBhbmQgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSA8PSA1XG4gICAgICBjbGFzc05hbWVCYXNlICs9ICdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSArICd4ICdcblxuICBjbGFzc05hbWUgPSBjbGFzc05hbWVCYXNlICsgJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5uYW1lXG4gIHJldC5teUljb24gPSByZXQubWFrZSAnaScsIHByb3BzOiBjbGFzczogY2xhc3NOYW1lXG5cbiAgI1RvZ2dsZXMgZGlzcGxheSBiZXR3ZWVuIG5vcm1hbCBpY29uIGFuZCBzd2FwIGljb24sIGlmIGEgc3dhcCBpY29uIGhhcyBiZWVuIHNwZWNpZmllZFxuICByZXQudG9nZ2xlSWNvbiA9IC0+XG4gICAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuc3dhcEljb25cbiAgICAgIG5ld0ljb24gPSBkZWZhdWx0cy5pY29uT3B0cy5uYW1lXG5cbiAgICAgIGlzVG9nZ2xlZCA9ICFpc1RvZ2dsZWRcblxuICAgICAgaWYgaXNUb2dnbGVkXG4gICAgICAgIHJldC5teUljb24uJC5yZW1vdmVDbGFzcygnZmEtJyArIG5ld0ljb24pXG4gICAgICAgIG5ld0ljb24gPSBkZWZhdWx0cy5pY29uT3B0cy5zd2FwSWNvblxuICAgICAgZWxzZVxuICAgICAgICByZXQubXlJY29uLiQucmVtb3ZlQ2xhc3MoJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5zd2FwSWNvbilcblxuICAgICAgcmV0Lm15SWNvbi4kLmFkZENsYXNzKCdmYS0nICsgbmV3SWNvbilcblxuXG4gIHJldFxuXG5PSi5jb250cm9scy5yZWdpc3RlciBmcmllbmRseU5hbWUsIGNudHJsXG5tb2R1bGUuZXhwb3J0cyA9IGNudHJsIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbmdldERhdGVGcm9tRG5Kc29uID0gKGRuRGF0ZSkgLT5cclxuICAgIFxyXG4gICMgVHJhbnNmb3JtcyBhIC5ORVQgSlNPTiBkYXRlIGludG8gYSBKYXZhU2NyaXB0IGRhdGUuXHJcbiAgIyBuYW1lPSdvYmonICBPYmplY3QgdG8gdGVzdFxyXG4gICMgdHlwZT0nQm9vbGVhbicgLz5cclxuICAjXHJcbiAgIyAgICAgICB2YXIgbWlsbGkgPSBPSi50by5udW1iZXIoRG5EYXRlLnJlcGxhY2UoL1xcL0RhdGVcXCgoXFxkKylcXC0/KFxcZCspXFwpXFwvLywgJyQxJykpO1xyXG4gICMgICAgICAgdmFyIG9mZnNldCA9IE9KLnRvLm51bWJlcihEbkRhdGUucmVwbGFjZSgvXFwvRGF0ZVxcKFxcZCsoW1xcK1xcLV0/XFxkKylcXClcXC8vLCAnJDEnKSk7XHJcbiAgIyAgICAgICB2YXIgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KCk7XHJcbiAgIyAgICAgICByZXR1cm4gbmV3IERhdGUoKG1pbGxpIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKTtcclxuICAjICAgICAgIFxyXG4gICAgXHJcbiAgIyBEbiBEYXRlIHdpbGwgbG9vayBsaWtlIC9EYXRlKDEzMzU3NTg0MDAwMDAtMDQwMCkvICBcclxuICBkbkRhdGVTdHIgPSBPSi50by5zdHJpbmcoZG5EYXRlKVxyXG4gIHJldCA9IHVuZGVmaW5lZFxyXG4gIHRpY2tzID0gdW5kZWZpbmVkXHJcbiAgb2Zmc2V0ID0gdW5kZWZpbmVkXHJcbiAgbG9jYWxPZmZzZXQgPSB1bmRlZmluZWRcclxuICBhcnIgPSB1bmRlZmluZWRcclxuICByZXQgPSBPSi5kYXRlVGltZU1pblZhbHVlXHJcbiAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkoZG5EYXRlU3RyKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJy8nLCAnJylcclxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCdEYXRlJywgJycpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnKCcsICcnKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJyknLCAnJylcclxuICAgIGFyciA9IGRuRGF0ZVN0ci5zcGxpdCgnLScpXHJcbiAgICBpZiBhcnIubGVuZ3RoID4gMVxyXG4gICAgICB0aWNrcyA9IE9KLnRvLm51bWJlcihhcnJbMF0pXHJcbiAgICAgIG9mZnNldCA9IE9KLnRvLm51bWJlcihhcnJbMV0pXHJcbiAgICAgIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpXHJcbiAgICAgIHJldCA9IG5ldyBEYXRlKCh0aWNrcyAtICgobG9jYWxPZmZzZXQgKyAob2Zmc2V0IC8gMTAwICogNjApKSAqIDEwMDApKSlcclxuICAgIGVsc2UgaWYgYXJyLmxlbmd0aCBpcyAxXHJcbiAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcclxuICAgICAgcmV0ID0gbmV3IERhdGUodGlja3MpXHJcbiAgcmV0XHJcblxyXG4gIE9KLnJlZ2lzdGVyICdnZXREYXRlRnJvbURuSnNvbicsIGdldERhdGVGcm9tRG5Kc29uXHJcbiAgbW9kdWxlcy5leHBvcnRzID0gZ2V0RGF0ZUZyb21Ebkpzb25cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMgV3JhcCB0aGUgZXhlY3V0aW9uIG9mIGEgbWV0aG9kIGluIGEgdHJ5Li5jYXRjaC4uZmluYWxseSAgICAgXHJcbiMgaWdub3JlIGVycm9ycyBmYWlsaW5nIHRvIGV4ZWMgc2VsZi1leGVjdXRpbmcgZnVuY3Rpb25zIFxyXG4jIFJldHVybiBhIG1ldGhvZCB3cmFwcGVkIGluIGEgdHJ5Li5jYXRjaC4uZmluYWxseVxyXG50cnlFeGVjID0gKHRyeUZ1bmMpIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgcmV0ID0gZmFsc2VcclxuICB0aGF0ID0gdGhpc1xyXG4gIHRyeVxyXG4gICAgcmV0ID0gdHJ5RnVuYy5hcHBseSh0aGF0LCBBcnJheTo6c2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKSAgaWYgT0ouaXMubWV0aG9kKHRyeUZ1bmMpXHJcbiAgY2F0Y2ggZXhjZXB0aW9uXHJcbiAgICBpZiAoZXhjZXB0aW9uLm5hbWUgaXMgJ1R5cGVFcnJvcicgb3IgZXhjZXB0aW9uLnR5cGUgaXMgJ2NhbGxlZF9ub25fY2FsbGFibGUnKSBhbmQgZXhjZXB0aW9uLnR5cGUgaXMgJ25vbl9vYmplY3RfcHJvcGVydHlfbG9hZCdcclxuICAgICAgT0ouY29uc29sZS5pbmZvICdJZ25vcmluZyBleGNlcHRpb246ICcsIGV4Y2VwdGlvblxyXG4gICAgZWxzZVxyXG4gICAgICBPSi5jb25zb2xlLmVycm9yIGV4Y2VwdGlvblxyXG4gIGZpbmFsbHlcclxuXHJcbiAgcmV0XHJcblxyXG5cclxuIG1ldGhvZCA9ICh0cnlGdW5jKSAtPlxyXG4gICd1c2Ugc3RyaWN0J1xyXG4gIHRoYXQgPSB0aGlzXHJcbiAgLT5cclxuICAgIGFyZ3MgPSBBcnJheTo6c2xpY2UuY2FsbChhcmd1bWVudHMsIDApXHJcbiAgICBhcmdzLnVuc2hpZnQgdHJ5RnVuY1xyXG4gICAgT0oudHJ5RXhlYy5hcHBseSB0aGF0LCBhcmdzXHJcblxyXG4gIFxyXG4gXHJcbiBPSi5yZWdpc3RlciAnbWV0aG9kJywgbWV0aG9kXHJcbiBPSi5yZWdpc3RlciAndHJ5RXhlYycsIHRyeUV4ZWNcclxuIG1vZHVsZS5leHBvcnRzID1cclxuICBtZXRob2Q6IG1ldGhvZFxyXG4gIHRyeUV4ZWM6IHRyeUV4ZWNcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbm51bWJlciA9IE9iamVjdC5jcmVhdGUobnVsbClcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdpc05hTicsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuaXNOYU4pIHRoZW4gTnVtYmVyLmlzTmFOIGVsc2UgaXNOYU4pXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnaXNGaW5pdGUnLFxyXG4gIHZhbHVlOiAoaWYgKE51bWJlciBhbmQgTnVtYmVyLmlzRmluaXRlKSB0aGVuIE51bWJlci5pc0Zpbml0ZSBlbHNlIGlzRmluaXRlKVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ01BWF9WQUxVRScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuTUFYX1ZBTFVFKSB0aGVuIE51bWJlci5NQVhfVkFMVUUgZWxzZSAxLjc5NzY5MzEzNDg2MjMxNTdlKzMwOClcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdNSU5fVkFMVUUnLFxyXG4gIHZhbHVlOiAoaWYgKE51bWJlciBhbmQgTnVtYmVyLk1JTl9WQUxVRSkgdGhlbiBOdW1iZXIuTUlOX1ZBTFVFIGVsc2UgNWUtMzI0KVxyXG5cclxuT0oucmVnaXN0ZXIgJ251bWJlcicsIG51bWJlclxyXG5tb2R1bGUuZXhwb3J0cyA9IG51bWJlciIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbmlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXG5wcm9wZXJ0eSA9IHJlcXVpcmUgJy4vcHJvcGVydHknXG5cbmZ1bmMgPSByZXF1aXJlICcuL2Z1bmN0aW9uJ1xuXG4jICMgb2JqZWN0XG5cbnJldE9iaiA9IFxuXG4gICMgIyMgW09KXShvai5odG1sKS5vYmplY3RcbiAgIyBjcmVhdGUgYW4gb2JqZWN0IHdpdGggaGVscGVyIGBhZGRgIGFuZCBgZWFjaGAgbWV0aG9kcy5cbiAgb2JqZWN0OiAob2JqID0ge30pIC0+XG4gICAgXG4gICAgIyMjXG4gICAgQWRkIGEgcHJvcGVydHkgdG8gdGhlIG9iamVjdCBhbmQgcmV0dXJuIGl0XG4gICAgIyMjXG4gICAgb2JqLmFkZCA9IChuYW1lLCB2YWwpIC0+XG4gICAgICBwcm9wZXJ0eSBvYmosIG5hbWUsIHZhbFxuICAgICAgb2JqXG5cbiAgICBvYmouYWRkICdlYWNoJywgKGNhbGxiYWNrKSAtPlxyXG4gICAgICBlYWNoID0gcmVxdWlyZSAnLi4vdG9vbHMvZWFjaCdcbiAgICAgIGVhY2ggb2JqLCAodmFsLCBrZXkpIC0+XG4gICAgICAgIGlmIGtleSBpc250ICdlYWNoJyBhbmQga2V5IGlzbnQgJ2FkZCdcbiAgICAgICAgICBjYWxsYmFjayB2YWwsIGtleVxuXG4gICAgb2JqXG5cblxuICAjICMjIFtPSl0ob2ouaHRtbCkuaXNJbnN0YW5jZU9mXG4gICMgZGV0ZXJtaW5lcyBpcyBhIHRoaW5nIGlzIGFuIGluc3RhbmNlIG9mIGEgVGhpbmcsIGFzc3VtaW5nIHRoZSB0aGluZ3Mgd2VyZSBhbGwgY3JlYXRlZCBpbiBPSlxuICBpc0luc3RhbmNlT2Y6IChuYW1lLCBvYmopIC0+XG4gICAgdG8gPSByZXF1aXJlICcuLi90b29scy90bydcbiAgICByZXRPYmouY29udGFpbnMobmFtZSwgb2JqKSBhbmQgdG8uYm9vbChvYmpbbmFtZV0pXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmNvbnRhaW5zXG4gICMgdHJ1ZSBpZiB0aGUgYG9iamVjdGAgY29udGFpbnMgdGhlIHZhbHVlXG4gIGNvbnRhaW5zOiAob2JqZWN0LCBpbmRleCkgLT5cbiAgICByZXQgPSBmYWxzZVxuICAgIGlmIG9iamVjdFxuICAgICAgcmV0ID0gXy5jb250YWlucyBvYmplY3QsIGluZGV4XG4gICAgcmV0XG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmNvbXBhcmVcbiAgIyBjb21wYXJlIHR3byBvYmplY3RzL2FycmF5cy92YWx1ZXMgZm9yIHN0cmljdCBlcXVhbGl0eVxuICBjb21wYXJlOiAob2JqMSwgb2JqMikgLT5cbiAgICBfLmlzRXF1YWwgb2JqMSwgb2JqMlxuXG4gICMgIyMgW09KXShvai5odG1sKS5jbG9uZVxuICAjIGNvcHkgYWxsIG9mIHRoZSB2YWx1ZXMgKHJlY3Vyc2l2ZWx5KSBmcm9tIG9uZSBvYmplY3QgdG8gYW5vdGhlci5cbiAgY2xvbmU6IChkYXRhKSAtPlxuICAgIF8uY2xvbmVEZWVwIGRhdGEgdHJ1ZVxuXG4gICMgIyMgW09KXShvai5odG1sKS5zZXJpYWxpemVcbiAgIyBDb252ZXJ0IGFuIG9iamVjdCB0byBhIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIG9iamVjdFxuICBzZXJpYWxpemU6IChkYXRhKSAtPlxuICAgIHJldCA9ICcnXG4gICAgZnVuYy50cnlFeGVjIC0+XG4gICAgICByZXQgPSBKU09OLnN0cmluZ2lmeShkYXRhKVxuICAgICAgcmV0dXJuXG4gICAgcmV0IG9yICcnXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmRlc2VyaWFsaXplXG4gICMgQ29udmVydCBhIEpTT04gc3RyaW5nIHRvIGFuIG9iamVjdFxuICBkZXNlcmlhbGl6ZTogKGRhdGEpIC0+XG4gICAgcmV0ID0ge31cbiAgICBpZiBkYXRhXG4gICAgICBmdW5jLnRyeUV4ZWMgLT5cbiAgICAgICAgcmV0ID0gJC5wYXJzZUpTT04oZGF0YSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHJldCA9IHt9ICBpZiBpc01ldGhvZC5udWxsT3JFbXB0eShyZXQpXG4gICAgcmV0XG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLnBhcmFtc1xuICAjIENvbnZlcnQgYW4gb2JqZWN0IHRvIGEgZGVsaW1pdGVkIGxpc3Qgb2YgcGFyYW1ldGVycyAobm9ybWFsbHkgcXVlcnktc3RyaW5nIHBhcmFtZXRlcnMpXG4gIHBhcmFtczogKGRhdGEsIGRlbGltaXRlciA9ICcmJykgLT5cbiAgICByZXQgPSAnJ1xuICAgIGlmIGRlbGltaXRlciBpcyAnJidcbiAgICAgIGZ1bmMudHJ5RXhlYyAtPlxuICAgICAgICByZXQgPSAkLnBhcmFtKGRhdGEpXG4gICAgICAgIHJldHVyblxuXG4gICAgZWxzZVxyXG4gICAgICBlYWNoID0gcmVxdWlyZSAnLi4vdG9vbHMvZWFjaCdcbiAgICAgIGVhY2ggZGF0YSwgKHZhbCwga2V5KSAtPlxuICAgICAgICByZXQgKz0gZGVsaW1pdGVyICBpZiByZXQubGVuZ3RoID4gMFxuICAgICAgICByZXQgKz0ga2V5ICsgJz0nICsgdmFsXG4gICAgICAgIHJldHVyblxuXG4gICAgdG8uc3RyaW5nIHJldFxuXG4gICMgIyMgW09KXShvai5odG1sKS5leHRlbmRcbiAgIyBjb3B5IHRoZSBwcm9wZXJ0aWVzIG9mIG9uZSBvYmplY3QgdG8gYW5vdGhlciBvYmplY3RcbiAgZXh0ZW5kOiAoZGVzdE9iaiwgc3JjT2JqLCBkZWVwQ29weSA9IGZhbHNlKSAtPlxuICAgIHJldCA9IGRlc3RPYmogb3Ige31cbiAgICBpZiBkZWVwQ29weSBpcyB0cnVlXG4gICAgICByZXQgPSAkLmV4dGVuZChkZWVwQ29weSwgcmV0LCBzcmNPYmopXG4gICAgZWxzZVxuICAgICAgcmV0ID0gJC5leHRlbmQocmV0LCBzcmNPYmopXG4gICAgcmV0XG5cblxuT0oucmVnaXN0ZXIgJ29iamVjdCcsIHJldE9iai5vYmplY3Rcbk9KLnJlZ2lzdGVyICdpc0luc3RhbmNlT2YnLCByZXRPYmouaXNJbnN0YW5jZU9mXG5PSi5yZWdpc3RlciAnY29udGFpbnMnLCByZXRPYmouY29udGFpbnNcbk9KLnJlZ2lzdGVyICdjb21wYXJlJywgcmV0T2JqLmNvbXBhcmVcbk9KLnJlZ2lzdGVyICdjbG9uZScsIHJldE9iai5jbG9uZVxuT0oucmVnaXN0ZXIgJ3NlcmlhbGl6ZScsIHJldE9iai5zZXJpYWxpemVcbk9KLnJlZ2lzdGVyICdkZXNlcmlhbGl6ZScsIHJldE9iai5kZXNlcmlhbGl6ZVxuT0oucmVnaXN0ZXIgJ3BhcmFtcycsIHJldE9iai5wYXJhbXNcbk9KLnJlZ2lzdGVyICdleHRlbmQnLCByZXRPYmouZXh0ZW5kXG5cbm1vZHVsZS5leHBvcnRzID0gcmV0T2JqIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuIyMjXHJcbkFkZCBhIHByb3BlcnR5IHRvIGFuIG9iamVjdFxyXG4gIFxyXG4jIyNcclxucHJvcGVydHkgPSAob2JqLCBuYW1lLCB2YWx1ZSwgd3JpdGFibGUsIGNvbmZpZ3VyYWJsZSwgZW51bWVyYWJsZSkgLT5cclxuICB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBkZWZpbmUgYSBwcm9wZXJ0eSB3aXRob3V0IGFuIE9iamVjdC4nICB1bmxlc3Mgb2JqXHJcbiAgdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIGEgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIHByb3BlcnR5IG5hbWUuJyAgdW5sZXNzIG5hbWU/XHJcbiAgb2JqW25hbWVdID0gdmFsdWVcclxuICBvYmpcclxuXHJcbk9KLnJlZ2lzdGVyICdwcm9wZXJ0eScsIHByb3BlcnR5XHJcbm1vZHVsZS5leHBvcnRzID0gcHJvcGVydHkiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5kZWxpbWl0ZWRTdHJpbmcgPSAoc3RyaW5nLCBvcHRzKSAtPlxyXG4gIGRlZmF1bHRzID1cclxuICAgIG5ld0xpbmVUb0RlbGltaXRlcjogdHJ1ZVxyXG4gICAgc3BhY2VUb0RlbGltaXRlcjogdHJ1ZVxyXG4gICAgcmVtb3ZlRHVwbGljYXRlczogdHJ1ZVxyXG4gICAgZGVsaW1pdGVyOiBcIixcIlxyXG4gICAgaW5pdFN0cmluZzogT0oudG8uc3RyaW5nIHN0cmluZ1xyXG5cclxuICByZXRPYmogPVxyXG4gICAgYXJyYXk6IFtdXHJcbiAgICBkZWxpbWl0ZWQ6IC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5qb2luIGRlZmF1bHRzLmRlbGltaXRlclxyXG5cclxuICAgIHN0cmluZzogKGRlbGltaXRlciA9IGRlZmF1bHRzLmRlbGltaXRlcikgLT5cclxuICAgICAgcmV0ID0gJydcclxuICAgICAgT0ouZWFjaCByZXRPYmouYXJyYXksICh2YWwpIC0+XHJcbiAgICAgICAgcmV0ICs9IGRlbGltaXRlciAgaWYgcmV0Lmxlbmd0aCA+IDBcclxuICAgICAgICByZXQgKz0gdmFsXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICByZXRcclxuXHJcbiAgICB0b1N0cmluZzogLT5cclxuICAgICAgcmV0T2JqLnN0cmluZygpXHJcblxyXG4gICAgYWRkOiAoc3RyKSAtPlxyXG4gICAgICByZXRPYmouYXJyYXkucHVzaCBkZWZhdWx0cy5wYXJzZShzdHIpXHJcbiAgICAgIGRlZmF1bHRzLmRlbGV0ZUR1cGxpY2F0ZXMoKVxyXG4gICAgICByZXRPYmpcclxuXHJcbiAgICByZW1vdmU6IChzdHIpIC0+XHJcbiAgICAgIHJlbW92ZSA9IChhcnJheSkgLT5cclxuICAgICAgICBhcnJheS5maWx0ZXIgKGl0ZW0pIC0+XHJcbiAgICAgICAgICB0cnVlICBpZiBpdGVtIGlzbnQgc3RyXHJcblxyXG5cclxuICAgICAgcmV0T2JqLmFycmF5ID0gcmVtb3ZlKHJldE9iai5hcnJheSlcclxuICAgICAgcmV0T2JqXHJcblxyXG4gICAgY291bnQ6IC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5sZW5ndGhcclxuXHJcbiAgICBjb250YWluczogKHN0ciwgY2FzZVNlbnNpdGl2ZSkgLT5cclxuICAgICAgaXNDYXNlU2Vuc2l0aXZlID0gT0oudG8uYm9vbChjYXNlU2Vuc2l0aXZlKVxyXG4gICAgICBzdHIgPSBPSi50by5zdHJpbmcoc3RyKS50cmltKClcclxuICAgICAgc3RyID0gc3RyLnRvTG93ZXJDYXNlKCkgIGlmIGZhbHNlIGlzIGlzQ2FzZVNlbnNpdGl2ZVxyXG4gICAgICBtYXRjaCA9IHJldE9iai5hcnJheS5maWx0ZXIoKG1hdFN0cikgLT5cclxuICAgICAgICAoaXNDYXNlU2Vuc2l0aXZlIGFuZCBPSi50by5zdHJpbmcobWF0U3RyKS50cmltKCkgaXMgc3RyKSBvciBPSi50by5zdHJpbmcobWF0U3RyKS50cmltKCkudG9Mb3dlckNhc2UoKSBpcyBzdHJcclxuICAgICAgKVxyXG4gICAgICBtYXRjaC5sZW5ndGggPiAwXHJcblxyXG4gICAgZWFjaDogKGNhbGxCYWNrKSAtPlxyXG4gICAgICByZXRPYmouYXJyYXkuZm9yRWFjaCBjYWxsQmFja1xyXG5cclxuICBkZWZhdWx0cy5wYXJzZSA9IChzdHIpIC0+XHJcbiAgICByZXQgPSBPSi50by5zdHJpbmcoc3RyKVxyXG4gICAgcmV0ID0gcmV0LnJlcGxhY2UoL1xcbi9nLCBkZWZhdWx0cy5kZWxpbWl0ZXIpICB3aGlsZSByZXQuaW5kZXhPZihcIlxcblwiKSBpc250IC0xICBpZiBkZWZhdWx0cy5uZXdMaW5lVG9EZWxpbWl0ZXJcclxuICAgIHJldCA9IHJldC5yZXBsYWNlKFJlZ0V4cChcIiBcIiwgXCJnXCIpLCBkZWZhdWx0cy5kZWxpbWl0ZXIpICB3aGlsZSByZXQuaW5kZXhPZihcIiBcIikgaXNudCAtMSAgaWYgZGVmYXVsdHMuc3BhY2VUb0RlbGltaXRlclxyXG4gICAgcmV0ID0gcmV0LnJlcGxhY2UoLywsL2csIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiLCxcIikgaXNudCAtMVxyXG4gICAgcmV0XHJcblxyXG4gIGRlZmF1bHRzLmRlbGV0ZUR1cGxpY2F0ZXMgPSAtPlxyXG4gICAgaWYgZGVmYXVsdHMucmVtb3ZlRHVwbGljYXRlc1xyXG4gICAgICAoLT5cclxuICAgICAgICB1bmlxdWUgPSAoYXJyYXkpIC0+XHJcbiAgICAgICAgICBzZWVuID0gbmV3IFNldCgpXHJcbiAgICAgICAgICBhcnJheS5maWx0ZXIgKGl0ZW0pIC0+XHJcbiAgICAgICAgICAgIGlmIGZhbHNlIGlzIHNlZW4uaGFzKGl0ZW0pXHJcbiAgICAgICAgICAgICAgc2Vlbi5hZGQgaXRlbVxyXG4gICAgICAgICAgICAgIHRydWVcclxuXHJcblxyXG4gICAgICAgIHJldE9iai5hcnJheSA9IHVuaXF1ZShyZXRPYmouYXJyYXkpXHJcbiAgICAgICAgcmV0dXJuXHJcbiAgICAgICkoKVxyXG4gICAgcmV0dXJuXHJcblxyXG4gICgoYSkgLT5cclxuICAgIGlmIGEubGVuZ3RoID4gMSBhbmQgZmFsc2UgaXMgT0ouaXMucGxhaW5PYmplY3Qob3B0cylcclxuICAgICAgT0ouZWFjaCBhLCAodmFsKSAtPlxyXG4gICAgICAgIHJldE9iai5hcnJheS5wdXNoIHZhbCAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkodmFsKVxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgIGVsc2UgaWYgc3RyaW5nIGFuZCBzdHJpbmcubGVuZ3RoID4gMFxyXG4gICAgICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdHNcclxuICAgICAgZGVsaW1pdGVkU3RyaW5nID0gZGVmYXVsdHMucGFyc2Uoc3RyaW5nKVxyXG4gICAgICBkZWZhdWx0cy5pbml0U3RyaW5nID0gZGVsaW1pdGVkU3RyaW5nXHJcbiAgICAgIHJldE9iai5hcnJheSA9IGRlbGltaXRlZFN0cmluZy5zcGxpdChkZWZhdWx0cy5kZWxpbWl0ZXIpXHJcbiAgICBkZWZhdWx0cy5kZWxldGVEdXBsaWNhdGVzKClcclxuICAgIHJldHVyblxyXG4gICkgYXJndW1lbnRzXHJcbiAgcmV0T2JqXHJcblxyXG5cclxuT0oucmVnaXN0ZXIgJ2RlbGltaXRlZFN0cmluZycsIGRlbGltaXRlZFN0cmluZ1xyXG5tb2R1bGUuZXhwb3J0cyA9IGRlbGltaXRlZFN0cmluZyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xucmVxdWlyZSAndGhpbmRvbSdcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcbmVsZW1lbnQgPSByZXF1aXJlICcuL2VsZW1lbnQnXG5kb20gPSByZXF1aXJlICcuL2RvbSdcblxuXG4jIyNcblBlcnNpc3QgYSBoYW5kbGUgb24gdGhlIGJvZHkgbm9kZVxuIyMjXG5pZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJyB0aGVuIGJvZHkgPSBkb2N1bWVudC5ib2R5IGVsc2UgYm9keSA9IG51bGxcbnRoaW5Cb2R5ID0gbmV3IFRoaW5ET00gbnVsbCwgaWQ6ICdib2R5JywgYm9keVxudGhpbkJvZHkuaXNJbkRPTSA9IHRydWVcbnRoaW5Cb2R5LmdldElkID0gLT5cbiAgJ2JvZHknXG5cbmVsZW1lbnQuZmluYWxpemUgdGhpbkJvZHksICdib2R5J1xudGhpbkJvZHkuY291bnQgPSAwXG50aGluQm9keS5yb290ID0gbnVsbFxuZG9tIHRoaW5Cb2R5LCBudWxsXG5ub2RlRmFjdG9yeS5hZGRNYWtlTWV0aG9kIHRoaW5Cb2R5LCAwXG50aGluQm9keS5pc0Z1bGx5SW5pdCA9IHRydWUgIFxuICBcbk9KLnJlZ2lzdGVyICdib2R5JywgdGhpbkJvZHlcbm1vZHVsZS5leHBvcnRzID0gdGhpbkJvZHkiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuZWwgPSByZXF1aXJlICcuL2VsZW1lbnQnXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcblxuIyAjIGNvbXBvbmVudFxuXG5cbiMgQ3JlYXRlIGFuIEhUTUwgV2ViIENvbXBvbmVudCB0aHJvdWdoIFRoaW5Eb21cblxuIyAtIGBvcHRpb25zYCBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzdGFuZGFyZCBvcHRpb25zIHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBjb21wb25lbnRcbiMgLS0gYHJvb3ROb2RlVHlwZWA6IHRoZSB0YWcgbmFtZSBvZiB0aGUgcm9vdCBub2RlIHRvIGNyZWF0ZSwgZGVmYXVsdCA9ICdkaXYnXG4jIC0tIGBwcm9wc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIERPTSBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXG4jIC0tIGBzdHlsZXNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBDU1MgYXR0cmlidXRlcyB0byBhcHBlbmQgdG8gdGhlIHJvb3Qgbm9kZVxuIyAtLSBgZXZlbnRzYDogYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgbmFtZWQgRE9NIGV2ZW50cyAoYW5kIGNvcnJlc3BvbmRpbmcgY2FsbGJhY2sgbWV0aG9kcykgdG8gYmluZCB0byB0aGUgcm9vdCBub2RlXG4jIC0gYG93bmVyYCB0aGUgcGFyZW50IHRvIHdoaWNoIHRoZSBjb21wb25lbnQgbm9kZSB3aWxsIGJlIGFwcGVuZGVkXG4jIC0gYHRhZ05hbWVgIHRoZSBuYW1lIG9mIG9mIHRoZSBjb21wb25lbnQsIHdoaWNoIHdpbGwgYWx3YXlzIGJlIHByZWZpeGVkIHdpdGggJ3gtJ1xuY29tcG9uZW50ID0gKG9wdGlvbnMgPSBvYmoub2JqZWN0KCksIG93bmVyLCB0YWdOYW1lKSAtPlxuXG4gIGlmIG5vdCB0YWdOYW1lLnN0YXJ0c1dpdGggJ3gtJyB0aGVuIHRhZ05hbWUgPSAneC0nICsgdGFnTmFtZVxuICAjIHdlYiBjb21wb25lbnRzIGFyZSByZWFsbHkganVzdCBvcmRpbmFyeSBPSiBbZWxlbWVudF0oZWxlbWVudC5odG1sKSdzIHdpdGggYSBzcGVjaWFsIG5hbWUuXG4gICMgVW50aWwgSFRNTCBXZWIgQ29tcG9uZW50cyBhcmUgZnVsbHkgc3VwcG9ydGVkIChhbmQgT0ogaXMgcmVmYWN0b3JlZCBhY2NvcmRpbmdseSksIHRoZSBlbGVtZW50IHdpbGwgYmUgdHJlYXRlZCBhcyBhbiB1bmtub3duIGVsZW1lbnQuXG4gICMgSW4gbW9zdCBjYXNlcywgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgdGhlIGJyb3dzZXIgaXMgYWNjZXB0YWJsZSAoc2VlIGFsc28gW0hUTUwgU2VtYW50aWNzXShodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL3NlbWFudGljcy5odG1sKSksIGJ1dFxuICAjIGluIHNvbWUgY2FzZXMgdGhpcyBpcyBwcm9ibGVtYXRpYyAoZmlyc3RseSwgYmVjYXVzZSB0aGVzZSBlbGVtZW50cyBhcmUgYWx3YXlzIHJlbmRlcmVkIGlubGluZSkuXG4gICMgSW4gc3VjaCBjb25kaXRpb25zLCB0aGUgW2NvbnRyb2xzXShjb250cm9scy5odG1sKSBjbGFzcyBhbmQgbmFtZSBzcGFjZSBpcyBiZXR0ZXIgc3VpdGVkIHRvIGNsYXNzZXMgd2hpY2ggcmVxdWlyZSBjb21wbGV0ZSBjb250cm9sIChlLmcuIFtpY29uXShpY29uLmh0bWwpKS5cbiAgd2lkZ2V0ID0gZWwuZWxlbWVudCB0YWdOYW1lLCBvYmoub2JqZWN0KCksIG93bmVyLCBmYWxzZSAjLCBvcHRpb25zLnByb3BzLCBvcHRpb25zLnN0eWxlcywgb3B0aW9ucy5ldmVudHMsIG9wdGlvbnMudGV4dFxuICBcbiAgIyBTaW5jZSB0aGUgYmVoYXZpb3Igb2Ygc3R5bGluZyBpcyBub3Qgd2VsbCBjb250cm9sbGVkL2NvbnRyb2xsYWJsZSBvbiB1bmtub3duIGVsZW1lbnRzLCBpdCBpcyBuZWNlc3NhcnkgdG8gY3JlYXRlIGEgcm9vdCBub2RlIGZvciB0aGUgY29tcG9uZW50LlxuICAjIEluIG1vc3QgY2FzZXMsIFtkaXZdKGRpdi5odG1sKSBpcyBwZXJmZWN0bHkgYWNjZXB0YWJsZSwgYnV0IHRoaXMgaXMgY29uZmlndXJhYmxlIGF0IHRoZSBuYW1lIHNwYWNlIGxldmVsIG9yIGF0IHJ1bnRpbWUuXG4gIHJvb3ROb2RlVHlwZSA9IG9wdGlvbnMucm9vdE5vZGVUeXBlIG9yIE9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gb3IgJ2RpdidcblxuICAjIGByZXRgIGlzIHRoZSB0aGUgaW5zdGFuY2Ugb2YgdGhlIHJvb3ROb2RlVHlwZSwgbm90IHRoZSBgd2lkZ2V0YCB3cmFwcGVkIGluIHRoaXMgY2xvc3VyZVxuICByZXQgPSB3aWRnZXQubWFrZSByb290Tm9kZVR5cGUsIG9wdGlvbnNcblxuICAjIGZvciBjb252ZW5pZW5jZSBhbmQgZGVidWdnaW5nLCBwZXJzaXN0IHRoZSB0YWdOYW1lXG4gIHJldC5hZGQgJ2NvbXBvbmVudE5hbWUnLCB0YWdOYW1lXG5cbiAgIyBgcmVtb3ZlYCBkb2VzLCBob3dldmVyLCBiZWhhdmUgYXMgZXhwZWN0ZWQgYnkgcmVtb3ZpbmcgYHdpZGdldGBcbiAgcmV0LmFkZCAncmVtb3ZlJywgd2lkZ2V0LnJlbW92ZVxuICByZXRcblxuT0oucmVnaXN0ZXIgJ2NvbXBvbmVudCcsIGNvbXBvbmVudFxubW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuZWwgPSByZXF1aXJlICcuL2VsZW1lbnQnXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcblxuIyMjXG5DcmVhdGUgYSBzZXQgb2YgSFRNTCBFbGVtZW50cyB0aHJvdWdoIFRoaW5Eb21cbiMjI1xuY29udHJvbCA9IChvcHRpb25zID0gb2JqLm9iamVjdCgpLCBvd25lciwgdGFnTmFtZSkgLT5cbiAgaWYgbm90IHRhZ05hbWUuc3RhcnRzV2l0aCAneS0nIHRoZW4gdGFnTmFtZSA9ICd5LScgKyB0YWdOYW1lXG5cbiAgcm9vdE5vZGVUeXBlID0gb3B0aW9ucy5yb290Tm9kZVR5cGUgb3IgT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSBvciAnZGl2J1xuXG4gIHJldCA9IGVsLmVsZW1lbnQgcm9vdE5vZGVUeXBlLCBvcHRpb25zLCBvd25lciwgZmFsc2VcblxuICByZXQuYWRkICdjb250cm9sTmFtZScsIHRhZ05hbWVcblxuICByZXRcblxuT0oucmVnaXN0ZXIgJ2NvbnRyb2wnLCBjb250cm9sXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnRyb2wiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcblxuIyAjIGRvbVxuXG5cbiMgRXh0ZW5kIGFuIG9iamVjdCB3aXRoIE9KIERPTSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXG5cbiMgLSBgZWxgIE9iamVjdCB0byBleHRlbmRcbiMgLSBgcGFyZW50YCBwYXJlbnQgb2JqZWN0IHRvIHdoaWNoIGBlbGAgd2lsbCBiZSBhcHBlbmRlZFxuZG9tID0gKGVsLCBwYXJlbnQgPSByZXF1aXJlKCcuL2JvZHknKSkgLT5cbiAgZW5hYmxlZCA9IHRydWVcblxuICAjICMjIGlzVmFsaWRcbiAgZWwuYWRkICdpc1ZhbGlkJywgLT5cbiAgICBlbCBhbmQgKGVsLmVsIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgb3IgZWwuZWwgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KVxuXG4gIGlzQ29udHJvbFN0aWxsVmFsaWQgPSAtPlxuICAgIGlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXG4gICAgdmFsaWQgPSBmYWxzZSBpcyBpc01ldGhvZC5udWxsT3JFbXB0eShlbCkgYW5kIGVsLmlzVmFsaWQoKVxuICAgIHRocm93IG5ldyBFcnJvciAnZWwgaXMgbnVsbC4gRXZlbnQgYmluZGluZ3MgbWF5IG5vdCBoYXZlIGJlZW4gR0NkLicgIGlmIGZhbHNlIGlzIHZhbGlkXG4gICAgdmFsaWRcblxuICAjICMjIGFkZENsYXNzXG4gICMgQWRkIGEgQ1NTIGNsYXNzIHRvIGFuIGVsZW1lbnRcblxuICAjIC0gYG5hbWVgIHRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0byBhZGRcbiAgZWwuYWRkICdhZGRDbGFzcycsIChuYW1lKSAtPlxuICAgIGVsLiQuYWRkQ2xhc3MgbmFtZSBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBlbFxuXG4gICMgIyMgYmluZFxuICAjIEJpbmQgYW4gYWN0aW9uIHRvIGEgalF1ZXJ5IGVsZW1lbnQncyBldmVudC5cbiAgZWwuYWRkICdiaW5kJywgKGV2ZW50TmFtZSwgZXZlbnQpIC0+XG4gICAgZWwub24gZXZlbnROYW1lLCBldmVudFxuXG4gICMgIyMgb25cbiAgZWwuYWRkICdvbicsIChldmVudE5hbWUsIGV2ZW50KSAtPlxuICAgIGVsLiQub24gZXZlbnROYW1lLCBldmVudCAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgZWxcblxuICAjICMjIG9mZlxuICBlbC5hZGQgJ29mZicsIChldmVudE5hbWUsIGV2ZW50KSAtPlxuICAgIGVsLiQub2ZmIGV2ZW50TmFtZSwgZXZlbnQgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIGVsXG5cbiAgIyAjIyBrZXlib2FyZFxuICAjIEJpbmQgYW4gZXZlbnQgdG8gYSBrZXksIHdoZW4gcHJlc3NlZCBpbiB0aGlzIGNvbnRyb2wuXG4gICMgVGhlIE9KIG9iamVjdCAoZm9yIGNoYWluaW5nKVxuICBlbC5hZGQgJ2tleWJvYXJkJywgKGtleXMsIGV2ZW50KSAtPlxuICAgICNNb3VzZXRyYXAuYmluZCBrZXlzLCBlbFtldmVudF0gIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIGVsXG5cbiAgIyAjIyBkaXNhYmxlXG4gICMgRGlzYWJsZSB0aGUgZWxlbWVudC5cbiAgIyBUaGUgT0ogb2JqZWN0IChmb3IgY2hhaW5pbmcpXG4gIGVsLmFkZCAnZGlzYWJsZScsIC0+XG4gICAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgICBlbmFibGVkID0gZmFsc2VcbiAgICAgIGVsLmF0dHIgJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJ1xuICAgICAgZWwuYWRkQ2xhc3MgJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJ1xuICAgIGVsXG5cbiAgIyAjIyBlbXB0eVxuICAjIEVtcHR5IHRoZSBlbGVtZW50LlxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcbiAgZWwuYWRkICdlbXB0eScsIC0+XG4gICAgZWwuJC5lbXB0eSgpICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBlbFxuXG4gICMgIyMgZW5hYmxlXG4gICMgRW5hYmxlIHRoZSBlbGVtZW50LlxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcbiAgZWwuYWRkICdlbmFibGUnLCAtPlxuICAgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgICAgZW5hYmxlZCA9IHRydWVcbiAgICAgIGVsLnJlbW92ZUF0dHIgJ2Rpc2FibGVkJ1xuICAgICAgZWwucmVtb3ZlQ2xhc3MgJ2Rpc2FibGVkJ1xuICAgIGVsXG5cbiAgIyAjIyBnZXRJZFxuICAjIEdldCB0aGUgRE9NIEVsZW1lbnQgSUQgb2YgdGhpcyBvYmplY3QuXG4gIGVsLmFkZCAnZ2V0SWQnLCAtPlxuICAgIGlkID0gZWxbMF0uaWQgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIGlkXG5cbiAgIyAjIyBoaWRlXG4gICMgTWFrZSB0aGUgZWxlbWVudCBpbnZpc2libGUuXG4gIGVsLmFkZCAnaGlkZScsIC0+XG4gICAgZWwuY3NzICdkaXNwbGF5JywgJ25vbmUnICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBlbFxuXG4gICMgIyMgbGVuZ3RoXG4gICMgR2V0IHRoZSBsZW5ndGggb2YgdGhpcyBlbGVtZW50LlxuICBlbC5hZGQgJ2xlbmd0aCcsIC0+XG4gICAgdG8gPSByZXF1aXJlICcuLi90b29scy90bydcbiAgICBsZW4gPSAwXG4gICAgbGVuID0gdG8ubnVtYmVyKGVsLiQubGVuZ3RoKSAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgbGVuXG5cbiAgIyAjIyBwYXJlbnRcbiAgIyBSZWZlcmVuY2UgdG8gdGhlIHBhcmVudCBhcyBwYXNzZWQgaW5cbiAgZWwuYWRkICdwYXJlbnQnLCBwYXJlbnRcblxuICAjICMjIHJlbW92ZVxuICAjIFJlbW92ZSB0aGUgbm9kZSBmcm9tIHRoZSBET01cbiAgZWwuYWRkICdyZW1vdmUnLCAtPlxuICAgIGlmIGVsIGFuZCBlbC4kXG4gICAgICBlbC4kLnJlbW92ZSgpXG5cbiAgICAgICMgU2V0IHRoZSB2YWx1ZSBvZiBlbCB0byBudWxsIHRvIGd1YXJhbnRlZSB0aGF0IGlzQ29udHJvbFN0aWxsVmFsaWQgd2lsbCBiZSBjb3JyZWN0XG4gICAgICBlbCA9IG51bGxcbiAgICBudWxsXG5cbiAgIyAjIyByZW1vdmVDbGFzc1xuICAjIFJlbW92ZSBhIENTUyBjbGFzcyBmcm9tIGFuIGVsZW1lbnQuXG4gIGVsLmFkZCAncmVtb3ZlQ2xhc3MnLCAobmFtZSkgLT5cbiAgICBlbC4kLnJlbW92ZUNsYXNzIG5hbWUgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIGVsXG5cbiAgIyAjIyByZW1vdmVQcm9wXG4gICMgUmVtb3ZlIGEgcHJvcGVydHkgZnJvbSBhbiBlbGVtZW50LiBqUXVlcnkgZGlzdGluZ3Vpc2hlcyBiZXR3ZWVuICdwcm9wcycgYW5kICdhdHRyJzsgaGVuY2UgMiBtZXRob2RzLlxuICBlbC5hZGQgJ3JlbW92ZVByb3AnLCAobmFtZSkgLT5cbiAgICBlbC4kLnJlbW92ZVByb3AgbmFtZSAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgZWxcblxuICAjICMjIHJlbW92ZUF0dHJcbiAgIyBSZW1vdmUgYSBwcm9wZXJ0eSBmcm9tIGFuIGVsZW1lbnQuIGpRdWVyeSBkaXN0aW5ndWlzaGVzIGJldHdlZW4gJ3Byb3BzJyBhbmQgJ2F0dHInOyBoZW5jZSAyIG1ldGhvZHMuXG4gIGVsLmFkZCAncmVtb3ZlQXR0cicsIChuYW1lKSAtPlxuICAgIGVsLiQucmVtb3ZlQXR0ciBuYW1lICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBlbFxuXG4gICMgIyMgcmVxdWlyZWRcbiAgIyBNYXJrIHRoZSByZXF1aXJlZCBzdGF0dXMgb2YgdGhlIGVsZW1lbnQuXG4gIGVsLmFkZCAncmVxdWlyZWQnLCAodHJ1dGh5LCBhZGRMYWJlbCkgLT5cbiAgICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICAgIHRvID0gcmVxdWlyZSAnLi4vdG9vbHMvdG8nXG4gICAgICBzd2l0Y2ggdG8uYm9vbCh0cnV0aHkpXG4gICAgICAgIHdoZW4gdHJ1ZVxuICAgICAgICAgIGVsLmF0dHIgJ3JlcXVpcmVkJywgdHJ1ZVxuICAgICAgICAgIGVsLmFkZENsYXNzICdyZXF1aXJlZCdcbiAgICAgICAgd2hlbiBmYWxzZVxuICAgICAgICAgIGVsLnJlbW92ZVByb3AgJ3JlcXVpcmVkJ1xuICAgICAgICAgIGVsLnJlbW92ZUNsYXNzICdyZXF1aXJlZCdcbiAgICBlbFxuXG4gICMgIyMgcm9vdFxuICAjIHJlZmVyZW5jZSB0byB0aGUgcm9vdCBvZiB0aGUgbm9kZVxuICBlbC5hZGQgJ3Jvb3QnLCBlbC5yb290IG9yIHBhcmVudFxuXG4gICMgIyMgc2hvd1xuICAjIE1ha2UgdGhlIGVsZW1lbnQgdmlzaWJsZS5cbiAgZWwuYWRkICdzaG93JywgLT5cbiAgICBlbC4kLnNob3coKSAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgZWxcblxuICAjICMjIHRvZ2dsZVxuICAjIFRvZ2dsZSB2aXNpYmlsaXR5XG4gIGVsLmFkZCAndG9nZ2xlJywgLT5cbiAgICBlbC4kLnRvZ2dsZSgpICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBlbFxuXG4gICMgIyMgdG9nZ2xlRW5hYmxlXG4gICMgVG9nZ2xlIHRoZSBlbGVtZW50J3MgZW5hYmxlZCBzdGF0ZS5cbiAgZWwuYWRkICd0b2dnbGVFbmFibGUnLCAtPlxuICAgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgICAgaWYgZW5hYmxlZFxuICAgICAgICBlbC5kaXNhYmxlKClcbiAgICAgIGVsc2VcbiAgICAgICAgZWwuZW5hYmxlKClcbiAgICBlbFxuXG4gICMgIyMgdHJpZ2dlclxuICAjIFRyaWdnZXIgYW4gZXZlbnQgYm91bmQgdG8gYSBqUXVlcnkgZWxlbWVudC5cbiAgZWwuYWRkICd0cmlnZ2VyJywgKGV2ZW50TmFtZSwgZXZlbnRPcHRzKSAtPlxuICAgIGVsLiQudHJpZ2dlciBldmVudE5hbWUsIGV2ZW50T3B0cyAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgZWxcblxuICAjICMjIHVuYmluZFxuICAjIFdyYXBwZXIgYXJvdW5kIGBvZmZgXG4gIGVsLmFkZCAndW5iaW5kJywgKGV2ZW50TmFtZSwgZXZlbnQpIC0+XG4gICAgZWwub2ZmIGV2ZW50TmFtZSwgZXZlbnRcblxuICAjICMjIHZhbFxuICAjIEdldCBvciBzZXQgdGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50LlxuICBlbC5hZGQgJ3ZhbCcsICh2YWx1ZSkgLT5cbiAgICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICAgIGlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDEgYW5kIGZhbHNlIGlzIGlzTWV0aG9kLm51bGxPclVuZGVmaW5lZCh2YWx1ZSlcbiAgICAgICAgZWwuJC52YWwgdmFsdWVcbiAgICAgICAgZWxcbiAgICAgIGVsc2VcbiAgICAgICAgZWwuJC52YWwoKVxuXG4gICMgIyMgdmFsdWVPZlxuICAjIHdyYXBwZXIgYXJvdW5kIGB2YWxgXG4gIGVsLmFkZCAndmFsdWVPZicsIC0+XG4gICAgZWwudmFsKClcblxuICAjICMjIHRvU3RyaW5nXG4gICMgd3JhcHBlciBhcm91bmQgYHZhbGBcbiAgZWwuYWRkICd0b1N0cmluZycsIC0+XG4gICAgZWwudmFsKClcblxuICBlbFxuXG5PSi5yZWdpc3RlciAnaXNFbGVtZW50SW5Eb20nLCAoZWxlbWVudElkKSAtPlxuICBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSBPSi5nZXRFbGVtZW50IGVsZW1lbnRJZFxuXG5PSi5yZWdpc3RlciAnZ2V0RWxlbWVudCcsIChpZCkgLT5cbiAgaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCdcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcblxuT0oucmVnaXN0ZXIgJ2RvbScsIGRvbVxubW9kdWxlLmV4cG9ydHMgPSBkb20iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cbnJlcXVpcmUgJ3RoaW5kb20nXG5cbiMgIyBlbGVtZW50XG5cbmVsZW1lbnQgPSBcbiAgIyMjXG4gICAgQmluZCBhbGwgZXZlbnQgaGFuZGxlcnNcbiAgIyMjXG4gIGJpbmRFdmVudHM6IChlbCwgZXZlbnRzKSAtPlxuICAgIGlmIGVsIHRoZW4gXy5mb3JPd24gZXZlbnRzLCAodmFsLCBrZXkpIC0+XG4gICAgICBpc01ldGhvZCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2lzJ1xuICAgICAgaWYgaXNNZXRob2QubWV0aG9kIHZhbFxuICAgICAgICBjYWxsYmFjayA9IChldmVudC4uLikgLT4gdmFsIGV2ZW50Li4uXG4gICAgICAgIGVsLiQub24ga2V5LCBjYWxsYmFja1xuICAgICAgICBlbC5hZGQga2V5LCBjYWxsYmFja1xuICAgICAgICBudWxsXG5cbiAgIyMjXG4gIEZpbmFsaXplIHRoZSBUaGltRE9NIG5vZGVcbiAgIyMjXG4gIGZpbmFsaXplOiAocmV0LCB0YWcsIHByb3BzLCBzdHlsZXMsIGV2ZW50cywgdGV4dCkgLT5cbiAgICByZXQuYWRkICd0YWdOYW1lJywgdGFnXG4gICAgcmV0LmNzcyBzdHlsZXNcbiAgICBpZiB0ZXh0IHRoZW4gcmV0LnRleHQgdGV4dFxuICAgIHJldC5hZGQgJyQnLCAkKHJldC5nZXQoKSlcbiAgICByZXQuYWRkICcwJywgcmV0LmdldCgpXG5cbiAgICByZXQuYWRkICdiaW5kRXZlbnRzJywgXy5vbmNlICgpIC0+IGVsZW1lbnQuYmluZEV2ZW50cyByZXQsIGV2ZW50c1xuICAgIHJldFxuXG4gICMgIyMgcmVzdG9yZUVsZW1lbnRcbiAgIyMjXG4gIFJlc3RvcmUgYW4gSFRNTCBFbGVtZW50IHRocm91Z2ggVGhpbkRvbVxuICAjIyNcbiAgcmVzdG9yZUVsZW1lbnQ6IChlbCwgdGFnID0gZWwubm9kZU5hbWUpIC0+XG4gICAgbm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xuICAgIHJldCA9IG5ldyBUaGluRE9NIG51bGwsIG51bGwsIGVsXG4gICAgZWxlbWVudC5maW5hbGl6ZSByZXQsIHRhZ1xuICAgIHJldC5hZGQgJ2lzSW5ET00nLCB0cnVlXG4gICAgbm9kZUZhY3RvcnkubWFrZSByZXRcbiAgICByZXRcblxuICAjICMjIGVsZW1lbnRcbiAgIyMjXG4gIENyZWF0ZSBhbiBIVE1MIEVsZW1lbnQgdGhyb3VnaCBUaGluRG9tXG4gICMjI1xuICBlbGVtZW50OiAodGFnLCBvcHRpb25zLCBvd25lciwgaXNDYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuICAgIHJldCA9IG5ldyBUaGluRE9NIHRhZywgb3B0aW9ucy5wcm9wc1xuICAgIGVsZW1lbnQuZmluYWxpemUgcmV0LCB0YWcsIG9wdGlvbnMucHJvcHMsIG9wdGlvbnMuc3R5bGVzLCBvcHRpb25zLmV2ZW50cywgb3B0aW9ucy50ZXh0XG4gICAgaWYgb3duZXIgYW5kIGZhbHNlIGlzIGlzQ2FsbGVkRnJvbUZhY3RvcnlcbiAgICAgIG5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcbiAgICAgIG5vZGVGYWN0b3J5Lm1ha2UgcmV0LCBvd25lclxuICAgIHJldFxuXG5PSi5yZWdpc3RlciAncmVzdG9yZUVsZW1lbnQnLCBlbGVtZW50LnJlc3RvcmVFbGVtZW50XG5PSi5yZWdpc3RlciAnZWxlbWVudCcsIGVsZW1lbnQuZWxlbWVudFxuXG5tb2R1bGUuZXhwb3J0cyA9IGVsZW1lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuZWwgPSByZXF1aXJlICcuL2VsZW1lbnQnXG5cbiMgIyBmcmFnbWVudFxuXG4jIENyZWF0ZSBhIGRvY3VtZW50IGZyYWdtZW50IGFuZCByZXR1cm4gaXQgYXMgYW4gT0ogbm9kZVxuZnJhZ21lbnQgPSAtPlxuICByZXQgPSBudWxsXG4gIGlmIHR5cGVvZiBkb2N1bWVudCBpc250ICd1bmRlZmluZWQnXG4gICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcbiAgICByZXQgPSBlbC5yZXN0b3JlRWxlbWVudCBmcmFnbWVudCwgJ2ZyYWdtZW50J1xuICByZXRcblxuT0oucmVnaXN0ZXIgJ2ZyYWdtZW50JywgZnJhZ21lbnRcbm1vZHVsZS5leHBvcnRzID0gZnJhZ21lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuZWwgPSByZXF1aXJlICcuL2VsZW1lbnQnXG5yZXF1aXJlICcuLi9vakluaXQnXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcblxuIyAjIGdlbmVyaWMgbm9kZXNcblxuY2xvc2VkID0gW1xuICAnYWJicidcbiAgJ2Fjcm9ueW0nXG4gICdhcHBsZXQnXG4gICdhcnRpY2xlJ1xuICAnYXNpZGUnXG4gICdhdWRpbydcbiAgJ2InXG4gICdiZG8nXG4gICdiaWcnXG4gICdibG9ja3F1b3RlJ1xuICAnYnV0dG9uJ1xuICAnY2FudmFzJ1xuICAnY2FwdGlvbidcbiAgJ2NlbnRlcidcbiAgJ2NpdGUnXG4gICdjb2RlJ1xuICAnY29sZ3JvdXAnXG4gICdkYXRhbGlzdCdcbiAgJ2RkJ1xuICAnZGVsJ1xuICAnZGV0YWlscydcbiAgJ2RmbidcbiAgJ2RpcidcbiAgJ2RpdidcbiAgJ2RsJ1xuICAnZHQnXG4gICdlbSdcbiAgJ2ZpZWxkc2V0J1xuICAnZmlnY2FwdGlvbidcbiAgJ2ZpZ3VyZSdcbiAgJ2ZvbnQnXG4gICdmb290ZXInXG4gICdoMSdcbiAgJ2gyJ1xuICAnaDMnXG4gICdoNCdcbiAgJ2g1J1xuICAnaDYnXG4gICdoZWFkJ1xuICAnaGVhZGVyJ1xuICAnaGdyb3VwJ1xuICAnaHRtbCdcbiAgJ2knXG4gICdpZnJhbWUnXG4gICdpbnMnXG4gICdrYmQnXG4gICdsYWJlbCdcbiAgJ2xlZ2VuZCdcbiAgJ2xpJ1xuICAnbWFwJ1xuICAnbWFyaydcbiAgJ21lbnUnXG4gICdtZXRlcidcbiAgJ25hdidcbiAgJ25vZnJhbWVzJ1xuICAnbm9zY3JpcHQnXG4gICdvYmplY3QnXG4gICdvcHRncm91cCdcbiAgJ29wdGlvbidcbiAgJ291dHB1dCdcbiAgJ3AnXG4gICdwcmUnXG4gICdwcm9ncmVzcydcbiAgJ3EnXG4gICdycCdcbiAgJ3J0J1xuICAncnVieSdcbiAgJ3MnXG4gICdzYW1wJ1xuICAnc2VjdGlvbidcbiAgJ3NtYWxsJ1xuICAnc3BhbidcbiAgJ3N0cmlrZSdcbiAgJ3N0cm9uZydcbiAgJ3N0eWxlJ1xuICAnc3ViJ1xuICAnc3VtbWFyeSdcbiAgJ3N1cCdcbiAgJ3Rib2R5J1xuICAndGQnXG4gICd0Zm9vdCdcbiAgJ3RoJ1xuICAndGltZSdcbiAgJ3RpdGxlJ1xuICAndHInXG4gICd0dCdcbiAgJ3UnXG4gICd2YXInXG4gICd2aWRlbydcbiAgJ3htcCdcbl1cbm9wZW4gPSAnYXJlYSBiYXNlIGNvbCBjb21tYW5kIGNzcyBlbWJlZCBociBpbWcga2V5Z2VuIG1ldGEgcGFyYW0gc291cmNlIHRyYWNrIHdicicuc3BsaXQgJyAnXG5hbGwgPSBjbG9zZWQuY29uY2F0IG9wZW5cblxuZXhwb3J0cyA9IHt9XG4jIHJlZ2lzdGVyIHNlbWFudGljL3N0cnVjdHVyYWwgYWxpYXNlc1xuZm9yIGxvb3BOYW1lIGluIGFsbFxuICBkbyAodGFnID0gbG9vcE5hbWUpIC0+XG4gICAgbWV0aG9kID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cblxuICAgICAgZGVmYXVsdHMgPVxuICAgICAgICBwcm9wczoge31cbiAgICAgICAgc3R5bGVzOiB7fVxuICAgICAgICBldmVudHM6IHt9XG5cbiAgICAgIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnNcbiAgICAgIHJldCA9IGVsLmVsZW1lbnQgdGFnLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XG5cbiAgICAgIHJldFxuICAgIE9KLm5vZGVzLnJlZ2lzdGVyIHRhZywgbWV0aG9kXG4gICAgZXhwb3J0c1t0YWddID0gbWV0aG9kXG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jIyNcclxuQ3JlYXRlIGFuIE9KIElucHV0IE9iamVjdCB0aHJvdWdoIE9KLm5vZGVzLmlucHV0XHJcbiMjI1xyXG5pbnB1dCA9IChvcHRpb25zID0gT0oub2JqZWN0KCksIG93bmVyKSAtPlxyXG4gIGlmIG5vdCBvd25lciB0aGVuIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhbiBpbnB1dCB3aXRob3V0IGEgcGFyZW50J1xyXG4gIGlmIG5vdCBvcHRpb25zLnByb3BzIG9yIG5vdCBvcHRpb25zLnByb3BzLnR5cGUgdGhlbiB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgYW4gaW5wdXQgd2l0aG91dCBhbiBpbnB1dCB0eXBlJ1xyXG4gIHJldCA9IG93bmVyLm1ha2UgJ2lucHV0Jywgb3B0aW9uc1xyXG4gIHJldC5hZGQgJ2lucHV0TmFtZScsIG9wdGlvbnMucHJvcHMudHlwZVxyXG4gIHJldFxyXG4gICAgXHJcbk9KLnJlZ2lzdGVyICdpbnB1dCcsIGlucHV0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdXQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5jbG9zZWQgPSAnYSBhYmJyIGFjcm9ueW0gYWRkcmVzcyBhcHBsZXQgYXJ0aWNsZSBhc2lkZSBhdWRpbyBiIGJkbyBiaWcgYmxvY2txdW90ZSBib2R5IGJ1dHRvbiBjYW52YXMgY2FwdGlvbiBjZW50ZXIgY2l0ZSBjb2RlIGNvbGdyb3VwIGNvbW1hbmQgZGF0YWxpc3QgZGQgZGVsIGRldGFpbHMgZGZuIGRpciBkaXYgZGwgZHQgZW0gZW1iZWQgZmllbGRzZXQgZmlnY2FwdGlvbiBmaWd1cmUgZm9udCBmb290ZXIgZm9ybSBmcmFtZXNldCBoMSBoMiBoMyBoNCBoNSBoNiBoZWFkIGhlYWRlciBoZ3JvdXAgaHRtbCBpIGlmcmFtZSBpbnMga2V5Z2VuIGtiZCBsYWJlbCBsZWdlbmQgbGkgbWFwIG1hcmsgbWVudSBtZXRlciBuYXYgbm9mcmFtZXMgbm9zY3JpcHQgb2JqZWN0IG9sIG9wdGdyb3VwIG9wdGlvbiBvdXRwdXQgcCBwcmUgcHJvZ3Jlc3MgcSBycCBydCBydWJ5IHMgc2FtcCBzY3JpcHQgc2VjdGlvbiBzZWxlY3Qgc21hbGwgc291cmNlIHNwYW4gc3RyaWtlIHN0cm9uZyBzdHlsZSBzdWIgc3VtbWFyeSBzdXAgdGFibGUgdGJvZHkgdGQgdGV4dGFyZWEgdGZvb3QgdGggdGhlYWQgdGltZSB0aXRsZSB0ciB0dCB1IHVsIHZhciB2aWRlbyB3YnIgeG1wJy5zcGxpdCAnICdcbm9wZW4gPSAnYXJlYSBiYXNlIGJyIGNvbCBjb21tYW5kIGNzcyAhRE9DVFlQRSBlbWJlZCBociBpbWcgaW5wdXQga2V5Z2VuIGxpbmsgbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyJy5zcGxpdCAnICdcblxubmVzdGFibGVOb2RlTmFtZXMgPSBbXG4gICdkaXYnXG4gICdzcGFuJ1xuICAnaDEnXG4gICdoMidcbiAgJ2gzJ1xuICAnaDQnXG4gICdoNSdcbiAgJ2g2J1xuICAncCdcbiAgJ2ZpZWxkc2V0J1xuICAnc2VsZWN0J1xuICAnb2wnXG4gICd1bCdcbiAgJ3RhYmxlJ1xuXVxuXG4jVGhpcyBsaXN0IGlzIG5vdCB5ZXQgZXhoYXVzdGl2ZSwganVzdCBleGNsdWRlIHRoZSBvYnZpb3VzXG5ub25OZXN0YWJsZU5vZGVzID0gW1xuICAnbGknXG4gICdsZWdlbmQnXG4gICd0cidcbiAgJ3RkJ1xuICAnb3B0aW9uJ1xuICAnYm9keSdcbiAgJ2hlYWQnXG4gICdzb3VyY2UnXG4gICd0Ym9keSdcbiAgJ3Rmb290J1xuICAndGhlYWQnXG4gICdsaW5rJ1xuICAnc2NyaXB0J1xuXVxuXG5leHBvcnRzID0ge31cbiMjI1xuRmV0Y2ggYSBub2RlIGZyb20gdGhlIERPTSBhbmQgcmV0dXJuIGFuIE9KJ2ZpZWQgaW5zdGFuY2Ugb2YgdGhlIGVsZW1lbnRcbiMjI1xuZXhwb3J0cy5nZXQgPSAoaWQsIHRhZ05hbWUgPSAnZGl2JykgLT5cbiAgcmV0ID0gbnVsbFxuICBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkIGlkXG4gIGlmIGVsXG4gICAgdGhpbkVsID0gT0oucmVzdG9yZUVsZW1lbnQgZWwsIHRhZ05hbWVcbiAgaWYgdGhpbkVsXG4gICAgcmV0ID0gT0oubm9kZXMuZmFjdG9yeSB0aGluRWwsIG51bGwsIDBcblxuICByZXRcblxubm9kZU5hbWVzID0gW1xuICAnYSdcbiAgJ2InXG4gICdicidcbiAgJ2J1dHRvbidcbiAgJ2RpdidcbiAgJ2VtJ1xuICAnZmllbGRzZXQnXG4gICdmb3JtJ1xuICAnaDEnXG4gICdoMidcbiAgJ2gzJ1xuICAnaDQnXG4gICdoNSdcbiAgJ2g2J1xuICAnaSdcbiAgJ2ltZydcbiAgJ2lucHV0J1xuICAnbGFiZWwnXG4gICdsZWdlbmQnXG4gICdsaSdcbiAgJ25hdidcbiAgJ29sJ1xuICAnb3B0aW9uJ1xuICAncCdcbiAgJ3NlbGVjdCdcbiAgJ3NwYW4nXG4gICdzdHJvbmcnXG4gICdzdXAnXG4gICdzdmcnXG4gICd0YWJsZSdcbiAgJ3Rib2R5J1xuICAndGQnXG4gICd0ZXh0YXJlYSdcbiAgJ3RoJ1xuICAndGhlYWQnXG4gICd0cidcbiAgJ3VsJ1xuXVxuXG5tYWtlQWRkID0gKHRhZ05hbWUsIGVsLCBjb3VudCkgLT5cbiAgKG9wdHMpIC0+XG4gICAgbWV0aG9kID0gT0oubm9kZXNbdGFnTmFtZV0gb3IgT0ouY29tcG9uZW50c1t0YWdOYW1lXSBvciBPSi5jb250cm9sc1t0YWdOYW1lXSBvciBPSi5pbnB1dHNbdGFnTmFtZV1cbiAgICBpZiBtZXRob2RcbiAgICAgIG51ID0gbWV0aG9kIG9wdHMsIGVsLCB0cnVlXG4gICAgZWxzZVxuICAgICAgbnUgPSBPSi5jb21wb25lbnQgbnVsbCwgZWwsIHRhZ05hbWVcbiAgICBPSi5ub2Rlcy5mYWN0b3J5IG51LCBlbCwgY291bnRcblxuZXhwb3J0cy5hZGRNYWtlTWV0aG9kID0gKGVsLCBjb3VudCkgLT5cbiAgbWV0aG9kcyA9IE9KLm9iamVjdCgpXG4gIGVsLm1ha2UgPSAodGFnTmFtZSwgb3B0cykgLT5cbiAgICBtZXRob2QgPSBtZXRob2RzW3RhZ05hbWVdXG4gICAgaWYgbm90IG1ldGhvZFxuICAgICAgbWV0aG9kID0gbWFrZUFkZCB0YWdOYW1lLCBlbCwgY291bnRcbiAgICAgIG1ldGhvZHNbdGFnTmFtZV0gPSBtZXRob2RcbiAgICBtZXRob2Qgb3B0c1xuICBlbFxuXG5tYWtlVW5pcXVlSWQgPSAoZWwsIHBhcmVudCwgY291bnQpIC0+XG4gIGlmIE9KLkdFTkVSQVRFX1VOSVFVRV9JRFNcbiAgICBjb3VudCArPSAxXG4gICAgaWYgY291bnQgPD0gcGFyZW50LmNvdW50IHRoZW4gY291bnQgPSBwYXJlbnQuY291bnQgKyAxXG4gICAgcGFyZW50LmNvdW50ID0gY291bnRcblxuICAgIGlmIG5vdCBlbC5nZXRJZCgpXG4gICAgICBpZCA9IHBhcmVudC5nZXRJZCgpIG9yICcnXG4gICAgICBpZCArPSBlbC50YWdOYW1lICsgY291bnRcbiAgICAgIGVsLmF0dHIgJ2lkJywgaWRcbiAgcmV0dXJuXG5cbiMjI1xuRXh0ZW5kcyBhIE9KIENvbnRyb2wgY2xhc3Mgd2l0aCBhbGwgdGhlIChwZXJtaXR0ZWQpIG1ldGhvZHMgb24gdGhlIGZhY3RvcnlcbiMjI1xuZXhwb3J0cy5tYWtlID0gKGVsLCBwYXJlbnQgPSBPSi5ib2R5LCBjb3VudCA9IHBhcmVudC5jb3VudCBvciAwKSAtPlxuXG4gICMgMTogZm9yIGNsYXJpdHksIHdlIGFyZSByZXR1cm5pbmcgdGhlIGV4dGVuZGVkIGVsZW1lbnRcbiAgcmV0ID0gZWxcblxuICAjIDI6IElmIHRoZSBlbGVtZW50IGhhcyBuZXZlciBiZWVuIGluaXRpYWxpemVkLCBjb250aW51ZVxuICBpZiBub3QgZWwuaXNGdWxseUluaXRcblxuICAgICMgMzogQXMgbG9uZyBhcyB0aGUgZWxlbWVudCBpc24ndCB0aGUgYm9keSBub2RlLCBjb250aW51ZVxuICAgIGlmIGVsLnRhZ05hbWUgaXNudCAnYm9keSdcbiAgICAgICMgNDogRXh0ZW5kIHRoZSBlbGVtZW50IHdpdGggc3RhbmRhcmQgalF1ZXJ5IEFQSSBtZXRob2RzXG4gICAgICByZXQgPSBPSi5kb20gZWwsIHBhcmVudFxuXG4gICAgICAjIDU6IElmIHRoZSBub2RlIGlzbid0IGluIHRoZSBET00sIGFwcGVuZCBpdCB0byB0aGUgcGFyZW50XG4gICAgICAjIFRoaXMgYWxzbyBhY2NvbW1vZGF0ZXMgZG9jdW1lbnQgZnJhZ21lbnRzLCB3aGljaCBhcmUgbm90IGluIHRoZSBET00gYnV0IGFyZSBwcmVzdW1lZCB0byBiZSBzb3VuZCB1bnRpbCByZWFkeSBmb3IgbWFudWFsIGluc2VydGlvblxuICAgICAgaWYgbm90IHJldC5pc0luRE9NXG4gICAgICAgIG1ha2VVbmlxdWVJZCBlbCwgcGFyZW50LCBjb3VudFxuICAgICAgICBwYXJlbnQuYXBwZW5kIHJldFswXVxuICAgICAgICAjIDY6IEJpbmQgYW55IGRlZmluZWQgZXZlbnRzIGFmdGVyIHRoZSBub2RlIGlzIGluIHRoZSBET01cbiAgICAgICAgcmV0LmJpbmRFdmVudHMoKVxuICAgICAgICByZXQuaXNJbkRPTSA9IHRydWVcblxuICAgICAgIyA3OiBDcmVhdGUgdGhlIGFsbCBpbXBvcnRhbnQgJ21ha2UnIG1ldGhvZFxuICAgICAgZXhwb3J0cy5hZGRNYWtlTWV0aG9kIHJldCwgY291bnRcblxuICAgICAgIyA4OiBQcmV2ZW50IGR1cGxpY2F0ZSBmYWN0b3J5IGV4dGVuc2lvbiBieSBzZXR0aW5nIGlzIGluaXQgPSB0cnVlXG4gICAgICByZXQuaXNGdWxseUluaXQgPSB0cnVlXG5cbiAgICAgICMgOTogaWYgdGhlIG5vZGUgc3VwcG9ydHMgaXQsIGNhbGwgZmluYWxpemVcbiAgICAgIGZpbmFsaXplID0gXy5vbmNlIHJldC5maW5hbGl6ZSBvciBPSi5ub29wXG4gICAgICByZXQuZmluYWxpemUgPSBmaW5hbGl6ZVxuICAgICAgZmluYWxpemUgcmV0XG5cbiAgIyAxMDogUmV0dXJuIHRoZSBleHRlbmRlZCBlbGVtZW50XG4gIHJldFxuXG5cbk9KLm5vZGVzLnJlZ2lzdGVyICdmYWN0b3J5JywgZXhwb3J0cy5tYWtlXG5PSi5ub2Rlcy5yZWdpc3RlciAnZ2V0JywgZXhwb3J0cy5nZXRcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1xuXG5cbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5lbCA9IHJlcXVpcmUgJy4uL2RvbS9lbGVtZW50J1xuXG4jICMgYVxubm9kZU5hbWUgPSAnYSdcblxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgaWQ6ICcnXG4gICAgICBjbGFzczogJydcbiAgICAgIHRleHQ6ICcnXG4gICAgICBocmVmOiAnamF2YVNjcmlwdDp2b2lkKDApOydcbiAgICAgIHR5cGU6ICcnXG4gICAgICB0aXRsZTogJydcbiAgICAgIHJlbDogJydcbiAgICAgIG1lZGlhOiAnJ1xuICAgICAgdGFyZ2V0OiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgdG9nZ2xlU3RhdGUgPSAnb2ZmJ1xuXG4gIHRvZ2dsZSA9IC0+XG4gICAgaWYgdG9nZ2xlU3RhdGUgaXMgJ29uJ1xuICAgICAgdG9nZ2xlU3RhdGUgPSAnb2ZmJ1xuICAgIGVsc2UgdG9nZ2xlU3RhdGUgPSAnb24nICBpZiB0b2dnbGVTdGF0ZSBpcyAnb2ZmJ1xuICAgIHJldHVyblxuXG4gICMgQ2xpY2sgYmluZGluZ1xuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcbiAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cbiAgICAgIHRvZ2dsZSgpXG4gICAgICByZXRWYWwgPSBjbGljayBldmVudC4uLlxuICAgICAgaWYgZGVmYXVsdHMuaHJlZiBpcyAnIycgdGhlbiByZXRWYWwgPSBmYWxzZVxuICAgICAgcmV0VmFsXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcbiAgZWxzZVxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IHRvZ2dsZVxuXG4gIHJldCA9IGVsLmVsZW1lbnQgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcblxuICByZXRcblxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxuXG5cbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5lbCA9IHJlcXVpcmUgJy4uL2RvbS9lbGVtZW50J1xudG8gPSByZXF1aXJlICcuLi90b29scy90bydcbiMgIyBiclxuXG5ub2RlTmFtZSA9ICdicidcblxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOiB7fVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuICAgIG51bWJlcjogMVxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICBpID0gMFxuICB3aGlsZSBpIDwgdG8ubnVtYmVyIGRlZmF1bHRzLm51bWJlclxuICAgICMgSW4gdGhlIGNhc2Ugb2YgbXVsdGlwbGUgYnJzLCBpdCBpcyBkZXNpcmFibGUgdG8gb25seSBnZXQgdGhlIGxhc3Qgb25lIG91dFxuICAgIHJldCA9IGVsLmVsZW1lbnQgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcblxuICAgIGkgKz0gMVxuXG4gIGlmIGZhbHNlIGlzIGNhbGxlZEZyb21GYWN0b3J5IHRoZW4gbm9kZXNGYWN0b3J5IHJldCwgb3duZXJcblxuICByZXRcblxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxuXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuZWwgPSByZXF1aXJlICcuLi9kb20vZWxlbWVudCdcblxuIyAjIGZvcm1cblxubm9kZU5hbWUgPSAnZm9ybSdcblxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgYWN0aW9uOiAnJ1xuICAgICAgbWV0aG9kOiAnJ1xuICAgICAgbmFtZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgcmV0ID0gZWwuZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxuXG4gIHJldC5hZGQgJ3ZhbGlkYXRvcicsIHJldC4kLnZhbGlkYXRlKFxuICAgIGhpZ2hsaWdodDogKGVsZW1lbnQpIC0+XG4gICAgICAkZWxtID0gJChlbGVtZW50KVxuICAgICAgJGVsbS5hdHRyICdPSl9pbnZhbGlkJywgJzEnXG4gICAgICAkZWxtLmFuaW1hdGUgYmFja2dyb3VuZENvbG9yOiAncmVkJ1xuICAgICAgbnVsbFxuXG4gICAgdW5oaWdobGlnaHQ6IChlbGVtZW50KSAtPlxuICAgICAgJGVsbSA9ICQoZWxlbWVudClcbiAgICAgIGlmICRlbG0uYXR0cignT0pfaW52YWxpZCcpIGlzICcxJ1xuICAgICAgICAkZWxtLmNzcyAnYmFja2dyb3VuZC1jb2xvcicsICd5ZWxsb3cnXG4gICAgICAgICRlbG0uYXR0ciAnT0pfaW52YWxpZCcsICcwJ1xuICAgICAgICBzZXRUaW1lb3V0ICgtPlxuICAgICAgICAgICRlbG0uYW5pbWF0ZSBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcbiAgICAgICAgKSwgNTAwXG4gICAgICBudWxsXG4gIClcblxuICByZXQuYWRkICdpc0Zvcm1WYWxpZCcsIC0+XG4gICAgcmV0LiQudmFsaWQoKSBhbmQgKG5vdCByZXQudmFsaWRhdG9yLmludmFsaWRFbGVtZW50cygpIG9yIHJldC52YWxpZGF0b3IuaW52YWxpZEVsZW1lbnRzKCkubGVuZ3RoIGlzIDApXG5cbiBcblxuICByZXRcblxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxuXG5cblxuXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuZWwgPSByZXF1aXJlICcuLi9kb20vZWxlbWVudCdcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXG5cbiMgIyBpbnB1dFxuXG5ub2RlTmFtZSA9ICdpbnB1dCdcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgdmFsdWU6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG4gICAgICBjaGFuZ2U6IE9KLm5vb3BcbiAgICAgIGZvY3Vzb3V0OiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgaWYgbm90IGRlZmF1bHRzLnByb3BzLnR5cGUgb3Igbm90IGVudW1zLmlucHV0VHlwZXNbZGVmYXVsdHMucHJvcHMudHlwZV1cbiAgICB0aHJvdyBuZXcgRXJyb3IgJ05vIG1hdGNoaW5nIGlucHV0IHR5cGUgZm9yIHsnICsgZGVmYXVsdHMucHJvcHMudHlwZSArICd9IGNvdWxkIGJlIGZvdW5kLidcbiAgdGhpc1R5cGUgPSBlbnVtcy5pbnB1dFR5cGVzW2RlZmF1bHRzLnByb3BzLnR5cGVdXG5cbiAgc3luY1ZhbHVlID0gLT5cbiAgICBzd2l0Y2ggdGhpc1R5cGVcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5jaGVja2JveFxuICAgICAgICByZXQudmFsdWUgPSByZXQuJC5pcyAnOmNoZWNrZWQnXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMucmFkaW9cbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LiQuZmluZCgnOmNoZWNrZWQnKS52YWwoKVxuICAgICAgZWxzZVxuICAgICAgICByZXQudmFsdWUgPSByZXQudmFsKClcbiAgICBkZWZhdWx0cy5wcm9wcy52YWx1ZSA9IHJldC52YWx1ZSAgICBcbiAgICByZXQudmFsdWVcblxuICAjIyNcbiAgICBDbGljayBiaW5kaW5nLiBJZiB0aGUgY2FsbGVyIGRlZmluZWQgYSBjbGljayBoYW5kbGVyLFxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcbiAgICB0aGVuIGNhbGwgdGhlIGRlZmluZWQgY2xpY2sgaGFuZGxlciB3aXRoIHRoZSBsYXRlc3QgdmFsdWUuXG4gICMjI1xuICBvbGRDbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xuICBpZiBvbGRDbGljayBhbmQgb2xkQ2xpY2sgaXNudCBPSi5ub29wXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XG4gICAgICBzeW5jVmFsdWUoKVxuICAgICAgb2xkQ2xpY2sgcmV0LnZhbHVlLCBldmVudC4uLlxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXG5cbiAgIyMjXG4gICAgQ2hhbmdlIGJpbmRpbmcuIElmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGNoYW5nZSBoYW5kbGVyLFxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcbiAgICB0aGVuIGNhbGwgdGhlIGRlZmluZWQgY2hhbmdlIGhhbmRsZXIgd2l0aCB0aGUgbGF0ZXN0IHZhbHVlLlxuICAjIyNcbiAgb2xkQ2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxuICBpZiBvbGRDaGFuZ2UgYW5kIG9sZENoYW5nZSBpc250IE9KLm5vb3BcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XG4gICAgICBzeW5jVmFsdWUoKVxuICAgICAgb2xkQ2hhbmdlIHJldC52YWx1ZSwgZXZlbnQuLi5cbiAgICBkZWZhdWx0cy5ldmVudHMuY2hhbmdlID0gbmV3Q2hhbmdlXG5cbiAgIyMjXG4gICAgT24gRm9jdXMgT3V0IGJpbmRpbmcuIEFsd2F5cyB1c2UgdGhlIGV2ZW50IHRvIHVwZGF0ZSB0aGUgaW50ZXJuYWxcbiAgICB2YWx1ZSBvZiB0aGUgY29udHJvbDsgYW5kIGlmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGZvY3Vzb3V0IGV2ZW50LFxuICAgIHdyYXAgaXQgYW5kIGludm9rZSBpdCB3aXRoIHRoZSBsYXRlc3QgdmFsdWVcbiAgIyMjXG4gIG9sZEZvY3Vzb3V0ID0gZGVmYXVsdHMuZXZlbnRzLmZvY3Vzb3V0XG4gIG5ld0ZvY3Vzb3V0ID0gKGV2ZW50Li4uKSAtPlxuICAgIHN5bmNWYWx1ZSgpXG4gICAgaWYgb2xkRm9jdXNvdXQgYW5kIG9sZEZvY3Vzb3V0IGlzbnQgT0oubm9vcFxuICAgICAgb2xkRm9jdXNvdXQgcmV0LnZhbHVlLCBldmVudC4uLlxuXG4gIGRlZmF1bHRzLmV2ZW50cy5mb2N1c291dCA9IG5ld0ZvY3Vzb3V0XG5cblxuICByZXQgPSBlbC5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XG4gIHJldC52YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXG4gIHJldFxuXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbmVsID0gcmVxdWlyZSAnLi4vZG9tL2VsZW1lbnQnXG5cbiMgIyBvbFxuXG5ub2RlTmFtZSA9ICdvbCdcblxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOiB7fVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBlbC5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XG5cblxuIFxuXG4gIHJldFxuXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbmVsID0gcmVxdWlyZSAnLi4vZG9tL2VsZW1lbnQnXG5cbiMgIyBzZWxlY3Rcblxubm9kZU5hbWUgPSAnc2VsZWN0J1xuXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gcmVxdWlyZSAnLi4vZG9tL2JvZHknLCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHNlbGVjdGVkOiAnJ1xuICAgICAgbXVsdGlwbGU6IGZhbHNlXG4gICAgc3R5bGVzOiB7fVxuICAgIHZhbHVlczogW11cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuICAgICAgY2hhbmdlOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgdmFsdWUgPSAnJ1xuICB2YWx1ZXMgPSBbXVxuICBoYXNFbXB0eSA9IGZhbHNlXG5cbiAgc3luY1ZhbHVlID0gLT5cbiAgICB2YWx1ZSA9IHJldC52YWwoKVxuXG4gICMgQ2xpY2sgYmluZGluZ1xuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcbiAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXG4gICAgICBzeW5jVmFsdWUoKVxuICAgICAgcmV0dmFsXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcblxuICAjIENoYW5nZSBiaW5kaW5nXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXG4gICAgY2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxuICAgIG5ld0NoYW5nZSA9IChldmVudC4uLikgLT5cbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxuICAgICAgc3luY1ZhbHVlKClcbiAgICAgIHJldHZhbFxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcblxuICByZXQgPSBlbC5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XG5cbiAgcmV0LmFkZCAnc2VsZWN0ZWREYXRhJywgKHByb3BOYW1lKSAtPlxuICAgIHJldCA9ICcnXG4gICAgaWYgcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykgYW5kIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdXG4gICAgICBkYXRhc2V0ID0gcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0uZGF0YXNldFxuICAgICAgcmV0ID0gZGF0YXNldFtwcm9wTmFtZV0gIGlmIGRhdGFzZXRcbiAgICByZXRcblxuICByZXQuYWRkICdzZWxlY3RlZFRleHQnLCAtPlxuICAgIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnRleHQoKVxuXG4gIHJldC5hZGQgJ3NlbGVjdGVkVmFsJywgLT5cbiAgICB2YWx1ZSA9IHJldC52YWwoKVxuICAgIHZhbHVlXG5cbiAgcmV0LmFkZCAnYWRkT3B0aW9uJywgKHZhbHVlLCB0ZXh0ID0gdmFsdWUsIHNlbGVjdGVkID0gZmFsc2UsIGRpc2FibGVkID0gZmFsc2UpIC0+XG4gICAgaXNFbXB0eSA9IF8uaXNFbXB0eSB2YWx1ZVxuICAgIGFkZCA9IGZhbHNlXG4gICAgaWYgaXNFbXB0eSBhbmQgZmFsc2UgaXMgaGFzRW1wdHlcbiAgICAgIGhhc0VtcHR5ID0gdHJ1ZVxuICAgICAgYWRkID0gdHJ1ZVxuICAgIGlmIGZhbHNlIGlzIGFkZCBhbmQgZmFsc2UgaXMgaXNFbXB0eSB0aGVuIGFkZCA9IHRydWVcbiAgICBpZiBhZGRcbiAgICAgIHZhbCA9XG4gICAgICAgIHRleHQ6IHRleHRcbiAgICAgICAgcHJvcHM6XG4gICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICBpZiBzZWxlY3RlZFxuICAgICAgICB2YWwuc2VsZWN0ZWQgPSBzZWxlY3RlZFxuICAgICAgaWYgZGlzYWJsZWRcbiAgICAgICAgdmFsLmRpc2FibGVkID0gZGlzYWJsZWRcbiAgICAgIG9wdGlvbiA9IHJldC5tYWtlICdvcHRpb24nLCB2YWxcbiAgICAgIG9wdGlvblxuXG4gIHJldC5hZGQgJ2FkZE9wdGlvbnMnLCAob3B0aW9ucykgLT5cbiAgICB2YWx1ZXMgPSBfLnVuaW9uIHZhbHVlcywgb3B0aW9uc1xuICAgIE9KLmVhY2ggb3B0aW9ucywgKCh2YWwpIC0+XG4gICAgICB2YWx1ZSA9IHJldC5hZGRPcHRpb24odmFsKVxuICAgICAgdmFsdWVzLnB1c2ggdmFsdWVcbiAgICApLCBmYWxzZVxuICAgIHZhbHVlc1xuXG4gIHJldC5hZGQgJ3Jlc2V0T3B0aW9ucycsICh2YWx1ZXMpIC0+XG4gICAgcmV0LmVtcHR5KClcbiAgICB2YWx1ZXMgPSB2YWx1ZXNcbiAgICByZXQuYWRkT3B0aW9ucyB2YWx1ZXNcbiAgICByZXRcblxuICByZXQuYWRkICdyZW1vdmVPcHRpb24nLCAodmFsdWVUb1JlbW92ZSkgLT5cbiAgICB2YWx1ZXMuc3BsaWNlIHZhbHVlcy5pbmRleE9mKHZhbHVlVG9SZW1vdmUpLCAxICNyZW1vdmVzIHRoZSBpdGVtIGZyb20gdGhlIGxpc3RcbiAgICBzZWxlY3RDb250cm9sID0gcmV0WzBdXG4gICAgaSA9IDBcblxuICAgIHdoaWxlIGkgPCBzZWxlY3RDb250cm9sLmxlbmd0aFxuICAgICAgc2VsZWN0Q29udHJvbC5yZW1vdmUgaSAgaWYgc2VsZWN0Q29udHJvbC5vcHRpb25zW2ldLnZhbHVlIGlzIHZhbHVlVG9SZW1vdmVcbiAgICAgIGkrK1xuICAgIG51bGxcblxuXG5cbiAgaWYgZGVmYXVsdHMudmFsdWVzLmxlbmd0aCA+IDBcbiAgICByZXQuYWRkT3B0aW9ucyBkZWZhdWx0cy52YWx1ZXNcblxuIFxuXG4gIHJldFxuXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbmVsID0gcmVxdWlyZSAnLi4vZG9tL2VsZW1lbnQnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuYXJyYXkyRCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FycmF5MkQnXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuSnNvblRvVGFibGUgPSByZXF1aXJlICcuLi90b29scy9Kc29uVG9UYWJsZSdcblxuIyAjIHRhYmxlXG5cbm5vZGVOYW1lID0gJ3RhYmxlJ1xuXG4jIyNcbkNyZWF0ZSBhbiBIVE1MIHRhYmxlLiBQcm92aWRlcyBoZWxwZXIgbWV0aG9kcyB0byBjcmVhdGUgQ29sdW1ucyBhbmQgQ2VsbHMuXG4jIyNcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuXG4gICMgIyMgb3B0aW9uc1xuICBkZWZhdWx0cyA9XG4gICAgIyAjIyMgZGF0YVxuICAgICMgb3B0aW9uYWwgYXJyYXkgb2Ygb2JqZWN0cy4gaWYgcHJvdmlkZWQgd2lsbCBnZW5lcmF0ZSB0YWJsZSBhdXRvbWF0aWNhbGx5LlxuICAgIGRhdGE6IG51bGxcbiAgICAjICMjIyBwcm9wc1xuICAgICMgb3B0aW9uYWwgcHJvcGVydGllcyB0byBhcHBseSB0byB0YWJsZSByb290IG5vZGVcbiAgICBwcm9wczpcbiAgICAgIGNlbGxwYWRkaW5nOiAwXG4gICAgICBjZWxsc3BhY2luZzogMFxuICAgICAgYWxpZ246ICcnXG4gICAgICB3aWR0aDogJydcbiAgICAgIGNlbGxhbGlnbjogJ2xlZnQnXG4gICAgICBjZWxsdmFsaWduOiAndG9wJ1xuICAgICAgY2xhc3M6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czoge31cbiAgICAjICMjIyBjZWxsc1xuICAgICMgb3B0aW9uYWwgcHJvcGVydGllcyB0byBhcHBseSB0byBpbmRpdmlkdWFsIGNlbGxzXG4gICAgY2VsbHM6XG4gICAgICBjbGFzczogJydcbiAgICAgIGFsaWduOiAnJ1xuICAgICAgJ3ZlcnRpY2FsLWFsaWduJzogJydcbiAgICAgIGNlbGxwYWRkaW5nOiAnJ1xuICAgICAgbWFyZ2luOiAnJ1xuICAgICMgIyMjIHRoZWFkXG4gICAgIyBvcHRpb25hbCBvcHRpb25zIG9iamVjdCB0byBwYXNzIGludG8gdGhlYWQgY3JlYXRpb25cbiAgICB0aGVhZDoge31cbiAgICAjICMjIyB0Ym9keVxuICAgICMgb3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdG8gcGFzcyBpbnRvIHRib2R5IGNyZWF0aW9uXG4gICAgdGJvZHk6IHt9XG5cbiAgICBmaXJzdEFsaWduUmlnaHQ6IGZhbHNlXG4gICAgb2RkQWxpZ25SaWdodDogZmFsc2VcblxuICByb3dzID0gW11cbiAgY2VsbHMgPSBhcnJheTJEKClcbiAgY29sdW1uQ291bnQgPSAwXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG4gIHJldCA9IGVsLmVsZW1lbnQgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcbiBcblxuICB0Ym9keSA9IG51bGxcbiAgdGhlYWQgPSBudWxsXG4gIHRoZWFkUm93ID0gbnVsbFxuXG4gICMgIyMjIGluaXRcbiAgIyBpbnRlcm5hbCBtZXRob2QgZm9yIG9uZSB0aW1lIGluaXRpYWxpemF0aW9uIG9mIHRoZSB0YWJsZVxuICBpbml0ID0gXy5vbmNlIC0+XG4gICAgaWYgZGVmYXVsdHMuZGF0YVxuICAgICAgajJ0ID0gbmV3IEpzb25Ub1RhYmxlIGRlZmF1bHRzLmRhdGFcclxuICAgICAgdGJsU3RyID0gajJ0LnRhYmxlXG4gICAgaWYgdGJsU3RyXG4gICAgICBqVGJsID0gJCB0YmxTdHJcblxuICAgICAgakhlYWQgPSBqVGJsLmZpbmQgJ3RoZWFkJ1xuICAgICAgcmV0LiQuYXBwZW5kIGpIZWFkXG4gICAgICB0aGVhZCA9IGVsLnJlc3RvcmVFbGVtZW50IGpIZWFkWzBdXG4gICAgICB0aGVhZFJvdyA9IGVsLnJlc3RvcmVFbGVtZW50IHRoZWFkWzBdLnJvd3NbMF1cblxuICAgICAgakJvZHkgPSBqVGJsLmZpbmQgJ3Rib2R5J1xuICAgICAgcmV0LiQuYXBwZW5kIGpCb2R5XG4gICAgICB0Ym9keSA9IGVsLnJlc3RvcmVFbGVtZW50IGpCb2R5WzBdXG5cbiAgICAgIGxvYWRDZWxscygpXG4gICAgZWxzZVxuICAgICAgdGhlYWQgPSByZXQubWFrZSAndGhlYWQnLCBkZWZhdWx0cy50aGVhZFxuICAgICAgdGhlYWRSb3cgPSB0aGVhZC5tYWtlICd0cidcbiAgICAgIHRib2R5ID0gcmV0Lm1ha2UgJ3Rib2R5JywgZGVmYXVsdHMudGJvZHlcbiAgICAgIHJvd3MucHVzaCB0Ym9keS5tYWtlICd0cidcbiAgICByZXRcblxuICAjICMjIyBsb2FkQ2VsbHNcbiAgIyBpbnRlcm5hbCBtZXRob2QgZ3VhcmFudGVlcyB0aGF0IHRhYmxlcyBsb2FkZWQgZnJvbSBKU09OIGFyZSBmdWxseSBsb2FkZWQgaW50byBtZW1vcnlcbiAgbG9hZENlbGxzID0gKCkgLT5cbiAgICByID0gMFxuICAgIHdoaWxlIHRib2R5WzBdLnJvd3MubGVuZ3RoID4gclxuICAgICAgYyA9IDBcbiAgICAgIG1lbVJvdyA9IGVsLnJlc3RvcmVFbGVtZW50IHRib2R5WzBdLnJvd3Nbcl1cbiAgICAgIHJvd3MucHVzaCBtZW1Sb3dcbiAgICAgIHdoaWxlIHRib2R5WzBdLnJvd3Nbcl0uY2VsbHMubGVuZ3RoID4gY1xuICAgICAgICBtZW1DZWxsID0gY2VsbHMuZ2V0IHIrMSwgYysxXG4gICAgICAgIGlmIG5vdCBtZW1DZWxsXG4gICAgICAgICAgbWVtQ2VsbCA9IGVsLnJlc3RvcmVFbGVtZW50IHRib2R5WzBdLnJvd3Nbcl0uY2VsbHNbY11cbiAgICAgICAgICBjZWxscy5zZXQgcisxLCBjKzEsIG1lbUNlbGxcbiAgICAgICAgYyArPSAxXG4gICAgICByICs9IDFcblxuICAjICMjIyBmaWxsTWlzc2luZ1xuICAjIGludGVybmFsIG1ldGhvZCBndWFyYW50ZWVzIHRoYXQgY2VsbHMgZXhpc3QgZm9yIHRoZSBkaW1lbnNpb25zIG9mIHRoZSB0YWJsZVxuICBmaWxsTWlzc2luZyA9ICgpIC0+XG4gICAgY2VsbHMuZWFjaCAocm93Tm8sIGNvbE5vLCB2YWwpIC0+XG4gICAgICBpZiBub3QgdmFsXG4gICAgICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cbiAgICAgICAgcm93LmNlbGwgY29sTm8sIHt9XG5cbiAgIyAjIyBjb2x1bW5cbiAgIyBBZGRzIGEgY29sdW1uIG5hbWUgdG8gdGhlIHRhYmxlIGhlYWRcbiAgcmV0LmFkZCAnY29sdW1uJywgKGNvbE5vLCBjb2xOYW1lKSAtPlxuICAgIHJldC5pbml0KClcbiAgICBjb2x1bW5Db3VudCArPSAxXG4gICAgdGggPSBudWxsXG4gICAgaSA9IDBcbiAgICB3aGlsZSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzLmxlbmd0aCA8IGNvbE5vXG4gICAgICBuYXRpdmVUaCA9IHRoZWFkWzBdLnJvd3NbMF0uY2VsbHNbaV1cbiAgICAgIGlmIG5vdCBuYXRpdmVUaFxuICAgICAgICB0aCA9IHRoZWFkUm93Lm1ha2UgJ3RoJywge31cbiAgICAgIGVsc2VcbiAgICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudCBuYXRpdmVUaCwgJ3RoJ1xuICAgICAgaSArPSAxXG4gICAgaWYgbm90IHRoXG4gICAgICBuYXRpdmVUaCA9IHRoZWFkWzBdLnJvd3NbMF0uY2VsbHNbY29sTm8tMV1cbiAgICAgIHRoID0gZWwucmVzdG9yZUVsZW1lbnQgbmF0aXZlVGgsICd0aCdcbiAgICB0aC50ZXh0IGNvbE5hbWVcbiAgICB0aFxuXG4gICMgIyMgcm93XG4gICMgQWRkcyBhIG5ldyByb3cgKHRyKSB0byB0aGUgdGFibGUgYm9keVxuICByZXQuYWRkICdyb3cnLCAocm93Tm8sIG9wdHMpIC0+XG4gICAgcm93ID0gcm93c1tyb3dOby0xXVxuXG4gICAgaWYgbm90IHJvd1xuICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xuICAgICAgICByb3cgPSB0Ym9keS5tYWtlICd0cicsIHt9XG4gICAgICAgIHJvd3MucHVzaCByb3dcblxuICAgIGlmIG5vdCByb3cuY2VsbFxuICAgICAgcm93LmFkZCAnY2VsbCcsIChjb2xObywgb3B0cykgLT5cbiAgICAgICAgY2VsbCA9IE9KLm5vZGVzLnRkIG9wdHMsIHJvd1xuICAgICAgICBjZWxscy5zZXQgcm93Tm8sIGNvbE5vLCBjZWxsXG4gICAgICAgIGNlbGxcblxuICAgIHJvd1xuXG4gICMgIyMgY2VsbFxuICAjIEFkZHMgYSBjZWxsICh0ci90ZCkgdG8gdGhlIHRhYmxlIGJvZHlcbiAgcmV0LmFkZCAnY2VsbCcsIChyb3dObywgY29sTm8sIG9wdHMpIC0+XG4gICAgaWYgcm93Tm8gPCAxIHRoZW4gcm93Tm8gPSAxXG4gICAgaWYgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXG4gICAgaWYgY29sdW1uQ291bnQgPiAwIGFuZCBjb2xOby0xID4gY29sdW1uQ291bnQgdGhlbiB0aHJvdyBuZXcgRXJyb3IgJ0EgY29sdW1uIG5hbWUgaGFzIG5vdCBiZWVuIGRlZmluZWQgZm9yIHRoaXMgcG9zaXRpb24geycgKyByb3dObyArICd4JyArIGNvbE5vICsgJ30uJ1xuXG4gICAgcm93ID0gcmV0LnJvdyByb3dOb1xuXG4gICAgY2VsbCA9IGNlbGxzLmdldCByb3dObywgY29sTm9cblxuICAgIGlmIG5vdCBjZWxsXG4gICAgICBpID0gMFxuICAgICAgd2hpbGUgaSA8IGNvbE5vXG4gICAgICAgIGkgKz0gMVxuICAgICAgICBpZiBpIGlzIGNvbE5vXG4gICAgICAgICAgbnVPcHRzID0gT0ouZXh0ZW5kIHtwcm9wczogZGVmYXVsdHMuY2VsbHN9LCBvcHRzXG4gICAgICAgICAgY2VsbCA9IHJvdy5jZWxsIGNvbE5vLCBudU9wdHNcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRyeUNlbGwgPSBjZWxscy5nZXQgcm93Tm8sIGlcbiAgICAgICAgICBpZiBub3QgdHJ5Q2VsbFxuICAgICAgICAgICAgdHJ5Q2VsbCA9ICByb3cuY2VsbCBpLCBwcm9wczogZGVmYXVsdHMuY2VsbHNcblxuICAgIGNlbGxcblxuXG5cbiAgIyAjIyBGaW5hbGl6ZVxuICAjIEZpbmFsaXplIGd1YXJhbnRlZXMgdGhhdCB0aGVhZCBhbmQgdGJvZHkgYW5kIGNyZWF0ZWQgd2hlbiB0aGUgbm9kZSBpcyBmdWxseSBpbnN0YW50aWF0ZWRcbiAgcmV0LmFkZCAnZmluYWxpemUnLCAtPlxuICAgIGluaXQoKVxuXG4gICAgIyAjIyBUSGVhZFxuICAgICMgRXhwb3NlIHRoZSBpbnRlcm5hbCB0aGVhZCBub2RlXG4gICAgcmV0LmFkZCAndGhlYWQnLCB0aGVhZFxuXG4gICAgIyAjIyBUQm9keVxuICAgICMgRXhwb3NlIHRoZSBpbnRlcm5hbCB0Ym9keSBub2RlXG4gICAgcmV0LmFkZCAndGJvZHknLCB0Ym9keVxuXG4gICAgcmV0XG5cbiAgcmV0XG5cbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5lbCA9IHJlcXVpcmUgJy4uL2RvbS9lbGVtZW50J1xuZW51bXMgPSByZXF1aXJlICcuLi90b29scy9lbnVtcydcblxubm9kZU5hbWUgPSAndGV4dGFyZWEnXG5cbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIG5hbWU6ICcnXG4gICAgICBwbGFjZWhvbGRlcjogJydcbiAgICAgIHZhbHVlOiAnJ1xuICAgICAgdGV4dDogJydcbiAgICAgIG1heGxlbmd0aDogJydcbiAgICAgIGF1dG9mb2N1czogZmFsc2VcbiAgICAgIGlzUmVxdWlyZWQ6IGZhbHNlXG4gICAgICByb3dzOiAzXG4gICAgICBjb2xzOiAyNVxuICAgICAgZGlzYWJsZWQ6IGZhbHNlXG4gICAgICByZWFkb25seTogZmFsc2VcbiAgICAgIGZvcm06ICcnXG4gICAgICB3cmFwOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHZhbHVlID0gZGVmYXVsdHMucHJvcHMudmFsdWVcblxuICBzeW5jVmFsdWUgPSAtPlxuICAgIHN3aXRjaCBkZWZhdWx0cy5wcm9wcy50eXBlXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMuY2hlY2tib3hcbiAgICAgICAgdmFsdWUgPSByZXQuJC5pcygnOmNoZWNrZWQnKVxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLnJhZGlvXG4gICAgICAgIHZhbHVlID0gcmV0LiQuZmluZCgnOmNoZWNrZWQnKS52YWwoKVxuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZSA9IHJldC52YWwoKVxuXG4gICMgQ2xpY2sgYmluZGluZ1xuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcbiAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXG4gICAgICBzeW5jVmFsdWUoKVxuICAgICAgcmV0dmFsXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcblxuICAjIENoYW5nZSBiaW5kaW5nXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXG4gICAgY2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxuICAgIG5ld0NoYW5nZSA9IChldmVudC4uLikgLT5cbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxuICAgICAgc3luY1ZhbHVlKClcbiAgICAgIHJldHZhbFxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcblxuICByZXQgPSBlbC5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XG5cblxuIFxuXG4gIHJldFxuXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbmVsID0gcmVxdWlyZSAnLi4vZG9tL2VsZW1lbnQnXG5cbm5vZGVOYW1lID0gJ3RoZWFkJ1xuXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6IHt9XG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG4gICAgbnVtYmVyOiAxXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gZWwuZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxuXG4gXG5cbiAgcm93cyA9IFtdXG4gIGNlbGxzID0ge31cbiAgcmV0LmFkZCAnY2VsbCcsIChyb3dObywgY29sTm8pIC0+XG4gICAgaW5pdCgpXG5cbiAgICBpZiByb3dObyA8IDEgdGhlbiByb3dObyA9IDFcbiAgICBpZiBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcblxuICAgIHJvdyA9IHJvd3Nbcm93Tm8tMV1cblxuICAgIGlmIG5vdCByb3dcbiAgICAgIHdoaWxlIHJvd3MubGVuZ3RoIDwgcm93Tm9cbiAgICAgICAgcm93ID0gT0oubm9kZXMudHIge30sIHRib2R5LCBmYWxzZVxuICAgICAgICByb3dzLnB1c2ggcm93XG5cbiAgICB0ZCA9IHJvd1swXS5jZWxsc1tjb2xOb11cblxuICAgIGlmIHRkIHRoZW4gY2VsbCA9IGVsLnJlc3RvcmVFbGVtZW50IHRkLCAndGQnXG4gICAgaWYgbm90IHRkXG4gICAgICB3aGlsZSByb3dbMF0uY2VsbHMubGVuZ3RoIDwgY29sTm9cbiAgICAgICAgaWR4ID0gcm93WzBdLmNlbGxzLmxlbmd0aFxuICAgICAgICB0ZCA9IHJvd1swXS5jZWxsc1tpZHgtMV1cbiAgICAgICAgaWYgdGQgYW5kIGlkeCBpcyBjb2xOb1xuICAgICAgICAgIGNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCB0ZCwgJ3RkJ1xuICAgICAgICBlbHNlXG4gICAgICAgICAgY2VsbCA9IE9KLm5vZGVzLnRkIHByb3BzOiBkZWZhdWx0cy5jZWxscywgcm93LCBmYWxzZVxuXG4gICAgaWYgbm90IGNlbGwuaXNWYWxpZFxuICAgICAgbm9kZUZhY3RvcnkgY2VsbCwgcm93LCByb3dObyArIGNvbE5vXG5cbiAgICBjZWxsXG5cbiAgcmV0XG5cbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5lbCA9IHJlcXVpcmUgJy4uL2RvbS9lbGVtZW50J1xuXG5ub2RlTmFtZSA9ICd1bCdcblxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOiB7fVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBlbC5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XG5cblxuIFxuXG4gIHJldFxuXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwidGhpc0dsb2JhbCA9IChpZiAodHlwZW9mIGdsb2JhbCBpc250ICd1bmRlZmluZWQnIGFuZCBnbG9iYWwpIHRoZW4gZ2xvYmFsIGVsc2UgKGlmICh0eXBlb2Ygc2VsZiBpc250ICd1bmRlZmluZWQnIGFuZCBzZWxmKSB0aGVuIHNlbGYgZWxzZSAoaWYgKHR5cGVvZiB3aW5kb3cgaXNudCAndW5kZWZpbmVkJyBhbmQgd2luZG93KSB0aGVuIHdpbmRvdyBlbHNlIHRoaXMpKSlcbm1vZHVsZS5leHBvcnRzID0gdGhpc0dsb2JhbCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnYnV0dG9uaW5wdXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6ICdidXR0b24nXG4gICAgICBzcmM6ICcnXG4gICAgICBhbHQ6ICcnXG4gICAgICBoZWlnaHQ6ICcnXG4gICAgICB3aWR0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBvYmouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcblxuXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2NoZWNrYm94J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgY2hlY2tlZDogZmFsc2VcbiAgICBpbmRldGVybWluYXRlOiBmYWxzZVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICBpZiBkZWZhdWx0cy5jaGVja2VkXG4gICAgcmV0LmF0dHIgJ2NoZWNrZWQnLCB0cnVlXG4gIGVsc2UgaWYgZGVmYXVsdHMuaW5kZXRlcm1pbmF0ZVxuICAgIHJldC5hdHRyICdpbmRldGVybWluYXRlJywgdHJ1ZVxuXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2NvbG9yJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBvYmouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2RhdGUnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdkYXRldGltZSdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnZGF0ZXRpbWUtbG9jYWwnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2VtYWlsJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIG11bHRpcGxlOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2ZpbGUnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgYWNjZXB0OiAnJ1xuICAgICAgbXVsdGlwbGU6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnaGlkZGVuJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdpbWFnZWlucHV0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiAnaW1hZ2UnXG4gICAgICBzcmM6ICcnXG4gICAgICBhbHQ6ICcnXG4gICAgICBoZWlnaHQ6ICcnXG4gICAgICB3aWR0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdtb250aCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnbnVtYmVyJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdwYXNzd29yZCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgICBtYXhsZW5ndGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncmFkaW8nXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgbmFtZTogJydcbiAgICAgIHZhbHVlOiAnJ1xuICAgICAgY2hlY2tlZDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdyYW5nZSdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgICBtaW46IDBcbiAgICAgIG1heDogMTAwXG4gICAgICB2YWx1ZTogNTBcbiAgICAgIHN0ZXA6IDFcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdyZXNldCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnc2VhcmNoJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdzdWJtaXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3RlbCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgICBwYXR0ZXJuOiAnJ1xuICAgICAgbWF4bGVuZ3RoOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3RleHRpbnB1dCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogJ3RleHQnXG4gICAgICBhdXRvY29tcGxldGU6ICdvbidcbiAgICAgIGF1dG9zYXZlOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3RpbWUnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3VybCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgICBwYXR0ZXJuOiAnJ1xuICAgICAgbWF4bGVuZ3RoOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3dlZWsnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCIjICMgT0pcbnRoaXNHbG9iYWwgPSByZXF1aXJlICcuL2dsb2JhbCdcbnV0aWxMaWIgPSByZXF1aXJlICdqcXVlcnknXG5uYW1lU3BhY2VOYW1lID0gJ09KJ1xuXG4jIyNcbmJvb3Qgc3RyYXAgbmFtZSBtZXRob2QgaW50byBPYmplY3QgcHJvdG90eXBlXG4jIyNcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIE9iamVjdDo6LFxuICBnZXRJbnN0YW5jZU5hbWU6XG4gICAgdmFsdWU6IC0+XG4gICAgICBmdW5jTmFtZVJlZ2V4ID0gL2Z1bmN0aW9uICguezEsfSlcXCgvXG4gICAgICByZXN1bHRzID0gKGZ1bmNOYW1lUmVnZXgpLmV4ZWMoQGNvbnN0cnVjdG9yLnRvU3RyaW5nKCkpXG4gICAgICAoaWYgKHJlc3VsdHMgYW5kIHJlc3VsdHMubGVuZ3RoID4gMSkgdGhlbiByZXN1bHRzWzFdIGVsc2UgJycpXG5cblxuIyMjXG5BbiBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgbmFtZXNwYWNlIHRyZWVcbiMjI1xuTnNUcmVlID0ge31cbm1ha2VUaGVKdWljZSA9IC0+XG5cbiAgIyMjXG4gIEludGVybmFsIG5hbWVTcGFjZU5hbWUgbWV0aG9kIHRvIGNyZWF0ZSBuZXcgJ3N1YicgbmFtZXNwYWNlcyBvbiBhcmJpdHJhcnkgY2hpbGQgb2JqZWN0cy5cbiAgIyMjXG4gIG1ha2VOYW1lU3BhY2UgPSAoc3BhY2VuYW1lLCB0cmVlKSAtPlxuICAgICMjI1xuICAgIFRoZSBkZXJpdmVkIGluc3RhbmNlIHRvIGJlIGNvbnN0cnVjdGVkXG4gICAgIyMjXG4gICAgQmFzZSA9IChuc05hbWUpIC0+XG4gICAgICBwcm90byA9IHRoaXNcbiAgICAgIHRyZWVbbnNOYW1lXSA9IHRyZWVbbnNOYW1lXSBvciB7fVxuICAgICAgbnNUcmVlID0gdHJlZVtuc05hbWVdXG4gICAgICBtZW1iZXJzID0ge31cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoaXMsICdtZW1iZXJzJywgdmFsdWU6IG1lbWJlcnNcblxuICAgICAgIyMjXG4gICAgICBSZWdpc3RlciAoZS5nLiAnTGlmdCcpIGFuIE9iamVjdCBpbnRvIHRoZSBwcm90b3R5cGUgb2YgdGhlIG5hbWVzcGFjZS5cbiAgICAgIFRoaXMgT2JqZWN0IHdpbGwgYmUgcmVhZGFibGUvZXhlY3V0YWJsZSBidXQgaXMgb3RoZXJ3aXNlIGltbXV0YWJsZS5cbiAgICAgICMjI1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5IHRoaXMsICdyZWdpc3RlcicsXG4gICAgICAgIHZhbHVlOiAobmFtZSwgb2JqLCBlbnVtZXJhYmxlKSAtPlxuICAgICAgICAgICd1c2Ugc3RyaWN0J1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIG5hbWUuJykgIGlmICh0eXBlb2YgbmFtZSBpc250ICdzdHJpbmcnKSBvciBuYW1lIGlzICcnXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgbGlmdCBhIG5ldyBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgcHJvcGVydHkgaW5zdGFuY2UuJykgIHVubGVzcyBvYmpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3BlcnR5IG5hbWVkICcgKyBuYW1lICsgJyBpcyBhbHJlYWR5IGRlZmluZWQgb24gJyArIHNwYWNlbmFtZSArICcuJykgIGlmIHByb3RvW25hbWVdXG5cbiAgICAgICAgICBtZW1iZXJzW25hbWVdID0gbWVtYmVyc1tuYW1lXSBvciBuYW1lXG5cbiAgICAgICAgICAjR3VhcmQgYWdhaW5zdCBvYmxpdGVyYXRpbmcgdGhlIHRyZWUgYXMgdGhlIHRyZWUgaXMgcmVjdXJzaXZlbHkgZXh0ZW5kZWRcbiAgICAgICAgICBuc1RyZWVbbmFtZV0gPSBuc1RyZWVbbmFtZV0gb3JcbiAgICAgICAgICAgIG5hbWU6IG5hbWVcbiAgICAgICAgICAgIHR5cGU6IHR5cGVvZiBvYmpcbiAgICAgICAgICAgIGluc3RhbmNlOiAoaWYgb2JqLmdldEluc3RhbmNlTmFtZSB0aGVuIG9iai5nZXRJbnN0YW5jZU5hbWUoKSBlbHNlICd1bmtub3duJylcblxuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBwcm90bywgbmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBvYmpcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlIGlzbnQgZW51bWVyYWJsZVxuXG4gICAgICAgICAgbnNJbnRlcm5hbC5hbGVydERlcGVuZGVudHMgbnNOYW1lICsgJy4nICsgc3BhY2VuYW1lICsgJy4nICsgbmFtZVxuICAgICAgICAgIG9ialxuXG5cbiAgICAgICMjI1xuICAgICAgQ3JlYXRlIGEgbmV3LCBzdGF0aWMgbmFtZXNwYWNlIG9uIHRoZSBjdXJyZW50IHBhcmVudCAoZS5nLiBuc05hbWUudG8uLi4gfHwgbnNOYW1lLmlzLi4uKVxuICAgICAgIyMjXG4gICAgICBwcm90by5yZWdpc3RlciAnbWFrZVN1Yk5hbWVTcGFjZScsICgoc3ViTmFtZVNwYWNlKSAtPlxuICAgICAgICAndXNlIHN0cmljdCdcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY3JlYXRlIGEgbmV3IHN1YiBuYW1lc3BhY2Ugd2l0aG91dCBhIHZhbGlkIG5hbWUuJykgIGlmICh0eXBlb2Ygc3ViTmFtZVNwYWNlIGlzbnQgJ3N0cmluZycpIG9yIHN1Yk5hbWVTcGFjZSBpcyAnJ1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1YiBuYW1lc3BhY2UgbmFtZWQgJyArIHN1Yk5hbWVTcGFjZSArICcgaXMgYWxyZWFkeSBkZWZpbmVkIG9uICcgKyBzcGFjZW5hbWUgKyAnLicpICBpZiBwcm90by5zdWJOYW1lU3BhY2VcbiAgICAgICAgbnNJbnRlcm5hbC5hbGVydERlcGVuZGVudHMgbnNOYW1lICsgJy4nICsgc3ViTmFtZVNwYWNlXG4gICAgICAgIG5ld05hbWVTcGFjZSA9IG1ha2VOYW1lU3BhY2Uoc3ViTmFtZVNwYWNlLCBuc1RyZWUpXG4gICAgICAgIG5ld05hbWVTcGFjZS5yZWdpc3RlciAnY29uc3RhbnRzJywgbWFrZU5hbWVTcGFjZSgnY29uc3RhbnRzJywgbnNUcmVlKSwgZmFsc2UgIGlmIHN1Yk5hbWVTcGFjZSBpc250ICdjb25zdGFudHMnXG4gICAgICAgIHByb3RvLnJlZ2lzdGVyIHN1Yk5hbWVTcGFjZSwgbmV3TmFtZVNwYWNlLCBmYWxzZVxuICAgICAgICBuZXdOYW1lU3BhY2VcbiAgICAgICksIGZhbHNlXG4gICAgICByZXR1cm5cblxuICAgICMjI1xuICAgIEFuIGludGVybmFsIG1lY2hhbmlzbSB0byByZXByZXNlbnQgdGhlIGluc3RhbmNlIG9mIHRoaXMgbmFtZXNwYWNlXG4gICAgQGNvbnN0cnVjdG9yXG4gICAgQGludGVybmFsXG4gICAgQG1lbWJlck9mIG1ha2VOYW1lU3BhY2VcbiAgICAjIyNcbiAgICBDbGFzcyA9IG5ldyBGdW5jdGlvbigncmV0dXJuIGZ1bmN0aW9uICcgKyBzcGFjZW5hbWUgKyAnKCl7fScpKClcbiAgICBDbGFzczo6ID0gbmV3IEJhc2Uoc3BhY2VuYW1lKVxuXG4gICAgI0NsYXNzLnByb3RvdHlwZS5wYXJlbnQgPSBCYXNlLnByb3RvdHlwZTtcbiAgICBuZXcgQ2xhc3Moc3BhY2VuYW1lKVxuXG4gICMjI1xuICAnRGVwZW5kJyBhbiBPYmplY3QgdXBvbiBhbm90aGVyIG1lbWJlciBvZiB0aGlzIG5hbWVzcGFjZSwgdXBvbiBhbm90aGVyIG5hbWVzcGFjZSxcbiAgb3IgdXBvbiBhIG1lbWJlciBvZiBhbm90aGVyIG5hbWVzcGFjZVxuICAjIyNcbiAgZGVwZW5kc09uID0gKGRlcGVuZGVuY2llcywgY2FsbEJhY2ssIGltcG9ydHMpIC0+XG4gICAgJ3VzZSBzdHJpY3QnXG4gICAgcmV0ID0gZmFsc2VcbiAgICBuc01lbWJlcnMgPSBuc0ludGVybmFsLmdldE5zTWVtYmVycygpXG4gICAgaWYgZGVwZW5kZW5jaWVzIGFuZCBkZXBlbmRlbmNpZXMubGVuZ3RoID4gMCBhbmQgY2FsbEJhY2tcbiAgICAgIG1pc3NpbmcgPSBkZXBlbmRlbmNpZXMuZmlsdGVyKChkZXBlbikgLT5cbiAgICAgICAgbnNNZW1iZXJzLmluZGV4T2YoZGVwZW4pIGlzIC0xIGFuZCAobm90IGltcG9ydHMgb3IgaW1wb3J0cyBpc250IGRlcGVuKVxuICAgICAgKVxuICAgICAgaWYgbWlzc2luZy5sZW5ndGggaXMgMFxuICAgICAgICByZXQgPSB0cnVlXG4gICAgICAgIGNhbGxCYWNrKClcbiAgICAgIGVsc2VcbiAgICAgICAgbnNJbnRlcm5hbC5kZXBlbmRlbnRzLnB1c2ggKGltcG9ydHMpIC0+XG4gICAgICAgICAgZGVwZW5kc09uIG1pc3NpbmcsIGNhbGxCYWNrLCBpbXBvcnRzXG5cbiAgICByZXRcbiAgbnNJbnRlcm5hbCA9IGRlcGVuZGVudHM6IFtdXG5cbiAgIyMjXG4gIEZldGNoZXMgdGhlIHJlZ2lzdGVyZWQgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBvbiB0aGUgbmFtZXNwYWNlIGFuZCBpdHMgY2hpbGQgbmFtZXNwYWNlc1xuICAjIyNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5IG5zSW50ZXJuYWwsICdnZXROc01lbWJlcnMnLFxuICAgIHZhbHVlOiAtPlxuICAgICAgcmVjdXJzZVRyZWUgPSAoa2V5LCBsYXN0S2V5KSAtPlxuICAgICAgICBtZW1iZXJzLnB1c2ggbGFzdEtleSArICcuJyArIGtleSAgaWYgdHlwZW9mIChrZXkpIGlzICdzdHJpbmcnXG4gICAgICAgIGlmIHV0aWxMaWIuaXNQbGFpbk9iamVjdChrZXkpXG4gICAgICAgICAgT2JqZWN0LmtleXMoa2V5KS5mb3JFYWNoIChrKSAtPlxuICAgICAgICAgICAgbWVtYmVycy5wdXNoIGxhc3RLZXkgKyAnLicgKyBrICBpZiB0eXBlb2YgKGspIGlzICdzdHJpbmcnXG4gICAgICAgICAgICByZWN1cnNlVHJlZSBrZXlba10sIGxhc3RLZXkgKyAnLicgKyBrICBpZiB1dGlsTGliLmlzUGxhaW5PYmplY3Qoa2V5W2tdKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgcmV0dXJuXG4gICAgICBtZW1iZXJzID0gW11cbiAgICAgIE9iamVjdC5rZXlzKE5zVHJlZVtuYW1lU3BhY2VOYW1lXSkuZm9yRWFjaCAoa2V5KSAtPlxuICAgICAgICByZWN1cnNlVHJlZSBOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSwgbmFtZVNwYWNlTmFtZSAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KE5zVHJlZVtuYW1lU3BhY2VOYW1lXVtrZXldKVxuICAgICAgICByZXR1cm5cblxuICAgICAgbWVtYmVyc1xuXG4gICMjI1xuICBUbyBzdXBwb3J0IGRlcGVuZGVuY3kgbWFuYWdlbWVudCwgd2hlbiBhIHByb3BlcnR5IGlzIGxpZnRlZCBvbnRvIHRoZSBuYW1lc3BhY2UsIG5vdGlmeSBkZXBlbmRlbnRzIHRvIGluaXRpYWxpemVcbiAgIyMjXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBuc0ludGVybmFsLCAnYWxlcnREZXBlbmRlbnRzJyxcbiAgICB2YWx1ZTogKGltcG9ydHMpIC0+XG4gICAgICBkZXBzID0gbnNJbnRlcm5hbC5kZXBlbmRlbnRzLmZpbHRlcigoZGVwT24pIC0+XG4gICAgICAgIGZhbHNlIGlzIGRlcE9uKGltcG9ydHMpXG4gICAgICApXG4gICAgICBuc0ludGVybmFsLmRlcGVuZGVudHMgPSBkZXBzICBpZiBBcnJheS5pc0FycmF5KGRlcHMpXG5cbiAgI0NyZWF0ZSB0aGUgcm9vdCBvZiB0aGUgdHJlZSBhcyB0aGUgY3VycmVudCBuYW1lc3BhY2VcbiAgTnNUcmVlW25hbWVTcGFjZU5hbWVdID0ge31cbiAgI0RlZmluZSB0aGUgY29yZSBuYW1lc3BhY2UgYW5kIHRoZSByZXR1cm4gb2YgdGhpcyBjbGFzc1xuICBOc091dCA9IG1ha2VOYW1lU3BhY2UobmFtZVNwYWNlTmFtZSwgTnNUcmVlW25hbWVTcGFjZU5hbWVdKVxuXG4gICMjI1xuICBDYWNoZSBhIGhhbmRsZSBvbiB0aGUgdmVuZG9yIChwcm9iYWJseSBqUXVlcnkpIG9uIHRoZSByb290IG5hbWVzcGFjZVxuICAjIyNcbiAgTnNPdXQucmVnaXN0ZXIgJz8nLCB1dGlsTGliLCBmYWxzZVxuXG4gICMjI1xuICBDYWNoZSB0aGUgdHJlZSAodXNlZnVsIGZvciBkb2N1bWVudGF0aW9uL3Zpc3VhbGl6YXRpb24vZGVidWdnaW5nKVxuICAjIyNcbiAgTnNPdXQucmVnaXN0ZXIgJ3RyZWUnLCBOc1RyZWVbbmFtZVNwYWNlTmFtZV0sIGZhbHNlXG5cbiAgIyMjXG4gIENhY2hlIHRoZSBuYW1lIHNwYWNlIG5hbWVcbiAgIyMjXG4gIE5zT3V0LnJlZ2lzdGVyICduYW1lJywgbmFtZVNwYWNlTmFtZSwgZmFsc2VcbiAgTnNPdXQucmVnaXN0ZXIgJ2RlcGVuZHNPbicsIGRlcGVuZHNPbiwgZmFsc2VcbiAgTnNPdXRcblxuXG4jIyNcbkFjdHVhbGx5IGRlZmluZSB0aGUgT0ogTmFtZVNwYWNlXG4jIyNcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzR2xvYmFsLCBuYW1lU3BhY2VOYW1lLFxuICB2YWx1ZTogbWFrZVRoZUp1aWNlKClcblxuT0oucmVnaXN0ZXIgJ2dsb2JhbCcsIHRoaXNHbG9iYWxcblxudGhpc0RvY3VtZW50ID0ge31cbmlmIHR5cGVvZiBkb2N1bWVudCBpc250ICd1bmRlZmluZWQnXG4gIHRoaXNEb2N1bWVudCA9IGRvY3VtZW50XG5cbk9KLnJlZ2lzdGVyICdkb2N1bWVudCcsIHRoaXNEb2N1bWVudFxuXG5PSi5yZWdpc3RlciAnbm9vcCcsIC0+XG5cbm1vZHVsZS5leHBvcnRzID0gT0oiLCIgIyAjIE9KIFBvc3QtSW5pdGlhbGl6YXRpb25cclxuXHJcbk9KID0gcmVxdWlyZSAnLi9vaidcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuXHJcbiMgU2ltcGxlIGFycmF5IG9mIGFudGljaXBhdGVkL2tub3duIGNoaWxkIG5hbWVzcGFjZXNcclxuICBcclxuc3ViTmFtZVNwYWNlcyA9IFtcclxuICAnZXJyb3JzJ1xyXG4gICdlbnVtcydcclxuICAnaW5zdGFuY2VPZidcclxuICAnbm9kZXMnXHJcbiAgJ2RiJ1xyXG4gICdjb21wb25lbnRzJ1xyXG4gICdjb250cm9scydcclxuICAnaW5wdXRzJ1xyXG4gICdub3RpZmljYXRpb25zJ1xyXG4gICdoaXN0b3J5J1xyXG4gICdjb29raWUnXHJcbiAgJ2FzeW5jJ1xyXG5dXHJcblxyXG4jICMjIFN1Yk5hbWVTcGFjZXNcclxuXHJcbiMgUHJlLWFsbG9jYXRlIGNlcnRhaW4gY29tbW9uIG5hbWVzcGFjZXMgdG8gYXZvaWQgZnV0dXJlIHJhY2UgY29uZGl0aW9ucy5cclxuIyBUaGlzIGRvZXMgcmVxdWlyZSB0aGF0IHRoZSBvcmRlciBvZiBvcGVyYXRpb25zIGxvYWRzIE9KLmNvZmZlZSBmaXJzdCBhbmQgb0pJbml0LmNvZmZlZSBzZWNvbmRcclxuXy5lYWNoIHN1Yk5hbWVTcGFjZXMsIChuYW1lKSAtPlxyXG4gIE9KLm1ha2VTdWJOYW1lU3BhY2UgbmFtZVxyXG4gIFxyXG4jICMjIENvbmZpZ3VyYXRpb24gdmFyaWFibGVzXHJcblxyXG4jIEF1dG9tYXRpY2FsbHkgZ2VuZXJhdGUgdW5pcXVlIElEcyBmb3IgZWFjaCBub2RlIChkZWZhdWx0IGZhbHNlKVxyXG5PSlsnR0VORVJBVEVfVU5JUVVFX0lEUyddID0gZmFsc2VcclxuIyBEZWZhdWx0IHJvb3Qgbm9kZSBmb3IgY29tcG9uZW50cy9jb250cm9scyAoZGVmYXVsdCAnZGl2JylcclxuT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSA9ICdkaXYnXHJcbiMgV2hldGhlciB0byBob29rIGludG8gdGhlIGdsb2JhbCBvbiBlcnJvciBldmVudCB0byB3cml0ZSBlcnJvcnMgdG8gY29uc29sZSAoZGVmYXVsdCBmYWxzZSlcclxuT0pbJ1RSQUNLX09OX0VSUk9SJ10gPSBmYWxzZVxyXG4jV2hldGhlciB0byBsb2cgYWxsIEFKQVggcmVxdWVzdHNcclxuT0pbJ0xPR19BTExfQUpBWCddID0gZmFsc2VcclxuI1doZXRoZXIgdG8gbG9nIGFsbCBBSkFYIGVycm9yc1xyXG5PSlsnTE9HX0FMTF9BSkFYX0VSUk9SUyddID0gZmFsc2UiLCJcclxuIyMjXHJcblJldHVybiBqdXN0IHRoZSBrZXlzIGZyb20gdGhlIGlucHV0IGFycmF5LCBvcHRpb25hbGx5IG9ubHkgZm9yIHRoZSBzcGVjaWZpZWQgc2VhcmNoX3ZhbHVlXHJcbnZlcnNpb246IDExMDkuMjAxNVxyXG5kaXNjdXNzIGF0OiBodHRwOi8vcGhwanMub3JnL2Z1bmN0aW9ucy9hcnJheV9rZXlzXHJcbisgICBvcmlnaW5hbCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2tldmluLnZhbnpvbm5ldmVsZC5uZXQpXHJcbisgICAgICBpbnB1dCBieTogQnJldHQgWmFtaXIgKGh0dHA6Ly9icmV0dC16YW1pci5tZSlcclxuKyAgIGJ1Z2ZpeGVkIGJ5OiBLZXZpbiB2YW4gWm9ubmV2ZWxkIChodHRwOi8va2V2aW4udmFuem9ubmV2ZWxkLm5ldClcclxuKyAgIGltcHJvdmVkIGJ5OiBqZFxyXG4rICAgaW1wcm92ZWQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXHJcbisgICBpbnB1dCBieTogUFxyXG4rICAgYnVnZml4ZWQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXHJcbmV4YW1wbGUgMTogYXJyYXlfa2V5cygge2ZpcnN0bmFtZTogJ0tldmluJywgc3VybmFtZTogJ3ZhbiBab25uZXZlbGQnfSApO1xyXG5yZXR1cm5zIDE6IHswOiAnZmlyc3RuYW1lJywgMTogJ3N1cm5hbWUnfVxyXG4jIyNcclxuYXJyYXlfa2V5cyA9IChpbnB1dCwgc2VhcmNoX3ZhbHVlLCBhcmdTdHJpY3QpIC0+XHJcbiAgc2VhcmNoID0gdHlwZW9mIHNlYXJjaF92YWx1ZSBpc250IFwidW5kZWZpbmVkXCJcclxuICB0bXBfYXJyID0gW11cclxuICBzdHJpY3QgPSAhIWFyZ1N0cmljdFxyXG4gIGluY2x1ZGUgPSB0cnVlXHJcbiAga2V5ID0gXCJcIlxyXG4gICMgRHVjay10eXBlIGNoZWNrIGZvciBvdXIgb3duIGFycmF5KCktY3JlYXRlZCBQSFBKU19BcnJheVxyXG4gIHJldHVybiBpbnB1dC5rZXlzKHNlYXJjaF92YWx1ZSwgYXJnU3RyaWN0KSAgaWYgaW5wdXQgYW5kIHR5cGVvZiBpbnB1dCBpcyBcIm9iamVjdFwiIGFuZCBpbnB1dC5jaGFuZ2Vfa2V5X2Nhc2VcclxuICBmb3Iga2V5IG9mIGlucHV0XHJcbiAgICBpZiBpbnB1dC5oYXNPd25Qcm9wZXJ0eShrZXkpXHJcbiAgICAgIGluY2x1ZGUgPSB0cnVlXHJcbiAgICAgIGlmIHNlYXJjaFxyXG4gICAgICAgIGlmIHN0cmljdCBhbmQgaW5wdXRba2V5XSBpc250IHNlYXJjaF92YWx1ZVxyXG4gICAgICAgICAgaW5jbHVkZSA9IGZhbHNlXHJcbiAgICAgICAgZWxzZSBpbmNsdWRlID0gZmFsc2UgIHVubGVzcyBpbnB1dFtrZXldIGlzIHNlYXJjaF92YWx1ZVxyXG4gICAgICB0bXBfYXJyW3RtcF9hcnIubGVuZ3RoXSA9IGtleSAgaWYgaW5jbHVkZVxyXG4gIHRtcF9hcnJcclxuXHJcbiMjIypcclxuQ29udmVydCBhIEphdmFzY3JpcHQgT2plY3QgYXJyYXkgb3IgU3RyaW5nIGFycmF5IHRvIGFuIEhUTUwgdGFibGVcclxuSlNPTiBwYXJzaW5nIGhhcyB0byBiZSBtYWRlIGJlZm9yZSBmdW5jdGlvbiBjYWxsXHJcbkl0IGFsbG93cyB1c2Ugb2Ygb3RoZXIgSlNPTiBwYXJzaW5nIG1ldGhvZHMgbGlrZSBqUXVlcnkucGFyc2VKU09OXHJcbmh0dHAocyk6Ly8sIGZ0cDovLywgZmlsZTovLyBhbmQgamF2YXNjcmlwdDo7IGxpbmtzIGFyZSBhdXRvbWF0aWNhbGx5IGNvbXB1dGVkXHJcblxyXG5KU09OIGRhdGEgc2FtcGxlcyB0aGF0IHNob3VsZCBiZSBwYXJzZWQgYW5kIHRoZW4gY2FuIGJlIGNvbnZlcnRlZCB0byBhbiBIVE1MIHRhYmxlXHJcbnZhciBvYmplY3RBcnJheSA9ICdbe1wiVG90YWxcIjpcIjM0XCIsXCJWZXJzaW9uXCI6XCIxLjAuNFwiLFwiT2ZmaWNlXCI6XCJOZXcgWW9ya1wifSx7XCJUb3RhbFwiOlwiNjdcIixcIlZlcnNpb25cIjpcIjEuMS4wXCIsXCJPZmZpY2VcIjpcIlBhcmlzXCJ9XSc7XHJcbnZhciBzdHJpbmdBcnJheSA9ICdbXCJOZXcgWW9ya1wiLFwiQmVybGluXCIsXCJQYXJpc1wiLFwiTWFycmFrZWNoXCIsXCJNb3Njb3dcIl0nO1xyXG52YXIgbmVzdGVkVGFibGUgPSAnW3sga2V5MTogXCJ2YWwxXCIsIGtleTI6IFwidmFsMlwiLCBrZXkzOiB7IHRhYmxlSWQ6IFwidGJsSWROZXN0ZWQxXCIsIHRhYmxlQ2xhc3NOYW1lOiBcImNsc05lc3RlZFwiLCBsaW5rVGV4dDogXCJEb3dubG9hZFwiLCBkYXRhOiBbeyBzdWJrZXkxOiBcInN1YnZhbDFcIiwgc3Via2V5MjogXCJzdWJ2YWwyXCIsIHN1YmtleTM6IFwic3VidmFsM1wiIH1dIH0gfV0nO1xyXG5cclxuQ29kZSBzYW1wbGUgdG8gY3JlYXRlIGEgSFRNTCB0YWJsZSBKYXZhc2NyaXB0IFN0cmluZ1xyXG52YXIganNvbkh0bWxUYWJsZSA9IENvbnZlcnRKc29uVG9UYWJsZShldmFsKGRhdGFTdHJpbmcpLCAnanNvblRhYmxlJywgbnVsbCwgJ0Rvd25sb2FkJyk7XHJcblxyXG5Db2RlIHNhbXBsZSBleHBsYW5lZFxyXG4tIGV2YWwgaXMgdXNlZCB0byBwYXJzZSBhIEpTT04gZGF0YVN0cmluZ1xyXG4tIHRhYmxlIEhUTUwgaWQgYXR0cmlidXRlIHdpbGwgYmUgJ2pzb25UYWJsZSdcclxuLSB0YWJsZSBIVE1MIGNsYXNzIGF0dHJpYnV0ZSB3aWxsIG5vdCBiZSBhZGRlZFxyXG4tICdEb3dubG9hZCcgdGV4dCB3aWxsIGJlIGRpc3BsYXllZCBpbnN0ZWFkIG9mIHRoZSBsaW5rIGl0c2VsZlxyXG5cclxuQGF1dGhvciBBZnNoaW4gTWVocmFiYW5pIDxhZnNoaW4gZG90IG1laCBhdCBnbWFpbCBkb3QgY29tPlxyXG5cclxuQGNsYXNzIENvbnZlcnRKc29uVG9UYWJsZVxyXG5cclxuQG1ldGhvZCBDb252ZXJ0SnNvblRvVGFibGVcclxuXHJcbkBwYXJhbSBwYXJzZWRKc29uIG9iamVjdCBQYXJzZWQgSlNPTiBkYXRhXHJcbkBwYXJhbSB0YWJsZUlkIHN0cmluZyBPcHRpb25hbCB0YWJsZSBpZFxyXG5AcGFyYW0gdGFibGVDbGFzc05hbWUgc3RyaW5nIE9wdGlvbmFsIHRhYmxlIGNzcyBjbGFzcyBuYW1lXHJcbkBwYXJhbSBsaW5rVGV4dCBzdHJpbmcgT3B0aW9uYWwgdGV4dCByZXBsYWNlbWVudCBmb3IgbGluayBwYXR0ZXJuXHJcblxyXG5AcmV0dXJuIHN0cmluZyBDb252ZXJ0ZWQgSlNPTiB0byBIVE1MIHRhYmxlXHJcbiMjI1xyXG5jbGFzcyBKc29uVG9UYWJsZSBcclxuICBcclxuICB0YWJsZTogbnVsbFxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yOiAocGFyc2VkSnNvbiwgdGFibGVJZCwgdGFibGVDbGFzc05hbWUsIGxpbmtUZXh0KSAtPlxyXG4gICAgI1BhdHRlcm5zIGZvciBsaW5rcyBhbmQgTlVMTCB2YWx1ZVxyXG4gICAgaXRhbGljID0gXCI8aT57MH08L2k+XCJcclxuICAgIGxpbmsgPSAoaWYgbGlua1RleHQgdGhlbiBcIjxhIGhyZWY9XFxcInswfVxcXCI+XCIgKyBsaW5rVGV4dCArIFwiPC9hPlwiIGVsc2UgXCI8YSBocmVmPVxcXCJ7MH1cXFwiPnswfTwvYT5cIilcclxuICBcclxuICAgICNQYXR0ZXJuIGZvciB0YWJsZSAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICBpZE1hcmt1cCA9IChpZiB0YWJsZUlkIHRoZW4gXCIgaWQ9XFxcIlwiICsgdGFibGVJZCArIFwiXFxcIlwiIGVsc2UgXCJcIilcclxuICAgIGNsYXNzTWFya3VwID0gKGlmIHRhYmxlQ2xhc3NOYW1lIHRoZW4gXCIgY2xhc3M9XFxcIlwiICsgdGFibGVDbGFzc05hbWUgKyBcIlxcXCJcIiBlbHNlIFwiXCIpXHJcbiAgICB0YmwgPSBcIjx0YWJsZSBib3JkZXI9XFxcIjFcXFwiIGNlbGxwYWRkaW5nPVxcXCIxXFxcIiBjZWxsc3BhY2luZz1cXFwiMVxcXCJcIiArIGlkTWFya3VwICsgY2xhc3NNYXJrdXAgKyBcIj57MH17MX08L3RhYmxlPlwiXHJcbiAgXHJcbiAgICAjUGF0dGVybnMgZm9yIHRhYmxlIGNvbnRlbnRcclxuICAgIHRoID0gXCI8dGhlYWQ+ezB9PC90aGVhZD5cIlxyXG4gICAgdGIgPSBcIjx0Ym9keT57MH08L3Rib2R5PlwiXHJcbiAgICB0ciA9IFwiPHRyPnswfTwvdHI+XCJcclxuICAgIHRoUm93ID0gXCI8dGg+ezB9PC90aD5cIlxyXG4gICAgdGRSb3cgPSBcIjx0ZD57MH08L3RkPlwiXHJcbiAgICB0aENvbiA9IFwiXCJcclxuICAgIHRiQ29uID0gXCJcIlxyXG4gICAgdHJDb24gPSBcIlwiXHJcbiAgICBpZiBwYXJzZWRKc29uXHJcbiAgICAgIGlzU3RyaW5nQXJyYXkgPSB0eXBlb2YgKHBhcnNlZEpzb25bMF0pIGlzIFwic3RyaW5nXCJcclxuICAgICAgaGVhZGVycyA9IHVuZGVmaW5lZFxyXG4gICAgXHJcbiAgICAgICMgQ3JlYXRlIHRhYmxlIGhlYWRlcnMgZnJvbSBKU09OIGRhdGFcclxuICAgICAgIyBJZiBKU09OIGRhdGEgaXMgYSBzaW1wbGUgc3RyaW5nIGFycmF5IHdlIGNyZWF0ZSBhIHNpbmdsZSB0YWJsZSBoZWFkZXJcclxuICAgICAgaWYgaXNTdHJpbmdBcnJheVxyXG4gICAgICAgIHRoQ29uICs9IHRoUm93LmZvcm1hdChcInZhbHVlXCIpXHJcbiAgICAgIGVsc2VcclxuICAgICAgXHJcbiAgICAgICAgIyBJZiBKU09OIGRhdGEgaXMgYW4gb2JqZWN0IGFycmF5LCBoZWFkZXJzIGFyZSBhdXRvbWF0aWNhbGx5IGNvbXB1dGVkXHJcbiAgICAgICAgaWYgdHlwZW9mIChwYXJzZWRKc29uWzBdKSBpcyBcIm9iamVjdFwiXHJcbiAgICAgICAgICBoZWFkZXJzID0gYXJyYXlfa2V5cyhwYXJzZWRKc29uWzBdKVxyXG4gICAgICAgICAgaSA9IDBcclxuICAgICAgICAgIHdoaWxlIGkgPCBoZWFkZXJzLmxlbmd0aFxyXG4gICAgICAgICAgICB0aENvbiArPSB0aFJvdy5mb3JtYXQoaGVhZGVyc1tpXSlcclxuICAgICAgICAgICAgaSsrXHJcbiAgICAgIHRoID0gdGguZm9ybWF0KHRyLmZvcm1hdCh0aENvbikpXHJcbiAgICBcclxuICAgICAgIyBDcmVhdGUgdGFibGUgcm93cyBmcm9tIEpzb24gZGF0YVxyXG4gICAgICBpZiBpc1N0cmluZ0FycmF5XHJcbiAgICAgICAgaSA9IDBcclxuICAgICAgICB3aGlsZSBpIDwgcGFyc2VkSnNvbi5sZW5ndGhcclxuICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChwYXJzZWRKc29uW2ldKVxyXG4gICAgICAgICAgdHJDb24gKz0gdHIuZm9ybWF0KHRiQ29uKVxyXG4gICAgICAgICAgdGJDb24gPSBcIlwiXHJcbiAgICAgICAgICBpKytcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGlmIGhlYWRlcnNcclxuICAgICAgICAgIHVybFJlZ0V4cCA9IG5ldyBSZWdFeHAoLyhcXGIoaHR0cHM/fGZ0cHxmaWxlKTpcXC9cXC9bLUEtWjAtOSsmQCNcXC8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjXFwvJT1+X3xdKS9nKVxyXG4gICAgICAgICAgamF2YXNjcmlwdFJlZ0V4cCA9IG5ldyBSZWdFeHAoLyheamF2YXNjcmlwdDpbXFxzXFxTXSo7JCkvZylcclxuICAgICAgICAgIGkgPSAwXHJcbiAgICAgICAgICB3aGlsZSBpIDwgcGFyc2VkSnNvbi5sZW5ndGhcclxuICAgICAgICAgICAgaiA9IDBcclxuICAgICAgICAgICAgd2hpbGUgaiA8IGhlYWRlcnMubGVuZ3RoXHJcbiAgICAgICAgICAgICAgdmFsdWUgPSBwYXJzZWRKc29uW2ldW2hlYWRlcnNbal1dXHJcbiAgICAgICAgICAgICAgaXNVcmwgPSB1cmxSZWdFeHAudGVzdCh2YWx1ZSkgb3IgamF2YXNjcmlwdFJlZ0V4cC50ZXN0KHZhbHVlKVxyXG4gICAgICAgICAgICAgIGlmIGlzVXJsICMgSWYgdmFsdWUgaXMgVVJMIHdlIGF1dG8tY3JlYXRlIGEgbGlua1xyXG4gICAgICAgICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KGxpbmsuZm9ybWF0KHZhbHVlKSlcclxuICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBpZiB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICBpZiB0eXBlb2YgKHZhbHVlKSBpcyBcIm9iamVjdFwiXHJcbiAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICNmb3Igc3VwcG9ydGluZyBuZXN0ZWQgdGFibGVzXHJcbiAgICAgICAgICAgICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KENvbnZlcnRKc29uVG9UYWJsZShldmFsKHZhbHVlLmRhdGEpLCB2YWx1ZS50YWJsZUlkLCB2YWx1ZS50YWJsZUNsYXNzTmFtZSwgdmFsdWUubGlua1RleHQpKVxyXG4gICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgZWxzZSAjIElmIHZhbHVlID09IG51bGwgd2UgZm9ybWF0IGl0IGxpa2UgUGhwTXlBZG1pbiBOVUxMIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQoaXRhbGljLmZvcm1hdCh2YWx1ZSkudG9VcHBlckNhc2UoKSlcclxuICAgICAgICAgICAgICBqKytcclxuICAgICAgICAgICAgdHJDb24gKz0gdHIuZm9ybWF0KHRiQ29uKVxyXG4gICAgICAgICAgICB0YkNvbiA9IFwiXCJcclxuICAgICAgICAgICAgaSsrXHJcbiAgICAgIHRiID0gdGIuZm9ybWF0KHRyQ29uKVxyXG4gICAgICB0YmwgPSB0YmwuZm9ybWF0KHRoLCB0YilcclxuICAgIEB0YWJsZSA9IHRibFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBKc29uVG9UYWJsZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmFycmF5MkQgPSAoaW5pdExlbmd0aCwgaW5pdFdpZHRoKSAtPlxyXG4gIGFycmF5ID0gW11cclxuICBtYXhMZW5ndGggPSAwXHJcbiAgbWF4V2lkdGggPSAwXHJcbiAgICBcclxuICByZXQgPSBcclxuICAgIGdldDogKHJvd05vLCBjb2xObykgLT5cclxuICAgICAgZXh0ZW5kIHJvd05vLCBjb2xOb1xyXG4gICAgc2V0OiAocm93Tm8sIGNvbE5vLCB2YWwpIC0+XHJcbiAgICAgIHJldC5nZXQgcm93Tm8sIGNvbE5vXHJcbiAgICAgIHJvd0lkeCA9IHJvd05vLTFcclxuICAgICAgY29sSWR4ID0gY29sTm8tMVxyXG4gICAgICBhcnJheVtyb3dJZHhdW2NvbElkeF0gPSB2YWxcclxuICAgIGVhY2g6IChjYWxsQmFjaykgLT5cclxuICAgICAgXy5lYWNoIGFycmF5LCAoY29sdW1ucywgcm93KSAtPlxyXG4gICAgICAgIF8uZWFjaCBhcnJheVtyb3ddLCAodmFsLCBjb2wpIC0+XHJcbiAgICAgICAgICByb3dJZHggPSByb3crMVxyXG4gICAgICAgICAgY29sSWR4ID0gY29sKzFcclxuICAgICAgICAgIGNhbGxCYWNrIHJvd0lkeCwgY29sSWR4LCB2YWxcclxuICAgIHdpZHRoOiAoKSAtPlxyXG4gICAgICBtYXhXaWR0aFxyXG4gICAgbGVuZ3RoOiAoKSAtPlxyXG4gICAgICBtYXhMZW5ndGhcclxuICAgICAgICAgXHJcbiAgIyMjXHJcbiAgR3VhcmFudGVlIHRoYXQgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGFycmF5IGFyZSBhbHdheXMgYmFja2VkIGJ5IHZhbHVlcyBhdCBldmVyeSBwb3NpdGlvblxyXG4gICMjIyAgICAgICAgICAgICAgICAgICAgXHJcbiAgZXh0ZW5kID0gKGxlbmd0aCwgd2lkdGgpIC0+ICBcclxuICAgIGlmIG5vdCBsZW5ndGggb3IgbGVuZ3RoIDwgMSB0aGVuIGxlbmd0aCA9IDFcclxuICAgIGlmIG5vdCB3aWR0aCBvciB3aWR0aCA8IDEgdGhlbiB3aWR0aCA9IDFcclxuICAgICAgXHJcbiAgICBpZiBtYXhMZW5ndGggPCBsZW5ndGggdGhlbiBtYXhMZW5ndGggPSBsZW5ndGhcclxuICAgIGlmIGFycmF5Lmxlbmd0aCA+IG1heExlbmd0aCB0aGVuIG1heExlbmd0aCA9IGFycmF5Lmxlbmd0aFxyXG4gICAgaWYgbWF4V2lkdGggPCB3aWR0aCB0aGVuIG1heFdpZHRoID0gd2lkdGhcclxuICAgIGkgPSAwXHJcbiAgICAgIFxyXG4gICAgd2hpbGUgaSA8IG1heExlbmd0aFxyXG4gICAgICB0cnlSb3cgPSBhcnJheVtpXVxyXG4gICAgICBpZiBub3QgdHJ5Um93XHJcbiAgICAgICAgdHJ5Um93ID0gW11cclxuICAgICAgICBhcnJheS5wdXNoIHRyeVJvd1xyXG4gICAgICBpZiBtYXhXaWR0aCA8IHRyeVJvdy5sZW5ndGggdGhlbiBtYXhXaWR0aCA9IHRyeVJvdy5sZW5ndGhcclxuICAgICAgaWYgdHJ5Um93Lmxlbmd0aCA8IG1heFdpZHRoIHRoZW4gdHJ5Um93Lmxlbmd0aCA9IG1heFdpZHRoXHJcbiAgICAgIGkgKz0gMVxyXG4gICAgICBcclxuICAgIGFycmF5W2xlbmd0aC0xXVt3aWR0aC0xXVxyXG4gICAgICAgXHJcbiAgZXh0ZW5kIGluaXRMZW5ndGgsIGluaXRXaWR0aFxyXG4gICAgXHJcbiAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAnYXJyYXkyRCcsIGFycmF5MkRcclxubW9kdWxlLmV4cG9ydHMgPSBhcnJheTJEIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxubWV0aG9kcyA9IFtcclxuICAnYXNzZXJ0J1xyXG4gICdjbGVhcidcclxuICAnY291bnQnXHJcbiAgJ2RlYnVnJ1xyXG4gICdkaXInXHJcbiAgJ2RpcnhtbCdcclxuICAnZXJyb3InXHJcbiAgJ2V4Y2VwdGlvbidcclxuICAnZ3JvdXAnXHJcbiAgJ2dyb3VwQ29sbGFwc2VkJ1xyXG4gICdncm91cEVuZCdcclxuICAnaW5mbydcclxuICAnbG9nJ1xyXG4gICdtZW1vcnknXHJcbiAgJ3Byb2ZpbGUnXHJcbiAgJ3Byb2ZpbGVFbmQnXHJcbiAgJ3RhYmxlJ1xyXG4gICd0aW1lJ1xyXG4gICd0aW1lRW5kJ1xyXG4gICd0aW1lU3RhbXAnXHJcbiAgJ3RpbWVsaW5lJ1xyXG4gICd0aW1lbGluZUVuZCdcclxuICAndHJhY2UnXHJcbiAgJ3dhcm4nXHJcbl1cclxubWV0aG9kTGVuZ3RoID0gbWV0aG9kcy5sZW5ndGhcclxuY29uc29sZSA9IE9KLmdsb2JhbC5jb25zb2xlIG9yIHt9XHJcbk9KLm1ha2VTdWJOYW1lU3BhY2UgJ2NvbnNvbGUnXHJcbiAgXHJcbiMjI1xyXG4xLiBTdHViIG91dCBhbnkgbWlzc2luZyBtZXRob2RzIHdpdGggbm9vcFxyXG4yLiBEZWZpbmUgdGhlIGF2YWlsYWJsZSBtZXRob2RzIG9uIHRoZSBPSi5jb25zb2xlIG9iamVjdFxyXG4jIyNcclxud2hpbGUgbWV0aG9kTGVuZ3RoLS1cclxuICAoLT5cclxuICAgIG1ldGhvZCA9IG1ldGhvZHNbbWV0aG9kTGVuZ3RoXVxyXG4gICAgXHJcbiAgICAjIE9ubHkgc3R1YiB1bmRlZmluZWQgbWV0aG9kcy5cclxuICAgIGNvbnNvbGVbbWV0aG9kXSA9IE9KLm5vb3AgdW5sZXNzIGNvbnNvbGVbbWV0aG9kXVxyXG4gICAgXHJcbiAgICAjRGVmaW5lIHRoZSBtZXRob2Qgb24gdGhlIE9KIGNvbnNvbGUgbmFtZXNwYWNlXHJcbiAgICBPSi5jb25zb2xlLnJlZ2lzdGVyIG1ldGhvZCwgKHBhcmFtcy4uLikgLT5cclxuICAgICAgY29uc29sZVttZXRob2RdIHBhcmFtcy4uLlxyXG4gICkoKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjb25zb2xlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuIyMjXHJcblNldHVwIHNldHRpbmdzXHJcbiQuY29va2llLnJhdyA9IHRydWVcclxuJC5jb29raWUuanNvbiA9IHRydWVcclxuICBcclxuU2V0dXAgZGVmYXVsdHNcclxuaHR0cHM6Ly9naXRodWIuY29tL2NhcmhhcnRsL2pxdWVyeS1jb29raWUvXHJcbiQuY29va2llLmRlZmF1bHRzLmV4cGlyZXMgPSAzNjVcclxuJC5jb29raWUuZGVmYXVsdHMucGF0aCA9ICcvJ1xyXG4kLmNvb2tpZS5kZWZhdWx0cy5kb21haW4gPSAnb2ouY29tJ1xyXG4jIyNcclxuaWYgbm90ICQgb3Igbm90ICQuY29va2llXHJcbiAgdGhyb3cgbmV3IEVycm9yICdqUXVlcnkgQ29va2llIGlzIGEgcmVxdWlyZWQgZGVwZW5kZW5jeS4nICBcclxuJC5jb29raWUuZGVmYXVsdHMuc2VjdXJlID0gZmFsc2VcclxuICBcclxuY29va2llcyA9IHt9XHJcbiAgXHJcbmdldCA9IChjb29raWVOYW1lLCB0eXBlKSAtPlxyXG4gIHJldCA9ICcnXHJcbiAgaWYgY29va2llTmFtZVxyXG4gICAgaWYgdHlwZVxyXG4gICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lLCB0eXBlXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUgICAgXHJcbiAgICBpZiByZXRcclxuICAgICAgY29va2llc1tjb29raWVOYW1lXSA9IHJldFxyXG4gIFxyXG5hbGwgPSAtPlxyXG4gIHJldCA9ICQuY29va2llKClcclxuICByZXRcclxuICAgIFxyXG5zZXQgPSAoY29va2llTmFtZSwgdmFsdWUsIG9wdHMpIC0+XHJcbiAgcmV0ID0gJydcclxuICBpZiBjb29raWVOYW1lXHJcbiAgICBjb29raWVzW2Nvb2tpZU5hbWVdID0gdmFsdWVcclxuICAgIGlmIG9wdHNcclxuICAgICAgcmV0ID0gJC5jb29raWUgY29va2llTmFtZSwgdmFsdWUsIG9wdHNcclxuICAgIGVsc2VcclxuICAgICAgcmV0ID0gJC5jb29raWUgY29va2llTmFtZSwgdmFsdWVcclxuICByZXQgIFxyXG4gIFxyXG5kZWwgPSAoY29va2llTmFtZSwgb3B0cykgLT5cclxuICBpZiBjb29raWVOYW1lXHJcbiAgICBpZiBvcHRzXHJcbiAgICAgICQucmVtb3ZlQ29va2llIGNvb2tpZU5hbWUsIG9wdHNcclxuICAgIGVsc2VcclxuICAgICAgJC5yZW1vdmVDb29raWUgY29va2llTmFtZSAgICBcclxuICAgIGRlbGV0ZSBjb29raWVzW2Nvb2tpZU5hbWVdXHJcbiAgcmV0dXJuXHJcbiAgICBcclxuZGVsZXRlQWxsID0gLT5cclxuICBjb29raWVzID0ge31cclxuICBPSi5lYWNoIE9KLmNvb2tpZS5hbGwsICh2YWwsIGtleSkgLT5cclxuICAgIE9KLmNvb2tpZS5kZWxldGUga2V5ICBcclxuICByZXR1cm5cclxuICAgIFxyXG4gT0ouY29va2llLnJlZ2lzdGVyICdkZWxldGVBbGwnLCBkZWxldGVBbGxcclxuIE9KLmNvb2tpZS5yZWdpc3RlciAnZGVsZXRlJywgZGVsXHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ3NldCcsIHNldFxyXG4gT0ouY29va2llLnJlZ2lzdGVyICdnZXQnLCBnZXRcclxuIE9KLmNvb2tpZS5yZWdpc3RlciAnYWxsJywgIGFsbFxyXG4gXHJcbiBtb2R1bGUuZXhwb3J0cyA9IFxyXG4gIGRlbGV0ZUFsbDogZGVsZXRlQWxsXHJcbiAgZGVsZXRlOiBkZWxcclxuICBzZXQ6IHNldFxyXG4gIGdldDogZ2V0XHJcbiAgYWxsOiAgYWxsIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuZGVmZXIgPSAobWV0aG9kLCB3YWl0TXMpIC0+XHJcbiAgaWYgc2V0VGltZW91dFxyXG4gICAgcmV0dXJuIHNldFRpbWVvdXQgbWV0aG9kLCB3YWl0TXNcclxuICBcclxuT0oucmVnaXN0ZXIgJ2RlZmVyJywgZGVmZXJcclxubW9kdWxlLmV4cG9ydHMgPSBkZWZlciIsIiMgIyBlYWNoXHJcblxyXG5PSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuIyAjIyBjYW5FYWNoXHJcbmNhbkVhY2ggPSAob2JqKSAtPlxyXG4gICMgUmV0dXJuIHRydWUgaWYgdGhlIG9iamVjdCBbaXNdKGlzLmh0bWwpIHRydWx5IGl0ZXJhYmxlIChlLmcuIGFuIGluc3RhbmNlIG9mIE9iamVjdCBvciBBcnJheSlcclxuICBPSi5pcy5wbGFpbk9iamVjdChvYmopIG9yIE9KLmlzLm9iamVjdChvYmopIG9yIE9KLmlzLmFycmF5IG9ialxyXG5cclxuIyAjIyBbT0pdKG9qLmh0bWwpLmVhY2hcclxuXHJcbiMgSXRlcmF0ZSBhbGwgb2YgdGhlIG1lbWJlcnMgb2YgYW4gb2JqZWN0IChvciBhbiBhcnJheSkgd2l0aCBvcHRpb25hbCBjYWxsYmFjayBhbmQgcmVjdXJzaW9uLlxyXG5cclxuIyAtIGBvYmpgOiB0aGUgb2JqZWN0IHRvIGl0ZXJhdGUsXHJcbiMgLSBgb25FYWNoYDogYSBjYWxsYmFjayB0byBleGVjdXRlIGZvciBlYWNoIGl0ZXJhdGlvbixcclxuIyAtIGByZWN1cnNpdmVgOiBpZiB0cnVlLCByZWN1cnNpdmVseSBpdGVyYXRlIGFsbCB2YWxpZCBjaGlsZCBvYmplY3RzLlxyXG5lYWNoID0gKG9iaiwgb25FYWNoLCByZWN1cnNpdmUpIC0+XHJcbiAgaWYgY2FuRWFjaCBvYmpcclxuICAgICMgVXNpbmcgW0xvLURhc2hdKGh0dHA6Ly9sb2Rhc2guY29tL2RvY3MjZm9yb3duKSdzIGBmb3JPd25gIG1ldGhvZCB0byBlbnN1cmUgdGhhdCBvbmx5IHRoZSBhY3R1YWwgcHJvcGVydGllcyBvZiB0aGUgb2JqZWN0IGFyZSBlbnVtZXJhdGVkLlxyXG5cclxuICAgICMgLSBgb25FYWNoYCBjYWxsYmFjayB3aWxsIHJlY2VpdmUgMiBwYXJhbWV0ZXJzOlxyXG4gICAgIyAtIGB2YWxgIGFuZCBga2V5YC5cclxuICAgICMgLSBgdmFsYCBpcyBhbHdheXMgdGhlIHZhbHVlIG9mIHRoZSBwcm9wZXJ0eS5cclxuICAgICMgLSBga2V5YCBpcyBlaXRoZXIgdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IG9yIHRoZSBjdXJyZW50IGluZGV4IG9mIHRoZSBhcnJheS5cclxuICAgIF8uZm9yT3duIG9iaiwgKHZhbCwga2V5KSAtPlxyXG4gICAgICBpZiBvbkVhY2ggYW5kICh2YWwgb3Iga2V5KVxyXG4gICAgICAgIHF1aXQgPSBvbkVhY2ggdmFsLCBrZXlcclxuICAgICAgICByZXR1cm4gZmFsc2UgIGlmIGZhbHNlIGlzIHF1aXRcclxuICAgICAgZWFjaCB2YWwsIG9uRWFjaCwgdHJ1ZSAgaWYgdHJ1ZSBpcyByZWN1cnNpdmVcclxuICAgICAgcmV0dXJuXHJcblxyXG4gIHJldHVyblxyXG5cclxuIyAjIyByZWdpc3RlclxyXG5cclxuIyByZWdpc3RlciB0aGUgYGVhY2hgIG1ldGhvZCBvbiB0aGUgW09KXShPSi5odG1sKSBuYW1lc3BhY2VcclxuT0oucmVnaXN0ZXIgJ2VhY2gnLCBlYWNoXHJcbm1vZHVsZS5leHBvcnRzID0gZWFjaCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbnVua25vd24gPSAndW5rbm93bicgICBcclxuICBcclxuaW5wdXRUeXBlcyA9XHJcbiAgYnV0dG9uOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDBcclxuICAgIG5hbWU6ICdidXR0b24nXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGNoZWNrYm94OiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDFcclxuICAgIG5hbWU6ICdjaGVja2JveCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBjb2xvcjogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyXHJcbiAgICBuYW1lOiAnY29sb3InXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgZGF0ZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAzXHJcbiAgICBuYW1lOiAnZGF0ZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGRhdGV0aW1lOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDRcclxuICAgIG5hbWU6ICdkYXRldGltZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICAnZGF0ZXRpbWUtbG9jYWwnOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDVcclxuICAgIG5hbWU6ICdkYXRldGltZS1sb2NhbCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGVtYWlsOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDZcclxuICAgIG5hbWU6ICdlbWFpbCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgZmlsZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA3XHJcbiAgICBuYW1lOiAnZmlsZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiBmYWxzZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGhpZGRlbjogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA4XHJcbiAgICBuYW1lOiAnaGlkZGVuJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBpbWFnZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA5XHJcbiAgICBuYW1lOiAnaW1hZ2UnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIG1vbnRoOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDEwXHJcbiAgICBuYW1lOiAnbW9udGgnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIG51bWJlcjogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxMVxyXG4gICAgbmFtZTogJ251bWJlcidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBwYXNzd29yZDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxMlxyXG4gICAgbmFtZTogJ3Bhc3N3b3JkJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcmFkaW86ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTNcclxuICAgIG5hbWU6ICdyYWRpbydcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiB0cnVlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICByYW5nZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxNFxyXG4gICAgbmFtZTogJ3JhbmdlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHJlc2V0OiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE1XHJcbiAgICBuYW1lOiAncmVzZXQnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHNlYXJjaDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxNlxyXG4gICAgbmFtZTogJ3NlYXJjaCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHN1Ym1pdDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxN1xyXG4gICAgbmFtZTogJ3N1Ym1pdCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgdGVsOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE4XHJcbiAgICBuYW1lOiAnYnV0dG9uJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgdGV4dDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxOVxyXG4gICAgbmFtZTogJ3RleHQnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHRpbWU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMjBcclxuICAgIG5hbWU6ICd0aW1lJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgdXJsOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDIxXHJcbiAgICBuYW1lOiAndXJsJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB3ZWVrOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDIyXHJcbiAgICBuYW1lOiAnd2VlaydcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbk9KLmVudW1zLnJlZ2lzdGVyICd1bmtub3duJywgdW5rbm93blxyXG5PSi5lbnVtcy5yZWdpc3RlciAnaW5wdXRUeXBlcycsIGlucHV0VHlwZXNcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gXHJcbiAgdW5rbm93bjogdW5rbm93blxyXG4gIGlucHV0VHlwZXM6IGlucHV0VHlwZXMiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5pZiBPSi5UUkFDS19PTl9FUlJPUlxyXG4gIG9uRXJyb3IgPSBPSi5nbG9iYWwub25lcnJvclxyXG5cclxuICAjIyNcclxuICBMb2cgZXJyb3JzIHRvIHRoZSBjb25zb2xlXHJcbiAgIyMjXHJcbiAgT0ouZ2xvYmFsLm9uZXJyb3IgPSAobXNnLCB1cmwsIGxpbmVOdW1iZXIpIC0+XHJcbiAgICByZXQgPSBmYWxzZVxyXG4gICAgT0ouY29uc29sZS53YXJuIFwiJXNcXHIgdXJsOiAlc1xcciBsaW5lOiAlZFwiLCBtc2csIHVybCwgbGluZU51bWJlclxyXG4gICAgcmV0ID0gb25FcnJvciBtc2csIHVybCwgbGluZU51bWJlciBpZiBvbkVycm9yXHJcbiAgICByZXQgI3RydWUgbWVhbnMgZG9uJ3QgcHJvcGFnYXRlIHRoZSBlcnJvciAiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuaWYgT0ouZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXJcclxuICBldmVudE5hbWUgPSAnYWRkRXZlbnRMaXN0ZW5lcidcclxuICBldmVudEluZm8gPSAnJ1xyXG5lbHNlIFxyXG4gIGV2ZW50TmFtZSA9ICdhdHRhY2hFdmVudCdcclxuICBldmVudEluZm8gPSAnb24nXHJcbiAgXHJcbnB1c2hTdGF0ZSA9IChwYWdlTmFtZSwgZXZlbnQpIC0+XHJcbiAgaWYgcGFnZU5hbWVcclxuICAgICMga2VlcCB0aGUgbGluayBpbiB0aGUgYnJvd3NlciBoaXN0b3J5XHJcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSBudWxsLCBudWxsLCAnIycgKyBwYWdlTmFtZVxyXG4gICAgICBcclxuICAgICMgaGVyZSBjYW4gY2F1c2UgZGF0YSBsb2FkaW5nLCBldGMuXHJcbiAgICBcclxuICAgIGlmIGV2ZW50ICAgIFxyXG4gICAgICAjIGRvIG5vdCBnaXZlIGEgZGVmYXVsdCBhY3Rpb25cclxuICAgICAgaWYgZXZlbnQucHJldmVudERlZmF1bHRcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBldmVudC5yZXR1cm5WYWx1ZSA9IGZhbHNlXHJcbiAgZmFsc2VcclxuICBcclxucmVzdG9yZVN0YXRlID0gKGxvY2F0aW9uKSAtPlxyXG4gIHBhZ2VOYW1lID0gbG9jYXRpb24uaGFzaFxyXG4gIGlmIG5vdCBwYWdlTmFtZVxyXG4gICAgcGFnZU5hbWUgPSBsb2NhdGlvbi5ocmVmLnNwbGl0KCcjJylbMV1cclxuICBpZiBwYWdlTmFtZVxyXG4gICAgcGFnZU5hbWUgPSBwYWdlTmFtZS5yZXBsYWNlICcjJywgJydcclxuICAgIE9KLnB1Ymxpc2ggJ3Jlc3RvcmVTdGF0ZScsIHBhZ2VOYW1lOiBwYWdlTmFtZSwgbG9jYXRpb246IGxvY2F0aW9uXHJcbiAgcmV0dXJuXHJcbiAgXHJcbiMjIyBcclxuaGFuZyBvbiB0aGUgZXZlbnQsIGFsbCByZWZlcmVuY2VzIGluIHRoaXMgZG9jdW1lbnRcclxuIyMjXHJcbiAgXHJcbiMjI1xyXG4jIFRoaXMgYmluZHMgdG8gdGhlIGRvY3VtZW50IGNsaWNrIGV2ZW50LCB3aGljaCBpbiB0dXJuIGF0dGFjaGVzIHRvIGV2ZXJ5IGNsaWNrIGV2ZW50LCBjYXVzaW5nIHVuZXhwZWN0ZWQgYmVoYXZpb3IuXHJcbiMgRm9yIGFueSBjb250cm9sIHdoaWNoIHdpc2hlcyB0byB0cmlnZ2VyIGEgc3RhdGUgY2hhbmdlIGluIHJlc3BvbnNlIHRvIGFuIGV2ZW50LCBpdCBpcyBiZXR0ZXIgZm9yIHRoYXQgY29udHJvbCB0byBkZWZpbmUgdGhlIGJlaGF2aW9yLlxyXG5PSi5kb2N1bWVudFtldmVudE5hbWVdIGV2ZW50SW5mbyArICdjbGljaycsICgoZXZlbnQpIC0+XHJcbiAgZXZlbnQgPSBldmVudCBvciB3aW5kb3cuZXZlbnRcclxuICB0YXJnZXQgPSBldmVudC50YXJnZXQgb3IgZXZlbnQuc3JjRWxlbWVudFxyXG4gICAgXHJcbiAgIyBsb29raW5nIGZvciBhbGwgdGhlIGxpbmtzIHdpdGggJ2FqYXgnIGNsYXNzIGZvdW5kXHJcbiAgaWYgdGFyZ2V0IGFuZCB0YXJnZXQubm9kZU5hbWUgaXMgJ0EnIGFuZCAoJyAnICsgdGFyZ2V0LmNsYXNzTmFtZSArICcgJykuaW5kZXhPZignYWpheCcpID49IDBcclxuICAgIE9KLnB1c2hTdGF0ZSB0YXJnZXQuaHJlZiwgZXZlbnRcclxuICAgICAgXHJcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXHJcbiksIGZhbHNlXHJcbiMjI1xyXG5cclxuIyMjXHJcbmhhbmcgb24gcG9wc3RhdGUgZXZlbnQgdHJpZ2dlcmVkIGJ5IHByZXNzaW5nIGJhY2svZm9yd2FyZCBpbiBicm93c2VyXHJcbiMjI1xyXG5PSi5nbG9iYWxbZXZlbnROYW1lXSBldmVudEluZm8gKyAncG9wc3RhdGUnLCAoKGV2ZW50KSAtPlxyXG4gICAgXHJcbiAgIyB3ZSBnZXQgYSBub3JtYWwgTG9jYXRpb24gb2JqZWN0XHJcbiAgICBcclxuICAjIyNcclxuICBOb3RlLCB0aGlzIGlzIHRoZSBvbmx5IGRpZmZlcmVuY2Ugd2hlbiB1c2luZyB0aGlzIGxpYnJhcnksXHJcbiAgYmVjYXVzZSB0aGUgb2JqZWN0IGRvY3VtZW50LmxvY2F0aW9uIGNhbm5vdCBiZSBvdmVycmlkZW4sXHJcbiAgc28gbGlicmFyeSB0aGUgcmV0dXJucyBnZW5lcmF0ZWQgJ2xvY2F0aW9uJyBvYmplY3Qgd2l0aGluXHJcbiAgYW4gb2JqZWN0IHdpbmRvdy5oaXN0b3J5LCBzbyBnZXQgaXQgb3V0IG9mICdoaXN0b3J5LmxvY2F0aW9uJy5cclxuICBGb3IgYnJvd3NlcnMgc3VwcG9ydGluZyAnaGlzdG9yeS5wdXNoU3RhdGUnIGdldCBnZW5lcmF0ZWRcclxuICBvYmplY3QgJ2xvY2F0aW9uJyB3aXRoIHRoZSB1c3VhbCAnZG9jdW1lbnQubG9jYXRpb24nLlxyXG4gICMjIyAgICAgICAgICAgICAgICAgICAgIFxyXG4gIHJldHVybkxvY2F0aW9uID0gaGlzdG9yeS5sb2NhdGlvbiBvciBkb2N1bWVudC5sb2NhdGlvblxyXG4gICAgXHJcbiAgIyMjXHJcbiAgaGVyZSBjYW4gY2F1c2UgZGF0YSBsb2FkaW5nLCBldGMuXHJcbiAgIyMjXHJcbiAgT0ouaGlzdG9yeS5yZXN0b3JlU3RhdGUgcmV0dXJuTG9jYXRpb25cclxuICAgIFxyXG4gIHJldHVyblxyXG4pLCBmYWxzZSBcclxuICBcclxuIFxyXG5PSi5oaXN0b3J5LnJlZ2lzdGVyICdyZXN0b3JlU3RhdGUnLCByZXN0b3JlU3RhdGVcclxuT0ouaGlzdG9yeS5yZWdpc3RlciAncHVzaFN0YXRlJywgcHVzaFN0YXRlXHJcbiBcclxubW9kdWxlLmV4cG9ydHMgPSBcclxuICByZXN0b3JlU3RhdGU6IHJlc3RvcmVTdGF0ZVxyXG4gIHB1c2hTdGF0ZTogcHVzaFN0YXRlXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxuZWFjaCA9IHJlcXVpcmUgJy4vZWFjaCdcblxuaXNNZXRob2QgPSB7fVxuXG5pc01ldGhvZC5ib29sID0gKGJvb2xlYW4pIC0+XG4gIF8uaXNCb29sZWFuIGJvb2xlYW5cblxuaXNNZXRob2QuYXJyYXlOdWxsT3JFbXB0eSA9IChhcnIpIC0+XG4gIF8uaXNFbXB0eSBhcnJcblxuaXNNZXRob2Quc3RyaW5nTnVsbE9yRW1wdHkgPSAoc3RyKSAtPlxuICBzdHIgYW5kIChub3Qgc3RyLmxlbmd0aCBvciBzdHIubGVuZ3RoIGlzIDAgb3Igbm90IHN0ci50cmltIG9yIG5vdCBzdHIudHJpbSgpKVxuXG5pc01ldGhvZC5udW1iZXJOdWxsT3JFbXB0eSA9IChudW0pIC0+XG4gIG5vdCBudW0gb3IgaXNOYU4obnVtKSBvciBub3QgbnVtLnRvUHJlY2lzaW9uXG5cbmlzTWV0aG9kLmRhdGVOdWxsT3JFbXB0eSA9IChkdCkgLT5cbiAgbm90IGR0IG9yIG5vdCBkdC5nZXRUaW1lXG5cbmlzTWV0aG9kLm9iamVjdE51bGxPckVtcHR5ID0gKG9iaikgLT5cbiAgXy5pc0VtcHR5IG9iaiBvciBub3QgT2JqZWN0LmtleXMob2JqKSBvciBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCBpcyAwXG5cbmlzTWV0aG9kLnBsYWluT2JqZWN0ID0gKG9iaikgLT5cbiAgXy5pc1BsYWluT2JqZWN0IG9ialxuXG5pc01ldGhvZC5vYmplY3QgPSAob2JqKSAtPlxuICBfLmlzT2JqZWN0IG9ialxuXG5pc01ldGhvZC5kYXRlID0gKGR0KSAtPlxuICBfLmlzRGF0ZSBkdFxuXG5cbiMjI1xuRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGFuIGluc3RhbmNlIG9mIGEgTnVtYmVyIGFuZCBub3QgTmFOKlxuIyMjXG5pc01ldGhvZC5udW1iZXIgPSAobnVtKSAtPlxuICBudW1iZXIgPSByZXF1aXJlICcuLi9jb3JlL251bWJlcidcbiAgdHlwZW9mIG51bSBpcyAnbnVtYmVyJyBhbmQgZmFsc2UgaXMgKG51bWJlci5pc05hTihudW0pIG9yIGZhbHNlIGlzIG51bWJlci5pc0Zpbml0ZShudW0pIG9yIG51bWJlci5NQVhfVkFMVUUgaXMgbnVtIG9yIG51bWJlci5NSU5fVkFMVUUgaXMgbnVtKVxuXG4jIyNcbkRldGVybWluZXMgaWYgYSB2YWx1ZSBpcyBjb252ZXJ0aWJsZSB0byBhIE51bWJlclxuIyMjXG5pc01ldGhvZC5udW1lcmljID0gKG51bSkgLT5cbiAgcmV0ID0gaXNNZXRob2QubnVtYmVyKG51bSlcbiAgdW5sZXNzIHJldFxuICAgIHRvID0gcmVxdWlyZSAnLi90bydcbiAgICBudU51bSA9IHRvLm51bWJlcihudW0pXG4gICAgcmV0ID0gaXNNZXRob2QubnVtYmVyKG51TnVtKVxuICByZXRcblxuaXNNZXRob2QudmVuZG9yT2JqZWN0ID0gKG9iaikgLT5cbiAgcmV0ID0gKG9iaiBpbnN0YW5jZW9mIE9KWyc/J10pXG4gIHJldFxuXG5pc01ldGhvZC5lbGVtZW50SW5Eb20gPSAoZWxlbWVudElkKSAtPlxuICBmYWxzZSBpcyBpc01ldGhvZC5udWxsT3JFbXB0eShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpKVxuXG5pc01ldGhvZC5hcnJheSA9IChvYmopIC0+XG4gIF8uaXNBcnJheSBvYmpcblxuaXNNZXRob2Quc3RyaW5nID0gKHN0cikgLT5cbiAgXy5pc1N0cmluZyBzdHJcblxuaXNNZXRob2QudHJ1ZSA9IChvYmopIC0+XG4gIG9iaiBpcyB0cnVlIG9yIG9iaiBpcyAndHJ1ZScgb3Igb2JqIGlzIDEgb3Igb2JqIGlzICcxJ1xuXG5pc01ldGhvZC5mYWxzZSA9IChvYmopIC0+XG4gIG9iaiBpcyBmYWxzZSBvciBvYmogaXMgJ2ZhbHNlJyBvciBvYmogaXMgMCBvciBvYmogaXMgJzAnXG5cbmlzTWV0aG9kLnRydWVPckZhbHNlID0gKG9iaikgLT5cbiAgaXNNZXRob2QudHJ1ZSBvYmogb3IgaXNNZXRob2QuZmFsc2Ugb2JqXG5cbmlzTWV0aG9kLm51bGxPckVtcHR5ID0gKG9iaiwgY2hlY2tMZW5ndGgpIC0+XG4gIF8uaXNFbXB0eShvYmopIG9yIF8uaXNVbmRlZmluZWQob2JqKSBvciBfLmlzTnVsbChvYmopIG9yIF8uaXNOYU4ob2JqKVxuXG5pc01ldGhvZC5udWxsT3JVbmRlZmluZWQgPSAob2JqLCBjaGVja0xlbmd0aCkgLT5cbiAgXy5pc1VuZGVmaW5lZChvYmopIG9yIF8uaXNOdWxsKG9iaikgb3IgXy5pc05hTihvYmopXG5cbmlzTWV0aG9kLmluc3RhbmNlb2YgPSAobmFtZSwgb2JqKSAtPlxuICBvYmoudHlwZSBpcyBuYW1lIG9yIG9iaiBpbnN0YW5jZW9mIG5hbWVcblxuaXNNZXRob2QubWV0aG9kID0gKG9iaikgLT5cbiAgb2JqIGlzbnQgT0oubm9vcCBhbmQgXy5pc0Z1bmN0aW9uIG9ialxuXG4jIyNcbkRlcHJlY2F0ZWQuIExlZnQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LiBVc2UgaXMubWV0aG9kIGluc3RlYWQuXG4jIyNcbmlzTWV0aG9kLmZ1bmMgPSBpc01ldGhvZC5tZXRob2RcblxuT2JqZWN0LnNlYWwgaXNNZXRob2Rcbk9iamVjdC5mcmVlemUgaXNNZXRob2RcblxuT0oucmVnaXN0ZXIgJ2lzJywgaXNNZXRob2Rcbm1vZHVsZS5leHBvcnRzID0gaXNNZXRob2RcblxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm90eSA9IHJlcXVpcmUgJ25vdHknXHJcblxyXG4gIFxyXG5tYWtlTm90eSA9IChvcHRpb25zLCBvd25lcikgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBsYXlvdXQ6ICd0b3BSaWdodCdcclxuICAgIHRoZW1lOiAnZGVmYXVsdFRoZW1lJ1xyXG4gICAgdHlwZTogJ2FsZXJ0J1xyXG4gICAgdGV4dDogJycgI2NhbiBiZSBodG1sIG9yIHN0cmluZ1xyXG4gICAgZGlzbWlzc1F1ZXVlOiB0cnVlICNJZiB5b3Ugd2FudCB0byB1c2UgcXVldWUgZmVhdHVyZSBzZXQgdGhpcyB0cnVlXHJcbiAgICB0ZW1wbGF0ZTogJzxkaXYgY2xhc3M9XCJub3R5X21lc3NhZ2VcIj48c3BhbiBjbGFzcz1cIm5vdHlfdGV4dFwiPjwvc3Bhbj48ZGl2IGNsYXNzPVwibm90eV9jbG9zZVwiPjwvZGl2PjwvZGl2PicsXHJcbiAgICBhbmltYXRpb246IFxyXG4gICAgICAgIG9wZW46IFxyXG4gICAgICAgICAgaGVpZ2h0OiAndG9nZ2xlJ1xyXG4gICAgICAgIGNsb3NlOiBcclxuICAgICAgICAgIGhlaWdodDogJ3RvZ2dsZSdcclxuICAgICAgICBlYXNpbmc6ICdzd2luZydcclxuICAgICAgICBzcGVlZDogNTAwICNvcGVuaW5nICYgY2xvc2luZyBhbmltYXRpb24gc3BlZWRcclxuICAgIHRpbWVvdXQ6IDUwMDAgI2RlbGF5IGZvciBjbG9zaW5nIGV2ZW50LiBTZXQgZmFsc2UgZm9yIHN0aWNreSBub3RpZmljYXRpb25zXHJcbiAgICBmb3JjZTogZmFsc2UgI2FkZHMgbm90aWZpY2F0aW9uIHRvIHRoZSBiZWdpbm5pbmcgb2YgcXVldWUgd2hlbiBzZXQgdG8gdHJ1ZVxyXG4gICAgbW9kYWw6IGZhbHNlXHJcbiAgICBtYXhWaXNpYmxlOiA1ICN5b3UgY2FuIHNldCBtYXggdmlzaWJsZSBub3RpZmljYXRpb24gZm9yIGRpc21pc3NRdWV1ZSB0cnVlIG9wdGlvbixcclxuICAgIGtpbGxlcjogZmFsc2UgI2ZvciBjbG9zZSBhbGwgbm90aWZpY2F0aW9ucyBiZWZvcmUgc2hvd1xyXG4gICAgY2xvc2VXaXRoOiBbJ2NsaWNrJ10gICNbJ2NsaWNrJywgJ2J1dHRvbicsICdob3ZlciddXHJcbiAgICBjYWxsYmFjazogXHJcbiAgICAgICAgb25TaG93OiBPSi5ub29wLFxyXG4gICAgICAgIGFmdGVyU2hvdzogT0oubm9vcFxyXG4gICAgICAgIG9uQ2xvc2U6IE9KLm5vb3BcclxuICAgICAgICBhZnRlckNsb3NlOiBPSi5ub29wXHJcbiAgICBidXR0b25zOiBmYWxzZSAjYW4gYXJyYXkgb2YgYnV0dG9uc1xyXG4gICAgXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gbm90eSBkZWZhdWx0c1xyXG4gICAgICBcclxuICByZXRcclxuICAgIFxyXG5PSi5ub3RpZmljYXRpb25zLnJlZ2lzdGVyICdub3R5JywgbWFrZU5vdHlcclxubW9kdWxlLmV4cG9ydHMgPSBtYWtlTm90eSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5QdWJTdWIgPSByZXF1aXJlICdwdWJzdWItanMnXG5cbnRva2VucyA9IHt9XG5zdWJzY3JpYmVycyA9IFtdXG5ldmVudHMgPSB7fVxuXG5wcyA9IFxuICBnZXRFdmVudE5hbWU6IChldmVudCkgLT5cbiAgICBldmVudC50b1VwcGVyQ2FzZSgpLnJlcGxhY2UgJyAnLCAnXydcblxuICBzdWJzY3JpYmU6IChldmVudCwgbWV0aG9kKSAtPlxuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZSBldmVudFxuICAgIGlmIG5vdCBldmVudHNbZXZlbnROYW1lXSB0aGVuIGV2ZW50c1tldmVudE5hbWVdID0gW11cblxuICAgIHRva2VuID0gUHViU3ViLnN1YnNjcmliZSBldmVudE5hbWUsIG1ldGhvZFxuICAgIHRva2Vuc1t0b2tlbl0gPSB0b2tlblxuICAgIHN1YnNjcmliZXJzLnB1c2ggbWV0aG9kXG4gICAgZXZlbnRzW2V2ZW50TmFtZV0ucHVzaCBtZXRob2RcbiAgICB0b2tlblxuXG4gIHB1Ymxpc2g6IChldmVudCwgZGF0YSkgLT5cbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUgZXZlbnRcbiAgICBpZiBldmVudHNbZXZlbnROYW1lXVxuICAgICAgUHViU3ViLnB1Ymxpc2ggZXZlbnROYW1lLCBkYXRhXG4gICAgZWxzZVxuICAgICAgT0ouY29uc29sZS5pbmZvICdFdmVudCBuYW1lZCB7JyArIGV2ZW50ICsgJ30gaXMgbm90IHJlY29nbml6ZWQuJ1xuICAgIHJldHVyblxuXG4gIHVuc3Vic2NyaWJlOiAodG9rZW5Pck1ldGhvZCkgLT5cbiAgICBpZiBPSi5pcy5tZXRob2QgdG9rZW5Pck1ldGhvZFxuICAgICAgaWYgLTEgaXNudCBzdWJzY3JpYmVycy5pbmRleE9mIHRva2VuT3JNZXRob2RcbiAgICAgICAgUHViU3ViLnVuc3Vic2NyaWJlIHRva2VuT3JNZXRob2RcbiAgICAgICAgc3Vic2NyaWJlcnMgPSBfLnJlbW92ZSBzdWJzY3JpYmVycywgKG1ldGhvZCkgLT4gbWV0aG9kIGlzIHRva2VuT3JNZXRob2RcbiAgICAgIGVsc2VcbiAgICAgICAgT0ouY29uc29sZS5pbmZvICdFdmVudCBtZXRob2QgaXMgbm90IHJlY29nbml6ZWQuJ1xuICAgIGVsc2VcbiAgICAgIGlmIHRva2Vuc1t0b2tlbk9yTWV0aG9kXVxuICAgICAgICBQdWJTdWIudW5zdWJzY3JpYmUgdG9rZW5Pck1ldGhvZFxuICAgICAgICBkZWxldGUgdG9rZW5zW3Rva2VuT3JNZXRob2RdXG4gICAgcmV0dXJuXG5cbiAgdW5zdWJzY3JpYmVBbGw6ICgpIC0+XG4gICAgT0ouZWFjaCB0b2tlbnMsICh0b2tlbikgLT4gdW5zdWJzY3JpYmUgdG9rZW5cbiAgICBzdWJzY3JpYmVycyA9IFtdXG4gICAgZXZlbnRzID0ge31cbiAgICByZXR1cm5cblxuICB1bnN1YnNjcmliZUV2ZW50OiAoZXZlbnQpIC0+XG4gICAgZXZlbnROYW1lID0gcHMuZ2V0RXZlbnROYW1lIGV2ZW50XG4gICAgaWYgZXZlbnRzW2V2ZW50TmFtZV1cbiAgICAgIE9KLmVhY2ggZXZlbnRzW2V2ZW50TmFtZV0sIChtZXRob2QpIC0+IHVuc3Vic2NyaWJlIG1ldGhvZFxuICAgIGVsc2VcbiAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbmFtZWQgeycgKyBldmVudCArICd9IGlzIG5vdCByZWNvZ25pemVkLidcbiAgICBkZWxldGUgZXZlbnRzW2V2ZW50TmFtZV1cbiAgICByZXR1cm5cblxuT2JqZWN0LnNlYWwgcHNcbk9iamVjdC5mcmVlemUgcHNcblxuT0oucmVnaXN0ZXIgJ2dldEV2ZW50TmFtZScsIHBzLmdldEV2ZW50TmFtZVxuT0oucmVnaXN0ZXIgJ3B1Ymxpc2gnLCBwcy5wdWJsaXNoXG5PSi5yZWdpc3RlciAnc3Vic2NyaWJlJywgcHMuc3Vic2NyaWJlXG5PSi5yZWdpc3RlciAndW5zdWJzY3JpYmUnLCBwcy51bnN1YnNjcmliZVxuT0oucmVnaXN0ZXIgJ3Vuc3Vic2NyaWJlQWxsJywgcHMudW5zdWJzY3JpYmVBbGxcbk9KLnJlZ2lzdGVyICd1bnN1YnNjcmliZUV2ZW50JywgcHMudW5zdWJzY3JpYmVFdmVudFxuXG5tb2R1bGUuZXhwb3J0cyA9IHBzIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuIyMjXHJcbmh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTAxMTE1L2hvdy1jYW4taS1nZXQtcXVlcnktc3RyaW5nLXZhbHVlcy1pbi1qYXZhc2NyaXB0XHJcbiMjI1xyXG5xdWVyeVN0cmluZyA9IChwYXJhbSkgLT5cclxuICByZXQgPSB7fVxyXG4gICAgXHJcbiAgaWYgT0ouZ2xvYmFsLmxvY2F0aW9uXHJcbiAgICBwYXJhbXMgPSAgT0ouZ2xvYmFsLmxvY2F0aW9uLnNlYXJjaC5zdWJzdHIoMSkuc3BsaXQgJyYnXHJcbiAgICBpZiBwYXJhbXNcclxuICAgICAgaSA9IDBcclxuICAgICAgd2hpbGUgaSA8IHBhcmFtcy5sZW5ndGhcclxuICAgICAgICBwcm0gPSBwYXJhbXNbaV0uc3BsaXQgJz0nXHJcbiAgICAgICAgaWYgcHJtLmxlbmd0aCBpcyAyIFxyXG4gICAgICAgICAgcmV0W3BybVswXV0gPSBPSi5nbG9iYWwuZGVjb2RlVVJJQ29tcG9uZW50IHBybVsxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpXHJcbiAgICAgICAgaSArPSAxXHJcbiAgcmV0XHJcbiAgICBcclxuT0oucmVnaXN0ZXIgJ3F1ZXJ5U3RyaW5nJyxxdWVyeVN0cmluZ1xyXG5tb2R1bGUuZXhwb3J0cyA9IHF1ZXJ5U3RyaW5nIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbmVhY2ggPSByZXF1aXJlICcuL2VhY2gnXG5cbiMgIyByYW5nZXNcblxucm5nID0gXG5cbiAgIyAjIyByYW5nZVxuICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI3JhbmdlKSdzIGByYW5nZWAgbWV0aG9kXG4gIHJhbmdlOiAocGFyYW1zLi4uKSAtPlxuICAgIF8ucmFuZ2UgcGFyYW1zLi4uXG5cbiAgIyAjIyByYW5nZU1pblxuICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI21pbikncyBgbWluYCBtZXRob2RcbiAgcmFuZ2VNaW46IChwYXJhbXMuLi4pIC0+XG4gICAgXy5taW4gcGFyYW1zLi4uXG5cbiAgIyAjIyByYW5nZU1heFxuICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI21heCkncyBgbWF4YCBtZXRob2RcbiAgcmFuZ2VNYXg6IChwYXJhbXMuLi4pIC0+XG4gICAgXy5tYXggcGFyYW1zLi4uXG5cbiAgIyAjIyBzdHJpbmdSYW5nZVRvU3ViUmFuZ2VzXG4gICMjI1xuICBUYWtlIGFuIGFycmF5IG9mIHN0cmluZyB2YWx1ZXMgYW5kIGEgbnVtYmVyIG9mIHBhcnRpdGlvbnMgdG8gY3JlYXRlLlxuICBVc2VzIHRoZSBmaXJzdCBsZXR0ZXIgb2YgZWFjaCBzdHJpbmcgdmFsdWUgaW4gdGhlIGFycmF5IHRvIGNvbnZlcnQgdG8gdW5pcXVlIGNvZGUgY2hhcmFjdGVyIChsb3dlciBjYXNlKVxuICBCdWlsZHMgYSBpbnQgcmFuZ2UgYmFzZWQgb24gdW5pcXVlIGNvZGUgY2hhcnMuXG4gICMjI1xuICBzdHJpbmdUb1N1YlJhbmdlczogKG4gPSA2LCByYW5nZSA9IFtdKSAtPlxuICAgIGNoYXJSYW5nZSA9IFtdXG5cblxuICAgIGVhY2ggcmFuZ2UsICh2YWwpIC0+XG4gICAgICBjaGFyID0gdmFsLnRyaW0oKVswXS50b0xvd2VyQ2FzZSgpXG4gICAgICBpZiBmYWxzZSBpcyBvYmouY29udGFpbnMgY2hhclJhbmdlLCBjaGFyXG4gICAgICAgIGNoYXJSYW5nZS5wdXNoIGNoYXIuY2hhckNvZGVBdCgpXG5cbiAgICByZXQgPSByYW5nZVRvU3ViUmFuZ2VzIG4sIGNoYXJSYW5nZVxuXG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgblxuICAgICAgaSArPSAxXG4gICAgICBzdWJSYW5nZSA9IHJldFtpXVxuICAgICAgc3ViUmFuZ2UubWFwIFN0cmluZy5mcm9tQ2hhckNvZGVcblxuICAgIG9sZEdldFJhbmdlID0gcmV0LmdldFJhbmdlXG4gICAgcmV0LmdldFJhbmdlID0gKHZhbCkgLT5cbiAgICAgIGNoYXIgPSB2YWwudHJpbSgpWzBdLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgpXG4gICAgICBpZHggPSBvbGRHZXRSYW5nZSBjaGFyXG4gICAgICBpZHhcbiAgICByZXRcblxuICAjICMjIHJhbmdlVG9TdWJSYW5nZXNcbiAgIyMjXG4gIFRha2UgYW4gYXJyYXkgb2YgaW50IHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXG4gIERpdmlkZXMgdGhlIG9yaWdpbmFsIGFycmF5IGludG8gdGhlIHNwZWNpZmllZCBudW1iZXIgb2Ygc3ViIGFycmF5cy5cbiAgT3ZlcmZsb3cgaXMgcGFzc2VkIHRvIHRoZSBmaW5hbCBwYXJ0aXRpb24uXG4gICMjI1xuICB0b1N1YlJhbmdlczogKG4gPSA2LCByYW5nZSA9IFtdKSAtPlxuICAgIHJldCA9IG9iai5vYmplY3QoKVxuICAgIHJhbmdlTG93ID0gcm5nLnJhbmdlTWluIHJhbmdlXG4gICAgcmFuZ2VIaWdoID0gcm5nLnJhbmdlTWF4IHJhbmdlXG5cbiAgICBkaXN0YW5jZSA9IHJhbmdlSGlnaCAtIHJhbmdlTG93XG4gICAgc3ViUmFuZ2VTaXplID0gZGlzdGFuY2UvblxuICAgIHN1YlJhbmdlcyA9IHJldC5hZGQgJ3JhbmdlcycsIG9iai5vYmplY3QoKVxuICAgIGNodW5rVmFsID0gcmFuZ2VMb3dcblxuICAgIG1hcCA9IG9iai5vYmplY3QoKVxuXG4gICAgaSA9IDBcbiAgICB3aGlsZSBpIDwgblxuICAgICAgaSArPSAxXG4gICAgICBpZiBpIDwgbiB0aGVuIGp1bXAgPSBNYXRoLnJvdW5kIHN1YlJhbmdlU2l6ZVxuICAgICAgZWxzZVxuICAgICAgICBqdW1wID0gTWF0aC5mbG9vciBzdWJSYW5nZVNpemVcbiAgICAgICAgaWYgY2h1bmtWYWwgKyBqdW1wIDw9IHJhbmdlSGlnaFxuICAgICAgICAgIGp1bXAgKz0gcmFuZ2VIaWdoIC0gY2h1bmtWYWwgLSBqdW1wICsgMVxuXG4gICAgICBzdWJSYW5nZSA9IHJuZy5yYW5nZSBjaHVua1ZhbCwgY2h1bmtWYWwgKyBqdW1wXG4gICAgICBlYWNoIHN1YlJhbmdlLCAodmFsKSAtPiBtYXAuYWRkIHZhbCwgaVxuICAgICAgc3ViUmFuZ2VzW2ldID0gc3ViUmFuZ2VcbiAgICAgIGNodW5rVmFsICs9IGp1bXBcblxuICAgIHJldC5hZGQgJ2dldFJhbmdlJywgKHZhbCkgLT5cbiAgICAgIG1hcFt2YWxdXG5cbiAgICByZXRcblxuT2JqZWN0LnNlYWwgcm5nXG5PYmplY3QuZnJlZXplIHJuZ1xuXG5PSi5yZWdpc3RlciAncmFuZ2VzJywgcm5nXG5tb2R1bGUuZXhwb3J0cyA9IHJuZyAgIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbiQgPSByZXF1aXJlICdqcXVlcnknXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuaXNNZXRob2QgPSByZXF1aXJlICcuL2lzJ1xub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5lYWNoID0gcmVxdWlyZSAnLi9lYWNoJ1xuXG4jICMgdG9cbnRvID1cbiAgIyAjIyBib29sXG4gICMgY29udmVydCBhbnkgY29tcGF0aWJsZSBvYmplY3QgdG8gYSBib29sZWFuLiBJbmNvbXBhdGlibGUgb2JqZWN0cyBhcmUgZmFsc2UuXG4gIGJvb2w6IChzdHIpIC0+XG4gICAgcmV0Qm9vbCA9IGlzTWV0aG9kWyd0cnVlJ10oc3RyKVxuICAgIHJldEJvb2wgPSBmYWxzZSAgaWYgcmV0Qm9vbCBpcyBmYWxzZSBvciByZXRCb29sIGlzbnQgdHJ1ZVxuICAgIHJldEJvb2xcblxuICAjICMjIEVTNV9Ub0Jvb2xcbiAgIyAoZGVidWcpIG1ldGhvZCB0byBleHBsaWNpdGx5IGZvcmNlIGFuIGBpZihvYmopYCBldmFsdWF0aW9uIHRvIGZsb3cgdGhyb3VnaCB0aGUgRVM1IHNwZWMgZm9yIHRydXRoaW5lc3NcbiAgJ0VTNV9Ub0Jvb2wnOiAodmFsKSAtPlxuICAgIHZhbCBpc250IGZhbHNlIGFuZCB2YWwgaXNudCAwIGFuZCB2YWwgaXNudCAnJyBhbmQgdmFsIGlzbnQgbnVsbCBhbmQgdHlwZW9mIHZhbCBpc250ICd1bmRlZmluZWQnIGFuZCAodHlwZW9mIHZhbCBpc250ICdudW1iZXInIG9yIG5vdCBpc05hTih2YWwpKVxuXG4gICMgIyMgZGF0ZUZyb21UaWNrc1xuICAjIHRha2UgYSBudW1iZXIgcmVwcmVzZW50aW5nIHRpY2tzIGFuZCBjb252ZXJ0IGl0IGludG8gYW4gaW5zdGFuY2Ugb2YgRGF0ZVxuICBkYXRlRnJvbVRpY2tzOiAodGlja1N0cikgLT5cbiAgICB0aWNzRGF0ZVRpbWUgPSB0by5zdHJpbmcodGlja1N0cilcbiAgICByZXQgPSB1bmRlZmluZWRcbiAgICB0aWNrcyA9IHVuZGVmaW5lZFxuICAgIG9mZnNldCA9IHVuZGVmaW5lZFxuICAgIGxvY2FsT2Zmc2V0ID0gdW5kZWZpbmVkXG4gICAgYXJyID0gdW5kZWZpbmVkXG4gICAgaWYgZmFsc2UgaXMgaXNNZXRob2QubnVsbE9yRW1wdHkodGljc0RhdGVUaW1lKVxuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJy8nLCAnJylcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCdEYXRlJywgJycpXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnKCcsICcnKVxuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJyknLCAnJylcbiAgICAgIGFyciA9IHRpY3NEYXRlVGltZS5zcGxpdCgnLScpXG4gICAgICBpZiBhcnIubGVuZ3RoID4gMVxuICAgICAgICB0aWNrcyA9IHRvLm51bWJlcihhcnJbMF0pXG4gICAgICAgIG9mZnNldCA9IHRvLm51bWJlcihhcnJbMV0pXG4gICAgICAgIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpXG4gICAgICAgIHJldCA9IG5ldyBEYXRlKCh0aWNrcyAtICgobG9jYWxPZmZzZXQgKyAob2Zmc2V0IC8gMTAwICogNjApKSAqIDEwMDApKSlcbiAgICAgIGVsc2UgaWYgYXJyLmxlbmd0aCBpcyAxXG4gICAgICAgIHRpY2tzID0gdG8ubnVtYmVyKGFyclswXSlcbiAgICAgICAgcmV0ID0gbmV3IERhdGUodGlja3MpXG4gICAgcmV0XG5cbiAgIyAjIyBiaW5hcnlcbiAgIyBjb252ZXJ0IGFuIG9iamVjdCB0byBiaW5hcnkgMCBvciAxXG4gIGJpbmFyeTogKG9iaikgLT5cbiAgICByZXQgPSBOYU5cbiAgICBpZiBvYmogaXMgMCBvciBvYmogaXMgJzAnIG9yIG9iaiBpcyAnJyBvciBvYmogaXMgZmFsc2Ugb3IgdG8uc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgaXMgJ2ZhbHNlJ1xuICAgICAgcmV0ID0gMFxuICAgIGVsc2UgcmV0ID0gMSAgaWYgb2JqIGlzIDEgb3Igb2JqIGlzICcxJyBvciBvYmogaXMgdHJ1ZSBvciB0by5zdHJpbmcob2JqKS50b0xvd2VyQ2FzZSgpLnRyaW0oKSBpcyAndHJ1ZSdcbiAgICByZXRcblxuXG4gICMgIyMgbnVtYmVyXG4gICNcbiAgIyBBdHRlbXB0cyB0byBjb252ZXJ0IGFuIGFyYml0cmFyeSB2YWx1ZSB0byBhIE51bWJlci5cbiAgIyBMb29zZSBmYWxzeSB2YWx1ZXMgYXJlIGNvbnZlcnRlZCB0byAwLlxuICAjIExvb3NlIHRydXRoeSB2YWx1ZXMgYXJlIGNvbnZlcnRlZCB0byAxLlxuICAjIEFsbCBvdGhlciB2YWx1ZXMgYXJlIHBhcnNlZCBhcyBJbnRlZ2Vycy5cbiAgIyBGYWlsdXJlcyByZXR1cm4gYXMgTmFOLlxuICAjXG4gIG51bWJlcjogKGlucHV0TnVtLCBkZWZhdWx0TnVtKSAtPlxuICAgIHRyeUdldE51bWJlciA9ICh2YWwpIC0+XG4gICAgICByZXQgPSBOYU5cbiAgICAgICMgaWYgYHZhbGAgYWxyZWFkeSAoaXMpW2lzLmh0bWxdIGEgTnVtYmVyLCByZXR1cm4gaXRcbiAgICAgIGlmIGlzTWV0aG9kLm51bWJlcih2YWwpXG4gICAgICAgIHJldCA9IHZhbFxuICAgICAgIyBlbHNlIGlmIGB2YWxgIGFscmVhZHkgKGlzKVtpcy5odG1sXSBhIFN0cmluZyBvciBhIEJvb2xlYW4sIGNvbnZlcnQgaXRcbiAgICAgIGVsc2UgaWYgaXNNZXRob2Quc3RyaW5nKHZhbCkgb3IgaXNNZXRob2QuYm9vbCh2YWwpXG4gICAgICAgIHRyeUdldCA9ICh2YWx1ZSkgLT5cbiAgICAgICAgICBudW0gPSB0by5iaW5hcnkodmFsdWUpXG4gICAgICAgICAgbnVtID0gK3ZhbHVlICBpZiBub3QgaXNNZXRob2QubnVtYmVyKG51bSkgYW5kIHZhbHVlXG4gICAgICAgICAgbnVtID0gXy5wYXJzZUludCh2YWx1ZSwgMCkgaWYgbm90IGlzTWV0aG9kLm51bWJlcihudW0pXG4gICAgICAgICAgbnVtXG4gICAgICAgIHJldCA9IHRyeUdldCB2YWxcbiAgICAgIHJldFxuXG4gICAgcmV0VmFsID0gdHJ5R2V0TnVtYmVyKGlucHV0TnVtKVxuICAgIGlmIG5vdCBpc01ldGhvZC5udW1iZXIocmV0VmFsKVxuICAgICAgcmV0VmFsID0gdHJ5R2V0TnVtYmVyKGRlZmF1bHROdW0pXG4gICAgICByZXRWYWwgPSBOdW1iZXIuTmFOIGlmIG5vdCBpc01ldGhvZC5udW1iZXIocmV0VmFsKVxuICAgIHJldFZhbFxuXG4gICMgIyMgc3RyaW5nXG4gICMgY29udmVydCBhbiBvYmplY3QgdG8gc3RyaW5nXG4gIHN0cmluZzogKGlucHV0U3RyLCBkZWZhdWx0U3RyKSAtPlxuICAgIHRyeUdldFN0cmluZyA9IChzdHIpIC0+XG4gICAgICByZXQgPSB1bmRlZmluZWRcbiAgICAgIGlmIGlzTWV0aG9kLnN0cmluZyhzdHIpXG4gICAgICAgIHJldCA9IHN0clxuICAgICAgZWxzZVxuICAgICAgICByZXQgPSAnJ1xuICAgICAgICByZXQgPSBzdHIudG9TdHJpbmcoKSAgaWYgaXNNZXRob2QuYm9vbChzdHIpIG9yIGlzTWV0aG9kLm51bWJlcihzdHIpIG9yIGlzTWV0aG9kLmRhdGUoc3RyKVxuICAgICAgcmV0XG4gICAgcmV0MSA9IHRyeUdldFN0cmluZyhpbnB1dFN0cilcbiAgICByZXQyID0gdHJ5R2V0U3RyaW5nKGRlZmF1bHRTdHIpXG4gICAgcmV0VmFsID0gJydcbiAgICBpZiByZXQxLmxlbmd0aCBpc250IDBcbiAgICAgIHJldFZhbCA9IHJldDFcbiAgICBlbHNlIGlmIHJldDEgaXMgcmV0MiBvciByZXQyLmxlbmd0aCBpcyAwXG4gICAgICByZXRWYWwgPSByZXQxXG4gICAgZWxzZVxuICAgICAgcmV0VmFsID0gcmV0MlxuICAgIHJldFZhbFxuXG5PYmplY3Quc2VhbCB0b1xuT2JqZWN0LmZyZWV6ZSB0b1xuXG5PSi5yZWdpc3RlciAndG8nLCB0b1xubW9kdWxlLmV4cG9ydHMgPSB0byIsIiMgIyBjcmVhdGVVVUlEXHJcblxyXG5PSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG4jIyNcclxuR2VuZXJhdGVzIGEgcmFuZG9tIHN0cmluZyB0aGF0IGNvbXBsaWVzIHRvIHRoZSBSRkMgNDEyMiBzcGVjaWZpY2F0aW9uIGZvciBHVUlEL1VVSUQuXHJcbihlLmcuICdCNDJBMTUzRi0xRDlBLTRGOTItOTkwMy05MkMxMURENjg0RDInKVxyXG5XaGlsZSBub3QgYSB0cnVlIFVVSUQsIGZvciB0aGUgcHVycG9zZXMgb2YgdGhpcyBhcHBsaWNhdGlvbiwgaXQgc2hvdWxkIGJlIHN1ZmZpY2llbnQuXHJcbiMjI1xyXG5jcmVhdGVGYXV4VVVJRCA9IC0+XHJcbiAgICBcclxuICAjIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQxMjIudHh0XHJcbiAgIyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNTAzNC9ob3ctdG8tY3JlYXRlLWEtZ3VpZC11dWlkLWluLWphdmFzY3JpcHRcclxuICBzID0gW11cclxuICBzLmxlbmd0aCA9IDM2XHJcbiAgaGV4RGlnaXRzID0gJzAxMjM0NTY3ODlhYmNkZWYnXHJcbiAgaSA9IDBcclxuXHJcbiAgd2hpbGUgaSA8IDM2XHJcbiAgICBzW2ldID0gaGV4RGlnaXRzLnN1YnN0cihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAweDEwKSwgMSlcclxuICAgIGkgKz0gMVxyXG4gIHNbMTRdID0gJzQnICMgYml0cyAxMi0xNSBvZiB0aGUgdGltZV9oaV9hbmRfdmVyc2lvbiBmaWVsZCB0byAwMDEwXHJcbiAgc1sxOV0gPSBoZXhEaWdpdHMuc3Vic3RyKChzWzE5XSAmIDB4MykgfCAweDgsIDEpICMgYml0cyA2LTcgb2YgdGhlIGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWQgdG8gMDFcclxuICBzWzhdID0gc1sxM10gPSBzWzE4XSA9IHNbMjNdID0gJy0nXHJcbiAgdXVpZCA9IHMuam9pbignJylcclxuICB1dWlkXHJcblxyXG5PSi5yZWdpc3RlciAnY3JlYXRlVVVJRCcsIGNyZWF0ZUZhdXhVVUlEXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRmF1eFVVSUQiXX0=
