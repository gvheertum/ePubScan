import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { signOut } from '../../auth';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BookCatalog',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }} 
            href='/'
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BookCatalog
          </Typography>
        </Toolbar>
       {/* Hide if no session */}
        <form
           action={async () => {
            'use server';
            await signOut();
          }}
        >
          <input type="submit" value="logout" />
        </form>
      </AppBar>
    </Box>
        
        {children}
        </body>
    </html>
  )
}
