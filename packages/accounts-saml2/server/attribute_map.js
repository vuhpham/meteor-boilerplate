/* SAML Attributes cannot be stored directly in Mongo due to dot notation.
 * This implementation converts SAML attributes to their friendly format.
 * Not all SAML attributes included.
 */
  if (!Accounts.saml) {
    Accounts.saml = {};
  }

  Accounts.saml._attributeMap = {
    "issuer": "identityprovider",
    "http://ed.sts.microsoft.com/identity/claims/firstname": "firstname",
    "http://ed.sts.microsoft.com/identity/claims/lastname": "lastname",
    "http://ed.sts.microsoft.com/identity/claims/userID": "id",
    "http://ed.sts.microsoft.com/identity/claims/accountID": "accountId",
    "http://ed.sts.microsoft.com/identity/claims/parentAccountID": "parentAccountId",
    "http://ed.sts.microsoft.com/identity/claims/rootAccountID": "rootAccountId",
    "http://ed.sts.microsoft.com/identity/claims/rootAccountName": "rootAccountName",
    "http://ed.sts.microsoft.com/identity/claims/IsInternalContact": "IsInternalContact",
    "http://ed.sts.microsoft.com/identity/claims/allow/role": "role",
    "http://ed.sts.microsoft.com/identity/claims/platform": "platform",
    "http://schemas.xmlsoap.org/claims/EmailAddress": "email"
  };

  Accounts.saml.isSamlAttribute = function (attribute) {
    return _.has(Accounts.saml._attributeMap, attribute);
  };

  Accounts.saml.getSamlAttributeFriendlyName = function (attribute) {
    return Accounts.saml._attributeMap[attribute];
  };