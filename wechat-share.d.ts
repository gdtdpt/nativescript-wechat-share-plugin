import { Common, WechatSharingType, WechatSharingOptions, WechatSharingScene } from './wechat-share.common';
export declare class WechatSharePlugin extends Common {
  
  constructor(appID: string);

  // public getDelegate (): any;//iOS only
  // public registerOnRespCallback(callback: (code:any) => any): void;//iOS only
  public isInstalled(): boolean;
  public isSupport(): boolean;
  public share(options: WechatSharingOptions): Promise<any>;

  public openWechat(): void;
}

export { WechatSharingOptions, WechatSharingType, WechatSharingScene };