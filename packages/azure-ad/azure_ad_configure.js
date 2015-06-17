Template.configureLoginServiceDialogForAzureAd.helpers({
    siteUrl: function () {
        return Meteor.absoluteUrl();
    }
});

Template.configureLoginServiceDialogForAzureAd.fields = function () {
    return [
        {property: 'clientId', label: 'Client ID'},
        {property: 'secret', label: 'Client Secret'},
        {property: 'tenantId', label: 'Tenant Id'}
    ];
};
