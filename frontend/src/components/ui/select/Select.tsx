import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import styles from "./Select.module.css";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errorCode?: string;
  errorMessage?: string;
  hint?: string;
};

const Select = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  required = false,
  disabled = false,
  errorCode,
  errorMessage,
  hint,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const generatedId = useId();
  const selectId = `select-${generatedId}`;
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  const selectedOption = options.find(
    (option) => option.value === value,
  );

  const hasError = Boolean(errorMessage || errorCode);

  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "pointerdown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handleOutsideClick,
      );
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  const describedBy = [
    hint ? hintId : "",
    hasError ? errorId : "",
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) {
      return;
    }

    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.field}
    >
      <label
        htmlFor={selectId}
        className={styles.label}
      >
        {label}

        {required && (
          <span
            className={styles.required}
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      <div className={styles.selectWrapper}>
        <button
          id={selectId}
          type="button"
          className={`${styles.trigger} ${
            hasError ? styles.error : ""
          } ${isOpen ? styles.open : ""}`}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-describedby={describedBy}
          aria-invalid={hasError}
          onClick={() =>
            setIsOpen((current) => !current)
          }
        >
          <span
            className={
              selectedOption
                ? styles.value
                : styles.placeholder
            }
          >
            {selectedOption?.label ?? placeholder}
          </span>

          <ChevronDown
            size={17}
            strokeWidth={2}
            className={`${styles.chevron} ${
              isOpen ? styles.chevronOpen : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div
            className={styles.dropdown}
            role="listbox"
            aria-labelledby={selectId}
          >
            {options.map((option) => {
              const isSelected =
                option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  className={`${styles.option} ${
                    isSelected ? styles.selected : ""
                  }`}
                  onClick={() =>
                    handleSelect(option)
                  }
                >
                  <span>{option.label}</span>

                  {isSelected && (
                    <Check
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

      {hint && !hasError && (
        <span
          id={hintId}
          className={styles.hint}
        >
          {hint}
        </span>
      )}

      {hasError && (
        <div
          id={errorId}
          className={styles.errorMessage}
          role="alert"
        >
          {errorCode && (
            <span className={styles.errorCode}>
              {errorCode}
            </span>
          )}

          {errorMessage && (
            <span>{errorMessage}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Select;