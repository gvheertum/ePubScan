
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import UserRepository from './lib/userrepository';

interface ICredentialsPost {
  email : string,
  password : string
}

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // ...
        // let pCred : ICredentialsPost = credentials;
        // console.log(credentials);
        try {
          const user = await new UserRepository().getUser(credentials.email, credentials.password);
          console.log("got user:", user);
          return user;
        } catch(e) { console.log("e", e);}
      },
    }),    
  ],
});