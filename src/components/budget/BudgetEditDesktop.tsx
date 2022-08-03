import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import BudgetRow from "./BudgetRow";
import { Budget, CompatibilityOrNull } from "./types";
import { PricingEntriesProps } from "../product/types";
import currency from "currency.js";
import BudgetSelectBestPricesButton from "./BudgetSelectBestPricesButton";
import BudgetEntryCreateButton from "./BudgetEntryCreateButton";
import { Category } from "src/frontend-utils/types/store";
import BudgetExportButton from "./BudgetExportButton";
import BudgetScreenshotButton from "./BudgetScreenshotButton";
import BudgetDeleteButton from "./BudgetDeleteButton";
import { useState } from "react";
import BudgetCompatibilityButton from "./BudgetCompatibilityButton";
import BudgetCompatibilityContainer from "./BudgetCompatibilityContainer";

export default function BudgetEditDesktop({
  budget,
  setBudget,
  budgetCategories,
  pricingEntries,
}: {
  budget: Budget;
  setBudget: Function;
  budgetCategories: Category[];
  pricingEntries: PricingEntriesProps[];
}) {
  const [compatibility, setCompatibility] = useState<CompatibilityOrNull>(null);

  let totalPrice = new currency(0, { precision: 0 });
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
          precision: 0,
        })
      );
    }
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        alignContent="center"
        justifyContent="space-between"
      >
        <Typography variant="h5">{budget.name}</Typography>
        <Typography variant="h5" fontWeight={600} color="primary">
          Total: {totalPrice.format()}
        </Typography>
      </Stack>

      {pricingEntries.length === 0 && (
        <Alert severity="info">
          ¡Tu cotización está vacía! Navega por los productos de SoloTodo y haz
          click en &quot;Agregar a cotización&quot; para incluirlos.
        </Alert>
      )}

      {budget.entries.map((e) => (
        <BudgetRow
          key={e.id}
          budgetEntry={e}
          pricingEntries={pricingEntries}
          setBudget={setBudget}
        />
      ))}

      <Stack alignItems="center" spacing={2}>
        <Typography variant="h2" fontWeight={600} color="primary">
          Total: {totalPrice.format()}
        </Typography>
        <Box
          sx={{
            border: "1px solid #F2F2F2",
            borderRadius: "4px",
            width: "100%",
            padding: 2,
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            paddingY={3}
            justifyContent="center"
          >
            <BudgetSelectBestPricesButton
              budget={budget}
              setBudget={setBudget}
            />
            <BudgetEntryCreateButton
              budget={budget}
              budgetCategories={budgetCategories}
              setBudget={setBudget}
            />
            <BudgetExportButton budget={budget} />
            <BudgetScreenshotButton budget={budget} />
            <BudgetCompatibilityButton
              budget={budget}
              setCompatibility={setCompatibility}
            />
            <BudgetDeleteButton budget={budget} />
          </Stack>
          <BudgetCompatibilityContainer compatibility={compatibility} />
        </Box>
      </Stack>
    </Stack>
  );
}
