((OJ) ->
  
  OJ.makeSubNameSpace "errors"
  
  ###
  To check assigned type
  ###
  OJ.makeSubNameSpace "is"
  
  ###
  To instance check classes
  ###
  OJ.makeSubNameSpace "instanceOf"
  
  ###
  Type conversion
  ###
  OJ.makeSubNameSpace "to"
  
  ##endregion CORE 
  
  
  OJ.makeSubNameSpace "nodes"
  
 
  
)  (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
