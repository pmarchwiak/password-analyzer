var openBtn = $("#open-button");
var showPwLbl = $("#show-passwords-label");
var showPw = $("#show-passwords");
var infoContainer = $("#info-container");
var analyzeBtn = $("#analyze-button");
var tableContainer = $("#table-container");

var height = 800;
var width = 800;
var screenWidth = window.screen.availWidth - 100;
var screenHeight = window.screen.availHeight - 100;
width = screenWidth <= width ? screenWidth : width;
height = screenHeight <= height ? screenHeight : height;
console.log("Available res is " + (screenWidth + 100) + "x" + 
  (screenHeight + 100));

self.port.emit("resize", {height: height, width: width});
self.port.on("report", function(report) {
  console.log("Received report:" + report);
  
  if (report.all.length == 0 || report.all[0].score == 0) {
    tableContainer.append("<span>").text("No problems found");
  }
  else {
    var table = $('<table/>').appendTo(tableContainer);
    $('<tr><th>URL</th>' + 
      '<th>Problems <a href="#info">(more info)</a></th>' +
      '<th>Username</th><th>Password</th>' +
     '<th><input type="checkbox" id="check-all" /></th></tr>"').appendTo(table);
    
    for (var n = 0; n < report.all.length; n++) {
      var entry = report.all[n];
      console.log("Appending " + entry.toSource() + " to report");
      
      // TODO consider using a templating language instead of this ugliness
      var row = $('<tr/>').appendTo(table);
      var col = $('<td/>').appendTo(row);
      $('<a/>', {href: entry.formSubmitURL, 
                target: '_blank', 
                text: entry.formSubmitURL}).appendTo(col);
      
      col = $('<td/>').appendTo(row);
      var list = $('<ul/>').appendTo(col);
      for (var i = 0; i < entry.issues.length; i++) {
        list.append($('<li/>', {text: entry.issues[i]}));
      }
      row.append($('<td/>', {text: entry.username}));
      
      var pwCol = $('<td/>', {"class": 'password'}).appendTo(row);
      pwCol.append($('<input/>', {"class": 'password-field', type: 'password',
        disabled: 'disabled', value: entry.password}));
      var checkBoxCol = $('<td/>').appendTo(row);

      // enable checkbox if "bad"      
      var checked = entry.score > 0 ? 'checked="on"' : "";
      checkBoxCol.append($('<input/>', {name:'tab-checkbox', 
        value: entry.formSubmitURL, type: 'checkbox', checked: checked}));
    }
    
    var checkAll = $("#check-all");
    checkAll.change(function() {
      console.log("Clicked check all");
      var checkAllState = checkAll.checked;
      $("input[name='tab-checkbox']").prop('checked', checkAllState);
    });
    
    //console.log("Showing hiddens");
    $("#hide").show();
  }
  
  analyzeBtn.val("Analyze!");
});

analyzeBtn.click(function() {
  console.log("Clicked analyzer passwords");
  tableContainer.empty();
  self.port.emit("analyze", {option1: false});
  analyzeBtn.val("Analyzing...");
});

openBtn.click(function() {
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
});

showPw.change(function() {
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
});
