import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTheme } from "../../../theme/ThemeProvider";
import styles from "./PrimaryColor.module.css";

const PRIMARY_COLORS = [
  { name: "Blue", value: "#2563eb" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Green", value: "#16a34a" },
  { name: "Teal", value: "#0d9488" },
  { name: "Orange", value: "#ea580c" },
  { name: "Rose", value: "#e11d48" },
];

const PrimaryColor = () => {
  const { primaryColor, setPrimaryColor } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSelect = (color: (typeof PRIMARY_COLORS)[number]) => {
    setPrimaryColor(color);
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={`${styles.trigger} ${
          isOpen ? styles.triggerOpen : ""
        }`}
        onClick={() => setIsOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={styles.colorDot}
          style={{ backgroundColor: primaryColor.value }}
          aria-hidden="true"
        />

        <span className={styles.selectedName}>
          {primaryColor.name}
        </span>

        <ChevronDown
          className={`${styles.chevron} ${
            isOpen ? styles.chevronOpen : ""
          }`}
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className={styles.dropdown}
          role="listbox"
          aria-label="Primary color"
        >
          {PRIMARY_COLORS.map((color) => {
            const isSelected =
              color.value === primaryColor.value;

            return (
              <button
                key={color.value}
                type="button"
                className={`${styles.option} ${
                  isSelected ? styles.selected : ""
                }`}
                onClick={() => handleSelect(color)}
                role="option"
                aria-selected={isSelected}
              >
                <span
                  className={styles.colorDot}
                  style={{ backgroundColor: color.value }}
                  aria-hidden="true"
                />

                <span className={styles.optionName}>
                  {color.name}
                </span>

                {isSelected && (
                  <Check
                    className={styles.check}
                    size={16}
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PrimaryColor;