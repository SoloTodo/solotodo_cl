import { Box, Chip, Link, Stack, Typography } from "@mui/material";
import NextLink from "next/link";
import Image from "../Image";
import { Slide } from "./types";

export default function RecentCard({ recentData }: { recentData: Slide }) {
  return (
    <Box
      sx={{
        maxWidth: 395,
        height: 170,
        paddingX: 2,
        marginY: 1,
        borderRadius: 2,
        backgroundColor: `#${recentData.asset.theme_color}`,
        position: "relative",
      }}
    >
      <NextLink href={recentData.destination_url} passHref>
        <Link underline="none">
          <Stack
            alignItems="flex-start"
            justifyContent="space-between"
            paddingY={2}
            width={{ xs: 160, sm: 200 }}
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
              borderRadius: 2,
            }}
          />
        </Link>
      </NextLink>
    </Box>
  );
}
