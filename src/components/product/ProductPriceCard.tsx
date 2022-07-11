import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import currency from "currency.js";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity } from "src/frontend-utils/types/entity";
import { useAppSelector } from "src/store/hooks";
import { RatedStore } from "./types";

export default function ProductPriceCard({
  first,
  entity,
  ratedStores,
}: {
  first: boolean;
  entity: Entity;
  ratedStores: Record<string, RatedStore>;
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  return (
    <Card
      sx={{
        bgcolor: "transparent",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: first ? "primary.main" : "background.neutral",
        borderRadius: 1,
      }}      
    >
      <CardActionArea href={entity.external_url} target="_blank">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              bgcolor: first ? "primary.main" : "#7B7B7B",
              p: 0.8,
              borderEndEndRadius: 10,
              display: "inline-block",
            }}
          >
            <Typography variant="h6" fontWeight={500} color="common.white">
              {apiResourceObjects[entity.store].name} 
              {/* usar seller en entidad si hay */}
            </Typography>
          </Box>
          {ratedStores[entity.store] && (
            <>
              <Rating
                name="read-only"
                value={ratedStores[entity.store].rating}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography color="text.secondary">
                {Math.round(ratedStores[entity.store].rating * 10) / 10}
              </Typography>
            </>
          )}
        </Stack>
        <CardContent style={{ padding: 8 }}>
          <Stack direction="row" spacing={1} justifyContent="space-evenly">
            <Stack>
              <Typography variant="h6" color="text.secondary">
                Precio normal
              </Typography>
              <Typography variant="h2" color="text.extra">
                {currency(entity.active_registry!.normal_price, {
                  precision: 0,
                }).format()}
              </Typography>
            </Stack>
            <Divider orientation="vertical" />
            <Stack>
              <Typography variant="h6" color="text.secondary">
                Precio oferta
              </Typography>
              <Typography variant="h2" color="text.extra">
                {currency(entity.active_registry!.offer_price, {
                  precision: 0,
                }).format()}
              </Typography>
            </Stack>
          </Stack>
          {entity.condition !== "https://schema.org/NewCondition" && (
            <Stack sx={{ alignItems: "center" }}>
              <Chip
                label="Reacondicionado"
                color="warning"
                size="small"
                sx={{ borderRadius: 1 }}
              />
            </Stack>
          )}
          {/* <Typography variant="body2" color="text.secondary">
          Liberado, Incluye audifonos galaxy Buds pro
        </Typography> */}
        {/* cell plan y bundle */}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
