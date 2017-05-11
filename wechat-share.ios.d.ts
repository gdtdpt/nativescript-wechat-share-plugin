import { Common, WechatSharingType, WechatSharingOptions, WechatSharingScene } from './wechat-share.common';
export declare class WXApiDelegate extends NSObject {
}
export declare class BaseReq extends NSObject {
    type: any;
    openID: any;
}
export declare class BaseResp extends NSObject {
    errCode: any;
    errStr: any;
    type: any;
}
export declare class WechatShareDelegate extends NSObject implements WXApiDelegate {
    static ObjCProtocols: typeof WXApiDelegate[];
    private _respCallback;
    onReq(req: BaseReq): void;
    onResp(resp: BaseResp): void;
    setOnRespCallback(respCallback: Function): void;
}
export declare var _wechatShareDelegate: WechatShareDelegate;
export declare class WechatSharePlugin extends Common {
    wechatDelegate: WechatShareDelegate;
    private MAX_THUMBNAIL_SIZE;
    constructor(appID: string);
    getDelegate(): any;
    registerOnRespCallback(callback: (code: any) => any): void;
    isInstalled(): boolean;
    isSupport(): boolean;
    openWechat(): void;
    share(options: WechatSharingOptions): Promise<any>;
    private buildMediaMessage(params);
    private getThumbImageWithUIImage(image);
    private getThumbImageWithUrl(url);
    private getUIImage(imageUrl);
}
export { WechatSharingOptions, WechatSharingType, WechatSharingScene };
