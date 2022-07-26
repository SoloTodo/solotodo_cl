import React, { useState } from "react";
// next
import NextLink from "next/link";
// @mui
import { styled } from "@mui/material/styles";
import { Box, Button, Container, Typography } from "@mui/material";
// routes
import { PATH_AUTH } from "../../routes/paths";
// components
import Page from "../../components/Page";
// sections
import { ResetPasswordForm } from "../../sections/auth/reset-password";
// assets
import { SentIcon } from "../../assets";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: 480,
  margin: "auto",
  padding: theme.spacing(5, 0),
  border: "1px solid #EFEFEF",
  borderRadius: 10,
}));

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <Page title="Reset Password" sx={{ height: 1 }}>
      <RootStyle>
        <Container>
          <Box sx={{ maxWidth: 480, mx: "auto", textAlign: "center" }}>
            {!sent ? (
              <>
                <Typography variant="h3" paragraph>
                  Olvidaste tu contraseña?
                </Typography>
                <Typography sx={{ color: "text.secondary", mb: 5 }}>
                  Por favor ingresar el email asociado a tu cuenta y te
                  enviaremos un link para restablecer tu contraseña.
                </Typography>

                <ResetPasswordForm
                  onSent={() => setSent(true)}
                  onGetEmail={(value) => setEmail(value)}
                />

                <NextLink href={PATH_AUTH.login} passHref>
                  <Button fullWidth size="large" sx={{ mt: 1 }}>
                    Volver
                  </Button>
                </NextLink>
              </>
            ) : (
              <Box>
                <SentIcon sx={{ mb: 5, mx: "auto", height: 160 }} />

                <Typography variant="h3" gutterBottom>
                  Email enviado exitosamente
                </Typography>
                <Typography>
                  Hemos enviado un email de confirmación a &nbsp;
                  <strong>{email}</strong>
                  <br />
                  Por favor revisa tu email.
                </Typography>

                <NextLink href={PATH_AUTH.login} passHref>
                  <Button size="large" variant="contained" sx={{ mt: 5 }}>
                    Volver
                  </Button>
                </NextLink>
              </Box>
            )}
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
