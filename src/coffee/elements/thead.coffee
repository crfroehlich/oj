((OJ)->
  'use strict'
  
  nodeName = 'thead'
  
  OJ.nodes.register nodeName, (options, owner = OJ.body, calledFromFactory = false) ->
    
   defaults =
      props: {}
      styles: {}
      events:
        click: OJ.noop
      number: 1  
    
    OJ.extend defaults, options, true
    
    ret = OJ.element nodeName, defaults.props, defaults.styles, defaults.events, defaults.text
    
    if false is calledFromFactory then OJ.nodes.factory ret, owner

    rows = []
    cells = {}
    ret.add 'cell', (rowNo, colNo) ->
      init()
      
      if rowNo < 1 then rowNo = 1
      if colNo < 1 then colNo = 1
          
      row = rows[rowNo-1]
      
      if not row
        while rows.length < rowNo
          row = OJ.nodes.tr {}, tbody, false
          rows.push row
      
      td = row[0].cells[colNo]
      
      if td then cell = OJ.restoreElement td, 'td'
      if not td
        while row[0].cells.length < colNo
          idx = row[0].cells.length
          td = row[0].cells[idx-1]
          if td and idx is colNo 
            cell = OJ.restoreElement td, 'td'
          else  
            cell = OJ.nodes.td props: defaults.cells, row, false
      
      if not cell.isValid
        OJ.nodes.factory cell, row, rowNo + colNo
            
      cell  

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

