((OJ) ->
  nodeName = 'x-price'
  className = 'price'
  
  OJ.components.members[className] = nodeName
  OJ.components.register className, (options, owner) ->
    defaults = {}
    
    OJ.extend defaults, options, true
    ret = OJ.component defaults, owner, nodeName
    
    price = ret.make 'div', props: class: 'input-line'
    price.make 'span', text: '$': props: class: 'above-line' 
      
    dollars = price.make 'span', props: class: 'dollars'          
    dollars.make 'input', props: type: 'text'
    dollars. make 'label', text: 'Dollars'
    
    price.make 'span', text: '.', props: class: 'above-line'
    
    cents = price.make 'span', props: class: 'cents'          
    cents.make 'input', props: type: 'text'
    cents.make 'label', text: 'Cents' 

    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
