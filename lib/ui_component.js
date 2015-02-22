(function() {
  var UIComponent, root, sprintf;

  sprintf = require("sprintf-js").sprintf;

  UIComponent = (function() {
    function UIComponent(num, tag, fxid) {
      this.num = num;
      this.lc_tag = tag;
      this.fxml_tag = void 0;
      this.fxid = fxid;
    }

    UIComponent.prototype.to_string = function() {
      return sprintf("UIComponent; num: %s  lc_tag: %s  fxml_tag: %s  fxid: %s", this.num, this.lc_tag, this.fxml_tag, this.fxid);
    };

    return UIComponent;

  })();

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.UIComponent = UIComponent;

}).call(this);
