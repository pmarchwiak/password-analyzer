var pwa = require("pw-analyzer")
var testRunner;

exports.test_entropy = function(test) {
  var entr = pwa.entropy("1234");
  test.assert(entr > 13 && entr < 14);
  
  entr = pwa.entropy("sdfkSDJF");
  test.assert(entr > 45 && entr < 46);
  
  entr = pwa.entropy("23klsdA@k");
  test.assert(entr > 52);
};
