import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import Image from "../Image";
import { Slide } from "./types";

export default function RecentCard({ recentData }: { recentData: Slide }) {
  return (
    <Button
      href={recentData.destination_url}
      sx={{ padding: 0, borderRadius: 2 }}
    >
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
          <Chip
            sx={{
              backgroundColor: "white",
              color: "black",
              ":hover": { backgroundColor: "grey.300" },
            }}
            label="VER MÁS"
            clickable
          />
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
    </Button>
  );
}
