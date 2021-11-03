import React from "react"
import ReactDOM from "react-dom"
import { Logger, Dom, Toasts } from "./"
import { getModuleByDisplayName, getModuleByPrototypes, getModule, getModules } from "@vizality/webpack"

const BdApi = {
  // React
  React, 
  ReactDOM,
  // BD stuff
  settings: {},
  version: "1.2.4",
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
    catch (error) {return false}
  },
  // Window stuff
  getWindowPreference: function() {return null },
  getAllWindowPreferences: function() {  },
  setWindowPreference: function() { return null },
  // Modules
  findModuleByDisplayName: function(name) {return getModuleByDisplayName(name)},
  findModuleByPrototypes: function(...protos) {return getModuleByPrototypes([...protos])},
  findModuleByProps: function(...props) { return getModule(...props) },
  findModule: function(filter) { return getModule(filter) },
  findAllModules: function(filter) { return getModules(filter) },
  // Patcher
  Patcher: {

  },
  // Data
  
  // Modals
  showConfirmationModal: async function(title, content, options = {}) {
    const { Messages } = getModule(m => m.Messages && m.Messages.OKAY)
    const { openModal } = getModule("openModal", "openModalLazy")
    const Button = getModule("ButtonLooks")
    const ConfirmationModal = getModuleByDisplayName("ConfirmModal")
    const Markdown = getModule(m => m.displayName && m.displayName === "Markdown" && m.rules)
    const emptyFunction = () => {}
    const {onConfirm = emptyFunction, onCancel = emptyFunction, confirmText = Messages.OKAY, cancelText = Messages.CANCEL, danger = false, key = undefined} = options
    if (!Array.isArray(content)) content = [content]
    content = content.map(c => typeof(c) === "string" ? React.createElement(Markdown, null, c) : c)
    return openModal(props => {
      return React.createElement(ConfirmationModal, Object.assign({
        header: title,
        confirmButtonColor: danger ? Button.ButtonColors.RED : Button.ButtonColors.BRAND,
        confirmText: confirmText,
        cancelText: cancelText,
        onConfirm: onConfirm,
        onCancel: onCancel
      }, props), content)
    }, {modalKey: key})
  },
  alert: async function(title, children) { BdApi.showConfirmationModal(title, children, { cancelText: null }) },
  // Misc
  showToast: function(content, options = {}) {
    Toasts.show(content, options)
  },
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
  })
}
export default BdApi