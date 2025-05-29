import "../assets/styles/pages/ChatPage.scss";
import { act, useState } from "react";
import Chat from "../components/Chat";
import Navbar from "../components/Navbar";
import TitleBar from "../components/TitleBar";

const ChatPage = () => {
  const [activeChatroomId, setActiveChatroomId] = useState(null);
  const kickUsername = localStorage.getItem("kickUsername");
  return (
    <div className="chatPageContainer">
      <TitleBar />
      <div className="chatWrapper">
        <div className="chatNavigation">
          <Navbar currentChatroomId={activeChatroomId} onSelectChatroom={setActiveChatroomId} />
        </div>

        <div className="chatContent">
          {activeChatroomId ? (
            <Chat chatroomId={activeChatroomId} kickUsername={kickUsername} />
          ) : (
            <div className="chatroomsEmptyState">
              <h1>No Chatrooms</h1>
              <p>Add a chatroom by using "CTRL"+"t" or clicking Add button</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
