import { Common, WechatSharingType, WechatSharingOptions, WechatSharingScene } from './wechat-share.common';
export declare class WechatSharePlugin extends Common {
    private wxApi;
    constructor(appID: any);
    getDelegate(): any;
    registerOnRespCallback(callback: (code: any) => any): void;
    isInstalled(): boolean;
    isSupport(): boolean;
    openWechat(): void;
    share(options: WechatSharingOptions): Promise<any>;
    private buildSharingMessage(params);
    private getThumbImageWithBitmap(bitmap);
    private getThumbImageWithUrl(url);
    private getBitmap(imageUrl);
}
export { WechatSharingOptions, WechatSharingType, WechatSharingScene };
