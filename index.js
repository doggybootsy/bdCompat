import { Plugin } from "@vizality/entities"
import { env } from "process"
import { webFrame } from "electron"
import { AddonAPI, BDApi, ContentManager, PluginManager } from "./modules"

module.exports = class BDCompat extends Plugin {
  start () {
    this.injectStyles("style.css")
    this.defineGlobals()
  }

  stop () {
    if (window.pluginModule) window.pluginModule.destroy()
    if (window.ContentManager) window.ContentManager.destroy()
    this.destroyGlobals()
  }

  defineGlobals () {
    window.bdConfig = { dataPath: __dirname }
    window.settingsCookie = {}

    window.bdplugins = {}
    window.bdpluginErrors = []

    window.bdthemes = {}
    window.themeCookie = {}
    window.bdthemeErrors = []

    window.BdApi = {}
    Object.getOwnPropertyNames(BDApi).filter(m => typeof BDApi[m] == "function" || typeof BDApi[m] == "object").forEach(m => window.BdApi[m] = BDApi[m])
    window.Utils = { monkeyPatch: BDApi.monkeyPatch, suppressErrors: BDApi.suppressErrors, escapeID: BDApi.escapeID }

    window.ContentManager = new ContentManager
    window.pluginModule   = new PluginManager(window.ContentManager.pluginsFolder, this.settings)

    env.injDir = __dirname

    window.BdApi.Plugins = new AddonAPI(window.bdplugins, window.pluginModule)
    window.BdApi.Themes  = new AddonAPI({}, {})

    // Expose to top, not needed but nice
    webFrame.top.context.BdApi = window.BdApi
  }

  destroyGlobals () {
    [
      "bdConfig", 
      "settingsCookie", 
      "bdplugins", 
      "bdpluginErrors", 
      "bdthemes",
      "themeCookie", 
      "bdthemeErrors", 
      "BdApi", 
      "Utils", 
      "ContentManager", 
      "pluginModule"
    ].forEach(g => delete window[g])

    delete env.injDir
  }
}