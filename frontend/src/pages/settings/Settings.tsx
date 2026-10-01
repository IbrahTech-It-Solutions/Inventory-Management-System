import { useMemo, useState } from "react";
import {
    Building2,
    ChevronRight,
    Globe2,
    Palette,
    ShieldCheck,
    UserRound,
    Warehouse,
} from "lucide-react";
import ThemeUI from "../../components/ui/ThemeUI";
import styles from "./Settings.module.css";
import InstallPWA from "../../components/ui/pwa/InstallPWA";

type UserRole = "admin" | "manager" | "staff" | "customer";

type WarehouseItem = {
    id: string;
    name: string;
    location: string;
    role: string;
    status: "Active" | "Pending";
};

const warehouses: WarehouseItem[] = [
    {
        id: "wh-001",
        name: "Central Warehouse",
        location: "Accra",
        role: "Manager",
        status: "Active",
    },
    {
        id: "wh-002",
        name: "North Distribution",
        location: "Kumasi",
        role: "Staff",
        status: "Active",
    },
];

const Settings = () => {
    const [role] = useState<UserRole>("admin");
    const [language, setLanguage] = useState("English");
    const [activeSection, setActiveSection] = useState("personal");

    const visibleWarehouses = useMemo(() => {
        if (role === "admin") {
            return warehouses;
        }

        return warehouses.filter(
            (warehouse) =>
                warehouse.role.toLowerCase() === role ||
                warehouse.status === "Active",
        );
    }, [role]);

    const sections = [
        {
            id: "personal",
            label: "Personal",
            description: "Manage your personal information",
            icon: UserRound,
        },
        {
            id: "appearance",
            label: "Appearance",
            description: "Customize your interface",
            icon: Palette,
        },
        {
            id: "language",
            label: "Language",
            description: "Choose your preferred language",
            icon: Globe2,
        },
        {
            id: "warehouses",
            label: "Warehouse access",
            description: "Manage your warehouse memberships",
            icon: Warehouse,
        },
    ];

    return (
        <section className={styles.page}>
            <div className={styles.header}>
                <div>
                    <span className={styles.eyebrow}>Settings</span>

                    <h1>Account settings</h1>

                    <p>
                        Manage your account, appearance, language, and warehouse
                        access preferences.
                    </p>
                </div>
            </div>

            <div className={styles.layout}>
                <aside className={styles.sidebar}>
                    <nav
                        className={styles.navigation}
                        aria-label="Settings navigation"
                    >
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;

                            return (
                                <button
                                    key={section.id}
                                    type="button"
                                    className={`${styles.navigationItem} ${
                                        isActive
                                            ? styles.navigationItemActive
                                            : ""
                                    }`}
                                    onClick={() => setActiveSection(section.id)}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    <span className={styles.navigationIcon}>
                                        <Icon size={18} strokeWidth={1.8} />
                                    </span>

                                    <span className={styles.navigationContent}>
                                        <span
                                            className={styles.navigationLabel}
                                        >
                                            {section.label}
                                        </span>

                                        <span
                                            className={
                                                styles.navigationDescription
                                            }
                                        >
                                            {section.description}
                                        </span>
                                    </span>

                                    <ChevronRight
                                        size={16}
                                        className={styles.navigationArrow}
                                        aria-hidden="true"
                                    />
                                </button>
                            );
                        })}
                        {/* <InstallPWA /> */}
                    </nav>
                </aside>

                <div className={styles.content}>
                    {activeSection === "personal" && (
                        <section className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <UserRound size={20} />
                                </div>

                                <div>
                                    <h2>Personal information</h2>
                                    <p>
                                        Manage the information associated with
                                        your InventorySystem account.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.profile}>
                                <div className={styles.avatar}>I</div>

                                <div>
                                    <strong>Inventory User</strong>
                                    <span>inventory@example.com</span>
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.field}>
                                    <label htmlFor="firstName">
                                        First name
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        defaultValue="Inventory"
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="lastName">Last name</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        defaultValue="User"
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="email">Email address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        defaultValue="inventory@example.com"
                                    />
                                </div>

                                <div className={styles.field}>
                                    <label htmlFor="role">Account role</label>
                                    <input
                                        id="role"
                                        type="text"
                                        value={role}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className={styles.cardFooter}>
                                <span>
                                    Profile changes will be saved to your
                                    account.
                                </span>

                                <button
                                    type="button"
                                    className={styles.primaryButton}
                                >
                                    Save changes
                                </button>
                            </div>
                        </section>
                    )}

                    {activeSection === "appearance" && (
                        <section className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <Palette size={20} />
                                </div>

                                <div>
                                    <h2>Appearance</h2>
                                    <p>
                                        Customize how InventorySystem looks on
                                        your device.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.settingRow}></div>
                            <ThemeUI />
                        </section>
                    )}

                    {activeSection === "language" && (
                        <section className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <Globe2 size={20} />
                                </div>

                                <div>
                                    <h2>Language</h2>
                                    <p>
                                        Select the language used throughout the
                                        application.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="language">
                                    Application language
                                </label>

                                <select
                                    id="language"
                                    value={language}
                                    onChange={(event) =>
                                        setLanguage(event.target.value)
                                    }
                                >
                                    <option value="English">English</option>
                                    <option value="French">Français</option>
                                </select>
                            </div>

                            <div className={styles.infoBox}>
                                <Globe2 size={18} />

                                <div>
                                    <strong>Language preferences</strong>
                                    <span>
                                        Language switching is currently prepared
                                        for the future translation system.
                                    </span>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === "warehouses" && (
                        <section className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardIcon}>
                                    <Warehouse size={20} />
                                </div>

                                <div>
                                    <h2>Warehouse access</h2>
                                    <p>
                                        Manage the warehouses connected to your
                                        account.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.accessBanner}>
                                <div className={styles.accessBannerIcon}>
                                    <ShieldCheck size={20} />
                                </div>

                                <div>
                                    <strong>Account access</strong>
                                    <span>
                                        Your available warehouses and
                                        permissions are controlled by your
                                        account role.
                                    </span>
                                </div>
                            </div>

                            <div className={styles.warehouseList}>
                                {visibleWarehouses.map((warehouse) => (
                                    <article
                                        key={warehouse.id}
                                        className={styles.warehouse}
                                    >
                                        <div className={styles.warehouseIcon}>
                                            <Building2 size={19} />
                                        </div>

                                        <div className={styles.warehouseInfo}>
                                            <strong>{warehouse.name}</strong>
                                            <span>{warehouse.location}</span>
                                        </div>

                                        <span
                                            className={`${styles.status} ${
                                                warehouse.status === "Active"
                                                    ? styles.statusActive
                                                    : styles.statusPending
                                            }`}
                                        >
                                            {warehouse.status}
                                        </span>

                                        <span className={styles.warehouseRole}>
                                            {warehouse.role}
                                        </span>

                                        <button
                                            type="button"
                                            className={styles.secondaryButton}
                                        >
                                            Manage
                                        </button>
                                    </article>
                                ))}
                            </div>

                            <div className={styles.joinWarehouse}>
                                <div>
                                    <strong>Join another warehouse</strong>
                                    <span>
                                        Enter a warehouse invitation code to
                                        request access.
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className={styles.primaryButton}
                                >
                                    Join warehouse
                                </button>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Settings;
