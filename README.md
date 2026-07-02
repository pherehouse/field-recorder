# Field Recorder（中文用户修改版）

> 这是基于 Don McCurdy 的开源 Obsidian 插件 [obsidian-field-recorder](https://github.com/donmccurdy/obsidian-field-recorder)（v1.0.0）做的个人修改版。
>
> **鸣谢**：感谢 Don McCurdy 写了这么好用的录音插件（带波形可视化、音质设置、设备选择），原项目MIT 协议开源。本修改版仅针对个人使用场景做了保存位置和默认值方面的微调，所有底层录音/波形/设备管理代码均来自原作者。

## 上游信息
- 原项目地址：https://github.com/donmccurdy/obsidian-field-recorder
- 原版本：v1.0.0
- 原作者：Don McCurdy（https://www.donmccurdy.com/）
- 协议：MIT

## 本目录内容
```
main.js                    ← 修改后的打包产物（esbuild minified 单行）
main.js.bak                ← 原版 v1.0.0 备份（未改动）
main.js.bak.20260701       ← 第一版改动备份（录音开始时锁定上下文，已回退）
main.js.bak.20260701-v2    ← 第二版改动备份（同上，调整版，已回退）
main.js.bak.20260702       ← 本次修改前备份
manifest.json              ← 插件清单（未改动）
styles.css                 ← 样式（未改动）
README.md                  ← 本文件
CLAUDE.md                  ← Claude Code 工作指南
```

**注意**：本目录只有打包产物，没有 TypeScript 源码。所有修改直接在 `main.js`（minified 单行）上做。

---

## 修改版相对原版的改动

### 改动一（2026-06-30，已回退）：录音开始时锁定保存位置
**问题**：原版在停止录音时才决定保存文件夹和插入链接的目标笔记，录音中切到别的笔记会导致文件存到错位置、链接插到错笔记。

**方案**：录音开始时抓取活动 markdown 文件的 folder + file 引用，存到 `this._recordingContext`，停止时用这个上下文。

**结果**：方案可行但增加了复杂度，且与"默认保存到固定文件夹"的新需求冲突，**已于 2026-07-02 回退**。备份保留在 `main.js.bak.20260701` / `main.js.bak.20260701-v2`。

### 改动二（2026-07-02，当前版本）：默认保存到 vault 根下的 audioRecords 文件夹

#### 背景需求
- 录音文件默认统一存到 vault 根目录下的 `audioRecords/`，不要每次问、不要依赖当前活动笔记
- 第一次启动时如果该文件夹不存在，自动创建
- 文件名默认用日期时间戳（每次新录音一个新名字，不要复用上次的）
- 用户仍可在侧边面板自定义文件名和文件夹

#### 改动点（均在 `main.js`）

1. **默认设置 `W.outputSettings.folder`**
   - 原版：`""`（空，fallback 到当前活动笔记的父文件夹）
   - 修改后：`"audioRecords"`

2. **`onload()`（插件加载时）**
   末尾新增：
   ```js
   try {
     let df = this.state.settings.outputSettings.peek().folder || "audioRecords";
     if (!this.app.vault.getAbstractFileByPath(df)) {
       await this.app.vault.createFolder(df);
     }
   } catch (e) {
     console.error("Field Recorder: ensure default folder failed", e);
   }
   ```
   即：插件加载时确保默认文件夹存在，不存在就创建。失败只打 console，不阻塞插件加载。

3. **`onOpen()`（侧边面板每次打开时）**
   开头新增：
   ```js
   c.value = {...c.peek(), filename: "", folder: "audioRecords"};
   ```
   即：每次打开面板，文件名输入框清空（占位符显示最新时间戳 `Y()`），文件夹重置回 `audioRecords`。不保留上次的输入。

4. **回退改动一的相关代码**
   - 移除 `_recordingContext` 字段
   - 移除 `_captureRecordingContext()` 方法
   - 移除 `active-leaf-change` 和 `file-open` 两个 workspace 事件监听
   - `_startRecordingNow()` 里移除对 `_captureRecordingContext` 的调用
   - `saveRecording(e)` 恢复成原版逻辑：
     ```js
     async saveRecording(e){
       let {workspace:s, vault:n, fileManager:o} = this.app,
           r = this.state.settings.outputSettings.peek(),
           a = `${r.filename || Y()}.${q[r.mimeType]}`,
           u = getAvailableRecordingPath(n, joinRecordingPath(resolveRecordingFolder(r.folder, getActiveMarkdownFilePath(s)), a)),
           f = await n.createBinary(u, e),
           h = s.getMostRecentLeaf();
       if (h && h.view instanceof C.MarkdownView && h.view.file) {
         let d = h.view.file.path,
             p = o.generateMarkdownLink(f, d);
         h.view.editor.replaceSelection(`!${p}`);
       } else {
         await s.getLeaf(!0).openFile(f);
       }
     }
     ```

#### 最终行为

| 项目 | 默认值 | 用户可覆盖 |
|---|---|---|
| 保存文件夹 | `audioRecords/`（vault 根下） | 是，侧边面板输入框或文件夹选择器 |
| 文件名 | `YYYY-MM-DD HH-MM-SS Recording`（录制时刻） | 是，侧边面板输入框 |
| 文件夹自动创建 | 是，插件加载时 | — |
| 链接插入位置 | 停止时活动 markdown 笔记光标处 | — |

#### 文件夹解析优先级（`resolveRecordingFolder`）
1. 设置里的 `folder` 字段（每次打开面板默认重置为 `audioRecords`）
2. 若为空 → 当前活动 markdown 文件的父文件夹（原版 fallback 行为）

---

## 测试步骤
1. reload 插件（设置 → 第三方插件 → 关掉再开，或 `Cmd+R`）
2. 检查 vault 根下出现 `audioRecords/` 文件夹
3. 打开侧边面板 → 文件名输入框应为空，文件夹输入框应为 `audioRecords`
4. 录一段 → 文件应出现在 `audioRecords/` 下，文件名形如 `2026-07-02 14-30-05 Recording.m4a`
5. 关闭面板重新打开 → 文件名框再次为空、文件夹重置回 `audioRecords`（不复用上次输入）
6. 在面板里手动改文件夹/文件名 → 应按用户设置保存

## 回退方法
恢复原版：
```sh
cp main.js.bak main.js
```
恢复到改动一（已回退的版本）：
```sh
cp main.js.bak.20260701-v2 main.js
```

## 修改 minified 代码的注意事项
- `main.js` 是 esbuild 打包产物（minified 单行），编辑需小心保持语法正确
- 变量名是 minified 的（i/t/e/s/n/o/r/c/a/u/f/h/d/p/m 等），编辑时不要改变量名，只改逻辑
- 改完后用 `node --check main.js` 验证语法
- 改之前先备份：`cp main.js main.js.bak.<日期>`

## License
继承原项目 MIT 协议。
