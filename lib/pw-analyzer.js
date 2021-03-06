var passwords = require("sdk/passwords");
var self = require("sdk/self");

var passwordList = self.data.load("common-password-list.txt")
console.debug("Password list: " + passwordList.substring(0, 30));

function analyze(options, callback) {
  console.debug("analyze called");

  var results = {};
  passwords.search({onComplete:
    function (credentials) {
      var dupes = {};
      results.all = [];
      credentials.forEach(function(cred) {
        console.debug(cred.url);
        console.debug(cred.username);

        if (cred.password in dupes) {
          dupes[cred.password].push(cred.url);
        }
        else {
          dupes[cred.password] = [cred.url];
        }
        results.all.push(cred);
      });

      results.all.forEach(function(result) {
        result.issues = [];
        var numDupes = dupes[result.password].length.toString();
        if (numDupes == "1") {
          numDupes = 'None';
          result.score = 0;
        }
        else {
          console.debug("Found duplicates for " + result.url);
          result.score = numDupes;
          result.issues.push("Duplicate, used for " + numDupes + " other sites.");
        }
        result.numDupes = numDupes;

        result.score += testCommon(result);
        result.score += testEntropy(result);

        console.debug("Score for " + result.url + " is " + result.score);
      });

      console.debug("Returning " + results.length + " results.");

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

/**
 * The entropy of an 8-character string with a mix of upper and lower case, a
 * digit, and a special character is just over 52 so that is used as the
 * cutoff.
 **/
function testEntropy(result) {
  var pw = result.password;
  var entr = entropy(pw);
  console.debug("Entropy for " + result.username + "@" + result.url + " is " + entr);

  if (entr < 52) {
    result.lowEntropy = true;
    result.issues.push("Simple");
    return 1;
  }
  return 0;
}

/**
 * Checks if password is in common password list
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
exports.testCommon = testCommon;
