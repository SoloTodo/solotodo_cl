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
import { constants } from "src/config";
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
  const store = apiResourceObjects[entity.store];
  const category = apiResourceObjects[entity.category];
  const offerPriceLabel = (
    constants.storeOfferPriceLabel as Record<number, string | undefined>
  )[store.id];
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
            <Typography fontWeight={500} color="common.white">
              {store.name}
              {entity.seller ? ` | ${entity.seller}` : null}
            </Typography>
          </Box>
          {ratedStores[entity.store] && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.5}
              paddingRight={1}
            >
              <Rating
                name="read-only"
                value={ratedStores[entity.store].rating}
                precision={0.5}
                readOnly
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                {Math.round(ratedStores[entity.store].rating * 10) / 10}
              </Typography>
            </Stack>
          )}
        </Stack>
        <CardContent style={{ padding: 8 }}>
          <Stack spacing={0.5}>
            {entity.condition !== "https://schema.org/NewCondition" && (
              <Stack sx={{ alignItems: "end" }}>
                <Chip
                  label="Reacondicionado"
                  color="warning"
                  size="small"
                  sx={{ borderRadius: 1 }}
                />
              </Stack>
            )}
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
                  {offerPriceLabel ? offerPriceLabel : "Precio efectivo"}
                </Typography>
                <Typography variant="h2" color="text.extra">
                  {currency(entity.active_registry!.offer_price, {
                    precision: 0,
                  }).format()}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {category.id === constants.cellPhoneCategoryId
              ? entity.cell_plan
                ? entity.cell_plan.name
                : "Liberado"
              : entity.bundle
              ? `Incluye ${entity.bundle}`
              : ""}
            {category.id === constants.cellPhoneCategoryId && entity.bundle
              ? `, incluye ${entity.bundle.name}`
              : null}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
