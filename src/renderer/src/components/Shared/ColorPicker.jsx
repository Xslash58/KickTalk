import { HexColorPicker } from "react-colorful";
import { useRef, useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import useClickOutside from "../../utils/useClickOutside";
import { useDebounceCallback } from "../../utils/hooks";

const ColorPicker = ({ disabled, initialColor, handleColorChange, isColorPickerOpen, setIsColorPickerOpen }) => {
  const [color, setColor] = useState(initialColor);
  const colorPickerRef = useRef(null);

  const debouncedHandleColorChange = useDebounceCallback(handleColorChange, 300);

  useEffect(() => {
    if (initialColor && initialColor !== color) {
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
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "not-allowed" : "pointer",
        }}>
        <button className="colorPickerPreview" disabled={disabled}>
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
