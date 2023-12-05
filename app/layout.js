import './globals.css';

import Sidebar from "./components/layout/sidebar";
import { DarkModeContextProvider } from './context/darkModeContext';



export const metadata = {
  title: 'Invoice App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <DarkModeContextProvider>

          <div className="grid grid-cols-[1fr] lg:grid-cols-[103px,1fr]">

            <Sidebar />

            {children}

          </div>

        </DarkModeContextProvider>

      </body>
    </html>
  )
}
