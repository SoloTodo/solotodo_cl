import {
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
import { calcEntityPrice } from "src/utils/calcEntityPrice";
import { modalStyle } from "src/styles/modal";
import WarningIcon from "@mui/icons-material/Warning";

type ProductPricesProps = {
  product: Product;
  category: Category;
  setOpenNewCommentDrawer: Function;
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
        <Typography variant="h2" fontWeight={400}>
          Elige tu tienda
        </Typography>
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
              calcEntityPrice(a, ordering) - calcEntityPrice(b, ordering)
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
            {showMore ? "VER MENOS PRECIOS" : "VER MÁS PRECIOS"}
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
          sx={{ borderRadius: 4, fontWeight: 400 }}
          onClick={() => setOpenNewCommentDrawer(true)}
          startIcon={<MessageIcon />}
        >
          ¿Lo compraste? ¡Danos tu opinión!
        </Button>
      </Stack>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Stack spacing={4}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="baseline">
                <WarningIcon color="warning" />
                <Typography variant="h2" fontWeight={600}>
                  Producto Reacondicionado
                </Typography>
              </Stack>
              <Typography variant="h6" fontWeight={600}>
                Este producto contiene precios de artículos reacondicionados.
                ¿Quieres continuar viendo estas opciones?
              </Typography>
            </Stack>
            <Stack direction="row" spacing={3}>
              <Button
                variant="outlined"
                sx={{ borderRadius: 4 }}
                color="inherit"
                onClick={hideRifurbished}
              >
                ESCONDER REACONDICIONADOS
              </Button>
              <Button
                variant="outlined"
                sx={{ borderRadius: 4 }}
                color="secondary"
                onClick={setRefurbushedReminderCookie}
              >
                CONTINUAR
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
}
