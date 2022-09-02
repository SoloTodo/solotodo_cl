import { ReactNode } from "react";
import NextLink from "next/link";
// @mui
import { Theme } from "@mui/material/styles";
import { Box, Link, Typography, SxProps, Stack } from "@mui/material";
import useSettings from "src/hooks/useSettings";

// ----------------------------------------------------------------------

type BlockProps = {
  title?: string;
  titleVariant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  actionHref: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
};

export function Block({
  title,
  titleVariant,
  sx,
  actionHref,
  children,
}: BlockProps) {
  const settings = useSettings();

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
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {title && (
          <Typography
            variant={titleVariant ? titleVariant : "h2"}
            component="h1"
          >
            {title}
          </Typography>
        )}
        <NextLink href={actionHref} as={actionHref} passHref>
          <Link underline="none">
            <Typography
              variant="h5"
              color={
                settings.themeMode === "light" ? "#3B5D81" : "text.primary"
              }
            >
              Ver más
            </Typography>
          </Link>
        </NextLink>
      </Stack>
      {children}
    </Box>
  );
}
