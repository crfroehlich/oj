((OJ) ->
  nodeName = 'x-address'
  className = 'address'
  
  OJ.components.members[className] = nodeName
  
  OJ.components.register className, (options, owner) ->
    defaults = 
      props:
        class: 'fb-field-wrapper response-field-address'
    
    OJ.extend defaults, options, true
    ret = OJ.component defaults, owner, nodeName 
    
    wrapper = ret.make 'div', props: class: 'subtemplate-wrapper'
    wrapper.make 'div', props: class: 'cover'
    
    street = wrapper.make 'div', props: class: 'input-line'
      .make 'span', props: class: 'street'
    street.make 'input', props: type: 'text'
    street.make 'label', text: 'Address'
    
    cityState = wrapper.make 'div', props: class: 'input-line'
    city = cityState.make 'span', props: class: 'city'
    city.make 'input', props: type: 'text'
    city.make 'label', text: 'City'

    state = cityState.make 'span', props: class: 'state'
    state.make 'input', props: type: 'text'
    state.make 'label', text: 'State'    

    zipCountry = wrapper.make 'div', props: class: 'input-line'
    zip = zipCountry.make 'span', props: class: 'zip'
    zip.make 'input', props: type: 'text'
    zip.make 'label', text: 'Zipcode'
    
    country = zipCountry.make 'span', props: class: 'country'
    country.make 'select' 
      .addOption 'United States' 
    country.make 'label', text: 'Country'

    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
