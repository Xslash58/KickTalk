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

const SevenTVBadges = ({}) => {};

export default KickBadges;
