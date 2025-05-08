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
      fieldType: "text" as "text",
      name: "search",
    },
  ];

  useGtag3({});
  useGtag4({ pageTitle: "Búsqueda" });
  return (
    <Page title={`${router.query.search} | Búsqueda`}>
      <Container>
        <TopBanner category="any" />
        <HeaderBreadcrumbs
          heading=""
          links={[{ name: "Home", href: PATH_MAIN.root }, { name: "Búsqueda" }]}
        />
        <ApiFormComponent
          endpoint={`${constants.apiResourceEndpoints.products}ai_browse/?exclude_refurbished=${prefExcludeRefurbished}${storesUrl}`}
          fieldsMetadata={fieldsMetadata}
        >
          <Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h2">Resultados de la búsqueda</Typography>
              <Typography variant="body2">
                Búsqueda: {router.query.search}
              </Typography>
            </Grid>
            <Grid item>
              <CategoryBrowse />
            </Grid>
          </Grid>
        </ApiFormComponent>
      </Container>
    </Page>
  );
}
