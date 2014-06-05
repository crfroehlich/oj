/**
 * ojs - OJ is a framework for writing web components and templates in frothy CoffeeScript or pure JavaScript. OJ provides a mechanism to rapidly build web applications using well encapsulated, modular code that doesn't rely on string templating or partially baked web standards.
 * @version v0.4.4
 * @link http://somecallmechief.github.io/oj/
 * @license 
 */
(function() {
  var NsTree, makeTheJuice, nameSpaceName, thisDocument, thisGlobal, utilLib;

  thisGlobal = typeof global !== 'undefined' && global ? global : (typeof self !== 'undefined' && self ? self : (typeof window !== 'undefined' && window ? window : this));

  utilLib = thisGlobal.jQuery;

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
          nsInternal.dependents = deps;
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

}).call(this);

(function() {
  (function(OJ) {
    var subNameSpaces;
    subNameSpaces = ['errors', 'enums', 'is', 'instanceOf', 'to', 'nodes', 'db', 'components', 'controls', 'inputs', 'notifications', 'history', 'cookie', 'async'];
    _.each(subNameSpaces, function(name) {
      return OJ.makeSubNameSpace(name);
    });
    OJ['GENERATE_UNIQUE_IDS'] = false;
    OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] = 'div';
    OJ['TRACK_ON_ERROR'] = false;
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var ajax, config, optsFromUrl;
    config = {};
    config.onSuccess = function(opts, data, url) {
      var response;
      response = {};
      OJ.extend(response, data, true);
      opts.onSuccess(response);
      OJ.console.table([
        {
          Webservice: opts.ajaxOpts.url,
          StartTime: opts.startTime,
          EndTime: new Date()
        }
      ]);
    };
    config.onError = function(xmlHttpRequest, textStatus, param1, opts) {
      if (opts == null) {
        opts = OJ.object();
      }
      if (textStatus !== 'abort') {
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
      var defaults, getPromiseFromAjax, promise;
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
      getPromiseFromAjax = function(watchGlobal) {
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
      promise = void 0;
      if (true === defaults.useCache) {

      } else {
        promise = getPromiseFromAjax(defaults.watchGlobal);
      }
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
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    OJ.async.register('ajaxPromise', function(ajax) {
      var promise;
      promise = Q.when(ajax);
      promise.abort = ajax.abort;
      promise.readyState = ajax.readyState;
      return promise;
    });
    OJ.async.register('all', function(initArray) {
      var promise, reqs;
      reqs = initArray || [];
      promise = Q.all(reqs);
      promise.push = function(item) {
        reqs.push(item);
      };
      return promise;
    });
    OJ.async.register('defer', function() {
      var ret;
      ret = Q.defer();
      return ret;
    });
    OJ.async.register('promise', function(deferred) {
      var ret;
      ret = Q.defer().promise;
      if (deferred && deferred.promise) {
        ret = deferred.promise;
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-address';
    className = 'address';
    OJ.components.members[className] = nodeName;
    OJ.components.register(className, function(options, owner) {
      var city, cityState, country, defaults, ret, state, street, wrapper, zip, zipCountry;
      defaults = {
        props: {
          "class": 'fb-field-wrapper response-field-address'
        }
      };
      OJ.extend(defaults, options, true);
      ret = OJ.component(defaults, owner, nodeName);
      wrapper = ret.make('div', {
        props: {
          "class": 'subtemplate-wrapper'
        }
      });
      wrapper.make('div', {
        props: {
          "class": 'cover'
        }
      });
      street = wrapper.make('div', {
        props: {
          "class": 'input-line'
        }
      }).make('span', {
        props: {
          "class": 'street'
        }
      });
      street.make('input', {
        props: {
          type: 'text'
        }
      });
      street.make('label', {
        text: 'Address'
      });
      cityState = wrapper.make('div', {
        props: {
          "class": 'input-line'
        }
      });
      city = cityState.make('span', {
        props: {
          "class": 'city'
        }
      });
      city.make('input', {
        props: {
          type: 'text'
        }
      });
      city.make('label', {
        text: 'City'
      });
      state = cityState.make('span', {
        props: {
          "class": 'state'
        }
      });
      state.make('input', {
        props: {
          type: 'text'
        }
      });
      state.make('label', {
        text: 'State'
      });
      zipCountry = wrapper.make('div', {
        props: {
          "class": 'input-line'
        }
      });
      zip = zipCountry.make('span', {
        props: {
          "class": 'zip'
        }
      });
      zip.make('input', {
        props: {
          type: 'text'
        }
      });
      zip.make('label', {
        text: 'Zipcode'
      });
      country = zipCountry.make('span', {
        props: {
          "class": 'country'
        }
      });
      country.make('select').addOption('United States');
      country.make('label', {
        text: 'Country'
      });
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-datatable';
    className = 'datatable';
    OJ.components.members[className] = nodeName;
    OJ.components.register(className, function(options, owner) {
      var defaults, ret;
      defaults = {
        opts: {
          data: [],
          columns: []
        },
        table: {
          "class": ''
        },
        props: {
          "class": ''
        }
      };
      OJ.extend(defaults, options, true);
      ret = OJ.component(defaults, owner, nodeName);
      ret.rawTable = ret.make('table', defaults.table);
      ret.dataTable = ret.rawTable.$.DataTable(defaults.opts);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-easypie';
    className = 'easypie';
    OJ.components.members[className] = nodeName;
    OJ.components.register(className, function(options, owner) {
      var defaults, ret;
      defaults = {
        config: {
          barColor: '#efefef',
          percent: '50',
          size: '95',
          lineWidth: '',
          trackColor: '#efefef',
          scaleColor: 'false'
        },
        data: [],
        props: {
          "class": 'chart easy-pie inline-block primary'
        }
      };
      OJ.extend(defaults, options, true);
      defaults.props['data-percent'] = defaults.config.percent;
      ret = OJ.component(defaults, owner, nodeName);
      ret.$.easyPieChart(defaults.config);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-flotchart';
    className = 'flotchart';
    OJ.components.members[className] = nodeName;
    OJ.components.register(className, function(options, owner) {
      var defaults, ret;
      defaults = {
        config: {},
        data: [],
        props: {
          "class": 'flotchart'
        }
      };
      OJ.extend(defaults, options, true);
      ret = OJ.component(defaults, owner, nodeName);
      ret.flot = $.plot(ret.$, defaults.data, defaults.config);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-grid';
    className = 'grid';
    OJ.components.members[className] = nodeName;
    OJ.components.register(className, function(options, owner) {
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
      ret = OJ.component(defaults, owner, nodeName);
      rows = [];
      tiles = OJ.array2D();
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
                tile = row.tile(colNo, opts);
              } else if (!tile) {
                row.tile(i);
              }
            }
          }
        }
        fillMissing();
        return tile;
      });
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-infograph';
    className = 'infograph';
    OJ.components.members[className] = nodeName;
    OJ.components.register(className, function(options, owner) {
      var active, colNum, count, defaults, disabled, icon, inactive, ret, rowNum, total, unknown, _i, _j, _ref, _ref1;
      defaults = {
        icon: 'male',
        height: 10,
        width: 10,
        active: 90,
        inactive: 10,
        disabled: 0,
        unknown: 0,
        props: {
          "class": 'infograph'
        },
        styles: {
          color: '#4193d0'
        }
      };
      OJ.extend(defaults, options, true);
      ret = OJ.component(defaults, owner, nodeName);
      count = defaults.width * defaults.height;
      total = defaults.active + defaults.inactive + defaults.disabled + defaults.unknown;
      if (total > count) {
        throw new Error('Total members exceeds dimensions of infographic');
      }
      unknown = defaults.unknown;
      disabled = defaults.disabled;
      inactive = defaults.inactive;
      active = defaults.active;
      for (rowNum = _i = _ref = defaults.height; _ref <= 1 ? _i <= 1 : _i >= 1; rowNum = _ref <= 1 ? ++_i : --_i) {
        for (colNum = _j = _ref1 = defaults.width; _ref1 <= 1 ? _j <= 1 : _j >= 1; colNum = _ref1 <= 1 ? ++_j : --_j) {
          icon = 'fa fa-fw fa-' + defaults.icon + ' text-' + defaults.icon;
          if (inactive > 0) {
            inactive -= 1;
            icon += '-light';
          } else if (disabled > 0) {
            disabled -= 1;
            icon += ' text-error';
          } else if (unknown > 0) {
            unknown -= 1;
            icon += ' text-warning';
          } else if (active > 0) {
            active -= 1;
          }
          ret.make('i', {
            props: {
              "class": icon
            }
          });
        }
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-input-group';
    className = 'inputgroup';
    OJ.components.members[className] = nodeName;
    OJ.components.register(className, function(options, owner) {
      var cmpnt, defaults, forId, ret;
      forId = OJ.createUUID();
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
      ret = OJ.component(defaults, owner, nodeName);
      cmpnt = ret.make('div', {
        props: {
          "class": 'form-group'
        }
      });
      ret.groupLabel = cmpnt.make('label', {
        props: {
          "for": forId
        },
        text: defaults.labelText
      });
      defaults.inputOpts.props["class"] += ' form-control';
      ret.groupInput = cmpnt.make('input', defaults.inputOpts);
      ret.groupValue = function() {
        return ret.groupInput.val();
      };
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-price';
    className = 'price';
    OJ.components.members[className] = nodeName;
    OJ.components.register(className, function(options, owner) {
      var cents, defaults, dollars, price, ret;
      defaults = {};
      OJ.extend(defaults, options, true);
      ret = OJ.component(defaults, owner, nodeName);
      price = ret.make('div', {
        props: {
          "class": 'input-line'
        }
      });
      price.make('span', {
        text: {
          '$': {
            props: {
              "class": 'above-line'
            }
          }
        }
      });
      dollars = price.make('span', {
        props: {
          "class": 'dollars'
        }
      });
      dollars.make('input', {
        props: {
          type: 'text'
        }
      });
      dollars.make('label', {
        text: 'Dollars'
      });
      price.make('span', {
        text: '.',
        props: {
          "class": 'above-line'
        }
      });
      cents = price.make('span', {
        props: {
          "class": 'cents'
        }
      });
      cents.make('input', {
        props: {
          type: 'text'
        }
      });
      cents.make('label', {
        text: 'Cents'
      });
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-sparkline';
    className = 'sparkline';
    OJ.components.members[className] = nodeName;
    OJ.components.register(className, function(options, owner) {
      var defaults, ret;
      defaults = {
        config: {
          type: 'line',
          height: '70',
          width: '',
          enableTagOptions: true
        },
        data: [],
        props: {
          "class": 'sparkline'
        }
      };
      OJ.extend(defaults, options, true);
      ret = OJ.component(defaults, owner, nodeName);
      ret.$.sparkline(defaults.data, defaults.config);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-tabs';
    className = 'tabs';
    OJ.components.members[className] = nodeName;
    OJ.components.register(className, function(options, owner) {
      var content, defaults, first, ret, tabs;
      defaults = {
        tabs: {},
        props: {
          "class": ''
        }
      };
      OJ.extend(defaults, options, true);
      ret = OJ.component(defaults, owner, nodeName);
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
        ret.add(tabName, content.make('div', {
          props: {
            "class": tabContentClass,
            id: tabName
          }
        }));
      });
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var className, nodeName;
    nodeName = 'x-tile';
    className = 'tile';
    OJ.components.members[className] = nodeName;
    OJ.components.register(className, function(options, owner) {
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
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function() {
    var controlName, friendlyName;
    controlName = 'y-icon';
    friendlyName = 'icon';
    OJ.controls.members[friendlyName] = controlName;
    return OJ.controls.register(friendlyName, function(options, owner) {
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
      ret = OJ.control(defaults, owner, controlName);
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
    });
  })();

}).call(this);

(function() {
  (function() {
    'use strict';
    OJ.register("getDateFromDnJson", function(dnDate) {
      var arr, dnDateStr, localOffset, offset, ret, ticks;
      dnDateStr = OJ.to.string(dnDate);
      ret = void 0;
      ticks = void 0;
      offset = void 0;
      localOffset = void 0;
      arr = void 0;
      ret = OJ.dateTimeMinValue;
      if (false === OJ.is.nullOrEmpty(dnDateStr)) {
        dnDateStr = dnDateStr.replace("/", "");
        dnDateStr = dnDateStr.replace("Date", "");
        dnDateStr = dnDateStr.replace("(", "");
        dnDateStr = dnDateStr.replace(")", "");
        arr = dnDateStr.split("-");
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
      return ret;
    });
  })();

}).call(this);

(function() {
  (function(OJ) {
    var method, tryExec;
    OJ.register("tryExec", tryExec = function(tryFunc) {
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
        if ((exception.name === "TypeError" || exception.type === "called_non_callable") && exception.type === "non_object_property_load") {
          OJ.console.info("Ignoring exception: ", exception);
        } else {
          OJ.console.error(exception);
        }
      } finally {

      }
      return ret;
    });
    OJ.register("method", method = function(tryFunc) {
      'use strict';
      var that;
      that = this;
      return function() {
        var args;
        args = Array.prototype.slice.call(arguments, 0);
        args.unshift(tryFunc);
        return OJ.tryExec.apply(that, args);
      };
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var number;
    number = Object.create(null);
    Object.defineProperty(number, "isNaN", {
      value: (Number && Number.isNaN ? Number.isNaN : isNaN)
    });
    Object.defineProperty(number, "isFinite", {
      value: (Number && Number.isFinite ? Number.isFinite : isFinite)
    });
    Object.defineProperty(number, "MAX_VALUE", {
      value: (Number && Number.MAX_VALUE ? Number.MAX_VALUE : 1.7976931348623157e+308)
    });
    Object.defineProperty(number, "MIN_VALUE", {
      value: (Number && Number.MIN_VALUE ? Number.MIN_VALUE : 5e-324)
    });
    OJ.register("number", number);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {

    /*
    Create an instance of Object
     */
    var object;
    object = function() {
      var obj;
      obj = {};

      /*
      Add a property to the object and return it
       */
      obj.add = function(name, val) {
        OJ.property(obj, name, val);
        return obj;
      };
      obj.add('each', function(callback) {
        return OJ.each(obj, function(val, key) {
          if (key !== 'each' && key !== 'add') {
            return callback(val, key);
          }
        });
      });
      return obj;
    };
    OJ.register('object', object);
    OJ.register('isInstanceOf', function(name, obj) {
      return OJ.contains(name, obj) && OJ.to.bool(obj[name]);
    });
    OJ.register('contains', function(object, index) {
      var ret;
      ret = false;
      if (object) {
        ret = _.contains(object(index));
      }
      return ret;
    });
    OJ.register('compare', function(obj1, obj2) {
      return _.isEqual(obj1(obj2));
    });
    OJ.register('clone', function(data) {
      return _.cloneDeep(data(true));
    });
    OJ.register('serialize', function(data) {
      var ret;
      ret = '';
      OJ.tryExec(function() {
        ret = JSON.stringify(data);
      });
      return ret || '';
    });
    OJ.register('deserialize', function(data) {
      var ret;
      ret = {};
      if (data) {
        OJ.tryExec(function() {
          ret = window.$.parseJSON(data);
        });
        if (OJ.is.nullOrEmpty(ret)) {
          ret = {};
        }
      }
      return ret;
    });
    OJ.register('params', function(data, delimiter) {
      var ret;
      if (delimiter == null) {
        delimiter = '&';
      }
      ret = '';
      if (delimiter === '&') {
        OJ.tryExec(function() {
          ret = $.param(data);
        });
      } else {
        OJ.each(data, function(val, key) {
          if (ret.length > 0) {
            ret += delimiter;
          }
          ret += key + '=' + val;
        });
      }
      return OJ.to.string(ret);
    });
    OJ.register('extend', function(destObj, srcObj, deepCopy) {
      var ret;
      if (deepCopy == null) {
        deepCopy = false;
      }
      ret = destObj || {};
      if (arguments.length === 3) {
        ret = $.extend(OJ.to.bool(deepCopy), ret, srcObj);
      } else {
        ret = $.extend(ret, srcObj);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {

    /*
    Add a property to an object
     */
    var property;
    property = function(obj, name, value, writable, configurable, enumerable) {
      if (!obj) {
        throw new Error("Cannot define a property without an Object.");
      }
      if (!name) {
        throw new Error("Cannot create a property without a valid property name.");
      }
      obj[name] = value;
      return obj;
    };
    OJ.register("property", property);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    OJ.register("delimitedString", function(string, opts) {
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
        var delimitedString;
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
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {

    /*
    Create an HTML Web Component through ThinDom
     */
    var component;
    component = function(options, owner, tagName) {
      var ret, rootNodeType, widget;
      if (options == null) {
        options = OJ.object();
      }
      if (!tagName.startsWith('x-')) {
        tagName = 'x-' + tagName;
      }
      widget = OJ.element(tagName);
      OJ.nodes.factory(widget, owner);
      rootNodeType = options.rootNodeType || OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] || 'div';
      ret = widget.make(rootNodeType, options);
      ret.add('componentName', tagName);
      ret.add('remove', widget.remove);
      return ret;
    };
    OJ.register('component', component);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {

    /*
    Create a set of HTML Elements through ThinDom
     */
    var control;
    control = function(options, owner, tagName) {
      var ret, rootNodeType;
      if (options == null) {
        options = OJ.object();
      }
      if (!tagName.startsWith('y-')) {
        tagName = 'y-' + tagName;
      }
      rootNodeType = options.rootNodeType || OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] || 'div';
      ret = OJ.element(rootNodeType, options.props, options.styles, options.events, options.text);
      OJ.nodes.factory(ret, owner);
      ret.add('controlName', tagName);
      return ret;
    };
    OJ.register('control', control);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    OJ.register('dom', function(el, parent) {
      var enabled, isControlStillValid;
      if (parent == null) {
        parent = OJ.body;
      }
      'use strict';
      enabled = true;
      el.add('isValid', function() {
        return el && el.el instanceof HTMLElement;
      });
      isControlStillValid = function() {
        var valid;
        valid = false === OJ.is.nullOrEmpty(el) && el.isValid();
        if (false === valid) {
          OJ.error.throwException('el is null. Event bindings may not have been GCd.');
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
        if (isControlStillValid()) {
          el.$.on(eventName, event);
        }
        return el;
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
        if (isControlStillValid()) {
          Mousetrap.bind(keys, el[event]);
        }
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
        var len;
        len = 0;
        if (isControlStillValid()) {
          len = OJ.to.number(el.$.length);
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
        if (isControlStillValid()) {
          switch (OJ.to.bool(truthy)) {
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
        if (isControlStillValid()) {
          el.$.off(eventName, event);
        }
        return el;
      });
      el.add('val', function(value) {
        if (isControlStillValid()) {
          if (arguments.length === 1 && false === OJ.is.nullOrUndefined(value)) {
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
    });
    OJ.register('isElementInDom', function(elementId) {
      return false === OJ.is.nullOrEmpty(OJ.getElement(elementId));
    });
    OJ.register('getElement', function(id) {
      if (typeof document !== 'undefined') {
        return document.getElementById(id);
      } else {
        return void 0;
      }
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  var __slice = [].slice;

  (function(OJ) {

    /*
     Bind all event handlers
     */
    var bindEvents, body, finalize, initBody, thinBody;
    bindEvents = function(el, events) {
      if (el) {
        return _.forOwn(events, function(val, key) {
          var callback;
          if (OJ.is.method(val)) {
            callback = function() {
              var event;
              event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return val.apply(null, event);
            };
            el.$.on(key, callback);
            el.add(key, callback);
          }
        });
      }
    };

    /*
    Finalize the ThimDOM node
     */
    finalize = function(ret, tag, props, styles, events, text) {
      ret.add('tagName', tag);
      ret.css(styles);
      if (text) {
        ret.text(text);
      }
      ret.add('$', $(ret.get()));
      ret.add('0', ret.get());
      ret.add('bindEvents', _.once(function() {
        return bindEvents(ret, events);
      }));
      return ret;
    };

    /*
    Create an HTML Element through ThinDom
     */
    OJ.register('element', function(tag, props, styles, events, text) {
      var ret;
      ret = ThinDOM(tag, props);
      finalize(ret, tag, props, styles, events, text);
      return ret;
    });

    /*
    Restore an HTML Element through ThinDom
     */
    OJ.register('restoreElement', function(tag, el) {
      var ret;
      ret = ThinDOM(null, null, el);
      finalize(ret, tag);
      ret.add('isInDOM', true);
      return ret;
    });

    /*
    Persist a handle on the body ode
     */
    if (typeof document !== 'undefined') {
      body = document.body;
    } else {
      body = null;
    }
    initBody = function(el) {
      var ret;
      ret = ThinDOM(null, {
        id: 'body'
      }, el);
      ret.isInDOM = true;
      return finalize(ret, 'body');
    };
    thinBody = initBody(body);
    thinBody.getId = function() {
      return 'body';
    };
    OJ.register('body', thinBody);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {

    /*
    Create an OJ Input Object through OJ.nodes.input
     */
    var input;
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
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var addMakeMethod, closed, initBody, makeAdd, makeUniqueId, nestableNodeNames, nodeNames, nonNestableNodes, open;
    closed = 'a abbr acronym address applet article aside audio b bdo big blockquote body button canvas caption center cite code colgroup command datalist dd del details dfn dir div dl dt em embed fieldset figcaption figure font footer form frameset h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins keygen kbd label legend li map mark menu meter nav noframes noscript object ol optgroup option output p pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr tt u ul var video wbr xmp'.split(' ');
    open = 'area base br col command css !DOCTYPE embed hr img input keygen link meta param source track wbr'.split(' ');
    nestableNodeNames = ['div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'fieldset', 'select', 'ol', 'ul', 'table'];
    nonNestableNodes = ['li', 'legend', 'tr', 'td', 'option', 'body', 'head', 'source', 'tbody', 'tfoot', 'thead', 'link', 'script'];

    /*
    Init the body for chaining the first time it's seen
     */
    initBody = _.once(function(body) {
      body.count = 0;
      body.root = null;
      OJ.dom(body, null);
      addMakeMethod(body, 0);
      body.isFullyInit = true;
      return body;
    });

    /*
    Fetch a node from the DOM and return an OJ'fied instance of the element
     */
    OJ.nodes.register('get', function(id, tagName) {
      var el, ret, thinEl;
      if (tagName == null) {
        tagName = 'div';
      }
      ret = null;
      el = document.getElementById(id);
      if (el) {
        thinEl = OJ.restoreElement(tagName, el);
      }
      if (thinEl) {
        ret = OJ.nodes.factory(thinEl, null, 0);
      }
      return ret;
    });
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
    addMakeMethod = function(el, count) {
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
          id = parent.getId();
          id += el.tagName + count;
          el.attr('id', id);
        }
      }
    };

    /*
    Extends a OJ Control class with all the (permitted) methods on the factory
     */
    OJ.nodes.register('factory', function(el, parent, count) {
      var ret;
      if (parent == null) {
        parent = OJ.body;
      }
      if (count == null) {
        count = parent.count || 0;
      }
      initBody(OJ.body);
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
          addMakeMethod(ret, count);
          ret.isFullyInit = true;
        }
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  var __slice = [].slice;

  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'a';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'b';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
        },
        number: 1
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'br';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      while (i < OJ.to.number(defaults.number)) {
        ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
        i += 1;
      }
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'button';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
      var defaults, ret;
      if (owner == null) {
        owner = OJ.body;
      }
      if (calledFromFactory == null) {
        calledFromFactory = false;
      }
      defaults = {
        props: {
          type: 'button'
        },
        styles: {},
        events: {
          click: OJ.noop
        }
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'div';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'em';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
        },
        number: 1
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'fieldset';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
      var defaults, ret;
      if (owner == null) {
        owner = OJ.body;
      }
      if (calledFromFactory == null) {
        calledFromFactory = false;
      }
      defaults = {
        props: {
          form: '',
          disabled: '',
          name: ''
        },
        styles: {},
        events: {
          click: OJ.noop
        }
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'form';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      ret.add('validator', ret.$.validate({
        highlight: function(element) {
          var $elm;
          $elm = $(element);
          $elm.attr('OJ_invalid', '1');
          $elm.animate({
            backgroundColor: 'red'
          });
        },
        unhighlight: function(element) {
          var $elm;
          $elm = $(element);
          if ($elm.attr('OJ_invalid') === '1') {
            $elm.css('background-color', 'yellow');
            $elm.attr('OJ_invalid', '0');
            setTimeout((function() {
              $elm.animate({
                backgroundColor: 'transparent'
              });
            }), 500);
          }
        }
      }));
      ret.add('isFormValid', function() {
        return ret.$.valid() && (!ret.validator.invalidElements() || ret.validator.invalidElements().length === 0);
      });
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'h1';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
        },
        number: 1
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'h2';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
        },
        number: 1
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'h3';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
        },
        number: 1
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'h4';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
        },
        number: 1
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'h5';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
        },
        number: 1
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'h6';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
        },
        number: 1
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'i';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
        },
        number: 1
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'img';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
      var defaults, ret;
      if (owner == null) {
        owner = OJ.body;
      }
      if (calledFromFactory == null) {
        calledFromFactory = false;
      }
      defaults = {
        props: {
          src: "",
          alt: "",
          title: "",
          height: "",
          ismap: "",
          usemap: "",
          border: 0,
          width: ""
        },
        styles: {},
        events: {
          click: OJ.noop
        }
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  var __slice = [].slice;

  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'input';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      if (!defaults.props.type || !OJ.enums.inputTypes[defaults.props.type]) {
        throw new Error('No matching input type for {' + defaults.props.type + '} could be found.');
      }
      thisType = OJ.enums.inputTypes[defaults.props.type];
      syncValue = function() {
        switch (thisType) {
          case OJ.enums.inputTypes.checkbox:
            ret.value = ret.$.is(':checked');
            break;
          case OJ.enums.inputTypes.radio:
            ret.value = ret.$.find(':checked').val();
            break;
          default:
            ret.value = ret.val();
        }
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      ret.value = defaults.props.value;
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'label';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
      var defaults, ret;
      if (owner == null) {
        owner = OJ.body;
      }
      if (calledFromFactory == null) {
        calledFromFactory = false;
      }
      defaults = {
        props: {
          forAttr: "",
          form: "",
          text: ""
        },
        styles: {},
        events: {
          click: OJ.noop
        }
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'legend';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
      var defaults, ret;
      if (owner == null) {
        owner = OJ.body;
      }
      if (calledFromFactory == null) {
        calledFromFactory = false;
      }
      defaults = {
        props: {
          form: '',
          disabled: ''
        },
        styles: {},
        events: {
          click: OJ.noop
        }
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'li';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'nav';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
        },
        number: 1
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'ol';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'option';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
      var defaults, ret;
      if (owner == null) {
        owner = OJ.body;
      }
      if (calledFromFactory == null) {
        calledFromFactory = false;
      }
      defaults = {
        props: {
          value: '',
          text: '',
          selected: '',
          disabled: ''
        },
        styles: {},
        events: {
          click: OJ.noop
        }
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'p';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  var __slice = [].slice;

  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'select';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
      var change, click, defaults, hasEmpty, newChange, newClick, ret, syncValue, value, values;
      if (owner == null) {
        owner = OJ.body;
      }
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
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
          values.push(value);
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
      });
      if (defaults.values.length > 0) {
        ret.addOptions(defaults.values);
      }
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'span';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'strong';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
        },
        number: 1
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'sup';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
        },
        number: 1
      };
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'svg';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'table';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
      var cells, columnCount, defaults, fillMissing, ret, rows, tbody, thead, theadRow;
      if (owner == null) {
        owner = OJ.body;
      }
      if (calledFromFactory == null) {
        calledFromFactory = false;
      }
      defaults = {
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
        events: {
          click: OJ.noop
        },
        cells: {
          "class": '',
          align: '',
          'vertical-align': '',
          cellpadding: '',
          margin: ''
        },
        firstAlignRight: false,
        oddAlignRight: false
      };
      rows = [];
      cells = OJ.array2D();
      columnCount = 0;
      OJ.extend(defaults, options, true);
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      tbody = null;
      thead = null;
      theadRow = null;
      ret.add('init', _.once(function() {
        thead = ret.make('thead');
        theadRow = thead.make('tr');
        tbody = ret.make('tbody');
        rows.push(tbody.make('tr'));
        return ret;
      }));
      fillMissing = function() {
        return cells.each(function(rowNo, colNo, val) {
          var row;
          if (!val) {
            row = ret.row(rowNo);
            return row.cell(colNo, {});
          }
        });
      };

      /*
      Adds a column name to the table head
       */
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
            th = OJ.restoreElement('th', nativeTh);
          }
          i += 1;
        }
        if (!th) {
          nativeTh = thead[0].rows[0].cells[colNo - 1];
          th = OJ.restoreElement('th', nativeTh);
        }
        th.text(colName);
        return th;
      });

      /*
      Adds a new row (tr) to the table body
       */
      ret.add('row', function(rowNo, opts) {
        var row;
        ret.init();
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

      /*
      Adds a cell (tr/td) to the table body
       */
      ret.add('cell', function(rowNo, colNo, opts) {
        var cell, i, nuOpts, row, tryCell;
        ret.init();
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
            tryCell = cells.get(rowNo, i);
            if (!tryCell) {
              if (i === colNo) {
                nuOpts = OJ.extend({
                  props: defaults.cells
                }, opts);
                cell = row.cell(colNo, nuOpts);
              } else {
                row.cell(i, {
                  props: defaults.cells
                });
              }
            }
          }
        }
        return cell;
      });
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'tbody';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'td';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  var __slice = [].slice;

  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'textarea';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
      var change, click, defaults, newChange, newClick, ret, syncValue, value;
      if (owner == null) {
        owner = OJ.body;
      }
      if (calledFromFactory == null) {
        calledFromFactory = false;
      }
      defaults = {
        props: {
          name: "",
          placeholder: "",
          value: "",
          text: "",
          maxlength: "",
          autofocus: false,
          isRequired: false,
          rows: 3,
          cols: 25,
          disabled: false,
          readonly: false,
          form: "",
          wrap: ""
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
          case OJ.enums.inputTypes.checkbox:
            return value = ret.$.is(":checked");
          case OJ.enums.inputTypes.radio:
            return value = ret.$.find(":checked").val();
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'th';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'thead';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
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
          cell = OJ.restoreElement('td', td);
        }
        if (!td) {
          while (row[0].cells.length < colNo) {
            idx = row[0].cells.length;
            td = row[0].cells[idx - 1];
            if (td && idx === colNo) {
              cell = OJ.restoreElement('td', td);
            } else {
              cell = OJ.nodes.td({
                props: defaults.cells
              }, row, false);
            }
          }
        }
        if (!cell.isValid) {
          OJ.nodes.factory(cell, row, rowNo + colNo);
        }
        return cell;
      });
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'tr';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var nodeName;
    nodeName = 'ul';
    OJ.nodes.register(nodeName, function(options, owner, calledFromFactory) {
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
      ret = OJ.element(nodeName, defaults.props, defaults.styles, defaults.events, defaults.text);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'buttoninput';
    OJ.inputs.register(inputName, function(options, owner) {
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
      OJ.extend(defaults, options, true);
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'checkbox';
    OJ.inputs.register(inputName, function(options, owner) {
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
      OJ.extend(defaults, options, true);
      ret = OJ.input(defaults, owner);
      if (defaults.checked) {
        ret.attr('checked', true);
      } else if (defaults.indeterminate) {
        ret.attr('indeterminate', true);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'color';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'date';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'datetime';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'datetime-local';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'email';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'file';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'hidden';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'imageinput';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'month';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'number';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'password';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'radio';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'range';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'reset';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'search';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'submit';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'tel';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'textinput';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'time';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'url';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inputName;
    inputName = 'week';
    OJ.inputs.register(inputName, function(options, owner) {
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
      ret = OJ.input(defaults, owner);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var array2D;
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
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  var __slice = [].slice;

  (function(OJ) {
    var console, methodLength, methods;
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
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {

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
    var cookies;
    if (!$ || !$.cookie) {
      throw new Error('jQuery Cookie is a required dependency.');
    }
    $.cookie.defaults.secure = false;
    cookies = {};
    OJ.cookie.register('get', function(cookieName, type) {
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
    });
    OJ.cookie.register('all', function() {
      var ret;
      ret = $.cookie();
      return ret;
    });
    OJ.cookie.register('set', function(cookieName, value, opts) {
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
    });
    OJ.cookie.register('delete', function(cookieName, opts) {
      if (cookieName) {
        if (opts) {
          $.removeCookie(cookieName, opts);
        } else {
          $.removeCookie(cookieName);
        }
        delete cookies[cookieName];
      }
    });
    OJ.cookie.register('deleteAll', function() {
      cookies = {};
      OJ.each(OJ.cookie.all, function(val, key) {
        return OJ.cookie["delete"](key);
      });
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var defer;
    defer = function(method, waitMs) {
      if (setTimeout) {
        return setTimeout(method, waitMs);
      }
    };
    OJ.register('defer', defer);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var canEach, each;
    canEach = function(obj) {
      return OJ.is.plainObject(obj || OJ.is.array(obj));
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
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    OJ.enums.register('unknown', 'unknown');
    OJ.enums.register('inputTypes', {
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
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var onError;
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
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var apply, curryLeft, filter, foldLeft, map, shiftRight;
    OJ.makeSubNameSpace("fun");
    OJ.fun.register("curryLeft", curryLeft = function(func) {
      var args, slice;
      slice = Array.prototype.slice;
      args = slice.call(arguments, 1);
      return function() {
        return func.apply(this, args.concat(slice.call(arguments, 0)));
      };
    });
    OJ.fun.register("foldLeft", foldLeft = function(func, newArray, oldArray) {
      var accumulation;
      accumulation = newArray;
      OJ.each(oldArray, function(val) {
        accumulation = func(accumulation, val);
      });
      return accumulation;
    });
    OJ.fun.register("map", map = function(func, array) {
      var onIteration;
      onIteration = function(accumulation, val) {
        return accumulation.concat(func(val));
      };
      return OJ.fun.foldLeft(onIteration, [], array);
    });
    OJ.fun.register("filter", filter = function(func, array) {
      var onIteration;
      onIteration = function(accumulation, val) {
        if (func(val)) {
          return accumulation.concat(val);
        } else {
          return accumulation;
        }
      };
      return OJ.fun.foldLeft(onIteration, [], array);
    });
    OJ.fun.register("shiftRight", shiftRight = function(shiftFunc, firstParam, originalArguments, context) {
      var args;
      context = context || this;
      args = Array.prototype.slice.call(originalArguments, 0);
      args.unshift(firstParam);
      return shiftFunc.apply(context, args);
    });
    OJ.fun.register("apply", apply = function(applyFunc, originalArguments, context) {
      var args;
      context = context || this;
      args = Array.prototype.slice.call(originalArguments, 0);
      return applyFunc.apply(context, args);
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var eventInfo, eventName;
    if (OJ.global.addEventListener) {
      eventName = 'addEventListener';
      eventInfo = '';
    } else {
      eventName = 'attachEvent';
      eventInfo = 'on';
    }
    OJ.history.register('pushState', function(pageName, event) {
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
    });
    OJ.history.register('restoreState', function(location) {
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
    });

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
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    OJ.is.register('bool', function(boolean) {
      'use strict';
      return _.isBoolean(boolean);
    });
    OJ.is.register('arrayNullOrEmpty', function(arr) {
      'use strict';
      return _.isEmpty(arr);
    });
    OJ.is.register('stringNullOrEmpty', function(str) {
      'use strict';
      return str && (!str.length || str.length === 0 || !str.trim || !str.trim());
    });
    OJ.is.register('numberNullOrEmpty', function(num) {
      'use strict';
      return !num || isNaN(num) || !num.toPrecision;
    });
    OJ.is.register('dateNullOrEmpty', function(dt) {
      'use strict';
      return !dt || !dt.getTime;
    });
    OJ.is.register('objectNullOrEmpty', function(obj) {
      'use strict';
      return _.isEmpty(obj || !Object.keys(obj) || Object.keys(obj).length === 0);
    });
    OJ.is.register('plainObject', function(obj) {
      'use strict';
      return _.isPlainObject(obj);
    });
    OJ.is.register('date', function(dt) {
      return _.isDate(dt);
    });

    /*
    Determines if a value is an instance of a Number and not NaN*
     */
    OJ.is.register('number', function(num) {
      return typeof num === 'number' && false === (OJ.number.isNaN(num) || false === OJ.number.isFinite(num) || OJ.number.MAX_VALUE === num || OJ.number.MIN_VALUE === num);
    });

    /*
    Determines if a value is convertable to a Number
     */
    OJ.is.register('numeric', function(num) {
      var nuNum, ret;
      ret = OJ.is.number(num);
      if (!ret) {
        nuNum = OJ.to.number(num);
        ret = OJ.is.number(nuNum);
      }
      return ret;
    });
    OJ.is.register('vendorObject', function(obj) {
      'use strict';
      var ret;
      ret = obj instanceof OJ['?'];
      return ret;
    });
    OJ.is.register('elementInDom', function(elementId) {
      return false === OJ.is.nullOrEmpty(document.getElementById(elementId));
    });
    OJ.is.register('generic', function(obj) {
      'use strict';
      var ret;
      ret = false === OJ.is.method(obj) && false === OJ.hasLength(obj) && false === OJ.is.plainObject(obj);
      return ret;
    });
    OJ.is.register('array', function(obj) {
      return _.isArray(obj);
    });
    OJ.is.register('string', function(str) {
      return _.isString(str);
    });
    OJ.is.register('true', function(obj) {
      'use strict';
      return obj === true || obj === 'true' || obj === 1 || obj === '1';
    });
    OJ.is.register('false', function(obj) {
      'use strict';
      return obj === false || obj === 'false' || obj === 0 || obj === '0';
    });
    OJ.is.register('trueOrFalse', function(obj) {
      'use strict';
      return OJ.is["true"](obj || OJ.is["false"](obj));
    });
    OJ.is.register('nullOrEmpty', function(obj, checkLength) {
      'use strict';
      return _.isEmpty(obj || _.isUndefined(obj || _.isNull(obj || _.isNaN(obj))));
    });
    OJ.is.register('instanceof', function(name, obj) {
      'use strict';
      return obj.type === name || obj instanceof name;
    });
    OJ.is.register('method', function(obj) {
      'use strict';
      return obj !== OJ.noop && _.isFunction(obj);
    });

    /*
    Deprecated. Left for backwards compatibility. Use is.method instead.
     */
    OJ.is.register('func', OJ.is.method);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var friendlyName;
    friendlyName = 'noty';
    OJ.notifications.register(friendlyName, function(options, owner) {
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
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var events, getEventName, publish, subscribe, subscribers, tokens, unsubscribe, unsubscribeAll, unsubscribeEvent;
    tokens = {};
    subscribers = [];
    events = {};
    getEventName = function(event) {
      return event.toUpperCase().replace(' ', '_');
    };
    subscribe = function(event, method) {
      var eventName, token;
      eventName = getEventName(event);
      if (!events[eventName]) {
        events[eventName] = [];
      }
      token = PubSub.subscribe(eventName, method);
      tokens[token] = token;
      subscribers.push(method);
      events[eventName].push(method);
      return token;
    };
    publish = function(event, data) {
      var eventName;
      eventName = getEventName(event);
      if (events[eventName]) {
        PubSub.publish(eventName, data);
      } else {
        OJ.console.info('Event named {' + event + '} is not recognized.');
      }
    };
    unsubscribe = function(tokenOrMethod) {
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
    };
    unsubscribeAll = function() {
      OJ.each(tokens, function(token) {
        return unsubscribe(token);
      });
      subscribers = [];
      events = {};
    };
    unsubscribeEvent = function(event) {
      var eventName;
      eventName = getEventName(event);
      if (events[eventName]) {
        OJ.each(events[eventName], function(method) {
          return unsubscribe(method);
        });
      } else {
        OJ.console.info('Event named {' + event + '} is not recognized.');
      }
      delete events[eventName];
    };
    OJ.register('publish', publish);
    OJ.register('subscribe', subscribe);
    OJ.register('unsubscribe', unsubscribe);
    OJ.register('unsubscribeAll', unsubscribeAll);
    OJ.register('unsubscribeEvent', unsubscribeEvent);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {

    /*
    http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
     */
    OJ.register('queryString', function(param) {
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
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  var __slice = [].slice;

  (function(OJ) {
    var rangeToSubRanges, stringRangeToSubRanges;
    OJ.register('range', function() {
      var params;
      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.range.apply(_, params);
    });
    OJ.register('rangeMin', function() {
      var params;
      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.min.apply(_, params);
    });
    OJ.register('rangeMax', function() {
      var params;
      params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return _.max.apply(_, params);
    });

    /*
    Take an array of string values and a number of partitions to create.
    Uses the first letter of each string value in the array to convert to unique code character (lower case)
    Builds a int range based on unique code chars.
     */
    stringRangeToSubRanges = function(n, range) {
      var charRange, i, oldGetRange, ret, subRange;
      if (n == null) {
        n = 6;
      }
      if (range == null) {
        range = [];
      }
      charRange = [];
      OJ.each(range, function(val) {
        var char;
        char = val.trim()[0].toLowerCase();
        if (false === OJ.contains(charRange, char)) {
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
    };

    /*
    Take an array of int values and a number of partitions to create.
    Divides the original array into the specified number of sub arrays.
    Overflow is passed to the final partition.
     */
    rangeToSubRanges = function(n, range) {
      var chunkVal, distance, i, jump, map, rangeHigh, rangeLow, ret, subRange, subRangeSize, subRanges;
      if (n == null) {
        n = 6;
      }
      if (range == null) {
        range = [];
      }
      ret = OJ.object();
      rangeLow = OJ.rangeMin(range);
      rangeHigh = OJ.rangeMax(range);
      distance = rangeHigh - rangeLow;
      subRangeSize = distance / n;
      subRanges = ret.add('ranges', OJ.object());
      chunkVal = rangeLow;
      map = OJ.object();
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
        subRange = OJ.range(chunkVal, chunkVal + jump);
        OJ.each(subRange, function(val) {
          return map.add(val, i);
        });
        subRanges[i] = subRange;
        chunkVal += jump;
      }
      ret.add('getRange', function(val) {
        return map[val];
      });
      return ret;
    };
    OJ.register('stringRangeToSubRanges', stringRangeToSubRanges);
    OJ.register('rangeToSubRanges', rangeToSubRanges);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    OJ.to.register('bool', function(str) {
      var retBool;
      retBool = OJ.is['true'](str);
      if (retBool === false || retBool !== true) {
        retBool = false;
      }
      return retBool;
    });
    OJ.to.register('ES5_ToBool', function(val) {
      return val !== false && val !== 0 && val !== '' && val !== null && val !== undefined && (typeof val !== 'number' || !isNaN(val));
    });
    OJ.to.register('dateFromTicks', function(tickStr) {
      var arr, localOffset, offset, ret, ticks, ticsDateTime;
      ticsDateTime = OJ.to.string(tickStr);
      ret = void 0;
      ticks = void 0;
      offset = void 0;
      localOffset = void 0;
      arr = void 0;
      if (false === OJ.is.nullOrEmpty(ticsDateTime)) {
        ticsDateTime = ticsDateTime.replace('/', '');
        ticsDateTime = ticsDateTime.replace('Date', '');
        ticsDateTime = ticsDateTime.replace('(', '');
        ticsDateTime = ticsDateTime.replace(')', '');
        arr = ticsDateTime.split('-');
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
      return ret;
    });
    OJ.to.register('binary', function(obj) {
      var ret;
      ret = NaN;
      if (obj === 0 || obj === '0' || obj === '' || obj === false || OJ.to.string(obj).toLowerCase().trim() === 'false') {
        ret = 0;
      } else {
        if (obj === 1 || obj === '1' || obj === true || OJ.to.string(obj).toLowerCase().trim() === 'true') {
          ret = 1;
        }
      }
      return ret;
    });

    /*
    Attempts to converts an arbitrary value to a Number.
    Loose falsy values are converted to 0.
    Loose truthy values are converted to 1.
    All other values are parsed as Integers.
    Failures return as NaN.
     */
    OJ.to.register('number', function(inputNum, defaultNum) {
      var retVal, tryGetNumber;
      tryGetNumber = function(val) {
        var ret, tryGet;
        ret = NaN;
        if (OJ.is.number(val)) {
          ret = val;
        } else if (OJ.is.string(val) || OJ.is.bool(val)) {
          tryGet = function(value) {
            var num;
            num = OJ.to.binary(value);
            if (!OJ.is.number(num) && value) {
              num = +value;
            }
            if (!OJ.is.number(num)) {
              num = _.parseInt(value, 0);
            }
            return num;
          };
          ret = tryGet(val);
        }
        return ret;
      };
      retVal = tryGetNumber(inputNum);
      if (!OJ.is.number(retVal)) {
        retVal = tryGetNumber(defaultNum);
        if (!OJ.is.number(retVal)) {
          retVal = Number.NaN;
        }
      }
      return retVal;
    });
    OJ.to.register('string', function(inputStr, defaultStr) {
      var ret1, ret2, retVal, tryGetString;
      tryGetString = function(str) {
        var ret;
        ret = void 0;
        if (OJ.is.string(str)) {
          ret = str;
        } else {
          ret = '';
          if (OJ.is.bool(str) || OJ.is.number(str) || OJ.is.date(str)) {
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
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {

    /*
    Generates a random string that complies to the RFC 4122 specification for GUID/UUID.
    (e.g. 'B42A153F-1D9A-4F92-9903-92C11DD684D2')
    While not a true UUID, for the purposes of this application, it should be sufficient.
     */
    var createFauxUUID;
    createFauxUUID = function() {
      var hexDigits, i, s, uuid;
      s = [];
      s.length = 36;
      hexDigits = "0123456789abcdef";
      i = 0;
      while (i < 36) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        i += 1;
      }
      s[14] = "4";
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
      s[8] = s[13] = s[18] = s[23] = "-";
      uuid = s.join("");
      return uuid;
    };
    OJ.register("createUUID", createFauxUUID);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);
