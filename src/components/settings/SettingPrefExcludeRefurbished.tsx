import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import useSettings from "src/hooks/useSettings";

export default function SettingPrefExcludeRefurbished() {
  const { prefExcludeRefurbished, onToggleExcludeRefurbished } = useSettings();

  return (
    <FormGroup onChange={onToggleExcludeRefurbished}>
      <FormControlLabel
        sx={{ justifyContent: "space-between", fontWeight: 500, width: '100%' }}
        disableTypography
        checked={!prefExcludeRefurbished}
        control={<Switch color="primary" />}
        label="Seminuevos"
        labelPlacement="start"
      />
    </FormGroup>
  );
}
