import { Box, Button, Stack, Typography } from "@mui/material";
import Image from "../Image";
import { Slide } from "./types";

export default function RecentCard({ recentData }: { recentData: Slide }) {
  return (
    <Box
      sx={{
        width: 395,
        height: 170,
        paddingX: 2,
        borderRadius: 2,
        backgroundColor: `#${recentData.asset.theme_color}`,
        position: "relative",
      }}
    >
      <Stack
        alignItems="flex-start"
        justifyContent="space-between"
        paddingY={2}
        width={200}
        height="100%"
      >
        <Typography variant="h4" fontWeight={600} color="#fff">
          {recentData.label}
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          href={recentData.destination_url}
          sx={{ borderRadius: 3 }}
        >
          VER MÁS
        </Button>
      </Stack>
      <Image
        src={recentData.asset.picture}
        alt={recentData.label}
        sx={{
          height: "180px",
          width: "180px",
          position: "absolute",
          right: "0px",
          bottom: "0px",
        }}
      />
    </Box>
  );
}
