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
    
    tbody = null
    isInit = false
    
    init = ->
      tbody = OJ.nodes.tbody {}, ret, false 
      rows.push OJ.nodes.tr {}, tbody, false
      return
      
    ret.add 'cell', (rowNo, colNo) ->
      if false is isInit
        init()
        isInit = true
      
      if rowNo < 1 then rowNo = 1
      if colNo < 1 then colNo = 1
          
      row = rows[rowNo]
      
      if not row
        while rows.length < rowNo
          row = OJ.nodes.tr {}, tbody, false
          rows.push row
      
      cell = row[0].cells[colNo]
      
      if not cell
        while row[0].cells.length < colNo
          cell = OJ.nodes.td props: defaults.cells, row, false
      
      if not cell.isValid
        OJ.nodes.factory cell, row, rowNo + colNo
      cell  
    
    if owner then owner.append ret[0]
    
    if false is calledFromFactory then OJ.nodes.factory ret, owner

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
