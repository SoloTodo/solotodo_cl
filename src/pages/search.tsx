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
import { useAppSelector } from "src/store/hooks";
import { PATH_MAIN } from "src/routes/paths";
import { constants } from "src/config";
import ApiFormSelectComponent from "src/frontend-utils/api_form/fields/select/ApiFormSelectComponent";
import ApiFormPaginationComponent from "src/frontend-utils/api_form/fields/pagination/ApiFormPaginationComponent";
import CategoryBrowse from "src/components/category/CategoryBrowse";

export default function Search() {
  const { prefExcludeRefurbished, prefStores } = useSettings();
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
  ];

  return (
    <Page title="Cotización">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[{ name: "Home", href: PATH_MAIN.root }, { name: "Búsqueda" }]}
        />
        <ApiFormComponent
          endpoint={`${constants.apiResourceEndpoints.products}browse/?ordering=relevance&exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`}
          fieldsMetadata={fieldsMetadata}
        >
          <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h2">Resultados de la búsqueda</Typography>
            </Grid>
            <Grid item md={3} width="100%">
              <ApiFormSelectComponent name="categories" label="Categorías" />
            </Grid>
            <Grid item xs={12} md={9}>
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