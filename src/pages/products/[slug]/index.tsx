import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Image from "src/components/Image";
import Page from "src/components/Page";
import ProductBenchmarks from "src/components/product/ProductBenchmarks";
import ProductRating from "src/components/product/ProductRating";
import ProductRatingSummary from "src/components/product/ProductRatingSummary";
import ProductVariants from "src/components/product/ProductVariants";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { Product } from "src/frontend-utils/types/product";
import { Category } from "src/frontend-utils/types/store";
import { PATH_MAIN } from "src/routes/paths";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import ProductPrices from "src/components/product/ProductPrices";
import ProductDescription from "src/components/product/ProductDescription";
import ProductWarnings from "src/components/product/ProductWarnings";
import TopBanner from "src/components/TopBanner";
import { useGtag3 } from "src/hooks/useGtag3";
import { useGtag4 } from "src/hooks/useGtag4";
import ProductDisques from "src/components/product/ProductDisques";
import Head from "next/head";
import Handlebars from "handlebars";

export default function ProductPage({ product }: { product: Product }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [openNewCommentDrawer, setOpenNewCommentDrawer] = useState(false);
  const [openMoreCommentsDrawer, setOpenMoreCommentsDrawer] = useState(false);
  const [description, setDescription] = useState("");

  const category = apiResourceObjects[product.category] as Category;

  useEffect(() => {
    const templateHandler = Handlebars.compile(
      category.short_description_template || category.name
    );
    setDescription(templateHandler(product.specs));
  }, [category.short_description_template, product.specs]);

  const params = {
    category: category.name,
    categoryId: category.id.toString(),
    product: product.name,
    productId: product.id.toString(),
  };
  useGtag3(params);
  useGtag4({ ...params, pageTitle: product.name });
  return (
    <Page title={product.name}>
      <Head>
        <meta property="og:type" content="product" />
        <link
          rel="canonical"
          href={`${constants.domain}/products/${product.id}-${product.slug}`}
        />
        <meta
          property="og:url"
          content={`${constants.domain}/products/${product.id}-${product.slug}`}
        />
        <meta property="og:title" content={product.name} />
        <meta
          name="description"
          property="og:description"
          content={description}
        />
        <meta
          property="og:image"
          content={`${constants.endpoint}products/${product.id}/picture/?image_format=JPEG&quality=80&width=1200&height=650`}
          key="og_image"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="650" />
        <meta
          property="product:brand"
          content={product.specs.brand_unicode.toString()}
        />
        <meta property="product:condition" content="new" />
        <meta
          property="product:retailer_item_id"
          content={product.id.toString()}
        />
      </Head>
      <Container>
        <TopBanner category={category.name} />
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            { name: category.name, href: `${PATH_MAIN.root}${category.slug}` },
            { name: product.name },
          ]}
        />
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item xs={12} sm={12} md={4}>
            <Box
              sx={{
                borderRadius: 3,
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
          <Grid item xs={12} sm={6} md={4} lg={5}>
            <Stack spacing={3}>
              <Typography variant="h2" color="text.extra">
                {product.name}
              </Typography>
              <ProductWarnings product={product} />
              <ProductRatingSummary
                productOrStore={product}
                setOpenMoreCommentsDrawer={setOpenMoreCommentsDrawer}
              />
              <ProductVariants product={product} category={category} />
              <ProductBenchmarks product={product} category={category} />
              <ProductDescription product={product} />
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <ProductPrices
              product={product}
              category={category}
              setOpenNewCommentDrawer={setOpenNewCommentDrawer}
            />
          </Grid>
        </Grid>
        <ProductRating
          product={product}
          openNewCommentDrawer={openNewCommentDrawer}
          setOpenNewCommentDrawer={setOpenNewCommentDrawer}
          openMoreCommentsDrawer={openMoreCommentsDrawer}
          setOpenMoreCommentsDrawer={setOpenMoreCommentsDrawer}
        />
        <ProductDisques product={product} />
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
    if (slug !== product.slug) {
      return {
        redirect: {
          permanent: false,
          destination: `/products/${product.id}-${product.slug}`,
        },
      };
    }
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
