// @mui
import Image from "next/image";
import { styled } from "@mui/material/styles";
import { Box, Stack, AppBar, Toolbar, Link } from "@mui/material";
// next
import NextLink from "next/link";
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
import { Palette } from "@mui/material";
import useResponsive from "src/hooks/useResponsive";

// ----------------------------------------------------------------------

type RootStyleProps = {
  isCollapse: boolean;
  isOffset: boolean;
  verticalLayout: boolean;
};

type PaletteExtended = Palette & {
  header: string;
};

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) =>
    prop !== "isCollapse" && prop !== "isOffset" && prop !== "verticalLayout",
})<RootStyleProps>(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  ...cssStyles(theme).bgBlur({
    opacity: 0.3,
    color: (theme.palette as PaletteExtended).header,
  }),
  boxShadow: "none",
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(["width", "height"], {
    duration: theme.transitions.duration.shorter,
  }),
  backgroundColor: (theme.palette as PaletteExtended).header,
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
  const isDesktop = useResponsive("up", "md");

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
        <Stack width="100%" maxWidth={1200} margin="auto">
          <Stack direction="row">
            {settings.themeMode === "dark" ? (
              <NextLink href={PATH_MAIN.root} passHref>
                <Link>
                  <Image
                    alt={"Logo"}
                    src="/logo_fondo_oscuro.svg"
                    width={200}
                    height={61}
                  />
                </Link>
              </NextLink>
            ) : (
              <NextLink href={PATH_MAIN.root} passHref>
                <Link>
                  <Image
                    alt={"Logo"}
                    src="/logo_fondo_claro.svg"
                    width={200}
                    height={61}
                  />
                </Link>
              </NextLink>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 1.5, sm: 2.5 }}
            >
              {isDesktop && <Searchbar />}
              <NavigationDrawer isOffset={isOffset} />
              <Stack direction="row" spacing={0.5}>
                <AccountPopover />
                <SettingsPopover />
              </Stack>
            </Stack>
          </Stack>
          {!isDesktop && (
            <Stack width="100%" alignItems="center">
              <Searchbar />
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </RootStyle>
  );
}
