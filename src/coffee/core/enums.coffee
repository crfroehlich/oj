((OJ) ->
  'use strict'
  OJ.enums.register 'unknown', 'unknown'

    
  # Try to fetch an enum based on a string value. 
  OJ.enums.register 'tryParse', (OJEnum, enumMember, caseSensitive) ->
    'use strict'
    ret = OJ.enums.unknown
    if OJ.contains(OJEnum, enumMember)
      ret = OJEnum[enumMember]
    else if false is caseSensitive
      OJ.each OJEnum, (member) ->
        ret = member  if OJ.contains(OJEnum, member) and OJ.string(member).toLowerCase() is OJ.string(enumMember).toLowerCase()
        return

    ret

  OJ.enums.register 'inputTypes',
    button: #characters
      id: 0
      name: 'button'
      placeholder: false
      autocomplete: false
      value:
        required: false
        allowed: true

      defaultwidth: ''
      defaultsize: '25'

    checkbox: #characters
      id: 1
      name: 'checkbox'
      placeholder: false
      autocomplete: false
      value:
        required: true
        allowed: true

      defaultwidth: ''
      defaultsize: '25'

    color: #characters
      id: 2
      name: 'color'
      placeholder: false
      autocomplete: true
      value:
        required: false
        allowed: true

      defaultwidth: ''
      defaultsize: '25'

    date: #characters
      id: 3
      name: 'date'
      placeholder: false
      autocomplete: true
      value:
        required: false
        allowed: true

      defaultwidth: '200px'
      defaultsize: '25'

    datetime: #characters
      id: 4
      name: 'datetime'
      placeholder: false
      autocomplete: false
      value:
        required: false
        allowed: true

      defaultwidth: '200px'
      defaultsize: '25'

    'datetime-local': #characters
      id: 5
      name: 'datetime-local'
      placeholder: false
      autocomplete: true
      value:
        required: false
        allowed: true

      defaultwidth: '200px'
      defaultsize: '25'

    email: #characters
      id: 6
      name: 'email'
      placeholder: true
      autocomplete: true
      value:
        required: false
        allowed: true

      defaultwidth: '200px'
      defaultsize: '25'

    file: #characters
      id: 7
      name: 'file'
      placeholder: false
      autocomplete: false
      value:
        required: false
        allowed: false

      defaultwidth: ''
      defaultsize: '25'

    hidden: #characters
      id: 8
      name: 'hidden'
      placeholder: false
      autocomplete: false
      value:
        required: false
        allowed: true

      defaultwidth: ''
      defaultsize: '25'

    image: #characters
      id: 9
      name: 'image'
      placeholder: false
      autocomplete: false
      value:
        required: false
        allowed: true

      defaultwidth: ''
      defaultsize: '25'

    month: #characters
      id: 10
      name: 'month'
      placeholder: false
      autocomplete: false
      value:
        required: false
        allowed: true

      defaultwidth: ''
      defaultsize: '25'

    number: #characters
      id: 11
      name: 'number'
      placeholder: false
      autocomplete: false
      value:
        required: false
        allowed: true

      defaultwidth: '200px'
      defaultsize: '25'

    password: #characters
      id: 12
      name: 'password'
      placeholder: true
      value:
        required: false
        allowed: true

      defaultwidth: '200px'
      defaultsize: '25'

    radio: #characters
      id: 13
      name: 'radio'
      placeholder: false
      autocomplete: false
      value:
        required: true
        allowed: true

      defaultwidth: ''
      defaultsize: '25'

    range: #characters
      id: 14
      name: 'range'
      placeholder: false
      autocomplete: true
      value:
        required: false
        allowed: true

      defaultwidth: ''
      defaultsize: '25'

    reset: #characters
      id: 15
      name: 'reset'
      placeholder: false
      autocomplete: false
      value:
        required: false
        allowed: true

      defaultwidth: ''
      defaultsize: '25'

    search: #characters
      id: 16
      name: 'search'
      placeholder: true
      autocomplete: true
      value:
        required: false
        allowed: true

      defaultwidth: ''
      defaultsize: '25'

    submit: #characters
      id: 17
      name: 'submit'
      placeholder: false
      autocomplete: false
      value:
        required: false
        allowed: true

      defaultwidth: ''
      defaultsize: '25'

    tel: #characters
      id: 18
      name: 'button'
      placeholder: true
      autocomplete: true
      value:
        required: false
        allowed: true

      defaultwidth: ''
      defaultsize: '25'

    text: #characters
      id: 19
      name: 'text'
      placeholder: true
      autocomplete: true
      value:
        required: false
        allowed: true

      defaultwidth: '200px'
      defaultsize: '25'

    time: #characters
      id: 20
      name: 'time'
      placeholder: false
      autocomplete: true
      value:
        required: false
        allowed: true

      defaultwidth: '200px'
      defaultsize: '25'

    url: #characters
      id: 21
      name: 'url'
      placeholder: true
      autocomplete: true
      value:
        required: false
        allowed: true

      defaultwidth: '200px'
      defaultsize: '25'

    week: #characters
      id: 22
      name: 'week'
      placeholder: false
      autocomplete: false
      value:
        required: false
        allowed: true

      defaultwidth: ''
      defaultsize: '25'

  OJ.enums.register 'rateIntervalTypes',
    Hourly: 'Hourly'
    WeeklyByDay: 'WeeklyByDay'
    MonthlyByDate: 'MonthlyByDate'
    MonthlyByWeekAndDay: 'MonthlyByWeekAndDay'
    YearlyByDate: 'YearlyByDate'

  OJ.enums.register 'domElementEvent',
    click: 'click'
    change: 'change'
    vclick: 'vclick'
    tap: 'tap'

  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ

