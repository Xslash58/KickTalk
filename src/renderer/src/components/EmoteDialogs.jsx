import clsx from "clsx";
import KickLogoFull from "../assets/logos/kickLogoFull.svg?asset";
import { memo, useState } from "react";
import useChatStore from "../providers/ChatProvider";
import { useShallow } from "zustand/react/shallow";
import STVLogo from "../assets/logos/stvLogo.svg?asset";
import CaretDown from "../assets/icons/caret-down-bold.svg?asset";
import { useRef, useEffect } from "react";
import useClickOutside from "../utils/useClickOutside";

const EmoteSection = ({ emotes, title, handleEmoteClick, type }) => {
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);
  const loadMoreTriggerRef = useRef(null);
  const observerRef = useRef(null);

  const loadMoreEmotes = () => {
    setVisibleCount((prev) => Math.min(prev + 20, emotes.length));
  };

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreEmotes();
        }
      },
      { threshold: 0.5, rootMargin: "100px" },
    );

    if (loadMoreTriggerRef.current) {
      observerRef.current.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (loadMoreTriggerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [loadMoreEmotes]);

  return (
    <div className={clsx("dialogBodySection", isSectionOpen && "opened")}>
      <div className="dialogRowHead">
        <span>{title}</span>
        <button onClick={() => setIsSectionOpen(!isSectionOpen)} className="dialogRowHeadBtn">
          <img src={CaretDown} width={20} height={20} alt="Caret Down" />
        </button>
      </div>
      <div className="emoteItems">
        {emotes?.slice(0, visibleCount).map((emote, index) => (
          <button onClick={() => handleEmoteClick(emote)} className="emoteItem" key={`${emote.id}-${index}`}>
            {type === "kick" ? (
              <img src={`https://files.kick.com/emotes/${emote.id}/fullsize`} alt={emote.name} loading="lazy" decoding="async" />
            ) : (
              <img src={"https://cdn.7tv.app/emote/" + emote.id + "/1x.webp"} alt={emote.name} loading="lazy" decoding="async" />
            )}
          </button>
        ))}
        {visibleCount < emotes.length && <div ref={loadMoreTriggerRef} className="loadMoreTrigger" />}
      </div>
    </div>
  );
};

const SevenTVEmoteDialog = ({ isDialogOpen, sevenTVEmotes, handleEmoteClick }) => {
  const emotes = sevenTVEmotes?.emote_set?.emotes;

  return (
    <>
      {isDialogOpen && (
        <div className={clsx("emoteDialog", isDialogOpen && "show")}>
          <div className={clsx("dialogHead", !emotes?.length && "dialogHeadEmpty")}>
            <img src={STVLogo} height={20} alt="7TV Emotes" />
            {/* <div className="dialogHeadSearch">
              <input type="text" placeholder="Search" />
        </div> */}
          </div>
          <div className="dialogBody">
            {emotes?.length ? (
              <EmoteSection emotes={emotes} title="7TV Emotes" type="7tv" handleEmoteClick={handleEmoteClick} />
            ) : (
              <div className="dialogBodyEmpty">
                <p>No 7TV Emotes</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const KickEmoteDialog = ({ isDialogOpen, kickEmotes, handleEmoteClick }) => {
  return (
    <div className={clsx("emoteDialog", isDialogOpen && "show")}>
      <div className="dialogHead">
        <img src={KickLogoFull} height={16} alt="Kick.com" />
        {/* <div className="kickDialogHeadSearch">
          <input type="text" placeholder="Search" />
        </div> */}
      </div>

      <div className="dialogBody">
        {kickEmotes?.map((emoteSection, index) => (
          <EmoteSection
            key={`${emoteSection.name || "sub_emojis"}-${index}`}
            emotes={emoteSection.emotes}
            title={emoteSection.name || "Subscriber Emojis"}
            type={"kick"}
            handleEmoteClick={handleEmoteClick}
          />
        ))}
      </div>
    </div>
  );
};

const EmoteDialogs = memo(
  ({ chatroomId, handleEmoteClick }) => {
    const kickEmotes = useChatStore(useShallow((state) => state.chatrooms.find((room) => room.id === chatroomId)?.emotes));
    const sevenTVEmotes = useChatStore(
      useShallow((state) => state.chatrooms.find((room) => room.id === chatroomId)?.channel7TVEmotes),
    );

    const [activeDialog, setActiveDialog] = useState(null);

    const emoteDialogRef = useRef(null);
    useClickOutside(emoteDialogRef, () => setActiveDialog(null));

    return (
      <>
        <div className="chatEmoteBtns">
          <button className="emoteBtn" onClick={() => setActiveDialog(activeDialog === "7tv" ? null : "7tv")}>
            <img src={STVLogo} height="24px" width="24px" alt="7TV Emotes" />
          </button>
          <button className="emoteBtn kickEmoteButton" onClick={() => setActiveDialog(activeDialog === "kick" ? null : "kick")}>
            <img
              className="kickEmote emote"
              src={"https://files.kick.com/emotes/1730825/fullsize"}
              loading="lazy"
              fetchpriority="low"
              decoding="async"
            />
          </button>
        </div>

        <div className="emoteDialogs" ref={emoteDialogRef}>
          <SevenTVEmoteDialog
            isDialogOpen={activeDialog === "7tv"}
            sevenTVEmotes={sevenTVEmotes}
            handleEmoteClick={handleEmoteClick}
          />
          <KickEmoteDialog isDialogOpen={activeDialog === "kick"} kickEmotes={kickEmotes} handleEmoteClick={handleEmoteClick} />
        </div>
      </>
    );
  },
  (prev, next) => prev.chatroomId === next.chatroomId,
);

export default EmoteDialogs;
