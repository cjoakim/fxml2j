(function() {
  var EventEmitter, FxmlParser, root, sax, sprintf,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  sax = require('sax');

  sprintf = require("sprintf-js").sprintf;

  EventEmitter = require('events').EventEmitter;

  FxmlParser = (function(superClass) {
    extend(FxmlParser, superClass);

    function FxmlParser(xml_str, opts) {
      var parser_opts;
      if (opts == null) {
        opts = {};
      }
      this.finish = bind(this.finish, this);
      this.parse = bind(this.parse, this);
      this.verbose = bind(this.verbose, this);
      this.sys_config = new SysConfig();
      this.start_time_ms = this.sys_config.curr_epoch_ms();
      this.xml = ('' + xml_str).toString().trim();
      this.options = opts;
      this.root_tag = 'prop_set';
      this.tag_stack = [];
      this.paths = [];
      this.end_reached = false;
      this.curr_tag = void 0;
      this.curr_text = '';
      this.curr_prop_id = void 0;
      this.error = void 0;
      parser_opts = {};
      parser_opts.trim = true;
      parser_opts.lowercase = true;
      this.sax_stream = sax.createStream(false, parser_opts);
    }

    FxmlParser.prototype.verbose = function() {
      return this.options.verbose;
    };

    FxmlParser.prototype.parse = function() {
      this.sax_stream.on("opentag", (function(_this) {
        return function(node) {
          var d, msg, p;
          _this.tag_stack.push(node.name);
          _this.curr_tag = node.name;
          _this.curr_text = '';
          p = _this.curr_path();
          d = _this.curr_depth();
          if (_this.verbose()) {
            msg = sprintf("FxmlParser on opentag: %s  path: %s  depth: %s", JSON.stringify(node), p, d);
            _this.log(msg);
          }
          switch (p) {
            case 'prop_set|prop':
              _this.curr_prop_id = node.attributes['id'];
              if (_this.curr_prop_id) {
                _this.curr_prop_id = _this.curr_prop_id.replace(/\\/g, '');
                _this.curr_prop_id = _this.curr_prop_id.replace(/\"/g, '');
              }
              if (_this.verbose()) {
                return _this.log('FxmlParser.startElement; curr_prop_id: ' + _this.curr_prop_id);
              }
          }
        };
      })(this));
      this.sax_stream.on("closetag", (function(_this) {
        return function(tag) {
          var d, key, p;
          p = _this.curr_path();
          d = _this.curr_depth();
          if ((d === 3) && _this.curr_prop_id) {
            key = '' + _this.curr_prop_id;
            _this.props[key] = _this.curr_text;
            if (_this.verbose()) {
              _this.log('FxmlParser on closetag; d3: ' + key);
            }
          }
          if (d === 2) {
            _this.curr_prop_id = void 0;
          }
          _this.tag_stack.pop();
          _this.curr_tag = void 0;
          _this.curr_text = '';
          if (tag === _this.root_tag) {
            _this.end_reached = true;
            if (_this.verbose()) {
              _this.log('FxmlParser; end root_tag encountered');
            }
            return _this.finish();
          }
        };
      })(this));
      this.sax_stream.on("text", (function(_this) {
        return function(text) {
          _this.curr_text = _this.curr_text + text;
          if (_this.verbose()) {
            return _this.log('FxmlParser on text: ' + text);
          }
        };
      })(this));
      this.sax_stream.on("error", (function(_this) {
        return function(err) {
          _this.error = err;
          _this.log('FxmlParser on error: ' + JSON.stringify(err));
          _this.sax_stream.error = null;
          _this.sax_stream.resume();
          return _this.finish();
        };
      })(this));
      this.sax_stream.on("end", (function(_this) {
        return function() {
          if (_this.verbose()) {
            return _this.log('FxmlParser on end');
          }
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

    FxmlParser.prototype.log = function(msg) {
      if (this.options.verbose) {
        if (msg && (msg.length > 0)) {
          IpcLogger.log(msg);
        }
        return this.log_writes = this.log_writes + 1;
      }
    };

    FxmlParser.prototype.finish = function() {
      var event_obj;
      event_obj = {};
      event_obj.props = this.props;
      event_obj.error = this.error;
      event_obj.end_reached = this.end_reached;
      event_obj.elapsed_ms = (this.sys_config.curr_epoch_ms()) - this.start_time_ms;
      this.log('FxmlParser.finish: ' + JSON.stringify(event_obj));
      this.gc();
      return this.emit('done', event_obj);
    };

    return FxmlParser;

  })(EventEmitter);

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.FxmlParser = FxmlParser;

}).call(this);
