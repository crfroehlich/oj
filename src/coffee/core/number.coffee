OJ = require '../oj'

number = Object.create(null)

Object.defineProperty number, 'isNaN',
  value: (if (Number and Number.isNaN) then Number.isNaN else isNaN)

Object.defineProperty number, 'isFinite',
  value: (if (Number and Number.isFinite) then Number.isFinite else isFinite)

Object.defineProperty number, 'MAX_VALUE',
  value: (if (Number and Number.MAX_VALUE) then Number.MAX_VALUE else 1.7976931348623157e+308)

Object.defineProperty number, 'MIN_VALUE',
  value: (if (Number and Number.MIN_VALUE) then Number.MIN_VALUE else 5e-324)

OJ.register 'number', number
module.exports = number