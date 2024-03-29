import { ReactNode, useEffect } from "react";
// @mui
import { styled } from "@mui/material/styles";
import { Box, Stack } from "@mui/material";
// hooks
import useSettings from "../../hooks/useSettings";
import useCollapseDrawer from "../../hooks/useCollapseDrawer";
// config
import { cookiesKey, HEADER, NAVBAR } from "../../config";
//
import MainHeader from "./header";
import MainFooter from "./footer";
import Cookies from "js-cookie";

// ----------------------------------------------------------------------

type MainStyleProps = {
  collapseClick: boolean;
};

const MainStyle = styled("main", {
  shouldForwardProp: (prop) => prop !== "collapseClick",
})<MainStyleProps>(({ collapseClick, theme }) => ({
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT - 24,
  paddingBottom: HEADER.MOBILE_HEIGHT + 24,
  [theme.breakpoints.up("md")]: {
    paddingTop: HEADER.MOBILE_HEIGHT - 16,
  },
  [theme.breakpoints.up("lg")]: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 16,
    paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create("margin-left", {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const { collapseClick, isCollapse } = useCollapseDrawer();

  const { themeLayout, themeMode, onToggleMode } = useSettings();

  const verticalLayout = themeLayout === "vertical";

  useEffect(() => {
    if (typeof window !== "undefined" && !Cookies.get(cookiesKey.themeMode)) {
      const mediaQuery = "(prefers-color-scheme: dark)";
      const mql = window.matchMedia(mediaQuery);
      mql.matches && themeMode === "light" && onToggleMode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (verticalLayout) {
    return (
      <>
        <MainHeader verticalLayout={verticalLayout} />

        <Box
          component="main"
          sx={{
            px: { lg: 2 },
            pt: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
            },
            pb: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 24}px`,
            },
          }}
        >
          {children}
        </Box>
      </>
    );
  }

  return (
    <Stack sx={{ minHeight: 1 }}>
      <Box
        sx={{
          display: { lg: "flex" },
          alignItems: "center",
        }}
      >
        <MainHeader isCollapse={isCollapse} />
        <MainStyle collapseClick={collapseClick}>{children}</MainStyle>
      </Box>
      <MainFooter />
    </Stack>
  );
}
