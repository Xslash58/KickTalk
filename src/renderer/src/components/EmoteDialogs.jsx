import clsx from "clsx";
import KickLogoFull from "../assets/icons/kickLogoFull.svg";
import { memo, useState } from "react";
import useChatStore from "../providers/ChatProvider";
import { useShallow } from "zustand/react/shallow";
import STVLogo from "../assets/icons/stvLogo.svg";
import { CaretUp } from "@phosphor-icons/react";
import { useRef, useEffect } from "react";


const EmoteSection = ({ emotes, title, handleEmoteClick, type, isOpen = false }) => {
  const [sectionIsOpen, setSectionIsOpen] = useState(isOpen);
  const [visibleCount, setVisibleCount] = useState(20);
  const loadMoreTriggerRef = useRef(null);
  const loadMoreEmotes = () => {
    setVisibleCount((prev) => Math.min(prev + 20, emotes.length));
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreEmotes();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreTriggerRef.current) {
      observer.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (loadMoreTriggerRef.current) {
        observer.unobserve(loadMoreTriggerRef.current);
      }
    };
  }, [loadMoreTriggerRef, emotes.length]);

  return (
    <div className={clsx("kickDialogBodySection", sectionIsOpen && "opened")}>
      <div className="kickDialogRowHead">
        <span>{title}</span>

        <button onClick={() => setSectionIsOpen(!sectionIsOpen)} className="kickDialogRowHeadBtn">
          <CaretUp size={20} weight={"bold"} />
        </button>
      </div>
      {sectionIsOpen && (
        <div className="kickEmoteItems">
          {emotes?.slice(0, visibleCount).map((emote, index) => (
            <button
              onClick={() => handleEmoteClick(emote)}
              className="kickEmoteItem"
              key={`${emote.uniqueKey}-${index}`}
            >
              {type === "kick" ? (
                <img
                  src={`https://files.kick.com/emotes/${emote.id}/fullsize`}
                  alt={emote.name}
                  loading="lazy"
                />
              ) : (
                <img
                  src={"https://cdn.7tv.app/emote/" + emote.id + "/1x.webp"}
                  alt={emote.name}
                  loading="lazy"
                />
              )}
            </button>
          ))}
          {visibleCount < emotes.length && (
            <div ref={loadMoreTriggerRef} className="loadMoreTrigger" />
          )}
        </div>
      )}
    </div>
  );
};

const SevenTVEmoteDialog = ({ isDialogOpen, sevenTVEmotes, handleEmoteClick }) => {
  if(!sevenTVEmotes) return null;
  if(!sevenTVEmotes.emote_set) return null;
  return (
    <div className={clsx("emoteDialog", isDialogOpen && "show")}>
      <div className="kickDialogHead">
        <img src={STVLogo} height={20} alt="Kick.com" />
        {/* <div className="kickDialogHeadSearch">
          <input type="text" placeholder="Search" />
        </div> */}
      </div>
      <div className="kickDialogBody">
        <EmoteSection
          emotes={sevenTVEmotes.emote_set.emotes?.map((emoteSection, index) => ({ ...emoteSection.data, uniqueKey: `${emoteSection.data.id}-${index}` })) || []}
          title="7TV Emotes"
          type="7tv"
          isOpen={true}
          handleEmoteClick={handleEmoteClick}
        />
      </div>
    </div>
  );
};

const KickEmoteDialog = ({ isDialogOpen, kickEmotes, handleEmoteClick }) => {
  return (
    <div className={clsx("emoteDialog", isDialogOpen && "show")}>
      <div className="kickDialogHead">
        <img src={KickLogoFull} height={16} alt="Kick.com" />
        {/* <div className="kickDialogHeadSearch">
          <input type="text" placeholder="Search" />
        </div> */}
      </div>

      <div className="kickDialogBody">
        {kickEmotes?.map((emoteSection, index) => {
          return (
            <EmoteSection
              key={`${emoteSection.name || "sub_emojis"}-${index}`}
              emotes={emoteSection.emotes}
              title={emoteSection.name || "Subscriber Emojis"}
              type={"kick"}
              handleEmoteClick={handleEmoteClick}
              isOpen={index === 0}
            />
          );
        })}
      </div>
    </div>
  );
};

const EmoteDialogs = memo(
  ({ chatroomId, handleEmoteClick }) => {
    const kickEmotes = useChatStore(useShallow((state) => state.chatrooms.find((room) => room.id === chatroomId)?.emotes));
    const sevenTVEmotes = useChatStore(useShallow((state) => state.chatrooms.find((room) => room.id === chatroomId)?.channel7TVEmotes),);
    const [activeDialog, setActiveDialog] = useState(null);

    return (
      <>
        <div className="chatEmoteBtns">
          <button className="emoteBtn" onClick={() => setActiveDialog(activeDialog === "7tv" ? null : "7tv")}>
            <img src={STVLogo} height="24px" width="24px" alt="7TV Emotes" />
          </button>
          <button className="emoteBtn kickEmoteButton" onClick={() => setActiveDialog(activeDialog === "kick" ? null : "kick")}>
            <div className="kickEmoteCarousel">
              <img
                className="kickEmote emote"
                src={"https://files.kick.com/emotes/1730756/fullsize"}
                loading="lazy"
                fetchpriority="low"
                decoding="async"
              />
              <img
                className="kickEmote emote"
                src={"https://files.kick.com/emotes/1730772/fullsize"}
                loading="lazy"
                fetchpriority="low"
                decoding="async"
              />
              <img
                className="kickEmote emote"
                src={"https://files.kick.com/emotes/1730825/fullsize"}
                loading="lazy"
                fetchpriority="low"
                decoding="async"
              />
            </div>
          </button>
        </div>

        <div className="emoteDialogs">
          <SevenTVEmoteDialog isDialogOpen={activeDialog === "7tv"} sevenTVEmotes={sevenTVEmotes} handleEmoteClick={handleEmoteClick} />
          <KickEmoteDialog isDialogOpen={activeDialog === "kick"} kickEmotes={kickEmotes} handleEmoteClick={handleEmoteClick} />
        </div>
      </>
    );
  },
  (prev, next) => prev.chatroomId === next.chatroomId,
);

export default EmoteDialogs;
