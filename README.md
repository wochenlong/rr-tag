# rr-tag

[![npm](https://img.shields.io/npm/v/koishi-plugin-rr-tag?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-rr-tag)

利用chatgpt生成ai绘画tag

GPT功能来自42的rr-gpt插件，也可依赖其他gpt类插件

基本框架是42的abstract插件

地址：https://www.npmjs.com/package/koishi-plugin-abstract



可提供参考，大胆借鉴
  
因网络问题，github的更新有时间会比npm滞后

### 更新日志
1.1.0：在风佬的帮助和修改下，本插件已支持调用davinci-003生成tag，可以直接调动自己画画
1.1.5-test：加了一个可以自由拉伸的预览框/ 代码：.role("textarea")
1.1.5：修复了本地化的bug，现在在配置项 gpt_sentence中可以直接修改发送给gpt的文字
