
fs      = require('fs')
sprintf = require("sprintf-js").sprintf

# require the 'fxml2j' library:
Fxml2j = require("./lib/fxml2j.js").Fxml2j

# configure the library, either with a json file or manually created object:
config_json = fs.readFileSync('fxml2j.json', 'utf-8')
config_obj  = JSON.parse(config_json)
console.log("config_obj:\n" + JSON.stringify(config_obj, null, 2))

console.log('generate...')
fxml = new Fxml2j(config_obj)
fxml.generate()

console.log('diff...')
fxml = new Fxml2j(config_obj)
fxml.diff()
