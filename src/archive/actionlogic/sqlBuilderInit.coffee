# jshint undef: true, unused: true 

# global Ext  
((OJ) ->
  window.initQb = ->
    OJ.actions.querybuilder.initQbUI "qbwindow"
    OJ.structureSets.structureSet
      name: "qbwindow"
      scope: "sql"

    return

  return

#Ext.application({
#    name: OJ.name + '.qbwindow',
#    appFolder: 'sql',
#    autoCreateViewport: false,
#    errorHandler: function(err) {
#        Cs2.console.error(err);
#    },
#    launch: function() {
#        Ext.Error.handle = this.errorHandler;
#        // copy application to $OJ$.sql so that $OJ$.sql.src can be used as an application singleton
#        var qbWindow = Ext.create('Ext.' + OJ.name + '.qbwindow');
#        qbWindow.show();
#        Ext.apply(OJ.sql, this);
#    }
#});
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
