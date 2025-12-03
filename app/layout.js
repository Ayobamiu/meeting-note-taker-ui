import './globals.css'

export const metadata = {
  title: 'Meeting Note Taker',
  description: 'Automatically join Google Meet meetings and generate notes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

