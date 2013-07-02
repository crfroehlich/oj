### Welcome to OJ.
OJ(S) (OJ.js || OpenJS || Orange Julius || whatever you like) is a framework upon which to build web applications in pure (sometimes functional) JavaScript. Currently, it's packaged for Node. So, either download:

```
$ cd ojs
$ npm install
$ grunt build
```

or install from npm

```
$ npm install ojs
$ grunt build
```

There are more than a few TODOs before OJ will deliver anything useful, but this is the core of the vision:

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

In OJ, this is not possible. Node lookups by ID are possible, but it better to chain in memory:

```
$ var myHolaDiv = OJ.node.make('myHolaDiv');
$ myHolaDiv.div({ value: 'Leaving...' });
$ myHolaDiv.div({ value: 'Leaving......' });
$ myHolaDiv.div({ value: 'Gone' });
```

This is not a fault of frameworks like jQuery (in fact jQuery is currently a hard requirement of OJ), but it is different. I think the OJ style is more consistent with the Promise pattern in that it frees you from having to worry about low level details; but that is the opinion of this framework.

###State of the Project

The Dream: Basic HTML and CSS are fully encapsulated in strongly validated OJ classes. Complex forms, layouts and composites are abstracted into thin OJ classes which are extensible with mixins. Entire workflows are simplified into OJ structures which can be defined with just a few lines (or so) of JavaScript code. Layouts are configurable simply by clicking and dragging the form. Validation and data binding come for free.

The Reality: Some of the most complex work has already been done. The SQL Builder demo is complete, minus actual AJAX requests. A fully fledged wrapper around IndexedDb is in place. Objects are queryable using SQL-like semantics. Raw DOM nodes are wrapped and ready. Much has been done, but much more still remains to do.

### TODO Priority 1
The core factory class is in place, but only SPAN and DIV have been implemented. TABLE is next, followed by INPUT (which will immediately spawn a factory subclass to handle input type: radio, checkbox, etc). SELECT (with child class OPTION) will be followed by the rest of the classic DOM Nodes.

### TODO Priority 2
A secondary factory will need to implement components. There's still some implementation specing to do on how to distinguish between abstract components (e.g. an array of checkboxes) vs. concrete controls (e.g. an Address composite).

### TODO Priority 3
A FORM factory is on the table, so to speak. Additional specification work is needed to define a data structure which can be implicitly cast into an OJ form, generating an ordered layout of controls and to facilitate real time data.

### Support or Contact
Feel like contributing? Wondering what in the sam hill I'm thinking? Challenge me to a duel; fork me; contact me; ignore me. Collaborate in real time [in my IDE of choice] (https://c9.io/somecallmechief/oj). 

### Licensing
Everything I write is always Public Domain. Please take generously. 