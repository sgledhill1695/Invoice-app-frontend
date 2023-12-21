"use client"
import { useContext, useState, useEffect } from "react";
import { DarkModeContext } from "@/app/context/darkModeContext";

import MainWrapper from "@/app/components/mainWrapper";
import GoBack from "./goBack";
import ViewHeader from "./viewHeader";
import ViewInvoice from "./viewInvoice";

//Router

export default function Page({params}){


    //Context
    const {darkModeActive} = useContext(DarkModeContext);

    //State
    const [invoice, setInvoice] = useState({});


    useEffect(() => {

        const fetchInvoice = async () => {
            try{
                const res = await fetch('/api/invoices/view/' + params.id);
                if(res.status === 200){

                    const invoice = await res.json();
                    console.log(invoice)
                    setInvoice(invoice.data);

                } else {

                    alert('error');

                }
            } catch(err){

                console.log(err);

            }
        }
        fetchInvoice();

    },[])




    return(
        <MainWrapper>

            <GoBack darkModeActive={darkModeActive}/>

            <ViewHeader 
                invoice={invoice}
                darkModeActive={darkModeActive}
            />

            <ViewInvoice
                darkModeActive={darkModeActive}
                invoice={invoice}
            />

        </MainWrapper>            
    )
}