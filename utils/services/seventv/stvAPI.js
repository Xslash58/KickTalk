import axios from "axios";

const getChannelEmotes = async (channelId) => {
  console.log("[7TV Emotes] Fetching channel emotes for", channelId);

  try {
    const response = await axios.get(`https://7tv.io/v3/users/kick/${channelId}`);

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
    emoteChannelData.emote_set.emotes = emoteChannelData.emote_set.emotes.map((emote) => {
      return {
        id: emote.id,
        actor_id: emote.actor_id,
        name: emote.name,
        alias: emote.data.name !== emote.name ? emote.data.name : null,
        owner: emote.data.owner,
        file: emote.data.host.files?.[0] || emote.data.host.files?.[1],
      };
    });

    return emoteChannelData;
  } catch (error) {
    console.error(`[7TV Emotes] Error while fetching channel. Status: ${error}`);
  }
};

// const getGlobalEmotes = async () => {
//   const response = await axios.get(`https://7tv.io/v3/emote-sets/global`);

//   if (response.status !== 200) {
//     console.error(`[7TV Emotes] Error while fetching Global Emotes. Status: ${response.status}`);
//     return [];
//   }

//   return response.data;
// };

// const getUserCosmetics = async (id) => {};

export { getChannelEmotes };
