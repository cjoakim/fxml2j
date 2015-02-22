(function() {
  var CounterHash, JavaGenerator, StringBuffer, fs, path, root, sprintf;

  fs = require('fs');

  path = require('path');

  sprintf = require("sprintf-js").sprintf;

  CounterHash = require("counter-hash-js").CounterHash;

  StringBuffer = require("sb-js").StringBuffer;

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
      this.gen_lines = [];
      this.fxml_tag_hash = new CounterHash();
    }

    JavaGenerator.prototype.generate = function() {
      this.pre_generate();
      fs.writeFileSync(this.generated_filename, this.gen_lines.join("\n"), 'utf8');
      return console.log('file written:         ' + this.generated_filename);
    };

    JavaGenerator.prototype.diff = function() {
      var adds, curr_fxml_lines, curr_fxml_obj, deletes, gen_fxml_lines, gen_fxml_obj, i, j, k, l, len, len1, len2, len3, len4, len5, line, m, n, ref, ref1, results, trimmed;
      this.pre_generate();
      gen_fxml_lines = [];
      gen_fxml_obj = {};
      curr_fxml_lines = [];
      curr_fxml_obj = {};
      adds = [];
      deletes = [];
      ref = this.gen_lines;
      for (i = 0, len = ref.length; i < len; i++) {
        line = ref[i];
        if (line) {
          if (line.indexOf('@FXML') > 0) {
            trimmed = line.trim();
            gen_fxml_lines.push(trimmed);
            gen_fxml_obj[trimmed] = true;
          }
        }
      }
      this.read_current_controller_file();
      ref1 = this.curr_src_lines;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        line = ref1[j];
        if (line) {
          if (line.indexOf('@FXML') > 0) {
            trimmed = line.trim();
            curr_fxml_lines.push(trimmed);
            curr_fxml_obj[trimmed] = true;
          }
        }
      }
      for (k = 0, len2 = gen_fxml_lines.length; k < len2; k++) {
        line = gen_fxml_lines[k];
        if (curr_fxml_obj[line]) {

        } else {
          adds.push(line);
        }
      }
      for (l = 0, len3 = curr_fxml_lines.length; l < len3; l++) {
        line = curr_fxml_lines[l];
        if (gen_fxml_obj[line]) {

        } else {
          deletes.push(line);
        }
      }
      console.log('Differences - Add - ' + adds.length);
      for (m = 0, len4 = adds.length; m < len4; m++) {
        line = adds[m];
        console.log('    ' + line);
      }
      console.log('Differences - Delete - ' + deletes.length);
      results = [];
      for (n = 0, len5 = deletes.length; n < len5; n++) {
        line = deletes[n];
        results.push(console.log('    ' + line));
      }
      return results;
    };

    JavaGenerator.prototype.pre_generate = function() {
      var c, fxml_tag, i, j, k, len, len1, len2, ref, ref1, ref2;
      this.controller_package = this.determine_controller_package();
      this.controller_classname = this.determine_controller_classname();
      this.controller_filename = this.determine_controller_filename();
      this.generated_filename = this.determine_generated_filename();
      this.pre_process_ui_components();
      console.log('controller_package:   ' + this.controller_package);
      console.log('controller_classname: ' + this.controller_classname);
      console.log('controller_filename:  ' + this.controller_filename);
      this.add_line(sprintf("package %s;", this.controller_package));
      this.add_line();
      ref = this.fxml_tag_hash.sorted_keys();
      for (i = 0, len = ref.length; i < len; i++) {
        fxml_tag = ref[i];
        this.add_line(sprintf("import javafx.scene.control.%s;", fxml_tag));
      }
      this.add_newline();
      this.add_line(sprintf("public class %s {", this.controller_classname));
      this.add_newline();
      this.add_line('    // Instance variables - fx:id UI components:');
      ref1 = this.ui_components;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        c = ref1[j];
        if (c.fxid) {
          this.add_line(sprintf("    @FXML private %-16s %s;", c.fxml_tag, c.fxid));
        }
      }
      this.add_newline();
      this.add_line('    // UI Event Handler methods:');
      ref2 = this.ui_components;
      for (k = 0, len2 = ref2.length; k < len2; k++) {
        c = ref2[k];
        if (c.on_method) {
          this.add_newline();
          this.add_line(sprintf("    @FXML public void %s(%s e) {", c.on_method, c.event_type));
          this.add_newline();
          this.add_line('    }');
        }
      }
      this.add_newline();
      this.add_line('}');
      return this.add_newline();
    };

    JavaGenerator.prototype.determine_controller_package = function() {
      var tokens;
      tokens = this.controller.split('.');
      tokens.pop();
      return tokens.join('.');
    };

    JavaGenerator.prototype.determine_controller_classname = function() {
      var last_idx, tokens;
      tokens = this.controller.split('.');
      last_idx = tokens.length - 1;
      return tokens[last_idx];
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

    JavaGenerator.prototype.pre_process_ui_components = function() {
      var c, i, j, len, len1, mappings, ref, ref1, results, tag;
      mappings = this.config_obj.multiWordTagMappings;
      ref = this.ui_components;
      for (i = 0, len = ref.length; i < len; i++) {
        c = ref[i];
        tag = c.lc_tag;
        if (mappings[tag]) {
          c.fxml_tag = mappings[tag];
        } else {
          c.fxml_tag = this.capitalize(tag);
        }
      }
      ref1 = this.ui_components;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        c = ref1[j];
        results.push(this.fxml_tag_hash.increment(c.fxml_tag));
      }
      return results;
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

    JavaGenerator.prototype.capitalize = function(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    };

    JavaGenerator.prototype.add_line = function(line) {
      return this.gen_lines.push(line);
    };

    JavaGenerator.prototype.add_newline = function() {
      return this.gen_lines.push('');
    };

    JavaGenerator.prototype.log = function(msg) {
      return console.log('JavaGenerator: ' + msg);
    };

    return JavaGenerator;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.JavaGenerator = JavaGenerator;

}).call(this);
