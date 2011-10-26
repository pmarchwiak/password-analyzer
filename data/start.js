var analyzeButton = document.getElementById("analyze-button");
console.log("Got analyze button " + analyzeButton);

self.port.on("report", function(report) {
  console.log("Received report:" + report);
  var tbody = $("#report-table");
  for (var i = 0; i < report.length; i++) {
    entry = report[i];
    console.log("Appending " + entry.toSource() + " to report");
    tbody.append("<tr><td>" + entry.url + "</td><td>" + entry.password.length
      + "</td></tr>");
  }
});

analyzeButton.onclick = function() {
  console.log("Clicked analyzer passwords");
  self.port.emit("analyze", {option1: false});
};
