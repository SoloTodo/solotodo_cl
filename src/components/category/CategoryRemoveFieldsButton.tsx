import { Button } from "@mui/material";
import { useRouter } from "next/router";

export default function CategoryRemoveFieldsButton() {
  const router = useRouter();

  const isDisabled = Object.keys(router.query).length <= 1;

  const onRemove = () => {
    router.push(`/${router.query.category_slug}`, undefined, { shallow: true });
  };

  return (
    <Button variant="text" onClick={onRemove} disabled={isDisabled}>
      Borrar filtros
    </Button>
  );
}
