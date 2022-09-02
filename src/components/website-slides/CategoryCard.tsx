import {
  Box,
  Button,
  Chip,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Image from "../Image";
import { NavigationItemProps } from "src/contexts/NavigationContext";

export default function CategoryCard({
  categoryData,
}: {
  categoryData: NavigationItemProps;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        height: { xs: 145, sm: 170 },
        paddingX: 2,
        borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.11)",
        position: "relative",
      }}
    >
      <Link
        href={categoryData.path}
        underline="none"
        // sx={{
        //   ":hover": {
        //     backgroundColor: "primary"
        //   }
        // }}
        // sx={{ padding: 0, height: { xs: 145, sm: 170 } }}
      >
        <Stack
          alignItems="flex-start"
          justifyContent="space-between"
          paddingY={2}
          width={"50%"}
          height="100%"
        >
          <Stack direction="column">
            <Typography
              variant={isMobile ? "h4" : "h2"}
              fontWeight={600}
              color="text.extra"
            >
              {categoryData.name}
            </Typography>
            {categoryData.subtitle && (
              <Typography
                variant={isMobile ? "subtitle2" : "subtitle1"}
                fontWeight={600}
                color="text.extra"
              >
                {categoryData.subtitle}
              </Typography>
            )}
          </Stack>
          {/* <Button
          variant="outlined"
          color="secondary"
          href={categoryData.path}
          sx={{ borderRadius: 3, color: "text.primary" }}
          endIcon={<ArrowForwardIcon />}
        >
          VER OFERTAS
        </Button> */}
          <Chip
            // sx={{
            //   backgroundColor: "white",
            //   color: "black",
            //   ":hover": { backgroundColor: "#DFE3E8" },
            // }}
            color="secondary"
            sx={{
              color: "text.primary",
            }}
            label="VER OFERTAS"
            variant="outlined"
            clickable
            onDelete={() => {}}
            deleteIcon={<ArrowForwardIcon />}
          />
        </Stack>
        <Box
          width={{ xs: 150, md: 180 }}
          height={{ xs: 145, md: 170 }}
          sx={{
            backgroundColor: "primary.main",
            position: "absolute",
            right: "0px",
            bottom: "0px",
            borderTopRightRadius: 16,
            borderBottomRightRadius: 16,
          }}
        />
        <Image
          src={categoryData.picture !== null ? categoryData.picture : ""}
          alt={categoryData.name}
          sx={{
            width: { xs: 165, md: 220 },
            height: { xs: 155, md: 180 },
            position: "absolute",
            right: "0px",
            bottom: "0px",
          }}
        />
      </Link>
    </Box>
  );
}
