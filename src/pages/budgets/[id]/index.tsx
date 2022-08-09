import {
  Container,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { GetServerSideProps } from "next";
import BudgetViewTable from "src/components/budget/BudgetViewTable";
import { Budget } from "src/components/budget/types";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { constants } from "src/config";
import { jwtFetch } from "src/frontend-utils/nextjs/utils";
import { PATH_MAIN } from "src/routes/paths";
import ReactDisqusComments from "react-disqus-comments";

export default function BudgetView({ budget }: { budget: Budget }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let videoWidth = 560;
  let videoHeight = 315;

  if (isMobile) {
    videoWidth = 300;
    videoHeight = 169;
  }

  return (
    <Page title="Cotización">
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            { name: "Cotización" },
          ]}
        />
        <Stack spacing={3}>
          <Typography variant="h5">{budget.name}</Typography>
          <BudgetViewTable initialBudget={budget} />
          {budget.is_public ? (
            <>
              <Divider />
              <Typography variant="h5">¡Aprende a armar tu PC!</Typography>
              <Stack alignItems="center">
                <iframe
                  width={`${videoWidth}`}
                  height={`${videoHeight}`}
                  src="https://www.youtube.com/embed/tj18TbXYfs4"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Stack>
              <Divider />
              <ReactDisqusComments
                shortname={constants.disqusShortName}
                identifier={`budget_${budget.id}`}
                url={`https://www.solotodo.com/budgets/${budget.id}`}
              />
            </>
          ) : null}
        </Stack>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const budget = await jwtFetch(
      context,
      `${constants.apiResourceEndpoints.budgets}${context.params?.id}/`
    );
    return {
      props: {
        budget: budget,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
