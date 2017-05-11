import {Observable} from 'data/observable';
import {WechatSharePlugin, WechatSharingScene, WechatSharingType} from 'nativescript-wechat-share-plugin';
import * as fs from 'file-system';

const appPath = fs.knownFolders.currentApp();
const applePath = fs.path.join(appPath.path, "img", "apple.jpg");

export class HelloWorldModel extends Observable {
  public message: string;
  private wechatSharePlugin: WechatSharePlugin;

  constructor() {
    super();

    this.wechatSharePlugin = new WechatSharePlugin(""/*YOUR_WECHAT_APP_ID*/);
    this.wechatSharePlugin.registerOnRespCallback(function (code) {
      console.log(`on resp callback: ${code}`);
    });
  }

  public shareTextToWechat(args) {
    let sharingOptions = {
      scene: WechatSharingScene.TIMELINE,
      text: "this is a test text."
    };
    this.wechatSharePlugin.share(sharingOptions);
  }

  public shareUrlToWechat(args) {
    console.log(`the apple jpg path: ${applePath}`);
    let sharingOptions = {
      scene: WechatSharingScene.TIMELINE,
      messages: {
        media: {
          type: WechatSharingType.TYPE_SHARING_WEBPAGE,
          webpageUrl: "https://open.weixin.qq.com/"
        }
      }
    };
    this.wechatSharePlugin.share(sharingOptions);
  }

  public shareLocalImageToWechat(args) {
    let sharingOptions = {
      scene: WechatSharingScene.TIMELINE,
      messages: {
        title: "test title",
        description: "test description",
        media: {
          type: WechatSharingType.TYPE_SHARING_IMAGE,
          image: applePath
        }
      }
    }
    this.wechatSharePlugin.share(sharingOptions);
  }

  public shareOnlineImageToWechat() {
    let sharingOptions = {
      scene: WechatSharingScene.TIMELINE,
      messages: {
        title: "shareOnlineImageToWechat title",
        description: "shareOnlineImageToWechat description",
        media: {
          type: WechatSharingType.TYPE_SHARING_IMAGE,
          image: "http://mmbiz.qpic.cn/mmbiz/PiajxSqBRaEIVJ6bW5EhIpIVZuxavukF9zUCzuoAKicofAtxibTBZOzsgP73GtO7jkkH2MQke21fOFC6Pnm0JvC6Q/0?wx_fmt=png/"
        }
      }
    }
    this.wechatSharePlugin.share(sharingOptions);
  }

  public shareMusicToWechat() {
    let sharingOptions = {
      scene: WechatSharingScene.TIMELINE,
      messages: {
        title: "shareMusicToWechat title",
        description: "shareMusicToWechat description",
        thumb: applePath,
        media: {
          type: WechatSharingType.TYPE_SHARING_MUSIC,
          musicUrl: "http://staff2.ustc.edu.cn/~wdw/softdown/index.asp/0042515_05.ANDY.mp3"
        }
      }
    }
    this.wechatSharePlugin.share(sharingOptions);
  }

  public shareVideoToWechat() {
    let sharingOptions = {
      scene: WechatSharingScene.TIMELINE,
      messages: {
        title: "shareMusicToWechat title",
        description: "shareMusicToWechat description",
        thumb: applePath,
        media: {
          type: WechatSharingType.TYPE_SHARING_VIDEO,
          videoUrl: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
        }
      }
    }
    this.wechatSharePlugin.share(sharingOptions);
  }

  public openWechat(args) {
    this.wechatSharePlugin.openWechat();
  }
}