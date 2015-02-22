(function() {
  var Fxml2j, fxml, opts;

  Fxml2j = require("./lib/fxml2j.js").Fxml2j;

  opts = {};

  fxml = new Fxml2j(opts);

  fxml.on("done", (function(_this) {
    return function(event_obj) {
      return console.log(JSON.stringify(event_obj, null, 2));
    };
  })(this));

  fxml.parse();

}).call(this);
