// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { FormHelperText, Rating, RatingProps } from "@mui/material";

// ----------------------------------------------------------------------

interface IProps {
  name: string;
}

export default function RHFRating({ name, ...other }: IProps & RatingProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Rating {...field} {...other} value={Number(field.value)} />
          {!!error && (
            <FormHelperText error sx={{ px: 2 }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}
