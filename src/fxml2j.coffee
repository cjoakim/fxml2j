
fs      = require('fs')
path    = require('path')
sprintf = require("sprintf-js").sprintf

EventEmitter  = require('events').EventEmitter
FxmlParser    = require("./fxml_parser").FxmlParser
UIComponent   = require("./ui_component").UIComponent
JavaGenerator = require("./java_generator").JavaGenerator


class Fxml2j extends EventEmitter

  constructor: (config_obj={}) ->
    @config_obj     = config_obj
    @javafx_src_dir = @config_obj.javafx_src_dir
    @fxml_filename  = @config_obj.fxml_filename
    @fxml_filename  = @javafx_src_dir + path.sep + @fxml_filename
    @finish_obj     = {}

  generate: ->
    if @fxml_filename
      xml_str = fs.readFileSync(@fxml_filename, 'utf-8')
      parser  = new FxmlParser(xml_str, @config_obj)
      parser.on "done", (parse_event_obj) =>
        @finish_obj.parse_event_obj = parse_event_obj
        console.log('fxml parsed; controller is:    ' + parse_event_obj.controller)
        console.log('fxml parsed; fx:id components: ' + parse_event_obj.ui_components.length)
        generator = new JavaGenerator(@config_obj, parse_event_obj)
        generator.generate()
        this.finish()
      parser.parse()
    else
      @finish_obj.error = 'fxml_filename does not exist: ' + fxml_filename

  diff: ->
    if @fxml_filename
      xml_str = fs.readFileSync(@fxml_filename, 'utf-8')
      parser  = new FxmlParser(xml_str, @config_obj)
      parser.on "done", (parse_event_obj) =>
        @finish_obj.parse_event_obj = parse_event_obj
        console.log('fxml parsed; controller is:    ' + parse_event_obj.controller)
        console.log('fxml parsed; fx:id components: ' + parse_event_obj.ui_components.length)
        generator = new JavaGenerator(@config_obj, parse_event_obj)
        generator.diff()
        this.finish()
      parser.parse()
    else
      @finish_obj.error = 'fxml_filename does not exist: ' + fxml_filename


  finish: =>
    this.emit('done', @finish_obj)


root = exports ? this
root.Fxml2j = Fxml2j
