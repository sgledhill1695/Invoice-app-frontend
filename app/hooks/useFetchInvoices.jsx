import { useState, useEffect } from "react";
import {formatDate, calcPaymentDueDate} from "../components/functions/functions";

export default function useFetchInvoices(filters, reRender, setReRender, invoices, setInvoices, setLoading, setCurrentPage, setAllInvoicesRetrieved, setRetrievedInvoices, setTotalPages, setFetchError){

    useEffect(() => {

        //Each render reset the page to 1
        setCurrentPage(1);
        setAllInvoicesRetrieved(false);

        //Function to fetch first 8 invoices without any filters active
        const fetchInvoices = async () => {

            try {

                const res = await fetch(`/api/invoices/all?page=1&pageSize=8`);

                if (res.status === 200) {

                    const retrievedInvoices = await res.json();

                    retrievedInvoices.data.invoices.forEach(invoice => {
                        const paymentDueDate = calcPaymentDueDate(invoice.dateCreated, invoice.paymentTerms)
                        invoice.invoiceCreationDateFormatted = formatDate(invoice.dateCreated);
                        invoice.invoicePaymentDueDateFormatted = formatDate(paymentDueDate);
                    });

                    setInvoices(retrievedInvoices.data.invoices);
                    setRetrievedInvoices(retrievedInvoices.data.invoices);
                    setTotalPages(retrievedInvoices.data.totalPages);
                    setLoading(false)

                } else {
                    setFetchError(true);
                }

            } catch (err) {
                setFetchError(true);
            }
        };

        //If user has a filter active this function will run instead to fetch selected filters
        const fetchFilteredInvoices = async () => {

            try {

                const filterResponse = await fetch(`/api/invoices/all?page=1&pageSize=8&filters=${filters.join(',')}`);
                const filteredInvoices = await filterResponse.json();

                filteredInvoices.data.invoices.forEach(invoice => {
                    const paymentDueDate = calcPaymentDueDate(invoice.dateCreated, invoice.paymentTerms)
                    invoice.invoiceCreationDateFormatted = formatDate(invoice.dateCreated);
                    invoice.invoicePaymentDueDateFormatted = formatDate(paymentDueDate);
                });

                setInvoices(filteredInvoices.data.invoices);
                setRetrievedInvoices(filteredInvoices.data.invoices);
                setTotalPages(filteredInvoices.data.totalPages);
                setLoading(false)

            } catch (err) {
                setPaginateLoading(false);
                setFetchError(true);
            }
        };

        //Decide which fetch function to run
        if (filters.length > 0) {
            fetchFilteredInvoices();
        } else {
            fetchInvoices();
        }

        setReRender(false);
    
    }, [filters, reRender]);

};

