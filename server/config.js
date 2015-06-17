// Config for oauth packages
ServiceConfiguration.configurations.upsert(
	{ service: "azureAd"},
	{ $set: {
		tenantId: Meteor.settings.private.azureAd.tenantId,
		clientId: Meteor.settings.private.azureAd.clientId,
		secret: Meteor.settings.private.azureAd.secret,
		loginStyle: "redirect"
	} }
);