import { Common, WechatSharingType, WechatSharingOptions, WechatSharingScene, WechatSharingMessages } from './wechat-share.common';
import { ad as UtilsAd } from 'utils/utils';
import * as imageSource from 'image-source';

declare const com: any;

export class WechatSharePlugin extends Common {

  // private THUMB_SIZE: number = 150;
  private wxApi: any;

  constructor (appID) {
    super();
    this.wxApi = com.tencent.mm.opensdk.openapi.WXAPIFactory.createWXAPI(UtilsAd.getApplicationContext(), appID, true);
    let registeResult = this.wxApi.registerApp(appID);
    console.log(`wx register result: ${registeResult}`);
  }

  public getDelegate (): any {}

  public registerOnRespCallback(callback: (code:any) => any): void {}

  public isInstalled(): boolean {
    return this.wxApi.isWXAppInstalled();
  }

  public isSupport(): boolean {
    return this.wxApi.isWXAppSupportAPI();
  }

  public openWechat(): void {
    this.wxApi.openWXApp();
  }

  public share(options: WechatSharingOptions): Promise<any> {
    let self = this;
    return new Promise((resolve, reject) => {
      if (!self.isInstalled()) {
        console.log("ERROR: WECHAT NOT INSTALL.");
        reject("ERROR: WECHAT NOT INSTALL.");
      }
      if (!options) {
        console.log("ERROR: INVALID PARAMETERS");
        reject("ERROR: INVALID PARAMETERS");
      }

      let wxReq = new com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req();
      wxReq.transaction = super.buildTransaction();

      switch (options.scene) {
        case WechatSharingScene.FAVORITE:
          wxReq.scene = com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req.WXSceneFavorite;
          break;
        case WechatSharingScene.TIMELINE:
          wxReq.scene = com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req.WXSceneTimeline;
          break;
        case WechatSharingScene.SESSION:
          wxReq.scene = com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req.WXSceneSession;
          break;
        default:
          wxReq.scene = com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req.WXSceneTimeline;
      }

      self.buildSharingMessage(options).then((wxMediaMessage) => {
        wxReq.message = wxMediaMessage;
        // console.log(`wxMediaMessage: ${wxMediaMessage}, ${wxReq}, ${self.wxApi}`);
        if (self.wxApi.sendReq(wxReq)) {
          console.log("Message has been sent successfully.");
          resolve(`Message has been sent successfully.`);
        } else {
          console.log("Message has been sent unsuccessfully.");
          reject(`Message has been sent unsuccessfully.`);
        }
      });
    });
  }

  private buildSharingMessage(params: WechatSharingOptions): Promise<any> {
    let self = this;
    let wxMediaMessage = new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();

    if (params.text) {
      let textObject = new com.tencent.mm.opensdk.modelmsg.WXTextObject();
      textObject.text = params.text;
      wxMediaMessage.mediaObject = textObject;
      wxMediaMessage.description = params.text;
      return new Promise((resolve, reject) => {
        resolve(wxMediaMessage);
      });
    } else {
      let mediaObject = null;

      let message = params.messages;
      let media = message.media;

      wxMediaMessage.title = message.title;
      wxMediaMessage.description = message.description;

      let bitmapUrl = message.thumb;
      if (media.image) {
        bitmapUrl = media.image;
      }

      return self.getBitmap(bitmapUrl).then((bitmap) => {
        if (bitmap != null) {
          let thumbnailBitmap = self.getThumbImageWithBitmap(bitmap);
          wxMediaMessage.setThumbImage(thumbnailBitmap);
          thumbnailBitmap.recycle();
          if (!media.image) {
            bitmap.recycle();
          }
        }

        let type = media.type ? media.type : WechatSharingType.TYPE_SHARING_WEBPAGE;

        switch (type) {
          case WechatSharingType.TYPE_SHARING_IMAGE:
            mediaObject = new com.tencent.mm.opensdk.modelmsg.WXImageObject(bitmap);
            bitmap.recycle();
            break;
          case WechatSharingType.TYPE_SHARING_MUSIC:
            let musicObject = new com.tencent.mm.opensdk.modelmsg.WXMusicObject();
            musicObject.musicUrl = media.musicUrl;
            mediaObject = musicObject;
            break;
          case WechatSharingType.TYPE_SHARING_VIDEO:
            let videoObject = new com.tencent.mm.opensdk.modelmsg.WXVideoObject();
            videoObject.videoUrl = media.videoUrl;
            mediaObject = videoObject;
            break;
          case WechatSharingType.TYPE_SHARING_WEBPAGE:
          default:
            mediaObject = new com.tencent.mm.opensdk.modelmsg.WXWebpageObject(media.webpageUrl);
        }
        wxMediaMessage.mediaObject = mediaObject;
        return wxMediaMessage;
      });

    }
  }

  // public shareText(text: string): void {
  //   let textObject = new com.tencent.mm.opensdk.modelmsg.WXTextObject();
  //   textObject.text = text;

  //   let wxMediaMessage = new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
  //   wxMediaMessage.mediaObject = textObject;
  //   wxMediaMessage.description = text;

  //   let req = new com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req();
  //   req.transaction = super.buildTransaction("text");
  //   req.message = wxMediaMessage;
  //   req.scene = 1;//timeline

  //   console.log(`wx send text req result: ${this.wxApi.sendReq(req)}`);
  // }

  // public shareImage(imageUrl: string): void {
  //   let self = this;
  //   this.getBitmap(imageUrl).then((bitmapObject) => {
  //     let wxImageObj = new com.tencent.mm.opensdk.modelmsg.WXImageObject(bitmapObject);
  //     let wxMediaMessage = new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
  //     wxMediaMessage.mediaObject = wxImageObj;

