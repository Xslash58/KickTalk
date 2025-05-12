import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import "../../assets/styles/dialogs/UserDialog.scss";

const ContextMenu = () => {
  const [dialogData, setDialogData] = useState(null);

  useEffect(() => {
    const handleContextMenuData = (event, data) => {
      setDialogData(data);
    };

    ipcRenderer.on("contextMenu:data", handleContextMenuData);

    return () => {
      ipcRenderer.removeListener("contextMenu:data", handleContextMenuData);
    };
  }, []);

  return (
    <div className="dialogWrapper">
      <>
        <p>asdasd</p>
      </>
    </div>
  );
};

export default ContextMenu;
