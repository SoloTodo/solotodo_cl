import {
  Box,
  Container,
  Grid,
  Link,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Page from "src/components/Page";
// next
import NextLink from "next/link";
import { useEffect, useState } from "react";
import Iconify from "src/components/Iconify";
import { useRouter } from "next/router";
import { useGtag3 } from "src/hooks/useGtag3";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
    icon: <Box component={Iconify} icon={"eva:arrow-ios-forward-fill"} />,
    iconPosition: "end" as "end",
  };
}

export default function LegalInformation() {
  const theme = useTheme();
  const router = useRouter();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (Number(router.query.tab)) setValue(Number(router.query.tab));
  }, [router.query.tab]);

  useGtag3({});
  return (
    <Page title="Cotiza y compara los precios de todas las tiendas">
      <Container>
        <Typography gutterBottom variant="h3">
          Información legal
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            {useMediaQuery(theme.breakpoints.up("md")) ? (
              <Tabs
                orientation="vertical"
                value={value}
                onChange={(_, newValue) => setValue(newValue)}
                sx={{ borderRight: 1, borderColor: "divider" }}
              >
                <Tab
                  label="Términos y condiciones"
                  {...a11yProps(0)}
                  sx={{ width: "100%", justifyContent: "start" }}
                  wrapped
                />
                <Tab
                  label="Preguntas frecuentes"
                  {...a11yProps(1)}
                  sx={{ width: "100%", justifyContent: "start" }}
                  wrapped
                />
                <Tab
                  label="Políticas"
                  {...a11yProps(2)}
                  sx={{ width: "100%", justifyContent: "start" }}
                  wrapped
                />
              </Tabs>
            ) : (
              <Select
                value={value}
                label="Age"
                onChange={(evt) => setValue(evt.target.value as number)}
                fullWidth
                sx={{ textAlign: "center" }}
              >
                <MenuItem value={0}>Términos y condiciones</MenuItem>
                <MenuItem value={1}>Preguntas frecuentes</MenuItem>
                <MenuItem value={3}>Políticas</MenuItem>
              </Select>
            )}
          </Grid>
          <Grid item xs={12} md={9}>
            <TabPanel value={value} index={0}>
              <Typography
                variant="h2"
                component="h1"
                color="#3B5D81"
                gutterBottom
                fontWeight={400}
              >
                Condiciones de servicio
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                La utilización de este sitio web, supone la aceptación plena y
                sin reservas de la totalidad de las condiciones generales de uso
                que se relacionan a continuación, siendo aplicables, igualmente,
                a la información, aplicaciones y servicios a los que se puede
                acceder a través de la misma.
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                1.- SoloTodo realiza su mejor esfuerzo para mantener la
                información actualizada, evitar errores u omisiones. Sin
                embargo, no asume ningún tipo de responsabilidad respecto a la
                integridad y exactitud respecto de la misma. Constituyéndose
                sólo con fines referenciales.
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                2.- Para el correcto funcionamiento del sitio podrá requerirse
                el uso de cookies
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                3.- Los precios y características de los equipos publicados o
                constituyen en caso alguno parte de una oferta o invitación a
                contratar. Siendo sólo información de referencia que deberá ser
                corroborada con los respectivos oferentes en vistas a posibles y
                futuras operaciones o actos jurídicos, de los que SoloTodo no
                formará parte, a menos que así lo estipule su representante
                legítimo.
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                4.- SoloTodo podrá suprimir, modificar, y actualizar de forma
                unilateral y arbitraria la información, configuración y
                contenido del sitio. Así como sus condiciones y términos de uso
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                5.- El acceso y uso de este sitio web se ajustará a la ley, la
                moral, las buenas costumbres, el orden público y a las presentes
                condiciones y términos de uso. De modo que debe abstenerse de
                usos lesivos contra derechos de terceros.
              </Typography>
              <br />
              <Typography
                variant="h2"
                component="h1"
                color="#3B5D81"
                gutterBottom
                fontWeight={400}
              >
                Acerca de la extensión para Google Chrome
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                SoloTodo pone a disposición de su comunidad una extensión para
                el navegador Google Chrome, disponible en{" "}
                <NextLink
                  href="https://chrome.google.com/webstore/detail/solotodo/dnacbdkmnedgahgcogbeecmgjlmkjgpf"
                  passHref
                >
                  <Link variant="h5" fontWeight={400}>
                    este link
                  </Link>
                </NextLink>
                . Dicha extensión revisa si se está visualizando la ficha de un
                producto en las siguientes tiendas:
              </Typography>

              <Box paddingBottom={1} paddingLeft={6}>
                <ul>
                  <li>Falabella Chile</li>
                  <li>Ripley Chile</li>
                  <li>Paris</li>
                  <li>AbcDin</li>
                  <li>La Polar</li>
                  <li>PC Factory</li>
                  <li>Corona</li>
                  <li>Linio Chile</li>
                  <li>Bip</li>
                  <li>HP Online</li>
                  <li>Infor Ingen</li>
                  <li>Magens</li>
                  <li>PC Express</li>
                  <li>Reif Store</li>
                  <li>Sistemax</li>
                  <li>TT Chile</li>
                  <li>Wei</li>
                  <li>Tienda Smart</li>
                  <li>Hites</li>
                  <li>Lider</li>
                  <li>NetNow</li>
                  <li>Vivelo</li>
                  <li>Sodimac</li>
                  <li>Sony Store</li>
                  <li>SpDigital</li>
                  <li>Winpy</li>
                </ul>
              </Box>

              <Typography variant="h5" gutterBottom fontWeight={400}>
                Si dicho producto está catalogado en SoloTodo y está disponible
                a mejor precio en alguna otra tienda, muestra una notificación
                en su ícono del navegador.
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                Para proveer esta funcionalidad, la extensión envía
                continuamente información acerca de la URL siendo visualizada en
                las tiendas antes mencionadas anteriormente a los servidores de
                SoloTodo. Acerca de esta información, SoloTodo sólo la utiliza
                para buscar el producto correspondiente,{" "}
                <strong>
                  no la almacena ni la utiliza para ningún otro fin
                </strong>
                , en particular SoloTodo no almacena ninguna información que
                permita identificar a una persona a partir de este servicio.
              </Typography>
            </TabPanel>
            <TabPanel value={value} index={1}>
              UNO
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                Para el correcto funcionamiento de SoloTodo.com el sitio
                almacena información acerca de sus visitantes y usuarios en{" "}
                <em>cookies</em> del navegador y en nuestra base de datos
                interna.
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                Esta página detalla la información guardada por SoloTodo.com y
                el uso que se le da.
              </Typography>
              <Typography
                variant="h2"
                component="h1"
                color="#3B5D81"
                gutterBottom
                fontWeight={400}
              >
                Información guardada
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                SoloTodo almacena la siguiente información de sus visitantes:
              </Typography>
              <Box paddingBottom={1} paddingLeft={6}>
                <ul>
                  <li>
                    Preferencia regional de país y tiendas en donde cotizar
                  </li>
                  <li>
                    Correo electrónico en el caso de suscribirse a los cambios
                    de precios de un producto
                  </li>
                  <li>
                    Correo electrónico en el caso de registrarse como usuario
                    usando el sistema interno de SoloTodo
                  </li>
                  <li>
                    Correo electrónico, nombre completo e ID de Facebook en el
                    caso de iniciar sesión en SoloTodo usando esta red social
                  </li>
                  <li>
                    Cotizaciones de PCs desktop hechas por usuarios registrados{" "}
                  </li>
                </ul>
              </Box>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                Adicionalmente, los siguientes servicios de terceros usados por
                SoloTodo también pueden almacenar información, sujeto a sus
                propias políticas de privacidad.
              </Typography>
              <Box paddingBottom={1} paddingLeft={6}>
                <ul>
                  <li>
                    Facebook: En el caso de utilizar el inicio de sesión con
                    esta red social
                  </li>
                  <li>
                    Google: Como parte de sus plataformas de AdSense
                    (publicidad) y Analytics (métricas de uso del sitio)
                  </li>
                  <li>
                    Disqus: Como parte del sistema de comentarios presente en
                    las fichas de producto y cotizaciones del sitio.
                  </li>
                </ul>
              </Box>
              <Typography
                variant="h2"
                component="h1"
                color="#3B5D81"
                gutterBottom
                fontWeight={400}
              >
                Sobre el uso de la información guardada
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                SoloTodo respeta la privacidad y confidencialidad de nuestros
                usuarios, comprometiéndonos a las siguientes políticas de uso de
                información:
              </Typography>
              <Box paddingBottom={1} paddingLeft={6}>
                <ul>
                  <li>
                    SoloTodo no compartirá ningún tipo de información
                    identificable (correo electrónico, nombre, usuario de
                    Facebook, etc) con ninguno de nuestros socios comerciales en
                    ningún caso
                  </li>

                  <li>
                    SoloTodo podrá enviar correos con ofertas o promociones a
                    nuestra base de usuarios (si es que han aceptado
                    recibirlos), y siempre con la opción de desuscribirse de
                    dicha lista de correos.
                  </li>

                  <li>
                    SoloTodo extrae información estadística sobre el tráfico
                    dentro de SoloTodo.com. Dicha información no contienen
                    ningun dato identificable de ninguno de sus usuarios.
                  </li>
                </ul>
              </Box>
              <Typography
                variant="h2"
                component="h1"
                color="#3B5D81"
                gutterBottom
                fontWeight={400}
              >
                Solicitud de eliminación de datos y cuenta
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                Si por cualquier motivo se desea eliminar la cuenta del usuario
                o cualquier información identificable del mismo (alertas de
                cambios de precio, cotizaciones, etc) se puede solicitar a
                través del{" "}
                <NextLink href="/data_deletion" passHref>
                  <Link variant="h5" fontWeight={400}>
                    formulario de contacto de SoloTodo
                  </Link>
                </NextLink>
                , en donde será respondida en dos día hábiles o menos
              </Typography>
              <Typography
                variant="h2"
                component="h1"
                color="#3B5D81"
                gutterBottom
                fontWeight={400}
              >
                Sobre el acceso a sitios de terceras partes
              </Typography>
              <Typography variant="h5" gutterBottom fontWeight={400}>
                Como parte de su funcionamiento SoloTodo deriva tráfico a sitios
                de e-commerce de terceras partes, que pueden tener sus propias
                polícias de privacidad y términos de servicio. SoloTodo no se
                hace responsable de la confidencialidad de la información de sus
                usuarios una vez que hayan abandonado el sitio de SoloTodo.com.
              </Typography>
            </TabPanel>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
