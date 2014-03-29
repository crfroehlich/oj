((OJ) ->
  
  ###
  Generates a random string that complies to the RFC 4122 specification for GUID/UUID.
  (e.g. 'B42A153F-1D9A-4F92-9903-92C11DD684D2')
  While not a true UUID, for the purposes of this application, it should be sufficient.
  ###
  createFauxUUID = ->
    
    # http://www.ietf.org/rfc/rfc4122.txt
    # http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    s = []
    s.length = 36
    hexDigits = "0123456789abcdef"
    i = 0

    while i < 36
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      i += 1
    s[14] = "4" # bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) # bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-"
    uuid = s.join("")
    uuid

  OJ.register "createUUID", createFauxUUID
  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
