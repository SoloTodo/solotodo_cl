import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import BudgetRow from "./BudgetRow";
import { Budget } from "./types";
import { PricingEntriesProps } from "../product/types";
import currency from "currency.js";

export default function BudgetEditDesktop({
  budget,
  setBudget,
  pricingEntries,
}: {
  budget: Budget;
  setBudget: Function;
  pricingEntries: PricingEntriesProps[];
}) {
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
        new currency(matchingEntity.active_registry.offer_price, { precision: 0 })
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
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            padding={3}
            paddingTop={4}
            justifyContent="center"
          >
            <Button variant="outlined" color="secondary">
              Seleccionar mejores precios
            </Button>
            <Button variant="outlined" color="secondary">
              Agregar componente
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              endIcon={<ArrowDropDownIcon />}
            >
              Exportar
            </Button>
            <Button variant="outlined" color="secondary">
              Obtener pantallazo
            </Button>
            <Button variant="contained" color="success">
              Chequear compatibilidad
            </Button>
            <Button variant="contained" color="error">
              Eliminar
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}
