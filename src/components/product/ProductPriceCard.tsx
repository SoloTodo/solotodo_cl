import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Drawer,
  Rating,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import currency from "currency.js";
import { useState } from "react";
import { constants } from "src/config";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Entity, InLineProduct } from "src/frontend-utils/types/entity";
import { Store } from "src/frontend-utils/types/store";
import { useAppSelector } from "src/store/hooks";
import { calcEntityPrice } from "src/utils/calcEntityPrice";
import SoloTodoLeadLink from "../SoloTodoLeadLink";
import ProductOrStoreRatingDrawer from "./ProductOrStoreRatingDrawer";
import { RatedStore } from "./types";

export default function ProductPriceCard({
  entity,
  ratedStores,
}: {
  entity: Entity;
  ratedStores: Record<string, RatedStore>;
}) {
  const [openStoreComments, setOpenStoreComments] = useState(false);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const store = apiResourceObjects[entity.store] as Store;
  const category = apiResourceObjects[entity.category];
  const offerPriceLabel = (
    constants.storeOfferPriceLabel as Record<number, string | undefined>
  )[store.id];
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  return (
    <Card
      sx={{
        bgcolor: "transparent",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: isLight ? "#F2F2F2" : "rgba(196, 196, 196, 0.3)",
        borderRadius: 0.5,
        "&:hover": {
          borderColor: "primary.main",
        },
        "&:hover .box": {
          bgcolor: "primary.main",
        },
        "&:hover .storeName": {
          color: "common.white",
        },
        position: "relative",
      }}
    >
      <Drawer
        anchor="right"
        open={openStoreComments}
        onClose={() => setOpenStoreComments(false)}
      >
        <ProductOrStoreRatingDrawer
          productOrStore={store}
          onClose={() => setOpenStoreComments(false)}
          isStore
        />
      </Drawer>

      {ratedStores[entity.store] && (
        <Button
          onClick={() => setOpenStoreComments(true)}
          sx={{ position: "absolute", right: "0px", paddingRight: 0 }}
        >
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
        </Button>
      )}

      <SoloTodoLeadLink
        entity={entity}
        storeEntry={store}
        product={entity.product as InLineProduct}
        buttonType={true}
      >
        <Box
          className="box"
          sx={{
            bgcolor: isLight ? "#F2F2F2" : "rgba(196, 196, 196, 0.3)",
            p: 0.8,
            borderEndEndRadius: 10,
            display: "inline-block",
            maxWidth: "55%",
          }}
        >
          <Typography
            className="storeName"
            fontWeight={400}
            color="text.extra"
            noWrap
          >
            {store.name}
            {entity.seller ? ` | ${entity.seller}` : null}
          </Typography>
        </Box>

        <CardContent style={{ padding: 8 }}>
          <Stack spacing={0.5}>
            {entity.condition !== "https://schema.org/NewCondition" && (
              <Stack sx={{ alignItems: "end" }}>
                <Chip
                  label="Reacondicionado"
                  size="small"
                  sx={{
                    borderRadius: 0.5,
                    fontSize: "12px",
                    fontWeight: 400,
                    color: "#CD6131",
                    backgroundColor: "#FFF0E7",
                  }}
                />
              </Stack>
            )}
            <Stack direction="row" spacing={{ xs: 1, md: 2 }} justifyContent="space-around">
              <Stack>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight={400}
                >
                  {offerPriceLabel ? offerPriceLabel : "Precio efectivo"}
                </Typography>
                <Typography variant="h2" color="text.extra" fontWeight={400}>
                  {currency(calcEntityPrice(entity, "offer_price"), {
                    separator: ".",
                    precision: 0,
                  }).format()}
                </Typography>
              </Stack>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ border: "1px solid #7B7B7B" }}
              />
              <Stack>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  fontWeight={400}
                >
                  Precio normal
                </Typography>
                <Typography variant="h2" color="text.extra" fontWeight={400}>
                  {currency(entity.active_registry!.normal_price, {
                    separator: ".",
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
              ? `Incluye ${entity.bundle.name}`
              : ""}
            {category.id === constants.cellPhoneCategoryId && entity.bundle
              ? `, incluye ${entity.bundle.name}`
              : null}
          </Typography>
        </CardContent>
      </SoloTodoLeadLink>
    </Card>
  );
}
