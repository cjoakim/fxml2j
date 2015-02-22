
fs      = require('fs')
path    = require('path')
sprintf = require("sprintf-js").sprintf


class JavaGenerator

  constructor: (config_obj, parse_event_obj) ->
    @config_obj      = config_obj
    @parse_event_obj = parse_event_obj

    @javafx_src_dir  = @config_obj.javafx_src_dir
    @fxml_filename   = @config_obj.fxml_filename
    @controller      = @parse_event_obj.controller
    @ui_components   = @parse_event_obj.ui_components
    @controller_package  = undefined
    @controller_filename = undefined
    @generated_filename  = undefined
    @curr_src_lines  = []

  generate: ->
    @controller_package  = this.determine_controller_package()
    @controller_filename = this.determine_controller_filename()
    @generated_filename  = this.determine_generated_filename()

    console.log('controller_package:  ' + @controller_package)
    console.log('controller_filename: ' + @controller_filename)
    console.log('generated_filename:  ' + @generated_filename)

    this.read_current_controller_file()


  determine_controller_package: ->
    tokens = @controller.split('.')
    tokens.pop()
    tokens.join('.')

  determine_controller_filename: ->
    tokens = @controller.split('.') # com.joakim.example.ExampleController
    controller_path = (tokens.join(path.sep)) + '.java'
    @javafx_src_dir + path.sep + controller_path

  determine_generated_filename: ->
    tokens = @controller.split('.')
    controller_path = (tokens.join(path.sep)) + '.txt'
    @javafx_src_dir + path.sep + controller_path

  read_current_controller_file: ->
    if fs.existsSync(@controller_filename)
      @curr_src_lines = fs.readFileSync(@controller_filename, 'utf-8').split("\n")
      console.log('the controller file currently exists, line count: ' + @curr_src_lines.length)
    else
      console.log('the controller file does not currently exist')
      @curr_src_lines = []

  log: (msg) ->
    console.log('JavaGenerator: ' + msg)


root = exports ? this
root.JavaGenerator = JavaGenerator
