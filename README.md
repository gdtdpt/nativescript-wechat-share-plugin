# Nativescript-wechat-share-plugin
 
This plugin can not receive any message from wechat both app request and the result of sharing. I haven't found a way to add a custom activity in Android or define a delegate in iOS on nativescript platform.

### Install

``` 
$ tns plugin add nativescript-wechat-share-plugin 
```
note: In iOS platform which i tested has a issue, it can not link an ios static library twice even though that static library has been remove. So if met some error like 'Can not find variable WXApiDelegate' in runtime, please follow steps as below and test again.
```
$ tns platform remove ios
$ tns platform add ios
$ tns prepare ios
```

#### iOS Configuration
add below into \<YOUR_PROJECT_DIR\>/app/App_Resources/iOS/Info.plist
```xml
<key>CFBundleURLTypes</key>
<array>
	<dict>
		<key>CFBundleTypeRole</key>
		<string>Editor</string>
		<key>CFBundleURLName</key>
		<string>weixin</string>
		<key>CFBundleURLSchemes</key>
		<array>
			<string><!--YOUR_WECHAT_APP_ID--></string>
		</array>
	</dict>
</array>
```

### Usage

WechatSharingScene object defined in [here](https://github.com/gdtdpt/nativescript-wechat-share-plugin/blob/master/wechat-share.common.d.ts). It has three options can be used: 
```typescript
WechatSharingScene.SESSION //share to someone or a group
WechatSharingScene.TIMELINE //share to Moments
WechatSharingScene.FAVORITE //add to self favorite
```

##### sharing text
```typescript
import {WechatSharePlugin, WechatSharingScene} from 'nativescript-wechat-share-plugin';

let wechatSharePlugin = new WechatSharePlugin(/*YOUR_WECHAT_APP_ID*/);

let sharingOptions = {
  scene: WechatSharingScene.TIMELINE,
  text: "this is a test text."
};

wechatSharePlugin.share(sharingOptions);
```

##### sharing url
```typescript
import {WechatSharePlugin, WechatSharingScene, WechatSharingType} from 'nativescript-wechat-share-plugin';

let wechatSharePlugin = new WechatSharePlugin(/*YOUR_WECHAT_APP_ID*/);
  
let sharingOptions = {
  scene: WechatSharingScene.TIMELINE,
  messages: {
    title: "url title",
    description: "url description",
    media: {
      type: WechatSharingType.TYPE_SHARING_WEBPAGE,
      webpageUrl: "https://open.weixin.qq.com/"
    }
  }
};
wechatSharePlugin.share(sharingOptions);
```

##### sharing local image
```typescript
import * as fs from 'file-system';
const appPath = fs.knownFolders.currentApp();
const applePath = fs.path.join(appPath.path, "img", "apple.jpg");

import {WechatSharePlugin, WechatSharingScene, WechatSharingType} from 'nativescript-wechat-share-plugin';

let wechatSharePlugin = new WechatSharePlugin(/*YOUR_WECHAT_APP_ID*/);

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
wechatSharePlugin.share(sharingOptions);
```

##### sharing online image
```typescript
import {WechatSharePlugin, WechatSharingScene, WechatSharingType} from 'nativescript-wechat-share-plugin';

let wechatSharePlugin = new WechatSharePlugin(/*YOUR_WECHAT_APP_ID*/);

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
wechatSharePlugin.share(sharingOptions);
```

##### sharing music
```typescript
import {WechatSharePlugin, WechatSharingScene, WechatSharingType} from 'nativescript-wechat-share-plugin';

let wechatSharePlugin = new WechatSharePlugin(/*YOUR_WECHAT_APP_ID*/);

let sharingOptions = {
  scene: WechatSharingScene.TIMELINE,
  messages: {
    title: "shareMusicToWechat title",
    description: "shareMusicToWechat description",
    media: {
      type: WechatSharingType.TYPE_SHARING_MUSIC,
      musicUrl: "http://staff2.ustc.edu.cn/~wdw/softdown/index.asp/0042515_05.ANDY.mp3"
    }
  }
}
wechatSharePlugin.share(sharingOptions);
```

##### sharing video
```typescript
import {WechatSharePlugin, WechatSharingScene, WechatSharingType} from 'nativescript-wechat-share-plugin';

let wechatSharePlugin = new WechatSharePlugin(/*YOUR_WECHAT_APP_ID*/);

let sharingOptions = {
  scene: WechatSharingScene.TIMELINE,
  messages: {
    title: "shareVideoToWechat title",
    description: "shareVideoToWechat description",
    media: {
      type: WechatSharingType.TYPE_SHARING_VIDEO,
      videoUrl: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
    }
  }
}
wechatSharePlugin.share(sharingOptions);
```