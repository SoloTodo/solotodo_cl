import {SettingsValueProps} from "./components/settings/type";
import {apiSettings} from "./frontend-utils/settings";

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
    GA4Id: "G-0687ZFVHJ3",
    LGGA4Id: "G-4L2SY5PK0B",
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
                    labelField: "commercial_model",
                    orderingField: "commercial_model",
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
    blacklistStores: [
        87, // Hites
        181, // Tienda Entel
        223, // Samsung Shop
        225, // ML Samsung
    ],
    sodimacId: 67,
    sodimacWhitelistedKeys: ['110007027', '110007301', '110007607', '110007115', '110008247', '110496567', '110007896', '112706732', '110007680', '110383977', '110008106', '110008006', '110081076', '110006007', '110008597', '110008986', '110009352', '110004823', '110008418', '110007363', '110004606', '110005226', '110006047', '110166797', '110163988', '110156325', '110148158', '110003611', '110004318', '110002793', '110003380', '110002648', '110006379', '110004843', '110032338', '110051853', '110049681', '110049838', '110170173', '110582014', '112709497', '112704887', '112705870', '110477151', '110006253', '110081088', '110006671', '110005660', '113220650', '110087492', '110266150', '114108355', '113683897', '113683506', '113951522', '110375477', '114482331', '110008734', '110580069', '116034735', '113698549', '110006387', '116584638', '114481722', '114483553', '113356881', '110410478', '119466974', '119749645', '119750735', '110002756', '110003850', '120385941', '119920309', '116036014', '110003139', '120965669', '121384023', '120708422', '121749605', '121749607', '121749652', '123326866', '123142648', '123142714', '123155822', '123156391', '124658124', '124404484', '124558750', '124558754', '124558756', '124558758', '126061507', '126061505', '126648411', '120740810', '123828774', '127029476', '127789173', '127303259', '110023033', '110380815', '119118836', '110651855', '110006541', '110728595', '126202740', '116034996', '114108903', '110005841', '110006274', '110004783', '115579751', '110004634', '110005328', '110006210', '128132554', '128132556', '128112104', '128132528', '128132580', '128112108', '128737833', '128112115', '128693500', '128284910', '127233513', '129678293', '129089010', '113495160', '126716629', '129230276', '130599088', '126305971', '130691332', '130561825', '130583382', '132106787', '131703842', '131703829', '130537576', '133537621', '133595748', '133537849', '133391355', '110003578', '134035023', '133846573', '133393949', '135929588', '136235890', '133218042', '136074052', '135908959', '132613981', '135398465', '137521298', '137521310', '133393955', '110015118', '110007022', '110003820', '136889456', '110008462', '110020083', '133942222', '133592017', '112821741', '110010228', '133909499', '112821653', '131754861', '110003940', '133942218', '131754869', '110007577', '133942220', '127288330', '110461996', '110372720', '135476242', '138434907', '138434903', '138867469', '110373893', '110371798', '110270519', '110007289', '138697310', '112821721', '136695074', '139690500', '139642331', '139765406', '139812713', '139812831', '139556328', '139653190', '139923574', '139748128', '140134902', '139720997', '139560016', '139721273', '137920738', '139345649', '139642152', '140778770', '141059903', '139806472', '139806457', '141359009', '141359007', '141359005', '140764477', '140764479', '140764475', '140764487', '140810816', '140824010', '140810814', '135651557', '141537894', '140778768', '141537566', '141537892', '141648121', '139920997', '142237353', '142237355', '143023801', '143037334', '110685363', '110685372', '131703112', '143119750', '143082676', '143369277', '143369275', '143428704', '143430006', '143429231', '143369267', '143369271', '143369269', '143369273', '143104618', '143833968', '140489753', '140489749', '140489786', '141360115', '143306812', '143916552']
};
