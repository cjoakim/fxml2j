
Fxml2j = require("./lib/fxml2j.js").Fxml2j

opts = {}
fxml = new Fxml2j(opts)
fxml.on "done", (event_obj) =>
  console.log(JSON.stringify(event_obj, null, 2))
fxml.parse()
