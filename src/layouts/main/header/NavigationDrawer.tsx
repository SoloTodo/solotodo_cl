import { useState } from "react";
import {
  Stack,
  Button,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { NavigationProps } from "src/contexts/NavigationContext";
import useNavigation from "src/hooks/useNavigation";
import Iconify from "src/components/Iconify";
import useResponsive from "src/hooks/useResponsive";
import { IconButtonAnimate } from "src/components/animate";
import MenuPopover from "src/components/MenuPopover";
import { HEADER } from "src/config";

export default function NavigationDrawer() {
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
    <Button key={index} variant="text" onClick={() => openDrawer(index)}>
      {n.name}
    </Button>
  ));

  return (
    <>
      {isDesktop ? (
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
        <Box
          pt={{
            xs: `${HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT}px`,
            lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT}px`,
          }}
          bgcolor="transparent"
        />
        <Box
          width={{ xs: 250, lg: 300 }}
          height="100%"
          bgcolor="background.paper"
        >
          <List dense>
            {menu?.sections.map((s, index) => (
              <div key={index}>
                <ListItemButton
                  sx={{ textTransform: "capitalize", height: 44 }}
                  href={s.path}
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
                <List dense>
                  {s.items.map((i) => (
                    <ListItem key={`${s.name}-${i.name}`}>
                      <ListItemButton href={i.path}>
                        <ListItemText>{i.name}</ListItemText>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </div>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
