import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";
import styles from "./Header.module.css";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink
          to="/"
          className={styles.logo}
          onClick={handleNavigation}
        >
          InventorySystem
        </NavLink>

        <nav
          className={`${styles.navigation} ${
            isMenuOpen ? styles.navigationOpen : ""
          }`}
          aria-label="Main navigation"
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? styles.active : undefined
            }
            onClick={handleNavigation}
          >
            Home
          </NavLink>

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? styles.active : undefined
            }
            onClick={handleNavigation}
          >
            Dashboard
          </NavLink>
           <NavLink
            to="/auth"
            className={({ isActive }) =>
              isActive ? styles.active : undefined
            }
            onClick={handleNavigation}
          >
            Login
          </NavLink>
          <NavLink
            to="/create-organization"
            className={({ isActive }) =>
              isActive ? styles.active : undefined
            }
            onClick={handleNavigation}
          >
            Join Us
          </NavLink>

          <div className={styles.theme}>
            <ThemeToggle />
          </div>
        </nav>

        <div className={styles.mobileControls}>
          <ThemeToggle />

          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={
              isMenuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X size={20} strokeWidth={1.9} />
            ) : (
              <Menu size={20} strokeWidth={1.9} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

