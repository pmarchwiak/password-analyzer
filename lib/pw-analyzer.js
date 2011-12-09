var passwords = require("passwords");
var self = require("self");

var passwordList = self.data.load("password.lst")
console.log("Password list: " + passwordList.substring(0, 30));

function test() {
  console.log("entered test");
}

function analyze(options, callback) {
  console.log("analyze called");
  console.log("option1:" + options.option1);
  
  var results = {};
  passwords.search({onComplete:
    function (credentials) {
      var dupes = {};
      results.all = [];
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
        results.all.push(cred);
      });
      console.log("Dupes: " + dupes.toSource());
      
      results.all.forEach(function(result) {
        result.issues = [];
        var numDupes = dupes[result.password].length.toString();
        if (numDupes == "1") {
          numDupes = 'None';
          result.score = 0;
        }
        else {
          console.log("Found duplicates for " + result.url);
          result.score = 1;
          result.issues.push("Duplicate, used for " + numDupes + " other sites.");
        }
        result.numDupes = numDupes;
        
        result.score += testCommon(result);
        result.score += testEntropy(result);		
        
        
        console.log("Score for " + result.url + " is " + result.score);
      });
      
      console.log("Returning " + results.length + " results.");
      console.log(results.toSource());
      
      results.all.sort(function(a, b) {
        if (a.score > b.score) {
          return -1;
        }
        else if (a.score < b.score) {
          return 1;
        }
        return 0;
      });
      
      callback(results);
    }
  });
}

// names correspond to POSIX character classes

var digit = {re: /^\d+$/g, size: 10};
var lower = {re: /^[a-z]+$/g, size: 26};
var alpha = {re: /^[A-Za-z]+$/g, size: 52};
var alnum = {re: /^\w+$/g, size: 63}; 
var print = {re: /^[\x20-\x7E]+$/g, size: 94};
var charClasses = [digit, lower, alpha, alnum, print];

function entropy(str) {
  var cls;
  for (var i = 0; i < charClasses.length; i++) {
    cls = charClasses[i];
    if (str.match(cls.re)) {
      break;
    }  
  }
  // log_2(alphabet_size^(str_length))
  return Math.log(Math.pow(cls.size, str.length)) / Math.log(2);
}

function testEntropy(result) {
  // TODO
  var pw = result.password;
  var entr = entropy(pw);
  console.log("Entropy for " + pw + " is " + entr);
  // The entropy of an 8-character string with a mix of upper and lower case, a
  // digit, and a special character is just over 52 so that is used as the 
  // cutoff.
  if (entr < 52) {
    result.lowEntropy = true;
    result.issues.push("Simple");
    return 1;
  }
  return 0;
}

/** 
 * Checks if password is common password list
 **/
function testCommon(result) {
  if (passwordList.indexOf(result.password.toLowerCase()) != -1) {
    result.isCommon = true;
    result.issues.push("Common password");
    return 1;
  }
  else {
    result.isCommon = false;
    return 0;
  }
}

exports.analyze = analyze;
exports.entropy = entropy;
