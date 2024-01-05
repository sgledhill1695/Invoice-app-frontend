"use client"
import { useContext, useState, useEffect } from "react";
import { DarkModeContext } from "@/app/context/darkModeContext";
import { useRouter } from 'next/navigation'
import { SuccessNotificationContext } from "@/app/context/notificationContext";
import { ErrorNotificationContext } from "@/app/context/notificationContext";

import MainWrapper from "@/app/components/mainWrapper";
import GoBack from "./goBack";
import ViewHeader from "./viewHeader";
import ViewInvoice from "./viewInvoice";
import DeleteModal from "@/app/deleteModal";
import SuccessNotification from "@/app/components/lib/successNotification";
import ErrorNotification from "@/app/components/lib/errorNotification";

export default function Page({params}){


    //Context
    const {darkModeActive} = useContext(DarkModeContext);
    const {setShowSuccess} = useContext(SuccessNotificationContext);
    const {setShowError} = useContext(ErrorNotificationContext);


    //State
    const [invoice, setInvoice] = useState({});
    const [modalOpen, setModalOpen] = useState(false);

    //Router
    const router = useRouter();

    //Fetch requested invoice
    useEffect(() => {

        const fetchInvoice = async () => {
            try{
                const res = await fetch('/api/invoices/view/' + params.id);
                if(res.status === 200){

                    const invoice = await res.json();
                    setInvoice(invoice.data);

                } else {

                    alert('error');

                }
            } catch(err){

                console.log(err);

            }
        }
        fetchInvoice();

    },[]);

    const handleOpenEdit = () => { 
        alert('open edit');
    };
    
    const handleDeleteModal = (invoice) => {
        setModalOpen(true)
    };

    //Handle user deleting an invoice
    const onDelete = async (id) => {

        const res = await fetch('/api/invoices/delete', {
            method: 'POST',
            body: JSON.stringify({
                id: id
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if(res.status === 200){

            setShowSuccess({
                displayed: true,
                message: 'Invoice successfully deleted'
            });
            router.push('/');

        } else if(res.status === 500){

            setShowError({
                displayed: true,
                message: 'Unable to delete invoice'
            });
            router.push('/');


        }
        


        

        
    }; 

    const onMarkAsPaid = async (id) => {

        try{

            const res = await fetch(`/api/invoices/complete/${id}`);

            if(res.status === 500){

                setShowError({
                    displayed: true,
                    message: 'Unable to mark invoice as paid.'
                });

                return;
            } else if(res.status === 200) {

                const data = await res.json();
            }

        } catch(err) {

            setShowError({
                displayed: true,
                message: 'Unable to mark invoice as paid.'
            });

        }

    
    }


    return(
        <>
            <MainWrapper>

                <GoBack darkModeActive={darkModeActive} />

                <ViewHeader
                    invoice={invoice}
                    darkModeActive={darkModeActive}
                    handleDeleteModal={handleDeleteModal}
                    onMarkAsPaid={onMarkAsPaid}
                />

                <ViewInvoice
                    darkModeActive={darkModeActive}
                    invoice={invoice}
                    handleDeleteModal={handleDeleteModal}
                    onDelete={onDelete}
                />

                <DeleteModal
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                    invoice={invoice}
                    darkModeActive={darkModeActive}
                    onDelete={onDelete}
                />

                <SuccessNotification/>
                <ErrorNotification/>

            </MainWrapper>   
        </>
    )
}