OJ = require '../oj'
el = require '../dom/element'

nodeName = 'thead'

node = (options, owner = require('../dom/body'), calledFromFactory = false) ->

  defaults =
    props: {}
    styles: {}
    events:
      click: OJ.noop
    number: 1

  OJ.extend defaults, options, true

  ret = el.element nodeName, defaults, owner, calledFromFactory

 

  rows = []
  cells = {}
  ret.add 'cell', (rowNo, colNo) ->
    init()

    if rowNo < 1 then rowNo = 1
    if colNo < 1 then colNo = 1

    row = rows[rowNo-1]

    if not row
      while rows.length < rowNo
        row = OJ.nodes.tr {}, tbody, false
        rows.push row

    td = row[0].cells[colNo]

    if td then cell = el.restoreElement td, 'td'
    if not td
      while row[0].cells.length < colNo
        idx = row[0].cells.length
        td = row[0].cells[idx-1]
        if td and idx is colNo
          cell = el.restoreElement td, 'td'
        else
          cell = OJ.nodes.td props: defaults.cells, row, false

    if not cell.isValid
      nodeFactory cell, row, rowNo + colNo

    cell

  ret

OJ.nodes.register nodeName, node
module.exports = node
