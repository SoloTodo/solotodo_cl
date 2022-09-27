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
import { GetServerSideProps } from "next/types";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ProductsRow from "src/components/product/ProductsRow";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { PATH_MAIN } from "src/routes/paths";
import { useState } from "react";

type Processor = {
  id: number;
  unicode: string;
};

export default function NotebookProcessors({
  processorList,
  matchingProcessor,
  initialPage,
  notebooksWithMC,
}: {
  processorList: Processor[];
  matchingProcessor: Processor;
  initialPage: number;
  notebooksWithMC: any;
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
    { field: "core_count_value", headerName: "Núcleos" },
    { field: "thread_count_value", headerName: "Hilos" },
    { field: "frequency_unicode", headerName: "Frecuencia" },
    { field: "turbo_frequency_unicode", headerName: "Frec. turbo" },
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

  return (
    <Page
      title={
        matchingProcessor
          ? `${matchingProcessor.unicode} | Procesadores de notebooks`
          : "Procesadores de notebooks"
      }
    >
      <Container maxWidth={false}>
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
            {notebooksWithMC && (
              <ProductsRow
                title="Productos con el procesador"
                data={notebooksWithMC.slice(0, 2)}
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

    const matchingProcessor = processorList.filter(
      (processor: { id: number }) =>
        processor.id.toString() === context.query?.id
    )[0];
    let page = 0;
    let notebooksWithMC: any = [];
    if (matchingProcessor) {
      page = Math.floor(matchingProcessor.idx / 15);

      const preStoresCookie = context.req.cookies.prefStores;
      const prefStores = preStoresCookie ? preStoresCookie.split("|") : [];
      let storesUrl = "";
      for (const store of prefStores) {
        storesUrl += `stores=${store}&`;
      }

      notebooksWithMC = await fetchJson(
        `categories/1/browse?${storesUrl}page_size=3&ordering=offer_price_usd&processors=${matchingProcessor.id}`
      );
    }

    return {
      props: {
        processorList: processorList,
        matchingProcessor: matchingProcessor || null,
        initialPage: page,
        notebooksWithMC: notebooksWithMC.results || null,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
