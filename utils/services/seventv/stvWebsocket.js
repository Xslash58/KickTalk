class StvWebSocket extends EventTarget {
  constructor(chatroomNumber, channelTwitchID) {
    super();
    this.reconnectDelay = 5000;
    this.chat = null;
    this.chatroomNumber = chatroomNumber;
    this.channelTwitchID = channelTwitchID;
    this.shouldReconnect = true;
  }

  connect() {
    console.log(`[7TV]: Connecting to WebSocket`);

    this.chat = new WebSocket("wss://events.7tv.io/v3");

    this.chat.onopen = async () => {
      let waitStartTime = Date.now();
      console.log(`[7TV]: Connection opened`);

      while (Date.now() - waitStartTime < 10000) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const subscribeEntitlementCreateMessage = {
        op: 35,
        t: Date.now(),
        d: {
          type: "entitlement.create",
          condition: { platform: "TWITCH", ctx: "channel", id: this.channelTwitchID },
        },
      };

      if (this.channelTwitchID !== "0") {
        await this.chat.send(JSON.stringify(subscribeEntitlementCreateMessage));

        console.log(`[7TV]: Subscribed to entitlement.create`);
      }

      waitStartTime = Date.now();

      while ((this.stvId === "0" || this.stvEmoteSetId === "0") && Date.now() - waitStartTime < 10000) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log(`[7TV]: Subscribed to emote.set`);

      const subscribeEmoteMessage = {
        op: 35,
        t: Date.now(),
        d: {
          type: "user.*",
          condition: { id: this.stvId },
        },
      };

      if (this.stvId !== "0") {
        await this.chat.send(JSON.stringify(subscribeEmoteSetMessage));

        console.log(`[7TV]: Subscribed to user.*`);
      }

      const subscribeEmoteSetMessage = {
        op: 35,
        t: Date.now(),
        d: {
          type: "emote_set.update",
          condition: { id: this.stvEmoteSetId },
        },
      };

      if (this.stvEmoteSetId !== "0") {
        await this.chat.send(JSON.stringify(subscribeEmoteSetMessage));

        console.log(`[7TV]: Subscribed to emote_set.update`);
      }

      console.log(`[7TV]: Subscribed to all events`);

      this.chat.onmessage = (event) => {
        console.log(`[7TV]: Message received: ${event.data}`);

        try {
          const msg = JSON.parse(event.data);

          if (msg && msg.d && msg.d.body) {
            const body = msg.d.body;
            let canProceed = false;

            if (msg.d.type === "cosmetic.create" || !msg.d.body["actor"]) {
              updateCosmetics(body);
              return;
            }

            let tableData = {
              name: "none",
              url: "4x.avif",
              flags: 0,
              site: "",
              action: "other",
            };

            if (body["pushed"]) {
              if (!body.pushed[0]) {
                return;
              }

              const owner = body.pushed[0].value.data?.owner;

              const creator = owner && Object.keys(owner).length ? owner.display_name || owner.username || "UNKNOWN" : "NONE";

              tableData = {
                name: body.pushed[0].value.name,
                url: `https://cdn.7tv.app/emote/${body.pushed[0]["value"].id}/4x.avif`,
                flags: body.pushed[0].value.data?.flags,
                original_name: body.pushed[0].value.data?.name,
                creator,
                site: "7TV",
                user: body.actor["display_name"] || "UNKNOWN",
                action: "add",
              };

              canProceed = true;
            } else if (body["pulled"]) {
              if (!body.pulled[0]) {
                return;
              }
              tableData = {
                name: body.pulled[0]["old_value"].name,
                url: `https://cdn.7tv.app/emote/${body.pulled[0]["old_value"].id}/4x.avif`,
                user: body.actor["display_name"] || "UNKNOWN",
                action: "remove",
              };

              canProceed = true;
            } else if (body["updated"]) {
              if (!body.updated[0]) {
                return;
              }

              if (body["updated"][0]["key"] === "connections") {
                tableData = "emote_set.change";

                tableData = {
                  newSetName: body.updated[0]["value"][0]["value"].name,
                  newSetId: body.updated[0]["value"][0]["value"].id,
                  oldSetName: body.updated[0]["value"][0]["old_value"].name,
                  oldSetId: body.updated[0]["value"][0]["old_value"].id,
                  user: body.actor["display_name"] || "UNKNOWN",
                  site: "7TV",
                  action: "emote_set.change",
                };

                canProceed = true;
              } else {
                if (!body.updated[0]["value"] || !body.updated[0]["old_value"]) {
                  return;
                }

                tableData = {
                  newName: body.updated[0]["value"].name,
                  oldName: body.updated[0]["old_value"].name,
                  user: body.actor["display_name"] || "UNKNOWN",
                  site: "7TV",
                  action: "update",
                };

                canProceed = true;
              }
            }

            if (canProceed) {
              update7TVEmoteSet(tableData);
            }
          }
        } catch (error) {
          console.log("Error parsing message:", error);
        }
      };

      // this.chat.onerror = (event) => {
      //   console.log(`[7TV]: Error: ${event.message}`);
      // };
    };
    // close() {
    //   console.log(`Closing connection for chatroom ${this.chatroomNumber}`);
    //   this.shouldReconnect = false;

    //   if (this.chat && this.chat.readyState === WebSocket.OPEN) {
    //     try {
    //       this.chat.send(
    //         JSON.stringify({
    //           event: "pusher:unsubscribe",
    //           data: {
    //             channel: `chatrooms.${this.chatroomNumber}.v2`,
    //           },
    //         }),
    //       );

    //       console.log(`Unsubscribed from channel: chatrooms.${this.chatroomNumber}.v2`);

    //       this.chat.close();
    //       this.chat = null;

    //       console.log("WebSocket connection closed");
    //     } catch (error) {
    //       console.error("Error during closing of connection:", error);
    //     }
    //   }
    // }
  }
}

