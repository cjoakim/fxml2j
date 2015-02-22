
sprintf = require("sprintf-js").sprintf


class UIComponent

  constructor: (num, tag, fxid, sax_attrs) ->
    @num        = num
    @lc_tag     = tag
    @fxml_tag   = undefined
    @fxid       = fxid
    @on         = undefined
    @on_method  = undefined
    @event_type = undefined

    attr_names = Object.getOwnPropertyNames(sax_attrs)
    for attr_name in attr_names
      if attr_name.indexOf("on") == 0
        @on = attr_name
        @on_method = sax_attrs[attr_name].slice(1)
        if attr_name.indexOf("onMouse") == 0
          @event_type = 'MouseEvent'
        else
          @event_type = 'ActionEvent'


root = exports ? this
root.UIComponent = UIComponent
