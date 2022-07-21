import { Button, Typography } from "@mui/material";

export default function ProductNewCommentButton({
  onClick,
}: {
  onClick: VoidFunction;
}) {
  return (
    <Button variant="outlined">
      <Typography
        variant="h6"
        color="text.primary"
        onClick={onClick}
        sx={{ width: "100%" }}
      >
        INGRESAR COMENTARIO
      </Typography>
    </Button>
  );
}
