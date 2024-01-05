'use client'

import { useState, createContext, useEffect } from "react";

export const SuccessNotificationContext = createContext({
    displayed: false,
    message: ''
});

export const ErrorNotificationContext = createContext({
    displayed: false,
    message: ''
});





export function NotificationContextProvider({children}){

    const [showSuccess, setShowSuccess] = useState({
        displayed: false,
        message: ''
    });

    const [showError, setShowError] = useState({
        displayed: false,
        message: ''
    });

    //Unmount notification after 5 seconds
    useEffect(() => {

        if(showSuccess.displayed === true){
            setTimeout(() => {
                setShowSuccess({
                    displayed: false,
                    message: ''
                })
            }, 4000)

        } else if(showError.displayed === true){

            setTimeout(() => {
                setShowError({
                    displayed: false,
                    message: ''
                })
            }, 4000)

        }
    }, [showSuccess, showError]);

    return(

        <SuccessNotificationContext.Provider value={{showSuccess, setShowSuccess}}>
            <ErrorNotificationContext.Provider value={{showError, setShowError}}>

                {children}

            </ErrorNotificationContext.Provider>
        </SuccessNotificationContext.Provider>
    )
}