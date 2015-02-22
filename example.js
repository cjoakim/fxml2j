(function() {
  var Fxml2j, config_json, config_obj, fs, fxml;

  fs = require('fs');

  Fxml2j = require("./lib/fxml2j.js").Fxml2j;

  config_json = fs.readFileSync('fxml2j.json', 'utf-8');

  config_obj = JSON.parse(config_json);

  console.log('');

  console.log("process, with both 'generate' and 'diff', per config_obj");

  fxml = new Fxml2j(config_obj);

  fxml.process();

}).call(this);
