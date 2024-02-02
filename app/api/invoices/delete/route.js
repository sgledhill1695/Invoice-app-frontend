export async function POST(request){

    try{

        const req = await request.json();

        const res = await fetch(process.env.BACKEND_API + '/invoices/' + req.id , {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if(res.status === 200){

            const data = await res.json();
            return Response.json({
                invoice: data,
                status: 200
                });

        } else if(res.status === 500){

            return Response.json({
                error: 'Internal server error',
                status: 500
            });

        }


    } catch(err){

        return Response.json({
            error: 'Internal server error',
            status: 500
        });
        
    }    

}