  //     let thumbImage = self.getThumbImageWithBitmap(bitmapObject);
  //     bitmapObject.recycle();
  //     wxMediaMessage.setThumbImage(thumbImage);

  //     let req = new com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req();
  //     req.transaction = super.buildTransaction("img");
  //     req.message = wxMediaMessage;
  //     req.scene= 1;

  //     console.log(`wx send url req result: ${this.wxApi.sendReq(req)}`);
  //     thumbImage.recycle();
  //   })
  // }

  // public shareMusic(musicUrl: string, thumbImageUrl: string): void {
  //   this.getThumbImageWithUrl(thumbImageUrl).then((thumb) => {
  //     let music = new com.tencent.mm.opensdk.modelmsg.WXMusicObject();
  //     music.musicUrl = musicUrl;

  //     let mediaMessage = new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
  //     mediaMessage.mediaObject = music;
  //     mediaMessage.title = "music title";
  //     mediaMessage.description = "music description";
  //     mediaMessage.setThumbImage(thumb);

  //     let req = new com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req();
  //     req.transaction = super.buildTransaction("music");
  //     req.message = mediaMessage;
  //     req.scene= 1;

  //     console.log(`wx send music req result: ${this.wxApi.sendReq(req)}`);
  //     thumb.recycle();
  //   });
  // }

  // public shareVideo(videoUrl: string, thumbImageUrl: string): void {
  //   this.getThumbImageWithUrl(thumbImageUrl).then((thumb) => {
  //     let videoObject = new com.tencent.mm.opensdk.modelmsg.WXVideoObject();
  //     videoObject.videoUrl = videoUrl;

  //     let mediaMessage = new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
  //     mediaMessage.mediaObject = videoObject;
  //     mediaMessage.title = "video title";
  //     mediaMessage.description = "vodeo description";
  //     mediaMessage.setThumbImage(thumb);

  //     let req = new com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req();
  //     req.transaction = super.buildTransaction("video");
  //     req.message = mediaMessage;
  //     req.scene= 1;

  //     console.log(`wx send video req result: ${this.wxApi.sendReq(req)}`);
  //     thumb.recycle();
  //   });
  // }

  // public shareUrl(url: string, thumbImageUrl: string): void {
  //   this.getThumbImageWithUrl(thumbImageUrl).then((bitmapObject) => {
  //     let webpage = new com.tencent.mm.opensdk.modelmsg.WXWebpageObject();
  //     webpage.webpageUrl = url;
      
  //     let wxMediaMessage = new com.tencent.mm.opensdk.modelmsg.WXMediaMessage();
  //     wxMediaMessage.mediaObject = webpage;
  //     wxMediaMessage.title = "Title Baidu";
  //     wxMediaMessage.description = "Description Baidu";
  //     wxMediaMessage.setThumbImage(bitmapObject);

  //     let req = new com.tencent.mm.opensdk.modelmsg.SendMessageToWX.Req();
  //     req.transaction = super.buildTransaction("webpage");
  //     req.message = wxMediaMessage;
  //     req.scene= 1;

  //     console.log(`wx send url req result: ${this.wxApi.sendReq(req)}`);
  //     bitmapObject.recycle();
  //   });
  // }

  // private getBitmapData (bitmap: android.graphics.Bitmap) {
  //   let output = new java.io.ByteArrayOutputStream();
  //   bitmap.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, output);
  //   bitmap.recycle();
  //   let result = output.toByteArray();
  //   try {
  //     output.close()
  //   } catch (ex) {
  //     console.log(`getBitmapData close stream error: ${ex.getMessage()}`);
  //   }

  //   return result;
  // }

  private getThumbImageWithBitmap (bitmap: android.graphics.Bitmap) {
    return android.graphics.Bitmap.createScaledBitmap(bitmap, this.THUMB_SIZE, this.THUMB_SIZE, true);
  }

  private getThumbImageWithUrl (url: string): Promise<android.graphics.Bitmap> {
    return this.getBitmap(url).then((bitmap: android.graphics.Bitmap) => {
      let thumb = android.graphics.Bitmap.createScaledBitmap(bitmap, this.THUMB_SIZE, this.THUMB_SIZE, true);
      bitmap.recycle();
      return thumb;
    });
  }

  private getBitmap(imageUrl: string): Promise<android.graphics.Bitmap> {
    if (!imageUrl) {
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    }
    if (imageUrl.startsWith("http") || imageUrl.startsWith("https")) { 
      console.log(`get web image`);
      return imageSource.fromUrl(imageUrl).then((res: imageSource.ImageSource) => {
        return android.graphics.Bitmap.createBitmap(res.android);
      }, (error) => {
        console.log(`image source from url error: ${error}`);
      });
    } else if (imageUrl.startsWith("data:image")) { //base64 image
      console.log(`get base64 image`);
      return new Promise((resolve, reject) => {
        let base64Image = imageSource.fromBase64(imageUrl);
        let bitmap = android.graphics.Bitmap.createBitmap(base64Image.android);
        resolve(bitmap);
      });
    } else { // file or resource
      console.log(`get file image`);
      return new Promise((resolve, reject) => {
        let imageSrc = imageSource.fromFileOrResource(imageUrl);
        let bitmap = android.graphics.Bitmap.createBitmap(imageSrc.android);
        resolve(bitmap);
      });
    }
  }
}

export {WechatSharingOptions, WechatSharingType, WechatSharingScene};