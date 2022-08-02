import { useEffect } from "react";
import { Entry } from "./types";
import { PricingEntriesProps } from "../product/types";
import { useAppSelector } from "src/store/hooks";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { Category, Store } from "src/frontend-utils/types/store";
import BudgetRowDesktopComponent from "./BudgetRowDesktopComponent";
import { Entity } from "src/frontend-utils/types/entity";
import { SelectChangeEvent } from "@mui/material";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";

export default function BudgetRow({
  budgetEntry,
  setBudget,
  pricingEntries,
}: {
  budgetEntry: Entry;
  setBudget: Function;
  pricingEntries: PricingEntriesProps[];
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const stores = getApiResourceObjects(apiResourceObjects, "stores") as Store[];
  const category = apiResourceObjects[budgetEntry.category] as Category;

  const selectedProduct = budgetEntry.selected_product;
  const pricingEntriesSameCategory = pricingEntries.filter(
    (productEntry) => budgetEntry.category === productEntry.product.category
  );
  const matchingPricingEntry = pricingEntriesSameCategory.filter(
    (pricingEntry) => pricingEntry.product.url === selectedProduct
  )[0];
  const matchingEntities = matchingPricingEntry
    ? matchingPricingEntry.entities
    : [];
  const filteredEntities: Entity[] = [];

  for (const entity of matchingEntities) {
    if (
      !filteredEntities.some(
        (filteredEntity) => filteredEntity.store === entity.store
      )
    ) {
      filteredEntities.push(entity);
    }
  }

  const matchingEntity = filteredEntities.filter(
    (entity) => entity.store === budgetEntry.selected_store
  )[0];
  const selectedProductHref = matchingPricingEntry
    ? `/products/${matchingPricingEntry.product.id}`
    : "";

  // useEffect(() => {
  //   console.log(budgetEntry)
  //   const pricingEntriesSameCat = pricingEntries.filter(
  //     (productEntry) => budgetEntry.category === productEntry.product.category
  //   );
  //   let matchingPricingEntry = null;

  //   if (budgetEntry.selected_product) {
  //     matchingPricingEntry = pricingEntriesSameCat.filter(
  //       (pricingEntry) =>
  //         pricingEntry.product.url === budgetEntry.selected_product
  //     )[0];
  //   }

  //   if (!matchingPricingEntry && pricingEntriesSameCat.length) {
  //     matchingPricingEntry = pricingEntriesSameCat[0];
  //   }

  //   let matchingEntity = null;

  //   if (matchingPricingEntry) {
  //     const entities = matchingPricingEntry.entities;

  //     if (budgetEntry.selected_store) {
  //       matchingEntity =
  //         entities.filter(
  //           (entity) => entity.store === budgetEntry.selected_store
  //         )[0] || null;
  //     }

  //     if (!matchingEntity && entities.length) {
  //       matchingEntity = entities[0];
  //     }
  //   }

  //   const matchingProductUrl =
  //     matchingPricingEntry && matchingPricingEntry.product.url;

  //   const matchingStore = (matchingEntity && matchingEntity.store) || null;
  //   if (
  //     budgetEntry.selected_product !== matchingProductUrl ||
  //     budgetEntry.selected_store !== matchingStore
  //   ) {
  //     const formData = {
  //       selected_product: matchingProductUrl,
  //       selected_store: matchingEntity && matchingEntity.store,
  //     };
  //     fetchAuth(null, `budget_entries/${budgetEntry.id}/`, {
  //       method: "PATCH",
  //       body: JSON.stringify(formData),
  //     }).then(() => {
  //       setBudget();
  //     });
  //   }
  // }, [
  //   budgetEntry.category,
  //   budgetEntry.id,
  //   budgetEntry.selected_product,
  //   budgetEntry.selected_store,
  //   pricingEntries,
  //   setBudget,
  // ]);

  const handleProductSelect = (e: SelectChangeEvent<string>) => {
    const newProductUrl = e.target.value;
    const matchingPricingEntry = pricingEntries.filter(
      (productEntry) => productEntry.product.url === newProductUrl
    )[0];
    const matchingEntities = matchingPricingEntry
      ? matchingPricingEntry.entities
      : [];
    const matchingEntity = matchingEntities[0] || null;

    const formData = {
      selected_product: newProductUrl,
      selected_store: matchingEntity && matchingEntity.store,
    };
    fetchAuth(null, `budget_entries/${budgetEntry.id}/`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    }).then(() => {
      setBudget();
    });
  };

  const handleStoreSelect = (e: SelectChangeEvent<string>) => {
    const newStoreUrl = e.target.value;
    const formData = {
      selected_store: newStoreUrl,
    };
    fetchAuth(null, `budget_entries/${budgetEntry.id}/`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    }).then(() => {
      setBudget();
    });
  };

  return (
    <BudgetRowDesktopComponent
      budgetEntry={budgetEntry}
      category={category}
      stores={stores}
      pricingEntries={pricingEntriesSameCategory}
      matchingPricingEntry={matchingPricingEntry}
      filteredEntities={filteredEntities}
      matchingEntity={matchingEntity}
      selectedProduct={selectedProduct}
      selectedProductHref={selectedProductHref}
      handleProductSelect={handleProductSelect}
      handleStoreSelect={handleStoreSelect}
      setBudget={setBudget}
    />
  );
}
