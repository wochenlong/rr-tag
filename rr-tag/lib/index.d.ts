import { Context, Schema } from "koishi";
export declare const name = "rr-tag";
export declare const usage = "\u597D\u7684tag\u9700\u8981\u8010\u5FC3";
export interface Config {
}
export declare const Config: Schema<Config>;
export declare function apply(ctx: Context): void;
