## Welcome to OJ.
OJ(S) (OJ.js || OpenJS || Orange Julius || whatever you like) is a framework upon which to build web applications in pure (sometimes functional) ~~JavaScript~~ CoffeeScript.

OJ is packaged for Node and Bower. Other options abound.
* Bower `bower install --save ojs`
* From NPM last stable `npm install --save ojs`
* Clone from Git `git clone git@github.com:somecallmechief/oj.git`

### Abstract

OJ is written in CoffeeScript. The distribution folder has the complete CS and JS for the project.
The source folder includes only the CoffeeScript. To generate the JavaScript and corresponding Source Map files for each source file, run the `gulp compile` task.
Once compiled, feel free to use OJ in either flavor.
While OJ probably doesn't have a lot of utility in the context of Node, I have made an effort to keep it Node-compatible--although there is absolutely no testing to this effect.

### API

At its heart, OJ provides a simple API to build out the DOM:

```coffee
div = OJ.body.make 'div', text: "Aloha! Ahoy! Hola! Prevet!"
cell11 = div.make 'table'
  .cell 1, 1, text: 'Ahoy, column 1, row 1!'
  .cell 2, 1, text: 'Aloha, column 1, row 2!'
span = cell11.make 'span', text: 'Aloha! Ahoy! Hola! Prevet!'
```

Nearly all standard nodes are accessible via chaining, starting with the body element. Every OJ node is chainable against the entire set of compatible child nodes. For example:

```coffee
div = OJ.body.make 'div'
select = div.make 'select'
  .make 'button' #not terribly rational, but valid semantic
  .make 'option' #more reasonable chained method
  
fieldSet = div.make 'fieldset'
  .make 'legend'
  
ol = div.make 'ol'
  .make 'span' #not a great idea, but entirely possible
  .make 'li' #preferable child node
  .make 'div' #another valid child of li
  .make 'ul' #valid child of div
  .make 'p' #suboptimal but valid
  .make 'li' #valid child of li
```

#### Special Cases

In most cases, the `make` method is your start and end point for chaining node creation. In a few cases, specific classes such as `grid` and `table` provide an additional convenience
method or two to make chaining simpler:

```coffee
table = OJ.body.make 'table' #returns an instance of table
table.cell 1, 1, text: 'Ahoy, column 1, row 1!' #the table.cell method provides a simple abstraction over table.make 'tr' and table.make 'td'
table.make 'tr' #Still valid, creates a new row
  .make 'td' #Still valid, creates a new cell
```

The element table class provides a unique `cell` method which takes in the ordinal position of the cell (row, column) and guarantees that the cell you want is in the correct location.
Further, it guarantees that the table is fully populated.

```coffee
table = OJ.body.make 'table' #returns an instance of table
table.cell 14, 7, text: 'Ahoy, column 7, row 14!' #cell() guarantees that rows 1-13 are created and that each row has at least 7 columns (filled with non-breaking whitespace if absent)
table.cell 14, 12, text: 'Ahoy, column 12, row 14' #cell() now guarantees that all existing rows also have 14 columns (filled with non-breaking whitespace if absent)
```

Likewise, the component grid class provides a unique `tile` method which accomplishes the same effect for Bootstrap grids as `table.cell` does for tables.

```coffee
grid = OJ.body.make 'grid' #returns an instance of grid
grid.tile 2, 1, widths: xs: 12, sm: 6, md: 4 #Guarantees that at least 2 Bootstrap rows exist, each with 1 column
```

#### Components

This simple semantic makes it possible to build more complex web components, which are encapsulated as OJ classes.

```coffee
div.make 'grid' #creates a Bootstrap grid
  .tile 1, 1 #creates row 1, column 1
  .make 'grid' #creates a nested grid on previous tile
  .tile 1, 1 #creates nested row, nested column
```

Components are currently a work in progress, but several functional components include jQuery Sparkline, jQuery Flotchart, and Bootstrap grids.

### Foundation

In order for OJ to scale, it has to be fast. By far, the fastest way to insert nodes into the DOM is by calling `document.createElement` and `someElement.appendChild`. Unfortunately, this is a tedious process to do manually. Rather than revert to anti-patterns like setting innerHTML, OJ leverages the speed of ThinDOM for light, fast, semantically accurate DOM insertion. This does come at a slight cost, but ThinDOM outperforms jQuery insertions by at least an order of magnitude--so it's a logical choice for the core of OJ's DOM manipulation. 

