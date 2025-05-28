import clsx from "clsx";
import { useEffect, useRef, useState, useMemo } from "react";

const BadgeTooltip = ({ showBadgeInfo, mousePos, badgeInfo }) => {
  const badgeTooltipRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const tooltipDimensions = useMemo(
    () => ({
      height: 165,
      width: 400,
      offset: 15,
      fallbackOffset: 180,
    }),
    [],
  );

  useEffect(() => {
    if (!mousePos.x || !mousePos.y || !showBadgeInfo) {
      return;
    }

    const calculatePosition = () => {
      const { height, width, offset, fallbackOffset } = tooltipDimensions;

      let top = mousePos.y + offset;
      let left = mousePos.x + offset;

      // make sure tooltip doesnt go right of available space
      if (left + width > window.innerWidth) {
        left = mousePos.x - fallbackOffset;
      }

      // make sure tooltip doesnt go below available space
      if (top + height > window.innerHeight) {
        top = mousePos.y - height - offset;
      }

      // make sure tooltip doesnt go above available space
      if (top < 0) {
        top = offset;
      }

      // make sure tooltip doesnt go left of available space
      if (left < 0) {
        left = offset;
      }

      setPosition({ top, left });
    };

    calculatePosition();
  }, [mousePos, showBadgeInfo, tooltipDimensions]);

  if (!showBadgeInfo) return null;

  return (
    <div
      ref={badgeTooltipRef}
      style={{ top: position.top, left: position.left, opacity: showBadgeInfo ? 1 : 0, height: `${tooltipDimensions.height}px` }}
      className={clsx("tooltipItem", "showTooltip")}>
      <img src={badgeInfo?.src} alt={badgeInfo?.title} />
      <div className="tooltipItemInfo">
        <span>{badgeInfo?.title}</span>
        <span className="badgeTooltipPlatform">{badgeInfo?.platform}</span>
      </div>
      {badgeInfo?.owner?.username && (
        <span className="tooltipItemCreatedBy">
          Created by <span className="tooltipItemCreatedByUsername">{badgeInfo.owner.username}</span>
        </span>
      )}
    </div>
  );
};

export default BadgeTooltip;
