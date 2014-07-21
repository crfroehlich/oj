OJ = require '../oj'
require '../ojInit'
require '../core/object'
require '../dom/component'
require 'jquery'

nodeName = 'x-grid'
className = 'grid'

component = do ->
  OJ.components.members[className] = nodeName
  (options, owner) ->
    defaults =
      tileSizes:
        smallSpan: ''
        mediumSpan: ''
        largeSpan: ''
      props:
        class: 'grid'

    OJ.extend defaults, options, true
    ret = OJ.component defaults, owner, nodeName

    rows = []
    tiles = OJ.array2D()

    fillMissing = () ->
      tiles.each (rowNo, colNo, val) ->
        if not val
          row = ret.row rowNo
          row.make 'tile', colNo, {}

    ret.add 'row', (rowNo = rows.length-1 or 1)->
      nuRow = rows[rowNo-1]
      if not nuRow
        while rows.length < rowNo
          nuRow = ret.make 'div', props: class: 'row'
          rows.push nuRow
        nuRow.add 'tile', (colNo, opts) ->
          opts = OJ.extend (OJ.extend {}, defaults.tileSizes), opts
          nuTile = OJ.components.tile opts, nuRow
          tiles.set rowNo, colNo, nuTile
          nuTile
      nuRow

    ret.add 'tile', (rowNo, colNo, opts) ->
      if not rowNo or rowNo < 1 then rowNo = 1
      if not colNo or colNo < 1 then colNo = 1

      row = ret.row rowNo
      tile = tiles.get rowNo, colNo

      if not tile
        i = 0
        while i < colNo
          i += 1
          tryTile = tiles.get rowNo, i
          if not tryTile
            if i is colNo
              tile = row.make 'tile', opts
            else if not tile
              row.make 'tile'

      fillMissing()
      tile

    ret

OJ.components.register className, component
module.exports = component