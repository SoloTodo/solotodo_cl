import { Container, Grid, Typography } from "@mui/material";
import { GetServerSideProps } from "next/types";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ProductsRow from "src/components/product/ProductsRow";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { PATH_MAIN } from "src/routes/paths";

type Gpu = {
  boost_core_clock: number;
  brand_unicode: string;
  core_count_id: number;
  core_count_name: string;
  core_count_unicode: string;
  core_count_value: number;
  core_family_architecture_brand_brand_id: number;
  core_family_architecture_brand_brand_name: string;
  core_family_architecture_brand_brand_unicode: string;
  core_family_architecture_brand_id: number;
  core_family_architecture_brand_unicode: string;
  core_family_architecture_id: number;
  core_family_architecture_name: number;
  core_family_architecture_unicode: number;
  core_family_id: number;
  core_family_name: number;
  core_family_unicode: number;
  core_id: number;
  core_name: number;
  core_unicode: number;
  default_core_clock: number;
  default_memory_clock: number;
  dx_version_id: number;
  dx_version_unicode: number;
  dx_version_value: number;
  has_multi_gpu_support: boolean;
  id: number;
  line_family_brand_brand_id: number;
  line_family_brand_brand_name: string;
  line_family_brand_brand_unicode: string;
  line_family_brand_id: number;
  line_family_brand_unicode: string;
  line_family_id: number;
  line_family_name: string;
  line_family_unicode: string;
  line_id: number;
  line_name: string;
  line_unicode: string;
  manufacturing_process_id: number;
  manufacturing_process_unicode: string;
  manufacturing_process_value: number;
  name: string;
  ogl_version_id: number;
  ogl_version_unicode: string;
  ogl_version_value: number;
  ray_tracing_cores: number;
  rops: number;
  stream_processors: number;
  tdmark_fire_strike_score: number;
  tdmark_port_royal_score: number;
  tdmark_time_spy_score: number;
  tdmark_vr_room_orange_score: number;
  tdp: number;
  texture_units: number;
  transistor_count: number;
  unicode: string;
};

export default function VideoCardGpus({
  gpu,
  videoCardsWithGpu,
}: {
  gpu: Gpu;
  videoCardsWithGpu: any;
}) {
  console.log(gpu);
  console.log(videoCardsWithGpu);
  return (
    <Page title={"aaa"}>
      <Container maxWidth={false}>
        <HeaderBreadcrumbs
          heading=""
          links={[
            { name: "Home", href: PATH_MAIN.root },
            { name: "Tarjetas de video", href: `${PATH_MAIN.root}video_card` },
            { name: "aa" },
          ]}
        />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" color="#3B5D81">
              {gpu.unicode}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography>Especificaciones</Typography>
            <Typography>Núcleo: {gpu.core_unicode}</Typography>
            <Typography>Stream processors: {gpu.stream_processors}</Typography>
            <Typography>Texture units: {gpu.texture_units}</Typography>
            <Typography>ROPs: {gpu.rops}</Typography>
            <Typography>Ray tracing cores: {gpu.ray_tracing_cores}</Typography>
          </Grid>
          <Grid item>
            <ProductsRow
              title="Lo más visto"
              data={videoCardsWithGpu.results.slice(0, 2)}
              ribbonFormatter={(value: string) =>
                `Visitas: ${parseInt(value, 10)}`
              }
            />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const prefExcludeRefurbished = context.req.cookies.prefExcludeRefurbished;
  const preStoresCookie = context.req.cookies.prefStores;
  const prefStores = preStoresCookie ? preStoresCookie.split("|") : [];
  let storesUrl = "";
  for (const store of prefStores) {
    storesUrl += `&stores=${store}`;
  }

  const gpu = await fetchJson(
    `${constants.endpoint}video_card_gpus/${context.params?.id}/`
  );
  const videoCardsWithGpu = await fetchJson(
    `categories/2/browse/?ordering=leads&exclude_refurbished=${prefExcludeRefurbished}${storesUrl}&page_size=3&ordering=offer_price_usd&gpus=${context.params?.id}`
  );

  return {
    props: {
      gpu: gpu,
      videoCardsWithGpu: videoCardsWithGpu,
    },
  };
};
