OJ(S) :: Orange Juice JS :: Calcium Fortified JS
======
This code is Public Domain, though its dependencies may not be.

## Purpose

OJ aims to provide a zero-HTML approach to writing web applications. Everything that goes into the DOM enters via JavaScript. 
DOM nodes, their parent and child nodes, and their events are accessible in-memory and through the chaining that OJ
provides. Data-binding happens automatically, bi-directionally to/from the Objects you provide OJ and the changes
the user makes to the rendered page.

## Usage

    var body = OJ.node.wrapper($('body')); //fetch the Body, cast it into an OJ node, and store it in memory
    var div1 = body.div({ display: 'This is DIV 1' }); //Insert a div into the DOM on the Body node
    div1.div({ display: 'This is DIV 1-1' }); //Insert a div onto the div1 node
    div1.childNodes[0] // Fetch the just added div later, if you need it
    
## Dependencies

OJ currently depends on jQuery, but OJ has abstracted DOM insertion and manipulation such that other frameworks can be 
supported down the line. For dynamic, complex form components (grids/trees/etc), OJ depends on ExtJs.

## State

*OJ currently supports casting any DOM node into an OJ node, and it supports adding DIV and SPAN elements. 
That's not a lot, but I'm working to get all the other pieces in place before building out the rest of the DOM framework.
Namely grunt tasks to build the project, unit tests and documentation--easier to do first than later.
*OJ can generate some complex forms (see the SQL Builder demo). That leaves a big gap between lower level DOM manipulation,
but it is a start.

## Goals

OJ node chaining/element creation is intended to be the nitty gritty of OJ work. Eventually, OJ will generate whole
form content across a variety of libraries (jQuery UI, Bootstrap, ExtJs, Dojo, etc.) and expose an easier way to 
compose responsive pages.
