import {
  Box,
  Chip,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NextLink from "next/link";
import Image from "../Image";
import { Slide } from "./types";

export default function RecentCard({ recentData }: { recentData: Slide }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        maxWidth: { xs: "90%", md: 370, lg: 390 },
        height: { xs: 150, sm: 170 },
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
            justifyContent="space-around"
            paddingY={2}
            width={{ xs: 140, sm: 200 }}
            height="100%"
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight={600}
              color="#fff"
            >
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
              height: { xs: "150px", md: "180px" },
              width: { xs: "140px", md: "180px" },
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
