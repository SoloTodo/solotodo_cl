import { Container, Stack, Typography } from "@mui/material";
import BudgetRow from "src/components/budget/BudgetRow";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { PATH_MAIN } from "src/routes/paths";

export default function BudgetEdit() {
  const name = "AA";
  return (
    <Page title="Cotización">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            { name: "Cotizaciones", href: `${PATH_MAIN.budgets}/1232939` },
            { name: name },
          ]}
        />
        <Stack
          direction="row"
          alignContent="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography variant="h5">{name}</Typography>
          <Typography variant="h5" fontWeight={600} color="primary">
            Total: $249.990
          </Typography>
        </Stack>

        <Stack spacing={3}>
          <BudgetRow />
          <BudgetRow />
          <BudgetRow />
        </Stack>
      </Container>
    </Page>
  );
}
