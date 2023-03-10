"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.Config = exports.usage = exports.name = void 0;
const koishi_1 = require("koishi");
exports.name = "rr-tag";
exports.usage = "好的tag需要耐心";
exports.Config = koishi_1.Schema.object({});
function apply(ctx) {
    ctx.i18n.define("zh", require("./locales/zh"));
    const cmd = ctx
        .command(`${exports.name} <你要描述的场景:text>`)
        .alias("maketag")
        .action(async ({ session }, text) => {
        const id = `${session.platform}-${session.userId}-${session.selfId}-${exports.name}`;
        if (!text)
            return session.execute(`help ${exports.name}`);
        const prompt = session.text(".prompt.base", { text });
        await ctx.gpt.ask(prompt, id).then(({ text }) => {
            session.send(text);
        });
        await ctx.gpt.reset(id);
    });
}
exports.apply = apply;
