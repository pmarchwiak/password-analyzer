var analyzeButton = document.getElementById("analyze-button");
console.log("Got analyze button " + analyzeButton);

self.port.on("report", function(report) {
  console.log("Received report:" + report);
  var tbody = $("#report-table");
  for (var i = 0; i < report.length; i++) {
    entry = report[i];
    console.log("Appending " + entry.toSource() + " to report");
    
    // TODO consider using a templating language instead
    tbody.append('<tr><td><a href="' + entry.formSubmitURL + 
      '" target="_blank">' + entry.url + '</a></td>' + 
      '<td>' + entry.password.length + '</td>' + 
      '<td>' + entry.numDupes + '</td>' +
      '</tr>');
  }
});

analyzeButton.onclick = function() {
  console.log("Clicked analyzer passwords");
  self.port.emit("analyze", {option1: false});
};
