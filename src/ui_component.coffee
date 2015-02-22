
sprintf = require("sprintf-js").sprintf


class UIComponent

  constructor: (num, tag, fxid) ->
    @num      = num
    @lc_tag   = tag
    @fxml_tag = undefined
    @fxid     = fxid

  to_string: ->
    sprintf("UIComponent; num: %s  lc_tag: %s  fxml_tag: %s  fxid: %s", @num, @lc_tag, @fxml_tag, @fxid)


root = exports ? this
root.UIComponent = UIComponent
