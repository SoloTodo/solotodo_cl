import { Container, Grid, Typography } from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { ApiFormFieldMetadata } from "src/frontend-utils/api_form/ApiForm";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import useSettings from "src/hooks/useSettings";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { PATH_MAIN } from "src/routes/paths";
import { constants } from "src/config";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormPaginationComponent from "src/frontend-utils/api_form/fields/pagination/ApiFormPaginationComponent";
import CategoryBrowse from "src/components/category/CategoryBrowse";
import { useRouter } from "next/router";
import TopBanner from "src/components/TopBanner";
import { useGtag3 } from "src/hooks/useGtag3";
import { useGtag4 } from "src/hooks/useGtag4";

export default function Search() {
  const { prefExcludeRefurbished, prefStores } = useSettings();
  const router = useRouter();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const categories = selectApiResourceObjects(apiResourceObjects, "categories");

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
      fieldType: "select" as "select",
      name: "categories",
      choices: categories,
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
          value: "relevance",
          label: "Relevancia",
        },
        {
          value: "leads",
          label: "Popularidad",
        },
        {
          value: "discount",
          label: "Descuento",
        },
      ],
    },
  ];

  useGtag3({});
  useGtag4({ pageTitle: "Búsqueda" });

  const title = router.query.search ? `${router.query.search} | Búsqueda` : 'Búsqueda'

  return (
    <Page title={title}>
      <Container>
        <TopBanner category="any" />
        <HeaderBreadcrumbs
          heading=""
          links={[{ name: "Home", href: PATH_MAIN.root }, { name: "Búsqueda" }]}
        />
        <ApiFormComponent
          endpoint={`${constants.apiResourceEndpoints.products}browse/?exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`}
          fieldsMetadata={fieldsMetadata}
        >
          <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h2">Resultados de la búsqueda</Typography>
              {router.query.search &&
              <Typography variant="body2">
                Palabras clave: {router.query.search}
              </Typography>
              }
            </Grid>
            <Grid item md={3} width="100%">
              <ApiFormSelectComponent
                name="categories"
                label="Categorías"
                exact
                selectOnly
              />
            </Grid>
            <Grid item md={3} width="100%">
              <ApiFormSelectComponent
                name="ordering"
                label="Ordenar por"
                exact
                selectOnly
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ApiFormPaginationComponent />
            </Grid>
            <Grid item>
              <CategoryBrowse />
            </Grid>
            <Grid item xs={12}>
              <ApiFormPaginationComponent />
            </Grid>
          </Grid>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
