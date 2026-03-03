import { useEffect } from "react";
import "../../assets/css/popUps.css"
import { IoWarningOutline } from "react-icons/io5";

type WarningModalProps = {
  open: boolean;
  title: string;
  details: string;
  cancelText?: string;
  acceptText?: string;
  onClose: () => void;
  onCancel: () => void;
  onAccept: () => void;
};

export function WarningPopUp({ open, title, details, cancelText, acceptText, onAccept, onCancel, onClose }: WarningModalProps) {
  // ESC to close
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key == "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Prevent background scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="warning-overlay">
      <section
        className="warning-main-body"
        role="dialog"
        aria-modal="true"
        aria-labelledby="warning-title"
      >
        <div className="warning-header">
          <span className="warning-icon" aria-hidden="true">
            <IoWarningOutline className="warning-triangle" />
          </span>

          <button
            type="button"
            className="warning-close"
            onClick={() => onClose?.()}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="warning-details">
          <h3 id="warning-title">{title}</h3>
          <span>{details}</span>
        </div>

        <div className="warning-buttons">
          <button type="button" onClick={onCancel} className="warning-btn-cancel">
            {cancelText}
          </button>

          <button type="button" onClick={onAccept} className="warning-btn-accept">
            {acceptText}
          </button>
        </div>
      </section>
    </div>
  );
}

export type InfoModalProps = {
  open: boolean;
  title: string;
  details: string;
  onClose: () => void;
};

export function InfoPopUp({ open, title, details, onClose }: InfoModalProps) {

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key == "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="infoModal__backdrop" onClick={onClose} role="presentation">
      <div
        className="infoModal__card"
        onClick={stop}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button className="infoModal__close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="infoModal__iconWrap" aria-hidden="true">
          <div className="infoModal__icon">i</div>
        </div>

        <h3 className="infoModal__title">{title}</h3>
        <p className="infoModal__details">{details}</p>
      </div>
    </div>
  );
}