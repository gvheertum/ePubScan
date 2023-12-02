import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import { signOut } from '../../auth';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BookCatalog',
  description: 'Bookcatalog - ePub and book catalog system',
  icons: 
    [
      {
        rel: 'apple-touch-icon',
        type: 'image/png',
        sizes: '180x180',
        url: '/favicons/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicons/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicons/favicon-16x16.png',
      },
      {
        rel: 'manifest',
        url: '/favicons/site.webmanifest',
      },
    ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>  
        {children}
        </body>
    </html>
  )
}
