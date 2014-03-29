# jshint undef: true, unused: true 

# global Ext  
((OJ) ->
  
  #
  #     * SQL Manager is defined but dormant until initialzed
  #    
  init = (->
    
    #
    #         * SQL Manager exposes a connections array and a OJ.actions.sql.select property
    #        
    manager = ->
      ret = OJ.object()
      ret.add "connections", []
      ret.add "select", OJ.actions.sql.select()
      OJ.actions.sql.register "manager", ret
      ret

    manager
  ())
  OJ.actions.sql.register "init", init
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
