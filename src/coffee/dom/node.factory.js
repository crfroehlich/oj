(function() {
  (function() {
    var controlPostProcessing, isChildNodeTypeAllowed, nestableNodeNames, nonNestableNodes;

    nestableNodeNames = ["div", "span", "h1", "h2", "h3", "h4", "h5", "h6", "p", "fieldset", "select", "ol", "ul", "table"];
    nonNestableNodes = ["li", "legend", "tr", "td", "option", "body", "head", "source", "tbody", "tfoot", "thead", "link", "script"];
    isChildNodeTypeAllowed = function(parent, tagName) {
      var allowed;

      allowed = false;
      switch (parent.tagName) {
        case "body":
          allowed = _.contains(nestableNodeNames(tagName));
          break;
        case "div":
          allowed = false === _.contains(nonNestableNodes(tagName));
          break;
        case "form":
          allowed = false === _.contains(nonNestableNodes(tagName));
          break;
        case "label":
          allowed = false === _.contains(nonNestableNodes(tagName));
          break;
        case "legend":
          allowed = false;
          break;
        case "fieldset":
          allowed = tagName === "legend" || false === _.contains(nonNestableNodes(tagName));
          break;
        case "ol":
          allowed = tagName === "li";
          break;
        case "ul":
          allowed = tagName === "li";
          break;
        case "li":
          allowed = false === _.contains(nonNestableNodes(tagName));
          break;
        case "table":
          allowed = tagName === "td" || tagName === "tr" || tagName === "tbody";
          break;
        case "td":
          allowed = false === _.contains(nonNestableNodes(tagName));
          break;
        case "select":
          allowed = tagName === "option";
          break;
        case "option":
          allowed = false;
      }
      return allowed;
    };
    controlPostProcessing = function(control) {};
    OJ.nodes.register("factory", function(el, parent, count) {
      var init, ret;

      if (parent == null) {
        parent = OJ.body;
      }
      if (count == null) {
        count = 0;
      }
      init = function(node) {
        var control, id;

        count += 1;
        control = OJ.dom(node, parent);
        id = parent.getId();
        id += control.tagName + count;
        control.attr('id', id);
        controlPostProcessing(control);
        return control;
      };
      ret = init(el);
      /*
      An <a> node
      */

      if (isChildNodeTypeAllowed(el, 'a')) {
        ret.add('a', function(opts) {
          var nu;

          nu = OJ.nodes.a(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <b> node
      */

      if (isChildNodeTypeAllowed(el, 'b')) {
        ret.add('b', function(opts) {
          var nu;

          nu = OJ.nodes.b(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <br> node
      */

      if (isChildNodeTypeAllowed(el, 'br')) {
        ret.add('br', function(opts) {
          var nu;

          nu = OJ.nodes.br(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <button> node
      */

      if (isChildNodeTypeAllowed(el, 'button')) {
        ret.add('button', function(opts) {
          var nu;

          nu = OJ.nodes.button(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <div> node
      */

      if (isChildNodeTypeAllowed(el, 'div')) {
        ret.add('div', function(opts) {
          var nu;

          nu = OJ.nodes.div(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <fieldset> node
      */

      if (isChildNodeTypeAllowed(el, 'fieldset')) {
        ret.add('fieldset', function(opts) {
          var nu;

          nu = OJ.nodes.fieldset(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <form> node
      */

      if (isChildNodeTypeAllowed(el, 'form')) {
        ret.add('form', function(opts) {
          var nu;

          nu = OJ.nodes.form(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      An <img> node
      */

      if (isChildNodeTypeAllowed(el, 'img')) {
        ret.add('img', function(opts) {
          var nu;

          nu = OJ.nodes.img(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      An <input> node
      */

      if (isChildNodeTypeAllowed(el, 'input')) {
        ret.add('input', function(opts) {
          var nu;

          nu = OJ.nodes.input(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <label> node
      */

      if (isChildNodeTypeAllowed(el, 'label')) {
        ret.add('label', function(opts) {
          var nu;

          nu = OJ.nodes.label(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <legend> node
      */

      if (isChildNodeTypeAllowed(el, 'legend')) {
        ret.add('legend', function(opts) {
          var nu;

          nu = OJ.nodes.legend(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <li> node
      */

      if (isChildNodeTypeAllowed(el, 'li')) {
        ret.add('li', function(opts) {
          var nu;

          nu = OJ.nodes.li(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      An <ol> node
      */

      if (isChildNodeTypeAllowed(el, 'ol')) {
        ret.add('ol', function(opts) {
          var nu;

          nu = OJ.nodes.ol(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      An <option> node
      */

      if (isChildNodeTypeAllowed(el, 'option')) {
        ret.add('option', function(opts) {
          var nu;

          nu = OJ.nodes.option(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <p> node
      */

      if (isChildNodeTypeAllowed(el, 'p')) {
        ret.add('p', function(opts) {
          var nu;

          nu = OJ.nodes.p(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <select> node
      */

      if (isChildNodeTypeAllowed(el, 'select')) {
        ret.add('select', function(opts) {
          var nu;

          nu = OJ.nodes.select(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <span> node
      */

      if (isChildNodeTypeAllowed(el, 'span')) {
        ret.add('span', function(opts) {
          var nu;

          nu = OJ.nodes.span(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <svg> node
      */

      if (isChildNodeTypeAllowed(el, 'svg')) {
        ret.add('svg', function(opts) {
          var nu;

          nu = OJ.nodes.svg(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <table> node
      */

      if (isChildNodeTypeAllowed(el, 'table')) {
        ret.add('table', function(opts) {
          var nu;

          nu = OJ.nodes.table(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <textarea> node
      */

      if (isChildNodeTypeAllowed(el, 'textarea')) {
        ret.add('textarea', function(opts) {
          var nu;

          nu = OJ.nodes.textarea(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      /*
      A <ul> node
      */

      if (isChildNodeTypeAllowed(el, 'ul')) {
        ret.add('ul', function(opts) {
          var nu;

          nu = OJ.nodes.ul(opts, el, true);
          return OJ.nodes.factory(nu, el, count);
        });
      }
      return ret;
    });
  })();

}).call(this);
//@ sourceMappingURL=node.factory.js.map