'use strict';

class ProviderConfig {
  constructor() {
    this.google = {
      host: 'www.googleapis.com',
      path: '/oauth2/v3/tokeninfo?id_token=',
      port: 443
    };

    this.amazon = {
      token: {
        host: 'api.amazon.com',
        path: '/auth/o2/tokeninfo?access_token=',
        port: 443
      },
      profile: {
        host: 'api.amazon.com',
        path: '/user/profile',
        port: 443
      }
    };

    this.facebook = {
      host: 'graph.facebook.com',
      path: '/debug_token?',
      port: 443,
      appId: 'APPID_REPLACE_ME',
      appSecret: 'SECRET_SSHHH'
    };
  }

  getGoogle() {
    return this.google;
  }

  getAmazon() {
    return this.amazon;
  }

  getFacebook() {
    return this.facebook;
  }
}

module.exports = ProviderConfig;
