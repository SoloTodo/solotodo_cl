import {
  LinearProgress,
  linearProgressClasses,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { constants } from "src/config";
import { Product } from "src/frontend-utils/types/product";
import { Category } from "src/frontend-utils/types/store";

type ProductBenchmarksProps = {
  product: Product;
  category: Category;
};

type Benchmark = {
  label: string;
  field: string;
  maxValue: number;
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: alpha("#D98E2C", 0.2),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#CD6131",
  },
}));

const getBenchValue = (value: number, maxValue: number) => {
  return Math.min((value * 100) / maxValue, 100);
};

export default function ProductBenchmarks({
  product,
  category,
}: ProductBenchmarksProps) {
  const benchmarkCategory = (constants.benchmarkCategories as Record<number, Benchmark[]>)[category.id];
  return benchmarkCategory && (
    <Stack
      bgcolor={alpha("#C4C4C4", 0.1)}
      borderRadius={0.5}
      padding={2}
      spacing={1}
    >
      <Typography variant="h5" fontWeight={700}>
        Rendimiento
      </Typography>
      <Stack
        spacing={2}
        direction={{
          md: "row",
          xs: "column",
        }}
      >
        {benchmarkCategory.map((benchmark) => (
          <Stack key={benchmark.field} width='100%' spacing={0.5} justifyContent="space-between">
            <Typography>{benchmark.label}</Typography>
            <BorderLinearProgress
              variant="determinate"
              value={getBenchValue(
                Number(product.specs[benchmark.field]),
                benchmark.maxValue
              )}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}
