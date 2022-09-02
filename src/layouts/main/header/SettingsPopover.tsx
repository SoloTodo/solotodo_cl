import { useState } from "react";
// @mui
import { Divider, Stack } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButtonAnimate } from "../../../components/animate";
import MenuPopover from '../../../components/MenuPopover';
import SettingMode from "../../../components/settings/SettingMode";
import SettingPrefExcludeRefurbished from "src/components/settings/SettingPrefExcludeRefurbished";
import SettingPrefStores from "src/components/settings/SettingPrefStores";

export default function SettingsPopover() {
  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        color="secondary"
        sx={{
          width: 40,
          height: 40,
          ...(open && { bgcolor: 'action.selected' }),
        }}
      >
        <SettingsIcon />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <Stack spacing={0.75}>
          <SettingMode />
          <Divider />
          <SettingPrefStores />
          <SettingPrefExcludeRefurbished />
        </Stack>
      </MenuPopover>
    </>
  );
}
