import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Image from "../Image";
import { NavigationItemProps } from "src/contexts/NavigationContext";

export default function CategoryCard({
  categoryData,
}: {
  categoryData: NavigationItemProps;
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
        width={{ xs: "42%", sm: "50%" }}
        height="100%"
      >
        <Stack direction="column">
          <Typography variant="h4" fontWeight={600} color="text.extra">
            {categoryData.name}
          </Typography>
          {categoryData.subtitle && (
            <Typography variant="subtitle1" fontWeight={600} color="text.extra">
              {categoryData.subtitle}
            </Typography>
          )}
        </Stack>
        <Button
          variant="outlined"
          href={categoryData.path}
          sx={{ borderRadius: 3 }}
          endIcon={<ArrowForwardIcon />}
        >
          VER OFERTAS
        </Button>
      </Stack>
      <Box
        width={180}
        height={170}
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
