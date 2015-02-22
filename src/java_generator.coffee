
sprintf = require("sprintf-js").sprintf


class JavaGenerator

  constructor: (config_obj, parse_event_obj) ->
    @config_obj      = config_obj
    @parse_event_obj = parse_event_obj

  generate: ->
    this.log('generate - not yet implemented')

  log: (msg) ->
    console.log('JavaGenerator: ' + msg)

root = exports ? this
root.JavaGenerator = JavaGenerator
