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
import ProductsRow from "src/components/product/ProductsRow";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { PATH_MAIN } from "src/routes/paths";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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

export default function NotebookVideoCards() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [videoCardList, setVideoCardList] = useState<VideoCard[]>([]);
  const [matchingVideoCard, setMatchingVideoCard] = useState<VideoCard | null>(
    null
  );

  useEffect(() => {
    fetchJson(`${constants.endpoint}notebook_video_cards/`).then(
      (videoCardList) => {
        videoCardList.sort(
          (a: { [x: string]: number }, b: { [x: string]: number }) =>
            b["speed_score"] - a["speed_score"]
        );

        videoCardList = videoCardList.map((videoCard: any, idx: number) => ({
          ...videoCard,
          idx,
        }));
        setVideoCardList(videoCardList);

        const matchingVideoCard = videoCardList.filter(
          (videoCard: { id: number }) =>
            videoCard.id.toString() === router.query?.id
        )[0];
        let page = 0;
        if (matchingVideoCard) {
          page = Math.floor(matchingVideoCard.idx / 15);
          setPage(page);
          setMatchingVideoCard(matchingVideoCard);
        }
      }
    );
  }, [router.query?.id]);

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

  return (
    <Page
      title={
        matchingVideoCard
          ? `${matchingVideoCard.unicode} | Tarjetas de video de notebooks`
          : "Tarjetas de video de notebooks"
      }
    >
      <Container maxWidth={false}>
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
              <ProductsRow
                title="Productos con la tarjeta de video"
                url={`categories/1/browse?page_size=3&ordering=offer_price_usd&video_cards=${matchingVideoCard.id}`}
                sliceValue={2}
                actionHref={`/notebooks/?video_cards=${matchingVideoCard.id}`}
              />
            )}
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
