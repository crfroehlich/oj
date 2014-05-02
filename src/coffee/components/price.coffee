((OJ) ->
  nodeName = 'x-price'
  className = 'price'
  
  OJ.components.members[nodeName] = className
  OJ.components.register className, (options, owner) ->
    defaults = {}
    
    OJ.extend defaults, options
    cmpnt = OJ.component defaults, owner, nodeName
    ret = cmpnt.div()
    
    price = ret.div props: class: 'input-line'
    price.span  props: class: 'above-line'
      .text '$'
      
    dollars = price.span props: class: 'dollars'          
    dollars.input props: type: 'text'
    dollars.label().text 'Dollars'
    
    price.span  props: class: 'above-line'
      .text '.'
    
    cents = price.span props: class: 'cents'          
    cents.input props: type: 'text'
    cents.label().text 'Cents' 

    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
