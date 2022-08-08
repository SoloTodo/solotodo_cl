import { Button } from "@mui/material";
import { fetchAuth } from "src/frontend-utils/nextjs/utils";
import { Budget } from "./types";

export default function BudgetCompatibilityButton({
  budget,
  setCompatibility,
}: {
  budget: Budget;
  setCompatibility: Function;
}) {
  const compatibilityCheck = () => {
    fetchAuth(null, `budgets/${budget.id}/compatibility_issues/`).then(
      (compatibilityIssues) => {
        if (
          compatibilityIssues.errors.length ||
          compatibilityIssues.warnings.length
        ) {
          setCompatibility(compatibilityIssues);
        } else {
          setCompatibility({
            success: [
              "Tu cotización no tiene errores o advertencias según " +
                "el sistema de SoloTodo, aunque considera que esta verificación " +
                "no es perfecta y no revisa si tiene cuellos de botella o no.",
            ],
          });
        }
      }
    );
  };

  return (
    <Button
      variant="contained"
      color="success"
      onClick={compatibilityCheck}
      fullWidth
    >
      Chequear compatibilidad
    </Button>
  );
}
