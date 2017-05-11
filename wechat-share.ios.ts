
import {Common, WechatSharingType, WechatSharingOptions, WechatSharingScene, WechatSharingMessages } from './wechat-share.common';
import * as imageSource from 'image-source';

export declare class WXApiDelegate extends NSObject {}
export declare class BaseReq extends NSObject {
  type: any;
  openID: any;
}
export declare class BaseResp extends NSObject {
  errCode: any;
  errStr: any;
  type: any;
}
declare class WXMediaMessage extends NSObject {
  title: any;
  description: any;
  thumbData: any;
  mediaObject: any;
  public setThumbImage(image:UIImage): void;
} 
declare class SendMessageToWXReq extends BaseReq {
  text: any;
  message: WXMediaMessage;
  bText: boolean;
  scene: any;
}
declare class WXApi extends NSObject {
  static registerApp(appid: string): boolean;
  static isWXAppInstalled(): boolean;
  static isWXAppSupportApi(): boolean;
  static openWXApp(): boolean;
  static sendReq(req: BaseReq): boolean;
}
declare class WXImageObject extends NSObject {
  imageData: NSData;
}
declare class WXMusicObject extends NSObject {
  musicUrl: any;
}
declare class WXVideoObject extends NSObject {
  videoUrl: any;
}
declare class WXWebpageObject extends NSObject {
  webpageUrl: any;
}
declare enum WXScene {
    WXSceneSession = 0,
    WXSceneTimeline,
    WXSceneFavorite 
}


export class WechatShareDelegate extends NSObject implements WXApiDelegate {

  static ObjCProtocols = [WXApiDelegate];

  private _respCallback: Function;

  onReq(req: BaseReq): void {
    // TODO
  }

  onResp(resp: BaseResp): void {
    console.log(`resive response: ${resp}`);
    this._respCallback(resp);
  }

  setOnRespCallback(respCallback: Function): void {
    this._respCallback = respCallback;
  }

}

export var _wechatShareDelegate = new WechatShareDelegate();

export class WechatSharePlugin extends Common {

  wechatDelegate: WechatShareDelegate = _wechatShareDelegate;
  private MAX_THUMBNAIL_SIZE = 320;

  constructor(appID: string) {
    super();
    let registeResult:boolean = WXApi.registerApp(appID);
    console.log(`wx register result: ${registeResult}`);
  }

  public getDelegate (): any {
    return this.wechatDelegate;
  }

  public registerOnRespCallback(callback: (code:any) => any): void {
    this.wechatDelegate.setOnRespCallback(callback);
  }

  public isInstalled(): boolean {
    return WXApi.isWXAppInstalled();
  }

  public isSupport(): boolean {
    return WXApi.isWXAppSupportApi();
  }

  public openWechat(): void {
    WXApi.openWXApp();
  }

  public share(options: WechatSharingOptions): Promise<any> {
    // console.log(`app bundleID is: ${NSBundle.mainBundle.bundleIdentifier}. completeCallback is: ${options.completeCallback}`);
    let self = this;
    // if (typeof options.completeCallback === 'function') {
    //   self.wechatDelegate.setOnRespCallback(options.completeCallback);
    // }
    return new Promise((resolve, reject) => {
      if (!this.isInstalled()) {
        console.log("ERROR: WECHAT NOT INSTALL.");
        reject("ERROR: WECHAT NOT INSTALL.");
      }
      if (!option) {
        console.log("ERROR: INVALID PARAMETERS");
        reject("ERROR: INVALID PARAMETERS");
      }

      let req: SendMessageToWXReq = new SendMessageToWXReq();

      switch (options.scene) {
        case WechatSharingScene.FAVORITE:
          req.scene = WXScene.WXSceneFavorite;
          break;
        case WechatSharingScene.TIMELINE:
          req.scene = WXScene.WXSceneTimeline;
          break;
        case WechatSharingScene.SESSION:
          req.scene = WXScene.WXSceneSession;
          break;
        default:
          req.scene = WXScene.WXSceneTimeline;
      }

      if (options.text) {
        req.bText = true;
        req.text = options.text;
        //send text
        resolve(WXApi.sendReq(req));
      } else {
        //send media
        req.bText = false;
        self.buildMediaMessage(options).then((mediaMessage) => {
          req.message = mediaMessage;
          resolve(WXApi.sendReq(req));
        });
        // WXApi.sendReq(req);
      }
    });

  }

