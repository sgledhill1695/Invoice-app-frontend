import { useEffect } from "react";
import { formatDate, calcPaymentDueDate } from "../components/functions/functions";

export default function useViewInvoice( invoice, setInvoice, reRender, setReRender, params, setFetchError){

    useEffect(() => {

        const fetchInvoice = async () => {
            try {
                const res = await fetch('/api/invoices/view/' + params.id);

                if (res.status === 200) {

                    const invoice = await res.json();

                    //Calc payment due date and add formatted creation date and due date to object.
                    const paymentDueDate = calcPaymentDueDate(invoice.data.dateCreated, invoice.data.paymentTerms)
                    invoice.data.invoiceCreationDateFormatted = formatDate(invoice.data.dateCreated);
                    invoice.data.invoicePaymentDueDateFormatted = formatDate(paymentDueDate);
                    setInvoice(invoice.data);

                } else {
                    setFetchError(true);
                }

            } catch (err) {
                setFetchError(true);
            }
        }

        fetchInvoice();
        setReRender(false);

    }, [reRender]);
}