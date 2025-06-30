import {Box, Container, Grid, Typography} from "@mui/material";
import {GetServerSideProps} from "next/types";
import {ReactNode} from "react";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import ProductsRowGrid from "src/components/product/ProductsRowGrid";
import TopBanner from "src/components/TopBanner";
import {constants} from "src/config";
import {fetchJson} from "src/frontend-utils/network/utils";
import {useGtag4} from "src/hooks/useGtag4";
import {PATH_MAIN} from "src/routes/paths";

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

const Title = ({children}: { children: ReactNode }) => (
    <Typography variant="h5" gutterBottom mt={3} color="#3B5D81">
        {children}
    </Typography>
);

export default function VideoCardGpus({gpu}: { gpu: Gpu }) {
    useGtag4({pageTitle: gpu.unicode});
    return (
        <Page title={gpu.unicode}>
            <Container>
                <TopBanner category="Notebooks"/>
                <HeaderBreadcrumbs
                    heading=""
                    links={[
                        {name: "Home", href: PATH_MAIN.root},
                        {
                            name: "Tarjetas de video",
                            href: `${PATH_MAIN.root}tarjetas_de_video`,
                        },
                        {name: gpu.unicode},
                    ]}
                />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h5" color="#3B5D81">
                            {gpu.unicode}
                        </Typography>
                    </Grid>
                    <Grid item xs={1} md={1} lg={2}></Grid>
                    <Grid item xs={11} md={3}>
                        <Title>Especificaciones</Title>
                        <Typography>Núcleo: {gpu.core_unicode}</Typography>
                        <Typography>Stream processors: {gpu.stream_processors}</Typography>
                        <Typography>Texture units: {gpu.texture_units}</Typography>
                        <Typography>ROPs: {gpu.rops}</Typography>
                        <Typography>Ray tracing cores: {gpu.ray_tracing_cores}</Typography>
                        <Typography>Frecuencias:</Typography>
                        <Box paddingBottom={1} paddingLeft={6}>
                            <ul>
                                <li>Core Base: {gpu.default_core_clock} MHz</li>
                                <li>Core Boost: {gpu.boost_core_clock} MHz</li>
                                <li>Memorias: {gpu.default_memory_clock} MHz</li>
                            </ul>
                        </Box>

                        <Title>Especificaciones Secundarias</Title>
                        <Typography>
                            Número de transistores: {gpu.transistor_count} millones
                        </Typography>
                        <Typography>TDP: {gpu.tdp}W</Typography>
                        <Typography>
                            Procesos de manufactura: {gpu.manufacturing_process_unicode}
                        </Typography>
                        <Typography>
                            SLI/Crossfire: {gpu.has_multi_gpu_support ? "Sí" : "No"}
                        </Typography>
                        <Typography>DirectX: {gpu.dx_version_unicode}</Typography>
                        <Typography>OpenGL: {gpu.ogl_version_unicode}</Typography>

                        <Title>Puntajes Estimados</Title>
                        <Typography>
                            3DMark Fire Strike: {gpu.tdmark_fire_strike_score}
                        </Typography>
                        <Typography>
                            3DMark Time Spy: {gpu.tdmark_time_spy_score}
                        </Typography>
                        <Typography>
                            3DMark Port Royal (Ray tracing): {gpu.tdmark_port_royal_score}
                        </Typography>
                        <Typography>
                            3DMark VR Room Orange (VR): {gpu.tdmark_vr_room_orange_score}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={8} lg={6}>
                        <ProductsRowGrid
                            title={`Tarjetas de video ${gpu.unicode}`}
                            url={`categories/2/browse/?ordering=leads&page_size=3&ordering=offer_price_usd&gpus=${gpu.id}`}
                            sliceValue={2}
                            ribbonFormatter={(value: string) =>
                                `Visitas: ${parseInt(value, 10)}`
                            }
                            actionHref={`/tarjetas_de_video/?gpus=${gpu.id}`}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const gpu = await fetchJson(
        `${constants.endpoint}video_card_gpus/${context.params?.id}/`
    );
    return {
        props: {
            gpu: gpu,
        },
    };
};
