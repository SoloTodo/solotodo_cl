import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useMemo, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Image from "src/components/Image";
import Page from "src/components/Page";
import ProductBenchmarks from "src/components/product/ProductBenchmarks";
import ProductVariants from "src/components/product/ProductVariants";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Product } from "src/frontend-utils/types/product";
import { Category } from "src/frontend-utils/types/store";
import { PATH_MAIN } from "src/routes/paths";
import { useAppSelector } from "src/store/hooks";
import styles from '../../../styles/ProductPage.module.css';

export default function ProductPage({ product }: { product: Product }) {
  const [renderSpecs, setRenderSpecs] = useState({
    body: "",
  });
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  useMemo(() => {
    fetchJson(
      `${
        constants.apiResourceEndpoints.category_templates
      }?website=1&purpose=1&category=${apiResourceObjects[product.category].id}`
    ).then((category_template) => {
      category_template.length !== 0 &&
        fetchJson(
          `${constants.apiResourceEndpoints.category_templates}${category_template[0].id}/render/?product=${product.id}`
        ).then((data) => setRenderSpecs(data));
    });
  }, [apiResourceObjects, product]);

  const category = apiResourceObjects[product.category] as Category;

  return (
    <Page title={product.name}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            { name: category.name, href: `${PATH_MAIN.root}${category.slug}` },
            { name: product.name },
          ]}
        />
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                borderRadius: 5,
              }}
              bgcolor="#fff"
              padding={1}
            >
              <Image
                alt={product.picture_url}
                src={product.picture_url}
                ratio="1/1"
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              <Typography variant="h2">{product.name}</Typography>
              <div>ratings</div>
              <ProductVariants product={product} category={category} />
              <ProductBenchmarks product={product} category={category} />
              {renderSpecs.body !== "" ? (
                <div
                  className={styles.product_specs}
                  dangerouslySetInnerHTML={{ __html: renderSpecs.body }}
                />
              ) : (
                <Typography>
                  Las especificaciones técnicas de este producto no están
                  disponibles por ahora.
                </Typography>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} md={3}>
            Elige tu tienda
          </Grid>
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
