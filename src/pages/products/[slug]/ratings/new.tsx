import { Box, Container } from "@mui/material";
import { useRouter } from "next/router";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ProductNewCommentDrawer from "src/components/product/ProductNewCommentDrawer";
import TopBanner from "src/components/TopBanner";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import { MyNextPageContext } from "src/frontend-utils/redux/with-redux-store";
import { Product } from "src/frontend-utils/types/product";
import { Category } from "src/frontend-utils/types/store";
import { useCheckStatusCode } from "src/hooks/useCheckStatusCode";
import { PATH_MAIN } from "src/routes/paths";

function NewProductRating({
  product,
  statusCode,
}: {
  product: Product;
  statusCode?: number;
}) {
  useCheckStatusCode(statusCode);
  const router = useRouter();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);

  const category = apiResourceObjects[product.category] as Category;

  return (
    <Page
      title={`${product.name} | Nuevo rating`}
      meta={
        <>
          <meta property="og:type" content="product" />
          <link
            rel="canonical"
            href={`${constants.domain}/products/${product.id}/ratings/new`}
          />
          <meta
            property="og:url"
            content={`${constants.domain}/products/${product.id}/ratings/new`}
          />
          <meta
            property="og:title"
            content={`${product.name} | Nuevo rating`}
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
        </>
      }
    >
      <Container>
        <TopBanner category={category.name} />
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            { name: category.name, href: `${PATH_MAIN.root}${category.slug}` },
            {
              name: product.name,
              href: `${PATH_MAIN.products}/${router.query.slug}`,
            },
            { name: "Nuevo rating" },
          ]}
        />
        <Box width={{ xs: "100%", md: "70%" }} margin="auto">
          <ProductNewCommentDrawer
            product={product}
            onClose={() => {}}
            fullWidth
            initialStore={router.query.store as string}
          />
        </Box>
      </Container>
    </Page>
  );
}

NewProductRating.getInitialProps = async (context: MyNextPageContext) => {
  try {
    const initSlug = context.query?.slug as String;
    const [productId, ..._] = initSlug.split("-");
    const product = await fetchJson(
      `${constants.apiResourceEndpoints.products}${productId}/`
    );
    return {
      product: product,
    };
  } catch {
    if (context.res) {
      context.res.statusCode = 404;
      context.res.end();
    } else {
      return {
        statusCode: 404,
      };
    }
  }
};

export default NewProductRating;
