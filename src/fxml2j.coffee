
fs   = require('fs')
path = require('path')

EventEmitter = require('events').EventEmitter
FxmlParser   = require("./fxml_parser").FxmlParser


class Fxml2j extends EventEmitter

  constructor: (opts={}) ->
    @options = opts
    @javafx_src_dir = @options.javafx_src_dir
    @fxml_filename  = @options.fxml_filename
    @fxml_filename  = @javafx_src_dir + path.sep + @fxml_filename

  parse: ->
    if @fxml_filename
      xml_str = fs.readFileSync(@fxml_filename, 'utf-8')
      parser  = new FxmlParser(xml_str, @options)
      parser.on "done", (parse_event_obj) =>
        @finish_obj.parse_event_obj = parse_event_obj
        @finish_obj.message = 'Not implemented yet'
        this.finish()
      parser.parse()
    else
      @finish_obj.error = 'fxml_filename does not exist: ' + fxml_filename

  log: (msg) ->
    if @options.verbose
      console.log('Fxml2j: ' + msg)

  finish: =>
    this.emit('done', @finish_obj)


root = exports ? this
root.Fxml2j = Fxml2j
