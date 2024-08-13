import { m } from "framer-motion";
// next
import NextLink from "next/link";
// @mui
import { styled } from "@mui/material/styles";
import { Box, Button, Typography, Container, Grid } from "@mui/material";

// components
import Page from "../components/Page";
import { MotionContainer, varBounce } from "../components/animate";
// assets
import Image from "next/image";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  height: "100%",
  alignItems: "center",
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}));

export default function Page404() {
  return (
    <Page title="Página no encontrada (404)" sx={{ height: 1 }}>
      <RootStyle>
        <Container component={MotionContainer}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Box sx={{ maxWidth: 480, margin: "auto" }}>
                <Typography variant="h4" sx={{ color: "text.secondary" }}>
                  Error 404
                </Typography>
                <m.div variants={varBounce().in}>
                  <Typography variant="h1">
                    La página que buscas no existe
                  </Typography>
                </m.div>
                <Typography sx={{ color: "text.secondary" }}>
                  Es muy probable que este contenido ya no esté disponible o que
                  la url esté mal escrita
                </Typography>
                <br />
                <NextLink href="/" legacyBehavior>
                  <Button
                    size="large"
                    variant="contained"
                    color="secondary"
                    sx={{ borderRadius: 3 }}
                  >
                    VOLVER AL HOME
                  </Button>
                </NextLink>
              </Box>
            </Grid>
            <Grid item>
              <m.div variants={varBounce().in}>
                <Box
                  borderRadius={15}
                  marginTop={5}
                  sx={{
                    position: "absolute",
                    width: "240px",
                    height: "240px",
                    background: "rgba(205, 97, 49, 0.2)",
                  }}
                />
                <Image
                  src={"/BasicMoves2.png"}
                  alt={"Página no encontrada"}
                  width={257}
                  height={395}
                />
              </m.div>
            </Grid>
          </Grid>
        </Container>
      </RootStyle>
    </Page>
  );
}
