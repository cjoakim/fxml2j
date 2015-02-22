(function() {
  var EventEmitter, Fxml2j, root,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  EventEmitter = require('events').EventEmitter;

  Fxml2j = (function(superClass) {
    extend(Fxml2j, superClass);

    function Fxml2j(opts) {
      if (opts == null) {
        opts = {};
      }
      this.finish = bind(this.finish, this);
      this.finish_obj = {};
    }

    Fxml2j.prototype.parse = function() {
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
