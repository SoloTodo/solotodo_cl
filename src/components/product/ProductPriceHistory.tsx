import { useMemo, useState } from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { addDays, subDays } from "date-fns";
import { Product } from "src/frontend-utils/types/product";
import { constants } from "src/config";
import { fetchJson } from "src/frontend-utils/network/utils";
import { Entity } from "src/frontend-utils/types/entity";
import currency from "currency.js";
import { fDate } from "src/utils/formatTime";
import ReactApexChart, { BaseOptionChart } from "../chart";
import { merge } from "lodash";

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

type PricingHistory = {
  timestamp: string;
  normal_price: string;
  offer_price: string;
  stock: number;
  is_available: boolean;
};

type MinimumPricesPerDay = {
  normalPrices: {
    [tiemstamp: string]: { timestamp: string; normalPrice: currency };
  };
  offerPrices: {
    [tiemstamp: string]: { timestamp: string; offerPrice: currency };
  };
};

export default function ProductPriceHistory({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [minimumPrices, setMinimumPrices] =
    useState<MinimumPricesPerDay | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(
    subDays(new Date(), 30)
  );
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  useMemo(() => {
    if (startDate === null || endDate === null) return;
    const url =
      `${constants.apiResourceEndpoints.products}${product.id}/pricing_history/` +
      `?timestamp_after=${startDate.toISOString()}&timestamp_before=${endDate.toISOString()}`;

    fetchJson(url).then((data) => {
      const minimumPricesPerDay: MinimumPricesPerDay = {
        normalPrices: {},
        offerPrices: {},
      };

      for (const pricingEntry of data as {
        entity: Entity;
        pricing_history: PricingHistory[];
      }[]) {
        if (pricingEntry.entity.condition != "https://schema.org/NewCondition")
          continue;

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
        }
      }
      console.log(data);
      setMinimumPrices(minimumPricesPerDay);
    });
  }, [endDate, product.id, startDate]);

  let days = [];
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

  const chartOptions = merge(BaseOptionChart(), {
    markers: {
      size: 3,
    },
    xaxis: {
      type: "datetime",
      categories: days.map((d) => d.toISOString()),
    },
    yaxis: [
      {
        title: {
          text: "Precio",
        },
        labels: {
          formatter: (value: number) => currency(value, { precision: 0 }).format(),
        },
      },
      {
        show: false,
        labels: {
          formatter: (value: number) => currency(value, { precision: 0 }).format(),
        },
      },
    ],
  });

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
      <Modal open={open} onClose={() => setOpen(false)}>
        <Stack sx={style} spacing={1}>
          <Stack
            spacing={1}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h2" component="h2">
              Precio histórico
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack spacing={1} direction="row">
                <DesktopDatePicker
                  label="Desde"
                  value={startDate}
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
            <Button variant="contained">Ver detalle</Button>
          </Stack>
          <ReactApexChart
            type="line"
            series={CHART_DATA}
            options={chartOptions}
            // height={400}
          />
        </Stack>
      </Modal>
    </>
  );
}
