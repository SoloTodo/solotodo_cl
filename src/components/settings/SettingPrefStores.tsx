import { useState } from "react";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useAppDispatch, useAppSelector } from "src/frontend-utils/redux/hooks";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { constants } from "src/config";
import { Store } from "src/frontend-utils/types/store";
import useSettings from "src/hooks/useSettings";
import userSlice, { useUser } from "src/frontend-utils/redux/user";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import { useSnackbar } from "notistack";
import { modalStyle } from "src/styles/modal";

export default function SettingPrefStores() {
  const dispatch = useAppDispatch();
  const { prefStores, onChangeStores } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const user = useAppSelector(useUser);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [open, setOpen] = useState(false);
  const [selectedStoreIds, setSelectedStoresIds] =
    useState<string[]>(prefStores);

  const allStores = (
    getApiResourceObjects(apiResourceObjects, "stores") as Store[]
  ).filter(
    (s) => s.country === constants.defaultCountryUrl && s.last_activation
  );
  const allStoreIds = allStores.map((s) => s.id.toString());

  const selectAll = () => {
    setSelectedStoresIds(allStoreIds);
  };

  const selectNone = () => {
    setSelectedStoresIds([]);
  };

  const onChange = (check: boolean, id: string) => {
    if (check) {
      setSelectedStoresIds([...selectedStoreIds, id]);
    } else {
      setSelectedStoresIds(selectedStoreIds.filter((i) => i !== id));
    }
  };

  const onSubmit = () => {
    if (selectedStoreIds.length === 0) {
      enqueueSnackbar("Debes seleccionar al menos una tienda", {
        variant: "error",
      });
      setSelectedStoresIds(prefStores);
    } else {
      if (user) {
        const userChanges = {
          preferred_stores: selectedStoreIds.map(
            (i) => `${constants.apiResourceEndpoints.stores}${i}/`
          ),
        };
        fetchAuth(null, "users/me/", {
          method: "PATCH",
          body: JSON.stringify(userChanges),
        }).then((user) => dispatch(userSlice.actions.setUser(user)));
      }
      onChangeStores(selectedStoreIds);
      enqueueSnackbar("Cambios guardados");
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        sx={{
          justifyContent: "space-between",
          px: 0,
        }}
        color="inherit"
        endIcon={<ArrowForwardIosIcon />}
        onClick={() => setOpen(true)}
      >
        Tiendas
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Stack
          sx={{ ...modalStyle, width: { xs: "98%", md: "80%" } }}
          spacing={2}
        >
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h2">Selección de tiendas</Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={selectAll}>
                Todas
              </Button>
              <Button variant="outlined" onClick={selectNone}>
                Ninguna
              </Button>
            </Stack>
          </Grid>
          <Divider />
          <Grid
            container
            columns={{ xs: 4, sm: 6, md: 8 }}
            spacing={3}
            maxHeight={500}
            overflow="auto"
          >
            {allStores.map((s) => (
              <Grid key={s.id} item xs={2}>
                <FormControlLabel
                  disableTypography
                  checked={selectedStoreIds.includes(s.id.toString())}
                  control={<Checkbox />}
                  label={s.name}
                  onChange={(_, check) => onChange(check, s.id.toString())}
                />
              </Grid>
            ))}
          </Grid>
          <Divider />
          <Stack direction="row-reverse" spacing={1}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ borderRadius: 3 }}
              onClick={onSubmit}
            >
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ borderRadius: 3 }}
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
}
