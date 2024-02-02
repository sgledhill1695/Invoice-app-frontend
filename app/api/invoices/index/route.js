export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET(request) {


        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get('page');
        const pageSize = searchParams.get('pageSize');
        const filters = searchParams.get('filters');


    const res = await fetch(process.env.BACKEND_API + '/invoices/' + page + '/' + pageSize + '/' + filters, {
        headers: {
            'Content-Type': 'application/json'
        },
    });


    if (res.status === 200) {

        const data = await res.json();

        return Response.json(
            {
                status: 200,
                data: data
            });

    } else {

        return Response.json(
            {
                status: 500,
                error: 'Unable to retrieve invoices'
            }
        );

    }

}