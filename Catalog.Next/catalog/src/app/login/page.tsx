'use client';
import { Avatar, Button, Checkbox, Container, CssBaseline, FormControl, FormControlLabel, Input, Box, InputLabel, Paper, Typography, ThemeProvider, createTheme, withStyles } from "@mui/material";
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from "../../../lib/actions";
import "./login.css"
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const defaultTheme = createTheme();

export default function LoginPage() {
  const [state, dispatch] = useFormState(authenticate, undefined);

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form action={dispatch}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input id="email" name="email" autoComplete="email" autoFocus />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input name="password" type="password" id="password" autoComplete="current-password" />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Sign in
              </Button>
            </form>
          </Box>

          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {state === 'CredentialsSignin' && (
              <>
                {/* <ExclamationCircleIcon className="h-5 w-5 text-red-500" /> */}
                <p className="text-sm text-red-500">Invalid credentials</p>
              </>
            )}
          </div>
        </Container>
      </ThemeProvider>
    </>
  );
}
