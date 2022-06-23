import { ReactNode } from "react";
// @mui
import { Theme, alpha } from "@mui/material/styles";
import { Paper, CardHeader, Box, Typography, SxProps } from "@mui/material";

// ----------------------------------------------------------------------

type BlockProps = {
  title?: string;
  titleVariant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: ReactNode;
  sx?: SxProps<Theme>;
};

export function Block({ title, titleVariant, sx, children }: BlockProps) {
  return (
    <Box
      sx={{
        marginY: {
          sx: "1rem",
          md: "2rem",
          lg: "3rem",
        },
        ...sx,
      }}
    >
      {title && (
        <Typography variant={titleVariant ? titleVariant : "h4"} component="h1">
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}
