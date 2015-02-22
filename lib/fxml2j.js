(function() {
  var EventEmitter, Fxml2j, FxmlParser, UIComponent, fs, path, root,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs');

  path = require('path');

  EventEmitter = require('events').EventEmitter;

  FxmlParser = require("./fxml_parser").FxmlParser;

  UIComponent = require("./ui_component").UIComponent;

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
            _this.finish_obj.parse_event_obj = parse_event_obj;
            return _this.finish();
          };
        })(this));
        return parser.parse();
      } else {
        return this.finish_obj.error = 'fxml_filename does not exist: ' + fxml_filename;
      }
    };

    Fxml2j.prototype.log = function(msg) {
      if (this.config_obj.verbose) {
        return console.log('Fxml2j: ' + msg);
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
