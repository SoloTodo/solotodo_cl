import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import userSlice, { useUser } from "src/frontend-utils/redux/user";
import useSettings from "src/hooks/useSettings";
import { useAppSelector } from "src/store/hooks";
import { dispatch } from "src/store/store";

export default function SettingPrefExcludeRefurbished() {
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
        checked={prefExcludeRefurbished}
        control={<Switch color="primary" />}
        label="Reacondicionados"
        labelPlacement="start"
      />
    </FormGroup>
  );
}
