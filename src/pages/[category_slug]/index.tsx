import { Container, Typography } from "@mui/material";
import Page from "src/components/Page";
import { getApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Category } from "src/frontend-utils/types/store";
import { wrapper } from "src/store/store";

export default function Browse({category}: {category: Category}) {
  return (
    <Page title={category.name}>
      <Container maxWidth={false}>
        <Typography variant="h2">
          Ya viene
        </Typography>
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
      return {
        props: {
          category: category,
        },
      };
    }
  }
);
