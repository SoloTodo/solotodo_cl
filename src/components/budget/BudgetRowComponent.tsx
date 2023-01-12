import NextLink from "next/link";
import {
  Box,
  Button,
  Grid,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Category, Store } from "src/frontend-utils/types/store";
import { Entry } from "./types";
import { PricingEntriesProps } from "../product/types";
import { Entity, InLineProduct } from "src/frontend-utils/types/entity";
import currency from "currency.js";
import BudgetEntryDeleteButton from "./BudgetEntryDeleteButton";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import LinkIcon from "@mui/icons-material/Link";
import SoloTodoLeadLink from "../SoloTodoLeadLink";

type BudgetRowComponentProps = {
  budgetEntry: Entry;
  category: Category;
  pricingEntries: PricingEntriesProps[];
  matchingPricingEntry: PricingEntriesProps;
  filteredEntities: Entity[];
  matchingEntity: Entity;
  selectedProduct: string;
  selectedProductHref: string;
  stores: Store[];
  handleProductSelect: (e: SelectChangeEvent<string>) => void;
  handleStoreSelect: (e: SelectChangeEvent<string>) => void;
  setBudget: Function;
};

export default function BudgetRowComponent(props: BudgetRowComponentProps) {
  const {
    budgetEntry,
    category,
    filteredEntities,
    matchingEntity,
    matchingPricingEntry,
    pricingEntries,
    selectedProduct,
    selectedProductHref,
    stores,
    handleProductSelect,
    handleStoreSelect,
    setBudget,
  } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

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
          <Link color="info.main">{category.name}</Link>
        </NextLink>
      </Box>
      <Grid
        container
        spacing={2}
        padding={3}
        paddingTop={2}
        alignItems="center"
        justifyContent="flex-end"
      >
        {pricingEntries.length ? (
          <>
            <Grid item xs={9} md={4} lg={4}>
              <Select
                name="Producto"
                fullWidth
                inputProps={{ sx: { padding: 1 } }}
                value={selectedProduct || ""}
                onChange={handleProductSelect}
              >
                {pricingEntries.map((pricingEntry) => (
                  <MenuItem
                    key={pricingEntry.product.url}
                    value={pricingEntry.product.url}
                  >
                    {pricingEntry.product.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={3} md={1} lg={1.5}>
              <NextLink href={selectedProductHref} passHref>
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  fullWidth
                  sx={{
                    textTransform: "none",
                    padding: 1,
                    textAlign: "center",
                  }}
                >
                  {isMobile ? <ArrowForwardIosIcon /> : "Ir al producto"}
                </Button>
              </NextLink>
            </Grid>
            {matchingEntity ? (
              <>
                <Grid item xs={9} md={4} lg={4}>
                  <Select
                    name="Tienda"
                    fullWidth
                    inputProps={{ sx: { padding: 1 } }}
                    value={matchingEntity.store || ""}
                    onChange={handleStoreSelect}
                  >
                    {filteredEntities.map((entity) => {
                      const store = stores.filter(
                        (store) => store.url === entity.store
                      )[0];
                      if (typeof entity.active_registry === "undefined") {
                        return null;
                      }
                      return (
                        <MenuItem key={store.url} value={store.url}>
                          {currency(entity.active_registry.offer_price, {
                            separator: ".",
                            precision: 0,
                          }).format()}{" "}
                          - {store.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </Grid>
                <Grid item xs={3} md={1} lg={1.5}>
                  <SoloTodoLeadLink
                    entity={matchingEntity}
                    storeEntry={
                      stores.filter(
                        (store) => store.url === matchingEntity.store
                      )[0]
                    }
                    product={matchingEntity.product as InLineProduct}
                    buttonType={true}
                  >
                    <Button
                      variant="contained"
                      color="info"
                      size="small"
                      fullWidth
                      sx={{ textTransform: "none", padding: 1 }}
                    >
                      {isMobile ? <LinkIcon /> : "Ir a la tienda"}
                    </Button>
                  </SoloTodoLeadLink>
                </Grid>
              </>
            ) : (
              <Grid item xs={12} md={5} lg={5.5}>
                <Typography>
                  Este producto no esta disponible actualmente
                </Typography>
              </Grid>
            )}
          </>
        ) : (
          <Grid item xs={12} md={10} lg={11}>
            <Typography>
              No hay productos ingresados para esta categoría
            </Typography>
          </Grid>
        )}
        <Grid item xs={4} md={2} lg={1}>
          <BudgetEntryDeleteButton
            matchingPricingEntry={matchingPricingEntry}
            budgetEntry={budgetEntry}
            category={category}
            setBudget={setBudget}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
