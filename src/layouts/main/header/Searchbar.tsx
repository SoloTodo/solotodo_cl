import * as Yup from "yup";
import { useState } from "react";
// @mui
import { styled } from "@mui/material/styles";
import {
  Input,
  Slide,
  Button,
  InputAdornment,
  ClickAwayListener,
} from "@mui/material";
// utils
import cssStyles from "../../../utils/cssStyles";
// components
import Iconify from "../../../components/Iconify";
import { IconButtonAnimate } from "../../../components/animate";
// hooks
import { useRouter } from "next/router";
import { FormProvider } from "src/components/hook-form";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// ----------------------------------------------------------------------

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled("div")(({ theme }) => ({
  ...cssStyles(theme).bgBlur(),
  top: 0,
  left: 0,
  zIndex: 99,
  width: "100%",
  display: "flex",
  position: "absolute",
  alignItems: "center",
  height: APPBAR_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up("md")]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

type FormValuesProps = {
  search: string;
};

// ----------------------------------------------------------------------

export default function Searchbar() {
  const [isOpen, setOpen] = useState(false);
  const [keywords, setKeywords] = useState("");
  const router = useRouter();

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!isOpen && (
          <IconButtonAnimate onClick={handleOpen}>
            <Iconify icon={"eva:search-fill"} width={20} height={20} />
          </IconButtonAnimate>
        )}

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
            <SearchbarStyle>
              <Input
                name="search"
                autoFocus
                fullWidth
                disableUnderline
                placeholder="Buscar…"
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify
                      icon={"eva:search-fill"}
                      sx={{ color: "text.disabled", width: 20, height: 20 }}
                    />
                  </InputAdornment>
                }
                sx={{ mr: 1, fontWeight: "fontWeightBold" }}
                onChange={(evt) => setKeywords(evt.target.value)}
              />
              <Button variant="contained" type="submit">
                Search
              </Button>
            </SearchbarStyle>
          </Slide>
        </FormProvider>
      </div>
    </ClickAwayListener>
  );
}
