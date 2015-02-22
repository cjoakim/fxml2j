(function() {
  var UIComponent, root, sprintf;

  sprintf = require("sprintf-js").sprintf;

  UIComponent = (function() {
    function UIComponent(num, tag, fxid, sax_attrs) {
      var attr_name, attr_names, i, len;
      this.num = num;
      this.lc_tag = tag;
      this.fxml_tag = void 0;
      this.fxid = fxid;
      this.on = void 0;
      this.on_method = void 0;
      this.event_type = void 0;
      attr_names = Object.getOwnPropertyNames(sax_attrs);
      for (i = 0, len = attr_names.length; i < len; i++) {
        attr_name = attr_names[i];
        if (attr_name.indexOf("on") === 0) {
          this.on = attr_name;
          this.on_method = sax_attrs[attr_name].slice(1);
          if (attr_name.indexOf("onMouse") === 0) {
            this.event_type = 'MouseEvent';
          } else {
            this.event_type = 'ActionEvent';
          }
        }
      }
    }

    return UIComponent;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.UIComponent = UIComponent;

}).call(this);
