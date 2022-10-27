import { ReactNode } from "react";
import NextLink from "next/link";
// @mui
import { Theme } from "@mui/material/styles";
import { Box, Link, Typography, SxProps, Stack } from "@mui/material";

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
  return (
    <Box
      sx={{
        marginY: {
          xs: "1rem",
          md: "2rem",
          lg: "3rem",
        },
        ...sx,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" maxWidth={1240}>
        {title && (
          <Typography
            variant={titleVariant ? titleVariant : "h2"}
            component="h1"
            paddingBottom={1}
          >
            {title}
          </Typography>
        )}
        <NextLink href={actionHref} as={actionHref} passHref>
          <Link color={"text.extra"}>
            <Typography variant="h5">Ver más</Typography>
          </Link>
        </NextLink>
      </Stack>
      {children}
    </Box>
  );
}
