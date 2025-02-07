import { SettingsValueProps } from "./components/settings/type";
import { apiSettings } from "./frontend-utils/settings";

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  MOBILE_HEIGHT: 120,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 72,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 72 - 4,
};

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
};

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20,
};

// SETTINGS
// ----------------------------------------------------------------------

export const cookiesExpires = 30;

export const cookiesKey = {
  themeMode: "themeMode",
  themeDirection: "themeDirection",
  themeColorPresets: "themeColorPresets",
  themeLayout: "themeLayout",
  themeStretch: "themeStretch",
  prefExcludeRefurbished: "prefExcludeRefurbished",
  prefStores: "prefStores",
  prefStoresLastUpdate: "prefStoresLastUpdate",
  refurbishedReminder: "refurbishedReminder",
};

export const defaultSettings: SettingsValueProps = {
  themeMode: "light",
  themeDirection: "ltr",
  themeColorPresets: "orange",
  themeLayout: "horizontal",
  themeStretch: true,
  prefExcludeRefurbished: false,
  prefStores: [],
  prefStoresLastUpdate: "",
};

// CONSTANTS
// ----------------------------------------------------------------------
export const constants = {
  ...apiSettings,
  chileId: 1,
  defaultCountryUrl: apiSettings.apiResourceEndpoints.countries + "1/",
  detailPurposeUrl: apiSettings.endpoint + "category_template_purposes/1/",
  disqusShortName: "solotodo3",
  domain: "https://www.solotodo.cl",
  GA3Id: "UA-11970222-11",
  GA4Id: "G-0687ZFVHJ3",
  facebookAppId: "567644670062006",
  googleClientId: '667454460630-kh9ftl1coegf5k0v7ueigor8gg95q6qd.apps.googleusercontent.com',
  websiteId: 2,
  benchmarkCategories: {
    1: [
      {
        label: "Aplicaciones",
        field: "score_general",
        maxValue: 1000,
      },
      {
        label: "Gaming",
        field: "score_games",
        maxValue: 1000,
      },
      {
        label: "Movilidad",
        field: "score_mobility",
        maxValue: 1000,
      },
    ],
    2: [
      {
        label: "3DMark Time Spy",
        field: "gpu_tdmark_time_spy_score",
        maxValue: 30000,
      },
      {
        label: "3DMark Port Royal (Ray tracing)",
        field: "gpu_tdmark_port_royal_score",
        maxValue: 27000,
      },
      {
        label: "3DMark VR Room Orange (VR)",
        field: "gpu_tdmark_vr_room_orange_score",
        maxValue: 17000,
      },
    ],
    3: [
      {
        label: "PCMark 10",
        field: "pcmark_10_score",
        maxValue: 9000,
      },
      {
        label: "Cinebench R20 (Multi core)",
        field: "cinebench_r20_multi_score",
        maxValue: 15000,
      },
      {
        label: "Passmark",
        field: "passmark_score",
        maxValue: 80000,
      },
    ],
    6: [
      {
        label: "Rendimiento general",
        field: "general_score",
        maxValue: 1000,
      },
      {
        label: "Rendimiento en gaming",
        field: "soc_gpu_gfx_bench_score",
        maxValue: 10000,
      },
    ],
    14: [
      {
        label: "Rendimiento general",
        field: "general_score",
        maxValue: 1000,
      },
      {
        label: "Juegos (GFX Bench)",
        field: "soc_gpu_gfx_bench_score",
        maxValue: 1000,
      },
    ],
  },
  bucketCategories: {
    6: {
      fields: "base_model_id",
      axes: [
        {
          label: "Color",
          labelField: "color_unicode",
          orderingField: "color_unicode",
        },
        {
          label: "Capacidad / RAM",
          labelField: "storage_and_ram",
          orderingField: "internal_storage_value",
        },
      ],
    },
    14: {
      fields: "base_model_id",
      axes: [
        {
          label: "Color",
          labelField: "color_unicode",
          orderingField: "color_unicode",
        },
        {
          label: "Capacidad",
          labelField: "internal_storage_unicode",
          orderingField: "internal_storage_value",
        },
        {
          label: "Conectividad celular",
          labelField: "cell_connectivity_unicode",
          orderingField: "cell_connectivity_unicode",
        },
      ],
    },
    3: {
      fields: "core_architecture_id,line_id",
      axes: [
        {
          label: "Modelo",
          labelField: "unicode",
          orderingField: "unicode",
        },
      ],
    },
    48: {
      fields: "base_model_id",
      axes: [
        {
          label: "Color",
          labelField: "color_unicode",
          orderingField: "color_unicode",
        },
      ],
    },
    2: {
      fields: "brand_id,gpu_id",
      axes: [
        {
          label: "Memoria",
          labelField: "memory_quantity_unicode",
          orderingField: "memory_quantity_value",
        },
        {
          label: "Modelo",
          labelField: "commercial_name",
          orderingField: "commercial_name",
          directLink: true,
        },
      ],
    },
  },
  categoryBrowseParameters: {
    6: {
      bucketField: "specs.base_model_internal_storage_ram_key",
      bucketProductLabelField: "color_unicode",
    },
    14: {
      bucketField: "specs.base_model_internal_storage_cell_connectivity_key",
      bucketProductLabelField: "color_unicode",
    },
  },
  blacklistStores: [9, 87, 181],
};
