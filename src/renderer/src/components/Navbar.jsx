import "../assets/styles/components/Navbar.scss";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import useChatStore from "../providers/ChatProvider";
import Plus from "../assets/icons/plus-bold.svg?asset";
import X from "../assets/icons/x-bold.svg?asset";
import useClickOutside from "../utils/useClickOutside";
import { useSettings } from "../providers/SettingsProvider";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "./Shared/ContextMenu";

const Navbar = ({ currentChatroomId, onSelectChatroom }) => {
  const connections = useChatStore((state) => state.connections);
  const { settings } = useSettings();
  const addChatroom = useChatStore((state) => state.addChatroom);
  const removeChatroom = useChatStore((state) => state.removeChatroom);
  const renameChatroom = useChatStore((state) => state.renameChatroom);
  const reorderChatrooms = useChatStore((state) => state.reorderChatrooms);
  const orderedChatrooms = useChatStore((state) => state.getOrderedChatrooms());

  const [editingChatroomId, setEditingChatroomId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [showAddChatroomDialog, setAddChatroomDialog] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const inputRef = useRef(null);
  const renameInputRef = useRef(null);
  const chatroomListRef = useRef(null);
  const addChatroomDialogRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = inputRef.current?.value.toLowerCase();
    if (!username) return;

    setIsConnecting(true);

    try {
      const newChatroom = await addChatroom(username);
      if (newChatroom) {
        inputRef.current.value = "";
        setAddChatroomDialog(false);
        setTimeout(() => {
          onSelectChatroom(newChatroom.id);
        }, 0);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRemoveChatroom = async (chatroomId) => {
    if (!connections[chatroomId]) return;

    const currentIndex = orderedChatrooms.findIndex((chatroom) => chatroom.id === chatroomId);
    await removeChatroom(chatroomId);

    // Get the remaining chatrooms after removal
    const remainingChatrooms = orderedChatrooms.filter((chatroom) => chatroom.id !== chatroomId);

    // If there are chatrooms available select next in list else select one behind
    if (remainingChatrooms.length) {
      const nextChatroom = remainingChatrooms[currentIndex] || remainingChatrooms[currentIndex - 1];
      if (nextChatroom) {
        onSelectChatroom(nextChatroom.id);
      }
    } else {
      onSelectChatroom(null);
    }
  };

  // Drag and drop chatrooms
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.index === destination.index) return;

    const reordered = Array.from(orderedChatrooms);
    const [removed] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, removed);

    // Update state
    reorderChatrooms(reordered);
  };

  // Select first chatroom on mount if no chatroom is currently selected
  useEffect(() => {
    if (orderedChatrooms.length > 0 && !currentChatroomId) {
      setTimeout(() => {
        onSelectChatroom(orderedChatrooms[0].id);
      }, 100);
    }
  }, [orderedChatrooms, currentChatroomId, onSelectChatroom]);

  // Setup event listeners
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();

      chatroomListRef?.current?.scrollBy({
        left: e.deltaY < 0 ? -30 : 30,
      });
    };

    chatroomListRef?.current?.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      chatroomListRef?.current?.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useClickOutside(addChatroomDialogRef, () => {
    setAddChatroomDialog(false);
  });

  // Handle new chatroom key press (ctrl + t) and close dialog (escape)
  const handleNewChatroomKeyPress = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === "t" || e.key.toLowerCase() === "j")) {
      e.preventDefault();
      setAddChatroomDialog(true);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }

    if (e.key === "Escape") {
      setAddChatroomDialog(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleNewChatroomKeyPress);
    return () => {
      window.removeEventListener("keydown", handleNewChatroomKeyPress);
    };
  }, [handleNewChatroomKeyPress]);

  // Rename Chatroom
  const handleRename = (e, { chatroomId, currentDisplayName }) => {
    setEditingChatroomId(chatroomId);
    setEditingName(currentDisplayName);
    setTimeout(() => {
      renameInputRef.current?.focus();
    }, 250);
  };

  const handleRenameSubmit = (chatroomId) => {
    if (editingName.trim()) {
      renameChatroom(chatroomId, editingName.trim());
    }
    setEditingChatroomId(null);
    setEditingName("");
  };

  const chatroomTab = (chatroom, index) => (
    <Draggable key={chatroom.id} draggableId={`item-${chatroom.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
          }}>
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                onDoubleClick={(e) =>
                  handleRename(e, { chatroomId: chatroom.id, currentDisplayName: chatroom.displayName || chatroom.username })
                }
                onClick={() => onSelectChatroom(chatroom.id)}
                onMouseDown={async (e) => {
                  if (e.button === 1) {
                    await handleRemoveChatroom(chatroom.id);
                  }
                }}
                className={clsx(
                  "chatroomStreamer",
                  chatroom.id === currentChatroomId && "chatroomStreamerActive",
                  chatroom?.isStreamerLive && "chatroomStreamerLive",
                  snapshot.isDragging && "dragging",
                )}>
                <div className="streamerInfo">
                  {settings?.general?.showTabImages && chatroom.streamerData?.user?.profile_pic && (
                    <img
                      className="profileImage"
                      src={chatroom.streamerData.user.profile_pic}
                      alt={`${chatroom.username}'s profile`}
                    />
                  )}
                  {editingChatroomId === chatroom.id ? (
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleRenameSubmit(chatroom.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRenameSubmit(chatroom.id);
                        } else if (e.key === "Escape") {
                          setEditingChatroomId(null);
                          setEditingName("");
                        }
                      }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      ref={renameInputRef}
                    />
                  ) : (
                    <span>{chatroom.displayName || chatroom.username}</span>
                  )}
                </div>
                <button
                  className="closeChatroom"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveChatroom(chatroom.id);
                  }}
                  aria-label="Remove chatroom">
                  <img src={X} width={12} height={12} alt="Remove chatroom" />
                </button>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onSelect={() => window.open(`https://kick.com/${chatroom.username}`, "_blank")}>
                Open Stream in Browser
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => window.open(`https://player.kick.com/${chatroom.username}`, "_blank")}>
                Open Player in Browser
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                onSelect={(e) =>
                  handleRename(e, { chatroomId: chatroom.id, currentDisplayName: chatroom.displayName || chatroom.username })
                }>
                Rename Tab
              </ContextMenuItem>
              <ContextMenuItem onSelect={() => handleRemoveChatroom(chatroom.id)}>Remove Chatroom</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      )}
    </Draggable>
  );

  return (
    <>
      <div className={clsx("navbarContainer", settings?.general?.wrapChatroomsList && "wrapChatroomList")} ref={chatroomListRef}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="chatrooms" direction="horizontal">
            {(provided) => (
              <div className="chatroomsList" {...provided.droppableProps} ref={provided.innerRef}>
                {orderedChatrooms.map((chatroom, index) => chatroomTab(chatroom, index))}
                {provided.placeholder}

                {settings?.general?.wrapChatroomsList && (
                  <div className="navbarAddChatroomContainer">
                    <button
                      className="navbarAddChatroomButton"
                      onClick={() => {
                        setAddChatroomDialog(!showAddChatroomDialog);
                        if (!showAddChatroomDialog) {
                          setTimeout(() => {
                            inputRef.current?.focus();
                          }, 0);
                        }
                      }}
                      disabled={isConnecting}>
                      <span>Add</span>
                      <img src={Plus} width={16} height={16} alt="Add chatroom" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className={clsx("navbarAddChatroomDialog", showAddChatroomDialog && "open")}>
          <div className="navbarAddChatroomDialogBody" ref={addChatroomDialogRef}>
            <div className="navbarAddChatroomDialogHead">
              <div className="navbarAddChatroomDialogHeadInfo">
                <h2>Add Chatroom</h2>
                <p>Enter a channel name to add a new chatroom</p>
              </div>
              <button
                className="navbarAddChatroomDialogClose"
                onClick={() => setAddChatroomDialog(false)}
                aria-label="Close Add Chatroom">
                <img src={X} width={16} height={16} alt="Close Add Chatroom" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="navbarAddForm">
              <div>
                <input ref={inputRef} placeholder="Enter username" disabled={isConnecting} />
              </div>
              <button className="navbarAddChatroom" type="submit" disabled={isConnecting}>
                {isConnecting ? "Connecting..." : "Add Chatroom"}
              </button>
            </form>
          </div>

          <div className="dialogBackgroundOverlay" />
        </div>
        {!settings?.general?.wrapChatroomsList && (
          <div className="navbarAddChatroomContainer">
            <button
              className="navbarAddChatroomButton"
              onClick={() => {
                setAddChatroomDialog(!showAddChatroomDialog);
                if (!showAddChatroomDialog) {
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 0);
                }
              }}
              disabled={isConnecting}>
              Add
              <img src={Plus} width={16} height={16} alt="Add chatroom" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
