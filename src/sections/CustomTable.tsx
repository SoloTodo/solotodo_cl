import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
} from "src/components/table/StyledTable";

export default function CustomTable({
  data,
  columns,
}: {
  data: any[];
  columns: any[];
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <StyledTableRow>
            {columns.map((col) => (
              <StyledTableCell key={col.field}>
                {col.headerName}
              </StyledTableCell>
            ))}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id}>
              {columns.map((col) => (
                <StyledTableCell key={col.field}>
                  {col.renderCell
                    ? col.renderCell({ row: row })
                    : row[col.field]}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
