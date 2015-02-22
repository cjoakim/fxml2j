(function() {
  var JavaGenerator, fs, path, root, sprintf;

  fs = require('fs');

  path = require('path');

  sprintf = require("sprintf-js").sprintf;

  JavaGenerator = (function() {
    function JavaGenerator(config_obj, parse_event_obj) {
      this.config_obj = config_obj;
      this.parse_event_obj = parse_event_obj;
      this.javafx_src_dir = this.config_obj.javafx_src_dir;
      this.fxml_filename = this.config_obj.fxml_filename;
      this.controller = this.parse_event_obj.controller;
      this.ui_components = this.parse_event_obj.ui_components;
      this.controller_package = void 0;
      this.controller_filename = void 0;
      this.generated_filename = void 0;
      this.curr_src_lines = [];
    }

    JavaGenerator.prototype.generate = function() {
      this.controller_package = this.determine_controller_package();
      this.controller_filename = this.determine_controller_filename();
      this.generated_filename = this.determine_generated_filename();
      console.log('controller_package:  ' + this.controller_package);
      console.log('controller_filename: ' + this.controller_filename);
      console.log('generated_filename:  ' + this.generated_filename);
      return this.read_current_controller_file();
    };

    JavaGenerator.prototype.determine_controller_package = function() {
      var tokens;
      tokens = this.controller.split('.');
      tokens.pop();
      return tokens.join('.');
    };

    JavaGenerator.prototype.determine_controller_filename = function() {
      var controller_path, tokens;
      tokens = this.controller.split('.');
      controller_path = (tokens.join(path.sep)) + '.java';
      return this.javafx_src_dir + path.sep + controller_path;
    };

    JavaGenerator.prototype.determine_generated_filename = function() {
      var controller_path, tokens;
      tokens = this.controller.split('.');
      controller_path = (tokens.join(path.sep)) + '.txt';
      return this.javafx_src_dir + path.sep + controller_path;
    };

    JavaGenerator.prototype.read_current_controller_file = function() {
      if (fs.existsSync(this.controller_filename)) {
        this.curr_src_lines = fs.readFileSync(this.controller_filename, 'utf-8').split("\n");
        return console.log('the controller file currently exists, line count: ' + this.curr_src_lines.length);
      } else {
        console.log('the controller file does not currently exist');
        return this.curr_src_lines = [];
      }
    };

    JavaGenerator.prototype.log = function(msg) {
      return console.log('JavaGenerator: ' + msg);
    };

    return JavaGenerator;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.JavaGenerator = JavaGenerator;

}).call(this);
