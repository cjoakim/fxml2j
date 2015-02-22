
fs      = require('fs')
sprintf = require("sprintf-js").sprintf

# require the 'fxml2j' library:
Fxml2j = require("./lib/fxml2j.js").Fxml2j

# configure the library, either with a json file or manually created object:
config_json = fs.readFileSync('fxml2j.json', 'utf-8')
config_obj  = JSON.parse(config_json)
console.log("config_obj:\n" + JSON.stringify(config_obj, null, 2))

# construct a Fxml2j object, invoke 'parse_and_generate', and hand its callback: 
fxml = new Fxml2j(config_obj)
fxml.on "done", (event_obj) =>
  console.log('done')
  #console.log("Fxml2j.parse obj:\n" + JSON.stringify(event_obj, null, 2))
fxml.parse_and_generate()
