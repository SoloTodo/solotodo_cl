import { Typography } from "@mui/material";
import { useContext } from "react";
import ApiFormContext from "src/frontend-utils/api_form/ApiFormContext";
import { ApiFormPagination } from "src/frontend-utils/api_form/fields/pagination/ApiFormPagination";

export default function CategoryCountSummary() {
  const context = useContext(ApiFormContext);
  const data = context.currentResult;
  const field = context.getField("pagination") as ApiFormPagination | undefined;

  if (typeof field === "undefined") {
    throw `Invalid field name: pagination`;
  }

  return (
    <Typography variant="h5" color="primary" fontWeight={400}>
      {data ? data.count : 0} resultados
    </Typography>
  );
}
