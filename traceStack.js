;(function() {

  function parse(s) {

    if(s[s.length - 1] == ')') { // IE8+, top frame of Chrome

      var firstParenIndex = s.indexOf('(')
        , lastParenIndex = s.indexOf(')')
        , inParens = s.substring(firstParenIndex + 1, lastParenIndex)
        , parts = inParens.split(':')
        , len = parts.length

      return {
        line: +parts[len - 2],
        script: parts.slice(0, len - 2).join(':')
      }
    }

    var lastColonIndex = s.lastIndexOf(':')
      , afterLastColon = s.substring(lastColonIndex + 1)
      , beforeLastColon = s.substring(0, lastColonIndex)

    if(s[0] == '@') // Firefox
      return { line: +afterLastColon, script: beforeLastColon.substring(1) }

    if(s.indexOf('    at') == 0) { // Chrome 

      var secondToLastColonIndex = beforeLastColon.lastIndexOf(':')
        , afterSecondToLastColon = beforeLastColon.substring(secondToLastColonIndex + 1)
        , beforeSecondToLastColon = beforeLastColon.substring(7, secondToLastColonIndex)
        
      return { line: +afterSecondToLastColon, script: beforeSecondToLastColon }
    }
    
    return {}
  }

  this.traceStack = function() {

    try {
      throw new Error()
    } catch(e) { 

      return (e.stack || '').
        split('\n').
        filter(function(x) { return x && x != 'Error' }).
        map(parse)
    }
  }

})(this);