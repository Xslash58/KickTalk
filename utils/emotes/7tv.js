const handle7TVEmotes = (message, SevenTVData = null) => {
  if (!SevenTVData) return message;
  const emotes = SevenTVData.emote_set.emotes;
  const usedEmotes = new Set();

  emotes.forEach((emoteData) => {
    const emoteName = emoteData.name;
    if (usedEmotes.has(emoteName)) return;
    usedEmotes.add(emoteName);
    const emoteRegex = new RegExp(`\\b${emoteName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b(?![^<]*>)`, "gi");
    message = message.replace(
      emoteRegex,
      `<img class="emote" style="width: ${emoteData.data.host.files[0].width}; height:  ${emoteData.data.host.files[0].height};" src="https://cdn.7tv.app/emote/${emoteData.id}/4x.webp" title="${emoteName}" onmouseover="showEmoteInfo('${emoteName}', '7TV', 'https://cdn.7tv.app/emote/${emoteData.id}/4x.webp')" onmouseout="hideEmoteInfo()">`,
    );
  });
  return message;
};

export default handle7TVEmotes;
