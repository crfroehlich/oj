## Welcome to OJ.
OJ(S) (OJ.js || OpenJS || Orange Julius || whatever you like) is a framework upon which to build web applications in pure (sometimes functional) JavaScript. Currently, it's packaged for Node. But you can clone or install from Git as you see fit.

* NPM install from Git: `npm install git://github.com/somecallmechief/oj.git`
* From NPM last stable `npm install ojs`
* Clone from Git `git clone git@github.com:somecallmechief/oj.git`
* Finally: `grunt build`

There are more than a few TODOs before OJ will fully deliver on its promise, but this is the API at the core of the vision:

```
$ var div =  OJ.node.make('body').div({ value: 'Aloha! Ahoy! Hola! Prevet!' });
$ div.table().row(1).column(1).span({ text: 'Ahoy, column 1, row 1!' });
$ ...
$ div.loginDialog({ pass: init, fail: div.loginDialog });
```

###Semantics

By design, OJ handles the generation of unique element IDs for every DOM node automatically under the hood. This provides faster lookups in the internal API and encourages you to reference nodes in memory as opposed to relying on "truth in DOM". For example, while you might write something like the following in jQuery:

```
$ jQuery('myHolaDiv').append('<div>Leaving...</div>');
$ jQuery('myHolaDiv').append('<div>Leaving......</div>');
$ jQuery('myHolaDiv').append('<div>Gone</div>');
```

In OJ, this is not possible. Node lookups by ID are possible (if you maintain a reference to the ID), but it is usually better to chain in memory, preserving a reference to the object:

```
$ var myHolaDiv = OJ.node.make('myHolaDiv');
$ myHolaDiv.div({ value: 'Leaving...' });
$ myHolaDiv.div({ value: 'Leaving......' });
$ myHolaDiv.div({ value: 'Gone' });
```

This is not a fault of frameworks like jQuery (in fact jQuery is currently a hard requirement of OJ), but it is different way of managing instances of objects. In jQuery every node wrapper is a generic DOM node with the same sets of properties and methods as every other DOM node. In OJ, every node wrapper represents a specific type of DOM node (e.g. DIV, SPAN, TABLE) with a subset of the generic utility methods that you might get from the jQuery API but also a highly constrained, strongly validated superset of methods that are specific to the type of the node. For example, nothing (apart from reason) prevents one from writing this in jQuery:

```
$ var table = $('<table></table>');
$ var div = $('<div><d/iv>');
table.append(div);
```

In OJ, the div method does not exist on the table class and thus will generate an exception:

```
$ var table = OJ.nodes.table();
table.div(); //throws new TypeError: Object [object global] has no method 'div'
```

This does come at the cost of a learning curve, but the exceptions that OJ will generate for you are intended to ferret out mistakes that will never make their way into Production code. While still runtime exceptions, you will see these immediately--the first time you run the code or unit tests; and within a very short time will disappear completely. Just as the Promise pattern enables you to write code that doesn't care about the actual order of operations, freeing you to focus only on the sequence of logic, I think OJ enables a style of development free from worrying about the minutia of the DOM in order to focus more on the UI/UX you want to deliver.

##State of the Project

The Dream: Basic HTML and CSS are fully encapsulated in strongly validated OJ classes. Complex forms, layouts and composites are abstracted into thin OJ classes which are extensible with mixins. Entire workflows are simplified into OJ structures which can be defined with just a few lines (or so) of JavaScript code. Layouts are configurable simply by clicking and dragging the form. Validation and data binding come for free.

The Reality: Some of the most complex work has already been done. The SQL Builder demo is complete, minus actual AJAX requests. A fully fledged wrapper around IndexedDb is in place. Objects are queryable using SQL-like semantics. Raw DOM nodes are wrapped and ready. Much has been done, but much more still remains to do.

### TODO Priority 1
The core factory class is in place, but only SPAN and DIV have been implemented. TABLE is next, followed by INPUT (which will immediately spawn a factory subclass to handle input type: radio, checkbox, etc). SELECT (with child class OPTION) will be followed by the rest of the classic DOM Nodes.

### TODO Priority 2
A secondary factory will need to implement components. There's still some implementation specing to do on how to distinguish between abstract components (e.g. an array of checkboxes) vs. concrete controls (e.g. an Address composite).

### TODO Priority 3
A FORM factory is on the table, so to speak. Additional specification work is needed to define a data structure which can be implicitly cast into an OJ form, generating an ordered layout of controls and to facilitate real time data.

## Support or Contact
Feel like contributing? Wondering what in the sam hill I'm thinking? Challenge me to a duel; fork me; contact me; ignore me. Collaborate in real time [in my IDE of choice] (https://c9.io/somecallmechief/oj). 

## Licensing
Everything I write is always Public Domain. Please take generously. 