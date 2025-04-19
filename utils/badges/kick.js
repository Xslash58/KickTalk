const badgeMap = {
  subscriber: (badge, fullData) => {
    const badgeData = fullData.subscriber_badges.sort((a, b) => b.months - a.months).find((b) => badge.count >= b.months);
    return badgeData
      ? {
          src: badgeData.badge_image.src,
          title: `${badge.text}-${badge.count}`,
          info: `${badge.count} months subscriber`,
        }
      : null;
  },
  moderator: { src: "https://www.kickdatabase.com/kickBadges/moderator.svg", title: "Moderator", info: "Moderator" },
  broadcaster: { src: "https://www.kickdatabase.com/kickBadges/broadcaster.svg", title: "Broadcaster", info: "Broadcaster" },
  vip: { src: "https://www.kickdatabase.com/kickBadges/vip.svg", title: "VIP", info: "VIP" },
  og: { src: "https://www.kickdatabase.com/kickBadges/og.svg", title: "OG", info: "OG" },
  founder: { src: "https://www.kickdatabase.com/kickBadges/founder.svg", title: "Founder", info: "Founder" },
  sub_gifter: { src: "https://www.kickdatabase.com/kickBadges/subGifter.svg", title: "Sub Gifter", info: "Sub gifter" },
  subgifter25: { src: "https://www.kickdatabase.com/kickBadges/subGifter25.svg", title: "Sub Gifter", info: "Sub gifter" },
  subgifter50: { src: "https://www.kickdatabase.com/kickBadges/subGifter50.svg", title: "Sub Gifter", info: "Sub gifter" },
  subgifter100: { src: "https://www.kickdatabase.com/kickBadges/subGifter100.svg", title: "Sub Gifter", info: "Sub gifter" },
  subgifter200: { src: "https://www.kickdatabase.com/kickBadges/subGifter200.svg", title: "Sub Gifter", info: "Sub gifter" },
  staff: { src: "https://www.kickdatabase.com/kickBadges/staff.svg", title: "Staff", info: "Staff" },
  trainwreckstv: {
    src: "https://www.kickdatabase.com/kickBadges/trainwreckstv.svg",
    title: "Trainwreckstv",
    info: "Trainwreckstv",
  },
  verified: { src: "https://www.kickdatabase.com/kickBadges/verified.svg", title: "Verified", info: "Verified" },
  sidekick: { src: "https://www.kickdatabase.com/kickBadges/sidekick.svg", title: "Sidekick", info: "Sidekick" },
};

const processKickBadges = (badges, msgDiv, fullData) => {
  if (badges && badges.length > 0) {
    const badgesDiv = document.createElement("div");
    badgesDiv.className = "badges";
    badges.forEach((badge) => {
      const badgeInfo = typeof badgeMap[badge.type] === "function" ? badgeMap[badge.type](badge, fullData) : badgeMap[badge.type];
      if (badgeInfo) {
        badgesDiv.innerHTML += `<img class="badge" src="${badgeInfo.src}" title="${badgeInfo.title}" onmouseover="showEmoteInfo('${badgeInfo.info}', 'Kick', '')" onmouseout="hideEmoteInfo()">`;
      } else {
        console.log("Unknown badge type or no matching badge data found:", badge.type);
      }
    });
    msgDiv.innerHTML += badgesDiv.outerHTML;
  }
};

export default processKickBadges;
