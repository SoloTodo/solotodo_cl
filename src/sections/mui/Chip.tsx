import { Chip } from "@mui/material";

export default function CustomChip({ label }: { label: string }) {
  return (
    <Chip
      label={label}
      color="primary"
      size="small"
      sx={{ borderRadius: 0.5 }}
    />
  );
}
