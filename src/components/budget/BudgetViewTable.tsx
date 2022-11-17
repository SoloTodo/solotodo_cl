import { Button, Link, Stack, Typography } from "@mui/material";
import currency from "currency.js";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { fetchJson } from "src/frontend-utils/network/utils";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { Category, Store } from "src/frontend-utils/types/store";
import useSettings from "src/hooks/useSettings";
import CustomTable from "src/sections/CustomTable";
import { useAppSelector } from "src/store/hooks";
import { PricingEntriesProps } from "../product/types";
import SoloTodoLeadLink from "../SoloTodoLeadLink";
import { Budget, Entry } from "./types";

export default function BudgetViewTable({
  initialBudget,
}: {
  initialBudget: Budget;
}) {
  const { prefExcludeRefurbished, prefStores } = useSettings();
  const [budget, setBudget] = useState(initialBudget);
  const [pricingEntries, setPricingEntries] = useState<
    PricingEntriesProps[] | null
  >(null);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const categories = getApiResourceObjects(
    apiResourceObjects,
    "categories"
  ) as Category[];
  const stores = getApiResourceObjects(apiResourceObjects, "stores") as Store[];

  if (initialBudget.id !== budget.id) {
    setBudget(initialBudget);
  }

  useEffect(() => {
    const myAbortController = new AbortController();
    const selectedProductUrls = budget.entries
      .map((entry) => entry.selected_product)
      .filter((productUrl) => productUrl);

    if (selectedProductUrls.length) {
      const productIds = budget.products_pool
        .filter((product) => selectedProductUrls.includes(product.url))
        .map((product) => product.id);

      let url = "products/available_entities/?";
      for (const productId of productIds) {
        url += `ids=${productId}&`;
      }

      for (const store of prefStores) {
        url += `&stores=${store}`;
      }

      url += `&exclude_refurbished=${prefExcludeRefurbished}`;

      fetchJson(url, { signal: myAbortController.signal })
        .then((response) => {
          const pricingEntries: PricingEntriesProps[] = response.results;
          pricingEntries.sort((a, b) =>
            a.product.name <= b.product.name ? -1 : 1
          );
          setPricingEntries(pricingEntries);
        })
        .catch((_) => {});
    } else {
      setPricingEntries([]);
    }
    return () => {
      myAbortController.abort();
    };
  }, [
    budget.entries,
    budget.products_pool,
    prefExcludeRefurbished,
    prefStores,
  ]);

  const exportToXls = () => {
    let url = `budgets/${budget.id}/export/?export_format=xls`;

    fetchAuth(null, url).then(
      (response) => (window.location = response.content)
    );
  };

  let totalPrice = new currency(0, { separator: ".", precision: 0 });
  if (pricingEntries) {
    for (const budgetEntry of budget.entries) {
      if (!budgetEntry.selected_store) {
        continue;
      }
      const pricingEntry =
        pricingEntries.filter(
          (entry) => entry.product.url === budgetEntry.selected_product
        )[0] || null;

      if (!pricingEntry) {
        continue;
      }

      const matchingEntity =
        pricingEntry.entities.filter(
          (entity) => entity.store === budgetEntry.selected_store
        )[0] || null;

      if (
        matchingEntity &&
        typeof matchingEntity.active_registry !== "undefined"
      ) {
        totalPrice = totalPrice.add(
          new currency(matchingEntity.active_registry.offer_price, {
            separator: ".",
            precision: 0,
          })
        );
      }
    }
  }

  const filteredEntries = budget.entries.filter(
    (entry) => entry.selected_product
  );

  const getMatchingEntity = (budgetEntry: Entry) => {
    const store = stores.filter(
      (store) => store.url === budgetEntry.selected_store
    )[0];

    let matchingPricingEntry = null;

    if (budgetEntry.selected_product && pricingEntries) {
      matchingPricingEntry =
        pricingEntries.filter(
          (productEntry) =>
            productEntry.product.url === budgetEntry.selected_product
        )[0] || null;
    }

    let matchingEntity = null;

    if (matchingPricingEntry && store) {
      matchingEntity =
        matchingPricingEntry.entities.filter(
          (entity) => entity.store === store.url
        )[0] || null;
    }

    return matchingEntity;
  };

  const columns = [
    {
      field: "component",
      headerName: "Componente",
      renderCell: (params: { row: Entry }) =>
        categories.find((c) => c.url === params.row.category)!.name,
    },
    {
      field: "product",
      headerName: "Producto",
      renderCell: (params: { row: Entry }) => {
        const product = budget.products_pool.filter(
          (product) => product.url === params.row.selected_product
        )[0];
        if (product) {
          return (
            <NextLink
              href={`/products/[slug]?slug=${product.id}`}
              as={`/products/${product.id}`}
              passHref
            >
              <Link color="info.main">{product.name}</Link>
            </NextLink>
          );
        } else {
          return "N/A";
        }
      },
    },
    {
      field: "store",
      headerName: "Tienda",
      renderCell: (params: { row: Entry }) => {
        const product = budget.products_pool.filter(
          (product) => product.url === params.row.selected_product
        )[0];
        const store = stores.filter(
          (store) => store.url === params.row.selected_store
        )[0];
        const m = getMatchingEntity(params.row);
        return store ? (
          m ? (
            <SoloTodoLeadLink entity={m} storeEntry={store} product={product}>
              {store.name}
            </SoloTodoLeadLink>
          ) : (
            store.name
          )
        ) : (
          "N/A"
        );
      },
    },
    {
      field: "price",
      headerName: "Precio",
      renderCell: (params: { row: Entry }) => {
        const m = getMatchingEntity(params.row);
        return m
          ? currency(m.active_registry!.offer_price, {
              separator: ".",
              precision: 0,
            }).format()
          : "N/A";
      },
    },
  ];

  return (
    <Stack spacing={2}>
      <CustomTable columns={columns} data={filteredEntries} />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Button variant="outlined" onClick={exportToXls}>
          Exportar a Excel
        </Button>
        <Typography variant="h5" fontWeight={600} color="primary">
          Total: {totalPrice.format()}
        </Typography>
      </Stack>
    </Stack>
  );
}
