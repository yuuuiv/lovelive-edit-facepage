# 票券座席本地预览编辑

适用于票券页面的 Tampermonkey 用户脚本。可在浏览器中临时修改座席文字以供本地预览；不会向网站提交数据，刷新页面后修改自动消失。

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 等用户脚本管理器。
2. 打开并安装 [脚本文件](https://raw.githubusercontent.com/yuuuiv/lovelive-edit-facepage/main/LoveLive%20%E7%A5%A8%E5%88%B8%E5%BA%A7%E5%B8%AD%E6%9C%AC%E5%9C%B0%E9%A2%84%E8%A7%88%E7%BC%96%E8%BE%91-1.0.4.js)。
3. 确认脚本管理器已启用本脚本。

## 使用

1. 打开匹配的 LoveLive 票券或 `face_image` 页面。
2. 点击右下角的“编辑座席预览”。
3. 点击需要修改的座席文字，在弹窗中输入预览内容并确认。
4. 再次点击按钮可退出选择模式；点击 `✕` 仅隐藏按钮，不会影响已修改的本地预览内容。

## 更新

脚本元数据已配置 `@downloadURL` 与 `@updateURL`，脚本管理器会从 GitHub Raw 地址检查并下载更新。发布新版本时，请递增 `@version`，并将更新提交到默认分支 `main`。

## 许可

本项目使用 [MIT License](LICENSE)。
