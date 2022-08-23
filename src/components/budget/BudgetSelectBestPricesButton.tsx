import { Button } from "@mui/material";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import useSettings from "src/hooks/useSettings";
import { Budget } from "./types";

export default function BudgetSelectBestPricesButton({
  budget,
  setBudget,
}: {
  budget: Budget;
  setBudget: Function;
}) {
  const { prefStores } = useSettings();

  const selectBestPrices = () => {
    const formData = { stores: prefStores };
    fetchAuth(null, `budgets/${budget.id}/select_cheapest_stores/`, {
      method: "POST",
      body: JSON.stringify(formData),
    }).then(() => setBudget());
  };

  return (
    <Button
      variant="outlined"
      color="info"
      onClick={selectBestPrices}
      fullWidth
    >
      Seleccionar mejores precios
    </Button>
  );
}
