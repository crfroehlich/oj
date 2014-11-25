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

require('./dom/dom.coffee');

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
var $, DOM, OJ,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __slice = [].slice;

OJ = require('../oj');

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

DOM = (function() {
  function DOM(el, parent) {
    var enabled;
    this.el = el;
    this.parent = parent;
    this.disable = __bind(this.disable, this);
    enabled = true;
    this.tagName = this.el.tagName;
    this['$'] = $(this.el.get());
    this['0'] = this.el.get();
  }

  DOM.prototype.append = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).append.apply(_ref, params);
  };

  DOM.prototype.prepend = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).prepend.apply(_ref, params);
  };

  DOM.prototype.remove = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).remove.apply(_ref, params);
  };

  DOM.prototype.css = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).css.apply(_ref, params);
  };

  DOM.prototype.html = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).html.apply(_ref, params);
  };

  DOM.prototype.text = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).text.apply(_ref, params);
  };

  DOM.prototype.attr = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).attr.apply(_ref, params);
  };

  DOM.prototype.data = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).data.apply(_ref, params);
  };

  DOM.prototype.get = function() {
    var params, _ref;
    params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return (_ref = this.el).get.apply(_ref, params);
  };

  DOM.prototype.add = function(key, val) {
    return this[key] = val;
  };

  DOM.prototype.isControlStillValid = function() {
    var isMethod, valid;
    isMethod = require('../tools/is');
    valid = false === isMethod.nullOrEmpty(this.el) && this.isValid();
    if (false === valid) {
      throw new Error('el is null. Event bindings may not have been GCd.');
    }
    return valid;
  };

  DOM.prototype.isValid = function() {
    return this.el && (this.el.el instanceof HTMLElement || this.el.el instanceof DocumentFragment);
  };

  DOM.prototype.addClass = function(name) {
    if (this.isControlStillValid()) {
      this['$'].addClass(name);
    }
    return this;
  };

  DOM.prototype.bind = function(eventName, event) {
    return this.on(eventName, event);
  };

  DOM.prototype.on = function(eventName, event) {
    if (this.isControlStillValid()) {
      this['$'].on(eventName, event);
    }
    return this;
  };

  DOM.prototype.off = function(eventName, event) {
    if (this.isControlStillValid()) {
      this['$'].off(eventName, event);
    }
    return this.el;
  };

  DOM.prototype.keyboard = function(keys, event) {
    return this;
  };

  DOM.prototype.disable = function() {
    var enabled;
    if (this.isControlStillValid()) {
      enabled = false;
      this.attr('disabled', 'disabled');
      this.addClass('disabled', 'disabled');
    }
    return this;
  };

  DOM.prototype.empty = function() {
    if (this.isControlStillValid()) {
      this['$'].empty();
    }
    return this;
  };

  DOM.prototype.enable = function() {
    var enabled;
    if (this.isControlStillValid()) {
      enabled = true;
      this.removeAttr('disabled');
      this.removeClass('disabled');
    }
    return this;
  };

  DOM.prototype.getId = function() {
    var id;
    if (this.isControlStillValid()) {
      id = this[0].id;
    }
    return id;
  };

  DOM.prototype.hide = function() {
    if (this.isControlStillValid()) {
      this.css('display', 'none');
    }
    return this;
  };

  DOM.prototype.length = function() {
    var len, to;
    to = require('../tools/to');
    len = 0;
    if (this.isControlStillValid()) {
      len = to.number(this['$'].length);
    }
    return len;
  };

  DOM.prototype.remove = function() {
    if (this.el && this['$']) {
      this['$'].remove();
      this.el = null;
      this['$'] = null;
      this[0] = null;
    }
    return null;
  };

  DOM.prototype.removeClass = function(name) {
    if (this.isControlStillValid()) {
      this['$'].removeClass(name);
    }
    return this;
  };

  DOM.prototype.removeProp = function(name) {
    if (this.isControlStillValid()) {
      this['$'].removeProp(name);
    }
    return this;
  };

  DOM.prototype.removeAttr = function(name) {
    if (this.isControlStillValid()) {
      this['$'].removeAttr(name);
    }
    return this;
  };

  DOM.prototype.required = function(truthy, addLabel) {
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

  DOM.prototype.show = function() {
    if (this.isControlStillValid()) {
      this['$'].show();
    }
    return this;
  };

  DOM.prototype.toggle = function() {
    if (this.isControlStillValid()) {
      this['$'].toggle();
    }
    return this;
  };

  DOM.prototype.toggleEnable = function() {
    if (this.isControlStillValid()) {
      if (enabled) {
        this.disable();
      } else {
        this.enable();
      }
    }
    return this;
  };

  DOM.prototype.trigger = function(eventName, eventOpts) {
    if (this.isControlStillValid()) {
      this['$'].trigger(eventName, eventOpts);
    }
    return this.el;
  };

  DOM.prototype.unbind = function(eventName, event) {
    return this.off(eventName, event);
  };

  DOM.prototype.val = function(value) {
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

  DOM.prototype.valueOf = function() {
    return this.val();
  };

  DOM.prototype.toString = function() {
    return this.val();
  };

  return DOM;

})();

OJ.register('isElementInDom', function(elementId) {
  return false === OJ.is.nullOrEmpty(OJ.getElement(elementId));
});

OJ.register('getElement', function(id) {
  if (typeof document !== 'undefined') {
    return document.getElementById(id);
  }
});

OJ.register('dom', DOM);

module.exports = DOM;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../oj":58,"../tools/is":69,"../tools/to":74}],19:[function(require,module,exports){
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
var DOM, NodeFactory, OJ, ThinDOM, closed, getNodeFromFactory, nestableNodeNames, nodeNames, nonNestableNodes, open, _,
  __slice = [].slice;

OJ = require('../oj');

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

ThinDOM = (typeof window !== "undefined" ? window.ThinDOM : typeof global !== "undefined" ? global.ThinDOM : null);

DOM = require('./dom');

closed = 'a abbr acronym address applet article aside audio b bdo big blockquote body button canvas caption center cite code colgroup command datalist dd del details dfn dir div dl dt em embed fieldset figcaption figure font footer form frameset h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins keygen kbd label legend li map mark menu meter nav noframes noscript object ol optgroup option output p pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr tt u ul var video wbr xmp'.split(' ');

open = 'area base br col command css !DOCTYPE embed hr img input keygen link meta param source track wbr'.split(' ');

