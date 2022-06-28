import { Container, Grid } from "@mui/material";
import { GetServerSideProps } from "next";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { Product } from "src/frontend-utils/types/product";
import { PATH_MAIN } from "src/routes/paths";
import CarouselBasic from "src/sections/mui/CarouselBasic";

export default function ProductPage({ product }: { product: Product }) {
  console.log(product);
  return (
    <Page title={product.name}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            { name: "Sacar Categoría", href: "#" },
            { name: "Sacar sub categoría" },
          ]}
        />
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <CarouselBasic images={[product.picture_url]} ratio="4/3" />
          </Grid>
          <Grid item xs={12} md={5}>Desc</Grid>
          <Grid item xs={12} md={3}>Tiendas</Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const initSlug = context.params?.slug as String;
    const [productId, ...givenSlugParts] = initSlug.split("-");
    const slug = givenSlugParts.join("-");
    const product = await fetchJson(
      `${constants.apiResourceEndpoints.products}${productId}/`
    );

    return {
      props: {
        product: product,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
