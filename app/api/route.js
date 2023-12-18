export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET() {

    const res = await fetch('http://localhost:5000/invoices', {
        headers:{
            'Content-Type': 'application/json'
        },
    })

    const data = await res.json()

    return Response.json({data});

}