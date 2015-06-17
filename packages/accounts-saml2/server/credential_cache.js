var Fiber = Npm.require('fibers');
if (!Accounts.saml) {
  Accounts.saml = {};
}

SamlToken = new Mongo.Collection("saml_token");

Accounts.saml._loginResultForCredentialToken = {};

Accounts.saml.insertCredential = function(credentialToken, profile) {
  var filteredProfile = {};
  for (var key in profile) {
    if (typeof profile[key] == "string" || Accounts.saml.getSamlAttributeFriendlyName(key) == 'platform') {
      if (Accounts.saml.isSamlAttribute(key)) {
        filteredProfile[Accounts.saml.getSamlAttributeFriendlyName(key)] = profile[key];
      }
    }
  }
  Fiber(function() {
    SamlToken.insert({
      credentialToken: credentialToken,
      profile: filteredProfile
    });
  }).run();
};

// Retrieved in account login handler
Accounts.saml.retrieveCredential = function(credentialToken) {
  var token = SamlToken.findOne({
    credentialToken: credentialToken
  });
  if (!token) throw new Error("Coudn't find cached token in server");
  SamlToken.remove({credentialToken: credentialToken});
  return token;
};