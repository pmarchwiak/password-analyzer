self.port.on("report", function(report) {
  console.log("Received report:" + report);

  var tbody = document.getElementById("table-container");
  tbody.innerHTML = '';
  
  //TODO hide this in the static html rather than adding it to the dom
  var tableHtml = '<table><tr><th>URL</th><th>Problems <a href="#info">(more info)</a></th><th>Username</th>' +
    '<th>Password</th><th></th></tr>';
  
  for (var n = 0; n < report.all.length; n++) {
    var entry = report.all[n];
    console.log("Appending " + entry.toSource() + " to report");
    
    // TODO consider using a templating language instead of this ugliness
    tableHtml += '<tr><td>' + 
      '<a href="' + entry.formSubmitURL + '" target="_blank">' + 
      entry.url + '</a></td>';
    tableHtml += '<td><ul>';
    for (var i = 0; i < entry.issues.length; i++) {
      tableHtml += '<li>' + entry.issues[i] + '</li>';
    }
    tableHtml += '</ul></td>';
    tableHtml += '<td>' + entry.username + '</td>';
    tableHtml += '<td class="password">';
    tableHtml += '<input class="password-field" type="password"';
    tableHtml += ' disabled="disabled" value="' + entry.password + '" /></td>';
    // enable checkbox if "bad"
    var checked = entry.score > 0 ? 'checked="on"' : "";
    tableHtml += '<td><input name="tab-checkbox"' +
     ' value="' + entry.formSubmitURL + '" type="checkbox"' +
     checked + ' ></td></tr>';
  }
  tableHtml += '</table>';
  tbody.innerHTML += tableHtml;
  document.getElementById("open-button").style.visibility = "visible";
  var elems = document.getElementsByClassName("show");
  for (var i = 1; i < elems.length; i++) {
    var elem = elems[i];
    elem.style.visibility = "visible";
  };
  document.getElementById("show-passwords").style.visibility = "visible";
  document.getElementById("info-container").style.visibility = "visible";
});

document.getElementById("analyze-button").onclick = function() {
  console.log("Clicked analyzer passwords");
  self.port.emit("analyze", {option1: false});
};

document.getElementById("open-button").onclick = function() {
  console.log("Clicked open tabs button");
  var checkboxes = document.getElementsByName("tab-checkbox");
  var urls = {};
  for (var i = 0; i < checkboxes.length; i++) {
    var field = checkboxes[i];
    if (field.checked) {
      urls[field.value] = 1;
    }
  }
  
  // open each unique url
  for (var url in urls) {
    window.open(url);
  }
};

document.getElementById("show-passwords").onchange = function() {
  console.log("Clicked show-passwords");
  var fields = document.getElementsByClassName("password-field");
  for (var i = 0; i < fields.length; i++) {
    var field = fields[i];
    if (field.type == "text") {
      field.type = "password";
    }
    else {
      field.type = "text";
    }
  }
};
