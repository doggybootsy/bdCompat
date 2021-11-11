import { Plugin } from "@vizality/entities"
import { BdApi, Dom } from "./modules"
import { join } from "path"
import { Module } from "module"
const oldRequire = window.require

export default class BDCompat extends Plugin {
  defaultBDSettings = [{"type":"collection","id":"settings","name":"Settings","settings":[{"type":"category","id":"general","collapsible":true,"settings":[{"type":"switch","id":"emotes","value":true,"name":"Emote System","note":"Enables BD's emote system"},{"type":"switch","id":"publicServers","value":true,"name":"Public Servers","note":"Display public servers button"},{"type":"switch","id":"voiceDisconnect","value":false,"name":"Voice Disconnect","note":"Disconnect from voice server when closing Discord"},{"type":"switch","id":"showToasts","value":true,"name":"Show Toasts","note":"Shows a small notification for important information"},{"type":"switch","id":"mediaKeys","value":false,"name":"Disable Media Keys","note":"Prevents Discord from hijacking your media keys after playing a video."}],"name":"General"},{"type":"category","id":"appearance","collapsible":true,"settings":[{"type":"switch","id":"twentyFourHour","value":false,"name":"24-Hour Timestamps","note":"Converts 12-hour timestamps to 24-hour format"},{"type":"switch","id":"hideGiftButton","value":false,"name":"Hide Gift Button","note":"Hides the Nitro Gift button in the textarea"},{"type":"switch","id":"hideGIFButton","value":false,"name":"Hide GIF Button","note":"Hides the GIF picker button in the textarea"},{"type":"switch","id":"minimalMode","value":false,"name":"Minimal Mode","note":"Hide elements and reduce the size of elements"},{"type":"switch","id":"coloredText","value":false,"name":"Colored Text","note":"Make text colour the same as role color"}],"name":"Appearance"},{"type":"category","id":"addons","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"addonErrors","value":true,"name":"Show Addon Errors","note":"Shows a modal with plugin/theme errors"},{"type":"switch","id":"autoReload","value":true,"name":"Automatic Loading","note":"Automatically loads, reloads, and unloads plugins and themes"},{"type":"dropdown","id":"editAction","value":"detached","options":[{"value":"detached","label":"Detached Window"},{"value":"system","label":"System Editor"}],"name":"Edit Action","note":"Where plugins & themes appear when editing"}],"name":"Addon Manager"},{"type":"category","id":"customcss","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"customcss","value":true,"name":"Custom CSS","note":"Enables the Custom CSS tab"},{"type":"switch","id":"liveUpdate","value":false,"name":"Live Update","note":"Updates the css as you type"},{"type":"dropdown","id":"openAction","value":"settings","options":[{"value":"settings","label":"Settings Menu"},{"value":"detached","label":"Detached Window"},{"value":"system","label":"System Editor"}],"name":"Editor Location","note":"Where Custom CSS should open by default"}],"name":"Custom CSS"},{"type":"category","id":"developer","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"debuggerHotkey","value":false,"name":"Debugger Hotkey","note":"Allows activating debugger when pressing F8"},{"type":"switch","id":"reactDevTools","value":false,"name":"React Developer Tools","note":"Injects your local installation of React Developer Tools into Discord"},{"type":"switch","id":"inspectElement","value":false,"name":"Inspect Element Hotkey","note":"Enables the inspect element hotkey (ctrl + shift + c) that is common in most browsers"},{"type":"switch","id":"devToolsWarning","value":false,"name":"Stop DevTools Warning","note":"Stops Discord from printing out their \"Hold Up!\" message"},{"type":"switch","id":"debugLogs","value":false,"name":"Debug Logs","note":"Outputs everything from the console into the debug.log file in the BetterDiscord folder"}],"name":"Developer Settings"},{"type":"category","id":"window","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"transparency","value":false,"name":"Enable Transparency","note":"Enables the main window to be see-through (requires restart)"},{"type":"switch","id":"removeMinimumSize","value":false,"name":"Remove Minimum Size","note":"Removes Discord's forced minimum window size of 940x500"},{"type":"switch","id":"frame","value":false,"hidden":true,"name":"Window Frame","note":"Adds the native os window frame to the main window"}],"name":"Window Preferences"}],"button":null},{"type":"collection","id":"emotes","name":"Emotes","settings":[{"type":"category","id":"general","name":"General","collapsible":true,"settings":[{"type":"switch","id":"download","value":true,"name":"Download Emotes","note":"Download emotes whenever they are out of date"},{"type":"switch","id":"emoteMenu","value":true,"name":"Emote Menu","note":"Show Twitch/Favourite emotes in emote menu"},{"type":"switch","id":"hideEmojiMenu","value":false,"enableWith":"emoteMenu","name":"Hide Emoji Menu","note":"Hides Discord's emoji menu when using emote menu"},{"type":"switch","id":"modifiers","value":true,"name":"Show Emote Modifiers","note":"Enable emote mods (flip, spin, pulse, spin2, spin3, 1spin, 2spin, 3spin, tr, bl, br, shake, shake2, shake3, flap)"},{"type":"switch","id":"animateOnHover","value":false,"name":"Animate On Hover","note":"Only animate the emote modifiers on hover"}]},{"type":"category","id":"categories","name":"Categories","collapsible":true,"settings":[{"type":"switch","id":"twitchglobal","value":true,"name":"Twitch Globals","note":"Show Twitch global emotes"},{"type":"switch","id":"twitchsubscriber","value":false,"name":"Twitch Subscribers","note":"Show Twitch subscriber emotes"},{"type":"switch","id":"frankerfacez","value":true,"name":"FrankerFaceZ","note":"Show emotes from FFZ"},{"type":"switch","id":"bttv","value":true,"name":"BetterTTV","note":"Show emotes from BTTV"}]}],"button":{"title":"Clear Emote Data"}}]

  start () {
    window.BdApi = BdApi
    window.require = function(path) {
      if ( path === "betterdiscord/bdapi" ) return window.BdApi
      return require(path)
    }
    Dom.initialize()
    this.injectStyles("./assets/styles.scss")
    window.BdApi.settings = this.settings.get("bdSettings", this.defaultBDSettings)
    Module.globalPaths.push(join(process.resourcesPath, "app.asar/node_modules"))
    window.webpackJsonp = []
    window.webpackJsonp.push = () => webpackChunkdiscord_app.push([ [Math.random().toString(36)], {}, (e) => e ])
    const enabledPlugins = this.settings.get("bdEnabledPlugins", [])
    Object.keys(enabledPlugins).map(id => { if (enabledPlugins[id]) BdApi.Plugins.enable(id) })
    // Warning
    if (require("./manifest.json").production && !this.settings.get("shouldUnderConstructionToast", false)) {
      vizality.api.notifications.sendToast({
        header: "BdCompat",
        content: "BdCompat is still under construction. So EXPECT issues!",
        autoClose: true,
        showCloseButton: false,
        id: "bd-compat-construction-toast",
        icon: {
          name: "Construction",
          size: "50px"
        }
      })
      this.settings.toggle("shouldUnderConstructionToast", false)
    }
  }

  stop () {
    window.require = oldRequire
    for (const ite of BdApi.Plugins.getAll())
      if (BdApi.Plugins.isEnabled(ite.id))
        if (ite.exports.stop) ite.exports.stop()
    delete window.BdApi
    Dom.uninitialize()
  }
}