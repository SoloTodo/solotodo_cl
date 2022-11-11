import * as Yup from "yup";
// @mui
import Image from "next/image";
import { styled } from "@mui/material/styles";
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  Link,
  Input,
  InputAdornment,
  ClickAwayListener,
  useTheme,
} from "@mui/material";
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
import SettingsPopover from "./SettingsPopover";
import useSettings from "src/hooks/useSettings";
import NavigationDrawer from "./NavigationDrawer";
import { PATH_MAIN } from "src/routes/paths";
import { Palette } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/router";
import useResponsive from "src/hooks/useResponsive";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Iconify from "src/components/Iconify";
import { FormProvider } from "src/components/hook-form";
import { IconButtonAnimate } from "src/components/animate";

// ----------------------------------------------------------------------

type RootStyleProps = {
  isCollapse: boolean;
  isOffset: boolean;
  verticalLayout: boolean;
};

type PaletteExtended = Palette & {
  header: string;
};

type FormValuesProps = {
  search: string;
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
  // height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(["width", "height"], {
    duration: theme.transitions.duration.shorter,
  }),
  backgroundColor: (theme.palette as PaletteExtended).header,
  [theme.breakpoints.up("md")]: {
    // height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
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
  const theme = useTheme();
  const [isOpen, setOpen] = useState(false);
  const [keywords, setKeywords] = useState("");
  const router = useRouter();
  const isDesktop = useResponsive("up", "md");

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const SearchSchema = Yup.object().shape({
    search: Yup.string(),
  });

  const defaultValues = {
    search: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(SearchSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = () => {
    window.scrollTo(0, 0);
    router.push(
      `/search?search=${encodeURIComponent(keywords)}`,
      `/search?search=${encodeURIComponent(keywords)}`
    );
  };

  const SearchInput = (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Input
        name="search"
        disableUnderline
        placeholder="Busca un producto"
        endAdornment={
          <InputAdornment position="end">
            <Iconify
              icon={"eva:search-fill"}
              sx={{ color: "text.disabled", width: 20, height: 20 }}
            />
          </InputAdornment>
        }
        sx={{
          fontWeight: "fontWeightBold",
          paddingY: 0.5,
          paddingX: 1,
          display: "flex",
          width: isDesktop ? 300 : "100%",
          borderRadius: "4px",
          border:
            settings.themeMode === "dark"
              ? "1px solid rgba(255, 255, 255, 0.23)"
              : "1px solid rgba(0, 0, 0, 0.23)",
          // backgroundColor: "background.default",
          ...cssStyles(theme).bgBlur({
            opacity: 0.3,
            color: theme.palette.background.default,
          }),
        }}
        onChange={(evt) => setKeywords(evt.target.value)}
      />
    </FormProvider>
  );

  const logoWidth = isDesktop ? 200 : 100;
  const logoHeight = isDesktop ? 50 : 32;

  return (
    <ClickAwayListener onClickAway={handleClose}>
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
          <Stack
            width="100%"
            maxWidth={1200}
            paddingY={{ xs: 2, md: 1 }}
            margin="auto"
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={{ xs: 0.5, sm: 3 }}
            >
              {settings.themeMode === "dark" ? (
                <NextLink href={PATH_MAIN.root} passHref>
                  <Link>
                    <Image
                      alt={"Logo"}
                      src="/logo_fondo_oscuro.svg"
                      width={logoWidth}
                      height={logoHeight}
                    />
                  </Link>
                </NextLink>
              ) : (
                <NextLink href={PATH_MAIN.root} passHref>
                  <Link>
                    <Image
                      alt={"Logo"}
                      src="/logo_fondo_claro.svg"
                      width={logoWidth}
                      height={logoHeight}
                    />
                  </Link>
                </NextLink>
              )}

              <Box sx={{ flexGrow: 1 }} />

              {isDesktop ? (
                <>
                  {SearchInput}
                  <NavigationDrawer />
                  <Stack direction="row" spacing={0}>
                    <AccountPopover />
                    <SettingsPopover />
                  </Stack>
                </>
              ) : (
                <>
                  <IconButtonAnimate onClick={handleOpen}>
                    <Iconify icon={"eva:search-fill"} width={20} height={20} />
                  </IconButtonAnimate>
                  <AccountPopover />
                  <SettingsPopover />
                  <NavigationDrawer />
                </>
              )}
            </Stack>
            {!isDesktop && isOpen && <Box paddingTop={1}>{SearchInput}</Box>}
          </Stack>
        </Toolbar>
      </RootStyle>
    </ClickAwayListener>
  );
}
