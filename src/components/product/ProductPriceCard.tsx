import {
  Box,
  Card,
  CardContent,
  Divider,
  Rating,
  Stack,
  Typography,
} from "@mui/material";

export default function ProductPriceCard() {
  const recommended = false;
  return (
    <Card
      sx={{
        bgcolor: "transparent",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: recommended ? "primary.main" : "background.neutral",
        borderRadius: 1,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          sx={{
            bgcolor: recommended ? "primary.main" : "#7B7B7B",
            p: 0.8,
            borderEndEndRadius: 10,
            display: "inline-block",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={440}
            color="common.white"
          >
            Falabella
          </Typography>
        </Box>
        <Rating
          name="read-only"
          value={4.5}
          precision={0.5}
          readOnly
          size="small"
        />
        <Typography color="text.secondary">{4.8}</Typography>
      </Stack>
      <CardContent style={{ padding: 8 }}>
        <Stack direction="row" spacing={1} justifyContent="space-evenly">
          <Stack>
            <Typography variant="h6" color="text.secondary">
              Precio normal
            </Typography>
            <Typography variant="h2" color="text.extra">
              $249.990
            </Typography>
          </Stack>
          <Divider orientation="vertical" />
          <Stack>
            <Typography variant="h6" color="text.secondary">
              Precio oferta
            </Typography>
            <Typography variant="h2" color="text.extra">
              $229.990
            </Typography>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Liberado, Incluye audifonos galaxy Buds pro
        </Typography>
      </CardContent>
    </Card>
  );
}
