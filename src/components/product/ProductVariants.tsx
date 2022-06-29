import { Product } from "src/frontend-utils/types/product";
import { constants } from "src/config";
import { Category } from "src/frontend-utils/types/store";
import { useState } from "react";
import { Entity } from "src/frontend-utils/types/entity";
import { useMemo } from "react";
import { fetchJson } from "src/frontend-utils/network/utils";

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

type PricingEntriesProps = {
  product: Product;
  entities: Entity[];
}

export default function ProductVariants({
  product,
  category,
}: ProductVariantsProps) {
  const [pricingEntries, setPrincingEntries] = useState<PricingEntriesProps | undefined>(undefined);
  const bucketSettings = (constants.bucketCategories as Record<number, Bucket>)[
    category.id
  ];

  // const fields = bucketSettings.fields;
  // const bucketUrl = `products/${product.id}/bucket/?fields=${fields}`;

  // useMemo(() => {



  //   fetchJson(bucketUrl).then(products => {
  //     let pricingEntriesUrl = `products/available_entities/?`;

  //     for (const product of products) {
  //       pricingEntriesUrl += `ids=${product.id}&`;
  //     }

  //     for (const store of stores) {
  //       pricingEntriesUrl += `stores=${store.id}&`
  //     }

  //     fetchJson(pricingEntriesUrl).then(response => {
  //       const filteredEntries = response.results.map(pricingEntry => (
  //           {
  //             product: pricingEntry.product,
  //             entities: pricingEntry.entities.filter(entity => entity.active_registry.cell_monthly_payment === null)
  //           }
  //       )).filter(pricingEntry => pricingEntry.entities.length || pricingEntry.product.id === product.id);
  //       setPrincingEntries(filteredEntries);
  //     })
  //   });
  // }, [bucketUrl, product])
  
  if (!bucketSettings) return null;
  return <>variants</>;
}
