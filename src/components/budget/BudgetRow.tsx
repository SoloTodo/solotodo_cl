import { useEffect } from "react";
import { Entry } from "./types";
import { PricingEntriesProps } from "../product/types";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { Category, Store } from "src/frontend-utils/types/store";
import BudgetRowComponent from "./BudgetRowComponent";
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
  )[0] || filteredEntities[0];
  const selectedProductHref = matchingPricingEntry
    ? `/products/${matchingPricingEntry.product.id}`
    : "";

  useEffect(() => {
    const myAbortController = new AbortController();
    if (
      typeof matchingPricingEntry === "undefined" &&
      pricingEntriesSameCategory.length !== 0
    ) {
      const firstProduct = pricingEntriesSameCategory[0];
      const formData = {
        selected_product: firstProduct.product.url,
        selected_store:
          firstProduct.entities[0] && firstProduct.entities[0].store,
      };
      fetchAuth(null, `budget_entries/${budgetEntry.id}/`, {
        method: "PATCH",
        body: JSON.stringify(formData),
        signal: myAbortController.signal,
      })
        .then(() => {
          setBudget();
        })
        .catch((_) => {});
      return () => {
        myAbortController.abort();
      };
    }
  }, [
    budgetEntry.id,
    matchingPricingEntry,
    pricingEntriesSameCategory,
    setBudget,
  ]);

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
    <BudgetRowComponent
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
