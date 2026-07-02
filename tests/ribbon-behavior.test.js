const assert = require("node:assert/strict");
const Module = require("node:module");

global.MediaRecorder = {
  isTypeSupported: () => true,
};

const originalLoad = Module._load;

Module._load = function load(request, parent, isMain) {
  if (request !== "obsidian") {
    return originalLoad.call(this, request, parent, isMain);
  }

  class Component {
    addChild(child) {
      return child;
    }

    register() {}
  }

  class Plugin extends Component {}

  return {
    Component,
    Plugin,
    ItemView: class {},
    MarkdownView: class {},
    Platform: { isIosApp: false, isDesktop: true },
    Setting: class {},
    Notice: class {},
    setIcon() {},
  };
};

(async () => {
  try {
    const FieldRecorderPlugin = require("../main.js").default;
    const plugin = new FieldRecorderPlugin();

    let opened = 0;
    let started = 0;

    plugin._openView = async () => {
      opened += 1;
    };
    plugin._startRecordingNow = async () => {
      started += 1;
    };

    await plugin._startRecordingFromRibbon();

    assert.equal(opened, 1, "ribbon click opens the recorder view");
    assert.equal(started, 0, "ribbon click does not start recording");

    const realDate = global.Date;
    class FixedDate extends realDate {
      constructor(...args) {
        super(...(args.length ? args : [2026, 5, 29, 15, 42, 8]));
      }
    }

    global.Date = FixedDate;
    try {
      assert.equal(
        require("../main.js").__fieldRecorderTest.defaultRecordingName(),
        "2026-06-29 15-42-08 Recording",
        "default recording names include start time down to seconds",
      );
    } finally {
      global.Date = realDate;
    }
  } finally {
    Module._load = originalLoad;
  }
})();
