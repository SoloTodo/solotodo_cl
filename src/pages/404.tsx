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
import { PageNotFoundIllustration } from "../assets";

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
    <Page title="404 Page Not Found" sx={{ height: 1 }}>
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
                <NextLink href="/">
                  <Button size="large" variant="contained">
                    Go to Home
                  </Button>
                </NextLink>
              </Box>
            </Grid>
            <Grid item>
              <m.div variants={varBounce().in}>
                <PageNotFoundIllustration
                  sx={{ height: 260, my: { xs: 5, sm: 10 } }}
                />
              </m.div>
            </Grid>
          </Grid>
        </Container>
      </RootStyle>
    </Page>
  );
}
