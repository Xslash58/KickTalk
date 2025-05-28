import { useCallback } from "react";
import { convertMinutesToHumanReadable } from "../../utils/ChatUtils";

const ModActionMessage = ({ message, chatroomId, channel7TVEmotes, subscriberBadges, chatroomName, userChatroomInfo }) => {
  const { modAction, modActionDetails } = message;
  const actionTaker = modActionDetails?.banned_by?.username || modActionDetails?.unbanned_by?.username;
  const moderator = actionTaker !== "moderated" ? actionTaker : "Bot";
  const username = modActionDetails?.user?.username;
  const duration = modActionDetails?.duration;

  const isBanAction = modAction === "banned" || modAction === "ban_temporary";

  const handleOpenUserDialog = useCallback(
    async (usernameDialog) => {
      if (usernameDialog === "moderator" || usernameDialog === "Bot") return;
      const user = await window.app.kick.getUserChatroomInfo(chatroomName, usernameDialog);
      if (!user?.data?.id) return;

      const userDialogInfo = {
        id: user.data.id,
        username: user.data.username,
        slug: user.data.slug,
      };

      window.app.userDialog.open({
        sender: userDialogInfo,
        fetchedUser: user?.data,
        chatroomId,
        sevenTVEmotes: channel7TVEmotes,
        subscriberBadges,
        userChatroomInfo,
        cords: [0, 300],
      });
    },
    [chatroomName, username, chatroomId, channel7TVEmotes, subscriberBadges],
  );

  return (
    <div className="modActionContainer">
      <div className="modActionMessage">
        {isBanAction ? (
          <>
            <button onClick={() => handleOpenUserDialog(moderator)}>{moderator}</button>{" "}
            {modAction === "banned" ? "permanently banned " : "timed out "}
            <button onClick={() => handleOpenUserDialog(username)}>{username}</button>{" "}
            {modAction === "ban_temporary" && ` for ${convertMinutesToHumanReadable(duration)}`}
          </>
        ) : (
          <>
            <button onClick={() => handleOpenUserDialog(moderator)}>{moderator}</button>{" "}
            {modAction === "unbanned" ? "unbanned" : "removed timeout on"}{" "}
            <button onClick={() => handleOpenUserDialog(username)}>{username}</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ModActionMessage;
