'use server'

import { signIn } from '../auth';
 
// ...
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  console.log("whoop!");
  try {
    console.log("do auth", formData)
    await signIn('credentials', Object.fromEntries(formData));
  } catch (error) {
    if ((error as Error).message.includes('CredentialsSignin')) {
      console.log("Invalid cred from actions")
      return 'CredentialsSignin';
    }
    throw error;
  }
}