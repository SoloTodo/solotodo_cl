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
import { ApiFormFieldMetadata } from "src/frontend-utils/api_form/ApiForm";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormSliderComponent from "src/frontend-utils/api_form/fields/slider/ApiFormSliderComponent";
import { fetchJson } from "src/frontend-utils/network/utils";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { Category } from "src/frontend-utils/types/store";
import useSettings from "src/hooks/useSettings";
import { PATH_MAIN } from "src/routes/paths";
import { wrapper } from "src/store/store";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ApiFormPriceRangeComponent from "src/frontend-utils/api_form/fields/price_range/ApiFormPriceRangeComponent";
import { useAppSelector } from "src/store/hooks";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
import ApiFormTextComponent from "src/frontend-utils/api_form/fields/text/ApiFormTextComponent";
import ApiFormPaginationComponent from "src/frontend-utils/api_form/fields/pagination/ApiFormPaginationComponent";
import CategoryBrowse from "src/components/category/CategoryBrowse";
import CategoryCountSummary from "src/components/category/CategoryCountSummary";
import CategoryRemoveFieldsButton from "src/components/category/CategoryRemoveFieldsButton";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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

// ----------------------------------------------------------------------

export default function Browse({
  category,
  categorySpecsFormLayout,
}: {
  category: Category;
  categorySpecsFormLayout: CategorySpecsFormLayoutProps;
}) {
  const { prefExcludeRefurbished, prefStores } = useSettings();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  let storesUrl = "";
  for (const store of prefStores) {
    storesUrl += `&stores=${store}`;
  }

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
        ...categorySpecsFormLayout.orders.map((o) => ({
          value: o.name,
          label: o.label,
        })),
      ],
    },
  ];

  const filterComponents: JSX.Element[] = [];

  categorySpecsFormLayout.fieldsets.forEach((fieldset) => {
    const fieldFilters: JSX.Element[] = [];
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

      if (filter.type === "exact") {
        fieldsMetadata.push({
          fieldType: "select" as "select",
          name: filter.name,
          multiple: Boolean(filter.choices),
          choices: filterChoices,
        });
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
        fieldsMetadata.push({
          fieldType: "select" as "select",
          name: fullName,
          multiple: false,
          choices: filterChoices,
        });
        fieldFilters.push(
          <AccordionDetails key={filter.id}>
            <ApiFormSelectComponent name={fullName} label={filter.label} />
          </AccordionDetails>
        );
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
        fieldFilters.push(
          <AccordionDetails key={filter.id}>
            <ApiFormSliderComponent name={filter.name} label={filter.label} />
          </AccordionDetails>
        );
      }
    });
    filterComponents.push(
      <Grid item xs={12} key={fieldset.label}>
        <Accordion sx={{ bgcolor: "transparent" }}>
          <AccordionSummary
            id={fieldset.label}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
          >
            {fieldset.label}
          </AccordionSummary>
          {fieldFilters.map((f) => f)}
        </Accordion>
        <Divider />
      </Grid>
    );
  });

  const GridFilters = (
    <Grid container spacing={{ xs: 2, md: 3 }} style={{ overflow: "visible" }}>
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

  return (
    <Page title={category.name}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            {
              name: "Tecnología",
              href: `${PATH_MAIN.root}${category.slug}/preview`,
            },
            { name: category.name },
          ]}
        />
        <ApiFormComponent
          endpoint={`${category.url}browse/?exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`}
          fieldsMetadata={fieldsMetadata}
          useToken
        >
          <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
            <Grid item xs={12} lg={3}>
              <Typography variant="h2">{category.name}</Typography>
            </Grid>
            {useMediaQuery(theme.breakpoints.up("lg")) ? (
              <Grid item xs={3} lg={3} width="100%">
                <ApiFormSelectComponent name="ordering" label="Ordenar por" />
              </Grid>
            ) : (
              <>
                <Grid item xs={12} lg={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CategoryCountSummary />
                    <Box width="30%">
                      <ApiFormSelectComponent
                        name="ordering"
                        label="Ordenar por"
                      />
                    </Box>
                    <Button
                      variant="outlined"
                      sx={{
                        width: "30%",
                        justifyContent: "space-between",
                        height: 53.125,
                      }}
                      endIcon={<ArrowDropDownIcon />}
                      onClick={() => setOpen(true)}
                    >
                      Filtrar por
                    </Button>
                  </Stack>
                </Grid>
              </>
            )}
            <Grid item xs={12} lg={6}>
              <ApiFormPaginationComponent />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={{ xs: 4, md: 6 }}>
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
                xs: `${HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT}px`,
                lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT}px`,
              }}
              bgcolor="transparent"
            />
            <Box
              width={{ xs: 300, md: 500 }}
              height="100%"
              bgcolor="background.paper"
              padding={2}
            >
              {GridFilters}
            </Box>
          </Drawer>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (st) => async (context) => {
    const apiResourceObjects = st.getState().apiResourceObjects;
    const categories = getApiResourceObjects(apiResourceObjects, "categories");
    const category = categories.find(
      (c) => (c as Category).slug === context.params?.category_slug
    );
    if (typeof category === "undefined") {
      return {
        notFound: true,
      };
    } else {
      const response = await fetchJson(
        `${constants.apiResourceEndpoints.category_specs_form_layouts}?category=${category.id}`
      );
      let categorySpecsFormLayout = response[0];
      response.forEach((res: { website: string }) => {
        if (
          res.website ==
          `${constants.apiResourceEndpoints.websites}${constants.websiteId}/`
        )
          categorySpecsFormLayout = res;
      });
      return {
        props: {
          category: category,
          categorySpecsFormLayout: categorySpecsFormLayout,
        },
      };
    }
  }
);
