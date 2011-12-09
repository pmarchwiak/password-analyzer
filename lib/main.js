const widgets = require("widget");
const tabs = require("tabs");
const panel = require("panel");
const data = require("self").data;
const analyzer = require("pw-analyzer");
const passwords = require("passwords");

var pwPanel = panel.Panel({
  width:800,
  height:800,
  contentURL: data.url("start.html"),
  contentScriptFile: [data.url("start.js"), data.url("jquery-1.6.4.min.js")]
});

var widget = widgets.Widget({
  id: "open-pw-analyzer",
  label: "Password Analyzer",
  contentURL: data.url("icon.png"),
  panel: pwPanel,
  onClick: function() {
    this.panel.show();
  }
});

pwPanel.show();
pwPanel.port.on("analyze", function(options) {
  console.log("analyzer event received");
  analyzer.analyze(options, function(results) {
    console.log("emmitting report " + results);
    pwPanel.port.emit("report", results);
  });
});

console.log("The add-on is running.");
