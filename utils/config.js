import Store from "electron-store";

const schema = {
  kickId: {
    type: "string",
    default: "",
  },
  general: {
    type: "object",
    properties: {
      alwaysOnTop: {
        type: "boolean",
        default: false,
      },
      wrapChatroomsList: {
        type: "boolean",
        default: false,
      },
      showTabImages: {
        type: "boolean",
        default: true,
      },
      showTimestamps: {
        type: "boolean",
        default: true,
      },
      timestampFormat: {
        type: "string",
        enum: ["disabled", "h:mm", "hh:mm", "h:mm a", "hh:mm a", "h:mm:ss", "hh:mm:ss", "h:mm:ss a", "hh:mm:ss a"],
        default: "disabled",
      },
    },
    default: {
      alwaysOnTop: false,
      wrapChatroomsList: false,
      showTabImages: true,
      showTimestamps: true,
      timestampFormat: "disabled",
    },
  },
  chatrooms: {
    type: "object",
    properties: {
      showModActions: {
        type: "boolean",
        default: true,
      },
    },
    default: {
      showModActions: true,
    },
  },
  notifications: {
    type: "object",
    properties: {
      enabled: {
        type: "boolean",
        default: true,
      },
      sound: {
        type: "boolean",
        default: true,
      },
      volume: {
        type: "number",
        default: 0.1,
        minimum: 0,
        maximum: 1,
      },
      soundFile: {
        type: "string",
        default: "../resources/sounds/default.wav",
      },
      background: {
        type: "boolean",
        default: true,
      },
      backgroundColour: {
        type: "string",
        default: "#000000",
      },
      phrases: {
        type: "array",
        default: [],
      },
    },
    default: {
      enabled: true,
      sound: true,
      volume: 1,
      soundFile: "../resources/sounds/default.wav",
    },
  },
  sevenTV: {
    type: "object",
    properties: {
      enabled: {
        type: "boolean",
        default: true,
      },
      paints: {
        type: "boolean",
        default: true,
      },
      emotes: {
        type: "boolean",
        default: true,
      },
      badges: {
        type: "boolean",
        default: true,
      },
    },
    default: {
      enabled: true,
      paints: true,
      emotes: true,
      badges: true,
    },
  },
  theme: {
    type: "string",
    enum: ["light", "dark"],
    default: "dark",
  },
  zoomFactor: {
    type: "number",
    default: 1,
  },
  lastMainWindowState: {
    type: "object",
    properties: {
      x: {
        type: "number",
      },
      y: {
        type: "number",
      },
      width: {
        type: "number",
      },
      height: {
        type: "number",
      },
    },
    default: { x: undefined, y: undefined, width: 480, height: 900 },
  },
};

const store = new Store({
  schema,
});

export default store;
