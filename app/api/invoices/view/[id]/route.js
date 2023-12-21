export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET(request, { params }) {

    const id = params.id
    const response = await fetch(process.env.BACKEND_API + '/invoices/' + id )
    const invoice = await response.json();
    
    if(response.status === 200){

        return Response.json(
            { 
                status: 200,
                data: invoice 
            });

    } else {

        return Response.json(
            {
                status: 500,
                error: 'Unable to retrieve invoice'
            }
        );

    }


}