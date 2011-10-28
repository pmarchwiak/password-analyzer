var passwords = require("passwords");

function test() {
  console.log("entered test");
}

function analyze(options, callback) {
  console.log("analyze called");
  console.log("option1:" + options.option1);
  
  var results = []
  passwords.search({onComplete:
    function (credentials) {
      var dupes = {}
      credentials.forEach(function(cred) {
        console.log(cred.url);
        console.log(cred.username);
        console.log(cred.password);
        if (cred.password in dupes) {
          dupes[cred.password].push(cred.formSubmitURL);
        }
        else {
          dupes[cred.password] = [cred.formSubmitURL];
        }
        results.push(cred);
      });
      console.log("Dupes: " + dupes.toSource());
      
      results.forEach(function(cred) {
        var numDupes = dupes[cred.password].length.toString();
        if (numDupes == 1) {
          numDupes = 'None';
        }
        cred.numDupes = numDupes;
      });
      
      console.log("Returning " + results.length + " results.");
      console.log(results.toSource());
      callback(results);
    }
  });
}

function testLength() {
  
}

exports.analyze = analyze;
