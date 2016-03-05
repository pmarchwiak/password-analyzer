var pwa = require("../lib/pw-analyzer.js")

exports["test_entropy"] = function(assert) {
  var entr = pwa.entropy("1234");
  assert.ok(entr > 13 && entr < 14, "very low entropy detected");

  entr = pwa.entropy("sdfkSDJF");
  assert.ok(entr > 45 && entr < 46, "decent entropy password detected");

  entr = pwa.entropy("23klsdA@k");
  assert.ok(entr > 52, "high entropy detected");
}

exports["test_common"] = function(assert) {
  var result = {"password": "password", "issues":[]};
  assert.ok(pwa.testCommon(result) == 1, "found common password");

  result['password'] = "oif092j3r0jpsfdj";
  assert.ok(pwa.testCommon(result) == 0, "uncommon password passed");
}

require("sdk/test").run(exports);
