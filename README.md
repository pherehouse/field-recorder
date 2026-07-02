# Field Recorder

[English](./README.md) | [简体中文](./README.zh-CN.md)

> An Obsidian audio recorder plugin with waveform visualization, quality settings, and input device selection. Modified from Don McCurdy's [obsidian-field-recorder](https://github.com/donmccurdy/obsidian-field-recorder) v1.0.0.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Obsidian](https://img.shields.io/badge/Obsidian-1.11.4+-7C3AED.svg)](https://obsidian.md)
[![Platform](https://img.shields.io/badge/Platform-macOS%20%7C%20Windows%20%7C%20Linux%20%7C%20iOS-blue.svg)]()

## ✨ Features

- 🎙️ **Recording** — Native MediaRecorder API, supports m4a / webm formats
- 📊 **Real-time waveform visualization** — Spectrum display via Web Audio API AnalyserNode
- 🎚️ **Quality settings** — Bitrate options (32–320 kb/s), adjustable input gain
- 🔇 **Noise reduction** — Auto gain control, noise suppression, voice isolation
- 📁 **Unified storage** — Audio files auto-saved to `audioRecords/` at the vault root
- 🕐 **Timestamped filenames** — Default `YYYY-MM-DD HH-MM-SS Recording`, fresh name per take
- 🔗 **Auto-insert link** — `![[xxx.m4a]]` link auto-inserted at the cursor in the active note
- ⏯️ **Pause / Resume** — Pause mid-recording and resume the same take

## 📦 Installation

### Option 1: Manual install (recommended)

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/pherehouse/field-recorder/releases)
2. In your Obsidian vault, navigate to the plugins folder: `<vault>/.obsidian/plugins/`
3. Create a folder named `field-recorder` and place the three files inside
4. Open Obsidian → Settings → Community plugins → disable "Safe Mode"
5. Find "Field Recorder" in the plugin list and enable it

### Option 2: Build from source (optional)

```bash
git clone https://github.com/pherehouse/field-recorder.git
cd field-recorder
# This repo only ships the bundled output. To build from upstream source:
# https://github.com/donmccurdy/obsidian-field-recorder
```

## 🚀 Usage

### Basic recording flow

1. **Open the panel** — Click the microphone icon in the left ribbon, or run the command `Field Recorder: Open`
2. **Select input device** (optional) — Choose a mic from the "Input" dropdown at the top of the panel
3. **Adjust quality** (optional) — Set format, bitrate, gain, and noise reduction
4. **Start recording** — Click the red ● button
5. **Pause / Stop** — Click ⏸ to pause, ⬛ to stop and save
6. **Auto-save** — File is saved to `<vault>/audioRecords/`, and the link is inserted into the active note

### Filename and folder

- **Default filename**: `YYYY-MM-DD HH-MM-SS Recording` (e.g. `2026-07-02 14-30-05 Recording.m4a`)
- **Custom filename**: Type in the input box at the top of the panel; leave blank to use the timestamp
- **Custom folder**: Type in the folder input box, or click the 📁 button to pick from existing folders
- **Reset on every open**: Each time the panel is opened, filename clears and folder resets to `audioRecords`, preventing reuse of previous settings

### File layout

```
<vault>/
├── audioRecords/                    ← default recording folder (auto-created)
│   ├── 2026-07-02 14-30-05 Recording.m4a
│   └── 2026-07-02 15-12-33 Recording.m4a
└── Note.md                          ← recording link is inserted here at the cursor
```

### Commands

| Command | Description |
|---|---|
| `Field Recorder: Open` | Open the side panel |
| `Field Recorder: Close` | Close the side panel |
| `Field Recorder: Start recording audio` | Start recording |
| `Field Recorder: Pause recording audio` | Pause recording |
| `Field Recorder: Stop recording audio` | Stop and save |

## 🔧 Tech Stack

| Technology | Purpose |
|---|---|
| [TypeScript](https://www.typescriptlang.org/) | Source language (upstream) |
| [esbuild](https://esbuild.github.io/) | Bundler, outputs minified single-file `main.js` |
| [Obsidian Plugin API](https://github.com/obsidianmd/obsidian-api) | Plugin interface (`Plugin`, `ItemView`, `Vault`, `Workspace`, etc.) |
| [Preact Signals](https://preactjs.com/guide/v10/signals) | Reactive state management (inlined into main.js after minification) |
| [Web Audio API](https://developer.mozilla.org/docs/Web/API/Web_Audio_API) | Audio graph (`AudioContext`, `MediaStreamSource`, `AnalyserNode`, `GainNode`) |
| [MediaRecorder API](https://developer.mozilla.org/docs/Web/API/MediaRecorder) | Native browser recording interface |
| [Canvas 2D](https://developer.mozilla.org/docs/Web/API/Canvas_API) | Waveform rendering |
| Node.js | Test runtime (`tests/` directory) |

### Supported audio formats

| MIME type | Extension | Notes |
|---|---|---|
| `audio/mp4` | `.m4a` | Default (universal on iOS / macOS / Windows) |
| `audio/webm;codecs=opus` | `.webm` | Recommended on Android / Linux |
| `audio/webm;codecs=pcm` | `.webm` | Lossless WebM |

Format availability depends on the Obsidian runtime; the plugin auto-detects supported formats.

## 📝 Changes vs. upstream

| Change | Upstream | This fork |
|---|---|---|
| Default save folder | Empty (falls back to active note's parent folder) | `audioRecords` (at vault root) |
| Auto-create folder | No | Auto-creates `audioRecords` on plugin load |
| Panel open defaults | Keeps previous settings | Resets to empty filename + `audioRecords` folder |
| Filename | `YYYY-MM-DD HH-MM-SS Recording` | Unchanged (fresh timestamp each take) |

Changes are applied directly to the minified `main.js`.

## 🙏 Acknowledgements

This project is a modified fork of Don McCurdy's [obsidian-field-recorder](https://github.com/donmccurdy/obsidian-field-recorder). All core functionality (recording, waveform, device management, settings UI) comes from the original author.

- **Original author**: [Don McCurdy](https://www.donmccurdy.com/)
- **Upstream project**: https://github.com/donmccurdy/obsidian-field-recorder
- **License**: MIT

## 📄 License

Inherits the upstream [MIT License](https://opensource.org/licenses/MIT).

## 🔗 Related Links

- [Obsidian](https://obsidian.md/) — A local-Markdown-based knowledge management tool
- [Obsidian Plugin API](https://github.com/obsidianmd/obsidian-api)
- [Upstream: obsidian-field-recorder](https://github.com/donmccurdy/obsidian-field-recorder)

## ⚠️ Notes

- This repo ships only the bundled `main.js` (minified single line); TypeScript source is not included
- Edits are made directly on the minified output — proceed with care
- For deep source-level customization, please go to the upstream project
- Feedback: [GitHub Issues](https://github.com/pherehouse/field-recorder/issues)
