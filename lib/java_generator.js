(function() {
  var JavaGenerator, root, sprintf;

  sprintf = require("sprintf-js").sprintf;

  JavaGenerator = (function() {
    function JavaGenerator(config_obj, parse_event_obj) {
      this.config_obj = config_obj;
      this.parse_event_obj = parse_event_obj;
    }

    JavaGenerator.prototype.generate = function() {
      return this.log('generate - not yet implemented');
    };

    JavaGenerator.prototype.log = function(msg) {
      return console.log('JavaGenerator: ' + msg);
    };

    return JavaGenerator;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.JavaGenerator = JavaGenerator;

}).call(this);
