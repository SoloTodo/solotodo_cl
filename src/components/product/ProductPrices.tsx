import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { constants } from "src/config";
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
  const [entities, setEntities] = useState<Entity[]>([]);
  const [ratedStores, setRatedStores] = useState<Record<string, RatedStore>>(
    {}
  );
  const [showMore, setShowMore] = useState(false);
  const [ordering, setOrdering] = useState<"offer_price" | "normal_price">(
    "offer_price"
  );
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  useMemo(() => {
    fetchJson(
      `${constants.apiResourceEndpoints.products}available_entities/?ids=${product.id}`
    ).then((availableEntities) => {
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
        `${constants.apiResourceEndpoints.stores}average_ratings/?${storesRatingsUrl}`
      ).then((storesRatings) => {
        const rStores: Record<string, RatedStore> = {};
        for (const storeRating of storesRatings) {
          rStores[storeRating.store] = {
            ...stores[storeRating.store],
            rating: storeRating.rating,
          };
        }
        setEntities(entities);
        setRatedStores(rStores);
      });
    });
  }, [apiResourceObjects, product.id]);

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
                first={i === 0}
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
            onClick={() => setShowMore(!showMore)}
            sx={{ borderRadius: 4 }}
          >
            {showMore ? "Ver menos precios" : "Ver más precios"}
          </Button>
        ) : (
          <Typography>Este producto no está disponible actualmente</Typography>
        )}
        <Divider />
        <ProductPriceHistory />
        <ProductAlertButton
          productId={product.id}
          available={entities.length !== 0}
        />
        <Button
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 4 }}
          onClick={() => setOpenNewCommentDrawer(true)}
          startIcon={<MessageIcon />}
        >
          ¿Lo compraste? ¡Danos tu opinión!
        </Button>
      </Stack>
    </Stack>
  );
}
