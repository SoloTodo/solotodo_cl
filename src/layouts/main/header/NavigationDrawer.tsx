import { useState } from "react";
import {
  Stack,
  Button,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { NavigationProps } from "src/contexts/NavigationContext";
import useNavigation from "src/hooks/useNavigation";
import Iconify from "src/components/Iconify";

export default function NavigationDrawer() {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<NavigationProps | null>(null);

  const openMenu = (i: number) => {
    setMenu(navigation[i]);
    setOpen(true);
  };

  const closeMenu = () => {
    setOpen(false);
    setMenu(null);
  };

  return (
    <>
      <Stack direction="row" spacing={2}>
        {navigation.map((n, index) => (
          <Button key={index} variant="text" onClick={() => openMenu(index)}>
            {n.name}
          </Button>
        ))}
      </Stack>
      <Drawer anchor="left" open={open} onClose={closeMenu}>
        <Box width={250}>
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
