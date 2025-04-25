import { useEffect, useState } from "react";
import { kickBadgeMap } from "../../../../../utils/constants";
import EmoteTooltip from "./EmoteTooltip";

const KickBadges = ({ type, badges, subscriberBadges = null }) => {
  if (badges && badges.length) {
    return badges.map((badge) => {
      const [showBadgeInfo, setShowBadgeInfo] = useState(false);
      const [mousePos, setMousePos] = useState({ x: null, y: null });

      const badgeInfo =
        badge.type === "subscriber" ? kickBadgeMap[badge.type](badge, subscriberBadges) : kickBadgeMap[badge.type];

      if (!badgeInfo) return console.log("Unknown badge type or no matching badge data found:", badge.type);

      useEffect(() => {
        const updateMousePosition = (e) => {
          setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", updateMousePosition);

        return () => {
          window.removeEventListener("mousemove", updateMousePosition);
        };
      }, []);

      return (
        <div className="chatroomBadge" key={badge.type}>
          <EmoteTooltip showBadgeInfo={showBadgeInfo} mousePos={mousePos} badgeInfo={badgeInfo} />
          <img
            key={badge.type}
            onMouseEnter={() => setShowBadgeInfo(true)}
            onMouseLeave={() => setShowBadgeInfo(false)}
            className="chatroomBadgeIcon"
            src={badgeInfo.type === "subscriber" ? "https://www.kickdatabase.com/kickBadges/subscriber.svg" : badgeInfo.src}
          />
        </div>
      );
    });
  }
};


const KickTalkBetaTesters = ({ message, kickTalkBetaTesters }) => {
  console.log(kickTalkBetaTesters);
  return Object.keys(kickTalkBetaTesters.data).map((username) => {
    if (message.sender.username.toLowerCase() === username.toLowerCase()) {
      const [showBadgeInfo, setShowBadgeInfo] = useState(false);
      const [mousePos, setMousePos] = useState({ x: null, y: null });

      const badgeInfo = {
        title: "KickTalk Beta Tester", 
        type: "BetaTester",
        src: `https://kick-talk-badges-ftkbot.replit.app/badge/BetaTester`,
        username: username,
      };

      const tooltipBadgeInfo = "KickTalk Beta Tester Badge: This user is a beta tester for the Kick Talk Bot. They have access to exclusive features and updates before they are released to the public.";

      console.log(username);
      console.log(message.sender.username);
      console.log(badgeInfo);

      useEffect(() => {
        const updateMousePosition = (e) => {
          setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", updateMousePosition);

        return () => {
          window.removeEventListener("mousemove", updateMousePosition);
        };
      }, []);


      return (
        <div className="chatroomBadge" key={username}>
          <EmoteTooltip showBadgeInfo={showBadgeInfo} mousePos={mousePos} badgeInfo={badgeInfo} />
          <img
            onMouseEnter={() => setShowBadgeInfo(true)}
            onMouseLeave={() => setShowBadgeInfo(false)}
            className="chatroomBadgeIcon"
            src={badgeInfo.src}
            alt={`${badgeInfo.type} badge`}
          />
        </div>
      );
    }
    return null;
  });
};

export { KickBadges, KickTalkBetaTesters };
