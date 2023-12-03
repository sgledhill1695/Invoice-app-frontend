import './globals.css';

import Sidebar from "./components/layout/sidebar";
import { DarkModeContextProvider } from './components/context/darkModeContext';



export const metadata = {
  title: 'Invoice App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <DarkModeContextProvider>

          <div className="flex">

            <Sidebar />

            {children}

          </div>

        </DarkModeContextProvider>

      </body>
    </html>
  )
}
