import { Observable } from 'data/observable';
export interface WechatSharingOptions {
    scene: WechatSharingScene;
    messages?: WechatSharingMessages;
    text?: string;
    completeCallback?: Function;
}
export interface WechatSharingMessages {
    title?: string;
    description?: string;
    thumb?: string;
    media: WechatSharingMedia;
}
export interface WechatSharingMedia {
    type?: WechatSharingType;
    image?: string;
    musicUrl?: string;
    videoUrl?: string;
    webpageUrl?: string;
}
export declare enum WechatSharingScene {
    SESSION = 0,
    TIMELINE = 1,
    FAVORITE = 2,
}
export declare enum WechatSharingType {
    TYPE_SHARING_TEXT = 1,
    TYPE_SHARING_IMAGE = 2,
    TYPE_SHARING_MUSIC = 3,
    TYPE_SHARING_VIDEO = 4,
    TYPE_SHARING_WEBPAGE = 5,
}
export declare class Common extends Observable {
    THUMB_SIZE: number;
    constructor();
    buildTransaction(type?: string): string;
}
