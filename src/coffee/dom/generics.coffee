# # generic nodes

do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  closed = [
    'abbr'
    'acronym'
    'applet'
    'article'
    'aside'
    'audio'
    'b'
    'bdo'
    'big'
    'blockquote'
    'button'
    'canvas'
    'caption'
    'center'
    'cite'
    'code'
    'colgroup'
    'datalist'
    'dd'
    'del'
    'details'
    'dfn'
    'dir'
    'div'
    'dl'
    'dt'
    'em'
    'fieldset'
    'figcaption'
    'figure'
    'font'
    'footer'
    'h1'
    'h2'
    'h3'
    'h4'
    'h5'
    'h6'
    'head'
    'header'
    'hgroup'
    'html'
    'i'
    'iframe'
    'ins'
    'kbd'
    'label'
    'legend'
    'li'
    'map'
    'mark'
    'menu'
    'meter'
    'nav'
    'noframes'
    'noscript'
    'object'
    'optgroup'
    'option'
    'output'
    'p'
    'pre'
    'progress'
    'q'
    'rp'
    'rt'
    'ruby'
    's'
    'samp'
    'section'
    'small'
    'span'
    'strike'
    'strong'
    'style'
    'sub'
    'summary'
    'sup'
    'tbody'
    'td'
    'tfoot'
    'th'
    'time'
    'title'
    'tr'
    'tt'
    'u'
    'var'
    'video'
    'xmp'
  ]
  open = 'area base col command css embed hr img keygen meta param source track wbr'.split ' '
  all = closed.concat open
  # register semantic/structural aliases
  for loopName in all
    do (tag = loopName) ->
      OJ.nodes.register tag, (options, owner = OJ.body, calledFromFactory = false) ->

        defaults =
          props: {}
          styles: {}
          events: {}
          
        OJ.extend defaults, options, true
        ret = OJ.element tag, defaults.props, defaults.styles, defaults.events, defaults.text


        if false is calledFromFactory then OJ.nodes.factory ret, owner

        ret
    
  return



