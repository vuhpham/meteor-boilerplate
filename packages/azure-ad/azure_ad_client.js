AzureAd = {};

// Request AzureAd credentials for the user
// @param options {optional}
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
AzureAd.requestCredential = function (options, credentialRequestCompleteCallback) {
    // support both (options, callback) and (callback).
    if (!credentialRequestCompleteCallback && typeof options === 'function') {
        credentialRequestCompleteCallback = options;
        options = {};
    } else if (!options) {
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({service: 'azureAd'});
    if (!config) {
        credentialRequestCompleteCallback && credentialRequestCompleteCallback(
            new ServiceConfiguration.ConfigError());
        return;
    }

    var credentialToken = Random.secret();

    // http://msdn.microsoft.com/en-us/library/azure/dn645542.aspx
    var loginStyle = OAuth._loginStyle('azureAd', config, options);

    //MUST be "popup" - currently Azure AD does not allow for url parameters in redirect URI's. If a null popup style is assigned, then
    //the url parameter "close" is appended and authentication will fail.
    // config.loginStyle = "popup";

    var baseUrl = "https://login.windows.net/" + config.tenantId + "/oauth2/authorize?";
    var loginUrl = baseUrl +
        'api-version=1.0&' +
        '&response_type=code' +
        '&prompt=login' +
        '&client_id=' + config.clientId +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken) +
        '&redirect_uri=' + OAuth._redirectUri('azureAd', config);

    OAuth.launchLogin({
        loginService: "azureAd",
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken,
        popupOptions: { height: 600 }
    });
};

OAuth.saveDataForRedirect = function (loginService, credentialToken) {
    localStorage["azure-oauth"] = JSON.stringify({loginService: loginService, credentialToken: credentialToken});
};

OAuth.getDataAfterRedirect = function () {
    var strSavedData = localStorage["azure-oauth"];
    var savedData = JSON.parse(strSavedData);
    if (!(savedData && savedData.credentialToken)) {
        return null;
    }
    var migrationData = savedData;

    var credentialToken = migrationData.credentialToken;
    var key = OAuth._storageTokenPrefix + credentialToken;
    var credentialSecret;
    try {
        credentialSecret = sessionStorage.getItem(key);
        sessionStorage.removeItem(key);
    } catch (e) {
        Meteor._debug('error retrieving credentialSecret', e);
    }
    localStorage["azure-oauth"] = null;
    return {
        loginService: migrationData.loginService,
        credentialToken: credentialToken,
        credentialSecret: credentialSecret
    };
};