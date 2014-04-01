((OJ) ->
  OJ.components.members['x-sub-nav'] = 'subnav'
  OJ.components.register 'subnav', (options, owner) ->
    defaults =
      active: ''
      menu: [
        name: ''
        href: ''
      ]

    OJ.extend defaults, options
    ret = OJ.component(defaults, owner, 'x-sub-nav')
    ul = ret.ul(attr:
      class: 'active'
    )
    OJ.each defaults.menu, (val, key) ->
      if val.name is defaults.active
        li = ul.li(attr:
          class: 'active'
        )
      else
        li = ul.li()
      li.a attr: val
      return

    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