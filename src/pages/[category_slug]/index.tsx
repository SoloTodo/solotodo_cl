import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { constants, HEADER } from "src/config";
import {
  ApiForm,
  ApiFormFieldMetadata,
} from "src/frontend-utils/api_form/ApiForm";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormSliderComponent from "src/frontend-utils/api_form/fields/slider/ApiFormSliderComponent";
import { fetchJson } from "src/frontend-utils/network/utils";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { Category, Subcategory } from "src/frontend-utils/types/store";
import useSettings from "src/hooks/useSettings";
import { PATH_MAIN } from "src/routes/paths";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ApiFormPriceRangeComponent from "src/frontend-utils/api_form/fields/price_range/ApiFormPriceRangeComponent";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import ApiFormPaginationComponent from "src/frontend-utils/api_form/fields/pagination/ApiFormPaginationComponent";
import CategoryBrowse from "src/components/category/CategoryBrowse";
import CategoryCountSummary from "src/components/category/CategoryCountSummary";
import CategoryRemoveFieldsButton from "src/components/category/CategoryRemoveFieldsButton";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ApiFormTreeComponent from "src/frontend-utils/api_form/fields/tree/ApiFormTreeComponent";
import UZIP from "uzip";
import TopBanner from "src/components/TopBanner";
import { useGtag3 } from "src/hooks/useGtag3";
import { useGtag4 } from "src/hooks/useGtag4";
import { ProductsData } from "src/components/product/types";
import currency from "currency.js";
import { MyNextPageContext } from "src/frontend-utils/redux/with-redux-store";
import cookie from "cookie";
import { getSettings } from "src/utils/settings";
import { useCheckStatusCode } from "src/hooks/useCheckStatusCode";
import CategoryAIDisclaimer from "../../components/category/CategoryAIDisclaimer";

const zlib = require("zlib");

// ----------------------------------------------------------------------

type filter = {
  choices: {
    id: number;
    name: string;
    value: string | null;
  }[];
  continuous_range_step: string | null;
  continuous_range_unit: string | null;
  country: string | null;
  id: number;
  label: string;
  name: string;
  type: string;
};

type CategorySpecsFormLayoutProps = {
  category: string;
  fieldsets: {
    id: number;
    label: string;
    filters: filter[];
  }[];
  id: number;
  name: string | null;
  orders: any[];
  url: string;
  website: string;
};

type PropTypes = {
  category: Category;
  subcategory?: Subcategory;
  categorySpecsFormLayout: CategorySpecsFormLayoutProps;
  initialData: string;
  initialResult: any;
  fieldsMetadata: ApiFormFieldMetadata[];
};

// ----------------------------------------------------------------------

