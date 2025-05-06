import { HexColorPicker } from "react-colorful";
import { useRef, useState, useEffect } from "react";
import clsx from "clsx";
import useClickOutside from "../../utils/useClickOutside";
const ColorPicker = ({ initialColor, handleColorChange, isColorPickerOpen, setIsColorPickerOpen }) => {
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    if (initialColor && initialColor !== color) {
      setColor(initialColor);
    }
  }, [initialColor]);

  const handleChange = (newColor) => {
    setColor(newColor);
    handleColorChange(newColor);
  };

  const colorPickerRef = useRef(null);
  useClickOutside(colorPickerRef, () => setIsColorPickerOpen(false));

  return (
    <div className="colorPicker">
      <div className="colorPickerHeader" onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}>
        <p>Select Highlight Colour:</p>
        <button className="colorPickerPreview">
          <div className="colorPickerPreviewInner" style={{ backgroundColor: color }} />
        </button>
      </div>
      <div className={clsx("colorPickerDialog", isColorPickerOpen && "show")} ref={colorPickerRef}>
        <HexColorPicker color={color} onChange={handleChange} />
        <input
          type="text"
          maxLength={7}
          onChange={(e) => {
            const value = e?.target?.value;
            if (value.startsWith("#")) {
              handleChange(value);
            }
          }}
          value={color}
          onBlur={() => setIsColorPickerOpen(false)}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
