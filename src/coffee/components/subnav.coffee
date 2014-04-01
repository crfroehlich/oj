((OJ) ->
  OJ.components.members.push 'subnav'
  OJ.components.register 'subnav', (owner, props) ->
    defaults =
      active: ''
      menu: [
        name: ''
        href: ''
      ]

    OJ.extend defaults, props
    ret = OJ.component(owner, 'sidebar-subnav')
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