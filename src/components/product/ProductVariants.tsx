import { Product } from "src/frontend-utils/types/product";
import { constants } from "src/config";
import { Category } from "src/frontend-utils/types/store";
import { useEffect, useState } from "react";
import { Entity } from "src/frontend-utils/types/entity";
import { fetchJson } from "src/frontend-utils/network/utils";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { useUser } from "src/frontend-utils/redux/user";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Grid } from "@mui/material";
import ProductAxisChoices from "./ProductAxisChoices";
import { PricingEntriesProps } from "./types";

type ProductVariantsProps = {
  product: Product;
  category: Category;
};

type Bucket = {
  fields: string;
  axes: {
    label: string;
    labelField: string;
    orderingField: string;
  }[];
};

export default function ProductVariants({
  product,
  category,
}: ProductVariantsProps) {
  const user = useAppSelector(useUser);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [pricingEntries, setPrincingEntries] = useState<PricingEntriesProps[]>(
    []
  );
  const bucketSettings = (constants.bucketCategories as Record<number, Bucket>)[
    category.id
  ];

  useEffect(() => {
    const myAbortController = new AbortController();
    if (typeof bucketSettings === "undefined") return;

    const fields = bucketSettings.fields;
    const bucketUrl = `products/${product.id}/bucket/?fields=${fields}`;
    const stores = user
      ? user.preferred_stores.map((s) => apiResourceObjects[s])
      : [];

    fetchJson(bucketUrl, { signal: myAbortController.signal })
      .then((products) => {
        let pricingEntriesUrl = `products/available_entities/?`;

        for (const product of products) {
          pricingEntriesUrl += `ids=${product.id}&`;
        }

        for (const store of stores) {
          pricingEntriesUrl += `stores=${store.id}&`;
        }

        fetchJson(pricingEntriesUrl, { signal: myAbortController.signal })
          .then((response) => {
            const filteredEntries = (response.results as PricingEntriesProps[])
              .map((pricingEntry) => ({
                product: pricingEntry.product,
                entities: pricingEntry.entities.filter(
                  (entity: Entity) =>
                    entity.active_registry &&
                    entity.active_registry.cell_monthly_payment === null
                ),
              }))
              .filter(
                (pricingEntry) =>
                  pricingEntry.entities.length ||
                  pricingEntry.product.id === product.id
              );
            setPrincingEntries(filteredEntries);
          })
          .catch((_) => {});
      })
      .catch((_) => {});
    return () => {
      myAbortController.abort();
    };
  }, [apiResourceObjects, bucketSettings, product.id, user]);

  if (!bucketSettings || pricingEntries.length === 0) return null;

  const axes = bucketSettings.axes.filter((axis) => {
    return (
      new Set(
        pricingEntries.map(
          (pricingEntry) => pricingEntry.product.specs[axis.labelField]
        )
      ).size > 1
    );
  });

  if (!axes.length) return null;

  const labelFields = bucketSettings.axes.map((axis) => axis.labelField);

  return (
    <Grid container rowGap={2} direction="column" overflow="scroll">
      {axes.map((axis) => (
        <Grid item key={axis.label}>
          <ProductAxisChoices
            axis={axis}
            product={product}
            pricingEntries={pricingEntries}
            otherLabelFields={labelFields.filter(
              (labelField) => labelField !== axis.labelField
            )}
          />
        </Grid>
      ))}
    </Grid>
  );
}
