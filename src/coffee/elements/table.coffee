OJ = require '../oj'
require '../core/object'
require '../dom/nodeFactory'

# # table

nodeName = 'table'

###
Create an HTML table. Provides helper methods to create Columns and Cells.
###
node = (options, owner = OJ.body, calledFromFactory = false) ->

  # ## options
  defaults =
    # ### data
    # optional array of objects. if provided will generate table automatically.
    data: null
    # ### props
    # optional properties to apply to table root node
    props:
      cellpadding: 0
      cellspacing: 0
      align: ''
      width: ''
      cellalign: 'left'
      cellvalign: 'top'
      class: ''
    styles: {}
    events: {}
    # ### cells
    # optional properties to apply to individual cells
    cells:
      class: ''
      align: ''
      'vertical-align': ''
      cellpadding: ''
      margin: ''
    # ### thead
    # optional options object to pass into thead creation
    thead: {}
    # ### tbody
    # optional options object to pass into tbody creation
    tbody: {}

    firstAlignRight: false
    oddAlignRight: false

  rows = []
  cells = OJ.array2D()
  columnCount = 0

  OJ.extend defaults, options, true
  ret = OJ.element nodeName, defaults.props, defaults.styles, defaults.events, defaults.text
  if false is calledFromFactory then OJ.nodes.factory ret, owner

  tbody = null
  thead = null
  theadRow = null

  # ### init
  # internal method for one time initialization of the table
  init = _.once ->
    if defaults.data
      tblStr = ConvertJsonToTable defaults.data
    if tblStr
      jTbl = $ tblStr

      jHead = jTbl.find 'thead'
      ret.$.append jHead
      thead = OJ.restoreElement jHead[0]
      theadRow = OJ.restoreElement thead[0].rows[0]

      jBody = jTbl.find 'tbody'
      ret.$.append jBody
      tbody = OJ.restoreElement jBody[0]

      loadCells()
    else
      thead = ret.make 'thead', defaults.thead
      theadRow = thead.make 'tr'
      tbody = ret.make 'tbody', defaults.tbody
      rows.push tbody.make 'tr'
    ret

  # ### loadCells
  # internal method guarantees that tables loaded from JSON are fully loaded into memory
  loadCells = () ->
    r = 0
    while tbody[0].rows.length > r
      c = 0
      memRow = OJ.restoreElement tbody[0].rows[r]
      rows.push memRow
      while tbody[0].rows[r].cells.length > c
        memCell = cells.get r+1, c+1
        if not memCell
          memCell = OJ.restoreElement tbody[0].rows[r].cells[c]
          cells.set r+1, c+1, memCell
        c += 1
      r += 1

  # ### fillMissing
  # internal method guarantees that cells exist for the dimensions of the table
  fillMissing = () ->
    cells.each (rowNo, colNo, val) ->
      if not val
        row = ret.row rowNo
        row.cell colNo, {}

  # ## column
  # Adds a column name to the table head
  ret.add 'column', (colNo, colName) ->
    ret.init()
    columnCount += 1
    th = null
    i = 0
    while thead[0].rows[0].cells.length < colNo
      nativeTh = thead[0].rows[0].cells[i]
      if not nativeTh
        th = theadRow.make 'th', {}
      else
        th = OJ.restoreElement nativeTh, 'th'
      i += 1
    if not th
      nativeTh = thead[0].rows[0].cells[colNo-1]
      th = OJ.restoreElement nativeTh, 'th'
    th.text colName
    th

  # ## row
  # Adds a new row (tr) to the table body
  ret.add 'row', (rowNo, opts) ->
    row = rows[rowNo-1]

    if not row
      while rows.length < rowNo
        row = tbody.make 'tr', {}
        rows.push row

    if not row.cell
      row.add 'cell', (colNo, opts) ->
        cell = OJ.nodes.td opts, row
        cells.set rowNo, colNo, cell
        cell

    row

  # ## cell
  # Adds a cell (tr/td) to the table body
  ret.add 'cell', (rowNo, colNo, opts) ->
    if rowNo < 1 then rowNo = 1
    if colNo < 1 then colNo = 1
    if columnCount > 0 and colNo-1 > columnCount then throw new Error 'A column name has not been defined for this position {' + rowNo + 'x' + colNo + '}.'

    row = ret.row rowNo

    cell = cells.get rowNo, colNo

    if not cell
      i = 0
      while i < colNo
        i += 1
        if i is colNo
          nuOpts = OJ.extend {props: defaults.cells}, opts
          cell = row.cell colNo, nuOpts
        else
          tryCell = cells.get rowNo, i
          if not tryCell
            tryCell =  row.cell i, props: defaults.cells

    cell



  # ## Finalize
  # Finalize guarantees that thead and tbody and created when the node is fully instantiated
  ret.add 'finalize', ->
    init()

    # ## THead
    # Expose the internal thead node
    ret.add 'thead', thead

    # ## TBody
    # Expose the internal tbody node
    ret.add 'tbody', tbody

    ret

  ret

OJ.nodes.register nodeName, node
module.exports = node
