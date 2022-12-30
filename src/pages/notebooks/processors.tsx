import NextLink from "next/link";
import { Container, Grid, Link, Pagination, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  gridPageCountSelector,
  GridValueGetterParams,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { PATH_MAIN } from "src/routes/paths";
import { useState } from "react";
import TopBanner from "src/components/TopBanner";
import ProductsRowGrid from "src/components/product/ProductsRowGrid";
import { useGtag3 } from "src/hooks/useGtag3";
import { useGtag4 } from "src/hooks/useGtag4";
import { GetServerSideProps } from "next/types";

type Processor = {
  id: number;
  unicode: string;
};

export default function NotebookProcessors({
  processorList,
  matchingProcessor,
  initialPage,
}: {
  processorList: Processor[];
  matchingProcessor: Processor | null;
  initialPage: number;
}) {
  const [page, setPage] = useState(initialPage);

  const columns: GridColDef[] = [
    {
      field: "unicode",
      headerName: "Nombre",
      renderCell: (params: GridValueGetterParams) => (
        <NextLink href={`notebooks?processors=${params.row.id}`} passHref>
          <Link>{params.row.unicode}</Link>
        </NextLink>
      ),
      flex: 1,
    },
    { field: "core_count_value", headerName: "Núcleos", flex: 0.5 },
    { field: "thread_count_value", headerName: "Hilos", flex: 0.5 },
    { field: "frequency_unicode", headerName: "Frecuencia", flex: 1 },
    { field: "turbo_frequency_unicode", headerName: "Frec. turbo", flex: 1 },
  ];

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <Pagination
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
  }

  useGtag3({});
  useGtag4({
    pageTitle: matchingProcessor
      ? `${matchingProcessor.unicode} | Procesadores de notebooks`
      : "Procesadores de notebooks",
  });
  return (
    <Page
      title={
        matchingProcessor
          ? `${matchingProcessor.unicode} | Procesadores de notebooks`
          : "Procesadores de notebooks"
      }
    >
      <Container>
        <TopBanner category="Notebooks" />
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            { name: "Procesadores", href: `${PATH_MAIN.root}processors` },
            { name: matchingProcessor ? matchingProcessor.unicode : "Ranking" },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" color="#3B5D81">
              {matchingProcessor
                ? matchingProcessor.unicode
                : "Ranking Procesadores Notebooks"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <DataGrid
              rows={processorList}
              columns={columns}
              page={page}
              onPageChange={(p) => setPage(p)}
              pageSize={15}
              rowsPerPageOptions={[]}
              autoHeight
              density="compact"
              disableSelectionOnClick
              pagination
              components={{
                Pagination: CustomPagination,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            {matchingProcessor && (
              <ProductsRowGrid
                title="Notebooks con el procesador"
                url={`categories/1/browse?page_size=3&ordering=offer_price_usd&processors=${matchingProcessor.id}`}
                sliceValue={8}
                actionHref={`/notebooks/?processors=${matchingProcessor.id}`}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    let processorList = await fetchJson(
      `${constants.endpoint}notebook_processors/`
    );
    processorList.sort(
      (a: { [x: string]: number }, b: { [x: string]: number }) =>
        b["speed_score"] - a["speed_score"]
    );

    processorList = processorList.map((processor: any, idx: number) => ({
      ...processor,
      idx,
    }));

    const matchingProcessor =
      processorList.filter(
        (processor: { id: number }) =>
          processor.id.toString() === context.query?.id
      )[0] || null;
    let initialPage = 0;
    if (matchingProcessor) {
      initialPage = Math.floor(matchingProcessor.idx / 15);
    }

    return {
      props: {
        processorList: processorList,
        matchingProcessor: matchingProcessor,
        initialPage: initialPage,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
