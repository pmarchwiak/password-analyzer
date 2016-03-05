var ui = require("sdk/ui");
var tabs = require("sdk/tabs");
var panel = require("sdk/panel");
var analyzer = require("./pw-analyzer.js");

var pwPanel = panel.Panel({
  width: 800,
  height: 800,
  contentURL: "./panel.html",
  contentScriptFile: ["./jquery-1.7.1.min.js", "./panel.js"]
});

var widget = ui.ActionButton({
  id: "open-pw-analyzer",
  label: "Password Analyzer",
  icon: "./icon.png",
  // panel: pwPanel,
  onClick: function() {
    pwPanel.show();
  }
});

pwPanel.port.on("analyze", function(options) {
  console.debug("analyzer event received");
  analyzer.analyze(options, function(results) {
    console.debug("emmitting report");
    pwPanel.port.emit("report", results);
  });
});

pwPanel.port.on("resize", function(options) {
  console.debug("resize event received, resizing to " +
    options.width + "x" + options.height);
  pwPanel.resize(options.width, options.height);
});

console.debug("The add-on is running.");