async function update7TVEmoteSet(table) {
  if (table.url === "4x.avif") {
    return;
  }

  if (table.action === "add") {
    delete table.action;
    SevenTVEmoteData.push(table);

    console.log(FgBlue + "SevenTV " + FgWhite + `${table.user} added ${table.name}`);
  } else if (table.action === "remove") {
    let foundEmote = SevenTVEmoteData.find((emote) => emote.original_name === table.name);

    console.log(FgBlue + "SevenTV " + FgWhite + `${table.user} removed ${foundEmote.name}`);

    SevenTVEmoteData = SevenTVEmoteData.filter((emote) => emote.url !== table.url);
  } else if (table.action === "update") {
    if (!table.newName || !table.newName) {
      return;
    }

    let foundEmote = SevenTVEmoteData.find((emote) => emote.name === table.oldName);
    foundEmote.name = table.newName;
    //SevenTVEmoteData.push(table);

    console.log(FgBlue + "SevenTV " + FgWhite + `${table.user} renamed ${table.oldName} to ${table.newName}`);

    //SevenTVEmoteData = SevenTVEmoteData.filter(emote => emote.name !== table.oldName);
  } else if (table.action === "emote_set.change") {
    const unsubscribeEmoteSetMessage = {
      op: 36,
      t: Date.now(),
      d: {
        type: `emote_set.update`,
        condition: {
          object_id: SevenTVemoteSetId,
        },
      },
    };

    await SevenTVWebsocket.send(JSON.stringify(unsubscribeEmoteSetMessage));

    console.log(FgBlue + "SevenTV " + FgWhite + "UnSubscribed to emote_set.update");

    SevenTVemoteSetId = table.newSetId;

    SevenTVEmoteData = await fetch7TVEmoteData(SevenTVemoteSetId);

    console.log(FgBlue + "SevenTV " + FgWhite + `Emote set changed to ${table["newSetName"]}`);

    const subscribeEmoteSetMessage = {
      op: 35,
      t: Date.now(),
      d: {
        type: `emote_set.update`,
        condition: {
          object_id: SevenTVemoteSetId,
        },
      },
    };

    await SevenTVWebsocket.send(JSON.stringify(subscribeEmoteSetMessage));

    console.log(FgBlue + "SevenTV " + FgWhite + "Subscribed to emote_set.update");

    //WEBSOCKET
    //await SevenTVWebsocket.close();
  }

  await updateAllEmoteData();
}

function argbToRgba(color) {
  if (color < 0) {
    color = color >>> 0;
  }

  const red = (color >> 24) & 0xff;
  const green = (color >> 16) & 0xff;
  const blue = (color >> 8) & 0xff;
  return `rgba(${red}, ${green}, ${blue}, 1)`;
}

export default StvWebSocket;