  private buildMediaMessage(params: WechatSharingOptions):Promise<any> {
    let self = this;
    let message = params.messages;
    let media = message.media;

    let wxMediaMessage = new WXMediaMessage();

    let mediaObject = null;

    wxMediaMessage.title = message.title;
    wxMediaMessage.description = message.description;

    let imageUrl = message.thumb;
    if (media.image) {
      imageUrl = media.image;
    }

    return self.getUIImage(imageUrl).then((image) => {
      if (image != null) {
        let thumbnail = self.getThumbImageWithUIImage(image);
        wxMediaMessage.setThumbImage(thumbnail);
      }

      let type = media.type ? media.type : WechatSharingType.TYPE_SHARING_WEBPAGE;

      switch (type) {
        case WechatSharingType.TYPE_SHARING_IMAGE:
          mediaObject = new WXImageObject();
          mediaObject.imageData = UIImagePNGRepresentation(image);
          break;
        case WechatSharingType.TYPE_SHARING_MUSIC:
          mediaObject = new WXMusicObject();
          mediaObject.musicUrl = media.musicUrl;
          break;
        case WechatSharingType.TYPE_SHARING_VIDEO:
          mediaObject = new WXVideoObject();
          mediaObject.videoUrl = media.videoUrl;
          break;
        case WechatSharingType.TYPE_SHARING_WEBPAGE:
        default:
          mediaObject = new WXWebpageObject();
          mediaObject.webpageUrl = media.webpageUrl;
      }

      wxMediaMessage.mediaObject = mediaObject;

      return wxMediaMessage;
    });

  }

  private getThumbImageWithUIImage(image: UIImage): UIImage {
    if (image.size.width > this.MAX_THUMBNAIL_SIZE || image.size.height > this.MAX_THUMBNAIL_SIZE) {
      let width = 0;
      let height = 0;

      if (image.size.width > image.size.height) {
        width = this.MAX_THUMBNAIL_SIZE;
        height = width * image.size.height / image.size.width;
      } else {
        height = this.MAX_THUMBNAIL_SIZE;
        width = height * image.size.width / image.size.height;
      }

      UIGraphicsBeginImageContext(CGSizeMake(width, height));
      image.drawInRect(CGRectMake(0, 0, width, height));
      let scaled:UIImage = UIGraphicsGetImageFromCurrentImageContext();
      UIGraphicsEndImageContext();

      return scaled;
    }
    
    return image;
  }

  // private getThumbImageWithUIImage(image: UIImage): UIImage {
  //   let size: CGSize = image.size;
  //   let croppedSize: CGSize;
  //   let ratio = 150;
  //   let offsetX = 0.0;
  //   let offsetY = 0.0;

  //   if (size.width > size.height) {
  //     offsetX = (size.height - size.width) / 2;
  //     croppedSize = CGSizeMake(size.height, size.height);
  //   } else {
  //     offsetY = (size.width - size.height) / 2;
  //     croppedSize = CGSizeMake(size.width, size.width)
  //   }

  //   let clippedRect: CGRect = CGRectMake(offsetX * -1, offsetY * -1, croppedSize.width, croppedSize.height);
  //   let imageRef = CGImageCreateWithImageInRect(image.CGImage, clippedRect);

  //   let rect = CGRectMake(0, 0, ratio, ratio);

  //   UIGraphicsBeginImageContext(rect.size);

  //   UIImage.imageWithCGImage(imageRef).drawInRect(rect);

  //   let thumbnail: UIImage = UIGraphicsGetImageFromCurrentImageContext();
  //   UIGraphicsEndImageContext();
  //   CGImageRelease(imageRef);

  //   return thumbnail;
  // }

  private getThumbImageWithUrl(url: string): Promise<UIImage> {
    return this.getUIImage(url).then((image: UIImage) => {
      return this.getThumbImageWithUIImage(image);
    });
  }

  private getUIImage(imageUrl: string): Promise<UIImage> {
    if (!imageUrl) {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    }
    if (imageUrl.startsWith("http") || imageUrl.startsWith("https")) { 
      console.log(`get web image`);
      return imageSource.fromUrl(imageUrl).then((res: imageSource.ImageSource) => {
        return res.ios;
      }, (error) => {
        console.log(`image source from url error: ${error}`);
      });
    } else if (imageUrl.startsWith("data:image")) { //base64 image
      console.log(`get base64 image`);
      return new Promise((resolve, reject) => {
        let base64Image = imageSource.fromBase64(imageUrl);
        return base64Image.ios;
      });
    } else { // file or resource
      console.log(`get file image`);
      return new Promise((resolve, reject) => {
        let imageSrc = imageSource.fromFileOrResource(imageUrl);
        resolve(imageSrc.ios);
      });
    }
  }
}

export {WechatSharingOptions, WechatSharingType, WechatSharingScene};