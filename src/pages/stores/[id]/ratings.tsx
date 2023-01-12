import { Container } from "@mui/system";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import TopBanner from "src/components/TopBanner";
import ApiFormComponent from "src/frontend-utils/api_form/ApiFormComponent";
import { getApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { MyNextPageContext } from "src/frontend-utils/redux/with-redux-store";
import { Store } from "src/frontend-utils/types/store";
import { useCheckStatusCode } from "src/hooks/useCheckStatusCode";
import { PATH_MAIN } from "src/routes/paths";
import { constants } from "src/config";
import ApiFormListRatings from "src/components/stores/ListRatings";
import { Stack } from "@mui/material";
import ApiFormPaginationComponent from "src/frontend-utils/api_form/fields/pagination/ApiFormPaginationComponent";
import { Typography } from "@mui/material";

function StoreRatings({
  store,
  statusCode,
}: {
  store: Store;
  statusCode?: number;
}) {
  useCheckStatusCode(statusCode);

  const fieldMetadata = [
    {
      fieldType: "pagination" as "pagination",
    },
  ];

  return (
    <Page title={`${store.name} | Ratings`}>
      <Container>
        <TopBanner category="any" />
        <HeaderBreadcrumbs
          heading=""
          links={[{ name: "Home", href: PATH_MAIN.root }, { name: store.name }]}
        />
        <Stack spacing={3}>
          <Typography variant="h2" color="text.extra">
            Ratings {store.name}
          </Typography>
          <ApiFormComponent
            fieldsMetadata={fieldMetadata}
            endpoint={`${constants.apiResourceEndpoints.ratings}?stores=${store.id}`}
          >
            <Stack spacing={1}>
              <ApiFormPaginationComponent />
              <ApiFormListRatings />
              <ApiFormPaginationComponent />
            </Stack>
          </ApiFormComponent>
        </Stack>
      </Container>
    </Page>
  );
}

StoreRatings.getInitialProps = async (context: MyNextPageContext) => {
  const reduxStore = context.reduxStore;
  const apiResourceObjects = reduxStore.getState().apiResourceObjects;
  const stores = getApiResourceObjects(apiResourceObjects, "stores");
  const store = stores.find((s) => s.id.toString() === context.query.id);

  if (typeof store === "undefined") {
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

  return {
    store: store,
  };
};

export default StoreRatings;
