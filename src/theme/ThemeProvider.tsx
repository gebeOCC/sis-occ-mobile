import type { ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SystemUI from "expo-system-ui";
import { colorScheme as nativeColorScheme, useColorScheme, vars } from "nativewind";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { View, type ColorValue } from "react-native";
import { dark, flattenColors, light } from "./themes";

export type ThemeMode = "system" | "light" | "dark";
export type ThemeScheme = "light" | "dark";
type Palette = typeof light;
type ThemeContextValue = {
  mode: ThemeMode;
  scheme: ThemeScheme;
  colors: Palette;
  setMode: (next: ThemeMode) => void;
  resolveColor: (value: ColorValue) => ColorValue;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "student-portal-appearance";
const MODES: readonly ThemeMode[] = ["system", "light", "dark"];
const isThemeMode = (value: string | null): value is ThemeMode =>
  MODES.some((mode) => mode === value);

const palettes = { light, dark };
// flattenColors is shared with the CommonJS Tailwind config.
const flattenPalette = (palette: Palette) => flattenColors(palette) as Record<string, string>;
const flatLight = flattenPalette(light);

function createVariables(palette: Palette) {
  return vars(
    Object.fromEntries(
      Object.entries(flattenPalette(palette)).map(([name, hex]) => [
        `--${name}`,
        hex
          .slice(1)
          .match(/.{2}/g)!
          .map((part) => parseInt(part, 16))
          .join(" "),
      ]),
    ),
  );
}

const themeStyles = {
  light: createVariables(light),
  dark: createVariables(dark),
};

// Preserve literal white used by file icons.
// Other existing palette colors follow the selected theme.
const colorMaps: Record<string, Record<string, string>> = Object.fromEntries(
  Object.entries(palettes).map(([scheme, palette]) => {
    const flat = flattenPalette(palette);

    return [
      scheme,
      Object.fromEntries(
        Object.entries(flatLight)
          .filter(([, value]) => value.toUpperCase() !== "#FFFFFF")
          .map(([name, value]) => [value.toUpperCase(), flat[name]]),
      ),
    ];
  }),
);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme } = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [ready, setReady] = useState(false);

  const scheme = mode === "system" ? (colorScheme ?? "light") : mode;

  const colors = palettes[scheme];

  useEffect(() => {
    let active = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (!active) return;

        const preference = isThemeMode(saved) ? saved : "system";

        setModeState(preference);
        nativeColorScheme.set(preference);
      })
      .catch(() => {
        // Continue with the system theme if storage is unavailable.
      })
      .finally(() => {
        if (active) setReady(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

  const setMode = useCallback((next: ThemeMode) => {
    if (!MODES.includes(next)) return;

    setModeState(next);
    nativeColorScheme.set(next);

    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {
      console.warn("Could not save the appearance preference.");
    });
  }, []);

  const resolveColor = useCallback(
    (value: ColorValue) => {
      if (value === "contrast") return palettes[scheme].contrast;

      return typeof value === "string" ? (colorMaps[scheme][value.toUpperCase()] ?? value) : value;
    },
    [scheme],
  );

  if (!ready) return null;

  return (
    <ThemeContext.Provider value={{ mode, scheme, colors, setMode, resolveColor }}>
      <View style={[themeStyles[scheme], { flex: 1, backgroundColor: colors.background }]}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be inside AppThemeProvider.");
  }

  return context;
}
