import { useMemo, useState } from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import CloseIcon from "@mui/icons-material/Close";
import { addDays, subDays } from "date-fns";
import { Product } from "src/frontend-utils/types/product";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import currency from "currency.js";
import { fDate } from "src/utils/formatTime";
import ReactApexChart, { BaseOptionChart } from "../chart";
import { merge } from "lodash";
import {
  MinimumPricesPerDay,
  NormalizedPricingData,
  PricingData,
} from "./types";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useAppSelector } from "src/store/hooks";
import { useApiResourceObjects } from "src/frontend-utils/redux/api_resources/apiResources";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "98%", md: "80%" },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProductPriceHistory({ product }: { product: Product }) {
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("producto");
  const [useOfferPrice, setUseOfferPrice] = useState("true");
  const [pricingData, setPricingData] = useState<NormalizedPricingData[]>([]);
  const [minimumPrices, setMinimumPrices] =
    useState<MinimumPricesPerDay | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(
    subDays(new Date(), 30)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  useMemo(() => {
    if (startDate === null || endDate === null) return;
    setLoading(true);
    const url =
      `${constants.apiResourceEndpoints.products}${product.id}/pricing_history/` +
      `?timestamp_after=${startDate.toISOString()}&timestamp_before=${endDate.toISOString()}`;

    fetchJson(url).then((data) => {
      const minimumPricesPerDay: MinimumPricesPerDay = {
        normalPrices: {},
        offerPrices: {},
      };

      const finalData: NormalizedPricingData[] = [];

      for (const pricingEntry of data as PricingData[]) {
        if (pricingEntry.entity.condition != "https://schema.org/NewCondition")
          continue;

        const newData: NormalizedPricingData = {
          entity: pricingEntry.entity,
          normalized_pricing_history: {
            normalPrices: {},
            offerPrices: {},
          },
        };

        for (const priceHistory of pricingEntry.pricing_history) {
          if (!priceHistory.is_available) continue;

          const timestamp = fDate(new Date(priceHistory.timestamp));
          const normalPrice = currency(priceHistory.normal_price, {
            precision: 0,
          });
          const offerPrice = currency(priceHistory.offer_price, {
            precision: 0,
          });

          if (
            !minimumPricesPerDay.normalPrices[timestamp] ||
            normalPrice <
              minimumPricesPerDay.normalPrices[timestamp].normalPrice
          ) {
            minimumPricesPerDay.normalPrices[timestamp] = {
              timestamp,
              normalPrice,
            };
          }
          if (
            !minimumPricesPerDay.offerPrices[timestamp] ||
            offerPrice < minimumPricesPerDay.offerPrices[timestamp].offerPrice
          ) {
            minimumPricesPerDay.offerPrices[timestamp] = {
              timestamp,
              offerPrice,
            };
          }

          newData.normalized_pricing_history.normalPrices[timestamp] = {
            timestamp,
            normalPrice,
          };
          newData.normalized_pricing_history.offerPrices[timestamp] = {
            timestamp,
            offerPrice,
          };
        }

        finalData.push(newData);
      }
      setPricingData(finalData);
      setMinimumPrices(minimumPricesPerDay);
      setLoading(false);
    });
  }, [endDate, product.id, startDate]);

  let days: Date[] = [];
  if (startDate !== null && endDate !== null) {
    var day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
  }

  const CHART_DATA = [
    {
      name: "Precio normal",
      data: days.map((day) => {
        const pricing = minimumPrices?.normalPrices[fDate(day)];
        if (pricing) {
          return pricing.normalPrice.value;
        } else {
          return null;
        }
      }),
      type: "line",
    },
    {
      name: "Precio oferta",
      data: days.map((day) => {
        const pricing = minimumPrices?.offerPrices[fDate(day)];
        if (pricing) {
          return pricing.offerPrice.value;
        } else {
          return null;
        }
      }),
      type: "line",
    },
  ];

  const ENTITIES_CHART_DATA_OFFER: any = [];
  const ENTITIES_CHART_DATA_NORMAL: any = [];
  pricingData.map((d) => {
    ENTITIES_CHART_DATA_OFFER.push({
      name: apiResourceObjects[d.entity.store].name,
      data: days.map((day) => {
        const pricing = d.normalized_pricing_history.offerPrices[fDate(day)];
        if (pricing) {
          return pricing.offerPrice.value;
        } else {
          return null;
        }
      }),
      type: "line",
    });
    ENTITIES_CHART_DATA_NORMAL.push({
      name: apiResourceObjects[d.entity.store].name,
      data: days.map((day) => {
        const pricing = d.normalized_pricing_history.normalPrices[fDate(day)];
        if (pricing) {
          return pricing.normalPrice.value;
        } else {
          return null;
        }
      }),
      type: "line",
    });
  });

  const chartOptions = merge(BaseOptionChart(), {
    markers: {
      size: 3,
    },
    xaxis: {
      type: "datetime",
      categories: days.map((d) => d.toISOString()),
    },
    yaxis: {
      title: {
        text: "Precio",
      },
      labels: {
        formatter: (value: number) =>
          currency(value, { precision: 0 }).format(),
      },
    },
    tooltip:
      value === "detalle"
        ? {
            shared: false,
            intersect: true,
          }
        : {},
  });

  const setTabValue = (value: string) => {
    setStartDate(subDays(new Date(), 30));
    setValue(value);
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        sx={{ borderRadius: 4 }}
        startIcon={<ShowChartIcon />}
        onClick={() => setOpen(true)}
      >
        Precio histórico
      </Button>
      <TabContext value={value}>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Stack sx={style} spacing={1}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h2" component="h2">
                {value === "producto"
                  ? "Precio histórico"
                  : "Precio histórico por tienda"}
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={1} direction="row">
                  <DesktopDatePicker
                    label="Desde"
                    value={startDate}
                    minDate={
                      value === "detalle" ? subDays(startDate!, 60) : null
                    }
                    maxDate={endDate || new Date()}
                    inputFormat="dd/MM/yyyy"
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DesktopDatePicker
                    label="hasta"
                    value={endDate}
                    minDate={startDate}
                    maxDate={new Date()}
                    inputFormat="dd/MM/yyyy"
                    onChange={(newValue) => setEndDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList onChange={(_, newValue) => setTabValue(newValue)}>
                  <Tab label="Producto" value="producto" />
                  <Tab label="Ver detalle" value="detalle" />
                </TabList>
              </Box>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <br />
            <TabPanel value="producto">
              {loading ? (
                <Box textAlign="center" paddingTop={2}>
                  <CircularProgress color="inherit" />
                </Box>
              ) : (
                <ReactApexChart
                  type="line"
                  series={CHART_DATA}
                  options={chartOptions}
                />
              )}
            </TabPanel>
            <TabPanel value="detalle">
              {loading ? (
                <Box textAlign="center" paddingTop={2}>
                  <CircularProgress color="inherit" />
                </Box>
              ) : (
                <>
                  <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small">Ver por</InputLabel>
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      value={useOfferPrice}
                      label="Ver por"
                      onChange={(evt) => setUseOfferPrice(evt.target.value)}
                    >
                      <MenuItem value={"true"}>Precio oferta</MenuItem>
                      <MenuItem value={"false"}>Precio normal</MenuItem>
                    </Select>
                  </FormControl>
                  <ReactApexChart
                    type="line"
                    series={
                      useOfferPrice === "true"
                        ? ENTITIES_CHART_DATA_OFFER
                        : ENTITIES_CHART_DATA_NORMAL
                    }
                    options={chartOptions}
                  />
                </>
              )}
            </TabPanel>
          </Stack>
        </Modal>
      </TabContext>
    </>
  );
}
