import { Button, Divider, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity } from "src/frontend-utils/types/entity";
import { Product } from "src/frontend-utils/types/product";
import { Category, Store } from "src/frontend-utils/types/store";
import { useAppSelector } from "src/store/hooks";
import ProductPriceCard from "./ProductPriceCard";

type ProductPricesProps = {
  product: Product;
  category: Category;
};

type RatedStore = Store & {
  rating: number;
};

export default function ProductPrices({
  product,
  category,
}: ProductPricesProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [ratedStores, setRatedStores] = useState<Record<string, RatedStore>>(
    {}
  );
  const [showMore, setShowMore] = useState(false);
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
    <Stack direction="column" spacing={3}>
      <Stack direction="column" spacing={1}>
        {entities.map((entity, i) =>
          !showMore && i >= 5 ? null : <ProductPriceCard key={i} />
        )}
      </Stack>
      <Stack direction="column" spacing={1}>
        <Button
          variant="outlined"
          onClick={() => setShowMore(!showMore)}
          sx={{ borderRadius: 4 }}
        >
          {showMore ? "Ver menos precios" : "Ver más precios"}
        </Button>
        <Divider />
        <Button variant="contained" color="secondary" sx={{ borderRadius: 4 }}>
          Precio histórico
        </Button>
        <Button variant="contained" color="secondary" sx={{ borderRadius: 4 }}>
          Avísame cuando baje de precio
        </Button>
        <Button variant="contained" color="secondary" sx={{ borderRadius: 4 }}>
          ¿Lo compraste? ¡Danos tu opinión!
        </Button>
      </Stack>
    </Stack>
  );
}
