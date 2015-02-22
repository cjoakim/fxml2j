(function() {
  var EventEmitter, Fxml2j, FxmlParser, JavaGenerator, UIComponent, fs, path, root, sprintf,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs');

  path = require('path');

  sprintf = require("sprintf-js").sprintf;

  EventEmitter = require('events').EventEmitter;

  FxmlParser = require("./fxml_parser").FxmlParser;

  UIComponent = require("./ui_component").UIComponent;

  JavaGenerator = require("./java_generator").JavaGenerator;

  Fxml2j = (function(superClass) {
    extend(Fxml2j, superClass);

    function Fxml2j(config_obj) {
      if (config_obj == null) {
        config_obj = {};
      }
      this.finish = bind(this.finish, this);
      this.config_obj = config_obj;
      this.javafx_src_dir = this.config_obj.javafx_src_dir;
      this.fxml_filename = this.config_obj.fxml_filename;
      this.fxml_filename = this.javafx_src_dir + path.sep + this.fxml_filename;
      this.finish_obj = {};
    }

    Fxml2j.prototype.parse_and_generate = function() {
      var parser, xml_str;
      if (this.fxml_filename) {
        xml_str = fs.readFileSync(this.fxml_filename, 'utf-8');
        parser = new FxmlParser(xml_str, this.config_obj);
        parser.on("done", (function(_this) {
          return function(parse_event_obj) {
            var generator;
            _this.finish_obj.parse_event_obj = parse_event_obj;
            console.log('fxml parsed; controller is:    ' + parse_event_obj.controller);
            console.log('fxml parsed; fx:id components: ' + parse_event_obj.ui_components.length);
            generator = new JavaGenerator(_this.config_obj, parse_event_obj);
            generator.generate();
            return _this.finish();
          };
        })(this));
        return parser.parse();
      } else {
        return this.finish_obj.error = 'fxml_filename does not exist: ' + fxml_filename;
      }
    };

    Fxml2j.prototype.finish = function() {
      return this.emit('done', this.finish_obj);
    };

    return Fxml2j;

  })(EventEmitter);

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.Fxml2j = Fxml2j;

}).call(this);
