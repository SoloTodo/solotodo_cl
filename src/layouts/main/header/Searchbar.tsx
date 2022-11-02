import * as Yup from "yup";
import { useState } from "react";
// @mui
import {
  ClickAwayListener,
  Input,
  InputAdornment,
  Slide,
  styled,
} from "@mui/material";
// components
import Iconify from "../../../components/Iconify";
// hooks
import { useRouter } from "next/router";
import { FormProvider } from "src/components/hook-form";
import useSettings from "src/hooks/useSettings";
import useResponsive from "src/hooks/useResponsive";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import cssStyles from "src/utils/cssStyles";
import { IconButtonAnimate } from "src/components/animate";
import { HEADER } from "src/config";

// ----------------------------------------------------------------------

type FormValuesProps = {
  search: string;
};

// ----------------------------------------------------------------------

const SearchbarStyle = styled("div")(({ theme }) => ({
  ...cssStyles(theme).bgBlur(),
  top: 0,
  left: 0,
  zIndex: 99,
  width: "100%",
  display: "flex",
  position: "absolute",
  alignItems: "center",
  height: HEADER.MOBILE_HEIGHT,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up("md")]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    padding: theme.spacing(0, 5),
  },
}));

export default function Searchbar() {
  const [isOpen, setOpen] = useState(false);
  const [keywords, setKeywords] = useState("");
  const router = useRouter();
  const settings = useSettings();
  const isDesktop = useResponsive("up", "md");

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

  const SearchInput = (
    <Input
      name="search"
      disableUnderline
      placeholder="Busca un producto"
      endAdornment={
        <InputAdornment position="end">
          <Iconify
            icon={"eva:search-fill"}
            sx={{ color: "text.disabled", width: 20, height: 20 }}
          />
        </InputAdornment>
      }
      sx={{
        fontWeight: "fontWeightBold",
        paddingY: 0.5,
        paddingX: 1,
        display: "flex",
        width: isDesktop ? 300 : "100%",
        borderRadius: "4px",
        border:
          settings.themeMode === "dark"
            ? "1px solid rgba(255, 255, 255, 0.23)"
            : "1px solid rgba(0, 0, 0, 0.23)",
        backgroundColor: "background.default",
      }}
      onChange={(evt) => setKeywords(evt.target.value)}
    />
  );

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!isDesktop && !isOpen && (
          <IconButtonAnimate onClick={handleOpen}>
            <Iconify icon={"eva:search-fill"} width={20} height={20} />
          </IconButtonAnimate>
        )}
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {isDesktop ? (
            SearchInput
          ) : (
            <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
              <SearchbarStyle>{SearchInput}</SearchbarStyle>
            </Slide>
          )}
        </FormProvider>
      </div>
    </ClickAwayListener>
  );
}
