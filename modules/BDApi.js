import { getModule, getAllModules, getModuleByDisplayName, React, ReactDOM, getModuleByPrototypes } from "@vizality/webpack"
import { patch, unpatch } from "@vizality/patcher"
import { join } from "path"
import { existsSync, writeFileSync, mkdirSync, readFileSync } from "fs"
import { randomBytes } from "crypto"
import {  Messages, Button, openModal, ConfirmationModal, Markdown } from "../constants"
import { Patcher, DiscordModules } from "."

const { getOwnerInstance, getReactInstance } = require("@vizality/util").react

const PluginData = {}


// __ is not part of BdApi entirely
// _ is part of BD but not exactly in BdApi, but kept here anyway for easier maintain

class BdApi {
  // React
  static get React () {return React}
  static get ReactDOM () {return ReactDOM}
  // Patcher
  static get Patcher() {return Patcher}
  // General
  static getCore () {
    return null
  }
  static escapeID (id) {
    return id.replace(/^[^a-z]+|[^\w-]+/giu, "")
  }
  static suppressErrors (method, message = "") {
    return (...params) => {
      try {
        return method(...params)
      } catch (err) {
        BdApi.__error(err, `Error occured in ${message}`)
      }
    }
  }
  static testJSON (data) {
    try {
      JSON.parse(data)
      return true
    } catch (err) {
      return false
    }
  }
  // Style tag
  static get __styleParent () {
    return BdApi.__elemParent("style")
  }
  static injectCSS (id, css) {
    const style = document.createElement("style")
    style.id = `bd-style-${BdApi.escapeID(id)}`
    style.innerHTML = css
    BdApi.__styleParent.append(style)
  }
  static clearCSS (id) {
    const elem = document.getElementById(`bd-style-${BdApi.escapeID(id)}`)
    if (elem) elem.remove()
  }
  // Script tag
  static get __scriptParent () {
    return BdApi.__elemParent("script")
  }
  static linkJS (id, url) {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.id = `bd-script-${BdApi.escapeID(id)}`
      script.src = url
      script.type = "text/javascript"
      script.onload = resolve
      BdApi.__scriptParent.append(script)
    })
  }
  static unlinkJS (id) {
    const elem = document.getElementById(`bd-script-${BdApi.escapeID(id)}`)
    if (elem) elem.remove()
  }
  // Plugin data
  static get __pluginData () {
    return PluginData
  }
  static __getPluginConfigPath (pluginName) {
    return join(__dirname, "..", "config", pluginName + ".config.json")
  }
  static __getPluginConfig (pluginName) {
    const configPath = BdApi.__getPluginConfigPath(pluginName)
    if (typeof BdApi.__pluginData[pluginName] === "undefined")
      if (!existsSync(configPath)) {
        BdApi.__pluginData[pluginName] = {}
      } else {
        try {
          BdApi.__pluginData[pluginName] = JSON.parse(readFileSync(configPath))
        } catch (e) {
          BdApi.__pluginData[pluginName] = {}
          BdApi.__warn(`${pluginName} has corrupted or empty config file, loaded as {}`)
        }
      }
    return BdApi.__pluginData[pluginName]
  }
  static __savePluginConfig (pluginName) {
    const configPath = BdApi.__getPluginConfigPath(pluginName)
    const configFolder = join(__dirname, "..", "config/")
    if (!existsSync(configFolder)) mkdirSync(configFolder)
    writeFileSync(configPath, JSON.stringify(BdApi.__pluginData[pluginName], null, 2))
  }
  static loadData (pluginName, key) {
    const config = BdApi.__getPluginConfig(pluginName)
    return config[key]
  }
  static get getData () {
    return BdApi.loadData
  }
  static saveData (pluginName, key, value) {
    if (typeof value === "undefined") return
    const config = BdApi.__getPluginConfig(pluginName)
    config[key] = value
    BdApi.__savePluginConfig(pluginName)
  }
  static get setData () {
    return BdApi.saveData
  }
  static deleteData (pluginName, key) {
    const config = BdApi.__getPluginConfig(pluginName)
    if (typeof config[key] === "undefined") return
    delete config[key]
    BdApi.__savePluginConfig(pluginName)
  }
  // Plugin communication
  static getPlugin (name) {
    if (window.bdplugins[name]) return window.bdplugins[name].plugin
  }
  // Alerts and toasts
  static async alert(title, children) {
    return BdApi.showConfirmationModal(title, children, { cancelText: null })
  }
  static async showConfirmationModal(title, content, options = {}) {
    if (!ConfirmationModal || !Markdown) return this.default(title, content)
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
  }
  static showToast (content, options = {}) {
    const { type = "", icon = true, timeout = 3000 } = options
    const toastElem = document.createElement("div")
    toastElem.classList.add("bd-toast")
    toastElem.innerText = content
    if (type) toastElem.classList.add(`toast-${type}`)
    if (type && icon) toastElem.classList.add("icon")
    const toastWrapper = BdApi.__createToastWrapper()
    toastWrapper.appendChild(toastElem)
    setTimeout(() => {
      toastElem.classList.add("closing")
      setTimeout(() => {
        toastElem.remove()
        if (!document.querySelectorAll(".bd-toasts .bd-toast").length) toastWrapper.remove()
      }, 300)
    }, timeout)
  }
  static __createToastWrapper () {
    const toastWrapperElem = document.querySelector(".bd-toasts")
    if (!toastWrapperElem) {
      const DiscordElements = {
        settings: ".contentColumn-2hrIYH, .customColumn-Rb6toI",
        chat: ".chat-3bRxxu form",
        friends: ".container-3gCOGc",
        serverDiscovery: ".pageWrapper-1PgVDX",
        applicationStore: ".applicationStore-1pNvnv",
        gameLibrary: ".gameLibrary-TTDw4Y",
        activityFeed: ".activityFeed-28jde9",
      }
      const boundingElement = document.querySelector(Object.keys(DiscordElements).map((component) => DiscordElements[component]).join(", "))
      const toastWrapper = document.createElement("div")
      toastWrapper.classList.add("bd-toasts")
      toastWrapper.style.setProperty("width", boundingElement ? `${boundingElement.offsetWidth}px` : "100%")
      toastWrapper.style.setProperty("left", boundingElement ? boundingElement.getBoundingClientRect().left + "px" : "0px")
      toastWrapper.style.setProperty(
        "bottom",
        (document.querySelector(DiscordElements.chat) ? document.querySelector(DiscordElements.chat).offsetHeight + 20 : 80) + "px"
      )
      document.querySelector("#app-mount > div[class^=\"app-\"]").appendChild(toastWrapper)
      return toastWrapper
    }
    return toastWrapperElem
  }
  // Discord's internals manipulation and such
  static onRemoved (node, callback) {
    const observer = new MutationObserver((mutations) => {
      for (const mut in mutations) {
        const mutation = mutations[mut]
        const nodes = Array.from(mutation.removedNodes)
        const directMatch = nodes.indexOf(node) > -1
        const parentMatch = nodes.some((parent) => parent.contains(node))
        if (directMatch || parentMatch) {
          observer.disconnect()
          return callback()
        }
      }
    })
    observer.observe(document.body, { subtree: true, childList: true })
  }

  static getInternalInstance (node) {
    return getOwnerInstance(node[0])
  }

  static findModule(filter) {
    return getModule(filter, false)
  }

  static findAllModules(filter) {
    return getAllModules(filter)
  }

  static findModuleByProps(...props) {
    return BdApi.findModule((module) => props.every((prop) => typeof module[prop] !== "undefined"))
  }

  static findModuleByPrototypes(...protos) {
    return getModuleByPrototypes([protos])
  }

  static findModuleByDisplayName(displayName) {
    return getModuleByDisplayName(displayName, false)
  }

  static monkeyPatch (what, methodName, options = {}) {
    const displayName = options.displayName || what.displayName || what[methodName].displayName || what.name || what.constructor.displayName || what.constructor.name || "MissingName"

    if (!what[methodName])
      if (options.force) {
        what[methodName] = function forcedFunction () {}
      } else {
        return BdApi.__error(null, `${methodName} doesn't exist in ${displayName}!`)
      }
    if (!options.silent)
      BdApi.__log(`Patching ${displayName}'s ${methodName} method`)
    const origMethod = what[methodName]
    if (options.instead) {
      const cancel = () => {
        if (!options.silent) BdApi.__log(`Unpatching instead of ${displayName} ${methodName}`)
        what[methodName] = origMethod
      }
      what[methodName] = function () {
        const data = {
          thisObject: this,
          methodArguments: arguments,
          cancelPatch: cancel,
          originalMethod: origMethod,
          callOriginalMethod: () => data.returnValue = data.originalMethod.apply(data.thisObject, data.methodArguments)
        }
        const tempRet = BdApi.suppressErrors(options.instead, "`instead` callback of " + what[methodName].displayName)(data)
        if (tempRet !== undefined) data.returnValue = tempRet
        return data.returnValue
      }
      if (displayName != "MissingName") what[methodName].displayName = displayName
      return cancel
    }
    const patches = []
    if (options.before) patches.push(BdApi.__injectBefore({ what, methodName, options, displayName }, origMethod))
    if (options.after) patches.push(BdApi.__injectAfter({ what, methodName, options, displayName }, origMethod))
    if (displayName != "MissingName") what[methodName].displayName = displayName
    const finalCancelPatch = () => patches.forEach((patch) => patch())
    return finalCancelPatch
  }

  static __injectBefore (data, origMethod) {
    const patchID = `bd-patch-before-${data.displayName.toLowerCase()}-${randomBytes(4).toString("hex")}`

    const cancelPatch = () => {
      if (!data.options.silent) BdApi.__log(`Unpatching before of ${data.displayName} ${data.methodName}`)
      unpatch(patchID)
    }

    patch(patchID, data.what, data.methodName, function beforePatch (args, res) {
      const patchData = {
        // eslint-disable-next-line no-invalid-this
        thisObject: this,
        methodArguments: args,
        returnValue: res,
        cancelPatch: cancelPatch,
        originalMethod: origMethod,
        callOriginalMethod: () => patchData.returnValue = patchData.originalMethod.apply(patchData.thisObject, patchData.methodArguments)
      }

      try {
        data.options.before(patchData)
      } catch (err) {
        BdApi.__error(err, `Error in before callback of ${data.displayName} ${data.methodName}`)
      }

      if (data.options.once) cancelPatch()

      return patchData.methodArguments
    }, true)

    return cancelPatch
  }

  static __injectAfter (data, origMethod) {
    const patchID = `bd-patch-after-${data.displayName.toLowerCase()}-${randomBytes(4).toString("hex")}`

    const cancelPatch = () => {
      if (!data.options.silent) BdApi.__log(`Unpatching after of ${data.displayName} ${data.methodName}`)
      unpatch(patchID)
    }

    patch(patchID, data.what, data.methodName, function afterPatch (args, res) {
      const patchData = {
        // eslint-disable-next-line no-invalid-this
        thisObject: this,
        methodArguments: args,
        returnValue: res,
        cancelPatch: cancelPatch,
        originalMethod: origMethod,
        callOriginalMethod: () => patchData.returnValue = patchData.originalMethod.apply(patchData.thisObject, patchData.methodArguments)
      }

      try {
        data.options.after(patchData)
      } catch (err) {
        BdApi.__error(err, `Error in after callback of ${data.displayName} ${data.methodName}`)
      }

      if (data.options.once) cancelPatch()

      return patchData.returnValue
    }, false)

    return cancelPatch
  }

  static getInternalInstance (node) {
    return getReactInstance(node[0])
  }

  static get settings() { // mess
    return {"Custom css live update":{id:"bda-css-0"},"Custom css auto udpate":{id:"bda-css-1"},"BetterDiscord Blue":{id:"bda-gs-b"},"Public Servers":{id:"bda-gs-1"},"Minimal Mode":{id:"bda-gs-2"},"Voice Mode":{id:"bda-gs-4"},"Hide Channels":{id:"bda-gs-3"},"Dark Mode":{id:"bda-gs-5"},"Voice Disconnect":{id:"bda-dc-0"},"24 Hour Timestamps":{id:"bda-gs-6"},"Colored Text":{id:"bda-gs-7"},"Normalize Classes":{id:"fork-ps-4"},"Content Error Modal":{id:"fork-ps-1"},"Show Toasts":{id:"fork-ps-2"},"Scroll To Settings":{id:"fork-ps-3"},"Automatic Loading":{id:"fork-ps-5"},"Developer Mode":{id:"bda-gs-8"},"Copy Selector":{id:"fork-dm-1"},"React DevTools":{id:"reactDevTools"},"Enable Transparency":{id:"fork-wp-1"},"Window Frame":{id:"fork-wp-2"},"Download Emotes":{id:"fork-es-3"},"Twitch Emotes":{id:"bda-es-7"},"FrankerFaceZ Emotes":{id:"bda-es-1"},"BetterTTV Emotes":{id:"bda-es-2"},"Emote Menu":{id:"bda-es-0"},"Emoji Menu":{id:"bda-es-9"},"Emote Auto Capitalization":{id:"bda-es-4"},"Show Names":{id:"bda-es-6"},"Show emote modifiers":{id:"bda-es-8"},"Animate On Hover":{id:"fork-es-2"}}
  }

  static isSettingEnabled(e) {
    return !!settingsCookie[e]
  }

  static isPluginEnabled (name) {
    const plugin = bdplugins[name]
    return plugin ? plugin.__started : false
  }

  static isThemeEnabled () {
    return false
  }

  // Miscellaneous, things that aren't part of BD
  static __elemParent (id) {
    const elem = document.getElementsByTagName(`bd-${id}`)[0]
    if (elem) return elem

    const newElem = document.createElement(`bd-${id}`)
    document.head.append(newElem)

    return newElem
  }

  static __log (...message) {
    console.log("%c[BDCompat:BdApi]", "color: #3a71c1", ...message)
  }

  static __warn (...message) {
    console.log("%c[BDCompat:BdApi]", "color: #e8a400", ...message)
  }

  static __error (error, ...message) {
    console.log("%c[BDCompat:BdApi]", "color: red", ...message)

    if (error) {
      console.groupCollapsed(`%cError: ${error.message}`, "color: red")
      console.error(error.stack)
      console.groupEnd()
    }
  }
  static __DiscordModules () {
    return DiscordModules
  }
}

module.exports = BdApi