import { Box, CircularProgress, Container } from "@mui/material";
// components
import Page from "src/components/Page";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
// types
import { Budget } from "src/components/budget/types";
import { PATH_MAIN } from "src/routes/paths";
import { constants } from "src/config";
import { fetchAuth, jwtFetch } from "src/frontend-utils/nextjs/utils";
import { useEffect, useState } from "react";
import { PricingEntriesProps } from "src/components/product/types";
import useSettings from "src/hooks/useSettings";
import { fetchJson } from "src/frontend-utils/network/utils";
import BudgetEditComponent from "src/components/budget/BudgetEditComponent";
import { Category } from "src/frontend-utils/types/store";
import {
  getApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { useAppSelector } from "src/frontend-utils/redux/hooks";
import TopBanner from "src/components/TopBanner";
import { useGtag3 } from "src/hooks/useGtag3";
import { useGtag4 } from "src/hooks/useGtag4";
import { MyNextPageContext } from "src/frontend-utils/redux/with-redux-store";

function BudgetEdit({ initialBudget }: { initialBudget: Budget }) {
  const { prefExcludeRefurbished, prefStores } = useSettings();
  const [budget, setBudget] = useState(initialBudget);
  const [pricingEntries, setPricingEntries] = useState<
    PricingEntriesProps[] | null
  >(null);
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const categories = getApiResourceObjects(
    apiResourceObjects,
    "categories"
  ) as Category[];

  if (initialBudget.id !== budget.id) {
    setBudget(initialBudget);
  }

  useEffect(() => {
    if (budget.products_pool.length) {
      let url = "products/available_entities/?";
      for (const product of budget.products_pool) {
        url += `ids=${product.id}&`;
      }

      for (const store of prefStores) {
        url += `&stores=${store}`;
      }

      url += `&exclude_refurbished=${prefExcludeRefurbished}`;

      fetchJson(url).then((response) => {
        const pricingEntries: PricingEntriesProps[] = response.results;
        pricingEntries.sort((a, b) =>
          a.product.name <= b.product.name ? -1 : 1
        );
        setPricingEntries(pricingEntries);
      });
    } else {
      setPricingEntries([]);
    }
  }, [budget.products_pool, prefExcludeRefurbished, prefStores]);

  const setFullBudget = () => {
    fetchAuth(null, budget.url).then((newBudget) => setBudget(newBudget));
  };

  const budgetCategories = categories.filter((c) => c.budget_ordering);
  budgetCategories.sort(function (category1, category2) {
    let category1ordering = category1.budget_ordering as string;
    let category2ordering = category2.budget_ordering as string;
    if (category1ordering < category2ordering) {
      return -1;
    } else if (category1ordering > category2ordering) {
      return 1;
    } else {
      return 0;
    }
  });

  useGtag3({});
  useGtag4({ pageTitle: budget.name });
  return (
    <Page title={`${budget.name} | Editar`}>
      <Container>
        <TopBanner category="Hardware" />
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            { name: "Cotización", href: `${PATH_MAIN.budgets}/${budget.id}` },
            { name: "Editar" },
          ]}
        />
        {pricingEntries === null ? (
          <Box textAlign="center">
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <BudgetEditComponent
            budget={budget}
            setBudget={setFullBudget}
            budgetCategories={budgetCategories}
            pricingEntries={pricingEntries}
          />
        )}
      </Container>
    </Page>
  );
}

BudgetEdit.getInitialProps = async (context: MyNextPageContext) => {
  try {
    const reduxStore = context.reduxStore;
    const budget = await jwtFetch(
      context,
      `${constants.apiResourceEndpoints.budgets}${context.query?.id}/`
    );
    const user = reduxStore.getState().user;
    if (!user || (!user.is_superuser && budget.user.id !== user.id)) {
      if (context.res) {
        context.res.writeHead(302, {
          Location: "/",
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
      initialBudget: budget,
    };
  } catch {
    if (context.res) {
      context.res.writeHead(302, {
        Location: "/login?budget_sign_in_required=True",
      });
      context.res.end();
      return;
    } else {
      return {
        statusCode: 404,
      };
    }
  }
};

export default BudgetEdit;
