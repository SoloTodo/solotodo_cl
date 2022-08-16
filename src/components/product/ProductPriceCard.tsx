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
import { Entity, InLineProduct } from "src/frontend-utils/types/entity";
import { Store } from "src/frontend-utils/types/store";
import { useAppSelector } from "src/store/hooks";
import SoloTodoLeadLink from "../SoloTodoLeadLink";
import { RatedStore } from "./types";

export default function ProductPriceCard({
  entity,
  ratedStores,
}: {
  entity: Entity;
  ratedStores: Record<string, RatedStore>;
}) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const store = apiResourceObjects[entity.store] as Store;
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
        borderColor: "background.neutral",
        borderRadius: 1,
        "&:hover": {
          borderColor: "primary.main",
        },
        "&:hover .box": {
          bgcolor: "primary.main",
        },
      }}
    >
      <SoloTodoLeadLink
        entity={entity}
        storeEntry={store}
        product={entity.product as InLineProduct}
        buttonType={true}
      >
        <CardActionArea>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            justifyContent="space-between"
          >
            <Box
              className="box"
              sx={{
                bgcolor: "#7B7B7B",
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
      </SoloTodoLeadLink>
    </Card>
  );
}
