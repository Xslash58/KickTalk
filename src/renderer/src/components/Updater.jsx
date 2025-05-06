import { useEffect, useState } from "react";
import downloadIcon from "../../src/assets/icons/cloud-arrow-down-fill.svg?asset";

const Updater = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    const callbackFunction = (update) => {
      setIsUpdateAvailable(update);
    };

    const cleanup = window.app.update.onUpdate(callbackFunction);

    return () => {
      cleanup();
    };
  }, []);

  return (
    <div className="updater">
      <button>
        <img src={downloadIcon} alt="Update" width={20} height={20} />
      </button>
    </div>
  );
};

export default Updater;
