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



},{"./async/ajax.coffee":2,"./async/promise.coffee":3,"./components/grid.coffee":4,"./components/inputgroup.coffee":5,"./components/tabs.coffee":6,"./components/tile.coffee":7,"./controls/icon.coffee":8,"./core/date.coffee":9,"./core/function.coffee":10,"./core/number.coffee":11,"./core/object.coffee":12,"./core/string.coffee":14,"./dom/body.coffee":15,"./dom/component.coffee":16,"./dom/control.coffee":17,"./dom/dom.coffee":18,"./dom/element.coffee":19,"./dom/fragment.coffee":20,"./dom/generics.coffee":21,"./dom/input.coffee":22,"./dom/nodeFactory.coffee":23,"./elements/a.coffee":24,"./elements/br.coffee":25,"./elements/form.coffee":26,"./elements/input.coffee":27,"./elements/ol.coffee":28,"./elements/select.coffee":29,"./elements/table.coffee":30,"./elements/textarea.coffee":31,"./elements/thead.coffee":32,"./elements/ul.coffee":33,"./inputs/buttoninput.coffee":35,"./inputs/checkbox.coffee":36,"./inputs/color.coffee":37,"./inputs/date.coffee":38,"./inputs/datetime.coffee":39,"./inputs/datetimelocal.coffee":40,"./inputs/email.coffee":41,"./inputs/file.coffee":42,"./inputs/hidden.coffee":43,"./inputs/imageinput.coffee":44,"./inputs/month.coffee":45,"./inputs/number.coffee":46,"./inputs/password.coffee":47,"./inputs/radio.coffee":48,"./inputs/range.coffee":49,"./inputs/reset.coffee":50,"./inputs/search.coffee":51,"./inputs/submit.coffee":52,"./inputs/tel.coffee":53,"./inputs/textinput.coffee":54,"./inputs/time.coffee":55,"./inputs/url.coffee":56,"./inputs/week.coffee":57,"./oj.coffee":58,"./ojInit.coffee":59,"./tools/array2D.coffee":60,"./tools/console.coffee":61,"./tools/cookie.coffee":62,"./tools/defer.coffee":63,"./tools/each.coffee":64,"./tools/enums.coffee":65,"./tools/error.coffee":66,"./tools/history.coffee":67,"./tools/is.coffee":68,"./tools/noty.coffee":69,"./tools/pubsub.coffee":70,"./tools/queryString.coffee":71,"./tools/ranges.coffee":72,"./tools/to.coffee":73,"./tools/uuid.coffee":74}],2:[function(require,module,exports){
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



},{"../dom/component":16,"../oj":58,"../ojInit":59,"../tools/array2D":60}],5:[function(require,module,exports){
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
},{"../oj":58,"../tools/each":64,"../tools/is":68,"../tools/to":73,"./function":10,"./property":13}],13:[function(require,module,exports){
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
},{"../oj":58,"../tools/is":68,"../tools/to":73,"./body":15}],19:[function(require,module,exports){
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
},{"../oj":58,"../tools/is":68,"./nodeFactory":23}],20:[function(require,module,exports){
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
  method = function(options, owner) {
    var calledFromFactory, defaults, ret;
    if (owner == null) {
      owner = require('./body', calledFromFactory = false);
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



},{"../core/object":12,"../oj":58,"../ojInit":59,"./body":15,"./element":19}],22:[function(require,module,exports){
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
    parent = require('./body');
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
},{"../oj":58,"./body":15}],24:[function(require,module,exports){
var OJ, el, node, nodeName,
  __slice = [].slice;

OJ = require('../oj');

el = require('../dom/element');

nodeName = 'a';

node = function(options, owner, calledFromFactory) {
  var click, defaults, newClick, ret, toggle, toggleState;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../dom/body":15,"../dom/element":19,"../oj":58}],25:[function(require,module,exports){
var OJ, el, node, nodeName, to;

OJ = require('../oj');

el = require('../dom/element');

to = require('../tools/to');

nodeName = 'br';

node = function(options, owner, calledFromFactory) {
  var defaults, i, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../dom/body":15,"../dom/element":19,"../oj":58,"../tools/to":73}],26:[function(require,module,exports){
var OJ, el, node, nodeName;

OJ = require('../oj');

el = require('../dom/element');

nodeName = 'form';

node = function(options, owner, calledFromFactory) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../dom/body":15,"../dom/element":19,"../oj":58}],27:[function(require,module,exports){
var OJ, el, enums, node, nodeName,
  __slice = [].slice;

OJ = require('../oj');

el = require('../dom/element');

enums = require('../tools/enums');

nodeName = 'input';

node = function(options, owner, calledFromFactory) {
  var defaults, newChange, newClick, newFocusout, oldChange, oldClick, oldFocusout, ret, syncValue, thisType;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../dom/body":15,"../dom/element":19,"../oj":58,"../tools/enums":65}],28:[function(require,module,exports){
var OJ, el, node, nodeName;

OJ = require('../oj');

el = require('../dom/element');

nodeName = 'ol';

node = function(options, owner, calledFromFactory) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../dom/body":15,"../dom/element":19,"../oj":58}],29:[function(require,module,exports){
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
var $, OJ, array2D, el, node, nodeName, _;

OJ = require('../oj');

el = require('../dom/element');

_ = (typeof window !== "undefined" ? window._ : typeof global !== "undefined" ? global._ : null);

array2D = require('../tools/array2D');

$ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);

nodeName = 'table';


/*
Create an HTML table. Provides helper methods to create Columns and Cells.
 */

node = function(options, owner, calledFromFactory) {
  var cells, columnCount, defaults, fillMissing, init, loadCells, ret, rows, tbody, thead, theadRow;
  if (owner == null) {
    owner = require('../dom/body');
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
    var jBody, jHead, jTbl, tblStr;
    if (defaults.data) {
      tblStr = ConvertJsonToTable(defaults.data);
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
},{"../dom/body":15,"../dom/element":19,"../oj":58,"../tools/array2D":60}],31:[function(require,module,exports){
var OJ, el, enums, node, nodeName,
  __slice = [].slice;

OJ = require('../oj');

el = require('../dom/element');

enums = require('../tools/enums');

nodeName = 'textarea';

node = function(options, owner, calledFromFactory) {
  var change, click, defaults, newChange, newClick, ret, syncValue, value;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../dom/body":15,"../dom/element":19,"../oj":58,"../tools/enums":65}],32:[function(require,module,exports){
var OJ, el, node, nodeName;

OJ = require('../oj');

el = require('../dom/element');

nodeName = 'thead';

node = function(options, owner, calledFromFactory) {
  var cells, defaults, ret, rows;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../dom/body":15,"../dom/element":19,"../oj":58}],33:[function(require,module,exports){
var OJ, el, node, nodeName;

OJ = require('../oj');

el = require('../dom/element');

nodeName = 'ul';

node = function(options, owner, calledFromFactory) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../dom/body":15,"../dom/element":19,"../oj":58}],34:[function(require,module,exports){
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
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../oj":58}],36:[function(require,module,exports){
var OJ, inpt, input, inputName, obj;

OJ = require('../oj');

obj = require('../core/object');

input = require('../dom/input');

inputName = 'checkbox';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../oj":58}],37:[function(require,module,exports){
var OJ, inpt, input, inputName, obj;

OJ = require('../oj');

obj = require('../core/object');

input = require('../dom/input');

inputName = 'color';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../oj":58}],38:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

input = require('../dom/input');

inputName = 'date';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../oj":58}],39:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'datetime';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],40:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'datetime-local';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],41:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'email';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],42:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'file';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],43:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'hidden';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],44:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'imageinput';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],45:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'month';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],46:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'number';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],47:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'password';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],48:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'radio';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],49:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'range';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],50:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'reset';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],51:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'search';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],52:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'submit';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],53:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'tel';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],54:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'textinput';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],55:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'time';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],56:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'url';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],57:[function(require,module,exports){
var OJ, inpt, input, inputName;

OJ = require('../oj');

require('../core/object');

require('../dom/nodeFactory');

input = require('../dom/input');

inputName = 'week';

inpt = function(options, owner) {
  var defaults, ret;
  if (owner == null) {
    owner = require('../dom/body');
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



},{"../core/object":12,"../dom/body":15,"../dom/input":22,"../dom/nodeFactory":23,"../oj":58}],58:[function(require,module,exports){
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



},{"../oj":58}],61:[function(require,module,exports){
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



},{"../oj":58}],62:[function(require,module,exports){
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



},{"../oj":58}],63:[function(require,module,exports){
var OJ, defer;

OJ = require('../oj');

defer = function(method, waitMs) {
  if (setTimeout) {
    return setTimeout(method, waitMs);
  }
};

OJ.register('defer', defer);

module.exports = defer;



},{"../oj":58}],64:[function(require,module,exports){
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



},{"../oj":58}],65:[function(require,module,exports){
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



},{"../oj":58}],66:[function(require,module,exports){
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
},{"../core/number":11,"../oj":58,"./each":64,"./to":73}],69:[function(require,module,exports){
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
},{"../core/object":12,"../oj":58,"./each":64}],73:[function(require,module,exports){
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
},{"../core/object":12,"../oj":58,"./each":64,"./is":68}],74:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbnRyeXBvaW50LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcYXN5bmNcXGFqYXguY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxhc3luY1xccHJvbWlzZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXGdyaWQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb21wb25lbnRzXFxpbnB1dGdyb3VwLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGFicy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXHRpbGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb250cm9sc1xcaWNvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGRhdGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxmdW5jdGlvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG51bWJlci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG9iamVjdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXHByb3BlcnR5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxcc3RyaW5nLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxib2R5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxjb21wb25lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGNvbnRyb2wuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGRvbS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZWxlbWVudC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcZnJhZ21lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGdlbmVyaWNzLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxpbnB1dC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcbm9kZUZhY3RvcnkuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcYS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxici5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxmb3JtLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXG9sLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXHNlbGVjdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0YWJsZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0ZXh0YXJlYS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx0aGVhZC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFx1bC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGdsb2JhbC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcYnV0dG9uaW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGNoZWNrYm94LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxjb2xvci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZGF0ZXRpbWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGRhdGV0aW1lbG9jYWwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGVtYWlsLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxmaWxlLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxoaWRkZW4uY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGltYWdlaW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXG1vbnRoLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxudW1iZXIuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHBhc3N3b3JkLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxyYWRpby5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xccmFuZ2UuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJlc2V0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxzZWFyY2guY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHN1Ym1pdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdGVsLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx0ZXh0aW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHRpbWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHVybC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcd2Vlay5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXG9qLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcb2pJbml0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGFycmF5MkQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcY29uc29sZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxjb29raWUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZGVmZXIuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZWFjaC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlbnVtcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxlcnJvci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxoaXN0b3J5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGlzLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXG5vdHkuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xccHVic3ViLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHF1ZXJ5U3RyaW5nLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHJhbmdlcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFx0by5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFx1dWlkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLE9BQUEsQ0FBUSxhQUFSLENBQUEsQ0FBQTs7QUFBQSxPQUNBLENBQVEsaUJBQVIsQ0FEQSxDQUFBOztBQUFBLE9BRUEsQ0FBUSxxQkFBUixDQUZBLENBQUE7O0FBQUEsT0FHQSxDQUFRLHdCQUFSLENBSEEsQ0FBQTs7QUFBQSxPQUlBLENBQVEsMEJBQVIsQ0FKQSxDQUFBOztBQUFBLE9BS0EsQ0FBUSxnQ0FBUixDQUxBLENBQUE7O0FBQUEsT0FNQSxDQUFRLDBCQUFSLENBTkEsQ0FBQTs7QUFBQSxPQU9BLENBQVEsMEJBQVIsQ0FQQSxDQUFBOztBQUFBLE9BUUEsQ0FBUSx3QkFBUixDQVJBLENBQUE7O0FBQUEsT0FTQSxDQUFRLG9CQUFSLENBVEEsQ0FBQTs7QUFBQSxPQVVBLENBQVEsd0JBQVIsQ0FWQSxDQUFBOztBQUFBLE9BV0EsQ0FBUSxzQkFBUixDQVhBLENBQUE7O0FBQUEsT0FZQSxDQUFRLHNCQUFSLENBWkEsQ0FBQTs7QUFBQSxPQWFBLENBQVEsc0JBQVIsQ0FiQSxDQUFBOztBQUFBLE9BY0EsQ0FBUSxtQkFBUixDQWRBLENBQUE7O0FBQUEsT0FlQSxDQUFRLHdCQUFSLENBZkEsQ0FBQTs7QUFBQSxPQWdCQSxDQUFRLHNCQUFSLENBaEJBLENBQUE7O0FBQUEsT0FpQkEsQ0FBUSxrQkFBUixDQWpCQSxDQUFBOztBQUFBLE9Ba0JBLENBQVEsc0JBQVIsQ0FsQkEsQ0FBQTs7QUFBQSxPQW1CQSxDQUFRLHVCQUFSLENBbkJBLENBQUE7O0FBQUEsT0FvQkEsQ0FBUSx1QkFBUixDQXBCQSxDQUFBOztBQUFBLE9BcUJBLENBQVEsb0JBQVIsQ0FyQkEsQ0FBQTs7QUFBQSxPQXNCQSxDQUFRLDBCQUFSLENBdEJBLENBQUE7O0FBQUEsT0F1QkEsQ0FBUSxxQkFBUixDQXZCQSxDQUFBOztBQUFBLE9Bd0JBLENBQVEsc0JBQVIsQ0F4QkEsQ0FBQTs7QUFBQSxPQXlCQSxDQUFRLHdCQUFSLENBekJBLENBQUE7O0FBQUEsT0EwQkEsQ0FBUSx5QkFBUixDQTFCQSxDQUFBOztBQUFBLE9BMkJBLENBQVEsc0JBQVIsQ0EzQkEsQ0FBQTs7QUFBQSxPQTRCQSxDQUFRLDBCQUFSLENBNUJBLENBQUE7O0FBQUEsT0E2QkEsQ0FBUSx5QkFBUixDQTdCQSxDQUFBOztBQUFBLE9BOEJBLENBQVEsNEJBQVIsQ0E5QkEsQ0FBQTs7QUFBQSxPQStCQSxDQUFRLHlCQUFSLENBL0JBLENBQUE7O0FBQUEsT0FnQ0EsQ0FBUSxzQkFBUixDQWhDQSxDQUFBOztBQUFBLE9BaUNBLENBQVEsNkJBQVIsQ0FqQ0EsQ0FBQTs7QUFBQSxPQWtDQSxDQUFRLDBCQUFSLENBbENBLENBQUE7O0FBQUEsT0FtQ0EsQ0FBUSx1QkFBUixDQW5DQSxDQUFBOztBQUFBLE9Bb0NBLENBQVEsc0JBQVIsQ0FwQ0EsQ0FBQTs7QUFBQSxPQXFDQSxDQUFRLDBCQUFSLENBckNBLENBQUE7O0FBQUEsT0FzQ0EsQ0FBUSwrQkFBUixDQXRDQSxDQUFBOztBQUFBLE9BdUNBLENBQVEsdUJBQVIsQ0F2Q0EsQ0FBQTs7QUFBQSxPQXdDQSxDQUFRLHNCQUFSLENBeENBLENBQUE7O0FBQUEsT0F5Q0EsQ0FBUSx3QkFBUixDQXpDQSxDQUFBOztBQUFBLE9BMENBLENBQVEsNEJBQVIsQ0ExQ0EsQ0FBQTs7QUFBQSxPQTJDQSxDQUFRLHVCQUFSLENBM0NBLENBQUE7O0FBQUEsT0E0Q0EsQ0FBUSx3QkFBUixDQTVDQSxDQUFBOztBQUFBLE9BNkNBLENBQVEsMEJBQVIsQ0E3Q0EsQ0FBQTs7QUFBQSxPQThDQSxDQUFRLHVCQUFSLENBOUNBLENBQUE7O0FBQUEsT0ErQ0EsQ0FBUSx1QkFBUixDQS9DQSxDQUFBOztBQUFBLE9BZ0RBLENBQVEsdUJBQVIsQ0FoREEsQ0FBQTs7QUFBQSxPQWlEQSxDQUFRLHdCQUFSLENBakRBLENBQUE7O0FBQUEsT0FrREEsQ0FBUSx3QkFBUixDQWxEQSxDQUFBOztBQUFBLE9BbURBLENBQVEscUJBQVIsQ0FuREEsQ0FBQTs7QUFBQSxPQW9EQSxDQUFRLDJCQUFSLENBcERBLENBQUE7O0FBQUEsT0FxREEsQ0FBUSxzQkFBUixDQXJEQSxDQUFBOztBQUFBLE9Bc0RBLENBQVEscUJBQVIsQ0F0REEsQ0FBQTs7QUFBQSxPQXVEQSxDQUFRLHNCQUFSLENBdkRBLENBQUE7O0FBQUEsT0F3REEsQ0FBUSx3QkFBUixDQXhEQSxDQUFBOztBQUFBLE9BeURBLENBQVEsd0JBQVIsQ0F6REEsQ0FBQTs7QUFBQSxPQTBEQSxDQUFRLHVCQUFSLENBMURBLENBQUE7O0FBQUEsT0EyREEsQ0FBUSxzQkFBUixDQTNEQSxDQUFBOztBQUFBLE9BNERBLENBQVEscUJBQVIsQ0E1REEsQ0FBQTs7QUFBQSxPQTZEQSxDQUFRLHNCQUFSLENBN0RBLENBQUE7O0FBQUEsT0E4REEsQ0FBUSxzQkFBUixDQTlEQSxDQUFBOztBQUFBLE9BK0RBLENBQVEsd0JBQVIsQ0EvREEsQ0FBQTs7QUFBQSxPQWdFQSxDQUFRLG1CQUFSLENBaEVBLENBQUE7O0FBQUEsT0FpRUEsQ0FBUSxxQkFBUixDQWpFQSxDQUFBOztBQUFBLE9Ba0VBLENBQVEsdUJBQVIsQ0FsRUEsQ0FBQTs7QUFBQSxPQW1FQSxDQUFRLDRCQUFSLENBbkVBLENBQUE7O0FBQUEsT0FvRUEsQ0FBUSx1QkFBUixDQXBFQSxDQUFBOztBQUFBLE9BcUVBLENBQVEsbUJBQVIsQ0FyRUEsQ0FBQTs7QUFBQSxPQXNFQSxDQUFRLHFCQUFSLENBdEVBLENBQUE7Ozs7O0FDRUEsSUFBQSw2QkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLE1BRUEsR0FBUyxFQUZULENBQUE7O0FBQUEsTUFLTSxDQUFDLFNBQVAsR0FBbUIsU0FBQyxJQUFELEVBQU8sSUFBUCxFQUFhLEdBQWIsR0FBQTtBQUNqQixNQUFBLFFBQUE7QUFBQSxFQUFBLFFBQUEsR0FBVyxFQUFYLENBQUE7QUFBQSxFQUNBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixJQUFwQixDQURBLENBQUE7QUFBQSxFQUVBLElBQUksQ0FBQyxTQUFMLENBQWUsUUFBZixDQUZBLENBQUE7QUFHQSxFQUFBLElBQUcsRUFBRSxDQUFDLFlBQU47QUFDRSxJQUFBLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBWCxDQUFpQjtNQUNmO0FBQUEsUUFBQSxVQUFBLEVBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUExQjtBQUFBLFFBQ0EsU0FBQSxFQUFXLElBQUksQ0FBQyxTQURoQjtBQUFBLFFBRUEsT0FBQSxFQUFhLElBQUEsSUFBQSxDQUFBLENBRmI7T0FEZTtLQUFqQixDQUFBLENBREY7R0FKaUI7QUFBQSxDQUxuQixDQUFBOztBQUFBLE1Ba0JNLENBQUMsT0FBUCxHQUFpQixTQUFDLGNBQUQsRUFBaUIsVUFBakIsRUFBNkIsTUFBN0IsRUFBcUMsSUFBckMsR0FBQTs7SUFBcUMsT0FBTyxFQUFFLENBQUMsTUFBSCxDQUFBO0dBQzNEO0FBQUEsRUFBQSxJQUFHLFVBQUEsS0FBZ0IsT0FBbkI7QUFDRSxJQUFBLElBQUcsRUFBRSxDQUFDLG1CQUFOO0FBQ0UsTUFBQSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQVgsQ0FBaUI7UUFDZjtBQUFBLFVBQUEsVUFBQSxFQUFZLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBMUI7QUFBQSxVQUNBLElBQUEsRUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBRHBCO0FBQUEsVUFFQSxNQUFBLEVBQVEsVUFGUjtBQUFBLFVBR0EsS0FBQSxFQUFPLGNBQWMsQ0FBQyxLQUFmLENBQUEsQ0FIUDtBQUFBLFVBSUEsTUFBQSxFQUFRLGNBQWMsQ0FBQyxNQUp2QjtBQUFBLFVBS0EsVUFBQSxFQUFZLGNBQWMsQ0FBQyxVQUwzQjtBQUFBLFVBTUEsVUFBQSxFQUFZLGNBQWMsQ0FBQyxVQU4zQjtBQUFBLFVBT0EsWUFBQSxFQUFjLGNBQWMsQ0FBQyxZQVA3QjtTQURlO09BQWpCLENBQUEsQ0FERjtLQUFBO0FBQUEsSUFZQSxJQUFJLENBQUMsT0FBTCxDQUFhLFVBQWIsQ0FaQSxDQURGO0dBRGU7QUFBQSxDQWxCakIsQ0FBQTs7QUFBQSxXQW9DQSxHQUFjLFNBQUMsSUFBRCxHQUFBO0FBQ1osTUFBQSxHQUFBO0FBQUEsRUFBQSxJQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTixDQUFhLElBQWIsQ0FBSDtBQUNFLElBQUEsR0FBQSxHQUFNLElBQU4sQ0FBQTtBQUFBLElBQ0EsSUFBQSxHQUFPLEVBQUUsQ0FBQyxNQUFILENBQUEsQ0FEUCxDQUFBO0FBQUEsSUFFQSxJQUFJLENBQUMsR0FBTCxDQUFTLFVBQVQsRUFBcUIsRUFBRSxDQUFDLE1BQUgsQ0FBQSxDQUFyQixDQUZBLENBQUE7QUFBQSxJQUdBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixLQUFsQixFQUF5QixHQUF6QixDQUhBLENBREY7R0FBQTtTQUtBLEtBTlk7QUFBQSxDQXBDZCxDQUFBOztBQUFBLE1Ba0RNLENBQUMsV0FBUCxHQUFxQixTQUFDLElBQUQsRUFBZSxJQUFmLEdBQUE7QUFDbkIsTUFBQSxvQ0FBQTs7SUFEb0IsT0FBTztHQUMzQjtBQUFBLEVBQUEsUUFBQSxHQUNFO0FBQUEsSUFBQSxRQUFBLEVBQ0U7QUFBQSxNQUFBLEdBQUEsRUFBSyxFQUFMO0FBQUEsTUFDQSxJQUFBLEVBQU0sRUFETjtBQUFBLE1BRUEsSUFBQSxFQUFNLElBRk47QUFBQSxNQUdBLFNBQUEsRUFDRTtBQUFBLFFBQUEsZUFBQSxFQUFpQixJQUFqQjtPQUpGO0FBQUEsTUFLQSxRQUFBLEVBQVUsTUFMVjtBQUFBLE1BTUEsV0FBQSxFQUFhLGlDQU5iO0tBREY7QUFBQSxJQVNBLFNBQUEsRUFBVyxFQUFFLENBQUMsSUFUZDtBQUFBLElBVUEsT0FBQSxFQUFTLEVBQUUsQ0FBQyxJQVZaO0FBQUEsSUFXQSxVQUFBLEVBQVksRUFBRSxDQUFDLElBWGY7QUFBQSxJQVlBLGFBQUEsRUFBZSxLQVpmO0FBQUEsSUFhQSxXQUFBLEVBQWEsSUFiYjtBQUFBLElBY0EsUUFBQSxFQUFVLEtBZFY7R0FERixDQUFBO0FBQUEsRUFpQkEsSUFBQSxHQUFPLFdBQUEsQ0FBWSxJQUFaLENBakJQLENBQUE7QUFBQSxFQWtCQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsSUFBcEIsRUFBMEIsSUFBMUIsQ0FsQkEsQ0FBQTtBQUFBLEVBb0JBLFFBQVEsQ0FBQyxTQUFULEdBQXlCLElBQUEsSUFBQSxDQUFBLENBcEJ6QixDQUFBO0FBc0JBLEVBQUEsSUFBRyxLQUFBLEtBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFOLENBQWtCLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBcEMsQ0FBWjtBQUVFLElBQUEsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQWxCLEtBQTBCLEtBQTdCO0FBQ0UsTUFBQSxRQUFRLENBQUMsUUFBUSxDQUFDLElBQWxCLEdBQXlCLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUE1QixDQUF6QixDQURGO0tBQUEsTUFBQTtBQUlFLE1BQUEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFsQixHQUF5QixFQUFFLENBQUMsU0FBSCxDQUFhLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBL0IsQ0FBekIsQ0FKRjtLQUZGO0dBdEJBO0FBQUEsRUE4QkEsaUJBQUEsR0FBb0IsU0FBQyxXQUFELEdBQUE7QUFDbEIsUUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sQ0FBQyxDQUFDLElBQUYsQ0FBTyxRQUFRLENBQUMsUUFBaEIsQ0FBTixDQUFBO0FBQUEsSUFFQSxHQUFHLENBQUMsSUFBSixDQUFTLFNBQUMsSUFBRCxFQUFPLFVBQVAsRUFBbUIsS0FBbkIsR0FBQTthQUNQLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFFBQWpCLEVBQTJCLElBQTNCLEVBRE87SUFBQSxDQUFULENBRkEsQ0FBQTtBQUFBLElBS0EsR0FBRyxDQUFDLElBQUosQ0FBUyxTQUFDLEtBQUQsRUFBUSxVQUFSLEVBQW9CLFNBQXBCLEdBQUE7YUFDUCxNQUFNLENBQUMsT0FBUCxDQUFlLEtBQWYsRUFBc0IsVUFBdEIsRUFBa0MsU0FBbEMsRUFBNkMsUUFBN0MsRUFETztJQUFBLENBQVQsQ0FMQSxDQUFBO0FBQUEsSUFRQSxHQUFHLENBQUMsTUFBSixDQUFXLFNBQUMsY0FBRCxFQUFpQixVQUFqQixHQUFBO2FBQ1QsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsY0FBcEIsRUFBb0MsVUFBcEMsRUFEUztJQUFBLENBQVgsQ0FSQSxDQUFBO1dBV0EsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFULENBQXFCLEdBQXJCLEVBWmtCO0VBQUEsQ0E5QnBCLENBQUE7QUFBQSxFQTRDQSxPQUFBLEdBQVUsaUJBQUEsQ0FBa0IsUUFBUSxDQUFDLFdBQTNCLENBNUNWLENBQUE7U0E2Q0EsUUE5Q21CO0FBQUEsQ0FsRHJCLENBQUE7O0FBQUEsSUFrR0EsR0FBTyxFQWxHUCxDQUFBOztBQUFBLElBeUdJLENBQUMsSUFBTCxHQUFZLFNBQUMsSUFBRCxHQUFBO1NBQ1YsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsTUFBbkIsRUFBMkIsSUFBM0IsRUFEVTtBQUFBLENBekdaLENBQUE7O0FBQUEsSUFrSEksQ0FBQyxHQUFMLEdBQVcsU0FBQyxJQUFELEdBQUE7U0FDVCxNQUFNLENBQUMsV0FBUCxDQUFtQixLQUFuQixFQUEwQixJQUExQixFQURTO0FBQUEsQ0FsSFgsQ0FBQTs7QUFBQSxJQTBISSxDQUFDLFFBQUQsQ0FBSixHQUFjLFNBQUMsSUFBRCxHQUFBO1NBQ1osTUFBTSxDQUFDLFdBQVAsQ0FBbUIsUUFBbkIsRUFBNkIsSUFBN0IsRUFEWTtBQUFBLENBMUhkLENBQUE7O0FBQUEsSUFrSUksQ0FBQyxHQUFMLEdBQVcsU0FBQyxJQUFELEdBQUE7U0FDVCxNQUFNLENBQUMsV0FBUCxDQUFtQixLQUFuQixFQUEwQixJQUExQixFQURTO0FBQUEsQ0FsSVgsQ0FBQTs7QUFBQSxFQXFJRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLE1BQWxCLEVBQTBCLElBQTFCLENBcklBLENBQUE7O0FBQUEsTUFzSU0sQ0FBQyxPQUFQLEdBQWlCLElBdElqQixDQUFBOzs7OztBQ0FBLElBQUEsMEJBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxXQUtBLEdBQWMsU0FBQyxJQUFELEdBQUE7QUFDWixNQUFBLE9BQUE7QUFBQSxFQUFBLE9BQUEsR0FBVSxPQUFPLENBQUMsT0FBUixDQUFnQixJQUFoQixDQUFWLENBQUE7QUFBQSxFQUNBLE9BQU8sQ0FBQyxLQUFSLEdBQWdCLElBQUksQ0FBQyxLQURyQixDQUFBO0FBQUEsRUFFQSxPQUFPLENBQUMsVUFBUixHQUFxQixJQUFJLENBQUMsVUFGMUIsQ0FBQTtTQUdBLFFBSlk7QUFBQSxDQUxkLENBQUE7O0FBQUEsR0FjQSxHQUFNLFNBQUMsU0FBRCxHQUFBO0FBQ0osTUFBQSxhQUFBO0FBQUEsRUFBQSxJQUFBLEdBQU8sU0FBQSxJQUFhLEVBQXBCLENBQUE7QUFBQSxFQUNBLE9BQUEsR0FBVSxPQUFPLENBQUMsR0FBUixDQUFZLElBQVosQ0FEVixDQUFBO0FBQUEsRUFFQSxPQUFPLENBQUMsSUFBUixHQUFlLFNBQUMsSUFBRCxHQUFBO0FBQ2IsSUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FBQSxDQURhO0VBQUEsQ0FGZixDQUFBO1NBS0EsUUFOSTtBQUFBLENBZE4sQ0FBQTs7QUFBQSxJQXlCQSxHQUFPLFNBQUMsSUFBRCxHQUFBO0FBQ0wsTUFBQSxHQUFBOztJQURNLE9BQU8sRUFBRSxDQUFDO0dBQ2hCO0FBQUEsRUFBQSxHQUFBLEdBQU0sT0FBTyxDQUFDLE1BQVIsQ0FBZSxJQUFmLENBQU4sQ0FBQTtTQUNBLElBRks7QUFBQSxDQXpCUCxDQUFBOztBQUFBLEVBOEJFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsT0FBbEIsRUFBMkIsSUFBM0IsQ0E5QkEsQ0FBQTs7QUFBQSxFQStCRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLEtBQWxCLEVBQXlCLEdBQXpCLENBL0JBLENBQUE7O0FBQUEsRUFnQ0UsQ0FBQyxLQUFLLENBQUMsUUFBVCxDQUFrQixhQUFsQixFQUFpQyxXQUFqQyxDQWhDQSxDQUFBOztBQUFBLE1Ba0NNLENBQUMsT0FBUCxHQUNFO0FBQUEsRUFBQSxLQUFBLEVBQU8sSUFBUDtBQUFBLEVBQ0EsR0FBQSxFQUFLLEdBREw7QUFBQSxFQUVBLFdBQUEsRUFBYSxXQUZiO0NBbkNGLENBQUE7Ozs7O0FDRkEsSUFBQSxrREFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLE9BQ0EsQ0FBUSxXQUFSLENBREEsQ0FBQTs7QUFBQSxTQUVBLEdBQVksT0FBQSxDQUFRLGtCQUFSLENBRlosQ0FBQTs7QUFBQSxPQUdBLEdBQVUsT0FBQSxDQUFRLGtCQUFSLENBSFYsQ0FBQTs7QUFBQSxRQUtBLEdBQVcsUUFMWCxDQUFBOztBQUFBLFNBTUEsR0FBWSxNQU5aLENBQUE7O0FBQUEsRUFPRSxDQUFDLFVBQVUsQ0FBQyxPQUFRLENBQUEsU0FBQSxDQUF0QixHQUFtQyxRQVBuQyxDQUFBOztBQUFBLEtBU0EsR0FBUSxTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFDTixNQUFBLHVDQUFBO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLFNBQUEsRUFDRTtBQUFBLE1BQUEsU0FBQSxFQUFXLEVBQVg7QUFBQSxNQUNBLFVBQUEsRUFBWSxFQURaO0FBQUEsTUFFQSxTQUFBLEVBQVcsRUFGWDtLQURGO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLE9BQUEsRUFBTyxNQUFQO0tBTEY7R0FERixDQUFBO0FBQUEsRUFRQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FSQSxDQUFBO0FBQUEsRUFTQSxHQUFBLEdBQU0sU0FBQSxDQUFVLFFBQVYsRUFBb0IsS0FBcEIsRUFBMkIsUUFBM0IsQ0FUTixDQUFBO0FBQUEsRUFXQSxJQUFBLEdBQU8sRUFYUCxDQUFBO0FBQUEsRUFZQSxLQUFBLEdBQVEsT0FBQSxDQUFBLENBWlIsQ0FBQTtBQUFBLEVBY0EsV0FBQSxHQUFjLFNBQUEsR0FBQTtXQUNaLEtBQUssQ0FBQyxJQUFOLENBQVcsU0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEdBQWYsR0FBQTtBQUNULFVBQUEsR0FBQTtBQUFBLE1BQUEsSUFBRyxDQUFBLEdBQUg7QUFDRSxRQUFBLEdBQUEsR0FBTSxHQUFHLENBQUMsR0FBSixDQUFRLEtBQVIsQ0FBTixDQUFBO2VBQ0EsR0FBRyxDQUFDLElBQUosQ0FBUyxNQUFULEVBQWlCLEtBQWpCLEVBQXdCLEVBQXhCLEVBRkY7T0FEUztJQUFBLENBQVgsRUFEWTtFQUFBLENBZGQsQ0FBQTtBQUFBLEVBb0JBLEdBQUcsQ0FBQyxHQUFKLENBQVEsS0FBUixFQUFlLFNBQUMsS0FBRCxHQUFBO0FBQ2IsUUFBQSxLQUFBOztNQURjLFFBQVEsSUFBSSxDQUFDLE1BQUwsR0FBWSxDQUFaLElBQWlCO0tBQ3ZDO0FBQUEsSUFBQSxLQUFBLEdBQVEsSUFBSyxDQUFBLEtBQUEsR0FBTSxDQUFOLENBQWIsQ0FBQTtBQUNBLElBQUEsSUFBRyxDQUFBLEtBQUg7QUFDRSxhQUFNLElBQUksQ0FBQyxNQUFMLEdBQWMsS0FBcEIsR0FBQTtBQUNFLFFBQUEsS0FBQSxHQUFRLEdBQUcsQ0FBQyxJQUFKLENBQVMsS0FBVCxFQUFnQjtBQUFBLFVBQUEsS0FBQSxFQUFPO0FBQUEsWUFBQSxPQUFBLEVBQU8sS0FBUDtXQUFQO1NBQWhCLENBQVIsQ0FBQTtBQUFBLFFBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFWLENBREEsQ0FERjtNQUFBLENBQUE7QUFBQSxNQUdBLEtBQUssQ0FBQyxHQUFOLENBQVUsTUFBVixFQUFrQixTQUFDLEtBQUQsRUFBUSxJQUFSLEdBQUE7QUFDaEIsWUFBQSxNQUFBO0FBQUEsUUFBQSxJQUFBLEdBQU8sRUFBRSxDQUFDLE1BQUgsQ0FBVyxFQUFFLENBQUMsTUFBSCxDQUFVLEVBQVYsRUFBYyxRQUFRLENBQUMsU0FBdkIsQ0FBWCxFQUE4QyxJQUE5QyxDQUFQLENBQUE7QUFBQSxRQUNBLE1BQUEsR0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQWQsQ0FBbUIsSUFBbkIsRUFBeUIsS0FBekIsQ0FEVCxDQUFBO0FBQUEsUUFFQSxLQUFLLENBQUMsR0FBTixDQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBd0IsTUFBeEIsQ0FGQSxDQUFBO2VBR0EsT0FKZ0I7TUFBQSxDQUFsQixDQUhBLENBREY7S0FEQTtXQVVBLE1BWGE7RUFBQSxDQUFmLENBcEJBLENBQUE7QUFBQSxFQWlDQSxHQUFHLENBQUMsR0FBSixDQUFRLE1BQVIsRUFBZ0IsU0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLElBQWYsR0FBQTtBQUNkLFFBQUEscUJBQUE7QUFBQSxJQUFBLElBQUcsQ0FBQSxLQUFBLElBQWEsS0FBQSxHQUFRLENBQXhCO0FBQStCLE1BQUEsS0FBQSxHQUFRLENBQVIsQ0FBL0I7S0FBQTtBQUNBLElBQUEsSUFBRyxDQUFBLEtBQUEsSUFBYSxLQUFBLEdBQVEsQ0FBeEI7QUFBK0IsTUFBQSxLQUFBLEdBQVEsQ0FBUixDQUEvQjtLQURBO0FBQUEsSUFHQSxHQUFBLEdBQU0sR0FBRyxDQUFDLEdBQUosQ0FBUSxLQUFSLENBSE4sQ0FBQTtBQUFBLElBSUEsSUFBQSxHQUFPLEtBQUssQ0FBQyxHQUFOLENBQVUsS0FBVixFQUFpQixLQUFqQixDQUpQLENBQUE7QUFNQSxJQUFBLElBQUcsQ0FBQSxJQUFIO0FBQ0UsTUFBQSxDQUFBLEdBQUksQ0FBSixDQUFBO0FBQ0EsYUFBTSxDQUFBLEdBQUksS0FBVixHQUFBO0FBQ0UsUUFBQSxDQUFBLElBQUssQ0FBTCxDQUFBO0FBQUEsUUFDQSxPQUFBLEdBQVUsS0FBSyxDQUFDLEdBQU4sQ0FBVSxLQUFWLEVBQWlCLENBQWpCLENBRFYsQ0FBQTtBQUVBLFFBQUEsSUFBRyxDQUFBLE9BQUg7QUFDRSxVQUFBLElBQUcsQ0FBQSxLQUFLLEtBQVI7QUFDRSxZQUFBLElBQUEsR0FBTyxHQUFHLENBQUMsSUFBSixDQUFTLE1BQVQsRUFBaUIsSUFBakIsQ0FBUCxDQURGO1dBQUEsTUFFSyxJQUFHLENBQUEsSUFBSDtBQUNILFlBQUEsR0FBRyxDQUFDLElBQUosQ0FBUyxNQUFULENBQUEsQ0FERztXQUhQO1NBSEY7TUFBQSxDQUZGO0tBTkE7QUFBQSxJQWlCQSxXQUFBLENBQUEsQ0FqQkEsQ0FBQTtXQWtCQSxLQW5CYztFQUFBLENBQWhCLENBakNBLENBQUE7U0FzREEsSUF2RE07QUFBQSxDQVRSLENBQUE7O0FBQUEsRUFrRUUsQ0FBQyxVQUFVLENBQUMsUUFBZCxDQUF1QixTQUF2QixFQUFrQyxLQUFsQyxDQWxFQSxDQUFBOztBQUFBLE1BbUVNLENBQUMsT0FBUCxHQUFpQixLQW5FakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLCtDQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsT0FDQSxDQUFRLFdBQVIsQ0FEQSxDQUFBOztBQUFBLFNBRUEsR0FBWSxPQUFBLENBQVEsa0JBQVIsQ0FGWixDQUFBOztBQUFBLElBR0EsR0FBTyxPQUFBLENBQVEsZUFBUixDQUhQLENBQUE7O0FBQUEsUUFLQSxHQUFXLGVBTFgsQ0FBQTs7QUFBQSxTQU1BLEdBQVksWUFOWixDQUFBOztBQUFBLEVBUUUsQ0FBQyxVQUFVLENBQUMsT0FBUSxDQUFBLFNBQUEsQ0FBdEIsR0FBbUMsUUFSbkMsQ0FBQTs7QUFBQSxLQVVBLEdBQVEsU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBQ04sTUFBQSwyQkFBQTtBQUFBLEVBQUEsS0FBQSxHQUFRLElBQUEsQ0FBQSxDQUFSLENBQUE7QUFBQSxFQUNBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxPQUFBLEVBQU8sWUFBUDtLQURGO0FBQUEsSUFFQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLE1BQUEsRUFBUSxFQUFFLENBQUMsSUFBWDtLQUhGO0FBQUEsSUFJQSxLQUFBLEVBQUssS0FKTDtBQUFBLElBS0EsU0FBQSxFQUFXLEVBTFg7QUFBQSxJQU1BLFNBQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUNFO0FBQUEsUUFBQSxFQUFBLEVBQUksS0FBSjtBQUFBLFFBQ0EsSUFBQSxFQUFNLE1BRE47QUFBQSxRQUVBLE9BQUEsRUFBTyxFQUZQO0FBQUEsUUFHQSxXQUFBLEVBQWEsRUFIYjtBQUFBLFFBSUEsS0FBQSxFQUFPLEVBSlA7T0FERjtLQVBGO0dBRkYsQ0FBQTtBQUFBLEVBZ0JBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQWhCQSxDQUFBO0FBQUEsRUFpQkEsR0FBQSxHQUFNLFNBQUEsQ0FBVSxRQUFWLEVBQW9CLEtBQXBCLEVBQTJCLFFBQTNCLENBakJOLENBQUE7QUFBQSxFQW1CQSxLQUFBLEdBQVEsR0FBRyxDQUFDLElBQUosQ0FBUyxLQUFULEVBQWdCO0FBQUEsSUFBQSxLQUFBLEVBQU87QUFBQSxNQUFBLE9BQUEsRUFBTyxZQUFQO0tBQVA7R0FBaEIsQ0FuQlIsQ0FBQTtBQUFBLEVBcUJBLEdBQUcsQ0FBQyxVQUFKLEdBQWlCLEtBQUssQ0FBQyxJQUFOLENBQVcsT0FBWCxFQUFvQjtBQUFBLElBQUEsS0FBQSxFQUFPO0FBQUEsTUFBRSxLQUFBLEVBQUssS0FBUDtLQUFQO0FBQUEsSUFBdUIsSUFBQSxFQUFNLFFBQVEsQ0FBQyxTQUF0QztHQUFwQixDQXJCakIsQ0FBQTtBQUFBLEVBdUJBLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQUQsQ0FBeEIsSUFBa0MsZUF2QmxDLENBQUE7QUFBQSxFQXdCQSxHQUFHLENBQUMsVUFBSixHQUFpQixLQUFLLENBQUMsSUFBTixDQUFXLE9BQVgsRUFBb0IsUUFBUSxDQUFDLFNBQTdCLENBeEJqQixDQUFBO0FBQUEsRUEwQkEsR0FBRyxDQUFDLFVBQUosR0FBaUIsU0FBQSxHQUFBO1dBQ2YsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFmLENBQUEsRUFEZTtFQUFBLENBMUJqQixDQUFBO1NBNkJBLElBOUJNO0FBQUEsQ0FWUixDQUFBOztBQUFBLEVBMENFLENBQUMsVUFBVSxDQUFDLFFBQWQsQ0FBdUIsU0FBdkIsRUFBa0MsS0FBbEMsQ0ExQ0EsQ0FBQTs7QUFBQSxNQTJDTSxDQUFDLE9BQVAsR0FBaUIsS0EzQ2pCLENBQUE7Ozs7O0FDQUEsSUFBQSx5Q0FBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLE9BQ0EsQ0FBUSxXQUFSLENBREEsQ0FBQTs7QUFBQSxTQUVBLEdBQVksT0FBQSxDQUFRLGtCQUFSLENBRlosQ0FBQTs7QUFBQSxRQUlBLEdBQVcsUUFKWCxDQUFBOztBQUFBLFNBS0EsR0FBWSxNQUxaLENBQUE7O0FBQUEsRUFPRSxDQUFDLFVBQVUsQ0FBQyxPQUFRLENBQUEsU0FBQSxDQUF0QixHQUFtQyxRQVBuQyxDQUFBOztBQUFBLEtBU0EsR0FBUSxTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFDTixNQUFBLG1DQUFBO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLElBQUEsRUFBTSxFQUFOO0FBQUEsSUFDQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLE9BQUEsRUFBTyxFQUFQO0tBRkY7R0FERixDQUFBO0FBQUEsRUFLQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FMQSxDQUFBO0FBQUEsRUFNQSxHQUFBLEdBQU0sU0FBQSxDQUFVLFFBQVYsRUFBb0IsS0FBcEIsRUFBMkIsUUFBM0IsQ0FOTixDQUFBO0FBQUEsRUFRQSxJQUFBLEdBQU8sR0FBRyxDQUFDLElBQUosQ0FBUyxJQUFULEVBQWU7QUFBQSxJQUFBLEtBQUEsRUFBTztBQUFBLE1BQUEsT0FBQSxFQUFPLGNBQVA7S0FBUDtHQUFmLENBUlAsQ0FBQTtBQUFBLEVBU0EsT0FBQSxHQUFVLEdBQUcsQ0FBQyxJQUFKLENBQVMsS0FBVCxFQUFnQjtBQUFBLElBQUEsS0FBQSxFQUFPO0FBQUEsTUFBQSxPQUFBLEVBQU8sYUFBUDtLQUFQO0dBQWhCLENBVFYsQ0FBQTtBQUFBLEVBV0EsS0FBQSxHQUFRLElBWFIsQ0FBQTtBQUFBLEVBWUEsRUFBRSxDQUFDLElBQUgsQ0FBUSxRQUFRLENBQUMsSUFBakIsRUFBdUIsU0FBQyxNQUFELEVBQVMsT0FBVCxHQUFBO0FBQ3JCLFFBQUEsNEJBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxFQUFYLENBQUE7QUFDQSxJQUFBLElBQUcsS0FBSDtBQUNFLE1BQUEsS0FBQSxHQUFRLEtBQVIsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLFFBRFgsQ0FERjtLQURBO0FBQUEsSUFJQSxDQUFBLEdBQUksSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWLEVBQWdCO0FBQUEsTUFBQSxLQUFBLEVBQU87QUFBQSxRQUFBLE9BQUEsRUFBTyxRQUFQO09BQVA7S0FBaEIsQ0FDRixDQUFDLElBREMsQ0FDSSxHQURKLEVBRUE7QUFBQSxNQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsTUFDQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxHQUFBLEdBQU0sT0FBWjtBQUFBLFFBQ0EsYUFBQSxFQUFlLEtBRGY7T0FGRjtBQUFBLE1BSUEsTUFBQSxFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sU0FBQSxHQUFBO2lCQUNMLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBSixDQUFRLE1BQVIsRUFESztRQUFBLENBQVA7T0FMRjtLQUZBLENBSkosQ0FBQTtBQUFBLElBY0EsZUFBQSxHQUFrQixXQUFBLEdBQWMsUUFkaEMsQ0FBQTtXQWVBLEdBQUcsQ0FBQyxHQUFKLENBQVEsT0FBUixFQUFpQixPQUFPLENBQUMsSUFBUixDQUFhLEtBQWIsRUFBb0I7QUFBQSxNQUFBLEtBQUEsRUFBTztBQUFBLFFBQUEsT0FBQSxFQUFPLGVBQVA7QUFBQSxRQUF3QixFQUFBLEVBQUksT0FBNUI7T0FBUDtLQUFwQixDQUFqQixFQWhCcUI7RUFBQSxDQUF2QixDQVpBLENBQUE7U0E4QkEsSUEvQk07QUFBQSxDQVRSLENBQUE7O0FBQUEsRUEwQ0UsQ0FBQyxVQUFVLENBQUMsUUFBZCxDQUF1QixTQUF2QixFQUFrQyxLQUFsQyxDQTFDQSxDQUFBOztBQUFBLE1BMkNNLENBQUMsT0FBUCxHQUFpQixLQTNDakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLHlDQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsT0FDQSxDQUFRLFdBQVIsQ0FEQSxDQUFBOztBQUFBLFNBRUEsR0FBWSxPQUFBLENBQVEsa0JBQVIsQ0FGWixDQUFBOztBQUFBLFFBSUEsR0FBVyxRQUpYLENBQUE7O0FBQUEsU0FLQSxHQUFZLE1BTFosQ0FBQTs7QUFBQSxFQU9FLENBQUMsVUFBVSxDQUFDLE9BQVEsQ0FBQSxTQUFBLENBQXRCLEdBQW1DLFFBUG5DLENBQUE7O0FBQUEsS0FTQSxHQUFRLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUNOLE1BQUEsYUFBQTtBQUFBLEVBQUEsUUFBQSxHQUNFO0FBQUEsSUFBQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsTUFDQSxFQUFBLEVBQUksRUFESjtBQUFBLE1BRUEsRUFBQSxFQUFJLEVBRko7QUFBQSxNQUdBLEVBQUEsRUFBSSxFQUhKO0tBREY7QUFBQSxJQUtBLEtBQUEsRUFDRTtBQUFBLE1BQUEsT0FBQSxFQUFPLE1BQVA7S0FORjtHQURGLENBQUE7QUFBQSxFQVNBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVRBLENBQUE7QUFVQSxFQUFBLElBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFsQjtBQUEwQixJQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBRCxDQUFkLElBQXdCLFVBQUEsR0FBYSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQXBELENBQTFCO0dBVkE7QUFXQSxFQUFBLElBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFsQjtBQUEwQixJQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBRCxDQUFkLElBQXdCLFVBQUEsR0FBYSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQXBELENBQTFCO0dBWEE7QUFZQSxFQUFBLElBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFsQjtBQUEwQixJQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBRCxDQUFkLElBQXdCLFVBQUEsR0FBYSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQXBELENBQTFCO0dBWkE7QUFhQSxFQUFBLElBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFsQjtBQUEwQixJQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBRCxDQUFkLElBQXdCLFVBQUEsR0FBYSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQXBELENBQTFCO0dBYkE7QUFBQSxFQWVBLEdBQUEsR0FBTSxFQUFFLENBQUMsU0FBSCxDQUFhLFFBQWIsRUFBdUIsS0FBdkIsRUFBOEIsUUFBOUIsQ0FmTixDQUFBO1NBZ0JBLElBakJNO0FBQUEsQ0FUUixDQUFBOztBQUFBLEVBNEJFLENBQUMsVUFBVSxDQUFDLFFBQWQsQ0FBdUIsU0FBdkIsRUFBa0MsS0FBbEMsQ0E1QkEsQ0FBQTs7QUFBQSxNQTZCTSxDQUFDLE9BQVAsR0FBaUIsS0E3QmpCLENBQUE7Ozs7O0FDQUEsSUFBQSw2Q0FBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLE9BQ0EsQ0FBUSxXQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLEdBQVUsT0FBQSxDQUFRLGdCQUFSLENBRlYsQ0FBQTs7QUFBQSxXQUlBLEdBQWMsUUFKZCxDQUFBOztBQUFBLFlBS0EsR0FBZSxNQUxmLENBQUE7O0FBQUEsRUFPRSxDQUFDLFFBQVEsQ0FBQyxPQUFRLENBQUEsWUFBQSxDQUFwQixHQUFvQyxXQVBwQyxDQUFBOztBQUFBLEtBU0EsR0FBUSxTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFDTixNQUFBLGtEQUFBO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLFFBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLEVBQU47QUFBQSxNQUNBLFdBQUEsRUFBYSxFQURiO0FBQUEsTUFFQSxRQUFBLEVBQVUsRUFGVjtBQUFBLE1BR0EsSUFBQSxFQUFNLEtBSE47QUFBQSxNQUlBLEtBQUEsRUFBTyxFQUpQO0FBQUEsTUFLQSxPQUFBLEVBQVMsRUFMVDtBQUFBLE1BTUEsWUFBQSxFQUFjLEtBTmQ7QUFBQSxNQU9BLE1BQUEsRUFBUSxLQVBSO0FBQUEsTUFRQSxTQUFBLEVBQVcsS0FSWDtLQURGO0FBQUEsSUFVQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLE9BQUEsRUFBTyxFQUFQO0tBWEY7QUFBQSxJQVlBLFlBQUEsRUFBYyxNQVpkO0dBREYsQ0FBQTtBQUFBLEVBZUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLENBZkEsQ0FBQTtBQUFBLEVBZ0JBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUixFQUFrQixLQUFsQixFQUF5QixXQUF6QixDQWhCTixDQUFBO0FBQUEsRUFrQkEsU0FBQSxHQUFZLEtBbEJaLENBQUE7QUFBQSxFQXVCQSxhQUFBLEdBQWdCLEtBdkJoQixDQUFBO0FBd0JBLEVBQUEsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQXJCO0FBQXVDLElBQUEsYUFBQSxJQUFpQixRQUFqQixDQUF2QztHQXhCQTtBQXlCQSxFQUFBLElBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFyQjtBQUFpQyxJQUFBLGFBQUEsSUFBaUIsUUFBakIsQ0FBakM7R0F6QkE7QUEwQkEsRUFBQSxJQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBckI7QUFBb0MsSUFBQSxhQUFBLElBQWlCLFVBQWpCLENBQXBDO0dBMUJBO0FBMkJBLEVBQUEsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQXJCO0FBQ0UsSUFBQSxJQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBbEIsR0FBeUIsQ0FBekIsSUFBK0IsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFsQixJQUEwQixDQUE1RDtBQUNFLE1BQUEsYUFBQSxJQUFpQixLQUFBLEdBQVEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUExQixHQUFpQyxJQUFsRCxDQURGO0tBREY7R0EzQkE7QUFBQSxFQStCQSxTQUFBLEdBQVksYUFBQSxHQUFnQixLQUFoQixHQUF3QixRQUFRLENBQUMsUUFBUSxDQUFDLElBL0J0RCxDQUFBO0FBQUEsRUFnQ0EsR0FBRyxDQUFDLE1BQUosR0FBYSxHQUFHLENBQUMsSUFBSixDQUFTLEdBQVQsRUFBYztBQUFBLElBQUEsS0FBQSxFQUFPO0FBQUEsTUFBQSxPQUFBLEVBQU8sU0FBUDtLQUFQO0dBQWQsQ0FoQ2IsQ0FBQTtBQUFBLEVBbUNBLEdBQUcsQ0FBQyxVQUFKLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFFBQUEsT0FBQTtBQUFBLElBQUEsSUFBRyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQXJCO0FBQ0UsTUFBQSxPQUFBLEdBQVUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUE1QixDQUFBO0FBQUEsTUFFQSxTQUFBLEdBQVksQ0FBQSxTQUZaLENBQUE7QUFJQSxNQUFBLElBQUcsU0FBSDtBQUNFLFFBQUEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBYixDQUF5QixLQUFBLEdBQVEsT0FBakMsQ0FBQSxDQUFBO0FBQUEsUUFDQSxPQUFBLEdBQVUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUQ1QixDQURGO09BQUEsTUFBQTtBQUlFLFFBQUEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBYixDQUF5QixLQUFBLEdBQVEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFuRCxDQUFBLENBSkY7T0FKQTthQVVBLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQWIsQ0FBc0IsS0FBQSxHQUFRLE9BQTlCLEVBWEY7S0FEZTtFQUFBLENBbkNqQixDQUFBO1NBa0RBLElBbkRNO0FBQUEsQ0FUUixDQUFBOztBQUFBLEVBOERFLENBQUMsUUFBUSxDQUFDLFFBQVosQ0FBcUIsWUFBckIsRUFBbUMsS0FBbkMsQ0E5REEsQ0FBQTs7QUFBQSxNQStETSxDQUFDLE9BQVAsR0FBaUIsS0EvRGpCLENBQUE7Ozs7O0FDQUEsSUFBQSxxQkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLGlCQUVBLEdBQW9CLFNBQUMsTUFBRCxHQUFBO0FBYWxCLE1BQUEsK0NBQUE7QUFBQSxFQUFBLFNBQUEsR0FBWSxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU4sQ0FBYSxNQUFiLENBQVosQ0FBQTtBQUFBLEVBQ0EsR0FBQSxHQUFNLE1BRE4sQ0FBQTtBQUFBLEVBRUEsS0FBQSxHQUFRLE1BRlIsQ0FBQTtBQUFBLEVBR0EsTUFBQSxHQUFTLE1BSFQsQ0FBQTtBQUFBLEVBSUEsV0FBQSxHQUFjLE1BSmQsQ0FBQTtBQUFBLEVBS0EsR0FBQSxHQUFNLE1BTE4sQ0FBQTtBQUFBLEVBTUEsR0FBQSxHQUFNLEVBQUUsQ0FBQyxnQkFOVCxDQUFBO0FBT0EsRUFBQSxJQUFHLEtBQUEsS0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQU4sQ0FBa0IsU0FBbEIsQ0FBWjtBQUNFLElBQUEsU0FBQSxHQUFZLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEdBQWxCLEVBQXVCLEVBQXZCLENBQVosQ0FBQTtBQUFBLElBQ0EsU0FBQSxHQUFZLFNBQVMsQ0FBQyxPQUFWLENBQWtCLE1BQWxCLEVBQTBCLEVBQTFCLENBRFosQ0FBQTtBQUFBLElBRUEsU0FBQSxHQUFZLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEdBQWxCLEVBQXVCLEVBQXZCLENBRlosQ0FBQTtBQUFBLElBR0EsU0FBQSxHQUFZLFNBQVMsQ0FBQyxPQUFWLENBQWtCLEdBQWxCLEVBQXVCLEVBQXZCLENBSFosQ0FBQTtBQUFBLElBSUEsR0FBQSxHQUFNLFNBQVMsQ0FBQyxLQUFWLENBQWdCLEdBQWhCLENBSk4sQ0FBQTtBQUtBLElBQUEsSUFBRyxHQUFHLENBQUMsTUFBSixHQUFhLENBQWhCO0FBQ0UsTUFBQSxLQUFBLEdBQVEsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsR0FBSSxDQUFBLENBQUEsQ0FBakIsQ0FBUixDQUFBO0FBQUEsTUFDQSxNQUFBLEdBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsR0FBSSxDQUFBLENBQUEsQ0FBakIsQ0FEVCxDQUFBO0FBQUEsTUFFQSxXQUFBLEdBQWtCLElBQUEsSUFBQSxDQUFBLENBQU0sQ0FBQyxpQkFBUCxDQUFBLENBRmxCLENBQUE7QUFBQSxNQUdBLEdBQUEsR0FBVSxJQUFBLElBQUEsQ0FBTSxLQUFBLEdBQVEsQ0FBQyxDQUFDLFdBQUEsR0FBYyxDQUFDLE1BQUEsR0FBUyxHQUFULEdBQWUsRUFBaEIsQ0FBZixDQUFBLEdBQXNDLElBQXZDLENBQWQsQ0FIVixDQURGO0tBQUEsTUFLSyxJQUFHLEdBQUcsQ0FBQyxNQUFKLEtBQWMsQ0FBakI7QUFDSCxNQUFBLEtBQUEsR0FBUSxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU4sQ0FBYSxHQUFJLENBQUEsQ0FBQSxDQUFqQixDQUFSLENBQUE7QUFBQSxNQUNBLEdBQUEsR0FBVSxJQUFBLElBQUEsQ0FBSyxLQUFMLENBRFYsQ0FERztLQVhQO0dBUEE7QUFBQSxFQXFCQSxHQXJCQSxDQUFBO0FBQUEsRUF1QkEsRUFBRSxDQUFDLFFBQUgsQ0FBWSxtQkFBWixFQUFpQyxpQkFBakMsQ0F2QkEsQ0FBQTtTQXdCQSxPQUFPLENBQUMsT0FBUixHQUFrQixrQkFyQ0E7QUFBQSxDQUZwQixDQUFBOzs7OztBQ0FBLElBQUEsbUJBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxPQUtBLEdBQVUsU0FBQyxPQUFELEdBQUE7QUFDUixFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsb0JBQUE7QUFBQSxFQUNBLEdBQUEsR0FBTSxLQUROLENBQUE7QUFBQSxFQUVBLElBQUEsR0FBTyxJQUZQLENBQUE7QUFHQTtBQUNFLElBQUEsSUFBK0QsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsT0FBYixDQUEvRDtBQUFBLE1BQUEsR0FBQSxHQUFNLE9BQU8sQ0FBQyxLQUFSLENBQWMsSUFBZCxFQUFvQixLQUFLLENBQUEsU0FBRSxDQUFBLEtBQUssQ0FBQyxJQUFiLENBQWtCLFNBQWxCLEVBQTZCLENBQTdCLENBQXBCLENBQU4sQ0FBQTtLQURGO0dBQUEsY0FBQTtBQUdFLElBREksa0JBQ0osQ0FBQTtBQUFBLElBQUEsSUFBRyxDQUFDLFNBQVMsQ0FBQyxJQUFWLEtBQWtCLFdBQWxCLElBQWlDLFNBQVMsQ0FBQyxJQUFWLEtBQWtCLHFCQUFwRCxDQUFBLElBQStFLFNBQVMsQ0FBQyxJQUFWLEtBQWtCLDBCQUFwRztBQUNFLE1BQUEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFYLENBQWdCLHNCQUFoQixFQUF3QyxTQUF4QyxDQUFBLENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQVgsQ0FBaUIsU0FBakIsQ0FBQSxDQUhGO0tBSEY7R0FBQTtBQUFBO0dBSEE7U0FZQSxJQWJRO0FBQUEsQ0FMVixDQUFBOztBQUFBLE1BcUJDLEdBQVMsU0FBQyxPQUFELEdBQUE7QUFDUixFQUFBLFlBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQTtBQUFBLEVBQ0EsSUFBQSxHQUFPLElBRFAsQ0FBQTtTQUVBLFNBQUEsR0FBQTtBQUNFLFFBQUEsSUFBQTtBQUFBLElBQUEsSUFBQSxHQUFPLEtBQUssQ0FBQSxTQUFFLENBQUEsS0FBSyxDQUFDLElBQWIsQ0FBa0IsU0FBbEIsRUFBNkIsQ0FBN0IsQ0FBUCxDQUFBO0FBQUEsSUFDQSxJQUFJLENBQUMsT0FBTCxDQUFhLE9BQWIsQ0FEQSxDQUFBO1dBRUEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFYLENBQWlCLElBQWpCLEVBQXVCLElBQXZCLEVBSEY7RUFBQSxFQUhRO0FBQUEsQ0FyQlYsQ0FBQTs7QUFBQSxFQStCRyxDQUFDLFFBQUgsQ0FBWSxRQUFaLEVBQXNCLE1BQXRCLENBL0JELENBQUE7O0FBQUEsRUFnQ0csQ0FBQyxRQUFILENBQVksU0FBWixFQUF1QixPQUF2QixDQWhDRCxDQUFBOztBQUFBLE1BaUNPLENBQUMsT0FBUCxHQUNDO0FBQUEsRUFBQSxNQUFBLEVBQVEsTUFBUjtBQUFBLEVBQ0EsT0FBQSxFQUFTLE9BRFQ7Q0FsQ0YsQ0FBQTs7Ozs7QUNBQSxJQUFBLFVBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxNQUVBLEdBQVMsTUFBTSxDQUFDLE1BQVAsQ0FBYyxJQUFkLENBRlQsQ0FBQTs7QUFBQSxNQUlNLENBQUMsY0FBUCxDQUFzQixNQUF0QixFQUE4QixPQUE5QixFQUNFO0FBQUEsRUFBQSxLQUFBLEVBQU8sQ0FBSyxNQUFBLElBQVcsTUFBTSxDQUFDLEtBQXRCLEdBQWtDLE1BQU0sQ0FBQyxLQUF6QyxHQUFvRCxLQUFyRCxDQUFQO0NBREYsQ0FKQSxDQUFBOztBQUFBLE1BT00sQ0FBQyxjQUFQLENBQXNCLE1BQXRCLEVBQThCLFVBQTlCLEVBQ0U7QUFBQSxFQUFBLEtBQUEsRUFBTyxDQUFLLE1BQUEsSUFBVyxNQUFNLENBQUMsUUFBdEIsR0FBcUMsTUFBTSxDQUFDLFFBQTVDLEdBQTBELFFBQTNELENBQVA7Q0FERixDQVBBLENBQUE7O0FBQUEsTUFVTSxDQUFDLGNBQVAsQ0FBc0IsTUFBdEIsRUFBOEIsV0FBOUIsRUFDRTtBQUFBLEVBQUEsS0FBQSxFQUFPLENBQUssTUFBQSxJQUFXLE1BQU0sQ0FBQyxTQUF0QixHQUFzQyxNQUFNLENBQUMsU0FBN0MsR0FBNEQsdUJBQTdELENBQVA7Q0FERixDQVZBLENBQUE7O0FBQUEsTUFhTSxDQUFDLGNBQVAsQ0FBc0IsTUFBdEIsRUFBOEIsV0FBOUIsRUFDRTtBQUFBLEVBQUEsS0FBQSxFQUFPLENBQUssTUFBQSxJQUFXLE1BQU0sQ0FBQyxTQUF0QixHQUFzQyxNQUFNLENBQUMsU0FBN0MsR0FBNEQsTUFBN0QsQ0FBUDtDQURGLENBYkEsQ0FBQTs7QUFBQSxFQWdCRSxDQUFDLFFBQUgsQ0FBWSxRQUFaLEVBQXNCLE1BQXRCLENBaEJBLENBQUE7O0FBQUEsTUFpQk0sQ0FBQyxPQUFQLEdBQWlCLE1BakJqQixDQUFBOzs7OztBQ0FBLElBQUEsMENBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxDQUNBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FESixDQUFBOztBQUFBLENBRUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUZKLENBQUE7O0FBQUEsUUFHQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBSFgsQ0FBQTs7QUFBQSxRQUlBLEdBQVcsT0FBQSxDQUFRLFlBQVIsQ0FKWCxDQUFBOztBQUFBLElBTUEsR0FBTyxPQUFBLENBQVEsWUFBUixDQU5QLENBQUE7O0FBQUEsTUFVQSxHQUlFO0FBQUEsRUFBQSxNQUFBLEVBQVEsU0FBQyxHQUFELEdBQUE7O01BQUMsTUFBTTtLQUViO0FBQUE7QUFBQTs7T0FBQTtBQUFBLElBR0EsR0FBRyxDQUFDLEdBQUosR0FBVSxTQUFDLElBQUQsRUFBTyxHQUFQLEdBQUE7QUFDUixNQUFBLFFBQUEsQ0FBUyxHQUFULEVBQWMsSUFBZCxFQUFvQixHQUFwQixDQUFBLENBQUE7YUFDQSxJQUZRO0lBQUEsQ0FIVixDQUFBO0FBQUEsSUFPQSxHQUFHLENBQUMsR0FBSixDQUFRLE1BQVIsRUFBZ0IsU0FBQyxRQUFELEdBQUE7QUFDZCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsZUFBUixDQUFQLENBQUE7YUFDQSxJQUFBLENBQUssR0FBTCxFQUFVLFNBQUMsR0FBRCxFQUFNLEdBQU4sR0FBQTtBQUNSLFFBQUEsSUFBRyxHQUFBLEtBQVMsTUFBVCxJQUFvQixHQUFBLEtBQVMsS0FBaEM7aUJBQ0UsUUFBQSxDQUFTLEdBQVQsRUFBYyxHQUFkLEVBREY7U0FEUTtNQUFBLENBQVYsRUFGYztJQUFBLENBQWhCLENBUEEsQ0FBQTtXQWFBLElBZk07RUFBQSxDQUFSO0FBQUEsRUFvQkEsWUFBQSxFQUFjLFNBQUMsSUFBRCxFQUFPLEdBQVAsR0FBQTtBQUNaLFFBQUEsRUFBQTtBQUFBLElBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxhQUFSLENBQUwsQ0FBQTtXQUNBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLElBQWhCLEVBQXNCLEdBQXRCLENBQUEsSUFBK0IsRUFBRSxDQUFDLElBQUgsQ0FBUSxHQUFJLENBQUEsSUFBQSxDQUFaLEVBRm5CO0VBQUEsQ0FwQmQ7QUFBQSxFQTBCQSxRQUFBLEVBQVUsU0FBQyxNQUFELEVBQVMsS0FBVCxHQUFBO0FBQ1IsUUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sS0FBTixDQUFBO0FBQ0EsSUFBQSxJQUFHLE1BQUg7QUFDRSxNQUFBLEdBQUEsR0FBTSxDQUFDLENBQUMsUUFBRixDQUFXLE1BQVgsRUFBbUIsS0FBbkIsQ0FBTixDQURGO0tBREE7V0FHQSxJQUpRO0VBQUEsQ0ExQlY7QUFBQSxFQWtDQSxPQUFBLEVBQVMsU0FBQyxJQUFELEVBQU8sSUFBUCxHQUFBO1dBQ1AsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLElBQWhCLEVBRE87RUFBQSxDQWxDVDtBQUFBLEVBdUNBLEtBQUEsRUFBTyxTQUFDLElBQUQsR0FBQTtXQUNMLENBQUMsQ0FBQyxTQUFGLENBQVksSUFBQSxDQUFLLElBQUwsQ0FBWixFQURLO0VBQUEsQ0F2Q1A7QUFBQSxFQTRDQSxTQUFBLEVBQVcsU0FBQyxJQUFELEdBQUE7QUFDVCxRQUFBLEdBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxFQUFOLENBQUE7QUFBQSxJQUNBLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBQSxHQUFBO0FBQ1gsTUFBQSxHQUFBLEdBQU0sSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFmLENBQU4sQ0FEVztJQUFBLENBQWIsQ0FEQSxDQUFBO1dBSUEsR0FBQSxJQUFPLEdBTEU7RUFBQSxDQTVDWDtBQUFBLEVBcURBLFdBQUEsRUFBYSxTQUFDLElBQUQsR0FBQTtBQUNYLFFBQUEsR0FBQTtBQUFBLElBQUEsR0FBQSxHQUFNLEVBQU4sQ0FBQTtBQUNBLElBQUEsSUFBRyxJQUFIO0FBQ0UsTUFBQSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQUEsR0FBQTtBQUNYLFFBQUEsR0FBQSxHQUFNLENBQUMsQ0FBQyxTQUFGLENBQVksSUFBWixDQUFOLENBRFc7TUFBQSxDQUFiLENBQUEsQ0FBQTtBQUlBLE1BQUEsSUFBYSxRQUFRLENBQUMsV0FBVCxDQUFxQixHQUFyQixDQUFiO0FBQUEsUUFBQSxHQUFBLEdBQU0sRUFBTixDQUFBO09BTEY7S0FEQTtXQU9BLElBUlc7RUFBQSxDQXJEYjtBQUFBLEVBaUVBLE1BQUEsRUFBUSxTQUFDLElBQUQsRUFBTyxTQUFQLEdBQUE7QUFDTixRQUFBLFNBQUE7O01BRGEsWUFBWTtLQUN6QjtBQUFBLElBQUEsR0FBQSxHQUFNLEVBQU4sQ0FBQTtBQUNBLElBQUEsSUFBRyxTQUFBLEtBQWEsR0FBaEI7QUFDRSxNQUFBLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBQSxHQUFBO0FBQ1gsUUFBQSxHQUFBLEdBQU0sQ0FBQyxDQUFDLEtBQUYsQ0FBUSxJQUFSLENBQU4sQ0FEVztNQUFBLENBQWIsQ0FBQSxDQURGO0tBQUEsTUFBQTtBQU1FLE1BQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQVAsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxDQUFLLElBQUwsRUFBVyxTQUFDLEdBQUQsRUFBTSxHQUFOLEdBQUE7QUFDVCxRQUFBLElBQXFCLEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FBbEM7QUFBQSxVQUFBLEdBQUEsSUFBTyxTQUFQLENBQUE7U0FBQTtBQUFBLFFBQ0EsR0FBQSxJQUFPLEdBQUEsR0FBTSxHQUFOLEdBQVksR0FEbkIsQ0FEUztNQUFBLENBQVgsQ0FEQSxDQU5GO0tBREE7V0FhQSxFQUFFLENBQUMsTUFBSCxDQUFVLEdBQVYsRUFkTTtFQUFBLENBakVSO0FBQUEsRUFtRkEsTUFBQSxFQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsUUFBbEIsR0FBQTtBQUNOLFFBQUEsR0FBQTs7TUFEd0IsV0FBVztLQUNuQztBQUFBLElBQUEsR0FBQSxHQUFNLE9BQUEsSUFBVyxFQUFqQixDQUFBO0FBQ0EsSUFBQSxJQUFHLFFBQUEsS0FBWSxJQUFmO0FBQ0UsTUFBQSxHQUFBLEdBQU0sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxRQUFULEVBQW1CLEdBQW5CLEVBQXdCLE1BQXhCLENBQU4sQ0FERjtLQUFBLE1BQUE7QUFHRSxNQUFBLEdBQUEsR0FBTSxDQUFDLENBQUMsTUFBRixDQUFTLEdBQVQsRUFBYyxNQUFkLENBQU4sQ0FIRjtLQURBO1dBS0EsSUFOTTtFQUFBLENBbkZSO0NBZEYsQ0FBQTs7QUFBQSxFQTBHRSxDQUFDLFFBQUgsQ0FBWSxRQUFaLEVBQXNCLE1BQU0sQ0FBQyxNQUE3QixDQTFHQSxDQUFBOztBQUFBLEVBMkdFLENBQUMsUUFBSCxDQUFZLGNBQVosRUFBNEIsTUFBTSxDQUFDLFlBQW5DLENBM0dBLENBQUE7O0FBQUEsRUE0R0UsQ0FBQyxRQUFILENBQVksVUFBWixFQUF3QixNQUFNLENBQUMsUUFBL0IsQ0E1R0EsQ0FBQTs7QUFBQSxFQTZHRSxDQUFDLFFBQUgsQ0FBWSxTQUFaLEVBQXVCLE1BQU0sQ0FBQyxPQUE5QixDQTdHQSxDQUFBOztBQUFBLEVBOEdFLENBQUMsUUFBSCxDQUFZLE9BQVosRUFBcUIsTUFBTSxDQUFDLEtBQTVCLENBOUdBLENBQUE7O0FBQUEsRUErR0UsQ0FBQyxRQUFILENBQVksV0FBWixFQUF5QixNQUFNLENBQUMsU0FBaEMsQ0EvR0EsQ0FBQTs7QUFBQSxFQWdIRSxDQUFDLFFBQUgsQ0FBWSxhQUFaLEVBQTJCLE1BQU0sQ0FBQyxXQUFsQyxDQWhIQSxDQUFBOztBQUFBLEVBaUhFLENBQUMsUUFBSCxDQUFZLFFBQVosRUFBc0IsTUFBTSxDQUFDLE1BQTdCLENBakhBLENBQUE7O0FBQUEsRUFrSEUsQ0FBQyxRQUFILENBQVksUUFBWixFQUFzQixNQUFNLENBQUMsTUFBN0IsQ0FsSEEsQ0FBQTs7QUFBQSxNQW9ITSxDQUFDLE9BQVAsR0FBaUIsTUFwSGpCLENBQUE7Ozs7Ozs7QUNBQSxJQUFBLFlBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFFQTtBQUFBOztHQUZBOztBQUFBLFFBTUEsR0FBVyxTQUFDLEdBQUQsRUFBTSxJQUFOLEVBQVksS0FBWixFQUFtQixRQUFuQixFQUE2QixZQUE3QixFQUEyQyxVQUEzQyxHQUFBO0FBQ1QsRUFBQSxJQUFBLENBQUEsR0FBQTtBQUFBLFVBQVUsSUFBQSxLQUFBLENBQU0sNkNBQU4sQ0FBVixDQUFBO0dBQUE7QUFDQSxFQUFBLElBQWtGLFlBQWxGO0FBQUEsVUFBVSxJQUFBLEtBQUEsQ0FBTSx5REFBTixDQUFWLENBQUE7R0FEQTtBQUFBLEVBRUEsR0FBSSxDQUFBLElBQUEsQ0FBSixHQUFZLEtBRlosQ0FBQTtTQUdBLElBSlM7QUFBQSxDQU5YLENBQUE7O0FBQUEsRUFZRSxDQUFDLFFBQUgsQ0FBWSxVQUFaLEVBQXdCLFFBQXhCLENBWkEsQ0FBQTs7QUFBQSxNQWFNLENBQUMsT0FBUCxHQUFpQixRQWJqQixDQUFBOzs7OztBQ0FBLElBQUEsbUJBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxlQUVBLEdBQWtCLFNBQUMsTUFBRCxFQUFTLElBQVQsR0FBQTtBQUNoQixNQUFBLGdCQUFBO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLGtCQUFBLEVBQW9CLElBQXBCO0FBQUEsSUFDQSxnQkFBQSxFQUFrQixJQURsQjtBQUFBLElBRUEsZ0JBQUEsRUFBa0IsSUFGbEI7QUFBQSxJQUdBLFNBQUEsRUFBVyxHQUhYO0FBQUEsSUFJQSxVQUFBLEVBQVksRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsTUFBYixDQUpaO0dBREYsQ0FBQTtBQUFBLEVBT0EsTUFBQSxHQUNFO0FBQUEsSUFBQSxLQUFBLEVBQU8sRUFBUDtBQUFBLElBQ0EsU0FBQSxFQUFXLFNBQUEsR0FBQTthQUNULE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBYixDQUFrQixRQUFRLENBQUMsU0FBM0IsRUFEUztJQUFBLENBRFg7QUFBQSxJQUlBLE1BQUEsRUFBUSxTQUFDLFNBQUQsR0FBQTtBQUNOLFVBQUEsR0FBQTs7UUFETyxZQUFZLFFBQVEsQ0FBQztPQUM1QjtBQUFBLE1BQUEsR0FBQSxHQUFNLEVBQU4sQ0FBQTtBQUFBLE1BQ0EsRUFBRSxDQUFDLElBQUgsQ0FBUSxNQUFNLENBQUMsS0FBZixFQUFzQixTQUFDLEdBQUQsR0FBQTtBQUNwQixRQUFBLElBQXFCLEdBQUcsQ0FBQyxNQUFKLEdBQWEsQ0FBbEM7QUFBQSxVQUFBLEdBQUEsSUFBTyxTQUFQLENBQUE7U0FBQTtBQUFBLFFBQ0EsR0FBQSxJQUFPLEdBRFAsQ0FEb0I7TUFBQSxDQUF0QixDQURBLENBQUE7YUFNQSxJQVBNO0lBQUEsQ0FKUjtBQUFBLElBYUEsUUFBQSxFQUFVLFNBQUEsR0FBQTthQUNSLE1BQU0sQ0FBQyxNQUFQLENBQUEsRUFEUTtJQUFBLENBYlY7QUFBQSxJQWdCQSxHQUFBLEVBQUssU0FBQyxHQUFELEdBQUE7QUFDSCxNQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBYixDQUFrQixRQUFRLENBQUMsS0FBVCxDQUFlLEdBQWYsQ0FBbEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxRQUFRLENBQUMsZ0JBQVQsQ0FBQSxDQURBLENBQUE7YUFFQSxPQUhHO0lBQUEsQ0FoQkw7QUFBQSxJQXFCQSxNQUFBLEVBQVEsU0FBQyxHQUFELEdBQUE7QUFDTixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtlQUNQLEtBQUssQ0FBQyxNQUFOLENBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxVQUFBLElBQVMsSUFBQSxLQUFVLEdBQW5CO21CQUFBLEtBQUE7V0FEVztRQUFBLENBQWIsRUFETztNQUFBLENBQVQsQ0FBQTtBQUFBLE1BS0EsTUFBTSxDQUFDLEtBQVAsR0FBZSxNQUFBLENBQU8sTUFBTSxDQUFDLEtBQWQsQ0FMZixDQUFBO2FBTUEsT0FQTTtJQUFBLENBckJSO0FBQUEsSUE4QkEsS0FBQSxFQUFPLFNBQUEsR0FBQTthQUNMLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FEUjtJQUFBLENBOUJQO0FBQUEsSUFpQ0EsUUFBQSxFQUFVLFNBQUMsR0FBRCxFQUFNLGFBQU4sR0FBQTtBQUNSLFVBQUEsc0JBQUE7QUFBQSxNQUFBLGVBQUEsR0FBa0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFOLENBQVcsYUFBWCxDQUFsQixDQUFBO0FBQUEsTUFDQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsR0FBYixDQUFpQixDQUFDLElBQWxCLENBQUEsQ0FETixDQUFBO0FBRUEsTUFBQSxJQUE0QixLQUFBLEtBQVMsZUFBckM7QUFBQSxRQUFBLEdBQUEsR0FBTSxHQUFHLENBQUMsV0FBSixDQUFBLENBQU4sQ0FBQTtPQUZBO0FBQUEsTUFHQSxLQUFBLEdBQVEsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFiLENBQW9CLFNBQUMsTUFBRCxHQUFBO2VBQzFCLENBQUMsZUFBQSxJQUFvQixFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU4sQ0FBYSxNQUFiLENBQW9CLENBQUMsSUFBckIsQ0FBQSxDQUFBLEtBQStCLEdBQXBELENBQUEsSUFBNEQsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFOLENBQWEsTUFBYixDQUFvQixDQUFDLElBQXJCLENBQUEsQ0FBMkIsQ0FBQyxXQUE1QixDQUFBLENBQUEsS0FBNkMsSUFEL0U7TUFBQSxDQUFwQixDQUhSLENBQUE7YUFNQSxLQUFLLENBQUMsTUFBTixHQUFlLEVBUFA7SUFBQSxDQWpDVjtBQUFBLElBMENBLElBQUEsRUFBTSxTQUFDLFFBQUQsR0FBQTthQUNKLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBYixDQUFxQixRQUFyQixFQURJO0lBQUEsQ0ExQ047R0FSRixDQUFBO0FBQUEsRUFxREEsUUFBUSxDQUFDLEtBQVQsR0FBaUIsU0FBQyxHQUFELEdBQUE7QUFDZixRQUFBLEdBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU4sQ0FBYSxHQUFiLENBQU4sQ0FBQTtBQUNBLElBQUEsSUFBa0YsUUFBUSxDQUFDLGtCQUEzRjtBQUE4QyxhQUFNLEdBQUcsQ0FBQyxPQUFKLENBQVksSUFBWixDQUFBLEtBQXVCLENBQUEsQ0FBN0IsR0FBQTtBQUE5QyxRQUFBLEdBQUEsR0FBTSxHQUFHLENBQUMsT0FBSixDQUFZLEtBQVosRUFBbUIsUUFBUSxDQUFDLFNBQTVCLENBQU4sQ0FBOEM7TUFBQSxDQUE5QztLQURBO0FBRUEsSUFBQSxJQUE0RixRQUFRLENBQUMsZ0JBQXJHO0FBQXlELGFBQU0sR0FBRyxDQUFDLE9BQUosQ0FBWSxHQUFaLENBQUEsS0FBc0IsQ0FBQSxDQUE1QixHQUFBO0FBQXpELFFBQUEsR0FBQSxHQUFNLEdBQUcsQ0FBQyxPQUFKLENBQVksTUFBQSxDQUFPLEdBQVAsRUFBWSxHQUFaLENBQVosRUFBOEIsUUFBUSxDQUFDLFNBQXZDLENBQU4sQ0FBeUQ7TUFBQSxDQUF6RDtLQUZBO0FBRzhDLFdBQU0sR0FBRyxDQUFDLE9BQUosQ0FBWSxJQUFaLENBQUEsS0FBdUIsQ0FBQSxDQUE3QixHQUFBO0FBQTlDLE1BQUEsR0FBQSxHQUFNLEdBQUcsQ0FBQyxPQUFKLENBQVksS0FBWixFQUFtQixRQUFRLENBQUMsU0FBNUIsQ0FBTixDQUE4QztJQUFBLENBSDlDO1dBSUEsSUFMZTtFQUFBLENBckRqQixDQUFBO0FBQUEsRUE0REEsUUFBUSxDQUFDLGdCQUFULEdBQTRCLFNBQUEsR0FBQTtBQUMxQixJQUFBLElBQUcsUUFBUSxDQUFDLGdCQUFaO0FBQ0UsTUFBQSxDQUFDLFNBQUEsR0FBQTtBQUNDLFlBQUEsTUFBQTtBQUFBLFFBQUEsTUFBQSxHQUFTLFNBQUMsS0FBRCxHQUFBO0FBQ1AsY0FBQSxJQUFBO0FBQUEsVUFBQSxJQUFBLEdBQVcsSUFBQSxHQUFBLENBQUEsQ0FBWCxDQUFBO2lCQUNBLEtBQUssQ0FBQyxNQUFOLENBQWEsU0FBQyxJQUFELEdBQUE7QUFDWCxZQUFBLElBQUcsS0FBQSxLQUFTLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBVCxDQUFaO0FBQ0UsY0FBQSxJQUFJLENBQUMsR0FBTCxDQUFTLElBQVQsQ0FBQSxDQUFBO3FCQUNBLEtBRkY7YUFEVztVQUFBLENBQWIsRUFGTztRQUFBLENBQVQsQ0FBQTtBQUFBLFFBUUEsTUFBTSxDQUFDLEtBQVAsR0FBZSxNQUFBLENBQU8sTUFBTSxDQUFDLEtBQWQsQ0FSZixDQUREO01BQUEsQ0FBRCxDQUFBLENBQUEsQ0FBQSxDQURGO0tBRDBCO0VBQUEsQ0E1RDVCLENBQUE7QUFBQSxFQTRFQSxDQUFDLFNBQUMsQ0FBRCxHQUFBO0FBQ0MsSUFBQSxJQUFHLENBQUMsQ0FBQyxNQUFGLEdBQVcsQ0FBWCxJQUFpQixLQUFBLEtBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFOLENBQWtCLElBQWxCLENBQTdCO0FBQ0UsTUFBQSxFQUFFLENBQUMsSUFBSCxDQUFRLENBQVIsRUFBVyxTQUFDLEdBQUQsR0FBQTtBQUNULFFBQUEsSUFBMEIsS0FBQSxLQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBTixDQUFrQixHQUFsQixDQUFuQztBQUFBLFVBQUEsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFiLENBQWtCLEdBQWxCLENBQUEsQ0FBQTtTQURTO01BQUEsQ0FBWCxDQUFBLENBREY7S0FBQSxNQUtLLElBQUcsTUFBQSxJQUFXLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQTlCO0FBQ0gsTUFBQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsSUFBcEIsQ0FBQSxDQUFBO0FBQUEsTUFDQSxlQUFBLEdBQWtCLFFBQVEsQ0FBQyxLQUFULENBQWUsTUFBZixDQURsQixDQUFBO0FBQUEsTUFFQSxRQUFRLENBQUMsVUFBVCxHQUFzQixlQUZ0QixDQUFBO0FBQUEsTUFHQSxNQUFNLENBQUMsS0FBUCxHQUFlLGVBQWUsQ0FBQyxLQUFoQixDQUFzQixRQUFRLENBQUMsU0FBL0IsQ0FIZixDQURHO0tBTEw7QUFBQSxJQVVBLFFBQVEsQ0FBQyxnQkFBVCxDQUFBLENBVkEsQ0FERDtFQUFBLENBQUQsQ0FBQSxDQWFFLFNBYkYsQ0E1RUEsQ0FBQTtTQTBGQSxPQTNGZ0I7QUFBQSxDQUZsQixDQUFBOztBQUFBLEVBZ0dFLENBQUMsUUFBSCxDQUFZLGlCQUFaLEVBQStCLGVBQS9CLENBaEdBLENBQUE7O0FBQUEsTUFpR00sQ0FBQyxPQUFQLEdBQWlCLGVBakdqQixDQUFBOzs7OztBQ0FBLElBQUEsZ0RBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxDQUNBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FESixDQUFBOztBQUFBLE9BRUEsQ0FBUSxTQUFSLENBRkEsQ0FBQTs7QUFBQSxXQUdBLEdBQWMsT0FBQSxDQUFRLGVBQVIsQ0FIZCxDQUFBOztBQUFBLE9BSUEsR0FBVSxPQUFBLENBQVEsV0FBUixDQUpWLENBQUE7O0FBQUEsR0FLQSxHQUFNLE9BQUEsQ0FBUSxPQUFSLENBTE4sQ0FBQTs7QUFRQTtBQUFBOztHQVJBOztBQVdBLElBQUcsTUFBQSxDQUFBLFFBQUEsS0FBcUIsV0FBeEI7QUFBeUMsRUFBQSxJQUFBLEdBQU8sUUFBUSxDQUFDLElBQWhCLENBQXpDO0NBQUEsTUFBQTtBQUFtRSxFQUFBLElBQUEsR0FBTyxJQUFQLENBQW5FO0NBWEE7O0FBQUEsUUFZQSxHQUFlLElBQUEsT0FBQSxDQUFRLElBQVIsRUFBYztBQUFBLEVBQUEsRUFBQSxFQUFJLE1BQUo7Q0FBZCxFQUEwQixJQUExQixDQVpmLENBQUE7O0FBQUEsUUFhUSxDQUFDLE9BQVQsR0FBbUIsSUFibkIsQ0FBQTs7QUFBQSxRQWNRLENBQUMsS0FBVCxHQUFpQixTQUFBLEdBQUE7U0FDZixPQURlO0FBQUEsQ0FkakIsQ0FBQTs7QUFBQSxPQWlCTyxDQUFDLFFBQVIsQ0FBaUIsUUFBakIsRUFBMkIsTUFBM0IsQ0FqQkEsQ0FBQTs7QUFBQSxRQWtCUSxDQUFDLEtBQVQsR0FBaUIsQ0FsQmpCLENBQUE7O0FBQUEsUUFtQlEsQ0FBQyxJQUFULEdBQWdCLElBbkJoQixDQUFBOztBQUFBLEdBb0JBLENBQUksUUFBSixFQUFjLElBQWQsQ0FwQkEsQ0FBQTs7QUFBQSxXQXFCVyxDQUFDLGFBQVosQ0FBMEIsUUFBMUIsRUFBb0MsQ0FBcEMsQ0FyQkEsQ0FBQTs7QUFBQSxRQXNCUSxDQUFDLFdBQVQsR0FBdUIsSUF0QnZCLENBQUE7O0FBQUEsRUF3QkUsQ0FBQyxRQUFILENBQVksTUFBWixFQUFvQixRQUFwQixDQXhCQSxDQUFBOztBQUFBLE1BeUJNLENBQUMsT0FBUCxHQUFpQixRQXpCakIsQ0FBQTs7Ozs7OztBQ0FBLElBQUEsc0JBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEdBQUssT0FBQSxDQUFRLFdBQVIsQ0FETCxDQUFBOztBQUFBLEdBRUEsR0FBTSxPQUFBLENBQVEsZ0JBQVIsQ0FGTixDQUFBOztBQUFBLFNBZ0JBLEdBQVksU0FBQyxPQUFELEVBQXlCLEtBQXpCLEVBQWdDLE9BQWhDLEdBQUE7QUFFVixNQUFBLHlCQUFBOztJQUZXLFVBQVUsR0FBRyxDQUFDLE1BQUosQ0FBQTtHQUVyQjtBQUFBLEVBQUEsSUFBRyxDQUFBLE9BQVcsQ0FBQyxVQUFSLENBQW1CLElBQW5CLENBQVA7QUFBb0MsSUFBQSxPQUFBLEdBQVUsSUFBQSxHQUFPLE9BQWpCLENBQXBDO0dBQUE7QUFBQSxFQU1BLE1BQUEsR0FBUyxFQUFFLENBQUMsT0FBSCxDQUFXLE9BQVgsRUFBb0IsR0FBRyxDQUFDLE1BQUosQ0FBQSxDQUFwQixFQUFrQyxLQUFsQyxFQUF5QyxLQUF6QyxDQU5ULENBQUE7QUFBQSxFQVVBLFlBQUEsR0FBZSxPQUFPLENBQUMsWUFBUixJQUF3QixFQUFHLENBQUEsaUNBQUEsQ0FBM0IsSUFBaUUsS0FWaEYsQ0FBQTtBQUFBLEVBYUEsR0FBQSxHQUFNLE1BQU0sQ0FBQyxJQUFQLENBQVksWUFBWixFQUEwQixPQUExQixDQWJOLENBQUE7QUFBQSxFQWdCQSxHQUFHLENBQUMsR0FBSixDQUFRLGVBQVIsRUFBeUIsT0FBekIsQ0FoQkEsQ0FBQTtBQUFBLEVBbUJBLEdBQUcsQ0FBQyxHQUFKLENBQVEsUUFBUixFQUFrQixNQUFNLENBQUMsTUFBekIsQ0FuQkEsQ0FBQTtTQW9CQSxJQXRCVTtBQUFBLENBaEJaLENBQUE7O0FBQUEsRUF3Q0UsQ0FBQyxRQUFILENBQVksV0FBWixFQUF5QixTQUF6QixDQXhDQSxDQUFBOztBQUFBLE1BeUNNLENBQUMsT0FBUCxHQUFpQixTQXpDakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLG9CQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxHQUFLLE9BQUEsQ0FBUSxXQUFSLENBREwsQ0FBQTs7QUFBQSxHQUVBLEdBQU0sT0FBQSxDQUFRLGdCQUFSLENBRk4sQ0FBQTs7QUFJQTtBQUFBOztHQUpBOztBQUFBLE9BT0EsR0FBVSxTQUFDLE9BQUQsRUFBeUIsS0FBekIsRUFBZ0MsT0FBaEMsR0FBQTtBQUNSLE1BQUEsaUJBQUE7O0lBRFMsVUFBVSxHQUFHLENBQUMsTUFBSixDQUFBO0dBQ25CO0FBQUEsRUFBQSxJQUFHLENBQUEsT0FBVyxDQUFDLFVBQVIsQ0FBbUIsSUFBbkIsQ0FBUDtBQUFvQyxJQUFBLE9BQUEsR0FBVSxJQUFBLEdBQU8sT0FBakIsQ0FBcEM7R0FBQTtBQUFBLEVBRUEsWUFBQSxHQUFlLE9BQU8sQ0FBQyxZQUFSLElBQXdCLEVBQUcsQ0FBQSxpQ0FBQSxDQUEzQixJQUFpRSxLQUZoRixDQUFBO0FBQUEsRUFJQSxHQUFBLEdBQU0sRUFBRSxDQUFDLE9BQUgsQ0FBVyxZQUFYLEVBQXlCLE9BQXpCLEVBQWtDLEtBQWxDLEVBQXlDLEtBQXpDLENBSk4sQ0FBQTtBQUFBLEVBTUEsR0FBRyxDQUFDLEdBQUosQ0FBUSxhQUFSLEVBQXVCLE9BQXZCLENBTkEsQ0FBQTtTQVFBLElBVFE7QUFBQSxDQVBWLENBQUE7O0FBQUEsRUFrQkUsQ0FBQyxRQUFILENBQVksU0FBWixFQUF1QixPQUF2QixDQWxCQSxDQUFBOztBQUFBLE1BbUJNLENBQUMsT0FBUCxHQUFpQixPQW5CakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLFVBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxDQUNBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FESixDQUFBOztBQUFBLEdBVUEsR0FBTSxTQUFDLEVBQUQsRUFBSyxNQUFMLEdBQUE7QUFDSixNQUFBLDRCQUFBOztJQURTLFNBQVMsT0FBQSxDQUFRLFFBQVI7R0FDbEI7QUFBQSxFQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFBQSxFQUdBLEVBQUUsQ0FBQyxHQUFILENBQU8sU0FBUCxFQUFrQixTQUFBLEdBQUE7V0FDaEIsRUFBQSxJQUFPLENBQUMsRUFBRSxDQUFDLEVBQUgsWUFBaUIsV0FBakIsSUFBZ0MsRUFBRSxDQUFDLEVBQUgsWUFBaUIsZ0JBQWxELEVBRFM7RUFBQSxDQUFsQixDQUhBLENBQUE7QUFBQSxFQU1BLG1CQUFBLEdBQXNCLFNBQUEsR0FBQTtBQUNwQixRQUFBLGVBQUE7QUFBQSxJQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUixDQUFYLENBQUE7QUFBQSxJQUNBLEtBQUEsR0FBUSxLQUFBLEtBQVMsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsRUFBckIsQ0FBVCxJQUFzQyxFQUFFLENBQUMsT0FBSCxDQUFBLENBRDlDLENBQUE7QUFFQSxJQUFBLElBQXdFLEtBQUEsS0FBUyxLQUFqRjtBQUFBLFlBQVUsSUFBQSxLQUFBLENBQU0sbURBQU4sQ0FBVixDQUFBO0tBRkE7V0FHQSxNQUpvQjtFQUFBLENBTnRCLENBQUE7QUFBQSxFQWdCQSxFQUFFLENBQUMsR0FBSCxDQUFPLFVBQVAsRUFBbUIsU0FBQyxJQUFELEdBQUE7QUFDakIsSUFBQSxJQUFzQixtQkFBQSxDQUFBLENBQXRCO0FBQUEsTUFBQSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQUwsQ0FBYyxJQUFkLENBQUEsQ0FBQTtLQUFBO1dBQ0EsR0FGaUI7RUFBQSxDQUFuQixDQWhCQSxDQUFBO0FBQUEsRUFzQkEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxNQUFQLEVBQWUsU0FBQyxTQUFELEVBQVksS0FBWixHQUFBO1dBQ2IsRUFBRSxDQUFDLEVBQUgsQ0FBTSxTQUFOLEVBQWlCLEtBQWpCLEVBRGE7RUFBQSxDQUFmLENBdEJBLENBQUE7QUFBQSxFQTBCQSxFQUFFLENBQUMsR0FBSCxDQUFPLElBQVAsRUFBYSxTQUFDLFNBQUQsRUFBWSxLQUFaLEdBQUE7QUFDWCxJQUFBLElBQTZCLG1CQUFBLENBQUEsQ0FBN0I7QUFBQSxNQUFBLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBTCxDQUFRLFNBQVIsRUFBbUIsS0FBbkIsQ0FBQSxDQUFBO0tBQUE7V0FDQSxHQUZXO0VBQUEsQ0FBYixDQTFCQSxDQUFBO0FBQUEsRUErQkEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxLQUFQLEVBQWMsU0FBQyxTQUFELEVBQVksS0FBWixHQUFBO0FBQ1osSUFBQSxJQUE4QixtQkFBQSxDQUFBLENBQTlCO0FBQUEsTUFBQSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUwsQ0FBUyxTQUFULEVBQW9CLEtBQXBCLENBQUEsQ0FBQTtLQUFBO1dBQ0EsR0FGWTtFQUFBLENBQWQsQ0EvQkEsQ0FBQTtBQUFBLEVBc0NBLEVBQUUsQ0FBQyxHQUFILENBQU8sVUFBUCxFQUFtQixTQUFDLElBQUQsRUFBTyxLQUFQLEdBQUE7V0FFakIsR0FGaUI7RUFBQSxDQUFuQixDQXRDQSxDQUFBO0FBQUEsRUE2Q0EsRUFBRSxDQUFDLEdBQUgsQ0FBTyxTQUFQLEVBQWtCLFNBQUEsR0FBQTtBQUNoQixJQUFBLElBQUcsbUJBQUEsQ0FBQSxDQUFIO0FBQ0UsTUFBQSxPQUFBLEdBQVUsS0FBVixDQUFBO0FBQUEsTUFDQSxFQUFFLENBQUMsSUFBSCxDQUFRLFVBQVIsRUFBb0IsVUFBcEIsQ0FEQSxDQUFBO0FBQUEsTUFFQSxFQUFFLENBQUMsUUFBSCxDQUFZLFVBQVosRUFBd0IsVUFBeEIsQ0FGQSxDQURGO0tBQUE7V0FJQSxHQUxnQjtFQUFBLENBQWxCLENBN0NBLENBQUE7QUFBQSxFQXVEQSxFQUFFLENBQUMsR0FBSCxDQUFPLE9BQVAsRUFBZ0IsU0FBQSxHQUFBO0FBQ2QsSUFBQSxJQUFpQixtQkFBQSxDQUFBLENBQWpCO0FBQUEsTUFBQSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUwsQ0FBQSxDQUFBLENBQUE7S0FBQTtXQUNBLEdBRmM7RUFBQSxDQUFoQixDQXZEQSxDQUFBO0FBQUEsRUE4REEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxRQUFQLEVBQWlCLFNBQUEsR0FBQTtBQUNmLElBQUEsSUFBRyxtQkFBQSxDQUFBLENBQUg7QUFDRSxNQUFBLE9BQUEsR0FBVSxJQUFWLENBQUE7QUFBQSxNQUNBLEVBQUUsQ0FBQyxVQUFILENBQWMsVUFBZCxDQURBLENBQUE7QUFBQSxNQUVBLEVBQUUsQ0FBQyxXQUFILENBQWUsVUFBZixDQUZBLENBREY7S0FBQTtXQUlBLEdBTGU7RUFBQSxDQUFqQixDQTlEQSxDQUFBO0FBQUEsRUF1RUEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxPQUFQLEVBQWdCLFNBQUEsR0FBQTtBQUNkLFFBQUEsRUFBQTtBQUFBLElBQUEsSUFBa0IsbUJBQUEsQ0FBQSxDQUFsQjtBQUFBLE1BQUEsRUFBQSxHQUFLLEVBQUcsQ0FBQSxDQUFBLENBQUUsQ0FBQyxFQUFYLENBQUE7S0FBQTtXQUNBLEdBRmM7RUFBQSxDQUFoQixDQXZFQSxDQUFBO0FBQUEsRUE2RUEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxNQUFQLEVBQWUsU0FBQSxHQUFBO0FBQ2IsSUFBQSxJQUE2QixtQkFBQSxDQUFBLENBQTdCO0FBQUEsTUFBQSxFQUFFLENBQUMsR0FBSCxDQUFPLFNBQVAsRUFBa0IsTUFBbEIsQ0FBQSxDQUFBO0tBQUE7V0FDQSxHQUZhO0VBQUEsQ0FBZixDQTdFQSxDQUFBO0FBQUEsRUFtRkEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxRQUFQLEVBQWlCLFNBQUEsR0FBQTtBQUNmLFFBQUEsT0FBQTtBQUFBLElBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxhQUFSLENBQUwsQ0FBQTtBQUFBLElBQ0EsR0FBQSxHQUFNLENBRE4sQ0FBQTtBQUVBLElBQUEsSUFBaUMsbUJBQUEsQ0FBQSxDQUFqQztBQUFBLE1BQUEsR0FBQSxHQUFNLEVBQUUsQ0FBQyxNQUFILENBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFmLENBQU4sQ0FBQTtLQUZBO1dBR0EsSUFKZTtFQUFBLENBQWpCLENBbkZBLENBQUE7QUFBQSxFQTJGQSxFQUFFLENBQUMsR0FBSCxDQUFPLFFBQVAsRUFBaUIsTUFBakIsQ0EzRkEsQ0FBQTtBQUFBLEVBK0ZBLEVBQUUsQ0FBQyxHQUFILENBQU8sUUFBUCxFQUFpQixTQUFBLEdBQUE7QUFDZixJQUFBLElBQUcsRUFBQSxJQUFPLEVBQUUsQ0FBQyxDQUFiO0FBQ0UsTUFBQSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQUwsQ0FBQSxDQUFBLENBQUE7QUFBQSxNQUdBLEVBQUEsR0FBSyxJQUhMLENBREY7S0FBQTtXQUtBLEtBTmU7RUFBQSxDQUFqQixDQS9GQSxDQUFBO0FBQUEsRUF5R0EsRUFBRSxDQUFDLEdBQUgsQ0FBTyxhQUFQLEVBQXNCLFNBQUMsSUFBRCxHQUFBO0FBQ3BCLElBQUEsSUFBMEIsbUJBQUEsQ0FBQSxDQUExQjtBQUFBLE1BQUEsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFMLENBQWlCLElBQWpCLENBQUEsQ0FBQTtLQUFBO1dBQ0EsR0FGb0I7RUFBQSxDQUF0QixDQXpHQSxDQUFBO0FBQUEsRUErR0EsRUFBRSxDQUFDLEdBQUgsQ0FBTyxZQUFQLEVBQXFCLFNBQUMsSUFBRCxHQUFBO0FBQ25CLElBQUEsSUFBeUIsbUJBQUEsQ0FBQSxDQUF6QjtBQUFBLE1BQUEsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFMLENBQWdCLElBQWhCLENBQUEsQ0FBQTtLQUFBO1dBQ0EsR0FGbUI7RUFBQSxDQUFyQixDQS9HQSxDQUFBO0FBQUEsRUFxSEEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxZQUFQLEVBQXFCLFNBQUMsSUFBRCxHQUFBO0FBQ25CLElBQUEsSUFBeUIsbUJBQUEsQ0FBQSxDQUF6QjtBQUFBLE1BQUEsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFMLENBQWdCLElBQWhCLENBQUEsQ0FBQTtLQUFBO1dBQ0EsR0FGbUI7RUFBQSxDQUFyQixDQXJIQSxDQUFBO0FBQUEsRUEySEEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxVQUFQLEVBQW1CLFNBQUMsTUFBRCxFQUFTLFFBQVQsR0FBQTtBQUNqQixRQUFBLEVBQUE7QUFBQSxJQUFBLElBQUcsbUJBQUEsQ0FBQSxDQUFIO0FBQ0UsTUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLGFBQVIsQ0FBTCxDQUFBO0FBQ0EsY0FBTyxFQUFFLENBQUMsSUFBSCxDQUFRLE1BQVIsQ0FBUDtBQUFBLGFBQ08sSUFEUDtBQUVJLFVBQUEsRUFBRSxDQUFDLElBQUgsQ0FBUSxVQUFSLEVBQW9CLElBQXBCLENBQUEsQ0FBQTtBQUFBLFVBQ0EsRUFBRSxDQUFDLFFBQUgsQ0FBWSxVQUFaLENBREEsQ0FGSjtBQUNPO0FBRFAsYUFJTyxLQUpQO0FBS0ksVUFBQSxFQUFFLENBQUMsVUFBSCxDQUFjLFVBQWQsQ0FBQSxDQUFBO0FBQUEsVUFDQSxFQUFFLENBQUMsV0FBSCxDQUFlLFVBQWYsQ0FEQSxDQUxKO0FBQUEsT0FGRjtLQUFBO1dBU0EsR0FWaUI7RUFBQSxDQUFuQixDQTNIQSxDQUFBO0FBQUEsRUF5SUEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxNQUFQLEVBQWUsRUFBRSxDQUFDLElBQUgsSUFBVyxNQUExQixDQXpJQSxDQUFBO0FBQUEsRUE2SUEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxNQUFQLEVBQWUsU0FBQSxHQUFBO0FBQ2IsSUFBQSxJQUFnQixtQkFBQSxDQUFBLENBQWhCO0FBQUEsTUFBQSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUwsQ0FBQSxDQUFBLENBQUE7S0FBQTtXQUNBLEdBRmE7RUFBQSxDQUFmLENBN0lBLENBQUE7QUFBQSxFQW1KQSxFQUFFLENBQUMsR0FBSCxDQUFPLFFBQVAsRUFBaUIsU0FBQSxHQUFBO0FBQ2YsSUFBQSxJQUFrQixtQkFBQSxDQUFBLENBQWxCO0FBQUEsTUFBQSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQUwsQ0FBQSxDQUFBLENBQUE7S0FBQTtXQUNBLEdBRmU7RUFBQSxDQUFqQixDQW5KQSxDQUFBO0FBQUEsRUF5SkEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxjQUFQLEVBQXVCLFNBQUEsR0FBQTtBQUNyQixJQUFBLElBQUcsbUJBQUEsQ0FBQSxDQUFIO0FBQ0UsTUFBQSxJQUFHLE9BQUg7QUFDRSxRQUFBLEVBQUUsQ0FBQyxPQUFILENBQUEsQ0FBQSxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsRUFBRSxDQUFDLE1BQUgsQ0FBQSxDQUFBLENBSEY7T0FERjtLQUFBO1dBS0EsR0FOcUI7RUFBQSxDQUF2QixDQXpKQSxDQUFBO0FBQUEsRUFtS0EsRUFBRSxDQUFDLEdBQUgsQ0FBTyxTQUFQLEVBQWtCLFNBQUMsU0FBRCxFQUFZLFNBQVosR0FBQTtBQUNoQixJQUFBLElBQXNDLG1CQUFBLENBQUEsQ0FBdEM7QUFBQSxNQUFBLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsU0FBeEIsQ0FBQSxDQUFBO0tBQUE7V0FDQSxHQUZnQjtFQUFBLENBQWxCLENBbktBLENBQUE7QUFBQSxFQXlLQSxFQUFFLENBQUMsR0FBSCxDQUFPLFFBQVAsRUFBaUIsU0FBQyxTQUFELEVBQVksS0FBWixHQUFBO1dBQ2YsRUFBRSxDQUFDLEdBQUgsQ0FBTyxTQUFQLEVBQWtCLEtBQWxCLEVBRGU7RUFBQSxDQUFqQixDQXpLQSxDQUFBO0FBQUEsRUE4S0EsRUFBRSxDQUFDLEdBQUgsQ0FBTyxLQUFQLEVBQWMsU0FBQyxLQUFELEdBQUE7QUFDWixRQUFBLFFBQUE7QUFBQSxJQUFBLElBQUcsbUJBQUEsQ0FBQSxDQUFIO0FBQ0UsTUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FBWCxDQUFBO0FBQ0EsTUFBQSxJQUFHLFNBQVMsQ0FBQyxNQUFWLEtBQW9CLENBQXBCLElBQTBCLEtBQUEsS0FBUyxRQUFRLENBQUMsZUFBVCxDQUF5QixLQUF6QixDQUF0QztBQUNFLFFBQUEsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFBLENBQUE7ZUFDQSxHQUZGO09BQUEsTUFBQTtlQUlFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBTCxDQUFBLEVBSkY7T0FGRjtLQURZO0VBQUEsQ0FBZCxDQTlLQSxDQUFBO0FBQUEsRUF5TEEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxTQUFQLEVBQWtCLFNBQUEsR0FBQTtXQUNoQixFQUFFLENBQUMsR0FBSCxDQUFBLEVBRGdCO0VBQUEsQ0FBbEIsQ0F6TEEsQ0FBQTtBQUFBLEVBOExBLEVBQUUsQ0FBQyxHQUFILENBQU8sVUFBUCxFQUFtQixTQUFBLEdBQUE7V0FDakIsRUFBRSxDQUFDLEdBQUgsQ0FBQSxFQURpQjtFQUFBLENBQW5CLENBOUxBLENBQUE7U0FpTUEsR0FsTUk7QUFBQSxDQVZOLENBQUE7O0FBQUEsRUE4TUUsQ0FBQyxRQUFILENBQVksZ0JBQVosRUFBOEIsU0FBQyxTQUFELEdBQUE7U0FDNUIsS0FBQSxLQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBTixDQUFrQixFQUFFLENBQUMsVUFBSCxDQUFjLFNBQWQsQ0FBbEIsRUFEbUI7QUFBQSxDQUE5QixDQTlNQSxDQUFBOztBQUFBLEVBaU5FLENBQUMsUUFBSCxDQUFZLFlBQVosRUFBMEIsU0FBQyxFQUFELEdBQUE7QUFDeEIsRUFBQSxJQUFHLE1BQUEsQ0FBQSxRQUFBLEtBQXFCLFdBQXhCO1dBQ0UsUUFBUSxDQUFDLGNBQVQsQ0FBd0IsRUFBeEIsRUFERjtHQUR3QjtBQUFBLENBQTFCLENBak5BLENBQUE7O0FBQUEsRUFxTkUsQ0FBQyxRQUFILENBQVksS0FBWixFQUFtQixHQUFuQixDQXJOQSxDQUFBOztBQUFBLE1Bc05NLENBQUMsT0FBUCxHQUFpQixHQXROakIsQ0FBQTs7Ozs7OztBQ0FBLElBQUEsaUJBQUE7RUFBQSxrQkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLENBQ0EsR0FBSSxPQUFBLENBQVEsUUFBUixDQURKLENBQUE7O0FBQUEsQ0FFQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBRkosQ0FBQTs7QUFBQSxPQUlBLENBQVEsU0FBUixDQUpBLENBQUE7O0FBQUEsT0FRQSxHQUNFO0FBQUE7QUFBQTs7S0FBQTtBQUFBLEVBR0EsVUFBQSxFQUFZLFNBQUMsRUFBRCxFQUFLLE1BQUwsR0FBQTtBQUNWLElBQUEsSUFBRyxFQUFIO2FBQVcsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxNQUFULEVBQWlCLFNBQUMsR0FBRCxFQUFNLEdBQU4sR0FBQTtBQUMxQixZQUFBLGtCQUFBO0FBQUEsUUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVIsQ0FBWCxDQUFBO0FBQ0EsUUFBQSxJQUFHLFFBQVEsQ0FBQyxNQUFULENBQWdCLEdBQWhCLENBQUg7QUFDRSxVQUFBLFFBQUEsR0FBVyxTQUFBLEdBQUE7QUFBYyxnQkFBQSxLQUFBO0FBQUEsWUFBYiwrREFBYSxDQUFBO21CQUFBLEdBQUEsYUFBSSxLQUFKLEVBQWQ7VUFBQSxDQUFYLENBQUE7QUFBQSxVQUNBLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBTCxDQUFRLEdBQVIsRUFBYSxRQUFiLENBREEsQ0FBQTtBQUFBLFVBRUEsRUFBRSxDQUFDLEdBQUgsQ0FBTyxHQUFQLEVBQVksUUFBWixDQUZBLENBQUE7aUJBR0EsS0FKRjtTQUYwQjtNQUFBLENBQWpCLEVBQVg7S0FEVTtFQUFBLENBSFo7QUFZQTtBQUFBOztLQVpBO0FBQUEsRUFlQSxRQUFBLEVBQVUsU0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEtBQVgsRUFBa0IsTUFBbEIsRUFBMEIsTUFBMUIsRUFBa0MsSUFBbEMsR0FBQTtBQUNSLElBQUEsR0FBRyxDQUFDLEdBQUosQ0FBUSxTQUFSLEVBQW1CLEdBQW5CLENBQUEsQ0FBQTtBQUFBLElBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxNQUFSLENBREEsQ0FBQTtBQUVBLElBQUEsSUFBRyxJQUFIO0FBQWEsTUFBQSxHQUFHLENBQUMsSUFBSixDQUFTLElBQVQsQ0FBQSxDQUFiO0tBRkE7QUFBQSxJQUdBLEdBQUcsQ0FBQyxHQUFKLENBQVEsR0FBUixFQUFhLENBQUEsQ0FBRSxHQUFHLENBQUMsR0FBSixDQUFBLENBQUYsQ0FBYixDQUhBLENBQUE7QUFBQSxJQUlBLEdBQUcsQ0FBQyxHQUFKLENBQVEsR0FBUixFQUFhLEdBQUcsQ0FBQyxHQUFKLENBQUEsQ0FBYixDQUpBLENBQUE7QUFBQSxJQU1BLEdBQUcsQ0FBQyxHQUFKLENBQVEsWUFBUixFQUFzQixDQUFDLENBQUMsSUFBRixDQUFPLFNBQUEsR0FBQTthQUFNLE9BQU8sQ0FBQyxVQUFSLENBQW1CLEdBQW5CLEVBQXdCLE1BQXhCLEVBQU47SUFBQSxDQUFQLENBQXRCLENBTkEsQ0FBQTtXQU9BLElBUlE7RUFBQSxDQWZWO0FBMEJBO0FBQUE7O0tBMUJBO0FBQUEsRUE2QkEsY0FBQSxFQUFnQixTQUFDLEVBQUQsRUFBSyxHQUFMLEdBQUE7QUFDZCxRQUFBLGdCQUFBOztNQURtQixNQUFNLEVBQUUsQ0FBQztLQUM1QjtBQUFBLElBQUEsV0FBQSxHQUFjLE9BQUEsQ0FBUSxlQUFSLENBQWQsQ0FBQTtBQUFBLElBQ0EsR0FBQSxHQUFVLElBQUEsT0FBQSxDQUFRLElBQVIsRUFBYyxJQUFkLEVBQW9CLEVBQXBCLENBRFYsQ0FBQTtBQUFBLElBRUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsR0FBakIsRUFBc0IsR0FBdEIsQ0FGQSxDQUFBO0FBQUEsSUFHQSxHQUFHLENBQUMsR0FBSixDQUFRLFNBQVIsRUFBbUIsSUFBbkIsQ0FIQSxDQUFBO0FBQUEsSUFJQSxXQUFXLENBQUMsSUFBWixDQUFpQixHQUFqQixDQUpBLENBQUE7V0FLQSxJQU5jO0VBQUEsQ0E3QmhCO0FBc0NBO0FBQUE7O0tBdENBO0FBQUEsRUF5Q0EsT0FBQSxFQUFTLFNBQUMsR0FBRCxFQUFNLE9BQU4sRUFBZSxLQUFmLEVBQXNCLG1CQUF0QixHQUFBO0FBQ1AsUUFBQSxnQkFBQTs7TUFENkIsc0JBQXNCO0tBQ25EO0FBQUEsSUFBQSxHQUFBLEdBQVUsSUFBQSxPQUFBLENBQVEsR0FBUixFQUFhLE9BQU8sQ0FBQyxLQUFyQixDQUFWLENBQUE7QUFBQSxJQUNBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLEdBQWpCLEVBQXNCLEdBQXRCLEVBQTJCLE9BQU8sQ0FBQyxLQUFuQyxFQUEwQyxPQUFPLENBQUMsTUFBbEQsRUFBMEQsT0FBTyxDQUFDLE1BQWxFLEVBQTBFLE9BQU8sQ0FBQyxJQUFsRixDQURBLENBQUE7QUFFQSxJQUFBLElBQUcsS0FBQSxJQUFVLEtBQUEsS0FBUyxtQkFBdEI7QUFDRSxNQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUixDQUFkLENBQUE7QUFBQSxNQUNBLFdBQVcsQ0FBQyxJQUFaLENBQWlCLEdBQWpCLEVBQXNCLEtBQXRCLENBREEsQ0FERjtLQUZBO1dBS0EsSUFOTztFQUFBLENBekNUO0NBVEYsQ0FBQTs7QUFBQSxFQTBERSxDQUFDLFFBQUgsQ0FBWSxnQkFBWixFQUE4QixPQUFPLENBQUMsY0FBdEMsQ0ExREEsQ0FBQTs7QUFBQSxFQTJERSxDQUFDLFFBQUgsQ0FBWSxTQUFaLEVBQXVCLE9BQU8sQ0FBQyxPQUEvQixDQTNEQSxDQUFBOztBQUFBLE1BNkRNLENBQUMsT0FBUCxHQUFpQixPQTdEakIsQ0FBQTs7Ozs7OztBQ0FBLElBQUEsZ0JBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEdBQUssT0FBQSxDQUFRLFdBQVIsQ0FETCxDQUFBOztBQUFBLFFBTUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxNQUFBLEdBQUE7QUFBQSxFQUFBLEdBQUEsR0FBTSxJQUFOLENBQUE7QUFDQSxFQUFBLElBQUcsTUFBQSxDQUFBLFFBQUEsS0FBcUIsV0FBeEI7QUFDRSxJQUFBLFFBQUEsR0FBVyxRQUFRLENBQUMsc0JBQVQsQ0FBQSxDQUFYLENBQUE7QUFBQSxJQUNBLEdBQUEsR0FBTSxFQUFFLENBQUMsY0FBSCxDQUFrQixRQUFsQixFQUE0QixVQUE1QixDQUROLENBREY7R0FEQTtTQUlBLElBTFM7QUFBQSxDQU5YLENBQUE7O0FBQUEsRUFhRSxDQUFDLFFBQUgsQ0FBWSxVQUFaLEVBQXdCLFFBQXhCLENBYkEsQ0FBQTs7QUFBQSxNQWNNLENBQUMsT0FBUCxHQUFpQixRQWRqQixDQUFBOzs7OztBQ0FBLElBQUEsZ0VBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEdBQUssT0FBQSxDQUFRLFdBQVIsQ0FETCxDQUFBOztBQUFBLE9BRUEsQ0FBUSxXQUFSLENBRkEsQ0FBQTs7QUFBQSxHQUdBLEdBQU0sT0FBQSxDQUFRLGdCQUFSLENBSE4sQ0FBQTs7QUFBQSxNQU9BLEdBQVMsQ0FDUCxNQURPLEVBRVAsU0FGTyxFQUdQLFFBSE8sRUFJUCxTQUpPLEVBS1AsT0FMTyxFQU1QLE9BTk8sRUFPUCxHQVBPLEVBUVAsS0FSTyxFQVNQLEtBVE8sRUFVUCxZQVZPLEVBV1AsUUFYTyxFQVlQLFFBWk8sRUFhUCxTQWJPLEVBY1AsUUFkTyxFQWVQLE1BZk8sRUFnQlAsTUFoQk8sRUFpQlAsVUFqQk8sRUFrQlAsVUFsQk8sRUFtQlAsSUFuQk8sRUFvQlAsS0FwQk8sRUFxQlAsU0FyQk8sRUFzQlAsS0F0Qk8sRUF1QlAsS0F2Qk8sRUF3QlAsS0F4Qk8sRUF5QlAsSUF6Qk8sRUEwQlAsSUExQk8sRUEyQlAsSUEzQk8sRUE0QlAsVUE1Qk8sRUE2QlAsWUE3Qk8sRUE4QlAsUUE5Qk8sRUErQlAsTUEvQk8sRUFnQ1AsUUFoQ08sRUFpQ1AsSUFqQ08sRUFrQ1AsSUFsQ08sRUFtQ1AsSUFuQ08sRUFvQ1AsSUFwQ08sRUFxQ1AsSUFyQ08sRUFzQ1AsSUF0Q08sRUF1Q1AsTUF2Q08sRUF3Q1AsUUF4Q08sRUF5Q1AsUUF6Q08sRUEwQ1AsTUExQ08sRUEyQ1AsR0EzQ08sRUE0Q1AsUUE1Q08sRUE2Q1AsS0E3Q08sRUE4Q1AsS0E5Q08sRUErQ1AsT0EvQ08sRUFnRFAsUUFoRE8sRUFpRFAsSUFqRE8sRUFrRFAsS0FsRE8sRUFtRFAsTUFuRE8sRUFvRFAsTUFwRE8sRUFxRFAsT0FyRE8sRUFzRFAsS0F0RE8sRUF1RFAsVUF2RE8sRUF3RFAsVUF4RE8sRUF5RFAsUUF6RE8sRUEwRFAsVUExRE8sRUEyRFAsUUEzRE8sRUE0RFAsUUE1RE8sRUE2RFAsR0E3RE8sRUE4RFAsS0E5RE8sRUErRFAsVUEvRE8sRUFnRVAsR0FoRU8sRUFpRVAsSUFqRU8sRUFrRVAsSUFsRU8sRUFtRVAsTUFuRU8sRUFvRVAsR0FwRU8sRUFxRVAsTUFyRU8sRUFzRVAsU0F0RU8sRUF1RVAsT0F2RU8sRUF3RVAsTUF4RU8sRUF5RVAsUUF6RU8sRUEwRVAsUUExRU8sRUEyRVAsT0EzRU8sRUE0RVAsS0E1RU8sRUE2RVAsU0E3RU8sRUE4RVAsS0E5RU8sRUErRVAsT0EvRU8sRUFnRlAsSUFoRk8sRUFpRlAsT0FqRk8sRUFrRlAsSUFsRk8sRUFtRlAsTUFuRk8sRUFvRlAsT0FwRk8sRUFxRlAsSUFyRk8sRUFzRlAsSUF0Rk8sRUF1RlAsR0F2Rk8sRUF3RlAsS0F4Rk8sRUF5RlAsT0F6Rk8sRUEwRlAsS0ExRk8sQ0FQVCxDQUFBOztBQUFBLElBbUdBLEdBQU8sMkVBQTJFLENBQUMsS0FBNUUsQ0FBa0YsR0FBbEYsQ0FuR1AsQ0FBQTs7QUFBQSxHQW9HQSxHQUFNLE1BQU0sQ0FBQyxNQUFQLENBQWMsSUFBZCxDQXBHTixDQUFBOztBQUFBLE9Bc0dBLEdBQVUsRUF0R1YsQ0FBQTs7QUF3R0EsTUFDSyxTQUFDLEdBQUQsR0FBQTtBQUNELE1BQUEsTUFBQTtBQUFBLEVBQUEsTUFBQSxHQUFTLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUVQLFFBQUEsZ0NBQUE7O01BRmlCLFFBQVEsT0FBQSxDQUFRLFFBQVIsRUFBa0IsaUJBQUEsR0FBb0IsS0FBdEM7S0FFekI7QUFBQSxJQUFBLFFBQUEsR0FDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQVA7QUFBQSxNQUNBLE1BQUEsRUFBUSxFQURSO0FBQUEsTUFFQSxNQUFBLEVBQVEsRUFGUjtLQURGLENBQUE7QUFBQSxJQUtBLEdBQUcsQ0FBQyxNQUFKLENBQVcsUUFBWCxFQUFxQixPQUFyQixDQUxBLENBQUE7QUFBQSxJQU1BLEdBQUEsR0FBTSxFQUFFLENBQUMsT0FBSCxDQUFXLEdBQVgsRUFBZ0IsUUFBaEIsRUFBMEIsS0FBMUIsRUFBaUMsaUJBQWpDLENBTk4sQ0FBQTtXQVFBLElBVk87RUFBQSxDQUFULENBQUE7QUFBQSxFQVdBLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBVCxDQUFrQixHQUFsQixFQUF1QixNQUF2QixDQVhBLENBQUE7U0FZQSxPQUFRLENBQUEsR0FBQSxDQUFSLEdBQWUsT0FiZDtBQUFBLENBREw7QUFBQSxLQUFBLDBDQUFBO3FCQUFBO0FBQ0UsTUFBVSxTQUFWLENBREY7QUFBQSxDQXhHQTs7QUFBQSxNQXdITSxDQUFDLE9BQVAsR0FBaUIsT0F4SGpCLENBQUE7Ozs7O0FDQUEsSUFBQSxTQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBRUE7QUFBQTs7R0FGQTs7QUFBQSxLQUtBLEdBQVEsU0FBQyxPQUFELEVBQXdCLEtBQXhCLEdBQUE7QUFDTixNQUFBLEdBQUE7O0lBRE8sVUFBVSxFQUFFLENBQUMsTUFBSCxDQUFBO0dBQ2pCO0FBQUEsRUFBQSxJQUFHLENBQUEsS0FBSDtBQUFrQixVQUFVLElBQUEsS0FBQSxDQUFNLHlDQUFOLENBQVYsQ0FBbEI7R0FBQTtBQUNBLEVBQUEsSUFBRyxDQUFBLE9BQVcsQ0FBQyxLQUFaLElBQXFCLENBQUEsT0FBVyxDQUFDLEtBQUssQ0FBQyxJQUExQztBQUFvRCxVQUFVLElBQUEsS0FBQSxDQUFNLDhDQUFOLENBQVYsQ0FBcEQ7R0FEQTtBQUFBLEVBRUEsR0FBQSxHQUFNLEtBQUssQ0FBQyxJQUFOLENBQVcsT0FBWCxFQUFvQixPQUFwQixDQUZOLENBQUE7QUFBQSxFQUdBLEdBQUcsQ0FBQyxHQUFKLENBQVEsV0FBUixFQUFxQixPQUFPLENBQUMsS0FBSyxDQUFDLElBQW5DLENBSEEsQ0FBQTtTQUlBLElBTE07QUFBQSxDQUxSLENBQUE7O0FBQUEsRUFZRSxDQUFDLFFBQUgsQ0FBWSxPQUFaLEVBQXFCLEtBQXJCLENBWkEsQ0FBQTs7QUFBQSxNQWFNLENBQUMsT0FBUCxHQUFpQixLQWJqQixDQUFBOzs7OztBQ0FBLElBQUEsbUdBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxDQUVBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FGSixDQUFBOztBQUFBLE1BSUEsR0FBUyx3a0JBQXdrQixDQUFDLEtBQXprQixDQUEra0IsR0FBL2tCLENBSlQsQ0FBQTs7QUFBQSxJQUtBLEdBQU8sa0dBQWtHLENBQUMsS0FBbkcsQ0FBeUcsR0FBekcsQ0FMUCxDQUFBOztBQUFBLGlCQU9BLEdBQW9CLENBQ2xCLEtBRGtCLEVBRWxCLE1BRmtCLEVBR2xCLElBSGtCLEVBSWxCLElBSmtCLEVBS2xCLElBTGtCLEVBTWxCLElBTmtCLEVBT2xCLElBUGtCLEVBUWxCLElBUmtCLEVBU2xCLEdBVGtCLEVBVWxCLFVBVmtCLEVBV2xCLFFBWGtCLEVBWWxCLElBWmtCLEVBYWxCLElBYmtCLEVBY2xCLE9BZGtCLENBUHBCLENBQUE7O0FBQUEsZ0JBeUJBLEdBQW1CLENBQ2pCLElBRGlCLEVBRWpCLFFBRmlCLEVBR2pCLElBSGlCLEVBSWpCLElBSmlCLEVBS2pCLFFBTGlCLEVBTWpCLE1BTmlCLEVBT2pCLE1BUGlCLEVBUWpCLFFBUmlCLEVBU2pCLE9BVGlCLEVBVWpCLE9BVmlCLEVBV2pCLE9BWGlCLEVBWWpCLE1BWmlCLEVBYWpCLFFBYmlCLENBekJuQixDQUFBOztBQUFBLE9BeUNBLEdBQVUsRUF6Q1YsQ0FBQTs7QUEwQ0E7QUFBQTs7R0ExQ0E7O0FBQUEsT0E2Q08sQ0FBQyxHQUFSLEdBQWMsU0FBQyxFQUFELEVBQUssT0FBTCxHQUFBO0FBQ1osTUFBQSxlQUFBOztJQURpQixVQUFVO0dBQzNCO0FBQUEsRUFBQSxHQUFBLEdBQU0sSUFBTixDQUFBO0FBQUEsRUFDQSxFQUFBLEdBQUssUUFBUSxDQUFDLGNBQVQsQ0FBd0IsRUFBeEIsQ0FETCxDQUFBO0FBRUEsRUFBQSxJQUFHLEVBQUg7QUFDRSxJQUFBLE1BQUEsR0FBUyxFQUFFLENBQUMsY0FBSCxDQUFrQixFQUFsQixFQUFzQixPQUF0QixDQUFULENBREY7R0FGQTtBQUlBLEVBQUEsSUFBRyxNQUFIO0FBQ0UsSUFBQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFULENBQWlCLE1BQWpCLEVBQXlCLElBQXpCLEVBQStCLENBQS9CLENBQU4sQ0FERjtHQUpBO1NBT0EsSUFSWTtBQUFBLENBN0NkLENBQUE7O0FBQUEsU0F1REEsR0FBWSxDQUNWLEdBRFUsRUFFVixHQUZVLEVBR1YsSUFIVSxFQUlWLFFBSlUsRUFLVixLQUxVLEVBTVYsSUFOVSxFQU9WLFVBUFUsRUFRVixNQVJVLEVBU1YsSUFUVSxFQVVWLElBVlUsRUFXVixJQVhVLEVBWVYsSUFaVSxFQWFWLElBYlUsRUFjVixJQWRVLEVBZVYsR0FmVSxFQWdCVixLQWhCVSxFQWlCVixPQWpCVSxFQWtCVixPQWxCVSxFQW1CVixRQW5CVSxFQW9CVixJQXBCVSxFQXFCVixLQXJCVSxFQXNCVixJQXRCVSxFQXVCVixRQXZCVSxFQXdCVixHQXhCVSxFQXlCVixRQXpCVSxFQTBCVixNQTFCVSxFQTJCVixRQTNCVSxFQTRCVixLQTVCVSxFQTZCVixLQTdCVSxFQThCVixPQTlCVSxFQStCVixPQS9CVSxFQWdDVixJQWhDVSxFQWlDVixVQWpDVSxFQWtDVixJQWxDVSxFQW1DVixPQW5DVSxFQW9DVixJQXBDVSxFQXFDVixJQXJDVSxDQXZEWixDQUFBOztBQUFBLE9BK0ZBLEdBQVUsU0FBQyxPQUFELEVBQVUsRUFBVixFQUFjLEtBQWQsR0FBQTtTQUNSLFNBQUMsSUFBRCxHQUFBO0FBQ0UsUUFBQSxVQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsRUFBRSxDQUFDLEtBQU0sQ0FBQSxPQUFBLENBQVQsSUFBcUIsRUFBRSxDQUFDLFVBQVcsQ0FBQSxPQUFBLENBQW5DLElBQStDLEVBQUUsQ0FBQyxRQUFTLENBQUEsT0FBQSxDQUEzRCxJQUF1RSxFQUFFLENBQUMsTUFBTyxDQUFBLE9BQUEsQ0FBMUYsQ0FBQTtBQUNBLElBQUEsSUFBRyxNQUFIO0FBQ0UsTUFBQSxFQUFBLEdBQUssTUFBQSxDQUFPLElBQVAsRUFBYSxFQUFiLEVBQWlCLElBQWpCLENBQUwsQ0FERjtLQUFBLE1BQUE7QUFHRSxNQUFBLEVBQUEsR0FBSyxFQUFFLENBQUMsU0FBSCxDQUFhLElBQWIsRUFBbUIsRUFBbkIsRUFBdUIsT0FBdkIsQ0FBTCxDQUhGO0tBREE7V0FLQSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQVQsQ0FBaUIsRUFBakIsRUFBcUIsRUFBckIsRUFBeUIsS0FBekIsRUFORjtFQUFBLEVBRFE7QUFBQSxDQS9GVixDQUFBOztBQUFBLE9Bd0dPLENBQUMsYUFBUixHQUF3QixTQUFDLEVBQUQsRUFBSyxLQUFMLEdBQUE7QUFDdEIsTUFBQSxPQUFBO0FBQUEsRUFBQSxPQUFBLEdBQVUsRUFBRSxDQUFDLE1BQUgsQ0FBQSxDQUFWLENBQUE7QUFBQSxFQUNBLEVBQUUsQ0FBQyxJQUFILEdBQVUsU0FBQyxPQUFELEVBQVUsSUFBVixHQUFBO0FBQ1IsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsT0FBUSxDQUFBLE9BQUEsQ0FBakIsQ0FBQTtBQUNBLElBQUEsSUFBRyxDQUFBLE1BQUg7QUFDRSxNQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsT0FBUixFQUFpQixFQUFqQixFQUFxQixLQUFyQixDQUFULENBQUE7QUFBQSxNQUNBLE9BQVEsQ0FBQSxPQUFBLENBQVIsR0FBbUIsTUFEbkIsQ0FERjtLQURBO1dBSUEsTUFBQSxDQUFPLElBQVAsRUFMUTtFQUFBLENBRFYsQ0FBQTtTQU9BLEdBUnNCO0FBQUEsQ0F4R3hCLENBQUE7O0FBQUEsWUFrSEEsR0FBZSxTQUFDLEVBQUQsRUFBSyxNQUFMLEVBQWEsS0FBYixHQUFBO0FBQ2IsTUFBQSxFQUFBO0FBQUEsRUFBQSxJQUFHLEVBQUUsQ0FBQyxtQkFBTjtBQUNFLElBQUEsS0FBQSxJQUFTLENBQVQsQ0FBQTtBQUNBLElBQUEsSUFBRyxLQUFBLElBQVMsTUFBTSxDQUFDLEtBQW5CO0FBQThCLE1BQUEsS0FBQSxHQUFRLE1BQU0sQ0FBQyxLQUFQLEdBQWUsQ0FBdkIsQ0FBOUI7S0FEQTtBQUFBLElBRUEsTUFBTSxDQUFDLEtBQVAsR0FBZSxLQUZmLENBQUE7QUFJQSxJQUFBLElBQUcsQ0FBQSxFQUFNLENBQUMsS0FBSCxDQUFBLENBQVA7QUFDRSxNQUFBLEVBQUEsR0FBSyxNQUFNLENBQUMsS0FBUCxDQUFBLENBQUEsSUFBa0IsRUFBdkIsQ0FBQTtBQUFBLE1BQ0EsRUFBQSxJQUFNLEVBQUUsQ0FBQyxPQUFILEdBQWEsS0FEbkIsQ0FBQTtBQUFBLE1BRUEsRUFBRSxDQUFDLElBQUgsQ0FBUSxJQUFSLEVBQWMsRUFBZCxDQUZBLENBREY7S0FMRjtHQURhO0FBQUEsQ0FsSGYsQ0FBQTs7QUE4SEE7QUFBQTs7R0E5SEE7O0FBQUEsT0FpSU8sQ0FBQyxJQUFSLEdBQWUsU0FBQyxFQUFELEVBQUssTUFBTCxFQUFpQyxLQUFqQyxHQUFBO0FBR2IsTUFBQSxhQUFBOztJQUhrQixTQUFTLE9BQUEsQ0FBUSxRQUFSO0dBRzNCOztJQUg4QyxRQUFRLE1BQU0sQ0FBQyxLQUFQLElBQWdCO0dBR3RFO0FBQUEsRUFBQSxHQUFBLEdBQU0sRUFBTixDQUFBO0FBR0EsRUFBQSxJQUFHLENBQUEsRUFBTSxDQUFDLFdBQVY7QUFHRSxJQUFBLElBQUcsRUFBRSxDQUFDLE9BQUgsS0FBZ0IsTUFBbkI7QUFFRSxNQUFBLEdBQUEsR0FBTSxFQUFFLENBQUMsR0FBSCxDQUFPLEVBQVAsRUFBVyxNQUFYLENBQU4sQ0FBQTtBQUlBLE1BQUEsSUFBRyxDQUFBLEdBQU8sQ0FBQyxPQUFYO0FBQ0UsUUFBQSxZQUFBLENBQWEsRUFBYixFQUFpQixNQUFqQixFQUF5QixLQUF6QixDQUFBLENBQUE7QUFBQSxRQUNBLE1BQU0sQ0FBQyxNQUFQLENBQWMsR0FBSSxDQUFBLENBQUEsQ0FBbEIsQ0FEQSxDQUFBO0FBQUEsUUFHQSxHQUFHLENBQUMsVUFBSixDQUFBLENBSEEsQ0FBQTtBQUFBLFFBSUEsR0FBRyxDQUFDLE9BQUosR0FBYyxJQUpkLENBREY7T0FKQTtBQUFBLE1BWUEsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsR0FBdEIsRUFBMkIsS0FBM0IsQ0FaQSxDQUFBO0FBQUEsTUFlQSxHQUFHLENBQUMsV0FBSixHQUFrQixJQWZsQixDQUFBO0FBQUEsTUFrQkEsUUFBQSxHQUFXLENBQUMsQ0FBQyxJQUFGLENBQU8sR0FBRyxDQUFDLFFBQUosSUFBZ0IsRUFBRSxDQUFDLElBQTFCLENBbEJYLENBQUE7QUFBQSxNQW1CQSxHQUFHLENBQUMsUUFBSixHQUFlLFFBbkJmLENBQUE7QUFBQSxNQW9CQSxRQUFBLENBQVMsR0FBVCxDQXBCQSxDQUZGO0tBSEY7R0FIQTtTQStCQSxJQWxDYTtBQUFBLENBaklmLENBQUE7O0FBQUEsRUFzS0UsQ0FBQyxLQUFLLENBQUMsUUFBVCxDQUFrQixTQUFsQixFQUE2QixPQUFPLENBQUMsSUFBckMsQ0F0S0EsQ0FBQTs7QUFBQSxFQXVLRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLEtBQWxCLEVBQXlCLE9BQU8sQ0FBQyxHQUFqQyxDQXZLQSxDQUFBOztBQUFBLE1Bd0tNLENBQUMsT0FBUCxHQUFpQixPQXhLakIsQ0FBQTs7Ozs7OztBQ0FBLElBQUEsc0JBQUE7RUFBQSxrQkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsR0FBSyxPQUFBLENBQVEsZ0JBQVIsQ0FETCxDQUFBOztBQUFBLFFBSUEsR0FBVyxHQUpYLENBQUE7O0FBQUEsSUFNQSxHQUFPLFNBQUMsT0FBRCxFQUFVLEtBQVYsRUFBMEMsaUJBQTFDLEdBQUE7QUFFTCxNQUFBLG1EQUFBOztJQUZlLFFBQVEsT0FBQSxDQUFRLGFBQVI7R0FFdkI7O0lBRitDLG9CQUFvQjtHQUVuRTtBQUFBLEVBQUEsUUFBQSxHQUNFO0FBQUEsSUFBQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsTUFDQSxPQUFBLEVBQU8sRUFEUDtBQUFBLE1BRUEsSUFBQSxFQUFNLEVBRk47QUFBQSxNQUdBLElBQUEsRUFBTSxxQkFITjtBQUFBLE1BSUEsSUFBQSxFQUFNLEVBSk47QUFBQSxNQUtBLEtBQUEsRUFBTyxFQUxQO0FBQUEsTUFNQSxHQUFBLEVBQUssRUFOTDtBQUFBLE1BT0EsS0FBQSxFQUFPLEVBUFA7QUFBQSxNQVFBLE1BQUEsRUFBUSxFQVJSO0tBREY7QUFBQSxJQVVBLE1BQUEsRUFBUSxFQVZSO0FBQUEsSUFXQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtLQVpGO0dBREYsQ0FBQTtBQUFBLEVBZ0JBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQWhCQSxDQUFBO0FBQUEsRUFrQkEsV0FBQSxHQUFjLEtBbEJkLENBQUE7QUFBQSxFQW9CQSxNQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsSUFBQSxJQUFHLFdBQUEsS0FBZSxJQUFsQjtBQUNFLE1BQUEsV0FBQSxHQUFjLEtBQWQsQ0FERjtLQUFBLE1BQUE7QUFFSyxNQUFBLElBQXVCLFdBQUEsS0FBZSxLQUF0QztBQUFBLFFBQUEsV0FBQSxHQUFjLElBQWQsQ0FBQTtPQUZMO0tBRE87RUFBQSxDQXBCVCxDQUFBO0FBMkJBLEVBQUEsSUFBRyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQWhCLEtBQTJCLEVBQUUsQ0FBQyxJQUFqQztBQUNFLElBQUEsS0FBQSxHQUFRLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBeEIsQ0FBQTtBQUFBLElBQ0EsUUFBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsYUFBQTtBQUFBLE1BRFUsK0RBQ1YsQ0FBQTtBQUFBLE1BQUEsTUFBQSxDQUFBLENBQUEsQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFTLEtBQUEsYUFBTSxLQUFOLENBRFQsQ0FBQTtBQUVBLE1BQUEsSUFBRyxRQUFRLENBQUMsSUFBVCxLQUFpQixHQUFwQjtBQUE2QixRQUFBLE1BQUEsR0FBUyxLQUFULENBQTdCO09BRkE7YUFHQSxPQUpTO0lBQUEsQ0FEWCxDQUFBO0FBQUEsSUFNQSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQWhCLEdBQXdCLFFBTnhCLENBREY7R0FBQSxNQUFBO0FBU0UsSUFBQSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQWhCLEdBQXdCLE1BQXhCLENBVEY7R0EzQkE7QUFBQSxFQXNDQSxHQUFBLEdBQU0sRUFBRSxDQUFDLE9BQUgsQ0FBVyxRQUFYLEVBQXFCLFFBQXJCLEVBQStCLEtBQS9CLEVBQXNDLGlCQUF0QyxDQXRDTixDQUFBO1NBd0NBLElBMUNLO0FBQUEsQ0FOUCxDQUFBOztBQUFBLEVBa0RFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEIsSUFBNUIsQ0FsREEsQ0FBQTs7QUFBQSxNQW1ETSxDQUFDLE9BQVAsR0FBaUIsSUFuRGpCLENBQUE7Ozs7O0FDQUEsSUFBQSwwQkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsR0FBSyxPQUFBLENBQVEsZ0JBQVIsQ0FETCxDQUFBOztBQUFBLEVBRUEsR0FBSyxPQUFBLENBQVEsYUFBUixDQUZMLENBQUE7O0FBQUEsUUFLQSxHQUFXLElBTFgsQ0FBQTs7QUFBQSxJQU9BLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixFQUEwQyxpQkFBMUMsR0FBQTtBQUVMLE1BQUEsZ0JBQUE7O0lBRmUsUUFBUSxPQUFBLENBQVEsYUFBUjtHQUV2Qjs7SUFGK0Msb0JBQW9CO0dBRW5FO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsSUFDQSxNQUFBLEVBQVEsRUFEUjtBQUFBLElBRUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7S0FIRjtBQUFBLElBSUEsTUFBQSxFQUFRLENBSlI7R0FERixDQUFBO0FBQUEsRUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsRUFRQSxDQUFBLEdBQUksQ0FSSixDQUFBO0FBU0EsU0FBTSxDQUFBLEdBQUksRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFRLENBQUMsTUFBbkIsQ0FBVixHQUFBO0FBRUUsSUFBQSxHQUFBLEdBQU0sRUFBRSxDQUFDLE9BQUgsQ0FBVyxRQUFYLEVBQXFCLFFBQXJCLEVBQStCLEtBQS9CLEVBQXNDLGlCQUF0QyxDQUFOLENBQUE7QUFBQSxJQUVBLENBQUEsSUFBSyxDQUZMLENBRkY7RUFBQSxDQVRBO0FBZUEsRUFBQSxJQUFHLEtBQUEsS0FBUyxpQkFBWjtBQUFtQyxJQUFBLFlBQUEsQ0FBYSxHQUFiLEVBQWtCLEtBQWxCLENBQUEsQ0FBbkM7R0FmQTtTQWlCQSxJQW5CSztBQUFBLENBUFAsQ0FBQTs7QUFBQSxFQTRCRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLFFBQWxCLEVBQTRCLElBQTVCLENBNUJBLENBQUE7O0FBQUEsTUE2Qk0sQ0FBQyxPQUFQLEdBQWlCLElBN0JqQixDQUFBOzs7OztBQ0FBLElBQUEsc0JBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEdBQUssT0FBQSxDQUFRLGdCQUFSLENBREwsQ0FBQTs7QUFBQSxRQUtBLEdBQVcsTUFMWCxDQUFBOztBQUFBLElBT0EsR0FBTyxTQUFDLE9BQUQsRUFBVSxLQUFWLEVBQTBDLGlCQUExQyxHQUFBO0FBRUwsTUFBQSxhQUFBOztJQUZlLFFBQVEsT0FBQSxDQUFRLGFBQVI7R0FFdkI7O0lBRitDLG9CQUFvQjtHQUVuRTtBQUFBLEVBQUEsUUFBQSxHQUNFO0FBQUEsSUFBQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLE1BQUEsRUFBUSxFQUFSO0FBQUEsTUFDQSxNQUFBLEVBQVEsRUFEUjtBQUFBLE1BRUEsSUFBQSxFQUFNLEVBRk47S0FERjtBQUFBLElBSUEsTUFBQSxFQUFRLEVBSlI7QUFBQSxJQUtBLE1BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO0tBTkY7R0FERixDQUFBO0FBQUEsRUFTQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FUQSxDQUFBO0FBQUEsRUFVQSxHQUFBLEdBQU0sRUFBRSxDQUFDLE9BQUgsQ0FBVyxRQUFYLEVBQXFCLFFBQXJCLEVBQStCLEtBQS9CLEVBQXNDLGlCQUF0QyxDQVZOLENBQUE7QUFBQSxFQVlBLEdBQUcsQ0FBQyxHQUFKLENBQVEsV0FBUixFQUFxQixHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQU4sQ0FDbkI7QUFBQSxJQUFBLFNBQUEsRUFBVyxTQUFDLE9BQUQsR0FBQTtBQUNULFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLENBQUEsQ0FBRSxPQUFGLENBQVAsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxZQUFWLEVBQXdCLEdBQXhCLENBREEsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLE9BQUwsQ0FBYTtBQUFBLFFBQUEsZUFBQSxFQUFpQixLQUFqQjtPQUFiLENBRkEsQ0FBQTthQUdBLEtBSlM7SUFBQSxDQUFYO0FBQUEsSUFNQSxXQUFBLEVBQWEsU0FBQyxPQUFELEdBQUE7QUFDWCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxDQUFBLENBQUUsT0FBRixDQUFQLENBQUE7QUFDQSxNQUFBLElBQUcsSUFBSSxDQUFDLElBQUwsQ0FBVSxZQUFWLENBQUEsS0FBMkIsR0FBOUI7QUFDRSxRQUFBLElBQUksQ0FBQyxHQUFMLENBQVMsa0JBQVQsRUFBNkIsUUFBN0IsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLFlBQVYsRUFBd0IsR0FBeEIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxVQUFBLENBQVcsQ0FBQyxTQUFBLEdBQUE7aUJBQ1YsSUFBSSxDQUFDLE9BQUwsQ0FBYTtBQUFBLFlBQUEsZUFBQSxFQUFpQixhQUFqQjtXQUFiLEVBRFU7UUFBQSxDQUFELENBQVgsRUFFRyxHQUZILENBRkEsQ0FERjtPQURBO2FBT0EsS0FSVztJQUFBLENBTmI7R0FEbUIsQ0FBckIsQ0FaQSxDQUFBO0FBQUEsRUE4QkEsR0FBRyxDQUFDLEdBQUosQ0FBUSxhQUFSLEVBQXVCLFNBQUEsR0FBQTtXQUNyQixHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQU4sQ0FBQSxDQUFBLElBQWtCLENBQUMsQ0FBQSxHQUFPLENBQUMsU0FBUyxDQUFDLGVBQWQsQ0FBQSxDQUFKLElBQXVDLEdBQUcsQ0FBQyxTQUFTLENBQUMsZUFBZCxDQUFBLENBQStCLENBQUMsTUFBaEMsS0FBMEMsQ0FBbEYsRUFERztFQUFBLENBQXZCLENBOUJBLENBQUE7U0FtQ0EsSUFyQ0s7QUFBQSxDQVBQLENBQUE7O0FBQUEsRUE4Q0UsQ0FBQyxLQUFLLENBQUMsUUFBVCxDQUFrQixRQUFsQixFQUE0QixJQUE1QixDQTlDQSxDQUFBOztBQUFBLE1BK0NNLENBQUMsT0FBUCxHQUFpQixJQS9DakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLDZCQUFBO0VBQUEsa0JBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEdBQUssT0FBQSxDQUFRLGdCQUFSLENBREwsQ0FBQTs7QUFBQSxLQUVBLEdBQVEsT0FBQSxDQUFRLGdCQUFSLENBRlIsQ0FBQTs7QUFBQSxRQU1BLEdBQVcsT0FOWCxDQUFBOztBQUFBLElBT0EsR0FBTyxTQUFDLE9BQUQsRUFBVSxLQUFWLEVBQTBDLGlCQUExQyxHQUFBO0FBRUwsTUFBQSxzR0FBQTs7SUFGZSxRQUFRLE9BQUEsQ0FBUSxhQUFSO0dBRXZCOztJQUYrQyxvQkFBb0I7R0FFbkU7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sTUFBTjtBQUFBLE1BQ0EsS0FBQSxFQUFPLEVBRFA7S0FERjtBQUFBLElBR0EsTUFBQSxFQUFRLEVBSFI7QUFBQSxJQUlBLE1BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO0FBQUEsTUFDQSxNQUFBLEVBQVEsRUFBRSxDQUFDLElBRFg7QUFBQSxNQUVBLFFBQUEsRUFBVSxFQUFFLENBQUMsSUFGYjtLQUxGO0dBREYsQ0FBQTtBQUFBLEVBVUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBVkEsQ0FBQTtBQVlBLEVBQUEsSUFBRyxDQUFBLFFBQVksQ0FBQyxLQUFLLENBQUMsSUFBbkIsSUFBMkIsQ0FBQSxLQUFTLENBQUMsVUFBVyxDQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBZixDQUFuRDtBQUNFLFVBQVUsSUFBQSxLQUFBLENBQU0sOEJBQUEsR0FBaUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFoRCxHQUF1RCxtQkFBN0QsQ0FBVixDQURGO0dBWkE7QUFBQSxFQWNBLFFBQUEsR0FBVyxLQUFLLENBQUMsVUFBVyxDQUFBLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBZixDQWQ1QixDQUFBO0FBQUEsRUFnQkEsU0FBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLFlBQU8sUUFBUDtBQUFBLFdBQ08sS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUR4QjtBQUVJLFFBQUEsR0FBRyxDQUFDLEtBQUosR0FBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQU4sQ0FBUyxVQUFULENBQVosQ0FGSjtBQUNPO0FBRFAsV0FHTyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBSHhCO0FBSUksUUFBQSxHQUFHLENBQUMsS0FBSixHQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBTixDQUFXLFVBQVgsQ0FBc0IsQ0FBQyxHQUF2QixDQUFBLENBQVosQ0FKSjtBQUdPO0FBSFA7QUFNSSxRQUFBLEdBQUcsQ0FBQyxLQUFKLEdBQVksR0FBRyxDQUFDLEdBQUosQ0FBQSxDQUFaLENBTko7QUFBQSxLQUFBO0FBQUEsSUFPQSxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQWYsR0FBdUIsR0FBRyxDQUFDLEtBUDNCLENBQUE7V0FRQSxHQUFHLENBQUMsTUFUTTtFQUFBLENBaEJaLENBQUE7QUEyQkE7QUFBQTs7OztLQTNCQTtBQUFBLEVBZ0NBLFFBQUEsR0FBVyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBaEMzQixDQUFBO0FBaUNBLEVBQUEsSUFBRyxRQUFBLElBQWEsUUFBQSxLQUFjLEVBQUUsQ0FBQyxJQUFqQztBQUNFLElBQUEsUUFBQSxHQUFXLFNBQUEsR0FBQTtBQUNULFVBQUEsS0FBQTtBQUFBLE1BRFUsK0RBQ1YsQ0FBQTtBQUFBLE1BQUEsU0FBQSxDQUFBLENBQUEsQ0FBQTthQUNBLFFBQUEsYUFBUyxDQUFBLEdBQUcsQ0FBQyxLQUFPLFNBQUEsYUFBQSxLQUFBLENBQUEsQ0FBcEIsRUFGUztJQUFBLENBQVgsQ0FBQTtBQUFBLElBR0EsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFoQixHQUF3QixRQUh4QixDQURGO0dBakNBO0FBdUNBO0FBQUE7Ozs7S0F2Q0E7QUFBQSxFQTRDQSxTQUFBLEdBQVksUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQTVDNUIsQ0FBQTtBQTZDQSxFQUFBLElBQUcsU0FBQSxJQUFjLFNBQUEsS0FBZSxFQUFFLENBQUMsSUFBbkM7QUFDRSxJQUFBLFNBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixVQUFBLEtBQUE7QUFBQSxNQURXLCtEQUNYLENBQUE7QUFBQSxNQUFBLFNBQUEsQ0FBQSxDQUFBLENBQUE7YUFDQSxTQUFBLGFBQVUsQ0FBQSxHQUFHLENBQUMsS0FBTyxTQUFBLGFBQUEsS0FBQSxDQUFBLENBQXJCLEVBRlU7SUFBQSxDQUFaLENBQUE7QUFBQSxJQUdBLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBaEIsR0FBeUIsU0FIekIsQ0FERjtHQTdDQTtBQW1EQTtBQUFBOzs7O0tBbkRBO0FBQUEsRUF3REEsV0FBQSxHQUFjLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUF4RDlCLENBQUE7QUFBQSxFQXlEQSxXQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osUUFBQSxLQUFBO0FBQUEsSUFEYSwrREFDYixDQUFBO0FBQUEsSUFBQSxTQUFBLENBQUEsQ0FBQSxDQUFBO0FBQ0EsSUFBQSxJQUFHLFdBQUEsSUFBZ0IsV0FBQSxLQUFpQixFQUFFLENBQUMsSUFBdkM7YUFDRSxXQUFBLGFBQVksQ0FBQSxHQUFHLENBQUMsS0FBTyxTQUFBLGFBQUEsS0FBQSxDQUFBLENBQXZCLEVBREY7S0FGWTtFQUFBLENBekRkLENBQUE7QUFBQSxFQThEQSxRQUFRLENBQUMsTUFBTSxDQUFDLFFBQWhCLEdBQTJCLFdBOUQzQixDQUFBO0FBQUEsRUFpRUEsR0FBQSxHQUFNLEVBQUUsQ0FBQyxPQUFILENBQVcsUUFBWCxFQUFxQixRQUFyQixFQUErQixLQUEvQixFQUFzQyxpQkFBdEMsQ0FqRU4sQ0FBQTtBQUFBLEVBa0VBLEdBQUcsQ0FBQyxLQUFKLEdBQVksUUFBUSxDQUFDLEtBQUssQ0FBQyxLQWxFM0IsQ0FBQTtTQW1FQSxJQXJFSztBQUFBLENBUFAsQ0FBQTs7QUFBQSxFQThFRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLFFBQWxCLEVBQTRCLElBQTVCLENBOUVBLENBQUE7O0FBQUEsTUErRU0sQ0FBQyxPQUFQLEdBQWlCLElBL0VqQixDQUFBOzs7OztBQ0FBLElBQUEsc0JBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEdBQUssT0FBQSxDQUFRLGdCQUFSLENBREwsQ0FBQTs7QUFBQSxRQUtBLEdBQVcsSUFMWCxDQUFBOztBQUFBLElBT0EsR0FBTyxTQUFDLE9BQUQsRUFBVSxLQUFWLEVBQTBDLGlCQUExQyxHQUFBO0FBRUwsTUFBQSxhQUFBOztJQUZlLFFBQVEsT0FBQSxDQUFRLGFBQVI7R0FFdkI7O0lBRitDLG9CQUFvQjtHQUVuRTtBQUFBLEVBQUEsUUFBQSxHQUNFO0FBQUEsSUFBQSxLQUFBLEVBQU8sRUFBUDtBQUFBLElBQ0EsTUFBQSxFQUFRLEVBRFI7QUFBQSxJQUVBLE1BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO0tBSEY7R0FERixDQUFBO0FBQUEsRUFNQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FOQSxDQUFBO0FBQUEsRUFPQSxHQUFBLEdBQU0sRUFBRSxDQUFDLE9BQUgsQ0FBVyxRQUFYLEVBQXFCLFFBQXJCLEVBQStCLEtBQS9CLEVBQXNDLGlCQUF0QyxDQVBOLENBQUE7U0FZQSxJQWRLO0FBQUEsQ0FQUCxDQUFBOztBQUFBLEVBdUJFLENBQUMsS0FBSyxDQUFDLFFBQVQsQ0FBa0IsUUFBbEIsRUFBNEIsSUFBNUIsQ0F2QkEsQ0FBQTs7QUFBQSxNQXdCTSxDQUFDLE9BQVAsR0FBaUIsSUF4QmpCLENBQUE7Ozs7O0FDQUEsSUFBQSxzQkFBQTtFQUFBLGtCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxHQUFLLE9BQUEsQ0FBUSxnQkFBUixDQURMLENBQUE7O0FBQUEsUUFLQSxHQUFXLFFBTFgsQ0FBQTs7QUFBQSxJQU9BLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBRUwsTUFBQSx3R0FBQTs7SUFGZSxRQUFRLE9BQUEsQ0FBUSxhQUFSLEVBQXVCLGlCQUFBLEdBQW9CLEtBQTNDO0dBRXZCO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEVBQVY7QUFBQSxNQUNBLFFBQUEsRUFBVSxLQURWO0tBREY7QUFBQSxJQUdBLE1BQUEsRUFBUSxFQUhSO0FBQUEsSUFJQSxNQUFBLEVBQVEsRUFKUjtBQUFBLElBS0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7QUFBQSxNQUNBLE1BQUEsRUFBUSxFQUFFLENBQUMsSUFEWDtLQU5GO0dBREYsQ0FBQTtBQUFBLEVBVUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBVkEsQ0FBQTtBQUFBLEVBWUEsS0FBQSxHQUFRLEVBWlIsQ0FBQTtBQUFBLEVBYUEsTUFBQSxHQUFTLEVBYlQsQ0FBQTtBQUFBLEVBY0EsUUFBQSxHQUFXLEtBZFgsQ0FBQTtBQUFBLEVBZ0JBLFNBQUEsR0FBWSxTQUFBLEdBQUE7V0FDVixLQUFBLEdBQVEsR0FBRyxDQUFDLEdBQUosQ0FBQSxFQURFO0VBQUEsQ0FoQlosQ0FBQTtBQW9CQSxFQUFBLElBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFoQixLQUEyQixFQUFFLENBQUMsSUFBakM7QUFDRSxJQUFBLEtBQUEsR0FBUSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQXhCLENBQUE7QUFBQSxJQUNBLFFBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxVQUFBLGFBQUE7QUFBQSxNQURVLCtEQUNWLENBQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxLQUFBLGFBQU0sS0FBTixDQUFULENBQUE7QUFBQSxNQUNBLFNBQUEsQ0FBQSxDQURBLENBQUE7YUFFQSxPQUhTO0lBQUEsQ0FEWCxDQUFBO0FBQUEsSUFLQSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQWhCLEdBQXdCLFFBTHhCLENBREY7R0FwQkE7QUE2QkEsRUFBQSxJQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBaEIsS0FBNEIsRUFBRSxDQUFDLElBQWxDO0FBQ0UsSUFBQSxNQUFBLEdBQVMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUF6QixDQUFBO0FBQUEsSUFDQSxTQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsVUFBQSxhQUFBO0FBQUEsTUFEVywrREFDWCxDQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsTUFBQSxhQUFPLEtBQVAsQ0FBVCxDQUFBO0FBQUEsTUFDQSxTQUFBLENBQUEsQ0FEQSxDQUFBO2FBRUEsT0FIVTtJQUFBLENBRFosQ0FBQTtBQUFBLElBS0EsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFoQixHQUF5QixTQUx6QixDQURGO0dBN0JBO0FBQUEsRUFxQ0EsR0FBQSxHQUFNLEVBQUUsQ0FBQyxPQUFILENBQVcsUUFBWCxFQUFxQixRQUFyQixFQUErQixLQUEvQixFQUFzQyxpQkFBdEMsQ0FyQ04sQ0FBQTtBQUFBLEVBdUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsY0FBUixFQUF3QixTQUFDLFFBQUQsR0FBQTtBQUN0QixRQUFBLE9BQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSxFQUFOLENBQUE7QUFDQSxJQUFBLElBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFOLENBQVcsaUJBQVgsQ0FBQSxJQUFrQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQU4sQ0FBVyxpQkFBWCxDQUE4QixDQUFBLENBQUEsQ0FBbkU7QUFDRSxNQUFBLE9BQUEsR0FBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQU4sQ0FBVyxpQkFBWCxDQUE4QixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQTNDLENBQUE7QUFDQSxNQUFBLElBQTRCLE9BQTVCO0FBQUEsUUFBQSxHQUFBLEdBQU0sT0FBUSxDQUFBLFFBQUEsQ0FBZCxDQUFBO09BRkY7S0FEQTtXQUlBLElBTHNCO0VBQUEsQ0FBeEIsQ0F2Q0EsQ0FBQTtBQUFBLEVBOENBLEdBQUcsQ0FBQyxHQUFKLENBQVEsY0FBUixFQUF3QixTQUFBLEdBQUE7V0FDdEIsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFOLENBQVcsaUJBQVgsQ0FBNkIsQ0FBQyxJQUE5QixDQUFBLEVBRHNCO0VBQUEsQ0FBeEIsQ0E5Q0EsQ0FBQTtBQUFBLEVBaURBLEdBQUcsQ0FBQyxHQUFKLENBQVEsYUFBUixFQUF1QixTQUFBLEdBQUE7QUFDckIsSUFBQSxLQUFBLEdBQVEsR0FBRyxDQUFDLEdBQUosQ0FBQSxDQUFSLENBQUE7V0FDQSxNQUZxQjtFQUFBLENBQXZCLENBakRBLENBQUE7QUFBQSxFQXFEQSxHQUFHLENBQUMsR0FBSixDQUFRLFdBQVIsRUFBcUIsU0FBQyxLQUFELEVBQVEsSUFBUixFQUFzQixRQUF0QixFQUF3QyxRQUF4QyxHQUFBO0FBQ25CLFFBQUEseUJBQUE7O01BRDJCLE9BQU87S0FDbEM7O01BRHlDLFdBQVc7S0FDcEQ7O01BRDJELFdBQVc7S0FDdEU7QUFBQSxJQUFBLE9BQUEsR0FBVSxDQUFDLENBQUMsT0FBRixDQUFVLEtBQVYsQ0FBVixDQUFBO0FBQUEsSUFDQSxHQUFBLEdBQU0sS0FETixDQUFBO0FBRUEsSUFBQSxJQUFHLE9BQUEsSUFBWSxLQUFBLEtBQVMsUUFBeEI7QUFDRSxNQUFBLFFBQUEsR0FBVyxJQUFYLENBQUE7QUFBQSxNQUNBLEdBQUEsR0FBTSxJQUROLENBREY7S0FGQTtBQUtBLElBQUEsSUFBRyxLQUFBLEtBQVMsR0FBVCxJQUFpQixLQUFBLEtBQVMsT0FBN0I7QUFBMEMsTUFBQSxHQUFBLEdBQU0sSUFBTixDQUExQztLQUxBO0FBTUEsSUFBQSxJQUFHLEdBQUg7QUFDRSxNQUFBLEdBQUEsR0FDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxRQUNBLEtBQUEsRUFDRTtBQUFBLFVBQUEsS0FBQSxFQUFPLEtBQVA7U0FGRjtPQURGLENBQUE7QUFJQSxNQUFBLElBQUcsUUFBSDtBQUNFLFFBQUEsR0FBRyxDQUFDLFFBQUosR0FBZSxRQUFmLENBREY7T0FKQTtBQU1BLE1BQUEsSUFBRyxRQUFIO0FBQ0UsUUFBQSxHQUFHLENBQUMsUUFBSixHQUFlLFFBQWYsQ0FERjtPQU5BO0FBQUEsTUFRQSxNQUFBLEdBQVMsR0FBRyxDQUFDLElBQUosQ0FBUyxRQUFULEVBQW1CLEdBQW5CLENBUlQsQ0FBQTthQVNBLE9BVkY7S0FQbUI7RUFBQSxDQUFyQixDQXJEQSxDQUFBO0FBQUEsRUF3RUEsR0FBRyxDQUFDLEdBQUosQ0FBUSxZQUFSLEVBQXNCLFNBQUMsT0FBRCxHQUFBO0FBQ3BCLElBQUEsTUFBQSxHQUFTLENBQUMsQ0FBQyxLQUFGLENBQVEsTUFBUixFQUFnQixPQUFoQixDQUFULENBQUE7QUFBQSxJQUNBLEVBQUUsQ0FBQyxJQUFILENBQVEsT0FBUixFQUFpQixDQUFDLFNBQUMsR0FBRCxHQUFBO0FBQ2hCLE1BQUEsS0FBQSxHQUFRLEdBQUcsQ0FBQyxTQUFKLENBQWMsR0FBZCxDQUFSLENBQUE7YUFDQSxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQVosRUFGZ0I7SUFBQSxDQUFELENBQWpCLEVBR0csS0FISCxDQURBLENBQUE7V0FLQSxPQU5vQjtFQUFBLENBQXRCLENBeEVBLENBQUE7QUFBQSxFQWdGQSxHQUFHLENBQUMsR0FBSixDQUFRLGNBQVIsRUFBd0IsU0FBQyxNQUFELEdBQUE7QUFDdEIsSUFBQSxHQUFHLENBQUMsS0FBSixDQUFBLENBQUEsQ0FBQTtBQUFBLElBQ0EsTUFBQSxHQUFTLE1BRFQsQ0FBQTtBQUFBLElBRUEsR0FBRyxDQUFDLFVBQUosQ0FBZSxNQUFmLENBRkEsQ0FBQTtXQUdBLElBSnNCO0VBQUEsQ0FBeEIsQ0FoRkEsQ0FBQTtBQUFBLEVBc0ZBLEdBQUcsQ0FBQyxHQUFKLENBQVEsY0FBUixFQUF3QixTQUFDLGFBQUQsR0FBQTtBQUN0QixRQUFBLGdCQUFBO0FBQUEsSUFBQSxNQUFNLENBQUMsTUFBUCxDQUFjLE1BQU0sQ0FBQyxPQUFQLENBQWUsYUFBZixDQUFkLEVBQTZDLENBQTdDLENBQUEsQ0FBQTtBQUFBLElBQ0EsYUFBQSxHQUFnQixHQUFJLENBQUEsQ0FBQSxDQURwQixDQUFBO0FBQUEsSUFFQSxDQUFBLEdBQUksQ0FGSixDQUFBO0FBSUEsV0FBTSxDQUFBLEdBQUksYUFBYSxDQUFDLE1BQXhCLEdBQUE7QUFDRSxNQUFBLElBQTJCLGFBQWEsQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBekIsS0FBa0MsYUFBN0Q7QUFBQSxRQUFBLGFBQWEsQ0FBQyxNQUFkLENBQXFCLENBQXJCLENBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxDQUFBLEVBREEsQ0FERjtJQUFBLENBSkE7V0FPQSxLQVJzQjtFQUFBLENBQXhCLENBdEZBLENBQUE7QUFrR0EsRUFBQSxJQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBaEIsR0FBeUIsQ0FBNUI7QUFDRSxJQUFBLEdBQUcsQ0FBQyxVQUFKLENBQWUsUUFBUSxDQUFDLE1BQXhCLENBQUEsQ0FERjtHQWxHQTtTQXVHQSxJQXpHSztBQUFBLENBUFAsQ0FBQTs7QUFBQSxFQWtIRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLFFBQWxCLEVBQTRCLElBQTVCLENBbEhBLENBQUE7O0FBQUEsTUFtSE0sQ0FBQyxPQUFQLEdBQWlCLElBbkhqQixDQUFBOzs7OztBQ0FBLElBQUEscUNBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxFQUNBLEdBQUssT0FBQSxDQUFRLGdCQUFSLENBREwsQ0FBQTs7QUFBQSxDQUVBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FGSixDQUFBOztBQUFBLE9BR0EsR0FBVSxPQUFBLENBQVEsa0JBQVIsQ0FIVixDQUFBOztBQUFBLENBSUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUpKLENBQUE7O0FBQUEsUUFRQSxHQUFXLE9BUlgsQ0FBQTs7QUFVQTtBQUFBOztHQVZBOztBQUFBLElBYUEsR0FBTyxTQUFDLE9BQUQsRUFBVSxLQUFWLEVBQTBDLGlCQUExQyxHQUFBO0FBR0wsTUFBQSw2RkFBQTs7SUFIZSxRQUFRLE9BQUEsQ0FBUSxhQUFSO0dBR3ZCOztJQUgrQyxvQkFBb0I7R0FHbkU7QUFBQSxFQUFBLFFBQUEsR0FHRTtBQUFBLElBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxJQUdBLEtBQUEsRUFDRTtBQUFBLE1BQUEsV0FBQSxFQUFhLENBQWI7QUFBQSxNQUNBLFdBQUEsRUFBYSxDQURiO0FBQUEsTUFFQSxLQUFBLEVBQU8sRUFGUDtBQUFBLE1BR0EsS0FBQSxFQUFPLEVBSFA7QUFBQSxNQUlBLFNBQUEsRUFBVyxNQUpYO0FBQUEsTUFLQSxVQUFBLEVBQVksS0FMWjtBQUFBLE1BTUEsT0FBQSxFQUFPLEVBTlA7S0FKRjtBQUFBLElBV0EsTUFBQSxFQUFRLEVBWFI7QUFBQSxJQVlBLE1BQUEsRUFBUSxFQVpSO0FBQUEsSUFlQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLE9BQUEsRUFBTyxFQUFQO0FBQUEsTUFDQSxLQUFBLEVBQU8sRUFEUDtBQUFBLE1BRUEsZ0JBQUEsRUFBa0IsRUFGbEI7QUFBQSxNQUdBLFdBQUEsRUFBYSxFQUhiO0FBQUEsTUFJQSxNQUFBLEVBQVEsRUFKUjtLQWhCRjtBQUFBLElBdUJBLEtBQUEsRUFBTyxFQXZCUDtBQUFBLElBMEJBLEtBQUEsRUFBTyxFQTFCUDtBQUFBLElBNEJBLGVBQUEsRUFBaUIsS0E1QmpCO0FBQUEsSUE2QkEsYUFBQSxFQUFlLEtBN0JmO0dBSEYsQ0FBQTtBQUFBLEVBa0NBLElBQUEsR0FBTyxFQWxDUCxDQUFBO0FBQUEsRUFtQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBQSxDQW5DUixDQUFBO0FBQUEsRUFvQ0EsV0FBQSxHQUFjLENBcENkLENBQUE7QUFBQSxFQXNDQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0F0Q0EsQ0FBQTtBQUFBLEVBdUNBLEdBQUEsR0FBTSxFQUFFLENBQUMsT0FBSCxDQUFXLFFBQVgsRUFBcUIsUUFBckIsRUFBK0IsS0FBL0IsRUFBc0MsaUJBQXRDLENBdkNOLENBQUE7QUFBQSxFQTBDQSxLQUFBLEdBQVEsSUExQ1IsQ0FBQTtBQUFBLEVBMkNBLEtBQUEsR0FBUSxJQTNDUixDQUFBO0FBQUEsRUE0Q0EsUUFBQSxHQUFXLElBNUNYLENBQUE7QUFBQSxFQWdEQSxJQUFBLEdBQU8sQ0FBQyxDQUFDLElBQUYsQ0FBTyxTQUFBLEdBQUE7QUFDWixRQUFBLDBCQUFBO0FBQUEsSUFBQSxJQUFHLFFBQVEsQ0FBQyxJQUFaO0FBQ0UsTUFBQSxNQUFBLEdBQVMsa0JBQUEsQ0FBbUIsUUFBUSxDQUFDLElBQTVCLENBQVQsQ0FERjtLQUFBO0FBRUEsSUFBQSxJQUFHLE1BQUg7QUFDRSxNQUFBLElBQUEsR0FBTyxDQUFBLENBQUUsTUFBRixDQUFQLENBQUE7QUFBQSxNQUVBLEtBQUEsR0FBUSxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsQ0FGUixDQUFBO0FBQUEsTUFHQSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU4sQ0FBYSxLQUFiLENBSEEsQ0FBQTtBQUFBLE1BSUEsS0FBQSxHQUFRLEVBQUUsQ0FBQyxjQUFILENBQWtCLEtBQU0sQ0FBQSxDQUFBLENBQXhCLENBSlIsQ0FBQTtBQUFBLE1BS0EsUUFBQSxHQUFXLEVBQUUsQ0FBQyxjQUFILENBQWtCLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFoQyxDQUxYLENBQUE7QUFBQSxNQU9BLEtBQUEsR0FBUSxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsQ0FQUixDQUFBO0FBQUEsTUFRQSxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU4sQ0FBYSxLQUFiLENBUkEsQ0FBQTtBQUFBLE1BU0EsS0FBQSxHQUFRLEVBQUUsQ0FBQyxjQUFILENBQWtCLEtBQU0sQ0FBQSxDQUFBLENBQXhCLENBVFIsQ0FBQTtBQUFBLE1BV0EsU0FBQSxDQUFBLENBWEEsQ0FERjtLQUFBLE1BQUE7QUFjRSxNQUFBLEtBQUEsR0FBUSxHQUFHLENBQUMsSUFBSixDQUFTLE9BQVQsRUFBa0IsUUFBUSxDQUFDLEtBQTNCLENBQVIsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBWCxDQURYLENBQUE7QUFBQSxNQUVBLEtBQUEsR0FBUSxHQUFHLENBQUMsSUFBSixDQUFTLE9BQVQsRUFBa0IsUUFBUSxDQUFDLEtBQTNCLENBRlIsQ0FBQTtBQUFBLE1BR0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxLQUFLLENBQUMsSUFBTixDQUFXLElBQVgsQ0FBVixDQUhBLENBZEY7S0FGQTtXQW9CQSxJQXJCWTtFQUFBLENBQVAsQ0FoRFAsQ0FBQTtBQUFBLEVBeUVBLFNBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixRQUFBLCtCQUFBO0FBQUEsSUFBQSxDQUFBLEdBQUksQ0FBSixDQUFBO0FBQ0E7V0FBTSxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBSSxDQUFDLE1BQWQsR0FBdUIsQ0FBN0IsR0FBQTtBQUNFLE1BQUEsQ0FBQSxHQUFJLENBQUosQ0FBQTtBQUFBLE1BQ0EsTUFBQSxHQUFTLEVBQUUsQ0FBQyxjQUFILENBQWtCLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFoQyxDQURULENBQUE7QUFBQSxNQUVBLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBVixDQUZBLENBQUE7QUFHQSxhQUFNLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBSyxDQUFDLE1BQXZCLEdBQWdDLENBQXRDLEdBQUE7QUFDRSxRQUFBLE9BQUEsR0FBVSxLQUFLLENBQUMsR0FBTixDQUFVLENBQUEsR0FBRSxDQUFaLEVBQWUsQ0FBQSxHQUFFLENBQWpCLENBQVYsQ0FBQTtBQUNBLFFBQUEsSUFBRyxDQUFBLE9BQUg7QUFDRSxVQUFBLE9BQUEsR0FBVSxFQUFFLENBQUMsY0FBSCxDQUFrQixLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQU0sQ0FBQSxDQUFBLENBQXpDLENBQVYsQ0FBQTtBQUFBLFVBQ0EsS0FBSyxDQUFDLEdBQU4sQ0FBVSxDQUFBLEdBQUUsQ0FBWixFQUFlLENBQUEsR0FBRSxDQUFqQixFQUFvQixPQUFwQixDQURBLENBREY7U0FEQTtBQUFBLFFBSUEsQ0FBQSxJQUFLLENBSkwsQ0FERjtNQUFBLENBSEE7QUFBQSxvQkFTQSxDQUFBLElBQUssRUFUTCxDQURGO0lBQUEsQ0FBQTtvQkFGVTtFQUFBLENBekVaLENBQUE7QUFBQSxFQXlGQSxXQUFBLEdBQWMsU0FBQSxHQUFBO1dBQ1osS0FBSyxDQUFDLElBQU4sQ0FBVyxTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsR0FBZixHQUFBO0FBQ1QsVUFBQSxHQUFBO0FBQUEsTUFBQSxJQUFHLENBQUEsR0FBSDtBQUNFLFFBQUEsR0FBQSxHQUFNLEdBQUcsQ0FBQyxHQUFKLENBQVEsS0FBUixDQUFOLENBQUE7ZUFDQSxHQUFHLENBQUMsSUFBSixDQUFTLEtBQVQsRUFBZ0IsRUFBaEIsRUFGRjtPQURTO0lBQUEsQ0FBWCxFQURZO0VBQUEsQ0F6RmQsQ0FBQTtBQUFBLEVBaUdBLEdBQUcsQ0FBQyxHQUFKLENBQVEsUUFBUixFQUFrQixTQUFDLEtBQUQsRUFBUSxPQUFSLEdBQUE7QUFDaEIsUUFBQSxlQUFBO0FBQUEsSUFBQSxHQUFHLENBQUMsSUFBSixDQUFBLENBQUEsQ0FBQTtBQUFBLElBQ0EsV0FBQSxJQUFlLENBRGYsQ0FBQTtBQUFBLElBRUEsRUFBQSxHQUFLLElBRkwsQ0FBQTtBQUFBLElBR0EsQ0FBQSxHQUFJLENBSEosQ0FBQTtBQUlBLFdBQU0sS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFLLENBQUMsTUFBdkIsR0FBZ0MsS0FBdEMsR0FBQTtBQUNFLE1BQUEsUUFBQSxHQUFXLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBbEMsQ0FBQTtBQUNBLE1BQUEsSUFBRyxDQUFBLFFBQUg7QUFDRSxRQUFBLEVBQUEsR0FBSyxRQUFRLENBQUMsSUFBVCxDQUFjLElBQWQsRUFBb0IsRUFBcEIsQ0FBTCxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsRUFBQSxHQUFLLEVBQUUsQ0FBQyxjQUFILENBQWtCLFFBQWxCLEVBQTRCLElBQTVCLENBQUwsQ0FIRjtPQURBO0FBQUEsTUFLQSxDQUFBLElBQUssQ0FMTCxDQURGO0lBQUEsQ0FKQTtBQVdBLElBQUEsSUFBRyxDQUFBLEVBQUg7QUFDRSxNQUFBLFFBQUEsR0FBVyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBSyxDQUFBLENBQUEsQ0FBRSxDQUFDLEtBQU0sQ0FBQSxLQUFBLEdBQU0sQ0FBTixDQUFsQyxDQUFBO0FBQUEsTUFDQSxFQUFBLEdBQUssRUFBRSxDQUFDLGNBQUgsQ0FBa0IsUUFBbEIsRUFBNEIsSUFBNUIsQ0FETCxDQURGO0tBWEE7QUFBQSxJQWNBLEVBQUUsQ0FBQyxJQUFILENBQVEsT0FBUixDQWRBLENBQUE7V0FlQSxHQWhCZ0I7RUFBQSxDQUFsQixDQWpHQSxDQUFBO0FBQUEsRUFxSEEsR0FBRyxDQUFDLEdBQUosQ0FBUSxLQUFSLEVBQWUsU0FBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQ2IsUUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sSUFBSyxDQUFBLEtBQUEsR0FBTSxDQUFOLENBQVgsQ0FBQTtBQUVBLElBQUEsSUFBRyxDQUFBLEdBQUg7QUFDRSxhQUFNLElBQUksQ0FBQyxNQUFMLEdBQWMsS0FBcEIsR0FBQTtBQUNFLFFBQUEsR0FBQSxHQUFNLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBWCxFQUFpQixFQUFqQixDQUFOLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixDQURBLENBREY7TUFBQSxDQURGO0tBRkE7QUFPQSxJQUFBLElBQUcsQ0FBQSxHQUFPLENBQUMsSUFBWDtBQUNFLE1BQUEsR0FBRyxDQUFDLEdBQUosQ0FBUSxNQUFSLEVBQWdCLFNBQUMsS0FBRCxFQUFRLElBQVIsR0FBQTtBQUNkLFlBQUEsSUFBQTtBQUFBLFFBQUEsSUFBQSxHQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBVCxDQUFZLElBQVosRUFBa0IsR0FBbEIsQ0FBUCxDQUFBO0FBQUEsUUFDQSxLQUFLLENBQUMsR0FBTixDQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBd0IsSUFBeEIsQ0FEQSxDQUFBO2VBRUEsS0FIYztNQUFBLENBQWhCLENBQUEsQ0FERjtLQVBBO1dBYUEsSUFkYTtFQUFBLENBQWYsQ0FySEEsQ0FBQTtBQUFBLEVBdUlBLEdBQUcsQ0FBQyxHQUFKLENBQVEsTUFBUixFQUFnQixTQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsSUFBZixHQUFBO0FBQ2QsUUFBQSw2QkFBQTtBQUFBLElBQUEsSUFBRyxLQUFBLEdBQVEsQ0FBWDtBQUFrQixNQUFBLEtBQUEsR0FBUSxDQUFSLENBQWxCO0tBQUE7QUFDQSxJQUFBLElBQUcsS0FBQSxHQUFRLENBQVg7QUFBa0IsTUFBQSxLQUFBLEdBQVEsQ0FBUixDQUFsQjtLQURBO0FBRUEsSUFBQSxJQUFHLFdBQUEsR0FBYyxDQUFkLElBQW9CLEtBQUEsR0FBTSxDQUFOLEdBQVUsV0FBakM7QUFBa0QsWUFBVSxJQUFBLEtBQUEsQ0FBTSx3REFBQSxHQUEyRCxLQUEzRCxHQUFtRSxHQUFuRSxHQUF5RSxLQUF6RSxHQUFpRixJQUF2RixDQUFWLENBQWxEO0tBRkE7QUFBQSxJQUlBLEdBQUEsR0FBTSxHQUFHLENBQUMsR0FBSixDQUFRLEtBQVIsQ0FKTixDQUFBO0FBQUEsSUFNQSxJQUFBLEdBQU8sS0FBSyxDQUFDLEdBQU4sQ0FBVSxLQUFWLEVBQWlCLEtBQWpCLENBTlAsQ0FBQTtBQVFBLElBQUEsSUFBRyxDQUFBLElBQUg7QUFDRSxNQUFBLENBQUEsR0FBSSxDQUFKLENBQUE7QUFDQSxhQUFNLENBQUEsR0FBSSxLQUFWLEdBQUE7QUFDRSxRQUFBLENBQUEsSUFBSyxDQUFMLENBQUE7QUFDQSxRQUFBLElBQUcsQ0FBQSxLQUFLLEtBQVI7QUFDRSxVQUFBLE1BQUEsR0FBUyxFQUFFLENBQUMsTUFBSCxDQUFVO0FBQUEsWUFBQyxLQUFBLEVBQU8sUUFBUSxDQUFDLEtBQWpCO1dBQVYsRUFBbUMsSUFBbkMsQ0FBVCxDQUFBO0FBQUEsVUFDQSxJQUFBLEdBQU8sR0FBRyxDQUFDLElBQUosQ0FBUyxLQUFULEVBQWdCLE1BQWhCLENBRFAsQ0FERjtTQUFBLE1BQUE7QUFJRSxVQUFBLE9BQUEsR0FBVSxLQUFLLENBQUMsR0FBTixDQUFVLEtBQVYsRUFBaUIsQ0FBakIsQ0FBVixDQUFBO0FBQ0EsVUFBQSxJQUFHLENBQUEsT0FBSDtBQUNFLFlBQUEsT0FBQSxHQUFXLEdBQUcsQ0FBQyxJQUFKLENBQVMsQ0FBVCxFQUFZO0FBQUEsY0FBQSxLQUFBLEVBQU8sUUFBUSxDQUFDLEtBQWhCO2FBQVosQ0FBWCxDQURGO1dBTEY7U0FGRjtNQUFBLENBRkY7S0FSQTtXQW9CQSxLQXJCYztFQUFBLENBQWhCLENBdklBLENBQUE7QUFBQSxFQWtLQSxHQUFHLENBQUMsR0FBSixDQUFRLFVBQVIsRUFBb0IsU0FBQSxHQUFBO0FBQ2xCLElBQUEsSUFBQSxDQUFBLENBQUEsQ0FBQTtBQUFBLElBSUEsR0FBRyxDQUFDLEdBQUosQ0FBUSxPQUFSLEVBQWlCLEtBQWpCLENBSkEsQ0FBQTtBQUFBLElBUUEsR0FBRyxDQUFDLEdBQUosQ0FBUSxPQUFSLEVBQWlCLEtBQWpCLENBUkEsQ0FBQTtXQVVBLElBWGtCO0VBQUEsQ0FBcEIsQ0FsS0EsQ0FBQTtTQStLQSxJQWxMSztBQUFBLENBYlAsQ0FBQTs7QUFBQSxFQWlNRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLFFBQWxCLEVBQTRCLElBQTVCLENBak1BLENBQUE7O0FBQUEsTUFrTU0sQ0FBQyxPQUFQLEdBQWlCLElBbE1qQixDQUFBOzs7Ozs7O0FDQUEsSUFBQSw2QkFBQTtFQUFBLGtCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxHQUFLLE9BQUEsQ0FBUSxnQkFBUixDQURMLENBQUE7O0FBQUEsS0FFQSxHQUFRLE9BQUEsQ0FBUSxnQkFBUixDQUZSLENBQUE7O0FBQUEsUUFJQSxHQUFXLFVBSlgsQ0FBQTs7QUFBQSxJQU1BLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixFQUEwQyxpQkFBMUMsR0FBQTtBQUVMLE1BQUEsbUVBQUE7O0lBRmUsUUFBUSxPQUFBLENBQVEsYUFBUjtHQUV2Qjs7SUFGK0Msb0JBQW9CO0dBRW5FO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLEVBQU47QUFBQSxNQUNBLFdBQUEsRUFBYSxFQURiO0FBQUEsTUFFQSxLQUFBLEVBQU8sRUFGUDtBQUFBLE1BR0EsSUFBQSxFQUFNLEVBSE47QUFBQSxNQUlBLFNBQUEsRUFBVyxFQUpYO0FBQUEsTUFLQSxTQUFBLEVBQVcsS0FMWDtBQUFBLE1BTUEsVUFBQSxFQUFZLEtBTlo7QUFBQSxNQU9BLElBQUEsRUFBTSxDQVBOO0FBQUEsTUFRQSxJQUFBLEVBQU0sRUFSTjtBQUFBLE1BU0EsUUFBQSxFQUFVLEtBVFY7QUFBQSxNQVVBLFFBQUEsRUFBVSxLQVZWO0FBQUEsTUFXQSxJQUFBLEVBQU0sRUFYTjtBQUFBLE1BWUEsSUFBQSxFQUFNLEVBWk47S0FERjtBQUFBLElBY0EsTUFBQSxFQUFRLEVBZFI7QUFBQSxJQWVBLE1BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO0tBaEJGO0dBREYsQ0FBQTtBQUFBLEVBbUJBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQW5CQSxDQUFBO0FBQUEsRUFxQkEsS0FBQSxHQUFRLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FyQnZCLENBQUE7QUFBQSxFQXVCQSxTQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsWUFBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQXRCO0FBQUEsV0FDTyxLQUFLLENBQUMsVUFBVSxDQUFDLFFBRHhCO2VBRUksS0FBQSxHQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBTixDQUFTLFVBQVQsRUFGWjtBQUFBLFdBR08sS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUh4QjtlQUlJLEtBQUEsR0FBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQU4sQ0FBVyxVQUFYLENBQXNCLENBQUMsR0FBdkIsQ0FBQSxFQUpaO0FBQUE7ZUFNSSxLQUFBLEdBQVEsR0FBRyxDQUFDLEdBQUosQ0FBQSxFQU5aO0FBQUEsS0FEVTtFQUFBLENBdkJaLENBQUE7QUFpQ0EsRUFBQSxJQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBaEIsS0FBMkIsRUFBRSxDQUFDLElBQWpDO0FBQ0UsSUFBQSxLQUFBLEdBQVEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUF4QixDQUFBO0FBQUEsSUFDQSxRQUFBLEdBQVcsU0FBQSxHQUFBO0FBQ1QsVUFBQSxhQUFBO0FBQUEsTUFEVSwrREFDVixDQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsS0FBQSxhQUFNLEtBQU4sQ0FBVCxDQUFBO0FBQUEsTUFDQSxTQUFBLENBQUEsQ0FEQSxDQUFBO2FBRUEsT0FIUztJQUFBLENBRFgsQ0FBQTtBQUFBLElBS0EsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFoQixHQUF3QixRQUx4QixDQURGO0dBakNBO0FBMENBLEVBQUEsSUFBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQWhCLEtBQTRCLEVBQUUsQ0FBQyxJQUFsQztBQUNFLElBQUEsTUFBQSxHQUFTLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBekIsQ0FBQTtBQUFBLElBQ0EsU0FBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsYUFBQTtBQUFBLE1BRFcsK0RBQ1gsQ0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLE1BQUEsYUFBTyxLQUFQLENBQVQsQ0FBQTtBQUFBLE1BQ0EsU0FBQSxDQUFBLENBREEsQ0FBQTthQUVBLE9BSFU7SUFBQSxDQURaLENBQUE7QUFBQSxJQUtBLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBaEIsR0FBeUIsU0FMekIsQ0FERjtHQTFDQTtBQUFBLEVBa0RBLEdBQUEsR0FBTSxFQUFFLENBQUMsT0FBSCxDQUFXLFFBQVgsRUFBcUIsUUFBckIsRUFBK0IsS0FBL0IsRUFBc0MsaUJBQXRDLENBbEROLENBQUE7U0F1REEsSUF6REs7QUFBQSxDQU5QLENBQUE7O0FBQUEsRUFpRUUsQ0FBQyxLQUFLLENBQUMsUUFBVCxDQUFrQixRQUFsQixFQUE0QixJQUE1QixDQWpFQSxDQUFBOztBQUFBLE1Ba0VNLENBQUMsT0FBUCxHQUFpQixJQWxFakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLHNCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxHQUFLLE9BQUEsQ0FBUSxnQkFBUixDQURMLENBQUE7O0FBQUEsUUFHQSxHQUFXLE9BSFgsQ0FBQTs7QUFBQSxJQUtBLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixFQUEwQyxpQkFBMUMsR0FBQTtBQUVMLE1BQUEsMEJBQUE7O0lBRmUsUUFBUSxPQUFBLENBQVEsYUFBUjtHQUV2Qjs7SUFGK0Msb0JBQW9CO0dBRW5FO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFBTyxFQUFQO0FBQUEsSUFDQSxNQUFBLEVBQVEsRUFEUjtBQUFBLElBRUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7S0FIRjtBQUFBLElBSUEsTUFBQSxFQUFRLENBSlI7R0FERixDQUFBO0FBQUEsRUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsRUFTQSxHQUFBLEdBQU0sRUFBRSxDQUFDLE9BQUgsQ0FBVyxRQUFYLEVBQXFCLFFBQXJCLEVBQStCLEtBQS9CLEVBQXNDLGlCQUF0QyxDQVROLENBQUE7QUFBQSxFQWFBLElBQUEsR0FBTyxFQWJQLENBQUE7QUFBQSxFQWNBLEtBQUEsR0FBUSxFQWRSLENBQUE7QUFBQSxFQWVBLEdBQUcsQ0FBQyxHQUFKLENBQVEsTUFBUixFQUFnQixTQUFDLEtBQUQsRUFBUSxLQUFSLEdBQUE7QUFDZCxRQUFBLGtCQUFBO0FBQUEsSUFBQSxJQUFBLENBQUEsQ0FBQSxDQUFBO0FBRUEsSUFBQSxJQUFHLEtBQUEsR0FBUSxDQUFYO0FBQWtCLE1BQUEsS0FBQSxHQUFRLENBQVIsQ0FBbEI7S0FGQTtBQUdBLElBQUEsSUFBRyxLQUFBLEdBQVEsQ0FBWDtBQUFrQixNQUFBLEtBQUEsR0FBUSxDQUFSLENBQWxCO0tBSEE7QUFBQSxJQUtBLEdBQUEsR0FBTSxJQUFLLENBQUEsS0FBQSxHQUFNLENBQU4sQ0FMWCxDQUFBO0FBT0EsSUFBQSxJQUFHLENBQUEsR0FBSDtBQUNFLGFBQU0sSUFBSSxDQUFDLE1BQUwsR0FBYyxLQUFwQixHQUFBO0FBQ0UsUUFBQSxHQUFBLEdBQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFULENBQVksRUFBWixFQUFnQixLQUFoQixFQUF1QixLQUF2QixDQUFOLENBQUE7QUFBQSxRQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixDQURBLENBREY7TUFBQSxDQURGO0tBUEE7QUFBQSxJQVlBLEVBQUEsR0FBSyxHQUFJLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBTSxDQUFBLEtBQUEsQ0FabEIsQ0FBQTtBQWNBLElBQUEsSUFBRyxFQUFIO0FBQVcsTUFBQSxJQUFBLEdBQU8sRUFBRSxDQUFDLGNBQUgsQ0FBa0IsRUFBbEIsRUFBc0IsSUFBdEIsQ0FBUCxDQUFYO0tBZEE7QUFlQSxJQUFBLElBQUcsQ0FBQSxFQUFIO0FBQ0UsYUFBTSxHQUFJLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBSyxDQUFDLE1BQWIsR0FBc0IsS0FBNUIsR0FBQTtBQUNFLFFBQUEsR0FBQSxHQUFNLEdBQUksQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFLLENBQUMsTUFBbkIsQ0FBQTtBQUFBLFFBQ0EsRUFBQSxHQUFLLEdBQUksQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFNLENBQUEsR0FBQSxHQUFJLENBQUosQ0FEbEIsQ0FBQTtBQUVBLFFBQUEsSUFBRyxFQUFBLElBQU8sR0FBQSxLQUFPLEtBQWpCO0FBQ0UsVUFBQSxJQUFBLEdBQU8sRUFBRSxDQUFDLGNBQUgsQ0FBa0IsRUFBbEIsRUFBc0IsSUFBdEIsQ0FBUCxDQURGO1NBQUEsTUFBQTtBQUdFLFVBQUEsSUFBQSxHQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBVCxDQUFZO0FBQUEsWUFBQSxLQUFBLEVBQU8sUUFBUSxDQUFDLEtBQWhCO1dBQVosRUFBbUMsR0FBbkMsRUFBd0MsS0FBeEMsQ0FBUCxDQUhGO1NBSEY7TUFBQSxDQURGO0tBZkE7QUF3QkEsSUFBQSxJQUFHLENBQUEsSUFBUSxDQUFDLE9BQVo7QUFDRSxNQUFBLFdBQUEsQ0FBWSxJQUFaLEVBQWtCLEdBQWxCLEVBQXVCLEtBQUEsR0FBUSxLQUEvQixDQUFBLENBREY7S0F4QkE7V0EyQkEsS0E1QmM7RUFBQSxDQUFoQixDQWZBLENBQUE7U0E2Q0EsSUEvQ0s7QUFBQSxDQUxQLENBQUE7O0FBQUEsRUFzREUsQ0FBQyxLQUFLLENBQUMsUUFBVCxDQUFrQixRQUFsQixFQUE0QixJQUE1QixDQXREQSxDQUFBOztBQUFBLE1BdURNLENBQUMsT0FBUCxHQUFpQixJQXZEakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLHNCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsRUFDQSxHQUFLLE9BQUEsQ0FBUSxnQkFBUixDQURMLENBQUE7O0FBQUEsUUFHQSxHQUFXLElBSFgsQ0FBQTs7QUFBQSxJQUtBLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixFQUEwQyxpQkFBMUMsR0FBQTtBQUVMLE1BQUEsYUFBQTs7SUFGZSxRQUFRLE9BQUEsQ0FBUSxhQUFSO0dBRXZCOztJQUYrQyxvQkFBb0I7R0FFbkU7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUFPLEVBQVA7QUFBQSxJQUNBLE1BQUEsRUFBUSxFQURSO0FBQUEsSUFFQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtLQUhGO0dBREYsQ0FBQTtBQUFBLEVBTUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBTkEsQ0FBQTtBQUFBLEVBT0EsR0FBQSxHQUFNLEVBQUUsQ0FBQyxPQUFILENBQVcsUUFBWCxFQUFxQixRQUFyQixFQUErQixLQUEvQixFQUFzQyxpQkFBdEMsQ0FQTixDQUFBO1NBWUEsSUFkSztBQUFBLENBTFAsQ0FBQTs7QUFBQSxFQXFCRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLFFBQWxCLEVBQTRCLElBQTVCLENBckJBLENBQUE7O0FBQUEsTUFzQk0sQ0FBQyxPQUFQLEdBQWlCLElBdEJqQixDQUFBOzs7OztBQ0FBLElBQUEsVUFBQTs7QUFBQSxVQUFBLEdBQWEsQ0FBSyxNQUFBLENBQUEsTUFBQSxLQUFtQixXQUFuQixJQUFtQyxNQUF2QyxHQUFvRCxNQUFwRCxHQUFnRSxDQUFLLE1BQUEsQ0FBQSxJQUFBLEtBQWlCLFdBQWpCLElBQWlDLElBQXJDLEdBQWdELElBQWhELEdBQTBELENBQUssTUFBQSxDQUFBLE1BQUEsS0FBbUIsV0FBbkIsSUFBbUMsTUFBdkMsR0FBb0QsTUFBcEQsR0FBZ0UsSUFBakUsQ0FBM0QsQ0FBakUsQ0FBYixDQUFBOztBQUFBLE1BQ00sQ0FBQyxPQUFQLEdBQWlCLFVBRGpCLENBQUE7Ozs7Ozs7QUNBQSxJQUFBLCtCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsR0FDQSxHQUFNLE9BQUEsQ0FBUSxnQkFBUixDQUROLENBQUE7O0FBQUEsS0FFQSxHQUFRLE9BQUEsQ0FBUSxjQUFSLENBRlIsQ0FBQTs7QUFBQSxTQUlBLEdBQVksYUFKWixDQUFBOztBQUFBLElBTUEsR0FBTyxTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFFTCxNQUFBLGFBQUE7O0lBRmUsUUFBUSxPQUFBLENBQVEsYUFBUjtHQUV2QjtBQUFBLEVBQUEsUUFBQSxHQUNFO0FBQUEsSUFBQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsTUFDQSxHQUFBLEVBQUssRUFETDtBQUFBLE1BRUEsR0FBQSxFQUFLLEVBRkw7QUFBQSxNQUdBLE1BQUEsRUFBUSxFQUhSO0FBQUEsTUFJQSxLQUFBLEVBQU8sRUFKUDtLQURGO0FBQUEsSUFNQSxNQUFBLEVBQVEsRUFOUjtBQUFBLElBT0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7S0FSRjtHQURGLENBQUE7QUFBQSxFQVdBLEdBQUcsQ0FBQyxNQUFKLENBQVcsUUFBWCxFQUFxQixPQUFyQixFQUE4QixJQUE5QixDQVhBLENBQUE7QUFBQSxFQWFBLEdBQUEsR0FBTSxLQUFBLENBQU0sUUFBTixFQUFnQixLQUFoQixDQWJOLENBQUE7U0FjQSxJQWhCSztBQUFBLENBTlAsQ0FBQTs7QUFBQSxFQXdCRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLElBQTlCLENBeEJBLENBQUE7O0FBQUEsTUF5Qk0sQ0FBQyxPQUFQLEdBQWlCLElBekJqQixDQUFBOzs7OztBQ0FBLElBQUEsK0JBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxHQUNBLEdBQU0sT0FBQSxDQUFRLGdCQUFSLENBRE4sQ0FBQTs7QUFBQSxLQUVBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FGUixDQUFBOztBQUFBLFNBSUEsR0FBWSxVQUpaLENBQUE7O0FBQUEsSUFNQSxHQUFPLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUVMLE1BQUEsYUFBQTs7SUFGZSxRQUFRLE9BQUEsQ0FBUSxhQUFSO0dBRXZCO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLE9BQUEsRUFBUyxLQUFUO0FBQUEsSUFDQSxhQUFBLEVBQWUsS0FEZjtBQUFBLElBRUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtLQUhGO0FBQUEsSUFJQSxNQUFBLEVBQVEsRUFKUjtBQUFBLElBS0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7S0FORjtHQURGLENBQUE7QUFBQSxFQVNBLEdBQUcsQ0FBQyxNQUFKLENBQVcsUUFBWCxFQUFxQixPQUFyQixFQUE4QixJQUE5QixDQVRBLENBQUE7QUFBQSxFQVdBLEdBQUEsR0FBTSxLQUFBLENBQU0sUUFBTixFQUFnQixLQUFoQixDQVhOLENBQUE7QUFZQSxFQUFBLElBQUcsUUFBUSxDQUFDLE9BQVo7QUFDRSxJQUFBLEdBQUcsQ0FBQyxJQUFKLENBQVMsU0FBVCxFQUFvQixJQUFwQixDQUFBLENBREY7R0FBQSxNQUVLLElBQUcsUUFBUSxDQUFDLGFBQVo7QUFDSCxJQUFBLEdBQUcsQ0FBQyxJQUFKLENBQVMsZUFBVCxFQUEwQixJQUExQixDQUFBLENBREc7R0FkTDtTQWlCQSxJQW5CSztBQUFBLENBTlAsQ0FBQTs7QUFBQSxFQTJCRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLElBQTlCLENBM0JBLENBQUE7O0FBQUEsTUE0Qk0sQ0FBQyxPQUFQLEdBQWlCLElBNUJqQixDQUFBOzs7OztBQ0FBLElBQUEsK0JBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxHQUNBLEdBQU0sT0FBQSxDQUFRLGdCQUFSLENBRE4sQ0FBQTs7QUFBQSxLQUVBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FGUixDQUFBOztBQUFBLFNBSUEsR0FBWSxPQUpaLENBQUE7O0FBQUEsSUFNQSxHQUFPLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUVMLE1BQUEsYUFBQTs7SUFGZSxRQUFRLE9BQUEsQ0FBUSxhQUFSO0dBRXZCO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47S0FERjtBQUFBLElBRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxJQUdBLE1BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO0tBSkY7R0FERixDQUFBO0FBQUEsRUFPQSxHQUFHLENBQUMsTUFBSixDQUFXLFFBQVgsRUFBcUIsT0FBckIsRUFBOEIsSUFBOUIsQ0FQQSxDQUFBO0FBQUEsRUFTQSxHQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBaEIsQ0FUTixDQUFBO1NBVUEsSUFaSztBQUFBLENBTlAsQ0FBQTs7QUFBQSxFQW9CRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLElBQTlCLENBcEJBLENBQUE7O0FBQUEsTUFxQk0sQ0FBQyxPQUFQLEdBQWlCLElBckJqQixDQUFBOzs7OztBQ0FBLElBQUEsMEJBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxPQUNBLENBQVEsZ0JBQVIsQ0FEQSxDQUFBOztBQUFBLEtBRUEsR0FBUSxPQUFBLENBQVEsY0FBUixDQUZSLENBQUE7O0FBQUEsU0FJQSxHQUFZLE1BSlosQ0FBQTs7QUFBQSxJQU1BLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBRUwsTUFBQSxhQUFBOztJQUZlLFFBQVEsT0FBQSxDQUFRLGFBQVI7R0FFdkI7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtLQURGO0FBQUEsSUFFQSxNQUFBLEVBQVEsRUFGUjtBQUFBLElBR0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7S0FKRjtHQURGLENBQUE7QUFBQSxFQU9BLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVBBLENBQUE7QUFBQSxFQVNBLEdBQUEsR0FBTSxLQUFBLENBQU0sUUFBTixFQUFnQixLQUFoQixDQVROLENBQUE7U0FVQSxJQVpLO0FBQUEsQ0FOUCxDQUFBOztBQUFBLEVBb0JFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsU0FBbkIsRUFBOEIsSUFBOUIsQ0FwQkEsQ0FBQTs7QUFBQSxNQXFCTSxDQUFDLE9BQVAsR0FBaUIsSUFyQmpCLENBQUE7Ozs7O0FDQUEsSUFBQSwwQkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLE9BQ0EsQ0FBUSxnQkFBUixDQURBLENBQUE7O0FBQUEsT0FFQSxDQUFRLG9CQUFSLENBRkEsQ0FBQTs7QUFBQSxLQUdBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FIUixDQUFBOztBQUFBLFNBS0EsR0FBWSxVQUxaLENBQUE7O0FBQUEsSUFPQSxHQUFPLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUVMLE1BQUEsYUFBQTs7SUFGZSxRQUFRLE9BQUEsQ0FBUSxhQUFSO0dBRXZCO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47S0FERjtBQUFBLElBRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxJQUdBLE1BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO0tBSkY7R0FERixDQUFBO0FBQUEsRUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsRUFTQSxHQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBaEIsQ0FUTixDQUFBO1NBVUEsSUFaSztBQUFBLENBUFAsQ0FBQTs7QUFBQSxFQXFCRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLElBQTlCLENBckJBLENBQUE7O0FBQUEsTUFzQk0sQ0FBQyxPQUFQLEdBQWlCLElBdEJqQixDQUFBOzs7OztBQ0FBLElBQUEsMEJBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxPQUNBLENBQVEsZ0JBQVIsQ0FEQSxDQUFBOztBQUFBLE9BRUEsQ0FBUSxvQkFBUixDQUZBLENBQUE7O0FBQUEsS0FHQSxHQUFRLE9BQUEsQ0FBUSxjQUFSLENBSFIsQ0FBQTs7QUFBQSxTQUtBLEdBQVksZ0JBTFosQ0FBQTs7QUFBQSxJQU9BLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBRUwsTUFBQSxhQUFBOztJQUZlLFFBQVEsT0FBQSxDQUFRLGFBQVI7R0FFdkI7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtLQURGO0FBQUEsSUFFQSxNQUFBLEVBQVEsRUFGUjtBQUFBLElBR0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7S0FKRjtHQURGLENBQUE7QUFBQSxFQU9BLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVBBLENBQUE7QUFBQSxFQVNBLEdBQUEsR0FBTSxLQUFBLENBQU0sUUFBTixFQUFnQixLQUFoQixDQVROLENBQUE7U0FVQSxJQVpLO0FBQUEsQ0FQUCxDQUFBOztBQUFBLEVBcUJFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsU0FBbkIsRUFBOEIsSUFBOUIsQ0FyQkEsQ0FBQTs7QUFBQSxNQXNCTSxDQUFDLE9BQVAsR0FBaUIsSUF0QmpCLENBQUE7Ozs7O0FDQUEsSUFBQSwwQkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLE9BQ0EsQ0FBUSxnQkFBUixDQURBLENBQUE7O0FBQUEsT0FFQSxDQUFRLG9CQUFSLENBRkEsQ0FBQTs7QUFBQSxLQUdBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FIUixDQUFBOztBQUFBLFNBS0EsR0FBWSxPQUxaLENBQUE7O0FBQUEsSUFPQSxHQUFPLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUVMLE1BQUEsYUFBQTs7SUFGZSxRQUFRLE9BQUEsQ0FBUSxhQUFSO0dBRXZCO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxNQUNBLFFBQUEsRUFBVSxFQURWO0tBREY7QUFBQSxJQUdBLE1BQUEsRUFBUSxFQUhSO0FBQUEsSUFJQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtLQUxGO0dBREYsQ0FBQTtBQUFBLEVBUUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBUkEsQ0FBQTtBQUFBLEVBVUEsR0FBQSxHQUFNLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLEtBQWhCLENBVk4sQ0FBQTtTQVdBLElBYks7QUFBQSxDQVBQLENBQUE7O0FBQUEsRUFzQkUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixJQUE5QixDQXRCQSxDQUFBOztBQUFBLE1BdUJNLENBQUMsT0FBUCxHQUFpQixJQXZCakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLDBCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsT0FDQSxDQUFRLGdCQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLENBQVEsb0JBQVIsQ0FGQSxDQUFBOztBQUFBLEtBR0EsR0FBUSxPQUFBLENBQVEsY0FBUixDQUhSLENBQUE7O0FBQUEsU0FLQSxHQUFZLE1BTFosQ0FBQTs7QUFBQSxJQU9BLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBRUwsTUFBQSxhQUFBOztJQUZlLFFBQVEsT0FBQSxDQUFRLGFBQVI7R0FFdkI7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLE1BQ0EsTUFBQSxFQUFRLEVBRFI7QUFBQSxNQUVBLFFBQUEsRUFBVSxFQUZWO0tBREY7QUFBQSxJQUlBLE1BQUEsRUFBUSxFQUpSO0FBQUEsSUFLQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtLQU5GO0dBREYsQ0FBQTtBQUFBLEVBU0EsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBVEEsQ0FBQTtBQUFBLEVBV0EsR0FBQSxHQUFNLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLEtBQWhCLENBWE4sQ0FBQTtTQVlBLElBZEs7QUFBQSxDQVBQLENBQUE7O0FBQUEsRUF1QkUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixJQUE5QixDQXZCQSxDQUFBOztBQUFBLE1Bd0JNLENBQUMsT0FBUCxHQUFpQixJQXhCakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLDBCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsT0FDQSxDQUFRLGdCQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLENBQVEsb0JBQVIsQ0FGQSxDQUFBOztBQUFBLEtBR0EsR0FBUSxPQUFBLENBQVEsY0FBUixDQUhSLENBQUE7O0FBQUEsU0FLQSxHQUFZLFFBTFosQ0FBQTs7QUFBQSxJQU9BLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBRUwsTUFBQSxhQUFBOztJQUZlLFFBQVEsT0FBQSxDQUFRLGFBQVI7R0FFdkI7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtLQURGO0FBQUEsSUFFQSxNQUFBLEVBQVEsRUFGUjtBQUFBLElBR0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7S0FKRjtHQURGLENBQUE7QUFBQSxFQU9BLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVBBLENBQUE7QUFBQSxFQVNBLEdBQUEsR0FBTSxLQUFBLENBQU0sUUFBTixFQUFnQixLQUFoQixDQVROLENBQUE7U0FVQSxJQVpLO0FBQUEsQ0FQUCxDQUFBOztBQUFBLEVBcUJFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsU0FBbkIsRUFBOEIsSUFBOUIsQ0FyQkEsQ0FBQTs7QUFBQSxNQXNCTSxDQUFDLE9BQVAsR0FBaUIsSUF0QmpCLENBQUE7Ozs7O0FDQUEsSUFBQSwwQkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLE9BQ0EsQ0FBUSxnQkFBUixDQURBLENBQUE7O0FBQUEsT0FFQSxDQUFRLG9CQUFSLENBRkEsQ0FBQTs7QUFBQSxLQUdBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FIUixDQUFBOztBQUFBLFNBS0EsR0FBWSxZQUxaLENBQUE7O0FBQUEsSUFPQSxHQUFPLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUVMLE1BQUEsYUFBQTs7SUFGZSxRQUFRLE9BQUEsQ0FBUSxhQUFSO0dBRXZCO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxNQUNBLEdBQUEsRUFBSyxFQURMO0FBQUEsTUFFQSxHQUFBLEVBQUssRUFGTDtBQUFBLE1BR0EsTUFBQSxFQUFRLEVBSFI7QUFBQSxNQUlBLEtBQUEsRUFBTyxFQUpQO0tBREY7QUFBQSxJQU1BLE1BQUEsRUFBUSxFQU5SO0FBQUEsSUFPQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtLQVJGO0dBREYsQ0FBQTtBQUFBLEVBV0EsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBWEEsQ0FBQTtBQUFBLEVBYUEsR0FBQSxHQUFNLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLEtBQWhCLENBYk4sQ0FBQTtTQWNBLElBaEJLO0FBQUEsQ0FQUCxDQUFBOztBQUFBLEVBeUJFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsU0FBbkIsRUFBOEIsSUFBOUIsQ0F6QkEsQ0FBQTs7QUFBQSxNQTBCTSxDQUFDLE9BQVAsR0FBaUIsSUExQmpCLENBQUE7Ozs7O0FDQUEsSUFBQSwwQkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLE9BQ0EsQ0FBUSxnQkFBUixDQURBLENBQUE7O0FBQUEsT0FFQSxDQUFRLG9CQUFSLENBRkEsQ0FBQTs7QUFBQSxLQUdBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FIUixDQUFBOztBQUFBLFNBS0EsR0FBWSxPQUxaLENBQUE7O0FBQUEsSUFPQSxHQUFPLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUVMLE1BQUEsYUFBQTs7SUFGZSxRQUFRLE9BQUEsQ0FBUSxhQUFSO0dBRXZCO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47S0FERjtBQUFBLElBRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxJQUdBLE1BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO0tBSkY7R0FERixDQUFBO0FBQUEsRUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsRUFTQSxHQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBaEIsQ0FUTixDQUFBO1NBVUEsSUFaSztBQUFBLENBUFAsQ0FBQTs7QUFBQSxFQXFCRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLElBQTlCLENBckJBLENBQUE7O0FBQUEsTUFzQk0sQ0FBQyxPQUFQLEdBQWlCLElBdEJqQixDQUFBOzs7OztBQ0FBLElBQUEsMEJBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxPQUNBLENBQVEsZ0JBQVIsQ0FEQSxDQUFBOztBQUFBLE9BRUEsQ0FBUSxvQkFBUixDQUZBLENBQUE7O0FBQUEsS0FHQSxHQUFRLE9BQUEsQ0FBUSxjQUFSLENBSFIsQ0FBQTs7QUFBQSxTQUtBLEdBQVksUUFMWixDQUFBOztBQUFBLElBT0EsR0FBTyxTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFFTCxNQUFBLGFBQUE7O0lBRmUsUUFBUSxPQUFBLENBQVEsYUFBUjtHQUV2QjtBQUFBLEVBQUEsUUFBQSxHQUNFO0FBQUEsSUFBQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxTQUFOO0tBREY7QUFBQSxJQUVBLE1BQUEsRUFBUSxFQUZSO0FBQUEsSUFHQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtLQUpGO0dBREYsQ0FBQTtBQUFBLEVBT0EsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBUEEsQ0FBQTtBQUFBLEVBU0EsR0FBQSxHQUFNLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLEtBQWhCLENBVE4sQ0FBQTtTQVVBLElBWks7QUFBQSxDQVBQLENBQUE7O0FBQUEsRUFxQkUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixJQUE5QixDQXJCQSxDQUFBOztBQUFBLE1Bc0JNLENBQUMsT0FBUCxHQUFpQixJQXRCakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLDBCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsT0FDQSxDQUFRLGdCQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLENBQVEsb0JBQVIsQ0FGQSxDQUFBOztBQUFBLEtBR0EsR0FBUSxPQUFBLENBQVEsY0FBUixDQUhSLENBQUE7O0FBQUEsU0FLQSxHQUFZLFVBTFosQ0FBQTs7QUFBQSxJQU9BLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBRUwsTUFBQSxhQUFBOztJQUZlLFFBQVEsT0FBQSxDQUFRLGFBQVI7R0FFdkI7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLE1BQ0EsU0FBQSxFQUFXLEVBRFg7S0FERjtBQUFBLElBR0EsTUFBQSxFQUFRLEVBSFI7QUFBQSxJQUlBLE1BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO0tBTEY7R0FERixDQUFBO0FBQUEsRUFRQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FSQSxDQUFBO0FBQUEsRUFVQSxHQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBaEIsQ0FWTixDQUFBO1NBV0EsSUFiSztBQUFBLENBUFAsQ0FBQTs7QUFBQSxFQXNCRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLElBQTlCLENBdEJBLENBQUE7O0FBQUEsTUF1Qk0sQ0FBQyxPQUFQLEdBQWlCLElBdkJqQixDQUFBOzs7OztBQ0FBLElBQUEsMEJBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxPQUNBLENBQVEsZ0JBQVIsQ0FEQSxDQUFBOztBQUFBLE9BRUEsQ0FBUSxvQkFBUixDQUZBLENBQUE7O0FBQUEsS0FHQSxHQUFRLE9BQUEsQ0FBUSxjQUFSLENBSFIsQ0FBQTs7QUFBQSxTQUtBLEdBQVksT0FMWixDQUFBOztBQUFBLElBT0EsR0FBTyxTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFFTCxNQUFBLGFBQUE7O0lBRmUsUUFBUSxPQUFBLENBQVEsYUFBUjtHQUV2QjtBQUFBLEVBQUEsUUFBQSxHQUNFO0FBQUEsSUFBQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsTUFDQSxJQUFBLEVBQU0sRUFETjtBQUFBLE1BRUEsS0FBQSxFQUFPLEVBRlA7QUFBQSxNQUdBLE9BQUEsRUFBUyxFQUhUO0tBREY7QUFBQSxJQUtBLE1BQUEsRUFBUSxFQUxSO0FBQUEsSUFNQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtLQVBGO0dBREYsQ0FBQTtBQUFBLEVBVUEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBVkEsQ0FBQTtBQUFBLEVBWUEsR0FBQSxHQUFNLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLEtBQWhCLENBWk4sQ0FBQTtTQWFBLElBZks7QUFBQSxDQVBQLENBQUE7O0FBQUEsRUF3QkUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixJQUE5QixDQXhCQSxDQUFBOztBQUFBLE1BeUJNLENBQUMsT0FBUCxHQUFpQixJQXpCakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLDBCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsT0FDQSxDQUFRLGdCQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLENBQVEsb0JBQVIsQ0FGQSxDQUFBOztBQUFBLEtBR0EsR0FBUSxPQUFBLENBQVEsY0FBUixDQUhSLENBQUE7O0FBQUEsU0FLQSxHQUFZLE9BTFosQ0FBQTs7QUFBQSxJQU9BLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBRUwsTUFBQSxhQUFBOztJQUZlLFFBQVEsT0FBQSxDQUFRLGFBQVI7R0FFdkI7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLE1BQ0EsR0FBQSxFQUFLLENBREw7QUFBQSxNQUVBLEdBQUEsRUFBSyxHQUZMO0FBQUEsTUFHQSxLQUFBLEVBQU8sRUFIUDtBQUFBLE1BSUEsSUFBQSxFQUFNLENBSk47S0FERjtBQUFBLElBTUEsTUFBQSxFQUFRLEVBTlI7QUFBQSxJQU9BLE1BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO0tBUkY7R0FERixDQUFBO0FBQUEsRUFXQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FYQSxDQUFBO0FBQUEsRUFhQSxHQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBaEIsQ0FiTixDQUFBO1NBY0EsSUFoQks7QUFBQSxDQVBQLENBQUE7O0FBQUEsRUF5QkUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixJQUE5QixDQXpCQSxDQUFBOztBQUFBLE1BMEJNLENBQUMsT0FBUCxHQUFpQixJQTFCakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLDBCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsT0FDQSxDQUFRLGdCQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLENBQVEsb0JBQVIsQ0FGQSxDQUFBOztBQUFBLEtBR0EsR0FBUSxPQUFBLENBQVEsY0FBUixDQUhSLENBQUE7O0FBQUEsU0FLQSxHQUFZLE9BTFosQ0FBQTs7QUFBQSxJQU9BLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBRUwsTUFBQSxhQUFBOztJQUZlLFFBQVEsT0FBQSxDQUFRLGFBQVI7R0FFdkI7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtLQURGO0FBQUEsSUFFQSxNQUFBLEVBQVEsRUFGUjtBQUFBLElBR0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7S0FKRjtHQURGLENBQUE7QUFBQSxFQU9BLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVBBLENBQUE7QUFBQSxFQVNBLEdBQUEsR0FBTSxLQUFBLENBQU0sUUFBTixFQUFnQixLQUFoQixDQVROLENBQUE7U0FVQSxJQVpLO0FBQUEsQ0FQUCxDQUFBOztBQUFBLEVBcUJFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsU0FBbkIsRUFBOEIsSUFBOUIsQ0FyQkEsQ0FBQTs7QUFBQSxNQXNCTSxDQUFDLE9BQVAsR0FBaUIsSUF0QmpCLENBQUE7Ozs7O0FDQUEsSUFBQSwwQkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLE9BQ0EsQ0FBUSxnQkFBUixDQURBLENBQUE7O0FBQUEsT0FFQSxDQUFRLG9CQUFSLENBRkEsQ0FBQTs7QUFBQSxLQUdBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FIUixDQUFBOztBQUFBLFNBS0EsR0FBWSxRQUxaLENBQUE7O0FBQUEsSUFPQSxHQUFPLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUVMLE1BQUEsYUFBQTs7SUFGZSxRQUFRLE9BQUEsQ0FBUSxhQUFSO0dBRXZCO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47S0FERjtBQUFBLElBRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxJQUdBLE1BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO0tBSkY7R0FERixDQUFBO0FBQUEsRUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsRUFTQSxHQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBaEIsQ0FUTixDQUFBO1NBVUEsSUFaSztBQUFBLENBUFAsQ0FBQTs7QUFBQSxFQXFCRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLElBQTlCLENBckJBLENBQUE7O0FBQUEsTUFzQk0sQ0FBQyxPQUFQLEdBQWlCLElBdEJqQixDQUFBOzs7OztBQ0FBLElBQUEsMEJBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxPQUNBLENBQVEsZ0JBQVIsQ0FEQSxDQUFBOztBQUFBLE9BRUEsQ0FBUSxvQkFBUixDQUZBLENBQUE7O0FBQUEsS0FHQSxHQUFRLE9BQUEsQ0FBUSxjQUFSLENBSFIsQ0FBQTs7QUFBQSxTQUtBLEdBQVksUUFMWixDQUFBOztBQUFBLElBT0EsR0FBTyxTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFFTCxNQUFBLGFBQUE7O0lBRmUsUUFBUSxPQUFBLENBQVEsYUFBUjtHQUV2QjtBQUFBLEVBQUEsUUFBQSxHQUNFO0FBQUEsSUFBQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLElBQUEsRUFBTSxTQUFOO0tBREY7QUFBQSxJQUVBLE1BQUEsRUFBUSxFQUZSO0FBQUEsSUFHQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtLQUpGO0dBREYsQ0FBQTtBQUFBLEVBT0EsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBUEEsQ0FBQTtBQUFBLEVBU0EsR0FBQSxHQUFNLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLEtBQWhCLENBVE4sQ0FBQTtTQVVBLElBWks7QUFBQSxDQVBQLENBQUE7O0FBQUEsRUFxQkUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixJQUE5QixDQXJCQSxDQUFBOztBQUFBLE1Bc0JNLENBQUMsT0FBUCxHQUFpQixJQXRCakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLDBCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsT0FDQSxDQUFRLGdCQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLENBQVEsb0JBQVIsQ0FGQSxDQUFBOztBQUFBLEtBR0EsR0FBUSxPQUFBLENBQVEsY0FBUixDQUhSLENBQUE7O0FBQUEsU0FLQSxHQUFZLEtBTFosQ0FBQTs7QUFBQSxJQU9BLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBRUwsTUFBQSxhQUFBOztJQUZlLFFBQVEsT0FBQSxDQUFRLGFBQVI7R0FFdkI7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLE1BQ0EsT0FBQSxFQUFTLEVBRFQ7QUFBQSxNQUVBLFNBQUEsRUFBVyxFQUZYO0tBREY7QUFBQSxJQUlBLE1BQUEsRUFBUSxFQUpSO0FBQUEsSUFLQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtLQU5GO0dBREYsQ0FBQTtBQUFBLEVBU0EsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBVEEsQ0FBQTtBQUFBLEVBV0EsR0FBQSxHQUFNLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLEtBQWhCLENBWE4sQ0FBQTtTQVlBLElBZEs7QUFBQSxDQVBQLENBQUE7O0FBQUEsRUF1QkUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixJQUE5QixDQXZCQSxDQUFBOztBQUFBLE1Bd0JNLENBQUMsT0FBUCxHQUFpQixJQXhCakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLDBCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsT0FDQSxDQUFRLGdCQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLENBQVEsb0JBQVIsQ0FGQSxDQUFBOztBQUFBLEtBR0EsR0FBUSxPQUFBLENBQVEsY0FBUixDQUhSLENBQUE7O0FBQUEsU0FLQSxHQUFZLFdBTFosQ0FBQTs7QUFBQSxJQU9BLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBRUwsTUFBQSxhQUFBOztJQUZlLFFBQVEsT0FBQSxDQUFRLGFBQVI7R0FFdkI7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sTUFBTjtBQUFBLE1BQ0EsWUFBQSxFQUFjLElBRGQ7QUFBQSxNQUVBLFFBQUEsRUFBVSxFQUZWO0tBREY7QUFBQSxJQUlBLE1BQUEsRUFBUSxFQUpSO0FBQUEsSUFLQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTyxFQUFFLENBQUMsSUFBVjtLQU5GO0dBREYsQ0FBQTtBQUFBLEVBU0EsRUFBRSxDQUFDLE1BQUgsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBVEEsQ0FBQTtBQUFBLEVBV0EsR0FBQSxHQUFNLEtBQUEsQ0FBTSxRQUFOLEVBQWdCLEtBQWhCLENBWE4sQ0FBQTtTQVlBLElBZEs7QUFBQSxDQVBQLENBQUE7O0FBQUEsRUF1QkUsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixTQUFuQixFQUE4QixJQUE5QixDQXZCQSxDQUFBOztBQUFBLE1Bd0JNLENBQUMsT0FBUCxHQUFpQixJQXhCakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLDBCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsT0FDQSxDQUFRLGdCQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLENBQVEsb0JBQVIsQ0FGQSxDQUFBOztBQUFBLEtBR0EsR0FBUSxPQUFBLENBQVEsY0FBUixDQUhSLENBQUE7O0FBQUEsU0FLQSxHQUFZLE1BTFosQ0FBQTs7QUFBQSxJQU9BLEdBQU8sU0FBQyxPQUFELEVBQVUsS0FBVixHQUFBO0FBRUwsTUFBQSxhQUFBOztJQUZlLFFBQVEsT0FBQSxDQUFRLGFBQVI7R0FFdkI7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxJQUFBLEVBQU0sU0FBTjtLQURGO0FBQUEsSUFFQSxNQUFBLEVBQVEsRUFGUjtBQUFBLElBR0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7S0FKRjtHQURGLENBQUE7QUFBQSxFQU9BLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVBBLENBQUE7QUFBQSxFQVNBLEdBQUEsR0FBTSxLQUFBLENBQU0sUUFBTixFQUFnQixLQUFoQixDQVROLENBQUE7U0FVQSxJQVpLO0FBQUEsQ0FQUCxDQUFBOztBQUFBLEVBcUJFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsU0FBbkIsRUFBOEIsSUFBOUIsQ0FyQkEsQ0FBQTs7QUFBQSxNQXNCTSxDQUFDLE9BQVAsR0FBaUIsSUF0QmpCLENBQUE7Ozs7O0FDQUEsSUFBQSwwQkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLE9BQ0EsQ0FBUSxnQkFBUixDQURBLENBQUE7O0FBQUEsT0FFQSxDQUFRLG9CQUFSLENBRkEsQ0FBQTs7QUFBQSxLQUdBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FIUixDQUFBOztBQUFBLFNBS0EsR0FBWSxLQUxaLENBQUE7O0FBQUEsSUFPQSxHQUFPLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUVMLE1BQUEsYUFBQTs7SUFGZSxRQUFRLE9BQUEsQ0FBUSxhQUFSO0dBRXZCO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxNQUNBLE9BQUEsRUFBUyxFQURUO0FBQUEsTUFFQSxTQUFBLEVBQVcsRUFGWDtLQURGO0FBQUEsSUFJQSxNQUFBLEVBQVEsRUFKUjtBQUFBLElBS0EsTUFBQSxFQUNFO0FBQUEsTUFBQSxLQUFBLEVBQU8sRUFBRSxDQUFDLElBQVY7S0FORjtHQURGLENBQUE7QUFBQSxFQVNBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQVRBLENBQUE7QUFBQSxFQVdBLEdBQUEsR0FBTSxLQUFBLENBQU0sUUFBTixFQUFnQixLQUFoQixDQVhOLENBQUE7U0FZQSxJQWRLO0FBQUEsQ0FQUCxDQUFBOztBQUFBLEVBdUJFLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsU0FBbkIsRUFBOEIsSUFBOUIsQ0F2QkEsQ0FBQTs7QUFBQSxNQXdCTSxDQUFDLE9BQVAsR0FBaUIsSUF4QmpCLENBQUE7Ozs7O0FDQUEsSUFBQSwwQkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLE9BQ0EsQ0FBUSxnQkFBUixDQURBLENBQUE7O0FBQUEsT0FFQSxDQUFRLG9CQUFSLENBRkEsQ0FBQTs7QUFBQSxLQUdBLEdBQVEsT0FBQSxDQUFRLGNBQVIsQ0FIUixDQUFBOztBQUFBLFNBS0EsR0FBWSxNQUxaLENBQUE7O0FBQUEsSUFPQSxHQUFPLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUVMLE1BQUEsYUFBQTs7SUFGZSxRQUFRLE9BQUEsQ0FBUSxhQUFSO0dBRXZCO0FBQUEsRUFBQSxRQUFBLEdBQ0U7QUFBQSxJQUFBLEtBQUEsRUFDRTtBQUFBLE1BQUEsSUFBQSxFQUFNLFNBQU47S0FERjtBQUFBLElBRUEsTUFBQSxFQUFRLEVBRlI7QUFBQSxJQUdBLE1BQUEsRUFDRTtBQUFBLE1BQUEsS0FBQSxFQUFPLEVBQUUsQ0FBQyxJQUFWO0tBSkY7R0FERixDQUFBO0FBQUEsRUFPQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVYsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsQ0FQQSxDQUFBO0FBQUEsRUFTQSxHQUFBLEdBQU0sS0FBQSxDQUFNLFFBQU4sRUFBZ0IsS0FBaEIsQ0FUTixDQUFBO1NBVUEsSUFaSztBQUFBLENBUFAsQ0FBQTs7QUFBQSxFQXFCRSxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLFNBQW5CLEVBQThCLElBQTlCLENBckJBLENBQUE7O0FBQUEsTUFzQk0sQ0FBQyxPQUFQLEdBQWlCLElBdEJqQixDQUFBOzs7OztBQ0NBLElBQUEsc0VBQUE7O0FBQUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxVQUFSLENBQWIsQ0FBQTs7QUFBQSxPQUNBLEdBQVUsT0FBQSxDQUFRLFFBQVIsQ0FEVixDQUFBOztBQUFBLGFBRUEsR0FBZ0IsSUFGaEIsQ0FBQTs7QUFJQTtBQUFBOztHQUpBOztBQUFBLE1BT00sQ0FBQyxnQkFBUCxDQUF3QixNQUFNLENBQUEsU0FBOUIsRUFDRTtBQUFBLEVBQUEsZUFBQSxFQUNFO0FBQUEsSUFBQSxLQUFBLEVBQU8sU0FBQSxHQUFBO0FBQ0wsVUFBQSxzQkFBQTtBQUFBLE1BQUEsYUFBQSxHQUFnQixvQkFBaEIsQ0FBQTtBQUFBLE1BQ0EsT0FBQSxHQUFXLGFBQWMsQ0FBQyxJQUFoQixDQUFxQixJQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBQSxDQUFyQixDQURWLENBQUE7QUFFQyxNQUFBLElBQUksT0FBQSxJQUFZLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQWpDO2VBQXlDLE9BQVEsQ0FBQSxDQUFBLEVBQWpEO09BQUEsTUFBQTtlQUF5RCxHQUF6RDtPQUhJO0lBQUEsQ0FBUDtHQURGO0NBREYsQ0FQQSxDQUFBOztBQWVBO0FBQUE7O0dBZkE7O0FBQUEsTUFrQkEsR0FBUyxFQWxCVCxDQUFBOztBQUFBLFlBbUJBLEdBQWUsU0FBQSxHQUFBO0FBRWI7QUFBQTs7S0FBQTtBQUFBLE1BQUEsMkNBQUE7QUFBQSxFQUdBLGFBQUEsR0FBZ0IsU0FBQyxTQUFELEVBQVksSUFBWixHQUFBO0FBQ2Q7QUFBQTs7T0FBQTtBQUFBLFFBQUEsV0FBQTtBQUFBLElBR0EsSUFBQSxHQUFPLFNBQUMsTUFBRCxHQUFBO0FBQ0wsVUFBQSxzQkFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLElBQVIsQ0FBQTtBQUFBLE1BQ0EsSUFBSyxDQUFBLE1BQUEsQ0FBTCxHQUFlLElBQUssQ0FBQSxNQUFBLENBQUwsSUFBZ0IsRUFEL0IsQ0FBQTtBQUFBLE1BRUEsTUFBQSxHQUFTLElBQUssQ0FBQSxNQUFBLENBRmQsQ0FBQTtBQUFBLE1BR0EsT0FBQSxHQUFVLEVBSFYsQ0FBQTtBQUFBLE1BS0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsSUFBdEIsRUFBNEIsU0FBNUIsRUFBdUM7QUFBQSxRQUFBLEtBQUEsRUFBTyxPQUFQO09BQXZDLENBTEEsQ0FBQTtBQU9BO0FBQUE7OztTQVBBO0FBQUEsTUFXQSxNQUFNLENBQUMsY0FBUCxDQUFzQixJQUF0QixFQUE0QixVQUE1QixFQUNFO0FBQUEsUUFBQSxLQUFBLEVBQU8sU0FBQyxJQUFELEVBQU8sR0FBUCxFQUFZLFVBQVosR0FBQTtBQUNMLFVBQUEsWUFBQSxDQUFBO0FBQ0EsVUFBQSxJQUF3RSxDQUFDLE1BQUEsQ0FBQSxJQUFBLEtBQWlCLFFBQWxCLENBQUEsSUFBK0IsSUFBQSxLQUFRLEVBQS9HO0FBQUEsa0JBQVUsSUFBQSxLQUFBLENBQU0sa0RBQU4sQ0FBVixDQUFBO1dBREE7QUFFQSxVQUFBLElBQUEsQ0FBQSxHQUFBO0FBQUEsa0JBQVUsSUFBQSxLQUFBLENBQU0sK0RBQU4sQ0FBVixDQUFBO1dBRkE7QUFHQSxVQUFBLElBQTRGLEtBQU0sQ0FBQSxJQUFBLENBQWxHO0FBQUEsa0JBQVUsSUFBQSxLQUFBLENBQU0saUJBQUEsR0FBb0IsSUFBcEIsR0FBMkIseUJBQTNCLEdBQXVELFNBQXZELEdBQW1FLEdBQXpFLENBQVYsQ0FBQTtXQUhBO0FBQUEsVUFLQSxPQUFRLENBQUEsSUFBQSxDQUFSLEdBQWdCLE9BQVEsQ0FBQSxJQUFBLENBQVIsSUFBaUIsSUFMakMsQ0FBQTtBQUFBLFVBUUEsTUFBTyxDQUFBLElBQUEsQ0FBUCxHQUFlLE1BQU8sQ0FBQSxJQUFBLENBQVAsSUFDYjtBQUFBLFlBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxZQUNBLElBQUEsRUFBTSxNQUFBLENBQUEsR0FETjtBQUFBLFlBRUEsUUFBQSxFQUFVLENBQUksR0FBRyxDQUFDLGVBQVAsR0FBNEIsR0FBRyxDQUFDLGVBQUosQ0FBQSxDQUE1QixHQUF1RCxTQUF4RCxDQUZWO1dBVEYsQ0FBQTtBQUFBLFVBYUEsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsS0FBdEIsRUFBNkIsSUFBN0IsRUFDRTtBQUFBLFlBQUEsS0FBQSxFQUFPLEdBQVA7QUFBQSxZQUNBLFVBQUEsRUFBWSxLQUFBLEtBQVcsVUFEdkI7V0FERixDQWJBLENBQUE7QUFBQSxVQWlCQSxVQUFVLENBQUMsZUFBWCxDQUEyQixNQUFBLEdBQVMsR0FBVCxHQUFlLFNBQWYsR0FBMkIsR0FBM0IsR0FBaUMsSUFBNUQsQ0FqQkEsQ0FBQTtpQkFrQkEsSUFuQks7UUFBQSxDQUFQO09BREYsQ0FYQSxDQUFBO0FBa0NBO0FBQUE7O1NBbENBO0FBQUEsTUFxQ0EsS0FBSyxDQUFDLFFBQU4sQ0FBZSxrQkFBZixFQUFtQyxDQUFDLFNBQUMsWUFBRCxHQUFBO0FBQ2xDLFFBQUEsWUFBQSxDQUFBO0FBQUEsWUFBQSxZQUFBO0FBQ0EsUUFBQSxJQUErRSxDQUFDLE1BQUEsQ0FBQSxZQUFBLEtBQXlCLFFBQTFCLENBQUEsSUFBdUMsWUFBQSxLQUFnQixFQUF0STtBQUFBLGdCQUFVLElBQUEsS0FBQSxDQUFNLHlEQUFOLENBQVYsQ0FBQTtTQURBO0FBRUEsUUFBQSxJQUF5RyxLQUFLLENBQUMsWUFBL0c7QUFBQSxnQkFBVSxJQUFBLEtBQUEsQ0FBTSxzQkFBQSxHQUF5QixZQUF6QixHQUF3Qyx5QkFBeEMsR0FBb0UsU0FBcEUsR0FBZ0YsR0FBdEYsQ0FBVixDQUFBO1NBRkE7QUFBQSxRQUdBLFVBQVUsQ0FBQyxlQUFYLENBQTJCLE1BQUEsR0FBUyxHQUFULEdBQWUsWUFBMUMsQ0FIQSxDQUFBO0FBQUEsUUFJQSxZQUFBLEdBQWUsYUFBQSxDQUFjLFlBQWQsRUFBNEIsTUFBNUIsQ0FKZixDQUFBO0FBS0EsUUFBQSxJQUFpRixZQUFBLEtBQWtCLFdBQW5HO0FBQUEsVUFBQSxZQUFZLENBQUMsUUFBYixDQUFzQixXQUF0QixFQUFtQyxhQUFBLENBQWMsV0FBZCxFQUEyQixNQUEzQixDQUFuQyxFQUF1RSxLQUF2RSxDQUFBLENBQUE7U0FMQTtBQUFBLFFBTUEsS0FBSyxDQUFDLFFBQU4sQ0FBZSxZQUFmLEVBQTZCLFlBQTdCLEVBQTJDLEtBQTNDLENBTkEsQ0FBQTtlQU9BLGFBUmtDO01BQUEsQ0FBRCxDQUFuQyxFQVNHLEtBVEgsQ0FyQ0EsQ0FESztJQUFBLENBSFAsQ0FBQTtBQXFEQTtBQUFBOzs7OztPQXJEQTtBQUFBLElBMkRBLEtBQUEsR0FBWSxJQUFBLFFBQUEsQ0FBUyxrQkFBQSxHQUFxQixTQUFyQixHQUFpQyxNQUExQyxDQUFBLENBQUEsQ0EzRFosQ0FBQTtBQUFBLElBNERBLEtBQUssQ0FBQSxTQUFMLEdBQWMsSUFBQSxJQUFBLENBQUssU0FBTCxDQTVEZCxDQUFBO1dBK0RJLElBQUEsS0FBQSxDQUFNLFNBQU4sRUFoRVU7RUFBQSxDQUhoQixDQUFBO0FBcUVBO0FBQUE7OztLQXJFQTtBQUFBLEVBeUVBLFNBQUEsR0FBWSxTQUFDLFlBQUQsRUFBZSxRQUFmLEVBQXlCLE9BQXpCLEdBQUE7QUFDVixJQUFBLFlBQUEsQ0FBQTtBQUFBLFFBQUEsdUJBQUE7QUFBQSxJQUNBLEdBQUEsR0FBTSxLQUROLENBQUE7QUFBQSxJQUVBLFNBQUEsR0FBWSxVQUFVLENBQUMsWUFBWCxDQUFBLENBRlosQ0FBQTtBQUdBLElBQUEsSUFBRyxZQUFBLElBQWlCLFlBQVksQ0FBQyxNQUFiLEdBQXNCLENBQXZDLElBQTZDLFFBQWhEO0FBQ0UsTUFBQSxPQUFBLEdBQVUsWUFBWSxDQUFDLE1BQWIsQ0FBb0IsU0FBQyxLQUFELEdBQUE7ZUFDNUIsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsS0FBbEIsQ0FBQSxLQUE0QixDQUFBLENBQTVCLElBQW1DLENBQUMsQ0FBQSxPQUFBLElBQWUsT0FBQSxLQUFhLEtBQTdCLEVBRFA7TUFBQSxDQUFwQixDQUFWLENBQUE7QUFHQSxNQUFBLElBQUcsT0FBTyxDQUFDLE1BQVIsS0FBa0IsQ0FBckI7QUFDRSxRQUFBLEdBQUEsR0FBTSxJQUFOLENBQUE7QUFBQSxRQUNBLFFBQUEsQ0FBQSxDQURBLENBREY7T0FBQSxNQUFBO0FBSUUsUUFBQSxVQUFVLENBQUMsVUFBVSxDQUFDLElBQXRCLENBQTJCLFNBQUMsT0FBRCxHQUFBO2lCQUN6QixTQUFBLENBQVUsT0FBVixFQUFtQixRQUFuQixFQUE2QixPQUE3QixFQUR5QjtRQUFBLENBQTNCLENBQUEsQ0FKRjtPQUpGO0tBSEE7V0FjQSxJQWZVO0VBQUEsQ0F6RVosQ0FBQTtBQUFBLEVBeUZBLFVBQUEsR0FBYTtBQUFBLElBQUEsVUFBQSxFQUFZLEVBQVo7R0F6RmIsQ0FBQTtBQTJGQTtBQUFBOztLQTNGQTtBQUFBLEVBOEZBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLFVBQXRCLEVBQWtDLGNBQWxDLEVBQ0U7QUFBQSxJQUFBLEtBQUEsRUFBTyxTQUFBLEdBQUE7QUFDTCxVQUFBLG9CQUFBO0FBQUEsTUFBQSxXQUFBLEdBQWMsU0FBQyxHQUFELEVBQU0sT0FBTixHQUFBO0FBQ1osUUFBQSxJQUFxQyxNQUFBLENBQUEsR0FBQSxLQUFnQixRQUFyRDtBQUFBLFVBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxPQUFBLEdBQVUsR0FBVixHQUFnQixHQUE3QixDQUFBLENBQUE7U0FBQTtBQUNBLFFBQUEsSUFBRyxPQUFPLENBQUMsYUFBUixDQUFzQixHQUF0QixDQUFIO0FBQ0UsVUFBQSxNQUFNLENBQUMsSUFBUCxDQUFZLEdBQVosQ0FBZ0IsQ0FBQyxPQUFqQixDQUF5QixTQUFDLENBQUQsR0FBQTtBQUN2QixZQUFBLElBQW1DLE1BQUEsQ0FBQSxDQUFBLEtBQWMsUUFBakQ7QUFBQSxjQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsT0FBQSxHQUFVLEdBQVYsR0FBZ0IsQ0FBN0IsQ0FBQSxDQUFBO2FBQUE7QUFDQSxZQUFBLElBQTBDLE9BQU8sQ0FBQyxhQUFSLENBQXNCLEdBQUksQ0FBQSxDQUFBLENBQTFCLENBQTFDO0FBQUEsY0FBQSxXQUFBLENBQVksR0FBSSxDQUFBLENBQUEsQ0FBaEIsRUFBb0IsT0FBQSxHQUFVLEdBQVYsR0FBZ0IsQ0FBcEMsQ0FBQSxDQUFBO2FBRnVCO1VBQUEsQ0FBekIsQ0FBQSxDQURGO1NBRlk7TUFBQSxDQUFkLENBQUE7QUFBQSxNQVNBLE9BQUEsR0FBVSxFQVRWLENBQUE7QUFBQSxNQVVBLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBTyxDQUFBLGFBQUEsQ0FBbkIsQ0FBa0MsQ0FBQyxPQUFuQyxDQUEyQyxTQUFDLEdBQUQsR0FBQTtBQUN6QyxRQUFBLElBQTBELE9BQU8sQ0FBQyxhQUFSLENBQXNCLE1BQU8sQ0FBQSxhQUFBLENBQWUsQ0FBQSxHQUFBLENBQTVDLENBQTFEO0FBQUEsVUFBQSxXQUFBLENBQVksTUFBTyxDQUFBLGFBQUEsQ0FBZSxDQUFBLEdBQUEsQ0FBbEMsRUFBd0MsYUFBeEMsQ0FBQSxDQUFBO1NBRHlDO01BQUEsQ0FBM0MsQ0FWQSxDQUFBO2FBY0EsUUFmSztJQUFBLENBQVA7R0FERixDQTlGQSxDQUFBO0FBZ0hBO0FBQUE7O0tBaEhBO0FBQUEsRUFtSEEsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsVUFBdEIsRUFBa0MsaUJBQWxDLEVBQ0U7QUFBQSxJQUFBLEtBQUEsRUFBTyxTQUFDLE9BQUQsR0FBQTtBQUNMLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBdEIsQ0FBNkIsU0FBQyxLQUFELEdBQUE7ZUFDbEMsS0FBQSxLQUFTLEtBQUEsQ0FBTSxPQUFOLEVBRHlCO01BQUEsQ0FBN0IsQ0FBUCxDQUFBO0FBR0EsTUFBQSxJQUFpQyxLQUFLLENBQUMsT0FBTixDQUFjLElBQWQsQ0FBakM7ZUFBQSxVQUFVLENBQUMsVUFBWCxHQUF3QixLQUF4QjtPQUpLO0lBQUEsQ0FBUDtHQURGLENBbkhBLENBQUE7QUFBQSxFQTJIQSxNQUFPLENBQUEsYUFBQSxDQUFQLEdBQXdCLEVBM0h4QixDQUFBO0FBQUEsRUE2SEEsS0FBQSxHQUFRLGFBQUEsQ0FBYyxhQUFkLEVBQTZCLE1BQU8sQ0FBQSxhQUFBLENBQXBDLENBN0hSLENBQUE7QUErSEE7QUFBQTs7S0EvSEE7QUFBQSxFQWtJQSxLQUFLLENBQUMsUUFBTixDQUFlLEdBQWYsRUFBb0IsT0FBcEIsRUFBNkIsS0FBN0IsQ0FsSUEsQ0FBQTtBQW9JQTtBQUFBOztLQXBJQTtBQUFBLEVBdUlBLEtBQUssQ0FBQyxRQUFOLENBQWUsTUFBZixFQUF1QixNQUFPLENBQUEsYUFBQSxDQUE5QixFQUE4QyxLQUE5QyxDQXZJQSxDQUFBO0FBeUlBO0FBQUE7O0tBeklBO0FBQUEsRUE0SUEsS0FBSyxDQUFDLFFBQU4sQ0FBZSxNQUFmLEVBQXVCLGFBQXZCLEVBQXNDLEtBQXRDLENBNUlBLENBQUE7QUFBQSxFQTZJQSxLQUFLLENBQUMsUUFBTixDQUFlLFdBQWYsRUFBNEIsU0FBNUIsRUFBdUMsS0FBdkMsQ0E3SUEsQ0FBQTtTQThJQSxNQWhKYTtBQUFBLENBbkJmLENBQUE7O0FBc0tBO0FBQUE7O0dBdEtBOztBQUFBLE1BeUtNLENBQUMsY0FBUCxDQUFzQixVQUF0QixFQUFrQyxhQUFsQyxFQUNFO0FBQUEsRUFBQSxLQUFBLEVBQU8sWUFBQSxDQUFBLENBQVA7Q0FERixDQXpLQSxDQUFBOztBQUFBLEVBNEtFLENBQUMsUUFBSCxDQUFZLFFBQVosRUFBc0IsVUFBdEIsQ0E1S0EsQ0FBQTs7QUFBQSxZQThLQSxHQUFlLEVBOUtmLENBQUE7O0FBK0tBLElBQUcsTUFBQSxDQUFBLFFBQUEsS0FBcUIsV0FBeEI7QUFDRSxFQUFBLFlBQUEsR0FBZSxRQUFmLENBREY7Q0EvS0E7O0FBQUEsRUFrTEUsQ0FBQyxRQUFILENBQVksVUFBWixFQUF3QixZQUF4QixDQWxMQSxDQUFBOztBQUFBLEVBb0xFLENBQUMsUUFBSCxDQUFZLE1BQVosRUFBb0IsU0FBQSxHQUFBLENBQXBCLENBcExBLENBQUE7O0FBQUEsTUFzTE0sQ0FBQyxPQUFQLEdBQWlCLEVBdExqQixDQUFBOzs7Ozs7O0FDQ0EsSUFBQSxvQkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE1BQVIsQ0FBTCxDQUFBOztBQUFBLENBQ0EsR0FBSSxPQUFBLENBQVEsUUFBUixDQURKLENBQUE7O0FBQUEsYUFLQSxHQUFnQixDQUNkLFFBRGMsRUFFZCxPQUZjLEVBR2QsWUFIYyxFQUlkLE9BSmMsRUFLZCxJQUxjLEVBTWQsWUFOYyxFQU9kLFVBUGMsRUFRZCxRQVJjLEVBU2QsZUFUYyxFQVVkLFNBVmMsRUFXZCxRQVhjLEVBWWQsT0FaYyxDQUxoQixDQUFBOztBQUFBLENBd0JDLENBQUMsSUFBRixDQUFPLGFBQVAsRUFBc0IsU0FBQyxJQUFELEdBQUE7U0FDcEIsRUFBRSxDQUFDLGdCQUFILENBQW9CLElBQXBCLEVBRG9CO0FBQUEsQ0FBdEIsQ0F4QkEsQ0FBQTs7QUFBQSxFQThCRyxDQUFBLHFCQUFBLENBQUgsR0FBNEIsS0E5QjVCLENBQUE7O0FBQUEsRUFnQ0csQ0FBQSxpQ0FBQSxDQUFILEdBQXdDLEtBaEN4QyxDQUFBOztBQUFBLEVBa0NHLENBQUEsZ0JBQUEsQ0FBSCxHQUF1QixLQWxDdkIsQ0FBQTs7QUFBQSxFQW9DRyxDQUFBLGNBQUEsQ0FBSCxHQUFxQixLQXBDckIsQ0FBQTs7QUFBQSxFQXNDRyxDQUFBLHFCQUFBLENBQUgsR0FBNEIsS0F0QzVCLENBQUE7Ozs7Ozs7QUNGQSxJQUFBLFdBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxPQUVBLEdBQVUsU0FBQyxVQUFELEVBQWEsU0FBYixHQUFBO0FBQ1IsTUFBQSx1Q0FBQTtBQUFBLEVBQUEsS0FBQSxHQUFRLEVBQVIsQ0FBQTtBQUFBLEVBQ0EsU0FBQSxHQUFZLENBRFosQ0FBQTtBQUFBLEVBRUEsUUFBQSxHQUFXLENBRlgsQ0FBQTtBQUFBLEVBSUEsR0FBQSxHQUNFO0FBQUEsSUFBQSxHQUFBLEVBQUssU0FBQyxLQUFELEVBQVEsS0FBUixHQUFBO2FBQ0gsTUFBQSxDQUFPLEtBQVAsRUFBYyxLQUFkLEVBREc7SUFBQSxDQUFMO0FBQUEsSUFFQSxHQUFBLEVBQUssU0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLEdBQWYsR0FBQTtBQUNILFVBQUEsY0FBQTtBQUFBLE1BQUEsR0FBRyxDQUFDLEdBQUosQ0FBUSxLQUFSLEVBQWUsS0FBZixDQUFBLENBQUE7QUFBQSxNQUNBLE1BQUEsR0FBUyxLQUFBLEdBQU0sQ0FEZixDQUFBO0FBQUEsTUFFQSxNQUFBLEdBQVMsS0FBQSxHQUFNLENBRmYsQ0FBQTthQUdBLEtBQU0sQ0FBQSxNQUFBLENBQVEsQ0FBQSxNQUFBLENBQWQsR0FBd0IsSUFKckI7SUFBQSxDQUZMO0FBQUEsSUFPQSxJQUFBLEVBQU0sU0FBQyxRQUFELEdBQUE7YUFDSixDQUFDLENBQUMsSUFBRixDQUFPLEtBQVAsRUFBYyxTQUFDLE9BQUQsRUFBVSxHQUFWLEdBQUE7ZUFDWixDQUFDLENBQUMsSUFBRixDQUFPLEtBQU0sQ0FBQSxHQUFBLENBQWIsRUFBbUIsU0FBQyxHQUFELEVBQU0sR0FBTixHQUFBO0FBQ2pCLGNBQUEsY0FBQTtBQUFBLFVBQUEsTUFBQSxHQUFTLEdBQUEsR0FBSSxDQUFiLENBQUE7QUFBQSxVQUNBLE1BQUEsR0FBUyxHQUFBLEdBQUksQ0FEYixDQUFBO2lCQUVBLFFBQUEsQ0FBUyxNQUFULEVBQWlCLE1BQWpCLEVBQXlCLEdBQXpCLEVBSGlCO1FBQUEsQ0FBbkIsRUFEWTtNQUFBLENBQWQsRUFESTtJQUFBLENBUE47QUFBQSxJQWFBLEtBQUEsRUFBTyxTQUFBLEdBQUE7YUFDTCxTQURLO0lBQUEsQ0FiUDtBQUFBLElBZUEsTUFBQSxFQUFRLFNBQUEsR0FBQTthQUNOLFVBRE07SUFBQSxDQWZSO0dBTEYsQ0FBQTtBQXVCQTtBQUFBOztLQXZCQTtBQUFBLEVBMEJBLE1BQUEsR0FBUyxTQUFDLE1BQUQsRUFBUyxLQUFULEdBQUE7QUFDUCxRQUFBLFNBQUE7QUFBQSxJQUFBLElBQUcsQ0FBQSxNQUFBLElBQWMsTUFBQSxHQUFTLENBQTFCO0FBQWlDLE1BQUEsTUFBQSxHQUFTLENBQVQsQ0FBakM7S0FBQTtBQUNBLElBQUEsSUFBRyxDQUFBLEtBQUEsSUFBYSxLQUFBLEdBQVEsQ0FBeEI7QUFBK0IsTUFBQSxLQUFBLEdBQVEsQ0FBUixDQUEvQjtLQURBO0FBR0EsSUFBQSxJQUFHLFNBQUEsR0FBWSxNQUFmO0FBQTJCLE1BQUEsU0FBQSxHQUFZLE1BQVosQ0FBM0I7S0FIQTtBQUlBLElBQUEsSUFBRyxLQUFLLENBQUMsTUFBTixHQUFlLFNBQWxCO0FBQWlDLE1BQUEsU0FBQSxHQUFZLEtBQUssQ0FBQyxNQUFsQixDQUFqQztLQUpBO0FBS0EsSUFBQSxJQUFHLFFBQUEsR0FBVyxLQUFkO0FBQXlCLE1BQUEsUUFBQSxHQUFXLEtBQVgsQ0FBekI7S0FMQTtBQUFBLElBTUEsQ0FBQSxHQUFJLENBTkosQ0FBQTtBQVFBLFdBQU0sQ0FBQSxHQUFJLFNBQVYsR0FBQTtBQUNFLE1BQUEsTUFBQSxHQUFTLEtBQU0sQ0FBQSxDQUFBLENBQWYsQ0FBQTtBQUNBLE1BQUEsSUFBRyxDQUFBLE1BQUg7QUFDRSxRQUFBLE1BQUEsR0FBUyxFQUFULENBQUE7QUFBQSxRQUNBLEtBQUssQ0FBQyxJQUFOLENBQVcsTUFBWCxDQURBLENBREY7T0FEQTtBQUlBLE1BQUEsSUFBRyxRQUFBLEdBQVcsTUFBTSxDQUFDLE1BQXJCO0FBQWlDLFFBQUEsUUFBQSxHQUFXLE1BQU0sQ0FBQyxNQUFsQixDQUFqQztPQUpBO0FBS0EsTUFBQSxJQUFHLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLFFBQW5CO0FBQWlDLFFBQUEsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsUUFBaEIsQ0FBakM7T0FMQTtBQUFBLE1BTUEsQ0FBQSxJQUFLLENBTkwsQ0FERjtJQUFBLENBUkE7V0FpQkEsS0FBTSxDQUFBLE1BQUEsR0FBTyxDQUFQLENBQVUsQ0FBQSxLQUFBLEdBQU0sQ0FBTixFQWxCVDtFQUFBLENBMUJULENBQUE7QUFBQSxFQThDQSxNQUFBLENBQU8sVUFBUCxFQUFtQixTQUFuQixDQTlDQSxDQUFBO1NBZ0RBLElBakRRO0FBQUEsQ0FGVixDQUFBOztBQUFBLEVBcURFLENBQUMsUUFBSCxDQUFZLFNBQVosRUFBdUIsT0FBdkIsQ0FyREEsQ0FBQTs7QUFBQSxNQXNETSxDQUFDLE9BQVAsR0FBaUIsT0F0RGpCLENBQUE7Ozs7O0FDQUEsSUFBQSxrQ0FBQTtFQUFBLGtCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsT0FFQSxHQUFVLENBQ1IsUUFEUSxFQUVSLE9BRlEsRUFHUixPQUhRLEVBSVIsT0FKUSxFQUtSLEtBTFEsRUFNUixRQU5RLEVBT1IsT0FQUSxFQVFSLFdBUlEsRUFTUixPQVRRLEVBVVIsZ0JBVlEsRUFXUixVQVhRLEVBWVIsTUFaUSxFQWFSLEtBYlEsRUFjUixRQWRRLEVBZVIsU0FmUSxFQWdCUixZQWhCUSxFQWlCUixPQWpCUSxFQWtCUixNQWxCUSxFQW1CUixTQW5CUSxFQW9CUixXQXBCUSxFQXFCUixVQXJCUSxFQXNCUixhQXRCUSxFQXVCUixPQXZCUSxFQXdCUixNQXhCUSxDQUZWLENBQUE7O0FBQUEsWUE0QkEsR0FBZSxPQUFPLENBQUMsTUE1QnZCLENBQUE7O0FBQUEsT0E2QkEsR0FBVSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQVYsSUFBcUIsRUE3Qi9CLENBQUE7O0FBQUEsRUE4QkUsQ0FBQyxnQkFBSCxDQUFvQixTQUFwQixDQTlCQSxDQUFBOztBQWdDQTtBQUFBOzs7R0FoQ0E7O0FBb0NBLE9BQU0sWUFBQSxFQUFOLEdBQUE7QUFDRSxFQUFBLENBQUMsU0FBQSxHQUFBO0FBQ0MsUUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVMsT0FBUSxDQUFBLFlBQUEsQ0FBakIsQ0FBQTtBQUdBLElBQUEsSUFBQSxDQUFBLE9BQXlDLENBQUEsTUFBQSxDQUF6QztBQUFBLE1BQUEsT0FBUSxDQUFBLE1BQUEsQ0FBUixHQUFrQixFQUFFLENBQUMsSUFBckIsQ0FBQTtLQUhBO1dBTUEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFYLENBQW9CLE1BQXBCLEVBQTRCLFNBQUEsR0FBQTtBQUMxQixVQUFBLE1BQUE7QUFBQSxNQUQyQixnRUFDM0IsQ0FBQTthQUFBLE9BQVEsQ0FBQSxNQUFBLENBQVIsZ0JBQWdCLE1BQWhCLEVBRDBCO0lBQUEsQ0FBNUIsRUFQRDtFQUFBLENBQUQsQ0FBQSxDQUFBLENBQUEsQ0FERjtBQUFBLENBcENBOztBQUFBLE1BZ0RNLENBQUMsT0FBUCxHQUFpQixPQWhEakIsQ0FBQTs7Ozs7QUNBQSxJQUFBLDBDQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBRUE7QUFBQTs7Ozs7Ozs7OztHQUZBOztBQWFBLElBQUcsQ0FBQSxDQUFBLElBQVMsQ0FBQSxDQUFLLENBQUMsTUFBbEI7QUFDRSxRQUFVLElBQUEsS0FBQSxDQUFNLHlDQUFOLENBQVYsQ0FERjtDQWJBOztBQUFBLENBZUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQWxCLEdBQTJCLEtBZjNCLENBQUE7O0FBQUEsT0FpQkEsR0FBVSxFQWpCVixDQUFBOztBQUFBLEdBbUJBLEdBQU0sU0FBQyxVQUFELEVBQWEsSUFBYixHQUFBO0FBQ0osTUFBQSxHQUFBO0FBQUEsRUFBQSxHQUFBLEdBQU0sRUFBTixDQUFBO0FBQ0EsRUFBQSxJQUFHLFVBQUg7QUFDRSxJQUFBLElBQUcsSUFBSDtBQUNFLE1BQUEsR0FBQSxHQUFNLENBQUMsQ0FBQyxNQUFGLENBQVMsVUFBVCxFQUFxQixJQUFyQixDQUFOLENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxHQUFBLEdBQU0sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxVQUFULENBQU4sQ0FIRjtLQUFBO0FBSUEsSUFBQSxJQUFHLEdBQUg7YUFDRSxPQUFRLENBQUEsVUFBQSxDQUFSLEdBQXNCLElBRHhCO0tBTEY7R0FGSTtBQUFBLENBbkJOLENBQUE7O0FBQUEsR0E2QkEsR0FBTSxTQUFBLEdBQUE7QUFDSixNQUFBLEdBQUE7QUFBQSxFQUFBLEdBQUEsR0FBTSxDQUFDLENBQUMsTUFBRixDQUFBLENBQU4sQ0FBQTtTQUNBLElBRkk7QUFBQSxDQTdCTixDQUFBOztBQUFBLEdBaUNBLEdBQU0sU0FBQyxVQUFELEVBQWEsS0FBYixFQUFvQixJQUFwQixHQUFBO0FBQ0osTUFBQSxHQUFBO0FBQUEsRUFBQSxHQUFBLEdBQU0sRUFBTixDQUFBO0FBQ0EsRUFBQSxJQUFHLFVBQUg7QUFDRSxJQUFBLE9BQVEsQ0FBQSxVQUFBLENBQVIsR0FBc0IsS0FBdEIsQ0FBQTtBQUNBLElBQUEsSUFBRyxJQUFIO0FBQ0UsTUFBQSxHQUFBLEdBQU0sQ0FBQyxDQUFDLE1BQUYsQ0FBUyxVQUFULEVBQXFCLEtBQXJCLEVBQTRCLElBQTVCLENBQU4sQ0FERjtLQUFBLE1BQUE7QUFHRSxNQUFBLEdBQUEsR0FBTSxDQUFDLENBQUMsTUFBRixDQUFTLFVBQVQsRUFBcUIsS0FBckIsQ0FBTixDQUhGO0tBRkY7R0FEQTtTQU9BLElBUkk7QUFBQSxDQWpDTixDQUFBOztBQUFBLEdBMkNBLEdBQU0sU0FBQyxVQUFELEVBQWEsSUFBYixHQUFBO0FBQ0osRUFBQSxJQUFHLFVBQUg7QUFDRSxJQUFBLElBQUcsSUFBSDtBQUNFLE1BQUEsQ0FBQyxDQUFDLFlBQUYsQ0FBZSxVQUFmLEVBQTJCLElBQTNCLENBQUEsQ0FERjtLQUFBLE1BQUE7QUFHRSxNQUFBLENBQUMsQ0FBQyxZQUFGLENBQWUsVUFBZixDQUFBLENBSEY7S0FBQTtBQUFBLElBSUEsTUFBQSxDQUFBLE9BQWUsQ0FBQSxVQUFBLENBSmYsQ0FERjtHQURJO0FBQUEsQ0EzQ04sQ0FBQTs7QUFBQSxTQW9EQSxHQUFZLFNBQUEsR0FBQTtBQUNWLEVBQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLEVBQ0EsRUFBRSxDQUFDLElBQUgsQ0FBUSxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQWxCLEVBQXVCLFNBQUMsR0FBRCxFQUFNLEdBQU4sR0FBQTtXQUNyQixFQUFFLENBQUMsTUFBTSxDQUFDLFFBQUQsQ0FBVCxDQUFpQixHQUFqQixFQURxQjtFQUFBLENBQXZCLENBREEsQ0FEVTtBQUFBLENBcERaLENBQUE7O0FBQUEsRUEwREcsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixXQUFuQixFQUFnQyxTQUFoQyxDQTFERCxDQUFBOztBQUFBLEVBMkRHLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsUUFBbkIsRUFBNkIsR0FBN0IsQ0EzREQsQ0FBQTs7QUFBQSxFQTRERyxDQUFDLE1BQU0sQ0FBQyxRQUFWLENBQW1CLEtBQW5CLEVBQTBCLEdBQTFCLENBNURELENBQUE7O0FBQUEsRUE2REcsQ0FBQyxNQUFNLENBQUMsUUFBVixDQUFtQixLQUFuQixFQUEwQixHQUExQixDQTdERCxDQUFBOztBQUFBLEVBOERHLENBQUMsTUFBTSxDQUFDLFFBQVYsQ0FBbUIsS0FBbkIsRUFBMkIsR0FBM0IsQ0E5REQsQ0FBQTs7QUFBQSxNQWdFTyxDQUFDLE9BQVAsR0FDQztBQUFBLEVBQUEsU0FBQSxFQUFXLFNBQVg7QUFBQSxFQUNBLFFBQUEsRUFBUSxHQURSO0FBQUEsRUFFQSxHQUFBLEVBQUssR0FGTDtBQUFBLEVBR0EsR0FBQSxFQUFLLEdBSEw7QUFBQSxFQUlBLEdBQUEsRUFBTSxHQUpOO0NBakVGLENBQUE7Ozs7O0FDQUEsSUFBQSxTQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsS0FFQSxHQUFRLFNBQUMsTUFBRCxFQUFTLE1BQVQsR0FBQTtBQUNOLEVBQUEsSUFBRyxVQUFIO0FBQ0UsV0FBTyxVQUFBLENBQVcsTUFBWCxFQUFtQixNQUFuQixDQUFQLENBREY7R0FETTtBQUFBLENBRlIsQ0FBQTs7QUFBQSxFQU1FLENBQUMsUUFBSCxDQUFZLE9BQVosRUFBcUIsS0FBckIsQ0FOQSxDQUFBOztBQUFBLE1BT00sQ0FBQyxPQUFQLEdBQWlCLEtBUGpCLENBQUE7Ozs7O0FDRUEsSUFBQSxpQkFBQTs7QUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLE9BQVIsQ0FBTCxDQUFBOztBQUFBLE9BR0EsR0FBVSxTQUFDLEdBQUQsR0FBQTtTQUVSLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBTixDQUFrQixHQUFsQixDQUFBLElBQTBCLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTixDQUFhLEdBQWIsQ0FBMUIsSUFBK0MsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFOLENBQVksR0FBWixFQUZ2QztBQUFBLENBSFYsQ0FBQTs7QUFBQSxJQWNBLEdBQU8sU0FBQyxHQUFELEVBQU0sTUFBTixFQUFjLFNBQWQsR0FBQTtBQUNMLEVBQUEsSUFBRyxPQUFBLENBQVEsR0FBUixDQUFIO0FBT0UsSUFBQSxDQUFDLENBQUMsTUFBRixDQUFTLEdBQVQsRUFBYyxTQUFDLEdBQUQsRUFBTSxHQUFOLEdBQUE7QUFDWixVQUFBLElBQUE7QUFBQSxNQUFBLElBQUcsTUFBQSxJQUFXLENBQUMsR0FBQSxJQUFPLEdBQVIsQ0FBZDtBQUNFLFFBQUEsSUFBQSxHQUFPLE1BQUEsQ0FBTyxHQUFQLEVBQVksR0FBWixDQUFQLENBQUE7QUFDQSxRQUFBLElBQWlCLEtBQUEsS0FBUyxJQUExQjtBQUFBLGlCQUFPLEtBQVAsQ0FBQTtTQUZGO09BQUE7QUFHQSxNQUFBLElBQTJCLElBQUEsS0FBUSxTQUFuQztBQUFBLFFBQUEsSUFBQSxDQUFLLEdBQUwsRUFBVSxNQUFWLEVBQWtCLElBQWxCLENBQUEsQ0FBQTtPQUpZO0lBQUEsQ0FBZCxDQUFBLENBUEY7R0FESztBQUFBLENBZFAsQ0FBQTs7QUFBQSxFQWtDRSxDQUFDLFFBQUgsQ0FBWSxNQUFaLEVBQW9CLElBQXBCLENBbENBLENBQUE7O0FBQUEsTUFtQ00sQ0FBQyxPQUFQLEdBQWlCLElBbkNqQixDQUFBOzs7OztBQ0ZBLElBQUEsdUJBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxPQUVBLEdBQVUsU0FGVixDQUFBOztBQUFBLFVBSUEsR0FDRTtBQUFBLEVBQUEsTUFBQSxFQUNFO0FBQUEsSUFBQSxFQUFBLEVBQUksQ0FBSjtBQUFBLElBQ0EsSUFBQSxFQUFNLFFBRE47QUFBQSxJQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsSUFHQSxZQUFBLEVBQWMsS0FIZDtBQUFBLElBSUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsT0FBQSxFQUFTLElBRFQ7S0FMRjtBQUFBLElBUUEsWUFBQSxFQUFjLEVBUmQ7QUFBQSxJQVNBLFdBQUEsRUFBYSxJQVRiO0dBREY7QUFBQSxFQVlBLFFBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLENBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxVQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQWJGO0FBQUEsRUF3QkEsS0FBQSxFQUNFO0FBQUEsSUFBQSxFQUFBLEVBQUksQ0FBSjtBQUFBLElBQ0EsSUFBQSxFQUFNLE9BRE47QUFBQSxJQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsSUFHQSxZQUFBLEVBQWMsSUFIZDtBQUFBLElBSUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsT0FBQSxFQUFTLElBRFQ7S0FMRjtBQUFBLElBUUEsWUFBQSxFQUFjLEVBUmQ7QUFBQSxJQVNBLFdBQUEsRUFBYSxJQVRiO0dBekJGO0FBQUEsRUFvQ0EsSUFBQSxFQUNFO0FBQUEsSUFBQSxFQUFBLEVBQUksQ0FBSjtBQUFBLElBQ0EsSUFBQSxFQUFNLE1BRE47QUFBQSxJQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsSUFHQSxZQUFBLEVBQWMsSUFIZDtBQUFBLElBSUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsT0FBQSxFQUFTLElBRFQ7S0FMRjtBQUFBLElBUUEsWUFBQSxFQUFjLE9BUmQ7QUFBQSxJQVNBLFdBQUEsRUFBYSxJQVRiO0dBckNGO0FBQUEsRUFnREEsUUFBQSxFQUNFO0FBQUEsSUFBQSxFQUFBLEVBQUksQ0FBSjtBQUFBLElBQ0EsSUFBQSxFQUFNLFVBRE47QUFBQSxJQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsSUFHQSxZQUFBLEVBQWMsS0FIZDtBQUFBLElBSUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsT0FBQSxFQUFTLElBRFQ7S0FMRjtBQUFBLElBUUEsWUFBQSxFQUFjLE9BUmQ7QUFBQSxJQVNBLFdBQUEsRUFBYSxJQVRiO0dBakRGO0FBQUEsRUE0REEsZ0JBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLENBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxnQkFETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsT0FSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0E3REY7QUFBQSxFQXdFQSxLQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxDQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLElBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxJQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsT0FSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0F6RUY7QUFBQSxFQW9GQSxJQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxDQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sTUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsS0FEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0FyRkY7QUFBQSxFQWdHQSxNQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxDQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0FqR0Y7QUFBQSxFQTRHQSxLQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxDQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0E3R0Y7QUFBQSxFQXdIQSxLQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sT0FETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsRUFSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0F6SEY7QUFBQSxFQW9JQSxNQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sUUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLEtBRmI7QUFBQSxJQUdBLFlBQUEsRUFBYyxLQUhkO0FBQUEsSUFJQSxLQUFBLEVBQ0U7QUFBQSxNQUFBLFFBQUEsRUFBVSxLQUFWO0FBQUEsTUFDQSxPQUFBLEVBQVMsSUFEVDtLQUxGO0FBQUEsSUFRQSxZQUFBLEVBQWMsT0FSZDtBQUFBLElBU0EsV0FBQSxFQUFhLElBVGI7R0FySUY7QUFBQSxFQWdKQSxRQUFBLEVBQ0U7QUFBQSxJQUFBLEVBQUEsRUFBSSxFQUFKO0FBQUEsSUFDQSxJQUFBLEVBQU0sVUFETjtBQUFBLElBRUEsV0FBQSxFQUFhLElBRmI7QUFBQSxJQUdBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBSkY7QUFBQSxJQU9BLFlBQUEsRUFBYyxPQVBkO0FBQUEsSUFRQSxXQUFBLEVBQWEsSUFSYjtHQWpKRjtBQUFBLEVBMkpBLEtBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLElBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQTVKRjtBQUFBLEVBdUtBLEtBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQXhLRjtBQUFBLEVBbUxBLEtBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQXBMRjtBQUFBLEVBK0xBLE1BQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsSUFGYjtBQUFBLElBR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQWhNRjtBQUFBLEVBMk1BLE1BQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQTVNRjtBQUFBLEVBdU5BLEdBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsSUFGYjtBQUFBLElBR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQXhORjtBQUFBLEVBbU9BLElBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxNQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsSUFGYjtBQUFBLElBR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxPQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQXBPRjtBQUFBLEVBK09BLElBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxNQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxPQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQWhQRjtBQUFBLEVBMlBBLEdBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxLQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsSUFGYjtBQUFBLElBR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxPQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQTVQRjtBQUFBLEVBdVFBLElBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxNQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFB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QUFBLEVBUUEsQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLEdBUlIsQ0FBQTtBQUFBLEVBU0EsQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLFNBQVMsQ0FBQyxNQUFWLENBQWlCLENBQUMsQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLEdBQVQsQ0FBQSxHQUFnQixHQUFqQyxFQUFzQyxDQUF0QyxDQVRSLENBQUE7QUFBQSxFQVVBLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTyxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxHQVYvQixDQUFBO0FBQUEsRUFXQSxJQUFBLEdBQU8sQ0FBQyxDQUFDLElBQUYsQ0FBTyxFQUFQLENBWFAsQ0FBQTtTQVlBLEtBaEJlO0FBQUEsQ0FQakIsQ0FBQTs7QUFBQSxFQXlCRSxDQUFDLFFBQUgsQ0FBWSxZQUFaLEVBQTBCLGNBQTFCLENBekJBLENBQUE7O0FBQUEsTUEwQk0sQ0FBQyxPQUFQLEdBQWlCLGNBMUJqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUgJy4vb2ouY29mZmVlJ1xucmVxdWlyZSAnLi9vakluaXQuY29mZmVlJ1xucmVxdWlyZSAnLi9hc3luYy9hamF4LmNvZmZlZSdcbnJlcXVpcmUgJy4vYXN5bmMvcHJvbWlzZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvZ3JpZC5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvaW5wdXRncm91cC5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvdGFicy5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvdGlsZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvbnRyb2xzL2ljb24uY29mZmVlJ1xucmVxdWlyZSAnLi9jb3JlL2RhdGUuY29mZmVlJ1xucmVxdWlyZSAnLi9jb3JlL2Z1bmN0aW9uLmNvZmZlZSdcbnJlcXVpcmUgJy4vY29yZS9udW1iZXIuY29mZmVlJ1xucmVxdWlyZSAnLi9jb3JlL29iamVjdC5jb2ZmZWUnXG5yZXF1aXJlICcuL2NvcmUvc3RyaW5nLmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2JvZHkuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vY29tcG9uZW50LmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2NvbnRyb2wuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vZG9tLmNvZmZlZSdcbnJlcXVpcmUgJy4vZG9tL2VsZW1lbnQuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vZnJhZ21lbnQuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vZ2VuZXJpY3MuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vaW5wdXQuY29mZmVlJ1xucmVxdWlyZSAnLi9kb20vbm9kZUZhY3RvcnkuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy9hLmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvYnIuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy9mb3JtLmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvaW5wdXQuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy9vbC5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL3NlbGVjdC5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RhYmxlLmNvZmZlZSdcbnJlcXVpcmUgJy4vZWxlbWVudHMvdGV4dGFyZWEuY29mZmVlJ1xucmVxdWlyZSAnLi9lbGVtZW50cy90aGVhZC5jb2ZmZWUnXG5yZXF1aXJlICcuL2VsZW1lbnRzL3VsLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2J1dHRvbmlucHV0LmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2NoZWNrYm94LmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2NvbG9yLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2RhdGUuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZXRpbWUuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvZGF0ZXRpbWVsb2NhbC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9lbWFpbC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9maWxlLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL2hpZGRlbi5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9pbWFnZWlucHV0LmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL21vbnRoLmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL251bWJlci5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9wYXNzd29yZC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9yYWRpby5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9yYW5nZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9yZXNldC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy9zZWFyY2guY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvc3VibWl0LmNvZmZlZSdcbnJlcXVpcmUgJy4vaW5wdXRzL3RlbC5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy90ZXh0aW5wdXQuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvdGltZS5jb2ZmZWUnXG5yZXF1aXJlICcuL2lucHV0cy91cmwuY29mZmVlJ1xucmVxdWlyZSAnLi9pbnB1dHMvd2Vlay5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2FycmF5MkQuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9jb25zb2xlLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvY29va2llLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvZGVmZXIuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9lYWNoLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvZW51bXMuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9lcnJvci5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL2hpc3RvcnkuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9pcy5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL25vdHkuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9wdWJzdWIuY29mZmVlJ1xucmVxdWlyZSAnLi90b29scy9xdWVyeVN0cmluZy5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL3Jhbmdlcy5jb2ZmZWUnXG5yZXF1aXJlICcuL3Rvb2xzL3RvLmNvZmZlZSdcbnJlcXVpcmUgJy4vdG9vbHMvdXVpZC5jb2ZmZWUnIiwiIyAjIGFqYXhcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG5jb25maWcgPSB7fVxyXG4gIFxyXG4jIGRlZmluZSBhIHN0YW5kYXJkIG9uIHN1Y2Nlc3MgaGFuZGxlciwgd3JpdGUgb3V0IHRoZSByZXF1ZXN0IHN0YXRzIHRvIGEgdGFibGVcclxuY29uZmlnLm9uU3VjY2VzcyA9IChvcHRzLCBkYXRhLCB1cmwpIC0+XHJcbiAgcmVzcG9uc2UgPSB7fVxyXG4gIE9KLmV4dGVuZCByZXNwb25zZSwgZGF0YVxyXG4gIG9wdHMub25TdWNjZXNzIHJlc3BvbnNlXHJcbiAgaWYgT0ouTE9HX0FMTF9BSkFYXHJcbiAgICBPSi5jb25zb2xlLnRhYmxlIFtcclxuICAgICAgV2Vic2VydmljZTogb3B0cy5hamF4T3B0cy51cmxcclxuICAgICAgU3RhcnRUaW1lOiBvcHRzLnN0YXJ0VGltZVxyXG4gICAgICBFbmRUaW1lOiBuZXcgRGF0ZSgpXHJcbiAgICBdIFxyXG4gIHJldHVyblxyXG4gIFxyXG4jIGRlZmluZSBhIHN0YW5kYXJkIG9uIGVycm9yIGhhbmRsZXIsIHdyaXRlIG91dCB0aGUgcmVxdWVzdCBlcnJvciBjb25leHQgdG8gYSB0YWJsZVxyXG5jb25maWcub25FcnJvciA9ICh4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cywgcGFyYW0xLCBvcHRzID0gT0oub2JqZWN0KCkpIC0+XHJcbiAgaWYgdGV4dFN0YXR1cyBpc250ICdhYm9ydCdcclxuICAgIGlmIE9KLkxPR19BTExfQUpBWF9FUlJPUlNcclxuICAgICAgT0ouY29uc29sZS50YWJsZSBbXHJcbiAgICAgICAgV2Vic2VydmljZTogb3B0cy5hamF4T3B0cy51cmxcclxuICAgICAgICBEYXRhOiBvcHRzLmFqYXhPcHRzLmRhdGFcclxuICAgICAgICBGYWlsZWQ6IHRleHRTdGF0dXNcclxuICAgICAgICBTdGF0ZTogeG1sSHR0cFJlcXVlc3Quc3RhdGUoKVxyXG4gICAgICAgIFN0YXR1czogeG1sSHR0cFJlcXVlc3Quc3RhdHVzXHJcbiAgICAgICAgU3RhdHVzVGV4dDogeG1sSHR0cFJlcXVlc3Quc3RhdHVzVGV4dFxyXG4gICAgICAgIFJlYWR5U3RhdGU6IHhtbEh0dHBSZXF1ZXN0LnJlYWR5U3RhdGVcclxuICAgICAgICBSZXNwb25zZVRleHQ6IHhtbEh0dHBSZXF1ZXN0LnJlc3BvbnNlVGV4dFxyXG4gICAgICBdXHJcblxyXG4gICAgb3B0cy5vbkVycm9yIHRleHRTdGF0dXNcclxuICByZXR1cm5cclxuICBcclxuIyBpbiB0aGUgY2FzZSB3aGVyZSBgb3B0c2AgaXMgYSBzdHJpbmcsIGNvbnZlcnQgaXQgdG8gYW4gb2JqZWN0XHJcbm9wdHNGcm9tVXJsID0gKG9wdHMpIC0+XHJcbiAgaWYgT0ouaXMuc3RyaW5nIG9wdHNcclxuICAgIHVybCA9IG9wdHNcclxuICAgIG9wdHMgPSBPSi5vYmplY3QoKVxyXG4gICAgb3B0cy5hZGQgJ2FqYXhPcHRzJywgT0oub2JqZWN0KClcclxuICAgIG9wdHMuYWpheE9wdHMuYWRkICd1cmwnLCB1cmxcclxuICBvcHRzXHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgYGV4ZWNgIG1ldGhvZCB0byBoYW5kbGUgYWxsIHJlcXVlc3QgdmVyYnMuIFVzZXMgdGhlIFtqUXVlcnkuYWpheF0oaHR0cDovL2FwaS5qcXVlcnkuY29tL2NhdGVnb3J5L2FqYXgvKSBBUEkuXHJcbiMgYGV4ZWNSZXF1ZXN0YCByZXR1cm5zIGEgcHJvbWlzZSByZXByZXNlbnQgdGhlIGFjdHVhbCBBSkFYIGNhbGwuXHJcbiAgXHJcbiMgLSBgdmVyYmAgZGVmYXVsdCB2YWx1ZSA9ICdHRVQnXHJcbiMgLSBgb3B0c2Agb2JqZWN0XHJcbiMgLS0gYG9wdHMuYWpheE9wdHNgIG9iamVjdCBmb3IgYWxsIGpRdWVyeSdzIGFqYXgtc3BlY2lmaWMgcHJvcGVydGllcy5cclxuY29uZmlnLmV4ZWNSZXF1ZXN0ID0gKHZlcmIgPSAnR0VUJywgb3B0cykgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBhamF4T3B0czpcclxuICAgICAgdXJsOiAnJ1xyXG4gICAgICBkYXRhOiB7fVxyXG4gICAgICB0eXBlOiB2ZXJiXHJcbiAgICAgIHhockZpZWxkczpcclxuICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcclxuICAgICAgZGF0YVR5cGU6ICdqc29uJ1xyXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXHJcbiAgICAgICAgXHJcbiAgICBvblN1Y2Nlc3M6IE9KLm5vb3BcclxuICAgIG9uRXJyb3I6IE9KLm5vb3BcclxuICAgIG9uQ29tcGxldGU6IE9KLm5vb3BcclxuICAgIG92ZXJyaWRlRXJyb3I6IGZhbHNlXHJcbiAgICB3YXRjaEdsb2JhbDogdHJ1ZVxyXG4gICAgdXNlQ2FjaGU6IGZhbHNlXHJcbiAgICBcclxuICBvcHRzID0gb3B0c0Zyb21Vcmwgb3B0c1xyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0cywgdHJ1ZVxyXG4gICAgXHJcbiAgZGVmYXVsdHMuc3RhcnRUaW1lID0gbmV3IERhdGUoKVxyXG4gICAgXHJcbiAgaWYgZmFsc2UgaXMgT0ouaXMubnVsbE9yRW1wdHkgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgIyBHRVQgcmVxdWVzdHMgZXhwZWN0IHF1ZXJ5U3RyaW5nIHBhcmFtZXRlcnNcclxuICAgIGlmIGRlZmF1bHRzLmFqYXhPcHRzLnZlcmIgaXMgJ0dFVCdcclxuICAgICAgZGVmYXVsdHMuYWpheE9wdHMuZGF0YSA9IE9KLnBhcmFtcyBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXHJcbiAgICAjIGFsbCBvdGhlciByZXF1ZXN0cyB0YWtlIGFuIG9iamVjdFxyXG4gICAgZWxzZVxyXG4gICAgICBkZWZhdWx0cy5hamF4T3B0cy5kYXRhID0gT0ouc2VyaWFsaXplIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcclxuICAgIFxyXG4gIGdldEpRdWVyeURlZmVycmVkID0gKHdhdGNoR2xvYmFsKSAtPlxyXG4gICAgcmV0ID0gJC5hamF4IGRlZmF1bHRzLmFqYXhPcHRzXHJcbiAgICAgIFxyXG4gICAgcmV0LmRvbmUgKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSAtPlxyXG4gICAgICBjb25maWcub25TdWNjZXNzIGRlZmF1bHRzLCBkYXRhXHJcblxyXG4gICAgcmV0LmZhaWwgKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRleHQpIC0+XHJcbiAgICAgIGNvbmZpZy5vbkVycm9yIGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRleHQsIGRlZmF1bHRzXHJcbiAgXHJcbiAgICByZXQuYWx3YXlzICh4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1cykgLT5cclxuICAgICAgZGVmYXVsdHMub25Db21wbGV0ZSB4bWxIdHRwUmVxdWVzdCwgdGV4dFN0YXR1c1xyXG5cclxuICAgIE9KLmFzeW5jLmFqYXhQcm9taXNlIHJldFxyXG5cclxuICBwcm9taXNlID0gZ2V0SlF1ZXJ5RGVmZXJyZWQoZGVmYXVsdHMud2F0Y2hHbG9iYWwpXHJcbiAgcHJvbWlzZVxyXG4gIFxyXG5hamF4ID0ge31cclxuICBcclxuIyAjIyBwb3N0XHJcbiMgW09KXShvai5odG1sKS5hamF4LnBvc3Q6IGluc2VydCBhIG5ldyBvYmplY3Qgb3IgaW5pdCBhIGZvcm0gcG9zdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuIFxyXG5hamF4LnBvc3QgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ1BPU1QnLCBvcHRzXHJcbiAgXHJcbiMgIyMgZ2V0XHJcbiMgW09KXShvai5odG1sKS5hamF4LmdldDogZ2V0IGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbiNcclxuYWpheC5nZXQgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ0dFVCcsIG9wdHNcclxuXHJcbiMgIyMgZGVsZXRlXHJcbiMgW09KXShvai5odG1sKS5hamF4LmRlbGV0ZTogZGVsZXRlIGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbmFqYXguZGVsZXRlID0gKG9wdHMpIC0+XHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdERUxFVEUnLCBvcHRzXHJcblxyXG4jICMjIHB1dFxyXG4jIFtPSl0ob2ouaHRtbCkuYWpheC5wdXQ6IHVwZGF0ZSBhbiBleGlzdGluZyBvYmplY3RcclxuICBcclxuIyAtIGBvcHRzYCBjYW4gYmUgYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29uZmlndXJhdGlvbiBvZiB0aGUgcmVxdWVzdC5cclxuIyAtIGBvcHRzYCBjYW4gYWxzbyBiZSBhIHN0cmluZywgcmVwcmVzZW50aW5nIHRoZSBVUkwgdG8gaGl0LlxyXG5hamF4LnB1dCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnUFVUJywgb3B0c1xyXG5cclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2FqYXgnLCBhamF4XHJcbm1vZHVsZS5leHBvcnRzID0gYWpheCIsIiMgIyBwcm9taXNlXHJcblxyXG5PSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuIyAjIyBhamF4UHJvbWlzZVxyXG4jIFtPSl0ob2ouaHRtbCkuYXN5bmMuYWpheFByb21pc2UgY29udmVydHMgYW4gQUpBWCBYbWxIdHRwUmVxdWVzdCBpbnRvIGEgUHJvbWlzZS4gXHJcbiMgU2VlIGFsc28gW1Byb21pc2UucmVzb2x2ZV0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG5hamF4UHJvbWlzZSA9IChhamF4KSAtPiBcclxuICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlIGFqYXhcclxuICBwcm9taXNlLmFib3J0ID0gYWpheC5hYm9ydFxyXG4gIHByb21pc2UucmVhZHlTdGF0ZSA9IGFqYXgucmVhZHlTdGF0ZVxyXG4gIHByb21pc2VcclxuXHJcbiMgIyMgYWxsXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5hbGwgdGFrZXMgYW4gYXJyYXkgb2YgZnVuY3Rpb25zIGFuZCByZXR1cm5zIGEgcHJvbWlzZSByZXByZXNlbnRpbmcgdGhlIHN1Y2Nlc3Mgb2YgYWxsIG1ldGhvZHMgb3IgdGhlIGZhaWx1cmUgb2YgYW55IG1ldGhvZC5cclxuIyBTZWUgYWxzbyBbUHJvbWlzZS5hbGxdKGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvYmx1ZWJpcmQvYmxvYi9tYXN0ZXIvQVBJLm1kKS5cclxuYWxsID0gKGluaXRBcnJheSkgLT5cclxuICByZXFzID0gaW5pdEFycmF5IG9yIFtdXHJcbiAgcHJvbWlzZSA9IFByb21pc2UuYWxsKHJlcXMpXHJcbiAgcHJvbWlzZS5wdXNoID0gKGl0ZW0pIC0+XHJcbiAgICByZXFzLnB1c2ggaXRlbVxyXG4gICAgcmV0dXJuXHJcbiAgcHJvbWlzZVxyXG5cclxuIyAjIyBkZWZlclxyXG4jIFtPSl0ob2ouaHRtbCkuYXN5bmMuZGVmZXIgY29udmVydHMgYSBmdW5jdGlvbiBpbnRvIGEgUHJvbWlzZSB0byBleGVjdXRlIHRoYXQgZnVuY3Rpb24uIFxyXG4jIFNlZSBhbHNvIFtQcm9taXNlLm1ldGhvZF0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG5kZWZyID0gKGZ1bmMgPSBPSi5ub29wKSAtPlxyXG4gIHJldCA9IFByb21pc2UubWV0aG9kIGZ1bmNcclxuICByZXRcclxuICBcclxuICBcclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2RlZmVyJywgZGVmclxyXG5PSi5hc3luYy5yZWdpc3RlciAnYWxsJywgYWxsXHJcbk9KLmFzeW5jLnJlZ2lzdGVyICdhamF4UHJvbWlzZScsIGFqYXhQcm9taXNlXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9XHJcbiAgZGVmZXI6IGRlZnJcclxuICBhbGw6IGFsbFxyXG4gIGFqYXhQcm9taXNlOiBhamF4UHJvbWlzZVxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vb2pJbml0J1xuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcbmFycmF5MkQgPSByZXF1aXJlICcuLi90b29scy9hcnJheTJEJ1xuXG5ub2RlTmFtZSA9ICd4LWdyaWQnXG5jbGFzc05hbWUgPSAnZ3JpZCdcbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcblxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XG4gIGRlZmF1bHRzID1cbiAgICB0aWxlU2l6ZXM6XG4gICAgICBzbWFsbFNwYW46ICcnXG4gICAgICBtZWRpdW1TcGFuOiAnJ1xuICAgICAgbGFyZ2VTcGFuOiAnJ1xuICAgIHByb3BzOlxuICAgICAgY2xhc3M6ICdncmlkJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuXG4gIHJvd3MgPSBbXVxuICB0aWxlcyA9IGFycmF5MkQoKVxuXG4gIGZpbGxNaXNzaW5nID0gKCkgLT5cbiAgICB0aWxlcy5lYWNoIChyb3dObywgY29sTm8sIHZhbCkgLT5cbiAgICAgIGlmIG5vdCB2YWxcbiAgICAgICAgcm93ID0gcmV0LnJvdyByb3dOb1xuICAgICAgICByb3cubWFrZSAndGlsZScsIGNvbE5vLCB7fVxuXG4gIHJldC5hZGQgJ3JvdycsIChyb3dObyA9IHJvd3MubGVuZ3RoLTEgb3IgMSktPlxuICAgIG51Um93ID0gcm93c1tyb3dOby0xXVxuICAgIGlmIG5vdCBudVJvd1xuICAgICAgd2hpbGUgcm93cy5sZW5ndGggPCByb3dOb1xuICAgICAgICBudVJvdyA9IHJldC5tYWtlICdkaXYnLCBwcm9wczogY2xhc3M6ICdyb3cnXG4gICAgICAgIHJvd3MucHVzaCBudVJvd1xuICAgICAgbnVSb3cuYWRkICd0aWxlJywgKGNvbE5vLCBvcHRzKSAtPlxuICAgICAgICBvcHRzID0gT0ouZXh0ZW5kIChPSi5leHRlbmQge30sIGRlZmF1bHRzLnRpbGVTaXplcyksIG9wdHNcbiAgICAgICAgbnVUaWxlID0gT0ouY29tcG9uZW50cy50aWxlIG9wdHMsIG51Um93XG4gICAgICAgIHRpbGVzLnNldCByb3dObywgY29sTm8sIG51VGlsZVxuICAgICAgICBudVRpbGVcbiAgICBudVJvd1xuXG4gIHJldC5hZGQgJ3RpbGUnLCAocm93Tm8sIGNvbE5vLCBvcHRzKSAtPlxuICAgIGlmIG5vdCByb3dObyBvciByb3dObyA8IDEgdGhlbiByb3dObyA9IDFcbiAgICBpZiBub3QgY29sTm8gb3IgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXG5cbiAgICByb3cgPSByZXQucm93IHJvd05vXG4gICAgdGlsZSA9IHRpbGVzLmdldCByb3dObywgY29sTm9cblxuICAgIGlmIG5vdCB0aWxlXG4gICAgICBpID0gMFxuICAgICAgd2hpbGUgaSA8IGNvbE5vXG4gICAgICAgIGkgKz0gMVxuICAgICAgICB0cnlUaWxlID0gdGlsZXMuZ2V0IHJvd05vLCBpXG4gICAgICAgIGlmIG5vdCB0cnlUaWxlXG4gICAgICAgICAgaWYgaSBpcyBjb2xOb1xuICAgICAgICAgICAgdGlsZSA9IHJvdy5tYWtlICd0aWxlJywgb3B0c1xuICAgICAgICAgIGVsc2UgaWYgbm90IHRpbGVcbiAgICAgICAgICAgIHJvdy5tYWtlICd0aWxlJ1xuXG4gICAgZmlsbE1pc3NpbmcoKVxuICAgIHRpbGVcblxuICByZXRcblxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbXBvbmVudCA9IHJlcXVpcmUgJy4uL2RvbS9jb21wb25lbnQnXG51dWlkID0gcmVxdWlyZSAnLi4vdG9vbHMvdXVpZCdcblxubm9kZU5hbWUgPSAneC1pbnB1dC1ncm91cCdcbmNsYXNzTmFtZSA9ICdpbnB1dGdyb3VwJ1xuXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXG5cbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBmb3JJZCA9IHV1aWQoKVxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJ2Zvcm0tZ3JvdXAnXG4gICAgZXZlbnRzOlxuICAgICAgY2hhbmdlOiBPSi5ub29wXG4gICAgZm9yOiBmb3JJZFxuICAgIGxhYmVsVGV4dDogJydcbiAgICBpbnB1dE9wdHM6XG4gICAgICBwcm9wczpcbiAgICAgICAgaWQ6IGZvcklkXG4gICAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgICBjbGFzczogJydcbiAgICAgICAgcGxhY2Vob2xkZXI6ICcnXG4gICAgICAgIHZhbHVlOiAnJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuXG4gIGdyb3VwID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ2Zvcm0tZ3JvdXAnXG5cbiAgcmV0Lmdyb3VwTGFiZWwgPSBncm91cC5tYWtlICdsYWJlbCcsIHByb3BzOiB7IGZvcjogZm9ySWQgfSwgdGV4dDogZGVmYXVsdHMubGFiZWxUZXh0XG5cbiAgZGVmYXVsdHMuaW5wdXRPcHRzLnByb3BzLmNsYXNzICs9ICcgZm9ybS1jb250cm9sJ1xuICByZXQuZ3JvdXBJbnB1dCA9IGdyb3VwLm1ha2UgJ2lucHV0JywgZGVmYXVsdHMuaW5wdXRPcHRzXG5cbiAgcmV0Lmdyb3VwVmFsdWUgPSAoKSAtPlxuICAgIHJldC5ncm91cElucHV0LnZhbCgpXG5cbiAgcmV0XG5cbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xuXG5ub2RlTmFtZSA9ICd4LXRhYnMnXG5jbGFzc05hbWUgPSAndGFicydcblxuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxuXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cbiAgZGVmYXVsdHMgPVxuICAgIHRhYnM6IHt9XG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJydcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgcmV0ID0gY29tcG9uZW50IGRlZmF1bHRzLCBvd25lciwgbm9kZU5hbWVcblxuICB0YWJzID0gcmV0Lm1ha2UgJ3VsJywgcHJvcHM6IGNsYXNzOiAnbmF2IG5hdi10YWJzJ1xuICBjb250ZW50ID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ3RhYi1jb250ZW50J1xuXG4gIGZpcnN0ID0gdHJ1ZVxuICBPSi5lYWNoIGRlZmF1bHRzLnRhYnMsICh0YWJWYWwsIHRhYk5hbWUpIC0+XG4gICAgdGFiQ2xhc3MgPSAnJ1xuICAgIGlmIGZpcnN0XG4gICAgICBmaXJzdCA9IGZhbHNlXG4gICAgICB0YWJDbGFzcyA9ICdhY3RpdmUnXG4gICAgYSA9IHRhYnMubWFrZSAnbGknLCBwcm9wczogY2xhc3M6IHRhYkNsYXNzXG4gICAgICAubWFrZSgnYScsXG4gICAgICAgIHRleHQ6IHRhYk5hbWVcbiAgICAgICAgcHJvcHM6XG4gICAgICAgICAgaHJlZjogJyMnICsgdGFiTmFtZVxuICAgICAgICAgICdkYXRhLXRvZ2dsZSc6ICd0YWInXG4gICAgICAgIGV2ZW50czpcbiAgICAgICAgICBjbGljazogLT5cbiAgICAgICAgICAgIGEuJC50YWIgJ3Nob3cnKVxuXG4gICAgdGFiQ29udGVudENsYXNzID0gJ3RhYi1wYW5lICcgKyB0YWJDbGFzc1xuICAgIHJldC5hZGQgdGFiTmFtZSwgY29udGVudC5tYWtlKCdkaXYnLCBwcm9wczogY2xhc3M6IHRhYkNvbnRlbnRDbGFzcywgaWQ6IHRhYk5hbWUpXG5cbiAgcmV0XG5cbk9KLmNvbXBvbmVudHMucmVnaXN0ZXIgY2xhc3NOYW1lLCBjbXBudFxubW9kdWxlLmV4cG9ydHMgPSBjbXBudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xuXG5ub2RlTmFtZSA9ICd4LXRpbGUnXG5jbGFzc05hbWUgPSAndGlsZSdcblxuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxuICBcbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBkZWZhdWx0cyA9XG4gICAgd2lkdGg6XG4gICAgICB4czogJydcbiAgICAgIHNtOiAnJ1xuICAgICAgbWQ6ICcnXG4gICAgICBsZzogJydcbiAgICBwcm9wczpcbiAgICAgIGNsYXNzOiAndGlsZSdcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgaWYgZGVmYXVsdHMud2lkdGgueHMgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC14cy0nICsgZGVmYXVsdHMud2lkdGgueHNcbiAgaWYgZGVmYXVsdHMud2lkdGguc20gdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1zbS0nICsgZGVmYXVsdHMud2lkdGguc21cbiAgaWYgZGVmYXVsdHMud2lkdGgubWQgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1tZC0nICsgZGVmYXVsdHMud2lkdGgubWRcbiAgaWYgZGVmYXVsdHMud2lkdGgubGcgdGhlbiBkZWZhdWx0cy5wcm9wcy5jbGFzcyArPSAnIGNvbC1sZy0nICsgZGVmYXVsdHMud2lkdGgubGdcblxuICByZXQgPSBPSi5jb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuICByZXRcblxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbnRyb2wgPSByZXF1aXJlICcuLi9kb20vY29udHJvbCdcblxuY29udHJvbE5hbWUgPSAneS1pY29uJ1xuZnJpZW5kbHlOYW1lID0gJ2ljb24nXG5cbk9KLmNvbnRyb2xzLm1lbWJlcnNbZnJpZW5kbHlOYW1lXSA9IGNvbnRyb2xOYW1lXG5cbmNudHJsID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBkZWZhdWx0cyA9XG4gICAgaWNvbk9wdHM6XG4gICAgICBuYW1lOiAnJ1xuICAgICAgc3RhY2tlZEljb246ICcnXG4gICAgICBzd2FwSWNvbjogJydcbiAgICAgIHNpemU6IGZhbHNlXG4gICAgICBjb2xvcjogJydcbiAgICAgIGxpYnJhcnk6ICcnXG4gICAgICBpc0ZpeGVkV2lkdGg6IGZhbHNlXG4gICAgICBpc0xpc3Q6IGZhbHNlXG4gICAgICBpc1NwaW5uZXI6IGZhbHNlXG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJydcbiAgICByb290Tm9kZVR5cGU6ICdzcGFuJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9uc1xuICByZXQgPSBjb250cm9sIGRlZmF1bHRzLCBvd25lciwgY29udHJvbE5hbWVcblxuICBpc1RvZ2dsZWQgPSBmYWxzZVxuXG4gICNUT0RPOiBTdXBwb3J0IGZvciBwaWN0b2ljb25zXG4gICNUT0RPOiBTdXBwb3J0IGZvciBvdGhlciBGb250QXdlc29tZSBwcm9wZXJ0aWVzIChzdGFjaywgcm90YXRlLCBzaXplLCBldGMpXG5cbiAgY2xhc3NOYW1lQmFzZSA9ICdmYSAnXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzRml4ZWRXaWR0aCB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLWZ3ICdcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuaXNMaXN0IHRoZW4gY2xhc3NOYW1lQmFzZSArPSAnZmEtbGkgJ1xuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc1NwaW5uZXIgdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1zcGluICdcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZVxuICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLnNpemUgPiAxIGFuZCBkZWZhdWx0cy5pY29uT3B0cy5zaXplIDw9IDVcbiAgICAgIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLScgKyBkZWZhdWx0cy5pY29uT3B0cy5zaXplICsgJ3ggJ1xuXG4gIGNsYXNzTmFtZSA9IGNsYXNzTmFtZUJhc2UgKyAnZmEtJyArIGRlZmF1bHRzLmljb25PcHRzLm5hbWVcbiAgcmV0Lm15SWNvbiA9IHJldC5tYWtlICdpJywgcHJvcHM6IGNsYXNzOiBjbGFzc05hbWVcblxuICAjVG9nZ2xlcyBkaXNwbGF5IGJldHdlZW4gbm9ybWFsIGljb24gYW5kIHN3YXAgaWNvbiwgaWYgYSBzd2FwIGljb24gaGFzIGJlZW4gc3BlY2lmaWVkXG4gIHJldC50b2dnbGVJY29uID0gLT5cbiAgICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zd2FwSWNvblxuICAgICAgbmV3SWNvbiA9IGRlZmF1bHRzLmljb25PcHRzLm5hbWVcblxuICAgICAgaXNUb2dnbGVkID0gIWlzVG9nZ2xlZFxuXG4gICAgICBpZiBpc1RvZ2dsZWRcbiAgICAgICAgcmV0Lm15SWNvbi4kLnJlbW92ZUNsYXNzKCdmYS0nICsgbmV3SWNvbilcbiAgICAgICAgbmV3SWNvbiA9IGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uXG4gICAgICBlbHNlXG4gICAgICAgIHJldC5teUljb24uJC5yZW1vdmVDbGFzcygnZmEtJyArIGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uKVxuXG4gICAgICByZXQubXlJY29uLiQuYWRkQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxuXG5cbiAgcmV0XG5cbk9KLmNvbnRyb2xzLnJlZ2lzdGVyIGZyaWVuZGx5TmFtZSwgY250cmxcbm1vZHVsZS5leHBvcnRzID0gY250cmwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuZ2V0RGF0ZUZyb21Ebkpzb24gPSAoZG5EYXRlKSAtPlxyXG4gICAgXHJcbiAgIyBUcmFuc2Zvcm1zIGEgLk5FVCBKU09OIGRhdGUgaW50byBhIEphdmFTY3JpcHQgZGF0ZS5cclxuICAjIG5hbWU9J29iaicgIE9iamVjdCB0byB0ZXN0XHJcbiAgIyB0eXBlPSdCb29sZWFuJyAvPlxyXG4gICNcclxuICAjICAgICAgIHZhciBtaWxsaSA9IE9KLnRvLm51bWJlcihEbkRhdGUucmVwbGFjZSgvXFwvRGF0ZVxcKChcXGQrKVxcLT8oXFxkKylcXClcXC8vLCAnJDEnKSk7XHJcbiAgIyAgICAgICB2YXIgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKERuRGF0ZS5yZXBsYWNlKC9cXC9EYXRlXFwoXFxkKyhbXFwrXFwtXT9cXGQrKVxcKVxcLy8sICckMScpKTtcclxuICAjICAgICAgIHZhciBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKTtcclxuICAjICAgICAgIHJldHVybiBuZXcgRGF0ZSgobWlsbGkgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpO1xyXG4gICMgICAgICAgXHJcbiAgICBcclxuICAjIERuIERhdGUgd2lsbCBsb29rIGxpa2UgL0RhdGUoMTMzNTc1ODQwMDAwMC0wNDAwKS8gIFxyXG4gIGRuRGF0ZVN0ciA9IE9KLnRvLnN0cmluZyhkbkRhdGUpXHJcbiAgcmV0ID0gdW5kZWZpbmVkXHJcbiAgdGlja3MgPSB1bmRlZmluZWRcclxuICBvZmZzZXQgPSB1bmRlZmluZWRcclxuICBsb2NhbE9mZnNldCA9IHVuZGVmaW5lZFxyXG4gIGFyciA9IHVuZGVmaW5lZFxyXG4gIHJldCA9IE9KLmRhdGVUaW1lTWluVmFsdWVcclxuICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eShkbkRhdGVTdHIpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnLycsICcnKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJ0RhdGUnLCAnJylcclxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCcoJywgJycpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnKScsICcnKVxyXG4gICAgYXJyID0gZG5EYXRlU3RyLnNwbGl0KCctJylcclxuICAgIGlmIGFyci5sZW5ndGggPiAxXHJcbiAgICAgIHRpY2tzID0gT0oudG8ubnVtYmVyKGFyclswXSlcclxuICAgICAgb2Zmc2V0ID0gT0oudG8ubnVtYmVyKGFyclsxXSlcclxuICAgICAgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KClcclxuICAgICAgcmV0ID0gbmV3IERhdGUoKHRpY2tzIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKVxyXG4gICAgZWxzZSBpZiBhcnIubGVuZ3RoIGlzIDFcclxuICAgICAgdGlja3MgPSBPSi50by5udW1iZXIoYXJyWzBdKVxyXG4gICAgICByZXQgPSBuZXcgRGF0ZSh0aWNrcylcclxuICByZXRcclxuXHJcbiAgT0oucmVnaXN0ZXIgJ2dldERhdGVGcm9tRG5Kc29uJywgZ2V0RGF0ZUZyb21Ebkpzb25cclxuICBtb2R1bGVzLmV4cG9ydHMgPSBnZXREYXRlRnJvbURuSnNvblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxuIyBXcmFwIHRoZSBleGVjdXRpb24gb2YgYSBtZXRob2QgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5ICAgICBcclxuIyBpZ25vcmUgZXJyb3JzIGZhaWxpbmcgdG8gZXhlYyBzZWxmLWV4ZWN1dGluZyBmdW5jdGlvbnMgXHJcbiMgUmV0dXJuIGEgbWV0aG9kIHdyYXBwZWQgaW4gYSB0cnkuLmNhdGNoLi5maW5hbGx5XHJcbnRyeUV4ZWMgPSAodHJ5RnVuYykgLT5cclxuICAndXNlIHN0cmljdCdcclxuICByZXQgPSBmYWxzZVxyXG4gIHRoYXQgPSB0aGlzXHJcbiAgdHJ5XHJcbiAgICByZXQgPSB0cnlGdW5jLmFwcGx5KHRoYXQsIEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpICBpZiBPSi5pcy5tZXRob2QodHJ5RnVuYylcclxuICBjYXRjaCBleGNlcHRpb25cclxuICAgIGlmIChleGNlcHRpb24ubmFtZSBpcyAnVHlwZUVycm9yJyBvciBleGNlcHRpb24udHlwZSBpcyAnY2FsbGVkX25vbl9jYWxsYWJsZScpIGFuZCBleGNlcHRpb24udHlwZSBpcyAnbm9uX29iamVjdF9wcm9wZXJ0eV9sb2FkJ1xyXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0lnbm9yaW5nIGV4Y2VwdGlvbjogJywgZXhjZXB0aW9uXHJcbiAgICBlbHNlXHJcbiAgICAgIE9KLmNvbnNvbGUuZXJyb3IgZXhjZXB0aW9uXHJcbiAgZmluYWxseVxyXG5cclxuICByZXRcclxuXHJcblxyXG4gbWV0aG9kID0gKHRyeUZ1bmMpIC0+XHJcbiAgJ3VzZSBzdHJpY3QnXHJcbiAgdGhhdCA9IHRoaXNcclxuICAtPlxyXG4gICAgYXJncyA9IEFycmF5OjpzbGljZS5jYWxsKGFyZ3VtZW50cywgMClcclxuICAgIGFyZ3MudW5zaGlmdCB0cnlGdW5jXHJcbiAgICBPSi50cnlFeGVjLmFwcGx5IHRoYXQsIGFyZ3NcclxuXHJcbiAgXHJcbiBcclxuIE9KLnJlZ2lzdGVyICdtZXRob2QnLCBtZXRob2RcclxuIE9KLnJlZ2lzdGVyICd0cnlFeGVjJywgdHJ5RXhlY1xyXG4gbW9kdWxlLmV4cG9ydHMgPVxyXG4gIG1ldGhvZDogbWV0aG9kXHJcbiAgdHJ5RXhlYzogdHJ5RXhlY1xyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5cclxubnVtYmVyID0gT2JqZWN0LmNyZWF0ZShudWxsKVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ2lzTmFOJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5pc05hTikgdGhlbiBOdW1iZXIuaXNOYU4gZWxzZSBpc05hTilcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdpc0Zpbml0ZScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuaXNGaW5pdGUpIHRoZW4gTnVtYmVyLmlzRmluaXRlIGVsc2UgaXNGaW5pdGUpXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnTUFYX1ZBTFVFJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5NQVhfVkFMVUUpIHRoZW4gTnVtYmVyLk1BWF9WQUxVRSBlbHNlIDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4KVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ01JTl9WQUxVRScsXHJcbiAgdmFsdWU6IChpZiAoTnVtYmVyIGFuZCBOdW1iZXIuTUlOX1ZBTFVFKSB0aGVuIE51bWJlci5NSU5fVkFMVUUgZWxzZSA1ZS0zMjQpXHJcblxyXG5PSi5yZWdpc3RlciAnbnVtYmVyJywgbnVtYmVyXHJcbm1vZHVsZS5leHBvcnRzID0gbnVtYmVyIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbiQgPSByZXF1aXJlICdqcXVlcnknXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcbnByb3BlcnR5ID0gcmVxdWlyZSAnLi9wcm9wZXJ0eSdcblxuZnVuYyA9IHJlcXVpcmUgJy4vZnVuY3Rpb24nXG5cbiMgIyBvYmplY3RcblxucmV0T2JqID0gXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLm9iamVjdFxuICAjIGNyZWF0ZSBhbiBvYmplY3Qgd2l0aCBoZWxwZXIgYGFkZGAgYW5kIGBlYWNoYCBtZXRob2RzLlxuICBvYmplY3Q6IChvYmogPSB7fSkgLT5cbiAgICBcbiAgICAjIyNcbiAgICBBZGQgYSBwcm9wZXJ0eSB0byB0aGUgb2JqZWN0IGFuZCByZXR1cm4gaXRcbiAgICAjIyNcbiAgICBvYmouYWRkID0gKG5hbWUsIHZhbCkgLT5cbiAgICAgIHByb3BlcnR5IG9iaiwgbmFtZSwgdmFsXG4gICAgICBvYmpcblxuICAgIG9iai5hZGQgJ2VhY2gnLCAoY2FsbGJhY2spIC0+XHJcbiAgICAgIGVhY2ggPSByZXF1aXJlICcuLi90b29scy9lYWNoJ1xuICAgICAgZWFjaCBvYmosICh2YWwsIGtleSkgLT5cbiAgICAgICAgaWYga2V5IGlzbnQgJ2VhY2gnIGFuZCBrZXkgaXNudCAnYWRkJ1xuICAgICAgICAgIGNhbGxiYWNrIHZhbCwga2V5XG5cbiAgICBvYmpcblxuXG4gICMgIyMgW09KXShvai5odG1sKS5pc0luc3RhbmNlT2ZcbiAgIyBkZXRlcm1pbmVzIGlzIGEgdGhpbmcgaXMgYW4gaW5zdGFuY2Ugb2YgYSBUaGluZywgYXNzdW1pbmcgdGhlIHRoaW5ncyB3ZXJlIGFsbCBjcmVhdGVkIGluIE9KXG4gIGlzSW5zdGFuY2VPZjogKG5hbWUsIG9iaikgLT5cbiAgICB0byA9IHJlcXVpcmUgJy4uL3Rvb2xzL3RvJ1xuICAgIHJldE9iai5jb250YWlucyhuYW1lLCBvYmopIGFuZCB0by5ib29sKG9ialtuYW1lXSlcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuY29udGFpbnNcbiAgIyB0cnVlIGlmIHRoZSBgb2JqZWN0YCBjb250YWlucyB0aGUgdmFsdWVcbiAgY29udGFpbnM6IChvYmplY3QsIGluZGV4KSAtPlxuICAgIHJldCA9IGZhbHNlXG4gICAgaWYgb2JqZWN0XG4gICAgICByZXQgPSBfLmNvbnRhaW5zIG9iamVjdCwgaW5kZXhcbiAgICByZXRcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuY29tcGFyZVxuICAjIGNvbXBhcmUgdHdvIG9iamVjdHMvYXJyYXlzL3ZhbHVlcyBmb3Igc3RyaWN0IGVxdWFsaXR5XG4gIGNvbXBhcmU6IChvYmoxLCBvYmoyKSAtPlxuICAgIF8uaXNFcXVhbCBvYmoxLCBvYmoyXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmNsb25lXG4gICMgY29weSBhbGwgb2YgdGhlIHZhbHVlcyAocmVjdXJzaXZlbHkpIGZyb20gb25lIG9iamVjdCB0byBhbm90aGVyLlxuICBjbG9uZTogKGRhdGEpIC0+XG4gICAgXy5jbG9uZURlZXAgZGF0YSB0cnVlXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLnNlcmlhbGl6ZVxuICAjIENvbnZlcnQgYW4gb2JqZWN0IHRvIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgb2JqZWN0XG4gIHNlcmlhbGl6ZTogKGRhdGEpIC0+XG4gICAgcmV0ID0gJydcbiAgICBmdW5jLnRyeUV4ZWMgLT5cbiAgICAgIHJldCA9IEpTT04uc3RyaW5naWZ5KGRhdGEpXG4gICAgICByZXR1cm5cbiAgICByZXQgb3IgJydcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuZGVzZXJpYWxpemVcbiAgIyBDb252ZXJ0IGEgSlNPTiBzdHJpbmcgdG8gYW4gb2JqZWN0XG4gIGRlc2VyaWFsaXplOiAoZGF0YSkgLT5cbiAgICByZXQgPSB7fVxuICAgIGlmIGRhdGFcbiAgICAgIGZ1bmMudHJ5RXhlYyAtPlxuICAgICAgICByZXQgPSAkLnBhcnNlSlNPTihkYXRhKVxuICAgICAgICByZXR1cm5cblxuICAgICAgcmV0ID0ge30gIGlmIGlzTWV0aG9kLm51bGxPckVtcHR5KHJldClcbiAgICByZXRcblxuICAjICMjIFtPSl0ob2ouaHRtbCkucGFyYW1zXG4gICMgQ29udmVydCBhbiBvYmplY3QgdG8gYSBkZWxpbWl0ZWQgbGlzdCBvZiBwYXJhbWV0ZXJzIChub3JtYWxseSBxdWVyeS1zdHJpbmcgcGFyYW1ldGVycylcbiAgcGFyYW1zOiAoZGF0YSwgZGVsaW1pdGVyID0gJyYnKSAtPlxuICAgIHJldCA9ICcnXG4gICAgaWYgZGVsaW1pdGVyIGlzICcmJ1xuICAgICAgZnVuYy50cnlFeGVjIC0+XG4gICAgICAgIHJldCA9ICQucGFyYW0oZGF0YSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICBlbHNlXHJcbiAgICAgIGVhY2ggPSByZXF1aXJlICcuLi90b29scy9lYWNoJ1xuICAgICAgZWFjaCBkYXRhLCAodmFsLCBrZXkpIC0+XG4gICAgICAgIHJldCArPSBkZWxpbWl0ZXIgIGlmIHJldC5sZW5ndGggPiAwXG4gICAgICAgIHJldCArPSBrZXkgKyAnPScgKyB2YWxcbiAgICAgICAgcmV0dXJuXG5cbiAgICB0by5zdHJpbmcgcmV0XG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmV4dGVuZFxuICAjIGNvcHkgdGhlIHByb3BlcnRpZXMgb2Ygb25lIG9iamVjdCB0byBhbm90aGVyIG9iamVjdFxuICBleHRlbmQ6IChkZXN0T2JqLCBzcmNPYmosIGRlZXBDb3B5ID0gZmFsc2UpIC0+XG4gICAgcmV0ID0gZGVzdE9iaiBvciB7fVxuICAgIGlmIGRlZXBDb3B5IGlzIHRydWVcbiAgICAgIHJldCA9ICQuZXh0ZW5kKGRlZXBDb3B5LCByZXQsIHNyY09iailcbiAgICBlbHNlXG4gICAgICByZXQgPSAkLmV4dGVuZChyZXQsIHNyY09iailcbiAgICByZXRcblxuXG5PSi5yZWdpc3RlciAnb2JqZWN0JywgcmV0T2JqLm9iamVjdFxuT0oucmVnaXN0ZXIgJ2lzSW5zdGFuY2VPZicsIHJldE9iai5pc0luc3RhbmNlT2Zcbk9KLnJlZ2lzdGVyICdjb250YWlucycsIHJldE9iai5jb250YWluc1xuT0oucmVnaXN0ZXIgJ2NvbXBhcmUnLCByZXRPYmouY29tcGFyZVxuT0oucmVnaXN0ZXIgJ2Nsb25lJywgcmV0T2JqLmNsb25lXG5PSi5yZWdpc3RlciAnc2VyaWFsaXplJywgcmV0T2JqLnNlcmlhbGl6ZVxuT0oucmVnaXN0ZXIgJ2Rlc2VyaWFsaXplJywgcmV0T2JqLmRlc2VyaWFsaXplXG5PSi5yZWdpc3RlciAncGFyYW1zJywgcmV0T2JqLnBhcmFtc1xuT0oucmVnaXN0ZXIgJ2V4dGVuZCcsIHJldE9iai5leHRlbmRcblxubW9kdWxlLmV4cG9ydHMgPSByZXRPYmoiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG4jIyNcclxuQWRkIGEgcHJvcGVydHkgdG8gYW4gb2JqZWN0XHJcbiAgXHJcbiMjI1xyXG5wcm9wZXJ0eSA9IChvYmosIG5hbWUsIHZhbHVlLCB3cml0YWJsZSwgY29uZmlndXJhYmxlLCBlbnVtZXJhYmxlKSAtPlxyXG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGRlZmluZSBhIHByb3BlcnR5IHdpdGhvdXQgYW4gT2JqZWN0LicgIHVubGVzcyBvYmpcclxuICB0aHJvdyBuZXcgRXJyb3IgJ0Nhbm5vdCBjcmVhdGUgYSBwcm9wZXJ0eSB3aXRob3V0IGEgdmFsaWQgcHJvcGVydHkgbmFtZS4nICB1bmxlc3MgbmFtZT9cclxuICBvYmpbbmFtZV0gPSB2YWx1ZVxyXG4gIG9ialxyXG5cclxuT0oucmVnaXN0ZXIgJ3Byb3BlcnR5JywgcHJvcGVydHlcclxubW9kdWxlLmV4cG9ydHMgPSBwcm9wZXJ0eSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmRlbGltaXRlZFN0cmluZyA9IChzdHJpbmcsIG9wdHMpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgbmV3TGluZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICBzcGFjZVRvRGVsaW1pdGVyOiB0cnVlXHJcbiAgICByZW1vdmVEdXBsaWNhdGVzOiB0cnVlXHJcbiAgICBkZWxpbWl0ZXI6IFwiLFwiXHJcbiAgICBpbml0U3RyaW5nOiBPSi50by5zdHJpbmcgc3RyaW5nXHJcblxyXG4gIHJldE9iaiA9XHJcbiAgICBhcnJheTogW11cclxuICAgIGRlbGltaXRlZDogLT5cclxuICAgICAgcmV0T2JqLmFycmF5LmpvaW4gZGVmYXVsdHMuZGVsaW1pdGVyXHJcblxyXG4gICAgc3RyaW5nOiAoZGVsaW1pdGVyID0gZGVmYXVsdHMuZGVsaW1pdGVyKSAtPlxyXG4gICAgICByZXQgPSAnJ1xyXG4gICAgICBPSi5lYWNoIHJldE9iai5hcnJheSwgKHZhbCkgLT5cclxuICAgICAgICByZXQgKz0gZGVsaW1pdGVyICBpZiByZXQubGVuZ3RoID4gMFxyXG4gICAgICAgIHJldCArPSB2YWxcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgIHJldFxyXG5cclxuICAgIHRvU3RyaW5nOiAtPlxyXG4gICAgICByZXRPYmouc3RyaW5nKClcclxuXHJcbiAgICBhZGQ6IChzdHIpIC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5wdXNoIGRlZmF1bHRzLnBhcnNlKHN0cilcclxuICAgICAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcygpXHJcbiAgICAgIHJldE9ialxyXG5cclxuICAgIHJlbW92ZTogKHN0cikgLT5cclxuICAgICAgcmVtb3ZlID0gKGFycmF5KSAtPlxyXG4gICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgIHRydWUgIGlmIGl0ZW0gaXNudCBzdHJcclxuXHJcblxyXG4gICAgICByZXRPYmouYXJyYXkgPSByZW1vdmUocmV0T2JqLmFycmF5KVxyXG4gICAgICByZXRPYmpcclxuXHJcbiAgICBjb3VudDogLT5cclxuICAgICAgcmV0T2JqLmFycmF5Lmxlbmd0aFxyXG5cclxuICAgIGNvbnRhaW5zOiAoc3RyLCBjYXNlU2Vuc2l0aXZlKSAtPlxyXG4gICAgICBpc0Nhc2VTZW5zaXRpdmUgPSBPSi50by5ib29sKGNhc2VTZW5zaXRpdmUpXHJcbiAgICAgIHN0ciA9IE9KLnRvLnN0cmluZyhzdHIpLnRyaW0oKVxyXG4gICAgICBzdHIgPSBzdHIudG9Mb3dlckNhc2UoKSAgaWYgZmFsc2UgaXMgaXNDYXNlU2Vuc2l0aXZlXHJcbiAgICAgIG1hdGNoID0gcmV0T2JqLmFycmF5LmZpbHRlcigobWF0U3RyKSAtPlxyXG4gICAgICAgIChpc0Nhc2VTZW5zaXRpdmUgYW5kIE9KLnRvLnN0cmluZyhtYXRTdHIpLnRyaW0oKSBpcyBzdHIpIG9yIE9KLnRvLnN0cmluZyhtYXRTdHIpLnRyaW0oKS50b0xvd2VyQ2FzZSgpIGlzIHN0clxyXG4gICAgICApXHJcbiAgICAgIG1hdGNoLmxlbmd0aCA+IDBcclxuXHJcbiAgICBlYWNoOiAoY2FsbEJhY2spIC0+XHJcbiAgICAgIHJldE9iai5hcnJheS5mb3JFYWNoIGNhbGxCYWNrXHJcblxyXG4gIGRlZmF1bHRzLnBhcnNlID0gKHN0cikgLT5cclxuICAgIHJldCA9IE9KLnRvLnN0cmluZyhzdHIpXHJcbiAgICByZXQgPSByZXQucmVwbGFjZSgvXFxuL2csIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiXFxuXCIpIGlzbnQgLTEgIGlmIGRlZmF1bHRzLm5ld0xpbmVUb0RlbGltaXRlclxyXG4gICAgcmV0ID0gcmV0LnJlcGxhY2UoUmVnRXhwKFwiIFwiLCBcImdcIiksIGRlZmF1bHRzLmRlbGltaXRlcikgIHdoaWxlIHJldC5pbmRleE9mKFwiIFwiKSBpc250IC0xICBpZiBkZWZhdWx0cy5zcGFjZVRvRGVsaW1pdGVyXHJcbiAgICByZXQgPSByZXQucmVwbGFjZSgvLCwvZywgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCIsLFwiKSBpc250IC0xXHJcbiAgICByZXRcclxuXHJcbiAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcyA9IC0+XHJcbiAgICBpZiBkZWZhdWx0cy5yZW1vdmVEdXBsaWNhdGVzXHJcbiAgICAgICgtPlxyXG4gICAgICAgIHVuaXF1ZSA9IChhcnJheSkgLT5cclxuICAgICAgICAgIHNlZW4gPSBuZXcgU2V0KClcclxuICAgICAgICAgIGFycmF5LmZpbHRlciAoaXRlbSkgLT5cclxuICAgICAgICAgICAgaWYgZmFsc2UgaXMgc2Vlbi5oYXMoaXRlbSlcclxuICAgICAgICAgICAgICBzZWVuLmFkZCBpdGVtXHJcbiAgICAgICAgICAgICAgdHJ1ZVxyXG5cclxuXHJcbiAgICAgICAgcmV0T2JqLmFycmF5ID0gdW5pcXVlKHJldE9iai5hcnJheSlcclxuICAgICAgICByZXR1cm5cclxuICAgICAgKSgpXHJcbiAgICByZXR1cm5cclxuXHJcbiAgKChhKSAtPlxyXG4gICAgaWYgYS5sZW5ndGggPiAxIGFuZCBmYWxzZSBpcyBPSi5pcy5wbGFpbk9iamVjdChvcHRzKVxyXG4gICAgICBPSi5lYWNoIGEsICh2YWwpIC0+XHJcbiAgICAgICAgcmV0T2JqLmFycmF5LnB1c2ggdmFsICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSh2YWwpXHJcbiAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgZWxzZSBpZiBzdHJpbmcgYW5kIHN0cmluZy5sZW5ndGggPiAwXHJcbiAgICAgIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0c1xyXG4gICAgICBkZWxpbWl0ZWRTdHJpbmcgPSBkZWZhdWx0cy5wYXJzZShzdHJpbmcpXHJcbiAgICAgIGRlZmF1bHRzLmluaXRTdHJpbmcgPSBkZWxpbWl0ZWRTdHJpbmdcclxuICAgICAgcmV0T2JqLmFycmF5ID0gZGVsaW1pdGVkU3RyaW5nLnNwbGl0KGRlZmF1bHRzLmRlbGltaXRlcilcclxuICAgIGRlZmF1bHRzLmRlbGV0ZUR1cGxpY2F0ZXMoKVxyXG4gICAgcmV0dXJuXHJcbiAgKSBhcmd1bWVudHNcclxuICByZXRPYmpcclxuXHJcblxyXG5PSi5yZWdpc3RlciAnZGVsaW1pdGVkU3RyaW5nJywgZGVsaW1pdGVkU3RyaW5nXHJcbm1vZHVsZS5leHBvcnRzID0gZGVsaW1pdGVkU3RyaW5nIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5yZXF1aXJlICd0aGluZG9tJ1xubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xuZWxlbWVudCA9IHJlcXVpcmUgJy4vZWxlbWVudCdcbmRvbSA9IHJlcXVpcmUgJy4vZG9tJ1xuXG5cbiMjI1xuUGVyc2lzdCBhIGhhbmRsZSBvbiB0aGUgYm9keSBub2RlXG4jIyNcbmlmIHR5cGVvZiBkb2N1bWVudCBpc250ICd1bmRlZmluZWQnIHRoZW4gYm9keSA9IGRvY3VtZW50LmJvZHkgZWxzZSBib2R5ID0gbnVsbFxudGhpbkJvZHkgPSBuZXcgVGhpbkRPTSBudWxsLCBpZDogJ2JvZHknLCBib2R5XG50aGluQm9keS5pc0luRE9NID0gdHJ1ZVxudGhpbkJvZHkuZ2V0SWQgPSAtPlxuICAnYm9keSdcblxuZWxlbWVudC5maW5hbGl6ZSB0aGluQm9keSwgJ2JvZHknXG50aGluQm9keS5jb3VudCA9IDBcbnRoaW5Cb2R5LnJvb3QgPSBudWxsXG5kb20gdGhpbkJvZHksIG51bGxcbm5vZGVGYWN0b3J5LmFkZE1ha2VNZXRob2QgdGhpbkJvZHksIDBcbnRoaW5Cb2R5LmlzRnVsbHlJbml0ID0gdHJ1ZSAgXG4gIFxuT0oucmVnaXN0ZXIgJ2JvZHknLCB0aGluQm9keVxubW9kdWxlLmV4cG9ydHMgPSB0aGluQm9keSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5lbCA9IHJlcXVpcmUgJy4vZWxlbWVudCdcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuXG4jICMgY29tcG9uZW50XG5cblxuIyBDcmVhdGUgYW4gSFRNTCBXZWIgQ29tcG9uZW50IHRocm91Z2ggVGhpbkRvbVxuXG4jIC0gYG9wdGlvbnNgIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHN0YW5kYXJkIG9wdGlvbnMgdG8gYmUgcGFzc2VkIGludG8gdGhlIGNvbXBvbmVudFxuIyAtLSBgcm9vdE5vZGVUeXBlYDogdGhlIHRhZyBuYW1lIG9mIHRoZSByb290IG5vZGUgdG8gY3JlYXRlLCBkZWZhdWx0ID0gJ2RpdidcbiMgLS0gYHByb3BzYDogYW4gb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgRE9NIGF0dHJpYnV0ZXMgdG8gYXBwZW5kIHRvIHRoZSByb290IG5vZGVcbiMgLS0gYHN0eWxlc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIENTUyBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXG4jIC0tIGBldmVudHNgOiBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBuYW1lZCBET00gZXZlbnRzIChhbmQgY29ycmVzcG9uZGluZyBjYWxsYmFjayBtZXRob2RzKSB0byBiaW5kIHRvIHRoZSByb290IG5vZGVcbiMgLSBgb3duZXJgIHRoZSBwYXJlbnQgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBub2RlIHdpbGwgYmUgYXBwZW5kZWRcbiMgLSBgdGFnTmFtZWAgdGhlIG5hbWUgb2Ygb2YgdGhlIGNvbXBvbmVudCwgd2hpY2ggd2lsbCBhbHdheXMgYmUgcHJlZml4ZWQgd2l0aCAneC0nXG5jb21wb25lbnQgPSAob3B0aW9ucyA9IG9iai5vYmplY3QoKSwgb3duZXIsIHRhZ05hbWUpIC0+XG5cbiAgaWYgbm90IHRhZ05hbWUuc3RhcnRzV2l0aCAneC0nIHRoZW4gdGFnTmFtZSA9ICd4LScgKyB0YWdOYW1lXG4gICMgd2ViIGNvbXBvbmVudHMgYXJlIHJlYWxseSBqdXN0IG9yZGluYXJ5IE9KIFtlbGVtZW50XShlbGVtZW50Lmh0bWwpJ3Mgd2l0aCBhIHNwZWNpYWwgbmFtZS5cbiAgIyBVbnRpbCBIVE1MIFdlYiBDb21wb25lbnRzIGFyZSBmdWxseSBzdXBwb3J0ZWQgKGFuZCBPSiBpcyByZWZhY3RvcmVkIGFjY29yZGluZ2x5KSwgdGhlIGVsZW1lbnQgd2lsbCBiZSB0cmVhdGVkIGFzIGFuIHVua25vd24gZWxlbWVudC5cbiAgIyBJbiBtb3N0IGNhc2VzLCB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiB0aGUgYnJvd3NlciBpcyBhY2NlcHRhYmxlIChzZWUgYWxzbyBbSFRNTCBTZW1hbnRpY3NdKGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vc2VtYW50aWNzLmh0bWwpKSwgYnV0XG4gICMgaW4gc29tZSBjYXNlcyB0aGlzIGlzIHByb2JsZW1hdGljIChmaXJzdGx5LCBiZWNhdXNlIHRoZXNlIGVsZW1lbnRzIGFyZSBhbHdheXMgcmVuZGVyZWQgaW5saW5lKS5cbiAgIyBJbiBzdWNoIGNvbmRpdGlvbnMsIHRoZSBbY29udHJvbHNdKGNvbnRyb2xzLmh0bWwpIGNsYXNzIGFuZCBuYW1lIHNwYWNlIGlzIGJldHRlciBzdWl0ZWQgdG8gY2xhc3NlcyB3aGljaCByZXF1aXJlIGNvbXBsZXRlIGNvbnRyb2wgKGUuZy4gW2ljb25dKGljb24uaHRtbCkpLlxuICB3aWRnZXQgPSBlbC5lbGVtZW50IHRhZ05hbWUsIG9iai5vYmplY3QoKSwgb3duZXIsIGZhbHNlICMsIG9wdGlvbnMucHJvcHMsIG9wdGlvbnMuc3R5bGVzLCBvcHRpb25zLmV2ZW50cywgb3B0aW9ucy50ZXh0XG4gIFxuICAjIFNpbmNlIHRoZSBiZWhhdmlvciBvZiBzdHlsaW5nIGlzIG5vdCB3ZWxsIGNvbnRyb2xsZWQvY29udHJvbGxhYmxlIG9uIHVua25vd24gZWxlbWVudHMsIGl0IGlzIG5lY2Vzc2FyeSB0byBjcmVhdGUgYSByb290IG5vZGUgZm9yIHRoZSBjb21wb25lbnQuXG4gICMgSW4gbW9zdCBjYXNlcywgW2Rpdl0oZGl2Lmh0bWwpIGlzIHBlcmZlY3RseSBhY2NlcHRhYmxlLCBidXQgdGhpcyBpcyBjb25maWd1cmFibGUgYXQgdGhlIG5hbWUgc3BhY2UgbGV2ZWwgb3IgYXQgcnVudGltZS5cbiAgcm9vdE5vZGVUeXBlID0gb3B0aW9ucy5yb290Tm9kZVR5cGUgb3IgT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSBvciAnZGl2J1xuXG4gICMgYHJldGAgaXMgdGhlIHRoZSBpbnN0YW5jZSBvZiB0aGUgcm9vdE5vZGVUeXBlLCBub3QgdGhlIGB3aWRnZXRgIHdyYXBwZWQgaW4gdGhpcyBjbG9zdXJlXG4gIHJldCA9IHdpZGdldC5tYWtlIHJvb3ROb2RlVHlwZSwgb3B0aW9uc1xuXG4gICMgZm9yIGNvbnZlbmllbmNlIGFuZCBkZWJ1Z2dpbmcsIHBlcnNpc3QgdGhlIHRhZ05hbWVcbiAgcmV0LmFkZCAnY29tcG9uZW50TmFtZScsIHRhZ05hbWVcblxuICAjIGByZW1vdmVgIGRvZXMsIGhvd2V2ZXIsIGJlaGF2ZSBhcyBleHBlY3RlZCBieSByZW1vdmluZyBgd2lkZ2V0YFxuICByZXQuYWRkICdyZW1vdmUnLCB3aWRnZXQucmVtb3ZlXG4gIHJldFxuXG5PSi5yZWdpc3RlciAnY29tcG9uZW50JywgY29tcG9uZW50XG5tb2R1bGUuZXhwb3J0cyA9IGNvbXBvbmVudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5lbCA9IHJlcXVpcmUgJy4vZWxlbWVudCdcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuXG4jIyNcbkNyZWF0ZSBhIHNldCBvZiBIVE1MIEVsZW1lbnRzIHRocm91Z2ggVGhpbkRvbVxuIyMjXG5jb250cm9sID0gKG9wdGlvbnMgPSBvYmoub2JqZWN0KCksIG93bmVyLCB0YWdOYW1lKSAtPlxuICBpZiBub3QgdGFnTmFtZS5zdGFydHNXaXRoICd5LScgdGhlbiB0YWdOYW1lID0gJ3ktJyArIHRhZ05hbWVcblxuICByb290Tm9kZVR5cGUgPSBvcHRpb25zLnJvb3ROb2RlVHlwZSBvciBPSlsnREVGQVVMVF9DT01QT05FTlRfUk9PVF9OT0RFVFlQRSddIG9yICdkaXYnXG5cbiAgcmV0ID0gZWwuZWxlbWVudCByb290Tm9kZVR5cGUsIG9wdGlvbnMsIG93bmVyLCBmYWxzZVxuXG4gIHJldC5hZGQgJ2NvbnRyb2xOYW1lJywgdGFnTmFtZVxuXG4gIHJldFxuXG5PSi5yZWdpc3RlciAnY29udHJvbCcsIGNvbnRyb2xcbm1vZHVsZS5leHBvcnRzID0gY29udHJvbCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuXG4jICMgZG9tXG5cblxuIyBFeHRlbmQgYW4gb2JqZWN0IHdpdGggT0ogRE9NIG1ldGhvZHMgYW5kIHByb3BlcnRpZXNcblxuIyAtIGBlbGAgT2JqZWN0IHRvIGV4dGVuZFxuIyAtIGBwYXJlbnRgIHBhcmVudCBvYmplY3QgdG8gd2hpY2ggYGVsYCB3aWxsIGJlIGFwcGVuZGVkXG5kb20gPSAoZWwsIHBhcmVudCA9IHJlcXVpcmUoJy4vYm9keScpKSAtPlxuICBlbmFibGVkID0gdHJ1ZVxuXG4gICMgIyMgaXNWYWxpZFxuICBlbC5hZGQgJ2lzVmFsaWQnLCAtPlxuICAgIGVsIGFuZCAoZWwuZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCBvciBlbC5lbCBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpXG5cbiAgaXNDb250cm9sU3RpbGxWYWxpZCA9IC0+XG4gICAgaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcbiAgICB2YWxpZCA9IGZhbHNlIGlzIGlzTWV0aG9kLm51bGxPckVtcHR5KGVsKSBhbmQgZWwuaXNWYWxpZCgpXG4gICAgdGhyb3cgbmV3IEVycm9yICdlbCBpcyBudWxsLiBFdmVudCBiaW5kaW5ncyBtYXkgbm90IGhhdmUgYmVlbiBHQ2QuJyAgaWYgZmFsc2UgaXMgdmFsaWRcbiAgICB2YWxpZFxuXG4gICMgIyMgYWRkQ2xhc3NcbiAgIyBBZGQgYSBDU1MgY2xhc3MgdG8gYW4gZWxlbWVudFxuXG4gICMgLSBgbmFtZWAgdGhlIG5hbWUgb2YgdGhlIGNsYXNzIHRvIGFkZFxuICBlbC5hZGQgJ2FkZENsYXNzJywgKG5hbWUpIC0+XG4gICAgZWwuJC5hZGRDbGFzcyBuYW1lIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIGVsXG5cbiAgIyAjIyBiaW5kXG4gICMgQmluZCBhbiBhY3Rpb24gdG8gYSBqUXVlcnkgZWxlbWVudCdzIGV2ZW50LlxuICBlbC5hZGQgJ2JpbmQnLCAoZXZlbnROYW1lLCBldmVudCkgLT5cbiAgICBlbC5vbiBldmVudE5hbWUsIGV2ZW50XG5cbiAgIyAjIyBvblxuICBlbC5hZGQgJ29uJywgKGV2ZW50TmFtZSwgZXZlbnQpIC0+XG4gICAgZWwuJC5vbiBldmVudE5hbWUsIGV2ZW50ICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBlbFxuXG4gICMgIyMgb2ZmXG4gIGVsLmFkZCAnb2ZmJywgKGV2ZW50TmFtZSwgZXZlbnQpIC0+XG4gICAgZWwuJC5vZmYgZXZlbnROYW1lLCBldmVudCAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgZWxcblxuICAjICMjIGtleWJvYXJkXG4gICMgQmluZCBhbiBldmVudCB0byBhIGtleSwgd2hlbiBwcmVzc2VkIGluIHRoaXMgY29udHJvbC5cbiAgIyBUaGUgT0ogb2JqZWN0IChmb3IgY2hhaW5pbmcpXG4gIGVsLmFkZCAna2V5Ym9hcmQnLCAoa2V5cywgZXZlbnQpIC0+XG4gICAgI01vdXNldHJhcC5iaW5kIGtleXMsIGVsW2V2ZW50XSAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgZWxcblxuICAjICMjIGRpc2FibGVcbiAgIyBEaXNhYmxlIHRoZSBlbGVtZW50LlxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcbiAgZWwuYWRkICdkaXNhYmxlJywgLT5cbiAgICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICAgIGVuYWJsZWQgPSBmYWxzZVxuICAgICAgZWwuYXR0ciAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnXG4gICAgICBlbC5hZGRDbGFzcyAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnXG4gICAgZWxcblxuICAjICMjIGVtcHR5XG4gICMgRW1wdHkgdGhlIGVsZW1lbnQuXG4gICMgVGhlIE9KIG9iamVjdCAoZm9yIGNoYWluaW5nKVxuICBlbC5hZGQgJ2VtcHR5JywgLT5cbiAgICBlbC4kLmVtcHR5KCkgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIGVsXG5cbiAgIyAjIyBlbmFibGVcbiAgIyBFbmFibGUgdGhlIGVsZW1lbnQuXG4gICMgVGhlIE9KIG9iamVjdCAoZm9yIGNoYWluaW5nKVxuICBlbC5hZGQgJ2VuYWJsZScsIC0+XG4gICAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgICBlbmFibGVkID0gdHJ1ZVxuICAgICAgZWwucmVtb3ZlQXR0ciAnZGlzYWJsZWQnXG4gICAgICBlbC5yZW1vdmVDbGFzcyAnZGlzYWJsZWQnXG4gICAgZWxcblxuICAjICMjIGdldElkXG4gICMgR2V0IHRoZSBET00gRWxlbWVudCBJRCBvZiB0aGlzIG9iamVjdC5cbiAgZWwuYWRkICdnZXRJZCcsIC0+XG4gICAgaWQgPSBlbFswXS5pZCAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgaWRcblxuICAjICMjIGhpZGVcbiAgIyBNYWtlIHRoZSBlbGVtZW50IGludmlzaWJsZS5cbiAgZWwuYWRkICdoaWRlJywgLT5cbiAgICBlbC5jc3MgJ2Rpc3BsYXknLCAnbm9uZScgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIGVsXG5cbiAgIyAjIyBsZW5ndGhcbiAgIyBHZXQgdGhlIGxlbmd0aCBvZiB0aGlzIGVsZW1lbnQuXG4gIGVsLmFkZCAnbGVuZ3RoJywgLT5cbiAgICB0byA9IHJlcXVpcmUgJy4uL3Rvb2xzL3RvJ1xuICAgIGxlbiA9IDBcbiAgICBsZW4gPSB0by5udW1iZXIoZWwuJC5sZW5ndGgpICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBsZW5cblxuICAjICMjIHBhcmVudFxuICAjIFJlZmVyZW5jZSB0byB0aGUgcGFyZW50IGFzIHBhc3NlZCBpblxuICBlbC5hZGQgJ3BhcmVudCcsIHBhcmVudFxuXG4gICMgIyMgcmVtb3ZlXG4gICMgUmVtb3ZlIHRoZSBub2RlIGZyb20gdGhlIERPTVxuICBlbC5hZGQgJ3JlbW92ZScsIC0+XG4gICAgaWYgZWwgYW5kIGVsLiRcbiAgICAgIGVsLiQucmVtb3ZlKClcblxuICAgICAgIyBTZXQgdGhlIHZhbHVlIG9mIGVsIHRvIG51bGwgdG8gZ3VhcmFudGVlIHRoYXQgaXNDb250cm9sU3RpbGxWYWxpZCB3aWxsIGJlIGNvcnJlY3RcbiAgICAgIGVsID0gbnVsbFxuICAgIG51bGxcblxuICAjICMjIHJlbW92ZUNsYXNzXG4gICMgUmVtb3ZlIGEgQ1NTIGNsYXNzIGZyb20gYW4gZWxlbWVudC5cbiAgZWwuYWRkICdyZW1vdmVDbGFzcycsIChuYW1lKSAtPlxuICAgIGVsLiQucmVtb3ZlQ2xhc3MgbmFtZSAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgZWxcblxuICAjICMjIHJlbW92ZVByb3BcbiAgIyBSZW1vdmUgYSBwcm9wZXJ0eSBmcm9tIGFuIGVsZW1lbnQuIGpRdWVyeSBkaXN0aW5ndWlzaGVzIGJldHdlZW4gJ3Byb3BzJyBhbmQgJ2F0dHInOyBoZW5jZSAyIG1ldGhvZHMuXG4gIGVsLmFkZCAncmVtb3ZlUHJvcCcsIChuYW1lKSAtPlxuICAgIGVsLiQucmVtb3ZlUHJvcCBuYW1lICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBlbFxuXG4gICMgIyMgcmVtb3ZlQXR0clxuICAjIFJlbW92ZSBhIHByb3BlcnR5IGZyb20gYW4gZWxlbWVudC4galF1ZXJ5IGRpc3Rpbmd1aXNoZXMgYmV0d2VlbiAncHJvcHMnIGFuZCAnYXR0cic7IGhlbmNlIDIgbWV0aG9kcy5cbiAgZWwuYWRkICdyZW1vdmVBdHRyJywgKG5hbWUpIC0+XG4gICAgZWwuJC5yZW1vdmVBdHRyIG5hbWUgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIGVsXG5cbiAgIyAjIyByZXF1aXJlZFxuICAjIE1hcmsgdGhlIHJlcXVpcmVkIHN0YXR1cyBvZiB0aGUgZWxlbWVudC5cbiAgZWwuYWRkICdyZXF1aXJlZCcsICh0cnV0aHksIGFkZExhYmVsKSAtPlxuICAgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgICAgdG8gPSByZXF1aXJlICcuLi90b29scy90bydcbiAgICAgIHN3aXRjaCB0by5ib29sKHRydXRoeSlcbiAgICAgICAgd2hlbiB0cnVlXG4gICAgICAgICAgZWwuYXR0ciAncmVxdWlyZWQnLCB0cnVlXG4gICAgICAgICAgZWwuYWRkQ2xhc3MgJ3JlcXVpcmVkJ1xuICAgICAgICB3aGVuIGZhbHNlXG4gICAgICAgICAgZWwucmVtb3ZlUHJvcCAncmVxdWlyZWQnXG4gICAgICAgICAgZWwucmVtb3ZlQ2xhc3MgJ3JlcXVpcmVkJ1xuICAgIGVsXG5cbiAgIyAjIyByb290XG4gICMgcmVmZXJlbmNlIHRvIHRoZSByb290IG9mIHRoZSBub2RlXG4gIGVsLmFkZCAncm9vdCcsIGVsLnJvb3Qgb3IgcGFyZW50XG5cbiAgIyAjIyBzaG93XG4gICMgTWFrZSB0aGUgZWxlbWVudCB2aXNpYmxlLlxuICBlbC5hZGQgJ3Nob3cnLCAtPlxuICAgIGVsLiQuc2hvdygpICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBlbFxuXG4gICMgIyMgdG9nZ2xlXG4gICMgVG9nZ2xlIHZpc2liaWxpdHlcbiAgZWwuYWRkICd0b2dnbGUnLCAtPlxuICAgIGVsLiQudG9nZ2xlKCkgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgIGVsXG5cbiAgIyAjIyB0b2dnbGVFbmFibGVcbiAgIyBUb2dnbGUgdGhlIGVsZW1lbnQncyBlbmFibGVkIHN0YXRlLlxuICBlbC5hZGQgJ3RvZ2dsZUVuYWJsZScsIC0+XG4gICAgaWYgaXNDb250cm9sU3RpbGxWYWxpZCgpXG4gICAgICBpZiBlbmFibGVkXG4gICAgICAgIGVsLmRpc2FibGUoKVxuICAgICAgZWxzZVxuICAgICAgICBlbC5lbmFibGUoKVxuICAgIGVsXG5cbiAgIyAjIyB0cmlnZ2VyXG4gICMgVHJpZ2dlciBhbiBldmVudCBib3VuZCB0byBhIGpRdWVyeSBlbGVtZW50LlxuICBlbC5hZGQgJ3RyaWdnZXInLCAoZXZlbnROYW1lLCBldmVudE9wdHMpIC0+XG4gICAgZWwuJC50cmlnZ2VyIGV2ZW50TmFtZSwgZXZlbnRPcHRzICBpZiBpc0NvbnRyb2xTdGlsbFZhbGlkKClcbiAgICBlbFxuXG4gICMgIyMgdW5iaW5kXG4gICMgV3JhcHBlciBhcm91bmQgYG9mZmBcbiAgZWwuYWRkICd1bmJpbmQnLCAoZXZlbnROYW1lLCBldmVudCkgLT5cbiAgICBlbC5vZmYgZXZlbnROYW1lLCBldmVudFxuXG4gICMgIyMgdmFsXG4gICMgR2V0IG9yIHNldCB0aGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQuXG4gIGVsLmFkZCAndmFsJywgKHZhbHVlKSAtPlxuICAgIGlmIGlzQ29udHJvbFN0aWxsVmFsaWQoKVxuICAgICAgaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMSBhbmQgZmFsc2UgaXMgaXNNZXRob2QubnVsbE9yVW5kZWZpbmVkKHZhbHVlKVxuICAgICAgICBlbC4kLnZhbCB2YWx1ZVxuICAgICAgICBlbFxuICAgICAgZWxzZVxuICAgICAgICBlbC4kLnZhbCgpXG5cbiAgIyAjIyB2YWx1ZU9mXG4gICMgd3JhcHBlciBhcm91bmQgYHZhbGBcbiAgZWwuYWRkICd2YWx1ZU9mJywgLT5cbiAgICBlbC52YWwoKVxuXG4gICMgIyMgdG9TdHJpbmdcbiAgIyB3cmFwcGVyIGFyb3VuZCBgdmFsYFxuICBlbC5hZGQgJ3RvU3RyaW5nJywgLT5cbiAgICBlbC52YWwoKVxuXG4gIGVsXG5cbk9KLnJlZ2lzdGVyICdpc0VsZW1lbnRJbkRvbScsIChlbGVtZW50SWQpIC0+XG4gIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5IE9KLmdldEVsZW1lbnQgZWxlbWVudElkXG5cbk9KLnJlZ2lzdGVyICdnZXRFbGVtZW50JywgKGlkKSAtPlxuICBpZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuXG5PSi5yZWdpc3RlciAnZG9tJywgZG9tXG5tb2R1bGUuZXhwb3J0cyA9IGRvbSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcblxucmVxdWlyZSAndGhpbmRvbSdcblxuIyAjIGVsZW1lbnRcblxuZWxlbWVudCA9IFxuICAjIyNcbiAgICBCaW5kIGFsbCBldmVudCBoYW5kbGVyc1xuICAjIyNcbiAgYmluZEV2ZW50czogKGVsLCBldmVudHMpIC0+XG4gICAgaWYgZWwgdGhlbiBfLmZvck93biBldmVudHMsICh2YWwsIGtleSkgLT5cbiAgICAgIGlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXG4gICAgICBpZiBpc01ldGhvZC5tZXRob2QgdmFsXG4gICAgICAgIGNhbGxiYWNrID0gKGV2ZW50Li4uKSAtPiB2YWwgZXZlbnQuLi5cbiAgICAgICAgZWwuJC5vbiBrZXksIGNhbGxiYWNrXG4gICAgICAgIGVsLmFkZCBrZXksIGNhbGxiYWNrXG4gICAgICAgIG51bGxcblxuICAjIyNcbiAgRmluYWxpemUgdGhlIFRoaW1ET00gbm9kZVxuICAjIyNcbiAgZmluYWxpemU6IChyZXQsIHRhZywgcHJvcHMsIHN0eWxlcywgZXZlbnRzLCB0ZXh0KSAtPlxuICAgIHJldC5hZGQgJ3RhZ05hbWUnLCB0YWdcbiAgICByZXQuY3NzIHN0eWxlc1xuICAgIGlmIHRleHQgdGhlbiByZXQudGV4dCB0ZXh0XG4gICAgcmV0LmFkZCAnJCcsICQocmV0LmdldCgpKVxuICAgIHJldC5hZGQgJzAnLCByZXQuZ2V0KClcblxuICAgIHJldC5hZGQgJ2JpbmRFdmVudHMnLCBfLm9uY2UgKCkgLT4gZWxlbWVudC5iaW5kRXZlbnRzIHJldCwgZXZlbnRzXG4gICAgcmV0XG5cbiAgIyAjIyByZXN0b3JlRWxlbWVudFxuICAjIyNcbiAgUmVzdG9yZSBhbiBIVE1MIEVsZW1lbnQgdGhyb3VnaCBUaGluRG9tXG4gICMjI1xuICByZXN0b3JlRWxlbWVudDogKGVsLCB0YWcgPSBlbC5ub2RlTmFtZSkgLT5cbiAgICBub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXG4gICAgcmV0ID0gbmV3IFRoaW5ET00gbnVsbCwgbnVsbCwgZWxcbiAgICBlbGVtZW50LmZpbmFsaXplIHJldCwgdGFnXG4gICAgcmV0LmFkZCAnaXNJbkRPTScsIHRydWVcbiAgICBub2RlRmFjdG9yeS5tYWtlIHJldFxuICAgIHJldFxuXG4gICMgIyMgZWxlbWVudFxuICAjIyNcbiAgQ3JlYXRlIGFuIEhUTUwgRWxlbWVudCB0aHJvdWdoIFRoaW5Eb21cbiAgIyMjXG4gIGVsZW1lbnQ6ICh0YWcsIG9wdGlvbnMsIG93bmVyLCBpc0NhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XG4gICAgcmV0ID0gbmV3IFRoaW5ET00gdGFnLCBvcHRpb25zLnByb3BzXG4gICAgZWxlbWVudC5maW5hbGl6ZSByZXQsIHRhZywgb3B0aW9ucy5wcm9wcywgb3B0aW9ucy5zdHlsZXMsIG9wdGlvbnMuZXZlbnRzLCBvcHRpb25zLnRleHRcbiAgICBpZiBvd25lciBhbmQgZmFsc2UgaXMgaXNDYWxsZWRGcm9tRmFjdG9yeVxuICAgICAgbm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xuICAgICAgbm9kZUZhY3RvcnkubWFrZSByZXQsIG93bmVyXG4gICAgcmV0XG5cbk9KLnJlZ2lzdGVyICdyZXN0b3JlRWxlbWVudCcsIGVsZW1lbnQucmVzdG9yZUVsZW1lbnRcbk9KLnJlZ2lzdGVyICdlbGVtZW50JywgZWxlbWVudC5lbGVtZW50XG5cbm1vZHVsZS5leHBvcnRzID0gZWxlbWVudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5lbCA9IHJlcXVpcmUgJy4vZWxlbWVudCdcblxuIyAjIGZyYWdtZW50XG5cbiMgQ3JlYXRlIGEgZG9jdW1lbnQgZnJhZ21lbnQgYW5kIHJldHVybiBpdCBhcyBhbiBPSiBub2RlXG5mcmFnbWVudCA9IC0+XG4gIHJldCA9IG51bGxcbiAgaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCdcbiAgICBmcmFnbWVudCA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuICAgIHJldCA9IGVsLnJlc3RvcmVFbGVtZW50IGZyYWdtZW50LCAnZnJhZ21lbnQnXG4gIHJldFxuXG5PSi5yZWdpc3RlciAnZnJhZ21lbnQnLCBmcmFnbWVudFxubW9kdWxlLmV4cG9ydHMgPSBmcmFnbWVudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5lbCA9IHJlcXVpcmUgJy4vZWxlbWVudCdcbnJlcXVpcmUgJy4uL29qSW5pdCdcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuXG4jICMgZ2VuZXJpYyBub2Rlc1xuXG5jbG9zZWQgPSBbXG4gICdhYmJyJ1xuICAnYWNyb255bSdcbiAgJ2FwcGxldCdcbiAgJ2FydGljbGUnXG4gICdhc2lkZSdcbiAgJ2F1ZGlvJ1xuICAnYidcbiAgJ2JkbydcbiAgJ2JpZydcbiAgJ2Jsb2NrcXVvdGUnXG4gICdidXR0b24nXG4gICdjYW52YXMnXG4gICdjYXB0aW9uJ1xuICAnY2VudGVyJ1xuICAnY2l0ZSdcbiAgJ2NvZGUnXG4gICdjb2xncm91cCdcbiAgJ2RhdGFsaXN0J1xuICAnZGQnXG4gICdkZWwnXG4gICdkZXRhaWxzJ1xuICAnZGZuJ1xuICAnZGlyJ1xuICAnZGl2J1xuICAnZGwnXG4gICdkdCdcbiAgJ2VtJ1xuICAnZmllbGRzZXQnXG4gICdmaWdjYXB0aW9uJ1xuICAnZmlndXJlJ1xuICAnZm9udCdcbiAgJ2Zvb3RlcidcbiAgJ2gxJ1xuICAnaDInXG4gICdoMydcbiAgJ2g0J1xuICAnaDUnXG4gICdoNidcbiAgJ2hlYWQnXG4gICdoZWFkZXInXG4gICdoZ3JvdXAnXG4gICdodG1sJ1xuICAnaSdcbiAgJ2lmcmFtZSdcbiAgJ2lucydcbiAgJ2tiZCdcbiAgJ2xhYmVsJ1xuICAnbGVnZW5kJ1xuICAnbGknXG4gICdtYXAnXG4gICdtYXJrJ1xuICAnbWVudSdcbiAgJ21ldGVyJ1xuICAnbmF2J1xuICAnbm9mcmFtZXMnXG4gICdub3NjcmlwdCdcbiAgJ29iamVjdCdcbiAgJ29wdGdyb3VwJ1xuICAnb3B0aW9uJ1xuICAnb3V0cHV0J1xuICAncCdcbiAgJ3ByZSdcbiAgJ3Byb2dyZXNzJ1xuICAncSdcbiAgJ3JwJ1xuICAncnQnXG4gICdydWJ5J1xuICAncydcbiAgJ3NhbXAnXG4gICdzZWN0aW9uJ1xuICAnc21hbGwnXG4gICdzcGFuJ1xuICAnc3RyaWtlJ1xuICAnc3Ryb25nJ1xuICAnc3R5bGUnXG4gICdzdWInXG4gICdzdW1tYXJ5J1xuICAnc3VwJ1xuICAndGJvZHknXG4gICd0ZCdcbiAgJ3Rmb290J1xuICAndGgnXG4gICd0aW1lJ1xuICAndGl0bGUnXG4gICd0cidcbiAgJ3R0J1xuICAndSdcbiAgJ3ZhcidcbiAgJ3ZpZGVvJ1xuICAneG1wJ1xuXVxub3BlbiA9ICdhcmVhIGJhc2UgY29sIGNvbW1hbmQgY3NzIGVtYmVkIGhyIGltZyBrZXlnZW4gbWV0YSBwYXJhbSBzb3VyY2UgdHJhY2sgd2JyJy5zcGxpdCAnICdcbmFsbCA9IGNsb3NlZC5jb25jYXQgb3BlblxuXG5leHBvcnRzID0ge31cbiMgcmVnaXN0ZXIgc2VtYW50aWMvc3RydWN0dXJhbCBhbGlhc2VzXG5mb3IgbG9vcE5hbWUgaW4gYWxsXG4gIGRvICh0YWcgPSBsb29wTmFtZSkgLT5cbiAgICBtZXRob2QgPSAob3B0aW9ucywgb3duZXIgPSByZXF1aXJlICcuL2JvZHknLCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuXG4gICAgICBkZWZhdWx0cyA9XG4gICAgICAgIHByb3BzOiB7fVxuICAgICAgICBzdHlsZXM6IHt9XG4gICAgICAgIGV2ZW50czoge31cblxuICAgICAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9uc1xuICAgICAgcmV0ID0gZWwuZWxlbWVudCB0YWcsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcblxuICAgICAgcmV0XG4gICAgT0oubm9kZXMucmVnaXN0ZXIgdGFnLCBtZXRob2RcbiAgICBleHBvcnRzW3RhZ10gPSBtZXRob2RcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzXG5cblxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMjI1xyXG5DcmVhdGUgYW4gT0ogSW5wdXQgT2JqZWN0IHRocm91Z2ggT0oubm9kZXMuaW5wdXRcclxuIyMjXHJcbmlucHV0ID0gKG9wdGlvbnMgPSBPSi5vYmplY3QoKSwgb3duZXIpIC0+XHJcbiAgaWYgbm90IG93bmVyIHRoZW4gdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIGFuIGlucHV0IHdpdGhvdXQgYSBwYXJlbnQnXHJcbiAgaWYgbm90IG9wdGlvbnMucHJvcHMgb3Igbm90IG9wdGlvbnMucHJvcHMudHlwZSB0aGVuIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhbiBpbnB1dCB3aXRob3V0IGFuIGlucHV0IHR5cGUnXHJcbiAgcmV0ID0gb3duZXIubWFrZSAnaW5wdXQnLCBvcHRpb25zXHJcbiAgcmV0LmFkZCAnaW5wdXROYW1lJywgb3B0aW9ucy5wcm9wcy50eXBlXHJcbiAgcmV0XHJcbiAgICBcclxuT0oucmVnaXN0ZXIgJ2lucHV0JywgaW5wdXRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5cbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cbmNsb3NlZCA9ICdhIGFiYnIgYWNyb255bSBhZGRyZXNzIGFwcGxldCBhcnRpY2xlIGFzaWRlIGF1ZGlvIGIgYmRvIGJpZyBibG9ja3F1b3RlIGJvZHkgYnV0dG9uIGNhbnZhcyBjYXB0aW9uIGNlbnRlciBjaXRlIGNvZGUgY29sZ3JvdXAgY29tbWFuZCBkYXRhbGlzdCBkZCBkZWwgZGV0YWlscyBkZm4gZGlyIGRpdiBkbCBkdCBlbSBlbWJlZCBmaWVsZHNldCBmaWdjYXB0aW9uIGZpZ3VyZSBmb250IGZvb3RlciBmb3JtIGZyYW1lc2V0IGgxIGgyIGgzIGg0IGg1IGg2IGhlYWQgaGVhZGVyIGhncm91cCBodG1sIGkgaWZyYW1lIGlucyBrZXlnZW4ga2JkIGxhYmVsIGxlZ2VuZCBsaSBtYXAgbWFyayBtZW51IG1ldGVyIG5hdiBub2ZyYW1lcyBub3NjcmlwdCBvYmplY3Qgb2wgb3B0Z3JvdXAgb3B0aW9uIG91dHB1dCBwIHByZSBwcm9ncmVzcyBxIHJwIHJ0IHJ1YnkgcyBzYW1wIHNjcmlwdCBzZWN0aW9uIHNlbGVjdCBzbWFsbCBzb3VyY2Ugc3BhbiBzdHJpa2Ugc3Ryb25nIHN0eWxlIHN1YiBzdW1tYXJ5IHN1cCB0YWJsZSB0Ym9keSB0ZCB0ZXh0YXJlYSB0Zm9vdCB0aCB0aGVhZCB0aW1lIHRpdGxlIHRyIHR0IHUgdWwgdmFyIHZpZGVvIHdiciB4bXAnLnNwbGl0ICcgJ1xub3BlbiA9ICdhcmVhIGJhc2UgYnIgY29sIGNvbW1hbmQgY3NzICFET0NUWVBFIGVtYmVkIGhyIGltZyBpbnB1dCBrZXlnZW4gbGluayBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnInLnNwbGl0ICcgJ1xuXG5uZXN0YWJsZU5vZGVOYW1lcyA9IFtcbiAgJ2RpdidcbiAgJ3NwYW4nXG4gICdoMSdcbiAgJ2gyJ1xuICAnaDMnXG4gICdoNCdcbiAgJ2g1J1xuICAnaDYnXG4gICdwJ1xuICAnZmllbGRzZXQnXG4gICdzZWxlY3QnXG4gICdvbCdcbiAgJ3VsJ1xuICAndGFibGUnXG5dXG5cbiNUaGlzIGxpc3QgaXMgbm90IHlldCBleGhhdXN0aXZlLCBqdXN0IGV4Y2x1ZGUgdGhlIG9idmlvdXNcbm5vbk5lc3RhYmxlTm9kZXMgPSBbXG4gICdsaSdcbiAgJ2xlZ2VuZCdcbiAgJ3RyJ1xuICAndGQnXG4gICdvcHRpb24nXG4gICdib2R5J1xuICAnaGVhZCdcbiAgJ3NvdXJjZSdcbiAgJ3Rib2R5J1xuICAndGZvb3QnXG4gICd0aGVhZCdcbiAgJ2xpbmsnXG4gICdzY3JpcHQnXG5dXG5cbmV4cG9ydHMgPSB7fVxuIyMjXG5GZXRjaCBhIG5vZGUgZnJvbSB0aGUgRE9NIGFuZCByZXR1cm4gYW4gT0onZmllZCBpbnN0YW5jZSBvZiB0aGUgZWxlbWVudFxuIyMjXG5leHBvcnRzLmdldCA9IChpZCwgdGFnTmFtZSA9ICdkaXYnKSAtPlxuICByZXQgPSBudWxsXG4gIGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQgaWRcbiAgaWYgZWxcbiAgICB0aGluRWwgPSBPSi5yZXN0b3JlRWxlbWVudCBlbCwgdGFnTmFtZVxuICBpZiB0aGluRWxcbiAgICByZXQgPSBPSi5ub2Rlcy5mYWN0b3J5IHRoaW5FbCwgbnVsbCwgMFxuXG4gIHJldFxuXG5ub2RlTmFtZXMgPSBbXG4gICdhJ1xuICAnYidcbiAgJ2JyJ1xuICAnYnV0dG9uJ1xuICAnZGl2J1xuICAnZW0nXG4gICdmaWVsZHNldCdcbiAgJ2Zvcm0nXG4gICdoMSdcbiAgJ2gyJ1xuICAnaDMnXG4gICdoNCdcbiAgJ2g1J1xuICAnaDYnXG4gICdpJ1xuICAnaW1nJ1xuICAnaW5wdXQnXG4gICdsYWJlbCdcbiAgJ2xlZ2VuZCdcbiAgJ2xpJ1xuICAnbmF2J1xuICAnb2wnXG4gICdvcHRpb24nXG4gICdwJ1xuICAnc2VsZWN0J1xuICAnc3BhbidcbiAgJ3N0cm9uZydcbiAgJ3N1cCdcbiAgJ3N2ZydcbiAgJ3RhYmxlJ1xuICAndGJvZHknXG4gICd0ZCdcbiAgJ3RleHRhcmVhJ1xuICAndGgnXG4gICd0aGVhZCdcbiAgJ3RyJ1xuICAndWwnXG5dXG5cbm1ha2VBZGQgPSAodGFnTmFtZSwgZWwsIGNvdW50KSAtPlxuICAob3B0cykgLT5cbiAgICBtZXRob2QgPSBPSi5ub2Rlc1t0YWdOYW1lXSBvciBPSi5jb21wb25lbnRzW3RhZ05hbWVdIG9yIE9KLmNvbnRyb2xzW3RhZ05hbWVdIG9yIE9KLmlucHV0c1t0YWdOYW1lXVxuICAgIGlmIG1ldGhvZFxuICAgICAgbnUgPSBtZXRob2Qgb3B0cywgZWwsIHRydWVcbiAgICBlbHNlXG4gICAgICBudSA9IE9KLmNvbXBvbmVudCBudWxsLCBlbCwgdGFnTmFtZVxuICAgIE9KLm5vZGVzLmZhY3RvcnkgbnUsIGVsLCBjb3VudFxuXG5leHBvcnRzLmFkZE1ha2VNZXRob2QgPSAoZWwsIGNvdW50KSAtPlxuICBtZXRob2RzID0gT0oub2JqZWN0KClcbiAgZWwubWFrZSA9ICh0YWdOYW1lLCBvcHRzKSAtPlxuICAgIG1ldGhvZCA9IG1ldGhvZHNbdGFnTmFtZV1cbiAgICBpZiBub3QgbWV0aG9kXG4gICAgICBtZXRob2QgPSBtYWtlQWRkIHRhZ05hbWUsIGVsLCBjb3VudFxuICAgICAgbWV0aG9kc1t0YWdOYW1lXSA9IG1ldGhvZFxuICAgIG1ldGhvZCBvcHRzXG4gIGVsXG5cbm1ha2VVbmlxdWVJZCA9IChlbCwgcGFyZW50LCBjb3VudCkgLT5cbiAgaWYgT0ouR0VORVJBVEVfVU5JUVVFX0lEU1xuICAgIGNvdW50ICs9IDFcbiAgICBpZiBjb3VudCA8PSBwYXJlbnQuY291bnQgdGhlbiBjb3VudCA9IHBhcmVudC5jb3VudCArIDFcbiAgICBwYXJlbnQuY291bnQgPSBjb3VudFxuXG4gICAgaWYgbm90IGVsLmdldElkKClcbiAgICAgIGlkID0gcGFyZW50LmdldElkKCkgb3IgJydcbiAgICAgIGlkICs9IGVsLnRhZ05hbWUgKyBjb3VudFxuICAgICAgZWwuYXR0ciAnaWQnLCBpZFxuICByZXR1cm5cblxuIyMjXG5FeHRlbmRzIGEgT0ogQ29udHJvbCBjbGFzcyB3aXRoIGFsbCB0aGUgKHBlcm1pdHRlZCkgbWV0aG9kcyBvbiB0aGUgZmFjdG9yeVxuIyMjXG5leHBvcnRzLm1ha2UgPSAoZWwsIHBhcmVudCA9IHJlcXVpcmUoJy4vYm9keScpLCBjb3VudCA9IHBhcmVudC5jb3VudCBvciAwKSAtPlxuXG4gICMgMTogZm9yIGNsYXJpdHksIHdlIGFyZSByZXR1cm5pbmcgdGhlIGV4dGVuZGVkIGVsZW1lbnRcbiAgcmV0ID0gZWxcblxuICAjIDI6IElmIHRoZSBlbGVtZW50IGhhcyBuZXZlciBiZWVuIGluaXRpYWxpemVkLCBjb250aW51ZVxuICBpZiBub3QgZWwuaXNGdWxseUluaXRcblxuICAgICMgMzogQXMgbG9uZyBhcyB0aGUgZWxlbWVudCBpc24ndCB0aGUgYm9keSBub2RlLCBjb250aW51ZVxuICAgIGlmIGVsLnRhZ05hbWUgaXNudCAnYm9keSdcbiAgICAgICMgNDogRXh0ZW5kIHRoZSBlbGVtZW50IHdpdGggc3RhbmRhcmQgalF1ZXJ5IEFQSSBtZXRob2RzXG4gICAgICByZXQgPSBPSi5kb20gZWwsIHBhcmVudFxuXG4gICAgICAjIDU6IElmIHRoZSBub2RlIGlzbid0IGluIHRoZSBET00sIGFwcGVuZCBpdCB0byB0aGUgcGFyZW50XG4gICAgICAjIFRoaXMgYWxzbyBhY2NvbW1vZGF0ZXMgZG9jdW1lbnQgZnJhZ21lbnRzLCB3aGljaCBhcmUgbm90IGluIHRoZSBET00gYnV0IGFyZSBwcmVzdW1lZCB0byBiZSBzb3VuZCB1bnRpbCByZWFkeSBmb3IgbWFudWFsIGluc2VydGlvblxuICAgICAgaWYgbm90IHJldC5pc0luRE9NXG4gICAgICAgIG1ha2VVbmlxdWVJZCBlbCwgcGFyZW50LCBjb3VudFxuICAgICAgICBwYXJlbnQuYXBwZW5kIHJldFswXVxuICAgICAgICAjIDY6IEJpbmQgYW55IGRlZmluZWQgZXZlbnRzIGFmdGVyIHRoZSBub2RlIGlzIGluIHRoZSBET01cbiAgICAgICAgcmV0LmJpbmRFdmVudHMoKVxuICAgICAgICByZXQuaXNJbkRPTSA9IHRydWVcblxuICAgICAgIyA3OiBDcmVhdGUgdGhlIGFsbCBpbXBvcnRhbnQgJ21ha2UnIG1ldGhvZFxuICAgICAgZXhwb3J0cy5hZGRNYWtlTWV0aG9kIHJldCwgY291bnRcblxuICAgICAgIyA4OiBQcmV2ZW50IGR1cGxpY2F0ZSBmYWN0b3J5IGV4dGVuc2lvbiBieSBzZXR0aW5nIGlzIGluaXQgPSB0cnVlXG4gICAgICByZXQuaXNGdWxseUluaXQgPSB0cnVlXG5cbiAgICAgICMgOTogaWYgdGhlIG5vZGUgc3VwcG9ydHMgaXQsIGNhbGwgZmluYWxpemVcbiAgICAgIGZpbmFsaXplID0gXy5vbmNlIHJldC5maW5hbGl6ZSBvciBPSi5ub29wXG4gICAgICByZXQuZmluYWxpemUgPSBmaW5hbGl6ZVxuICAgICAgZmluYWxpemUgcmV0XG5cbiAgIyAxMDogUmV0dXJuIHRoZSBleHRlbmRlZCBlbGVtZW50XG4gIHJldFxuXG5cbk9KLm5vZGVzLnJlZ2lzdGVyICdmYWN0b3J5JywgZXhwb3J0cy5tYWtlXG5PSi5ub2Rlcy5yZWdpc3RlciAnZ2V0JywgZXhwb3J0cy5nZXRcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0c1xuXG5cbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5lbCA9IHJlcXVpcmUgJy4uL2RvbS9lbGVtZW50J1xuXG4jICMgYVxubm9kZU5hbWUgPSAnYSdcblxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IHJlcXVpcmUoJy4uL2RvbS9ib2R5JyksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgaWQ6ICcnXG4gICAgICBjbGFzczogJydcbiAgICAgIHRleHQ6ICcnXG4gICAgICBocmVmOiAnamF2YVNjcmlwdDp2b2lkKDApOydcbiAgICAgIHR5cGU6ICcnXG4gICAgICB0aXRsZTogJydcbiAgICAgIHJlbDogJydcbiAgICAgIG1lZGlhOiAnJ1xuICAgICAgdGFyZ2V0OiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgdG9nZ2xlU3RhdGUgPSAnb2ZmJ1xuXG4gIHRvZ2dsZSA9IC0+XG4gICAgaWYgdG9nZ2xlU3RhdGUgaXMgJ29uJ1xuICAgICAgdG9nZ2xlU3RhdGUgPSAnb2ZmJ1xuICAgIGVsc2UgdG9nZ2xlU3RhdGUgPSAnb24nICBpZiB0b2dnbGVTdGF0ZSBpcyAnb2ZmJ1xuICAgIHJldHVyblxuXG4gICMgQ2xpY2sgYmluZGluZ1xuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcbiAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cbiAgICAgIHRvZ2dsZSgpXG4gICAgICByZXRWYWwgPSBjbGljayBldmVudC4uLlxuICAgICAgaWYgZGVmYXVsdHMuaHJlZiBpcyAnIycgdGhlbiByZXRWYWwgPSBmYWxzZVxuICAgICAgcmV0VmFsXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcbiAgZWxzZVxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IHRvZ2dsZVxuXG4gIHJldCA9IGVsLmVsZW1lbnQgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcblxuICByZXRcblxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxuXG5cbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5lbCA9IHJlcXVpcmUgJy4uL2RvbS9lbGVtZW50J1xudG8gPSByZXF1aXJlICcuLi90b29scy90bydcbiMgIyBiclxuXG5ub2RlTmFtZSA9ICdicidcblxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IHJlcXVpcmUoJy4uL2RvbS9ib2R5JyksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOiB7fVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuICAgIG51bWJlcjogMVxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICBpID0gMFxuICB3aGlsZSBpIDwgdG8ubnVtYmVyIGRlZmF1bHRzLm51bWJlclxuICAgICMgSW4gdGhlIGNhc2Ugb2YgbXVsdGlwbGUgYnJzLCBpdCBpcyBkZXNpcmFibGUgdG8gb25seSBnZXQgdGhlIGxhc3Qgb25lIG91dFxuICAgIHJldCA9IGVsLmVsZW1lbnQgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcblxuICAgIGkgKz0gMVxuXG4gIGlmIGZhbHNlIGlzIGNhbGxlZEZyb21GYWN0b3J5IHRoZW4gbm9kZXNGYWN0b3J5IHJldCwgb3duZXJcblxuICByZXRcblxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxuXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuZWwgPSByZXF1aXJlICcuLi9kb20vZWxlbWVudCdcblxuIyAjIGZvcm1cblxubm9kZU5hbWUgPSAnZm9ybSdcblxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IHJlcXVpcmUoJy4uL2RvbS9ib2R5JyksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgYWN0aW9uOiAnJ1xuICAgICAgbWV0aG9kOiAnJ1xuICAgICAgbmFtZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgcmV0ID0gZWwuZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxuXG4gIHJldC5hZGQgJ3ZhbGlkYXRvcicsIHJldC4kLnZhbGlkYXRlKFxuICAgIGhpZ2hsaWdodDogKGVsZW1lbnQpIC0+XG4gICAgICAkZWxtID0gJChlbGVtZW50KVxuICAgICAgJGVsbS5hdHRyICdPSl9pbnZhbGlkJywgJzEnXG4gICAgICAkZWxtLmFuaW1hdGUgYmFja2dyb3VuZENvbG9yOiAncmVkJ1xuICAgICAgbnVsbFxuXG4gICAgdW5oaWdobGlnaHQ6IChlbGVtZW50KSAtPlxuICAgICAgJGVsbSA9ICQoZWxlbWVudClcbiAgICAgIGlmICRlbG0uYXR0cignT0pfaW52YWxpZCcpIGlzICcxJ1xuICAgICAgICAkZWxtLmNzcyAnYmFja2dyb3VuZC1jb2xvcicsICd5ZWxsb3cnXG4gICAgICAgICRlbG0uYXR0ciAnT0pfaW52YWxpZCcsICcwJ1xuICAgICAgICBzZXRUaW1lb3V0ICgtPlxuICAgICAgICAgICRlbG0uYW5pbWF0ZSBiYWNrZ3JvdW5kQ29sb3I6ICd0cmFuc3BhcmVudCdcbiAgICAgICAgKSwgNTAwXG4gICAgICBudWxsXG4gIClcblxuICByZXQuYWRkICdpc0Zvcm1WYWxpZCcsIC0+XG4gICAgcmV0LiQudmFsaWQoKSBhbmQgKG5vdCByZXQudmFsaWRhdG9yLmludmFsaWRFbGVtZW50cygpIG9yIHJldC52YWxpZGF0b3IuaW52YWxpZEVsZW1lbnRzKCkubGVuZ3RoIGlzIDApXG5cbiBcblxuICByZXRcblxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxuXG5cblxuXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuZWwgPSByZXF1aXJlICcuLi9kb20vZWxlbWVudCdcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXG5cbiMgIyBpbnB1dFxuXG5ub2RlTmFtZSA9ICdpbnB1dCdcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSByZXF1aXJlKCcuLi9kb20vYm9keScpLCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgdmFsdWU6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG4gICAgICBjaGFuZ2U6IE9KLm5vb3BcbiAgICAgIGZvY3Vzb3V0OiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgaWYgbm90IGRlZmF1bHRzLnByb3BzLnR5cGUgb3Igbm90IGVudW1zLmlucHV0VHlwZXNbZGVmYXVsdHMucHJvcHMudHlwZV1cbiAgICB0aHJvdyBuZXcgRXJyb3IgJ05vIG1hdGNoaW5nIGlucHV0IHR5cGUgZm9yIHsnICsgZGVmYXVsdHMucHJvcHMudHlwZSArICd9IGNvdWxkIGJlIGZvdW5kLidcbiAgdGhpc1R5cGUgPSBlbnVtcy5pbnB1dFR5cGVzW2RlZmF1bHRzLnByb3BzLnR5cGVdXG5cbiAgc3luY1ZhbHVlID0gLT5cbiAgICBzd2l0Y2ggdGhpc1R5cGVcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5jaGVja2JveFxuICAgICAgICByZXQudmFsdWUgPSByZXQuJC5pcyAnOmNoZWNrZWQnXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMucmFkaW9cbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LiQuZmluZCgnOmNoZWNrZWQnKS52YWwoKVxuICAgICAgZWxzZVxuICAgICAgICByZXQudmFsdWUgPSByZXQudmFsKClcbiAgICBkZWZhdWx0cy5wcm9wcy52YWx1ZSA9IHJldC52YWx1ZSAgICBcbiAgICByZXQudmFsdWVcblxuICAjIyNcbiAgICBDbGljayBiaW5kaW5nLiBJZiB0aGUgY2FsbGVyIGRlZmluZWQgYSBjbGljayBoYW5kbGVyLFxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcbiAgICB0aGVuIGNhbGwgdGhlIGRlZmluZWQgY2xpY2sgaGFuZGxlciB3aXRoIHRoZSBsYXRlc3QgdmFsdWUuXG4gICMjI1xuICBvbGRDbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xuICBpZiBvbGRDbGljayBhbmQgb2xkQ2xpY2sgaXNudCBPSi5ub29wXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XG4gICAgICBzeW5jVmFsdWUoKVxuICAgICAgb2xkQ2xpY2sgcmV0LnZhbHVlLCBldmVudC4uLlxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXG5cbiAgIyMjXG4gICAgQ2hhbmdlIGJpbmRpbmcuIElmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGNoYW5nZSBoYW5kbGVyLFxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcbiAgICB0aGVuIGNhbGwgdGhlIGRlZmluZWQgY2hhbmdlIGhhbmRsZXIgd2l0aCB0aGUgbGF0ZXN0IHZhbHVlLlxuICAjIyNcbiAgb2xkQ2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxuICBpZiBvbGRDaGFuZ2UgYW5kIG9sZENoYW5nZSBpc250IE9KLm5vb3BcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XG4gICAgICBzeW5jVmFsdWUoKVxuICAgICAgb2xkQ2hhbmdlIHJldC52YWx1ZSwgZXZlbnQuLi5cbiAgICBkZWZhdWx0cy5ldmVudHMuY2hhbmdlID0gbmV3Q2hhbmdlXG5cbiAgIyMjXG4gICAgT24gRm9jdXMgT3V0IGJpbmRpbmcuIEFsd2F5cyB1c2UgdGhlIGV2ZW50IHRvIHVwZGF0ZSB0aGUgaW50ZXJuYWxcbiAgICB2YWx1ZSBvZiB0aGUgY29udHJvbDsgYW5kIGlmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGZvY3Vzb3V0IGV2ZW50LFxuICAgIHdyYXAgaXQgYW5kIGludm9rZSBpdCB3aXRoIHRoZSBsYXRlc3QgdmFsdWVcbiAgIyMjXG4gIG9sZEZvY3Vzb3V0ID0gZGVmYXVsdHMuZXZlbnRzLmZvY3Vzb3V0XG4gIG5ld0ZvY3Vzb3V0ID0gKGV2ZW50Li4uKSAtPlxuICAgIHN5bmNWYWx1ZSgpXG4gICAgaWYgb2xkRm9jdXNvdXQgYW5kIG9sZEZvY3Vzb3V0IGlzbnQgT0oubm9vcFxuICAgICAgb2xkRm9jdXNvdXQgcmV0LnZhbHVlLCBldmVudC4uLlxuXG4gIGRlZmF1bHRzLmV2ZW50cy5mb2N1c291dCA9IG5ld0ZvY3Vzb3V0XG5cblxuICByZXQgPSBlbC5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XG4gIHJldC52YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXG4gIHJldFxuXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbmVsID0gcmVxdWlyZSAnLi4vZG9tL2VsZW1lbnQnXG5cbiMgIyBvbFxuXG5ub2RlTmFtZSA9ICdvbCdcblxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IHJlcXVpcmUoJy4uL2RvbS9ib2R5JyksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOiB7fVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBlbC5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XG5cblxuIFxuXG4gIHJldFxuXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbmVsID0gcmVxdWlyZSAnLi4vZG9tL2VsZW1lbnQnXG5cbiMgIyBzZWxlY3Rcblxubm9kZU5hbWUgPSAnc2VsZWN0J1xuXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gcmVxdWlyZSAnLi4vZG9tL2JvZHknLCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHNlbGVjdGVkOiAnJ1xuICAgICAgbXVsdGlwbGU6IGZhbHNlXG4gICAgc3R5bGVzOiB7fVxuICAgIHZhbHVlczogW11cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuICAgICAgY2hhbmdlOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgdmFsdWUgPSAnJ1xuICB2YWx1ZXMgPSBbXVxuICBoYXNFbXB0eSA9IGZhbHNlXG5cbiAgc3luY1ZhbHVlID0gLT5cbiAgICB2YWx1ZSA9IHJldC52YWwoKVxuXG4gICMgQ2xpY2sgYmluZGluZ1xuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcbiAgICBuZXdDbGljayA9IChldmVudC4uLikgLT5cbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXG4gICAgICBzeW5jVmFsdWUoKVxuICAgICAgcmV0dmFsXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcblxuICAjIENoYW5nZSBiaW5kaW5nXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXG4gICAgY2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxuICAgIG5ld0NoYW5nZSA9IChldmVudC4uLikgLT5cbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxuICAgICAgc3luY1ZhbHVlKClcbiAgICAgIHJldHZhbFxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcblxuICByZXQgPSBlbC5lbGVtZW50IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XG5cbiAgcmV0LmFkZCAnc2VsZWN0ZWREYXRhJywgKHByb3BOYW1lKSAtPlxuICAgIHJldCA9ICcnXG4gICAgaWYgcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykgYW5kIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdXG4gICAgICBkYXRhc2V0ID0gcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0uZGF0YXNldFxuICAgICAgcmV0ID0gZGF0YXNldFtwcm9wTmFtZV0gIGlmIGRhdGFzZXRcbiAgICByZXRcblxuICByZXQuYWRkICdzZWxlY3RlZFRleHQnLCAtPlxuICAgIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnRleHQoKVxuXG4gIHJldC5hZGQgJ3NlbGVjdGVkVmFsJywgLT5cbiAgICB2YWx1ZSA9IHJldC52YWwoKVxuICAgIHZhbHVlXG5cbiAgcmV0LmFkZCAnYWRkT3B0aW9uJywgKHZhbHVlLCB0ZXh0ID0gdmFsdWUsIHNlbGVjdGVkID0gZmFsc2UsIGRpc2FibGVkID0gZmFsc2UpIC0+XG4gICAgaXNFbXB0eSA9IF8uaXNFbXB0eSB2YWx1ZVxuICAgIGFkZCA9IGZhbHNlXG4gICAgaWYgaXNFbXB0eSBhbmQgZmFsc2UgaXMgaGFzRW1wdHlcbiAgICAgIGhhc0VtcHR5ID0gdHJ1ZVxuICAgICAgYWRkID0gdHJ1ZVxuICAgIGlmIGZhbHNlIGlzIGFkZCBhbmQgZmFsc2UgaXMgaXNFbXB0eSB0aGVuIGFkZCA9IHRydWVcbiAgICBpZiBhZGRcbiAgICAgIHZhbCA9XG4gICAgICAgIHRleHQ6IHRleHRcbiAgICAgICAgcHJvcHM6XG4gICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICBpZiBzZWxlY3RlZFxuICAgICAgICB2YWwuc2VsZWN0ZWQgPSBzZWxlY3RlZFxuICAgICAgaWYgZGlzYWJsZWRcbiAgICAgICAgdmFsLmRpc2FibGVkID0gZGlzYWJsZWRcbiAgICAgIG9wdGlvbiA9IHJldC5tYWtlICdvcHRpb24nLCB2YWxcbiAgICAgIG9wdGlvblxuXG4gIHJldC5hZGQgJ2FkZE9wdGlvbnMnLCAob3B0aW9ucykgLT5cbiAgICB2YWx1ZXMgPSBfLnVuaW9uIHZhbHVlcywgb3B0aW9uc1xuICAgIE9KLmVhY2ggb3B0aW9ucywgKCh2YWwpIC0+XG4gICAgICB2YWx1ZSA9IHJldC5hZGRPcHRpb24odmFsKVxuICAgICAgdmFsdWVzLnB1c2ggdmFsdWVcbiAgICApLCBmYWxzZVxuICAgIHZhbHVlc1xuXG4gIHJldC5hZGQgJ3Jlc2V0T3B0aW9ucycsICh2YWx1ZXMpIC0+XG4gICAgcmV0LmVtcHR5KClcbiAgICB2YWx1ZXMgPSB2YWx1ZXNcbiAgICByZXQuYWRkT3B0aW9ucyB2YWx1ZXNcbiAgICByZXRcblxuICByZXQuYWRkICdyZW1vdmVPcHRpb24nLCAodmFsdWVUb1JlbW92ZSkgLT5cbiAgICB2YWx1ZXMuc3BsaWNlIHZhbHVlcy5pbmRleE9mKHZhbHVlVG9SZW1vdmUpLCAxICNyZW1vdmVzIHRoZSBpdGVtIGZyb20gdGhlIGxpc3RcbiAgICBzZWxlY3RDb250cm9sID0gcmV0WzBdXG4gICAgaSA9IDBcblxuICAgIHdoaWxlIGkgPCBzZWxlY3RDb250cm9sLmxlbmd0aFxuICAgICAgc2VsZWN0Q29udHJvbC5yZW1vdmUgaSAgaWYgc2VsZWN0Q29udHJvbC5vcHRpb25zW2ldLnZhbHVlIGlzIHZhbHVlVG9SZW1vdmVcbiAgICAgIGkrK1xuICAgIG51bGxcblxuXG5cbiAgaWYgZGVmYXVsdHMudmFsdWVzLmxlbmd0aCA+IDBcbiAgICByZXQuYWRkT3B0aW9ucyBkZWZhdWx0cy52YWx1ZXNcblxuIFxuXG4gIHJldFxuXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbmVsID0gcmVxdWlyZSAnLi4vZG9tL2VsZW1lbnQnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuYXJyYXkyRCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FycmF5MkQnXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuXG4jICMgdGFibGVcblxubm9kZU5hbWUgPSAndGFibGUnXG5cbiMjI1xuQ3JlYXRlIGFuIEhUTUwgdGFibGUuIFByb3ZpZGVzIGhlbHBlciBtZXRob2RzIHRvIGNyZWF0ZSBDb2x1bW5zIGFuZCBDZWxscy5cbiMjI1xubm9kZSA9IChvcHRpb25zLCBvd25lciA9IHJlcXVpcmUoJy4uL2RvbS9ib2R5JyksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XG5cbiAgIyAjIyBvcHRpb25zXG4gIGRlZmF1bHRzID1cbiAgICAjICMjIyBkYXRhXG4gICAgIyBvcHRpb25hbCBhcnJheSBvZiBvYmplY3RzLiBpZiBwcm92aWRlZCB3aWxsIGdlbmVyYXRlIHRhYmxlIGF1dG9tYXRpY2FsbHkuXG4gICAgZGF0YTogbnVsbFxuICAgICMgIyMjIHByb3BzXG4gICAgIyBvcHRpb25hbCBwcm9wZXJ0aWVzIHRvIGFwcGx5IHRvIHRhYmxlIHJvb3Qgbm9kZVxuICAgIHByb3BzOlxuICAgICAgY2VsbHBhZGRpbmc6IDBcbiAgICAgIGNlbGxzcGFjaW5nOiAwXG4gICAgICBhbGlnbjogJydcbiAgICAgIHdpZHRoOiAnJ1xuICAgICAgY2VsbGFsaWduOiAnbGVmdCdcbiAgICAgIGNlbGx2YWxpZ246ICd0b3AnXG4gICAgICBjbGFzczogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOiB7fVxuICAgICMgIyMjIGNlbGxzXG4gICAgIyBvcHRpb25hbCBwcm9wZXJ0aWVzIHRvIGFwcGx5IHRvIGluZGl2aWR1YWwgY2VsbHNcbiAgICBjZWxsczpcbiAgICAgIGNsYXNzOiAnJ1xuICAgICAgYWxpZ246ICcnXG4gICAgICAndmVydGljYWwtYWxpZ24nOiAnJ1xuICAgICAgY2VsbHBhZGRpbmc6ICcnXG4gICAgICBtYXJnaW46ICcnXG4gICAgIyAjIyMgdGhlYWRcbiAgICAjIG9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRvIHBhc3MgaW50byB0aGVhZCBjcmVhdGlvblxuICAgIHRoZWFkOiB7fVxuICAgICMgIyMjIHRib2R5XG4gICAgIyBvcHRpb25hbCBvcHRpb25zIG9iamVjdCB0byBwYXNzIGludG8gdGJvZHkgY3JlYXRpb25cbiAgICB0Ym9keToge31cblxuICAgIGZpcnN0QWxpZ25SaWdodDogZmFsc2VcbiAgICBvZGRBbGlnblJpZ2h0OiBmYWxzZVxuXG4gIHJvd3MgPSBbXVxuICBjZWxscyA9IGFycmF5MkQoKVxuICBjb2x1bW5Db3VudCA9IDBcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgcmV0ID0gZWwuZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxuIFxuXG4gIHRib2R5ID0gbnVsbFxuICB0aGVhZCA9IG51bGxcbiAgdGhlYWRSb3cgPSBudWxsXG5cbiAgIyAjIyMgaW5pdFxuICAjIGludGVybmFsIG1ldGhvZCBmb3Igb25lIHRpbWUgaW5pdGlhbGl6YXRpb24gb2YgdGhlIHRhYmxlXG4gIGluaXQgPSBfLm9uY2UgLT5cbiAgICBpZiBkZWZhdWx0cy5kYXRhXG4gICAgICB0YmxTdHIgPSBDb252ZXJ0SnNvblRvVGFibGUgZGVmYXVsdHMuZGF0YVxuICAgIGlmIHRibFN0clxuICAgICAgalRibCA9ICQgdGJsU3RyXG5cbiAgICAgIGpIZWFkID0galRibC5maW5kICd0aGVhZCdcbiAgICAgIHJldC4kLmFwcGVuZCBqSGVhZFxuICAgICAgdGhlYWQgPSBlbC5yZXN0b3JlRWxlbWVudCBqSGVhZFswXVxuICAgICAgdGhlYWRSb3cgPSBlbC5yZXN0b3JlRWxlbWVudCB0aGVhZFswXS5yb3dzWzBdXG5cbiAgICAgIGpCb2R5ID0galRibC5maW5kICd0Ym9keSdcbiAgICAgIHJldC4kLmFwcGVuZCBqQm9keVxuICAgICAgdGJvZHkgPSBlbC5yZXN0b3JlRWxlbWVudCBqQm9keVswXVxuXG4gICAgICBsb2FkQ2VsbHMoKVxuICAgIGVsc2VcbiAgICAgIHRoZWFkID0gcmV0Lm1ha2UgJ3RoZWFkJywgZGVmYXVsdHMudGhlYWRcbiAgICAgIHRoZWFkUm93ID0gdGhlYWQubWFrZSAndHInXG4gICAgICB0Ym9keSA9IHJldC5tYWtlICd0Ym9keScsIGRlZmF1bHRzLnRib2R5XG4gICAgICByb3dzLnB1c2ggdGJvZHkubWFrZSAndHInXG4gICAgcmV0XG5cbiAgIyAjIyMgbG9hZENlbGxzXG4gICMgaW50ZXJuYWwgbWV0aG9kIGd1YXJhbnRlZXMgdGhhdCB0YWJsZXMgbG9hZGVkIGZyb20gSlNPTiBhcmUgZnVsbHkgbG9hZGVkIGludG8gbWVtb3J5XG4gIGxvYWRDZWxscyA9ICgpIC0+XG4gICAgciA9IDBcbiAgICB3aGlsZSB0Ym9keVswXS5yb3dzLmxlbmd0aCA+IHJcbiAgICAgIGMgPSAwXG4gICAgICBtZW1Sb3cgPSBlbC5yZXN0b3JlRWxlbWVudCB0Ym9keVswXS5yb3dzW3JdXG4gICAgICByb3dzLnB1c2ggbWVtUm93XG4gICAgICB3aGlsZSB0Ym9keVswXS5yb3dzW3JdLmNlbGxzLmxlbmd0aCA+IGNcbiAgICAgICAgbWVtQ2VsbCA9IGNlbGxzLmdldCByKzEsIGMrMVxuICAgICAgICBpZiBub3QgbWVtQ2VsbFxuICAgICAgICAgIG1lbUNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCB0Ym9keVswXS5yb3dzW3JdLmNlbGxzW2NdXG4gICAgICAgICAgY2VsbHMuc2V0IHIrMSwgYysxLCBtZW1DZWxsXG4gICAgICAgIGMgKz0gMVxuICAgICAgciArPSAxXG5cbiAgIyAjIyMgZmlsbE1pc3NpbmdcbiAgIyBpbnRlcm5hbCBtZXRob2QgZ3VhcmFudGVlcyB0aGF0IGNlbGxzIGV4aXN0IGZvciB0aGUgZGltZW5zaW9ucyBvZiB0aGUgdGFibGVcbiAgZmlsbE1pc3NpbmcgPSAoKSAtPlxuICAgIGNlbGxzLmVhY2ggKHJvd05vLCBjb2xObywgdmFsKSAtPlxuICAgICAgaWYgbm90IHZhbFxuICAgICAgICByb3cgPSByZXQucm93IHJvd05vXG4gICAgICAgIHJvdy5jZWxsIGNvbE5vLCB7fVxuXG4gICMgIyMgY29sdW1uXG4gICMgQWRkcyBhIGNvbHVtbiBuYW1lIHRvIHRoZSB0YWJsZSBoZWFkXG4gIHJldC5hZGQgJ2NvbHVtbicsIChjb2xObywgY29sTmFtZSkgLT5cbiAgICByZXQuaW5pdCgpXG4gICAgY29sdW1uQ291bnQgKz0gMVxuICAgIHRoID0gbnVsbFxuICAgIGkgPSAwXG4gICAgd2hpbGUgdGhlYWRbMF0ucm93c1swXS5jZWxscy5sZW5ndGggPCBjb2xOb1xuICAgICAgbmF0aXZlVGggPSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzW2ldXG4gICAgICBpZiBub3QgbmF0aXZlVGhcbiAgICAgICAgdGggPSB0aGVhZFJvdy5tYWtlICd0aCcsIHt9XG4gICAgICBlbHNlXG4gICAgICAgIHRoID0gZWwucmVzdG9yZUVsZW1lbnQgbmF0aXZlVGgsICd0aCdcbiAgICAgIGkgKz0gMVxuICAgIGlmIG5vdCB0aFxuICAgICAgbmF0aXZlVGggPSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzW2NvbE5vLTFdXG4gICAgICB0aCA9IGVsLnJlc3RvcmVFbGVtZW50IG5hdGl2ZVRoLCAndGgnXG4gICAgdGgudGV4dCBjb2xOYW1lXG4gICAgdGhcblxuICAjICMjIHJvd1xuICAjIEFkZHMgYSBuZXcgcm93ICh0cikgdG8gdGhlIHRhYmxlIGJvZHlcbiAgcmV0LmFkZCAncm93JywgKHJvd05vLCBvcHRzKSAtPlxuICAgIHJvdyA9IHJvd3Nbcm93Tm8tMV1cblxuICAgIGlmIG5vdCByb3dcbiAgICAgIHdoaWxlIHJvd3MubGVuZ3RoIDwgcm93Tm9cbiAgICAgICAgcm93ID0gdGJvZHkubWFrZSAndHInLCB7fVxuICAgICAgICByb3dzLnB1c2ggcm93XG5cbiAgICBpZiBub3Qgcm93LmNlbGxcbiAgICAgIHJvdy5hZGQgJ2NlbGwnLCAoY29sTm8sIG9wdHMpIC0+XG4gICAgICAgIGNlbGwgPSBPSi5ub2Rlcy50ZCBvcHRzLCByb3dcbiAgICAgICAgY2VsbHMuc2V0IHJvd05vLCBjb2xObywgY2VsbFxuICAgICAgICBjZWxsXG5cbiAgICByb3dcblxuICAjICMjIGNlbGxcbiAgIyBBZGRzIGEgY2VsbCAodHIvdGQpIHRvIHRoZSB0YWJsZSBib2R5XG4gIHJldC5hZGQgJ2NlbGwnLCAocm93Tm8sIGNvbE5vLCBvcHRzKSAtPlxuICAgIGlmIHJvd05vIDwgMSB0aGVuIHJvd05vID0gMVxuICAgIGlmIGNvbE5vIDwgMSB0aGVuIGNvbE5vID0gMVxuICAgIGlmIGNvbHVtbkNvdW50ID4gMCBhbmQgY29sTm8tMSA+IGNvbHVtbkNvdW50IHRoZW4gdGhyb3cgbmV3IEVycm9yICdBIGNvbHVtbiBuYW1lIGhhcyBub3QgYmVlbiBkZWZpbmVkIGZvciB0aGlzIHBvc2l0aW9uIHsnICsgcm93Tm8gKyAneCcgKyBjb2xObyArICd9LidcblxuICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cblxuICAgIGNlbGwgPSBjZWxscy5nZXQgcm93Tm8sIGNvbE5vXG5cbiAgICBpZiBub3QgY2VsbFxuICAgICAgaSA9IDBcbiAgICAgIHdoaWxlIGkgPCBjb2xOb1xuICAgICAgICBpICs9IDFcbiAgICAgICAgaWYgaSBpcyBjb2xOb1xuICAgICAgICAgIG51T3B0cyA9IE9KLmV4dGVuZCB7cHJvcHM6IGRlZmF1bHRzLmNlbGxzfSwgb3B0c1xuICAgICAgICAgIGNlbGwgPSByb3cuY2VsbCBjb2xObywgbnVPcHRzXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0cnlDZWxsID0gY2VsbHMuZ2V0IHJvd05vLCBpXG4gICAgICAgICAgaWYgbm90IHRyeUNlbGxcbiAgICAgICAgICAgIHRyeUNlbGwgPSAgcm93LmNlbGwgaSwgcHJvcHM6IGRlZmF1bHRzLmNlbGxzXG5cbiAgICBjZWxsXG5cblxuXG4gICMgIyMgRmluYWxpemVcbiAgIyBGaW5hbGl6ZSBndWFyYW50ZWVzIHRoYXQgdGhlYWQgYW5kIHRib2R5IGFuZCBjcmVhdGVkIHdoZW4gdGhlIG5vZGUgaXMgZnVsbHkgaW5zdGFudGlhdGVkXG4gIHJldC5hZGQgJ2ZpbmFsaXplJywgLT5cbiAgICBpbml0KClcblxuICAgICMgIyMgVEhlYWRcbiAgICAjIEV4cG9zZSB0aGUgaW50ZXJuYWwgdGhlYWQgbm9kZVxuICAgIHJldC5hZGQgJ3RoZWFkJywgdGhlYWRcblxuICAgICMgIyMgVEJvZHlcbiAgICAjIEV4cG9zZSB0aGUgaW50ZXJuYWwgdGJvZHkgbm9kZVxuICAgIHJldC5hZGQgJ3Rib2R5JywgdGJvZHlcblxuICAgIHJldFxuXG4gIHJldFxuXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxubW9kdWxlLmV4cG9ydHMgPSBub2RlXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuZWwgPSByZXF1aXJlICcuLi9kb20vZWxlbWVudCdcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXG5cbm5vZGVOYW1lID0gJ3RleHRhcmVhJ1xuXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gcmVxdWlyZSgnLi4vZG9tL2JvZHknKSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICBuYW1lOiAnJ1xuICAgICAgcGxhY2Vob2xkZXI6ICcnXG4gICAgICB2YWx1ZTogJydcbiAgICAgIHRleHQ6ICcnXG4gICAgICBtYXhsZW5ndGg6ICcnXG4gICAgICBhdXRvZm9jdXM6IGZhbHNlXG4gICAgICBpc1JlcXVpcmVkOiBmYWxzZVxuICAgICAgcm93czogM1xuICAgICAgY29sczogMjVcbiAgICAgIGRpc2FibGVkOiBmYWxzZVxuICAgICAgcmVhZG9ubHk6IGZhbHNlXG4gICAgICBmb3JtOiAnJ1xuICAgICAgd3JhcDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICB2YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXG5cbiAgc3luY1ZhbHVlID0gLT5cbiAgICBzd2l0Y2ggZGVmYXVsdHMucHJvcHMudHlwZVxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLmNoZWNrYm94XG4gICAgICAgIHZhbHVlID0gcmV0LiQuaXMoJzpjaGVja2VkJylcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5yYWRpb1xuICAgICAgICB2YWx1ZSA9IHJldC4kLmZpbmQoJzpjaGVja2VkJykudmFsKClcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsdWUgPSByZXQudmFsKClcblxuICAjIENsaWNrIGJpbmRpbmdcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxuICAgIGNsaWNrID0gZGVmYXVsdHMuZXZlbnRzLmNsaWNrXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XG4gICAgICByZXR2YWwgPSBjbGljayBldmVudC4uLlxuICAgICAgc3luY1ZhbHVlKClcbiAgICAgIHJldHZhbFxuICAgIGRlZmF1bHRzLmV2ZW50cy5jbGljayA9IG5ld0NsaWNrXG5cbiAgIyBDaGFuZ2UgYmluZGluZ1xuICBpZiBkZWZhdWx0cy5ldmVudHMuY2hhbmdlIGlzbnQgT0oubm9vcFxuICAgIGNoYW5nZSA9IGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2VcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XG4gICAgICByZXR2YWwgPSBjaGFuZ2UgZXZlbnQuLi5cbiAgICAgIHN5bmNWYWx1ZSgpXG4gICAgICByZXR2YWxcbiAgICBkZWZhdWx0cy5ldmVudHMuY2hhbmdlID0gbmV3Q2hhbmdlXG5cbiAgcmV0ID0gZWwuZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxuXG5cbiBcblxuICByZXRcblxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5lbCA9IHJlcXVpcmUgJy4uL2RvbS9lbGVtZW50J1xuXG5ub2RlTmFtZSA9ICd0aGVhZCdcblxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IHJlcXVpcmUoJy4uL2RvbS9ib2R5JyksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOiB7fVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuICAgIG51bWJlcjogMVxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGVsLmVsZW1lbnQgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcblxuIFxuXG4gIHJvd3MgPSBbXVxuICBjZWxscyA9IHt9XG4gIHJldC5hZGQgJ2NlbGwnLCAocm93Tm8sIGNvbE5vKSAtPlxuICAgIGluaXQoKVxuXG4gICAgaWYgcm93Tm8gPCAxIHRoZW4gcm93Tm8gPSAxXG4gICAgaWYgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXG5cbiAgICByb3cgPSByb3dzW3Jvd05vLTFdXG5cbiAgICBpZiBub3Qgcm93XG4gICAgICB3aGlsZSByb3dzLmxlbmd0aCA8IHJvd05vXG4gICAgICAgIHJvdyA9IE9KLm5vZGVzLnRyIHt9LCB0Ym9keSwgZmFsc2VcbiAgICAgICAgcm93cy5wdXNoIHJvd1xuXG4gICAgdGQgPSByb3dbMF0uY2VsbHNbY29sTm9dXG5cbiAgICBpZiB0ZCB0aGVuIGNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCB0ZCwgJ3RkJ1xuICAgIGlmIG5vdCB0ZFxuICAgICAgd2hpbGUgcm93WzBdLmNlbGxzLmxlbmd0aCA8IGNvbE5vXG4gICAgICAgIGlkeCA9IHJvd1swXS5jZWxscy5sZW5ndGhcbiAgICAgICAgdGQgPSByb3dbMF0uY2VsbHNbaWR4LTFdXG4gICAgICAgIGlmIHRkIGFuZCBpZHggaXMgY29sTm9cbiAgICAgICAgICBjZWxsID0gZWwucmVzdG9yZUVsZW1lbnQgdGQsICd0ZCdcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGNlbGwgPSBPSi5ub2Rlcy50ZCBwcm9wczogZGVmYXVsdHMuY2VsbHMsIHJvdywgZmFsc2VcblxuICAgIGlmIG5vdCBjZWxsLmlzVmFsaWRcbiAgICAgIG5vZGVGYWN0b3J5IGNlbGwsIHJvdywgcm93Tm8gKyBjb2xOb1xuXG4gICAgY2VsbFxuXG4gIHJldFxuXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxubW9kdWxlLmV4cG9ydHMgPSBub2RlXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuZWwgPSByZXF1aXJlICcuLi9kb20vZWxlbWVudCdcblxubm9kZU5hbWUgPSAndWwnXG5cbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSByZXF1aXJlKCcuLi9kb20vYm9keScpLCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczoge31cbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcbiAgcmV0ID0gZWwuZWxlbWVudCBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxuXG5cbiBcblxuICByZXRcblxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsInRoaXNHbG9iYWwgPSAoaWYgKHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsKSB0aGVuIGdsb2JhbCBlbHNlIChpZiAodHlwZW9mIHNlbGYgaXNudCAndW5kZWZpbmVkJyBhbmQgc2VsZikgdGhlbiBzZWxmIGVsc2UgKGlmICh0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgYW5kIHdpbmRvdykgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkpXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXNHbG9iYWwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2J1dHRvbmlucHV0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gcmVxdWlyZSgnLi4vZG9tL2JvZHknKSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuICAgICAgc3JjOiAnJ1xuICAgICAgYWx0OiAnJ1xuICAgICAgaGVpZ2h0OiAnJ1xuICAgICAgd2lkdGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG5cblxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdjaGVja2JveCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IHJlcXVpcmUoJy4uL2RvbS9ib2R5JykpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIGNoZWNrZWQ6IGZhbHNlXG4gICAgaW5kZXRlcm1pbmF0ZTogZmFsc2VcbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgaWYgZGVmYXVsdHMuY2hlY2tlZFxuICAgIHJldC5hdHRyICdjaGVja2VkJywgdHJ1ZVxuICBlbHNlIGlmIGRlZmF1bHRzLmluZGV0ZXJtaW5hdGVcbiAgICByZXQuYXR0ciAnaW5kZXRlcm1pbmF0ZScsIHRydWVcblxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdjb2xvcidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IHJlcXVpcmUoJy4uL2RvbS9ib2R5JykpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdkYXRlJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gcmVxdWlyZSgnLi4vZG9tL2JvZHknKSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnZGF0ZXRpbWUnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSByZXF1aXJlKCcuLi9kb20vYm9keScpKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2RhdGV0aW1lLWxvY2FsJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gcmVxdWlyZSgnLi4vZG9tL2JvZHknKSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdlbWFpbCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IHJlcXVpcmUoJy4uL2RvbS9ib2R5JykpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgICBtdWx0aXBsZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdmaWxlJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gcmVxdWlyZSgnLi4vZG9tL2JvZHknKSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIGFjY2VwdDogJydcbiAgICAgIG11bHRpcGxlOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2hpZGRlbidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IHJlcXVpcmUoJy4uL2RvbS9ib2R5JykpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnaW1hZ2VpbnB1dCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IHJlcXVpcmUoJy4uL2RvbS9ib2R5JykpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogJ2ltYWdlJ1xuICAgICAgc3JjOiAnJ1xuICAgICAgYWx0OiAnJ1xuICAgICAgaGVpZ2h0OiAnJ1xuICAgICAgd2lkdGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnbW9udGgnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSByZXF1aXJlKCcuLi9kb20vYm9keScpKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ251bWJlcidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IHJlcXVpcmUoJy4uL2RvbS9ib2R5JykpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncGFzc3dvcmQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSByZXF1aXJlKCcuLi9kb20vYm9keScpKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgbWF4bGVuZ3RoOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3JhZGlvJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gcmVxdWlyZSgnLi4vZG9tL2JvZHknKSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIG5hbWU6ICcnXG4gICAgICB2YWx1ZTogJydcbiAgICAgIGNoZWNrZWQ6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncmFuZ2UnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSByZXF1aXJlKCcuLi9kb20vYm9keScpKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgbWluOiAwXG4gICAgICBtYXg6IDEwMFxuICAgICAgdmFsdWU6IDUwXG4gICAgICBzdGVwOiAxXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncmVzZXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSByZXF1aXJlKCcuLi9kb20vYm9keScpKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3NlYXJjaCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IHJlcXVpcmUoJy4uL2RvbS9ib2R5JykpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnc3VibWl0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gcmVxdWlyZSgnLi4vZG9tL2JvZHknKSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0ZWwnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSByZXF1aXJlKCcuLi9kb20vYm9keScpKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgcGF0dGVybjogJydcbiAgICAgIG1heGxlbmd0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0ZXh0aW5wdXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSByZXF1aXJlKCcuLi9kb20vYm9keScpKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgYXV0b2NvbXBsZXRlOiAnb24nXG4gICAgICBhdXRvc2F2ZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0aW1lJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gcmVxdWlyZSgnLi4vZG9tL2JvZHknKSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd1cmwnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSByZXF1aXJlKCcuLi9kb20vYm9keScpKSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgcGF0dGVybjogJydcbiAgICAgIG1heGxlbmd0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd3ZWVrJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gcmVxdWlyZSgnLi4vZG9tL2JvZHknKSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiIyAjIE9KXG50aGlzR2xvYmFsID0gcmVxdWlyZSAnLi9nbG9iYWwnXG51dGlsTGliID0gcmVxdWlyZSAnanF1ZXJ5J1xubmFtZVNwYWNlTmFtZSA9ICdPSidcblxuIyMjXG5ib290IHN0cmFwIG5hbWUgbWV0aG9kIGludG8gT2JqZWN0IHByb3RvdHlwZVxuIyMjXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBPYmplY3Q6OixcbiAgZ2V0SW5zdGFuY2VOYW1lOlxuICAgIHZhbHVlOiAtPlxuICAgICAgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLnsxLH0pXFwoL1xuICAgICAgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKEBjb25zdHJ1Y3Rvci50b1N0cmluZygpKVxuICAgICAgKGlmIChyZXN1bHRzIGFuZCByZXN1bHRzLmxlbmd0aCA+IDEpIHRoZW4gcmVzdWx0c1sxXSBlbHNlICcnKVxuXG5cbiMjI1xuQW4gaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5hbWVzcGFjZSB0cmVlXG4jIyNcbk5zVHJlZSA9IHt9XG5tYWtlVGhlSnVpY2UgPSAtPlxuXG4gICMjI1xuICBJbnRlcm5hbCBuYW1lU3BhY2VOYW1lIG1ldGhvZCB0byBjcmVhdGUgbmV3ICdzdWInIG5hbWVzcGFjZXMgb24gYXJiaXRyYXJ5IGNoaWxkIG9iamVjdHMuXG4gICMjI1xuICBtYWtlTmFtZVNwYWNlID0gKHNwYWNlbmFtZSwgdHJlZSkgLT5cbiAgICAjIyNcbiAgICBUaGUgZGVyaXZlZCBpbnN0YW5jZSB0byBiZSBjb25zdHJ1Y3RlZFxuICAgICMjI1xuICAgIEJhc2UgPSAobnNOYW1lKSAtPlxuICAgICAgcHJvdG8gPSB0aGlzXG4gICAgICB0cmVlW25zTmFtZV0gPSB0cmVlW25zTmFtZV0gb3Ige31cbiAgICAgIG5zVHJlZSA9IHRyZWVbbnNOYW1lXVxuICAgICAgbWVtYmVycyA9IHt9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAnbWVtYmVycycsIHZhbHVlOiBtZW1iZXJzXG5cbiAgICAgICMjI1xuICAgICAgUmVnaXN0ZXIgKGUuZy4gJ0xpZnQnKSBhbiBPYmplY3QgaW50byB0aGUgcHJvdG90eXBlIG9mIHRoZSBuYW1lc3BhY2UuXG4gICAgICBUaGlzIE9iamVjdCB3aWxsIGJlIHJlYWRhYmxlL2V4ZWN1dGFibGUgYnV0IGlzIG90aGVyd2lzZSBpbW11dGFibGUuXG4gICAgICAjIyNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAncmVnaXN0ZXInLFxuICAgICAgICB2YWx1ZTogKG5hbWUsIG9iaiwgZW51bWVyYWJsZSkgLT5cbiAgICAgICAgICAndXNlIHN0cmljdCdcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsaWZ0IGEgbmV3IHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIG5hbWUgaXNudCAnc3RyaW5nJykgb3IgbmFtZSBpcyAnJ1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIHByb3BlcnR5IGluc3RhbmNlLicpICB1bmxlc3Mgb2JqXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9wZXJ0eSBuYW1lZCAnICsgbmFtZSArICcgaXMgYWxyZWFkeSBkZWZpbmVkIG9uICcgKyBzcGFjZW5hbWUgKyAnLicpICBpZiBwcm90b1tuYW1lXVxuXG4gICAgICAgICAgbWVtYmVyc1tuYW1lXSA9IG1lbWJlcnNbbmFtZV0gb3IgbmFtZVxuXG4gICAgICAgICAgI0d1YXJkIGFnYWluc3Qgb2JsaXRlcmF0aW5nIHRoZSB0cmVlIGFzIHRoZSB0cmVlIGlzIHJlY3Vyc2l2ZWx5IGV4dGVuZGVkXG4gICAgICAgICAgbnNUcmVlW25hbWVdID0gbnNUcmVlW25hbWVdIG9yXG4gICAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgICAgICB0eXBlOiB0eXBlb2Ygb2JqXG4gICAgICAgICAgICBpbnN0YW5jZTogKGlmIG9iai5nZXRJbnN0YW5jZU5hbWUgdGhlbiBvYmouZ2V0SW5zdGFuY2VOYW1lKCkgZWxzZSAndW5rbm93bicpXG5cbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgcHJvdG8sIG5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogb2JqXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSBpc250IGVudW1lcmFibGVcblxuICAgICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHNwYWNlbmFtZSArICcuJyArIG5hbWVcbiAgICAgICAgICBvYmpcblxuXG4gICAgICAjIyNcbiAgICAgIENyZWF0ZSBhIG5ldywgc3RhdGljIG5hbWVzcGFjZSBvbiB0aGUgY3VycmVudCBwYXJlbnQgKGUuZy4gbnNOYW1lLnRvLi4uIHx8IG5zTmFtZS5pcy4uLilcbiAgICAgICMjI1xuICAgICAgcHJvdG8ucmVnaXN0ZXIgJ21ha2VTdWJOYW1lU3BhY2UnLCAoKHN1Yk5hbWVTcGFjZSkgLT5cbiAgICAgICAgJ3VzZSBzdHJpY3QnXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIG5ldyBzdWIgbmFtZXNwYWNlIHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIHN1Yk5hbWVTcGFjZSBpc250ICdzdHJpbmcnKSBvciBzdWJOYW1lU3BhY2UgaXMgJydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdWIgbmFtZXNwYWNlIG5hbWVkICcgKyBzdWJOYW1lU3BhY2UgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKSAgaWYgcHJvdG8uc3ViTmFtZVNwYWNlXG4gICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHN1Yk5hbWVTcGFjZVxuICAgICAgICBuZXdOYW1lU3BhY2UgPSBtYWtlTmFtZVNwYWNlKHN1Yk5hbWVTcGFjZSwgbnNUcmVlKVxuICAgICAgICBuZXdOYW1lU3BhY2UucmVnaXN0ZXIgJ2NvbnN0YW50cycsIG1ha2VOYW1lU3BhY2UoJ2NvbnN0YW50cycsIG5zVHJlZSksIGZhbHNlICBpZiBzdWJOYW1lU3BhY2UgaXNudCAnY29uc3RhbnRzJ1xuICAgICAgICBwcm90by5yZWdpc3RlciBzdWJOYW1lU3BhY2UsIG5ld05hbWVTcGFjZSwgZmFsc2VcbiAgICAgICAgbmV3TmFtZVNwYWNlXG4gICAgICApLCBmYWxzZVxuICAgICAgcmV0dXJuXG5cbiAgICAjIyNcbiAgICBBbiBpbnRlcm5hbCBtZWNoYW5pc20gdG8gcmVwcmVzZW50IHRoZSBpbnN0YW5jZSBvZiB0aGlzIG5hbWVzcGFjZVxuICAgIEBjb25zdHJ1Y3RvclxuICAgIEBpbnRlcm5hbFxuICAgIEBtZW1iZXJPZiBtYWtlTmFtZVNwYWNlXG4gICAgIyMjXG4gICAgQ2xhc3MgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiBmdW5jdGlvbiAnICsgc3BhY2VuYW1lICsgJygpe30nKSgpXG4gICAgQ2xhc3M6OiA9IG5ldyBCYXNlKHNwYWNlbmFtZSlcblxuICAgICNDbGFzcy5wcm90b3R5cGUucGFyZW50ID0gQmFzZS5wcm90b3R5cGU7XG4gICAgbmV3IENsYXNzKHNwYWNlbmFtZSlcblxuICAjIyNcbiAgJ0RlcGVuZCcgYW4gT2JqZWN0IHVwb24gYW5vdGhlciBtZW1iZXIgb2YgdGhpcyBuYW1lc3BhY2UsIHVwb24gYW5vdGhlciBuYW1lc3BhY2UsXG4gIG9yIHVwb24gYSBtZW1iZXIgb2YgYW5vdGhlciBuYW1lc3BhY2VcbiAgIyMjXG4gIGRlcGVuZHNPbiA9IChkZXBlbmRlbmNpZXMsIGNhbGxCYWNrLCBpbXBvcnRzKSAtPlxuICAgICd1c2Ugc3RyaWN0J1xuICAgIHJldCA9IGZhbHNlXG4gICAgbnNNZW1iZXJzID0gbnNJbnRlcm5hbC5nZXROc01lbWJlcnMoKVxuICAgIGlmIGRlcGVuZGVuY2llcyBhbmQgZGVwZW5kZW5jaWVzLmxlbmd0aCA+IDAgYW5kIGNhbGxCYWNrXG4gICAgICBtaXNzaW5nID0gZGVwZW5kZW5jaWVzLmZpbHRlcigoZGVwZW4pIC0+XG4gICAgICAgIG5zTWVtYmVycy5pbmRleE9mKGRlcGVuKSBpcyAtMSBhbmQgKG5vdCBpbXBvcnRzIG9yIGltcG9ydHMgaXNudCBkZXBlbilcbiAgICAgIClcbiAgICAgIGlmIG1pc3NpbmcubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0ID0gdHJ1ZVxuICAgICAgICBjYWxsQmFjaygpXG4gICAgICBlbHNlXG4gICAgICAgIG5zSW50ZXJuYWwuZGVwZW5kZW50cy5wdXNoIChpbXBvcnRzKSAtPlxuICAgICAgICAgIGRlcGVuZHNPbiBtaXNzaW5nLCBjYWxsQmFjaywgaW1wb3J0c1xuXG4gICAgcmV0XG4gIG5zSW50ZXJuYWwgPSBkZXBlbmRlbnRzOiBbXVxuXG4gICMjI1xuICBGZXRjaGVzIHRoZSByZWdpc3RlcmVkIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgb24gdGhlIG5hbWVzcGFjZSBhbmQgaXRzIGNoaWxkIG5hbWVzcGFjZXNcbiAgIyMjXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBuc0ludGVybmFsLCAnZ2V0TnNNZW1iZXJzJyxcbiAgICB2YWx1ZTogLT5cbiAgICAgIHJlY3Vyc2VUcmVlID0gKGtleSwgbGFzdEtleSkgLT5cbiAgICAgICAgbWVtYmVycy5wdXNoIGxhc3RLZXkgKyAnLicgKyBrZXkgIGlmIHR5cGVvZiAoa2V5KSBpcyAnc3RyaW5nJ1xuICAgICAgICBpZiB1dGlsTGliLmlzUGxhaW5PYmplY3Qoa2V5KVxuICAgICAgICAgIE9iamVjdC5rZXlzKGtleSkuZm9yRWFjaCAoaykgLT5cbiAgICAgICAgICAgIG1lbWJlcnMucHVzaCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdHlwZW9mIChrKSBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgcmVjdXJzZVRyZWUga2V5W2tdLCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KGtleVtrXSlcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJldHVyblxuICAgICAgbWVtYmVycyA9IFtdXG4gICAgICBPYmplY3Qua2V5cyhOc1RyZWVbbmFtZVNwYWNlTmFtZV0pLmZvckVhY2ggKGtleSkgLT5cbiAgICAgICAgcmVjdXJzZVRyZWUgTnNUcmVlW25hbWVTcGFjZU5hbWVdW2tleV0sIG5hbWVTcGFjZU5hbWUgIGlmIHV0aWxMaWIuaXNQbGFpbk9iamVjdChOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG1lbWJlcnNcblxuICAjIyNcbiAgVG8gc3VwcG9ydCBkZXBlbmRlbmN5IG1hbmFnZW1lbnQsIHdoZW4gYSBwcm9wZXJ0eSBpcyBsaWZ0ZWQgb250byB0aGUgbmFtZXNwYWNlLCBub3RpZnkgZGVwZW5kZW50cyB0byBpbml0aWFsaXplXG4gICMjI1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnNJbnRlcm5hbCwgJ2FsZXJ0RGVwZW5kZW50cycsXG4gICAgdmFsdWU6IChpbXBvcnRzKSAtPlxuICAgICAgZGVwcyA9IG5zSW50ZXJuYWwuZGVwZW5kZW50cy5maWx0ZXIoKGRlcE9uKSAtPlxuICAgICAgICBmYWxzZSBpcyBkZXBPbihpbXBvcnRzKVxuICAgICAgKVxuICAgICAgbnNJbnRlcm5hbC5kZXBlbmRlbnRzID0gZGVwcyAgaWYgQXJyYXkuaXNBcnJheShkZXBzKVxuXG4gICNDcmVhdGUgdGhlIHJvb3Qgb2YgdGhlIHRyZWUgYXMgdGhlIGN1cnJlbnQgbmFtZXNwYWNlXG4gIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSA9IHt9XG4gICNEZWZpbmUgdGhlIGNvcmUgbmFtZXNwYWNlIGFuZCB0aGUgcmV0dXJuIG9mIHRoaXMgY2xhc3NcbiAgTnNPdXQgPSBtYWtlTmFtZVNwYWNlKG5hbWVTcGFjZU5hbWUsIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSlcblxuICAjIyNcbiAgQ2FjaGUgYSBoYW5kbGUgb24gdGhlIHZlbmRvciAocHJvYmFibHkgalF1ZXJ5KSBvbiB0aGUgcm9vdCBuYW1lc3BhY2VcbiAgIyMjXG4gIE5zT3V0LnJlZ2lzdGVyICc/JywgdXRpbExpYiwgZmFsc2VcblxuICAjIyNcbiAgQ2FjaGUgdGhlIHRyZWUgKHVzZWZ1bCBmb3IgZG9jdW1lbnRhdGlvbi92aXN1YWxpemF0aW9uL2RlYnVnZ2luZylcbiAgIyMjXG4gIE5zT3V0LnJlZ2lzdGVyICd0cmVlJywgTnNUcmVlW25hbWVTcGFjZU5hbWVdLCBmYWxzZVxuXG4gICMjI1xuICBDYWNoZSB0aGUgbmFtZSBzcGFjZSBuYW1lXG4gICMjI1xuICBOc091dC5yZWdpc3RlciAnbmFtZScsIG5hbWVTcGFjZU5hbWUsIGZhbHNlXG4gIE5zT3V0LnJlZ2lzdGVyICdkZXBlbmRzT24nLCBkZXBlbmRzT24sIGZhbHNlXG4gIE5zT3V0XG5cblxuIyMjXG5BY3R1YWxseSBkZWZpbmUgdGhlIE9KIE5hbWVTcGFjZVxuIyMjXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgdGhpc0dsb2JhbCwgbmFtZVNwYWNlTmFtZSxcbiAgdmFsdWU6IG1ha2VUaGVKdWljZSgpXG5cbk9KLnJlZ2lzdGVyICdnbG9iYWwnLCB0aGlzR2xvYmFsXG5cbnRoaXNEb2N1bWVudCA9IHt9XG5pZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xuICB0aGlzRG9jdW1lbnQgPSBkb2N1bWVudFxuXG5PSi5yZWdpc3RlciAnZG9jdW1lbnQnLCB0aGlzRG9jdW1lbnRcblxuT0oucmVnaXN0ZXIgJ25vb3AnLCAtPlxuXG5tb2R1bGUuZXhwb3J0cyA9IE9KIiwiICMgIyBPSiBQb3N0LUluaXRpYWxpemF0aW9uXHJcblxyXG5PSiA9IHJlcXVpcmUgJy4vb2onXHJcbl8gPSByZXF1aXJlICdsb2Rhc2gnXHJcblxyXG4jIFNpbXBsZSBhcnJheSBvZiBhbnRpY2lwYXRlZC9rbm93biBjaGlsZCBuYW1lc3BhY2VzXHJcbiAgXHJcbnN1Yk5hbWVTcGFjZXMgPSBbXHJcbiAgJ2Vycm9ycydcclxuICAnZW51bXMnXHJcbiAgJ2luc3RhbmNlT2YnXHJcbiAgJ25vZGVzJ1xyXG4gICdkYidcclxuICAnY29tcG9uZW50cydcclxuICAnY29udHJvbHMnXHJcbiAgJ2lucHV0cydcclxuICAnbm90aWZpY2F0aW9ucydcclxuICAnaGlzdG9yeSdcclxuICAnY29va2llJ1xyXG4gICdhc3luYydcclxuXVxyXG5cclxuIyAjIyBTdWJOYW1lU3BhY2VzXHJcblxyXG4jIFByZS1hbGxvY2F0ZSBjZXJ0YWluIGNvbW1vbiBuYW1lc3BhY2VzIHRvIGF2b2lkIGZ1dHVyZSByYWNlIGNvbmRpdGlvbnMuXHJcbiMgVGhpcyBkb2VzIHJlcXVpcmUgdGhhdCB0aGUgb3JkZXIgb2Ygb3BlcmF0aW9ucyBsb2FkcyBPSi5jb2ZmZWUgZmlyc3QgYW5kIG9KSW5pdC5jb2ZmZWUgc2Vjb25kXHJcbl8uZWFjaCBzdWJOYW1lU3BhY2VzLCAobmFtZSkgLT5cclxuICBPSi5tYWtlU3ViTmFtZVNwYWNlIG5hbWVcclxuICBcclxuIyAjIyBDb25maWd1cmF0aW9uIHZhcmlhYmxlc1xyXG5cclxuIyBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlIHVuaXF1ZSBJRHMgZm9yIGVhY2ggbm9kZSAoZGVmYXVsdCBmYWxzZSlcclxuT0pbJ0dFTkVSQVRFX1VOSVFVRV9JRFMnXSA9IGZhbHNlXHJcbiMgRGVmYXVsdCByb290IG5vZGUgZm9yIGNvbXBvbmVudHMvY29udHJvbHMgKGRlZmF1bHQgJ2RpdicpXHJcbk9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gPSAnZGl2J1xyXG4jIFdoZXRoZXIgdG8gaG9vayBpbnRvIHRoZSBnbG9iYWwgb24gZXJyb3IgZXZlbnQgdG8gd3JpdGUgZXJyb3JzIHRvIGNvbnNvbGUgKGRlZmF1bHQgZmFsc2UpXHJcbk9KWydUUkFDS19PTl9FUlJPUiddID0gZmFsc2VcclxuI1doZXRoZXIgdG8gbG9nIGFsbCBBSkFYIHJlcXVlc3RzXHJcbk9KWydMT0dfQUxMX0FKQVgnXSA9IGZhbHNlXHJcbiNXaGV0aGVyIHRvIGxvZyBhbGwgQUpBWCBlcnJvcnNcclxuT0pbJ0xPR19BTExfQUpBWF9FUlJPUlMnXSA9IGZhbHNlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuYXJyYXkyRCA9IChpbml0TGVuZ3RoLCBpbml0V2lkdGgpIC0+XHJcbiAgYXJyYXkgPSBbXVxyXG4gIG1heExlbmd0aCA9IDBcclxuICBtYXhXaWR0aCA9IDBcclxuICAgIFxyXG4gIHJldCA9IFxyXG4gICAgZ2V0OiAocm93Tm8sIGNvbE5vKSAtPlxyXG4gICAgICBleHRlbmQgcm93Tm8sIGNvbE5vXHJcbiAgICBzZXQ6IChyb3dObywgY29sTm8sIHZhbCkgLT5cclxuICAgICAgcmV0LmdldCByb3dObywgY29sTm9cclxuICAgICAgcm93SWR4ID0gcm93Tm8tMVxyXG4gICAgICBjb2xJZHggPSBjb2xOby0xXHJcbiAgICAgIGFycmF5W3Jvd0lkeF1bY29sSWR4XSA9IHZhbFxyXG4gICAgZWFjaDogKGNhbGxCYWNrKSAtPlxyXG4gICAgICBfLmVhY2ggYXJyYXksIChjb2x1bW5zLCByb3cpIC0+XHJcbiAgICAgICAgXy5lYWNoIGFycmF5W3Jvd10sICh2YWwsIGNvbCkgLT5cclxuICAgICAgICAgIHJvd0lkeCA9IHJvdysxXHJcbiAgICAgICAgICBjb2xJZHggPSBjb2wrMVxyXG4gICAgICAgICAgY2FsbEJhY2sgcm93SWR4LCBjb2xJZHgsIHZhbFxyXG4gICAgd2lkdGg6ICgpIC0+XHJcbiAgICAgIG1heFdpZHRoXHJcbiAgICBsZW5ndGg6ICgpIC0+XHJcbiAgICAgIG1heExlbmd0aFxyXG4gICAgICAgICBcclxuICAjIyNcclxuICBHdWFyYW50ZWUgdGhhdCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgYXJyYXkgYXJlIGFsd2F5cyBiYWNrZWQgYnkgdmFsdWVzIGF0IGV2ZXJ5IHBvc2l0aW9uXHJcbiAgIyMjICAgICAgICAgICAgICAgICAgICBcclxuICBleHRlbmQgPSAobGVuZ3RoLCB3aWR0aCkgLT4gIFxyXG4gICAgaWYgbm90IGxlbmd0aCBvciBsZW5ndGggPCAxIHRoZW4gbGVuZ3RoID0gMVxyXG4gICAgaWYgbm90IHdpZHRoIG9yIHdpZHRoIDwgMSB0aGVuIHdpZHRoID0gMVxyXG4gICAgICBcclxuICAgIGlmIG1heExlbmd0aCA8IGxlbmd0aCB0aGVuIG1heExlbmd0aCA9IGxlbmd0aFxyXG4gICAgaWYgYXJyYXkubGVuZ3RoID4gbWF4TGVuZ3RoIHRoZW4gbWF4TGVuZ3RoID0gYXJyYXkubGVuZ3RoXHJcbiAgICBpZiBtYXhXaWR0aCA8IHdpZHRoIHRoZW4gbWF4V2lkdGggPSB3aWR0aFxyXG4gICAgaSA9IDBcclxuICAgICAgXHJcbiAgICB3aGlsZSBpIDwgbWF4TGVuZ3RoXHJcbiAgICAgIHRyeVJvdyA9IGFycmF5W2ldXHJcbiAgICAgIGlmIG5vdCB0cnlSb3dcclxuICAgICAgICB0cnlSb3cgPSBbXVxyXG4gICAgICAgIGFycmF5LnB1c2ggdHJ5Um93XHJcbiAgICAgIGlmIG1heFdpZHRoIDwgdHJ5Um93Lmxlbmd0aCB0aGVuIG1heFdpZHRoID0gdHJ5Um93Lmxlbmd0aFxyXG4gICAgICBpZiB0cnlSb3cubGVuZ3RoIDwgbWF4V2lkdGggdGhlbiB0cnlSb3cubGVuZ3RoID0gbWF4V2lkdGhcclxuICAgICAgaSArPSAxXHJcbiAgICAgIFxyXG4gICAgYXJyYXlbbGVuZ3RoLTFdW3dpZHRoLTFdXHJcbiAgICAgICBcclxuICBleHRlbmQgaW5pdExlbmd0aCwgaW5pdFdpZHRoXHJcbiAgICBcclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdhcnJheTJEJywgYXJyYXkyRFxyXG5tb2R1bGUuZXhwb3J0cyA9IGFycmF5MkQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5tZXRob2RzID0gW1xyXG4gICdhc3NlcnQnXHJcbiAgJ2NsZWFyJ1xyXG4gICdjb3VudCdcclxuICAnZGVidWcnXHJcbiAgJ2RpcidcclxuICAnZGlyeG1sJ1xyXG4gICdlcnJvcidcclxuICAnZXhjZXB0aW9uJ1xyXG4gICdncm91cCdcclxuICAnZ3JvdXBDb2xsYXBzZWQnXHJcbiAgJ2dyb3VwRW5kJ1xyXG4gICdpbmZvJ1xyXG4gICdsb2cnXHJcbiAgJ21lbW9yeSdcclxuICAncHJvZmlsZSdcclxuICAncHJvZmlsZUVuZCdcclxuICAndGFibGUnXHJcbiAgJ3RpbWUnXHJcbiAgJ3RpbWVFbmQnXHJcbiAgJ3RpbWVTdGFtcCdcclxuICAndGltZWxpbmUnXHJcbiAgJ3RpbWVsaW5lRW5kJ1xyXG4gICd0cmFjZSdcclxuICAnd2FybidcclxuXVxyXG5tZXRob2RMZW5ndGggPSBtZXRob2RzLmxlbmd0aFxyXG5jb25zb2xlID0gT0ouZ2xvYmFsLmNvbnNvbGUgb3Ige31cclxuT0oubWFrZVN1Yk5hbWVTcGFjZSAnY29uc29sZSdcclxuICBcclxuIyMjXHJcbjEuIFN0dWIgb3V0IGFueSBtaXNzaW5nIG1ldGhvZHMgd2l0aCBub29wXHJcbjIuIERlZmluZSB0aGUgYXZhaWxhYmxlIG1ldGhvZHMgb24gdGhlIE9KLmNvbnNvbGUgb2JqZWN0XHJcbiMjI1xyXG53aGlsZSBtZXRob2RMZW5ndGgtLVxyXG4gICgtPlxyXG4gICAgbWV0aG9kID0gbWV0aG9kc1ttZXRob2RMZW5ndGhdXHJcbiAgICBcclxuICAgICMgT25seSBzdHViIHVuZGVmaW5lZCBtZXRob2RzLlxyXG4gICAgY29uc29sZVttZXRob2RdID0gT0oubm9vcCB1bmxlc3MgY29uc29sZVttZXRob2RdXHJcbiAgICBcclxuICAgICNEZWZpbmUgdGhlIG1ldGhvZCBvbiB0aGUgT0ogY29uc29sZSBuYW1lc3BhY2VcclxuICAgIE9KLmNvbnNvbGUucmVnaXN0ZXIgbWV0aG9kLCAocGFyYW1zLi4uKSAtPlxyXG4gICAgICBjb25zb2xlW21ldGhvZF0gcGFyYW1zLi4uXHJcbiAgKSgpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnNvbGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG4jIyNcclxuU2V0dXAgc2V0dGluZ3NcclxuJC5jb29raWUucmF3ID0gdHJ1ZVxyXG4kLmNvb2tpZS5qc29uID0gdHJ1ZVxyXG4gIFxyXG5TZXR1cCBkZWZhdWx0c1xyXG5odHRwczovL2dpdGh1Yi5jb20vY2FyaGFydGwvanF1ZXJ5LWNvb2tpZS9cclxuJC5jb29raWUuZGVmYXVsdHMuZXhwaXJlcyA9IDM2NVxyXG4kLmNvb2tpZS5kZWZhdWx0cy5wYXRoID0gJy8nXHJcbiQuY29va2llLmRlZmF1bHRzLmRvbWFpbiA9ICdvai5jb20nXHJcbiMjI1xyXG5pZiBub3QgJCBvciBub3QgJC5jb29raWVcclxuICB0aHJvdyBuZXcgRXJyb3IgJ2pRdWVyeSBDb29raWUgaXMgYSByZXF1aXJlZCBkZXBlbmRlbmN5LicgIFxyXG4kLmNvb2tpZS5kZWZhdWx0cy5zZWN1cmUgPSBmYWxzZVxyXG4gIFxyXG5jb29raWVzID0ge31cclxuICBcclxuZ2V0ID0gKGNvb2tpZU5hbWUsIHR5cGUpIC0+XHJcbiAgcmV0ID0gJydcclxuICBpZiBjb29raWVOYW1lXHJcbiAgICBpZiB0eXBlXHJcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHR5cGVcclxuICAgIGVsc2VcclxuICAgICAgcmV0ID0gJC5jb29raWUgY29va2llTmFtZSAgICBcclxuICAgIGlmIHJldFxyXG4gICAgICBjb29raWVzW2Nvb2tpZU5hbWVdID0gcmV0XHJcbiAgXHJcbmFsbCA9IC0+XHJcbiAgcmV0ID0gJC5jb29raWUoKVxyXG4gIHJldFxyXG4gICAgXHJcbnNldCA9IChjb29raWVOYW1lLCB2YWx1ZSwgb3B0cykgLT5cclxuICByZXQgPSAnJ1xyXG4gIGlmIGNvb2tpZU5hbWVcclxuICAgIGNvb2tpZXNbY29va2llTmFtZV0gPSB2YWx1ZVxyXG4gICAgaWYgb3B0c1xyXG4gICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lLCB2YWx1ZSwgb3B0c1xyXG4gICAgZWxzZVxyXG4gICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lLCB2YWx1ZVxyXG4gIHJldCAgXHJcbiAgXHJcbmRlbCA9IChjb29raWVOYW1lLCBvcHRzKSAtPlxyXG4gIGlmIGNvb2tpZU5hbWVcclxuICAgIGlmIG9wdHNcclxuICAgICAgJC5yZW1vdmVDb29raWUgY29va2llTmFtZSwgb3B0c1xyXG4gICAgZWxzZVxyXG4gICAgICAkLnJlbW92ZUNvb2tpZSBjb29raWVOYW1lICAgIFxyXG4gICAgZGVsZXRlIGNvb2tpZXNbY29va2llTmFtZV1cclxuICByZXR1cm5cclxuICAgIFxyXG5kZWxldGVBbGwgPSAtPlxyXG4gIGNvb2tpZXMgPSB7fVxyXG4gIE9KLmVhY2ggT0ouY29va2llLmFsbCwgKHZhbCwga2V5KSAtPlxyXG4gICAgT0ouY29va2llLmRlbGV0ZSBrZXkgIFxyXG4gIHJldHVyblxyXG4gICAgXHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2RlbGV0ZUFsbCcsIGRlbGV0ZUFsbFxyXG4gT0ouY29va2llLnJlZ2lzdGVyICdkZWxldGUnLCBkZWxcclxuIE9KLmNvb2tpZS5yZWdpc3RlciAnc2V0Jywgc2V0XHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2dldCcsIGdldFxyXG4gT0ouY29va2llLnJlZ2lzdGVyICdhbGwnLCAgYWxsXHJcbiBcclxuIG1vZHVsZS5leHBvcnRzID0gXHJcbiAgZGVsZXRlQWxsOiBkZWxldGVBbGxcclxuICBkZWxldGU6IGRlbFxyXG4gIHNldDogc2V0XHJcbiAgZ2V0OiBnZXRcclxuICBhbGw6ICBhbGwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5kZWZlciA9IChtZXRob2QsIHdhaXRNcykgLT5cclxuICBpZiBzZXRUaW1lb3V0XHJcbiAgICByZXR1cm4gc2V0VGltZW91dCBtZXRob2QsIHdhaXRNc1xyXG4gIFxyXG5PSi5yZWdpc3RlciAnZGVmZXInLCBkZWZlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGRlZmVyIiwiIyAjIGVhY2hcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jICMjIGNhbkVhY2hcclxuY2FuRWFjaCA9IChvYmopIC0+XHJcbiAgIyBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IFtpc10oaXMuaHRtbCkgdHJ1bHkgaXRlcmFibGUgKGUuZy4gYW4gaW5zdGFuY2Ugb2YgT2JqZWN0IG9yIEFycmF5KVxyXG4gIE9KLmlzLnBsYWluT2JqZWN0KG9iaikgb3IgT0ouaXMub2JqZWN0KG9iaikgb3IgT0ouaXMuYXJyYXkgb2JqXHJcblxyXG4jICMjIFtPSl0ob2ouaHRtbCkuZWFjaFxyXG5cclxuIyBJdGVyYXRlIGFsbCBvZiB0aGUgbWVtYmVycyBvZiBhbiBvYmplY3QgKG9yIGFuIGFycmF5KSB3aXRoIG9wdGlvbmFsIGNhbGxiYWNrIGFuZCByZWN1cnNpb24uXHJcblxyXG4jIC0gYG9iamA6IHRoZSBvYmplY3QgdG8gaXRlcmF0ZSxcclxuIyAtIGBvbkVhY2hgOiBhIGNhbGxiYWNrIHRvIGV4ZWN1dGUgZm9yIGVhY2ggaXRlcmF0aW9uLFxyXG4jIC0gYHJlY3Vyc2l2ZWA6IGlmIHRydWUsIHJlY3Vyc2l2ZWx5IGl0ZXJhdGUgYWxsIHZhbGlkIGNoaWxkIG9iamVjdHMuXHJcbmVhY2ggPSAob2JqLCBvbkVhY2gsIHJlY3Vyc2l2ZSkgLT5cclxuICBpZiBjYW5FYWNoIG9ialxyXG4gICAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNmb3Jvd24pJ3MgYGZvck93bmAgbWV0aG9kIHRvIGVuc3VyZSB0aGF0IG9ubHkgdGhlIGFjdHVhbCBwcm9wZXJ0aWVzIG9mIHRoZSBvYmplY3QgYXJlIGVudW1lcmF0ZWQuXHJcblxyXG4gICAgIyAtIGBvbkVhY2hgIGNhbGxiYWNrIHdpbGwgcmVjZWl2ZSAyIHBhcmFtZXRlcnM6XHJcbiAgICAjIC0gYHZhbGAgYW5kIGBrZXlgLlxyXG4gICAgIyAtIGB2YWxgIGlzIGFsd2F5cyB0aGUgdmFsdWUgb2YgdGhlIHByb3BlcnR5LlxyXG4gICAgIyAtIGBrZXlgIGlzIGVpdGhlciB0aGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgb3IgdGhlIGN1cnJlbnQgaW5kZXggb2YgdGhlIGFycmF5LlxyXG4gICAgXy5mb3JPd24gb2JqLCAodmFsLCBrZXkpIC0+XHJcbiAgICAgIGlmIG9uRWFjaCBhbmQgKHZhbCBvciBrZXkpXHJcbiAgICAgICAgcXVpdCA9IG9uRWFjaCB2YWwsIGtleVxyXG4gICAgICAgIHJldHVybiBmYWxzZSAgaWYgZmFsc2UgaXMgcXVpdFxyXG4gICAgICBlYWNoIHZhbCwgb25FYWNoLCB0cnVlICBpZiB0cnVlIGlzIHJlY3Vyc2l2ZVxyXG4gICAgICByZXR1cm5cclxuXHJcbiAgcmV0dXJuXHJcblxyXG4jICMjIHJlZ2lzdGVyXHJcblxyXG4jIHJlZ2lzdGVyIHRoZSBgZWFjaGAgbWV0aG9kIG9uIHRoZSBbT0pdKE9KLmh0bWwpIG5hbWVzcGFjZVxyXG5PSi5yZWdpc3RlciAnZWFjaCcsIGVhY2hcclxubW9kdWxlLmV4cG9ydHMgPSBlYWNoIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxudW5rbm93biA9ICd1bmtub3duJyAgIFxyXG4gIFxyXG5pbnB1dFR5cGVzID1cclxuICBidXR0b246ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMFxyXG4gICAgbmFtZTogJ2J1dHRvbidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgY2hlY2tib3g6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMVxyXG4gICAgbmFtZTogJ2NoZWNrYm94J1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGNvbG9yOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDJcclxuICAgIG5hbWU6ICdjb2xvcidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBkYXRlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDNcclxuICAgIG5hbWU6ICdkYXRlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgZGF0ZXRpbWU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogNFxyXG4gICAgbmFtZTogJ2RhdGV0aW1lJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gICdkYXRldGltZS1sb2NhbCc6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogNVxyXG4gICAgbmFtZTogJ2RhdGV0aW1lLWxvY2FsJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgZW1haWw6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogNlxyXG4gICAgbmFtZTogJ2VtYWlsJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBmaWxlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDdcclxuICAgIG5hbWU6ICdmaWxlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IGZhbHNlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgaGlkZGVuOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDhcclxuICAgIG5hbWU6ICdoaWRkZW4nXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGltYWdlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDlcclxuICAgIG5hbWU6ICdpbWFnZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgbW9udGg6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTBcclxuICAgIG5hbWU6ICdtb250aCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgbnVtYmVyOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDExXHJcbiAgICBuYW1lOiAnbnVtYmVyJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHBhc3N3b3JkOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDEyXHJcbiAgICBuYW1lOiAncGFzc3dvcmQnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICByYWRpbzogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxM1xyXG4gICAgbmFtZTogJ3JhZGlvJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHJhbmdlOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE0XHJcbiAgICBuYW1lOiAncmFuZ2UnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcmVzZXQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTVcclxuICAgIG5hbWU6ICdyZXNldCdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgc2VhcmNoOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE2XHJcbiAgICBuYW1lOiAnc2VhcmNoJ1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgc3VibWl0OiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE3XHJcbiAgICBuYW1lOiAnc3VibWl0J1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB0ZWw6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMThcclxuICAgIG5hbWU6ICdidXR0b24nXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB0ZXh0OiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDE5XHJcbiAgICBuYW1lOiAndGV4dCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgdGltZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMFxyXG4gICAgbmFtZTogJ3RpbWUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB1cmw6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMjFcclxuICAgIG5hbWU6ICd1cmwnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHdlZWs6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMjJcclxuICAgIG5hbWU6ICd3ZWVrJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuT0ouZW51bXMucmVnaXN0ZXIgJ3Vua25vd24nLCB1bmtub3duXHJcbk9KLmVudW1zLnJlZ2lzdGVyICdpbnB1dFR5cGVzJywgaW5wdXRUeXBlc1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBcclxuICB1bmtub3duOiB1bmtub3duXHJcbiAgaW5wdXRUeXBlczogaW5wdXRUeXBlcyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmlmIE9KLlRSQUNLX09OX0VSUk9SXHJcbiAgb25FcnJvciA9IE9KLmdsb2JhbC5vbmVycm9yXHJcblxyXG4gICMjI1xyXG4gIExvZyBlcnJvcnMgdG8gdGhlIGNvbnNvbGVcclxuICAjIyNcclxuICBPSi5nbG9iYWwub25lcnJvciA9IChtc2csIHVybCwgbGluZU51bWJlcikgLT5cclxuICAgIHJldCA9IGZhbHNlXHJcbiAgICBPSi5jb25zb2xlLndhcm4gXCIlc1xcciB1cmw6ICVzXFxyIGxpbmU6ICVkXCIsIG1zZywgdXJsLCBsaW5lTnVtYmVyXHJcbiAgICByZXQgPSBvbkVycm9yIG1zZywgdXJsLCBsaW5lTnVtYmVyIGlmIG9uRXJyb3JcclxuICAgIHJldCAjdHJ1ZSBtZWFucyBkb24ndCBwcm9wYWdhdGUgdGhlIGVycm9yICIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG5pZiBPSi5nbG9iYWwuYWRkRXZlbnRMaXN0ZW5lclxyXG4gIGV2ZW50TmFtZSA9ICdhZGRFdmVudExpc3RlbmVyJ1xyXG4gIGV2ZW50SW5mbyA9ICcnXHJcbmVsc2UgXHJcbiAgZXZlbnROYW1lID0gJ2F0dGFjaEV2ZW50J1xyXG4gIGV2ZW50SW5mbyA9ICdvbidcclxuICBcclxucHVzaFN0YXRlID0gKHBhZ2VOYW1lLCBldmVudCkgLT5cclxuICBpZiBwYWdlTmFtZVxyXG4gICAgIyBrZWVwIHRoZSBsaW5rIGluIHRoZSBicm93c2VyIGhpc3RvcnlcclxuICAgIGhpc3RvcnkucHVzaFN0YXRlIG51bGwsIG51bGwsICcjJyArIHBhZ2VOYW1lXHJcbiAgICAgIFxyXG4gICAgIyBoZXJlIGNhbiBjYXVzZSBkYXRhIGxvYWRpbmcsIGV0Yy5cclxuICAgIFxyXG4gICAgaWYgZXZlbnQgICAgXHJcbiAgICAgICMgZG8gbm90IGdpdmUgYSBkZWZhdWx0IGFjdGlvblxyXG4gICAgICBpZiBldmVudC5wcmV2ZW50RGVmYXVsdFxyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICAgICAgZWxzZVxyXG4gICAgICAgIGV2ZW50LnJldHVyblZhbHVlID0gZmFsc2VcclxuICBmYWxzZVxyXG4gIFxyXG5yZXN0b3JlU3RhdGUgPSAobG9jYXRpb24pIC0+XHJcbiAgcGFnZU5hbWUgPSBsb2NhdGlvbi5oYXNoXHJcbiAgaWYgbm90IHBhZ2VOYW1lXHJcbiAgICBwYWdlTmFtZSA9IGxvY2F0aW9uLmhyZWYuc3BsaXQoJyMnKVsxXVxyXG4gIGlmIHBhZ2VOYW1lXHJcbiAgICBwYWdlTmFtZSA9IHBhZ2VOYW1lLnJlcGxhY2UgJyMnLCAnJ1xyXG4gICAgT0oucHVibGlzaCAncmVzdG9yZVN0YXRlJywgcGFnZU5hbWU6IHBhZ2VOYW1lLCBsb2NhdGlvbjogbG9jYXRpb25cclxuICByZXR1cm5cclxuICBcclxuIyMjIFxyXG5oYW5nIG9uIHRoZSBldmVudCwgYWxsIHJlZmVyZW5jZXMgaW4gdGhpcyBkb2N1bWVudFxyXG4jIyNcclxuICBcclxuIyMjXHJcbiMgVGhpcyBiaW5kcyB0byB0aGUgZG9jdW1lbnQgY2xpY2sgZXZlbnQsIHdoaWNoIGluIHR1cm4gYXR0YWNoZXMgdG8gZXZlcnkgY2xpY2sgZXZlbnQsIGNhdXNpbmcgdW5leHBlY3RlZCBiZWhhdmlvci5cclxuIyBGb3IgYW55IGNvbnRyb2wgd2hpY2ggd2lzaGVzIHRvIHRyaWdnZXIgYSBzdGF0ZSBjaGFuZ2UgaW4gcmVzcG9uc2UgdG8gYW4gZXZlbnQsIGl0IGlzIGJldHRlciBmb3IgdGhhdCBjb250cm9sIHRvIGRlZmluZSB0aGUgYmVoYXZpb3IuXHJcbk9KLmRvY3VtZW50W2V2ZW50TmFtZV0gZXZlbnRJbmZvICsgJ2NsaWNrJywgKChldmVudCkgLT5cclxuICBldmVudCA9IGV2ZW50IG9yIHdpbmRvdy5ldmVudFxyXG4gIHRhcmdldCA9IGV2ZW50LnRhcmdldCBvciBldmVudC5zcmNFbGVtZW50XHJcbiAgICBcclxuICAjIGxvb2tpbmcgZm9yIGFsbCB0aGUgbGlua3Mgd2l0aCAnYWpheCcgY2xhc3MgZm91bmRcclxuICBpZiB0YXJnZXQgYW5kIHRhcmdldC5ub2RlTmFtZSBpcyAnQScgYW5kICgnICcgKyB0YXJnZXQuY2xhc3NOYW1lICsgJyAnKS5pbmRleE9mKCdhamF4JykgPj0gMFxyXG4gICAgT0oucHVzaFN0YXRlIHRhcmdldC5ocmVmLCBldmVudFxyXG4gICAgICBcclxuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcclxuKSwgZmFsc2VcclxuIyMjXHJcblxyXG4jIyNcclxuaGFuZyBvbiBwb3BzdGF0ZSBldmVudCB0cmlnZ2VyZWQgYnkgcHJlc3NpbmcgYmFjay9mb3J3YXJkIGluIGJyb3dzZXJcclxuIyMjXHJcbk9KLmdsb2JhbFtldmVudE5hbWVdIGV2ZW50SW5mbyArICdwb3BzdGF0ZScsICgoZXZlbnQpIC0+XHJcbiAgICBcclxuICAjIHdlIGdldCBhIG5vcm1hbCBMb2NhdGlvbiBvYmplY3RcclxuICAgIFxyXG4gICMjI1xyXG4gIE5vdGUsIHRoaXMgaXMgdGhlIG9ubHkgZGlmZmVyZW5jZSB3aGVuIHVzaW5nIHRoaXMgbGlicmFyeSxcclxuICBiZWNhdXNlIHRoZSBvYmplY3QgZG9jdW1lbnQubG9jYXRpb24gY2Fubm90IGJlIG92ZXJyaWRlbixcclxuICBzbyBsaWJyYXJ5IHRoZSByZXR1cm5zIGdlbmVyYXRlZCAnbG9jYXRpb24nIG9iamVjdCB3aXRoaW5cclxuICBhbiBvYmplY3Qgd2luZG93Lmhpc3RvcnksIHNvIGdldCBpdCBvdXQgb2YgJ2hpc3RvcnkubG9jYXRpb24nLlxyXG4gIEZvciBicm93c2VycyBzdXBwb3J0aW5nICdoaXN0b3J5LnB1c2hTdGF0ZScgZ2V0IGdlbmVyYXRlZFxyXG4gIG9iamVjdCAnbG9jYXRpb24nIHdpdGggdGhlIHVzdWFsICdkb2N1bWVudC5sb2NhdGlvbicuXHJcbiAgIyMjICAgICAgICAgICAgICAgICAgICAgXHJcbiAgcmV0dXJuTG9jYXRpb24gPSBoaXN0b3J5LmxvY2F0aW9uIG9yIGRvY3VtZW50LmxvY2F0aW9uXHJcbiAgICBcclxuICAjIyNcclxuICBoZXJlIGNhbiBjYXVzZSBkYXRhIGxvYWRpbmcsIGV0Yy5cclxuICAjIyNcclxuICBPSi5oaXN0b3J5LnJlc3RvcmVTdGF0ZSByZXR1cm5Mb2NhdGlvblxyXG4gICAgXHJcbiAgcmV0dXJuXHJcbiksIGZhbHNlIFxyXG4gIFxyXG4gXHJcbk9KLmhpc3RvcnkucmVnaXN0ZXIgJ3Jlc3RvcmVTdGF0ZScsIHJlc3RvcmVTdGF0ZVxyXG5PSi5oaXN0b3J5LnJlZ2lzdGVyICdwdXNoU3RhdGUnLCBwdXNoU3RhdGVcclxuIFxyXG5tb2R1bGUuZXhwb3J0cyA9IFxyXG4gIHJlc3RvcmVTdGF0ZTogcmVzdG9yZVN0YXRlXHJcbiAgcHVzaFN0YXRlOiBwdXNoU3RhdGVcclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbiQgPSByZXF1aXJlICdqcXVlcnknXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG5lYWNoID0gcmVxdWlyZSAnLi9lYWNoJ1xuXG5pc01ldGhvZCA9IHt9XG5cbmlzTWV0aG9kLmJvb2wgPSAoYm9vbGVhbikgLT5cbiAgXy5pc0Jvb2xlYW4gYm9vbGVhblxuXG5pc01ldGhvZC5hcnJheU51bGxPckVtcHR5ID0gKGFycikgLT5cbiAgXy5pc0VtcHR5IGFyclxuXG5pc01ldGhvZC5zdHJpbmdOdWxsT3JFbXB0eSA9IChzdHIpIC0+XG4gIHN0ciBhbmQgKG5vdCBzdHIubGVuZ3RoIG9yIHN0ci5sZW5ndGggaXMgMCBvciBub3Qgc3RyLnRyaW0gb3Igbm90IHN0ci50cmltKCkpXG5cbmlzTWV0aG9kLm51bWJlck51bGxPckVtcHR5ID0gKG51bSkgLT5cbiAgbm90IG51bSBvciBpc05hTihudW0pIG9yIG5vdCBudW0udG9QcmVjaXNpb25cblxuaXNNZXRob2QuZGF0ZU51bGxPckVtcHR5ID0gKGR0KSAtPlxuICBub3QgZHQgb3Igbm90IGR0LmdldFRpbWVcblxuaXNNZXRob2Qub2JqZWN0TnVsbE9yRW1wdHkgPSAob2JqKSAtPlxuICBfLmlzRW1wdHkgb2JqIG9yIG5vdCBPYmplY3Qua2V5cyhvYmopIG9yIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoIGlzIDBcblxuaXNNZXRob2QucGxhaW5PYmplY3QgPSAob2JqKSAtPlxuICBfLmlzUGxhaW5PYmplY3Qgb2JqXG5cbmlzTWV0aG9kLm9iamVjdCA9IChvYmopIC0+XG4gIF8uaXNPYmplY3Qgb2JqXG5cbmlzTWV0aG9kLmRhdGUgPSAoZHQpIC0+XG4gIF8uaXNEYXRlIGR0XG5cblxuIyMjXG5EZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgYW4gaW5zdGFuY2Ugb2YgYSBOdW1iZXIgYW5kIG5vdCBOYU4qXG4jIyNcbmlzTWV0aG9kLm51bWJlciA9IChudW0pIC0+XG4gIG51bWJlciA9IHJlcXVpcmUgJy4uL2NvcmUvbnVtYmVyJ1xuICB0eXBlb2YgbnVtIGlzICdudW1iZXInIGFuZCBmYWxzZSBpcyAobnVtYmVyLmlzTmFOKG51bSkgb3IgZmFsc2UgaXMgbnVtYmVyLmlzRmluaXRlKG51bSkgb3IgbnVtYmVyLk1BWF9WQUxVRSBpcyBudW0gb3IgbnVtYmVyLk1JTl9WQUxVRSBpcyBudW0pXG5cbiMjI1xuRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGNvbnZlcnRpYmxlIHRvIGEgTnVtYmVyXG4jIyNcbmlzTWV0aG9kLm51bWVyaWMgPSAobnVtKSAtPlxuICByZXQgPSBpc01ldGhvZC5udW1iZXIobnVtKVxuICB1bmxlc3MgcmV0XG4gICAgdG8gPSByZXF1aXJlICcuL3RvJ1xuICAgIG51TnVtID0gdG8ubnVtYmVyKG51bSlcbiAgICByZXQgPSBpc01ldGhvZC5udW1iZXIobnVOdW0pXG4gIHJldFxuXG5pc01ldGhvZC52ZW5kb3JPYmplY3QgPSAob2JqKSAtPlxuICByZXQgPSAob2JqIGluc3RhbmNlb2YgT0pbJz8nXSlcbiAgcmV0XG5cbmlzTWV0aG9kLmVsZW1lbnRJbkRvbSA9IChlbGVtZW50SWQpIC0+XG4gIGZhbHNlIGlzIGlzTWV0aG9kLm51bGxPckVtcHR5KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCkpXG5cbmlzTWV0aG9kLmFycmF5ID0gKG9iaikgLT5cbiAgXy5pc0FycmF5IG9ialxuXG5pc01ldGhvZC5zdHJpbmcgPSAoc3RyKSAtPlxuICBfLmlzU3RyaW5nIHN0clxuXG5pc01ldGhvZC50cnVlID0gKG9iaikgLT5cbiAgb2JqIGlzIHRydWUgb3Igb2JqIGlzICd0cnVlJyBvciBvYmogaXMgMSBvciBvYmogaXMgJzEnXG5cbmlzTWV0aG9kLmZhbHNlID0gKG9iaikgLT5cbiAgb2JqIGlzIGZhbHNlIG9yIG9iaiBpcyAnZmFsc2UnIG9yIG9iaiBpcyAwIG9yIG9iaiBpcyAnMCdcblxuaXNNZXRob2QudHJ1ZU9yRmFsc2UgPSAob2JqKSAtPlxuICBpc01ldGhvZC50cnVlIG9iaiBvciBpc01ldGhvZC5mYWxzZSBvYmpcblxuaXNNZXRob2QubnVsbE9yRW1wdHkgPSAob2JqLCBjaGVja0xlbmd0aCkgLT5cbiAgXy5pc0VtcHR5KG9iaikgb3IgXy5pc1VuZGVmaW5lZChvYmopIG9yIF8uaXNOdWxsKG9iaikgb3IgXy5pc05hTihvYmopXG5cbmlzTWV0aG9kLm51bGxPclVuZGVmaW5lZCA9IChvYmosIGNoZWNrTGVuZ3RoKSAtPlxuICBfLmlzVW5kZWZpbmVkKG9iaikgb3IgXy5pc051bGwob2JqKSBvciBfLmlzTmFOKG9iailcblxuaXNNZXRob2QuaW5zdGFuY2VvZiA9IChuYW1lLCBvYmopIC0+XG4gIG9iai50eXBlIGlzIG5hbWUgb3Igb2JqIGluc3RhbmNlb2YgbmFtZVxuXG5pc01ldGhvZC5tZXRob2QgPSAob2JqKSAtPlxuICBvYmogaXNudCBPSi5ub29wIGFuZCBfLmlzRnVuY3Rpb24gb2JqXG5cbiMjI1xuRGVwcmVjYXRlZC4gTGVmdCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkuIFVzZSBpcy5tZXRob2QgaW5zdGVhZC5cbiMjI1xuaXNNZXRob2QuZnVuYyA9IGlzTWV0aG9kLm1ldGhvZFxuXG5PYmplY3Quc2VhbCBpc01ldGhvZFxuT2JqZWN0LmZyZWV6ZSBpc01ldGhvZFxuXG5PSi5yZWdpc3RlciAnaXMnLCBpc01ldGhvZFxubW9kdWxlLmV4cG9ydHMgPSBpc01ldGhvZFxuXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub3R5ID0gcmVxdWlyZSAnbm90eSdcclxuXHJcbiAgXHJcbm1ha2VOb3R5ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxyXG4gIGRlZmF1bHRzID1cclxuICAgIGxheW91dDogJ3RvcFJpZ2h0J1xyXG4gICAgdGhlbWU6ICdkZWZhdWx0VGhlbWUnXHJcbiAgICB0eXBlOiAnYWxlcnQnXHJcbiAgICB0ZXh0OiAnJyAjY2FuIGJlIGh0bWwgb3Igc3RyaW5nXHJcbiAgICBkaXNtaXNzUXVldWU6IHRydWUgI0lmIHlvdSB3YW50IHRvIHVzZSBxdWV1ZSBmZWF0dXJlIHNldCB0aGlzIHRydWVcclxuICAgIHRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cIm5vdHlfbWVzc2FnZVwiPjxzcGFuIGNsYXNzPVwibm90eV90ZXh0XCI+PC9zcGFuPjxkaXYgY2xhc3M9XCJub3R5X2Nsb3NlXCI+PC9kaXY+PC9kaXY+JyxcclxuICAgIGFuaW1hdGlvbjogXHJcbiAgICAgICAgb3BlbjogXHJcbiAgICAgICAgICBoZWlnaHQ6ICd0b2dnbGUnXHJcbiAgICAgICAgY2xvc2U6IFxyXG4gICAgICAgICAgaGVpZ2h0OiAndG9nZ2xlJ1xyXG4gICAgICAgIGVhc2luZzogJ3N3aW5nJ1xyXG4gICAgICAgIHNwZWVkOiA1MDAgI29wZW5pbmcgJiBjbG9zaW5nIGFuaW1hdGlvbiBzcGVlZFxyXG4gICAgdGltZW91dDogNTAwMCAjZGVsYXkgZm9yIGNsb3NpbmcgZXZlbnQuIFNldCBmYWxzZSBmb3Igc3RpY2t5IG5vdGlmaWNhdGlvbnNcclxuICAgIGZvcmNlOiBmYWxzZSAjYWRkcyBub3RpZmljYXRpb24gdG8gdGhlIGJlZ2lubmluZyBvZiBxdWV1ZSB3aGVuIHNldCB0byB0cnVlXHJcbiAgICBtb2RhbDogZmFsc2VcclxuICAgIG1heFZpc2libGU6IDUgI3lvdSBjYW4gc2V0IG1heCB2aXNpYmxlIG5vdGlmaWNhdGlvbiBmb3IgZGlzbWlzc1F1ZXVlIHRydWUgb3B0aW9uLFxyXG4gICAga2lsbGVyOiBmYWxzZSAjZm9yIGNsb3NlIGFsbCBub3RpZmljYXRpb25zIGJlZm9yZSBzaG93XHJcbiAgICBjbG9zZVdpdGg6IFsnY2xpY2snXSAgI1snY2xpY2snLCAnYnV0dG9uJywgJ2hvdmVyJ11cclxuICAgIGNhbGxiYWNrOiBcclxuICAgICAgICBvblNob3c6IE9KLm5vb3AsXHJcbiAgICAgICAgYWZ0ZXJTaG93OiBPSi5ub29wXHJcbiAgICAgICAgb25DbG9zZTogT0oubm9vcFxyXG4gICAgICAgIGFmdGVyQ2xvc2U6IE9KLm5vb3BcclxuICAgIGJ1dHRvbnM6IGZhbHNlICNhbiBhcnJheSBvZiBidXR0b25zXHJcbiAgICBcclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBub3R5IGRlZmF1bHRzXHJcbiAgICAgIFxyXG4gIHJldFxyXG4gICAgXHJcbk9KLm5vdGlmaWNhdGlvbnMucmVnaXN0ZXIgJ25vdHknLCBtYWtlTm90eVxyXG5tb2R1bGUuZXhwb3J0cyA9IG1ha2VOb3R5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcblB1YlN1YiA9IHJlcXVpcmUgJ3B1YnN1Yi1qcydcblxudG9rZW5zID0ge31cbnN1YnNjcmliZXJzID0gW11cbmV2ZW50cyA9IHt9XG5cbnBzID0gXG4gIGdldEV2ZW50TmFtZTogKGV2ZW50KSAtPlxuICAgIGV2ZW50LnRvVXBwZXJDYXNlKCkucmVwbGFjZSAnICcsICdfJ1xuXG4gIHN1YnNjcmliZTogKGV2ZW50LCBtZXRob2QpIC0+XG4gICAgZXZlbnROYW1lID0gcHMuZ2V0RXZlbnROYW1lIGV2ZW50XG4gICAgaWYgbm90IGV2ZW50c1tldmVudE5hbWVdIHRoZW4gZXZlbnRzW2V2ZW50TmFtZV0gPSBbXVxuXG4gICAgdG9rZW4gPSBQdWJTdWIuc3Vic2NyaWJlIGV2ZW50TmFtZSwgbWV0aG9kXG4gICAgdG9rZW5zW3Rva2VuXSA9IHRva2VuXG4gICAgc3Vic2NyaWJlcnMucHVzaCBtZXRob2RcbiAgICBldmVudHNbZXZlbnROYW1lXS5wdXNoIG1ldGhvZFxuICAgIHRva2VuXG5cbiAgcHVibGlzaDogKGV2ZW50LCBkYXRhKSAtPlxuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZSBldmVudFxuICAgIGlmIGV2ZW50c1tldmVudE5hbWVdXG4gICAgICBQdWJTdWIucHVibGlzaCBldmVudE5hbWUsIGRhdGFcbiAgICBlbHNlXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0V2ZW50IG5hbWVkIHsnICsgZXZlbnQgKyAnfSBpcyBub3QgcmVjb2duaXplZC4nXG4gICAgcmV0dXJuXG5cbiAgdW5zdWJzY3JpYmU6ICh0b2tlbk9yTWV0aG9kKSAtPlxuICAgIGlmIE9KLmlzLm1ldGhvZCB0b2tlbk9yTWV0aG9kXG4gICAgICBpZiAtMSBpc250IHN1YnNjcmliZXJzLmluZGV4T2YgdG9rZW5Pck1ldGhvZFxuICAgICAgICBQdWJTdWIudW5zdWJzY3JpYmUgdG9rZW5Pck1ldGhvZFxuICAgICAgICBzdWJzY3JpYmVycyA9IF8ucmVtb3ZlIHN1YnNjcmliZXJzLCAobWV0aG9kKSAtPiBtZXRob2QgaXMgdG9rZW5Pck1ldGhvZFxuICAgICAgZWxzZVxuICAgICAgICBPSi5jb25zb2xlLmluZm8gJ0V2ZW50IG1ldGhvZCBpcyBub3QgcmVjb2duaXplZC4nXG4gICAgZWxzZVxuICAgICAgaWYgdG9rZW5zW3Rva2VuT3JNZXRob2RdXG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSB0b2tlbk9yTWV0aG9kXG4gICAgICAgIGRlbGV0ZSB0b2tlbnNbdG9rZW5Pck1ldGhvZF1cbiAgICByZXR1cm5cblxuICB1bnN1YnNjcmliZUFsbDogKCkgLT5cbiAgICBPSi5lYWNoIHRva2VucywgKHRva2VuKSAtPiB1bnN1YnNjcmliZSB0b2tlblxuICAgIHN1YnNjcmliZXJzID0gW11cbiAgICBldmVudHMgPSB7fVxuICAgIHJldHVyblxuXG4gIHVuc3Vic2NyaWJlRXZlbnQ6IChldmVudCkgLT5cbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUgZXZlbnRcbiAgICBpZiBldmVudHNbZXZlbnROYW1lXVxuICAgICAgT0ouZWFjaCBldmVudHNbZXZlbnROYW1lXSwgKG1ldGhvZCkgLT4gdW5zdWJzY3JpYmUgbWV0aG9kXG4gICAgZWxzZVxuICAgICAgT0ouY29uc29sZS5pbmZvICdFdmVudCBuYW1lZCB7JyArIGV2ZW50ICsgJ30gaXMgbm90IHJlY29nbml6ZWQuJ1xuICAgIGRlbGV0ZSBldmVudHNbZXZlbnROYW1lXVxuICAgIHJldHVyblxuXG5PYmplY3Quc2VhbCBwc1xuT2JqZWN0LmZyZWV6ZSBwc1xuXG5PSi5yZWdpc3RlciAnZ2V0RXZlbnROYW1lJywgcHMuZ2V0RXZlbnROYW1lXG5PSi5yZWdpc3RlciAncHVibGlzaCcsIHBzLnB1Ymxpc2hcbk9KLnJlZ2lzdGVyICdzdWJzY3JpYmUnLCBwcy5zdWJzY3JpYmVcbk9KLnJlZ2lzdGVyICd1bnN1YnNjcmliZScsIHBzLnVuc3Vic2NyaWJlXG5PSi5yZWdpc3RlciAndW5zdWJzY3JpYmVBbGwnLCBwcy51bnN1YnNjcmliZUFsbFxuT0oucmVnaXN0ZXIgJ3Vuc3Vic2NyaWJlRXZlbnQnLCBwcy51bnN1YnNjcmliZUV2ZW50XG5cbm1vZHVsZS5leHBvcnRzID0gcHMiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG4jIyNcclxuaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85MDExMTUvaG93LWNhbi1pLWdldC1xdWVyeS1zdHJpbmctdmFsdWVzLWluLWphdmFzY3JpcHRcclxuIyMjXHJcbnF1ZXJ5U3RyaW5nID0gKHBhcmFtKSAtPlxyXG4gIHJldCA9IHt9XHJcbiAgICBcclxuICBpZiBPSi5nbG9iYWwubG9jYXRpb25cclxuICAgIHBhcmFtcyA9ICBPSi5nbG9iYWwubG9jYXRpb24uc2VhcmNoLnN1YnN0cigxKS5zcGxpdCAnJidcclxuICAgIGlmIHBhcmFtc1xyXG4gICAgICBpID0gMFxyXG4gICAgICB3aGlsZSBpIDwgcGFyYW1zLmxlbmd0aFxyXG4gICAgICAgIHBybSA9IHBhcmFtc1tpXS5zcGxpdCAnPSdcclxuICAgICAgICBpZiBwcm0ubGVuZ3RoIGlzIDIgXHJcbiAgICAgICAgICByZXRbcHJtWzBdXSA9IE9KLmdsb2JhbC5kZWNvZGVVUklDb21wb25lbnQgcHJtWzFdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIilcclxuICAgICAgICBpICs9IDFcclxuICByZXRcclxuICAgIFxyXG5PSi5yZWdpc3RlciAncXVlcnlTdHJpbmcnLHF1ZXJ5U3RyaW5nXHJcbm1vZHVsZS5leHBvcnRzID0gcXVlcnlTdHJpbmciLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuZWFjaCA9IHJlcXVpcmUgJy4vZWFjaCdcblxuIyAjIHJhbmdlc1xuXG5ybmcgPSBcblxuICAjICMjIHJhbmdlXG4gICMgVXNpbmcgW0xvLURhc2hdKGh0dHA6Ly9sb2Rhc2guY29tL2RvY3MjcmFuZ2UpJ3MgYHJhbmdlYCBtZXRob2RcbiAgcmFuZ2U6IChwYXJhbXMuLi4pIC0+XG4gICAgXy5yYW5nZSBwYXJhbXMuLi5cblxuICAjICMjIHJhbmdlTWluXG4gICMgVXNpbmcgW0xvLURhc2hdKGh0dHA6Ly9sb2Rhc2guY29tL2RvY3MjbWluKSdzIGBtaW5gIG1ldGhvZFxuICByYW5nZU1pbjogKHBhcmFtcy4uLikgLT5cbiAgICBfLm1pbiBwYXJhbXMuLi5cblxuICAjICMjIHJhbmdlTWF4XG4gICMgVXNpbmcgW0xvLURhc2hdKGh0dHA6Ly9sb2Rhc2guY29tL2RvY3MjbWF4KSdzIGBtYXhgIG1ldGhvZFxuICByYW5nZU1heDogKHBhcmFtcy4uLikgLT5cbiAgICBfLm1heCBwYXJhbXMuLi5cblxuICAjICMjIHN0cmluZ1JhbmdlVG9TdWJSYW5nZXNcbiAgIyMjXG4gIFRha2UgYW4gYXJyYXkgb2Ygc3RyaW5nIHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXG4gIFVzZXMgdGhlIGZpcnN0IGxldHRlciBvZiBlYWNoIHN0cmluZyB2YWx1ZSBpbiB0aGUgYXJyYXkgdG8gY29udmVydCB0byB1bmlxdWUgY29kZSBjaGFyYWN0ZXIgKGxvd2VyIGNhc2UpXG4gIEJ1aWxkcyBhIGludCByYW5nZSBiYXNlZCBvbiB1bmlxdWUgY29kZSBjaGFycy5cbiAgIyMjXG4gIHN0cmluZ1RvU3ViUmFuZ2VzOiAobiA9IDYsIHJhbmdlID0gW10pIC0+XG4gICAgY2hhclJhbmdlID0gW11cblxuXG4gICAgZWFjaCByYW5nZSwgKHZhbCkgLT5cbiAgICAgIGNoYXIgPSB2YWwudHJpbSgpWzBdLnRvTG93ZXJDYXNlKClcbiAgICAgIGlmIGZhbHNlIGlzIG9iai5jb250YWlucyBjaGFyUmFuZ2UsIGNoYXJcbiAgICAgICAgY2hhclJhbmdlLnB1c2ggY2hhci5jaGFyQ29kZUF0KClcblxuICAgIHJldCA9IHJhbmdlVG9TdWJSYW5nZXMgbiwgY2hhclJhbmdlXG5cbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCBuXG4gICAgICBpICs9IDFcbiAgICAgIHN1YlJhbmdlID0gcmV0W2ldXG4gICAgICBzdWJSYW5nZS5tYXAgU3RyaW5nLmZyb21DaGFyQ29kZVxuXG4gICAgb2xkR2V0UmFuZ2UgPSByZXQuZ2V0UmFuZ2VcbiAgICByZXQuZ2V0UmFuZ2UgPSAodmFsKSAtPlxuICAgICAgY2hhciA9IHZhbC50cmltKClbMF0udG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KClcbiAgICAgIGlkeCA9IG9sZEdldFJhbmdlIGNoYXJcbiAgICAgIGlkeFxuICAgIHJldFxuXG4gICMgIyMgcmFuZ2VUb1N1YlJhbmdlc1xuICAjIyNcbiAgVGFrZSBhbiBhcnJheSBvZiBpbnQgdmFsdWVzIGFuZCBhIG51bWJlciBvZiBwYXJ0aXRpb25zIHRvIGNyZWF0ZS5cbiAgRGl2aWRlcyB0aGUgb3JpZ2luYWwgYXJyYXkgaW50byB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiBzdWIgYXJyYXlzLlxuICBPdmVyZmxvdyBpcyBwYXNzZWQgdG8gdGhlIGZpbmFsIHBhcnRpdGlvbi5cbiAgIyMjXG4gIHRvU3ViUmFuZ2VzOiAobiA9IDYsIHJhbmdlID0gW10pIC0+XG4gICAgcmV0ID0gb2JqLm9iamVjdCgpXG4gICAgcmFuZ2VMb3cgPSBybmcucmFuZ2VNaW4gcmFuZ2VcbiAgICByYW5nZUhpZ2ggPSBybmcucmFuZ2VNYXggcmFuZ2VcblxuICAgIGRpc3RhbmNlID0gcmFuZ2VIaWdoIC0gcmFuZ2VMb3dcbiAgICBzdWJSYW5nZVNpemUgPSBkaXN0YW5jZS9uXG4gICAgc3ViUmFuZ2VzID0gcmV0LmFkZCAncmFuZ2VzJywgb2JqLm9iamVjdCgpXG4gICAgY2h1bmtWYWwgPSByYW5nZUxvd1xuXG4gICAgbWFwID0gb2JqLm9iamVjdCgpXG5cbiAgICBpID0gMFxuICAgIHdoaWxlIGkgPCBuXG4gICAgICBpICs9IDFcbiAgICAgIGlmIGkgPCBuIHRoZW4ganVtcCA9IE1hdGgucm91bmQgc3ViUmFuZ2VTaXplXG4gICAgICBlbHNlXG4gICAgICAgIGp1bXAgPSBNYXRoLmZsb29yIHN1YlJhbmdlU2l6ZVxuICAgICAgICBpZiBjaHVua1ZhbCArIGp1bXAgPD0gcmFuZ2VIaWdoXG4gICAgICAgICAganVtcCArPSByYW5nZUhpZ2ggLSBjaHVua1ZhbCAtIGp1bXAgKyAxXG5cbiAgICAgIHN1YlJhbmdlID0gcm5nLnJhbmdlIGNodW5rVmFsLCBjaHVua1ZhbCArIGp1bXBcbiAgICAgIGVhY2ggc3ViUmFuZ2UsICh2YWwpIC0+IG1hcC5hZGQgdmFsLCBpXG4gICAgICBzdWJSYW5nZXNbaV0gPSBzdWJSYW5nZVxuICAgICAgY2h1bmtWYWwgKz0ganVtcFxuXG4gICAgcmV0LmFkZCAnZ2V0UmFuZ2UnLCAodmFsKSAtPlxuICAgICAgbWFwW3ZhbF1cblxuICAgIHJldFxuXG5PYmplY3Quc2VhbCBybmdcbk9iamVjdC5mcmVlemUgcm5nXG5cbk9KLnJlZ2lzdGVyICdyYW5nZXMnLCBybmdcbm1vZHVsZS5leHBvcnRzID0gcm5nICAiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5pc01ldGhvZCA9IHJlcXVpcmUgJy4vaXMnXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbmVhY2ggPSByZXF1aXJlICcuL2VhY2gnXG5cbiMgIyB0b1xudG8gPVxuICAjICMjIGJvb2xcbiAgIyBjb252ZXJ0IGFueSBjb21wYXRpYmxlIG9iamVjdCB0byBhIGJvb2xlYW4uIEluY29tcGF0aWJsZSBvYmplY3RzIGFyZSBmYWxzZS5cbiAgYm9vbDogKHN0cikgLT5cbiAgICByZXRCb29sID0gaXNNZXRob2RbJ3RydWUnXShzdHIpXG4gICAgcmV0Qm9vbCA9IGZhbHNlICBpZiByZXRCb29sIGlzIGZhbHNlIG9yIHJldEJvb2wgaXNudCB0cnVlXG4gICAgcmV0Qm9vbFxuXG4gICMgIyMgRVM1X1RvQm9vbFxuICAjIChkZWJ1ZykgbWV0aG9kIHRvIGV4cGxpY2l0bHkgZm9yY2UgYW4gYGlmKG9iailgIGV2YWx1YXRpb24gdG8gZmxvdyB0aHJvdWdoIHRoZSBFUzUgc3BlYyBmb3IgdHJ1dGhpbmVzc1xuICAnRVM1X1RvQm9vbCc6ICh2YWwpIC0+XG4gICAgdmFsIGlzbnQgZmFsc2UgYW5kIHZhbCBpc250IDAgYW5kIHZhbCBpc250ICcnIGFuZCB2YWwgaXNudCBudWxsIGFuZCB0eXBlb2YgdmFsIGlzbnQgJ3VuZGVmaW5lZCcgYW5kICh0eXBlb2YgdmFsIGlzbnQgJ251bWJlcicgb3Igbm90IGlzTmFOKHZhbCkpXG5cbiAgIyAjIyBkYXRlRnJvbVRpY2tzXG4gICMgdGFrZSBhIG51bWJlciByZXByZXNlbnRpbmcgdGlja3MgYW5kIGNvbnZlcnQgaXQgaW50byBhbiBpbnN0YW5jZSBvZiBEYXRlXG4gIGRhdGVGcm9tVGlja3M6ICh0aWNrU3RyKSAtPlxuICAgIHRpY3NEYXRlVGltZSA9IHRvLnN0cmluZyh0aWNrU3RyKVxuICAgIHJldCA9IHVuZGVmaW5lZFxuICAgIHRpY2tzID0gdW5kZWZpbmVkXG4gICAgb2Zmc2V0ID0gdW5kZWZpbmVkXG4gICAgbG9jYWxPZmZzZXQgPSB1bmRlZmluZWRcbiAgICBhcnIgPSB1bmRlZmluZWRcbiAgICBpZiBmYWxzZSBpcyBpc01ldGhvZC5udWxsT3JFbXB0eSh0aWNzRGF0ZVRpbWUpXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnLycsICcnKVxuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJ0RhdGUnLCAnJylcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcoJywgJycpXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnKScsICcnKVxuICAgICAgYXJyID0gdGljc0RhdGVUaW1lLnNwbGl0KCctJylcbiAgICAgIGlmIGFyci5sZW5ndGggPiAxXG4gICAgICAgIHRpY2tzID0gdG8ubnVtYmVyKGFyclswXSlcbiAgICAgICAgb2Zmc2V0ID0gdG8ubnVtYmVyKGFyclsxXSlcbiAgICAgICAgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KClcbiAgICAgICAgcmV0ID0gbmV3IERhdGUoKHRpY2tzIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKVxuICAgICAgZWxzZSBpZiBhcnIubGVuZ3RoIGlzIDFcbiAgICAgICAgdGlja3MgPSB0by5udW1iZXIoYXJyWzBdKVxuICAgICAgICByZXQgPSBuZXcgRGF0ZSh0aWNrcylcbiAgICByZXRcblxuICAjICMjIGJpbmFyeVxuICAjIGNvbnZlcnQgYW4gb2JqZWN0IHRvIGJpbmFyeSAwIG9yIDFcbiAgYmluYXJ5OiAob2JqKSAtPlxuICAgIHJldCA9IE5hTlxuICAgIGlmIG9iaiBpcyAwIG9yIG9iaiBpcyAnMCcgb3Igb2JqIGlzICcnIG9yIG9iaiBpcyBmYWxzZSBvciB0by5zdHJpbmcob2JqKS50b0xvd2VyQ2FzZSgpLnRyaW0oKSBpcyAnZmFsc2UnXG4gICAgICByZXQgPSAwXG4gICAgZWxzZSByZXQgPSAxICBpZiBvYmogaXMgMSBvciBvYmogaXMgJzEnIG9yIG9iaiBpcyB0cnVlIG9yIHRvLnN0cmluZyhvYmopLnRvTG93ZXJDYXNlKCkudHJpbSgpIGlzICd0cnVlJ1xuICAgIHJldFxuXG5cbiAgIyAjIyBudW1iZXJcbiAgI1xuICAjIEF0dGVtcHRzIHRvIGNvbnZlcnQgYW4gYXJiaXRyYXJ5IHZhbHVlIHRvIGEgTnVtYmVyLlxuICAjIExvb3NlIGZhbHN5IHZhbHVlcyBhcmUgY29udmVydGVkIHRvIDAuXG4gICMgTG9vc2UgdHJ1dGh5IHZhbHVlcyBhcmUgY29udmVydGVkIHRvIDEuXG4gICMgQWxsIG90aGVyIHZhbHVlcyBhcmUgcGFyc2VkIGFzIEludGVnZXJzLlxuICAjIEZhaWx1cmVzIHJldHVybiBhcyBOYU4uXG4gICNcbiAgbnVtYmVyOiAoaW5wdXROdW0sIGRlZmF1bHROdW0pIC0+XG4gICAgdHJ5R2V0TnVtYmVyID0gKHZhbCkgLT5cbiAgICAgIHJldCA9IE5hTlxuICAgICAgIyBpZiBgdmFsYCBhbHJlYWR5IChpcylbaXMuaHRtbF0gYSBOdW1iZXIsIHJldHVybiBpdFxuICAgICAgaWYgaXNNZXRob2QubnVtYmVyKHZhbClcbiAgICAgICAgcmV0ID0gdmFsXG4gICAgICAjIGVsc2UgaWYgYHZhbGAgYWxyZWFkeSAoaXMpW2lzLmh0bWxdIGEgU3RyaW5nIG9yIGEgQm9vbGVhbiwgY29udmVydCBpdFxuICAgICAgZWxzZSBpZiBpc01ldGhvZC5zdHJpbmcodmFsKSBvciBpc01ldGhvZC5ib29sKHZhbClcbiAgICAgICAgdHJ5R2V0ID0gKHZhbHVlKSAtPlxuICAgICAgICAgIG51bSA9IHRvLmJpbmFyeSh2YWx1ZSlcbiAgICAgICAgICBudW0gPSArdmFsdWUgIGlmIG5vdCBpc01ldGhvZC5udW1iZXIobnVtKSBhbmQgdmFsdWVcbiAgICAgICAgICBudW0gPSBfLnBhcnNlSW50KHZhbHVlLCAwKSBpZiBub3QgaXNNZXRob2QubnVtYmVyKG51bSlcbiAgICAgICAgICBudW1cbiAgICAgICAgcmV0ID0gdHJ5R2V0IHZhbFxuICAgICAgcmV0XG5cbiAgICByZXRWYWwgPSB0cnlHZXROdW1iZXIoaW5wdXROdW0pXG4gICAgaWYgbm90IGlzTWV0aG9kLm51bWJlcihyZXRWYWwpXG4gICAgICByZXRWYWwgPSB0cnlHZXROdW1iZXIoZGVmYXVsdE51bSlcbiAgICAgIHJldFZhbCA9IE51bWJlci5OYU4gaWYgbm90IGlzTWV0aG9kLm51bWJlcihyZXRWYWwpXG4gICAgcmV0VmFsXG5cbiAgIyAjIyBzdHJpbmdcbiAgIyBjb252ZXJ0IGFuIG9iamVjdCB0byBzdHJpbmdcbiAgc3RyaW5nOiAoaW5wdXRTdHIsIGRlZmF1bHRTdHIpIC0+XG4gICAgdHJ5R2V0U3RyaW5nID0gKHN0cikgLT5cbiAgICAgIHJldCA9IHVuZGVmaW5lZFxuICAgICAgaWYgaXNNZXRob2Quc3RyaW5nKHN0cilcbiAgICAgICAgcmV0ID0gc3RyXG4gICAgICBlbHNlXG4gICAgICAgIHJldCA9ICcnXG4gICAgICAgIHJldCA9IHN0ci50b1N0cmluZygpICBpZiBpc01ldGhvZC5ib29sKHN0cikgb3IgaXNNZXRob2QubnVtYmVyKHN0cikgb3IgaXNNZXRob2QuZGF0ZShzdHIpXG4gICAgICByZXRcbiAgICByZXQxID0gdHJ5R2V0U3RyaW5nKGlucHV0U3RyKVxuICAgIHJldDIgPSB0cnlHZXRTdHJpbmcoZGVmYXVsdFN0cilcbiAgICByZXRWYWwgPSAnJ1xuICAgIGlmIHJldDEubGVuZ3RoIGlzbnQgMFxuICAgICAgcmV0VmFsID0gcmV0MVxuICAgIGVsc2UgaWYgcmV0MSBpcyByZXQyIG9yIHJldDIubGVuZ3RoIGlzIDBcbiAgICAgIHJldFZhbCA9IHJldDFcbiAgICBlbHNlXG4gICAgICByZXRWYWwgPSByZXQyXG4gICAgcmV0VmFsXG5cbk9iamVjdC5zZWFsIHRvXG5PYmplY3QuZnJlZXplIHRvXG5cbk9KLnJlZ2lzdGVyICd0bycsIHRvXG5tb2R1bGUuZXhwb3J0cyA9IHRvIiwiIyAjIGNyZWF0ZVVVSURcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbiMjI1xyXG5HZW5lcmF0ZXMgYSByYW5kb20gc3RyaW5nIHRoYXQgY29tcGxpZXMgdG8gdGhlIFJGQyA0MTIyIHNwZWNpZmljYXRpb24gZm9yIEdVSUQvVVVJRC5cclxuKGUuZy4gJ0I0MkExNTNGLTFEOUEtNEY5Mi05OTAzLTkyQzExREQ2ODREMicpXHJcbldoaWxlIG5vdCBhIHRydWUgVVVJRCwgZm9yIHRoZSBwdXJwb3NlcyBvZiB0aGlzIGFwcGxpY2F0aW9uLCBpdCBzaG91bGQgYmUgc3VmZmljaWVudC5cclxuIyMjXHJcbmNyZWF0ZUZhdXhVVUlEID0gLT5cclxuICAgIFxyXG4gICMgaHR0cDovL3d3dy5pZXRmLm9yZy9yZmMvcmZjNDEyMi50eHRcclxuICAjIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1MDM0L2hvdy10by1jcmVhdGUtYS1ndWlkLXV1aWQtaW4tamF2YXNjcmlwdFxyXG4gIHMgPSBbXVxyXG4gIHMubGVuZ3RoID0gMzZcclxuICBoZXhEaWdpdHMgPSAnMDEyMzQ1Njc4OWFiY2RlZidcclxuICBpID0gMFxyXG5cclxuICB3aGlsZSBpIDwgMzZcclxuICAgIHNbaV0gPSBoZXhEaWdpdHMuc3Vic3RyKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDB4MTApLCAxKVxyXG4gICAgaSArPSAxXHJcbiAgc1sxNF0gPSAnNCcgIyBiaXRzIDEyLTE1IG9mIHRoZSB0aW1lX2hpX2FuZF92ZXJzaW9uIGZpZWxkIHRvIDAwMTBcclxuICBzWzE5XSA9IGhleERpZ2l0cy5zdWJzdHIoKHNbMTldICYgMHgzKSB8IDB4OCwgMSkgIyBiaXRzIDYtNyBvZiB0aGUgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZCB0byAwMVxyXG4gIHNbOF0gPSBzWzEzXSA9IHNbMThdID0gc1syM10gPSAnLSdcclxuICB1dWlkID0gcy5qb2luKCcnKVxyXG4gIHV1aWRcclxuXHJcbk9KLnJlZ2lzdGVyICdjcmVhdGVVVUlEJywgY3JlYXRlRmF1eFVVSURcclxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVGYXV4VVVJRCJdfQ==
