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
  return (
    <Card>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          sx={{
            bgcolor: "#3C5D82",
            p: 0.8,
            borderEndEndRadius: 10,
            display: "inline-block",
          }}
        >
          <Typography variant="h5" fontWeight={440} color="#fff">
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
      <CardContent sx={{ padding: 1 }}>
        <Stack direction="row" spacing={1} justifyContent="space-evenly">
          <Stack>
            <Typography>Precio normal</Typography>
            <Typography>$249.990</Typography>
          </Stack>
          <Divider orientation="vertical" />
          <Stack>
            <Typography>Precio oferta</Typography>
            <Typography>$229.990</Typography>
          </Stack>
        </Stack>
        <Typography color="text.secondary">lista</Typography>
      </CardContent>
    </Card>
  );
}
