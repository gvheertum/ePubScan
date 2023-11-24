'use client';

import { Avatar, Button, Checkbox, CssBaseline, FormControl, FormControlLabel, Input, InputLabel, Paper, Typography, withStyles } from "@mui/material";
import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from "../../../lib/actions";
import "./login.css"

export default function LoginPage() {
  const [state, dispatch] = useFormState(authenticate, undefined);

  console.log("loading login!");
    return (
      <main>
    
      <Paper className="paper-login" >
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
      </Paper>

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
    </main>
    );
  }
