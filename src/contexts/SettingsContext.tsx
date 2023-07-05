import Cookies from "js-cookie";
import {
  ReactNode,
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
// utils
import getColorPresets, {
  colorPresets,
  defaultPreset,
} from "../utils/getColorPresets";
// @type
import {
  ThemeMode,
  ThemeLayout,
  ThemeDirection,
  ThemeColorPresets,
  SettingsContextProps,
  SettingsValueProps,
} from "../components/settings/type";
// config
import {
  defaultSettings,
  cookiesKey,
  cookiesExpires,
  constants,
} from "../config";

// ----------------------------------------------------------------------

const initialState: SettingsContextProps = {
  ...defaultSettings,
  onChangeMode: () => {},
  onToggleMode: () => {},
  onChangeDirection: () => {},
  onChangeColor: () => {},
  onToggleStretch: () => {},
  onChangeLayout: () => {},
  onResetSetting: () => {},
  onToggleExcludeRefurbished: () => {},
  onChangeStores: () => {},
  setColor: defaultPreset,
  colorOption: [],
  unfilteredPrefStores: [],
};

const SettingsContext = createContext(initialState);

type SettingsProviderProps = {
  children: ReactNode;
  defaultSettings: SettingsValueProps;
};

function SettingsProvider({
  children,
  defaultSettings = {} as SettingsValueProps,
}: SettingsProviderProps) {
  const [settings, setSettings] = useSettingCookies(defaultSettings);

  const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeMode: (event.target as HTMLInputElement).value as ThemeMode,
    });
  };

  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === "light" ? "dark" : "light",
    });
  };

  const onChangeDirection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeDirection: (event.target as HTMLInputElement)
        .value as ThemeDirection,
    });
  };

  const onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeColorPresets: (event.target as HTMLInputElement)
        .value as ThemeColorPresets,
    });
  };

  const onChangeLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeLayout: (event.target as HTMLInputElement).value as ThemeLayout,
    });
  };

  const onToggleStretch = () => {
    setSettings({
      ...settings,
      themeStretch: !settings.themeStretch,
    });
  };

  const onResetSetting = () => {
    setSettings({
      themeMode: initialState.themeMode,
      themeLayout: initialState.themeLayout,
      themeStretch: initialState.themeStretch,
      themeDirection: initialState.themeDirection,
      themeColorPresets: initialState.themeColorPresets,
      prefExcludeRefurbished: initialState.prefExcludeRefurbished,
      prefStores: initialState.prefStores,
      prefStoresLastUpdate: initialState.prefStoresLastUpdate,
    });
  };

  const onToggleExcludeRefurbished = () => {
    setSettings({
      ...settings,
      prefExcludeRefurbished: !settings.prefExcludeRefurbished,
    });
  };

  const onChangeStores = (newStores: string[]) => {
    setSettings({
      ...settings,
      prefStores: newStores,
      prefStoresLastUpdate: new Date()?.toISOString(),
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        unfilteredPrefStores: settings.prefStores,
        prefStores: settings.prefStores,
        // Mode
        onChangeMode,
        onToggleMode,
        // Direction
        onChangeDirection,
        // Color
        onChangeColor,
        setColor: getColorPresets(settings.themeColorPresets),
        colorOption: colorPresets.map((color) => ({
          name: color.name,
          value: color.main,
        })),
        // Stretch
        onToggleStretch,
        // Navbar Horizontal
        onChangeLayout,
        // Reset Setting
        onResetSetting,
        // User Preferences
        onToggleExcludeRefurbished,
        onChangeStores,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider, SettingsContext };

// ----------------------------------------------------------------------

function useSettingCookies(
  defaultSettings: SettingsValueProps
): [SettingsValueProps, Dispatch<SetStateAction<SettingsValueProps>>] {
  const [settings, setSettings] = useState<SettingsValueProps>(defaultSettings);

  const onChangeSetting = () => {
    Cookies.set(cookiesKey.themeMode, settings.themeMode, {
      expires: cookiesExpires,
    });

    Cookies.set(cookiesKey.themeDirection, settings.themeDirection, {
      expires: cookiesExpires,
    });

    Cookies.set(cookiesKey.themeColorPresets, settings.themeColorPresets, {
      expires: cookiesExpires,
    });

    Cookies.set(cookiesKey.themeLayout, settings.themeLayout, {
      expires: cookiesExpires,
    });

    Cookies.set(
      cookiesKey.themeStretch,
      JSON.stringify(settings.themeStretch),
      {
        expires: cookiesExpires,
      }
    );

    Cookies.set(
      cookiesKey.prefExcludeRefurbished,
      JSON.stringify(settings.prefExcludeRefurbished),
      {
        expires: cookiesExpires,
      }
    );

    Cookies.set(cookiesKey.prefStores, settings.prefStores.join("|"), {
      expires: cookiesExpires,
    });

    Cookies.set(
      cookiesKey.prefStoresLastUpdate,
      typeof settings.prefStoresLastUpdate === "undefined"
        ? ""
        : settings.prefStoresLastUpdate,
      {
        expires: cookiesExpires,
      }
    );
  };

  useEffect(() => {
    onChangeSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  return [settings, setSettings];
}
