import React from "react"
import ReactDOM from "react-dom"
import { Logger, Dom, Toasts } from "."
import { getModuleByDisplayName, getModuleByPrototypes, getModule, getModules } from "@vizality/webpack"
import DataStore from "./DataStore"
import AddonApi from "./AddonApi"
import Patcher from "./Patcher"

const defaultBDSettings = [{"type":"collection","id":"settings","name":"Settings","settings":[{"type":"category","id":"general","collapsible":true,"settings":[{"type":"switch","id":"emotes","value":true,"name":"Emote System","note":"Enables BD's emote system"},{"type":"switch","id":"publicServers","value":true,"name":"Public Servers","note":"Display public servers button"},{"type":"switch","id":"voiceDisconnect","value":false,"name":"Voice Disconnect","note":"Disconnect from voice server when closing Discord"},{"type":"switch","id":"showToasts","value":true,"name":"Show Toasts","note":"Shows a small notification for important information"},{"type":"switch","id":"mediaKeys","value":false,"name":"Disable Media Keys","note":"Prevents Discord from hijacking your media keys after playing a video."}],"name":"General"},{"type":"category","id":"appearance","collapsible":true,"settings":[{"type":"switch","id":"twentyFourHour","value":false,"name":"24-Hour Timestamps","note":"Converts 12-hour timestamps to 24-hour format"},{"type":"switch","id":"hideGiftButton","value":false,"name":"Hide Gift Button","note":"Hides the Nitro Gift button in the textarea"},{"type":"switch","id":"hideGIFButton","value":false,"name":"Hide GIF Button","note":"Hides the GIF picker button in the textarea"},{"type":"switch","id":"minimalMode","value":false,"name":"Minimal Mode","note":"Hide elements and reduce the size of elements"},{"type":"switch","id":"coloredText","value":false,"name":"Colored Text","note":"Make text colour the same as role color"}],"name":"Appearance"},{"type":"category","id":"addons","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"addonErrors","value":true,"name":"Show Addon Errors","note":"Shows a modal with plugin/theme errors"},{"type":"switch","id":"autoReload","value":true,"name":"Automatic Loading","note":"Automatically loads, reloads, and unloads plugins and themes"},{"type":"dropdown","id":"editAction","value":"detached","options":[{"value":"detached","label":"Detached Window"},{"value":"system","label":"System Editor"}],"name":"Edit Action","note":"Where plugins & themes appear when editing"}],"name":"Addon Manager"},{"type":"category","id":"customcss","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"customcss","value":true,"name":"Custom CSS","note":"Enables the Custom CSS tab"},{"type":"switch","id":"liveUpdate","value":false,"name":"Live Update","note":"Updates the css as you type"},{"type":"dropdown","id":"openAction","value":"settings","options":[{"value":"settings","label":"Settings Menu"},{"value":"detached","label":"Detached Window"},{"value":"system","label":"System Editor"}],"name":"Editor Location","note":"Where Custom CSS should open by default"}],"name":"Custom CSS"},{"type":"category","id":"developer","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"debuggerHotkey","value":false,"name":"Debugger Hotkey","note":"Allows activating debugger when pressing F8"},{"type":"switch","id":"reactDevTools","value":false,"name":"React Developer Tools","note":"Injects your local installation of React Developer Tools into Discord"},{"type":"switch","id":"inspectElement","value":false,"name":"Inspect Element Hotkey","note":"Enables the inspect element hotkey (ctrl + shift + c) that is common in most browsers"},{"type":"switch","id":"devToolsWarning","value":false,"name":"Stop DevTools Warning","note":"Stops Discord from printing out their \"Hold Up!\" message"},{"type":"switch","id":"debugLogs","value":false,"name":"Debug Logs","note":"Outputs everything from the console into the debug.log file in the BetterDiscord folder"}],"name":"Developer Settings"},{"type":"category","id":"window","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"transparency","value":false,"name":"Enable Transparency","note":"Enables the main window to be see-through (requires restart)"},{"type":"switch","id":"removeMinimumSize","value":false,"name":"Remove Minimum Size","note":"Removes Discord's forced minimum window size of 940x500"},{"type":"switch","id":"frame","value":false,"hidden":true,"name":"Window Frame","note":"Adds the native os window frame to the main window"}],"name":"Window Preferences"}],"button":null},{"type":"collection","id":"emotes","name":"Emotes","settings":[{"type":"category","id":"general","name":"General","collapsible":true,"settings":[{"type":"switch","id":"download","value":true,"name":"Download Emotes","note":"Download emotes whenever they are out of date"},{"type":"switch","id":"emoteMenu","value":true,"name":"Emote Menu","note":"Show Twitch/Favourite emotes in emote menu"},{"type":"switch","id":"hideEmojiMenu","value":false,"enableWith":"emoteMenu","name":"Hide Emoji Menu","note":"Hides Discord's emoji menu when using emote menu"},{"type":"switch","id":"modifiers","value":true,"name":"Show Emote Modifiers","note":"Enable emote mods (flip, spin, pulse, spin2, spin3, 1spin, 2spin, 3spin, tr, bl, br, shake, shake2, shake3, flap)"},{"type":"switch","id":"animateOnHover","value":false,"name":"Animate On Hover","note":"Only animate the emote modifiers on hover"}]},{"type":"category","id":"categories","name":"Categories","collapsible":true,"settings":[{"type":"switch","id":"twitchglobal","value":true,"name":"Twitch Globals","note":"Show Twitch global emotes"},{"type":"switch","id":"twitchsubscriber","value":false,"name":"Twitch Subscribers","note":"Show Twitch subscriber emotes"},{"type":"switch","id":"frankerfacez","value":true,"name":"FrankerFaceZ","note":"Show emotes from FFZ"},{"type":"switch","id":"bttv","value":true,"name":"BetterTTV","note":"Show emotes from BTTV"}]}],"button":{"title":"Clear Emote Data"}}]

const makeAddonAPI = (manager) => new class AddonAPI {
  get folder() { return manager.addonFolder }
  isEnabled(idOrFile) { return manager.isEnabled(idOrFile) }
  enable(idOrAddon) { return manager.enableAddon(idOrAddon) }
  disable(idOrAddon) { return manager.disableAddon(idOrAddon) }
  toggle(idOrAddon) { return manager.toggleAddon(idOrAddon) }
  reload(idOrFileOrAddon) { return manager.reloadAddon(idOrFileOrAddon) }
  get(idOrFile) { return manager.getAddon(idOrFile) }
  getAll() { return manager.addonList.map(a => manager.getAddon(a.id)) }
}

const BdApi = {
  // React
  React, 
  ReactDOM,
  getInternalInstance: function(node) { return Dom.getReactInstance(node) },
  // BD stuff
  settings: defaultBDSettings,
  version: "1.2.4",
  Themes: new class {
    // Just recycle Vizality's theme manager
    get folder() { return vizality.manager.themes.dir }
    isEnabled(idOrAddon) { return vizality.manager.themes.get(idOrAddon)._applied }
    enable(idOrAddon) { return vizality.manager.themes.enable(idOrAddon) }
    disable(idOrAddon) { return vizality.manager.themes.disable(idOrAddon) }
    toggle(idOrAddon) { return this.isEnabled(idOrAddon) ? this.disable(idOrAddon) : this.enable(idOrAddon) }
    reload(idOrAddon) { 
      const addon = vizality.manager.themes.get(idOrAddon)
      return addon._unload(), addon._load()
    }
    get(idOrFile) {
      const theme = vizality.manager.themes.get(idOrFile)
      if (!theme) return undefined
      theme.manifest["format"] = "json"
      theme.manifest["id"] = idOrFile
      if (!theme.manifest["css"]) vizality.native._compileSass(theme.compiler.file).then(css => theme.manifest["css"] = css)
      return theme.manifest
    }
    getAll() { return vizality.manager.themes.keys.map(themes => this.get(themes)) }
  },
  Plugins: makeAddonAPI(AddonApi.PluginManager),
  // DOM stuff
  injectCSS: function(id, css) { Dom.injectCSS(id, css) },
  clearCSS: function(id) { Dom.clearCSS(id) },
  linkJS: function(id, url) { Dom.linkJS(id, url) },
  unlinkJS: function(id) { Dom.unlinkJS(id) },
  onRemoved: function(node, callback) { Dom.onRemoved(node, callback) },
  // Test json
  testJSON: function(json) { 
    try {
      JSON.parse(json)
      return true
    } 
    catch (error) { return false }
  },
  // Window stuff
  getWindowPreference: function() {
    Logger.warn("Deprecated", "BdApi.getWindowPreference() has been deprecated due to the new handling of window transparency.")
    return null
  },
  getAllWindowPreferences: function() { Logger.warn("Deprecated", "BdApi.getAllWindowPreferences() has been deprecated due to the new handling of window transparency.") },
  setWindowPreference: function() { Logger.warn("Deprecated", "BdApi.setWindowPreference() has been deprecated due to the new handling of window transparency.") },
  // Modules
  findModuleByDisplayName: function(name) {return getModuleByDisplayName(name)},
  findModuleByPrototypes: function(...protos) {return getModuleByPrototypes([...protos])},
  findModuleByProps: function(...props) { return getModule(...props) },
  findModule: function(filter) { return getModule(filter) },
  findAllModules: function(filter) { return getModules(filter) },
  // Patcher
  Patcher: {
    patch: (caller, moduleToPatch, functionName, callback, options = {}) => {
      if (typeof(caller) !== "string") return Logger.err("BdApi.Patcher", "Parameter 0 of patch must be a string representing the caller")
      if (options.type !== "before" && options.type !== "instead" && options.type !== "after") return Logger.err("BdApi.Patcher", "options.type must be one of: before, instead, after")
      return Patcher.pushChildPatch(caller, moduleToPatch, functionName, callback, options)
    },
    before: (caller, moduleToPatch, functionName, callback, options = {}) => BdApi.Patcher.patch(caller, moduleToPatch, functionName, callback, Object.assign(options, {type: "before"})),
    instead: (caller, moduleToPatch, functionName, callback, options = {}) => BdApi.Patcher.patch(caller, moduleToPatch, functionName, callback, Object.assign(options, {type: "instead"})),
    after: (caller, moduleToPatch, functionName, callback, options = {}) => BdApi.Patcher.patch(caller, moduleToPatch, functionName, callback, Object.assign(options, {type: "after"})),
    getPatchesByCaller: (caller) => {
      if (typeof(caller) !== "string") return Logger.err("BdApi.Patcher", "Parameter 0 of getPatchesByCaller must be a string representing the caller")
      return Patcher.getPatchesByCaller(caller)
    },
    unpatchAll: (caller) => {
      if (typeof(caller) !== "string") return Logger.err("BdApi.Patcher", "Parameter 0 of unpatchAll must be a string representing the caller")
      return Patcher.unpatchAll(caller)
    }
  },
  monkeyPatch: function(what, methodName, options) {
    const {before, after, instead, once = false, callerId = "BdApi"} = options
    const patchType = before ? "before" : after ? "after" : instead ? "instead" : ""
    if (!patchType) return Logger.err("BdApi", "Must provide one of: after, before, instead")
    const originalMethod = what[methodName]
    const data = {
      originalMethod: originalMethod,
      callOriginalMethod: () => data.originalMethod.apply(data.thisObject, data.methodArguments)
    }
    data.cancelPatch = Patcher[patchType](callerId, what, methodName, (thisObject, args, returnValue) => {
      data.thisObject = thisObject
      data.methodArguments = args
      data.returnValue = returnValue
      try {
        const patchReturn = Reflect.apply(options[patchType], null, [data])
        if (once) data.cancelPatch()
        return patchReturn
      }
      catch (err) {
        Logger.err(`${callerId}:monkeyPatch`, `Error in the ${patchType} of ${methodName}`)
      }
    })
    return data.cancelPatch
  },
  // Data
  loadData: function(pluginName, key) { return DataStore.getPluginData(pluginName, key) },
  getData: function(pluginName, key) { return DataStore.getPluginData(pluginName, key) },
  saveData: function(pluginName, key, data) { return DataStore.setPluginData(pluginName, key, data) },
  setData: function(pluginName, key, data) { return DataStore.setPluginData(pluginName, key, data) },
  deleteData: function(pluginName, key) { return DataStore.deletePluginData(pluginName, key) },
  openDialog: function(pluginName, key) { return null },
  // BD data
  isSettingEnabled: function(collection, category, id) { return DataStore.isSettingEnabled(collection, category, id) },
  enableSetting: function(collection, category, id) { return DataStore.enableSetting(collection, category, id) },
  disableSetting: function(collection, category, id) { return DataStore.disableSetting(collection, category, id) },
  toggleSetting: function(collection, category, id) { return DataStore.toggleSetting(collection, category, id) },
  // Modals
  showConfirmationModal: async function(title, content, options = {}) {
    const { Messages } = BdApi.findModule(m => m.Messages && Object.keys(m.Messages).length && (typeof m.Messages.ADD_REACTION_NAMED === "object") && (m.Messages.OKAY && !(m.Messages.OKAY === "")))
    const { openModal } = getModule("openModal", "openModalLazy")
    const Button = getModule("ButtonLooks")
    const ConfirmationModal = getModuleByDisplayName("ConfirmModal")
    const Markdown = getModule(m => m.displayName && m.displayName === "Markdown" && m.rules)
    const emptyFunction = () => {}
    const {onConfirm = emptyFunction, onCancel = emptyFunction, confirmText = Messages.OKAY, cancelText = Messages.CANCEL, danger = false, key = undefined} = options
    if (!Array.isArray(content)) content = [content]
    content = content.map(c => typeof(c) === "string" ? React.createElement(Markdown, null, c) : c)
    return openModal(props => {
      return <ConfirmationModal {...props} header={title} {...{
        header: title,
        confirmButtonColor: danger ? Button.ButtonColors.RED : Button.ButtonColors.BRAND,
        confirmText, cancelText, onConfirm, onCancel
      }}>{content}</ConfirmationModal>
    }, {modalKey: key})
  },
  alert: async function(title, children) { BdApi.showConfirmationModal(title, children, { cancelText: null }) },
  // Misc
  showToast: function(content, options = {}) { Toasts.show(content, options) },
  escapeID: function(id) { return id.replace(/^[^a-z]+|[^\w-]+/gi, "-") },
  WindowConfigFile: "",
  emotes: new Proxy({ TwitchGlobal: {}, TwitchSubscriber: {}, BTTV: {}, FrankerFaceZ: {} }, {
    get(obj, category) {
      if (category === "blocklist") return []
      const group = { TwitchGlobal: {}, TwitchSubscriber: {}, BTTV: {}, FrankerFaceZ: {} }[category]
      if (!group) return undefined
      return new Proxy(group, {
        get(cat, emote) { return group[emote] },
        set() { Logger.warn("BdApi.emotes", "Addon policy for plugins #5 https://github.com/BetterDiscord/BetterDiscord/wiki/Addon-Policies#plugins") }
      })
    },
    set() { Logger.warn("BdApi.emotes", "Addon policy for plugins #5 https://github.com/BetterDiscord/BetterDiscord/wiki/Addon-Policies#plugins") }
  }),
  suppressErrors: function(method, message) {
    return (...params) => {
      try { return method(...params) }
      catch (e) { Logger.stacktrace("SuppressedError", "Error occurred in " + message, e) }
    }
  }
}
export default BdApi