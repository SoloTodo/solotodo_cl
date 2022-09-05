// next
import NextLink from "next/link";
import Image from "next/image";
// @mui
import {
  Grid,
  Link,
  Divider,
  Container,
  Typography,
  Stack,
  Box,
  IconButton,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// routes
import { PATH_MAIN } from "src/routes/paths";
// components
import SocialsButton from "../../../components/SocialsButton";
import useSettings from "src/hooks/useSettings";
import NavigationDrawer from "../header/NavigationDrawer";

export default function MainFooter() {
  const settings = useSettings();

  const LINKS = [
    {
      headline: "Legal",
      children: [
        {
          name: "Términos y condiciones",
          href: `${PATH_MAIN.legal_information}?tab=0`,
        },
        {
          name: "Preguntas frecuentes",
          href: `${PATH_MAIN.legal_information}?tab=1`,
        },
        {
          name: "Sobre nosotros",
          href: `${PATH_MAIN.legal_information}?tab=2`,
        },
      ],
    },
    {
      headline: "Contacto",
      children: [
        { name: "Formulario web", href: PATH_MAIN.contacto },
        // { name: "support@minimals.cc", href: "#" },
        // { name: "Los Angeles, 359  Hidden Valley Road", href: "#" },
      ],
    },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor:
          settings.themeMode === "light" ? "#303D53" : "background.paper",
        color: "white",
      }}
    >
      <Divider />
      <Container sx={{ pt: 10 }}>
        <Grid
          container
          justifyContent={{ xs: "center", md: "space-around" }}
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          <Grid item xs={11} sx={{ mb: 3 }}>
            {settings.themeMode === "dark" ? (
              <Link href={PATH_MAIN.root}>
                <Image
                  alt={"Logo"}
                  src="/logo_fondo_oscuro.svg"
                  width={200}
                  height={51}
                />
              </Link>
            ) : (
              <Link href={PATH_MAIN.root}>
                <Image
                  alt={"Logo"}
                  src="/logo_fondo_claro.svg"
                  width={200}
                  height={51}
                />
              </Link>
            )}
          </Grid>
          <Grid item xs={1} sx={{ mb: 3 }} alignSelf="center">
            <IconButton
              color="inherit"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              <ArrowUpwardIcon />
            </IconButton>
          </Grid>
          <Grid item xs={8} md={3}>
            <Typography variant="h6" sx={{ pr: { md: 5 } }}>
              Nuestra misión es ayudar a los consumidores a escoger el producto
              perfecto para sus necesidades y presupuesto.
            </Typography>

            <Stack
              direction="row"
              justifyContent={{ xs: "center", md: "flex-start" }}
              sx={{ mt: 5, mb: { xs: 5, md: 0 } }}
            >
              <SocialsButton
                sx={{ mx: 0.5 }}
                simple={false}
                links={{ instagram: "https://www.instagram.com/solotodo_cl/" }}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
            >
              <Stack key="Navega" spacing={2}>
                <Typography component="p" variant="overline">
                  Navega
                </Typography>
                <NavigationDrawer inFooter />
              </Stack>
              {LINKS.map((list) => (
                <Stack key={list.headline} spacing={2}>
                  <Typography component="p" variant="overline">
                    {list.headline}
                  </Typography>
                  {list.children.map((link) => (
                    <NextLink key={link.name} href={link.href} passHref>
                      <Link
                        color="inherit"
                        variant="body2"
                        sx={{ display: "block" }}
                      >
                        {link.name}
                      </Link>
                    </NextLink>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 5 }} />
        <Typography
          component="p"
          variant="h6"
          sx={{
            mt: 5,
            pb: 5,
            textAlign: "center",
          }}
        >
          SOLOTODO 2022 | Todos los derechos reservados | Santiago de Chile
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          alignItems="center"
          sx={{
            pb: 5,
          }}
        >
          <Typography component="p" variant="h6">
            Diseñado por Elias Arias
          </Typography>
          <IconButton
            href="https://www.instagram.com/eliasisdead/"
            color="inherit"
          >
            <InstagramIcon />
          </IconButton>
        </Stack>
      </Container>
    </Box>
  );
}
