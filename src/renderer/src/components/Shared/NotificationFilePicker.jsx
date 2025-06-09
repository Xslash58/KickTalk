import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./Dropdown";
import caretDownIcon from "../../assets/icons/caret-down-fill.svg?asset";
const NotificationFilePicker = ({ getOptions, onChange, settingsData, disabled }) => {
  const [options, setOptions] = useState([]);
  const [name, setName] = useState("default");

  useEffect(() => {
    const fetchOptions = async () => {
      const initialOptions = await getOptions();
      setOptions(initialOptions);
    };
    fetchOptions();
  }, [getOptions]);

  useEffect(() => {
    if (settingsData?.notifications?.soundFileName) {
      setName(settingsData.notifications.soundFileName);
    } else if (settingsData?.notifications?.soundFile) {
      const filename = settingsData.notifications.soundFile.split(/[/\\]/).pop();
      setName(filename.split(".")[0].replace(/_/g, " "));
    } else {
      setName("default");
    }
  });

  const handleChange = (opt) => {
    setName(opt.name);
    onChange("notifications", {
      ...settingsData?.notifications,
      soundFile: opt.value,
      soundFileName: opt.name,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled} asChild>
        <button className="soundFileName">
          {name} <img src={caretDownIcon} width={14} height={14} alt="Caret Down" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {options.map((opt) => (
          <DropdownMenuItem key={opt.name} value={opt.value} onSelect={() => handleChange(opt)}>
            {opt.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationFilePicker;
