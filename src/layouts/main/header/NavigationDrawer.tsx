import { ReactNode, useState } from "react";
import NextLink from "next/link";
import {
  Stack,
  Button,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Link,
  useTheme,
  Grid,
} from "@mui/material";
import { NavigationProps } from "src/contexts/NavigationContext";
import useNavigation from "src/hooks/useNavigation";
import Iconify from "src/components/Iconify";
import useResponsive from "src/hooks/useResponsive";
import { IconButtonAnimate } from "src/components/animate";
import { HEADER } from "src/config";
import useSettings from "src/hooks/useSettings";

export default function NavigationDrawer({ inFooter = false }) {
  const settings = useSettings();
  const navigation = useNavigation();
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  const isDesktop = useResponsive("up", "lg");
  const isMobile = useResponsive("down", "md");
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [menu, setMenu] = useState<NavigationProps | null>(null);

  const openDrawer = (i: number) => {
    setMenu(navigation[i]);
    setOpen(true);
    setOpenMenu(false);
  };

  const closeDrawer = () => {
    setOpen(false);
    setOpenMenu(false);
    setMenu(null);
  };

  const buttons = navigation.map((n, index) => (
    <Button
      key={index}
      variant="text"
      sx={{
        color: settings.themeMode === "light" ? "#303D53" : "text.primary",
        fontWeight: 400,
      }}
      onClick={() => openDrawer(index)}
    >
      {n.name}
    </Button>
  ));

  const textButtons = navigation.map((n, index) => (
    <Link
      key={index}
      color="inherit"
      variant="body2"
      sx={{ display: "block" }}
      onClick={() => openDrawer(index)}
    >
      {n.name}
    </Link>
  ));

  const CustomList = ({ children }: { children: ReactNode }) =>
    isMobile ? (
      <List dense>{children}</List>
    ) : (
      <List dense component={Grid} container direction="row">
        {children}
      </List>
    );

  return <>
    {inFooter ? (
      textButtons
    ) : isDesktop ? (
      <Stack direction="row" spacing={2}>
        {buttons}
      </Stack>
    ) : (
      <>
        <IconButtonAnimate onClick={() => setOpenMenu(true)}>
          {open || openMenu ? (
            <Iconify icon={"eva:close-fill"} />
          ) : (
            <Iconify icon={"eva:menu-fill"} />
          )}
        </IconButtonAnimate>
      </>
    )}
    <Drawer
      anchor={isMobile ? "left" : "top"}
      open={openMenu}
      onClose={closeDrawer}
      PaperProps={{ sx: { backgroundColor: "transparent" } }}
    >
      <Box
        pt={{
          xs: `${HEADER.DASHBOARD_DESKTOP_HEIGHT}px`,
          md: `${HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT}px`,
        }}
        bgcolor="transparent"
        onClick={closeDrawer}
      />
      <Box
        width={isMobile ? { xs: 250, lg: 300 } : "100%"}
        bgcolor={isLight ? "background.default" : "background.paper"}
        overflow="auto"
      >
        <CustomList>
          {navigation.map((s, index) => (
            <ListItemButton
              key={index}
              sx={{
                textTransform: "capitalize",
                paddingY: isMobile ? 2 : 4,
              }}
              onClick={() => openDrawer(index)}
            >
              <ListItemText primaryTypographyProps={{ typography: "h5" }}>
                {s.name}
              </ListItemText>
              {isMobile && (
                <Box
                  component={Iconify}
                  icon={"eva:arrow-ios-forward-fill"}
                />
              )}
            </ListItemButton>
          ))}
        </CustomList>
      </Box>
      <Box
        flexGrow={1}
        bgcolor={isLight ? "background.default" : "background.paper"}
      />
    </Drawer>
    <Drawer
      anchor={isMobile ? "left" : "top"}
      open={open}
      onClose={closeDrawer}
      PaperProps={{ sx: { backgroundColor: "transparent" } }}
    >
      <Box
        pt={{
          xs: `${HEADER.DASHBOARD_DESKTOP_HEIGHT}px`,
          md: `${HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT}px`,
        }}
        bgcolor="transparent"
        onClick={closeDrawer}
      />
      <Box
        width={isMobile ? { xs: 250, lg: 300 } : "100%"}
        bgcolor={isLight ? "background.default" : "background.paper"}
        overflow="auto"
      >
        <CustomList>
          {menu?.sections.map((s, index) => (
            <Box
              key={index}
              sx={{
                width: isMobile ? "100%" : 250,
                paddingTop: 4,
                paddingLeft: 4,
              }}
            >
              {s.path === "/" ? (
                <Link
                  sx={{ textTransform: "capitalize" }}
                  underline="none"
                  color="text.disabled"
                >
                  <ListItemText
                    primaryTypographyProps={{
                      typography: "h5",
                      fontWeight: 500,
                    }}
                  >
                    {s.name}
                  </ListItemText>
                </Link>
              ) : (
                <NextLink href={`${s.path}`} passHref legacyBehavior>
                  <Link
                    sx={{
                      textTransform: "capitalize",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      ":hover": {
                        color: "secondary.main",
                      },
                    }}
                    color="text.title"
                    onClick={closeDrawer}
                  >
                    <ListItemText
                      primaryTypographyProps={{
                        typography: "h5",
                        fontWeight: 500,
                      }}
                    >
                      {s.name}
                    </ListItemText>
                    {isMobile && (
                      <Box
                        component={Iconify}
                        icon={"eva:arrow-ios-forward-fill"}
                      />
                    )}
                  </Link>
                </NextLink>
              )}
              <List dense sx={{ padding: 0 }}>
                {s.items.map((i) => (
                  <ListItem
                    key={`${s.name}-${i.name}`}
                    sx={{ paddingLeft: 0, paddingTop: 1 }}
                  >
                    <NextLink href={i.path} passHref legacyBehavior>
                      <Link
                        onClick={closeDrawer}
                        color="text.subtitle"
                        sx={{
                          ":hover": {
                            color: "secondary.main",
                          },
                        }}
                      >
                        <ListItemText
                          primaryTypographyProps={{
                            typography: "body1",
                          }}
                        >
                          {i.name}
                        </ListItemText>
                      </Link>
                    </NextLink>
                  </ListItem>
                ))}
                {s.path !== "/" && (
                  <ListItem
                    key={s.name}
                    sx={{ paddingLeft: 0, paddingTop: 1 }}
                  >
                    <NextLink href={s.path} passHref legacyBehavior>
                      <Link
                        onClick={closeDrawer}
                        sx={{
                          ":hover": {
                            color: "secondary.main",
                          },
                        }}
                      >
                        <ListItemText
                          primaryTypographyProps={{
                            typography: "body1",
                          }}
                        >
                          Ver todos
                        </ListItemText>
                      </Link>
                    </NextLink>
                  </ListItem>
                )}
              </List>
            </Box>
          ))}
        </CustomList>
        <Box pt={4} />
      </Box>
      <Box
        flexGrow={1}
        bgcolor={isLight ? "background.default" : "background.paper"}
      />
    </Drawer>
  </>;
}
