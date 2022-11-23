# quickcommander README

## Features

In the extension, you have serval well-setting snippets(that's what we recommended), if this snippets cannot satisfy you, you can create a file in the root path named .snippets.json | .snippets | .snippets.js
( p.s. .snippets.json have the highest weight )

> Tip: .snippets.json > .snippets > .snippets.js


## Basic Snippets

|  prefix   | body  |  description   |
|  ------   | ----  |  ------------  |
| fn  | /**<br/>&nbsp;&nbsp;@desc<br/> &nbsp;&nbsp;@param<br/> */ | 函数注释  |
| fl  | 单元格 | 文件注释  |
| imp  | import \$1 from '$2' | es6 引入模块  |
| cm  | import \$1 from '$2' | 单行注释  |
| rq  | const \$1 =  require('$2') | commandjs 引入模块  |
| vu  | xxx | vue2 文件模版  |
| api  | xxx | 接口函数  |
| v3  | xxx | vue3 文件模版  |

## Notice
- If you want to install this extension through VSIX format, download the extension, then run `code --install-extension #{extension-name}.vsix`
- [About the snippets syntax](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_snippet-syntax)

## Known Issues

Not yet.

## Release Notes

### 1.0.0

Initial release of basic snippets.

---

**Enjoy!**
