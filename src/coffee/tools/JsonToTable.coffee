
###
Return just the keys from the input array, optionally only for the specified search_value
version: 1109.2015
discuss at: http://phpjs.org/functions/array_keys
+   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
+      input by: Brett Zamir (http://brett-zamir.me)
+   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
+   improved by: jd
+   improved by: Brett Zamir (http://brett-zamir.me)
+   input by: P
+   bugfixed by: Brett Zamir (http://brett-zamir.me)
example 1: array_keys( {firstname: 'Kevin', surname: 'van Zonneveld'} );
returns 1: {0: 'firstname', 1: 'surname'}
###
array_keys = (input, search_value, argStrict) ->
  search = typeof search_value isnt "undefined"
  tmp_arr = []
  strict = !!argStrict
  include = true
  key = ""
  # Duck-type check for our own array()-created PHPJS_Array
  return input.keys(search_value, argStrict)  if input and typeof input is "object" and input.change_key_case
  for key of input
    if input.hasOwnProperty(key)
      include = true
      if search
        if strict and input[key] isnt search_value
          include = false
        else include = false  unless input[key] is search_value
      tmp_arr[tmp_arr.length] = key  if include
  tmp_arr

###*
Convert a Javascript Oject array or String array to an HTML table
JSON parsing has to be made before function call
It allows use of other JSON parsing methods like jQuery.parseJSON
http(s)://, ftp://, file:// and javascript:; links are automatically computed

JSON data samples that should be parsed and then can be converted to an HTML table
var objectArray = '[{"Total":"34","Version":"1.0.4","Office":"New York"},{"Total":"67","Version":"1.1.0","Office":"Paris"}]';
var stringArray = '["New York","Berlin","Paris","Marrakech","Moscow"]';
var nestedTable = '[{ key1: "val1", key2: "val2", key3: { tableId: "tblIdNested1", tableClassName: "clsNested", linkText: "Download", data: [{ subkey1: "subval1", subkey2: "subval2", subkey3: "subval3" }] } }]';

Code sample to create a HTML table Javascript String
var jsonHtmlTable = ConvertJsonToTable(eval(dataString), 'jsonTable', null, 'Download');

Code sample explaned
- eval is used to parse a JSON dataString
- table HTML id attribute will be 'jsonTable'
- table HTML class attribute will not be added
- 'Download' text will be displayed instead of the link itself

@author Afshin Mehrabani <afshin dot meh at gmail dot com>

@class ConvertJsonToTable

@method ConvertJsonToTable

@param parsedJson object Parsed JSON data
@param tableId string Optional table id
@param tableClassName string Optional table css class name
@param linkText string Optional text replacement for link pattern

@return string Converted JSON to HTML table
###
class JsonToTable 
  
  table: null
  
  constructor: (parsedJson, tableId, tableClassName, linkText) ->
    #Patterns for links and NULL value
    italic = "<i>{0}</i>"
    link = (if linkText then "<a href=\"{0}\">" + linkText + "</a>" else "<a href=\"{0}\">{0}</a>")
  
    #Pattern for table                          
    idMarkup = (if tableId then " id=\"" + tableId + "\"" else "")
    classMarkup = (if tableClassName then " class=\"" + tableClassName + "\"" else "")
    tbl = "<table border=\"1\" cellpadding=\"1\" cellspacing=\"1\"" + idMarkup + classMarkup + ">{0}{1}</table>"
  
    #Patterns for table content
    th = "<thead>{0}</thead>"
    tb = "<tbody>{0}</tbody>"
    tr = "<tr>{0}</tr>"
    thRow = "<th>{0}</th>"
    tdRow = "<td>{0}</td>"
    thCon = ""
    tbCon = ""
    trCon = ""
    if parsedJson
      isStringArray = typeof (parsedJson[0]) is "string"
      headers = undefined
    
      # Create table headers from JSON data
      # If JSON data is a simple string array we create a single table header
      if isStringArray
        thCon += thRow.format("value")
      else
      
        # If JSON data is an object array, headers are automatically computed
        if typeof (parsedJson[0]) is "object"
          headers = array_keys(parsedJson[0])
          i = 0
          while i < headers.length
            thCon += thRow.format(headers[i])
            i++
      th = th.format(tr.format(thCon))
    
      # Create table rows from Json data
      if isStringArray
        i = 0
        while i < parsedJson.length
          tbCon += tdRow.format(parsedJson[i])
          trCon += tr.format(tbCon)
          tbCon = ""
          i++
      else
        if headers
          urlRegExp = new RegExp(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/g)
          javascriptRegExp = new RegExp(/(^javascript:[\s\S]*;$)/g)
          i = 0
          while i < parsedJson.length
            j = 0
            while j < headers.length
              value = parsedJson[i][headers[j]]
              isUrl = urlRegExp.test(value) or javascriptRegExp.test(value)
              if isUrl # If value is URL we auto-create a link
                tbCon += tdRow.format(link.format(value))
              else
                if value
                  if typeof (value) is "object"
                  
                    #for supporting nested tables
                    tbCon += tdRow.format(ConvertJsonToTable(eval(value.data), value.tableId, value.tableClassName, value.linkText))
                  else
                    tbCon += tdRow.format(value)
                else # If value == null we format it like PhpMyAdmin NULL values
                  tbCon += tdRow.format(italic.format(value).toUpperCase())
              j++
            trCon += tr.format(tbCon)
            tbCon = ""
            i++
      tb = tb.format(trCon)
      tbl = tbl.format(th, tb)
    @table = tbl

module.exports = JsonToTable