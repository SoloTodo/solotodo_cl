import {
  Autocomplete,
  Box,
  Button,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Product } from "src/frontend-utils/types/product";
import CloseIcon from "@mui/icons-material/Close";
import { useAppSelector } from "src/store/hooks";
import {
  selectApiResourceObjects,
  useApiResourceObjects,
} from "src/frontend-utils/redux/api_resources/apiResources";
import { FormProvider, RHFRadioGroup, RHFTextField } from "../hook-form";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import RHFRating from "../hook-form/RHFRating";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { fData } from "src/utils/formatNumber";
import Iconify from "../Iconify";
import { useRef } from "react";

type FormValuesProps = {
  was_product_received: string;
  store_comments: string;
  store: { label: string; value: number };
  store_rating: string;
  email_or_phone: string;
  purchase_proof: File | null | undefined;
};

export default function ProductNewCommentDrawer({
  product,
  onClose,
}: {
  product: Product;
  onClose: VoidFunction;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { enqueueSnackbar } = useSnackbar();
  const apiResourceObjects = useAppSelector(useApiResourceObjects);
  const storeChoices = selectApiResourceObjects(apiResourceObjects, "stores");

  const defaultValues = {
    was_product_received: "",
    store_comments: "",
    store: storeChoices[0],
    store_rating: "",
    email_or_phone: "",
    purchase_proof: null,
  };

  const MAX_FILE_SIZE = 2 * 1000 * 1000; // 2 Mb

  const FormSchema = Yup.object().shape({
    was_product_received: Yup.string().required(
      "Por favor selecciona si recibiste el producto o no"
    ),
    store_comments: Yup.string(),
    store_rating: Yup.string().required(
      "Por favor ingrese el numero de estrellas (1 a 5) del producto"
    ),
    email_or_phone: Yup.string().required(
      "Por favor ingrese un correo o teléfono de contacto."
    ),
    purchase_proof: Yup.mixed().test(
      "fileSize",
      `Archivo tiene que ser menor o igual a ${fData(MAX_FILE_SIZE)}`,
      (value) => (value && value.size <= MAX_FILE_SIZE) || value === null
    ),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = methods;

  const values = watch();

  const onSubmit = (data: FormValuesProps) => {
    console.log(data);
    enqueueSnackbar("¡Comentario recibido con éxito!");
    reset();
  };

  const handleClickAttachPhoto = () => {
    fileInputRef.current?.click();
  };

  return (
    <Stack spacing={3} width={400} padding={2}>
      <IconButton style={{ alignSelf: "end" }} onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <Typography variant="h5" fontWeight={600}>
        {product.name}
      </Typography>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h5" paddingTop={1}>
          ¿Recibiste el producto?
        </Typography>
        <RHFRadioGroup
          name="was_product_received"
          options={["1", "0"]}
          getOptionLabel={["Sí, lo recibí", "No, no lo he recibido"]}
          sx={{
            "& .MuiFormControlLabel-root": { mr: 4 },
            justifyContent: "center",
          }}
        />
        <Typography variant="h5" paddingTop={2}>
          Tienda
        </Typography>
        <Controller
          name="store"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              disableClearable
              freeSolo
              onChange={(event, newValue) => field.onChange(newValue)}
              options={storeChoices.map(
                (option: { label: string; value: number }) => option
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.value}>
                  {option.label}
                </li>
              )}
              renderInput={(params) => <TextField {...params} />}
            />
          )}
        />
        <Typography variant="h5" paddingTop={2}>
          Evaluación de la tienda
        </Typography>
        <RHFRating name="store_rating" />
        <Typography variant="h5" paddingTop={2}>
          Comentarios de la tienda
        </Typography>
        <RHFTextField
          name="store_comments"
          label=""
          placeholder="Comentarios de la tienda"
        />
        <Typography variant="h5" paddingTop={2}>
          E-mail o teléfono de contacto
        </Typography>
        <RHFTextField
          name="email_or_phone"
          label=""
          placeholder="tucorreo@dominio.com o +569 XXXXXXXX"
        />
        <Typography variant="h5" paddingTop={2}>
          Archivos de confirmación
        </Typography>
        <div>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Button
              color="warning"
              variant="contained"
              onClick={handleClickAttachPhoto}
              startIcon={<Iconify icon={"eva:cloud-upload-fill"} />}
              sx={{ borderRadius: 10 }}
            >
              Buscar archivo
            </Button>

            <div>
              {values.purchase_proof?.name && (
                <Typography variant="subtitle2">
                  {values.purchase_proof.name}
                </Typography>
              )}
              {values.purchase_proof?.size && (
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {fData(values.purchase_proof.size)}
                </Typography>
              )}
            </div>

            <input
              {...register("purchase_proof")}
              ref={fileInputRef}
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setValue("purchase_proof", file);
              }}
              style={{ display: "none" }}
            />
          </Stack>

          {errors.purchase_proof && (
            <FormHelperText sx={{ px: 2, display: "block" }} error>
              {errors.purchase_proof.message}
            </FormHelperText>
          )}
        </div>
        <Box textAlign="center" paddingTop={5}>
          <LoadingButton
            type="submit"
            variant="contained"
            size="large"
            loading={isSubmitting}
            sx={{ borderRadius: 10, width: "100%" }}
          >
            Enviar
          </LoadingButton>
        </Box>
      </FormProvider>
    </Stack>
  );
}
