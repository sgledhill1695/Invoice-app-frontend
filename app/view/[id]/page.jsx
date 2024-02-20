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
import EditInvoice from "./editInvoice";
import FetchError from "@/app/components/lib/fetchError";
import useViewInvoice from "@/app/hooks/useViewInvoice";


export default function Page({params}){

    //Context
    const {darkModeActive} = useContext(DarkModeContext);
    const {setShowSuccess} = useContext(SuccessNotificationContext);
    const {setShowError} = useContext(ErrorNotificationContext);

    //State
    const [reRender, setReRender] = useState(false); //State to force component to rerender and make an api call
    const [invoice, setInvoice] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [openEditInvoice, setOpenEditInvoice] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    //Router
    const router = useRouter();

    useViewInvoice(invoice, setInvoice, reRender, setReRender, params, setFetchError);
    
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

                setReRender(true);

            }

        } catch(err) {

            setShowError({
                displayed: true,
                message: 'Unable to mark invoice as paid.'
            });

        }

    
    };

    return(
        <>
            <MainWrapper>

                {fetchError ? (
                    <>
                        <FetchError
                            setFetchError={setFetchError}
                            darkModeActive={darkModeActive}
                            setReRender={setReRender}
                        />
                    
                    </>

                ) : (
                    <>
                        <GoBack darkModeActive = { darkModeActive } />

                        <ViewHeader
                            invoice={invoice}
                            darkModeActive={darkModeActive}
                            handleDeleteModal={handleDeleteModal}
                            onMarkAsPaid={onMarkAsPaid}
                            setOpenEditInvoice={setOpenEditInvoice}
                        />
        
                        <ViewInvoice
                            darkModeActive={darkModeActive}
                            invoice={invoice}
                            handleDeleteModal={handleDeleteModal}
                            onDelete={onDelete}
                            onMarkAsPaid={onMarkAsPaid}
                            setOpenEditInvoice={setOpenEditInvoice}
                        />
        
                        <DeleteModal
                            modalOpen={modalOpen}
                            setModalOpen={setModalOpen}
                            invoice={invoice}
                            darkModeActive={darkModeActive}
                            onDelete={onDelete}
                        />
        
                        <EditInvoice
                            openEditInvoice={openEditInvoice}
                            setOpenEditInvoice={setOpenEditInvoice}
                            invoice={invoice}
                            params={params}
                            setReRender={setReRender}
                            setShowSuccess={setShowSuccess}
                            setShowError={setShowError}
                        />
        
                        <SuccessNotification />
                        <ErrorNotification />
                    </>
                )}


            </MainWrapper>   
        </>
    )
}