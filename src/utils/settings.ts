// next
import { formatISO, isValid } from "date-fns";
import { NextApiRequestCookies } from "next/dist/server/api-utils";
// config
import { defaultSettings, cookiesKey } from "../config";

// ----------------------------------------------------------------------

export const getSettings = (cookies: NextApiRequestCookies) => {
  const themeMode =
    getData(cookies[cookiesKey.themeMode]) || defaultSettings.themeMode;

  const themeDirection =
    getData(cookies[cookiesKey.themeDirection]) ||
    defaultSettings.themeDirection;

  const themeColorPresets =
    getData(cookies[cookiesKey.themeColorPresets]) ||
    defaultSettings.themeColorPresets;

  const themeLayout =
    getData(cookies[cookiesKey.themeLayout]) || defaultSettings.themeLayout;

  const themeStretch =
    getDataBool(cookies[cookiesKey.themeStretch]) ??
    defaultSettings.themeStretch;

  const prefExcludeRefurbished =
    getDataBool(cookies[cookiesKey.prefExcludeRefurbished]) ??
    defaultSettings.prefExcludeRefurbished;

  const prefStores =
    getDataArray(cookies[cookiesKey.prefStores]) ?? defaultSettings.prefStores;

  const prefStoresLastUpdate =
    getDataDate(cookies[cookiesKey.prefStoresLastUpdate]) ||
    defaultSettings.prefStoresLastUpdate;

  return {
    themeMode,
    themeDirection,
    themeColorPresets,
    themeLayout,
    themeStretch,
    prefExcludeRefurbished,
    prefStores,
    prefStoresLastUpdate,
  };
};

// ----------------------------------------------------------------------

const getData = (value: string) => {
  if (value === "undefined" || !value) {
    return undefined;
  }
  return value;
};

const getDataBool = (value: string) => {
  if (value === "true" || value === "false") {
    return JSON.parse(value);
  }
  return undefined;
};

const getDataArray = (value: string) => {
  if (value === "undefined" || !value) {
    return [];
  }
  return value.split("|");
};

const getDataDate = (value: string) => {
  if (value === "undefined" || !value || !isValid(new Date(value))) {
    return formatISO(new Date(1970, 1, 1));
  } else {
    return formatISO(new Date(value));
  }
};
