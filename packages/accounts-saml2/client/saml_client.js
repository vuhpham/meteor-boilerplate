if (!Accounts.saml) {
  Accounts.saml = {};
}

Accounts.saml.initiateLogin = function() {
  window.location.href = Meteor.absoluteUrl("login");
};

Meteor.loginWithSaml = function() {
  Accounts.saml.initiateLogin();
};