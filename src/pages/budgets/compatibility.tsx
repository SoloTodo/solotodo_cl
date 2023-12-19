import { Box, Container, Divider, Typography } from "@mui/material";
import Page from "src/components/Page";
import { DiscussionEmbed } from 'disqus-react';
import { constants } from "src/config";
import { useGtag3 } from "src/hooks/useGtag3";
import { useGtag4 } from "src/hooks/useGtag4";

export default function Compatibility() {
  useGtag3({});
  useGtag4({ pageTitle: "Chequeo automático de compatibilidad" });
  const config = {
      url: 'https://www.solotodo.com/budgets/compatibility',
      identifier: 'budget_compatibility',
  }
  return (
    <Page title="Chequeo automático de compatibilidad">
      <Container>
        <Box margin="auto" width={{ xs: "100%", md: "70%" }}>
          <Typography gutterBottom variant="h3">
            Chequeo automático de compatibilidad
          </Typography>
          <Typography variant="h5" gutterBottom>
            Las cotizaciones de SoloTodo incluyen una herramienta automática de{" "}
            <strong>chequeo básico de compatibilidad</strong> entre sus piezas.
          </Typography>
          <Typography variant="h5" gutterBottom>
            El sistema verifica los errores más comunes al hacer una cotización,
            pero <strong>no comprueba todos los casos posibles</strong>. Además
            no verifica si la cotización es equilibrada entre sus piezas.
          </Typography>
          <Typography variant="h5" gutterBottom>
            Finalmente, la herramienta{" "}
            <strong>se entrega sólo como referencia</strong>. Una cotización
            marcada sin errores por la herramienta no es necesariamente
            compatible, ni viceversa.
          </Typography>
          <Typography variant="h2" component="h1" color="#3B5D81" gutterBottom>
            Qué cosas SÍ chequea
          </Typography>
          <Box paddingBottom={1} paddingLeft={6}>
            <ul>
              <li>
                Que tenga a lo más un procesador, placa madre, fuente de poder,
                y gabinete
              </li>
              <li>Que la tarjeta de video entre en el gabinete</li>
              <li>
                Que tenga salida de video (o sea, que tenga gráficos integrados
                o una tarjeta de video dedicada)
              </li>
              <li>
                Si es SLI / Crossfire, que sea compatible y que la placa madre
                aguante la configuración
              </li>
              <li>Que el procesador y placa madre sean del mismo socket</li>
              <li>Que la placa madre entre en el gabinete</li>
              <li>Que la placa madre soporte la cantidad de sticks de ram</li>
              <li>
                Que los sticks de ram sean de desktop y no de servidor o
                notebook
              </li>
              <li>
                Que el tipo de RAM sea la correcta (DDR4 o DDR5).
              </li>
              <li>Que los discos duros entren en el gabinete</li>
              <li>
                Que los discos duros sean para desktop y no para notebook o
                servidor
              </li>
              <li>Si incluye fuente de poder pero el gabinete ya tiene una</li>
              <li>
                Si uno trata de armar un equipo con tarjeta de video dedicada
                pero usando una fuente incluida con el gabinete
              </li>
              <li>
                Si el cooler es compatible con el socket de la placa madre /
                procesador
              </li>
              <li>Si el cooler entra en el gabinete</li>
              <li>
                Si el procesador no viene con cooler y la cotización no incluye
                uno. Igualmente si el procesador ya viene con un cooler pero la
                cotización además incluye uno.
              </li>
            </ul>
          </Box>
          <Typography variant="h2" component="h1" color="#3B5D81" gutterBottom>
            Qué cosas NO chequea
          </Typography>
          <Box paddingBottom={1} paddingLeft={6}>
            <ul>
              <li>
                Que la fuente de poder incluya los conectores de energía
                necesarios (especialmente para la tarjeta de video)
              </li>
              <li>
                Que la fuente de poder tenga la potencia necesaria para levantar
                el PC
              </li>
              <li>
                Si el procesador es para overclock y la placa no (o viceversa)
              </li>
              <li>
                Si el gabinete es slim entonces solo es compatible con tarjetas
                de video low profile
              </li>
              <li>
                Si el gabiente tiene los espacios necesarios para un cooler
                líquido.
              </li>
            </ul>
          </Box>
          <Divider sx={{ margin: 2 }} />
          <Typography variant="h3" gutterBottom>
            Se dejan los comentarios abiertos por si alguien encuentra un error
            o tiene alguna observación sobre el sistema de compatiblidad.
          </Typography>
          <Typography variant="h3" gutterBottom>
            Cualquier pregunta sobre la compatibilidad de una cotización será
            eliminada.
          </Typography>
        </Box>
        <DiscussionEmbed
          shortname={constants.disqusShortName}
          config={config}
        />
      </Container>
    </Page>
  );
}
