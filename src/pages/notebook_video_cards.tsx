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

type VideoCard = {
  brand_unicode: string;
  card_type_id: number;
  card_type_name: string;
  card_type_unicode: string;
  id: number;
  idx: number;
  line_brand_brand_id: number;
  line_brand_brand_name: string;
  line_brand_brand_unicode: string;
  line_brand_id: number;
  line_brand_unicode: string;
  line_id: number;
  line_name: string;
  line_unicode: string;
  memory_id: number;
  memory_unicode: string;
  memory_value: number;
  name: string;
  speed_score: number;
  unicode: string;
};

export default function NotebookVideoCards({
  videoCardList,
  matchingVideoCard,
  initialPage,
}: {
  videoCardList: VideoCard[];
  matchingVideoCard: VideoCard | null;
  initialPage: number;
}) {
  const [page, setPage] = useState(initialPage);

  const columns: GridColDef[] = [
    {
      field: "unicode",
      headerName: "Nombre",
      renderCell: (params: GridValueGetterParams) => (
        <NextLink href={`notebooks?video_cards=${params.row.id}`} passHref>
          <Link>{params.row.unicode}</Link>
        </NextLink>
      ),
      flex: 1,
    },
    { field: "card_type_unicode", headerName: "Tipo" },
    { field: "memory_unicode", headerName: "Memoria" },
    { field: "speed_score", headerName: "Velocidad" },
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
    pageTitle: matchingVideoCard
      ? `${matchingVideoCard.unicode} | Tarjetas de video de notebooks`
      : "Tarjetas de video de notebooks",
  });
  return (
    <Page
      title={
        matchingVideoCard
          ? `${matchingVideoCard.unicode} | Tarjetas de video de notebooks`
          : "Tarjetas de video de notebooks"
      }
    >
      <Container>
        <TopBanner category="Notebooks" />
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            { name: "Tarjetas de video", href: `${PATH_MAIN.root}video_card` },
            { name: matchingVideoCard ? matchingVideoCard.unicode : "Ranking" },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" color="#3B5D81">
              {matchingVideoCard
                ? matchingVideoCard.unicode
                : "Ranking Tarjetas de video Notebooks"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <DataGrid
              rows={videoCardList}
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
            {matchingVideoCard && (
              <ProductsRowGrid
                title="Notebooks con la tarjeta de video"
                url={`categories/1/browse?page_size=3&ordering=offer_price_usd&video_cards=${matchingVideoCard.id}`}
                sliceValue={8}
                actionHref={`/notebooks/?video_cards=${matchingVideoCard.id}`}
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
    let videoCardList = await fetchJson(
      `${constants.endpoint}notebook_video_cards/`
    );
    videoCardList.sort(
      (a: { [x: string]: number }, b: { [x: string]: number }) =>
        b["speed_score"] - a["speed_score"]
    );

    videoCardList = videoCardList.map((videoCard: any, idx: number) => ({
      ...videoCard,
      idx,
    }));

    const matchingVideoCard =
      videoCardList.filter(
        (videoCard: { id: number }) =>
          videoCard.id.toString() === context.query?.id
      )[0] || null;
    let initialPage = 0;
    if (matchingVideoCard) {
      initialPage = Math.floor(matchingVideoCard.idx / 15);
    }

    return {
      props: {
        videoCardList: videoCardList,
        matchingVideoCard: matchingVideoCard,
        initialPage: initialPage,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
};
