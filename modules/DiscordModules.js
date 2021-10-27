/**
 * I took all this off of
 * @link https://github.com/BetterDiscord/BetterDiscord/blob/main/renderer/src/modules/utilities.js
 * and
 * @link https://github.com/BetterDiscord/BetterDiscord/blob/main/renderer/src/modules/discordmodules.js
 */
const memoizeObject = (object) => {
  const proxy = new Proxy(object, {
    get: function(obj, mod) {
      if (!obj.hasOwnProperty(mod)) return undefined
        if (Object.getOwnPropertyDescriptor(obj, mod).get) {
          const value = obj[mod]
          delete obj[mod]
          obj[mod] = value
        }
        return obj[mod]
    },
    set: function(obj, mod, value) {
      if (obj.hasOwnProperty(mod)) return log.error("MemoizedObject", "Trying to overwrite existing property")
      obj[mod] = value
      return obj[mod]
    }
  })

  Object.defineProperty(proxy, "hasOwnProperty", {value: function(prop) {
      return this[prop] !== undefined
  }})

  return proxy
}
export default memoizeObject({
  get React() {return BdApi.findModuleByProps("createElement", "cloneElement")},
  get ReactDOM() {return BdApi.findModuleByProps("render", "findDOMNode")},
  get Flux() {return BdApi.findModuleByProps("connectStores")},
  get Events() {return BdApi.findModuleByPrototypes("setMaxListeners", "emit")},

  /* Guild Info, Stores, and Utilities */
  get GuildStore() {return BdApi.findModuleByProps("getGuild")},
  get SortedGuildStore() {return BdApi.findModuleByProps("getSortedGuilds")},
  get SelectedGuildStore() {return BdApi.findModuleByProps("getLastSelectedGuildId")},
  get GuildSync() {return BdApi.findModuleByProps("getSyncedGuilds")},
  get GuildInfo() {return BdApi.findModuleByProps("getAcronym")},
  get GuildChannelsStore() {return BdApi.findModuleByProps("getChannels", "getDefaultChannel")},
  get GuildMemberStore() {return BdApi.findModuleByProps("getMember")},
  get MemberCountStore() {return BdApi.findModuleByProps("getMemberCounts")},
  get GuildEmojiStore() {return BdApi.findModuleByProps("getEmojis")},
  get GuildActions() {return BdApi.findModuleByProps("markGuildAsRead")},
  get GuildPermissions() {return BdApi.findModuleByProps("getGuildPermissions")},

  /* Channel Store & Actions */
  get ChannelStore() {return BdApi.findModuleByProps("getChannel", "getDMFromUserId")},
  get SelectedChannelStore() {return BdApi.findModuleByProps("getLastSelectedChannelId")},
  get ChannelActions() {return BdApi.findModuleByProps("selectChannel")},
  get PrivateChannelActions() {return BdApi.findModuleByProps("openPrivateChannel")},
  get ChannelSelector() {return BdApi.findModuleByProps("selectGuild", "selectChannel")},

  /* Current User Info, State and Settings */
  get UserInfoStore() {return BdApi.findModuleByProps("getToken")},
  get UserSettingsStore() {return BdApi.findModuleByProps("guildPositions")},
  get AccountManager() {return BdApi.findModuleByProps("register", "login")},
  get UserSettingsUpdater() {return BdApi.findModuleByProps("updateRemoteSettings")},
  get OnlineWatcher() {return BdApi.findModuleByProps("isOnline")},
  get CurrentUserIdle() {return BdApi.findModuleByProps("getIdleTime")},
  get RelationshipStore() {return BdApi.findModuleByProps("isBlocked", "getFriendIDs")},
  get RelationshipManager() {return BdApi.findModuleByProps("addRelationship")},
  get MentionStore() {return BdApi.findModuleByProps("getMentions")},

  /* User Stores and Utils */
  get UserStore() {return BdApi.findModuleByProps("getCurrentUser")},
  get UserStatusStore() {return BdApi.findModuleByProps("getStatus", "getState")},
  get UserTypingStore() {return BdApi.findModuleByProps("isTyping")},
  get UserActivityStore() {return BdApi.findModuleByProps("getActivity")},
  get UserNameResolver() {return BdApi.findModuleByProps("getName")},
  get UserNoteStore() {return BdApi.findModuleByProps("getNote")},
  get UserNoteActions() {return BdApi.findModuleByProps("updateNote")},

  /* Emoji Store and Utils */
  get EmojiInfo() {return BdApi.findModuleByProps("isEmojiDisabled")},
  get EmojiUtils() {return BdApi.findModuleByProps("getGuildEmoji")},
  get EmojiStore() {return BdApi.findModuleByProps("getByCategory", "EMOJI_NAME_RE")},

  /* Invite Store and Utils */
  get InviteStore() {return BdApi.findModuleByProps("getInvites")},
  get InviteResolver() {return BdApi.findModuleByProps("findInvite")},
  get InviteActions() {return BdApi.findModuleByProps("acceptInvite")},

  /* Discord Objects & Utils */
  get DiscordConstants() {return BdApi.findModuleByProps("Permissions", "ActivityTypes", "StatusTypes")},
  get DiscordPermissions() {return BdApi.findModuleByProps("Permissions", "ActivityTypes", "StatusTypes").Permissions},
  get PermissionUtils() {return BdApi.findModuleByProps("getHighestRole")},
  get ColorConverter() {return BdApi.findModuleByProps("hex2int")},
  get ColorShader() {return BdApi.findModuleByProps("darken")},
  get TinyColor() {return BdApi.findModuleByPrototypes("toRgb")},
  get ClassResolver() {return BdApi.findModuleByProps("getClass")},
  get ButtonData() {return BdApi.findModuleByProps("ButtonSizes")},
  get IconNames() {return BdApi.findModuleByProps("IconNames")},
  get NavigationUtils() {return BdApi.findModuleByProps("transitionTo", "replaceWith", "getHistory")},

  /* Discord Messages */
  get MessageStore() {return BdApi.findModuleByProps("getMessages")},
  get MessageActions() {return BdApi.findModuleByProps("jumpToMessage", "_sendMessage")},
  get MessageQueue() {return BdApi.findModuleByProps("enqueue")},
  get MessageParser() {return BdApi.findModuleByProps("createMessage", "parse", "unparse")},

  /* Text Processing */
  get hljs() {return BdApi.findModuleByProps("highlight", "highlightBlock")},
  get SimpleMarkdown() {return BdApi.findModuleByProps("parseBlock", "parseInline", "defaultOutput")},

  /* Experiments */
  get ExperimentStore() {return BdApi.findModuleByProps("getExperimentOverrides")},
  get ExperimentsManager() {return BdApi.findModuleByProps("isDeveloper")},
  get CurrentExperiment() {return BdApi.findModuleByProps("getExperimentId")},

  /* Images, Avatars and Utils */
  get ImageResolver() {return BdApi.findModuleByProps("getUserAvatarURL", "getGuildIconURL")},
  get ImageUtils() {return BdApi.findModuleByProps("getSizedImageSrc")},
  get AvatarDefaults() {return BdApi.findModuleByProps("getUserAvatarURL", "DEFAULT_AVATARS")},

  /* Window, DOM, HTML */
  get WindowInfo() {return BdApi.findModuleByProps("isFocused", "windowSize")},
  get TagInfo() {return BdApi.findModuleByProps("VALID_TAG_NAMES")},
  get DOMInfo() {return BdApi.findModuleByProps("canUseDOM")},

  /* Locale/Location and Time */
  get LocaleManager() {return BdApi.findModuleByProps("setLocale")},
  get Moment() {return BdApi.findModuleByProps("parseZone")},
  get LocationManager() {return BdApi.findModuleByProps("createLocation")},
  get Timestamps() {return BdApi.findModuleByProps("fromTimestamp")},
  get TimeFormatter() {return BdApi.findModuleByProps("dateFormat")},

  /* Strings and Utils */
  get Strings() {return BdApi.findModuleByProps("Messages").Messages},
  get StringFormats() {return BdApi.findModuleByProps("a", "z")},
  get StringUtils() {return BdApi.findModuleByProps("toASCII")},

  /* URLs and Utils */
  get URLParser() {return BdApi.findModuleByProps("Url", "parse")},
  get ExtraURLs() {return BdApi.findModuleByProps("getArticleURL")},

  /* Drag & Drop */
  get DNDActions() {return BdApi.findModuleByProps("beginDrag")},
  get DNDSources() {return BdApi.findModuleByProps("addTarget")},
  get DNDObjects() {return BdApi.findModuleByProps("DragSource")},

  /* Media Stuff (Audio/Video) */
  get MediaDeviceInfo() {return BdApi.findModuleByProps("Codecs", "SUPPORTED_BROWSERS")},
  get MediaInfo() {return BdApi.findModuleByProps("getOutputVolume")},
  get MediaEngineInfo() {return BdApi.findModuleByProps("MediaEngineFeatures")},
  get VoiceInfo() {return BdApi.findModuleByProps("EchoCancellation")},
  get VideoStream() {return BdApi.findModuleByProps("getVideoStream")},
  get SoundModule() {return BdApi.findModuleByProps("playSound")},

  /* Electron & Other Internals with Utils*/
  get ElectronModule() {return BdApi.findModuleByProps("setBadge")},
  get Dispatcher() {return BdApi.findModuleByProps("dirtyDispatch")},
  get PathUtils() {return BdApi.findModuleByProps("hasBasename")},
  get NotificationModule() {return BdApi.findModuleByProps("showNotification")},
  get RouterModule() {return BdApi.findModuleByProps("Router")},
  get APIModule() {return BdApi.findModuleByProps("getAPIBaseURL")},
  get AnalyticEvents() {return BdApi.findModuleByProps("AnalyticEventConfigs")},
  get Buffers() {return BdApi.findModuleByProps("Buffer", "kMaxLength")},
  get DeviceStore() {return BdApi.findModuleByProps("getDevices")},
  get SoftwareInfo() {return BdApi.findModuleByProps("os")},
  get CurrentContext() {return BdApi.findModuleByProps("setTagsContext")},

  /* Commonly Used Classes */
  get GuildClasses() {
      const guildsWrapper = BdApi.findModuleByProps("wrapper", "unreadMentionsBar")
      const guilds = BdApi.findModuleByProps("guildsError", "selected")
      const pill = BdApi.findModuleByProps("blobContainer")
      return Object.assign({}, guildsWrapper, guilds, pill)
  },

  get LayerStack() {return BdApi.findModuleByProps("pushLayer")}
})