nestableNodeNames = ['div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'fieldset', 'select', 'ol', 'ul', 'table'];

nonNestableNodes = ['li', 'legend', 'tr', 'td', 'option', 'body', 'head', 'source', 'tbody', 'tfoot', 'thead', 'link', 'script'];

nodeNames = ['a', 'b', 'br', 'button', 'div', 'em', 'fieldset', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'i', 'img', 'input', 'label', 'legend', 'li', 'nav', 'ol', 'option', 'p', 'select', 'span', 'strong', 'sup', 'svg', 'table', 'tbody', 'td', 'textarea', 'th', 'thead', 'tr', 'ul'];

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
      this.ojNode = new DOM(this.thinNode, this.owner);
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
},{"../oj":58,"../tools/is":69,"./dom":18}],24:[function(require,module,exports){
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



},{"../dom/nodeFactory":23,"../oj":58,"../tools/to":74}],26:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbnRyeXBvaW50LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcYXN5bmNcXGFqYXguY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxhc3luY1xccHJvbWlzZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXGdyaWQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb21wb25lbnRzXFxpbnB1dGdyb3VwLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGFicy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXHRpbGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb250cm9sc1xcaWNvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGRhdGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxmdW5jdGlvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG51bWJlci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG9iamVjdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXHByb3BlcnR5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxcc3RyaW5nLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxib2R5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxjb21wb25lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGNvbnRyb2wuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGRvbS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZWxlbWVudC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZnJhZ21lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGdlbmVyaWNzLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxpbnB1dC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcbm9kZUZhY3RvcnkuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcYS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxici5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxmb3JtLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXG9sLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHNlbGVjdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0YWJsZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0ZXh0YXJlYS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0aGVhZC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx1bC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGdsb2JhbC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcYnV0dG9uaW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGNoZWNrYm94LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxjb2xvci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZXRpbWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGRhdGV0aW1lbG9jYWwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGVtYWlsLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxmaWxlLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxoaWRkZW4uY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGltYWdlaW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXG1vbnRoLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxudW1iZXIuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHBhc3N3b3JkLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxyYWRpby5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xccmFuZ2UuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJlc2V0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxzZWFyY2guY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHN1Ym1pdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdGVsLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx0ZXh0aW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHRpbWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHVybC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcd2Vlay5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXG9qLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcb2pJbml0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXEpzb25Ub1RhYmxlLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGFycmF5MkQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcY29uc29sZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxjb29raWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZGVmZXIuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZWFjaC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlbnVtcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlcnJvci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxoaXN0b3J5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGlzLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXG5vdHkuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xccHVic3ViLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHF1ZXJ5U3RyaW5nLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHJhbmdlcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFx0by5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFx1dWlkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE9BQUEsQ0FBUSxhQUFSLENBQUEsQ0FBQTs7QUFBQSxPQUNBLENBQVEsaUJBQVIsQ0FEQSxDQUFBOztBQUFBLE9BRUEsQ0FBUSxxQkFBUixDQUZBLENBQUE7O0FBQUEsT0FHQSxDQUFRLHdCQUFSLENBSEEsQ0FBQTs7QUFBQSxPQUlBLENBQVEsMEJBQVIsQ0FKQSxDQUFBOztBQUFBLE9BS0EsQ0FBUSxnQ0FBUixDQUxBLENBQUE7O0FBQUEsT0FNQSxDQUFRLDBCQUFSLENBTkEsQ0FBQTs7QUFBQSxPQU9BLENBQVEsMEJBQVIsQ0FQQSxDQUFBOztBQUFBLE9BUUEsQ0FBUSx3QkFBUixDQVJBLENBQUE7O0FBQUEsT0FTQSxDQUFRLG9CQUFSLENBVEEsQ0FBQTs7QUFBQSxPQVVBLENBQVEsd0JBQVIsQ0FWQSxDQUFBOztBQUFBLE9BV0EsQ0FBUSxzQkFBUixDQVhBLENBQUE7O0FBQUEsT0FZQSxDQUFRLHNCQUFSLENBWkEsQ0FBQTs7QUFBQSxPQWFBLENBQVEsc0JBQVIsQ0FiQSxDQUFBOztBQUFBLE9BY0EsQ0FBUSwwQkFBUixD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LEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0E1SkY7QUFBQSxFQXVLQSxLQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0F4S0Y7QUFBQSxFQW1MQSxLQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0FwTEY7QUFBQSxFQStMQSxNQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0FoTUY7QUFBQSxFQTJNQSxNQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0E1TUY7QUFBQSxFQXVOQSxHQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0F4TkY7QUFBQSxFQW1PQSxJQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sTUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsT0FSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0FwT0Y7QUFBQSxFQStPQSxJQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sTUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsT0FSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7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WixFQUEwQixjQUExQixDQXpCQSxDQUFBOztBQUFBLE1BMEJNLENBQUMsT0FBUCxHQUFpQixjQTFCakIsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlICcuL29qLmNvZmZlZSdcclxucmVxdWlyZSAnLi9vakluaXQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2FzeW5jL2FqYXguY29mZmVlJ1xyXG5yZXF1aXJlICcuL2FzeW5jL3Byb21pc2UuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvZ3JpZC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29tcG9uZW50cy9pbnB1dGdyb3VwLmNvZmZlZSdcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL3RhYnMuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvdGlsZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29udHJvbHMvaWNvbi5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29yZS9kYXRlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9jb3JlL2Z1bmN0aW9uLmNvZmZlZSdcclxucmVxdWlyZSAnLi9jb3JlL251bWJlci5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29yZS9vYmplY3QuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvcmUvc3RyaW5nLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vbm9kZUZhY3RvcnkuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RvbS9ib2R5LmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vY29tcG9uZW50LmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vY29udHJvbC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZG9tL2RvbS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZG9tL2VsZW1lbnQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RvbS9mcmFnbWVudC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZG9tL2dlbmVyaWNzLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vaW5wdXQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2EuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2JyLmNvZmZlZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy9mb3JtLmNvZmZlZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy9pbnB1dC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvb2wuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3NlbGVjdC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvdGFibGUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RleHRhcmVhLmNvZmZlZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy90aGVhZC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvdWwuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9idXR0b25pbnB1dC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2NoZWNrYm94LmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvY29sb3IuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9kYXRlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZXRpbWUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9kYXRldGltZWxvY2FsLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvZW1haWwuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9maWxlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvaGlkZGVuLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvaW1hZ2VpbnB1dC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL21vbnRoLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvbnVtYmVyLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvcGFzc3dvcmQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9yYWRpby5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3JhbmdlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvcmVzZXQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9zZWFyY2guY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9zdWJtaXQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy90ZWwuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy90ZXh0aW5wdXQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy90aW1lLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvdXJsLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvd2Vlay5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvYXJyYXkyRC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvY29uc29sZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvY29va2llLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9kZWZlci5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvZWFjaC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvZW51bXMuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2Vycm9yLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9oaXN0b3J5LmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9pcy5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvbm90eS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvcHVic3ViLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9xdWVyeVN0cmluZy5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvcmFuZ2VzLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy90by5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvdXVpZC5jb2ZmZWUnIiwiIyAjIGFqYXhcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG5jb25maWcgPSB7fVxyXG4gIFxyXG4jIGRlZmluZSBhIHN0YW5kYXJkIG9uIHN1Y2Nlc3MgaGFuZGxlciwgd3JpdGUgb3V0IHRoZSByZXF1ZXN0IHN0YXRzIHRvIGEgdGFibGVcclxuY29uZmlnLm9uU3VjY2VzcyA9IChvcHRzLCBkYXRhLCB1cmwpIC0+XHJcbiAgcmVzcG9uc2UgPSB7fVxyXG4gIE9KLmV4dGVuZCByZXNwb25zZSwgZGF0YVxyXG4gIG9wdHMub25TdWNjZXNzIHJlc3BvbnNlXHJcbiAgaWYgT0ouTE9HX0FMTF9BSkFYXHJcbiAgICBPSi5jb25zb2xlLnRhYmxlIFtcclxuICAgICAgV2Vic2VydmljZTogb3B0cy5hamF4T3B0cy51cmxcclxuICAgICAgU3RhcnRUaW1lOiBvcHRzLnN0YXJ0VGltZVxyXG4gICAgICBFbmRUaW1lOiBuZXcgRGF0ZSgpXHJcbiAgICBdIFxyXG4gIHJldHVyblxyXG4gIFxyXG4jIGRlZmluZSBhIHN0YW5kYXJkIG9uIGVycm9yIGhhbmRsZXIsIHdyaXRlIG91dCB0aGUgcmVxdWVzdCBlcnJvciBjb25leHQgdG8gYSB0YWJsZVxyXG5jb25maWcub25FcnJvciA9ICh4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cywgcGFyYW0xLCBvcHRzID0gT0oub2JqZWN0KCkpIC0+XHJcbiAgaWYgdGV4dFN0YXR1cyBpc250ICdhYm9ydCdcclxuICAgIGlmIE9KLkxPR19BTExfQUpBWF9FUlJPUlNcclxuICAgICAgT0ouY29uc29sZS50YWJsZSBbXHJcbiAgICAgICAgV2Vic2VydmljZTogb3B0cy5hamF4T3B0cy51cmxcclxuICAgICAgICBEYXRhOiBvcHRzLmFqYXhPcHRzLmRhdGFcclxuICAgICAgICBGYWlsZWQ6IHRleHRTdGF0dXNcclxuICAgICAgICBTdGF0ZTogeG1sSHR0cFJlcXVlc3Quc3RhdGUoKVxyXG4gICAgICAgIFN0YXR1czogeG1sSHR0cFJlcXVlc3Quc3RhdHVzXHJcbiAgICAgICAgU3RhdHVzVGV4dDogeG1sSHR0cFJlcXVlc3Quc3RhdHVzVGV4dFxyXG4gICAgICAgIFJlYWR5U3RhdGU6IHhtbEh0dHBSZXF1ZXN0LnJlYWR5U3RhdGVcclxuICAgICAgICBSZXNwb25zZVRleHQ6IHhtbEh0dHBSZXF1ZXN0LnJlc3BvbnNlVGV4dFxyXG4gICAgICBdXHJcblxyXG4gICAgb3B0cy5vbkVycm9yIHRleHRTdGF0dXNcclxuICByZXR1cm5cclxuICBcclxuIyBpbiB0aGUgY2FzZSB3aGVyZSBgb3B0c2AgaXMgYSBzdHJpbmcsIGNvbnZlcnQgaXQgdG8gYW4gb2JqZWN0XHJcbm9wdHNGcm9tVXJsID0gKG9wdHMpIC0+XHJcbiAgaWYgT0ouaXMuc3RyaW5nIG9wdHNcclxuICAgIHVybCA9IG9wdHNcclxuICAgIG9wdHMgPSBPSi5vYmplY3QoKVxyXG4gICAgb3B0cy5hZGQgJ2FqYXhPcHRzJywgT0oub2JqZWN0KClcclxuICAgIG9wdHMuYWpheE9wdHMuYWRkICd1cmwnLCB1cmxcclxuICBvcHRzXHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgYGV4ZWNgIG1ldGhvZCB0byBoYW5kbGUgYWxsIHJlcXVlc3QgdmVyYnMuIFVzZXMgdGhlIFtqUXVlcnkuYWpheF0oaHR0cDovL2FwaS5qcXVlcnkuY29tL2NhdGVnb3J5L2FqYXgvKSBBUEkuXHJcbiMgYGV4ZWNSZXF1ZXN0YCByZXR1cm5zIGEgcHJvbWlzZSByZXByZXNlbnQgdGhlIGFjdHVhbCBBSkFYIGNhbGwuXHJcbiAgXHJcbiMgLSBgdmVyYmAgZGVmYXVsdCB2YWx1ZSA9ICdHRVQnXHJcbiMgLSBgb3B0c2Agb2JqZWN0XHJcbiMgLS0gYG9wdHMuYWpheE9wdHNgIG9iamVjdCBmb3IgYWxsIGpRdWVyeSdzIGFqYXgtc3BlY2lmaWMgcHJvcGVydGllcy5cclxuY29uZmlnLmV4ZWNSZXF1ZXN0ID0gKHZlcmIgPSAnR0VUJywgb3B0cykgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBhamF4T3B0czpcclxuICAgICAgdXJsOiAnJ1xyXG4gICAgICBkYXRhOiB7fVxyXG4gICAgICB0eXBlOiB2ZXJiXHJcbiAgICAgIHhockZpZWxkczpcclxuICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgZGF0YVR5cGU6ICdqc29uJ1xyXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcbiAgICAgICAgXHJcbiAgICBvblN1Y2Nlc3M6IE9KLm5vb3BcclxuICAgIG9uRXJyb3I6IE9KLm5vb3BcclxuICAgIG9uQ29tcGxldGU6IE9KLm5vb3BcclxuICAgIG92ZXJyaWRlRXJyb3I6IGZhbHNlXHJcbiAgICB3YXRjaEdsb2JhbDogdHJ1ZVxyXG4gICAgdXNlQ2FjaGU6IGZhbHNlXHJcbiAgICBcclxuICBvcHRzID0gb3B0c0Zyb21Vcmwgb3B0c1xyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0cywgdHJ1ZVxyXG4gICAgXHJcbiAgZGVmYXVsdHMuc3RhcnRUaW1lID0gbmV3IERhdGUoKVxyXG4gICAgXHJcbiAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgIyBHRVQgcmVxdWVzdHMgZXhwZWN0IHF1ZXJ5U3RyaW5nIHBhcmFtZXRlcnNcclxuICAgIGlmIGRlZmF1bHRzLmFqYXhPcHRzLnZlcmIgaXMgJ0dFVCdcclxuICAgICAgZGVmYXVsdHMuYWpheE9wdHMuZGF0YSA9IE9KLnBhcmFtcyBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXHJcbiAgICAjIGFsbCBvdGhlciByZXF1ZXN0cyB0YWtlIGFuIG9iamVjdFxyXG4gICAgZWxzZVxyXG4gICAgICBkZWZhdWx0cy5hamF4T3B0cy5kYXRhID0gT0ouc2VyaWFsaXplIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcclxuICAgIFxyXG4gIGdldEpRdWVyeURlZmVycmVkID0gKHdhdGNoR2xvYmFsKSAtPlxyXG4gICAgcmV0ID0gJC5hamF4IGRlZmF1bHRzLmFqYXhPcHRzXHJcbiAgICAgIFxyXG4gICAgcmV0LmRvbmUgKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSAtPlxyXG4gICAgICBjb25maWcub25TdWNjZXNzIGRlZmF1bHRzLCBkYXRhXHJcblxyXG4gICAgcmV0LmZhaWwgKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRleHQpIC0+XHJcbiAgICAgIGNvbmZpZy5vbkVycm9yIGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRleHQsIGRlZmF1bHRzXHJcbiAgXHJcbiAgICByZXQuYWx3YXlzICh4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cykgLT5cclxuICAgICAgZGVmYXVsdHMub25Db21wbGV0ZSB4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1c1xyXG5cclxuICAgIE9KLmFzeW5jLmFqYXhQcm9taXNlIHJldFxyXG5cclxuICBwcm9taXNlID0gZ2V0SlF1ZXJ5RGVmZXJyZWQoZGVmYXVsdHMud2F0Y2hHbG9iYWwpXHJcbiAgcHJvbWlzZVxyXG4gIFxyXG5hamF4ID0ge31cclxuICBcclxuIyAjIyBwb3N0XHJcbiMgW09KXShvai5odG1sKS5hamF4LnBvc3Q6IGluc2VydCBhIG5ldyBvYmplY3Qgb3IgaW5pdCBhIGZvcm0gcG9zdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuIFxyXG5hamF4LnBvc3QgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ1BPU1QnLCBvcHRzXHJcbiAgXHJcbiMgIyMgZ2V0XHJcbiMgW09KXShvai5odG1sKS5hamF4LmdldDogZ2V0IGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbiNcclxuYWpheC5nZXQgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ0dFVCcsIG9wdHNcclxuXHJcbiMgIyMgZGVsZXRlXHJcbiMgW09KXShvai5odG1sKS5hamF4LmRlbGV0ZTogZGVsZXRlIGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbmFqYXguZGVsZXRlID0gKG9wdHMpIC0+XHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdERUxFVEUnLCBvcHRzXHJcblxyXG4jICMjIHB1dFxyXG4jIFtPSl0ob2ouaHRtbCkuYWpheC5wdXQ6IHVwZGF0ZSBhbiBleGlzdGluZyBvYmplY3RcclxuICBcclxuIyAtIGBvcHRzYCBjYW4gYmUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgcmVxdWVzdC5cclxuIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxyXG5hamF4LnB1dCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnUFVUJywgb3B0c1xyXG5cclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2FqYXgnLCBhamF4XHJcbm1vZHVsZS5leHBvcnRzID0gYWpheCIsIiMgIyBwcm9taXNlXHJcblxyXG5PSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuIyAjIyBhamF4UHJvbWlzZVxyXG4jIFtPSl0ob2ouaHRtbCkuYXN5bmMuYWpheFByb21pc2UgY29udmVydHMgYW4gQUpBWCBYbWxIdHRwUmVxdWVzdCBpbnRvIGEgUHJvbWlzZS4gXHJcbiMgU2VlIGFsc28gW1Byb21pc2UucmVzb2x2ZV0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG5hamF4UHJvbWlzZSA9IChhamF4KSAtPiBcclxuICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlIGFqYXhcclxuICBwcm9taXNlLmFib3J0ID0gYWpheC5hYm9ydFxyXG4gIHByb21pc2UucmVhZHlTdGF0ZSA9IGFqYXgucmVhZHlTdGF0ZVxyXG4gIHByb21pc2VcclxuXHJcbiMgIyMgYWxsXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5hbGwgdGFrZXMgYW4gYXJyYXkgb2YgZnVuY3Rpb25zIGFuZCByZXR1cm5zIGEgcHJvbWlzZSByZXByZXNlbnRpbmcgdGhlIHN1Y2Nlc3Mgb2YgYWxsIG1ldGhvZHMgb3IgdGhlIGZhaWx1cmUgb2YgYW55IG1ldGhvZC5cclxuIyBTZWUgYWxzbyBbUHJvbWlzZS5hbGxdKGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvYmxvYi9tYXN0ZXIvQVBJLm1kKS5cclxuYWxsID0gKGluaXRBcnJheSkgLT5cclxuICByZXFzID0gaW5pdEFycmF5IG9yIFtdXHJcbiAgcHJvbWlzZSA9IFByb21pc2UuYWxsKHJlcXMpXHJcbiAgcHJvbWlzZS5wdXNoID0gKGl0ZW0pIC0+XHJcbiAgICByZXFzLnB1c2ggaXRlbVxyXG4gICAgcmV0dXJuXHJcbiAgcHJvbWlzZVxyXG5cclxuIyAjIyBkZWZlclxyXG4jIFtPSl0ob2ouaHRtbCkuYXN5bmMuZGVmZXIgY29udmVydHMgYSBmdW5jdGlvbiBpbnRvIGEgUHJvbWlzZSB0byBleGVjdXRlIHRoYXQgZnVuY3Rpb24uIFxyXG4jIFNlZSBhbHNvIFtQcm9taXNlLm1ldGhvZF0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG5kZWZyID0gKGZ1bmMgPSBPSi5ub29wKSAtPlxyXG4gIHJldCA9IFByb21pc2UubWV0aG9kIGZ1bmNcclxuICByZXRcclxuICBcclxuICBcclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2RlZmVyJywgZGVmclxyXG5PSi5hc3luYy5yZWdpc3RlciAnYWxsJywgYWxsXHJcbk9KLmFzeW5jLnJlZ2lzdGVyICdhamF4UHJvbWlzZScsIGFqYXhQcm9taXNlXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbiAgZGVmZXI6IGRlZnJcclxuICBhbGw6IGFsbFxyXG4gIGFqYXhQcm9taXNlOiBhamF4UHJvbWlzZVxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vb2pJbml0J1xuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcbmFycmF5MkQgPSByZXF1aXJlICcuLi90b29scy9hcnJheTJEJ1xuXG5ub2RlTmFtZSA9ICd4LWdyaWQnXG5jbGFzc05hbWUgPSAnZ3JpZCdcbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcblxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XG4gIGRlZmF1bHRzID1cbiAgICB0aWxlU2l6ZXM6XG4gICAgICBzbWFsbFNwYW46ICcnXG4gICAgICBtZWRpdW1TcGFuOiAnJ1xuICAgICAgbGFyZ2VTcGFuOiAnJ1xuICAgIHByb3BzOlxuICAgICAgY2xhc3M6ICdncmlkJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuXG4gIHJvd3MgPSBbXVxuICB0aWxlcyA9IGFycmF5MkQoKVxuXG4gIGZpbGxNaXNzaW5nID0gKCkgLT5cbiAgICB0aWxlcy5lYWNoIChyb3dObywgY29sTm8sIHZhbCkgLT5cbiAgICAgIGlmIG5vdCB2YWxcbiAgICAgICAgcm93ID0gcmV0LnJvdyByb3dOb1xuICAgICAgICByb3cubWFrZSAndGlsZScsIGNvbE5vLCB7fVxuXG4gIHJldC5hZGQgJ3JvdycsIChyb3dObyA9IHJvd3MubGVuZ3RoLTEgb3IgMSktPlxuICAgIG51Um93ID0gcm93c1tyb3dOby0xXVxuICAgIGlmIG5vdCBudVJvd1xuICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xuICAgICAgICBudVJvdyA9IHJldC5tYWtlICdkaXYnLCBwcm9wczogY2xhc3M6ICdyb3cnXG4gICAgICAgIHJvd3MucHVzaCBudVJvd1xuICAgICAgbnVSb3cuYWRkICd0aWxlJywgKGNvbE5vLCBvcHRzKSAtPlxuICAgICAgICBvcHRzID0gT0ouZXh0ZW5kIChPSi5leHRlbmQge30sIGRlZmF1bHRzLnRpbGVTaXplcyksIG9wdHNcbiAgICAgICAgbnVUaWxlID0gT0ouY29tcG9uZW50cy50aWxlIG9wdHMsIG51Um93XG4gICAgICAgIHRpbGVzLnNldCByb3dObywgY29sTm8sIG51VGlsZVxuICAgICAgICBudVRpbGVcbiAgICBudVJvd1xuXG4gIHJldC5hZGQgJ3RpbGUnLCAocm93Tm8sIGNvbE5vLCBvcHRzKSAtPlxuICAgIGlmIG5vdCByb3dObyBvciByb3dObyA8IDEgdGhlbiByb3dObyA9IDFcbiAgICBpZiBub3QgY29sTm8gb3IgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXG5cbiAgICByb3cgPSByZXQucm93IHJvd05vXG4gICAgdGlsZSA9IHRpbGVzLmdldCByb3dObywgY29sTm9cblxuICAgIGlmIG5vdCB0aWxlXG4gICAgICBpID0gMFxuICAgICAgd2hpbGUgaSA8IGNvbE5vXG4gICAgICAgIGkgKz0gMVxuICAgICAgICB0cnlUaWxlID0gdGlsZXMuZ2V0IHJvd05vLCBpXG4gICAgICAgIGlmIG5vdCB0cnlUaWxlXG4gICAgICAgICAgaWYgaSBpcyBjb2xOb1xuICAgICAgICAgICAgdGlsZSA9IHJvdy5tYWtlICd0aWxlJywgb3B0c1xuICAgICAgICAgIGVsc2UgaWYgbm90IHRpbGVcbiAgICAgICAgICAgIHJvdy5tYWtlICd0aWxlJ1xuXG4gICAgZmlsbE1pc3NpbmcoKVxuICAgIHRpbGVcblxuICByZXRcblxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbXBvbmVudCA9IHJlcXVpcmUgJy4uL2RvbS9jb21wb25lbnQnXG51dWlkID0gcmVxdWlyZSAnLi4vdG9vbHMvdXVpZCdcblxubm9kZU5hbWUgPSAneC1pbnB1dC1ncm91cCdcbmNsYXNzTmFtZSA9ICdpbnB1dGdyb3VwJ1xuXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXG5cbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBmb3JJZCA9IHV1aWQoKVxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJ2Zvcm0tZ3JvdXAnXG4gICAgZXZlbnRzOlxuICAgICAgY2hhbmdlOiBPSi5ub29wXG4gICAgZm9yOiBmb3JJZFxuICAgIGxhYmVsVGV4dDogJydcbiAgICBpbnB1dE9wdHM6XG4gICAgICBwcm9wczpcbiAgICAgICAgaWQ6IGZvcklkXG4gICAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgICBjbGFzczogJydcbiAgICAgICAgcGxhY2Vob2xkZXI6ICcnXG4gICAgICAgIHZhbHVlOiAnJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuXG4gIGdyb3VwID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ2Zvcm0tZ3JvdXAnXG5cbiAgcmV0Lmdyb3VwTGFiZWwgPSBncm91cC5tYWtlICdsYWJlbCcsIHByb3BzOiB7IGZvcjogZm9ySWQgfSwgdGV4dDogZGVmYXVsdHMubGFiZWxUZXh0XG5cbiAgZGVmYXVsdHMuaW5wdXRPcHRzLnByb3BzLmNsYXNzICs9ICcgZm9ybS1jb250cm9sJ1xuICByZXQuZ3JvdXBJbnB1dCA9IGdyb3VwLm1ha2UgJ2lucHV0JywgZGVmYXVsdHMuaW5wdXRPcHRzXG5cbiAgcmV0Lmdyb3VwVmFsdWUgPSAoKSAtPlxuICAgIHJldC5ncm91cElucHV0LnZhbCgpXG5cbiAgcmV0XG5cbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xuXG5ub2RlTmFtZSA9ICd4LXRhYnMnXG5jbGFzc05hbWUgPSAndGFicydcblxuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxuXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cbiAgZGVmYXVsdHMgPVxuICAgIHRhYnM6IHt9XG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJydcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgcmV0ID0gY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcblxuICB0YWJzID0gcmV0Lm1ha2UgJ3VsJywgcHJvcHM6IGNsYXNzOiAnbmF2IG5hdi10YWJzJ1xuICBjb250ZW50ID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ3RhYi1jb250ZW50J1xuXG4gIGZpcnN0ID0gdHJ1ZVxuICBPSi5lYWNoIGRlZmF1bHRzLnRhYnMsICh0YWJWYWwsIHRhYk5hbWUpIC0+XG4gICAgdGFiQ2xhc3MgPSAnJ1xuICAgIGlmIGZpcnN0XG4gICAgICBmaXJzdCA9IGZhbHNlXG4gICAgICB0YWJDbGFzcyA9ICdhY3RpdmUnXG4gICAgYSA9IHRhYnMubWFrZSAnbGknLCBwcm9wczogY2xhc3M6IHRhYkNsYXNzXG4gICAgICAubWFrZSgnYScsXG4gICAgICAgIHRleHQ6IHRhYk5hbWVcbiAgICAgICAgcHJvcHM6XG4gICAgICAgICAgaHJlZjogJyMnICsgdGFiTmFtZVxuICAgICAgICAgICdkYXRhLXRvZ2dsZSc6ICd0YWInXG4gICAgICAgIGV2ZW50czpcbiAgICAgICAgICBjbGljazogLT5cbiAgICAgICAgICAgIGEuJC50YWIgJ3Nob3cnKVxuXG4gICAgdGFiQ29udGVudENsYXNzID0gJ3RhYi1wYW5lICcgKyB0YWJDbGFzc1xuICAgIHJldC5hZGQgdGFiTmFtZSwgY29udGVudC5tYWtlKCdkaXYnLCBwcm9wczogY2xhc3M6IHRhYkNvbnRlbnRDbGFzcywgaWQ6IHRhYk5hbWUpXG5cbiAgcmV0XG5cbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xuXG5ub2RlTmFtZSA9ICd4LXRpbGUnXG5jbGFzc05hbWUgPSAndGlsZSdcblxuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxuICBcbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBkZWZhdWx0cyA9XG4gICAgd2lkdGg6XG4gICAgICB4czogJydcbiAgICAgIHNtOiAnJ1xuICAgICAgbWQ6ICcnXG4gICAgICBsZzogJydcbiAgICBwcm9wczpcbiAgICAgIGNsYXNzOiAndGlsZSdcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgaWYgZGVmYXVsdHMud2lkdGgueHMgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC14cy0nICsgZGVmYXVsdHMud2lkdGgueHNcbiAgaWYgZGVmYXVsdHMud2lkdGguc20gdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1zbS0nICsgZGVmYXVsdHMud2lkdGguc21cbiAgaWYgZGVmYXVsdHMud2lkdGgubWQgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1tZC0nICsgZGVmYXVsdHMud2lkdGgubWRcbiAgaWYgZGVmYXVsdHMud2lkdGgubGcgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1sZy0nICsgZGVmYXVsdHMud2lkdGgubGdcblxuICByZXQgPSBPSi5jb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuICByZXRcblxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbnRyb2wgPSByZXF1aXJlICcuLi9kb20vY29udHJvbCdcblxuY29udHJvbE5hbWUgPSAneS1pY29uJ1xuZnJpZW5kbHlOYW1lID0gJ2ljb24nXG5cbk9KLmNvbnRyb2xzLm1lbWJlcnNbZnJpZW5kbHlOYW1lXSA9IGNvbnRyb2xOYW1lXG5cbmNudHJsID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBkZWZhdWx0cyA9XG4gICAgaWNvbk9wdHM6XG4gICAgICBuYW1lOiAnJ1xuICAgICAgc3RhY2tlZEljb246ICcnXG4gICAgICBzd2FwSWNvbjogJydcbiAgICAgIHNpemU6IGZhbHNlXG4gICAgICBjb2xvcjogJydcbiAgICAgIGxpYnJhcnk6ICcnXG4gICAgICBpc0ZpeGVkV2lkdGg6IGZhbHNlXG4gICAgICBpc0xpc3Q6IGZhbHNlXG4gICAgICBpc1NwaW5uZXI6IGZhbHNlXG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJydcbiAgICByb290Tm9kZVR5cGU6ICdzcGFuJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9uc1xuICByZXQgPSBjb250cm9sIGRlZmF1bHRzLCBvd25lciwgY29udHJvbE5hbWVcblxuICBpc1RvZ2dsZWQgPSBmYWxzZVxuXG4gICNUT0RPOiBTdXBwb3J0IGZvciBwaWN0b2ljb25zXG4gICNUT0RPOiBTdXBwb3J0IGZvciBvdGhlciBGb250QXdlc29tZSBwcm9wZXJ0aWVzIChzdGFjaywgcm90YXRlLCBzaXplLCBldGMpXG5cbiAgY2xhc3NOYW1lQmFzZSA9ICdmYSAnXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzRml4ZWRXaWR0aCB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLWZ3ICdcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuaXNMaXN0IHRoZW4gY2xhc3NOYW1lQmFzZSArPSAnZmEtbGkgJ1xuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc1NwaW5uZXIgdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1zcGluICdcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZVxuICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLnNpemUgPiAxIGFuZCBkZWZhdWx0cy5pY29uT3B0cy5zaXplIDw9IDVcbiAgICAgIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5zaXplICsgJ3ggJ1xuXG4gIGNsYXNzTmFtZSA9IGNsYXNzTmFtZUJhc2UgKyAnZmEtJyArIGRlZmF1bHRzLmljb25PcHRzLm5hbWVcbiAgcmV0Lm15SWNvbiA9IHJldC5tYWtlICdpJywgcHJvcHM6IGNsYXNzOiBjbGFzc05hbWVcblxuICAjVG9nZ2xlcyBkaXNwbGF5IGJldHdlZW4gbm9ybWFsIGljb24gYW5kIHN3YXAgaWNvbiwgaWYgYSBzd2FwIGljb24gaGFzIGJlZW4gc3BlY2lmaWVkXG4gIHJldC50b2dnbGVJY29uID0gLT5cbiAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zd2FwSWNvblxuICAgICAgbmV3SWNvbiA9IGRlZmF1bHRzLmljb25PcHRzLm5hbWVcblxuICAgICAgaXNUb2dnbGVkID0gIWlzVG9nZ2xlZFxuXG4gICAgICBpZiBpc1RvZ2dsZWRcbiAgICAgICAgcmV0Lm15SWNvbi4kLnJlbW92ZUNsYXNzKCdmYS0nICsgbmV3SWNvbilcbiAgICAgICAgbmV3SWNvbiA9IGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uXG4gICAgICBlbHNlXG4gICAgICAgIHJldC5teUljb24uJC5yZW1vdmVDbGFzcygnZmEtJyArIGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uKVxuXG4gICAgICByZXQubXlJY29uLiQuYWRkQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxuXG5cbiAgcmV0XG5cbk9KLmNvbnRyb2xzLnJlZ2lzdGVyIGZyaWVuZGx5TmFtZSwgY250cmxcbm1vZHVsZS5leHBvcnRzID0gY250cmwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuZ2V0RGF0ZUZyb21Ebkpzb24gPSAoZG5EYXRlKSAtPlxyXG4gICAgXHJcbiAgIyBUcmFuc2Zvcm1zIGEgLk5FVCBKU09OIGRhdGUgaW50byBhIEphdmFTY3JpcHQgZGF0ZS5cclxuICAjIG5hbWU9J29iaicgIE9iamVjdCB0byB0ZXN0XHJcbiAgIyB0eXBlPSdCb29sZWFuJyAvPlxyXG4gICNcclxuICAjICAgICAgIHZhciBtaWxsaSA9IE9KLnRvLm51bWJlcihEbkRhdGUucmVwbGFjZSgvXFwvRGF0ZVxcKChcXGQrKVxcLT8oXFxkKylcXClcXC8vLCAnJDEnKSk7XHJcbiAgIyAgICAgICB2YXIgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKERuRGF0ZS5yZXBsYWNlKC9cXC9EYXRlXFwoXFxkKyhbXFwrXFwtXT9cXGQrKVxcKVxcLy8sICckMScpKTtcclxuICAjICAgICAgIHZhciBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcclxuICAjICAgICAgIHJldHVybiBuZXcgRGF0ZSgobWlsbGkgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpO1xyXG4gICMgICAgICAgXHJcbiAgICBcclxuICAjIERuIERhdGUgd2lsbCBsb29rIGxpa2UgL0RhdGUoMTMzNTc1ODQwMDAwMC0wNDAwKS8gIFxyXG4gIGRuRGF0ZVN0ciA9IE9KLnRvLnN0cmluZyhkbkRhdGUpXHJcbiAgcmV0ID0gdW5kZWZpbmVkXHJcbiAgdGlja3MgPSB1bmRlZmluZWRcclxuICBvZmZzZXQgPSB1bmRlZmluZWRcclxuICBsb2NhbE9mZnNldCA9IHVuZGVmaW5lZFxyXG4gIGFyciA9IHVuZGVmaW5lZFxyXG4gIHJldCA9IE9KLmRhdGVUaW1lTWluVmFsdWVcclxuICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eShkbkRhdGVTdHIpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnLycsICcnKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJ0RhdGUnLCAnJylcclxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCcoJywgJycpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnKScsICcnKVxyXG4gICAgYXJyID0gZG5EYXRlU3RyLnNwbGl0KCctJylcclxuICAgIGlmIGFyci5sZW5ndGggPiAxXHJcbiAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcclxuICAgICAgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKGFyclsxXSlcclxuICAgICAgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KClcclxuICAgICAgcmV0ID0gbmV3IERhdGUoKHRpY2tzIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKVxyXG4gICAgZWxzZSBpZiBhcnIubGVuZ3RoIGlzIDFcclxuICAgICAgdGlja3MgPSBPSi50by5udW1iZXIoYXJyWzBdKVxyXG4gICAgICByZXQgPSBuZXcgRGF0ZSh0aWNrcylcclxuICByZXRcclxuXHJcbiAgT0oucmVnaXN0ZXIgJ2dldERhdGVGcm9tRG5Kc29uJywgZ2V0RGF0ZUZyb21Ebkpzb25cclxuICBtb2R1bGVzLmV4cG9ydHMgPSBnZXREYXRlRnJvbURuSnNvblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuIyBXcmFwIHRoZSBleGVjdXRpb24gb2YgYSBtZXRob2QgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5ICAgICBcclxuIyBpZ25vcmUgZXJyb3JzIGZhaWxpbmcgdG8gZXhlYyBzZWxmLWV4ZWN1dGluZyBmdW5jdGlvbnMgXHJcbiMgUmV0dXJuIGEgbWV0aG9kIHdyYXBwZWQgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5XHJcbnRyeUV4ZWMgPSAodHJ5RnVuYykgLT5cclxuICAndXNlIHN0cmljdCdcclxuICByZXQgPSBmYWxzZVxyXG4gIHRoYXQgPSB0aGlzXHJcbiAgdHJ5XHJcbiAgICByZXQgPSB0cnlGdW5jLmFwcGx5KHRoYXQsIEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpICBpZiBPSi5pcy5tZXRob2QodHJ5RnVuYylcclxuICBjYXRjaCBleGNlcHRpb25cclxuICAgIGlmIChleGNlcHRpb24ubmFtZSBpcyAnVHlwZUVycm9yJyBvciBleGNlcHRpb24udHlwZSBpcyAnY2FsbGVkX25vbl9jYWxsYWJsZScpIGFuZCBleGNlcHRpb24udHlwZSBpcyAnbm9uX29iamVjdF9wcm9wZXJ0eV9sb2FkJ1xyXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0lnbm9yaW5nIGV4Y2VwdGlvbjogJywgZXhjZXB0aW9uXHJcbiAgICBlbHNlXHJcbiAgICAgIE9KLmNvbnNvbGUuZXJyb3IgZXhjZXB0aW9uXHJcbiAgZmluYWxseVxyXG5cclxuICByZXRcclxuXHJcblxyXG4gbWV0aG9kID0gKHRyeUZ1bmMpIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgdGhhdCA9IHRoaXNcclxuICAtPlxyXG4gICAgYXJncyA9IEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cywgMClcclxuICAgIGFyZ3MudW5zaGlmdCB0cnlGdW5jXHJcbiAgICBPSi50cnlFeGVjLmFwcGx5IHRoYXQsIGFyZ3NcclxuXHJcbiAgXHJcbiBcclxuIE9KLnJlZ2lzdGVyICdtZXRob2QnLCBtZXRob2RcclxuIE9KLnJlZ2lzdGVyICd0cnlFeGVjJywgdHJ5RXhlY1xyXG4gbW9kdWxlLmV4cG9ydHMgPVxyXG4gIG1ldGhvZDogbWV0aG9kXHJcbiAgdHJ5RXhlYzogdHJ5RXhlY1xyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxubnVtYmVyID0gT2JqZWN0LmNyZWF0ZShudWxsKVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ2lzTmFOJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5pc05hTikgdGhlbiBOdW1iZXIuaXNOYU4gZWxzZSBpc05hTilcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdpc0Zpbml0ZScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuaXNGaW5pdGUpIHRoZW4gTnVtYmVyLmlzRmluaXRlIGVsc2UgaXNGaW5pdGUpXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnTUFYX1ZBTFVFJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5NQVhfVkFMVUUpIHRoZW4gTnVtYmVyLk1BWF9WQUxVRSBlbHNlIDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ01JTl9WQUxVRScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuTUlOX1ZBTFVFKSB0aGVuIE51bWJlci5NSU5fVkFMVUUgZWxzZSA1ZS0zMjQpXHJcblxyXG5PSi5yZWdpc3RlciAnbnVtYmVyJywgbnVtYmVyXHJcbm1vZHVsZS5leHBvcnRzID0gbnVtYmVyIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbiQgPSByZXF1aXJlICdqcXVlcnknXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcbnByb3BlcnR5ID0gcmVxdWlyZSAnLi9wcm9wZXJ0eSdcblxuZnVuYyA9IHJlcXVpcmUgJy4vZnVuY3Rpb24nXG5cbiMgIyBvYmplY3RcblxucmV0T2JqID0gXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLm9iamVjdFxuICAjIGNyZWF0ZSBhbiBvYmplY3Qgd2l0aCBoZWxwZXIgYGFkZGAgYW5kIGBlYWNoYCBtZXRob2RzLlxuICBvYmplY3Q6IChvYmogPSB7fSkgLT5cbiAgICBcbiAgICAjIyNcbiAgICBBZGQgYSBwcm9wZXJ0eSB0byB0aGUgb2JqZWN0IGFuZCByZXR1cm4gaXRcbiAgICAjIyNcbiAgICBvYmouYWRkID0gKG5hbWUsIHZhbCkgLT5cbiAgICAgIHByb3BlcnR5IG9iaiwgbmFtZSwgdmFsXG4gICAgICBvYmpcblxuICAgIG9iai5hZGQgJ2VhY2gnLCAoY2FsbGJhY2spIC0+XHJcbiAgICAgIGVhY2ggPSByZXF1aXJlICcuLi90b29scy9lYWNoJ1xuICAgICAgZWFjaCBvYmosICh2YWwsIGtleSkgLT5cbiAgICAgICAgaWYga2V5IGlzbnQgJ2VhY2gnIGFuZCBrZXkgaXNudCAnYWRkJ1xuICAgICAgICAgIGNhbGxiYWNrIHZhbCwga2V5XG5cbiAgICBvYmpcblxuXG4gICMgIyMgW09KXShvai5odG1sKS5pc0luc3RhbmNlT2ZcbiAgIyBkZXRlcm1pbmVzIGlzIGEgdGhpbmcgaXMgYW4gaW5zdGFuY2Ugb2YgYSBUaGluZywgYXNzdW1pbmcgdGhlIHRoaW5ncyB3ZXJlIGFsbCBjcmVhdGVkIGluIE9KXG4gIGlzSW5zdGFuY2VPZjogKG5hbWUsIG9iaikgLT5cbiAgICB0byA9IHJlcXVpcmUgJy4uL3Rvb2xzL3RvJ1xuICAgIHJldE9iai5jb250YWlucyhuYW1lLCBvYmopIGFuZCB0by5ib29sKG9ialtuYW1lXSlcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuY29udGFpbnNcbiAgIyB0cnVlIGlmIHRoZSBgb2JqZWN0YCBjb250YWlucyB0aGUgdmFsdWVcbiAgY29udGFpbnM6IChvYmplY3QsIGluZGV4KSAtPlxuICAgIHJldCA9IGZhbHNlXG4gICAgaWYgb2JqZWN0XG4gICAgICByZXQgPSBfLmNvbnRhaW5zIG9iamVjdCwgaW5kZXhcbiAgICByZXRcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuY29tcGFyZVxuICAjIGNvbXBhcmUgdHdvIG9iamVjdHMvYXJyYXlzL3ZhbHVlcyBmb3Igc3RyaWN0IGVxdWFsaXR5XG4gIGNvbXBhcmU6IChvYmoxLCBvYmoyKSAtPlxuICAgIF8uaXNFcXVhbCBvYmoxLCBvYmoyXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmNsb25lXG4gICMgY29weSBhbGwgb2YgdGhlIHZhbHVlcyAocmVjdXJzaXZlbHkpIGZyb20gb25lIG9iamVjdCB0byBhbm90aGVyLlxuICBjbG9uZTogKGRhdGEpIC0+XG4gICAgXy5jbG9uZURlZXAgZGF0YSB0cnVlXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLnNlcmlhbGl6ZVxuICAjIENvbnZlcnQgYW4gb2JqZWN0IHRvIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgb2JqZWN0XG4gIHNlcmlhbGl6ZTogKGRhdGEpIC0+XG4gICAgcmV0ID0gJydcbiAgICBmdW5jLnRyeUV4ZWMgLT5cbiAgICAgIHJldCA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgICByZXR1cm5cbiAgICByZXQgb3IgJydcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuZGVzZXJpYWxpemVcbiAgIyBDb252ZXJ0IGEgSlNPTiBzdHJpbmcgdG8gYW4gb2JqZWN0XG4gIGRlc2VyaWFsaXplOiAoZGF0YSkgLT5cbiAgICByZXQgPSB7fVxuICAgIGlmIGRhdGFcbiAgICAgIGZ1bmMudHJ5RXhlYyAtPlxuICAgICAgICByZXQgPSAkLnBhcnNlSlNPTihkYXRhKVxuICAgICAgICByZXR1cm5cblxuICAgICAgcmV0ID0ge30gIGlmIGlzTWV0aG9kLm51bGxPckVtcHR5KHJldClcbiAgICByZXRcblxuICAjICMjIFtPSl0ob2ouaHRtbCkucGFyYW1zXG4gICMgQ29udmVydCBhbiBvYmplY3QgdG8gYSBkZWxpbWl0ZWQgbGlzdCBvZiBwYXJhbWV0ZXJzIChub3JtYWxseSBxdWVyeS1zdHJpbmcgcGFyYW1ldGVycylcbiAgcGFyYW1zOiAoZGF0YSwgZGVsaW1pdGVyID0gJyYnKSAtPlxuICAgIHJldCA9ICcnXG4gICAgaWYgZGVsaW1pdGVyIGlzICcmJ1xuICAgICAgZnVuYy50cnlFeGVjIC0+XG4gICAgICAgIHJldCA9ICQucGFyYW0oZGF0YSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICBlbHNlXHJcbiAgICAgIGVhY2ggPSByZXF1aXJlICcuLi90b29scy9lYWNoJ1xuICAgICAgZWFjaCBkYXRhLCAodmFsLCBrZXkpIC0+XG4gICAgICAgIHJldCArPSBkZWxpbWl0ZXIgIGlmIHJldC5sZW5ndGggPiAwXG4gICAgICAgIHJldCArPSBrZXkgKyAnPScgKyB2YWxcbiAgICAgICAgcmV0dXJuXG5cbiAgICB0by5zdHJpbmcgcmV0XG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmV4dGVuZFxuICAjIGNvcHkgdGhlIHByb3BlcnRpZXMgb2Ygb25lIG9iamVjdCB0byBhbm90aGVyIG9iamVjdFxuICBleHRlbmQ6IChkZXN0T2JqLCBzcmNPYmosIGRlZXBDb3B5ID0gZmFsc2UpIC0+XG4gICAgcmV0ID0gZGVzdE9iaiBvciB7fVxuICAgIGlmIGRlZXBDb3B5IGlzIHRydWVcbiAgICAgIHJldCA9ICQuZXh0ZW5kKGRlZXBDb3B5LCByZXQsIHNyY09iailcbiAgICBlbHNlXG4gICAgICByZXQgPSAkLmV4dGVuZChyZXQsIHNyY09iailcbiAgICByZXRcblxuXG5PSi5yZWdpc3RlciAnb2JqZWN0JywgcmV0T2JqLm9iamVjdFxuT0oucmVnaXN0ZXIgJ2lzSW5zdGFuY2VPZicsIHJldE9iai5pc0luc3RhbmNlT2Zcbk9KLnJlZ2lzdGVyICdjb250YWlucycsIHJldE9iai5jb250YWluc1xuT0oucmVnaXN0ZXIgJ2NvbXBhcmUnLCByZXRPYmouY29tcGFyZVxuT0oucmVnaXN0ZXIgJ2Nsb25lJywgcmV0T2JqLmNsb25lXG5PSi5yZWdpc3RlciAnc2VyaWFsaXplJywgcmV0T2JqLnNlcmlhbGl6ZVxuT0oucmVnaXN0ZXIgJ2Rlc2VyaWFsaXplJywgcmV0T2JqLmRlc2VyaWFsaXplXG5PSi5yZWdpc3RlciAncGFyYW1zJywgcmV0T2JqLnBhcmFtc1xuT0oucmVnaXN0ZXIgJ2V4dGVuZCcsIHJldE9iai5leHRlbmRcblxubW9kdWxlLmV4cG9ydHMgPSByZXRPYmoiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG4jIyNcclxuQWRkIGEgcHJvcGVydHkgdG8gYW4gb2JqZWN0XHJcbiAgXHJcbiMjI1xyXG5wcm9wZXJ0eSA9IChvYmosIG5hbWUsIHZhbHVlLCB3cml0YWJsZSwgY29uZmlndXJhYmxlLCBlbnVtZXJhYmxlKSAtPlxyXG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGRlZmluZSBhIHByb3BlcnR5IHdpdGhvdXQgYW4gT2JqZWN0LicgIHVubGVzcyBvYmpcclxuICB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgYSBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgcHJvcGVydHkgbmFtZS4nICB1bmxlc3MgbmFtZT9cclxuICBvYmpbbmFtZV0gPSB2YWx1ZVxyXG4gIG9ialxyXG5cclxuT0oucmVnaXN0ZXIgJ3Byb3BlcnR5JywgcHJvcGVydHlcclxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmRlbGltaXRlZFN0cmluZyA9IChzdHJpbmcsIG9wdHMpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgbmV3TGluZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICBzcGFjZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICByZW1vdmVEdXBsaWNhdGVzOiB0cnVlXHJcbiAgICBkZWxpbWl0ZXI6IFwiLFwiXHJcbiAgICBpbml0U3RyaW5nOiBPSi50by5zdHJpbmcgc3RyaW5nXHJcblxyXG4gIHJldE9iaiA9XHJcbiAgICBhcnJheTogW11cclxuICAgIGRlbGltaXRlZDogLT5cclxuICAgICAgcmV0T2JqLmFycmF5LmpvaW4gZGVmYXVsdHMuZGVsaW1pdGVyXHJcblxyXG4gICAgc3RyaW5nOiAoZGVsaW1pdGVyID0gZGVmYXVsdHMuZGVsaW1pdGVyKSAtPlxyXG4gICAgICByZXQgPSAnJ1xyXG4gICAgICBPSi5lYWNoIHJldE9iai5hcnJheSwgKHZhbCkgLT5cclxuICAgICAgICByZXQgKz0gZGVsaW1pdGVyICBpZiByZXQubGVuZ3RoID4gMFxyXG4gICAgICAgIHJldCArPSB2YWxcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIHJldFxyXG5cclxuICAgIHRvU3RyaW5nOiAtPlxyXG4gICAgICByZXRPYmouc3RyaW5nKClcclxuXHJcbiAgICBhZGQ6IChzdHIpIC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5wdXNoIGRlZmF1bHRzLnBhcnNlKHN0cilcclxuICAgICAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcygpXHJcbiAgICAgIHJldE9ialxyXG5cclxuICAgIHJlbW92ZTogKHN0cikgLT5cclxuICAgICAgcmVtb3ZlID0gKGFycmF5KSAtPlxyXG4gICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgIHRydWUgIGlmIGl0ZW0gaXNudCBzdHJcclxuXHJcblxyXG4gICAgICByZXRPYmouYXJyYXkgPSByZW1vdmUocmV0T2JqLmFycmF5KVxyXG4gICAgICByZXRPYmpcclxuXHJcbiAgICBjb3VudDogLT5cclxuICAgICAgcmV0T2JqLmFycmF5Lmxlbmd0aFxyXG5cclxuICAgIGNvbnRhaW5zOiAoc3RyLCBjYXNlU2Vuc2l0aXZlKSAtPlxyXG4gICAgICBpc0Nhc2VTZW5zaXRpdmUgPSBPSi50by5ib29sKGNhc2VTZW5zaXRpdmUpXHJcbiAgICAgIHN0ciA9IE9KLnRvLnN0cmluZyhzdHIpLnRyaW0oKVxyXG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKSAgaWYgZmFsc2UgaXMgaXNDYXNlU2Vuc2l0aXZlXHJcbiAgICAgIG1hdGNoID0gcmV0T2JqLmFycmF5LmZpbHRlcigobWF0U3RyKSAtPlxyXG4gICAgICAgIChpc0Nhc2VTZW5zaXRpdmUgYW5kIE9KLnRvLnN0cmluZyhtYXRTdHIpLnRyaW0oKSBpcyBzdHIpIG9yIE9KLnRvLnN0cmluZyhtYXRTdHIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpIGlzIHN0clxyXG4gICAgICApXHJcbiAgICAgIG1hdGNoLmxlbmd0aCA+IDBcclxuXHJcbiAgICBlYWNoOiAoY2FsbEJhY2spIC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5mb3JFYWNoIGNhbGxCYWNrXHJcblxyXG4gIGRlZmF1bHRzLnBhcnNlID0gKHN0cikgLT5cclxuICAgIHJldCA9IE9KLnRvLnN0cmluZyhzdHIpXHJcbiAgICByZXQgPSByZXQucmVwbGFjZSgvXFxuL2csIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiXFxuXCIpIGlzbnQgLTEgIGlmIGRlZmF1bHRzLm5ld0xpbmVUb0RlbGltaXRlclxyXG4gICAgcmV0ID0gcmV0LnJlcGxhY2UoUmVnRXhwKFwiIFwiLCBcImdcIiksIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiIFwiKSBpc250IC0xICBpZiBkZWZhdWx0cy5zcGFjZVRvRGVsaW1pdGVyXHJcbiAgICByZXQgPSByZXQucmVwbGFjZSgvLCwvZywgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCIsLFwiKSBpc250IC0xXHJcbiAgICByZXRcclxuXHJcbiAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcyA9IC0+XHJcbiAgICBpZiBkZWZhdWx0cy5yZW1vdmVEdXBsaWNhdGVzXHJcbiAgICAgICgtPlxyXG4gICAgICAgIHVuaXF1ZSA9IChhcnJheSkgLT5cclxuICAgICAgICAgIHNlZW4gPSBuZXcgU2V0KClcclxuICAgICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgICAgaWYgZmFsc2UgaXMgc2Vlbi5oYXMoaXRlbSlcclxuICAgICAgICAgICAgICBzZWVuLmFkZCBpdGVtXHJcbiAgICAgICAgICAgICAgdHJ1ZVxyXG5cclxuXHJcbiAgICAgICAgcmV0T2JqLmFycmF5ID0gdW5pcXVlKHJldE9iai5hcnJheSlcclxuICAgICAgICByZXR1cm5cclxuICAgICAgKSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgKChhKSAtPlxyXG4gICAgaWYgYS5sZW5ndGggPiAxIGFuZCBmYWxzZSBpcyBPSi5pcy5wbGFpbk9iamVjdChvcHRzKVxyXG4gICAgICBPSi5lYWNoIGEsICh2YWwpIC0+XHJcbiAgICAgICAgcmV0T2JqLmFycmF5LnB1c2ggdmFsICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSh2YWwpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgZWxzZSBpZiBzdHJpbmcgYW5kIHN0cmluZy5sZW5ndGggPiAwXHJcbiAgICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0c1xyXG4gICAgICBkZWxpbWl0ZWRTdHJpbmcgPSBkZWZhdWx0cy5wYXJzZShzdHJpbmcpXHJcbiAgICAgIGRlZmF1bHRzLmluaXRTdHJpbmcgPSBkZWxpbWl0ZWRTdHJpbmdcclxuICAgICAgcmV0T2JqLmFycmF5ID0gZGVsaW1pdGVkU3RyaW5nLnNwbGl0KGRlZmF1bHRzLmRlbGltaXRlcilcclxuICAgIGRlZmF1bHRzLmRlbGV0ZUR1cGxpY2F0ZXMoKVxyXG4gICAgcmV0dXJuXHJcbiAgKSBhcmd1bWVudHNcclxuICByZXRPYmpcclxuXHJcblxyXG5PSi5yZWdpc3RlciAnZGVsaW1pdGVkU3RyaW5nJywgZGVsaW1pdGVkU3RyaW5nXHJcbm1vZHVsZS5leHBvcnRzID0gZGVsaW1pdGVkU3RyaW5nIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuVGhpbkRPTSA9IHJlcXVpcmUgJ3RoaW5kb20nXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxuXHJcblxyXG4jIyNcclxuUGVyc2lzdCBhIGhhbmRsZSBvbiB0aGUgYm9keSBub2RlXHJcbiMjI1xyXG5pZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJyB0aGVuIGJvZHkgPSBkb2N1bWVudC5ib2R5IGVsc2UgYm9keSA9IG51bGxcclxuYm9keSA9IG5ldyBUaGluRE9NIG51bGwsIGlkOiAnYm9keScsIGJvZHlcclxuYm9keS50YWdOYW1lID0gJ2JvZHknXHJcbnRoaW5Cb2R5ID0gbm9kZUZhY3RvcnkgYm9keSwge31cclxuICBcclxuT0oucmVnaXN0ZXIgJ2JvZHknLCB0aGluQm9keVxyXG5tb2R1bGUuZXhwb3J0cyA9IHRoaW5Cb2R5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuXHJcbiMgIyBjb21wb25lbnRcclxuXHJcblxyXG4jIENyZWF0ZSBhbiBIVE1MIFdlYiBDb21wb25lbnQgdGhyb3VnaCBUaGluRG9tXHJcblxyXG4jIC0gYG9wdGlvbnNgIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHN0YW5kYXJkIG9wdGlvbnMgdG8gYmUgcGFzc2VkIGludG8gdGhlIGNvbXBvbmVudFxyXG4jIC0tIGByb290Tm9kZVR5cGVgOiB0aGUgdGFnIG5hbWUgb2YgdGhlIHJvb3Qgbm9kZSB0byBjcmVhdGUsIGRlZmF1bHQgPSAnZGl2J1xyXG4jIC0tIGBwcm9wc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIERPTSBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXHJcbiMgLS0gYHN0eWxlc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIENTUyBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXHJcbiMgLS0gYGV2ZW50c2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5hbWVkIERPTSBldmVudHMgKGFuZCBjb3JyZXNwb25kaW5nIGNhbGxiYWNrIG1ldGhvZHMpIHRvIGJpbmQgdG8gdGhlIHJvb3Qgbm9kZVxyXG4jIC0gYG93bmVyYCB0aGUgcGFyZW50IHRvIHdoaWNoIHRoZSBjb21wb25lbnQgbm9kZSB3aWxsIGJlIGFwcGVuZGVkXHJcbiMgLSBgdGFnTmFtZWAgdGhlIG5hbWUgb2Ygb2YgdGhlIGNvbXBvbmVudCwgd2hpY2ggd2lsbCBhbHdheXMgYmUgcHJlZml4ZWQgd2l0aCAneC0nXHJcbmNvbXBvbmVudCA9IChvcHRpb25zID0gb2JqLm9iamVjdCgpLCBvd25lciwgdGFnTmFtZSkgLT5cclxuXHJcbiAgaWYgbm90IHRhZ05hbWUuc3RhcnRzV2l0aCAneC0nIHRoZW4gdGFnTmFtZSA9ICd4LScgKyB0YWdOYW1lXHJcbiAgIyB3ZWIgY29tcG9uZW50cyBhcmUgcmVhbGx5IGp1c3Qgb3JkaW5hcnkgT0ogW2VsZW1lbnRdKGVsZW1lbnQuaHRtbCkncyB3aXRoIGEgc3BlY2lhbCBuYW1lLlxyXG4gICMgVW50aWwgSFRNTCBXZWIgQ29tcG9uZW50cyBhcmUgZnVsbHkgc3VwcG9ydGVkIChhbmQgT0ogaXMgcmVmYWN0b3JlZCBhY2NvcmRpbmdseSksIHRoZSBlbGVtZW50IHdpbGwgYmUgdHJlYXRlZCBhcyBhbiB1bmtub3duIGVsZW1lbnQuXHJcbiAgIyBJbiBtb3N0IGNhc2VzLCB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiB0aGUgYnJvd3NlciBpcyBhY2NlcHRhYmxlIChzZWUgYWxzbyBbSFRNTCBTZW1hbnRpY3NdKGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vc2VtYW50aWNzLmh0bWwpKSwgYnV0XHJcbiAgIyBpbiBzb21lIGNhc2VzIHRoaXMgaXMgcHJvYmxlbWF0aWMgKGZpcnN0bHksIGJlY2F1c2UgdGhlc2UgZWxlbWVudHMgYXJlIGFsd2F5cyByZW5kZXJlZCBpbmxpbmUpLlxyXG4gICMgSW4gc3VjaCBjb25kaXRpb25zLCB0aGUgW2NvbnRyb2xzXShjb250cm9scy5odG1sKSBjbGFzcyBhbmQgbmFtZSBzcGFjZSBpcyBiZXR0ZXIgc3VpdGVkIHRvIGNsYXNzZXMgd2hpY2ggcmVxdWlyZSBjb21wbGV0ZSBjb250cm9sIChlLmcuIFtpY29uXShpY29uLmh0bWwpKS5cclxuICB3aWRnZXQgPSBub2RlRmFjdG9yeSB0YWdOYW1lLCBvYmoub2JqZWN0KCksIG93bmVyLCBmYWxzZSAjLCBvcHRpb25zLnByb3BzLCBvcHRpb25zLnN0eWxlcywgb3B0aW9ucy5ldmVudHMsIG9wdGlvbnMudGV4dFxyXG4gIFxyXG4gICMgU2luY2UgdGhlIGJlaGF2aW9yIG9mIHN0eWxpbmcgaXMgbm90IHdlbGwgY29udHJvbGxlZC9jb250cm9sbGFibGUgb24gdW5rbm93biBlbGVtZW50cywgaXQgaXMgbmVjZXNzYXJ5IHRvIGNyZWF0ZSBhIHJvb3Qgbm9kZSBmb3IgdGhlIGNvbXBvbmVudC5cclxuICAjIEluIG1vc3QgY2FzZXMsIFtkaXZdKGRpdi5odG1sKSBpcyBwZXJmZWN0bHkgYWNjZXB0YWJsZSwgYnV0IHRoaXMgaXMgY29uZmlndXJhYmxlIGF0IHRoZSBuYW1lIHNwYWNlIGxldmVsIG9yIGF0IHJ1bnRpbWUuXHJcbiAgcm9vdE5vZGVUeXBlID0gb3B0aW9ucy5yb290Tm9kZVR5cGUgb3IgT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSBvciAnZGl2J1xyXG5cclxuICAjIGByZXRgIGlzIHRoZSB0aGUgaW5zdGFuY2Ugb2YgdGhlIHJvb3ROb2RlVHlwZSwgbm90IHRoZSBgd2lkZ2V0YCB3cmFwcGVkIGluIHRoaXMgY2xvc3VyZVxyXG4gIHJldCA9IHdpZGdldC5tYWtlIHJvb3ROb2RlVHlwZSwgb3B0aW9uc1xyXG5cclxuICAjIGZvciBjb252ZW5pZW5jZSBhbmQgZGVidWdnaW5nLCBwZXJzaXN0IHRoZSB0YWdOYW1lXHJcbiAgcmV0LmNvbXBvbmVudE5hbWUgPSB0YWdOYW1lXHJcblxyXG4gICMgYHJlbW92ZWAgZG9lcywgaG93ZXZlciwgYmVoYXZlIGFzIGV4cGVjdGVkIGJ5IHJlbW92aW5nIGB3aWRnZXRgXHJcbiAgcmV0LnJlbW92ZSA9IHdpZGdldC5yZW1vdmVcclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdjb21wb25lbnQnLCBjb21wb25lbnRcclxubW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5cclxuIyMjXHJcbkNyZWF0ZSBhIHNldCBvZiBIVE1MIEVsZW1lbnRzIHRocm91Z2ggVGhpbkRvbVxyXG4jIyNcclxuY29udHJvbCA9IChvcHRpb25zID0gb2JqLm9iamVjdCgpLCBvd25lciwgdGFnTmFtZSkgLT5cclxuICBpZiBub3QgdGFnTmFtZS5zdGFydHNXaXRoICd5LScgdGhlbiB0YWdOYW1lID0gJ3ktJyArIHRhZ05hbWVcclxuXHJcbiAgcm9vdE5vZGVUeXBlID0gb3B0aW9ucy5yb290Tm9kZVR5cGUgb3IgT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSBvciAnZGl2J1xyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSByb290Tm9kZVR5cGUsIG9wdGlvbnMsIG93bmVyLCBmYWxzZVxyXG5cclxuICByZXQuYWRkICdjb250cm9sTmFtZScsIHRhZ05hbWVcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAnY29udHJvbCcsIGNvbnRyb2xcclxubW9kdWxlLmV4cG9ydHMgPSBjb250cm9sIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcclxuXHJcbiMgIyBkb21cclxuXHJcblxyXG4jIEV4dGVuZCBhbiBvYmplY3Qgd2l0aCBPSiBET00gbWV0aG9kcyBhbmQgcHJvcGVydGllc1xyXG5cclxuIyAtIGBAZWxgIE9iamVjdCB0byBleHRlbmRcclxuIyAtIGBwYXJlbnRgIHBhcmVudCBvYmplY3QgdG8gd2hpY2ggYEBlbGAgd2lsbCBiZSBhcHBlbmRlZFxyXG5jbGFzcyBET01cclxuICBcclxuICAjcGFyZW50OiByZXF1aXJlKCcuL2JvZHknKVxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yOiAoQGVsLCBAcGFyZW50KSAtPlxyXG4gICAgZW5hYmxlZCA9IHRydWVcclxuICAgIEB0YWdOYW1lID0gQGVsLnRhZ05hbWVcclxuICAgIEBbJyQnXSA9ICQoQGVsLmdldCgpKVxyXG4gICAgQFsnMCddID0gQGVsLmdldCgpXHJcblxyXG4gIGFwcGVuZDogKHBhcmFtcy4uLikgLT5cclxuICAgIEBlbC5hcHBlbmQgcGFyYW1zLi4uXHJcblxyXG4gIHByZXBlbmQ6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAZWwucHJlcGVuZCBwYXJhbXMuLi5cclxuXHJcbiAgcmVtb3ZlOiAocGFyYW1zLi4uKSAtPlxyXG4gICAgQGVsLnJlbW92ZSBwYXJhbXMuLi5cclxuXHJcbiAgY3NzOiAocGFyYW1zLi4uKSAtPlxyXG4gICAgQGVsLmNzcyBwYXJhbXMuLi5cclxuXHJcbiAgaHRtbDogKHBhcmFtcy4uLikgLT5cclxuICAgIEBlbC5odG1sIHBhcmFtcy4uLlxyXG5cclxuICB0ZXh0OiAocGFyYW1zLi4uKSAtPlxyXG4gICAgQGVsLnRleHQgcGFyYW1zLi4uXHJcblxyXG4gIGF0dHI6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAZWwuYXR0ciBwYXJhbXMuLi5cclxuXHJcbiAgZGF0YTogKHBhcmFtcy4uLikgLT5cclxuICAgIEBlbC5kYXRhIHBhcmFtcy4uLlxyXG5cclxuICBnZXQ6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAZWwuZ2V0IHBhcmFtcy4uLlxyXG5cclxuICBhZGQ6IChrZXksIHZhbCkgLT5cclxuICAgIEBba2V5XSA9IHZhbFxyXG5cclxuICBpc0NvbnRyb2xTdGlsbFZhbGlkOiAtPlxyXG4gICAgaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcclxuICAgIHZhbGlkID0gZmFsc2UgaXMgaXNNZXRob2QubnVsbE9yRW1wdHkoQGVsKSBhbmQgQGlzVmFsaWQoKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yICdlbCBpcyBudWxsLiBFdmVudCBiaW5kaW5ncyBtYXkgbm90IGhhdmUgYmVlbiBHQ2QuJyAgaWYgZmFsc2UgaXMgdmFsaWRcclxuICAgIHZhbGlkXHJcblxyXG4gICMgIyMgaXNWYWxpZFxyXG4gIGlzVmFsaWQ6IC0+XHJcbiAgICBAZWwgYW5kIChAZWwuZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCBvciBAZWwuZWwgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KVxyXG5cclxuICAjICMjIGFkZENsYXNzXHJcbiAgIyBBZGQgYSBDU1MgY2xhc3MgdG8gYW4gZWxlbWVudFxyXG5cclxuICAjIC0gYG5hbWVgIHRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0byBhZGRcclxuICBhZGRDbGFzczogKG5hbWUpIC0+XHJcbiAgICBAWyckJ10uYWRkQ2xhc3MgbmFtZSBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgYmluZFxyXG4gICMgQmluZCBhbiBhY3Rpb24gdG8gYSBqUXVlcnkgZWxlbWVudCdzIGV2ZW50LlxyXG4gIGJpbmQ6IChldmVudE5hbWUsIGV2ZW50KSAtPlxyXG4gICAgQG9uIGV2ZW50TmFtZSwgZXZlbnRcclxuXHJcbiAgIyAjIyBvblxyXG4gIG9uOiAoZXZlbnROYW1lLCBldmVudCkgLT5cclxuICAgIEBbJyQnXS5vbiBldmVudE5hbWUsIGV2ZW50ICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgb2ZmXHJcbiAgb2ZmOiAoZXZlbnROYW1lLCBldmVudCkgLT5cclxuICAgIEBbJyQnXS5vZmYgZXZlbnROYW1lLCBldmVudCAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgQGVsXHJcblxyXG4gICMgIyMga2V5Ym9hcmRcclxuICAjIEJpbmQgYW4gZXZlbnQgdG8gYSBrZXksIHdoZW4gcHJlc3NlZCBpbiB0aGlzIGNvbnRyb2wuXHJcbiAgIyBUaGUgT0ogb2JqZWN0IChmb3IgY2hhaW5pbmcpXHJcbiAga2V5Ym9hcmQ6IChrZXlzLCBldmVudCkgLT5cclxuICAgICNNb3VzZXRyYXAuYmluZCBrZXlzLCBAZWxbZXZlbnRdICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgZGlzYWJsZVxyXG4gICMgRGlzYWJsZSB0aGUgZWxlbWVudC5cclxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcclxuICBkaXNhYmxlOiA9PlxyXG4gICAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBlbmFibGVkID0gZmFsc2VcclxuICAgICAgQGF0dHIgJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJ1xyXG4gICAgICBAYWRkQ2xhc3MgJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJ1xyXG4gICAgQFxyXG5cclxuICAjICMjIGVtcHR5XHJcbiAgIyBFbXB0eSB0aGUgZWxlbWVudC5cclxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcclxuICBlbXB0eTogLT5cclxuICAgIEBbJyQnXS5lbXB0eSgpIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyBlbmFibGVcclxuICAjIEVuYWJsZSB0aGUgZWxlbWVudC5cclxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcclxuICBlbmFibGU6IC0+XHJcbiAgICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGVuYWJsZWQgPSB0cnVlXHJcbiAgICAgIEByZW1vdmVBdHRyICdkaXNhYmxlZCdcclxuICAgICAgQHJlbW92ZUNsYXNzICdkaXNhYmxlZCdcclxuICAgIEBcclxuXHJcbiAgIyAjIyBnZXRJZFxyXG4gICMgR2V0IHRoZSBET00gRWxlbWVudCBJRCBvZiB0aGlzIG9iamVjdC5cclxuICBnZXRJZDogLT5cclxuICAgIGlkID0gQFswXS5pZCAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgaWRcclxuXHJcbiAgIyAjIyBoaWRlXHJcbiAgIyBNYWtlIHRoZSBlbGVtZW50IGludmlzaWJsZS5cclxuICBoaWRlOiAtPlxyXG4gICAgQGNzcyAnZGlzcGxheScsICdub25lJyAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgQFxyXG5cclxuICAjICMjIGxlbmd0aFxyXG4gICMgR2V0IHRoZSBsZW5ndGggb2YgdGhpcyBlbGVtZW50LlxyXG4gIGxlbmd0aDogLT5cclxuICAgIHRvID0gcmVxdWlyZSAnLi4vdG9vbHMvdG8nXHJcbiAgICBsZW4gPSAwXHJcbiAgICBsZW4gPSB0by5udW1iZXIoQFsnJCddLmxlbmd0aCkgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIGxlblxyXG5cclxuICAjICMjIHJlbW92ZVxyXG4gICMgUmVtb3ZlIHRoZSBub2RlIGZyb20gdGhlIERPTVxyXG4gIHJlbW92ZTogLT5cclxuICAgIGlmIEBlbCBhbmQgQFsnJCddXHJcbiAgICAgIEBbJyQnXS5yZW1vdmUoKVxyXG5cclxuICAgICAgIyBTZXQgdGhlIHZhbHVlIG9mIEBlbCB0byBudWxsIHRvIGd1YXJhbnRlZSB0aGF0IGlzQ29udHJvbFN0aWxsVmFsaWQgd2lsbCBiZSBjb3JyZWN0XHJcbiAgICAgIEBlbCA9IG51bGxcclxuICAgICAgQFsnJCddID0gbnVsbFxyXG4gICAgICBAWzBdID0gbnVsbFxyXG4gICAgbnVsbFxyXG5cclxuICAjICMjIHJlbW92ZUNsYXNzXHJcbiAgIyBSZW1vdmUgYSBDU1MgY2xhc3MgZnJvbSBhbiBlbGVtZW50LlxyXG4gIHJlbW92ZUNsYXNzOiAobmFtZSkgLT5cclxuICAgIEBbJyQnXS5yZW1vdmVDbGFzcyBuYW1lICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgcmVtb3ZlUHJvcFxyXG4gICMgUmVtb3ZlIGEgcHJvcGVydHkgZnJvbSBhbiBlbGVtZW50LiBqUXVlcnkgZGlzdGluZ3Vpc2hlcyBiZXR3ZWVuICdwcm9wcycgYW5kICdhdHRyJzsgaGVuY2UgMiBtZXRob2RzLlxyXG4gIHJlbW92ZVByb3A6IChuYW1lKSAtPlxyXG4gICAgQFsnJCddLnJlbW92ZVByb3AgbmFtZSAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgQFxyXG5cclxuICAjICMjIHJlbW92ZUF0dHJcclxuICAjIFJlbW92ZSBhIHByb3BlcnR5IGZyb20gYW4gZWxlbWVudC4galF1ZXJ5IGRpc3Rpbmd1aXNoZXMgYmV0d2VlbiAncHJvcHMnIGFuZCAnYXR0cic7IGhlbmNlIDIgbWV0aG9kcy5cclxuICByZW1vdmVBdHRyOiAobmFtZSkgLT5cclxuICAgIEBbJyQnXS5yZW1vdmVBdHRyIG5hbWUgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyByZXF1aXJlZFxyXG4gICMgTWFyayB0aGUgcmVxdWlyZWQgc3RhdHVzIG9mIHRoZSBlbGVtZW50LlxyXG4gIHJlcXVpcmVkOiAodHJ1dGh5LCBhZGRMYWJlbCkgLT5cclxuICAgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgdG8gPSByZXF1aXJlICcuLi90b29scy90bydcclxuICAgICAgc3dpdGNoIHRvLmJvb2wodHJ1dGh5KVxyXG4gICAgICAgIHdoZW4gdHJ1ZVxyXG4gICAgICAgICAgQGF0dHIgJ3JlcXVpcmVkJywgdHJ1ZVxyXG4gICAgICAgICAgQGFkZENsYXNzICdyZXF1aXJlZCdcclxuICAgICAgICB3aGVuIGZhbHNlXHJcbiAgICAgICAgICBAcmVtb3ZlUHJvcCAncmVxdWlyZWQnXHJcbiAgICAgICAgICBAcmVtb3ZlQ2xhc3MgJ3JlcXVpcmVkJ1xyXG4gICAgQFsnJCddXHJcbiAgXHJcbiAgIyAjIyBzaG93XHJcbiAgIyBNYWtlIHRoZSBlbGVtZW50IHZpc2libGUuXHJcbiAgc2hvdzogLT5cclxuICAgIEBbJyQnXS5zaG93KCkgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyB0b2dnbGVcclxuICAjIFRvZ2dsZSB2aXNpYmlsaXR5XHJcbiAgdG9nZ2xlOiAtPlxyXG4gICAgQFsnJCddLnRvZ2dsZSgpICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgdG9nZ2xlRW5hYmxlXHJcbiAgIyBUb2dnbGUgdGhlIGVsZW1lbnQncyBlbmFibGVkIHN0YXRlLlxyXG4gIHRvZ2dsZUVuYWJsZTogLT5cclxuICAgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgaWYgZW5hYmxlZFxyXG4gICAgICAgIEBkaXNhYmxlKClcclxuICAgICAgZWxzZVxyXG4gICAgICAgIEBlbmFibGUoKVxyXG4gICAgQFxyXG5cclxuICAjICMjIHRyaWdnZXJcclxuICAjIFRyaWdnZXIgYW4gZXZlbnQgYm91bmQgdG8gYSBqUXVlcnkgZWxlbWVudC5cclxuICB0cmlnZ2VyOiAoZXZlbnROYW1lLCBldmVudE9wdHMpIC0+XHJcbiAgICBAWyckJ10udHJpZ2dlciBldmVudE5hbWUsIGV2ZW50T3B0cyAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgQGVsXHJcblxyXG4gICMgIyMgdW5iaW5kXHJcbiAgIyBXcmFwcGVyIGFyb3VuZCBgb2ZmYFxyXG4gIHVuYmluZDogKGV2ZW50TmFtZSwgZXZlbnQpIC0+XHJcbiAgICBAb2ZmIGV2ZW50TmFtZSwgZXZlbnRcclxuXHJcbiAgIyAjIyB2YWxcclxuICAjIEdldCBvciBzZXQgdGhlIHZhbHVlIG9mIHRoZSBlbGVtZW50LlxyXG4gIHZhbDogKHZhbHVlKSAtPlxyXG4gICAgcmV0ID0gQFxyXG4gICAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBpc01ldGhvZCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2lzJ1xyXG4gICAgICBpZiBhcmd1bWVudHMubGVuZ3RoIGlzIDEgYW5kIGZhbHNlIGlzIGlzTWV0aG9kLm51bGxPclVuZGVmaW5lZCh2YWx1ZSlcclxuICAgICAgICBAWyckJ10udmFsIHZhbHVlXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXQgPSBAWyckJ10udmFsKClcclxuICAgIHJldFxyXG4gICAgXHJcbiAgIyAjIyB2YWx1ZU9mXHJcbiAgIyB3cmFwcGVyIGFyb3VuZCBgdmFsYFxyXG4gIHZhbHVlT2Y6IC0+XHJcbiAgICBAdmFsKClcclxuXHJcbiAgIyAjIyB0b1N0cmluZ1xyXG4gICMgd3JhcHBlciBhcm91bmQgYHZhbGBcclxuICB0b1N0cmluZzogLT5cclxuICAgIEB2YWwoKVxyXG5cclxuXHJcbk9KLnJlZ2lzdGVyICdpc0VsZW1lbnRJbkRvbScsIChlbGVtZW50SWQpIC0+XHJcbiAgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkgT0ouZ2V0RWxlbWVudCBlbGVtZW50SWRcclxuXHJcbk9KLnJlZ2lzdGVyICdnZXRFbGVtZW50JywgKGlkKSAtPlxyXG4gIGlmIHR5cGVvZiBkb2N1bWVudCBpc250ICd1bmRlZmluZWQnXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZClcclxuXHJcbk9KLnJlZ2lzdGVyICdkb20nLCBET01cclxubW9kdWxlLmV4cG9ydHMgPSBET00iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xyXG5cclxuVGhpbkRPTSA9IHJlcXVpcmUgJ3RoaW5kb20nXHJcblxyXG4jICMgZWxlbWVudFxyXG5cclxuZWxlbWVudCA9IFxyXG4gICMgIyMgcmVzdG9yZUVsZW1lbnRcclxuICAjIyNcclxuICBSZXN0b3JlIGFuIEhUTUwgRWxlbWVudCB0aHJvdWdoIFRoaW5Eb21cclxuICAjIyNcclxuICByZXN0b3JlRWxlbWVudDogKGVsLCB0YWcgPSBlbC5ub2RlTmFtZSkgLT5cclxuICAgIG5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxuICAgIHREID0gbmV3IFRoaW5ET00gbnVsbCwgbnVsbCwgZWxcclxuICAgIHRELmlzSW5ET00gPSB0cnVlXHJcbiAgICByZXQgPSBub2RlRmFjdG9yeSB0RFxyXG4gICAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAncmVzdG9yZUVsZW1lbnQnLCBlbGVtZW50LnJlc3RvcmVFbGVtZW50XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGVsZW1lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgZnJhZ21lbnRcclxuXHJcbiMgQ3JlYXRlIGEgZG9jdW1lbnQgZnJhZ21lbnQgYW5kIHJldHVybiBpdCBhcyBhbiBPSiBub2RlXHJcbmZyYWdtZW50ID0gLT5cclxuICByZXQgPSBudWxsXHJcbiAgaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCdcclxuICAgIGZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpXHJcbiAgICBcclxuICAgIGZyYWcgPSBuZXcgVGhpbkRPTSBudWxsLCBudWxsLCBmcmFnbWVudFxyXG4gICAgZnJhZy5pc0luRE9NID0gdHJ1ZVxyXG4gICAgcmV0ID0gbm9kZUZhY3RvcnkgZnJhZ1xyXG4gICAgXHJcbiAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAnZnJhZ21lbnQnLCBmcmFnbWVudFxyXG5tb2R1bGUuZXhwb3J0cyA9IGZyYWdtZW50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxucmVxdWlyZSAnLi4vb2pJbml0J1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIGdlbmVyaWMgbm9kZXNcclxuXHJcbmNsb3NlZCA9IFtcclxuICAnYWJicidcclxuICAnYWNyb255bSdcclxuICAnYXBwbGV0J1xyXG4gICdhcnRpY2xlJ1xyXG4gICdhc2lkZSdcclxuICAnYXVkaW8nXHJcbiAgJ2InXHJcbiAgJ2JkbydcclxuICAnYmlnJ1xyXG4gICdibG9ja3F1b3RlJ1xyXG4gICdidXR0b24nXHJcbiAgJ2NhbnZhcydcclxuICAnY2FwdGlvbidcclxuICAnY2VudGVyJ1xyXG4gICdjaXRlJ1xyXG4gICdjb2RlJ1xyXG4gICdjb2xncm91cCdcclxuICAnZGF0YWxpc3QnXHJcbiAgJ2RkJ1xyXG4gICdkZWwnXHJcbiAgJ2RldGFpbHMnXHJcbiAgJ2RmbidcclxuICAnZGlyJ1xyXG4gICdkaXYnXHJcbiAgJ2RsJ1xyXG4gICdkdCdcclxuICAnZW0nXHJcbiAgJ2ZpZWxkc2V0J1xyXG4gICdmaWdjYXB0aW9uJ1xyXG4gICdmaWd1cmUnXHJcbiAgJ2ZvbnQnXHJcbiAgJ2Zvb3RlcidcclxuICAnaDEnXHJcbiAgJ2gyJ1xyXG4gICdoMydcclxuICAnaDQnXHJcbiAgJ2g1J1xyXG4gICdoNidcclxuICAnaGVhZCdcclxuICAnaGVhZGVyJ1xyXG4gICdoZ3JvdXAnXHJcbiAgJ2h0bWwnXHJcbiAgJ2knXHJcbiAgJ2lmcmFtZSdcclxuICAnaW5zJ1xyXG4gICdrYmQnXHJcbiAgJ2xhYmVsJ1xyXG4gICdsZWdlbmQnXHJcbiAgJ2xpJ1xyXG4gICdtYXAnXHJcbiAgJ21hcmsnXHJcbiAgJ21lbnUnXHJcbiAgJ21ldGVyJ1xyXG4gICduYXYnXHJcbiAgJ25vZnJhbWVzJ1xyXG4gICdub3NjcmlwdCdcclxuICAnb2JqZWN0J1xyXG4gICdvcHRncm91cCdcclxuICAnb3B0aW9uJ1xyXG4gICdvdXRwdXQnXHJcbiAgJ3AnXHJcbiAgJ3ByZSdcclxuICAncHJvZ3Jlc3MnXHJcbiAgJ3EnXHJcbiAgJ3JwJ1xyXG4gICdydCdcclxuICAncnVieSdcclxuICAncydcclxuICAnc2FtcCdcclxuICAnc2VjdGlvbidcclxuICAnc21hbGwnXHJcbiAgJ3NwYW4nXHJcbiAgJ3N0cmlrZSdcclxuICAnc3Ryb25nJ1xyXG4gICdzdHlsZSdcclxuICAnc3ViJ1xyXG4gICdzdW1tYXJ5J1xyXG4gICdzdXAnXHJcbiAgJ3Rib2R5J1xyXG4gICd0ZCdcclxuICAndGZvb3QnXHJcbiAgJ3RoJ1xyXG4gICd0aW1lJ1xyXG4gICd0aXRsZSdcclxuICAndHInXHJcbiAgJ3R0J1xyXG4gICd1J1xyXG4gICd2YXInXHJcbiAgJ3ZpZGVvJ1xyXG4gICd4bXAnXHJcbl1cclxub3BlbiA9ICdhcmVhIGJhc2UgY29sIGNvbW1hbmQgY3NzIGVtYmVkIGhyIGltZyBrZXlnZW4gbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyJy5zcGxpdCAnICdcclxuYWxsID0gY2xvc2VkLmNvbmNhdCBvcGVuXHJcblxyXG5leHBvcnRzID0ge31cclxuIyByZWdpc3RlciBzZW1hbnRpYy9zdHJ1Y3R1cmFsIGFsaWFzZXNcclxuZm9yIGxvb3BOYW1lIGluIGFsbFxyXG4gIGRvICh0YWcgPSBsb29wTmFtZSkgLT5cclxuICAgIG1ldGhvZCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gICAgICBkZWZhdWx0cyA9XHJcbiAgICAgICAgcHJvcHM6IHt9XHJcbiAgICAgICAgc3R5bGVzOiB7fVxyXG4gICAgICAgIGV2ZW50czoge31cclxuXHJcbiAgICAgIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnNcclxuICAgICAgcmV0ID0gbm9kZUZhY3RvcnkgdGFnLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gICAgICByZXRcclxuICAgIE9KLm5vZGVzLnJlZ2lzdGVyIHRhZywgbWV0aG9kXHJcbiAgICBleHBvcnRzW3RhZ10gPSBtZXRob2RcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jIyNcclxuQ3JlYXRlIGFuIE9KIElucHV0IE9iamVjdCB0aHJvdWdoIE9KLm5vZGVzLmlucHV0XHJcbiMjI1xyXG5pbnB1dCA9IChvcHRpb25zID0gT0oub2JqZWN0KCksIG93bmVyKSAtPlxyXG4gIGlmIG5vdCBvd25lciB0aGVuIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhbiBpbnB1dCB3aXRob3V0IGEgcGFyZW50J1xyXG4gIGlmIG5vdCBvcHRpb25zLnByb3BzIG9yIG5vdCBvcHRpb25zLnByb3BzLnR5cGUgdGhlbiB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgYW4gaW5wdXQgd2l0aG91dCBhbiBpbnB1dCB0eXBlJ1xyXG4gIHJldCA9IG93bmVyLm1ha2UgJ2lucHV0Jywgb3B0aW9uc1xyXG4gIHJldC5hZGQgJ2lucHV0TmFtZScsIG9wdGlvbnMucHJvcHMudHlwZVxyXG4gIHJldFxyXG4gICAgXHJcbk9KLnJlZ2lzdGVyICdpbnB1dCcsIGlucHV0XHJcbm1vZHVsZS5leHBvcnRzID0gaW5wdXQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xyXG5UaGluRE9NID0gcmVxdWlyZSAndGhpbmRvbSdcclxuRE9NID0gcmVxdWlyZSAnLi9kb20nXHJcblxyXG5jbG9zZWQgPSAnYSBhYmJyIGFjcm9ueW0gYWRkcmVzcyBhcHBsZXQgYXJ0aWNsZSBhc2lkZSBhdWRpbyBiIGJkbyBiaWcgYmxvY2txdW90ZSBib2R5IGJ1dHRvbiBjYW52YXMgY2FwdGlvbiBjZW50ZXIgY2l0ZSBjb2RlIGNvbGdyb3VwIGNvbW1hbmQgZGF0YWxpc3QgZGQgZGVsIGRldGFpbHMgZGZuIGRpciBkaXYgZGwgZHQgZW0gZW1iZWQgZmllbGRzZXQgZmlnY2FwdGlvbiBmaWd1cmUgZm9udCBmb290ZXIgZm9ybSBmcmFtZXNldCBoMSBoMiBoMyBoNCBoNSBoNiBoZWFkIGhlYWRlciBoZ3JvdXAgaHRtbCBpIGlmcmFtZSBpbnMga2V5Z2VuIGtiZCBsYWJlbCBsZWdlbmQgbGkgbWFwIG1hcmsgbWVudSBtZXRlciBuYXYgbm9mcmFtZXMgbm9zY3JpcHQgb2JqZWN0IG9sIG9wdGdyb3VwIG9wdGlvbiBvdXRwdXQgcCBwcmUgcHJvZ3Jlc3MgcSBycCBydCBydWJ5IHMgc2FtcCBzY3JpcHQgc2VjdGlvbiBzZWxlY3Qgc21hbGwgc291cmNlIHNwYW4gc3RyaWtlIHN0cm9uZyBzdHlsZSBzdWIgc3VtbWFyeSBzdXAgdGFibGUgdGJvZHkgdGQgdGV4dGFyZWEgdGZvb3QgdGggdGhlYWQgdGltZSB0aXRsZSB0ciB0dCB1IHVsIHZhciB2aWRlbyB3YnIgeG1wJy5zcGxpdCAnICdcclxub3BlbiA9ICdhcmVhIGJhc2UgYnIgY29sIGNvbW1hbmQgY3NzICFET0NUWVBFIGVtYmVkIGhyIGltZyBpbnB1dCBrZXlnZW4gbGluayBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnInLnNwbGl0ICcgJ1xyXG5cclxubmVzdGFibGVOb2RlTmFtZXMgPSBbXHJcbiAgJ2RpdidcclxuICAnc3BhbidcclxuICAnaDEnXHJcbiAgJ2gyJ1xyXG4gICdoMydcclxuICAnaDQnXHJcbiAgJ2g1J1xyXG4gICdoNidcclxuICAncCdcclxuICAnZmllbGRzZXQnXHJcbiAgJ3NlbGVjdCdcclxuICAnb2wnXHJcbiAgJ3VsJ1xyXG4gICd0YWJsZSdcclxuXVxyXG5cclxuI1RoaXMgbGlzdCBpcyBub3QgeWV0IGV4aGF1c3RpdmUsIGp1c3QgZXhjbHVkZSB0aGUgb2J2aW91c1xyXG5ub25OZXN0YWJsZU5vZGVzID0gW1xyXG4gICdsaSdcclxuICAnbGVnZW5kJ1xyXG4gICd0cidcclxuICAndGQnXHJcbiAgJ29wdGlvbidcclxuICAnYm9keSdcclxuICAnaGVhZCdcclxuICAnc291cmNlJ1xyXG4gICd0Ym9keSdcclxuICAndGZvb3QnXHJcbiAgJ3RoZWFkJ1xyXG4gICdsaW5rJ1xyXG4gICdzY3JpcHQnXHJcbl1cclxuXHJcbm5vZGVOYW1lcyA9IFtcclxuICAnYSdcclxuICAnYidcclxuICAnYnInXHJcbiAgJ2J1dHRvbidcclxuICAnZGl2J1xyXG4gICdlbSdcclxuICAnZmllbGRzZXQnXHJcbiAgJ2Zvcm0nXHJcbiAgJ2gxJ1xyXG4gICdoMidcclxuICAnaDMnXHJcbiAgJ2g0J1xyXG4gICdoNSdcclxuICAnaDYnXHJcbiAgJ2knXHJcbiAgJ2ltZydcclxuICAnaW5wdXQnXHJcbiAgJ2xhYmVsJ1xyXG4gICdsZWdlbmQnXHJcbiAgJ2xpJ1xyXG4gICduYXYnXHJcbiAgJ29sJ1xyXG4gICdvcHRpb24nXHJcbiAgJ3AnXHJcbiAgJ3NlbGVjdCdcclxuICAnc3BhbidcclxuICAnc3Ryb25nJ1xyXG4gICdzdXAnXHJcbiAgJ3N2ZydcclxuICAndGFibGUnXHJcbiAgJ3Rib2R5J1xyXG4gICd0ZCdcclxuICAndGV4dGFyZWEnXHJcbiAgJ3RoJ1xyXG4gICd0aGVhZCdcclxuICAndHInXHJcbiAgJ3VsJ1xyXG5dXHJcblxyXG5jbGFzcyBOb2RlRmFjdG9yeVxyXG4gIFxyXG4gIG9qTm9kZTogbnVsbFxyXG4gIFxyXG4gIEBnZXQ6IChpZCwgdGFnTmFtZSA9ICdkaXYnKSAtPlxyXG4gICAgcmV0ID0gbnVsbFxyXG4gICAgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCBpZFxyXG4gICAgaWYgZWxcclxuICAgICAgdGhpbkVsID0gT0oucmVzdG9yZUVsZW1lbnQgZWwsIHRhZ05hbWVcclxuICAgIGlmIHRoaW5FbFxyXG4gICAgICByZXQgPSBuZXcgTm9kZUZhY3RvcnkgbnVsbCwgbnVsbCwgbnVsbCwgZmFsc2UsIHRoaW5FbFxyXG5cclxuICAgIHJldFxyXG4gIFxyXG4gIF9tYWtlQWRkOiAodGFnTmFtZSwgY291bnQpIC0+XHJcbiAgICAob3B0cykgPT5cclxuICAgICAgbWV0aG9kID0gT0oubm9kZXNbdGFnTmFtZV0gb3IgT0ouY29tcG9uZW50c1t0YWdOYW1lXSBvciBPSi5jb250cm9sc1t0YWdOYW1lXSBvciBPSi5pbnB1dHNbdGFnTmFtZV1cclxuICAgICAgaWYgbWV0aG9kXHJcbiAgICAgICAgbnUgPSBtZXRob2Qgb3B0cywgQG9qTm9kZVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgbnUgPSBPSi5jb21wb25lbnQgbnVsbCwgQG9qTm9kZSwgdGFnTmFtZVxyXG4gICAgICAjcmV0ID0gbmV3IE5vZGVGYWN0b3J5IG51LCBAdGhpbk5vZGUsIGNvdW50XHJcbiAgICAgIG51XHJcbiAgXHJcbiAgX21ha2VVbmlxdWVJZDogKGNvdW50KSAtPlxyXG4gICAgaWYgT0ouR0VORVJBVEVfVU5JUVVFX0lEU1xyXG4gICAgICBjb3VudCArPSAxXHJcbiAgICAgIGlmIGNvdW50IDw9IEBvd25lci5jb3VudCB0aGVuIGNvdW50ID0gQG93bmVyLmNvdW50ICsgMVxyXG4gICAgICBAb3duZXIuY291bnQgPSBjb3VudFxyXG5cclxuICAgICAgaWYgbm90IEBvak5vZGUuZ2V0SWQoKVxyXG4gICAgICAgIGlkID0gQG93bmVyLmdldElkKCkgb3IgJydcclxuICAgICAgICBpZCArPSBAb2pOb2RlLnRhZ05hbWUgKyBjb3VudFxyXG4gICAgICAgIEBvak5vZGUuYXR0ciAnaWQnLCBpZFxyXG4gICAgcmV0dXJuXHJcbiAgXHJcbiAgX2JpbmRFdmVudHM6IC0+XHJcbiAgICBpZiBAb2pOb2RlIHRoZW4gXy5mb3JPd24gQG9wdGlvbnMuZXZlbnRzLCAodmFsLCBrZXkpID0+XHJcbiAgICAgIGlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXHJcbiAgICAgIGlmIGlzTWV0aG9kLm1ldGhvZCB2YWxcclxuICAgICAgICBjYWxsYmFjayA9IChldmVudC4uLikgLT4gdmFsIGV2ZW50Li4uXHJcbiAgICAgICAgQG9qTm9kZS4kLm9uIGtleSwgY2FsbGJhY2tcclxuICAgICAgICBAb2pOb2RlLmFkZCBrZXksIGNhbGxiYWNrXHJcbiAgICAgICAgbnVsbFxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yOiAoQHRhZywgQG9wdGlvbnMsIEBvd25lciwgQHRoaW5Ob2RlID0gbnVsbCkgLT5cclxuICAgIGlmIEB0YWcgYW5kIG5vdCBAdGhpbk5vZGVcclxuICAgICAgQHRoaW5Ob2RlID0gbmV3IFRoaW5ET00gQHRhZywgQG9wdGlvbnMucHJvcHNcclxuICAgICAgQHRoaW5Ob2RlLmFkZCAndGFnTmFtZScsIEB0YWdcclxuICAgICAgQHRoaW5Ob2RlLmNzcyBAb3B0aW9ucy5zdHlsZXNcclxuICAgICAgaWYgQG9wdGlvbnMudGV4dCB0aGVuIEB0aGluTm9kZS50ZXh0IEBvcHRpb25zLnRleHRcclxuICAgIFxyXG4gICAgaWYgQG93bmVyXHJcbiAgICAgIEBtYWtlKClcclxuICBcclxuICBhZGRNYWtlTWV0aG9kOiAoY291bnQpIC0+XHJcbiAgICBtZXRob2RzID0gT0oub2JqZWN0KClcclxuICAgIEBvak5vZGUubWFrZSA9ICh0YWdOYW1lLCBvcHRzKSA9PlxyXG4gICAgICBtZXRob2QgPSBtZXRob2RzW3RhZ05hbWVdXHJcbiAgICAgIGlmIG5vdCBtZXRob2RcclxuICAgICAgICBtZXRob2QgPSBAX21ha2VBZGQgdGFnTmFtZSwgQG9qTm9kZSwgY291bnRcclxuICAgICAgICBtZXRob2RzW3RhZ05hbWVdID0gbWV0aG9kXHJcbiAgICAgIG1ldGhvZCBvcHRzXHJcbiAgICBAb2pOb2RlXHJcblxyXG4gIG1ha2U6IC0+XHJcblxyXG4gICAgQG9qTm9kZSA9IG51bGxcclxuXHJcbiAgICBpZiBAdGhpbk5vZGU/LmlzRnVsbHlJbml0IHRoZW4gQG9qTm9kZSA9IEB0aGluTm9kZVxyXG4gIFxyXG4gICAgIyAyOiBJZiB0aGUgZWxlbWVudCBoYXMgbmV2ZXIgYmVlbiBpbml0aWFsaXplZCwgY29udGludWVcclxuICAgIGVsc2VcclxuICAgICAgIyAzOiBBcyBsb25nIGFzIHRoZSBlbGVtZW50IGlzbid0IHRoZSBib2R5IG5vZGUsIGNvbnRpbnVlXHJcbiAgICAgICMgaWYgZWwudGFnTmFtZSBpc250ICdib2R5J1xyXG4gICAgICAjIDQ6IEV4dGVuZCB0aGUgZWxlbWVudCB3aXRoIHN0YW5kYXJkIGpRdWVyeSBBUEkgbWV0aG9kc1xyXG4gICAgICBAb2pOb2RlID0gbmV3IERPTSBAdGhpbk5vZGUsIEBvd25lclxyXG4gICAgICBjb3VudCA9IChAb3duZXIuY291bnQgKyAxKSB8fCAxXHJcbiAgICAgICMgNTogSWYgdGhlIG5vZGUgaXNuJ3QgaW4gdGhlIERPTSwgYXBwZW5kIGl0IHRvIHRoZSBwYXJlbnRcclxuICAgICAgIyBUaGlzIGFsc28gYWNjb21tb2RhdGVzIGRvY3VtZW50IGZyYWdtZW50cywgd2hpY2ggYXJlIG5vdCBpbiB0aGUgRE9NIGJ1dCBhcmUgcHJlc3VtZWQgdG8gYmUgc291bmQgdW50aWwgcmVhZHkgZm9yIG1hbnVhbCBpbnNlcnRpb25cclxuICAgICAgaWYgQHRoaW5Ob2RlLnRhZ05hbWUgaXNudCAnYm9keScgYW5kIG5vdCBAdGhpbk5vZGUuaXNJbkRPTSBhbmQgbm90IEBvak5vZGUuaXNJbkRPTVxyXG4gICAgICAgIEBfbWFrZVVuaXF1ZUlkIGNvdW50XHJcbiAgICAgICAgQG93bmVyLmFwcGVuZCBAb2pOb2RlWzBdXHJcbiAgICAgICAgIyA2OiBCaW5kIGFueSBkZWZpbmVkIGV2ZW50cyBhZnRlciB0aGUgbm9kZSBpcyBpbiB0aGUgRE9NXHJcbiAgICAgICAgQF9iaW5kRXZlbnRzKClcclxuICAgICAgICBcclxuICAgICAgQHRoaW5Ob2RlLmlzSW5ET00gPSB0cnVlXHJcbiAgICAgIEBvak5vZGUuaXNJbkRPTSA9IHRydWVcclxuXHJcbiAgICAgICMgNzogQ3JlYXRlIHRoZSBhbGwgaW1wb3J0YW50ICdtYWtlJyBtZXRob2RcclxuICAgICAgQGFkZE1ha2VNZXRob2QgY291bnRcclxuXHJcbiAgICAgICMgODogUHJldmVudCBkdXBsaWNhdGUgZmFjdG9yeSBleHRlbnNpb24gYnkgc2V0dGluZyBpcyBpbml0ID0gdHJ1ZVxyXG4gICAgICBAb2pOb2RlLmlzRnVsbHlJbml0ID0gdHJ1ZVxyXG5cclxuICAgICAgIyA5OiBpZiB0aGUgbm9kZSBzdXBwb3J0cyBpdCwgY2FsbCBmaW5hbGl6ZVxyXG4gICAgICBmaW5hbGl6ZSA9IF8ub25jZSBAb2pOb2RlLmZpbmFsaXplIG9yIE9KLm5vb3BcclxuICAgICAgQG9qTm9kZS5maW5hbGl6ZSA9IGZpbmFsaXplXHJcbiAgICAgIGZpbmFsaXplIEBvak5vZGVcclxuICAgICMgMTA6IFJldHVybiB0aGUgZXh0ZW5kZWQgZWxlbWVudFxyXG4gICAgQG9qTm9kZVxyXG5cclxuZ2V0Tm9kZUZyb21GYWN0b3J5ID0gKHRhZywgb3B0aW9ucywgb3duZXIsIGlzQ2FsbGVkRnJvbUZhY3RvcnksIG5vZGUpIC0+XHJcbiAgaWYgT0ouaXMuc3RyaW5nIHRhZ1xyXG4gICAgZmFjdG9yeSA9IG5ldyBOb2RlRmFjdG9yeSB0YWcsIG9wdGlvbnMsIG93bmVyXHJcbiAgZWxzZVxyXG4gICAgZmFjdG9yeSA9IG5ldyBOb2RlRmFjdG9yeSBudWxsLCBvcHRpb25zLCB7fSwgdGFnXHJcbiAgZmFjdG9yeS5vak5vZGVcclxuXHJcblxyXG5PSi5yZWdpc3RlciAnbm9kZUZhY3RvcnknLCBnZXROb2RlRnJvbUZhY3RvcnlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ2V0Tm9kZUZyb21GYWN0b3J5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgYVxyXG5ub2RlTmFtZSA9ICdhJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBpZDogJydcclxuICAgICAgY2xhc3M6ICcnXHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICAgIGhyZWY6ICdqYXZhU2NyaXB0OnZvaWQoMCk7J1xyXG4gICAgICB0eXBlOiAnJ1xyXG4gICAgICB0aXRsZTogJydcclxuICAgICAgcmVsOiAnJ1xyXG4gICAgICBtZWRpYTogJydcclxuICAgICAgdGFyZ2V0OiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHRvZ2dsZVN0YXRlID0gJ29mZidcclxuXHJcbiAgdG9nZ2xlID0gLT5cclxuICAgIGlmIHRvZ2dsZVN0YXRlIGlzICdvbidcclxuICAgICAgdG9nZ2xlU3RhdGUgPSAnb2ZmJ1xyXG4gICAgZWxzZSB0b2dnbGVTdGF0ZSA9ICdvbicgIGlmIHRvZ2dsZVN0YXRlIGlzICdvZmYnXHJcbiAgICByZXR1cm5cclxuXHJcbiAgIyBDbGljayBiaW5kaW5nXHJcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICB0b2dnbGUoKVxyXG4gICAgICByZXRWYWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICBpZiBkZWZhdWx0cy5ocmVmIGlzICcjJyB0aGVuIHJldFZhbCA9IGZhbHNlXHJcbiAgICAgIHJldFZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuICBlbHNlXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSB0b2dnbGVcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcclxuXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxudG8gPSByZXF1aXJlICcuLi90b29scy90bydcclxuIyAjIGJyXHJcblxyXG5ub2RlTmFtZSA9ICdicidcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczoge31cclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIG51bWJlcjogMVxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICBpID0gMFxyXG4gIHdoaWxlIGkgPCB0by5udW1iZXIgZGVmYXVsdHMubnVtYmVyXHJcbiAgICAjIEluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGJycywgaXQgaXMgZGVzaXJhYmxlIHRvIG9ubHkgZ2V0IHRoZSBsYXN0IG9uZSBvdXRcclxuICAgIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gICAgaSArPSAxXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBmb3JtXHJcblxyXG5ub2RlTmFtZSA9ICdmb3JtJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBhY3Rpb246ICcnXHJcbiAgICAgIG1ldGhvZDogJydcclxuICAgICAgbmFtZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0LmFkZCAndmFsaWRhdG9yJywgcmV0LiQudmFsaWRhdGUoXHJcbiAgICBoaWdobGlnaHQ6IChlbGVtZW50KSAtPlxyXG4gICAgICAkZWxtID0gJChlbGVtZW50KVxyXG4gICAgICAkZWxtLmF0dHIgJ09KX2ludmFsaWQnLCAnMSdcclxuICAgICAgJGVsbS5hbmltYXRlIGJhY2tncm91bmRDb2xvcjogJ3JlZCdcclxuICAgICAgbnVsbFxyXG5cclxuICAgIHVuaGlnaGxpZ2h0OiAoZWxlbWVudCkgLT5cclxuICAgICAgJGVsbSA9ICQoZWxlbWVudClcclxuICAgICAgaWYgJGVsbS5hdHRyKCdPSl9pbnZhbGlkJykgaXMgJzEnXHJcbiAgICAgICAgJGVsbS5jc3MgJ2JhY2tncm91bmQtY29sb3InLCAneWVsbG93J1xyXG4gICAgICAgICRlbG0uYXR0ciAnT0pfaW52YWxpZCcsICcwJ1xyXG4gICAgICAgIHNldFRpbWVvdXQgKC0+XHJcbiAgICAgICAgICAkZWxtLmFuaW1hdGUgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXHJcbiAgICAgICAgKSwgNTAwXHJcbiAgICAgIG51bGxcclxuICApXHJcblxyXG4gIHJldC5hZGQgJ2lzRm9ybVZhbGlkJywgLT5cclxuICAgIHJldC4kLnZhbGlkKCkgYW5kIChub3QgcmV0LnZhbGlkYXRvci5pbnZhbGlkRWxlbWVudHMoKSBvciByZXQudmFsaWRhdG9yLmludmFsaWRFbGVtZW50cygpLmxlbmd0aCBpcyAwKVxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG5cclxuXHJcblxyXG5cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXHJcblxyXG4jICMgaW5wdXRcclxuXHJcbm5vZGVOYW1lID0gJ2lucHV0J1xyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6ICd0ZXh0J1xyXG4gICAgICB2YWx1ZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcbiAgICAgIGZvY3Vzb3V0OiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICBpZiBub3QgZGVmYXVsdHMucHJvcHMudHlwZSBvciBub3QgZW51bXMuaW5wdXRUeXBlc1tkZWZhdWx0cy5wcm9wcy50eXBlXVxyXG4gICAgdGhyb3cgbmV3IEVycm9yICdObyBtYXRjaGluZyBpbnB1dCB0eXBlIGZvciB7JyArIGRlZmF1bHRzLnByb3BzLnR5cGUgKyAnfSBjb3VsZCBiZSBmb3VuZC4nXHJcbiAgdGhpc1R5cGUgPSBlbnVtcy5pbnB1dFR5cGVzW2RlZmF1bHRzLnByb3BzLnR5cGVdXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICBzd2l0Y2ggdGhpc1R5cGVcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLmNoZWNrYm94XHJcbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LiQuaXMgJzpjaGVja2VkJ1xyXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMucmFkaW9cclxuICAgICAgICByZXQudmFsdWUgPSByZXQuJC5maW5kKCc6Y2hlY2tlZCcpLnZhbCgpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXQudmFsdWUgPSByZXQudmFsKClcclxuICAgIGRlZmF1bHRzLnByb3BzLnZhbHVlID0gcmV0LnZhbHVlICAgIFxyXG4gICAgcmV0LnZhbHVlXHJcblxyXG4gICMjI1xyXG4gICAgQ2xpY2sgYmluZGluZy4gSWYgdGhlIGNhbGxlciBkZWZpbmVkIGEgY2xpY2sgaGFuZGxlcixcclxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcclxuICAgIHRoZW4gY2FsbCB0aGUgZGVmaW5lZCBjbGljayBoYW5kbGVyIHdpdGggdGhlIGxhdGVzdCB2YWx1ZS5cclxuICAjIyNcclxuICBvbGRDbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gIGlmIG9sZENsaWNrIGFuZCBvbGRDbGljayBpc250IE9KLm5vb3BcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICBvbGRDbGljayByZXQudmFsdWUsIGV2ZW50Li4uXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSBuZXdDbGlja1xyXG5cclxuICAjIyNcclxuICAgIENoYW5nZSBiaW5kaW5nLiBJZiB0aGUgY2FsbGVyIGRlZmluZWQgYSBjaGFuZ2UgaGFuZGxlcixcclxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcclxuICAgIHRoZW4gY2FsbCB0aGUgZGVmaW5lZCBjaGFuZ2UgaGFuZGxlciB3aXRoIHRoZSBsYXRlc3QgdmFsdWUuXHJcbiAgIyMjXHJcbiAgb2xkQ2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gIGlmIG9sZENoYW5nZSBhbmQgb2xkQ2hhbmdlIGlzbnQgT0oubm9vcFxyXG4gICAgbmV3Q2hhbmdlID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICBvbGRDaGFuZ2UgcmV0LnZhbHVlLCBldmVudC4uLlxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSA9IG5ld0NoYW5nZVxyXG5cclxuICAjIyNcclxuICAgIE9uIEZvY3VzIE91dCBiaW5kaW5nLiBBbHdheXMgdXNlIHRoZSBldmVudCB0byB1cGRhdGUgdGhlIGludGVybmFsXHJcbiAgICB2YWx1ZSBvZiB0aGUgY29udHJvbDsgYW5kIGlmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGZvY3Vzb3V0IGV2ZW50LFxyXG4gICAgd3JhcCBpdCBhbmQgaW52b2tlIGl0IHdpdGggdGhlIGxhdGVzdCB2YWx1ZVxyXG4gICMjI1xyXG4gIG9sZEZvY3Vzb3V0ID0gZGVmYXVsdHMuZXZlbnRzLmZvY3Vzb3V0XHJcbiAgbmV3Rm9jdXNvdXQgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICBzeW5jVmFsdWUoKVxyXG4gICAgaWYgb2xkRm9jdXNvdXQgYW5kIG9sZEZvY3Vzb3V0IGlzbnQgT0oubm9vcFxyXG4gICAgICBvbGRGb2N1c291dCByZXQudmFsdWUsIGV2ZW50Li4uXHJcblxyXG4gIGRlZmF1bHRzLmV2ZW50cy5mb2N1c291dCA9IG5ld0ZvY3Vzb3V0XHJcblxyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG4gIHJldC52YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBvbFxyXG5cclxubm9kZU5hbWUgPSAnb2wnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIHNlbGVjdFxyXG5cclxubm9kZU5hbWUgPSAnc2VsZWN0J1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHNlbGVjdGVkOiAnJ1xyXG4gICAgICBtdWx0aXBsZTogZmFsc2VcclxuICAgIHN0eWxlczoge31cclxuICAgIHZhbHVlczogW11cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICB2YWx1ZSA9ICcnXHJcbiAgdmFsdWVzID0gW11cclxuICBoYXNFbXB0eSA9IGZhbHNlXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICB2YWx1ZSA9IHJldC52YWwoKVxyXG5cclxuICAjIENsaWNrIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIHJldHZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuXHJcbiAgIyBDaGFuZ2UgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICBjaGFuZ2UgPSBkZWZhdWx0cy5ldmVudHMuY2hhbmdlXHJcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0LmFkZCAnc2VsZWN0ZWREYXRhJywgKHByb3BOYW1lKSAtPlxyXG4gICAgcmV0ID0gJydcclxuICAgIGlmIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpIGFuZCByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVswXVxyXG4gICAgICBkYXRhc2V0ID0gcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0uZGF0YXNldFxyXG4gICAgICByZXQgPSBkYXRhc2V0W3Byb3BOYW1lXSAgaWYgZGF0YXNldFxyXG4gICAgcmV0XHJcblxyXG4gIHJldC5hZGQgJ3NlbGVjdGVkVGV4dCcsIC0+XHJcbiAgICByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS50ZXh0KClcclxuXHJcbiAgcmV0LmFkZCAnc2VsZWN0ZWRWYWwnLCAtPlxyXG4gICAgdmFsdWUgPSByZXQudmFsKClcclxuICAgIHZhbHVlXHJcblxyXG4gIHJldC5hZGQgJ2FkZE9wdGlvbicsICh2YWx1ZSwgdGV4dCA9IHZhbHVlLCBzZWxlY3RlZCA9IGZhbHNlLCBkaXNhYmxlZCA9IGZhbHNlKSAtPlxyXG4gICAgaXNFbXB0eSA9IF8uaXNFbXB0eSB2YWx1ZVxyXG4gICAgYWRkID0gZmFsc2VcclxuICAgIGlmIGlzRW1wdHkgYW5kIGZhbHNlIGlzIGhhc0VtcHR5XHJcbiAgICAgIGhhc0VtcHR5ID0gdHJ1ZVxyXG4gICAgICBhZGQgPSB0cnVlXHJcbiAgICBpZiBmYWxzZSBpcyBhZGQgYW5kIGZhbHNlIGlzIGlzRW1wdHkgdGhlbiBhZGQgPSB0cnVlXHJcbiAgICBpZiBhZGRcclxuICAgICAgdmFsID1cclxuICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgcHJvcHM6XHJcbiAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgaWYgc2VsZWN0ZWRcclxuICAgICAgICB2YWwuc2VsZWN0ZWQgPSBzZWxlY3RlZFxyXG4gICAgICBpZiBkaXNhYmxlZFxyXG4gICAgICAgIHZhbC5kaXNhYmxlZCA9IGRpc2FibGVkXHJcbiAgICAgIG9wdGlvbiA9IHJldC5tYWtlICdvcHRpb24nLCB2YWxcclxuICAgICAgb3B0aW9uXHJcblxyXG4gIHJldC5hZGQgJ2FkZE9wdGlvbnMnLCAob3B0aW9ucykgLT5cclxuICAgIHZhbHVlcyA9IF8udW5pb24gdmFsdWVzLCBvcHRpb25zXHJcbiAgICBPSi5lYWNoIG9wdGlvbnMsICgodmFsKSAtPlxyXG4gICAgICB2YWx1ZSA9IHJldC5hZGRPcHRpb24odmFsKVxyXG4gICAgICB2YWx1ZXMucHVzaCB2YWx1ZVxyXG4gICAgKSwgZmFsc2VcclxuICAgIHZhbHVlc1xyXG5cclxuICByZXQuYWRkICdyZXNldE9wdGlvbnMnLCAodmFsdWVzKSAtPlxyXG4gICAgcmV0LmVtcHR5KClcclxuICAgIHZhbHVlcyA9IHZhbHVlc1xyXG4gICAgcmV0LmFkZE9wdGlvbnMgdmFsdWVzXHJcbiAgICByZXRcclxuXHJcbiAgcmV0LmFkZCAncmVtb3ZlT3B0aW9uJywgKHZhbHVlVG9SZW1vdmUpIC0+XHJcbiAgICB2YWx1ZXMuc3BsaWNlIHZhbHVlcy5pbmRleE9mKHZhbHVlVG9SZW1vdmUpLCAxICNyZW1vdmVzIHRoZSBpdGVtIGZyb20gdGhlIGxpc3RcclxuICAgIHNlbGVjdENvbnRyb2wgPSByZXRbMF1cclxuICAgIGkgPSAwXHJcblxyXG4gICAgd2hpbGUgaSA8IHNlbGVjdENvbnRyb2wubGVuZ3RoXHJcbiAgICAgIHNlbGVjdENvbnRyb2wucmVtb3ZlIGkgIGlmIHNlbGVjdENvbnRyb2wub3B0aW9uc1tpXS52YWx1ZSBpcyB2YWx1ZVRvUmVtb3ZlXHJcbiAgICAgIGkrK1xyXG4gICAgbnVsbFxyXG5cclxuXHJcblxyXG4gIGlmIGRlZmF1bHRzLnZhbHVlcy5sZW5ndGggPiAwXHJcbiAgICByZXQuYWRkT3B0aW9ucyBkZWZhdWx0cy52YWx1ZXNcclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuYXJyYXkyRCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FycmF5MkQnXHJcbiQgPSByZXF1aXJlICdqcXVlcnknXHJcbkpzb25Ub1RhYmxlID0gcmVxdWlyZSAnLi4vdG9vbHMvSnNvblRvVGFibGUnXHJcblxyXG4jICMgdGFibGVcclxuXHJcbm5vZGVOYW1lID0gJ3RhYmxlJ1xyXG5cclxuIyMjXHJcbkNyZWF0ZSBhbiBIVE1MIHRhYmxlLiBQcm92aWRlcyBoZWxwZXIgbWV0aG9kcyB0byBjcmVhdGUgQ29sdW1ucyBhbmQgQ2VsbHMuXHJcbiMjI1xyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgIyAjIyBvcHRpb25zXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgIyAjIyMgZGF0YVxyXG4gICAgIyBvcHRpb25hbCBhcnJheSBvZiBvYmplY3RzLiBpZiBwcm92aWRlZCB3aWxsIGdlbmVyYXRlIHRhYmxlIGF1dG9tYXRpY2FsbHkuXHJcbiAgICBkYXRhOiBudWxsXHJcbiAgICAjICMjIyBwcm9wc1xyXG4gICAgIyBvcHRpb25hbCBwcm9wZXJ0aWVzIHRvIGFwcGx5IHRvIHRhYmxlIHJvb3Qgbm9kZVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNlbGxwYWRkaW5nOiAwXHJcbiAgICAgIGNlbGxzcGFjaW5nOiAwXHJcbiAgICAgIGFsaWduOiAnJ1xyXG4gICAgICB3aWR0aDogJydcclxuICAgICAgY2VsbGFsaWduOiAnbGVmdCdcclxuICAgICAgY2VsbHZhbGlnbjogJ3RvcCdcclxuICAgICAgY2xhc3M6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6IHt9XHJcbiAgICAjICMjIyBjZWxsc1xyXG4gICAgIyBvcHRpb25hbCBwcm9wZXJ0aWVzIHRvIGFwcGx5IHRvIGluZGl2aWR1YWwgY2VsbHNcclxuICAgIGNlbGxzOlxyXG4gICAgICBjbGFzczogJydcclxuICAgICAgYWxpZ246ICcnXHJcbiAgICAgICd2ZXJ0aWNhbC1hbGlnbic6ICcnXHJcbiAgICAgIGNlbGxwYWRkaW5nOiAnJ1xyXG4gICAgICBtYXJnaW46ICcnXHJcbiAgICAjICMjIyB0aGVhZFxyXG4gICAgIyBvcHRpb25hbCBvcHRpb25zIG9iamVjdCB0byBwYXNzIGludG8gdGhlYWQgY3JlYXRpb25cclxuICAgIHRoZWFkOiB7fVxyXG4gICAgIyAjIyMgdGJvZHlcclxuICAgICMgb3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdG8gcGFzcyBpbnRvIHRib2R5IGNyZWF0aW9uXHJcbiAgICB0Ym9keToge31cclxuXHJcbiAgICBmaXJzdEFsaWduUmlnaHQ6IGZhbHNlXHJcbiAgICBvZGRBbGlnblJpZ2h0OiBmYWxzZVxyXG5cclxuICByb3dzID0gW11cclxuICBjZWxscyA9IGFycmF5MkQoKVxyXG4gIGNvbHVtbkNvdW50ID0gMFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG4gXHJcblxyXG4gIHRib2R5ID0gbnVsbFxyXG4gIHRoZWFkID0gbnVsbFxyXG4gIHRoZWFkUm93ID0gbnVsbFxyXG5cclxuICAjICMjIyBpbml0XHJcbiAgIyBpbnRlcm5hbCBtZXRob2QgZm9yIG9uZSB0aW1lIGluaXRpYWxpemF0aW9uIG9mIHRoZSB0YWJsZVxyXG4gIGluaXQgPSBfLm9uY2UgLT5cclxuICAgIGlmIGRlZmF1bHRzLmRhdGFcclxuICAgICAgajJ0ID0gbmV3IEpzb25Ub1RhYmxlIGRlZmF1bHRzLmRhdGFcclxuICAgICAgdGJsU3RyID0gajJ0LnRhYmxlXHJcbiAgICBpZiB0YmxTdHJcclxuICAgICAgalRibCA9ICQgdGJsU3RyXHJcblxyXG4gICAgICBqSGVhZCA9IGpUYmwuZmluZCAndGhlYWQnXHJcbiAgICAgIHJldC4kLmFwcGVuZCBqSGVhZFxyXG4gICAgICB0aGVhZCA9IGVsLnJlc3RvcmVFbGVtZW50IGpIZWFkWzBdXHJcbiAgICAgIHRoZWFkUm93ID0gZWwucmVzdG9yZUVsZW1lbnQgdGhlYWRbMF0ucm93c1swXVxyXG5cclxuICAgICAgakJvZHkgPSBqVGJsLmZpbmQgJ3Rib2R5J1xyXG4gICAgICByZXQuJC5hcHBlbmQgakJvZHlcclxuICAgICAgdGJvZHkgPSBlbC5yZXN0b3JlRWxlbWVudCBqQm9keVswXVxyXG5cclxuICAgICAgbG9hZENlbGxzKClcclxuICAgIGVsc2VcclxuICAgICAgdGhlYWQgPSByZXQubWFrZSAndGhlYWQnLCBkZWZhdWx0cy50aGVhZFxyXG4gICAgICB0aGVhZFJvdyA9IHRoZWFkLm1ha2UgJ3RyJ1xyXG4gICAgICB0Ym9keSA9IHJldC5tYWtlICd0Ym9keScsIGRlZmF1bHRzLnRib2R5XHJcbiAgICAgIHJvd3MucHVzaCB0Ym9keS5tYWtlICd0cidcclxuICAgIHJldFxyXG5cclxuICAjICMjIyBsb2FkQ2VsbHNcclxuICAjIGludGVybmFsIG1ldGhvZCBndWFyYW50ZWVzIHRoYXQgdGFibGVzIGxvYWRlZCBmcm9tIEpTT04gYXJlIGZ1bGx5IGxvYWRlZCBpbnRvIG1lbW9yeVxyXG4gIGxvYWRDZWxscyA9ICgpIC0+XHJcbiAgICByID0gMFxyXG4gICAgd2hpbGUgdGJvZHlbMF0ucm93cy5sZW5ndGggPiByXHJcbiAgICAgIGMgPSAwXHJcbiAgICAgIG1lbVJvdyA9IGVsLnJlc3RvcmVFbGVtZW50IHRib2R5WzBdLnJvd3Nbcl1cclxuICAgICAgcm93cy5wdXNoIG1lbVJvd1xyXG4gICAgICB3aGlsZSB0Ym9keVswXS5yb3dzW3JdLmNlbGxzLmxlbmd0aCA+IGNcclxuICAgICAgICBtZW1DZWxsID0gY2VsbHMuZ2V0IHIrMSwgYysxXHJcbiAgICAgICAgaWYgbm90IG1lbUNlbGxcclxuICAgICAgICAgIG1lbUNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCB0Ym9keVswXS5yb3dzW3JdLmNlbGxzW2NdXHJcbiAgICAgICAgICBjZWxscy5zZXQgcisxLCBjKzEsIG1lbUNlbGxcclxuICAgICAgICBjICs9IDFcclxuICAgICAgciArPSAxXHJcblxyXG4gICMgIyMjIGZpbGxNaXNzaW5nXHJcbiAgIyBpbnRlcm5hbCBtZXRob2QgZ3VhcmFudGVlcyB0aGF0IGNlbGxzIGV4aXN0IGZvciB0aGUgZGltZW5zaW9ucyBvZiB0aGUgdGFibGVcclxuICBmaWxsTWlzc2luZyA9ICgpIC0+XHJcbiAgICBjZWxscy5lYWNoIChyb3dObywgY29sTm8sIHZhbCkgLT5cclxuICAgICAgaWYgbm90IHZhbFxyXG4gICAgICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cclxuICAgICAgICByb3cuY2VsbCBjb2xObywge31cclxuXHJcbiAgIyAjIyBjb2x1bW5cclxuICAjIEFkZHMgYSBjb2x1bW4gbmFtZSB0byB0aGUgdGFibGUgaGVhZFxyXG4gIHJldC5hZGQgJ2NvbHVtbicsIChjb2xObywgY29sTmFtZSkgLT5cclxuICAgIHJldC5pbml0KClcclxuICAgIGNvbHVtbkNvdW50ICs9IDFcclxuICAgIHRoID0gbnVsbFxyXG4gICAgaSA9IDBcclxuICAgIHdoaWxlIHRoZWFkWzBdLnJvd3NbMF0uY2VsbHMubGVuZ3RoIDwgY29sTm9cclxuICAgICAgbmF0aXZlVGggPSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzW2ldXHJcbiAgICAgIGlmIG5vdCBuYXRpdmVUaFxyXG4gICAgICAgIHRoID0gdGhlYWRSb3cubWFrZSAndGgnLCB7fVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudCBuYXRpdmVUaCwgJ3RoJ1xyXG4gICAgICBpICs9IDFcclxuICAgIGlmIG5vdCB0aFxyXG4gICAgICBuYXRpdmVUaCA9IHRoZWFkWzBdLnJvd3NbMF0uY2VsbHNbY29sTm8tMV1cclxuICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudCBuYXRpdmVUaCwgJ3RoJ1xyXG4gICAgdGgudGV4dCBjb2xOYW1lXHJcbiAgICB0aFxyXG5cclxuICAjICMjIHJvd1xyXG4gICMgQWRkcyBhIG5ldyByb3cgKHRyKSB0byB0aGUgdGFibGUgYm9keVxyXG4gIHJldC5hZGQgJ3JvdycsIChyb3dObywgb3B0cykgLT5cclxuICAgIHJvdyA9IHJvd3Nbcm93Tm8tMV1cclxuXHJcbiAgICBpZiBub3Qgcm93XHJcbiAgICAgIHdoaWxlIHJvd3MubGVuZ3RoIDwgcm93Tm9cclxuICAgICAgICByb3cgPSB0Ym9keS5tYWtlICd0cicsIHt9XHJcbiAgICAgICAgcm93cy5wdXNoIHJvd1xyXG5cclxuICAgIGlmIG5vdCByb3cuY2VsbFxyXG4gICAgICByb3cuYWRkICdjZWxsJywgKGNvbE5vLCBvcHRzKSAtPlxyXG4gICAgICAgIGNlbGwgPSBPSi5ub2Rlcy50ZCBvcHRzLCByb3dcclxuICAgICAgICBjZWxscy5zZXQgcm93Tm8sIGNvbE5vLCBjZWxsXHJcbiAgICAgICAgY2VsbFxyXG5cclxuICAgIHJvd1xyXG5cclxuICAjICMjIGNlbGxcclxuICAjIEFkZHMgYSBjZWxsICh0ci90ZCkgdG8gdGhlIHRhYmxlIGJvZHlcclxuICByZXQuYWRkICdjZWxsJywgKHJvd05vLCBjb2xObywgb3B0cykgLT5cclxuICAgIGlmIHJvd05vIDwgMSB0aGVuIHJvd05vID0gMVxyXG4gICAgaWYgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXHJcbiAgICBpZiBjb2x1bW5Db3VudCA+IDAgYW5kIGNvbE5vLTEgPiBjb2x1bW5Db3VudCB0aGVuIHRocm93IG5ldyBFcnJvciAnQSBjb2x1bW4gbmFtZSBoYXMgbm90IGJlZW4gZGVmaW5lZCBmb3IgdGhpcyBwb3NpdGlvbiB7JyArIHJvd05vICsgJ3gnICsgY29sTm8gKyAnfS4nXHJcblxyXG4gICAgcm93ID0gcmV0LnJvdyByb3dOb1xyXG5cclxuICAgIGNlbGwgPSBjZWxscy5nZXQgcm93Tm8sIGNvbE5vXHJcblxyXG4gICAgaWYgbm90IGNlbGxcclxuICAgICAgaSA9IDBcclxuICAgICAgd2hpbGUgaSA8IGNvbE5vXHJcbiAgICAgICAgaSArPSAxXHJcbiAgICAgICAgaWYgaSBpcyBjb2xOb1xyXG4gICAgICAgICAgbnVPcHRzID0gT0ouZXh0ZW5kIHtwcm9wczogZGVmYXVsdHMuY2VsbHN9LCBvcHRzXHJcbiAgICAgICAgICBjZWxsID0gcm93LmNlbGwgY29sTm8sIG51T3B0c1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHRyeUNlbGwgPSBjZWxscy5nZXQgcm93Tm8sIGlcclxuICAgICAgICAgIGlmIG5vdCB0cnlDZWxsXHJcbiAgICAgICAgICAgIHRyeUNlbGwgPSAgcm93LmNlbGwgaSwgcHJvcHM6IGRlZmF1bHRzLmNlbGxzXHJcblxyXG4gICAgY2VsbFxyXG5cclxuICAjICMjIEZpbmFsaXplXHJcbiAgIyBGaW5hbGl6ZSBndWFyYW50ZWVzIHRoYXQgdGhlYWQgYW5kIHRib2R5IGFuZCBjcmVhdGVkIHdoZW4gdGhlIG5vZGUgaXMgZnVsbHkgaW5zdGFudGlhdGVkXHJcbiAgaW5pdCgpXHJcblxyXG4gICMgIyMgVEhlYWRcclxuICAjIEV4cG9zZSB0aGUgaW50ZXJuYWwgdGhlYWQgbm9kZVxyXG4gIHJldC5hZGQgJ3RoZWFkJywgdGhlYWRcclxuXHJcbiAgIyAjIyBUQm9keVxyXG4gICMgRXhwb3NlIHRoZSBpbnRlcm5hbCB0Ym9keSBub2RlXHJcbiAgcmV0LmFkZCAndGJvZHknLCB0Ym9keVxyXG5cclxuICAgIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuZW51bXMgPSByZXF1aXJlICcuLi90b29scy9lbnVtcydcclxuXHJcbm5vZGVOYW1lID0gJ3RleHRhcmVhJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBuYW1lOiAnJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogJydcclxuICAgICAgdmFsdWU6ICcnXHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICAgIG1heGxlbmd0aDogJydcclxuICAgICAgYXV0b2ZvY3VzOiBmYWxzZVxyXG4gICAgICBpc1JlcXVpcmVkOiBmYWxzZVxyXG4gICAgICByb3dzOiAzXHJcbiAgICAgIGNvbHM6IDI1XHJcbiAgICAgIGRpc2FibGVkOiBmYWxzZVxyXG4gICAgICByZWFkb25seTogZmFsc2VcclxuICAgICAgZm9ybTogJydcclxuICAgICAgd3JhcDogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHZhbHVlID0gZGVmYXVsdHMucHJvcHMudmFsdWVcclxuXHJcbiAgc3luY1ZhbHVlID0gLT5cclxuICAgIHN3aXRjaCBkZWZhdWx0cy5wcm9wcy50eXBlXHJcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5jaGVja2JveFxyXG4gICAgICAgIHZhbHVlID0gcmV0LiQuaXMoJzpjaGVja2VkJylcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLnJhZGlvXHJcbiAgICAgICAgdmFsdWUgPSByZXQuJC5maW5kKCc6Y2hlY2tlZCcpLnZhbCgpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICB2YWx1ZSA9IHJldC52YWwoKVxyXG5cclxuICAjIENsaWNrIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIHJldHZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuXHJcbiAgIyBDaGFuZ2UgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICBjaGFuZ2UgPSBkZWZhdWx0cy5ldmVudHMuY2hhbmdlXHJcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG5ub2RlTmFtZSA9ICd0aGVhZCdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczoge31cclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIG51bWJlcjogMVxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcm93cyA9IFtdXHJcbiAgY2VsbHMgPSB7fVxyXG4gIHJldC5hZGQgJ2NlbGwnLCAocm93Tm8sIGNvbE5vKSAtPlxyXG4gICAgaW5pdCgpXHJcblxyXG4gICAgaWYgcm93Tm8gPCAxIHRoZW4gcm93Tm8gPSAxXHJcbiAgICBpZiBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcclxuXHJcbiAgICByb3cgPSByb3dzW3Jvd05vLTFdXHJcblxyXG4gICAgaWYgbm90IHJvd1xyXG4gICAgICB3aGlsZSByb3dzLmxlbmd0aCA8IHJvd05vXHJcbiAgICAgICAgcm93ID0gT0oubm9kZXMudHIge30sIHRib2R5LCBmYWxzZVxyXG4gICAgICAgIHJvd3MucHVzaCByb3dcclxuXHJcbiAgICB0ZCA9IHJvd1swXS5jZWxsc1tjb2xOb11cclxuXHJcbiAgICBpZiB0ZCB0aGVuIGNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCB0ZCwgJ3RkJ1xyXG4gICAgaWYgbm90IHRkXHJcbiAgICAgIHdoaWxlIHJvd1swXS5jZWxscy5sZW5ndGggPCBjb2xOb1xyXG4gICAgICAgIGlkeCA9IHJvd1swXS5jZWxscy5sZW5ndGhcclxuICAgICAgICB0ZCA9IHJvd1swXS5jZWxsc1tpZHgtMV1cclxuICAgICAgICBpZiB0ZCBhbmQgaWR4IGlzIGNvbE5vXHJcbiAgICAgICAgICBjZWxsID0gZWwucmVzdG9yZUVsZW1lbnQgdGQsICd0ZCdcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBjZWxsID0gT0oubm9kZXMudGQgcHJvcHM6IGRlZmF1bHRzLmNlbGxzLCByb3csIGZhbHNlXHJcblxyXG4gICAgaWYgbm90IGNlbGwuaXNWYWxpZFxyXG4gICAgICBub2RlRmFjdG9yeSBjZWxsLCByb3csIHJvd05vICsgY29sTm9cclxuXHJcbiAgICBjZWxsXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxubm9kZU5hbWUgPSAndWwnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsInRoaXNHbG9iYWwgPSAoaWYgKHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsKSB0aGVuIGdsb2JhbCBlbHNlIChpZiAodHlwZW9mIHNlbGYgaXNudCAndW5kZWZpbmVkJyBhbmQgc2VsZikgdGhlbiBzZWxmIGVsc2UgKGlmICh0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgYW5kIHdpbmRvdykgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkpXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXNHbG9iYWwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2J1dHRvbmlucHV0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuICAgICAgc3JjOiAnJ1xuICAgICAgYWx0OiAnJ1xuICAgICAgaGVpZ2h0OiAnJ1xuICAgICAgd2lkdGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG5cblxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdjaGVja2JveCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIGNoZWNrZWQ6IGZhbHNlXG4gICAgaW5kZXRlcm1pbmF0ZTogZmFsc2VcbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgaWYgZGVmYXVsdHMuY2hlY2tlZFxuICAgIHJldC5hdHRyICdjaGVja2VkJywgdHJ1ZVxuICBlbHNlIGlmIGRlZmF1bHRzLmluZGV0ZXJtaW5hdGVcbiAgICByZXQuYXR0ciAnaW5kZXRlcm1pbmF0ZScsIHRydWVcblxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdjb2xvcidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdkYXRlJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnZGF0ZXRpbWUnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2RhdGV0aW1lLWxvY2FsJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdlbWFpbCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgICBtdWx0aXBsZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdmaWxlJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIGFjY2VwdDogJydcbiAgICAgIG11bHRpcGxlOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2hpZGRlbidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnaW1hZ2VpbnB1dCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogJ2ltYWdlJ1xuICAgICAgc3JjOiAnJ1xuICAgICAgYWx0OiAnJ1xuICAgICAgaGVpZ2h0OiAnJ1xuICAgICAgd2lkdGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnbW9udGgnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ251bWJlcidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncGFzc3dvcmQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgbWF4bGVuZ3RoOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3JhZGlvJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIG5hbWU6ICcnXG4gICAgICB2YWx1ZTogJydcbiAgICAgIGNoZWNrZWQ6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncmFuZ2UnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgbWluOiAwXG4gICAgICBtYXg6IDEwMFxuICAgICAgdmFsdWU6IDUwXG4gICAgICBzdGVwOiAxXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncmVzZXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3NlYXJjaCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnc3VibWl0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0ZWwnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgcGF0dGVybjogJydcbiAgICAgIG1heGxlbmd0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0ZXh0aW5wdXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgYXV0b2NvbXBsZXRlOiAnb24nXG4gICAgICBhdXRvc2F2ZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0aW1lJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd1cmwnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgcGF0dGVybjogJydcbiAgICAgIG1heGxlbmd0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd3ZWVrJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiIyAjIE9KXG50aGlzR2xvYmFsID0gcmVxdWlyZSAnLi9nbG9iYWwnXG51dGlsTGliID0gcmVxdWlyZSAnanF1ZXJ5J1xubmFtZVNwYWNlTmFtZSA9ICdPSidcblxuIyMjXG5ib290IHN0cmFwIG5hbWUgbWV0aG9kIGludG8gT2JqZWN0IHByb3RvdHlwZVxuIyMjXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBPYmplY3Q6OixcbiAgZ2V0SW5zdGFuY2VOYW1lOlxuICAgIHZhbHVlOiAtPlxuICAgICAgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLnsxLH0pXFwoL1xuICAgICAgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKEBjb25zdHJ1Y3Rvci50b1N0cmluZygpKVxuICAgICAgKGlmIChyZXN1bHRzIGFuZCByZXN1bHRzLmxlbmd0aCA+IDEpIHRoZW4gcmVzdWx0c1sxXSBlbHNlICcnKVxuXG5cbiMjI1xuQW4gaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5hbWVzcGFjZSB0cmVlXG4jIyNcbk5zVHJlZSA9IHt9XG5tYWtlVGhlSnVpY2UgPSAtPlxuXG4gICMjI1xuICBJbnRlcm5hbCBuYW1lU3BhY2VOYW1lIG1ldGhvZCB0byBjcmVhdGUgbmV3ICdzdWInIG5hbWVzcGFjZXMgb24gYXJiaXRyYXJ5IGNoaWxkIG9iamVjdHMuXG4gICMjI1xuICBtYWtlTmFtZVNwYWNlID0gKHNwYWNlbmFtZSwgdHJlZSkgLT5cbiAgICAjIyNcbiAgICBUaGUgZGVyaXZlZCBpbnN0YW5jZSB0byBiZSBjb25zdHJ1Y3RlZFxuICAgICMjI1xuICAgIEJhc2UgPSAobnNOYW1lKSAtPlxuICAgICAgcHJvdG8gPSB0aGlzXG4gICAgICB0cmVlW25zTmFtZV0gPSB0cmVlW25zTmFtZV0gb3Ige31cbiAgICAgIG5zVHJlZSA9IHRyZWVbbnNOYW1lXVxuICAgICAgbWVtYmVycyA9IHt9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAnbWVtYmVycycsIHZhbHVlOiBtZW1iZXJzXG5cbiAgICAgICMjI1xuICAgICAgUmVnaXN0ZXIgKGUuZy4gJ0xpZnQnKSBhbiBPYmplY3QgaW50byB0aGUgcHJvdG90eXBlIG9mIHRoZSBuYW1lc3BhY2UuXG4gICAgICBUaGlzIE9iamVjdCB3aWxsIGJlIHJlYWRhYmxlL2V4ZWN1dGFibGUgYnV0IGlzIG90aGVyd2lzZSBpbW11dGFibGUuXG4gICAgICAjIyNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAncmVnaXN0ZXInLFxuICAgICAgICB2YWx1ZTogKG5hbWUsIG9iaiwgZW51bWVyYWJsZSkgLT5cbiAgICAgICAgICAndXNlIHN0cmljdCdcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsaWZ0IGEgbmV3IHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIG5hbWUgaXNudCAnc3RyaW5nJykgb3IgbmFtZSBpcyAnJ1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIHByb3BlcnR5IGluc3RhbmNlLicpICB1bmxlc3Mgb2JqXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9wZXJ0eSBuYW1lZCAnICsgbmFtZSArICcgaXMgYWxyZWFkeSBkZWZpbmVkIG9uICcgKyBzcGFjZW5hbWUgKyAnLicpICBpZiBwcm90b1tuYW1lXVxuXG4gICAgICAgICAgbWVtYmVyc1tuYW1lXSA9IG1lbWJlcnNbbmFtZV0gb3IgbmFtZVxuXG4gICAgICAgICAgI0d1YXJkIGFnYWluc3Qgb2JsaXRlcmF0aW5nIHRoZSB0cmVlIGFzIHRoZSB0cmVlIGlzIHJlY3Vyc2l2ZWx5IGV4dGVuZGVkXG4gICAgICAgICAgbnNUcmVlW25hbWVdID0gbnNUcmVlW25hbWVdIG9yXG4gICAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgICAgICB0eXBlOiB0eXBlb2Ygb2JqXG4gICAgICAgICAgICBpbnN0YW5jZTogKGlmIG9iai5nZXRJbnN0YW5jZU5hbWUgdGhlbiBvYmouZ2V0SW5zdGFuY2VOYW1lKCkgZWxzZSAndW5rbm93bicpXG5cbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgcHJvdG8sIG5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogb2JqXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSBpc250IGVudW1lcmFibGVcblxuICAgICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHNwYWNlbmFtZSArICcuJyArIG5hbWVcbiAgICAgICAgICBvYmpcblxuXG4gICAgICAjIyNcbiAgICAgIENyZWF0ZSBhIG5ldywgc3RhdGljIG5hbWVzcGFjZSBvbiB0aGUgY3VycmVudCBwYXJlbnQgKGUuZy4gbnNOYW1lLnRvLi4uIHx8IG5zTmFtZS5pcy4uLilcbiAgICAgICMjI1xuICAgICAgcHJvdG8ucmVnaXN0ZXIgJ21ha2VTdWJOYW1lU3BhY2UnLCAoKHN1Yk5hbWVTcGFjZSkgLT5cbiAgICAgICAgJ3VzZSBzdHJpY3QnXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIG5ldyBzdWIgbmFtZXNwYWNlIHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIHN1Yk5hbWVTcGFjZSBpc250ICdzdHJpbmcnKSBvciBzdWJOYW1lU3BhY2UgaXMgJydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdWIgbmFtZXNwYWNlIG5hbWVkICcgKyBzdWJOYW1lU3BhY2UgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKSAgaWYgcHJvdG8uc3ViTmFtZVNwYWNlXG4gICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHN1Yk5hbWVTcGFjZVxuICAgICAgICBuZXdOYW1lU3BhY2UgPSBtYWtlTmFtZVNwYWNlKHN1Yk5hbWVTcGFjZSwgbnNUcmVlKVxuICAgICAgICBuZXdOYW1lU3BhY2UucmVnaXN0ZXIgJ2NvbnN0YW50cycsIG1ha2VOYW1lU3BhY2UoJ2NvbnN0YW50cycsIG5zVHJlZSksIGZhbHNlICBpZiBzdWJOYW1lU3BhY2UgaXNudCAnY29uc3RhbnRzJ1xuICAgICAgICBwcm90by5yZWdpc3RlciBzdWJOYW1lU3BhY2UsIG5ld05hbWVTcGFjZSwgZmFsc2VcbiAgICAgICAgbmV3TmFtZVNwYWNlXG4gICAgICApLCBmYWxzZVxuICAgICAgcmV0dXJuXG5cbiAgICAjIyNcbiAgICBBbiBpbnRlcm5hbCBtZWNoYW5pc20gdG8gcmVwcmVzZW50IHRoZSBpbnN0YW5jZSBvZiB0aGlzIG5hbWVzcGFjZVxuICAgIEBjb25zdHJ1Y3RvclxuICAgIEBpbnRlcm5hbFxuICAgIEBtZW1iZXJPZiBtYWtlTmFtZVNwYWNlXG4gICAgIyMjXG4gICAgQ2xhc3MgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiBmdW5jdGlvbiAnICsgc3BhY2VuYW1lICsgJygpe30nKSgpXG4gICAgQ2xhc3M6OiA9IG5ldyBCYXNlKHNwYWNlbmFtZSlcblxuICAgICNDbGFzcy5wcm90b3R5cGUucGFyZW50ID0gQmFzZS5wcm90b3R5cGU7XG4gICAgbmV3IENsYXNzKHNwYWNlbmFtZSlcblxuICAjIyNcbiAgJ0RlcGVuZCcgYW4gT2JqZWN0IHVwb24gYW5vdGhlciBtZW1iZXIgb2YgdGhpcyBuYW1lc3BhY2UsIHVwb24gYW5vdGhlciBuYW1lc3BhY2UsXG4gIG9yIHVwb24gYSBtZW1iZXIgb2YgYW5vdGhlciBuYW1lc3BhY2VcbiAgIyMjXG4gIGRlcGVuZHNPbiA9IChkZXBlbmRlbmNpZXMsIGNhbGxCYWNrLCBpbXBvcnRzKSAtPlxuICAgICd1c2Ugc3RyaWN0J1xuICAgIHJldCA9IGZhbHNlXG4gICAgbnNNZW1iZXJzID0gbnNJbnRlcm5hbC5nZXROc01lbWJlcnMoKVxuICAgIGlmIGRlcGVuZGVuY2llcyBhbmQgZGVwZW5kZW5jaWVzLmxlbmd0aCA+IDAgYW5kIGNhbGxCYWNrXG4gICAgICBtaXNzaW5nID0gZGVwZW5kZW5jaWVzLmZpbHRlcigoZGVwZW4pIC0+XG4gICAgICAgIG5zTWVtYmVycy5pbmRleE9mKGRlcGVuKSBpcyAtMSBhbmQgKG5vdCBpbXBvcnRzIG9yIGltcG9ydHMgaXNudCBkZXBlbilcbiAgICAgIClcbiAgICAgIGlmIG1pc3NpbmcubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0ID0gdHJ1ZVxuICAgICAgICBjYWxsQmFjaygpXG4gICAgICBlbHNlXG4gICAgICAgIG5zSW50ZXJuYWwuZGVwZW5kZW50cy5wdXNoIChpbXBvcnRzKSAtPlxuICAgICAgICAgIGRlcGVuZHNPbiBtaXNzaW5nLCBjYWxsQmFjaywgaW1wb3J0c1xuXG4gICAgcmV0XG4gIG5zSW50ZXJuYWwgPSBkZXBlbmRlbnRzOiBbXVxuXG4gICMjI1xuICBGZXRjaGVzIHRoZSByZWdpc3RlcmVkIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgb24gdGhlIG5hbWVzcGFjZSBhbmQgaXRzIGNoaWxkIG5hbWVzcGFjZXNcbiAgIyMjXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBuc0ludGVybmFsLCAnZ2V0TnNNZW1iZXJzJyxcbiAgICB2YWx1ZTogLT5cbiAgICAgIHJlY3Vyc2VUcmVlID0gKGtleSwgbGFzdEtleSkgLT5cbiAgICAgICAgbWVtYmVycy5wdXNoIGxhc3RLZXkgKyAnLicgKyBrZXkgIGlmIHR5cGVvZiAoa2V5KSBpcyAnc3RyaW5nJ1xuICAgICAgICBpZiB1dGlsTGliLmlzUGxhaW5PYmplY3Qoa2V5KVxuICAgICAgICAgIE9iamVjdC5rZXlzKGtleSkuZm9yRWFjaCAoaykgLT5cbiAgICAgICAgICAgIG1lbWJlcnMucHVzaCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdHlwZW9mIChrKSBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgcmVjdXJzZVRyZWUga2V5W2tdLCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KGtleVtrXSlcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJldHVyblxuICAgICAgbWVtYmVycyA9IFtdXG4gICAgICBPYmplY3Qua2V5cyhOc1RyZWVbbmFtZVNwYWNlTmFtZV0pLmZvckVhY2ggKGtleSkgLT5cbiAgICAgICAgcmVjdXJzZVRyZWUgTnNUcmVlW25hbWVTcGFjZU5hbWVdW2tleV0sIG5hbWVTcGFjZU5hbWUgIGlmIHV0aWxMaWIuaXNQbGFpbk9iamVjdChOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG1lbWJlcnNcblxuICAjIyNcbiAgVG8gc3VwcG9ydCBkZXBlbmRlbmN5IG1hbmFnZW1lbnQsIHdoZW4gYSBwcm9wZXJ0eSBpcyBsaWZ0ZWQgb250byB0aGUgbmFtZXNwYWNlLCBub3RpZnkgZGVwZW5kZW50cyB0byBpbml0aWFsaXplXG4gICMjI1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnNJbnRlcm5hbCwgJ2FsZXJ0RGVwZW5kZW50cycsXG4gICAgdmFsdWU6IChpbXBvcnRzKSAtPlxuICAgICAgZGVwcyA9IG5zSW50ZXJuYWwuZGVwZW5kZW50cy5maWx0ZXIoKGRlcE9uKSAtPlxuICAgICAgICBmYWxzZSBpcyBkZXBPbihpbXBvcnRzKVxuICAgICAgKVxuICAgICAgbnNJbnRlcm5hbC5kZXBlbmRlbnRzID0gZGVwcyAgaWYgQXJyYXkuaXNBcnJheShkZXBzKVxuXG4gICNDcmVhdGUgdGhlIHJvb3Qgb2YgdGhlIHRyZWUgYXMgdGhlIGN1cnJlbnQgbmFtZXNwYWNlXG4gIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSA9IHt9XG4gICNEZWZpbmUgdGhlIGNvcmUgbmFtZXNwYWNlIGFuZCB0aGUgcmV0dXJuIG9mIHRoaXMgY2xhc3NcbiAgTnNPdXQgPSBtYWtlTmFtZVNwYWNlKG5hbWVTcGFjZU5hbWUsIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSlcblxuICAjIyNcbiAgQ2FjaGUgYSBoYW5kbGUgb24gdGhlIHZlbmRvciAocHJvYmFibHkgalF1ZXJ5KSBvbiB0aGUgcm9vdCBuYW1lc3BhY2VcbiAgIyMjXG4gIE5zT3V0LnJlZ2lzdGVyICc/JywgdXRpbExpYiwgZmFsc2VcblxuICAjIyNcbiAgQ2FjaGUgdGhlIHRyZWUgKHVzZWZ1bCBmb3IgZG9jdW1lbnRhdGlvbi92aXN1YWxpemF0aW9uL2RlYnVnZ2luZylcbiAgIyMjXG4gIE5zT3V0LnJlZ2lzdGVyICd0cmVlJywgTnNUcmVlW25hbWVTcGFjZU5hbWVdLCBmYWxzZVxuXG4gICMjI1xuICBDYWNoZSB0aGUgbmFtZSBzcGFjZSBuYW1lXG4gICMjI1xuICBOc091dC5yZWdpc3RlciAnbmFtZScsIG5hbWVTcGFjZU5hbWUsIGZhbHNlXG4gIE5zT3V0LnJlZ2lzdGVyICdkZXBlbmRzT24nLCBkZXBlbmRzT24sIGZhbHNlXG4gIE5zT3V0XG5cblxuIyMjXG5BY3R1YWxseSBkZWZpbmUgdGhlIE9KIE5hbWVTcGFjZVxuIyMjXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgdGhpc0dsb2JhbCwgbmFtZVNwYWNlTmFtZSxcbiAgdmFsdWU6IG1ha2VUaGVKdWljZSgpXG5cbk9KLnJlZ2lzdGVyICdnbG9iYWwnLCB0aGlzR2xvYmFsXG5cbnRoaXNEb2N1bWVudCA9IHt9XG5pZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xuICB0aGlzRG9jdW1lbnQgPSBkb2N1bWVudFxuXG5PSi5yZWdpc3RlciAnZG9jdW1lbnQnLCB0aGlzRG9jdW1lbnRcblxuT0oucmVnaXN0ZXIgJ25vb3AnLCAtPlxuXG5tb2R1bGUuZXhwb3J0cyA9IE9KIiwiICMgIyBPSiBQb3N0LUluaXRpYWxpemF0aW9uXHJcblxyXG5PSiA9IHJlcXVpcmUgJy4vb2onXHJcbl8gPSByZXF1aXJlICdsb2Rhc2gnXHJcblxyXG4jIFNpbXBsZSBhcnJheSBvZiBhbnRpY2lwYXRlZC9rbm93biBjaGlsZCBuYW1lc3BhY2VzXHJcbiAgXHJcbnN1Yk5hbWVTcGFjZXMgPSBbXHJcbiAgJ2Vycm9ycydcclxuICAnZW51bXMnXHJcbiAgJ2luc3RhbmNlT2YnXHJcbiAgJ25vZGVzJ1xyXG4gICdkYidcclxuICAnY29tcG9uZW50cydcclxuICAnY29udHJvbHMnXHJcbiAgJ2lucHV0cydcclxuICAnbm90aWZpY2F0aW9ucydcclxuICAnaGlzdG9yeSdcclxuICAnY29va2llJ1xyXG4gICdhc3luYydcclxuXVxyXG5cclxuIyAjIyBTdWJOYW1lU3BhY2VzXHJcblxyXG4jIFByZS1hbGxvY2F0ZSBjZXJ0YWluIGNvbW1vbiBuYW1lc3BhY2VzIHRvIGF2b2lkIGZ1dHVyZSByYWNlIGNvbmRpdGlvbnMuXHJcbiMgVGhpcyBkb2VzIHJlcXVpcmUgdGhhdCB0aGUgb3JkZXIgb2Ygb3BlcmF0aW9ucyBsb2FkcyBPSi5jb2ZmZWUgZmlyc3QgYW5kIG9KSW5pdC5jb2ZmZWUgc2Vjb25kXHJcbl8uZWFjaCBzdWJOYW1lU3BhY2VzLCAobmFtZSkgLT5cclxuICBPSi5tYWtlU3ViTmFtZVNwYWNlIG5hbWVcclxuICBcclxuIyAjIyBDb25maWd1cmF0aW9uIHZhcmlhYmxlc1xyXG5cclxuIyBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlIHVuaXF1ZSBJRHMgZm9yIGVhY2ggbm9kZSAoZGVmYXVsdCBmYWxzZSlcclxuT0pbJ0dFTkVSQVRFX1VOSVFVRV9JRFMnXSA9IGZhbHNlXHJcbiMgRGVmYXVsdCByb290IG5vZGUgZm9yIGNvbXBvbmVudHMvY29udHJvbHMgKGRlZmF1bHQgJ2RpdicpXHJcbk9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gPSAnZGl2J1xyXG4jIFdoZXRoZXIgdG8gaG9vayBpbnRvIHRoZSBnbG9iYWwgb24gZXJyb3IgZXZlbnQgdG8gd3JpdGUgZXJyb3JzIHRvIGNvbnNvbGUgKGRlZmF1bHQgZmFsc2UpXHJcbk9KWydUUkFDS19PTl9FUlJPUiddID0gZmFsc2VcclxuI1doZXRoZXIgdG8gbG9nIGFsbCBBSkFYIHJlcXVlc3RzXHJcbk9KWydMT0dfQUxMX0FKQVgnXSA9IGZhbHNlXHJcbiNXaGV0aGVyIHRvIGxvZyBhbGwgQUpBWCBlcnJvcnNcclxuT0pbJ0xPR19BTExfQUpBWF9FUlJPUlMnXSA9IGZhbHNlIiwiXHJcbiMjI1xyXG5SZXR1cm4ganVzdCB0aGUga2V5cyBmcm9tIHRoZSBpbnB1dCBhcnJheSwgb3B0aW9uYWxseSBvbmx5IGZvciB0aGUgc3BlY2lmaWVkIHNlYXJjaF92YWx1ZVxyXG52ZXJzaW9uOiAxMTA5LjIwMTVcclxuZGlzY3VzcyBhdDogaHR0cDovL3BocGpzLm9yZy9mdW5jdGlvbnMvYXJyYXlfa2V5c1xyXG4rICAgb3JpZ2luYWwgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0KVxyXG4rICAgICAgaW5wdXQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXHJcbisgICBidWdmaXhlZCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2tldmluLnZhbnpvbm5ldmVsZC5uZXQpXHJcbisgICBpbXByb3ZlZCBieTogamRcclxuKyAgIGltcHJvdmVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxyXG4rICAgaW5wdXQgYnk6IFBcclxuKyAgIGJ1Z2ZpeGVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxyXG5leGFtcGxlIDE6IGFycmF5X2tleXMoIHtmaXJzdG5hbWU6ICdLZXZpbicsIHN1cm5hbWU6ICd2YW4gWm9ubmV2ZWxkJ30gKTtcclxucmV0dXJucyAxOiB7MDogJ2ZpcnN0bmFtZScsIDE6ICdzdXJuYW1lJ31cclxuIyMjXHJcbmFycmF5X2tleXMgPSAoaW5wdXQsIHNlYXJjaF92YWx1ZSwgYXJnU3RyaWN0KSAtPlxyXG4gIHNlYXJjaCA9IHR5cGVvZiBzZWFyY2hfdmFsdWUgaXNudCBcInVuZGVmaW5lZFwiXHJcbiAgdG1wX2FyciA9IFtdXHJcbiAgc3RyaWN0ID0gISFhcmdTdHJpY3RcclxuICBpbmNsdWRlID0gdHJ1ZVxyXG4gIGtleSA9IFwiXCJcclxuICAjIER1Y2stdHlwZSBjaGVjayBmb3Igb3VyIG93biBhcnJheSgpLWNyZWF0ZWQgUEhQSlNfQXJyYXlcclxuICByZXR1cm4gaW5wdXQua2V5cyhzZWFyY2hfdmFsdWUsIGFyZ1N0cmljdCkgIGlmIGlucHV0IGFuZCB0eXBlb2YgaW5wdXQgaXMgXCJvYmplY3RcIiBhbmQgaW5wdXQuY2hhbmdlX2tleV9jYXNlXHJcbiAgZm9yIGtleSBvZiBpbnB1dFxyXG4gICAgaWYgaW5wdXQuaGFzT3duUHJvcGVydHkoa2V5KVxyXG4gICAgICBpbmNsdWRlID0gdHJ1ZVxyXG4gICAgICBpZiBzZWFyY2hcclxuICAgICAgICBpZiBzdHJpY3QgYW5kIGlucHV0W2tleV0gaXNudCBzZWFyY2hfdmFsdWVcclxuICAgICAgICAgIGluY2x1ZGUgPSBmYWxzZVxyXG4gICAgICAgIGVsc2UgaW5jbHVkZSA9IGZhbHNlICB1bmxlc3MgaW5wdXRba2V5XSBpcyBzZWFyY2hfdmFsdWVcclxuICAgICAgdG1wX2Fyclt0bXBfYXJyLmxlbmd0aF0gPSBrZXkgIGlmIGluY2x1ZGVcclxuICB0bXBfYXJyXHJcblxyXG4jIyMqXHJcbkNvbnZlcnQgYSBKYXZhc2NyaXB0IE9qZWN0IGFycmF5IG9yIFN0cmluZyBhcnJheSB0byBhbiBIVE1MIHRhYmxlXHJcbkpTT04gcGFyc2luZyBoYXMgdG8gYmUgbWFkZSBiZWZvcmUgZnVuY3Rpb24gY2FsbFxyXG5JdCBhbGxvd3MgdXNlIG9mIG90aGVyIEpTT04gcGFyc2luZyBtZXRob2RzIGxpa2UgalF1ZXJ5LnBhcnNlSlNPTlxyXG5odHRwKHMpOi8vLCBmdHA6Ly8sIGZpbGU6Ly8gYW5kIGphdmFzY3JpcHQ6OyBsaW5rcyBhcmUgYXV0b21hdGljYWxseSBjb21wdXRlZFxyXG5cclxuSlNPTiBkYXRhIHNhbXBsZXMgdGhhdCBzaG91bGQgYmUgcGFyc2VkIGFuZCB0aGVuIGNhbiBiZSBjb252ZXJ0ZWQgdG8gYW4gSFRNTCB0YWJsZVxyXG52YXIgb2JqZWN0QXJyYXkgPSAnW3tcIlRvdGFsXCI6XCIzNFwiLFwiVmVyc2lvblwiOlwiMS4wLjRcIixcIk9mZmljZVwiOlwiTmV3IFlvcmtcIn0se1wiVG90YWxcIjpcIjY3XCIsXCJWZXJzaW9uXCI6XCIxLjEuMFwiLFwiT2ZmaWNlXCI6XCJQYXJpc1wifV0nO1xyXG52YXIgc3RyaW5nQXJyYXkgPSAnW1wiTmV3IFlvcmtcIixcIkJlcmxpblwiLFwiUGFyaXNcIixcIk1hcnJha2VjaFwiLFwiTW9zY293XCJdJztcclxudmFyIG5lc3RlZFRhYmxlID0gJ1t7IGtleTE6IFwidmFsMVwiLCBrZXkyOiBcInZhbDJcIiwga2V5MzogeyB0YWJsZUlkOiBcInRibElkTmVzdGVkMVwiLCB0YWJsZUNsYXNzTmFtZTogXCJjbHNOZXN0ZWRcIiwgbGlua1RleHQ6IFwiRG93bmxvYWRcIiwgZGF0YTogW3sgc3Via2V5MTogXCJzdWJ2YWwxXCIsIHN1YmtleTI6IFwic3VidmFsMlwiLCBzdWJrZXkzOiBcInN1YnZhbDNcIiB9XSB9IH1dJztcclxuXHJcbkNvZGUgc2FtcGxlIHRvIGNyZWF0ZSBhIEhUTUwgdGFibGUgSmF2YXNjcmlwdCBTdHJpbmdcclxudmFyIGpzb25IdG1sVGFibGUgPSBDb252ZXJ0SnNvblRvVGFibGUoZXZhbChkYXRhU3RyaW5nKSwgJ2pzb25UYWJsZScsIG51bGwsICdEb3dubG9hZCcpO1xyXG5cclxuQ29kZSBzYW1wbGUgZXhwbGFuZWRcclxuLSBldmFsIGlzIHVzZWQgdG8gcGFyc2UgYSBKU09OIGRhdGFTdHJpbmdcclxuLSB0YWJsZSBIVE1MIGlkIGF0dHJpYnV0ZSB3aWxsIGJlICdqc29uVGFibGUnXHJcbi0gdGFibGUgSFRNTCBjbGFzcyBhdHRyaWJ1dGUgd2lsbCBub3QgYmUgYWRkZWRcclxuLSAnRG93bmxvYWQnIHRleHQgd2lsbCBiZSBkaXNwbGF5ZWQgaW5zdGVhZCBvZiB0aGUgbGluayBpdHNlbGZcclxuXHJcbkBhdXRob3IgQWZzaGluIE1laHJhYmFuaSA8YWZzaGluIGRvdCBtZWggYXQgZ21haWwgZG90IGNvbT5cclxuXHJcbkBjbGFzcyBDb252ZXJ0SnNvblRvVGFibGVcclxuXHJcbkBtZXRob2QgQ29udmVydEpzb25Ub1RhYmxlXHJcblxyXG5AcGFyYW0gcGFyc2VkSnNvbiBvYmplY3QgUGFyc2VkIEpTT04gZGF0YVxyXG5AcGFyYW0gdGFibGVJZCBzdHJpbmcgT3B0aW9uYWwgdGFibGUgaWRcclxuQHBhcmFtIHRhYmxlQ2xhc3NOYW1lIHN0cmluZyBPcHRpb25hbCB0YWJsZSBjc3MgY2xhc3MgbmFtZVxyXG5AcGFyYW0gbGlua1RleHQgc3RyaW5nIE9wdGlvbmFsIHRleHQgcmVwbGFjZW1lbnQgZm9yIGxpbmsgcGF0dGVyblxyXG5cclxuQHJldHVybiBzdHJpbmcgQ29udmVydGVkIEpTT04gdG8gSFRNTCB0YWJsZVxyXG4jIyNcclxuY2xhc3MgSnNvblRvVGFibGUgXHJcbiAgXHJcbiAgdGFibGU6IG51bGxcclxuICBcclxuICBjb25zdHJ1Y3RvcjogKHBhcnNlZEpzb24sIHRhYmxlSWQsIHRhYmxlQ2xhc3NOYW1lLCBsaW5rVGV4dCkgLT5cclxuICAgICNQYXR0ZXJucyBmb3IgbGlua3MgYW5kIE5VTEwgdmFsdWVcclxuICAgIGl0YWxpYyA9IFwiPGk+ezB9PC9pPlwiXHJcbiAgICBsaW5rID0gKGlmIGxpbmtUZXh0IHRoZW4gXCI8YSBocmVmPVxcXCJ7MH1cXFwiPlwiICsgbGlua1RleHQgKyBcIjwvYT5cIiBlbHNlIFwiPGEgaHJlZj1cXFwiezB9XFxcIj57MH08L2E+XCIpXHJcbiAgXHJcbiAgICAjUGF0dGVybiBmb3IgdGFibGUgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgaWRNYXJrdXAgPSAoaWYgdGFibGVJZCB0aGVuIFwiIGlkPVxcXCJcIiArIHRhYmxlSWQgKyBcIlxcXCJcIiBlbHNlIFwiXCIpXHJcbiAgICBjbGFzc01hcmt1cCA9IChpZiB0YWJsZUNsYXNzTmFtZSB0aGVuIFwiIGNsYXNzPVxcXCJcIiArIHRhYmxlQ2xhc3NOYW1lICsgXCJcXFwiXCIgZWxzZSBcIlwiKVxyXG4gICAgdGJsID0gXCI8dGFibGUgYm9yZGVyPVxcXCIxXFxcIiBjZWxscGFkZGluZz1cXFwiMVxcXCIgY2VsbHNwYWNpbmc9XFxcIjFcXFwiXCIgKyBpZE1hcmt1cCArIGNsYXNzTWFya3VwICsgXCI+ezB9ezF9PC90YWJsZT5cIlxyXG4gIFxyXG4gICAgI1BhdHRlcm5zIGZvciB0YWJsZSBjb250ZW50XHJcbiAgICB0aCA9IFwiPHRoZWFkPnswfTwvdGhlYWQ+XCJcclxuICAgIHRiID0gXCI8dGJvZHk+ezB9PC90Ym9keT5cIlxyXG4gICAgdHIgPSBcIjx0cj57MH08L3RyPlwiXHJcbiAgICB0aFJvdyA9IFwiPHRoPnswfTwvdGg+XCJcclxuICAgIHRkUm93ID0gXCI8dGQ+ezB9PC90ZD5cIlxyXG4gICAgdGhDb24gPSBcIlwiXHJcbiAgICB0YkNvbiA9IFwiXCJcclxuICAgIHRyQ29uID0gXCJcIlxyXG4gICAgaWYgcGFyc2VkSnNvblxyXG4gICAgICBpc1N0cmluZ0FycmF5ID0gdHlwZW9mIChwYXJzZWRKc29uWzBdKSBpcyBcInN0cmluZ1wiXHJcbiAgICAgIGhlYWRlcnMgPSB1bmRlZmluZWRcclxuICAgIFxyXG4gICAgICAjIENyZWF0ZSB0YWJsZSBoZWFkZXJzIGZyb20gSlNPTiBkYXRhXHJcbiAgICAgICMgSWYgSlNPTiBkYXRhIGlzIGEgc2ltcGxlIHN0cmluZyBhcnJheSB3ZSBjcmVhdGUgYSBzaW5nbGUgdGFibGUgaGVhZGVyXHJcbiAgICAgIGlmIGlzU3RyaW5nQXJyYXlcclxuICAgICAgICB0aENvbiArPSB0aFJvdy5mb3JtYXQoXCJ2YWx1ZVwiKVxyXG4gICAgICBlbHNlXHJcbiAgICAgIFxyXG4gICAgICAgICMgSWYgSlNPTiBkYXRhIGlzIGFuIG9iamVjdCBhcnJheSwgaGVhZGVycyBhcmUgYXV0b21hdGljYWxseSBjb21wdXRlZFxyXG4gICAgICAgIGlmIHR5cGVvZiAocGFyc2VkSnNvblswXSkgaXMgXCJvYmplY3RcIlxyXG4gICAgICAgICAgaGVhZGVycyA9IGFycmF5X2tleXMocGFyc2VkSnNvblswXSlcclxuICAgICAgICAgIGkgPSAwXHJcbiAgICAgICAgICB3aGlsZSBpIDwgaGVhZGVycy5sZW5ndGhcclxuICAgICAgICAgICAgdGhDb24gKz0gdGhSb3cuZm9ybWF0KGhlYWRlcnNbaV0pXHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICB0aCA9IHRoLmZvcm1hdCh0ci5mb3JtYXQodGhDb24pKVxyXG4gICAgXHJcbiAgICAgICMgQ3JlYXRlIHRhYmxlIHJvd3MgZnJvbSBKc29uIGRhdGFcclxuICAgICAgaWYgaXNTdHJpbmdBcnJheVxyXG4gICAgICAgIGkgPSAwXHJcbiAgICAgICAgd2hpbGUgaSA8IHBhcnNlZEpzb24ubGVuZ3RoXHJcbiAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQocGFyc2VkSnNvbltpXSlcclxuICAgICAgICAgIHRyQ29uICs9IHRyLmZvcm1hdCh0YkNvbilcclxuICAgICAgICAgIHRiQ29uID0gXCJcIlxyXG4gICAgICAgICAgaSsrXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBpZiBoZWFkZXJzXHJcbiAgICAgICAgICB1cmxSZWdFeHAgPSBuZXcgUmVnRXhwKC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvZylcclxuICAgICAgICAgIGphdmFzY3JpcHRSZWdFeHAgPSBuZXcgUmVnRXhwKC8oXmphdmFzY3JpcHQ6W1xcc1xcU10qOyQpL2cpXHJcbiAgICAgICAgICBpID0gMFxyXG4gICAgICAgICAgd2hpbGUgaSA8IHBhcnNlZEpzb24ubGVuZ3RoXHJcbiAgICAgICAgICAgIGogPSAwXHJcbiAgICAgICAgICAgIHdoaWxlIGogPCBoZWFkZXJzLmxlbmd0aFxyXG4gICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VkSnNvbltpXVtoZWFkZXJzW2pdXVxyXG4gICAgICAgICAgICAgIGlzVXJsID0gdXJsUmVnRXhwLnRlc3QodmFsdWUpIG9yIGphdmFzY3JpcHRSZWdFeHAudGVzdCh2YWx1ZSlcclxuICAgICAgICAgICAgICBpZiBpc1VybCAjIElmIHZhbHVlIGlzIFVSTCB3ZSBhdXRvLWNyZWF0ZSBhIGxpbmtcclxuICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChsaW5rLmZvcm1hdCh2YWx1ZSkpXHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgaWYgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgaWYgdHlwZW9mICh2YWx1ZSkgaXMgXCJvYmplY3RcIlxyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAjZm9yIHN1cHBvcnRpbmcgbmVzdGVkIHRhYmxlc1xyXG4gICAgICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChDb252ZXJ0SnNvblRvVGFibGUoZXZhbCh2YWx1ZS5kYXRhKSwgdmFsdWUudGFibGVJZCwgdmFsdWUudGFibGVDbGFzc05hbWUsIHZhbHVlLmxpbmtUZXh0KSlcclxuICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdCh2YWx1ZSlcclxuICAgICAgICAgICAgICAgIGVsc2UgIyBJZiB2YWx1ZSA9PSBudWxsIHdlIGZvcm1hdCBpdCBsaWtlIFBocE15QWRtaW4gTlVMTCB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KGl0YWxpYy5mb3JtYXQodmFsdWUpLnRvVXBwZXJDYXNlKCkpXHJcbiAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgIHRyQ29uICs9IHRyLmZvcm1hdCh0YkNvbilcclxuICAgICAgICAgICAgdGJDb24gPSBcIlwiXHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICB0YiA9IHRiLmZvcm1hdCh0ckNvbilcclxuICAgICAgdGJsID0gdGJsLmZvcm1hdCh0aCwgdGIpXHJcbiAgICBAdGFibGUgPSB0YmxcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSnNvblRvVGFibGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5hcnJheTJEID0gKGluaXRMZW5ndGgsIGluaXRXaWR0aCkgLT5cclxuICBhcnJheSA9IFtdXHJcbiAgbWF4TGVuZ3RoID0gMFxyXG4gIG1heFdpZHRoID0gMFxyXG4gICAgXHJcbiAgcmV0ID0gXHJcbiAgICBnZXQ6IChyb3dObywgY29sTm8pIC0+XHJcbiAgICAgIGV4dGVuZCByb3dObywgY29sTm9cclxuICAgIHNldDogKHJvd05vLCBjb2xObywgdmFsKSAtPlxyXG4gICAgICByZXQuZ2V0IHJvd05vLCBjb2xOb1xyXG4gICAgICByb3dJZHggPSByb3dOby0xXHJcbiAgICAgIGNvbElkeCA9IGNvbE5vLTFcclxuICAgICAgYXJyYXlbcm93SWR4XVtjb2xJZHhdID0gdmFsXHJcbiAgICBlYWNoOiAoY2FsbEJhY2spIC0+XHJcbiAgICAgIF8uZWFjaCBhcnJheSwgKGNvbHVtbnMsIHJvdykgLT5cclxuICAgICAgICBfLmVhY2ggYXJyYXlbcm93XSwgKHZhbCwgY29sKSAtPlxyXG4gICAgICAgICAgcm93SWR4ID0gcm93KzFcclxuICAgICAgICAgIGNvbElkeCA9IGNvbCsxXHJcbiAgICAgICAgICBjYWxsQmFjayByb3dJZHgsIGNvbElkeCwgdmFsXHJcbiAgICB3aWR0aDogKCkgLT5cclxuICAgICAgbWF4V2lkdGhcclxuICAgIGxlbmd0aDogKCkgLT5cclxuICAgICAgbWF4TGVuZ3RoXHJcbiAgICAgICAgIFxyXG4gICMjI1xyXG4gIEd1YXJhbnRlZSB0aGF0IHRoZSBkaW1lbnNpb25zIG9mIHRoZSBhcnJheSBhcmUgYWx3YXlzIGJhY2tlZCBieSB2YWx1ZXMgYXQgZXZlcnkgcG9zaXRpb25cclxuICAjIyMgICAgICAgICAgICAgICAgICAgIFxyXG4gIGV4dGVuZCA9IChsZW5ndGgsIHdpZHRoKSAtPiAgXHJcbiAgICBpZiBub3QgbGVuZ3RoIG9yIGxlbmd0aCA8IDEgdGhlbiBsZW5ndGggPSAxXHJcbiAgICBpZiBub3Qgd2lkdGggb3Igd2lkdGggPCAxIHRoZW4gd2lkdGggPSAxXHJcbiAgICAgIFxyXG4gICAgaWYgbWF4TGVuZ3RoIDwgbGVuZ3RoIHRoZW4gbWF4TGVuZ3RoID0gbGVuZ3RoXHJcbiAgICBpZiBhcnJheS5sZW5ndGggPiBtYXhMZW5ndGggdGhlbiBtYXhMZW5ndGggPSBhcnJheS5sZW5ndGhcclxuICAgIGlmIG1heFdpZHRoIDwgd2lkdGggdGhlbiBtYXhXaWR0aCA9IHdpZHRoXHJcbiAgICBpID0gMFxyXG4gICAgICBcclxuICAgIHdoaWxlIGkgPCBtYXhMZW5ndGhcclxuICAgICAgdHJ5Um93ID0gYXJyYXlbaV1cclxuICAgICAgaWYgbm90IHRyeVJvd1xyXG4gICAgICAgIHRyeVJvdyA9IFtdXHJcbiAgICAgICAgYXJyYXkucHVzaCB0cnlSb3dcclxuICAgICAgaWYgbWF4V2lkdGggPCB0cnlSb3cubGVuZ3RoIHRoZW4gbWF4V2lkdGggPSB0cnlSb3cubGVuZ3RoXHJcbiAgICAgIGlmIHRyeVJvdy5sZW5ndGggPCBtYXhXaWR0aCB0aGVuIHRyeVJvdy5sZW5ndGggPSBtYXhXaWR0aFxyXG4gICAgICBpICs9IDFcclxuICAgICAgXHJcbiAgICBhcnJheVtsZW5ndGgtMV1bd2lkdGgtMV1cclxuICAgICAgIFxyXG4gIGV4dGVuZCBpbml0TGVuZ3RoLCBpbml0V2lkdGhcclxuICAgIFxyXG4gIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ2FycmF5MkQnLCBhcnJheTJEXHJcbm1vZHVsZS5leHBvcnRzID0gYXJyYXkyRCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbm1ldGhvZHMgPSBbXHJcbiAgJ2Fzc2VydCdcclxuICAnY2xlYXInXHJcbiAgJ2NvdW50J1xyXG4gICdkZWJ1ZydcclxuICAnZGlyJ1xyXG4gICdkaXJ4bWwnXHJcbiAgJ2Vycm9yJ1xyXG4gICdleGNlcHRpb24nXHJcbiAgJ2dyb3VwJ1xyXG4gICdncm91cENvbGxhcHNlZCdcclxuICAnZ3JvdXBFbmQnXHJcbiAgJ2luZm8nXHJcbiAgJ2xvZydcclxuICAnbWVtb3J5J1xyXG4gICdwcm9maWxlJ1xyXG4gICdwcm9maWxlRW5kJ1xyXG4gICd0YWJsZSdcclxuICAndGltZSdcclxuICAndGltZUVuZCdcclxuICAndGltZVN0YW1wJ1xyXG4gICd0aW1lbGluZSdcclxuICAndGltZWxpbmVFbmQnXHJcbiAgJ3RyYWNlJ1xyXG4gICd3YXJuJ1xyXG5dXHJcbm1ldGhvZExlbmd0aCA9IG1ldGhvZHMubGVuZ3RoXHJcbmNvbnNvbGUgPSBPSi5nbG9iYWwuY29uc29sZSBvciB7fVxyXG5PSi5tYWtlU3ViTmFtZVNwYWNlICdjb25zb2xlJ1xyXG4gIFxyXG4jIyNcclxuMS4gU3R1YiBvdXQgYW55IG1pc3NpbmcgbWV0aG9kcyB3aXRoIG5vb3BcclxuMi4gRGVmaW5lIHRoZSBhdmFpbGFibGUgbWV0aG9kcyBvbiB0aGUgT0ouY29uc29sZSBvYmplY3RcclxuIyMjXHJcbndoaWxlIG1ldGhvZExlbmd0aC0tXHJcbiAgKC0+XHJcbiAgICBtZXRob2QgPSBtZXRob2RzW21ldGhvZExlbmd0aF1cclxuICAgIFxyXG4gICAgIyBPbmx5IHN0dWIgdW5kZWZpbmVkIG1ldGhvZHMuXHJcbiAgICBjb25zb2xlW21ldGhvZF0gPSBPSi5ub29wIHVubGVzcyBjb25zb2xlW21ldGhvZF1cclxuICAgIFxyXG4gICAgI0RlZmluZSB0aGUgbWV0aG9kIG9uIHRoZSBPSiBjb25zb2xlIG5hbWVzcGFjZVxyXG4gICAgT0ouY29uc29sZS5yZWdpc3RlciBtZXRob2QsIChwYXJhbXMuLi4pIC0+XHJcbiAgICAgIGNvbnNvbGVbbWV0aG9kXSBwYXJhbXMuLi5cclxuICApKClcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY29uc29sZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiQgPSByZXF1aXJlICdqcXVlcnknXHJcbiAgXHJcbiMjI1xyXG5TZXR1cCBzZXR0aW5nc1xyXG4kLmNvb2tpZS5yYXcgPSB0cnVlXHJcbiQuY29va2llLmpzb24gPSB0cnVlXHJcbiAgXHJcblNldHVwIGRlZmF1bHRzXHJcbmh0dHBzOi8vZ2l0aHViLmNvbS9jYXJoYXJ0bC9qcXVlcnktY29va2llL1xyXG4kLmNvb2tpZS5kZWZhdWx0cy5leHBpcmVzID0gMzY1XHJcbiQuY29va2llLmRlZmF1bHRzLnBhdGggPSAnLydcclxuJC5jb29raWUuZGVmYXVsdHMuZG9tYWluID0gJ29qLmNvbSdcclxuIyMjXHJcbmlmIG5vdCAkIG9yIG5vdCAkLmNvb2tpZVxyXG4gIHRocm93IG5ldyBFcnJvciAnalF1ZXJ5IENvb2tpZSBpcyBhIHJlcXVpcmVkIGRlcGVuZGVuY3kuJyAgXHJcbiQuY29va2llLmRlZmF1bHRzLnNlY3VyZSA9IGZhbHNlXHJcbiAgXHJcbmNvb2tpZXMgPSB7fVxyXG4gIFxyXG5nZXQgPSAoY29va2llTmFtZSwgdHlwZSkgLT5cclxuICByZXQgPSAnJ1xyXG4gIGlmIGNvb2tpZU5hbWVcclxuICAgIGlmIHR5cGVcclxuICAgICAgcmV0ID0gJC5jb29raWUgY29va2llTmFtZSwgdHlwZVxyXG4gICAgZWxzZVxyXG4gICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lICAgIFxyXG4gICAgaWYgcmV0XHJcbiAgICAgIGNvb2tpZXNbY29va2llTmFtZV0gPSByZXRcclxuICBcclxuYWxsID0gLT5cclxuICByZXQgPSAkLmNvb2tpZSgpXHJcbiAgcmV0XHJcbiAgICBcclxuc2V0ID0gKGNvb2tpZU5hbWUsIHZhbHVlLCBvcHRzKSAtPlxyXG4gIHJldCA9ICcnXHJcbiAgaWYgY29va2llTmFtZVxyXG4gICAgY29va2llc1tjb29raWVOYW1lXSA9IHZhbHVlXHJcbiAgICBpZiBvcHRzXHJcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHZhbHVlLCBvcHRzXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHZhbHVlXHJcbiAgcmV0ICBcclxuICBcclxuZGVsID0gKGNvb2tpZU5hbWUsIG9wdHMpIC0+XHJcbiAgaWYgY29va2llTmFtZVxyXG4gICAgaWYgb3B0c1xyXG4gICAgICAkLnJlbW92ZUNvb2tpZSBjb29raWVOYW1lLCBvcHRzXHJcbiAgICBlbHNlXHJcbiAgICAgICQucmVtb3ZlQ29va2llIGNvb2tpZU5hbWUgICAgXHJcbiAgICBkZWxldGUgY29va2llc1tjb29raWVOYW1lXVxyXG4gIHJldHVyblxyXG4gICAgXHJcbmRlbGV0ZUFsbCA9IC0+XHJcbiAgY29va2llcyA9IHt9XHJcbiAgT0ouZWFjaCBPSi5jb29raWUuYWxsLCAodmFsLCBrZXkpIC0+XHJcbiAgICBPSi5jb29raWUuZGVsZXRlIGtleSAgXHJcbiAgcmV0dXJuXHJcbiAgICBcclxuIE9KLmNvb2tpZS5yZWdpc3RlciAnZGVsZXRlQWxsJywgZGVsZXRlQWxsXHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2RlbGV0ZScsIGRlbFxyXG4gT0ouY29va2llLnJlZ2lzdGVyICdzZXQnLCBzZXRcclxuIE9KLmNvb2tpZS5yZWdpc3RlciAnZ2V0JywgZ2V0XHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2FsbCcsICBhbGxcclxuIFxyXG4gbW9kdWxlLmV4cG9ydHMgPSBcclxuICBkZWxldGVBbGw6IGRlbGV0ZUFsbFxyXG4gIGRlbGV0ZTogZGVsXHJcbiAgc2V0OiBzZXRcclxuICBnZXQ6IGdldFxyXG4gIGFsbDogIGFsbCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmRlZmVyID0gKG1ldGhvZCwgd2FpdE1zKSAtPlxyXG4gIGlmIHNldFRpbWVvdXRcclxuICAgIHJldHVybiBzZXRUaW1lb3V0IG1ldGhvZCwgd2FpdE1zXHJcbiAgXHJcbk9KLnJlZ2lzdGVyICdkZWZlcicsIGRlZmVyXHJcbm1vZHVsZS5leHBvcnRzID0gZGVmZXIiLCIjICMgZWFjaFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMgIyMgY2FuRWFjaFxyXG5jYW5FYWNoID0gKG9iaikgLT5cclxuICAjIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgW2lzXShpcy5odG1sKSB0cnVseSBpdGVyYWJsZSAoZS5nLiBhbiBpbnN0YW5jZSBvZiBPYmplY3Qgb3IgQXJyYXkpXHJcbiAgT0ouaXMucGxhaW5PYmplY3Qob2JqKSBvciBPSi5pcy5vYmplY3Qob2JqKSBvciBPSi5pcy5hcnJheSBvYmpcclxuXHJcbiMgIyMgW09KXShvai5odG1sKS5lYWNoXHJcblxyXG4jIEl0ZXJhdGUgYWxsIG9mIHRoZSBtZW1iZXJzIG9mIGFuIG9iamVjdCAob3IgYW4gYXJyYXkpIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYW5kIHJlY3Vyc2lvbi5cclxuXHJcbiMgLSBgb2JqYDogdGhlIG9iamVjdCB0byBpdGVyYXRlLFxyXG4jIC0gYG9uRWFjaGA6IGEgY2FsbGJhY2sgdG8gZXhlY3V0ZSBmb3IgZWFjaCBpdGVyYXRpb24sXHJcbiMgLSBgcmVjdXJzaXZlYDogaWYgdHJ1ZSwgcmVjdXJzaXZlbHkgaXRlcmF0ZSBhbGwgdmFsaWQgY2hpbGQgb2JqZWN0cy5cclxuZWFjaCA9IChvYmosIG9uRWFjaCwgcmVjdXJzaXZlKSAtPlxyXG4gIGlmIGNhbkVhY2ggb2JqXHJcbiAgICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI2Zvcm93bikncyBgZm9yT3duYCBtZXRob2QgdG8gZW5zdXJlIHRoYXQgb25seSB0aGUgYWN0dWFsIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdCBhcmUgZW51bWVyYXRlZC5cclxuXHJcbiAgICAjIC0gYG9uRWFjaGAgY2FsbGJhY2sgd2lsbCByZWNlaXZlIDIgcGFyYW1ldGVyczpcclxuICAgICMgLSBgdmFsYCBhbmQgYGtleWAuXHJcbiAgICAjIC0gYHZhbGAgaXMgYWx3YXlzIHRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuXHJcbiAgICAjIC0gYGtleWAgaXMgZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBvciB0aGUgY3VycmVudCBpbmRleCBvZiB0aGUgYXJyYXkuXHJcbiAgICBfLmZvck93biBvYmosICh2YWwsIGtleSkgLT5cclxuICAgICAgaWYgb25FYWNoIGFuZCAodmFsIG9yIGtleSlcclxuICAgICAgICBxdWl0ID0gb25FYWNoIHZhbCwga2V5XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlICBpZiBmYWxzZSBpcyBxdWl0XHJcbiAgICAgIGVhY2ggdmFsLCBvbkVhY2gsIHRydWUgIGlmIHRydWUgaXMgcmVjdXJzaXZlXHJcbiAgICAgIHJldHVyblxyXG5cclxuICByZXR1cm5cclxuXHJcbiMgIyMgcmVnaXN0ZXJcclxuXHJcbiMgcmVnaXN0ZXIgdGhlIGBlYWNoYCBtZXRob2Qgb24gdGhlIFtPSl0oT0ouaHRtbCkgbmFtZXNwYWNlXHJcbk9KLnJlZ2lzdGVyICdlYWNoJywgZWFjaFxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhY2giLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG51bmtub3duID0gJ3Vua25vd24nICAgXHJcbiAgXHJcbmlucHV0VHlwZXMgPVxyXG4gIGJ1dHRvbjogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAwXHJcbiAgICBuYW1lOiAnYnV0dG9uJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBjaGVja2JveDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxXHJcbiAgICBuYW1lOiAnY2hlY2tib3gnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgY29sb3I6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMlxyXG4gICAgbmFtZTogJ2NvbG9yJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGRhdGU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogM1xyXG4gICAgbmFtZTogJ2RhdGUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBkYXRldGltZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA0XHJcbiAgICBuYW1lOiAnZGF0ZXRpbWUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgJ2RhdGV0aW1lLWxvY2FsJzogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA1XHJcbiAgICBuYW1lOiAnZGF0ZXRpbWUtbG9jYWwnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBlbWFpbDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA2XHJcbiAgICBuYW1lOiAnZW1haWwnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGZpbGU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogN1xyXG4gICAgbmFtZTogJ2ZpbGUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogZmFsc2VcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBoaWRkZW46ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogOFxyXG4gICAgbmFtZTogJ2hpZGRlbidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgaW1hZ2U6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogOVxyXG4gICAgbmFtZTogJ2ltYWdlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBtb250aDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxMFxyXG4gICAgbmFtZTogJ21vbnRoJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBudW1iZXI6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTFcclxuICAgIG5hbWU6ICdudW1iZXInXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcGFzc3dvcmQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTJcclxuICAgIG5hbWU6ICdwYXNzd29yZCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHJhZGlvOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDEzXHJcbiAgICBuYW1lOiAncmFkaW8nXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcmFuZ2U6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTRcclxuICAgIG5hbWU6ICdyYW5nZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICByZXNldDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxNVxyXG4gICAgbmFtZTogJ3Jlc2V0J1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBzZWFyY2g6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTZcclxuICAgIG5hbWU6ICdzZWFyY2gnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBzdWJtaXQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTdcclxuICAgIG5hbWU6ICdzdWJtaXQnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHRlbDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxOFxyXG4gICAgbmFtZTogJ2J1dHRvbidcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHRleHQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTlcclxuICAgIG5hbWU6ICd0ZXh0J1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB0aW1lOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDIwXHJcbiAgICBuYW1lOiAndGltZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHVybDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMVxyXG4gICAgbmFtZTogJ3VybCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgd2VlazogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMlxyXG4gICAgbmFtZTogJ3dlZWsnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG5PSi5lbnVtcy5yZWdpc3RlciAndW5rbm93bicsIHVua25vd25cclxuT0ouZW51bXMucmVnaXN0ZXIgJ2lucHV0VHlwZXMnLCBpbnB1dFR5cGVzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFxyXG4gIHVua25vd246IHVua25vd25cclxuICBpbnB1dFR5cGVzOiBpbnB1dFR5cGVzIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuaWYgT0ouVFJBQ0tfT05fRVJST1JcclxuICBvbkVycm9yID0gT0ouZ2xvYmFsLm9uZXJyb3JcclxuXHJcbiAgIyMjXHJcbiAgTG9nIGVycm9ycyB0byB0aGUgY29uc29sZVxyXG4gICMjI1xyXG4gIE9KLmdsb2JhbC5vbmVycm9yID0gKG1zZywgdXJsLCBsaW5lTnVtYmVyKSAtPlxyXG4gICAgcmV0ID0gZmFsc2VcclxuICAgIE9KLmNvbnNvbGUud2FybiBcIiVzXFxyIHVybDogJXNcXHIgbGluZTogJWRcIiwgbXNnLCB1cmwsIGxpbmVOdW1iZXJcclxuICAgIHJldCA9IG9uRXJyb3IgbXNnLCB1cmwsIGxpbmVOdW1iZXIgaWYgb25FcnJvclxyXG4gICAgcmV0ICN0cnVlIG1lYW5zIGRvbid0IHByb3BhZ2F0ZSB0aGUgZXJyb3IgIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbmlmIE9KLmdsb2JhbC5hZGRFdmVudExpc3RlbmVyXHJcbiAgZXZlbnROYW1lID0gJ2FkZEV2ZW50TGlzdGVuZXInXHJcbiAgZXZlbnRJbmZvID0gJydcclxuZWxzZSBcclxuICBldmVudE5hbWUgPSAnYXR0YWNoRXZlbnQnXHJcbiAgZXZlbnRJbmZvID0gJ29uJ1xyXG4gIFxyXG5wdXNoU3RhdGUgPSAocGFnZU5hbWUsIGV2ZW50KSAtPlxyXG4gIGlmIHBhZ2VOYW1lXHJcbiAgICAjIGtlZXAgdGhlIGxpbmsgaW4gdGhlIGJyb3dzZXIgaGlzdG9yeVxyXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUgbnVsbCwgbnVsbCwgJyMnICsgcGFnZU5hbWVcclxuICAgICAgXHJcbiAgICAjIGhlcmUgY2FuIGNhdXNlIGRhdGEgbG9hZGluZywgZXRjLlxyXG4gICAgXHJcbiAgICBpZiBldmVudCAgICBcclxuICAgICAgIyBkbyBub3QgZ2l2ZSBhIGRlZmF1bHQgYWN0aW9uXHJcbiAgICAgIGlmIGV2ZW50LnByZXZlbnREZWZhdWx0XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZVxyXG4gIGZhbHNlXHJcbiAgXHJcbnJlc3RvcmVTdGF0ZSA9IChsb2NhdGlvbikgLT5cclxuICBwYWdlTmFtZSA9IGxvY2F0aW9uLmhhc2hcclxuICBpZiBub3QgcGFnZU5hbWVcclxuICAgIHBhZ2VOYW1lID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzFdXHJcbiAgaWYgcGFnZU5hbWVcclxuICAgIHBhZ2VOYW1lID0gcGFnZU5hbWUucmVwbGFjZSAnIycsICcnXHJcbiAgICBPSi5wdWJsaXNoICdyZXN0b3JlU3RhdGUnLCBwYWdlTmFtZTogcGFnZU5hbWUsIGxvY2F0aW9uOiBsb2NhdGlvblxyXG4gIHJldHVyblxyXG4gIFxyXG4jIyMgXHJcbmhhbmcgb24gdGhlIGV2ZW50LCBhbGwgcmVmZXJlbmNlcyBpbiB0aGlzIGRvY3VtZW50XHJcbiMjI1xyXG4gIFxyXG4jIyNcclxuIyBUaGlzIGJpbmRzIHRvIHRoZSBkb2N1bWVudCBjbGljayBldmVudCwgd2hpY2ggaW4gdHVybiBhdHRhY2hlcyB0byBldmVyeSBjbGljayBldmVudCwgY2F1c2luZyB1bmV4cGVjdGVkIGJlaGF2aW9yLlxyXG4jIEZvciBhbnkgY29udHJvbCB3aGljaCB3aXNoZXMgdG8gdHJpZ2dlciBhIHN0YXRlIGNoYW5nZSBpbiByZXNwb25zZSB0byBhbiBldmVudCwgaXQgaXMgYmV0dGVyIGZvciB0aGF0IGNvbnRyb2wgdG8gZGVmaW5lIHRoZSBiZWhhdmlvci5cclxuT0ouZG9jdW1lbnRbZXZlbnROYW1lXSBldmVudEluZm8gKyAnY2xpY2snLCAoKGV2ZW50KSAtPlxyXG4gIGV2ZW50ID0gZXZlbnQgb3Igd2luZG93LmV2ZW50XHJcbiAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IG9yIGV2ZW50LnNyY0VsZW1lbnRcclxuICAgIFxyXG4gICMgbG9va2luZyBmb3IgYWxsIHRoZSBsaW5rcyB3aXRoICdhamF4JyBjbGFzcyBmb3VuZFxyXG4gIGlmIHRhcmdldCBhbmQgdGFyZ2V0Lm5vZGVOYW1lIGlzICdBJyBhbmQgKCcgJyArIHRhcmdldC5jbGFzc05hbWUgKyAnICcpLmluZGV4T2YoJ2FqYXgnKSA+PSAwXHJcbiAgICBPSi5wdXNoU3RhdGUgdGFyZ2V0LmhyZWYsIGV2ZW50XHJcbiAgICAgIFxyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4pLCBmYWxzZVxyXG4jIyNcclxuXHJcbiMjI1xyXG5oYW5nIG9uIHBvcHN0YXRlIGV2ZW50IHRyaWdnZXJlZCBieSBwcmVzc2luZyBiYWNrL2ZvcndhcmQgaW4gYnJvd3NlclxyXG4jIyNcclxuT0ouZ2xvYmFsW2V2ZW50TmFtZV0gZXZlbnRJbmZvICsgJ3BvcHN0YXRlJywgKChldmVudCkgLT5cclxuICAgIFxyXG4gICMgd2UgZ2V0IGEgbm9ybWFsIExvY2F0aW9uIG9iamVjdFxyXG4gICAgXHJcbiAgIyMjXHJcbiAgTm90ZSwgdGhpcyBpcyB0aGUgb25seSBkaWZmZXJlbmNlIHdoZW4gdXNpbmcgdGhpcyBsaWJyYXJ5LFxyXG4gIGJlY2F1c2UgdGhlIG9iamVjdCBkb2N1bWVudC5sb2NhdGlvbiBjYW5ub3QgYmUgb3ZlcnJpZGVuLFxyXG4gIHNvIGxpYnJhcnkgdGhlIHJldHVybnMgZ2VuZXJhdGVkICdsb2NhdGlvbicgb2JqZWN0IHdpdGhpblxyXG4gIGFuIG9iamVjdCB3aW5kb3cuaGlzdG9yeSwgc28gZ2V0IGl0IG91dCBvZiAnaGlzdG9yeS5sb2NhdGlvbicuXHJcbiAgRm9yIGJyb3dzZXJzIHN1cHBvcnRpbmcgJ2hpc3RvcnkucHVzaFN0YXRlJyBnZXQgZ2VuZXJhdGVkXHJcbiAgb2JqZWN0ICdsb2NhdGlvbicgd2l0aCB0aGUgdXN1YWwgJ2RvY3VtZW50LmxvY2F0aW9uJy5cclxuICAjIyMgICAgICAgICAgICAgICAgICAgICBcclxuICByZXR1cm5Mb2NhdGlvbiA9IGhpc3RvcnkubG9jYXRpb24gb3IgZG9jdW1lbnQubG9jYXRpb25cclxuICAgIFxyXG4gICMjI1xyXG4gIGhlcmUgY2FuIGNhdXNlIGRhdGEgbG9hZGluZywgZXRjLlxyXG4gICMjI1xyXG4gIE9KLmhpc3RvcnkucmVzdG9yZVN0YXRlIHJldHVybkxvY2F0aW9uXHJcbiAgICBcclxuICByZXR1cm5cclxuKSwgZmFsc2UgXHJcbiAgXHJcbiBcclxuT0ouaGlzdG9yeS5yZWdpc3RlciAncmVzdG9yZVN0YXRlJywgcmVzdG9yZVN0YXRlXHJcbk9KLmhpc3RvcnkucmVnaXN0ZXIgJ3B1c2hTdGF0ZScsIHB1c2hTdGF0ZVxyXG4gXHJcbm1vZHVsZS5leHBvcnRzID0gXHJcbiAgcmVzdG9yZVN0YXRlOiByZXN0b3JlU3RhdGVcclxuICBwdXNoU3RhdGU6IHB1c2hTdGF0ZVxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cbmVhY2ggPSByZXF1aXJlICcuL2VhY2gnXG5cbmlzTWV0aG9kID0ge31cblxuaXNNZXRob2QuYm9vbCA9IChib29sZWFuKSAtPlxuICBfLmlzQm9vbGVhbiBib29sZWFuXG5cbmlzTWV0aG9kLmFycmF5TnVsbE9yRW1wdHkgPSAoYXJyKSAtPlxuICBfLmlzRW1wdHkgYXJyXG5cbmlzTWV0aG9kLnN0cmluZ051bGxPckVtcHR5ID0gKHN0cikgLT5cbiAgc3RyIGFuZCAobm90IHN0ci5sZW5ndGggb3Igc3RyLmxlbmd0aCBpcyAwIG9yIG5vdCBzdHIudHJpbSBvciBub3Qgc3RyLnRyaW0oKSlcblxuaXNNZXRob2QubnVtYmVyTnVsbE9yRW1wdHkgPSAobnVtKSAtPlxuICBub3QgbnVtIG9yIGlzTmFOKG51bSkgb3Igbm90IG51bS50b1ByZWNpc2lvblxuXG5pc01ldGhvZC5kYXRlTnVsbE9yRW1wdHkgPSAoZHQpIC0+XG4gIG5vdCBkdCBvciBub3QgZHQuZ2V0VGltZVxuXG5pc01ldGhvZC5vYmplY3ROdWxsT3JFbXB0eSA9IChvYmopIC0+XG4gIF8uaXNFbXB0eSBvYmogb3Igbm90IE9iamVjdC5rZXlzKG9iaikgb3IgT2JqZWN0LmtleXMob2JqKS5sZW5ndGggaXMgMFxuXG5pc01ldGhvZC5wbGFpbk9iamVjdCA9IChvYmopIC0+XG4gIF8uaXNQbGFpbk9iamVjdCBvYmpcblxuaXNNZXRob2Qub2JqZWN0ID0gKG9iaikgLT5cbiAgXy5pc09iamVjdCBvYmpcblxuaXNNZXRob2QuZGF0ZSA9IChkdCkgLT5cbiAgXy5pc0RhdGUgZHRcblxuXG4jIyNcbkRldGVybWluZXMgaWYgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiBhIE51bWJlciBhbmQgbm90IE5hTipcbiMjI1xuaXNNZXRob2QubnVtYmVyID0gKG51bSkgLT5cbiAgbnVtYmVyID0gcmVxdWlyZSAnLi4vY29yZS9udW1iZXInXG4gIHR5cGVvZiBudW0gaXMgJ251bWJlcicgYW5kIGZhbHNlIGlzIChudW1iZXIuaXNOYU4obnVtKSBvciBmYWxzZSBpcyBudW1iZXIuaXNGaW5pdGUobnVtKSBvciBudW1iZXIuTUFYX1ZBTFVFIGlzIG51bSBvciBudW1iZXIuTUlOX1ZBTFVFIGlzIG51bSlcblxuIyMjXG5EZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgY29udmVydGlibGUgdG8gYSBOdW1iZXJcbiMjI1xuaXNNZXRob2QubnVtZXJpYyA9IChudW0pIC0+XG4gIHJldCA9IGlzTWV0aG9kLm51bWJlcihudW0pXG4gIHVubGVzcyByZXRcbiAgICB0byA9IHJlcXVpcmUgJy4vdG8nXG4gICAgbnVOdW0gPSB0by5udW1iZXIobnVtKVxuICAgIHJldCA9IGlzTWV0aG9kLm51bWJlcihudU51bSlcbiAgcmV0XG5cbmlzTWV0aG9kLnZlbmRvck9iamVjdCA9IChvYmopIC0+XG4gIHJldCA9IChvYmogaW5zdGFuY2VvZiBPSlsnPyddKVxuICByZXRcblxuaXNNZXRob2QuZWxlbWVudEluRG9tID0gKGVsZW1lbnRJZCkgLT5cbiAgZmFsc2UgaXMgaXNNZXRob2QubnVsbE9yRW1wdHkoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKSlcblxuaXNNZXRob2QuYXJyYXkgPSAob2JqKSAtPlxuICBfLmlzQXJyYXkgb2JqXG5cbmlzTWV0aG9kLnN0cmluZyA9IChzdHIpIC0+XG4gIF8uaXNTdHJpbmcgc3RyXG5cbmlzTWV0aG9kLnRydWUgPSAob2JqKSAtPlxuICBvYmogaXMgdHJ1ZSBvciBvYmogaXMgJ3RydWUnIG9yIG9iaiBpcyAxIG9yIG9iaiBpcyAnMSdcblxuaXNNZXRob2QuZmFsc2UgPSAob2JqKSAtPlxuICBvYmogaXMgZmFsc2Ugb3Igb2JqIGlzICdmYWxzZScgb3Igb2JqIGlzIDAgb3Igb2JqIGlzICcwJ1xuXG5pc01ldGhvZC50cnVlT3JGYWxzZSA9IChvYmopIC0+XG4gIGlzTWV0aG9kLnRydWUgb2JqIG9yIGlzTWV0aG9kLmZhbHNlIG9ialxuXG5pc01ldGhvZC5udWxsT3JFbXB0eSA9IChvYmosIGNoZWNrTGVuZ3RoKSAtPlxuICBfLmlzRW1wdHkob2JqKSBvciBfLmlzVW5kZWZpbmVkKG9iaikgb3IgXy5pc051bGwob2JqKSBvciBfLmlzTmFOKG9iailcblxuaXNNZXRob2QubnVsbE9yVW5kZWZpbmVkID0gKG9iaiwgY2hlY2tMZW5ndGgpIC0+XG4gIF8uaXNVbmRlZmluZWQob2JqKSBvciBfLmlzTnVsbChvYmopIG9yIF8uaXNOYU4ob2JqKVxuXG5pc01ldGhvZC5pbnN0YW5jZW9mID0gKG5hbWUsIG9iaikgLT5cbiAgb2JqLnR5cGUgaXMgbmFtZSBvciBvYmogaW5zdGFuY2VvZiBuYW1lXG5cbmlzTWV0aG9kLm1ldGhvZCA9IChvYmopIC0+XG4gIG9iaiBpc250IE9KLm5vb3AgYW5kIF8uaXNGdW5jdGlvbiBvYmpcblxuIyMjXG5EZXByZWNhdGVkLiBMZWZ0IGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4gVXNlIGlzLm1ldGhvZCBpbnN0ZWFkLlxuIyMjXG5pc01ldGhvZC5mdW5jID0gaXNNZXRob2QubWV0aG9kXG5cbk9iamVjdC5zZWFsIGlzTWV0aG9kXG5PYmplY3QuZnJlZXplIGlzTWV0aG9kXG5cbk9KLnJlZ2lzdGVyICdpcycsIGlzTWV0aG9kXG5tb2R1bGUuZXhwb3J0cyA9IGlzTWV0aG9kXG5cbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vdHkgPSByZXF1aXJlICdub3R5J1xyXG5cclxuICBcclxubWFrZU5vdHkgPSAob3B0aW9ucywgb3duZXIpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgbGF5b3V0OiAndG9wUmlnaHQnXHJcbiAgICB0aGVtZTogJ2RlZmF1bHRUaGVtZSdcclxuICAgIHR5cGU6ICdhbGVydCdcclxuICAgIHRleHQ6ICcnICNjYW4gYmUgaHRtbCBvciBzdHJpbmdcclxuICAgIGRpc21pc3NRdWV1ZTogdHJ1ZSAjSWYgeW91IHdhbnQgdG8gdXNlIHF1ZXVlIGZlYXR1cmUgc2V0IHRoaXMgdHJ1ZVxyXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwibm90eV9tZXNzYWdlXCI+PHNwYW4gY2xhc3M9XCJub3R5X3RleHRcIj48L3NwYW4+PGRpdiBjbGFzcz1cIm5vdHlfY2xvc2VcIj48L2Rpdj48L2Rpdj4nLFxyXG4gICAgYW5pbWF0aW9uOiBcclxuICAgICAgICBvcGVuOiBcclxuICAgICAgICAgIGhlaWdodDogJ3RvZ2dsZSdcclxuICAgICAgICBjbG9zZTogXHJcbiAgICAgICAgICBoZWlnaHQ6ICd0b2dnbGUnXHJcbiAgICAgICAgZWFzaW5nOiAnc3dpbmcnXHJcbiAgICAgICAgc3BlZWQ6IDUwMCAjb3BlbmluZyAmIGNsb3NpbmcgYW5pbWF0aW9uIHNwZWVkXHJcbiAgICB0aW1lb3V0OiA1MDAwICNkZWxheSBmb3IgY2xvc2luZyBldmVudC4gU2V0IGZhbHNlIGZvciBzdGlja3kgbm90aWZpY2F0aW9uc1xyXG4gICAgZm9yY2U6IGZhbHNlICNhZGRzIG5vdGlmaWNhdGlvbiB0byB0aGUgYmVnaW5uaW5nIG9mIHF1ZXVlIHdoZW4gc2V0IHRvIHRydWVcclxuICAgIG1vZGFsOiBmYWxzZVxyXG4gICAgbWF4VmlzaWJsZTogNSAjeW91IGNhbiBzZXQgbWF4IHZpc2libGUgbm90aWZpY2F0aW9uIGZvciBkaXNtaXNzUXVldWUgdHJ1ZSBvcHRpb24sXHJcbiAgICBraWxsZXI6IGZhbHNlICNmb3IgY2xvc2UgYWxsIG5vdGlmaWNhdGlvbnMgYmVmb3JlIHNob3dcclxuICAgIGNsb3NlV2l0aDogWydjbGljayddICAjWydjbGljaycsICdidXR0b24nLCAnaG92ZXInXVxyXG4gICAgY2FsbGJhY2s6IFxyXG4gICAgICAgIG9uU2hvdzogT0oubm9vcCxcclxuICAgICAgICBhZnRlclNob3c6IE9KLm5vb3BcclxuICAgICAgICBvbkNsb3NlOiBPSi5ub29wXHJcbiAgICAgICAgYWZ0ZXJDbG9zZTogT0oubm9vcFxyXG4gICAgYnV0dG9uczogZmFsc2UgI2FuIGFycmF5IG9mIGJ1dHRvbnNcclxuICAgIFxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vdHkgZGVmYXVsdHNcclxuICAgICAgXHJcbiAgcmV0XHJcbiAgICBcclxuT0oubm90aWZpY2F0aW9ucy5yZWdpc3RlciAnbm90eScsIG1ha2VOb3R5XHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZU5vdHkiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuUHViU3ViID0gcmVxdWlyZSAncHVic3ViLWpzJ1xuXG50b2tlbnMgPSB7fVxuc3Vic2NyaWJlcnMgPSBbXVxuZXZlbnRzID0ge31cblxucHMgPSBcbiAgZ2V0RXZlbnROYW1lOiAoZXZlbnQpIC0+XG4gICAgZXZlbnQudG9VcHBlckNhc2UoKS5yZXBsYWNlICcgJywgJ18nXG5cbiAgc3Vic2NyaWJlOiAoZXZlbnQsIG1ldGhvZCkgLT5cbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUgZXZlbnRcbiAgICBpZiBub3QgZXZlbnRzW2V2ZW50TmFtZV0gdGhlbiBldmVudHNbZXZlbnROYW1lXSA9IFtdXG5cbiAgICB0b2tlbiA9IFB1YlN1Yi5zdWJzY3JpYmUgZXZlbnROYW1lLCBtZXRob2RcbiAgICB0b2tlbnNbdG9rZW5dID0gdG9rZW5cbiAgICBzdWJzY3JpYmVycy5wdXNoIG1ldGhvZFxuICAgIGV2ZW50c1tldmVudE5hbWVdLnB1c2ggbWV0aG9kXG4gICAgdG9rZW5cblxuICBwdWJsaXNoOiAoZXZlbnQsIGRhdGEpIC0+XG4gICAgZXZlbnROYW1lID0gcHMuZ2V0RXZlbnROYW1lIGV2ZW50XG4gICAgaWYgZXZlbnRzW2V2ZW50TmFtZV1cbiAgICAgIFB1YlN1Yi5wdWJsaXNoIGV2ZW50TmFtZSwgZGF0YVxuICAgIGVsc2VcbiAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbmFtZWQgeycgKyBldmVudCArICd9IGlzIG5vdCByZWNvZ25pemVkLidcbiAgICByZXR1cm5cblxuICB1bnN1YnNjcmliZTogKHRva2VuT3JNZXRob2QpIC0+XG4gICAgaWYgT0ouaXMubWV0aG9kIHRva2VuT3JNZXRob2RcbiAgICAgIGlmIC0xIGlzbnQgc3Vic2NyaWJlcnMuaW5kZXhPZiB0b2tlbk9yTWV0aG9kXG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSB0b2tlbk9yTWV0aG9kXG4gICAgICAgIHN1YnNjcmliZXJzID0gXy5yZW1vdmUgc3Vic2NyaWJlcnMsIChtZXRob2QpIC0+IG1ldGhvZCBpcyB0b2tlbk9yTWV0aG9kXG4gICAgICBlbHNlXG4gICAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbWV0aG9kIGlzIG5vdCByZWNvZ25pemVkLidcbiAgICBlbHNlXG4gICAgICBpZiB0b2tlbnNbdG9rZW5Pck1ldGhvZF1cbiAgICAgICAgUHViU3ViLnVuc3Vic2NyaWJlIHRva2VuT3JNZXRob2RcbiAgICAgICAgZGVsZXRlIHRva2Vuc1t0b2tlbk9yTWV0aG9kXVxuICAgIHJldHVyblxuXG4gIHVuc3Vic2NyaWJlQWxsOiAoKSAtPlxuICAgIE9KLmVhY2ggdG9rZW5zLCAodG9rZW4pIC0+IHVuc3Vic2NyaWJlIHRva2VuXG4gICAgc3Vic2NyaWJlcnMgPSBbXVxuICAgIGV2ZW50cyA9IHt9XG4gICAgcmV0dXJuXG5cbiAgdW5zdWJzY3JpYmVFdmVudDogKGV2ZW50KSAtPlxuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZSBldmVudFxuICAgIGlmIGV2ZW50c1tldmVudE5hbWVdXG4gICAgICBPSi5lYWNoIGV2ZW50c1tldmVudE5hbWVdLCAobWV0aG9kKSAtPiB1bnN1YnNjcmliZSBtZXRob2RcbiAgICBlbHNlXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0V2ZW50IG5hbWVkIHsnICsgZXZlbnQgKyAnfSBpcyBub3QgcmVjb2duaXplZC4nXG4gICAgZGVsZXRlIGV2ZW50c1tldmVudE5hbWVdXG4gICAgcmV0dXJuXG5cbk9iamVjdC5zZWFsIHBzXG5PYmplY3QuZnJlZXplIHBzXG5cbk9KLnJlZ2lzdGVyICdnZXRFdmVudE5hbWUnLCBwcy5nZXRFdmVudE5hbWVcbk9KLnJlZ2lzdGVyICdwdWJsaXNoJywgcHMucHVibGlzaFxuT0oucmVnaXN0ZXIgJ3N1YnNjcmliZScsIHBzLnN1YnNjcmliZVxuT0oucmVnaXN0ZXIgJ3Vuc3Vic2NyaWJlJywgcHMudW5zdWJzY3JpYmVcbk9KLnJlZ2lzdGVyICd1bnN1YnNjcmliZUFsbCcsIHBzLnVuc3Vic2NyaWJlQWxsXG5PSi5yZWdpc3RlciAndW5zdWJzY3JpYmVFdmVudCcsIHBzLnVuc3Vic2NyaWJlRXZlbnRcblxubW9kdWxlLmV4cG9ydHMgPSBwcyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbiMjI1xyXG5odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkwMTExNS9ob3ctY2FuLWktZ2V0LXF1ZXJ5LXN0cmluZy12YWx1ZXMtaW4tamF2YXNjcmlwdFxyXG4jIyNcclxucXVlcnlTdHJpbmcgPSAocGFyYW0pIC0+XHJcbiAgcmV0ID0ge31cclxuICAgIFxyXG4gIGlmIE9KLmdsb2JhbC5sb2NhdGlvblxyXG4gICAgcGFyYW1zID0gIE9KLmdsb2JhbC5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpLnNwbGl0ICcmJ1xyXG4gICAgaWYgcGFyYW1zXHJcbiAgICAgIGkgPSAwXHJcbiAgICAgIHdoaWxlIGkgPCBwYXJhbXMubGVuZ3RoXHJcbiAgICAgICAgcHJtID0gcGFyYW1zW2ldLnNwbGl0ICc9J1xyXG4gICAgICAgIGlmIHBybS5sZW5ndGggaXMgMiBcclxuICAgICAgICAgIHJldFtwcm1bMF1dID0gT0ouZ2xvYmFsLmRlY29kZVVSSUNvbXBvbmVudCBwcm1bMV0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKVxyXG4gICAgICAgIGkgKz0gMVxyXG4gIHJldFxyXG4gICAgXHJcbk9KLnJlZ2lzdGVyICdxdWVyeVN0cmluZycscXVlcnlTdHJpbmdcclxubW9kdWxlLmV4cG9ydHMgPSBxdWVyeVN0cmluZyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5lYWNoID0gcmVxdWlyZSAnLi9lYWNoJ1xuXG4jICMgcmFuZ2VzXG5cbnJuZyA9IFxuXG4gICMgIyMgcmFuZ2VcbiAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNyYW5nZSkncyBgcmFuZ2VgIG1ldGhvZFxuICByYW5nZTogKHBhcmFtcy4uLikgLT5cbiAgICBfLnJhbmdlIHBhcmFtcy4uLlxuXG4gICMgIyMgcmFuZ2VNaW5cbiAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNtaW4pJ3MgYG1pbmAgbWV0aG9kXG4gIHJhbmdlTWluOiAocGFyYW1zLi4uKSAtPlxuICAgIF8ubWluIHBhcmFtcy4uLlxuXG4gICMgIyMgcmFuZ2VNYXhcbiAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNtYXgpJ3MgYG1heGAgbWV0aG9kXG4gIHJhbmdlTWF4OiAocGFyYW1zLi4uKSAtPlxuICAgIF8ubWF4IHBhcmFtcy4uLlxuXG4gICMgIyMgc3RyaW5nUmFuZ2VUb1N1YlJhbmdlc1xuICAjIyNcbiAgVGFrZSBhbiBhcnJheSBvZiBzdHJpbmcgdmFsdWVzIGFuZCBhIG51bWJlciBvZiBwYXJ0aXRpb25zIHRvIGNyZWF0ZS5cbiAgVXNlcyB0aGUgZmlyc3QgbGV0dGVyIG9mIGVhY2ggc3RyaW5nIHZhbHVlIGluIHRoZSBhcnJheSB0byBjb252ZXJ0IHRvIHVuaXF1ZSBjb2RlIGNoYXJhY3RlciAobG93ZXIgY2FzZSlcbiAgQnVpbGRzIGEgaW50IHJhbmdlIGJhc2VkIG9uIHVuaXF1ZSBjb2RlIGNoYXJzLlxuICAjIyNcbiAgc3RyaW5nVG9TdWJSYW5nZXM6IChuID0gNiwgcmFuZ2UgPSBbXSkgLT5cbiAgICBjaGFyUmFuZ2UgPSBbXVxuXG5cbiAgICBlYWNoIHJhbmdlLCAodmFsKSAtPlxuICAgICAgY2hhciA9IHZhbC50cmltKClbMF0udG9Mb3dlckNhc2UoKVxuICAgICAgaWYgZmFsc2UgaXMgb2JqLmNvbnRhaW5zIGNoYXJSYW5nZSwgY2hhclxuICAgICAgICBjaGFyUmFuZ2UucHVzaCBjaGFyLmNoYXJDb2RlQXQoKVxuXG4gICAgcmV0ID0gcmFuZ2VUb1N1YlJhbmdlcyBuLCBjaGFyUmFuZ2VcblxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IG5cbiAgICAgIGkgKz0gMVxuICAgICAgc3ViUmFuZ2UgPSByZXRbaV1cbiAgICAgIHN1YlJhbmdlLm1hcCBTdHJpbmcuZnJvbUNoYXJDb2RlXG5cbiAgICBvbGRHZXRSYW5nZSA9IHJldC5nZXRSYW5nZVxuICAgIHJldC5nZXRSYW5nZSA9ICh2YWwpIC0+XG4gICAgICBjaGFyID0gdmFsLnRyaW0oKVswXS50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoKVxuICAgICAgaWR4ID0gb2xkR2V0UmFuZ2UgY2hhclxuICAgICAgaWR4XG4gICAgcmV0XG5cbiAgIyAjIyByYW5nZVRvU3ViUmFuZ2VzXG4gICMjI1xuICBUYWtlIGFuIGFycmF5IG9mIGludCB2YWx1ZXMgYW5kIGEgbnVtYmVyIG9mIHBhcnRpdGlvbnMgdG8gY3JlYXRlLlxuICBEaXZpZGVzIHRoZSBvcmlnaW5hbCBhcnJheSBpbnRvIHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIHN1YiBhcnJheXMuXG4gIE92ZXJmbG93IGlzIHBhc3NlZCB0byB0aGUgZmluYWwgcGFydGl0aW9uLlxuICAjIyNcbiAgdG9TdWJSYW5nZXM6IChuID0gNiwgcmFuZ2UgPSBbXSkgLT5cbiAgICByZXQgPSBvYmoub2JqZWN0KClcbiAgICByYW5nZUxvdyA9IHJuZy5yYW5nZU1pbiByYW5nZVxuICAgIHJhbmdlSGlnaCA9IHJuZy5yYW5nZU1heCByYW5nZVxuXG4gICAgZGlzdGFuY2UgPSByYW5nZUhpZ2ggLSByYW5nZUxvd1xuICAgIHN1YlJhbmdlU2l6ZSA9IGRpc3RhbmNlL25cbiAgICBzdWJSYW5nZXMgPSByZXQuYWRkICdyYW5nZXMnLCBvYmoub2JqZWN0KClcbiAgICBjaHVua1ZhbCA9IHJhbmdlTG93XG5cbiAgICBtYXAgPSBvYmoub2JqZWN0KClcblxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IG5cbiAgICAgIGkgKz0gMVxuICAgICAgaWYgaSA8IG4gdGhlbiBqdW1wID0gTWF0aC5yb3VuZCBzdWJSYW5nZVNpemVcbiAgICAgIGVsc2VcbiAgICAgICAganVtcCA9IE1hdGguZmxvb3Igc3ViUmFuZ2VTaXplXG4gICAgICAgIGlmIGNodW5rVmFsICsganVtcCA8PSByYW5nZUhpZ2hcbiAgICAgICAgICBqdW1wICs9IHJhbmdlSGlnaCAtIGNodW5rVmFsIC0ganVtcCArIDFcblxuICAgICAgc3ViUmFuZ2UgPSBybmcucmFuZ2UgY2h1bmtWYWwsIGNodW5rVmFsICsganVtcFxuICAgICAgZWFjaCBzdWJSYW5nZSwgKHZhbCkgLT4gbWFwLmFkZCB2YWwsIGlcbiAgICAgIHN1YlJhbmdlc1tpXSA9IHN1YlJhbmdlXG4gICAgICBjaHVua1ZhbCArPSBqdW1wXG5cbiAgICByZXQuYWRkICdnZXRSYW5nZScsICh2YWwpIC0+XG4gICAgICBtYXBbdmFsXVxuXG4gICAgcmV0XG5cbk9iamVjdC5zZWFsIHJuZ1xuT2JqZWN0LmZyZWV6ZSBybmdcblxuT0oucmVnaXN0ZXIgJ3JhbmdlcycsIHJuZ1xubW9kdWxlLmV4cG9ydHMgPSBybmcgICIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbmlzTWV0aG9kID0gcmVxdWlyZSAnLi9pcydcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuZWFjaCA9IHJlcXVpcmUgJy4vZWFjaCdcblxuIyAjIHRvXG50byA9XG4gICMgIyMgYm9vbFxuICAjIGNvbnZlcnQgYW55IGNvbXBhdGlibGUgb2JqZWN0IHRvIGEgYm9vbGVhbi4gSW5jb21wYXRpYmxlIG9iamVjdHMgYXJlIGZhbHNlLlxuICBib29sOiAoc3RyKSAtPlxuICAgIHJldEJvb2wgPSBpc01ldGhvZFsndHJ1ZSddKHN0cilcbiAgICByZXRCb29sID0gZmFsc2UgIGlmIHJldEJvb2wgaXMgZmFsc2Ugb3IgcmV0Qm9vbCBpc250IHRydWVcbiAgICByZXRCb29sXG5cbiAgIyAjIyBFUzVfVG9Cb29sXG4gICMgKGRlYnVnKSBtZXRob2QgdG8gZXhwbGljaXRseSBmb3JjZSBhbiBgaWYob2JqKWAgZXZhbHVhdGlvbiB0byBmbG93IHRocm91Z2ggdGhlIEVTNSBzcGVjIGZvciB0cnV0aGluZXNzXG4gICdFUzVfVG9Cb29sJzogKHZhbCkgLT5cbiAgICB2YWwgaXNudCBmYWxzZSBhbmQgdmFsIGlzbnQgMCBhbmQgdmFsIGlzbnQgJycgYW5kIHZhbCBpc250IG51bGwgYW5kIHR5cGVvZiB2YWwgaXNudCAndW5kZWZpbmVkJyBhbmQgKHR5cGVvZiB2YWwgaXNudCAnbnVtYmVyJyBvciBub3QgaXNOYU4odmFsKSlcblxuICAjICMjIGRhdGVGcm9tVGlja3NcbiAgIyB0YWtlIGEgbnVtYmVyIHJlcHJlc2VudGluZyB0aWNrcyBhbmQgY29udmVydCBpdCBpbnRvIGFuIGluc3RhbmNlIG9mIERhdGVcbiAgZGF0ZUZyb21UaWNrczogKHRpY2tTdHIpIC0+XG4gICAgdGljc0RhdGVUaW1lID0gdG8uc3RyaW5nKHRpY2tTdHIpXG4gICAgcmV0ID0gdW5kZWZpbmVkXG4gICAgdGlja3MgPSB1bmRlZmluZWRcbiAgICBvZmZzZXQgPSB1bmRlZmluZWRcbiAgICBsb2NhbE9mZnNldCA9IHVuZGVmaW5lZFxuICAgIGFyciA9IHVuZGVmaW5lZFxuICAgIGlmIGZhbHNlIGlzIGlzTWV0aG9kLm51bGxPckVtcHR5KHRpY3NEYXRlVGltZSlcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcvJywgJycpXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnRGF0ZScsICcnKVxuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJygnLCAnJylcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcpJywgJycpXG4gICAgICBhcnIgPSB0aWNzRGF0ZVRpbWUuc3BsaXQoJy0nKVxuICAgICAgaWYgYXJyLmxlbmd0aCA+IDFcbiAgICAgICAgdGlja3MgPSB0by5udW1iZXIoYXJyWzBdKVxuICAgICAgICBvZmZzZXQgPSB0by5udW1iZXIoYXJyWzFdKVxuICAgICAgICBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKVxuICAgICAgICByZXQgPSBuZXcgRGF0ZSgodGlja3MgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpXG4gICAgICBlbHNlIGlmIGFyci5sZW5ndGggaXMgMVxuICAgICAgICB0aWNrcyA9IHRvLm51bWJlcihhcnJbMF0pXG4gICAgICAgIHJldCA9IG5ldyBEYXRlKHRpY2tzKVxuICAgIHJldFxuXG4gICMgIyMgYmluYXJ5XG4gICMgY29udmVydCBhbiBvYmplY3QgdG8gYmluYXJ5IDAgb3IgMVxuICBiaW5hcnk6IChvYmopIC0+XG4gICAgcmV0ID0gTmFOXG4gICAgaWYgb2JqIGlzIDAgb3Igb2JqIGlzICcwJyBvciBvYmogaXMgJycgb3Igb2JqIGlzIGZhbHNlIG9yIHRvLnN0cmluZyhvYmopLnRvTG93ZXJDYXNlKCkudHJpbSgpIGlzICdmYWxzZSdcbiAgICAgIHJldCA9IDBcbiAgICBlbHNlIHJldCA9IDEgIGlmIG9iaiBpcyAxIG9yIG9iaiBpcyAnMScgb3Igb2JqIGlzIHRydWUgb3IgdG8uc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgaXMgJ3RydWUnXG4gICAgcmV0XG5cblxuICAjICMjIG51bWJlclxuICAjXG4gICMgQXR0ZW1wdHMgdG8gY29udmVydCBhbiBhcmJpdHJhcnkgdmFsdWUgdG8gYSBOdW1iZXIuXG4gICMgTG9vc2UgZmFsc3kgdmFsdWVzIGFyZSBjb252ZXJ0ZWQgdG8gMC5cbiAgIyBMb29zZSB0cnV0aHkgdmFsdWVzIGFyZSBjb252ZXJ0ZWQgdG8gMS5cbiAgIyBBbGwgb3RoZXIgdmFsdWVzIGFyZSBwYXJzZWQgYXMgSW50ZWdlcnMuXG4gICMgRmFpbHVyZXMgcmV0dXJuIGFzIE5hTi5cbiAgI1xuICBudW1iZXI6IChpbnB1dE51bSwgZGVmYXVsdE51bSkgLT5cbiAgICB0cnlHZXROdW1iZXIgPSAodmFsKSAtPlxuICAgICAgcmV0ID0gTmFOXG4gICAgICAjIGlmIGB2YWxgIGFscmVhZHkgKGlzKVtpcy5odG1sXSBhIE51bWJlciwgcmV0dXJuIGl0XG4gICAgICBpZiBpc01ldGhvZC5udW1iZXIodmFsKVxuICAgICAgICByZXQgPSB2YWxcbiAgICAgICMgZWxzZSBpZiBgdmFsYCBhbHJlYWR5IChpcylbaXMuaHRtbF0gYSBTdHJpbmcgb3IgYSBCb29sZWFuLCBjb252ZXJ0IGl0XG4gICAgICBlbHNlIGlmIGlzTWV0aG9kLnN0cmluZyh2YWwpIG9yIGlzTWV0aG9kLmJvb2wodmFsKVxuICAgICAgICB0cnlHZXQgPSAodmFsdWUpIC0+XG4gICAgICAgICAgbnVtID0gdG8uYmluYXJ5KHZhbHVlKVxuICAgICAgICAgIG51bSA9ICt2YWx1ZSAgaWYgbm90IGlzTWV0aG9kLm51bWJlcihudW0pIGFuZCB2YWx1ZVxuICAgICAgICAgIG51bSA9IF8ucGFyc2VJbnQodmFsdWUsIDApIGlmIG5vdCBpc01ldGhvZC5udW1iZXIobnVtKVxuICAgICAgICAgIG51bVxuICAgICAgICByZXQgPSB0cnlHZXQgdmFsXG4gICAgICByZXRcblxuICAgIHJldFZhbCA9IHRyeUdldE51bWJlcihpbnB1dE51bSlcbiAgICBpZiBub3QgaXNNZXRob2QubnVtYmVyKHJldFZhbClcbiAgICAgIHJldFZhbCA9IHRyeUdldE51bWJlcihkZWZhdWx0TnVtKVxuICAgICAgcmV0VmFsID0gTnVtYmVyLk5hTiBpZiBub3QgaXNNZXRob2QubnVtYmVyKHJldFZhbClcbiAgICByZXRWYWxcblxuICAjICMjIHN0cmluZ1xuICAjIGNvbnZlcnQgYW4gb2JqZWN0IHRvIHN0cmluZ1xuICBzdHJpbmc6IChpbnB1dFN0ciwgZGVmYXVsdFN0cikgLT5cbiAgICB0cnlHZXRTdHJpbmcgPSAoc3RyKSAtPlxuICAgICAgcmV0ID0gdW5kZWZpbmVkXG4gICAgICBpZiBpc01ldGhvZC5zdHJpbmcoc3RyKVxuICAgICAgICByZXQgPSBzdHJcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0ID0gJydcbiAgICAgICAgcmV0ID0gc3RyLnRvU3RyaW5nKCkgIGlmIGlzTWV0aG9kLmJvb2woc3RyKSBvciBpc01ldGhvZC5udW1iZXIoc3RyKSBvciBpc01ldGhvZC5kYXRlKHN0cilcbiAgICAgIHJldFxuICAgIHJldDEgPSB0cnlHZXRTdHJpbmcoaW5wdXRTdHIpXG4gICAgcmV0MiA9IHRyeUdldFN0cmluZyhkZWZhdWx0U3RyKVxuICAgIHJldFZhbCA9ICcnXG4gICAgaWYgcmV0MS5sZW5ndGggaXNudCAwXG4gICAgICByZXRWYWwgPSByZXQxXG4gICAgZWxzZSBpZiByZXQxIGlzIHJldDIgb3IgcmV0Mi5sZW5ndGggaXMgMFxuICAgICAgcmV0VmFsID0gcmV0MVxuICAgIGVsc2VcbiAgICAgIHJldFZhbCA9IHJldDJcbiAgICByZXRWYWxcblxuT2JqZWN0LnNlYWwgdG9cbk9iamVjdC5mcmVlemUgdG9cblxuT0oucmVnaXN0ZXIgJ3RvJywgdG9cbm1vZHVsZS5leHBvcnRzID0gdG8iLCIjICMgY3JlYXRlVVVJRFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuIyMjXHJcbkdlbmVyYXRlcyBhIHJhbmRvbSBzdHJpbmcgdGhhdCBjb21wbGllcyB0byB0aGUgUkZDIDQxMjIgc3BlY2lmaWNhdGlvbiBmb3IgR1VJRC9VVUlELlxyXG4oZS5nLiAnQjQyQTE1M0YtMUQ5QS00RjkyLTk5MDMtOTJDMTFERDY4NEQyJylcclxuV2hpbGUgbm90IGEgdHJ1ZSBVVUlELCBmb3IgdGhlIHB1cnBvc2VzIG9mIHRoaXMgYXBwbGljYXRpb24sIGl0IHNob3VsZCBiZSBzdWZmaWNpZW50LlxyXG4jIyNcclxuY3JlYXRlRmF1eFVVSUQgPSAtPlxyXG4gICAgXHJcbiAgIyBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmM0MTIyLnR4dFxyXG4gICMgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvaG93LXRvLWNyZWF0ZS1hLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0XHJcbiAgcyA9IFtdXHJcbiAgcy5sZW5ndGggPSAzNlxyXG4gIGhleERpZ2l0cyA9ICcwMTIzNDU2Nzg5YWJjZGVmJ1xyXG4gIGkgPSAwXHJcblxyXG4gIHdoaWxlIGkgPCAzNlxyXG4gICAgc1tpXSA9IGhleERpZ2l0cy5zdWJzdHIoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHgxMCksIDEpXHJcbiAgICBpICs9IDFcclxuICBzWzE0XSA9ICc0JyAjIGJpdHMgMTItMTUgb2YgdGhlIHRpbWVfaGlfYW5kX3ZlcnNpb24gZmllbGQgdG8gMDAxMFxyXG4gIHNbMTldID0gaGV4RGlnaXRzLnN1YnN0cigoc1sxOV0gJiAweDMpIHwgMHg4LCAxKSAjIGJpdHMgNi03IG9mIHRoZSBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkIHRvIDAxXHJcbiAgc1s4XSA9IHNbMTNdID0gc1sxOF0gPSBzWzIzXSA9ICctJ1xyXG4gIHV1aWQgPSBzLmpvaW4oJycpXHJcbiAgdXVpZFxyXG5cclxuT0oucmVnaXN0ZXIgJ2NyZWF0ZVVVSUQnLCBjcmVhdGVGYXV4VVVJRFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUZhdXhVVUlEIl19
