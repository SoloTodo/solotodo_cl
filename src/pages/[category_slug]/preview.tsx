import { Box, Container, Typography } from "@mui/material";
import Page from "src/components/Page";
import ProductsRow from "src/components/product/ProductsRow";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { Currency } from "src/frontend-utils/redux/api_resources/types";
import { Category } from "src/frontend-utils/types/store";
import { wrapper } from "src/store/store";
import currency from "currency.js";
import { useAppSelector } from "src/store/hooks";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { Slide } from "src/components/website-slides/types";
import RecentSlidesRow from "src/components/website-slides/RecentSlidesRow";
import CategorySlidesRow from "src/components/website-slides/CaregorySlidesRow";
import useNavigation from "src/hooks/useNavigation";
import { NavigationItemProps } from "src/contexts/NavigationContext";
import TopBanner from "src/components/TopBanner";
import { useGtag3 } from "src/hooks/useGtag3";
import { useGtag4 } from "src/hooks/useGtag4";

type CategoryPreviewProps = {
  category: Category;
  recentSlides: Slide[];
};

export default function CategoryPreview({
  category,
  recentSlides,
}: CategoryPreviewProps) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const navigation = useNavigation();
  const clp =
    apiResourceObjects[
      `${constants.apiResourceEndpoints.currencies}${constants.clpCurrencyId}/`
    ];

  let items: NavigationItemProps[] = [];
  navigation.some((nav) => {
    let s = nav.sections.find((n) => n.path === `/${category.slug}`);
    if (s) {
      items = s.items;
      return;
    }
  });

  const viewAll = {
    name: "Ver Todo",
    path: `/${category.slug}`,
    picture: category.picture || "/ver_todos.png",
    subtitle: `en ${category.name}`,
  };

  useGtag3({ category: category.name });
  useGtag4({
    pageTitle: category.name,
    category: category.name,
    categoryId: category.id.toString(),
  });
  return (
    <Page title={category.name}>
      <Container>
        <TopBanner category={category.name} />
        <Typography variant="h2" component="h1" fontWeight={400} gutterBottom>
          {recentSlides.length !== 0 && "Lo más reciente"}
        </Typography>
        <RecentSlidesRow recentSlides={recentSlides} />
        <Typography
          variant="h3"
          component="h1"
          color="text.subtitle"
          gutterBottom
        >
          {category.name}
        </Typography>
        <CategorySlidesRow
          categorySlides={[
            ...items.filter(
              (i) => typeof i.picture !== "undefined" && i.picture !== null
            ),
            viewAll,
          ]}
        />
        <ProductsRow
          title="Lo más visto"
          url={`products/browse/?ordering=leads&websites=${constants.websiteId}&categories=${category.id}`}
          sliceValue={10}
          ribbonFormatter={(value: string) => `${parseInt(value, 10)} visitas`}
          actionHref={`/${category.slug}?ordering=leads`}
        />
        <ProductsRow
          title="Ofertas del día"
          url={`products/browse/?ordering=discount&websites=${constants.websiteId}&categories=${category.id}`}
          sliceValue={10}
          ribbonFormatter={(value: string) =>
            `Bajó ${currency(value, {
              separator: ".",
              precision: 0,
            })
              .multiply((clp as Currency).exchange_rate)
              .format()}`
          }
          actionHref={`/${category.slug}?ordering=discount`}
        />
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
      const recentSlides = await fetchJson(
        `website_slides/?categories=${category.id}&only_active_categories=1`
      );
      return {
        props: {
          category: category,
          recentSlides: recentSlides,
        },
      };
    }
  }
);
