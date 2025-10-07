import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Conway's Game of Life",
  description: 'A cellular automaton simulation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
