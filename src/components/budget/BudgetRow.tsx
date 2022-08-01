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
    />
  );
}
