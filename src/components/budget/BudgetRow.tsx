import { Box, Grid } from "@mui/material";

export default function BudgetRow() {
  return (
    <Box
      sx={{
        border: "1px solid #F2F2F2",
        borderRadius: "4px",
        padding: 2
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={4}></Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={4}></Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </Box>
  );
}
