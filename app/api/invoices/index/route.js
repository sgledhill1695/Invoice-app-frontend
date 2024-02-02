export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET(request) {

    try {

        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get('page');
        const pageSize = searchParams.get('pageSize');
        const filters = searchParams.get('filters');




        const res = await fetch(process.env.BACKEND_API + '/invoices/' + page + '/' + pageSize + '/' + filters, {
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const data = await res.json();

        return Response.json({ data });



    } catch(err) {
        console.log(err);
    }


}