import { useRef, useEffect, useMemo } from "react";
import clsx from "clsx";
import KickLogoFull from "../../../assets/logos/kickLogoFull.svg?asset";
import { memo, useCallback, useState } from "react";
import STVLogo from "../../../assets/logos/stvLogo.svg?asset";
import CaretDown from "../../../assets/icons/caret-down-bold.svg?asset";
import useClickOutside from "../../../utils/useClickOutside";
import KickLogoIcon from "../../../assets/logos/kickLogoIcon.svg?asset";
import GlobeIcon from "../../../assets/icons/globe-fill.svg?asset";
import LockIcon from "../../../assets/icons/lock-simple-fill.svg?asset";
import UserIcon from "../../../assets/icons/user-fill.svg?asset";
import useChatStore from "../../../providers/ChatProvider";
import { useShallow } from "zustand/react/shallow";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../Shared/Tooltip";

const EmoteSection = ({ emotes, title, handleEmoteClick, type, section, userChatroomInfo }) => {
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
      { threshold: 0.5, rootMargin: "20px" },
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
        {emotes?.slice(0, visibleCount).map((emote, i) => (
          <Tooltip key={`${emote.id}-${emote.name}-${i}`} delayDuration={500}>
            <TooltipTrigger asChild>
              <button
                disabled={type === "kick" && emote?.subscribers_only && !userChatroomInfo?.subscription}
                onClick={() => handleEmoteClick(emote)}
                className={clsx(
                  "emoteItem",
                  emote?.subscribers_only && !userChatroomInfo?.subscription && "emoteItemSubscriberOnly",
                )}>
                {type === "kick" ? (
                  <img
                    src={`https://files.kick.com/emotes/${emote.id}/fullsize`}
                    alt={emote.name}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <img
                    src={"https://cdn.7tv.app/emote/" + emote.id + "/1x.webp"}
                    alt={emote.name}
                    loading="lazy"
                    decoding="async"
                  />
                )}

                {emote?.subscribers_only && !userChatroomInfo?.subscription && (
                  <div className="emoteItemSubscriberLock">
                    <img src={LockIcon} alt="Subscriber" width={16} height={16} />
                  </div>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{emote.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {visibleCount < emotes.length && <div ref={loadMoreTriggerRef} className="loadMoreTrigger" />}
      </div>
    </div>
  );
};

const SevenTVEmoteDialog = memo(
  ({ isDialogOpen, sevenTVEmotes, handleEmoteClick }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentSection, setCurrentSection] = useState(null);

    const searchResults = useMemo(() => {
      if (!sevenTVEmotes) return [];

      return sevenTVEmotes
        .map((emoteSection) => ({
          ...emoteSection,
          emotes: (emoteSection.emotes || []).filter((emote) => emote.name.toLowerCase().includes(searchTerm.toLowerCase())),
        }))
        .filter((section) => section.emotes && section.emotes.length > 0);
    }, [sevenTVEmotes, searchTerm]);

    return (
      <>
        {isDialogOpen && (
          <div className={clsx("emoteDialog", isDialogOpen && "show")}>
            <div className={clsx("dialogHead", !searchResults?.length && "dialogHeadEmpty")}>
              <div className="dialogHeadTitle">
                <img src={STVLogo} height={20} alt="7TV Emotes" />
              </div>
              <div className="dialogHeadSearch">
                <input
                  type="text"
                  placeholder="Search emotes..."
                  onChange={(e) => setSearchTerm(e.target.value.trim())}
                  value={searchTerm}
                />
              </div>
              <div className="dialogHeadMenuItems">
                {sevenTVEmotes?.find((set) => set.type === "personal" && set?.emotes?.length > 0) && (
                  <button
                    className={clsx("dialogHeadMenuItem", currentSection === "personal" && "active")}
                    onClick={() => setCurrentSection(currentSection === "personal" ? null : "personal")}>
                    <img src={UserIcon} height={24} width={24} alt="Personal Emotes" />
                  </button>
                )}
                {sevenTVEmotes?.find((set) => set.type === "channel" && set?.emotes?.length > 0) && (
                  <button
                    className={clsx("dialogHeadMenuItem", currentSection === "channel" && "active")}
                    onClick={() => setCurrentSection(currentSection === "channel" ? null : "channel")}>
                    <img
                      src={`${sevenTVEmotes?.find((set) => set.type === "channel")?.user?.avatar_url.includes("static-cdn.jtvnw.net") ? sevenTVEmotes?.find((set) => set.type === "channel")?.user?.avatar_url : `https:${sevenTVEmotes?.find((set) => set.type === "channel")?.user?.avatar_url}`}`}
                      height={24}
                      width={24}
                      alt="Channel Emotes"
                    />
                  </button>
                )}
                {sevenTVEmotes?.find((set) => set.type === "global" && set?.emotes?.length > 0) && (
                  <button
                    className={clsx("dialogHeadMenuItem", currentSection === "global" && "active")}
                    onClick={() => setCurrentSection(currentSection === "global" ? null : "global")}>
                    <img src={GlobeIcon} height={24} width={24} alt="Global Emotes" />
                  </button>
                )}
              </div>
            </div>
            <div className="dialogBody">
              {!searchResults.length && searchTerm ? (
                <div className="dialogBodyEmpty">
                  <p>No 7TV Emotes found</p>
                </div>
              ) : (
                <>
                  {searchResults
                    ?.filter((emoteSection) => (currentSection ? emoteSection.type === currentSection : true))
                    ?.map((emoteSection, index) => {
                      return (
                        <EmoteSection
                          key={`${emoteSection?.setInfo?.name || "7tv_emotes"}-${index}`}
                          emotes={emoteSection.emotes}
                          title={`${emoteSection?.setInfo?.name || "7TV Emotes"} ${searchTerm ? `[${emoteSection.emotes.length} matches]` : ""}`}
                          type={"7tv"}
                          handleEmoteClick={handleEmoteClick}
                        />
                      );
                    })}
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  },
  (prev, next) => prev.sevenTVEmotes === next.sevenTVEmotes && prev.isDialogOpen === next.isDialogOpen,
);

const KickEmoteDialog = memo(
  ({ isDialogOpen, kickEmotes, handleEmoteClick, userChatroomInfo }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentSection, setCurrentSection] = useState(null);

    const searchResults = useMemo(() => {
      if (!kickEmotes) return [];

      return kickEmotes
        .map((emoteSection) => ({
          ...emoteSection,
          emotes: emoteSection.emotes.filter((emote) => emote.name.toLowerCase().includes(searchTerm.toLowerCase())),
        }))
        .filter((section) => section.emotes.length > 0);
    }, [kickEmotes, searchTerm]);

    const isChannelSet = kickEmotes?.find((emoteSection) => emoteSection?.name === "channel_set");

    return (
      <>
        {isDialogOpen && (
          <div className={clsx("emoteDialog", isDialogOpen && "show")}>
            <div className="dialogHead">
              <div className="dialogHeadTitle">
                <img src={KickLogoFull} height={16} alt="Kick.com" />
              </div>
              <div className="dialogHeadSearch">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value.trim())}
                  value={searchTerm}
                />
              </div>
              <div className="dialogHeadMenuItems">
                {isChannelSet && isChannelSet?.emotes?.length > 0 && (
                  <button
                    className={clsx("dialogHeadMenuItem", currentSection === "channel_set" && "active")}
                    onClick={() => setCurrentSection(currentSection === "channel_set" ? null : "channel_set")}>
                    <img src={isChannelSet?.user?.profile_pic} height={24} width={24} alt="Channel Emotes" />
                  </button>
                )}
                {kickEmotes?.find((set) => set.name === "Global" && set?.emotes?.length > 0) && (
                  <button
                    className={clsx("dialogHeadMenuItem", currentSection === "Global" && "active")}
                    onClick={() => setCurrentSection(currentSection === "Global" ? null : "Global")}>
                    <img src={GlobeIcon} height={24} width={24} alt="Global Emotes" />
                  </button>
                )}
                {kickEmotes?.find((set) => set.name === "Emojis" && set?.emotes?.length > 0) && (
                  <button
                    className={clsx("dialogHeadMenuItem", currentSection === "Emojis" && "active")}
                    onClick={() => setCurrentSection(currentSection === "Emojis" ? null : "Emojis")}>
                    <img src={KickLogoIcon} height={16} width={16} alt="Emojis" />
                  </button>
                )}
              </div>
            </div>

            <div className="dialogBody">
              {!searchResults.length && searchTerm ? (
                <div className="dialogBodyEmpty">
                  <p>No Kick Emotes found</p>
                </div>
              ) : (
                searchResults
                  ?.filter((emoteSection) => (currentSection ? emoteSection.name === currentSection : true))
                  ?.map((emoteSection, index) => (
                    <EmoteSection
                      key={`${emoteSection.name || "sub_emojis"}-${index}`}
                      emotes={emoteSection.emotes}
                      section={currentSection}
                      title={`${emoteSection.name === "channel_set" ? "Subscriber Emotes" : emoteSection.name} ${
                        searchTerm ? `[${emoteSection.emotes.length} matches]` : ""
                      }`}
                      type={"kick"}
                      handleEmoteClick={handleEmoteClick}
                      userChatroomInfo={userChatroomInfo}
                    />
                  ))
              )}
            </div>
          </div>
        )}
      </>
    );
  },
  (prev, next) =>
    prev.kickEmotes === next.kickEmotes &&
    prev.isDialogOpen === next.isDialogOpen &&
    prev.userChatroomInfo === next.userChatroomInfo,
);

const EmoteDialogs = memo(
  ({ chatroomId, handleEmoteClick, userChatroomInfo }) => {
    const kickEmotes = useChatStore(useShallow((state) => state.chatrooms.find((room) => room.id === chatroomId)?.emotes));
    const sevenTVEmotes = useChatStore(
      useShallow((state) => state.chatrooms.find((room) => room.id === chatroomId)?.channel7TVEmotes),
    );
    const personalEmoteSets = useChatStore(useShallow((state) => state.personalEmoteSets));

    const allStvEmotes = useMemo(() => {
      return [...(personalEmoteSets || []), ...(sevenTVEmotes || [])];
    }, [personalEmoteSets, sevenTVEmotes]);

    const [activeDialog, setActiveDialog] = useState(null);
    const [currentHoverEmote, setCurrentHoverEmote] = useState({});

    const emoteDialogRef = useRef(null);
    useClickOutside(emoteDialogRef, () => setActiveDialog(null));

    const [randomEmotes, setRandomEmotes] = useState([]);

    // Initialize random emotes array once when kickEmotes changes
    useEffect(() => {
      if (!kickEmotes?.length) return;

      const newRandomEmotes = [];
      const globalSet = kickEmotes.find((set) => set.name === "Emojis");
      if (!globalSet?.emotes?.length) return;

      for (let i = 0; i < 10; i++) {
        const randomEmoteIndex = Math.floor(Math.random() * globalSet.emotes.length);
        newRandomEmotes.push(globalSet.emotes[randomEmoteIndex]);
      }

      setRandomEmotes(newRandomEmotes);
      setCurrentHoverEmote(newRandomEmotes[Math.floor(Math.random() * randomEmotes.length)]);
    }, [kickEmotes]);

    const getRandomKickEmote = useCallback(() => {
      if (!randomEmotes.length) return;

      setCurrentHoverEmote(randomEmotes[Math.floor(Math.random() * randomEmotes.length)]);
    }, [randomEmotes]);

    return (
      <TooltipProvider>
        <div className={clsx("chatEmoteBtns", activeDialog !== null && "activeDialog")}>
          <button
            className={clsx("emoteBtn", activeDialog === "7tv" && "activeDialog")}
            onClick={() => setActiveDialog(activeDialog === "7tv" ? null : "7tv")}>
            <img src={STVLogo} height="24px" width="24px" alt="7TV Emotes" />
          </button>
          <span className="emoteBtnSeparator" />
          <button
            className={clsx("emoteBtn", "kickEmoteButton", activeDialog === "kick" && "activeDialog")}
            onMouseEnter={getRandomKickEmote}
            onClick={() => setActiveDialog(activeDialog === "kick" ? null : "kick")}>
            <img
              className="kickEmote emote"
              src={`https://files.kick.com/emotes/${currentHoverEmote?.id || "1730762"}/fullsize`}
              loading="lazy"
              fetchpriority="low"
              decoding="async"
            />
          </button>
        </div>

        <div className="emoteDialogs" ref={emoteDialogRef}>
          <SevenTVEmoteDialog
            isDialogOpen={activeDialog === "7tv"}
            sevenTVEmotes={allStvEmotes}
            handleEmoteClick={handleEmoteClick}
          />
          <KickEmoteDialog
            isDialogOpen={activeDialog === "kick"}
            kickEmotes={kickEmotes}
            handleEmoteClick={handleEmoteClick}
            userChatroomInfo={userChatroomInfo}
          />
        </div>
      </TooltipProvider>
    );
  },
  (prev, next) => prev.chatroomId === next.chatroomId && prev.userChatroomInfo === next.userChatroomInfo,
);

export default EmoteDialogs;
