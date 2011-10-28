var passwords = require("passwords");

function test() {
  console.log("entered test");
}

function analyze(options, callback) {
  console.log("analyze called");
  console.log("option1:" + options.option1);
  
  var results = []
  passwords.search({onComplete:
    function onComplete(credentials) {
      credentials.forEach(function(cred) {
        console.log(cred.url);
        console.log(cred.username);
        console.log(cred.password);
        results.push(cred);
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
