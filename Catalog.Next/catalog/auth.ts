
import NextAuth, { User } from 'next-auth';
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
      
      async authorize(credentials :  Partial<Record<string, unknown>>, request: Request) : Promise<User | null> {
        // ...
        // let pCred : ICredentialsPost = credentials;
        // console.log(credentials);
        try {
          const user = await new UserRepository().getUser(credentials.email as string, credentials.password as string);
          console.log("got user:", user);
          
          return user ? { id: user.EMail ?? "" } : null;
        } catch(e) { console.log("e", e);}

        return null;
      },
    }),    
  ],
});