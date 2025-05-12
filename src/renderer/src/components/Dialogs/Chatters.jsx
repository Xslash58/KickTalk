import { useEffect, useState } from "react";
import X from "../../assets/icons/x-bold.svg";
import { useDebounceValue } from "../../utils/hooks";

const Chatters = () => {
  const [chattersData, setChattersData] = useState(null);
  const [debouncedValue, setDebouncedValue] = useDebounceValue("", 200);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const updateChatters = (chatters) => {
      setChattersData(chatters);
    };

    const chattersDataCleanup = window.app.chattersDialog.onData(updateChatters);
    return () => chattersDataCleanup();
  }, []);

  useEffect(() => {
    const searchedChatter = chattersData?.chatters?.filter((chatter) =>
      chatter.username.toLowerCase().includes(debouncedValue.toLowerCase()),
    );
    setResults(searchedChatter);
  }, [debouncedValue]);

  return (
    <div className="chattersContainer">
      <div className="chattersHead">
        <h2>
          <p>
            Chatters: <span>{chattersData?.streamerData?.user?.username || ""}</span>
          </p>
          <p>
            Total: <span>{chattersData?.chatters?.length || 0}</span>
          </p>
        </h2>

        <button className="chattersCloseBtn" onClick={() => window.app.chattersDialog.close()}>
          <img src={X} width={18} height={18} alt="Close" />
        </button>
      </div>

      <div className="chattersSearch">
        <input type="text" placeholder="Search..." onChange={(e) => setDebouncedValue(e.target.value.trim())} />
      </div>

      {chattersData?.chatters?.length ? (
        <div className="chattersList">
          {!results?.length && debouncedValue ? (
            <div className="chatterListItem">
              <span>No results found</span>
            </div>
          ) : results?.length > 0 ? (
            results.map((chatter) => (
              <div key={chatter.id} className="chatterListItem">
                <span style={{ color: chatter?.identity?.color }}>{chatter.username}</span>
              </div>
            ))
          ) : (
            chattersData?.chatters?.map((chatter) => (
              <div key={chatter.id} className="chatterListItem">
                <span style={{ color: chatter?.identity?.color }}>{chatter.username}</span>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="chattersListEmpty">
          <p>No chatters tracked yet</p>
          <span>As users type their username will appear here.</span>
        </div>
      )}
    </div>
  );
};

export default Chatters;
