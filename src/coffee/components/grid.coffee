((OJ) ->
  nodeName = 'x-grid'
  className = 'grid'
  
  OJ.components.members[nodeName] = className
  OJ.components.register className, (options, owner) ->
    defaults = 
      props: 
        class: 'grid'
    
    OJ.extend defaults, options
    ret = OJ.component defaults, owner, nodeName 
    cmpnt = ret.div()

    rows = []
    tiles = OJ.array2D()
    
    fillMissing = () ->
      tiles.each (rowNo, colNo, val) ->
        if not val
          row = ret.row rowNo
          row.tile colNo, {} 
    
    ret.add 'row', (rowNo = rows.length-1 or 1)->  
      nuRow = rows[rowNo-1]
      if not nuRow
        while rows.length < rowNo
          nuRow = cmpnt.div props: class: 'row'
          rows.push nuRow
        nuRow.add 'tile', (colNo, opts) ->
          nuTile = OJ.components.tile opts, nuRow
          tiles.set rowNo, colNo, nuTile
          nuTile
      nuRow  
                      
    ret.add 'tile', (rowNo, colNo, opts) ->
      if not rowNo or rowNo < 1 then rowNo = 1
      if not colNo or colNo < 1 then colNo = 1
      
      row = ret.row rowNo
      tile = tiles.get rowNo, colNo
      
      if not tile
        i = 0
        while i <= colNo
          i += 1
          tile = tiles.get rowNo, i
          if i is colNo
            tile = row.tile colNo, opts
          else if not tile
            row.tile i
      
      fillMissing()
      tile      
            
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
