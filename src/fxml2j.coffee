
EventEmitter = require('events').EventEmitter
FxmlParser   = require("fxml_parser").FxmlParser


class Fxml2j extends EventEmitter

  constructor: (opts={}) ->
    @options = opts
    @finish_obj = {}
    @fxml_filename = @options.fxml_filename

  parse: ->
    parser = new FxmlParser(xml_str, @options)
    @finish_obj.message = 'Not implemented yet'
    this.finish()

  finish: =>
    this.emit('done', @finish_obj)


root = exports ? this
root.Fxml2j = Fxml2j
