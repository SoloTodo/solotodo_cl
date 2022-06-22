import type { NextPage } from "next";
import { Container, Typography } from "@mui/material";
import Page from "../components/Page";

const Home: NextPage = () => {
  return (
    <Page title="Cotiza y compara los precios de todas las tiendas">
      <Container maxWidth={false}>
        <Typography variant="h4" component="h1" paragraph>
          Lo más reciente
        </Typography>
        <Typography variant="h4" component="h1" paragraph>
          Lo más visto
        </Typography>
        <Typography variant="h5" component="h1" paragraph>
          Categorías populares
        </Typography>
        <Typography variant="h4" component="h1" paragraph>
          Ofertas del día
        </Typography>
      </Container>
    </Page>
  );
};

export default Home;
