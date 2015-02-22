
fs      = require('fs')
path    = require('path')
sprintf = require("sprintf-js").sprintf

CounterHash  = require("counter-hash-js").CounterHash
StringBuffer = require("sb-js").StringBuffer


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
    @gen_lines       = []
    @fxml_tag_hash   = new CounterHash()

  generate: ->
    this.pre_generate()

    console.log('controller_package:   ' + @controller_package)
    console.log('controller_classname: ' + @controller_classname)
    console.log('controller_filename:  ' + @controller_filename)
    
    fs.writeFileSync(@generated_filename, @gen_lines.join("\n"), 'utf8')
    console.log('file written:         ' + @generated_filename)

  diff: ->
    this.pre_generate()

    gen_fxml_lines  = []
    gen_fxml_obj    = {}
    curr_fxml_lines = []
    curr_fxml_obj   = {}
    adds    = []
    deletes = []

    for line in @gen_lines
      if line
        if line.indexOf('@FXML') > 0
          trimmed = line.trim()
          gen_fxml_lines.push(trimmed)
          gen_fxml_obj[trimmed] = true

    this.read_current_controller_file()  
    for line in @curr_src_lines
      if line
        if line.indexOf('@FXML') > 0
          trimmed = line.trim()
          curr_fxml_lines.push(trimmed)
          curr_fxml_obj[trimmed] = true


    for line in gen_fxml_lines
      if curr_fxml_obj[line]
        # it already exists
      else
        adds.push(line)

    for line in curr_fxml_lines
      if gen_fxml_obj[line]
        # it should be retained
      else
        deletes.push(line)


    console.log('Differences - Add - ' + adds.length)
    for line in adds
      console.log('    ' + line)
    console.log('Differences - Delete - ' + deletes.length)
    for line in deletes
      console.log('    ' + line)

  pre_generate: ->
    @controller_package   = this.determine_controller_package()
    @controller_classname = this.determine_controller_classname()
    @controller_filename  = this.determine_controller_filename()
    @generated_filename   = this.determine_generated_filename()

    this.pre_process_ui_components()

    # generate java code
    this.add_line(sprintf("package %s;", @controller_package))
    this.add_line()
    for fxml_tag in @fxml_tag_hash.sorted_keys()
      this.add_line(sprintf("import javafx.scene.control.%s;", fxml_tag))
    this.add_newline()

    this.add_line(sprintf("public class %s {", @controller_classname))
    this.add_newline()

    this.add_line('    // Instance variables - fx:id UI components:')
    for c in @ui_components
      if c.fxid
        this.add_line(sprintf("    @FXML private %-16s %s;", c.fxml_tag, c.fxid))

    this.add_newline()
    this.add_line('    // UI Event Handler methods:')
    for c in @ui_components
      if c.on_method
        this.add_newline()
        this.add_line(sprintf("    @FXML public void %s(%s e) {", c.on_method, c.event_type))
        this.add_newline()
        this.add_line('    }')

    this.add_newline()
    this.add_line('}')
    this.add_newline()

  determine_controller_package: ->
    tokens = @controller.split('.')
    tokens.pop()
    tokens.join('.')

  determine_controller_classname: ->
    tokens = @controller.split('.')
    last_idx = tokens.length - 1
    tokens[last_idx]

  determine_controller_filename: ->
    tokens = @controller.split('.') # com.joakim.example.ExampleController
    controller_path = (tokens.join(path.sep)) + '.java'
    @javafx_src_dir + path.sep + controller_path

  determine_generated_filename: ->
    tokens = @controller.split('.')
    controller_path = (tokens.join(path.sep)) + '.txt'
    @javafx_src_dir + path.sep + controller_path

  pre_process_ui_components: ->
    mappings = @config_obj.multiWordTagMappings
    for c in @ui_components
      tag = c.lc_tag
      if mappings[tag]
        c.fxml_tag = mappings[tag]
      else
        c.fxml_tag =this.capitalize(tag)

    for c in @ui_components
      @fxml_tag_hash.increment(c.fxml_tag)

  read_current_controller_file: ->
    if fs.existsSync(@controller_filename)
      @curr_src_lines = fs.readFileSync(@controller_filename, 'utf-8').split("\n")
      console.log('the controller file currently exists, line count: ' + @curr_src_lines.length)
    else
      console.log('the controller file does not currently exist')
      @curr_src_lines = []

  capitalize: (s) ->
    s.charAt(0).toUpperCase() + s.slice(1)

  add_line: (line) ->
    @gen_lines.push(line)

  add_newline: ->
    @gen_lines.push('')

  log: (msg) ->
    console.log('JavaGenerator: ' + msg)


root = exports ? this
root.JavaGenerator = JavaGenerator
