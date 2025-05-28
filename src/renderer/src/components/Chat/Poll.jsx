import { clsx } from "clsx";
import { memo, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import CaretDown from "../../assets/icons/caret-down-bold.svg?asset";
import CloseIcon from "../../assets/icons/x-bold.svg?asset";
import TrashIcon from "../../assets/icons/trash-fill.svg?asset";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const Poll = memo(
  ({
    pollDetails,
    showChatters,
    showPollMessage,
    setShowPollMessage,
    handlePollDelete,
    handlePollUpdate,
    canModerate,
    chatroomId,
    chatroomName,
  }) => {
    // const [pollDetails, setPollDetails] = useState({
    //   title: "test",
    //   duration: 300,
    //   result_display_duration: 300,
    //   created_at: "2025-05-21T11:05:26.303172Z",
    //   options: [
    //     {
    //       id: 0,
    //       label: "13",
    //       votes: 3,
    //     },
    //     {
    //       id: 1,
    //       label: "14",
    //       votes: 2,
    //     },
    //   ],
    //   remaining: 68,
    //   has_voted: false,
    //   voted_option_id: null,
    // });

    const [poll, setPoll] = useState(pollDetails);
    const [percentRemaining, setPercentRemaining] = useState(0);

    const [selectedOption, setSelectedOption] = useState(pollDetails?.voted_option_id || null);
    const [hasVoted, setHasVoted] = useState(pollDetails?.has_voted || false);
    const [pollWinner, setPollWinner] = useState(null);
    const [isPollExpanded, setIsPollExpanded] = useState(false);

    const intervalTimerRef = useRef(null);

    const totalVotes = pollDetails?.options.reduce((sum, option) => sum + option.votes, 0);

    const handleVote = async (optionId) => {
      if (hasVoted || pollWinner) return;

      const response = await window.app.kick.getSubmitPollVote(chatroomName, optionId);

      if (response?.status?.code === 200) {
        const updatedOptions = pollDetails?.options.map((option) =>
          option.id === optionId ? { ...option, votes: option.votes + 1 } : option,
        );

        const updatedPoll = {
          ...pollDetails,
          options: updatedOptions,
          has_voted: true,
          voted_option_id: optionId,
        };

        await handlePollUpdate(chatroomId, updatedPoll);
        setPoll(updatedPoll);
        setSelectedOption(optionId);
        setHasVoted(true);

        return true;
      }

      return false;
    };

    const modDeletePoll = () => {
      if (!canModerate) return;
      handlePollDelete(chatroomId);
      setShowPollMessage(false);
    };

    const deletePoll = () => {
      handlePollDelete(chatroomId);
      setShowPollMessage(false);
    };

    useEffect(() => {
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
      if (!pollDetails?.duration) return;

      if (pollDetails.remaining === 0) {
        setPercentRemaining(0);
        setTimeout(deletePoll, pollDetails?.result_display_duration * 1000 || 15000);
        return;
      }

      const startTime = dayjs(pollDetails?.created_at);
      const endTime = dayjs(startTime).add(pollDetails.duration, "seconds");

      intervalTimerRef.current = setInterval(() => {
        const now = dayjs();
        const secondsRemaining = endTime.diff(now, "seconds");

        if (secondsRemaining <= 0) {
          clearInterval(intervalTimerRef.current);
          setPercentRemaining(0);
          setTimeout(deletePoll, pollDetails?.result_display_duration * 1000 || 15000);
          return;
        }

        setPercentRemaining((secondsRemaining / pollDetails.duration) * 100);
      }, 1000);

      return () => {
        if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
      };
    }, [pollDetails]);

    if (!pollDetails) return null;

    return (
      <div className={clsx("poll", showPollMessage && !showChatters && "open", isPollExpanded && "expanded")}>
        <div className="pollHeader">
          <div className="pollHeaderInfo">
            <h4>Current Poll:</h4>
            <span>{pollDetails?.title}</span>
          </div>
          <div className="pollActions">
            <button onClick={() => setIsPollExpanded(!isPollExpanded)}>
              <img
                src={CaretDown}
                width={16}
                height={16}
                alt="Expand Poll"
                style={{ transform: isPollExpanded ? "rotate(180deg)" : "none" }}
              />
            </button>
            <button onClick={() => setShowPollMessage(!showPollMessage)}>
              <img src={CloseIcon} width={14} height={14} alt="Close Poll" />
            </button>
            {canModerate && (
              <button onClick={modDeletePoll}>
                <img src={TrashIcon} width={14} height={14} alt="Delete Poll" />
              </button>
            )}
          </div>
        </div>
        <div className={clsx("pollOptions", hasVoted && "pollOptionsVoted", pollWinner && "pollOptionsWinner")}>
          {pollDetails?.options?.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const maxVotes = Math.max(...pollDetails?.options?.map((opt) => opt.votes));
            const optionsWithMaxVotes = pollDetails?.options?.filter((opt) => opt.votes === maxVotes);
            const optionWon = percentRemaining === 0 && option.votes === maxVotes && optionsWithMaxVotes.length === 1;

            return (
              <button
                key={option.id}
                onClick={() => {
                  if (pollWinner || hasVoted) return;
                  setSelectedOption(option.id);
                }}
                className={clsx(
                  "pollOption",
                  optionWon && "pollOptionWon",
                  hasVoted && selectedOption === option.id && "pollOptionVoted",
                  !hasVoted && selectedOption === option.id && "pollOptionSelected",
                )}>
                <div
                  className={clsx(
                    "pollOptionLabel",
                    optionWon && "pollOptionLabelWon",
                    hasVoted && selectedOption === option.id && "pollOptionLabelVoted",
                  )}>
                  <div className="pollOptionLabelContent">
                    <p>{option.label}</p>
                    <div className="pollOptionLabelStatus">
                      {hasVoted && selectedOption === option.id && <span id="pollOptionVotedLabel">VOTED</span>}
                      {optionWon && <span id="pollOptionWonLabel">CORRECT</span>}
                    </div>
                  </div>

                  <span>{`${option.votes > 0 ? `${option.votes === 1 ? `${option.votes} Vote` : `${option.votes} Votes`}` : "No Votes"} [${percentage.toFixed(1)}%]`}</span>
                </div>
                <div className="pollOptionBar">
                  <div
                    className="pollOptionBarFill"
                    style={{
                      width: `${percentage}%`,
                      transition: "width 0.2s ease-out",
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
        <div className={"pollFooter"}>
          {!hasVoted && percentRemaining > 0 && (
            <button className="pollVoteButton" onClick={() => handleVote(selectedOption)}>
              Submit
            </button>
          )}

          <div className="pollTimer">
            <span style={{ width: `${percentRemaining}%` }} />
          </div>

          {/* <div className="pollMessageFooterContent">
            <span>Poll ends {pollDetails?.remaining && `${dayjs().add(pollDetails?.remaining, "second").fromNow()}`}</span>
          </div> */}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.pollDetails === nextProps.pollDetails && prevProps.showPollMessage === nextProps.showPollMessage;
  },
);

export default Poll;
