// 首先，导入 Context 和 Schema 两个模块，它们来自 koishi 包
import { Context, Schema, Logger } from "koishi";
// 然后，导入 @mirror_cy/gpt 包，它提供了 GPT 功能
import {} from "@mirror_cy/gpt";
import {} from "koishi-plugin-davinci-003";
// 定义插件的名字为 rr-tag
export const name = "rr-tag";
export const logger = new Logger(name);

// 定义插件的简介为 “好的tag需要耐心，gpt努力为你生成绘画tag”
export const usage = `

### 用前需知
请开启rr-gpt/davinci-003插件以获得最佳效果，否则无法生成tag
当rr-gpt无法使用时，可以尝试用davinci-003

### 插件介绍
目前有两种gpt服务模式可以选择

回应速度取决于使用的gpt服务速度

示例：

maketag 沙滩上的黑发长腿高中美少女

maketag swimsuit


### 更新日志
1.1.0：在风佬的帮助和修改下，本插件已支持调用davinci-003生成tag，可以直接调动自己画画
1.1.5-test：加了一个可以自由拉伸的预览框/ 代码：.role("textarea")
1.1.5：修复了本地化的bug，现在在配置项 gpt_sentence中可以直接修改发送给gpt的文字



`;

export const using = ["gpt"] as const;
// 定义一个 Config 接口，用于存储配置信息
export interface Config {
  command?: string;
  gpt_type: string;
  gpt_sentence: string;
}
export const Config: Schema<Config> = Schema.object({
  command: Schema.string().description("跑图机器人的前缀").default("rr"),
  gpt_type: Schema.union([
    Schema.const("dvc").description("davinci-003服务"),
    Schema.const("rr-gpt").description("rr-gpt服务"),
  ])
    .description("gpt服务模式")
    .default("rr-gpt"),
  gpt_sentence: Schema.string()
    .role("textarea")
    .default(
      `用尽可能多的英文标签详细的描述一幅画面， 用碎片化的单词标签而不是句子去描述这幅画，描述词尽量丰富，每个单词之间用逗号分隔，你现在要描述的是:`
    ),
});
// 定义一个 apply 函数，用于在 ctx 上注册插件功能
export function apply(ctx: Context, config: Config) {
  // 使用 ctx.command 方法创建一个命令对象 cmd，并设置别名和动作函数
  const cmd = ctx
    .command(`${name} <你要描述的场景:text>`)
    .alias("maketag")
    .action(async ({ session }, text) => {
      // 根据 session 的平台、用户、机器人和插件名生成一个唯一的 id
      const id = `${session.platform}-${session.userId}-${session.selfId}-${name}`;
      // 如果没有输入 text 参数，则执行 help 命令并返回
      if (!text) return session.execute(`help ${name}`);
      // 根据 text 参数生成一个提示语 prompt，并使用 ctx.gpt.ask 方法向 GPT 发送请求并获取回复

      const prompt = `用尽可能多的英文标签详细的描述一幅画面， 用碎片化的单词标签而不是句子去描述这幅画，描述词尽量丰富，每个单词之间用逗号分隔，你现在要描述的是:${text}`;

      // 将 GPT 的回复触发ai绘图
      session.send("等待中");
      let tag: string;
      if (!ctx.dvc && config.gpt_type == "dvc") {
        logger.warn("未加载davinci-003，将使用rr-gpt服务");
      }
      if (ctx.dvc && config.gpt_type == "dvc") {
        tag = await ctx.dvc.chat_with_gpt([
          { role: "user", content: `${prompt}` },
        ]);
        const cmd: string = `${config.command} ${tag}`;
        session.execute(cmd);
      } else {
        tag = (await ctx.gpt.ask(prompt, id)).text;
        const cmd: string = `${config.command} ${tag}`;
        session.execute(cmd);
        // 使用 ctx.gpt.reset 方法重置 GPT 的状态
        await ctx.gpt.reset(id);
      }
    });
}
