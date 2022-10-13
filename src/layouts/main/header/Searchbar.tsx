import * as Yup from "yup";
import { useState } from "react";
// @mui
import {
  Input,
  InputAdornment,
} from "@mui/material";
// components
import Iconify from "../../../components/Iconify";
// hooks
import { useRouter } from "next/router";
import { FormProvider } from "src/components/hook-form";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";


// ----------------------------------------------------------------------

type FormValuesProps = {
  search: string;
};

// ----------------------------------------------------------------------

export default function Searchbar() {
  const [keywords, setKeywords] = useState("");
  const router = useRouter();

  const SearchSchema = Yup.object().shape({
    search: Yup.string(),
  });

  const defaultValues = {
    search: "",
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(SearchSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = () => {
    window.scrollTo(0, 0);
    router.push(
      `/search?search=${encodeURIComponent(keywords)}`,
      `/search?search=${encodeURIComponent(keywords)}`
    );
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Input
        name="search"
        autoFocus
        disableUnderline
        placeholder="Busca un producto"
        endAdornment={
          <InputAdornment position="start">
            <Iconify
              icon={"eva:search-fill"}
              sx={{ color: "text.disabled", width: 20, height: 20 }}
            />
          </InputAdornment>
        }
        sx={{
          fontWeight: "fontWeightBold",
          padding: 0.5,
          display: "flex",
          width: 300,
          borderRadius: "4px",
          border: "1px solid rgba(255, 255, 255, 0.23)",
        }}
        onChange={(evt) => setKeywords(evt.target.value)}
      />
    </FormProvider>
  );
}
