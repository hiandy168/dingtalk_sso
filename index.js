var agent = require('superagent');
var util = require('./util');

var SSO_BASE_URL = 'https://oapi.dingtalk.com';

var Api = function(conf) {
  this.SSOSecret = conf.SSOSecret;
  this.corpid = conf.corpid;
}

Api.prototype.getSSOToken = function(callback) {
  var self = this;
  agent.get(SSO_BASE_URL + '/sso/gettoken')
    .query({
      corpid: self.corpid,
      corpsecret: self.SSOSecret
    })
    .end(util.wrapper(callback));
};

//登录
Api.prototype.getSSOUserInfoByCode = function(code, callback) {
  var self = this;
  self.getSSOToken(function(err, token) {
    if (err) {
      return callback(err);
    };
    agent.get(SSO_BASE_URL + '/sso/getuserinfo')
      .query({
        code: code,
        access_token: token.access_token
      })
      .end(util.wrapper(callback));
  });
};

//生成授权链接
Api.prototype.generateAuthUrl = function(redirect_url) {
  return 'https://oa.dingtalk.com/omp/api/micro_app/admin/landing?corpid=' + 
  this.corpid + '&redirect_url=' + redirect_url;
};


module.exports = Api;