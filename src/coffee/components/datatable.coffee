((OJ) ->
  nodeName = 'x-datatable'
  className = 'datatable'
  
  OJ.components.members[className] = nodeName
  
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
    
    ret.rawTable = ret.make 'table', defaults.table
    ret.rawTable.empty()
    ret.dataTable = ret.rawTable.$.DataTable defaults.opts

    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
