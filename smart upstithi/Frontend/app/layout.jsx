import React from 'react'

export default function  RootLayout({children}) {
  return (
   <html lang="en">
        <body className={inter.className}>
            {children}
            
        </body>
   </html>
  )
}

