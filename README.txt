I. Prerequisite
  1. Install Node: https://nodejs.org/
  2. Install MongoDB: https://www.mongodb.org/
  3. Install Meteor: https://www.meteor.com/install

II. Run and test app in local
  1. Set endpoints in settings.json
  2. Execute run.sh (For more info: http://docs.meteor.com/#/full/commandline)

III. Deploy to Azure VM
  1. We are using MUP project for deploying app to serve. For installation and initialization, checkout: https://github.com/arunoda/meteor-up
  2. Config server information in mup.json
  3. Run command line “mup setup” to setup enviroment
  4. Run command line “mup deploy” to deploy app into VM

Notes & tips:
  - Make sure you filled settings.json properly with ADFS SAML and Azure AD Oauth properties.
  - You might need to increase DeployWaitTime in mup.json if your server coudn't finish by default time (15 seconds).
  - You can trace deploy logs by excute "mup logs -f" in mup project (where mup.json is located).
  - You might want to use Docker to save your deploy stage image for later useage. (https://www.docker.com/tryit/)
