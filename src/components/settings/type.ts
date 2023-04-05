// ----------------------------------------------------------------------

export type ThemeMode = 'light' | 'dark';
export type ThemeDirection = 'rtl' | 'ltr';
export type ThemeColorPresets = 'default' | 'purple' | 'cyan' | 'blue' | 'orange' | 'red';
export type ThemeLayout = 'vertical' | 'horizontal';
export type ThemeStretch = boolean;
export type PrefExcludeRefurbished = boolean;
export type PrefStores = string[];
export type PrefStoresLastUpdate = string | undefined;

type ColorVariants = {
  name: string;
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrastText: string;
};

export type SettingsValueProps = {
  themeMode: ThemeMode;
  themeDirection: ThemeDirection;
  themeColorPresets: ThemeColorPresets;
  themeStretch: ThemeStretch;
  themeLayout: ThemeLayout;
  prefExcludeRefurbished: PrefExcludeRefurbished;
  prefStores: PrefStores;
  prefStoresLastUpdate: PrefStoresLastUpdate;
};

export type SettingsContextProps = {
  themeMode: ThemeMode;
  themeDirection: ThemeDirection;
  themeColorPresets: ThemeColorPresets;
  themeLayout: ThemeLayout;
  themeStretch: boolean;
  prefExcludeRefurbished: boolean;
  prefStores: PrefStores;
  prefStoresLastUpdate: PrefStoresLastUpdate;
  unfilteredPrefStores: PrefStores;
  setColor: ColorVariants;
  colorOption: {
    name: string;
    value: string;
  }[];
  onToggleExcludeRefurbished: VoidFunction;
  onToggleMode: VoidFunction;
  onToggleStretch: VoidFunction;
  onResetSetting: VoidFunction;
  onChangeMode: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDirection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeLayout: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeStores: (newStores: string[]) => void;
};
