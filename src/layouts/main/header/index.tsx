// @mui
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { Box, Stack, AppBar, Toolbar, Link } from "@mui/material";
// hooks
import useOffSetTop from "../../../hooks/useOffSetTop";
// utils
import cssStyles from "../../../utils/cssStyles";
// config
import { HEADER, NAVBAR } from "../../../config";
//
import AccountPopover from "./AccountPopover";
import Searchbar from "./Searchbar";
import SettingsPopover from "./SettingsPopover";
import useSettings from "src/hooks/useSettings";
import NavigationDrawer from "./NavigationDrawer";
import { PATH_MAIN } from "src/routes/paths";

// ----------------------------------------------------------------------

type RootStyleProps = {
  isCollapse: boolean;
  isOffset: boolean;
  verticalLayout: boolean;
};

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) =>
    prop !== "isCollapse" && prop !== "isOffset" && prop !== "verticalLayout",
})<RootStyleProps>(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  ...cssStyles(theme).bgBlur(),
  boxShadow: "none",
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(["width", "height"], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up("lg")]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    // width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
    }),
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
    ...(verticalLayout && {
      width: "100%",
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      backgroundColor: theme.palette.background.default,
    }),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  isCollapse?: boolean;
  verticalLayout?: boolean;
};

export default function DashboardHeader({
  isCollapse = false,
  verticalLayout = false,
}: Props) {
  const isOffset =
    useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;
  const settings = useSettings();

  return (
    <RootStyle
      isCollapse={isCollapse}
      isOffset={isOffset}
      verticalLayout={verticalLayout}
    >
      <Toolbar
        sx={{
          minHeight: "100% !important",
          px: { lg: 5 },
        }}
      >
        {settings.themeMode === "dark" ? (
          <Link href={PATH_MAIN.root}>
            <Image
              alt={"Logo"}
              src="/logo_fondo_oscuro.svg"
              width={200}
              height={51}
            />
          </Link>
        ) : (
          <Link href={PATH_MAIN.root}>
            <Image
              alt={"Logo"}
              src="/logo_fondo_claro.svg"
              width={200}
              height={51}
            />
          </Link>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{ xs: 1.5, sm: 2.5 }}
        >
          <Searchbar />
          <NavigationDrawer />
          <AccountPopover />
          <SettingsPopover />
        </Stack>
      </Toolbar>
    </RootStyle>
  );
}
