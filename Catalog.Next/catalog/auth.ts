
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import UserRepository from './lib/userrepository';



export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // ...
        console.log(credentials);
 
        //new UserRepository().getUser(credentials)
        //   const { email, password } = credentials.data;
        //   const user = await getUser(email);
        //   if (!user) return null;
        //   const passwordsMatch = await bcrypt.compare(password, user.password);
 
        //   if (passwordsMatch) return user;
        
 
        console.log('Invalid credentials');
        return null;
      },
    }),    
  ],
});