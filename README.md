# Field Recorder（中文用户修改版）

> 这是基于 Don McCurdy 的开源 Obsidian 插件 [obsidian-field-recorder](https://github.com/donmccurdy/obsidian-field-recorder)（v1.0.0）做的个人修改版。
>
> **鸣谢**：感谢 Don McCurdy 写了这么好用的录音插件（带波形可视化、音质设置、设备选择），原项目 MIT 协议开源。本修改版仅针对个人使用场景做了保存位置和默认值方面的微调，所有底层录音/波形/设备管理代码均来自原作者。

## 上游信息
- 原项目地址：https://github.com/donmccurdy/obsidian-field-recorder
- 原版本：v1.0.0
- 原作者：Don McCurdy（https://www.donmccurdy.com/）
- 协议：MIT

## 仓库内容
```
main.js        ← 修改后的打包产物（esbuild minified 单行）
manifest.json  ← 插件清单（未改动）
styles.css     ← 样式（未改动）
tests/         ← 原项目带来的测试
README.md      ← 本文件
```

**注意**：本目录只有打包产物，没有 TypeScript 源码。所有修改直接在 `main.js`（minified 单行）上做。

---

## 功能改动点（相对原版）

### 1. 默认保存文件夹改为 `audioRecords`
- **原版**：`outputSettings.folder` 默认为空，停止录音时 fallback 到当前活动 markdown 文件的父文件夹
- **修改后**：默认 `audioRecords`，录音文件统一存到 vault 根目录下的 `audioRecords/`

### 2. 插件加载时自动创建默认文件夹
- 在 `onload()` 末尾新增逻辑：如果 `audioRecords` 文件夹不存在就 `vault.createFolder()` 创建
- 失败只打 console，不阻塞插件加载

### 3. 侧边面板每次打开时重置文件名和文件夹
- 在 `onOpen()` 开头新增：
  ```js
  c.value = {...c.peek(), filename: "", folder: "audioRecords"};
  ```
- **效果**：每次打开面板，文件名输入框清空（占位符显示最新时间戳），文件夹重置回 `audioRecords`
- 不保留上次的输入，避免下次录音复用旧文件名

### 4. 文件名默认仍是日期时间戳
- 录制停止时如果文件名输入框为空，用 `Y()` 生成 `YYYY-MM-DD HH-MM-SS Recording`（原版行为，未改动）
- 每次新录音都用录制时刻的新时间戳

---

## 最终行为

| 项目 | 默认值 | 用户可覆盖 |
|---|---|---|
| 保存文件夹 | `audioRecords/`（vault 根下） | 是，侧边面板输入框或文件夹选择器 |
| 文件名 | `YYYY-MM-DD HH-MM-SS Recording`（录制时刻） | 是，侧边面板输入框 |
| 文件夹自动创建 | 是，插件加载时 | — |
| 链接插入位置 | 停止时活动 markdown 笔记光标处 | — |

## 文件夹解析优先级（`resolveRecordingFolder`）
1. 设置里的 `folder` 字段（每次打开面板默认重置为 `audioRecords`）
2. 若为空 → 当前活动 markdown 文件的父文件夹（原版 fallback 行为）

## 测试步骤
1. reload 插件（设置 → 第三方插件 → 关掉再开，或 `Cmd+R`）
2. 检查 vault 根下出现 `audioRecords/` 文件夹
3. 打开侧边面板 → 文件名输入框应为空，文件夹输入框应为 `audioRecords`
4. 录一段 → 文件应出现在 `audioRecords/` 下，文件名形如 `2026-07-02 14-30-05 Recording.m4a`
5. 关闭面板重新打开 → 文件名框再次为空、文件夹重置回 `audioRecords`（不复用上次输入）
6. 在面板里手动改文件夹/文件名 → 应按用户设置保存

## 修改 minified 代码的注意事项
- `main.js` 是 esbuild 打包产物（minified 单行），编辑需小心保持语法正确
- 变量名是 minified 的（i/t/e/s/n/o/r/c/a/u/f/h/d/p/m 等），编辑时不要改变量名，只改逻辑
- 改完后用 `node --check main.js` 验证语法

## License
继承原项目 MIT 协议。
