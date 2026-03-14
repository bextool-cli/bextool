export const browserConfigs = {
  chrome: {
    manifestVersion: 3,
    actionKey: "action",
    background({ includesBackground }) {
      return includesBackground
        ? {
            service_worker: "src/background/background.js",
            type: "module",
          }
        : undefined;
    },
  },
  firefox: {
    manifestVersion: 2,
    actionKey: "browser_action",
    background({ includesBackground }) {
      return includesBackground
        ? {
            scripts: ["src/background/background.js"],
          }
        : undefined;
    },
    browserSpecificSettings(projectName) {
      return {
        gecko: {
          id: `${projectName}@example.com`,
          strict_min_version: "57.0",
        },
      };
    },
  },
  edge: {
    manifestVersion: 3,
    actionKey: "action",
    background({ includesBackground }) {
      return includesBackground
        ? {
            service_worker: "src/background/background.js",
            type: "module",
          }
        : undefined;
    },
  },
  safari: {
    manifestVersion: 3,
    actionKey: "action",
    background({ includesBackground }) {
      return includesBackground
        ? {
            service_worker: "src/background/background.js",
            type: "module",
          }
        : undefined;
    },
  },
};

export function buildBrowserManifest({
  browser,
  projectName,
  description,
  version,
  permissions,
  templateType,
}) {
  const config = browserConfigs[browser];
  if (!config) {
    throw new Error(`Unsupported browser "${browser}".`);
  }

  const includesPopup = templateType === "popup" || templateType === "full";
  const includesBackground = templateType !== "content";
  const includesContent = templateType === "content" || templateType === "full";

  const manifest = {
    manifest_version: config.manifestVersion,
    name: projectName,
    version,
    description,
    permissions: permissions?.length ? permissions : ["storage"],
  };

  const background = config.background({ includesBackground });
  if (background) {
    manifest.background = background;
  }

  if (includesPopup) {
    manifest[config.actionKey] = {
      default_popup: "src/popup/popup.html",
      default_icon: {
        16: "icons/icon16.png",
        48: "icons/icon48.png",
        128: "icons/icon128.png",
      },
    };
  }

  if (includesContent) {
    manifest.content_scripts = [
      {
        matches: ["<all_urls>"],
        js: ["src/content/content.js"],
        css: ["src/content/content.css"],
      },
    ];
  }

  if (config.browserSpecificSettings) {
    manifest.browser_specific_settings = config.browserSpecificSettings(projectName);
  }

  return manifest;
}
