import NextLink from "next/link";
import { Box, Button, Grid, Link, Select, Typography } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Category, Store } from "src/frontend-utils/types/store";
import { Entry } from "./types";
import { PricingEntriesProps } from "../product/types";
import { Entity } from "src/frontend-utils/types/entity";
import currency from "currency.js";

type BudgetRowDesktopProps = {
  budgetEntry: Entry;
  category: Category;
  pricingEntries: PricingEntriesProps[];
  matchingPricingEntry: PricingEntriesProps;
  filteredEntities: Entity[];
  matchingEntity: Entity;
  selectedProduct: string;
  selectedProductHref: string;
  stores: Store[];
};

export default function BudgetRowDesktopComponent(
  props: BudgetRowDesktopProps
) {
  const {
    category,
    filteredEntities,
    matchingEntity,
    pricingEntries,
    selectedProduct,
    selectedProductHref,
    stores,
  } = props;

  return (
    <Box
      sx={{
        border: "1px solid #F2F2F2",
        borderRadius: "4px",
      }}
    >
      <Box
        sx={{
          bgcolor: "#F2F2F2",
          p: 0.5,
          borderEndEndRadius: 4,
          display: "inline-block",
        }}
      >
        <NextLink
          href={`/browse?category_slug=${category.slug}`}
          as={`/${category.slug}`}
          passHref
        >
          <Link color="secondary">{category.name}</Link>
        </NextLink>
      </Box>
      <Grid container spacing={2} padding={3} paddingTop={2}>
        {pricingEntries.length ? (
          <>
            <Grid item xs={4}>
              <Select
                name="Producto"
                fullWidth
                native
                inputProps={{ sx: { padding: 1 } }}
                value={selectedProduct || ""}
              >
                {pricingEntries.map((pricingEntry) => (
                  <option
                    key={pricingEntry.product.url}
                    value={pricingEntry.product.url}
                  >
                    {pricingEntry.product.name}
                  </option>
                ))}
              </Select>
            </Grid>
            <Grid item xs={1.5}>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                fullWidth
                sx={{ textTransform: "none", height: "100%" }}
                href={selectedProductHref}
              >
                Ir al producto
              </Button>
            </Grid>
            {matchingEntity ? (
              <>
                <Grid item xs={4}>
                  <Select
                    name="Tienda"
                    fullWidth
                    native
                    inputProps={{ sx: { padding: 1 } }}
                  >
                    {filteredEntities.map((entity) => {
                      const store = stores.filter(
                        (store) => store.url === entity.store
                      )[0];
                      if (typeof entity.active_registry === "undefined") {
                        return null;
                      }
                      return (
                        <option key={store.url} value={store.url}>
                          {currency(entity.active_registry.offer_price, {
                            precision: 0,
                          }).format()}{" "}
                          - {store.name}
                        </option>
                      );
                    })}
                  </Select>
                </Grid>
                <Grid item xs={1.5}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    fullWidth
                    sx={{ textTransform: "none", height: "100%" }}
                  >
                    Ir a la tienda
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item xs={5.5}>
                <Typography>
                  Este producto no esta disponible actualmente
                </Typography>
              </Grid>
            )}
          </>
        ) : (
          <Grid item xs={11}>
            <Typography>
              No hay productos ingresados para esta categoría
            </Typography>
          </Grid>
        )}
        <Grid item xs={1}>
          <Button
            variant="contained"
            color="error"
            size="small"
            fullWidth
            sx={{ textTransform: "none", height: "100%" }}
            endIcon={<ArrowDropDownIcon />}
          >
            Eliminar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
