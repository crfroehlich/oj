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

require('./tools/error.coffee');

require('./tools/history.coffee');

require('./tools/is.coffee');

require('./tools/noty.coffee');

require('./tools/pubsub.coffee');

require('./tools/queryString.coffee');

require('./tools/ranges.coffee');

require('./tools/to.coffee');

require('./tools/uuid.coffee');



},{"./async/ajax.coffee":2,"./async/promise.coffee":3,"./components/grid.coffee":4,"./components/inputgroup.coffee":5,"./components/tabs.coffee":6,"./components/tile.coffee":7,"./controls/icon.coffee":8,"./core/date.coffee":9,"./core/function.coffee":10,"./core/number.coffee":11,"./core/object.coffee":12,"./core/string.coffee":14,"./dom/Node.coffee":15,"./dom/body.coffee":16,"./dom/component.coffee":17,"./dom/control.coffee":18,"./dom/element.coffee":19,"./dom/fragment.coffee":20,"./dom/generics.coffee":21,"./dom/input.coffee":22,"./dom/nodeFactory.coffee":23,"./elements/a.coffee":24,"./elements/br.coffee":25,"./elements/form.coffee":26,"./elements/input.coffee":27,"./elements/ol.coffee":28,"./elements/select.coffee":29,"./elements/table.coffee":30,"./elements/textarea.coffee":31,"./elements/thead.coffee":32,"./elements/ul.coffee":33,"./inputs/buttoninput.coffee":35,"./inputs/checkbox.coffee":36,"./inputs/color.coffee":37,"./inputs/date.coffee":38,"./inputs/datetime.coffee":39,"./inputs/datetimelocal.coffee":40,"./inputs/email.coffee":41,"./inputs/file.coffee":42,"./inputs/hidden.coffee":43,"./inputs/imageinput.coffee":44,"./inputs/month.coffee":45,"./inputs/number.coffee":46,"./inputs/password.coffee":47,"./inputs/radio.coffee":48,"./inputs/range.coffee":49,"./inputs/reset.coffee":50,"./inputs/search.coffee":51,"./inputs/submit.coffee":52,"./inputs/tel.coffee":53,"./inputs/textinput.coffee":54,"./inputs/time.coffee":55,"./inputs/url.coffee":56,"./inputs/week.coffee":57,"./oj.coffee":58,"./ojInit.coffee":59,"./tools/array2D.coffee":61,"./tools/console.coffee":62,"./tools/cookie.coffee":63,"./tools/defer.coffee":64,"./tools/each.coffee":65,"./tools/enums.coffee":66,"./tools/error.coffee":67,"./tools/history.coffee":68,"./tools/is.coffee":69,"./tools/noty.coffee":70,"./tools/pubsub.coffee":71,"./tools/queryString.coffee":72,"./tools/ranges.coffee":73,"./tools/to.coffee":74,"./tools/uuid.coffee":75}],2:[function(require,module,exports){
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



},{"../dom/component":17,"../oj":58,"../ojInit":59,"../tools/uuid":75}],6:[function(require,module,exports){
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
},{"../oj":58,"../tools/is":69,"../tools/to":74}],16:[function(require,module,exports){
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
},{"../oj":58,"../tools/is":69,"./Node":15}],24:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbnRyeXBvaW50LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcYXN5bmNcXGFqYXguY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxhc3luY1xccHJvbWlzZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXGdyaWQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb21wb25lbnRzXFxpbnB1dGdyb3VwLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGFicy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXHRpbGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb250cm9sc1xcaWNvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGRhdGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxmdW5jdGlvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG51bWJlci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG9iamVjdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXHByb3BlcnR5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxcc3RyaW5nLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxOb2RlLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxib2R5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxjb21wb25lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGNvbnRyb2wuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGVsZW1lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGZyYWdtZW50LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxnZW5lcmljcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcaW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXG5vZGVGYWN0b3J5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGEuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcYnIuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcZm9ybS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxpbnB1dC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxvbC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxzZWxlY3QuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdGFibGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdGV4dGFyZWEuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdGhlYWQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdWwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxnbG9iYWwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGJ1dHRvbmlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxjaGVja2JveC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcY29sb3IuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGRhdGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGRhdGV0aW1lLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxkYXRldGltZWxvY2FsLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxlbWFpbC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZmlsZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcaGlkZGVuLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxpbWFnZWlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxtb250aC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcbnVtYmVyLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxwYXNzd29yZC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xccmFkaW8uY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJhbmdlLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxyZXNldC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcc2VhcmNoLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxzdWJtaXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHRlbC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdGV4dGlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx0aW1lLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx1cmwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHdlZWsuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxvai5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXG9qSW5pdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxKc29uVG9UYWJsZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxhcnJheTJELmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGNvbnNvbGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcY29va2llLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGRlZmVyLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGVhY2guY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZW51bXMuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZXJyb3IuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcaGlzdG9yeS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxpcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxub3R5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHB1YnN1Yi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxxdWVyeVN0cmluZy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxyYW5nZXMuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcdG8uY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcdXVpZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxPQUFBLENBQVEsYUFBUixDQUFBLENBQUE7O0FBQUEsT0FDQSxDQUFRLGlCQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLENBQVEscUJBQVIsQ0FGQSxDQUFBOztBQUFBLE9BR0EsQ0FBUSx3QkFBUixDQUhBLENBQUE7O0FBQUEsT0FJQSxDQUFRLDBCQUFSLENBSkEsQ0FBQTs7QUFBQSxPQUtBLENBQVEsZ0NBQVIsQ0FMQSxDQUFBOztBQUFBLE9BTUEsQ0FBUSwwQkFBUixDQU5BLENBQUE7O0FBQUEsT0FPQSxDQUFRLDBCQUFSLENBUEEsQ0FBQTs7QUFBQSxPQVFBLENBQVEsd0JBQVIsQ0FSQSxDQUFBOztBQUFBLE9BU0EsQ0FBUSxvQkFBUixDQVRBLENBQUE7O0FBQUEsT0FVQSxDQUFRLHdCQUFSLENBVkEsQ0FBQTs7QUFBQSxPQVdBLENBQVEsc0JBQVIsQ0FYQSxDQUFBOztBQUFBLE9BWUEsQ0FBUSxzQkFBUixDQVpBLENBQUE7O0FBQUEsT0FhQSxDQUFRLHNCQUFSLENBYkEsQ0FBQTs7QUFBQSxPQWNBLENBQVEsMEJBQVIs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QSxFQTREQSxnQkFBQSxFQUNFO0FBQUEsSUFBQSxFQUFBLEVBQUksQ0FBSjtBQUFBLElBQ0EsSUFBQSxFQUFNLGdCQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxPQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQTdERjtBQUFBLEVBd0VBLEtBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLENBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsSUFGYjtBQUFBLElBR0EsWUFBQSxFQUFjLElBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxPQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQXpFRjtBQUFBLEVBb0ZBLElBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLENBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxNQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxLQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQXJGRjtBQUFBLEVBZ0dBLE1BQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLENBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQWpHRjtBQUFBLEVBNEdBLEtBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLENBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQTdHRjtBQUFBLEVBd0hBLEtBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxPQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxFQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQXpIRjtBQUFBLEVBb0lBLE1BQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxFQUFJLEVBQUo7QUFBQSxJQUNBLElBQUEsRUFBTSxRQUROO0FBQUEsSUFFQSxXQUFBLEVBQWEsS0FGYjtBQUFBLElBR0EsWUFBQSxFQUFjLEtBSGQ7QUFBQSxJQUlBLEtBQUEsRUFDRTtBQUFBLE1BQUEsUUFBQSxFQUFVLEtBQVY7QUFBQSxNQUNBLE9BQUEsRUFBUyxJQURUO0tBTEY7QUFBQSxJQVFBLFlBQUEsRUFBYyxPQVJkO0FBQUEsSUFTQSxXQUFBLEVBQWEsSUFUYjtHQXJJRjtBQUFBLEVBZ0pBLFFBQUEsRUFDRTtBQUFBLElBQUEsRUFBQSxF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QUEsSUFHQSxZQUFBLEVBQWMsSUFIZDtBQUFBLElBSUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsT0FBQSxFQUFTLElBRFQ7S0FMRjtBQUFBLElBUUEsWUFBQSxFQUFjLE9BUmQ7QUFBQSxJQVNBLFdBQUEsRUFBYSxJQVRiO0dBcE9GO0FBQUEsRUErT0EsSUFBQSxFQUNFO0FBQUEsSUFBQSxFQUFBLEVBQUksRUFBSjtBQUFBLElBQ0EsSUFBQSxFQUFNLE1BRE47QUFBQSxJQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsSUFHQSxZQUFBLEVBQWMsSUFIZDtBQUFBLElBSUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsT0FBQSxFQUFTLElBRFQ7S0FMRjtBQUFBLElBUUEsWUFBQSxFQUFjLE9BUmQ7QUFBQSxJQVNBLFdBQUEsRUFBYSxJQVRiO0dBaFBGO0FBQUEsRUEyUEEsR0FBQSxFQUNFO0FBQUEsSUFBQSxFQUFBLEVBQUksRUFBSjtBQUFBLElBQ0EsSUFBQSxFQUFNLEtBRE47QUFBQSxJQUVBLFdBQUEsRUFBYSxJQUZiO0FBQUEsSUFHQSxZQUFBLEVBQWMsSUFIZDtBQUFBLElBSUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsT0FBQSxFQUFTLElBRFQ7S0FMRjtBQUFBLElBUUEsWUFBQSxFQUFjLE9BUmQ7QUFBQSxJQVNBLFdBQUEsRUFBYSxJQVRiO0dBNVBGO0FBQUEsRUF1UUEsSUFBQSxFQUNFO0FBQUEsSUFBQSxFQUFBLEVBQUksRUFBSjtBQUFBLElBQ0EsSUFBQSxFQUFNLE1BRE47QUFBQSxJQUVBLFdBQUEsRUFBYSxLQUZiO0FBQUEsSUFHQSxZQUFBLEVBQWMsS0FIZDtBQUFBLElBSUEsS0FBQSxFQUNFO0FBQUEsTUFBQSxRQUFBLEVBQVUsS0FBVjtBQUFBLE1BQ0EsT0FBQSxFQUFTLElBRFQ7S0FMRjtBQUFBLElBUUEsWUFBQSxFQUFjLEVBUmQ7QUFBQSxJQVNBLFdBQUEsRUFBYSxJQVRiO0dBeFFGO0NBTEYsQ0FBQTs7QUFBQSxFQXdSRSxDQUFDLEtBQUssQ0FBQyxRQUFULENBQWtCLFNBQWxCLEVBQTZCLE9BQTdCLENBeFJBLENBQUE7O0FBQUEsRUF5UkUsQ0FBQyxLQUFLLENBQUMsUUFBVCxDQUFrQixZQUFsQixFQUFnQyxVQUFoQyxDQXpSQSxDQUFBOztBQUFBLE1BMlJNLENBQUMsT0FBUCxHQUNFO0FBQUEsRUFBQSxPQUFBLEVBQVMsT0FBVDtBQUFBLEVBQ0EsVUFBQSxFQUFZLFVBRFo7Q0E1UkYsQ0FBQTs7Ozs7QUNBQSxJQUFBLFdBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFFQSxJQUFHLEVBQUUsQ0FBQyxjQUFOO0FBQ0UsRUFBQSxPQUFBLEdBQVUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFwQixDQUFBO0FBRUE7QUFBQTs7S0FGQTtBQUFBLEVBS0EsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFWLEdBQW9CLFNBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxVQUFYLEdBQUE7QUFDbEIsUUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sS0FBTixDQUFBO0FBQUEsSUFDQSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQVgsQ0FBZ0IseUJBQWhCLEVBQTJDLEdBQTNDLEVBQWdELEdBQWhELEVBQXFELFVBQXJELENBREEsQ0FBQTtBQUVBLElBQUEsSUFBc0MsT0FBdEM7QUFBQSxNQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsR0FBUixFQUFhLEdBQWIsRUFBa0IsVUFBbEIsQ0FBTixDQUFBO0tBRkE7V0FHQSxJQUprQjtFQUFBLENBTHBCLENBREY7Q0FGQTs7Ozs7QUNBQSxJQUFBLGlEQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBRUEsSUFBRyxFQUFFLENBQUMsTUFBTSxDQUFDLGdCQUFiO0FBQ0UsRUFBQSxTQUFBLEdBQVksa0JBQVosQ0FBQTtBQUFBLEVBQ0EsU0FBQSxHQUFZLEVBRFosQ0FERjtDQUFBLE1BQUE7QUFJRSxFQUFBLFNBQUEsR0FBWSxhQUFaLENBQUE7QUFBQSxFQUNBLFNBQUEsR0FBWSxJQURaLENBSkY7Q0FGQTs7QUFBQSxTQVNBLEdBQVksU0FBQyxRQUFELEVBQVcsS0FBWCxHQUFBO0FBQ1YsRUFBQSxJQUFHLFFBQUg7QUFFRSxJQUFBLE9BQU8sQ0FBQyxTQUFSLENBQWtCLElBQWxCLEVBQXdCLElBQXhCLEVBQThCLEdBQUEsR0FBTSxRQUFwQyxDQUFBLENBQUE7QUFJQSxJQUFBLElBQUcsS0FBSDtBQUVFLE1BQUEsSUFBRyxLQUFLLENBQUMsY0FBVDtBQUNFLFFBQUEsS0FBSyxDQUFDLGNBQU4sQ0FBQSxDQUFBLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxLQUFLLENBQUMsV0FBTixHQUFvQixLQUFwQixDQUhGO09BRkY7S0FORjtHQUFBO1NBWUEsTUFiVTtBQUFBLENBVFosQ0FBQTs7QUFBQSxZQXdCQSxHQUFlLFNBQUMsUUFBRCxHQUFBO0FBQ2IsTUFBQSxRQUFBO0FBQUEsRUFBQSxRQUFBLEdBQVcsUUFBUSxDQUFDLElBQXBCLENBQUE7QUFDQSxFQUFBLElBQUcsQ0FBQSxRQUFIO0FBQ0UsSUFBQSxRQUFBLEdBQVcsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFkLENBQW9CLEdBQXBCLENBQXlCLENBQUEsQ0FBQSxDQUFwQyxDQURGO0dBREE7QUFHQSxFQUFBLElBQUcsUUFBSDtBQUNFLElBQUEsUUFBQSxHQUFXLFFBQVEsQ0FBQyxPQUFULENBQWlCLEdBQWpCLEVBQXNCLEVBQXRCLENBQVgsQ0FBQTtBQUFBLElBQ0EsRUFBRSxDQUFDLE9BQUgsQ0FBVyxjQUFYLEVBQTJCO0FBQUEsTUFBQSxRQUFBLEVBQVUsUUFBVjtBQUFBLE1BQW9CLFFBQUEsRUFBVSxRQUE5QjtLQUEzQixDQURBLENBREY7R0FKYTtBQUFBLENBeEJmLENBQUE7O0FBaUNBO0FBQUE7O0dBakNBOztBQXFDQTtBQUFBOzs7Ozs7Ozs7Ozs7OztHQXJDQTs7QUFxREE7QUFBQTs7R0FyREE7O0FBQUEsRUF3REUsQ0FBQyxNQUFPLENBQUEsU0FBQSxDQUFWLENBQXFCLFNBQUEsR0FBWSxVQUFqQyxFQUE2QyxDQUFDLFNBQUMsS0FBRCxHQUFBO0FBSTVDO0FBQUE7Ozs7Ozs7S0FBQTtBQUFBLE1BQUEsY0FBQTtBQUFBLEVBUUEsY0FBQSxHQUFpQixPQUFPLENBQUMsUUFBUixJQUFvQixRQUFRLENBQUMsUUFSOUMsQ0FBQTtBQVVBO0FBQUE7O0tBVkE7QUFBQSxFQWFBLEVBQUUsQ0FBQyxPQUFPLENBQUMsWUFBWCxDQUF3QixjQUF4QixDQWJBLENBSjRDO0FBQUEsQ0FBRCxDQUE3QyxFQW9CRyxLQXBCSCxDQXhEQSxDQUFBOztBQUFBLEVBK0VFLENBQUMsT0FBTyxDQUFDLFFBQVgsQ0FBb0IsY0FBcEIsRUFBb0MsWUFBcEMsQ0EvRUEsQ0FBQTs7QUFBQSxFQWdGRSxDQUFDLE9BQU8sQ0FBQyxRQUFYLENBQW9CLFdBQXBCLEVBQWlDLFNBQWpDLENBaEZBLENBQUE7O0FBQUEsTUFrRk0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxFQUFBLFlBQUEsRUFBYyxZQUFkO0FBQUEsRUFDQSxTQUFBLEVBQVcsU0FEWDtDQW5GRixDQUFBOzs7OztBQ0FBLElBQUEsd0JBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxDQUNBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FESixDQUFBOztBQUFBLENBRUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUZKLENBQUE7O0FBQUEsSUFJQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBSlAsQ0FBQTs7QUFBQSxRQU1BLEdBQVcsRUFOWCxDQUFBOztBQUFBLFFBUVEsQ0FBQyxJQUFULEdBQWdCLFNBQUMsT0FBRCxHQUFBO1NBQ2QsQ0FBQyxDQUFDLFNBQUYsQ0FBWSxPQUFaLEVBRGM7QUFBQSxDQVJoQixDQUFBOztBQUFBLFFBV1EsQ0FBQyxnQkFBVCxHQUE0QixTQUFDLEdBQUQsR0FBQTtTQUMxQixDQUFDLENBQUMsT0FBRixDQUFVLEdBQVYsRUFEMEI7QUFBQSxDQVg1QixDQUFBOztBQUFBLFFBY1EsQ0FBQyxpQkFBVCxHQUE2QixTQUFDLEdBQUQsR0FBQTtTQUMzQixHQUFBLElBQVEsQ0FBQyxDQUFBLEdBQU8sQ0FBQyxNQUFSLElBQWtCLEdBQUcsQ0FBQyxNQUFKLEtBQWMsQ0FBaEMsSUFBcUMsQ0FBQSxHQUFPLENBQUMsSUFBN0MsSUFBcUQsQ0FBQSxHQUFPLENBQUMsSUFBSixDQUFBLENBQTFELEVBRG1CO0FBQUEsQ0FkN0IsQ0FBQTs7QUFBQSxRQWlCUSxDQUFDLGlCQUFULEdBQTZCLFNBQUMsR0FBRCxHQUFBO1NBQzNCLENBQUEsR0FBQSxJQUFXLEtBQUEsQ0FBTSxHQUFOLENBQVgsSUFBeUIsQ0FBQSxHQUFPLENBQUMsWUFETjtBQUFBLENBakI3QixDQUFBOztBQUFBLFFBb0JRLENBQUMsZUFBVCxHQUEyQixTQUFDLEVBQUQsR0FBQTtTQUN6QixDQUFBLEVBQUEsSUFBVSxDQUFBLEVBQU0sQ0FBQyxRQURRO0FBQUEsQ0FwQjNCLENBQUE7O0FBQUEsUUF1QlEsQ0FBQyxpQkFBVCxHQUE2QixTQUFDLEdBQUQsR0FBQTtTQUMzQixDQUFDLENBQUMsT0FBRixDQUFVLEdBQUEsSUFBTyxDQUFBLE1BQVUsQ0FBQyxJQUFQLENBQVksR0FBWixDQUFYLElBQStCLE1BQU0sQ0FBQyxJQUFQLENBQVksR0FBWixDQUFnQixDQUFDLE1BQWpCLEtBQTJCLENBQXBFLEVBRDJCO0FBQUEsQ0F2QjdCLENBQUE7O0FBQUEsUUEwQlEsQ0FBQyxXQUFULEdBQXVCLFNBQUMsR0FBRCxHQUFBO1NBQ3JCLENBQUMsQ0FBQyxhQUFGLENBQWdCLEdBQWhCLEVBRHFCO0FBQUEsQ0ExQnZCLENBQUE7O0FBQUEsUUE2QlEsQ0FBQyxNQUFULEdBQWtCLFNBQUMsR0FBRCxHQUFBO1NBQ2hCLENBQUMsQ0FBQyxRQUFGLENBQVcsR0FBWCxFQURnQjtBQUFBLENBN0JsQixDQUFBOztBQUFBLFFBZ0NRLENBQUMsSUFBVCxHQUFnQixTQUFDLEVBQUQsR0FBQTtTQUNkLENBQUMsQ0FBQyxNQUFGLENBQVMsRUFBVCxFQURjO0FBQUEsQ0FoQ2hCLENBQUE7O0FBb0NBO0FBQUE7O0dBcENBOztBQUFBLFFBdUNRLENBQUMsTUFBVCxHQUFrQixTQUFDLEdBQUQsR0FBQTtBQUNoQixNQUFBLE1BQUE7QUFBQSxFQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsZ0JBQVIsQ0FBVCxDQUFBO1NBQ0EsTUFBQSxDQUFBLEdBQUEsS0FBYyxRQUFkLElBQTJCLEtBQUEsS0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFQLENBQWEsR0FBYixDQUFBLElBQXFCLEtBQUEsS0FBUyxNQUFNLENBQUMsUUFBUCxDQUFnQixHQUFoQixDQUE5QixJQUFzRCxNQUFNLENBQUMsU0FBUCxLQUFvQixHQUExRSxJQUFpRixNQUFNLENBQUMsU0FBUCxLQUFvQixHQUF0RyxFQUZwQjtBQUFBLENBdkNsQixDQUFBOztBQTJDQTtBQUFBOztHQTNDQTs7QUFBQSxRQThDUSxDQUFDLE9BQVQsR0FBbUIsU0FBQyxHQUFELEdBQUE7QUFDakIsTUFBQSxjQUFBO0FBQUEsRUFBQSxHQUFBLEdBQU0sUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsR0FBaEIsQ0FBTixDQUFBO0FBQ0EsRUFBQSxJQUFBLENBQUEsR0FBQTtBQUNFLElBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxNQUFSLENBQUwsQ0FBQTtBQUFBLElBQ0EsS0FBQSxHQUFRLEVBQUUsQ0FBQyxNQUFILENBQVUsR0FBVixDQURSLENBQUE7QUFBQSxJQUVBLEdBQUEsR0FBTSxRQUFRLENBQUMsTUFBVCxDQUFnQixLQUFoQixDQUZOLENBREY7R0FEQTtTQUtBLElBTmlCO0FBQUEsQ0E5Q25CLENBQUE7O0FBQUEsUUFzRFEsQ0FBQyxZQUFULEdBQXdCLFNBQUMsR0FBRCxHQUFBO0FBQ3RCLE1BQUEsR0FBQTtBQUFBLEVBQUEsR0FBQSxHQUFPLEdBQUEsWUFBZSxFQUFHLENBQUEsR0FBQSxDQUF6QixDQUFBO1NBQ0EsSUFGc0I7QUFBQSxDQXREeEIsQ0FBQTs7QUFBQSxRQTBEUSxDQUFDLFlBQVQsR0FBd0IsU0FBQyxTQUFELEdBQUE7U0FDdEIsS0FBQSxLQUFTLFFBQVEsQ0FBQyxXQUFULENBQXFCLFFBQVEsQ0FBQyxjQUFULENBQXdCLFNBQXhCLENBQXJCLEVBRGE7QUFBQSxDQTFEeEIsQ0FBQTs7QUFBQSxRQTZEUSxDQUFDLEtBQVQsR0FBaUIsU0FBQyxHQUFELEdBQUE7U0FDZixDQUFDLENBQUMsT0FBRixDQUFVLEdBQVYsRUFEZTtBQUFBLENBN0RqQixDQUFBOztBQUFBLFFBZ0VRLENBQUMsTUFBVCxHQUFrQixTQUFDLEdBQUQsR0FBQTtTQUNoQixDQUFDLENBQUMsUUFBRixDQUFXLEdBQVgsRUFEZ0I7QUFBQSxDQWhFbEIsQ0FBQTs7QUFBQSxRQW1FUSxDQUFDLE1BQUQsQ0FBUixHQUFnQixTQUFDLEdBQUQsR0FBQTtTQUNkLEdBQUEsS0FBTyxJQUFQLElBQWUsR0FBQSxLQUFPLE1BQXRCLElBQWdDLEdBQUEsS0FBTyxDQUF2QyxJQUE0QyxHQUFBLEtBQU8sSUFEckM7QUFBQSxDQW5FaEIsQ0FBQTs7QUFBQSxRQXNFUSxDQUFDLE9BQUQsQ0FBUixHQUFpQixTQUFDLEdBQUQsR0FBQTtTQUNmLEdBQUEsS0FBTyxLQUFQLElBQWdCLEdBQUEsS0FBTyxPQUF2QixJQUFrQyxHQUFBLEtBQU8sQ0FBekMsSUFBOEMsR0FBQSxLQUFPLElBRHRDO0FBQUEsQ0F0RWpCLENBQUE7O0FBQUEsUUF5RVEsQ0FBQyxXQUFULEdBQXVCLFNBQUMsR0FBRCxHQUFBO1NBQ3JCLFFBQVEsQ0FBQyxNQUFELENBQVIsQ0FBYyxHQUFBLElBQU8sUUFBUSxDQUFDLE9BQUQsQ0FBUixDQUFlLEdBQWYsQ0FBckIsRUFEcUI7QUFBQSxDQXpFdkIsQ0FBQTs7QUFBQSxRQTRFUSxDQUFDLFdBQVQsR0FBdUIsU0FBQyxHQUFELEVBQU0sV0FBTixHQUFBO1NBQ3JCLENBQUMsQ0FBQyxPQUFGLENBQVUsR0FBVixDQUFBLElBQWtCLENBQUMsQ0FBQyxXQUFGLENBQWMsR0FBZCxDQUFsQixJQUF3QyxDQUFDLENBQUMsTUFBRixDQUFTLEdBQVQsQ0FBeEMsSUFBeUQsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxHQUFSLEVBRHBDO0FBQUEsQ0E1RXZCLENBQUE7O0FBQUEsUUErRVEsQ0FBQyxlQUFULEdBQTJCLFNBQUMsR0FBRCxFQUFNLFdBQU4sR0FBQTtTQUN6QixDQUFDLENBQUMsV0FBRixDQUFjLEdBQWQsQ0FBQSxJQUFzQixDQUFDLENBQUMsTUFBRixDQUFTLEdBQVQsQ0FBdEIsSUFBdUMsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxHQUFSLEVBRGQ7QUFBQSxDQS9FM0IsQ0FBQTs7QUFBQSxRQWtGUSxDQUFDLFlBQUQsQ0FBUixHQUFzQixTQUFDLElBQUQsRUFBTyxHQUFQLEdBQUE7U0FDcEIsR0FBRyxDQUFDLElBQUosS0FBWSxJQUFaLElBQW9CLEdBQUEsWUFBZSxLQURmO0FBQUEsQ0FsRnRCLENBQUE7O0FBQUEsUUFxRlEsQ0FBQyxNQUFULEdBQWtCLFNBQUMsR0FBRCxHQUFBO1NBQ2hCLEdBQUEsS0FBUyxFQUFFLENBQUMsSUFBWixJQUFxQixDQUFDLENBQUMsVUFBRixDQUFhLEdBQWIsRUFETDtBQUFBLENBckZsQixDQUFBOztBQXdGQTtBQUFBOztHQXhGQTs7QUFBQSxRQTJGUSxDQUFDLElBQVQsR0FBZ0IsUUFBUSxDQUFDLE1BM0Z6QixDQUFBOztBQUFBLE1BNkZNLENBQUMsSUFBUCxDQUFZLFFBQVosQ0E3RkEsQ0FBQTs7QUFBQSxNQThGTSxDQUFDLE1BQVAsQ0FBYyxRQUFkLENBOUZBLENBQUE7O0FBQUEsRUFnR0UsQ0FBQyxRQUFILENBQVksSUFBWixFQUFrQixRQUFsQixDQWhHQSxDQUFBOztBQUFBLE1BaUdNLENBQUMsT0FBUCxHQUFpQixRQWpHakIsQ0FBQTs7Ozs7OztBQ0FBLElBQUEsa0JBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFBQSxJQUNBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLFFBSUEsR0FBVyxTQUFDLE9BQUQsRUFBVSxLQUFWLEdBQUE7QUFDVCxNQUFBLGFBQUE7QUFBQSxFQUFBLFFBQUEsR0FDRTtBQUFBLElBQUEsTUFBQSxFQUFRLFVBQVI7QUFBQSxJQUNBLEtBQUEsRUFBTyxjQURQO0FBQUEsSUFFQSxJQUFBLEVBQU0sT0FGTjtBQUFBLElBR0EsSUFBQSxFQUFNLEVBSE47QUFBQSxJQUlBLFlBQUEsRUFBYyxJQUpkO0FBQUEsSUFLQSxRQUFBLEVBQVUsK0ZBTFY7QUFBQSxJQU1BLFNBQUEsRUFDSTtBQUFBLE1BQUEsSUFBQSxFQUNFO0FBQUEsUUFBQSxNQUFBLEVBQVEsUUFBUjtPQURGO0FBQUEsTUFFQSxLQUFBLEVBQ0U7QUFBQSxRQUFBLE1BQUEsRUFBUSxRQUFSO09BSEY7QUFBQSxNQUlBLE1BQUEsRUFBUSxPQUpSO0FBQUEsTUFLQSxLQUFBLEVBQU8sR0FMUDtLQVBKO0FBQUEsSUFhQSxPQUFBLEVBQVMsSUFiVDtBQUFBLElBY0EsS0FBQSxFQUFPLEtBZFA7QUFBQSxJQWVBLEtBQUEsRUFBTyxLQWZQO0FBQUEsSUFnQkEsVUFBQSxFQUFZLENBaEJaO0FBQUEsSUFpQkEsTUFBQSxFQUFRLEtBakJSO0FBQUEsSUFrQkEsU0FBQSxFQUFXLENBQUMsT0FBRCxDQWxCWDtBQUFBLElBbUJBLFFBQUEsRUFDSTtBQUFBLE1BQUEsTUFBQSxFQUFRLEVBQUUsQ0FBQyxJQUFYO0FBQUEsTUFDQSxTQUFBLEVBQVcsRUFBRSxDQUFDLElBRGQ7QUFBQSxNQUVBLE9BQUEsRUFBUyxFQUFFLENBQUMsSUFGWjtBQUFBLE1BR0EsVUFBQSxFQUFZLEVBQUUsQ0FBQyxJQUhmO0tBcEJKO0FBQUEsSUF3QkEsT0FBQSxFQUFTLEtBeEJUO0dBREYsQ0FBQTtBQUFBLEVBMkJBLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVixFQUFvQixPQUFwQixFQUE2QixJQUE3QixDQTNCQSxDQUFBO0FBQUEsRUE0QkEsR0FBQSxHQUFNLElBQUEsQ0FBSyxRQUFMLENBNUJOLENBQUE7U0E4QkEsSUEvQlM7QUFBQSxDQUpYLENBQUE7O0FBQUEsRUFxQ0UsQ0FBQyxhQUFhLENBQUMsUUFBakIsQ0FBMEIsTUFBMUIsRUFBa0MsUUFBbEMsQ0FyQ0EsQ0FBQTs7QUFBQSxNQXNDTSxDQUFDLE9BQVAsR0FBaUIsUUF0Q2pCLENBQUE7Ozs7Ozs7QUNBQSxJQUFBLDJDQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsTUFDQSxHQUFTLE9BQUEsQ0FBUSxXQUFSLENBRFQsQ0FBQTs7QUFBQSxNQUdBLEdBQVMsRUFIVCxDQUFBOztBQUFBLFdBSUEsR0FBYyxFQUpkLENBQUE7O0FBQUEsTUFLQSxHQUFTLEVBTFQsQ0FBQTs7QUFBQSxFQU9BLEdBQ0U7QUFBQSxFQUFBLFlBQUEsRUFBYyxTQUFDLEtBQUQsR0FBQTtXQUNaLEtBQUssQ0FBQyxXQUFOLENBQUEsQ0FBbUIsQ0FBQyxPQUFwQixDQUE0QixHQUE1QixFQUFpQyxHQUFqQyxFQURZO0VBQUEsQ0FBZDtBQUFBLEVBR0EsU0FBQSxFQUFXLFNBQUMsS0FBRCxFQUFRLE1BQVIsR0FBQTtBQUNULFFBQUEsZ0JBQUE7QUFBQSxJQUFBLFNBQUEsR0FBWSxFQUFFLENBQUMsWUFBSCxDQUFnQixLQUFoQixDQUFaLENBQUE7QUFDQSxJQUFBLElBQUcsQ0FBQSxNQUFXLENBQUEsU0FBQSxDQUFkO0FBQThCLE1BQUEsTUFBTyxDQUFBLFNBQUEsQ0FBUCxHQUFvQixFQUFwQixDQUE5QjtLQURBO0FBQUEsSUFHQSxLQUFBLEdBQVEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsU0FBakIsRUFBNEIsTUFBNUIsQ0FIUixDQUFBO0FBQUEsSUFJQSxNQUFPLENBQUEsS0FBQSxDQUFQLEdBQWdCLEtBSmhCLENBQUE7QUFBQSxJQUtBLFdBQVcsQ0FBQyxJQUFaLENBQWlCLE1BQWpCLENBTEEsQ0FBQTtBQUFBLElBTUEsTUFBTyxDQUFBLFNBQUEsQ0FBVSxDQUFDLElBQWxCLENBQXVCLE1BQXZCLENBTkEsQ0FBQTtXQU9BLE1BUlM7RUFBQSxDQUhYO0FBQUEsRUFhQSxPQUFBLEVBQVMsU0FBQyxLQUFELEVBQVEsSUFBUixHQUFBO0FBQ1AsUUFBQSxTQUFBO0FBQUEsSUFBQSxTQUFBLEdBQVksRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsS0FBaEIsQ0FBWixDQUFBO0FBQ0EsSUFBQSxJQUFHLE1BQU8sQ0FBQSxTQUFBLENBQVY7QUFDRSxNQUFBLE1BQU0sQ0FBQyxPQUFQLENBQWUsU0FBZixFQUEwQixJQUExQixDQUFBLENBREY7S0FBQSxNQUFBO0FBR0UsTUFBQSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQVgsQ0FBZ0IsZUFBQSxHQUFrQixLQUFsQixHQUEwQixzQkFBMUMsQ0FBQSxDQUhGO0tBRk87RUFBQSxDQWJUO0FBQUEsRUFxQkEsV0FBQSxFQUFhLFNBQUMsYUFBRCxHQUFBO0FBQ1gsSUFBQSxJQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTixDQUFhLGFBQWIsQ0FBSDtBQUNFLE1BQUEsSUFBRyxDQUFBLENBQUEsS0FBUSxXQUFXLENBQUMsT0FBWixDQUFvQixhQUFwQixDQUFYO0FBQ0UsUUFBQSxNQUFNLENBQUMsV0FBUCxDQUFtQixhQUFuQixDQUFBLENBQUE7QUFBQSxRQUNBLFdBQUEsR0FBYyxDQUFDLENBQUMsTUFBRixDQUFTLFdBQVQsRUFBc0IsU0FBQyxNQUFELEdBQUE7aUJBQVksTUFBQSxLQUFVLGNBQXRCO1FBQUEsQ0FBdEIsQ0FEZCxDQURGO09BQUEsTUFBQTtBQUlFLFFBQUEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFYLENBQWdCLGlDQUFoQixDQUFBLENBSkY7T0FERjtLQUFBLE1BQUE7QUFPRSxNQUFBLElBQUcsTUFBTyxDQUFBLGFBQUEsQ0FBVjtBQUNFLFFBQUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsYUFBbkIsQ0FBQSxDQUFBO0FBQUEsUUFDQSxNQUFBLENBQUEsTUFBYyxDQUFBLGFBQUEsQ0FEZCxDQURGO09BUEY7S0FEVztFQUFBLENBckJiO0FBQUEsRUFrQ0EsY0FBQSxFQUFnQixTQUFBLEdBQUE7QUFDZCxJQUFBLEVBQUUsQ0FBQyxJQUFILENBQVEsTUFBUixFQUFnQixTQUFDLEtBQUQsR0FBQTthQUFXLFdBQUEsQ0FBWSxLQUFaLEVBQVg7SUFBQSxDQUFoQixDQUFBLENBQUE7QUFBQSxJQUNBLFdBQUEsR0FBYyxFQURkLENBQUE7QUFBQSxJQUVBLE1BQUEsR0FBUyxFQUZULENBRGM7RUFBQSxDQWxDaEI7QUFBQSxFQXdDQSxnQkFBQSxFQUFrQixTQUFDLEtBQUQsR0FBQTtBQUNoQixRQUFBLFNBQUE7QUFBQSxJQUFBLFNBQUEsR0FBWSxFQUFFLENBQUMsWUFBSCxDQUFnQixLQUFoQixDQUFaLENBQUE7QUFDQSxJQUFBLElBQUcsTUFBTyxDQUFBLFNBQUEsQ0FBVjtBQUNFLE1BQUEsRUFBRSxDQUFDLElBQUgsQ0FBUSxNQUFPLENBQUEsU0FBQSxDQUFmLEVBQTJCLFNBQUMsTUFBRCxHQUFBO2VBQVksV0FBQSxDQUFZLE1BQVosRUFBWjtNQUFBLENBQTNCLENBQUEsQ0FERjtLQUFBLE1BQUE7QUFHRSxNQUFBLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBWCxDQUFnQixlQUFBLEdBQWtCLEtBQWxCLEdBQTBCLHNCQUExQyxDQUFBLENBSEY7S0FEQTtBQUFBLElBS0EsTUFBQSxDQUFBLE1BQWMsQ0FBQSxTQUFBLENBTGQsQ0FEZ0I7RUFBQSxDQXhDbEI7Q0FSRixDQUFBOztBQUFBLE1BeURNLENBQUMsSUFBUCxDQUFZLEVBQVosQ0F6REEsQ0FBQTs7QUFBQSxNQTBETSxDQUFDLE1BQVAsQ0FBYyxFQUFkLENBMURBLENBQUE7O0FBQUEsRUE0REUsQ0FBQyxRQUFILENBQVksY0FBWixFQUE0QixFQUFFLENBQUMsWUFBL0IsQ0E1REEsQ0FBQTs7QUFBQSxFQTZERSxDQUFDLFFBQUgsQ0FBWSxTQUFaLEVBQXVCLEVBQUUsQ0FBQyxPQUExQixDQTdEQSxDQUFBOztBQUFBLEVBOERFLENBQUMsUUFBSCxDQUFZLFdBQVosRUFBeUIsRUFBRSxDQUFDLFNBQTVCLENBOURBLENBQUE7O0FBQUEsRUErREUsQ0FBQyxRQUFILENBQVksYUFBWixFQUEyQixFQUFFLENBQUMsV0FBOUIsQ0EvREEsQ0FBQTs7QUFBQSxFQWdFRSxDQUFDLFFBQUgsQ0FBWSxnQkFBWixFQUE4QixFQUFFLENBQUMsY0FBakMsQ0FoRUEsQ0FBQTs7QUFBQSxFQWlFRSxDQUFDLFFBQUgsQ0FBWSxrQkFBWixFQUFnQyxFQUFFLENBQUMsZ0JBQW5DLENBakVBLENBQUE7O0FBQUEsTUFtRU0sQ0FBQyxPQUFQLEdBQWlCLEVBbkVqQixDQUFBOzs7Ozs7O0FDQUEsSUFBQSxlQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBRUE7QUFBQTs7R0FGQTs7QUFBQSxXQUtBLEdBQWMsU0FBQyxLQUFELEdBQUE7QUFDWixNQUFBLG1CQUFBO0FBQUEsRUFBQSxHQUFBLEdBQU0sRUFBTixDQUFBO0FBRUEsRUFBQSxJQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBYjtBQUNFLElBQUEsTUFBQSxHQUFVLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUExQixDQUFpQyxDQUFqQyxDQUFtQyxDQUFDLEtBQXBDLENBQTBDLEdBQTFDLENBQVYsQ0FBQTtBQUNBLElBQUEsSUFBRyxNQUFIO0FBQ0UsTUFBQSxDQUFBLEdBQUksQ0FBSixDQUFBO0FBQ0EsYUFBTSxDQUFBLEdBQUksTUFBTSxDQUFDLE1BQWpCLEdBQUE7QUFDRSxRQUFBLEdBQUEsR0FBTSxNQUFPLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBVixDQUFnQixHQUFoQixDQUFOLENBQUE7QUFDQSxRQUFBLElBQUcsR0FBRyxDQUFDLE1BQUosS0FBYyxDQUFqQjtBQUNFLFVBQUEsR0FBSSxDQUFBLEdBQUksQ0FBQSxDQUFBLENBQUosQ0FBSixHQUFjLEVBQUUsQ0FBQyxNQUFNLENBQUMsa0JBQVYsQ0FBNkIsR0FBSSxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQVAsQ0FBZSxLQUFmLEVBQXNCLEdBQXRCLENBQTdCLENBQWQsQ0FERjtTQURBO0FBQUEsUUFHQSxDQUFBLElBQUssQ0FITCxDQURGO01BQUEsQ0FGRjtLQUZGO0dBRkE7U0FXQSxJQVpZO0FBQUEsQ0FMZCxDQUFBOztBQUFBLEVBbUJFLENBQUMsUUFBSCxDQUFZLGFBQVosRUFBMEIsV0FBMUIsQ0FuQkEsQ0FBQTs7QUFBQSxNQW9CTSxDQUFDLE9BQVAsR0FBaUIsV0FwQmpCLENBQUE7Ozs7O0FDQUEsSUFBQSxxQkFBQTtFQUFBLGtCQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsQ0FDQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTs7QUFBQSxHQUVBLEdBQU0sT0FBQSxDQUFRLGdCQUFSLENBRk4sQ0FBQTs7QUFBQSxJQUdBLEdBQU8sT0FBQSxDQUFRLFFBQVIsQ0FIUCxDQUFBOztBQUFBLEdBT0EsR0FJRTtBQUFBLEVBQUEsS0FBQSxFQUFPLFNBQUEsR0FBQTtBQUNMLFFBQUEsTUFBQTtBQUFBLElBRE0sZ0VBQ04sQ0FBQTtXQUFBLENBQUMsQ0FBQyxLQUFGLFVBQVEsTUFBUixFQURLO0VBQUEsQ0FBUDtBQUFBLEVBS0EsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFFBQUEsTUFBQTtBQUFBLElBRFMsZ0VBQ1QsQ0FBQTtXQUFBLENBQUMsQ0FBQyxHQUFGLFVBQU0sTUFBTixFQURRO0VBQUEsQ0FMVjtBQUFBLEVBVUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLFFBQUEsTUFBQTtBQUFBLElBRFMsZ0VBQ1QsQ0FBQTtXQUFBLENBQUMsQ0FBQyxHQUFGLFVBQU0sTUFBTixFQURRO0VBQUEsQ0FWVjtBQWNBO0FBQUE7Ozs7S0FkQTtBQUFBLEVBbUJBLGlCQUFBLEVBQW1CLFNBQUMsQ0FBRCxFQUFRLEtBQVIsR0FBQTtBQUNqQixRQUFBLHdDQUFBOztNQURrQixJQUFJO0tBQ3RCOztNQUR5QixRQUFRO0tBQ2pDO0FBQUEsSUFBQSxTQUFBLEdBQVksRUFBWixDQUFBO0FBQUEsSUFHQSxJQUFBLENBQUssS0FBTCxFQUFZLFNBQUMsR0FBRCxHQUFBO0FBQ1YsVUFBQSxJQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sR0FBRyxDQUFDLElBQUosQ0FBQSxDQUFXLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBZCxDQUFBLENBQVAsQ0FBQTtBQUNBLE1BQUEsSUFBRyxLQUFBLEtBQVMsR0FBRyxDQUFDLFFBQUosQ0FBYSxTQUFiLEVBQXdCLElBQXhCLENBQVo7ZUFDRSxTQUFTLENBQUMsSUFBVixDQUFlLElBQUksQ0FBQyxVQUFMLENBQUEsQ0FBZixFQURGO09BRlU7SUFBQSxDQUFaLENBSEEsQ0FBQTtBQUFBLElBUUEsR0FBQSxHQUFNLGdCQUFBLENBQWlCLENBQWpCLEVBQW9CLFNBQXBCLENBUk4sQ0FBQTtBQUFBLElBVUEsQ0FBQSxHQUFJLENBVkosQ0FBQTtBQVdBLFdBQU0sQ0FBQSxHQUFJLENBQVYsR0FBQTtBQUNFLE1BQUEsQ0FBQSxJQUFLLENBQUwsQ0FBQTtBQUFBLE1BQ0EsUUFBQSxHQUFXLEdBQUksQ0FBQSxDQUFBLENBRGYsQ0FBQTtBQUFBLE1BRUEsUUFBUSxDQUFDLEdBQVQsQ0FBYSxNQUFNLENBQUMsWUFBcEIsQ0FGQSxDQURGO0lBQUEsQ0FYQTtBQUFBLElBZ0JBLFdBQUEsR0FBYyxHQUFHLENBQUMsUUFoQmxCLENBQUE7QUFBQSxJQWlCQSxHQUFHLENBQUMsUUFBSixHQUFlLFNBQUMsR0FBRCxHQUFBO0FBQ2IsVUFBQSxTQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sR0FBRyxDQUFDLElBQUosQ0FBQSxDQUFXLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBZCxDQUFBLENBQTJCLENBQUMsVUFBNUIsQ0FBQSxDQUFQLENBQUE7QUFBQSxNQUNBLEdBQUEsR0FBTSxXQUFBLENBQVksSUFBWixDQUROLENBQUE7YUFFQSxJQUhhO0lBQUEsQ0FqQmYsQ0FBQTtXQXFCQSxJQXRCaUI7RUFBQSxDQW5CbkI7QUE0Q0E7QUFBQTs7OztLQTVDQTtBQUFBLEVBaURBLFdBQUEsRUFBYSxTQUFDLENBQUQsRUFBUSxLQUFSLEdBQUE7QUFDWCxRQUFBLDZGQUFBOztNQURZLElBQUk7S0FDaEI7O01BRG1CLFFBQVE7S0FDM0I7QUFBQSxJQUFBLEdBQUEsR0FBTSxHQUFHLENBQUMsTUFBSixDQUFBLENBQU4sQ0FBQTtBQUFBLElBQ0EsUUFBQSxHQUFXLEdBQUcsQ0FBQyxRQUFKLENBQWEsS0FBYixDQURYLENBQUE7QUFBQSxJQUVBLFNBQUEsR0FBWSxHQUFHLENBQUMsUUFBSixDQUFhLEtBQWIsQ0FGWixDQUFBO0FBQUEsSUFJQSxRQUFBLEdBQVcsU0FBQSxHQUFZLFFBSnZCLENBQUE7QUFBQSxJQUtBLFlBQUEsR0FBZSxRQUFBLEdBQVMsQ0FMeEIsQ0FBQTtBQUFBLElBTUEsU0FBQSxHQUFZLEdBQUcsQ0FBQyxHQUFKLENBQVEsUUFBUixFQUFrQixHQUFHLENBQUMsTUFBSixDQUFBLENBQWxCLENBTlosQ0FBQTtBQUFBLElBT0EsUUFBQSxHQUFXLFFBUFgsQ0FBQTtBQUFBLElBU0EsR0FBQSxHQUFNLEdBQUcsQ0FBQyxNQUFKLENBQUEsQ0FUTixDQUFBO0FBQUEsSUFXQSxDQUFBLEdBQUksQ0FYSixDQUFBO0FBWUEsV0FBTSxDQUFBLEdBQUksQ0FBVixHQUFBO0FBQ0UsTUFBQSxDQUFBLElBQUssQ0FBTCxDQUFBO0FBQ0EsTUFBQSxJQUFHLENBQUEsR0FBSSxDQUFQO0FBQWMsUUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxZQUFYLENBQVAsQ0FBZDtPQUFBLE1BQUE7QUFFRSxRQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLFlBQVgsQ0FBUCxDQUFBO0FBQ0EsUUFBQSxJQUFHLFFBQUEsR0FBVyxJQUFYLElBQW1CLFNBQXRCO0FBQ0UsVUFBQSxJQUFBLElBQVEsU0FBQSxHQUFZLFFBQVosR0FBdUIsSUFBdkIsR0FBOEIsQ0FBdEMsQ0FERjtTQUhGO09BREE7QUFBQSxNQU9BLFFBQUEsR0FBVyxHQUFHLENBQUMsS0FBSixDQUFVLFFBQVYsRUFBb0IsUUFBQSxHQUFXLElBQS9CLENBUFgsQ0FBQTtBQUFBLE1BUUEsSUFBQSxDQUFLLFFBQUwsRUFBZSxTQUFDLEdBQUQsR0FBQTtlQUFTLEdBQUcsQ0FBQyxHQUFKLENBQVEsR0FBUixFQUFhLENBQWIsRUFBVDtNQUFBLENBQWYsQ0FSQSxDQUFBO0FBQUEsTUFTQSxTQUFVLENBQUEsQ0FBQSxDQUFWLEdBQWUsUUFUZixDQUFBO0FBQUEsTUFVQSxRQUFBLElBQVksSUFWWixDQURGO0lBQUEsQ0FaQTtBQUFBLElBeUJBLEdBQUcsQ0FBQyxHQUFKLENBQVEsVUFBUixFQUFvQixTQUFDLEdBQUQsR0FBQTthQUNsQixHQUFJLENBQUEsR0FBQSxFQURjO0lBQUEsQ0FBcEIsQ0F6QkEsQ0FBQTtXQTRCQSxJQTdCVztFQUFBLENBakRiO0NBWEYsQ0FBQTs7QUFBQSxNQTJGTSxDQUFDLElBQVAsQ0FBWSxHQUFaLENBM0ZBLENBQUE7O0FBQUEsTUE0Rk0sQ0FBQyxNQUFQLENBQWMsR0FBZCxDQTVGQSxDQUFBOztBQUFBLEVBOEZFLENBQUMsUUFBSCxDQUFZLFFBQVosRUFBc0IsR0FBdEIsQ0E5RkEsQ0FBQTs7QUFBQSxNQStGTSxDQUFDLE9BQVAsR0FBaUIsR0EvRmpCLENBQUE7Ozs7Ozs7QUNBQSxJQUFBLGlDQUFBOztBQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsT0FBUixDQUFMLENBQUE7O0FBQUEsQ0FDQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTs7QUFBQSxDQUVBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FGSixDQUFBOztBQUFBLFFBR0EsR0FBVyxPQUFBLENBQVEsTUFBUixDQUhYLENBQUE7O0FBQUEsR0FJQSxHQUFNLE9BQUEsQ0FBUSxnQkFBUixDQUpOLENBQUE7O0FBQUEsSUFLQSxHQUFPLE9BQUEsQ0FBUSxRQUFSLENBTFAsQ0FBQTs7QUFBQSxFQVFBLEdBR0U7QUFBQSxFQUFBLElBQUEsRUFBTSxTQUFDLEdBQUQsR0FBQTtBQUNKLFFBQUEsT0FBQTtBQUFBLElBQUEsT0FBQSxHQUFVLFFBQVMsQ0FBQSxNQUFBLENBQVQsQ0FBaUIsR0FBakIsQ0FBVixDQUFBO0FBQ0EsSUFBQSxJQUFvQixPQUFBLEtBQVcsS0FBWCxJQUFvQixPQUFBLEtBQWEsSUFBckQ7QUFBQSxNQUFBLE9BQUEsR0FBVSxLQUFWLENBQUE7S0FEQTtXQUVBLFFBSEk7RUFBQSxDQUFOO0FBQUEsRUFPQSxZQUFBLEVBQWMsU0FBQyxHQUFELEdBQUE7V0FDWixHQUFBLEtBQVMsS0FBVCxJQUFtQixHQUFBLEtBQVMsQ0FBNUIsSUFBa0MsR0FBQSxLQUFTLEVBQTNDLElBQWtELEdBQUEsS0FBUyxJQUEzRCxJQUFvRSxNQUFBLENBQUEsR0FBQSxLQUFnQixXQUFwRixJQUFvRyxDQUFDLE1BQUEsQ0FBQSxHQUFBLEtBQWdCLFFBQWhCLElBQTRCLENBQUEsS0FBSSxDQUFNLEdBQU4sQ0FBakMsRUFEeEY7RUFBQSxDQVBkO0FBQUEsRUFZQSxhQUFBLEVBQWUsU0FBQyxPQUFELEdBQUE7QUFDYixRQUFBLGtEQUFBO0FBQUEsSUFBQSxZQUFBLEdBQWUsRUFBRSxDQUFDLE1BQUgsQ0FBVSxPQUFWLENBQWYsQ0FBQTtBQUFBLElBQ0EsR0FBQSxHQUFNLE1BRE4sQ0FBQTtBQUFBLElBRUEsS0FBQSxHQUFRLE1BRlIsQ0FBQTtBQUFBLElBR0EsTUFBQSxHQUFTLE1BSFQsQ0FBQTtBQUFBLElBSUEsV0FBQSxHQUFjLE1BSmQsQ0FBQTtBQUFBLElBS0EsR0FBQSxHQUFNLE1BTE4sQ0FBQTtBQU1BLElBQUEsSUFBRyxLQUFBLEtBQVMsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsWUFBckIsQ0FBWjtBQUNFLE1BQUEsWUFBQSxHQUFlLFlBQVksQ0FBQyxPQUFiLENBQXFCLEdBQXJCLEVBQTBCLEVBQTFCLENBQWYsQ0FBQTtBQUFBLE1BQ0EsWUFBQSxHQUFlLFlBQVksQ0FBQyxPQUFiLENBQXFCLE1BQXJCLEVBQTZCLEVBQTdCLENBRGYsQ0FBQTtBQUFBLE1BRUEsWUFBQSxHQUFlLFlBQVksQ0FBQyxPQUFiLENBQXFCLEdBQXJCLEVBQTBCLEVBQTFCLENBRmYsQ0FBQTtBQUFBLE1BR0EsWUFBQSxHQUFlLFlBQVksQ0FBQyxPQUFiLENBQXFCLEdBQXJCLEVBQTBCLEVBQTFCLENBSGYsQ0FBQTtBQUFBLE1BSUEsR0FBQSxHQUFNLFlBQVksQ0FBQyxLQUFiLENBQW1CLEdBQW5CLENBSk4sQ0FBQTtBQUtBLE1BQUEsSUFBRyxHQUFHLENBQUMsTUFBSixHQUFhLENBQWhCO0FBQ0UsUUFBQSxLQUFBLEdBQVEsRUFBRSxDQUFDLE1BQUgsQ0FBVSxHQUFJLENBQUEsQ0FBQSxDQUFkLENBQVIsQ0FBQTtBQUFBLFFBQ0EsTUFBQSxHQUFTLEVBQUUsQ0FBQyxNQUFILENBQVUsR0FBSSxDQUFBLENBQUEsQ0FBZCxDQURULENBQUE7QUFBQSxRQUVBLFdBQUEsR0FBa0IsSUFBQSxJQUFBLENBQUEsQ0FBTSxDQUFDLGlCQUFQLENBQUEsQ0FGbEIsQ0FBQTtBQUFBLFFBR0EsR0FBQSxHQUFVLElBQUEsSUFBQSxDQUFNLEtBQUEsR0FBUSxDQUFDLENBQUMsV0FBQSxHQUFjLENBQUMsTUFBQSxHQUFTLEdBQVQsR0FBZSxFQUFoQixDQUFmLENBQUEsR0FBc0MsSUFBdkMsQ0FBZCxDQUhWLENBREY7T0FBQSxNQUtLLElBQUcsR0FBRyxDQUFDLE1BQUosS0FBYyxDQUFqQjtBQUNILFFBQUEsS0FBQSxHQUFRLEVBQUUsQ0FBQyxNQUFILENBQVUsR0FBSSxDQUFBLENBQUEsQ0FBZCxDQUFSLENBQUE7QUFBQSxRQUNBLEdBQUEsR0FBVSxJQUFBLElBQUEsQ0FBSyxLQUFMLENBRFYsQ0FERztPQVhQO0tBTkE7V0FvQkEsSUFyQmE7RUFBQSxDQVpmO0FBQUEsRUFxQ0EsTUFBQSxFQUFRLFNBQUMsR0FBRCxHQUFBO0FBQ04sUUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sR0FBTixDQUFBO0FBQ0EsSUFBQSxJQUFHLEdBQUEsS0FBTyxDQUFQLElBQVksR0FBQSxLQUFPLEdBQW5CLElBQTBCLEdBQUEsS0FBTyxFQUFqQyxJQUF1QyxHQUFBLEtBQU8sS0FBOUMsSUFBdUQsRUFBRSxDQUFDLE1BQUgsQ0FBVSxHQUFWLENBQWMsQ0FBQyxXQUFmLENBQUEsQ0FBNEIsQ0FBQyxJQUE3QixDQUFBLENBQUEsS0FBdUMsT0FBakc7QUFDRSxNQUFBLEdBQUEsR0FBTSxDQUFOLENBREY7S0FBQSxNQUFBO0FBRUssTUFBQSxJQUFZLEdBQUEsS0FBTyxDQUFQLElBQVksR0FBQSxLQUFPLEdBQW5CLElBQTBCLEdBQUEsS0FBTyxJQUFqQyxJQUF5QyxFQUFFLENBQUMsTUFBSCxDQUFVLEdBQVYsQ0FBYyxDQUFDLFdBQWYsQ0FBQSxDQUE0QixDQUFDLElBQTdCLENBQUEsQ0FBQSxLQUF1QyxNQUE1RjtBQUFBLFFBQUEsR0FBQSxHQUFNLENBQU4sQ0FBQTtPQUZMO0tBREE7V0FJQSxJQUxNO0VBQUEsQ0FyQ1I7QUFBQSxFQXFEQSxNQUFBLEVBQVEsU0FBQyxRQUFELEVBQVcsVUFBWCxHQUFBO0FBQ04sUUFBQSxvQkFBQTtBQUFBLElBQUEsWUFBQSxHQUFlLFNBQUMsR0FBRCxHQUFBO0FBQ2IsVUFBQSxXQUFBO0FBQUEsTUFBQSxHQUFBLEdBQU0sR0FBTixDQUFBO0FBRUEsTUFBQSxJQUFHLFFBQVEsQ0FBQyxNQUFULENBQWdCLEdBQWhCLENBQUg7QUFDRSxRQUFBLEdBQUEsR0FBTSxHQUFOLENBREY7T0FBQSxNQUdLLElBQUcsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsR0FBaEIsQ0FBQSxJQUF3QixRQUFRLENBQUMsSUFBVCxDQUFjLEdBQWQsQ0FBM0I7QUFDSCxRQUFBLE1BQUEsR0FBUyxTQUFDLEtBQUQsR0FBQTtBQUNQLGNBQUEsR0FBQTtBQUFBLFVBQUEsR0FBQSxHQUFNLEVBQUUsQ0FBQyxNQUFILENBQVUsS0FBVixDQUFOLENBQUE7QUFDQSxVQUFBLElBQWlCLENBQUEsUUFBWSxDQUFDLE1BQVQsQ0FBZ0IsR0FBaEIsQ0FBSixJQUE2QixLQUE5QztBQUFBLFlBQUEsR0FBQSxHQUFNLENBQUEsS0FBTixDQUFBO1dBREE7QUFFQSxVQUFBLElBQThCLENBQUEsUUFBWSxDQUFDLE1BQVQsQ0FBZ0IsR0FBaEIsQ0FBbEM7QUFBQSxZQUFBLEdBQUEsR0FBTSxDQUFDLENBQUMsUUFBRixDQUFXLEtBQVgsRUFBa0IsQ0FBbEIsQ0FBTixDQUFBO1dBRkE7aUJBR0EsSUFKTztRQUFBLENBQVQsQ0FBQTtBQUFBLFFBS0EsR0FBQSxHQUFNLE1BQUEsQ0FBTyxHQUFQLENBTE4sQ0FERztPQUxMO2FBWUEsSUFiYTtJQUFBLENBQWYsQ0FBQTtBQUFBLElBZUEsTUFBQSxHQUFTLFlBQUEsQ0FBYSxRQUFiLENBZlQsQ0FBQTtBQWdCQSxJQUFBLElBQUcsQ0FBQSxRQUFZLENBQUMsTUFBVCxDQUFnQixNQUFoQixDQUFQO0FBQ0UsTUFBQSxNQUFBLEdBQVMsWUFBQSxDQUFhLFVBQWIsQ0FBVCxDQUFBO0FBQ0EsTUFBQSxJQUF1QixDQUFBLFFBQVksQ0FBQyxNQUFULENBQWdCLE1BQWhCLENBQTNCO0FBQUEsUUFBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLEdBQWhCLENBQUE7T0FGRjtLQWhCQTtXQW1CQSxPQXBCTTtFQUFBLENBckRSO0FBQUEsRUE2RUEsTUFBQSxFQUFRLFNBQUMsUUFBRCxFQUFXLFVBQVgsR0FBQTtBQUNOLFFBQUEsZ0NBQUE7QUFBQSxJQUFBLFlBQUEsR0FBZSxTQUFDLEdBQUQsR0FBQTtBQUNiLFVBQUEsR0FBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLE1BQU4sQ0FBQTtBQUNBLE1BQUEsSUFBRyxRQUFRLENBQUMsTUFBVCxDQUFnQixHQUFoQixDQUFIO0FBQ0UsUUFBQSxHQUFBLEdBQU0sR0FBTixDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsR0FBQSxHQUFNLEVBQU4sQ0FBQTtBQUNBLFFBQUEsSUFBeUIsUUFBUSxDQUFDLElBQVQsQ0FBYyxHQUFkLENBQUEsSUFBc0IsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsR0FBaEIsQ0FBdEIsSUFBOEMsUUFBUSxDQUFDLElBQVQsQ0FBYyxHQUFkLENBQXZFO0FBQUEsVUFBQSxHQUFBLEdBQU0sR0FBRyxDQUFDLFFBQUosQ0FBQSxDQUFOLENBQUE7U0FKRjtPQURBO2FBTUEsSUFQYTtJQUFBLENBQWYsQ0FBQTtBQUFBLElBUUEsSUFBQSxHQUFPLFlBQUEsQ0FBYSxRQUFiLENBUlAsQ0FBQTtBQUFBLElBU0EsSUFBQSxHQUFPLFlBQUEsQ0FBYSxVQUFiLENBVFAsQ0FBQTtBQUFBLElBVUEsTUFBQSxHQUFTLEVBVlQsQ0FBQTtBQVdBLElBQUEsSUFBRyxJQUFJLENBQUMsTUFBTCxLQUFpQixDQUFwQjtBQUNFLE1BQUEsTUFBQSxHQUFTLElBQVQsQ0FERjtLQUFBLE1BRUssSUFBRyxJQUFBLEtBQVEsSUFBUixJQUFnQixJQUFJLENBQUMsTUFBTCxLQUFlLENBQWxDO0FBQ0gsTUFBQSxNQUFBLEdBQVMsSUFBVCxDQURHO0tBQUEsTUFBQTtBQUdILE1BQUEsTUFBQSxHQUFTLElBQVQsQ0FIRztLQWJMO1dBaUJBLE9BbEJNO0VBQUEsQ0E3RVI7Q0FYRixDQUFBOztBQUFBLE1BNEdNLENBQUMsSUFBUCxDQUFZLEVBQVosQ0E1R0EsQ0FBQTs7QUFBQSxNQTZHTSxDQUFDLE1BQVAsQ0FBYyxFQUFkLENBN0dBLENBQUE7O0FBQUEsRUErR0UsQ0FBQyxRQUFILENBQVksSUFBWixFQUFrQixFQUFsQixDQS9HQSxDQUFBOztBQUFBLE1BZ0hNLENBQUMsT0FBUCxHQUFpQixFQWhIakIsQ0FBQTs7Ozs7OztBQ0VBLElBQUEsa0JBQUE7O0FBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxPQUFSLENBQUwsQ0FBQTs7QUFFQTtBQUFBOzs7O0dBRkE7O0FBQUEsY0FPQSxHQUFpQixTQUFBLEdBQUE7QUFJZixNQUFBLHFCQUFBO0FBQUEsRUFBQSxDQUFBLEdBQUksRUFBSixDQUFBO0FBQUEsRUFDQSxDQUFDLENBQUMsTUFBRixHQUFXLEVBRFgsQ0FBQTtBQUFBLEVBRUEsU0FBQSxHQUFZLGtCQUZaLENBQUE7QUFBQSxFQUdBLENBQUEsR0FBSSxDQUhKLENBQUE7QUFLQSxTQUFNLENBQUEsR0FBSSxFQUFWLEdBQUE7QUFDRSxJQUFBLENBQUUsQ0FBQSxDQUFBLENBQUYsR0FBTyxTQUFTLENBQUMsTUFBVixDQUFpQixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxNQUFMLENBQUEsQ0FBQSxHQUFnQixJQUEzQixDQUFqQixFQUFtRCxDQUFuRCxDQUFQLENBQUE7QUFBQSxJQUNBLENBQUEsSUFBSyxDQURMLENBREY7RUFBQSxDQUxBO0FBQUEsRUFRQSxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsR0FSUixDQUFBO0FBQUEsRUFTQSxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsU0FBUyxDQUFDLE1BQVYsQ0FBaUIsQ0FBQyxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsR0FBVCxDQUFBLEdBQWdCLEdBQWpDLEVBQXNDLENBQXRDLENBVFIsQ0FBQTtBQUFBLEVBVUEsQ0FBRSxDQUFBLENBQUEsQ0FBRixHQUFPLENBQUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLEdBVi9CLENBQUE7QUFBQSxFQVdBLElBQUEsR0FBTyxDQUFDLENBQUMsSUFBRixDQUFPLEVBQVAsQ0FYUCxDQUFBO1NBWUEsS0FoQmU7QUFBQSxDQVBqQixDQUFBOztBQUFBLEVBeUJFLENBQUMsUUFBSCxDQUFZLFlBQVosRUFBMEIsY0FBMUIsQ0F6QkEsQ0FBQTs7QUFBQSxNQTBCTSxDQUFDLE9BQVAsR0FBaUIsY0ExQmpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSAnLi9vai5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vb2pJbml0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9hc3luYy9hamF4LmNvZmZlZSdcclxucmVxdWlyZSAnLi9hc3luYy9wcm9taXNlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL2dyaWQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvaW5wdXRncm91cC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29tcG9uZW50cy90YWJzLmNvZmZlZSdcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL3RpbGUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvbnRyb2xzL2ljb24uY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvcmUvZGF0ZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29yZS9mdW5jdGlvbi5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29yZS9udW1iZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvcmUvb2JqZWN0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9jb3JlL3N0cmluZy5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZG9tL25vZGVGYWN0b3J5LmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vYm9keS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZG9tL2NvbXBvbmVudC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZG9tL2NvbnRyb2wuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RvbS9Ob2RlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vZWxlbWVudC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZG9tL2ZyYWdtZW50LmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vZ2VuZXJpY3MuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RvbS9pbnB1dC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvYS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvYnIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2Zvcm0uY29mZmVlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2lucHV0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy9vbC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvc2VsZWN0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy90YWJsZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvdGV4dGFyZWEuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RoZWFkLmNvZmZlZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy91bC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2J1dHRvbmlucHV0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvY2hlY2tib3guY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9jb2xvci5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2RhdGUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9kYXRldGltZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2RhdGV0aW1lbG9jYWwuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9lbWFpbC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2ZpbGUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9oaWRkZW4uY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9pbWFnZWlucHV0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvbW9udGguY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9udW1iZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9wYXNzd29yZC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3JhZGlvLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvcmFuZ2UuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9yZXNldC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3NlYXJjaC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3N1Ym1pdC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3RlbC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3RleHRpbnB1dC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3RpbWUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy91cmwuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy93ZWVrLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9hcnJheTJELmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9jb25zb2xlLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9jb29raWUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2RlZmVyLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9lYWNoLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9lbnVtcy5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvZXJyb3IuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2hpc3RvcnkuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2lzLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9ub3R5LmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9wdWJzdWIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL3F1ZXJ5U3RyaW5nLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9yYW5nZXMuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL3RvLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy91dWlkLmNvZmZlZSciLCIjICMgYWpheFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbmNvbmZpZyA9IHt9XHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgb24gc3VjY2VzcyBoYW5kbGVyLCB3cml0ZSBvdXQgdGhlIHJlcXVlc3Qgc3RhdHMgdG8gYSB0YWJsZVxyXG5jb25maWcub25TdWNjZXNzID0gKG9wdHMsIGRhdGEsIHVybCkgLT5cclxuICByZXNwb25zZSA9IHt9XHJcbiAgT0ouZXh0ZW5kIHJlc3BvbnNlLCBkYXRhXHJcbiAgb3B0cy5vblN1Y2Nlc3MgcmVzcG9uc2VcclxuICBpZiBPSi5MT0dfQUxMX0FKQVhcclxuICAgIE9KLmNvbnNvbGUudGFibGUgW1xyXG4gICAgICBXZWJzZXJ2aWNlOiBvcHRzLmFqYXhPcHRzLnVybFxyXG4gICAgICBTdGFydFRpbWU6IG9wdHMuc3RhcnRUaW1lXHJcbiAgICAgIEVuZFRpbWU6IG5ldyBEYXRlKClcclxuICAgIF0gXHJcbiAgcmV0dXJuXHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgb24gZXJyb3IgaGFuZGxlciwgd3JpdGUgb3V0IHRoZSByZXF1ZXN0IGVycm9yIGNvbmV4dCB0byBhIHRhYmxlXHJcbmNvbmZpZy5vbkVycm9yID0gKHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzLCBwYXJhbTEsIG9wdHMgPSBPSi5vYmplY3QoKSkgLT5cclxuICBpZiB0ZXh0U3RhdHVzIGlzbnQgJ2Fib3J0J1xyXG4gICAgaWYgT0ouTE9HX0FMTF9BSkFYX0VSUk9SU1xyXG4gICAgICBPSi5jb25zb2xlLnRhYmxlIFtcclxuICAgICAgICBXZWJzZXJ2aWNlOiBvcHRzLmFqYXhPcHRzLnVybFxyXG4gICAgICAgIERhdGE6IG9wdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgICAgIEZhaWxlZDogdGV4dFN0YXR1c1xyXG4gICAgICAgIFN0YXRlOiB4bWxIdHRwUmVxdWVzdC5zdGF0ZSgpXHJcbiAgICAgICAgU3RhdHVzOiB4bWxIdHRwUmVxdWVzdC5zdGF0dXNcclxuICAgICAgICBTdGF0dXNUZXh0OiB4bWxIdHRwUmVxdWVzdC5zdGF0dXNUZXh0XHJcbiAgICAgICAgUmVhZHlTdGF0ZTogeG1sSHR0cFJlcXVlc3QucmVhZHlTdGF0ZVxyXG4gICAgICAgIFJlc3BvbnNlVGV4dDogeG1sSHR0cFJlcXVlc3QucmVzcG9uc2VUZXh0XHJcbiAgICAgIF1cclxuXHJcbiAgICBvcHRzLm9uRXJyb3IgdGV4dFN0YXR1c1xyXG4gIHJldHVyblxyXG4gIFxyXG4jIGluIHRoZSBjYXNlIHdoZXJlIGBvcHRzYCBpcyBhIHN0cmluZywgY29udmVydCBpdCB0byBhbiBvYmplY3Rcclxub3B0c0Zyb21VcmwgPSAob3B0cykgLT5cclxuICBpZiBPSi5pcy5zdHJpbmcgb3B0c1xyXG4gICAgdXJsID0gb3B0c1xyXG4gICAgb3B0cyA9IE9KLm9iamVjdCgpXHJcbiAgICBvcHRzLmFkZCAnYWpheE9wdHMnLCBPSi5vYmplY3QoKVxyXG4gICAgb3B0cy5hamF4T3B0cy5hZGQgJ3VybCcsIHVybFxyXG4gIG9wdHNcclxuICBcclxuIyBkZWZpbmUgYSBzdGFuZGFyZCBgZXhlY2AgbWV0aG9kIHRvIGhhbmRsZSBhbGwgcmVxdWVzdCB2ZXJicy4gVXNlcyB0aGUgW2pRdWVyeS5hamF4XShodHRwOi8vYXBpLmpxdWVyeS5jb20vY2F0ZWdvcnkvYWpheC8pIEFQSS5cclxuIyBgZXhlY1JlcXVlc3RgIHJldHVybnMgYSBwcm9taXNlIHJlcHJlc2VudCB0aGUgYWN0dWFsIEFKQVggY2FsbC5cclxuICBcclxuIyAtIGB2ZXJiYCBkZWZhdWx0IHZhbHVlID0gJ0dFVCdcclxuIyAtIGBvcHRzYCBvYmplY3RcclxuIyAtLSBgb3B0cy5hamF4T3B0c2Agb2JqZWN0IGZvciBhbGwgalF1ZXJ5J3MgYWpheC1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxyXG5jb25maWcuZXhlY1JlcXVlc3QgPSAodmVyYiA9ICdHRVQnLCBvcHRzKSAtPlxyXG4gIGRlZmF1bHRzID1cclxuICAgIGFqYXhPcHRzOlxyXG4gICAgICB1cmw6ICcnXHJcbiAgICAgIGRhdGE6IHt9XHJcbiAgICAgIHR5cGU6IHZlcmJcclxuICAgICAgeGhyRmllbGRzOlxyXG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICBkYXRhVHlwZTogJ2pzb24nXHJcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuICAgICAgICBcclxuICAgIG9uU3VjY2VzczogT0oubm9vcFxyXG4gICAgb25FcnJvcjogT0oubm9vcFxyXG4gICAgb25Db21wbGV0ZTogT0oubm9vcFxyXG4gICAgb3ZlcnJpZGVFcnJvcjogZmFsc2VcclxuICAgIHdhdGNoR2xvYmFsOiB0cnVlXHJcbiAgICB1c2VDYWNoZTogZmFsc2VcclxuICAgIFxyXG4gIG9wdHMgPSBvcHRzRnJvbVVybCBvcHRzXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRzLCB0cnVlXHJcbiAgICBcclxuICBkZWZhdWx0cy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpXHJcbiAgICBcclxuICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXHJcbiAgICAjIEdFVCByZXF1ZXN0cyBleHBlY3QgcXVlcnlTdHJpbmcgcGFyYW1ldGVyc1xyXG4gICAgaWYgZGVmYXVsdHMuYWpheE9wdHMudmVyYiBpcyAnR0VUJ1xyXG4gICAgICBkZWZhdWx0cy5hamF4T3B0cy5kYXRhID0gT0oucGFyYW1zIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcclxuICAgICMgYWxsIG90aGVyIHJlcXVlc3RzIHRha2UgYW4gb2JqZWN0XHJcbiAgICBlbHNlXHJcbiAgICAgIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGEgPSBPSi5zZXJpYWxpemUgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgXHJcbiAgZ2V0SlF1ZXJ5RGVmZXJyZWQgPSAod2F0Y2hHbG9iYWwpIC0+XHJcbiAgICByZXQgPSAkLmFqYXggZGVmYXVsdHMuYWpheE9wdHNcclxuICAgICAgXHJcbiAgICByZXQuZG9uZSAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIC0+XHJcbiAgICAgIGNvbmZpZy5vblN1Y2Nlc3MgZGVmYXVsdHMsIGRhdGFcclxuXHJcbiAgICByZXQuZmFpbCAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGV4dCkgLT5cclxuICAgICAgY29uZmlnLm9uRXJyb3IganFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGV4dCwgZGVmYXVsdHNcclxuICBcclxuICAgIHJldC5hbHdheXMgKHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzKSAtPlxyXG4gICAgICBkZWZhdWx0cy5vbkNvbXBsZXRlIHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzXHJcblxyXG4gICAgT0ouYXN5bmMuYWpheFByb21pc2UgcmV0XHJcblxyXG4gIHByb21pc2UgPSBnZXRKUXVlcnlEZWZlcnJlZChkZWZhdWx0cy53YXRjaEdsb2JhbClcclxuICBwcm9taXNlXHJcbiAgXHJcbmFqYXggPSB7fVxyXG4gIFxyXG4jICMjIHBvc3RcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXgucG9zdDogaW5zZXJ0IGEgbmV3IG9iamVjdCBvciBpbml0IGEgZm9ybSBwb3N0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC4gXHJcbmFqYXgucG9zdCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnUE9TVCcsIG9wdHNcclxuICBcclxuIyAjIyBnZXRcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXguZ2V0OiBnZXQgYW4gZXhpc3Rpbmcgb2JqZWN0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuI1xyXG5hamF4LmdldCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnR0VUJywgb3B0c1xyXG5cclxuIyAjIyBkZWxldGVcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXguZGVsZXRlOiBkZWxldGUgYW4gZXhpc3Rpbmcgb2JqZWN0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuYWpheC5kZWxldGUgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ0RFTEVURScsIG9wdHNcclxuXHJcbiMgIyMgcHV0XHJcbiMgW09KXShvai5odG1sKS5hamF4LnB1dDogdXBkYXRlIGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbmFqYXgucHV0ID0gKG9wdHMpIC0+XHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdQVVQnLCBvcHRzXHJcblxyXG5PSi5hc3luYy5yZWdpc3RlciAnYWpheCcsIGFqYXhcclxubW9kdWxlLmV4cG9ydHMgPSBhamF4IiwiIyAjIHByb21pc2VcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jICMjIGFqYXhQcm9taXNlXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5hamF4UHJvbWlzZSBjb252ZXJ0cyBhbiBBSkFYIFhtbEh0dHBSZXF1ZXN0IGludG8gYSBQcm9taXNlLiBcclxuIyBTZWUgYWxzbyBbUHJvbWlzZS5yZXNvbHZlXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbmFqYXhQcm9taXNlID0gKGFqYXgpIC0+IFxyXG4gIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUgYWpheFxyXG4gIHByb21pc2UuYWJvcnQgPSBhamF4LmFib3J0XHJcbiAgcHJvbWlzZS5yZWFkeVN0YXRlID0gYWpheC5yZWFkeVN0YXRlXHJcbiAgcHJvbWlzZVxyXG5cclxuIyAjIyBhbGxcclxuIyBbT0pdKG9qLmh0bWwpLmFzeW5jLmFsbCB0YWtlcyBhbiBhcnJheSBvZiBmdW5jdGlvbnMgYW5kIHJldHVybnMgYSBwcm9taXNlIHJlcHJlc2VudGluZyB0aGUgc3VjY2VzcyBvZiBhbGwgbWV0aG9kcyBvciB0aGUgZmFpbHVyZSBvZiBhbnkgbWV0aG9kLlxyXG4jIFNlZSBhbHNvIFtQcm9taXNlLmFsbF0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG5hbGwgPSAoaW5pdEFycmF5KSAtPlxyXG4gIHJlcXMgPSBpbml0QXJyYXkgb3IgW11cclxuICBwcm9taXNlID0gUHJvbWlzZS5hbGwocmVxcylcclxuICBwcm9taXNlLnB1c2ggPSAoaXRlbSkgLT5cclxuICAgIHJlcXMucHVzaCBpdGVtXHJcbiAgICByZXR1cm5cclxuICBwcm9taXNlXHJcblxyXG4jICMjIGRlZmVyXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5kZWZlciBjb252ZXJ0cyBhIGZ1bmN0aW9uIGludG8gYSBQcm9taXNlIHRvIGV4ZWN1dGUgdGhhdCBmdW5jdGlvbi4gXHJcbiMgU2VlIGFsc28gW1Byb21pc2UubWV0aG9kXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbmRlZnIgPSAoZnVuYyA9IE9KLm5vb3ApIC0+XHJcbiAgcmV0ID0gUHJvbWlzZS5tZXRob2QgZnVuY1xyXG4gIHJldFxyXG4gIFxyXG4gIFxyXG5PSi5hc3luYy5yZWdpc3RlciAnZGVmZXInLCBkZWZyXHJcbk9KLmFzeW5jLnJlZ2lzdGVyICdhbGwnLCBhbGxcclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2FqYXhQcm9taXNlJywgYWpheFByb21pc2VcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuICBkZWZlcjogZGVmclxyXG4gIGFsbDogYWxsXHJcbiAgYWpheFByb21pc2U6IGFqYXhQcm9taXNlXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xuYXJyYXkyRCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FycmF5MkQnXG5cbm5vZGVOYW1lID0gJ3gtZ3JpZCdcbmNsYXNzTmFtZSA9ICdncmlkJ1xuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxuXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cbiAgZGVmYXVsdHMgPVxuICAgIHRpbGVTaXplczpcbiAgICAgIHNtYWxsU3BhbjogJydcbiAgICAgIG1lZGl1bVNwYW46ICcnXG4gICAgICBsYXJnZVNwYW46ICcnXG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJ2dyaWQnXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG4gIHJldCA9IGNvbXBvbmVudCBkZWZhdWx0cywgb3duZXIsIG5vZGVOYW1lXG5cbiAgcm93cyA9IFtdXG4gIHRpbGVzID0gYXJyYXkyRCgpXG5cbiAgZmlsbE1pc3NpbmcgPSAoKSAtPlxuICAgIHRpbGVzLmVhY2ggKHJvd05vLCBjb2xObywgdmFsKSAtPlxuICAgICAgaWYgbm90IHZhbFxuICAgICAgICByb3cgPSByZXQucm93IHJvd05vXG4gICAgICAgIHJvdy5tYWtlICd0aWxlJywgY29sTm8sIHt9XG5cbiAgcmV0LmFkZCAncm93JywgKHJvd05vID0gcm93cy5sZW5ndGgtMSBvciAxKS0+XG4gICAgbnVSb3cgPSByb3dzW3Jvd05vLTFdXG4gICAgaWYgbm90IG51Um93XG4gICAgICB3aGlsZSByb3dzLmxlbmd0aCA8IHJvd05vXG4gICAgICAgIG51Um93ID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ3JvdydcbiAgICAgICAgcm93cy5wdXNoIG51Um93XG4gICAgICBudVJvdy5hZGQgJ3RpbGUnLCAoY29sTm8sIG9wdHMpIC0+XG4gICAgICAgIG9wdHMgPSBPSi5leHRlbmQgKE9KLmV4dGVuZCB7fSwgZGVmYXVsdHMudGlsZVNpemVzKSwgb3B0c1xuICAgICAgICBudVRpbGUgPSBPSi5jb21wb25lbnRzLnRpbGUgb3B0cywgbnVSb3dcbiAgICAgICAgdGlsZXMuc2V0IHJvd05vLCBjb2xObywgbnVUaWxlXG4gICAgICAgIG51VGlsZVxuICAgIG51Um93XG5cbiAgcmV0LmFkZCAndGlsZScsIChyb3dObywgY29sTm8sIG9wdHMpIC0+XG4gICAgaWYgbm90IHJvd05vIG9yIHJvd05vIDwgMSB0aGVuIHJvd05vID0gMVxuICAgIGlmIG5vdCBjb2xObyBvciBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcblxuICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cbiAgICB0aWxlID0gdGlsZXMuZ2V0IHJvd05vLCBjb2xOb1xuXG4gICAgaWYgbm90IHRpbGVcbiAgICAgIGkgPSAwXG4gICAgICB3aGlsZSBpIDwgY29sTm9cbiAgICAgICAgaSArPSAxXG4gICAgICAgIHRyeVRpbGUgPSB0aWxlcy5nZXQgcm93Tm8sIGlcbiAgICAgICAgaWYgbm90IHRyeVRpbGVcbiAgICAgICAgICBpZiBpIGlzIGNvbE5vXG4gICAgICAgICAgICB0aWxlID0gcm93Lm1ha2UgJ3RpbGUnLCBvcHRzXG4gICAgICAgICAgZWxzZSBpZiBub3QgdGlsZVxuICAgICAgICAgICAgcm93Lm1ha2UgJ3RpbGUnXG5cbiAgICBmaWxsTWlzc2luZygpXG4gICAgdGlsZVxuXG4gIHJldFxuXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcbm1vZHVsZS5leHBvcnRzID0gY21wbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vb2pJbml0J1xuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcbnV1aWQgPSByZXF1aXJlICcuLi90b29scy91dWlkJ1xuXG5ub2RlTmFtZSA9ICd4LWlucHV0LWdyb3VwJ1xuY2xhc3NOYW1lID0gJ2lucHV0Z3JvdXAnXG5cbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcblxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XG4gIGZvcklkID0gdXVpZCgpXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIGNsYXNzOiAnZm9ybS1ncm91cCdcbiAgICBldmVudHM6XG4gICAgICBjaGFuZ2U6IE9KLm5vb3BcbiAgICBmb3I6IGZvcklkXG4gICAgbGFiZWxUZXh0OiAnJ1xuICAgIGlucHV0T3B0czpcbiAgICAgIHByb3BzOlxuICAgICAgICBpZDogZm9ySWRcbiAgICAgICAgdHlwZTogJ3RleHQnXG4gICAgICAgIGNsYXNzOiAnJ1xuICAgICAgICBwbGFjZWhvbGRlcjogJydcbiAgICAgICAgdmFsdWU6ICcnXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG4gIHJldCA9IGNvbXBvbmVudCBkZWZhdWx0cywgb3duZXIsIG5vZGVOYW1lXG5cbiAgZ3JvdXAgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAnZm9ybS1ncm91cCdcblxuICByZXQuZ3JvdXBMYWJlbCA9IGdyb3VwLm1ha2UgJ2xhYmVsJywgcHJvcHM6IHsgZm9yOiBmb3JJZCB9LCB0ZXh0OiBkZWZhdWx0cy5sYWJlbFRleHRcblxuICBkZWZhdWx0cy5pbnB1dE9wdHMucHJvcHMuY2xhc3MgKz0gJyBmb3JtLWNvbnRyb2wnXG4gIHJldC5ncm91cElucHV0ID0gZ3JvdXAubWFrZSAnaW5wdXQnLCBkZWZhdWx0cy5pbnB1dE9wdHNcblxuICByZXQuZ3JvdXBWYWx1ZSA9ICgpIC0+XG4gICAgcmV0Lmdyb3VwSW5wdXQudmFsKClcblxuICByZXRcblxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbXBvbmVudCA9IHJlcXVpcmUgJy4uL2RvbS9jb21wb25lbnQnXG5cbm5vZGVOYW1lID0gJ3gtdGFicydcbmNsYXNzTmFtZSA9ICd0YWJzJ1xuXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXG5cbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBkZWZhdWx0cyA9XG4gICAgdGFiczoge31cbiAgICBwcm9wczpcbiAgICAgIGNsYXNzOiAnJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuXG4gIHRhYnMgPSByZXQubWFrZSAndWwnLCBwcm9wczogY2xhc3M6ICduYXYgbmF2LXRhYnMnXG4gIGNvbnRlbnQgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAndGFiLWNvbnRlbnQnXG5cbiAgZmlyc3QgPSB0cnVlXG4gIE9KLmVhY2ggZGVmYXVsdHMudGFicywgKHRhYlZhbCwgdGFiTmFtZSkgLT5cbiAgICB0YWJDbGFzcyA9ICcnXG4gICAgaWYgZmlyc3RcbiAgICAgIGZpcnN0ID0gZmFsc2VcbiAgICAgIHRhYkNsYXNzID0gJ2FjdGl2ZSdcbiAgICBhID0gdGFicy5tYWtlICdsaScsIHByb3BzOiBjbGFzczogdGFiQ2xhc3NcbiAgICAgIC5tYWtlKCdhJyxcbiAgICAgICAgdGV4dDogdGFiTmFtZVxuICAgICAgICBwcm9wczpcbiAgICAgICAgICBocmVmOiAnIycgKyB0YWJOYW1lXG4gICAgICAgICAgJ2RhdGEtdG9nZ2xlJzogJ3RhYidcbiAgICAgICAgZXZlbnRzOlxuICAgICAgICAgIGNsaWNrOiAtPlxuICAgICAgICAgICAgYS4kLnRhYiAnc2hvdycpXG5cbiAgICB0YWJDb250ZW50Q2xhc3MgPSAndGFiLXBhbmUgJyArIHRhYkNsYXNzXG4gICAgcmV0LmFkZCB0YWJOYW1lLCBjb250ZW50Lm1ha2UoJ2RpdicsIHByb3BzOiBjbGFzczogdGFiQ29udGVudENsYXNzLCBpZDogdGFiTmFtZSlcblxuICByZXRcblxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbXBvbmVudCA9IHJlcXVpcmUgJy4uL2RvbS9jb21wb25lbnQnXG5cbm5vZGVOYW1lID0gJ3gtdGlsZSdcbmNsYXNzTmFtZSA9ICd0aWxlJ1xuXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXG4gIFxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XG4gIGRlZmF1bHRzID1cbiAgICB3aWR0aDpcbiAgICAgIHhzOiAnJ1xuICAgICAgc206ICcnXG4gICAgICBtZDogJydcbiAgICAgIGxnOiAnJ1xuICAgIHByb3BzOlxuICAgICAgY2xhc3M6ICd0aWxlJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICBpZiBkZWZhdWx0cy53aWR0aC54cyB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLXhzLScgKyBkZWZhdWx0cy53aWR0aC54c1xuICBpZiBkZWZhdWx0cy53aWR0aC5zbSB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLXNtLScgKyBkZWZhdWx0cy53aWR0aC5zbVxuICBpZiBkZWZhdWx0cy53aWR0aC5tZCB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLW1kLScgKyBkZWZhdWx0cy53aWR0aC5tZFxuICBpZiBkZWZhdWx0cy53aWR0aC5sZyB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLWxnLScgKyBkZWZhdWx0cy53aWR0aC5sZ1xuXG4gIHJldCA9IE9KLmNvbXBvbmVudCBkZWZhdWx0cywgb3duZXIsIG5vZGVOYW1lXG4gIHJldFxuXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcbm1vZHVsZS5leHBvcnRzID0gY21wbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vb2pJbml0J1xuY29udHJvbCA9IHJlcXVpcmUgJy4uL2RvbS9jb250cm9sJ1xuXG5jb250cm9sTmFtZSA9ICd5LWljb24nXG5mcmllbmRseU5hbWUgPSAnaWNvbidcblxuT0ouY29udHJvbHMubWVtYmVyc1tmcmllbmRseU5hbWVdID0gY29udHJvbE5hbWVcblxuY250cmwgPSAob3B0aW9ucywgb3duZXIpIC0+XG4gIGRlZmF1bHRzID1cbiAgICBpY29uT3B0czpcbiAgICAgIG5hbWU6ICcnXG4gICAgICBzdGFja2VkSWNvbjogJydcbiAgICAgIHN3YXBJY29uOiAnJ1xuICAgICAgc2l6ZTogZmFsc2VcbiAgICAgIGNvbG9yOiAnJ1xuICAgICAgbGlicmFyeTogJydcbiAgICAgIGlzRml4ZWRXaWR0aDogZmFsc2VcbiAgICAgIGlzTGlzdDogZmFsc2VcbiAgICAgIGlzU3Bpbm5lcjogZmFsc2VcbiAgICBwcm9wczpcbiAgICAgIGNsYXNzOiAnJ1xuICAgIHJvb3ROb2RlVHlwZTogJ3NwYW4nXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zXG4gIHJldCA9IGNvbnRyb2wgZGVmYXVsdHMsIG93bmVyLCBjb250cm9sTmFtZVxuXG4gIGlzVG9nZ2xlZCA9IGZhbHNlXG5cbiAgI1RPRE86IFN1cHBvcnQgZm9yIHBpY3RvaWNvbnNcbiAgI1RPRE86IFN1cHBvcnQgZm9yIG90aGVyIEZvbnRBd2Vzb21lIHByb3BlcnRpZXMgKHN0YWNrLCByb3RhdGUsIHNpemUsIGV0YylcblxuICBjbGFzc05hbWVCYXNlID0gJ2ZhICdcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuaXNGaXhlZFdpZHRoIHRoZW4gY2xhc3NOYW1lQmFzZSArPSAnZmEtZncgJ1xuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc0xpc3QgdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1saSAnXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzU3Bpbm5lciB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLXNwaW4gJ1xuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zaXplXG4gICAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSA+IDEgYW5kIGRlZmF1bHRzLmljb25PcHRzLnNpemUgPD0gNVxuICAgICAgY2xhc3NOYW1lQmFzZSArPSAnZmEtJyArIGRlZmF1bHRzLmljb25PcHRzLnNpemUgKyAneCAnXG5cbiAgY2xhc3NOYW1lID0gY2xhc3NOYW1lQmFzZSArICdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMubmFtZVxuICByZXQubXlJY29uID0gcmV0Lm1ha2UgJ2knLCBwcm9wczogY2xhc3M6IGNsYXNzTmFtZVxuXG4gICNUb2dnbGVzIGRpc3BsYXkgYmV0d2VlbiBub3JtYWwgaWNvbiBhbmQgc3dhcCBpY29uLCBpZiBhIHN3YXAgaWNvbiBoYXMgYmVlbiBzcGVjaWZpZWRcbiAgcmV0LnRvZ2dsZUljb24gPSAtPlxuICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uXG4gICAgICBuZXdJY29uID0gZGVmYXVsdHMuaWNvbk9wdHMubmFtZVxuXG4gICAgICBpc1RvZ2dsZWQgPSAhaXNUb2dnbGVkXG5cbiAgICAgIGlmIGlzVG9nZ2xlZFxuICAgICAgICByZXQubXlJY29uLiQucmVtb3ZlQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxuICAgICAgICBuZXdJY29uID0gZGVmYXVsdHMuaWNvbk9wdHMuc3dhcEljb25cbiAgICAgIGVsc2VcbiAgICAgICAgcmV0Lm15SWNvbi4kLnJlbW92ZUNsYXNzKCdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMuc3dhcEljb24pXG5cbiAgICAgIHJldC5teUljb24uJC5hZGRDbGFzcygnZmEtJyArIG5ld0ljb24pXG5cblxuICByZXRcblxuT0ouY29udHJvbHMucmVnaXN0ZXIgZnJpZW5kbHlOYW1lLCBjbnRybFxubW9kdWxlLmV4cG9ydHMgPSBjbnRybCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG5nZXREYXRlRnJvbURuSnNvbiA9IChkbkRhdGUpIC0+XHJcbiAgICBcclxuICAjIFRyYW5zZm9ybXMgYSAuTkVUIEpTT04gZGF0ZSBpbnRvIGEgSmF2YVNjcmlwdCBkYXRlLlxyXG4gICMgbmFtZT0nb2JqJyAgT2JqZWN0IHRvIHRlc3RcclxuICAjIHR5cGU9J0Jvb2xlYW4nIC8+XHJcbiAgI1xyXG4gICMgICAgICAgdmFyIG1pbGxpID0gT0oudG8ubnVtYmVyKERuRGF0ZS5yZXBsYWNlKC9cXC9EYXRlXFwoKFxcZCspXFwtPyhcXGQrKVxcKVxcLy8sICckMScpKTtcclxuICAjICAgICAgIHZhciBvZmZzZXQgPSBPSi50by5udW1iZXIoRG5EYXRlLnJlcGxhY2UoL1xcL0RhdGVcXChcXGQrKFtcXCtcXC1dP1xcZCspXFwpXFwvLywgJyQxJykpO1xyXG4gICMgICAgICAgdmFyIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpO1xyXG4gICMgICAgICAgcmV0dXJuIG5ldyBEYXRlKChtaWxsaSAtICgobG9jYWxPZmZzZXQgKyAob2Zmc2V0IC8gMTAwICogNjApKSAqIDEwMDApKSk7XHJcbiAgIyAgICAgICBcclxuICAgIFxyXG4gICMgRG4gRGF0ZSB3aWxsIGxvb2sgbGlrZSAvRGF0ZSgxMzM1NzU4NDAwMDAwLTA0MDApLyAgXHJcbiAgZG5EYXRlU3RyID0gT0oudG8uc3RyaW5nKGRuRGF0ZSlcclxuICByZXQgPSB1bmRlZmluZWRcclxuICB0aWNrcyA9IHVuZGVmaW5lZFxyXG4gIG9mZnNldCA9IHVuZGVmaW5lZFxyXG4gIGxvY2FsT2Zmc2V0ID0gdW5kZWZpbmVkXHJcbiAgYXJyID0gdW5kZWZpbmVkXHJcbiAgcmV0ID0gT0ouZGF0ZVRpbWVNaW5WYWx1ZVxyXG4gIGlmIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5KGRuRGF0ZVN0cilcclxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCcvJywgJycpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnRGF0ZScsICcnKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJygnLCAnJylcclxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCcpJywgJycpXHJcbiAgICBhcnIgPSBkbkRhdGVTdHIuc3BsaXQoJy0nKVxyXG4gICAgaWYgYXJyLmxlbmd0aCA+IDFcclxuICAgICAgdGlja3MgPSBPSi50by5udW1iZXIoYXJyWzBdKVxyXG4gICAgICBvZmZzZXQgPSBPSi50by5udW1iZXIoYXJyWzFdKVxyXG4gICAgICBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKVxyXG4gICAgICByZXQgPSBuZXcgRGF0ZSgodGlja3MgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpXHJcbiAgICBlbHNlIGlmIGFyci5sZW5ndGggaXMgMVxyXG4gICAgICB0aWNrcyA9IE9KLnRvLm51bWJlcihhcnJbMF0pXHJcbiAgICAgIHJldCA9IG5ldyBEYXRlKHRpY2tzKVxyXG4gIHJldFxyXG5cclxuICBPSi5yZWdpc3RlciAnZ2V0RGF0ZUZyb21Ebkpzb24nLCBnZXREYXRlRnJvbURuSnNvblxyXG4gIG1vZHVsZXMuZXhwb3J0cyA9IGdldERhdGVGcm9tRG5Kc29uXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jIFdyYXAgdGhlIGV4ZWN1dGlvbiBvZiBhIG1ldGhvZCBpbiBhIHRyeS4uY2F0Y2guLmZpbmFsbHkgICAgIFxyXG4jIGlnbm9yZSBlcnJvcnMgZmFpbGluZyB0byBleGVjIHNlbGYtZXhlY3V0aW5nIGZ1bmN0aW9ucyBcclxuIyBSZXR1cm4gYSBtZXRob2Qgd3JhcHBlZCBpbiBhIHRyeS4uY2F0Y2guLmZpbmFsbHlcclxudHJ5RXhlYyA9ICh0cnlGdW5jKSAtPlxyXG4gICd1c2Ugc3RyaWN0J1xyXG4gIHJldCA9IGZhbHNlXHJcbiAgdGhhdCA9IHRoaXNcclxuICB0cnlcclxuICAgIHJldCA9IHRyeUZ1bmMuYXBwbHkodGhhdCwgQXJyYXk6OnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSkgIGlmIE9KLmlzLm1ldGhvZCh0cnlGdW5jKVxyXG4gIGNhdGNoIGV4Y2VwdGlvblxyXG4gICAgaWYgKGV4Y2VwdGlvbi5uYW1lIGlzICdUeXBlRXJyb3InIG9yIGV4Y2VwdGlvbi50eXBlIGlzICdjYWxsZWRfbm9uX2NhbGxhYmxlJykgYW5kIGV4Y2VwdGlvbi50eXBlIGlzICdub25fb2JqZWN0X3Byb3BlcnR5X2xvYWQnXHJcbiAgICAgIE9KLmNvbnNvbGUuaW5mbyAnSWdub3JpbmcgZXhjZXB0aW9uOiAnLCBleGNlcHRpb25cclxuICAgIGVsc2VcclxuICAgICAgT0ouY29uc29sZS5lcnJvciBleGNlcHRpb25cclxuICBmaW5hbGx5XHJcblxyXG4gIHJldFxyXG5cclxuXHJcbiBtZXRob2QgPSAodHJ5RnVuYykgLT5cclxuICAndXNlIHN0cmljdCdcclxuICB0aGF0ID0gdGhpc1xyXG4gIC0+XHJcbiAgICBhcmdzID0gQXJyYXk6OnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKVxyXG4gICAgYXJncy51bnNoaWZ0IHRyeUZ1bmNcclxuICAgIE9KLnRyeUV4ZWMuYXBwbHkgdGhhdCwgYXJnc1xyXG5cclxuICBcclxuIFxyXG4gT0oucmVnaXN0ZXIgJ21ldGhvZCcsIG1ldGhvZFxyXG4gT0oucmVnaXN0ZXIgJ3RyeUV4ZWMnLCB0cnlFeGVjXHJcbiBtb2R1bGUuZXhwb3J0cyA9XHJcbiAgbWV0aG9kOiBtZXRob2RcclxuICB0cnlFeGVjOiB0cnlFeGVjXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG5udW1iZXIgPSBPYmplY3QuY3JlYXRlKG51bGwpXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnaXNOYU4nLFxyXG4gIHZhbHVlOiAoaWYgKE51bWJlciBhbmQgTnVtYmVyLmlzTmFOKSB0aGVuIE51bWJlci5pc05hTiBlbHNlIGlzTmFOKVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ2lzRmluaXRlJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5pc0Zpbml0ZSkgdGhlbiBOdW1iZXIuaXNGaW5pdGUgZWxzZSBpc0Zpbml0ZSlcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdNQVhfVkFMVUUnLFxyXG4gIHZhbHVlOiAoaWYgKE51bWJlciBhbmQgTnVtYmVyLk1BWF9WQUxVRSkgdGhlbiBOdW1iZXIuTUFYX1ZBTFVFIGVsc2UgMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDgpXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnTUlOX1ZBTFVFJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5NSU5fVkFMVUUpIHRoZW4gTnVtYmVyLk1JTl9WQUxVRSBlbHNlIDVlLTMyNClcclxuXHJcbk9KLnJlZ2lzdGVyICdudW1iZXInLCBudW1iZXJcclxubW9kdWxlLmV4cG9ydHMgPSBudW1iZXIiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5pc01ldGhvZCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2lzJ1xucHJvcGVydHkgPSByZXF1aXJlICcuL3Byb3BlcnR5J1xuXG5mdW5jID0gcmVxdWlyZSAnLi9mdW5jdGlvbidcblxuIyAjIG9iamVjdFxuXG5yZXRPYmogPSBcblxuICAjICMjIFtPSl0ob2ouaHRtbCkub2JqZWN0XG4gICMgY3JlYXRlIGFuIG9iamVjdCB3aXRoIGhlbHBlciBgYWRkYCBhbmQgYGVhY2hgIG1ldGhvZHMuXG4gIG9iamVjdDogKG9iaiA9IHt9KSAtPlxuICAgIFxuICAgICMjI1xuICAgIEFkZCBhIHByb3BlcnR5IHRvIHRoZSBvYmplY3QgYW5kIHJldHVybiBpdFxuICAgICMjI1xuICAgIG9iai5hZGQgPSAobmFtZSwgdmFsKSAtPlxuICAgICAgcHJvcGVydHkgb2JqLCBuYW1lLCB2YWxcbiAgICAgIG9ialxuXG4gICAgb2JqLmFkZCAnZWFjaCcsIChjYWxsYmFjaykgLT5cclxuICAgICAgZWFjaCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2VhY2gnXG4gICAgICBlYWNoIG9iaiwgKHZhbCwga2V5KSAtPlxuICAgICAgICBpZiBrZXkgaXNudCAnZWFjaCcgYW5kIGtleSBpc250ICdhZGQnXG4gICAgICAgICAgY2FsbGJhY2sgdmFsLCBrZXlcblxuICAgIG9ialxuXG5cbiAgIyAjIyBbT0pdKG9qLmh0bWwpLmlzSW5zdGFuY2VPZlxuICAjIGRldGVybWluZXMgaXMgYSB0aGluZyBpcyBhbiBpbnN0YW5jZSBvZiBhIFRoaW5nLCBhc3N1bWluZyB0aGUgdGhpbmdzIHdlcmUgYWxsIGNyZWF0ZWQgaW4gT0pcbiAgaXNJbnN0YW5jZU9mOiAobmFtZSwgb2JqKSAtPlxuICAgIHRvID0gcmVxdWlyZSAnLi4vdG9vbHMvdG8nXG4gICAgcmV0T2JqLmNvbnRhaW5zKG5hbWUsIG9iaikgYW5kIHRvLmJvb2wob2JqW25hbWVdKVxuXG4gICMgIyMgW09KXShvai5odG1sKS5jb250YWluc1xuICAjIHRydWUgaWYgdGhlIGBvYmplY3RgIGNvbnRhaW5zIHRoZSB2YWx1ZVxuICBjb250YWluczogKG9iamVjdCwgaW5kZXgpIC0+XG4gICAgcmV0ID0gZmFsc2VcbiAgICBpZiBvYmplY3RcbiAgICAgIHJldCA9IF8uY29udGFpbnMgb2JqZWN0LCBpbmRleFxuICAgIHJldFxuXG4gICMgIyMgW09KXShvai5odG1sKS5jb21wYXJlXG4gICMgY29tcGFyZSB0d28gb2JqZWN0cy9hcnJheXMvdmFsdWVzIGZvciBzdHJpY3QgZXF1YWxpdHlcbiAgY29tcGFyZTogKG9iajEsIG9iajIpIC0+XG4gICAgXy5pc0VxdWFsIG9iajEsIG9iajJcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuY2xvbmVcbiAgIyBjb3B5IGFsbCBvZiB0aGUgdmFsdWVzIChyZWN1cnNpdmVseSkgZnJvbSBvbmUgb2JqZWN0IHRvIGFub3RoZXIuXG4gIGNsb25lOiAoZGF0YSkgLT5cbiAgICBfLmNsb25lRGVlcCBkYXRhIHRydWVcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuc2VyaWFsaXplXG4gICMgQ29udmVydCBhbiBvYmplY3QgdG8gYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBvYmplY3RcbiAgc2VyaWFsaXplOiAoZGF0YSkgLT5cbiAgICByZXQgPSAnJ1xuICAgIGZ1bmMudHJ5RXhlYyAtPlxuICAgICAgcmV0ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSlcbiAgICAgIHJldHVyblxuICAgIHJldCBvciAnJ1xuXG4gICMgIyMgW09KXShvai5odG1sKS5kZXNlcmlhbGl6ZVxuICAjIENvbnZlcnQgYSBKU09OIHN0cmluZyB0byBhbiBvYmplY3RcbiAgZGVzZXJpYWxpemU6IChkYXRhKSAtPlxuICAgIHJldCA9IHt9XG4gICAgaWYgZGF0YVxuICAgICAgZnVuYy50cnlFeGVjIC0+XG4gICAgICAgIHJldCA9ICQucGFyc2VKU09OKGRhdGEpXG4gICAgICAgIHJldHVyblxuXG4gICAgICByZXQgPSB7fSAgaWYgaXNNZXRob2QubnVsbE9yRW1wdHkocmV0KVxuICAgIHJldFxuXG4gICMgIyMgW09KXShvai5odG1sKS5wYXJhbXNcbiAgIyBDb252ZXJ0IGFuIG9iamVjdCB0byBhIGRlbGltaXRlZCBsaXN0IG9mIHBhcmFtZXRlcnMgKG5vcm1hbGx5IHF1ZXJ5LXN0cmluZyBwYXJhbWV0ZXJzKVxuICBwYXJhbXM6IChkYXRhLCBkZWxpbWl0ZXIgPSAnJicpIC0+XG4gICAgcmV0ID0gJydcbiAgICBpZiBkZWxpbWl0ZXIgaXMgJyYnXG4gICAgICBmdW5jLnRyeUV4ZWMgLT5cbiAgICAgICAgcmV0ID0gJC5wYXJhbShkYXRhKVxuICAgICAgICByZXR1cm5cblxuICAgIGVsc2VcclxuICAgICAgZWFjaCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2VhY2gnXG4gICAgICBlYWNoIGRhdGEsICh2YWwsIGtleSkgLT5cbiAgICAgICAgcmV0ICs9IGRlbGltaXRlciAgaWYgcmV0Lmxlbmd0aCA+IDBcbiAgICAgICAgcmV0ICs9IGtleSArICc9JyArIHZhbFxuICAgICAgICByZXR1cm5cblxuICAgIHRvLnN0cmluZyByZXRcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuZXh0ZW5kXG4gICMgY29weSB0aGUgcHJvcGVydGllcyBvZiBvbmUgb2JqZWN0IHRvIGFub3RoZXIgb2JqZWN0XG4gIGV4dGVuZDogKGRlc3RPYmosIHNyY09iaiwgZGVlcENvcHkgPSBmYWxzZSkgLT5cbiAgICByZXQgPSBkZXN0T2JqIG9yIHt9XG4gICAgaWYgZGVlcENvcHkgaXMgdHJ1ZVxuICAgICAgcmV0ID0gJC5leHRlbmQoZGVlcENvcHksIHJldCwgc3JjT2JqKVxuICAgIGVsc2VcbiAgICAgIHJldCA9ICQuZXh0ZW5kKHJldCwgc3JjT2JqKVxuICAgIHJldFxuXG5cbk9KLnJlZ2lzdGVyICdvYmplY3QnLCByZXRPYmoub2JqZWN0XG5PSi5yZWdpc3RlciAnaXNJbnN0YW5jZU9mJywgcmV0T2JqLmlzSW5zdGFuY2VPZlxuT0oucmVnaXN0ZXIgJ2NvbnRhaW5zJywgcmV0T2JqLmNvbnRhaW5zXG5PSi5yZWdpc3RlciAnY29tcGFyZScsIHJldE9iai5jb21wYXJlXG5PSi5yZWdpc3RlciAnY2xvbmUnLCByZXRPYmouY2xvbmVcbk9KLnJlZ2lzdGVyICdzZXJpYWxpemUnLCByZXRPYmouc2VyaWFsaXplXG5PSi5yZWdpc3RlciAnZGVzZXJpYWxpemUnLCByZXRPYmouZGVzZXJpYWxpemVcbk9KLnJlZ2lzdGVyICdwYXJhbXMnLCByZXRPYmoucGFyYW1zXG5PSi5yZWdpc3RlciAnZXh0ZW5kJywgcmV0T2JqLmV4dGVuZFxuXG5tb2R1bGUuZXhwb3J0cyA9IHJldE9iaiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbiMjI1xyXG5BZGQgYSBwcm9wZXJ0eSB0byBhbiBvYmplY3RcclxuICBcclxuIyMjXHJcbnByb3BlcnR5ID0gKG9iaiwgbmFtZSwgdmFsdWUsIHdyaXRhYmxlLCBjb25maWd1cmFibGUsIGVudW1lcmFibGUpIC0+XHJcbiAgdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgZGVmaW5lIGEgcHJvcGVydHkgd2l0aG91dCBhbiBPYmplY3QuJyAgdW5sZXNzIG9ialxyXG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhIHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBwcm9wZXJ0eSBuYW1lLicgIHVubGVzcyBuYW1lP1xyXG4gIG9ialtuYW1lXSA9IHZhbHVlXHJcbiAgb2JqXHJcblxyXG5PSi5yZWdpc3RlciAncHJvcGVydHknLCBwcm9wZXJ0eVxyXG5tb2R1bGUuZXhwb3J0cyA9IHByb3BlcnR5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuZGVsaW1pdGVkU3RyaW5nID0gKHN0cmluZywgb3B0cykgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBuZXdMaW5lVG9EZWxpbWl0ZXI6IHRydWVcclxuICAgIHNwYWNlVG9EZWxpbWl0ZXI6IHRydWVcclxuICAgIHJlbW92ZUR1cGxpY2F0ZXM6IHRydWVcclxuICAgIGRlbGltaXRlcjogXCIsXCJcclxuICAgIGluaXRTdHJpbmc6IE9KLnRvLnN0cmluZyBzdHJpbmdcclxuXHJcbiAgcmV0T2JqID1cclxuICAgIGFycmF5OiBbXVxyXG4gICAgZGVsaW1pdGVkOiAtPlxyXG4gICAgICByZXRPYmouYXJyYXkuam9pbiBkZWZhdWx0cy5kZWxpbWl0ZXJcclxuXHJcbiAgICBzdHJpbmc6IChkZWxpbWl0ZXIgPSBkZWZhdWx0cy5kZWxpbWl0ZXIpIC0+XHJcbiAgICAgIHJldCA9ICcnXHJcbiAgICAgIE9KLmVhY2ggcmV0T2JqLmFycmF5LCAodmFsKSAtPlxyXG4gICAgICAgIHJldCArPSBkZWxpbWl0ZXIgIGlmIHJldC5sZW5ndGggPiAwXHJcbiAgICAgICAgcmV0ICs9IHZhbFxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgcmV0XHJcblxyXG4gICAgdG9TdHJpbmc6IC0+XHJcbiAgICAgIHJldE9iai5zdHJpbmcoKVxyXG5cclxuICAgIGFkZDogKHN0cikgLT5cclxuICAgICAgcmV0T2JqLmFycmF5LnB1c2ggZGVmYXVsdHMucGFyc2Uoc3RyKVxyXG4gICAgICBkZWZhdWx0cy5kZWxldGVEdXBsaWNhdGVzKClcclxuICAgICAgcmV0T2JqXHJcblxyXG4gICAgcmVtb3ZlOiAoc3RyKSAtPlxyXG4gICAgICByZW1vdmUgPSAoYXJyYXkpIC0+XHJcbiAgICAgICAgYXJyYXkuZmlsdGVyIChpdGVtKSAtPlxyXG4gICAgICAgICAgdHJ1ZSAgaWYgaXRlbSBpc250IHN0clxyXG5cclxuXHJcbiAgICAgIHJldE9iai5hcnJheSA9IHJlbW92ZShyZXRPYmouYXJyYXkpXHJcbiAgICAgIHJldE9ialxyXG5cclxuICAgIGNvdW50OiAtPlxyXG4gICAgICByZXRPYmouYXJyYXkubGVuZ3RoXHJcblxyXG4gICAgY29udGFpbnM6IChzdHIsIGNhc2VTZW5zaXRpdmUpIC0+XHJcbiAgICAgIGlzQ2FzZVNlbnNpdGl2ZSA9IE9KLnRvLmJvb2woY2FzZVNlbnNpdGl2ZSlcclxuICAgICAgc3RyID0gT0oudG8uc3RyaW5nKHN0cikudHJpbSgpXHJcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpICBpZiBmYWxzZSBpcyBpc0Nhc2VTZW5zaXRpdmVcclxuICAgICAgbWF0Y2ggPSByZXRPYmouYXJyYXkuZmlsdGVyKChtYXRTdHIpIC0+XHJcbiAgICAgICAgKGlzQ2FzZVNlbnNpdGl2ZSBhbmQgT0oudG8uc3RyaW5nKG1hdFN0cikudHJpbSgpIGlzIHN0cikgb3IgT0oudG8uc3RyaW5nKG1hdFN0cikudHJpbSgpLnRvTG93ZXJDYXNlKCkgaXMgc3RyXHJcbiAgICAgIClcclxuICAgICAgbWF0Y2gubGVuZ3RoID4gMFxyXG5cclxuICAgIGVhY2g6IChjYWxsQmFjaykgLT5cclxuICAgICAgcmV0T2JqLmFycmF5LmZvckVhY2ggY2FsbEJhY2tcclxuXHJcbiAgZGVmYXVsdHMucGFyc2UgPSAoc3RyKSAtPlxyXG4gICAgcmV0ID0gT0oudG8uc3RyaW5nKHN0cilcclxuICAgIHJldCA9IHJldC5yZXBsYWNlKC9cXG4vZywgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCJcXG5cIikgaXNudCAtMSAgaWYgZGVmYXVsdHMubmV3TGluZVRvRGVsaW1pdGVyXHJcbiAgICByZXQgPSByZXQucmVwbGFjZShSZWdFeHAoXCIgXCIsIFwiZ1wiKSwgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCIgXCIpIGlzbnQgLTEgIGlmIGRlZmF1bHRzLnNwYWNlVG9EZWxpbWl0ZXJcclxuICAgIHJldCA9IHJldC5yZXBsYWNlKC8sLC9nLCBkZWZhdWx0cy5kZWxpbWl0ZXIpICB3aGlsZSByZXQuaW5kZXhPZihcIiwsXCIpIGlzbnQgLTFcclxuICAgIHJldFxyXG5cclxuICBkZWZhdWx0cy5kZWxldGVEdXBsaWNhdGVzID0gLT5cclxuICAgIGlmIGRlZmF1bHRzLnJlbW92ZUR1cGxpY2F0ZXNcclxuICAgICAgKC0+XHJcbiAgICAgICAgdW5pcXVlID0gKGFycmF5KSAtPlxyXG4gICAgICAgICAgc2VlbiA9IG5ldyBTZXQoKVxyXG4gICAgICAgICAgYXJyYXkuZmlsdGVyIChpdGVtKSAtPlxyXG4gICAgICAgICAgICBpZiBmYWxzZSBpcyBzZWVuLmhhcyhpdGVtKVxyXG4gICAgICAgICAgICAgIHNlZW4uYWRkIGl0ZW1cclxuICAgICAgICAgICAgICB0cnVlXHJcblxyXG5cclxuICAgICAgICByZXRPYmouYXJyYXkgPSB1bmlxdWUocmV0T2JqLmFycmF5KVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICApKClcclxuICAgIHJldHVyblxyXG5cclxuICAoKGEpIC0+XHJcbiAgICBpZiBhLmxlbmd0aCA+IDEgYW5kIGZhbHNlIGlzIE9KLmlzLnBsYWluT2JqZWN0KG9wdHMpXHJcbiAgICAgIE9KLmVhY2ggYSwgKHZhbCkgLT5cclxuICAgICAgICByZXRPYmouYXJyYXkucHVzaCB2YWwgIGlmIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5KHZhbClcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICBlbHNlIGlmIHN0cmluZyBhbmQgc3RyaW5nLmxlbmd0aCA+IDBcclxuICAgICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRzXHJcbiAgICAgIGRlbGltaXRlZFN0cmluZyA9IGRlZmF1bHRzLnBhcnNlKHN0cmluZylcclxuICAgICAgZGVmYXVsdHMuaW5pdFN0cmluZyA9IGRlbGltaXRlZFN0cmluZ1xyXG4gICAgICByZXRPYmouYXJyYXkgPSBkZWxpbWl0ZWRTdHJpbmcuc3BsaXQoZGVmYXVsdHMuZGVsaW1pdGVyKVxyXG4gICAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcygpXHJcbiAgICByZXR1cm5cclxuICApIGFyZ3VtZW50c1xyXG4gIHJldE9ialxyXG5cclxuXHJcbk9KLnJlZ2lzdGVyICdkZWxpbWl0ZWRTdHJpbmcnLCBkZWxpbWl0ZWRTdHJpbmdcclxubW9kdWxlLmV4cG9ydHMgPSBkZWxpbWl0ZWRTdHJpbmciLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG5cclxuIyAjIGRvbVxyXG5cclxuXHJcbiMgRXh0ZW5kIGFuIG9iamVjdCB3aXRoIE9KIERPTSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXHJcblxyXG4jIC0gYEBlbGAgT2JqZWN0IHRvIGV4dGVuZFxyXG4jIC0gYHBhcmVudGAgcGFyZW50IG9iamVjdCB0byB3aGljaCBgQGVsYCB3aWxsIGJlIGFwcGVuZGVkXHJcbmNsYXNzIE5vZGVcclxuICBcclxuICAjcGFyZW50OiByZXF1aXJlKCcuL2JvZHknKVxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yOiAoQGVsLCBAcGFyZW50KSAtPlxyXG4gICAgZW5hYmxlZCA9IHRydWVcclxuICAgIEB0YWdOYW1lID0gQGVsLnRhZ05hbWVcclxuICAgIEBbJyQnXSA9ICQoQGVsLmdldCgpKVxyXG4gICAgQFsnMCddID0gQGVsLmdldCgpXHJcblxyXG4gIGFwcGVuZDogKHBhcmFtcy4uLikgLT5cclxuICAgIEBlbC5hcHBlbmQgcGFyYW1zLi4uXHJcblxyXG4gIHByZXBlbmQ6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAZWwucHJlcGVuZCBwYXJhbXMuLi5cclxuXHJcbiAgcmVtb3ZlOiAocGFyYW1zLi4uKSAtPlxyXG4gICAgQGVsLnJlbW92ZSBwYXJhbXMuLi5cclxuXHJcbiAgY3NzOiAocGFyYW1zLi4uKSAtPlxyXG4gICAgQGVsLmNzcyBwYXJhbXMuLi5cclxuXHJcbiAgaHRtbDogKHBhcmFtcy4uLikgLT5cclxuICAgIEBlbC5odG1sIHBhcmFtcy4uLlxyXG5cclxuICB0ZXh0OiAocGFyYW1zLi4uKSAtPlxyXG4gICAgQGVsLnRleHQgcGFyYW1zLi4uXHJcblxyXG4gIGF0dHI6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAZWwuYXR0ciBwYXJhbXMuLi5cclxuXHJcbiAgZGF0YTogKHBhcmFtcy4uLikgLT5cclxuICAgIEBlbC5kYXRhIHBhcmFtcy4uLlxyXG5cclxuICBnZXQ6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAZWwuZ2V0IHBhcmFtcy4uLlxyXG5cclxuICBhZGQ6IChrZXksIHZhbCkgLT5cclxuICAgIEBba2V5XSA9IHZhbFxyXG5cclxuICBpc0NvbnRyb2xTdGlsbFZhbGlkOiAtPlxyXG4gICAgaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcclxuICAgIHZhbGlkID0gZmFsc2UgaXMgaXNNZXRob2QubnVsbE9yRW1wdHkoQGVsKSBhbmQgQGlzVmFsaWQoKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yICdlbCBpcyBudWxsLiBFdmVudCBiaW5kaW5ncyBtYXkgbm90IGhhdmUgYmVlbiBHQ2QuJyAgaWYgZmFsc2UgaXMgdmFsaWRcclxuICAgIHZhbGlkXHJcblxyXG4gICMgIyMgaXNWYWxpZFxyXG4gIGlzVmFsaWQ6IC0+XHJcbiAgICBAZWwgYW5kIChAZWwuZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCBvciBAZWwuZWwgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KVxyXG5cclxuICAjICMjIGFkZENsYXNzXHJcbiAgIyBBZGQgYSBDU1MgY2xhc3MgdG8gYW4gZWxlbWVudFxyXG5cclxuICAjIC0gYG5hbWVgIHRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0byBhZGRcclxuICBhZGRDbGFzczogKG5hbWUpIC0+XHJcbiAgICBAWyckJ10uYWRkQ2xhc3MgbmFtZSBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgYmluZFxyXG4gICMgQmluZCBhbiBhY3Rpb24gdG8gYSBqUXVlcnkgZWxlbWVudCdzIGV2ZW50LlxyXG4gIGJpbmQ6IChldmVudE5hbWUsIGV2ZW50KSAtPlxyXG4gICAgQG9uIGV2ZW50TmFtZSwgZXZlbnRcclxuXHJcblxyXG4gICMgIyMga2V5Ym9hcmRcclxuICAjIEJpbmQgYW4gZXZlbnQgdG8gYSBrZXksIHdoZW4gcHJlc3NlZCBpbiB0aGlzIGNvbnRyb2wuXHJcbiAgIyBUaGUgT0ogb2JqZWN0IChmb3IgY2hhaW5pbmcpXHJcbiAga2V5Ym9hcmQ6IChrZXlzLCBldmVudCkgLT5cclxuICAgICNNb3VzZXRyYXAuYmluZCBrZXlzLCBAZWxbZXZlbnRdICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgZGlzYWJsZVxyXG4gICMgRGlzYWJsZSB0aGUgZWxlbWVudC5cclxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcclxuICBkaXNhYmxlOiA9PlxyXG4gICAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBlbmFibGVkID0gZmFsc2VcclxuICAgICAgQGF0dHIgJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJ1xyXG4gICAgICBAYWRkQ2xhc3MgJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJ1xyXG4gICAgQFxyXG5cclxuICAjICMjIGVtcHR5XHJcbiAgIyBFbXB0eSB0aGUgZWxlbWVudC5cclxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcclxuICBlbXB0eTogLT5cclxuICAgIEBbJyQnXS5lbXB0eSgpIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyBlbmFibGVcclxuICAjIEVuYWJsZSB0aGUgZWxlbWVudC5cclxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcclxuICBlbmFibGU6IC0+XHJcbiAgICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGVuYWJsZWQgPSB0cnVlXHJcbiAgICAgIEByZW1vdmVBdHRyICdkaXNhYmxlZCdcclxuICAgICAgQHJlbW92ZUNsYXNzICdkaXNhYmxlZCdcclxuICAgIEBcclxuXHJcbiAgIyAjIyBnZXRJZFxyXG4gICMgR2V0IHRoZSBET00gRWxlbWVudCBJRCBvZiB0aGlzIG9iamVjdC5cclxuICBnZXRJZDogLT5cclxuICAgIGlkID0gQFswXS5pZCAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgaWRcclxuXHJcbiAgaGFzQ2xhc3M6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAWyckJ10uaGFzQ2xhc3MgcGFyYW1zLi4uXHJcblxyXG4gICMgIyMgaGlkZVxyXG4gICMgTWFrZSB0aGUgZWxlbWVudCBpbnZpc2libGUuXHJcbiAgaGlkZTogLT5cclxuICAgIEBjc3MgJ2Rpc3BsYXknLCAnbm9uZScgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyBsZW5ndGhcclxuICAjIEdldCB0aGUgbGVuZ3RoIG9mIHRoaXMgZWxlbWVudC5cclxuICBsZW5ndGg6IC0+XHJcbiAgICB0byA9IHJlcXVpcmUgJy4uL3Rvb2xzL3RvJ1xyXG4gICAgbGVuID0gMFxyXG4gICAgbGVuID0gdG8ubnVtYmVyKEBbJyQnXS5sZW5ndGgpICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBsZW5cclxuICBcclxuICAjICMjIG9uXHJcbiAgb246IChldmVudE5hbWUsIGV2ZW50KSAtPlxyXG4gICAgQFsnJCddLm9uIGV2ZW50TmFtZSwgZXZlbnQgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyBvZmZcclxuICBvZmY6IChldmVudE5hbWUsIGV2ZW50KSAtPlxyXG4gICAgQFsnJCddLm9mZiBldmVudE5hbWUsIGV2ZW50ICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAZWxcclxuXHJcbiAgcHJvcDogKHBhcmFtcy4uLikgLT5cclxuICAgIEBbJyQnXS5wcm9wIHBhcmFtcy4uLlxyXG5cclxuICAjICMjIHJlbW92ZVxyXG4gICMgUmVtb3ZlIHRoZSBub2RlIGZyb20gdGhlIERPTVxyXG4gIHJlbW92ZTogLT5cclxuICAgIGlmIEBlbCBhbmQgQFsnJCddXHJcbiAgICAgIEBbJyQnXS5yZW1vdmUoKVxyXG5cclxuICAgICAgIyBTZXQgdGhlIHZhbHVlIG9mIEBlbCB0byBudWxsIHRvIGd1YXJhbnRlZSB0aGF0IGlzQ29udHJvbFN0aWxsVmFsaWQgd2lsbCBiZSBjb3JyZWN0XHJcbiAgICAgIEBlbCA9IG51bGxcclxuICAgICAgQFsnJCddID0gbnVsbFxyXG4gICAgICBAWzBdID0gbnVsbFxyXG4gICAgbnVsbFxyXG5cclxuICAjICMjIHJlbW92ZUNsYXNzXHJcbiAgIyBSZW1vdmUgYSBDU1MgY2xhc3MgZnJvbSBhbiBlbGVtZW50LlxyXG4gIHJlbW92ZUNsYXNzOiAobmFtZSkgLT5cclxuICAgIEBbJyQnXS5yZW1vdmVDbGFzcyBuYW1lICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgcmVtb3ZlUHJvcFxyXG4gICMgUmVtb3ZlIGEgcHJvcGVydHkgZnJvbSBhbiBlbGVtZW50LiBqUXVlcnkgZGlzdGluZ3Vpc2hlcyBiZXR3ZWVuICdwcm9wcycgYW5kICdhdHRyJzsgaGVuY2UgMiBtZXRob2RzLlxyXG4gIHJlbW92ZVByb3A6IChuYW1lKSAtPlxyXG4gICAgQFsnJCddLnJlbW92ZVByb3AgbmFtZSAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgQFxyXG5cclxuICAjICMjIHJlbW92ZUF0dHJcclxuICAjIFJlbW92ZSBhIHByb3BlcnR5IGZyb20gYW4gZWxlbWVudC4galF1ZXJ5IGRpc3Rpbmd1aXNoZXMgYmV0d2VlbiAncHJvcHMnIGFuZCAnYXR0cic7IGhlbmNlIDIgbWV0aG9kcy5cclxuICByZW1vdmVBdHRyOiAobmFtZSkgLT5cclxuICAgIEBbJyQnXS5yZW1vdmVBdHRyIG5hbWUgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyByZXF1aXJlZFxyXG4gICMgTWFyayB0aGUgcmVxdWlyZWQgc3RhdHVzIG9mIHRoZSBlbGVtZW50LlxyXG4gIHJlcXVpcmVkOiAodHJ1dGh5LCBhZGRMYWJlbCkgLT5cclxuICAgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgdG8gPSByZXF1aXJlICcuLi90b29scy90bydcclxuICAgICAgc3dpdGNoIHRvLmJvb2wodHJ1dGh5KVxyXG4gICAgICAgIHdoZW4gdHJ1ZVxyXG4gICAgICAgICAgQGF0dHIgJ3JlcXVpcmVkJywgdHJ1ZVxyXG4gICAgICAgICAgQGFkZENsYXNzICdyZXF1aXJlZCdcclxuICAgICAgICB3aGVuIGZhbHNlXHJcbiAgICAgICAgICBAcmVtb3ZlUHJvcCAncmVxdWlyZWQnXHJcbiAgICAgICAgICBAcmVtb3ZlQ2xhc3MgJ3JlcXVpcmVkJ1xyXG4gICAgQFsnJCddXHJcbiAgXHJcbiAgIyAjIyBzaG93XHJcbiAgIyBNYWtlIHRoZSBlbGVtZW50IHZpc2libGUuXHJcbiAgc2hvdzogLT5cclxuICAgIEBbJyQnXS5zaG93KCkgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyB0b2dnbGVcclxuICAjIFRvZ2dsZSB2aXNpYmlsaXR5XHJcbiAgdG9nZ2xlOiAtPlxyXG4gICAgQFsnJCddLnRvZ2dsZSgpICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBcclxuICBAdG9nZ2xlQ2xhc3M6IChwYXJhbXMuLi4pLT5cclxuICAgIEBbJyQnXS50b2dnbGVDbGFzcyBwYXJhbXMuLi4gIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyB0b2dnbGVFbmFibGVcclxuICAjIFRvZ2dsZSB0aGUgZWxlbWVudCdzIGVuYWJsZWQgc3RhdGUuXHJcbiAgdG9nZ2xlRW5hYmxlOiAtPlxyXG4gICAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBpZiBlbmFibGVkXHJcbiAgICAgICAgQGRpc2FibGUoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgQGVuYWJsZSgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgdHJpZ2dlclxyXG4gICMgVHJpZ2dlciBhbiBldmVudCBib3VuZCB0byBhIGpRdWVyeSBlbGVtZW50LlxyXG4gIHRyaWdnZXI6IChldmVudE5hbWUsIGV2ZW50T3B0cykgLT5cclxuICAgIEBbJyQnXS50cmlnZ2VyIGV2ZW50TmFtZSwgZXZlbnRPcHRzICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAZWxcclxuXHJcbiAgIyAjIyB1bmJpbmRcclxuICAjIFdyYXBwZXIgYXJvdW5kIGBvZmZgXHJcbiAgdW5iaW5kOiAoZXZlbnROYW1lLCBldmVudCkgLT5cclxuICAgIEBvZmYgZXZlbnROYW1lLCBldmVudFxyXG5cclxuICAjICMjIHZhbFxyXG4gICMgR2V0IG9yIHNldCB0aGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQuXHJcbiAgdmFsOiAodmFsdWUpIC0+XHJcbiAgICByZXQgPSBAXHJcbiAgICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXHJcbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMSBhbmQgZmFsc2UgaXMgaXNNZXRob2QubnVsbE9yVW5kZWZpbmVkKHZhbHVlKVxyXG4gICAgICAgIEBbJyQnXS52YWwgdmFsdWVcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldCA9IEBbJyQnXS52YWwoKVxyXG4gICAgcmV0XHJcbiAgICBcclxuICAjICMjIHZhbHVlT2ZcclxuICAjIHdyYXBwZXIgYXJvdW5kIGB2YWxgXHJcbiAgdmFsdWVPZjogLT5cclxuICAgIEB2YWwoKVxyXG5cclxuICAjICMjIHRvU3RyaW5nXHJcbiAgIyB3cmFwcGVyIGFyb3VuZCBgdmFsYFxyXG4gIHRvU3RyaW5nOiAtPlxyXG4gICAgQHZhbCgpXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOb2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuVGhpbkRPTSA9IHJlcXVpcmUgJ3RoaW5kb20nXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxuXHJcblxyXG4jIyNcclxuUGVyc2lzdCBhIGhhbmRsZSBvbiB0aGUgYm9keSBub2RlXHJcbiMjI1xyXG5pZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJyB0aGVuIGJvZHkgPSBkb2N1bWVudC5ib2R5IGVsc2UgYm9keSA9IG51bGxcclxuYm9keSA9IG5ldyBUaGluRE9NIG51bGwsIGlkOiAnYm9keScsIGJvZHlcclxuYm9keS50YWdOYW1lID0gJ2JvZHknXHJcbnRoaW5Cb2R5ID0gbm9kZUZhY3RvcnkgYm9keSwge31cclxuICBcclxuT0oucmVnaXN0ZXIgJ2JvZHknLCB0aGluQm9keVxyXG5tb2R1bGUuZXhwb3J0cyA9IHRoaW5Cb2R5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuXHJcbiMgIyBjb21wb25lbnRcclxuXHJcblxyXG4jIENyZWF0ZSBhbiBIVE1MIFdlYiBDb21wb25lbnQgdGhyb3VnaCBUaGluRG9tXHJcblxyXG4jIC0gYG9wdGlvbnNgIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHN0YW5kYXJkIG9wdGlvbnMgdG8gYmUgcGFzc2VkIGludG8gdGhlIGNvbXBvbmVudFxyXG4jIC0tIGByb290Tm9kZVR5cGVgOiB0aGUgdGFnIG5hbWUgb2YgdGhlIHJvb3Qgbm9kZSB0byBjcmVhdGUsIGRlZmF1bHQgPSAnZGl2J1xyXG4jIC0tIGBwcm9wc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIERPTSBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXHJcbiMgLS0gYHN0eWxlc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIENTUyBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXHJcbiMgLS0gYGV2ZW50c2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5hbWVkIERPTSBldmVudHMgKGFuZCBjb3JyZXNwb25kaW5nIGNhbGxiYWNrIG1ldGhvZHMpIHRvIGJpbmQgdG8gdGhlIHJvb3Qgbm9kZVxyXG4jIC0gYG93bmVyYCB0aGUgcGFyZW50IHRvIHdoaWNoIHRoZSBjb21wb25lbnQgbm9kZSB3aWxsIGJlIGFwcGVuZGVkXHJcbiMgLSBgdGFnTmFtZWAgdGhlIG5hbWUgb2Ygb2YgdGhlIGNvbXBvbmVudCwgd2hpY2ggd2lsbCBhbHdheXMgYmUgcHJlZml4ZWQgd2l0aCAneC0nXHJcbmNvbXBvbmVudCA9IChvcHRpb25zID0gb2JqLm9iamVjdCgpLCBvd25lciwgdGFnTmFtZSkgLT5cclxuXHJcbiAgaWYgbm90IHRhZ05hbWUuc3RhcnRzV2l0aCAneC0nIHRoZW4gdGFnTmFtZSA9ICd4LScgKyB0YWdOYW1lXHJcbiAgIyB3ZWIgY29tcG9uZW50cyBhcmUgcmVhbGx5IGp1c3Qgb3JkaW5hcnkgT0ogW2VsZW1lbnRdKGVsZW1lbnQuaHRtbCkncyB3aXRoIGEgc3BlY2lhbCBuYW1lLlxyXG4gICMgVW50aWwgSFRNTCBXZWIgQ29tcG9uZW50cyBhcmUgZnVsbHkgc3VwcG9ydGVkIChhbmQgT0ogaXMgcmVmYWN0b3JlZCBhY2NvcmRpbmdseSksIHRoZSBlbGVtZW50IHdpbGwgYmUgdHJlYXRlZCBhcyBhbiB1bmtub3duIGVsZW1lbnQuXHJcbiAgIyBJbiBtb3N0IGNhc2VzLCB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiB0aGUgYnJvd3NlciBpcyBhY2NlcHRhYmxlIChzZWUgYWxzbyBbSFRNTCBTZW1hbnRpY3NdKGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vc2VtYW50aWNzLmh0bWwpKSwgYnV0XHJcbiAgIyBpbiBzb21lIGNhc2VzIHRoaXMgaXMgcHJvYmxlbWF0aWMgKGZpcnN0bHksIGJlY2F1c2UgdGhlc2UgZWxlbWVudHMgYXJlIGFsd2F5cyByZW5kZXJlZCBpbmxpbmUpLlxyXG4gICMgSW4gc3VjaCBjb25kaXRpb25zLCB0aGUgW2NvbnRyb2xzXShjb250cm9scy5odG1sKSBjbGFzcyBhbmQgbmFtZSBzcGFjZSBpcyBiZXR0ZXIgc3VpdGVkIHRvIGNsYXNzZXMgd2hpY2ggcmVxdWlyZSBjb21wbGV0ZSBjb250cm9sIChlLmcuIFtpY29uXShpY29uLmh0bWwpKS5cclxuICB3aWRnZXQgPSBub2RlRmFjdG9yeSB0YWdOYW1lLCBvYmoub2JqZWN0KCksIG93bmVyLCBmYWxzZSAjLCBvcHRpb25zLnByb3BzLCBvcHRpb25zLnN0eWxlcywgb3B0aW9ucy5ldmVudHMsIG9wdGlvbnMudGV4dFxyXG4gIFxyXG4gICMgU2luY2UgdGhlIGJlaGF2aW9yIG9mIHN0eWxpbmcgaXMgbm90IHdlbGwgY29udHJvbGxlZC9jb250cm9sbGFibGUgb24gdW5rbm93biBlbGVtZW50cywgaXQgaXMgbmVjZXNzYXJ5IHRvIGNyZWF0ZSBhIHJvb3Qgbm9kZSBmb3IgdGhlIGNvbXBvbmVudC5cclxuICAjIEluIG1vc3QgY2FzZXMsIFtkaXZdKGRpdi5odG1sKSBpcyBwZXJmZWN0bHkgYWNjZXB0YWJsZSwgYnV0IHRoaXMgaXMgY29uZmlndXJhYmxlIGF0IHRoZSBuYW1lIHNwYWNlIGxldmVsIG9yIGF0IHJ1bnRpbWUuXHJcbiAgcm9vdE5vZGVUeXBlID0gb3B0aW9ucy5yb290Tm9kZVR5cGUgb3IgT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSBvciAnZGl2J1xyXG5cclxuICAjIGByZXRgIGlzIHRoZSB0aGUgaW5zdGFuY2Ugb2YgdGhlIHJvb3ROb2RlVHlwZSwgbm90IHRoZSBgd2lkZ2V0YCB3cmFwcGVkIGluIHRoaXMgY2xvc3VyZVxyXG4gIHJldCA9IHdpZGdldC5tYWtlIHJvb3ROb2RlVHlwZSwgb3B0aW9uc1xyXG5cclxuICAjIGZvciBjb252ZW5pZW5jZSBhbmQgZGVidWdnaW5nLCBwZXJzaXN0IHRoZSB0YWdOYW1lXHJcbiAgcmV0LmNvbXBvbmVudE5hbWUgPSB0YWdOYW1lXHJcblxyXG4gICMgYHJlbW92ZWAgZG9lcywgaG93ZXZlciwgYmVoYXZlIGFzIGV4cGVjdGVkIGJ5IHJlbW92aW5nIGB3aWRnZXRgXHJcbiAgcmV0LnJlbW92ZSA9IHdpZGdldC5yZW1vdmVcclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdjb21wb25lbnQnLCBjb21wb25lbnRcclxubW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5cclxuIyMjXHJcbkNyZWF0ZSBhIHNldCBvZiBIVE1MIEVsZW1lbnRzIHRocm91Z2ggVGhpbkRvbVxyXG4jIyNcclxuY29udHJvbCA9IChvcHRpb25zID0gb2JqLm9iamVjdCgpLCBvd25lciwgdGFnTmFtZSkgLT5cclxuICBpZiBub3QgdGFnTmFtZS5zdGFydHNXaXRoICd5LScgdGhlbiB0YWdOYW1lID0gJ3ktJyArIHRhZ05hbWVcclxuXHJcbiAgcm9vdE5vZGVUeXBlID0gb3B0aW9ucy5yb290Tm9kZVR5cGUgb3IgT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSBvciAnZGl2J1xyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSByb290Tm9kZVR5cGUsIG9wdGlvbnMsIG93bmVyLCBmYWxzZVxyXG5cclxuICByZXQuYWRkICdjb250cm9sTmFtZScsIHRhZ05hbWVcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAnY29udHJvbCcsIGNvbnRyb2xcclxubW9kdWxlLmV4cG9ydHMgPSBjb250cm9sIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuXHJcblRoaW5ET00gPSByZXF1aXJlICd0aGluZG9tJ1xyXG5cclxuIyAjIGVsZW1lbnRcclxuXHJcbmVsZW1lbnQgPSBcclxuICAjICMjIHJlc3RvcmVFbGVtZW50XHJcbiAgIyMjXHJcbiAgUmVzdG9yZSBhbiBIVE1MIEVsZW1lbnQgdGhyb3VnaCBUaGluRG9tXHJcbiAgIyMjXHJcbiAgcmVzdG9yZUVsZW1lbnQ6IChlbCwgdGFnID0gZWwubm9kZU5hbWUpIC0+XHJcbiAgICBub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcbiAgICB0RCA9IG5ldyBUaGluRE9NIG51bGwsIG51bGwsIGVsXHJcbiAgICB0RC5pc0luRE9NID0gdHJ1ZVxyXG4gICAgcmV0ID0gbm9kZUZhY3RvcnkgdERcclxuICAgIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ3Jlc3RvcmVFbGVtZW50JywgZWxlbWVudC5yZXN0b3JlRWxlbWVudFxyXG5cclxuT0oucmVnaXN0ZXIgJ2lzRWxlbWVudEluRG9tJywgKGVsZW1lbnRJZCkgLT5cclxuICBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSBPSi5nZXRFbGVtZW50IGVsZW1lbnRJZFxyXG5cclxuT0oucmVnaXN0ZXIgJ2dldEVsZW1lbnQnLCAoaWQpIC0+XHJcbiAgaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCdcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWxlbWVudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBmcmFnbWVudFxyXG5cclxuIyBDcmVhdGUgYSBkb2N1bWVudCBmcmFnbWVudCBhbmQgcmV0dXJuIGl0IGFzIGFuIE9KIG5vZGVcclxuZnJhZ21lbnQgPSAtPlxyXG4gIHJldCA9IG51bGxcclxuICBpZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xyXG4gICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcclxuICAgIFxyXG4gICAgZnJhZyA9IG5ldyBUaGluRE9NIG51bGwsIG51bGwsIGZyYWdtZW50XHJcbiAgICBmcmFnLmlzSW5ET00gPSB0cnVlXHJcbiAgICByZXQgPSBub2RlRmFjdG9yeSBmcmFnXHJcbiAgICBcclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdmcmFnbWVudCcsIGZyYWdtZW50XHJcbm1vZHVsZS5leHBvcnRzID0gZnJhZ21lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9vakluaXQnXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgZ2VuZXJpYyBub2Rlc1xyXG5cclxuY2xvc2VkID0gW1xyXG4gICdhYmJyJ1xyXG4gICdhY3JvbnltJ1xyXG4gICdhcHBsZXQnXHJcbiAgJ2FydGljbGUnXHJcbiAgJ2FzaWRlJ1xyXG4gICdhdWRpbydcclxuICAnYidcclxuICAnYmRvJ1xyXG4gICdiaWcnXHJcbiAgJ2Jsb2NrcXVvdGUnXHJcbiAgJ2J1dHRvbidcclxuICAnY2FudmFzJ1xyXG4gICdjYXB0aW9uJ1xyXG4gICdjZW50ZXInXHJcbiAgJ2NpdGUnXHJcbiAgJ2NvZGUnXHJcbiAgJ2NvbGdyb3VwJ1xyXG4gICdkYXRhbGlzdCdcclxuICAnZGQnXHJcbiAgJ2RlbCdcclxuICAnZGV0YWlscydcclxuICAnZGZuJ1xyXG4gICdkaXInXHJcbiAgJ2RpdidcclxuICAnZGwnXHJcbiAgJ2R0J1xyXG4gICdlbSdcclxuICAnZmllbGRzZXQnXHJcbiAgJ2ZpZ2NhcHRpb24nXHJcbiAgJ2ZpZ3VyZSdcclxuICAnZm9udCdcclxuICAnZm9vdGVyJ1xyXG4gICdoMSdcclxuICAnaDInXHJcbiAgJ2gzJ1xyXG4gICdoNCdcclxuICAnaDUnXHJcbiAgJ2g2J1xyXG4gICdoZWFkJ1xyXG4gICdoZWFkZXInXHJcbiAgJ2hncm91cCdcclxuICAnaHRtbCdcclxuICAnaSdcclxuICAnaWZyYW1lJ1xyXG4gICdpbnMnXHJcbiAgJ2tiZCdcclxuICAnbGFiZWwnXHJcbiAgJ2xlZ2VuZCdcclxuICAnbGknXHJcbiAgJ21hcCdcclxuICAnbWFyaydcclxuICAnbWVudSdcclxuICAnbWV0ZXInXHJcbiAgJ25hdidcclxuICAnbm9mcmFtZXMnXHJcbiAgJ25vc2NyaXB0J1xyXG4gICdvYmplY3QnXHJcbiAgJ29wdGdyb3VwJ1xyXG4gICdvcHRpb24nXHJcbiAgJ291dHB1dCdcclxuICAncCdcclxuICAncHJlJ1xyXG4gICdwcm9ncmVzcydcclxuICAncSdcclxuICAncnAnXHJcbiAgJ3J0J1xyXG4gICdydWJ5J1xyXG4gICdzJ1xyXG4gICdzYW1wJ1xyXG4gICdzZWN0aW9uJ1xyXG4gICdzbWFsbCdcclxuICAnc3BhbidcclxuICAnc3RyaWtlJ1xyXG4gICdzdHJvbmcnXHJcbiAgJ3N0eWxlJ1xyXG4gICdzdWInXHJcbiAgJ3N1bW1hcnknXHJcbiAgJ3N1cCdcclxuICAndGJvZHknXHJcbiAgJ3RkJ1xyXG4gICd0Zm9vdCdcclxuICAndGgnXHJcbiAgJ3RpbWUnXHJcbiAgJ3RpdGxlJ1xyXG4gICd0cidcclxuICAndHQnXHJcbiAgJ3UnXHJcbiAgJ3ZhcidcclxuICAndmlkZW8nXHJcbiAgJ3htcCdcclxuXVxyXG5vcGVuID0gJ2FyZWEgYmFzZSBjb2wgY29tbWFuZCBjc3MgZW1iZWQgaHIgaW1nIGtleWdlbiBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnInLnNwbGl0ICcgJ1xyXG5hbGwgPSBjbG9zZWQuY29uY2F0IG9wZW5cclxuXHJcbmV4cG9ydHMgPSB7fVxyXG4jIHJlZ2lzdGVyIHNlbWFudGljL3N0cnVjdHVyYWwgYWxpYXNlc1xyXG5mb3IgbG9vcE5hbWUgaW4gYWxsXHJcbiAgZG8gKHRhZyA9IGxvb3BOYW1lKSAtPlxyXG4gICAgbWV0aG9kID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgICAgIGRlZmF1bHRzID1cclxuICAgICAgICBwcm9wczoge31cclxuICAgICAgICBzdHlsZXM6IHt9XHJcbiAgICAgICAgZXZlbnRzOiB7fVxyXG5cclxuICAgICAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9uc1xyXG4gICAgICByZXQgPSBub2RlRmFjdG9yeSB0YWcsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgICAgIHJldFxyXG4gICAgT0oubm9kZXMucmVnaXN0ZXIgdGFnLCBtZXRob2RcclxuICAgIGV4cG9ydHNbdGFnXSA9IG1ldGhvZFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMjI1xyXG5DcmVhdGUgYW4gT0ogSW5wdXQgT2JqZWN0IHRocm91Z2ggT0oubm9kZXMuaW5wdXRcclxuIyMjXHJcbmlucHV0ID0gKG9wdGlvbnMgPSBPSi5vYmplY3QoKSwgb3duZXIpIC0+XHJcbiAgaWYgbm90IG93bmVyIHRoZW4gdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIGFuIGlucHV0IHdpdGhvdXQgYSBwYXJlbnQnXHJcbiAgaWYgbm90IG9wdGlvbnMucHJvcHMgb3Igbm90IG9wdGlvbnMucHJvcHMudHlwZSB0aGVuIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhbiBpbnB1dCB3aXRob3V0IGFuIGlucHV0IHR5cGUnXHJcbiAgcmV0ID0gb3duZXIubWFrZSAnaW5wdXQnLCBvcHRpb25zXHJcbiAgcmV0LmFkZCAnaW5wdXROYW1lJywgb3B0aW9ucy5wcm9wcy50eXBlXHJcbiAgcmV0XHJcbiAgICBcclxuT0oucmVnaXN0ZXIgJ2lucHV0JywgaW5wdXRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbl8gPSByZXF1aXJlICdsb2Rhc2gnXHJcblRoaW5ET00gPSByZXF1aXJlICd0aGluZG9tJ1xyXG5Ob2RlID0gcmVxdWlyZSAnLi9Ob2RlJ1xyXG5cclxuI2Nsb3NlZCA9ICdhIGFiYnIgYWNyb255bSBhZGRyZXNzIGFwcGxldCBhcnRpY2xlIGFzaWRlIGF1ZGlvIGIgYmRvIGJpZyBibG9ja3F1b3RlIGJvZHkgYnV0dG9uIGNhbnZhcyBjYXB0aW9uIGNlbnRlciBjaXRlIGNvZGUgY29sZ3JvdXAgY29tbWFuZCBkYXRhbGlzdCBkZCBkZWwgZGV0YWlscyBkZm4gZGlyIGRpdiBkbCBkdCBlbSBlbWJlZCBmaWVsZHNldCBmaWdjYXB0aW9uIGZpZ3VyZSBmb250IGZvb3RlciBmb3JtIGZyYW1lc2V0IGgxIGgyIGgzIGg0IGg1IGg2IGhlYWQgaGVhZGVyIGhncm91cCBodG1sIGkgaWZyYW1lIGlucyBrZXlnZW4ga2JkIGxhYmVsIGxlZ2VuZCBsaSBtYXAgbWFyayBtZW51IG1ldGVyIG5hdiBub2ZyYW1lcyBub3NjcmlwdCBvYmplY3Qgb2wgb3B0Z3JvdXAgb3B0aW9uIG91dHB1dCBwIHByZSBwcm9ncmVzcyBxIHJwIHJ0IHJ1YnkgcyBzYW1wIHNjcmlwdCBzZWN0aW9uIHNlbGVjdCBzbWFsbCBzb3VyY2Ugc3BhbiBzdHJpa2Ugc3Ryb25nIHN0eWxlIHN1YiBzdW1tYXJ5IHN1cCB0YWJsZSB0Ym9keSB0ZCB0ZXh0YXJlYSB0Zm9vdCB0aCB0aGVhZCB0aW1lIHRpdGxlIHRyIHR0IHUgdWwgdmFyIHZpZGVvIHdiciB4bXAnLnNwbGl0ICcgJ1xyXG4jb3BlbiA9ICdhcmVhIGJhc2UgYnIgY29sIGNvbW1hbmQgY3NzICFET0NUWVBFIGVtYmVkIGhyIGltZyBpbnB1dCBrZXlnZW4gbGluayBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnInLnNwbGl0ICcgJ1xyXG4jXHJcbiNuZXN0YWJsZU5vZGVOYW1lcyA9IFtcclxuIyAgJ2RpdidcclxuIyAgJ3NwYW4nXHJcbiMgICdoMSdcclxuIyAgJ2gyJ1xyXG4jICAnaDMnXHJcbiMgICdoNCdcclxuIyAgJ2g1J1xyXG4jICAnaDYnXHJcbiMgICdwJ1xyXG4jICAnZmllbGRzZXQnXHJcbiMgICdzZWxlY3QnXHJcbiMgICdvbCdcclxuIyAgJ3VsJ1xyXG4jICAndGFibGUnXHJcbiNdXHJcbiNcclxuIyNUaGlzIGxpc3QgaXMgbm90IHlldCBleGhhdXN0aXZlLCBqdXN0IGV4Y2x1ZGUgdGhlIG9idmlvdXNcclxuI25vbk5lc3RhYmxlTm9kZXMgPSBbXHJcbiMgICdsaSdcclxuIyAgJ2xlZ2VuZCdcclxuIyAgJ3RyJ1xyXG4jICAndGQnXHJcbiMgICdvcHRpb24nXHJcbiMgICdib2R5J1xyXG4jICAnaGVhZCdcclxuIyAgJ3NvdXJjZSdcclxuIyAgJ3Rib2R5J1xyXG4jICAndGZvb3QnXHJcbiMgICd0aGVhZCdcclxuIyAgJ2xpbmsnXHJcbiMgICdzY3JpcHQnXHJcbiNdXHJcbiNcclxuI25vZGVOYW1lcyA9IFtcclxuIyAgJ2EnXHJcbiMgICdiJ1xyXG4jICAnYnInXHJcbiMgICdidXR0b24nXHJcbiMgICdkaXYnXHJcbiMgICdlbSdcclxuIyAgJ2ZpZWxkc2V0J1xyXG4jICAnZm9ybSdcclxuIyAgJ2gxJ1xyXG4jICAnaDInXHJcbiMgICdoMydcclxuIyAgJ2g0J1xyXG4jICAnaDUnXHJcbiMgICdoNidcclxuIyAgJ2knXHJcbiMgICdpbWcnXHJcbiMgICdpbnB1dCdcclxuIyAgJ2xhYmVsJ1xyXG4jICAnbGVnZW5kJ1xyXG4jICAnbGknXHJcbiMgICduYXYnXHJcbiMgICdvbCdcclxuIyAgJ29wdGlvbidcclxuIyAgJ3AnXHJcbiMgICdzZWxlY3QnXHJcbiMgICdzcGFuJ1xyXG4jICAnc3Ryb25nJ1xyXG4jICAnc3VwJ1xyXG4jICAnc3ZnJ1xyXG4jICAndGFibGUnXHJcbiMgICd0Ym9keSdcclxuIyAgJ3RkJ1xyXG4jICAndGV4dGFyZWEnXHJcbiMgICd0aCdcclxuIyAgJ3RoZWFkJ1xyXG4jICAndHInXHJcbiMgICd1bCdcclxuI11cclxuXHJcbmNsYXNzIE5vZGVGYWN0b3J5XHJcbiAgXHJcbiAgb2pOb2RlOiBudWxsXHJcbiAgXHJcbiAgQGdldDogKGlkLCB0YWdOYW1lID0gJ2RpdicpIC0+XHJcbiAgICByZXQgPSBudWxsXHJcbiAgICBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkIGlkXHJcbiAgICBpZiBlbFxyXG4gICAgICB0aGluRWwgPSBPSi5yZXN0b3JlRWxlbWVudCBlbCwgdGFnTmFtZVxyXG4gICAgaWYgdGhpbkVsXHJcbiAgICAgIHJldCA9IG5ldyBOb2RlRmFjdG9yeSBudWxsLCBudWxsLCBudWxsLCBmYWxzZSwgdGhpbkVsXHJcblxyXG4gICAgcmV0XHJcbiAgXHJcbiAgX21ha2VBZGQ6ICh0YWdOYW1lLCBjb3VudCkgLT5cclxuICAgIChvcHRzKSA9PlxyXG4gICAgICBtZXRob2QgPSBPSi5ub2Rlc1t0YWdOYW1lXSBvciBPSi5jb21wb25lbnRzW3RhZ05hbWVdIG9yIE9KLmNvbnRyb2xzW3RhZ05hbWVdIG9yIE9KLmlucHV0c1t0YWdOYW1lXVxyXG4gICAgICBpZiBtZXRob2RcclxuICAgICAgICBudSA9IG1ldGhvZCBvcHRzLCBAb2pOb2RlXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBudSA9IE9KLmNvbXBvbmVudCBudWxsLCBAb2pOb2RlLCB0YWdOYW1lXHJcbiAgICAgICNyZXQgPSBuZXcgTm9kZUZhY3RvcnkgbnUsIEB0aGluTm9kZSwgY291bnRcclxuICAgICAgbnVcclxuICBcclxuICBfbWFrZVVuaXF1ZUlkOiAoY291bnQpIC0+XHJcbiAgICBpZiBPSi5HRU5FUkFURV9VTklRVUVfSURTXHJcbiAgICAgIGNvdW50ICs9IDFcclxuICAgICAgaWYgY291bnQgPD0gQG93bmVyLmNvdW50IHRoZW4gY291bnQgPSBAb3duZXIuY291bnQgKyAxXHJcbiAgICAgIEBvd25lci5jb3VudCA9IGNvdW50XHJcblxyXG4gICAgICBpZiBub3QgQG9qTm9kZS5nZXRJZCgpXHJcbiAgICAgICAgaWQgPSBAb3duZXIuZ2V0SWQoKSBvciAnJ1xyXG4gICAgICAgIGlkICs9IEBvak5vZGUudGFnTmFtZSArIGNvdW50XHJcbiAgICAgICAgQG9qTm9kZS5hdHRyICdpZCcsIGlkXHJcbiAgICByZXR1cm5cclxuICBcclxuICBfYmluZEV2ZW50czogLT5cclxuICAgIGlmIEBvak5vZGUgdGhlbiBfLmZvck93biBAb3B0aW9ucy5ldmVudHMsICh2YWwsIGtleSkgPT5cclxuICAgICAgaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcclxuICAgICAgaWYgaXNNZXRob2QubWV0aG9kIHZhbFxyXG4gICAgICAgIGNhbGxiYWNrID0gKGV2ZW50Li4uKSAtPiB2YWwgZXZlbnQuLi5cclxuICAgICAgICBAb2pOb2RlLiQub24ga2V5LCBjYWxsYmFja1xyXG4gICAgICAgIEBvak5vZGUuYWRkIGtleSwgY2FsbGJhY2tcclxuICAgICAgICBudWxsXHJcbiAgXHJcbiAgY29uc3RydWN0b3I6IChAdGFnLCBAb3B0aW9ucywgQG93bmVyLCBAdGhpbk5vZGUgPSBudWxsKSAtPlxyXG4gICAgaWYgQHRhZyBhbmQgbm90IEB0aGluTm9kZVxyXG4gICAgICBAdGhpbk5vZGUgPSBuZXcgVGhpbkRPTSBAdGFnLCBAb3B0aW9ucy5wcm9wc1xyXG4gICAgICBAdGhpbk5vZGUuYWRkICd0YWdOYW1lJywgQHRhZ1xyXG4gICAgICBAdGhpbk5vZGUuY3NzIEBvcHRpb25zLnN0eWxlc1xyXG4gICAgICBpZiBAb3B0aW9ucy50ZXh0IHRoZW4gQHRoaW5Ob2RlLnRleHQgQG9wdGlvbnMudGV4dFxyXG4gICAgXHJcbiAgICBpZiBAb3duZXJcclxuICAgICAgQG1ha2UoKVxyXG4gIFxyXG4gIGFkZE1ha2VNZXRob2Q6IChjb3VudCkgLT5cclxuICAgIG1ldGhvZHMgPSBPSi5vYmplY3QoKVxyXG4gICAgQG9qTm9kZS5tYWtlID0gKHRhZ05hbWUsIG9wdHMpID0+XHJcbiAgICAgIG1ldGhvZCA9IG1ldGhvZHNbdGFnTmFtZV1cclxuICAgICAgaWYgbm90IG1ldGhvZFxyXG4gICAgICAgIG1ldGhvZCA9IEBfbWFrZUFkZCB0YWdOYW1lLCBAb2pOb2RlLCBjb3VudFxyXG4gICAgICAgIG1ldGhvZHNbdGFnTmFtZV0gPSBtZXRob2RcclxuICAgICAgbWV0aG9kIG9wdHNcclxuICAgIEBvak5vZGVcclxuXHJcbiAgbWFrZTogLT5cclxuXHJcbiAgICBAb2pOb2RlID0gbnVsbFxyXG5cclxuICAgIGlmIEB0aGluTm9kZT8uaXNGdWxseUluaXQgdGhlbiBAb2pOb2RlID0gQHRoaW5Ob2RlXHJcbiAgXHJcbiAgICAjIDI6IElmIHRoZSBlbGVtZW50IGhhcyBuZXZlciBiZWVuIGluaXRpYWxpemVkLCBjb250aW51ZVxyXG4gICAgZWxzZVxyXG4gICAgICAjIDM6IEFzIGxvbmcgYXMgdGhlIGVsZW1lbnQgaXNuJ3QgdGhlIGJvZHkgbm9kZSwgY29udGludWVcclxuICAgICAgIyBpZiBlbC50YWdOYW1lIGlzbnQgJ2JvZHknXHJcbiAgICAgICMgNDogRXh0ZW5kIHRoZSBlbGVtZW50IHdpdGggc3RhbmRhcmQgalF1ZXJ5IEFQSSBtZXRob2RzXHJcbiAgICAgIEBvak5vZGUgPSBuZXcgTm9kZSBAdGhpbk5vZGUsIEBvd25lclxyXG4gICAgICBjb3VudCA9IChAb3duZXIuY291bnQgKyAxKSB8fCAxXHJcbiAgICAgICMgNTogSWYgdGhlIG5vZGUgaXNuJ3QgaW4gdGhlIERPTSwgYXBwZW5kIGl0IHRvIHRoZSBwYXJlbnRcclxuICAgICAgIyBUaGlzIGFsc28gYWNjb21tb2RhdGVzIGRvY3VtZW50IGZyYWdtZW50cywgd2hpY2ggYXJlIG5vdCBpbiB0aGUgRE9NIGJ1dCBhcmUgcHJlc3VtZWQgdG8gYmUgc291bmQgdW50aWwgcmVhZHkgZm9yIG1hbnVhbCBpbnNlcnRpb25cclxuICAgICAgaWYgQHRoaW5Ob2RlLnRhZ05hbWUgaXNudCAnYm9keScgYW5kIG5vdCBAdGhpbk5vZGUuaXNJbkRPTSBhbmQgbm90IEBvak5vZGUuaXNJbkRPTVxyXG4gICAgICAgIEBfbWFrZVVuaXF1ZUlkIGNvdW50XHJcbiAgICAgICAgQG93bmVyLmFwcGVuZCBAb2pOb2RlWzBdXHJcbiAgICAgICAgIyA2OiBCaW5kIGFueSBkZWZpbmVkIGV2ZW50cyBhZnRlciB0aGUgbm9kZSBpcyBpbiB0aGUgRE9NXHJcbiAgICAgICAgQF9iaW5kRXZlbnRzKClcclxuICAgICAgICBcclxuICAgICAgQHRoaW5Ob2RlLmlzSW5ET00gPSB0cnVlXHJcbiAgICAgIEBvak5vZGUuaXNJbkRPTSA9IHRydWVcclxuXHJcbiAgICAgICMgNzogQ3JlYXRlIHRoZSBhbGwgaW1wb3J0YW50ICdtYWtlJyBtZXRob2RcclxuICAgICAgQGFkZE1ha2VNZXRob2QgY291bnRcclxuXHJcbiAgICAgICMgODogUHJldmVudCBkdXBsaWNhdGUgZmFjdG9yeSBleHRlbnNpb24gYnkgc2V0dGluZyBpcyBpbml0ID0gdHJ1ZVxyXG4gICAgICBAb2pOb2RlLmlzRnVsbHlJbml0ID0gdHJ1ZVxyXG5cclxuICAgICAgIyA5OiBpZiB0aGUgbm9kZSBzdXBwb3J0cyBpdCwgY2FsbCBmaW5hbGl6ZVxyXG4gICAgICBmaW5hbGl6ZSA9IF8ub25jZSBAb2pOb2RlLmZpbmFsaXplIG9yIE9KLm5vb3BcclxuICAgICAgQG9qTm9kZS5maW5hbGl6ZSA9IGZpbmFsaXplXHJcbiAgICAgIGZpbmFsaXplIEBvak5vZGVcclxuICAgICMgMTA6IFJldHVybiB0aGUgZXh0ZW5kZWQgZWxlbWVudFxyXG4gICAgQG9qTm9kZVxyXG5cclxuZ2V0Tm9kZUZyb21GYWN0b3J5ID0gKHRhZywgb3B0aW9ucywgb3duZXIsIGlzQ2FsbGVkRnJvbUZhY3RvcnksIG5vZGUpIC0+XHJcbiAgaWYgT0ouaXMuc3RyaW5nIHRhZ1xyXG4gICAgZmFjdG9yeSA9IG5ldyBOb2RlRmFjdG9yeSB0YWcsIG9wdGlvbnMsIG93bmVyXHJcbiAgZWxzZVxyXG4gICAgZmFjdG9yeSA9IG5ldyBOb2RlRmFjdG9yeSBudWxsLCBvcHRpb25zLCB7fSwgdGFnXHJcbiAgZmFjdG9yeS5vak5vZGVcclxuXHJcblxyXG5PSi5yZWdpc3RlciAnbm9kZUZhY3RvcnknLCBnZXROb2RlRnJvbUZhY3RvcnlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ2V0Tm9kZUZyb21GYWN0b3J5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgYVxyXG5ub2RlTmFtZSA9ICdhJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBpZDogJydcclxuICAgICAgY2xhc3M6ICcnXHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICAgIGhyZWY6ICdqYXZhU2NyaXB0OnZvaWQoMCk7J1xyXG4gICAgICB0eXBlOiAnJ1xyXG4gICAgICB0aXRsZTogJydcclxuICAgICAgcmVsOiAnJ1xyXG4gICAgICBtZWRpYTogJydcclxuICAgICAgdGFyZ2V0OiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHRvZ2dsZVN0YXRlID0gJ29mZidcclxuXHJcbiAgdG9nZ2xlID0gLT5cclxuICAgIGlmIHRvZ2dsZVN0YXRlIGlzICdvbidcclxuICAgICAgdG9nZ2xlU3RhdGUgPSAnb2ZmJ1xyXG4gICAgZWxzZSB0b2dnbGVTdGF0ZSA9ICdvbicgIGlmIHRvZ2dsZVN0YXRlIGlzICdvZmYnXHJcbiAgICByZXR1cm5cclxuXHJcbiAgIyBDbGljayBiaW5kaW5nXHJcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICB0b2dnbGUoKVxyXG4gICAgICByZXRWYWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICBpZiBkZWZhdWx0cy5ocmVmIGlzICcjJyB0aGVuIHJldFZhbCA9IGZhbHNlXHJcbiAgICAgIHJldFZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuICBlbHNlXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSB0b2dnbGVcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcclxuXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxudG8gPSByZXF1aXJlICcuLi90b29scy90bydcclxuIyAjIGJyXHJcblxyXG5ub2RlTmFtZSA9ICdicidcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczoge31cclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIG51bWJlcjogMVxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICBpID0gMFxyXG4gIHdoaWxlIGkgPCB0by5udW1iZXIgZGVmYXVsdHMubnVtYmVyXHJcbiAgICAjIEluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGJycywgaXQgaXMgZGVzaXJhYmxlIHRvIG9ubHkgZ2V0IHRoZSBsYXN0IG9uZSBvdXRcclxuICAgIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gICAgaSArPSAxXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBmb3JtXHJcblxyXG5ub2RlTmFtZSA9ICdmb3JtJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBhY3Rpb246ICcnXHJcbiAgICAgIG1ldGhvZDogJydcclxuICAgICAgbmFtZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0LmFkZCAndmFsaWRhdG9yJywgcmV0LiQudmFsaWRhdGUoXHJcbiAgICBoaWdobGlnaHQ6IChlbGVtZW50KSAtPlxyXG4gICAgICAkZWxtID0gJChlbGVtZW50KVxyXG4gICAgICAkZWxtLmF0dHIgJ09KX2ludmFsaWQnLCAnMSdcclxuICAgICAgJGVsbS5hbmltYXRlIGJhY2tncm91bmRDb2xvcjogJ3JlZCdcclxuICAgICAgbnVsbFxyXG5cclxuICAgIHVuaGlnaGxpZ2h0OiAoZWxlbWVudCkgLT5cclxuICAgICAgJGVsbSA9ICQoZWxlbWVudClcclxuICAgICAgaWYgJGVsbS5hdHRyKCdPSl9pbnZhbGlkJykgaXMgJzEnXHJcbiAgICAgICAgJGVsbS5jc3MgJ2JhY2tncm91bmQtY29sb3InLCAneWVsbG93J1xyXG4gICAgICAgICRlbG0uYXR0ciAnT0pfaW52YWxpZCcsICcwJ1xyXG4gICAgICAgIHNldFRpbWVvdXQgKC0+XHJcbiAgICAgICAgICAkZWxtLmFuaW1hdGUgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXHJcbiAgICAgICAgKSwgNTAwXHJcbiAgICAgIG51bGxcclxuICApXHJcblxyXG4gIHJldC5hZGQgJ2lzRm9ybVZhbGlkJywgLT5cclxuICAgIHJldC4kLnZhbGlkKCkgYW5kIChub3QgcmV0LnZhbGlkYXRvci5pbnZhbGlkRWxlbWVudHMoKSBvciByZXQudmFsaWRhdG9yLmludmFsaWRFbGVtZW50cygpLmxlbmd0aCBpcyAwKVxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG5cclxuXHJcblxyXG5cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXHJcblxyXG4jICMgaW5wdXRcclxuXHJcbm5vZGVOYW1lID0gJ2lucHV0J1xyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6ICd0ZXh0J1xyXG4gICAgICB2YWx1ZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcbiAgICAgIGZvY3Vzb3V0OiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICBpZiBub3QgZGVmYXVsdHMucHJvcHMudHlwZSBvciBub3QgZW51bXMuaW5wdXRUeXBlc1tkZWZhdWx0cy5wcm9wcy50eXBlXVxyXG4gICAgdGhyb3cgbmV3IEVycm9yICdObyBtYXRjaGluZyBpbnB1dCB0eXBlIGZvciB7JyArIGRlZmF1bHRzLnByb3BzLnR5cGUgKyAnfSBjb3VsZCBiZSBmb3VuZC4nXHJcbiAgdGhpc1R5cGUgPSBlbnVtcy5pbnB1dFR5cGVzW2RlZmF1bHRzLnByb3BzLnR5cGVdXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICBzd2l0Y2ggdGhpc1R5cGVcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLmNoZWNrYm94XHJcbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LiQuaXMgJzpjaGVja2VkJ1xyXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMucmFkaW9cclxuICAgICAgICByZXQudmFsdWUgPSByZXQuJC5maW5kKCc6Y2hlY2tlZCcpLnZhbCgpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXQudmFsdWUgPSByZXQudmFsKClcclxuICAgIGRlZmF1bHRzLnByb3BzLnZhbHVlID0gcmV0LnZhbHVlICAgIFxyXG4gICAgcmV0LnZhbHVlXHJcblxyXG4gICMjI1xyXG4gICAgQ2xpY2sgYmluZGluZy4gSWYgdGhlIGNhbGxlciBkZWZpbmVkIGEgY2xpY2sgaGFuZGxlcixcclxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcclxuICAgIHRoZW4gY2FsbCB0aGUgZGVmaW5lZCBjbGljayBoYW5kbGVyIHdpdGggdGhlIGxhdGVzdCB2YWx1ZS5cclxuICAjIyNcclxuICBvbGRDbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gIGlmIG9sZENsaWNrIGFuZCBvbGRDbGljayBpc250IE9KLm5vb3BcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICBvbGRDbGljayByZXQudmFsdWUsIGV2ZW50Li4uXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSBuZXdDbGlja1xyXG5cclxuICAjIyNcclxuICAgIENoYW5nZSBiaW5kaW5nLiBJZiB0aGUgY2FsbGVyIGRlZmluZWQgYSBjaGFuZ2UgaGFuZGxlcixcclxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcclxuICAgIHRoZW4gY2FsbCB0aGUgZGVmaW5lZCBjaGFuZ2UgaGFuZGxlciB3aXRoIHRoZSBsYXRlc3QgdmFsdWUuXHJcbiAgIyMjXHJcbiAgb2xkQ2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gIGlmIG9sZENoYW5nZSBhbmQgb2xkQ2hhbmdlIGlzbnQgT0oubm9vcFxyXG4gICAgbmV3Q2hhbmdlID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICBvbGRDaGFuZ2UgcmV0LnZhbHVlLCBldmVudC4uLlxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSA9IG5ld0NoYW5nZVxyXG5cclxuICAjIyNcclxuICAgIE9uIEZvY3VzIE91dCBiaW5kaW5nLiBBbHdheXMgdXNlIHRoZSBldmVudCB0byB1cGRhdGUgdGhlIGludGVybmFsXHJcbiAgICB2YWx1ZSBvZiB0aGUgY29udHJvbDsgYW5kIGlmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGZvY3Vzb3V0IGV2ZW50LFxyXG4gICAgd3JhcCBpdCBhbmQgaW52b2tlIGl0IHdpdGggdGhlIGxhdGVzdCB2YWx1ZVxyXG4gICMjI1xyXG4gIG9sZEZvY3Vzb3V0ID0gZGVmYXVsdHMuZXZlbnRzLmZvY3Vzb3V0XHJcbiAgbmV3Rm9jdXNvdXQgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICBzeW5jVmFsdWUoKVxyXG4gICAgaWYgb2xkRm9jdXNvdXQgYW5kIG9sZEZvY3Vzb3V0IGlzbnQgT0oubm9vcFxyXG4gICAgICBvbGRGb2N1c291dCByZXQudmFsdWUsIGV2ZW50Li4uXHJcblxyXG4gIGRlZmF1bHRzLmV2ZW50cy5mb2N1c291dCA9IG5ld0ZvY3Vzb3V0XHJcblxyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG4gIHJldC52YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBvbFxyXG5cclxubm9kZU5hbWUgPSAnb2wnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIHNlbGVjdFxyXG5cclxubm9kZU5hbWUgPSAnc2VsZWN0J1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHNlbGVjdGVkOiAnJ1xyXG4gICAgICBtdWx0aXBsZTogZmFsc2VcclxuICAgIHN0eWxlczoge31cclxuICAgIHZhbHVlczogW11cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICB2YWx1ZSA9ICcnXHJcbiAgdmFsdWVzID0gW11cclxuICBoYXNFbXB0eSA9IGZhbHNlXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICB2YWx1ZSA9IHJldC52YWwoKVxyXG5cclxuICAjIENsaWNrIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIHJldHZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuXHJcbiAgIyBDaGFuZ2UgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICBjaGFuZ2UgPSBkZWZhdWx0cy5ldmVudHMuY2hhbmdlXHJcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0LmFkZCAnc2VsZWN0ZWREYXRhJywgKHByb3BOYW1lKSAtPlxyXG4gICAgcmV0ID0gJydcclxuICAgIGlmIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpIGFuZCByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVswXVxyXG4gICAgICBkYXRhc2V0ID0gcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0uZGF0YXNldFxyXG4gICAgICByZXQgPSBkYXRhc2V0W3Byb3BOYW1lXSAgaWYgZGF0YXNldFxyXG4gICAgcmV0XHJcblxyXG4gIHJldC5hZGQgJ3NlbGVjdGVkVGV4dCcsIC0+XHJcbiAgICByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS50ZXh0KClcclxuXHJcbiAgcmV0LmFkZCAnc2VsZWN0ZWRWYWwnLCAtPlxyXG4gICAgdmFsdWUgPSByZXQudmFsKClcclxuICAgIHZhbHVlXHJcblxyXG4gIHJldC5hZGQgJ2FkZE9wdGlvbicsICh2YWx1ZSwgdGV4dCA9IHZhbHVlLCBzZWxlY3RlZCA9IGZhbHNlLCBkaXNhYmxlZCA9IGZhbHNlKSAtPlxyXG4gICAgaXNFbXB0eSA9IF8uaXNFbXB0eSB2YWx1ZVxyXG4gICAgYWRkID0gZmFsc2VcclxuICAgIGlmIGlzRW1wdHkgYW5kIGZhbHNlIGlzIGhhc0VtcHR5XHJcbiAgICAgIGhhc0VtcHR5ID0gdHJ1ZVxyXG4gICAgICBhZGQgPSB0cnVlXHJcbiAgICBpZiBmYWxzZSBpcyBhZGQgYW5kIGZhbHNlIGlzIGlzRW1wdHkgdGhlbiBhZGQgPSB0cnVlXHJcbiAgICBpZiBhZGRcclxuICAgICAgdmFsID1cclxuICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgcHJvcHM6XHJcbiAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgaWYgc2VsZWN0ZWRcclxuICAgICAgICB2YWwuc2VsZWN0ZWQgPSBzZWxlY3RlZFxyXG4gICAgICBpZiBkaXNhYmxlZFxyXG4gICAgICAgIHZhbC5kaXNhYmxlZCA9IGRpc2FibGVkXHJcbiAgICAgIG9wdGlvbiA9IHJldC5tYWtlICdvcHRpb24nLCB2YWxcclxuICAgICAgb3B0aW9uXHJcblxyXG4gIHJldC5hZGQgJ2FkZE9wdGlvbnMnLCAob3B0aW9ucykgLT5cclxuICAgIHZhbHVlcyA9IF8udW5pb24gdmFsdWVzLCBvcHRpb25zXHJcbiAgICBPSi5lYWNoIG9wdGlvbnMsICgodmFsKSAtPlxyXG4gICAgICB2YWx1ZSA9IHJldC5hZGRPcHRpb24odmFsKVxyXG4gICAgICB2YWx1ZXMucHVzaCB2YWx1ZVxyXG4gICAgKSwgZmFsc2VcclxuICAgIHZhbHVlc1xyXG5cclxuICByZXQuYWRkICdyZXNldE9wdGlvbnMnLCAodmFsdWVzKSAtPlxyXG4gICAgcmV0LmVtcHR5KClcclxuICAgIHZhbHVlcyA9IHZhbHVlc1xyXG4gICAgcmV0LmFkZE9wdGlvbnMgdmFsdWVzXHJcbiAgICByZXRcclxuXHJcbiAgcmV0LmFkZCAncmVtb3ZlT3B0aW9uJywgKHZhbHVlVG9SZW1vdmUpIC0+XHJcbiAgICB2YWx1ZXMuc3BsaWNlIHZhbHVlcy5pbmRleE9mKHZhbHVlVG9SZW1vdmUpLCAxICNyZW1vdmVzIHRoZSBpdGVtIGZyb20gdGhlIGxpc3RcclxuICAgIHNlbGVjdENvbnRyb2wgPSByZXRbMF1cclxuICAgIGkgPSAwXHJcblxyXG4gICAgd2hpbGUgaSA8IHNlbGVjdENvbnRyb2wubGVuZ3RoXHJcbiAgICAgIHNlbGVjdENvbnRyb2wucmVtb3ZlIGkgIGlmIHNlbGVjdENvbnRyb2wub3B0aW9uc1tpXS52YWx1ZSBpcyB2YWx1ZVRvUmVtb3ZlXHJcbiAgICAgIGkrK1xyXG4gICAgbnVsbFxyXG5cclxuXHJcblxyXG4gIGlmIGRlZmF1bHRzLnZhbHVlcy5sZW5ndGggPiAwXHJcbiAgICByZXQuYWRkT3B0aW9ucyBkZWZhdWx0cy52YWx1ZXNcclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuYXJyYXkyRCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FycmF5MkQnXHJcbiQgPSByZXF1aXJlICdqcXVlcnknXHJcbkpzb25Ub1RhYmxlID0gcmVxdWlyZSAnLi4vdG9vbHMvSnNvblRvVGFibGUnXHJcblxyXG4jICMgdGFibGVcclxuXHJcbm5vZGVOYW1lID0gJ3RhYmxlJ1xyXG5cclxuIyMjXHJcbkNyZWF0ZSBhbiBIVE1MIHRhYmxlLiBQcm92aWRlcyBoZWxwZXIgbWV0aG9kcyB0byBjcmVhdGUgQ29sdW1ucyBhbmQgQ2VsbHMuXHJcbiMjI1xyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgIyAjIyBvcHRpb25zXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgIyAjIyMgZGF0YVxyXG4gICAgIyBvcHRpb25hbCBhcnJheSBvZiBvYmplY3RzLiBpZiBwcm92aWRlZCB3aWxsIGdlbmVyYXRlIHRhYmxlIGF1dG9tYXRpY2FsbHkuXHJcbiAgICBkYXRhOiBudWxsXHJcbiAgICAjICMjIyBwcm9wc1xyXG4gICAgIyBvcHRpb25hbCBwcm9wZXJ0aWVzIHRvIGFwcGx5IHRvIHRhYmxlIHJvb3Qgbm9kZVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNlbGxwYWRkaW5nOiAwXHJcbiAgICAgIGNlbGxzcGFjaW5nOiAwXHJcbiAgICAgIGFsaWduOiAnJ1xyXG4gICAgICB3aWR0aDogJydcclxuICAgICAgY2VsbGFsaWduOiAnbGVmdCdcclxuICAgICAgY2VsbHZhbGlnbjogJ3RvcCdcclxuICAgICAgY2xhc3M6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6IHt9XHJcbiAgICAjICMjIyBjZWxsc1xyXG4gICAgIyBvcHRpb25hbCBwcm9wZXJ0aWVzIHRvIGFwcGx5IHRvIGluZGl2aWR1YWwgY2VsbHNcclxuICAgIGNlbGxzOlxyXG4gICAgICBjbGFzczogJydcclxuICAgICAgYWxpZ246ICcnXHJcbiAgICAgICd2ZXJ0aWNhbC1hbGlnbic6ICcnXHJcbiAgICAgIGNlbGxwYWRkaW5nOiAnJ1xyXG4gICAgICBtYXJnaW46ICcnXHJcbiAgICAjICMjIyB0aGVhZFxyXG4gICAgIyBvcHRpb25hbCBvcHRpb25zIG9iamVjdCB0byBwYXNzIGludG8gdGhlYWQgY3JlYXRpb25cclxuICAgIHRoZWFkOiB7fVxyXG4gICAgIyAjIyMgdGJvZHlcclxuICAgICMgb3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdG8gcGFzcyBpbnRvIHRib2R5IGNyZWF0aW9uXHJcbiAgICB0Ym9keToge31cclxuXHJcbiAgICBmaXJzdEFsaWduUmlnaHQ6IGZhbHNlXHJcbiAgICBvZGRBbGlnblJpZ2h0OiBmYWxzZVxyXG5cclxuICByb3dzID0gW11cclxuICBjZWxscyA9IGFycmF5MkQoKVxyXG4gIGNvbHVtbkNvdW50ID0gMFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG4gXHJcblxyXG4gIHRib2R5ID0gbnVsbFxyXG4gIHRoZWFkID0gbnVsbFxyXG4gIHRoZWFkUm93ID0gbnVsbFxyXG5cclxuICAjICMjIyBpbml0XHJcbiAgIyBpbnRlcm5hbCBtZXRob2QgZm9yIG9uZSB0aW1lIGluaXRpYWxpemF0aW9uIG9mIHRoZSB0YWJsZVxyXG4gIGluaXQgPSBfLm9uY2UgLT5cclxuICAgIGlmIGRlZmF1bHRzLmRhdGFcclxuICAgICAgajJ0ID0gbmV3IEpzb25Ub1RhYmxlIGRlZmF1bHRzLmRhdGFcclxuICAgICAgdGJsU3RyID0gajJ0LnRhYmxlXHJcbiAgICBpZiB0YmxTdHJcclxuICAgICAgalRibCA9ICQgdGJsU3RyXHJcblxyXG4gICAgICBqSGVhZCA9IGpUYmwuZmluZCAndGhlYWQnXHJcbiAgICAgIHJldC4kLmFwcGVuZCBqSGVhZFxyXG4gICAgICB0aGVhZCA9IGVsLnJlc3RvcmVFbGVtZW50IGpIZWFkWzBdXHJcbiAgICAgIHRoZWFkUm93ID0gZWwucmVzdG9yZUVsZW1lbnQgdGhlYWRbMF0ucm93c1swXVxyXG5cclxuICAgICAgakJvZHkgPSBqVGJsLmZpbmQgJ3Rib2R5J1xyXG4gICAgICByZXQuJC5hcHBlbmQgakJvZHlcclxuICAgICAgdGJvZHkgPSBlbC5yZXN0b3JlRWxlbWVudCBqQm9keVswXVxyXG5cclxuICAgICAgbG9hZENlbGxzKClcclxuICAgIGVsc2VcclxuICAgICAgdGhlYWQgPSByZXQubWFrZSAndGhlYWQnLCBkZWZhdWx0cy50aGVhZFxyXG4gICAgICB0aGVhZFJvdyA9IHRoZWFkLm1ha2UgJ3RyJ1xyXG4gICAgICB0Ym9keSA9IHJldC5tYWtlICd0Ym9keScsIGRlZmF1bHRzLnRib2R5XHJcbiAgICAgIHJvd3MucHVzaCB0Ym9keS5tYWtlICd0cidcclxuICAgIHJldFxyXG5cclxuICAjICMjIyBsb2FkQ2VsbHNcclxuICAjIGludGVybmFsIG1ldGhvZCBndWFyYW50ZWVzIHRoYXQgdGFibGVzIGxvYWRlZCBmcm9tIEpTT04gYXJlIGZ1bGx5IGxvYWRlZCBpbnRvIG1lbW9yeVxyXG4gIGxvYWRDZWxscyA9ICgpIC0+XHJcbiAgICByID0gMFxyXG4gICAgd2hpbGUgdGJvZHlbMF0ucm93cy5sZW5ndGggPiByXHJcbiAgICAgIGMgPSAwXHJcbiAgICAgIG1lbVJvdyA9IGVsLnJlc3RvcmVFbGVtZW50IHRib2R5WzBdLnJvd3Nbcl1cclxuICAgICAgcm93cy5wdXNoIG1lbVJvd1xyXG4gICAgICB3aGlsZSB0Ym9keVswXS5yb3dzW3JdLmNlbGxzLmxlbmd0aCA+IGNcclxuICAgICAgICBtZW1DZWxsID0gY2VsbHMuZ2V0IHIrMSwgYysxXHJcbiAgICAgICAgaWYgbm90IG1lbUNlbGxcclxuICAgICAgICAgIG1lbUNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCB0Ym9keVswXS5yb3dzW3JdLmNlbGxzW2NdXHJcbiAgICAgICAgICBjZWxscy5zZXQgcisxLCBjKzEsIG1lbUNlbGxcclxuICAgICAgICBjICs9IDFcclxuICAgICAgciArPSAxXHJcblxyXG4gICMgIyMjIGZpbGxNaXNzaW5nXHJcbiAgIyBpbnRlcm5hbCBtZXRob2QgZ3VhcmFudGVlcyB0aGF0IGNlbGxzIGV4aXN0IGZvciB0aGUgZGltZW5zaW9ucyBvZiB0aGUgdGFibGVcclxuICBmaWxsTWlzc2luZyA9ICgpIC0+XHJcbiAgICBjZWxscy5lYWNoIChyb3dObywgY29sTm8sIHZhbCkgLT5cclxuICAgICAgaWYgbm90IHZhbFxyXG4gICAgICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cclxuICAgICAgICByb3cuY2VsbCBjb2xObywge31cclxuXHJcbiAgIyAjIyBjb2x1bW5cclxuICAjIEFkZHMgYSBjb2x1bW4gbmFtZSB0byB0aGUgdGFibGUgaGVhZFxyXG4gIHJldC5hZGQgJ2NvbHVtbicsIChjb2xObywgY29sTmFtZSkgLT5cclxuICAgIHJldC5pbml0KClcclxuICAgIGNvbHVtbkNvdW50ICs9IDFcclxuICAgIHRoID0gbnVsbFxyXG4gICAgaSA9IDBcclxuICAgIHdoaWxlIHRoZWFkWzBdLnJvd3NbMF0uY2VsbHMubGVuZ3RoIDwgY29sTm9cclxuICAgICAgbmF0aXZlVGggPSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzW2ldXHJcbiAgICAgIGlmIG5vdCBuYXRpdmVUaFxyXG4gICAgICAgIHRoID0gdGhlYWRSb3cubWFrZSAndGgnLCB7fVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudCBuYXRpdmVUaCwgJ3RoJ1xyXG4gICAgICBpICs9IDFcclxuICAgIGlmIG5vdCB0aFxyXG4gICAgICBuYXRpdmVUaCA9IHRoZWFkWzBdLnJvd3NbMF0uY2VsbHNbY29sTm8tMV1cclxuICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudCBuYXRpdmVUaCwgJ3RoJ1xyXG4gICAgdGgudGV4dCBjb2xOYW1lXHJcbiAgICB0aFxyXG5cclxuICAjICMjIHJvd1xyXG4gICMgQWRkcyBhIG5ldyByb3cgKHRyKSB0byB0aGUgdGFibGUgYm9keVxyXG4gIHJldC5hZGQgJ3JvdycsIChyb3dObywgb3B0cykgLT5cclxuICAgIHJvdyA9IHJvd3Nbcm93Tm8tMV1cclxuXHJcbiAgICBpZiBub3Qgcm93XHJcbiAgICAgIHdoaWxlIHJvd3MubGVuZ3RoIDwgcm93Tm9cclxuICAgICAgICByb3cgPSB0Ym9keS5tYWtlICd0cicsIHt9XHJcbiAgICAgICAgcm93cy5wdXNoIHJvd1xyXG5cclxuICAgIGlmIG5vdCByb3cuY2VsbFxyXG4gICAgICByb3cuYWRkICdjZWxsJywgKGNvbE5vLCBvcHRzKSAtPlxyXG4gICAgICAgIGNlbGwgPSBPSi5ub2Rlcy50ZCBvcHRzLCByb3dcclxuICAgICAgICBjZWxscy5zZXQgcm93Tm8sIGNvbE5vLCBjZWxsXHJcbiAgICAgICAgY2VsbFxyXG5cclxuICAgIHJvd1xyXG5cclxuICAjICMjIGNlbGxcclxuICAjIEFkZHMgYSBjZWxsICh0ci90ZCkgdG8gdGhlIHRhYmxlIGJvZHlcclxuICByZXQuYWRkICdjZWxsJywgKHJvd05vLCBjb2xObywgb3B0cykgLT5cclxuICAgIGlmIHJvd05vIDwgMSB0aGVuIHJvd05vID0gMVxyXG4gICAgaWYgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXHJcbiAgICBpZiBjb2x1bW5Db3VudCA+IDAgYW5kIGNvbE5vLTEgPiBjb2x1bW5Db3VudCB0aGVuIHRocm93IG5ldyBFcnJvciAnQSBjb2x1bW4gbmFtZSBoYXMgbm90IGJlZW4gZGVmaW5lZCBmb3IgdGhpcyBwb3NpdGlvbiB7JyArIHJvd05vICsgJ3gnICsgY29sTm8gKyAnfS4nXHJcblxyXG4gICAgcm93ID0gcmV0LnJvdyByb3dOb1xyXG5cclxuICAgIGNlbGwgPSBjZWxscy5nZXQgcm93Tm8sIGNvbE5vXHJcblxyXG4gICAgaWYgbm90IGNlbGxcclxuICAgICAgaSA9IDBcclxuICAgICAgd2hpbGUgaSA8IGNvbE5vXHJcbiAgICAgICAgaSArPSAxXHJcbiAgICAgICAgaWYgaSBpcyBjb2xOb1xyXG4gICAgICAgICAgbnVPcHRzID0gT0ouZXh0ZW5kIHtwcm9wczogZGVmYXVsdHMuY2VsbHN9LCBvcHRzXHJcbiAgICAgICAgICBjZWxsID0gcm93LmNlbGwgY29sTm8sIG51T3B0c1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHRyeUNlbGwgPSBjZWxscy5nZXQgcm93Tm8sIGlcclxuICAgICAgICAgIGlmIG5vdCB0cnlDZWxsXHJcbiAgICAgICAgICAgIHRyeUNlbGwgPSAgcm93LmNlbGwgaSwgcHJvcHM6IGRlZmF1bHRzLmNlbGxzXHJcblxyXG4gICAgY2VsbFxyXG5cclxuICAjICMjIEZpbmFsaXplXHJcbiAgIyBGaW5hbGl6ZSBndWFyYW50ZWVzIHRoYXQgdGhlYWQgYW5kIHRib2R5IGFuZCBjcmVhdGVkIHdoZW4gdGhlIG5vZGUgaXMgZnVsbHkgaW5zdGFudGlhdGVkXHJcbiAgaW5pdCgpXHJcblxyXG4gICMgIyMgVEhlYWRcclxuICAjIEV4cG9zZSB0aGUgaW50ZXJuYWwgdGhlYWQgbm9kZVxyXG4gIHJldC5hZGQgJ3RoZWFkJywgdGhlYWRcclxuXHJcbiAgIyAjIyBUQm9keVxyXG4gICMgRXhwb3NlIHRoZSBpbnRlcm5hbCB0Ym9keSBub2RlXHJcbiAgcmV0LmFkZCAndGJvZHknLCB0Ym9keVxyXG5cclxuICAgIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuZW51bXMgPSByZXF1aXJlICcuLi90b29scy9lbnVtcydcclxuXHJcbm5vZGVOYW1lID0gJ3RleHRhcmVhJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBuYW1lOiAnJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogJydcclxuICAgICAgdmFsdWU6ICcnXHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICAgIG1heGxlbmd0aDogJydcclxuICAgICAgYXV0b2ZvY3VzOiBmYWxzZVxyXG4gICAgICBpc1JlcXVpcmVkOiBmYWxzZVxyXG4gICAgICByb3dzOiAzXHJcbiAgICAgIGNvbHM6IDI1XHJcbiAgICAgIGRpc2FibGVkOiBmYWxzZVxyXG4gICAgICByZWFkb25seTogZmFsc2VcclxuICAgICAgZm9ybTogJydcclxuICAgICAgd3JhcDogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHZhbHVlID0gZGVmYXVsdHMucHJvcHMudmFsdWVcclxuXHJcbiAgc3luY1ZhbHVlID0gLT5cclxuICAgIHN3aXRjaCBkZWZhdWx0cy5wcm9wcy50eXBlXHJcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5jaGVja2JveFxyXG4gICAgICAgIHZhbHVlID0gcmV0LiQuaXMoJzpjaGVja2VkJylcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLnJhZGlvXHJcbiAgICAgICAgdmFsdWUgPSByZXQuJC5maW5kKCc6Y2hlY2tlZCcpLnZhbCgpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICB2YWx1ZSA9IHJldC52YWwoKVxyXG5cclxuICAjIENsaWNrIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIHJldHZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuXHJcbiAgIyBDaGFuZ2UgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICBjaGFuZ2UgPSBkZWZhdWx0cy5ldmVudHMuY2hhbmdlXHJcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG5ub2RlTmFtZSA9ICd0aGVhZCdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczoge31cclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIG51bWJlcjogMVxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcm93cyA9IFtdXHJcbiAgY2VsbHMgPSB7fVxyXG4gIHJldC5hZGQgJ2NlbGwnLCAocm93Tm8sIGNvbE5vKSAtPlxyXG4gICAgaW5pdCgpXHJcblxyXG4gICAgaWYgcm93Tm8gPCAxIHRoZW4gcm93Tm8gPSAxXHJcbiAgICBpZiBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcclxuXHJcbiAgICByb3cgPSByb3dzW3Jvd05vLTFdXHJcblxyXG4gICAgaWYgbm90IHJvd1xyXG4gICAgICB3aGlsZSByb3dzLmxlbmd0aCA8IHJvd05vXHJcbiAgICAgICAgcm93ID0gT0oubm9kZXMudHIge30sIHRib2R5LCBmYWxzZVxyXG4gICAgICAgIHJvd3MucHVzaCByb3dcclxuXHJcbiAgICB0ZCA9IHJvd1swXS5jZWxsc1tjb2xOb11cclxuXHJcbiAgICBpZiB0ZCB0aGVuIGNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCB0ZCwgJ3RkJ1xyXG4gICAgaWYgbm90IHRkXHJcbiAgICAgIHdoaWxlIHJvd1swXS5jZWxscy5sZW5ndGggPCBjb2xOb1xyXG4gICAgICAgIGlkeCA9IHJvd1swXS5jZWxscy5sZW5ndGhcclxuICAgICAgICB0ZCA9IHJvd1swXS5jZWxsc1tpZHgtMV1cclxuICAgICAgICBpZiB0ZCBhbmQgaWR4IGlzIGNvbE5vXHJcbiAgICAgICAgICBjZWxsID0gZWwucmVzdG9yZUVsZW1lbnQgdGQsICd0ZCdcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBjZWxsID0gT0oubm9kZXMudGQgcHJvcHM6IGRlZmF1bHRzLmNlbGxzLCByb3csIGZhbHNlXHJcblxyXG4gICAgaWYgbm90IGNlbGwuaXNWYWxpZFxyXG4gICAgICBub2RlRmFjdG9yeSBjZWxsLCByb3csIHJvd05vICsgY29sTm9cclxuXHJcbiAgICBjZWxsXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxubm9kZU5hbWUgPSAndWwnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsInRoaXNHbG9iYWwgPSAoaWYgKHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsKSB0aGVuIGdsb2JhbCBlbHNlIChpZiAodHlwZW9mIHNlbGYgaXNudCAndW5kZWZpbmVkJyBhbmQgc2VsZikgdGhlbiBzZWxmIGVsc2UgKGlmICh0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgYW5kIHdpbmRvdykgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkpXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXNHbG9iYWwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2J1dHRvbmlucHV0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuICAgICAgc3JjOiAnJ1xuICAgICAgYWx0OiAnJ1xuICAgICAgaGVpZ2h0OiAnJ1xuICAgICAgd2lkdGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG5cblxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdjaGVja2JveCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIGNoZWNrZWQ6IGZhbHNlXG4gICAgaW5kZXRlcm1pbmF0ZTogZmFsc2VcbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgaWYgZGVmYXVsdHMuY2hlY2tlZFxuICAgIHJldC5hdHRyICdjaGVja2VkJywgdHJ1ZVxuICBlbHNlIGlmIGRlZmF1bHRzLmluZGV0ZXJtaW5hdGVcbiAgICByZXQuYXR0ciAnaW5kZXRlcm1pbmF0ZScsIHRydWVcblxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdjb2xvcidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdkYXRlJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnZGF0ZXRpbWUnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2RhdGV0aW1lLWxvY2FsJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdlbWFpbCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgICBtdWx0aXBsZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdmaWxlJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIGFjY2VwdDogJydcbiAgICAgIG11bHRpcGxlOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2hpZGRlbidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnaW1hZ2VpbnB1dCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogJ2ltYWdlJ1xuICAgICAgc3JjOiAnJ1xuICAgICAgYWx0OiAnJ1xuICAgICAgaGVpZ2h0OiAnJ1xuICAgICAgd2lkdGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnbW9udGgnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ251bWJlcidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncGFzc3dvcmQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgbWF4bGVuZ3RoOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3JhZGlvJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIG5hbWU6ICcnXG4gICAgICB2YWx1ZTogJydcbiAgICAgIGNoZWNrZWQ6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncmFuZ2UnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgbWluOiAwXG4gICAgICBtYXg6IDEwMFxuICAgICAgdmFsdWU6IDUwXG4gICAgICBzdGVwOiAxXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncmVzZXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3NlYXJjaCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnc3VibWl0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0ZWwnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgcGF0dGVybjogJydcbiAgICAgIG1heGxlbmd0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0ZXh0aW5wdXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgYXV0b2NvbXBsZXRlOiAnb24nXG4gICAgICBhdXRvc2F2ZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0aW1lJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd1cmwnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgcGF0dGVybjogJydcbiAgICAgIG1heGxlbmd0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd3ZWVrJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiIyAjIE9KXG50aGlzR2xvYmFsID0gcmVxdWlyZSAnLi9nbG9iYWwnXG51dGlsTGliID0gcmVxdWlyZSAnanF1ZXJ5J1xubmFtZVNwYWNlTmFtZSA9ICdPSidcblxuIyMjXG5ib290IHN0cmFwIG5hbWUgbWV0aG9kIGludG8gT2JqZWN0IHByb3RvdHlwZVxuIyMjXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBPYmplY3Q6OixcbiAgZ2V0SW5zdGFuY2VOYW1lOlxuICAgIHZhbHVlOiAtPlxuICAgICAgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLnsxLH0pXFwoL1xuICAgICAgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKEBjb25zdHJ1Y3Rvci50b1N0cmluZygpKVxuICAgICAgKGlmIChyZXN1bHRzIGFuZCByZXN1bHRzLmxlbmd0aCA+IDEpIHRoZW4gcmVzdWx0c1sxXSBlbHNlICcnKVxuXG5cbiMjI1xuQW4gaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5hbWVzcGFjZSB0cmVlXG4jIyNcbk5zVHJlZSA9IHt9XG5tYWtlVGhlSnVpY2UgPSAtPlxuXG4gICMjI1xuICBJbnRlcm5hbCBuYW1lU3BhY2VOYW1lIG1ldGhvZCB0byBjcmVhdGUgbmV3ICdzdWInIG5hbWVzcGFjZXMgb24gYXJiaXRyYXJ5IGNoaWxkIG9iamVjdHMuXG4gICMjI1xuICBtYWtlTmFtZVNwYWNlID0gKHNwYWNlbmFtZSwgdHJlZSkgLT5cbiAgICAjIyNcbiAgICBUaGUgZGVyaXZlZCBpbnN0YW5jZSB0byBiZSBjb25zdHJ1Y3RlZFxuICAgICMjI1xuICAgIEJhc2UgPSAobnNOYW1lKSAtPlxuICAgICAgcHJvdG8gPSB0aGlzXG4gICAgICB0cmVlW25zTmFtZV0gPSB0cmVlW25zTmFtZV0gb3Ige31cbiAgICAgIG5zVHJlZSA9IHRyZWVbbnNOYW1lXVxuICAgICAgbWVtYmVycyA9IHt9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAnbWVtYmVycycsIHZhbHVlOiBtZW1iZXJzXG5cbiAgICAgICMjI1xuICAgICAgUmVnaXN0ZXIgKGUuZy4gJ0xpZnQnKSBhbiBPYmplY3QgaW50byB0aGUgcHJvdG90eXBlIG9mIHRoZSBuYW1lc3BhY2UuXG4gICAgICBUaGlzIE9iamVjdCB3aWxsIGJlIHJlYWRhYmxlL2V4ZWN1dGFibGUgYnV0IGlzIG90aGVyd2lzZSBpbW11dGFibGUuXG4gICAgICAjIyNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAncmVnaXN0ZXInLFxuICAgICAgICB2YWx1ZTogKG5hbWUsIG9iaiwgZW51bWVyYWJsZSkgLT5cbiAgICAgICAgICAndXNlIHN0cmljdCdcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsaWZ0IGEgbmV3IHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIG5hbWUgaXNudCAnc3RyaW5nJykgb3IgbmFtZSBpcyAnJ1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIHByb3BlcnR5IGluc3RhbmNlLicpICB1bmxlc3Mgb2JqXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9wZXJ0eSBuYW1lZCAnICsgbmFtZSArICcgaXMgYWxyZWFkeSBkZWZpbmVkIG9uICcgKyBzcGFjZW5hbWUgKyAnLicpICBpZiBwcm90b1tuYW1lXVxuXG4gICAgICAgICAgbWVtYmVyc1tuYW1lXSA9IG1lbWJlcnNbbmFtZV0gb3IgbmFtZVxuXG4gICAgICAgICAgI0d1YXJkIGFnYWluc3Qgb2JsaXRlcmF0aW5nIHRoZSB0cmVlIGFzIHRoZSB0cmVlIGlzIHJlY3Vyc2l2ZWx5IGV4dGVuZGVkXG4gICAgICAgICAgbnNUcmVlW25hbWVdID0gbnNUcmVlW25hbWVdIG9yXG4gICAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgICAgICB0eXBlOiB0eXBlb2Ygb2JqXG4gICAgICAgICAgICBpbnN0YW5jZTogKGlmIG9iai5nZXRJbnN0YW5jZU5hbWUgdGhlbiBvYmouZ2V0SW5zdGFuY2VOYW1lKCkgZWxzZSAndW5rbm93bicpXG5cbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgcHJvdG8sIG5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogb2JqXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSBpc250IGVudW1lcmFibGVcblxuICAgICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHNwYWNlbmFtZSArICcuJyArIG5hbWVcbiAgICAgICAgICBvYmpcblxuXG4gICAgICAjIyNcbiAgICAgIENyZWF0ZSBhIG5ldywgc3RhdGljIG5hbWVzcGFjZSBvbiB0aGUgY3VycmVudCBwYXJlbnQgKGUuZy4gbnNOYW1lLnRvLi4uIHx8IG5zTmFtZS5pcy4uLilcbiAgICAgICMjI1xuICAgICAgcHJvdG8ucmVnaXN0ZXIgJ21ha2VTdWJOYW1lU3BhY2UnLCAoKHN1Yk5hbWVTcGFjZSkgLT5cbiAgICAgICAgJ3VzZSBzdHJpY3QnXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIG5ldyBzdWIgbmFtZXNwYWNlIHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIHN1Yk5hbWVTcGFjZSBpc250ICdzdHJpbmcnKSBvciBzdWJOYW1lU3BhY2UgaXMgJydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdWIgbmFtZXNwYWNlIG5hbWVkICcgKyBzdWJOYW1lU3BhY2UgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKSAgaWYgcHJvdG8uc3ViTmFtZVNwYWNlXG4gICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHN1Yk5hbWVTcGFjZVxuICAgICAgICBuZXdOYW1lU3BhY2UgPSBtYWtlTmFtZVNwYWNlKHN1Yk5hbWVTcGFjZSwgbnNUcmVlKVxuICAgICAgICBuZXdOYW1lU3BhY2UucmVnaXN0ZXIgJ2NvbnN0YW50cycsIG1ha2VOYW1lU3BhY2UoJ2NvbnN0YW50cycsIG5zVHJlZSksIGZhbHNlICBpZiBzdWJOYW1lU3BhY2UgaXNudCAnY29uc3RhbnRzJ1xuICAgICAgICBwcm90by5yZWdpc3RlciBzdWJOYW1lU3BhY2UsIG5ld05hbWVTcGFjZSwgZmFsc2VcbiAgICAgICAgbmV3TmFtZVNwYWNlXG4gICAgICApLCBmYWxzZVxuICAgICAgcmV0dXJuXG5cbiAgICAjIyNcbiAgICBBbiBpbnRlcm5hbCBtZWNoYW5pc20gdG8gcmVwcmVzZW50IHRoZSBpbnN0YW5jZSBvZiB0aGlzIG5hbWVzcGFjZVxuICAgIEBjb25zdHJ1Y3RvclxuICAgIEBpbnRlcm5hbFxuICAgIEBtZW1iZXJPZiBtYWtlTmFtZVNwYWNlXG4gICAgIyMjXG4gICAgQ2xhc3MgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiBmdW5jdGlvbiAnICsgc3BhY2VuYW1lICsgJygpe30nKSgpXG4gICAgQ2xhc3M6OiA9IG5ldyBCYXNlKHNwYWNlbmFtZSlcblxuICAgICNDbGFzcy5wcm90b3R5cGUucGFyZW50ID0gQmFzZS5wcm90b3R5cGU7XG4gICAgbmV3IENsYXNzKHNwYWNlbmFtZSlcblxuICAjIyNcbiAgJ0RlcGVuZCcgYW4gT2JqZWN0IHVwb24gYW5vdGhlciBtZW1iZXIgb2YgdGhpcyBuYW1lc3BhY2UsIHVwb24gYW5vdGhlciBuYW1lc3BhY2UsXG4gIG9yIHVwb24gYSBtZW1iZXIgb2YgYW5vdGhlciBuYW1lc3BhY2VcbiAgIyMjXG4gIGRlcGVuZHNPbiA9IChkZXBlbmRlbmNpZXMsIGNhbGxCYWNrLCBpbXBvcnRzKSAtPlxuICAgICd1c2Ugc3RyaWN0J1xuICAgIHJldCA9IGZhbHNlXG4gICAgbnNNZW1iZXJzID0gbnNJbnRlcm5hbC5nZXROc01lbWJlcnMoKVxuICAgIGlmIGRlcGVuZGVuY2llcyBhbmQgZGVwZW5kZW5jaWVzLmxlbmd0aCA+IDAgYW5kIGNhbGxCYWNrXG4gICAgICBtaXNzaW5nID0gZGVwZW5kZW5jaWVzLmZpbHRlcigoZGVwZW4pIC0+XG4gICAgICAgIG5zTWVtYmVycy5pbmRleE9mKGRlcGVuKSBpcyAtMSBhbmQgKG5vdCBpbXBvcnRzIG9yIGltcG9ydHMgaXNudCBkZXBlbilcbiAgICAgIClcbiAgICAgIGlmIG1pc3NpbmcubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0ID0gdHJ1ZVxuICAgICAgICBjYWxsQmFjaygpXG4gICAgICBlbHNlXG4gICAgICAgIG5zSW50ZXJuYWwuZGVwZW5kZW50cy5wdXNoIChpbXBvcnRzKSAtPlxuICAgICAgICAgIGRlcGVuZHNPbiBtaXNzaW5nLCBjYWxsQmFjaywgaW1wb3J0c1xuXG4gICAgcmV0XG4gIG5zSW50ZXJuYWwgPSBkZXBlbmRlbnRzOiBbXVxuXG4gICMjI1xuICBGZXRjaGVzIHRoZSByZWdpc3RlcmVkIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgb24gdGhlIG5hbWVzcGFjZSBhbmQgaXRzIGNoaWxkIG5hbWVzcGFjZXNcbiAgIyMjXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBuc0ludGVybmFsLCAnZ2V0TnNNZW1iZXJzJyxcbiAgICB2YWx1ZTogLT5cbiAgICAgIHJlY3Vyc2VUcmVlID0gKGtleSwgbGFzdEtleSkgLT5cbiAgICAgICAgbWVtYmVycy5wdXNoIGxhc3RLZXkgKyAnLicgKyBrZXkgIGlmIHR5cGVvZiAoa2V5KSBpcyAnc3RyaW5nJ1xuICAgICAgICBpZiB1dGlsTGliLmlzUGxhaW5PYmplY3Qoa2V5KVxuICAgICAgICAgIE9iamVjdC5rZXlzKGtleSkuZm9yRWFjaCAoaykgLT5cbiAgICAgICAgICAgIG1lbWJlcnMucHVzaCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdHlwZW9mIChrKSBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgcmVjdXJzZVRyZWUga2V5W2tdLCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KGtleVtrXSlcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJldHVyblxuICAgICAgbWVtYmVycyA9IFtdXG4gICAgICBPYmplY3Qua2V5cyhOc1RyZWVbbmFtZVNwYWNlTmFtZV0pLmZvckVhY2ggKGtleSkgLT5cbiAgICAgICAgcmVjdXJzZVRyZWUgTnNUcmVlW25hbWVTcGFjZU5hbWVdW2tleV0sIG5hbWVTcGFjZU5hbWUgIGlmIHV0aWxMaWIuaXNQbGFpbk9iamVjdChOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG1lbWJlcnNcblxuICAjIyNcbiAgVG8gc3VwcG9ydCBkZXBlbmRlbmN5IG1hbmFnZW1lbnQsIHdoZW4gYSBwcm9wZXJ0eSBpcyBsaWZ0ZWQgb250byB0aGUgbmFtZXNwYWNlLCBub3RpZnkgZGVwZW5kZW50cyB0byBpbml0aWFsaXplXG4gICMjI1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnNJbnRlcm5hbCwgJ2FsZXJ0RGVwZW5kZW50cycsXG4gICAgdmFsdWU6IChpbXBvcnRzKSAtPlxuICAgICAgZGVwcyA9IG5zSW50ZXJuYWwuZGVwZW5kZW50cy5maWx0ZXIoKGRlcE9uKSAtPlxuICAgICAgICBmYWxzZSBpcyBkZXBPbihpbXBvcnRzKVxuICAgICAgKVxuICAgICAgbnNJbnRlcm5hbC5kZXBlbmRlbnRzID0gZGVwcyAgaWYgQXJyYXkuaXNBcnJheShkZXBzKVxuXG4gICNDcmVhdGUgdGhlIHJvb3Qgb2YgdGhlIHRyZWUgYXMgdGhlIGN1cnJlbnQgbmFtZXNwYWNlXG4gIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSA9IHt9XG4gICNEZWZpbmUgdGhlIGNvcmUgbmFtZXNwYWNlIGFuZCB0aGUgcmV0dXJuIG9mIHRoaXMgY2xhc3NcbiAgTnNPdXQgPSBtYWtlTmFtZVNwYWNlKG5hbWVTcGFjZU5hbWUsIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSlcblxuICAjIyNcbiAgQ2FjaGUgYSBoYW5kbGUgb24gdGhlIHZlbmRvciAocHJvYmFibHkgalF1ZXJ5KSBvbiB0aGUgcm9vdCBuYW1lc3BhY2VcbiAgIyMjXG4gIE5zT3V0LnJlZ2lzdGVyICc/JywgdXRpbExpYiwgZmFsc2VcblxuICAjIyNcbiAgQ2FjaGUgdGhlIHRyZWUgKHVzZWZ1bCBmb3IgZG9jdW1lbnRhdGlvbi92aXN1YWxpemF0aW9uL2RlYnVnZ2luZylcbiAgIyMjXG4gIE5zT3V0LnJlZ2lzdGVyICd0cmVlJywgTnNUcmVlW25hbWVTcGFjZU5hbWVdLCBmYWxzZVxuXG4gICMjI1xuICBDYWNoZSB0aGUgbmFtZSBzcGFjZSBuYW1lXG4gICMjI1xuICBOc091dC5yZWdpc3RlciAnbmFtZScsIG5hbWVTcGFjZU5hbWUsIGZhbHNlXG4gIE5zT3V0LnJlZ2lzdGVyICdkZXBlbmRzT24nLCBkZXBlbmRzT24sIGZhbHNlXG4gIE5zT3V0XG5cblxuIyMjXG5BY3R1YWxseSBkZWZpbmUgdGhlIE9KIE5hbWVTcGFjZVxuIyMjXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgdGhpc0dsb2JhbCwgbmFtZVNwYWNlTmFtZSxcbiAgdmFsdWU6IG1ha2VUaGVKdWljZSgpXG5cbk9KLnJlZ2lzdGVyICdnbG9iYWwnLCB0aGlzR2xvYmFsXG5cbnRoaXNEb2N1bWVudCA9IHt9XG5pZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xuICB0aGlzRG9jdW1lbnQgPSBkb2N1bWVudFxuXG5PSi5yZWdpc3RlciAnZG9jdW1lbnQnLCB0aGlzRG9jdW1lbnRcblxuT0oucmVnaXN0ZXIgJ25vb3AnLCAtPlxuXG5tb2R1bGUuZXhwb3J0cyA9IE9KIiwiICMgIyBPSiBQb3N0LUluaXRpYWxpemF0aW9uXHJcblxyXG5PSiA9IHJlcXVpcmUgJy4vb2onXHJcbl8gPSByZXF1aXJlICdsb2Rhc2gnXHJcblxyXG4jIFNpbXBsZSBhcnJheSBvZiBhbnRpY2lwYXRlZC9rbm93biBjaGlsZCBuYW1lc3BhY2VzXHJcbiAgXHJcbnN1Yk5hbWVTcGFjZXMgPSBbXHJcbiAgJ2Vycm9ycydcclxuICAnZW51bXMnXHJcbiAgJ2luc3RhbmNlT2YnXHJcbiAgJ25vZGVzJ1xyXG4gICdkYidcclxuICAnY29tcG9uZW50cydcclxuICAnY29udHJvbHMnXHJcbiAgJ2lucHV0cydcclxuICAnbm90aWZpY2F0aW9ucydcclxuICAnaGlzdG9yeSdcclxuICAnY29va2llJ1xyXG4gICdhc3luYydcclxuXVxyXG5cclxuIyAjIyBTdWJOYW1lU3BhY2VzXHJcblxyXG4jIFByZS1hbGxvY2F0ZSBjZXJ0YWluIGNvbW1vbiBuYW1lc3BhY2VzIHRvIGF2b2lkIGZ1dHVyZSByYWNlIGNvbmRpdGlvbnMuXHJcbiMgVGhpcyBkb2VzIHJlcXVpcmUgdGhhdCB0aGUgb3JkZXIgb2Ygb3BlcmF0aW9ucyBsb2FkcyBPSi5jb2ZmZWUgZmlyc3QgYW5kIG9KSW5pdC5jb2ZmZWUgc2Vjb25kXHJcbl8uZWFjaCBzdWJOYW1lU3BhY2VzLCAobmFtZSkgLT5cclxuICBPSi5tYWtlU3ViTmFtZVNwYWNlIG5hbWVcclxuICBcclxuIyAjIyBDb25maWd1cmF0aW9uIHZhcmlhYmxlc1xyXG5cclxuIyBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlIHVuaXF1ZSBJRHMgZm9yIGVhY2ggbm9kZSAoZGVmYXVsdCBmYWxzZSlcclxuT0pbJ0dFTkVSQVRFX1VOSVFVRV9JRFMnXSA9IGZhbHNlXHJcbiMgRGVmYXVsdCByb290IG5vZGUgZm9yIGNvbXBvbmVudHMvY29udHJvbHMgKGRlZmF1bHQgJ2RpdicpXHJcbk9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gPSAnZGl2J1xyXG4jIFdoZXRoZXIgdG8gaG9vayBpbnRvIHRoZSBnbG9iYWwgb24gZXJyb3IgZXZlbnQgdG8gd3JpdGUgZXJyb3JzIHRvIGNvbnNvbGUgKGRlZmF1bHQgZmFsc2UpXHJcbk9KWydUUkFDS19PTl9FUlJPUiddID0gZmFsc2VcclxuI1doZXRoZXIgdG8gbG9nIGFsbCBBSkFYIHJlcXVlc3RzXHJcbk9KWydMT0dfQUxMX0FKQVgnXSA9IGZhbHNlXHJcbiNXaGV0aGVyIHRvIGxvZyBhbGwgQUpBWCBlcnJvcnNcclxuT0pbJ0xPR19BTExfQUpBWF9FUlJPUlMnXSA9IGZhbHNlIiwiXHJcbiMjI1xyXG5SZXR1cm4ganVzdCB0aGUga2V5cyBmcm9tIHRoZSBpbnB1dCBhcnJheSwgb3B0aW9uYWxseSBvbmx5IGZvciB0aGUgc3BlY2lmaWVkIHNlYXJjaF92YWx1ZVxyXG52ZXJzaW9uOiAxMTA5LjIwMTVcclxuZGlzY3VzcyBhdDogaHR0cDovL3BocGpzLm9yZy9mdW5jdGlvbnMvYXJyYXlfa2V5c1xyXG4rICAgb3JpZ2luYWwgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0KVxyXG4rICAgICAgaW5wdXQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXHJcbisgICBidWdmaXhlZCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2tldmluLnZhbnpvbm5ldmVsZC5uZXQpXHJcbisgICBpbXByb3ZlZCBieTogamRcclxuKyAgIGltcHJvdmVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxyXG4rICAgaW5wdXQgYnk6IFBcclxuKyAgIGJ1Z2ZpeGVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxyXG5leGFtcGxlIDE6IGFycmF5X2tleXMoIHtmaXJzdG5hbWU6ICdLZXZpbicsIHN1cm5hbWU6ICd2YW4gWm9ubmV2ZWxkJ30gKTtcclxucmV0dXJucyAxOiB7MDogJ2ZpcnN0bmFtZScsIDE6ICdzdXJuYW1lJ31cclxuIyMjXHJcbmFycmF5X2tleXMgPSAoaW5wdXQsIHNlYXJjaF92YWx1ZSwgYXJnU3RyaWN0KSAtPlxyXG4gIHNlYXJjaCA9IHR5cGVvZiBzZWFyY2hfdmFsdWUgaXNudCBcInVuZGVmaW5lZFwiXHJcbiAgdG1wX2FyciA9IFtdXHJcbiAgc3RyaWN0ID0gISFhcmdTdHJpY3RcclxuICBpbmNsdWRlID0gdHJ1ZVxyXG4gIGtleSA9IFwiXCJcclxuICAjIER1Y2stdHlwZSBjaGVjayBmb3Igb3VyIG93biBhcnJheSgpLWNyZWF0ZWQgUEhQSlNfQXJyYXlcclxuICByZXR1cm4gaW5wdXQua2V5cyhzZWFyY2hfdmFsdWUsIGFyZ1N0cmljdCkgIGlmIGlucHV0IGFuZCB0eXBlb2YgaW5wdXQgaXMgXCJvYmplY3RcIiBhbmQgaW5wdXQuY2hhbmdlX2tleV9jYXNlXHJcbiAgZm9yIGtleSBvZiBpbnB1dFxyXG4gICAgaWYgaW5wdXQuaGFzT3duUHJvcGVydHkoa2V5KVxyXG4gICAgICBpbmNsdWRlID0gdHJ1ZVxyXG4gICAgICBpZiBzZWFyY2hcclxuICAgICAgICBpZiBzdHJpY3QgYW5kIGlucHV0W2tleV0gaXNudCBzZWFyY2hfdmFsdWVcclxuICAgICAgICAgIGluY2x1ZGUgPSBmYWxzZVxyXG4gICAgICAgIGVsc2UgaW5jbHVkZSA9IGZhbHNlICB1bmxlc3MgaW5wdXRba2V5XSBpcyBzZWFyY2hfdmFsdWVcclxuICAgICAgdG1wX2Fyclt0bXBfYXJyLmxlbmd0aF0gPSBrZXkgIGlmIGluY2x1ZGVcclxuICB0bXBfYXJyXHJcblxyXG4jIyMqXHJcbkNvbnZlcnQgYSBKYXZhc2NyaXB0IE9qZWN0IGFycmF5IG9yIFN0cmluZyBhcnJheSB0byBhbiBIVE1MIHRhYmxlXHJcbkpTT04gcGFyc2luZyBoYXMgdG8gYmUgbWFkZSBiZWZvcmUgZnVuY3Rpb24gY2FsbFxyXG5JdCBhbGxvd3MgdXNlIG9mIG90aGVyIEpTT04gcGFyc2luZyBtZXRob2RzIGxpa2UgalF1ZXJ5LnBhcnNlSlNPTlxyXG5odHRwKHMpOi8vLCBmdHA6Ly8sIGZpbGU6Ly8gYW5kIGphdmFzY3JpcHQ6OyBsaW5rcyBhcmUgYXV0b21hdGljYWxseSBjb21wdXRlZFxyXG5cclxuSlNPTiBkYXRhIHNhbXBsZXMgdGhhdCBzaG91bGQgYmUgcGFyc2VkIGFuZCB0aGVuIGNhbiBiZSBjb252ZXJ0ZWQgdG8gYW4gSFRNTCB0YWJsZVxyXG52YXIgb2JqZWN0QXJyYXkgPSAnW3tcIlRvdGFsXCI6XCIzNFwiLFwiVmVyc2lvblwiOlwiMS4wLjRcIixcIk9mZmljZVwiOlwiTmV3IFlvcmtcIn0se1wiVG90YWxcIjpcIjY3XCIsXCJWZXJzaW9uXCI6XCIxLjEuMFwiLFwiT2ZmaWNlXCI6XCJQYXJpc1wifV0nO1xyXG52YXIgc3RyaW5nQXJyYXkgPSAnW1wiTmV3IFlvcmtcIixcIkJlcmxpblwiLFwiUGFyaXNcIixcIk1hcnJha2VjaFwiLFwiTW9zY293XCJdJztcclxudmFyIG5lc3RlZFRhYmxlID0gJ1t7IGtleTE6IFwidmFsMVwiLCBrZXkyOiBcInZhbDJcIiwga2V5MzogeyB0YWJsZUlkOiBcInRibElkTmVzdGVkMVwiLCB0YWJsZUNsYXNzTmFtZTogXCJjbHNOZXN0ZWRcIiwgbGlua1RleHQ6IFwiRG93bmxvYWRcIiwgZGF0YTogW3sgc3Via2V5MTogXCJzdWJ2YWwxXCIsIHN1YmtleTI6IFwic3VidmFsMlwiLCBzdWJrZXkzOiBcInN1YnZhbDNcIiB9XSB9IH1dJztcclxuXHJcbkNvZGUgc2FtcGxlIHRvIGNyZWF0ZSBhIEhUTUwgdGFibGUgSmF2YXNjcmlwdCBTdHJpbmdcclxudmFyIGpzb25IdG1sVGFibGUgPSBDb252ZXJ0SnNvblRvVGFibGUoZXZhbChkYXRhU3RyaW5nKSwgJ2pzb25UYWJsZScsIG51bGwsICdEb3dubG9hZCcpO1xyXG5cclxuQ29kZSBzYW1wbGUgZXhwbGFuZWRcclxuLSBldmFsIGlzIHVzZWQgdG8gcGFyc2UgYSBKU09OIGRhdGFTdHJpbmdcclxuLSB0YWJsZSBIVE1MIGlkIGF0dHJpYnV0ZSB3aWxsIGJlICdqc29uVGFibGUnXHJcbi0gdGFibGUgSFRNTCBjbGFzcyBhdHRyaWJ1dGUgd2lsbCBub3QgYmUgYWRkZWRcclxuLSAnRG93bmxvYWQnIHRleHQgd2lsbCBiZSBkaXNwbGF5ZWQgaW5zdGVhZCBvZiB0aGUgbGluayBpdHNlbGZcclxuXHJcbkBhdXRob3IgQWZzaGluIE1laHJhYmFuaSA8YWZzaGluIGRvdCBtZWggYXQgZ21haWwgZG90IGNvbT5cclxuXHJcbkBjbGFzcyBDb252ZXJ0SnNvblRvVGFibGVcclxuXHJcbkBtZXRob2QgQ29udmVydEpzb25Ub1RhYmxlXHJcblxyXG5AcGFyYW0gcGFyc2VkSnNvbiBvYmplY3QgUGFyc2VkIEpTT04gZGF0YVxyXG5AcGFyYW0gdGFibGVJZCBzdHJpbmcgT3B0aW9uYWwgdGFibGUgaWRcclxuQHBhcmFtIHRhYmxlQ2xhc3NOYW1lIHN0cmluZyBPcHRpb25hbCB0YWJsZSBjc3MgY2xhc3MgbmFtZVxyXG5AcGFyYW0gbGlua1RleHQgc3RyaW5nIE9wdGlvbmFsIHRleHQgcmVwbGFjZW1lbnQgZm9yIGxpbmsgcGF0dGVyblxyXG5cclxuQHJldHVybiBzdHJpbmcgQ29udmVydGVkIEpTT04gdG8gSFRNTCB0YWJsZVxyXG4jIyNcclxuY2xhc3MgSnNvblRvVGFibGUgXHJcbiAgXHJcbiAgdGFibGU6IG51bGxcclxuICBcclxuICBjb25zdHJ1Y3RvcjogKHBhcnNlZEpzb24sIHRhYmxlSWQsIHRhYmxlQ2xhc3NOYW1lLCBsaW5rVGV4dCkgLT5cclxuICAgICNQYXR0ZXJucyBmb3IgbGlua3MgYW5kIE5VTEwgdmFsdWVcclxuICAgIGl0YWxpYyA9IFwiPGk+ezB9PC9pPlwiXHJcbiAgICBsaW5rID0gKGlmIGxpbmtUZXh0IHRoZW4gXCI8YSBocmVmPVxcXCJ7MH1cXFwiPlwiICsgbGlua1RleHQgKyBcIjwvYT5cIiBlbHNlIFwiPGEgaHJlZj1cXFwiezB9XFxcIj57MH08L2E+XCIpXHJcbiAgXHJcbiAgICAjUGF0dGVybiBmb3IgdGFibGUgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgaWRNYXJrdXAgPSAoaWYgdGFibGVJZCB0aGVuIFwiIGlkPVxcXCJcIiArIHRhYmxlSWQgKyBcIlxcXCJcIiBlbHNlIFwiXCIpXHJcbiAgICBjbGFzc01hcmt1cCA9IChpZiB0YWJsZUNsYXNzTmFtZSB0aGVuIFwiIGNsYXNzPVxcXCJcIiArIHRhYmxlQ2xhc3NOYW1lICsgXCJcXFwiXCIgZWxzZSBcIlwiKVxyXG4gICAgdGJsID0gXCI8dGFibGUgYm9yZGVyPVxcXCIxXFxcIiBjZWxscGFkZGluZz1cXFwiMVxcXCIgY2VsbHNwYWNpbmc9XFxcIjFcXFwiXCIgKyBpZE1hcmt1cCArIGNsYXNzTWFya3VwICsgXCI+ezB9ezF9PC90YWJsZT5cIlxyXG4gIFxyXG4gICAgI1BhdHRlcm5zIGZvciB0YWJsZSBjb250ZW50XHJcbiAgICB0aCA9IFwiPHRoZWFkPnswfTwvdGhlYWQ+XCJcclxuICAgIHRiID0gXCI8dGJvZHk+ezB9PC90Ym9keT5cIlxyXG4gICAgdHIgPSBcIjx0cj57MH08L3RyPlwiXHJcbiAgICB0aFJvdyA9IFwiPHRoPnswfTwvdGg+XCJcclxuICAgIHRkUm93ID0gXCI8dGQ+ezB9PC90ZD5cIlxyXG4gICAgdGhDb24gPSBcIlwiXHJcbiAgICB0YkNvbiA9IFwiXCJcclxuICAgIHRyQ29uID0gXCJcIlxyXG4gICAgaWYgcGFyc2VkSnNvblxyXG4gICAgICBpc1N0cmluZ0FycmF5ID0gdHlwZW9mIChwYXJzZWRKc29uWzBdKSBpcyBcInN0cmluZ1wiXHJcbiAgICAgIGhlYWRlcnMgPSB1bmRlZmluZWRcclxuICAgIFxyXG4gICAgICAjIENyZWF0ZSB0YWJsZSBoZWFkZXJzIGZyb20gSlNPTiBkYXRhXHJcbiAgICAgICMgSWYgSlNPTiBkYXRhIGlzIGEgc2ltcGxlIHN0cmluZyBhcnJheSB3ZSBjcmVhdGUgYSBzaW5nbGUgdGFibGUgaGVhZGVyXHJcbiAgICAgIGlmIGlzU3RyaW5nQXJyYXlcclxuICAgICAgICB0aENvbiArPSB0aFJvdy5mb3JtYXQoXCJ2YWx1ZVwiKVxyXG4gICAgICBlbHNlXHJcbiAgICAgIFxyXG4gICAgICAgICMgSWYgSlNPTiBkYXRhIGlzIGFuIG9iamVjdCBhcnJheSwgaGVhZGVycyBhcmUgYXV0b21hdGljYWxseSBjb21wdXRlZFxyXG4gICAgICAgIGlmIHR5cGVvZiAocGFyc2VkSnNvblswXSkgaXMgXCJvYmplY3RcIlxyXG4gICAgICAgICAgaGVhZGVycyA9IGFycmF5X2tleXMocGFyc2VkSnNvblswXSlcclxuICAgICAgICAgIGkgPSAwXHJcbiAgICAgICAgICB3aGlsZSBpIDwgaGVhZGVycy5sZW5ndGhcclxuICAgICAgICAgICAgdGhDb24gKz0gdGhSb3cuZm9ybWF0KGhlYWRlcnNbaV0pXHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICB0aCA9IHRoLmZvcm1hdCh0ci5mb3JtYXQodGhDb24pKVxyXG4gICAgXHJcbiAgICAgICMgQ3JlYXRlIHRhYmxlIHJvd3MgZnJvbSBKc29uIGRhdGFcclxuICAgICAgaWYgaXNTdHJpbmdBcnJheVxyXG4gICAgICAgIGkgPSAwXHJcbiAgICAgICAgd2hpbGUgaSA8IHBhcnNlZEpzb24ubGVuZ3RoXHJcbiAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQocGFyc2VkSnNvbltpXSlcclxuICAgICAgICAgIHRyQ29uICs9IHRyLmZvcm1hdCh0YkNvbilcclxuICAgICAgICAgIHRiQ29uID0gXCJcIlxyXG4gICAgICAgICAgaSsrXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBpZiBoZWFkZXJzXHJcbiAgICAgICAgICB1cmxSZWdFeHAgPSBuZXcgUmVnRXhwKC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvZylcclxuICAgICAgICAgIGphdmFzY3JpcHRSZWdFeHAgPSBuZXcgUmVnRXhwKC8oXmphdmFzY3JpcHQ6W1xcc1xcU10qOyQpL2cpXHJcbiAgICAgICAgICBpID0gMFxyXG4gICAgICAgICAgd2hpbGUgaSA8IHBhcnNlZEpzb24ubGVuZ3RoXHJcbiAgICAgICAgICAgIGogPSAwXHJcbiAgICAgICAgICAgIHdoaWxlIGogPCBoZWFkZXJzLmxlbmd0aFxyXG4gICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VkSnNvbltpXVtoZWFkZXJzW2pdXVxyXG4gICAgICAgICAgICAgIGlzVXJsID0gdXJsUmVnRXhwLnRlc3QodmFsdWUpIG9yIGphdmFzY3JpcHRSZWdFeHAudGVzdCh2YWx1ZSlcclxuICAgICAgICAgICAgICBpZiBpc1VybCAjIElmIHZhbHVlIGlzIFVSTCB3ZSBhdXRvLWNyZWF0ZSBhIGxpbmtcclxuICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChsaW5rLmZvcm1hdCh2YWx1ZSkpXHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgaWYgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgaWYgdHlwZW9mICh2YWx1ZSkgaXMgXCJvYmplY3RcIlxyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAjZm9yIHN1cHBvcnRpbmcgbmVzdGVkIHRhYmxlc1xyXG4gICAgICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChDb252ZXJ0SnNvblRvVGFibGUoZXZhbCh2YWx1ZS5kYXRhKSwgdmFsdWUudGFibGVJZCwgdmFsdWUudGFibGVDbGFzc05hbWUsIHZhbHVlLmxpbmtUZXh0KSlcclxuICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdCh2YWx1ZSlcclxuICAgICAgICAgICAgICAgIGVsc2UgIyBJZiB2YWx1ZSA9PSBudWxsIHdlIGZvcm1hdCBpdCBsaWtlIFBocE15QWRtaW4gTlVMTCB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KGl0YWxpYy5mb3JtYXQodmFsdWUpLnRvVXBwZXJDYXNlKCkpXHJcbiAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgIHRyQ29uICs9IHRyLmZvcm1hdCh0YkNvbilcclxuICAgICAgICAgICAgdGJDb24gPSBcIlwiXHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICB0YiA9IHRiLmZvcm1hdCh0ckNvbilcclxuICAgICAgdGJsID0gdGJsLmZvcm1hdCh0aCwgdGIpXHJcbiAgICBAdGFibGUgPSB0YmxcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSnNvblRvVGFibGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5hcnJheTJEID0gKGluaXRMZW5ndGgsIGluaXRXaWR0aCkgLT5cclxuICBhcnJheSA9IFtdXHJcbiAgbWF4TGVuZ3RoID0gMFxyXG4gIG1heFdpZHRoID0gMFxyXG4gICAgXHJcbiAgcmV0ID0gXHJcbiAgICBnZXQ6IChyb3dObywgY29sTm8pIC0+XHJcbiAgICAgIGV4dGVuZCByb3dObywgY29sTm9cclxuICAgIHNldDogKHJvd05vLCBjb2xObywgdmFsKSAtPlxyXG4gICAgICByZXQuZ2V0IHJvd05vLCBjb2xOb1xyXG4gICAgICByb3dJZHggPSByb3dOby0xXHJcbiAgICAgIGNvbElkeCA9IGNvbE5vLTFcclxuICAgICAgYXJyYXlbcm93SWR4XVtjb2xJZHhdID0gdmFsXHJcbiAgICBlYWNoOiAoY2FsbEJhY2spIC0+XHJcbiAgICAgIF8uZWFjaCBhcnJheSwgKGNvbHVtbnMsIHJvdykgLT5cclxuICAgICAgICBfLmVhY2ggYXJyYXlbcm93XSwgKHZhbCwgY29sKSAtPlxyXG4gICAgICAgICAgcm93SWR4ID0gcm93KzFcclxuICAgICAgICAgIGNvbElkeCA9IGNvbCsxXHJcbiAgICAgICAgICBjYWxsQmFjayByb3dJZHgsIGNvbElkeCwgdmFsXHJcbiAgICB3aWR0aDogKCkgLT5cclxuICAgICAgbWF4V2lkdGhcclxuICAgIGxlbmd0aDogKCkgLT5cclxuICAgICAgbWF4TGVuZ3RoXHJcbiAgICAgICAgIFxyXG4gICMjI1xyXG4gIEd1YXJhbnRlZSB0aGF0IHRoZSBkaW1lbnNpb25zIG9mIHRoZSBhcnJheSBhcmUgYWx3YXlzIGJhY2tlZCBieSB2YWx1ZXMgYXQgZXZlcnkgcG9zaXRpb25cclxuICAjIyMgICAgICAgICAgICAgICAgICAgIFxyXG4gIGV4dGVuZCA9IChsZW5ndGgsIHdpZHRoKSAtPiAgXHJcbiAgICBpZiBub3QgbGVuZ3RoIG9yIGxlbmd0aCA8IDEgdGhlbiBsZW5ndGggPSAxXHJcbiAgICBpZiBub3Qgd2lkdGggb3Igd2lkdGggPCAxIHRoZW4gd2lkdGggPSAxXHJcbiAgICAgIFxyXG4gICAgaWYgbWF4TGVuZ3RoIDwgbGVuZ3RoIHRoZW4gbWF4TGVuZ3RoID0gbGVuZ3RoXHJcbiAgICBpZiBhcnJheS5sZW5ndGggPiBtYXhMZW5ndGggdGhlbiBtYXhMZW5ndGggPSBhcnJheS5sZW5ndGhcclxuICAgIGlmIG1heFdpZHRoIDwgd2lkdGggdGhlbiBtYXhXaWR0aCA9IHdpZHRoXHJcbiAgICBpID0gMFxyXG4gICAgICBcclxuICAgIHdoaWxlIGkgPCBtYXhMZW5ndGhcclxuICAgICAgdHJ5Um93ID0gYXJyYXlbaV1cclxuICAgICAgaWYgbm90IHRyeVJvd1xyXG4gICAgICAgIHRyeVJvdyA9IFtdXHJcbiAgICAgICAgYXJyYXkucHVzaCB0cnlSb3dcclxuICAgICAgaWYgbWF4V2lkdGggPCB0cnlSb3cubGVuZ3RoIHRoZW4gbWF4V2lkdGggPSB0cnlSb3cubGVuZ3RoXHJcbiAgICAgIGlmIHRyeVJvdy5sZW5ndGggPCBtYXhXaWR0aCB0aGVuIHRyeVJvdy5sZW5ndGggPSBtYXhXaWR0aFxyXG4gICAgICBpICs9IDFcclxuICAgICAgXHJcbiAgICBhcnJheVtsZW5ndGgtMV1bd2lkdGgtMV1cclxuICAgICAgIFxyXG4gIGV4dGVuZCBpbml0TGVuZ3RoLCBpbml0V2lkdGhcclxuICAgIFxyXG4gIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ2FycmF5MkQnLCBhcnJheTJEXHJcbm1vZHVsZS5leHBvcnRzID0gYXJyYXkyRCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbm1ldGhvZHMgPSBbXHJcbiAgJ2Fzc2VydCdcclxuICAnY2xlYXInXHJcbiAgJ2NvdW50J1xyXG4gICdkZWJ1ZydcclxuICAnZGlyJ1xyXG4gICdkaXJ4bWwnXHJcbiAgJ2Vycm9yJ1xyXG4gICdleGNlcHRpb24nXHJcbiAgJ2dyb3VwJ1xyXG4gICdncm91cENvbGxhcHNlZCdcclxuICAnZ3JvdXBFbmQnXHJcbiAgJ2luZm8nXHJcbiAgJ2xvZydcclxuICAnbWVtb3J5J1xyXG4gICdwcm9maWxlJ1xyXG4gICdwcm9maWxlRW5kJ1xyXG4gICd0YWJsZSdcclxuICAndGltZSdcclxuICAndGltZUVuZCdcclxuICAndGltZVN0YW1wJ1xyXG4gICd0aW1lbGluZSdcclxuICAndGltZWxpbmVFbmQnXHJcbiAgJ3RyYWNlJ1xyXG4gICd3YXJuJ1xyXG5dXHJcbm1ldGhvZExlbmd0aCA9IG1ldGhvZHMubGVuZ3RoXHJcbmNvbnNvbGUgPSBPSi5nbG9iYWwuY29uc29sZSBvciB7fVxyXG5PSi5tYWtlU3ViTmFtZVNwYWNlICdjb25zb2xlJ1xyXG4gIFxyXG4jIyNcclxuMS4gU3R1YiBvdXQgYW55IG1pc3NpbmcgbWV0aG9kcyB3aXRoIG5vb3BcclxuMi4gRGVmaW5lIHRoZSBhdmFpbGFibGUgbWV0aG9kcyBvbiB0aGUgT0ouY29uc29sZSBvYmplY3RcclxuIyMjXHJcbndoaWxlIG1ldGhvZExlbmd0aC0tXHJcbiAgKC0+XHJcbiAgICBtZXRob2QgPSBtZXRob2RzW21ldGhvZExlbmd0aF1cclxuICAgIFxyXG4gICAgIyBPbmx5IHN0dWIgdW5kZWZpbmVkIG1ldGhvZHMuXHJcbiAgICBjb25zb2xlW21ldGhvZF0gPSBPSi5ub29wIHVubGVzcyBjb25zb2xlW21ldGhvZF1cclxuICAgIFxyXG4gICAgI0RlZmluZSB0aGUgbWV0aG9kIG9uIHRoZSBPSiBjb25zb2xlIG5hbWVzcGFjZVxyXG4gICAgT0ouY29uc29sZS5yZWdpc3RlciBtZXRob2QsIChwYXJhbXMuLi4pIC0+XHJcbiAgICAgIGNvbnNvbGVbbWV0aG9kXSBwYXJhbXMuLi5cclxuICApKClcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY29uc29sZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiQgPSByZXF1aXJlICdqcXVlcnknXHJcbiAgXHJcbiMjI1xyXG5TZXR1cCBzZXR0aW5nc1xyXG4kLmNvb2tpZS5yYXcgPSB0cnVlXHJcbiQuY29va2llLmpzb24gPSB0cnVlXHJcbiAgXHJcblNldHVwIGRlZmF1bHRzXHJcbmh0dHBzOi8vZ2l0aHViLmNvbS9jYXJoYXJ0bC9qcXVlcnktY29va2llL1xyXG4kLmNvb2tpZS5kZWZhdWx0cy5leHBpcmVzID0gMzY1XHJcbiQuY29va2llLmRlZmF1bHRzLnBhdGggPSAnLydcclxuJC5jb29raWUuZGVmYXVsdHMuZG9tYWluID0gJ29qLmNvbSdcclxuIyMjXHJcbmlmIG5vdCAkIG9yIG5vdCAkLmNvb2tpZVxyXG4gIHRocm93IG5ldyBFcnJvciAnalF1ZXJ5IENvb2tpZSBpcyBhIHJlcXVpcmVkIGRlcGVuZGVuY3kuJyAgXHJcbiQuY29va2llLmRlZmF1bHRzLnNlY3VyZSA9IGZhbHNlXHJcbiAgXHJcbmNvb2tpZXMgPSB7fVxyXG4gIFxyXG5nZXQgPSAoY29va2llTmFtZSwgdHlwZSkgLT5cclxuICByZXQgPSAnJ1xyXG4gIGlmIGNvb2tpZU5hbWVcclxuICAgIGlmIHR5cGVcclxuICAgICAgcmV0ID0gJC5jb29raWUgY29va2llTmFtZSwgdHlwZVxyXG4gICAgZWxzZVxyXG4gICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lICAgIFxyXG4gICAgaWYgcmV0XHJcbiAgICAgIGNvb2tpZXNbY29va2llTmFtZV0gPSByZXRcclxuICBcclxuYWxsID0gLT5cclxuICByZXQgPSAkLmNvb2tpZSgpXHJcbiAgcmV0XHJcbiAgICBcclxuc2V0ID0gKGNvb2tpZU5hbWUsIHZhbHVlLCBvcHRzKSAtPlxyXG4gIHJldCA9ICcnXHJcbiAgaWYgY29va2llTmFtZVxyXG4gICAgY29va2llc1tjb29raWVOYW1lXSA9IHZhbHVlXHJcbiAgICBpZiBvcHRzXHJcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHZhbHVlLCBvcHRzXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHZhbHVlXHJcbiAgcmV0ICBcclxuICBcclxuZGVsID0gKGNvb2tpZU5hbWUsIG9wdHMpIC0+XHJcbiAgaWYgY29va2llTmFtZVxyXG4gICAgaWYgb3B0c1xyXG4gICAgICAkLnJlbW92ZUNvb2tpZSBjb29raWVOYW1lLCBvcHRzXHJcbiAgICBlbHNlXHJcbiAgICAgICQucmVtb3ZlQ29va2llIGNvb2tpZU5hbWUgICAgXHJcbiAgICBkZWxldGUgY29va2llc1tjb29raWVOYW1lXVxyXG4gIHJldHVyblxyXG4gICAgXHJcbmRlbGV0ZUFsbCA9IC0+XHJcbiAgY29va2llcyA9IHt9XHJcbiAgT0ouZWFjaCBPSi5jb29raWUuYWxsLCAodmFsLCBrZXkpIC0+XHJcbiAgICBPSi5jb29raWUuZGVsZXRlIGtleSAgXHJcbiAgcmV0dXJuXHJcbiAgICBcclxuIE9KLmNvb2tpZS5yZWdpc3RlciAnZGVsZXRlQWxsJywgZGVsZXRlQWxsXHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2RlbGV0ZScsIGRlbFxyXG4gT0ouY29va2llLnJlZ2lzdGVyICdzZXQnLCBzZXRcclxuIE9KLmNvb2tpZS5yZWdpc3RlciAnZ2V0JywgZ2V0XHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2FsbCcsICBhbGxcclxuIFxyXG4gbW9kdWxlLmV4cG9ydHMgPSBcclxuICBkZWxldGVBbGw6IGRlbGV0ZUFsbFxyXG4gIGRlbGV0ZTogZGVsXHJcbiAgc2V0OiBzZXRcclxuICBnZXQ6IGdldFxyXG4gIGFsbDogIGFsbCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmRlZmVyID0gKG1ldGhvZCwgd2FpdE1zKSAtPlxyXG4gIGlmIHNldFRpbWVvdXRcclxuICAgIHJldHVybiBzZXRUaW1lb3V0IG1ldGhvZCwgd2FpdE1zXHJcbiAgXHJcbk9KLnJlZ2lzdGVyICdkZWZlcicsIGRlZmVyXHJcbm1vZHVsZS5leHBvcnRzID0gZGVmZXIiLCIjICMgZWFjaFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMgIyMgY2FuRWFjaFxyXG5jYW5FYWNoID0gKG9iaikgLT5cclxuICAjIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgW2lzXShpcy5odG1sKSB0cnVseSBpdGVyYWJsZSAoZS5nLiBhbiBpbnN0YW5jZSBvZiBPYmplY3Qgb3IgQXJyYXkpXHJcbiAgT0ouaXMucGxhaW5PYmplY3Qob2JqKSBvciBPSi5pcy5vYmplY3Qob2JqKSBvciBPSi5pcy5hcnJheSBvYmpcclxuXHJcbiMgIyMgW09KXShvai5odG1sKS5lYWNoXHJcblxyXG4jIEl0ZXJhdGUgYWxsIG9mIHRoZSBtZW1iZXJzIG9mIGFuIG9iamVjdCAob3IgYW4gYXJyYXkpIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYW5kIHJlY3Vyc2lvbi5cclxuXHJcbiMgLSBgb2JqYDogdGhlIG9iamVjdCB0byBpdGVyYXRlLFxyXG4jIC0gYG9uRWFjaGA6IGEgY2FsbGJhY2sgdG8gZXhlY3V0ZSBmb3IgZWFjaCBpdGVyYXRpb24sXHJcbiMgLSBgcmVjdXJzaXZlYDogaWYgdHJ1ZSwgcmVjdXJzaXZlbHkgaXRlcmF0ZSBhbGwgdmFsaWQgY2hpbGQgb2JqZWN0cy5cclxuZWFjaCA9IChvYmosIG9uRWFjaCwgcmVjdXJzaXZlKSAtPlxyXG4gIGlmIGNhbkVhY2ggb2JqXHJcbiAgICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI2Zvcm93bikncyBgZm9yT3duYCBtZXRob2QgdG8gZW5zdXJlIHRoYXQgb25seSB0aGUgYWN0dWFsIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdCBhcmUgZW51bWVyYXRlZC5cclxuXHJcbiAgICAjIC0gYG9uRWFjaGAgY2FsbGJhY2sgd2lsbCByZWNlaXZlIDIgcGFyYW1ldGVyczpcclxuICAgICMgLSBgdmFsYCBhbmQgYGtleWAuXHJcbiAgICAjIC0gYHZhbGAgaXMgYWx3YXlzIHRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuXHJcbiAgICAjIC0gYGtleWAgaXMgZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBvciB0aGUgY3VycmVudCBpbmRleCBvZiB0aGUgYXJyYXkuXHJcbiAgICBfLmZvck93biBvYmosICh2YWwsIGtleSkgLT5cclxuICAgICAgaWYgb25FYWNoIGFuZCAodmFsIG9yIGtleSlcclxuICAgICAgICBxdWl0ID0gb25FYWNoIHZhbCwga2V5XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlICBpZiBmYWxzZSBpcyBxdWl0XHJcbiAgICAgIGVhY2ggdmFsLCBvbkVhY2gsIHRydWUgIGlmIHRydWUgaXMgcmVjdXJzaXZlXHJcbiAgICAgIHJldHVyblxyXG5cclxuICByZXR1cm5cclxuXHJcbiMgIyMgcmVnaXN0ZXJcclxuXHJcbiMgcmVnaXN0ZXIgdGhlIGBlYWNoYCBtZXRob2Qgb24gdGhlIFtPSl0oT0ouaHRtbCkgbmFtZXNwYWNlXHJcbk9KLnJlZ2lzdGVyICdlYWNoJywgZWFjaFxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhY2giLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG51bmtub3duID0gJ3Vua25vd24nICAgXHJcbiAgXHJcbmlucHV0VHlwZXMgPVxyXG4gIGJ1dHRvbjogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAwXHJcbiAgICBuYW1lOiAnYnV0dG9uJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBjaGVja2JveDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxXHJcbiAgICBuYW1lOiAnY2hlY2tib3gnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgY29sb3I6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMlxyXG4gICAgbmFtZTogJ2NvbG9yJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGRhdGU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogM1xyXG4gICAgbmFtZTogJ2RhdGUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBkYXRldGltZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA0XHJcbiAgICBuYW1lOiAnZGF0ZXRpbWUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgJ2RhdGV0aW1lLWxvY2FsJzogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA1XHJcbiAgICBuYW1lOiAnZGF0ZXRpbWUtbG9jYWwnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBlbWFpbDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA2XHJcbiAgICBuYW1lOiAnZW1haWwnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGZpbGU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogN1xyXG4gICAgbmFtZTogJ2ZpbGUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogZmFsc2VcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBoaWRkZW46ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogOFxyXG4gICAgbmFtZTogJ2hpZGRlbidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgaW1hZ2U6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogOVxyXG4gICAgbmFtZTogJ2ltYWdlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBtb250aDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxMFxyXG4gICAgbmFtZTogJ21vbnRoJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBudW1iZXI6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTFcclxuICAgIG5hbWU6ICdudW1iZXInXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcGFzc3dvcmQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTJcclxuICAgIG5hbWU6ICdwYXNzd29yZCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHJhZGlvOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDEzXHJcbiAgICBuYW1lOiAncmFkaW8nXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcmFuZ2U6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTRcclxuICAgIG5hbWU6ICdyYW5nZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICByZXNldDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxNVxyXG4gICAgbmFtZTogJ3Jlc2V0J1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBzZWFyY2g6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTZcclxuICAgIG5hbWU6ICdzZWFyY2gnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBzdWJtaXQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTdcclxuICAgIG5hbWU6ICdzdWJtaXQnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHRlbDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxOFxyXG4gICAgbmFtZTogJ2J1dHRvbidcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHRleHQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTlcclxuICAgIG5hbWU6ICd0ZXh0J1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB0aW1lOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDIwXHJcbiAgICBuYW1lOiAndGltZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHVybDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMVxyXG4gICAgbmFtZTogJ3VybCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgd2VlazogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMlxyXG4gICAgbmFtZTogJ3dlZWsnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG5PSi5lbnVtcy5yZWdpc3RlciAndW5rbm93bicsIHVua25vd25cclxuT0ouZW51bXMucmVnaXN0ZXIgJ2lucHV0VHlwZXMnLCBpbnB1dFR5cGVzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFxyXG4gIHVua25vd246IHVua25vd25cclxuICBpbnB1dFR5cGVzOiBpbnB1dFR5cGVzIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuaWYgT0ouVFJBQ0tfT05fRVJST1JcclxuICBvbkVycm9yID0gT0ouZ2xvYmFsLm9uZXJyb3JcclxuXHJcbiAgIyMjXHJcbiAgTG9nIGVycm9ycyB0byB0aGUgY29uc29sZVxyXG4gICMjI1xyXG4gIE9KLmdsb2JhbC5vbmVycm9yID0gKG1zZywgdXJsLCBsaW5lTnVtYmVyKSAtPlxyXG4gICAgcmV0ID0gZmFsc2VcclxuICAgIE9KLmNvbnNvbGUud2FybiBcIiVzXFxyIHVybDogJXNcXHIgbGluZTogJWRcIiwgbXNnLCB1cmwsIGxpbmVOdW1iZXJcclxuICAgIHJldCA9IG9uRXJyb3IgbXNnLCB1cmwsIGxpbmVOdW1iZXIgaWYgb25FcnJvclxyXG4gICAgcmV0ICN0cnVlIG1lYW5zIGRvbid0IHByb3BhZ2F0ZSB0aGUgZXJyb3IgIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbmlmIE9KLmdsb2JhbC5hZGRFdmVudExpc3RlbmVyXHJcbiAgZXZlbnROYW1lID0gJ2FkZEV2ZW50TGlzdGVuZXInXHJcbiAgZXZlbnRJbmZvID0gJydcclxuZWxzZSBcclxuICBldmVudE5hbWUgPSAnYXR0YWNoRXZlbnQnXHJcbiAgZXZlbnRJbmZvID0gJ29uJ1xyXG4gIFxyXG5wdXNoU3RhdGUgPSAocGFnZU5hbWUsIGV2ZW50KSAtPlxyXG4gIGlmIHBhZ2VOYW1lXHJcbiAgICAjIGtlZXAgdGhlIGxpbmsgaW4gdGhlIGJyb3dzZXIgaGlzdG9yeVxyXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUgbnVsbCwgbnVsbCwgJyMnICsgcGFnZU5hbWVcclxuICAgICAgXHJcbiAgICAjIGhlcmUgY2FuIGNhdXNlIGRhdGEgbG9hZGluZywgZXRjLlxyXG4gICAgXHJcbiAgICBpZiBldmVudCAgICBcclxuICAgICAgIyBkbyBub3QgZ2l2ZSBhIGRlZmF1bHQgYWN0aW9uXHJcbiAgICAgIGlmIGV2ZW50LnByZXZlbnREZWZhdWx0XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZVxyXG4gIGZhbHNlXHJcbiAgXHJcbnJlc3RvcmVTdGF0ZSA9IChsb2NhdGlvbikgLT5cclxuICBwYWdlTmFtZSA9IGxvY2F0aW9uLmhhc2hcclxuICBpZiBub3QgcGFnZU5hbWVcclxuICAgIHBhZ2VOYW1lID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzFdXHJcbiAgaWYgcGFnZU5hbWVcclxuICAgIHBhZ2VOYW1lID0gcGFnZU5hbWUucmVwbGFjZSAnIycsICcnXHJcbiAgICBPSi5wdWJsaXNoICdyZXN0b3JlU3RhdGUnLCBwYWdlTmFtZTogcGFnZU5hbWUsIGxvY2F0aW9uOiBsb2NhdGlvblxyXG4gIHJldHVyblxyXG4gIFxyXG4jIyMgXHJcbmhhbmcgb24gdGhlIGV2ZW50LCBhbGwgcmVmZXJlbmNlcyBpbiB0aGlzIGRvY3VtZW50XHJcbiMjI1xyXG4gIFxyXG4jIyNcclxuIyBUaGlzIGJpbmRzIHRvIHRoZSBkb2N1bWVudCBjbGljayBldmVudCwgd2hpY2ggaW4gdHVybiBhdHRhY2hlcyB0byBldmVyeSBjbGljayBldmVudCwgY2F1c2luZyB1bmV4cGVjdGVkIGJlaGF2aW9yLlxyXG4jIEZvciBhbnkgY29udHJvbCB3aGljaCB3aXNoZXMgdG8gdHJpZ2dlciBhIHN0YXRlIGNoYW5nZSBpbiByZXNwb25zZSB0byBhbiBldmVudCwgaXQgaXMgYmV0dGVyIGZvciB0aGF0IGNvbnRyb2wgdG8gZGVmaW5lIHRoZSBiZWhhdmlvci5cclxuT0ouZG9jdW1lbnRbZXZlbnROYW1lXSBldmVudEluZm8gKyAnY2xpY2snLCAoKGV2ZW50KSAtPlxyXG4gIGV2ZW50ID0gZXZlbnQgb3Igd2luZG93LmV2ZW50XHJcbiAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IG9yIGV2ZW50LnNyY0VsZW1lbnRcclxuICAgIFxyXG4gICMgbG9va2luZyBmb3IgYWxsIHRoZSBsaW5rcyB3aXRoICdhamF4JyBjbGFzcyBmb3VuZFxyXG4gIGlmIHRhcmdldCBhbmQgdGFyZ2V0Lm5vZGVOYW1lIGlzICdBJyBhbmQgKCcgJyArIHRhcmdldC5jbGFzc05hbWUgKyAnICcpLmluZGV4T2YoJ2FqYXgnKSA+PSAwXHJcbiAgICBPSi5wdXNoU3RhdGUgdGFyZ2V0LmhyZWYsIGV2ZW50XHJcbiAgICAgIFxyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4pLCBmYWxzZVxyXG4jIyNcclxuXHJcbiMjI1xyXG5oYW5nIG9uIHBvcHN0YXRlIGV2ZW50IHRyaWdnZXJlZCBieSBwcmVzc2luZyBiYWNrL2ZvcndhcmQgaW4gYnJvd3NlclxyXG4jIyNcclxuT0ouZ2xvYmFsW2V2ZW50TmFtZV0gZXZlbnRJbmZvICsgJ3BvcHN0YXRlJywgKChldmVudCkgLT5cclxuICAgIFxyXG4gICMgd2UgZ2V0IGEgbm9ybWFsIExvY2F0aW9uIG9iamVjdFxyXG4gICAgXHJcbiAgIyMjXHJcbiAgTm90ZSwgdGhpcyBpcyB0aGUgb25seSBkaWZmZXJlbmNlIHdoZW4gdXNpbmcgdGhpcyBsaWJyYXJ5LFxyXG4gIGJlY2F1c2UgdGhlIG9iamVjdCBkb2N1bWVudC5sb2NhdGlvbiBjYW5ub3QgYmUgb3ZlcnJpZGVuLFxyXG4gIHNvIGxpYnJhcnkgdGhlIHJldHVybnMgZ2VuZXJhdGVkICdsb2NhdGlvbicgb2JqZWN0IHdpdGhpblxyXG4gIGFuIG9iamVjdCB3aW5kb3cuaGlzdG9yeSwgc28gZ2V0IGl0IG91dCBvZiAnaGlzdG9yeS5sb2NhdGlvbicuXHJcbiAgRm9yIGJyb3dzZXJzIHN1cHBvcnRpbmcgJ2hpc3RvcnkucHVzaFN0YXRlJyBnZXQgZ2VuZXJhdGVkXHJcbiAgb2JqZWN0ICdsb2NhdGlvbicgd2l0aCB0aGUgdXN1YWwgJ2RvY3VtZW50LmxvY2F0aW9uJy5cclxuICAjIyMgICAgICAgICAgICAgICAgICAgICBcclxuICByZXR1cm5Mb2NhdGlvbiA9IGhpc3RvcnkubG9jYXRpb24gb3IgZG9jdW1lbnQubG9jYXRpb25cclxuICAgIFxyXG4gICMjI1xyXG4gIGhlcmUgY2FuIGNhdXNlIGRhdGEgbG9hZGluZywgZXRjLlxyXG4gICMjI1xyXG4gIE9KLmhpc3RvcnkucmVzdG9yZVN0YXRlIHJldHVybkxvY2F0aW9uXHJcbiAgICBcclxuICByZXR1cm5cclxuKSwgZmFsc2UgXHJcbiAgXHJcbiBcclxuT0ouaGlzdG9yeS5yZWdpc3RlciAncmVzdG9yZVN0YXRlJywgcmVzdG9yZVN0YXRlXHJcbk9KLmhpc3RvcnkucmVnaXN0ZXIgJ3B1c2hTdGF0ZScsIHB1c2hTdGF0ZVxyXG4gXHJcbm1vZHVsZS5leHBvcnRzID0gXHJcbiAgcmVzdG9yZVN0YXRlOiByZXN0b3JlU3RhdGVcclxuICBwdXNoU3RhdGU6IHB1c2hTdGF0ZVxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cbmVhY2ggPSByZXF1aXJlICcuL2VhY2gnXG5cbmlzTWV0aG9kID0ge31cblxuaXNNZXRob2QuYm9vbCA9IChib29sZWFuKSAtPlxuICBfLmlzQm9vbGVhbiBib29sZWFuXG5cbmlzTWV0aG9kLmFycmF5TnVsbE9yRW1wdHkgPSAoYXJyKSAtPlxuICBfLmlzRW1wdHkgYXJyXG5cbmlzTWV0aG9kLnN0cmluZ051bGxPckVtcHR5ID0gKHN0cikgLT5cbiAgc3RyIGFuZCAobm90IHN0ci5sZW5ndGggb3Igc3RyLmxlbmd0aCBpcyAwIG9yIG5vdCBzdHIudHJpbSBvciBub3Qgc3RyLnRyaW0oKSlcblxuaXNNZXRob2QubnVtYmVyTnVsbE9yRW1wdHkgPSAobnVtKSAtPlxuICBub3QgbnVtIG9yIGlzTmFOKG51bSkgb3Igbm90IG51bS50b1ByZWNpc2lvblxuXG5pc01ldGhvZC5kYXRlTnVsbE9yRW1wdHkgPSAoZHQpIC0+XG4gIG5vdCBkdCBvciBub3QgZHQuZ2V0VGltZVxuXG5pc01ldGhvZC5vYmplY3ROdWxsT3JFbXB0eSA9IChvYmopIC0+XG4gIF8uaXNFbXB0eSBvYmogb3Igbm90IE9iamVjdC5rZXlzKG9iaikgb3IgT2JqZWN0LmtleXMob2JqKS5sZW5ndGggaXMgMFxuXG5pc01ldGhvZC5wbGFpbk9iamVjdCA9IChvYmopIC0+XG4gIF8uaXNQbGFpbk9iamVjdCBvYmpcblxuaXNNZXRob2Qub2JqZWN0ID0gKG9iaikgLT5cbiAgXy5pc09iamVjdCBvYmpcblxuaXNNZXRob2QuZGF0ZSA9IChkdCkgLT5cbiAgXy5pc0RhdGUgZHRcblxuXG4jIyNcbkRldGVybWluZXMgaWYgYSB2YWx1ZSBpcyBhbiBpbnN0YW5jZSBvZiBhIE51bWJlciBhbmQgbm90IE5hTipcbiMjI1xuaXNNZXRob2QubnVtYmVyID0gKG51bSkgLT5cbiAgbnVtYmVyID0gcmVxdWlyZSAnLi4vY29yZS9udW1iZXInXG4gIHR5cGVvZiBudW0gaXMgJ251bWJlcicgYW5kIGZhbHNlIGlzIChudW1iZXIuaXNOYU4obnVtKSBvciBmYWxzZSBpcyBudW1iZXIuaXNGaW5pdGUobnVtKSBvciBudW1iZXIuTUFYX1ZBTFVFIGlzIG51bSBvciBudW1iZXIuTUlOX1ZBTFVFIGlzIG51bSlcblxuIyMjXG5EZXRlcm1pbmVzIGlmIGEgdmFsdWUgaXMgY29udmVydGlibGUgdG8gYSBOdW1iZXJcbiMjI1xuaXNNZXRob2QubnVtZXJpYyA9IChudW0pIC0+XG4gIHJldCA9IGlzTWV0aG9kLm51bWJlcihudW0pXG4gIHVubGVzcyByZXRcbiAgICB0byA9IHJlcXVpcmUgJy4vdG8nXG4gICAgbnVOdW0gPSB0by5udW1iZXIobnVtKVxuICAgIHJldCA9IGlzTWV0aG9kLm51bWJlcihudU51bSlcbiAgcmV0XG5cbmlzTWV0aG9kLnZlbmRvck9iamVjdCA9IChvYmopIC0+XG4gIHJldCA9IChvYmogaW5zdGFuY2VvZiBPSlsnPyddKVxuICByZXRcblxuaXNNZXRob2QuZWxlbWVudEluRG9tID0gKGVsZW1lbnRJZCkgLT5cbiAgZmFsc2UgaXMgaXNNZXRob2QubnVsbE9yRW1wdHkoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKSlcblxuaXNNZXRob2QuYXJyYXkgPSAob2JqKSAtPlxuICBfLmlzQXJyYXkgb2JqXG5cbmlzTWV0aG9kLnN0cmluZyA9IChzdHIpIC0+XG4gIF8uaXNTdHJpbmcgc3RyXG5cbmlzTWV0aG9kLnRydWUgPSAob2JqKSAtPlxuICBvYmogaXMgdHJ1ZSBvciBvYmogaXMgJ3RydWUnIG9yIG9iaiBpcyAxIG9yIG9iaiBpcyAnMSdcblxuaXNNZXRob2QuZmFsc2UgPSAob2JqKSAtPlxuICBvYmogaXMgZmFsc2Ugb3Igb2JqIGlzICdmYWxzZScgb3Igb2JqIGlzIDAgb3Igb2JqIGlzICcwJ1xuXG5pc01ldGhvZC50cnVlT3JGYWxzZSA9IChvYmopIC0+XG4gIGlzTWV0aG9kLnRydWUgb2JqIG9yIGlzTWV0aG9kLmZhbHNlIG9ialxuXG5pc01ldGhvZC5udWxsT3JFbXB0eSA9IChvYmosIGNoZWNrTGVuZ3RoKSAtPlxuICBfLmlzRW1wdHkob2JqKSBvciBfLmlzVW5kZWZpbmVkKG9iaikgb3IgXy5pc051bGwob2JqKSBvciBfLmlzTmFOKG9iailcblxuaXNNZXRob2QubnVsbE9yVW5kZWZpbmVkID0gKG9iaiwgY2hlY2tMZW5ndGgpIC0+XG4gIF8uaXNVbmRlZmluZWQob2JqKSBvciBfLmlzTnVsbChvYmopIG9yIF8uaXNOYU4ob2JqKVxuXG5pc01ldGhvZC5pbnN0YW5jZW9mID0gKG5hbWUsIG9iaikgLT5cbiAgb2JqLnR5cGUgaXMgbmFtZSBvciBvYmogaW5zdGFuY2VvZiBuYW1lXG5cbmlzTWV0aG9kLm1ldGhvZCA9IChvYmopIC0+XG4gIG9iaiBpc250IE9KLm5vb3AgYW5kIF8uaXNGdW5jdGlvbiBvYmpcblxuIyMjXG5EZXByZWNhdGVkLiBMZWZ0IGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eS4gVXNlIGlzLm1ldGhvZCBpbnN0ZWFkLlxuIyMjXG5pc01ldGhvZC5mdW5jID0gaXNNZXRob2QubWV0aG9kXG5cbk9iamVjdC5zZWFsIGlzTWV0aG9kXG5PYmplY3QuZnJlZXplIGlzTWV0aG9kXG5cbk9KLnJlZ2lzdGVyICdpcycsIGlzTWV0aG9kXG5tb2R1bGUuZXhwb3J0cyA9IGlzTWV0aG9kXG5cbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vdHkgPSByZXF1aXJlICdub3R5J1xyXG5cclxuICBcclxubWFrZU5vdHkgPSAob3B0aW9ucywgb3duZXIpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgbGF5b3V0OiAndG9wUmlnaHQnXHJcbiAgICB0aGVtZTogJ2RlZmF1bHRUaGVtZSdcclxuICAgIHR5cGU6ICdhbGVydCdcclxuICAgIHRleHQ6ICcnICNjYW4gYmUgaHRtbCBvciBzdHJpbmdcclxuICAgIGRpc21pc3NRdWV1ZTogdHJ1ZSAjSWYgeW91IHdhbnQgdG8gdXNlIHF1ZXVlIGZlYXR1cmUgc2V0IHRoaXMgdHJ1ZVxyXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwibm90eV9tZXNzYWdlXCI+PHNwYW4gY2xhc3M9XCJub3R5X3RleHRcIj48L3NwYW4+PGRpdiBjbGFzcz1cIm5vdHlfY2xvc2VcIj48L2Rpdj48L2Rpdj4nLFxyXG4gICAgYW5pbWF0aW9uOiBcclxuICAgICAgICBvcGVuOiBcclxuICAgICAgICAgIGhlaWdodDogJ3RvZ2dsZSdcclxuICAgICAgICBjbG9zZTogXHJcbiAgICAgICAgICBoZWlnaHQ6ICd0b2dnbGUnXHJcbiAgICAgICAgZWFzaW5nOiAnc3dpbmcnXHJcbiAgICAgICAgc3BlZWQ6IDUwMCAjb3BlbmluZyAmIGNsb3NpbmcgYW5pbWF0aW9uIHNwZWVkXHJcbiAgICB0aW1lb3V0OiA1MDAwICNkZWxheSBmb3IgY2xvc2luZyBldmVudC4gU2V0IGZhbHNlIGZvciBzdGlja3kgbm90aWZpY2F0aW9uc1xyXG4gICAgZm9yY2U6IGZhbHNlICNhZGRzIG5vdGlmaWNhdGlvbiB0byB0aGUgYmVnaW5uaW5nIG9mIHF1ZXVlIHdoZW4gc2V0IHRvIHRydWVcclxuICAgIG1vZGFsOiBmYWxzZVxyXG4gICAgbWF4VmlzaWJsZTogNSAjeW91IGNhbiBzZXQgbWF4IHZpc2libGUgbm90aWZpY2F0aW9uIGZvciBkaXNtaXNzUXVldWUgdHJ1ZSBvcHRpb24sXHJcbiAgICBraWxsZXI6IGZhbHNlICNmb3IgY2xvc2UgYWxsIG5vdGlmaWNhdGlvbnMgYmVmb3JlIHNob3dcclxuICAgIGNsb3NlV2l0aDogWydjbGljayddICAjWydjbGljaycsICdidXR0b24nLCAnaG92ZXInXVxyXG4gICAgY2FsbGJhY2s6IFxyXG4gICAgICAgIG9uU2hvdzogT0oubm9vcCxcclxuICAgICAgICBhZnRlclNob3c6IE9KLm5vb3BcclxuICAgICAgICBvbkNsb3NlOiBPSi5ub29wXHJcbiAgICAgICAgYWZ0ZXJDbG9zZTogT0oubm9vcFxyXG4gICAgYnV0dG9uczogZmFsc2UgI2FuIGFycmF5IG9mIGJ1dHRvbnNcclxuICAgIFxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vdHkgZGVmYXVsdHNcclxuICAgICAgXHJcbiAgcmV0XHJcbiAgICBcclxuT0oubm90aWZpY2F0aW9ucy5yZWdpc3RlciAnbm90eScsIG1ha2VOb3R5XHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZU5vdHkiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuUHViU3ViID0gcmVxdWlyZSAncHVic3ViLWpzJ1xuXG50b2tlbnMgPSB7fVxuc3Vic2NyaWJlcnMgPSBbXVxuZXZlbnRzID0ge31cblxucHMgPSBcbiAgZ2V0RXZlbnROYW1lOiAoZXZlbnQpIC0+XG4gICAgZXZlbnQudG9VcHBlckNhc2UoKS5yZXBsYWNlICcgJywgJ18nXG5cbiAgc3Vic2NyaWJlOiAoZXZlbnQsIG1ldGhvZCkgLT5cbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUgZXZlbnRcbiAgICBpZiBub3QgZXZlbnRzW2V2ZW50TmFtZV0gdGhlbiBldmVudHNbZXZlbnROYW1lXSA9IFtdXG5cbiAgICB0b2tlbiA9IFB1YlN1Yi5zdWJzY3JpYmUgZXZlbnROYW1lLCBtZXRob2RcbiAgICB0b2tlbnNbdG9rZW5dID0gdG9rZW5cbiAgICBzdWJzY3JpYmVycy5wdXNoIG1ldGhvZFxuICAgIGV2ZW50c1tldmVudE5hbWVdLnB1c2ggbWV0aG9kXG4gICAgdG9rZW5cblxuICBwdWJsaXNoOiAoZXZlbnQsIGRhdGEpIC0+XG4gICAgZXZlbnROYW1lID0gcHMuZ2V0RXZlbnROYW1lIGV2ZW50XG4gICAgaWYgZXZlbnRzW2V2ZW50TmFtZV1cbiAgICAgIFB1YlN1Yi5wdWJsaXNoIGV2ZW50TmFtZSwgZGF0YVxuICAgIGVsc2VcbiAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbmFtZWQgeycgKyBldmVudCArICd9IGlzIG5vdCByZWNvZ25pemVkLidcbiAgICByZXR1cm5cblxuICB1bnN1YnNjcmliZTogKHRva2VuT3JNZXRob2QpIC0+XG4gICAgaWYgT0ouaXMubWV0aG9kIHRva2VuT3JNZXRob2RcbiAgICAgIGlmIC0xIGlzbnQgc3Vic2NyaWJlcnMuaW5kZXhPZiB0b2tlbk9yTWV0aG9kXG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSB0b2tlbk9yTWV0aG9kXG4gICAgICAgIHN1YnNjcmliZXJzID0gXy5yZW1vdmUgc3Vic2NyaWJlcnMsIChtZXRob2QpIC0+IG1ldGhvZCBpcyB0b2tlbk9yTWV0aG9kXG4gICAgICBlbHNlXG4gICAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbWV0aG9kIGlzIG5vdCByZWNvZ25pemVkLidcbiAgICBlbHNlXG4gICAgICBpZiB0b2tlbnNbdG9rZW5Pck1ldGhvZF1cbiAgICAgICAgUHViU3ViLnVuc3Vic2NyaWJlIHRva2VuT3JNZXRob2RcbiAgICAgICAgZGVsZXRlIHRva2Vuc1t0b2tlbk9yTWV0aG9kXVxuICAgIHJldHVyblxuXG4gIHVuc3Vic2NyaWJlQWxsOiAoKSAtPlxuICAgIE9KLmVhY2ggdG9rZW5zLCAodG9rZW4pIC0+IHVuc3Vic2NyaWJlIHRva2VuXG4gICAgc3Vic2NyaWJlcnMgPSBbXVxuICAgIGV2ZW50cyA9IHt9XG4gICAgcmV0dXJuXG5cbiAgdW5zdWJzY3JpYmVFdmVudDogKGV2ZW50KSAtPlxuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZSBldmVudFxuICAgIGlmIGV2ZW50c1tldmVudE5hbWVdXG4gICAgICBPSi5lYWNoIGV2ZW50c1tldmVudE5hbWVdLCAobWV0aG9kKSAtPiB1bnN1YnNjcmliZSBtZXRob2RcbiAgICBlbHNlXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0V2ZW50IG5hbWVkIHsnICsgZXZlbnQgKyAnfSBpcyBub3QgcmVjb2duaXplZC4nXG4gICAgZGVsZXRlIGV2ZW50c1tldmVudE5hbWVdXG4gICAgcmV0dXJuXG5cbk9iamVjdC5zZWFsIHBzXG5PYmplY3QuZnJlZXplIHBzXG5cbk9KLnJlZ2lzdGVyICdnZXRFdmVudE5hbWUnLCBwcy5nZXRFdmVudE5hbWVcbk9KLnJlZ2lzdGVyICdwdWJsaXNoJywgcHMucHVibGlzaFxuT0oucmVnaXN0ZXIgJ3N1YnNjcmliZScsIHBzLnN1YnNjcmliZVxuT0oucmVnaXN0ZXIgJ3Vuc3Vic2NyaWJlJywgcHMudW5zdWJzY3JpYmVcbk9KLnJlZ2lzdGVyICd1bnN1YnNjcmliZUFsbCcsIHBzLnVuc3Vic2NyaWJlQWxsXG5PSi5yZWdpc3RlciAndW5zdWJzY3JpYmVFdmVudCcsIHBzLnVuc3Vic2NyaWJlRXZlbnRcblxubW9kdWxlLmV4cG9ydHMgPSBwcyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbiMjI1xyXG5odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkwMTExNS9ob3ctY2FuLWktZ2V0LXF1ZXJ5LXN0cmluZy12YWx1ZXMtaW4tamF2YXNjcmlwdFxyXG4jIyNcclxucXVlcnlTdHJpbmcgPSAocGFyYW0pIC0+XHJcbiAgcmV0ID0ge31cclxuICAgIFxyXG4gIGlmIE9KLmdsb2JhbC5sb2NhdGlvblxyXG4gICAgcGFyYW1zID0gIE9KLmdsb2JhbC5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpLnNwbGl0ICcmJ1xyXG4gICAgaWYgcGFyYW1zXHJcbiAgICAgIGkgPSAwXHJcbiAgICAgIHdoaWxlIGkgPCBwYXJhbXMubGVuZ3RoXHJcbiAgICAgICAgcHJtID0gcGFyYW1zW2ldLnNwbGl0ICc9J1xyXG4gICAgICAgIGlmIHBybS5sZW5ndGggaXMgMiBcclxuICAgICAgICAgIHJldFtwcm1bMF1dID0gT0ouZ2xvYmFsLmRlY29kZVVSSUNvbXBvbmVudCBwcm1bMV0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKVxyXG4gICAgICAgIGkgKz0gMVxyXG4gIHJldFxyXG4gICAgXHJcbk9KLnJlZ2lzdGVyICdxdWVyeVN0cmluZycscXVlcnlTdHJpbmdcclxubW9kdWxlLmV4cG9ydHMgPSBxdWVyeVN0cmluZyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5lYWNoID0gcmVxdWlyZSAnLi9lYWNoJ1xuXG4jICMgcmFuZ2VzXG5cbnJuZyA9IFxuXG4gICMgIyMgcmFuZ2VcbiAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNyYW5nZSkncyBgcmFuZ2VgIG1ldGhvZFxuICByYW5nZTogKHBhcmFtcy4uLikgLT5cbiAgICBfLnJhbmdlIHBhcmFtcy4uLlxuXG4gICMgIyMgcmFuZ2VNaW5cbiAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNtaW4pJ3MgYG1pbmAgbWV0aG9kXG4gIHJhbmdlTWluOiAocGFyYW1zLi4uKSAtPlxuICAgIF8ubWluIHBhcmFtcy4uLlxuXG4gICMgIyMgcmFuZ2VNYXhcbiAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNtYXgpJ3MgYG1heGAgbWV0aG9kXG4gIHJhbmdlTWF4OiAocGFyYW1zLi4uKSAtPlxuICAgIF8ubWF4IHBhcmFtcy4uLlxuXG4gICMgIyMgc3RyaW5nUmFuZ2VUb1N1YlJhbmdlc1xuICAjIyNcbiAgVGFrZSBhbiBhcnJheSBvZiBzdHJpbmcgdmFsdWVzIGFuZCBhIG51bWJlciBvZiBwYXJ0aXRpb25zIHRvIGNyZWF0ZS5cbiAgVXNlcyB0aGUgZmlyc3QgbGV0dGVyIG9mIGVhY2ggc3RyaW5nIHZhbHVlIGluIHRoZSBhcnJheSB0byBjb252ZXJ0IHRvIHVuaXF1ZSBjb2RlIGNoYXJhY3RlciAobG93ZXIgY2FzZSlcbiAgQnVpbGRzIGEgaW50IHJhbmdlIGJhc2VkIG9uIHVuaXF1ZSBjb2RlIGNoYXJzLlxuICAjIyNcbiAgc3RyaW5nVG9TdWJSYW5nZXM6IChuID0gNiwgcmFuZ2UgPSBbXSkgLT5cbiAgICBjaGFyUmFuZ2UgPSBbXVxuXG5cbiAgICBlYWNoIHJhbmdlLCAodmFsKSAtPlxuICAgICAgY2hhciA9IHZhbC50cmltKClbMF0udG9Mb3dlckNhc2UoKVxuICAgICAgaWYgZmFsc2UgaXMgb2JqLmNvbnRhaW5zIGNoYXJSYW5nZSwgY2hhclxuICAgICAgICBjaGFyUmFuZ2UucHVzaCBjaGFyLmNoYXJDb2RlQXQoKVxuXG4gICAgcmV0ID0gcmFuZ2VUb1N1YlJhbmdlcyBuLCBjaGFyUmFuZ2VcblxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IG5cbiAgICAgIGkgKz0gMVxuICAgICAgc3ViUmFuZ2UgPSByZXRbaV1cbiAgICAgIHN1YlJhbmdlLm1hcCBTdHJpbmcuZnJvbUNoYXJDb2RlXG5cbiAgICBvbGRHZXRSYW5nZSA9IHJldC5nZXRSYW5nZVxuICAgIHJldC5nZXRSYW5nZSA9ICh2YWwpIC0+XG4gICAgICBjaGFyID0gdmFsLnRyaW0oKVswXS50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoKVxuICAgICAgaWR4ID0gb2xkR2V0UmFuZ2UgY2hhclxuICAgICAgaWR4XG4gICAgcmV0XG5cbiAgIyAjIyByYW5nZVRvU3ViUmFuZ2VzXG4gICMjI1xuICBUYWtlIGFuIGFycmF5IG9mIGludCB2YWx1ZXMgYW5kIGEgbnVtYmVyIG9mIHBhcnRpdGlvbnMgdG8gY3JlYXRlLlxuICBEaXZpZGVzIHRoZSBvcmlnaW5hbCBhcnJheSBpbnRvIHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIHN1YiBhcnJheXMuXG4gIE92ZXJmbG93IGlzIHBhc3NlZCB0byB0aGUgZmluYWwgcGFydGl0aW9uLlxuICAjIyNcbiAgdG9TdWJSYW5nZXM6IChuID0gNiwgcmFuZ2UgPSBbXSkgLT5cbiAgICByZXQgPSBvYmoub2JqZWN0KClcbiAgICByYW5nZUxvdyA9IHJuZy5yYW5nZU1pbiByYW5nZVxuICAgIHJhbmdlSGlnaCA9IHJuZy5yYW5nZU1heCByYW5nZVxuXG4gICAgZGlzdGFuY2UgPSByYW5nZUhpZ2ggLSByYW5nZUxvd1xuICAgIHN1YlJhbmdlU2l6ZSA9IGRpc3RhbmNlL25cbiAgICBzdWJSYW5nZXMgPSByZXQuYWRkICdyYW5nZXMnLCBvYmoub2JqZWN0KClcbiAgICBjaHVua1ZhbCA9IHJhbmdlTG93XG5cbiAgICBtYXAgPSBvYmoub2JqZWN0KClcblxuICAgIGkgPSAwXG4gICAgd2hpbGUgaSA8IG5cbiAgICAgIGkgKz0gMVxuICAgICAgaWYgaSA8IG4gdGhlbiBqdW1wID0gTWF0aC5yb3VuZCBzdWJSYW5nZVNpemVcbiAgICAgIGVsc2VcbiAgICAgICAganVtcCA9IE1hdGguZmxvb3Igc3ViUmFuZ2VTaXplXG4gICAgICAgIGlmIGNodW5rVmFsICsganVtcCA8PSByYW5nZUhpZ2hcbiAgICAgICAgICBqdW1wICs9IHJhbmdlSGlnaCAtIGNodW5rVmFsIC0ganVtcCArIDFcblxuICAgICAgc3ViUmFuZ2UgPSBybmcucmFuZ2UgY2h1bmtWYWwsIGNodW5rVmFsICsganVtcFxuICAgICAgZWFjaCBzdWJSYW5nZSwgKHZhbCkgLT4gbWFwLmFkZCB2YWwsIGlcbiAgICAgIHN1YlJhbmdlc1tpXSA9IHN1YlJhbmdlXG4gICAgICBjaHVua1ZhbCArPSBqdW1wXG5cbiAgICByZXQuYWRkICdnZXRSYW5nZScsICh2YWwpIC0+XG4gICAgICBtYXBbdmFsXVxuXG4gICAgcmV0XG5cbk9iamVjdC5zZWFsIHJuZ1xuT2JqZWN0LmZyZWV6ZSBybmdcblxuT0oucmVnaXN0ZXIgJ3JhbmdlcycsIHJuZ1xubW9kdWxlLmV4cG9ydHMgPSBybmcgICIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcbmlzTWV0aG9kID0gcmVxdWlyZSAnLi9pcydcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuZWFjaCA9IHJlcXVpcmUgJy4vZWFjaCdcblxuIyAjIHRvXG50byA9XG4gICMgIyMgYm9vbFxuICAjIGNvbnZlcnQgYW55IGNvbXBhdGlibGUgb2JqZWN0IHRvIGEgYm9vbGVhbi4gSW5jb21wYXRpYmxlIG9iamVjdHMgYXJlIGZhbHNlLlxuICBib29sOiAoc3RyKSAtPlxuICAgIHJldEJvb2wgPSBpc01ldGhvZFsndHJ1ZSddKHN0cilcbiAgICByZXRCb29sID0gZmFsc2UgIGlmIHJldEJvb2wgaXMgZmFsc2Ugb3IgcmV0Qm9vbCBpc250IHRydWVcbiAgICByZXRCb29sXG5cbiAgIyAjIyBFUzVfVG9Cb29sXG4gICMgKGRlYnVnKSBtZXRob2QgdG8gZXhwbGljaXRseSBmb3JjZSBhbiBgaWYob2JqKWAgZXZhbHVhdGlvbiB0byBmbG93IHRocm91Z2ggdGhlIEVTNSBzcGVjIGZvciB0cnV0aGluZXNzXG4gICdFUzVfVG9Cb29sJzogKHZhbCkgLT5cbiAgICB2YWwgaXNudCBmYWxzZSBhbmQgdmFsIGlzbnQgMCBhbmQgdmFsIGlzbnQgJycgYW5kIHZhbCBpc250IG51bGwgYW5kIHR5cGVvZiB2YWwgaXNudCAndW5kZWZpbmVkJyBhbmQgKHR5cGVvZiB2YWwgaXNudCAnbnVtYmVyJyBvciBub3QgaXNOYU4odmFsKSlcblxuICAjICMjIGRhdGVGcm9tVGlja3NcbiAgIyB0YWtlIGEgbnVtYmVyIHJlcHJlc2VudGluZyB0aWNrcyBhbmQgY29udmVydCBpdCBpbnRvIGFuIGluc3RhbmNlIG9mIERhdGVcbiAgZGF0ZUZyb21UaWNrczogKHRpY2tTdHIpIC0+XG4gICAgdGljc0RhdGVUaW1lID0gdG8uc3RyaW5nKHRpY2tTdHIpXG4gICAgcmV0ID0gdW5kZWZpbmVkXG4gICAgdGlja3MgPSB1bmRlZmluZWRcbiAgICBvZmZzZXQgPSB1bmRlZmluZWRcbiAgICBsb2NhbE9mZnNldCA9IHVuZGVmaW5lZFxuICAgIGFyciA9IHVuZGVmaW5lZFxuICAgIGlmIGZhbHNlIGlzIGlzTWV0aG9kLm51bGxPckVtcHR5KHRpY3NEYXRlVGltZSlcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcvJywgJycpXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnRGF0ZScsICcnKVxuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJygnLCAnJylcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCcpJywgJycpXG4gICAgICBhcnIgPSB0aWNzRGF0ZVRpbWUuc3BsaXQoJy0nKVxuICAgICAgaWYgYXJyLmxlbmd0aCA+IDFcbiAgICAgICAgdGlja3MgPSB0by5udW1iZXIoYXJyWzBdKVxuICAgICAgICBvZmZzZXQgPSB0by5udW1iZXIoYXJyWzFdKVxuICAgICAgICBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKVxuICAgICAgICByZXQgPSBuZXcgRGF0ZSgodGlja3MgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpXG4gICAgICBlbHNlIGlmIGFyci5sZW5ndGggaXMgMVxuICAgICAgICB0aWNrcyA9IHRvLm51bWJlcihhcnJbMF0pXG4gICAgICAgIHJldCA9IG5ldyBEYXRlKHRpY2tzKVxuICAgIHJldFxuXG4gICMgIyMgYmluYXJ5XG4gICMgY29udmVydCBhbiBvYmplY3QgdG8gYmluYXJ5IDAgb3IgMVxuICBiaW5hcnk6IChvYmopIC0+XG4gICAgcmV0ID0gTmFOXG4gICAgaWYgb2JqIGlzIDAgb3Igb2JqIGlzICcwJyBvciBvYmogaXMgJycgb3Igb2JqIGlzIGZhbHNlIG9yIHRvLnN0cmluZyhvYmopLnRvTG93ZXJDYXNlKCkudHJpbSgpIGlzICdmYWxzZSdcbiAgICAgIHJldCA9IDBcbiAgICBlbHNlIHJldCA9IDEgIGlmIG9iaiBpcyAxIG9yIG9iaiBpcyAnMScgb3Igb2JqIGlzIHRydWUgb3IgdG8uc3RyaW5nKG9iaikudG9Mb3dlckNhc2UoKS50cmltKCkgaXMgJ3RydWUnXG4gICAgcmV0XG5cblxuICAjICMjIG51bWJlclxuICAjXG4gICMgQXR0ZW1wdHMgdG8gY29udmVydCBhbiBhcmJpdHJhcnkgdmFsdWUgdG8gYSBOdW1iZXIuXG4gICMgTG9vc2UgZmFsc3kgdmFsdWVzIGFyZSBjb252ZXJ0ZWQgdG8gMC5cbiAgIyBMb29zZSB0cnV0aHkgdmFsdWVzIGFyZSBjb252ZXJ0ZWQgdG8gMS5cbiAgIyBBbGwgb3RoZXIgdmFsdWVzIGFyZSBwYXJzZWQgYXMgSW50ZWdlcnMuXG4gICMgRmFpbHVyZXMgcmV0dXJuIGFzIE5hTi5cbiAgI1xuICBudW1iZXI6IChpbnB1dE51bSwgZGVmYXVsdE51bSkgLT5cbiAgICB0cnlHZXROdW1iZXIgPSAodmFsKSAtPlxuICAgICAgcmV0ID0gTmFOXG4gICAgICAjIGlmIGB2YWxgIGFscmVhZHkgKGlzKVtpcy5odG1sXSBhIE51bWJlciwgcmV0dXJuIGl0XG4gICAgICBpZiBpc01ldGhvZC5udW1iZXIodmFsKVxuICAgICAgICByZXQgPSB2YWxcbiAgICAgICMgZWxzZSBpZiBgdmFsYCBhbHJlYWR5IChpcylbaXMuaHRtbF0gYSBTdHJpbmcgb3IgYSBCb29sZWFuLCBjb252ZXJ0IGl0XG4gICAgICBlbHNlIGlmIGlzTWV0aG9kLnN0cmluZyh2YWwpIG9yIGlzTWV0aG9kLmJvb2wodmFsKVxuICAgICAgICB0cnlHZXQgPSAodmFsdWUpIC0+XG4gICAgICAgICAgbnVtID0gdG8uYmluYXJ5KHZhbHVlKVxuICAgICAgICAgIG51bSA9ICt2YWx1ZSAgaWYgbm90IGlzTWV0aG9kLm51bWJlcihudW0pIGFuZCB2YWx1ZVxuICAgICAgICAgIG51bSA9IF8ucGFyc2VJbnQodmFsdWUsIDApIGlmIG5vdCBpc01ldGhvZC5udW1iZXIobnVtKVxuICAgICAgICAgIG51bVxuICAgICAgICByZXQgPSB0cnlHZXQgdmFsXG4gICAgICByZXRcblxuICAgIHJldFZhbCA9IHRyeUdldE51bWJlcihpbnB1dE51bSlcbiAgICBpZiBub3QgaXNNZXRob2QubnVtYmVyKHJldFZhbClcbiAgICAgIHJldFZhbCA9IHRyeUdldE51bWJlcihkZWZhdWx0TnVtKVxuICAgICAgcmV0VmFsID0gTnVtYmVyLk5hTiBpZiBub3QgaXNNZXRob2QubnVtYmVyKHJldFZhbClcbiAgICByZXRWYWxcblxuICAjICMjIHN0cmluZ1xuICAjIGNvbnZlcnQgYW4gb2JqZWN0IHRvIHN0cmluZ1xuICBzdHJpbmc6IChpbnB1dFN0ciwgZGVmYXVsdFN0cikgLT5cbiAgICB0cnlHZXRTdHJpbmcgPSAoc3RyKSAtPlxuICAgICAgcmV0ID0gdW5kZWZpbmVkXG4gICAgICBpZiBpc01ldGhvZC5zdHJpbmcoc3RyKVxuICAgICAgICByZXQgPSBzdHJcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0ID0gJydcbiAgICAgICAgcmV0ID0gc3RyLnRvU3RyaW5nKCkgIGlmIGlzTWV0aG9kLmJvb2woc3RyKSBvciBpc01ldGhvZC5udW1iZXIoc3RyKSBvciBpc01ldGhvZC5kYXRlKHN0cilcbiAgICAgIHJldFxuICAgIHJldDEgPSB0cnlHZXRTdHJpbmcoaW5wdXRTdHIpXG4gICAgcmV0MiA9IHRyeUdldFN0cmluZyhkZWZhdWx0U3RyKVxuICAgIHJldFZhbCA9ICcnXG4gICAgaWYgcmV0MS5sZW5ndGggaXNudCAwXG4gICAgICByZXRWYWwgPSByZXQxXG4gICAgZWxzZSBpZiByZXQxIGlzIHJldDIgb3IgcmV0Mi5sZW5ndGggaXMgMFxuICAgICAgcmV0VmFsID0gcmV0MVxuICAgIGVsc2VcbiAgICAgIHJldFZhbCA9IHJldDJcbiAgICByZXRWYWxcblxuT2JqZWN0LnNlYWwgdG9cbk9iamVjdC5mcmVlemUgdG9cblxuT0oucmVnaXN0ZXIgJ3RvJywgdG9cbm1vZHVsZS5leHBvcnRzID0gdG8iLCIjICMgY3JlYXRlVVVJRFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuIyMjXHJcbkdlbmVyYXRlcyBhIHJhbmRvbSBzdHJpbmcgdGhhdCBjb21wbGllcyB0byB0aGUgUkZDIDQxMjIgc3BlY2lmaWNhdGlvbiBmb3IgR1VJRC9VVUlELlxyXG4oZS5nLiAnQjQyQTE1M0YtMUQ5QS00RjkyLTk5MDMtOTJDMTFERDY4NEQyJylcclxuV2hpbGUgbm90IGEgdHJ1ZSBVVUlELCBmb3IgdGhlIHB1cnBvc2VzIG9mIHRoaXMgYXBwbGljYXRpb24sIGl0IHNob3VsZCBiZSBzdWZmaWNpZW50LlxyXG4jIyNcclxuY3JlYXRlRmF1eFVVSUQgPSAtPlxyXG4gICAgXHJcbiAgIyBodHRwOi8vd3d3LmlldGYub3JnL3JmYy9yZmM0MTIyLnR4dFxyXG4gICMgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvaG93LXRvLWNyZWF0ZS1hLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0XHJcbiAgcyA9IFtdXHJcbiAgcy5sZW5ndGggPSAzNlxyXG4gIGhleERpZ2l0cyA9ICcwMTIzNDU2Nzg5YWJjZGVmJ1xyXG4gIGkgPSAwXHJcblxyXG4gIHdoaWxlIGkgPCAzNlxyXG4gICAgc1tpXSA9IGhleERpZ2l0cy5zdWJzdHIoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMHgxMCksIDEpXHJcbiAgICBpICs9IDFcclxuICBzWzE0XSA9ICc0JyAjIGJpdHMgMTItMTUgb2YgdGhlIHRpbWVfaGlfYW5kX3ZlcnNpb24gZmllbGQgdG8gMDAxMFxyXG4gIHNbMTldID0gaGV4RGlnaXRzLnN1YnN0cigoc1sxOV0gJiAweDMpIHwgMHg4LCAxKSAjIGJpdHMgNi03IG9mIHRoZSBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkIHRvIDAxXHJcbiAgc1s4XSA9IHNbMTNdID0gc1sxOF0gPSBzWzIzXSA9ICctJ1xyXG4gIHV1aWQgPSBzLmpvaW4oJycpXHJcbiAgdXVpZFxyXG5cclxuT0oucmVnaXN0ZXIgJ2NyZWF0ZVVVSUQnLCBjcmVhdGVGYXV4VVVJRFxyXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUZhdXhVVUlEIl19
