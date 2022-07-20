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
import { useAppSelector } from "src/store/hooks";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { constants } from "src/config";
import { Store } from "src/frontend-utils/types/store";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "98%", md: "80%" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SettingPrefStores() {
  const [open, setOpen] = useState(false);
  const [selectedStoreIds, setSelectedStoresIds] = useState<number[]>([]);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  
  const allStores = (
    getApiResourceObjects(apiResourceObjects, "stores") as Store[]
  ).filter((s) => s.country === constants.defaultCountryUrl);
  const allStoreIds = allStores.map((s) => s.id);

  const selectAll = () => {
    setSelectedStoresIds(allStoreIds);
  }

  const selectNone = () => {
    setSelectedStoresIds([]);
  }

  const onChange = (check: boolean, id: number) => {
    if (check) {
      setSelectedStoresIds([...selectedStoreIds, id]);
    } else {
      setSelectedStoresIds(selectedStoreIds.filter((i) => i !== id));
    }
  };

  const onSubmit = () => {

  }

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
        <Stack sx={style} spacing={2}>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h2">Selección de tiendas</Typography>
            <Stack direction="row" spacing={1}>
              <Button variant="outlined" onClick={selectAll}>Todas</Button>
              <Button variant="outlined" onClick={selectNone}>Ninguna</Button>
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
                  checked={selectedStoreIds.includes(s.id)}
                  control={<Checkbox />}
                  label={s.name}
                  onChange={(_, check) => onChange(check, s.id)}
                />
              </Grid>
            ))}
          </Grid>
          <Divider />
          <Stack direction="row-reverse" spacing={1}>
            <Button variant="contained" sx={{ borderRadius: 3 }} onClick={onSubmit}>
              Guardar
            </Button>
            <Button variant="outlined" sx={{ borderRadius: 3 }} onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
}
