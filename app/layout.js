
import './globals.css';

import Sidebar from "./components/layout/sidebar";
import { DarkModeContextProvider } from './context/darkModeContext';
import { NotificationContextProvider } from './context/notificationContext';

export const metadata = {
  title: 'Invoice App',
}

export default function RootLayout({ children }) {
  return (

    <DarkModeContextProvider>

      <html lang="en">
        <body>

            <NotificationContextProvider>

              <div className="grid grid-cols-[1fr] lg:grid-cols-[103px,1fr]">

                <Sidebar />

                {children}

                <Analytics />
                
              </div>

            </NotificationContextProvider>

        </body>
      </html>
    </DarkModeContextProvider>

  )
}
