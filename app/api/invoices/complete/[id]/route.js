export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET(request, { params }) {

    const id = params.id;

    const res = await fetch(process.env.BACKEND_API + '/invoices/complete/' + id, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            status: 'paid'
        })
    });

    if(res.status === 200){

        const invoice = await res.json();

        return Response.json({
            status: 200,
            data: invoice 
        });

    } else if (res.status === 500){

        return Response.json({
            status: 500,
            error: 'Internal Server Error'
        })
    }



};