export default class DataStore {
  // Plugin
  static setPluginData(pluginName, key, data) {
    let settings = vizality.manager.plugins.get("bd-compat").settings
    let pluginSetings = settings.get("pluginConfigs", {})
    if (typeof pluginSetings === "string") {
      settings.set("pluginConfigs", {})
      pluginSetings = {}
    }
    if (!pluginSetings[pluginName]) pluginSetings[pluginName] = {}
    pluginSetings[pluginName][key] = data
    settings.set("pluginConfigs", pluginSetings)
  }
  static deletePluginData(pluginName, key) {
    let settings = vizality.manager.plugins.get("bd-compat").settings
    let pluginSetings = settings.get("pluginConfigs", {})
    if (typeof pluginSetings === "string") {
      settings.set("pluginConfigs", {})
      pluginSetings = {}
    }
    if (!pluginSetings[pluginName]) pluginSetings[pluginName] = {}
    delete pluginSetings[pluginName][key]
    settings.set("pluginConfigs", pluginSetings)
  }
  static getPluginData(pluginName, key) {
    const settings = vizality.manager.plugins.get("bd-compat").settings.get("pluginConfigs", {})
    return settings?.[pluginName]?.[key]
  }
  // BD 
  static defaultBDSettings = [{"type":"collection","id":"settings","name":"Settings","settings":[{"type":"category","id":"general","collapsible":true,"settings":[{"type":"switch","id":"emotes","value":true,"name":"Emote System","note":"Enables BD's emote system"},{"type":"switch","id":"publicServers","value":true,"name":"Public Servers","note":"Display public servers button"},{"type":"switch","id":"voiceDisconnect","value":false,"name":"Voice Disconnect","note":"Disconnect from voice server when closing Discord"},{"type":"switch","id":"showToasts","value":true,"name":"Show Toasts","note":"Shows a small notification for important information"},{"type":"switch","id":"mediaKeys","value":false,"name":"Disable Media Keys","note":"Prevents Discord from hijacking your media keys after playing a video."}],"name":"General"},{"type":"category","id":"appearance","collapsible":true,"settings":[{"type":"switch","id":"twentyFourHour","value":false,"name":"24-Hour Timestamps","note":"Converts 12-hour timestamps to 24-hour format"},{"type":"switch","id":"hideGiftButton","value":false,"name":"Hide Gift Button","note":"Hides the Nitro Gift button in the textarea"},{"type":"switch","id":"hideGIFButton","value":false,"name":"Hide GIF Button","note":"Hides the GIF picker button in the textarea"},{"type":"switch","id":"minimalMode","value":false,"name":"Minimal Mode","note":"Hide elements and reduce the size of elements"},{"type":"switch","id":"coloredText","value":false,"name":"Colored Text","note":"Make text colour the same as role color"}],"name":"Appearance"},{"type":"category","id":"addons","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"addonErrors","value":true,"name":"Show Addon Errors","note":"Shows a modal with plugin/theme errors"},{"type":"switch","id":"autoReload","value":true,"name":"Automatic Loading","note":"Automatically loads, reloads, and unloads plugins and themes"},{"type":"dropdown","id":"editAction","value":"detached","options":[{"value":"detached","label":"Detached Window"},{"value":"system","label":"System Editor"}],"name":"Edit Action","note":"Where plugins & themes appear when editing"}],"name":"Addon Manager"},{"type":"category","id":"customcss","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"customcss","value":true,"name":"Custom CSS","note":"Enables the Custom CSS tab"},{"type":"switch","id":"liveUpdate","value":false,"name":"Live Update","note":"Updates the css as you type"},{"type":"dropdown","id":"openAction","value":"settings","options":[{"value":"settings","label":"Settings Menu"},{"value":"detached","label":"Detached Window"},{"value":"system","label":"System Editor"}],"name":"Editor Location","note":"Where Custom CSS should open by default"}],"name":"Custom CSS"},{"type":"category","id":"developer","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"debuggerHotkey","value":false,"name":"Debugger Hotkey","note":"Allows activating debugger when pressing F8"},{"type":"switch","id":"reactDevTools","value":false,"name":"React Developer Tools","note":"Injects your local installation of React Developer Tools into Discord"},{"type":"switch","id":"inspectElement","value":false,"name":"Inspect Element Hotkey","note":"Enables the inspect element hotkey (ctrl + shift + c) that is common in most browsers"},{"type":"switch","id":"devToolsWarning","value":false,"name":"Stop DevTools Warning","note":"Stops Discord from printing out their \"Hold Up!\" message"},{"type":"switch","id":"debugLogs","value":false,"name":"Debug Logs","note":"Outputs everything from the console into the debug.log file in the BetterDiscord folder"}],"name":"Developer Settings"},{"type":"category","id":"window","collapsible":true,"shown":false,"settings":[{"type":"switch","id":"transparency","value":false,"name":"Enable Transparency","note":"Enables the main window to be see-through (requires restart)"},{"type":"switch","id":"removeMinimumSize","value":false,"name":"Remove Minimum Size","note":"Removes Discord's forced minimum window size of 940x500"},{"type":"switch","id":"frame","value":false,"hidden":true,"name":"Window Frame","note":"Adds the native os window frame to the main window"}],"name":"Window Preferences"}],"button":null},{"type":"collection","id":"emotes","name":"Emotes","settings":[{"type":"category","id":"general","name":"General","collapsible":true,"settings":[{"type":"switch","id":"download","value":true,"name":"Download Emotes","note":"Download emotes whenever they are out of date"},{"type":"switch","id":"emoteMenu","value":true,"name":"Emote Menu","note":"Show Twitch/Favourite emotes in emote menu"},{"type":"switch","id":"hideEmojiMenu","value":false,"enableWith":"emoteMenu","name":"Hide Emoji Menu","note":"Hides Discord's emoji menu when using emote menu"},{"type":"switch","id":"modifiers","value":true,"name":"Show Emote Modifiers","note":"Enable emote mods (flip, spin, pulse, spin2, spin3, 1spin, 2spin, 3spin, tr, bl, br, shake, shake2, shake3, flap)"},{"type":"switch","id":"animateOnHover","value":false,"name":"Animate On Hover","note":"Only animate the emote modifiers on hover"}]},{"type":"category","id":"categories","name":"Categories","collapsible":true,"settings":[{"type":"switch","id":"twitchglobal","value":true,"name":"Twitch Globals","note":"Show Twitch global emotes"},{"type":"switch","id":"twitchsubscriber","value":false,"name":"Twitch Subscribers","note":"Show Twitch subscriber emotes"},{"type":"switch","id":"frankerfacez","value":true,"name":"FrankerFaceZ","note":"Show emotes from FFZ"},{"type":"switch","id":"bttv","value":true,"name":"BetterTTV","note":"Show emotes from BTTV"}]}],"button":{"title":"Clear Emote Data"}}]
  static isSettingEnabled(collection, category, setId) {
    let settings = vizality.manager.plugins.get("bd-compat").settings
    let bdSettings = settings.get("bdSettings", this.defaultBDSettings)
    bdSettings = bdSettings.filter(m => m.id === collection)[0].settings
    bdSettings = bdSettings.filter(m => m.id === category)[0].settings
    bdSettings = bdSettings.filter(m => m.id === setId)[0].value
    return bdSettings
  }
  static setBDSettings(collection, category, setId, value) {
    let settings = vizality.manager.plugins.get("bd-compat").settings
    let bdSettings = settings.get("bdSettings", this.defaultBDSettings)
    bdSettings.filter(m => m.id === collection)[0].settings.filter(m => m.id === category)[0].settings.filter(m => m.id === setId)[0].value = value
    settings.set("bdSettings", bdSettings)
  }
  static enableSetting(collection, category, setId) { this.setBDSettings(collection, category, setId, true) }
  static disableSetting(collection, category, setId) { this.setBDSettings(collection, category, setId, false) }
  static toggleSetting(collection, category, setId) { this.setBDSettings(collection, category, setId, !this.isSettingEnabled(collection, category, setId)) }
  static getBDData(key) { return vizality.manager.plugins.get("bd-compat").settings.get("dataMisc", {})[key] || "" }
  static setBDData(key, value) {
    let data = vizality.manager.plugins.get("bd-compat").settings.get("dataMisc", {})
    data[key] = value
    vizality.manager.plugins.get("bd-compat").settings.set("dataMisc", data)
  }
}