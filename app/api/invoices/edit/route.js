export const dynamic = 'force-dynamic' // defaults to force-static

export async function POST(request) {

    const invoiceToUpdate = await request.json();

    const invoiceToSend = {
        billFromStreet_address: invoiceToUpdate.streetAddress,
        billFromCity: invoiceToUpdate.city,
        billFromPostCode: invoiceToUpdate.postCode,
        billFromCountry: invoiceToUpdate.country,
        billToName: invoiceToUpdate.clientsName,
        billToEmail: invoiceToUpdate.clientsEmail,
        billToStreetAddress: invoiceToUpdate.clientStreet,
        billToCity: invoiceToUpdate.clientCity,
        billToPostcode: invoiceToUpdate.clientPostCode,
        billToCountry: invoiceToUpdate.clientCountry,
        productDescription: invoiceToUpdate.productDescription
    };

    const res = await fetch(process.env.BACKEND_API + '/invoices/' + invoiceToUpdate.id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify(invoiceToSend)
    });

    if (res.status === 200) {

        const invoice = await res.json();

        return Response.json({
            status: 200,
            data: invoice
        });

    } else if (res.status === 500) {

        return Response.json({
            status: 500,
            error: 'Internal Server Error'
        });

    }

}


