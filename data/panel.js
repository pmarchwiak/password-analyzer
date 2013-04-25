var openBtn = $("#open-button");
var showPwLbl = $("#show-passwords-label");
var showPw = $("#show-passwords");
var infoContainer = $("#info-container");
var analyzeBtn = $("#analyze-button");
var tableContainer = $("#table-container");

var height = 800;
var width = 1000;
var screenWidth = window.screen.availWidth - 100;
var screenHeight = window.screen.availHeight - 100;
width = screenWidth <= width ? screenWidth : width;
height = screenHeight <= height ? screenHeight : height;
console.debug("Available res is " + (screenWidth + 100) + "x" + 
  (screenHeight + 100));

self.port.emit("resize", {height: height, width: width});
self.port.on("report", function(report) {
  console.debug("Received report:" + report);
  
  if (report.all.length == 0 || report.all[0].score == 0) {
    tableContainer.append("<span>").text("No problems found");
  }
  else {
    var table = $('<table/>').appendTo(tableContainer);
    table.css('width', width - 100);
    $('<tr><th>URL</th>' + 
      '<th>Problems <a href="#info">(more info)</a></th>' +
      '<th>Username</th><th>Password</th>' +
      '<th class="checkbox-col">' +
      '<input type="checkbox" id="check-all" /></th></tr>"').appendTo(table);
    
    for (var n = 0; n < report.all.length; n++) {
      var entry = report.all[n];
      console.debug("Appending " + entry.toSource() + " to report");
      
      // TODO consider using a templating language instead of this ugliness
      // build dynamic table content with jquery so that all content is escaped
      var row = $('<tr/>').appendTo(table);
      var col = $('<td/>').appendTo(row);
      var url = entry.formSubmitURL ? entry.formSubmitURL : entry.url;
      $('<a/>', {href: url, 
                target: '_blank', 
                text: url}).appendTo(col);
      
      col = $('<td/>').appendTo(row);
      var list = $('<ul/>').appendTo(col);
      for (var i = 0; i < entry.issues.length; i++) {
        list.append($('<li/>', {text: entry.issues[i]}));
      }
      row.append($('<td/>', {text: entry.username}));
      
      var pwCol = $('<td/>', {"class": 'password'}).appendTo(row);
      var inputType = showPw.prop('checked') ? 'text': 'password'; 
      pwCol.append($('<input/>', {"class": 'password-field', type: inputType,
        disabled: 'disabled', value: entry.password}));
      var checkBoxCol = $('<td class="checkbox-col"/>').appendTo(row);

      // enable checkbox if "bad"      
      var checked = entry.score > 0;
      checkBoxCol.append($('<input/>', {name:'tab-checkbox', 
        value: url, type: 'checkbox', checked: checked}));
    }
    
    var checkAll = $("#check-all");
    checkAll.change(function() {
      console.debug("Clicked check all");
      var checkAllState = checkAll.prop('checked');
      console.debug("Check all state: " + checkAllState);
      $("input[name=tab-checkbox]").prop('checked', checkAllState);
    });
    
    $(".hidden").show();
  }
  
  analyzeBtn.val("Analyze!");
});

analyzeBtn.click(function() {
  console.debug("Clicked analyzer passwords");
  tableContainer.empty();
  self.port.emit("analyze", {});
  analyzeBtn.val("Analyzing...");
});

openBtn.click(function() {
  console.debug("Clicked open tabs button");
  var urls = {}; // treat this as a set (js doesn't have them!)
  $("input[name=tab-checkbox]").each(function(i) {
    if (this.checked) {
      urls[this.value] = 1;
    }
  });

  console.debug("urls: " + urls);
  // open each unique url
  for (var url in urls) {
    window.open(url);
  }
});

showPw.change(function() {
  console.debug("Clicked show-passwords");
  $(".password-field").each(function(i){
    if (this.type == "text") {
      this.type = "password";
    }
    else {
      this.type = "text";
    }
  });
});
