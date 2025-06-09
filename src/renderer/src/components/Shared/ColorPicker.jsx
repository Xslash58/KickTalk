import { RgbaColorPicker } from "react-colorful";
import { useRef, useState, useEffect, useCallback } from "react";
import { useDebounceCallback } from "../../utils/hooks";
import clsx from "clsx";
import useClickOutside from "../../utils/useClickOutside";
import { rgbaToString } from "../../utils/ChatUtils";

const ColorPicker = ({ disabled, initialColor, handleColorChange, isColorPickerOpen, setIsColorPickerOpen }) => {
  const [color, setColor] = useState(initialColor);
  const colorPickerRef = useRef(null);

  const debouncedHandleColorChange = useDebounceCallback(handleColorChange, 300);

  useEffect(() => {
    if (initialColor) {
      setColor(initialColor);
    }
  }, [initialColor]);

  const handleChange = useCallback(
    (newColor) => {
      setColor(newColor);
      debouncedHandleColorChange(newColor);
    },
    [debouncedHandleColorChange],
  );

  useEffect(() => {
    return () => {
      colorPickerRef.current = null;
    };
  }, []);

  useClickOutside(colorPickerRef, () => {
    setIsColorPickerOpen(false);
  });

  return (
    <div className="colorPicker">
      <div
        className={clsx("colorPickerHeader", { disabled })}
        onClick={() => {
          if (disabled) return;
          setIsColorPickerOpen(!isColorPickerOpen);
        }}
        ref={colorPickerRef}
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}>
        <button className="colorPickerPreview" disabled={disabled}>
          <div className="colorPickerPreviewInner" style={{ backgroundColor: rgbaToString(color) }} />
        </button>
      </div>
      <div className={clsx("colorPickerDialog", isColorPickerOpen && "show")}>
        <RgbaColorPicker color={color} onChange={handleChange} />
      </div>
    </div>
  );
};

export default ColorPicker;
