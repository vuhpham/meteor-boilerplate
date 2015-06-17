var Fiber = Npm.require('fibers');
var bodyParser = Npm.require('body-parser');
var saml = Npm.require('passport-saml');
var fs = Npm.require('fs');
var url = Npm.require('url');

var samlOpts = {};

var init = function() {
  RoutePolicy.declare(Meteor.settings.private.saml.callbackUrl, 'network');

  samlOpts = _.pick(Meteor.settings.private.saml, "path", "protocol", "callbackUrl",
      "entryPoint", "issuer", "cert", "privateCert", "decryptionPvk", "additionalParams",
      "additionalAuthorizeParams", "identifierFormat", "acceptedClockSkewMs",
      "attributeConsumingServiceIndex", "disableRequestedAuthnContext", "authnContext",
      "forceAuthn", "validateInResponseTo", "requestIdExpirationPeriodMs",
      "cacheProvider", "passReqToCallback", "logoutUrl", "additionalLogoutParams",
      "serviceProviderCert", "metadataUrl");

  if (samlOpts.decryptionPvk) {
    samlOpts.decryptionPvk = fs.readFileSync(samlOpts.decryptionPvk, 'utf-8');
  }

  if (samlOpts.cert) {
    samlOpts.cert = fs.readFileSync(samlOpts.cert, 'utf-8');
  }

  if (samlOpts.serviceProviderCert) {
    samlOpts.serviceProviderCert = fs.readFileSync(samlOpts.serviceProviderCert, 'utf-8');
  }

  if (samlOpts.callbackUrl) {
    samlOpts.callbackUrl = Meteor.absoluteUrl() + samlOpts.callbackUrl.substring(1);
  }

  Accounts.saml.samlStrategy = new saml.Strategy(samlOpts,
      function(profile, done) {
        return done(null, profile);
      }
  );

};

init();

Accounts.registerLoginHandler(function(loginRequest) {
  if (loginRequest.credentialToken && loginRequest.saml) {
    var samlResponse = Accounts.saml.retrieveCredential(loginRequest.credentialToken);
    if (samlResponse) {
      updateUserProfile(samlResponse);
      var user = Meteor.users.findOne({
        "profile.email": samlResponse.profile.email
      });
      return addLoginTokenToUser(user);
    } else {
      throw new Error("Could not find a profile with the specified credentialToken.");
    }
  }
});

var updateUserProfile = function(samlResponse) {
  var user = Meteor.users.findOne({
    "profile.email": samlResponse.profile.email
  });

  var service = samlResponse.profile;

  var profile = {
    email: service.email
  };
  if (service.firstname && service.lastname) {
    profile.name = service.firstname + " " + service.lastname;
  }
  else {
    profile.name = profile.email;
  }
  service.name = profile.name;

  if (service.role) {
    profile.title = service.role;
  }

  if (!service.id) {
    service.id = Random.id();
  }

  if (!user) {
    try {
      Meteor.users.insert({
        profile: profile,
        createdAt: new Date(),
        services: {
          adfs: service
        }
      });
    } catch (e) {
      throw new Error("Insert failed: " + e);
    }
  }
  else {
    Meteor.users.update({_id: user._id}, {$set: {'services.adfs': service}});
  }
};

var addLoginTokenToUser = function(user) {
  var stampedToken = Accounts._generateStampedLoginToken();
  Meteor.users.update(user, {
    $push: {
      'services.resume.loginTokens': stampedToken
    }
  });
  return {
    userId: user._id,
    token: stampedToken.token
  };
};

// Listen to incoming SAML http requests
WebApp.connectHandlers
    .use(bodyParser.urlencoded({
      extended: false
    }))
    .use(function(req, res, next) {
      Fiber(function() {
        try {
          // redirect to IdP (SP -> IdP)
          if (url.parse(req.url).pathname === Meteor.settings.private.saml.loginUrl) {
            res.writeHead(302, {
              'Location': Meteor.settings.private.saml.entryPoint
            });
            res.end();
          }
          // callback from IdP (IdP -> SP)
          else if (req.url === Meteor.settings.private.saml.callbackUrl) {
            Accounts.saml.samlStrategy._saml.validatePostResponse(req.body, function(err, result) {
              if (!err) {
                var credentialToken = Random.id();
                Accounts.saml.insertCredential(credentialToken, result);

                res.writeHead(200, {
                  'Content-Type': 'text/html'
                });
                var content = "<html><head><script>" +
                    "window.location.href = '/saml/" + credentialToken + "';" +
                    "</script></head></html>'";

                res.end(content, 'utf-8');
              } else {
                onSamlEnd(err, res);
              }
            });
          }
          // metadata requests
          else if (Meteor.settings.private.saml.metadataUrl && req.url === Meteor.settings.private.saml.metadataUrl) {
            res.writeHead(200, {
              'Content-Type': 'application/xml'
            });
            res.end(Accounts.saml.samlStrategy._saml.generateServiceProviderMetadata(samlOpts.serviceProviderCert), 'utf-8');
          }
          // Ignore requests that aren't for SAML.
          else {
            next();
            return;
          }
        } catch (err) {
          onSamlEnd(err, res);
        }
      }).run();
    });

var onSamlEnd = function(err, res) {
  res.writeHead(200, {
    'Content-Type': 'text/html'
  });
  var content = err ? "An error occured in the SAML Middleware process." : "<html><head><script>" +
  "window.location.href = '/';" +
  "</script></head></html>'";
  res.end(content, 'utf-8');
};