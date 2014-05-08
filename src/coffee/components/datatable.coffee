((OJ) ->
  nodeName = 'x-datatable'
  className = 'datatable'
  
  OJ.components.members[nodeName] = className
  
  OJ.components.register className, (options, owner) ->
    defaults = 
      opts:
        data: []
        columns: []
      table: 
        class: ''
      props:
        class: ''
    
    OJ.extend defaults, options, true
    ret = OJ.component defaults, owner, nodeName 
    
    ret.rawTable = ret.table defaults.table
    ret.dataTable = ret.rawTable.$.DataTable opts

    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
