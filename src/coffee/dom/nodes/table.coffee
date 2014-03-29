((OJ)->
  'use strict'
  OJ.nodes.register 'table', (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props: 
        cellpadding: 0
        cellspacing: 0
        align: ""
        width: ""
        cellalign: "left"
        cellvalign: "top"
      styles: {}
      events:
        click: _.noop
      cells:
        class: ""
        align: ''
        'vertical-align': ''
        cellpadding: ''
        margin: ''

      firstAlignRight: false
      oddAlignRight: false
    
    rows = []
    
    OJ.extend defaults, options
    ret = OJ.element 'table', defaults.props, defaults.styles, defaults.events
    
    
    tbody = OJ.nodes.tbody {}, ret, false 
    firstRow = OJ.node.tr {}, tbody, false
    rows.push firstRow
    
    ret.add 'cell', (row, col) ->
      row = rows[row]
      if not row
        while rows.length < row
          row = OJ.node.tr {}, tbody, false
          rows.push row
      cell = row.cells[col]
      if not cell
        while rows.cells.length < col
          cell = OJ.node.td props: defaults.cells, row, false
      OJ.nodes.factory cell, row
      cell  
    
    if owner then owner.append ret
    
    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
