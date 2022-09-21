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
  styled,
} from "@mui/material";
import { NavigationProps } from "src/contexts/NavigationContext";
import useNavigation from "src/hooks/useNavigation";
import Iconify from "src/components/Iconify";
import useResponsive from "src/hooks/useResponsive";
import { IconButtonAnimate } from "src/components/animate";
import MenuPopover from "src/components/MenuPopover";
import { HEADER } from "src/config";
import useSettings from "src/hooks/useSettings";

const RootStyle = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isOffset",
})<{ isOffset: boolean }>(({ isOffset, theme }) => ({
  height: HEADER.MOBILE_HEIGHT,
  [theme.breakpoints.up("lg")]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
  },
}));

export default function NavigationDrawer({
  isOffset = true,
  inFooter = false,
}) {
  const settings = useSettings();
  const navigation = useNavigation();
  const isDesktop = useResponsive("up", "md");
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<HTMLElement | null>(null);
  const [menu, setMenu] = useState<NavigationProps | null>(null);

  const openDrawer = (i: number) => {
    setMenu(navigation[i]);
    setOpen(true);
    setOpenMenu(null);
  };

  const closeDrawer = () => {
    setOpen(false);
    setMenu(null);
  };

  const buttons = navigation.map((n, index) => (
    <Button
      key={index}
      variant="text"
      sx={{
        color: settings.themeMode === "light" ? "#303D53" : "text.primary",
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
          <IconButtonAnimate onClick={(evt) => setOpenMenu(evt.currentTarget)}>
            <Iconify icon={"eva:menu-2-fill"} />
          </IconButtonAnimate>
          <MenuPopover
            open={Boolean(openMenu)}
            anchorEl={openMenu}
            onClose={() => setOpenMenu(null)}
            sx={{
              mt: 1.5,
              ml: 0.75,
              width: 180,
              "& .MuiMenuItem-root": {
                px: 1,
                typography: "body2",
                borderRadius: 0.75,
              },
            }}
          >
            <Stack spacing={0.75}>{buttons}</Stack>
          </MenuPopover>
        </>
      )}
      <Drawer
        anchor="left"
        open={open}
        onClose={closeDrawer}
        PaperProps={{ sx: { backgroundColor: "transparent" } }}
      >
        <RootStyle isOffset={isOffset} />
        <Box height="90%" bgcolor="background.paper">
          <Box width={{ xs: 250, lg: 300 }} bgcolor="background.paper">
            <List dense>
              {menu?.sections.map((s, index) => (
                <div key={index}>
                  {s.path === "/" ? (
                    <ListItemButton
                      sx={{ textTransform: "capitalize" }}
                      disabled
                    >
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
        </Box>
      </Drawer>
    </>
  );
}
