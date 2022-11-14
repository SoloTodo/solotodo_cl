import { Chip } from "@mui/material";
import useSettings from "src/hooks/useSettings";

export default function CustomChip({ label }: { label: string }) {
  const settings = useSettings();
  return settings.themeMode === "dark" ? (
    <Chip
      label={label}
      color="primary"
      size="small"
      sx={{ borderRadius: 0.5, fontSize: "12px", fontWeight: 400 }}
    />
  ) : (
    <Chip
      label={label}
      size="small"
      sx={{
        borderRadius: 0.5,
        backgroundColor: "#FFF0E7",
        color: "primary.main",
        fontSize: "12px",
        fontWeight: 400,
      }}
    />
  );
}
