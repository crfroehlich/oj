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
},{"../core/number":11,"../oj":58,"./to":74}],70:[function(require,module,exports){
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
},{"../core/object":12,"../oj":58,"./each":65}],74:[function(require,module,exports){
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
},{"../oj":58,"./is":69}],75:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbnRyeXBvaW50LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcYXN5bmNcXGFqYXguY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxhc3luY1xccHJvbWlzZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXGdyaWQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb21wb25lbnRzXFxpbnB1dGdyb3VwLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29tcG9uZW50c1xcdGFicy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvbXBvbmVudHNcXHRpbGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb250cm9sc1xcaWNvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXGRhdGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxjb3JlXFxmdW5jdGlvbi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG51bWJlci5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXG9iamVjdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGNvcmVcXHByb3BlcnR5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcY29yZVxcc3RyaW5nLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxOb2RlLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxib2R5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxjb21wb25lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGNvbnRyb2wuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGVsZW1lbnQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXGZyYWdtZW50LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZG9tXFxnZW5lcmljcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGRvbVxcaW5wdXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxkb21cXG5vZGVGYWN0b3J5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcZWxlbWVudHNcXGEuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcYnIuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcZm9ybS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxpbnB1dC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxvbC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGVsZW1lbnRzXFxzZWxlY3QuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdGFibGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdGV4dGFyZWEuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdGhlYWQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxlbGVtZW50c1xcdWwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxnbG9iYWwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGJ1dHRvbmlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxjaGVja2JveC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcY29sb3IuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGRhdGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXGRhdGV0aW1lLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxkYXRldGltZWxvY2FsLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxlbWFpbC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcZmlsZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcaGlkZGVuLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxpbWFnZWlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxtb250aC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcbnVtYmVyLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxwYXNzd29yZC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xccmFkaW8uY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHJhbmdlLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxyZXNldC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcc2VhcmNoLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFxzdWJtaXQuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHRlbC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXGlucHV0c1xcdGV4dGlucHV0LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx0aW1lLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcaW5wdXRzXFx1cmwuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxpbnB1dHNcXHdlZWsuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFxvai5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXG9qSW5pdC5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxKc29uVG9UYWJsZS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxhcnJheTJELmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGNvbnNvbGUuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcY29va2llLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGRlZmVyLmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXGVhY2guY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZW51bXMuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcZXJyb3IuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcaGlzdG9yeS5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxpcy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxub3R5LmNvZmZlZSIsIkM6XFxHaXRodWJcXG9qXFxzcmNcXGNvZmZlZVxcdG9vbHNcXHB1YnN1Yi5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxxdWVyeVN0cmluZy5jb2ZmZWUiLCJDOlxcR2l0aHViXFxvalxcc3JjXFxjb2ZmZWVcXHRvb2xzXFxyYW5nZXMuY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcdG8uY29mZmVlIiwiQzpcXEdpdGh1Ylxcb2pcXHNyY1xcY29mZmVlXFx0b29sc1xcdXVpZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxPQUFBLENBQVEsYUFBUixDQUFBLENBQUE7O0FBQUEsT0FDQSxDQUFRLGlCQUFSLENBREEsQ0FBQTs7QUFBQSxPQUVBLENBQVEscUJBQVIsQ0FGQSxDQUFBOztBQUFBLE9BR0EsQ0FBUSx3QkFBUixDQUhBLENBQUE7O0FBQUEsT0FJQSxDQUFRLDBCQUFSLENBSkEsQ0FBQTs7QUFBQSxPQUtBLENBQVEsZ0NBQVIsQ0FMQSxDQUFBOztBQUFBLE9BTUEsQ0FBUSwwQkFBUixDQU5BLENBQUE7O0FBQUEsT0FPQSxDQUFRLDBCQUFSLENBUEEsQ0FBQTs7QUFBQSxPQVFBLENBQVEsd0JBQVIsQ0FSQSxDQUFBOztBQUFBLE9BU0EsQ0FBUSxvQkFBUixDQVRBLENBQUE7O0FBQUEsT0FVQSxDQUFRLHdCQUFSLENBVkEsQ0FBQTs7QUFBQSxPQVdBLENBQVEsc0JBQVIsQ0FYQSxDQUFBOztBQUFBLE9BWUEsQ0FBUSxzQkFBUixDQVpBLENBQUE7O0FBQUEsT0FhQSxDQUFRLHNCQUFSLENBYkEsQ0FBQTs7QUFBQSxPQWNBLENBQVEsMEJBQVIs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QUUsQ0FBQSxFQUFBLENBQUYsR0FBUSxDQUFFLENBQUEsRUFBQSxDQUFGLEdBQVEsQ0FBRSxDQUFBLEVBQUEsQ0FBRixHQUFRLEdBVi9CLENBQUE7QUFBQSxFQVdBLElBQUEsR0FBTyxDQUFDLENBQUMsSUFBRixDQUFPLEVBQVAsQ0FYUCxDQUFBO1NBWUEsS0FoQmU7QUFBQSxDQVBqQixDQUFBOztBQUFBLEVBeUJFLENBQUMsUUFBSCxDQUFZLFlBQVosRUFBMEIsY0FBMUIsQ0F6QkEsQ0FBQTs7QUFBQSxNQTBCTSxDQUFDLE9BQVAsR0FBaUIsY0ExQmpCLENBQUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSAnLi9vai5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vb2pJbml0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9hc3luYy9hamF4LmNvZmZlZSdcclxucmVxdWlyZSAnLi9hc3luYy9wcm9taXNlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL2dyaWQuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvbXBvbmVudHMvaW5wdXRncm91cC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29tcG9uZW50cy90YWJzLmNvZmZlZSdcclxucmVxdWlyZSAnLi9jb21wb25lbnRzL3RpbGUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvbnRyb2xzL2ljb24uY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvcmUvZGF0ZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29yZS9mdW5jdGlvbi5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vY29yZS9udW1iZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2NvcmUvb2JqZWN0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9jb3JlL3N0cmluZy5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZG9tL25vZGVGYWN0b3J5LmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vYm9keS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZG9tL2NvbXBvbmVudC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZG9tL2NvbnRyb2wuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RvbS9Ob2RlLmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vZWxlbWVudC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZG9tL2ZyYWdtZW50LmNvZmZlZSdcclxucmVxdWlyZSAnLi9kb20vZ2VuZXJpY3MuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2RvbS9pbnB1dC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvYS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvYnIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2Zvcm0uY29mZmVlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL2lucHV0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy9vbC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvc2VsZWN0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy90YWJsZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vZWxlbWVudHMvdGV4dGFyZWEuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2VsZW1lbnRzL3RoZWFkLmNvZmZlZSdcclxucmVxdWlyZSAnLi9lbGVtZW50cy91bC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2J1dHRvbmlucHV0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvY2hlY2tib3guY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9jb2xvci5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2RhdGUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9kYXRldGltZS5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2RhdGV0aW1lbG9jYWwuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9lbWFpbC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL2ZpbGUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9oaWRkZW4uY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9pbWFnZWlucHV0LmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvbW9udGguY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9udW1iZXIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9wYXNzd29yZC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3JhZGlvLmNvZmZlZSdcclxucmVxdWlyZSAnLi9pbnB1dHMvcmFuZ2UuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy9yZXNldC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3NlYXJjaC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3N1Ym1pdC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3RlbC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3RleHRpbnB1dC5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vaW5wdXRzL3RpbWUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy91cmwuY29mZmVlJ1xyXG5yZXF1aXJlICcuL2lucHV0cy93ZWVrLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9hcnJheTJELmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9jb25zb2xlLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9jb29raWUuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2RlZmVyLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9lYWNoLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9lbnVtcy5jb2ZmZWUnXHJcbnJlcXVpcmUgJy4vdG9vbHMvZXJyb3IuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2hpc3RvcnkuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL2lzLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9ub3R5LmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9wdWJzdWIuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL3F1ZXJ5U3RyaW5nLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy9yYW5nZXMuY29mZmVlJ1xyXG5yZXF1aXJlICcuL3Rvb2xzL3RvLmNvZmZlZSdcclxucmVxdWlyZSAnLi90b29scy91dWlkLmNvZmZlZSciLCIjICMgYWpheFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbmNvbmZpZyA9IHt9XHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgb24gc3VjY2VzcyBoYW5kbGVyLCB3cml0ZSBvdXQgdGhlIHJlcXVlc3Qgc3RhdHMgdG8gYSB0YWJsZVxyXG5jb25maWcub25TdWNjZXNzID0gKG9wdHMsIGRhdGEsIHVybCkgLT5cclxuICByZXNwb25zZSA9IHt9XHJcbiAgT0ouZXh0ZW5kIHJlc3BvbnNlLCBkYXRhXHJcbiAgb3B0cy5vblN1Y2Nlc3MgcmVzcG9uc2VcclxuICBpZiBPSi5MT0dfQUxMX0FKQVhcclxuICAgIE9KLmNvbnNvbGUudGFibGUgW1xyXG4gICAgICBXZWJzZXJ2aWNlOiBvcHRzLmFqYXhPcHRzLnVybFxyXG4gICAgICBTdGFydFRpbWU6IG9wdHMuc3RhcnRUaW1lXHJcbiAgICAgIEVuZFRpbWU6IG5ldyBEYXRlKClcclxuICAgIF0gXHJcbiAgcmV0dXJuXHJcbiAgXHJcbiMgZGVmaW5lIGEgc3RhbmRhcmQgb24gZXJyb3IgaGFuZGxlciwgd3JpdGUgb3V0IHRoZSByZXF1ZXN0IGVycm9yIGNvbmV4dCB0byBhIHRhYmxlXHJcbmNvbmZpZy5vbkVycm9yID0gKHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzLCBwYXJhbTEsIG9wdHMgPSBPSi5vYmplY3QoKSkgLT5cclxuICBpZiB0ZXh0U3RhdHVzIGlzbnQgJ2Fib3J0J1xyXG4gICAgaWYgT0ouTE9HX0FMTF9BSkFYX0VSUk9SU1xyXG4gICAgICBPSi5jb25zb2xlLnRhYmxlIFtcclxuICAgICAgICBXZWJzZXJ2aWNlOiBvcHRzLmFqYXhPcHRzLnVybFxyXG4gICAgICAgIERhdGE6IG9wdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgICAgIEZhaWxlZDogdGV4dFN0YXR1c1xyXG4gICAgICAgIFN0YXRlOiB4bWxIdHRwUmVxdWVzdC5zdGF0ZSgpXHJcbiAgICAgICAgU3RhdHVzOiB4bWxIdHRwUmVxdWVzdC5zdGF0dXNcclxuICAgICAgICBTdGF0dXNUZXh0OiB4bWxIdHRwUmVxdWVzdC5zdGF0dXNUZXh0XHJcbiAgICAgICAgUmVhZHlTdGF0ZTogeG1sSHR0cFJlcXVlc3QucmVhZHlTdGF0ZVxyXG4gICAgICAgIFJlc3BvbnNlVGV4dDogeG1sSHR0cFJlcXVlc3QucmVzcG9uc2VUZXh0XHJcbiAgICAgIF1cclxuXHJcbiAgICBvcHRzLm9uRXJyb3IgdGV4dFN0YXR1c1xyXG4gIHJldHVyblxyXG4gIFxyXG4jIGluIHRoZSBjYXNlIHdoZXJlIGBvcHRzYCBpcyBhIHN0cmluZywgY29udmVydCBpdCB0byBhbiBvYmplY3Rcclxub3B0c0Zyb21VcmwgPSAob3B0cykgLT5cclxuICBpZiBPSi5pcy5zdHJpbmcgb3B0c1xyXG4gICAgdXJsID0gb3B0c1xyXG4gICAgb3B0cyA9IE9KLm9iamVjdCgpXHJcbiAgICBvcHRzLmFkZCAnYWpheE9wdHMnLCBPSi5vYmplY3QoKVxyXG4gICAgb3B0cy5hamF4T3B0cy5hZGQgJ3VybCcsIHVybFxyXG4gIG9wdHNcclxuICBcclxuIyBkZWZpbmUgYSBzdGFuZGFyZCBgZXhlY2AgbWV0aG9kIHRvIGhhbmRsZSBhbGwgcmVxdWVzdCB2ZXJicy4gVXNlcyB0aGUgW2pRdWVyeS5hamF4XShodHRwOi8vYXBpLmpxdWVyeS5jb20vY2F0ZWdvcnkvYWpheC8pIEFQSS5cclxuIyBgZXhlY1JlcXVlc3RgIHJldHVybnMgYSBwcm9taXNlIHJlcHJlc2VudCB0aGUgYWN0dWFsIEFKQVggY2FsbC5cclxuICBcclxuIyAtIGB2ZXJiYCBkZWZhdWx0IHZhbHVlID0gJ0dFVCdcclxuIyAtIGBvcHRzYCBvYmplY3RcclxuIyAtLSBgb3B0cy5hamF4T3B0c2Agb2JqZWN0IGZvciBhbGwgalF1ZXJ5J3MgYWpheC1zcGVjaWZpYyBwcm9wZXJ0aWVzLlxyXG5jb25maWcuZXhlY1JlcXVlc3QgPSAodmVyYiA9ICdHRVQnLCBvcHRzKSAtPlxyXG4gIGRlZmF1bHRzID1cclxuICAgIGFqYXhPcHRzOlxyXG4gICAgICB1cmw6ICcnXHJcbiAgICAgIGRhdGE6IHt9XHJcbiAgICAgIHR5cGU6IHZlcmJcclxuICAgICAgeGhyRmllbGRzOlxyXG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxyXG4gICAgICBkYXRhVHlwZTogJ2pzb24nXHJcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcclxuICAgICAgICBcclxuICAgIG9uU3VjY2VzczogT0oubm9vcFxyXG4gICAgb25FcnJvcjogT0oubm9vcFxyXG4gICAgb25Db21wbGV0ZTogT0oubm9vcFxyXG4gICAgb3ZlcnJpZGVFcnJvcjogZmFsc2VcclxuICAgIHdhdGNoR2xvYmFsOiB0cnVlXHJcbiAgICB1c2VDYWNoZTogZmFsc2VcclxuICAgIFxyXG4gIG9wdHMgPSBvcHRzRnJvbVVybCBvcHRzXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRzLCB0cnVlXHJcbiAgICBcclxuICBkZWZhdWx0cy5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpXHJcbiAgICBcclxuICBpZiBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSBkZWZhdWx0cy5hamF4T3B0cy5kYXRhXHJcbiAgICAjIEdFVCByZXF1ZXN0cyBleHBlY3QgcXVlcnlTdHJpbmcgcGFyYW1ldGVyc1xyXG4gICAgaWYgZGVmYXVsdHMuYWpheE9wdHMudmVyYiBpcyAnR0VUJ1xyXG4gICAgICBkZWZhdWx0cy5hamF4T3B0cy5kYXRhID0gT0oucGFyYW1zIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGFcclxuICAgICMgYWxsIG90aGVyIHJlcXVlc3RzIHRha2UgYW4gb2JqZWN0XHJcbiAgICBlbHNlXHJcbiAgICAgIGRlZmF1bHRzLmFqYXhPcHRzLmRhdGEgPSBPSi5zZXJpYWxpemUgZGVmYXVsdHMuYWpheE9wdHMuZGF0YVxyXG4gICAgXHJcbiAgZ2V0SlF1ZXJ5RGVmZXJyZWQgPSAod2F0Y2hHbG9iYWwpIC0+XHJcbiAgICByZXQgPSAkLmFqYXggZGVmYXVsdHMuYWpheE9wdHNcclxuICAgICAgXHJcbiAgICByZXQuZG9uZSAoZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIC0+XHJcbiAgICAgIGNvbmZpZy5vblN1Y2Nlc3MgZGVmYXVsdHMsIGRhdGFcclxuXHJcbiAgICByZXQuZmFpbCAoanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGV4dCkgLT5cclxuICAgICAgY29uZmlnLm9uRXJyb3IganFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGV4dCwgZGVmYXVsdHNcclxuICBcclxuICAgIHJldC5hbHdheXMgKHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzKSAtPlxyXG4gICAgICBkZWZhdWx0cy5vbkNvbXBsZXRlIHhtbEh0dHBSZXF1ZXN0LCB0ZXh0U3RhdHVzXHJcblxyXG4gICAgT0ouYXN5bmMuYWpheFByb21pc2UgcmV0XHJcblxyXG4gIHByb21pc2UgPSBnZXRKUXVlcnlEZWZlcnJlZChkZWZhdWx0cy53YXRjaEdsb2JhbClcclxuICBwcm9taXNlXHJcbiAgXHJcbmFqYXggPSB7fVxyXG4gIFxyXG4jICMjIHBvc3RcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXgucG9zdDogaW5zZXJ0IGEgbmV3IG9iamVjdCBvciBpbml0IGEgZm9ybSBwb3N0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC4gXHJcbmFqYXgucG9zdCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnUE9TVCcsIG9wdHNcclxuICBcclxuIyAjIyBnZXRcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXguZ2V0OiBnZXQgYW4gZXhpc3Rpbmcgb2JqZWN0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuI1xyXG5hamF4LmdldCA9IChvcHRzKSAtPlxyXG4gIGNvbmZpZy5leGVjUmVxdWVzdCAnR0VUJywgb3B0c1xyXG5cclxuIyAjIyBkZWxldGVcclxuIyBbT0pdKG9qLmh0bWwpLmFqYXguZGVsZXRlOiBkZWxldGUgYW4gZXhpc3Rpbmcgb2JqZWN0XHJcbiAgXHJcbiMgLSBgb3B0c2AgY2FuIGJlIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJlcXVlc3QuXHJcbiMgLSBgb3B0c2AgY2FuIGFsc28gYmUgYSBzdHJpbmcsIHJlcHJlc2VudGluZyB0aGUgVVJMIHRvIGhpdC5cclxuYWpheC5kZWxldGUgPSAob3B0cykgLT5cclxuICBjb25maWcuZXhlY1JlcXVlc3QgJ0RFTEVURScsIG9wdHNcclxuXHJcbiMgIyMgcHV0XHJcbiMgW09KXShvai5odG1sKS5hamF4LnB1dDogdXBkYXRlIGFuIGV4aXN0aW5nIG9iamVjdFxyXG4gIFxyXG4jIC0gYG9wdHNgIGNhbiBiZSBhbiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjb25maWd1cmF0aW9uIG9mIHRoZSByZXF1ZXN0LlxyXG4jIC0gYG9wdHNgIGNhbiBhbHNvIGJlIGEgc3RyaW5nLCByZXByZXNlbnRpbmcgdGhlIFVSTCB0byBoaXQuXHJcbmFqYXgucHV0ID0gKG9wdHMpIC0+XHJcbiAgY29uZmlnLmV4ZWNSZXF1ZXN0ICdQVVQnLCBvcHRzXHJcblxyXG5PSi5hc3luYy5yZWdpc3RlciAnYWpheCcsIGFqYXhcclxubW9kdWxlLmV4cG9ydHMgPSBhamF4IiwiIyAjIHByb21pc2VcclxuXHJcbk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jICMjIGFqYXhQcm9taXNlXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5hamF4UHJvbWlzZSBjb252ZXJ0cyBhbiBBSkFYIFhtbEh0dHBSZXF1ZXN0IGludG8gYSBQcm9taXNlLiBcclxuIyBTZWUgYWxzbyBbUHJvbWlzZS5yZXNvbHZlXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbmFqYXhQcm9taXNlID0gKGFqYXgpIC0+IFxyXG4gIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUgYWpheFxyXG4gIHByb21pc2UuYWJvcnQgPSBhamF4LmFib3J0XHJcbiAgcHJvbWlzZS5yZWFkeVN0YXRlID0gYWpheC5yZWFkeVN0YXRlXHJcbiAgcHJvbWlzZVxyXG5cclxuIyAjIyBhbGxcclxuIyBbT0pdKG9qLmh0bWwpLmFzeW5jLmFsbCB0YWtlcyBhbiBhcnJheSBvZiBmdW5jdGlvbnMgYW5kIHJldHVybnMgYSBwcm9taXNlIHJlcHJlc2VudGluZyB0aGUgc3VjY2VzcyBvZiBhbGwgbWV0aG9kcyBvciB0aGUgZmFpbHVyZSBvZiBhbnkgbWV0aG9kLlxyXG4jIFNlZSBhbHNvIFtQcm9taXNlLmFsbF0oaHR0cHM6Ly9naXRodWIuY29tL3BldGthYW50b25vdi9ibHVlYmlyZC9ibG9iL21hc3Rlci9BUEkubWQpLlxyXG5hbGwgPSAoaW5pdEFycmF5KSAtPlxyXG4gIHJlcXMgPSBpbml0QXJyYXkgb3IgW11cclxuICBwcm9taXNlID0gUHJvbWlzZS5hbGwocmVxcylcclxuICBwcm9taXNlLnB1c2ggPSAoaXRlbSkgLT5cclxuICAgIHJlcXMucHVzaCBpdGVtXHJcbiAgICByZXR1cm5cclxuICBwcm9taXNlXHJcblxyXG4jICMjIGRlZmVyXHJcbiMgW09KXShvai5odG1sKS5hc3luYy5kZWZlciBjb252ZXJ0cyBhIGZ1bmN0aW9uIGludG8gYSBQcm9taXNlIHRvIGV4ZWN1dGUgdGhhdCBmdW5jdGlvbi4gXHJcbiMgU2VlIGFsc28gW1Byb21pc2UubWV0aG9kXShodHRwczovL2dpdGh1Yi5jb20vcGV0a2FhbnRvbm92L2JsdWViaXJkL2Jsb2IvbWFzdGVyL0FQSS5tZCkuXHJcbmRlZnIgPSAoZnVuYyA9IE9KLm5vb3ApIC0+XHJcbiAgcmV0ID0gUHJvbWlzZS5tZXRob2QgZnVuY1xyXG4gIHJldFxyXG4gIFxyXG4gIFxyXG5PSi5hc3luYy5yZWdpc3RlciAnZGVmZXInLCBkZWZyXHJcbk9KLmFzeW5jLnJlZ2lzdGVyICdhbGwnLCBhbGxcclxuT0ouYXN5bmMucmVnaXN0ZXIgJ2FqYXhQcm9taXNlJywgYWpheFByb21pc2VcclxuXHJcbm1vZHVsZS5leHBvcnRzID1cclxuICBkZWZlcjogZGVmclxyXG4gIGFsbDogYWxsXHJcbiAgYWpheFByb21pc2U6IGFqYXhQcm9taXNlXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9vakluaXQnXG5jb21wb25lbnQgPSByZXF1aXJlICcuLi9kb20vY29tcG9uZW50J1xuYXJyYXkyRCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FycmF5MkQnXG5cbm5vZGVOYW1lID0gJ3gtZ3JpZCdcbmNsYXNzTmFtZSA9ICdncmlkJ1xuT0ouY29tcG9uZW50cy5tZW1iZXJzW2NsYXNzTmFtZV0gPSBub2RlTmFtZVxuXG5jbXBudCA9IChvcHRpb25zLCBvd25lcikgLT5cbiAgZGVmYXVsdHMgPVxuICAgIHRpbGVTaXplczpcbiAgICAgIHNtYWxsU3BhbjogJydcbiAgICAgIG1lZGl1bVNwYW46ICcnXG4gICAgICBsYXJnZVNwYW46ICcnXG4gICAgcHJvcHM6XG4gICAgICBjbGFzczogJ2dyaWQnXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG4gIHJldCA9IGNvbXBvbmVudCBkZWZhdWx0cywgb3duZXIsIG5vZGVOYW1lXG5cbiAgcm93cyA9IFtdXG4gIHRpbGVzID0gYXJyYXkyRCgpXG5cbiAgZmlsbE1pc3NpbmcgPSAoKSAtPlxuICAgIHRpbGVzLmVhY2ggKHJvd05vLCBjb2xObywgdmFsKSAtPlxuICAgICAgaWYgbm90IHZhbFxuICAgICAgICByb3cgPSByZXQucm93IHJvd05vXG4gICAgICAgIHJvdy5tYWtlICd0aWxlJywgY29sTm8sIHt9XG5cbiAgcmV0LmFkZCAncm93JywgKHJvd05vID0gcm93cy5sZW5ndGgtMSBvciAxKS0+XG4gICAgbnVSb3cgPSByb3dzW3Jvd05vLTFdXG4gICAgaWYgbm90IG51Um93XG4gICAgICB3aGlsZSByb3dzLmxlbmd0aCA8IHJvd05vXG4gICAgICAgIG51Um93ID0gcmV0Lm1ha2UgJ2RpdicsIHByb3BzOiBjbGFzczogJ3JvdydcbiAgICAgICAgcm93cy5wdXNoIG51Um93XG4gICAgICBudVJvdy5hZGQgJ3RpbGUnLCAoY29sTm8sIG9wdHMpIC0+XG4gICAgICAgIG9wdHMgPSBPSi5leHRlbmQgKE9KLmV4dGVuZCB7fSwgZGVmYXVsdHMudGlsZVNpemVzKSwgb3B0c1xuICAgICAgICBudVRpbGUgPSBPSi5jb21wb25lbnRzLnRpbGUgb3B0cywgbnVSb3dcbiAgICAgICAgdGlsZXMuc2V0IHJvd05vLCBjb2xObywgbnVUaWxlXG4gICAgICAgIG51VGlsZVxuICAgIG51Um93XG5cbiAgcmV0LmFkZCAndGlsZScsIChyb3dObywgY29sTm8sIG9wdHMpIC0+XG4gICAgaWYgbm90IHJvd05vIG9yIHJvd05vIDwgMSB0aGVuIHJvd05vID0gMVxuICAgIGlmIG5vdCBjb2xObyBvciBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcblxuICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cbiAgICB0aWxlID0gdGlsZXMuZ2V0IHJvd05vLCBjb2xOb1xuXG4gICAgaWYgbm90IHRpbGVcbiAgICAgIGkgPSAwXG4gICAgICB3aGlsZSBpIDwgY29sTm9cbiAgICAgICAgaSArPSAxXG4gICAgICAgIHRyeVRpbGUgPSB0aWxlcy5nZXQgcm93Tm8sIGlcbiAgICAgICAgaWYgbm90IHRyeVRpbGVcbiAgICAgICAgICBpZiBpIGlzIGNvbE5vXG4gICAgICAgICAgICB0aWxlID0gcm93Lm1ha2UgJ3RpbGUnLCBvcHRzXG4gICAgICAgICAgZWxzZSBpZiBub3QgdGlsZVxuICAgICAgICAgICAgcm93Lm1ha2UgJ3RpbGUnXG5cbiAgICBmaWxsTWlzc2luZygpXG4gICAgdGlsZVxuXG4gIHJldFxuXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcbm1vZHVsZS5leHBvcnRzID0gY21wbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vb2pJbml0J1xuY29tcG9uZW50ID0gcmVxdWlyZSAnLi4vZG9tL2NvbXBvbmVudCdcbnV1aWQgPSByZXF1aXJlICcuLi90b29scy91dWlkJ1xuXG5ub2RlTmFtZSA9ICd4LWlucHV0LWdyb3VwJ1xuY2xhc3NOYW1lID0gJ2lucHV0Z3JvdXAnXG5cbk9KLmNvbXBvbmVudHMubWVtYmVyc1tjbGFzc05hbWVdID0gbm9kZU5hbWVcblxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XG4gIGZvcklkID0gdXVpZCgpXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIGNsYXNzOiAnZm9ybS1ncm91cCdcbiAgICBldmVudHM6XG4gICAgICBjaGFuZ2U6IE9KLm5vb3BcbiAgICBmb3I6IGZvcklkXG4gICAgbGFiZWxUZXh0OiAnJ1xuICAgIGlucHV0T3B0czpcbiAgICAgIHByb3BzOlxuICAgICAgICBpZDogZm9ySWRcbiAgICAgICAgdHlwZTogJ3RleHQnXG4gICAgICAgIGNsYXNzOiAnJ1xuICAgICAgICBwbGFjZWhvbGRlcjogJydcbiAgICAgICAgdmFsdWU6ICcnXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG4gIHJldCA9IGNvbXBvbmVudCBkZWZhdWx0cywgb3duZXIsIG5vZGVOYW1lXG5cbiAgZ3JvdXAgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAnZm9ybS1ncm91cCdcblxuICByZXQuZ3JvdXBMYWJlbCA9IGdyb3VwLm1ha2UgJ2xhYmVsJywgcHJvcHM6IHsgZm9yOiBmb3JJZCB9LCB0ZXh0OiBkZWZhdWx0cy5sYWJlbFRleHRcblxuICBkZWZhdWx0cy5pbnB1dE9wdHMucHJvcHMuY2xhc3MgKz0gJyBmb3JtLWNvbnRyb2wnXG4gIHJldC5ncm91cElucHV0ID0gZ3JvdXAubWFrZSAnaW5wdXQnLCBkZWZhdWx0cy5pbnB1dE9wdHNcblxuICByZXQuZ3JvdXBWYWx1ZSA9ICgpIC0+XG4gICAgcmV0Lmdyb3VwSW5wdXQudmFsKClcblxuICByZXRcblxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbXBvbmVudCA9IHJlcXVpcmUgJy4uL2RvbS9jb21wb25lbnQnXG5cbm5vZGVOYW1lID0gJ3gtdGFicydcbmNsYXNzTmFtZSA9ICd0YWJzJ1xuXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXG5cbmNtcG50ID0gKG9wdGlvbnMsIG93bmVyKSAtPlxuICBkZWZhdWx0cyA9XG4gICAgdGFiczoge31cbiAgICBwcm9wczpcbiAgICAgIGNsYXNzOiAnJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICByZXQgPSBjb21wb25lbnQgZGVmYXVsdHMsIG93bmVyLCBub2RlTmFtZVxuXG4gIHRhYnMgPSByZXQubWFrZSAndWwnLCBwcm9wczogY2xhc3M6ICduYXYgbmF2LXRhYnMnXG4gIGNvbnRlbnQgPSByZXQubWFrZSAnZGl2JywgcHJvcHM6IGNsYXNzOiAndGFiLWNvbnRlbnQnXG5cbiAgZmlyc3QgPSB0cnVlXG4gIE9KLmVhY2ggZGVmYXVsdHMudGFicywgKHRhYlZhbCwgdGFiTmFtZSkgLT5cbiAgICB0YWJDbGFzcyA9ICcnXG4gICAgaWYgZmlyc3RcbiAgICAgIGZpcnN0ID0gZmFsc2VcbiAgICAgIHRhYkNsYXNzID0gJ2FjdGl2ZSdcbiAgICBhID0gdGFicy5tYWtlICdsaScsIHByb3BzOiBjbGFzczogdGFiQ2xhc3NcbiAgICAgIC5tYWtlKCdhJyxcbiAgICAgICAgdGV4dDogdGFiTmFtZVxuICAgICAgICBwcm9wczpcbiAgICAgICAgICBocmVmOiAnIycgKyB0YWJOYW1lXG4gICAgICAgICAgJ2RhdGEtdG9nZ2xlJzogJ3RhYidcbiAgICAgICAgZXZlbnRzOlxuICAgICAgICAgIGNsaWNrOiAtPlxuICAgICAgICAgICAgYS4kLnRhYiAnc2hvdycpXG5cbiAgICB0YWJDb250ZW50Q2xhc3MgPSAndGFiLXBhbmUgJyArIHRhYkNsYXNzXG4gICAgcmV0LmFkZCB0YWJOYW1lLCBjb250ZW50Lm1ha2UoJ2RpdicsIHByb3BzOiBjbGFzczogdGFiQ29udGVudENsYXNzLCBpZDogdGFiTmFtZSlcblxuICByZXRcblxuT0ouY29tcG9uZW50cy5yZWdpc3RlciBjbGFzc05hbWUsIGNtcG50XG5tb2R1bGUuZXhwb3J0cyA9IGNtcG50IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL29qSW5pdCdcbmNvbXBvbmVudCA9IHJlcXVpcmUgJy4uL2RvbS9jb21wb25lbnQnXG5cbm5vZGVOYW1lID0gJ3gtdGlsZSdcbmNsYXNzTmFtZSA9ICd0aWxlJ1xuXG5PSi5jb21wb25lbnRzLm1lbWJlcnNbY2xhc3NOYW1lXSA9IG5vZGVOYW1lXG4gIFxuY21wbnQgPSAob3B0aW9ucywgb3duZXIpIC0+XG4gIGRlZmF1bHRzID1cbiAgICB3aWR0aDpcbiAgICAgIHhzOiAnJ1xuICAgICAgc206ICcnXG4gICAgICBtZDogJydcbiAgICAgIGxnOiAnJ1xuICAgIHByb3BzOlxuICAgICAgY2xhc3M6ICd0aWxlJ1xuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuICBpZiBkZWZhdWx0cy53aWR0aC54cyB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLXhzLScgKyBkZWZhdWx0cy53aWR0aC54c1xuICBpZiBkZWZhdWx0cy53aWR0aC5zbSB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLXNtLScgKyBkZWZhdWx0cy53aWR0aC5zbVxuICBpZiBkZWZhdWx0cy53aWR0aC5tZCB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLW1kLScgKyBkZWZhdWx0cy53aWR0aC5tZFxuICBpZiBkZWZhdWx0cy53aWR0aC5sZyB0aGVuIGRlZmF1bHRzLnByb3BzLmNsYXNzICs9ICcgY29sLWxnLScgKyBkZWZhdWx0cy53aWR0aC5sZ1xuXG4gIHJldCA9IE9KLmNvbXBvbmVudCBkZWZhdWx0cywgb3duZXIsIG5vZGVOYW1lXG4gIHJldFxuXG5PSi5jb21wb25lbnRzLnJlZ2lzdGVyIGNsYXNzTmFtZSwgY21wbnRcbm1vZHVsZS5leHBvcnRzID0gY21wbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vb2pJbml0J1xuY29udHJvbCA9IHJlcXVpcmUgJy4uL2RvbS9jb250cm9sJ1xuXG5jb250cm9sTmFtZSA9ICd5LWljb24nXG5mcmllbmRseU5hbWUgPSAnaWNvbidcblxuT0ouY29udHJvbHMubWVtYmVyc1tmcmllbmRseU5hbWVdID0gY29udHJvbE5hbWVcblxuY250cmwgPSAob3B0aW9ucywgb3duZXIpIC0+XG4gIGRlZmF1bHRzID1cbiAgICBpY29uT3B0czpcbiAgICAgIG5hbWU6ICcnXG4gICAgICBzdGFja2VkSWNvbjogJydcbiAgICAgIHN3YXBJY29uOiAnJ1xuICAgICAgc2l6ZTogZmFsc2VcbiAgICAgIGNvbG9yOiAnJ1xuICAgICAgbGlicmFyeTogJydcbiAgICAgIGlzRml4ZWRXaWR0aDogZmFsc2VcbiAgICAgIGlzTGlzdDogZmFsc2VcbiAgICAgIGlzU3Bpbm5lcjogZmFsc2VcbiAgICBwcm9wczpcbiAgICAgIGNsYXNzOiAnJ1xuICAgIHJvb3ROb2RlVHlwZTogJ3NwYW4nXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zXG4gIHJldCA9IGNvbnRyb2wgZGVmYXVsdHMsIG93bmVyLCBjb250cm9sTmFtZVxuXG4gIGlzVG9nZ2xlZCA9IGZhbHNlXG5cbiAgI1RPRE86IFN1cHBvcnQgZm9yIHBpY3RvaWNvbnNcbiAgI1RPRE86IFN1cHBvcnQgZm9yIG90aGVyIEZvbnRBd2Vzb21lIHByb3BlcnRpZXMgKHN0YWNrLCByb3RhdGUsIHNpemUsIGV0YylcblxuICBjbGFzc05hbWVCYXNlID0gJ2ZhICdcbiAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuaXNGaXhlZFdpZHRoIHRoZW4gY2xhc3NOYW1lQmFzZSArPSAnZmEtZncgJ1xuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5pc0xpc3QgdGhlbiBjbGFzc05hbWVCYXNlICs9ICdmYS1saSAnXG4gIGlmIGRlZmF1bHRzLmljb25PcHRzLmlzU3Bpbm5lciB0aGVuIGNsYXNzTmFtZUJhc2UgKz0gJ2ZhLXNwaW4gJ1xuICBpZiBkZWZhdWx0cy5pY29uT3B0cy5zaXplXG4gICAgaWYgZGVmYXVsdHMuaWNvbk9wdHMuc2l6ZSA+IDEgYW5kIGRlZmF1bHRzLmljb25PcHRzLnNpemUgPD0gNVxuICAgICAgY2xhc3NOYW1lQmFzZSArPSAnZmEtJyArIGRlZmF1bHRzLmljb25PcHRzLnNpemUgKyAneCAnXG5cbiAgY2xhc3NOYW1lID0gY2xhc3NOYW1lQmFzZSArICdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMubmFtZVxuICByZXQubXlJY29uID0gcmV0Lm1ha2UgJ2knLCBwcm9wczogY2xhc3M6IGNsYXNzTmFtZVxuXG4gICNUb2dnbGVzIGRpc3BsYXkgYmV0d2VlbiBub3JtYWwgaWNvbiBhbmQgc3dhcCBpY29uLCBpZiBhIHN3YXAgaWNvbiBoYXMgYmVlbiBzcGVjaWZpZWRcbiAgcmV0LnRvZ2dsZUljb24gPSAtPlxuICAgIGlmIGRlZmF1bHRzLmljb25PcHRzLnN3YXBJY29uXG4gICAgICBuZXdJY29uID0gZGVmYXVsdHMuaWNvbk9wdHMubmFtZVxuXG4gICAgICBpc1RvZ2dsZWQgPSAhaXNUb2dnbGVkXG5cbiAgICAgIGlmIGlzVG9nZ2xlZFxuICAgICAgICByZXQubXlJY29uLiQucmVtb3ZlQ2xhc3MoJ2ZhLScgKyBuZXdJY29uKVxuICAgICAgICBuZXdJY29uID0gZGVmYXVsdHMuaWNvbk9wdHMuc3dhcEljb25cbiAgICAgIGVsc2VcbiAgICAgICAgcmV0Lm15SWNvbi4kLnJlbW92ZUNsYXNzKCdmYS0nICsgZGVmYXVsdHMuaWNvbk9wdHMuc3dhcEljb24pXG5cbiAgICAgIHJldC5teUljb24uJC5hZGRDbGFzcygnZmEtJyArIG5ld0ljb24pXG5cblxuICByZXRcblxuT0ouY29udHJvbHMucmVnaXN0ZXIgZnJpZW5kbHlOYW1lLCBjbnRybFxubW9kdWxlLmV4cG9ydHMgPSBjbnRybCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG5nZXREYXRlRnJvbURuSnNvbiA9IChkbkRhdGUpIC0+XHJcbiAgICBcclxuICAjIFRyYW5zZm9ybXMgYSAuTkVUIEpTT04gZGF0ZSBpbnRvIGEgSmF2YVNjcmlwdCBkYXRlLlxyXG4gICMgbmFtZT0nb2JqJyAgT2JqZWN0IHRvIHRlc3RcclxuICAjIHR5cGU9J0Jvb2xlYW4nIC8+XHJcbiAgI1xyXG4gICMgICAgICAgdmFyIG1pbGxpID0gT0oudG8ubnVtYmVyKERuRGF0ZS5yZXBsYWNlKC9cXC9EYXRlXFwoKFxcZCspXFwtPyhcXGQrKVxcKVxcLy8sICckMScpKTtcclxuICAjICAgICAgIHZhciBvZmZzZXQgPSBPSi50by5udW1iZXIoRG5EYXRlLnJlcGxhY2UoL1xcL0RhdGVcXChcXGQrKFtcXCtcXC1dP1xcZCspXFwpXFwvLywgJyQxJykpO1xyXG4gICMgICAgICAgdmFyIGxvY2FsT2Zmc2V0ID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpO1xyXG4gICMgICAgICAgcmV0dXJuIG5ldyBEYXRlKChtaWxsaSAtICgobG9jYWxPZmZzZXQgKyAob2Zmc2V0IC8gMTAwICogNjApKSAqIDEwMDApKSk7XHJcbiAgIyAgICAgICBcclxuICAgIFxyXG4gICMgRG4gRGF0ZSB3aWxsIGxvb2sgbGlrZSAvRGF0ZSgxMzM1NzU4NDAwMDAwLTA0MDApLyAgXHJcbiAgZG5EYXRlU3RyID0gT0oudG8uc3RyaW5nKGRuRGF0ZSlcclxuICByZXQgPSB1bmRlZmluZWRcclxuICB0aWNrcyA9IHVuZGVmaW5lZFxyXG4gIG9mZnNldCA9IHVuZGVmaW5lZFxyXG4gIGxvY2FsT2Zmc2V0ID0gdW5kZWZpbmVkXHJcbiAgYXJyID0gdW5kZWZpbmVkXHJcbiAgcmV0ID0gT0ouZGF0ZVRpbWVNaW5WYWx1ZVxyXG4gIGlmIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5KGRuRGF0ZVN0cilcclxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCcvJywgJycpXHJcbiAgICBkbkRhdGVTdHIgPSBkbkRhdGVTdHIucmVwbGFjZSgnRGF0ZScsICcnKVxyXG4gICAgZG5EYXRlU3RyID0gZG5EYXRlU3RyLnJlcGxhY2UoJygnLCAnJylcclxuICAgIGRuRGF0ZVN0ciA9IGRuRGF0ZVN0ci5yZXBsYWNlKCcpJywgJycpXHJcbiAgICBhcnIgPSBkbkRhdGVTdHIuc3BsaXQoJy0nKVxyXG4gICAgaWYgYXJyLmxlbmd0aCA+IDFcclxuICAgICAgdGlja3MgPSBPSi50by5udW1iZXIoYXJyWzBdKVxyXG4gICAgICBvZmZzZXQgPSBPSi50by5udW1iZXIoYXJyWzFdKVxyXG4gICAgICBsb2NhbE9mZnNldCA9IG5ldyBEYXRlKCkuZ2V0VGltZXpvbmVPZmZzZXQoKVxyXG4gICAgICByZXQgPSBuZXcgRGF0ZSgodGlja3MgLSAoKGxvY2FsT2Zmc2V0ICsgKG9mZnNldCAvIDEwMCAqIDYwKSkgKiAxMDAwKSkpXHJcbiAgICBlbHNlIGlmIGFyci5sZW5ndGggaXMgMVxyXG4gICAgICB0aWNrcyA9IE9KLnRvLm51bWJlcihhcnJbMF0pXHJcbiAgICAgIHJldCA9IG5ldyBEYXRlKHRpY2tzKVxyXG4gIHJldFxyXG5cclxuICBPSi5yZWdpc3RlciAnZ2V0RGF0ZUZyb21Ebkpzb24nLCBnZXREYXRlRnJvbURuSnNvblxyXG4gIG1vZHVsZXMuZXhwb3J0cyA9IGdldERhdGVGcm9tRG5Kc29uXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG4jIFdyYXAgdGhlIGV4ZWN1dGlvbiBvZiBhIG1ldGhvZCBpbiBhIHRyeS4uY2F0Y2guLmZpbmFsbHkgICAgIFxyXG4jIGlnbm9yZSBlcnJvcnMgZmFpbGluZyB0byBleGVjIHNlbGYtZXhlY3V0aW5nIGZ1bmN0aW9ucyBcclxuIyBSZXR1cm4gYSBtZXRob2Qgd3JhcHBlZCBpbiBhIHRyeS4uY2F0Y2guLmZpbmFsbHlcclxudHJ5RXhlYyA9ICh0cnlGdW5jKSAtPlxyXG4gICd1c2Ugc3RyaWN0J1xyXG4gIHJldCA9IGZhbHNlXHJcbiAgdGhhdCA9IHRoaXNcclxuICB0cnlcclxuICAgIHJldCA9IHRyeUZ1bmMuYXBwbHkodGhhdCwgQXJyYXk6OnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSkgIGlmIE9KLmlzLm1ldGhvZCh0cnlGdW5jKVxyXG4gIGNhdGNoIGV4Y2VwdGlvblxyXG4gICAgaWYgKGV4Y2VwdGlvbi5uYW1lIGlzICdUeXBlRXJyb3InIG9yIGV4Y2VwdGlvbi50eXBlIGlzICdjYWxsZWRfbm9uX2NhbGxhYmxlJykgYW5kIGV4Y2VwdGlvbi50eXBlIGlzICdub25fb2JqZWN0X3Byb3BlcnR5X2xvYWQnXHJcbiAgICAgIE9KLmNvbnNvbGUuaW5mbyAnSWdub3JpbmcgZXhjZXB0aW9uOiAnLCBleGNlcHRpb25cclxuICAgIGVsc2VcclxuICAgICAgT0ouY29uc29sZS5lcnJvciBleGNlcHRpb25cclxuICBmaW5hbGx5XHJcblxyXG4gIHJldFxyXG5cclxuXHJcbiBtZXRob2QgPSAodHJ5RnVuYykgLT5cclxuICAndXNlIHN0cmljdCdcclxuICB0aGF0ID0gdGhpc1xyXG4gIC0+XHJcbiAgICBhcmdzID0gQXJyYXk6OnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKVxyXG4gICAgYXJncy51bnNoaWZ0IHRyeUZ1bmNcclxuICAgIE9KLnRyeUV4ZWMuYXBwbHkgdGhhdCwgYXJnc1xyXG5cclxuICBcclxuIFxyXG4gT0oucmVnaXN0ZXIgJ21ldGhvZCcsIG1ldGhvZFxyXG4gT0oucmVnaXN0ZXIgJ3RyeUV4ZWMnLCB0cnlFeGVjXHJcbiBtb2R1bGUuZXhwb3J0cyA9XHJcbiAgbWV0aG9kOiBtZXRob2RcclxuICB0cnlFeGVjOiB0cnlFeGVjXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcblxyXG5udW1iZXIgPSBPYmplY3QuY3JlYXRlKG51bGwpXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnaXNOYU4nLFxyXG4gIHZhbHVlOiAoaWYgKE51bWJlciBhbmQgTnVtYmVyLmlzTmFOKSB0aGVuIE51bWJlci5pc05hTiBlbHNlIGlzTmFOKVxyXG5cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5IG51bWJlciwgJ2lzRmluaXRlJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5pc0Zpbml0ZSkgdGhlbiBOdW1iZXIuaXNGaW5pdGUgZWxzZSBpc0Zpbml0ZSlcclxuXHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSBudW1iZXIsICdNQVhfVkFMVUUnLFxyXG4gIHZhbHVlOiAoaWYgKE51bWJlciBhbmQgTnVtYmVyLk1BWF9WQUxVRSkgdGhlbiBOdW1iZXIuTUFYX1ZBTFVFIGVsc2UgMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDgpXHJcblxyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgbnVtYmVyLCAnTUlOX1ZBTFVFJyxcclxuICB2YWx1ZTogKGlmIChOdW1iZXIgYW5kIE51bWJlci5NSU5fVkFMVUUpIHRoZW4gTnVtYmVyLk1JTl9WQUxVRSBlbHNlIDVlLTMyNClcclxuXHJcbk9KLnJlZ2lzdGVyICdudW1iZXInLCBudW1iZXJcclxubW9kdWxlLmV4cG9ydHMgPSBudW1iZXIiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5pc01ldGhvZCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2lzJ1xucHJvcGVydHkgPSByZXF1aXJlICcuL3Byb3BlcnR5J1xuZnVuYyA9IHJlcXVpcmUgJy4vZnVuY3Rpb24nXG50byA9IHJlcXVpcmUgJy4uL3Rvb2xzL3RvJ1xuXG4jICMgb2JqZWN0XG5cbnJldE9iaiA9IFxuXG4gICMgIyMgW09KXShvai5odG1sKS5vYmplY3RcbiAgIyBjcmVhdGUgYW4gb2JqZWN0IHdpdGggaGVscGVyIGBhZGRgIGFuZCBgZWFjaGAgbWV0aG9kcy5cbiAgb2JqZWN0OiAob2JqID0ge30pIC0+XG4gICAgXG4gICAgIyMjXG4gICAgQWRkIGEgcHJvcGVydHkgdG8gdGhlIG9iamVjdCBhbmQgcmV0dXJuIGl0XG4gICAgIyMjXG4gICAgb2JqLmFkZCA9IChuYW1lLCB2YWwpIC0+XG4gICAgICBwcm9wZXJ0eSBvYmosIG5hbWUsIHZhbFxuICAgICAgb2JqXG5cbiAgICBvYmouYWRkICdlYWNoJywgKGNhbGxiYWNrKSAtPlxyXG4gICAgICBlYWNoID0gcmVxdWlyZSAnLi4vdG9vbHMvZWFjaCdcbiAgICAgIGVhY2ggb2JqLCAodmFsLCBrZXkpIC0+XG4gICAgICAgIGlmIGtleSBpc250ICdlYWNoJyBhbmQga2V5IGlzbnQgJ2FkZCdcbiAgICAgICAgICBjYWxsYmFjayB2YWwsIGtleVxuXG4gICAgb2JqXG5cblxuICAjICMjIFtPSl0ob2ouaHRtbCkuaXNJbnN0YW5jZU9mXG4gICMgZGV0ZXJtaW5lcyBpcyBhIHRoaW5nIGlzIGFuIGluc3RhbmNlIG9mIGEgVGhpbmcsIGFzc3VtaW5nIHRoZSB0aGluZ3Mgd2VyZSBhbGwgY3JlYXRlZCBpbiBPSlxuICBpc0luc3RhbmNlT2Y6IChuYW1lLCBvYmopIC0+XG4gICAgcmV0T2JqLmNvbnRhaW5zKG5hbWUsIG9iaikgYW5kIHRvLmJvb2wob2JqW25hbWVdKVxuXG4gICMgIyMgW09KXShvai5odG1sKS5jb250YWluc1xuICAjIHRydWUgaWYgdGhlIGBvYmplY3RgIGNvbnRhaW5zIHRoZSB2YWx1ZVxuICBjb250YWluczogKG9iamVjdCwgaW5kZXgpIC0+XG4gICAgcmV0ID0gZmFsc2VcbiAgICBpZiBvYmplY3RcbiAgICAgIHJldCA9IF8uY29udGFpbnMgb2JqZWN0LCBpbmRleFxuICAgIHJldFxuXG4gICMgIyMgW09KXShvai5odG1sKS5jb21wYXJlXG4gICMgY29tcGFyZSB0d28gb2JqZWN0cy9hcnJheXMvdmFsdWVzIGZvciBzdHJpY3QgZXF1YWxpdHlcbiAgY29tcGFyZTogKG9iajEsIG9iajIpIC0+XG4gICAgXy5pc0VxdWFsIG9iajEsIG9iajJcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuY2xvbmVcbiAgIyBjb3B5IGFsbCBvZiB0aGUgdmFsdWVzIChyZWN1cnNpdmVseSkgZnJvbSBvbmUgb2JqZWN0IHRvIGFub3RoZXIuXG4gIGNsb25lOiAoZGF0YSkgLT5cbiAgICBfLmNsb25lRGVlcCBkYXRhIHRydWVcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuc2VyaWFsaXplXG4gICMgQ29udmVydCBhbiBvYmplY3QgdG8gYSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBvYmplY3RcbiAgc2VyaWFsaXplOiAoZGF0YSkgLT5cbiAgICByZXQgPSAnJ1xuICAgIGZ1bmMudHJ5RXhlYyAtPlxuICAgICAgcmV0ID0gSlNPTi5zdHJpbmdpZnkoZGF0YSlcbiAgICAgIHJldHVyblxuICAgIHJldCBvciAnJ1xuXG4gICMgIyMgW09KXShvai5odG1sKS5kZXNlcmlhbGl6ZVxuICAjIENvbnZlcnQgYSBKU09OIHN0cmluZyB0byBhbiBvYmplY3RcbiAgZGVzZXJpYWxpemU6IChkYXRhKSAtPlxuICAgIHJldCA9IHt9XG4gICAgaWYgZGF0YVxuICAgICAgZnVuYy50cnlFeGVjIC0+XG4gICAgICAgIHJldCA9ICQucGFyc2VKU09OKGRhdGEpXG4gICAgICAgIHJldHVyblxuXG4gICAgICByZXQgPSB7fSAgaWYgaXNNZXRob2QubnVsbE9yRW1wdHkocmV0KVxuICAgIHJldFxuXG4gICMgIyMgW09KXShvai5odG1sKS5wYXJhbXNcbiAgIyBDb252ZXJ0IGFuIG9iamVjdCB0byBhIGRlbGltaXRlZCBsaXN0IG9mIHBhcmFtZXRlcnMgKG5vcm1hbGx5IHF1ZXJ5LXN0cmluZyBwYXJhbWV0ZXJzKVxuICBwYXJhbXM6IChkYXRhLCBkZWxpbWl0ZXIgPSAnJicpIC0+XG4gICAgcmV0ID0gJydcbiAgICBpZiBkZWxpbWl0ZXIgaXMgJyYnXG4gICAgICBmdW5jLnRyeUV4ZWMgLT5cbiAgICAgICAgcmV0ID0gJC5wYXJhbShkYXRhKVxuICAgICAgICByZXR1cm5cblxuICAgIGVsc2VcclxuICAgICAgZWFjaCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2VhY2gnXG4gICAgICBlYWNoIGRhdGEsICh2YWwsIGtleSkgLT5cbiAgICAgICAgcmV0ICs9IGRlbGltaXRlciAgaWYgcmV0Lmxlbmd0aCA+IDBcbiAgICAgICAgcmV0ICs9IGtleSArICc9JyArIHZhbFxuICAgICAgICByZXR1cm5cblxuICAgIHRvLnN0cmluZyByZXRcblxuICAjICMjIFtPSl0ob2ouaHRtbCkuZXh0ZW5kXG4gICMgY29weSB0aGUgcHJvcGVydGllcyBvZiBvbmUgb2JqZWN0IHRvIGFub3RoZXIgb2JqZWN0XG4gIGV4dGVuZDogKGRlc3RPYmosIHNyY09iaiwgZGVlcENvcHkgPSBmYWxzZSkgLT5cbiAgICByZXQgPSBkZXN0T2JqIG9yIHt9XG4gICAgaWYgZGVlcENvcHkgaXMgdHJ1ZVxuICAgICAgcmV0ID0gJC5leHRlbmQoZGVlcENvcHksIHJldCwgc3JjT2JqKVxuICAgIGVsc2VcbiAgICAgIHJldCA9ICQuZXh0ZW5kKHJldCwgc3JjT2JqKVxuICAgIHJldFxuXG5cbk9KLnJlZ2lzdGVyICdvYmplY3QnLCByZXRPYmoub2JqZWN0XG5PSi5yZWdpc3RlciAnaXNJbnN0YW5jZU9mJywgcmV0T2JqLmlzSW5zdGFuY2VPZlxuT0oucmVnaXN0ZXIgJ2NvbnRhaW5zJywgcmV0T2JqLmNvbnRhaW5zXG5PSi5yZWdpc3RlciAnY29tcGFyZScsIHJldE9iai5jb21wYXJlXG5PSi5yZWdpc3RlciAnY2xvbmUnLCByZXRPYmouY2xvbmVcbk9KLnJlZ2lzdGVyICdzZXJpYWxpemUnLCByZXRPYmouc2VyaWFsaXplXG5PSi5yZWdpc3RlciAnZGVzZXJpYWxpemUnLCByZXRPYmouZGVzZXJpYWxpemVcbk9KLnJlZ2lzdGVyICdwYXJhbXMnLCByZXRPYmoucGFyYW1zXG5PSi5yZWdpc3RlciAnZXh0ZW5kJywgcmV0T2JqLmV4dGVuZFxuXG5tb2R1bGUuZXhwb3J0cyA9IHJldE9iaiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbiMjI1xyXG5BZGQgYSBwcm9wZXJ0eSB0byBhbiBvYmplY3RcclxuICBcclxuIyMjXHJcbnByb3BlcnR5ID0gKG9iaiwgbmFtZSwgdmFsdWUsIHdyaXRhYmxlLCBjb25maWd1cmFibGUsIGVudW1lcmFibGUpIC0+XHJcbiAgdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgZGVmaW5lIGEgcHJvcGVydHkgd2l0aG91dCBhbiBPYmplY3QuJyAgdW5sZXNzIG9ialxyXG4gIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhIHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBwcm9wZXJ0eSBuYW1lLicgIHVubGVzcyBuYW1lP1xyXG4gIG9ialtuYW1lXSA9IHZhbHVlXHJcbiAgb2JqXHJcblxyXG5PSi5yZWdpc3RlciAncHJvcGVydHknLCBwcm9wZXJ0eVxyXG5tb2R1bGUuZXhwb3J0cyA9IHByb3BlcnR5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuZGVsaW1pdGVkU3RyaW5nID0gKHN0cmluZywgb3B0cykgLT5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBuZXdMaW5lVG9EZWxpbWl0ZXI6IHRydWVcclxuICAgIHNwYWNlVG9EZWxpbWl0ZXI6IHRydWVcclxuICAgIHJlbW92ZUR1cGxpY2F0ZXM6IHRydWVcclxuICAgIGRlbGltaXRlcjogXCIsXCJcclxuICAgIGluaXRTdHJpbmc6IE9KLnRvLnN0cmluZyBzdHJpbmdcclxuXHJcbiAgcmV0T2JqID1cclxuICAgIGFycmF5OiBbXVxyXG4gICAgZGVsaW1pdGVkOiAtPlxyXG4gICAgICByZXRPYmouYXJyYXkuam9pbiBkZWZhdWx0cy5kZWxpbWl0ZXJcclxuXHJcbiAgICBzdHJpbmc6IChkZWxpbWl0ZXIgPSBkZWZhdWx0cy5kZWxpbWl0ZXIpIC0+XHJcbiAgICAgIHJldCA9ICcnXHJcbiAgICAgIE9KLmVhY2ggcmV0T2JqLmFycmF5LCAodmFsKSAtPlxyXG4gICAgICAgIHJldCArPSBkZWxpbWl0ZXIgIGlmIHJldC5sZW5ndGggPiAwXHJcbiAgICAgICAgcmV0ICs9IHZhbFxyXG4gICAgICAgIHJldHVyblxyXG5cclxuICAgICAgcmV0XHJcblxyXG4gICAgdG9TdHJpbmc6IC0+XHJcbiAgICAgIHJldE9iai5zdHJpbmcoKVxyXG5cclxuICAgIGFkZDogKHN0cikgLT5cclxuICAgICAgcmV0T2JqLmFycmF5LnB1c2ggZGVmYXVsdHMucGFyc2Uoc3RyKVxyXG4gICAgICBkZWZhdWx0cy5kZWxldGVEdXBsaWNhdGVzKClcclxuICAgICAgcmV0T2JqXHJcblxyXG4gICAgcmVtb3ZlOiAoc3RyKSAtPlxyXG4gICAgICByZW1vdmUgPSAoYXJyYXkpIC0+XHJcbiAgICAgICAgYXJyYXkuZmlsdGVyIChpdGVtKSAtPlxyXG4gICAgICAgICAgdHJ1ZSAgaWYgaXRlbSBpc250IHN0clxyXG5cclxuXHJcbiAgICAgIHJldE9iai5hcnJheSA9IHJlbW92ZShyZXRPYmouYXJyYXkpXHJcbiAgICAgIHJldE9ialxyXG5cclxuICAgIGNvdW50OiAtPlxyXG4gICAgICByZXRPYmouYXJyYXkubGVuZ3RoXHJcblxyXG4gICAgY29udGFpbnM6IChzdHIsIGNhc2VTZW5zaXRpdmUpIC0+XHJcbiAgICAgIGlzQ2FzZVNlbnNpdGl2ZSA9IE9KLnRvLmJvb2woY2FzZVNlbnNpdGl2ZSlcclxuICAgICAgc3RyID0gT0oudG8uc3RyaW5nKHN0cikudHJpbSgpXHJcbiAgICAgIHN0ciA9IHN0ci50b0xvd2VyQ2FzZSgpICBpZiBmYWxzZSBpcyBpc0Nhc2VTZW5zaXRpdmVcclxuICAgICAgbWF0Y2ggPSByZXRPYmouYXJyYXkuZmlsdGVyKChtYXRTdHIpIC0+XHJcbiAgICAgICAgKGlzQ2FzZVNlbnNpdGl2ZSBhbmQgT0oudG8uc3RyaW5nKG1hdFN0cikudHJpbSgpIGlzIHN0cikgb3IgT0oudG8uc3RyaW5nKG1hdFN0cikudHJpbSgpLnRvTG93ZXJDYXNlKCkgaXMgc3RyXHJcbiAgICAgIClcclxuICAgICAgbWF0Y2gubGVuZ3RoID4gMFxyXG5cclxuICAgIGVhY2g6IChjYWxsQmFjaykgLT5cclxuICAgICAgcmV0T2JqLmFycmF5LmZvckVhY2ggY2FsbEJhY2tcclxuXHJcbiAgZGVmYXVsdHMucGFyc2UgPSAoc3RyKSAtPlxyXG4gICAgcmV0ID0gT0oudG8uc3RyaW5nKHN0cilcclxuICAgIHJldCA9IHJldC5yZXBsYWNlKC9cXG4vZywgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCJcXG5cIikgaXNudCAtMSAgaWYgZGVmYXVsdHMubmV3TGluZVRvRGVsaW1pdGVyXHJcbiAgICByZXQgPSByZXQucmVwbGFjZShSZWdFeHAoXCIgXCIsIFwiZ1wiKSwgZGVmYXVsdHMuZGVsaW1pdGVyKSAgd2hpbGUgcmV0LmluZGV4T2YoXCIgXCIpIGlzbnQgLTEgIGlmIGRlZmF1bHRzLnNwYWNlVG9EZWxpbWl0ZXJcclxuICAgIHJldCA9IHJldC5yZXBsYWNlKC8sLC9nLCBkZWZhdWx0cy5kZWxpbWl0ZXIpICB3aGlsZSByZXQuaW5kZXhPZihcIiwsXCIpIGlzbnQgLTFcclxuICAgIHJldFxyXG5cclxuICBkZWZhdWx0cy5kZWxldGVEdXBsaWNhdGVzID0gLT5cclxuICAgIGlmIGRlZmF1bHRzLnJlbW92ZUR1cGxpY2F0ZXNcclxuICAgICAgKC0+XHJcbiAgICAgICAgdW5pcXVlID0gKGFycmF5KSAtPlxyXG4gICAgICAgICAgc2VlbiA9IG5ldyBTZXQoKVxyXG4gICAgICAgICAgYXJyYXkuZmlsdGVyIChpdGVtKSAtPlxyXG4gICAgICAgICAgICBpZiBmYWxzZSBpcyBzZWVuLmhhcyhpdGVtKVxyXG4gICAgICAgICAgICAgIHNlZW4uYWRkIGl0ZW1cclxuICAgICAgICAgICAgICB0cnVlXHJcblxyXG5cclxuICAgICAgICByZXRPYmouYXJyYXkgPSB1bmlxdWUocmV0T2JqLmFycmF5KVxyXG4gICAgICAgIHJldHVyblxyXG4gICAgICApKClcclxuICAgIHJldHVyblxyXG5cclxuICAoKGEpIC0+XHJcbiAgICBpZiBhLmxlbmd0aCA+IDEgYW5kIGZhbHNlIGlzIE9KLmlzLnBsYWluT2JqZWN0KG9wdHMpXHJcbiAgICAgIE9KLmVhY2ggYSwgKHZhbCkgLT5cclxuICAgICAgICByZXRPYmouYXJyYXkucHVzaCB2YWwgIGlmIGZhbHNlIGlzIE9KLmlzLm51bGxPckVtcHR5KHZhbClcclxuICAgICAgICByZXR1cm5cclxuXHJcbiAgICBlbHNlIGlmIHN0cmluZyBhbmQgc3RyaW5nLmxlbmd0aCA+IDBcclxuICAgICAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRzXHJcbiAgICAgIGRlbGltaXRlZFN0cmluZyA9IGRlZmF1bHRzLnBhcnNlKHN0cmluZylcclxuICAgICAgZGVmYXVsdHMuaW5pdFN0cmluZyA9IGRlbGltaXRlZFN0cmluZ1xyXG4gICAgICByZXRPYmouYXJyYXkgPSBkZWxpbWl0ZWRTdHJpbmcuc3BsaXQoZGVmYXVsdHMuZGVsaW1pdGVyKVxyXG4gICAgZGVmYXVsdHMuZGVsZXRlRHVwbGljYXRlcygpXHJcbiAgICByZXR1cm5cclxuICApIGFyZ3VtZW50c1xyXG4gIHJldE9ialxyXG5cclxuXHJcbk9KLnJlZ2lzdGVyICdkZWxpbWl0ZWRTdHJpbmcnLCBkZWxpbWl0ZWRTdHJpbmdcclxubW9kdWxlLmV4cG9ydHMgPSBkZWxpbWl0ZWRTdHJpbmciLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4kID0gcmVxdWlyZSAnanF1ZXJ5J1xyXG5cclxuIyAjIGRvbVxyXG5cclxuXHJcbiMgRXh0ZW5kIGFuIG9iamVjdCB3aXRoIE9KIERPTSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXHJcblxyXG4jIC0gYEBlbGAgT2JqZWN0IHRvIGV4dGVuZFxyXG4jIC0gYHBhcmVudGAgcGFyZW50IG9iamVjdCB0byB3aGljaCBgQGVsYCB3aWxsIGJlIGFwcGVuZGVkXHJcbmNsYXNzIE5vZGVcclxuICBcclxuICAjcGFyZW50OiByZXF1aXJlKCcuL2JvZHknKVxyXG4gIFxyXG4gIGNvbnN0cnVjdG9yOiAoQGVsLCBAcGFyZW50KSAtPlxyXG4gICAgZW5hYmxlZCA9IHRydWVcclxuICAgIEB0YWdOYW1lID0gQGVsLnRhZ05hbWVcclxuICAgIEBbJyQnXSA9ICQoQGVsLmdldCgpKVxyXG4gICAgQFsnMCddID0gQGVsLmdldCgpXHJcblxyXG4gIGFwcGVuZDogKHBhcmFtcy4uLikgLT5cclxuICAgIEBlbC5hcHBlbmQgcGFyYW1zLi4uXHJcblxyXG4gIHByZXBlbmQ6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAZWwucHJlcGVuZCBwYXJhbXMuLi5cclxuXHJcbiAgcmVtb3ZlOiAocGFyYW1zLi4uKSAtPlxyXG4gICAgQGVsLnJlbW92ZSBwYXJhbXMuLi5cclxuXHJcbiAgY3NzOiAocGFyYW1zLi4uKSAtPlxyXG4gICAgQGVsLmNzcyBwYXJhbXMuLi5cclxuXHJcbiAgaHRtbDogKHBhcmFtcy4uLikgLT5cclxuICAgIEBlbC5odG1sIHBhcmFtcy4uLlxyXG5cclxuICB0ZXh0OiAocGFyYW1zLi4uKSAtPlxyXG4gICAgQGVsLnRleHQgcGFyYW1zLi4uXHJcblxyXG4gIGF0dHI6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAZWwuYXR0ciBwYXJhbXMuLi5cclxuXHJcbiAgZGF0YTogKHBhcmFtcy4uLikgLT5cclxuICAgIEBlbC5kYXRhIHBhcmFtcy4uLlxyXG5cclxuICBnZXQ6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAZWwuZ2V0IHBhcmFtcy4uLlxyXG5cclxuICBhZGQ6IChrZXksIHZhbCkgLT5cclxuICAgIEBba2V5XSA9IHZhbFxyXG5cclxuICBpc0NvbnRyb2xTdGlsbFZhbGlkOiAtPlxyXG4gICAgaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcclxuICAgIHZhbGlkID0gZmFsc2UgaXMgaXNNZXRob2QubnVsbE9yRW1wdHkoQGVsKSBhbmQgQGlzVmFsaWQoKVxyXG4gICAgdGhyb3cgbmV3IEVycm9yICdlbCBpcyBudWxsLiBFdmVudCBiaW5kaW5ncyBtYXkgbm90IGhhdmUgYmVlbiBHQ2QuJyAgaWYgZmFsc2UgaXMgdmFsaWRcclxuICAgIHZhbGlkXHJcblxyXG4gICMgIyMgaXNWYWxpZFxyXG4gIGlzVmFsaWQ6IC0+XHJcbiAgICBAZWwgYW5kIChAZWwuZWwgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCBvciBAZWwuZWwgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KVxyXG5cclxuICAjICMjIGFkZENsYXNzXHJcbiAgIyBBZGQgYSBDU1MgY2xhc3MgdG8gYW4gZWxlbWVudFxyXG5cclxuICAjIC0gYG5hbWVgIHRoZSBuYW1lIG9mIHRoZSBjbGFzcyB0byBhZGRcclxuICBhZGRDbGFzczogKG5hbWUpIC0+XHJcbiAgICBAWyckJ10uYWRkQ2xhc3MgbmFtZSBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgYmluZFxyXG4gICMgQmluZCBhbiBhY3Rpb24gdG8gYSBqUXVlcnkgZWxlbWVudCdzIGV2ZW50LlxyXG4gIGJpbmQ6IChldmVudE5hbWUsIGV2ZW50KSAtPlxyXG4gICAgQG9uIGV2ZW50TmFtZSwgZXZlbnRcclxuXHJcblxyXG4gICMgIyMga2V5Ym9hcmRcclxuICAjIEJpbmQgYW4gZXZlbnQgdG8gYSBrZXksIHdoZW4gcHJlc3NlZCBpbiB0aGlzIGNvbnRyb2wuXHJcbiAgIyBUaGUgT0ogb2JqZWN0IChmb3IgY2hhaW5pbmcpXHJcbiAga2V5Ym9hcmQ6IChrZXlzLCBldmVudCkgLT5cclxuICAgICNNb3VzZXRyYXAuYmluZCBrZXlzLCBAZWxbZXZlbnRdICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgZGlzYWJsZVxyXG4gICMgRGlzYWJsZSB0aGUgZWxlbWVudC5cclxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcclxuICBkaXNhYmxlOiA9PlxyXG4gICAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBlbmFibGVkID0gZmFsc2VcclxuICAgICAgQGF0dHIgJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJ1xyXG4gICAgICBAYWRkQ2xhc3MgJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJ1xyXG4gICAgQFxyXG5cclxuICAjICMjIGVtcHR5XHJcbiAgIyBFbXB0eSB0aGUgZWxlbWVudC5cclxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcclxuICBlbXB0eTogLT5cclxuICAgIEBbJyQnXS5lbXB0eSgpIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyBlbmFibGVcclxuICAjIEVuYWJsZSB0aGUgZWxlbWVudC5cclxuICAjIFRoZSBPSiBvYmplY3QgKGZvciBjaGFpbmluZylcclxuICBlbmFibGU6IC0+XHJcbiAgICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGVuYWJsZWQgPSB0cnVlXHJcbiAgICAgIEByZW1vdmVBdHRyICdkaXNhYmxlZCdcclxuICAgICAgQHJlbW92ZUNsYXNzICdkaXNhYmxlZCdcclxuICAgIEBcclxuXHJcbiAgIyAjIyBnZXRJZFxyXG4gICMgR2V0IHRoZSBET00gRWxlbWVudCBJRCBvZiB0aGlzIG9iamVjdC5cclxuICBnZXRJZDogLT5cclxuICAgIGlkID0gQFswXS5pZCAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgaWRcclxuXHJcbiAgaGFzQ2xhc3M6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBAWyckJ10uaGFzQ2xhc3MgcGFyYW1zLi4uXHJcblxyXG4gICMgIyMgaGlkZVxyXG4gICMgTWFrZSB0aGUgZWxlbWVudCBpbnZpc2libGUuXHJcbiAgaGlkZTogLT5cclxuICAgIEBjc3MgJ2Rpc3BsYXknLCAnbm9uZScgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyBsZW5ndGhcclxuICAjIEdldCB0aGUgbGVuZ3RoIG9mIHRoaXMgZWxlbWVudC5cclxuICBsZW5ndGg6IC0+XHJcbiAgICB0byA9IHJlcXVpcmUgJy4uL3Rvb2xzL3RvJ1xyXG4gICAgbGVuID0gMFxyXG4gICAgbGVuID0gdG8ubnVtYmVyKEBbJyQnXS5sZW5ndGgpICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBsZW5cclxuICBcclxuICAjICMjIG9uXHJcbiAgb246IChldmVudE5hbWUsIGV2ZW50KSAtPlxyXG4gICAgQFsnJCddLm9uIGV2ZW50TmFtZSwgZXZlbnQgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyBvZmZcclxuICBvZmY6IChldmVudE5hbWUsIGV2ZW50KSAtPlxyXG4gICAgQFsnJCddLm9mZiBldmVudE5hbWUsIGV2ZW50ICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAZWxcclxuXHJcbiAgcHJvcDogKHBhcmFtcy4uLikgLT5cclxuICAgIEBbJyQnXS5wcm9wIHBhcmFtcy4uLlxyXG5cclxuICAjICMjIHJlbW92ZVxyXG4gICMgUmVtb3ZlIHRoZSBub2RlIGZyb20gdGhlIERPTVxyXG4gIHJlbW92ZTogLT5cclxuICAgIGlmIEBlbCBhbmQgQFsnJCddXHJcbiAgICAgIEBbJyQnXS5yZW1vdmUoKVxyXG5cclxuICAgICAgIyBTZXQgdGhlIHZhbHVlIG9mIEBlbCB0byBudWxsIHRvIGd1YXJhbnRlZSB0aGF0IGlzQ29udHJvbFN0aWxsVmFsaWQgd2lsbCBiZSBjb3JyZWN0XHJcbiAgICAgIEBlbCA9IG51bGxcclxuICAgICAgQFsnJCddID0gbnVsbFxyXG4gICAgICBAWzBdID0gbnVsbFxyXG4gICAgbnVsbFxyXG5cclxuICAjICMjIHJlbW92ZUNsYXNzXHJcbiAgIyBSZW1vdmUgYSBDU1MgY2xhc3MgZnJvbSBhbiBlbGVtZW50LlxyXG4gIHJlbW92ZUNsYXNzOiAobmFtZSkgLT5cclxuICAgIEBbJyQnXS5yZW1vdmVDbGFzcyBuYW1lICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgcmVtb3ZlUHJvcFxyXG4gICMgUmVtb3ZlIGEgcHJvcGVydHkgZnJvbSBhbiBlbGVtZW50LiBqUXVlcnkgZGlzdGluZ3Vpc2hlcyBiZXR3ZWVuICdwcm9wcycgYW5kICdhdHRyJzsgaGVuY2UgMiBtZXRob2RzLlxyXG4gIHJlbW92ZVByb3A6IChuYW1lKSAtPlxyXG4gICAgQFsnJCddLnJlbW92ZVByb3AgbmFtZSAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgQFxyXG5cclxuICAjICMjIHJlbW92ZUF0dHJcclxuICAjIFJlbW92ZSBhIHByb3BlcnR5IGZyb20gYW4gZWxlbWVudC4galF1ZXJ5IGRpc3Rpbmd1aXNoZXMgYmV0d2VlbiAncHJvcHMnIGFuZCAnYXR0cic7IGhlbmNlIDIgbWV0aG9kcy5cclxuICByZW1vdmVBdHRyOiAobmFtZSkgLT5cclxuICAgIEBbJyQnXS5yZW1vdmVBdHRyIG5hbWUgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyByZXF1aXJlZFxyXG4gICMgTWFyayB0aGUgcmVxdWlyZWQgc3RhdHVzIG9mIHRoZSBlbGVtZW50LlxyXG4gIHJlcXVpcmVkOiAodHJ1dGh5LCBhZGRMYWJlbCkgLT5cclxuICAgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgICAgdG8gPSByZXF1aXJlICcuLi90b29scy90bydcclxuICAgICAgc3dpdGNoIHRvLmJvb2wodHJ1dGh5KVxyXG4gICAgICAgIHdoZW4gdHJ1ZVxyXG4gICAgICAgICAgQGF0dHIgJ3JlcXVpcmVkJywgdHJ1ZVxyXG4gICAgICAgICAgQGFkZENsYXNzICdyZXF1aXJlZCdcclxuICAgICAgICB3aGVuIGZhbHNlXHJcbiAgICAgICAgICBAcmVtb3ZlUHJvcCAncmVxdWlyZWQnXHJcbiAgICAgICAgICBAcmVtb3ZlQ2xhc3MgJ3JlcXVpcmVkJ1xyXG4gICAgQFsnJCddXHJcbiAgXHJcbiAgIyAjIyBzaG93XHJcbiAgIyBNYWtlIHRoZSBlbGVtZW50IHZpc2libGUuXHJcbiAgc2hvdzogLT5cclxuICAgIEBbJyQnXS5zaG93KCkgIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyB0b2dnbGVcclxuICAjIFRvZ2dsZSB2aXNpYmlsaXR5XHJcbiAgdG9nZ2xlOiAtPlxyXG4gICAgQFsnJCddLnRvZ2dsZSgpICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBcclxuICBAdG9nZ2xlQ2xhc3M6IChwYXJhbXMuLi4pLT5cclxuICAgIEBbJyQnXS50b2dnbGVDbGFzcyBwYXJhbXMuLi4gIGlmIEBpc0NvbnRyb2xTdGlsbFZhbGlkKClcclxuICAgIEBcclxuXHJcbiAgIyAjIyB0b2dnbGVFbmFibGVcclxuICAjIFRvZ2dsZSB0aGUgZWxlbWVudCdzIGVuYWJsZWQgc3RhdGUuXHJcbiAgdG9nZ2xlRW5hYmxlOiAtPlxyXG4gICAgaWYgQGlzQ29udHJvbFN0aWxsVmFsaWQoKVxyXG4gICAgICBpZiBlbmFibGVkXHJcbiAgICAgICAgQGRpc2FibGUoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgQGVuYWJsZSgpXHJcbiAgICBAXHJcblxyXG4gICMgIyMgdHJpZ2dlclxyXG4gICMgVHJpZ2dlciBhbiBldmVudCBib3VuZCB0byBhIGpRdWVyeSBlbGVtZW50LlxyXG4gIHRyaWdnZXI6IChldmVudE5hbWUsIGV2ZW50T3B0cykgLT5cclxuICAgIEBbJyQnXS50cmlnZ2VyIGV2ZW50TmFtZSwgZXZlbnRPcHRzICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICBAZWxcclxuXHJcbiAgIyAjIyB1bmJpbmRcclxuICAjIFdyYXBwZXIgYXJvdW5kIGBvZmZgXHJcbiAgdW5iaW5kOiAoZXZlbnROYW1lLCBldmVudCkgLT5cclxuICAgIEBvZmYgZXZlbnROYW1lLCBldmVudFxyXG5cclxuICAjICMjIHZhbFxyXG4gICMgR2V0IG9yIHNldCB0aGUgdmFsdWUgb2YgdGhlIGVsZW1lbnQuXHJcbiAgdmFsOiAodmFsdWUpIC0+XHJcbiAgICByZXQgPSBAXHJcbiAgICBpZiBAaXNDb250cm9sU3RpbGxWYWxpZCgpXHJcbiAgICAgIGlzTWV0aG9kID0gcmVxdWlyZSAnLi4vdG9vbHMvaXMnXHJcbiAgICAgIGlmIGFyZ3VtZW50cy5sZW5ndGggaXMgMSBhbmQgZmFsc2UgaXMgaXNNZXRob2QubnVsbE9yVW5kZWZpbmVkKHZhbHVlKVxyXG4gICAgICAgIEBbJyQnXS52YWwgdmFsdWVcclxuICAgICAgZWxzZVxyXG4gICAgICAgIHJldCA9IEBbJyQnXS52YWwoKVxyXG4gICAgcmV0XHJcbiAgICBcclxuICAjICMjIHZhbHVlT2ZcclxuICAjIHdyYXBwZXIgYXJvdW5kIGB2YWxgXHJcbiAgdmFsdWVPZjogLT5cclxuICAgIEB2YWwoKVxyXG5cclxuICAjICMjIHRvU3RyaW5nXHJcbiAgIyB3cmFwcGVyIGFyb3VuZCBgdmFsYFxyXG4gIHRvU3RyaW5nOiAtPlxyXG4gICAgQHZhbCgpXHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBOb2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuVGhpbkRPTSA9IHJlcXVpcmUgJ3RoaW5kb20nXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxuXHJcblxyXG4jIyNcclxuUGVyc2lzdCBhIGhhbmRsZSBvbiB0aGUgYm9keSBub2RlXHJcbiMjI1xyXG5pZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJyB0aGVuIGJvZHkgPSBkb2N1bWVudC5ib2R5IGVsc2UgYm9keSA9IG51bGxcclxuYm9keSA9IG5ldyBUaGluRE9NIG51bGwsIGlkOiAnYm9keScsIGJvZHlcclxuYm9keS50YWdOYW1lID0gJ2JvZHknXHJcbnRoaW5Cb2R5ID0gbm9kZUZhY3RvcnkgYm9keSwge31cclxuICBcclxuT0oucmVnaXN0ZXIgJ2JvZHknLCB0aGluQm9keVxyXG5tb2R1bGUuZXhwb3J0cyA9IHRoaW5Cb2R5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuL25vZGVGYWN0b3J5J1xyXG5vYmogPSByZXF1aXJlICcuLi9jb3JlL29iamVjdCdcclxuXHJcbiMgIyBjb21wb25lbnRcclxuXHJcblxyXG4jIENyZWF0ZSBhbiBIVE1MIFdlYiBDb21wb25lbnQgdGhyb3VnaCBUaGluRG9tXHJcblxyXG4jIC0gYG9wdGlvbnNgIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHN0YW5kYXJkIG9wdGlvbnMgdG8gYmUgcGFzc2VkIGludG8gdGhlIGNvbXBvbmVudFxyXG4jIC0tIGByb290Tm9kZVR5cGVgOiB0aGUgdGFnIG5hbWUgb2YgdGhlIHJvb3Qgbm9kZSB0byBjcmVhdGUsIGRlZmF1bHQgPSAnZGl2J1xyXG4jIC0tIGBwcm9wc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIERPTSBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXHJcbiMgLS0gYHN0eWxlc2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIENTUyBhdHRyaWJ1dGVzIHRvIGFwcGVuZCB0byB0aGUgcm9vdCBub2RlXHJcbiMgLS0gYGV2ZW50c2A6IGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIG5hbWVkIERPTSBldmVudHMgKGFuZCBjb3JyZXNwb25kaW5nIGNhbGxiYWNrIG1ldGhvZHMpIHRvIGJpbmQgdG8gdGhlIHJvb3Qgbm9kZVxyXG4jIC0gYG93bmVyYCB0aGUgcGFyZW50IHRvIHdoaWNoIHRoZSBjb21wb25lbnQgbm9kZSB3aWxsIGJlIGFwcGVuZGVkXHJcbiMgLSBgdGFnTmFtZWAgdGhlIG5hbWUgb2Ygb2YgdGhlIGNvbXBvbmVudCwgd2hpY2ggd2lsbCBhbHdheXMgYmUgcHJlZml4ZWQgd2l0aCAneC0nXHJcbmNvbXBvbmVudCA9IChvcHRpb25zID0gb2JqLm9iamVjdCgpLCBvd25lciwgdGFnTmFtZSkgLT5cclxuXHJcbiAgaWYgbm90IHRhZ05hbWUuc3RhcnRzV2l0aCAneC0nIHRoZW4gdGFnTmFtZSA9ICd4LScgKyB0YWdOYW1lXHJcbiAgIyB3ZWIgY29tcG9uZW50cyBhcmUgcmVhbGx5IGp1c3Qgb3JkaW5hcnkgT0ogW2VsZW1lbnRdKGVsZW1lbnQuaHRtbCkncyB3aXRoIGEgc3BlY2lhbCBuYW1lLlxyXG4gICMgVW50aWwgSFRNTCBXZWIgQ29tcG9uZW50cyBhcmUgZnVsbHkgc3VwcG9ydGVkIChhbmQgT0ogaXMgcmVmYWN0b3JlZCBhY2NvcmRpbmdseSksIHRoZSBlbGVtZW50IHdpbGwgYmUgdHJlYXRlZCBhcyBhbiB1bmtub3duIGVsZW1lbnQuXHJcbiAgIyBJbiBtb3N0IGNhc2VzLCB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiB0aGUgYnJvd3NlciBpcyBhY2NlcHRhYmxlIChzZWUgYWxzbyBbSFRNTCBTZW1hbnRpY3NdKGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vc2VtYW50aWNzLmh0bWwpKSwgYnV0XHJcbiAgIyBpbiBzb21lIGNhc2VzIHRoaXMgaXMgcHJvYmxlbWF0aWMgKGZpcnN0bHksIGJlY2F1c2UgdGhlc2UgZWxlbWVudHMgYXJlIGFsd2F5cyByZW5kZXJlZCBpbmxpbmUpLlxyXG4gICMgSW4gc3VjaCBjb25kaXRpb25zLCB0aGUgW2NvbnRyb2xzXShjb250cm9scy5odG1sKSBjbGFzcyBhbmQgbmFtZSBzcGFjZSBpcyBiZXR0ZXIgc3VpdGVkIHRvIGNsYXNzZXMgd2hpY2ggcmVxdWlyZSBjb21wbGV0ZSBjb250cm9sIChlLmcuIFtpY29uXShpY29uLmh0bWwpKS5cclxuICB3aWRnZXQgPSBub2RlRmFjdG9yeSB0YWdOYW1lLCBvYmoub2JqZWN0KCksIG93bmVyLCBmYWxzZSAjLCBvcHRpb25zLnByb3BzLCBvcHRpb25zLnN0eWxlcywgb3B0aW9ucy5ldmVudHMsIG9wdGlvbnMudGV4dFxyXG4gIFxyXG4gICMgU2luY2UgdGhlIGJlaGF2aW9yIG9mIHN0eWxpbmcgaXMgbm90IHdlbGwgY29udHJvbGxlZC9jb250cm9sbGFibGUgb24gdW5rbm93biBlbGVtZW50cywgaXQgaXMgbmVjZXNzYXJ5IHRvIGNyZWF0ZSBhIHJvb3Qgbm9kZSBmb3IgdGhlIGNvbXBvbmVudC5cclxuICAjIEluIG1vc3QgY2FzZXMsIFtkaXZdKGRpdi5odG1sKSBpcyBwZXJmZWN0bHkgYWNjZXB0YWJsZSwgYnV0IHRoaXMgaXMgY29uZmlndXJhYmxlIGF0IHRoZSBuYW1lIHNwYWNlIGxldmVsIG9yIGF0IHJ1bnRpbWUuXHJcbiAgcm9vdE5vZGVUeXBlID0gb3B0aW9ucy5yb290Tm9kZVR5cGUgb3IgT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSBvciAnZGl2J1xyXG5cclxuICAjIGByZXRgIGlzIHRoZSB0aGUgaW5zdGFuY2Ugb2YgdGhlIHJvb3ROb2RlVHlwZSwgbm90IHRoZSBgd2lkZ2V0YCB3cmFwcGVkIGluIHRoaXMgY2xvc3VyZVxyXG4gIHJldCA9IHdpZGdldC5tYWtlIHJvb3ROb2RlVHlwZSwgb3B0aW9uc1xyXG5cclxuICAjIGZvciBjb252ZW5pZW5jZSBhbmQgZGVidWdnaW5nLCBwZXJzaXN0IHRoZSB0YWdOYW1lXHJcbiAgcmV0LmNvbXBvbmVudE5hbWUgPSB0YWdOYW1lXHJcblxyXG4gICMgYHJlbW92ZWAgZG9lcywgaG93ZXZlciwgYmVoYXZlIGFzIGV4cGVjdGVkIGJ5IHJlbW92aW5nIGB3aWRnZXRgXHJcbiAgcmV0LnJlbW92ZSA9IHdpZGdldC5yZW1vdmVcclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdjb21wb25lbnQnLCBjb21wb25lbnRcclxubW9kdWxlLmV4cG9ydHMgPSBjb21wb25lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5cclxuIyMjXHJcbkNyZWF0ZSBhIHNldCBvZiBIVE1MIEVsZW1lbnRzIHRocm91Z2ggVGhpbkRvbVxyXG4jIyNcclxuY29udHJvbCA9IChvcHRpb25zID0gb2JqLm9iamVjdCgpLCBvd25lciwgdGFnTmFtZSkgLT5cclxuICBpZiBub3QgdGFnTmFtZS5zdGFydHNXaXRoICd5LScgdGhlbiB0YWdOYW1lID0gJ3ktJyArIHRhZ05hbWVcclxuXHJcbiAgcm9vdE5vZGVUeXBlID0gb3B0aW9ucy5yb290Tm9kZVR5cGUgb3IgT0pbJ0RFRkFVTFRfQ09NUE9ORU5UX1JPT1RfTk9ERVRZUEUnXSBvciAnZGl2J1xyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSByb290Tm9kZVR5cGUsIG9wdGlvbnMsIG93bmVyLCBmYWxzZVxyXG5cclxuICByZXQuYWRkICdjb250cm9sTmFtZScsIHRhZ05hbWVcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5yZWdpc3RlciAnY29udHJvbCcsIGNvbnRyb2xcclxubW9kdWxlLmV4cG9ydHMgPSBjb250cm9sIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuXHJcblRoaW5ET00gPSByZXF1aXJlICd0aGluZG9tJ1xyXG5cclxuIyAjIGVsZW1lbnRcclxuXHJcbmVsZW1lbnQgPSBcclxuICAjICMjIHJlc3RvcmVFbGVtZW50XHJcbiAgIyMjXHJcbiAgUmVzdG9yZSBhbiBIVE1MIEVsZW1lbnQgdGhyb3VnaCBUaGluRG9tXHJcbiAgIyMjXHJcbiAgcmVzdG9yZUVsZW1lbnQ6IChlbCwgdGFnID0gZWwubm9kZU5hbWUpIC0+XHJcbiAgICBub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcbiAgICB0RCA9IG5ldyBUaGluRE9NIG51bGwsIG51bGwsIGVsXHJcbiAgICB0RC5pc0luRE9NID0gdHJ1ZVxyXG4gICAgcmV0ID0gbm9kZUZhY3RvcnkgdERcclxuICAgIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ3Jlc3RvcmVFbGVtZW50JywgZWxlbWVudC5yZXN0b3JlRWxlbWVudFxyXG5cclxuT0oucmVnaXN0ZXIgJ2lzRWxlbWVudEluRG9tJywgKGVsZW1lbnRJZCkgLT5cclxuICBmYWxzZSBpcyBPSi5pcy5udWxsT3JFbXB0eSBPSi5nZXRFbGVtZW50IGVsZW1lbnRJZFxyXG5cclxuT0oucmVnaXN0ZXIgJ2dldEVsZW1lbnQnLCAoaWQpIC0+XHJcbiAgaWYgdHlwZW9mIGRvY3VtZW50IGlzbnQgJ3VuZGVmaW5lZCdcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZWxlbWVudCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBmcmFnbWVudFxyXG5cclxuIyBDcmVhdGUgYSBkb2N1bWVudCBmcmFnbWVudCBhbmQgcmV0dXJuIGl0IGFzIGFuIE9KIG5vZGVcclxuZnJhZ21lbnQgPSAtPlxyXG4gIHJldCA9IG51bGxcclxuICBpZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xyXG4gICAgZnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcclxuICAgIFxyXG4gICAgZnJhZyA9IG5ldyBUaGluRE9NIG51bGwsIG51bGwsIGZyYWdtZW50XHJcbiAgICBmcmFnLmlzSW5ET00gPSB0cnVlXHJcbiAgICByZXQgPSBub2RlRmFjdG9yeSBmcmFnXHJcbiAgICBcclxuICByZXRcclxuXHJcbk9KLnJlZ2lzdGVyICdmcmFnbWVudCcsIGZyYWdtZW50XHJcbm1vZHVsZS5leHBvcnRzID0gZnJhZ21lbnQiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5yZXF1aXJlICcuLi9vakluaXQnXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgZ2VuZXJpYyBub2Rlc1xyXG5cclxuY2xvc2VkID0gW1xyXG4gICdhYmJyJ1xyXG4gICdhY3JvbnltJ1xyXG4gICdhcHBsZXQnXHJcbiAgJ2FydGljbGUnXHJcbiAgJ2FzaWRlJ1xyXG4gICdhdWRpbydcclxuICAnYidcclxuICAnYmRvJ1xyXG4gICdiaWcnXHJcbiAgJ2Jsb2NrcXVvdGUnXHJcbiAgJ2J1dHRvbidcclxuICAnY2FudmFzJ1xyXG4gICdjYXB0aW9uJ1xyXG4gICdjZW50ZXInXHJcbiAgJ2NpdGUnXHJcbiAgJ2NvZGUnXHJcbiAgJ2NvbGdyb3VwJ1xyXG4gICdkYXRhbGlzdCdcclxuICAnZGQnXHJcbiAgJ2RlbCdcclxuICAnZGV0YWlscydcclxuICAnZGZuJ1xyXG4gICdkaXInXHJcbiAgJ2RpdidcclxuICAnZGwnXHJcbiAgJ2R0J1xyXG4gICdlbSdcclxuICAnZmllbGRzZXQnXHJcbiAgJ2ZpZ2NhcHRpb24nXHJcbiAgJ2ZpZ3VyZSdcclxuICAnZm9udCdcclxuICAnZm9vdGVyJ1xyXG4gICdoMSdcclxuICAnaDInXHJcbiAgJ2gzJ1xyXG4gICdoNCdcclxuICAnaDUnXHJcbiAgJ2g2J1xyXG4gICdoZWFkJ1xyXG4gICdoZWFkZXInXHJcbiAgJ2hncm91cCdcclxuICAnaHRtbCdcclxuICAnaSdcclxuICAnaWZyYW1lJ1xyXG4gICdpbnMnXHJcbiAgJ2tiZCdcclxuICAnbGFiZWwnXHJcbiAgJ2xlZ2VuZCdcclxuICAnbGknXHJcbiAgJ21hcCdcclxuICAnbWFyaydcclxuICAnbWVudSdcclxuICAnbWV0ZXInXHJcbiAgJ25hdidcclxuICAnbm9mcmFtZXMnXHJcbiAgJ25vc2NyaXB0J1xyXG4gICdvYmplY3QnXHJcbiAgJ29wdGdyb3VwJ1xyXG4gICdvcHRpb24nXHJcbiAgJ291dHB1dCdcclxuICAncCdcclxuICAncHJlJ1xyXG4gICdwcm9ncmVzcydcclxuICAncSdcclxuICAncnAnXHJcbiAgJ3J0J1xyXG4gICdydWJ5J1xyXG4gICdzJ1xyXG4gICdzYW1wJ1xyXG4gICdzZWN0aW9uJ1xyXG4gICdzbWFsbCdcclxuICAnc3BhbidcclxuICAnc3RyaWtlJ1xyXG4gICdzdHJvbmcnXHJcbiAgJ3N0eWxlJ1xyXG4gICdzdWInXHJcbiAgJ3N1bW1hcnknXHJcbiAgJ3N1cCdcclxuICAndGJvZHknXHJcbiAgJ3RkJ1xyXG4gICd0Zm9vdCdcclxuICAndGgnXHJcbiAgJ3RpbWUnXHJcbiAgJ3RpdGxlJ1xyXG4gICd0cidcclxuICAndHQnXHJcbiAgJ3UnXHJcbiAgJ3ZhcidcclxuICAndmlkZW8nXHJcbiAgJ3htcCdcclxuXVxyXG5vcGVuID0gJ2FyZWEgYmFzZSBjb2wgY29tbWFuZCBjc3MgZW1iZWQgaHIgaW1nIGtleWdlbiBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnInLnNwbGl0ICcgJ1xyXG5hbGwgPSBjbG9zZWQuY29uY2F0IG9wZW5cclxuXHJcbmV4cG9ydHMgPSB7fVxyXG4jIHJlZ2lzdGVyIHNlbWFudGljL3N0cnVjdHVyYWwgYWxpYXNlc1xyXG5mb3IgbG9vcE5hbWUgaW4gYWxsXHJcbiAgZG8gKHRhZyA9IGxvb3BOYW1lKSAtPlxyXG4gICAgbWV0aG9kID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgICAgIGRlZmF1bHRzID1cclxuICAgICAgICBwcm9wczoge31cclxuICAgICAgICBzdHlsZXM6IHt9XHJcbiAgICAgICAgZXZlbnRzOiB7fVxyXG5cclxuICAgICAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9uc1xyXG4gICAgICByZXQgPSBub2RlRmFjdG9yeSB0YWcsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgICAgIHJldFxyXG4gICAgT0oubm9kZXMucmVnaXN0ZXIgdGFnLCBtZXRob2RcclxuICAgIGV4cG9ydHNbdGFnXSA9IG1ldGhvZFxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMjI1xyXG5DcmVhdGUgYW4gT0ogSW5wdXQgT2JqZWN0IHRocm91Z2ggT0oubm9kZXMuaW5wdXRcclxuIyMjXHJcbmlucHV0ID0gKG9wdGlvbnMgPSBPSi5vYmplY3QoKSwgb3duZXIpIC0+XHJcbiAgaWYgbm90IG93bmVyIHRoZW4gdGhyb3cgbmV3IEVycm9yICdDYW5ub3QgY3JlYXRlIGFuIGlucHV0IHdpdGhvdXQgYSBwYXJlbnQnXHJcbiAgaWYgbm90IG9wdGlvbnMucHJvcHMgb3Igbm90IG9wdGlvbnMucHJvcHMudHlwZSB0aGVuIHRocm93IG5ldyBFcnJvciAnQ2Fubm90IGNyZWF0ZSBhbiBpbnB1dCB3aXRob3V0IGFuIGlucHV0IHR5cGUnXHJcbiAgcmV0ID0gb3duZXIubWFrZSAnaW5wdXQnLCBvcHRpb25zXHJcbiAgcmV0LmFkZCAnaW5wdXROYW1lJywgb3B0aW9ucy5wcm9wcy50eXBlXHJcbiAgcmV0XHJcbiAgICBcclxuT0oucmVnaXN0ZXIgJ2lucHV0JywgaW5wdXRcclxubW9kdWxlLmV4cG9ydHMgPSBpbnB1dCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbl8gPSByZXF1aXJlICdsb2Rhc2gnXHJcblRoaW5ET00gPSByZXF1aXJlICd0aGluZG9tJ1xyXG5Ob2RlID0gcmVxdWlyZSAnLi9Ob2RlJ1xyXG5cclxuI2Nsb3NlZCA9ICdhIGFiYnIgYWNyb255bSBhZGRyZXNzIGFwcGxldCBhcnRpY2xlIGFzaWRlIGF1ZGlvIGIgYmRvIGJpZyBibG9ja3F1b3RlIGJvZHkgYnV0dG9uIGNhbnZhcyBjYXB0aW9uIGNlbnRlciBjaXRlIGNvZGUgY29sZ3JvdXAgY29tbWFuZCBkYXRhbGlzdCBkZCBkZWwgZGV0YWlscyBkZm4gZGlyIGRpdiBkbCBkdCBlbSBlbWJlZCBmaWVsZHNldCBmaWdjYXB0aW9uIGZpZ3VyZSBmb250IGZvb3RlciBmb3JtIGZyYW1lc2V0IGgxIGgyIGgzIGg0IGg1IGg2IGhlYWQgaGVhZGVyIGhncm91cCBodG1sIGkgaWZyYW1lIGlucyBrZXlnZW4ga2JkIGxhYmVsIGxlZ2VuZCBsaSBtYXAgbWFyayBtZW51IG1ldGVyIG5hdiBub2ZyYW1lcyBub3NjcmlwdCBvYmplY3Qgb2wgb3B0Z3JvdXAgb3B0aW9uIG91dHB1dCBwIHByZSBwcm9ncmVzcyBxIHJwIHJ0IHJ1YnkgcyBzYW1wIHNjcmlwdCBzZWN0aW9uIHNlbGVjdCBzbWFsbCBzb3VyY2Ugc3BhbiBzdHJpa2Ugc3Ryb25nIHN0eWxlIHN1YiBzdW1tYXJ5IHN1cCB0YWJsZSB0Ym9keSB0ZCB0ZXh0YXJlYSB0Zm9vdCB0aCB0aGVhZCB0aW1lIHRpdGxlIHRyIHR0IHUgdWwgdmFyIHZpZGVvIHdiciB4bXAnLnNwbGl0ICcgJ1xyXG4jb3BlbiA9ICdhcmVhIGJhc2UgYnIgY29sIGNvbW1hbmQgY3NzICFET0NUWVBFIGVtYmVkIGhyIGltZyBpbnB1dCBrZXlnZW4gbGluayBtZXRhIHBhcmFtIHNvdXJjZSB0cmFjayB3YnInLnNwbGl0ICcgJ1xyXG4jXHJcbiNuZXN0YWJsZU5vZGVOYW1lcyA9IFtcclxuIyAgJ2RpdidcclxuIyAgJ3NwYW4nXHJcbiMgICdoMSdcclxuIyAgJ2gyJ1xyXG4jICAnaDMnXHJcbiMgICdoNCdcclxuIyAgJ2g1J1xyXG4jICAnaDYnXHJcbiMgICdwJ1xyXG4jICAnZmllbGRzZXQnXHJcbiMgICdzZWxlY3QnXHJcbiMgICdvbCdcclxuIyAgJ3VsJ1xyXG4jICAndGFibGUnXHJcbiNdXHJcbiNcclxuIyNUaGlzIGxpc3QgaXMgbm90IHlldCBleGhhdXN0aXZlLCBqdXN0IGV4Y2x1ZGUgdGhlIG9idmlvdXNcclxuI25vbk5lc3RhYmxlTm9kZXMgPSBbXHJcbiMgICdsaSdcclxuIyAgJ2xlZ2VuZCdcclxuIyAgJ3RyJ1xyXG4jICAndGQnXHJcbiMgICdvcHRpb24nXHJcbiMgICdib2R5J1xyXG4jICAnaGVhZCdcclxuIyAgJ3NvdXJjZSdcclxuIyAgJ3Rib2R5J1xyXG4jICAndGZvb3QnXHJcbiMgICd0aGVhZCdcclxuIyAgJ2xpbmsnXHJcbiMgICdzY3JpcHQnXHJcbiNdXHJcbiNcclxuI25vZGVOYW1lcyA9IFtcclxuIyAgJ2EnXHJcbiMgICdiJ1xyXG4jICAnYnInXHJcbiMgICdidXR0b24nXHJcbiMgICdkaXYnXHJcbiMgICdlbSdcclxuIyAgJ2ZpZWxkc2V0J1xyXG4jICAnZm9ybSdcclxuIyAgJ2gxJ1xyXG4jICAnaDInXHJcbiMgICdoMydcclxuIyAgJ2g0J1xyXG4jICAnaDUnXHJcbiMgICdoNidcclxuIyAgJ2knXHJcbiMgICdpbWcnXHJcbiMgICdpbnB1dCdcclxuIyAgJ2xhYmVsJ1xyXG4jICAnbGVnZW5kJ1xyXG4jICAnbGknXHJcbiMgICduYXYnXHJcbiMgICdvbCdcclxuIyAgJ29wdGlvbidcclxuIyAgJ3AnXHJcbiMgICdzZWxlY3QnXHJcbiMgICdzcGFuJ1xyXG4jICAnc3Ryb25nJ1xyXG4jICAnc3VwJ1xyXG4jICAnc3ZnJ1xyXG4jICAndGFibGUnXHJcbiMgICd0Ym9keSdcclxuIyAgJ3RkJ1xyXG4jICAndGV4dGFyZWEnXHJcbiMgICd0aCdcclxuIyAgJ3RoZWFkJ1xyXG4jICAndHInXHJcbiMgICd1bCdcclxuI11cclxuXHJcbmNsYXNzIE5vZGVGYWN0b3J5XHJcbiAgXHJcbiAgb2pOb2RlOiBudWxsXHJcbiAgXHJcbiAgQGdldDogKGlkLCB0YWdOYW1lID0gJ2RpdicpIC0+XHJcbiAgICByZXQgPSBudWxsXHJcbiAgICBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkIGlkXHJcbiAgICBpZiBlbFxyXG4gICAgICB0aGluRWwgPSBPSi5yZXN0b3JlRWxlbWVudCBlbCwgdGFnTmFtZVxyXG4gICAgaWYgdGhpbkVsXHJcbiAgICAgIHJldCA9IG5ldyBOb2RlRmFjdG9yeSBudWxsLCBudWxsLCBudWxsLCBmYWxzZSwgdGhpbkVsXHJcblxyXG4gICAgcmV0XHJcbiAgXHJcbiAgX21ha2VBZGQ6ICh0YWdOYW1lLCBjb3VudCkgLT5cclxuICAgIChvcHRzKSA9PlxyXG4gICAgICBtZXRob2QgPSBPSi5ub2Rlc1t0YWdOYW1lXSBvciBPSi5jb21wb25lbnRzW3RhZ05hbWVdIG9yIE9KLmNvbnRyb2xzW3RhZ05hbWVdIG9yIE9KLmlucHV0c1t0YWdOYW1lXVxyXG4gICAgICBpZiBtZXRob2RcclxuICAgICAgICBudSA9IG1ldGhvZCBvcHRzLCBAb2pOb2RlXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBudSA9IE9KLmNvbXBvbmVudCBudWxsLCBAb2pOb2RlLCB0YWdOYW1lXHJcbiAgICAgICNyZXQgPSBuZXcgTm9kZUZhY3RvcnkgbnUsIEB0aGluTm9kZSwgY291bnRcclxuICAgICAgbnVcclxuICBcclxuICBfbWFrZVVuaXF1ZUlkOiAoY291bnQpIC0+XHJcbiAgICBpZiBPSi5HRU5FUkFURV9VTklRVUVfSURTXHJcbiAgICAgIGNvdW50ICs9IDFcclxuICAgICAgaWYgY291bnQgPD0gQG93bmVyLmNvdW50IHRoZW4gY291bnQgPSBAb3duZXIuY291bnQgKyAxXHJcbiAgICAgIEBvd25lci5jb3VudCA9IGNvdW50XHJcblxyXG4gICAgICBpZiBub3QgQG9qTm9kZS5nZXRJZCgpXHJcbiAgICAgICAgaWQgPSBAb3duZXIuZ2V0SWQoKSBvciAnJ1xyXG4gICAgICAgIGlkICs9IEBvak5vZGUudGFnTmFtZSArIGNvdW50XHJcbiAgICAgICAgQG9qTm9kZS5hdHRyICdpZCcsIGlkXHJcbiAgICByZXR1cm5cclxuICBcclxuICBfYmluZEV2ZW50czogLT5cclxuICAgIGlmIEBvak5vZGUgdGhlbiBfLmZvck93biBAb3B0aW9ucy5ldmVudHMsICh2YWwsIGtleSkgPT5cclxuICAgICAgaXNNZXRob2QgPSByZXF1aXJlICcuLi90b29scy9pcydcclxuICAgICAgaWYgaXNNZXRob2QubWV0aG9kIHZhbFxyXG4gICAgICAgIGNhbGxiYWNrID0gKGV2ZW50Li4uKSAtPiB2YWwgZXZlbnQuLi5cclxuICAgICAgICBAb2pOb2RlLiQub24ga2V5LCBjYWxsYmFja1xyXG4gICAgICAgIEBvak5vZGUuYWRkIGtleSwgY2FsbGJhY2tcclxuICAgICAgICBudWxsXHJcbiAgXHJcbiAgY29uc3RydWN0b3I6IChAdGFnLCBAb3B0aW9ucywgQG93bmVyLCBAdGhpbk5vZGUgPSBudWxsKSAtPlxyXG4gICAgaWYgQHRhZyBhbmQgbm90IEB0aGluTm9kZVxyXG4gICAgICBAdGhpbk5vZGUgPSBuZXcgVGhpbkRPTSBAdGFnLCBAb3B0aW9ucy5wcm9wc1xyXG4gICAgICBAdGhpbk5vZGUuYWRkICd0YWdOYW1lJywgQHRhZ1xyXG4gICAgICBAdGhpbk5vZGUuY3NzIEBvcHRpb25zLnN0eWxlc1xyXG4gICAgICBpZiBAb3B0aW9ucy50ZXh0IHRoZW4gQHRoaW5Ob2RlLnRleHQgQG9wdGlvbnMudGV4dFxyXG4gICAgXHJcbiAgICBpZiBAb3duZXJcclxuICAgICAgQG1ha2UoKVxyXG4gIFxyXG4gIGFkZE1ha2VNZXRob2Q6IChjb3VudCkgLT5cclxuICAgIG1ldGhvZHMgPSBPSi5vYmplY3QoKVxyXG4gICAgQG9qTm9kZS5tYWtlID0gKHRhZ05hbWUsIG9wdHMpID0+XHJcbiAgICAgIG1ldGhvZCA9IG1ldGhvZHNbdGFnTmFtZV1cclxuICAgICAgaWYgbm90IG1ldGhvZFxyXG4gICAgICAgIG1ldGhvZCA9IEBfbWFrZUFkZCB0YWdOYW1lLCBAb2pOb2RlLCBjb3VudFxyXG4gICAgICAgIG1ldGhvZHNbdGFnTmFtZV0gPSBtZXRob2RcclxuICAgICAgbWV0aG9kIG9wdHNcclxuICAgIEBvak5vZGVcclxuXHJcbiAgbWFrZTogLT5cclxuXHJcbiAgICBAb2pOb2RlID0gbnVsbFxyXG5cclxuICAgIGlmIEB0aGluTm9kZT8uaXNGdWxseUluaXQgdGhlbiBAb2pOb2RlID0gQHRoaW5Ob2RlXHJcbiAgXHJcbiAgICAjIDI6IElmIHRoZSBlbGVtZW50IGhhcyBuZXZlciBiZWVuIGluaXRpYWxpemVkLCBjb250aW51ZVxyXG4gICAgZWxzZVxyXG4gICAgICAjIDM6IEFzIGxvbmcgYXMgdGhlIGVsZW1lbnQgaXNuJ3QgdGhlIGJvZHkgbm9kZSwgY29udGludWVcclxuICAgICAgIyBpZiBlbC50YWdOYW1lIGlzbnQgJ2JvZHknXHJcbiAgICAgICMgNDogRXh0ZW5kIHRoZSBlbGVtZW50IHdpdGggc3RhbmRhcmQgalF1ZXJ5IEFQSSBtZXRob2RzXHJcbiAgICAgIEBvak5vZGUgPSBuZXcgTm9kZSBAdGhpbk5vZGUsIEBvd25lclxyXG4gICAgICBjb3VudCA9IChAb3duZXIuY291bnQgKyAxKSB8fCAxXHJcbiAgICAgICMgNTogSWYgdGhlIG5vZGUgaXNuJ3QgaW4gdGhlIERPTSwgYXBwZW5kIGl0IHRvIHRoZSBwYXJlbnRcclxuICAgICAgIyBUaGlzIGFsc28gYWNjb21tb2RhdGVzIGRvY3VtZW50IGZyYWdtZW50cywgd2hpY2ggYXJlIG5vdCBpbiB0aGUgRE9NIGJ1dCBhcmUgcHJlc3VtZWQgdG8gYmUgc291bmQgdW50aWwgcmVhZHkgZm9yIG1hbnVhbCBpbnNlcnRpb25cclxuICAgICAgaWYgQHRoaW5Ob2RlLnRhZ05hbWUgaXNudCAnYm9keScgYW5kIG5vdCBAdGhpbk5vZGUuaXNJbkRPTSBhbmQgbm90IEBvak5vZGUuaXNJbkRPTVxyXG4gICAgICAgIEBfbWFrZVVuaXF1ZUlkIGNvdW50XHJcbiAgICAgICAgQG93bmVyLmFwcGVuZCBAb2pOb2RlWzBdXHJcbiAgICAgICAgIyA2OiBCaW5kIGFueSBkZWZpbmVkIGV2ZW50cyBhZnRlciB0aGUgbm9kZSBpcyBpbiB0aGUgRE9NXHJcbiAgICAgICAgQF9iaW5kRXZlbnRzKClcclxuICAgICAgICBcclxuICAgICAgQHRoaW5Ob2RlLmlzSW5ET00gPSB0cnVlXHJcbiAgICAgIEBvak5vZGUuaXNJbkRPTSA9IHRydWVcclxuXHJcbiAgICAgICMgNzogQ3JlYXRlIHRoZSBhbGwgaW1wb3J0YW50ICdtYWtlJyBtZXRob2RcclxuICAgICAgQGFkZE1ha2VNZXRob2QgY291bnRcclxuXHJcbiAgICAgICMgODogUHJldmVudCBkdXBsaWNhdGUgZmFjdG9yeSBleHRlbnNpb24gYnkgc2V0dGluZyBpcyBpbml0ID0gdHJ1ZVxyXG4gICAgICBAb2pOb2RlLmlzRnVsbHlJbml0ID0gdHJ1ZVxyXG5cclxuICAgICAgIyA5OiBpZiB0aGUgbm9kZSBzdXBwb3J0cyBpdCwgY2FsbCBmaW5hbGl6ZVxyXG4gICAgICBmaW5hbGl6ZSA9IF8ub25jZSBAb2pOb2RlLmZpbmFsaXplIG9yIE9KLm5vb3BcclxuICAgICAgQG9qTm9kZS5maW5hbGl6ZSA9IGZpbmFsaXplXHJcbiAgICAgIGZpbmFsaXplIEBvak5vZGVcclxuICAgICMgMTA6IFJldHVybiB0aGUgZXh0ZW5kZWQgZWxlbWVudFxyXG4gICAgQG9qTm9kZVxyXG5cclxuZ2V0Tm9kZUZyb21GYWN0b3J5ID0gKHRhZywgb3B0aW9ucywgb3duZXIsIGlzQ2FsbGVkRnJvbUZhY3RvcnksIG5vZGUpIC0+XHJcbiAgaWYgT0ouaXMuc3RyaW5nIHRhZ1xyXG4gICAgZmFjdG9yeSA9IG5ldyBOb2RlRmFjdG9yeSB0YWcsIG9wdGlvbnMsIG93bmVyXHJcbiAgZWxzZVxyXG4gICAgZmFjdG9yeSA9IG5ldyBOb2RlRmFjdG9yeSBudWxsLCBvcHRpb25zLCB7fSwgdGFnXHJcbiAgZmFjdG9yeS5vak5vZGVcclxuXHJcblxyXG5PSi5yZWdpc3RlciAnbm9kZUZhY3RvcnknLCBnZXROb2RlRnJvbUZhY3RvcnlcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZ2V0Tm9kZUZyb21GYWN0b3J5IiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG4jICMgYVxyXG5ub2RlTmFtZSA9ICdhJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBpZDogJydcclxuICAgICAgY2xhc3M6ICcnXHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICAgIGhyZWY6ICdqYXZhU2NyaXB0OnZvaWQoMCk7J1xyXG4gICAgICB0eXBlOiAnJ1xyXG4gICAgICB0aXRsZTogJydcclxuICAgICAgcmVsOiAnJ1xyXG4gICAgICBtZWRpYTogJydcclxuICAgICAgdGFyZ2V0OiAnJ1xyXG4gICAgc3R5bGVzOiB7fVxyXG4gICAgZXZlbnRzOlxyXG4gICAgICBjbGljazogT0oubm9vcFxyXG5cclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHRvZ2dsZVN0YXRlID0gJ29mZidcclxuXHJcbiAgdG9nZ2xlID0gLT5cclxuICAgIGlmIHRvZ2dsZVN0YXRlIGlzICdvbidcclxuICAgICAgdG9nZ2xlU3RhdGUgPSAnb2ZmJ1xyXG4gICAgZWxzZSB0b2dnbGVTdGF0ZSA9ICdvbicgIGlmIHRvZ2dsZVN0YXRlIGlzICdvZmYnXHJcbiAgICByZXR1cm5cclxuXHJcbiAgIyBDbGljayBiaW5kaW5nXHJcbiAgaWYgZGVmYXVsdHMuZXZlbnRzLmNsaWNrIGlzbnQgT0oubm9vcFxyXG4gICAgY2xpY2sgPSBkZWZhdWx0cy5ldmVudHMuY2xpY2tcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICB0b2dnbGUoKVxyXG4gICAgICByZXRWYWwgPSBjbGljayBldmVudC4uLlxyXG4gICAgICBpZiBkZWZhdWx0cy5ocmVmIGlzICcjJyB0aGVuIHJldFZhbCA9IGZhbHNlXHJcbiAgICAgIHJldFZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuICBlbHNlXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSB0b2dnbGVcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGVcclxuXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxudG8gPSByZXF1aXJlICcuLi90b29scy90bydcclxuIyAjIGJyXHJcblxyXG5ub2RlTmFtZSA9ICdicidcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczoge31cclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIG51bWJlcjogMVxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICBpID0gMFxyXG4gIHdoaWxlIGkgPCB0by5udW1iZXIgZGVmYXVsdHMubnVtYmVyXHJcbiAgICAjIEluIHRoZSBjYXNlIG9mIG11bHRpcGxlIGJycywgaXQgaXMgZGVzaXJhYmxlIHRvIG9ubHkgZ2V0IHRoZSBsYXN0IG9uZSBvdXRcclxuICAgIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG4gICAgaSArPSAxXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcblxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBmb3JtXHJcblxyXG5ub2RlTmFtZSA9ICdmb3JtJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBhY3Rpb246ICcnXHJcbiAgICAgIG1ldGhvZDogJydcclxuICAgICAgbmFtZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0LmFkZCAndmFsaWRhdG9yJywgcmV0LiQudmFsaWRhdGUoXHJcbiAgICBoaWdobGlnaHQ6IChlbGVtZW50KSAtPlxyXG4gICAgICAkZWxtID0gJChlbGVtZW50KVxyXG4gICAgICAkZWxtLmF0dHIgJ09KX2ludmFsaWQnLCAnMSdcclxuICAgICAgJGVsbS5hbmltYXRlIGJhY2tncm91bmRDb2xvcjogJ3JlZCdcclxuICAgICAgbnVsbFxyXG5cclxuICAgIHVuaGlnaGxpZ2h0OiAoZWxlbWVudCkgLT5cclxuICAgICAgJGVsbSA9ICQoZWxlbWVudClcclxuICAgICAgaWYgJGVsbS5hdHRyKCdPSl9pbnZhbGlkJykgaXMgJzEnXHJcbiAgICAgICAgJGVsbS5jc3MgJ2JhY2tncm91bmQtY29sb3InLCAneWVsbG93J1xyXG4gICAgICAgICRlbG0uYXR0ciAnT0pfaW52YWxpZCcsICcwJ1xyXG4gICAgICAgIHNldFRpbWVvdXQgKC0+XHJcbiAgICAgICAgICAkZWxtLmFuaW1hdGUgYmFja2dyb3VuZENvbG9yOiAndHJhbnNwYXJlbnQnXHJcbiAgICAgICAgKSwgNTAwXHJcbiAgICAgIG51bGxcclxuICApXHJcblxyXG4gIHJldC5hZGQgJ2lzRm9ybVZhbGlkJywgLT5cclxuICAgIHJldC4kLnZhbGlkKCkgYW5kIChub3QgcmV0LnZhbGlkYXRvci5pbnZhbGlkRWxlbWVudHMoKSBvciByZXQudmFsaWRhdG9yLmludmFsaWRFbGVtZW50cygpLmxlbmd0aCBpcyAwKVxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG5cclxuXHJcblxyXG5cclxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcbmVudW1zID0gcmVxdWlyZSAnLi4vdG9vbHMvZW51bXMnXHJcblxyXG4jICMgaW5wdXRcclxuXHJcbm5vZGVOYW1lID0gJ2lucHV0J1xyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHR5cGU6ICd0ZXh0J1xyXG4gICAgICB2YWx1ZTogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcbiAgICAgIGZvY3Vzb3V0OiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICBpZiBub3QgZGVmYXVsdHMucHJvcHMudHlwZSBvciBub3QgZW51bXMuaW5wdXRUeXBlc1tkZWZhdWx0cy5wcm9wcy50eXBlXVxyXG4gICAgdGhyb3cgbmV3IEVycm9yICdObyBtYXRjaGluZyBpbnB1dCB0eXBlIGZvciB7JyArIGRlZmF1bHRzLnByb3BzLnR5cGUgKyAnfSBjb3VsZCBiZSBmb3VuZC4nXHJcbiAgdGhpc1R5cGUgPSBlbnVtcy5pbnB1dFR5cGVzW2RlZmF1bHRzLnByb3BzLnR5cGVdXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICBzd2l0Y2ggdGhpc1R5cGVcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLmNoZWNrYm94XHJcbiAgICAgICAgcmV0LnZhbHVlID0gcmV0LiQuaXMgJzpjaGVja2VkJ1xyXG4gICAgICB3aGVuIGVudW1zLmlucHV0VHlwZXMucmFkaW9cclxuICAgICAgICByZXQudmFsdWUgPSByZXQuJC5maW5kKCc6Y2hlY2tlZCcpLnZhbCgpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICByZXQudmFsdWUgPSByZXQudmFsKClcclxuICAgIGRlZmF1bHRzLnByb3BzLnZhbHVlID0gcmV0LnZhbHVlICAgIFxyXG4gICAgcmV0LnZhbHVlXHJcblxyXG4gICMjI1xyXG4gICAgQ2xpY2sgYmluZGluZy4gSWYgdGhlIGNhbGxlciBkZWZpbmVkIGEgY2xpY2sgaGFuZGxlcixcclxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcclxuICAgIHRoZW4gY2FsbCB0aGUgZGVmaW5lZCBjbGljayBoYW5kbGVyIHdpdGggdGhlIGxhdGVzdCB2YWx1ZS5cclxuICAjIyNcclxuICBvbGRDbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gIGlmIG9sZENsaWNrIGFuZCBvbGRDbGljayBpc250IE9KLm5vb3BcclxuICAgIG5ld0NsaWNrID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICBvbGRDbGljayByZXQudmFsdWUsIGV2ZW50Li4uXHJcbiAgICBkZWZhdWx0cy5ldmVudHMuY2xpY2sgPSBuZXdDbGlja1xyXG5cclxuICAjIyNcclxuICAgIENoYW5nZSBiaW5kaW5nLiBJZiB0aGUgY2FsbGVyIGRlZmluZWQgYSBjaGFuZ2UgaGFuZGxlcixcclxuICAgIHdyYXAgaXQsIHN5bmMgdGhlIHZhbHVlIG9mIHRoZSBpbnB1dCBmaXJzdCxcclxuICAgIHRoZW4gY2FsbCB0aGUgZGVmaW5lZCBjaGFuZ2UgaGFuZGxlciB3aXRoIHRoZSBsYXRlc3QgdmFsdWUuXHJcbiAgIyMjXHJcbiAgb2xkQ2hhbmdlID0gZGVmYXVsdHMuZXZlbnRzLmNoYW5nZVxyXG4gIGlmIG9sZENoYW5nZSBhbmQgb2xkQ2hhbmdlIGlzbnQgT0oubm9vcFxyXG4gICAgbmV3Q2hhbmdlID0gKGV2ZW50Li4uKSAtPlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICBvbGRDaGFuZ2UgcmV0LnZhbHVlLCBldmVudC4uLlxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNoYW5nZSA9IG5ld0NoYW5nZVxyXG5cclxuICAjIyNcclxuICAgIE9uIEZvY3VzIE91dCBiaW5kaW5nLiBBbHdheXMgdXNlIHRoZSBldmVudCB0byB1cGRhdGUgdGhlIGludGVybmFsXHJcbiAgICB2YWx1ZSBvZiB0aGUgY29udHJvbDsgYW5kIGlmIHRoZSBjYWxsZXIgZGVmaW5lZCBhIGZvY3Vzb3V0IGV2ZW50LFxyXG4gICAgd3JhcCBpdCBhbmQgaW52b2tlIGl0IHdpdGggdGhlIGxhdGVzdCB2YWx1ZVxyXG4gICMjI1xyXG4gIG9sZEZvY3Vzb3V0ID0gZGVmYXVsdHMuZXZlbnRzLmZvY3Vzb3V0XHJcbiAgbmV3Rm9jdXNvdXQgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICBzeW5jVmFsdWUoKVxyXG4gICAgaWYgb2xkRm9jdXNvdXQgYW5kIG9sZEZvY3Vzb3V0IGlzbnQgT0oubm9vcFxyXG4gICAgICBvbGRGb2N1c291dCByZXQudmFsdWUsIGV2ZW50Li4uXHJcblxyXG4gIGRlZmF1bHRzLmV2ZW50cy5mb2N1c291dCA9IG5ld0ZvY3Vzb3V0XHJcblxyXG5cclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG4gIHJldC52YWx1ZSA9IGRlZmF1bHRzLnByb3BzLnZhbHVlXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXHJcbiMgIyBvbFxyXG5cclxubm9kZU5hbWUgPSAnb2wnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxuIyAjIHNlbGVjdFxyXG5cclxubm9kZU5hbWUgPSAnc2VsZWN0J1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIHNlbGVjdGVkOiAnJ1xyXG4gICAgICBtdWx0aXBsZTogZmFsc2VcclxuICAgIHN0eWxlczoge31cclxuICAgIHZhbHVlczogW11cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgICAgY2hhbmdlOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG5cclxuICB2YWx1ZSA9ICcnXHJcbiAgdmFsdWVzID0gW11cclxuICBoYXNFbXB0eSA9IGZhbHNlXHJcblxyXG4gIHN5bmNWYWx1ZSA9IC0+XHJcbiAgICB2YWx1ZSA9IHJldC52YWwoKVxyXG5cclxuICAjIENsaWNrIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIHJldHZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuXHJcbiAgIyBDaGFuZ2UgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICBjaGFuZ2UgPSBkZWZhdWx0cy5ldmVudHMuY2hhbmdlXHJcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcmV0LmFkZCAnc2VsZWN0ZWREYXRhJywgKHByb3BOYW1lKSAtPlxyXG4gICAgcmV0ID0gJydcclxuICAgIGlmIHJldC4kLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpIGFuZCByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVswXVxyXG4gICAgICBkYXRhc2V0ID0gcmV0LiQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0uZGF0YXNldFxyXG4gICAgICByZXQgPSBkYXRhc2V0W3Byb3BOYW1lXSAgaWYgZGF0YXNldFxyXG4gICAgcmV0XHJcblxyXG4gIHJldC5hZGQgJ3NlbGVjdGVkVGV4dCcsIC0+XHJcbiAgICByZXQuJC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS50ZXh0KClcclxuXHJcbiAgcmV0LmFkZCAnc2VsZWN0ZWRWYWwnLCAtPlxyXG4gICAgdmFsdWUgPSByZXQudmFsKClcclxuICAgIHZhbHVlXHJcblxyXG4gIHJldC5hZGQgJ2FkZE9wdGlvbicsICh2YWx1ZSwgdGV4dCA9IHZhbHVlLCBzZWxlY3RlZCA9IGZhbHNlLCBkaXNhYmxlZCA9IGZhbHNlKSAtPlxyXG4gICAgaXNFbXB0eSA9IF8uaXNFbXB0eSB2YWx1ZVxyXG4gICAgYWRkID0gZmFsc2VcclxuICAgIGlmIGlzRW1wdHkgYW5kIGZhbHNlIGlzIGhhc0VtcHR5XHJcbiAgICAgIGhhc0VtcHR5ID0gdHJ1ZVxyXG4gICAgICBhZGQgPSB0cnVlXHJcbiAgICBpZiBmYWxzZSBpcyBhZGQgYW5kIGZhbHNlIGlzIGlzRW1wdHkgdGhlbiBhZGQgPSB0cnVlXHJcbiAgICBpZiBhZGRcclxuICAgICAgdmFsID1cclxuICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgcHJvcHM6XHJcbiAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgaWYgc2VsZWN0ZWRcclxuICAgICAgICB2YWwuc2VsZWN0ZWQgPSBzZWxlY3RlZFxyXG4gICAgICBpZiBkaXNhYmxlZFxyXG4gICAgICAgIHZhbC5kaXNhYmxlZCA9IGRpc2FibGVkXHJcbiAgICAgIG9wdGlvbiA9IHJldC5tYWtlICdvcHRpb24nLCB2YWxcclxuICAgICAgb3B0aW9uXHJcblxyXG4gIHJldC5hZGQgJ2FkZE9wdGlvbnMnLCAob3B0aW9ucykgLT5cclxuICAgIHZhbHVlcyA9IF8udW5pb24gdmFsdWVzLCBvcHRpb25zXHJcbiAgICBPSi5lYWNoIG9wdGlvbnMsICgodmFsKSAtPlxyXG4gICAgICB2YWx1ZSA9IHJldC5hZGRPcHRpb24odmFsKVxyXG4gICAgICB2YWx1ZXMucHVzaCB2YWx1ZVxyXG4gICAgKSwgZmFsc2VcclxuICAgIHZhbHVlc1xyXG5cclxuICByZXQuYWRkICdyZXNldE9wdGlvbnMnLCAodmFsdWVzKSAtPlxyXG4gICAgcmV0LmVtcHR5KClcclxuICAgIHZhbHVlcyA9IHZhbHVlc1xyXG4gICAgcmV0LmFkZE9wdGlvbnMgdmFsdWVzXHJcbiAgICByZXRcclxuXHJcbiAgcmV0LmFkZCAncmVtb3ZlT3B0aW9uJywgKHZhbHVlVG9SZW1vdmUpIC0+XHJcbiAgICB2YWx1ZXMuc3BsaWNlIHZhbHVlcy5pbmRleE9mKHZhbHVlVG9SZW1vdmUpLCAxICNyZW1vdmVzIHRoZSBpdGVtIGZyb20gdGhlIGxpc3RcclxuICAgIHNlbGVjdENvbnRyb2wgPSByZXRbMF1cclxuICAgIGkgPSAwXHJcblxyXG4gICAgd2hpbGUgaSA8IHNlbGVjdENvbnRyb2wubGVuZ3RoXHJcbiAgICAgIHNlbGVjdENvbnRyb2wucmVtb3ZlIGkgIGlmIHNlbGVjdENvbnRyb2wub3B0aW9uc1tpXS52YWx1ZSBpcyB2YWx1ZVRvUmVtb3ZlXHJcbiAgICAgIGkrK1xyXG4gICAgbnVsbFxyXG5cclxuXHJcblxyXG4gIGlmIGRlZmF1bHRzLnZhbHVlcy5sZW5ndGggPiAwXHJcbiAgICByZXQuYWRkT3B0aW9ucyBkZWZhdWx0cy52YWx1ZXNcclxuXHJcbiBcclxuXHJcbiAgcmV0XHJcblxyXG5PSi5ub2Rlcy5yZWdpc3RlciBub2RlTmFtZSwgbm9kZVxyXG5tb2R1bGUuZXhwb3J0cyA9IG5vZGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuXyA9IHJlcXVpcmUgJ2xvZGFzaCdcclxuYXJyYXkyRCA9IHJlcXVpcmUgJy4uL3Rvb2xzL2FycmF5MkQnXHJcbiQgPSByZXF1aXJlICdqcXVlcnknXHJcbkpzb25Ub1RhYmxlID0gcmVxdWlyZSAnLi4vdG9vbHMvSnNvblRvVGFibGUnXHJcblxyXG4jICMgdGFibGVcclxuXHJcbm5vZGVOYW1lID0gJ3RhYmxlJ1xyXG5cclxuIyMjXHJcbkNyZWF0ZSBhbiBIVE1MIHRhYmxlLiBQcm92aWRlcyBoZWxwZXIgbWV0aG9kcyB0byBjcmVhdGUgQ29sdW1ucyBhbmQgQ2VsbHMuXHJcbiMjI1xyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgIyAjIyBvcHRpb25zXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgIyAjIyMgZGF0YVxyXG4gICAgIyBvcHRpb25hbCBhcnJheSBvZiBvYmplY3RzLiBpZiBwcm92aWRlZCB3aWxsIGdlbmVyYXRlIHRhYmxlIGF1dG9tYXRpY2FsbHkuXHJcbiAgICBkYXRhOiBudWxsXHJcbiAgICAjICMjIyBwcm9wc1xyXG4gICAgIyBvcHRpb25hbCBwcm9wZXJ0aWVzIHRvIGFwcGx5IHRvIHRhYmxlIHJvb3Qgbm9kZVxyXG4gICAgcHJvcHM6XHJcbiAgICAgIGNlbGxwYWRkaW5nOiAwXHJcbiAgICAgIGNlbGxzcGFjaW5nOiAwXHJcbiAgICAgIGFsaWduOiAnJ1xyXG4gICAgICB3aWR0aDogJydcclxuICAgICAgY2VsbGFsaWduOiAnbGVmdCdcclxuICAgICAgY2VsbHZhbGlnbjogJ3RvcCdcclxuICAgICAgY2xhc3M6ICcnXHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6IHt9XHJcbiAgICAjICMjIyBjZWxsc1xyXG4gICAgIyBvcHRpb25hbCBwcm9wZXJ0aWVzIHRvIGFwcGx5IHRvIGluZGl2aWR1YWwgY2VsbHNcclxuICAgIGNlbGxzOlxyXG4gICAgICBjbGFzczogJydcclxuICAgICAgYWxpZ246ICcnXHJcbiAgICAgICd2ZXJ0aWNhbC1hbGlnbic6ICcnXHJcbiAgICAgIGNlbGxwYWRkaW5nOiAnJ1xyXG4gICAgICBtYXJnaW46ICcnXHJcbiAgICAjICMjIyB0aGVhZFxyXG4gICAgIyBvcHRpb25hbCBvcHRpb25zIG9iamVjdCB0byBwYXNzIGludG8gdGhlYWQgY3JlYXRpb25cclxuICAgIHRoZWFkOiB7fVxyXG4gICAgIyAjIyMgdGJvZHlcclxuICAgICMgb3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdG8gcGFzcyBpbnRvIHRib2R5IGNyZWF0aW9uXHJcbiAgICB0Ym9keToge31cclxuXHJcbiAgICBmaXJzdEFsaWduUmlnaHQ6IGZhbHNlXHJcbiAgICBvZGRBbGlnblJpZ2h0OiBmYWxzZVxyXG5cclxuICByb3dzID0gW11cclxuICBjZWxscyA9IGFycmF5MkQoKVxyXG4gIGNvbHVtbkNvdW50ID0gMFxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuICByZXQgPSBub2RlRmFjdG9yeSBub2RlTmFtZSwgZGVmYXVsdHMsIG93bmVyLCBjYWxsZWRGcm9tRmFjdG9yeVxyXG4gXHJcblxyXG4gIHRib2R5ID0gbnVsbFxyXG4gIHRoZWFkID0gbnVsbFxyXG4gIHRoZWFkUm93ID0gbnVsbFxyXG5cclxuICAjICMjIyBpbml0XHJcbiAgIyBpbnRlcm5hbCBtZXRob2QgZm9yIG9uZSB0aW1lIGluaXRpYWxpemF0aW9uIG9mIHRoZSB0YWJsZVxyXG4gIGluaXQgPSBfLm9uY2UgLT5cclxuICAgIGlmIGRlZmF1bHRzLmRhdGFcclxuICAgICAgajJ0ID0gbmV3IEpzb25Ub1RhYmxlIGRlZmF1bHRzLmRhdGFcclxuICAgICAgdGJsU3RyID0gajJ0LnRhYmxlXHJcbiAgICBpZiB0YmxTdHJcclxuICAgICAgalRibCA9ICQgdGJsU3RyXHJcblxyXG4gICAgICBqSGVhZCA9IGpUYmwuZmluZCAndGhlYWQnXHJcbiAgICAgIHJldC4kLmFwcGVuZCBqSGVhZFxyXG4gICAgICB0aGVhZCA9IGVsLnJlc3RvcmVFbGVtZW50IGpIZWFkWzBdXHJcbiAgICAgIHRoZWFkUm93ID0gZWwucmVzdG9yZUVsZW1lbnQgdGhlYWRbMF0ucm93c1swXVxyXG5cclxuICAgICAgakJvZHkgPSBqVGJsLmZpbmQgJ3Rib2R5J1xyXG4gICAgICByZXQuJC5hcHBlbmQgakJvZHlcclxuICAgICAgdGJvZHkgPSBlbC5yZXN0b3JlRWxlbWVudCBqQm9keVswXVxyXG5cclxuICAgICAgbG9hZENlbGxzKClcclxuICAgIGVsc2VcclxuICAgICAgdGhlYWQgPSByZXQubWFrZSAndGhlYWQnLCBkZWZhdWx0cy50aGVhZFxyXG4gICAgICB0aGVhZFJvdyA9IHRoZWFkLm1ha2UgJ3RyJ1xyXG4gICAgICB0Ym9keSA9IHJldC5tYWtlICd0Ym9keScsIGRlZmF1bHRzLnRib2R5XHJcbiAgICAgIHJvd3MucHVzaCB0Ym9keS5tYWtlICd0cidcclxuICAgIHJldFxyXG5cclxuICAjICMjIyBsb2FkQ2VsbHNcclxuICAjIGludGVybmFsIG1ldGhvZCBndWFyYW50ZWVzIHRoYXQgdGFibGVzIGxvYWRlZCBmcm9tIEpTT04gYXJlIGZ1bGx5IGxvYWRlZCBpbnRvIG1lbW9yeVxyXG4gIGxvYWRDZWxscyA9ICgpIC0+XHJcbiAgICByID0gMFxyXG4gICAgd2hpbGUgdGJvZHlbMF0ucm93cy5sZW5ndGggPiByXHJcbiAgICAgIGMgPSAwXHJcbiAgICAgIG1lbVJvdyA9IGVsLnJlc3RvcmVFbGVtZW50IHRib2R5WzBdLnJvd3Nbcl1cclxuICAgICAgcm93cy5wdXNoIG1lbVJvd1xyXG4gICAgICB3aGlsZSB0Ym9keVswXS5yb3dzW3JdLmNlbGxzLmxlbmd0aCA+IGNcclxuICAgICAgICBtZW1DZWxsID0gY2VsbHMuZ2V0IHIrMSwgYysxXHJcbiAgICAgICAgaWYgbm90IG1lbUNlbGxcclxuICAgICAgICAgIG1lbUNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCB0Ym9keVswXS5yb3dzW3JdLmNlbGxzW2NdXHJcbiAgICAgICAgICBjZWxscy5zZXQgcisxLCBjKzEsIG1lbUNlbGxcclxuICAgICAgICBjICs9IDFcclxuICAgICAgciArPSAxXHJcblxyXG4gICMgIyMjIGZpbGxNaXNzaW5nXHJcbiAgIyBpbnRlcm5hbCBtZXRob2QgZ3VhcmFudGVlcyB0aGF0IGNlbGxzIGV4aXN0IGZvciB0aGUgZGltZW5zaW9ucyBvZiB0aGUgdGFibGVcclxuICBmaWxsTWlzc2luZyA9ICgpIC0+XHJcbiAgICBjZWxscy5lYWNoIChyb3dObywgY29sTm8sIHZhbCkgLT5cclxuICAgICAgaWYgbm90IHZhbFxyXG4gICAgICAgIHJvdyA9IHJldC5yb3cgcm93Tm9cclxuICAgICAgICByb3cuY2VsbCBjb2xObywge31cclxuXHJcbiAgIyAjIyBjb2x1bW5cclxuICAjIEFkZHMgYSBjb2x1bW4gbmFtZSB0byB0aGUgdGFibGUgaGVhZFxyXG4gIHJldC5hZGQgJ2NvbHVtbicsIChjb2xObywgY29sTmFtZSkgLT5cclxuICAgIHJldC5pbml0KClcclxuICAgIGNvbHVtbkNvdW50ICs9IDFcclxuICAgIHRoID0gbnVsbFxyXG4gICAgaSA9IDBcclxuICAgIHdoaWxlIHRoZWFkWzBdLnJvd3NbMF0uY2VsbHMubGVuZ3RoIDwgY29sTm9cclxuICAgICAgbmF0aXZlVGggPSB0aGVhZFswXS5yb3dzWzBdLmNlbGxzW2ldXHJcbiAgICAgIGlmIG5vdCBuYXRpdmVUaFxyXG4gICAgICAgIHRoID0gdGhlYWRSb3cubWFrZSAndGgnLCB7fVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudCBuYXRpdmVUaCwgJ3RoJ1xyXG4gICAgICBpICs9IDFcclxuICAgIGlmIG5vdCB0aFxyXG4gICAgICBuYXRpdmVUaCA9IHRoZWFkWzBdLnJvd3NbMF0uY2VsbHNbY29sTm8tMV1cclxuICAgICAgdGggPSBlbC5yZXN0b3JlRWxlbWVudCBuYXRpdmVUaCwgJ3RoJ1xyXG4gICAgdGgudGV4dCBjb2xOYW1lXHJcbiAgICB0aFxyXG5cclxuICAjICMjIHJvd1xyXG4gICMgQWRkcyBhIG5ldyByb3cgKHRyKSB0byB0aGUgdGFibGUgYm9keVxyXG4gIHJldC5hZGQgJ3JvdycsIChyb3dObywgb3B0cykgLT5cclxuICAgIHJvdyA9IHJvd3Nbcm93Tm8tMV1cclxuXHJcbiAgICBpZiBub3Qgcm93XHJcbiAgICAgIHdoaWxlIHJvd3MubGVuZ3RoIDwgcm93Tm9cclxuICAgICAgICByb3cgPSB0Ym9keS5tYWtlICd0cicsIHt9XHJcbiAgICAgICAgcm93cy5wdXNoIHJvd1xyXG5cclxuICAgIGlmIG5vdCByb3cuY2VsbFxyXG4gICAgICByb3cuYWRkICdjZWxsJywgKGNvbE5vLCBvcHRzKSAtPlxyXG4gICAgICAgIGNlbGwgPSBPSi5ub2Rlcy50ZCBvcHRzLCByb3dcclxuICAgICAgICBjZWxscy5zZXQgcm93Tm8sIGNvbE5vLCBjZWxsXHJcbiAgICAgICAgY2VsbFxyXG5cclxuICAgIHJvd1xyXG5cclxuICAjICMjIGNlbGxcclxuICAjIEFkZHMgYSBjZWxsICh0ci90ZCkgdG8gdGhlIHRhYmxlIGJvZHlcclxuICByZXQuYWRkICdjZWxsJywgKHJvd05vLCBjb2xObywgb3B0cykgLT5cclxuICAgIGlmIHJvd05vIDwgMSB0aGVuIHJvd05vID0gMVxyXG4gICAgaWYgY29sTm8gPCAxIHRoZW4gY29sTm8gPSAxXHJcbiAgICBpZiBjb2x1bW5Db3VudCA+IDAgYW5kIGNvbE5vLTEgPiBjb2x1bW5Db3VudCB0aGVuIHRocm93IG5ldyBFcnJvciAnQSBjb2x1bW4gbmFtZSBoYXMgbm90IGJlZW4gZGVmaW5lZCBmb3IgdGhpcyBwb3NpdGlvbiB7JyArIHJvd05vICsgJ3gnICsgY29sTm8gKyAnfS4nXHJcblxyXG4gICAgcm93ID0gcmV0LnJvdyByb3dOb1xyXG5cclxuICAgIGNlbGwgPSBjZWxscy5nZXQgcm93Tm8sIGNvbE5vXHJcblxyXG4gICAgaWYgbm90IGNlbGxcclxuICAgICAgaSA9IDBcclxuICAgICAgd2hpbGUgaSA8IGNvbE5vXHJcbiAgICAgICAgaSArPSAxXHJcbiAgICAgICAgaWYgaSBpcyBjb2xOb1xyXG4gICAgICAgICAgbnVPcHRzID0gT0ouZXh0ZW5kIHtwcm9wczogZGVmYXVsdHMuY2VsbHN9LCBvcHRzXHJcbiAgICAgICAgICBjZWxsID0gcm93LmNlbGwgY29sTm8sIG51T3B0c1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgIHRyeUNlbGwgPSBjZWxscy5nZXQgcm93Tm8sIGlcclxuICAgICAgICAgIGlmIG5vdCB0cnlDZWxsXHJcbiAgICAgICAgICAgIHRyeUNlbGwgPSAgcm93LmNlbGwgaSwgcHJvcHM6IGRlZmF1bHRzLmNlbGxzXHJcblxyXG4gICAgY2VsbFxyXG5cclxuICAjICMjIEZpbmFsaXplXHJcbiAgIyBGaW5hbGl6ZSBndWFyYW50ZWVzIHRoYXQgdGhlYWQgYW5kIHRib2R5IGFuZCBjcmVhdGVkIHdoZW4gdGhlIG5vZGUgaXMgZnVsbHkgaW5zdGFudGlhdGVkXHJcbiAgaW5pdCgpXHJcblxyXG4gICMgIyMgVEhlYWRcclxuICAjIEV4cG9zZSB0aGUgaW50ZXJuYWwgdGhlYWQgbm9kZVxyXG4gIHJldC5hZGQgJ3RoZWFkJywgdGhlYWRcclxuXHJcbiAgIyAjIyBUQm9keVxyXG4gICMgRXhwb3NlIHRoZSBpbnRlcm5hbCB0Ym9keSBub2RlXHJcbiAgcmV0LmFkZCAndGJvZHknLCB0Ym9keVxyXG5cclxuICAgIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZVxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG5ub2RlRmFjdG9yeSA9IHJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcclxuZW51bXMgPSByZXF1aXJlICcuLi90b29scy9lbnVtcydcclxuXHJcbm5vZGVOYW1lID0gJ3RleHRhcmVhJ1xyXG5cclxubm9kZSA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHksIGNhbGxlZEZyb21GYWN0b3J5ID0gZmFsc2UpIC0+XHJcblxyXG4gIGRlZmF1bHRzID1cclxuICAgIHByb3BzOlxyXG4gICAgICBuYW1lOiAnJ1xyXG4gICAgICBwbGFjZWhvbGRlcjogJydcclxuICAgICAgdmFsdWU6ICcnXHJcbiAgICAgIHRleHQ6ICcnXHJcbiAgICAgIG1heGxlbmd0aDogJydcclxuICAgICAgYXV0b2ZvY3VzOiBmYWxzZVxyXG4gICAgICBpc1JlcXVpcmVkOiBmYWxzZVxyXG4gICAgICByb3dzOiAzXHJcbiAgICAgIGNvbHM6IDI1XHJcbiAgICAgIGRpc2FibGVkOiBmYWxzZVxyXG4gICAgICByZWFkb25seTogZmFsc2VcclxuICAgICAgZm9ybTogJydcclxuICAgICAgd3JhcDogJydcclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuXHJcbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXHJcblxyXG4gIHZhbHVlID0gZGVmYXVsdHMucHJvcHMudmFsdWVcclxuXHJcbiAgc3luY1ZhbHVlID0gLT5cclxuICAgIHN3aXRjaCBkZWZhdWx0cy5wcm9wcy50eXBlXHJcbiAgICAgIHdoZW4gZW51bXMuaW5wdXRUeXBlcy5jaGVja2JveFxyXG4gICAgICAgIHZhbHVlID0gcmV0LiQuaXMoJzpjaGVja2VkJylcclxuICAgICAgd2hlbiBlbnVtcy5pbnB1dFR5cGVzLnJhZGlvXHJcbiAgICAgICAgdmFsdWUgPSByZXQuJC5maW5kKCc6Y2hlY2tlZCcpLnZhbCgpXHJcbiAgICAgIGVsc2VcclxuICAgICAgICB2YWx1ZSA9IHJldC52YWwoKVxyXG5cclxuICAjIENsaWNrIGJpbmRpbmdcclxuICBpZiBkZWZhdWx0cy5ldmVudHMuY2xpY2sgaXNudCBPSi5ub29wXHJcbiAgICBjbGljayA9IGRlZmF1bHRzLmV2ZW50cy5jbGlja1xyXG4gICAgbmV3Q2xpY2sgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNsaWNrIGV2ZW50Li4uXHJcbiAgICAgIHN5bmNWYWx1ZSgpXHJcbiAgICAgIHJldHZhbFxyXG4gICAgZGVmYXVsdHMuZXZlbnRzLmNsaWNrID0gbmV3Q2xpY2tcclxuXHJcbiAgIyBDaGFuZ2UgYmluZGluZ1xyXG4gIGlmIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgaXNudCBPSi5ub29wXHJcbiAgICBjaGFuZ2UgPSBkZWZhdWx0cy5ldmVudHMuY2hhbmdlXHJcbiAgICBuZXdDaGFuZ2UgPSAoZXZlbnQuLi4pIC0+XHJcbiAgICAgIHJldHZhbCA9IGNoYW5nZSBldmVudC4uLlxyXG4gICAgICBzeW5jVmFsdWUoKVxyXG4gICAgICByZXR2YWxcclxuICAgIGRlZmF1bHRzLmV2ZW50cy5jaGFuZ2UgPSBuZXdDaGFuZ2VcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcblxyXG4gXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxubm9kZUZhY3RvcnkgPSByZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXHJcblxyXG5ub2RlTmFtZSA9ICd0aGVhZCdcclxuXHJcbm5vZGUgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5LCBjYWxsZWRGcm9tRmFjdG9yeSA9IGZhbHNlKSAtPlxyXG5cclxuICBkZWZhdWx0cyA9XHJcbiAgICBwcm9wczoge31cclxuICAgIHN0eWxlczoge31cclxuICAgIGV2ZW50czpcclxuICAgICAgY2xpY2s6IE9KLm5vb3BcclxuICAgIG51bWJlcjogMVxyXG5cclxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcclxuXHJcbiAgcmV0ID0gbm9kZUZhY3Rvcnkgbm9kZU5hbWUsIGRlZmF1bHRzLCBvd25lciwgY2FsbGVkRnJvbUZhY3RvcnlcclxuXHJcbiAgcm93cyA9IFtdXHJcbiAgY2VsbHMgPSB7fVxyXG4gIHJldC5hZGQgJ2NlbGwnLCAocm93Tm8sIGNvbE5vKSAtPlxyXG4gICAgaW5pdCgpXHJcblxyXG4gICAgaWYgcm93Tm8gPCAxIHRoZW4gcm93Tm8gPSAxXHJcbiAgICBpZiBjb2xObyA8IDEgdGhlbiBjb2xObyA9IDFcclxuXHJcbiAgICByb3cgPSByb3dzW3Jvd05vLTFdXHJcblxyXG4gICAgaWYgbm90IHJvd1xyXG4gICAgICB3aGlsZSByb3dzLmxlbmd0aCA8IHJvd05vXHJcbiAgICAgICAgcm93ID0gT0oubm9kZXMudHIge30sIHRib2R5LCBmYWxzZVxyXG4gICAgICAgIHJvd3MucHVzaCByb3dcclxuXHJcbiAgICB0ZCA9IHJvd1swXS5jZWxsc1tjb2xOb11cclxuXHJcbiAgICBpZiB0ZCB0aGVuIGNlbGwgPSBlbC5yZXN0b3JlRWxlbWVudCB0ZCwgJ3RkJ1xyXG4gICAgaWYgbm90IHRkXHJcbiAgICAgIHdoaWxlIHJvd1swXS5jZWxscy5sZW5ndGggPCBjb2xOb1xyXG4gICAgICAgIGlkeCA9IHJvd1swXS5jZWxscy5sZW5ndGhcclxuICAgICAgICB0ZCA9IHJvd1swXS5jZWxsc1tpZHgtMV1cclxuICAgICAgICBpZiB0ZCBhbmQgaWR4IGlzIGNvbE5vXHJcbiAgICAgICAgICBjZWxsID0gZWwucmVzdG9yZUVsZW1lbnQgdGQsICd0ZCdcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICBjZWxsID0gT0oubm9kZXMudGQgcHJvcHM6IGRlZmF1bHRzLmNlbGxzLCByb3csIGZhbHNlXHJcblxyXG4gICAgaWYgbm90IGNlbGwuaXNWYWxpZFxyXG4gICAgICBub2RlRmFjdG9yeSBjZWxsLCByb3csIHJvd05vICsgY29sTm9cclxuXHJcbiAgICBjZWxsXHJcblxyXG4gIHJldFxyXG5cclxuT0oubm9kZXMucmVnaXN0ZXIgbm9kZU5hbWUsIG5vZGVcclxubW9kdWxlLmV4cG9ydHMgPSBub2RlXHJcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vZGVGYWN0b3J5ID0gcmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xyXG5cclxubm9kZU5hbWUgPSAndWwnXHJcblxyXG5ub2RlID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSwgY2FsbGVkRnJvbUZhY3RvcnkgPSBmYWxzZSkgLT5cclxuXHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgcHJvcHM6IHt9XHJcbiAgICBzdHlsZXM6IHt9XHJcbiAgICBldmVudHM6XHJcbiAgICAgIGNsaWNrOiBPSi5ub29wXHJcblxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vZGVGYWN0b3J5IG5vZGVOYW1lLCBkZWZhdWx0cywgb3duZXIsIGNhbGxlZEZyb21GYWN0b3J5XHJcblxyXG5cclxuIFxyXG5cclxuICByZXRcclxuXHJcbk9KLm5vZGVzLnJlZ2lzdGVyIG5vZGVOYW1lLCBub2RlXHJcbm1vZHVsZS5leHBvcnRzID0gbm9kZSIsInRoaXNHbG9iYWwgPSAoaWYgKHR5cGVvZiBnbG9iYWwgaXNudCAndW5kZWZpbmVkJyBhbmQgZ2xvYmFsKSB0aGVuIGdsb2JhbCBlbHNlIChpZiAodHlwZW9mIHNlbGYgaXNudCAndW5kZWZpbmVkJyBhbmQgc2VsZikgdGhlbiBzZWxmIGVsc2UgKGlmICh0eXBlb2Ygd2luZG93IGlzbnQgJ3VuZGVmaW5lZCcgYW5kIHdpbmRvdykgdGhlbiB3aW5kb3cgZWxzZSB0aGlzKSkpXG5tb2R1bGUuZXhwb3J0cyA9IHRoaXNHbG9iYWwiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xub2JqID0gcmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2J1dHRvbmlucHV0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiAnYnV0dG9uJ1xuICAgICAgc3JjOiAnJ1xuICAgICAgYWx0OiAnJ1xuICAgICAgaGVpZ2h0OiAnJ1xuICAgICAgd2lkdGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG5cblxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdjaGVja2JveCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIGNoZWNrZWQ6IGZhbHNlXG4gICAgaW5kZXRlcm1pbmF0ZTogZmFsc2VcbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIG9iai5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgaWYgZGVmYXVsdHMuY2hlY2tlZFxuICAgIHJldC5hdHRyICdjaGVja2VkJywgdHJ1ZVxuICBlbHNlIGlmIGRlZmF1bHRzLmluZGV0ZXJtaW5hdGVcbiAgICByZXQuYXR0ciAnaW5kZXRlcm1pbmF0ZScsIHRydWVcblxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdjb2xvcidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgb2JqLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0IiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdkYXRlJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnZGF0ZXRpbWUnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2RhdGV0aW1lLWxvY2FsJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdlbWFpbCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgICBtdWx0aXBsZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICdmaWxlJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIGFjY2VwdDogJydcbiAgICAgIG11bHRpcGxlOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ2hpZGRlbidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnaW1hZ2VpbnB1dCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogJ2ltYWdlJ1xuICAgICAgc3JjOiAnJ1xuICAgICAgYWx0OiAnJ1xuICAgICAgaGVpZ2h0OiAnJ1xuICAgICAgd2lkdGg6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnbW9udGgnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ251bWJlcidcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncGFzc3dvcmQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgbWF4bGVuZ3RoOiAnJ1xuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3JhZGlvJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICAgIG5hbWU6ICcnXG4gICAgICB2YWx1ZTogJydcbiAgICAgIGNoZWNrZWQ6ICcnXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncmFuZ2UnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgbWluOiAwXG4gICAgICBtYXg6IDEwMFxuICAgICAgdmFsdWU6IDUwXG4gICAgICBzdGVwOiAxXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAncmVzZXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgIHN0eWxlczoge31cbiAgICBldmVudHM6XG4gICAgICBjbGljazogT0oubm9vcFxuXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxuXG4gIHJldCA9IGlucHV0IGRlZmF1bHRzLCBvd25lclxuICByZXRcblxuT0ouaW5wdXRzLnJlZ2lzdGVyIGlucHV0TmFtZSwgaW5wdFxubW9kdWxlLmV4cG9ydHMgPSBpbnB0XG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xucmVxdWlyZSAnLi4vY29yZS9vYmplY3QnXG5yZXF1aXJlICcuLi9kb20vbm9kZUZhY3RvcnknXG5pbnB1dCA9IHJlcXVpcmUgJy4uL2RvbS9pbnB1dCdcblxuaW5wdXROYW1lID0gJ3NlYXJjaCdcblxuaW5wdCA9IChvcHRpb25zLCBvd25lciA9IE9KLmJvZHkpIC0+XG5cbiAgZGVmYXVsdHMgPVxuICAgIHByb3BzOlxuICAgICAgdHlwZTogaW5wdXROYW1lXG4gICAgc3R5bGVzOiB7fVxuICAgIGV2ZW50czpcbiAgICAgIGNsaWNrOiBPSi5ub29wXG5cbiAgT0ouZXh0ZW5kIGRlZmF1bHRzLCBvcHRpb25zLCB0cnVlXG5cbiAgcmV0ID0gaW5wdXQgZGVmYXVsdHMsIG93bmVyXG4gIHJldFxuXG5PSi5pbnB1dHMucmVnaXN0ZXIgaW5wdXROYW1lLCBpbnB0XG5tb2R1bGUuZXhwb3J0cyA9IGlucHRcbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXG5yZXF1aXJlICcuLi9jb3JlL29iamVjdCdcbnJlcXVpcmUgJy4uL2RvbS9ub2RlRmFjdG9yeSdcbmlucHV0ID0gcmVxdWlyZSAnLi4vZG9tL2lucHV0J1xuXG5pbnB1dE5hbWUgPSAnc3VibWl0J1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0ZWwnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgcGF0dGVybjogJydcbiAgICAgIG1heGxlbmd0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0ZXh0aW5wdXQnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6ICd0ZXh0J1xuICAgICAgYXV0b2NvbXBsZXRlOiAnb24nXG4gICAgICBhdXRvc2F2ZTogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd0aW1lJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd1cmwnXG5cbmlucHQgPSAob3B0aW9ucywgb3duZXIgPSBPSi5ib2R5KSAtPlxuXG4gIGRlZmF1bHRzID1cbiAgICBwcm9wczpcbiAgICAgIHR5cGU6IGlucHV0TmFtZVxuICAgICAgcGF0dGVybjogJydcbiAgICAgIG1heGxlbmd0aDogJydcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiT0ogPSByZXF1aXJlICcuLi9vaidcbnJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xucmVxdWlyZSAnLi4vZG9tL25vZGVGYWN0b3J5J1xuaW5wdXQgPSByZXF1aXJlICcuLi9kb20vaW5wdXQnXG5cbmlucHV0TmFtZSA9ICd3ZWVrJ1xuXG5pbnB0ID0gKG9wdGlvbnMsIG93bmVyID0gT0ouYm9keSkgLT5cblxuICBkZWZhdWx0cyA9XG4gICAgcHJvcHM6XG4gICAgICB0eXBlOiBpbnB1dE5hbWVcbiAgICBzdHlsZXM6IHt9XG4gICAgZXZlbnRzOlxuICAgICAgY2xpY2s6IE9KLm5vb3BcblxuICBPSi5leHRlbmQgZGVmYXVsdHMsIG9wdGlvbnMsIHRydWVcblxuICByZXQgPSBpbnB1dCBkZWZhdWx0cywgb3duZXJcbiAgcmV0XG5cbk9KLmlucHV0cy5yZWdpc3RlciBpbnB1dE5hbWUsIGlucHRcbm1vZHVsZS5leHBvcnRzID0gaW5wdFxuIiwiIyAjIE9KXG50aGlzR2xvYmFsID0gcmVxdWlyZSAnLi9nbG9iYWwnXG51dGlsTGliID0gcmVxdWlyZSAnanF1ZXJ5J1xubmFtZVNwYWNlTmFtZSA9ICdPSidcblxuIyMjXG5ib290IHN0cmFwIG5hbWUgbWV0aG9kIGludG8gT2JqZWN0IHByb3RvdHlwZVxuIyMjXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBPYmplY3Q6OixcbiAgZ2V0SW5zdGFuY2VOYW1lOlxuICAgIHZhbHVlOiAtPlxuICAgICAgZnVuY05hbWVSZWdleCA9IC9mdW5jdGlvbiAoLnsxLH0pXFwoL1xuICAgICAgcmVzdWx0cyA9IChmdW5jTmFtZVJlZ2V4KS5leGVjKEBjb25zdHJ1Y3Rvci50b1N0cmluZygpKVxuICAgICAgKGlmIChyZXN1bHRzIGFuZCByZXN1bHRzLmxlbmd0aCA+IDEpIHRoZW4gcmVzdWx0c1sxXSBlbHNlICcnKVxuXG5cbiMjI1xuQW4gaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIG5hbWVzcGFjZSB0cmVlXG4jIyNcbk5zVHJlZSA9IHt9XG5tYWtlVGhlSnVpY2UgPSAtPlxuXG4gICMjI1xuICBJbnRlcm5hbCBuYW1lU3BhY2VOYW1lIG1ldGhvZCB0byBjcmVhdGUgbmV3ICdzdWInIG5hbWVzcGFjZXMgb24gYXJiaXRyYXJ5IGNoaWxkIG9iamVjdHMuXG4gICMjI1xuICBtYWtlTmFtZVNwYWNlID0gKHNwYWNlbmFtZSwgdHJlZSkgLT5cbiAgICAjIyNcbiAgICBUaGUgZGVyaXZlZCBpbnN0YW5jZSB0byBiZSBjb25zdHJ1Y3RlZFxuICAgICMjI1xuICAgIEJhc2UgPSAobnNOYW1lKSAtPlxuICAgICAgcHJvdG8gPSB0aGlzXG4gICAgICB0cmVlW25zTmFtZV0gPSB0cmVlW25zTmFtZV0gb3Ige31cbiAgICAgIG5zVHJlZSA9IHRyZWVbbnNOYW1lXVxuICAgICAgbWVtYmVycyA9IHt9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAnbWVtYmVycycsIHZhbHVlOiBtZW1iZXJzXG5cbiAgICAgICMjI1xuICAgICAgUmVnaXN0ZXIgKGUuZy4gJ0xpZnQnKSBhbiBPYmplY3QgaW50byB0aGUgcHJvdG90eXBlIG9mIHRoZSBuYW1lc3BhY2UuXG4gICAgICBUaGlzIE9iamVjdCB3aWxsIGJlIHJlYWRhYmxlL2V4ZWN1dGFibGUgYnV0IGlzIG90aGVyd2lzZSBpbW11dGFibGUuXG4gICAgICAjIyNcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB0aGlzLCAncmVnaXN0ZXInLFxuICAgICAgICB2YWx1ZTogKG5hbWUsIG9iaiwgZW51bWVyYWJsZSkgLT5cbiAgICAgICAgICAndXNlIHN0cmljdCdcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsaWZ0IGEgbmV3IHByb3BlcnR5IHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIG5hbWUgaXNudCAnc3RyaW5nJykgb3IgbmFtZSBpcyAnJ1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGxpZnQgYSBuZXcgcHJvcGVydHkgd2l0aG91dCBhIHZhbGlkIHByb3BlcnR5IGluc3RhbmNlLicpICB1bmxlc3Mgb2JqXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQcm9wZXJ0eSBuYW1lZCAnICsgbmFtZSArICcgaXMgYWxyZWFkeSBkZWZpbmVkIG9uICcgKyBzcGFjZW5hbWUgKyAnLicpICBpZiBwcm90b1tuYW1lXVxuXG4gICAgICAgICAgbWVtYmVyc1tuYW1lXSA9IG1lbWJlcnNbbmFtZV0gb3IgbmFtZVxuXG4gICAgICAgICAgI0d1YXJkIGFnYWluc3Qgb2JsaXRlcmF0aW5nIHRoZSB0cmVlIGFzIHRoZSB0cmVlIGlzIHJlY3Vyc2l2ZWx5IGV4dGVuZGVkXG4gICAgICAgICAgbnNUcmVlW25hbWVdID0gbnNUcmVlW25hbWVdIG9yXG4gICAgICAgICAgICBuYW1lOiBuYW1lXG4gICAgICAgICAgICB0eXBlOiB0eXBlb2Ygb2JqXG4gICAgICAgICAgICBpbnN0YW5jZTogKGlmIG9iai5nZXRJbnN0YW5jZU5hbWUgdGhlbiBvYmouZ2V0SW5zdGFuY2VOYW1lKCkgZWxzZSAndW5rbm93bicpXG5cbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkgcHJvdG8sIG5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogb2JqXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSBpc250IGVudW1lcmFibGVcblxuICAgICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHNwYWNlbmFtZSArICcuJyArIG5hbWVcbiAgICAgICAgICBvYmpcblxuXG4gICAgICAjIyNcbiAgICAgIENyZWF0ZSBhIG5ldywgc3RhdGljIG5hbWVzcGFjZSBvbiB0aGUgY3VycmVudCBwYXJlbnQgKGUuZy4gbnNOYW1lLnRvLi4uIHx8IG5zTmFtZS5pcy4uLilcbiAgICAgICMjI1xuICAgICAgcHJvdG8ucmVnaXN0ZXIgJ21ha2VTdWJOYW1lU3BhY2UnLCAoKHN1Yk5hbWVTcGFjZSkgLT5cbiAgICAgICAgJ3VzZSBzdHJpY3QnXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGNyZWF0ZSBhIG5ldyBzdWIgbmFtZXNwYWNlIHdpdGhvdXQgYSB2YWxpZCBuYW1lLicpICBpZiAodHlwZW9mIHN1Yk5hbWVTcGFjZSBpc250ICdzdHJpbmcnKSBvciBzdWJOYW1lU3BhY2UgaXMgJydcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTdWIgbmFtZXNwYWNlIG5hbWVkICcgKyBzdWJOYW1lU3BhY2UgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCBvbiAnICsgc3BhY2VuYW1lICsgJy4nKSAgaWYgcHJvdG8uc3ViTmFtZVNwYWNlXG4gICAgICAgIG5zSW50ZXJuYWwuYWxlcnREZXBlbmRlbnRzIG5zTmFtZSArICcuJyArIHN1Yk5hbWVTcGFjZVxuICAgICAgICBuZXdOYW1lU3BhY2UgPSBtYWtlTmFtZVNwYWNlKHN1Yk5hbWVTcGFjZSwgbnNUcmVlKVxuICAgICAgICBuZXdOYW1lU3BhY2UucmVnaXN0ZXIgJ2NvbnN0YW50cycsIG1ha2VOYW1lU3BhY2UoJ2NvbnN0YW50cycsIG5zVHJlZSksIGZhbHNlICBpZiBzdWJOYW1lU3BhY2UgaXNudCAnY29uc3RhbnRzJ1xuICAgICAgICBwcm90by5yZWdpc3RlciBzdWJOYW1lU3BhY2UsIG5ld05hbWVTcGFjZSwgZmFsc2VcbiAgICAgICAgbmV3TmFtZVNwYWNlXG4gICAgICApLCBmYWxzZVxuICAgICAgcmV0dXJuXG5cbiAgICAjIyNcbiAgICBBbiBpbnRlcm5hbCBtZWNoYW5pc20gdG8gcmVwcmVzZW50IHRoZSBpbnN0YW5jZSBvZiB0aGlzIG5hbWVzcGFjZVxuICAgIEBjb25zdHJ1Y3RvclxuICAgIEBpbnRlcm5hbFxuICAgIEBtZW1iZXJPZiBtYWtlTmFtZVNwYWNlXG4gICAgIyMjXG4gICAgQ2xhc3MgPSBuZXcgRnVuY3Rpb24oJ3JldHVybiBmdW5jdGlvbiAnICsgc3BhY2VuYW1lICsgJygpe30nKSgpXG4gICAgQ2xhc3M6OiA9IG5ldyBCYXNlKHNwYWNlbmFtZSlcblxuICAgICNDbGFzcy5wcm90b3R5cGUucGFyZW50ID0gQmFzZS5wcm90b3R5cGU7XG4gICAgbmV3IENsYXNzKHNwYWNlbmFtZSlcblxuICAjIyNcbiAgJ0RlcGVuZCcgYW4gT2JqZWN0IHVwb24gYW5vdGhlciBtZW1iZXIgb2YgdGhpcyBuYW1lc3BhY2UsIHVwb24gYW5vdGhlciBuYW1lc3BhY2UsXG4gIG9yIHVwb24gYSBtZW1iZXIgb2YgYW5vdGhlciBuYW1lc3BhY2VcbiAgIyMjXG4gIGRlcGVuZHNPbiA9IChkZXBlbmRlbmNpZXMsIGNhbGxCYWNrLCBpbXBvcnRzKSAtPlxuICAgICd1c2Ugc3RyaWN0J1xuICAgIHJldCA9IGZhbHNlXG4gICAgbnNNZW1iZXJzID0gbnNJbnRlcm5hbC5nZXROc01lbWJlcnMoKVxuICAgIGlmIGRlcGVuZGVuY2llcyBhbmQgZGVwZW5kZW5jaWVzLmxlbmd0aCA+IDAgYW5kIGNhbGxCYWNrXG4gICAgICBtaXNzaW5nID0gZGVwZW5kZW5jaWVzLmZpbHRlcigoZGVwZW4pIC0+XG4gICAgICAgIG5zTWVtYmVycy5pbmRleE9mKGRlcGVuKSBpcyAtMSBhbmQgKG5vdCBpbXBvcnRzIG9yIGltcG9ydHMgaXNudCBkZXBlbilcbiAgICAgIClcbiAgICAgIGlmIG1pc3NpbmcubGVuZ3RoIGlzIDBcbiAgICAgICAgcmV0ID0gdHJ1ZVxuICAgICAgICBjYWxsQmFjaygpXG4gICAgICBlbHNlXG4gICAgICAgIG5zSW50ZXJuYWwuZGVwZW5kZW50cy5wdXNoIChpbXBvcnRzKSAtPlxuICAgICAgICAgIGRlcGVuZHNPbiBtaXNzaW5nLCBjYWxsQmFjaywgaW1wb3J0c1xuXG4gICAgcmV0XG4gIG5zSW50ZXJuYWwgPSBkZXBlbmRlbnRzOiBbXVxuXG4gICMjI1xuICBGZXRjaGVzIHRoZSByZWdpc3RlcmVkIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgb24gdGhlIG5hbWVzcGFjZSBhbmQgaXRzIGNoaWxkIG5hbWVzcGFjZXNcbiAgIyMjXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBuc0ludGVybmFsLCAnZ2V0TnNNZW1iZXJzJyxcbiAgICB2YWx1ZTogLT5cbiAgICAgIHJlY3Vyc2VUcmVlID0gKGtleSwgbGFzdEtleSkgLT5cbiAgICAgICAgbWVtYmVycy5wdXNoIGxhc3RLZXkgKyAnLicgKyBrZXkgIGlmIHR5cGVvZiAoa2V5KSBpcyAnc3RyaW5nJ1xuICAgICAgICBpZiB1dGlsTGliLmlzUGxhaW5PYmplY3Qoa2V5KVxuICAgICAgICAgIE9iamVjdC5rZXlzKGtleSkuZm9yRWFjaCAoaykgLT5cbiAgICAgICAgICAgIG1lbWJlcnMucHVzaCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdHlwZW9mIChrKSBpcyAnc3RyaW5nJ1xuICAgICAgICAgICAgcmVjdXJzZVRyZWUga2V5W2tdLCBsYXN0S2V5ICsgJy4nICsgayAgaWYgdXRpbExpYi5pc1BsYWluT2JqZWN0KGtleVtrXSlcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJldHVyblxuICAgICAgbWVtYmVycyA9IFtdXG4gICAgICBPYmplY3Qua2V5cyhOc1RyZWVbbmFtZVNwYWNlTmFtZV0pLmZvckVhY2ggKGtleSkgLT5cbiAgICAgICAgcmVjdXJzZVRyZWUgTnNUcmVlW25hbWVTcGFjZU5hbWVdW2tleV0sIG5hbWVTcGFjZU5hbWUgIGlmIHV0aWxMaWIuaXNQbGFpbk9iamVjdChOc1RyZWVbbmFtZVNwYWNlTmFtZV1ba2V5XSlcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIG1lbWJlcnNcblxuICAjIyNcbiAgVG8gc3VwcG9ydCBkZXBlbmRlbmN5IG1hbmFnZW1lbnQsIHdoZW4gYSBwcm9wZXJ0eSBpcyBsaWZ0ZWQgb250byB0aGUgbmFtZXNwYWNlLCBub3RpZnkgZGVwZW5kZW50cyB0byBpbml0aWFsaXplXG4gICMjI1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgbnNJbnRlcm5hbCwgJ2FsZXJ0RGVwZW5kZW50cycsXG4gICAgdmFsdWU6IChpbXBvcnRzKSAtPlxuICAgICAgZGVwcyA9IG5zSW50ZXJuYWwuZGVwZW5kZW50cy5maWx0ZXIoKGRlcE9uKSAtPlxuICAgICAgICBmYWxzZSBpcyBkZXBPbihpbXBvcnRzKVxuICAgICAgKVxuICAgICAgbnNJbnRlcm5hbC5kZXBlbmRlbnRzID0gZGVwcyAgaWYgQXJyYXkuaXNBcnJheShkZXBzKVxuXG4gICNDcmVhdGUgdGhlIHJvb3Qgb2YgdGhlIHRyZWUgYXMgdGhlIGN1cnJlbnQgbmFtZXNwYWNlXG4gIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSA9IHt9XG4gICNEZWZpbmUgdGhlIGNvcmUgbmFtZXNwYWNlIGFuZCB0aGUgcmV0dXJuIG9mIHRoaXMgY2xhc3NcbiAgTnNPdXQgPSBtYWtlTmFtZVNwYWNlKG5hbWVTcGFjZU5hbWUsIE5zVHJlZVtuYW1lU3BhY2VOYW1lXSlcblxuICAjIyNcbiAgQ2FjaGUgYSBoYW5kbGUgb24gdGhlIHZlbmRvciAocHJvYmFibHkgalF1ZXJ5KSBvbiB0aGUgcm9vdCBuYW1lc3BhY2VcbiAgIyMjXG4gIE5zT3V0LnJlZ2lzdGVyICc/JywgdXRpbExpYiwgZmFsc2VcblxuICAjIyNcbiAgQ2FjaGUgdGhlIHRyZWUgKHVzZWZ1bCBmb3IgZG9jdW1lbnRhdGlvbi92aXN1YWxpemF0aW9uL2RlYnVnZ2luZylcbiAgIyMjXG4gIE5zT3V0LnJlZ2lzdGVyICd0cmVlJywgTnNUcmVlW25hbWVTcGFjZU5hbWVdLCBmYWxzZVxuXG4gICMjI1xuICBDYWNoZSB0aGUgbmFtZSBzcGFjZSBuYW1lXG4gICMjI1xuICBOc091dC5yZWdpc3RlciAnbmFtZScsIG5hbWVTcGFjZU5hbWUsIGZhbHNlXG4gIE5zT3V0LnJlZ2lzdGVyICdkZXBlbmRzT24nLCBkZXBlbmRzT24sIGZhbHNlXG4gIE5zT3V0XG5cblxuIyMjXG5BY3R1YWxseSBkZWZpbmUgdGhlIE9KIE5hbWVTcGFjZVxuIyMjXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgdGhpc0dsb2JhbCwgbmFtZVNwYWNlTmFtZSxcbiAgdmFsdWU6IG1ha2VUaGVKdWljZSgpXG5cbk9KLnJlZ2lzdGVyICdnbG9iYWwnLCB0aGlzR2xvYmFsXG5cbnRoaXNEb2N1bWVudCA9IHt9XG5pZiB0eXBlb2YgZG9jdW1lbnQgaXNudCAndW5kZWZpbmVkJ1xuICB0aGlzRG9jdW1lbnQgPSBkb2N1bWVudFxuXG5PSi5yZWdpc3RlciAnZG9jdW1lbnQnLCB0aGlzRG9jdW1lbnRcblxuT0oucmVnaXN0ZXIgJ25vb3AnLCAtPlxuXG5tb2R1bGUuZXhwb3J0cyA9IE9KIiwiICMgIyBPSiBQb3N0LUluaXRpYWxpemF0aW9uXHJcblxyXG5PSiA9IHJlcXVpcmUgJy4vb2onXHJcbl8gPSByZXF1aXJlICdsb2Rhc2gnXHJcblxyXG4jIFNpbXBsZSBhcnJheSBvZiBhbnRpY2lwYXRlZC9rbm93biBjaGlsZCBuYW1lc3BhY2VzXHJcbiAgXHJcbnN1Yk5hbWVTcGFjZXMgPSBbXHJcbiAgJ2Vycm9ycydcclxuICAnZW51bXMnXHJcbiAgJ2luc3RhbmNlT2YnXHJcbiAgJ25vZGVzJ1xyXG4gICdkYidcclxuICAnY29tcG9uZW50cydcclxuICAnY29udHJvbHMnXHJcbiAgJ2lucHV0cydcclxuICAnbm90aWZpY2F0aW9ucydcclxuICAnaGlzdG9yeSdcclxuICAnY29va2llJ1xyXG4gICdhc3luYydcclxuXVxyXG5cclxuIyAjIyBTdWJOYW1lU3BhY2VzXHJcblxyXG4jIFByZS1hbGxvY2F0ZSBjZXJ0YWluIGNvbW1vbiBuYW1lc3BhY2VzIHRvIGF2b2lkIGZ1dHVyZSByYWNlIGNvbmRpdGlvbnMuXHJcbiMgVGhpcyBkb2VzIHJlcXVpcmUgdGhhdCB0aGUgb3JkZXIgb2Ygb3BlcmF0aW9ucyBsb2FkcyBPSi5jb2ZmZWUgZmlyc3QgYW5kIG9KSW5pdC5jb2ZmZWUgc2Vjb25kXHJcbl8uZWFjaCBzdWJOYW1lU3BhY2VzLCAobmFtZSkgLT5cclxuICBPSi5tYWtlU3ViTmFtZVNwYWNlIG5hbWVcclxuICBcclxuIyAjIyBDb25maWd1cmF0aW9uIHZhcmlhYmxlc1xyXG5cclxuIyBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlIHVuaXF1ZSBJRHMgZm9yIGVhY2ggbm9kZSAoZGVmYXVsdCBmYWxzZSlcclxuT0pbJ0dFTkVSQVRFX1VOSVFVRV9JRFMnXSA9IGZhbHNlXHJcbiMgRGVmYXVsdCByb290IG5vZGUgZm9yIGNvbXBvbmVudHMvY29udHJvbHMgKGRlZmF1bHQgJ2RpdicpXHJcbk9KWydERUZBVUxUX0NPTVBPTkVOVF9ST09UX05PREVUWVBFJ10gPSAnZGl2J1xyXG4jIFdoZXRoZXIgdG8gaG9vayBpbnRvIHRoZSBnbG9iYWwgb24gZXJyb3IgZXZlbnQgdG8gd3JpdGUgZXJyb3JzIHRvIGNvbnNvbGUgKGRlZmF1bHQgZmFsc2UpXHJcbk9KWydUUkFDS19PTl9FUlJPUiddID0gZmFsc2VcclxuI1doZXRoZXIgdG8gbG9nIGFsbCBBSkFYIHJlcXVlc3RzXHJcbk9KWydMT0dfQUxMX0FKQVgnXSA9IGZhbHNlXHJcbiNXaGV0aGVyIHRvIGxvZyBhbGwgQUpBWCBlcnJvcnNcclxuT0pbJ0xPR19BTExfQUpBWF9FUlJPUlMnXSA9IGZhbHNlIiwiXHJcbiMjI1xyXG5SZXR1cm4ganVzdCB0aGUga2V5cyBmcm9tIHRoZSBpbnB1dCBhcnJheSwgb3B0aW9uYWxseSBvbmx5IGZvciB0aGUgc3BlY2lmaWVkIHNlYXJjaF92YWx1ZVxyXG52ZXJzaW9uOiAxMTA5LjIwMTVcclxuZGlzY3VzcyBhdDogaHR0cDovL3BocGpzLm9yZy9mdW5jdGlvbnMvYXJyYXlfa2V5c1xyXG4rICAgb3JpZ2luYWwgYnk6IEtldmluIHZhbiBab25uZXZlbGQgKGh0dHA6Ly9rZXZpbi52YW56b25uZXZlbGQubmV0KVxyXG4rICAgICAgaW5wdXQgYnk6IEJyZXR0IFphbWlyIChodHRwOi8vYnJldHQtemFtaXIubWUpXHJcbisgICBidWdmaXhlZCBieTogS2V2aW4gdmFuIFpvbm5ldmVsZCAoaHR0cDovL2tldmluLnZhbnpvbm5ldmVsZC5uZXQpXHJcbisgICBpbXByb3ZlZCBieTogamRcclxuKyAgIGltcHJvdmVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxyXG4rICAgaW5wdXQgYnk6IFBcclxuKyAgIGJ1Z2ZpeGVkIGJ5OiBCcmV0dCBaYW1pciAoaHR0cDovL2JyZXR0LXphbWlyLm1lKVxyXG5leGFtcGxlIDE6IGFycmF5X2tleXMoIHtmaXJzdG5hbWU6ICdLZXZpbicsIHN1cm5hbWU6ICd2YW4gWm9ubmV2ZWxkJ30gKTtcclxucmV0dXJucyAxOiB7MDogJ2ZpcnN0bmFtZScsIDE6ICdzdXJuYW1lJ31cclxuIyMjXHJcbmFycmF5X2tleXMgPSAoaW5wdXQsIHNlYXJjaF92YWx1ZSwgYXJnU3RyaWN0KSAtPlxyXG4gIHNlYXJjaCA9IHR5cGVvZiBzZWFyY2hfdmFsdWUgaXNudCBcInVuZGVmaW5lZFwiXHJcbiAgdG1wX2FyciA9IFtdXHJcbiAgc3RyaWN0ID0gISFhcmdTdHJpY3RcclxuICBpbmNsdWRlID0gdHJ1ZVxyXG4gIGtleSA9IFwiXCJcclxuICAjIER1Y2stdHlwZSBjaGVjayBmb3Igb3VyIG93biBhcnJheSgpLWNyZWF0ZWQgUEhQSlNfQXJyYXlcclxuICByZXR1cm4gaW5wdXQua2V5cyhzZWFyY2hfdmFsdWUsIGFyZ1N0cmljdCkgIGlmIGlucHV0IGFuZCB0eXBlb2YgaW5wdXQgaXMgXCJvYmplY3RcIiBhbmQgaW5wdXQuY2hhbmdlX2tleV9jYXNlXHJcbiAgZm9yIGtleSBvZiBpbnB1dFxyXG4gICAgaWYgaW5wdXQuaGFzT3duUHJvcGVydHkoa2V5KVxyXG4gICAgICBpbmNsdWRlID0gdHJ1ZVxyXG4gICAgICBpZiBzZWFyY2hcclxuICAgICAgICBpZiBzdHJpY3QgYW5kIGlucHV0W2tleV0gaXNudCBzZWFyY2hfdmFsdWVcclxuICAgICAgICAgIGluY2x1ZGUgPSBmYWxzZVxyXG4gICAgICAgIGVsc2UgaW5jbHVkZSA9IGZhbHNlICB1bmxlc3MgaW5wdXRba2V5XSBpcyBzZWFyY2hfdmFsdWVcclxuICAgICAgdG1wX2Fyclt0bXBfYXJyLmxlbmd0aF0gPSBrZXkgIGlmIGluY2x1ZGVcclxuICB0bXBfYXJyXHJcblxyXG4jIyMqXHJcbkNvbnZlcnQgYSBKYXZhc2NyaXB0IE9qZWN0IGFycmF5IG9yIFN0cmluZyBhcnJheSB0byBhbiBIVE1MIHRhYmxlXHJcbkpTT04gcGFyc2luZyBoYXMgdG8gYmUgbWFkZSBiZWZvcmUgZnVuY3Rpb24gY2FsbFxyXG5JdCBhbGxvd3MgdXNlIG9mIG90aGVyIEpTT04gcGFyc2luZyBtZXRob2RzIGxpa2UgalF1ZXJ5LnBhcnNlSlNPTlxyXG5odHRwKHMpOi8vLCBmdHA6Ly8sIGZpbGU6Ly8gYW5kIGphdmFzY3JpcHQ6OyBsaW5rcyBhcmUgYXV0b21hdGljYWxseSBjb21wdXRlZFxyXG5cclxuSlNPTiBkYXRhIHNhbXBsZXMgdGhhdCBzaG91bGQgYmUgcGFyc2VkIGFuZCB0aGVuIGNhbiBiZSBjb252ZXJ0ZWQgdG8gYW4gSFRNTCB0YWJsZVxyXG52YXIgb2JqZWN0QXJyYXkgPSAnW3tcIlRvdGFsXCI6XCIzNFwiLFwiVmVyc2lvblwiOlwiMS4wLjRcIixcIk9mZmljZVwiOlwiTmV3IFlvcmtcIn0se1wiVG90YWxcIjpcIjY3XCIsXCJWZXJzaW9uXCI6XCIxLjEuMFwiLFwiT2ZmaWNlXCI6XCJQYXJpc1wifV0nO1xyXG52YXIgc3RyaW5nQXJyYXkgPSAnW1wiTmV3IFlvcmtcIixcIkJlcmxpblwiLFwiUGFyaXNcIixcIk1hcnJha2VjaFwiLFwiTW9zY293XCJdJztcclxudmFyIG5lc3RlZFRhYmxlID0gJ1t7IGtleTE6IFwidmFsMVwiLCBrZXkyOiBcInZhbDJcIiwga2V5MzogeyB0YWJsZUlkOiBcInRibElkTmVzdGVkMVwiLCB0YWJsZUNsYXNzTmFtZTogXCJjbHNOZXN0ZWRcIiwgbGlua1RleHQ6IFwiRG93bmxvYWRcIiwgZGF0YTogW3sgc3Via2V5MTogXCJzdWJ2YWwxXCIsIHN1YmtleTI6IFwic3VidmFsMlwiLCBzdWJrZXkzOiBcInN1YnZhbDNcIiB9XSB9IH1dJztcclxuXHJcbkNvZGUgc2FtcGxlIHRvIGNyZWF0ZSBhIEhUTUwgdGFibGUgSmF2YXNjcmlwdCBTdHJpbmdcclxudmFyIGpzb25IdG1sVGFibGUgPSBDb252ZXJ0SnNvblRvVGFibGUoZXZhbChkYXRhU3RyaW5nKSwgJ2pzb25UYWJsZScsIG51bGwsICdEb3dubG9hZCcpO1xyXG5cclxuQ29kZSBzYW1wbGUgZXhwbGFuZWRcclxuLSBldmFsIGlzIHVzZWQgdG8gcGFyc2UgYSBKU09OIGRhdGFTdHJpbmdcclxuLSB0YWJsZSBIVE1MIGlkIGF0dHJpYnV0ZSB3aWxsIGJlICdqc29uVGFibGUnXHJcbi0gdGFibGUgSFRNTCBjbGFzcyBhdHRyaWJ1dGUgd2lsbCBub3QgYmUgYWRkZWRcclxuLSAnRG93bmxvYWQnIHRleHQgd2lsbCBiZSBkaXNwbGF5ZWQgaW5zdGVhZCBvZiB0aGUgbGluayBpdHNlbGZcclxuXHJcbkBhdXRob3IgQWZzaGluIE1laHJhYmFuaSA8YWZzaGluIGRvdCBtZWggYXQgZ21haWwgZG90IGNvbT5cclxuXHJcbkBjbGFzcyBDb252ZXJ0SnNvblRvVGFibGVcclxuXHJcbkBtZXRob2QgQ29udmVydEpzb25Ub1RhYmxlXHJcblxyXG5AcGFyYW0gcGFyc2VkSnNvbiBvYmplY3QgUGFyc2VkIEpTT04gZGF0YVxyXG5AcGFyYW0gdGFibGVJZCBzdHJpbmcgT3B0aW9uYWwgdGFibGUgaWRcclxuQHBhcmFtIHRhYmxlQ2xhc3NOYW1lIHN0cmluZyBPcHRpb25hbCB0YWJsZSBjc3MgY2xhc3MgbmFtZVxyXG5AcGFyYW0gbGlua1RleHQgc3RyaW5nIE9wdGlvbmFsIHRleHQgcmVwbGFjZW1lbnQgZm9yIGxpbmsgcGF0dGVyblxyXG5cclxuQHJldHVybiBzdHJpbmcgQ29udmVydGVkIEpTT04gdG8gSFRNTCB0YWJsZVxyXG4jIyNcclxuY2xhc3MgSnNvblRvVGFibGUgXHJcbiAgXHJcbiAgdGFibGU6IG51bGxcclxuICBcclxuICBjb25zdHJ1Y3RvcjogKHBhcnNlZEpzb24sIHRhYmxlSWQsIHRhYmxlQ2xhc3NOYW1lLCBsaW5rVGV4dCkgLT5cclxuICAgICNQYXR0ZXJucyBmb3IgbGlua3MgYW5kIE5VTEwgdmFsdWVcclxuICAgIGl0YWxpYyA9IFwiPGk+ezB9PC9pPlwiXHJcbiAgICBsaW5rID0gKGlmIGxpbmtUZXh0IHRoZW4gXCI8YSBocmVmPVxcXCJ7MH1cXFwiPlwiICsgbGlua1RleHQgKyBcIjwvYT5cIiBlbHNlIFwiPGEgaHJlZj1cXFwiezB9XFxcIj57MH08L2E+XCIpXHJcbiAgXHJcbiAgICAjUGF0dGVybiBmb3IgdGFibGUgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgaWRNYXJrdXAgPSAoaWYgdGFibGVJZCB0aGVuIFwiIGlkPVxcXCJcIiArIHRhYmxlSWQgKyBcIlxcXCJcIiBlbHNlIFwiXCIpXHJcbiAgICBjbGFzc01hcmt1cCA9IChpZiB0YWJsZUNsYXNzTmFtZSB0aGVuIFwiIGNsYXNzPVxcXCJcIiArIHRhYmxlQ2xhc3NOYW1lICsgXCJcXFwiXCIgZWxzZSBcIlwiKVxyXG4gICAgdGJsID0gXCI8dGFibGUgYm9yZGVyPVxcXCIxXFxcIiBjZWxscGFkZGluZz1cXFwiMVxcXCIgY2VsbHNwYWNpbmc9XFxcIjFcXFwiXCIgKyBpZE1hcmt1cCArIGNsYXNzTWFya3VwICsgXCI+ezB9ezF9PC90YWJsZT5cIlxyXG4gIFxyXG4gICAgI1BhdHRlcm5zIGZvciB0YWJsZSBjb250ZW50XHJcbiAgICB0aCA9IFwiPHRoZWFkPnswfTwvdGhlYWQ+XCJcclxuICAgIHRiID0gXCI8dGJvZHk+ezB9PC90Ym9keT5cIlxyXG4gICAgdHIgPSBcIjx0cj57MH08L3RyPlwiXHJcbiAgICB0aFJvdyA9IFwiPHRoPnswfTwvdGg+XCJcclxuICAgIHRkUm93ID0gXCI8dGQ+ezB9PC90ZD5cIlxyXG4gICAgdGhDb24gPSBcIlwiXHJcbiAgICB0YkNvbiA9IFwiXCJcclxuICAgIHRyQ29uID0gXCJcIlxyXG4gICAgaWYgcGFyc2VkSnNvblxyXG4gICAgICBpc1N0cmluZ0FycmF5ID0gdHlwZW9mIChwYXJzZWRKc29uWzBdKSBpcyBcInN0cmluZ1wiXHJcbiAgICAgIGhlYWRlcnMgPSB1bmRlZmluZWRcclxuICAgIFxyXG4gICAgICAjIENyZWF0ZSB0YWJsZSBoZWFkZXJzIGZyb20gSlNPTiBkYXRhXHJcbiAgICAgICMgSWYgSlNPTiBkYXRhIGlzIGEgc2ltcGxlIHN0cmluZyBhcnJheSB3ZSBjcmVhdGUgYSBzaW5nbGUgdGFibGUgaGVhZGVyXHJcbiAgICAgIGlmIGlzU3RyaW5nQXJyYXlcclxuICAgICAgICB0aENvbiArPSB0aFJvdy5mb3JtYXQoXCJ2YWx1ZVwiKVxyXG4gICAgICBlbHNlXHJcbiAgICAgIFxyXG4gICAgICAgICMgSWYgSlNPTiBkYXRhIGlzIGFuIG9iamVjdCBhcnJheSwgaGVhZGVycyBhcmUgYXV0b21hdGljYWxseSBjb21wdXRlZFxyXG4gICAgICAgIGlmIHR5cGVvZiAocGFyc2VkSnNvblswXSkgaXMgXCJvYmplY3RcIlxyXG4gICAgICAgICAgaGVhZGVycyA9IGFycmF5X2tleXMocGFyc2VkSnNvblswXSlcclxuICAgICAgICAgIGkgPSAwXHJcbiAgICAgICAgICB3aGlsZSBpIDwgaGVhZGVycy5sZW5ndGhcclxuICAgICAgICAgICAgdGhDb24gKz0gdGhSb3cuZm9ybWF0KGhlYWRlcnNbaV0pXHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICB0aCA9IHRoLmZvcm1hdCh0ci5mb3JtYXQodGhDb24pKVxyXG4gICAgXHJcbiAgICAgICMgQ3JlYXRlIHRhYmxlIHJvd3MgZnJvbSBKc29uIGRhdGFcclxuICAgICAgaWYgaXNTdHJpbmdBcnJheVxyXG4gICAgICAgIGkgPSAwXHJcbiAgICAgICAgd2hpbGUgaSA8IHBhcnNlZEpzb24ubGVuZ3RoXHJcbiAgICAgICAgICB0YkNvbiArPSB0ZFJvdy5mb3JtYXQocGFyc2VkSnNvbltpXSlcclxuICAgICAgICAgIHRyQ29uICs9IHRyLmZvcm1hdCh0YkNvbilcclxuICAgICAgICAgIHRiQ29uID0gXCJcIlxyXG4gICAgICAgICAgaSsrXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBpZiBoZWFkZXJzXHJcbiAgICAgICAgICB1cmxSZWdFeHAgPSBuZXcgUmVnRXhwKC8oXFxiKGh0dHBzP3xmdHB8ZmlsZSk6XFwvXFwvWy1BLVowLTkrJkAjXFwvJT89fl98ITosLjtdKlstQS1aMC05KyZAI1xcLyU9fl98XSkvZylcclxuICAgICAgICAgIGphdmFzY3JpcHRSZWdFeHAgPSBuZXcgUmVnRXhwKC8oXmphdmFzY3JpcHQ6W1xcc1xcU10qOyQpL2cpXHJcbiAgICAgICAgICBpID0gMFxyXG4gICAgICAgICAgd2hpbGUgaSA8IHBhcnNlZEpzb24ubGVuZ3RoXHJcbiAgICAgICAgICAgIGogPSAwXHJcbiAgICAgICAgICAgIHdoaWxlIGogPCBoZWFkZXJzLmxlbmd0aFxyXG4gICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VkSnNvbltpXVtoZWFkZXJzW2pdXVxyXG4gICAgICAgICAgICAgIGlzVXJsID0gdXJsUmVnRXhwLnRlc3QodmFsdWUpIG9yIGphdmFzY3JpcHRSZWdFeHAudGVzdCh2YWx1ZSlcclxuICAgICAgICAgICAgICBpZiBpc1VybCAjIElmIHZhbHVlIGlzIFVSTCB3ZSBhdXRvLWNyZWF0ZSBhIGxpbmtcclxuICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChsaW5rLmZvcm1hdCh2YWx1ZSkpXHJcbiAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgaWYgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgaWYgdHlwZW9mICh2YWx1ZSkgaXMgXCJvYmplY3RcIlxyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAjZm9yIHN1cHBvcnRpbmcgbmVzdGVkIHRhYmxlc1xyXG4gICAgICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdChDb252ZXJ0SnNvblRvVGFibGUoZXZhbCh2YWx1ZS5kYXRhKSwgdmFsdWUudGFibGVJZCwgdmFsdWUudGFibGVDbGFzc05hbWUsIHZhbHVlLmxpbmtUZXh0KSlcclxuICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHRiQ29uICs9IHRkUm93LmZvcm1hdCh2YWx1ZSlcclxuICAgICAgICAgICAgICAgIGVsc2UgIyBJZiB2YWx1ZSA9PSBudWxsIHdlIGZvcm1hdCBpdCBsaWtlIFBocE15QWRtaW4gTlVMTCB2YWx1ZXNcclxuICAgICAgICAgICAgICAgICAgdGJDb24gKz0gdGRSb3cuZm9ybWF0KGl0YWxpYy5mb3JtYXQodmFsdWUpLnRvVXBwZXJDYXNlKCkpXHJcbiAgICAgICAgICAgICAgaisrXHJcbiAgICAgICAgICAgIHRyQ29uICs9IHRyLmZvcm1hdCh0YkNvbilcclxuICAgICAgICAgICAgdGJDb24gPSBcIlwiXHJcbiAgICAgICAgICAgIGkrK1xyXG4gICAgICB0YiA9IHRiLmZvcm1hdCh0ckNvbilcclxuICAgICAgdGJsID0gdGJsLmZvcm1hdCh0aCwgdGIpXHJcbiAgICBAdGFibGUgPSB0YmxcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSnNvblRvVGFibGUiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG5hcnJheTJEID0gKGluaXRMZW5ndGgsIGluaXRXaWR0aCkgLT5cclxuICBhcnJheSA9IFtdXHJcbiAgbWF4TGVuZ3RoID0gMFxyXG4gIG1heFdpZHRoID0gMFxyXG4gICAgXHJcbiAgcmV0ID0gXHJcbiAgICBnZXQ6IChyb3dObywgY29sTm8pIC0+XHJcbiAgICAgIGV4dGVuZCByb3dObywgY29sTm9cclxuICAgIHNldDogKHJvd05vLCBjb2xObywgdmFsKSAtPlxyXG4gICAgICByZXQuZ2V0IHJvd05vLCBjb2xOb1xyXG4gICAgICByb3dJZHggPSByb3dOby0xXHJcbiAgICAgIGNvbElkeCA9IGNvbE5vLTFcclxuICAgICAgYXJyYXlbcm93SWR4XVtjb2xJZHhdID0gdmFsXHJcbiAgICBlYWNoOiAoY2FsbEJhY2spIC0+XHJcbiAgICAgIF8uZWFjaCBhcnJheSwgKGNvbHVtbnMsIHJvdykgLT5cclxuICAgICAgICBfLmVhY2ggYXJyYXlbcm93XSwgKHZhbCwgY29sKSAtPlxyXG4gICAgICAgICAgcm93SWR4ID0gcm93KzFcclxuICAgICAgICAgIGNvbElkeCA9IGNvbCsxXHJcbiAgICAgICAgICBjYWxsQmFjayByb3dJZHgsIGNvbElkeCwgdmFsXHJcbiAgICB3aWR0aDogKCkgLT5cclxuICAgICAgbWF4V2lkdGhcclxuICAgIGxlbmd0aDogKCkgLT5cclxuICAgICAgbWF4TGVuZ3RoXHJcbiAgICAgICAgIFxyXG4gICMjI1xyXG4gIEd1YXJhbnRlZSB0aGF0IHRoZSBkaW1lbnNpb25zIG9mIHRoZSBhcnJheSBhcmUgYWx3YXlzIGJhY2tlZCBieSB2YWx1ZXMgYXQgZXZlcnkgcG9zaXRpb25cclxuICAjIyMgICAgICAgICAgICAgICAgICAgIFxyXG4gIGV4dGVuZCA9IChsZW5ndGgsIHdpZHRoKSAtPiAgXHJcbiAgICBpZiBub3QgbGVuZ3RoIG9yIGxlbmd0aCA8IDEgdGhlbiBsZW5ndGggPSAxXHJcbiAgICBpZiBub3Qgd2lkdGggb3Igd2lkdGggPCAxIHRoZW4gd2lkdGggPSAxXHJcbiAgICAgIFxyXG4gICAgaWYgbWF4TGVuZ3RoIDwgbGVuZ3RoIHRoZW4gbWF4TGVuZ3RoID0gbGVuZ3RoXHJcbiAgICBpZiBhcnJheS5sZW5ndGggPiBtYXhMZW5ndGggdGhlbiBtYXhMZW5ndGggPSBhcnJheS5sZW5ndGhcclxuICAgIGlmIG1heFdpZHRoIDwgd2lkdGggdGhlbiBtYXhXaWR0aCA9IHdpZHRoXHJcbiAgICBpID0gMFxyXG4gICAgICBcclxuICAgIHdoaWxlIGkgPCBtYXhMZW5ndGhcclxuICAgICAgdHJ5Um93ID0gYXJyYXlbaV1cclxuICAgICAgaWYgbm90IHRyeVJvd1xyXG4gICAgICAgIHRyeVJvdyA9IFtdXHJcbiAgICAgICAgYXJyYXkucHVzaCB0cnlSb3dcclxuICAgICAgaWYgbWF4V2lkdGggPCB0cnlSb3cubGVuZ3RoIHRoZW4gbWF4V2lkdGggPSB0cnlSb3cubGVuZ3RoXHJcbiAgICAgIGlmIHRyeVJvdy5sZW5ndGggPCBtYXhXaWR0aCB0aGVuIHRyeVJvdy5sZW5ndGggPSBtYXhXaWR0aFxyXG4gICAgICBpICs9IDFcclxuICAgICAgXHJcbiAgICBhcnJheVtsZW5ndGgtMV1bd2lkdGgtMV1cclxuICAgICAgIFxyXG4gIGV4dGVuZCBpbml0TGVuZ3RoLCBpbml0V2lkdGhcclxuICAgIFxyXG4gIHJldFxyXG5cclxuT0oucmVnaXN0ZXIgJ2FycmF5MkQnLCBhcnJheTJEXHJcbm1vZHVsZS5leHBvcnRzID0gYXJyYXkyRCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbm1ldGhvZHMgPSBbXHJcbiAgJ2Fzc2VydCdcclxuICAnY2xlYXInXHJcbiAgJ2NvdW50J1xyXG4gICdkZWJ1ZydcclxuICAnZGlyJ1xyXG4gICdkaXJ4bWwnXHJcbiAgJ2Vycm9yJ1xyXG4gICdleGNlcHRpb24nXHJcbiAgJ2dyb3VwJ1xyXG4gICdncm91cENvbGxhcHNlZCdcclxuICAnZ3JvdXBFbmQnXHJcbiAgJ2luZm8nXHJcbiAgJ2xvZydcclxuICAnbWVtb3J5J1xyXG4gICdwcm9maWxlJ1xyXG4gICdwcm9maWxlRW5kJ1xyXG4gICd0YWJsZSdcclxuICAndGltZSdcclxuICAndGltZUVuZCdcclxuICAndGltZVN0YW1wJ1xyXG4gICd0aW1lbGluZSdcclxuICAndGltZWxpbmVFbmQnXHJcbiAgJ3RyYWNlJ1xyXG4gICd3YXJuJ1xyXG5dXHJcbm1ldGhvZExlbmd0aCA9IG1ldGhvZHMubGVuZ3RoXHJcbmNvbnNvbGUgPSBPSi5nbG9iYWwuY29uc29sZSBvciB7fVxyXG5PSi5tYWtlU3ViTmFtZVNwYWNlICdjb25zb2xlJ1xyXG4gIFxyXG4jIyNcclxuMS4gU3R1YiBvdXQgYW55IG1pc3NpbmcgbWV0aG9kcyB3aXRoIG5vb3BcclxuMi4gRGVmaW5lIHRoZSBhdmFpbGFibGUgbWV0aG9kcyBvbiB0aGUgT0ouY29uc29sZSBvYmplY3RcclxuIyMjXHJcbndoaWxlIG1ldGhvZExlbmd0aC0tXHJcbiAgKC0+XHJcbiAgICBtZXRob2QgPSBtZXRob2RzW21ldGhvZExlbmd0aF1cclxuICAgIFxyXG4gICAgIyBPbmx5IHN0dWIgdW5kZWZpbmVkIG1ldGhvZHMuXHJcbiAgICBjb25zb2xlW21ldGhvZF0gPSBPSi5ub29wIHVubGVzcyBjb25zb2xlW21ldGhvZF1cclxuICAgIFxyXG4gICAgI0RlZmluZSB0aGUgbWV0aG9kIG9uIHRoZSBPSiBjb25zb2xlIG5hbWVzcGFjZVxyXG4gICAgT0ouY29uc29sZS5yZWdpc3RlciBtZXRob2QsIChwYXJhbXMuLi4pIC0+XHJcbiAgICAgIGNvbnNvbGVbbWV0aG9kXSBwYXJhbXMuLi5cclxuICApKClcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY29uc29sZSIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiQgPSByZXF1aXJlICdqcXVlcnknXHJcbiAgXHJcbiMjI1xyXG5TZXR1cCBzZXR0aW5nc1xyXG4kLmNvb2tpZS5yYXcgPSB0cnVlXHJcbiQuY29va2llLmpzb24gPSB0cnVlXHJcbiAgXHJcblNldHVwIGRlZmF1bHRzXHJcbmh0dHBzOi8vZ2l0aHViLmNvbS9jYXJoYXJ0bC9qcXVlcnktY29va2llL1xyXG4kLmNvb2tpZS5kZWZhdWx0cy5leHBpcmVzID0gMzY1XHJcbiQuY29va2llLmRlZmF1bHRzLnBhdGggPSAnLydcclxuJC5jb29raWUuZGVmYXVsdHMuZG9tYWluID0gJ29qLmNvbSdcclxuIyMjXHJcbmlmIG5vdCAkIG9yIG5vdCAkLmNvb2tpZVxyXG4gIHRocm93IG5ldyBFcnJvciAnalF1ZXJ5IENvb2tpZSBpcyBhIHJlcXVpcmVkIGRlcGVuZGVuY3kuJyAgXHJcbiQuY29va2llLmRlZmF1bHRzLnNlY3VyZSA9IGZhbHNlXHJcbiAgXHJcbmNvb2tpZXMgPSB7fVxyXG4gIFxyXG5nZXQgPSAoY29va2llTmFtZSwgdHlwZSkgLT5cclxuICByZXQgPSAnJ1xyXG4gIGlmIGNvb2tpZU5hbWVcclxuICAgIGlmIHR5cGVcclxuICAgICAgcmV0ID0gJC5jb29raWUgY29va2llTmFtZSwgdHlwZVxyXG4gICAgZWxzZVxyXG4gICAgICByZXQgPSAkLmNvb2tpZSBjb29raWVOYW1lICAgIFxyXG4gICAgaWYgcmV0XHJcbiAgICAgIGNvb2tpZXNbY29va2llTmFtZV0gPSByZXRcclxuICBcclxuYWxsID0gLT5cclxuICByZXQgPSAkLmNvb2tpZSgpXHJcbiAgcmV0XHJcbiAgICBcclxuc2V0ID0gKGNvb2tpZU5hbWUsIHZhbHVlLCBvcHRzKSAtPlxyXG4gIHJldCA9ICcnXHJcbiAgaWYgY29va2llTmFtZVxyXG4gICAgY29va2llc1tjb29raWVOYW1lXSA9IHZhbHVlXHJcbiAgICBpZiBvcHRzXHJcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHZhbHVlLCBvcHRzXHJcbiAgICBlbHNlXHJcbiAgICAgIHJldCA9ICQuY29va2llIGNvb2tpZU5hbWUsIHZhbHVlXHJcbiAgcmV0ICBcclxuICBcclxuZGVsID0gKGNvb2tpZU5hbWUsIG9wdHMpIC0+XHJcbiAgaWYgY29va2llTmFtZVxyXG4gICAgaWYgb3B0c1xyXG4gICAgICAkLnJlbW92ZUNvb2tpZSBjb29raWVOYW1lLCBvcHRzXHJcbiAgICBlbHNlXHJcbiAgICAgICQucmVtb3ZlQ29va2llIGNvb2tpZU5hbWUgICAgXHJcbiAgICBkZWxldGUgY29va2llc1tjb29raWVOYW1lXVxyXG4gIHJldHVyblxyXG4gICAgXHJcbmRlbGV0ZUFsbCA9IC0+XHJcbiAgY29va2llcyA9IHt9XHJcbiAgT0ouZWFjaCBPSi5jb29raWUuYWxsLCAodmFsLCBrZXkpIC0+XHJcbiAgICBPSi5jb29raWUuZGVsZXRlIGtleSAgXHJcbiAgcmV0dXJuXHJcbiAgICBcclxuIE9KLmNvb2tpZS5yZWdpc3RlciAnZGVsZXRlQWxsJywgZGVsZXRlQWxsXHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2RlbGV0ZScsIGRlbFxyXG4gT0ouY29va2llLnJlZ2lzdGVyICdzZXQnLCBzZXRcclxuIE9KLmNvb2tpZS5yZWdpc3RlciAnZ2V0JywgZ2V0XHJcbiBPSi5jb29raWUucmVnaXN0ZXIgJ2FsbCcsICBhbGxcclxuIFxyXG4gbW9kdWxlLmV4cG9ydHMgPSBcclxuICBkZWxldGVBbGw6IGRlbGV0ZUFsbFxyXG4gIGRlbGV0ZTogZGVsXHJcbiAgc2V0OiBzZXRcclxuICBnZXQ6IGdldFxyXG4gIGFsbDogIGFsbCIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbmRlZmVyID0gKG1ldGhvZCwgd2FpdE1zKSAtPlxyXG4gIGlmIHNldFRpbWVvdXRcclxuICAgIHJldHVybiBzZXRUaW1lb3V0IG1ldGhvZCwgd2FpdE1zXHJcbiAgXHJcbk9KLnJlZ2lzdGVyICdkZWZlcicsIGRlZmVyXHJcbm1vZHVsZS5leHBvcnRzID0gZGVmZXIiLCIjICMgZWFjaFxyXG5cclxuT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbiMgIyMgY2FuRWFjaFxyXG5jYW5FYWNoID0gKG9iaikgLT5cclxuICAjIFJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgW2lzXShpcy5odG1sKSB0cnVseSBpdGVyYWJsZSAoZS5nLiBhbiBpbnN0YW5jZSBvZiBPYmplY3Qgb3IgQXJyYXkpXHJcbiAgT0ouaXMucGxhaW5PYmplY3Qob2JqKSBvciBPSi5pcy5vYmplY3Qob2JqKSBvciBPSi5pcy5hcnJheSBvYmpcclxuXHJcbiMgIyMgW09KXShvai5odG1sKS5lYWNoXHJcblxyXG4jIEl0ZXJhdGUgYWxsIG9mIHRoZSBtZW1iZXJzIG9mIGFuIG9iamVjdCAob3IgYW4gYXJyYXkpIHdpdGggb3B0aW9uYWwgY2FsbGJhY2sgYW5kIHJlY3Vyc2lvbi5cclxuXHJcbiMgLSBgb2JqYDogdGhlIG9iamVjdCB0byBpdGVyYXRlLFxyXG4jIC0gYG9uRWFjaGA6IGEgY2FsbGJhY2sgdG8gZXhlY3V0ZSBmb3IgZWFjaCBpdGVyYXRpb24sXHJcbiMgLSBgcmVjdXJzaXZlYDogaWYgdHJ1ZSwgcmVjdXJzaXZlbHkgaXRlcmF0ZSBhbGwgdmFsaWQgY2hpbGQgb2JqZWN0cy5cclxuZWFjaCA9IChvYmosIG9uRWFjaCwgcmVjdXJzaXZlKSAtPlxyXG4gIGlmIGNhbkVhY2ggb2JqXHJcbiAgICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI2Zvcm93bikncyBgZm9yT3duYCBtZXRob2QgdG8gZW5zdXJlIHRoYXQgb25seSB0aGUgYWN0dWFsIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdCBhcmUgZW51bWVyYXRlZC5cclxuXHJcbiAgICAjIC0gYG9uRWFjaGAgY2FsbGJhY2sgd2lsbCByZWNlaXZlIDIgcGFyYW1ldGVyczpcclxuICAgICMgLSBgdmFsYCBhbmQgYGtleWAuXHJcbiAgICAjIC0gYHZhbGAgaXMgYWx3YXlzIHRoZSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkuXHJcbiAgICAjIC0gYGtleWAgaXMgZWl0aGVyIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBvciB0aGUgY3VycmVudCBpbmRleCBvZiB0aGUgYXJyYXkuXHJcbiAgICBfLmZvck93biBvYmosICh2YWwsIGtleSkgLT5cclxuICAgICAgaWYgb25FYWNoIGFuZCAodmFsIG9yIGtleSlcclxuICAgICAgICBxdWl0ID0gb25FYWNoIHZhbCwga2V5XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlICBpZiBmYWxzZSBpcyBxdWl0XHJcbiAgICAgIGVhY2ggdmFsLCBvbkVhY2gsIHRydWUgIGlmIHRydWUgaXMgcmVjdXJzaXZlXHJcbiAgICAgIHJldHVyblxyXG5cclxuICByZXR1cm5cclxuXHJcbiMgIyMgcmVnaXN0ZXJcclxuXHJcbiMgcmVnaXN0ZXIgdGhlIGBlYWNoYCBtZXRob2Qgb24gdGhlIFtPSl0oT0ouaHRtbCkgbmFtZXNwYWNlXHJcbk9KLnJlZ2lzdGVyICdlYWNoJywgZWFjaFxyXG5tb2R1bGUuZXhwb3J0cyA9IGVhY2giLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG51bmtub3duID0gJ3Vua25vd24nICAgXHJcbiAgXHJcbmlucHV0VHlwZXMgPVxyXG4gIGJ1dHRvbjogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAwXHJcbiAgICBuYW1lOiAnYnV0dG9uJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBjaGVja2JveDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxXHJcbiAgICBuYW1lOiAnY2hlY2tib3gnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgY29sb3I6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMlxyXG4gICAgbmFtZTogJ2NvbG9yJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGRhdGU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogM1xyXG4gICAgbmFtZTogJ2RhdGUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBkYXRldGltZTogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA0XHJcbiAgICBuYW1lOiAnZGF0ZXRpbWUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgJ2RhdGV0aW1lLWxvY2FsJzogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA1XHJcbiAgICBuYW1lOiAnZGF0ZXRpbWUtbG9jYWwnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBlbWFpbDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiA2XHJcbiAgICBuYW1lOiAnZW1haWwnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIGZpbGU6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogN1xyXG4gICAgbmFtZTogJ2ZpbGUnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogZmFsc2VcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBoaWRkZW46ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogOFxyXG4gICAgbmFtZTogJ2hpZGRlbidcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiBmYWxzZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgaW1hZ2U6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogOVxyXG4gICAgbmFtZTogJ2ltYWdlJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBtb250aDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxMFxyXG4gICAgbmFtZTogJ21vbnRoJ1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBudW1iZXI6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTFcclxuICAgIG5hbWU6ICdudW1iZXInXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcGFzc3dvcmQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTJcclxuICAgIG5hbWU6ICdwYXNzd29yZCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHJhZGlvOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDEzXHJcbiAgICBuYW1lOiAncmFkaW8nXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnJ1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgcmFuZ2U6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTRcclxuICAgIG5hbWU6ICdyYW5nZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICByZXNldDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxNVxyXG4gICAgbmFtZTogJ3Jlc2V0J1xyXG4gICAgcGxhY2Vob2xkZXI6IGZhbHNlXHJcbiAgICBhdXRvY29tcGxldGU6IGZhbHNlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBzZWFyY2g6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTZcclxuICAgIG5hbWU6ICdzZWFyY2gnXHJcbiAgICBwbGFjZWhvbGRlcjogdHJ1ZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICBzdWJtaXQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTdcclxuICAgIG5hbWU6ICdzdWJtaXQnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHRlbDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAxOFxyXG4gICAgbmFtZTogJ2J1dHRvbidcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHRleHQ6ICNjaGFyYWN0ZXJzXHJcbiAgICBpZDogMTlcclxuICAgIG5hbWU6ICd0ZXh0J1xyXG4gICAgcGxhY2Vob2xkZXI6IHRydWVcclxuICAgIGF1dG9jb21wbGV0ZTogdHJ1ZVxyXG4gICAgdmFsdWU6XHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZVxyXG4gICAgICBhbGxvd2VkOiB0cnVlXHJcblxyXG4gICAgZGVmYXVsdHdpZHRoOiAnMjAwcHgnXHJcbiAgICBkZWZhdWx0c2l6ZTogJzI1J1xyXG5cclxuICB0aW1lOiAjY2hhcmFjdGVyc1xyXG4gICAgaWQ6IDIwXHJcbiAgICBuYW1lOiAndGltZSdcclxuICAgIHBsYWNlaG9sZGVyOiBmYWxzZVxyXG4gICAgYXV0b2NvbXBsZXRlOiB0cnVlXHJcbiAgICB2YWx1ZTpcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlXHJcbiAgICAgIGFsbG93ZWQ6IHRydWVcclxuXHJcbiAgICBkZWZhdWx0d2lkdGg6ICcyMDBweCdcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG4gIHVybDogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMVxyXG4gICAgbmFtZTogJ3VybCdcclxuICAgIHBsYWNlaG9sZGVyOiB0cnVlXHJcbiAgICBhdXRvY29tcGxldGU6IHRydWVcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJzIwMHB4J1xyXG4gICAgZGVmYXVsdHNpemU6ICcyNSdcclxuXHJcbiAgd2VlazogI2NoYXJhY3RlcnNcclxuICAgIGlkOiAyMlxyXG4gICAgbmFtZTogJ3dlZWsnXHJcbiAgICBwbGFjZWhvbGRlcjogZmFsc2VcclxuICAgIGF1dG9jb21wbGV0ZTogZmFsc2VcclxuICAgIHZhbHVlOlxyXG4gICAgICByZXF1aXJlZDogZmFsc2VcclxuICAgICAgYWxsb3dlZDogdHJ1ZVxyXG5cclxuICAgIGRlZmF1bHR3aWR0aDogJydcclxuICAgIGRlZmF1bHRzaXplOiAnMjUnXHJcblxyXG5PSi5lbnVtcy5yZWdpc3RlciAndW5rbm93bicsIHVua25vd25cclxuT0ouZW51bXMucmVnaXN0ZXIgJ2lucHV0VHlwZXMnLCBpbnB1dFR5cGVzXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFxyXG4gIHVua25vd246IHVua25vd25cclxuICBpbnB1dFR5cGVzOiBpbnB1dFR5cGVzIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuICBcclxuaWYgT0ouVFJBQ0tfT05fRVJST1JcclxuICBvbkVycm9yID0gT0ouZ2xvYmFsLm9uZXJyb3JcclxuXHJcbiAgIyMjXHJcbiAgTG9nIGVycm9ycyB0byB0aGUgY29uc29sZVxyXG4gICMjI1xyXG4gIE9KLmdsb2JhbC5vbmVycm9yID0gKG1zZywgdXJsLCBsaW5lTnVtYmVyKSAtPlxyXG4gICAgcmV0ID0gZmFsc2VcclxuICAgIE9KLmNvbnNvbGUud2FybiBcIiVzXFxyIHVybDogJXNcXHIgbGluZTogJWRcIiwgbXNnLCB1cmwsIGxpbmVOdW1iZXJcclxuICAgIHJldCA9IG9uRXJyb3IgbXNnLCB1cmwsIGxpbmVOdW1iZXIgaWYgb25FcnJvclxyXG4gICAgcmV0ICN0cnVlIG1lYW5zIGRvbid0IHByb3BhZ2F0ZSB0aGUgZXJyb3IgIiwiT0ogPSByZXF1aXJlICcuLi9vaidcclxuXHJcbmlmIE9KLmdsb2JhbC5hZGRFdmVudExpc3RlbmVyXHJcbiAgZXZlbnROYW1lID0gJ2FkZEV2ZW50TGlzdGVuZXInXHJcbiAgZXZlbnRJbmZvID0gJydcclxuZWxzZSBcclxuICBldmVudE5hbWUgPSAnYXR0YWNoRXZlbnQnXHJcbiAgZXZlbnRJbmZvID0gJ29uJ1xyXG4gIFxyXG5wdXNoU3RhdGUgPSAocGFnZU5hbWUsIGV2ZW50KSAtPlxyXG4gIGlmIHBhZ2VOYW1lXHJcbiAgICAjIGtlZXAgdGhlIGxpbmsgaW4gdGhlIGJyb3dzZXIgaGlzdG9yeVxyXG4gICAgaGlzdG9yeS5wdXNoU3RhdGUgbnVsbCwgbnVsbCwgJyMnICsgcGFnZU5hbWVcclxuICAgICAgXHJcbiAgICAjIGhlcmUgY2FuIGNhdXNlIGRhdGEgbG9hZGluZywgZXRjLlxyXG4gICAgXHJcbiAgICBpZiBldmVudCAgICBcclxuICAgICAgIyBkbyBub3QgZ2l2ZSBhIGRlZmF1bHQgYWN0aW9uXHJcbiAgICAgIGlmIGV2ZW50LnByZXZlbnREZWZhdWx0XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZVxyXG4gIGZhbHNlXHJcbiAgXHJcbnJlc3RvcmVTdGF0ZSA9IChsb2NhdGlvbikgLT5cclxuICBwYWdlTmFtZSA9IGxvY2F0aW9uLmhhc2hcclxuICBpZiBub3QgcGFnZU5hbWVcclxuICAgIHBhZ2VOYW1lID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzFdXHJcbiAgaWYgcGFnZU5hbWVcclxuICAgIHBhZ2VOYW1lID0gcGFnZU5hbWUucmVwbGFjZSAnIycsICcnXHJcbiAgICBPSi5wdWJsaXNoICdyZXN0b3JlU3RhdGUnLCBwYWdlTmFtZTogcGFnZU5hbWUsIGxvY2F0aW9uOiBsb2NhdGlvblxyXG4gIHJldHVyblxyXG4gIFxyXG4jIyMgXHJcbmhhbmcgb24gdGhlIGV2ZW50LCBhbGwgcmVmZXJlbmNlcyBpbiB0aGlzIGRvY3VtZW50XHJcbiMjI1xyXG4gIFxyXG4jIyNcclxuIyBUaGlzIGJpbmRzIHRvIHRoZSBkb2N1bWVudCBjbGljayBldmVudCwgd2hpY2ggaW4gdHVybiBhdHRhY2hlcyB0byBldmVyeSBjbGljayBldmVudCwgY2F1c2luZyB1bmV4cGVjdGVkIGJlaGF2aW9yLlxyXG4jIEZvciBhbnkgY29udHJvbCB3aGljaCB3aXNoZXMgdG8gdHJpZ2dlciBhIHN0YXRlIGNoYW5nZSBpbiByZXNwb25zZSB0byBhbiBldmVudCwgaXQgaXMgYmV0dGVyIGZvciB0aGF0IGNvbnRyb2wgdG8gZGVmaW5lIHRoZSBiZWhhdmlvci5cclxuT0ouZG9jdW1lbnRbZXZlbnROYW1lXSBldmVudEluZm8gKyAnY2xpY2snLCAoKGV2ZW50KSAtPlxyXG4gIGV2ZW50ID0gZXZlbnQgb3Igd2luZG93LmV2ZW50XHJcbiAgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IG9yIGV2ZW50LnNyY0VsZW1lbnRcclxuICAgIFxyXG4gICMgbG9va2luZyBmb3IgYWxsIHRoZSBsaW5rcyB3aXRoICdhamF4JyBjbGFzcyBmb3VuZFxyXG4gIGlmIHRhcmdldCBhbmQgdGFyZ2V0Lm5vZGVOYW1lIGlzICdBJyBhbmQgKCcgJyArIHRhcmdldC5jbGFzc05hbWUgKyAnICcpLmluZGV4T2YoJ2FqYXgnKSA+PSAwXHJcbiAgICBPSi5wdXNoU3RhdGUgdGFyZ2V0LmhyZWYsIGV2ZW50XHJcbiAgICAgIFxyXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KClcclxuICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4pLCBmYWxzZVxyXG4jIyNcclxuXHJcbiMjI1xyXG5oYW5nIG9uIHBvcHN0YXRlIGV2ZW50IHRyaWdnZXJlZCBieSBwcmVzc2luZyBiYWNrL2ZvcndhcmQgaW4gYnJvd3NlclxyXG4jIyNcclxuT0ouZ2xvYmFsW2V2ZW50TmFtZV0gZXZlbnRJbmZvICsgJ3BvcHN0YXRlJywgKChldmVudCkgLT5cclxuICAgIFxyXG4gICMgd2UgZ2V0IGEgbm9ybWFsIExvY2F0aW9uIG9iamVjdFxyXG4gICAgXHJcbiAgIyMjXHJcbiAgTm90ZSwgdGhpcyBpcyB0aGUgb25seSBkaWZmZXJlbmNlIHdoZW4gdXNpbmcgdGhpcyBsaWJyYXJ5LFxyXG4gIGJlY2F1c2UgdGhlIG9iamVjdCBkb2N1bWVudC5sb2NhdGlvbiBjYW5ub3QgYmUgb3ZlcnJpZGVuLFxyXG4gIHNvIGxpYnJhcnkgdGhlIHJldHVybnMgZ2VuZXJhdGVkICdsb2NhdGlvbicgb2JqZWN0IHdpdGhpblxyXG4gIGFuIG9iamVjdCB3aW5kb3cuaGlzdG9yeSwgc28gZ2V0IGl0IG91dCBvZiAnaGlzdG9yeS5sb2NhdGlvbicuXHJcbiAgRm9yIGJyb3dzZXJzIHN1cHBvcnRpbmcgJ2hpc3RvcnkucHVzaFN0YXRlJyBnZXQgZ2VuZXJhdGVkXHJcbiAgb2JqZWN0ICdsb2NhdGlvbicgd2l0aCB0aGUgdXN1YWwgJ2RvY3VtZW50LmxvY2F0aW9uJy5cclxuICAjIyMgICAgICAgICAgICAgICAgICAgICBcclxuICByZXR1cm5Mb2NhdGlvbiA9IGhpc3RvcnkubG9jYXRpb24gb3IgZG9jdW1lbnQubG9jYXRpb25cclxuICAgIFxyXG4gICMjI1xyXG4gIGhlcmUgY2FuIGNhdXNlIGRhdGEgbG9hZGluZywgZXRjLlxyXG4gICMjI1xyXG4gIE9KLmhpc3RvcnkucmVzdG9yZVN0YXRlIHJldHVybkxvY2F0aW9uXHJcbiAgICBcclxuICByZXR1cm5cclxuKSwgZmFsc2UgXHJcbiAgXHJcbiBcclxuT0ouaGlzdG9yeS5yZWdpc3RlciAncmVzdG9yZVN0YXRlJywgcmVzdG9yZVN0YXRlXHJcbk9KLmhpc3RvcnkucmVnaXN0ZXIgJ3B1c2hTdGF0ZScsIHB1c2hTdGF0ZVxyXG4gXHJcbm1vZHVsZS5leHBvcnRzID0gXHJcbiAgcmVzdG9yZVN0YXRlOiByZXN0b3JlU3RhdGVcclxuICBwdXNoU3RhdGU6IHB1c2hTdGF0ZVxyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5cbmNsYXNzIElTXG5cbiAgQGJvb2w6IChib29sZWFuKSAtPlxuICAgIF8uaXNCb29sZWFuIGJvb2xlYW5cblxuICBAYXJyYXlOdWxsT3JFbXB0eTogKGFycikgLT5cbiAgICBfLmlzRW1wdHkgYXJyXG5cbiAgQHN0cmluZ051bGxPckVtcHR5OiAoc3RyKSAtPlxuICAgIHN0ciBhbmQgKG5vdCBzdHIubGVuZ3RoIG9yIHN0ci5sZW5ndGggaXMgMCBvciBub3Qgc3RyLnRyaW0gb3Igbm90IHN0ci50cmltKCkpXG5cbiAgQG51bWJlck51bGxPckVtcHR5OiAobnVtKSAtPlxuICAgIG5vdCBudW0gb3IgaXNOYU4obnVtKSBvciBub3QgbnVtLnRvUHJlY2lzaW9uXG5cbiAgQGRhdGVOdWxsT3JFbXB0eTogKGR0KSAtPlxuICAgIG5vdCBkdCBvciBub3QgZHQuZ2V0VGltZVxuXG4gIEBvYmplY3ROdWxsT3JFbXB0eTogKG9iaikgLT5cbiAgICBfLmlzRW1wdHkgb2JqIG9yIG5vdCBPYmplY3Qua2V5cyhvYmopIG9yIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoIGlzIDBcblxuICBAcGxhaW5PYmplY3Q6IChvYmopIC0+XG4gICAgXy5pc1BsYWluT2JqZWN0IG9ialxuXG4gIEBvYmplY3Q6IChvYmopIC0+XG4gICAgXy5pc09iamVjdCBvYmpcblxuICBAZGF0ZTogKGR0KSAtPlxuICAgIF8uaXNEYXRlIGR0XG5cblxuICAjIyNcbiAgRGV0ZXJtaW5lcyBpZiBhIHZhbHVlIGlzIGFuIGluc3RhbmNlIG9mIGEgTnVtYmVyIGFuZCBub3QgTmFOKlxuICAjIyNcbiAgQG51bWJlcjogKG51bSkgLT5cbiAgICBudW1iZXIgPSByZXF1aXJlICcuLi9jb3JlL251bWJlcidcbiAgICB0eXBlb2YgbnVtIGlzICdudW1iZXInIGFuZCBmYWxzZSBpcyAobnVtYmVyLmlzTmFOKG51bSkgb3IgZmFsc2UgaXMgbnVtYmVyLmlzRmluaXRlKG51bSkgb3IgbnVtYmVyLk1BWF9WQUxVRSBpcyBudW0gb3IgbnVtYmVyLk1JTl9WQUxVRSBpcyBudW0pXG5cbiAgIyMjXG4gIERldGVybWluZXMgaWYgYSB2YWx1ZSBpcyBjb252ZXJ0aWJsZSB0byBhIE51bWJlclxuICAjIyNcbiAgQG51bWVyaWM6IChudW0pIC0+XG4gICAgcmV0ID0gQG51bWJlcihudW0pXG4gICAgdW5sZXNzIHJldFxuICAgICAgdG8gPSByZXF1aXJlICcuL3RvJ1xuICAgICAgbnVOdW0gPSB0by5udW1iZXIobnVtKVxuICAgICAgcmV0ID0gQG51bWJlcihudU51bSlcbiAgICByZXRcblxuICBAZWxlbWVudEluRG9tOiAoZWxlbWVudElkKSAtPlxuICAgIGZhbHNlIGlzIEBudWxsT3JFbXB0eShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50SWQpKVxuXG4gIEBhcnJheTogKG9iaikgLT5cbiAgICBfLmlzQXJyYXkgb2JqXG5cbiAgQHN0cmluZzogKHN0cikgLT5cbiAgICBfLmlzU3RyaW5nIHN0clxuXG4gIEB0cnVlOiAob2JqKSAtPlxuICAgIG9iaiBpcyB0cnVlIG9yIG9iaiBpcyAndHJ1ZScgb3Igb2JqIGlzIDEgb3Igb2JqIGlzICcxJ1xuXG4gIEBmYWxzZTogKG9iaikgLT5cbiAgICBvYmogaXMgZmFsc2Ugb3Igb2JqIGlzICdmYWxzZScgb3Igb2JqIGlzIDAgb3Igb2JqIGlzICcwJ1xuXG4gIEB0cnVlT3JGYWxzZTogKG9iaikgLT5cbiAgICBAdHJ1ZSBvYmogb3IgQGZhbHNlIG9ialxuXG4gIEBudWxsT3JFbXB0eTogKG9iaiwgY2hlY2tMZW5ndGgpIC0+XG4gICAgXy5pc0VtcHR5KG9iaikgb3IgXy5pc1VuZGVmaW5lZChvYmopIG9yIF8uaXNOdWxsKG9iaikgb3IgXy5pc05hTihvYmopXG5cbiAgQG51bGxPclVuZGVmaW5lZDogKG9iaiwgY2hlY2tMZW5ndGgpIC0+XG4gICAgXy5pc1VuZGVmaW5lZChvYmopIG9yIF8uaXNOdWxsKG9iaikgb3IgXy5pc05hTihvYmopXG5cbiAgQGluc3RhbmNlb2Y6IChuYW1lLCBvYmopIC0+XG4gICAgb2JqLnR5cGUgaXMgbmFtZSBvciBvYmogaW5zdGFuY2VvZiBuYW1lXG5cbiAgQG1ldGhvZDogKG9iaikgLT5cbiAgICBvYmogaXNudCBPSi5ub29wIGFuZCBfLmlzRnVuY3Rpb24gb2JqXG5cbiAgIyMjXG4gIERlcHJlY2F0ZWQuIExlZnQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LiBVc2UgaXMubWV0aG9kIGluc3RlYWQuXG4gICMjI1xuICBAZnVuYyA9IEBtZXRob2RcblxuXG5cbk9KLnJlZ2lzdGVyICdpcycsIElTXG5tb2R1bGUuZXhwb3J0cyA9IElTXG5cbiIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbm5vdHkgPSByZXF1aXJlICdub3R5J1xyXG5cclxuICBcclxubWFrZU5vdHkgPSAob3B0aW9ucywgb3duZXIpIC0+XHJcbiAgZGVmYXVsdHMgPVxyXG4gICAgbGF5b3V0OiAndG9wUmlnaHQnXHJcbiAgICB0aGVtZTogJ2RlZmF1bHRUaGVtZSdcclxuICAgIHR5cGU6ICdhbGVydCdcclxuICAgIHRleHQ6ICcnICNjYW4gYmUgaHRtbCBvciBzdHJpbmdcclxuICAgIGRpc21pc3NRdWV1ZTogdHJ1ZSAjSWYgeW91IHdhbnQgdG8gdXNlIHF1ZXVlIGZlYXR1cmUgc2V0IHRoaXMgdHJ1ZVxyXG4gICAgdGVtcGxhdGU6ICc8ZGl2IGNsYXNzPVwibm90eV9tZXNzYWdlXCI+PHNwYW4gY2xhc3M9XCJub3R5X3RleHRcIj48L3NwYW4+PGRpdiBjbGFzcz1cIm5vdHlfY2xvc2VcIj48L2Rpdj48L2Rpdj4nLFxyXG4gICAgYW5pbWF0aW9uOiBcclxuICAgICAgICBvcGVuOiBcclxuICAgICAgICAgIGhlaWdodDogJ3RvZ2dsZSdcclxuICAgICAgICBjbG9zZTogXHJcbiAgICAgICAgICBoZWlnaHQ6ICd0b2dnbGUnXHJcbiAgICAgICAgZWFzaW5nOiAnc3dpbmcnXHJcbiAgICAgICAgc3BlZWQ6IDUwMCAjb3BlbmluZyAmIGNsb3NpbmcgYW5pbWF0aW9uIHNwZWVkXHJcbiAgICB0aW1lb3V0OiA1MDAwICNkZWxheSBmb3IgY2xvc2luZyBldmVudC4gU2V0IGZhbHNlIGZvciBzdGlja3kgbm90aWZpY2F0aW9uc1xyXG4gICAgZm9yY2U6IGZhbHNlICNhZGRzIG5vdGlmaWNhdGlvbiB0byB0aGUgYmVnaW5uaW5nIG9mIHF1ZXVlIHdoZW4gc2V0IHRvIHRydWVcclxuICAgIG1vZGFsOiBmYWxzZVxyXG4gICAgbWF4VmlzaWJsZTogNSAjeW91IGNhbiBzZXQgbWF4IHZpc2libGUgbm90aWZpY2F0aW9uIGZvciBkaXNtaXNzUXVldWUgdHJ1ZSBvcHRpb24sXHJcbiAgICBraWxsZXI6IGZhbHNlICNmb3IgY2xvc2UgYWxsIG5vdGlmaWNhdGlvbnMgYmVmb3JlIHNob3dcclxuICAgIGNsb3NlV2l0aDogWydjbGljayddICAjWydjbGljaycsICdidXR0b24nLCAnaG92ZXInXVxyXG4gICAgY2FsbGJhY2s6IFxyXG4gICAgICAgIG9uU2hvdzogT0oubm9vcCxcclxuICAgICAgICBhZnRlclNob3c6IE9KLm5vb3BcclxuICAgICAgICBvbkNsb3NlOiBPSi5ub29wXHJcbiAgICAgICAgYWZ0ZXJDbG9zZTogT0oubm9vcFxyXG4gICAgYnV0dG9uczogZmFsc2UgI2FuIGFycmF5IG9mIGJ1dHRvbnNcclxuICAgIFxyXG4gIE9KLmV4dGVuZCBkZWZhdWx0cywgb3B0aW9ucywgdHJ1ZVxyXG4gIHJldCA9IG5vdHkgZGVmYXVsdHNcclxuICAgICAgXHJcbiAgcmV0XHJcbiAgICBcclxuT0oubm90aWZpY2F0aW9ucy5yZWdpc3RlciAnbm90eScsIG1ha2VOb3R5XHJcbm1vZHVsZS5leHBvcnRzID0gbWFrZU5vdHkiLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuUHViU3ViID0gcmVxdWlyZSAncHVic3ViLWpzJ1xuXG50b2tlbnMgPSB7fVxuc3Vic2NyaWJlcnMgPSBbXVxuZXZlbnRzID0ge31cblxucHMgPSBcbiAgZ2V0RXZlbnROYW1lOiAoZXZlbnQpIC0+XG4gICAgZXZlbnQudG9VcHBlckNhc2UoKS5yZXBsYWNlICcgJywgJ18nXG5cbiAgc3Vic2NyaWJlOiAoZXZlbnQsIG1ldGhvZCkgLT5cbiAgICBldmVudE5hbWUgPSBwcy5nZXRFdmVudE5hbWUgZXZlbnRcbiAgICBpZiBub3QgZXZlbnRzW2V2ZW50TmFtZV0gdGhlbiBldmVudHNbZXZlbnROYW1lXSA9IFtdXG5cbiAgICB0b2tlbiA9IFB1YlN1Yi5zdWJzY3JpYmUgZXZlbnROYW1lLCBtZXRob2RcbiAgICB0b2tlbnNbdG9rZW5dID0gdG9rZW5cbiAgICBzdWJzY3JpYmVycy5wdXNoIG1ldGhvZFxuICAgIGV2ZW50c1tldmVudE5hbWVdLnB1c2ggbWV0aG9kXG4gICAgdG9rZW5cblxuICBwdWJsaXNoOiAoZXZlbnQsIGRhdGEpIC0+XG4gICAgZXZlbnROYW1lID0gcHMuZ2V0RXZlbnROYW1lIGV2ZW50XG4gICAgaWYgZXZlbnRzW2V2ZW50TmFtZV1cbiAgICAgIFB1YlN1Yi5wdWJsaXNoIGV2ZW50TmFtZSwgZGF0YVxuICAgIGVsc2VcbiAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbmFtZWQgeycgKyBldmVudCArICd9IGlzIG5vdCByZWNvZ25pemVkLidcbiAgICByZXR1cm5cblxuICB1bnN1YnNjcmliZTogKHRva2VuT3JNZXRob2QpIC0+XG4gICAgaWYgT0ouaXMubWV0aG9kIHRva2VuT3JNZXRob2RcbiAgICAgIGlmIC0xIGlzbnQgc3Vic2NyaWJlcnMuaW5kZXhPZiB0b2tlbk9yTWV0aG9kXG4gICAgICAgIFB1YlN1Yi51bnN1YnNjcmliZSB0b2tlbk9yTWV0aG9kXG4gICAgICAgIHN1YnNjcmliZXJzID0gXy5yZW1vdmUgc3Vic2NyaWJlcnMsIChtZXRob2QpIC0+IG1ldGhvZCBpcyB0b2tlbk9yTWV0aG9kXG4gICAgICBlbHNlXG4gICAgICAgIE9KLmNvbnNvbGUuaW5mbyAnRXZlbnQgbWV0aG9kIGlzIG5vdCByZWNvZ25pemVkLidcbiAgICBlbHNlXG4gICAgICBpZiB0b2tlbnNbdG9rZW5Pck1ldGhvZF1cbiAgICAgICAgUHViU3ViLnVuc3Vic2NyaWJlIHRva2VuT3JNZXRob2RcbiAgICAgICAgZGVsZXRlIHRva2Vuc1t0b2tlbk9yTWV0aG9kXVxuICAgIHJldHVyblxuXG4gIHVuc3Vic2NyaWJlQWxsOiAoKSAtPlxuICAgIE9KLmVhY2ggdG9rZW5zLCAodG9rZW4pIC0+IHVuc3Vic2NyaWJlIHRva2VuXG4gICAgc3Vic2NyaWJlcnMgPSBbXVxuICAgIGV2ZW50cyA9IHt9XG4gICAgcmV0dXJuXG5cbiAgdW5zdWJzY3JpYmVFdmVudDogKGV2ZW50KSAtPlxuICAgIGV2ZW50TmFtZSA9IHBzLmdldEV2ZW50TmFtZSBldmVudFxuICAgIGlmIGV2ZW50c1tldmVudE5hbWVdXG4gICAgICBPSi5lYWNoIGV2ZW50c1tldmVudE5hbWVdLCAobWV0aG9kKSAtPiB1bnN1YnNjcmliZSBtZXRob2RcbiAgICBlbHNlXG4gICAgICBPSi5jb25zb2xlLmluZm8gJ0V2ZW50IG5hbWVkIHsnICsgZXZlbnQgKyAnfSBpcyBub3QgcmVjb2duaXplZC4nXG4gICAgZGVsZXRlIGV2ZW50c1tldmVudE5hbWVdXG4gICAgcmV0dXJuXG5cbk9iamVjdC5zZWFsIHBzXG5PYmplY3QuZnJlZXplIHBzXG5cbk9KLnJlZ2lzdGVyICdnZXRFdmVudE5hbWUnLCBwcy5nZXRFdmVudE5hbWVcbk9KLnJlZ2lzdGVyICdwdWJsaXNoJywgcHMucHVibGlzaFxuT0oucmVnaXN0ZXIgJ3N1YnNjcmliZScsIHBzLnN1YnNjcmliZVxuT0oucmVnaXN0ZXIgJ3Vuc3Vic2NyaWJlJywgcHMudW5zdWJzY3JpYmVcbk9KLnJlZ2lzdGVyICd1bnN1YnNjcmliZUFsbCcsIHBzLnVuc3Vic2NyaWJlQWxsXG5PSi5yZWdpc3RlciAndW5zdWJzY3JpYmVFdmVudCcsIHBzLnVuc3Vic2NyaWJlRXZlbnRcblxubW9kdWxlLmV4cG9ydHMgPSBwcyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbiAgXHJcbiMjI1xyXG5odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkwMTExNS9ob3ctY2FuLWktZ2V0LXF1ZXJ5LXN0cmluZy12YWx1ZXMtaW4tamF2YXNjcmlwdFxyXG4jIyNcclxucXVlcnlTdHJpbmcgPSAocGFyYW0pIC0+XHJcbiAgcmV0ID0ge31cclxuICAgIFxyXG4gIGlmIE9KLmdsb2JhbC5sb2NhdGlvblxyXG4gICAgcGFyYW1zID0gIE9KLmdsb2JhbC5sb2NhdGlvbi5zZWFyY2guc3Vic3RyKDEpLnNwbGl0ICcmJ1xyXG4gICAgaWYgcGFyYW1zXHJcbiAgICAgIGkgPSAwXHJcbiAgICAgIHdoaWxlIGkgPCBwYXJhbXMubGVuZ3RoXHJcbiAgICAgICAgcHJtID0gcGFyYW1zW2ldLnNwbGl0ICc9J1xyXG4gICAgICAgIGlmIHBybS5sZW5ndGggaXMgMiBcclxuICAgICAgICAgIHJldFtwcm1bMF1dID0gT0ouZ2xvYmFsLmRlY29kZVVSSUNvbXBvbmVudCBwcm1bMV0ucmVwbGFjZSgvXFwrL2csIFwiIFwiKVxyXG4gICAgICAgIGkgKz0gMVxyXG4gIHJldFxyXG4gICAgXHJcbk9KLnJlZ2lzdGVyICdxdWVyeVN0cmluZycscXVlcnlTdHJpbmdcclxubW9kdWxlLmV4cG9ydHMgPSBxdWVyeVN0cmluZyIsIk9KID0gcmVxdWlyZSAnLi4vb2onXHJcbl8gPSByZXF1aXJlICdsb2Rhc2gnXHJcbm9iaiA9IHJlcXVpcmUgJy4uL2NvcmUvb2JqZWN0J1xyXG5lYWNoID0gcmVxdWlyZSAnLi9lYWNoJ1xyXG5cclxuIyAjIHJhbmdlc1xyXG5cclxucm5nID1cclxuXHJcbiAgIyAjIyByYW5nZVxyXG4gICMgVXNpbmcgW0xvLURhc2hdKGh0dHA6Ly9sb2Rhc2guY29tL2RvY3MjcmFuZ2UpJ3MgYHJhbmdlYCBtZXRob2RcclxuICByYW5nZTogKHBhcmFtcy4uLikgLT5cclxuICAgIF8ucmFuZ2UgcGFyYW1zLi4uXHJcblxyXG4gICMgIyMgcmFuZ2VNaW5cclxuICAjIFVzaW5nIFtMby1EYXNoXShodHRwOi8vbG9kYXNoLmNvbS9kb2NzI21pbikncyBgbWluYCBtZXRob2RcclxuICByYW5nZU1pbjogKHBhcmFtcy4uLikgLT5cclxuICAgIF8ubWluIHBhcmFtcy4uLlxyXG5cclxuICAjICMjIHJhbmdlTWF4XHJcbiAgIyBVc2luZyBbTG8tRGFzaF0oaHR0cDovL2xvZGFzaC5jb20vZG9jcyNtYXgpJ3MgYG1heGAgbWV0aG9kXHJcbiAgcmFuZ2VNYXg6IChwYXJhbXMuLi4pIC0+XHJcbiAgICBfLm1heCBwYXJhbXMuLi5cclxuXHJcbiAgIyAjIyBzdHJpbmdSYW5nZVRvU3ViUmFuZ2VzXHJcbiAgIyMjXHJcbiAgVGFrZSBhbiBhcnJheSBvZiBzdHJpbmcgdmFsdWVzIGFuZCBhIG51bWJlciBvZiBwYXJ0aXRpb25zIHRvIGNyZWF0ZS5cclxuICBVc2VzIHRoZSBmaXJzdCBsZXR0ZXIgb2YgZWFjaCBzdHJpbmcgdmFsdWUgaW4gdGhlIGFycmF5IHRvIGNvbnZlcnQgdG8gdW5pcXVlIGNvZGUgY2hhcmFjdGVyIChsb3dlciBjYXNlKVxyXG4gIEJ1aWxkcyBhIGludCByYW5nZSBiYXNlZCBvbiB1bmlxdWUgY29kZSBjaGFycy5cclxuICAjIyNcclxuICBzdHJpbmdUb1N1YlJhbmdlczogKG4gPSA2LCByYW5nZSA9IFtdKSAtPlxyXG4gICAgY2hhclJhbmdlID0gW11cclxuXHJcblxyXG4gICAgZWFjaCByYW5nZSwgKHZhbCkgLT5cclxuICAgICAgY2hhciA9IHZhbC50cmltKClbMF0udG9Mb3dlckNhc2UoKVxyXG4gICAgICBpZiBmYWxzZSBpcyBvYmouY29udGFpbnMgY2hhclJhbmdlLCBjaGFyXHJcbiAgICAgICAgY2hhclJhbmdlLnB1c2ggY2hhci5jaGFyQ29kZUF0KClcclxuXHJcbiAgICByZXQgPSBybmcudG9TdWJSYW5nZXMgbiwgY2hhclJhbmdlXHJcblxyXG4gICAgaSA9IDBcclxuICAgIHdoaWxlIGkgPCBuXHJcbiAgICAgIGkgKz0gMVxyXG4gICAgICBzdWJSYW5nZSA9IHJldFtpXVxyXG4gICAgICBzdWJSYW5nZS5tYXAgU3RyaW5nLmZyb21DaGFyQ29kZVxyXG5cclxuICAgIG9sZEdldFJhbmdlID0gcmV0LmdldFJhbmdlXHJcbiAgICByZXQuZ2V0UmFuZ2UgPSAodmFsKSAtPlxyXG4gICAgICBjaGFyID0gdmFsLnRyaW0oKVswXS50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoKVxyXG4gICAgICBpZHggPSBvbGRHZXRSYW5nZSBjaGFyXHJcbiAgICAgIGlkeFxyXG4gICAgcmV0XHJcblxyXG4gICMgIyMgcmFuZ2VUb1N1YlJhbmdlc1xyXG4gICMjI1xyXG4gIFRha2UgYW4gYXJyYXkgb2YgaW50IHZhbHVlcyBhbmQgYSBudW1iZXIgb2YgcGFydGl0aW9ucyB0byBjcmVhdGUuXHJcbiAgRGl2aWRlcyB0aGUgb3JpZ2luYWwgYXJyYXkgaW50byB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiBzdWIgYXJyYXlzLlxyXG4gIE92ZXJmbG93IGlzIHBhc3NlZCB0byB0aGUgZmluYWwgcGFydGl0aW9uLlxyXG4gICMjI1xyXG4gIHRvU3ViUmFuZ2VzOiAobiA9IDYsIHJhbmdlID0gW10pIC0+XHJcbiAgICByZXQgPSBvYmoub2JqZWN0KClcclxuICAgIHJhbmdlTG93ID0gcm5nLnJhbmdlTWluIHJhbmdlXHJcbiAgICByYW5nZUhpZ2ggPSBybmcucmFuZ2VNYXggcmFuZ2VcclxuXHJcbiAgICBkaXN0YW5jZSA9IHJhbmdlSGlnaCAtIHJhbmdlTG93XHJcbiAgICBzdWJSYW5nZVNpemUgPSBkaXN0YW5jZS9uXHJcbiAgICBzdWJSYW5nZXMgPSByZXQuYWRkICdyYW5nZXMnLCBvYmoub2JqZWN0KClcclxuICAgIGNodW5rVmFsID0gcmFuZ2VMb3dcclxuXHJcbiAgICBtYXAgPSBvYmoub2JqZWN0KClcclxuXHJcbiAgICBpID0gMFxyXG4gICAgd2hpbGUgaSA8IG5cclxuICAgICAgaSArPSAxXHJcbiAgICAgIGlmIGkgPCBuIHRoZW4ganVtcCA9IE1hdGgucm91bmQgc3ViUmFuZ2VTaXplXHJcbiAgICAgIGVsc2VcclxuICAgICAgICBqdW1wID0gTWF0aC5mbG9vciBzdWJSYW5nZVNpemVcclxuICAgICAgICBpZiBjaHVua1ZhbCArIGp1bXAgPD0gcmFuZ2VIaWdoXHJcbiAgICAgICAgICBqdW1wICs9IHJhbmdlSGlnaCAtIGNodW5rVmFsIC0ganVtcCArIDFcclxuXHJcbiAgICAgIHN1YlJhbmdlID0gcm5nLnJhbmdlIGNodW5rVmFsLCBjaHVua1ZhbCArIGp1bXBcclxuICAgICAgZWFjaCBzdWJSYW5nZSwgKHZhbCkgLT4gbWFwLmFkZCB2YWwsIGlcclxuICAgICAgc3ViUmFuZ2VzW2ldID0gc3ViUmFuZ2VcclxuICAgICAgY2h1bmtWYWwgKz0ganVtcFxyXG5cclxuICAgIHJldC5hZGQgJ2dldFJhbmdlJywgKHZhbCkgLT5cclxuICAgICAgbWFwW3ZhbF1cclxuXHJcbiAgICByZXRcclxuXHJcbk9iamVjdC5zZWFsIHJuZ1xyXG5PYmplY3QuZnJlZXplIHJuZ1xyXG5cclxuT0oucmVnaXN0ZXIgJ3JhbmdlcycsIHJuZ1xyXG5tb2R1bGUuZXhwb3J0cyA9IHJuZ1xyXG4iLCJPSiA9IHJlcXVpcmUgJy4uL29qJ1xuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcbl8gPSByZXF1aXJlICdsb2Rhc2gnXG5JUyA9IHJlcXVpcmUgJy4vaXMnXG5cbiMgIyB0b1xuY2xhc3MgVE8gXG4gICMgIyMgYm9vbFxuICAjIGNvbnZlcnQgYW55IGNvbXBhdGlibGUgb2JqZWN0IHRvIGEgYm9vbGVhbi4gSW5jb21wYXRpYmxlIG9iamVjdHMgYXJlIGZhbHNlLlxuICBAYm9vbDogKHN0cikgLT5cbiAgICByZXRCb29sID0gSVNbJ3RydWUnXShzdHIpXG4gICAgcmV0Qm9vbCA9IGZhbHNlICBpZiByZXRCb29sIGlzIGZhbHNlIG9yIHJldEJvb2wgaXNudCB0cnVlXG4gICAgcmV0Qm9vbFxuXG4gICMgIyMgRVM1X1RvQm9vbFxuICAjIChkZWJ1ZykgbWV0aG9kIHRvIGV4cGxpY2l0bHkgZm9yY2UgYW4gYGlmKG9iailgIGV2YWx1YXRpb24gdG8gZmxvdyB0aHJvdWdoIHRoZSBFUzUgc3BlYyBmb3IgdHJ1dGhpbmVzc1xuICBARVM1X1RvQm9vbDogKHZhbCkgLT5cbiAgICB2YWwgaXNudCBmYWxzZSBhbmQgdmFsIGlzbnQgMCBhbmQgdmFsIGlzbnQgJycgYW5kIHZhbCBpc250IG51bGwgYW5kIHR5cGVvZiB2YWwgaXNudCAndW5kZWZpbmVkJyBhbmQgKHR5cGVvZiB2YWwgaXNudCAnbnVtYmVyJyBvciBub3QgaXNOYU4odmFsKSlcblxuICAjICMjIGRhdGVGcm9tVGlja3NcbiAgIyB0YWtlIGEgbnVtYmVyIHJlcHJlc2VudGluZyB0aWNrcyBhbmQgY29udmVydCBpdCBpbnRvIGFuIGluc3RhbmNlIG9mIERhdGVcbiAgQGRhdGVGcm9tVGlja3M6ICh0aWNrU3RyKSAtPlxuICAgIHRpY3NEYXRlVGltZSA9IEBzdHJpbmcodGlja1N0cilcbiAgICByZXQgPSB1bmRlZmluZWRcbiAgICB0aWNrcyA9IHVuZGVmaW5lZFxuICAgIG9mZnNldCA9IHVuZGVmaW5lZFxuICAgIGxvY2FsT2Zmc2V0ID0gdW5kZWZpbmVkXG4gICAgYXJyID0gdW5kZWZpbmVkXG4gICAgaWYgZmFsc2UgaXMgSVMubnVsbE9yRW1wdHkodGljc0RhdGVUaW1lKVxuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJy8nLCAnJylcbiAgICAgIHRpY3NEYXRlVGltZSA9IHRpY3NEYXRlVGltZS5yZXBsYWNlKCdEYXRlJywgJycpXG4gICAgICB0aWNzRGF0ZVRpbWUgPSB0aWNzRGF0ZVRpbWUucmVwbGFjZSgnKCcsICcnKVxuICAgICAgdGljc0RhdGVUaW1lID0gdGljc0RhdGVUaW1lLnJlcGxhY2UoJyknLCAnJylcbiAgICAgIGFyciA9IHRpY3NEYXRlVGltZS5zcGxpdCgnLScpXG4gICAgICBpZiBhcnIubGVuZ3RoID4gMVxuICAgICAgICB0aWNrcyA9IEBudW1iZXIoYXJyWzBdKVxuICAgICAgICBvZmZzZXQgPSBAbnVtYmVyKGFyclsxXSlcbiAgICAgICAgbG9jYWxPZmZzZXQgPSBuZXcgRGF0ZSgpLmdldFRpbWV6b25lT2Zmc2V0KClcbiAgICAgICAgcmV0ID0gbmV3IERhdGUoKHRpY2tzIC0gKChsb2NhbE9mZnNldCArIChvZmZzZXQgLyAxMDAgKiA2MCkpICogMTAwMCkpKVxuICAgICAgZWxzZSBpZiBhcnIubGVuZ3RoIGlzIDFcbiAgICAgICAgdGlja3MgPSBAbnVtYmVyKGFyclswXSlcbiAgICAgICAgcmV0ID0gbmV3IERhdGUodGlja3MpXG4gICAgcmV0XG5cbiAgIyAjIyBiaW5hcnlcbiAgIyBjb252ZXJ0IGFuIG9iamVjdCB0byBiaW5hcnkgMCBvciAxXG4gIEBiaW5hcnk6IChvYmopIC0+XG4gICAgcmV0ID0gTmFOXG4gICAgaWYgb2JqIGlzIDAgb3Igb2JqIGlzICcwJyBvciBvYmogaXMgJycgb3Igb2JqIGlzIGZhbHNlIG9yIEBzdHJpbmcob2JqKS50b0xvd2VyQ2FzZSgpLnRyaW0oKSBpcyAnZmFsc2UnXG4gICAgICByZXQgPSAwXG4gICAgZWxzZSByZXQgPSAxICBpZiBvYmogaXMgMSBvciBvYmogaXMgJzEnIG9yIG9iaiBpcyB0cnVlIG9yIEBzdHJpbmcob2JqKS50b0xvd2VyQ2FzZSgpLnRyaW0oKSBpcyAndHJ1ZSdcbiAgICByZXRcblxuXG4gICMgIyMgbnVtYmVyXG4gICNcbiAgIyBBdHRlbXB0cyB0byBjb252ZXJ0IGFuIGFyYml0cmFyeSB2YWx1ZSB0byBhIE51bWJlci5cbiAgIyBMb29zZSBmYWxzeSB2YWx1ZXMgYXJlIGNvbnZlcnRlZCB0byAwLlxuICAjIExvb3NlIHRydXRoeSB2YWx1ZXMgYXJlIGNvbnZlcnRlZCB0byAxLlxuICAjIEFsbCBvdGhlciB2YWx1ZXMgYXJlIHBhcnNlZCBhcyBJbnRlZ2Vycy5cbiAgIyBGYWlsdXJlcyByZXR1cm4gYXMgTmFOLlxuICAjXG4gIEBudW1iZXI6IChpbnB1dE51bSwgZGVmYXVsdE51bSkgLT5cbiAgICB0cnlHZXROdW1iZXIgPSAodmFsKSA9PlxuICAgICAgcmV0ID0gTmFOXG4gICAgICAjIGlmIGB2YWxgIGFscmVhZHkgKGlzKVtpcy5odG1sXSBhIE51bWJlciwgcmV0dXJuIGl0XG4gICAgICBpZiBJUy5udW1iZXIodmFsKVxuICAgICAgICByZXQgPSB2YWxcbiAgICAgICMgZWxzZSBpZiBgdmFsYCBhbHJlYWR5IChpcylbaXMuaHRtbF0gYSBTdHJpbmcgb3IgYSBCb29sZWFuLCBjb252ZXJ0IGl0XG4gICAgICBlbHNlIGlmIElTLnN0cmluZyh2YWwpIG9yIElTLmJvb2wodmFsKVxuICAgICAgICB0cnlHZXQgPSAodmFsdWUpID0+XG4gICAgICAgICAgbnVtID0gQGJpbmFyeSh2YWx1ZSlcbiAgICAgICAgICBudW0gPSArdmFsdWUgIGlmIG5vdCBJUy5udW1iZXIobnVtKSBhbmQgdmFsdWVcbiAgICAgICAgICBudW0gPSBfLnBhcnNlSW50KHZhbHVlLCAwKSBpZiBub3QgSVMubnVtYmVyKG51bSlcbiAgICAgICAgICBudW1cbiAgICAgICAgcmV0ID0gdHJ5R2V0IHZhbFxuICAgICAgcmV0XG5cbiAgICByZXRWYWwgPSB0cnlHZXROdW1iZXIoaW5wdXROdW0pXG4gICAgaWYgbm90IElTLm51bWJlcihyZXRWYWwpXG4gICAgICByZXRWYWwgPSB0cnlHZXROdW1iZXIoZGVmYXVsdE51bSlcbiAgICAgIHJldFZhbCA9IE51bWJlci5OYU4gaWYgbm90IElTLm51bWJlcihyZXRWYWwpXG4gICAgcmV0VmFsXG5cbiAgIyAjIyBzdHJpbmdcbiAgIyBjb252ZXJ0IGFuIG9iamVjdCB0byBzdHJpbmdcbiAgQHN0cmluZzogKGlucHV0U3RyLCBkZWZhdWx0U3RyKSAtPlxuICAgIHRyeUdldFN0cmluZyA9IChzdHIpID0+XG4gICAgICByZXQgPSB1bmRlZmluZWRcbiAgICAgIGlmIElTLnN0cmluZyhzdHIpXG4gICAgICAgIHJldCA9IHN0clxuICAgICAgZWxzZVxuICAgICAgICByZXQgPSAnJ1xuICAgICAgICByZXQgPSBzdHIudG9TdHJpbmcoKSAgaWYgSVMuYm9vbChzdHIpIG9yIElTLm51bWJlcihzdHIpIG9yIElTLmRhdGUoc3RyKVxuICAgICAgcmV0XG4gICAgcmV0MSA9IHRyeUdldFN0cmluZyhpbnB1dFN0cilcbiAgICByZXQyID0gdHJ5R2V0U3RyaW5nKGRlZmF1bHRTdHIpXG4gICAgcmV0VmFsID0gJydcbiAgICBpZiByZXQxLmxlbmd0aCBpc250IDBcbiAgICAgIHJldFZhbCA9IHJldDFcbiAgICBlbHNlIGlmIHJldDEgaXMgcmV0MiBvciByZXQyLmxlbmd0aCBpcyAwXG4gICAgICByZXRWYWwgPSByZXQxXG4gICAgZWxzZVxuICAgICAgcmV0VmFsID0gcmV0MlxuICAgIHJldFZhbFxuXG5PSi5yZWdpc3RlciAndG8nLCBUT1xubW9kdWxlLmV4cG9ydHMgPSBUTyIsIiMgIyBjcmVhdGVVVUlEXHJcblxyXG5PSiA9IHJlcXVpcmUgJy4uL29qJ1xyXG4gIFxyXG4jIyNcclxuR2VuZXJhdGVzIGEgcmFuZG9tIHN0cmluZyB0aGF0IGNvbXBsaWVzIHRvIHRoZSBSRkMgNDEyMiBzcGVjaWZpY2F0aW9uIGZvciBHVUlEL1VVSUQuXHJcbihlLmcuICdCNDJBMTUzRi0xRDlBLTRGOTItOTkwMy05MkMxMURENjg0RDInKVxyXG5XaGlsZSBub3QgYSB0cnVlIFVVSUQsIGZvciB0aGUgcHVycG9zZXMgb2YgdGhpcyBhcHBsaWNhdGlvbiwgaXQgc2hvdWxkIGJlIHN1ZmZpY2llbnQuXHJcbiMjI1xyXG5jcmVhdGVGYXV4VVVJRCA9IC0+XHJcbiAgICBcclxuICAjIGh0dHA6Ly93d3cuaWV0Zi5vcmcvcmZjL3JmYzQxMjIudHh0XHJcbiAgIyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEwNTAzNC9ob3ctdG8tY3JlYXRlLWEtZ3VpZC11dWlkLWluLWphdmFzY3JpcHRcclxuICBzID0gW11cclxuICBzLmxlbmd0aCA9IDM2XHJcbiAgaGV4RGlnaXRzID0gJzAxMjM0NTY3ODlhYmNkZWYnXHJcbiAgaSA9IDBcclxuXHJcbiAgd2hpbGUgaSA8IDM2XHJcbiAgICBzW2ldID0gaGV4RGlnaXRzLnN1YnN0cihNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAweDEwKSwgMSlcclxuICAgIGkgKz0gMVxyXG4gIHNbMTRdID0gJzQnICMgYml0cyAxMi0xNSBvZiB0aGUgdGltZV9oaV9hbmRfdmVyc2lvbiBmaWVsZCB0byAwMDEwXHJcbiAgc1sxOV0gPSBoZXhEaWdpdHMuc3Vic3RyKChzWzE5XSAmIDB4MykgfCAweDgsIDEpICMgYml0cyA2LTcgb2YgdGhlIGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWQgdG8gMDFcclxuICBzWzhdID0gc1sxM10gPSBzWzE4XSA9IHNbMjNdID0gJy0nXHJcbiAgdXVpZCA9IHMuam9pbignJylcclxuICB1dWlkXHJcblxyXG5PSi5yZWdpc3RlciAnY3JlYXRlVVVJRCcsIGNyZWF0ZUZhdXhVVUlEXHJcbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRmF1eFVVSUQiXX0=
