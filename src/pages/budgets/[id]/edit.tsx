import { GetServerSideProps } from "next/types";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// components
import Page from "src/components/Page";
import BudgetRow from "src/components/budget/BudgetRow";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
// types 
import { Budget } from "src/components/budget/types";
import { PATH_MAIN } from "src/routes/paths";
import { constants } from "src/config";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";

export default function BudgetEdit({ budget }: { budget: Budget }) {
  console.log(budget)
  return (
    <Page title="Cotización">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            { name: "Cotizaciones", href: `${PATH_MAIN.budgets}/1232939` },
            { name: budget.name },
          ]}
        />
        <Stack spacing={3}>
          <Stack
            direction="row"
            alignContent="center"
            justifyContent="space-between"
          >
            <Typography variant="h5">{budget.name}</Typography>
            <Typography variant="h5" fontWeight={600} color="primary">
              Total: $249.990
            </Typography>
          </Stack>

          <BudgetRow />
          <BudgetRow />
          <BudgetRow />
          <BudgetRow />
          <BudgetRow />

          <Stack alignItems="center" spacing={2}>
            <Typography variant="h2" fontWeight={600} color="primary">
              Total: $249.990
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
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const budget = await jwtFetch(
      context,
      `${constants.apiResourceEndpoints.budgets}${context.params?.id}/`
    );
    return {
      props: {
        budget: budget,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
