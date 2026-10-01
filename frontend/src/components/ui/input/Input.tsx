import {
  useId,
  type ChangeEvent,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import styles from "./Input.module.css";

type ValidationResult = {
  valid: boolean;
  errorCode?: string;
  message?: string;
};

type BaseInputProps = {
  label: string;
  value: string;
  onChange: (
    value: string,
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  validate?: (value: string) => ValidationResult;
  errorCode?: string;
  errorMessage?: string;
  hint?: string;
  required?: boolean;
};

type TextInputProps = BaseInputProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > & {
    multiline?: false;
  };

type TextAreaProps = BaseInputProps &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange"
  > & {
    multiline: true;
  };

type InputProps = TextInputProps | TextAreaProps;

const Input = (props: InputProps) => {
  const {
    label,
    value,
    onChange,
    validate,
    errorCode,
    errorMessage,
    hint,
    required,
    multiline,
    id: providedId,
  } = props;

  const generatedId = useId();
  const inputId = providedId ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const validation = validate?.(value) ?? {
    valid: true,
  };

  const hasValidationError =
    !validation.valid || Boolean(errorMessage);

  const resolvedErrorCode =
    errorCode ?? validation.errorCode;

  const resolvedErrorMessage =
    errorMessage ?? validation.message;

  const describedBy = [
    hint ? hintId : "",
    hasValidationError ? errorId : "",
  ]
    .filter(Boolean)
    .join(" ") || undefined;

  const className = [
    styles.input,
    hasValidationError ? styles.error : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleInputChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onChange(event.target.value, event);
  };

  return (
    <div className={styles.field}>
      <label
        htmlFor={inputId}
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

      {multiline ? (
        <textarea
          id={inputId}
          name={props.name}
          value={value}
          placeholder={props.placeholder}
          disabled={props.disabled}
          readOnly={props.readOnly}
          required={required}
          rows={props.rows}
          cols={props.cols}
          maxLength={props.maxLength}
          minLength={props.minLength}
          autoFocus={props.autoFocus}
          autoComplete={props.autoComplete}
          spellCheck={props.spellCheck}
          aria-label={props["aria-label"]}
          aria-labelledby={props["aria-labelledby"]}
          aria-describedby={describedBy}
          aria-invalid={hasValidationError}
          className={className}
          onChange={handleInputChange}
        />
      ) : (
        <input
          id={inputId}
          name={props.name}
          type={props.type}
          value={value}
          placeholder={props.placeholder}
          disabled={props.disabled}
          readOnly={props.readOnly}
          required={required}
          min={props.min}
          max={props.max}
          step={props.step}
          minLength={props.minLength}
          maxLength={props.maxLength}
          pattern={props.pattern}
          autoFocus={props.autoFocus}
          autoComplete={props.autoComplete}
          inputMode={props.inputMode}
          aria-label={props["aria-label"]}
          aria-labelledby={props["aria-labelledby"]}
          aria-describedby={describedBy}
          aria-invalid={hasValidationError}
          className={className}
          onChange={handleInputChange}
        />
      )}

      {hint && !hasValidationError && (
        <span
          id={hintId}
          className={styles.hint}
        >
          {hint}
        </span>
      )}

      {hasValidationError && (
        <div
          id={errorId}
          className={styles.errorMessage}
          role="alert"
        >
          {resolvedErrorCode && (
            <span className={styles.errorCode}>
              {resolvedErrorCode}
            </span>
          )}

          {resolvedErrorMessage && (
            <span>{resolvedErrorMessage}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;