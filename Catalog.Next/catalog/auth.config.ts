// import NextAuth, { NextAuthConfig } from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';
// import UserRepository from './lib/userrepository';
 
// export const authConfig = {
//   pages: {
//     signIn: '/login',
//   },
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
        
//       const isLoggedIn = !!auth?.user;
//       console.log("Checking state for page: ", nextUrl.pathname);
//       const isOnLogin = nextUrl.pathname.startsWith('/login');
//       const isApi = nextUrl.pathname.startsWith("/api");
//       if(isApi) { console.log("is api!"); return true; } 
//       if (isOnLogin && isLoggedIn == false) { return true; } //always allow login
//       if(isOnLogin && isLoggedIn) { return Response.redirect(new URL('/', nextUrl)); }
//       //TODO: CALLBACK IS NOT WORKING CORRECTLY YET
//       return isLoggedIn; // conditional
//     },
//   },
//   providers: [], // Add providers with an empty array for now
// } satisfies NextAuthConfig;