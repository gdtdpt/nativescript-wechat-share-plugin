var WechatSharePlugin = require("nativescript-wechat-share-plugin").WechatSharePlugin;
var wechatSharePlugin = new WechatSharePlugin();

// TODO replace 'functionname' with an acual function name of your plugin class and run with 'npm test <platform>'
describe("functionname", function() {
  it("exists", function() {
    expect(wechatSharePlugin.functionname).toBeDefined();
  });

  it("returns a promise", function() {
    expect(wechatSharePlugin.functionname()).toEqual(jasmine.any(Promise));
  });
});