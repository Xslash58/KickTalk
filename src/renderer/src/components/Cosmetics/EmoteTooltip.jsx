import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const EmoteTooltip = ({ showEmoteInfo, mousePos, emoteInfo, type }) => {
  const emoteTooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!mousePos.x || !mousePos.y || !showEmoteInfo) {
      return;
    }

    const calculatePosition = () => {
      if (!emoteTooltipRef.current) return;

      const tooltipHeight = 300;
      const tooltipWidth = 400;

      let top = mousePos.y + 15;
      let left = mousePos.x + 15;

      if (left - tooltipWidth > 80) {
        left = mousePos.x - 180;
      }

      if (top - tooltipHeight > 70) {
        top = mousePos.y - 140;
      }

      setPosition({ top, left });
    };

    calculatePosition();
  }, [mousePos]);

  if (!showEmoteInfo) return null;

  return (
    <div
      ref={emoteTooltipRef}
      style={{
        top: showEmoteInfo && position.top,
        left: showEmoteInfo && position.left,
        opacity: showEmoteInfo ? 1 : 0,
      }}
      className={clsx("tooltipItem showTooltip", showEmoteInfo ? "showTooltip" : "")}>
      <img
        src={
          type === "stv"
            ? `https://cdn.7tv.app/emote/${emoteInfo?.id}/1x.webp`
            : `https://files.kick.com/emotes/${emoteInfo?.id}/fullsize`
        }
        className={type === "stv" ? "stvEmote emote" : "kickEmote emote"}
        width={emoteInfo?.width}
        height={emoteInfo?.height}
        loading="lazy"
        fetchpriority="low"
        decoding="async"
      />
      <div className="emoteTooltipInfo">
        <div className="emoteTooltipInfoHeader">
          <span>{emoteInfo?.name}</span>
          <p>{emoteInfo?.alias ? `Alias of ${emoteInfo?.alias}` : ""}</p>
        </div>
        {type === "stv" && (
          <p>
            Made by <span>{emoteInfo?.owner?.username}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default EmoteTooltip;
