import { useEffect } from "react";
import { X } from "lucide-react";
import styles from "./Modal.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  mode?: "default" | "description";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
};

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  mode = "default",
  closeOnBackdrop = true,
  closeOnEscape = true,
}: ModalProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeOnEscape, onClose]);

  if (!open) {
    return null;
  }

  const modalClassName = [
    styles.modal,
    mode === "description" ? styles.descriptionModal : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (
      closeOnBackdrop &&
      event.target === event.currentTarget
    ) {
      onClose();
    }
  };

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <section
        className={modalClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={
          description ? "modal-description" : undefined
        }
      >
        <header className={styles.header}>
          <div className={styles.heading}>
            <h2 id="modal-title">{title}</h2>

            {description && (
              <p id="modal-description">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <X
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        </header>

        <div className={styles.content}>
          {children}
        </div>

        {footer && (
          <footer className={styles.footer}>
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
};

export default Modal;