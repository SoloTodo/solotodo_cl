import NextLink from "next/link";
import {
  Alert,
  Divider,
  Grid,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { CompatibilityOrNull } from "./types";

export default function BudgetCompatibilityContainer({
  compatibility,
}: {
  compatibility: CompatibilityOrNull;
}) {
  return compatibility ? (
    <>
      <Alert severity="info">
        Lea sobre el uso de la herramienta de compatibilidad en&nbsp;
        <NextLink href="/budgets/compatibility" passHref>
          <Link>este link</Link>
        </NextLink>
        . (tl;dr: La herramienta no es perfecta y no verifica todos los casos,
        no nos hacemos responsables).
      </Alert>
      {!compatibility.success && (
        <Typography>
          Tu cotización tiene las siguientes observaciones:
        </Typography>
      )}
      <Table>
        <TableBody>
          {compatibility.success &&
            compatibility.success.map((message, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon color="success" />
                    <Typography color="success.main">Éxito</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{message}</TableCell>
              </TableRow>
            ))}
          {compatibility.warnings &&
            compatibility.warnings.map((message, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon color="warning" />
                    <Typography color="warning.main">Advertencia</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{message}</TableCell>
              </TableRow>
            ))}
          {compatibility.errors &&
            compatibility.errors.map((message, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon color="error" />
                    <Typography color="error.main">Error</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{message}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  ) : (
    <div></div>
  );
}
