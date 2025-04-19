import axios from "axios";

const fetch7TVData = async (id) => {
  console.log("Fetching 7TV Data with id:", id);

  try {
    const response = await axios.get(`https://7tv.io/v3/users/kick/${id}`);

    if (response.status !== 200) {
      throw new Error(`[7TV Emotes] Error while fetching channel. Status: ${response.status}`);
    }

    const emoteChannelData = response.data;

    const globalResponse = await axios.get(`https://7tv.io/v3/emote-sets/global`);

    if (globalResponse.status !== 200) {
      throw new Error(`[7TV Emotes] Error while fetching Global Emotes. Status: ${globalResponse.status}`);
    }

    const emoteGlobalData = globalResponse.data;
    const channelEmoteIds = new Set(emoteChannelData.emote_set.emotes.map((emote) => emote.id));
    const filteredGlobalEmotes = emoteGlobalData.emotes.filter((emote) => !channelEmoteIds.has(emote.id));
    emoteChannelData.emote_set.emotes.push(...filteredGlobalEmotes);

    return emoteChannelData;
  } catch (error) {
    console.error("[7TV Emotes] Error while fetching emotes:", error);
  }
};

export default fetch7TVData;
