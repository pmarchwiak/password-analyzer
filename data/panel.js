var openBtn = document.getElementById("open-button");
var showPwLbl = document.getElementById("show-passwords-label");
var showPw = document.getElementById("show-passwords");
var infoContainer = document.getElementById("info-container");
var analyzeBtn = document.getElementById("analyze-button");
var tableContainer = document.getElementById("table-container");
  
self.port.on("report", function(report) {
  console.log("Received report:" + report);
  
  //TODO hide this in the static html rather than adding it to the dom
  var tableHtml = '<table><tr><th>URL</th><th>Problems <a href="#info">(more info)</a></th><th>Username</th>' +
    '<th>Password</th><th><input type="checkbox" id="check-all" /></th></tr>';
  
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
  tableContainer.innerHTML += tableHtml;
  
  var hiddens = document.getElementsByClassName("hide");
  for (var i = 0; i < hiddens.length; i++) {
    console.log("Showing hidden " + hiddens[i].id);
    hiddens[i].style.visibility = "visible";
  }
  
  var checkAll = document.getElementById("check-all");
  checkAll.onchange = function() {
    console.log("Clicked check all");
    var checkboxes = document.getElementsByName("tab-checkbox");
    for (var i = 0; i < checkboxes.length; i++) {
      var field = checkboxes[i];
      if (checkAll.checked) {
        field.checked = true;
      }
      else {
        field.checked = false;
      }
    }
  }
  
  analyzeBtn.value = "Analyze!"
});

analyzeBtn.onclick = function() {
  console.log("Clicked analyzer passwords");
  tableContainer.innerHTML = '';
  self.port.emit("analyze", {option1: false});
  analyzeBtn.value = "Analyzing..."
};

openBtn.onclick = function() {
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

showPw.onchange = function() {
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


