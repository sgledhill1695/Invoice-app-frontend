export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET() {

    const res = await fetch(process.env.BACKEND_API + '/invoices', {
        headers:{
            'Content-Type': 'application/json'
        },
    })

    const data = await res.json();

    return Response.json({data});

}