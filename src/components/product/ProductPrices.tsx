import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { constants, cookiesExpires, cookiesKey } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity } from "src/frontend-utils/types/entity";
import { Product } from "src/frontend-utils/types/product";
import { Category, Store } from "src/frontend-utils/types/store";
import { useAppSelector } from "src/store/hooks";
import ProductPriceCard from "./ProductPriceCard";
import { RatedStore } from "./types";
import MessageIcon from "@mui/icons-material/Message";
import ProductAlertButton from "./ProductAlertButton";
import ProductPriceHistory from "./ProductPriceHistory";
import useSettings from "src/hooks/useSettings";
import { useUser } from "src/frontend-utils/redux/user";
import ProductAddToBudgetButton from "./ProductAddToBudgetButton";
import ProductStaffActionButton from "./ProductStaffActionButton";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";

type ProductPricesProps = {
  product: Product;
  category: Category;
  setOpenNewCommentDrawer: Function;
};

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProductPrices({
  product,
  category,
  setOpenNewCommentDrawer,
}: ProductPricesProps) {
  const { enqueueSnackbar } = useSnackbar();
  const { prefExcludeRefurbished, prefStores, onToggleExcludeRefurbished } =
    useSettings();
  const user = useAppSelector(useUser);
  const [openModal, setOpenModal] = useState(false);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [ratedStores, setRatedStores] = useState<Record<string, RatedStore>>(
    {}
  );
  const [showMore, setShowMore] = useState(false);
  const [ordering, setOrdering] = useState<"offer_price" | "normal_price">(
    "offer_price"
  );
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  useEffect(() => {
    const myAbortController = new AbortController();
    let storesUrl = "";
    for (const store of prefStores) {
      storesUrl += `&stores=${store}`;
    }
    fetchJson(
      `${constants.apiResourceEndpoints.products}available_entities/?ids=${product.id}&exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`,
      { signal: myAbortController.signal }
    )
      .then((availableEntities) => {
        const entities: Entity[] = availableEntities.results[0].entities.filter(
          (entity: Entity) =>
            entity.active_registry!.cell_monthly_payment === null
        );
        const stores = entities.map(
          (entity) => apiResourceObjects[entity.store] as Store
        );

        // Get ratings
        let storesRatingsUrl = "";
        for (const store of stores) {
          storesRatingsUrl += "ids=" + store.id + "&";
        }
        fetchJson(
          `${constants.apiResourceEndpoints.stores}average_ratings/?${storesRatingsUrl}`,
          { signal: myAbortController.signal }
        )
          .then((storesRatings) => {
            const rStores: Record<string, RatedStore> = {};
            for (const storeRating of storesRatings) {
              rStores[storeRating.store] = {
                ...stores[storeRating.store],
                rating: storeRating.rating,
              };
            }
            const refurbishedPresent = entities.filter(
              (e) => e.condition !== "https://schema.org/NewCondition"
            );
            setEntities(entities);
            setRatedStores(rStores);
            if (
              !Cookies.get(cookiesKey.refurbishedReminder) &&
              refurbishedPresent.length > 0
            ) {
              setOpenModal(true);
            }
          })
          .catch((_) => {});
      })
      .catch((_) => {});
    return () => {
      myAbortController.abort();
    };
  }, [apiResourceObjects, prefExcludeRefurbished, prefStores, product.id]);

  const hideRifurbished = () => {
    onToggleExcludeRefurbished();
    setOpenModal(false);
    enqueueSnackbar(
      "Se han escondido los productos reacondicionados exitosamente. Puedes volver a mostrarlos en el menú superior del sitio",
      { persist: true }
    );
  };

  const setRefurbushedReminderCookie = () => {
    Cookies.set(cookiesKey.refurbishedReminder, "active", {
      expires: cookiesExpires * 10,
    });
    setOpenModal(false);
  };

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h2">Elige tu tienda</Typography>
        <FormControl>
          <InputLabel id="demo-simple-select-standard-label">
            Ordenar por
          </InputLabel>
          <Select
            label="Ordenar por"
            value={ordering}
            onChange={(evt) =>
              setOrdering(evt.target.value as "offer_price" | "normal_price")
            }
          >
            <MenuItem value="offer_price">Precio oferta</MenuItem>
            <MenuItem value="normal_price">Precio normal</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Stack direction="column" spacing={1}>
        {entities
          .sort(
            (a, b) =>
              Number(a.active_registry![ordering]) -
              Number(b.active_registry![ordering])
          )
          .map((entity, i) =>
            !showMore && i >= 5 ? null : (
              <ProductPriceCard
                key={i}
                entity={entity}
                ratedStores={ratedStores}
              />
            )
          )}
      </Stack>
      <Stack direction="column" spacing={1}>
        {entities.length > 5 ? (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowMore(!showMore)}
            sx={{ borderRadius: 4, color: "text.primary" }}
          >
            {showMore ? "Ver menos precios" : "Ver más precios"}
          </Button>
        ) : entities.length === 0 ? (
          <Typography>Este producto no está disponible actualmente</Typography>
        ) : null}
        <Divider />
        {user && user.is_staff && (
          <ProductStaffActionButton product={product} />
        )}
        {category.budget_ordering && (
          <ProductAddToBudgetButton product={product} />
        )}
        <ProductPriceHistory product={product} />
        <ProductAlertButton
          productId={product.id}
          available={entities.length !== 0}
        />
        <Button
          variant="contained"
          color="info"
          sx={{ borderRadius: 4 }}
          onClick={() => setOpenNewCommentDrawer(true)}
          startIcon={<MessageIcon />}
        >
          ¿Lo compraste? ¡Danos tu opinión!
        </Button>
      </Stack>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={style}>
          <Stack spacing={2}>
            <Alert severity="warning">
              Este producto contiene precios de artículos reacondicionados.
              ¿Quieres continuar viendo estas opciones o esconderlas?
            </Alert>
            <Stack direction="row-reverse" spacing={1}>
              <Button
                variant="contained"
                color="info"
                onClick={setRefurbushedReminderCookie}
              >
                Continuar
              </Button>
              <Button
                variant="outlined"
                color="warning"
                onClick={hideRifurbished}
              >
                Esconder Reacondicionados
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
}
