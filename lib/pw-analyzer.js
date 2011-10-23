var passwords = require("passwords");

function test() {
  console.log("entered test");
}

function analyze(options) {
  console.log("analyze called");
  console.log("option1:" + options.option1);
  testLength();
}

function testLength() {
  passwords.search({onComplete:
    function onComplete(credentials) {
      credentials.forEach(function(credential) {
        console.log(credential.username);
        console.log(credential.password);
      });
    }
   });
}

exports.analyze = analyze;
