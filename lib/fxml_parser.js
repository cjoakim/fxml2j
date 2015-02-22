(function() {
  var CounterHash, EventEmitter, FxmlParser, UIComponent, root, sax, sprintf,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  sax = require('sax');

  sprintf = require("sprintf-js").sprintf;

  EventEmitter = require('events').EventEmitter;

  CounterHash = require("counter-hash-js").CounterHash;

  UIComponent = require("./ui_component").UIComponent;

  FxmlParser = (function(superClass) {
    extend(FxmlParser, superClass);

    function FxmlParser(xml_str, opts) {
      var parser_opts;
      if (opts == null) {
        opts = {};
      }
      this.finish = bind(this.finish, this);
      this.parse = bind(this.parse, this);
      this.xml = ('' + xml_str).toString().trim();
      this.options = opts;
      this.tag_stack = [];
      this.controller = void 0;
      this.ui_components = [];
      this.component_num = 0;
      this.counter_hash = new CounterHash();
      this.curr_tag = void 0;
      this.curr_text = '';
      this.curr_prop_id = void 0;
      this.error = void 0;
      parser_opts = {};
      parser_opts.trim = true;
      parser_opts.lowercase = true;
      this.sax_stream = sax.createStream(false, parser_opts);
    }

    FxmlParser.prototype.parse = function() {
      this.sax_stream.on("opentag", (function(_this) {
        return function(node_obj) {
          var c, fxid;
          _this.tag_stack.push(node_obj.name);
          _this.curr_tag = node_obj.name;
          _this.curr_text = '';
          if (node_obj.attributes['fx:controller']) {
            _this.counter_hash.increment(node_obj.name);
            _this.controller = node_obj.attributes['fx:controller'];
            c = new UIComponent(_this.component_num, node_obj.name, fxid, node_obj.attributes);
            _this.ui_components.push(c);
          }
          if (node_obj.attributes['fx:id']) {
            _this.counter_hash.increment(node_obj.name);
            fxid = node_obj.attributes['fx:id'];
            _this.component_num = _this.component_num + 1;
            c = new UIComponent(_this.component_num, node_obj.name, fxid, node_obj.attributes);
            return _this.ui_components.push(c);
          }
        };
      })(this));
      this.sax_stream.on("closetag", (function(_this) {
        return function(tag) {
          _this.tag_stack.pop();
          _this.curr_tag = void 0;
          _this.curr_text = '';
          if (_this.curr_depth() === 0) {
            return _this.finish();
          }
        };
      })(this));
      this.sax_stream.on("text", (function(_this) {
        return function(text) {
          return _this.curr_text = _this.curr_text + text;
        };
      })(this));
      this.sax_stream.on("error", (function(_this) {
        return function(err) {
          _this.error = err;
          console.log('error: ' + JSON.stringify(err));
          _this.sax_stream.error = null;
          _this.sax_stream.resume();
          return _this.finish();
        };
      })(this));
      this.sax_stream.on("end", (function(_this) {
        return function() {
          return _this.finish();
        };
      })(this));
      if (this.error) {
        return this.finish();
      } else {
        return this.sax_stream.write(this.xml);
      }
    };

    FxmlParser.prototype.curr_path = function() {
      return this.tag_stack.slice(0).join('|');
    };

    FxmlParser.prototype.curr_full_path = function() {
      return this.tag_stack.join('|');
    };

    FxmlParser.prototype.curr_depth = function() {
      return this.tag_stack.length;
    };

    FxmlParser.prototype.finish = function() {
      var event_obj;
      event_obj = {};
      event_obj.controller = this.controller;
      event_obj.ui_components = this.ui_components;
      event_obj.error = this.error;
      return this.emit('done', event_obj);
    };

    return FxmlParser;

  })(EventEmitter);

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.FxmlParser = FxmlParser;

}).call(this);