function Browse({ data, statusCode }: { data: string; statusCode?: number }) {
  useCheckStatusCode(statusCode);

  const byteArray = Buffer.from(data, "base64");
  const outBuff = UZIP.inflate(byteArray);
  const stringProps = new TextDecoder().decode(outBuff);
  const props = JSON.parse(stringProps);

  const {
    category,
      subcategory,
    categorySpecsFormLayout,
    initialData,
    initialResult,
    fieldsMetadata,
  }: PropTypes = props;

  const { prefExcludeRefurbished, prefStores } = useSettings();
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  const [open, setOpen] = useState(false);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  let storesUrl = "";
  for (const store of prefStores) {
    storesUrl += `&stores=${store}`;
  }

  const filterComponents: JSX.Element[] = [];

  categorySpecsFormLayout.fieldsets.forEach((fieldset) => {
    const fieldFilters: JSX.Element[] = [];
    fieldset.filters.forEach((filter) => {
      if (filter.name === "grocery_categories") {
        fieldFilters.push(
          <AccordionDetails key={filter.id}>
            <ApiFormTreeComponent name={filter.name} label={filter.label} />
          </AccordionDetails>
        );
      } else if (filter.type === "exact") {
        fieldFilters.push(
          <AccordionDetails key={filter.id}>
            <ApiFormSelectComponent
              name={filter.name}
              label={filter.label}
              exact
            />
          </AccordionDetails>
        );
      } else if (filter.type === "gte" || filter.type === "lte") {
        const fullName =
          filter.type === "gte" ? `${filter.name}_min` : `${filter.name}_max`;
        fieldFilters.push(
          <AccordionDetails key={filter.id}>
            <ApiFormSelectComponent name={fullName} label={filter.label} />
          </AccordionDetails>
        );
      } else if (filter.type === "range") {
        fieldFilters.push(
          <AccordionDetails key={filter.id}>
            <ApiFormSliderComponent name={filter.name} label={filter.label} />
          </AccordionDetails>
        );
      }
    });
    filterComponents.push(
      <Grid item xs={12} key={fieldset.label}>
        <Accordion
          sx={{ bgcolor: "transparent" }}
          defaultExpanded={filterComponents.length === 0}
        >
          <AccordionSummary id={fieldset.label} expandIcon={<ExpandMoreIcon />}>
            {fieldset.label}
          </AccordionSummary>
          {fieldFilters.map((f) => f)}
        </Accordion>
        <Divider />
      </Grid>
    );
  });

  const GridFilters = (
    <Grid container spacing={{ xs: 2, md: 3 }} style={{ width: "100%" }}>
      <Grid item xs={12}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <CategoryCountSummary />
          <CategoryRemoveFieldsButton />
        </Stack>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <ApiFormPriceRangeComponent
          name="offer_price_usd"
          label="Precio oferta"
          currencyUsed={
            apiResourceObjects[
              `${constants.apiResourceEndpoints.currencies}1/`
            ] as Currency
          }
        />
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <ApiFormTextComponent name="search" label="Palabras clave" />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {filterComponents.map((f) => f)}
    </Grid>
  );

  const subcategoryOrCategoryName = subcategory ? subcategory.name : category.name

  const onResultsChange = (currentResult: { results: ProductsData[] }) => {
    const params = {
      page_title: `${subcategoryOrCategoryName} | SoloTodo`,
      category: subcategoryOrCategoryName,
      category_id: category.id.toString(),
      items: currentResult.results.map((r, index) => {
        const { product_entries } = r;
        const { product, metadata } = product_entries[0];

        const priceCurrency = metadata.prices_per_currency.find((p) =>
          p.currency.includes(`/${constants.clpCurrencyId}/`)
        );
        const offerPrice = priceCurrency ? priceCurrency.offer_price : 0;

        return {
          item_name: product.name,
          currency: "CLP",
          index: index,
          item_category: apiResourceObjects[product.category].name,
          item_id: product.id,
          price: currency(offerPrice, {
            separator: ".",
            precision: 0,
          }).value,
        };
      }),
      send_to: constants.GA4Id,
    };
    typeof window !== "undefined" &&
      (window as any).gtag("event", "view_item_list", params);
  };

  const subcategoryEndpointParams = subcategory ? `&${subcategory.params}` : ''

  useGtag3({ category: category.name });
  useGtag4({
    pageTitle: subcategoryOrCategoryName,
    category: category.name,
    categoryId: category.id.toString(),
  });

  const headerLinks : {name: string; href?: string}[] = [
    { name: "Home", href: PATH_MAIN.root },
  ]

  if (subcategory) {
    headerLinks.push({ name: category.name, href: '/' + category.slug },)
    headerLinks.push({ name: subcategory.name})
  } else {
    headerLinks.push({ name: category.name })
  }

  return (
    <Page
      title={subcategoryOrCategoryName}
      meta={
        <>
          <meta
            property="og:title"
            content={`Catálogo de ${subcategoryOrCategoryName} - SoloTodo`}
          />
          <meta
            name="description"
            property="og:description"
            content={`Cotiza y ahorra comparando los precios de todos los ${subcategoryOrCategoryName.toLowerCase()} disponibles en el mercado`}
          />
        </>
      }
    >
      <Container>
        <TopBanner category={category.name} />
        <HeaderBreadcrumbs
          heading=""
          links={headerLinks}
        />
        <CategoryAIDisclaimer category={category} />
        <ApiFormComponent
          endpoint={`${category.url}browse/?exclude_refurbished=${prefExcludeRefurbished}${subcategoryEndpointParams}${storesUrl}`}
          fieldsMetadata={fieldsMetadata}
          initialState={{
            initialData: new URLSearchParams(initialData),
            initialResult: initialResult,
          }}
          onResultsChange={onResultsChange}
        >
          <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
            <Grid item xs={12} lg={3}>
              <Typography variant="h2" color="text.extra">
                {subcategoryOrCategoryName}
              </Typography>
            </Grid>
            {useMediaQuery(theme.breakpoints.up("lg")) ? (
              <Grid item xs={3} lg={3} width="100%">
                <ApiFormSelectComponent
                  name="ordering"
                  label="Ordenar por"
                  selectOnly
                />
              </Grid>
            ) : (
              <>
                <Grid item xs={12} md={6} lg={3}>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent={{ xs: "space-between", sm: "start" }}
                  >
                    <CategoryCountSummary />
                    <Divider orientation="vertical" flexItem />
                    <Box width={{ xs: "50%", sm: "25%", md: "35%" }}>
                      <ApiFormSelectComponent
                        name="ordering"
                        label="Ordenar por"
                        selectOnly
                      />
                    </Box>
                    <Button
                      variant="outlined"
                      sx={{
                        width: { xs: "50%", sm: "25%", md: "35%" },
                        justifyContent: "space-between",
                        height: 36.125,
                      }}
                      endIcon={<KeyboardArrowDownIcon />}
                      onClick={() => setOpen(true)}
                      size="small"
                    >
                      Filtrar por
                    </Button>
                  </Stack>
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6}>
              <ApiFormPaginationComponent />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={3}>
            {useMediaQuery(theme.breakpoints.up("lg")) && (
              <Grid item lg={3}>
                {GridFilters}
              </Grid>
            )}
            <Grid item xs={12} lg={9}>
              <CategoryBrowse />
              <br />
              <ApiFormPaginationComponent />
            </Grid>
          </Grid>
          <Drawer
            anchor="left"
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{ sx: { backgroundColor: "transparent" } }}
          >
            <Box
              pt={{
                xs: `${HEADER.DASHBOARD_DESKTOP_HEIGHT}px`,
                md: `${HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT}px`,
              }}
              bgcolor="transparent"
            />
            <Box
              width={{ xs: 300, md: 500 }}
              bgcolor={isLight ? "background.default" : "background.paper"}
              padding={2}
              overflow="auto"
            >
              {GridFilters}
            </Box>
            <Box
              flexGrow={1}
              bgcolor={isLight ? "background.default" : "background.paper"}
            />
          </Drawer>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

Browse.getInitialProps = async (context: MyNextPageContext) => {
  try {
    const category_slug = context.query?.category_slug;
    if (
      context.req &&
      context.query.page_size &&
      Number(context.query.page_size) > 50
    ) {
      const query = context.query;
      delete query.category_slug;
      delete query.page_size;
      delete query.page;
      let queryUrl = "";
      for (const q of Object.keys(query)) {
        if (Array.isArray(query[q])) {
          (query[q] as string[]).map((v: string) => {
            queryUrl += `${q}=${v}&`;
          });
        } else {
          queryUrl += `${q}=${query[q]}&`;
        }
      }
      queryUrl += "page_size=50";

      context.res?.writeHead(302, {
        Location: `/${category_slug}?${queryUrl}`,
      });
      context.res?.end();
      return;
    }

    const reduxStore = context.reduxStore;
    const cookies = cookie.parse(
      context.req ? context.req.headers.cookie || "" : document.cookie
    );
    const settings = getSettings(cookies);
    const { prefExcludeRefurbished, prefStores } = settings;
    let storesUrl = "";
    for (const store of prefStores) {
      storesUrl += `&stores=${store}`;
    }

    const apiResourceObjects = reduxStore.getState().apiResourceObjects;
    const categories = getApiResourceObjects(apiResourceObjects, "categories") as Category[];
    const subcategories = getApiResourceObjects(apiResourceObjects, "subcategories") as Subcategory[];

    const subcategory = subcategories.find(subcategory => subcategory.slug === category_slug)
    const category = categories.find(c => {
      if (c.slug === category_slug) {
        return true
      }
      if (subcategory && subcategory.category == c.url) {
        return true
      }
      return false
    });


    if (typeof category === "undefined") {
      if (context.res) {
        context.res.writeHead(302, {
          Location: "/404",
        });
        context.res.end();
        return {};
      } else {
        return {
          statusCode: 404,
        };
      }
    } else {
      const response = await fetchJson(
        `${constants.apiResourceEndpoints.category_specs_form_layouts}?category=${category.id}&website=${constants.websiteId}`
      );
      let categorySpecsFormLayout: CategorySpecsFormLayoutProps = response[0];
      response.forEach((res: CategorySpecsFormLayoutProps) => {
        if (
          res.website ==
          `${constants.apiResourceEndpoints.websites}${constants.websiteId}/`
        )
          categorySpecsFormLayout = res;
      });

      const fieldsMetadata: ApiFormFieldMetadata[] = [
        {
          fieldType: "pagination" as "pagination",
        },
        {
          fieldType: "text" as "text",
          name: "search",
        },
        {
          fieldType: "price_range" as "price_range",
          name: "offer_price_usd",
        },
        {
          fieldType: "select" as "select",
          name: "ordering",
          choices: [
            {
              value: "offer_price_usd",
              label: "Precio",
            },
            {
              value: "leads",
              label: "Popularidad",
            },
            {
              value: "discount",
              label: "Descuento",
            },
            ...categorySpecsFormLayout.orders.reduce((acc, o) => {
              if (o.suggested_use === "ascending") {
                acc.push({
                  value: o.name,
                  label: o.label,
                });
              } else if (o.suggested_use === "descending") {
                acc.push({
                  value: `-${o.name}`,
                  label: o.label,
                });
              } else if (o.suggested_use === "both") {
                acc.push({
                  value: o.name,
                  label: `${o.label} (menor a mayor)`,
                });
                acc.push({
                  value: `-${o.name}`,
                  label: `${o.label} (mayor a menor)`,
                });
              }
              return acc;
            }, []),
          ],
        },
      ];

      categorySpecsFormLayout.fieldsets.forEach((fieldset) => {
        fieldset.filters.forEach((filter) => {
          let filterChoices =
            filter.choices === null
              ? filter.choices
              : filter.choices.map((c) => ({
                  label: c.name,
                  value: c.id,
                }));

          if (filter.type === "exact") {
            filterChoices = filterChoices || [
              { value: 0, label: "No" },
              { value: 1, label: "Sí" },
            ];
          } else {
            filterChoices = filterChoices || [];
          }
          if (filter.name === "grocery_categories") {
            fieldsMetadata.push({
              fieldType: "tree" as "tree",
              name: filter.name,
              multiple: false,
              choices: filterChoices,
            });
          } else if (filter.type === "exact") {
            fieldsMetadata.push({
              fieldType: "select" as "select",
              name: filter.name,
              multiple: Boolean(filter.choices),
              choices: filterChoices,
            });
          } else if (filter.type === "gte" || filter.type === "lte") {
            const fullName =
              filter.type === "gte"
                ? `${filter.name}_min`
                : `${filter.name}_max`;
            fieldsMetadata.push({
              fieldType: "select" as "select",
              name: fullName,
              multiple: false,
              choices: filterChoices,
            });
          } else if (filter.type === "range") {
            if (
              filter.continuous_range_step !== null &&
              filter.continuous_range_unit !== null
            ) {
              fieldsMetadata.push({
                fieldType: "slider" as "slider",
                name: filter.name,
                step: filter.continuous_range_step,
                unit: filter.continuous_range_unit,
                choices: [],
              });
            } else {
              fieldsMetadata.push({
                fieldType: "slider" as "slider",
                name: filter.name,
                step: null,
                unit: null,
                choices: filterChoices.map((c) => ({ ...c, index: c.value })),
              });
            }
          }
        });
      });

      let endpoint = `${category.url}browse/?exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`
      if (subcategory) {
        endpoint += '&' + subcategory.params
      }
      console.log(endpoint)

      const apiForm = new ApiForm(fieldsMetadata, endpoint);
      apiForm.initialize(context);
      const results = await apiForm.submit();

      const string = JSON.stringify({
        category: category,
        subcategory: subcategory,
        categorySpecsFormLayout: categorySpecsFormLayout,
        initialData: context.asPath,
        initialResult: results,
        fieldsMetadata: fieldsMetadata,
      });
      return { data: zlib.deflateSync(string).toString("base64") };
    }
  } catch {
    if (context.res) {
      context.res.writeHead(302, {
        Location: "/404",
      });
      context.res.end();
      return;
    } else {
      return {
        statusCode: 404,
      };
    }
  }
};

export default Browse;
