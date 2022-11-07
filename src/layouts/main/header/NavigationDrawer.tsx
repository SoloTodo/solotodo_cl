import { useState } from "react";
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
} from "@mui/material";
import { NavigationProps } from "src/contexts/NavigationContext";
import useNavigation from "src/hooks/useNavigation";
import Iconify from "src/components/Iconify";
import useResponsive from "src/hooks/useResponsive";
import { IconButtonAnimate } from "src/components/animate";
import MenuPopover from "src/components/MenuPopover";
import { HEADER } from "src/config";
import useSettings from "src/hooks/useSettings";

export default function NavigationDrawer({ inFooter = false }) {
  const settings = useSettings();
  const navigation = useNavigation();
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  const isDesktop = useResponsive("up", "lg");
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

  return (
    <>
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
        anchor="left"
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
        />
        <Box
          width={{ xs: 250, lg: 300 }}
          bgcolor={isLight ? "background.default" : "background.paper"}
        >
          <List>
            {navigation.map((s, index) => (
              <ListItemButton
                key={index}
                sx={{ textTransform: "capitalize", paddingY: 2 }}
                onClick={() => openDrawer(index)}
              >
                <ListItemText primaryTypographyProps={{ typography: "body1" }}>
                  {s.name}
                </ListItemText>
                <Box component={Iconify} icon={"eva:arrow-ios-forward-fill"} />
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Box
          height="100%"
          bgcolor={isLight ? "background.default" : "background.paper"}
        />
      </Drawer>
      <Drawer
        anchor="left"
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
        />
        <Box
          width={{ xs: 250, lg: 300 }}
          bgcolor={isLight ? "background.default" : "background.paper"}
        >
          <List dense>
            {menu?.sections.map((s, index) => (
              <div key={index}>
                {s.path === "/" ? (
                  <ListItemButton sx={{ textTransform: "capitalize" }} disabled>
                    <ListItemText
                      primaryTypographyProps={{ typography: "body1" }}
                    >
                      {s.name}
                    </ListItemText>
                  </ListItemButton>
                ) : (
                  <NextLink href={`${s.path}/preview`} passHref>
                    <ListItemButton
                      sx={{ textTransform: "capitalize" }}
                      onClick={closeDrawer}
                    >
                      <ListItemText
                        primaryTypographyProps={{ typography: "body1" }}
                      >
                        {s.name}
                      </ListItemText>
                      <Box
                        component={Iconify}
                        icon={"eva:arrow-ios-forward-fill"}
                      />
                    </ListItemButton>
                  </NextLink>
                )}
                <List dense sx={{ padding: 0 }}>
                  {s.items.map((i) => (
                    <ListItem key={`${s.name}-${i.name}`}>
                      <NextLink href={i.path} passHref>
                        <ListItemButton onClick={closeDrawer}>
                          <ListItemText>{i.name}</ListItemText>
                        </ListItemButton>
                      </NextLink>
                    </ListItem>
                  ))}
                  <ListItem key={s.name}>
                    <NextLink href={s.path} passHref>
                      <ListItemButton onClick={closeDrawer}>
                        <ListItemText sx={{ color: "primary.main" }}>
                          Ver todos
                        </ListItemText>
                      </ListItemButton>
                    </NextLink>
                  </ListItem>
                </List>
              </div>
            ))}
          </List>
        </Box>
        <Box
          height="100%"
          bgcolor={isLight ? "background.default" : "background.paper"}
        />
      </Drawer>
    </>
  );
}
