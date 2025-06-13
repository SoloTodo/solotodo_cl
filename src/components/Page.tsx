import Head from "next/head";
import { forwardRef, ReactNode } from "react";
// @mui
import { Box, BoxProps } from "@mui/material";

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  children: ReactNode;
  meta?: ReactNode;
  title: string;
}

const Page = forwardRef<HTMLDivElement, Props>(
  ({ children, title = "", meta, ...other }, ref) => (
    <>
      <Head>
        <title>{`${title} | SoloTodo.cl`}</title>
        {meta}
      </Head>

      <Box ref={ref} {...other}>
        {children}
      </Box>
    </>
  )
);
Page.displayName = "Page";

export default Page;
