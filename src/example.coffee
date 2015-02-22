
fs = require('fs')

# require the 'fxml2j' library:
Fxml2j = require("./lib/fxml2j.js").Fxml2j

# configure the library, either with a json file or manually created object:
config_json = fs.readFileSync('fxml2j.json', 'utf-8')
config_obj  = JSON.parse(config_json)

console.log('')
console.log("process, with both 'generate' and 'diff', per config_obj")
fxml = new Fxml2j(config_obj)
fxml.process()
