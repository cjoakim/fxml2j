(function() {
  var Fxml2j, config_json, config_obj, fs, fxml, sprintf;

  fs = require('fs');

  sprintf = require("sprintf-js").sprintf;

  Fxml2j = require("./lib/fxml2j.js").Fxml2j;

  config_json = fs.readFileSync('fxml2j.json', 'utf-8');

  config_obj = JSON.parse(config_json);

  console.log("config_obj:\n" + JSON.stringify(config_obj, null, 2));

  console.log('generate...');

  fxml = new Fxml2j(config_obj);

  fxml.generate();

  console.log('diff...');

  fxml = new Fxml2j(config_obj);

  fxml.diff();

}).call(this);
