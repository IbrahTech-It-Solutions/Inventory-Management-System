import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Globe2,
  History,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  SlidersHorizontal,
  Truck,
  UserRound,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const SIDEBAR_STORAGE_KEY = "inventory-sidebar-collapsed";

type NavigationItem = {
  to: string;
  label: string;
  icon: typeof Package;
};

type NavigationGroup = {
  label: string;
  icon: typeof Package;
  items: NavigationItem[];
};

type FloatingMenuPosition = {
  top: number;
  left: number;
};

const navigationGroups: NavigationGroup[] = [
  {
    label: "Inventory",
    icon: Boxes,
    items: [
      {
        to: "/categories",
        label: "Categories",
        icon: ClipboardList,
      },
      {
        to: "/products",
        label: "Products",
        icon: Package,
      },
      {
        to: "/warehouses",
        label: "Warehouses",
        icon: Warehouse,
      },
      {
        to: "/stocks",
        label: "Stock",
        icon: Boxes,
      },
    ],
  },
  {
    label: "Operations",
    icon: SlidersHorizontal,
    items: [
      {
        to: "/purchases",
        label: "Purchases",
        icon: ShoppingCart,
      },
      {
        to: "/orders",
        label: "Sales / Orders",
        icon: FileText,
      },
      {
        to: "/transfers",
        label: "Stock Transfers",
        icon: Truck,
      },
      {
        to: "/adjustments",
        label: "Adjustments",
        icon: SlidersHorizontal,
      },
    ],
  },
  {
    label: "Partners",
    icon: Users,
    items: [
      {
        to: "/suppliers",
        label: "Suppliers",
        icon: Truck,
      },
      {
        to: "/customers",
        label: "Customers",
        icon: UserRound,
      },
    ],
  },
  {
    label: "Analytics",
    icon: BarChart3,
    items: [
      {
        to: "/stats",
        label: "Stats",
        icon: BarChart3,
      },
      {
        to: "/reports",
        label: "Reports",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "System",
    icon: Settings,
    items: [
      {
        to: "/users-permissions",
        label: "Users & Permissions",
        icon: Users,
      },
      {
        to: "/activity",
        label: "Activity Log",
        icon: History,
      },
      {
        to: "/notifications",
        label: "Notifications",
        icon: FileText,
      },
      {
        to: "/settings",
        label: "Settings",
        icon: Settings,
      },
    ],
  },
];

const getInitialCollapsedState = (): boolean => {
  return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(
    getInitialCollapsedState,
  );

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [openGroups, setOpenGroups] = useState<
    Record<string, boolean>
  >({
    Inventory: true,
    Operations: false,
    Partners: false,
    Analytics: false,
    System: false,
  });

  const [activeFloatingGroup, setActiveFloatingGroup] =
    useState<string | null>(null);

  const [floatingMenuPosition, setFloatingMenuPosition] =
    useState<FloatingMenuPosition | null>(null);

  const handleToggle = () => {
    setIsCollapsed((current) => {
      const nextState = !current;

      localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        String(nextState),
      );

      if (!nextState) {
        setActiveFloatingGroup(null);
        setFloatingMenuPosition(null);
      }

      return nextState;
    });
  };

  const handleNavigation = () => {
    setIsMobileOpen(false);
    setActiveFloatingGroup(null);
    setFloatingMenuPosition(null);
  };

  const handleGroupToggle = (
    label: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const nextIsOpen = !openGroups[label];

    setOpenGroups((current) => ({
      ...current,
      [label]: nextIsOpen,
    }));

    if (!isCollapsed) {
      return;
    }

    if (!nextIsOpen) {
      setActiveFloatingGroup(null);
      setFloatingMenuPosition(null);
      return;
    }

    const buttonRect =
      event.currentTarget.getBoundingClientRect();

    setActiveFloatingGroup(label);

    setFloatingMenuPosition({
      top: buttonRect.top,
      left: buttonRect.right + 10,
    });
  };

  return (
    <>
      <button
        type="button"
        className={styles.mobileMenu}
        onClick={() => {
          setIsMobileOpen(true);
          setIsCollapsed(false);
          setActiveFloatingGroup(null);
          setFloatingMenuPosition(null);
        }}
        aria-label="Open navigation"
        aria-expanded={isMobileOpen}
      >
        <Menu size={21} strokeWidth={1.9} />
      </button>

      {isMobileOpen && (
        <button
          type="button"
          className={styles.overlay}
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={`${styles.sidebar} ${
          isCollapsed ? styles.collapsed : ""
        } ${isMobileOpen ? styles.mobileOpen : ""}`}
      >
        <div className={styles.top}>
          <div className={styles.mobileHeader}>
            <NavLink
              to="/"
              className={styles.brand}
              onClick={handleNavigation}
            >
              <img
                src="/favicon.svg"
                alt=""
                className={styles.logo}
              />

              <span className={styles.brandName}>
                Inventory
              </span>
            </NavLink>

            <button
              type="button"
              className={styles.mobileClose}
              onClick={() => setIsMobileOpen(false)}
              aria-label="Close navigation"
            >
              <X size={20} strokeWidth={1.9} />
            </button>
          </div>

          <div className={styles.desktopBrand}>
            <NavLink
              to="/"
              className={styles.brand}
              title={isCollapsed ? "Inventory" : undefined}
            >
              <img
                src="/favicon.svg"
                alt=""
                className={styles.logo}
              />

              {!isCollapsed && (
                <span className={styles.brandName}>
                  Inventory
                </span>
              )}
            </NavLink>

            <button
              type="button"
              className={styles.toggle}
              onClick={handleToggle}
              aria-label={
                isCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              title={
                isCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
            >
              {isCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          </div>

          <nav
            className={styles.navigation}
            aria-label="Main navigation"
          >
            <NavLink
              to="/dashboard"
              className={styles.link}
              title={isCollapsed ? "Dashboard" : undefined}
              onClick={handleNavigation}
            >
              <LayoutDashboard
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />

              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>

            <div className={styles.groups}>
              {navigationGroups.map((group) => {
                const GroupIcon = group.icon;
                const isOpen = openGroups[group.label];

                return (
                  <div
                    key={group.label}
                    className={styles.group}
                  >
                    <button
                      type="button"
                      className={styles.groupButton}
                      onClick={(event) =>
                        handleGroupToggle(group.label, event)
                      }
                      title={
                        isCollapsed
                          ? group.label
                          : undefined
                      }
                      aria-expanded={isOpen}
                    >
                      <span className={styles.groupIcon}>
                        <GroupIcon
                          size={18}
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </span>

                      {!isCollapsed && (
                        <>
                          <span className={styles.groupLabel}>
                            {group.label}
                          </span>

                          <ChevronDown
                            size={16}
                            strokeWidth={1.8}
                            className={`${styles.groupChevron} ${
                              isOpen
                                ? styles.groupChevronOpen
                                : ""
                            }`}
                            aria-hidden="true"
                          />
                        </>
                      )}

                      {isCollapsed && (
                        <ChevronRight
                          size={12}
                          strokeWidth={2}
                          className={`${styles.collapsedArrow} ${
                            isOpen
                              ? styles.collapsedArrowOpen
                              : ""
                          }`}
                          aria-hidden="true"
                        />
                      )}
                    </button>

                    {!isCollapsed && isOpen && (
                      <div className={styles.submenu}>
                        {group.items.map(
                          ({ to, label, icon: Icon }) => (
                            <NavLink
                              key={to}
                              to={to}
                              className={styles.subLink}
                              onClick={handleNavigation}
                            >
                              <span
                                className={
                                  styles.subLinkIcon
                                }
                              >
                                <Icon
                                  size={17}
                                  strokeWidth={1.8}
                                  aria-hidden="true"
                                />
                              </span>

                              <span>{label}</span>
                            </NavLink>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.user}
            title="User profile"
          >
            <span
              className={styles.avatar}
              aria-hidden="true"
            >
              I
            </span>

            {!isCollapsed && (
              <span className={styles.userInfo}>
                <span className={styles.userName}>
                  Inventory User
                </span>

                <span className={styles.userRole}>
                  Administrator
                </span>
              </span>
            )}
          </button>

          <button
            type="button"
            className={styles.language}
            title="Change language"
            aria-label="Change language"
          >
            <Globe2
              size={18}
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {!isCollapsed && <span>English</span>}
          </button>
        </div>
      </aside>

      {isCollapsed &&
        activeFloatingGroup &&
        floatingMenuPosition && (
          <div
            className={styles.floatingSubmenu}
            style={{
              top: floatingMenuPosition.top,
              left: floatingMenuPosition.left,
            }}
          >
            <div className={styles.floatingSubmenuHeader}>
              {activeFloatingGroup}
            </div>

            {navigationGroups
              .find(
                (group) =>
                  group.label === activeFloatingGroup,
              )
              ?.items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={styles.floatingSubLink}
                  onClick={handleNavigation}
                >
                  <span className={styles.floatingSubLinkIcon}>
                    <Icon
                      size={16}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>

                  <span>{label}</span>
                </NavLink>
              ))}
          </div>
        )}
    </>
  );
};

export default Sidebar;