import { webFrame } from "electron"
import { join } from "path"
import { Module } from "module"
import { existsSync, readdirSync, unlinkSync } from "fs"
import { getModule, FluxDispatcher } from "@vizality/webpack"
import { patch, unpatch } from "@vizality/patcher"

// Allow loading from discords node_modules
Module.globalPaths.push(join(process.resourcesPath, "app.asar/node_modules"))

module.exports = class BDPluginManager {
  constructor(pluginsFolder, settings) {
    this.folder   = pluginsFolder
    this.settings = settings

    FluxDispatcher.subscribe("CHANNEL_SELECT", this.channelSwitch = () => this.fireEvent("onSwitch"))

    this.observer = new MutationObserver((mutations) => {
        for (let i = 0, mlen = mutations.length; i < mlen; i++) this.fireEvent("observer", mutations[i])
    })
    this.observer.observe(document, { childList: true, subtree: true })

    // Wait for jQuery, then load the plugins
    window.BdApi.linkJS("jquery", "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js")
      .then(async () => {
        this.__log("Loaded jQuery")

        if (!window.jQuery) {
          Object.defineProperty(window, "jQuery", {
            get: () => webFrame.top.context.window.jQuery
          })
          window.$ = window.jQuery
        }

        const ConnectionStore = await getModule("isTryingToConnect", "isConnected")
        const listener = () => {
          if (!ConnectionStore.isConnected()) return
          ConnectionStore.removeChangeListener(listener)
          this.__log("Loading plugins..")
          this.loadAllPlugins()
          this.startAllEnabledPlugins()
        }
        if (ConnectionStore.isConnected()) listener()
        else ConnectionStore.addChangeListener(listener)
      })
  }

  destroy () {
    window.BdApi.unlinkJS("jquery")
    if (this.channelSwitch) FluxDispatcher.unsubscribe("CHANNEL_SELECT", this.channelSwitch)

    this.observer.disconnect()
    this.stopAllPlugins()
  }


  startAllEnabledPlugins () {
    const plugins = Object.keys(window.bdplugins)

    plugins.forEach((pluginName) => {
      if (window.BdApi.loadData("BDCompat-EnabledPlugins", pluginName)) this.startPlugin(pluginName)
    })
  }

  stopAllPlugins () {
    for (const pluginName of Object.keys(window.bdplugins)) 
      this.stopPlugin(pluginName)
  }


  isEnabled (pluginName) {
    const plugin = window.bdplugins[pluginName]
    if (!plugin) return this.__error(null, `Tried to access a missing plugin: ${pluginName}`)

    return plugin.__started
  }

  startPlugin (pluginName) {
    const plugin = window.bdplugins[pluginName]
    if (!plugin) return this.__error(null, `Tried to start a missing plugin: ${pluginName}`)

    if (plugin.__started) return

    try {
      plugin.plugin.start()
      plugin.__started = true
      this.__log(`Started plugin ${plugin.plugin.getName()}`)
      BdApi.showToast(`Started ${pluginName}`, {type: "success"})
    } 
    catch (err) {
      this.__error(err, `Could not start ${plugin.plugin.getName()}`)
      BdApi.showToast(`Couldn't start ${pluginName}`, {type: "success"})
      window.BdApi.saveData("BDCompat-EnabledPlugins", plugin.plugin.getName(), false)
    }
  }
  stopPlugin (pluginName) {
    const plugin = window.bdplugins[pluginName]
    if (!plugin) return this.__error(null, `Tried to stop a missing plugin: ${pluginName}`)

    if (!plugin.__started) return

    try {
      plugin.plugin.stop()
      plugin.__started = false
      this.__log(`Stopped plugin ${plugin.plugin.getName()}`)
    } 
    catch (err) {
      this.__error(err, `Could not stop ${plugin.plugin.getName()}`)
    }
  }
  reloadPlugin (pluginName) {
    const plugin = window.bdplugins[pluginName]
    if (!plugin) return this.__error(null, `Tried to reload a missing plugin: ${pluginName}`)

    this.stopPlugin(pluginName)

    delete window.bdplugins[pluginName]
    delete require.cache[plugin.__filePath]

    this.loadPlugin(pluginName)
    this.startPlugin(pluginName)
  }

  enablePlugin (pluginName) {
    const plugin = window.bdplugins[pluginName]
    if (!plugin) return this.__error(null, `Tried to enable a missing plugin: ${pluginName}`)

    window.BdApi.saveData("BDCompat-EnabledPlugins", plugin.plugin.getName(), true)
    this.startPlugin(pluginName)
  }
  disablePlugin (pluginName) {
    const plugin = window.bdplugins[pluginName]
    if (!plugin) return this.__error(null, `Tried to disable a missing plugin: ${pluginName}`)
    window.BdApi.saveData("BDCompat-EnabledPlugins", plugin.plugin.getName(), false)
    this.stopPlugin(pluginName)
    BdApi.showToast(`Disabled ${pluginName}`, {type: "success"})
  }

  loadAllPlugins() {
    const plugins = readdirSync(this.folder)
      .filter((pluginFile) => pluginFile.endsWith(".plugin.js"))
      .map((pluginFile) => pluginFile.slice(0, -(".plugin.js".length)))

    plugins.forEach((pluginName) => this.loadPlugin(pluginName))
  }

  loadPlugin(pluginName) {
    const pluginPath = join(this.folder, `${pluginName}.plugin.js`)
    if (!existsSync(pluginPath)) return this.__error(null, `Tried to load a nonexistant plugin: ${pluginName}`)

    try {
      const meta = require(pluginPath)
      try {
        const plugin = new meta.type
        this.addMissingGetMethods(pluginName, meta, plugin)
        if (window.bdplugins[plugin.getName()]) window.bdplugins[plugin.getName()].plugin.stop()
        delete window.bdplugins[plugin.getName()]
        window.bdplugins[plugin.getName()] = { plugin, __filePath: pluginPath, ...meta }

        if (plugin.load && typeof plugin.load === "function") {
          try {
            plugin.load()

            if (pluginName === "0PluginLibrary") this.__patchZLibPatcher()
          } 
          catch (err) {
            this.__error(err, `Failed to preload ${plugin.getName()}`)
          }
        }
        this.__log(`Loaded ${plugin.getName()} v${plugin.getVersion()} by ${plugin.getAuthor()}`)
      } 
      catch (e) {
        this.__error(e, `Failed to load ${pluginName}:`, meta)
      }
    } 
    catch (e) {
      this.__error(`Failed to compile ${pluginName}:`, e)
    }
  }

  delete(pluginName) {
    const plugin = window.bdplugins[pluginName]
    if (!plugin) return this.__error(null, `Tried to delete a missing plugin: ${pluginName}`)

    this.disablePlugin(pluginName)
    if (typeof plugin.plugin.unload === "function") plugin.plugin.unload()
    delete window.bdplugins[pluginName]

    unlinkSync(plugin.__filePath)
  }

  fireEvent (event, ...args) {
    for (const plug in window.bdplugins) {
      const p = window.bdplugins[plug], { plugin } = p
      if (!p.__started || !plugin[event] || typeof plugin[event] !== "function") continue

      try {
        plugin[event](...args)
      } catch (err) {
        this.__error(err, `Could not fire ${event} event for ${plugin.name}`)
      }
    }
  }

  addMissingGetMethods(pluginName, meta, plugin) {
    if (!plugin.getName) plugin.getName = () => meta.name || pluginName
    if (!plugin.getDescription) plugin.getDescription = () => meta.description || ""
    if (!plugin.getVersion) plugin.getVersion = () => meta.version || "0.0.0"
    if (!plugin.getAuthor) plugin.getAuthor = () => meta.author || meta.authorId || "Unknown"
  }


  // ZLibrary checks for instanceof Function and Function class is different in renderer and preload, so need to fix it in bdCompat
  __patchZLibPatcher() {
    this.__unpatchZLibPatcher()

    const _window = webFrame.top.context.window
    if (!window?.ZLibrary?.Patcher) return this.__error(null, "Failed to patch ZLibrary Patcher")

    const origFunction = Function
    patch("bdCompat-zlib-patcher-pre", window.ZLibrary.Patcher, "pushChildPatch", (args) => {
      const orig = args[1]?.[args[2]]
      if (orig && !(orig instanceof origFunction) && orig instanceof _window.Function) window.Function = _window.Function
    }, true)
    patch("bdCompat-zlib-patcher", window.ZLibrary.Patcher, "pushChildPatch", () => window.Function = origFunction)

    this.__log("Patched ZLibrary Patcher")
  }
  __unpatchZLibPatcher() {
    unpatch("bdCompat-zlib-patcher-pre")
    unpatch("bdCompat-zlib-patcher")
  }


  disable = this.disablePlugin
  enable  = this.enablePlugin
  reload  = this.reloadPlugin
  

  __log (...message) {
    console.log("%c[BDCompat:BDPluginManager]", "color: #3a71c1", ...message)
  }

  __warn (...message) {
    console.warn("%c[BDCompat:BDPluginManager]", "color: #e8a400", ...message)
  }

  __error (error, ...message) {
    console.error("%c[BDCompat:BDPluginManager]", "color: red", ...message)

    if (error) {
      console.groupCollapsed(`%cError: ${error.message}`, "color: red")
      console.error(error.stack)
      console.groupEnd()
    }
  }
}