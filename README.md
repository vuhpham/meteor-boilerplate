## Goal & Features
Sample, boilerplate website is written by Meteor framework. This sample supports:
  1. Standard features: Accounts, Router, etc.
  2. Microsoft Authentication: Login by Microsoft Azure AD (a fork from https://github.com/djluck/azure-active-directory) and Microsoft ADFS (SAML2). 
  3. Melding accounts: Make sure there are no 2 accounts have the same email. Eg: If user has already login by Microsoft Azure AD by john.smith@live.com and then later he uses that email to login by Microsoft ADFS, 2 services (Azure AD and ADFS) will point to only one account.
  
## Prerequisite
  1. Install Node: https://nodejs.org/
  2. Install MongoDB: https://www.mongodb.org/
  3. Install Meteor: https://www.meteor.com/install

## Run and test app in local
  1. Set endpoints in settings.json
  2. Execute run.sh (For more info: http://docs.meteor.com/#/full/commandline)

## Deploy to Azure VM
  1. We are using MUP project for deploying app to server. For installation and initialization, checkout: https://github.com/arunoda/meteor-up
  2. Config server information in mup.json
  3. Run command line “mup setup” to setup enviroment
  4. Run command line “mup deploy” to deploy app into VM

## Notes & tips:
  - Make sure you filled settings.json properly with ADFS SAML and Azure AD Oauth properties before excute deploy command.
  - You might need to increase deployCheckWaitTime in mup.json if your server coudn't finish deploying by default time (15 seconds).
  - You can trace server logs by excute "mup logs -f" in mup project (where mup.json is located).
  - Take a look on Docker for saving your deployment image. (https://www.docker.com/tryit/)
