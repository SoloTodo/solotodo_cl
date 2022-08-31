import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import userSlice, { useUser } from "src/frontend-utils/redux/user";
import useSettings from "src/hooks/useSettings";
import { useAppDispatch, useAppSelector } from "src/store/hooks";

export default function SettingPrefExcludeRefurbished() {
  const dispatch = useAppDispatch();
  const { prefExcludeRefurbished, onToggleExcludeRefurbished } = useSettings();
  const user = useAppSelector(useUser);

  const onChange = () => {
    if (user) {
      const userChanges = {
        preferred_exclude_refurbished: !prefExcludeRefurbished,
      };
      fetchAuth(null, "users/me/", {
        method: "PATCH",
        body: JSON.stringify(userChanges),
      }).then((user) => dispatch(userSlice.actions.setUser(user)));
    }
    onToggleExcludeRefurbished();
  };

  return (
    <FormGroup onChange={onChange}>
      <FormControlLabel
        sx={{ justifyContent: "space-between", fontWeight: 500, width: '100%' }}
        disableTypography
        checked={!prefExcludeRefurbished}
        control={<Switch color="primary" />}
        label="Reacondicionados"
        labelPlacement="start"
      />
    </FormGroup>
  );
}
