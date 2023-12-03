'use client'

import { useState, createContext } from "react";

export const DarkModeContext = createContext(false);

export function DarkModeContextProvider({children}){

    const [darkModeActive, setDarkModeActive] = useState(false);

    return(
        
        <DarkModeContext.Provider value={{darkModeActive, setDarkModeActive}}>

            {children}

        </DarkModeContext.Provider>
    )
}