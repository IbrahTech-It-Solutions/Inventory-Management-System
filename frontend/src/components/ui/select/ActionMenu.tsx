import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import styles from "./ActionMenu.module.css";
import Button from "../button/Button";

export type ActionMenuItem = {
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
};

type ActionMenuProps = {
  items: ActionMenuItem[];
  label?: string;
};

const ActionMenu = ({
  items,
  label = "Open actions",
}: ActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );
    };
  }, []);

  const handleItemClick = (item: ActionMenuItem) => {
    if (item.disabled) {
      return;
    }

    item.onClick();
    setIsOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Button
        variant="menu"
        icon={<MoreHorizontal size={19} strokeWidth={2} />}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      />

      {isOpen && (
        <div className={styles.menu} role="menu">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              role="menuitem"
              className={`${styles.item} ${
                item.danger ? styles.danger : ""
              }`}
              disabled={item.disabled}
              onClick={() => handleItemClick(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;