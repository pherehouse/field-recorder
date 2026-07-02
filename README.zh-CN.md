# Field Recorder

[English](./README.md) | [简体中文](./README.zh-CN.md)

> Obsidian 录音插件，带波形可视化、音质设置和设备选择。基于 Don McCurdy 的 [obsidian-field-recorder](https://github.com/donmccurdy/obsidian-field-recorder) v1.0.0 修改。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Obsidian](https://img.shields.io/badge/Obsidian-1.11.4+-7C3AED.svg)](https://obsidian.md)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux%20%7C%20iOS-blue.svg)]()

## ✨ 功能特性

- 🎙️ **录音**：浏览器原生 MediaRecorder API，支持 m4a / webm 格式
- 📊 **实时波形可视化**：基于 Web Audio API AnalyserNode 的频谱显示
- 🎚️ **音质设置**：比特率可选（32–320 kb/s），输入增益可调
- 🔇 **降噪选项**：自动增益控制、噪声抑制、人声隔离
- 📁 **统一存储**：录音文件自动保存到 vault 根下的 `audioRecords/` 文件夹
- 🕐 **时间戳命名**：默认 `YYYY-MM-DD HH-MM-SS Recording`，每次新录音用新名字
- 🔗 **自动插入链接**：录音链接 `![[xxx.m4a]]` 自动插入到当前笔记光标处
- ⏯️ **暂停 / 恢复**：录音过程中可暂停，恢复后继续同一次录音

## 📦 安装

### 方式一：手动安装（推荐）

1. 下载 [最新 release](https://github.com/pherehouse/field-recorder/releases) 的 `main.js`、`manifest.json`、`styles.css` 三个文件
2. 在你的 Obsidian vault 中找到插件目录：`<vault>/.obsidian/plugins/`
3. 新建文件夹 `field-recorder`，把三个文件放进去
4. 打开 Obsidian → 设置 → 第三方插件 → 关闭"安全模式"
5. 在插件列表中找到 "Field Recorder" 并启用

### 方式二：从源码构建（可选）

```bash
git clone https://github.com/pherehouse/field-recorder.git
cd field-recorder
# 本仓库只包含打包产物，如需从上游源码构建请前往原项目：
# https://github.com/donmccurdy/obsidian-field-recorder
```

## 🚀 使用方法

### 基本录音流程

1. **打开面板**：点击左侧 ribbon 栏的麦克风图标，或执行命令 `Field Recorder: Open`
2. **选择输入设备**（可选）：在面板顶部的 "Input" 下拉框选择麦克风
3. **调整音质**（可选）：设置格式、比特率、增益、降噪等
4. **开始录音**：点击红色圆点按钮 ●
5. **暂停 / 停止**：点击 ⏸ 暂停，点击 ⬛ 停止并保存
6. **自动保存**：录音文件保存到 `<vault>/audioRecords/`，链接自动插入到当前笔记

### 文件名和文件夹

- **默认文件名**：`YYYY-MM-DD HH-MM-SS Recording`（如 `2026-07-02 14-30-05 Recording.m4a`）
- **自定义文件名**：在面板顶部的输入框填写，留空则用时间戳
- **自定义文件夹**：在面板的文件夹输入框填写，或点击 📁 按钮从已有文件夹中选择
- **每次打开面板会重置**：文件名清空、文件夹回到 `audioRecords`，避免复用上次的设置

### 录音文件位置

```
<vault>/
├── audioRecords/                    ← 默认录音文件夹（自动创建）
│   ├── 2026-07-02 14-30-05 Recording.m4a
│   └── 2026-07-02 15-12-33 Recording.m4a
└── 笔记.md                          ← 录音链接会插到这里的当前光标位置
```

### 快捷命令

| 命令 | 说明 |
|---|---|
| `Field Recorder: Open` | 打开侧边面板 |
| `Field Recorder: Close` | 关闭侧边面板 |
| `Field Recorder: Start recording audio` | 开始录音 |
| `Field Recorder: Pause recording audio` | 暂停录音 |
| `Field Recorder: Stop recording audio` | 停止并保存 |

## 🔧 技术栈

| 技术 | 用途 |
|---|---|
| [TypeScript](https://www.typescriptlang.org/) | 源码语言（上游项目） |
| [esbuild](https://esbuild.github.io/) | 打包工具，输出 minified 单文件 `main.js` |
| [Obsidian Plugin API](https://github.com/obsidianmd/obsidian-api) | 插件接口（`Plugin`、`ItemView`、`Vault`、`Workspace` 等） |
| [Preact Signals](https://preactjs.com/guide/v10/signals) | 响应式状态管理（minified 后内联进 main.js） |
| [Web Audio API](https://developer.mozilla.org/docs/Web/API/Web_Audio_API) | 音频图构建（`AudioContext`、`MediaStreamSource`、`AnalyserNode`、`GainNode`） |
| [MediaRecorder API](https://developer.mozilla.org/docs/Web/API/MediaRecorder) | 浏览器原生录音接口 |
| [Canvas 2D](https://developer.mozilla.org/docs/Web/API/Canvas_API) | 波形可视化绘制 |
| Node.js | 测试运行环境（`tests/` 目录） |

### 支持的音频格式

| MIME 类型 | 扩展名 | 备注 |
|---|---|---|
| `audio/mp4` | `.m4a` | 默认格式（iOS / macOS / Windows 通用） |
| `audio/webm;codecs=opus` | `.webm` | Android / Linux 推荐 |
| `audio/webm;codecs=pcm` | `.webm` | 无损 WebM |

格式可用性取决于浏览器/Obsidian 运行时支持，插件会自动检测。

## 📝 本修改版相对原版的改动

| 改动点 | 原版 | 本版 |
|---|---|---|
| 默认保存文件夹 | 空（fallback 到当前笔记的父文件夹） | `audioRecords`（vault 根下） |
| 文件夹自动创建 | 无 | 插件加载时自动创建 `audioRecords` |
| 面板打开时的默认值 | 保留上次设置 | 重置为空文件名 + `audioRecords` 文件夹 |
| 文件名 | `YYYY-MM-DD HH-MM-SS Recording` | 不变（每次新时间戳） |

改动直接在 minified 的 `main.js` 上进行。

## 🙏 鸣谢

本项目是 Don McCurdy 的 [obsidian-field-recorder](https://github.com/donmccurdy/obsidian-field-recorder) 的修改版，所有核心功能（录音、波形、设备管理、设置面板）均来自原作者。

- **原作者**：[Don McCurdy](https://www.donmccurdy.com/)
- **原项目**：https://github.com/donmccurdy/obsidian-field-recorder
- **原协议**：MIT

## 📄 License

继承原项目 [MIT License](https://opensource.org/licenses/MIT)。

## 🔗 相关链接

- [Obsidian](https://obsidian.md/) — 一个基于本地 Markdown 文件的知识管理工具
- [Obsidian Plugin API](https://github.com/obsidianmd/obsidian-api)
- [原项目 obsidian-field-recorder](https://github.com/donmccurdy/obsidian-field-recorder)

## ⚠️ 注意事项

- 本仓库只包含打包后的 `main.js`（minified 单行），不含 TypeScript 源码
- 修改在 minified 产物上直接进行，编辑需谨慎
- 如需从源码深度定制，请前往原项目
- 问题反馈：[GitHub Issues](https://github.com/pherehouse/field-recorder/issues)