While ThinDOM may be the fastest choice for getting your nodes into the DOM, it doesn't offer the cross-browser support and flexibility of jQuery's API--so for everything else you need to do to your nodes, OJ wraps around jQuery to provide access to all of the `addClass` and `hide` and `on` that you might need.

### Element IDs

By default, OJ does not add element IDs to any of the nodes it creates. This is configurable. If desired, enable element ID creation by setting:

```coffee
OJ['GENERATE_UNIQUE_IDS'] = true
```

If enabled, OJ will generate unique element IDs for every node created. Any element ID is accessible via the `getId` method.

```coffee
divId = div.getId()
```

You are always free to specify your own IDs on node creation (whether or not automatic ID generation is enabled).

```coffee
div = OJ.body.make 'div', props: id: 'myHolaDiv'
```

Regardless, OJ is not optimized for fetching nodes from the DOM, rather it encourages you to reference nodes in memory as opposed to relying on "truth in DOM". 
For example, while you might write something like the following in jQuery:

```coffee
jQuery '#myHolaDiv'
  .append '<div id="leavingDiv">Leaving...</div>'
jQuery '#myHolaDiv'
  .append '<div>Leaving......</div>'
jQuery '#myHolaDiv'
  .append '<div id="goneDiv">Gone</div>'
```

And at some point later fetch the node from the DOM:

```coffee
leaving = jQuery '#leavingDiv'
  .hide();
```

In OJ, this is generally discouraged. Node lookups by ID are possible (e.g. `OJ.nodes.get('myHolaDiv)`), but it is usually better to consolidate behavior using a reference to the object and encapsulate the logic into components.

```coffee
myHolaDiv = OJ.body.make 'div'
leavingDiv = myHolaDiv.make 'div', 
  text: 'Leaving...'
  events:
    click: ->
      leavingDiv.hide()
      goneDiv.show()  
goneDiv = myHolaDiv.make 'div', 
  text: 'Gone'
  events: 
    click: ->
      goneDiv.hide()  
  .hide()
  
```

One of OJ's implicit goals is to enable a style of development free from worrying about the minutia
of the DOM in order to focus more on the UI/UX you want to deliver.

## State of the Project

The Dream: 
* Basic HTML and CSS are fully encapsulated in strongly validated OJ classes.
* Complex forms, layouts and composites are abstracted into thin OJ classes which are extensible with mixins. 
* Entire workflows are simplified into OJ structures which can be defined with just a few lines (or so) of JavaScript code.
* Layouts are configurable simply by clicking and dragging the form. Validation and data binding come for free.

~~The Reality: Some of the most complex work has already been done. The SQL Builder demo is complete, minus actual AJAX requests. A fully fledged wrapper around IndexedDb is in place. Objects are queryable using SQL-like semantics. Raw DOM nodes are wrapped and ready. Much has been done, but much more still remains to do.~~

~~### TODO Priority 1 v0.2.0~~ Complete
~~The core factory class is in place, but only SPAN and DIV have been implemented. TABLE is next, followed by INPUT (which will immediately spawn a factory subclass to handle input type: radio, checkbox, etc). SELECT (with child class OPTION) will be followed by the rest of the classic DOM Nodes.~~

As of v0.2.0, the entire library has been refactored to CoffeeScript. Anything non-essential to the DOM framework has been archived (the source is still included in the project under /src/archive).
All standard nodes are supported: div, span, input, table, fieldset, p, b, br, ol, ul, li, select, option and more. Unit tests are in place and expanding to prove out all of the new nodes.

~~### TODO Priority 2 v0.3.0~~ Complete
~~A secondary factory will need to implement components. There's still some implementation specing to do on how to distinguish
between abstract components (e.g. an array of checkboxes) vs. concrete controls (e.g. an Address composite).~~

As of v0.3.0, all literal nodes (e.g. span, div, etc) are encapsulated in element classes. 
All controls (simple combinations of literals) are contained in control classes.
Components (OJ's version of web components) are contained in component classes.
An additional input collection exists to handle all the possible permutations of the literal input class.

### TODO Priority 3 v0.4.0
A FORM factory is on the table, so to speak. Additional specification work is needed to define a data structure
which can be implicitly cast into an OJ form, generating an ordered layout of controls and to facilitate real time data.

## Support or Contact
Feel like contributing? Wondering what in the sam hill I'm thinking? Challenge me to a duel; fork me; contact me; ignore me.
Collaborate in real time [in my IDE of choice] (https://c9.io/somecallmechief/oj).

## Licensing
Everything I write is always Public Domain. Please take generously.
