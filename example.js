(function() {
  var Fxml2j, config_json, config_obj, fs, fxml, sprintf;

  fs = require('fs');

  sprintf = require("sprintf-js").sprintf;

  Fxml2j = require("./lib/fxml2j.js").Fxml2j;

  config_json = fs.readFileSync('fxml2j.json', 'utf-8');

  config_obj = JSON.parse(config_json);

  console.log("config_obj:\n" + JSON.stringify(config_obj, null, 2));

  fxml = new Fxml2j(config_obj);

  fxml.on("done", (function(_this) {
    return function(event_obj) {
      return console.log("Fxml2j.parse obj:\n" + JSON.stringify(event_obj, null, 2));
    };
  })(this));

  fxml.parse_and_generate();

}).call(this);
