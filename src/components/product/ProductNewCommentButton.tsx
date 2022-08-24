import { Button } from "@mui/material";

export default function ProductNewCommentButton({
  onClick,
}: {
  onClick: VoidFunction;
}) {
  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={onClick}
      sx={{ color: "text.primary", borderRadius: 3 }}
    >
      INGRESAR COMENTARIO
    </Button>
  );
}
