import type { NextPage } from "next";
import { Container, Typography } from "@mui/material";
import Page from "../components/Page";

const Home: NextPage = () => {
  return (
    <Page title="Inicio">
      <Container maxWidth={false}>
        <Typography variant="h3" component="h1" paragraph>
          SoloTodo Cl
        </Typography>
      </Container>
    </Page>
  );
};

export default Home;
