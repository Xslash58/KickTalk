import { memo, useEffect, useRef, useState, useCallback, useMemo } from "react";
import clsx from "clsx";

const EmoteTooltip = memo(({ showEmoteInfo, mousePos, emoteInfo, type, emoteSrc }) => {
  const emoteTooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const calculatePosition = useCallback(() => {
    if (!mousePos.x || !mousePos.y || !showEmoteInfo || !emoteTooltipRef.current) {
      return null;
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const tooltipRect = emoteTooltipRef.current.getBoundingClientRect();

    let top = mousePos.y + 15;
    let left = mousePos.x + 15;

    if (left + tooltipRect.width > windowWidth - 20) {
      left = mousePos.x - tooltipRect.width - 15;
    }
    if (left < 20) {
      left = windowWidth - tooltipRect.width - 20;
    }

    if (top + tooltipRect.height > windowHeight - 20) {
      top = mousePos.y - tooltipRect.height - 15;
    }
    if (top < 20) {
      top = windowHeight - tooltipRect.height - 20;
    }

    return { top, left };
  }, [mousePos, showEmoteInfo]);

  useEffect(() => {
    const newPosition = calculatePosition();
    if (newPosition) {
      setPosition(newPosition);
    }
  }, [calculatePosition]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  useEffect(() => {
    if (!showEmoteInfo) {
      setIsImageLoaded(false);
    }
  }, [showEmoteInfo]);

  if (!showEmoteInfo || !emoteInfo) return null;

  return (
    <div
      ref={emoteTooltipRef}
      style={{
        top: position.top,
        left: position.left,
        opacity: showEmoteInfo && isImageLoaded && emoteTooltipRef.current ? 1 : 0,
      }}
      className={clsx("tooltipItem", showEmoteInfo && emoteTooltipRef.current ? "emoteTooltip" : "")}>
      <img
        src={emoteSrc}
        className={type === "stv" ? "stvEmote emote " : "kickEmote emote "}
        width={112}
        height={112}
        loading="lazy"
        fetchpriority="low"
        decoding="async"
        onLoad={handleImageLoad}
      />
      {isImageLoaded && (
        <div className="emoteTooltipInfo">
          <div className="emoteTooltipInfoHeader">
            <span>{emoteInfo?.name}</span>
            <p>
              {emoteInfo?.alias && <span>Alias of {emoteInfo.alias}</span>}
              <span className="emoteTooltipPlatform">{emoteInfo?.platform === "7tv" ? "7TV" : "Kick"}</span>
            </p>
          </div>
          {type === "stv" && emoteInfo?.owner?.username && (
            <p>
              Made by <span>{emoteInfo.owner.username}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
});

export default EmoteTooltip;
