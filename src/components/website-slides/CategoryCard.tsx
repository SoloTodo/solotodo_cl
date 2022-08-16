import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Image from "../Image";
import { Slide } from "./types";

export default function CategoryCard({
  categoryData,
}: {
  categoryData: Slide;
}) {
  return (
    <Box
      sx={{
        height: 170,
        paddingX: 2,
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.11)",
        position: "relative",
      }}
    >
      <Stack
        justifyContent="space-between"
        paddingY={2}
        width={200}
        height="100%"
      >
        <Typography variant="h4" fontWeight={600} color="text.extra">
          {categoryData.label}
        </Typography>
        <Button
          variant="outlined"
          href={categoryData.destination_url}
          sx={{ borderRadius: 3 }}
          endIcon={<ArrowForwardIcon />}
        >
          VER OFERTAS
        </Button>
      </Stack>
      <Box
        width={200}
        height={170}
        sx={{
          backgroundColor: "primary.main",
          position: "absolute",
          right: "0px",
          bottom: "0px",
          borderTopRightRadius: 16,
          borderEndEndRadius: 16,
        }}
      />
      <Image
        src={categoryData.asset.picture}
        alt={categoryData.label}
        sx={{
          height: "180px",
          position: "absolute",
          right: "0px",
          bottom: "0px",
        }}
      />
    </Box>
  );
}
