const widgets = require("widget");
const tabs = require("tabs");
const panel = require("panel");
const data = require("self").data;
const analyzer = require("pw-analyzer")

var pwPanel = panel.Panel({
  contentURL: data.url("start.html"),
  contentScriptFile: data.url("start.js")
});


var widget = widgets.Widget({
  id: "open-pw-analyzer",
  label: "Password Analyzer",
  content: "PA",
  panel: pwPanel,
  onClick: function() {
    this.panel.show();
  }
});

pwPanel.show();
pwPanel.port.on("analyze", function(options) {
  console.log("analyzer event received");
  analyzer.analyze(options);
});

console.log("The add-on is running.");
