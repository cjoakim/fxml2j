
Fxml2j = require("./lib/fxml2j.js").Fxml2j

opts = {}
opts.javafx_src_dir = 'workspace/ExampleApp/src'
opts.fxml_filename  = 'com/joakim/example/Example.fxml'
opts.verbose = true

fxml = new Fxml2j(opts)
fxml.on "done", (event_obj) =>
  console.log("Fxml2j.parse obj:\n" + JSON.stringify(event_obj, null, 2))
fxml.parse()
