
fs      = require('fs')
path    = require('path')
sprintf = require("sprintf-js").sprintf

EventEmitter  = require('events').EventEmitter
FxmlParser    = require("./fxml_parser").FxmlParser
UIComponent   = require("./ui_component").UIComponent
JavaGenerator = require("./java_generator").JavaGenerator

# This class, and it's 'process' method, is the public API to this library.

class Fxml2j extends EventEmitter

  constructor: (config_obj={}) ->
    @config_obj     = config_obj
    @javafx_src_dir = @config_obj.javafx_src_dir
    @fxml_filename  = @config_obj.fxml_filename
    @fxml_filename  = @javafx_src_dir + path.sep + @fxml_filename

  process: ->
    if @fxml_filename
      xml_str = fs.readFileSync(@fxml_filename, 'utf-8')
      parser  = new FxmlParser(xml_str, @config_obj)
      parser.on "done", (parser_obj) =>
        console.log('fxml parsed; controller: ' + parser_obj.controller + '  ui components: ' + parser_obj.ui_components.length)
        generator = new JavaGenerator(@config_obj, parser_obj)
        if @config_obj.generate
          generator.generate()
        if @config_obj.diff
          generator.diff()
      parser.parse()
    else
      console.log('fxml_filename does not exist: ' + @fxml_filename)


root = exports ? this
root.Fxml2j = Fxml2j
