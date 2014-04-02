/**
 * ojs - A framework for writing zero-template, zero-html, zero-css web apps in pure JavaScript.
 * @version v0.2.7
 * @link http://somecallmechief.github.io/oj/
 * @license 
 */

/*
@fileOverview Name Space file
@author me
@version: 0.1.1
 */


/*
jQuery definition to anchor JsDoc comments.

@see http://jquery.com/
@name jQuery
@namespace jQuery Library
 */


/*
OJ IIFE definition to anchor JsDoc comments.

@namespace internalNameSpace
@internal
@param {string} nameSpaceName
@param {jQuery} domVendor
 */

(function() {
  var NsTree, makeTheJuice, nameSpaceName, thisGlobal, utilLib;

  thisGlobal = (typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this);

  utilLib = thisGlobal.jQuery;

  nameSpaceName = "OJ";


  /*
  boot strap name method into Object prototype
  @function
  @return {string} Name of the Object
  @memberOf {object}
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
          return "";
        }
      }
    }
  });


  /*
  An internal representation of the namespace tree
  @internal
  @memberOf internalNameSpace
   */

  NsTree = {};

  makeTheJuice = function() {

    /*
    Internal nameSpaceName method to create new "sub" namespaces on arbitrary child objects.
    @internal
    @param spacename {string} the namespace name
    @param tree {object} the internal tree representation of the current level of the namespace
    @extends OJ
    @memberOf internalNameSpace
     */
    var NsOut, dependsOn, makeNameSpace, nsInternal;
    makeNameSpace = function(spacename, tree) {

      /*
      The derived instance to be constructed
      @constructor
      @internal
      @memberOf makeNameSpace
      @return {object}
       */
      var Base, Class;
      Base = function(nsName) {
        var nsTree, proto;
        proto = this;
        tree[nsName] = tree[nsName] || {};
        nsTree = tree[nsName];

        /*
        Register (e.g. "Lift") an Object into the prototype of the namespace.
        This Object will be readable/executable but is otherwise immutable.
        @name register
        @param {string} name The name of the object to lift
        @param {object} obj Any, arbitrary Object to use as the value.
        @return {object} The value of the new property.
        @memberOf OJ
         */
        Object.defineProperty(this, "register", {
          value: function(name, obj, enumerable) {
            'use strict';
            if ((typeof name !== "string") || name === "") {
              throw new Error("Cannot lift a new property without a valid name.");
            }
            if (!obj) {
              throw new Error("Cannot lift a new property without a valid property instance.");
            }
            if (proto[name]) {
              throw new Error("Property named " + name + " is already defined on " + spacename + ".");
            }
            nsTree[name] = nsTree[name] || {
              name: name,
              type: typeof obj,
              instance: (obj.getInstanceName ? obj.getInstanceName() : "unknown")
            };
            Object.defineProperty(proto, name, {
              value: obj,
              enumerable: false !== enumerable
            });
            nsInternal.alertDependents(nsName + "." + spacename + "." + name);
            return obj;
          }
        });

        /*
        Create a new, static namespace on the current parent (e.g. nsName.to... || nsName.is...)
        @name makeSubNameSpace
        @param {string} subNameSpace The name of the new namespace.
        @return {object} The new namespace.
        @memberOf OJ
         */
        proto.register("makeSubNameSpace", (function(subNameSpace) {
          'use strict';
          var newNameSpace;
          if ((typeof subNameSpace !== "string") || subNameSpace === "") {
            throw new Error("Cannot create a new sub namespace without a valid name.");
          }
          if (proto.subNameSpace) {
            throw new Error("Sub namespace named " + subNameSpace + " is already defined on " + spacename + ".");
          }
          nsInternal.alertDependents(nsName + "." + subNameSpace);
          newNameSpace = makeNameSpace(subNameSpace, nsTree);
          if (subNameSpace !== "constants") {
            newNameSpace.register("constants", makeNameSpace("constants", nsTree), false);
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
      Class = new Function("return function " + spacename + "(){}")();
      Class.prototype = new Base(spacename);
      return new Class(spacename);
    };

    /*
    "Depend" an Object upon another member of this namespace, upon another namespace,
    or upon a member of another namespace
    @param (array) array of dependencies for this method
    @param (function) obj Any, arbitrary Object to use as the value
    @memberOf OJ
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
    @interal
    @return {Array} An array of members defined as strings (e.g. 'namespace.constants.astringcnst')
    @memberOf internalNameSpace
     */
    Object.defineProperty(nsInternal, "getNsMembers", {
      value: function() {
        var members, recurseTree;
        recurseTree = function(key, lastKey) {
          if (typeof key === "string") {
            members.push(lastKey + "." + key);
          }
          if (utilLib.isPlainObject(key)) {
            Object.keys(key).forEach(function(k) {
              if (typeof k === "string") {
                members.push(lastKey + "." + k);
              }
              if (utilLib.isPlainObject(key[k])) {
                recurseTree(key[k], lastKey + "." + k);
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
    @internal
    @memberOf internalNameSpace
     */
    Object.defineProperty(nsInternal, "alertDependents", {
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
    @name '?'
    @return {jQuery}
    @memberOf OJ
     */
    NsOut.register("?", utilLib, false);

    /*
    Cache the tree (useful for documentation/visualization/debugging)
    @name 'tree'
    @return {NsTree}
    @memberOf OJ
     */
    NsOut.register("tree", NsTree[nameSpaceName], false);

    /*
    Cache the name space name
    @name 'name'
    @return {nameSpaceName}
    @memberOf OJ
     */
    NsOut.register("name", nameSpaceName, false);
    NsOut.register("dependsOn", dependsOn, false);
    return NsOut;
  };


  /*
  OJ NameSpace
  
  @namespace OJ
   */

  Object.defineProperty(thisGlobal, nameSpaceName, {
    value: makeTheJuice()
  });

}).call(this);

(function() {
  (function(OJ) {
    OJ.makeSubNameSpace('errors');
    OJ.makeSubNameSpace('enums');
    OJ.makeSubNameSpace('is');
    OJ.makeSubNameSpace('instanceOf');
    OJ.makeSubNameSpace('to');
    OJ.makeSubNameSpace('nodes');
    OJ.makeSubNameSpace('db');
    OJ.makeSubNameSpace('components');
    return OJ.components.register('members', {});
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    OJ.enums.register('unknown', 'unknown');
    OJ.enums.register('tryParse', function(OJEnum, enumMember, caseSensitive) {
      'use strict';
      var ret;
      ret = OJ.enums.unknown;
      if (OJ.contains(OJEnum, enumMember)) {
        ret = OJEnum[enumMember];
      } else if (false === caseSensitive) {
        OJ.each(OJEnum, function(member) {
          if (OJ.contains(OJEnum, member) && OJ.string(member).toLowerCase() === OJ.string(enumMember).toLowerCase()) {
            ret = member;
          }
        });
      }
      return ret;
    });
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
    OJ.enums.register('rateIntervalTypes', {
      Hourly: 'Hourly',
      WeeklyByDay: 'WeeklyByDay',
      MonthlyByDate: 'MonthlyByDate',
      MonthlyByWeekAndDay: 'MonthlyByWeekAndDay',
      YearlyByDate: 'YearlyByDate'
    });
    OJ.enums.register('domElementEvent', {
      click: 'click',
      change: 'change',
      vclick: 'vclick',
      tap: 'tap'
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    OJ.components.members['x-sub-nav'] = 'subnav';
    OJ.components.register('subnav', function(options, owner) {
      var defaults, ret, ul;
      defaults = {
        active: '',
        menu: [
          {
            name: '',
            href: ''
          }
        ]
      };
      OJ.extend(defaults, options);
      ret = OJ.component(defaults, owner, 'x-sub-nav');
      ul = ret.ul({
        attr: {
          "class": 'active'
        }
      });
      OJ.each(defaults.menu, function(val, key) {
        var li;
        if (val.name === defaults.active) {
          li = ul.li({
            attr: {
              "class": 'active'
            }
          });
        } else {
          li = ul.li();
        }
        li.a({
          attr: val
        });
      });
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {

    /*
    Create an HTML Element through ThinDom
     */
    var component;
    component = function(options, owner, tagName) {
      var ret;
      if (options == null) {
        options = OJ.object();
      }
      if (!tagName.startsWith('x-')) {
        tagName = 'x-' + tagName;
      }
      ret = OJ.element(tagName, options.props, options.styles);
      return OJ.nodes.factory(ret, owner);
    };
    OJ.register('component', component);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    OJ.register('dom', function(el, parent) {
      var enabled, getData, isControlStillValid, setData, setDataObj;
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
          el.$.bind(eventName, event);
        }
        return el;
      });
      el.add('keyboard', function(keys, event) {
        if (isControlStillValid()) {
          Mousetrap.bind(keys, el[event]);
        }
        return el;
      });
      getData = function(propName) {
        var data;
        data = null;
        if (isControlStillValid() && propName) {
          if (el[0] && el[0].dataset && el[0].dataset[propName]) {
            data = el[0].dataset.propName;
          }
        }
        return data;
      };
      setData = function(propName, value) {
        var data;
        data = null;
        if (isControlStillValid() && propName) {
          data = value;
          if (el[0] && el[0].dataset) {
            el[0].dataset[propName] = value;
          }
        }
        return data;
      };
      setDataObj = function(obj) {
        OJ.each(obj, function(val, propName) {
          setData(propName, val);
        });
        return el;
      };
      el.add('data', function(prop, val) {
        var data;
        data = '';
        if (isControlStillValid()) {
          if (OJ.isPlainObject(prop)) {
            setDataObj(prop);
          } else {
            switch (arguments_.length) {
              case 1:
                data = getData(prop);
                break;
              case 2:
                setData(prop, val);
                data = el;
            }
          }
        }
        return data;
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
          len = OJ.number(el.$.length);
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
          switch (OJ.bool(truthy)) {
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
          el.$.unbind(eventName, event);
        }
        return el;
      });
      el.add('val', function(value) {
        if (isControlStillValid()) {
          if (arguments_.length === 1 && false === OJ.isNullOrUndefined(value)) {
            el.$.val(value);
            return el;
          } else {
            return OJ.string(el.$.val());
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
          if (_.isFunction(val && val !== _.noop)) {
            callback = function() {
              var event;
              event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              return val.apply(null, event);
            };
            el.$.bind(key, callback);
            el.add(key, callback);
          }
        });
      }
    };

    /*
    Finalize the ThimDOM node
     */
    finalize = function(ret, tag, props, styles, events) {
      ret.add('tagName', tag);
      ret.css(styles);
      ret.add('$', $(ret.get()));
      ret.add('0', ret.get());
      bindEvents(ret, events);
      return ret;
    };

    /*
    Create an HTML Element through ThinDom
     */
    OJ.register('element', function(tag, props, styles, events) {
      var ret;
      ret = ThinDOM(tag, props);
      finalize(ret, tag, props, styles, events);
      return ret;
    });

    /*
    Restore an HTML Element through ThinDom
     */
    OJ.register('restoreElement', function(tag, el) {
      var ret;
      ret = ThinDOM(null, null, el);
      finalize(ret, tag);
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
    var addComponents, closed, controlPostProcessing, extendChain, initBody, isBodyDefined, isChildNodeTypeAllowed, nestableNodeNames, nonNestableNodes, open;
    closed = 'a abbr acronym address applet article aside audio b bdo big blockquote body button canvas caption center cite code colgroup command datalist dd del details dfn dir div dl dt em embed fieldset figcaption figure font footer form frameset h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins keygen kbd label legend li map mark menu meter nav noframes noscript object ol optgroup option output p pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr tt u ul var video wbr xmp'.split(' ');
    open = 'area base br col command css !DOCTYPE embed hr img input keygen link meta param source track wbr'.split(' ');
    nestableNodeNames = ['div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'fieldset', 'select', 'ol', 'ul', 'table'];
    nonNestableNodes = ['li', 'legend', 'tr', 'td', 'option', 'body', 'head', 'source', 'tbody', 'tfoot', 'thead', 'link', 'script'];
    isChildNodeTypeAllowed = function(parent, tagName) {
      var allowed;
      switch (parent.tagName) {
        case 'a':
          allowed = false === _.contains(nonNestableNodes, tagName);
          break;
        case 'body':
          allowed = (tagName.startsWith('x-')) || _.contains(nestableNodeNames, tagName);
          break;
        case 'div':
          allowed = false === _.contains(nonNestableNodes, tagName);
          break;
        case 'form':
          allowed = false === _.contains(nonNestableNodes, tagName);
          break;
        case 'label':
          allowed = false === _.contains(nonNestableNodes, tagName);
          break;
        case 'legend':
          allowed = false;
          break;
        case 'fieldset':
          allowed = tagName === 'legend' || false === _.contains(nonNestableNodes, tagName);
          break;
        case 'ol':
          allowed = tagName === 'li';
          break;
        case 'ul':
          allowed = tagName === 'li';
          break;
        case 'li':
          allowed = false === _.contains(nonNestableNodes, tagName);
          break;
        case 'table':
          allowed = tagName === 'td' || tagName === 'tr' || tagName === 'tbody';
          break;
        case 'td':
          allowed = false === _.contains(nonNestableNodes, tagName);
          break;
        case 'select':
          allowed = tagName === 'option';
          break;
        case 'option':
          allowed = false;
          break;
        case 'span':
          allowed = false === _.contains(nonNestableNodes, tagName);
          break;
        case 'p':
          allowed = false === _.contains(nonNestableNodes, tagName);
          break;
        default:
          if (parent.tagName.startsWith('x-')) {
            allowed = false === _.contains(nonNestableNodes, tagName);
          } else {
            allowed = false;
          }
      }
      return allowed;
    };

    /*
    Add components to the chain, if permitted
    @tagName is the web component compatible node name (e.g. x-widget)
    @className is the internal, developer friendly name (e.g widget)
     */
    addComponents = function(tagName, parent, count, className) {
      if (isChildNodeTypeAllowed(parent, tagName)) {
        return parent.add(className, function(opts) {
          var nu;
          if (OJ.components[className]) {
            nu = OJ.components[className](opts, parent, true);
          } else {
            nu = OJ.component(className, parent);
          }
          return nu;
        });
      }
    };

    /*
    Determine which components to add to chain, if any
     */
    controlPostProcessing = function(parent, count) {
      if (_.contains(['div', 'span', 'td', 'p', 'body', 'form'], parent.tagName)) {
        OJ.each(OJ.components.members, function(className, tagName) {
          return addComponents(tagName, parent, count, className);
        });
      }
    };

    /*
    Extend the chain, if permitted
     */
    extendChain = function(tagName, parent, count) {
      if (isChildNodeTypeAllowed(parent, tagName)) {
        return parent.add(tagName, function(opts) {
          var nu;
          if (OJ.nodes[tagName]) {
            nu = OJ.nodes[tagName](opts, parent, true);
          } else if ((_.contains(closed, tagName)) || _.contains(open, tagName)) {
            nu = OJ.element(tagName, parent);
          }
          return OJ.nodes.factory(nu, parent, count);
        });
      }
    };

    /*
    Init the body for chaining the first time it's seen
     */
    initBody = _.once(function(body) {
      body.count = 0;
      return OJ.nodes.factory(body, null, 0);
    });
    isBodyDefined = false;
    OJ.nodes.register('factory', function(el, parent, count) {
      var id, ret;
      if (parent == null) {
        parent = OJ.body;
      }
      if (count == null) {
        count = parent.count || 0;
      }
      initBody(OJ.body);
      count += 1;
      if (el.tagName === 'body' && !isBodyDefined) {
        parent = null;
        el.root = null;
        ret = OJ.dom(el, null);
        controlPostProcessing(ret, 0);
        isBodyDefined = true;
      } else {
        parent.count = count;
        ret = OJ.dom(el, parent);
        if (!el.id) {
          id = parent.getId();
          id += ret.tagName + count;
          ret.attr('id', id);
        }
        parent.append(ret[0]);
        controlPostProcessing(ret, count);
      }
      extendChain('a', ret, count);
      extendChain('b', ret, count);
      extendChain('br', ret, count);
      extendChain('button', ret, count);
      extendChain('div', ret, count);
      extendChain('fieldset', ret, count);
      extendChain('form', ret, count);
      extendChain('img', ret, count);
      extendChain('input', ret, count);
      extendChain('label', ret, count);
      extendChain('legend', ret, count);
      extendChain('li', ret, count);
      extendChain('ol', ret, count);
      extendChain('option', ret, count);
      extendChain('p', ret, count);
      extendChain('select', ret, count);
      extendChain('span', ret, count);
      extendChain('svg', ret, count);
      extendChain('table', ret, count);
      extendChain('textarea', ret, count);
      extendChain('ul', ret, count);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function() {
    var makeSequentialArray;
    makeSequentialArray = function(start, end) {
      var i, ret;
      ret = array();
      i = void 0;
      end = +end;
      if (OJ.isNumber(start) && OJ.isNumber(end)) {
        i = +start;
        while (i <= end) {
          ret.push(i);
          i += 1;
        }
      }
      return ret;
    };
    OJ.register("makeSequentialArray", makeSequentialArray);
  })();

}).call(this);

(function() {
  (function(OJ) {

    /*
    Method to create a Class with optional inheritance.
    Generally, I oppose this semantic in JS:
    partly because of the ineffability of the 'this' operator,
    and partly because of the difficulty in grokking this.
    What we're really saying here (through the wonders of functional programming) is this:
    
    var MyClass1 = function(param1) {
    var ret = this;
    ret.id = param1;
    return ret;
    };
    
    var MyClass2 = function(param1, param2) {
    var ret = this;
    MyClass1.apply(this, Array.prototype.slice.call(arguments, 0));
    ret.name = param2;
    return ret;
    };
    
    MyClass2.prototype = new MyClass1;
    MyClass2.prototype.constructor = MyClass1;
    MyClass2.prototype.parent = MyClass1.prototype;
    
    I find this whole mode of operation as dull as it is stupid.
    Nonetheless, there are occassions when the convention is suitable for type checking,
    as you'll come to see in metadata.
    
    Obviously, this method has very little utility if you are not using protypical inheritance
     */
    var Class;
    OJ.register("Class", Class = function(name, inheritsFrom, callBack) {
      var obj;
      obj = Object.create(null);
      obj[name] = function() {
        var e;
        try {
          if (inheritsFrom) {
            inheritsFrom.apply(this, Array.prototype.slice.call(arguments, 0));
          }
          return callBack.apply(this, Array.prototype.slice.call(arguments, 0));
        } catch (_error) {
          e = _error;
          OJ.errors.ClassInheritanceError(Class.name + " failed to execute all or part of its callback routine for method " + name + "().", "", "", e);
        }
      };
      if (inheritsFrom) {
        obj[name].inheritsFrom(inheritsFrom);
      }
      return obj[name];
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function() {
    'use strict';
    OJ.register("getDateFromDnJson", function(dnDate) {
      var arr, dnDateStr, localOffset, offset, ret, ticks;
      dnDateStr = OJ.string(dnDate);
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
          ticks = OJ.number(arr[0]);
          offset = OJ.number(arr[1]);
          localOffset = new Date().getTimezoneOffset();
          ret = new Date(ticks - ((localOffset + (offset / 100 * 60)) * 1000));
        } else if (arr.length === 1) {
          ticks = OJ.number(arr[0]);
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
        if (OJ.is.func(tryFunc)) {
          ret = tryFunc.apply(that, Array.prototype.slice.call(arguments_, 1));
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
        args = Array.prototype.slice.call(arguments_, 0);
        args.unshift(tryFunc);
        return OJ.tryExec.apply(that, args);
      };
    });
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var apply, curryLeft, filter, foldLeft, map, shiftRight;
    OJ.makeSubNameSpace("fun");
    OJ.fun.register("curryLeft", curryLeft = function(func) {
      var args, slice;
      slice = Array.prototype.slice;
      args = slice.call(arguments_, 1);
      return function() {
        return func.apply(this, args.concat(slice.call(arguments_, 0)));
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
    OJ.is.register('bool', function(boolean) {
      'use strict';
      return _.isBoolean(boolean);
    });
    OJ.is.register('arrayNullOrEmpty', function(arr) {
      'use strict';
      return !Array.isArray(arr) || !arr || !arr.length || arr.length === 0 || !arr.push;
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
      ret = false === OJ.is['function'](obj) && false === OJ.hasLength(obj) && false === OJ.is.plainObject(obj);
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
    OJ.is.register('func', function(obj) {
      'use strict';
      return _.isFunction(obj);
    });
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var slice;
    slice = Array.prototype.slice;

    /*
    Take an arguments object and convert it into an Array
     */
    OJ.register("getArguments", function(args, sliceAt) {
      'use strict';
      var ret;
      sliceAt = sliceAt || 0;
      ret = slice.call(args, sliceAt);
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

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
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

}).call(this);

(function() {
  (function(OJ) {
    OJ.register("delimitedString", function(string, opts) {
      var nsInternal, nsRet;
      nsInternal = {
        newLineToDelimiter: true,
        spaceToDelimiter: true,
        removeDuplicates: true,
        delimiter: ",",
        initString: OJ.to.string(string)
      };
      nsRet = {
        array: [],
        delimited: function() {
          return nsRet.array.join(nsInternal.delimiter);
        },
        string: function(delimiter) {
          var ret;
          delimiter = delimiter || nsInternal.delimiter;
          ret = "";
          OJ.each(nsRet.array, function(val) {
            if (ret.length > 0) {
              ret += delimiter;
            }
            ret += val;
          });
          return ret;
        },
        toString: function() {
          return nsRet.string();
        },
        add: function(str) {
          nsRet.array.push(nsInternal.parse(str));
          nsInternal.deleteDuplicates();
          return nsRet;
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
          nsRet.array = remove(nsRet.array);
          return nsRet;
        },
        count: function() {
          return nsRet.array.length;
        },
        contains: function(str, caseSensitive) {
          var isCaseSensitive, match;
          isCaseSensitive = OJ.to.bool(caseSensitive);
          str = OJ.string(str).trim();
          if (false === isCaseSensitive) {
            str = str.toLowerCase();
          }
          match = nsRet.array.filter(function(matStr) {
            return (isCaseSensitive && OJ.to.string(matStr).trim() === str) || OJ.to.string(matStr).trim().toLowerCase() === str;
          });
          return match.length > 0;
        },
        each: function(callBack) {
          return nsRet.array.forEach(callBack);
        }
      };
      nsInternal.parse = function(str) {
        var ret;
        ret = OJ.to.string(str);
        if (nsInternal.newLineToDelimiter) {
          while (ret.indexOf("\n") !== -1) {
            ret = ret.replace(/\n/g, nsInternal.delimiter);
          }
        }
        if (nsInternal.spaceToDelimiter) {
          while (ret.indexOf(" ") !== -1) {
            ret = ret.replace(RegExp(" ", "g"), nsInternal.delimiter);
          }
        }
        while (ret.indexOf(",,") !== -1) {
          ret = ret.replace(/,,/g, nsInternal.delimiter);
        }
        return ret;
      };
      nsInternal.deleteDuplicates = function() {
        if (nsInternal.removeDuplicates) {
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
            nsRet.array = unique(nsRet.array);
          })();
        }
      };
      (function(a) {
        var delimitedString;
        if (a.length > 1 && false === OJ.is.plainObject(opts)) {
          OJ.each(a, function(val) {
            if (false === OJ.is.nullOrEmpty(val)) {
              nsRet.array.push(val);
            }
          });
        } else if (string && string.length > 0) {
          OJ.extend(nsInternal, opts);
          delimitedString = nsInternal.parse(string);
          nsInternal.initString = delimitedString;
          nsRet.array = delimitedString.split(nsInternal.delimiter);
        }
        nsInternal.deleteDuplicates();
      })(arguments_);
      return nsRet;
    });
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

}).call(this);

(function() {
  (function(OJ) {
    OJ.to.register("bool", function(str) {
      var retBool;
      retBool = OJ.is["true"](str);
      if (retBool === false || retBool !== true) {
        retBool = false;
      }
      return retBool;
    });
    OJ.to.register("ES5_ToBool", function(val) {
      return val !== false && val !== 0 && val !== "" && val !== null && val !== undefined && (typeof val !== "number" || !isNaN(val));
    });
    OJ.to.register("dateFromTicks", function(tickStr) {
      var arr, localOffset, offset, ret, ticks, ticsDateTime;
      ticsDateTime = OJ.string(tickStr);
      ret = void 0;
      ticks = void 0;
      offset = void 0;
      localOffset = void 0;
      arr = void 0;
      if (false === OJ.is.nullOrEmpty(ticsDateTime)) {
        ticsDateTime = ticsDateTime.replace("/", "");
        ticsDateTime = ticsDateTime.replace("Date", "");
        ticsDateTime = ticsDateTime.replace("(", "");
        ticsDateTime = ticsDateTime.replace(")", "");
        arr = ticsDateTime.split("-");
        if (arr.length > 1) {
          ticks = OJ.number(arr[0]);
          offset = OJ.number(arr[1]);
          localOffset = new Date().getTimezoneOffset();
          ret = new Date(ticks - ((localOffset + (offset / 100 * 60)) * 1000));
        } else if (arr.length === 1) {
          ticks = OJ.number(arr[0]);
          ret = new Date(ticks);
        }
      }
      return ret;
    });
    OJ.to.register("binary", function(obj) {
      var ret;
      ret = NaN;
      if (obj === 0 || obj === "0" || obj === "" || obj === false || OJ.to.string(obj).toLowerCase().trim() === "false") {
        ret = 0;
      } else {
        if (obj === 1 || obj === "1" || obj === true || OJ.to.string(obj).toLowerCase().trim() === "true") {
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
    OJ.to.register("number", function(inputNum, defaultNum) {
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
    OJ.to.register("string", function(inputStr, defaultStr) {
      var ret1, ret2, retVal, tryGetString;
      tryGetString = function(str) {
        var ret;
        ret = void 0;
        if (OJ.is.string(str)) {
          ret = str;
        } else {
          ret = "";
          if (OJ.is.bool(str) || OJ.is.number(str) || OJ.is.date(str)) {
            ret = str.toString();
          }
        }
        return ret;
      };
      ret1 = tryGetString(inputStr);
      ret2 = tryGetString(defaultStr);
      retVal = "";
      if (ret1.length !== 0) {
        retVal = ret1;
      } else if (ret1 === ret2 || ret2.length === 0) {
        retVal = ret1;
      } else {
        retVal = ret2;
      }
      return retVal;
    });
    OJ.to.register("vendorDomObject", function(id) {
      var base, ret, _$el;
      ret = null;
      base = "#";
      if (id === "body") {
        base = "";
      }
      _$el = OJ["?"](base + id);
      if (_$el) {
        ret = _$el;
      }
      return ret;
    });
    OJ.to.register("vendorDomObjFromString", function(html) {
      var ret, _$el;
      ret = null;
      _$el = OJ["?"](html);
      if (_$el) {
        ret = _$el;
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var cacheDbMgr, cacheExists, getCachedResponse, makeCachedCall, setCachedWebResponse, thisUserName, validate;
    cacheDbMgr = null;
    thisUserName = '';

    /*
    All paramaters are required
     */
    validate = function(userName, webServiceName) {
      thisUserName = userName || thisUserName;
      if (!thisUserName) {
        throw new Error('User Name is required.');
      }
      if (!webServiceName) {
        throw new Error('Web Service Name is required.');
      }
    };

    /*
    Make a cached call for insert
     */
    makeCachedCall = function(webServiceName, data) {
      return {
        message: {
          dateTime: new Date(),
          cache: {
            userName: thisUserName,
            webServiceName: webServiceName
          },
          data: data
        }
      };
    };
    getCachedResponse = function(webServiceName, userName) {
      var deferred, promise, ret;
      deferred = Q.defer();
      ret = void 0;
      userName = userName || thisUserName;
      if (null === cacheDbMgr) {
        deferred.resolve(OJ.object());
        ret = deferred.promise;
      } else {
        validate(userName, webServiceName);
        promise = cacheDbMgr.select.from('CachedData', 'uniqueCalls', [webServiceName, thisUserName]);
        ret = promise.then(function(data) {
          if (data && data.length > 0) {
            return data[0].data;
          }
        });
      }
      return ret;
    };
    OJ.register('getCachedResponse', getCachedResponse);
    setCachedWebResponse = function(webServiceName, data, customerId, userName) {
      var deferred, ret;
      deferred = Q.defer();
      customerId = customerId || thisCustomerId;
      userName = userName || thisUserName;
      ret = void 0;
      if (null === cacheDbMgr) {
        deferred.resolve(OJ.object());
        ret = deferred.promise;
      } else {
        validate(customerId, userName, webServiceName);
        ret = cacheDbMgr.update('CachedData', 'uniqueCalls', [webServiceName, thisUserName, thisCustomerId], {
          data: data
        });
        ret.then(function(updatedRows) {
          var cachedCall;
          if (!updatedRows || updatedRows.length === 0) {
            cachedCall = makeCachedCall(webServiceName, data);
            return cacheDbMgr.insert('CachedData', cachedCall);
          }
        });
      }
      return ret;
    };
    OJ.register('setCachedWebResponse', setCachedWebResponse);
    cacheExists = function() {
      return cacheDbMgr !== undefined;
    };
    OJ.register('cacheExists', cacheExists);
    OJ.register('initDb', function(userName) {
      if (userName == null) {
        userName = 'offline';
      }
      thisUserName = userName;
      if (window.Modernizr.indexeddb) {
        cacheDbMgr = OJ.db.dbManager('ojdb', 1);
        cacheDbMgr.ddl.createTable('CachedData', 'CachedDataId', true);
        cacheDbMgr.ddl.createIndex('CachedData', 'dateTimeId', 'dateTime');
        cacheDbMgr.ddl.createIndex('CachedData', 'userNameId', 'cache.userName');
        cacheDbMgr.ddl.createIndex('CachedData', 'webServiceNameId', 'cache.webServiceName');
        cacheDbMgr.ddl.createIndex('CachedData', 'uniqueCalls', ['cache.webServiceName', 'cache.userName'], true);
      }
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var dbManager;
    dbManager = function(name, version) {
      var connect, disconnect, isNewConnectionRequired, ret, schemaScripts, select;
      ret = OJ.object();
      ret.add('promises', OJ.object());
      isNewConnectionRequired = false;
      schemaScripts = [];
      connect = function(dbName, dbVersion, dbOnUpgrade) {
        var deferred, request;
        isNewConnectionRequired = !ret.promises.connect || dbName !== name || dbVersion !== version;
        if (isNewConnectionRequired) {
          deferred = Q.defer();
          ret.promises.connect = deferred.promise;
          version = dbVersion || 1;
          name = dbName;
          dbOnUpgrade = dbOnUpgrade || function() {};
          request = window.indexedDB.open(name, version);
          request.onblocked = function(event) {
            ret.IDB.close();
            alert('A new version of this page is ready. Please reload!');
          };
          request.onerror = function(event) {
            deferred.reject(new Error('Database error: ' + event.target.errorCode));
            if (ret.IDB) {
              ret.IDB.close();
            }
          };
          request.onsuccess = function(event) {
            ret.IDB = ret.IDB || request.result;
            deferred.resolve(ret.IDB);
          };
          request.onupgradeneeded = function(event) {
            ret.IDB = ret.IDB || request.result;
            if (schemaScripts.length > 0) {
              OJ.each(schemaScripts, function(script) {
                script(ret.IDB);
              });
            }
            dbOnUpgrade(ret.IDB);
          };
        }
        return ret.promises.connect;
      };
      disconnect = function() {
        if (ret.promises.connect.isFulfilled()) {
          ret.IDB.close();
        } else {
          if (ret.IDB) {
            ret.promises.connect.done(ret.IDB.close);
          }
        }
      };
      ret.add('connect', connect);
      ret.add('disconnect', disconnect);
      ret.add('getDb', function() {
        return ret.IDB;
      });
      ret.add('schemaScripts', schemaScripts);
      ret.add('tables', OJ.object());
      ret.add('ddl', {
        createTable: function(tableName, tablePkColumnName, autoIncrement) {
          return OJ.fun.shiftRight(OJ.db.table.create, ret, arguments, this);
        },
        dropTable: function(tableName) {
          return OJ.fun.shiftRight(OJ.db.index.drop, ret, arguments, this);
        },
        createIndex: function(tableName, columnName, indexName, isUnique) {
          return OJ.fun.shiftRight(OJ.db.index.create, ret, arguments, this);
        }
      });
      ret.add('insert', function() {
        return OJ.fun.shiftRight(OJ.db.insert, ret, arguments, this);
      });
      ret.add('update', function() {
        return OJ.fun.shiftRight(OJ.db.update, ret, arguments, this);
      });
      select = OJ.object();
      ret.add('select', select);
      select.add('all', function() {
        return OJ.fun.shiftRight(OJ.db.select.all, ret, arguments, this);
      });
      select.add('from', function() {
        return OJ.fun.shiftRight(OJ.db.select.from, ret, arguments, this);
      });
      ret.connect(name, version);
      return ret;
    };
    OJ.db.register('dbManager', dbManager);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var createIndex, createIndexImpl;
    OJ.db.makeSubNameSpace('index');
    createIndexImpl = function(dbManager, tableName, columnName, indexName, isUnique) {
      var table;
      table = dbManager.tables[tableName];
      return table.createIndex(columnName, indexName || columnName + 'Idx', {
        unique: true === isUnique
      });
    };
    createIndex = function(dbManager, tableName, columnName, indexName, isUnique) {
      var deferred;
      deferred = Q.defer();
      dbManager.schemaScripts.push(function() {
        var e, index;
        try {
          index = createIndexImpl(dbManager, tableName, columnName, indexName, isUnique);
          deferred.resolve(index);
        } catch (_error) {
          e = _error;
          console.log(e, e.stack);
          deferred.reject(new Error('Could not create a new index', e));
        }
        return dbManager.tables[tableName];
      });
      return deferred.promise;
    };
    OJ.db.index.register('create', createIndex);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var insert, insertImpl, onError;
    onError = function(eventObj) {
      OJ.debug.error(eventObj.target.error);
      return new Error(eventObj.target.error);
    };
    insertImpl = function(dbManager, tableName, records) {
      var deferred, doInsert;
      deferred = Q.defer();
      doInsert = function() {
        var e, objectStore, transaction;
        try {
          transaction = dbManager.getDb().transaction([tableName], "readwrite");
          objectStore = transaction.objectStore(tableName);
          OJ.each(records, function(rec) {
            objectStore.add(rec);
          });
        } catch (_error) {
          e = _error;
          console.log(e, e.stack);
          deferred.reject(new Error("Could not insert records", e));
        }
        return deferred.resolve(true);
      };
      dbManager.promises.connect.then(doInsert, function() {
        deferred.reject();
      });
      return deferred.promise;
    };
    insert = function(dbWrapper, tableName, records) {
      return insertImpl(dbWrapper, tableName, records);
    };
    OJ.db.register("insert", insert);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var onError, selectAll, selectAllImpl, selectFrom, selectFromImpl;
    OJ.db.makeSubNameSpace('select');
    onError = function(eventObj) {
      OJ.debug.error(eventObj.target.error);
      return new Error(eventObj.target.error);
    };
    selectAllImpl = function(dbManager, tableName, ret) {
      var deferred, doSelect;
      deferred = Q.defer();
      doSelect = function() {
        var e, objectStore, selRequest, transaction;
        try {
          transaction = dbManager.getDb().transaction([tableName]);
          objectStore = transaction.objectStore(tableName);
          ret = ret || [];
          selRequest = objectStore.openCursor();
          selRequest.onsuccess = function(event) {
            var cursor;
            cursor = event.target.result;
            if (cursor) {
              ret.push(cursor.value);
              cursor['continue']();
            } else {
              deferred.resolve(ret);
            }
          };
          selRequest.onerror = function(eventObj) {
            deferred.reject(onError(eventObj));
          };
        } catch (_error) {
          e = _error;
          console.log(e, e.stack);
          deferred.reject(new Error('Could not select records', e));
        }
        return deferred.promise;
      };
      dbManager.promises.connect.then(doSelect, function() {
        deferred.reject();
      });
      return deferred.promise;
    };
    selectAll = function(dbWrapper, tableName) {
      var promise, ret;
      ret = [];
      promise = selectAllImpl(dbWrapper, tableName, ret);
      promise['return'] = ret;
      return promise;
    };
    OJ.db.select.register('all', selectAll);
    selectFromImpl = function(dbManager, tableName, indexName, indexVal, ret) {
      var deferred, doSelect;
      deferred = Q.defer();
      doSelect = function() {
        var e, index, keyRange, objectStore, selRequest, transaction;
        try {
          transaction = dbManager.getDb().transaction([tableName]);
          objectStore = transaction.objectStore(tableName);
          index = objectStore.index(indexName);
          ret = ret || [];
          keyRange = void 0;
          if (indexVal) {
            keyRange = IDBKeyRange.only(indexVal);
          }
          selRequest = index.openCursor(keyRange);
          selRequest.onsuccess = function(event) {
            var cursor;
            cursor = event.target.result;
            if (cursor) {
              ret.push(cursor.value);
              cursor['continue']();
            } else {
              deferred.resolve(ret);
            }
          };
          selRequest.onerror = function(eventObj) {
            deferred.reject(onError(eventObj));
          };
        } catch (_error) {
          e = _error;
          console.log(e, e.stack);
          deferred.reject(new Error('Could not select records', e));
        }
        return deferred.promise;
      };
      dbManager.promises.connect.then(doSelect, function() {
        deferred.reject();
      });
      return deferred.promise;
    };
    OJ.db.select.register('from', selectFrom = function(dbWrapper, tableName, indexName, indexVal) {
      var promise, ret;
      ret = [];
      promise = selectFromImpl(dbWrapper, tableName, indexName, indexVal, ret);
      promise['return'] = ret;
      return promise;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function(OJ) {
    'use strict';
    var createTable, createTableImpl, dropTable, dropTableImpl;
    OJ.db.makeSubNameSpace('table');
    createTableImpl = function(deferred, dbManager, tableName, tablePkColumnName, autoIncrement) {

      /*
      @param db {IDBDatabase} An IDBDatabase instance
       */
      dbManager.schemaScripts.push(function(db) {
        var e, table;
        try {
          table = db.createObjectStore(tableName, {
            keyPath: tablePkColumnName,
            autoIncrement: false !== autoIncrement
          });
          dbManager.tables.add(tableName, table);
          deferred.resolve(table);
        } catch (_error) {
          e = _error;
          console.log(e, e.stack);
          deferred.reject(new Error("Could not create a new table", e));
        }
        return dbManager.tables[tableName];
      });
      return deferred.promise;
    };
    createTable = function(dbManager, tableName, tablePkColumnName, autoIncrement) {
      var deferred;
      deferred = Q.defer();
      return createTableImpl(deferred, dbManager, tableName, tablePkColumnName, autoIncrement);
    };
    OJ.db.table.register("create", createTable);
    dropTableImpl = function(deferred, dbManager, tableName) {

      /*
      @param db {IDBDatabase} An IDBDatabase instance
       */
      dbManager.schemaScripts.push(function(db) {
        var e;
        try {
          db.deleteObjectStore(tableName);
          delete dbManager.schema[tableName];
          deferred.resolve();
        } catch (_error) {
          e = _error;
          console.log(e, e.stack);
          deferred.reject(new Error("Could not create a new table", e));
        }
        return true;
      });
      return deferred.promise;
    };
    dropTable = function(dbManager, tableName) {
      var deferred;
      deferred = Q.defer();
      return dropTableImpl(deferred, dbManager, tableName);
    };
    OJ.db.table.register("drop", dropTable);
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);

(function() {
  (function() {
    'use strict';
    var onError, update, updateImpl;
    onError = function(eventObj) {
      OJ.debug.error(eventObj.target.error);
      return new Error(eventObj.target.error);
    };
    updateImpl = function(dbManager, tableName, indexName, indexVal, ret, record) {
      var deferred, doUpdate;
      deferred = Q.defer();
      doUpdate = function() {
        var e, index, keyRange, objectStore, selRequest, transaction;
        try {
          transaction = dbManager.getDb().transaction([tableName], "readwrite");
          objectStore = transaction.objectStore(tableName);
          index = objectStore.index(indexName);
          ret = ret || [];
          keyRange = IDBKeyRange.only(indexVal);
          selRequest = index.openCursor(keyRange);
          selRequest.onsuccess = function(event) {
            var cursor, newRec, updtRequest, val;
            cursor = event.target.result;
            if (cursor) {
              val = cursor.value;
              newRec = OJ.extend(val, record);
              updtRequest = cursor.update(newRec);
              updtRequest.onerror = onError;
            } else {
              deferred.resolve(ret);
            }
          };
          selRequest.onerror = function(e) {
            deferred.reject(onError(e));
          };
        } catch (_error) {
          e = _error;
          console.log(e, e.stack);
          deferred.reject(new Error("Could not select records", e));
        }
        return deferred.promise;
      };
      dbManager.promises.connect.then(doUpdate, function() {
        deferred.reject();
      });
      return deferred.promise;
    };
    OJ.db.register("update", update = function(dbWrapper, tableName, indexName, indexVal, record) {
      var ret;
      ret = [];
      return updateImpl(dbWrapper, tableName, indexName, indexVal, ret, record);
    });
  })();

}).call(this);

(function() {
  (function(OJ) {
    var assert, console, count, length, method, methods, noop, thisGlobal;
    method = void 0;
    noop = function() {};
    methods = ["assert", "clear", "count", "debug", "dir", "dirxml", "error", "exception", "group", "groupCollapsed", "groupEnd", "info", "log", "markTimeline", "profile", "profileEnd", "table", "time", "timeEnd", "timeStamp", "trace", "warn"];
    length = methods.length;
    thisGlobal = (typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this);
    console = (thisGlobal.console = thisGlobal.console || {});
    while (length--) {
      method = methods[length];
      if (!console[method]) {
        console[method] = noop;
      }
    }
    OJ.makeSubNameSpace("console");
    OJ.console.register("assert", assert = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.assert(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("count", count = function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.count(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("error", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.error(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("group", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.group(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("groupCollapsed", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.groupCollapsed(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("groupEnd", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.groupEnd(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("info", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.info(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("log", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.log(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("profile", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.profile(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("profileEnd", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.profileEnd(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("table", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.table(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("time", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.time(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("timeEnd", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.timeEnd(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("trace", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.trace(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
    OJ.console.register("warn", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
      'use strict';
      console.warn(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p);
    });
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

}).call(this);

(function() {
  (function(OJ) {

    /*
    Create a new object with constant properties..
    @param props {Object} an object represent the enun members
     */
    var Constant;
    Constant = function(props) {
      var keys, that;
      that = null;
      keys = [];
      if (props) {
        that = this;

        /*
        Assert that the provided key is a member of the enum
        @param key {String} enum property name
         */
        OJ.property(that, "has", function(key) {
          return keys.indexOf(key) !== -1;
        });
        OJ.each(props, function(propVal, propName) {
          keys.push(propVal);
          Object.defineProperty(that, propName, {
            value: propVal
          });
        });
      }
      return that;
    };

    /*
    Create a new enum on the constants namespace.
    Enums are objects consisting of read-only, non-configurable, non-enumerable properties.
    @param name {String} the name of the enum
    @param props {Object} the properties of the enum
     */
    OJ.register("constant", function(OJ, name, props) {
      var ret;
      ret = new Constant(props);
      OJ = OJ || OJ;
      if (ret && OJ.constants && OJ.constants.register && name) {
        OJ.constants.register(name, ret);
        Object.seal(ret);
        Object.freeze(ret);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

}).call(this);

(function() {
  (function(OJ) {

    /*
    True if the object is a true Object or Array
    @param obj {Object}
     */
    var canEach, each;
    canEach = function(obj) {
      return (_.isPlainObject(obj)) || _.isArray(obj);
    };

    /*
    Iterate an object with optional callBack and recursion
    @param obj {Object} an Object to iterate
    @param onEach {Function} [onEach=undefined] call back to exec
    @param recursive {Boolean} if true, recurse the object
     */
    each = function(obj, onEach, recursive) {
      if (canEach(obj)) {
        _.forEach(obj, function(val, key) {
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
    OJ.register("each", each);
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

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
        return OJ.property(obj, name, val);
      };
      return obj;
    };
    OJ.register('object', object);
    OJ.register('isInstanceOf', function(name, obj) {
      return OJ.contains(name, obj) && OJ.bool(obj[name]);
    });
    OJ.register('contains', function(object, index) {
      var ret;
      ret = false;
      if (false === OJ.isNullOrUndefined(object)) {
        if (OJ.isArray(object)) {
          ret = object.indexOf(index) !== -1;
        }
        if (false === ret && object.hasOwnProperty(index)) {
          ret = true;
        }
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
      ret = '';
      delimiter = delimiter || '&';
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
      return OJ.string(ret);
    });
    OJ.register('extend', function(destObj, srcObj, deepCopy) {
      var ret;
      ret = destObj || {};
      if (arguments.length === 3) {
        ret = $.extend(OJ.bool(deepCopy), ret, srcObj);
      } else {
        ret = $.extend(ret, srcObj);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var from, query, run, select;
    select = function() {
      var args, query, slice;
      query = this;
      slice = Array.prototype.slice;
      args = slice.call(arguments_, 0);
      query.columns = query.columns || [];
      OJ.each(args, function(argumentValue) {
        query.columns.push(argumentValue);
      });
      return query;
    };
    run = function() {
      var firstResult, query, results, ret, returnRows;
      query = this;
      ret = [];
      if (query.columns.length > 0) {
        results = [];
        OJ.each(query.columns, function(columnName) {
          OJ.each(query.tables, (function(tbl) {
            var res, val;
            if (Array.isArray(tbl)) {
              res = {};
              val = tbl._select(function(val) {
                return val[columnName];
              });
              if (val) {
                res[columnName] = val;
                results.push(res);
              }
            }
          }), true);
        });
        returnRows = [];
        if (results && results.length > 0) {
          firstResult = results[0];
          OJ.each(firstResult, (function(val, key) {
            OJ.each(val, (function(cell) {
              var row;
              row = {};
              row[key] = cell;
              OJ.each(results.slice(1), (function(result) {
                OJ.each(result, (function(v, k) {
                  OJ.each(v, function(c) {
                    row[k] = c;
                  });
                }), true);
              }), true);
              returnRows.push(row);
            }), true);
          }), true);
        }
      }
      return returnRows;
    };
    from = function(array) {
      var query;
      query = this;
      query.tables.push(array);
      return query;
    };
    Object.defineProperties(Array.prototype, {
      _where: {
        value: function(func) {
          return OJ.filter(func, this);
        }
      },
      _select: {
        value: function(func) {
          return OJ.map(func, this);
        }
      }
    });
    query = function(array) {
      var tables, _query;
      tables = [];
      tables.push(array);
      _query = {
        tables: tables,
        from: from,
        select: select,
        run: run
      };
      return _query;
    };
    OJ.register("objectSql", query);
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

}).call(this);

(function() {
  (function(OJ) {

    /*
    Add a property to an object
    @param obj {Object} an Object onto which to add a property
    @param name {String} the property name
    @param value {Object} the value of the property. Can be any type.
    @param writable {Boolean} [writable=true] True if the property can be modified
    @param configurable {Boolean} [configurable=true] True if the property can be removed
    @param enumerable {Boolean} [enumerable=true] True if the property can be enumerated and is listed in Object.keys
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
  })((typeof global !== 'undefined' && global ? global : typeof window !== 'undefined' ? window : this).OJ);

}).call(this);

(function() {
  (function(OJ) {
    var inheritsFrom, onError, thisGlobal;
    thisGlobal = (typeof global !== 'undefined' && global ? global : (typeof thisGlobal !== 'undefined' ? thisGlobal : this));
    onError = thisGlobal.onerror;

    /*
    Log errors to the console
     */
    thisGlobal.onerror = function(msg, url, lineNumber) {
      console.warn("%s\rurl: %s\rline: %d", msg, url, lineNumber);
      if (onError) {
        onError(arguments);
      }
      return false;
    };
    if (!thisGlobal.setImmediate) {

      /*
      Shim for setImmediate
       */
      thisGlobal.setImmediate = function(func, args) {
        return thisGlobal.setTimeout(func, 0, args);
      };
      thisGlobal.clearImmediate = thisGlobal.clearTimeout;
    }
    if (!Function.prototype.inheritsFrom) {
      Object.defineProperties(Function.prototype, {
        inheritsFrom: {

          /*
          Easy inheritance by prototype
           */
          value: inheritsFrom = function(parentClassOrObject) {
            if (parentClassOrObject.constructor === Function) {
              this.prototype = new parentClassOrObject;
              this.prototype.constructor = this;
              this.prototype.parent = parentClassOrObject.prototype;
            } else {
              this.prototype = parentClassOrObject;
              this.prototype.constructor = this;
              this.prototype.parent = parentClassOrObject;
            }
            return this;
          }
        }
      });
    }
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

(function() {
  var __slice = [].slice;

  (function(OJ) {
    'use strict';
    OJ.nodes.register('a', function(options, owner, calledFromFactory) {
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
          href: '#',
          type: '',
          title: '',
          rel: '',
          media: '',
          target: ''
        },
        styles: {},
        events: {
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
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
      if (defaults.events.click !== _.noop) {
        click = defaults.events.click;
        newClick = function() {
          var event, ret;
          event = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          toggle;
          ret = click.apply(null, event);
          if (defaults.href === '#') {
            return false;
          } else {
            return retval;
          }
        };
        defaults.events.click = newClick;
      } else {
        defaults.events.click = toggle;
      }
      ret = OJ.element('a', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('br', function(options, owner, calledFromFactory) {
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
          click: _.noop
        },
        number: 1
      };
      OJ.extend(defaults, options);
      while (i < OJ.number(defaults.number)) {
        ret = OJ.element('br', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('button', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('button', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('div', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('div', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('fieldset', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('fieldset', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('form', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('form', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('img', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('img', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('input', function(options, owner, calledFromFactory) {
      var change, click, defaults, newChange, newClick, ret, syncValue, value;
      if (owner == null) {
        owner = OJ.body;
      }
      if (calledFromFactory == null) {
        calledFromFactory = false;
      }
      defaults = {
        props: {
          type: OJ.enums.inputTypes.text,
          placeholder: "",
          value: "",
          size: "",
          maxlength: "",
          autofocus: false,
          autocomplete: "on",
          checked: false
        },
        styles: {},
        events: {
          click: _.noop,
          change: _.noop,
          keyenter: _.noop,
          keyup: _.noop
        }
      };
      OJ.extend(defaults, options);
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
      if (defaults.events.click !== _.noop) {
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
      if (defaults.events.change !== _.noop) {
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
      ret = OJ.element('input', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('label', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('label', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('legend', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('legend', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('li', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('li', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('ol', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('ol', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('option', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('option', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('p', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('p', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('select', function(options, owner, calledFromFactory) {
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
          click: _.noop,
          change: _.noop
        }
      };
      OJ.extend(defaults, options);
      value = '';
      values = [];
      hasEmpty = false;
      syncValue = function() {
        return value = ret.val();
      };
      if (defaults.events.click !== _.noop) {
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
      if (defaults.events.change !== _.noop) {
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
      ret = OJ.element('select', defaults.props, defaults.styles, defaults.events);
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
            props: {
              value: value,
              text: text,
              selected: selected,
              disabled: disabled
            }
          };
          option = ret.option(val);
          option.text(text);
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
    OJ.nodes.register('span', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('span', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('svg', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('svg', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('table', function(options, owner, calledFromFactory) {
      var cells, defaults, init, ret, rows, tbody;
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
          align: "",
          width: "",
          cellalign: "left",
          cellvalign: "top"
        },
        styles: {},
        events: {
          click: _.noop
        },
        cells: {
          "class": "",
          align: '',
          'vertical-align': '',
          cellpadding: '',
          margin: ''
        },
        firstAlignRight: false,
        oddAlignRight: false
      };
      rows = [];
      cells = {};
      OJ.extend(defaults, options);
      ret = OJ.element('table', defaults.props, defaults.styles, defaults.events);
      tbody = null;
      init = _.once(function() {
        tbody = OJ.nodes.tbody({}, ret, false);
        rows.push(OJ.nodes.tr({}, tbody, false));
      });
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
    OJ.nodes.register('tbody', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('tbody', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('td', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('td', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('textarea', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
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
      if (defaults.events.click !== _.noop) {
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
      if (defaults.events.change !== _.noop) {
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
      ret = OJ.element('textarea', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('tr', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('tr', defaults.props, defaults.styles, defaults.events);
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
    OJ.nodes.register('ul', function(options, owner, calledFromFactory) {
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
          click: _.noop
        }
      };
      OJ.extend(defaults, options);
      ret = OJ.element('ul', defaults.props, defaults.styles, defaults.events);
      if (false === calledFromFactory) {
        OJ.nodes.factory(ret, owner);
      }
      return ret;
    });
  })((typeof global !== 'undefined' && global ? global : (typeof window !== 'undefined' ? window : this)).OJ);

}).call(this);
