((OJ) ->
  nodeName = 'x-datatable'
  className = 'datatable'
  
  OJ.components.members[nodeName] = className
  
  OJ.components.register className, (options, owner) ->
    defaults = 
      data: [[]]
      columns: []
      props:
        class: ''
    
    OJ.extend defaults, options
    ret = OJ.component defaults, owner, nodeName 
    
    ret.rawTable = ret.table()
    ret.dataTable = ret.rawTable.$.DataTable defaults

    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
