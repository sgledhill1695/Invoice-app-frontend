'use client'

import { useState, createContext, useEffect } from "react";

export const DarkModeContext = createContext(false);

export function DarkModeContextProvider({children}){

    const [darkModeActive, setDarkModeActive] = useState(false);

    //Effect to check if user has dark mode active in local storage
    useEffect(() => {

        if(localStorage.getItem('Dark Mode Active')){

            setDarkModeActive(true);

        } else {

            setDarkModeActive(false);
        }

    },[]);



    return(
        
        <DarkModeContext.Provider value={{darkModeActive, setDarkModeActive}}>

            {children}

        </DarkModeContext.Provider>
    )
}