(function() {
  var EventEmitter, Fxml2j, FxmlParser, root,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventEmitter = require('events').EventEmitter;

  FxmlParser = require("fxml_parser").FxmlParser;

  Fxml2j = (function(superClass) {
    extend(Fxml2j, superClass);

    function Fxml2j(opts) {
      if (opts == null) {
        opts = {};
      }
      this.finish = bind(this.finish, this);
      this.options = opts;
      this.finish_obj = {};
      this.fxml_filename = this.options.fxml_filename;
    }

    Fxml2j.prototype.parse = function() {
      var parser;
      parser = new FxmlParser(xml_str, this.options);
      this.finish_obj.message = 'Not implemented yet';
      return this.finish();
    };

    Fxml2j.prototype.finish = function() {
      return this.emit('done', this.finish_obj);
    };

    return Fxml2j;

  })(EventEmitter);

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.Fxml2j = Fxml2j;

}).call(this);
