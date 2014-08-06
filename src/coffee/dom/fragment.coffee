# # fragment
do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->

  # Create a document fragment and return it as an OJ node
  OJ.register 'fragment', () ->
    ret = null
    if typeof document isnt 'undefined'
      fragment = document.createDocumentFragment()
      ret = OJ.restoreElement fragment, 'fragment'
    ret  
  
        
  return

