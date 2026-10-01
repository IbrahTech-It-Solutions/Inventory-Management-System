import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";

type PrimaryColor = {
  name: string;
  value: string;
};

type ThemeContextValue = {
  theme: Theme;
  primaryColor: PrimaryColor;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setPrimaryColor: (color: PrimaryColor) => void;
};

const THEME_STORAGE_KEY = "inventory-theme";
const PRIMARY_COLOR_STORAGE_KEY = "inventory-primary-color";

const DEFAULT_PRIMARY_COLOR: PrimaryColor = {
  name: "Blue",
  value: "#2563eb",
};

const getInitialTheme = (): Theme => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getInitialPrimaryColor = (): PrimaryColor => {
  const storedColor = localStorage.getItem(
    PRIMARY_COLOR_STORAGE_KEY,
  );

  if (!storedColor) {
    return DEFAULT_PRIMARY_COLOR;
  }

  try {
    const parsedColor = JSON.parse(storedColor);

    if (
      typeof parsedColor?.name === "string" &&
      typeof parsedColor?.value === "string"
    ) {
      return parsedColor;
    }
  } catch {
    return DEFAULT_PRIMARY_COLOR;
  }

  return DEFAULT_PRIMARY_COLOR;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({
  children,
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [primaryColor, setPrimaryColorState] =
    useState<PrimaryColor>(getInitialPrimaryColor);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--color-primary",
      primaryColor.value,
    );

    localStorage.setItem(
      PRIMARY_COLOR_STORAGE_KEY,
      JSON.stringify(primaryColor),
    );
  }, [primaryColor]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light",
    );
  }, []);

  const setPrimaryColor = useCallback(
    (color: PrimaryColor) => {
      setPrimaryColorState(color);
    },
    [],
  );

  const value = useMemo(
    () => ({
      theme,
      primaryColor,
      setTheme,
      toggleTheme,
      setPrimaryColor,
    }),
    [
      theme,
      primaryColor,
      toggleTheme,
      setPrimaryColor,
    ],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider.",
    );
  }

  return context;
};