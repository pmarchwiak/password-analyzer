const widgets = require("widget");
const tabs = require("tabs");
const panel = require("panel");
const data = require("self").data;
const analyzer = require("pw-analyzer");
const passwords = require("passwords");

var pwPanel = panel.Panel({
  width: 800,
  height: 800,
  contentURL: data.url("panel.html"),
  contentScriptFile: [data.url("jquery-1.7.1.min.js"), data.url("panel.js")]
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

pwPanel.port.on("analyze", function(options) {
  console.log("analyzer event received");
  analyzer.analyze(options, function(results) {
    console.log("emmitting report " + results);
    pwPanel.port.emit("report", results);
  });
});

pwPanel.port.on("resize", function(options) {
  console.log("resize event received, resizing to " + 
    options.width + "x" + options.height);
  pwPanel.resize(options.width, options.height);
});

console.log("The add-on is running.");
