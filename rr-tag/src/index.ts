// 首先，导入 Context 和 Schema 两个模块，它们来自 koishi 包
import { Context, Schema } from "koishi";
// 然后，导入 @mirror_cy/gpt 包，它提供了 GPT 功能
import {} from "@mirror_cy/gpt";
// 定义插件的名字为 rr-tag
export const name = "rr-tag";
// 定义插件的简介为 “好的tag需要耐心，gpt努力为你生成绘画tag”
export const usage = "好的tag需要耐心，gpt努力为你生成绘画tag";
// 定义一个 Config 接口，用于存储配置信息
export interface Config {}
// 定义一个 Config 的 Schema，用于验证配置信息是否合法
export const Config: Schema<Config> = Schema.object({});
// 定义一个 apply 函数，用于在 ctx 上注册插件功能
export function apply(ctx: Context) {
  // 使用 ctx.i18n.define 方法定义中文语言包，人工：后面这个是本地化文件的路径
  ctx.i18n.define("zh", require("./locales/zh"));
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
      const prompt = session.text(".prompt.base", { text });
      // 将 GPT 的回复发送给用户
      await ctx.gpt.ask(prompt, id).then(({ text }) => {
        session.send(text);
      });
      // 使用 ctx.gpt.reset 方法重置 GPT 的状态
      await ctx.gpt.reset(id);
    });
}
