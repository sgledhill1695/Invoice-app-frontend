export const formatDate = (date) => {
    const dateToFormat = new Date(date);
    const formattedDate = dateToFormat.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    return formattedDate;
};

export const calcPaymentDueDate = (creationDate, paymentTerms) => {
    const invoiceCreationDate = new Date(creationDate);
    return invoiceCreationDate.setDate(invoiceCreationDate.getDate() + paymentTerms);
};

